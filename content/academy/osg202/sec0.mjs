/**
 * OSG202 · Mục 0 — bốn bài ⭐ nền (bắt đầu tại đây, học thế nào, cài môi trường Linux, buổi đầu tiên).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── ⭐ Start here (1/2) — What an operating system is, its dated history, and why a backend developer cannot skip it ───────── */
const L_x_bat_dau_tai_day = {
  title: '⭐ Start here (1/2) — What an operating system is, its dated history, and why a backend developer cannot skip it|||⭐ Bắt đầu tại đây (1/2) — Hệ điều hành là gì, lịch sử có mốc năm, và vì sao dev backend không thể bỏ qua nó',
  slug: 'osg202-bat-dau-tai-day',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng tự thêm ngoài giáo trình: hệ điều hành là gì qua ví dụ nhà hàng và qua một chương trình C một dòng mà strace cho thấy phải xin hệ điều hành hàng chục lần, lịch sử có mốc năm từ UNIX 1969 tới Linux, Android và Windows NT, năm sự cố backend chạy thật trên Linux (hai luồng cộng sai, Too many open files, bị OOM-kill mã 137, JVM và Node có bao nhiêu luồng) kèm sự cố thật của chính web này, cách học môn không nản và cách các bài trên web vận hành.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here (1/2) · added by this site</span>
<h2>Before the slides: what an operating system is, and why it is worth your effort</h2>
<p class="lead">OSG202 is the course that explains the program that runs <em>under</em> every other program. You have used operating systems for years (Windows on your laptop, Android or iOS on your phone) without ever needing to think about them. This lesson shows, with real programs run on Linux, that the moment you write a <strong>backend</strong> — a Spring Boot API, a Node.js server, a PostgreSQL database in Docker — the operating system stops being invisible: threads race, files run out, memory runs out, and the error messages speak OS language.</p>
<table>
<thead><tr><th>Part</th><th>What you get</th></tr></thead>
<tbody>
<tr><td>1</td><td>what an OS is — one everyday picture and one real program</td></tr>
<tr><td>2</td><td>a short history with years you can trust: UNIX → Linux → Android, and Windows NT</td></tr>
<tr><td>3</td><td>five real backend problems, run for real on Linux, each tied to the chapter that explains it</td></tr>
<tr><td>4</td><td>how to study this course without giving up</td></tr>
<tr><td>5</td><td>how the lessons on this site work (icons, real outputs, computed pictures)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây (1/2) · phần web tự thêm</span>
<h2>Trước khi vào slide: hệ điều hành là gì, và vì sao đáng bỏ công</h2>
<p class="lead">OSG202 là môn giải thích chương trình chạy <em>bên dưới</em> mọi chương trình khác. Bạn đã dùng hệ điều hành (HĐH — operating system, OS) nhiều năm — Windows trên laptop, Android hay iOS trên điện thoại — mà chưa bao giờ phải nghĩ tới nó. Bài này cho thấy, bằng chương trình chạy thật trên Linux, rằng ngay khi bạn viết <strong>backend</strong> — một API Spring Boot, một server Node.js, một cơ sở dữ liệu PostgreSQL trong Docker — HĐH không còn vô hình nữa: các luồng giẫm chân nhau, tệp mở bị hết, bộ nhớ bị hết, và thông báo lỗi nói bằng ngôn ngữ của HĐH.</p>
<table>
<thead><tr><th>Phần</th><th>Bạn nhận được</th></tr></thead>
<tbody>
<tr><td>1</td><td>HĐH là gì — một hình ảnh đời thường và một chương trình thật</td></tr>
<tr><td>2</td><td>lịch sử ngắn với mốc năm tin được: UNIX → Linux → Android, và Windows NT</td></tr>
<tr><td>3</td><td>năm sự cố backend có thật, chạy thật trên Linux, mỗi cái gắn với chương giải thích nó</td></tr>
<tr><td>4</td><td>học môn này thế nào để không nản</td></tr>
<tr><td>5</td><td>các bài trên web này vận hành ra sao (biểu tượng, output thật, hình do máy tính)</td></tr>
</tbody>
</table>`),
    bi(`<h2>1. What an operating system is — a restaurant, then a real program</h2>
<p>Picture a busy restaurant. The <strong>customers</strong> are your programs: each wants a table, some food, a bill. The <strong>kitchen, tables, fridge and staff</strong> are the hardware: CPU, memory (RAM), disk, network card. Nobody lets customers walk into the kitchen and grab the stove — there is a <strong>manager</strong> who gives each customer a table (memory), decides whose order is cooked next (CPU time), keeps the pantry organised (files on disk), and stops one customer from eating another's food (protection). Customers talk to the manager only through a fixed <strong>menu</strong> of requests. In a computer, the manager is the <strong>operating system kernel</strong>, and the menu is the list of <strong>system calls</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/79f59d871a5cbf4d7e85b14c6fcb185c70794b48.svg" alt="The layers you will meet all semester: programs ask through system calls, the kernel decides, the hardware does the work and answers with interrupts" loading="lazy" /><p class="chu-thich">🧩 The layers you will meet all semester: programs ask through system calls, the kernel decides, the hardware does the work and answers with interrupts</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Who talks to whom: programs ask, the kernel decides, the hardware does
skinparam rectangle {
  BackgroundColor #FFFFFF
}
rectangle "Your programs (user mode)\\nweb browser · Spring Boot · node server.js · psql" as App #EEF2FF
rectangle "C library / runtime\\nglibc · JVM · Node + libuv" as Lib #F8FAFC
rectangle "Operating system kernel (kernel mode)\\nprocesses · memory · files · devices · network · security" as K #ECFDF5
rectangle "Hardware\\nCPU cores · RAM · SSD/disk · network card · keyboard/screen" as HW #E5E7EB
App -down-&gt; Lib : printf(), new Thread(), fs.readFile()
Lib -down-&gt; K : system calls\\nwrite() · clone() · openat() · mmap()
K -down-&gt; HW : instructions, device registers, DMA
HW -up-&gt; K : interrupts\\n(key pressed, disk done, packet arrived)
@enduml</code></pre></details>
<p>That is not a metaphor you have to trust. Below is the smallest C program there is — it prints one line. We ran it under <code>strace</code>, a Linux tool that lists every system call a program makes, and counted them by name:</p>
<pre><code class="language-c">// The smallest C program — yet it cannot print one line without asking the OS
#include &lt;stdio.h&gt;

int main(void) {
    printf("Xin chao, he dieu hanh!\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread xin-chao.c -o xin-chao &amp;&amp; strace ./xin-chao 2&gt;&amp;1 &gt;/dev/null | sed 's/(.*//' | sort | uniq -c | sort -rn<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 mmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 mprotect<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 newfstatat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 munmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 brk<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 openat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 close<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 write<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 set_tid_address<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 set_robust_list<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 rseq<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 read<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 prlimit64<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ioctl<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 getrandom<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 faccessat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 exit_group<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 execve<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 +++ exited with 0 +++</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>One <code>printf</code> became one <code>write</code> — but before that, starting the program needed <code>execve</code> (load the program), <code>mmap</code>/<code>mprotect</code>/<code>brk</code> (get memory), <code>openat</code>/<code>read</code>/<code>close</code> (load the C library from disk), and at the end <code>exit_group</code> (tell the OS "I am done"). Every one of those is a request to the kernel. Your program cannot draw a pixel, read a byte from disk or send a network packet by itself — it can only <em>ask</em>.</p>
<p class="meo">🧠 Two jobs, one sentence each (Tanenbaum's slides 4–5 in Chapter 1): the OS is an <strong>extended machine</strong> — it hides ugly hardware behind clean abstractions (a "file" instead of disk sectors) — and a <strong>resource manager</strong> — it shares the CPU, memory and devices fairly and safely between programs.</p>`,
    `<h2>1. Hệ điều hành là gì — một nhà hàng, rồi một chương trình thật</h2>
<p>Hãy hình dung một nhà hàng đông khách. <strong>Khách</strong> là các chương trình của bạn: ai cũng muốn một bàn, ít đồ ăn, một hoá đơn. <strong>Bếp, bàn, tủ lạnh và nhân viên</strong> là phần cứng: CPU, bộ nhớ (RAM), ổ đĩa, card mạng. Không ai cho khách đi thẳng vào bếp cầm bếp lò — có một <strong>quản lý</strong> xếp bàn cho từng khách (cấp bộ nhớ), quyết định món của ai được nấu trước (chia thời gian CPU), giữ kho gọn gàng (tệp trên đĩa), và chặn khách này ăn phần của khách kia (bảo vệ). Khách chỉ nói chuyện với quản lý qua một <strong>thực đơn</strong> yêu cầu cố định. Trong máy tính, người quản lý là <strong>nhân hệ điều hành (kernel)</strong>, còn thực đơn là danh sách <strong>lời gọi hệ thống (system call)</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/79f59d871a5cbf4d7e85b14c6fcb185c70794b48.svg" alt="Các tầng bạn sẽ gặp suốt học kỳ: chương trình xin qua lời gọi hệ thống, nhân quyết định, phần cứng làm việc và báo lại bằng ngắt" loading="lazy" /><p class="chu-thich">🧩 Các tầng bạn sẽ gặp suốt học kỳ: chương trình xin qua lời gọi hệ thống, nhân quyết định, phần cứng làm việc và báo lại bằng ngắt</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Ai nói với ai: chương trình xin, nhân quyết định, phần cứng làm
skinparam rectangle {
  BackgroundColor #FFFFFF
}
rectangle "Your programs (user mode)\\nweb browser · Spring Boot · node server.js · psql" as App #EEF2FF
rectangle "C library / runtime\\nglibc · JVM · Node + libuv" as Lib #F8FAFC
rectangle "Operating system kernel (kernel mode)\\nprocesses · memory · files · devices · network · security" as K #ECFDF5
rectangle "Hardware\\nCPU cores · RAM · SSD/disk · network card · keyboard/screen" as HW #E5E7EB
App -down-&gt; Lib : printf(), new Thread(), fs.readFile()
Lib -down-&gt; K : system calls\\nwrite() · clone() · openat() · mmap()
K -down-&gt; HW : instructions, device registers, DMA
HW -up-&gt; K : interrupts\\n(key pressed, disk done, packet arrived)
@enduml</code></pre></details>
<p>Đây không phải hình ảnh bạn phải tin suông. Dưới đây là chương trình C nhỏ nhất có thể — in đúng một dòng. Ta chạy nó dưới <code>strace</code>, công cụ Linux liệt kê mọi lời gọi hệ thống một chương trình thực hiện, rồi đếm theo tên:</p>
<pre><code class="language-c">// Chương trình C nhỏ nhất — vậy mà không tự in nổi một dòng nếu không nhờ HĐH
#include &lt;stdio.h&gt;

int main(void) {
    printf("Xin chao, he dieu hanh!\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread xin-chao.c -o xin-chao &amp;&amp; strace ./xin-chao 2&gt;&amp;1 &gt;/dev/null | sed 's/(.*//' | sort | uniq -c | sort -rn<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 mmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 mprotect<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 newfstatat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 munmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 brk<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 openat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 close<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 write<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 set_tid_address<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 set_robust_list<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 rseq<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 read<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 prlimit64<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ioctl<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 getrandom<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 faccessat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 exit_group<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 execve<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 +++ exited with 0 +++</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Một lệnh <code>printf</code> thành đúng một <code>write</code> — nhưng trước đó, chỉ để khởi động chương trình đã cần <code>execve</code> (nạp chương trình), <code>mmap</code>/<code>mprotect</code>/<code>brk</code> (xin bộ nhớ), <code>openat</code>/<code>read</code>/<code>close</code> (đọc thư viện C từ đĩa), và cuối cùng <code>exit_group</code> (báo HĐH "tôi xong rồi"). Mỗi dòng là một yêu cầu gửi nhân. Chương trình của bạn không tự vẽ nổi một điểm ảnh, đọc nổi một byte trên đĩa hay gửi nổi một gói tin mạng — nó chỉ có thể <em>xin</em>.</p>
<p class="meo">🧠 Hai vai, mỗi vai một câu (slide 4–5 Chương 1 của Tanenbaum): HĐH là <strong>cỗ máy mở rộng (extended machine)</strong> — giấu phần cứng xấu xí sau các trừu tượng gọn gàng (một "tệp" thay cho các sector trên đĩa) — và là <strong>người quản lý tài nguyên (resource manager)</strong> — chia CPU, bộ nhớ, thiết bị cho các chương trình một cách công bằng và an toàn.</p>`),
    bi(`<h2>2. A short history with years you can trust</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/ce61752f5ab56aa1672a8e9c04eaf9da0e48203c.svg" alt="The family tree: almost every system you will touch as a backend developer descends from UNIX or from Linux; Windows NT is a separate line" loading="lazy" /><p class="chu-thich">🧩 The family tree: almost every system you will touch as a backend developer descends from UNIX or from Linux; Windows NT is a separate line</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' The family tree of the systems you will meet
left to right direction
skinparam defaultTextAlignment center
rectangle "UNIX\\n1969 · Bell Labs\\n(Thompson, Ritchie)" as U #FEF9C3
rectangle "UNIX in C\\n1973" as C #FEF9C3
rectangle "BSD\\n1978 · Berkeley" as B #F0F9FF
rectangle "System V\\n(AT&amp;T)" as S #F0F9FF
rectangle "FreeBSD /\\nNetBSD / OpenBSD" as FB #F0F9FF
rectangle "macOS · iOS\\n(Darwin/XNU, 2001)" as M #F0F9FF
rectangle "MINIX\\n1987 · Tanenbaum" as MX #ECFDF5
rectangle "GNU tools\\n1983 · Stallman" as G #ECFDF5
rectangle "Linux kernel\\n1991 · Torvalds" as L #DCFCE7
rectangle "Debian · Ubuntu ·\\nRed Hat · servers ·\\nDocker containers" as D #DCFCE7
rectangle "Android\\n2008" as A #DCFCE7
rectangle "Windows NT\\n1993 · Microsoft\\n(not UNIX)" as W #FEE2E2
rectangle "Windows 10 / 11 /\\nServer (NT kernel)" as W2 #FEE2E2
U --&gt; C
C --&gt; B
C --&gt; S
B --&gt; FB
B --&gt; M
MX ..&gt; L : inspired
G --&gt; D
L --&gt; D
L --&gt; A
W --&gt; W2
@enduml</code></pre></details>
<table>
<thead><tr><th>Year</th><th>Event</th><th>Why it matters to you</th></tr></thead>
<tbody>
<tr><td>1969</td><td>Ken Thompson and Dennis Ritchie write UNIX at Bell Labs</td><td>the ideas of this whole course — processes, files, pipes, a shell — are UNIX ideas</td></tr>
<tr><td>1973</td><td>UNIX is rewritten in the C language</td><td>the first OS that could be moved to new hardware by recompiling; that is why OS examples are in C</td></tr>
<tr><td>1978</td><td>Berkeley releases BSD</td><td>BSD's network code is the ancestor of the sockets your servers use; macOS still carries BSD code</td></tr>
<tr><td>1983</td><td>Richard Stallman starts GNU</td><td><code>gcc</code>, <code>bash</code>, <code>ls</code>, <code>grep</code> — the tools you type every day</td></tr>
<tr><td>1987</td><td>Andrew Tanenbaum publishes MINIX (with a textbook)</td><td>the author of your slides; MINIX is the teaching OS that inspired Linux</td></tr>
<tr><td>1991</td><td>Linus Torvalds announces Linux (25 August, on the comp.os.minix newsgroup)</td><td>Linux kernel + GNU tools = the "Linux" on servers, in Docker, in WSL</td></tr>
<tr><td>1993</td><td>Microsoft ships Windows NT 3.1</td><td>the NT kernel still runs Windows 10/11 and Windows Server (Chapter 11)</td></tr>
<tr><td>2001</td><td>Apple ships Mac OS X, built on Darwin (Mach + BSD)</td><td>why the macOS terminal feels like Linux — but is not Linux</td></tr>
<tr><td>2008</td><td>Android 1.0 ships, on the Linux kernel</td><td>Chapter 10's case study; the phone in your pocket runs a Linux kernel</td></tr>
<tr><td>2017</td><td>every one of the TOP500 supercomputers runs Linux (November list)</td><td>servers, clouds and supercomputers speak Linux</td></tr>
</tbody>
</table>
<p>The containers that run every program on this site report their own kernel when asked — the Linux in this course is not a museum piece:</p>
<pre><code class="language-plaintext">$ uname -srm
Linux 7.0.12-linuxkit aarch64</code></pre>
<p>(That line is real output from the lab container; "linuxkit" is the small Linux virtual machine that Docker Desktop runs on a Mac, "aarch64" is the 64-bit ARM processor of an Apple-silicon Mac. On a Windows laptop with WSL you would see a kernel ending in "microsoft-standard-WSL2" and "x86_64".)</p>
<div class="callout">🧭 <strong>Not on the FE, but you will be asked in interviews:</strong> "What is the difference between Linux and UNIX?" — UNIX is the 1969 family and a trademark (certified systems include macOS); Linux is a kernel written from scratch in 1991 that behaves like UNIX (it follows the POSIX standard) but contains no UNIX code. "Linux" in daily speech means a distribution: the Linux kernel plus GNU tools plus a package manager (Debian, Ubuntu, Red Hat…).</div>`,
    `<h2>2. Lịch sử ngắn với mốc năm tin được</h2>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/ce61752f5ab56aa1672a8e9c04eaf9da0e48203c.svg" alt="Cây gia phả: gần như mọi hệ thống bạn sẽ chạm vào khi làm backend đều là con cháu của UNIX hoặc của Linux; Windows NT là một nhánh riêng" loading="lazy" /><p class="chu-thich">🧩 Cây gia phả: gần như mọi hệ thống bạn sẽ chạm vào khi làm backend đều là con cháu của UNIX hoặc của Linux; Windows NT là một nhánh riêng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Cây gia phả của những hệ điều hành bạn sẽ gặp
left to right direction
skinparam defaultTextAlignment center
rectangle "UNIX\\n1969 · Bell Labs\\n(Thompson, Ritchie)" as U #FEF9C3
rectangle "UNIX in C\\n1973" as C #FEF9C3
rectangle "BSD\\n1978 · Berkeley" as B #F0F9FF
rectangle "System V\\n(AT&amp;T)" as S #F0F9FF
rectangle "FreeBSD /\\nNetBSD / OpenBSD" as FB #F0F9FF
rectangle "macOS · iOS\\n(Darwin/XNU, 2001)" as M #F0F9FF
rectangle "MINIX\\n1987 · Tanenbaum" as MX #ECFDF5
rectangle "GNU tools\\n1983 · Stallman" as G #ECFDF5
rectangle "Linux kernel\\n1991 · Torvalds" as L #DCFCE7
rectangle "Debian · Ubuntu ·\\nRed Hat · servers ·\\nDocker containers" as D #DCFCE7
rectangle "Android\\n2008" as A #DCFCE7
rectangle "Windows NT\\n1993 · Microsoft\\n(not UNIX)" as W #FEE2E2
rectangle "Windows 10 / 11 /\\nServer (NT kernel)" as W2 #FEE2E2
U --&gt; C
C --&gt; B
C --&gt; S
B --&gt; FB
B --&gt; M
MX ..&gt; L : inspired
G --&gt; D
L --&gt; D
L --&gt; A
W --&gt; W2
@enduml</code></pre></details>
<table>
<thead><tr><th>Năm</th><th>Sự kiện</th><th>Vì sao liên quan tới bạn</th></tr></thead>
<tbody>
<tr><td>1969</td><td>Ken Thompson và Dennis Ritchie viết UNIX ở Bell Labs</td><td>ý tưởng của cả môn — tiến trình, tệp, pipe, shell — đều là ý tưởng UNIX</td></tr>
<tr><td>1973</td><td>UNIX được viết lại bằng ngôn ngữ C</td><td>HĐH đầu tiên chuyển được sang phần cứng mới chỉ bằng biên dịch lại; vì thế ví dụ HĐH đều bằng C</td></tr>
<tr><td>1978</td><td>Berkeley phát hành BSD</td><td>mã mạng của BSD là tổ tiên của socket mà server bạn dùng; macOS vẫn mang mã BSD</td></tr>
<tr><td>1983</td><td>Richard Stallman khởi động dự án GNU</td><td><code>gcc</code>, <code>bash</code>, <code>ls</code>, <code>grep</code> — công cụ bạn gõ mỗi ngày</td></tr>
<tr><td>1987</td><td>Andrew Tanenbaum công bố MINIX (kèm một giáo trình)</td><td>tác giả bộ slide của bạn; MINIX là HĐH dạy học đã gợi cảm hứng cho Linux</td></tr>
<tr><td>1991</td><td>Linus Torvalds công bố Linux (25/8, trên nhóm tin comp.os.minix)</td><td>nhân Linux + công cụ GNU = "Linux" trên server, trong Docker, trong WSL</td></tr>
<tr><td>1993</td><td>Microsoft phát hành Windows NT 3.1</td><td>nhân NT vẫn đang chạy Windows 10/11 và Windows Server (Chương 11)</td></tr>
<tr><td>2001</td><td>Apple phát hành Mac OS X, xây trên Darwin (Mach + BSD)</td><td>vì sao terminal macOS giống Linux — nhưng không phải Linux</td></tr>
<tr><td>2008</td><td>Android 1.0 ra đời, chạy trên nhân Linux</td><td>nghiên cứu tình huống của Chương 10; điện thoại trong túi bạn chạy nhân Linux</td></tr>
<tr><td>2017</td><td>toàn bộ 500 siêu máy tính trong TOP500 chạy Linux (danh sách tháng 11)</td><td>server, đám mây và siêu máy tính đều nói tiếng Linux</td></tr>
</tbody>
</table>
<p>Container chạy mọi chương trình trên web này tự khai nhân của nó khi được hỏi — Linux trong môn này không phải đồ cổ:</p>
<pre><code class="language-plaintext">$ uname -srm
Linux 7.0.12-linuxkit aarch64</code></pre>
<p>(Dòng trên là output thật của container lab; "linuxkit" là máy ảo Linux nhỏ mà Docker Desktop chạy trên Mac, "aarch64" là bộ xử lý ARM 64-bit của Mac chip Apple. Trên laptop Windows dùng WSL bạn sẽ thấy nhân có đuôi "microsoft-standard-WSL2" và "x86_64".)</p>
<div class="callout">🧭 <strong>Không có trong FE, nhưng phỏng vấn sẽ hỏi:</strong> "Linux khác UNIX thế nào?" — UNIX là dòng họ từ 1969 và là một nhãn hiệu (hệ thống được chứng nhận gồm cả macOS); Linux là một nhân viết lại từ đầu năm 1991, cư xử giống UNIX (theo chuẩn POSIX) nhưng không chứa dòng mã UNIX nào. "Linux" trong lời nói hằng ngày là một bản phân phối (distribution): nhân Linux + công cụ GNU + trình quản lý gói (Debian, Ubuntu, Red Hat…).</div>`),
    bi(`<h2>3. Why a backend developer cannot skip this course — five problems, run for real</h2>
<p>Each program below was compiled and run inside a Linux container (Debian 12, gcc 12). Read the output first, then the explanation.</p>
<h3>(a) Two threads add 1 to a counter — and lose updates</h3>
<p>A web server handles many requests at once with <strong>threads</strong> (Tomcat in Spring Boot keeps a pool of 200 by default). Two threads that update the same variable without protection lose updates:</p>
<pre><code class="language-c">// Two threads add 1 to the same counter 1,000,000 times each — WITHOUT a lock
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

long counter = 0;                       // shared by both threads
pthread_barrier_t start;                // both threads begin together

void *work(void *arg) {
    pthread_barrier_wait(&amp;start);       // wait for the other thread
    for (int i = 0; i &lt; 1000000; i++)
        counter = counter + 1;          // read - add - write: 3 steps, not 1
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;start, NULL, 2);
    pthread_create(&amp;a, NULL, work, NULL);
    pthread_create(&amp;b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 2000000\\n");
    printf("total    = %ld\\n", counter);
    printf("lost     = %ld updates\\n", 2000000 - counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dem-hai-luong.c -o dem-hai-luong &amp;&amp; ./dem-hai-luong<br>
expected = 2000000<br>
total &nbsp;&nbsp;&nbsp;= 1331150<br>
lost &nbsp;&nbsp;&nbsp;&nbsp;= 668850 updates</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p><code>counter = counter + 1</code> is three machine steps (read, add, write). If both threads read the same old value, one addition is lost. The fix is a <strong>mutex</strong> (a lock) — the total is now always exact:</p>
<pre><code class="language-c">// The same counter, now protected by a mutex
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

long counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *work(void *arg) {
    for (int i = 0; i &lt; 1000000; i++) {
        pthread_mutex_lock(&amp;lock);      // only one thread at a time past this line
        counter = counter + 1;
        pthread_mutex_unlock(&amp;lock);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&amp;a, NULL, work, NULL);
    pthread_create(&amp;b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 2000000\\n");
    printf("total    = %ld\\n", counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dem-co-khoa.c -o dem-co-khoa &amp;&amp; ./dem-co-khoa<br>
expected = 2000000<br>
total &nbsp;&nbsp;&nbsp;= 2000000</div>
<p>This is a <strong>race condition</strong>; Chapter 2 (lessons 2.B) explains why it happens and every tool to stop it. In a real backend the same bug appears as two users buying the last ticket, or a balance that is wrong after two transfers.</p>
<h3>(b) "Too many open files"</h3>
<pre><code class="language-c">// Open the same file again and again without closing it — like a server that forgets close()
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;

int main(void) {
    int n = 0;
    for (;;) {
        int fd = open("/etc/hostname", O_RDONLY);
        if (fd &lt; 0) {
            printf("open #%d failed: errno=%d (%s)\\n", n + 1, errno, strerror(errno));
            break;
        }
        n++;
        if (n &lt;= 3 || n % 20 == 0) printf("open #%d -&gt; fd %d\\n", n, fd);
    }
    printf("this process could hold %d files (+ stdin, stdout, stderr)\\n", n);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--ulimit=nofile=64:64</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread qua-nhieu-tep.c -o qua-nhieu-tep &amp;&amp; ./qua-nhieu-tep<br>
open #1 -&gt; fd 3<br>
open #2 -&gt; fd 4<br>
open #3 -&gt; fd 5<br>
open #20 -&gt; fd 22<br>
open #40 -&gt; fd 42<br>
open #60 -&gt; fd 62<br>
open #62 failed: errno=24 (Too many open files)<br>
this process could hold 61 files (+ stdin, stdout, stderr)</div>
<p>Every open file, socket and database connection costs one <strong>file descriptor</strong> (a small number like 3, 4, 5…), and each process has a limit (here we set it to 64 with <code>ulimit</code>). A server that forgets to close connections dies with exactly this error, <code>EMFILE</code>, usually at 3 a.m. Chapter 1 (system calls) and Chapter 4 (files) explain file descriptors.</p>
<h3>(c) Killed — exit code 137</h3>
<pre><code class="language-c">// Ask for memory 8 MB at a time and really use it, inside a container limited to 64 MB
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);          // print immediately, no buffering
    for (int mb = 8; ; mb += 8) {
        char *p = malloc(8 * 1024 * 1024);
        if (p == NULL) { printf("malloc failed\\n"); return 1; }
        memset(p, 1, 8 * 1024 * 1024);         // touch every byte: now it is REAL memory
        printf("using %d MB\\n", mb);
    }
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=64m --memory-swap=64m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread het-bo-nho.c -o het-bo-nho &amp;&amp; ./het-bo-nho<br>
using 8 MB<br>
using 16 MB<br>
using 24 MB<br>
using 32 MB<br>
using 40 MB<br>
using 48 MB<br>
using 56 MB<br>
Killed<br>
[exit code 137]</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The container was limited to 64 MB. When the program really used more, the kernel's <strong>OOM killer</strong> (out-of-memory) ended it with signal 9 (SIGKILL), and the shell reports exit code 128 + 9 = <strong>137</strong>. This is not a textbook story: in July 2026 the deploy of this very website failed because <code>next build</code> was OOM-killed with exit code 137 on a 6 GB server while two builds ran in parallel — the fix was to build one image at a time. Chapter 3 (memory) explains what "really used" means.</p>
<h3>(d) "Single-threaded" Node.js and a "simple" Java program</h3>
<pre><code class="language-javascript">// "Node.js is single-threaded" — let's count the OS threads of a Node process
const fs = require('fs');
const crypto = require('crypto');

console.log('Hello from Node', process.version);
crypto.pbkdf2Sync('x', 'y', 1, 32, 'sha256');            // warm up the crypto library
const line = fs.readFileSync('/proc/self/status', 'utf8').split('\\n').find((l) =&gt; l.startsWith('Threads:'));
console.log('OS threads in this Node process:', line.replace(/\\D+/g, ''));
console.log('your JavaScript runs on 1 of them (the event loop)');</code></pre>
<div class="out">$ node node-luong.js<br>
Hello from Node v22.23.4<br>
OS threads in this Node process: 7<br>
your JavaScript runs on 1 of them (the event loop)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<pre><code class="language-java">// A Java program that only prints — how many OS threads does its process have?
import java.nio.file.Files;
import java.nio.file.Path;

public class JvmThreads {
    public static void main(String[] args) throws Exception {
        System.out.println("Hello from Java " + Runtime.version().feature());
        String threads = Files.readAllLines(Path.of("/proc/self/status")).stream()
                .filter(l -&gt; l.startsWith("Threads:")).findFirst().orElse("?");
        System.out.println("OS threads in this JVM process: " + threads.replaceAll("\\\\D+", ""));
        System.out.println("CPU cores seen by the JVM: " + Runtime.getRuntime().availableProcessors());
    }
}</code></pre>
<div class="out">$ javac JvmThreads.java &amp;&amp; java JvmThreads<br>
Hello from Java 21<br>
OS threads in this JVM process: 18<br>
CPU cores seen by the JVM: 10</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Your JavaScript runs on one thread, but the Node.js <em>process</em> has several operating-system threads (libuv's worker pool, V8's helpers). A Java program that only prints has many more (garbage collector, JIT compiler…). When you size a thread pool or read <code>top</code> on a server, you are reading Chapter 2.</p>
<h3>(e) Every server is Linux — and every container is a Linux process</h3>
<p>The 137 above happened because Docker asked the Linux kernel to put the program in a <strong>cgroup</strong> with a 64 MB limit. A container is not a small virtual machine: it is an ordinary Linux process with fences around it (namespaces and cgroups). Advanced 1 (virtualization) and the ⭐ Advanced section at the end show this in detail.</p>
<table>
<thead><tr><th>What you see at work</th><th>The OS idea behind it</th><th>Where in this course</th></tr></thead>
<tbody>
<tr><td>wrong totals, deadlocked requests</td><td>race condition, mutex, deadlock</td><td>Ch. 2, Ch. 6</td></tr>
<tr><td>"Too many open files", connection leaks</td><td>file descriptors, system calls</td><td>Ch. 1, Ch. 4</td></tr>
<tr><td>"Killed", exit 137, OOMKilled pods</td><td>virtual memory, OOM killer, cgroups</td><td>Ch. 3, Advanced 1, ⭐</td></tr>
<tr><td>a slow disk, a slow database</td><td>disk scheduling, caching, buffering</td><td>Ch. 5, Ch. 4</td></tr>
<tr><td>thread pools, event loops, <code>top</code></td><td>processes, threads, CPU scheduling</td><td>Ch. 2</td></tr>
<tr><td>"Permission denied" on a server</td><td>users, permissions, protection</td><td>Ch. 1, Ch. 9</td></tr>
</tbody>
</table>`,
    `<h2>3. Vì sao dev backend không thể bỏ môn này — năm sự cố, chạy thật</h2>
<p>Mỗi chương trình dưới đây đều được biên dịch và chạy trong một container Linux (Debian 12, gcc 12). Đọc output trước, rồi mới đọc giải thích.</p>
<h3>(a) Hai luồng cùng cộng 1 vào một biến đếm — và mất bớt</h3>
<p>Một web server phục vụ nhiều yêu cầu cùng lúc bằng các <strong>luồng (thread)</strong> (Tomcat trong Spring Boot mặc định giữ một nhóm 200 luồng). Hai luồng cùng cập nhật một biến mà không được bảo vệ sẽ làm mất lượt cập nhật:</p>
<pre><code class="language-c">// Hai luồng cùng cộng 1 vào một biến đếm, mỗi luồng 1.000.000 lần — KHÔNG khoá
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

long counter = 0;                       // biến dùng chung của hai luồng
pthread_barrier_t start;                // hai luồng xuất phát cùng lúc

void *work(void *arg) {
    pthread_barrier_wait(&amp;start);       // chờ luồng kia sẵn sàng
    for (int i = 0; i &lt; 1000000; i++)
        counter = counter + 1;          // đọc - cộng - ghi: 3 bước chứ không phải 1
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_barrier_init(&amp;start, NULL, 2);
    pthread_create(&amp;a, NULL, work, NULL);
    pthread_create(&amp;b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 2000000\\n");
    printf("total    = %ld\\n", counter);
    printf("lost     = %ld updates\\n", 2000000 - counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dem-hai-luong.c -o dem-hai-luong &amp;&amp; ./dem-hai-luong<br>
expected = 2000000<br>
total &nbsp;&nbsp;&nbsp;= 1331150<br>
lost &nbsp;&nbsp;&nbsp;&nbsp;= 668850 updates</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p><code>counter = counter + 1</code> là ba bước máy (đọc, cộng, ghi). Nếu cả hai luồng cùng đọc một giá trị cũ, một lần cộng bị mất. Cách sửa là một <strong>mutex</strong> (khoá loại trừ) — giờ tổng luôn đúng:</p>
<pre><code class="language-c">// Cùng biến đếm đó, giờ được bảo vệ bằng mutex
#include &lt;stdio.h&gt;
#include &lt;pthread.h&gt;

long counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *work(void *arg) {
    for (int i = 0; i &lt; 1000000; i++) {
        pthread_mutex_lock(&amp;lock);      // mỗi lúc chỉ MỘT luồng qua được dòng này
        counter = counter + 1;
        pthread_mutex_unlock(&amp;lock);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&amp;a, NULL, work, NULL);
    pthread_create(&amp;b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("expected = 2000000\\n");
    printf("total    = %ld\\n", counter);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dem-co-khoa.c -o dem-co-khoa &amp;&amp; ./dem-co-khoa<br>
expected = 2000000<br>
total &nbsp;&nbsp;&nbsp;= 2000000</div>
<p>Đây là <strong>tình trạng tranh chấp (race condition)</strong>; Chương 2 (bài 2.B) giải thích vì sao nó xảy ra và mọi công cụ để chặn nó. Trong backend thật, cùng lỗi này hiện ra thành hai người cùng mua được tấm vé cuối, hay số dư sai sau hai lần chuyển khoản.</p>
<h3>(b) "Too many open files" (mở quá nhiều tệp)</h3>
<pre><code class="language-c">// Mở cùng một tệp mãi mà không đóng — như server quên close()
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;

int main(void) {
    int n = 0;
    for (;;) {
        int fd = open("/etc/hostname", O_RDONLY);
        if (fd &lt; 0) {
            printf("open #%d failed: errno=%d (%s)\\n", n + 1, errno, strerror(errno));
            break;
        }
        n++;
        if (n &lt;= 3 || n % 20 == 0) printf("open #%d -&gt; fd %d\\n", n, fd);
    }
    printf("this process could hold %d files (+ stdin, stdout, stderr)\\n", n);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--ulimit=nofile=64:64</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread qua-nhieu-tep.c -o qua-nhieu-tep &amp;&amp; ./qua-nhieu-tep<br>
open #1 -&gt; fd 3<br>
open #2 -&gt; fd 4<br>
open #3 -&gt; fd 5<br>
open #20 -&gt; fd 22<br>
open #40 -&gt; fd 42<br>
open #60 -&gt; fd 62<br>
open #62 failed: errno=24 (Too many open files)<br>
this process could hold 61 files (+ stdin, stdout, stderr)</div>
<p>Mỗi tệp đang mở, mỗi socket, mỗi kết nối cơ sở dữ liệu tốn một <strong>bộ mô tả tệp (file descriptor)</strong> — một số nhỏ như 3, 4, 5… — và mỗi tiến trình có giới hạn (ở đây ta đặt 64 bằng <code>ulimit</code>). Một server quên đóng kết nối sẽ chết với đúng lỗi này, <code>EMFILE</code>, thường vào lúc 3 giờ sáng. Chương 1 (lời gọi hệ thống) và Chương 4 (tệp) giải thích file descriptor.</p>
<h3>(c) Killed — mã thoát 137</h3>
<pre><code class="language-c">// Xin bộ nhớ mỗi lần 8 MB và dùng thật, trong container bị giới hạn 64 MB
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);          // in ngay, không đệm
    for (int mb = 8; ; mb += 8) {
        char *p = malloc(8 * 1024 * 1024);
        if (p == NULL) { printf("malloc failed\\n"); return 1; }
        memset(p, 1, 8 * 1024 * 1024);         // chạm từng byte: giờ mới là bộ nhớ THẬT
        printf("using %d MB\\n", mb);
    }
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=64m --memory-swap=64m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread het-bo-nho.c -o het-bo-nho &amp;&amp; ./het-bo-nho<br>
using 8 MB<br>
using 16 MB<br>
using 24 MB<br>
using 32 MB<br>
using 40 MB<br>
using 48 MB<br>
using 56 MB<br>
Killed<br>
[exit code 137]</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Container bị giới hạn 64 MB. Khi chương trình thật sự dùng nhiều hơn, <strong>OOM killer</strong> (out-of-memory — trình diệt khi hết bộ nhớ) của nhân kết liễu nó bằng tín hiệu 9 (SIGKILL), và shell báo mã thoát 128 + 9 = <strong>137</strong>. Đây không phải chuyện sách vở: tháng 7/2026 lần deploy của chính web này hỏng vì <code>next build</code> bị OOM-kill với mã 137 trên một server 6 GB khi hai bản build chạy song song — cách sửa là build từng ảnh một. Chương 3 (bộ nhớ) giải thích "thật sự dùng" nghĩa là gì.</p>
<h3>(d) Node.js "đơn luồng" và một chương trình Java "đơn giản"</h3>
<pre><code class="language-javascript">// "Node.js đơn luồng" — thử đếm luồng HĐH của một tiến trình Node
const fs = require('fs');
const crypto = require('crypto');

console.log('Hello from Node', process.version);
crypto.pbkdf2Sync('x', 'y', 1, 32, 'sha256');            // khởi động thư viện mã hoá
const line = fs.readFileSync('/proc/self/status', 'utf8').split('\\n').find((l) =&gt; l.startsWith('Threads:'));
console.log('OS threads in this Node process:', line.replace(/\\D+/g, ''));
console.log('your JavaScript runs on 1 of them (the event loop)');</code></pre>
<div class="out">$ node node-luong.js<br>
Hello from Node v22.23.4<br>
OS threads in this Node process: 7<br>
your JavaScript runs on 1 of them (the event loop)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<pre><code class="language-java">// Chương trình Java chỉ in ra màn hình — tiến trình của nó có bao nhiêu luồng HĐH?
import java.nio.file.Files;
import java.nio.file.Path;

public class JvmThreads {
    public static void main(String[] args) throws Exception {
        System.out.println("Hello from Java " + Runtime.version().feature());
        String threads = Files.readAllLines(Path.of("/proc/self/status")).stream()
                .filter(l -&gt; l.startsWith("Threads:")).findFirst().orElse("?");
        System.out.println("OS threads in this JVM process: " + threads.replaceAll("\\\\D+", ""));
        System.out.println("CPU cores seen by the JVM: " + Runtime.getRuntime().availableProcessors());
    }
}</code></pre>
<div class="out">$ javac JvmThreads.java &amp;&amp; java JvmThreads<br>
Hello from Java 21<br>
OS threads in this JVM process: 18<br>
CPU cores seen by the JVM: 10</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Mã JavaScript của bạn chạy trên một luồng, nhưng <em>tiến trình</em> Node.js có nhiều luồng HĐH (nhóm luồng của libuv, luồng phụ của V8). Một chương trình Java chỉ in ra màn hình còn có nhiều hơn hẳn (bộ thu gom rác, trình biên dịch JIT…). Khi bạn chọn kích thước thread pool hay đọc <code>top</code> trên server, bạn đang đọc Chương 2.</p>
<h3>(e) Server nào cũng là Linux — và container nào cũng là một tiến trình Linux</h3>
<p>Mã 137 ở trên xảy ra vì Docker nhờ nhân Linux đặt chương trình vào một <strong>cgroup</strong> giới hạn 64 MB. Container không phải máy ảo tí hon: nó là một tiến trình Linux bình thường được rào lại (namespace và cgroup). Nâng cao 1 (ảo hoá) và phần ⭐ Chuyên sâu cuối môn cho thấy chi tiết.</p>
<table>
<thead><tr><th>Bạn gặp ở chỗ làm</th><th>Ý tưởng HĐH đứng sau</th><th>Học ở đâu trong môn</th></tr></thead>
<tbody>
<tr><td>tổng sai, request bị treo chờ nhau</td><td>tranh chấp, mutex, bế tắc</td><td>Ch. 2, Ch. 6</td></tr>
<tr><td>"Too many open files", rò rỉ kết nối</td><td>file descriptor, lời gọi hệ thống</td><td>Ch. 1, Ch. 4</td></tr>
<tr><td>"Killed", exit 137, pod bị OOMKilled</td><td>bộ nhớ ảo, OOM killer, cgroup</td><td>Ch. 3, Nâng cao 1, ⭐</td></tr>
<tr><td>đĩa chậm, cơ sở dữ liệu chậm</td><td>lập lịch đĩa, bộ đệm, cache</td><td>Ch. 5, Ch. 4</td></tr>
<tr><td>thread pool, event loop, <code>top</code></td><td>tiến trình, luồng, lập lịch CPU</td><td>Ch. 2</td></tr>
<tr><td>"Permission denied" trên server</td><td>người dùng, quyền, bảo vệ</td><td>Ch. 1, Ch. 9</td></tr>
</tbody>
</table>`),
    bi(`<h2>4. How to study OSG202 without giving up</h2>
<ol>
<li><strong>One idea = one command or one program.</strong> Read about processes, then run <code>ps</code>; read about files, then run <code>ls -i</code>. Every lesson here gives you the command and its real output — type it yourself in your own Linux (lesson "Setting up Linux").</li>
<li><strong>Draw it.</strong> OS ideas are pictures: a process tree, a Gantt chart, a page table. If you cannot draw it, you do not understand it yet.</li>
<li><strong>Calculate by hand, then check with the simulator.</strong> The FE has calculation questions (scheduling, page replacement, disk scheduling, the Banker's algorithm). Do them on paper; every lesson has a simulator that computes the true answer — and the question bank sometimes has a wrong key (lesson "How to study" shows one).</li>
<li><strong>Learn the English terms on purpose.</strong> The FE is in English. Each chapter's 🧪 lesson has a glossary table; cover the right columns and test yourself.</li>
<li><strong>Little and often.</strong> Thirty minutes a day beats five hours before the exam: the 10-question quiz at the end of each chapter is made for that.</li>
<li><strong>Do not memorise slide wording.</strong> Memorise the <em>why</em>: "multiprogramming exists because the CPU was idle while waiting for I/O" answers ten different FE questions.</li>
</ol>
<p class="pitfall">⚠️ Honest warning: Chapters 1–6 carry the whole Final Exam (LO1–LO6, 40%) and both Progress Tests; Chapters 7, 10 and 11 are the presentation topics; the Linux labs need you at a keyboard. Do not spend a week on Chapter 8 before you can draw a process state diagram.</p>`,
    `<h2>4. Học OSG202 thế nào để không nản</h2>
<ol>
<li><strong>Một ý = một lệnh hoặc một chương trình.</strong> Đọc về tiến trình, rồi chạy <code>ps</code>; đọc về tệp, rồi chạy <code>ls -i</code>. Bài nào ở đây cũng cho bạn lệnh và output thật — hãy tự gõ trong Linux của bạn (bài "Cài môi trường Linux").</li>
<li><strong>Vẽ ra.</strong> Ý tưởng HĐH là hình vẽ: cây tiến trình, biểu đồ Gantt, bảng trang. Chưa vẽ được nghĩa là chưa hiểu.</li>
<li><strong>Tính tay trước, rồi đối chiếu bộ mô phỏng.</strong> FE có câu tính toán (lập lịch, thay trang, lập lịch đĩa, thuật toán Nhà băng). Làm trên giấy; bài nào cũng có bộ mô phỏng tính ra đáp án đúng — và ngân hàng đề đôi khi có đáp án SAI (bài "Học thế nào" chỉ ra một câu).</li>
<li><strong>Học thuật ngữ tiếng Anh có chủ đích.</strong> FE bằng tiếng Anh. Bài 🧪 của mỗi chương có bảng thuật ngữ; che hai cột bên phải rồi tự kiểm tra.</li>
<li><strong>Ít mà đều.</strong> Ba mươi phút mỗi ngày hơn năm giờ trước hôm thi: quiz 10 câu cuối mỗi chương làm ra cho việc đó.</li>
<li><strong>Đừng học thuộc chữ trên slide.</strong> Hãy nhớ <em>vì sao</em>: "đa chương trình sinh ra vì CPU ngồi không trong lúc chờ I/O" trả lời được cả chục câu FE khác nhau.</li>
</ol>
<p class="pitfall">⚠️ Nói thật: Chương 1–6 gánh toàn bộ bài thi cuối kỳ (LO1–LO6, 40%) và cả hai Progress Test; Chương 7, 10, 11 là chủ đề thuyết trình; lab Linux đòi bạn ngồi gõ phím. Đừng mất một tuần cho Chương 8 khi còn chưa vẽ được sơ đồ trạng thái tiến trình.</p>`),
    bi(`<h2>5. How the lessons on this site work</h2>
<ul>
<li><strong>📑 Slide by slide</strong> — every slide of the class decks (Tanenbaum &amp; Bos, <em>Modern Operating Systems</em>, 4th ed.) is shown exactly as in class. Each starts with 🎯 the key idea, then a plain explanation; the slides are mostly a title and a figure, so the figure is explained in full and anything beyond the slide is marked <strong>➕</strong>. 🧠 marks a memory tip, ⚠️ an exam trap, 🧭 a link to real backend work.</li>
<li><strong>Real outputs.</strong> Every terminal session and every C, Java or Node program was run in a Linux container. Where the result changes from run to run (thread races, process numbers, timings) the lesson says so with 🎲 and states the property that always holds.</li>
<li><strong>🧮 Computed pictures.</strong> Gantt charts, page-frame tables, disk-head paths are drawn by a simulator that actually runs the algorithm — open "see the simulator code" under the picture.</li>
<li><strong>🧪 Practice + glossary + summary</strong> at the end of each chapter, then a <strong>quiz</strong> with an explanation for every answer.</li>
<li><strong>⭐ lessons</strong> (like this one) are added by the site, outside the syllabus.</li>
</ul>
<p>Next: "⭐ Start here (2/2) — How to study OSG202", then "Setting up Linux" and your first hands-on session.</p>`,
    `<h2>5. Các bài trên web này vận hành thế nào</h2>
<ul>
<li><strong>📑 Học theo từng slide</strong> — mọi slide của bộ slide trên lớp (Tanenbaum &amp; Bos, <em>Modern Operating Systems</em>, bản 4) được giữ nguyên như trên lớp. Mỗi slide mở đầu bằng 🎯 ý chính, rồi giải thích dễ hiểu; slide phần lớn chỉ có tiêu đề và một hình, nên hình được giảng trọn vẹn và phần nào vượt ra ngoài slide được đánh dấu <strong>➕</strong>. 🧠 là mẹo nhớ, ⚠️ là bẫy thi, 🧭 là nối sang công việc backend thật.</li>
<li><strong>Output thật.</strong> Mọi phiên terminal và mọi chương trình C, Java, Node đều chạy trong một container Linux. Chỗ kết quả đổi theo từng lần chạy (tranh chấp luồng, số hiệu tiến trình, thời gian) bài ghi rõ bằng 🎲 và nêu tính chất luôn đúng.</li>
<li><strong>🧮 Hình do máy tính.</strong> Biểu đồ Gantt, bảng khung trang, đường đi của đầu từ đều do bộ mô phỏng thật sự chạy thuật toán vẽ ra — mở "xem mã mô phỏng" dưới hình.</li>
<li><strong>🧪 Thực hành + thuật ngữ + tóm tắt</strong> ở cuối mỗi chương, rồi <strong>quiz</strong> có giải thích cho từng đáp án.</li>
<li><strong>Bài ⭐</strong> (như bài này) do web tự thêm, ngoài đề cương.</li>
</ul>
<p>Tiếp theo: "⭐ Bắt đầu tại đây (2/2) — Học OSG202 thế nào", rồi "Cài môi trường Linux" và buổi thực hành đầu tiên.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ Start here (2/2) — How to study OSG202: where the marks are, the 60-session map, the FE question types, a weekly rhythm ───────── */
const L_x_hoc_the_nao = {
  title: '⭐ Start here (2/2) — How to study OSG202: where the marks are, the 60-session map, the FE question types, a weekly rhythm|||⭐ Bắt đầu tại đây (2/2) — Học OSG202 thế nào: điểm nằm ở đâu, bản đồ 60 buổi, các dạng câu FE, nhịp mỗi tuần',
  slug: 'osg202-hoc-the-nao',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài định hướng tự thêm: cấu trúc điểm theo đề cương FLM 13166 (4 bài Lab 20%, thuyết trình 20%, 2 Progress Test 20%, thi cuối 60 phút 40% với ngưỡng 4 điểm, cột nào cũng phải lớn hơn 0, dự ít nhất 80% buổi), bản đồ 60 buổi ↔ chương sách ↔ section trên web, thứ tự học, các dạng câu trong 29 đề FE thật của Exam Room kèm hai câu tính toán giải bằng bộ mô phỏng (một câu mà chính đề gốc in thiếu dữ liệu), nhịp học mỗi tuần và cách dùng AI cho có ích.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Start here (2/2) · added by this site</span>
<h2>How to study OSG202 — from the official syllabus, not from rumours</h2>
<p class="lead">Everything below is read from the FLM syllabus of OSG202 (syllabus ID 13166, decision 932/QĐ-ĐHFPT of 22 August 2025) and from the 29 real FE papers in the Exam Room. Read it once now and again before each exam.</p>`,
    `<span class="eyebrow">Mục 0 · ⭐ Bắt đầu tại đây (2/2) · phần web tự thêm</span>
<h2>Học OSG202 thế nào — theo đề cương chính thức, không theo lời đồn</h2>
<p class="lead">Mọi thứ dưới đây đọc từ đề cương FLM của OSG202 (syllabus ID 13166, quyết định 932/QĐ-ĐHFPT ngày 22/8/2025) và từ 29 đề FE thật trong Exam Room. Đọc một lần bây giờ, và đọc lại trước mỗi kỳ thi.</p>`),
    bi(`<h2>1. Where the marks are</h2>
<table>
<thead><tr><th>Part</th><th>Weight</th><th>How</th><th>When (session)</th><th>Pass condition</th></tr></thead>
<tbody>
<tr><td>Lab (4 labs)</td><td>20%</td><td>practical exercises on Linux: commands, shell scripts, C on Linux (LO7–LO10)</td><td>guided in sessions 10, 14, 31, 37 · reviewed later</td><td>more than 0</td></tr>
<tr><td>Presentation (1)</td><td>20%</td><td>about 20 minutes per group; LO11 (using AI tools such as ChatGPT, Copilot, Gamma — listed in the syllabus tools) is assessed here (LO1–LO6, LO11)</td><td>topic chosen in session 27 (Chapter 7, 10 or 11) · presented in sessions 55–59</td><td>more than 0</td></tr>
<tr><td>Progress tests (2)</td><td>20%</td><td>multiple choice, 10–30 minutes (LO1–LO6)</td><td>session 32 (PT1) and session 53 (PT2)</td><td>more than 0</td></tr>
<tr><td>Final exam</td><td>40%</td><td>multiple choice, 60 minutes, auto-graded (LO1–LO6)</td><td>end of term</td><td>at least 4/10</td></tr>
</tbody>
</table>
<p>Three gates, not one: attend at least <strong>80%</strong> of sessions to be allowed into the final exam; every on-going part must be <strong>greater than 0</strong> (missing one lab presentation day or one progress test fails the course by itself); and the final exam must be <strong>at least 4</strong> while the weighted average is at least <strong>5</strong>. Credits: 3; study time 150 hours = 45 contact hours + 1 exam hour + 104 hours of self-study — about 7 hours a week of your own work.</p>
<p class="pitfall">⚠️ The FE and both progress tests examine only LO1–LO6 = Chapters 1–6 of the book. The labs examine Linux skills (LO7–LO10). The presentation examines one of Chapters 7, 10, 11 plus LO11 (using AI tools to explore OS concepts).</p>`,
    `<h2>1. Điểm nằm ở đâu</h2>
<table>
<thead><tr><th>Phần</th><th>Trọng số</th><th>Hình thức</th><th>Khi nào (buổi)</th><th>Điều kiện</th></tr></thead>
<tbody>
<tr><td>Lab (4 bài)</td><td>20%</td><td>bài thực hành trên Linux: lệnh, shell script, C trên Linux (LO7–LO10)</td><td>hướng dẫn ở buổi 10, 14, 31, 37 · chữa sau đó</td><td>lớn hơn 0</td></tr>
<tr><td>Thuyết trình (1)</td><td>20%</td><td>khoảng 20 phút mỗi nhóm; LO11 (dùng công cụ AI như ChatGPT, Copilot, Gamma — có trong mục công cụ của đề cương) được chấm ở đây (LO1–LO6, LO11)</td><td>chọn đề ở buổi 27 (Chương 7, 10 hoặc 11) · trình bày buổi 55–59</td><td>lớn hơn 0</td></tr>
<tr><td>Progress test (2)</td><td>20%</td><td>trắc nghiệm, 10–30 phút (LO1–LO6)</td><td>buổi 32 (PT1) và buổi 53 (PT2)</td><td>lớn hơn 0</td></tr>
<tr><td>Thi cuối kỳ</td><td>40%</td><td>trắc nghiệm, 60 phút, máy chấm (LO1–LO6)</td><td>cuối kỳ</td><td>ít nhất 4/10</td></tr>
</tbody>
</table>
<p>Ba cửa chứ không phải một: dự ít nhất <strong>80%</strong> số buổi mới được thi cuối kỳ; mọi phần on-going phải <strong>lớn hơn 0</strong> (vắng một buổi lab có chấm, một buổi thuyết trình hay một progress test là tự nó đánh trượt môn); và thi cuối phải <strong>ít nhất 4</strong> trong khi trung bình có trọng số ít nhất <strong>5</strong>. Tín chỉ: 3; thời lượng 150 giờ = 45 giờ trên lớp + 1 giờ thi + 104 giờ tự học — khoảng 7 giờ tự làm mỗi tuần.</p>
<p class="pitfall">⚠️ FE và cả hai progress test chỉ thi LO1–LO6 = Chương 1–6 của sách. Lab thi kỹ năng Linux (LO7–LO10). Thuyết trình thi một trong Chương 7, 10, 11 cộng LO11 (dùng công cụ AI để tìm hiểu thêm khái niệm HĐH).</p>`),
    bi(`<h2>2. The 60 sessions, mapped to this site</h2>
<table>
<thead><tr><th>Sessions</th><th>Syllabus topic</th><th>On this site</th></tr></thead>
<tbody>
<tr><td>1–4, 7–9</td><td>Chapter 1: what an OS is, history, hardware review, OS zoo, concepts, system calls, structure; Chapter 1 problems</td><td>Chapter 1 (1.A, 1.B, 🧪 1.C, quiz)</td></tr>
<tr><td>5–6</td><td>overview of Linux and Linux commands; short practice</td><td>Section 0 "Setting up Linux", "First hands-on session"; Chapter 7 (web) — Linux &amp; the Shell</td></tr>
<tr><td>10, 13–14</td><td>guiding and reviewing Lab 1, Lab 2</td><td>Chapter 7 (web) labs</td></tr>
<tr><td>11–18, 22</td><td>Chapter 2: processes, threads, IPC, scheduling (with the MARIE simulator), classical IPC problems</td><td>Chapter 2 (2.A–2.C)</td></tr>
<tr><td>19–21</td><td>shell programming and practice</td><td>Chapter 7 (web)</td></tr>
<tr><td>23–31</td><td>Chapter 3: memory, virtual memory, page replacement, design issues, segmentation; Lab 3</td><td>Chapter 3 (3.A, 3.B)</td></tr>
<tr><td>27</td><td>choosing the presentation topic: Chapter 7, 10 or 11</td><td>Advanced 1 · Chapter 10 · Chapter 11</td></tr>
<tr><td>32–33</td><td>Progress Test 1 and review</td><td>Progress Test 1</td></tr>
<tr><td>34–40</td><td>Chapter 4: files, directories, implementation, management, examples; C programming in Linux; Lab 4</td><td>Chapter 4 (4.A, 4.B) · Chapter 7 (web)</td></tr>
<tr><td>41–48</td><td>Chapter 5: I/O hardware and software, disks, clocks, user interfaces (+ thin clients, power management)</td><td>Chapter 5 (5.A, 5.B)</td></tr>
<tr><td>49–52</td><td>Chapter 6: resources, deadlock detection, avoidance, prevention</td><td>Chapter 6 (6.A)</td></tr>
<tr><td>53–54</td><td>Progress Test 2 and review</td><td>Progress Test 2</td></tr>
<tr><td>55–59</td><td>presentations on Chapters 7, 10, 11</td><td>Advanced 1 · Chapter 10 · Chapter 11</td></tr>
<tr><td>60</td><td>current research areas, course review</td><td>Final Exam section</td></tr>
</tbody>
</table>
<p>Chapters 8 (multiple processors), 9 (security) and 12 (OS design) have decks on FLM but <strong>no session</strong> in the syllabus. They are on this site for understanding, interviews and the presentation — read them after Chapters 1–6 are solid.</p>
<p class="meo">🧠 The <strong>MARIE simulator</strong> named in the syllabus tools is a tiny teaching computer (one accumulator, a few instructions) used in class to watch the fetch–decode–execute cycle and interrupts step by step. You will not write MARIE code in the FE; the scheduling and memory ideas are what is tested.</p>`,
    `<h2>2. Sáu mươi buổi, đối chiếu với web này</h2>
<table>
<thead><tr><th>Buổi</th><th>Chủ đề trong đề cương</th><th>Trên web này</th></tr></thead>
<tbody>
<tr><td>1–4, 7–9</td><td>Chương 1: HĐH là gì, lịch sử, ôn phần cứng, vườn thú HĐH, khái niệm, lời gọi hệ thống, cấu trúc; bài tập Chương 1</td><td>Chương 1 (1.A, 1.B, 🧪 1.C, quiz)</td></tr>
<tr><td>5–6</td><td>tổng quan Linux và các lệnh Linux; thực hành ngắn</td><td>Mục 0 "Cài môi trường Linux", "Buổi thực hành đầu tiên"; Chương 7 (web) — Linux &amp; Shell</td></tr>
<tr><td>10, 13–14</td><td>hướng dẫn và chữa Lab 1, Lab 2</td><td>lab ở Chương 7 (web)</td></tr>
<tr><td>11–18, 22</td><td>Chương 2: tiến trình, luồng, IPC, lập lịch (có trình mô phỏng MARIE), các bài toán IPC kinh điển</td><td>Chương 2 (2.A–2.C)</td></tr>
<tr><td>19–21</td><td>lập trình shell và thực hành</td><td>Chương 7 (web)</td></tr>
<tr><td>23–31</td><td>Chương 3: bộ nhớ, bộ nhớ ảo, thay trang, vấn đề thiết kế, phân đoạn; Lab 3</td><td>Chương 3 (3.A, 3.B)</td></tr>
<tr><td>27</td><td>chọn đề thuyết trình: Chương 7, 10 hoặc 11</td><td>Nâng cao 1 · Chương 10 · Chương 11</td></tr>
<tr><td>32–33</td><td>Progress Test 1 và chữa</td><td>Progress Test 1</td></tr>
<tr><td>34–40</td><td>Chương 4: tệp, thư mục, cài đặt, quản lý, ví dụ; lập trình C trên Linux; Lab 4</td><td>Chương 4 (4.A, 4.B) · Chương 7 (web)</td></tr>
<tr><td>41–48</td><td>Chương 5: phần cứng và phần mềm I/O, đĩa, đồng hồ, giao diện người dùng (+ thin client, quản lý điện năng)</td><td>Chương 5 (5.A, 5.B)</td></tr>
<tr><td>49–52</td><td>Chương 6: tài nguyên, phát hiện, tránh, ngăn bế tắc</td><td>Chương 6 (6.A)</td></tr>
<tr><td>53–54</td><td>Progress Test 2 và chữa</td><td>Progress Test 2</td></tr>
<tr><td>55–59</td><td>thuyết trình Chương 7, 10, 11</td><td>Nâng cao 1 · Chương 10 · Chương 11</td></tr>
<tr><td>60</td><td>các hướng nghiên cứu hiện nay, ôn tập môn</td><td>section Thi cuối kỳ</td></tr>
</tbody>
</table>
<p>Chương 8 (nhiều bộ xử lý), 9 (bảo mật) và 12 (thiết kế HĐH) có deck trên FLM nhưng <strong>không có buổi nào</strong> trong đề cương. Chúng có trên web để hiểu sâu, phỏng vấn và làm thuyết trình — đọc sau khi Chương 1–6 đã vững.</p>
<p class="meo">🧠 <strong>Trình mô phỏng MARIE</strong> nêu trong mục công cụ của đề cương là một máy tính dạy học tí hon (một thanh ghi tích luỹ, vài lệnh) dùng trên lớp để xem từng bước chu trình nạp–giải mã–thực thi và ngắt. FE không bắt viết mã MARIE; thứ được thi là ý tưởng lập lịch và bộ nhớ.</p>`),
    bi(`<h2>3. What the FE really asks — read from 29 real papers</h2>
<p>Open the Exam Room: <a href="/exam?course=OSG202">OSG202 papers</a>. The newest are FE1 (SU26-RE), FE2 (SP26-RE) and FE3 (SP26-FE). Every question is multiple choice, in English, and falls into one of four types:</p>
<table>
<thead><tr><th>Type</th><th>Real example (paraphrased)</th><th>How to prepare</th></tr></thead>
<tbody>
<tr><td>definition</td><td>"Time to move the arm to the proper cylinder is called?" — seek time</td><td>the 🗂 glossary of each chapter; the 🎯 line of each slide</td></tr>
<tr><td>which mechanism / which algorithm</td><td>"Which page-replacement algorithm can have MORE faults with MORE frames?" — FIFO (Belady's anomaly)</td><td>the 🧠 tips and ⚠️ traps in each lesson</td></tr>
<tr><td>system calls and commands</td><td>"In UNIX, which call moves the file pointer?" — lseek</td><td>Chapter 1 system-call tables (lesson 1.B) and the Linux labs</td></tr>
<tr><td>calculation</td><td>page faults for a reference string; total head movement for a disk algorithm; a safe sequence with the Banker's algorithm; average waiting time</td><td>do it on paper, then check with the simulator in the lesson</td></tr>
</tbody>
</table>
<h3>A calculation question, solved by the simulator</h3>
<p>FE3 (SP26-FE), question 17: <em>"If FIFO page replacement is used with four page frames, how many page faults occur with the reference string 0172327103 if the frames are initially empty?"</em> The simulator runs FIFO on exactly that string:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d95cbb94c44c4d78c8fc059ea0813d8e34eb5b10.svg" alt="FE3 question 17 — FIFO with 4 frames on 0,1,7,2,3,2,7,1,0,3: computed by the simulator" loading="lazy" /><p class="chu-thich">🧮 FE3 question 17 — FIFO with 4 frames on 0,1,7,2,3,2,7,1,0,3: computed by the simulator</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe8: { ref: [1, 3, 0, 3, 5, 6], khung: 3 },
  fe8du: { ref: [1, 3, 0, 3, 5, 6, 3], khung: 3 },
};</code></pre></details>
<p>Six faults — the key says 6, correct. The first four are unavoidable (empty frames); the only replacements are 3 (evicting 0, the oldest) and 0 (evicting 1).</p>
<h3>And one where the paper itself is wrong</h3>
<p>FE8 (FA24-RE), question 20 — the original scanned image reads: <em>"…three page frames… reference string 1, 3, 0, 3, 5, 6, (if the three frames are initially empty)?"</em> with options 6, 4, 7, 3 and key 6. Run it exactly as printed:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/add4430a90e3987a87b026d248fcc8f352f8368e.svg" alt="FE8 question 20 exactly as printed: FIFO, 3 frames, 1,3,0,3,5,6 — five faults" loading="lazy" /><p class="chu-thich">🧮 FE8 question 20 exactly as printed: FIFO, 3 frames, 1,3,0,3,5,6 — five faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe8: { ref: [1, 3, 0, 3, 5, 6], khung: 3 },
  fe8du: { ref: [1, 3, 0, 3, 5, 6, 3], khung: 3 },
};</code></pre></details>
<p>As printed, the answer is <strong>5</strong> — not even an option. Notice the dangling comma after "6": the paper lost the last number. The well-known form of this question ends with one more <strong>3</strong>:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2c52fb8964dc5570127eb63050229e371878bc60.svg" alt="The same question with the missing last reference restored (…, 6, 3): six faults, matching the key" loading="lazy" /><p class="chu-thich">🧮 The same question with the missing last reference restored (…, 6, 3): six faults, matching the key</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe8: { ref: [1, 3, 0, 3, 5, 6], khung: 3 },
  fe8du: { ref: [1, 3, 0, 3, 5, 6, 3], khung: 3 },
};</code></pre></details>
<p class="meo">🧠 In the exam room, pick the answer the setter intended (6) — but in your head, know why. This is also why every calculation answer on this site is computed by a simulator, never typed from a question bank.</p>
<h3>Scheduling calculations look like this</h3>
<p>Four processes P1–P4 arriving at 0, 1, 2, 3 with bursts 8, 4, 9, 5 — the classic textbook set. With SRTF (preemptive shortest job first) the average waiting time is 6.5; with Round Robin (quantum 2) it is 12.75:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bb491b1a8c667bda8995a80f3ec67fe9532170f8.svg" alt="SRTF on P1(0,8) P2(1,4) P3(2,9) P4(3,5) — Gantt chart and waiting times computed by the simulator" loading="lazy" /><p class="chu-thich">🧮 SRTF on P1(0,8) P2(1,4) P3(2,9) P4(3,5) — Gantt chart and waiting times computed by the simulator</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0</td><td>8</td><td>0</td><td>17</td><td>17</td><td>9</td></tr>
<tr><td>P2</td><td>1</td><td>4</td><td>1</td><td>5</td><td>4</td><td>0</td></tr>
<tr><td>P3</td><td>2</td><td>9</td><td>17</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>P4</td><td>3</td><td>5</td><td>5</td><td>10</td><td>7</td><td>2</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>13</strong></td><td><strong>6.5</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'P1', den: 0, chay: 8, uuTien: 3 },
  { ten: 'P2', den: 1, chay: 4, uuTien: 1 },
  { ten: 'P3', den: 2, chay: 9, uuTien: 4 },
  { ten: 'P4', den: 3, chay: 5, uuTien: 2 },
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f36d40491a9690b669fab6ec8fe4d7d67ceb25ac.svg" alt="Round Robin with quantum 2 on the same four processes" loading="lazy" /><p class="chu-thich">🧮 Round Robin with quantum 2 on the same four processes</p></div>
<table>
<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>First run</th><th>Completion</th><th>Turnaround = completion − arrival</th><th>Waiting = turnaround − burst</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0</td><td>8</td><td>0</td><td>22</td><td>22</td><td>14</td></tr>
<tr><td>P2</td><td>1</td><td>4</td><td>2</td><td>12</td><td>11</td><td>7</td></tr>
<tr><td>P3</td><td>2</td><td>9</td><td>4</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>P4</td><td>3</td><td>5</td><td>8</td><td>23</td><td>20</td><td>15</td></tr>
<tr><td colspan="5"><strong>Average</strong></td><td><strong>19.25</strong></td><td><strong>12.75</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'P1', den: 0, chay: 8, uuTien: 3 },
  { ten: 'P2', den: 1, chay: 4, uuTien: 1 },
  { ten: 'P3', den: 2, chay: 9, uuTien: 4 },
  { ten: 'P4', den: 3, chay: 5, uuTien: 2 },
];</code></pre></details>
<p>You will learn to draw these by hand in Chapter 2 (lesson 2.C). The table under each chart shows the two formulas you must know: <strong>turnaround = completion − arrival</strong> and <strong>waiting = turnaround − burst</strong>.</p>`,
    `<h2>3. FE thật sự hỏi gì — đọc từ 29 đề thật</h2>
<p>Mở Exam Room: <a href="/exam?course=OSG202">đề OSG202</a>. Mới nhất là FE1 (SU26-RE), FE2 (SP26-RE) và FE3 (SP26-FE). Mọi câu đều trắc nghiệm, bằng tiếng Anh, và thuộc một trong bốn dạng:</p>
<table>
<thead><tr><th>Dạng</th><th>Ví dụ thật (diễn lại)</th><th>Chuẩn bị thế nào</th></tr></thead>
<tbody>
<tr><td>định nghĩa</td><td>"Thời gian di chuyển tay đọc tới đúng cylinder gọi là gì?" — seek time</td><td>bảng 🗂 thuật ngữ của mỗi chương; dòng 🎯 của mỗi slide</td></tr>
<tr><td>cơ chế nào / thuật toán nào</td><td>"Thuật toán thay trang nào có thể lỗi trang NHIỀU hơn khi có NHIỀU khung hơn?" — FIFO (nghịch lý Belady)</td><td>các mẹo 🧠 và bẫy ⚠️ trong mỗi bài</td></tr>
<tr><td>lời gọi hệ thống và lệnh</td><td>"Trong UNIX, lời gọi nào dời con trỏ tệp?" — lseek</td><td>bảng lời gọi hệ thống Chương 1 (bài 1.B) và các lab Linux</td></tr>
<tr><td>tính toán</td><td>số lỗi trang của một chuỗi tham chiếu; tổng quãng di chuyển đầu từ của một thuật toán đĩa; chuỗi an toàn theo thuật toán Nhà băng; thời gian chờ trung bình</td><td>làm trên giấy, rồi đối chiếu bộ mô phỏng trong bài</td></tr>
</tbody>
</table>
<h3>Một câu tính toán, giải bằng bộ mô phỏng</h3>
<p>FE3 (SP26-FE), câu 17: <em>"Dùng thay trang FIFO với bốn khung trang, chuỗi tham chiếu 0172327103 gây ra bao nhiêu lỗi trang nếu các khung ban đầu rỗng?"</em> Bộ mô phỏng chạy FIFO trên đúng chuỗi đó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d55561e952d5fd6bb78ac423f7e55362b7284eb9.svg" alt="FE3 câu 17 — FIFO 4 khung trên 0,1,7,2,3,2,7,1,0,3: do bộ mô phỏng tính" loading="lazy" /><p class="chu-thich">🧮 FE3 câu 17 — FIFO 4 khung trên 0,1,7,2,3,2,7,1,0,3: do bộ mô phỏng tính</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe8: { ref: [1, 3, 0, 3, 5, 6], khung: 3 },
  fe8du: { ref: [1, 3, 0, 3, 5, 6, 3], khung: 3 },
};</code></pre></details>
<p>Sáu lỗi trang — khoá ghi 6, đúng. Bốn lỗi đầu là không tránh được (khung còn trống); chỉ có hai lần thay: nạp 3 (đuổi 0, trang vào sớm nhất) và nạp 0 (đuổi 1).</p>
<h3>Và một câu mà chính đề bị sai</h3>
<p>FE8 (FA24-RE), câu 20 — ảnh quét đề gốc ghi: <em>"…ba khung trang… chuỗi tham chiếu 1, 3, 0, 3, 5, 6, (nếu ba khung ban đầu rỗng)?"</em>, phương án 6, 4, 7, 3, khoá là 6. Chạy đúng như đề in:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a6fcee51e920ae76cc3c421ad3fbbfb70f360a50.svg" alt="FE8 câu 20 đúng như đề in: FIFO, 3 khung, 1,3,0,3,5,6 — năm lỗi trang" loading="lazy" /><p class="chu-thich">🧮 FE8 câu 20 đúng như đề in: FIFO, 3 khung, 1,3,0,3,5,6 — năm lỗi trang</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe8: { ref: [1, 3, 0, 3, 5, 6], khung: 3 },
  fe8du: { ref: [1, 3, 0, 3, 5, 6, 3], khung: 3 },
};</code></pre></details>
<p>Theo đúng chữ in, đáp án là <strong>5</strong> — không có trong các phương án. Để ý dấu phẩy treo sau "6": đề bị rơi mất số cuối. Dạng quen thuộc của câu này kết thúc bằng thêm một số <strong>3</strong>:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/df7125c4b3d544584c96ea50fdd7f1b44326d897.svg" alt="Cùng câu đó với tham chiếu cuối bị mất được trả lại (…, 6, 3): sáu lỗi trang, khớp khoá" loading="lazy" /><p class="chu-thich">🧮 Cùng câu đó với tham chiếu cuối bị mất được trả lại (…, 6, 3): sáu lỗi trang, khớp khoá</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { ref: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], khung: 3 },
  fe3: { ref: [0, 1, 7, 2, 3, 2, 7, 1, 0, 3], khung: 4 },
  fe8: { ref: [1, 3, 0, 3, 5, 6], khung: 3 },
  fe8du: { ref: [1, 3, 0, 3, 5, 6, 3], khung: 3 },
};</code></pre></details>
<p class="meo">🧠 Trong phòng thi, chọn đáp án người ra đề muốn (6) — nhưng trong đầu phải biết vì sao. Đây cũng là lý do mọi đáp án tính toán trên web này do bộ mô phỏng tính, không bao giờ chép từ ngân hàng đề.</p>
<h3>Câu tính lập lịch trông như thế này</h3>
<p>Bốn tiến trình P1–P4 đến lúc 0, 1, 2, 3 với thời gian chạy 8, 4, 9, 5 — bộ dữ liệu kinh điển của sách. Với SRTF (SJF có chiếm quyền) thời gian chờ trung bình là 6,5; với Round Robin (lượng tử 2) là 12,75:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/edb437e5ef1d3a58ee0c235937403f9f9743bc7e.svg" alt="SRTF trên P1(0,8) P2(1,4) P3(2,9) P4(3,5) — biểu đồ Gantt và thời gian chờ do bộ mô phỏng tính" loading="lazy" /><p class="chu-thich">🧮 SRTF trên P1(0,8) P2(1,4) P3(2,9) P4(3,5) — biểu đồ Gantt và thời gian chờ do bộ mô phỏng tính</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0</td><td>8</td><td>0</td><td>17</td><td>17</td><td>9</td></tr>
<tr><td>P2</td><td>1</td><td>4</td><td>1</td><td>5</td><td>4</td><td>0</td></tr>
<tr><td>P3</td><td>2</td><td>9</td><td>17</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>P4</td><td>3</td><td>5</td><td>5</td><td>10</td><td>7</td><td>2</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>13</strong></td><td><strong>6.5</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'P1', den: 0, chay: 8, uuTien: 3 },
  { ten: 'P2', den: 1, chay: 4, uuTien: 1 },
  { ten: 'P3', den: 2, chay: 9, uuTien: 4 },
  { ten: 'P4', den: 3, chay: 5, uuTien: 2 },
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9f6819af96c45b8ec46006a1e560609492625714.svg" alt="Round Robin lượng tử 2 trên cùng bốn tiến trình" loading="lazy" /><p class="chu-thich">🧮 Round Robin lượng tử 2 trên cùng bốn tiến trình</p></div>
<table>
<thead><tr><th>Tiến trình</th><th>Đến</th><th>Chạy</th><th>Lần đầu chạy</th><th>Xong</th><th>Hoàn thành = xong − đến</th><th>Chờ = hoàn thành − chạy</th></tr></thead>
<tbody>
<tr><td>P1</td><td>0</td><td>8</td><td>0</td><td>22</td><td>22</td><td>14</td></tr>
<tr><td>P2</td><td>1</td><td>4</td><td>2</td><td>12</td><td>11</td><td>7</td></tr>
<tr><td>P3</td><td>2</td><td>9</td><td>4</td><td>26</td><td>24</td><td>15</td></tr>
<tr><td>P4</td><td>3</td><td>5</td><td>8</td><td>23</td><td>20</td><td>15</td></tr>
<tr><td colspan="5"><strong>Trung bình</strong></td><td><strong>19.25</strong></td><td><strong>12.75</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [
  { ten: 'P1', den: 0, chay: 8, uuTien: 3 },
  { ten: 'P2', den: 1, chay: 4, uuTien: 1 },
  { ten: 'P3', den: 2, chay: 9, uuTien: 4 },
  { ten: 'P4', den: 3, chay: 5, uuTien: 2 },
];</code></pre></details>
<p>Bạn sẽ học vẽ tay các biểu đồ này ở Chương 2 (bài 2.C). Bảng dưới mỗi biểu đồ có hai công thức phải thuộc: <strong>thời gian hoàn thành (turnaround) = lúc xong − lúc đến</strong> và <strong>thời gian chờ (waiting) = hoàn thành − thời gian chạy</strong>.</p>`),
    bi(`<h2>4. Order of study and a weekly rhythm</h2>
<ol>
<li><strong>Week 1:</strong> Section 0 (all four ⭐ lessons) → your Linux works and you have run <code>fork()</code> once.</li>
<li><strong>Then one chapter at a time, in this order:</strong> 📑 slide lessons → 🧪 practice → quiz. Do not open the next chapter until the quiz is 8/10.</li>
<li><strong>Every week:</strong> 2 × 45 minutes on slides (one lesson part each), 1 × 60 minutes of practice at the keyboard, 1 × 15 minutes of quiz, and 15 minutes reviewing the glossary.</li>
<li><strong>Before PT1 (session 32):</strong> Chapters 1–3 quizzes again + the Progress Test 1 review. <strong>Before PT2 (session 53):</strong> Chapters 4–6.</li>
<li><strong>Last two weeks:</strong> the three newest FE papers in the Exam Room under a 60-minute timer, then the "Final Exam" section's walkthroughs.</li>
</ol>
<h2>5. Using AI well (LO11 asks you to)</h2>
<p>Ask an AI to explain a figure in other words, to give you a second example, or to quiz you. Do <strong>not</strong> trust its arithmetic: language models regularly miscount page faults and Gantt charts. Check every number with the simulator in the lesson, and check every command by running it. When the AI and the running program disagree, the running program wins.</p>`,
    `<h2>4. Thứ tự học và nhịp mỗi tuần</h2>
<ol>
<li><strong>Tuần 1:</strong> Mục 0 (đủ bốn bài ⭐) → Linux của bạn chạy được và bạn đã chạy <code>fork()</code> một lần.</li>
<li><strong>Sau đó mỗi lần một chương, theo thứ tự:</strong> bài 📑 slide → 🧪 thực hành → quiz. Chưa được 8/10 quiz thì chưa mở chương sau.</li>
<li><strong>Mỗi tuần:</strong> 2 lần × 45 phút học slide (mỗi lần một phần bài), 1 lần × 60 phút thực hành bên bàn phím, 1 lần × 15 phút làm quiz, và 15 phút ôn bảng thuật ngữ.</li>
<li><strong>Trước PT1 (buổi 32):</strong> làm lại quiz Chương 1–3 + bài ôn Progress Test 1. <strong>Trước PT2 (buổi 53):</strong> Chương 4–6.</li>
<li><strong>Hai tuần cuối:</strong> ba đề FE mới nhất trong Exam Room, bấm giờ 60 phút, rồi các bài chữa đề ở section "Thi cuối kỳ".</li>
</ol>
<h2>5. Dùng AI cho có ích (LO11 bắt bạn dùng)</h2>
<p>Nhờ AI giải thích một hình bằng lời khác, cho thêm một ví dụ, hoặc đố bạn. <strong>Đừng</strong> tin phần tính toán của nó: mô hình ngôn ngữ hay đếm sai lỗi trang và biểu đồ Gantt. Kiểm mọi con số bằng bộ mô phỏng trong bài, kiểm mọi lệnh bằng cách chạy thật. Khi AI và chương trình đang chạy nói khác nhau, chương trình đang chạy thắng.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ Setting up Linux — WSL2 on Windows, a container or a VM on macOS, the tools of this course, and the errors everyone hits ───────── */
const L_x_cai_moi_truong = {
  title: '⭐ Setting up Linux — WSL2 on Windows, a container or a VM on macOS, the tools of this course, and the errors everyone hits|||⭐ Cài môi trường Linux — WSL2 trên Windows, container hoặc máy ảo trên macOS, bộ công cụ của môn, và các lỗi ai cũng gặp',
  slug: 'osg202-cai-moi-truong',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình: chọn đường cài theo máy (Windows 10 2004+/11 dùng WSL2 với một lệnh wsl --install; macOS dùng container Docker Desktop/OrbStack hoặc máy ảo UTM, vì macOS không phải Linux — xem output thật: không có /proc, gcc thật ra là clang, không có strace; máy cũ dùng VirtualBox), cài gcc, make, gdb, strace, man, dựng lại đúng container Linux mà mọi bài trên web dùng để chạy code, phiên kiểm tra môi trường chạy thật và năm lỗi ai cũng gặp (thiếu dấu chấm phẩy, Permission denied, quên ./, script lưu kiểu Windows CRLF, tệp của root) — mỗi lỗi có output thật và cách sửa.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ Setting up Linux · added by this site</span>
<h2>You need a real Linux — here is the shortest way on your machine</h2>
<p class="lead">The labs (20%) are done on Linux, the slides talk about UNIX system calls, and every server you will deploy to runs Linux. You do not need to wipe your laptop: pick the row that matches your computer, follow it once, and finish with the checking session at the end of this lesson.</p>
<table>
<thead><tr><th>Your computer</th><th>Best way</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Windows 10 (version 2004 or later) or Windows 11</td><td>WSL 2 with Ubuntu — one command</td><td>a real Linux kernel in a light virtual machine managed by Windows; starts in a second</td></tr>
<tr><td>Mac (Apple silicon or Intel)</td><td>a Linux container (Docker Desktop or OrbStack) — or a full VM with UTM</td><td>macOS is UNIX-like but NOT Linux: many things in this course do not exist on it</td></tr>
<tr><td>School lab PC / older Windows</td><td>VirtualBox + Ubuntu</td><td>works everywhere, heavier</td></tr>
<tr><td>A Linux laptop already</td><td>install the packages below</td><td>nothing else needed</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Mục 0 · ⭐ Cài môi trường Linux · phần web tự thêm</span>
<h2>Bạn cần một Linux thật — đây là đường ngắn nhất trên máy của bạn</h2>
<p class="lead">Lab (20%) làm trên Linux, slide nói về lời gọi hệ thống của UNIX, và mọi server bạn sẽ deploy lên đều chạy Linux. Bạn không cần xoá máy: chọn dòng khớp với máy mình, làm theo một lần, rồi kết thúc bằng phiên kiểm tra ở cuối bài.</p>
<table>
<thead><tr><th>Máy của bạn</th><th>Cách tốt nhất</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Windows 10 (bản 2004 trở lên) hoặc Windows 11</td><td>WSL 2 với Ubuntu — một lệnh</td><td>một nhân Linux thật trong máy ảo nhẹ do Windows quản lý; mở lên trong một giây</td></tr>
<tr><td>Mac (chip Apple hoặc Intel)</td><td>một container Linux (Docker Desktop hoặc OrbStack) — hoặc máy ảo đầy đủ bằng UTM</td><td>macOS giống UNIX nhưng KHÔNG phải Linux: nhiều thứ trong môn không có trên nó</td></tr>
<tr><td>Máy phòng lab / Windows cũ</td><td>VirtualBox + Ubuntu</td><td>chạy ở đâu cũng được, nặng hơn</td></tr>
<tr><td>Laptop đã cài Linux</td><td>cài các gói bên dưới</td><td>không cần gì thêm</td></tr>
</tbody>
</table>`),
    bi(`<h2>1. Windows: WSL 2 in one command</h2>
<p>Microsoft's own instructions (learn.microsoft.com, "Install WSL"): you need Windows 10 version 2004 or higher (build 19041+) or Windows 11. Open <strong>PowerShell as Administrator</strong> (right-click → Run as administrator) and type:</p>
<pre><code class="language-powershell">wsl --install</code></pre>
<p>Restart when asked. The command turns on the features WSL needs and installs <strong>Ubuntu</strong> (the default distribution); new installs use WSL 2, which is a real Linux kernel. The first start asks you to create a Linux user name and password — remember the password, <code>sudo</code> asks for it. Then, inside the Ubuntu window, install the tools of this course:</p>
<pre><code class="language-bash">sudo apt update
sudo apt install -y build-essential gdb strace ltrace manpages-dev man-db</code></pre>
<ul>
<li><strong>Work inside the Linux file system</strong> (<code>cd ~</code>, i.e. <code>/home/yourname</code>), not in <code>/mnt/c/...</code>: the Windows drive is slow from Linux and Windows editors save files with CRLF line endings (mistake 4 below).</li>
<li>Edit with VS Code: install the "WSL" extension, then type <code>code .</code> in the Ubuntu terminal — VS Code opens the Linux folder directly.</li>
<li><code>wsl -l -v</code> in PowerShell shows your distributions and whether they run as version 2.</li>
</ul>`,
    `<h2>1. Windows: WSL 2 bằng một lệnh</h2>
<p>Theo hướng dẫn của chính Microsoft (learn.microsoft.com, "Install WSL"): cần Windows 10 bản 2004 trở lên (build 19041+) hoặc Windows 11. Mở <strong>PowerShell bằng quyền Administrator</strong> (chuột phải → Run as administrator) rồi gõ:</p>
<pre><code class="language-powershell">wsl --install</code></pre>
<p>Khởi động lại khi được hỏi. Lệnh này bật các tính năng WSL cần và cài <strong>Ubuntu</strong> (bản phân phối mặc định); bản cài mới dùng WSL 2, tức là một nhân Linux thật. Lần mở đầu tiên bắt bạn tạo tên người dùng và mật khẩu Linux — nhớ mật khẩu, <code>sudo</code> sẽ hỏi nó. Sau đó, trong cửa sổ Ubuntu, cài công cụ của môn:</p>
<pre><code class="language-bash">sudo apt update
sudo apt install -y build-essential gdb strace ltrace manpages-dev man-db</code></pre>
<ul>
<li><strong>Làm việc trong hệ thống tệp của Linux</strong> (<code>cd ~</code>, tức <code>/home/tên-bạn</code>), đừng làm trong <code>/mnt/c/...</code>: ổ Windows truy cập từ Linux rất chậm, và trình soạn thảo Windows lưu tệp với xuống dòng CRLF (lỗi 4 bên dưới).</li>
<li>Soạn bằng VS Code: cài extension "WSL", rồi gõ <code>code .</code> trong terminal Ubuntu — VS Code mở thẳng thư mục Linux.</li>
<li><code>wsl -l -v</code> trong PowerShell cho biết bạn có những bản phân phối nào và chúng chạy WSL bản 2 chưa.</li>
</ul>`),
    bi(`<h2>2. macOS: why the Mac terminal is not enough</h2>
<p>The macOS terminal looks like Linux — <code>ls</code>, <code>cd</code>, <code>ps</code> all work — so it is tempting to stay there. This is what the same commands really printed on the Mac used to build this site (macOS 27.0.1, Apple silicon), captured on 25 October 2026:</p>
<pre><code class="language-plaintext">$ ls /proc
ls: /proc: No such file or directory
$ uname -srm
Darwin 27.0.0 arm64
$ gcc --version
Apple clang version 21.0.0 (clang-2100.3.34.2)
Target: arm64-apple-darwin27.0.0
$ strace -V
zsh: command not found: strace</code></pre>
<p>Three problems: <strong>no <code>/proc</code></strong> (half of the Linux labs read it), <strong><code>gcc</code> is really Apple's clang</strong> (error messages differ from the lab machines), and <strong>no <code>strace</code></strong> (macOS has a different kernel, XNU, with different system calls). So on a Mac, run Linux next to macOS:</p>
<ul>
<li><strong>A container (recommended)</strong> — install Docker Desktop or OrbStack, then open a Debian shell in your current folder:
<pre><code class="language-bash">docker run -it --rm --hostname osg-lab -v "$PWD":/w -w /w debian:12 bash
apt update &amp;&amp; apt install -y build-essential gdb strace man-db manpages-dev procps psmisc</code></pre>
Files you save in the folder on macOS appear in <code>/w</code> inside Linux. A container shares the small Linux VM that Docker runs for you — perfect for everything up to Chapter 6.</li>
<li><strong>A full virtual machine</strong> — UTM (free) with Ubuntu Server for ARM. Choose this when you need things a container does not allow (kernel modules, a full <code>systemd</code> boot), or when your teacher asks for a "real" Linux desktop.</li>
</ul>`,
    `<h2>2. macOS: vì sao terminal của Mac chưa đủ</h2>
<p>Terminal macOS trông giống Linux — <code>ls</code>, <code>cd</code>, <code>ps</code> đều chạy — nên rất dễ ở lì trên đó. Đây là những gì cùng các lệnh ấy thật sự in ra trên chiếc Mac dùng để dựng web này (macOS 27.0.1, chip Apple), chụp ngày 25/10/2026:</p>
<pre><code class="language-plaintext">$ ls /proc
ls: /proc: No such file or directory
$ uname -srm
Darwin 27.0.0 arm64
$ gcc --version
Apple clang version 21.0.0 (clang-2100.3.34.2)
Target: arm64-apple-darwin27.0.0
$ strace -V
zsh: command not found: strace</code></pre>
<p>Ba vấn đề: <strong>không có <code>/proc</code></strong> (một nửa số lab Linux đọc nó), <strong><code>gcc</code> thật ra là clang của Apple</strong> (thông báo lỗi khác máy phòng lab), và <strong>không có <code>strace</code></strong> (macOS có nhân khác, XNU, với lời gọi hệ thống khác). Vậy trên Mac, hãy chạy Linux bên cạnh macOS:</p>
<ul>
<li><strong>Một container (nên dùng)</strong> — cài Docker Desktop hoặc OrbStack, rồi mở shell Debian ngay trong thư mục hiện tại:
<pre><code class="language-bash">docker run -it --rm --hostname osg-lab -v "$PWD":/w -w /w debian:12 bash
apt update &amp;&amp; apt install -y build-essential gdb strace man-db manpages-dev procps psmisc</code></pre>
Tệp bạn lưu trong thư mục đó trên macOS hiện ra ở <code>/w</code> bên trong Linux. Container dùng chung máy ảo Linux nhỏ mà Docker chạy sẵn cho bạn — đủ cho mọi thứ tới hết Chương 6.</li>
<li><strong>Một máy ảo đầy đủ</strong> — UTM (miễn phí) với Ubuntu Server bản ARM. Chọn cách này khi cần thứ container không cho (module nhân, khởi động <code>systemd</code> đầy đủ), hoặc khi thầy cô yêu cầu một máy Linux có giao diện "thật".</li>
</ul>`),
    bi(`<h2>3. The exact Linux used by every lesson on this site</h2>
<p>Every program and terminal session in these lessons ran in one container image, <code>osg202-lab</code>. To get <em>identical</em> output, build the same thing (Windows users: inside WSL with Docker Desktop's WSL integration; Mac users: in Terminal). Save this as <code>Dockerfile</code> in an empty folder:</p>
<pre><code class="language-dockerfile">FROM eclipse-temurin:21-jdk AS jdk
FROM node:22-bookworm AS node
FROM debian:12
ENV LANG=C.UTF-8 TZ=Asia/Ho_Chi_Minh
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      build-essential gcc g++ make gdb strace procps psmisc util-linux iproute2 lsof sysstat \\
      kmod file tree bc time less man-db manpages manpages-dev e2fsprogs dosfstools \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY --from=jdk /opt/java/openjdk /opt/java/openjdk
ENV PATH=/opt/java/openjdk/bin:$PATH
COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN useradd -m -s /bin/bash sv
WORKDIR /w</code></pre>
<pre><code class="language-bash">docker build -t osg202-lab .
docker run -it --rm --hostname osg-lab -v "$PWD":/w -w /w osg202-lab bash</code></pre>
<p>Some lessons need extra permissions, written under the program as 🐳 — for example <code>--memory=64m</code> (limit memory, to see the OOM killer), <code>--ulimit nofile=64:64</code> (limit open files), <code>--privileged</code> (allow <code>mount</code>), <code>--user sv</code> (run as a normal user instead of root). Add them to <code>docker run</code> before the image name.</p>
<p class="meo">🧠 Inside the container you are <code>root</code> unless you add <code>--user sv</code>. On WSL or a VM you are a normal user and need <code>sudo</code> for administration — that is the realistic setup, and the one the lab machines use.</p>`,
    `<h2>3. Đúng bản Linux mà mọi bài trên web này dùng</h2>
<p>Mọi chương trình và phiên terminal trong các bài đều chạy trong một ảnh container, <code>osg202-lab</code>. Muốn ra output <em>y hệt</em>, hãy dựng đúng thứ đó (người dùng Windows: trong WSL, bật WSL integration của Docker Desktop; người dùng Mac: trong Terminal). Lưu nội dung sau thành tệp <code>Dockerfile</code> trong một thư mục trống:</p>
<pre><code class="language-dockerfile">FROM eclipse-temurin:21-jdk AS jdk
FROM node:22-bookworm AS node
FROM debian:12
ENV LANG=C.UTF-8 TZ=Asia/Ho_Chi_Minh
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      build-essential gcc g++ make gdb strace procps psmisc util-linux iproute2 lsof sysstat \\
      kmod file tree bc time less man-db manpages manpages-dev e2fsprogs dosfstools \\
 &amp;&amp; rm -rf /var/lib/apt/lists/*
COPY --from=jdk /opt/java/openjdk /opt/java/openjdk
ENV PATH=/opt/java/openjdk/bin:$PATH
COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN useradd -m -s /bin/bash sv
WORKDIR /w</code></pre>
<pre><code class="language-bash">docker build -t osg202-lab .
docker run -it --rm --hostname osg-lab -v "$PWD":/w -w /w osg202-lab bash</code></pre>
<p>Vài bài cần thêm quyền, ghi ngay dưới chương trình bằng 🐳 — ví dụ <code>--memory=64m</code> (giới hạn bộ nhớ, để thấy OOM killer), <code>--ulimit nofile=64:64</code> (giới hạn số tệp mở), <code>--privileged</code> (cho phép <code>mount</code>), <code>--user sv</code> (chạy bằng người dùng thường thay vì root). Thêm chúng vào <code>docker run</code> trước tên ảnh.</p>
<p class="meo">🧠 Trong container bạn là <code>root</code> trừ khi thêm <code>--user sv</code>. Trên WSL hay máy ảo bạn là người dùng thường và cần <code>sudo</code> cho việc quản trị — đó mới là cấu hình thực tế, và là cấu hình của máy phòng lab.</p>`),
    bi(`<h2>4. Check that everything works</h2>
<p>Run these lines one by one. This is the real session from the lab container, run as the normal user <code>sv</code>:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Run these after installing — every line must work<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
$ grep PRETTY_NAME /etc/os-release<br>
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"<br>
$ gcc --version | head -1<br>
gcc (Debian 12.2.0-14+deb12u1) 12.2.0<br>
$ make --version | head -1<br>
GNU Make 4.3<br>
$ gdb --version | head -1<br>
GNU gdb (Debian 13.1-3) 13.1<br>
$ which strace man<br>
/usr/bin/strace<br>
/usr/bin/man<br>
$ man -w 2 fork<br>
/usr/share/man/man2/fork.2.gz<br>
$ head -c 52 /proc/version; echo<br>
Linux version 7.0.12-linuxkit (root@buildkitsandbox)<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ nproc<br>
10</div>
<p>What each line proves: <code>uname</code> — you are on a Linux kernel; <code>gcc</code>/<code>make</code>/<code>gdb</code> — you can compile and debug C (CLO10); <code>man -w 2 fork</code> — the manual for <strong>section 2</strong> (system calls) is installed; <code>/proc/version</code> and <code>/proc/meminfo</code> — the kernel's live information is readable as files (Chapter 10); <code>nproc</code> — how many CPU cores the kernel gives you. Your numbers will differ; the commands must not fail.</p>
<p class="meo">🧠 Manual sections you will use: <code>man 1 ls</code> (commands), <code>man 2 read</code> (system calls — Chapter 1), <code>man 3 printf</code> (C library). The same pages are online at man7.org.</p>`,
    `<h2>4. Kiểm tra mọi thứ đã chạy</h2>
<p>Chạy lần lượt từng dòng. Đây là phiên thật trong container lab, chạy bằng người dùng thường <code>sv</code>:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Chạy các lệnh này sau khi cài — dòng nào cũng phải chạy được<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
$ grep PRETTY_NAME /etc/os-release<br>
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"<br>
$ gcc --version | head -1<br>
gcc (Debian 12.2.0-14+deb12u1) 12.2.0<br>
$ make --version | head -1<br>
GNU Make 4.3<br>
$ gdb --version | head -1<br>
GNU gdb (Debian 13.1-3) 13.1<br>
$ which strace man<br>
/usr/bin/strace<br>
/usr/bin/man<br>
$ man -w 2 fork<br>
/usr/share/man/man2/fork.2.gz<br>
$ head -c 52 /proc/version; echo<br>
Linux version 7.0.12-linuxkit (root@buildkitsandbox)<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
$ nproc<br>
10</div>
<p>Mỗi dòng chứng minh gì: <code>uname</code> — bạn đang trên nhân Linux; <code>gcc</code>/<code>make</code>/<code>gdb</code> — bạn biên dịch và gỡ lỗi C được (CLO10); <code>man -w 2 fork</code> — đã có sổ tay <strong>mục 2</strong> (lời gọi hệ thống); <code>/proc/version</code> và <code>/proc/meminfo</code> — thông tin sống của nhân đọc được như tệp (Chương 10); <code>nproc</code> — nhân cho bạn bao nhiêu lõi CPU. Con số của bạn sẽ khác; lệnh thì không được lỗi.</p>
<p class="meo">🧠 Các mục sổ tay bạn sẽ dùng: <code>man 1 ls</code> (lệnh), <code>man 2 read</code> (lời gọi hệ thống — Chương 1), <code>man 3 printf</code> (thư viện C). Cùng các trang đó có trên mạng ở man7.org.</p>`),
    bi(`<h2>5. The five errors everyone hits — seen for real</h2>
<p>Run as the normal user <code>sv</code>; every message below is what Linux really printed.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Mistake 1 — a missing ";" : read the FIRST error, with its line:column<br>
$ cat &gt; sai.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("hi\\n")<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ gcc sai.c -o sai<br>
sai.c: In function ‘main’:<br>
sai.c:3:19: error: expected ‘;’ before ‘return’<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;printf("hi\\n")<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;;<br>
&nbsp;&nbsp;&nbsp;&nbsp;4 | &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;~~~~~~<br>
# Mistake 2 — a script without the execute permission<br>
$ echo 'echo xin chao' &gt; chao.sh<br>
$ ./chao.sh<br>
bash: ./chao.sh: Permission denied<br>
$ chmod +x chao.sh<br>
$ ./chao.sh<br>
xin chao<br>
# Mistake 3 — forgetting "./" : the current folder is not in PATH<br>
$ chao.sh<br>
bash: chao.sh: command not found<br>
# Mistake 4 — a script saved with Windows line endings (CRLF)<br>
$ printf '#!/bin/bash\\r\\necho hello\\r\\n' &gt; crlf.sh<br>
$ chmod +x crlf.sh<br>
$ ./crlf.sh<br>
bash: ./crlf.sh: cannot execute: required file not found<br>
$ file crlf.sh<br>
crlf.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators<br>
$ sed -i 's/\\r$//' crlf.sh<br>
$ ./crlf.sh<br>
hello<br>
# Mistake 5 — a normal user cannot read root's files<br>
$ cat /etc/shadow<br>
cat: /etc/shadow: Permission denied</div>
<table>
<thead><tr><th>Error</th><th>What it means</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>error: expected ';' before 'return'</code></td><td>the compiler noticed the problem one line LATER than the mistake</td><td>read the FIRST error, look at the line before the caret</td></tr>
<tr><td><code>Permission denied</code> on <code>./chao.sh</code></td><td>the file has no execute (x) permission</td><td><code>chmod +x chao.sh</code> (permissions: Chapter 4, Chapter 9)</td></tr>
<tr><td><code>command not found</code> for <code>chao.sh</code></td><td>the shell only searches the folders in <code>PATH</code>; "." is not one of them, on purpose</td><td>type <code>./chao.sh</code></td></tr>
<tr><td><code>cannot execute: required file not found</code></td><td>the first line is <code>#!/bin/bash\\r</code> — Linux looks for a program literally called "bash\\r"</td><td><code>sed -i 's/\\r$//' file</code> or <code>dos2unix file</code>; set your editor to LF</td></tr>
<tr><td><code>cat: /etc/shadow: Permission denied</code></td><td>password hashes belong to root</td><td>correct behaviour: a normal user must not read them (protection, Chapter 1)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Older bash versions print the CRLF error as <code>bad interpreter: No such file or directory</code> — same cause, same fix. If a script "works on my friend's machine" but not on the server, check line endings first: <code>file script.sh</code>.</p>`,
    `<h2>5. Năm lỗi ai cũng gặp — xem tận mắt</h2>
<p>Chạy bằng người dùng thường <code>sv</code>; mọi thông báo dưới đây là đúng những gì Linux in ra.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Lỗi 1 — thiếu ";" : đọc lỗi ĐẦU TIÊN, kèm dòng:cột<br>
$ cat &gt; sai.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("hi\\n")<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ gcc sai.c -o sai<br>
sai.c: In function ‘main’:<br>
sai.c:3:19: error: expected ‘;’ before ‘return’<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;printf("hi\\n")<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;;<br>
&nbsp;&nbsp;&nbsp;&nbsp;4 | &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;~~~~~~<br>
# Lỗi 2 — script chưa có quyền thực thi<br>
$ echo 'echo xin chao' &gt; chao.sh<br>
$ ./chao.sh<br>
bash: ./chao.sh: Permission denied<br>
$ chmod +x chao.sh<br>
$ ./chao.sh<br>
xin chao<br>
# Lỗi 3 — quên "./" : thư mục hiện tại không nằm trong PATH<br>
$ chao.sh<br>
bash: chao.sh: command not found<br>
# Lỗi 4 — script lưu bằng xuống dòng kiểu Windows (CRLF)<br>
$ printf '#!/bin/bash\\r\\necho hello\\r\\n' &gt; crlf.sh<br>
$ chmod +x crlf.sh<br>
$ ./crlf.sh<br>
bash: ./crlf.sh: cannot execute: required file not found<br>
$ file crlf.sh<br>
crlf.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators<br>
$ sed -i 's/\\r$//' crlf.sh<br>
$ ./crlf.sh<br>
hello<br>
# Lỗi 5 — người dùng thường không đọc được tệp của root<br>
$ cat /etc/shadow<br>
cat: /etc/shadow: Permission denied</div>
<table>
<thead><tr><th>Lỗi</th><th>Nghĩa là gì</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>error: expected ';' before 'return'</code></td><td>trình biên dịch nhận ra lỗi ở dòng SAU chỗ sai</td><td>đọc lỗi ĐẦU TIÊN, nhìn dòng ngay trước dấu mũ ^</td></tr>
<tr><td><code>Permission denied</code> với <code>./chao.sh</code></td><td>tệp chưa có quyền thực thi (x)</td><td><code>chmod +x chao.sh</code> (quyền: Chương 4, Chương 9)</td></tr>
<tr><td><code>command not found</code> với <code>chao.sh</code></td><td>shell chỉ tìm trong các thư mục của <code>PATH</code>; "." cố ý không nằm trong đó</td><td>gõ <code>./chao.sh</code></td></tr>
<tr><td><code>cannot execute: required file not found</code></td><td>dòng đầu là <code>#!/bin/bash\\r</code> — Linux đi tìm chương trình tên đúng là "bash\\r"</td><td><code>sed -i 's/\\r$//' tệp</code> hoặc <code>dos2unix tệp</code>; chỉnh trình soạn thảo sang LF</td></tr>
<tr><td><code>cat: /etc/shadow: Permission denied</code></td><td>mã băm mật khẩu thuộc về root</td><td>hành vi đúng: người dùng thường không được đọc (bảo vệ, Chương 1)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Bash bản cũ in lỗi CRLF thành <code>bad interpreter: No such file or directory</code> — cùng nguyên nhân, cùng cách sửa. Script "chạy trên máy bạn mình" mà không chạy trên server thì kiểm xuống dòng trước tiên: <code>file script.sh</code>.</p>`),
  ].join('\n'),
};

/* ───────── ⭐ First hands-on session — your first Linux commands, your first fork() in C, and seeing your own processes ───────── */
const L_x_buoi_dau_tien = {
  title: '⭐ First hands-on session — your first Linux commands, your first fork() in C, and seeing your own processes|||⭐ Buổi thực hành đầu tiên — lệnh Linux đầu tiên, fork() đầu tiên bằng C, và tận mắt thấy tiến trình của mình',
  slug: 'osg202-buoi-dau-tien',
  type: 'VIDEO',
  isFreePreview: true,
  description: 'Bài tự thêm ngoài giáo trình, làm theo từng bước trong Linux của bạn: phiên lệnh đầu tiên (whoami, pwd, uname, tạo thư mục và tệp, ls -l, wc, ps và $$) có output thật và bảng giải nghĩa từng cột; chương trình C đầu tiên gọi fork() — một chương trình thành hai tiến trình, tiến trình con chạy ps để thấy chính mình, cha mình, rồi cha đợi con và đọc mã thoát; ba bài tập có lời giải chạy thật: ba lần fork in ra mấy dòng, vì sao printf bị in hai lần sau fork, và mã thoát của chương trình nhìn từ shell.',
  content: [
    bi(`<span class="eyebrow">Section 0 · ⭐ First hands-on session · added by this site</span>
<h2>One hour: a terminal, a C program that splits in two, and the process table</h2>
<p class="lead">Open the Linux you set up in the previous lesson. You will type about fifteen commands and one C program, and at the end you will have <em>seen</em> the two ideas the whole of Chapter 1 and Chapter 2 rest on: <strong>a process is a running program</strong>, and <strong>a process is created by another process</strong> with the system call <code>fork()</code>. Everything below is a real session; type it yourself — do not copy-paste the output.</p>`,
    `<span class="eyebrow">Mục 0 · ⭐ Buổi thực hành đầu tiên · phần web tự thêm</span>
<h2>Một giờ: một terminal, một chương trình C tách làm hai, và bảng tiến trình</h2>
<p class="lead">Mở Linux bạn đã cài ở bài trước. Bạn sẽ gõ khoảng mười lăm lệnh và một chương trình C, và cuối buổi bạn sẽ <em>thấy tận mắt</em> hai ý mà cả Chương 1 lẫn Chương 2 dựa vào: <strong>tiến trình (process) là một chương trình đang chạy</strong>, và <strong>tiến trình được tạo ra bởi một tiến trình khác</strong> bằng lời gọi hệ thống <code>fork()</code>. Mọi thứ dưới đây là phiên thật; hãy tự gõ — đừng chép dán output.</p>`),
    bi(`<h2>Step 1 — your first Linux commands</h2>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># 1. Who am I, where am I?<br>
$ whoami<br>
sv<br>
$ pwd<br>
/w<br>
# 2. Which Linux is this?<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
$ head -2 /etc/os-release<br>
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"<br>
NAME="Debian GNU/Linux"<br>
# 3. Make a folder and a file, look at them<br>
$ mkdir -p ~/osg202 &amp;&amp; cd ~/osg202<br>
$ echo "Hello, Linux" &gt; hello.txt<br>
$ cat &gt; note.txt &lt;&lt;'END'<br>
&gt; line one<br>
&gt; line two<br>
&gt; END<br>
$ ls -l<br>
total 8<br>
-rw-r--r-- 1 sv sv 13 Oct 26 00:26 hello.txt<br>
-rw-r--r-- 1 sv sv 18 Oct 26 00:26 note.txt<br>
$ wc -l note.txt<br>
2 note.txt<br>
# 4. Every running program is a process<br>
$ ps -o pid,ppid,stat,comm<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;ps<br>
$ echo "my shell is PID $$"<br>
my shell is PID 1</div>
<table>
<thead><tr><th>Command</th><th>What it did</th><th>Remember</th></tr></thead>
<tbody>
<tr><td><code>whoami</code></td><td>printed the user you are logged in as (<code>sv</code>, a normal user)</td><td><code>root</code> is the administrator; work as a normal user</td></tr>
<tr><td><code>pwd</code></td><td>"print working directory" — where you are</td><td>here <code>/w</code>, the shared folder; on WSL you start in <code>/home/yourname</code></td></tr>
<tr><td><code>uname -srm</code></td><td>kernel name, kernel release, machine (CPU) type</td><td>the OS itself answers through a system call (<code>uname</code>)</td></tr>
<tr><td><code>head -2 /etc/os-release</code></td><td>first 2 lines of the file that names the distribution</td><td>Debian 12 here; Ubuntu on WSL</td></tr>
<tr><td><code>mkdir -p ~/osg202 &amp;&amp; cd ~/osg202</code></td><td>create a folder (no error if it exists), then move into it</td><td><code>~</code> = your home folder; <code>&amp;&amp;</code> = "run the next only if this succeeded"</td></tr>
<tr><td><code>echo … &gt; hello.txt</code></td><td>write text into a new file</td><td><code>&gt;</code> replaces the file, <code>&gt;&gt;</code> appends</td></tr>
<tr><td><code>cat &gt; note.txt &lt;&lt;'END'</code></td><td>type several lines into a file until the line <code>END</code></td><td>a "here-document" — handy in scripts</td></tr>
<tr><td><code>ls -l</code></td><td>list files: permissions, links, owner, group, size, date, name</td><td><code>-rw-r--r--</code>: the owner may read and write, others only read (Chapter 4)</td></tr>
<tr><td><code>wc -l note.txt</code></td><td>count lines</td><td><code>wc -c</code> counts bytes</td></tr>
<tr><td><code>ps -o pid,ppid,stat,comm</code></td><td>the processes of this terminal: number, parent's number, state, name</td><td><code>S</code> = sleeping (waiting), <code>R</code> = running, <code>s</code> = session leader</td></tr>
<tr><td><code>echo $$</code></td><td>the PID of the shell itself</td><td>the shell is a process too — here PID 1, because inside a container it is the first process</td></tr>
</tbody>
</table>
<p class="meo">🧠 The process table above has exactly two rows: the shell (<code>bash</code>) and the command that is printing the table (<code>ps</code>), whose parent (PPID) is the shell. Every command you type becomes a short-lived child process of the shell — that is the "stripped-down shell" of Chapter 1, slide 32.</p>`,
    `<h2>Bước 1 — những lệnh Linux đầu tiên</h2>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># 1. Tôi là ai, tôi đang ở đâu?<br>
$ whoami<br>
sv<br>
$ pwd<br>
/w<br>
# 2. Đây là Linux nào?<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
$ head -2 /etc/os-release<br>
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"<br>
NAME="Debian GNU/Linux"<br>
# 3. Tạo thư mục và tệp, rồi xem chúng<br>
$ mkdir -p ~/osg202 &amp;&amp; cd ~/osg202<br>
$ echo "Hello, Linux" &gt; hello.txt<br>
$ cat &gt; note.txt &lt;&lt;'END'<br>
&gt; line one<br>
&gt; line two<br>
&gt; END<br>
$ ls -l<br>
total 8<br>
-rw-r--r-- 1 sv sv 13 Oct 26 00:26 hello.txt<br>
-rw-r--r-- 1 sv sv 18 Oct 26 00:26 note.txt<br>
$ wc -l note.txt<br>
2 note.txt<br>
# 4. Mỗi chương trình đang chạy là một tiến trình<br>
$ ps -o pid,ppid,stat,comm<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;34 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;ps<br>
$ echo "my shell is PID $$"<br>
my shell is PID 1</div>
<table>
<thead><tr><th>Lệnh</th><th>Nó đã làm gì</th><th>Ghi nhớ</th></tr></thead>
<tbody>
<tr><td><code>whoami</code></td><td>in tên người dùng bạn đang đăng nhập (<code>sv</code>, người dùng thường)</td><td><code>root</code> là quản trị viên; hãy làm việc bằng người dùng thường</td></tr>
<tr><td><code>pwd</code></td><td>"print working directory" — bạn đang đứng ở đâu</td><td>ở đây là <code>/w</code>, thư mục chia sẻ; trên WSL bạn bắt đầu ở <code>/home/tên-bạn</code></td></tr>
<tr><td><code>uname -srm</code></td><td>tên nhân, phiên bản nhân, loại máy (CPU)</td><td>chính HĐH trả lời, qua lời gọi hệ thống <code>uname</code></td></tr>
<tr><td><code>head -2 /etc/os-release</code></td><td>2 dòng đầu của tệp ghi tên bản phân phối</td><td>ở đây là Debian 12; trên WSL là Ubuntu</td></tr>
<tr><td><code>mkdir -p ~/osg202 &amp;&amp; cd ~/osg202</code></td><td>tạo thư mục (đã có cũng không báo lỗi), rồi đi vào</td><td><code>~</code> = thư mục nhà; <code>&amp;&amp;</code> = "chỉ chạy lệnh sau nếu lệnh này thành công"</td></tr>
<tr><td><code>echo … &gt; hello.txt</code></td><td>ghi chữ vào một tệp mới</td><td><code>&gt;</code> ghi đè tệp, <code>&gt;&gt;</code> ghi nối thêm</td></tr>
<tr><td><code>cat &gt; note.txt &lt;&lt;'END'</code></td><td>gõ nhiều dòng vào tệp cho tới dòng <code>END</code></td><td>"here-document" — rất tiện trong script</td></tr>
<tr><td><code>ls -l</code></td><td>liệt kê tệp: quyền, số liên kết, chủ, nhóm, kích thước, ngày, tên</td><td><code>-rw-r--r--</code>: chủ được đọc và ghi, người khác chỉ đọc (Chương 4)</td></tr>
<tr><td><code>wc -l note.txt</code></td><td>đếm số dòng</td><td><code>wc -c</code> đếm số byte</td></tr>
<tr><td><code>ps -o pid,ppid,stat,comm</code></td><td>các tiến trình của terminal này: số hiệu, số hiệu của cha, trạng thái, tên</td><td><code>S</code> = đang ngủ (chờ), <code>R</code> = đang chạy, <code>s</code> = trưởng phiên</td></tr>
<tr><td><code>echo $$</code></td><td>PID của chính shell</td><td>shell cũng là một tiến trình — ở đây là PID 1, vì trong container nó là tiến trình đầu tiên</td></tr>
</tbody>
</table>
<p class="meo">🧠 Bảng tiến trình ở trên có đúng hai dòng: shell (<code>bash</code>) và lệnh đang in bảng (<code>ps</code>), mà cha (PPID) của nó là shell. Mọi lệnh bạn gõ đều trở thành một tiến trình con sống ngắn ngủi của shell — đó chính là "shell rút gọn" ở Chương 1, slide 32.</p>`),
    bi(`<h2>Step 2 — your first fork(): one program, two processes</h2>
<p>Save this as <code>fork-dau-tien.c</code>, compile and run it. Read the comments: <code>fork()</code> is called <em>once</em> but returns <em>twice</em> — once in the parent (with the child's PID) and once in the brand-new child (with 0).</p>
<pre><code class="language-c">// One program becomes TWO processes
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    printf("before fork: I am PID %d\\n", getpid());
    fflush(stdout);                       // empty the buffer BEFORE copying the process

    pid_t pid = fork();                   // from here on, two processes run this code
    if (pid &lt; 0) { perror("fork"); return 1; }

    if (pid == 0) {                       // fork() returned 0: I am the CHILD
        printf("CHILD : my PID is %d, my parent is %d\\n", getpid(), getppid());
        fflush(stdout);
        system("ps -o pid,ppid,stat,comm");   // look at the process table right now
        return 7;                         // the child's exit code
    }

    int status;                           // fork() returned the child's PID: I am the PARENT
    waitpid(pid, &amp;status, 0);             // wait until the child finishes
    printf("PARENT: my child %d finished with exit code %d\\n", pid, WEXITSTATUS(status));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fork-dau-tien.c -o fork-dau-tien &amp;&amp; ./fork-dau-tien<br>
before fork: I am PID 12<br>
CHILD : my PID is 13, my parent is 12<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;fork-dau-tien<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 S &nbsp;&nbsp;&nbsp;fork-dau-tien<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 R &nbsp;&nbsp;&nbsp;ps<br>
PARENT: my child 13 finished with exit code 7</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/53c08530fcb066f3c47da5c2ff5bece76784a868.svg" alt="The process tree at the moment the child runs ps — exactly the rows ps printed above" loading="lazy" /><p class="chu-thich">🧩 The process tree at the moment the child runs ps — exactly the rows ps printed above</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' The process tree while the child runs ps
skinparam defaultTextAlignment center
rectangle "bash\\n(your shell)" as B #F8FAFC
rectangle "./fork-dau-tien\\nPARENT\\nfork() returned the child's PID\\nnow in waitpid() — STAT S" as P #EEF2FF
rectangle "./fork-dau-tien\\nCHILD\\nfork() returned 0\\nruns system('ps …')" as C #ECFDF5
rectangle "sh -c 'ps …'\\n(created by system())" as S #F8FAFC
rectangle "ps\\nSTAT R (running)" as PS #FEF9C3
B --&gt; P : fork + exec\\n(you typed ./fork-dau-tien)
P --&gt; C : fork()
C --&gt; S : fork + exec
S --&gt; PS : fork + exec
@enduml</code></pre></details>
<ul>
<li><strong>"before fork" is printed once</strong>: at that point there is only one process.</li>
<li><strong>The child's parent</strong> (PPID) is the PID that the parent printed: the child knows who created it.</li>
<li><strong>The table shows four new rows</strong>: the parent (sleeping in <code>waitpid</code>, state <code>S</code>), the child, the <code>sh</code> that <code>system()</code> started, and <code>ps</code> itself (running, <code>R</code>). Each arrow in the picture is a <code>fork</code>, usually followed by <code>exec</code> (load another program).</li>
<li><strong>The parent reads the child's exit code</strong> (7) with <code>waitpid</code> + <code>WEXITSTATUS</code>. A parent that never waits leaves a <em>zombie</em> — Chapter 2.</li>
</ul>
<p class="pitfall">⚠️ FE trap: "what does <code>fork()</code> return in the child?" — <strong>0</strong>; in the parent — the <strong>child's PID</strong> (a positive number); on failure — <strong>−1</strong>. The child is a copy of the parent (same code, a copy of its memory), not a new program; loading a new program is <code>exec</code>.</p>
<div class="callout">🧭 <strong>On a real server:</strong> every <code>docker run</code>, every <code>npm start</code>, every Spring Boot <code>java -jar</code> you launch from a shell starts exactly like this — the shell forks, the child execs. When you see <code>PID 1</code> inside a container, it is the first process of that container, and it has special duties (reaping zombies, receiving <code>docker stop</code>'s signal) — the ⭐ Advanced section returns to it.</div>`,
    `<h2>Bước 2 — fork() đầu tiên: một chương trình, hai tiến trình</h2>
<p>Lưu thành <code>fork-dau-tien.c</code>, biên dịch rồi chạy. Đọc chú thích: <code>fork()</code> được gọi <em>một lần</em> nhưng trả về <em>hai lần</em> — một lần trong tiến trình cha (trả về PID của con) và một lần trong tiến trình con vừa ra đời (trả về 0).</p>
<pre><code class="language-c">// Một chương trình trở thành HAI tiến trình
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    printf("before fork: I am PID %d\\n", getpid());
    fflush(stdout);                       // xả bộ đệm TRƯỚC khi nhân bản tiến trình

    pid_t pid = fork();                   // từ đây trở đi, HAI tiến trình cùng chạy đoạn code này
    if (pid &lt; 0) { perror("fork"); return 1; }

    if (pid == 0) {                       // fork() trả 0: tôi là CON
        printf("CHILD : my PID is %d, my parent is %d\\n", getpid(), getppid());
        fflush(stdout);
        system("ps -o pid,ppid,stat,comm");   // xem bảng tiến trình ngay lúc này
        return 7;                         // mã thoát của con
    }

    int status;                           // fork() trả PID của con: tôi là CHA
    waitpid(pid, &amp;status, 0);             // đợi con chạy xong
    printf("PARENT: my child %d finished with exit code %d\\n", pid, WEXITSTATUS(status));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fork-dau-tien.c -o fork-dau-tien &amp;&amp; ./fork-dau-tien<br>
before fork: I am PID 12<br>
CHILD : my PID is 13, my parent is 12<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;fork-dau-tien<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 S &nbsp;&nbsp;&nbsp;fork-dau-tien<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;sh<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 R &nbsp;&nbsp;&nbsp;ps<br>
PARENT: my child 13 finished with exit code 7</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/53c08530fcb066f3c47da5c2ff5bece76784a868.svg" alt="Cây tiến trình đúng lúc tiến trình con chạy ps — chính là các dòng ps vừa in ở trên" loading="lazy" /><p class="chu-thich">🧩 Cây tiến trình đúng lúc tiến trình con chạy ps — chính là các dòng ps vừa in ở trên</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Cây tiến trình lúc tiến trình con chạy ps
skinparam defaultTextAlignment center
rectangle "bash\\n(your shell)" as B #F8FAFC
rectangle "./fork-dau-tien\\nPARENT\\nfork() returned the child's PID\\nnow in waitpid() — STAT S" as P #EEF2FF
rectangle "./fork-dau-tien\\nCHILD\\nfork() returned 0\\nruns system('ps …')" as C #ECFDF5
rectangle "sh -c 'ps …'\\n(created by system())" as S #F8FAFC
rectangle "ps\\nSTAT R (running)" as PS #FEF9C3
B --&gt; P : fork + exec\\n(you typed ./fork-dau-tien)
P --&gt; C : fork()
C --&gt; S : fork + exec
S --&gt; PS : fork + exec
@enduml</code></pre></details>
<ul>
<li><strong>"before fork" in đúng một lần</strong>: lúc đó mới có một tiến trình.</li>
<li><strong>Cha của tiến trình con</strong> (PPID) chính là PID mà tiến trình cha đã in: con biết ai tạo ra nó.</li>
<li><strong>Bảng có thêm bốn dòng</strong>: tiến trình cha (đang ngủ trong <code>waitpid</code>, trạng thái <code>S</code>), tiến trình con, <code>sh</code> do <code>system()</code> khởi động, và chính <code>ps</code> (đang chạy, <code>R</code>). Mỗi mũi tên trong hình là một <code>fork</code>, thường đi kèm <code>exec</code> (nạp chương trình khác).</li>
<li><strong>Cha đọc mã thoát của con</strong> (7) bằng <code>waitpid</code> + <code>WEXITSTATUS</code>. Cha không bao giờ đợi thì để lại một tiến trình <em>zombie</em> — Chương 2.</li>
</ul>
<p class="pitfall">⚠️ Bẫy FE: "<code>fork()</code> trả về gì trong tiến trình con?" — <strong>0</strong>; trong tiến trình cha — <strong>PID của con</strong> (số dương); khi lỗi — <strong>−1</strong>. Tiến trình con là bản sao của cha (cùng mã, một bản sao bộ nhớ), không phải chương trình mới; nạp chương trình mới là việc của <code>exec</code>.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> mỗi <code>docker run</code>, mỗi <code>npm start</code>, mỗi <code>java -jar</code> Spring Boot bạn chạy từ shell đều khởi đầu đúng như vậy — shell fork, tiến trình con exec. Khi thấy <code>PID 1</code> trong container, đó là tiến trình đầu tiên của container, và nó có nhiệm vụ đặc biệt (dọn zombie, nhận tín hiệu của <code>docker stop</code>) — phần ⭐ Chuyên sâu sẽ quay lại.</div>`),
    bi(`<h2>Step 3 — three short exercises (try first, then open the solution)</h2>
<h3>🧪 Exercise 1 — three fork() in a row (5 min)</h3>
<p>A program calls <code>fork(); fork(); fork();</code> and then <code>printf("hello from a process\\n")</code>. How many lines are printed?</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 2: three fork() calls in a row — how many processes print?
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    fork();                      // 1 process becomes 2
    fork();                      // each of the 2 forks: 4
    fork();                      // each of the 4 forks: 8
    printf("hello from a process\\n");
    while (wait(NULL) &gt; 0) { }   // every parent waits for its children
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ba-lan-fork.c -o ba-lan-fork &amp;&amp; ./ba-lan-fork | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 hello from a process</div>
<p><strong>8 = 2³.</strong> After the first fork there are 2 processes; <em>both</em> execute the second fork (4 processes), and all 4 execute the third (8). We pipe the output through <code>sort | uniq -c</code> to count the lines — their order changes from run to run because the 8 processes run in parallel. In general, <em>n</em> forks in a row produce 2ⁿ processes, i.e. 2ⁿ − 1 new ones. This is a classic exam question.</p>
</details>
<h3>🧪 Exercise 2 — why is "hello" printed twice? (10 min)</h3>
<p>The program prints <code>"hello "</code> (no newline) BEFORE <code>fork()</code>. Predict the output, then run it.</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 3: why does "hello" appear twice?
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    printf("hello ");            // no '\\n' and stdout is a pipe: the text waits in the buffer
    pid_t pid = fork();          // the buffer is copied into the child too
    if (pid == 0) {
        printf("from the child\\n");
        return 0;
    }
    wait(NULL);
    printf("from the parent\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bo-dem-fork.c -o bo-dem-fork &amp;&amp; ./bo-dem-fork<br>
hello from the child<br>
hello from the parent</div>
<p><code>printf</code> does not call <code>write</code> immediately: when the output is a pipe or a file, the C library keeps the text in a <strong>buffer</strong> inside the process and writes it later (at a newline only when the output is a terminal). <code>fork()</code> copies the whole memory of the parent, buffer included, so both processes later flush "hello ". The fix: <code>fflush(stdout)</code> before <code>fork()</code> — exactly what Step 2's program does. You have just met the difference between a <em>library call</em> (<code>printf</code>) and a <em>system call</em> (<code>write</code>) — Chapter 1, lesson 1.B.</p>
</details>
<h3>🧪 Exercise 3 — the exit code, seen from the shell (5 min)</h3>
<p>Compile a program whose <code>main</code> returns 42. What does <code>echo $?</code> print right after running it? And after a command that fails?</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 4: a program's exit code, seen from the shell<br>
$ cat &gt; thoat.c &lt;&lt;'END'<br>
&gt; int main(void) { return 42; }<br>
&gt; END<br>
$ gcc thoat.c -o thoat<br>
$ ./thoat<br>
$ echo "exit code = $?"<br>
exit code = 42<br>
$ ls /khong-co-thu-muc-nay<br>
ls: cannot access '/khong-co-thu-muc-nay': No such file or directory<br>
$ echo "exit code = $?"<br>
exit code = 2<br>
$ true; echo "true gives $?"; false; echo "false gives $?"<br>
true gives 0<br>
false gives 1</div>
<p><code>$?</code> holds the exit code of the last command: 42 from our program, <strong>2</strong> from <code>ls</code> on a missing folder (GNU <code>ls</code> uses 2 for "serious trouble"), 0 from <code>true</code>, 1 from <code>false</code>. Convention: <strong>0 = success, anything else = failure</strong>. Scripts, CI pipelines and Docker health checks all decide "did it work?" by this number — and a process killed by a signal shows 128 + the signal number (137 = SIGKILL, lesson "Start here").</p>
</details>
<p>Next: Chapter 1 — lesson 1.A, slide by slide.</p>`,
    `<h2>Bước 3 — ba bài tập ngắn (tự làm trước, rồi mới mở lời giải)</h2>
<h3>🧪 Bài 1 — ba lần fork() liền nhau (5 phút)</h3>
<p>Một chương trình gọi <code>fork(); fork(); fork();</code> rồi <code>printf("hello from a process\\n")</code>. In ra bao nhiêu dòng?</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 2: ba lời gọi fork() liền nhau — bao nhiêu tiến trình in ra?
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    fork();                      // 1 tiến trình thành 2
    fork();                      // mỗi tiến trình trong 2 lại fork: 4
    fork();                      // mỗi tiến trình trong 4 lại fork: 8
    printf("hello from a process\\n");
    while (wait(NULL) &gt; 0) { }   // cha nào cũng đợi các con của mình
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ba-lan-fork.c -o ba-lan-fork &amp;&amp; ./ba-lan-fork | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 hello from a process</div>
<p><strong>8 = 2³.</strong> Sau lần fork đầu có 2 tiến trình; <em>cả hai</em> chạy lần fork thứ hai (4 tiến trình), và cả 4 chạy lần thứ ba (8). Ta cho output đi qua <code>sort | uniq -c</code> để đếm dòng — thứ tự các dòng đổi theo từng lần chạy vì 8 tiến trình chạy song song. Tổng quát, <em>n</em> lần fork liền nhau sinh ra 2ⁿ tiến trình, tức 2ⁿ − 1 tiến trình mới. Đây là câu thi kinh điển.</p>
</details>
<h3>🧪 Bài 2 — vì sao "hello" bị in hai lần? (10 phút)</h3>
<p>Chương trình in <code>"hello "</code> (không xuống dòng) TRƯỚC <code>fork()</code>. Đoán output, rồi chạy thử.</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 3: vì sao "hello" xuất hiện hai lần?
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    printf("hello ");            // không có '\\n' và stdout là pipe: chữ còn nằm trong bộ đệm
    pid_t pid = fork();          // bộ đệm bị chép sang cả con
    if (pid == 0) {
        printf("from the child\\n");
        return 0;
    }
    wait(NULL);
    printf("from the parent\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bo-dem-fork.c -o bo-dem-fork &amp;&amp; ./bo-dem-fork<br>
hello from the child<br>
hello from the parent</div>
<p><code>printf</code> không gọi <code>write</code> ngay: khi output là pipe hay tệp, thư viện C giữ chữ trong một <strong>bộ đệm (buffer)</strong> nằm trong tiến trình và ghi ra sau (chỉ ghi ngay ở dấu xuống dòng khi output là terminal). <code>fork()</code> chép toàn bộ bộ nhớ của cha, cả bộ đệm, nên về sau cả hai tiến trình đều xả "hello " ra. Cách sửa: <code>fflush(stdout)</code> trước <code>fork()</code> — đúng như chương trình ở Bước 2 đã làm. Bạn vừa gặp khác biệt giữa <em>lời gọi thư viện</em> (<code>printf</code>) và <em>lời gọi hệ thống</em> (<code>write</code>) — Chương 1, bài 1.B.</p>
</details>
<h3>🧪 Bài 3 — mã thoát, nhìn từ shell (5 phút)</h3>
<p>Biên dịch một chương trình có <code>main</code> trả về 42. Ngay sau khi chạy nó, <code>echo $?</code> in ra gì? Còn sau một lệnh bị lỗi?</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 4: mã thoát của chương trình, nhìn từ shell<br>
$ cat &gt; thoat.c &lt;&lt;'END'<br>
&gt; int main(void) { return 42; }<br>
&gt; END<br>
$ gcc thoat.c -o thoat<br>
$ ./thoat<br>
$ echo "exit code = $?"<br>
exit code = 42<br>
$ ls /khong-co-thu-muc-nay<br>
ls: cannot access '/khong-co-thu-muc-nay': No such file or directory<br>
$ echo "exit code = $?"<br>
exit code = 2<br>
$ true; echo "true gives $?"; false; echo "false gives $?"<br>
true gives 0<br>
false gives 1</div>
<p><code>$?</code> giữ mã thoát (exit code) của lệnh vừa chạy: 42 từ chương trình của ta, <strong>2</strong> từ <code>ls</code> với thư mục không tồn tại (<code>ls</code> của GNU dùng 2 cho "lỗi nghiêm trọng"), 0 từ <code>true</code>, 1 từ <code>false</code>. Quy ước: <strong>0 = thành công, mọi số khác = thất bại</strong>. Script, pipeline CI và health check của Docker đều quyết định "chạy được chưa?" bằng con số này — và tiến trình bị giết bằng tín hiệu thì có mã 128 + số hiệu tín hiệu (137 = SIGKILL, bài "Bắt đầu tại đây").</p>
</details>
<p>Tiếp theo: Chương 1 — bài 1.A học theo từng slide.</p>`),
  ].join('\n'),
};

export default {
  extrasStart: [L_x_bat_dau_tai_day, L_x_hoc_the_nao, L_x_cai_moi_truong, L_x_buoi_dau_tien],
};
