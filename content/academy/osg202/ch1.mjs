/**
 * OSG202 · Chương 1 — Introduction (osg1: 1.A slide 1–26, 1.B slide 27–47).
 * Bài 📑 học theo từng slide: osg1 (tmp_01.pptx, slide 1–47).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch1.
 * Quiz viết lại (10 câu, giữ slug osg202-quiz-ch1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 1.A — 📑 Slide by slide · Introduction: what an OS is, history, hardware, the OS zoo, processes, files, pipes (slides 1–26) ───────── */
const L_osg1_1 = {
  title: '1.A — 📑 Slide by slide · Introduction: what an OS is, history, hardware, the OS zoo, processes, files, pipes (slides 1–26)|||1.A — 📑 Học theo từng slide · Introduction: HĐH là gì, lịch sử, phần cứng, vườn thú HĐH, tiến trình, tệp, pipe (slide 1–26)',
  slug: 'osg202-slide-osg1-1',
  type: 'VIDEO',
  description: 'Giảng đủ 26 slide đầu của Chương 1 (Tanenbaum, Modern Operating Systems 4e): các bộ phận của máy tính và chỗ đứng của hệ điều hành, hai vai cỗ máy mở rộng và người quản lý tài nguyên, năm thế hệ máy tính từ hệ lô tới đa chương trình, ôn phần cứng (bộ xử lý, pipeline, đa nhân, phân cấp bộ nhớ, đĩa, ngắt, bus), vườn thú hệ điều hành, tiến trình, cây tiến trình, hệ thống tệp, mount và pipe — mỗi ý có lệnh hoặc chương trình C chạy thật trên Linux (lệnh đặc quyền bị chặn, thanh ghi CPU ở chế độ người dùng, đo độ trễ bộ nhớ thật, đếm ngắt, dựng lại Hình 1-13 và 1-15), hình do bộ mô phỏng tính (đa chương trình, hiệu suất CPU 1 − pⁿ, pipeline) và chỉ rõ chỗ slide đã lỗi thời.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.A · deck "Chapter 1 · Introduction", slides 1–26</span>
<h2>What the operating system is, where it came from, and the hardware it manages</h2>
<p class="lead">The first half of the deck follows Tanenbaum's sections 1.1–1.5: what an operating system is (two definitions), its history in five generations, a fast review of the hardware (processors, memory, disks, I/O, buses), the "zoo" of operating systems, and the first OS concepts — processes, files, mounting and pipes. The slides are mostly a title plus a figure from the book, so every figure is explained in full, and every idea that can be <em>seen</em> on Linux is shown with a real command or C program run in the course container.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>1.1 What is an operating system?</td><td>explain the two views of an OS and where it sits (user mode vs kernel mode)</td></tr>
<tr><td>6–10</td><td>1.2 History of operating systems</td><td>say why batch systems, multiprogramming and timesharing were invented</td></tr>
<tr><td>11–19</td><td>1.3 Computer hardware review</td><td>describe the CPU, caches, the memory hierarchy, disks, interrupts and buses an OS must manage</td></tr>
<tr><td>20</td><td>1.4 The operating system zoo</td><td>name the nine kinds of OS and the constraint each optimises</td></tr>
<tr><td>21–26</td><td>1.5 Operating system concepts</td><td>define a process, a process tree, a file system, mounting, a pipe</td></tr>
</tbody>
</table>
<div class="callout">The older web lessons 1.1–1.4 further down stay as short summaries; this lesson refers to them instead of repeating them (for example, lesson 1.3 has the DMA story and lesson 1.2 the zoo in detail).</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.A · deck "Chapter 1 · Introduction", slide 1–26</span>
<h2>Hệ điều hành là gì, nó từ đâu tới, và phần cứng nó quản lý</h2>
<p class="lead">Nửa đầu bộ slide đi theo mục 1.1–1.5 của Tanenbaum: hệ điều hành là gì (hai định nghĩa), lịch sử qua năm thế hệ, ôn nhanh phần cứng (bộ xử lý, bộ nhớ, đĩa, I/O, bus), "vườn thú" hệ điều hành, và các khái niệm đầu tiên — tiến trình, tệp, mount và pipe. Slide phần lớn chỉ có tiêu đề và một hình của sách, nên hình nào cũng được giảng trọn, và ý nào <em>nhìn thấy được</em> trên Linux đều có lệnh hoặc chương trình C chạy thật trong container của môn.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>1.1 Hệ điều hành là gì?</td><td>giải thích hai góc nhìn về HĐH và chỗ đứng của nó (chế độ người dùng và chế độ nhân)</td></tr>
<tr><td>6–10</td><td>1.2 Lịch sử hệ điều hành</td><td>nói được vì sao hệ lô, đa chương trình và chia sẻ thời gian ra đời</td></tr>
<tr><td>11–19</td><td>1.3 Ôn phần cứng máy tính</td><td>mô tả CPU, cache, phân cấp bộ nhớ, đĩa, ngắt và bus mà HĐH phải quản lý</td></tr>
<tr><td>20</td><td>1.4 Vườn thú hệ điều hành</td><td>kể tên chín loại HĐH và ràng buộc mà mỗi loại tối ưu</td></tr>
<tr><td>21–26</td><td>1.5 Các khái niệm của HĐH</td><td>định nghĩa tiến trình, cây tiến trình, hệ thống tệp, mount, pipe</td></tr>
</tbody>
</table>
<div class="callout">Các bài web cũ 1.1–1.4 phía dưới vẫn giữ làm bản tóm tắt ngắn; bài này dẫn sang chúng thay vì lặp lại (ví dụ bài 1.3 có câu chuyện DMA, bài 1.2 có vườn thú chi tiết).</div>`),
    walkHead('osg1', 1, 26),
    walk('osg1', [
      [1, 'Introduction',
        `<p class="y-chinh">🎯 Chapter 1 of <em>Modern Operating Systems</em> (Tanenbaum &amp; Bos, 4th edition, 2015) — syllabus sessions 1–4 and 7–9, outcome CLO1 "understand the main concepts of operating systems".</p>
<p>Every slide carries the line "Tanenbaum &amp; Bos … Pearson Education": these are the publisher's official slides for the textbook, so each figure number (Figure 1-1, 1-2…) is the same in the book — when a slide is too short, open the book at that figure.</p>
<p>The chapter is the map of the whole course: almost every later chapter is one section of it, grown into a full chapter (processes → Chapter 2, memory → Chapter 3, files → Chapter 4, I/O → Chapter 5).</p>
<p class="meo">🧠 Chapter 1 in one sentence: <em>the OS is the software that turns raw hardware into processes, address spaces and files, and shares it safely between programs.</em></p>`,
        `<p class="y-chinh">🎯 Chương 1 của <em>Modern Operating Systems</em> (Tanenbaum &amp; Bos, bản 4, 2015) — buổi 1–4 và 7–9 theo đề cương, chuẩn đầu ra CLO1 "hiểu các khái niệm chính của hệ điều hành".</p>
<p>Slide nào cũng có dòng "Tanenbaum &amp; Bos … Pearson Education": đây là bộ slide chính thức của nhà xuất bản cho cuốn sách, nên số hình (Figure 1-1, 1-2…) trùng với sách — slide nào quá ngắn thì mở sách đúng hình đó.</p>
<p>Chương này là bản đồ của cả môn: gần như mỗi chương sau là một mục của nó được nở thành cả chương (tiến trình → Chương 2, bộ nhớ → Chương 3, tệp → Chương 4, I/O → Chương 5).</p>
<p class="meo">🧠 Chương 1 trong một câu: <em>HĐH là phần mềm biến phần cứng trần trụi thành tiến trình, không gian địa chỉ và tệp, rồi chia chúng an toàn cho các chương trình.</em></p>`],
      [2, 'Components of a Modern Computer (1)',
        `<p class="y-chinh">🎯 A modern computer = one or more <strong>processors</strong>, <strong>main memory</strong>, <strong>disks</strong>, and many <strong>I/O devices</strong> (printers, keyboard, mouse, display, network interfaces). The OS must manage all of them.</p>
<p>The list looks simple, but each item hides a hard problem: several programs want the same CPU; memory must be shared without programs reading each other's data; disks are slow and must be organised into files; every device speaks a different language. Writing programs that drive all this directly would be impossible for application programmers — hence an OS.</p>
<p>➕ You can ask a running Linux which components it found. This is the real answer of the course container (a Linux virtual machine on an Apple-silicon Mac):</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># The components of THIS computer, asked from inside Linux<br>
# processors<br>
$ nproc<br>
10<br>
$ lscpu | grep -E '^(Architecture|CPU\\(s\\)|Vendor ID)'<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
CPU(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Vendor ID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apple<br>
# main memory<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
# disks<br>
$ lsblk -d -o NAME,SIZE,TYPE | grep -v nbd<br>
NAME &nbsp;&nbsp;&nbsp;SIZE TYPE<br>
vda &nbsp;&nbsp;926.4G disk<br>
vdb &nbsp;&nbsp;646.3M disk<br>
# the buses the kernel knows<br>
$ ls /sys/bus | tr '\\n' ' '; echo<br>
amba clockevents clocksource container cpu dax event_source faux gpio hid i2c mdio_bus mmc mmc_rpmb nd pci pci_express platform scsi sdio serial serial-base serio soc typec usb usb-serial virtio workqueue</div>
<p>Ten processors, about 8 GB of main memory (<code>MemTotal</code>, in KiB), a 926 GB virtual disk <code>vda</code>, and the list of <strong>buses</strong> the kernel manages (<code>pci</code>, <code>usb</code>, <code>virtio</code>…). On your WSL or laptop the numbers differ; the questions are the same.</p>
<p class="meo">🧠 "I/O device" = anything that moves data in or out of the computer — input/output. The OS reaches each one through a <strong>device driver</strong> (slide 17).</p>`,
        `<p class="y-chinh">🎯 Một máy tính hiện đại = một hay nhiều <strong>bộ xử lý (processor)</strong>, <strong>bộ nhớ chính (main memory)</strong>, <strong>đĩa (disk)</strong>, và nhiều <strong>thiết bị vào/ra (I/O device)</strong> (máy in, bàn phím, chuột, màn hình, giao diện mạng). HĐH phải quản lý tất cả.</p>
<p>Danh sách trông đơn giản, nhưng mỗi dòng giấu một bài toán khó: nhiều chương trình cùng muốn một CPU; bộ nhớ phải chia sao cho chương trình không đọc được dữ liệu của nhau; đĩa thì chậm và phải được tổ chức thành tệp; mỗi thiết bị nói một "ngôn ngữ" riêng. Bắt người viết ứng dụng tự điều khiển hết những thứ đó là bất khả thi — vì thế cần HĐH.</p>
<p>➕ Bạn có thể hỏi một Linux đang chạy xem nó tìm thấy những bộ phận nào. Đây là câu trả lời thật của container môn học (một máy ảo Linux trên Mac chip Apple):</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Các bộ phận của CHÍNH máy này, hỏi từ bên trong Linux<br>
# bộ xử lý<br>
$ nproc<br>
10<br>
$ lscpu | grep -E '^(Architecture|CPU\\(s\\)|Vendor ID)'<br>
Architecture: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;aarch64<br>
CPU(s): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10<br>
Vendor ID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Apple<br>
# bộ nhớ chính<br>
$ grep MemTotal /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
# ổ đĩa<br>
$ lsblk -d -o NAME,SIZE,TYPE | grep -v nbd<br>
NAME &nbsp;&nbsp;&nbsp;SIZE TYPE<br>
vda &nbsp;&nbsp;926.4G disk<br>
vdb &nbsp;&nbsp;646.3M disk<br>
# các bus mà nhân biết<br>
$ ls /sys/bus | tr '\\n' ' '; echo<br>
amba clockevents clocksource container cpu dax event_source faux gpio hid i2c mdio_bus mmc mmc_rpmb nd pci pci_express platform scsi sdio serial serial-base serio soc typec usb usb-serial virtio workqueue</div>
<p>Mười bộ xử lý, khoảng 8 GB bộ nhớ chính (<code>MemTotal</code>, đơn vị KiB), một đĩa ảo 926 GB <code>vda</code>, và danh sách <strong>bus</strong> mà nhân quản lý (<code>pci</code>, <code>usb</code>, <code>virtio</code>…). Trên WSL hay laptop của bạn con số khác; câu hỏi thì như nhau.</p>
<p class="meo">🧠 "Thiết bị I/O" = mọi thứ đưa dữ liệu vào hoặc ra khỏi máy — input/output. HĐH tới được từng thiết bị qua một <strong>trình điều khiển thiết bị (device driver)</strong> (slide 17).</p>`],
      [3, 'Components of a Modern Computer (2)',
        `<p class="y-chinh">🎯 Figure 1-1: the OS is the software that runs in <strong>kernel mode</strong>, directly above the hardware; everything else — the shell or GUI ("user interface program") and applications such as a web browser, e-mail reader or music player — runs in <strong>user mode</strong>.</p>
<p>The CPU has (at least) two modes, recorded by a bit in a special register. In <strong>kernel mode</strong> (supervisor mode) the code may execute every instruction and touch every device. In <strong>user mode</strong> a subset of instructions — I/O, memory protection, turning interrupts off — is forbidden. That bit is what makes an OS more than "just another program".</p>
<p>➕ See it for real. This C program, running as a normal process, tries one privileged instruction — disabling interrupts:</p>
<pre><code class="language-c">// A user program tries ONE privileged instruction: "turn off interrupts"
#include &lt;stdio.h&gt;

int main(void) {
    printf("user mode: trying to disable interrupts...\\n");
    fflush(stdout);
#if defined(__aarch64__)
    __asm__ volatile("msr daifset, #2");   // ARM64: mask IRQ interrupts — allowed only in kernel mode
#else
    __asm__ volatile("cli");               // x86: clear the interrupt flag — kernel mode only
#endif
    printf("interrupts are off!\\n");       // never reached
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread che-do.c -o che-do &amp;&amp; ./che-do<br>
user mode: trying to disable interrupts...<br>
Illegal instruction<br>
[exit code 132]</div>
<p>The CPU refused, trapped into the kernel, and the kernel killed the program with the signal SIGILL ("Illegal instruction", exit code 128 + 4 = 132). On an x86 PC the same attempt (<code>cli</code>) ends with a segmentation fault instead — different CPU, same protection.</p>
<p class="pitfall">⚠️ The shell and the GUI are drawn in user mode on purpose: they are ordinary programs, not part of the OS kernel. "Which part runs in kernel mode?" — only the operating system (kernel). FE question type.</p>`,
        `<p class="y-chinh">🎯 Hình 1-1: HĐH là phần mềm chạy ở <strong>chế độ nhân (kernel mode)</strong>, nằm ngay trên phần cứng; mọi thứ còn lại — shell hay giao diện đồ hoạ ("chương trình giao diện người dùng") và các ứng dụng như trình duyệt web, trình đọc thư, trình phát nhạc — chạy ở <strong>chế độ người dùng (user mode)</strong>.</p>
<p>CPU có (ít nhất) hai chế độ, ghi bằng một bit trong một thanh ghi đặc biệt. Ở <strong>chế độ nhân</strong> (còn gọi supervisor mode) mã được chạy mọi lệnh và chạm mọi thiết bị. Ở <strong>chế độ người dùng</strong> một nhóm lệnh — I/O, bảo vệ bộ nhớ, tắt ngắt — bị cấm. Chính bit đó làm HĐH khác hẳn "một chương trình bình thường".</p>
<p>➕ Xem tận mắt. Chương trình C này, chạy như một tiến trình bình thường, thử một lệnh đặc quyền — tắt ngắt:</p>
<pre><code class="language-c">// Chương trình người dùng thử MỘT lệnh đặc quyền: "tắt ngắt"
#include &lt;stdio.h&gt;

int main(void) {
    printf("user mode: trying to disable interrupts...\\n");
    fflush(stdout);
#if defined(__aarch64__)
    __asm__ volatile("msr daifset, #2");   // ARM64: che ngắt IRQ — chỉ chế độ nhân được làm
#else
    __asm__ volatile("cli");               // x86: xoá cờ ngắt — chỉ chế độ nhân
#endif
    printf("interrupts are off!\\n");       // không bao giờ tới được
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread che-do.c -o che-do &amp;&amp; ./che-do<br>
user mode: trying to disable interrupts...<br>
Illegal instruction<br>
[exit code 132]</div>
<p>CPU từ chối, bẫy (trap) vào nhân, và nhân giết chương trình bằng tín hiệu SIGILL ("Illegal instruction" — lệnh không hợp lệ, mã thoát 128 + 4 = 132). Trên PC x86, cùng thao tác đó (<code>cli</code>) lại kết thúc bằng segmentation fault — CPU khác, cùng một sự bảo vệ.</p>
<p class="pitfall">⚠️ Shell và giao diện đồ hoạ được vẽ ở chế độ người dùng là có chủ ý: chúng là chương trình bình thường, không thuộc nhân HĐH. "Phần nào chạy ở chế độ nhân?" — chỉ hệ điều hành (nhân). Dạng câu FE.</p>`],
      [4, 'The Operating System as an Extended Machine',
        `<p class="y-chinh">🎯 Figure 1-2, the top-down view: the OS turns <strong>ugly hardware interfaces</strong> into <strong>beautiful abstractions</strong> — files instead of disk sectors, processes instead of a raw CPU, address spaces instead of physical memory.</p>
<p>The "ugly faces" at the bottom are real: to read a disk without an OS you would program the disk controller's registers, compute cylinder, head and sector, handle errors and retries, and wait for an interrupt. Application programmers never want to see that. The OS offers clean, uniform calls on top — the "beautiful" layer the applications see.</p>
<p>➕ One abstraction, three devices: the same <code>write()</code> system call writes to a pipe, to a file on disk, and to <code>/dev/null</code> (a device that throws everything away). The program does not know or care which is which:</p>
<pre><code class="language-c">// One system call, write(), for three very different "devices"
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    const char *msg = "same bytes, same call\\n";
    int file = open("/tmp/demo.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);   // a file on disk
    int nul  = open("/dev/null", O_WRONLY);                                   // a device that discards everything
    ssize_t a = write(1, msg, strlen(msg));       // fd 1: whatever stdout is (here a pipe)
    ssize_t b = write(file, msg, strlen(msg));
    ssize_t c = write(nul, msg, strlen(msg));
    printf("stdout: %zd bytes, file: %zd bytes, /dev/null: %zd bytes\\n", a, b, c);
    close(file); close(nul);
    char buf[64] = {0};
    int f = open("/tmp/demo.txt", O_RDONLY);
    read(f, buf, sizeof buf - 1);
    printf("read back from the file: %s", buf);
    close(f);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread mot-giao-dien.c -o mot-giao-dien &amp;&amp; ./mot-giao-dien<br>
same bytes, same call<br>
stdout: 22 bytes, file: 22 bytes, /dev/null: 22 bytes<br>
read back from the file: same bytes, same call</div>
<p>Behind each <code>write</code> the kernel ran completely different code (pipe buffer, file system + disk driver, the null driver) — that difference is exactly the ugliness the OS hides.</p>
<p class="meo">🧠 <strong>Abstraction</strong> = keep what matters, hide the details. The four great abstractions of this course: process (Ch. 2), address space (Ch. 3), file (Ch. 4), and the device as a file (Ch. 5).</p>`,
        `<p class="y-chinh">🎯 Hình 1-2, góc nhìn từ trên xuống: HĐH biến <strong>giao diện phần cứng xấu xí</strong> thành <strong>trừu tượng đẹp đẽ (abstraction)</strong> — tệp thay cho sector trên đĩa, tiến trình thay cho CPU trần, không gian địa chỉ thay cho bộ nhớ vật lý.</p>
<p>"Gương mặt xấu xí" ở dưới là có thật: muốn đọc đĩa khi không có HĐH, bạn phải lập trình các thanh ghi của bộ điều khiển đĩa, tính cylinder, đầu đọc và sector, xử lý lỗi và đọc lại, rồi chờ ngắt. Người viết ứng dụng không bao giờ muốn thấy cảnh đó. HĐH đưa ra các lời gọi gọn gàng, thống nhất ở phía trên — tầng "đẹp" mà ứng dụng nhìn thấy.</p>
<p>➕ Một trừu tượng, ba thiết bị: cùng một lời gọi hệ thống <code>write()</code> ghi vào pipe, vào một tệp trên đĩa, và vào <code>/dev/null</code> (thiết bị vứt bỏ mọi thứ). Chương trình không biết, cũng không cần biết, cái nào là cái nào:</p>
<pre><code class="language-c">// Một lời gọi hệ thống, write(), cho ba "thiết bị" rất khác nhau
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    const char *msg = "same bytes, same call\\n";
    int file = open("/tmp/demo.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);   // một tệp trên đĩa
    int nul  = open("/dev/null", O_WRONLY);                                   // thiết bị vứt bỏ mọi thứ
    ssize_t a = write(1, msg, strlen(msg));       // fd 1: stdout là gì cũng được (ở đây là pipe)
    ssize_t b = write(file, msg, strlen(msg));
    ssize_t c = write(nul, msg, strlen(msg));
    printf("stdout: %zd bytes, file: %zd bytes, /dev/null: %zd bytes\\n", a, b, c);
    close(file); close(nul);
    char buf[64] = {0};
    int f = open("/tmp/demo.txt", O_RDONLY);
    read(f, buf, sizeof buf - 1);
    printf("read back from the file: %s", buf);
    close(f);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread mot-giao-dien.c -o mot-giao-dien &amp;&amp; ./mot-giao-dien<br>
same bytes, same call<br>
stdout: 22 bytes, file: 22 bytes, /dev/null: 22 bytes<br>
read back from the file: same bytes, same call</div>
<p>Đằng sau mỗi lần <code>write</code>, nhân chạy những đoạn mã hoàn toàn khác nhau (bộ đệm pipe, hệ thống tệp + driver đĩa, driver null) — chính sự khác nhau đó là phần xấu xí HĐH giấu đi.</p>
<p class="meo">🧠 <strong>Trừu tượng hoá</strong> = giữ cái quan trọng, giấu chi tiết. Bốn trừu tượng lớn của môn: tiến trình (Ch. 2), không gian địa chỉ (Ch. 3), tệp (Ch. 4), và thiết bị như một tệp (Ch. 5).</p>`],
      [5, 'The Operating System as a Resource Manager',
        `<p class="y-chinh">🎯 Three views of the same OS: <strong>top-down</strong> — it provides abstractions to programs (slide 4); <strong>bottom-up</strong> — it manages the pieces of a complex system; and the alternative view — it provides an <strong>orderly, controlled allocation of resources</strong> (CPU, memory, devices) among competing programs.</p>
<p>Resource management means <strong>multiplexing</strong> (sharing) in two ways. <strong>In time</strong>: programs take turns on the same resource — the CPU runs one, then another (Chapter 2 scheduling), a printer prints one job, then the next. <strong>In space</strong>: each program gets a part of the resource at the same time — memory is split between programs (Chapter 3), a disk holds files of many users (Chapter 4).</p>
<p>➕ Time multiplexing, seen for real: three busy programs (<code>yes</code> prints "y" forever) are pinned to <strong>one</strong> CPU core with <code>taskset -c 0</code>. After 3 seconds, <code>ps</code> shows how the kernel shared that core:</p>
<div class="out"># Three busy programs on ONE CPU core: the OS shares the core in time<br>
$ taskset -c 0 yes &gt; /dev/null &amp;<br>
$ taskset -c 0 yes &gt; /dev/null &amp;<br>
$ taskset -c 0 yes &gt; /dev/null &amp;<br>
$ sleep 3<br>
$ ps -o comm,psr,pcpu -C yes<br>
COMMAND &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PSR %CPU<br>
yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 30.9<br>
yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 30.9<br>
yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 30.6<br>
$ kill %1 %2 %3</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>All three ran on processor 0 (column <code>PSR</code>) and each received about a third of it (<code>%CPU</code>): the scheduler switched between them many times per second, so each one "felt" it was running all the time.</p>
<p class="meo">🧠 Time sharing = CPU, printer. Space sharing = memory, disk. If a FE question asks "which resource is multiplexed in space?" — memory or disk.</p>`,
        `<p class="y-chinh">🎯 Ba góc nhìn về cùng một HĐH: <strong>từ trên xuống</strong> — nó cung cấp trừu tượng cho chương trình (slide 4); <strong>từ dưới lên</strong> — nó quản lý các mảnh của một hệ thống phức tạp; và góc nhìn khác — nó <strong>cấp phát tài nguyên một cách trật tự, có kiểm soát</strong> (CPU, bộ nhớ, thiết bị) cho các chương trình đang tranh nhau.</p>
<p>Quản lý tài nguyên nghĩa là <strong>dồn kênh (multiplexing)</strong> — chia sẻ — theo hai cách. <strong>Theo thời gian</strong>: các chương trình thay phiên dùng cùng một tài nguyên — CPU chạy chương trình này rồi tới chương trình khác (lập lịch, Chương 2), máy in in job này rồi job sau. <strong>Theo không gian</strong>: mỗi chương trình nhận một phần tài nguyên cùng lúc — bộ nhớ chia cho nhiều chương trình (Chương 3), một đĩa chứa tệp của nhiều người (Chương 4).</p>
<p>➕ Dồn kênh theo thời gian, xem tận mắt: ba chương trình bận rộn (<code>yes</code> in chữ "y" mãi mãi) bị ghim vào <strong>một</strong> lõi CPU bằng <code>taskset -c 0</code>. Sau 3 giây, <code>ps</code> cho thấy nhân đã chia lõi đó ra sao:</p>
<div class="out"># Ba chương trình bận trên MỘT lõi CPU: HĐH chia lõi theo thời gian<br>
$ taskset -c 0 yes &gt; /dev/null &amp;<br>
$ taskset -c 0 yes &gt; /dev/null &amp;<br>
$ taskset -c 0 yes &gt; /dev/null &amp;<br>
$ sleep 3<br>
$ ps -o comm,psr,pcpu -C yes<br>
COMMAND &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PSR %CPU<br>
yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 30.9<br>
yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 30.9<br>
yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 30.6<br>
$ kill %1 %2 %3</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cả ba chạy trên bộ xử lý 0 (cột <code>PSR</code>) và mỗi cái nhận khoảng một phần ba (<code>%CPU</code>): bộ lập lịch chuyển qua lại giữa chúng nhiều lần mỗi giây, nên cái nào cũng "tưởng" mình được chạy liên tục.</p>
<p class="meo">🧠 Chia theo thời gian = CPU, máy in. Chia theo không gian = bộ nhớ, đĩa. FE hỏi "tài nguyên nào được dồn kênh theo không gian?" — bộ nhớ hoặc đĩa.</p>`],
      [6, 'History of Operating Systems',
        `<p class="y-chinh">🎯 Five generations, each tied to a hardware technology: (1) 1945–55 vacuum tubes, (2) 1955–65 transistors and batch systems, (3) 1965–1980 integrated circuits (ICs) and multiprogramming, (4) 1980–present personal computers, (5) 1990–present mobile computers.</p>
<p>First generation: no operating system and no programming languages — programmers plugged wires into plugboards and booked the machine by the hour; by the early 1950s punched cards replaced plugboards. Second: transistors made computers reliable enough to sell (mainframes), and <strong>batch systems</strong> appeared (slides 7–9). Third: the IBM System/360 family and <strong>multiprogramming</strong>, <strong>spooling</strong> and <strong>timesharing</strong> (slide 10). Fourth: microprocessors put a computer on every desk — MS-DOS, Windows, UNIX workstations, Linux. Fifth: smartphones and tablets — Android and iOS.</p>
<p>The older web lesson 1.2 explains the generations as "each one solved a problem of the previous one"; read it after this slide.</p>
<p class="pitfall">⚠️ Learn the <em>order</em> and the <em>idea</em> of each generation, not exact years: "batch systems belong to the second generation", "multiprogramming to the third" are typical FE answers.</p>`,
        `<p class="y-chinh">🎯 Năm thế hệ, mỗi thế hệ gắn một công nghệ phần cứng: (1) 1945–55 đèn điện tử chân không, (2) 1955–65 bóng bán dẫn và hệ lô (batch), (3) 1965–1980 vi mạch tích hợp (IC) và đa chương trình (multiprogramming), (4) 1980–nay máy tính cá nhân, (5) 1990–nay thiết bị di động.</p>
<p>Thế hệ một: chưa có hệ điều hành, chưa có ngôn ngữ lập trình — lập trình viên cắm dây trên bảng cắm (plugboard) và đặt lịch dùng máy theo giờ; đầu thập niên 1950 bìa đục lỗ thay cho bảng cắm. Thế hệ hai: bóng bán dẫn làm máy đủ tin cậy để bán (máy lớn — mainframe), và <strong>hệ lô</strong> ra đời (slide 7–9). Thế hệ ba: dòng IBM System/360 cùng <strong>đa chương trình</strong>, <strong>spooling</strong> và <strong>chia sẻ thời gian (timesharing)</strong> (slide 10). Thế hệ bốn: bộ vi xử lý đặt một máy tính lên mỗi bàn làm việc — MS-DOS, Windows, máy trạm UNIX, Linux. Thế hệ năm: điện thoại thông minh và máy tính bảng — Android và iOS.</p>
<p>Bài web cũ 1.2 giải thích các thế hệ theo kiểu "mỗi thế hệ giải một bài toán của thế hệ trước"; đọc nó sau slide này.</p>
<p class="pitfall">⚠️ Nhớ <em>thứ tự</em> và <em>ý tưởng</em> của mỗi thế hệ, không cần năm chính xác: "hệ lô thuộc thế hệ hai", "đa chương trình thuộc thế hệ ba" là đáp án FE điển hình.</p>`],
      [7, 'Transistors and Batch Systems (1)',
        `<p class="y-chinh">🎯 Figure 1-3 (a)–(b): an early batch system. Programmers bring their decks of punched cards to a cheap <strong>IBM 1401</strong>, which reads a whole batch of jobs onto a magnetic <strong>tape</strong>.</p>
<p>A <strong>job</strong> = one program (or a set of programs) plus its data, punched on cards. The expensive machine (the IBM 7094, next slide) cost millions of dollars, and walking to it with a card deck, waiting for a printer and then loading the next deck wasted most of its time. The idea of batch: collect many jobs first, then run them one after another without humans in between.</p>
<p>The 1401 was good at card reading, tape copying and printing, but poor at calculation; the 7094 was the opposite. Splitting the work this way is the first example of <strong>offline I/O</strong> — slow input/output done on a cheap machine so the fast one never waits for people.</p>
<p class="meo">🧠 Picture: 1401 = the receptionist collecting forms into a box (the tape); 7094 = the expert who processes the whole box at once.</p>`,
        `<p class="y-chinh">🎯 Hình 1-3 (a)–(b): một hệ lô (batch system) đời đầu. Lập trình viên mang các xấp bìa đục lỗ tới một chiếc <strong>IBM 1401</strong> rẻ tiền, máy này đọc cả một lô job vào <strong>băng từ (tape)</strong>.</p>
<p>Một <strong>job</strong> = một chương trình (hay một nhóm chương trình) cộng dữ liệu của nó, đục trên bìa. Chiếc máy đắt tiền (IBM 7094, slide sau) giá hàng triệu đô-la, và việc người ta cầm xấp bìa đi tới, chờ máy in, rồi nạp xấp tiếp theo làm phí phần lớn thời gian của nó. Ý tưởng của hệ lô: gom nhiều job trước, rồi chạy nối đuôi nhau, không có con người chen giữa.</p>
<p>Máy 1401 giỏi đọc bìa, chép băng và in, nhưng tính toán kém; 7094 thì ngược lại. Chia việc như vậy là ví dụ đầu tiên của <strong>I/O ngoại tuyến (offline I/O)</strong> — phần vào/ra chậm làm trên máy rẻ để máy nhanh không bao giờ phải chờ người.</p>
<p class="meo">🧠 Hình dung: 1401 = cô lễ tân gom đơn vào hộp (cuộn băng); 7094 = chuyên gia xử lý cả hộp một lượt.</p>`],
      [8, 'Transistors and Batch Systems (2)',
        `<p class="y-chinh">🎯 Figure 1-3 (c)–(f): the operator carries the input tape to the <strong>7094</strong>, which does the computing and writes results to an output tape; the operator carries that tape back to the 1401, which prints the output.</p>
<p>On the 7094 a special program — the ancestor of today's OS, for example IBM's IBSYS — read the first job from the tape, ran it, wrote its output, then read the next job, and so on. The human <strong>operator</strong> only moved tapes. Turnaround for a programmer was hours, sometimes a day: you handed in cards in the morning and collected a printout later.</p>
<p>➕ Batch processing never died. A nightly bank settlement, a <code>cron</code> job that backs up a database at 2 a.m., a CI pipeline that compiles and tests every commit, a Spark job over yesterday's logs, a Kubernetes <code>Job</code> — all are batch: no user waits at a screen, the system runs queued work as efficiently as possible.</p>
<p class="pitfall">⚠️ Batch systems maximise <strong>throughput</strong> (jobs finished per hour) and CPU use, not response time — FE6 asked exactly "which goal is focused on maximising jobs completed per hour in batch systems?" → throughput.</p>`,
        `<p class="y-chinh">🎯 Hình 1-3 (c)–(f): người vận hành mang cuộn băng đầu vào tới <strong>7094</strong>, máy tính toán và ghi kết quả ra băng đầu ra; người vận hành mang cuộn băng đó về lại 1401 để in kết quả.</p>
<p>Trên 7094 có một chương trình đặc biệt — tổ tiên của HĐH ngày nay, ví dụ IBSYS của IBM — đọc job đầu tiên trên băng, chạy nó, ghi output, rồi đọc job kế tiếp, cứ thế. <strong>Người vận hành (operator)</strong> chỉ việc chuyển băng. Thời gian chờ kết quả của một lập trình viên là hàng giờ, có khi cả ngày: sáng nộp bìa, chiều mới nhận bản in.</p>
<p>➕ Xử lý theo lô chưa bao giờ biến mất. Đối soát ngân hàng ban đêm, một job <code>cron</code> sao lưu cơ sở dữ liệu lúc 2 giờ sáng, pipeline CI biên dịch và kiểm thử mỗi commit, một job Spark chạy trên log hôm qua, một <code>Job</code> của Kubernetes — tất cả đều là lô: không ai ngồi chờ trước màn hình, hệ thống chạy hàng đợi công việc hiệu quả nhất có thể.</p>
<p class="pitfall">⚠️ Hệ lô tối đa hoá <strong>thông lượng (throughput)</strong> — số job xong mỗi giờ — và mức dùng CPU, không phải thời gian đáp ứng — đề FE6 hỏi đúng câu "mục tiêu nào trong hệ lô nhằm tối đa số job hoàn thành mỗi giờ?" → throughput.</p>`],
      [9, 'Transistors and Batch Systems (3)',
        `<p class="y-chinh">🎯 Figure 1-4: the structure of a typical <strong>FMS job</strong> (Fortran Monitor System): control cards <code>$JOB</code>, <code>$FORTRAN</code>, the Fortran program, <code>$LOAD</code>, <code>$RUN</code>, the data cards, <code>$END</code>.</p>
<p>The cards starting with <code>$</code> were commands to the monitor, not program lines. <code>$JOB</code> gave the maximum run time, the account number to bill and the programmer's name (on the slide: Marvin Tanenbaum, the author's brother); <code>$FORTRAN</code> loaded the compiler; <code>$LOAD</code> loaded the compiled program; <code>$RUN</code> ran it on the data that followed; <code>$END</code> closed the job. These control cards were the ancestors of <strong>job control languages</strong> and of the shell script.</p>
<p>➕ The same job written as a modern shell session — compile, load and run with data following, then report:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A 1960s FMS job (Figure 1-4) written as today's shell script<br>
# $JOB, 10,7710802, MARVIN TANENBAUM &nbsp;— who pays, how long<br>
$ echo "job started by $(whoami)"<br>
job started by sv<br>
# $FORTRAN — compile the program (here: C)<br>
$ cat &gt; tong.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) { int x, s = 0; while (scanf("%d", &amp;x) == 1) s += x; printf("sum = %d\\n", s); return 0; }<br>
&gt; END<br>
$ gcc tong.c -o tong<br>
# $LOAD + $RUN — load and run it, $DATA follows<br>
$ ./tong &lt;&lt;'END'<br>
&gt; 10 20 30 40<br>
&gt; END<br>
sum = 100<br>
# $END<br>
$ echo "job finished, exit code $?"<br>
job finished, exit code 0</div>
<p>The <code>&lt;&lt;'END'</code> here-documents play the role of the data cards; the exit code at the end replaces the operator's printout of "job OK".</p>
<p class="meo">🧠 $JOB → who/how long, $FORTRAN → compile, $LOAD → load, $RUN → execute, $END → finish. Today: a Dockerfile <code>RUN</code> line or a CI YAML step is a control card.</p>`,
        `<p class="y-chinh">🎯 Hình 1-4: cấu trúc một <strong>job FMS</strong> điển hình (Fortran Monitor System): các bìa điều khiển <code>$JOB</code>, <code>$FORTRAN</code>, chương trình Fortran, <code>$LOAD</code>, <code>$RUN</code>, các bìa dữ liệu, <code>$END</code>.</p>
<p>Các bìa bắt đầu bằng <code>$</code> là lệnh cho chương trình giám sát (monitor), không phải dòng chương trình. <code>$JOB</code> ghi thời gian chạy tối đa, số tài khoản để tính tiền và tên lập trình viên (trên slide: Marvin Tanenbaum, anh trai tác giả); <code>$FORTRAN</code> nạp trình biên dịch; <code>$LOAD</code> nạp chương trình đã dịch; <code>$RUN</code> chạy nó trên dữ liệu đi sau; <code>$END</code> kết thúc job. Các bìa điều khiển này là tổ tiên của <strong>ngôn ngữ điều khiển job (job control language)</strong> và của script shell.</p>
<p>➕ Cùng job đó viết thành một phiên shell hiện đại — dịch, nạp và chạy với dữ liệu đi kèm, rồi báo kết quả:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Một job FMS thập niên 1960 (Hình 1-4) viết lại thành script shell ngày nay<br>
# ai trả tiền, chạy bao lâu<br>
$ echo "job started by $(whoami)"<br>
job started by sv<br>
# dịch chương trình (ở đây: C)<br>
$ cat &gt; tong.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) { int x, s = 0; while (scanf("%d", &amp;x) == 1) s += x; printf("sum = %d\\n", s); return 0; }<br>
&gt; END<br>
$ gcc tong.c -o tong<br>
# nạp và chạy, dữ liệu theo sau<br>
$ ./tong &lt;&lt;'END'<br>
&gt; 10 20 30 40<br>
&gt; END<br>
sum = 100<br>
# hết job<br>
$ echo "job finished, exit code $?"<br>
job finished, exit code 0</div>
<p>Các here-document <code>&lt;&lt;'END'</code> đóng vai các bìa dữ liệu; mã thoát ở cuối thay cho bản in "job OK" của người vận hành.</p>
<p class="meo">🧠 $JOB → ai/bao lâu, $FORTRAN → dịch, $LOAD → nạp, $RUN → chạy, $END → kết thúc. Ngày nay: một dòng <code>RUN</code> trong Dockerfile hay một bước YAML của CI chính là một bìa điều khiển.</p>`],
      [10, 'ICs and Multiprogramming',
        `<p class="y-chinh">🎯 Figure 1-5: <strong>multiprogramming</strong> — memory is split into partitions, each holding a different job (Job 1, Job 2, Job 3) plus the operating system; while one job waits for I/O, another job uses the CPU.</p>
<p>In the second generation, a job that waited for a tape left the expensive CPU idle — for business programs doing lots of I/O, 80–90% of the time. With several jobs in memory, the CPU always has something to do. Two conditions follow, and they are the heart of later chapters: the OS needs <strong>protection hardware</strong> so jobs cannot touch each other's partitions (Chapter 3), and a policy to choose which ready job runs next (Chapter 2).</p>
<p>➕ The simulator runs three jobs, each "CPU 2 ms → I/O 4 ms → CPU 2 ms", first one at a time, then all in memory together:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/eb98d24e07ec5da193b6456e10ba5d1affa12f40.svg" alt="One job at a time: the CPU is idle during every I/O" loading="lazy" /><p class="chu-thich">🧮 One job at a time: the CPU is idle during every I/O</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const JOBS = { A: [2, 4, 2], B: [2, 4, 2], C: [2, 4, 2] };       // CPU, I/O, CPU (ms)

function chay(daChuong) {
  const cpu = [], io = { A: [], B: [], C: [] };
  let tCpu = 0;
  if (!daChuong) {                                  // one job at a time: the CPU waits during I/O
    for (const [ten, [c1, i, c2]] of Object.entries(JOBS)) {
      cpu.push({ ten, tu: tCpu, den: tCpu + c1 });
      io[ten].push({ tu: tCpu + c1, den: tCpu + c1 + i });
      cpu.push({ ten, tu: tCpu + c1 + i, den: tCpu + c1 + i + c2 });
      tCpu += c1 + i + c2;
    }
  } else {                                          // several jobs in memory: while one waits for I/O, another uses the CPU
    const buoc = Object.fromEntries(Object.keys(JOBS).map((k) =&gt; [k, 0]));
    let san = Object.keys(JOBS).map((ten, i) =&gt; ({ ten, luc: 0, i }));
    while (san.length) {
      san.sort((a, b) =&gt; a.luc - b.luc || a.i - b.i);
      const j = san.shift();
      const bat = Math.max(tCpu, j.luc), dai = JOBS[j.ten][buoc[j.ten]];
      cpu.push({ ten: j.ten, tu: bat, den: bat + dai });
      tCpu = bat + dai; buoc[j.ten]++;
      if (buoc[j.ten] &lt; JOBS[j.ten].length) {       // next comes an I/O burst on the job's own device
        const d = JOBS[j.ten][buoc[j.ten]++];
        io[j.ten].push({ tu: tCpu, den: tCpu + d });
        san.push({ ...j, luc: tCpu + d });
      }
    }
  }
  const tong = Math.max(...cpu.map((d) =&gt; d.den));
  const ban = cpu.reduce((s, d) =&gt; s + d.den - d.tu, 0);
  return { cpu, io, tong, ban };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f97d08f5c24b75e3bec90a5e6c522860ee22b1bc.svg" alt="Three jobs in memory: while one waits for its tape, another computes" loading="lazy" /><p class="chu-thich">🧮 Three jobs in memory: while one waits for its tape, another computes</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const JOBS = { A: [2, 4, 2], B: [2, 4, 2], C: [2, 4, 2] };       // CPU, I/O, CPU (ms)

function chay(daChuong) {
  const cpu = [], io = { A: [], B: [], C: [] };
  let tCpu = 0;
  if (!daChuong) {                                  // one job at a time: the CPU waits during I/O
    for (const [ten, [c1, i, c2]] of Object.entries(JOBS)) {
      cpu.push({ ten, tu: tCpu, den: tCpu + c1 });
      io[ten].push({ tu: tCpu + c1, den: tCpu + c1 + i });
      cpu.push({ ten, tu: tCpu + c1 + i, den: tCpu + c1 + i + c2 });
      tCpu += c1 + i + c2;
    }
  } else {                                          // several jobs in memory: while one waits for I/O, another uses the CPU
    const buoc = Object.fromEntries(Object.keys(JOBS).map((k) =&gt; [k, 0]));
    let san = Object.keys(JOBS).map((ten, i) =&gt; ({ ten, luc: 0, i }));
    while (san.length) {
      san.sort((a, b) =&gt; a.luc - b.luc || a.i - b.i);
      const j = san.shift();
      const bat = Math.max(tCpu, j.luc), dai = JOBS[j.ten][buoc[j.ten]];
      cpu.push({ ten: j.ten, tu: bat, den: bat + dai });
      tCpu = bat + dai; buoc[j.ten]++;
      if (buoc[j.ten] &lt; JOBS[j.ten].length) {       // next comes an I/O burst on the job's own device
        const d = JOBS[j.ten][buoc[j.ten]++];
        io[j.ten].push({ tu: tCpu, den: tCpu + d });
        san.push({ ...j, luc: tCpu + d });
      }
    }
  }
  const tong = Math.max(...cpu.map((d) =&gt; d.den));
  const ban = cpu.reduce((s, d) =&gt; s + d.den - d.tu, 0);
  return { cpu, io, tong, ban };
}</code></pre></details>
<p>Same work, half the time, and the CPU went from 50% to 100% busy. How much multiprogramming helps depends on how much jobs wait for I/O; Tanenbaum's model (book section 2.1.7) gives CPU utilization = 1 − pⁿ, where p is the fraction of time a process waits for I/O and n is the number of processes in memory:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/70b50a14f5f07f6fb21321b86bf2fe69194fd3ab.svg" alt="CPU utilization as the number of processes in memory grows" loading="lazy" /><p class="chu-thich">🧮 CPU utilization as the number of processes in memory grows</p></div>
<p>Read the curves: with 80% I/O wait, 1 process keeps the CPU busy only 20% of the time, 4 processes 59%, 10 processes 89.3%.</p>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const hieuSuat = (p, n) =&gt; 1 - p ** n;          // CPU utilization = 1 − p^n
const P = [0.2, 0.5, 0.8];</code></pre></details>
<p>➕ Two more third-generation inventions: <strong>spooling</strong> (Simultaneous Peripheral Operation On Line — read jobs from cards onto disk as they arrive, so no 1401 is needed) and <strong>timesharing</strong> (many users at terminals, each getting short turns of the CPU: CTSS at MIT, then MULTICS, which inspired UNIX).</p>`,
        `<p class="y-chinh">🎯 Hình 1-5: <strong>đa chương trình (multiprogramming)</strong> — bộ nhớ chia thành các phân vùng (partition), mỗi phân vùng chứa một job khác nhau (Job 1, Job 2, Job 3) cộng với hệ điều hành; trong lúc một job chờ I/O, job khác dùng CPU.</p>
<p>Ở thế hệ hai, job nào chờ băng từ thì CPU đắt tiền ngồi không — với chương trình nghiệp vụ nhiều I/O, tới 80–90% thời gian. Có nhiều job trong bộ nhớ thì CPU luôn có việc. Kéo theo hai điều kiện, và chúng là trái tim của các chương sau: HĐH cần <strong>phần cứng bảo vệ</strong> để job không chạm được vào phân vùng của nhau (Chương 3), và một chính sách chọn job sẵn sàng nào chạy tiếp (Chương 2).</p>
<p>➕ Bộ mô phỏng chạy ba job, mỗi job "CPU 2 ms → I/O 4 ms → CPU 2 ms", trước hết mỗi lúc một job, rồi cả ba cùng nằm trong bộ nhớ:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/13a499f166232a36231f29041ab2642bdd9276c7.svg" alt="Mỗi lúc một job: CPU ngồi không suốt mỗi lần I/O" loading="lazy" /><p class="chu-thich">🧮 Mỗi lúc một job: CPU ngồi không suốt mỗi lần I/O</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const JOBS = { A: [2, 4, 2], B: [2, 4, 2], C: [2, 4, 2] };       // CPU, I/O, CPU (ms)

function chay(daChuong) {
  const cpu = [], io = { A: [], B: [], C: [] };
  let tCpu = 0;
  if (!daChuong) {                                  // one job at a time: the CPU waits during I/O
    for (const [ten, [c1, i, c2]] of Object.entries(JOBS)) {
      cpu.push({ ten, tu: tCpu, den: tCpu + c1 });
      io[ten].push({ tu: tCpu + c1, den: tCpu + c1 + i });
      cpu.push({ ten, tu: tCpu + c1 + i, den: tCpu + c1 + i + c2 });
      tCpu += c1 + i + c2;
    }
  } else {                                          // several jobs in memory: while one waits for I/O, another uses the CPU
    const buoc = Object.fromEntries(Object.keys(JOBS).map((k) =&gt; [k, 0]));
    let san = Object.keys(JOBS).map((ten, i) =&gt; ({ ten, luc: 0, i }));
    while (san.length) {
      san.sort((a, b) =&gt; a.luc - b.luc || a.i - b.i);
      const j = san.shift();
      const bat = Math.max(tCpu, j.luc), dai = JOBS[j.ten][buoc[j.ten]];
      cpu.push({ ten: j.ten, tu: bat, den: bat + dai });
      tCpu = bat + dai; buoc[j.ten]++;
      if (buoc[j.ten] &lt; JOBS[j.ten].length) {       // next comes an I/O burst on the job's own device
        const d = JOBS[j.ten][buoc[j.ten]++];
        io[j.ten].push({ tu: tCpu, den: tCpu + d });
        san.push({ ...j, luc: tCpu + d });
      }
    }
  }
  const tong = Math.max(...cpu.map((d) =&gt; d.den));
  const ban = cpu.reduce((s, d) =&gt; s + d.den - d.tu, 0);
  return { cpu, io, tong, ban };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9873409b9b2325a20f21f720404e145889cf2a9b.svg" alt="Ba job trong bộ nhớ: job này chờ băng thì job kia tính toán" loading="lazy" /><p class="chu-thich">🧮 Ba job trong bộ nhớ: job này chờ băng thì job kia tính toán</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const JOBS = { A: [2, 4, 2], B: [2, 4, 2], C: [2, 4, 2] };       // CPU, I/O, CPU (ms)

function chay(daChuong) {
  const cpu = [], io = { A: [], B: [], C: [] };
  let tCpu = 0;
  if (!daChuong) {                                  // one job at a time: the CPU waits during I/O
    for (const [ten, [c1, i, c2]] of Object.entries(JOBS)) {
      cpu.push({ ten, tu: tCpu, den: tCpu + c1 });
      io[ten].push({ tu: tCpu + c1, den: tCpu + c1 + i });
      cpu.push({ ten, tu: tCpu + c1 + i, den: tCpu + c1 + i + c2 });
      tCpu += c1 + i + c2;
    }
  } else {                                          // several jobs in memory: while one waits for I/O, another uses the CPU
    const buoc = Object.fromEntries(Object.keys(JOBS).map((k) =&gt; [k, 0]));
    let san = Object.keys(JOBS).map((ten, i) =&gt; ({ ten, luc: 0, i }));
    while (san.length) {
      san.sort((a, b) =&gt; a.luc - b.luc || a.i - b.i);
      const j = san.shift();
      const bat = Math.max(tCpu, j.luc), dai = JOBS[j.ten][buoc[j.ten]];
      cpu.push({ ten: j.ten, tu: bat, den: bat + dai });
      tCpu = bat + dai; buoc[j.ten]++;
      if (buoc[j.ten] &lt; JOBS[j.ten].length) {       // next comes an I/O burst on the job's own device
        const d = JOBS[j.ten][buoc[j.ten]++];
        io[j.ten].push({ tu: tCpu, den: tCpu + d });
        san.push({ ...j, luc: tCpu + d });
      }
    }
  }
  const tong = Math.max(...cpu.map((d) =&gt; d.den));
  const ban = cpu.reduce((s, d) =&gt; s + d.den - d.tu, 0);
  return { cpu, io, tong, ban };
}</code></pre></details>
<p>Cùng khối lượng việc, mất một nửa thời gian, và CPU từ bận 50% lên 100%. Đa chương trình giúp được bao nhiêu tuỳ vào các job chờ I/O nhiều hay ít; mô hình của Tanenbaum (mục 2.1.7 trong sách) cho hiệu suất CPU = 1 − pⁿ, với p là tỉ lệ thời gian một tiến trình chờ I/O và n là số tiến trình trong bộ nhớ:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2e709dffd4f576da71917e3a7e695fec9b802a1d.svg" alt="Hiệu suất CPU khi số tiến trình trong bộ nhớ tăng dần" loading="lazy" /><p class="chu-thich">🧮 Hiệu suất CPU khi số tiến trình trong bộ nhớ tăng dần</p></div>
<p>Đọc đường cong: chờ I/O 80% thì 1 tiến trình chỉ giữ CPU bận 20% thời gian, 4 tiến trình 59%, 10 tiến trình 89.3%.</p>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const hieuSuat = (p, n) =&gt; 1 - p ** n;          // CPU utilization = 1 − p^n
const P = [0.2, 0.5, 0.8];</code></pre></details>
<p>➕ Thêm hai phát minh của thế hệ ba: <strong>spooling</strong> (Simultaneous Peripheral Operation On Line — đọc job từ bìa vào đĩa ngay khi chúng tới, khỏi cần máy 1401) và <strong>chia sẻ thời gian (timesharing)</strong> (nhiều người dùng ngồi ở terminal, mỗi người nhận những lượt CPU ngắn: CTSS ở MIT, rồi MULTICS — nguồn cảm hứng của UNIX).</p>`],
      [11, 'Processors (1)',
        `<p class="y-chinh">🎯 Figure 1-6: a simple personal computer — the <strong>CPU</strong> (with its <strong>MMU</strong>), <strong>memory</strong> and a <strong>controller</strong> for each device (video, keyboard, USB, hard disk), all connected by a <strong>bus</strong>.</p>
<p>The CPU repeats one cycle forever: <strong>fetch</strong> the next instruction from memory, <strong>decode</strong> it, <strong>execute</strong> it. Besides general registers it has special ones the OS cares about: the <strong>program counter</strong> (PC, address of the next instruction), the <strong>stack pointer</strong> (SP, top of the current stack) and the <strong>PSW</strong> (program status word: condition bits, priority and the user/kernel mode bit). Every time the OS switches from one program to another it must save and restore all of them — a <strong>context switch</strong>.</p>
<p>➕ The three registers of a real program, stopped by the debugger at <code>main()</code> on the course machine (ARM64, where the PSW is called <code>cpsr</code>):</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--security-opt=seccomp=unconfined</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Stop a program at main() and look at three CPU registers<br>
$ printf 'int main(void) {\\n &nbsp;&nbsp;&nbsp;return 0;\\n}\\n' &gt; rong.c<br>
$ gcc -g rong.c -o rong<br>
$ gdb -q -batch -ex 'break main' -ex 'run' -ex 'info registers pc sp cpsr' ./rong 2&gt;&amp;1 | tail -3<br>
pc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaaaaaa0714 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaaaaaa0714 &lt;main&gt;<br>
sp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xfffffffffb50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xfffffffffb50<br>
cpsr &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x80001000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ EL=0 BTYPE=0 SSBS N ]</div>
<p><code>EL=0</code> inside <code>cpsr</code> is the mode bit of slide 3: <strong>exception level 0 = user mode</strong> (the Linux kernel runs at EL1). The MMU (memory management unit) next to the CPU translates the program's addresses such as <code>0xaaaaaaaa0714</code> to physical memory — Chapter 3.</p>
<p class="meo">🧠 Each device is driven by its <strong>controller</strong>, a small computer of its own; the OS talks to the controller, not to the device itself.</p>`,
        `<p class="y-chinh">🎯 Hình 1-6: một máy tính cá nhân đơn giản — <strong>CPU</strong> (kèm <strong>MMU</strong>), <strong>bộ nhớ</strong> và một <strong>bộ điều khiển (controller)</strong> cho mỗi thiết bị (màn hình, bàn phím, USB, ổ đĩa cứng), tất cả nối với nhau bằng một <strong>bus</strong>.</p>
<p>CPU lặp mãi một chu trình: <strong>nạp (fetch)</strong> lệnh kế tiếp từ bộ nhớ, <strong>giải mã (decode)</strong>, <strong>thực thi (execute)</strong>. Ngoài các thanh ghi chung, nó có những thanh ghi đặc biệt mà HĐH để ý: <strong>bộ đếm chương trình (program counter, PC)</strong> — địa chỉ lệnh kế tiếp, <strong>con trỏ ngăn xếp (stack pointer, SP)</strong> — đỉnh ngăn xếp hiện tại, và <strong>PSW</strong> (program status word — từ trạng thái chương trình: các bit điều kiện, mức ưu tiên và bit chế độ người dùng/nhân). Mỗi lần HĐH đổi từ chương trình này sang chương trình khác, nó phải lưu và khôi phục tất cả chúng — gọi là <strong>chuyển ngữ cảnh (context switch)</strong>.</p>
<p>➕ Ba thanh ghi của một chương trình thật, bị trình gỡ lỗi dừng tại <code>main()</code> trên máy của môn (ARM64, nơi PSW được gọi là <code>cpsr</code>):</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--security-opt=seccomp=unconfined</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Dừng chương trình ở main() và xem ba thanh ghi của CPU<br>
$ printf 'int main(void) {\\n &nbsp;&nbsp;&nbsp;return 0;\\n}\\n' &gt; rong.c<br>
$ gcc -g rong.c -o rong<br>
$ gdb -q -batch -ex 'break main' -ex 'run' -ex 'info registers pc sp cpsr' ./rong 2&gt;&amp;1 | tail -3<br>
pc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaaaaaa0714 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaaaaaa0714 &lt;main&gt;<br>
sp &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xfffffffffb50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xfffffffffb50<br>
cpsr &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x80001000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ EL=0 BTYPE=0 SSBS N ]</div>
<p><code>EL=0</code> trong <code>cpsr</code> chính là bit chế độ của slide 3: <strong>exception level 0 = chế độ người dùng</strong> (nhân Linux chạy ở EL1). MMU (bộ quản lý bộ nhớ) cạnh CPU dịch địa chỉ của chương trình như <code>0xaaaaaaaa0714</code> sang bộ nhớ vật lý — Chương 3.</p>
<p class="meo">🧠 Mỗi thiết bị được điều khiển bởi <strong>controller</strong> của nó, một máy tính nhỏ riêng; HĐH nói chuyện với controller chứ không với chính thiết bị.</p>`],
      [12, 'Processors (2)',
        `<p class="y-chinh">🎯 Figure 1-7: (a) a three-stage <strong>pipeline</strong> — fetch, decode and execute units work on different instructions at the same time; (b) a <strong>superscalar</strong> CPU — several fetch/decode units feed a holding buffer, and several execute units take instructions from it, possibly out of program order.</p>
<p>A pipeline is an assembly line: while instruction 3 executes, instruction 4 is decoded and instruction 5 fetched. The simulator counts the clock cycles for five instructions:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ca3f50c88bccabefe82c1e7b990e4ce37fa90eb2.svg" alt="Without a pipeline, each instruction waits for the previous one to finish all three stages" loading="lazy" /><p class="chu-thich">🧮 Without a pipeline, each instruction waits for the previous one to finish all three stages</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANG = ['Fetch', 'Decode', 'Execute'], SO_LENH = 5;
function lich(pipeline) {
  const o = [];                                  // { tang, lenh, tu }
  for (let i = 0; i &lt; SO_LENH; i++)
    for (let s = 0; s &lt; TANG.length; s++) o.push({ tang: s, lenh: i, tu: pipeline ? i + s : i * TANG.length + s });
  return { o, chuKy: Math.max(...o.map((x) =&gt; x.tu)) + 1 };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/628ac667ce4b916994261f584e055ce6275d5913.svg" alt="With a pipeline: after the first 3 cycles, one instruction finishes every cycle" loading="lazy" /><p class="chu-thich">🧮 With a pipeline: after the first 3 cycles, one instruction finishes every cycle</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANG = ['Fetch', 'Decode', 'Execute'], SO_LENH = 5;
function lich(pipeline) {
  const o = [];                                  // { tang, lenh, tu }
  for (let i = 0; i &lt; SO_LENH; i++)
    for (let s = 0; s &lt; TANG.length; s++) o.push({ tang: s, lenh: i, tu: pipeline ? i + s : i * TANG.length + s });
  return { o, chuKy: Math.max(...o.map((x) =&gt; x.tu)) + 1 };
}</code></pre></details>
<p>Fifteen cycles become seven; with n instructions and k stages, k·n becomes k + n − 1. The price, for the OS writer: an instruction is "half done" in several places at once, so when an interrupt arrives, the CPU must carefully define which instructions have finished — the <strong>precise interrupt</strong> of Chapter 5 (FE1 asked its four properties).</p>
<p>➕ Today's CPUs are deeply pipelined and superscalar with out-of-order execution; executing instructions speculatively before knowing they are needed is what the 2018 Meltdown and Spectre attacks exploited (older web lesson 1.3).</p>`,
        `<p class="y-chinh">🎯 Hình 1-7: (a) một <strong>đường ống (pipeline)</strong> ba tầng — khối nạp, giải mã và thực thi cùng lúc làm trên các lệnh khác nhau; (b) một CPU <strong>siêu vô hướng (superscalar)</strong> — nhiều khối nạp/giải mã đổ lệnh vào một bộ đệm chờ (holding buffer), nhiều khối thực thi lấy lệnh từ đó, có thể không theo thứ tự chương trình.</p>
<p>Pipeline là dây chuyền lắp ráp: trong lúc lệnh 3 thực thi, lệnh 4 được giải mã và lệnh 5 được nạp. Bộ mô phỏng đếm số chu kỳ đồng hồ cho năm lệnh:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/84a7c7f3165c477a91b9ca92d3e8238cffa39035.svg" alt="Không có pipeline, lệnh nào cũng đợi lệnh trước đi hết ba tầng" loading="lazy" /><p class="chu-thich">🧮 Không có pipeline, lệnh nào cũng đợi lệnh trước đi hết ba tầng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANG = ['Fetch', 'Decode', 'Execute'], SO_LENH = 5;
function lich(pipeline) {
  const o = [];                                  // { tang, lenh, tu }
  for (let i = 0; i &lt; SO_LENH; i++)
    for (let s = 0; s &lt; TANG.length; s++) o.push({ tang: s, lenh: i, tu: pipeline ? i + s : i * TANG.length + s });
  return { o, chuKy: Math.max(...o.map((x) =&gt; x.tu)) + 1 };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b99f75df839e74f61f389ea9469db29a2aca7662.svg" alt="Có pipeline: sau 3 chu kỳ đầu, mỗi chu kỳ xong một lệnh" loading="lazy" /><p class="chu-thich">🧮 Có pipeline: sau 3 chu kỳ đầu, mỗi chu kỳ xong một lệnh</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANG = ['Fetch', 'Decode', 'Execute'], SO_LENH = 5;
function lich(pipeline) {
  const o = [];                                  // { tang, lenh, tu }
  for (let i = 0; i &lt; SO_LENH; i++)
    for (let s = 0; s &lt; TANG.length; s++) o.push({ tang: s, lenh: i, tu: pipeline ? i + s : i * TANG.length + s });
  return { o, chuKy: Math.max(...o.map((x) =&gt; x.tu)) + 1 };
}</code></pre></details>
<p>Mười lăm chu kỳ còn bảy; n lệnh qua k tầng thì k·n thành k + n − 1. Cái giá với người viết HĐH: một lệnh "đang làm dở" ở nhiều chỗ cùng lúc, nên khi có ngắt, CPU phải xác định cẩn thận lệnh nào đã xong — <strong>ngắt chính xác (precise interrupt)</strong> ở Chương 5 (FE1 hỏi bốn tính chất của nó).</p>
<p>➕ CPU ngày nay có pipeline rất sâu, siêu vô hướng và thực thi không theo thứ tự; việc chạy lệnh theo phỏng đoán trước khi biết có cần hay không chính là chỗ hai lỗ hổng Meltdown và Spectre năm 2018 khai thác (bài web cũ 1.3).</p>`],
      [13, 'Memory (1)',
        `<p class="y-chinh">🎯 Figure 1-8: a quad-core chip (a) with one <strong>shared L2 cache</strong>, or (b) with a <strong>separate L2 cache</strong> per core; each core always has its own small L1 cache.</p>
<p>A <strong>core</strong> is a complete CPU; a multicore chip puts several on one piece of silicon. A <strong>cache</strong> is a small, fast memory that keeps recently used data close to the core. Design (a) lets cores share data cheaply and lets one busy core use the whole L2; design (b) gives each core a private, predictable L2 but makes keeping the copies consistent harder. Intel used (a), AMD (b) in the book's time; current chips add a large shared L3.</p>
<p>➕ What the course machine reports for core 0 — which other cores share each cache, and the size of one <strong>cache line</strong> (the unit copied between memory and cache):</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Which cores share which cache? (core 0's point of view)<br>
$ nproc<br>
10<br>
$ cd /sys/devices/system/cpu/cpu0/cache<br>
$ for i in index*; do echo "$i: level $(cat $i/level) $(cat $i/type), shared by CPUs $(cat $i/shared_cpu_list)"; done<br>
index0: level 1 Data, shared by CPUs 0-9<br>
index1: level 1 Instruction, shared by CPUs 0-9<br>
index2: level 2 Unified, shared by CPUs 0-9<br>
$ getconf LEVEL1_DCACHE_LINESIZE<br>
64</div>
<p>The virtual machine shows one L2 "shared by CPUs 0-9"; the real Apple chip groups its cores into clusters, but the hypervisor hides that. Lines of 64 bytes mean that reading one byte brings its 63 neighbours along — why arrays are fast and linked lists are slow.</p>
<p class="meo">🧠 For the OS: with multiple cores, two threads of one program really run at the same time — the reason race conditions (lesson "Start here") exist even on one chip.</p>`,
        `<p class="y-chinh">🎯 Hình 1-8: một chip bốn nhân (a) có một <strong>cache L2 dùng chung</strong>, hoặc (b) mỗi nhân một <strong>cache L2 riêng</strong>; nhân nào cũng có cache L1 nhỏ của riêng mình.</p>
<p>Một <strong>nhân (core)</strong> là một CPU hoàn chỉnh; chip đa nhân đặt nhiều nhân trên một mảnh silicon. <strong>Cache</strong> là bộ nhớ nhỏ, nhanh, giữ dữ liệu vừa dùng ở sát nhân. Thiết kế (a) cho các nhân chia sẻ dữ liệu rẻ và cho một nhân đang bận dùng cả L2; thiết kế (b) cho mỗi nhân một L2 riêng, dễ đoán, nhưng giữ các bản sao nhất quán khó hơn. Thời của sách, Intel dùng (a), AMD dùng (b); chip hiện nay thêm một cache L3 lớn dùng chung.</p>
<p>➕ Máy của môn báo gì cho nhân 0 — những nhân nào dùng chung từng cache, và kích thước một <strong>dòng cache (cache line)</strong> (đơn vị được chép giữa bộ nhớ và cache):</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Lõi nào dùng chung cache nào? (nhìn từ lõi 0)<br>
$ nproc<br>
10<br>
$ cd /sys/devices/system/cpu/cpu0/cache<br>
$ for i in index*; do echo "$i: level $(cat $i/level) $(cat $i/type), shared by CPUs $(cat $i/shared_cpu_list)"; done<br>
index0: level 1 Data, shared by CPUs 0-9<br>
index1: level 1 Instruction, shared by CPUs 0-9<br>
index2: level 2 Unified, shared by CPUs 0-9<br>
$ getconf LEVEL1_DCACHE_LINESIZE<br>
64</div>
<p>Máy ảo cho thấy một L2 "dùng chung bởi CPU 0-9"; chip Apple thật chia nhân thành các cụm, nhưng hypervisor đã giấu chi tiết đó. Dòng cache 64 byte nghĩa là đọc một byte sẽ kéo theo 63 byte hàng xóm — lý do mảng thì nhanh còn danh sách liên kết thì chậm.</p>
<p class="meo">🧠 Với HĐH: có nhiều nhân thì hai luồng của một chương trình chạy cùng lúc THẬT — lý do tình trạng tranh chấp (bài "Bắt đầu tại đây") xảy ra ngay trên một con chip.</p>`],
      [14, 'Memory (2)',
        `<p class="y-chinh">🎯 Figure 1-9: the <strong>memory hierarchy</strong> — registers (about 1 ns, under 1 KB), cache (2 ns, 4 MB), main memory (10 ns, 1–8 GB), magnetic disk (10 ms, 1–4 TB). Each level is bigger, slower and cheaper per byte than the one above.</p>
<p>The book calls its numbers "very rough". What matters is the ratio: the disk is a million times slower than a register. Scaled so that 1 ns lasts one second, the simulator turns the slide's figures into human time:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/24753201a63d114572cb62320493631ea7d0125f.svg" alt="The slide's access times, and the same ratios if 1 ns lasted one second" loading="lazy" /><p class="chu-thich">🧮 The slide's access times, and the same ratios if 1 ns lasted one second</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TANG = [                                   // typical access time from Figure 1-9 (seconds)
  ['Registers', 'Thanh ghi', 1e-9],
  ['Cache', 'Cache', 2e-9],
  ['Main memory', 'Bộ nhớ chính', 10e-9],
  ['Magnetic disk', 'Đĩa từ', 10e-3],
];
const nguoi = (giay) =&gt; giay / 1e-9;             // if 1 ns lasted 1 second: human-scale seconds</code></pre></details>
<p>➕ Now measured for real: a program follows a random chain of pointers through arrays of growing size, so every load must wait for the previous one. While the array fits in L1/L2 cache a load costs a few ns; once it only fits in main memory, much more:</p>
<pre><code class="language-c">// Measure the memory hierarchy: follow a random chain of pointers through arrays of growing size
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;

static double ns_per_load(size_t bytes) {
    size_t n = bytes / sizeof(size_t);
    size_t *next = malloc(n * sizeof(size_t));
    for (size_t i = 0; i &lt; n; i++) next[i] = i;
    srand(12345);                                    // fixed seed: the same chain every run
    for (size_t i = n - 1; i &gt; 0; i--) {             // Sattolo shuffle = one big random cycle
        size_t j = (size_t)rand() % i;
        size_t t = next[i]; next[i] = next[j]; next[j] = t;
    }
    size_t p = 0, steps = 20000000;
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (size_t s = 0; s &lt; steps; s++) p = next[p];  // each load depends on the previous one
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    free(next);
    if (p == (size_t)-1) puts("");                   // keep p alive
    return ((b.tv_sec - a.tv_sec) * 1e9 + (b.tv_nsec - a.tv_nsec)) / steps;
}

int main(void) {
    size_t kb[] = {16, 64, 256, 1024, 4096, 16384, 65536, 262144};
    for (int i = 0; i &lt; 8; i++) {
        double t = ns_per_load(kb[i] * 1024);
        if (kb[i] &lt; 1024) printf("%6zu KB: %6.1f ns per load\\n", kb[i], t);
        else              printf("%6zu MB: %6.1f ns per load\\n", kb[i] / 1024, t);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -O2 do-tre-bo-nho.c -o do-tre-bo-nho &amp;&amp; ./do-tre-bo-nho<br>
&nbsp;&nbsp;&nbsp;&nbsp;16 KB: &nbsp;&nbsp;&nbsp;3.9 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;64 KB: &nbsp;&nbsp;&nbsp;4.6 ns per load<br>
&nbsp;&nbsp;&nbsp;256 KB: &nbsp;&nbsp;&nbsp;7.2 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 MB: &nbsp;&nbsp;15.3 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 MB: &nbsp;106.8 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;16 MB: &nbsp;316.7 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;64 MB: &nbsp;475.2 ns per load<br>
&nbsp;&nbsp;&nbsp;256 MB: &nbsp;409.8 ns per load</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>So the slide's "main memory 10 nsec" is optimistic for random access: the measured cost includes cache misses and TLB misses (address translation, Chapter 3), and is tens of times higher. Sequential access is much cheaper because of cache lines and prefetching. The older lesson 1.3 has the full table with SSDs.</p>
<p class="pitfall">⚠️ "Which level is the fastest / largest / cheapest per bit?" — registers fastest, disk largest and cheapest. "Which level does the OS manage?" — main memory and disk (the cache is managed by hardware).</p>`,
        `<p class="y-chinh">🎯 Hình 1-9: <strong>phân cấp bộ nhớ (memory hierarchy)</strong> — thanh ghi (khoảng 1 ns, dưới 1 KB), cache (2 ns, 4 MB), bộ nhớ chính (10 ns, 1–8 GB), đĩa từ (10 ms, 1–4 TB). Mỗi tầng to hơn, chậm hơn và rẻ hơn trên mỗi byte so với tầng trên nó.</p>
<p>Sách tự gọi các con số này là "rất thô". Điều quan trọng là tỉ lệ: đĩa chậm hơn thanh ghi cả triệu lần. Phóng theo tỉ lệ 1 ns dài một giây, bộ mô phỏng đổi con số của slide sang thời gian của con người:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5ecdbdbeb8f098d305db54e40e999431d73f548a.svg" alt="Thời gian truy cập theo slide, và cùng tỉ lệ đó nếu 1 ns dài một giây" loading="lazy" /><p class="chu-thich">🧮 Thời gian truy cập theo slide, và cùng tỉ lệ đó nếu 1 ns dài một giây</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TANG = [                                   // typical access time from Figure 1-9 (seconds)
  ['Registers', 'Thanh ghi', 1e-9],
  ['Cache', 'Cache', 2e-9],
  ['Main memory', 'Bộ nhớ chính', 10e-9],
  ['Magnetic disk', 'Đĩa từ', 10e-3],
];
const nguoi = (giay) =&gt; giay / 1e-9;             // if 1 ns lasted 1 second: human-scale seconds</code></pre></details>
<p>➕ Giờ đo thật: một chương trình đi theo một chuỗi con trỏ ngẫu nhiên qua các mảng lớn dần, để mỗi lần đọc phải chờ lần đọc trước. Khi mảng còn vừa cache L1/L2 thì mỗi lần đọc tốn vài ns; khi chỉ còn vừa bộ nhớ chính thì tốn hơn nhiều:</p>
<pre><code class="language-c">// Đo phân cấp bộ nhớ: đi theo chuỗi con trỏ ngẫu nhiên qua các mảng lớn dần
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;time.h&gt;

static double ns_per_load(size_t bytes) {
    size_t n = bytes / sizeof(size_t);
    size_t *next = malloc(n * sizeof(size_t));
    for (size_t i = 0; i &lt; n; i++) next[i] = i;
    srand(12345);                                    // hạt giống cố định: chuỗi như nhau mỗi lần
    for (size_t i = n - 1; i &gt; 0; i--) {             // xáo Sattolo = một vòng ngẫu nhiên duy nhất
        size_t j = (size_t)rand() % i;
        size_t t = next[i]; next[i] = next[j]; next[j] = t;
    }
    size_t p = 0, steps = 20000000;
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    for (size_t s = 0; s &lt; steps; s++) p = next[p];  // mỗi lần đọc phụ thuộc lần trước
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    free(next);
    if (p == (size_t)-1) puts("");                   // giữ p để trình biên dịch không bỏ vòng lặp
    return ((b.tv_sec - a.tv_sec) * 1e9 + (b.tv_nsec - a.tv_nsec)) / steps;
}

int main(void) {
    size_t kb[] = {16, 64, 256, 1024, 4096, 16384, 65536, 262144};
    for (int i = 0; i &lt; 8; i++) {
        double t = ns_per_load(kb[i] * 1024);
        if (kb[i] &lt; 1024) printf("%6zu KB: %6.1f ns per load\\n", kb[i], t);
        else              printf("%6zu MB: %6.1f ns per load\\n", kb[i] / 1024, t);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -O2 do-tre-bo-nho.c -o do-tre-bo-nho &amp;&amp; ./do-tre-bo-nho<br>
&nbsp;&nbsp;&nbsp;&nbsp;16 KB: &nbsp;&nbsp;&nbsp;3.9 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;64 KB: &nbsp;&nbsp;&nbsp;4.6 ns per load<br>
&nbsp;&nbsp;&nbsp;256 KB: &nbsp;&nbsp;&nbsp;7.2 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 MB: &nbsp;&nbsp;15.3 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 MB: &nbsp;106.8 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;16 MB: &nbsp;316.7 ns per load<br>
&nbsp;&nbsp;&nbsp;&nbsp;64 MB: &nbsp;475.2 ns per load<br>
&nbsp;&nbsp;&nbsp;256 MB: &nbsp;409.8 ns per load</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Vậy "main memory 10 nsec" của slide là lạc quan với truy cập ngẫu nhiên: số đo thật gồm cả trượt cache và trượt TLB (dịch địa chỉ, Chương 3), cao hơn hàng chục lần. Truy cập tuần tự rẻ hơn nhiều nhờ dòng cache và nạp trước (prefetch). Bài cũ 1.3 có bảng đầy đủ kèm SSD.</p>
<p class="pitfall">⚠️ "Tầng nào nhanh nhất / lớn nhất / rẻ nhất mỗi bit?" — thanh ghi nhanh nhất, đĩa lớn nhất và rẻ nhất. "Tầng nào do HĐH quản lý?" — bộ nhớ chính và đĩa (cache do phần cứng quản lý).</p>`],
      [15, 'Memory (3)',
        `<p class="y-chinh">🎯 Four questions every caching system must answer: (1) <strong>when</strong> to put a new item into the cache, (2) <strong>which cache line</strong> to put it in, (3) <strong>which item to remove</strong> when a slot is needed, (4) <strong>where to put</strong> an evicted item in the larger memory.</p>
<p>The idea of caching appears again and again in this course, at every level of the hierarchy and also in software. The same four questions, answered by different parts of a real system:</p>
<table>
<thead><tr><th>Cache</th><th>(1) when to load</th><th>(3) what to evict</th><th>Where in the course</th></tr></thead>
<tbody>
<tr><td>CPU L1/L2/L3</td><td>on a miss, a whole 64-byte line</td><td>hardware policy (pseudo-LRU)</td><td>slides 13–14</td></tr>
<tr><td>TLB (address translations)</td><td>on a miss, after walking the page table</td><td>hardware</td><td>Chapter 3</td></tr>
<tr><td>pages in RAM (virtual memory)</td><td>on a page fault</td><td>FIFO, LRU, Clock, working set…</td><td>Chapter 3 (page replacement)</td></tr>
<tr><td>file-system buffer cache</td><td>on read; written back later</td><td>LRU-like</td><td>Chapter 4</td></tr>
<tr><td>Redis in front of PostgreSQL</td><td>on a cache miss in your code</td><td>you choose: LRU, TTL</td><td>backend practice</td></tr>
</tbody>
</table>
<p>Question (3) is the famous one: the page-replacement algorithms of Chapter 3 and the FE calculation questions ("how many page faults with LRU?") are all answers to it.</p>
<p class="meo">🧠 A cache works only because of <strong>locality</strong>: programs reuse recent data (temporal locality) and data near it (spatial locality).</p>`,
        `<p class="y-chinh">🎯 Bốn câu hỏi mọi hệ thống bộ đệm (cache) phải trả lời: (1) <strong>khi nào</strong> đưa một mục mới vào cache, (2) đặt nó vào <strong>dòng cache nào</strong>, (3) <strong>đuổi mục nào ra</strong> khi cần chỗ, (4) <strong>đặt mục bị đuổi</strong> vào đâu trong bộ nhớ lớn hơn.</p>
<p>Ý tưởng bộ đệm xuất hiện lặp đi lặp lại trong môn, ở mọi tầng của phân cấp bộ nhớ và cả trong phần mềm. Cùng bốn câu hỏi, được các phần khác nhau của một hệ thống thật trả lời:</p>
<table>
<thead><tr><th>Cache</th><th>(1) khi nào nạp</th><th>(3) đuổi cái gì</th><th>Học ở đâu</th></tr></thead>
<tbody>
<tr><td>L1/L2/L3 của CPU</td><td>khi trượt, nạp cả dòng 64 byte</td><td>chính sách phần cứng (gần LRU)</td><td>slide 13–14</td></tr>
<tr><td>TLB (bản dịch địa chỉ)</td><td>khi trượt, sau khi duyệt bảng trang</td><td>phần cứng</td><td>Chương 3</td></tr>
<tr><td>trang trong RAM (bộ nhớ ảo)</td><td>khi lỗi trang</td><td>FIFO, LRU, Clock, working set…</td><td>Chương 3 (thay trang)</td></tr>
<tr><td>bộ đệm của hệ thống tệp</td><td>khi đọc; ghi xuống sau</td><td>kiểu LRU</td><td>Chương 4</td></tr>
<tr><td>Redis đứng trước PostgreSQL</td><td>khi trượt cache trong code của bạn</td><td>bạn chọn: LRU, TTL</td><td>thực tế backend</td></tr>
</tbody>
</table>
<p>Câu (3) là câu nổi tiếng: các thuật toán thay trang của Chương 3 và các câu tính toán của FE ("dùng LRU thì có bao nhiêu lỗi trang?") đều là câu trả lời cho nó.</p>
<p class="meo">🧠 Cache chỉ hiệu quả nhờ <strong>tính cục bộ (locality)</strong>: chương trình hay dùng lại dữ liệu vừa dùng (cục bộ thời gian) và dữ liệu ở gần nó (cục bộ không gian).</p>`],
      [16, 'Disks',
        `<p class="y-chinh">🎯 Figure 1-10: a magnetic <strong>disk drive</strong> — several platters stacked on a spindle, one <strong>read/write head per surface</strong> (surfaces 0–7 here), all heads on one arm that moves in and out together.</p>
<p>Vocabulary the FE uses: a <strong>track</strong> is one ring on one surface; the set of tracks under all heads at one arm position is a <strong>cylinder</strong>; each track is divided into <strong>sectors</strong> (typically 512 bytes or 4 KB). Reading a random sector costs <strong>seek time</strong> (move the arm to the cylinder — about 5–10 ms), then <strong>rotational delay</strong> (wait for the sector to come under the head), then the <strong>transfer</strong> itself.</p>
<p>➕ The rotational delay is pure arithmetic, so let a program do it rather than guess:</p>
<pre><code class="language-javascript">// How long does a spinning disk make you wait? (pure arithmetic, no guessing)
const rpms = [5400, 7200, 10000, 15000];
console.log('rpm    one turn   avg rotational delay (half a turn)');
for (const rpm of rpms) {
  const turnMs = 60000 / rpm;                       // ms for one revolution
  console.log(&#96;&#36;{String(rpm).padEnd(6)} &#36;{turnMs.toFixed(2).padStart(6)} ms  &#36;{(turnMs / 2).toFixed(2).padStart(6)} ms&#96;);
}
const seekMs = 9, dramNs = 100;                     // a typical seek; a DRAM access
const accessMs = seekMs + 60000 / 7200 / 2;
console.log(&#96;7200 rpm: seek &#36;{seekMs} ms + rotation &#36;{(60000 / 7200 / 2).toFixed(2)} ms = &#36;{accessMs.toFixed(2)} ms per random access&#96;);
console.log(&#96;= &#36;{Math.round(accessMs * 1e6 / dramNs).toLocaleString('en-US')} DRAM accesses of &#36;{dramNs} ns&#96;);</code></pre>
<div class="out">$ node dia-quay.js<br>
rpm &nbsp;&nbsp;&nbsp;one turn &nbsp;&nbsp;avg rotational delay (half a turn)<br>
5400 &nbsp;&nbsp;&nbsp;11.11 ms &nbsp;&nbsp;&nbsp;5.56 ms<br>
7200 &nbsp;&nbsp;&nbsp;&nbsp;8.33 ms &nbsp;&nbsp;&nbsp;4.17 ms<br>
10000 &nbsp;&nbsp;&nbsp;6.00 ms &nbsp;&nbsp;&nbsp;3.00 ms<br>
15000 &nbsp;&nbsp;&nbsp;4.00 ms &nbsp;&nbsp;&nbsp;2.00 ms<br>
7200 rpm: seek 9 ms + rotation 4.17 ms = 13.17 ms per random access<br>
= 131,667 DRAM accesses of 100 ns</div>
<p>About 13 ms for one random read on a 7,200 rpm disk — the time of more than a hundred thousand memory accesses. That gap is why the OS caches disk blocks (Chapter 4) and schedules the arm cleverly (Chapter 5). <strong>SSDs</strong> (flash memory) have no arm and no rotation, so random reads take tens of microseconds — but they wear out with writes and are still far slower than RAM.</p>
<p class="pitfall">⚠️ FE1, FE2, FE4: "Time to move the arm to the proper cylinder is called?" → <strong>seek time</strong> (not rotational delay, not access time).</p>`,
        `<p class="y-chinh">🎯 Hình 1-10: một <strong>ổ đĩa từ</strong> — nhiều đĩa (platter) xếp chồng trên một trục quay, <strong>mỗi mặt một đầu đọc/ghi</strong> (ở đây là mặt 0–7), mọi đầu gắn trên một cánh tay cùng di chuyển ra vào.</p>
<p>Từ vựng FE hay dùng: <strong>rãnh (track)</strong> là một vòng tròn trên một mặt; tập các rãnh nằm dưới mọi đầu đọc ở một vị trí của cánh tay là một <strong>cylinder</strong>; mỗi rãnh chia thành các <strong>sector</strong> (thường 512 byte hoặc 4 KB). Đọc một sector bất kỳ tốn <strong>thời gian tìm (seek time)</strong> — dời cánh tay tới cylinder, khoảng 5–10 ms — rồi <strong>độ trễ quay (rotational delay)</strong> — chờ sector quay tới dưới đầu đọc — rồi mới tới <strong>truyền dữ liệu</strong>.</p>
<p>➕ Độ trễ quay chỉ là phép tính, nên để chương trình tính thay vì đoán:</p>
<pre><code class="language-javascript">// Đĩa quay bắt bạn chờ bao lâu? (tính thật, không đoán)
const rpms = [5400, 7200, 10000, 15000];
console.log('rpm    one turn   avg rotational delay (half a turn)');
for (const rpm of rpms) {
  const turnMs = 60000 / rpm;                       // ms cho một vòng quay
  console.log(&#96;&#36;{String(rpm).padEnd(6)} &#36;{turnMs.toFixed(2).padStart(6)} ms  &#36;{(turnMs / 2).toFixed(2).padStart(6)} ms&#96;);
}
const seekMs = 9, dramNs = 100;                     // thời gian tìm điển hình; một lần đọc DRAM
const accessMs = seekMs + 60000 / 7200 / 2;
console.log(&#96;7200 rpm: seek &#36;{seekMs} ms + rotation &#36;{(60000 / 7200 / 2).toFixed(2)} ms = &#36;{accessMs.toFixed(2)} ms per random access&#96;);
console.log(&#96;= &#36;{Math.round(accessMs * 1e6 / dramNs).toLocaleString('en-US')} DRAM accesses of &#36;{dramNs} ns&#96;);</code></pre>
<div class="out">$ node dia-quay.js<br>
rpm &nbsp;&nbsp;&nbsp;one turn &nbsp;&nbsp;avg rotational delay (half a turn)<br>
5400 &nbsp;&nbsp;&nbsp;11.11 ms &nbsp;&nbsp;&nbsp;5.56 ms<br>
7200 &nbsp;&nbsp;&nbsp;&nbsp;8.33 ms &nbsp;&nbsp;&nbsp;4.17 ms<br>
10000 &nbsp;&nbsp;&nbsp;6.00 ms &nbsp;&nbsp;&nbsp;3.00 ms<br>
15000 &nbsp;&nbsp;&nbsp;4.00 ms &nbsp;&nbsp;&nbsp;2.00 ms<br>
7200 rpm: seek 9 ms + rotation 4.17 ms = 13.17 ms per random access<br>
= 131,667 DRAM accesses of 100 ns</div>
<p>Khoảng 13 ms cho một lần đọc ngẫu nhiên trên đĩa 7.200 vòng/phút — bằng thời gian của hơn một trăm nghìn lần truy cập bộ nhớ. Khoảng cách đó là lý do HĐH đệm các khối đĩa (Chương 4) và lập lịch cánh tay khéo léo (Chương 5). <strong>SSD</strong> (bộ nhớ flash) không có cánh tay, không quay, nên đọc ngẫu nhiên chỉ mất vài chục micro-giây — nhưng nó mòn dần theo số lần ghi và vẫn chậm hơn RAM rất xa.</p>
<p class="pitfall">⚠️ FE1, FE2, FE4: "Thời gian di chuyển cánh tay tới đúng cylinder gọi là gì?" → <strong>seek time</strong> (không phải rotational delay, không phải access time).</p>`],
      [17, 'I/O Devices',
        `<p class="y-chinh">🎯 Figure 1-11(a): the steps in starting an I/O device and getting an interrupt — (1) the driver tells the disk controller what to do by writing its registers, (2) when done, the controller signals the interrupt controller, (3) which asserts a pin on the CPU, (4) and puts the device's number on the bus.</p>
<p>A device has two parts: the <strong>controller</strong> (chips that accept commands from the OS) and the device itself. The software that talks to a controller is the <strong>device driver</strong>; it runs in kernel mode. The book lists three ways to do I/O: <strong>busy waiting</strong> (the CPU loops asking "done yet?" — wastes the CPU), <strong>interrupts</strong> (start the device, run something else, get interrupted when it finishes — this figure), and <strong>DMA</strong> (a special chip moves the data between device and memory by itself; the older lesson 1.3 explains it).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/3da223223668b5778a2af29220cd20b0454f1ee5.svg" alt="Figure 1-11(a) as a sequence diagram: the CPU is free while the controller works" loading="lazy" /><p class="chu-thich">🧩 Figure 1-11(a) as a sequence diagram: the CPU is free while the controller works</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 1-11(a) as a sequence: starting an I/O and getting an interrupt
participant "Driver\\n(in the kernel, on the CPU)" as D
participant "Disk\\ncontroller" as DC
participant "Interrupt\\ncontroller" as IC
participant "CPU" as CPU
D -&gt; DC : 1. write the command into the controller's registers\\n("read sector 1234 into memory")
note over D, CPU : the CPU now runs ANOTHER process — it does not wait
DC -&gt; DC : the controller does the transfer
DC -&gt; IC : 2. "done!" signal on a bus line
IC -&gt; CPU : 3. assert the CPU's interrupt pin
IC -&gt; CPU : 4. put the device number on the bus
CPU -&gt; CPU : save PC + PSW, switch to kernel mode,\\njump to the handler for that device number
CPU -&gt; D : interrupt handler runs (the driver finishes the job,\\nwakes the waiting process)
CPU -&gt; CPU : return from interrupt: restore PC + PSW
@enduml</code></pre></details>
<p>➕ The Linux kernel counts every interrupt since boot (first number on the <code>intr</code> line of <code>/proc/stat</code>). Measured over one second on the course machine, while nothing much was running:</p>
<div class="out"># The kernel counts every interrupt since boot (first number after "intr")<br>
$ a=$(awk '/^intr/ {print $2}' /proc/stat); c=$(awk '/^ctxt/ {print $2}' /proc/stat)<br>
$ sleep 1<br>
$ b=$(awk '/^intr/ {print $2}' /proc/stat); d=$(awk '/^ctxt/ {print $2}' /proc/stat)<br>
$ echo "interrupts in 1 second: $((b - a))"<br>
interrupts in 1 second: 23114<br>
$ echo "context switches in 1 second: $((d - c))"<br>
context switches in 1 second: 31008</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Thousands of interrupts per second from timers, the virtual disk and network devices — each one a tiny trip into the kernel. The context-switch count is how many times the scheduler swapped which thread runs on a CPU.</p>
<p class="pitfall">⚠️ FE1: "What is the effect of using interrupts instead of polling?" → more efficient use of processor cycles. Polling = busy waiting.</p>`,
        `<p class="y-chinh">🎯 Hình 1-11(a): các bước khởi động một thiết bị I/O và nhận ngắt — (1) driver bảo bộ điều khiển đĩa việc cần làm bằng cách ghi vào các thanh ghi của nó, (2) làm xong, bộ điều khiển báo cho bộ điều khiển ngắt (interrupt controller), (3) bộ này kích một chân của CPU, (4) và đặt số hiệu thiết bị lên bus.</p>
<p>Một thiết bị có hai phần: <strong>bộ điều khiển (controller)</strong> — các chip nhận lệnh từ HĐH — và chính thiết bị. Phần mềm nói chuyện với controller là <strong>trình điều khiển thiết bị (device driver)</strong>; nó chạy ở chế độ nhân. Sách kể ba cách làm I/O: <strong>chờ bận (busy waiting)</strong> — CPU lặp hỏi "xong chưa?", phí CPU; <strong>ngắt (interrupt)</strong> — khởi động thiết bị, làm việc khác, bị ngắt khi thiết bị xong — chính là hình này; và <strong>DMA</strong> — một chip riêng tự chuyển dữ liệu giữa thiết bị và bộ nhớ (bài cũ 1.3 giải thích).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/3da223223668b5778a2af29220cd20b0454f1ee5.svg" alt="Hình 1-11(a) dạng sơ đồ tuần tự: CPU rảnh tay trong lúc controller làm việc" loading="lazy" /><p class="chu-thich">🧩 Hình 1-11(a) dạng sơ đồ tuần tự: CPU rảnh tay trong lúc controller làm việc</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 1-11(a) dạng tuần tự: khởi động một thao tác I/O và nhận ngắt
participant "Driver\\n(in the kernel, on the CPU)" as D
participant "Disk\\ncontroller" as DC
participant "Interrupt\\ncontroller" as IC
participant "CPU" as CPU
D -&gt; DC : 1. write the command into the controller's registers\\n("read sector 1234 into memory")
note over D, CPU : the CPU now runs ANOTHER process — it does not wait
DC -&gt; DC : the controller does the transfer
DC -&gt; IC : 2. "done!" signal on a bus line
IC -&gt; CPU : 3. assert the CPU's interrupt pin
IC -&gt; CPU : 4. put the device number on the bus
CPU -&gt; CPU : save PC + PSW, switch to kernel mode,\\njump to the handler for that device number
CPU -&gt; D : interrupt handler runs (the driver finishes the job,\\nwakes the waiting process)
CPU -&gt; CPU : return from interrupt: restore PC + PSW
@enduml</code></pre></details>
<p>➕ Nhân Linux đếm mọi ngắt kể từ lúc khởi động (số đầu tiên trên dòng <code>intr</code> của <code>/proc/stat</code>). Đo trong một giây trên máy của môn, lúc gần như không có gì chạy:</p>
<div class="out"># Nhân đếm mọi ngắt kể từ khi khởi động (số đầu tiên sau "intr")<br>
$ a=$(awk '/^intr/ {print $2}' /proc/stat); c=$(awk '/^ctxt/ {print $2}' /proc/stat)<br>
$ sleep 1<br>
$ b=$(awk '/^intr/ {print $2}' /proc/stat); d=$(awk '/^ctxt/ {print $2}' /proc/stat)<br>
$ echo "interrupts in 1 second: $((b - a))"<br>
interrupts in 1 second: 23114<br>
$ echo "context switches in 1 second: $((d - c))"<br>
context switches in 1 second: 31008</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Hàng nghìn ngắt mỗi giây từ bộ định thời, đĩa ảo và thiết bị mạng — mỗi ngắt là một chuyến ghé nhân rất ngắn. Số lần chuyển ngữ cảnh (context switch) là số lần bộ lập lịch đổi luồng đang chạy trên một CPU.</p>
<p class="pitfall">⚠️ FE1: "Dùng ngắt thay cho hỏi vòng (polling) có tác dụng gì?" → dùng chu kỳ CPU hiệu quả hơn. Polling = chờ bận.</p>`],
      [18, 'I/O Devices',
        `<p class="y-chinh">🎯 Figure 1-11(b): interrupt processing — while the current instruction runs, (1) the interrupt arrives, (2) the CPU dispatches to the <strong>interrupt handler</strong>, (3) the handler finishes and execution <strong>returns</strong> to the next instruction of the interrupted program.</p>
<p>On an interrupt the hardware saves at least the program counter and the PSW (usually on the stack), switches to kernel mode, and uses the device number as an index into the <strong>interrupt vector</strong> — a table of handler addresses. The handler serves the device; then a special "return from interrupt" instruction restores the saved state and the interrupted program continues, not knowing anything happened. While a handler runs, other interrupts may be masked and wait.</p>
<p>➕ User programs cannot handle hardware interrupts, but UNIX gives them the same pattern in software: a <strong>signal</strong>. Here a timer (<code>alarm(1)</code>) "interrupts" a loop after one second; the handler runs, returns, and the loop continues:</p>
<pre><code class="language-c">// A user-space picture of an interrupt: work is cut off, a handler runs, work resumes
#include &lt;stdio.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;

volatile sig_atomic_t rang = 0;
volatile unsigned long work = 0;

void handler(int sig) {                  // like an interrupt handler: short, then return
    rang = 1;
}

int main(void) {
    signal(SIGALRM, handler);
    alarm(1);                            // "device": a timer that fires in 1 second
    while (!rang) work++;                // the "user program" keeps working
    printf("handler ran after %lu loop steps\\n", work);
    for (int i = 0; i &lt; 1000; i++) work++;
    printf("back in the loop: work continued to %lu\\n", work);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tin-hieu.c -o tin-hieu &amp;&amp; ./tin-hieu<br>
handler ran after 187407676 loop steps<br>
back in the loop: work continued to 187408676</div>
<p>The loop was cut at an arbitrary point (after about a hundred million steps), the handler ran, and execution resumed exactly where it stopped — the user-space mirror of Figure 1-11(b). Signals come back in Chapter 2 and in <code>kill</code> (slide 31).</p>
<p class="meo">🧠 Interrupt = from a device (asynchronous). Trap = requested by the program itself (a system call, slide 27). Exception = an error in the current instruction (divide by zero, illegal instruction, page fault).</p>`,
        `<p class="y-chinh">🎯 Hình 1-11(b): xử lý ngắt — trong lúc lệnh hiện tại đang chạy, (1) ngắt tới, (2) CPU chuyển sang <strong>trình xử lý ngắt (interrupt handler)</strong>, (3) trình xử lý xong thì việc thực thi <strong>quay lại</strong> lệnh kế tiếp của chương trình bị ngắt.</p>
<p>Khi có ngắt, phần cứng lưu ít nhất bộ đếm chương trình và PSW (thường lên ngăn xếp), chuyển sang chế độ nhân, và dùng số hiệu thiết bị làm chỉ số tra <strong>vector ngắt (interrupt vector)</strong> — một bảng địa chỉ các trình xử lý. Trình xử lý phục vụ thiết bị; rồi một lệnh đặc biệt "trở về từ ngắt" khôi phục trạng thái đã lưu và chương trình bị ngắt chạy tiếp, không hề biết chuyện gì đã xảy ra. Trong lúc một trình xử lý chạy, các ngắt khác có thể bị che (mask) và phải chờ.</p>
<p>➕ Chương trình người dùng không xử lý được ngắt phần cứng, nhưng UNIX cho chúng cùng khuôn mẫu đó bằng phần mềm: <strong>tín hiệu (signal)</strong>. Ở đây một bộ hẹn giờ (<code>alarm(1)</code>) "ngắt" một vòng lặp sau một giây; trình xử lý chạy, trở về, và vòng lặp tiếp tục:</p>
<pre><code class="language-c">// Hình ảnh một ngắt ở không gian người dùng: việc bị cắt ngang, trình xử lý chạy, việc tiếp tục
#include &lt;stdio.h&gt;
#include &lt;signal.h&gt;
#include &lt;unistd.h&gt;

volatile sig_atomic_t rang = 0;
volatile unsigned long work = 0;

void handler(int sig) {                  // như trình xử lý ngắt: ngắn gọn rồi trở về
    rang = 1;
}

int main(void) {
    signal(SIGALRM, handler);
    alarm(1);                            // "thiết bị": bộ hẹn giờ nổ sau 1 giây
    while (!rang) work++;                // "chương trình người dùng" cứ làm việc
    printf("handler ran after %lu loop steps\\n", work);
    for (int i = 0; i &lt; 1000; i++) work++;
    printf("back in the loop: work continued to %lu\\n", work);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tin-hieu.c -o tin-hieu &amp;&amp; ./tin-hieu<br>
handler ran after 187407676 loop steps<br>
back in the loop: work continued to 187408676</div>
<p>Vòng lặp bị cắt ở một điểm bất kỳ (sau khoảng một trăm triệu bước), trình xử lý chạy, và việc thực thi tiếp tục đúng chỗ đã dừng — bản sao ở không gian người dùng của Hình 1-11(b). Tín hiệu quay lại ở Chương 2 và ở <code>kill</code> (slide 31).</p>
<p class="meo">🧠 Ngắt (interrupt) = do thiết bị gây ra (bất đồng bộ). Bẫy (trap) = chính chương trình chủ động yêu cầu (lời gọi hệ thống, slide 27). Ngoại lệ (exception) = lỗi ở lệnh hiện tại (chia cho 0, lệnh không hợp lệ, lỗi trang).</p>`],
      [19, 'Buses',
        `<p class="y-chinh">🎯 Figure 1-12: the structure of a large x86 system — the CPU chip contains cores, caches, GPU cores and memory controllers; <strong>PCIe</strong> links go to graphics; a <strong>DMI</strong> link goes to the <strong>Platform Controller Hub</strong>, which serves SATA disks, USB ports, Gigabit Ethernet and more PCIe/PCI slots.</p>
<p>A <strong>bus</strong> is a set of wires (or serial links) plus rules for using them. One shared bus (Figure 1-6) became a bottleneck, so modern machines have many specialised ones; PCIe replaced the old parallel PCI bus with fast point-to-point serial lanes. The OS must discover every device on every bus at boot (the <strong>BIOS</strong>/<strong>UEFI</strong> firmware starts this, then the kernel's bus drivers take over) and load the right driver — "plug and play".</p>
<p>➕ This figure is from 2015 and shows its age: DDR3 memory, USB 2.0/3.0 and SATA disks. A current PC uses DDR5 memory, PCIe 4.0/5.0, NVMe SSDs connected directly by PCIe, and USB4/Thunderbolt. The idea — a hierarchy of buses joined by controllers — is unchanged. In the course virtual machine, devices sit on <code>virtio</code>, a bus invented for virtual machines (it appeared in the bus list at slide 2).</p>
<p class="meo">🧠 Booting in one line: firmware (BIOS/UEFI) tests the hardware → finds a boot device → loads the boot loader → the boot loader loads the kernel → the kernel starts the first process (on Linux, <code>systemd</code> or another init, PID 1).</p>`,
        `<p class="y-chinh">🎯 Hình 1-12: cấu trúc một hệ x86 lớn — chip CPU chứa các nhân, cache, nhân GPU và bộ điều khiển bộ nhớ; các liên kết <strong>PCIe</strong> đi tới card đồ hoạ; một liên kết <strong>DMI</strong> đi tới <strong>Platform Controller Hub</strong>, nơi phục vụ ổ SATA, cổng USB, Gigabit Ethernet và thêm các khe PCIe/PCI.</p>
<p><strong>Bus</strong> là một tập dây (hoặc liên kết nối tiếp) cộng luật sử dụng chúng. Một bus chung duy nhất (Hình 1-6) trở thành nút cổ chai, nên máy hiện đại có nhiều bus chuyên biệt; PCIe thay bus PCI song song cũ bằng các làn nối tiếp điểm-điểm tốc độ cao. Lúc khởi động, HĐH phải dò mọi thiết bị trên mọi bus (firmware <strong>BIOS</strong>/<strong>UEFI</strong> bắt đầu việc này, rồi các driver bus của nhân làm tiếp) và nạp đúng driver — "cắm là chạy" (plug and play).</p>
<p>➕ Hình này từ năm 2015 và đã cũ: bộ nhớ DDR3, USB 2.0/3.0 và ổ SATA. PC hiện nay dùng bộ nhớ DDR5, PCIe 4.0/5.0, SSD NVMe gắn thẳng vào PCIe, và USB4/Thunderbolt. Ý tưởng — một hệ thống bus phân cấp nối với nhau qua các bộ điều khiển — thì không đổi. Trong máy ảo của môn, thiết bị nằm trên <code>virtio</code>, một bus sinh ra cho máy ảo (nó có trong danh sách bus ở slide 2).</p>
<p class="meo">🧠 Khởi động trong một dòng: firmware (BIOS/UEFI) kiểm tra phần cứng → tìm thiết bị khởi động → nạp boot loader → boot loader nạp nhân → nhân khởi chạy tiến trình đầu tiên (trên Linux là <code>systemd</code> hay một init khác, PID 1).</p>`],
      [20, 'The Operating System Zoo',
        `<p class="y-chinh">🎯 Nine kinds of operating system: mainframe, server, multiprocessor, personal computer, handheld, embedded, sensor-node, real-time and smart-card OSes — each shaped by a different main constraint.</p>
<table>
<thead><tr><th>Kind</th><th>Main constraint it optimises</th><th>Examples</th></tr></thead>
<tbody>
<tr><td>Mainframe</td><td>huge I/O throughput: batch, transactions, timesharing</td><td>IBM z/OS</td></tr>
<tr><td>Server</td><td>many users / requests at once over a network</td><td>Linux, Windows Server, FreeBSD</td></tr>
<tr><td>Multiprocessor</td><td>many CPUs kept busy and consistent</td><td>Linux, Windows (Chapter 8)</td></tr>
<tr><td>Personal computer</td><td>one user, good interactive response</td><td>Windows, macOS, Linux desktops</td></tr>
<tr><td>Handheld</td><td>battery, small memory, touch</td><td>Android, iOS</td></tr>
<tr><td>Embedded</td><td>fixed software, small and cheap</td><td>in TVs, cars, routers; often Linux or an RTOS</td></tr>
<tr><td>Sensor node</td><td>tiny battery-powered nodes with radios</td><td>TinyOS</td></tr>
<tr><td>Real-time</td><td>deadlines: hard (must) or soft (should)</td><td>VxWorks, QNX, FreeRTOS, Linux with PREEMPT_RT</td></tr>
<tr><td>Smart card</td><td>a few KB of memory in a credit-card chip</td><td>Java Card</td></tr>
</tbody>
</table>
<p>The older web lesson 1.2 discusses each kind in more depth. ➕ The zoo is shrinking towards one kernel: Linux now runs servers, supercomputers, Android phones, routers, cars and, with real-time patches, controllers — what differs is the configuration, not the architecture.</p>
<p class="pitfall">⚠️ "Real-time" means <strong>predictable</strong> (a guaranteed upper bound on response time), not "fast". Hard real-time: missing a deadline is a failure (airbag, ABS brakes). Soft real-time: occasional misses are tolerated (video, audio).</p>`,
        `<p class="y-chinh">🎯 Chín loại hệ điều hành: máy lớn (mainframe), máy chủ (server), đa xử lý, máy tính cá nhân, cầm tay, nhúng, nút cảm biến, thời gian thực và thẻ thông minh — mỗi loại được nhào nặn bởi một ràng buộc chính khác nhau.</p>
<table>
<thead><tr><th>Loại</th><th>Ràng buộc chính nó tối ưu</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Máy lớn</td><td>thông lượng I/O khổng lồ: lô, giao dịch, chia sẻ thời gian</td><td>IBM z/OS</td></tr>
<tr><td>Máy chủ</td><td>nhiều người dùng / yêu cầu cùng lúc qua mạng</td><td>Linux, Windows Server, FreeBSD</td></tr>
<tr><td>Đa xử lý</td><td>giữ nhiều CPU luôn bận và nhất quán</td><td>Linux, Windows (Chương 8)</td></tr>
<tr><td>Máy tính cá nhân</td><td>một người dùng, phản hồi tương tác tốt</td><td>Windows, macOS, Linux desktop</td></tr>
<tr><td>Cầm tay</td><td>pin, bộ nhớ nhỏ, cảm ứng</td><td>Android, iOS</td></tr>
<tr><td>Nhúng</td><td>phần mềm cố định, nhỏ và rẻ</td><td>trong TV, ô tô, router; thường là Linux hay một RTOS</td></tr>
<tr><td>Nút cảm biến</td><td>nút tí hon chạy pin, có sóng radio</td><td>TinyOS</td></tr>
<tr><td>Thời gian thực</td><td>hạn chót: cứng (bắt buộc) hoặc mềm (nên)</td><td>VxWorks, QNX, FreeRTOS, Linux có PREEMPT_RT</td></tr>
<tr><td>Thẻ thông minh</td><td>vài KB bộ nhớ trong chip thẻ tín dụng</td><td>Java Card</td></tr>
</tbody>
</table>
<p>Bài web cũ 1.2 bàn từng loại kỹ hơn. ➕ Vườn thú đang co lại về một nhân: Linux giờ chạy máy chủ, siêu máy tính, điện thoại Android, router, ô tô và, với bản vá thời gian thực, cả bộ điều khiển — khác nhau ở cấu hình, không ở kiến trúc.</p>
<p class="pitfall">⚠️ "Thời gian thực" nghĩa là <strong>đoán trước được</strong> (có cận trên đảm bảo cho thời gian đáp ứng), không phải "nhanh". Thời gian thực cứng: trễ hạn là hỏng (túi khí, phanh ABS). Thời gian thực mềm: thỉnh thoảng trễ vẫn chấp nhận được (video, âm thanh).</p>`],
      [21, 'Processes (1)',
        `<p class="y-chinh">🎯 A <strong>process</strong> is the key concept of every OS: a <strong>program in execution</strong>. It is associated with an <strong>address space</strong> and a <strong>set of resources</strong>, and can be thought of as a <strong>container</strong> holding all the information needed to run the program.</p>
<p>The <strong>address space</strong> is the list of memory locations the process may use: its program code, data and stack. The <strong>resources</strong> include registers (PC, SP…), open files, child processes, pending signals, alarms, the user it runs as. When the OS suspends a process to run another, it saves all of this in the <strong>process table</strong> (one entry per process, the "process control block") so the process can later restart exactly where it stopped.</p>
<p>➕ Linux shows every process as a folder <code>/proc/&lt;PID&gt;</code>; <code>/proc/self</code> is whichever process opens it:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A process seen from inside: Linux shows every process as a folder /proc/&lt;PID&gt;<br>
# /proc/self = the process that reads it (here: grep, or cat)<br>
$ grep -E '^(Name|State|Pid|PPid|Uid|Threads|VmRSS)' /proc/self/status<br>
Name:	grep<br>
State:	R (running)<br>
Pid:	9<br>
PPid:	1<br>
Uid:	1000	1000	1000	1000<br>
VmRSS:	 &nbsp;&nbsp;&nbsp;1776 kB<br>
Threads:	1<br>
# its address space: code, data, heap, libraries, stack<br>
$ cat /proc/self/maps | cut -c1-120 | grep -E 'r-xp|heap|stack' | head -5<br>
aaaacef30000-aaaacef39000 r-xp 00000000 00:41 163097 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/usr/bin/cat<br>
aaaaf4503000-aaaaf4524000 rw-p 00000000 00:00 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[heap]<br>
ffff9a6b0000-ffff9a83c000 r-xp 00000000 00:41 235186 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff9a86c000-ffff9a893000 r-xp 00000000 00:41 235168 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/ld-linux-aarch64.so.<br>
ffff9a8a8000-ffff9a8aa000 r-xp 00000000 00:00 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[vdso]<br>
# its open files: 0 = stdin, 1 = stdout, 2 = stderr (3 = the folder ls itself is reading)<br>
$ ls /proc/self/fd<br>
0<br>
1<br>
2<br>
3</div>
<p>The first command looked at itself (<code>grep</code>): its PID, its parent's PID (the shell), its user ID, its memory in RAM (<code>VmRSS</code>), its one thread. The second listed part of the address space of <code>cat</code>: its code (<code>r-xp</code> = readable and executable), its heap, the C library and loader, the special <code>[vdso]</code> page (older lesson 1.1). The third listed the open files: 0, 1, 2 are standard input, output and error.</p>
<p class="pitfall">⚠️ Program ≠ process. A program is a file on disk (passive); a process is that program running, with its own state (active). Two users running the same editor = one program, two processes.</p>`,
        `<p class="y-chinh">🎯 <strong>Tiến trình (process)</strong> là khái niệm then chốt của mọi HĐH: một <strong>chương trình đang thực thi</strong>. Nó gắn với một <strong>không gian địa chỉ (address space)</strong> và một <strong>tập tài nguyên</strong>, và có thể hình dung như một <strong>cái hộp chứa</strong> mọi thông tin cần để chạy chương trình.</p>
<p><strong>Không gian địa chỉ</strong> là danh sách các ô nhớ tiến trình được dùng: mã chương trình, dữ liệu và ngăn xếp. <strong>Tài nguyên</strong> gồm thanh ghi (PC, SP…), tệp đang mở, tiến trình con, tín hiệu đang chờ, báo thức, người dùng mà nó chạy dưới danh nghĩa. Khi HĐH tạm dừng một tiến trình để chạy tiến trình khác, nó lưu tất cả những thứ đó vào <strong>bảng tiến trình (process table)</strong> (mỗi tiến trình một mục, gọi là "khối điều khiển tiến trình" — PCB) để sau này tiến trình chạy lại đúng chỗ đã dừng.</p>
<p>➕ Linux trình bày mỗi tiến trình thành một thư mục <code>/proc/&lt;PID&gt;</code>; <code>/proc/self</code> là chính tiến trình đang mở nó:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Nhìn tiến trình từ bên trong: Linux cho mỗi tiến trình một thư mục /proc/&lt;PID&gt;<br>
# /proc/self = chính tiến trình đang đọc nó (ở đây: grep, hay cat)<br>
$ grep -E '^(Name|State|Pid|PPid|Uid|Threads|VmRSS)' /proc/self/status<br>
Name:	grep<br>
State:	R (running)<br>
Pid:	9<br>
PPid:	1<br>
Uid:	1000	1000	1000	1000<br>
VmRSS:	 &nbsp;&nbsp;&nbsp;1776 kB<br>
Threads:	1<br>
# không gian địa chỉ của nó: mã, dữ liệu, heap, thư viện, ngăn xếp<br>
$ cat /proc/self/maps | cut -c1-120 | grep -E 'r-xp|heap|stack' | head -5<br>
aaaacef30000-aaaacef39000 r-xp 00000000 00:41 163097 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/usr/bin/cat<br>
aaaaf4503000-aaaaf4524000 rw-p 00000000 00:00 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[heap]<br>
ffff9a6b0000-ffff9a83c000 r-xp 00000000 00:41 235186 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffff9a86c000-ffff9a893000 r-xp 00000000 00:41 235168 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/ld-linux-aarch64.so.<br>
ffff9a8a8000-ffff9a8aa000 r-xp 00000000 00:00 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[vdso]<br>
# các tệp nó đang mở: 0 = stdin, 1 = stdout, 2 = stderr (3 = thư mục mà chính ls đang đọc)<br>
$ ls /proc/self/fd<br>
0<br>
1<br>
2<br>
3</div>
<p>Lệnh đầu tự soi chính mình (<code>grep</code>): PID của nó, PID của cha (shell), mã người dùng, bộ nhớ đang chiếm trong RAM (<code>VmRSS</code>), đúng một luồng. Lệnh thứ hai liệt kê một phần không gian địa chỉ của <code>cat</code>: mã của nó (<code>r-xp</code> = đọc được và thực thi được), heap, thư viện C và trình nạp, trang đặc biệt <code>[vdso]</code> (bài cũ 1.1). Lệnh thứ ba liệt kê các tệp đang mở: 0, 1, 2 là đầu vào, đầu ra và luồng lỗi chuẩn.</p>
<p class="pitfall">⚠️ Chương trình ≠ tiến trình. Chương trình là một tệp nằm trên đĩa (thụ động); tiến trình là chương trình đó đang chạy, với trạng thái riêng (chủ động). Hai người cùng chạy một trình soạn thảo = một chương trình, hai tiến trình.</p>`],
      [22, 'Processes (2)',
        `<p class="y-chinh">🎯 Figure 1-13: a <strong>process tree</strong> — process A created two child processes, B and C; process B created three child processes, D, E and F.</p>
<p>Processes create other processes (with <code>fork</code> on UNIX, slide 28), so they form a tree: each process has exactly one parent and zero or more <strong>children</strong>. Related processes cooperate — they can communicate (<strong>interprocess communication</strong>, IPC: pipes, signals, shared memory), and a parent usually waits for its children to finish and collects their exit status.</p>
<p>➕ The figure built for real. The program forks B and C; B forks D, E and F; each process gives itself the letter of the figure as its name; then A asks <code>pstree</code> to draw the tree that exists at that moment:</p>
<pre><code class="language-c">// Build Figure 1-13 for real: A creates B and C; B creates D, E and F
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/prctl.h&gt;
#include &lt;sys/wait.h&gt;

static pid_t con(const char *ten, void (*viec)(void)) {   // fork a child with a name
    pid_t p = fork();
    if (p == 0) {
        prctl(PR_SET_NAME, ten);         // the name ps/pstree will show
        viec();
        exit(0);
    }
    return p;
}
static void ngu(void) { sleep(2); }      // a leaf just waits a bit
static void lam_B(void) {
    con("D", ngu); con("E", ngu); con("F", ngu);
    while (wait(NULL) &gt; 0) { }
}

int main(void) {
    prctl(PR_SET_NAME, "A");
    con("B", lam_B);
    con("C", ngu);
    sleep(1);                            // let everyone be born
    char cmd[64];
    snprintf(cmd, sizeof cmd, "pstree %d", getpid());
    fflush(stdout);
    system(cmd);                         // draw the tree that exists right now
    while (wait(NULL) &gt; 0) { }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cay-tien-trinh.c -o cay-tien-trinh &amp;&amp; ./cay-tien-trinh<br>
A-+-B-+-D<br>
&nbsp;&nbsp;| &nbsp;&nbsp;|-E<br>
&nbsp;&nbsp;| &nbsp;&nbsp;&#96;-F<br>
&nbsp;&nbsp;|-C<br>
&nbsp;&nbsp;&#96;-sh---pstree</div>
<p>Exactly Figure 1-13 — plus one more branch, <code>sh---pstree</code>: to run <code>pstree</code>, A itself created a child (through <code>system()</code>). On your own Linux, <code>pstree</code> or <code>ps -ef --forest</code> shows the whole tree from PID 1 down.</p>
<p class="meo">🧠 Every process has a parent; the root of the tree is the first process the kernel starts (<code>init</code>/<code>systemd</code>, PID 1). Windows has no real tree: a parent gets a handle to its child but the hierarchy is not enforced (Chapter 11).</p>`,
        `<p class="y-chinh">🎯 Hình 1-13: một <strong>cây tiến trình (process tree)</strong> — tiến trình A tạo hai tiến trình con là B và C; tiến trình B tạo ba tiến trình con D, E và F.</p>
<p>Tiến trình tạo ra tiến trình khác (bằng <code>fork</code> trên UNIX, slide 28), nên chúng hợp thành một cây: mỗi tiến trình có đúng một cha và không hoặc nhiều <strong>con (child)</strong>. Các tiến trình có quan hệ thì hợp tác — chúng giao tiếp được với nhau (<strong>giao tiếp liên tiến trình</strong>, IPC: pipe, tín hiệu, bộ nhớ chia sẻ), và cha thường đợi các con kết thúc rồi thu mã thoát của chúng.</p>
<p>➕ Dựng hình này thật. Chương trình fork ra B và C; B fork ra D, E và F; mỗi tiến trình tự đặt tên mình bằng chữ cái trong hình; rồi A nhờ <code>pstree</code> vẽ cây đang tồn tại đúng lúc đó:</p>
<pre><code class="language-c">// Dựng thật Hình 1-13: A tạo B và C; B tạo D, E và F
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/prctl.h&gt;
#include &lt;sys/wait.h&gt;

static pid_t con(const char *ten, void (*viec)(void)) {   // fork một con và đặt tên
    pid_t p = fork();
    if (p == 0) {
        prctl(PR_SET_NAME, ten);         // tên mà ps/pstree sẽ hiện
        viec();
        exit(0);
    }
    return p;
}
static void ngu(void) { sleep(2); }      // tiến trình lá chỉ chờ một lúc
static void lam_B(void) {
    con("D", ngu); con("E", ngu); con("F", ngu);
    while (wait(NULL) &gt; 0) { }
}

int main(void) {
    prctl(PR_SET_NAME, "A");
    con("B", lam_B);
    con("C", ngu);
    sleep(1);                            // chờ mọi tiến trình ra đời
    char cmd[64];
    snprintf(cmd, sizeof cmd, "pstree %d", getpid());
    fflush(stdout);
    system(cmd);                         // vẽ cây đang tồn tại ngay lúc này
    while (wait(NULL) &gt; 0) { }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread cay-tien-trinh.c -o cay-tien-trinh &amp;&amp; ./cay-tien-trinh<br>
A-+-B-+-D<br>
&nbsp;&nbsp;| &nbsp;&nbsp;|-E<br>
&nbsp;&nbsp;| &nbsp;&nbsp;&#96;-F<br>
&nbsp;&nbsp;|-C<br>
&nbsp;&nbsp;&#96;-sh---pstree</div>
<p>Đúng Hình 1-13 — thêm một nhánh nữa, <code>sh---pstree</code>: để chạy <code>pstree</code>, chính A đã tạo một con (qua <code>system()</code>). Trên Linux của bạn, <code>pstree</code> hay <code>ps -ef --forest</code> vẽ cả cây từ PID 1 trở xuống.</p>
<p class="meo">🧠 Tiến trình nào cũng có cha; gốc của cây là tiến trình đầu tiên nhân khởi chạy (<code>init</code>/<code>systemd</code>, PID 1). Windows không có cây thật sự: cha nhận được một handle tới con nhưng thứ bậc không bị ràng buộc (Chương 11).</p>`],
      [23, 'Files (1)',
        `<p class="y-chinh">🎯 Figure 1-14: a <strong>file system</strong> for a university department — directories (Students, Faculty, Prof.Brown, Courses, Papers…) form a tree under the <strong>root directory</strong>; files (the small circles) are the leaves.</p>
<p>A <strong>file</strong> is the OS abstraction for data on a disk: a named sequence of bytes. <strong>Directories</strong> group files and other directories, giving a hierarchy. Every file has a <strong>path name</strong>: an <strong>absolute path</strong> starts at the root (<code>/Faculty/Prof.Brown/Courses/CS101</code>), a <strong>relative path</strong> starts at the process's <strong>working directory</strong>. UNIX separates path components with <code>/</code>, Windows with <code>\\</code>.</p>
<p>➕ Part of the figure rebuilt, then reached by absolute and relative paths:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Rebuild part of Figure 1-14 and look at it<br>
$ mkdir -p uni/Students/{Robbert,Matty,Leo} uni/Faculty/Prof.Brown/{Courses/{CS101,CS105},Papers,Grants,Committees/{SOSP,COST-11}} uni/Faculty/{Prof.Green,Prof.White}<br>
$ touch uni/Faculty/Prof.Brown/Papers/{paper1,paper2,paper3}<br>
$ tree uni<br>
uni<br>
├── Faculty<br>
│   ├── Prof.Brown<br>
│   │   ├── Committees<br>
│   │   │   ├── COST-11<br>
│   │   │   └── SOSP<br>
│   │   ├── Courses<br>
│   │   │   ├── CS101<br>
│   │   │   └── CS105<br>
│   │   ├── Grants<br>
│   │   └── Papers<br>
│   │   &nbsp;&nbsp;&nbsp;&nbsp;├── paper1<br>
│   │   &nbsp;&nbsp;&nbsp;&nbsp;├── paper2<br>
│   │   &nbsp;&nbsp;&nbsp;&nbsp;└── paper3<br>
│   ├── Prof.Green<br>
│   └── Prof.White<br>
└── Students<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── Leo<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── Matty<br>
&nbsp;&nbsp;&nbsp;&nbsp;└── Robbert<br>
<br>
17 directories, 3 files<br>
# absolute path (from the root /) vs relative path (from where you are)<br>
$ cd uni/Faculty/Prof.Brown<br>
$ pwd<br>
/home/sv/uni/Faculty/Prof.Brown<br>
$ ls Courses<br>
CS101<br>
CS105<br>
$ ls /home/sv/uni/Faculty/Prof.Brown/Courses<br>
CS101<br>
CS105<br>
$ ls ../Prof.Green</div>
<p><code>tree</code> draws the same hierarchy as the figure. After <code>cd</code>, the working directory is Prof.Brown, so <code>Courses</code> (relative) and <code>/home/sv/uni/Faculty/Prof.Brown/Courses</code> (absolute) name the same folder; <code>..</code> means "the parent directory".</p>
<p class="pitfall">⚠️ The process tree (slide 22) and the directory tree look alike but differ: process trees are short-lived and shallow; the file tree persists on disk for years and can be deep.</p>`,
        `<p class="y-chinh">🎯 Hình 1-14: một <strong>hệ thống tệp (file system)</strong> của một khoa ở trường đại học — các thư mục (Students, Faculty, Prof.Brown, Courses, Papers…) tạo thành một cây dưới <strong>thư mục gốc (root directory)</strong>; các tệp (vòng tròn nhỏ) là lá.</p>
<p><strong>Tệp (file)</strong> là trừu tượng của HĐH cho dữ liệu trên đĩa: một dãy byte có tên. <strong>Thư mục (directory)</strong> gom các tệp và thư mục khác, tạo nên phân cấp. Mỗi tệp có một <strong>đường dẫn (path name)</strong>: <strong>đường dẫn tuyệt đối</strong> bắt đầu từ gốc (<code>/Faculty/Prof.Brown/Courses/CS101</code>), <strong>đường dẫn tương đối</strong> bắt đầu từ <strong>thư mục làm việc (working directory)</strong> của tiến trình. UNIX ngăn các thành phần đường dẫn bằng <code>/</code>, Windows bằng <code>\\</code>.</p>
<p>➕ Dựng lại một phần hình, rồi đi tới bằng đường dẫn tuyệt đối và tương đối:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Dựng lại một phần Hình 1-14 rồi xem<br>
$ mkdir -p uni/Students/{Robbert,Matty,Leo} uni/Faculty/Prof.Brown/{Courses/{CS101,CS105},Papers,Grants,Committees/{SOSP,COST-11}} uni/Faculty/{Prof.Green,Prof.White}<br>
$ touch uni/Faculty/Prof.Brown/Papers/{paper1,paper2,paper3}<br>
$ tree uni<br>
uni<br>
├── Faculty<br>
│   ├── Prof.Brown<br>
│   │   ├── Committees<br>
│   │   │   ├── COST-11<br>
│   │   │   └── SOSP<br>
│   │   ├── Courses<br>
│   │   │   ├── CS101<br>
│   │   │   └── CS105<br>
│   │   ├── Grants<br>
│   │   └── Papers<br>
│   │   &nbsp;&nbsp;&nbsp;&nbsp;├── paper1<br>
│   │   &nbsp;&nbsp;&nbsp;&nbsp;├── paper2<br>
│   │   &nbsp;&nbsp;&nbsp;&nbsp;└── paper3<br>
│   ├── Prof.Green<br>
│   └── Prof.White<br>
└── Students<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── Leo<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── Matty<br>
&nbsp;&nbsp;&nbsp;&nbsp;└── Robbert<br>
<br>
17 directories, 3 files<br>
# đường dẫn tuyệt đối (từ gốc /) và tương đối (từ chỗ đang đứng)<br>
$ cd uni/Faculty/Prof.Brown<br>
$ pwd<br>
/home/sv/uni/Faculty/Prof.Brown<br>
$ ls Courses<br>
CS101<br>
CS105<br>
$ ls /home/sv/uni/Faculty/Prof.Brown/Courses<br>
CS101<br>
CS105<br>
$ ls ../Prof.Green</div>
<p><code>tree</code> vẽ đúng phân cấp như hình. Sau <code>cd</code>, thư mục làm việc là Prof.Brown, nên <code>Courses</code> (tương đối) và <code>/home/sv/uni/Faculty/Prof.Brown/Courses</code> (tuyệt đối) chỉ cùng một thư mục; <code>..</code> nghĩa là "thư mục cha".</p>
<p class="pitfall">⚠️ Cây tiến trình (slide 22) và cây thư mục trông giống nhau nhưng khác: cây tiến trình sống ngắn và nông; cây tệp nằm trên đĩa nhiều năm và có thể rất sâu.</p>`],
      [24, 'Files (2)',
        `<p class="y-chinh">🎯 Figure 1-15: (a) before <strong>mounting</strong>, the files on the CD-ROM are not accessible; (b) after mounting, they are part of the file hierarchy — the CD-ROM's root directory now appears at directory <code>b</code>.</p>
<p>UNIX keeps <strong>one</strong> tree for everything; a removable disk or a second partition is attached ("mounted") onto an existing directory, its <strong>mount point</strong>. Whatever that directory contained before is hidden while the new file system is mounted. Windows took the other road: one tree per drive letter (<code>C:</code>, <code>D:</code>).</p>
<p>➕ Nobody has a CD-ROM any more, so here is the same figure with a USB stick (a FAT-formatted disk image), run with root rights in the container:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 1-15 today: a USB stick instead of a CD-ROM<br>
# make an 8 MB "USB stick" (a disk image formatted FAT, like real sticks)<br>
$ truncate -s 8M /tmp/usb.img<br>
$ mkfs.vfat -n MYUSB /tmp/usb.img &gt; /dev/null<br>
$ mkdir -p /mnt/usb<br>
$ ls /mnt/usb<br>
# before mounting, the files on the stick are NOT reachable; mount makes them part of the tree<br>
$ mount -o loop /tmp/usb.img /mnt/usb<br>
$ echo "lecture notes" &gt; /mnt/usb/notes.txt<br>
$ ls -l /mnt/usb<br>
total 2<br>
-rwxr-xr-x 1 root root 14 Oct 26 00:27 notes.txt<br>
$ findmnt -o TARGET,FSTYPE,SOURCE /mnt/usb<br>
TARGET &nbsp;&nbsp;FSTYPE SOURCE<br>
/mnt/usb vfat &nbsp;&nbsp;/dev/loop0<br>
$ umount /mnt/usb<br>
$ ls /mnt/usb</div>
<p>The empty directory <code>/mnt/usb</code> becomes, after <code>mount</code>, the root of the stick's file system (type <code>vfat</code>, coming from the loop device <code>/dev/loop0</code>); after <code>umount</code> it is empty again — the file now lives only inside the image. Desktop Linux does the same automatically when you plug in a stick (usually under <code>/media</code>).</p>
<p class="meo">🧠 Mount = "attach a whole file system onto a directory". It appears again as a system call at slide 35 and with Docker volumes (<code>-v folder:/w</code> is a mount).</p>`,
        `<p class="y-chinh">🎯 Hình 1-15: (a) trước khi <strong>mount</strong> (gắn kết), các tệp trên CD-ROM không truy cập được; (b) sau khi mount, chúng thành một phần của phân cấp tệp — thư mục gốc của CD-ROM giờ hiện ra tại thư mục <code>b</code>.</p>
<p>UNIX giữ <strong>một</strong> cây cho tất cả; một đĩa tháo rời hay một phân vùng thứ hai được gắn ("mount") vào một thư mục có sẵn, gọi là <strong>điểm gắn kết (mount point)</strong>. Nội dung cũ của thư mục đó bị che đi trong lúc hệ thống tệp mới được gắn. Windows đi đường khác: mỗi ký tự ổ đĩa một cây (<code>C:</code>, <code>D:</code>).</p>
<p>➕ Chẳng ai còn CD-ROM, nên đây là cùng hình đó với một chiếc USB (ảnh đĩa định dạng FAT), chạy bằng quyền root trong container:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 1-15 ngày nay: USB thay cho CD-ROM<br>
# làm một "USB" 8 MB (ảnh đĩa định dạng FAT như USB thật)<br>
$ truncate -s 8M /tmp/usb.img<br>
$ mkfs.vfat -n MYUSB /tmp/usb.img &gt; /dev/null<br>
$ mkdir -p /mnt/usb<br>
$ ls /mnt/usb<br>
# trước khi mount, tệp trên USB KHÔNG truy cập được; mount ghép chúng vào cây<br>
$ mount -o loop /tmp/usb.img /mnt/usb<br>
$ echo "lecture notes" &gt; /mnt/usb/notes.txt<br>
$ ls -l /mnt/usb<br>
total 2<br>
-rwxr-xr-x 1 root root 14 Oct 26 00:27 notes.txt<br>
$ findmnt -o TARGET,FSTYPE,SOURCE /mnt/usb<br>
TARGET &nbsp;&nbsp;FSTYPE SOURCE<br>
/mnt/usb vfat &nbsp;&nbsp;/dev/loop0<br>
$ umount /mnt/usb<br>
$ ls /mnt/usb</div>
<p>Thư mục rỗng <code>/mnt/usb</code>, sau <code>mount</code>, trở thành gốc của hệ thống tệp trên USB (kiểu <code>vfat</code>, lấy từ thiết bị vòng <code>/dev/loop0</code>); sau <code>umount</code> nó lại rỗng — tệp giờ chỉ còn nằm trong ảnh đĩa. Linux có giao diện làm y như vậy một cách tự động khi bạn cắm USB (thường dưới <code>/media</code>).</p>
<p class="meo">🧠 Mount = "gắn nguyên một hệ thống tệp lên một thư mục". Nó xuất hiện lại dưới dạng lời gọi hệ thống ở slide 35 và trong volume của Docker (<code>-v thư-mục:/w</code> chính là một lần mount).</p>`],
      [25, 'Files (3)',
        `<p class="y-chinh">🎯 Figure 1-16: two processes connected by a <strong>pipe</strong> — a pseudofile that one process writes into and the other reads from, as if it were an ordinary file.</p>
<p>A pipe lets processes communicate without knowing anything about each other: process A writes bytes into the pipe, process B reads them in the same order; if the pipe is empty, B waits; if it is full, A waits. Because a pipe looks like a file, a program that reads from a file can read from a pipe unchanged — the reason UNIX shell commands combine so well.</p>
<p>➕ Figure 1-16 in C: the parent (A) writes into the pipe, the child (B) reads from it:</p>
<pre><code class="language-c">// Figure 1-16 in C: process A writes into a pipe, process B reads from it
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    int fd[2];
    pipe(fd);                              // fd[0] = read end, fd[1] = write end
    if (fork() == 0) {                     // process B (child)
        close(fd[1]);
        char buf[64] = {0};
        ssize_t n = read(fd[0], buf, sizeof buf - 1);   // waits until A writes
        printf("B read %zd bytes: %s\\n", n, buf);
        return 0;
    }
    close(fd[0]);                          // process A (parent)
    const char *msg = "hello through the pipe";
    write(fd[1], msg, strlen(msg));
    close(fd[1]);
    wait(NULL);
    printf("A: done\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread pipe.c -o pipe &amp;&amp; ./pipe<br>
B read 22 bytes: hello through the pipe<br>
A: done</div>
<p><code>pipe()</code> returns two file descriptors (read end, write end); <code>fork()</code> gives both to the child; each process closes the end it does not use. In the shell, the <code>|</code> character does exactly this for you: <code>ps aux | grep java | wc -l</code> starts three processes joined by two pipes.</p>
<p class="pitfall">⚠️ A pipe is one-directional and exists only while the processes use it; the data passes through kernel memory, never through the disk.</p>`,
        `<p class="y-chinh">🎯 Hình 1-16: hai tiến trình nối với nhau bằng một <strong>pipe (đường ống)</strong> — một tệp giả mà tiến trình này ghi vào còn tiến trình kia đọc ra, cứ như một tệp bình thường.</p>
<p>Pipe cho các tiến trình giao tiếp mà không cần biết gì về nhau: tiến trình A ghi byte vào pipe, tiến trình B đọc ra đúng theo thứ tự đó; pipe rỗng thì B chờ, đầy thì A chờ. Vì pipe trông như một tệp, chương trình đọc từ tệp có thể đọc từ pipe mà không phải sửa gì — lý do các lệnh shell UNIX ghép với nhau tốt đến vậy.</p>
<p>➕ Hình 1-16 bằng C: tiến trình cha (A) ghi vào pipe, tiến trình con (B) đọc ra:</p>
<pre><code class="language-c">// Hình 1-16 bằng C: tiến trình A ghi vào pipe, tiến trình B đọc ra
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    int fd[2];
    pipe(fd);                              // fd[0] = đầu đọc, fd[1] = đầu ghi
    if (fork() == 0) {                     // tiến trình B (con)
        close(fd[1]);
        char buf[64] = {0};
        ssize_t n = read(fd[0], buf, sizeof buf - 1);   // chờ tới khi A ghi
        printf("B read %zd bytes: %s\\n", n, buf);
        return 0;
    }
    close(fd[0]);                          // tiến trình A (cha)
    const char *msg = "hello through the pipe";
    write(fd[1], msg, strlen(msg));
    close(fd[1]);
    wait(NULL);
    printf("A: done\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread pipe.c -o pipe &amp;&amp; ./pipe<br>
B read 22 bytes: hello through the pipe<br>
A: done</div>
<p><code>pipe()</code> trả về hai bộ mô tả tệp (đầu đọc, đầu ghi); <code>fork()</code> trao cả hai cho con; mỗi tiến trình đóng đầu mình không dùng. Trong shell, ký tự <code>|</code> làm đúng việc này hộ bạn: <code>ps aux | grep java | wc -l</code> khởi chạy ba tiến trình nối bằng hai pipe.</p>
<p class="pitfall">⚠️ Pipe chỉ chảy một chiều và chỉ tồn tại khi các tiến trình còn dùng; dữ liệu đi qua bộ nhớ của nhân, không bao giờ qua đĩa.</p>`],
      [26, 'Ontogeny Recapitulates Phylogeny',
        `<p class="y-chinh">🎯 "Ontogeny recapitulates phylogeny" — each new "species" of computer goes through the same development as its ancestors; because technology changes, "obsolete" ideas in the textbook often come back.</p>
<p>The phrase comes from 19th-century biology ("the development of an embryo repeats the evolution of its species"). Tanenbaum's point: mainframes went from no protection to protection, from one program to multiprogramming, from no virtual memory to virtual memory; then minicomputers repeated the same steps, then PCs, then phones. So do not skip an idea because it sounds old — the conditions that made it useful may return.</p>
<p>➕ Examples you will meet: <strong>large memory</strong> — tiny embedded chips again live with kilobytes, like 1960s machines; <strong>protection hardware</strong> — microcontrollers are gaining memory-protection units; <strong>disks</strong> — SSDs made seek-time tricks obsolete, but the same scheduling ideas returned for flash; <strong>virtual memory and virtual machines</strong> — invented for 1970s mainframes (VM/370, slide 43), reborn as the cloud; even the batch system of slide 8 lives on as CI pipelines and cloud batch jobs.</p>
<p class="meo">🧠 When an exam asks "why study obsolete concepts?" — because changes in technology may bring them back (the slide's own answer).</p>`,
        `<p class="y-chinh">🎯 "Ontogeny recapitulates phylogeny" (sự phát triển cá thể lặp lại sự tiến hoá của loài) — mỗi "loài" máy tính mới lại đi qua đúng con đường phát triển của tổ tiên; vì công nghệ thay đổi, những ý tưởng "lỗi thời" trong sách thường quay trở lại.</p>
<p>Câu này lấy từ sinh học thế kỷ 19 ("phôi phát triển lặp lại quá trình tiến hoá của loài"). Ý của Tanenbaum: máy lớn đi từ không có bảo vệ tới có bảo vệ, từ một chương trình tới đa chương trình, từ không có bộ nhớ ảo tới có bộ nhớ ảo; rồi máy tính mini lặp lại đúng các bước đó, rồi PC, rồi điện thoại. Vậy đừng bỏ qua một ý tưởng chỉ vì nghe cũ — điều kiện từng làm nó hữu ích có thể quay lại.</p>
<p>➕ Ví dụ bạn sẽ gặp: <strong>bộ nhớ lớn</strong> — chip nhúng tí hon lại sống với vài kilobyte như máy thập niên 1960; <strong>phần cứng bảo vệ</strong> — vi điều khiển đang được gắn thêm khối bảo vệ bộ nhớ; <strong>đĩa</strong> — SSD làm các mẹo về seek time lỗi thời, nhưng ý tưởng lập lịch lại quay về với flash; <strong>bộ nhớ ảo và máy ảo</strong> — phát minh cho máy lớn thập niên 1970 (VM/370, slide 43), tái sinh thành điện toán đám mây; ngay cả hệ lô của slide 8 vẫn sống dưới dạng pipeline CI và job lô trên cloud.</p>
<p class="meo">🧠 Đề hỏi "vì sao phải học những khái niệm lỗi thời?" — vì thay đổi công nghệ có thể đưa chúng quay lại (chính câu trả lời của slide).</p>`],
    ]),
    books([
      ['mos4', 'Chapter 1, sections 1.1–1.5 (pp. 1–50), Figures 1-1 to 1-16; multiprogramming model: section 2.1.7, Figure 2-6', 'Chương 1, mục 1.1–1.5 (tr. 1–50), Hình 1-1 tới 1-16; mô hình đa chương trình: mục 2.1.7, Hình 2-6'],
      ['mchoes', 'Chapter 1 (introducing operating systems) — a gentler second explanation of the same ideas', 'Chương 1 (giới thiệu hệ điều hành) — cách giảng thứ hai, nhẹ nhàng hơn, cho cùng các ý'],
      ['ostep', 'Chapter 2 "Introduction to Operating Systems" and Chapter 4 "The Abstraction: The Process"', 'Chương 2 "Introduction to Operating Systems" và Chương 4 "The Abstraction: The Process"'],
      ['man7', 'proc(5) for /proc, pstree(1), mount(8), pipe(2), signal(7)', 'proc(5) cho /proc, pstree(1), mount(8), pipe(2), signal(7)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.B — 📑 Slide by slide · Introduction: system calls, POSIX vs Win32, OS structures, building C programs (slides 27–47) ───────── */
const L_osg1_2 = {
  title: '1.B — 📑 Slide by slide · Introduction: system calls, POSIX vs Win32, OS structures, building C programs (slides 27–47)|||1.B — 📑 Học theo từng slide · Introduction: lời gọi hệ thống, POSIX và Win32, cấu trúc HĐH, dựng chương trình C (slide 27–47)',
  slug: 'osg202-slide-osg1-2',
  type: 'VIDEO',
  description: 'Giảng đủ 21 slide cuối Chương 1: 11 bước của lời gọi read() (gọi read ba cách — hàm thư viện, syscall() và lệnh bẫy svc trần — kèm strace), bảng lời gọi POSIX về tiến trình, tệp, thư mục và linh tinh mỗi nhóm một chương trình C chạy thật (fork/execve/waitpid thấy bằng strace là clone, open/lseek/stat, link/unlink, chmod/kill, time() không vào nhân nhờ vDSO), shell rút gọn của Hình 1-19 chạy được, ba đoạn của tiến trình, liên kết và mount bằng lệnh thật, bảng Win32 kèm phần đã lỗi thời, năm cấu trúc hệ điều hành (nguyên khối, phân tầng, vi nhân, client-server, máy ảo và hypervisor), quy trình dịch C với make, và đơn vị đo thập phân lẫn nhị phân.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.B · deck "Chapter 1 · Introduction", slides 27–47</span>
<h2>How programs reach the OS, and how an OS is built</h2>
<p class="lead">The second half follows sections 1.6–1.11 of the book. A <strong>system call</strong> is the only door from a program into the kernel (slide 27); slides 28–35 walk through the most important POSIX calls — here every one of them is called from a real C program on Linux; slides 36–37 compare them with Windows; slides 38–44 show five ways to structure an OS; slide 45 shows how a large C program is built, and slide 46 the units the book uses.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>27–35</td><td>1.6 System calls</td><td>explain the 11 steps of a system call and use fork, exec, wait, open, read, write, lseek, stat, link, mount, kill</td></tr>
<tr><td>36–37</td><td>1.6.6 The Windows Win32 API</td><td>map UNIX calls to Win32 and say what is outdated in the table</td></tr>
<tr><td>38–44</td><td>1.7 Operating system structure</td><td>compare monolithic, layered, microkernel, client-server, virtual machines, hypervisors</td></tr>
<tr><td>45</td><td>1.8 The world according to C</td><td>follow header files, preprocessor, compiler, linker and make</td></tr>
<tr><td>46–47</td><td>1.11 Metric units · end</td><td>convert between ms/µs/ns and between KB and KiB</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.B · deck "Chapter 1 · Introduction", slide 27–47</span>
<h2>Chương trình chạm tới HĐH bằng cách nào, và HĐH được xây ra sao</h2>
<p class="lead">Nửa sau đi theo mục 1.6–1.11 của sách. <strong>Lời gọi hệ thống (system call)</strong> là cánh cửa duy nhất từ chương trình vào nhân (slide 27); slide 28–35 đi qua những lời gọi POSIX quan trọng nhất — ở đây mỗi lời gọi đều được gọi từ một chương trình C thật trên Linux; slide 36–37 so với Windows; slide 38–44 cho năm cách tổ chức một HĐH; slide 45 cho thấy một chương trình C lớn được dựng thế nào, và slide 46 là các đơn vị sách dùng.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>27–35</td><td>1.6 Lời gọi hệ thống</td><td>giải thích 11 bước của một lời gọi hệ thống và dùng fork, exec, wait, open, read, write, lseek, stat, link, mount, kill</td></tr>
<tr><td>36–37</td><td>1.6.6 Win32 API của Windows</td><td>đối chiếu lời gọi UNIX với Win32 và chỉ ra chỗ đã lỗi thời trong bảng</td></tr>
<tr><td>38–44</td><td>1.7 Cấu trúc hệ điều hành</td><td>so sánh nguyên khối, phân tầng, vi nhân, client-server, máy ảo, hypervisor</td></tr>
<tr><td>45</td><td>1.8 Thế giới theo C</td><td>lần theo tệp header, tiền xử lý, biên dịch, liên kết và make</td></tr>
<tr><td>46–47</td><td>1.11 Đơn vị đo · kết</td><td>đổi giữa ms/µs/ns và giữa KB với KiB</td></tr>
</tbody>
</table>`),
    walkHead('osg1', 27, 47),
    walk('osg1', [
      [27, 'System Calls (1)',
        `<p class="y-chinh">🎯 Figure 1-17: the 11 steps of the system call <code>read(fd, buffer, nbytes)</code> — the program prepares the parameters (1–3), calls the library procedure <code>read</code> (4), which puts the system-call number where the kernel expects it (5) and executes a <strong>TRAP</strong> instruction (6); the kernel's dispatcher finds the handler (7) which runs (8); control returns to the library (9) and to the program (10), which cleans up the stack (11).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/d0e6d21928c264be4255871590e2fdff7986e2f1.svg" alt="Figure 1-17 as a sequence diagram — the only step that crosses into kernel mode is the trap (6)" loading="lazy" /><p class="chu-thich">🧩 Figure 1-17 as a sequence diagram — the only step that crosses into kernel mode is the trap (6)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 1-17 as a sequence: the 11 steps of read(fd, buffer, nbytes)
participant "User program" as U
participant "Library procedure\\nread() in libc" as L
participant "Kernel:\\ndispatcher" as K
participant "Kernel:\\nsys_read handler" as H
U -&gt; U : 1–3. push nbytes, &amp;buffer, fd\\n(today: put them in registers)
U -&gt; L : 4. call read
L -&gt; L : 5. put the system-call NUMBER\\nfor read in a register
L -&gt; K : 6. TRAP into the kernel\\n(x86-64: syscall · ARM64: svc #0)\\nuser mode → kernel mode
K -&gt; H : 7. look up the number in the\\nsystem-call table · 8. run the handler
H --&gt; L : 9. return to the library\\n(kernel mode → user mode)
L --&gt; U : 10. return to the caller
U -&gt; U : 11. clean up the stack\\n(increment SP)
@enduml</code></pre></details>
<p>In the book (1980s-style x86), parameters 1–3 are pushed on the stack. On current 64-bit CPUs they travel in <strong>registers</strong>: on x86-64 the number goes in RAX and the trap is <code>syscall</code> (older web lesson 1.4 shows that); on ARM64 — the course machine — the number goes in <code>x8</code>, arguments in <code>x0</code>–<code>x2</code>, and the trap is <code>svc #0</code>. ➕ The same <code>read</code> done three ways — through the library, through the generic <code>syscall()</code>, and with the bare trap instruction — then watched with <code>strace</code>:</p>
<pre><code class="language-c">// The same system call three ways: libc wrapper, syscall(), and the raw trap instruction
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

int main(void) {
    char buf[8];
    long n1 = read(0, buf, 4);                       // 1) the C library wrapper
    long n2 = syscall(SYS_read, 0, buf + 4, 2);      // 2) generic syscall() with the number
    long n3;
#if defined(__aarch64__)
    register long x8 __asm__("x8") = SYS_read;       // ARM64: number in x8, arguments in x0..x2, trap = svc #0
    register long x0 __asm__("x0") = 0;
    register long x1 __asm__("x1") = (long)(buf + 6);
    register long x2 __asm__("x2") = 2;
    __asm__ volatile("svc #0" : "+r"(x0) : "r"(x8), "r"(x1), "r"(x2) : "memory");
    n3 = x0;                                         // the result comes back in x0
#else
    __asm__ volatile("syscall" : "=a"(n3) : "a"(SYS_read), "D"(0), "S"(buf + 6), "d"(2) : "rcx", "r11", "memory");
#endif
    printf("read() -&gt; %ld, syscall() -&gt; %ld, trap -&gt; %ld; on this CPU SYS_read = %d, SYS_write = %d\\n", n1, n2, n3, SYS_read, SYS_write);
    printf("bytes read: %.8s\\n", buf);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread goi-truc-tiep.c -o goi-truc-tiep &amp;&amp; strace -e trace=read,write ./goi-truc-tiep &lt; goi-truc-tiep.in 2&gt;&amp;1 &gt;/dev/null | grep -E '^(read\\(0|write\\(1)'; ./goi-truc-tiep &lt; goi-truc-tiep.in<br>
read(0, "ABCD", 4) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 4<br>
read(0, "EF", 2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 2<br>
read(0, "GH", 2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 2<br>
write(1, "read() -&gt; 4, syscall() -&gt; 2, tra"..., 103) = 103<br>
read() -&gt; 4, syscall() -&gt; 2, trap -&gt; 2; on this CPU SYS_read = 63, SYS_write = 64<br>
bytes read: ABCDEFGH</div>
<p>Three different C paths, one kernel call: <code>strace</code> sees three identical <code>read(0, …)</code>. And the numbers are not universal — <code>read</code> is 63 on ARM64 but 0 on x86-64; that is why programs call the library, not the number.</p>
<p class="pitfall">⚠️ The trap is the step that switches from user mode to kernel mode; the library procedure itself runs in user mode. "A system call is a function in the kernel called directly by the program" — false: it goes through a trap.</p>`,
        `<p class="y-chinh">🎯 Hình 1-17: 11 bước của lời gọi hệ thống <code>read(fd, buffer, nbytes)</code> — chương trình chuẩn bị tham số (1–3), gọi thủ tục thư viện <code>read</code> (4), thủ tục này đặt số hiệu lời gọi hệ thống vào chỗ nhân chờ (5) rồi thi hành lệnh <strong>BẪY (TRAP)</strong> (6); bộ điều phối của nhân tìm trình xử lý (7) và chạy nó (8); quyền điều khiển trở về thư viện (9) rồi về chương trình (10), chương trình dọn ngăn xếp (11).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/d0e6d21928c264be4255871590e2fdff7986e2f1.svg" alt="Hình 1-17 dạng sơ đồ tuần tự — bước duy nhất vượt sang chế độ nhân là lệnh bẫy (6)" loading="lazy" /><p class="chu-thich">🧩 Hình 1-17 dạng sơ đồ tuần tự — bước duy nhất vượt sang chế độ nhân là lệnh bẫy (6)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 1-17 dạng tuần tự: 11 bước của read(fd, buffer, nbytes)
participant "User program" as U
participant "Library procedure\\nread() in libc" as L
participant "Kernel:\\ndispatcher" as K
participant "Kernel:\\nsys_read handler" as H
U -&gt; U : 1–3. push nbytes, &amp;buffer, fd\\n(today: put them in registers)
U -&gt; L : 4. call read
L -&gt; L : 5. put the system-call NUMBER\\nfor read in a register
L -&gt; K : 6. TRAP into the kernel\\n(x86-64: syscall · ARM64: svc #0)\\nuser mode → kernel mode
K -&gt; H : 7. look up the number in the\\nsystem-call table · 8. run the handler
H --&gt; L : 9. return to the library\\n(kernel mode → user mode)
L --&gt; U : 10. return to the caller
U -&gt; U : 11. clean up the stack\\n(increment SP)
@enduml</code></pre></details>
<p>Trong sách (x86 kiểu thập niên 1980), tham số 1–3 được đẩy lên ngăn xếp. Trên CPU 64-bit hiện nay chúng đi bằng <strong>thanh ghi</strong>: trên x86-64 số hiệu nằm ở RAX và lệnh bẫy là <code>syscall</code> (bài web cũ 1.4 có trình bày); trên ARM64 — máy của môn — số hiệu nằm ở <code>x8</code>, đối số ở <code>x0</code>–<code>x2</code>, và lệnh bẫy là <code>svc #0</code>. ➕ Cùng một lần <code>read</code> làm theo ba cách — qua thư viện, qua <code>syscall()</code> tổng quát, và bằng lệnh bẫy trần — rồi soi bằng <code>strace</code>:</p>
<pre><code class="language-c">// Cùng một lời gọi hệ thống theo ba cách: hàm bọc của libc, syscall(), và lệnh bẫy trần
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

int main(void) {
    char buf[8];
    long n1 = read(0, buf, 4);                       // 1) hàm bọc của thư viện C
    long n2 = syscall(SYS_read, 0, buf + 4, 2);      // 2) syscall() tổng quát, truyền số hiệu
    long n3;
#if defined(__aarch64__)
    register long x8 __asm__("x8") = SYS_read;       // ARM64: số hiệu ở x8, đối số ở x0..x2, lệnh bẫy = svc #0
    register long x0 __asm__("x0") = 0;
    register long x1 __asm__("x1") = (long)(buf + 6);
    register long x2 __asm__("x2") = 2;
    __asm__ volatile("svc #0" : "+r"(x0) : "r"(x8), "r"(x1), "r"(x2) : "memory");
    n3 = x0;                                         // kết quả trả về trong x0
#else
    __asm__ volatile("syscall" : "=a"(n3) : "a"(SYS_read), "D"(0), "S"(buf + 6), "d"(2) : "rcx", "r11", "memory");
#endif
    printf("read() -&gt; %ld, syscall() -&gt; %ld, trap -&gt; %ld; on this CPU SYS_read = %d, SYS_write = %d\\n", n1, n2, n3, SYS_read, SYS_write);
    printf("bytes read: %.8s\\n", buf);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread goi-truc-tiep.c -o goi-truc-tiep &amp;&amp; strace -e trace=read,write ./goi-truc-tiep &lt; goi-truc-tiep.in 2&gt;&amp;1 &gt;/dev/null | grep -E '^(read\\(0|write\\(1)'; ./goi-truc-tiep &lt; goi-truc-tiep.in<br>
read(0, "ABCD", 4) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 4<br>
read(0, "EF", 2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 2<br>
read(0, "GH", 2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 2<br>
write(1, "read() -&gt; 4, syscall() -&gt; 2, tra"..., 103) = 103<br>
read() -&gt; 4, syscall() -&gt; 2, trap -&gt; 2; on this CPU SYS_read = 63, SYS_write = 64<br>
bytes read: ABCDEFGH</div>
<p>Ba đường đi khác nhau trong C, một lời gọi nhân: <code>strace</code> thấy ba lần <code>read(0, …)</code> y hệt nhau. Và số hiệu không phải chung cho mọi máy — <code>read</code> là 63 trên ARM64 nhưng là 0 trên x86-64; vì thế chương trình gọi thư viện chứ không gọi bằng số.</p>
<p class="pitfall">⚠️ Lệnh bẫy là bước chuyển từ chế độ người dùng sang chế độ nhân; bản thân thủ tục thư viện chạy ở chế độ người dùng. "Lời gọi hệ thống là một hàm trong nhân được chương trình gọi trực tiếp" — sai: nó phải đi qua một lệnh bẫy.</p>`],
      [28, 'System Calls (2)',
        `<p class="y-chinh">🎯 Figure 1-18, process management: <code>pid = fork()</code> creates a child identical to the parent; <code>pid = waitpid(pid, &amp;statloc, options)</code> waits for a child to terminate; <code>s = execve(name, argv, environp)</code> replaces a process's core image; <code>exit(status)</code> terminates and returns a status.</p>
<p>The caption's conventions apply to all four tables: <code>s</code> is −1 on error; <code>pid</code> is a process ID, <code>fd</code> a file descriptor, <code>n</code> a byte count, <code>position</code> an offset in a file, <code>seconds</code> elapsed time. <strong>fork</strong> is the only way to create a new process in UNIX; the copy then usually calls <strong>execve</strong> to become another program — "core image" is the old word for the memory contents.</p>
<p>➕ All four calls in one program, run under <code>strace</code> to see what Linux really receives:</p>
<pre><code class="language-c">// Figure 1-18 "process management": fork, execve, waitpid, exit — and what Linux really calls
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    pid_t pid = fork();                                 // pid = fork()
    if (pid == 0) {
        char *argv[] = {"echo", "hello from execve", NULL};
        char *envp[] = {NULL};
        execve("/bin/echo", argv, envp);                // replace the child's core image
        perror("execve");                               // only reached if execve failed
        exit(127);
    }
    int status;
    waitpid(pid, &amp;status, 0);                           // wait for the child
    exit(WEXITSTATUS(status));                          // exit(status)
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fork-exec-wait.c -o fork-exec-wait &amp;&amp; strace -f -qq -e signal=none -e trace=clone,execve,wait4,exit_group -o /tmp/vet ./fork-exec-wait; sed -E 's/^[0-9]+ +//; s/0x[0-9a-f]+/0x…/g' /tmp/vet<br>
hello from execve<br>
execve("./fork-exec-wait", ["./fork-exec-wait"], 0x… /* 12 vars */) = 0<br>
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x…) = 16<br>
wait4(16, &nbsp;&lt;unfinished ...&gt;<br>
execve("/bin/echo", ["echo", "hello from execve"], 0x… /* 0 vars */) = 0<br>
exit_group(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?<br>
&lt;... wait4 resumed&gt;[{WIFEXITED(s) &amp;&amp; WEXITSTATUS(s) == 0}], 0, NULL) = 16<br>
exit_group(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Two surprises. The C library's <code>fork()</code> is implemented with Linux's more general <code>clone</code> call (the flag <code>SIGCHLD</code> means "tell the parent when I exit"); and <code>waitpid</code> becomes <code>wait4</code>. The child's <code>execve("/bin/echo"…)</code> replaced it with <code>echo</code>, whose output appears first. Lines from parent and child interleave because both run at once.</p>
<p class="pitfall">⚠️ After a successful <code>execve</code> nothing below it in the program runs — the old code is gone. Code after <code>execve</code> (like our <code>perror</code>) runs only if the call failed.</p>`,
        `<p class="y-chinh">🎯 Hình 1-18, quản lý tiến trình: <code>pid = fork()</code> tạo một con giống hệt cha; <code>pid = waitpid(pid, &amp;statloc, options)</code> đợi một con kết thúc; <code>s = execve(name, argv, environp)</code> thay ảnh bộ nhớ (core image) của tiến trình; <code>exit(status)</code> kết thúc và trả về một mã trạng thái.</p>
<p>Quy ước trong chú thích dùng chung cho cả bốn bảng: <code>s</code> bằng −1 khi lỗi; <code>pid</code> là số hiệu tiến trình, <code>fd</code> là bộ mô tả tệp (file descriptor), <code>n</code> là số byte, <code>position</code> là vị trí trong tệp, <code>seconds</code> là thời gian đã trôi qua. <strong>fork</strong> là cách duy nhất tạo tiến trình mới trong UNIX; bản sao thường gọi tiếp <strong>execve</strong> để trở thành một chương trình khác — "core image" là từ cũ chỉ nội dung bộ nhớ.</p>
<p>➕ Cả bốn lời gọi trong một chương trình, chạy dưới <code>strace</code> để thấy Linux thật sự nhận được gì:</p>
<pre><code class="language-c">// Hình 1-18 "quản lý tiến trình": fork, execve, waitpid, exit — và Linux thật sự gọi gì
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    pid_t pid = fork();                                 // pid = fork()
    if (pid == 0) {
        char *argv[] = {"echo", "hello from execve", NULL};
        char *envp[] = {NULL};
        execve("/bin/echo", argv, envp);                // thay toàn bộ ảnh bộ nhớ của con
        perror("execve");                               // chỉ tới đây nếu execve lỗi
        exit(127);
    }
    int status;
    waitpid(pid, &amp;status, 0);                           // đợi con
    exit(WEXITSTATUS(status));                          // exit(status)
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread fork-exec-wait.c -o fork-exec-wait &amp;&amp; strace -f -qq -e signal=none -e trace=clone,execve,wait4,exit_group -o /tmp/vet ./fork-exec-wait; sed -E 's/^[0-9]+ +//; s/0x[0-9a-f]+/0x…/g' /tmp/vet<br>
hello from execve<br>
execve("./fork-exec-wait", ["./fork-exec-wait"], 0x… /* 12 vars */) = 0<br>
clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x…) = 16<br>
wait4(16, &nbsp;&lt;unfinished ...&gt;<br>
execve("/bin/echo", ["echo", "hello from execve"], 0x… /* 0 vars */) = 0<br>
exit_group(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?<br>
&lt;... wait4 resumed&gt;[{WIFEXITED(s) &amp;&amp; WEXITSTATUS(s) == 0}], 0, NULL) = 16<br>
exit_group(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ?</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Hai điều bất ngờ. Hàm <code>fork()</code> của thư viện C được cài bằng lời gọi tổng quát hơn của Linux là <code>clone</code> (cờ <code>SIGCHLD</code> nghĩa là "báo cho cha khi tôi kết thúc"); còn <code>waitpid</code> trở thành <code>wait4</code>. Lời gọi <code>execve("/bin/echo"…)</code> của tiến trình con đã thay nó bằng <code>echo</code>, nên output của echo hiện trước. Các dòng của cha và con xen nhau vì cả hai cùng chạy.</p>
<p class="pitfall">⚠️ Sau một lần <code>execve</code> thành công, không dòng nào phía dưới nó trong chương trình được chạy nữa — mã cũ đã biến mất. Mã sau <code>execve</code> (như <code>perror</code> của ta) chỉ chạy khi lời gọi bị lỗi.</p>`],
      [29, 'System Calls (3)',
        `<p class="y-chinh">🎯 Figure 1-18, file management: <code>fd = open(file, how, …)</code>, <code>s = close(fd)</code>, <code>n = read(fd, buffer, nbytes)</code>, <code>n = write(fd, buffer, nbytes)</code>, <code>position = lseek(fd, offset, whence)</code> moves the file pointer, <code>s = stat(name, &amp;buf)</code> gets a file's status information.</p>
<p>A process must <strong>open</strong> a file before using it; the kernel returns a small integer, the <strong>file descriptor</strong>, that the process then passes to every other call. Each open file has a <strong>file pointer</strong> (current position): <code>read</code> and <code>write</code> start there and advance it; <code>lseek</code> moves it, which is how random access works (FE5: "random access files — read and seek"). <code>stat</code> returns size, owner, permissions, times and link count.</p>
<p>➕ The six calls in order, with their real return values:</p>
<pre><code class="language-c">// Figure 1-18 "file management": open, write, lseek, read, stat, close
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

int main(void) {
    int fd = open("/tmp/thu.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);   // fd = open(file, how, ...)
    printf("open  -&gt; fd = %d\\n", fd);
    ssize_t n = write(fd, "0123456789", 10);        // n = write(fd, buffer, nbytes)
    printf("write -&gt; n = %zd\\n", n);
    off_t pos = lseek(fd, 3, SEEK_SET);             // position = lseek(fd, offset, whence)
    printf("lseek -&gt; position = %lld\\n", (long long)pos);
    char buf[5] = {0};
    n = read(fd, buf, 4);                           // reads from the CURRENT position
    printf("read  -&gt; n = %zd, data = \\"%s\\"\\n", n, buf);
    struct stat st;
    int s = stat("/tmp/thu.txt", &amp;st);              // s = stat(name, &amp;buf)
    printf("stat  -&gt; s = %d, size = %lld bytes, links = %ld\\n", s, (long long)st.st_size, (long)st.st_nlink);
    s = close(fd);
    printf("close -&gt; s = %d\\n", s);
    s = close(fd);                                  // closing twice is an error: s = -1
    printf("close again -&gt; s = %d\\n", s);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tep.c -o tep &amp;&amp; ./tep<br>
open &nbsp;-&gt; fd = 3<br>
write -&gt; n = 10<br>
lseek -&gt; position = 3<br>
read &nbsp;-&gt; n = 4, data = "3456"<br>
stat &nbsp;-&gt; s = 0, size = 10 bytes, links = 1<br>
close -&gt; s = 0<br>
close again -&gt; s = -1</div>
<p>The first descriptor is 3 because 0, 1, 2 are already standard input, output and error (slide 21). After writing "0123456789" the pointer is at 10; <code>lseek(fd, 3, SEEK_SET)</code> moves it to byte 3, so the next <code>read</code> returns "3456". Closing an already closed descriptor returns −1 — the error convention of the caption.</p>
<p class="pitfall">⚠️ FE4/FE8: "In UNIX, which call moves the file pointer?" → <strong>lseek</strong>. FE3: "Which system call repositions the file pointer…?" → seek.</p>`,
        `<p class="y-chinh">🎯 Hình 1-18, quản lý tệp: <code>fd = open(file, how, …)</code>, <code>s = close(fd)</code>, <code>n = read(fd, buffer, nbytes)</code>, <code>n = write(fd, buffer, nbytes)</code>, <code>position = lseek(fd, offset, whence)</code> dời con trỏ tệp, <code>s = stat(name, &amp;buf)</code> lấy thông tin trạng thái của tệp.</p>
<p>Tiến trình phải <strong>mở (open)</strong> tệp trước khi dùng; nhân trả về một số nguyên nhỏ là <strong>bộ mô tả tệp (file descriptor)</strong>, tiến trình đưa số này vào mọi lời gọi sau đó. Mỗi tệp đang mở có một <strong>con trỏ tệp (file pointer)</strong> — vị trí hiện tại: <code>read</code> và <code>write</code> bắt đầu từ đó và đẩy nó tiến lên; <code>lseek</code> dời nó đi, đó là cách truy cập ngẫu nhiên hoạt động (FE5: "tệp truy cập ngẫu nhiên — read và seek"). <code>stat</code> trả về kích thước, chủ sở hữu, quyền, các mốc thời gian và số liên kết.</p>
<p>➕ Sáu lời gọi theo thứ tự, kèm giá trị trả về thật:</p>
<pre><code class="language-c">// Hình 1-18 "quản lý tệp": open, write, lseek, read, stat, close
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

int main(void) {
    int fd = open("/tmp/thu.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);   // fd = open(tệp, cách mở, ...)
    printf("open  -&gt; fd = %d\\n", fd);
    ssize_t n = write(fd, "0123456789", 10);        // ghi 10 byte
    printf("write -&gt; n = %zd\\n", n);
    off_t pos = lseek(fd, 3, SEEK_SET);             // dời con trỏ tệp tới byte 3
    printf("lseek -&gt; position = %lld\\n", (long long)pos);
    char buf[5] = {0};
    n = read(fd, buf, 4);                           // đọc từ vị trí HIỆN TẠI
    printf("read  -&gt; n = %zd, data = \\"%s\\"\\n", n, buf);
    struct stat st;
    int s = stat("/tmp/thu.txt", &amp;st);              // lấy thông tin tệp
    printf("stat  -&gt; s = %d, size = %lld bytes, links = %ld\\n", s, (long long)st.st_size, (long)st.st_nlink);
    s = close(fd);
    printf("close -&gt; s = %d\\n", s);
    s = close(fd);                                  // đóng lần hai là lỗi: s = -1
    printf("close again -&gt; s = %d\\n", s);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread tep.c -o tep &amp;&amp; ./tep<br>
open &nbsp;-&gt; fd = 3<br>
write -&gt; n = 10<br>
lseek -&gt; position = 3<br>
read &nbsp;-&gt; n = 4, data = "3456"<br>
stat &nbsp;-&gt; s = 0, size = 10 bytes, links = 1<br>
close -&gt; s = 0<br>
close again -&gt; s = -1</div>
<p>Bộ mô tả đầu tiên là 3 vì 0, 1, 2 đã là đầu vào, đầu ra và luồng lỗi chuẩn (slide 21). Sau khi ghi "0123456789", con trỏ đứng ở 10; <code>lseek(fd, 3, SEEK_SET)</code> dời nó về byte 3, nên lần <code>read</code> sau trả "3456". Đóng một bộ mô tả đã đóng rồi trả về −1 — đúng quy ước lỗi trong chú thích.</p>
<p class="pitfall">⚠️ FE4/FE8: "Trong UNIX, lời gọi nào dời con trỏ tệp?" → <strong>lseek</strong>. FE3: "Lời gọi hệ thống nào đặt lại vị trí con trỏ tệp…?" → seek.</p>`],
      [30, 'System Calls (4)',
        `<p class="y-chinh">🎯 Figure 1-18, directory and file-system management: <code>mkdir(name, mode)</code> creates a directory, <code>rmdir(name)</code> removes an <strong>empty</strong> one, <code>link(name1, name2)</code> creates a new entry name2 pointing to name1, <code>unlink(name)</code> removes a directory entry, <code>mount(special, name, flag)</code> and <code>umount(special)</code> attach and detach a file system.</p>
<p>The key word is <strong>entry</strong>: a directory is a list of (name → file) entries. <code>link</code> adds a second name for the <em>same</em> file, so the file now has two links; <code>unlink</code> removes a name, and the file itself is deleted only when the last link is gone (and no process has it open). That is why UNIX has no "delete file" call — only unlink.</p>
<p>➕ Watch the link count change, and <code>rmdir</code> refuse a directory that is not empty:</p>
<pre><code class="language-c">// Figure 1-18 "directory management": mkdir, link, unlink, rmdir — watch the link count
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

static long links(const char *p) { struct stat st; return stat(p, &amp;st) == 0 ? (long)st.st_nlink : -1; }

int main(void) {
    printf("mkdir  -&gt; %d\\n", mkdir("/tmp/ast", 0755));
    printf("mkdir  -&gt; %d\\n", mkdir("/tmp/jim", 0755));
    close(open("/tmp/jim/memo", O_CREAT | O_WRONLY, 0644));
    printf("memo has %ld link(s)\\n", links("/tmp/jim/memo"));
    printf("link   -&gt; %d   (new name /tmp/ast/note for the same file)\\n", link("/tmp/jim/memo", "/tmp/ast/note"));
    printf("memo has %ld link(s)\\n", links("/tmp/jim/memo"));
    printf("unlink -&gt; %d   (remove the name /tmp/jim/memo)\\n", unlink("/tmp/jim/memo"));
    printf("note still has %ld link(s): the file is alive\\n", links("/tmp/ast/note"));
    int r = rmdir("/tmp/ast");
    printf("rmdir  -&gt; %d   (%s)\\n", r, r ? strerror(errno) : "ok");
    unlink("/tmp/ast/note");
    printf("rmdir  -&gt; %d   (now empty)\\n", rmdir("/tmp/ast"));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thu-muc.c -o thu-muc &amp;&amp; ./thu-muc<br>
mkdir &nbsp;-&gt; 0<br>
mkdir &nbsp;-&gt; 0<br>
memo has 1 link(s)<br>
link &nbsp;&nbsp;-&gt; 0 &nbsp;&nbsp;(new name /tmp/ast/note for the same file)<br>
memo has 2 link(s)<br>
unlink -&gt; 0 &nbsp;&nbsp;(remove the name /tmp/jim/memo)<br>
note still has 1 link(s): the file is alive<br>
rmdir &nbsp;-&gt; -1 &nbsp;&nbsp;(Directory not empty)<br>
rmdir &nbsp;-&gt; 0 &nbsp;&nbsp;(now empty)</div>
<p>After <code>link</code>, memo has 2 links; after unlinking the name <code>memo</code>, the data is still reachable as <code>note</code> (1 link). The first <code>rmdir</code> fails with "Directory not empty" (ENOTEMPTY); after removing the last entry it succeeds.</p>
<p class="meo">🧠 <code>rm</code> in the shell = <code>unlink</code>; <code>ln</code> = <code>link</code>; <code>ln -s</code> = <code>symlink</code> (a symbolic link — a small file containing a path, Chapter 4).</p>`,
        `<p class="y-chinh">🎯 Hình 1-18, quản lý thư mục và hệ thống tệp: <code>mkdir(name, mode)</code> tạo thư mục, <code>rmdir(name)</code> xoá thư mục <strong>rỗng</strong>, <code>link(name1, name2)</code> tạo mục mới name2 trỏ tới name1, <code>unlink(name)</code> xoá một mục thư mục, <code>mount(special, name, flag)</code> và <code>umount(special)</code> gắn và tháo một hệ thống tệp.</p>
<p>Chữ quan trọng là <strong>mục (entry)</strong>: thư mục là danh sách các mục (tên → tệp). <code>link</code> thêm tên thứ hai cho <em>cùng một</em> tệp, nên tệp giờ có hai liên kết; <code>unlink</code> xoá một cái tên, và bản thân tệp chỉ bị xoá khi liên kết cuối cùng mất đi (và không tiến trình nào còn mở nó). Vì vậy UNIX không có lời gọi "xoá tệp" — chỉ có unlink.</p>
<p>➕ Xem số liên kết thay đổi, và <code>rmdir</code> từ chối một thư mục chưa rỗng:</p>
<pre><code class="language-c">// Hình 1-18 "quản lý thư mục": mkdir, link, unlink, rmdir — theo dõi số liên kết
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

static long links(const char *p) { struct stat st; return stat(p, &amp;st) == 0 ? (long)st.st_nlink : -1; }

int main(void) {
    printf("mkdir  -&gt; %d\\n", mkdir("/tmp/ast", 0755));
    printf("mkdir  -&gt; %d\\n", mkdir("/tmp/jim", 0755));
    close(open("/tmp/jim/memo", O_CREAT | O_WRONLY, 0644));
    printf("memo has %ld link(s)\\n", links("/tmp/jim/memo"));
    printf("link   -&gt; %d   (new name /tmp/ast/note for the same file)\\n", link("/tmp/jim/memo", "/tmp/ast/note"));
    printf("memo has %ld link(s)\\n", links("/tmp/jim/memo"));
    printf("unlink -&gt; %d   (remove the name /tmp/jim/memo)\\n", unlink("/tmp/jim/memo"));
    printf("note still has %ld link(s): the file is alive\\n", links("/tmp/ast/note"));
    int r = rmdir("/tmp/ast");
    printf("rmdir  -&gt; %d   (%s)\\n", r, r ? strerror(errno) : "ok");
    unlink("/tmp/ast/note");
    printf("rmdir  -&gt; %d   (now empty)\\n", rmdir("/tmp/ast"));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thu-muc.c -o thu-muc &amp;&amp; ./thu-muc<br>
mkdir &nbsp;-&gt; 0<br>
mkdir &nbsp;-&gt; 0<br>
memo has 1 link(s)<br>
link &nbsp;&nbsp;-&gt; 0 &nbsp;&nbsp;(new name /tmp/ast/note for the same file)<br>
memo has 2 link(s)<br>
unlink -&gt; 0 &nbsp;&nbsp;(remove the name /tmp/jim/memo)<br>
note still has 1 link(s): the file is alive<br>
rmdir &nbsp;-&gt; -1 &nbsp;&nbsp;(Directory not empty)<br>
rmdir &nbsp;-&gt; 0 &nbsp;&nbsp;(now empty)</div>
<p>Sau <code>link</code>, memo có 2 liên kết; sau khi unlink tên <code>memo</code>, dữ liệu vẫn tới được qua tên <code>note</code> (1 liên kết). Lần <code>rmdir</code> đầu thất bại với "Directory not empty" (ENOTEMPTY); xoá mục cuối cùng rồi thì thành công.</p>
<p class="meo">🧠 <code>rm</code> trong shell = <code>unlink</code>; <code>ln</code> = <code>link</code>; <code>ln -s</code> = <code>symlink</code> (liên kết mềm — một tệp nhỏ chứa đường dẫn, Chương 4).</p>`],
      [31, 'System Calls (5)',
        `<p class="y-chinh">🎯 Figure 1-18, miscellaneous: <code>chdir(dirname)</code> changes the working directory, <code>chmod(name, mode)</code> changes a file's protection bits, <code>kill(pid, signal)</code> sends a signal to a process, <code>seconds = time(&amp;seconds)</code> gets the elapsed time since 1 January 1970.</p>
<p><code>chdir</code> changes where relative paths start (slide 23). <code>chmod</code> sets the 9 <strong>rwx</strong> bits for owner, group and others — 755 = rwxr-xr-x. <code>kill</code> is badly named: it sends <em>any</em> signal (SIGTERM asks politely, SIGKILL cannot be refused). 1 January 1970 is the <strong>UNIX epoch</strong>; counting seconds in a signed 32-bit number overflows in January 2038 — the "year 2038 problem" that 64-bit <code>time_t</code> fixes.</p>
<p>➕ All four, for real:</p>
<pre><code class="language-c">// Figure 1-18 "miscellaneous": chdir, chmod, kill, time
#include &lt;stdio.h&gt;
#include &lt;signal.h&gt;
#include &lt;time.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    char cwd[256];
    chdir("/usr/share");                                   // s = chdir(dirname)
    printf("chdir -&gt; now in %s\\n", getcwd(cwd, sizeof cwd));
    close(open("/tmp/bai.sh", O_CREAT | O_WRONLY, 0644));
    chmod("/tmp/bai.sh", 0755);                            // s = chmod(name, mode)
    struct stat st; stat("/tmp/bai.sh", &amp;st);
    printf("chmod -&gt; mode is now %o\\n", st.st_mode &amp; 0777);
    pid_t p = fork();
    if (p == 0) { pause(); return 0; }                     // the child waits for a signal
    kill(p, SIGTERM);                                      // s = kill(pid, signal)
    int status; waitpid(p, &amp;status, 0);
    printf("kill  -&gt; child ended by signal %d (SIGTERM = %d)\\n", WTERMSIG(status), SIGTERM);
    time_t now = time(NULL);                               // seconds = time(&amp;seconds)
    printf("time  -&gt; more than 1.7 billion seconds since 1 Jan 1970: %s\\n", now &gt; 1700000000 ? "yes" : "no");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread linh-tinh.c -o linh-tinh &amp;&amp; ./linh-tinh<br>
chdir -&gt; now in /usr/share<br>
chmod -&gt; mode is now 755<br>
kill &nbsp;-&gt; child ended by signal 15 (SIGTERM = 15)<br>
time &nbsp;-&gt; more than 1.7 billion seconds since 1 Jan 1970: yes</div>
<p>➕ A modern twist: <code>time()</code> is in the table of system calls, yet on Linux it usually never enters the kernel. Counted with <code>strace</code>:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># time() is in Figure 1-18 — yet on Linux it usually never enters the kernel<br>
$ cat &gt; gio.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;time.h&gt;<br>
&gt; int main(void) { time_t t = time(NULL); printf("time() returned a number &gt; 0: %s\\n", t &gt; 0 ? "yes" : "no"); return 0; }<br>
&gt; END<br>
$ gcc gio.c -o gio<br>
$ ./gio<br>
time() returned a number &gt; 0: yes<br>
# how many of its system calls are time(), clock_gettime() or gettimeofday()?<br>
$ strace ./gio 2&gt;&amp;1 &gt;/dev/null | grep -cE '^(time|clock_gettime|gettimeofday)\\('<br>
0<br>
# the answer came from the vDSO: kernel code mapped into every process, run in user mode<br>
$ grep vdso /proc/self/maps<br>
ffffa1b87000-ffffa1b89000 r-xp 00000000 00:00 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[vdso]</div>
<p>Zero time-related system calls: the answer came from the <strong>vDSO</strong>, a page of kernel code mapped into every process (older lesson 1.1) that reads the clock without a trap — a system call optimised away.</p>
<p class="pitfall">⚠️ "<code>kill</code> always terminates the process" — false; it sends a signal, and the process may catch or ignore most signals (not SIGKILL or SIGSTOP).</p>`,
        `<p class="y-chinh">🎯 Hình 1-18, linh tinh: <code>chdir(dirname)</code> đổi thư mục làm việc, <code>chmod(name, mode)</code> đổi các bit bảo vệ của tệp, <code>kill(pid, signal)</code> gửi một tín hiệu cho tiến trình, <code>seconds = time(&amp;seconds)</code> lấy số giây đã trôi qua kể từ 1/1/1970.</p>
<p><code>chdir</code> đổi điểm xuất phát của đường dẫn tương đối (slide 23). <code>chmod</code> đặt 9 bit <strong>rwx</strong> cho chủ, nhóm và người khác — 755 = rwxr-xr-x. <code>kill</code> có cái tên dễ hiểu lầm: nó gửi <em>bất kỳ</em> tín hiệu nào (SIGTERM là đề nghị lịch sự, SIGKILL thì không từ chối được). Ngày 1/1/1970 là <strong>mốc UNIX (epoch)</strong>; đếm giây bằng số nguyên 32-bit có dấu sẽ tràn vào tháng 1/2038 — "sự cố năm 2038" mà <code>time_t</code> 64-bit giải quyết.</p>
<p>➕ Cả bốn, chạy thật:</p>
<pre><code class="language-c">// Hình 1-18 "linh tinh": chdir, chmod, kill, time
#include &lt;stdio.h&gt;
#include &lt;signal.h&gt;
#include &lt;time.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    char cwd[256];
    chdir("/usr/share");                                   // đổi thư mục làm việc
    printf("chdir -&gt; now in %s\\n", getcwd(cwd, sizeof cwd));
    close(open("/tmp/bai.sh", O_CREAT | O_WRONLY, 0644));
    chmod("/tmp/bai.sh", 0755);                            // đổi bit bảo vệ
    struct stat st; stat("/tmp/bai.sh", &amp;st);
    printf("chmod -&gt; mode is now %o\\n", st.st_mode &amp; 0777);
    pid_t p = fork();
    if (p == 0) { pause(); return 0; }                     // tiến trình con chờ tín hiệu
    kill(p, SIGTERM);                                      // gửi tín hiệu cho tiến trình
    int status; waitpid(p, &amp;status, 0);
    printf("kill  -&gt; child ended by signal %d (SIGTERM = %d)\\n", WTERMSIG(status), SIGTERM);
    time_t now = time(NULL);                               // số giây kể từ 1/1/1970
    printf("time  -&gt; more than 1.7 billion seconds since 1 Jan 1970: %s\\n", now &gt; 1700000000 ? "yes" : "no");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread linh-tinh.c -o linh-tinh &amp;&amp; ./linh-tinh<br>
chdir -&gt; now in /usr/share<br>
chmod -&gt; mode is now 755<br>
kill &nbsp;-&gt; child ended by signal 15 (SIGTERM = 15)<br>
time &nbsp;-&gt; more than 1.7 billion seconds since 1 Jan 1970: yes</div>
<p>➕ Một điểm hiện đại: <code>time()</code> nằm trong bảng lời gọi hệ thống, vậy mà trên Linux nó thường không hề vào nhân. Đếm bằng <code>strace</code>:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># time() có trong Hình 1-18 — vậy mà trên Linux nó thường không hề vào nhân<br>
$ cat &gt; gio.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;time.h&gt;<br>
&gt; int main(void) { time_t t = time(NULL); printf("time() returned a number &gt; 0: %s\\n", t &gt; 0 ? "yes" : "no"); return 0; }<br>
&gt; END<br>
$ gcc gio.c -o gio<br>
$ ./gio<br>
time() returned a number &gt; 0: yes<br>
# bao nhiêu lời gọi hệ thống của nó là time(), clock_gettime() hay gettimeofday()?<br>
$ strace ./gio 2&gt;&amp;1 &gt;/dev/null | grep -cE '^(time|clock_gettime|gettimeofday)\\('<br>
0<br>
# câu trả lời đến từ vDSO: mã của nhân được ánh xạ vào mọi tiến trình, chạy ở chế độ người dùng<br>
$ grep vdso /proc/self/maps<br>
ffffa1b87000-ffffa1b89000 r-xp 00000000 00:00 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[vdso]</div>
<p>Không có lời gọi hệ thống nào về thời gian: câu trả lời đến từ <strong>vDSO</strong>, một trang mã của nhân được ánh xạ vào mọi tiến trình (bài cũ 1.1), đọc đồng hồ mà không cần bẫy — một lời gọi hệ thống đã được tối ưu bỏ đi.</p>
<p class="pitfall">⚠️ "<code>kill</code> luôn kết thúc tiến trình" — sai; nó gửi một tín hiệu, và tiến trình có thể bắt hoặc bỏ qua phần lớn tín hiệu (trừ SIGKILL và SIGSTOP).</p>`],
      [32, 'System Calls for Process Management',
        `<p class="y-chinh">🎯 Figure 1-19: a <strong>stripped-down shell</strong> — repeat forever: display a prompt, read a command, <code>fork</code> a child; the parent <code>waitpid</code>s for the child to exit, the child <code>execve</code>s the command. (The book assumes <code>TRUE</code> is defined as 1.)</p>
<p>This loop is the heart of every UNIX shell: <code>bash</code>, <code>zsh</code>, the shell inside Docker containers. <code>fork() != 0</code> is true in the parent (it got the child's PID) and false in the child (it got 0) — slide 28's rule. A real shell adds parsing, pipes, redirection, background jobs (<code>&amp;</code> = do not wait) and built-in commands such as <code>cd</code>, which <em>must</em> run in the shell itself (a child's <code>chdir</code> would not change the parent's directory).</p>
<p>➕ Figure 1-19 completed into a working program (it reads commands from a file instead of the keyboard):</p>
<pre><code class="language-c">// Figure 1-19 made real: a stripped-down shell (reads commands from stdin)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

#define TRUE 1

int main(void) {
    char line[256];
    while (TRUE) {                                    // repeat forever
        printf("mini$ ");                             // type_prompt()
        fflush(stdout);
        if (!fgets(line, sizeof line, stdin)) break;  // read_command(); end of input = stop
        line[strcspn(line, "\\n")] = 0;
        printf("%s\\n", line);                         // echo it, so the transcript looks like a terminal
        fflush(stdout);                               // flush BEFORE fork, or the child copies the buffer
        char *argv[16]; int argc = 0;
        for (char *t = strtok(line, " "); t &amp;&amp; argc &lt; 15; t = strtok(NULL, " ")) argv[argc++] = t;
        argv[argc] = NULL;
        if (argc == 0) continue;
        if (strcmp(argv[0], "exit") == 0) break;
        if (fork() != 0) {                            // parent code
            int status;
            waitpid(-1, &amp;status, 0);                  // wait for child to exit
        } else {                                      // child code
            execvp(argv[0], argv);                    // execute command
            printf("%s: command not found\\n", argv[0]);
            return 127;
        }
    }
    printf("bye\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread mini-shell.c -o mini-shell &amp;&amp; ./mini-shell &lt; mini-shell.in<br>
mini$ echo hello from my own shell<br>
hello from my own shell<br>
mini$ ls /usr<br>
bin<br>
games<br>
include<br>
lib<br>
libexec<br>
local<br>
sbin<br>
share<br>
src<br>
mini$ nosuchcommand<br>
nosuchcommand: command not found<br>
mini$ wc -c /etc/hostname<br>
8 /etc/hostname<br>
mini$ exit<br>
bye</div>
<p>Each command ran in a new child process; <code>nosuchcommand</code> shows what happens when <code>execvp</code> fails — the child prints the error and exits, the parent continues. Note the <code>fflush</code> before <code>fork</code>: without it, the echoed command would sit in the buffer and be copied into the child (exercise 2 of the first hands-on session).</p>
<p class="meo">🧠 Shell loop = prompt → read → fork → (parent: wait) / (child: exec). Four words, the whole of UNIX process creation.</p>`,
        `<p class="y-chinh">🎯 Hình 1-19: một <strong>shell rút gọn</strong> — lặp mãi: in dấu nhắc, đọc một lệnh, <code>fork</code> một con; cha <code>waitpid</code> đợi con kết thúc, con <code>execve</code> chạy lệnh. (Sách ngầm định <code>TRUE</code> được định nghĩa là 1.)</p>
<p>Vòng lặp này là trái tim của mọi shell UNIX: <code>bash</code>, <code>zsh</code>, shell trong container Docker. <code>fork() != 0</code> đúng ở tiến trình cha (nó nhận PID của con) và sai ở con (nó nhận 0) — luật của slide 28. Shell thật thêm phân tích cú pháp, pipe, chuyển hướng, chạy nền (<code>&amp;</code> = không đợi) và các lệnh dựng sẵn như <code>cd</code>, thứ <em>bắt buộc</em> chạy trong chính shell (con có <code>chdir</code> cũng không đổi được thư mục của cha).</p>
<p>➕ Hình 1-19 được viết tiếp thành một chương trình chạy được (nó đọc lệnh từ tệp thay cho bàn phím):</p>
<pre><code class="language-c">// Hình 1-19 chạy thật: một shell rút gọn (đọc lệnh từ stdin)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

#define TRUE 1

int main(void) {
    char line[256];
    while (TRUE) {                                    // lặp mãi
        printf("mini$ ");                             // in dấu nhắc
        fflush(stdout);
        if (!fgets(line, sizeof line, stdin)) break;  // đọc lệnh; hết dữ liệu thì dừng
        line[strcspn(line, "\\n")] = 0;
        printf("%s\\n", line);                         // in lại lệnh cho giống terminal
        fflush(stdout);                               // xả TRƯỚC khi fork, kẻo con chép luôn bộ đệm
        char *argv[16]; int argc = 0;
        for (char *t = strtok(line, " "); t &amp;&amp; argc &lt; 15; t = strtok(NULL, " ")) argv[argc++] = t;
        argv[argc] = NULL;
        if (argc == 0) continue;
        if (strcmp(argv[0], "exit") == 0) break;
        if (fork() != 0) {                            // mã của cha
            int status;
            waitpid(-1, &amp;status, 0);                  // đợi con kết thúc
        } else {                                      // mã của con
            execvp(argv[0], argv);                    // chạy lệnh
            printf("%s: command not found\\n", argv[0]);
            return 127;
        }
    }
    printf("bye\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread mini-shell.c -o mini-shell &amp;&amp; ./mini-shell &lt; mini-shell.in<br>
mini$ echo hello from my own shell<br>
hello from my own shell<br>
mini$ ls /usr<br>
bin<br>
games<br>
include<br>
lib<br>
libexec<br>
local<br>
sbin<br>
share<br>
src<br>
mini$ nosuchcommand<br>
nosuchcommand: command not found<br>
mini$ wc -c /etc/hostname<br>
8 /etc/hostname<br>
mini$ exit<br>
bye</div>
<p>Mỗi lệnh chạy trong một tiến trình con mới; <code>nosuchcommand</code> cho thấy chuyện gì xảy ra khi <code>execvp</code> lỗi — con in lỗi rồi thoát, cha chạy tiếp. Để ý <code>fflush</code> trước <code>fork</code>: thiếu nó, lệnh vừa in lại còn nằm trong bộ đệm và bị chép sang con (bài tập 2 của buổi thực hành đầu tiên).</p>
<p class="meo">🧠 Vòng lặp shell = dấu nhắc → đọc → fork → (cha: đợi) / (con: exec). Bốn chữ, toàn bộ cách UNIX tạo tiến trình.</p>`],
      [33, 'System Calls for File Management',
        `<p class="y-chinh">🎯 Figure 1-20: a process has three <strong>segments</strong> — the <strong>text</strong> segment (program code) at the bottom, the <strong>data</strong> segment (variables) above it, and the <strong>stack</strong> at the top of the address space; data grows up, the stack grows down, with a <strong>gap</strong> between them.</p>
<p>⚠️ The slide's title says "file management" but the figure belongs to process management (book section 1.6.1): it shows what <code>execve</code> builds in memory. Addresses run from 0000 to FFFF (hex) in the figure. The data segment can grow with the <code>brk</code> system call (that is where <code>malloc</code>'s <strong>heap</strong> lives); the stack grows automatically as functions are called. Unused address space between them costs nothing — Chapter 3 explains why.</p>
<p>➕ The segments of a real process: <code>size</code> prints the sizes the compiler put in the file, then the program prints where each kind of variable actually lives:</p>
<pre><code class="language-c">// Figure 1-20: where text, data, heap and stack really live in a running process
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int initialised = 42;        // data segment (initialised globals)
int zeroed;                  // bss (globals set to 0)

int main(void) {
    int local = 7;                           // stack
    int *heap = malloc(sizeof(int));         // heap, grows upward after data
    printf("text  (main)        %p\\n", (void *)main);
    printf("data  (initialised) %p\\n", (void *)&amp;initialised);
    printf("bss   (zeroed)      %p\\n", (void *)&amp;zeroed);
    printf("heap  (malloc)      %p\\n", (void *)heap);
    printf("stack (local)       %p\\n", (void *)&amp;local);
    printf("text &lt; data &lt; heap &lt; stack ? %s\\n",
           ((void *)main &lt; (void *)&amp;initialised &amp;&amp; (void *)&amp;initialised &lt; (void *)heap &amp;&amp; (void *)heap &lt; (void *)&amp;local) ? "yes" : "no");
    free(heap);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread phan-doan.c -o phan-doan &amp;&amp; size ./phan-doan; ./phan-doan<br>
&nbsp;&nbsp;&nbsp;text	 &nbsp;&nbsp;data	 &nbsp;&nbsp;&nbsp;bss	 &nbsp;&nbsp;&nbsp;dec	 &nbsp;&nbsp;&nbsp;hex	filename<br>
&nbsp;&nbsp;&nbsp;2116	 &nbsp;&nbsp;&nbsp;644	 &nbsp;&nbsp;&nbsp;&nbsp;12	 &nbsp;&nbsp;2772	 &nbsp;&nbsp;&nbsp;ad4	./phan-doan<br>
text &nbsp;(main) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaab88f0814<br>
data &nbsp;(initialised) 0xaaaab8910048<br>
bss &nbsp;&nbsp;(zeroed) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaab8910050<br>
heap &nbsp;(malloc) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaad065f2a0<br>
stack (local) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xffffcd75cfe4<br>
text &lt; data &lt; heap &lt; stack ? yes</div>
<p>The order matches the figure: code (text) lowest, then initialised data, then <strong>bss</strong> (globals that start as zero — stored in the file only as a size), then the heap, and the stack far above. The exact addresses change every run (address-space layout randomisation, a security feature); the order does not.</p>
<p class="pitfall">⚠️ FE: "Which segment holds local variables?" → stack. "Global initialised variables?" → data. "Program instructions?" → text. "Dynamically allocated memory?" → heap (part of the data area growing upward).</p>`,
        `<p class="y-chinh">🎯 Hình 1-20: một tiến trình có ba <strong>đoạn (segment)</strong> — đoạn <strong>text</strong> (mã chương trình) ở đáy, đoạn <strong>data</strong> (biến) ngay trên, và <strong>ngăn xếp (stack)</strong> ở đỉnh không gian địa chỉ; data lớn dần lên, stack lớn dần xuống, giữa chúng là một <strong>khoảng trống (gap)</strong>.</p>
<p>⚠️ Tiêu đề slide ghi "quản lý tệp" nhưng hình thuộc phần quản lý tiến trình (mục 1.6.1 trong sách): nó cho thấy <code>execve</code> dựng gì trong bộ nhớ. Trong hình địa chỉ chạy từ 0000 tới FFFF (hệ 16). Đoạn data có thể nới ra bằng lời gọi hệ thống <code>brk</code> (đó là nơi <strong>heap</strong> của <code>malloc</code> nằm); stack tự lớn ra khi hàm được gọi. Phần không gian địa chỉ bỏ trống giữa chúng không tốn gì — Chương 3 giải thích vì sao.</p>
<p>➕ Các đoạn của một tiến trình thật: <code>size</code> in kích thước mà trình biên dịch ghi vào tệp, rồi chương trình in mỗi loại biến thật sự nằm ở đâu:</p>
<pre><code class="language-c">// Hình 1-20: mã, dữ liệu, heap và ngăn xếp thật sự nằm ở đâu trong một tiến trình đang chạy
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int initialised = 42;        // đoạn dữ liệu (biến toàn cục có giá trị đầu)
int zeroed;                  // bss (biến toàn cục bằng 0)

int main(void) {
    int local = 7;                           // ngăn xếp
    int *heap = malloc(sizeof(int));         // heap, lớn dần lên phía trên đoạn dữ liệu
    printf("text  (main)        %p\\n", (void *)main);
    printf("data  (initialised) %p\\n", (void *)&amp;initialised);
    printf("bss   (zeroed)      %p\\n", (void *)&amp;zeroed);
    printf("heap  (malloc)      %p\\n", (void *)heap);
    printf("stack (local)       %p\\n", (void *)&amp;local);
    printf("text &lt; data &lt; heap &lt; stack ? %s\\n",
           ((void *)main &lt; (void *)&amp;initialised &amp;&amp; (void *)&amp;initialised &lt; (void *)heap &amp;&amp; (void *)heap &lt; (void *)&amp;local) ? "yes" : "no");
    free(heap);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread phan-doan.c -o phan-doan &amp;&amp; size ./phan-doan; ./phan-doan<br>
&nbsp;&nbsp;&nbsp;text	 &nbsp;&nbsp;data	 &nbsp;&nbsp;&nbsp;bss	 &nbsp;&nbsp;&nbsp;dec	 &nbsp;&nbsp;&nbsp;hex	filename<br>
&nbsp;&nbsp;&nbsp;2116	 &nbsp;&nbsp;&nbsp;644	 &nbsp;&nbsp;&nbsp;&nbsp;12	 &nbsp;&nbsp;2772	 &nbsp;&nbsp;&nbsp;ad4	./phan-doan<br>
text &nbsp;(main) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaab88f0814<br>
data &nbsp;(initialised) 0xaaaab8910048<br>
bss &nbsp;&nbsp;(zeroed) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaab8910050<br>
heap &nbsp;(malloc) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xaaaad065f2a0<br>
stack (local) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0xffffcd75cfe4<br>
text &lt; data &lt; heap &lt; stack ? yes</div>
<p>Thứ tự khớp với hình: mã (text) thấp nhất, rồi dữ liệu có giá trị đầu, rồi <strong>bss</strong> (biến toàn cục bắt đầu bằng 0 — trong tệp chỉ ghi kích thước), rồi heap, và stack ở tít phía trên. Địa chỉ cụ thể đổi theo mỗi lần chạy (ngẫu nhiên hoá bố trí không gian địa chỉ — ASLR, một tính năng bảo mật); thứ tự thì không đổi.</p>
<p class="pitfall">⚠️ FE: "Đoạn nào giữ biến cục bộ?" → stack. "Biến toàn cục có giá trị đầu?" → data. "Lệnh của chương trình?" → text. "Bộ nhớ cấp phát động?" → heap (một phần vùng data lớn dần lên).</p>`],
      [34, 'System Calls for Directory Management (1)',
        `<p class="y-chinh">🎯 Figure 1-21: (a) two directories, <code>/usr/ast</code> and <code>/usr/jim</code>, before linking <code>/usr/jim/memo</code> into ast's directory; (b) after <code>link("/usr/jim/memo", "/usr/ast/note")</code> — ast's directory has a new entry <code>note</code> with the <strong>same i-number (70)</strong> as jim's <code>memo</code>.</p>
<p>In UNIX a directory entry is just (i-number, name). The <strong>i-number</strong> indexes a table of <strong>i-nodes</strong>, one per file, which record the file's owner, size, permissions, the disk blocks and a link count — but not its name. So two entries with the same i-number are two names for one file; neither is "the original". Changing the file through one name changes it under the other.</p>
<p>➕ Figure 1-21 rebuilt with the same names, using the shell commands that call <code>link</code>:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 1-21 for real: two names, one i-node<br>
$ mkdir -p usr/ast usr/jim<br>
$ touch usr/ast/{mail,games,test} usr/jim/{bin,memo,f.c.,prog1}<br>
$ ls -i usr/jim<br>
278317 bin<br>
278319 f.c.<br>
278318 memo<br>
278334 prog1<br>
$ ln usr/jim/memo usr/ast/note<br>
$ ls -i usr/ast<br>
278315 games<br>
278314 mail<br>
278318 note<br>
278316 test<br>
# same i-number =&gt; same file; the link count is now 2<br>
$ stat -c '%n: inode %i, %h links' usr/jim/memo usr/ast/note<br>
usr/jim/memo: inode 278318, 2 links<br>
usr/ast/note: inode 278318, 2 links<br>
$ echo "written via jim" &gt; usr/jim/memo<br>
$ cat usr/ast/note<br>
written via jim</div>
<p><code>ls -i</code> prints i-numbers (yours will differ from the book's 16, 81, 40, 70…). After <code>ln</code>, <code>note</code> and <code>memo</code> show the same i-number and 2 links; writing through <code>memo</code> is visible through <code>note</code>.</p>
<p class="meo">🧠 Hard link = another name for the same i-node (same file system only). Symbolic link = a tiny file containing a path (can cross file systems, can dangle). Chapter 4 details both.</p>`,
        `<p class="y-chinh">🎯 Hình 1-21: (a) hai thư mục <code>/usr/ast</code> và <code>/usr/jim</code> trước khi liên kết <code>/usr/jim/memo</code> vào thư mục của ast; (b) sau <code>link("/usr/jim/memo", "/usr/ast/note")</code> — thư mục của ast có thêm mục <code>note</code> mang <strong>cùng số i-node (70)</strong> với <code>memo</code> của jim.</p>
<p>Trong UNIX một mục thư mục chỉ là (số i-node, tên). <strong>Số i-node (i-number)</strong> là chỉ số tra vào bảng <strong>i-node</strong>, mỗi tệp một i-node, ghi chủ sở hữu, kích thước, quyền, các khối đĩa và số liên kết của tệp — nhưng không ghi tên. Vì vậy hai mục cùng số i-node là hai cái tên của một tệp; không cái nào là "bản gốc". Sửa tệp qua tên này thì tên kia cũng thấy thay đổi.</p>
<p>➕ Dựng lại Hình 1-21 với đúng các tên đó, dùng các lệnh shell gọi tới <code>link</code>:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 1-21 chạy thật: hai cái tên, một i-node<br>
$ mkdir -p usr/ast usr/jim<br>
$ touch usr/ast/{mail,games,test} usr/jim/{bin,memo,f.c.,prog1}<br>
$ ls -i usr/jim<br>
278317 bin<br>
278319 f.c.<br>
278318 memo<br>
278334 prog1<br>
$ ln usr/jim/memo usr/ast/note<br>
$ ls -i usr/ast<br>
278315 games<br>
278314 mail<br>
278318 note<br>
278316 test<br>
# cùng số i-node =&gt; cùng một tệp; số liên kết giờ là 2<br>
$ stat -c '%n: inode %i, %h links' usr/jim/memo usr/ast/note<br>
usr/jim/memo: inode 278318, 2 links<br>
usr/ast/note: inode 278318, 2 links<br>
$ echo "written via jim" &gt; usr/jim/memo<br>
$ cat usr/ast/note<br>
written via jim</div>
<p><code>ls -i</code> in ra số i-node (của bạn sẽ khác các số 16, 81, 40, 70… trong sách). Sau <code>ln</code>, <code>note</code> và <code>memo</code> cùng số i-node và cùng 2 liên kết; ghi qua <code>memo</code> thì đọc qua <code>note</code> thấy ngay.</p>
<p class="meo">🧠 Liên kết cứng (hard link) = thêm một cái tên cho cùng i-node (chỉ trong cùng hệ thống tệp). Liên kết mềm (symbolic link) = một tệp tí hon chứa đường dẫn (vượt được hệ thống tệp, có thể trỏ vào chỗ không còn tồn tại). Chương 4 nói kỹ cả hai.</p>`],
      [35, 'System Calls for Directory Management (2)',
        `<p class="y-chinh">🎯 Figure 1-22: (a) the file system before the mount — root with <code>bin</code>, <code>dev</code>, <code>lib</code>, <code>mnt</code>, <code>usr</code>; (b) after the mount — a whole file system (from a USB stick, a second disk…) appears under one of those directories.</p>
<p>This is slide 24 again, now as a system call: <code>mount(special, name, flag)</code> where <code>special</code> is the device (or a description of the file system), <code>name</code> the directory where it appears, and <code>flag</code> options such as read-only. On Linux the real call has more arguments — <code>mount(source, target, filesystemtype, flags, data)</code> — and only a privileged process may use it.</p>
<p>➕ <code>mount</code> and <code>umount</code> called directly from C (with root rights in the container), mounting an in-memory file system (<code>tmpfs</code>) on a directory that already contains a file:</p>
<pre><code class="language-c">// Figure 1-22 with the real system calls: mount() and umount()
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;
#include &lt;dirent.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mount.h&gt;
#include &lt;sys/stat.h&gt;

static void list(const char *d) {
    DIR *dir = opendir(d); struct dirent *e; int n = 0;
    printf("  %s contains:", d);
    while ((e = readdir(dir))) if (e-&gt;d_name[0] != '.') { printf(" %s", e-&gt;d_name); n++; }
    printf("%s\\n", n ? "" : " (nothing)");
    closedir(dir);
}

int main(void) {
    mkdir("/mnt/disk2", 0755);
    close(open("/mnt/disk2/hidden-before", O_CREAT | O_WRONLY, 0644));
    list("/mnt/disk2");
    int s = mount("none", "/mnt/disk2", "tmpfs", 0, "size=1m");   // s = mount(special, name, flag)
    printf("mount  -&gt; %d\\n", s);
    close(open("/mnt/disk2/on-the-new-fs", O_CREAT | O_WRONLY, 0644));
    list("/mnt/disk2");
    s = umount("/mnt/disk2");                                     // s = umount(special)
    printf("umount -&gt; %d\\n", s);
    list("/mnt/disk2");
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread mount.c -o mount &amp;&amp; ./mount<br>
&nbsp;&nbsp;/mnt/disk2 contains: hidden-before<br>
mount &nbsp;-&gt; 0<br>
&nbsp;&nbsp;/mnt/disk2 contains: on-the-new-fs<br>
umount -&gt; 0<br>
&nbsp;&nbsp;/mnt/disk2 contains: hidden-before</div>
<p>While mounted, the directory shows the new file system and <strong>hides</strong> what was there (<code>hidden-before</code>); after <code>umount</code> the old content is back and the file created on the tmpfs is gone with it. Mount points are how Linux puts <code>/proc</code>, <code>/sys</code>, USB sticks, network shares and Docker volumes into one tree.</p>
<p class="pitfall">⚠️ <code>umount</code> (no "n") is the real name of the call and the command.</p>`,
        `<p class="y-chinh">🎯 Hình 1-22: (a) hệ thống tệp trước khi mount — gốc có <code>bin</code>, <code>dev</code>, <code>lib</code>, <code>mnt</code>, <code>usr</code>; (b) sau khi mount — nguyên một hệ thống tệp (từ USB, ổ đĩa thứ hai…) hiện ra dưới một trong các thư mục đó.</p>
<p>Đây là slide 24 lặp lại, giờ dưới dạng lời gọi hệ thống: <code>mount(special, name, flag)</code> với <code>special</code> là thiết bị (hoặc mô tả hệ thống tệp), <code>name</code> là thư mục nơi nó hiện ra, và <code>flag</code> là tuỳ chọn như chỉ-đọc. Trên Linux, lời gọi thật có nhiều đối số hơn — <code>mount(source, target, filesystemtype, flags, data)</code> — và chỉ tiến trình có đặc quyền mới được dùng.</p>
<p>➕ <code>mount</code> và <code>umount</code> gọi thẳng từ C (với quyền root trong container), gắn một hệ thống tệp nằm trong bộ nhớ (<code>tmpfs</code>) lên một thư mục đang có sẵn một tệp:</p>
<pre><code class="language-c">// Hình 1-22 với lời gọi hệ thống thật: mount() và umount()
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;string.h&gt;
#include &lt;dirent.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/mount.h&gt;
#include &lt;sys/stat.h&gt;

static void list(const char *d) {
    DIR *dir = opendir(d); struct dirent *e; int n = 0;
    printf("  %s contains:", d);
    while ((e = readdir(dir))) if (e-&gt;d_name[0] != '.') { printf(" %s", e-&gt;d_name); n++; }
    printf("%s\\n", n ? "" : " (nothing)");
    closedir(dir);
}

int main(void) {
    mkdir("/mnt/disk2", 0755);
    close(open("/mnt/disk2/hidden-before", O_CREAT | O_WRONLY, 0644));
    list("/mnt/disk2");
    int s = mount("none", "/mnt/disk2", "tmpfs", 0, "size=1m");   // ghép một hệ thống tệp mới vào /mnt/disk2
    printf("mount  -&gt; %d\\n", s);
    close(open("/mnt/disk2/on-the-new-fs", O_CREAT | O_WRONLY, 0644));
    list("/mnt/disk2");
    s = umount("/mnt/disk2");                                     // tháo ra
    printf("umount -&gt; %d\\n", s);
    list("/mnt/disk2");
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread mount.c -o mount &amp;&amp; ./mount<br>
&nbsp;&nbsp;/mnt/disk2 contains: hidden-before<br>
mount &nbsp;-&gt; 0<br>
&nbsp;&nbsp;/mnt/disk2 contains: on-the-new-fs<br>
umount -&gt; 0<br>
&nbsp;&nbsp;/mnt/disk2 contains: hidden-before</div>
<p>Trong lúc gắn, thư mục cho thấy hệ thống tệp mới và <strong>che</strong> thứ vốn ở đó (<code>hidden-before</code>); sau <code>umount</code> nội dung cũ trở lại, còn tệp tạo trên tmpfs biến mất theo. Điểm mount là cách Linux đưa <code>/proc</code>, <code>/sys</code>, USB, thư mục chia sẻ mạng và volume của Docker vào một cây duy nhất.</p>
<p class="pitfall">⚠️ <code>umount</code> (không có chữ "n") là tên thật của lời gọi và của lệnh.</p>`],
      [36, 'The Windows Win32 API (1)',
        `<p class="y-chinh">🎯 Figure 1-23: the <strong>Win32 API</strong> calls that roughly correspond to the UNIX calls of Figure 1-18 — fork → CreateProcess, waitpid → WaitForSingleObject, execve → (none), exit → ExitProcess, open → CreateFile, close → CloseHandle, read → ReadFile, write → WriteFile, lseek → SetFilePointer, stat → GetFileAttributesEx, mkdir → CreateDirectory.</p>
<p>The deep difference: in UNIX the API <em>is</em> the list of system calls; in Windows, Win32 is a <strong>library</strong> of thousands of functions, and the real system calls underneath (the "native NT API", Chapter 11) are undocumented and change between versions. Windows has no fork/exec pair: <code>CreateProcess</code> does both at once — create a new process <em>and</em> load a program into it ("CreateProcess = fork + execve" in the table). Instead of file descriptors, Windows returns <strong>handles</strong>, closed with <code>CloseHandle</code>.</p>
<p>➕ Portable runtimes hide the difference. The same "start a child, wait, read its exit code" in Node.js runs unchanged on Linux and Windows:</p>
<pre><code class="language-javascript">// The same fork + exec + wait from Node.js: child_process hides the OS differences
import { spawnSync } from 'node:child_process';

const r = spawnSync('ls', ['/usr'], { encoding: 'utf8' });   // on Linux: a new process + execve; on Windows: CreateProcess
console.log('child stdout:', r.stdout.trim().split('\\n').join(' '));
console.log('child exit code:', r.status);
const bad = spawnSync('ls', ['/nope'], { encoding: 'utf8' });
console.log('child exit code:', bad.status, '-', bad.stderr.trim());</code></pre>
<div class="out">$ node spawn.mjs<br>
child stdout: bin games include lib libexec local sbin share src<br>
child exit code: 0<br>
child exit code: 2 - ls: cannot access '/nope': No such file or directory</div>
<p>On Linux, Node creates the child with a fork/exec-style call; on Windows the same JavaScript line calls <code>CreateProcess</code>. Java's <code>ProcessBuilder</code> does the same. That is the "extended machine" of slide 4, one level higher.</p>
<p class="meo">🧠 UNIX: many small calls you combine (fork + exec + dup2 for redirection). Windows: few big calls with many parameters (CreateProcess has 10).</p>`,
        `<p class="y-chinh">🎯 Hình 1-23: các lời gọi <strong>Win32 API</strong> tương ứng gần đúng với lời gọi UNIX ở Hình 1-18 — fork → CreateProcess, waitpid → WaitForSingleObject, execve → (không có), exit → ExitProcess, open → CreateFile, close → CloseHandle, read → ReadFile, write → WriteFile, lseek → SetFilePointer, stat → GetFileAttributesEx, mkdir → CreateDirectory.</p>
<p>Khác biệt sâu xa: trong UNIX, API <em>chính là</em> danh sách lời gọi hệ thống; trong Windows, Win32 là một <strong>thư viện</strong> hàng nghìn hàm, còn các lời gọi hệ thống thật bên dưới ("native NT API", Chương 11) không được công bố và đổi theo phiên bản. Windows không có cặp fork/exec: <code>CreateProcess</code> làm cả hai một lượt — tạo tiến trình mới <em>và</em> nạp chương trình vào đó ("CreateProcess = fork + execve" trong bảng). Thay cho bộ mô tả tệp, Windows trả về <strong>handle</strong>, đóng bằng <code>CloseHandle</code>.</p>
<p>➕ Các môi trường chạy đa nền tảng giấu khác biệt này đi. Cùng việc "khởi chạy một con, đợi, đọc mã thoát" bằng Node.js chạy y nguyên trên Linux và Windows:</p>
<pre><code class="language-javascript">// Cùng fork + exec + wait viết bằng Node.js: child_process giấu khác biệt giữa các HĐH
import { spawnSync } from 'node:child_process';

const r = spawnSync('ls', ['/usr'], { encoding: 'utf8' });   // trên Linux: tiến trình mới + execve; trên Windows: CreateProcess
console.log('child stdout:', r.stdout.trim().split('\\n').join(' '));
console.log('child exit code:', r.status);
const bad = spawnSync('ls', ['/nope'], { encoding: 'utf8' });
console.log('child exit code:', bad.status, '-', bad.stderr.trim());</code></pre>
<div class="out">$ node spawn.mjs<br>
child stdout: bin games include lib libexec local sbin share src<br>
child exit code: 0<br>
child exit code: 2 - ls: cannot access '/nope': No such file or directory</div>
<p>Trên Linux, Node tạo con bằng một lời gọi kiểu fork/exec; trên Windows cùng dòng JavaScript đó gọi <code>CreateProcess</code>. <code>ProcessBuilder</code> của Java cũng vậy. Đó là "cỗ máy mở rộng" của slide 4, ở một tầng cao hơn.</p>
<p class="meo">🧠 UNIX: nhiều lời gọi nhỏ để ghép lại (fork + exec + dup2 để chuyển hướng). Windows: ít lời gọi lớn với nhiều tham số (CreateProcess có 10 tham số).</p>`],
      [37, 'The Windows Win32 API (2)',
        `<p class="y-chinh">🎯 Figure 1-23 continued: lseek → SetFilePointer, stat → GetFileAttributesEx, mkdir → CreateDirectory, rmdir → RemoveDirectory, link → (none), unlink → DeleteFile, mount/umount → (none), chdir → SetCurrentDirectory, chmod → (none), kill → (none), time → GetLocalTime.</p>
<p>The "(none)" rows describe the book's simplified view, and several are outdated — say so if asked outside the FE:</p>
<table>
<thead><tr><th>UNIX call</th><th>Slide says</th><th>Reality (Microsoft Learn, checked 25/10/2026)</th></tr></thead>
<tbody>
<tr><td>link</td><td>Win32 does not support links</td><td><code>CreateHardLink</code> — minimum client Windows XP (NTFS); symbolic links: <code>CreateSymbolicLink</code> — Windows Vista</td></tr>
<tr><td>chmod</td><td>no security (although NT does)</td><td>NTFS uses access-control lists, set with the security API (Chapter 11), not 9 permission bits</td></tr>
<tr><td>kill</td><td>Win32 does not support signals</td><td>true for UNIX-style signals; a process is ended with <code>TerminateProcess</code></td></tr>
<tr><td>mount</td><td>Win32 does not support mount</td><td>drive letters instead of one tree; volumes can also be mounted on NTFS folders</td></tr>
</tbody>
</table>
<p>For the FE, answer as the table says (link → none, kill → none); in an interview, know that Windows <em>does</em> have hard links, symbolic links and ACL-based security. ➕ Windows 10/11 also ships WSL 2 — a real Linux kernel — precisely because developers need the UNIX API.</p>
<p class="pitfall">⚠️ The Win32 table is "rough": Win32 calls take extra parameters (security attributes, flags, overlapped I/O) and return BOOL or HANDLE, not −1.</p>`,
        `<p class="y-chinh">🎯 Hình 1-23 (tiếp): lseek → SetFilePointer, stat → GetFileAttributesEx, mkdir → CreateDirectory, rmdir → RemoveDirectory, link → (không có), unlink → DeleteFile, mount/umount → (không có), chdir → SetCurrentDirectory, chmod → (không có), kill → (không có), time → GetLocalTime.</p>
<p>Các dòng "(none)" mô tả góc nhìn đơn giản hoá của sách, và nhiều dòng đã lỗi thời — nói rõ nếu được hỏi ngoài phòng thi FE:</p>
<table>
<thead><tr><th>Lời gọi UNIX</th><th>Slide ghi</th><th>Thực tế (Microsoft Learn, tra ngày 25/10/2026)</th></tr></thead>
<tbody>
<tr><td>link</td><td>Win32 không hỗ trợ liên kết</td><td><code>CreateHardLink</code> — tối thiểu Windows XP (NTFS); liên kết mềm: <code>CreateSymbolicLink</code> — Windows Vista</td></tr>
<tr><td>chmod</td><td>không có bảo mật (dù NT có)</td><td>NTFS dùng danh sách kiểm soát truy cập (ACL), đặt bằng API bảo mật (Chương 11), không phải 9 bit quyền</td></tr>
<tr><td>kill</td><td>Win32 không hỗ trợ tín hiệu</td><td>đúng với tín hiệu kiểu UNIX; muốn kết thúc tiến trình thì dùng <code>TerminateProcess</code></td></tr>
<tr><td>mount</td><td>Win32 không hỗ trợ mount</td><td>dùng ký tự ổ đĩa thay cho một cây; volume cũng gắn được vào thư mục NTFS</td></tr>
</tbody>
</table>
<p>Trong phòng thi FE, trả lời đúng như bảng (link → không có, kill → không có); khi phỏng vấn, hãy biết Windows <em>có</em> liên kết cứng, liên kết mềm và bảo mật dựa trên ACL. ➕ Windows 10/11 còn kèm WSL 2 — một nhân Linux thật — chính vì lập trình viên cần API của UNIX.</p>
<p class="pitfall">⚠️ Bảng Win32 chỉ là "gần đúng": lời gọi Win32 nhận thêm tham số (thuộc tính bảo mật, cờ, I/O chồng lấp) và trả về BOOL hoặc HANDLE, không trả −1.</p>`],
      [38, 'Monolithic Systems (1)',
        `<p class="y-chinh">🎯 The basic structure of a <strong>monolithic</strong> OS: (1) a <strong>main program</strong> that invokes the requested service procedure, (2) a set of <strong>service procedures</strong> that carry out the system calls, (3) a set of <strong>utility procedures</strong> that help the service procedures.</p>
<p>"Monolithic" = the whole OS is one big executable program running in kernel mode; any procedure may call any other. It is the most common organisation (Linux, classic UNIX, the core of Windows): calls inside the kernel are cheap function calls, so it is fast. The cost: no isolation — one buggy driver can crash or corrupt the whole system, and the code base is huge.</p>
<p>➕ Linux is monolithic but not frozen: <strong>loadable modules</strong> (drivers, file systems) can be added at run time and become part of the one kernel. The course machine's kernel, and the size of its system-call "menu":</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A monolithic kernel that can still load pieces at run time: modules<br>
$ lsmod<br>
Module &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used by<br>
selfowner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768 &nbsp;-2<br>
shiftfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768 &nbsp;-2<br>
rosetta &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12288 &nbsp;-2<br>
grpcfuse &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12288 &nbsp;-2<br>
fakeowner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135168 &nbsp;-2<br>
# how many system calls does this kernel offer? (count the numbered ones in the C header)<br>
$ grep -cE '^#define __NR_[a-z0-9_]+ [0-9]+' /usr/include/asm-generic/unistd.h<br>
316<br>
$ grep -E '^#define __NR_(read|write|openat|clone|execve) ' /usr/include/asm-generic/unistd.h<br>
#define __NR_openat 56<br>
#define __NR_read 63<br>
#define __NR_write 64<br>
#define __NR_clone 220<br>
#define __NR_execve 221</div>
<p>Docker's VM kernel has only a handful of modules (most drivers are built in); a desktop Linux lists dozens. The C header of this ARM64 machine defines 316 numbered system calls — the service procedures of item (2).</p>
<p class="meo">🧠 Monolithic = one program, everything in kernel mode, fast but fragile. Older lesson 1.4 has the four-architecture comparison table.</p>`,
        `<p class="y-chinh">🎯 Cấu trúc cơ bản của một HĐH <strong>nguyên khối (monolithic)</strong>: (1) một <strong>chương trình chính</strong> gọi thủ tục dịch vụ được yêu cầu, (2) một tập <strong>thủ tục dịch vụ</strong> thực hiện các lời gọi hệ thống, (3) một tập <strong>thủ tục tiện ích</strong> giúp các thủ tục dịch vụ.</p>
<p>"Nguyên khối" = cả HĐH là một chương trình thực thi lớn chạy ở chế độ nhân; thủ tục nào cũng gọi được thủ tục nào. Đây là cách tổ chức phổ biến nhất (Linux, UNIX cổ điển, lõi của Windows): lời gọi bên trong nhân chỉ là lời gọi hàm rẻ tiền, nên nhanh. Cái giá: không có cách ly — một driver lỗi có thể làm sập hay làm hỏng cả hệ thống, và lượng mã khổng lồ.</p>
<p>➕ Linux là nguyên khối nhưng không đóng băng: <strong>module nạp được (loadable module)</strong> — driver, hệ thống tệp — có thể thêm vào lúc đang chạy và trở thành một phần của nhân duy nhất đó. Nhân của máy môn học, và kích thước "thực đơn" lời gọi hệ thống của nó:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Một nhân nguyên khối vẫn nạp thêm được từng mảnh lúc chạy: module<br>
$ lsmod<br>
Module &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used by<br>
selfowner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768 &nbsp;-2<br>
shiftfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768 &nbsp;-2<br>
rosetta &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12288 &nbsp;-2<br>
grpcfuse &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12288 &nbsp;-2<br>
fakeowner &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;135168 &nbsp;-2<br>
# nhân này có bao nhiêu lời gọi hệ thống? (đếm các số hiệu trong header C)<br>
$ grep -cE '^#define __NR_[a-z0-9_]+ [0-9]+' /usr/include/asm-generic/unistd.h<br>
316<br>
$ grep -E '^#define __NR_(read|write|openat|clone|execve) ' /usr/include/asm-generic/unistd.h<br>
#define __NR_openat 56<br>
#define __NR_read 63<br>
#define __NR_write 64<br>
#define __NR_clone 220<br>
#define __NR_execve 221</div>
<p>Nhân của máy ảo Docker chỉ có vài module (phần lớn driver được biên dịch sẵn vào nhân); Linux desktop thường liệt kê vài chục. Header C của máy ARM64 này định nghĩa 316 lời gọi hệ thống có đánh số — chính là các thủ tục dịch vụ của mục (2).</p>
<p class="meo">🧠 Nguyên khối = một chương trình, mọi thứ ở chế độ nhân, nhanh nhưng mong manh. Bài cũ 1.4 có bảng so sánh bốn kiến trúc.</p>`],
      [39, 'Monolithic Systems (2)',
        `<p class="y-chinh">🎯 Figure 1-24: a simple structuring model for a monolithic system — one <strong>main procedure</strong> on top, <strong>service procedures</strong> in the middle, <strong>utility procedures</strong> at the bottom, with calls going downward and utilities shared between services.</p>
<p>When a system call traps into the kernel, the main procedure reads the call number and indexes a table to find the service procedure (steps 7–8 of slide 27). Services call shared utilities — for example, copying data between user and kernel memory, or looking up a path name. The same three layers, with the names they have in Linux:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b4add4c7cc67fa15b36b72a2f6648d68c6648cc8.svg" alt="Figure 1-24 with Linux names: the dispatcher, three service procedures, and utilities they share" loading="lazy" /><p class="chu-thich">🧩 Figure 1-24 with Linux names: the dispatcher, three service procedures, and utilities they share</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 1-24 mapped onto Linux: one big program in kernel mode
skinparam defaultTextAlignment center
rectangle "Main procedure\\n= system-call entry + dispatcher\\n(looks the call number up in sys_call_table)" as M #EEF2FF
rectangle "Service procedure\\nsys_read" as S1 #ECFDF5
rectangle "Service procedure\\nsys_openat" as S2 #ECFDF5
rectangle "Service procedure\\nsys_clone" as S3 #ECFDF5
rectangle "Utility\\ncopy_to_user()" as U1 #FEF9C3
rectangle "Utility\\npath lookup" as U2 #FEF9C3
rectangle "Utility\\nmemory allocator" as U3 #FEF9C3
M --&gt; S1
M --&gt; S2
M --&gt; S3
S1 --&gt; U1
S2 --&gt; U2
S2 --&gt; U3
S3 --&gt; U3
note bottom of U3 : all of this is ONE program in kernel mode:\\nfast calls, but a bug anywhere can crash everything
@enduml</code></pre></details>
<p>➕ "Structure" here is only a coding discipline, not protection: a service procedure <em>could</em> call anything. Linux keeps order with conventions and code review, and isolates mistakes as far as it can (for example, a failing driver is reported as an "oops" and the system may keep running).</p>
<p class="pitfall">⚠️ FE wording: "In a monolithic system, the OS is written as a collection of procedures linked together into a single large executable binary" — true.</p>`,
        `<p class="y-chinh">🎯 Hình 1-24: một mô hình tổ chức đơn giản cho hệ nguyên khối — một <strong>thủ tục chính</strong> ở trên, các <strong>thủ tục dịch vụ</strong> ở giữa, các <strong>thủ tục tiện ích</strong> ở dưới, lời gọi đi từ trên xuống và các tiện ích được dùng chung giữa các dịch vụ.</p>
<p>Khi một lời gọi hệ thống bẫy vào nhân, thủ tục chính đọc số hiệu lời gọi và tra bảng để tìm thủ tục dịch vụ (bước 7–8 của slide 27). Dịch vụ gọi các tiện ích dùng chung — ví dụ chép dữ liệu giữa bộ nhớ người dùng và bộ nhớ nhân, hay dò một đường dẫn. Cùng ba tầng đó, với tên của chúng trong Linux:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b4add4c7cc67fa15b36b72a2f6648d68c6648cc8.svg" alt="Hình 1-24 với tên trong Linux: bộ điều phối, ba thủ tục dịch vụ, và các tiện ích chúng dùng chung" loading="lazy" /><p class="chu-thich">🧩 Hình 1-24 với tên trong Linux: bộ điều phối, ba thủ tục dịch vụ, và các tiện ích chúng dùng chung</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 1-24 áp vào Linux: một chương trình lớn chạy ở chế độ nhân
skinparam defaultTextAlignment center
rectangle "Main procedure\\n= system-call entry + dispatcher\\n(looks the call number up in sys_call_table)" as M #EEF2FF
rectangle "Service procedure\\nsys_read" as S1 #ECFDF5
rectangle "Service procedure\\nsys_openat" as S2 #ECFDF5
rectangle "Service procedure\\nsys_clone" as S3 #ECFDF5
rectangle "Utility\\ncopy_to_user()" as U1 #FEF9C3
rectangle "Utility\\npath lookup" as U2 #FEF9C3
rectangle "Utility\\nmemory allocator" as U3 #FEF9C3
M --&gt; S1
M --&gt; S2
M --&gt; S3
S1 --&gt; U1
S2 --&gt; U2
S2 --&gt; U3
S3 --&gt; U3
note bottom of U3 : all of this is ONE program in kernel mode:\\nfast calls, but a bug anywhere can crash everything
@enduml</code></pre></details>
<p>➕ "Cấu trúc" ở đây chỉ là kỷ luật viết mã, không phải bảo vệ: một thủ tục dịch vụ <em>có thể</em> gọi bất cứ thứ gì. Linux giữ trật tự bằng quy ước và review mã, và cô lập sai sót trong khả năng có thể (ví dụ một driver hỏng được báo thành "oops" và hệ thống có thể vẫn chạy tiếp).</p>
<p class="pitfall">⚠️ Cách đề FE diễn đạt: "Trong hệ nguyên khối, HĐH được viết như một tập thủ tục liên kết với nhau thành một tệp thực thi lớn duy nhất" — đúng.</p>`],
      [40, 'Layered Systems',
        `<p class="y-chinh">🎯 Figure 1-25: the <strong>THE</strong> operating system, organised in six <strong>layers</strong> — 0 processor allocation and multiprogramming, 1 memory and drum management, 2 operator–process communication, 3 input/output management, 4 user programs, 5 the operator.</p>
<p>Built by E. W. Dijkstra and his students at the Technische Hogeschool Eindhoven (1968) for a small batch computer. Each layer uses only the services of the layers below it, so each can be designed and checked on its own: above layer 0 nobody worries about which process has the CPU; above layer 1 nobody worries whether a page is in memory or on the drum (the drum was the disk of the time); above layer 3 every device looks abstract.</p>
<p>➕ MULTICS generalised the idea into <strong>rings</strong> of protection enforced by hardware — inner rings more privileged. Today's CPUs keep the idea: x86 has rings 0–3 (operating systems use only 0 for the kernel and 3 for users), ARM64 has exception levels EL0 (user — the <code>EL=0</code> you saw at slide 11) to EL3 (firmware), with EL1 for the kernel and EL2 for a hypervisor.</p>
<p class="pitfall">⚠️ The weakness of strict layering: real dependencies are circular (memory management needs I/O to page; I/O needs memory for buffers), so pure layered kernels are rare — and every layer crossing costs time.</p>`,
        `<p class="y-chinh">🎯 Hình 1-25: hệ điều hành <strong>THE</strong>, tổ chức thành sáu <strong>tầng (layer)</strong> — 0 cấp phát bộ xử lý và đa chương trình, 1 quản lý bộ nhớ và trống từ (drum), 2 giao tiếp giữa người vận hành và tiến trình, 3 quản lý vào/ra, 4 chương trình người dùng, 5 người vận hành.</p>
<p>Do E. W. Dijkstra và sinh viên của ông xây ở Technische Hogeschool Eindhoven (1968) cho một máy tính lô nhỏ. Mỗi tầng chỉ dùng dịch vụ của các tầng bên dưới, nên từng tầng được thiết kế và kiểm tra riêng: trên tầng 0 không ai phải lo tiến trình nào đang có CPU; trên tầng 1 không ai phải lo một trang đang ở bộ nhớ hay trên trống từ (trống từ là "đĩa" của thời đó); trên tầng 3 mọi thiết bị đều trừu tượng.</p>
<p>➕ MULTICS tổng quát hoá ý tưởng này thành các <strong>vòng (ring)</strong> bảo vệ do phần cứng cưỡng chế — vòng trong có đặc quyền cao hơn. CPU ngày nay vẫn giữ ý tưởng đó: x86 có ring 0–3 (HĐH chỉ dùng 0 cho nhân và 3 cho người dùng), ARM64 có mức ngoại lệ EL0 (người dùng — chính là <code>EL=0</code> bạn thấy ở slide 11) tới EL3 (firmware), EL1 cho nhân và EL2 cho hypervisor.</p>
<p class="pitfall">⚠️ Điểm yếu của phân tầng nghiêm ngặt: phụ thuộc thật thường vòng tròn (quản lý bộ nhớ cần I/O để phân trang; I/O cần bộ nhớ làm bộ đệm), nên nhân phân tầng thuần tuý rất hiếm — và mỗi lần vượt tầng đều tốn thời gian.</p>`],
      [41, 'Microkernels',
        `<p class="y-chinh">🎯 Figure 1-26: the simplified structure of <strong>MINIX 3</strong> — a small <strong>microkernel</strong> in kernel mode handles interrupts, processes, scheduling and IPC (with clock and system tasks); everything else runs as separate <strong>user-mode processes</strong>: drivers (disk, TTY, network, printer), servers (file system, process manager, the "reincarnation" server) and user programs.</p>
<p>The idea: put as little as possible in kernel mode. A buggy disk driver is now just a crashed process — the <strong>reincarnation server</strong> notices and restarts it, and the system keeps running. Components talk by <strong>message passing</strong> through the microkernel. The price is speed: a request that is one function call in a monolithic kernel becomes several messages and mode switches.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/ad3410236b0eea8f9aac51306f95bd4fd773bb01.svg" alt="Where the file system and the drivers live: inside the kernel (monolithic) or as user-mode processes (microkernel)" loading="lazy" /><p class="chu-thich">🧩 Where the file system and the drivers live: inside the kernel (monolithic) or as user-mode processes (microkernel)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Monolithic vs microkernel: where the file system and the drivers live
skinparam defaultTextAlignment center
package "Monolithic (Linux, classic UNIX)" {
  rectangle "Applications\\n(user mode)" as A1 #EEF2FF
  rectangle "Kernel mode: scheduler, memory, IPC,\\nfile systems, network stack, ALL drivers" as K1 #ECFDF5
  A1 --&gt; K1 : system call
}
package "Microkernel (MINIX 3, QNX, seL4)" {
  rectangle "Applications" as A2 #EEF2FF
  rectangle "File server · Process server ·\\nReincarnation server\\n(user mode)" as SV #F0F9FF
  rectangle "Drivers: disk · TTY · network\\n(user mode)" as DR #F0F9FF
  rectangle "Microkernel (kernel mode):\\ninterrupts, processes, scheduling, IPC" as K2 #ECFDF5
  A2 --&gt; K2 : message
  K2 --&gt; SV : message
  SV --&gt; DR : message
}
@enduml</code></pre></details>
<p>➕ Microkernels win where reliability beats raw speed: QNX in cars and medical devices, seL4 (formally proven correct) in aircraft and defence systems, and MINIX 3 itself was reported in 2017 to run inside the Intel Management Engine of many PCs. Linux, macOS (XNU) and Windows are monolithic or "hybrid" (older lesson 1.4 tells the 1992 Tanenbaum–Torvalds debate).</p>
<p class="pitfall">⚠️ FE: "In a microkernel, device drivers run in…" → user mode, as separate processes. "Main advantage?" → reliability/robustness. "Main disadvantage?" → performance (message passing).</p>`,
        `<p class="y-chinh">🎯 Hình 1-26: cấu trúc giản lược của <strong>MINIX 3</strong> — một <strong>vi nhân (microkernel)</strong> nhỏ ở chế độ nhân xử lý ngắt, tiến trình, lập lịch và IPC (kèm tác vụ đồng hồ và tác vụ hệ thống); mọi thứ khác chạy thành các <strong>tiến trình ở chế độ người dùng</strong> riêng rẽ: driver (đĩa, TTY, mạng, máy in), server (hệ thống tệp, quản lý tiến trình, server "tái sinh" — reincarnation) và chương trình người dùng.</p>
<p>Ý tưởng: đặt càng ít thứ ở chế độ nhân càng tốt. Driver đĩa có lỗi giờ chỉ là một tiến trình bị sập — <strong>server tái sinh</strong> phát hiện và khởi động lại nó, hệ thống vẫn chạy tiếp. Các thành phần nói chuyện bằng <strong>truyền thông điệp (message passing)</strong> qua vi nhân. Cái giá là tốc độ: một yêu cầu mà ở nhân nguyên khối chỉ là một lời gọi hàm thì ở đây thành nhiều thông điệp và nhiều lần chuyển chế độ.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/ad3410236b0eea8f9aac51306f95bd4fd773bb01.svg" alt="Hệ thống tệp và driver nằm ở đâu: trong nhân (nguyên khối) hay thành tiến trình chế độ người dùng (vi nhân)" loading="lazy" /><p class="chu-thich">🧩 Hệ thống tệp và driver nằm ở đâu: trong nhân (nguyên khối) hay thành tiến trình chế độ người dùng (vi nhân)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Nguyên khối và vi nhân: hệ thống tệp và driver nằm ở đâu
skinparam defaultTextAlignment center
package "Monolithic (Linux, classic UNIX)" {
  rectangle "Applications\\n(user mode)" as A1 #EEF2FF
  rectangle "Kernel mode: scheduler, memory, IPC,\\nfile systems, network stack, ALL drivers" as K1 #ECFDF5
  A1 --&gt; K1 : system call
}
package "Microkernel (MINIX 3, QNX, seL4)" {
  rectangle "Applications" as A2 #EEF2FF
  rectangle "File server · Process server ·\\nReincarnation server\\n(user mode)" as SV #F0F9FF
  rectangle "Drivers: disk · TTY · network\\n(user mode)" as DR #F0F9FF
  rectangle "Microkernel (kernel mode):\\ninterrupts, processes, scheduling, IPC" as K2 #ECFDF5
  A2 --&gt; K2 : message
  K2 --&gt; SV : message
  SV --&gt; DR : message
}
@enduml</code></pre></details>
<p>➕ Vi nhân thắng ở nơi độ tin cậy quan trọng hơn tốc độ thô: QNX trong ô tô và thiết bị y tế, seL4 (đã được chứng minh đúng bằng toán học) trong máy bay và hệ thống quốc phòng, và chính MINIX 3 được đưa tin năm 2017 là đang chạy bên trong Intel Management Engine của rất nhiều PC. Linux, macOS (XNU) và Windows là nguyên khối hoặc "lai" (bài cũ 1.4 kể cuộc tranh luận Tanenbaum–Torvalds năm 1992).</p>
<p class="pitfall">⚠️ FE: "Trong vi nhân, driver thiết bị chạy ở…" → chế độ người dùng, thành tiến trình riêng. "Ưu điểm chính?" → độ tin cậy/bền vững. "Nhược điểm chính?" → hiệu năng (truyền thông điệp).</p>`],
      [42, 'Client-Server Model',
        `<p class="y-chinh">🎯 Figure 1-27: the <strong>client-server model</strong> over a network — clients send request messages to servers (file server, process server, terminal server) running on other machines, each machine with its own kernel; the client need not know whether a server is local or remote.</p>
<p>This generalises the microkernel: if components only exchange messages, it does not matter whether the message crosses the memory of one machine or a network. Two kinds of process: <strong>servers</strong>, each providing one service, and <strong>clients</strong>, which use them. Chapter 8 (distributed systems) builds on this.</p>
<p>➕ This is exactly how a backend works. A tiny HTTP server and a client in one Node.js process, talking over the loopback network (127.0.0.1) of the container:</p>
<pre><code class="language-javascript">// Client-server on one machine: a tiny HTTP server and a client talking over the loopback network
const http = require('http');

const server = http.createServer((req, res) =&gt; {          // the SERVER waits for requests
  res.end(JSON.stringify({ path: req.url, answer: 'served by process ' + (process.pid &gt; 0 ? 'with a PID' : '?') }));
});
server.listen(8080, '127.0.0.1', async () =&gt; {
  const r = await fetch('http:// 127.0.0.1:8080/files/notes.txt'); // the CLIENT sends a message
  console.log('client got', r.status, await r.text());
  server.close();
});</code></pre>
<div class="out">$ node khach-chu.js<br>
client got 200 {"path":"/files/notes.txt","answer":"served by process with a PID"}</div>
<p>The client sent a request message ("GET /files/notes.txt"); the server answered with a reply message (status 200 + data). Replace the server by Spring Boot, the client by a React app, and the loopback by the Internet, and you have the system you will build in PRJ301 and beyond.</p>
<p class="meo">🧠 Client-server = "request message, reply message". The same pattern appears inside a microkernel, between machines, and between a browser and your API.</p>`,
        `<p class="y-chinh">🎯 Hình 1-27: <strong>mô hình khách-chủ (client-server)</strong> qua mạng — client gửi thông điệp yêu cầu tới các server (server tệp, server tiến trình, server terminal) chạy trên máy khác, mỗi máy có nhân riêng; client không cần biết server ở cùng máy hay ở xa.</p>
<p>Đây là bước tổng quát hoá của vi nhân: nếu các thành phần chỉ trao đổi thông điệp, thì thông điệp đi qua bộ nhớ của một máy hay qua mạng cũng như nhau. Hai loại tiến trình: <strong>server</strong>, mỗi cái cung cấp một dịch vụ, và <strong>client</strong>, dùng các dịch vụ đó. Chương 8 (hệ phân tán) xây trên ý này.</p>
<p>➕ Đây đúng là cách backend vận hành. Một HTTP server tí hon và một client trong cùng một tiến trình Node.js, nói chuyện qua mạng loopback (127.0.0.1) của container:</p>
<pre><code class="language-javascript">// Khách-chủ trên một máy: một HTTP server tí hon và một client nói chuyện qua mạng loopback
const http = require('http');

const server = http.createServer((req, res) =&gt; {          // SERVER chờ yêu cầu
  res.end(JSON.stringify({ path: req.url, answer: 'served by process ' + (process.pid &gt; 0 ? 'with a PID' : '?') }));
});
server.listen(8080, '127.0.0.1', async () =&gt; {
  const r = await fetch('http:// CLIENT gửi một thông điệp
  console.log('client got', r.status, await r.text());
  server.close();
});</code></pre>
<div class="out">$ node khach-chu.js<br>
client got 200 {"path":"/files/notes.txt","answer":"served by process with a PID"}</div>
<p>Client gửi thông điệp yêu cầu ("GET /files/notes.txt"); server trả lời bằng thông điệp đáp (mã 200 + dữ liệu). Thay server bằng Spring Boot, client bằng ứng dụng React, và loopback bằng Internet, bạn có đúng hệ thống sẽ xây ở PRJ301 và các môn sau.</p>
<p class="meo">🧠 Khách-chủ = "thông điệp yêu cầu, thông điệp trả lời". Cùng khuôn mẫu đó xuất hiện bên trong vi nhân, giữa các máy, và giữa trình duyệt với API của bạn.</p>`],
      [43, 'Virtual Machines',
        `<p class="y-chinh">🎯 Figure 1-28: the structure of <strong>VM/370</strong> with CMS — a <strong>virtual machine monitor</strong> (VM/370) runs on the bare hardware and gives each user an exact copy of the <strong>bare hardware</strong> ("virtual 370s"); on each copy runs a simple single-user OS, <strong>CMS</strong>. System calls are trapped by CMS; I/O instructions issued by CMS are trapped by VM/370.</p>
<p>IBM's insight (CP/CMS, later VM/370, early 1970s): timesharing does two jobs — multiprogramming and providing a convenient extended machine — so separate them. VM/370 only multiplexes the hardware; it provides no files or processes. Each virtual machine can run any OS, even a different one. The figure's arrows show the two kinds of trap: a CMS program's system call goes to CMS ("system calls here"); when CMS executes a privileged I/O instruction, the hardware traps to VM/370 ("trap here"), which emulates it on the real hardware.</p>
<p>➕ That "trap and emulate" trick needs a CPU where every sensitive instruction traps in user mode. The 1990s x86 did not meet this (Popek and Goldberg's condition, Chapter 7), which is why PC virtualization arrived late and needed extra tricks — then hardware support (Intel VT-x, AMD-V) from 2005–2006.</p>
<p class="meo">🧠 VMM = virtual machine monitor = <strong>hypervisor</strong> (FE1: "A VMM is also known as?" → hypervisor).</p>`,
        `<p class="y-chinh">🎯 Hình 1-28: cấu trúc <strong>VM/370</strong> với CMS — một <strong>trình giám sát máy ảo (virtual machine monitor)</strong> (VM/370) chạy trên phần cứng trần và đưa cho mỗi người dùng một bản sao chính xác của <strong>phần cứng trần</strong> ("các máy 370 ảo"); trên mỗi bản sao chạy một HĐH đơn người dùng đơn giản là <strong>CMS</strong>. Lời gọi hệ thống bị CMS bẫy; lệnh I/O do CMS phát ra bị VM/370 bẫy.</p>
<p>Ý tưởng của IBM (CP/CMS, sau đổi tên VM/370, đầu thập niên 1970): chia sẻ thời gian làm hai việc — đa chương trình và cung cấp một cỗ máy mở rộng tiện dụng — vậy hãy tách chúng ra. VM/370 chỉ dồn kênh phần cứng; nó không cung cấp tệp hay tiến trình. Mỗi máy ảo chạy được bất kỳ HĐH nào, kể cả HĐH khác nhau. Các mũi tên trong hình chỉ hai kiểu bẫy: lời gọi hệ thống của chương trình trong CMS đi tới CMS ("system calls here"); khi CMS thi hành một lệnh I/O đặc quyền, phần cứng bẫy về VM/370 ("trap here"), nơi lệnh đó được giả lập trên phần cứng thật.</p>
<p>➕ Mẹo "bẫy và giả lập" (trap and emulate) cần một CPU mà mọi lệnh nhạy cảm đều bị bẫy khi chạy ở chế độ người dùng. x86 thập niên 1990 không thoả điều này (điều kiện Popek và Goldberg, Chương 7), nên ảo hoá trên PC tới muộn và cần thêm mẹo — rồi có hỗ trợ phần cứng (Intel VT-x, AMD-V) từ 2005–2006.</p>
<p class="meo">🧠 VMM = virtual machine monitor = <strong>hypervisor</strong> (FE1: "VMM còn được gọi là gì?" → hypervisor).</p>`],
      [44, 'Virtual Machines Rediscovered',
        `<p class="y-chinh">🎯 Figure 1-29: (a) a <strong>type 1 hypervisor</strong> runs directly on the hardware and hosts guest OSes (Windows, Linux) side by side; (b) a pure <strong>type 2 hypervisor</strong> is a process on a host OS, here simulating the machine; (c) a practical type 2 hypervisor runs on a host OS but uses a kernel module and hardware support to run guest code directly.</p>
<table>
<thead><tr><th>Type</th><th>Runs on</th><th>Examples today</th></tr></thead>
<tbody>
<tr><td>Type 1 ("bare metal")</td><td>the hardware</td><td>VMware ESXi, Microsoft Hyper-V, Xen; KVM turns Linux itself into one</td></tr>
<tr><td>Type 2 ("hosted")</td><td>a host operating system</td><td>VirtualBox, VMware Workstation/Fusion, Parallels, UTM</td></tr>
<tr><td>Containers (not VMs)</td><td>one shared kernel</td><td>Docker, Podman — isolated processes, no guest OS kernel</td></tr>
</tbody>
</table>
<p>➕ Your own course setup is a stack of these figures:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/0b87ca1ce8a147d487e25c1921d1eb926f0fa46a.svg" alt="Figure 1-29 applied to your laptop: the Mac route and the Windows (WSL 2) route" loading="lazy" /><p class="chu-thich">🧩 Figure 1-29 applied to your laptop: the Mac route and the Windows (WSL 2) route</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Where the Linux of this course really runs (Figure 1-29 applied to your laptop)
skinparam defaultTextAlignment center
package "Mac with Docker Desktop (what built this site)" {
  rectangle "container osg202-lab\\nordinary Linux processes inside fences" as C1 #DCFCE7
  rectangle "Linux VM (linuxkit kernel)" as V1 #ECFDF5
  rectangle "Hypervisor: Apple Virtualization framework\\n(inside macOS — type 2 style)" as H1 #F0F9FF
  rectangle "macOS (XNU kernel) on Apple silicon" as O1 #E5E7EB
  C1 -down- V1
  V1 -down- H1
  H1 -down- O1
}
package "Windows laptop with WSL 2" {
  rectangle "Ubuntu (your shell, gcc)" as C2 #DCFCE7
  rectangle "Linux kernel built by Microsoft\\n(kernel name ends in -microsoft-standard-WSL2)" as V2 #ECFDF5
  rectangle "Hyper-V (type 1 hypervisor)\\nWindows itself also runs on top of it" as H2 #F0F9FF
  rectangle "PC hardware (x86-64)" as O2 #E5E7EB
  C2 -down- V2
  V2 -down- H2
  H2 -down- O2
}
@enduml</code></pre></details>
<p>On Windows, WSL 2 runs a real Linux kernel in a lightweight VM on <strong>Hyper-V</strong> — a type 1 hypervisor that, once enabled, also runs Windows itself as a privileged guest. On a Mac, Docker Desktop starts a small Linux VM through Apple's virtualization framework, and our container is a set of ordinary processes inside that VM — the reason the course kernel is called "linuxkit". Clouds (AWS, Azure, Google Cloud) are type 1 hypervisors at scale: Advanced 1 (Chapter 7) is about them.</p>
<p class="pitfall">⚠️ A container is NOT a virtual machine: it shares the host's kernel (here, the linuxkit kernel). That is why <code>uname -r</code> inside any container on the same machine prints the same kernel.</p>`,
        `<p class="y-chinh">🎯 Hình 1-29: (a) <strong>hypervisor loại 1</strong> chạy thẳng trên phần cứng và chứa các HĐH khách (Windows, Linux) cạnh nhau; (b) <strong>hypervisor loại 2</strong> thuần là một tiến trình trên HĐH chủ, ở đây giả lập cả cỗ máy; (c) hypervisor loại 2 thực dụng chạy trên HĐH chủ nhưng dùng một module nhân và hỗ trợ phần cứng để chạy thẳng mã của khách.</p>
<table>
<thead><tr><th>Loại</th><th>Chạy trên</th><th>Ví dụ ngày nay</th></tr></thead>
<tbody>
<tr><td>Loại 1 ("bare metal")</td><td>phần cứng</td><td>VMware ESXi, Microsoft Hyper-V, Xen; KVM biến chính Linux thành một hypervisor</td></tr>
<tr><td>Loại 2 ("hosted")</td><td>một HĐH chủ</td><td>VirtualBox, VMware Workstation/Fusion, Parallels, UTM</td></tr>
<tr><td>Container (không phải VM)</td><td>một nhân dùng chung</td><td>Docker, Podman — các tiến trình bị cô lập, không có nhân HĐH khách</td></tr>
</tbody>
</table>
<p>➕ Chính môi trường học của bạn là một chồng các hình này:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/0b87ca1ce8a147d487e25c1921d1eb926f0fa46a.svg" alt="Hình 1-29 áp vào laptop của bạn: đường Mac và đường Windows (WSL 2)" loading="lazy" /><p class="chu-thich">🧩 Hình 1-29 áp vào laptop của bạn: đường Mac và đường Windows (WSL 2)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Linux của môn này thật sự chạy ở đâu (Hình 1-29 áp vào laptop của bạn)
skinparam defaultTextAlignment center
package "Mac with Docker Desktop (what built this site)" {
  rectangle "container osg202-lab\\nordinary Linux processes inside fences" as C1 #DCFCE7
  rectangle "Linux VM (linuxkit kernel)" as V1 #ECFDF5
  rectangle "Hypervisor: Apple Virtualization framework\\n(inside macOS — type 2 style)" as H1 #F0F9FF
  rectangle "macOS (XNU kernel) on Apple silicon" as O1 #E5E7EB
  C1 -down- V1
  V1 -down- H1
  H1 -down- O1
}
package "Windows laptop with WSL 2" {
  rectangle "Ubuntu (your shell, gcc)" as C2 #DCFCE7
  rectangle "Linux kernel built by Microsoft\\n(kernel name ends in -microsoft-standard-WSL2)" as V2 #ECFDF5
  rectangle "Hyper-V (type 1 hypervisor)\\nWindows itself also runs on top of it" as H2 #F0F9FF
  rectangle "PC hardware (x86-64)" as O2 #E5E7EB
  C2 -down- V2
  V2 -down- H2
  H2 -down- O2
}
@enduml</code></pre></details>
<p>Trên Windows, WSL 2 chạy một nhân Linux thật trong một máy ảo nhẹ trên <strong>Hyper-V</strong> — hypervisor loại 1 mà khi đã bật thì chạy luôn cả Windows như một khách có đặc quyền. Trên Mac, Docker Desktop khởi một máy ảo Linux nhỏ qua khung ảo hoá của Apple, và container của ta là một nhóm tiến trình bình thường bên trong máy ảo đó — lý do nhân của môn có tên "linuxkit". Điện toán đám mây (AWS, Azure, Google Cloud) là hypervisor loại 1 ở quy mô lớn: Nâng cao 1 (Chương 7) nói về chúng.</p>
<p class="pitfall">⚠️ Container KHÔNG phải máy ảo: nó dùng chung nhân của máy chủ (ở đây là nhân linuxkit). Vì thế <code>uname -r</code> trong mọi container trên cùng một máy đều in ra cùng một nhân.</p>`],
      [45, 'Large Programming Projects',
        `<p class="y-chinh">🎯 Figure 1-30: compiling C and header files into an executable — <code>.h</code> header files and <code>.c</code> source files go through the <strong>C preprocessor</strong>, then the <strong>C compiler</strong> produces one <code>.o</code> object file per <code>.c</code>; the <strong>linker</strong> combines the <code>.o</code> files with library archives (<code>libc.a</code>) into the executable binary <code>a.out</code>.</p>
<p>Operating systems are written in C (Linux: tens of millions of lines), so the book explains the C toolchain. The <strong>preprocessor</strong> handles <code>#include</code> (paste a header in), <code>#define</code> (macros) and <code>#ifdef</code> (conditional code — how one kernel source supports many CPUs). Each <code>.c</code> is compiled separately; the linker resolves names used in one file and defined in another. <strong>make</strong> reads a <code>Makefile</code> of dependencies and recompiles only what changed.</p>
<p>➕ The whole figure, for real, with two <code>.c</code> files and one header:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 1-30 for real: header files, preprocessor, compiler, linker, make<br>
$ cat &gt; defs.h &lt;&lt;'END'<br>
&gt; #define GREETING "hello from main.c"<br>
&gt; int help(int x);<br>
&gt; END<br>
$ cat &gt; main.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include "defs.h"<br>
&gt; int main(void) { printf("%s, help(20) = %d\\n", GREETING, help(20)); return 0; }<br>
&gt; END<br>
$ cat &gt; help.c &lt;&lt;'END'<br>
&gt; #include "defs.h"<br>
&gt; int help(int x) { return x * 2 + 2; }<br>
&gt; END<br>
$ printf 'a.out: main.o help.o\\n\\tgcc main.o help.o -o a.out\\nmain.o: main.c defs.h\\n\\tgcc -c main.c\\nhelp.o: help.c defs.h\\n\\tgcc -c help.c\\n' &gt; Makefile<br>
# 1. the preprocessor pasted defs.h in and replaced GREETING<br>
$ gcc -E main.c | tail -2<br>
# 3 "main.c" 2<br>
int main(void) { printf("%s, help(20) = %d\\n", "hello from main.c", help(20)); return 0; }<br>
# 2. make runs the compiler for each .c, then the linker<br>
$ make<br>
gcc -c main.c<br>
gcc -c help.c<br>
gcc main.o help.o -o a.out<br>
$ ./a.out<br>
hello from main.c, help(20) = 42<br>
# 3. change ONE file: make rebuilds only what depends on it<br>
$ touch help.c<br>
$ make<br>
gcc -c help.c<br>
gcc main.o help.o -o a.out<br>
$ make<br>
make: 'a.out' is up to date.<br>
$ file a.out<br>
a.out: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=4b719d7d22273b472bcffcf603c048932549c092, for GNU/Linux 3.7.0, not stripped</div>
<p>The preprocessor replaced <code>GREETING</code> by its text; <code>make</code> ran the compiler twice and the linker once; after touching only <code>help.c</code>, make rebuilt only <code>help.o</code> and relinked; with nothing changed it did nothing. <code>file</code> confirms the result: an ELF executable for ARM64 (on your x86-64 laptop: "x86-64").</p>
<p class="meo">🧠 Java and Node follow the same idea with other tools: <code>javac</code> + a <code>.jar</code> (Maven/Gradle play make's role), or <code>npm</code> scripts + a bundler.</p>`,
        `<p class="y-chinh">🎯 Hình 1-30: dịch tệp C và tệp header thành chương trình chạy được — tệp header <code>.h</code> và tệp nguồn <code>.c</code> đi qua <strong>bộ tiền xử lý C (preprocessor)</strong>, rồi <strong>trình biên dịch C</strong> tạo ra một tệp đối tượng <code>.o</code> cho mỗi <code>.c</code>; <strong>trình liên kết (linker)</strong> ghép các tệp <code>.o</code> với các kho thư viện (<code>libc.a</code>) thành tệp nhị phân thực thi <code>a.out</code>.</p>
<p>Hệ điều hành được viết bằng C (Linux: hàng chục triệu dòng), nên sách giải thích bộ công cụ C. <strong>Bộ tiền xử lý</strong> xử lý <code>#include</code> (dán một header vào), <code>#define</code> (macro) và <code>#ifdef</code> (mã có điều kiện — cách một mã nguồn nhân hỗ trợ nhiều loại CPU). Mỗi <code>.c</code> được biên dịch riêng; trình liên kết nối các tên dùng ở tệp này nhưng định nghĩa ở tệp khác. <strong>make</strong> đọc một <code>Makefile</code> ghi các phụ thuộc và chỉ dịch lại thứ đã thay đổi.</p>
<p>➕ Cả hình, chạy thật, với hai tệp <code>.c</code> và một header:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 1-30 chạy thật: tệp header, tiền xử lý, biên dịch, liên kết, make<br>
$ cat &gt; defs.h &lt;&lt;'END'<br>
&gt; #define GREETING "hello from main.c"<br>
&gt; int help(int x);<br>
&gt; END<br>
$ cat &gt; main.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include "defs.h"<br>
&gt; int main(void) { printf("%s, help(20) = %d\\n", GREETING, help(20)); return 0; }<br>
&gt; END<br>
$ cat &gt; help.c &lt;&lt;'END'<br>
&gt; #include "defs.h"<br>
&gt; int help(int x) { return x * 2 + 2; }<br>
&gt; END<br>
$ printf 'a.out: main.o help.o\\n\\tgcc main.o help.o -o a.out\\nmain.o: main.c defs.h\\n\\tgcc -c main.c\\nhelp.o: help.c defs.h\\n\\tgcc -c help.c\\n' &gt; Makefile<br>
# 1. bộ tiền xử lý dán defs.h vào và thay GREETING<br>
$ gcc -E main.c | tail -2<br>
# 3 "main.c" 2<br>
int main(void) { printf("%s, help(20) = %d\\n", "hello from main.c", help(20)); return 0; }<br>
# 2. make chạy trình biên dịch cho từng .c, rồi trình liên kết<br>
$ make<br>
gcc -c main.c<br>
gcc -c help.c<br>
gcc main.o help.o -o a.out<br>
$ ./a.out<br>
hello from main.c, help(20) = 42<br>
# 3. sửa MỘT tệp: make chỉ dịch lại thứ phụ thuộc vào nó<br>
$ touch help.c<br>
$ make<br>
gcc -c help.c<br>
gcc main.o help.o -o a.out<br>
$ make<br>
make: 'a.out' is up to date.<br>
$ file a.out<br>
a.out: ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=4b719d7d22273b472bcffcf603c048932549c092, for GNU/Linux 3.7.0, not stripped</div>
<p>Bộ tiền xử lý đã thay <code>GREETING</code> bằng đoạn chữ của nó; <code>make</code> chạy trình biên dịch hai lần và trình liên kết một lần; sau khi chỉ chạm vào <code>help.c</code>, make chỉ dịch lại <code>help.o</code> rồi liên kết lại; không có gì thay đổi thì nó không làm gì. <code>file</code> xác nhận kết quả: một tệp thực thi ELF cho ARM64 (trên laptop x86-64 của bạn: "x86-64").</p>
<p class="meo">🧠 Java và Node theo cùng ý tưởng với công cụ khác: <code>javac</code> + một tệp <code>.jar</code> (Maven/Gradle đóng vai make), hoặc script <code>npm</code> + một bundler.</p>`],
      [46, 'Metric Units',
        `<p class="y-chinh">🎯 Figure 1-31: the principal metric prefixes — milli (10⁻³), micro (10⁻⁶), nano (10⁻⁹), pico (10⁻¹²) … yocto (10⁻²⁴), and kilo (10³), mega (10⁶), giga (10⁹), tera (10¹²) … yotta (10²⁴).</p>
<p>The OS lives on all these scales: a CPU instruction takes under a nanosecond, a memory access tens of nanoseconds (slide 14), a disk seek milliseconds (slide 16), a context switch microseconds. The book follows a convention for sizes: memory is counted in powers of 2 (1 KB = 1024 bytes) while disks and network speeds use powers of 10 (1 KB = 1000 bytes). The slide does not show it, but to avoid this confusion the IEC introduced <strong>binary prefixes</strong> in 1998: KiB, MiB, GiB, TiB.</p>
<p>➕ The arithmetic, done by a program instead of by memory:</p>
<pre><code class="language-javascript">// Figure 1-31 meets your laptop: decimal prefixes (disk makers) vs binary prefixes (memory, many OS tools)
const pairs = [['kilo', 'KB', 'KiB', 1], ['mega', 'MB', 'MiB', 2], ['giga', 'GB', 'GiB', 3], ['tera', 'TB', 'TiB', 4]];
for (const [name, dec, bin, k] of pairs) {
  const ratio = 1024 ** k / 1000 ** k;
  console.log(&#96;1 &#36;{bin} = 1024^&#36;{k} = &#36;{(1024 ** k).toLocaleString('en-US')} bytes = &#36;{ratio.toFixed(4)} &#36;{dec}&#96;);
}
const disk = 1e12;                                          // a "1 TB" disk on the box
console.log(&#96;a "1 TB" disk = &#36;{disk.toLocaleString('en-US')} bytes = &#36;{(disk / 1024 ** 3).toFixed(2)} GiB (what many OS tools show)&#96;);
console.log(&#96;1 ms = &#36;{1e6.toLocaleString('en-US')} ns; 1 µs = 1,000 ns; light travels about &#36;{(299792458 * 1e-9 * 100).toFixed(1)} cm in 1 ns&#96;);</code></pre>
<div class="out">$ node don-vi.js<br>
1 KiB = 1024^1 = 1,024 bytes = 1.0240 KB<br>
1 MiB = 1024^2 = 1,048,576 bytes = 1.0486 MB<br>
1 GiB = 1024^3 = 1,073,741,824 bytes = 1.0737 GB<br>
1 TiB = 1024^4 = 1,099,511,627,776 bytes = 1.0995 TB<br>
a "1 TB" disk = 1,000,000,000,000 bytes = 931.32 GiB (what many OS tools show)<br>
1 ms = 1,000,000 ns; 1 µs = 1,000 ns; light travels about 30.0 cm in 1 ns</div>
<p>The famous "my 1 TB disk shows only 931 GB" is not missing space: the box counts 10¹² bytes, many OS tools count in GiB. ➕ Since November 2022 the SI table also has <strong>ronna</strong> (10²⁷) and <strong>quetta</strong> (10³⁰), and ronto/quecto for 10⁻²⁷/10⁻³⁰ — newer than this slide.</p>
<p class="pitfall">⚠️ In FE calculations, read the unit: "6 msec per cylinder × 61 cylinders = 366 ms" (a real FE1 disk question); mixing ms and µs is the usual way to lose the point.</p>`,
        `<p class="y-chinh">🎯 Hình 1-31: các tiền tố đo lường chính — milli (10⁻³), micro (10⁻⁶), nano (10⁻⁹), pico (10⁻¹²) … yocto (10⁻²⁴), và kilo (10³), mega (10⁶), giga (10⁹), tera (10¹²) … yotta (10²⁴).</p>
<p>HĐH sống trên mọi thang đo đó: một lệnh CPU mất chưa tới một nano-giây, một lần truy cập bộ nhớ vài chục nano-giây (slide 14), một lần tìm rãnh đĩa vài mili-giây (slide 16), một lần chuyển ngữ cảnh vài micro-giây. Sách theo một quy ước cho kích thước: bộ nhớ đếm theo lũy thừa của 2 (1 KB = 1024 byte) còn đĩa và tốc độ mạng dùng lũy thừa của 10 (1 KB = 1000 byte). Slide không ghi, nhưng để tránh nhầm lẫn này, IEC đã đưa ra <strong>tiền tố nhị phân</strong> năm 1998: KiB, MiB, GiB, TiB.</p>
<p>➕ Phép tính, để chương trình làm thay vì nhớ:</p>
<pre><code class="language-javascript">// Hình 1-31 gặp laptop của bạn: tiền tố thập phân (hãng ổ đĩa) và tiền tố nhị phân (bộ nhớ, nhiều công cụ của HĐH)
const pairs = [['kilo', 'KB', 'KiB', 1], ['mega', 'MB', 'MiB', 2], ['giga', 'GB', 'GiB', 3], ['tera', 'TB', 'TiB', 4]];
for (const [name, dec, bin, k] of pairs) {
  const ratio = 1024 ** k / 1000 ** k;
  console.log(&#96;1 &#36;{bin} = 1024^&#36;{k} = &#36;{(1024 ** k).toLocaleString('en-US')} bytes = &#36;{ratio.toFixed(4)} &#36;{dec}&#96;);
}
const disk = 1e12;                                          // ổ đĩa ghi "1 TB" trên hộp
console.log(&#96;a "1 TB" disk = &#36;{disk.toLocaleString('en-US')} bytes = &#36;{(disk / 1024 ** 3).toFixed(2)} GiB (what many OS tools show)&#96;);
console.log(&#96;1 ms = &#36;{1e6.toLocaleString('en-US')} ns; 1 µs = 1,000 ns; light travels about &#36;{(299792458 * 1e-9 * 100).toFixed(1)} cm in 1 ns&#96;);</code></pre>
<div class="out">$ node don-vi.js<br>
1 KiB = 1024^1 = 1,024 bytes = 1.0240 KB<br>
1 MiB = 1024^2 = 1,048,576 bytes = 1.0486 MB<br>
1 GiB = 1024^3 = 1,073,741,824 bytes = 1.0737 GB<br>
1 TiB = 1024^4 = 1,099,511,627,776 bytes = 1.0995 TB<br>
a "1 TB" disk = 1,000,000,000,000 bytes = 931.32 GiB (what many OS tools show)<br>
1 ms = 1,000,000 ns; 1 µs = 1,000 ns; light travels about 30.0 cm in 1 ns</div>
<p>Chuyện quen thuộc "đĩa 1 TB mà máy chỉ báo 931 GB" không phải mất dung lượng: vỏ hộp đếm 10¹² byte, còn nhiều công cụ của HĐH đếm theo GiB. ➕ Từ tháng 11/2022 bảng SI có thêm <strong>ronna</strong> (10²⁷) và <strong>quetta</strong> (10³⁰), cùng ronto/quecto cho 10⁻²⁷/10⁻³⁰ — mới hơn slide này.</p>
<p class="pitfall">⚠️ Trong câu tính toán FE, đọc kỹ đơn vị: "6 msec mỗi cylinder × 61 cylinder = 366 ms" (một câu đĩa thật của FE1); lẫn ms với µs là cách mất điểm thường gặp.</p>`],
      [47, 'End',
        `<p class="y-chinh">🎯 End of Chapter 1 — you now have the map: what an OS is, the hardware it manages, its key concepts, the system-call door into it, and the ways it can be built.</p>
<p>Check yourself before moving on: can you draw where the OS sits (slide 3), name the five generations (slide 6), explain an interrupt (slides 17–18), define a process and a file (slides 21–25), walk through the 11 steps of a system call (slide 27), and compare monolithic and microkernel (slides 38–41)? Then do the 🧪 practice lesson 1.C and the Chapter 1 quiz.</p>
<p class="meo">🧠 Next: Chapter 2 opens slide 21's "process" into scheduling, threads and synchronization — the race condition from "Start here" is waiting there.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 1 — giờ bạn đã có tấm bản đồ: HĐH là gì, phần cứng nó quản lý, các khái niệm chính, cánh cửa lời gọi hệ thống để vào nó, và các cách xây nó.</p>
<p>Tự kiểm trước khi đi tiếp: bạn có vẽ được HĐH nằm ở đâu (slide 3), kể được năm thế hệ (slide 6), giải thích được một lần ngắt (slide 17–18), định nghĩa được tiến trình và tệp (slide 21–25), đi qua được 11 bước của một lời gọi hệ thống (slide 27), và so sánh được nguyên khối với vi nhân (slide 38–41) chưa? Rồi làm bài 🧪 thực hành 1.C và quiz Chương 1.</p>
<p class="meo">🧠 Tiếp theo: Chương 2 mở "tiến trình" của slide 21 thành lập lịch, luồng và đồng bộ — tình trạng tranh chấp ở bài "Bắt đầu tại đây" đang chờ bạn ở đó.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 1, sections 1.6–1.11 (pp. 50–86): Figures 1-17 to 1-31', 'Chương 1, mục 1.6–1.11 (tr. 50–86): Hình 1-17 tới 1-31'],
      ['man7', 'syscalls(2), syscall(2), fork(2), execve(2), wait4(2), open(2), lseek(2), stat(2), link(2), mount(2), kill(2), vdso(7)', 'syscalls(2), syscall(2), fork(2), execve(2), wait4(2), open(2), lseek(2), stat(2), link(2), mount(2), kill(2), vdso(7)'],
      ['posix', 'the POSIX definitions of fork, execve, waitpid, open, read, write, lseek, stat, link, unlink, chdir, chmod, kill, time', 'định nghĩa POSIX của fork, execve, waitpid, open, read, write, lseek, stat, link, unlink, chdir, chmod, kill, time'],
      ['win32', 'CreateProcess, CreateHardLink, CreateSymbolicLink, TerminateProcess', 'CreateProcess, CreateHardLink, CreateSymbolicLink, TerminateProcess'],
      ['ostep', 'Chapter 5 "Interlude: Process API" (fork, exec, wait) and Chapter 6 "Mechanism: Limited Direct Execution" (traps, user and kernel mode)', 'Chương 5 "Interlude: Process API" (fork, exec, wait) và Chương 6 "Mechanism: Limited Direct Execution" (bẫy, chế độ người dùng và nhân)'],
    ]),
  ].join('\n'),
};

/* ───────── 1.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 1: kernel mode, system calls, fork, files, calculations ───────── */
const L_on_ch1 = {
  title: '1.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 1: kernel mode, system calls, fork, files, calculations|||1.C — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 1: chế độ nhân, lời gọi hệ thống, fork, tệp, bài tính',
  slug: 'osg202-on-ch1',
  type: 'VIDEO',
  description: '7 bài tập Chương 1 có lời giải chạy thật trên Linux: phân loại lệnh nào chỉ chạy được ở chế độ nhân và thử đọc bộ nhớ của nhân, phân biệt lời gọi thư viện và lời gọi hệ thống bằng strace, ba câu đếm tiến trình sau fork kiểu đề thi, chương trình chép tệp chỉ dùng open/read/write/close, thêm lệnh cd dựng sẵn vào shell rút gọn, các phép tính của chương (hiệu suất CPU 1 − pⁿ, thời gian truy cập trung bình, độ trễ quay của đĩa) và tra hỏi tiến trình qua /proc; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.C · Practice &amp; review</span>
<h2>Seven exercises: the ideas of Chapter 1, done with your own hands</h2>
<p class="lead">Chapter 1 is mostly concepts, and the FE tests them with definitions — but every concept here can be <em>run</em>. Try each exercise first (the time is a target), then open the solution: every program was compiled and run in the course's Linux container, and the outputs are real. Exercises 3 and 6 are exactly the kind of calculation the FE asks.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>which actions need kernel mode; what happens when a user program tries</td><td>1.A slides 3, 11</td></tr>
<tr><td>2</td><td>library call or system call — measured with strace</td><td>1.B slides 27, 29</td></tr>
<tr><td>3</td><td>counting processes after fork (exam classic)</td><td>1.B slides 28, 32</td></tr>
<tr><td>4</td><td>a file copier made of open/read/write/close</td><td>1.B slide 29</td></tr>
<tr><td>5</td><td>why <code>cd</code> must be built into the shell</td><td>1.B slide 32</td></tr>
<tr><td>6</td><td>the chapter's calculations: 1 − pⁿ, average access time, disk rotation</td><td>1.A slides 10, 14, 16</td></tr>
<tr><td>7</td><td>reading a process's state through /proc</td><td>1.A slide 21</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.C · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: các ý của Chương 1, làm bằng chính tay bạn</h2>
<p class="lead">Chương 1 chủ yếu là khái niệm, và FE thi chúng bằng câu định nghĩa — nhưng khái niệm nào ở đây cũng <em>chạy</em> được. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải: chương trình nào cũng đã được biên dịch và chạy trong container Linux của môn, output là thật. Bài 3 và bài 6 đúng là dạng tính toán FE hỏi.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>thao tác nào cần chế độ nhân; chương trình người dùng cố làm thì sao</td><td>1.A slide 3, 11</td></tr>
<tr><td>2</td><td>lời gọi thư viện hay lời gọi hệ thống — đo bằng strace</td><td>1.B slide 27, 29</td></tr>
<tr><td>3</td><td>đếm tiến trình sau fork (câu thi kinh điển)</td><td>1.B slide 28, 32</td></tr>
<tr><td>4</td><td>chương trình chép tệp ghép từ open/read/write/close</td><td>1.B slide 29</td></tr>
<tr><td>5</td><td>vì sao <code>cd</code> phải dựng sẵn trong shell</td><td>1.B slide 32</td></tr>
<tr><td>6</td><td>các phép tính của chương: 1 − pⁿ, thời gian truy cập trung bình, đĩa quay</td><td>1.A slide 10, 14, 16</td></tr>
<tr><td>7</td><td>đọc trạng thái tiến trình qua /proc</td><td>1.A slide 21</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — kernel mode or user mode? (10 min)</h3>
<p>For each action, decide whether a user program may do it directly or whether it needs kernel mode: (a) add two registers, (b) turn interrupts off, (c) call <code>printf</code>, (d) change the page table base register, (e) read a word at a kernel address, (f) execute <code>svc #0</code> / <code>syscall</code>, (g) halt the CPU, (h) read the time of day.</p>
<details><summary>Solution — with a real attempt at (e)</summary>
<table>
<thead><tr><th>Action</th><th>Allowed in user mode?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>(a) add two registers</td><td>yes</td><td>ordinary instruction</td></tr>
<tr><td>(b) disable interrupts</td><td>no — privileged</td><td>a program could keep the CPU forever (slide 3 showed SIGILL)</td></tr>
<tr><td>(c) printf</td><td>yes</td><td>library code; it later asks the kernel via write</td></tr>
<tr><td>(d) change the page table base</td><td>no — privileged</td><td>would let a program map any memory (Chapter 3)</td></tr>
<tr><td>(e) read a kernel address</td><td>no — the MMU refuses</td><td>memory of the kernel is marked "kernel only"</td></tr>
<tr><td>(f) svc #0 / syscall</td><td>yes — that is its purpose</td><td>the one controlled way INTO kernel mode</td></tr>
<tr><td>(g) halt the CPU</td><td>no — privileged</td><td>would stop every other program</td></tr>
<tr><td>(h) time of day</td><td>yes</td><td>through a system call or the vDSO (slide 31)</td></tr>
</tbody>
</table>
<pre><code class="language-c">// Exercise 1: a user program tries to READ the kernel's half of the address space
#include &lt;stdio.h&gt;

int main(void) {
#if defined(__aarch64__)
    volatile long *kernel = (long *)0xffff800000000000UL;   // ARM64 Linux: kernel addresses start here
#else
    volatile long *kernel = (long *)0xffff888000000000UL;   // x86-64 Linux: the kernel's direct map
#endif
    printf("user mode: reading %p ...\\n", (void *)kernel);
    fflush(stdout);
    long x = *kernel;                       // the MMU checks the "user may access" bit: no
    printf("read %ld\\n", x);                // never reached
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread doc-bo-nho-nhan.c -o doc-bo-nho-nhan &amp;&amp; ./doc-bo-nho-nhan<br>
user mode: reading 0xffff800000000000 ...<br>
Segmentation fault<br>
[exit code 139]</div>
<p>Reading the kernel's half of the address space from user mode ends with a segmentation fault (signal 11, exit code 128 + 11 = 139). Protection here comes from the MMU's page permissions, not from a privileged instruction — two different hardware mechanisms that both depend on the mode bit.</p>
</details>`,
    `<h3>🧪 Bài 1 — chế độ nhân hay chế độ người dùng? (10 phút)</h3>
<p>Với mỗi thao tác, quyết định chương trình người dùng được làm trực tiếp hay phải có chế độ nhân: (a) cộng hai thanh ghi, (b) tắt ngắt, (c) gọi <code>printf</code>, (d) đổi thanh ghi địa chỉ gốc của bảng trang, (e) đọc một từ ở địa chỉ của nhân, (f) thi hành <code>svc #0</code> / <code>syscall</code>, (g) dừng CPU, (h) đọc giờ hiện tại.</p>
<details><summary>Lời giải — kèm một lần thử thật câu (e)</summary>
<table>
<thead><tr><th>Thao tác</th><th>Chế độ người dùng làm được?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>(a) cộng hai thanh ghi</td><td>được</td><td>lệnh bình thường</td></tr>
<tr><td>(b) tắt ngắt</td><td>không — lệnh đặc quyền</td><td>chương trình có thể giữ CPU mãi mãi (slide 3 cho thấy SIGILL)</td></tr>
<tr><td>(c) printf</td><td>được</td><td>mã thư viện; về sau nó nhờ nhân qua write</td></tr>
<tr><td>(d) đổi gốc bảng trang</td><td>không — lệnh đặc quyền</td><td>sẽ cho chương trình ánh xạ bất kỳ vùng nhớ nào (Chương 3)</td></tr>
<tr><td>(e) đọc địa chỉ của nhân</td><td>không — MMU từ chối</td><td>bộ nhớ của nhân được đánh dấu "chỉ nhân"</td></tr>
<tr><td>(f) svc #0 / syscall</td><td>được — đó chính là công dụng của nó</td><td>cách DUY NHẤT có kiểm soát để VÀO chế độ nhân</td></tr>
<tr><td>(g) dừng CPU</td><td>không — lệnh đặc quyền</td><td>sẽ làm dừng mọi chương trình khác</td></tr>
<tr><td>(h) giờ hiện tại</td><td>được</td><td>qua lời gọi hệ thống hoặc vDSO (slide 31)</td></tr>
</tbody>
</table>
<pre><code class="language-c">// Bài 1: chương trình người dùng thử ĐỌC nửa không gian địa chỉ của nhân
#include &lt;stdio.h&gt;

int main(void) {
#if defined(__aarch64__)
    volatile long *kernel = (long *)0xffff800000000000UL;   // ARM64 Linux: địa chỉ của nhân bắt đầu từ đây
#else
    volatile long *kernel = (long *)0xffff888000000000UL;   // x86-64 Linux: vùng ánh xạ trực tiếp của nhân
#endif
    printf("user mode: reading %p ...\\n", (void *)kernel);
    fflush(stdout);
    long x = *kernel;                       // MMU kiểm bit "người dùng được truy cập": không
    printf("read %ld\\n", x);                // không bao giờ tới
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread doc-bo-nho-nhan.c -o doc-bo-nho-nhan &amp;&amp; ./doc-bo-nho-nhan<br>
user mode: reading 0xffff800000000000 ...<br>
Segmentation fault<br>
[exit code 139]</div>
<p>Đọc nửa không gian địa chỉ của nhân từ chế độ người dùng kết thúc bằng segmentation fault (tín hiệu 11, mã thoát 128 + 11 = 139). Sự bảo vệ ở đây đến từ quyền trên các trang của MMU, không phải từ lệnh đặc quyền — hai cơ chế phần cứng khác nhau, cùng dựa vào bit chế độ.</p>
</details>`),
    bi(`<h3>🧪 Exercise 2 — library call or system call? (15 min)</h3>
<p>A program calls <code>getpid()</code> once (as a marker), then <code>strlen</code> 1000 times, <code>malloc</code> one large block (1 MB), then <code>printf</code> 1000 lines to a file. Predict how many system calls each part causes, then check with <code>strace</code>.</p>
<details><summary>Solution — counted by strace (only calls after the marker)</summary>
<pre><code class="language-c">// Exercise 2: which of these C calls cause a system call?
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    getpid();                                  // marker: everything before this is program start-up
    size_t n = 0;
    for (int i = 0; i &lt; 1000; i++) n += strlen("operating system");   // 1000 x strlen
    char *p = malloc(100000 * 10);             // a large block: comes from the kernel
    p[0] = 'x';
    for (int i = 0; i &lt; 1000; i++) printf("%zu\\n", n);                 // 1000 x printf, output to a file
    free(p);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thu-vien-hay-he-thong.c -o thu-vien-hay-he-thong &amp;&amp; strace -o /tmp/vet ./thu-vien-hay-he-thong &gt; /dev/null; sed -n '/^getpid/,$p' /tmp/vet | sed 's/(.*//' | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 +++ exited with 0 +++<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 brk<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 exit_group<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 getpid<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 getrandom<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ioctl<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 mmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 munmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 newfstatat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 write</div>
<ul>
<li><strong>strlen × 1000 → 0 system calls.</strong> It only reads the program's own memory: pure library code in user mode.</li>
<li><strong>malloc(1 MB) → one <code>mmap</code>.</strong> Large blocks are requested from the kernel directly; small ones are cut from memory the library already has (the <code>brk</code> lines grow the heap for stdio's buffer). <code>getrandom</code> seeds the allocator once.</li>
<li><strong>printf × 1000 → only 2 <code>write</code>.</strong> Output to a file is buffered: the library collects about 4 KB, then makes one system call. The <code>newfstatat</code> and <code>ioctl</code> are stdio asking "is stdout a terminal?" to choose its buffering.</li>
</ul>
<p class="meo">🧠 Library calls are cheap (a function call); system calls cost a trap. Good libraries batch work into few system calls — that is why buffering exists.</p>
</details>`,
    `<h3>🧪 Bài 2 — lời gọi thư viện hay lời gọi hệ thống? (15 phút)</h3>
<p>Một chương trình gọi <code>getpid()</code> một lần (làm mốc), rồi gọi <code>strlen</code> 1000 lần, <code>malloc</code> một khối lớn (1 MB), rồi <code>printf</code> 1000 dòng vào một tệp. Đoán mỗi phần gây ra bao nhiêu lời gọi hệ thống, rồi kiểm bằng <code>strace</code>.</p>
<details><summary>Lời giải — strace đếm (chỉ các lời gọi sau mốc)</summary>
<pre><code class="language-c">// Bài 2: lời gọi C nào gây ra lời gọi hệ thống?
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    getpid();                                  // mốc: mọi thứ trước nó là khởi động chương trình
    size_t n = 0;
    for (int i = 0; i &lt; 1000; i++) n += strlen("operating system");   // 1000 lần strlen
    char *p = malloc(100000 * 10);             // khối lớn: phải xin nhân
    p[0] = 'x';
    for (int i = 0; i &lt; 1000; i++) printf("%zu\\n", n);                 // 1000 lần printf, output vào tệp
    free(p);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thu-vien-hay-he-thong.c -o thu-vien-hay-he-thong &amp;&amp; strace -o /tmp/vet ./thu-vien-hay-he-thong &gt; /dev/null; sed -n '/^getpid/,$p' /tmp/vet | sed 's/(.*//' | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 +++ exited with 0 +++<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 brk<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 exit_group<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 getpid<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 getrandom<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ioctl<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 mmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 munmap<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 newfstatat<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 write</div>
<ul>
<li><strong>strlen × 1000 → 0 lời gọi hệ thống.</strong> Nó chỉ đọc bộ nhớ của chính chương trình: thuần mã thư viện ở chế độ người dùng.</li>
<li><strong>malloc(1 MB) → một <code>mmap</code>.</strong> Khối lớn được xin thẳng từ nhân; khối nhỏ được cắt ra từ vùng nhớ thư viện đã có (các dòng <code>brk</code> nới heap cho bộ đệm của stdio). <code>getrandom</code> gieo hạt cho bộ cấp phát một lần.</li>
<li><strong>printf × 1000 → chỉ 2 <code>write</code>.</strong> Output vào tệp được đệm: thư viện gom khoảng 4 KB rồi mới gọi hệ thống một lần. <code>newfstatat</code> và <code>ioctl</code> là stdio hỏi "stdout có phải terminal không?" để chọn cách đệm.</li>
</ul>
<p class="meo">🧠 Lời gọi thư viện rẻ (một lời gọi hàm); lời gọi hệ thống tốn một lần bẫy. Thư viện tốt gom việc lại thành ít lời gọi hệ thống — đó là lý do có bộ đệm.</p>
</details>`),
    bi(`<h3>🧪 Exercise 3 — how many processes? (15 min)</h3>
<p>Each program prints one line per process. How many lines? (A) <code>for (i = 0; i &lt; 3; i++) fork();</code> (B) <code>fork(); if (fork() == 0) fork();</code> (C) <code>if (fork() &amp;&amp; fork()) fork();</code></p>
<details><summary>Solution — run for real, counted with wc -l</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 3: how many processes print? (each process prints one line; wc -l counts them)<br>
$ cat &gt; a.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(void) { for (int i = 0; i &lt; 3; i++) fork(); printf("x\\n"); while (wait(NULL) &gt; 0); return 0; }<br>
&gt; END<br>
$ gcc a.c -o a &amp;&amp; ./a | wc -l<br>
8<br>
$ cat &gt; b.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(void) { fork(); if (fork() == 0) fork(); printf("x\\n"); while (wait(NULL) &gt; 0); return 0; }<br>
&gt; END<br>
$ gcc b.c -o b &amp;&amp; ./b | wc -l<br>
6<br>
$ cat &gt; c.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(void) { if (fork() &amp;&amp; fork()) fork(); printf("x\\n"); while (wait(NULL) &gt; 0); return 0; }<br>
&gt; END<br>
$ gcc c.c -o c &amp;&amp; ./c | wc -l<br>
4</div>
<ul>
<li><strong>A = 8</strong>: every process alive at each turn forks, so the count doubles three times: 2³.</li>
<li><strong>B = 6</strong>: after the first fork there are 2 processes; each forks once more (4); in each pair, only the child (where <code>fork()</code> returned 0) forks again: 4 + 2 = 6.</li>
<li><strong>C = 4</strong>: <code>&amp;&amp;</code> stops at the first false value. Only the original process gets true (a PID) from both calls, so only it reaches the third fork: the original + 3 children.</li>
</ul>
<p class="pitfall">⚠️ Draw the tree, never guess: write each process's return values of fork (0 or PID) next to it. Short-circuit operators (<code>&amp;&amp;</code>, <code>||</code>) are the usual trick in exam versions.</p>
</details>`,
    `<h3>🧪 Bài 3 — bao nhiêu tiến trình? (15 phút)</h3>
<p>Mỗi chương trình in một dòng cho mỗi tiến trình. Bao nhiêu dòng? (A) <code>for (i = 0; i &lt; 3; i++) fork();</code> (B) <code>fork(); if (fork() == 0) fork();</code> (C) <code>if (fork() &amp;&amp; fork()) fork();</code></p>
<details><summary>Lời giải — chạy thật, đếm bằng wc -l</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 3: bao nhiêu tiến trình in? (mỗi tiến trình in một dòng; wc -l đếm)<br>
$ cat &gt; a.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(void) { for (int i = 0; i &lt; 3; i++) fork(); printf("x\\n"); while (wait(NULL) &gt; 0); return 0; }<br>
&gt; END<br>
$ gcc a.c -o a &amp;&amp; ./a | wc -l<br>
8<br>
$ cat &gt; b.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(void) { fork(); if (fork() == 0) fork(); printf("x\\n"); while (wait(NULL) &gt; 0); return 0; }<br>
&gt; END<br>
$ gcc b.c -o b &amp;&amp; ./b | wc -l<br>
6<br>
$ cat &gt; c.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; #include &lt;sys/wait.h&gt;<br>
&gt; int main(void) { if (fork() &amp;&amp; fork()) fork(); printf("x\\n"); while (wait(NULL) &gt; 0); return 0; }<br>
&gt; END<br>
$ gcc c.c -o c &amp;&amp; ./c | wc -l<br>
4</div>
<ul>
<li><strong>A = 8</strong>: mỗi vòng, mọi tiến trình đang sống đều fork, nên số lượng nhân đôi ba lần: 2³.</li>
<li><strong>B = 6</strong>: sau lần fork đầu có 2 tiến trình; mỗi cái fork thêm một lần (4); trong mỗi cặp, chỉ tiến trình con (nơi <code>fork()</code> trả 0) fork tiếp: 4 + 2 = 6.</li>
<li><strong>C = 4</strong>: <code>&amp;&amp;</code> dừng ngay ở giá trị sai đầu tiên. Chỉ tiến trình gốc nhận giá trị đúng (một PID) ở cả hai lời gọi, nên chỉ nó tới được lần fork thứ ba: tiến trình gốc + 3 con.</li>
</ul>
<p class="pitfall">⚠️ Vẽ cây, đừng đoán: ghi giá trị trả về của fork (0 hay PID) cạnh từng tiến trình. Toán tử ngắn mạch (<code>&amp;&amp;</code>, <code>||</code>) là mẹo quen thuộc trong các biến thể đề thi.</p>
</details>`),
    bi(`<h3>🧪 Exercise 4 — a file copier from four system calls (20 min)</h3>
<p>Write <code>copy(from, to)</code> using only <code>open</code>, <code>read</code>, <code>write</code> and <code>close</code> with a 4 KB buffer; return the number of bytes copied or a negative error code. Test it on a 10,000-byte file and on a missing file.</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 4: a file copier made only of system calls: open, read, write, close
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

#define BUF_SIZE 4096                          // read 4 KB per system call

int copy(const char *from, const char *to, int *calls) {
    int in = open(from, O_RDONLY);
    if (in &lt; 0) return -1;
    int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out &lt; 0) { close(in); return -2; }
    char buf[BUF_SIZE];
    ssize_t n;
    int total = 0;
    while ((n = read(in, buf, BUF_SIZE)) &gt; 0) {  // 0 = end of file, -1 = error
        (*calls)++;
        if (write(out, buf, n) != n) { total = -3; break; }
        total += n;
    }
    close(in); close(out);
    return n &lt; 0 ? -4 : total;
}

int main(void) {
    int f = open("/tmp/nguon.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);   // make a 10,000-byte source file
    for (int i = 0; i &lt; 1000; i++) write(f, "0123456789", 10);
    close(f);
    int calls = 0;
    int bytes = copy("/tmp/nguon.txt", "/tmp/dich.txt", &amp;calls);
    printf("copied %d bytes with %d read() calls of up to %d bytes\\n", bytes, calls, BUF_SIZE);
    int miss = 0;
    printf("copy of a missing file returns %d\\n", copy("/tmp/khong-co.txt", "/tmp/x", &amp;miss));
    fflush(stdout);                                   // flush before system() starts another process
    return system("cmp /tmp/nguon.txt /tmp/dich.txt &amp;&amp; echo identical");
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sao-chep.c -o sao-chep &amp;&amp; ./sao-chep<br>
copied 10000 bytes with 3 read() calls of up to 4096 bytes<br>
copy of a missing file returns -1<br>
identical</div>
<p>10,000 bytes need 3 reads of up to 4,096 bytes (4,096 + 4,096 + 1,808); a fourth <code>read</code> returns 0 = end of file and ends the loop. Opening a missing file returns −1, so <code>copy</code> reports −1. This is almost exactly the copy program of Tanenbaum's Chapter 4 (Figure 4-5, slides 10–12 of the Chapter 4 deck) — and what <code>cp</code> does at heart.</p>
<p class="meo">🧠 The loop pattern <code>while ((n = read(...)) &gt; 0) write(..., n)</code> is worth memorising: it works for files, pipes and sockets alike (slide 4's abstraction).</p>
</details>`,
    `<h3>🧪 Bài 4 — chương trình chép tệp từ bốn lời gọi hệ thống (20 phút)</h3>
<p>Viết <code>copy(from, to)</code> chỉ dùng <code>open</code>, <code>read</code>, <code>write</code> và <code>close</code> với bộ đệm 4 KB; trả về số byte đã chép hoặc một mã lỗi âm. Thử với một tệp 10.000 byte và với một tệp không tồn tại.</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 4: chương trình chép tệp chỉ dùng lời gọi hệ thống: open, read, write, close
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

#define BUF_SIZE 4096                          // mỗi lời gọi hệ thống đọc 4 KB

int copy(const char *from, const char *to, int *calls) {
    int in = open(from, O_RDONLY);
    if (in &lt; 0) return -1;
    int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out &lt; 0) { close(in); return -2; }
    char buf[BUF_SIZE];
    ssize_t n;
    int total = 0;
    while ((n = read(in, buf, BUF_SIZE)) &gt; 0) {  // 0 = hết tệp, -1 = lỗi
        (*calls)++;
        if (write(out, buf, n) != n) { total = -3; break; }
        total += n;
    }
    close(in); close(out);
    return n &lt; 0 ? -4 : total;
}

int main(void) {
    int f = open("/tmp/nguon.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);   // tạo tệp nguồn 10.000 byte
    for (int i = 0; i &lt; 1000; i++) write(f, "0123456789", 10);
    close(f);
    int calls = 0;
    int bytes = copy("/tmp/nguon.txt", "/tmp/dich.txt", &amp;calls);
    printf("copied %d bytes with %d read() calls of up to %d bytes\\n", bytes, calls, BUF_SIZE);
    int miss = 0;
    printf("copy of a missing file returns %d\\n", copy("/tmp/khong-co.txt", "/tmp/x", &amp;miss));
    fflush(stdout);                                   // xả trước khi system() khởi chạy tiến trình khác
    return system("cmp /tmp/nguon.txt /tmp/dich.txt &amp;&amp; echo identical");
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread sao-chep.c -o sao-chep &amp;&amp; ./sao-chep<br>
copied 10000 bytes with 3 read() calls of up to 4096 bytes<br>
copy of a missing file returns -1<br>
identical</div>
<p>10.000 byte cần 3 lần read, mỗi lần tối đa 4.096 byte (4.096 + 4.096 + 1.808); lần <code>read</code> thứ tư trả 0 = hết tệp và kết thúc vòng lặp. Mở một tệp không tồn tại trả −1, nên <code>copy</code> báo −1. Đây gần như đúng chương trình chép tệp ở Chương 4 của Tanenbaum (Hình 4-5, slide 10–12 của deck Chương 4) — và là ruột của lệnh <code>cp</code>.</p>
<p class="meo">🧠 Khuôn vòng lặp <code>while ((n = read(...)) &gt; 0) write(..., n)</code> đáng thuộc lòng: nó dùng được cho tệp, pipe lẫn socket (chính trừu tượng của slide 4).</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — add a built-in <code>cd</code> to the stripped-down shell (20 min)</h3>
<p>Start from the shell of slide 32. Add <code>cd</code> so that it changes the shell's working directory, and show the prompt with the current directory. Then explain why a <code>cd</code> executed by a child process (the test command <code>childcd</code>) changes nothing for the shell.</p>
<details><summary>Solution — run for real (commands read from a file)</summary>
<pre><code class="language-c">// Exercise 5: the stripped-down shell + a built-in "cd" (a child cannot change its parent's directory)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    char line[256], cwd[256];
    for (;;) {
        printf("%s$ ", getcwd(cwd, sizeof cwd));
        fflush(stdout);
        if (!fgets(line, sizeof line, stdin)) break;
        line[strcspn(line, "\\n")] = 0;
        printf("%s\\n", line);
        fflush(stdout);
        char *argv[16]; int argc = 0;
        for (char *t = strtok(line, " "); t &amp;&amp; argc &lt; 15; t = strtok(NULL, " ")) argv[argc++] = t;
        argv[argc] = NULL;
        if (argc == 0) continue;
        if (strcmp(argv[0], "exit") == 0) break;
        if (strcmp(argv[0], "cd") == 0) {          // built-in: run INSIDE the shell process
            if (chdir(argc &gt; 1 ? argv[1] : "/") != 0) perror("cd");
            continue;
        }
        if (fork() == 0) {                          // external command: in a child
            if (strcmp(argv[0], "childcd") == 0) {  // a "cd" done by a child: changes only the child
                chdir("/tmp");
                printf("child moved to /tmp, then exits\\n");
                return 0;
            }
            execvp(argv[0], argv);
            printf("%s: command not found\\n", argv[0]);
            return 127;
        }
        wait(NULL);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread shell-cd.c -o shell-cd &amp;&amp; ./shell-cd &lt; shell-cd.in<br>
/w$ pwd<br>
/w<br>
/w$ cd /usr/share<br>
/usr/share$ pwd<br>
/usr/share<br>
/usr/share$ childcd<br>
child moved to /tmp, then exits<br>
/usr/share$ pwd<br>
/usr/share<br>
/usr/share$ cd /nope<br>
cd: No such file or directory<br>
/usr/share$ exit</div>
<p>The built-in <code>cd</code> calls <code>chdir</code> inside the shell process, so the next prompt shows <code>/usr/share</code>. <code>childcd</code> moved only the child, which then exited: the working directory is a property of each process, copied at fork, never sent back to the parent. That is why <code>cd</code>, <code>exit</code>, <code>export</code> are built into every real shell.</p>
</details>`,
    `<h3>🧪 Bài 5 — thêm lệnh <code>cd</code> dựng sẵn vào shell rút gọn (20 phút)</h3>
<p>Bắt đầu từ shell của slide 32. Thêm <code>cd</code> để nó đổi thư mục làm việc của shell, và in dấu nhắc kèm thư mục hiện tại. Rồi giải thích vì sao một lệnh <code>cd</code> do tiến trình con thực hiện (lệnh thử <code>childcd</code>) không đổi được gì cho shell.</p>
<details><summary>Lời giải — chạy thật (lệnh đọc từ tệp)</summary>
<pre><code class="language-c">// Bài 5: shell rút gọn + lệnh dựng sẵn "cd" (con không đổi được thư mục của cha)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

int main(void) {
    char line[256], cwd[256];
    for (;;) {
        printf("%s$ ", getcwd(cwd, sizeof cwd));
        fflush(stdout);
        if (!fgets(line, sizeof line, stdin)) break;
        line[strcspn(line, "\\n")] = 0;
        printf("%s\\n", line);
        fflush(stdout);
        char *argv[16]; int argc = 0;
        for (char *t = strtok(line, " "); t &amp;&amp; argc &lt; 15; t = strtok(NULL, " ")) argv[argc++] = t;
        argv[argc] = NULL;
        if (argc == 0) continue;
        if (strcmp(argv[0], "exit") == 0) break;
        if (strcmp(argv[0], "cd") == 0) {          // lệnh dựng sẵn: chạy NGAY trong tiến trình shell
            if (chdir(argc &gt; 1 ? argv[1] : "/") != 0) perror("cd");
            continue;
        }
        if (fork() == 0) {                          // lệnh ngoài: chạy trong tiến trình con
            if (strcmp(argv[0], "childcd") == 0) {  // "cd" do con làm: chỉ đổi thư mục của con
                chdir("/tmp");
                printf("child moved to /tmp, then exits\\n");
                return 0;
            }
            execvp(argv[0], argv);
            printf("%s: command not found\\n", argv[0]);
            return 127;
        }
        wait(NULL);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread shell-cd.c -o shell-cd &amp;&amp; ./shell-cd &lt; shell-cd.in<br>
/w$ pwd<br>
/w<br>
/w$ cd /usr/share<br>
/usr/share$ pwd<br>
/usr/share<br>
/usr/share$ childcd<br>
child moved to /tmp, then exits<br>
/usr/share$ pwd<br>
/usr/share<br>
/usr/share$ cd /nope<br>
cd: No such file or directory<br>
/usr/share$ exit</div>
<p><code>cd</code> dựng sẵn gọi <code>chdir</code> ngay trong tiến trình shell, nên dấu nhắc kế tiếp hiện <code>/usr/share</code>. <code>childcd</code> chỉ dời được tiến trình con, rồi con thoát: thư mục làm việc là thuộc tính riêng của mỗi tiến trình, được chép lúc fork, không bao giờ gửi ngược về cha. Vì thế <code>cd</code>, <code>exit</code>, <code>export</code> được dựng sẵn trong mọi shell thật.</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — the chapter's calculations (15 min)</h3>
<p>(a) Processes wait for I/O 80% of the time. CPU utilization with 1, 2, 4, 8 processes in memory? How many processes are needed for at least 90%? (b) A cache answers in 2 ns, memory in 10 ns. Average access time for hit ratios 0.95 and 0.99? (c) A 7,200 rpm disk, 4 ms average seek, 500 sectors per track: time to read one random sector?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Exercise 6: Chapter 1 calculations, done by a program (check your hand calculation here)
const f = (x, d = 2) =&gt; Number(x.toFixed(d));

// (a) multiprogramming: CPU utilization = 1 - p^n
const p = 0.8;
for (const n of [1, 2, 4, 8]) console.log(&#96;p = &#36;{p}, n = &#36;{n}: utilization = &#36;{f(100 * (1 - p ** n), 1)}%&#96;);
const nMin = Math.ceil(Math.log(1 - 0.9) / Math.log(p));       // smallest n with 1 - p^n &gt;= 90%
console.log(&#96;to reach 90% with p = &#36;{p} you need n = &#36;{nMin} processes (n = &#36;{nMin - 1} gives &#36;{f(100 * (1 - p ** (nMin - 1)), 1)}%)&#96;);

// (b) memory hierarchy: average access time, cache 2 ns, memory 10 ns
const tc = 2, tm = 10;
for (const h of [0.95, 0.99]) {
  console.log(&#96;hit ratio &#36;{h}: &#36;{f(h * tc + (1 - h) * (tc + tm))} ns (miss = check cache, then memory) or &#36;{f(h * tc + (1 - h) * tm)} ns (miss = memory only)&#96;);
}

// (c) disk: 7200 rpm, 4 ms average seek, 512-byte sectors, 500 sectors per track
const turn = 60000 / 7200;
const transfer = turn / 500;                                    // one sector passes the head
console.log(&#96;one turn &#36;{f(turn, 3)} ms, avg rotational delay &#36;{f(turn / 2, 3)} ms, one-sector transfer &#36;{f(transfer, 4)} ms&#96;);
console.log(&#96;read one random sector: &#36;{f(4 + turn / 2 + transfer, 3)} ms&#96;);</code></pre>
<div class="out">$ node tinh-toan.js<br>
p = 0.8, n = 1: utilization = 20%<br>
p = 0.8, n = 2: utilization = 36%<br>
p = 0.8, n = 4: utilization = 59%<br>
p = 0.8, n = 8: utilization = 83.2%<br>
to reach 90% with p = 0.8 you need n = 11 processes (n = 10 gives 89.3%)<br>
hit ratio 0.95: 2.5 ns (miss = check cache, then memory) or 2.4 ns (miss = memory only)<br>
hit ratio 0.99: 2.1 ns (miss = check cache, then memory) or 2.08 ns (miss = memory only)<br>
one turn 8.333 ms, avg rotational delay 4.167 ms, one-sector transfer 0.0167 ms<br>
read one random sector: 8.183 ms</div>
<ul>
<li>(a) utilization = 1 − 0.8ⁿ: 20%, 36%, 59%, 83.2%; 0.8¹⁰ = 0.107 is still above 0.1, so <strong>n = 11</strong>. (The graph is in lesson 1.A, slide 10.) ⚠️ In a real system adding processes eventually <em>lowers</em> utilization — memory runs out and the system thrashes (Chapter 3); FE1 asked this: "increase first, then decrease".</li>
<li>(b) two conventions exist: if a miss costs cache + memory, 0.95 × 2 + 0.05 × 12 = 2.5 ns; if a miss costs memory only, 0.95 × 2 + 0.05 × 10 = 2.4 ns. State which one you use.</li>
<li>(c) one turn = 60,000/7,200 = 8.333 ms, half a turn on average = 4.167 ms, one sector = 8.333/500 ms; total ≈ 4 + 4.167 + 0.017 = 8.18 ms — seek and rotation dominate, the transfer is negligible.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — các phép tính của chương (15 phút)</h3>
<p>(a) Các tiến trình chờ I/O 80% thời gian. Hiệu suất CPU khi có 1, 2, 4, 8 tiến trình trong bộ nhớ? Cần bao nhiêu tiến trình để đạt ít nhất 90%? (b) Cache trả lời trong 2 ns, bộ nhớ trong 10 ns. Thời gian truy cập trung bình với tỉ lệ trúng 0,95 và 0,99? (c) Đĩa 7.200 vòng/phút, seek trung bình 4 ms, 500 sector mỗi rãnh: thời gian đọc một sector ngẫu nhiên?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Bài 6: các phép tính Chương 1, để chương trình làm (đối chiếu kết quả tính tay ở đây)
const f = (x, d = 2) =&gt; Number(x.toFixed(d));

// (a) đa chương trình: hiệu suất CPU = 1 - p^n
const p = 0.8;
for (const n of [1, 2, 4, 8]) console.log(&#96;p = &#36;{p}, n = &#36;{n}: utilization = &#36;{f(100 * (1 - p ** n), 1)}%&#96;);
const nMin = Math.ceil(Math.log(1 - 0.9) / Math.log(p));       // n nhỏ nhất để 1 - p^n &gt;= 90%
console.log(&#96;to reach 90% with p = &#36;{p} you need n = &#36;{nMin} processes (n = &#36;{nMin - 1} gives &#36;{f(100 * (1 - p ** (nMin - 1)), 1)}%)&#96;);

// (b) phân cấp bộ nhớ: thời gian truy cập trung bình, cache 2 ns, bộ nhớ 10 ns
const tc = 2, tm = 10;
for (const h of [0.95, 0.99]) {
  console.log(&#96;hit ratio &#36;{h}: &#36;{f(h * tc + (1 - h) * (tc + tm))} ns (miss = check cache, then memory) or &#36;{f(h * tc + (1 - h) * tm)} ns (miss = memory only)&#96;);
}

// (c) đĩa: 7200 vòng/phút, seek trung bình 4 ms, sector 512 byte, 500 sector mỗi rãnh
const turn = 60000 / 7200;
const transfer = turn / 500;                                    // một sector đi qua đầu đọc
console.log(&#96;one turn &#36;{f(turn, 3)} ms, avg rotational delay &#36;{f(turn / 2, 3)} ms, one-sector transfer &#36;{f(transfer, 4)} ms&#96;);
console.log(&#96;read one random sector: &#36;{f(4 + turn / 2 + transfer, 3)} ms&#96;);</code></pre>
<div class="out">$ node tinh-toan.js<br>
p = 0.8, n = 1: utilization = 20%<br>
p = 0.8, n = 2: utilization = 36%<br>
p = 0.8, n = 4: utilization = 59%<br>
p = 0.8, n = 8: utilization = 83.2%<br>
to reach 90% with p = 0.8 you need n = 11 processes (n = 10 gives 89.3%)<br>
hit ratio 0.95: 2.5 ns (miss = check cache, then memory) or 2.4 ns (miss = memory only)<br>
hit ratio 0.99: 2.1 ns (miss = check cache, then memory) or 2.08 ns (miss = memory only)<br>
one turn 8.333 ms, avg rotational delay 4.167 ms, one-sector transfer 0.0167 ms<br>
read one random sector: 8.183 ms</div>
<ul>
<li>(a) hiệu suất = 1 − 0,8ⁿ: 20%, 36%, 59%, 83,2%; 0,8¹⁰ = 0,107 vẫn lớn hơn 0,1, nên <strong>n = 11</strong>. (Đồ thị ở bài 1.A, slide 10.) ⚠️ Trong hệ thống thật, thêm tiến trình tới một lúc lại <em>giảm</em> hiệu suất — hết bộ nhớ và hệ thống bị thrashing (Chương 3); FE1 hỏi đúng ý này: "tăng trước, rồi giảm".</li>
<li>(b) có hai quy ước: nếu trượt tốn cache + bộ nhớ thì 0,95 × 2 + 0,05 × 12 = 2,5 ns; nếu trượt chỉ tốn bộ nhớ thì 0,95 × 2 + 0,05 × 10 = 2,4 ns. Ghi rõ bạn dùng quy ước nào.</li>
<li>(c) một vòng = 60.000/7.200 = 8,333 ms, trung bình nửa vòng = 4,167 ms, một sector = 8,333/500 ms; tổng ≈ 4 + 4,167 + 0,017 = 8,18 ms — seek và quay chiếm gần hết, truyền dữ liệu không đáng kể.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — interrogate your shell through /proc (10 min)</h3>
<p>Without <code>ps</code>, find your shell's PID, its parent, its state, its name, how many files it has open and its working directory — then <code>cd</code> somewhere and check that the kernel saw it.</p>
<details><summary>Solution — real session</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 7: interrogate your own shell through /proc<br>
$ echo "my shell is PID $$"<br>
my shell is PID 1<br>
$ grep -E '^(Name|State|PPid|Threads)' /proc/$$/status<br>
Name:	bash<br>
State:	S (sleeping)<br>
PPid:	0<br>
Threads:	1<br>
$ cat /proc/$$/comm<br>
bash<br>
$ ls /proc/$$/fd | wc -l<br>
4<br>
$ readlink /proc/$$/cwd<br>
/w<br>
$ cd /usr/share &amp;&amp; readlink /proc/$$/cwd<br>
/usr/share</div>
<p><code>$$</code> is the shell's own PID; <code>/proc/&lt;PID&gt;/status</code> gives state and parent (here 0: the shell is the container's first process — on WSL you would see the PID of the process that started your terminal); <code>fd</code> lists open descriptors (bash keeps one extra, 255, for itself); <code>cwd</code> is a link to the working directory, and it changed after <code>cd</code>. This is exactly the per-process information of slide 21, read from the kernel's process table.</p>
</details>`,
    `<h3>🧪 Bài 7 — tra hỏi shell của bạn qua /proc (10 phút)</h3>
<p>Không dùng <code>ps</code>, tìm PID của shell, cha của nó, trạng thái, tên, số tệp đang mở và thư mục làm việc — rồi <code>cd</code> sang chỗ khác và kiểm xem nhân đã thấy chưa.</p>
<details><summary>Lời giải — phiên thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 7: tra hỏi chính shell của bạn qua /proc<br>
$ echo "my shell is PID $$"<br>
my shell is PID 1<br>
$ grep -E '^(Name|State|PPid|Threads)' /proc/$$/status<br>
Name:	bash<br>
State:	S (sleeping)<br>
PPid:	0<br>
Threads:	1<br>
$ cat /proc/$$/comm<br>
bash<br>
$ ls /proc/$$/fd | wc -l<br>
4<br>
$ readlink /proc/$$/cwd<br>
/w<br>
$ cd /usr/share &amp;&amp; readlink /proc/$$/cwd<br>
/usr/share</div>
<p><code>$$</code> là PID của chính shell; <code>/proc/&lt;PID&gt;/status</code> cho trạng thái và cha (ở đây là 0: shell là tiến trình đầu tiên của container — trên WSL bạn sẽ thấy PID của tiến trình đã mở terminal); <code>fd</code> liệt kê các bộ mô tả đang mở (bash giữ thêm một cái, 255, cho riêng nó); <code>cwd</code> là liên kết tới thư mục làm việc, và nó đổi sau <code>cd</code>. Đây đúng là thông tin riêng của từng tiến trình ở slide 21, đọc từ bảng tiến trình của nhân.</p>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>operating system (OS)</strong></td><td>hệ điều hành</td><td>The software that manages the hardware and gives programs clean abstractions; its core is the kernel.</td></tr>
<tr><td><strong>kernel</strong></td><td>nhân (hệ điều hành)</td><td>The part of the OS that runs in kernel mode with full access to the hardware.</td></tr>
<tr><td><strong>kernel mode / user mode</strong></td><td>chế độ nhân / chế độ người dùng</td><td>The two CPU modes; privileged instructions are allowed only in kernel mode.</td></tr>
<tr><td><strong>extended machine</strong></td><td>cỗ máy mở rộng</td><td>The top-down view: the OS hides ugly hardware behind abstractions such as files and processes.</td></tr>
<tr><td><strong>resource manager</strong></td><td>người quản lý tài nguyên</td><td>The bottom-up view: the OS shares CPU, memory and devices among programs, in time and in space.</td></tr>
<tr><td><strong>batch system</strong></td><td>hệ xử lý theo lô</td><td>Second-generation system that ran queued jobs one after another without a human in between.</td></tr>
<tr><td><strong>multiprogramming</strong></td><td>đa chương trình</td><td>Several jobs in memory at once so the CPU runs one while others wait for I/O.</td></tr>
<tr><td><strong>spooling / timesharing</strong></td><td>spooling / chia sẻ thời gian</td><td>Reading jobs onto disk as they arrive; giving many interactive users short turns of the CPU.</td></tr>
<tr><td><strong>program status word (PSW)</strong></td><td>từ trạng thái chương trình</td><td>CPU register holding condition codes, priority and the user/kernel mode bit.</td></tr>
<tr><td><strong>interrupt / trap</strong></td><td>ngắt / bẫy</td><td>An interrupt comes from a device; a trap is requested by the running program (a system call).</td></tr>
<tr><td><strong>device driver</strong></td><td>trình điều khiển thiết bị</td><td>Kernel code that talks to one kind of device controller.</td></tr>
<tr><td><strong>process</strong></td><td>tiến trình</td><td>A program in execution, with its address space and resources.</td></tr>
<tr><td><strong>address space</strong></td><td>không gian địa chỉ</td><td>The memory locations a process may use: text, data, heap, stack.</td></tr>
<tr><td><strong>file descriptor</strong></td><td>bộ mô tả tệp</td><td>Small integer returned by open and passed to read/write/close; 0, 1, 2 are standard.</td></tr>
<tr><td><strong>mount</strong></td><td>gắn kết (mount)</td><td>Attaching a whole file system onto a directory of the single file tree.</td></tr>
<tr><td><strong>pipe</strong></td><td>đường ống (pipe)</td><td>A pseudofile connecting two processes: one writes, the other reads.</td></tr>
<tr><td><strong>system call</strong></td><td>lời gọi hệ thống</td><td>A controlled request from a program to the kernel, entered through a trap instruction.</td></tr>
<tr><td><strong>monolithic kernel / microkernel</strong></td><td>nhân nguyên khối / vi nhân</td><td>All OS services in one kernel-mode program, versus a minimal kernel plus user-mode servers and drivers.</td></tr>
<tr><td><strong>hypervisor (VMM)</strong></td><td>trình giám sát máy ảo</td><td>Software that gives each virtual machine a copy of the hardware; type 1 on bare metal, type 2 on a host OS.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>operating system (OS)</strong></td><td>hệ điều hành</td><td>Phần mềm quản lý phần cứng và cho chương trình các trừu tượng gọn gàng; lõi của nó là nhân.</td></tr>
<tr><td><strong>kernel</strong></td><td>nhân (hệ điều hành)</td><td>Phần của HĐH chạy ở chế độ nhân, được truy cập toàn quyền phần cứng.</td></tr>
<tr><td><strong>kernel mode / user mode</strong></td><td>chế độ nhân / chế độ người dùng</td><td>Hai chế độ của CPU; lệnh đặc quyền chỉ được chạy ở chế độ nhân.</td></tr>
<tr><td><strong>extended machine</strong></td><td>cỗ máy mở rộng</td><td>Góc nhìn từ trên xuống: HĐH giấu phần cứng xấu xí sau trừu tượng như tệp và tiến trình.</td></tr>
<tr><td><strong>resource manager</strong></td><td>người quản lý tài nguyên</td><td>Góc nhìn từ dưới lên: HĐH chia CPU, bộ nhớ, thiết bị cho các chương trình, theo thời gian và không gian.</td></tr>
<tr><td><strong>batch system</strong></td><td>hệ xử lý theo lô</td><td>Hệ thống thế hệ hai chạy lần lượt các job xếp hàng mà không có người chen giữa.</td></tr>
<tr><td><strong>multiprogramming</strong></td><td>đa chương trình</td><td>Nhiều job cùng nằm trong bộ nhớ để CPU chạy job này khi các job kia chờ I/O.</td></tr>
<tr><td><strong>spooling / timesharing</strong></td><td>spooling / chia sẻ thời gian</td><td>Đọc job vào đĩa ngay khi chúng tới; cho nhiều người dùng tương tác những lượt CPU ngắn.</td></tr>
<tr><td><strong>program status word (PSW)</strong></td><td>từ trạng thái chương trình</td><td>Thanh ghi của CPU giữ bit điều kiện, mức ưu tiên và bit chế độ người dùng/nhân.</td></tr>
<tr><td><strong>interrupt / trap</strong></td><td>ngắt / bẫy</td><td>Ngắt đến từ thiết bị; bẫy do chương trình đang chạy chủ động yêu cầu (lời gọi hệ thống).</td></tr>
<tr><td><strong>device driver</strong></td><td>trình điều khiển thiết bị</td><td>Mã của nhân nói chuyện với một loại bộ điều khiển thiết bị.</td></tr>
<tr><td><strong>process</strong></td><td>tiến trình</td><td>Chương trình đang thực thi, kèm không gian địa chỉ và tài nguyên của nó.</td></tr>
<tr><td><strong>address space</strong></td><td>không gian địa chỉ</td><td>Các ô nhớ một tiến trình được dùng: text, data, heap, stack.</td></tr>
<tr><td><strong>file descriptor</strong></td><td>bộ mô tả tệp</td><td>Số nguyên nhỏ do open trả về, đưa vào read/write/close; 0, 1, 2 là chuẩn.</td></tr>
<tr><td><strong>mount</strong></td><td>gắn kết (mount)</td><td>Gắn nguyên một hệ thống tệp vào một thư mục của cây tệp duy nhất.</td></tr>
<tr><td><strong>pipe</strong></td><td>đường ống (pipe)</td><td>Tệp giả nối hai tiến trình: một bên ghi, bên kia đọc.</td></tr>
<tr><td><strong>system call</strong></td><td>lời gọi hệ thống</td><td>Yêu cầu có kiểm soát từ chương trình gửi nhân, đi vào qua lệnh bẫy.</td></tr>
<tr><td><strong>monolithic kernel / microkernel</strong></td><td>nhân nguyên khối / vi nhân</td><td>Mọi dịch vụ HĐH trong một chương trình chế độ nhân, so với một nhân tối thiểu cộng các server và driver ở chế độ người dùng.</td></tr>
<tr><td><strong>hypervisor (VMM)</strong></td><td>trình giám sát máy ảo</td><td>Phần mềm cho mỗi máy ảo một bản sao phần cứng; loại 1 chạy trên phần cứng trần, loại 2 trên một HĐH chủ.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 1</h2>
<ol>
<li>An OS is an <strong>extended machine</strong> (abstractions: processes, address spaces, files) and a <strong>resource manager</strong> (sharing in time and in space).</li>
<li>The CPU's <strong>mode bit</strong> separates kernel mode (everything allowed) from user mode (no I/O, no interrupt control, no MMU changes); shells and GUIs are user programs.</li>
<li>History is a chain of fixes to wasted CPU time: batch → multiprogramming (+ protection) → spooling and timesharing → personal and mobile computers.</li>
<li>Hardware the OS manages: CPU (PC, SP, PSW; pipelines, multicore), the <strong>memory hierarchy</strong> (registers → cache → RAM → disk, each level slower and bigger), disks (seek + rotation), devices via controllers, interrupts and buses.</li>
<li>A <strong>process</strong> is a program in execution; processes form a tree; files form a tree; mount joins trees; pipes join processes.</li>
<li>A <strong>system call</strong> enters the kernel only through a trap; the library wrapper, the call number and the handler table do the rest (11 steps).</li>
<li>POSIX core: fork / execve / waitpid / exit; open / read / write / lseek / stat / close; mkdir / link / unlink / mount; chdir / chmod / kill / time. Win32 is a library on top of a hidden native API (CreateProcess = fork + exec).</li>
<li>Structures: monolithic (fast, fragile), layered (THE), microkernel (reliable, slower), client-server (messages, also over networks), virtual machines and hypervisors (type 1 and 2); containers share the host kernel.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 1</h2>
<ol>
<li>HĐH là <strong>cỗ máy mở rộng</strong> (trừu tượng: tiến trình, không gian địa chỉ, tệp) và <strong>người quản lý tài nguyên</strong> (chia theo thời gian và không gian).</li>
<li><strong>Bit chế độ</strong> của CPU tách chế độ nhân (được làm mọi thứ) khỏi chế độ người dùng (không I/O, không điều khiển ngắt, không đổi MMU); shell và giao diện đồ hoạ là chương trình người dùng.</li>
<li>Lịch sử là chuỗi các cách vá chuyện CPU ngồi không: lô → đa chương trình (+ bảo vệ) → spooling và chia sẻ thời gian → máy cá nhân và di động.</li>
<li>Phần cứng HĐH quản lý: CPU (PC, SP, PSW; pipeline, đa nhân), <strong>phân cấp bộ nhớ</strong> (thanh ghi → cache → RAM → đĩa, tầng sau chậm hơn và lớn hơn), đĩa (seek + quay), thiết bị qua bộ điều khiển, ngắt và bus.</li>
<li><strong>Tiến trình</strong> là chương trình đang thực thi; tiến trình hợp thành cây; tệp hợp thành cây; mount nối các cây; pipe nối các tiến trình.</li>
<li><strong>Lời gọi hệ thống</strong> vào nhân chỉ qua một lệnh bẫy; hàm bọc của thư viện, số hiệu lời gọi và bảng trình xử lý lo phần còn lại (11 bước).</li>
<li>Lõi POSIX: fork / execve / waitpid / exit; open / read / write / lseek / stat / close; mkdir / link / unlink / mount; chdir / chmod / kill / time. Win32 là thư viện nằm trên một native API giấu kín (CreateProcess = fork + exec).</li>
<li>Cấu trúc: nguyên khối (nhanh, mong manh), phân tầng (THE), vi nhân (tin cậy, chậm hơn), khách-chủ (thông điệp, cả qua mạng), máy ảo và hypervisor (loại 1 và 2); container dùng chung nhân của máy chủ.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Which CPU register contains the condition-code bits, the CPU priority and the mode bit (user or kernel)?|||(Dạng câu FE) Thanh ghi nào của CPU chứa các bit mã điều kiện, mức ưu tiên của CPU và bit chế độ (người dùng hay nhân)?',
      options: ['IR (instruction register)|||IR (thanh ghi lệnh)', 'PC (program counter)|||PC (bộ đếm chương trình)', 'PSW (program status word)|||PSW (từ trạng thái chương trình)', 'SP (stack pointer)|||SP (con trỏ ngăn xếp)'],
      correctIndex: 2,
      points: 1,
      explanation: 'The program status word holds the condition codes set by comparisons, the CPU priority, the user/kernel mode bit and other control bits. The PC holds the address of the next instruction and the SP the top of the stack. On ARM64 the PSW is called PSTATE/CPSR — lesson 1.A, slide 11 shows EL=0 (user mode) inside it.|||Từ trạng thái chương trình (PSW) giữ các mã điều kiện do phép so sánh đặt, mức ưu tiên của CPU, bit chế độ người dùng/nhân và các bit điều khiển khác. PC giữ địa chỉ lệnh kế tiếp, SP giữ đỉnh ngăn xếp. Trên ARM64 PSW được gọi là PSTATE/CPSR — bài 1.A, slide 11 cho thấy EL=0 (chế độ người dùng) nằm trong nó.' },
    { id: 'q2',
      question: '(FE question type) Which of the following is NOT an operating-system (CPU) mode in the textbook?|||(Dạng câu FE) Chế độ nào sau đây KHÔNG phải là một chế độ của hệ điều hành (CPU) trong giáo trình?',
      options: ['System mode|||System mode', 'User mode|||User mode (chế độ người dùng)', 'Kernel mode|||Kernel mode (chế độ nhân)', 'Supervisor mode|||Supervisor mode (chế độ giám sát)'],
      correctIndex: 0,
      points: 1,
      explanation: 'The book names two modes: kernel mode — also called supervisor mode — and user mode. "System mode" is not one of them (it is a distractor that sounds plausible). Lesson 1.A, slide 3.|||Sách gọi tên hai chế độ: chế độ nhân — còn gọi là supervisor mode — và chế độ người dùng. "System mode" không phải một trong số đó (đó là phương án gây nhiễu nghe có vẻ hợp lý). Bài 1.A, slide 3.' },
    { id: 'q3',
      question: '(FE question type) Which statement best describes a monolithic operating system?|||(Dạng câu FE) Phát biểu nào mô tả đúng nhất một hệ điều hành nguyên khối?',
      options: ['Every service runs as a separate user-mode process that exchanges messages|||Mỗi dịch vụ chạy thành một tiến trình chế độ người dùng riêng và trao đổi thông điệp', 'The whole OS runs as a single program in kernel (supervisor) mode|||Toàn bộ HĐH chạy thành một chương trình duy nhất ở chế độ nhân (supervisor)', 'The OS is a strict hierarchy of layers, each using only the layer below|||HĐH là một phân cấp tầng nghiêm ngặt, mỗi tầng chỉ dùng tầng ngay dưới', 'Only the file system runs in the kernel; drivers run in user space|||Chỉ hệ thống tệp chạy trong nhân; driver chạy ở không gian người dùng'],
      correctIndex: 1,
      points: 1,
      explanation: 'Monolithic = a collection of procedures linked into one large executable that runs entirely in kernel mode (main procedure, service procedures, utility procedures). A describes a microkernel/client-server design, C a layered system like THE, D matches no standard design. Lesson 1.B, slides 38–41.|||Nguyên khối = một tập thủ tục liên kết thành một tệp thực thi lớn chạy hoàn toàn ở chế độ nhân (thủ tục chính, thủ tục dịch vụ, thủ tục tiện ích). A tả thiết kế vi nhân/khách-chủ, C tả hệ phân tầng như THE, D không khớp thiết kế chuẩn nào. Bài 1.B, slide 38–41.' },
    { id: 'q4',
      question: '(FE question type) What is the purpose of the TRAP instruction when a system call is made?|||(Dạng câu FE) Lệnh TRAP có mục đích gì khi thực hiện một lời gọi hệ thống?',
      options: ['To call a function of the C library|||Để gọi một hàm của thư viện C', 'To check the parameters before the call is executed|||Để kiểm tra tham số trước khi lời gọi được thực thi', 'To store the system-call number in memory|||Để lưu số hiệu lời gọi hệ thống vào bộ nhớ', 'To switch from user mode to kernel mode and jump to a fixed entry point in the kernel|||Để chuyển từ chế độ người dùng sang chế độ nhân và nhảy tới một điểm vào cố định trong nhân'],
      correctIndex: 3,
      points: 1,
      explanation: "Step 6 of Figure 1-17: the library has put the call number in a register (step 5), then the trap switches to kernel mode and transfers control to the kernel's dispatcher. The library call happens before (step 4) and parameter checking is done later by the kernel's handler. Today the trap is syscall on x86-64 and svc #0 on ARM64 — lesson 1.B, slide 27.|||Bước 6 của Hình 1-17: thư viện đã đặt số hiệu lời gọi vào thanh ghi (bước 5), rồi lệnh bẫy chuyển sang chế độ nhân và trao quyền điều khiển cho bộ điều phối của nhân. Lời gọi thư viện xảy ra trước đó (bước 4) và việc kiểm tra tham số do trình xử lý của nhân làm sau. Ngày nay lệnh bẫy là syscall trên x86-64 và svc #0 trên ARM64 — bài 1.B, slide 27." },
    { id: 'q5',
      question: 'Processes spend 80% of their time waiting for I/O. Using the model CPU utilization = 1 − pⁿ, what is the CPU utilization with 4 processes in memory?|||Các tiến trình dành 80% thời gian chờ I/O. Theo mô hình hiệu suất CPU = 1 − pⁿ, hiệu suất CPU là bao nhiêu khi có 4 tiến trình trong bộ nhớ?',
      options: ['20%|||20%', '41%|||41%', 'About 59%|||Khoảng 59%', '80%|||80%'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: 1 − 0.8⁴ = 1 − 0.4096 = 0.5904 ≈ 59%. 41% is 0.8⁴ itself — the probability that ALL four processes wait, i.e. the idle fraction. 20% is the utilization with a single process. Lesson 1.A, slide 10 has the full curve.|||Do bộ mô phỏng tính: 1 − 0,8⁴ = 1 − 0,4096 = 0,5904 ≈ 59%. 41% chính là 0,8⁴ — xác suất CẢ bốn tiến trình cùng chờ, tức tỉ lệ CPU rảnh. 20% là hiệu suất khi chỉ có một tiến trình. Bài 1.A, slide 10 có cả đường cong.' },
    { id: 'q6',
      question: 'How many lines does this program print (each process prints one line)?|||Chương trình này in ra bao nhiêu dòng (mỗi tiến trình in một dòng)?',
      code: `fork();
if (fork() == 0)
    fork();
puts("x");`,
      codeLang: 'c',
      options: ['4|||4', '6|||6', '8|||8', '3|||3'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program (piped through wc -l): 6. After the first fork there are 2 processes; both execute the second fork (4 processes); in each pair only the child, where fork() returned 0, executes the third fork: 4 + 2 = 6. Lesson 1.C, exercise 3.|||Output của chương trình thật (cho qua wc -l): 6. Sau lần fork đầu có 2 tiến trình; cả hai chạy lần fork thứ hai (4 tiến trình); trong mỗi cặp chỉ tiến trình con, nơi fork() trả 0, chạy lần fork thứ ba: 4 + 2 = 6. Bài 1.C, bài tập 3.' },
    { id: 'q7',
      question: '(FE question type) An interrupt has four properties - the PC is saved in a known place; all instructions before the one the PC points to have completed; no instruction after it has finished; the execution state of the instruction at the PC is known. What kind of interrupt is it?|||(Dạng câu FE) Một ngắt có bốn tính chất - PC được lưu ở một chỗ đã biết; mọi lệnh trước lệnh PC trỏ tới đã xong; không lệnh nào sau nó đã xong; trạng thái thực thi của lệnh tại PC là xác định. Đó là loại ngắt gì?',
      options: ['Imprecise interrupt|||Ngắt không chính xác (imprecise)', 'Synchronous interrupt|||Ngắt đồng bộ', 'Sequential interrupt|||Ngắt tuần tự', 'Precise interrupt|||Ngắt chính xác (precise)'],
      correctIndex: 3,
      points: 1,
      explanation: "These four properties are the definition of a precise interrupt (Chapter 5). They matter because pipelined and superscalar CPUs have several instructions half-done at once (lesson 1.A, slide 12); an imprecise interrupt leaves that state messy and makes the OS's job much harder.|||Bốn tính chất này chính là định nghĩa ngắt chính xác (Chương 5). Chúng quan trọng vì CPU có pipeline và siêu vô hướng luôn có nhiều lệnh làm dở cùng lúc (bài 1.A, slide 12); ngắt không chính xác để lại trạng thái lộn xộn và làm việc của HĐH khó hơn nhiều." },
    { id: 'q8',
      question: '(FE question type) Which Win32 call both creates a new process and loads a program into it, doing the work of UNIX fork plus execve?|||(Dạng câu FE) Lời gọi Win32 nào vừa tạo tiến trình mới vừa nạp chương trình vào đó, làm việc của fork cộng execve trong UNIX?',
      options: ['CreateProcess|||CreateProcess', 'WaitForSingleObject|||WaitForSingleObject', 'ExitProcess|||ExitProcess', 'CreateFile|||CreateFile'],
      correctIndex: 0,
      points: 1,
      explanation: 'Figure 1-23 maps fork to CreateProcess and execve to "(none)", because CreateProcess = fork + execve in one call. WaitForSingleObject corresponds to waitpid, ExitProcess to exit, CreateFile to open. Lesson 1.B, slide 36.|||Hình 1-23 ánh xạ fork sang CreateProcess và execve sang "(không có)", vì CreateProcess = fork + execve trong một lời gọi. WaitForSingleObject tương ứng waitpid, ExitProcess tương ứng exit, CreateFile tương ứng open. Bài 1.B, slide 36.' },
    { id: 'q9',
      question: '(FE question type) A virtual machine monitor that runs directly on the bare hardware and hosts several guest operating systems is called…|||(Dạng câu FE) Trình giám sát máy ảo chạy thẳng trên phần cứng trần và chứa nhiều hệ điều hành khách được gọi là…',
      options: ['a type 2 hypervisor|||hypervisor loại 2', 'a type 1 hypervisor|||hypervisor loại 1', 'a microkernel|||vi nhân', 'a container engine|||bộ máy container'],
      correctIndex: 1,
      points: 1,
      explanation: "A virtual machine monitor is also called a hypervisor; type 1 runs on the bare metal (VM/370, VMware ESXi, Hyper-V, Xen), type 2 runs as a program on a host OS (VirtualBox, VMware Workstation). A container engine is not a hypervisor at all: containers share the host's kernel. Lesson 1.B, slides 43–44.|||Trình giám sát máy ảo còn gọi là hypervisor; loại 1 chạy trên phần cứng trần (VM/370, VMware ESXi, Hyper-V, Xen), loại 2 chạy như một chương trình trên HĐH chủ (VirtualBox, VMware Workstation). Bộ máy container hoàn toàn không phải hypervisor: container dùng chung nhân của máy chủ. Bài 1.B, slide 43–44." },
    { id: 'q10',
      question: 'What does this C fragment print?|||Đoạn C này in ra gì?',
      code: `char buf[5] = {0};
int fd = open("/tmp/f.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);
write(fd, "ABCDEFGHIJ", 10);
lseek(fd, 3, SEEK_SET);
read(fd, buf, 4);
printf("%s", buf);`,
      codeLang: 'c',
      options: ['ABCD|||ABCD', 'EFGH|||EFGH', 'DEFG|||DEFG', 'CDEF|||CDEF'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: DEFG. After write the file pointer is at 10; lseek(fd, 3, SEEK_SET) moves it to offset 3, i.e. the fourth byte "D" (offsets start at 0); read then returns 4 bytes from there. lseek only moves the pointer, it reads nothing. Lesson 1.B, slide 29.|||Output của chương trình thật: DEFG. Sau write, con trỏ tệp ở vị trí 10; lseek(fd, 3, SEEK_SET) dời nó về vị trí 3, tức byte thứ tư "D" (vị trí đếm từ 0); rồi read trả 4 byte tính từ đó. lseek chỉ dời con trỏ, không đọc gì. Bài 1.B, slide 29.' },
  ],
};

export default {
  slides: [L_osg1_1, L_osg1_2],
  practice: L_on_ch1,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 1 viết lại theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán và câu "in ra gì" có đáp án kiểm bằng mô phỏng hoặc chương trình C chạy thật: thanh ghi PSW, các chế độ của CPU, hệ nguyên khối, lệnh TRAP, hiệu suất CPU 1 − pⁿ, đếm tiến trình sau fork, ngắt chính xác, CreateProcess của Win32, hypervisor loại 1 và lseek.',
};
