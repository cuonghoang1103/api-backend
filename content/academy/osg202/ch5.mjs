/**
 * OSG202 · Chương 5 — Input/Output (osg5: 5.A 1–23, 5.B 24–57).
 * Bài 📑 học theo từng slide: osg5 (tmp_05.pptx, slide 1–57).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch5.
 * Quiz viết lại (10 câu, giữ slug osg202-quiz-ch5).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 5.A — 📑 Slide by slide · Input/Output: devices, memory-mapped I/O, DMA, interrupts, I/O layers (slides 1–23) ───────── */
const L_osg5_1 = {
  title: '5.A — 📑 Slide by slide · Input/Output: devices, memory-mapped I/O, DMA, interrupts, I/O layers (slides 1–23)|||5.A — 📑 Học theo từng slide · Input/Output: thiết bị, memory-mapped I/O, DMA, ngắt, các tầng I/O (slide 1–23)',
  slug: 'osg202-slide-osg5-1',
  type: 'VIDEO',
  description: 'Giảng đủ 23 slide đầu của Chương 5 (Tanenbaum, Modern Operating Systems 4e): thiết bị khối và thiết bị ký tự, bảng tốc độ dữ liệu đặt cạnh số đo 2026, memory-mapped I/O và I/O port, kiến trúc một bus và hai bus, DMA, ngắt và bộ điều khiển ngắt, ngắt chính xác và không chính xác, mục tiêu của phần mềm I/O, ba cách làm I/O (lập trình, hướng ngắt, DMA), bốn tầng phần mềm I/O, trình xử lý ngắt, driver, phần mềm độc lập thiết bị, đệm và phần mềm I/O ở không gian người dùng — mỗi ý có lệnh hoặc chương trình C chạy thật trên Linux (đọc thanh ghi chip đồng hồ bằng một lệnh đọc bộ nhớ, đếm ngắt của đĩa, sửa lỗi trang rồi chạy lại đúng lệnh hỏng, in chuỗi theo ba cách và đo thời gian CPU, đếm lời gọi write khi có và không có bộ đệm), hình do bộ mô phỏng tính và các chỗ slide đã lỗi thời.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.A · deck "Chapter 5 · Input/Output", slides 1–23</span>
<h2>How the OS talks to devices: hardware first, then the software layers</h2>
<p class="lead">A computer is useless without input and output, and the I/O code is the largest part of every real operating system — in Linux, the <code>drivers/</code> directory is more than half of the kernel source. The first half of the deck follows sections 5.1–5.3 of the book: what devices and controllers look like to software (slides 1–9), then how the I/O software is organised, from the busy-waiting loop to DMA, and from the interrupt handler up to the library in your program (slides 10–23). Almost everything here can be watched on a real Linux, so each figure comes with a command or a C program run in the course container.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>5.1.1 I/O devices</td><td>tell block devices from character devices and compare their data rates</td></tr>
<tr><td>4–5</td><td>5.1.2–5.1.3 Device controllers, memory-mapped I/O</td><td>explain I/O ports vs memory-mapped registers, and why caching them is dangerous</td></tr>
<tr><td>6</td><td>5.1.4 Direct memory access</td><td>list the four steps of a DMA transfer and the modes of a DMA controller</td></tr>
<tr><td>7–9</td><td>5.1.5 Interrupts revisited</td><td>follow an interrupt from the device to the CPU and define a precise interrupt</td></tr>
<tr><td>10–14</td><td>5.2 Principles of I/O software</td><td>state the five goals and compare programmed, interrupt-driven and DMA I/O</td></tr>
<tr><td>15–23</td><td>5.3 I/O software layers</td><td>place every I/O job in the right layer (handler, driver, device-independent, user space)</td></tr>
</tbody>
</table>
<div class="callout">The older web lesson 5.1 further down stays as a short summary (drivers, layers, zero-copy); this lesson refers to it instead of repeating it. Chapter 1 already showed the interrupt idea once (lesson 1.A, slides 17–18) — here it is opened up completely.</div>`,
    `<span class="eyebrow">Chương 5 · Bài 5.A · deck "Chapter 5 · Input/Output", slide 1–23</span>
<h2>HĐH nói chuyện với thiết bị thế nào: phần cứng trước, rồi tới các tầng phần mềm</h2>
<p class="lead">Máy tính không có vào/ra (input/output — I/O) thì vô dụng, và mã I/O là phần LỚN NHẤT của mọi hệ điều hành thật — trong Linux, thư mục <code>drivers/</code> chiếm hơn một nửa mã nguồn nhân. Nửa đầu bộ slide đi theo mục 5.1–5.3 của sách: thiết bị và bộ điều khiển trông thế nào dưới mắt phần mềm (slide 1–9), rồi phần mềm I/O được tổ chức ra sao, từ vòng lặp chờ bận tới DMA, và từ trình xử lý ngắt lên tới thư viện trong chương trình của bạn (slide 10–23). Gần như mọi thứ ở đây đều nhìn tận mắt được trên một Linux thật, nên hình nào cũng đi kèm một lệnh hoặc một chương trình C chạy trong container của môn.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–3</td><td>5.1.1 Thiết bị I/O</td><td>phân biệt thiết bị khối với thiết bị ký tự và so sánh tốc độ dữ liệu của chúng</td></tr>
<tr><td>4–5</td><td>5.1.2–5.1.3 Bộ điều khiển thiết bị, memory-mapped I/O</td><td>giải thích cổng I/O so với thanh ghi ánh xạ vào bộ nhớ, và vì sao cache chúng là nguy hiểm</td></tr>
<tr><td>6</td><td>5.1.4 Truy cập bộ nhớ trực tiếp (DMA)</td><td>kể bốn bước của một lần truyền DMA và các chế độ của bộ điều khiển DMA</td></tr>
<tr><td>7–9</td><td>5.1.5 Nhìn lại ngắt</td><td>lần theo một ngắt từ thiết bị tới CPU và định nghĩa ngắt chính xác</td></tr>
<tr><td>10–14</td><td>5.2 Nguyên lý phần mềm I/O</td><td>nêu năm mục tiêu và so sánh I/O lập trình, I/O hướng ngắt, I/O dùng DMA</td></tr>
<tr><td>15–23</td><td>5.3 Các tầng phần mềm I/O</td><td>đặt mỗi việc I/O vào đúng tầng (trình xử lý ngắt, driver, độc lập thiết bị, không gian người dùng)</td></tr>
</tbody>
</table>
<div class="callout">Bài web cũ 5.1 phía dưới vẫn giữ làm bản tóm tắt ngắn (driver, các tầng, zero-copy); bài này dẫn sang nó thay vì lặp lại. Chương 1 đã cho thấy ý tưởng ngắt một lần (bài 1.A, slide 17–18) — ở đây nó được mở ra trọn vẹn.</div>`),
    walkHead('osg5', 1, 23),
    walk('osg5', [
      [1, 'Input/Output',
        `<p class="y-chinh">🎯 Chapter 5 of <em>Modern Operating Systems</em> (4th edition): how the operating system controls the I/O devices — issuing commands, catching interrupts, handling errors — and gives programs one simple interface to all of them.</p>
<p>In the syllabus this chapter belongs to outcome CLO5 and is tested in Progress Test 2 together with file systems (Chapter 4) and deadlock (Chapter 6). The FE asks two kinds of questions about it: definitions (layers, DMA modes, precise interrupt, RAID levels, clock duties) and calculations (disk-arm scheduling, cylinder skew, interrupt overhead, clock holding register) — both kinds appear below, each calculation checked by a program.</p>
<p>The chapter has three parts: <strong>principles</strong> of I/O hardware and software (slides 2–23), <strong>case studies</strong> of real devices — disks, clocks, keyboard and screen (slides 24–53), and <strong>power management</strong> (slides 54–56).</p>
<p class="meo">🧠 One sentence for the chapter: <em>devices are slow, different and unreliable; the OS hides all three behind <code>read</code> and <code>write</code>.</em></p>`,
        `<p class="y-chinh">🎯 Chương 5 của <em>Modern Operating Systems</em> (bản 4): hệ điều hành điều khiển các thiết bị vào/ra (I/O device) ra sao — ra lệnh, bắt ngắt, xử lý lỗi — và đưa cho chương trình một giao diện đơn giản duy nhất cho tất cả chúng.</p>
<p>Trong đề cương, chương này thuộc chuẩn đầu ra CLO5 và được thi trong Progress Test 2 cùng với hệ thống tệp (Chương 4) và bế tắc (Chương 6). FE hỏi hai kiểu câu về nó: định nghĩa (các tầng, chế độ DMA, ngắt chính xác, các mức RAID, nhiệm vụ của đồng hồ) và tính toán (lập lịch cần đĩa, độ lệch trụ, chi phí ngắt, thanh ghi giữ của đồng hồ) — cả hai kiểu đều có bên dưới, câu tính nào cũng được một chương trình kiểm.</p>
<p>Chương có ba phần: <strong>nguyên lý</strong> phần cứng và phần mềm I/O (slide 2–23), <strong>nghiên cứu tình huống</strong> các thiết bị thật — đĩa, đồng hồ, bàn phím và màn hình (slide 24–53), và <strong>quản lý năng lượng</strong> (slide 54–56).</p>
<p class="meo">🧠 Cả chương trong một câu: <em>thiết bị thì chậm, khác nhau và hay hỏng; HĐH giấu cả ba điều đó sau <code>read</code> và <code>write</code>.</em></p>`],
      [2, 'I/O Devices (1)',
        `<p class="y-chinh">🎯 Two big classes of devices: a <strong>block device</strong> stores information in fixed-size blocks, each with its own address, and transfers whole blocks (disks, SSDs, USB sticks); a <strong>character device</strong> delivers or accepts a stream of characters with no block structure — it is not addressable and has no seek operation (keyboards, mice, printers, network interfaces).</p>
<p>The test for a block device: can you read block 1234 without reading blocks 0–1233 first? On a disk yes — the arm simply moves there. On a keyboard the question makes no sense: the next character is whatever the user types next. Block sizes range from 512 bytes to 32 KB on disks; file systems (Chapter 4) are built only on block devices. The book itself warns that the split is not perfect: a <strong>clock</strong> is neither (it only causes interrupts), and memory-mapped screens do not fit well either.</p>
<p>➕ On Linux the class is the first letter of the file mode under <code>/dev</code>: <code>b</code> or <code>c</code>. The pair "major, minor" is how the kernel names a device: the major number picks the driver, the minor number picks the unit:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Every device is a file under /dev; the first letter of the mode says the class: b = block, c = character<br>
$ stat -c '%A &nbsp;major %Hr minor %Lr &nbsp;%n' /dev/vda /dev/loop0 /dev/ram0 /dev/null /dev/zero /dev/urandom /dev/hvc0<br>
brw-rw-rw- &nbsp;major 254 minor 0 &nbsp;/dev/vda<br>
brw-rw-rw- &nbsp;major 7 minor 0 &nbsp;/dev/loop0<br>
brw-rw-rw- &nbsp;major 1 minor 0 &nbsp;/dev/ram0<br>
crw-rw-rw- &nbsp;major 1 minor 3 &nbsp;/dev/null<br>
crw-rw-rw- &nbsp;major 1 minor 5 &nbsp;/dev/zero<br>
crw-rw-rw- &nbsp;major 1 minor 9 &nbsp;/dev/urandom<br>
crw------- &nbsp;major 229 minor 0 &nbsp;/dev/hvc0<br>
# The kernel's own list of drivers: block majors and character majors are two SEPARATE tables<br>
$ grep -E '^(Character|Block)|^ *(1|5|7|229) ' /proc/devices<br>
Character devices:<br>
&nbsp;&nbsp;1 mem<br>
&nbsp;&nbsp;5 /dev/tty<br>
&nbsp;&nbsp;5 /dev/console<br>
&nbsp;&nbsp;5 /dev/ptmx<br>
&nbsp;&nbsp;7 vcs<br>
229 hvc<br>
Block devices:<br>
&nbsp;&nbsp;1 ramdisk<br>
&nbsp;&nbsp;7 loop<br>
# A block device has a size in blocks and a sector size; a character device has neither<br>
$ blockdev --getss --getsize64 /dev/vda<br>
512<br>
994662416384<br>
$ blockdev --getss /dev/null<br>
blockdev: ioctl error on BLKSSZGET: Inappropriate ioctl for device</div>
<p>The virtual disk <code>vda</code>, the loop devices and the RAM disks are block devices (<code>b</code>, with a sector size of 512 and a size in bytes); <code>/dev/null</code>, <code>/dev/zero</code>, <code>/dev/urandom</code> and the console <code>hvc0</code> are character devices — asking <code>/dev/null</code> for a sector size is an "inappropriate ioctl". Note that major 1 means "mem" among character devices but "ramdisk" among block devices: two separate tables. Now the seek test itself, in C:</p>
<pre><code class="language-c">// Block devices are addressable (seek works); character streams are not
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static void thu(const char *ten, int fd) {
    off_t r = lseek(fd, 4096, SEEK_SET);            // "go to byte 4096"
    if (r &lt; 0) printf("%-22s lseek(4096) -&gt; -1  errno = %s\\n", ten, strerror(errno));
    else       printf("%-22s lseek(4096) -&gt; %ld\\n", ten, (long)r);
}

int main(void) {
    int disk = open("/dev/vda", O_RDONLY);          // block device: the virtual disk
    int zero = open("/dev/zero", O_RDONLY);         // character device that never ends
    int p[2];
    pipe(p);                                        // a pure stream of bytes
    thu("/dev/vda (block)", disk);
    thu("/dev/zero (char)", zero);
    thu("pipe (stream)", p[0]);
    // the block device really moved: read 512 bytes at block 8, then ask where we are
    char buf[512];
    lseek(disk, 8 * 512, SEEK_SET);
    ssize_t n = read(disk, buf, sizeof buf);
    printf("read %zd bytes at block 8; position is now %ld\\n", n, (long)lseek(disk, 0, SEEK_CUR));
    // /dev/zero "accepts" the seek but ignores it: there is no position to keep
    n = read(zero, buf, sizeof buf);
    printf("read %zd bytes from /dev/zero; position is still %ld\\n", n, (long)lseek(zero, 0, SEEK_CUR));
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread tim-kiem.c -o tim-kiem &amp;&amp; ./tim-kiem<br>
/dev/vda (block) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lseek(4096) -&gt; 4096<br>
/dev/zero (char) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lseek(4096) -&gt; 0<br>
pipe (stream) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lseek(4096) -&gt; -1 &nbsp;errno = Illegal seek<br>
read 512 bytes at block 8; position is now 4608<br>
read 512 bytes from /dev/zero; position is still 0</div>
<p>The block device really moved to byte 4096 and remembers its position. The pipe — a pure stream — refuses with <code>ESPIPE</code> "Illegal seek". <code>/dev/zero</code> shows the gray zone: Linux accepts the seek but ignores it, because a stream of zeros has no position.</p>
<p class="pitfall">⚠️ FE classics: keyboard, mouse, modem, printer, scanner → character (FE19#25, FE20#7, FE23#31); disk, CD-ROM, Blu-ray → block (FE12#36, FE21#39); clock → <em>neither</em> (FE22#35, answer "None of the other choices"). "Stream devices" is NOT one of the two classes (FE17#22).</p>`,
        `<p class="y-chinh">🎯 Hai nhóm thiết bị lớn: <strong>thiết bị khối (block device)</strong> lưu thông tin trong các khối kích thước cố định, khối nào cũng có địa chỉ riêng, và truyền trọn từng khối (đĩa, SSD, USB); <strong>thiết bị ký tự (character device)</strong> đưa ra hoặc nhận vào một dòng ký tự không có cấu trúc khối — không định địa chỉ được và không có thao tác seek (dời vị trí) (bàn phím, chuột, máy in, card mạng).</p>
<p>Phép thử thiết bị khối: bạn có đọc được khối 1234 mà không cần đọc khối 0–1233 trước không? Với đĩa thì có — cần đĩa chỉ việc dời tới đó. Với bàn phím câu hỏi đó vô nghĩa: ký tự kế tiếp là bất cứ thứ gì người dùng gõ tiếp. Cỡ khối trên đĩa từ 512 byte tới 32 KB; hệ thống tệp (Chương 4) chỉ dựng được trên thiết bị khối. Chính sách cũng nói cách chia này không hoàn hảo: <strong>đồng hồ (clock)</strong> chẳng thuộc nhóm nào (nó chỉ gây ngắt), màn hình ánh xạ vào bộ nhớ cũng không khớp hẳn.</p>
<p>➕ Trên Linux, nhóm của thiết bị là chữ cái đầu trong quyền của tệp dưới <code>/dev</code>: <code>b</code> hoặc <code>c</code>. Cặp "major, minor" là cách nhân đặt tên một thiết bị: số major chọn driver, số minor chọn từng đơn vị:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Mọi thiết bị là một tệp dưới /dev; chữ cái đầu của quyền cho biết loại: b = khối, c = ký tự<br>
$ stat -c '%A &nbsp;major %Hr minor %Lr &nbsp;%n' /dev/vda /dev/loop0 /dev/ram0 /dev/null /dev/zero /dev/urandom /dev/hvc0<br>
brw-rw-rw- &nbsp;major 254 minor 0 &nbsp;/dev/vda<br>
brw-rw-rw- &nbsp;major 7 minor 0 &nbsp;/dev/loop0<br>
brw-rw-rw- &nbsp;major 1 minor 0 &nbsp;/dev/ram0<br>
crw-rw-rw- &nbsp;major 1 minor 3 &nbsp;/dev/null<br>
crw-rw-rw- &nbsp;major 1 minor 5 &nbsp;/dev/zero<br>
crw-rw-rw- &nbsp;major 1 minor 9 &nbsp;/dev/urandom<br>
crw------- &nbsp;major 229 minor 0 &nbsp;/dev/hvc0<br>
# Danh sách driver của nhân: số major của thiết bị khối và thiết bị ký tự là hai bảng RIÊNG<br>
$ grep -E '^(Character|Block)|^ *(1|5|7|229) ' /proc/devices<br>
Character devices:<br>
&nbsp;&nbsp;1 mem<br>
&nbsp;&nbsp;5 /dev/tty<br>
&nbsp;&nbsp;5 /dev/console<br>
&nbsp;&nbsp;5 /dev/ptmx<br>
&nbsp;&nbsp;7 vcs<br>
229 hvc<br>
Block devices:<br>
&nbsp;&nbsp;1 ramdisk<br>
&nbsp;&nbsp;7 loop<br>
# Thiết bị khối có kích thước tính bằng khối và cỡ sector; thiết bị ký tự không có<br>
$ blockdev --getss --getsize64 /dev/vda<br>
512<br>
994662416384<br>
$ blockdev --getss /dev/null<br>
blockdev: ioctl error on BLKSSZGET: Inappropriate ioctl for device</div>
<p>Đĩa ảo <code>vda</code>, các thiết bị loop và RAM disk là thiết bị khối (<code>b</code>, có cỡ sector 512 và kích thước tính bằng byte); <code>/dev/null</code>, <code>/dev/zero</code>, <code>/dev/urandom</code> và cổng console <code>hvc0</code> là thiết bị ký tự — hỏi cỡ sector của <code>/dev/null</code> thì nhận "inappropriate ioctl" (lệnh điều khiển không hợp với thiết bị). Để ý major 1 là "mem" trong bảng thiết bị ký tự nhưng là "ramdisk" trong bảng thiết bị khối: hai bảng riêng. Giờ là chính phép thử seek, bằng C:</p>
<pre><code class="language-c">// Thiết bị khối định địa chỉ được (seek được); dòng ký tự thì không
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static void thu(const char *ten, int fd) {
    off_t r = lseek(fd, 4096, SEEK_SET);            // "tới byte 4096"
    if (r &lt; 0) printf("%-22s lseek(4096) -&gt; -1  errno = %s\\n", ten, strerror(errno));
    else       printf("%-22s lseek(4096) -&gt; %ld\\n", ten, (long)r);
}

int main(void) {
    int disk = open("/dev/vda", O_RDONLY);          // thiết bị khối: đĩa ảo
    int zero = open("/dev/zero", O_RDONLY);         // thiết bị ký tự không bao giờ hết
    int p[2];
    pipe(p);                                        // một dòng byte thuần tuý
    thu("/dev/vda (block)", disk);
    thu("/dev/zero (char)", zero);
    thu("pipe (stream)", p[0]);
    // thiết bị khối dời thật: đọc 512 byte ở khối 8, rồi hỏi đang ở đâu
    char buf[512];
    lseek(disk, 8 * 512, SEEK_SET);
    ssize_t n = read(disk, buf, sizeof buf);
    printf("read %zd bytes at block 8; position is now %ld\\n", n, (long)lseek(disk, 0, SEEK_CUR));
    // /dev/zero "nhận" lệnh seek nhưng bỏ qua: không có vị trí nào để giữ
    n = read(zero, buf, sizeof buf);
    printf("read %zd bytes from /dev/zero; position is still %ld\\n", n, (long)lseek(zero, 0, SEEK_CUR));
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread tim-kiem.c -o tim-kiem &amp;&amp; ./tim-kiem<br>
/dev/vda (block) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lseek(4096) -&gt; 4096<br>
/dev/zero (char) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lseek(4096) -&gt; 0<br>
pipe (stream) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lseek(4096) -&gt; -1 &nbsp;errno = Illegal seek<br>
read 512 bytes at block 8; position is now 4608<br>
read 512 bytes from /dev/zero; position is still 0</div>
<p>Thiết bị khối dời thật tới byte 4096 và nhớ vị trí của nó. Pipe — một dòng byte thuần tuý — từ chối với <code>ESPIPE</code> "Illegal seek". <code>/dev/zero</code> là vùng xám: Linux nhận lệnh seek nhưng bỏ qua, vì một dòng số 0 vô tận thì chẳng có vị trí nào.</p>
<p class="pitfall">⚠️ Câu FE kinh điển: bàn phím, chuột, modem, máy in, máy quét → ký tự (FE19#25, FE20#7, FE23#31); đĩa, CD-ROM, Blu-ray → khối (FE12#36, FE21#39); đồng hồ → <em>không thuộc nhóm nào</em> (FE22#35, đáp án "None of the other choices"). "Stream devices" KHÔNG phải một trong hai nhóm (FE17#22).</p>`],
      [3, 'I/O Devices (2)',
        `<p class="y-chinh">🎯 Figure 5-1: typical data rates span about nine orders of magnitude — from a keyboard at 10 bytes/sec to a SONET OC-768 network at 5 GB/sec. The I/O software must cope with all of them.</p>
<p>This spread is why there is no single "right" way to do I/O. For a keyboard, one interrupt per character costs nothing. For a 600 MB/s disk, one interrupt per byte would mean 600 million interrupts per second — impossible; the device must move whole blocks by itself (DMA, slide 6). For a 50 GB/s network card, even one interrupt per packet is too many, so modern drivers switch interrupts off under load and poll (Linux NAPI). The data rate of a device decides the I/O technique.</p>
<p>➕ The table is from 2015 and has aged: PCIe 3.0, USB 3.0 and SATA 3 are no longer the fast end. Here are the slide's devices next to 2026 standards (nominal rates of the specifications) and one rate measured for real in the container:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/78582a4f11e80088166a044125a39079a7536cd1.svg" alt="Figure 5-1 and 2026 on one log scale" loading="lazy" /><p class="chu-thich">🧮 Figure 5-1 and 2026 on one log scale</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const SLIDE = [
  ['Keyboard', 10], ['Mouse', 100], ['56K modem', 7e3], ['Scanner 300 dpi', 1e6], ['802.11n Wireless', 37.5e6], ['USB 2.0', 60e6],
  ['Gigabit Ethernet', 125e6], ['SATA 3 disk', 600e6], ['USB 3.0', 625e6], ['PCIe 3.0 x1', 985e6], ['Thunderbolt 2', 2.5e9], ['SONET OC-768', 5e9],
];
const NAY = [
  ['Wi-Fi 6 (802.11ax)', 1.2e9], ['PCIe 5.0 x1', 3.94e9], ['USB4 v2', 10e9], ['NVMe SSD, PCIe 5.0 x4', 15.8e9], ['400 Gigabit Ethernet', 50e9],
];
const DO = [['container disk, measured', 790e6]];
const dinhDang = (b) =&gt; (b &gt;= 1e9 ? &#96;&#36;{+(b / 1e9).toFixed(2)} GB/s&#96; : b &gt;= 1e6 ? &#96;&#36;{+(b / 1e6).toFixed(1)} MB/s&#96; : b &gt;= 1e3 ? &#96;&#36;{+(b / 1e3).toFixed(1)} KB/s&#96; : &#96;&#36;{b} B/s&#96;);</code></pre></details>
<p>The measurement itself — a memory-to-memory copy, then writing and reading 256 MB directly to the virtual disk:</p>
<div class="out"># Measure three data rates in the course container (one real run — numbers change from run to run and from machine to machine)<br>
# 1) memory to memory: the kernel copies zeros into nowhere<br>
$ dd if=/dev/zero of=/dev/null bs=1M count=4096 2&gt;&amp;1 | tail -1<br>
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 0.367074 s, 11.7 GB/s<br>
# 2) write 256 MB to the virtual disk, bypassing the page cache (O_DIRECT)<br>
$ dd if=/dev/zero of=/var/tmp/big bs=1M count=256 oflag=direct 2&gt;&amp;1 | tail -1<br>
268435456 bytes (268 MB, 256 MiB) copied, 0.339957 s, 790 MB/s<br>
# 3) read it back, again without the cache<br>
$ dd if=/var/tmp/big of=/dev/null bs=1M iflag=direct 2&gt;&amp;1 | tail -1<br>
268435456 bytes (268 MB, 256 MiB) copied, 0.293683 s, 914 MB/s</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Copying zeros inside the kernel runs at more than 10 GB/s; the "disk" — really a file on the Mac's SSD behind a virtual-machine layer — at several hundred MB/s. Same machine, more than a factor of ten apart: even inside one computer the I/O system serves very different speeds.</p>
<p class="meo">🧠 Units: rates of networks and buses are usually quoted in <em>bits</em> per second (USB4 v2 = 80 Gbit/s), disks in <em>bytes</em> per second. Divide bits by 8 before comparing (80 Gbit/s = 10 GB/s).</p>`,
        `<p class="y-chinh">🎯 Hình 5-1: tốc độ dữ liệu điển hình trải dài khoảng chín bậc độ lớn — từ bàn phím 10 byte/giây tới mạng SONET OC-768 5 GB/giây. Phần mềm I/O phải phục vụ được tất cả.</p>
<p>Khoảng chênh khổng lồ này là lý do không có một cách làm I/O "đúng" duy nhất. Với bàn phím, mỗi ký tự một ngắt chẳng tốn gì. Với đĩa 600 MB/s, mỗi byte một ngắt nghĩa là 600 triệu ngắt mỗi giây — bất khả thi; thiết bị phải tự chuyển cả khối (DMA, slide 6). Với card mạng 50 GB/s, ngay cả mỗi gói tin một ngắt cũng là quá nhiều, nên driver hiện đại tắt ngắt khi tải cao và chuyển sang hỏi vòng (polling) (NAPI của Linux). Tốc độ dữ liệu của thiết bị quyết định kỹ thuật I/O.</p>
<p>➕ Bảng này từ năm 2015 và đã cũ: PCIe 3.0, USB 3.0 và SATA 3 không còn là đầu nhanh nữa. Đây là các thiết bị của slide đặt cạnh chuẩn năm 2026 (tốc độ danh nghĩa theo đặc tả) và một tốc độ đo thật trong container:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/caa3925c14180cd0d5a6f21aadf3656b2f35bff1.svg" alt="Hình 5-1 và năm 2026 trên cùng một thang log" loading="lazy" /><p class="chu-thich">🧮 Hình 5-1 và năm 2026 trên cùng một thang log</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const SLIDE = [
  ['Keyboard', 10], ['Mouse', 100], ['56K modem', 7e3], ['Scanner 300 dpi', 1e6], ['802.11n Wireless', 37.5e6], ['USB 2.0', 60e6],
  ['Gigabit Ethernet', 125e6], ['SATA 3 disk', 600e6], ['USB 3.0', 625e6], ['PCIe 3.0 x1', 985e6], ['Thunderbolt 2', 2.5e9], ['SONET OC-768', 5e9],
];
const NAY = [
  ['Wi-Fi 6 (802.11ax)', 1.2e9], ['PCIe 5.0 x1', 3.94e9], ['USB4 v2', 10e9], ['NVMe SSD, PCIe 5.0 x4', 15.8e9], ['400 Gigabit Ethernet', 50e9],
];
const DO = [['container disk, measured', 790e6]];
const dinhDang = (b) =&gt; (b &gt;= 1e9 ? &#96;&#36;{+(b / 1e9).toFixed(2)} GB/s&#96; : b &gt;= 1e6 ? &#96;&#36;{+(b / 1e6).toFixed(1)} MB/s&#96; : b &gt;= 1e3 ? &#96;&#36;{+(b / 1e3).toFixed(1)} KB/s&#96; : &#96;&#36;{b} B/s&#96;);</code></pre></details>
<p>Chính phép đo đó — một lần chép bộ nhớ sang bộ nhớ, rồi ghi và đọc 256 MB thẳng xuống đĩa ảo:</p>
<div class="out"># Đo ba tốc độ dữ liệu trong container môn học (một lần chạy thật — số đổi theo lần chạy và theo máy)<br>
# 1) bộ nhớ sang bộ nhớ: nhân chép số 0 vào hư không<br>
$ dd if=/dev/zero of=/dev/null bs=1M count=4096 2&gt;&amp;1 | tail -1<br>
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 0.367074 s, 11.7 GB/s<br>
# 2) ghi 256 MB xuống đĩa ảo, bỏ qua page cache (O_DIRECT)<br>
$ dd if=/dev/zero of=/var/tmp/big bs=1M count=256 oflag=direct 2&gt;&amp;1 | tail -1<br>
268435456 bytes (268 MB, 256 MiB) copied, 0.339957 s, 790 MB/s<br>
# 3) đọc lại, cũng không qua cache<br>
$ dd if=/var/tmp/big of=/dev/null bs=1M iflag=direct 2&gt;&amp;1 | tail -1<br>
268435456 bytes (268 MB, 256 MiB) copied, 0.293683 s, 914 MB/s</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Chép số 0 ngay trong nhân chạy hơn 10 GB/s; "đĩa" — thật ra là một tệp trên SSD của máy Mac sau một lớp máy ảo — chạy vài trăm MB/s. Cùng một máy mà chênh hơn mười lần: ngay trong một máy tính, hệ thống I/O đã phải phục vụ những tốc độ rất khác nhau.</p>
<p class="meo">🧠 Đơn vị: tốc độ mạng và bus thường ghi theo <em>bit</em>/giây (USB4 v2 = 80 Gbit/s), đĩa theo <em>byte</em>/giây. Chia bit cho 8 trước khi so (80 Gbit/s = 10 GB/s).</p>`],
      [4, 'Memory-Mapped I/O (1)',
        `<p class="y-chinh">🎯 Figure 5-2: three ways for the CPU to reach a device controller's registers — (a) <strong>separate I/O and memory space</strong>: registers are numbered "I/O ports" read with special instructions such as <code>IN</code>/<code>OUT</code>; (b) <strong>memory-mapped I/O</strong>: registers get ordinary memory addresses and are read with ordinary loads and stores; (c) <strong>hybrid</strong>: memory-mapped data buffers plus separate I/O ports for the control registers (the x86 PC).</p>
<p>Every controller has a few registers: the OS writes commands into them ("read sector 1234"), and reads status from them ("busy", "done", "error"); many also have a data buffer. In scheme (a) the instruction <code>IN R0,4</code> reads I/O port 4 — a different place from memory word 4, although the number is the same. In scheme (b) there is no such instruction: a region of the address space, usually near the top, simply belongs to devices.</p>
<p>➕ The course container runs on ARM64, a pure memory-mapped machine. The physical address map shows device registers sitting right next to RAM:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Where do the device registers live? In the PHYSICAL address map, next to RAM (Figure 5-2b)<br>
$ grep -vE '^ {4}|reserved|0000:00' /proc/iomem<br>
10000000-1000ffff : GICD<br>
10010000-1014ffff : GICR<br>
20050000-20050fff : pl031<br>
&nbsp;&nbsp;20050000-20050fff : rtc-pl031<br>
20060000-20060fff : pl061<br>
&nbsp;&nbsp;20060000-20060fff : 20060000.pl061 pl061<br>
40000000-4fffffff : PCI ECAM<br>
50000000-6ffdffff : pci<br>
70000000-26fffffff : System RAM<br>
&nbsp;&nbsp;70000000-7202ffff : Kernel code<br>
&nbsp;&nbsp;72260000-725fffff : Kernel data<br>
280000000-67fffffff : pci<br>
# x86 also has a separate 64 KB I/O-port space (IN/OUT instructions). ARM64 has no such instructions:<br>
$ cat /proc/ioports<br>
00000000-0000ffff : pci<br>
$ uname -m<br>
aarch64</div>
<p>The interrupt controller (GIC) at <code>10000000</code>, the real-time clock <code>pl031</code> at <code>20050000</code>, PCI devices from <code>50000000</code>, and only from <code>70000000</code> on, real RAM. <code>/proc/ioports</code> still shows a 64 KB "pci" range — on ARM64 that is only a window inside memory space for old PCI cards; the CPU has no <code>IN</code>/<code>OUT</code> instructions at all. Now the real proof: read the clock chip's register with a normal C pointer:</p>
<pre><code class="language-c">// Memory-mapped I/O for real: read the clock chip's register with an ordinary memory load
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;time.h&gt;
#include &lt;sys/mman.h&gt;

#define RTC_BASE 0x20050000UL                 // physical address of the PL031 real-time clock (from /proc/iomem)

int main(void) {
    int fd = open("/dev/mem", O_RDONLY | O_SYNC);          // /dev/mem = physical memory, root only
    volatile uint32_t *rtc = mmap(NULL, 4096, PROT_READ, MAP_SHARED, fd, RTC_BASE);
    if (rtc == MAP_FAILED) { perror("mmap"); return 1; }
    uint32_t giay = rtc[0];                                // offset 0x000: RTCDR, seconds since 1970
    printf("RTC data register  : %u\\n", giay);
    printf("time() from kernel : %ld\\n", (long)time(NULL));
    // offsets 0xFE0-0xFE8: identification registers burned into the chip
    uint32_t id = (rtc[0xFE0 / 4] &amp; 0xFF) | (rtc[0xFE4 / 4] &amp; 0xFF) &lt;&lt; 8 | (rtc[0xFE8 / 4] &amp; 0x0F) &lt;&lt; 16;
    printf("peripheral ID      : 0x%05x -&gt; %s\\n", id, id == 0x41031 ? "ARM PrimeCell PL031" : "unknown");
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread doc-thanh-ghi.c -o doc-thanh-ghi &amp;&amp; ./doc-thanh-ghi<br>
RTC data register &nbsp;: 1792952243<br>
time() from kernel : 1792952243<br>
peripheral ID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 0x41031 -&gt; ARM PrimeCell PL031</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Reading <code>rtc[0]</code> is a plain memory load, yet the value comes from the clock chip, not from RAM — and it equals what the kernel's <code>time()</code> returns. The chip's identification registers even say what it is: an ARM PrimeCell PL031. That is memory-mapped I/O. (Root and <code>/dev/mem</code> are needed only because the OS normally keeps device addresses away from user programs — protection, slide 5.)</p>
<p class="pitfall">⚠️ FE asks the ways the CPU talks to control registers: separate I/O space, memory-mapped I/O, and the hybrid — "All of the other choices" (FE26#20).</p>`,
        `<p class="y-chinh">🎯 Hình 5-2: ba cách để CPU chạm tới thanh ghi của bộ điều khiển thiết bị (device controller) — (a) <strong>tách không gian I/O và bộ nhớ</strong>: thanh ghi được đánh số thành "cổng I/O (I/O port)", đọc bằng lệnh riêng như <code>IN</code>/<code>OUT</code>; (b) <strong>memory-mapped I/O</strong> (I/O ánh xạ vào bộ nhớ): thanh ghi được gán địa chỉ bộ nhớ bình thường và đọc/ghi bằng lệnh load/store bình thường; (c) <strong>lai (hybrid)</strong>: bộ đệm dữ liệu ánh xạ vào bộ nhớ, còn thanh ghi điều khiển dùng cổng I/O riêng (máy PC x86).</p>
<p>Bộ điều khiển nào cũng có vài thanh ghi: HĐH ghi lệnh vào đó ("đọc sector 1234"), và đọc trạng thái từ đó ("bận", "xong", "lỗi"); nhiều bộ còn có bộ đệm dữ liệu. Ở cách (a), lệnh <code>IN R0,4</code> đọc cổng I/O số 4 — một chỗ khác hẳn ô nhớ số 4, dù cùng con số. Ở cách (b) không có lệnh như vậy: một vùng của không gian địa chỉ, thường ở gần đỉnh, đơn giản là thuộc về thiết bị.</p>
<p>➕ Container của môn chạy trên ARM64, một máy memory-mapped thuần tuý. Bản đồ địa chỉ vật lý cho thấy thanh ghi thiết bị nằm ngay cạnh RAM:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Thanh ghi thiết bị nằm ở đâu? Trong bản đồ địa chỉ VẬT LÝ, cạnh RAM (Hình 5-2b)<br>
$ grep -vE '^ {4}|reserved|0000:00' /proc/iomem<br>
10000000-1000ffff : GICD<br>
10010000-1014ffff : GICR<br>
20050000-20050fff : pl031<br>
&nbsp;&nbsp;20050000-20050fff : rtc-pl031<br>
20060000-20060fff : pl061<br>
&nbsp;&nbsp;20060000-20060fff : 20060000.pl061 pl061<br>
40000000-4fffffff : PCI ECAM<br>
50000000-6ffdffff : pci<br>
70000000-26fffffff : System RAM<br>
&nbsp;&nbsp;70000000-7202ffff : Kernel code<br>
&nbsp;&nbsp;72260000-725fffff : Kernel data<br>
280000000-67fffffff : pci<br>
# x86 còn có không gian cổng I/O riêng 64 KB (lệnh IN/OUT). ARM64 không có các lệnh đó:<br>
$ cat /proc/ioports<br>
00000000-0000ffff : pci<br>
$ uname -m<br>
aarch64</div>
<p>Bộ điều khiển ngắt (GIC) ở <code>10000000</code>, đồng hồ thời gian thực <code>pl031</code> ở <code>20050000</code>, thiết bị PCI từ <code>50000000</code>, và chỉ từ <code>70000000</code> trở đi mới là RAM thật. <code>/proc/ioports</code> vẫn hiện một dải "pci" 64 KB — trên ARM64 đó chỉ là một cửa sổ nằm trong không gian bộ nhớ dành cho card PCI đời cũ; CPU hoàn toàn không có lệnh <code>IN</code>/<code>OUT</code>. Giờ là bằng chứng thật: đọc thanh ghi của chip đồng hồ bằng một con trỏ C bình thường:</p>
<pre><code class="language-c">// Memory-mapped I/O thật: đọc thanh ghi của chip đồng hồ bằng một lệnh đọc bộ nhớ bình thường
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;time.h&gt;
#include &lt;sys/mman.h&gt;

#define RTC_BASE 0x20050000UL                 // địa chỉ vật lý của đồng hồ thời gian thực PL031 (lấy từ /proc/iomem)

int main(void) {
    int fd = open("/dev/mem", O_RDONLY | O_SYNC);          // /dev/mem = bộ nhớ vật lý, chỉ root
    volatile uint32_t *rtc = mmap(NULL, 4096, PROT_READ, MAP_SHARED, fd, RTC_BASE);
    if (rtc == MAP_FAILED) { perror("mmap"); return 1; }
    uint32_t giay = rtc[0];                                // offset 0x000: RTCDR, số giây từ 1970
    printf("RTC data register  : %u\\n", giay);
    printf("time() from kernel : %ld\\n", (long)time(NULL));
    // offset 0xFE0-0xFE8: thanh ghi định danh khắc sẵn trong chip
    uint32_t id = (rtc[0xFE0 / 4] &amp; 0xFF) | (rtc[0xFE4 / 4] &amp; 0xFF) &lt;&lt; 8 | (rtc[0xFE8 / 4] &amp; 0x0F) &lt;&lt; 16;
    printf("peripheral ID      : 0x%05x -&gt; %s\\n", id, id == 0x41031 ? "ARM PrimeCell PL031" : "unknown");
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread doc-thanh-ghi.c -o doc-thanh-ghi &amp;&amp; ./doc-thanh-ghi<br>
RTC data register &nbsp;: 1792952243<br>
time() from kernel : 1792952243<br>
peripheral ID &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 0x41031 -&gt; ARM PrimeCell PL031</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc <code>rtc[0]</code> là một lệnh đọc bộ nhớ bình thường, vậy mà giá trị đến từ chip đồng hồ chứ không từ RAM — và nó bằng đúng thứ <code>time()</code> của nhân trả về. Các thanh ghi định danh của chip còn tự khai nó là gì: ARM PrimeCell PL031. Đó chính là memory-mapped I/O. (Cần root và <code>/dev/mem</code> chỉ vì bình thường HĐH giữ địa chỉ thiết bị khỏi tay chương trình người dùng — bảo vệ, slide 5.)</p>
<p class="pitfall">⚠️ FE hỏi CPU giao tiếp với thanh ghi điều khiển bằng cách nào: tách không gian I/O, memory-mapped I/O, và kiểu lai — đáp án "All of the other choices" (FE26#20).</p>`],
      [5, 'Memory-Mapped I/O (2)',
        `<p class="y-chinh">🎯 Figure 5-3: (a) with a <strong>single bus</strong>, every address — memory or I/O — goes over the same bus, so each device simply watches for its addresses; (b) with a <strong>dual-bus</strong> architecture, the CPU talks to memory over a dedicated high-bandwidth bus, and memory-mapped devices on the other bus never see those addresses — a complication for memory-mapped I/O.</p>
<p>The book weighs the two schemes. <strong>For memory-mapped I/O:</strong> drivers can be written entirely in C (a register is just a <code>volatile</code> pointer, as in slide 4's program), no special instructions are needed, and protection is free — the OS simply does not map device pages into user address spaces, or maps one device's page into exactly one driver process. Every instruction that tests memory can test a status register too. <strong>Against it:</strong> (1) <strong>caching</strong> — if a status register were cached, a loop waiting for "ready" would read the stale cached value forever; the hardware must be able to turn caching off page by page. (2) With separate buses, as in (b), the memory addresses must be filtered or re-sent to the I/O bus (on the PC the PCI bridge chip does this).</p>
<p>➕ In C, the keyword <code>volatile</code> in slide 4's program is the software half of the same problem: it forbids the <em>compiler</em> from keeping the register value in a CPU register, so every read really goes to the device. The <code>O_SYNC</code> flag asks the kernel for an uncached mapping — the hardware half.</p>
<p class="pitfall">⚠️ FE4#35: to keep the driver from looping forever while waiting for a memory-mapped device, the hardware must "selectively disable caching". FE17#9 and FE18#28 test the trade-offs: caching a device control register is the <em>disadvantage</em> of memory-mapped I/O; with separate I/O space drivers need assembly code and two instructions to test a register.</p>
<div class="callout">🧭 On a real server: when a Linux driver maps device registers it calls <code>ioremap()</code>, which creates an uncached mapping — exactly the "selectively disable caching" of the book. PCIe devices such as NVMe SSDs expose their registers this way (BARs, the "pci" lines of <code>/proc/iomem</code>).</div>`,
        `<p class="y-chinh">🎯 Hình 5-3: (a) với <strong>một bus duy nhất (single bus)</strong>, mọi địa chỉ — bộ nhớ hay I/O — đều đi qua cùng một bus, nên thiết bị nào cũng chỉ việc canh địa chỉ của mình; (b) với kiến trúc <strong>hai bus (dual-bus)</strong>, CPU nói chuyện với bộ nhớ qua một bus riêng băng thông cao, và thiết bị ánh xạ vào bộ nhớ ở bus kia không bao giờ thấy các địa chỉ đó — một rắc rối cho memory-mapped I/O.</p>
<p>Sách cân hai cách. <strong>Ủng hộ memory-mapped I/O:</strong> driver viết hoàn toàn bằng C được (thanh ghi chỉ là một con trỏ <code>volatile</code>, như chương trình ở slide 4), không cần lệnh đặc biệt, và bảo vệ có sẵn — HĐH chỉ việc không ánh xạ trang thiết bị vào không gian địa chỉ người dùng, hoặc ánh xạ trang của một thiết bị cho đúng một tiến trình driver. Lệnh nào kiểm được bộ nhớ thì cũng kiểm được thanh ghi trạng thái. <strong>Chống lại:</strong> (1) <strong>cache</strong> — nếu thanh ghi trạng thái bị lưu trong cache, vòng lặp chờ "sẵn sàng" sẽ đọc mãi giá trị cũ trong cache; phần cứng phải tắt được cache theo từng trang. (2) Khi có bus riêng như (b), các địa chỉ bộ nhớ phải được lọc hoặc gửi lại sang bus I/O (trên PC việc đó do chip cầu PCI làm).</p>
<p>➕ Trong C, từ khoá <code>volatile</code> ở chương trình slide 4 là nửa phần mềm của cùng bài toán: nó cấm <em>trình biên dịch</em> giữ giá trị thanh ghi trong một thanh ghi CPU, để lần đọc nào cũng thật sự đi tới thiết bị. Cờ <code>O_SYNC</code> xin nhân một ánh xạ không cache — nửa phần cứng.</p>
<p class="pitfall">⚠️ FE4#35: để driver không lặp vô tận khi chờ một thiết bị memory-mapped, phần cứng phải "selectively disable caching" (tắt cache có chọn lọc). FE17#9 và FE18#28 hỏi các đánh đổi: cache một thanh ghi điều khiển là <em>nhược điểm</em> của memory-mapped I/O; còn với không gian I/O riêng thì driver cần mã hợp ngữ và hai lệnh để kiểm một thanh ghi.</p>
<div class="callout">🧭 Trên server thật: khi một driver Linux ánh xạ thanh ghi thiết bị, nó gọi <code>ioremap()</code>, hàm tạo ra ánh xạ không cache — đúng "tắt cache có chọn lọc" của sách. Thiết bị PCIe như SSD NVMe phơi thanh ghi theo cách này (các BAR, chính là những dòng "pci" trong <code>/proc/iomem</code>).</div>`],
      [6, 'Direct Memory Access',
        `<p class="y-chinh">🎯 Figure 5-4: a DMA transfer. (1) The CPU programs the <strong>DMA controller</strong> — memory address, byte count, direction — and tells the disk controller to read; (2) the DMA controller asks the disk controller to put the next word on the bus; (3) the word goes straight into main memory; (4) the disk controller acknowledges; repeat until the count is zero, then the DMA controller <strong>interrupts</strong> the CPU.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b4e26446f7597492a661a6b81c7867183fc95871.svg" alt="Figure 5-4 as a sequence diagram — the CPU appears only at the start and at the end" loading="lazy" /><p class="chu-thich">🧩 Figure 5-4 as a sequence diagram — the CPU appears only at the start and at the end</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 5-4 as a sequence: the DMA controller moves the data, the CPU only starts and finishes
participant "CPU\\n(driver code)" as CPU
participant "DMA controller\\n(address, count, control)" as DMA
participant "Disk controller\\n(internal buffer)" as DC
participant "Main memory" as MEM
CPU -&gt; DMA : 1. program it: address = buffer, count = 4096,\\ncontrol = "disk -&gt; memory"
CPU -&gt; DC : also tell the disk: "read block 1234"
note over CPU : the CPU runs another process now
DC -&gt; DC : read the block into its buffer,\\ncheck the ECC
loop until count = 0
  DMA -&gt; DC : 2. request: "put the next word on the bus\\nfor address A"
  DC -&gt; MEM : 3. data transferred (word goes to address A)
  DC -&gt; DMA : 4. acknowledge
  DMA -&gt; DMA : A = A + word size, count = count - 1
end
DMA -&gt; CPU : interrupt: "transfer done"
CPU -&gt; CPU : interrupt handler: block is already in memory,\\nwake up the waiting process
@enduml</code></pre></details>
<p>Without DMA the CPU would copy every word from the controller's buffer to memory in a loop — wasting CPU time exactly when the system is busiest. With DMA, when the interrupt arrives the block is already in memory. The book adds the details the FE loves: buses can work in <strong>word-at-a-time mode</strong> (the DMA controller steals one bus cycle now and then — <strong>cycle stealing</strong>) or <strong>block mode</strong> (it grabs the bus, transfers a series of words, releases it — <strong>burst mode</strong>); in <strong>fly-by mode</strong> the data go directly from device to memory, otherwise through the DMA controller. DMA controllers use <strong>physical</strong> addresses, so the OS must translate the buffer's virtual address first. And the main CPU is usually much faster than the DMA controller — if the CPU has nothing else to do, DMA buys nothing.</p>
<p>➕ The idea is measured for real on slide 14, where the same string is printed three ways and the CPU time of each is counted.</p>
<p class="pitfall">⚠️ FE question bank on this slide: purpose of DMA = devices transfer to/from memory without CPU intervention (FE2#21, FE6#30); two bus modes = word-at-a-time and block mode (FE3#30, FE10#41); "acquire the bus, do a series of transfers, release" = burst mode (FE5#36); "steals an occasional bus cycle" = cycle stealing (FE22#14); addresses used = physical memory (FE6#34, FE10#43); information the CPU gives = device address, memory address and word count — "All of the other choices" (FE17#40, FE20#40); FALSE statements: "DMA is a software solution" (FE20#23), "the DMA controller is usually faster than the CPU" (FE26#46).</p>`,
        `<p class="y-chinh">🎯 Hình 5-4: một lần truyền DMA (Direct Memory Access — truy cập bộ nhớ trực tiếp). (1) CPU lập trình <strong>bộ điều khiển DMA</strong> — địa chỉ bộ nhớ, số byte, chiều truyền — và bảo bộ điều khiển đĩa đọc; (2) bộ DMA yêu cầu bộ điều khiển đĩa đặt từ (word) kế tiếp lên bus; (3) từ đó đi thẳng vào bộ nhớ chính; (4) bộ điều khiển đĩa xác nhận (acknowledge); lặp tới khi bộ đếm về 0, rồi bộ DMA <strong>ngắt</strong> CPU.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b4e26446f7597492a661a6b81c7867183fc95871.svg" alt="Hình 5-4 dạng sơ đồ tuần tự — CPU chỉ xuất hiện ở đầu và ở cuối" loading="lazy" /><p class="chu-thich">🧩 Hình 5-4 dạng sơ đồ tuần tự — CPU chỉ xuất hiện ở đầu và ở cuối</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 5-4 dạng tuần tự: bộ điều khiển DMA chuyển dữ liệu, CPU chỉ khởi động và kết thúc
participant "CPU\\n(driver code)" as CPU
participant "DMA controller\\n(address, count, control)" as DMA
participant "Disk controller\\n(internal buffer)" as DC
participant "Main memory" as MEM
CPU -&gt; DMA : 1. program it: address = buffer, count = 4096,\\ncontrol = "disk -&gt; memory"
CPU -&gt; DC : also tell the disk: "read block 1234"
note over CPU : the CPU runs another process now
DC -&gt; DC : read the block into its buffer,\\ncheck the ECC
loop until count = 0
  DMA -&gt; DC : 2. request: "put the next word on the bus\\nfor address A"
  DC -&gt; MEM : 3. data transferred (word goes to address A)
  DC -&gt; DMA : 4. acknowledge
  DMA -&gt; DMA : A = A + word size, count = count - 1
end
DMA -&gt; CPU : interrupt: "transfer done"
CPU -&gt; CPU : interrupt handler: block is already in memory,\\nwake up the waiting process
@enduml</code></pre></details>
<p>Không có DMA, CPU phải tự chép từng từ từ bộ đệm của bộ điều khiển sang bộ nhớ trong một vòng lặp — phí thời gian CPU đúng lúc hệ thống bận nhất. Có DMA, khi ngắt tới thì khối dữ liệu đã nằm sẵn trong bộ nhớ. Sách thêm những chi tiết FE rất thích: bus có thể làm việc ở <strong>chế độ từng từ (word-at-a-time)</strong> (bộ DMA thỉnh thoảng "lấy trộm" một chu kỳ bus — <strong>cycle stealing</strong>) hoặc <strong>chế độ khối (block mode)</strong> (nó chiếm bus, truyền một loạt từ, rồi nhả bus — <strong>burst mode</strong>); ở <strong>chế độ fly-by</strong> dữ liệu đi thẳng từ thiết bị vào bộ nhớ, nếu không thì đi qua bộ DMA. Bộ DMA dùng địa chỉ <strong>vật lý</strong>, nên HĐH phải dịch địa chỉ ảo của bộ đệm trước. Và CPU chính thường nhanh hơn bộ DMA nhiều — nếu CPU chẳng có việc gì khác để làm thì DMA chẳng được lợi gì.</p>
<p>➕ Ý này được đo thật ở slide 14, nơi cùng một chuỗi được in theo ba cách và thời gian CPU của mỗi cách được đếm.</p>
<p class="pitfall">⚠️ Ngân hàng FE về slide này: mục đích của DMA = thiết bị truyền tới/từ bộ nhớ mà CPU không can thiệp (FE2#21, FE6#30); hai chế độ bus = word-at-a-time và block mode (FE3#30, FE10#41); "chiếm bus, truyền một loạt, nhả bus" = burst mode (FE5#36); "lấy trộm thỉnh thoảng một chu kỳ bus" = cycle stealing (FE22#14); địa chỉ dùng = bộ nhớ vật lý (FE6#34, FE10#43); thông tin CPU đưa = địa chỉ thiết bị, địa chỉ bộ nhớ và số từ — "All of the other choices" (FE17#40, FE20#40); phát biểu SAI: "DMA là giải pháp phần mềm" (FE20#23), "bộ DMA thường nhanh hơn CPU" (FE26#46).</p>`],
      [7, 'Interrupts Revisited',
        `<p class="y-chinh">🎯 Figure 5-5: how an interrupt happens — (1) a device finishes its work and asserts a signal on its interrupt line; (2) the <strong>interrupt controller</strong> passes it on to the CPU (if no higher-priority interrupt is being served); (3) the CPU acknowledges the interrupt, and the controller puts the device's number on the bus.</p>
<p>The number is an index into the <strong>interrupt vector</strong> — a table in memory whose entries are the start addresses of the interrupt service procedures. The CPU saves at least the program counter (and usually the PSW) — on the stack or in special registers — switches to kernel mode, and jumps to the procedure for that device. Priorities settle conflicts: if two devices interrupt together, the controller serves the more urgent one first; the other stays pending. The figure shows separate wires; in reality the lines are part of the bus (and on PCIe they are even messages, "MSI").</p>
<p>➕ Find the disk's own interrupt line and watch it fire while 64 MB are written directly to the disk:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Which interrupt line belongs to the disk vda? Ask sysfs, then look it up in /proc/interrupts<br>
$ d=$(basename "$(readlink /sys/block/vda/device)"); echo "vda is device $d"<br>
vda is device virtio2<br>
$ grep -E " $d\\$" /proc/interrupts | tr -s ' '<br>
&nbsp;16: 1682767 0 0 0 0 0 0 0 0 0 GICv3 70 Level virtio2<br>
# Count the disk's interrupts while we write 64 MB straight to the disk<br>
$ a=$(irq); s1=$(soft)<br>
$ dd if=/dev/zero of=/var/tmp/x bs=1M count=64 oflag=direct status=none<br>
$ b=$(irq); s2=$(soft)<br>
$ echo "disk interrupts during the write: $((b - a))"<br>
disk interrupts during the write: 81<br>
# Each hard interrupt leaves the slow part of the work to a "softirq" (the bottom half, slide 17)<br>
$ echo "BLOCK softirqs during the write: $((s2 - s1))"<br>
BLOCK softirqs during the write: 71</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The kernel says the disk <code>vda</code> is virtio device <code>virtio2</code>, wired to interrupt 16 (line 70 of the ARM interrupt controller "GICv3"); every number in its row is a per-CPU count since boot — all on CPU0, which handles this line. During the write the line fired dozens of times: not once per byte, not even once per 4 KB block, but once per batch of finished requests — the efficiency the previous slide promised. (Chapter 1's lesson 1.A counted ALL interrupts per second; here we isolate one device.)</p>
<p class="pitfall">⚠️ "The number on the address lines used as an index into a table to fetch a new program counter" = <strong>interrupt vector</strong> (FE11#34); the table of handler addresses = interrupt vector (table) (FE17#17, FE19#21, FE26#32). "Which action causes an EXTERNAL interrupt?" — an I/O operation completed; page fault, system call and division by zero are internal (FE24#48).</p>`,
        `<p class="y-chinh">🎯 Hình 5-5: một ngắt xảy ra thế nào — (1) thiết bị làm xong việc và bật tín hiệu trên đường ngắt của nó; (2) <strong>bộ điều khiển ngắt (interrupt controller)</strong> chuyển tiếp tới CPU (nếu không có ngắt ưu tiên cao hơn đang được phục vụ); (3) CPU xác nhận ngắt, và bộ điều khiển đặt số hiệu thiết bị lên bus.</p>
<p>Số hiệu đó là chỉ số vào <strong>vector ngắt (interrupt vector)</strong> — một bảng trong bộ nhớ mà mỗi ô là địa chỉ bắt đầu của một thủ tục phục vụ ngắt. CPU lưu ít nhất bộ đếm chương trình (và thường cả PSW) — trên ngăn xếp hoặc trong thanh ghi đặc biệt — chuyển sang chế độ nhân, rồi nhảy tới thủ tục của thiết bị đó. Mức ưu tiên giải quyết tranh chấp: hai thiết bị cùng ngắt thì bộ điều khiển phục vụ cái gấp hơn trước; cái kia nằm chờ. Hình vẽ các dây riêng; thực tế các đường ngắt là một phần của bus (và trên PCIe chúng còn là thông điệp, "MSI").</p>
<p>➕ Tìm đúng đường ngắt của đĩa và xem nó "nổ" trong lúc ghi thẳng 64 MB xuống đĩa:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Đường ngắt nào thuộc về đĩa vda? Hỏi sysfs, rồi tra trong /proc/interrupts<br>
$ d=$(basename "$(readlink /sys/block/vda/device)"); echo "vda is device $d"<br>
vda is device virtio2<br>
$ grep -E " $d\\$" /proc/interrupts | tr -s ' '<br>
&nbsp;16: 1682767 0 0 0 0 0 0 0 0 0 GICv3 70 Level virtio2<br>
# Đếm số ngắt của đĩa trong lúc ghi thẳng 64 MB xuống đĩa<br>
$ a=$(irq); s1=$(soft)<br>
$ dd if=/dev/zero of=/var/tmp/x bs=1M count=64 oflag=direct status=none<br>
$ b=$(irq); s2=$(soft)<br>
$ echo "disk interrupts during the write: $((b - a))"<br>
disk interrupts during the write: 81<br>
# Mỗi ngắt cứng để phần việc chậm lại cho một "softirq" (nửa dưới, slide 17)<br>
$ echo "BLOCK softirqs during the write: $((s2 - s1))"<br>
BLOCK softirqs during the write: 71</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Nhân cho biết đĩa <code>vda</code> là thiết bị virtio <code>virtio2</code>, nối vào ngắt số 16 (đường 70 của bộ điều khiển ngắt ARM "GICv3"); mỗi con số trên dòng đó là số lần ngắt của từng CPU kể từ lúc khởi động — dồn hết ở CPU0, CPU phụ trách đường này. Trong lúc ghi, đường ngắt nổ vài chục lần: không phải mỗi byte một lần, cũng không phải mỗi khối 4 KB một lần, mà mỗi mẻ yêu cầu đã xong một lần — đúng sự tiết kiệm slide trước hứa hẹn. (Bài 1.A của Chương 1 đếm TẤT CẢ ngắt mỗi giây; ở đây ta tách riêng một thiết bị.)</p>
<p class="pitfall">⚠️ "Con số trên đường địa chỉ dùng làm chỉ số vào một bảng để lấy bộ đếm chương trình mới" = <strong>interrupt vector</strong> (FE11#34); bảng chứa địa chỉ các trình xử lý = interrupt vector (table) (FE17#17, FE19#21, FE26#32). "Hành động nào gây ngắt NGOÀI?" — một thao tác I/O hoàn tất; lỗi trang, lời gọi hệ thống và chia cho 0 là ngắt trong (FE24#48).</p>`],
      [8, 'Precise Interrupt',
        `<p class="y-chinh">🎯 An interrupt that leaves the machine in a well-defined state is a <strong>precise interrupt</strong>, with four properties: (1) the PC is saved in a known place; (2) all instructions before the one pointed to by the PC have fully executed; (3) no instruction beyond it has been executed; (4) the execution state of the instruction pointed to by the PC is known.</p>
<p>Why it is hard: modern CPUs are pipelined and superscalar (lesson 1.A, slide 12) — at any moment dozens of instructions are half done, some even executed out of order. When an interrupt or a fault arrives, "where were we?" has no simple answer unless the hardware cleans up. Property 4 is subtle: it does not say the instruction at the PC has not started — it may have run partly; but then the state must be known, so it can be restarted or completed. A precise interrupt lets the OS simply save the registers, handle the event and return; the program continues as if nothing had happened.</p>
<p>➕ That "continue as if nothing happened" is the basis of demand paging (Chapter 3): a store to a page that is not ready faults, the OS fixes the cause, returns — and <em>the same store</em> runs again. Here it is for real, with a signal handler playing the role of the OS:</p>
<pre><code class="language-c">// Precise exceptions in action: fix the cause, return, and the SAME instruction runs again
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;signal.h&gt;
#include &lt;ucontext.h&gt;
#include &lt;sys/mman.h&gt;

static char *trang;                 // one page, mapped READ-ONLY
static uintptr_t pc_loi, dia_chi_loi;
static int so_lan;

static void ghi(char *p) { p[100] = 'X'; }   // a single store instruction will fault
static void sau_ghi(void) { }                  // marks the end of ghi() in memory

static void xu_ly(int sig, siginfo_t *si, void *ctx) {
    ucontext_t *uc = ctx;
#if defined(__aarch64__)
    pc_loi = uc-&gt;uc_mcontext.pc;                    // the saved PC (property 1: "saved in a known place")
#elif defined(__x86_64__)
    pc_loi = uc-&gt;uc_mcontext.gregs[REG_RIP];
#endif
    dia_chi_loi = (uintptr_t)si-&gt;si_addr;
    so_lan++;
    mprotect(trang, 4096, PROT_READ | PROT_WRITE);  // remove the cause, like the OS loading a missing page
}                                                    // returning = restart AT the saved PC

int main(void) {
    trang = mmap(NULL, 4096, PROT_READ, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    struct sigaction sa = { .sa_sigaction = xu_ly, .sa_flags = SA_SIGINFO };
    sigaction(SIGSEGV, &amp;sa, NULL);
    ghi(trang);
    printf("faults handled            : %d\\n", so_lan);
    printf("faulting data address     : page + %lu\\n", (unsigned long)(dia_chi_loi - (uintptr_t)trang));
    int trong = pc_loi &gt;= (uintptr_t)ghi &amp;&amp; pc_loi &lt; (uintptr_t)sau_ghi;
    printf("saved PC inside ghi()?    : %s (byte %lu of the function)\\n", trong ? "yes" : "no", (unsigned long)(pc_loi - (uintptr_t)ghi));
    printf("after the restart, p[100] : '%c'\\n", trang[100]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chinh-xac.c -o chinh-xac &amp;&amp; ./chinh-xac<br>
faults handled &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1<br>
faulting data address &nbsp;&nbsp;&nbsp;&nbsp;: page + 100<br>
saved PC inside ghi()? &nbsp;&nbsp;&nbsp;: yes (byte 20 of the function)<br>
after the restart, p[100] : 'X'</div>
<p>The fault was reported once, at exactly the byte the program tried to write (<code>page + 100</code>), with the saved PC pointing inside <code>ghi()</code> — the faulting instruction itself. The handler made the page writable and returned; the CPU re-executed that one instruction, and this time <code>p[100]</code> became <code>'X'</code>. Nothing before it ran twice, nothing after it ran early: precise.</p>
<p class="pitfall">⚠️ The four properties word for word are an FE question; the answer is "precise interrupt" (FE1#10, FE5#37, FE7#34). The short form "an interrupt that leaves the machine in a well-defined state" — same answer (FE19#50, FE24#47).</p>`,
        `<p class="y-chinh">🎯 Ngắt để lại máy ở một trạng thái xác định rõ ràng gọi là <strong>ngắt chính xác (precise interrupt)</strong>, với bốn tính chất: (1) PC được lưu ở một chỗ đã biết; (2) mọi lệnh đứng trước lệnh PC đang trỏ đã thực thi xong hoàn toàn; (3) không lệnh nào đứng sau nó đã được thực thi; (4) trạng thái thực thi của lệnh PC đang trỏ là xác định.</p>
<p>Vì sao khó: CPU hiện đại có pipeline và siêu vô hướng (bài 1.A, slide 12) — lúc nào cũng có hàng chục lệnh đang làm dở, có lệnh còn chạy không theo thứ tự (out of order). Khi một ngắt hay một lỗi ập tới, câu hỏi "ta đang ở đâu?" không có câu trả lời đơn giản trừ khi phần cứng dọn dẹp giúp. Tính chất 4 khá tinh tế: nó không nói lệnh tại PC chưa bắt đầu — có thể nó đã chạy một phần; nhưng khi đó trạng thái phải được biết, để có thể chạy lại hoặc làm nốt. Ngắt chính xác cho HĐH chỉ việc lưu thanh ghi, xử lý sự kiện rồi quay về; chương trình chạy tiếp như chưa hề có gì xảy ra.</p>
<p>➕ Chính chuyện "chạy tiếp như chưa có gì" là nền tảng của phân trang theo yêu cầu (Chương 3): một lệnh ghi vào trang chưa sẵn sàng gây lỗi, HĐH sửa nguyên nhân, quay về — và <em>đúng lệnh ghi đó</em> chạy lại. Đây là nó khi chạy thật, với một hàm xử lý tín hiệu đóng vai HĐH:</p>
<pre><code class="language-c">// Ngắt chính xác khi chạy thật: sửa nguyên nhân, quay về, và CHÍNH lệnh đó chạy lại
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;signal.h&gt;
#include &lt;ucontext.h&gt;
#include &lt;sys/mman.h&gt;

static char *trang;                 // một trang, ánh xạ CHỈ ĐỌC
static uintptr_t pc_loi, dia_chi_loi;
static int so_lan;

static void ghi(char *p) { p[100] = 'X'; }   // một lệnh ghi duy nhất sẽ gây lỗi
static void sau_ghi(void) { }                  // đánh dấu chỗ kết thúc ghi() trong bộ nhớ

static void xu_ly(int sig, siginfo_t *si, void *ctx) {
    ucontext_t *uc = ctx;
#if defined(__aarch64__)
    pc_loi = uc-&gt;uc_mcontext.pc;                    // PC đã lưu (tính chất 1: "lưu ở chỗ đã biết")
#elif defined(__x86_64__)
    pc_loi = uc-&gt;uc_mcontext.gregs[REG_RIP];
#endif
    dia_chi_loi = (uintptr_t)si-&gt;si_addr;
    so_lan++;
    mprotect(trang, 4096, PROT_READ | PROT_WRITE);  // gỡ nguyên nhân, giống HĐH nạp trang còn thiếu
}                                                    // quay về = chạy lại ĐÚNG tại PC đã lưu

int main(void) {
    trang = mmap(NULL, 4096, PROT_READ, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    struct sigaction sa = { .sa_sigaction = xu_ly, .sa_flags = SA_SIGINFO };
    sigaction(SIGSEGV, &amp;sa, NULL);
    ghi(trang);
    printf("faults handled            : %d\\n", so_lan);
    printf("faulting data address     : page + %lu\\n", (unsigned long)(dia_chi_loi - (uintptr_t)trang));
    int trong = pc_loi &gt;= (uintptr_t)ghi &amp;&amp; pc_loi &lt; (uintptr_t)sau_ghi;
    printf("saved PC inside ghi()?    : %s (byte %lu of the function)\\n", trong ? "yes" : "no", (unsigned long)(pc_loi - (uintptr_t)ghi));
    printf("after the restart, p[100] : '%c'\\n", trang[100]);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chinh-xac.c -o chinh-xac &amp;&amp; ./chinh-xac<br>
faults handled &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1<br>
faulting data address &nbsp;&nbsp;&nbsp;&nbsp;: page + 100<br>
saved PC inside ghi()? &nbsp;&nbsp;&nbsp;: yes (byte 20 of the function)<br>
after the restart, p[100] : 'X'</div>
<p>Lỗi được báo đúng một lần, tại đúng byte chương trình định ghi (<code>page + 100</code>), với PC đã lưu trỏ vào bên trong <code>ghi()</code> — chính lệnh gây lỗi. Hàm xử lý cho trang được ghi rồi quay về; CPU chạy lại đúng một lệnh đó, và lần này <code>p[100]</code> thành <code>'X'</code>. Không lệnh nào phía trước bị chạy hai lần, không lệnh nào phía sau chạy sớm: chính xác.</p>
<p class="pitfall">⚠️ Bốn tính chất chép nguyên văn là một câu FE; đáp án "precise interrupt" (FE1#10, FE5#37, FE7#34). Dạng ngắn "ngắt để lại máy ở trạng thái xác định rõ ràng" — cùng đáp án (FE19#50, FE24#47).</p>`],
      [9, 'Precise vs. Imprecise',
        `<p class="y-chinh">🎯 Figure 5-6: (a) a <strong>precise</strong> interrupt — the PC points at 316; every instruction below it (300–312) is "fully executed", every instruction above it (316–332) "not executed"; (b) an <strong>imprecise</strong> interrupt — instructions near the PC are 10%, 40%, 35%, 20%, 60%, 80% executed, all at once.</p>
<p>Picture (b) is what a pipelined, out-of-order CPU really contains at the moment of an interrupt. An imprecise interrupt makes the OS's life hard: the CPU dumps a large amount of internal state on the stack, and the OS must work out what was done and what was not — slow, complicated, and often impossible to restart cleanly. Some old high-end machines simply allowed imprecise interrupts for asynchronous events. The book's conclusion: making interrupts precise costs extra logic and chip area inside the CPU (the hardware must drain or roll back the pipeline), but it keeps the OS simple — and the market prefers that. On x86 and ARM, page faults and other exceptions are precise; that is what slide 8's program relied on.</p>
<p>➕ Precise vs imprecise in one table:</p>
<table>
<thead><tr><th>Question</th><th>Precise (a)</th><th>Imprecise (b)</th></tr></thead>
<tbody>
<tr><td>Where is the PC saved?</td><td>a known place (stack or register)</td><td>somewhere, plus lots of internal state</td></tr>
<tr><td>Instructions before the PC</td><td>all finished</td><td>some partly finished</td></tr>
<tr><td>Instructions after the PC</td><td>none started</td><td>some already started or finished</td></tr>
<tr><td>What must the OS do?</td><td>save registers, handle, return</td><td>decode the dumped state, finish or undo work</td></tr>
<tr><td>Cost</td><td>extra CPU hardware</td><td>a complex, slow OS handler</td></tr>
</tbody>
</table>
<p class="meo">🧠 Precise = "a clean cut between done and not done". Imprecise = "a messy cut, the OS must sort it out".</p>`,
        `<p class="y-chinh">🎯 Hình 5-6: (a) ngắt <strong>chính xác (precise)</strong> — PC trỏ tới 316; mọi lệnh bên dưới (300–312) đều "fully executed" (xong hẳn), mọi lệnh bên trên (316–332) đều "not executed" (chưa chạy); (b) ngắt <strong>không chính xác (imprecise)</strong> — các lệnh quanh PC đã chạy 10%, 40%, 35%, 20%, 60%, 80%, tất cả cùng lúc.</p>
<p>Hình (b) chính là thứ một CPU có pipeline và chạy không theo thứ tự thật sự chứa ở thời điểm ngắt. Ngắt không chính xác làm khổ HĐH: CPU đổ một lượng lớn trạng thái bên trong ra ngăn xếp, và HĐH phải tự tìm ra việc nào đã làm, việc nào chưa — chậm, phức tạp, và thường không thể chạy lại cho sạch. Vài máy cao cấp đời cũ cho phép ngắt không chính xác với các sự kiện bất đồng bộ. Kết luận của sách: làm ngắt chính xác tốn thêm mạch và diện tích chip trong CPU (phần cứng phải xả hoặc quay lui pipeline), nhưng giữ cho HĐH đơn giản — và thị trường chuộng điều đó. Trên x86 và ARM, lỗi trang và các ngoại lệ khác là chính xác; đó là điều chương trình ở slide 8 dựa vào.</p>
<p>➕ Chính xác và không chính xác trong một bảng:</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Chính xác (a)</th><th>Không chính xác (b)</th></tr></thead>
<tbody>
<tr><td>PC được lưu ở đâu?</td><td>một chỗ đã biết (ngăn xếp hoặc thanh ghi)</td><td>đâu đó, kèm rất nhiều trạng thái bên trong</td></tr>
<tr><td>Các lệnh trước PC</td><td>đều xong</td><td>có lệnh mới xong một phần</td></tr>
<tr><td>Các lệnh sau PC</td><td>chưa lệnh nào bắt đầu</td><td>có lệnh đã bắt đầu hoặc đã xong</td></tr>
<tr><td>HĐH phải làm gì?</td><td>lưu thanh ghi, xử lý, quay về</td><td>giải mã trạng thái bị đổ ra, làm nốt hoặc hoàn tác</td></tr>
<tr><td>Cái giá</td><td>thêm phần cứng trong CPU</td><td>trình xử lý của HĐH phức tạp và chậm</td></tr>
</tbody>
</table>
<p class="meo">🧠 Chính xác = "một nhát cắt gọn giữa phần đã làm và phần chưa làm". Không chính xác = "nhát cắt lởm chởm, HĐH phải tự gỡ".</p>`],
      [10, 'Goals of the I/O Software',
        `<p class="y-chinh">🎯 Five issues the I/O software must solve: <strong>device independence</strong>, <strong>uniform naming</strong>, <strong>error handling</strong>, <strong>synchronous versus asynchronous</strong> (blocking vs interrupt-driven) transfers, and <strong>buffering</strong>. (The book adds a sixth: <strong>sharable vs dedicated devices</strong>.)</p>
<p><strong>Device independence</strong>: a program reads a file on a hard disk, a USB stick or a DVD without being changed — <code>sort &lt;input &gt;output</code> works whatever <code>input</code> is. <strong>Uniform naming</strong>: the name of a file or device is a simple string, independent of the device — in UNIX, a stick mounted on <code>/usr/ast/backup</code> just looks like more directories. <strong>Error handling</strong>: errors should be handled as close to the hardware as possible — the controller retries a read, the driver retries the command; only if they cannot fix it is the error passed upward. <strong>Synchronous vs asynchronous</strong>: physical I/O is asynchronous (the CPU starts the transfer, does something else, the interrupt arrives), but programs are much easier to write with <strong>blocking</strong> calls — after <code>read</code> returns, the data are there; the OS makes asynchronous hardware look synchronous. <strong>Buffering</strong>: data often cannot go straight to the final place (a network packet must be examined first; audio must be fed at an exact rate). <strong>Sharable vs dedicated</strong>: many users can share a disk, but a printer must be given to one user at a time — which brings deadlocks (Chapter 6).</p>
<p>➕ Four of the goals, each in one command:</p>
<div class="out"># Device independence: ONE program reads a file, a device and a pipe in exactly the same way<br>
$ printf 'hello world\\n' &gt; /tmp/note.txt<br>
$ wc -c &lt; /tmp/note.txt<br>
12<br>
$ head -c 1000 /dev/zero | wc -c<br>
1000<br>
$ wc -c &lt; /dev/null<br>
0<br>
# Uniform naming: devices and files live in ONE name space<br>
$ stat -c '%-30F %n' /tmp/note.txt /dev/null /dev/zero /tmp<br>
regular file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/tmp/note.txt<br>
character special file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/dev/null<br>
character special file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/dev/zero<br>
directory &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/tmp<br>
# Error handling: the device fails, the OS reports a standard error code upward<br>
$ echo hello &gt; /dev/full<br>
bash: echo: write error: No space left on device<br>
$ echo "exit code: $?"<br>
exit code: 1<br>
# Synchronous (blocking) I/O: read waits until the data arrive, then the program continues<br>
$ (sleep 1; echo "data from the device") | { read x; echo "got: $x"; }<br>
got: data from the device</div>
<p><code>wc</code> counted bytes from a regular file, a device and a pipe without knowing which was which (device independence); files and devices sit in one name space and <code>stat</code> describes them the same way (uniform naming); <code>/dev/full</code> is a test device that always fails a write, and the kernel turned that into the standard error code <code>ENOSPC</code> "No space left on device" (error handling); and <code>read</code> simply waited one second for the data (synchronous I/O).</p>
<p class="pitfall">⚠️ FE5#39 and FE16#38 ask for "the four important issues" — but the slide lists five, and the two bank keys disagree on which one to drop. Learn all five. "Uniform naming" = the name is a simple string or integer, independent of the device (FE10#39); "asynchronous transfer" = the CPU starts the transfer and goes off to do something else until the interrupt arrives (FE29#24); "blocking" = the process is stopped until the I/O completes (FE6#36); a FALSE statement about device independence is one that requires programmers to know the device (FE27#8).</p>`,
        `<p class="y-chinh">🎯 Năm vấn đề phần mềm I/O phải giải: <strong>độc lập thiết bị (device independence)</strong>, <strong>đặt tên thống nhất (uniform naming)</strong>, <strong>xử lý lỗi (error handling)</strong>, truyền <strong>đồng bộ hay bất đồng bộ (synchronous vs asynchronous)</strong> (chặn hay hướng ngắt), và <strong>đệm (buffering)</strong>. (Sách thêm vấn đề thứ sáu: <strong>thiết bị dùng chung hay dành riêng (sharable vs dedicated)</strong>.)</p>
<p><strong>Độc lập thiết bị</strong>: chương trình đọc một tệp trên đĩa cứng, USB hay DVD mà không phải sửa gì — <code>sort &lt;input &gt;output</code> chạy được bất kể <code>input</code> là gì. <strong>Đặt tên thống nhất</strong>: tên của tệp hay thiết bị là một chuỗi đơn giản, không phụ thuộc thiết bị — trong UNIX, một USB gắn vào <code>/usr/ast/backup</code> trông y như thêm vài thư mục. <strong>Xử lý lỗi</strong>: lỗi nên được xử lý càng gần phần cứng càng tốt — bộ điều khiển đọc lại, driver gửi lại lệnh; chỉ khi chúng không sửa được thì lỗi mới được báo lên trên. <strong>Đồng bộ hay bất đồng bộ</strong>: I/O vật lý là bất đồng bộ (CPU khởi động việc truyền, đi làm việc khác, ngắt tới sau), nhưng chương trình viết dễ hơn nhiều với lời gọi <strong>chặn (blocking)</strong> — <code>read</code> trả về thì dữ liệu đã có; HĐH làm phần cứng bất đồng bộ trông như đồng bộ. <strong>Đệm</strong>: dữ liệu thường không đi thẳng tới đích được (gói mạng phải được xem xét trước; âm thanh phải được cấp đúng nhịp). <strong>Dùng chung hay dành riêng</strong>: nhiều người dùng chung được một đĩa, nhưng máy in phải giao cho từng người một — kéo theo bế tắc (Chương 6).</p>
<p>➕ Bốn trong số các mục tiêu, mỗi cái một lệnh:</p>
<div class="out"># Độc lập thiết bị: MỘT chương trình đọc tệp, thiết bị và pipe theo đúng một cách<br>
$ printf 'hello world\\n' &gt; /tmp/note.txt<br>
$ wc -c &lt; /tmp/note.txt<br>
12<br>
$ head -c 1000 /dev/zero | wc -c<br>
1000<br>
$ wc -c &lt; /dev/null<br>
0<br>
# Đặt tên thống nhất: thiết bị và tệp sống chung MỘT không gian tên<br>
$ stat -c '%-30F %n' /tmp/note.txt /dev/null /dev/zero /tmp<br>
regular file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/tmp/note.txt<br>
character special file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/dev/null<br>
character special file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/dev/zero<br>
directory &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/tmp<br>
# Xử lý lỗi: thiết bị hỏng, HĐH báo một mã lỗi chuẩn lên trên<br>
$ echo hello &gt; /dev/full<br>
bash: echo: write error: No space left on device<br>
$ echo "exit code: $?"<br>
exit code: 1<br>
# I/O đồng bộ (chặn): read chờ tới khi dữ liệu tới, rồi chương trình mới đi tiếp<br>
$ (sleep 1; echo "data from the device") | { read x; echo "got: $x"; }<br>
got: data from the device</div>
<p><code>wc</code> đếm byte từ một tệp thường, một thiết bị và một pipe mà không biết cái nào là cái nào (độc lập thiết bị); tệp và thiết bị nằm chung một không gian tên và <code>stat</code> mô tả chúng theo cùng một cách (đặt tên thống nhất); <code>/dev/full</code> là thiết bị thử nghiệm lần ghi nào cũng hỏng, và nhân đổi điều đó thành mã lỗi chuẩn <code>ENOSPC</code> "No space left on device" (xử lý lỗi); còn <code>read</code> thì cứ chờ một giây cho tới khi dữ liệu tới (I/O đồng bộ).</p>
<p class="pitfall">⚠️ FE5#39 và FE16#38 hỏi "bốn vấn đề quan trọng" — nhưng slide liệt kê năm, và đáp án của hai đề trong ngân hàng còn bỏ hai mục khác nhau. Hãy nhớ đủ năm. "Uniform naming" = tên là một chuỗi hoặc số nguyên đơn giản, không phụ thuộc thiết bị (FE10#39); "asynchronous transfer" = CPU khởi động việc truyền rồi đi làm việc khác cho tới khi ngắt tới (FE29#24); "blocking" = tiến trình bị dừng tới khi I/O xong (FE6#36); phát biểu SAI về độc lập thiết bị là câu bắt lập trình viên phải biết thiết bị (FE27#8).</p>`],
      [11, 'Programmed I/O (1)',
        `<p class="y-chinh">🎯 Figure 5-7: printing the string "ABCDEFGH" — (a) the string is in the user's buffer; the process makes a system call; (b) the OS copies it into a kernel buffer and sends the first character, "A", to the printer; (c) when the printer is ready, the next character, "B", follows — and so on, one character at a time.</p>
<p>The figure sets up the example used on the next three slides, where the same job is done three ways. The first step is always the same: the string must leave user space (the user could change or free the buffer while printing goes on), so the kernel copies it with <code>copy_from_user</code>. The <code>Next</code> arrow in the kernel buffer is the OS's bookmark: which character goes out next.</p>
<p>➕ Why not let the user program write the printer's register itself? Because the printer's registers are not mapped into its address space (slide 5): the only door is the system call. You saw the same rule in Chapter 1 (lesson 1.A, slide 3): a user program that tries a privileged I/O operation is stopped by the CPU.</p>
<p class="meo">🧠 Figure 5-7 is the "what"; Figures 5-8, 5-9 and 5-10 are three "hows". Read them as one story: same string, same printer, three drivers.</p>`,
        `<p class="y-chinh">🎯 Hình 5-7: in chuỗi "ABCDEFGH" — (a) chuỗi nằm trong bộ đệm của người dùng; tiến trình gọi một lời gọi hệ thống; (b) HĐH chép nó vào một bộ đệm của nhân và gửi ký tự đầu, "A", tới máy in; (c) khi máy in sẵn sàng, ký tự kế, "B", đi tiếp — cứ thế, mỗi lần một ký tự.</p>
<p>Hình này dựng ví dụ dùng cho ba slide sau, nơi cùng một việc được làm theo ba cách. Bước đầu luôn như nhau: chuỗi phải rời không gian người dùng (người dùng có thể sửa hoặc giải phóng bộ đệm trong lúc đang in), nên nhân chép nó bằng <code>copy_from_user</code>. Mũi tên <code>Next</code> trong bộ đệm nhân là dấu trang của HĐH: ký tự nào đi ra tiếp theo.</p>
<p>➕ Sao không để chương trình người dùng tự ghi vào thanh ghi của máy in? Vì thanh ghi của máy in không được ánh xạ vào không gian địa chỉ của nó (slide 5): cánh cửa duy nhất là lời gọi hệ thống. Bạn đã gặp đúng luật này ở Chương 1 (bài 1.A, slide 3): chương trình người dùng thử một thao tác I/O đặc quyền sẽ bị CPU chặn lại.</p>
<p class="meo">🧠 Hình 5-7 là "làm gì"; Hình 5-8, 5-9 và 5-10 là ba cách "làm thế nào". Đọc chúng thành một câu chuyện: cùng một chuỗi, cùng một máy in, ba driver.</p>`],
      [12, 'Programmed I/O (2)',
        `<p class="y-chinh">🎯 Figure 5-8, <strong>programmed I/O</strong>: after copying the string into the kernel, the OS loops over the characters; for each one it spins in <code>while (*printer_status_reg != READY) ;</code> and then writes the character into <code>*printer_data_register</code>. When all are out, it returns to the user.</p>
<p>The CPU does all the work, and most of that work is <strong>busy waiting</strong> (also called <strong>polling</strong>): asking "ready yet?" millions of times. Its advantage is simplicity; its disadvantage is that it ties up the CPU full-time until the I/O is done. It is acceptable when the wait is very short (a fast device) or when the CPU has nothing else to do — an embedded system (a microwave oven's controller, a sensor board). In a multiprogrammed system it wastes the most expensive resource.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c562b8db77def993ece9598168caedda3d869380.svg" alt="Programmed I/O: the CPU is busy for the whole print, mostly asking the printer &quot;ready?&quot;" loading="lazy" /><p class="chu-thich">🧮 Programmed I/O: the CPU is busy for the whole print, mostly asking the printer "ready?"</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHU = ['A', 'B', 'C', 'D'];
const IN_MS = 4, GOI_MS = 1, NGAT_MS = 1;

function moPhong(cach) {
  const cpu = [], mayIn = [], dma = [];
  let t = 0;
  cpu.push({ tu: 0, den: GOI_MS, loai: 'goi' });              // print system call: copy string into the kernel
  t = GOI_MS;
  if (cach === 'lap-trinh') {                                   // the CPU writes each char, then polls the status register
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'cho' });
  } else if (cach === 'ngat') {                                 // write one char, run another process, interrupt =&gt; next char
    for (let i = 0; i &lt; CHU.length; i++) {
      mayIn.push({ tu: t, den: t + IN_MS, c: CHU[i] });
      cpu.push({ tu: t, den: t + IN_MS, loai: 'khac' });
      t += IN_MS;
      cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });     // interrupt service procedure
      t += NGAT_MS;
    }
  } else if (cach === 'dma') {                                  // the DMA controller feeds the printer; ONE interrupt at the end
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); dma.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'khac' });
    cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });
    t += NGAT_MS;
  } else throw new Error(&#96;biến thể lạ: &#36;{cach}&#96;);
  const io = cpu.filter((d) =&gt; d.loai !== 'khac').reduce((s, d) =&gt; s + d.den - d.tu, 0);
  const soNgat = cpu.filter((d) =&gt; d.loai === 'ngat').length;
  return { cpu, mayIn, dma, tong: t, io, soNgat };
}</code></pre></details>
<p>The simulation (each character takes the printer 4 ms; the numbers are deliberately large so the bars are visible) shows the cost: for 17 ms of printing, the CPU belongs to the printer for 17 ms. The measured version of the same three methods is on slide 14.</p>
<p class="pitfall">⚠️ "The simplest form of I/O: the CPU does all the work" = programmed I/O (FE5#38, FE4#34 "who manages all of the transfer? — the CPU"); "the processor busy-waits for the I/O to complete" = programmed I/O (FE29#1); main disadvantage = it ties up the CPU full-time (FE5#34); acceptable for = embedded systems (FE19#24).</p>`,
        `<p class="y-chinh">🎯 Hình 5-8, <strong>I/O lập trình (programmed I/O)</strong>: sau khi chép chuỗi vào nhân, HĐH lặp qua từng ký tự; với mỗi ký tự nó xoay vòng trong <code>while (*printer_status_reg != READY) ;</code> rồi ghi ký tự vào <code>*printer_data_register</code>. In hết thì trả về cho người dùng.</p>
<p>CPU làm mọi việc, và phần lớn việc đó là <strong>chờ bận (busy waiting)</strong> (còn gọi <strong>hỏi vòng — polling</strong>): hỏi "xong chưa?" hàng triệu lần. Ưu điểm của nó là đơn giản; nhược điểm là nó giữ chặt CPU suốt thời gian cho tới khi I/O xong. Nó chấp nhận được khi thời gian chờ rất ngắn (thiết bị nhanh) hoặc khi CPU chẳng có việc gì khác — một hệ thống nhúng (bộ điều khiển lò vi sóng, một bo mạch cảm biến). Trong hệ đa chương trình, nó phí tài nguyên đắt nhất.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7ce1a7cd2ce97a44cc6c64432fbdbe0cdbebeb8f.svg" alt="I/O lập trình: CPU bận suốt lúc in, phần lớn để hỏi máy in &quot;xong chưa?&quot;" loading="lazy" /><p class="chu-thich">🧮 I/O lập trình: CPU bận suốt lúc in, phần lớn để hỏi máy in "xong chưa?"</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHU = ['A', 'B', 'C', 'D'];
const IN_MS = 4, GOI_MS = 1, NGAT_MS = 1;

function moPhong(cach) {
  const cpu = [], mayIn = [], dma = [];
  let t = 0;
  cpu.push({ tu: 0, den: GOI_MS, loai: 'goi' });              // lời gọi in: chép chuỗi vào nhân
  t = GOI_MS;
  if (cach === 'lap-trinh') {                                   // CPU ghi từng ký tự rồi hỏi vòng thanh ghi trạng thái
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'cho' });
  } else if (cach === 'ngat') {                                 // ghi một ký tự, chạy tiến trình khác, có ngắt =&gt; ký tự kế
    for (let i = 0; i &lt; CHU.length; i++) {
      mayIn.push({ tu: t, den: t + IN_MS, c: CHU[i] });
      cpu.push({ tu: t, den: t + IN_MS, loai: 'khac' });
      t += IN_MS;
      cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });     // thủ tục phục vụ ngắt
      t += NGAT_MS;
    }
  } else if (cach === 'dma') {                                  // bộ DMA tự nạp máy in; MỘT ngắt ở cuối
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); dma.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'khac' });
    cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });
    t += NGAT_MS;
  } else throw new Error(&#96;biến thể lạ: &#36;{cach}&#96;);
  const io = cpu.filter((d) =&gt; d.loai !== 'khac').reduce((s, d) =&gt; s + d.den - d.tu, 0);
  const soNgat = cpu.filter((d) =&gt; d.loai === 'ngat').length;
  return { cpu, mayIn, dma, tong: t, io, soNgat };
}</code></pre></details>
<p>Mô phỏng (máy in mất 4 ms cho mỗi ký tự; số được cố ý phóng to cho thanh dễ nhìn) cho thấy cái giá: 17 ms in thì CPU thuộc về máy in trọn 17 ms. Phiên bản đo thật của cùng ba cách nằm ở slide 14.</p>
<p class="pitfall">⚠️ "Dạng I/O đơn giản nhất: CPU làm mọi việc" = programmed I/O (FE5#38, FE4#34 "ai quản lý toàn bộ việc truyền? — CPU"); "bộ xử lý chờ bận cho tới khi I/O xong" = programmed I/O (FE29#1); nhược điểm chính = giữ CPU suốt thời gian (FE5#34); chấp nhận được với = hệ thống nhúng (FE19#24).</p>`],
      [13, 'Interrupt-Driven I/O',
        `<p class="y-chinh">🎯 Figure 5-9, <strong>interrupt-driven I/O</strong>: (a) the system call copies the string, enables interrupts, waits until the printer is ready, writes only the FIRST character and calls the <strong>scheduler</strong> — the user process is blocked and another process runs; (b) each time the printer finishes a character it interrupts; the interrupt service procedure writes the next character, decrements <code>count</code>, and when <code>count == 0</code> unblocks the user.</p>
<p>No more spinning: between characters the CPU runs other processes. The price is one interrupt per character, and each interrupt costs time — saving registers, running the handler, returning, maybe a context switch. For a slow printer that is a bargain; for a fast device it can eat the CPU. (Note that part (a) still contains one short busy wait before the first character — exactly as the book's figure shows.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/009fead367df5b65e310447825a2b518f0cc6a69.svg" alt="Interrupt-driven I/O: the CPU only runs a short ISR after each character" loading="lazy" /><p class="chu-thich">🧮 Interrupt-driven I/O: the CPU only runs a short ISR after each character</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHU = ['A', 'B', 'C', 'D'];
const IN_MS = 4, GOI_MS = 1, NGAT_MS = 1;

function moPhong(cach) {
  const cpu = [], mayIn = [], dma = [];
  let t = 0;
  cpu.push({ tu: 0, den: GOI_MS, loai: 'goi' });              // print system call: copy string into the kernel
  t = GOI_MS;
  if (cach === 'lap-trinh') {                                   // the CPU writes each char, then polls the status register
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'cho' });
  } else if (cach === 'ngat') {                                 // write one char, run another process, interrupt =&gt; next char
    for (let i = 0; i &lt; CHU.length; i++) {
      mayIn.push({ tu: t, den: t + IN_MS, c: CHU[i] });
      cpu.push({ tu: t, den: t + IN_MS, loai: 'khac' });
      t += IN_MS;
      cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });     // interrupt service procedure
      t += NGAT_MS;
    }
  } else if (cach === 'dma') {                                  // the DMA controller feeds the printer; ONE interrupt at the end
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); dma.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'khac' });
    cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });
    t += NGAT_MS;
  } else throw new Error(&#96;biến thể lạ: &#36;{cach}&#96;);
  const io = cpu.filter((d) =&gt; d.loai !== 'khac').reduce((s, d) =&gt; s + d.den - d.tu, 0);
  const soNgat = cpu.filter((d) =&gt; d.loai === 'ngat').length;
  return { cpu, mayIn, dma, tong: t, io, soNgat };
}</code></pre></details>
<p>➕ The FE turns the cost into arithmetic. A modem delivers 7,000 characters per second and each interrupt costs 10 µs in total: 7,000 × 10 µs = 70 ms of every second = <strong>7% of the CPU</strong> (FE24#22, FE27#42, FE29#48). A printer of 400 characters/s with 50 µs per interrupt: 400 × 50 µs = 20 ms per second = <strong>2%</strong> (FE19#27). The 🧪 lesson 5.C computes these with a program.</p>
<p class="pitfall">⚠️ "Effect of using interrupts instead of polling" = more efficient use of processor cycles (FE1#11, FE2#32). "The hardware mechanism that lets a device notify the CPU" = interrupt (FE2#28, FE10#36).</p>`,
        `<p class="y-chinh">🎯 Hình 5-9, <strong>I/O hướng ngắt (interrupt-driven I/O)</strong>: (a) lời gọi hệ thống chép chuỗi, bật ngắt, chờ máy in sẵn sàng, chỉ ghi ký tự ĐẦU TIÊN rồi gọi <strong>bộ lập lịch (scheduler)</strong> — tiến trình người dùng bị chặn và tiến trình khác được chạy; (b) mỗi lần máy in in xong một ký tự, nó ngắt; thủ tục phục vụ ngắt ghi ký tự kế, giảm <code>count</code>, và khi <code>count == 0</code> thì bỏ chặn cho người dùng.</p>
<p>Hết cảnh xoay vòng: giữa các ký tự CPU chạy những tiến trình khác. Cái giá là mỗi ký tự một ngắt, và ngắt nào cũng tốn thời gian — lưu thanh ghi, chạy trình xử lý, quay về, có khi thêm một lần chuyển ngữ cảnh. Với máy in chậm thì quá hời; với thiết bị nhanh thì nó có thể ăn hết CPU. (Để ý phần (a) vẫn còn một lần chờ bận ngắn trước ký tự đầu — đúng như hình trong sách.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4decdbdb8019d697703c5b135de39dacbe9c2823.svg" alt="I/O hướng ngắt: CPU chỉ chạy một ISR ngắn sau mỗi ký tự" loading="lazy" /><p class="chu-thich">🧮 I/O hướng ngắt: CPU chỉ chạy một ISR ngắn sau mỗi ký tự</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHU = ['A', 'B', 'C', 'D'];
const IN_MS = 4, GOI_MS = 1, NGAT_MS = 1;

function moPhong(cach) {
  const cpu = [], mayIn = [], dma = [];
  let t = 0;
  cpu.push({ tu: 0, den: GOI_MS, loai: 'goi' });              // lời gọi in: chép chuỗi vào nhân
  t = GOI_MS;
  if (cach === 'lap-trinh') {                                   // CPU ghi từng ký tự rồi hỏi vòng thanh ghi trạng thái
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'cho' });
  } else if (cach === 'ngat') {                                 // ghi một ký tự, chạy tiến trình khác, có ngắt =&gt; ký tự kế
    for (let i = 0; i &lt; CHU.length; i++) {
      mayIn.push({ tu: t, den: t + IN_MS, c: CHU[i] });
      cpu.push({ tu: t, den: t + IN_MS, loai: 'khac' });
      t += IN_MS;
      cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });     // thủ tục phục vụ ngắt
      t += NGAT_MS;
    }
  } else if (cach === 'dma') {                                  // bộ DMA tự nạp máy in; MỘT ngắt ở cuối
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); dma.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'khac' });
    cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });
    t += NGAT_MS;
  } else throw new Error(&#96;biến thể lạ: &#36;{cach}&#96;);
  const io = cpu.filter((d) =&gt; d.loai !== 'khac').reduce((s, d) =&gt; s + d.den - d.tu, 0);
  const soNgat = cpu.filter((d) =&gt; d.loai === 'ngat').length;
  return { cpu, mayIn, dma, tong: t, io, soNgat };
}</code></pre></details>
<p>➕ FE biến cái giá đó thành bài tính. Một modem đưa 7.000 ký tự mỗi giây và mỗi ngắt tốn tổng cộng 10 µs: 7.000 × 10 µs = 70 ms trong mỗi giây = <strong>7% CPU</strong> (FE24#22, FE27#42, FE29#48). Máy in 400 ký tự/giây với 50 µs mỗi ngắt: 400 × 50 µs = 20 ms mỗi giây = <strong>2%</strong> (FE19#27). Bài 🧪 5.C tính các số này bằng chương trình.</p>
<p class="pitfall">⚠️ "Tác dụng của việc dùng ngắt thay cho hỏi vòng" = dùng chu kỳ bộ xử lý hiệu quả hơn (FE1#11, FE2#32). "Cơ chế phần cứng cho thiết bị báo cho CPU" = ngắt (interrupt) (FE2#28, FE10#36).</p>`],
      [14, 'I/O Using DMA',
        `<p class="y-chinh">🎯 Figure 5-10, <strong>I/O using DMA</strong>: (a) the system call copies the string, sets up the DMA controller and calls the scheduler; (b) when the DMA controller has fed every character to the printer, ONE interrupt arrives; its service procedure acknowledges it and unblocks the user.</p>
<p>DMA is programmed I/O done by someone else: the DMA controller does the polling and the copying, the CPU is free. The number of interrupts drops from one per character to one per buffer. The book's caveat: the DMA controller is usually much slower than the CPU, so if the CPU has nothing else to do, or the device is fast enough, interrupt-driven or even programmed I/O may finish sooner.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/675cf2379da22547463057f270e2f5bbad6b4065.svg" alt="I/O using DMA: one set-up, one interrupt, the CPU free in between" loading="lazy" /><p class="chu-thich">🧮 I/O using DMA: one set-up, one interrupt, the CPU free in between</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHU = ['A', 'B', 'C', 'D'];
const IN_MS = 4, GOI_MS = 1, NGAT_MS = 1;

function moPhong(cach) {
  const cpu = [], mayIn = [], dma = [];
  let t = 0;
  cpu.push({ tu: 0, den: GOI_MS, loai: 'goi' });              // print system call: copy string into the kernel
  t = GOI_MS;
  if (cach === 'lap-trinh') {                                   // the CPU writes each char, then polls the status register
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'cho' });
  } else if (cach === 'ngat') {                                 // write one char, run another process, interrupt =&gt; next char
    for (let i = 0; i &lt; CHU.length; i++) {
      mayIn.push({ tu: t, den: t + IN_MS, c: CHU[i] });
      cpu.push({ tu: t, den: t + IN_MS, loai: 'khac' });
      t += IN_MS;
      cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });     // interrupt service procedure
      t += NGAT_MS;
    }
  } else if (cach === 'dma') {                                  // the DMA controller feeds the printer; ONE interrupt at the end
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); dma.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'khac' });
    cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });
    t += NGAT_MS;
  } else throw new Error(&#96;biến thể lạ: &#36;{cach}&#96;);
  const io = cpu.filter((d) =&gt; d.loai !== 'khac').reduce((s, d) =&gt; s + d.den - d.tu, 0);
  const soNgat = cpu.filter((d) =&gt; d.loai === 'ngat').length;
  return { cpu, mayIn, dma, tong: t, io, soNgat };
}</code></pre></details>
<p>➕ Now the three figures measured on the real machine. A thread plays the printer (3 ms per character); another plays the DMA controller; the "interrupt line" is a condition variable, so a driver waiting for an interrupt really sleeps without using the CPU:</p>
<pre><code class="language-c">// Figures 5-8, 5-9, 5-10 for real: print "ABCDEFGH" on a slow simulated printer three ways
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;stdatomic.h&gt;

#define CHAM_US 3000                       // the printer needs 3 ms per character
static const char *chu = "ABCDEFGH";
static const int N = 8;

// ── the "hardware": a printer with a status register and a data register ──
static atomic_int trang_thai = 1;          // 1 = READY, 0 = BUSY
static atomic_int co_lenh = 0;             // the driver wrote the data register
static char thanh_ghi_du_lieu, giay[16];
static int in_duoc, che_do;                // che_do: 0 programmed, 1 interrupt, 2 DMA
static pthread_mutex_t khoa = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t duong_ngat = PTHREAD_COND_INITIALIZER;   // the interrupt line
static int ngat_cho, so_ngat;
static atomic_int chay = 1;

static void phat_ngat(void) {              // the controller raises an interrupt
    pthread_mutex_lock(&amp;khoa); ngat_cho++; so_ngat++; pthread_cond_signal(&amp;duong_ngat); pthread_mutex_unlock(&amp;khoa);
}
static void cho_ngat(void) {               // the driver sleeps until an interrupt (no CPU used)
    pthread_mutex_lock(&amp;khoa); while (!ngat_cho) pthread_cond_wait(&amp;duong_ngat, &amp;khoa); ngat_cho--; pthread_mutex_unlock(&amp;khoa);
}
static void *may_in(void *x) {
    while (atomic_load(&amp;chay)) {
        if (!atomic_load(&amp;co_lenh)) { usleep(50); continue; }
        atomic_store(&amp;co_lenh, 0);
        int ngat = (che_do == 1);                          // decided when the command arrives
        usleep(CHAM_US);                                   // the mechanical part
        giay[in_duoc++] = thanh_ghi_du_lieu;
        atomic_store(&amp;trang_thai, 1);
        if (ngat) phat_ngat();                             // interrupt-driven: one interrupt per character
    }
    return NULL;
}
static void ghi_may_in(char c) { thanh_ghi_du_lieu = c; atomic_store(&amp;trang_thai, 0); atomic_store(&amp;co_lenh, 1); }

static void *dma(void *x) {                // the DMA controller copies the whole buffer by itself
    for (int i = 0; i &lt; N; i++) { while (!atomic_load(&amp;trang_thai)) usleep(50); ghi_may_in(chu[i]); }
    while (!atomic_load(&amp;trang_thai)) usleep(50);
    phat_ngat();                                           // ONE interrupt at the end
    return NULL;
}

// ── the "driver": three versions of the print system call ──
static void in_lap_trinh(void) {           // Figure 5-8
    for (int i = 0; i &lt; N; i++) {
        while (!atomic_load(&amp;trang_thai)) { }              // busy waiting: loop until ready
        ghi_may_in(chu[i]);
    }
    while (!atomic_load(&amp;trang_thai)) { }
}
static void in_ngat(void) {                // Figure 5-9
    int i = 0;
    ghi_may_in(chu[i++]);                                  // (a) send the first character, then block
    while (1) {
        cho_ngat();                                        // (b) interrupt service procedure
        if (i == N) break;
        ghi_may_in(chu[i++]);
    }
}
static void in_dma(void) {                 // Figure 5-10
    pthread_t t; pthread_create(&amp;t, NULL, dma, NULL);      // set_up_DMA_controller()
    cho_ngat();                                            // one interrupt when everything is printed
    pthread_join(t, NULL);
}

static double ms(clockid_t c) { struct timespec t; clock_gettime(c, &amp;t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

int main(void) {
    pthread_t p; pthread_create(&amp;p, NULL, may_in, NULL);
    const char *ten[] = { "programmed I/O", "interrupt-driven", "DMA" };
    void (*cach[])(void) = { in_lap_trinh, in_ngat, in_dma };
    printf("%-17s %-9s %-10s %-12s %s\\n", "method", "printed", "interrupts", "CPU time", "elapsed (wall clock)");
    for (che_do = 0; che_do &lt; 3; che_do++) {
        memset(giay, 0, sizeof giay); in_duoc = 0; so_ngat = 0; ngat_cho = 0;
        double c0 = ms(CLOCK_THREAD_CPUTIME_ID), w0 = ms(CLOCK_MONOTONIC);   // CPU time used by THIS thread vs real time
        cach[che_do]();
        printf("%-17s %-9s %-10d %6.2f ms    %6.2f ms\\n", ten[che_do], giay, so_ngat, ms(CLOCK_THREAD_CPUTIME_ID) - c0, ms(CLOCK_MONOTONIC) - w0);
    }
    atomic_store(&amp;chay, 0); pthread_join(p, NULL);
    printf("the printer alone needs at least %d characters x %d ms = %d ms\\n", N, CHAM_US / 1000, N * CHAM_US / 1000);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ba-cach-in.c -o ba-cach-in &amp;&amp; ./ba-cach-in<br>
method &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;printed &nbsp;&nbsp;interrupts CPU time &nbsp;&nbsp;&nbsp;&nbsp;elapsed (wall clock)<br>
programmed I/O &nbsp;&nbsp;&nbsp;ABCDEFGH &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25.91 ms &nbsp;&nbsp;&nbsp;&nbsp;26.21 ms<br>
interrupt-driven &nbsp;ABCDEFGH &nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.12 ms &nbsp;&nbsp;&nbsp;&nbsp;27.58 ms<br>
DMA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ABCDEFGH &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.19 ms &nbsp;&nbsp;&nbsp;&nbsp;28.43 ms<br>
the printer alone needs at least 8 characters x 3 ms = 24 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>All three printed ABCDEFGH in about the same wall-clock time — the printer is the bottleneck. But programmed I/O kept the CPU spinning for the whole time (CPU time ≈ elapsed time), while interrupt-driven I/O used a fraction of a millisecond for 8 interrupts, and DMA a similar amount with a single interrupt. On a real system, those tens of milliseconds are what the other processes get.</p>
<p class="pitfall">⚠️ "Three ways to perform I/O" = programmed I/O, interrupt-driven I/O, I/O using DMA — memory-mapped I/O is NOT one of them, it is how registers are addressed (FE3#31, FE25#17 "busy waiting / interrupt / DMA — all of them"). "Best technique in general" / "without bothering the CPU" = DMA (FE24#42, FE28#3, FE8#35); DMA's key advantage: faster transfers and fewer interrupts (FE10#45).</p>
<div class="callout">🧭 On a real server: every NVMe SSD and network card works this way — the driver fills a ring of descriptors, the device DMAs data in or out by itself, and an interrupt (MSI-X) reports a whole batch. A Spring Boot or Node.js server reading a request body never sees a byte being copied by the CPU from the card.</div>`,
        `<p class="y-chinh">🎯 Hình 5-10, <strong>I/O dùng DMA</strong>: (a) lời gọi hệ thống chép chuỗi, thiết lập bộ điều khiển DMA rồi gọi bộ lập lịch; (b) khi bộ DMA đã nạp hết các ký tự cho máy in, MỘT ngắt tới; thủ tục phục vụ của nó xác nhận ngắt và bỏ chặn cho người dùng.</p>
<p>DMA chính là I/O lập trình do người khác làm: bộ DMA hỏi vòng và chép dữ liệu, còn CPU được rảnh. Số ngắt giảm từ mỗi ký tự một ngắt xuống mỗi bộ đệm một ngắt. Lưu ý của sách: bộ DMA thường chậm hơn CPU nhiều, nên nếu CPU chẳng có việc gì khác, hoặc thiết bị đủ nhanh, thì I/O hướng ngắt hay thậm chí I/O lập trình có thể xong sớm hơn.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0423411389b4aeba7f35ab4449dcc20e410a00f9.svg" alt="I/O dùng DMA: một lần thiết lập, một lần ngắt, ở giữa CPU được rảnh" loading="lazy" /><p class="chu-thich">🧮 I/O dùng DMA: một lần thiết lập, một lần ngắt, ở giữa CPU được rảnh</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHU = ['A', 'B', 'C', 'D'];
const IN_MS = 4, GOI_MS = 1, NGAT_MS = 1;

function moPhong(cach) {
  const cpu = [], mayIn = [], dma = [];
  let t = 0;
  cpu.push({ tu: 0, den: GOI_MS, loai: 'goi' });              // lời gọi in: chép chuỗi vào nhân
  t = GOI_MS;
  if (cach === 'lap-trinh') {                                   // CPU ghi từng ký tự rồi hỏi vòng thanh ghi trạng thái
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'cho' });
  } else if (cach === 'ngat') {                                 // ghi một ký tự, chạy tiến trình khác, có ngắt =&gt; ký tự kế
    for (let i = 0; i &lt; CHU.length; i++) {
      mayIn.push({ tu: t, den: t + IN_MS, c: CHU[i] });
      cpu.push({ tu: t, den: t + IN_MS, loai: 'khac' });
      t += IN_MS;
      cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });     // thủ tục phục vụ ngắt
      t += NGAT_MS;
    }
  } else if (cach === 'dma') {                                  // bộ DMA tự nạp máy in; MỘT ngắt ở cuối
    for (const c of CHU) { mayIn.push({ tu: t, den: t + IN_MS, c }); dma.push({ tu: t, den: t + IN_MS, c }); t += IN_MS; }
    cpu.push({ tu: GOI_MS, den: t, loai: 'khac' });
    cpu.push({ tu: t, den: t + NGAT_MS, loai: 'ngat' });
    t += NGAT_MS;
  } else throw new Error(&#96;biến thể lạ: &#36;{cach}&#96;);
  const io = cpu.filter((d) =&gt; d.loai !== 'khac').reduce((s, d) =&gt; s + d.den - d.tu, 0);
  const soNgat = cpu.filter((d) =&gt; d.loai === 'ngat').length;
  return { cpu, mayIn, dma, tong: t, io, soNgat };
}</code></pre></details>
<p>➕ Giờ là ba hình đó đo trên máy thật. Một luồng đóng vai máy in (3 ms mỗi ký tự); một luồng đóng vai bộ DMA; "đường ngắt" là một biến điều kiện (condition variable), nên driver chờ ngắt thì ngủ thật, không tốn CPU:</p>
<pre><code class="language-c">// Hình 5-8, 5-9, 5-10 chạy thật: in "ABCDEFGH" ra một máy in giả lập chậm theo ba cách
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;pthread.h&gt;
#include &lt;stdatomic.h&gt;

#define CHAM_US 3000                       // máy in cần 3 ms cho mỗi ký tự
static const char *chu = "ABCDEFGH";
static const int N = 8;

// ── "phần cứng": máy in có thanh ghi trạng thái và thanh ghi dữ liệu ──
static atomic_int trang_thai = 1;          // 1 = SẴN SÀNG, 0 = BẬN
static atomic_int co_lenh = 0;             // driver đã ghi thanh ghi dữ liệu
static char thanh_ghi_du_lieu, giay[16];
static int in_duoc, che_do;                // chế độ: 0 lập trình, 1 ngắt, 2 DMA
static pthread_mutex_t khoa = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t duong_ngat = PTHREAD_COND_INITIALIZER;   // đường ngắt
static int ngat_cho, so_ngat;
static atomic_int chay = 1;

static void phat_ngat(void) {              // bộ điều khiển phát một ngắt
    pthread_mutex_lock(&amp;khoa); ngat_cho++; so_ngat++; pthread_cond_signal(&amp;duong_ngat); pthread_mutex_unlock(&amp;khoa);
}
static void cho_ngat(void) {               // driver ngủ tới khi có ngắt (không tốn CPU)
    pthread_mutex_lock(&amp;khoa); while (!ngat_cho) pthread_cond_wait(&amp;duong_ngat, &amp;khoa); ngat_cho--; pthread_mutex_unlock(&amp;khoa);
}
static void *may_in(void *x) {
    while (atomic_load(&amp;chay)) {
        if (!atomic_load(&amp;co_lenh)) { usleep(50); continue; }
        atomic_store(&amp;co_lenh, 0);
        int ngat = (che_do == 1);                          // quyết định lúc lệnh tới
        usleep(CHAM_US);                                   // phần cơ khí
        giay[in_duoc++] = thanh_ghi_du_lieu;
        atomic_store(&amp;trang_thai, 1);
        if (ngat) phat_ngat();                             // hướng ngắt: mỗi ký tự một ngắt
    }
    return NULL;
}
static void ghi_may_in(char c) { thanh_ghi_du_lieu = c; atomic_store(&amp;trang_thai, 0); atomic_store(&amp;co_lenh, 1); }

static void *dma(void *x) {                // bộ điều khiển DMA tự chép cả bộ đệm
    for (int i = 0; i &lt; N; i++) { while (!atomic_load(&amp;trang_thai)) usleep(50); ghi_may_in(chu[i]); }
    while (!atomic_load(&amp;trang_thai)) usleep(50);
    phat_ngat();                                           // MỘT ngắt ở cuối
    return NULL;
}

// ── "driver": ba phiên bản của lời gọi hệ thống in ──
static void in_lap_trinh(void) {           // Hình 5-8
    for (int i = 0; i &lt; N; i++) {
        while (!atomic_load(&amp;trang_thai)) { }              // chờ bận: lặp tới khi sẵn sàng
        ghi_may_in(chu[i]);
    }
    while (!atomic_load(&amp;trang_thai)) { }
}
static void in_ngat(void) {                // Hình 5-9
    int i = 0;
    ghi_may_in(chu[i++]);                                  // (a) gửi ký tự đầu, rồi chặn
    while (1) {
        cho_ngat();                                        // (b) thủ tục phục vụ ngắt
        if (i == N) break;
        ghi_may_in(chu[i++]);
    }
}
static void in_dma(void) {                 // Hình 5-10
    pthread_t t; pthread_create(&amp;t, NULL, dma, NULL);      // thiết lập bộ điều khiển DMA
    cho_ngat();                                            // một ngắt khi in xong hết
    pthread_join(t, NULL);
}

static double ms(clockid_t c) { struct timespec t; clock_gettime(c, &amp;t); return t.tv_sec * 1e3 + t.tv_nsec / 1e6; }

int main(void) {
    pthread_t p; pthread_create(&amp;p, NULL, may_in, NULL);
    const char *ten[] = { "programmed I/O", "interrupt-driven", "DMA" };
    void (*cach[])(void) = { in_lap_trinh, in_ngat, in_dma };
    printf("%-17s %-9s %-10s %-12s %s\\n", "method", "printed", "interrupts", "CPU time", "elapsed (wall clock)");
    for (che_do = 0; che_do &lt; 3; che_do++) {
        memset(giay, 0, sizeof giay); in_duoc = 0; so_ngat = 0; ngat_cho = 0;
        double c0 = ms(CLOCK_THREAD_CPUTIME_ID), w0 = ms(CLOCK_MONOTONIC);   // thời gian CPU luồng NÀY dùng so với thời gian thật
        cach[che_do]();
        printf("%-17s %-9s %-10d %6.2f ms    %6.2f ms\\n", ten[che_do], giay, so_ngat, ms(CLOCK_THREAD_CPUTIME_ID) - c0, ms(CLOCK_MONOTONIC) - w0);
    }
    atomic_store(&amp;chay, 0); pthread_join(p, NULL);
    printf("the printer alone needs at least %d characters x %d ms = %d ms\\n", N, CHAM_US / 1000, N * CHAM_US / 1000);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ba-cach-in.c -o ba-cach-in &amp;&amp; ./ba-cach-in<br>
method &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;printed &nbsp;&nbsp;interrupts CPU time &nbsp;&nbsp;&nbsp;&nbsp;elapsed (wall clock)<br>
programmed I/O &nbsp;&nbsp;&nbsp;ABCDEFGH &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25.91 ms &nbsp;&nbsp;&nbsp;&nbsp;26.21 ms<br>
interrupt-driven &nbsp;ABCDEFGH &nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.12 ms &nbsp;&nbsp;&nbsp;&nbsp;27.58 ms<br>
DMA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ABCDEFGH &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.19 ms &nbsp;&nbsp;&nbsp;&nbsp;28.43 ms<br>
the printer alone needs at least 8 characters x 3 ms = 24 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cả ba cách đều in xong ABCDEFGH trong khoảng cùng một thời gian thực — máy in là nút cổ chai. Nhưng I/O lập trình giữ CPU xoay vòng suốt thời gian đó (thời gian CPU ≈ thời gian trôi qua), còn I/O hướng ngắt chỉ tốn một phần nhỏ của mili giây cho 8 ngắt, và DMA tốn cỡ tương tự với một ngắt duy nhất. Trên hệ thống thật, vài chục mili giây đó chính là phần các tiến trình khác nhận được.</p>
<p class="pitfall">⚠️ "Ba cách thực hiện I/O" = I/O lập trình, I/O hướng ngắt, I/O dùng DMA — memory-mapped I/O KHÔNG phải một trong số đó, nó là cách định địa chỉ thanh ghi (FE3#31, FE25#17 "busy waiting / interrupt / DMA — cả ba"). "Kỹ thuật tốt nhất nói chung" / "không làm phiền CPU" = DMA (FE24#42, FE28#3, FE8#35); ưu điểm chính của DMA: truyền nhanh hơn và ít ngắt hơn (FE10#45).</p>
<div class="callout">🧭 Trên server thật: mọi SSD NVMe và card mạng đều làm theo cách này — driver điền một vòng các bộ mô tả (descriptor ring), thiết bị tự DMA dữ liệu vào ra, và một ngắt (MSI-X) báo cả một mẻ. Server Spring Boot hay Node.js đọc thân request không bao giờ thấy CPU phải chép từng byte từ card mạng.</div>`],
      [15, 'I/O Software Layers',
        `<p class="y-chinh">🎯 Figure 5-11: the I/O software is organised in four layers on top of the hardware — from the bottom: <strong>interrupt handlers</strong>, <strong>device drivers</strong>, <strong>device-independent operating system software</strong>, and <strong>user-level I/O software</strong>.</p>
<p>Each layer has a well-defined job and a well-defined interface to the layers next to it. The lower a layer is, the more it knows about a specific piece of hardware; the higher, the more uniform it looks. Slides 16–23 walk up the stack one layer at a time, and slide 23 summarises what each layer does.</p>
<p>➕ One real request crossing every layer — a <code>read()</code> of a file whose block is not in memory yet:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/60ecda4fb692b92156001978ee5b161d10d2865f.svg" alt="One read() going down the four layers and back up" loading="lazy" /><p class="chu-thich">🧩 One read() going down the four layers and back up</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 5-17 as one real request: read(fd, buf, 4096) on a file, down the layers and back up
participant "User process\\n(libc)" as U
participant "Device-independent\\nsoftware (VFS, page cache)" as V
participant "Device driver\\n(virtio_blk)" as D
participant "Interrupt handler" as I
participant "Hardware\\n(disk)" as H
U -&gt; V : read(fd, buf, 4096)  [system call]
V -&gt; V : name -&gt; inode, permission check,\\nis the block in the page cache?
V -&gt; D : not cached: "read block 1234"
D -&gt; H : write commands into the device registers
note over U, V : the process is BLOCKED; the CPU runs someone else
H -&gt; I : interrupt: "block ready"
I -&gt; D : wake up the driver
D -&gt; V : block now in the page cache
V -&gt; U : copy 4096 bytes into buf, return 4096
@enduml</code></pre></details>
<p>On Linux the names are: the VFS and the page cache (device-independent), <code>virtio_blk</code> or <code>nvme</code> (driver), the IRQ handler registered by that driver (interrupt handler) — and libc in your process (user level). The older web lesson 5.1 draws the same stack in four boxes.</p>
<p class="pitfall">⚠️ Layer questions are FE favourites: how many layers? 4 (FE5#40). Closest to the hardware? interrupt handlers (FE3#28). Order from the bottom, given 1 user-level, 2 drivers, 3 interrupt handlers, 4 hardware, 5 device-independent → 4-3-2-5-1, answer "43251" (FE18#24). Drivers sit right above the interrupt handlers and below the device-independent software (FE20#13, FE21#38; the statement placing them anywhere else is the incorrect one, FE20#11, FE25#49).</p>`,
        `<p class="y-chinh">🎯 Hình 5-11: phần mềm I/O được tổ chức thành bốn tầng nằm trên phần cứng — từ dưới lên: <strong>trình xử lý ngắt (interrupt handlers)</strong>, <strong>trình điều khiển thiết bị (device drivers)</strong>, <strong>phần mềm HĐH độc lập thiết bị (device-independent OS software)</strong>, và <strong>phần mềm I/O mức người dùng (user-level I/O software)</strong>.</p>
<p>Mỗi tầng có một việc rõ ràng và một giao diện rõ ràng với các tầng sát nó. Tầng càng thấp càng biết nhiều về một phần cứng cụ thể; càng cao thì trông càng đồng nhất. Slide 16–23 đi lên từng tầng một, và slide 23 tóm tắt việc của từng tầng.</p>
<p>➕ Một yêu cầu thật đi qua mọi tầng — một lần <code>read()</code> trên tệp mà khối của nó chưa có trong bộ nhớ:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/60ecda4fb692b92156001978ee5b161d10d2865f.svg" alt="Một lần read() đi xuống bốn tầng rồi trở lên" loading="lazy" /><p class="chu-thich">🧩 Một lần read() đi xuống bốn tầng rồi trở lên</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 5-17 thành một yêu cầu thật: read(fd, buf, 4096) trên một tệp, đi xuống các tầng rồi trở lên
participant "User process\\n(libc)" as U
participant "Device-independent\\nsoftware (VFS, page cache)" as V
participant "Device driver\\n(virtio_blk)" as D
participant "Interrupt handler" as I
participant "Hardware\\n(disk)" as H
U -&gt; V : read(fd, buf, 4096)  [system call]
V -&gt; V : name -&gt; inode, permission check,\\nis the block in the page cache?
V -&gt; D : not cached: "read block 1234"
D -&gt; H : write commands into the device registers
note over U, V : the process is BLOCKED; the CPU runs someone else
H -&gt; I : interrupt: "block ready"
I -&gt; D : wake up the driver
D -&gt; V : block now in the page cache
V -&gt; U : copy 4096 bytes into buf, return 4096
@enduml</code></pre></details>
<p>Trên Linux, tên của chúng là: VFS và page cache (độc lập thiết bị), <code>virtio_blk</code> hay <code>nvme</code> (driver), trình xử lý IRQ do driver đó đăng ký (trình xử lý ngắt) — và libc trong tiến trình của bạn (mức người dùng). Bài web cũ 5.1 vẽ cùng chồng tầng này thành bốn hộp.</p>
<p class="pitfall">⚠️ Câu về các tầng là món ruột của FE: bao nhiêu tầng? 4 (FE5#40). Gần phần cứng nhất? trình xử lý ngắt (FE3#28). Thứ tự từ dưới lên, cho 1 mức người dùng, 2 driver, 3 trình xử lý ngắt, 4 phần cứng, 5 độc lập thiết bị → 4-3-2-5-1, đáp án "43251" (FE18#24). Driver nằm ngay trên trình xử lý ngắt và dưới phần mềm độc lập thiết bị (FE20#13, FE21#38; câu đặt nó ở chỗ khác là câu sai, FE20#11, FE25#49).</p>`],
      [16, 'Interrupt Handlers (1)',
        `<p class="y-chinh">🎯 Typical steps after a hardware interrupt, part 1: (1) save the registers (including the PSW) not already saved by the hardware; (2) set up a context for the interrupt service procedure (TLB, MMU, page table); (3) set up a stack for it; (4) acknowledge the interrupt controller — or, without a central controller, re-enable interrupts; (5) copy the saved registers to the process table.</p>
<p>The goal of the interrupt handler layer is to hide interrupts from the rest of the OS: the driver that started an I/O blocks (on a semaphore, a condition variable, a wait queue), and the handler's job is to unblock it. But before any C code can run, the hardware state must be saved completely (the hardware itself saved only the PC and maybe the PSW, slide 7) and the CPU must be given a place to work — a stack and a memory context. Step 4 matters: until the controller is acknowledged, no other interrupt of that priority can come in; acknowledging early keeps the system responsive.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/1ecf17af88b2b0b02f3e59893c3bf1edcb4f4662.svg" alt="The book's ten steps after an interrupt (slides 16 and 17) as one flow" loading="lazy" /><p class="chu-thich">🧩 The book's ten steps after an interrupt (slides 16 and 17) as one flow</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 16-17: what the OS does after the hardware has delivered an interrupt (book's 10 steps)
start
:hardware: save PC (and PSW) on the stack,\\nswitch to kernel mode, jump through the interrupt vector;
partition "Interrupt handler (top half)" {
  :1. save the remaining registers (incl. PSW);
  :2. set up a context (TLB, MMU, page table) for the service procedure;
  :3. set up a stack for the service procedure;
  :4. acknowledge the interrupt controller\\n(or re-enable interrupts);
  :5. copy the saved registers into the process table;
  :6. run the service procedure: read the controller's registers;
}
note right
  Linux splits this: the top half does only
  steps 1-6 quickly with interrupts off;
  slower work goes to a softirq / tasklet /
  workqueue (the "bottom half")
end note
:7. choose which process to run next\\n(the one waiting for this I/O may now be ready);
:8. set up the MMU context for that process;
:9. load its registers, including its PSW;
:10. start running it;
stop
@enduml</code></pre></details>
<p>➕ All this is pure overhead. The book notes it can take a significant number of CPU instructions, and with caches, TLBs and pipelines being disturbed, an interrupt is far from free — the reason fast devices avoid one interrupt per byte (slide 3).</p>
<p class="pitfall">⚠️ What must be saved BEFORE the processor transfers control to the handler (by the hardware)? The PSW and the PC (FE29#22). FALSE statement test about how the CPU handles interrupts: "None of the other choices" — stopping the current sequence, saving the old PC and branching to a new sequence are all correct (FE18#29, FE28#13).</p>`,
        `<p class="y-chinh">🎯 Các bước điển hình sau một ngắt phần cứng, phần 1: (1) lưu các thanh ghi (kể cả PSW) mà phần cứng chưa lưu; (2) dựng ngữ cảnh cho thủ tục phục vụ ngắt (TLB, MMU, bảng trang); (3) dựng ngăn xếp cho nó; (4) xác nhận (acknowledge) với bộ điều khiển ngắt — hoặc, nếu không có bộ điều khiển trung tâm, bật lại ngắt; (5) chép các thanh ghi đã lưu vào bảng tiến trình.</p>
<p>Mục tiêu của tầng trình xử lý ngắt là giấu ngắt khỏi phần còn lại của HĐH: driver đã khởi động một thao tác I/O thì tự chặn (trên một semaphore, một biến điều kiện, một hàng đợi chờ), và việc của trình xử lý là bỏ chặn cho nó. Nhưng trước khi bất kỳ dòng C nào chạy được, trạng thái phần cứng phải được lưu trọn (phần cứng tự lưu mới chỉ PC và có thể PSW, slide 7) và CPU phải được cấp chỗ làm việc — một ngăn xếp và một ngữ cảnh bộ nhớ. Bước 4 quan trọng: chừng nào bộ điều khiển chưa được xác nhận, không ngắt nào khác cùng mức ưu tiên vào được; xác nhận sớm giữ cho hệ thống nhạy.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/1ecf17af88b2b0b02f3e59893c3bf1edcb4f4662.svg" alt="Mười bước của sách sau một ngắt (slide 16 và 17) gộp thành một luồng" loading="lazy" /><p class="chu-thich">🧩 Mười bước của sách sau một ngắt (slide 16 và 17) gộp thành một luồng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 16-17: HĐH làm gì sau khi phần cứng đã trao một ngắt (10 bước của sách)
start
:hardware: save PC (and PSW) on the stack,\\nswitch to kernel mode, jump through the interrupt vector;
partition "Interrupt handler (top half)" {
  :1. save the remaining registers (incl. PSW);
  :2. set up a context (TLB, MMU, page table) for the service procedure;
  :3. set up a stack for the service procedure;
  :4. acknowledge the interrupt controller\\n(or re-enable interrupts);
  :5. copy the saved registers into the process table;
  :6. run the service procedure: read the controller's registers;
}
note right
  Linux splits this: the top half does only
  steps 1-6 quickly with interrupts off;
  slower work goes to a softirq / tasklet /
  workqueue (the "bottom half")
end note
:7. choose which process to run next\\n(the one waiting for this I/O may now be ready);
:8. set up the MMU context for that process;
:9. load its registers, including its PSW;
:10. start running it;
stop
@enduml</code></pre></details>
<p>➕ Tất cả những việc này là chi phí thuần tuý. Sách lưu ý nó có thể tốn khá nhiều lệnh CPU, và vì cache, TLB, pipeline bị xáo trộn nên một ngắt chẳng hề miễn phí — lý do thiết bị nhanh tránh cảnh mỗi byte một ngắt (slide 3).</p>
<p class="pitfall">⚠️ Phải lưu gì TRƯỚC khi bộ xử lý trao quyền cho trình xử lý ngắt (do phần cứng lưu)? PSW và PC (FE29#22). Câu tìm phát biểu SAI về cách CPU xử lý ngắt: "None of the other choices" — dừng chuỗi lệnh hiện tại, lưu PC cũ và rẽ sang chuỗi lệnh mới đều đúng (FE18#29, FE28#13).</p>`],
      [17, 'Interrupt Handlers (2)',
        `<p class="y-chinh">🎯 Typical steps, part 2: (6) run the interrupt service procedure — it extracts information from the interrupting controller's registers; (7) choose which process to run next; (8) set up the MMU context for it; (9) load its registers, including its PSW; (10) start running it. ⚠️ The slide numbers all five steps "6." — a numbering error; in the book they are steps 6 to 10.</p>
<p>Step 6 is where the device-specific work happens: read the status ("done? error?"), maybe fetch data, and wake the waiting driver. Step 7 shows why an interrupt often ends with a context switch: the process that was waiting for this I/O may now be ready, and if it has higher priority than the interrupted one, the scheduler picks it. Steps 8–10 are the context switch itself (Chapter 2).</p>
<p>➕ Linux splits this work in two to keep interrupts short. The <strong>top half</strong> (the registered IRQ handler) runs with that interrupt line masked and does only the urgent part — acknowledge, grab status, queue work. The <strong>bottom half</strong> — a softirq, tasklet or workqueue — finishes the rest later with interrupts enabled. The disk program on slide 7 already counted both: each hard interrupt of the disk was followed by "BLOCK" softirqs, the block layer's bottom half that completes the requests.</p>
<p class="meo">🧠 Top half = "note what happened, quickly". Bottom half = "deal with it properly, a bit later". It is the same idea as a web server that answers "202 Accepted" at once and does the heavy job in a background queue.</p>`,
        `<p class="y-chinh">🎯 Các bước điển hình, phần 2: (6) chạy thủ tục phục vụ ngắt — nó lấy thông tin từ các thanh ghi của bộ điều khiển vừa ngắt; (7) chọn tiến trình chạy tiếp theo; (8) dựng ngữ cảnh MMU cho nó; (9) nạp các thanh ghi của nó, kể cả PSW; (10) bắt đầu chạy nó. ⚠️ Slide đánh số cả năm bước là "6." — lỗi đánh số; trong sách chúng là bước 6 tới 10.</p>
<p>Bước 6 là chỗ việc riêng của thiết bị diễn ra: đọc trạng thái ("xong chưa? lỗi không?"), có khi lấy dữ liệu, và đánh thức driver đang chờ. Bước 7 cho thấy vì sao một ngắt hay kết thúc bằng một lần chuyển ngữ cảnh: tiến trình đang chờ I/O này giờ có thể đã sẵn sàng, và nếu nó ưu tiên hơn tiến trình bị ngắt thì bộ lập lịch chọn nó. Bước 8–10 chính là chuyển ngữ cảnh (Chương 2).</p>
<p>➕ Linux chia việc này làm hai để ngắt được ngắn. <strong>Nửa trên (top half)</strong> (trình xử lý IRQ đã đăng ký) chạy trong lúc đường ngắt đó bị che và chỉ làm phần gấp — xác nhận, lấy trạng thái, xếp việc. <strong>Nửa dưới (bottom half)</strong> — một softirq, tasklet hay workqueue — làm nốt phần còn lại sau đó, khi ngắt đã được bật. Chương trình đĩa ở slide 7 đã đếm cả hai: mỗi ngắt cứng của đĩa được theo sau bởi các softirq "BLOCK", nửa dưới của tầng khối dùng để hoàn tất các yêu cầu.</p>
<p class="meo">🧠 Nửa trên = "ghi nhận chuyện gì xảy ra, thật nhanh". Nửa dưới = "xử lý cho đàng hoàng, muộn hơn một chút". Cùng ý với một web server trả "202 Accepted" ngay rồi làm việc nặng trong một hàng đợi nền.</p>`],
      [18, 'Device Drivers',
        `<p class="y-chinh">🎯 Figure 5-12: each kind of device has its own <strong>device driver</strong> (printer driver, camcorder driver, CD-ROM driver) inside the kernel, between "the rest of the operating system" and the device controllers; user programs reach the devices only through the OS.</p>
<p>The driver is the only code that knows a controller's registers and quirks — usually written by the <strong>device's manufacturer</strong> and delivered with the device. Its job, in the book's words: accept abstract read/write requests from the device-independent software above; check that the parameters are valid; translate them into concrete terms (for a disk: which sector, which head); check whether the device is in use; write a sequence of commands into the controller's registers; then block until the interrupt, or poll briefly for fast devices; check for errors; return data and status. It must also initialise the device, manage its power, and log events. Drivers must be <strong>reentrant</strong> (a second request may arrive while the first is running) and cope with devices being plugged in or pulled out at any time.</p>
<p>➕ On Linux, sysfs links every device to the driver serving it:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Which driver runs the disk vda? sysfs links every device to its driver<br>
$ readlink -f /sys/block/vda/device/driver<br>
/sys/bus/virtio/drivers/virtio_blk<br>
# All drivers registered on the virtio bus (each one talks to one kind of virtual device)<br>
$ ls /sys/bus/virtio/drivers<br>
9pnet_virtio<br>
virtio_balloon<br>
virtio_blk<br>
virtio_console<br>
virtio_gpu<br>
virtio_input<br>
virtio_net<br>
virtio_pmem<br>
virtio_rng<br>
virtio_rproc_serial<br>
virtiofs<br>
vmw_vsock_virtio_transport<br>
# Drivers inside the kernel image vs. loadable modules<br>
$ cut -d' ' -f1 /proc/modules<br>
selfowner<br>
shiftfs<br>
rosetta<br>
grpcfuse<br>
fakeowner<br>
$ ls /sys/bus/pci/drivers | wc -l<br>
13<br>
$ uname -r<br>
7.0.12-linuxkit</div>
<p>The disk is run by <code>virtio_blk</code>; the virtio bus also has drivers for the network, the console, the GPU, the random-number generator and more — one driver per kind of device, exactly the figure. Most of them are compiled into the kernel image; <code>/proc/modules</code> lists the five that were loaded as separate modules (here, helpers of Docker Desktop). On a desktop Linux, plugging in a new device makes the kernel load its module automatically.</p>
<p class="pitfall">⚠️ "The software that talks to a controller, giving it commands and accepting responses" = device driver (FE10#5, FE11#2, FE18#32). Usually written by = the device's manufacturer (FE22#42). NOT a job of the driver: receiving system calls (FE19#2) and checking if the user may use the device (FE24#38 — that is the device-independent layer, slide 19). Drivers DO write commands into device registers (FE26#11).</p>`,
        `<p class="y-chinh">🎯 Hình 5-12: mỗi loại thiết bị có <strong>trình điều khiển thiết bị (device driver)</strong> riêng (driver máy in, driver máy quay, driver CD-ROM) nằm trong nhân, giữa "phần còn lại của hệ điều hành" và các bộ điều khiển thiết bị; chương trình người dùng chỉ tới được thiết bị thông qua HĐH.</p>
<p>Driver là đoạn mã duy nhất biết các thanh ghi và tính nết của một bộ điều khiển — thường do <strong>nhà sản xuất thiết bị</strong> viết và giao kèm thiết bị. Việc của nó, theo lời sách: nhận yêu cầu đọc/ghi trừu tượng từ phần mềm độc lập thiết bị ở trên; kiểm tham số có hợp lệ không; dịch chúng thành dạng cụ thể (với đĩa: sector nào, đầu từ nào); kiểm thiết bị có đang bận không; ghi một chuỗi lệnh vào thanh ghi của bộ điều khiển; rồi chặn chờ ngắt, hoặc hỏi vòng một chút với thiết bị nhanh; kiểm lỗi; trả dữ liệu và trạng thái. Nó còn phải khởi tạo thiết bị, quản lý điện năng của thiết bị, và ghi nhật ký sự kiện. Driver phải <strong>tái nhập được (reentrant)</strong> (yêu cầu thứ hai có thể tới trong lúc yêu cầu đầu đang chạy) và chịu được việc thiết bị bị cắm vào hay rút ra bất cứ lúc nào.</p>
<p>➕ Trên Linux, sysfs nối mỗi thiết bị với driver đang phục vụ nó:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Driver nào điều khiển đĩa vda? sysfs nối mỗi thiết bị với driver của nó<br>
$ readlink -f /sys/block/vda/device/driver<br>
/sys/bus/virtio/drivers/virtio_blk<br>
# Mọi driver đăng ký trên bus virtio (mỗi cái nói chuyện với một loại thiết bị ảo)<br>
$ ls /sys/bus/virtio/drivers<br>
9pnet_virtio<br>
virtio_balloon<br>
virtio_blk<br>
virtio_console<br>
virtio_gpu<br>
virtio_input<br>
virtio_net<br>
virtio_pmem<br>
virtio_rng<br>
virtio_rproc_serial<br>
virtiofs<br>
vmw_vsock_virtio_transport<br>
# Driver nằm sẵn trong ảnh nhân so với module nạp được<br>
$ cut -d' ' -f1 /proc/modules<br>
selfowner<br>
shiftfs<br>
rosetta<br>
grpcfuse<br>
fakeowner<br>
$ ls /sys/bus/pci/drivers | wc -l<br>
13<br>
$ uname -r<br>
7.0.12-linuxkit</div>
<p>Đĩa do <code>virtio_blk</code> điều khiển; bus virtio còn có driver cho mạng, console, GPU, bộ sinh số ngẫu nhiên và nhiều thứ khác — mỗi loại thiết bị một driver, đúng như hình. Phần lớn chúng được biên dịch sẵn trong ảnh nhân; <code>/proc/modules</code> liệt kê năm cái được nạp dưới dạng module riêng (ở đây là các phần phụ trợ của Docker Desktop). Trên Linux máy bàn, cắm một thiết bị mới là nhân tự nạp module của nó.</p>
<p class="pitfall">⚠️ "Phần mềm nói chuyện với bộ điều khiển, ra lệnh và nhận phản hồi" = device driver (FE10#5, FE11#2, FE18#32). Thường do ai viết = nhà sản xuất thiết bị (FE22#42). KHÔNG phải việc của driver: nhận lời gọi hệ thống (FE19#2) và kiểm người dùng có được dùng thiết bị không (FE24#38 — đó là tầng độc lập thiết bị, slide 19). Driver CÓ ghi lệnh vào thanh ghi thiết bị (FE26#11).</p>`],
      [19, 'Device-Independent I/O Software',
        `<p class="y-chinh">🎯 Figure 5-13: the functions of the <strong>device-independent I/O software</strong> — uniform interfacing for device drivers, buffering, error reporting, allocating and releasing dedicated devices, and providing a device-independent block size.</p>
<p>Everything that is the same for all devices lives here, once, instead of in every driver. <strong>Uniform interfacing</strong> (slide 20) includes naming — mapping <code>/dev/disk0</code> to a driver through its major and minor numbers (slide 2's output) — and <strong>protection</strong>: in UNIX the device files carry the usual rwx bits, so the same permission check as for files decides who may use a device. <strong>Buffering</strong> is slides 21–22. <strong>Error reporting</strong>: programming errors (writing to an input device, an invalid buffer address) get an error code back at once; real I/O errors that the driver could not fix are reported upward, and the program decides. <strong>Dedicated devices</strong> (a printer, a tape) are given to one process at a time — in UNIX by having <code>open</code> fail on a busy device, or by queueing the request. <strong>A uniform block size</strong> hides that one disk has 512-byte sectors and another 4096-byte sectors: higher layers see one logical block size.</p>
<p>➕ The protection part is visible in any <code>ls -l /dev</code>: <code>/dev/hvc0</code> on slide 2 is <code>crw-------</code> — only root may touch the console — while <code>/dev/null</code> is open to everybody. Same rwx bits, same check as for a text file: that check belongs to this layer, not to a driver.</p>
<p class="pitfall">⚠️ "Checking whether the user may use the device" is done by the device-independent software (FE18#25). NOT one of its jobs: "allocating port numbers to I/O devices" (FE6#37). "Characters arrive while the page holding the user buffer is being brought in from disk" — the buffer is not available, there is no place to put them (FE6#38; slide 21 explains it). Devices given to one job at a time = dedicated (FE28#21).</p>`,
        `<p class="y-chinh">🎯 Hình 5-13: các chức năng của <strong>phần mềm I/O độc lập thiết bị (device-independent I/O software)</strong> — giao diện thống nhất cho các driver, đệm, báo lỗi, cấp phát và thu hồi thiết bị dành riêng, và cung cấp một cỡ khối độc lập thiết bị.</p>
<p>Mọi thứ giống nhau cho mọi thiết bị đều nằm ở đây, một lần, thay vì lặp lại trong từng driver. <strong>Giao diện thống nhất</strong> (slide 20) gồm cả đặt tên — ánh xạ <code>/dev/disk0</code> tới một driver qua số major và minor (output của slide 2) — và <strong>bảo vệ</strong>: trong UNIX, tệp thiết bị mang các bit rwx bình thường, nên chính phép kiểm quyền như với tệp sẽ quyết định ai được dùng thiết bị. <strong>Đệm</strong> là slide 21–22. <strong>Báo lỗi</strong>: lỗi lập trình (ghi vào thiết bị chỉ để đọc, địa chỉ bộ đệm không hợp lệ) nhận mã lỗi trả về ngay; lỗi I/O thật mà driver không sửa được thì được báo lên trên, chương trình tự quyết. <strong>Thiết bị dành riêng</strong> (máy in, băng từ) chỉ giao cho một tiến trình mỗi lúc — trong UNIX bằng cách cho <code>open</code> thất bại khi thiết bị đang bận, hoặc xếp yêu cầu vào hàng đợi. <strong>Cỡ khối thống nhất</strong> giấu chuyện đĩa này có sector 512 byte còn đĩa kia 4096 byte: các tầng trên chỉ thấy một cỡ khối logic.</p>
<p>➕ Phần bảo vệ nhìn thấy ngay trong bất kỳ <code>ls -l /dev</code> nào: <code>/dev/hvc0</code> ở slide 2 là <code>crw-------</code> — chỉ root được chạm vào console — còn <code>/dev/null</code> mở cho mọi người. Cùng các bit rwx, cùng phép kiểm như với một tệp văn bản: phép kiểm đó thuộc tầng này, không thuộc driver nào.</p>
<p class="pitfall">⚠️ "Kiểm xem người dùng có được dùng thiết bị không" do phần mềm độc lập thiết bị làm (FE18#25). KHÔNG phải việc của nó: "cấp số cổng cho thiết bị I/O" (FE6#37). "Ký tự tới trong lúc trang chứa bộ đệm người dùng đang được nạp từ đĩa" — bộ đệm không dùng được, chẳng có chỗ đặt chúng (FE6#38; slide 21 giải thích). Thiết bị chỉ giao cho một job mỗi lúc = dedicated (dành riêng) (FE28#21).</p>`],
      [20, 'Uniform Interfacing for Device Drivers',
        `<p class="y-chinh">🎯 Figure 5-14: (a) <strong>without</strong> a standard driver interface, every driver (SATA, USB, SCSI disk) has a different "shape", and the OS needs new code for each; (b) <strong>with</strong> a standard interface, all drivers of a class plug into the same socket.</p>
<p>The OS defines, for each class of device (block devices, character devices, network interfaces), the set of functions a driver must provide — read, write, open, close, ioctl, power on/off... — usually as a table of function pointers that the driver fills in when it registers. Then adding a new disk type means writing one driver, not changing the file system. The book's second point is naming: the major number of a device file selects the driver, the minor number is passed to it as a parameter to select the unit — exactly the <code>major 254 minor 0</code> of <code>/dev/vda</code> on slide 2.</p>
<p>➕ In Linux the standard interface is literally a C struct of function pointers: a character driver fills in <code>struct file_operations</code> (<code>.read</code>, <code>.write</code>, <code>.open</code>, <code>.unlocked_ioctl</code>, <code>.mmap</code>...), a block driver <code>struct block_device_operations</code>. When your program calls <code>read(fd, ...)</code>, the VFS follows the pointer stored for that file — the same call reaching a different driver each time, which is what slide 10's <code>wc</code> demonstrated.</p>
<p class="meo">🧠 This is an interface in the Java sense: <code>file_operations</code> is to drivers what <code>interface InputStream</code> is to <code>FileInputStream</code>, <code>ByteArrayInputStream</code> and <code>SocketInputStream</code> — one contract, many implementations.</p>`,
        `<p class="y-chinh">🎯 Hình 5-14: (a) <strong>không có</strong> giao diện driver chuẩn, mỗi driver (đĩa SATA, USB, SCSI) có một "hình dạng" khác nhau, và HĐH cần mã mới cho từng cái; (b) <strong>có</strong> giao diện chuẩn, mọi driver cùng loại cắm vào cùng một ổ cắm.</p>
<p>Với mỗi loại thiết bị (thiết bị khối, thiết bị ký tự, giao diện mạng), HĐH định nghĩa tập hàm mà một driver phải cung cấp — read, write, open, close, ioctl, bật/tắt nguồn... — thường dưới dạng một bảng con trỏ hàm mà driver điền vào khi đăng ký. Khi đó thêm một loại đĩa mới chỉ cần viết một driver, không phải sửa hệ thống tệp. Ý thứ hai của sách là đặt tên: số major của tệp thiết bị chọn driver, số minor được truyền cho driver làm tham số để chọn đơn vị — đúng <code>major 254 minor 0</code> của <code>/dev/vda</code> ở slide 2.</p>
<p>➕ Trong Linux, giao diện chuẩn đúng nghĩa đen là một struct C chứa con trỏ hàm: driver ký tự điền <code>struct file_operations</code> (<code>.read</code>, <code>.write</code>, <code>.open</code>, <code>.unlocked_ioctl</code>, <code>.mmap</code>...), driver khối điền <code>struct block_device_operations</code>. Khi chương trình gọi <code>read(fd, ...)</code>, VFS đi theo con trỏ đã lưu cho tệp đó — cùng một lời gọi mà mỗi lần tới một driver khác, đúng điều lệnh <code>wc</code> ở slide 10 đã cho thấy.</p>
<p class="meo">🧠 Đây là một interface theo nghĩa Java: <code>file_operations</code> đối với driver giống như <code>interface InputStream</code> đối với <code>FileInputStream</code>, <code>ByteArrayInputStream</code> và <code>SocketInputStream</code> — một hợp đồng, nhiều bản cài đặt.</p>`],
      [21, 'Buffering (1)',
        `<p class="y-chinh">🎯 Figure 5-15: four ways to read characters from a modem — (a) <strong>unbuffered</strong>: the process is woken up for every single character; (b) <strong>buffering in user space</strong>: the process gives an n-character buffer and is woken when it is full; (c) <strong>buffering in the kernel</strong>, then copying to user space; (d) <strong>double buffering</strong> in the kernel.</p>
<p>(a) is hopeless: a context switch per character. (b) is better, but what if the buffer's page is swapped out when a character arrives? It could be locked in memory, but if many processes did that the pool of free pages would shrink. (c) solves it: the kernel collects characters in its own buffer and copies a whole buffer to user space later — but what happens to characters that arrive while the kernel buffer is being copied (or while the user page is being paged in)? (d) answers that: two kernel buffers; while one is copied, the other fills. Generalised, this becomes a <strong>circular buffer</strong> (ring buffer) with a producer pointer and a consumer pointer — how network cards, sound cards and the terminal driver work today.</p>
<p>➕ User-space buffering, measured. The same 10,000 bytes written three ways, counting the <code>write</code> system calls with <code>strace</code>:</p>
<div class="out"># Buffering in user space (Figure 5-15b), measured: how many write() system calls for 10,000 bytes?<br>
$ gcc -O0 -o ghi _ghi.c<br>
$ strace -o raw.log -e trace=write ./ghi raw &gt; /dev/null<br>
$ grep -c '^write' raw.log<br>
10000<br>
$ strace -o stdio.log -e trace=write ./ghi stdio &gt; /dev/null<br>
$ grep '^write' stdio.log<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 1808) = 1808<br>
$ strace -o big.log -e trace=write ./ghi big &gt; /dev/null<br>
$ grep '^write' big.log<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 10000) = 10000</div>
<p>Unbuffered: 10,000 system calls. With the C library's stdio buffer (4096 bytes here, the block size it found for the output): 3 calls. With a 64 KB buffer set by <code>setvbuf</code>: 1 call. Every system call crosses into the kernel (11 steps, lesson 1.B slide 27) — buffering divides that cost by thousands.</p>
<p class="pitfall">⚠️ Buffering can surprise you: output sitting in a user buffer is lost if the program crashes, and appears late on a pipe. Chapter 0's "hello printed twice after fork" was exactly a stdio buffer copied into the child.</p>`,
        `<p class="y-chinh">🎯 Hình 5-15: bốn cách đọc ký tự từ modem — (a) <strong>không đệm (unbuffered)</strong>: tiến trình bị đánh thức cho từng ký tự; (b) <strong>đệm ở không gian người dùng</strong>: tiến trình đưa một bộ đệm n ký tự và chỉ bị đánh thức khi nó đầy; (c) <strong>đệm trong nhân</strong>, rồi chép sang không gian người dùng; (d) <strong>đệm kép (double buffering)</strong> trong nhân.</p>
<p>(a) vô vọng: mỗi ký tự một lần chuyển ngữ cảnh. (b) khá hơn, nhưng nếu trang chứa bộ đệm bị đẩy ra đĩa đúng lúc một ký tự tới thì sao? Có thể khoá trang đó trong bộ nhớ, nhưng nếu nhiều tiến trình cùng làm vậy thì kho trang trống sẽ cạn. (c) giải quyết: nhân gom ký tự vào bộ đệm của chính nó và chép cả bộ đệm sang không gian người dùng sau — nhưng ký tự tới đúng lúc bộ đệm nhân đang được chép (hoặc trang người dùng đang được nạp) thì sao? (d) trả lời: hai bộ đệm nhân; cái này đang được chép thì cái kia hứng dữ liệu. Tổng quát lên ta được <strong>bộ đệm vòng (circular buffer, ring buffer)</strong> với một con trỏ của bên sản xuất và một của bên tiêu thụ — cách card mạng, card âm thanh và driver terminal làm việc ngày nay.</p>
<p>➕ Đệm ở không gian người dùng, đo thật. Cùng 10.000 byte được ghi theo ba cách, đếm số lời gọi hệ thống <code>write</code> bằng <code>strace</code>:</p>
<div class="out"># Đệm ở không gian người dùng (Hình 5-15b), đo thật: bao nhiêu lời gọi write() cho 10.000 byte?<br>
$ gcc -O0 -o ghi _ghi.c<br>
$ strace -o raw.log -e trace=write ./ghi raw &gt; /dev/null<br>
$ grep -c '^write' raw.log<br>
10000<br>
$ strace -o stdio.log -e trace=write ./ghi stdio &gt; /dev/null<br>
$ grep '^write' stdio.log<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 1808) = 1808<br>
$ strace -o big.log -e trace=write ./ghi big &gt; /dev/null<br>
$ grep '^write' big.log<br>
write(1, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 10000) = 10000</div>
<p>Không đệm: 10.000 lời gọi hệ thống. Với bộ đệm stdio của thư viện C (ở đây 4096 byte, đúng cỡ khối nó dò được cho đầu ra): 3 lời gọi. Với bộ đệm 64 KB đặt bằng <code>setvbuf</code>: 1 lời gọi. Mỗi lời gọi hệ thống là một lần vượt vào nhân (11 bước, bài 1.B slide 27) — đệm chia chi phí đó cho hàng nghìn.</p>
<p class="pitfall">⚠️ Đệm có thể làm bạn bất ngờ: output còn nằm trong bộ đệm người dùng sẽ mất nếu chương trình sập, và hiện ra trễ khi đi qua pipe. Chuyện "hello in ra hai lần sau fork" ở Mục 0 chính là một bộ đệm stdio bị chép sang tiến trình con.</p>`],
      [22, 'Buffering (2)',
        `<p class="y-chinh">🎯 Figure 5-16: networking may involve many copies of a packet — (1) user buffer → kernel buffer; (2) kernel → network controller; (3) over the network to the receiver's controller; (4) controller → receiver's kernel buffer; (5) kernel → receiving process.</p>
<p>Each copy costs memory bandwidth and CPU time, and buffering is the reason for most of them: the kernel copies the packet out of the user's buffer so the user may reuse it at once (copy 1); the controller copies the whole packet into its own memory before sending, so the transmission is not interrupted by a slow bus (copy 2); the receiver's controller must hold the packet before the kernel knows where it goes (copy 4). The book's lesson: buffering is widely used, but done too often it hurts performance.</p>
<p>➕ Modern systems fight the copies. One example — sending a file, as a web server does for every static file — with the classic read/write loop and with <code>sendfile()</code>, which moves the data inside the kernel:</p>
<div class="out"># Fewer copies (Figure 5-16): send a 1 MiB file the classic way and with sendfile()<br>
$ gcc -O0 -o gui _gui.c<br>
$ head -c 1048576 /dev/zero &gt; data.bin<br>
$ strace -o a.log -e trace=read,write,sendfile ./gui copy &gt; /dev/null<br>
$ grep -cE '^(read|write)\\(' a.log<br>
514<br>
$ strace -o b.log -e trace=read,write,sendfile ./gui sendfile &gt; /dev/null<br>
$ grep -E '^(read|write|sendfile)\\(' b.log | grep -v ELF<br>
sendfile(1, 3, NULL, 1048576) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1048576</div>
<p>The read/write loop needed 514 system calls for 1 MiB (256 reads, 256 writes, plus the final read of 0 and the loader's read) and copied every byte into user space and back; <code>sendfile</code> did it in one call, and the bytes never left the kernel. The older web lesson 5.1 ("zero-copy") explains why nginx and CDNs depend on this; with DMA from the page cache straight to the network card, the copies of the figure drop to almost none.</p>
<div class="callout">🧭 On a real server: nginx has <code>sendfile on;</code>, Java has <code>FileChannel.transferTo()</code>, Node.js streams large files with <code>pipe()</code> — three names for the same fight against Figure 5-16.</div>`,
        `<p class="y-chinh">🎯 Hình 5-16: gửi qua mạng có thể kéo theo nhiều bản sao của một gói tin — (1) bộ đệm người dùng → bộ đệm nhân; (2) nhân → bộ điều khiển mạng; (3) qua mạng tới bộ điều khiển của bên nhận; (4) bộ điều khiển → bộ đệm nhân bên nhận; (5) nhân → tiến trình nhận.</p>
<p>Mỗi lần chép tốn băng thông bộ nhớ và thời gian CPU, và đệm là lý do của phần lớn số lần chép đó: nhân chép gói tin ra khỏi bộ đệm người dùng để người dùng dùng lại bộ đệm ngay (lần 1); bộ điều khiển chép cả gói vào bộ nhớ riêng trước khi gửi, để việc phát không bị một bus chậm làm gián đoạn (lần 2); bộ điều khiển bên nhận phải giữ gói tin trước khi nhân biết nó đi đâu (lần 4). Bài học của sách: đệm được dùng khắp nơi, nhưng dùng quá nhiều thì hại hiệu năng.</p>
<p>➕ Hệ thống hiện đại chống lại các lần chép. Một ví dụ — gửi một tệp, đúng việc web server làm cho mọi tệp tĩnh — bằng vòng lặp read/write cổ điển và bằng <code>sendfile()</code>, hàm chuyển dữ liệu ngay bên trong nhân:</p>
<div class="out"># Bớt sao chép (Hình 5-16): gửi tệp 1 MiB theo cách cổ điển và bằng sendfile()<br>
$ gcc -O0 -o gui _gui.c<br>
$ head -c 1048576 /dev/zero &gt; data.bin<br>
$ strace -o a.log -e trace=read,write,sendfile ./gui copy &gt; /dev/null<br>
$ grep -cE '^(read|write)\\(' a.log<br>
514<br>
$ strace -o b.log -e trace=read,write,sendfile ./gui sendfile &gt; /dev/null<br>
$ grep -E '^(read|write|sendfile)\\(' b.log | grep -v ELF<br>
sendfile(1, 3, NULL, 1048576) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 1048576</div>
<p>Vòng read/write cần 514 lời gọi hệ thống cho 1 MiB (256 lần read, 256 lần write, cộng lần read cuối trả 0 và lần read của trình nạp) và chép từng byte lên không gian người dùng rồi chép ngược xuống; <code>sendfile</code> làm trong một lời gọi, và các byte chưa hề rời khỏi nhân. Bài web cũ 5.1 ("zero-copy") giải thích vì sao nginx và CDN phụ thuộc vào nó; với DMA từ page cache thẳng tới card mạng, số lần chép trong hình gần như về 0.</p>
<div class="callout">🧭 Trên server thật: nginx có <code>sendfile on;</code>, Java có <code>FileChannel.transferTo()</code>, Node.js truyền tệp lớn bằng <code>pipe()</code> — ba cái tên cho cùng một cuộc chiến chống Hình 5-16.</div>`],
      [23, 'User-Space I/O Software',
        `<p class="y-chinh">🎯 Figure 5-17: the layers of the I/O system and the main function of each — user processes: make the I/O call, format I/O, spooling; device-independent software: naming, protection, blocking, buffering, allocation; device drivers: set up device registers, check status; interrupt handlers: wake up the driver when I/O completes; hardware: perform the I/O. A request goes down, the reply comes back up.</p>
<p>Not all I/O software is in the kernel. Library procedures linked into programs do part of the work: <code>write</code> is a thin wrapper around the system call, while <code>printf</code> does real work — it converts binary numbers into ASCII text before anything reaches the kernel. The other user-space piece is the <strong>spooling system</strong>: for a dedicated device such as a printer, users do not open the device; they put their file into a <strong>spooling directory</strong>, and one special process, the <strong>daemon</strong>, is the only one allowed to use the printer — it prints the files one by one. The same idea serves e-mail and, today, job queues.</p>
<p>➕ Formatting is done in user space — the kernel receives finished text:</p>
<pre><code class="language-c">// User-space I/O software (Figure 5-17): printf formats in the library; the kernel only sees finished bytes
#include &lt;stdio.h&gt;

int main(void) {
    int so_luong = 3;
    double tong = 1234.5;
    printf("%d items, total %.2f\\n", so_luong, tong);   // binary numbers -&gt; ASCII text, in user space
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dinh-dang.c -o dinh-dang &amp;&amp; strace -e trace=write ./dinh-dang 2&gt;&amp;1 &gt;/dev/null<br>
write(1, "3 items, total 1234.50\\n", 23) = 23<br>
+++ exited with 0 +++</div>
<p>The program passed the integer 3 and the double 1234.5 to <code>printf</code>; the only system call the kernel saw was <code>write(1, "3 items, total 1234.50\\n", 23)</code>. Converting numbers to characters happened entirely in libc.</p>
<p class="pitfall">⚠️ Match the job to the layer (FE18#25, FE20#16, FE25#27, FE26#11, FE9#40): converting binary integers to ASCII for printing → <strong>user-level software</strong>; checking whether the user may use the device → <strong>device-independent</strong>; computing track, sector and head / writing commands into device registers → <strong>device driver</strong>; waking the driver when I/O completes → <strong>interrupt handler</strong>. Spooling — a disk takes the output of many users until the printer is ready (FE20#1, FE21#36, FE22#19).</p>`,
        `<p class="y-chinh">🎯 Hình 5-17: các tầng của hệ thống I/O và chức năng chính của mỗi tầng — tiến trình người dùng: gọi I/O, định dạng I/O, spooling; phần mềm độc lập thiết bị: đặt tên, bảo vệ, chặn, đệm, cấp phát; driver: thiết lập thanh ghi thiết bị, kiểm trạng thái; trình xử lý ngắt: đánh thức driver khi I/O xong; phần cứng: thực hiện I/O. Yêu cầu đi xuống, trả lời đi ngược lên.</p>
<p>Không phải mọi phần mềm I/O đều ở trong nhân. Các thủ tục thư viện liên kết vào chương trình làm một phần việc: <code>write</code> chỉ là lớp bọc mỏng quanh lời gọi hệ thống, còn <code>printf</code> làm việc thật — nó đổi số nhị phân thành chữ ASCII trước khi bất cứ thứ gì tới nhân. Mảnh còn lại ở không gian người dùng là <strong>hệ thống spooling</strong>: với thiết bị dành riêng như máy in, người dùng không mở thiết bị; họ đặt tệp vào một <strong>thư mục spool</strong>, và một tiến trình đặc biệt, <strong>daemon</strong>, là kẻ duy nhất được dùng máy in — nó in từng tệp một. Cùng ý tưởng phục vụ thư điện tử và, ngày nay, các hàng đợi công việc.</p>
<p>➕ Định dạng được làm ở không gian người dùng — nhân chỉ nhận chữ đã xong:</p>
<pre><code class="language-c">// Phần mềm I/O ở không gian người dùng (Hình 5-17): printf định dạng trong thư viện; nhân chỉ thấy byte đã xong
#include &lt;stdio.h&gt;

int main(void) {
    int so_luong = 3;
    double tong = 1234.5;
    printf("%d items, total %.2f\\n", so_luong, tong);   // số nhị phân -&gt; chữ ASCII, ở không gian người dùng
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dinh-dang.c -o dinh-dang &amp;&amp; strace -e trace=write ./dinh-dang 2&gt;&amp;1 &gt;/dev/null<br>
write(1, "3 items, total 1234.50\\n", 23) = 23<br>
+++ exited with 0 +++</div>
<p>Chương trình đưa số nguyên 3 và số thực 1234.5 cho <code>printf</code>; lời gọi hệ thống duy nhất nhân nhìn thấy là <code>write(1, "3 items, total 1234.50\\n", 23)</code>. Việc đổi số thành ký tự diễn ra trọn trong libc.</p>
<p class="pitfall">⚠️ Ghép việc với tầng (FE18#25, FE20#16, FE25#27, FE26#11, FE9#40): đổi số nguyên nhị phân sang ASCII để in → <strong>phần mềm mức người dùng</strong>; kiểm người dùng có được dùng thiết bị → <strong>độc lập thiết bị</strong>; tính rãnh, sector, đầu từ / ghi lệnh vào thanh ghi thiết bị → <strong>driver</strong>; đánh thức driver khi I/O xong → <strong>trình xử lý ngắt</strong>. Spooling — một đĩa nhận output của nhiều người dùng cho tới khi máy in sẵn sàng (FE20#1, FE21#36, FE22#19).</p>`],
    ]),
    books([
      ['mos4', 'Chapter 5, sections 5.1–5.3 (pp. 337–368), Figures 5-1 to 5-17', 'Chương 5, mục 5.1–5.3 (tr. 337–368), Hình 5-1 tới 5-17'],
      ['ostep', 'Chapter 36 "I/O Devices" (polling, interrupts, DMA, device drivers)', 'Chương 36 "I/O Devices" (hỏi vòng, ngắt, DMA, driver)'],
      ['kernelDocs', "\"The Linux driver implementer's API guide\" and Documentation/core-api/genericirq (top and bottom halves)", "\"The Linux driver implementer's API guide\" và Documentation/core-api/genericirq (nửa trên, nửa dưới)"],
      ['man7', 'proc(5) for /proc/interrupts, /proc/iomem, /proc/devices; sendfile(2), setvbuf(3), mmap(2), sigaction(2)', 'proc(5) cho /proc/interrupts, /proc/iomem, /proc/devices; sendfile(2), setvbuf(3), mmap(2), sigaction(2)'],
    ]),
  ].join('\n'),
};

/* ───────── 5.B — 📑 Slide by slide · I/O: disks, RAID, disk scheduling, clocks, terminals, GUIs, power (slides 24–57) ───────── */
const L_osg5_2 = {
  title: '5.B — 📑 Slide by slide · I/O: disks, RAID, disk scheduling, clocks, terminals, GUIs, power (slides 24–57)|||5.B — 📑 Học theo từng slide · I/O: đĩa, RAID, lập lịch đĩa, đồng hồ, terminal, GUI, điện năng (slide 24–57)',
  slug: 'osg202-slide-osg5-2',
  type: 'VIDEO',
  description: 'Giảng đủ 34 slide cuối Chương 5: thông số đĩa (đĩa mềm và VelociRaptor, tính ra hình học thật sau con số 63 sector), vùng và hình học ảo, RAID 0–6 với chẵn lẻ XOR chạy thật (mất một đĩa rồi dựng lại), định dạng sector, độ lệch trụ và xen kẽ tính bằng chương trình, lập lịch cần đĩa FCFS, SSF, thang máy (LOOK), SCAN, C-SCAN, C-LOOK do bộ mô phỏng vẽ đường đầu từ và đối chiếu từng câu đề FE, xử lý sector hỏng, lưu trữ ổn định với năm thời điểm sập nguồn, đồng hồ lập trình được và thanh ghi giữ, phần mềm đồng hồ (giới hạn CPU, hẹn giờ, năm 2038), nhiều bộ hẹn giờ trên một đồng hồ, bộ hẹn giờ mềm, chế độ chính tắc và chế độ thô của bàn phím, chuỗi thoát ANSI, X Window và Wayland, vòng lặp sự kiện của GUI, bitmap, phông chữ và quản lý năng lượng — kèm các chỗ slide đã lỗi thời.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.B · deck "Chapter 5 · Input/Output", slides 24–57</span>
<h2>Real devices: disks, clocks, keyboards and screens — and the battery</h2>
<p class="lead">The second half applies the principles of 5.A to real devices, following sections 5.4–5.8 of the book. Disks get the most space because they give the FE its calculations: arm scheduling, cylinder skew, RAID. Then clocks (the one device every OS needs), the keyboard and the text screen (the terminal driver still in every Linux), the X Window System and Windows GUIs, and finally power management. The UI part is taught more briefly and updated for 2026 — Wayland, not X, is the default display system of most desktop Linux distributions today.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>24–30</td><td>5.4.1–5.4.2 Disk hardware, RAID, formatting</td><td>read a disk parameter table, compare RAID levels, compute cylinder skew</td></tr>
<tr><td>31–33</td><td>5.4.3 Disk arm scheduling</td><td>compute the head movement of FCFS, SSF and the elevator (and SCAN, C-SCAN, LOOK, C-LOOK)</td></tr>
<tr><td>34–36</td><td>5.4.4 Error handling, stable storage</td><td>explain bad-sector remapping and the stable write</td></tr>
<tr><td>37–41</td><td>5.5 Clocks</td><td>compute a holding register, list the clock driver's duties, explain timer lists and soft timers</td></tr>
<tr><td>42–53</td><td>5.6 User interfaces</td><td>tell canonical from raw mode, read ANSI escapes, follow an event loop (X, Windows)</td></tr>
<tr><td>54–57</td><td>5.8 Power management</td><td>say where a laptop's energy goes and how voltage scaling saves it</td></tr>
</tbody>
</table>
<div class="callout">The older web lesson 5.2 further down is a worked example of six disk algorithms on the Silberschatz data (head 53); the simulator below reproduces all its numbers, then applies the book's own example and the FE questions.</div>`,
    `<span class="eyebrow">Chương 5 · Bài 5.B · deck "Chapter 5 · Input/Output", slide 24–57</span>
<h2>Thiết bị thật: đĩa, đồng hồ, bàn phím và màn hình — và cục pin</h2>
<p class="lead">Nửa sau áp các nguyên lý của 5.A vào thiết bị thật, theo mục 5.4–5.8 của sách. Đĩa chiếm nhiều chỗ nhất vì nó cho FE các bài tính: lập lịch cần đĩa, độ lệch trụ, RAID. Rồi tới đồng hồ (thiết bị mà HĐH nào cũng cần), bàn phím và màn hình văn bản (driver terminal vẫn còn trong mọi Linux), X Window System và giao diện đồ hoạ Windows, cuối cùng là quản lý năng lượng. Phần giao diện được giảng gọn hơn và cập nhật cho năm 2026 — Wayland, chứ không phải X, là hệ thống hiển thị mặc định của phần lớn bản Linux máy bàn ngày nay.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>24–30</td><td>5.4.1–5.4.2 Phần cứng đĩa, RAID, định dạng</td><td>đọc bảng thông số đĩa, so sánh các mức RAID, tính độ lệch trụ</td></tr>
<tr><td>31–33</td><td>5.4.3 Lập lịch cần đĩa</td><td>tính quãng đầu từ của FCFS, SSF và thang máy (cùng SCAN, C-SCAN, LOOK, C-LOOK)</td></tr>
<tr><td>34–36</td><td>5.4.4 Xử lý lỗi, lưu trữ ổn định</td><td>giải thích việc thay sector hỏng và ghi ổn định</td></tr>
<tr><td>37–41</td><td>5.5 Đồng hồ</td><td>tính thanh ghi giữ, kể nhiệm vụ của driver đồng hồ, giải thích danh sách hẹn giờ và bộ hẹn giờ mềm</td></tr>
<tr><td>42–53</td><td>5.6 Giao diện người dùng</td><td>phân biệt chế độ chính tắc và thô, đọc chuỗi thoát ANSI, lần theo vòng lặp sự kiện (X, Windows)</td></tr>
<tr><td>54–57</td><td>5.8 Quản lý năng lượng</td><td>nói được năng lượng của laptop đi đâu và hạ điện áp tiết kiệm thế nào</td></tr>
</tbody>
</table>
<div class="callout">Bài web cũ 5.2 phía dưới là một ví dụ giải sẵn sáu thuật toán đĩa trên bộ dữ liệu Silberschatz (đầu từ ở 53); bộ mô phỏng bên dưới ra đúng mọi con số của nó, rồi áp vào chính ví dụ của sách và các câu FE.</div>`),
    walkHead('osg5', 24, 57),
    walk('osg5', [
      [24, 'Magnetic Disks (1)',
        `<p class="y-chinh">🎯 Figure 5-18: parameters of the original IBM PC 360-KB floppy disk and a Western Digital WD 3000 HLFS "VelociRaptor" hard disk — 40 vs 36,481 cylinders, 2 vs 255 tracks per cylinder, 9 vs 63 (avg) sectors per track, 360 KB vs 300 GB, average seek 77 ms vs 4.2 ms, rotation 200 ms vs 6 ms, 22 ms vs 1.4 µs to transfer one sector.</p>
<p>A magnetic disk is organised into <strong>cylinders</strong>, each containing as many <strong>tracks</strong> as there are heads, each track divided into <strong>sectors</strong> (512 bytes in the figure). Reading a block costs a <strong>seek</strong> (move the arm to the cylinder), the <strong>rotational delay</strong> (wait for the sector to come under the head) and the <strong>transfer</strong>. The comparison shows where 20 years of progress went: capacity ×800,000 and transfer ×15,000, but seek time only ×18 — mechanics improve slowly, which is why the OS fights seeks (slides 31–33).</p>
<p>➕ The table can be checked with arithmetic — and it hides a trick:</p>
<pre><code class="language-javascript">// Check Figure 5-18 with arithmetic, and find the disk's REAL geometry hidden behind "63 sectors"
const floppy = { cyl: 40, heads: 2, spt: 9, bytes: 512 };
const cap = floppy.cyl * floppy.heads * floppy.spt * floppy.bytes;
console.log(&#96;floppy: &#36;{floppy.cyl} x &#36;{floppy.heads} x &#36;{floppy.spt} x 512 = &#36;{cap} bytes = &#36;{cap / 1024} KiB&#96;);
const wd = { sectors: 586072368, rpm: 10000, perSectorUs: 1.4 };
console.log(&#96;WD 3000 HLFS: &#36;{wd.sectors} x 512 = &#36;{(wd.sectors * 512).toLocaleString('en-US')} bytes = &#36;{(wd.sectors * 512 / 1e9).toFixed(1)} GB (decimal)&#96;);
// floppy: 300 rpm =&gt; one turn 200 ms, 9 sectors =&gt; 22 ms per sector (the table's values)
console.log(&#96;floppy: one turn &#36;{60000 / 300} ms / 9 sectors = &#36;{(200 / 9).toFixed(1)} ms per sector&#96;);
// hard disk: 10,000 rpm =&gt; 6 ms per turn; 1.4 us per sector =&gt; how many sectors pass in one turn?
const turnUs = 60e6 / wd.rpm;
console.log(&#96;hard disk: one turn &#36;{turnUs / 1000} ms / &#36;{wd.perSectorUs} us = about &#36;{Math.round(turnUs / wd.perSectorUs)} sectors per track, not 63&#96;);
// the old BIOS (CHS) limits that forced the fake "x/255/63" geometry
const chs = 1024 * 255 * 63 * 512;
console.log(&#96;CHS limit 1024 cyl x 255 heads x 63 sectors x 512 B = &#36;{chs.toLocaleString('en-US')} bytes = &#36;{(chs / 1e9).toFixed(1)} GB&#96;);
console.log(&#96;LBA-28 limit 2^28 x 512 B = &#36;{(2 ** 28 * 512 / 2 ** 30)} GiB; LBA-48 limit 2^48 x 512 B = &#36;{2 ** 48 * 512 / 2 ** 50} PiB&#96;);</code></pre>
<div class="out">$ node thong-so-dia.js<br>
floppy: 40 x 2 x 9 x 512 = 368640 bytes = 360 KiB<br>
WD 3000 HLFS: 586072368 x 512 = 300,069,052,416 bytes = 300.1 GB (decimal)<br>
floppy: one turn 200 ms / 9 sectors = 22.2 ms per sector<br>
hard disk: one turn 6 ms / 1.4 us = about 4286 sectors per track, not 63<br>
CHS limit 1024 cyl x 255 heads x 63 sectors x 512 B = 8,422,686,720 bytes = 8.4 GB<br>
LBA-28 limit 2^28 x 512 B = 128 GiB; LBA-48 limit 2^48 x 512 B = 128 PiB</div>
<p>The floppy is exactly 360 KiB, and 200 ms per turn ÷ 9 sectors gives the table's 22 ms. But for the hard disk, 6 ms per turn ÷ 1.4 µs per sector means about <strong>4,286 sectors pass the head in one revolution</strong> — not 63. "255 heads × 63 sectors" is a <em>virtual</em> geometry, the largest the old PC BIOS could express (the CHS limit of 8.4 GB); the drive's own controller translates it (slide 25). ➕ And today: the container's disk reports to the kernel like this:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># What does the kernel know about its disk? (the course container's virtual disk)<br>
$ lsblk -d -o NAME,SIZE,ROTA,LOG-SEC,PHY-SEC,SCHED /dev/vda<br>
NAME &nbsp;&nbsp;SIZE ROTA LOG-SEC PHY-SEC SCHED<br>
vda &nbsp;926.4G &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;512 &nbsp;&nbsp;&nbsp;&nbsp;512 mq-deadline<br>
$ cd /sys/block/vda/queue<br>
$ echo "rotational=$(cat rotational) &nbsp;logical_block=$(cat logical_block_size) &nbsp;max_sectors_kb=$(cat max_sectors_kb) &nbsp;nr_requests=$(cat nr_requests)"<br>
rotational=1 &nbsp;logical_block=512 &nbsp;max_sectors_kb=4096 &nbsp;nr_requests=256<br>
# "rotational=1" is only what the virtual disk CLAIMS: underneath is the Mac's SSD<br>
$ cat scheduler<br>
none [mq-deadline] kyber</div>
<p>Its "rotational = 1" is a claim of the virtual disk; underneath is the Mac's SSD. Modern hard disks have 4096-byte physical sectors ("Advanced Format", 512e/4Kn) and capacities of tens of terabytes; SSDs have no seek at all.</p>
<p class="pitfall">⚠️ FE4#33: the original IBM PC 360-KB floppy had <strong>9</strong> sectors per track. FE17#8 / FE22#32: of the three components of disk access time, <strong>seek time</strong> is the longest. "Seek time" = time to move the arm to the proper cylinder (FE1#7, FE2#30, FE20#41…).</p>`,
        `<p class="y-chinh">🎯 Hình 5-18: thông số của đĩa mềm 360 KB đời đầu của IBM PC và đĩa cứng Western Digital WD 3000 HLFS "VelociRaptor" — 40 so với 36.481 cylinder, 2 so với 255 rãnh mỗi cylinder, 9 so với 63 (trung bình) sector mỗi rãnh, 360 KB so với 300 GB, thời gian tìm trung bình 77 ms so với 4,2 ms, một vòng quay 200 ms so với 6 ms, 22 ms so với 1,4 µs để truyền một sector.</p>
<p>Đĩa từ được tổ chức thành các <strong>cylinder (trụ)</strong>, mỗi cylinder gồm số <strong>rãnh (track)</strong> bằng số đầu từ, mỗi rãnh chia thành các <strong>sector</strong> (512 byte trong hình). Đọc một khối tốn thời gian <strong>tìm (seek)</strong> (dời cần tới cylinder), <strong>độ trễ quay (rotational delay)</strong> (chờ sector quay tới dưới đầu từ) và <strong>truyền (transfer)</strong>. Bảng so sánh cho thấy 20 năm tiến bộ đi về đâu: dung lượng ×800.000 và tốc độ truyền ×15.000, nhưng thời gian tìm chỉ ×18 — cơ khí tiến chậm, nên HĐH phải chống lại chuyện tìm (slide 31–33).</p>
<p>➕ Bảng này kiểm được bằng phép tính — và nó giấu một mánh:</p>
<pre><code class="language-javascript">// Kiểm Hình 5-18 bằng phép tính, và tìm hình học THẬT của đĩa giấu sau "63 sector"
const floppy = { cyl: 40, heads: 2, spt: 9, bytes: 512 };
const cap = floppy.cyl * floppy.heads * floppy.spt * floppy.bytes;
console.log(&#96;floppy: &#36;{floppy.cyl} x &#36;{floppy.heads} x &#36;{floppy.spt} x 512 = &#36;{cap} bytes = &#36;{cap / 1024} KiB&#96;);
const wd = { sectors: 586072368, rpm: 10000, perSectorUs: 1.4 };
console.log(&#96;WD 3000 HLFS: &#36;{wd.sectors} x 512 = &#36;{(wd.sectors * 512).toLocaleString('en-US')} bytes = &#36;{(wd.sectors * 512 / 1e9).toFixed(1)} GB (decimal)&#96;);
// đĩa mềm: 300 vòng/phút =&gt; một vòng 200 ms, 9 sector =&gt; 22 ms mỗi sector (đúng số trong bảng)
console.log(&#96;floppy: one turn &#36;{60000 / 300} ms / 9 sectors = &#36;{(200 / 9).toFixed(1)} ms per sector&#96;);
// đĩa cứng: 10.000 vòng/phút =&gt; 6 ms một vòng; 1,4 us mỗi sector =&gt; một vòng có bao nhiêu sector?
const turnUs = 60e6 / wd.rpm;
console.log(&#96;hard disk: one turn &#36;{turnUs / 1000} ms / &#36;{wd.perSectorUs} us = about &#36;{Math.round(turnUs / wd.perSectorUs)} sectors per track, not 63&#96;);
// giới hạn BIOS cũ (CHS) buộc phải khai hình học giả "x/255/63"
const chs = 1024 * 255 * 63 * 512;
console.log(&#96;CHS limit 1024 cyl x 255 heads x 63 sectors x 512 B = &#36;{chs.toLocaleString('en-US')} bytes = &#36;{(chs / 1e9).toFixed(1)} GB&#96;);
console.log(&#96;LBA-28 limit 2^28 x 512 B = &#36;{(2 ** 28 * 512 / 2 ** 30)} GiB; LBA-48 limit 2^48 x 512 B = &#36;{2 ** 48 * 512 / 2 ** 50} PiB&#96;);</code></pre>
<div class="out">$ node thong-so-dia.js<br>
floppy: 40 x 2 x 9 x 512 = 368640 bytes = 360 KiB<br>
WD 3000 HLFS: 586072368 x 512 = 300,069,052,416 bytes = 300.1 GB (decimal)<br>
floppy: one turn 200 ms / 9 sectors = 22.2 ms per sector<br>
hard disk: one turn 6 ms / 1.4 us = about 4286 sectors per track, not 63<br>
CHS limit 1024 cyl x 255 heads x 63 sectors x 512 B = 8,422,686,720 bytes = 8.4 GB<br>
LBA-28 limit 2^28 x 512 B = 128 GiB; LBA-48 limit 2^48 x 512 B = 128 PiB</div>
<p>Đĩa mềm đúng 360 KiB, và 200 ms mỗi vòng ÷ 9 sector ra đúng 22 ms của bảng. Nhưng với đĩa cứng, 6 ms mỗi vòng ÷ 1,4 µs mỗi sector nghĩa là khoảng <strong>4.286 sector trôi qua đầu từ trong một vòng</strong> — không phải 63. "255 đầu × 63 sector" là hình học <em>ảo</em>, lớn nhất mà BIOS PC đời cũ biểu diễn được (giới hạn CHS 8,4 GB); bộ điều khiển của chính ổ đĩa tự dịch (slide 25). ➕ Còn hôm nay: đĩa của container khai với nhân như sau:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Nhân biết gì về đĩa của nó? (đĩa ảo của container môn học)<br>
$ lsblk -d -o NAME,SIZE,ROTA,LOG-SEC,PHY-SEC,SCHED /dev/vda<br>
NAME &nbsp;&nbsp;SIZE ROTA LOG-SEC PHY-SEC SCHED<br>
vda &nbsp;926.4G &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;512 &nbsp;&nbsp;&nbsp;&nbsp;512 mq-deadline<br>
$ cd /sys/block/vda/queue<br>
$ echo "rotational=$(cat rotational) &nbsp;logical_block=$(cat logical_block_size) &nbsp;max_sectors_kb=$(cat max_sectors_kb) &nbsp;nr_requests=$(cat nr_requests)"<br>
rotational=1 &nbsp;logical_block=512 &nbsp;max_sectors_kb=4096 &nbsp;nr_requests=256<br>
# "rotational=1" chỉ là điều đĩa ảo TỰ KHAI: bên dưới là SSD của máy Mac<br>
$ cat scheduler<br>
none [mq-deadline] kyber</div>
<p>"rotational = 1" của nó chỉ là lời khai của đĩa ảo; bên dưới là SSD của máy Mac. Đĩa cứng hiện đại có sector vật lý 4096 byte ("Advanced Format", 512e/4Kn) và dung lượng hàng chục terabyte; SSD thì không có chuyện tìm.</p>
<p class="pitfall">⚠️ FE4#33: đĩa mềm 360 KB đời đầu của IBM PC có <strong>9</strong> sector mỗi rãnh. FE17#8 / FE22#32: trong ba thành phần của thời gian truy cập đĩa, <strong>thời gian tìm (seek time)</strong> dài nhất. "Seek time" = thời gian dời cần tới đúng cylinder (FE1#7, FE2#30, FE20#41…).</p>`],
      [25, 'Magnetic Disks (2)',
        `<p class="y-chinh">🎯 Figure 5-19: (a) the physical geometry of a disk with two <strong>zones</strong> — the outer zone has 32 sectors per track, the inner zone 16; (b) a possible <strong>virtual geometry</strong> for the same disk — 6 tracks of 25 sectors each, which is what the OS is told.</p>
<p>Outer tracks are longer, so modern disks put more sectors on them (<strong>zoned bit recording</strong>) instead of wasting space with the same count everywhere. The OS must not care: the controller presents a virtual geometry and maps it onto the real one. Today even that is gone — disks are addressed by <strong>LBA</strong> (Logical Block Addressing): sectors simply numbered 0, 1, 2, … up to the size, and only the drive knows where each one lives. The book mentions the old limits this solved: the PC BIOS gave 10 bits for the cylinder, 8 for the head and 6 for the sector (sectors start at 1), hence 1024 × 255 × 63 sectors and the 8.4 GB barrier you saw computed on slide 24.</p>
<p>➕ The consequence for software: since a block number no longer tells the OS where the head is, the arm-scheduling algorithms of slides 31–33 work on block numbers as an approximation — and modern drives do their own scheduling inside (Native Command Queuing), while SSDs make the question disappear.</p>
<p class="meo">🧠 Physical geometry = how the disk really is; virtual geometry = what it tells the OS. LBA = "forget geometry, just number the blocks".</p>`,
        `<p class="y-chinh">🎯 Hình 5-19: (a) hình học vật lý của một đĩa có hai <strong>vùng (zone)</strong> — vùng ngoài có 32 sector mỗi rãnh, vùng trong 16; (b) một <strong>hình học ảo (virtual geometry)</strong> khả dĩ cho cùng đĩa đó — 6 rãnh, mỗi rãnh 25 sector, đó là thứ được khai với HĐH.</p>
<p>Rãnh ngoài dài hơn, nên đĩa hiện đại đặt nhiều sector hơn ở đó (<strong>ghi theo vùng — zoned bit recording</strong>) thay vì lãng phí chỗ với cùng một số sector ở mọi nơi. HĐH không cần biết: bộ điều khiển khai ra một hình học ảo và ánh xạ nó sang hình học thật. Ngày nay ngay cả điều đó cũng đã biến mất — đĩa được định địa chỉ bằng <strong>LBA</strong> (Logical Block Addressing — định địa chỉ khối logic): các sector đơn giản được đánh số 0, 1, 2, … tới hết, và chỉ ổ đĩa biết mỗi sector nằm ở đâu. Sách nhắc tới các giới hạn cũ mà cách này giải quyết: BIOS của PC dành 10 bit cho cylinder, 8 bit cho đầu từ và 6 bit cho sector (sector đánh số từ 1), vì thế 1024 × 255 × 63 sector và rào cản 8,4 GB bạn đã thấy tính ra ở slide 24.</p>
<p>➕ Hệ quả cho phần mềm: vì số hiệu khối không còn cho HĐH biết đầu từ đang ở đâu, các thuật toán lập lịch cần đĩa ở slide 31–33 làm việc trên số hiệu khối như một phép xấp xỉ — và ổ đĩa hiện đại tự lập lịch bên trong (Native Command Queuing), còn SSD làm câu hỏi đó biến mất.</p>
<p class="meo">🧠 Hình học vật lý = đĩa thật sự thế nào; hình học ảo = điều nó khai với HĐH. LBA = "quên hình học đi, cứ đánh số các khối".</p>`],
      [26, 'RAID (1)',
        `<p class="y-chinh">🎯 Figure 5-20, RAID levels 0 through 3 (backup and parity drives shaded): (a) <strong>level 0</strong> — data striped over 4 drives, no redundancy; (b) <strong>level 1</strong> — every drive duplicated (4 + 4 copies); (c) <strong>level 2</strong> — bits spread over 7 drives with a Hamming code; (d) <strong>level 3</strong> — bits over 4 drives plus one parity drive.</p>
<p><strong>RAID</strong> = Redundant Array of Inexpensive (now: Independent) Disks — many small disks that the OS sees as one big, fast, reliable disk, as opposed to a SLED (Single Large Expensive Disk). <strong>Striping</strong> = distributing data over multiple drives: strip 0 on drive 0, strip 1 on drive 1… <strong>RAID 0</strong> works best with large requests (all drives work in parallel) and <strong>worst with an OS that habitually asks for data one sector at a time</strong> — the results are correct but there is no parallelism; its reliability is worse than one disk's, since losing any drive loses data. <strong>RAID 1</strong> duplicates every drive: writes go twice, reads can go to either copy (up to twice as fast), and a crashed drive is simply replaced by its copy. <strong>RAID 2</strong> works on words or bytes: e.g. 4 data bits + 3 Hamming bits written one bit per drive, correcting single-bit errors; drives must rotate in sync. <strong>RAID 3</strong> is a simpler version: a single parity bit per data word on a parity drive; since a dead drive's position is known, one parity bit is enough to correct it. Levels 2 and 3 give high transfer rates but only one request at a time, and are practically extinct.</p>
<p class="pitfall">⚠️ FE traps — and wrong keys in the question bank. "RAID level ____ works worst with operating systems that habitually ask for data one sector at a time": the book's sentence is about <strong>RAID level 0</strong>, but the bank keys FE2#34 and FE15#41 say 3 and FE8#38 says 2 — answer 0 and know why. "Striping without fault tolerance" = RAID 0 (FE10#37); "weakness of RAID 0" = no data recovery (FE3#33); "duplicates all disks, mirroring" = RAID 1 (FE11#40); "Hamming code, corrects single-bit errors" = RAID 2 (FE18#33); "striping" = distributing data over multiple drives (FE20#30, FE26#40).</p>`,
        `<p class="y-chinh">🎯 Hình 5-20, RAID mức 0 tới 3 (ổ sao lưu và ổ chẵn lẻ được tô xám): (a) <strong>mức 0</strong> — dữ liệu chia sọc trên 4 ổ, không dư thừa; (b) <strong>mức 1</strong> — mọi ổ được nhân đôi (4 + 4 bản); (c) <strong>mức 2</strong> — các bit rải trên 7 ổ kèm mã Hamming; (d) <strong>mức 3</strong> — các bit trên 4 ổ cộng một ổ chẵn lẻ.</p>
<p><strong>RAID</strong> = Redundant Array of Inexpensive (nay: Independent) Disks — mảng dư thừa các đĩa rẻ/độc lập: nhiều đĩa nhỏ mà HĐH thấy như một đĩa lớn, nhanh, tin cậy, đối lập với SLED (Single Large Expensive Disk — một đĩa to đắt tiền). <strong>Chia sọc (striping)</strong> = phân phối dữ liệu lên nhiều ổ: strip 0 trên ổ 0, strip 1 trên ổ 1… <strong>RAID 0</strong> chạy tốt nhất với yêu cầu lớn (mọi ổ làm song song) và <strong>tệ nhất với HĐH quen hỏi dữ liệu từng sector một</strong> — kết quả vẫn đúng nhưng không có song song; độ tin cậy còn kém hơn một đĩa, vì hỏng bất kỳ ổ nào là mất dữ liệu. <strong>RAID 1</strong> nhân đôi mọi ổ: ghi thì ghi hai lần, đọc thì đọc ở bản nào cũng được (nhanh tới gấp đôi), ổ hỏng thì chỉ việc dùng bản sao của nó. <strong>RAID 2</strong> làm việc theo từ hoặc byte: ví dụ 4 bit dữ liệu + 3 bit Hamming ghi mỗi bit lên một ổ, sửa được lỗi một bit; các ổ phải quay đồng bộ. <strong>RAID 3</strong> là bản đơn giản hơn: một bit chẵn lẻ duy nhất cho mỗi từ dữ liệu, ghi trên một ổ chẵn lẻ; vì vị trí ổ chết đã biết, một bit chẵn lẻ là đủ để sửa. Mức 2 và 3 cho tốc độ truyền cao nhưng mỗi lúc chỉ một yêu cầu, và gần như đã tuyệt chủng.</p>
<p class="pitfall">⚠️ Bẫy FE — và đáp án SAI trong ngân hàng. "RAID level ____ works worst with operating systems that habitually ask for data one sector at a time": câu này của sách nói về <strong>RAID mức 0</strong>, nhưng đáp án ngân hàng FE2#34 và FE15#41 ghi 3, FE8#38 ghi 2 — hãy chọn 0 và hiểu vì sao. "Chia sọc không chịu lỗi" = RAID 0 (FE10#37); "điểm yếu của RAID 0" = không có cơ chế khôi phục dữ liệu (FE3#33); "nhân đôi mọi đĩa, mirroring" = RAID 1 (FE11#40); "mã Hamming, sửa lỗi một bit" = RAID 2 (FE18#33); "striping" = phân phối dữ liệu lên nhiều ổ (FE20#30, FE26#40).</p>`],
      [27, 'RAID (2)',
        `<p class="y-chinh">🎯 Figure 5-20, RAID levels 4 through 6: (e) <strong>level 4</strong> — strips like level 0, plus a strip-for-strip <strong>parity</strong> drive (P0-3, P4-7, P8-11); (f) <strong>level 5</strong> — the parity strips are distributed round-robin over all drives; (g) <strong>level 6</strong> — like level 5 but with two independent parity blocks (P and P′) per stripe.</p>
<p>Levels 4 and 5 work with strips again, not individual words, and do not need synchronised drives. The parity strip is the XOR of the data strips in its row, so any ONE lost strip is the XOR of the survivors. The weak spot is the <strong>small write</strong>: changing one strip means reading the old data and the old parity, and writing the new data and the new parity (new parity = old parity ⊕ old data ⊕ new data) — four disk operations. In RAID 4 every write hits the single parity drive, a bottleneck; RAID 5 spreads that load. RAID 6 survives two failures at the cost of a second parity block — today's usual choice for big arrays, because rebuilding a multi-terabyte drive takes hours and a second failure during that time is not rare.</p>
<p>➕ Parity is just XOR — compute it, lose a whole drive, rebuild it, and do a small write with the shortcut formula:</p>
<pre><code class="language-c">// RAID 4/5 parity with XOR: compute it, lose a whole disk, rebuild it, update one strip cheaply
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

#define D 4                                 // data disks
#define S 8                                 // bytes per strip (tiny, to print)

static void in(const char *ten, const unsigned char *s) {
    printf("%-14s", ten);
    for (int i = 0; i &lt; S; i++) printf(" %02x", s[i]);
    int chu = 1;
    for (int i = 0; i &lt; S; i++) if (s[i] &lt; 32 || s[i] &gt; 126) chu = 0;
    if (chu) printf("   \\"%.*s\\"", S, (const char *)s);
    printf("\\n");
}

int main(void) {
    unsigned char dia[D][S], chan_le[S] = { 0 };
    const char *du_lieu = "Cuong-OSRAID-5!!disk=two12345678";
    for (int d = 0; d &lt; D; d++) memcpy(dia[d], du_lieu + d * S, S);
    for (int d = 0; d &lt; D; d++)
        for (int i = 0; i &lt; S; i++) chan_le[i] ^= dia[d][i];       // parity = d0 ^ d1 ^ d2 ^ d3
    for (int d = 0; d &lt; D; d++) { char t[16]; sprintf(t, "disk %d", d); in(t, dia[d]); }
    in("parity disk", chan_le);

    // disk 2 crashes: every byte on it is lost
    memset(dia[2], '?', S);
    in("disk 2 (dead)", dia[2]);
    unsigned char dung_lai[S];
    for (int i = 0; i &lt; S; i++) dung_lai[i] = chan_le[i] ^ dia[0][i] ^ dia[1][i] ^ dia[3][i];   // XOR of all survivors
    in("rebuilt 2", dung_lai);
    printf("rebuilt correctly: %s\\n", memcmp(dung_lai, du_lieu + 2 * S, S) == 0 ? "yes" : "no");
    memcpy(dia[2], dung_lai, S);

    // small write: change disk 1 only. New parity without reading disks 0, 2, 3:
    unsigned char moi[S]; memcpy(moi, "NEW-DATA", S);
    unsigned char p_moi[S];
    for (int i = 0; i &lt; S; i++) p_moi[i] = chan_le[i] ^ dia[1][i] ^ moi[i];   // P' = P ^ old ^ new
    memcpy(dia[1], moi, S);
    unsigned char p_tinh_lai[S] = { 0 };
    for (int d = 0; d &lt; D; d++) for (int i = 0; i &lt; S; i++) p_tinh_lai[i] ^= dia[d][i];
    printf("small write: 2 reads + 2 writes; shortcut parity equals full recomputation: %s\\n", memcmp(p_moi, p_tinh_lai, S) == 0 ? "yes" : "no");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chan-le.c -o chan-le &amp;&amp; ./chan-le<br>
disk 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;43 75 6f 6e 67 2d 4f 53 &nbsp;&nbsp;"Cuong-OS"<br>
disk 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;52 41 49 44 2d 35 21 21 &nbsp;&nbsp;"RAID-5!!"<br>
disk 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 69 73 6b 3d 74 77 6f &nbsp;&nbsp;"disk=two"<br>
disk 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31 32 33 34 35 36 37 38 &nbsp;&nbsp;"12345678"<br>
parity disk &nbsp;&nbsp;&nbsp;44 6f 66 75 42 5a 2e 25 &nbsp;&nbsp;"DofuBZ.%"<br>
disk 2 (dead) &nbsp;3f 3f 3f 3f 3f 3f 3f 3f &nbsp;&nbsp;"????????"<br>
rebuilt 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 69 73 6b 3d 74 77 6f &nbsp;&nbsp;"disk=two"<br>
rebuilt correctly: yes<br>
small write: 2 reads + 2 writes; shortcut parity equals full recomputation: yes</div>
<p>Drive 2 ("disk=two") came back byte for byte from the parity and the three survivors, and the shortcut parity of the small write matched a full recomputation. The trade-offs for six 4 TB drives:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1c943de985b33dff53706c2720fcc2d0c97fa074.svg" alt="Capacity, failures survived and small-write cost of the common RAID levels" loading="lazy" /><p class="chu-thich">🧮 Capacity, failures survived and small-write cost of the common RAID levels</p></div>
<table>
<thead><tr><th>Level</th><th>Usable</th><th>Disk failures survived</th><th>Disk operations for one small write</th></tr></thead>
<tbody>
<tr><td>RAID 0</td><td>24 TB</td><td>0</td><td>1</td></tr>
<tr><td>RAID 1</td><td>12 TB</td><td>1 (more if each lost disk is in a different pair)</td><td>2</td></tr>
<tr><td>RAID 4</td><td>20 TB</td><td>1</td><td>4 (2 reads + 2 writes)</td></tr>
<tr><td>RAID 5</td><td>20 TB</td><td>1</td><td>4 (2 reads + 2 writes)</td></tr>
<tr><td>RAID 6</td><td>16 TB</td><td>2</td><td>6 (3 reads + 3 writes)</td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const N = 6, TB = 4;
const MUC = [
  { ten: 'RAID 0', dung: N, chiu: 0, ghiNho: 1 },                 // striping only
  { ten: 'RAID 1', dung: N / 2, chiu: 1, ghiNho: 2 },             // every disk duplicated (at least 1, up to 1 per pair)
  { ten: 'RAID 4', dung: N - 1, chiu: 1, ghiNho: 4 },             // dedicated parity disk: read old data+parity, write both
  { ten: 'RAID 5', dung: N - 1, chiu: 1, ghiNho: 4 },             // parity spread round robin
  { ten: 'RAID 6', dung: N - 2, chiu: 2, ghiNho: 6 },             // two independent parity blocks
];</code></pre></details>
<p class="pitfall">⚠️ "RAID levels ____ work with strips again, not individual words with parity, and do not require synchronized drives" = 4 and 5 (FE5#35, FE6#42). "Strip-for-strip parity" is the book's description of <strong>RAID 4</strong> (and 5) — the bank key of FE18#22 says 3, which is wrong. "Word parity" (FE25#31) — the book's RAID 3 computes a parity bit per word, RAID 2 a Hamming code; the bank key says 2, so read that question carefully. "All RAID levels can survive one disk crash" is FALSE — RAID 0 cannot (FE25#41).</p>
<div class="callout">🧭 On a real server: Linux software RAID is <code>mdadm</code> (levels 0, 1, 4, 5, 6, 10); ZFS has RAID-Z1/Z2/Z3. RAID is not a backup — it survives a dead disk, not <code>DROP TABLE</code> or ransomware. A PostgreSQL server still needs real backups (Chapter 4's backup slides).</div>`,
        `<p class="y-chinh">🎯 Hình 5-20, RAID mức 4 tới 6: (e) <strong>mức 4</strong> — chia strip như mức 0, cộng một ổ <strong>chẵn lẻ (parity)</strong> theo từng strip (P0-3, P4-7, P8-11); (f) <strong>mức 5</strong> — các strip chẵn lẻ được rải vòng tròn lên mọi ổ; (g) <strong>mức 6</strong> — như mức 5 nhưng có hai khối chẵn lẻ độc lập (P và P′) cho mỗi sọc.</p>
<p>Mức 4 và 5 lại làm việc với strip, không theo từng từ, và không cần các ổ quay đồng bộ. Strip chẵn lẻ là XOR của các strip dữ liệu cùng hàng, nên MỘT strip bị mất bất kỳ chính là XOR của các strip còn sống. Điểm yếu là <strong>ghi nhỏ (small write)</strong>: đổi một strip nghĩa là đọc dữ liệu cũ và chẵn lẻ cũ, rồi ghi dữ liệu mới và chẵn lẻ mới (chẵn lẻ mới = chẵn lẻ cũ ⊕ dữ liệu cũ ⊕ dữ liệu mới) — bốn thao tác đĩa. Ở RAID 4 mọi lần ghi đều đụng vào ổ chẵn lẻ duy nhất, thành nút cổ chai; RAID 5 rải tải đó ra. RAID 6 chịu được hai ổ hỏng với cái giá là khối chẵn lẻ thứ hai — lựa chọn thường gặp cho mảng lớn ngày nay, vì dựng lại một ổ nhiều terabyte mất hàng giờ và hỏng thêm ổ thứ hai trong lúc đó không hiếm.</p>
<p>➕ Chẵn lẻ chỉ là XOR — tính nó, mất trọn một ổ, dựng lại ổ đó, và làm một lần ghi nhỏ bằng công thức tắt:</p>
<pre><code class="language-c">// Chẵn lẻ RAID 4/5 bằng XOR: tính nó, mất trọn một đĩa, dựng lại, cập nhật một strip với chi phí thấp
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

#define D 4                                 // số đĩa dữ liệu
#define S 8                                 // byte mỗi strip (nhỏ, để in ra)

static void in(const char *ten, const unsigned char *s) {
    printf("%-14s", ten);
    for (int i = 0; i &lt; S; i++) printf(" %02x", s[i]);
    int chu = 1;
    for (int i = 0; i &lt; S; i++) if (s[i] &lt; 32 || s[i] &gt; 126) chu = 0;
    if (chu) printf("   \\"%.*s\\"", S, (const char *)s);
    printf("\\n");
}

int main(void) {
    unsigned char dia[D][S], chan_le[S] = { 0 };
    const char *du_lieu = "Cuong-OSRAID-5!!disk=two12345678";
    for (int d = 0; d &lt; D; d++) memcpy(dia[d], du_lieu + d * S, S);
    for (int d = 0; d &lt; D; d++)
        for (int i = 0; i &lt; S; i++) chan_le[i] ^= dia[d][i];       // chẵn lẻ = d0 ^ d1 ^ d2 ^ d3
    for (int d = 0; d &lt; D; d++) { char t[16]; sprintf(t, "disk %d", d); in(t, dia[d]); }
    in("parity disk", chan_le);

    // đĩa 2 hỏng: mọi byte trên nó mất hết
    memset(dia[2], '?', S);
    in("disk 2 (dead)", dia[2]);
    unsigned char dung_lai[S];
    for (int i = 0; i &lt; S; i++) dung_lai[i] = chan_le[i] ^ dia[0][i] ^ dia[1][i] ^ dia[3][i];   // XOR mọi đĩa còn sống
    in("rebuilt 2", dung_lai);
    printf("rebuilt correctly: %s\\n", memcmp(dung_lai, du_lieu + 2 * S, S) == 0 ? "yes" : "no");
    memcpy(dia[2], dung_lai, S);

    // ghi nhỏ: chỉ đổi đĩa 1. Chẵn lẻ mới mà không đọc đĩa 0, 2, 3:
    unsigned char moi[S]; memcpy(moi, "NEW-DATA", S);
    unsigned char p_moi[S];
    for (int i = 0; i &lt; S; i++) p_moi[i] = chan_le[i] ^ dia[1][i] ^ moi[i];   // P' = P ^ cũ ^ mới
    memcpy(dia[1], moi, S);
    unsigned char p_tinh_lai[S] = { 0 };
    for (int d = 0; d &lt; D; d++) for (int i = 0; i &lt; S; i++) p_tinh_lai[i] ^= dia[d][i];
    printf("small write: 2 reads + 2 writes; shortcut parity equals full recomputation: %s\\n", memcmp(p_moi, p_tinh_lai, S) == 0 ? "yes" : "no");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread chan-le.c -o chan-le &amp;&amp; ./chan-le<br>
disk 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;43 75 6f 6e 67 2d 4f 53 &nbsp;&nbsp;"Cuong-OS"<br>
disk 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;52 41 49 44 2d 35 21 21 &nbsp;&nbsp;"RAID-5!!"<br>
disk 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 69 73 6b 3d 74 77 6f &nbsp;&nbsp;"disk=two"<br>
disk 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;31 32 33 34 35 36 37 38 &nbsp;&nbsp;"12345678"<br>
parity disk &nbsp;&nbsp;&nbsp;44 6f 66 75 42 5a 2e 25 &nbsp;&nbsp;"DofuBZ.%"<br>
disk 2 (dead) &nbsp;3f 3f 3f 3f 3f 3f 3f 3f &nbsp;&nbsp;"????????"<br>
rebuilt 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;64 69 73 6b 3d 74 77 6f &nbsp;&nbsp;"disk=two"<br>
rebuilt correctly: yes<br>
small write: 2 reads + 2 writes; shortcut parity equals full recomputation: yes</div>
<p>Ổ 2 ("disk=two") trở về đúng từng byte từ khối chẵn lẻ và ba ổ còn sống, và chẵn lẻ tính tắt của lần ghi nhỏ khớp với tính lại toàn bộ. Đánh đổi khi có sáu ổ 4 TB:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5a2780a4f049fc572441c61d955dd0c7eae5861d.svg" alt="Dung lượng, số ổ hỏng chịu được và chi phí ghi nhỏ của các mức RAID thường dùng" loading="lazy" /><p class="chu-thich">🧮 Dung lượng, số ổ hỏng chịu được và chi phí ghi nhỏ của các mức RAID thường dùng</p></div>
<table>
<thead><tr><th>Mức</th><th>Dùng được</th><th>Số đĩa hỏng chịu được</th><th>Số thao tác đĩa cho một lần ghi nhỏ</th></tr></thead>
<tbody>
<tr><td>RAID 0</td><td>24 TB</td><td>0</td><td>1</td></tr>
<tr><td>RAID 1</td><td>12 TB</td><td>1 (nhiều hơn nếu mỗi đĩa hỏng thuộc một cặp khác nhau)</td><td>2</td></tr>
<tr><td>RAID 4</td><td>20 TB</td><td>1</td><td>4 (2 đọc + 2 ghi)</td></tr>
<tr><td>RAID 5</td><td>20 TB</td><td>1</td><td>4 (2 đọc + 2 ghi)</td></tr>
<tr><td>RAID 6</td><td>16 TB</td><td>2</td><td>6 (3 đọc + 3 ghi)</td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const N = 6, TB = 4;
const MUC = [
  { ten: 'RAID 0', dung: N, chiu: 0, ghiNho: 1 },                 // chỉ chia sọc
  { ten: 'RAID 1', dung: N / 2, chiu: 1, ghiNho: 2 },             // nhân đôi mọi đĩa
  { ten: 'RAID 4', dung: N - 1, chiu: 1, ghiNho: 4 },             // đĩa chẵn lẻ riêng
  { ten: 'RAID 5', dung: N - 1, chiu: 1, ghiNho: 4 },             // chẵn lẻ rải vòng tròn
  { ten: 'RAID 6', dung: N - 2, chiu: 2, ghiNho: 6 },             // hai khối chẵn lẻ độc lập
];</code></pre></details>
<p class="pitfall">⚠️ "RAID levels ____ work with strips again, not individual words with parity, and do not require synchronized drives" = 4 và 5 (FE5#35, FE6#42). "Strip-for-strip parity" là cách sách tả <strong>RAID 4</strong> (và 5) — đáp án ngân hàng của FE18#22 ghi 3, là SAI. "Word parity" (FE25#31) — RAID 3 của sách tính một bit chẵn lẻ cho mỗi từ, RAID 2 dùng mã Hamming; đáp án ngân hàng ghi 2, nên đọc câu đó thật kỹ. "Mọi mức RAID đều chịu được một ổ hỏng" là SAI — RAID 0 không chịu được (FE25#41).</p>
<div class="callout">🧭 Trên server thật: RAID phần mềm của Linux là <code>mdadm</code> (mức 0, 1, 4, 5, 6, 10); ZFS có RAID-Z1/Z2/Z3. RAID không phải bản sao lưu — nó sống sót qua một ổ chết, không qua <code>DROP TABLE</code> hay mã độc tống tiền. Server PostgreSQL vẫn cần sao lưu thật (các slide sao lưu của Chương 4).</div>`],
      [28, 'Disk Formatting (1)',
        `<p class="y-chinh">🎯 Figure 5-21: a disk sector after low-level formatting = <strong>preamble</strong> + <strong>data</strong> + <strong>ECC</strong> (error-correcting code).</p>
<p>A new platter is a blank magnetic surface. <strong>Low-level formatting</strong> writes the tracks and, on each, the sectors with short gaps between them. The <strong>preamble</strong> starts with a bit pattern that lets the hardware recognise the start of a sector, and holds the cylinder and sector numbers; the <strong>data</strong> part is usually 512 bytes (4096 on Advanced Format drives); the <strong>ECC</strong> field holds redundant information used to detect and correct read errors (16 bytes was common in the book's time). Preambles, ECCs and gaps eat space: the book notes that the formatted capacity is about 20% lower than the unformatted one. After low-level formatting comes <strong>partitioning</strong> — sector 0 holds the <strong>Master Boot Record (MBR)</strong> with the boot code and the partition table — and finally the <strong>high-level format</strong> of each partition: the file system (boot block, free list, root directory, empty FS).</p>
<p>➕ Today: the MBR's partition table (4 entries, 32-bit sector numbers ⇒ 2 TiB limit with 512-byte sectors) has been replaced by <strong>GPT</strong> (GUID Partition Table) on UEFI machines, but sector 0 still holds a "protective MBR". The container's disk reported logical and physical sectors of 512 bytes on slide 24.</p>
<p class="pitfall">⚠️ "The format of a sector" = preamble, data and ECC (FE4#39, FE18#39) — not header/CRC, not "preamble and data". "Sector 0 of the disk is called the ____ and is used to boot the computer" = MBR (FE5#31, FE8#29, FE13#30).</p>`,
        `<p class="y-chinh">🎯 Hình 5-21: một sector sau khi định dạng mức thấp = <strong>phần mở đầu (preamble)</strong> + <strong>dữ liệu (data)</strong> + <strong>ECC</strong> (error-correcting code — mã sửa lỗi).</p>
<p>Một đĩa mới là bề mặt từ trống trơn. <strong>Định dạng mức thấp (low-level format)</strong> ghi các rãnh và, trên mỗi rãnh, các sector với khe hở ngắn giữa chúng. <strong>Preamble</strong> bắt đầu bằng một mẫu bit cho phần cứng nhận ra chỗ bắt đầu sector, và chứa số cylinder, số sector; phần <strong>dữ liệu</strong> thường 512 byte (4096 với ổ Advanced Format); trường <strong>ECC</strong> chứa thông tin dư dùng để phát hiện và sửa lỗi đọc (thời của sách thường là 16 byte). Preamble, ECC và khe hở ăn bớt chỗ: sách ghi dung lượng sau định dạng thấp hơn trước định dạng khoảng 20%. Sau định dạng mức thấp là <strong>phân vùng (partitioning)</strong> — sector 0 chứa <strong>Master Boot Record (MBR)</strong> gồm mã khởi động và bảng phân vùng — cuối cùng là <strong>định dạng mức cao</strong> cho từng phân vùng: hệ thống tệp (khối khởi động, danh sách khối trống, thư mục gốc, hệ thống tệp rỗng).</p>
<p>➕ Ngày nay: bảng phân vùng của MBR (4 mục, số sector 32 bit ⇒ giới hạn 2 TiB với sector 512 byte) đã được thay bằng <strong>GPT</strong> (GUID Partition Table) trên máy UEFI, nhưng sector 0 vẫn giữ một "MBR bảo vệ". Đĩa của container đã khai sector logic và vật lý đều 512 byte ở slide 24.</p>
<p class="pitfall">⚠️ "Định dạng của một sector" = preamble, data và ECC (FE4#39, FE18#39) — không phải header/CRC, không phải "preamble và data". "Sector 0 của đĩa gọi là ____ và dùng để khởi động máy" = MBR (FE5#31, FE8#29, FE13#30).</p>`],
      [29, 'Disk Formatting (2)',
        `<p class="y-chinh">🎯 Figure 5-22: <strong>cylinder skew</strong> — sector 0 of each track is offset from sector 0 of the previous track, so that after the head steps to the next track, sector 0 arrives just as the head is ready.</p>
<p>Reading many consecutive sectors means reading a whole track, then stepping to the next one. The step (track-to-track seek) takes time, during which the disk keeps turning. If sector 0 of the next track were aligned with sector 0 of this one, it would already have passed when the head arrives, costing almost a full revolution. The fix is to shift each track by the number of sectors that pass during one track-to-track seek. The book's example: 10,000 rpm ⇒ one revolution every 6 ms; 300 sectors per track ⇒ a new sector every 20 µs; track-to-track seek 800 µs ⇒ <strong>40 sectors</strong> pass ⇒ skew of 40 sectors.</p>
<p>➕ The same formula answers the FE versions — computed, not guessed:</p>
<pre><code class="language-javascript">// Cylinder skew (Figure 5-22): how many sectors pass under the head while the arm steps to the next track?
function skew(rpm, sectorsPerTrack, seekUs) {
  const turnUs = 60e6 / rpm;                       // time of one revolution
  const perSectorUs = turnUs / sectorsPerTrack;    // time for one sector to pass
  return { turnUs, perSectorUs, sectors: Math.ceil(seekUs / perSectorUs - 1e-9) };
}
for (const [ten, rpm, spt, seek] of [
  ['book example', 10000, 300, 800],
  ['FE25 q5 / FE28 q25', 3600, 200, 1000],
  ['FE26 q3', 5400, 200, 1000],
]) {
  const r = skew(rpm, spt, seek);
  console.log(&#96;&#36;{ten.padEnd(20)} &#36;{rpm} rpm, &#36;{spt} sectors, seek &#36;{seek} us: turn &#36;{(r.turnUs / 1000).toFixed(3)} ms, &#36;{r.perSectorUs.toFixed(2)} us per sector -&gt; skew &#36;{r.sectors} sectors&#96;);
}</code></pre>
<div class="out">$ node lech-tru.js<br>
book example &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 rpm, 300 sectors, seek 800 us: turn 6.000 ms, 20.00 us per sector -&gt; skew 40 sectors<br>
FE25 q5 / FE28 q25 &nbsp;&nbsp;3600 rpm, 200 sectors, seek 1000 us: turn 16.667 ms, 83.33 us per sector -&gt; skew 12 sectors<br>
FE26 q3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5400 rpm, 200 sectors, seek 1000 us: turn 11.111 ms, 55.56 us per sector -&gt; skew 18 sectors</div>
<p>Skew = ⌈seek time ÷ time per sector⌉, with time per sector = (60 / rpm) ÷ sectors per track. 3600 rpm and 200 sectors: 16.67 ms per turn, 83.3 µs per sector, 1 ms seek ⇒ 12 sectors. 5400 rpm: 11.11 ms, 55.6 µs ⇒ 18 sectors.</p>
<p class="pitfall">⚠️ FE25#5 and FE28#25 (3600 rpm, 200 sectors, 1 ms) = <strong>12 sectors</strong>; FE26#3 (5400 rpm) = <strong>18 sectors</strong>. The sector size (512 bytes) in those questions is a distractor — it does not enter the formula.</p>`,
        `<p class="y-chinh">🎯 Hình 5-22: <strong>độ lệch trụ (cylinder skew)</strong> — sector 0 của mỗi rãnh được dịch đi so với sector 0 của rãnh trước, để sau khi đầu từ bước sang rãnh kế, sector 0 tới đúng lúc đầu từ vừa sẵn sàng.</p>
<p>Đọc nhiều sector liên tiếp nghĩa là đọc hết một rãnh, rồi bước sang rãnh kế. Bước đó (seek giữa hai rãnh kề nhau) tốn thời gian, trong lúc đĩa vẫn quay. Nếu sector 0 của rãnh kế thẳng hàng với sector 0 của rãnh này thì khi đầu từ tới, nó đã trôi qua mất, tốn gần trọn một vòng quay. Cách sửa là dịch mỗi rãnh đi đúng số sector trôi qua trong một lần seek giữa hai rãnh. Ví dụ của sách: 10.000 vòng/phút ⇒ mỗi vòng 6 ms; 300 sector mỗi rãnh ⇒ cứ 20 µs có một sector mới; seek giữa hai rãnh 800 µs ⇒ <strong>40 sector</strong> trôi qua ⇒ lệch 40 sector.</p>
<p>➕ Cùng công thức đó trả lời các bản FE — tính ra, không đoán:</p>
<pre><code class="language-javascript">// Lệch trụ (Hình 5-22): bao nhiêu sector trôi qua dưới đầu từ trong lúc cần nhích sang rãnh kế?
function skew(rpm, sectorsPerTrack, seekUs) {
  const turnUs = 60e6 / rpm;                       // thời gian một vòng quay
  const perSectorUs = turnUs / sectorsPerTrack;    // thời gian một sector trôi qua
  return { turnUs, perSectorUs, sectors: Math.ceil(seekUs / perSectorUs - 1e-9) };
}
for (const [ten, rpm, spt, seek] of [
  ['book example', 10000, 300, 800],
  ['FE25 q5 / FE28 q25', 3600, 200, 1000],
  ['FE26 q3', 5400, 200, 1000],
]) {
  const r = skew(rpm, spt, seek);
  console.log(&#96;&#36;{ten.padEnd(20)} &#36;{rpm} rpm, &#36;{spt} sectors, seek &#36;{seek} us: turn &#36;{(r.turnUs / 1000).toFixed(3)} ms, &#36;{r.perSectorUs.toFixed(2)} us per sector -&gt; skew &#36;{r.sectors} sectors&#96;);
}</code></pre>
<div class="out">$ node lech-tru.js<br>
book example &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 rpm, 300 sectors, seek 800 us: turn 6.000 ms, 20.00 us per sector -&gt; skew 40 sectors<br>
FE25 q5 / FE28 q25 &nbsp;&nbsp;3600 rpm, 200 sectors, seek 1000 us: turn 16.667 ms, 83.33 us per sector -&gt; skew 12 sectors<br>
FE26 q3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5400 rpm, 200 sectors, seek 1000 us: turn 11.111 ms, 55.56 us per sector -&gt; skew 18 sectors</div>
<p>Độ lệch = ⌈thời gian seek ÷ thời gian một sector⌉, với thời gian một sector = (60 / số vòng mỗi phút) ÷ số sector mỗi rãnh. 3600 vòng/phút và 200 sector: 16,67 ms mỗi vòng, 83,3 µs mỗi sector, seek 1 ms ⇒ 12 sector. 5400 vòng/phút: 11,11 ms, 55,6 µs ⇒ 18 sector.</p>
<p class="pitfall">⚠️ FE25#5 và FE28#25 (3600 vòng/phút, 200 sector, 1 ms) = <strong>12 sector</strong>; FE26#3 (5400 vòng/phút) = <strong>18 sector</strong>. Cỡ sector (512 byte) trong các câu đó là thông tin gây nhiễu — nó không có trong công thức.</p>`],
      [30, 'Disk Formatting (3)',
        `<p class="y-chinh">🎯 Figure 5-23: (a) <strong>no interleaving</strong> — sectors numbered 0–7 consecutively around the track; (b) <strong>single interleaving</strong> — 0, 4, 1, 5, 2, 6, 3, 7 (one sector skipped between consecutive numbers); (c) <strong>double interleaving</strong> — 0, 3, 6, 1, 4, 7, 2, 5.</p>
<p>The problem being solved: after reading a sector into its buffer, an old controller needed time to copy that buffer to memory before it could read again. Meanwhile the next sector passed under the head, so reading consecutive sectors cost one full revolution each. Numbering the sectors with gaps gives the controller time to catch up. It was the OS (or the format program) that chose the interleave factor, matched to the controller's speed.</p>
<p>➕ The layouts and their effect, computed for a controller that needs one sector-time to copy each sector:</p>
<pre><code class="language-javascript">// Interleaving (Figure 5-23): sector numbers around the track, and the time to read a whole track
function layout(n, k) {                              // k = interleave factor (0 = none)
  const track = Array(n).fill(null);
  let pos = 0;
  for (let s = 0; s &lt; n; s++) {
    while (track[pos % n] !== null) pos++;
    track[pos % n] = s;
    pos += k + 1;
  }
  return track;
}
for (const k of [0, 1, 2]) console.log(&#96;interleave &#36;{k}: &#36;{layout(8, k).join(' ')}&#96;);
// The controller needs as long as 1 sector takes to pass to copy its buffer to memory. Read sectors 0..7 in order:
function turnsToRead(n, k, copySectors) {
  const track = layout(n, k);
  let t = 0;                                         // time measured in "sector slots"
  for (let s = 0; s &lt; n; s++) {
    const p = track.indexOf(s);
    while (t % n !== p) t++;                         // wait for sector s to come under the head
    t += 1 + copySectors;                            // read it, then the controller is busy copying
  }
  return (t - copySectors) / n;
}
for (const k of [0, 1, 2]) console.log(&#96;interleave &#36;{k}, copy takes 1 sector time: &#36;{turnsToRead(8, k, 1).toFixed(3)} revolutions to read all 8 sectors&#96;);</code></pre>
<div class="out">$ node xen-ke.js<br>
interleave 0: 0 1 2 3 4 5 6 7<br>
interleave 1: 0 4 1 5 2 6 3 7<br>
interleave 2: 0 3 6 1 4 7 2 5<br>
interleave 0, copy takes 1 sector time: 8.000 revolutions to read all 8 sectors<br>
interleave 1, copy takes 1 sector time: 2.000 revolutions to read all 8 sectors<br>
interleave 2, copy takes 1 sector time: 2.750 revolutions to read all 8 sectors</div>
<p>The program reproduces the figure's three numberings. Without interleaving, reading the 8 sectors in order takes 8 revolutions; single interleaving brings it down to 2; double interleaving is already too much here (2.75) — the gap must match the copy time. Today this whole slide is history: controllers have buffers big enough for a whole track (or cylinder) and DMA, so they read a track in one revolution with no interleaving.</p>
<p class="meo">🧠 Skew (slide 29) helps when moving <em>between</em> tracks; interleaving helps <em>within</em> a track when the controller is slow. Both trade layout for time.</p>`,
        `<p class="y-chinh">🎯 Hình 5-23: (a) <strong>không xen kẽ (no interleaving)</strong> — các sector đánh số 0–7 liên tiếp quanh rãnh; (b) <strong>xen kẽ đơn (single interleaving)</strong> — 0, 4, 1, 5, 2, 6, 3, 7 (bỏ qua một sector giữa hai số liên tiếp); (c) <strong>xen kẽ đôi (double interleaving)</strong> — 0, 3, 6, 1, 4, 7, 2, 5.</p>
<p>Bài toán cần giải: sau khi đọc một sector vào bộ đệm, bộ điều khiển đời cũ cần thời gian để chép bộ đệm đó sang bộ nhớ trước khi đọc tiếp được. Trong lúc đó sector kế tiếp trôi qua dưới đầu từ, nên đọc các sector liên tiếp tốn mỗi sector một vòng quay. Đánh số các sector có khe hở cho bộ điều khiển kịp theo. Chính HĐH (hoặc chương trình định dạng) chọn hệ số xen kẽ, cho khớp tốc độ của bộ điều khiển.</p>
<p>➕ Các cách đánh số và tác dụng của chúng, tính cho một bộ điều khiển cần đúng thời gian một sector để chép mỗi sector:</p>
<pre><code class="language-javascript">// Xen kẽ (Hình 5-23): số sector quanh rãnh, và thời gian đọc trọn một rãnh
function layout(n, k) {                              // k = hệ số xen kẽ (0 = không xen)
  const track = Array(n).fill(null);
  let pos = 0;
  for (let s = 0; s &lt; n; s++) {
    while (track[pos % n] !== null) pos++;
    track[pos % n] = s;
    pos += k + 1;
  }
  return track;
}
for (const k of [0, 1, 2]) console.log(&#96;interleave &#36;{k}: &#36;{layout(8, k).join(' ')}&#96;);
// Bộ điều khiển cần đúng thời gian một sector trôi qua để chép bộ đệm vào bộ nhớ. Đọc lần lượt sector 0..7:
function turnsToRead(n, k, copySectors) {
  const track = layout(n, k);
  let t = 0;                                         // thời gian đo bằng "ô sector"
  for (let s = 0; s &lt; n; s++) {
    const p = track.indexOf(s);
    while (t % n !== p) t++;                         // chờ sector s quay tới dưới đầu từ
    t += 1 + copySectors;                            // đọc nó, rồi bộ điều khiển bận chép
  }
  return (t - copySectors) / n;
}
for (const k of [0, 1, 2]) console.log(&#96;interleave &#36;{k}, copy takes 1 sector time: &#36;{turnsToRead(8, k, 1).toFixed(3)} revolutions to read all 8 sectors&#96;);</code></pre>
<div class="out">$ node xen-ke.js<br>
interleave 0: 0 1 2 3 4 5 6 7<br>
interleave 1: 0 4 1 5 2 6 3 7<br>
interleave 2: 0 3 6 1 4 7 2 5<br>
interleave 0, copy takes 1 sector time: 8.000 revolutions to read all 8 sectors<br>
interleave 1, copy takes 1 sector time: 2.000 revolutions to read all 8 sectors<br>
interleave 2, copy takes 1 sector time: 2.750 revolutions to read all 8 sectors</div>
<p>Chương trình dựng lại đúng ba cách đánh số của hình. Không xen kẽ thì đọc lần lượt 8 sector mất 8 vòng quay; xen kẽ đơn hạ xuống 2; xen kẽ đôi ở đây đã là quá tay (2,75) — khe hở phải vừa khớp thời gian chép. Ngày nay cả slide này là lịch sử: bộ điều khiển có bộ đệm đủ chứa cả rãnh (hoặc cả cylinder) cùng DMA, nên đọc một rãnh trong một vòng mà không cần xen kẽ.</p>
<p class="meo">🧠 Độ lệch trụ (slide 29) giúp khi đi <em>giữa</em> các rãnh; xen kẽ giúp <em>trong</em> một rãnh khi bộ điều khiển chậm. Cả hai đều đổi cách bố trí lấy thời gian.</p>`],
      [31, 'Disk Arm Scheduling Algorithms (1)',
        `<p class="y-chinh">🎯 Three factors decide the time to read or write a disk block: (1) <strong>seek time</strong> — moving the arm to the proper cylinder; (2) <strong>rotational delay</strong> — waiting for the proper sector to come under the head; (3) the <strong>actual data transfer time</strong>. For most disks the seek dominates, so reducing the mean seek time can improve performance substantially.</p>
<p>The OS (the disk driver) keeps a table of pending requests, indexed by cylinder. If requests are served in arrival order — <strong>FCFS</strong>, first-come first-served — the arm zig-zags across the disk. Since requests from many processes pile up, the driver can choose the order instead, and slides 32–33 show two classic choices. Typical numbers for a 7,200 rpm disk: average seek ≈ 9 ms, average rotational delay = half a turn = 4.17 ms, transfer of a 4 KB block ≈ 0.03 ms — the transfer is almost nothing (see the calculation in lesson 1.C, exercise 6).</p>
<p>➕ The data set used by the book and by several FE questions: the arm is at cylinder <strong>11</strong>, and requests arrive for cylinders <strong>1, 36, 16, 34, 9, 12</strong>. In arrival order:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/358e20f18a439667a7a9f534f9cc6cef7ca426b0.svg" alt="FCFS on the book's example: 111 cylinders" loading="lazy" /><p class="chu-thich">🧮 FCFS on the book's example: 111 cylinders</p></div>
<table>
<thead><tr><th>Step</th><th>Arm moves</th><th>Why</th><th>Cylinders</th></tr></thead>
<tbody>
<tr><td>1</td><td>11 → 1</td><td>serve</td><td>10</td></tr>
<tr><td>2</td><td>1 → 36</td><td>serve</td><td>35</td></tr>
<tr><td>3</td><td>36 → 16</td><td>serve</td><td>20</td></tr>
<tr><td>4</td><td>16 → 34</td><td>serve</td><td>18</td></tr>
<tr><td>5</td><td>34 → 9</td><td>serve</td><td>25</td></tr>
<tr><td>6</td><td>9 → 12</td><td>serve</td><td>3</td></tr>
<tr><td colspan="3"><strong>Total</strong></td><td><strong>111</strong> × 6 ms = <strong>666 ms</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p>10 + 35 + 20 + 18 + 25 + 3 = <strong>111 cylinders</strong> — the book's number for FCFS, and the key of FE10#40. With 6 ms per cylinder that would be 666 ms of pure arm movement.</p>
<p class="pitfall">⚠️ "Time to move the arm to the proper cylinder" = seek time — not rotational delay, not access time (FE1#7, FE2#35, FE4#40, FE11#41, FE12#39, FE26#37). "Fairest but may lead to high seek times" = FCFS (FE3#39, FE10#48). Recognising an algorithm from the head's path: 53, 98, 37, 14, 65, 67 for requests 98, 37, 14, 65, 67 is simply arrival order ⇒ FCFS (FE9#37, FE11#39).</p>`,
        `<p class="y-chinh">🎯 Ba yếu tố quyết định thời gian đọc/ghi một khối đĩa: (1) <strong>thời gian tìm (seek time)</strong> — dời cần tới đúng cylinder; (2) <strong>độ trễ quay (rotational delay)</strong> — chờ đúng sector quay tới dưới đầu từ; (3) <strong>thời gian truyền dữ liệu thật</strong>. Với phần lớn đĩa, thời gian tìm áp đảo, nên giảm thời gian tìm trung bình cải thiện hiệu năng đáng kể.</p>
<p>HĐH (driver đĩa) giữ một bảng các yêu cầu đang chờ, đánh chỉ số theo cylinder. Nếu phục vụ theo thứ tự đến — <strong>FCFS</strong>, đến trước phục vụ trước — cần đĩa chạy ngoằn ngoèo khắp mặt đĩa. Vì yêu cầu của nhiều tiến trình dồn lại, driver có thể tự chọn thứ tự, và slide 32–33 cho hai lựa chọn kinh điển. Số điển hình cho đĩa 7.200 vòng/phút: seek trung bình ≈ 9 ms, độ trễ quay trung bình = nửa vòng = 4,17 ms, truyền một khối 4 KB ≈ 0,03 ms — phần truyền gần như không đáng kể (xem phép tính ở bài 1.C, bài tập 6).</p>
<p>➕ Bộ dữ liệu sách và nhiều câu FE dùng: cần đang ở cylinder <strong>11</strong>, và các yêu cầu tới cho cylinder <strong>1, 36, 16, 34, 9, 12</strong>. Theo thứ tự đến:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/81300df5cc00bbf5b3e9336430588cdb58047258.svg" alt="FCFS trên ví dụ của sách: 111 cylinder" loading="lazy" /><p class="chu-thich">🧮 FCFS trên ví dụ của sách: 111 cylinder</p></div>
<table>
<thead><tr><th>Bước</th><th>Cần đi</th><th>Vì sao</th><th>Số cylinder</th></tr></thead>
<tbody>
<tr><td>1</td><td>11 → 1</td><td>phục vụ</td><td>10</td></tr>
<tr><td>2</td><td>1 → 36</td><td>phục vụ</td><td>35</td></tr>
<tr><td>3</td><td>36 → 16</td><td>phục vụ</td><td>20</td></tr>
<tr><td>4</td><td>16 → 34</td><td>phục vụ</td><td>18</td></tr>
<tr><td>5</td><td>34 → 9</td><td>phục vụ</td><td>25</td></tr>
<tr><td>6</td><td>9 → 12</td><td>phục vụ</td><td>3</td></tr>
<tr><td colspan="3"><strong>Tổng</strong></td><td><strong>111</strong> × 6 ms = <strong>666 ms</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p>10 + 35 + 20 + 18 + 25 + 3 = <strong>111 cylinder</strong> — đúng con số sách cho FCFS, và là đáp án FE10#40. Với 6 ms mỗi cylinder thì đó là 666 ms chỉ riêng cho việc dời cần.</p>
<p class="pitfall">⚠️ "Thời gian dời cần tới đúng cylinder" = seek time — không phải rotational delay, không phải access time (FE1#7, FE2#35, FE4#40, FE11#41, FE12#39, FE26#37). "Công bằng nhất nhưng có thể gây seek lâu" = FCFS (FE3#39, FE10#48). Nhận ra thuật toán từ đường đi của đầu từ: 53, 98, 37, 14, 65, 67 với các yêu cầu 98, 37, 14, 65, 67 chính là thứ tự đến ⇒ FCFS (FE9#37, FE11#39).</p>`],
      [32, 'Disk Arm Scheduling Algorithms (2)',
        `<p class="y-chinh">🎯 Figure 5-24: <strong>Shortest Seek First (SSF)</strong> — always serve the pending request closest to the current head position. From 11 the sequence of seeks is 12, 9, 16, 1, 34, 36.</p>
<p>SSF is greedy, like SJF for the CPU (Chapter 2): each step is the cheapest one available. On the example it cuts the movement almost in half. Its flaw is <strong>fairness</strong>: on a busy disk the arm tends to stay in the middle, where new requests keep arriving close to it, and requests at the far edges can wait indefinitely — <strong>starvation</strong>. (Other books call it SSTF, Shortest Seek Time First — same algorithm. When two requests are equally close, this course's simulator keeps moving in the current direction; the convention is stated because some answers depend on it.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a188feca48323a0adc88d13322e29b06ac09a509.svg" alt="SSF on the book's example: 61 cylinders = 366 ms at 6 ms per cylinder" loading="lazy" /><p class="chu-thich">🧮 SSF on the book's example: 61 cylinders = 366 ms at 6 ms per cylinder</p></div>
<table>
<thead><tr><th>Step</th><th>Arm moves</th><th>Why</th><th>Cylinders</th></tr></thead>
<tbody>
<tr><td>1</td><td>11 → 12</td><td>serve</td><td>1</td></tr>
<tr><td>2</td><td>12 → 9</td><td>serve</td><td>3</td></tr>
<tr><td>3</td><td>9 → 16</td><td>serve</td><td>7</td></tr>
<tr><td>4</td><td>16 → 1</td><td>serve</td><td>15</td></tr>
<tr><td>5</td><td>1 → 34</td><td>serve</td><td>33</td></tr>
<tr><td>6</td><td>34 → 36</td><td>serve</td><td>2</td></tr>
<tr><td colspan="3"><strong>Total</strong></td><td><strong>61</strong> × 6 ms = <strong>366 ms</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p>1 + 3 + 7 + 15 + 33 + 2 = <strong>61 cylinders</strong>, the book's number. The FE wraps it in time: "a seek takes 6 msec per cylinder" ⇒ 61 × 6 = <strong>366 ms</strong> (FE1#9, the latest SU26 exam; FE10#38). The distractors are traps: 666 ms is FCFS (111 × 6) and 360 ms is the elevator (60 × 6) — slide 33.</p>
<p>➕ The old web lesson 5.2's data (head at 53, 98 183 37 122 14 124 65 67) gives SSTF = 236, which the simulator reproduces; the 🧪 lesson 5.C has more practice.</p>
<p class="pitfall">⚠️ FE7#38 and FE9#41: SSF total = <strong>61</strong> (111 = FCFS, 60 = elevator, 108 is nothing). FE5#41 and FE9#36: SSF order from 53 over 98, 37, 14, 65, 67 = <strong>53, 65, 67, 37, 14, 98</strong> — at 67 the nearest is 37 (distance 30), not 98 (distance 31).</p>`,
        `<p class="y-chinh">🎯 Hình 5-24: <strong>Shortest Seek First (SSF)</strong> — dịch ngắn nhất trước: luôn phục vụ yêu cầu đang chờ GẦN vị trí đầu từ hiện tại nhất. Từ 11, chuỗi các lần dịch là 12, 9, 16, 1, 34, 36.</p>
<p>SSF là thuật toán tham lam, giống SJF cho CPU (Chương 2): mỗi bước chọn bước rẻ nhất đang có. Trên ví dụ, nó cắt quãng đường đi gần một nửa. Khuyết điểm là <strong>công bằng</strong>: với đĩa bận, cần đĩa có xu hướng quanh quẩn ở giữa, nơi yêu cầu mới cứ liên tục tới gần nó, và các yêu cầu ở mép xa có thể phải chờ vô hạn — <strong>chết đói (starvation)</strong>. (Sách khác gọi là SSTF, Shortest Seek Time First — cùng một thuật toán. Khi hai yêu cầu cách đều nhau, bộ mô phỏng của môn đi tiếp theo chiều đang đi; quy ước này được ghi rõ vì có đáp án phụ thuộc vào nó.)</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bb680e9a0e6d97091d38bc38defa55dd7e1f6f62.svg" alt="SSF trên ví dụ của sách: 61 cylinder = 366 ms với 6 ms mỗi cylinder" loading="lazy" /><p class="chu-thich">🧮 SSF trên ví dụ của sách: 61 cylinder = 366 ms với 6 ms mỗi cylinder</p></div>
<table>
<thead><tr><th>Bước</th><th>Cần đi</th><th>Vì sao</th><th>Số cylinder</th></tr></thead>
<tbody>
<tr><td>1</td><td>11 → 12</td><td>phục vụ</td><td>1</td></tr>
<tr><td>2</td><td>12 → 9</td><td>phục vụ</td><td>3</td></tr>
<tr><td>3</td><td>9 → 16</td><td>phục vụ</td><td>7</td></tr>
<tr><td>4</td><td>16 → 1</td><td>phục vụ</td><td>15</td></tr>
<tr><td>5</td><td>1 → 34</td><td>phục vụ</td><td>33</td></tr>
<tr><td>6</td><td>34 → 36</td><td>phục vụ</td><td>2</td></tr>
<tr><td colspan="3"><strong>Tổng</strong></td><td><strong>61</strong> × 6 ms = <strong>366 ms</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p>1 + 3 + 7 + 15 + 33 + 2 = <strong>61 cylinder</strong>, đúng con số của sách. FE bọc nó vào thời gian: "mỗi cylinder seek mất 6 ms" ⇒ 61 × 6 = <strong>366 ms</strong> (FE1#9, đề SU26 mới nhất; FE10#38). Các phương án nhiễu là bẫy: 666 ms là FCFS (111 × 6), 360 ms là thang máy (60 × 6) — slide 33.</p>
<p>➕ Dữ liệu của bài web cũ 5.2 (đầu từ ở 53, 98 183 37 122 14 124 65 67) cho SSTF = 236, bộ mô phỏng ra đúng số đó; bài 🧪 5.C có thêm bài luyện.</p>
<p class="pitfall">⚠️ FE7#38 và FE9#41: tổng của SSF = <strong>61</strong> (111 = FCFS, 60 = thang máy, 108 chẳng là gì). FE5#41 và FE9#36: thứ tự SSF từ 53 qua 98, 37, 14, 65, 67 = <strong>53, 65, 67, 37, 14, 98</strong> — ở 67, yêu cầu gần nhất là 37 (cách 30), không phải 98 (cách 31).</p>`],
      [33, 'Disk Arm Scheduling Algorithms (3)',
        `<p class="y-chinh">🎯 Figure 5-25: the <strong>elevator algorithm</strong> — keep moving in the same direction until there are no more outstanding requests in that direction, then switch direction. Starting at 11 and moving up: 12, 16, 34, 36, then down to 9, 1.</p>
<p>A lift in a tall building does the same: it does not turn around just because someone nearer pressed a button behind it. The driver keeps one bit — the current direction, UP or DOWN. The book's property: for any collection of requests, the upper bound on total motion is fixed at twice the number of cylinders, and no request starves — each one is served within two sweeps. On the example it moves <strong>60 cylinders</strong> — slightly better than SSF here, though usually a bit worse. The book also mentions a variant that always sweeps in the same direction and jumps back after the highest request (smaller variance in response time) — what other books call C-SCAN / C-LOOK.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e4aa95b0201360c54c7db847b4101d4ae788551a.svg" alt="The book's elevator on its own example: 60 cylinders" loading="lazy" /><p class="chu-thich">🧮 The book's elevator on its own example: 60 cylinders</p></div>
<table>
<thead><tr><th>Step</th><th>Arm moves</th><th>Why</th><th>Cylinders</th></tr></thead>
<tbody>
<tr><td>1</td><td>11 → 12</td><td>serve</td><td>1</td></tr>
<tr><td>2</td><td>12 → 16</td><td>serve</td><td>4</td></tr>
<tr><td>3</td><td>16 → 34</td><td>serve</td><td>18</td></tr>
<tr><td>4</td><td>34 → 36</td><td>serve</td><td>2</td></tr>
<tr><td>5</td><td>36 → 9</td><td>serve</td><td>27</td></tr>
<tr><td>6</td><td>9 → 1</td><td>serve</td><td>8</td></tr>
<tr><td colspan="3"><strong>Total</strong></td><td><strong>60</strong> × 6 ms = <strong>360 ms</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p>➕ A naming trap: the book's elevator reverses at the last request — other textbooks call that <strong>LOOK</strong>; their <strong>SCAN</strong> runs to the edge of the disk before reversing, and <strong>C-SCAN</strong> / <strong>C-LOOK</strong> serve only one direction and jump back. All six on the old web lesson 5.2's data (head 53, moving up, cylinders 0–199) — the simulator reproduces every number of that lesson:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/58a04baee2f473c10053739f3c699805043ce491.svg" alt="Six algorithms on one data set" loading="lazy" /><p class="chu-thich">🧮 Six algorithms on one data set</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p class="pitfall">⚠️ FE22#26 / FE28#1: requests 10, 22, 20, 2, 40, 6, 38, head at 20, elevator ⇒ 20 (served at once), 22, 38, 40, then 10, 6, 2 = <strong>58</strong> (if you start downward you get 56, not an option — the exam assumes "up" first, like the book). FE26#26: head at 37 ⇒ <strong>37 38 40 22 20 10 6 2</strong>. FE6#41: the path 53, 65, 67, 98, 37, 14 is the elevator. ALWAYS write the starting direction in a written answer.</p>
<div class="callout">🧭 On a real server: <code>cat /sys/block/vda/queue/scheduler</code> printed <code>none [mq-deadline] kyber</code> on slide 24 — Linux's multi-queue block layer (since version 5.0, 2019) no longer has a pure elevator; mq-deadline sorts requests but gives each a deadline, and NVMe SSDs usually run <code>none</code>, because without an arm there is nothing to optimise.</div>`,
        `<p class="y-chinh">🎯 Hình 5-25: <strong>thuật toán thang máy (elevator)</strong> — cứ đi theo một chiều cho tới khi chiều đó hết yêu cầu đang chờ, rồi đổi chiều. Xuất phát ở 11 và đang đi lên: 12, 16, 34, 36, rồi đi xuống 9, 1.</p>
<p>Thang máy trong toà nhà cao tầng làm y như vậy: nó không quay đầu chỉ vì có người ở gần hơn bấm nút phía sau. Driver giữ một bit — chiều hiện tại, LÊN hay XUỐNG. Tính chất sách nêu: với bất kỳ tập yêu cầu nào, cận trên của tổng quãng đường cố định ở mức gấp đôi số cylinder, và không yêu cầu nào chết đói — yêu cầu nào cũng được phục vụ trong vòng hai lượt quét. Trên ví dụ, nó đi <strong>60 cylinder</strong> — ở đây nhỉnh hơn SSF một chút, dù thường thì kém hơn chút ít. Sách còn nhắc một biến thể luôn quét theo một chiều và nhảy về sau yêu cầu cao nhất (thời gian đáp ứng ít dao động hơn) — sách khác gọi là C-SCAN / C-LOOK.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1c86705d50f52fa5771554290f3df0327e2ea88e.svg" alt="Thang máy của sách trên chính ví dụ của sách: 60 cylinder" loading="lazy" /><p class="chu-thich">🧮 Thang máy của sách trên chính ví dụ của sách: 60 cylinder</p></div>
<table>
<thead><tr><th>Bước</th><th>Cần đi</th><th>Vì sao</th><th>Số cylinder</th></tr></thead>
<tbody>
<tr><td>1</td><td>11 → 12</td><td>phục vụ</td><td>1</td></tr>
<tr><td>2</td><td>12 → 16</td><td>phục vụ</td><td>4</td></tr>
<tr><td>3</td><td>16 → 34</td><td>phục vụ</td><td>18</td></tr>
<tr><td>4</td><td>34 → 36</td><td>phục vụ</td><td>2</td></tr>
<tr><td>5</td><td>36 → 9</td><td>phục vụ</td><td>27</td></tr>
<tr><td>6</td><td>9 → 1</td><td>phục vụ</td><td>8</td></tr>
<tr><td colspan="3"><strong>Tổng</strong></td><td><strong>60</strong> × 6 ms = <strong>360 ms</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p>➕ Bẫy về tên gọi: thang máy của sách quay đầu ở yêu cầu cuối cùng — sách khác gọi cái đó là <strong>LOOK</strong>; <strong>SCAN</strong> của họ chạy tới tận mép đĩa rồi mới quay đầu, còn <strong>C-SCAN</strong> / <strong>C-LOOK</strong> chỉ phục vụ một chiều và nhảy về. Cả sáu trên dữ liệu của bài web cũ 5.2 (đầu từ ở 53, đang đi lên, cylinder 0–199) — bộ mô phỏng ra đúng mọi con số của bài đó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4189ccf7a814076fdfc3eebfbc883c667ee23619.svg" alt="Sáu thuật toán trên cùng một bộ dữ liệu" loading="lazy" /><p class="chu-thich">🧮 Sáu thuật toán trên cùng một bộ dữ liệu</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<p class="pitfall">⚠️ FE22#26 / FE28#1: yêu cầu 10, 22, 20, 2, 40, 6, 38, đầu từ ở 20, thang máy ⇒ 20 (phục vụ ngay), 22, 38, 40, rồi 10, 6, 2 = <strong>58</strong> (nếu bắt đầu đi xuống sẽ ra 56, không có trong phương án — đề ngầm định đi "lên" trước, như sách). FE26#26: đầu từ ở 37 ⇒ <strong>37 38 40 22 20 10 6 2</strong>. FE6#41: đường đi 53, 65, 67, 98, 37, 14 là thang máy. Bài tự luận thì LUÔN ghi chiều xuất phát.</p>
<div class="callout">🧭 Trên server thật: <code>cat /sys/block/vda/queue/scheduler</code> in ra <code>none [mq-deadline] kyber</code> ở slide 24 — tầng khối đa hàng đợi của Linux (từ bản 5.0, 2019) không còn thang máy thuần tuý; mq-deadline sắp xếp yêu cầu nhưng đặt hạn chót cho thời gian chờ, còn SSD NVMe thường chạy <code>none</code>, vì không có cần đĩa thì chẳng có gì để tối ưu.</div>`],
      [34, 'Error Handling',
        `<p class="y-chinh">🎯 Figure 5-26: (a) a track with a <strong>bad sector</strong> (sector 7); (b) substituting one of the <strong>spare sectors</strong> for it; (c) shifting all the sectors by one to bypass the bad one.</p>
<p>Manufacturing defects are unavoidable on dense media. When a disk is tested, bad sectors are found and remapped: the controller keeps a list of bad sectors and spares, and either redirects requests for sector 7 to a spare (b) — simple, but reading the track in order now needs an extra rotation — or renumbers all following sectors (c), which keeps the order but means rewriting the preambles. Errors that develop later are handled the same way, by the controller or by the OS. Other error types: <strong>seek errors</strong> (the arm lands on the wrong cylinder) are corrected by recalibrating — moving the arm as far out as it goes and resetting its position to 0. Transient read errors are retried; if the ECC cannot correct the data, the error goes up to the OS (slide 10's "handle errors close to the hardware").</p>
<p>➕ Today the remapping is invisible: drives monitor themselves with <strong>S.M.A.R.T.</strong> (the "Reallocated Sectors Count" attribute counts exactly figure (b)), readable with <code>smartctl -a</code>; a rising count is the classic warning to replace a disk before it dies. SSDs do the same for worn-out flash blocks.</p>
<p class="meo">🧠 (b) spare = "send the bad sector's work to a substitute"; (c) shift = "everyone moves one seat". The OS above sees neither.</p>`,
        `<p class="y-chinh">🎯 Hình 5-26: (a) một rãnh có <strong>sector hỏng (bad sector)</strong> (sector 7); (b) thay nó bằng một trong các <strong>sector dự phòng (spare)</strong>; (c) dịch mọi sector đi một chỗ để vòng qua sector hỏng.</p>
<p>Lỗi chế tạo là không tránh được với vật liệu ghi mật độ cao. Khi kiểm đĩa, các sector hỏng được tìm ra và ánh xạ lại: bộ điều khiển giữ một danh sách sector hỏng và sector dự phòng, rồi hoặc chuyển yêu cầu cho sector 7 sang một sector dự phòng (b) — đơn giản, nhưng đọc rãnh theo thứ tự giờ tốn thêm một vòng quay — hoặc đánh số lại mọi sector phía sau (c), giữ được thứ tự nhưng phải ghi lại các preamble. Lỗi phát sinh về sau cũng được xử lý như vậy, do bộ điều khiển hoặc HĐH làm. Các kiểu lỗi khác: <strong>lỗi tìm (seek error)</strong> (cần đáp nhầm cylinder) được sửa bằng cách hiệu chuẩn lại — đưa cần ra xa hết mức rồi đặt lại vị trí về 0. Lỗi đọc thoáng qua thì đọc lại; nếu ECC không sửa được dữ liệu thì lỗi được báo lên HĐH ("xử lý lỗi gần phần cứng" của slide 10).</p>
<p>➕ Ngày nay việc ánh xạ lại là vô hình: ổ đĩa tự theo dõi mình bằng <strong>S.M.A.R.T.</strong> (thuộc tính "Reallocated Sectors Count" đếm đúng trường hợp (b)), đọc được bằng <code>smartctl -a</code>; con số này tăng dần là lời cảnh báo kinh điển để thay đĩa trước khi nó chết. SSD làm y vậy với các khối flash đã mòn.</p>
<p class="meo">🧠 (b) dự phòng = "giao việc của sector hỏng cho người thay thế"; (c) dịch = "cả hàng lùi một ghế". HĐH ở trên không thấy cả hai.</p>`],
      [35, 'Stable Storage (1)',
        `<p class="y-chinh">🎯 <strong>Stable storage</strong> uses a pair of identical disks; either can be read to get the same results. Three operations accomplish this: <strong>stable writes</strong>, <strong>stable reads</strong>, and <strong>crash recovery</strong>.</p>
<p>Some applications need that data, once written, are never lost or half written — even if the power fails in the middle of a write. RAID handles a dead disk, not a write cut in half. The book's design: a <strong>stable write</strong> writes the block on drive 1, reads it back to verify (retrying, then using a spare block, until it succeeds), and only THEN does the same on drive 2. A <strong>stable read</strong> reads drive 1; if the ECC reports an error it retries, and if it keeps failing reads drive 2 — the chance of both copies of a block going bad at once is negligible. <strong>Crash recovery</strong>, after a crash, scans both disks and compares corresponding blocks: if both are good and equal, nothing; if one has an ECC error, the good copy overwrites it; if both are good but different, drive 1's block is copied to drive 2.</p>
<p>➕ The order "drive 1 completely, then drive 2" is the whole trick — the next slide shows why every crash point is then recoverable. It also assumes a write fails detectably (bad ECC), not silently; that assumption is still how databases think about storage.</p>
<p class="pitfall">⚠️ "Writing and verifying a block on both drives until it is successfully written and verified" = <strong>stable write</strong> (FE6#39, FE8#39, FE9#42) — not stable read, not crash recovery.</p>`,
        `<p class="y-chinh">🎯 <strong>Lưu trữ ổn định (stable storage)</strong> dùng một cặp đĩa giống hệt nhau; đọc đĩa nào cũng ra cùng một kết quả. Ba thao tác để làm được điều đó: <strong>ghi ổn định (stable write)</strong>, <strong>đọc ổn định (stable read)</strong>, và <strong>khôi phục sau sự cố (crash recovery)</strong>.</p>
<p>Có những ứng dụng cần dữ liệu đã ghi thì không bao giờ mất hay bị ghi dở — kể cả khi mất điện giữa lúc đang ghi. RAID lo được một đĩa chết, chứ không lo được một lần ghi bị cắt đôi. Thiết kế của sách: <strong>ghi ổn định</strong> ghi khối lên ổ 1, đọc lại để kiểm (thử lại, rồi dùng khối dự phòng, cho tới khi thành công), và CHỈ SAU ĐÓ mới làm y như vậy trên ổ 2. <strong>Đọc ổn định</strong> đọc ổ 1; nếu ECC báo lỗi thì đọc lại, mãi vẫn hỏng thì đọc ổ 2 — xác suất cả hai bản của một khối cùng hỏng một lúc là không đáng kể. <strong>Khôi phục sau sự cố</strong>, sau khi sập, quét cả hai đĩa và so từng cặp khối: cả hai tốt và giống nhau thì thôi; một bản lỗi ECC thì bản tốt chép đè lên; cả hai tốt mà khác nhau thì khối của ổ 1 được chép sang ổ 2.</p>
<p>➕ Thứ tự "xong hẳn ổ 1, rồi mới tới ổ 2" là toàn bộ mánh — slide sau cho thấy vì sao khi đó điểm sập nào cũng khôi phục được. Nó còn giả định một lần ghi hỏng thì hỏng có dấu vết (ECC sai), chứ không âm thầm; giả định đó vẫn là cách cơ sở dữ liệu suy nghĩ về lưu trữ.</p>
<p class="pitfall">⚠️ "Ghi và kiểm một khối trên cả hai ổ cho tới khi ghi và kiểm thành công" = <strong>stable write</strong> (FE6#39, FE8#39, FE9#42) — không phải stable read, không phải crash recovery.</p>`],
      [36, 'Stable Storage (2)',
        `<p class="y-chinh">🎯 Figure 5-27: the influence of a crash on a stable write — (a) crash before drive 1 is written: both old; (b) crash during the write of drive 1: drive 1 has an ECC error, drive 2 old; (c) crash after drive 1, before drive 2: new / old; (d) crash during drive 2: new / ECC error; (e) crash after both: new / new.</p>
<p>Recovery handles all five: (a) nothing to do — the write simply did not happen; (b) the bad block on drive 1 is replaced by drive 2's old copy — the write did not happen; (c) the blocks differ, drive 1 wins — the write happened; (d) drive 2's bad block is replaced by drive 1's new copy — the write happened; (e) nothing to do. In every case the result is either completely old or completely new, never a mixture: the write is <strong>atomic</strong>.</p>
<p>➕ The five cases simulated — the crash is injected at each moment, then recovery runs:</p>
<pre><code class="language-c">// Stable storage (Figures 5-27): two disks, stable write, crash at five moments, then crash recovery
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char data[8]; int ecc; } Khoi;     // one block + its error-correcting code
static int tinh_ecc(const char *d) { int s = 7; for (int i = 0; i &lt; 8; i++) s = s * 31 + d[i]; return s; }
static int tot(const Khoi *k) { return k-&gt;ecc == tinh_ecc(k-&gt;data); }
static void ghi(Khoi *k, const char *d) { memcpy(k-&gt;data, d, 8); k-&gt;ecc = tinh_ecc(d); }
static void ghi_do_dang(Khoi *k, const char *d) { memcpy(k-&gt;data, d, 4); }   // power fails mid-write: ECC no longer matches

// crash recovery: scan both disks and repair (the "recovery" operation of slide 35)
static void khoi_phuc(Khoi *d1, Khoi *d2) {
    if (tot(d1) &amp;&amp; !tot(d2)) *d2 = *d1;                       // bad copy replaced by the good one
    else if (!tot(d1) &amp;&amp; tot(d2)) *d1 = *d2;
    else if (tot(d1) &amp;&amp; tot(d2) &amp;&amp; memcmp(d1-&gt;data, d2-&gt;data, 8)) *d2 = *d1;   // both fine but different: disk 1 wins
}
static const char *mo_ta(const Khoi *k) { return !tot(k) ? "ECC error" : strncmp(k-&gt;data, "NEWVALUE", 8) == 0 ? "new" : "old"; }

int main(void) {
    const char *ten[] = { "(a) crash before writing disk 1", "(b) crash while writing disk 1", "(c) crash between the two writes",
                          "(d) crash while writing disk 2", "(e) crash after both writes" };
    printf("%-34s %-11s %-11s -&gt; after recovery\\n", "stable write of NEWVALUE", "disk 1", "disk 2");
    for (int c = 0; c &lt; 5; c++) {
        Khoi d1, d2;
        ghi(&amp;d1, "OLDVALUE"); ghi(&amp;d2, "OLDVALUE");
        // stable write = write disk 1 (and verify) THEN write disk 2 (and verify); the crash cuts it at moment c
        if (c == 1) ghi_do_dang(&amp;d1, "NEWVALUE");
        if (c &gt;= 2) ghi(&amp;d1, "NEWVALUE");
        if (c == 3) ghi_do_dang(&amp;d2, "NEWVALUE");
        if (c == 4) ghi(&amp;d2, "NEWVALUE");
        printf("%-34s %-11s %-11s", ten[c], mo_ta(&amp;d1), mo_ta(&amp;d2));
        khoi_phuc(&amp;d1, &amp;d2);
        printf(" -&gt; %s / %s\\n", mo_ta(&amp;d1), mo_ta(&amp;d2));
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread on-dinh.c -o on-dinh &amp;&amp; ./on-dinh<br>
stable write of NEWVALUE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; after recovery<br>
(a) crash before writing disk 1 &nbsp;&nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; old / old<br>
(b) crash while writing disk 1 &nbsp;&nbsp;&nbsp;&nbsp;ECC error &nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; old / old<br>
(c) crash between the two writes &nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; new / new<br>
(d) crash while writing disk 2 &nbsp;&nbsp;&nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ECC error &nbsp;&nbsp;-&gt; new / new<br>
(e) crash after both writes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; new / new</div>
<p>Exactly the figure's table, and after recovery the two disks always agree, on "old" for (a)–(b) and "new" for (c)–(e).</p>
<div class="callout">🧭 On a real server: the same "write a complete copy first, then the real thing, and let recovery pick a whole version" is how PostgreSQL survives a power cut — the write-ahead log (WAL) is written and <code>fsync</code>ed before the data pages, and <code>full_page_writes</code> stores a whole page image so a torn 8 KB page can be repaired. MySQL InnoDB's "doublewrite buffer" is literally Figure 5-27.</div>`,
        `<p class="y-chinh">🎯 Hình 5-27: ảnh hưởng của một lần sập lên ghi ổn định — (a) sập trước khi ghi ổ 1: cả hai cũ; (b) sập trong lúc ghi ổ 1: ổ 1 lỗi ECC, ổ 2 cũ; (c) sập sau ổ 1, trước ổ 2: mới / cũ; (d) sập trong lúc ghi ổ 2: mới / lỗi ECC; (e) sập sau cả hai: mới / mới.</p>
<p>Khôi phục xử lý được cả năm: (a) không phải làm gì — lần ghi coi như chưa xảy ra; (b) khối hỏng trên ổ 1 được thay bằng bản cũ của ổ 2 — lần ghi chưa xảy ra; (c) hai khối khác nhau, ổ 1 thắng — lần ghi đã xảy ra; (d) khối hỏng của ổ 2 được thay bằng bản mới của ổ 1 — lần ghi đã xảy ra; (e) không phải làm gì. Trường hợp nào kết quả cũng hoặc cũ trọn vẹn hoặc mới trọn vẹn, không bao giờ lẫn lộn: lần ghi là <strong>nguyên tử (atomic)</strong>.</p>
<p>➕ Năm trường hợp được mô phỏng — cho sập đúng ở từng thời điểm, rồi chạy khôi phục:</p>
<pre><code class="language-c">// Lưu trữ ổn định (Hình 5-27): hai đĩa, ghi ổn định, sập ở năm thời điểm, rồi khôi phục sau sự cố
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char data[8]; int ecc; } Khoi;     // một khối + mã sửa lỗi của nó
static int tinh_ecc(const char *d) { int s = 7; for (int i = 0; i &lt; 8; i++) s = s * 31 + d[i]; return s; }
static int tot(const Khoi *k) { return k-&gt;ecc == tinh_ecc(k-&gt;data); }
static void ghi(Khoi *k, const char *d) { memcpy(k-&gt;data, d, 8); k-&gt;ecc = tinh_ecc(d); }
static void ghi_do_dang(Khoi *k, const char *d) { memcpy(k-&gt;data, d, 4); }   // mất điện giữa chừng: ECC không còn khớp

// khôi phục: quét hai đĩa và sửa (thao tác "crash recovery" của slide 35)
static void khoi_phuc(Khoi *d1, Khoi *d2) {
    if (tot(d1) &amp;&amp; !tot(d2)) *d2 = *d1;                       // bản hỏng được thay bằng bản tốt
    else if (!tot(d1) &amp;&amp; tot(d2)) *d1 = *d2;
    else if (tot(d1) &amp;&amp; tot(d2) &amp;&amp; memcmp(d1-&gt;data, d2-&gt;data, 8)) *d2 = *d1;   // cả hai tốt nhưng khác nhau: đĩa 1 thắng
}
static const char *mo_ta(const Khoi *k) { return !tot(k) ? "ECC error" : strncmp(k-&gt;data, "NEWVALUE", 8) == 0 ? "new" : "old"; }

int main(void) {
    const char *ten[] = { "(a) crash before writing disk 1", "(b) crash while writing disk 1", "(c) crash between the two writes",
                          "(d) crash while writing disk 2", "(e) crash after both writes" };
    printf("%-34s %-11s %-11s -&gt; after recovery\\n", "stable write of NEWVALUE", "disk 1", "disk 2");
    for (int c = 0; c &lt; 5; c++) {
        Khoi d1, d2;
        ghi(&amp;d1, "OLDVALUE"); ghi(&amp;d2, "OLDVALUE");
        // ghi ổn định = ghi đĩa 1 (và kiểm) RỒI ghi đĩa 2 (và kiểm); sự cố cắt ngang ở thời điểm c
        if (c == 1) ghi_do_dang(&amp;d1, "NEWVALUE");
        if (c &gt;= 2) ghi(&amp;d1, "NEWVALUE");
        if (c == 3) ghi_do_dang(&amp;d2, "NEWVALUE");
        if (c == 4) ghi(&amp;d2, "NEWVALUE");
        printf("%-34s %-11s %-11s", ten[c], mo_ta(&amp;d1), mo_ta(&amp;d2));
        khoi_phuc(&amp;d1, &amp;d2);
        printf(" -&gt; %s / %s\\n", mo_ta(&amp;d1), mo_ta(&amp;d2));
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread on-dinh.c -o on-dinh &amp;&amp; ./on-dinh<br>
stable write of NEWVALUE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; after recovery<br>
(a) crash before writing disk 1 &nbsp;&nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; old / old<br>
(b) crash while writing disk 1 &nbsp;&nbsp;&nbsp;&nbsp;ECC error &nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; old / old<br>
(c) crash between the two writes &nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;old &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; new / new<br>
(d) crash while writing disk 2 &nbsp;&nbsp;&nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ECC error &nbsp;&nbsp;-&gt; new / new<br>
(e) crash after both writes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; new / new</div>
<p>Đúng bảng của hình, và sau khôi phục hai đĩa luôn khớp nhau, là "cũ" với (a)–(b) và "mới" với (c)–(e).</p>
<div class="callout">🧭 Trên server thật: chính kiểu "ghi một bản trọn vẹn trước, rồi mới ghi bản thật, và để khôi phục chọn nguyên một phiên bản" là cách PostgreSQL sống sót khi mất điện — nhật ký ghi trước (WAL) được ghi và <code>fsync</code> trước các trang dữ liệu, còn <code>full_page_writes</code> lưu nguyên ảnh một trang để sửa được trang 8 KB bị ghi dở. "Doublewrite buffer" của MySQL InnoDB đúng nghĩa đen là Hình 5-27.</div>`],
      [37, 'Clock Hardware',
        `<p class="y-chinh">🎯 Figure 5-28: a <strong>programmable clock</strong> — a crystal oscillator sends pulses to a <strong>counter</strong> that is decremented at each pulse; when it reaches zero it causes an interrupt; the <strong>holding register</strong> is used to load the counter again.</p>
<p>Clocks (timers) are neither block nor character devices, but every OS needs them. The simple kind is tied to the power line and interrupts at 50 or 60 Hz. The programmable kind has modes: in <strong>one-shot mode</strong> the counter is loaded once from the holding register, counts down to zero, interrupts and stops; in <strong>square-wave mode</strong> it reloads itself automatically after each interrupt, producing periodic interrupts called <strong>clock ticks</strong>. The interval is chosen by software: interval = holding register value × pulse period. The book's numbers: a 500-MHz crystal pulses every 2 ns; with 32-bit registers interrupts can be programmed anywhere from 2 ns to 8.6 s apart. A separate battery-powered <strong>real-time clock</strong> keeps the date while the computer is off — the PL031 chip whose register you read on slide 4.</p>
<p>➕ The arithmetic, including the two FE questions:</p>
<pre><code class="language-javascript">// The programmable clock (Figure 5-28) and the counters of Figure 5-29, computed
const crystalHz = 500e6;                                          // 500-MHz crystal: one pulse every 2 ns
console.log(&#96;pulse period: &#36;{1e9 / crystalHz} ns&#96;);
console.log(&#96;32-bit holding register: interrupts every 2 ns ... &#36;{(2 ** 32 / crystalHz).toFixed(2)} s&#96;);
for (const [ten, tickS] of [['tick of 10 ms (FE25 q19)', 0.01], ['tick of 100 us (FE26 q16)', 100e-6], ['tick of 1 ms (HZ=1000)', 0.001]])
  console.log(&#96;&#36;{ten.padEnd(26)} -&gt; load &#36;{(crystalHz * tickS).toLocaleString('en-US')} into the holding register&#96;);
// Figure 5-29: how long until a tick counter overflows?
const nam = 365.25 * 86400;
console.log(&#96;32-bit counter at 60 Hz overflows after &#36;{(2 ** 32 / 60 / nam).toFixed(2)} years&#96;);
console.log(&#96;32-bit counter of seconds overflows after &#36;{(2 ** 32 / nam).toFixed(1)} years (unsigned) / &#36;{(2 ** 31 / nam).toFixed(1)} years (signed)&#96;);
console.log(&#96;64-bit counter at 1000 Hz overflows after &#36;{(2 ** 64 / 1000 / nam / 1e6).toFixed(0)} million years&#96;);</code></pre>
<div class="out">$ node dong-ho-lap-trinh.js<br>
pulse period: 2 ns<br>
32-bit holding register: interrupts every 2 ns ... 8.59 s<br>
tick of 10 ms (FE25 q19) &nbsp;&nbsp;-&gt; load 5,000,000 into the holding register<br>
tick of 100 us (FE26 q16) &nbsp;-&gt; load 50,000 into the holding register<br>
tick of 1 ms (HZ=1000) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; load 500,000 into the holding register<br>
32-bit counter at 60 Hz overflows after 2.27 years<br>
32-bit counter of seconds overflows after 136.1 years (unsigned) / 68.0 years (signed)<br>
64-bit counter at 1000 Hz overflows after 585 million years</div>
<p>To get a tick every 10 ms from 500 MHz: 500,000,000 × 0.01 = <strong>5,000,000</strong> pulses ⇒ load 5,000,000. For 100 µs: <strong>50,000</strong>. Rule: holding value = crystal frequency × desired interval.</p>
<p class="pitfall">⚠️ FE25#19 (10 ms) = 5,000,000; FE26#16 (100 µs) = 50,000. "The period between interrupts of the clock" = clock ticks (FE21#20). "Battery-powered clock that keeps date and time while the computer is off" = real-time clock, RTC (FE5#42, FE8#40, FE14#44).</p>`,
        `<p class="y-chinh">🎯 Hình 5-28: một <strong>đồng hồ lập trình được (programmable clock)</strong> — bộ dao động thạch anh gửi xung tới một <strong>bộ đếm (counter)</strong> bị giảm 1 sau mỗi xung; về 0 thì nó gây một ngắt; <strong>thanh ghi giữ (holding register)</strong> dùng để nạp lại bộ đếm.</p>
<p>Đồng hồ (bộ định thời — timer) chẳng phải thiết bị khối hay ký tự, nhưng HĐH nào cũng cần. Loại đơn giản gắn với lưới điện và ngắt ở 50 hay 60 Hz. Loại lập trình được có nhiều chế độ: ở <strong>chế độ một lần (one-shot)</strong>, bộ đếm được nạp một lần từ thanh ghi giữ, đếm lùi về 0, ngắt rồi dừng; ở <strong>chế độ sóng vuông (square-wave)</strong>, nó tự nạp lại sau mỗi lần ngắt, sinh ra các ngắt tuần hoàn gọi là <strong>tick đồng hồ (clock tick)</strong>. Khoảng cách do phần mềm chọn: khoảng cách = giá trị thanh ghi giữ × chu kỳ một xung. Số của sách: thạch anh 500 MHz phát xung mỗi 2 ns; với thanh ghi 32 bit, ngắt có thể được lập trình cách nhau từ 2 ns tới 8,6 giây. Một <strong>đồng hồ thời gian thực (real-time clock)</strong> riêng chạy pin giữ ngày giờ khi máy tắt — chính chip PL031 mà bạn đã đọc thanh ghi ở slide 4.</p>
<p>➕ Phép tính, kèm hai câu FE:</p>
<pre><code class="language-javascript">// Đồng hồ lập trình được (Hình 5-28) và các bộ đếm của Hình 5-29, tính bằng số
const crystalHz = 500e6;                                          // thạch anh 500 MHz: một xung mỗi 2 ns
console.log(&#96;pulse period: &#36;{1e9 / crystalHz} ns&#96;);
console.log(&#96;32-bit holding register: interrupts every 2 ns ... &#36;{(2 ** 32 / crystalHz).toFixed(2)} s&#96;);
for (const [ten, tickS] of [['tick of 10 ms (FE25 q19)', 0.01], ['tick of 100 us (FE26 q16)', 100e-6], ['tick of 1 ms (HZ=1000)', 0.001]])
  console.log(&#96;&#36;{ten.padEnd(26)} -&gt; load &#36;{(crystalHz * tickS).toLocaleString('en-US')} into the holding register&#96;);
// Hình 5-29: bao lâu thì bộ đếm tick tràn?
const nam = 365.25 * 86400;
console.log(&#96;32-bit counter at 60 Hz overflows after &#36;{(2 ** 32 / 60 / nam).toFixed(2)} years&#96;);
console.log(&#96;32-bit counter of seconds overflows after &#36;{(2 ** 32 / nam).toFixed(1)} years (unsigned) / &#36;{(2 ** 31 / nam).toFixed(1)} years (signed)&#96;);
console.log(&#96;64-bit counter at 1000 Hz overflows after &#36;{(2 ** 64 / 1000 / nam / 1e6).toFixed(0)} million years&#96;);</code></pre>
<div class="out">$ node dong-ho-lap-trinh.js<br>
pulse period: 2 ns<br>
32-bit holding register: interrupts every 2 ns ... 8.59 s<br>
tick of 10 ms (FE25 q19) &nbsp;&nbsp;-&gt; load 5,000,000 into the holding register<br>
tick of 100 us (FE26 q16) &nbsp;-&gt; load 50,000 into the holding register<br>
tick of 1 ms (HZ=1000) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; load 500,000 into the holding register<br>
32-bit counter at 60 Hz overflows after 2.27 years<br>
32-bit counter of seconds overflows after 136.1 years (unsigned) / 68.0 years (signed)<br>
64-bit counter at 1000 Hz overflows after 585 million years</div>
<p>Muốn tick mỗi 10 ms từ 500 MHz: 500.000.000 × 0,01 = <strong>5.000.000</strong> xung ⇒ nạp 5.000.000. Với 100 µs: <strong>50.000</strong>. Quy tắc: giá trị thanh ghi giữ = tần số thạch anh × khoảng cách mong muốn.</p>
<p class="pitfall">⚠️ FE25#19 (10 ms) = 5.000.000; FE26#16 (100 µs) = 50.000. "Khoảng thời gian giữa các lần ngắt của đồng hồ" = clock ticks (FE21#20). "Đồng hồ chạy pin giữ ngày giờ khi máy tắt" = real-time clock, RTC (FE5#42, FE8#40, FE14#44).</p>`],
      [38, 'Clock Software (1)',
        `<p class="y-chinh">🎯 Typical duties of a clock driver: (1) maintaining the time of day; (2) preventing processes from running longer than allowed; (3) accounting for CPU usage; (4) handling the <code>alarm</code> system call from user processes; (5) providing watchdog timers for parts of the system itself; (6) profiling, monitoring and statistics gathering.</p>
<p>All the hardware does is interrupt at known intervals; everything else is software. (2): at each tick the driver decrements the running process's quantum counter; at zero, the scheduler runs another process (Round Robin, Chapter 2). (3): the simplest accounting charges each tick to the process that was running — not exact, but cheap. (4): a process asks to be warned after some time (a network retransmission timeout, for example); the driver must handle many such requests with one clock (slide 40). (5): <strong>watchdog timers</strong> are used by the OS itself, e.g. a floppy driver turning the motor off after a few seconds, or — in embedded and server hardware — a timer that resets the machine if the software stops "petting" it, i.e. after a crash or hang. (6): profiling records the PC at each tick to build a histogram of where the program spends its time.</p>
<p>➕ Duties 2 and 4 seen from the shell — a CPU-time limit and a real-time alarm, both enforced by the kernel's timers:</p>
<div class="out"># Clock duty 2: "prevent processes from running longer than allowed" — a 1-second CPU-time limit<br>
$ (ulimit -t 1; exec yes &gt; /dev/null)<br>
bash: &nbsp;&nbsp;&nbsp;&nbsp;9 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( ulimit -t 1; exec yes &gt; /dev/null )<br>
$ echo "exit code: $? = 128 + 9 (SIGKILL)"<br>
exit code: 137 = 128 + 9 (SIGKILL)<br>
# Clock duty 4: an alarm in REAL time — timeout asks the kernel for a timer, then kills the command<br>
$ timeout 1 sleep 10<br>
$ echo "exit code: $? (timeout's code for 'time is up')"<br>
exit code: 124 (timeout's code for 'time is up')</div>
<p><code>yes</code> runs forever, but with <code>ulimit -t 1</code> the kernel counted its CPU time tick by tick and killed it after one second (signal 9, exit code 137). <code>timeout 1</code> asked for a one-second alarm and killed <code>sleep 10</code> when it rang (exit code 124).</p>
<p class="pitfall">⚠️ Watchdog timer = detects crashes/hangs and resets the system (FE1#14, FE12#40). NOT a duty: "helping processes run longer than allowed" (FE3#34 — the duty is the opposite). Tasks of the clock driver = all of time of day, CPU accounting, alarm (FE23#1).</p>`,
        `<p class="y-chinh">🎯 Nhiệm vụ điển hình của driver đồng hồ: (1) giữ giờ trong ngày; (2) ngăn tiến trình chạy lâu hơn mức cho phép; (3) tính cước thời gian CPU đã dùng; (4) xử lý lời gọi hệ thống <code>alarm</code> từ tiến trình người dùng; (5) cung cấp bộ hẹn giờ canh gác (watchdog timer) cho các phần của chính hệ thống; (6) lập hồ sơ hiệu năng (profiling), giám sát và thu thập thống kê.</p>
<p>Phần cứng chỉ làm mỗi việc ngắt theo những khoảng đã biết; mọi thứ còn lại là phần mềm. (2): mỗi tick, driver giảm bộ đếm lượng tử của tiến trình đang chạy; về 0 thì bộ lập lịch cho tiến trình khác chạy (Round Robin, Chương 2). (3): cách tính cước đơn giản nhất là ghi mỗi tick cho tiến trình đang chạy lúc đó — không chính xác, nhưng rẻ. (4): một tiến trình xin được báo sau một khoảng thời gian (ví dụ hạn gửi lại gói tin mạng); driver phải lo nhiều yêu cầu như vậy với chỉ một đồng hồ (slide 40). (5): <strong>watchdog timer</strong> do chính HĐH dùng, ví dụ driver đĩa mềm tắt mô-tơ sau vài giây, hoặc — trên phần cứng nhúng và server — một bộ hẹn giờ khởi động lại máy nếu phần mềm thôi "vỗ về" nó, tức là sau khi sập hay treo. (6): profiling ghi lại PC ở mỗi tick để dựng biểu đồ xem chương trình tốn thời gian ở đâu.</p>
<p>➕ Nhiệm vụ 2 và 4 nhìn từ shell — một giới hạn thời gian CPU và một báo thức theo thời gian thực, cả hai do bộ hẹn giờ của nhân thi hành:</p>
<div class="out"># Nhiệm vụ 2 của đồng hồ: "ngăn tiến trình chạy lâu hơn mức cho phép" — giới hạn 1 giây CPU<br>
$ (ulimit -t 1; exec yes &gt; /dev/null)<br>
bash: &nbsp;&nbsp;&nbsp;&nbsp;9 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( ulimit -t 1; exec yes &gt; /dev/null )<br>
$ echo "exit code: $? = 128 + 9 (SIGKILL)"<br>
exit code: 137 = 128 + 9 (SIGKILL)<br>
# Nhiệm vụ 4: báo thức theo thời gian THỰC — timeout xin nhân một bộ hẹn giờ, rồi giết lệnh<br>
$ timeout 1 sleep 10<br>
$ echo "exit code: $? (timeout's code for 'time is up')"<br>
exit code: 124 (timeout's code for 'time is up')</div>
<p><code>yes</code> chạy mãi mãi, nhưng với <code>ulimit -t 1</code> nhân đếm thời gian CPU của nó từng tick và giết nó sau một giây (tín hiệu 9, mã thoát 137). <code>timeout 1</code> xin một báo thức một giây và giết <code>sleep 10</code> khi chuông reo (mã thoát 124).</p>
<p class="pitfall">⚠️ Watchdog timer = phát hiện sập/treo và khởi động lại hệ thống (FE1#14, FE12#40). KHÔNG phải nhiệm vụ: "giúp tiến trình chạy lâu hơn mức cho phép" (FE3#34 — nhiệm vụ thật là điều ngược lại). Việc của driver đồng hồ = cả giờ trong ngày, tính cước CPU, alarm (FE23#1).</p>`],
      [39, 'Clock Software (2)',
        `<p class="y-chinh">🎯 Figure 5-29: three ways to maintain the time of day — (a) a <strong>64-bit counter of ticks</strong>; (b) the time of day in <strong>seconds</strong> (32 bits) plus a counter of ticks in the current second; (c) a counter of ticks <strong>since boot</strong>, plus the boot time in seconds stored once.</p>
<p>The problem is overflow. A 32-bit counter at 60 Hz overflows in just over two years — useless for a time of day. (a) solves it with 64 bits, at the cost of 64-bit arithmetic on every tick. (b) counts whole seconds in 32 bits (enough for 136 years unsigned, 68 years signed) and ticks within the current second separately. (c) keeps a counter relative to boot and adds the boot time only when the time of day is asked for — the counter never has to deal with dates.</p>
<p>➕ What Linux offers a program today, and the famous consequence of choice (b) with a <em>signed</em> 32-bit counter:</p>
<pre><code class="language-c">// What the clock software gives a program: several clocks, their resolution, the tick rate, and the 2038 limit
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;

static void phan_giai(const char *ten, clockid_t c) {
    struct timespec r; clock_getres(c, &amp;r);
    printf("%-26s resolution %10ld ns\\n", ten, r.tv_sec * 1000000000L + r.tv_nsec);
}

int main(void) {
    phan_giai("CLOCK_REALTIME (date)", CLOCK_REALTIME);          // time of day, can jump (NTP, admin)
    phan_giai("CLOCK_MONOTONIC", CLOCK_MONOTONIC);                // since boot, never goes back
    phan_giai("CLOCK_BOOTTIME", CLOCK_BOOTTIME);
    phan_giai("CLOCK_PROCESS_CPUTIME_ID", CLOCK_PROCESS_CPUTIME_ID);
    phan_giai("CLOCK_MONOTONIC_COARSE", CLOCK_MONOTONIC_COARSE); // updated only at each clock TICK
    struct timespec r; clock_getres(CLOCK_MONOTONIC_COARSE, &amp;r);
    printf("=&gt; the kernel's clock ticks %ld times per second (CONFIG_HZ)\\n", 1000000000L / r.tv_nsec);
    printf("sysconf(_SC_CLK_TCK) = %ld (the unit of times() and /proc/&lt;pid&gt;/stat, fixed at 100)\\n", sysconf(_SC_CLK_TCK));
    // Figure 5-29(b): time of day kept as seconds since 1970 in a SIGNED 32-bit counter...
    time_t het = INT32_MAX;
    char s[64]; strftime(s, sizeof s, "%Y-%m-%d %H:%M:%S UTC", gmtime(&amp;het));
    printf("signed 32-bit seconds overflow after %d = %s\\n", INT32_MAX, s);
    printf("time_t on this system: %zu bits\\n", 8 * sizeof(time_t));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dong-ho.c -o dong-ho &amp;&amp; ./dong-ho<br>
CLOCK_REALTIME (date) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_MONOTONIC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_BOOTTIME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_PROCESS_CPUTIME_ID &nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_MONOTONIC_COARSE &nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;1000000 ns<br>
=&gt; the kernel's clock ticks 1000 times per second (CONFIG_HZ)<br>
sysconf(_SC_CLK_TCK) = 100 (the unit of times() and /proc/&lt;pid&gt;/stat, fixed at 100)<br>
signed 32-bit seconds overflow after 2147483647 = 2038-01-19 03:14:07 UTC<br>
time_t on this system: 64 bits</div>
<p>Programs read the time of day with nanosecond resolution (<code>CLOCK_REALTIME</code>, can jump when NTP corrects it), or a <code>CLOCK_MONOTONIC</code> that counts from boot and never goes backwards — scheme (c), the one to use for measuring durations. The "coarse" clock is only updated at each tick, so its resolution reveals the tick rate: 1 ms, CONFIG_HZ = 1000 on this kernel (many distribution kernels use 250). And the signed 32-bit count of seconds since 1970 ends on <strong>19 January 2038 at 03:14:07 UTC</strong> — the "year 2038 problem". This system's <code>time_t</code> is 64 bits; 32-bit systems needed kernel changes (Linux 5.6, 2020) and a recompiled C library.</p>
<p class="meo">🧠 Durations: monotonic clock. Timestamps for humans: real-time clock. Mixing them is a classic bug (a timeout that fires immediately because NTP moved the clock).</p>`,
        `<p class="y-chinh">🎯 Hình 5-29: ba cách giữ giờ trong ngày — (a) một <strong>bộ đếm tick 64 bit</strong>; (b) giờ trong ngày tính bằng <strong>giây</strong> (32 bit) cộng một bộ đếm tick trong giây hiện tại; (c) một bộ đếm tick <strong>từ lúc khởi động</strong>, cộng thời điểm khởi động tính bằng giây lưu một lần.</p>
<p>Bài toán là tràn số. Bộ đếm 32 bit ở 60 Hz tràn sau hơn hai năm một chút — vô dụng để giữ giờ. (a) giải bằng 64 bit, với cái giá là phép tính 64 bit ở mỗi tick. (b) đếm số giây trọn trong 32 bit (đủ 136 năm nếu không dấu, 68 năm nếu có dấu) và đếm riêng tick trong giây hiện tại. (c) giữ bộ đếm tính từ lúc khởi động và chỉ cộng thời điểm khởi động khi có ai hỏi giờ — bộ đếm không bao giờ phải dính tới ngày tháng.</p>
<p>➕ Linux ngày nay cho chương trình những gì, và hệ quả nổi tiếng của cách (b) với bộ đếm 32 bit <em>có dấu</em>:</p>
<pre><code class="language-c">// Phần mềm đồng hồ cho chương trình những gì: nhiều đồng hồ, độ phân giải, tần số tick, và giới hạn năm 2038
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;

static void phan_giai(const char *ten, clockid_t c) {
    struct timespec r; clock_getres(c, &amp;r);
    printf("%-26s resolution %10ld ns\\n", ten, r.tv_sec * 1000000000L + r.tv_nsec);
}

int main(void) {
    phan_giai("CLOCK_REALTIME (date)", CLOCK_REALTIME);          // giờ trong ngày, có thể nhảy (NTP, quản trị viên)
    phan_giai("CLOCK_MONOTONIC", CLOCK_MONOTONIC);                // từ lúc khởi động, không bao giờ lùi
    phan_giai("CLOCK_BOOTTIME", CLOCK_BOOTTIME);
    phan_giai("CLOCK_PROCESS_CPUTIME_ID", CLOCK_PROCESS_CPUTIME_ID);
    phan_giai("CLOCK_MONOTONIC_COARSE", CLOCK_MONOTONIC_COARSE); // chỉ cập nhật ở mỗi TICK đồng hồ
    struct timespec r; clock_getres(CLOCK_MONOTONIC_COARSE, &amp;r);
    printf("=&gt; the kernel's clock ticks %ld times per second (CONFIG_HZ)\\n", 1000000000L / r.tv_nsec);
    printf("sysconf(_SC_CLK_TCK) = %ld (the unit of times() and /proc/&lt;pid&gt;/stat, fixed at 100)\\n", sysconf(_SC_CLK_TCK));
    // Hình 5-29(b): giờ lưu bằng số giây từ 1970 trong bộ đếm 32 bit CÓ DẤU...
    time_t het = INT32_MAX;
    char s[64]; strftime(s, sizeof s, "%Y-%m-%d %H:%M:%S UTC", gmtime(&amp;het));
    printf("signed 32-bit seconds overflow after %d = %s\\n", INT32_MAX, s);
    printf("time_t on this system: %zu bits\\n", 8 * sizeof(time_t));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dong-ho.c -o dong-ho &amp;&amp; ./dong-ho<br>
CLOCK_REALTIME (date) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_MONOTONIC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_BOOTTIME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_PROCESS_CPUTIME_ID &nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 ns<br>
CLOCK_MONOTONIC_COARSE &nbsp;&nbsp;&nbsp;&nbsp;resolution &nbsp;&nbsp;&nbsp;1000000 ns<br>
=&gt; the kernel's clock ticks 1000 times per second (CONFIG_HZ)<br>
sysconf(_SC_CLK_TCK) = 100 (the unit of times() and /proc/&lt;pid&gt;/stat, fixed at 100)<br>
signed 32-bit seconds overflow after 2147483647 = 2038-01-19 03:14:07 UTC<br>
time_t on this system: 64 bits</div>
<p>Chương trình đọc giờ trong ngày với độ phân giải nano giây (<code>CLOCK_REALTIME</code>, có thể nhảy khi NTP chỉnh giờ), hoặc <code>CLOCK_MONOTONIC</code> đếm từ lúc khởi động và không bao giờ lùi — cách (c), thứ nên dùng để đo khoảng thời gian. Đồng hồ "coarse" (thô) chỉ được cập nhật ở mỗi tick, nên độ phân giải của nó để lộ tần số tick: 1 ms, CONFIG_HZ = 1000 trên nhân này (nhiều nhân của các bản phân phối dùng 250). Và số giây có dấu 32 bit tính từ 1970 sẽ hết vào <strong>03:14:07 UTC ngày 19/01/2038</strong> — "sự cố năm 2038". <code>time_t</code> của hệ này là 64 bit; hệ 32 bit cần sửa nhân (Linux 5.6, 2020) và biên dịch lại thư viện C.</p>
<p class="meo">🧠 Đo khoảng thời gian: đồng hồ đơn điệu (monotonic). Dấu thời gian cho người đọc: đồng hồ thời gian thực. Trộn hai cái là lỗi kinh điển (một timeout nổ ngay lập tức vì NTP vừa dời đồng hồ).</p>`],
      [40, 'Clock Software (3)',
        `<p class="y-chinh">🎯 Figure 5-30: simulating multiple timers with a single clock — the current time is 4200, the next signal is due in 3 ticks, and a linked list holds the pending timers as <strong>differences</strong>: 3, 4, 6, 2, 1 (i.e. timers at 4203, 4207, 4213, 4215 and 4216).</p>
<p>Many processes, and the OS itself, want to be woken at different times, but there is only one clock. The driver keeps the requests in a list sorted by time, each entry storing the time <em>after the previous entry</em>. At every tick only ONE number changes — "Next signal" is decremented; when it hits zero, the first entry's timer fires, the entry is removed, and the next difference becomes the new "Next signal". Inserting a new timer means walking the list and splitting one difference. The design makes the common operation, the tick, as cheap as possible.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/42e456b3b62b020a9dca31a40882b158df99746c.svg" alt="The figure rebuilt: timers at 4203, 4207, 4213, 4215, 4216 stored as differences" loading="lazy" /><p class="chu-thich">🧮 The figure rebuilt: timers at 4203, 4207, 4213, 4215, 4216 stored as differences</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BAY_GIO = 4200;
const HEN = [4203, 4207, 4213, 4215, 4216];              // absolute expiry times
function danhSachDelta(hen, now) {                          // sorted list of differences
  const s = [...hen].sort((a, b) =&gt; a - b);
  return s.map((x, i) =&gt; x - (i ? s[i - 1] : now));
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ed6b7f6df8cfbb767f4d5d0dbb82da1522696bdf.svg" alt="Three ticks later: the first timer has fired and left the list" loading="lazy" /><p class="chu-thich">🧮 Three ticks later: the first timer has fired and left the list</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BAY_GIO = 4200;
const HEN = [4203, 4207, 4213, 4215, 4216];              // absolute expiry times
function danhSachDelta(hen, now) {                          // sorted list of differences
  const s = [...hen].sort((a, b) =&gt; a - b);
  return s.map((x, i) =&gt; x - (i ? s[i - 1] : now));
}</code></pre></details>
<p>➕ Real timers on Linux — three requested out of order, delivered in time order by the kernel:</p>
<pre><code class="language-c">// Many timers, one clock (Figure 5-30): ask for three timers out of order, the kernel delivers them in time order
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/timerfd.h&gt;
#include &lt;sys/epoll.h&gt;

int main(void) {
    int ms[] = { 30, 10, 20 };                      // requested in this order
    int ep = epoll_create1(0), fds[3];
    for (int i = 0; i &lt; 3; i++) {
        int fd = fds[i] = timerfd_create(CLOCK_MONOTONIC, 0);
        struct itimerspec t = { .it_value = { .tv_sec = 0, .tv_nsec = ms[i] * 1000000L } };
        timerfd_settime(fd, 0, &amp;t, NULL);           // one-shot timer
        struct epoll_event ev = { .events = EPOLLIN, .data.u32 = i };
        epoll_ctl(ep, EPOLL_CTL_ADD, fd, &amp;ev);
        printf("set timer %d: fire in %d ms\\n", i, ms[i]);
    }
    for (int k = 0; k &lt; 3; k++) {
        struct epoll_event ev;
        epoll_wait(ep, &amp;ev, 1, -1);                  // sleep until the next timer expires
        printf("timer %d fired (%d ms)\\n", ev.data.u32, ms[ev.data.u32]);
        uint64_t n;
        read(fds[ev.data.u32], &amp;n, sizeof n);          // consume the expiration
        epoll_ctl(ep, EPOLL_CTL_DEL, fds[ev.data.u32], NULL);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ba-hen-gio.c -o ba-hen-gio &amp;&amp; ./ba-hen-gio<br>
set timer 0: fire in 30 ms<br>
set timer 1: fire in 10 ms<br>
set timer 2: fire in 20 ms<br>
timer 1 fired (10 ms)<br>
timer 2 fired (20 ms)<br>
timer 0 fired (30 ms)</div>
<p>Linux keeps ordinary timeouts in a <strong>timer wheel</strong> (buckets by expiry, constant-time insert) and precise ones (<code>timerfd</code>, <code>nanosleep</code>) in <strong>hrtimers</strong>, a red-black tree sorted by expiry — refinements of the same sorted-list idea.</p>
<div class="callout">🧭 On a real server: every HTTP client timeout, connection-pool idle timeout, Redis key expiry and Node.js <code>setTimeout</code> is one entry in such a structure; a busy server holds hundreds of thousands at once, which is why the data structure matters.</div>`,
        `<p class="y-chinh">🎯 Hình 5-30: giả lập nhiều bộ hẹn giờ bằng một đồng hồ — giờ hiện tại là 4200, lần báo kế tiếp sau 3 tick, và một danh sách liên kết giữ các hẹn giờ đang chờ dưới dạng <strong>hiệu số</strong>: 3, 4, 6, 2, 1 (tức hẹn giờ ở 4203, 4207, 4213, 4215 và 4216).</p>
<p>Nhiều tiến trình, và cả chính HĐH, muốn được đánh thức vào những thời điểm khác nhau, nhưng chỉ có một đồng hồ. Driver giữ các yêu cầu trong một danh sách sắp theo thời gian, mỗi mục lưu thời gian <em>tính từ mục trước nó</em>. Ở mỗi tick chỉ MỘT con số thay đổi — "Next signal" giảm 1; về 0 thì hẹn giờ của mục đầu nổ, mục đó bị gỡ ra, và hiệu số kế tiếp thành "Next signal" mới. Thêm một hẹn giờ mới là đi dọc danh sách và tách một hiệu số làm hai. Thiết kế này làm cho thao tác hay gặp nhất, tick, rẻ nhất có thể.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/be4988c13f89290a1c453add3c0d779c3d2a2b5d.svg" alt="Dựng lại hình: hẹn giờ ở 4203, 4207, 4213, 4215, 4216 lưu dưới dạng hiệu số" loading="lazy" /><p class="chu-thich">🧮 Dựng lại hình: hẹn giờ ở 4203, 4207, 4213, 4215, 4216 lưu dưới dạng hiệu số</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BAY_GIO = 4200;
const HEN = [4203, 4207, 4213, 4215, 4216];              // thời điểm hết hạn tuyệt đối
function danhSachDelta(hen, now) {                          // danh sách hiệu số đã sắp xếp
  const s = [...hen].sort((a, b) =&gt; a - b);
  return s.map((x, i) =&gt; x - (i ? s[i - 1] : now));
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1f03a364eccb907c14d34559f3c5786b735a9a00.svg" alt="Ba tick sau: hẹn giờ đầu đã nổ và rời danh sách" loading="lazy" /><p class="chu-thich">🧮 Ba tick sau: hẹn giờ đầu đã nổ và rời danh sách</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BAY_GIO = 4200;
const HEN = [4203, 4207, 4213, 4215, 4216];              // thời điểm hết hạn tuyệt đối
function danhSachDelta(hen, now) {                          // danh sách hiệu số đã sắp xếp
  const s = [...hen].sort((a, b) =&gt; a - b);
  return s.map((x, i) =&gt; x - (i ? s[i - 1] : now));
}</code></pre></details>
<p>➕ Bộ hẹn giờ thật trên Linux — xin ba cái lộn thứ tự, nhân trả về đúng thứ tự thời gian:</p>
<pre><code class="language-c">// Nhiều bộ hẹn giờ, một đồng hồ (Hình 5-30): xin ba bộ hẹn giờ lộn thứ tự, nhân trả về đúng thứ tự thời gian
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/timerfd.h&gt;
#include &lt;sys/epoll.h&gt;

int main(void) {
    int ms[] = { 30, 10, 20 };                      // xin theo thứ tự này
    int ep = epoll_create1(0), fds[3];
    for (int i = 0; i &lt; 3; i++) {
        int fd = fds[i] = timerfd_create(CLOCK_MONOTONIC, 0);
        struct itimerspec t = { .it_value = { .tv_sec = 0, .tv_nsec = ms[i] * 1000000L } };
        timerfd_settime(fd, 0, &amp;t, NULL);           // hẹn giờ một lần
        struct epoll_event ev = { .events = EPOLLIN, .data.u32 = i };
        epoll_ctl(ep, EPOLL_CTL_ADD, fd, &amp;ev);
        printf("set timer %d: fire in %d ms\\n", i, ms[i]);
    }
    for (int k = 0; k &lt; 3; k++) {
        struct epoll_event ev;
        epoll_wait(ep, &amp;ev, 1, -1);                  // ngủ tới khi bộ hẹn giờ kế tiếp hết hạn
        printf("timer %d fired (%d ms)\\n", ev.data.u32, ms[ev.data.u32]);
        uint64_t n;
        read(fds[ev.data.u32], &amp;n, sizeof n);          // nhận lần hết hạn
        epoll_ctl(ep, EPOLL_CTL_DEL, fds[ev.data.u32], NULL);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ba-hen-gio.c -o ba-hen-gio &amp;&amp; ./ba-hen-gio<br>
set timer 0: fire in 30 ms<br>
set timer 1: fire in 10 ms<br>
set timer 2: fire in 20 ms<br>
timer 1 fired (10 ms)<br>
timer 2 fired (20 ms)<br>
timer 0 fired (30 ms)</div>
<p>Linux giữ các timeout thông thường trong một <strong>bánh xe hẹn giờ (timer wheel)</strong> (các ngăn theo thời điểm hết hạn, chèn trong thời gian hằng số) và các hẹn giờ chính xác (<code>timerfd</code>, <code>nanosleep</code>) trong <strong>hrtimer</strong>, một cây đỏ-đen sắp theo thời điểm hết hạn — những bản tinh chỉnh của cùng ý tưởng danh sách có thứ tự.</p>
<div class="callout">🧭 Trên server thật: mỗi timeout của HTTP client, timeout rảnh của connection pool, hạn sống của khoá Redis và mỗi <code>setTimeout</code> của Node.js là một mục trong cấu trúc như vậy; một server bận giữ hàng trăm nghìn cái cùng lúc, nên cấu trúc dữ liệu là chuyện quan trọng.</div>`],
      [41, 'Soft Timers',
        `<p class="y-chinh">🎯 <strong>Soft timers</strong> stand or fall with the rate at which kernel entries are made for other reasons: system calls, TLB misses, page faults, I/O interrupts, and the CPU going idle.</p>
<p>The problem: a high-resolution hardware timer that interrupts every microsecond would waste the CPU on interrupt overhead (slide 16), yet some jobs — for example sending network packets at a precise rate — need fine timing. Soft timers (Aron and Druschel's idea, described in the book) avoid timer interrupts: whenever the kernel is entered anyway, for any of the five reasons, it checks the clock (a cheap register read) and runs the soft timers that have expired. Because those entries happen every few microseconds on a busy system, the timers fire close to on time; a low-frequency hardware timer remains as a safety net for when the system is quiet.</p>
<p>➕ The same philosophy shaped modern kernels: Linux is <strong>tickless</strong> (<code>NO_HZ</code>, since 2.6.21 in 2007) — an idle CPU does not take periodic ticks at all, the timer is programmed in one-shot mode (slide 37) for the next real event, which saves power on laptops and VMs. And network drivers (NAPI) poll instead of interrupting when packets come in fast — "check when you are already there", like soft timers.</p>
<p class="meo">🧠 Soft timer = "piggyback the timer check on kernel entries that happen anyway". It works because, on a busy machine, the kernel is entered very often.</p>`,
        `<p class="y-chinh">🎯 <strong>Bộ hẹn giờ mềm (soft timers)</strong> sống hay chết tuỳ vào tần suất nhân được gọi vào vì những lý do khác: lời gọi hệ thống, trượt TLB, lỗi trang, ngắt I/O, và CPU chuyển sang rảnh.</p>
<p>Bài toán: một bộ định thời phần cứng độ phân giải cao, ngắt mỗi micro giây, sẽ phí CPU vào chi phí ngắt (slide 16), vậy mà có việc — ví dụ gửi gói tin mạng đúng một nhịp chính xác — cần thời gian mịn. Bộ hẹn giờ mềm (ý tưởng của Aron và Druschel, được sách mô tả) tránh ngắt định thời: mỗi khi đằng nào nhân cũng được gọi vào, vì bất kỳ lý do nào trong năm lý do kia, nó xem đồng hồ (một lần đọc thanh ghi rẻ tiền) và chạy các bộ hẹn giờ mềm đã tới hạn. Vì trên hệ thống bận những lần vào nhân đó xảy ra mỗi vài micro giây, các bộ hẹn giờ nổ gần đúng giờ; một bộ định thời phần cứng tần số thấp vẫn được giữ làm lưới an toàn cho lúc hệ thống yên ắng.</p>
<p>➕ Cùng triết lý đó định hình nhân hiện đại: Linux là <strong>không tick (tickless)</strong> (<code>NO_HZ</code>, từ bản 2.6.21 năm 2007) — CPU rảnh hoàn toàn không nhận tick định kỳ, bộ định thời được lập trình ở chế độ một lần (slide 37) cho sự kiện thật kế tiếp, tiết kiệm điện cho laptop và máy ảo. Còn driver mạng (NAPI) hỏi vòng thay vì ngắt khi gói tin tới dồn dập — "ghé qua thì xem luôn", giống bộ hẹn giờ mềm.</p>
<p class="meo">🧠 Bộ hẹn giờ mềm = "gửi việc kiểm hẹn giờ vào những lần vào nhân đằng nào cũng xảy ra". Nó chạy được vì trên máy bận, nhân được gọi vào rất thường xuyên.</p>`],
      [42, 'Keyboard Software',
        `<p class="y-chinh">🎯 Figure 5-31: characters handled specially in <strong>canonical mode</strong> — CTRL-H ERASE (backspace one character), CTRL-U KILL (erase the whole line), CTRL-V LNEXT (take the next character literally), CTRL-S STOP / CTRL-Q START (output flow), DEL INTR (SIGINT), CTRL-\\ QUIT (SIGQUIT, core dump), CTRL-D EOF, CTRL-M CR and CTRL-J NL (unchangeable).</p>
<p>The keyboard hardware only reports key numbers (key down, key up); the driver turns them into characters. Then there are two philosophies. In <strong>raw mode</strong> (POSIX: <strong>noncanonical</strong>) the driver passes every character to the program at once, unedited — editors, games and shells with fancy line editing want this. In <strong>cooked mode</strong> (<strong>canonical</strong>) the driver itself collects a whole line and handles editing — the program receives only finished lines, after ENTER. Canonical mode needs a buffer (slide 21), must echo characters to the screen, and must react to the special characters in the figure.</p>
<p>➕ Today's Linux terminal driver, its special characters, and both modes for real (through a pseudo-terminal created by <code>script</code>, since the container has no keyboard):</p>
<div class="out"># The special characters of canonical ("cooked") mode on today's Linux terminal driver (compare with Figure 5-31)<br>
$ script -qec "stty -a" /dev/null &lt; /dev/null | tr -d '\\r' | sed -n '2,4p'<br>
intr = ^C; quit = ^\\; erase = ^?; kill = ^U; eof = ^D; eol = &lt;undef&gt;;<br>
eol2 = &lt;undef&gt;; swtch = &lt;undef&gt;; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R;<br>
werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;<br>
# Canonical mode: type a b c DEL d CTRL-U x y z ENTER. The kernel edits the line BEFORE cat gets it<br>
$ printf 'abc\\177d\\025xyz\\n' | script -qec "cat &gt; line.txt" /dev/null &gt; /dev/null<br>
$ od -An -c line.txt<br>
&nbsp;&nbsp;&nbsp;x &nbsp;&nbsp;y &nbsp;&nbsp;z &nbsp;\\n<br>
# Raw (non-canonical) mode: the same keys reach the program one byte at a time, unedited<br>
$ gcc -O0 -o phim _phim.c<br>
$ (sleep 0.5; printf 'ab\\177\\003q') | script -qec ./phim /dev/null | tr -d '\\r'<br>
raw mode on<br>
got byte &nbsp;97<br>
got byte &nbsp;98<br>
got byte 127 &nbsp;(DEL: not an erase any more)<br>
got byte &nbsp;&nbsp;3 &nbsp;(CTRL-C: no SIGINT, just a byte)</div>
<p>The program <code>cat</code> received only <code>xyz</code>: the kernel erased "c" on DEL and the whole line "abd" on CTRL-U before <code>cat</code> saw anything. In raw mode the same keys arrive one byte at a time — DEL is just byte 127, CTRL-C just byte 3 with no signal. ⚠️ The slide is outdated on one row: on today's Linux, <strong>INTR is CTRL-C</strong> and DEL (shown as <code>^?</code>) is <strong>ERASE</strong> — see <code>intr = ^C; erase = ^?</code> in the output above; DEL-as-interrupt was the old UNIX Version 7 convention.</p>
<div class="callout">🧭 On a real server: the line discipline is why CTRL-C stops a hung <code>mvn spring-boot:run</code> (SIGINT reaches the JVM through the terminal driver) and why a password prompt can hide what you type (<code>stty -echo</code>, the 🧪 lesson's exercise).</div>`,
        `<p class="y-chinh">🎯 Hình 5-31: các ký tự được xử lý đặc biệt trong <strong>chế độ chính tắc (canonical mode)</strong> — CTRL-H ERASE (xoá lùi một ký tự), CTRL-U KILL (xoá cả dòng), CTRL-V LNEXT (lấy ký tự kế tiếp theo nghĩa đen), CTRL-S STOP / CTRL-Q START (dừng/chạy output), DEL INTR (SIGINT), CTRL-\\ QUIT (SIGQUIT, đổ lõi), CTRL-D EOF (hết tệp), CTRL-M CR và CTRL-J NL (không đổi được).</p>
<p>Phần cứng bàn phím chỉ báo số hiệu phím (nhấn xuống, nhả ra); driver đổi chúng thành ký tự. Sau đó có hai triết lý. Ở <strong>chế độ thô (raw mode)</strong> (POSIX gọi là <strong>không chính tắc — noncanonical</strong>), driver đưa ngay từng ký tự cho chương trình, không sửa gì — trình soạn thảo, trò chơi và shell có chức năng sửa dòng xịn cần chế độ này. Ở <strong>chế độ nấu (cooked mode)</strong> (<strong>chính tắc</strong>), chính driver gom cả dòng và lo việc sửa dòng — chương trình chỉ nhận được dòng đã xong, sau khi nhấn ENTER. Chế độ chính tắc cần một bộ đệm (slide 21), phải vọng ký tự (echo) ra màn hình, và phải phản ứng với các ký tự đặc biệt trong hình.</p>
<p>➕ Driver terminal của Linux hôm nay, các ký tự đặc biệt của nó, và cả hai chế độ chạy thật (qua một terminal giả do <code>script</code> tạo ra, vì container không có bàn phím):</p>
<div class="out"># Các ký tự đặc biệt của chế độ chính tắc ("đã nấu") trên driver terminal Linux ngày nay (so với Hình 5-31)<br>
$ script -qec "stty -a" /dev/null &lt; /dev/null | tr -d '\\r' | sed -n '2,4p'<br>
intr = ^C; quit = ^\\; erase = ^?; kill = ^U; eof = ^D; eol = &lt;undef&gt;;<br>
eol2 = &lt;undef&gt;; swtch = &lt;undef&gt;; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R;<br>
werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;<br>
# Chế độ chính tắc: gõ a b c DEL d CTRL-U x y z ENTER. Nhân sửa dòng TRƯỚC khi cat nhận được<br>
$ printf 'abc\\177d\\025xyz\\n' | script -qec "cat &gt; line.txt" /dev/null &gt; /dev/null<br>
$ od -An -c line.txt<br>
&nbsp;&nbsp;&nbsp;x &nbsp;&nbsp;y &nbsp;&nbsp;z &nbsp;\\n<br>
# Chế độ thô (không chính tắc): cùng các phím tới chương trình từng byte một, không bị sửa<br>
$ gcc -O0 -o phim _phim.c<br>
$ (sleep 0.5; printf 'ab\\177\\003q') | script -qec ./phim /dev/null | tr -d '\\r'<br>
raw mode on<br>
got byte &nbsp;97<br>
got byte &nbsp;98<br>
got byte 127 &nbsp;(DEL: not an erase any more)<br>
got byte &nbsp;&nbsp;3 &nbsp;(CTRL-C: no SIGINT, just a byte)</div>
<p>Chương trình <code>cat</code> chỉ nhận được <code>xyz</code>: nhân đã xoá "c" khi gặp DEL và xoá cả dòng "abd" khi gặp CTRL-U trước khi <code>cat</code> thấy bất cứ gì. Ở chế độ thô, cùng các phím đó tới từng byte một — DEL chỉ là byte 127, CTRL-C chỉ là byte 3 và chẳng có tín hiệu nào. ⚠️ Slide đã lỗi thời ở một dòng: trên Linux ngày nay, <strong>INTR là CTRL-C</strong> còn DEL (hiện là <code>^?</code>) là <strong>ERASE</strong> — xem <code>intr = ^C; erase = ^?</code> trong output ở trên; DEL làm phím ngắt là quy ước cũ của UNIX Version 7.</p>
<div class="callout">🧭 Trên server thật: chính "line discipline" này là lý do CTRL-C dừng được một <code>mvn spring-boot:run</code> bị treo (SIGINT tới JVM qua driver terminal) và lý do dấu nhắc mật khẩu giấu được những gì bạn gõ (<code>stty -echo</code>, bài tập của bài 🧪).</div>`],
      [43, 'Output Software – Text Windows',
        `<p class="y-chinh">🎯 Figure 5-32: the <strong>ANSI escape sequences</strong> accepted by the terminal driver on output — ESC [ n A/B/C/D move the cursor up/down/right/left n positions, ESC [ m ; n H moves it to (m, n), ESC [ s J and ESC [ s K clear the screen or the line, ESC [ n L / M insert or delete lines, ESC [ n P / @ delete or insert characters, ESC [ n m sets the rendition (0 normal, 4 bold, 5 blinking, 7 reverse), ESC M scrolls backward. ESC is the ASCII escape character, 0x1B.</p>
<p>Output to a text window is simpler than input: the program sends characters, and the terminal (or terminal emulator) draws them. To do more than print lines — move the cursor, clear part of the screen, colour text — the program embeds escape sequences in the output. In the early days every terminal brand had its own; ANSI (and ECMA-48) standardised one set, and the screen-editing programs became portable. Programs usually do not hard-code them but look them up in the <strong>terminfo</strong> database (the successor of termcap) for the terminal named in <code>$TERM</code>.</p>
<p>➕ The sequences are just bytes — <code>cat -v</code> and <code>od -c</code> make them visible:</p>
<div class="out"># Output to a text terminal = ordinary bytes plus ESC [ ... sequences (Figure 5-32). cat -v makes ESC visible as ^[<br>
$ printf 'plain \\033[1mbold\\033[0m \\033[7mreverse\\033[0m\\n' | cat -v<br>
plain ^[[1mbold^[[0m ^[[7mreverse^[[0m<br>
# ESC [ 2 J = clear the whole screen; ESC [ 5 ; 10 H = cursor to row 5, column 10<br>
$ printf '\\033[2J\\033[5;10HHi' | od -An -c<br>
&nbsp;033 &nbsp;&nbsp;[ &nbsp;&nbsp;2 &nbsp;&nbsp;J 033 &nbsp;&nbsp;[ &nbsp;&nbsp;5 &nbsp;&nbsp;; &nbsp;&nbsp;1 &nbsp;&nbsp;0 &nbsp;&nbsp;H &nbsp;&nbsp;H &nbsp;&nbsp;i<br>
# Programs rarely hard-code them: tput looks the sequences up in the terminfo database<br>
$ tput -T xterm cup 4 9 | cat -v; echo<br>
^[[5;10H<br>
$ tput -T xterm bold | cat -v; echo<br>
^[[1m</div>
<p>Bold and reverse are <code>ESC [ 1 m</code> and <code>ESC [ 7 m</code>, reset is <code>ESC [ 0 m</code>; clearing the screen and moving to row 5, column 10 is <code>033 [ 2 J 033 [ 5 ; 1 0 H</code> in octal; and <code>tput cup 4 9</code> produced exactly that move (tput counts from 0, ANSI from 1). ➕ A correction to the figure: in the ANSI standard, rendition 1 is <strong>bold</strong> and 4 is <strong>underline</strong> — the figure's "4 = bold" does not match ECMA-48 (the output above shows <code>tput bold</code> = <code>ESC [ 1 m</code>).</p>
<p class="meo">🧠 Every coloured log line from Spring Boot, every progress bar of <code>npm install</code>, every <code>htop</code> screen is made of these sequences — which is why they look like garbage (<code>^[[32m</code>) when you redirect the output to a file.</p>`,
        `<p class="y-chinh">🎯 Hình 5-32: các <strong>chuỗi thoát ANSI (ANSI escape sequences)</strong> driver terminal chấp nhận khi xuất — ESC [ n A/B/C/D dời con trỏ lên/xuống/phải/trái n vị trí, ESC [ m ; n H dời tới (m, n), ESC [ s J và ESC [ s K xoá màn hình hoặc xoá dòng, ESC [ n L / M chèn hoặc xoá dòng, ESC [ n P / @ xoá hoặc chèn ký tự, ESC [ n m đặt kiểu hiển thị (0 thường, 4 đậm, 5 nhấp nháy, 7 đảo màu), ESC M cuộn ngược. ESC là ký tự escape của ASCII, 0x1B.</p>
<p>Xuất ra cửa sổ văn bản đơn giản hơn nhập: chương trình gửi ký tự, terminal (hoặc trình giả lập terminal) vẽ chúng. Muốn làm hơn việc in từng dòng — dời con trỏ, xoá một phần màn hình, tô màu chữ — chương trình chèn chuỗi thoát vào output. Thời đầu mỗi hãng terminal một kiểu; ANSI (và ECMA-48) chuẩn hoá một bộ, và các chương trình soạn thảo toàn màn hình nhờ thế chạy được khắp nơi. Chương trình thường không viết cứng các chuỗi đó mà tra trong cơ sở dữ liệu <strong>terminfo</strong> (kế thừa termcap) cho loại terminal ghi trong <code>$TERM</code>.</p>
<p>➕ Các chuỗi đó chỉ là byte — <code>cat -v</code> và <code>od -c</code> làm chúng hiện ra:</p>
<div class="out"># Xuất ra terminal văn bản = byte thường cộng chuỗi ESC [ ... (Hình 5-32). cat -v cho thấy ESC dưới dạng ^[<br>
$ printf 'plain \\033[1mbold\\033[0m \\033[7mreverse\\033[0m\\n' | cat -v<br>
plain ^[[1mbold^[[0m ^[[7mreverse^[[0m<br>
# ESC [ 2 J = xoá cả màn hình; ESC [ 5 ; 10 H = con trỏ tới dòng 5, cột 10<br>
$ printf '\\033[2J\\033[5;10HHi' | od -An -c<br>
&nbsp;033 &nbsp;&nbsp;[ &nbsp;&nbsp;2 &nbsp;&nbsp;J 033 &nbsp;&nbsp;[ &nbsp;&nbsp;5 &nbsp;&nbsp;; &nbsp;&nbsp;1 &nbsp;&nbsp;0 &nbsp;&nbsp;H &nbsp;&nbsp;H &nbsp;&nbsp;i<br>
# Chương trình hiếm khi viết cứng: tput tra các chuỗi trong cơ sở dữ liệu terminfo<br>
$ tput -T xterm cup 4 9 | cat -v; echo<br>
^[[5;10H<br>
$ tput -T xterm bold | cat -v; echo<br>
^[[1m</div>
<p>Đậm và đảo màu là <code>ESC [ 1 m</code> và <code>ESC [ 7 m</code>, trở lại bình thường là <code>ESC [ 0 m</code>; xoá màn hình và dời tới dòng 5, cột 10 là <code>033 [ 2 J 033 [ 5 ; 1 0 H</code> theo hệ bát phân; và <code>tput cup 4 9</code> sinh ra đúng lệnh dời đó (tput đếm từ 0, ANSI đếm từ 1). ➕ Một đính chính cho hình: trong chuẩn ANSI, kiểu 1 là <strong>đậm (bold)</strong> và 4 là <strong>gạch chân (underline)</strong> — "4 = bold" của hình không khớp ECMA-48 (output trên cho thấy <code>tput bold</code> = <code>ESC [ 1 m</code>).</p>
<p class="meo">🧠 Mỗi dòng log có màu của Spring Boot, mỗi thanh tiến độ của <code>npm install</code>, mỗi màn hình <code>htop</code> đều làm từ các chuỗi này — vì thế chúng trông như rác (<code>^[[32m</code>) khi bạn chuyển hướng output vào một tệp.</p>`],
      [44, 'The X Window System (1)',
        `<p class="y-chinh">🎯 Figure 5-33: clients and servers in the M.I.T. <strong>X Window System</strong> — on the remote host, the application program and the window manager sit on top of Motif, Intrinsics, Xlib and the <strong>X client</strong> layer; on the user's workstation, the <strong>X server</strong> owns the screen, keyboard and mouse; the two talk the <strong>X protocol</strong> over the network.</p>
<p>X (1984, MIT; version X11 since 1987) is the classic UNIX windowing system. Its surprising naming: the <strong>X server</strong> is the program on the machine <em>in front of you</em> — it serves the display; the <strong>clients</strong> are the applications, possibly running on another machine. Xlib is the library that turns function calls into protocol messages; Intrinsics and Motif are widget toolkits built on top (buttons, menus); the <strong>window manager</strong> is just another client that draws borders and title bars and decides where windows go. Because everything goes through a protocol, a program on a server could open a window on your laptop — X's famous network transparency.</p>
<p>➕ What happened since (sources: wayland.freedesktop.org; Fedora and Ubuntu release notes): <strong>Wayland</strong> (1.0 in October 2012) replaces X on most Linux desktops — Fedora 25 (2016) made it the default GNOME session, Ubuntu followed with 21.04 (2021). In Wayland the display server, the window manager and the compositor are one program (the <em>compositor</em>, e.g. GNOME's Mutter or KDE's KWin); applications draw their own windows into buffers and hand them over, and network transparency is gone (remote desktops use RDP/VNC instead). Old X applications still run through <strong>XWayland</strong>.</p>
<p class="meo">🧠 X naming trick for the exam: <em>server = where the screen is</em>, <em>client = the application</em>. It is the opposite of "server = the big machine in the data centre".</p>`,
        `<p class="y-chinh">🎯 Hình 5-33: client và server trong <strong>X Window System</strong> của M.I.T. — trên máy ở xa, chương trình ứng dụng và trình quản lý cửa sổ nằm trên Motif, Intrinsics, Xlib và tầng <strong>X client</strong>; trên máy trạm của người dùng, <strong>X server</strong> sở hữu màn hình, bàn phím và chuột; hai bên nói chuyện bằng <strong>giao thức X</strong> qua mạng.</p>
<p>X (1984, MIT; bản X11 từ 1987) là hệ thống cửa sổ kinh điển của UNIX. Cách gọi tên của nó gây bất ngờ: <strong>X server</strong> là chương trình trên máy <em>ngay trước mặt bạn</em> — nó phục vụ màn hình; còn <strong>client</strong> là các ứng dụng, có thể chạy trên một máy khác. Xlib là thư viện đổi lời gọi hàm thành thông điệp giao thức; Intrinsics và Motif là bộ công cụ widget dựng bên trên (nút, menu); <strong>trình quản lý cửa sổ (window manager)</strong> chỉ là một client nữa, lo vẽ viền và thanh tiêu đề và quyết định cửa sổ nằm đâu. Vì mọi thứ đi qua một giao thức, chương trình trên server có thể mở cửa sổ trên laptop của bạn — tính trong suốt mạng nổi tiếng của X.</p>
<p>➕ Điều đã xảy ra từ đó (nguồn: wayland.freedesktop.org; ghi chú phát hành của Fedora và Ubuntu): <strong>Wayland</strong> (bản 1.0 tháng 10/2012) thay X trên phần lớn máy bàn Linux — Fedora 25 (2016) đặt nó làm phiên GNOME mặc định, Ubuntu theo sau từ 21.04 (2021). Trong Wayland, server hiển thị, trình quản lý cửa sổ và bộ ghép hình là một chương trình (gọi là <em>compositor</em>, ví dụ Mutter của GNOME hay KWin của KDE); ứng dụng tự vẽ cửa sổ của mình vào bộ đệm rồi trao lại, và tính trong suốt mạng không còn (máy tính từ xa dùng RDP/VNC thay thế). Ứng dụng X cũ vẫn chạy được nhờ <strong>XWayland</strong>.</p>
<p class="meo">🧠 Mẹo nhớ tên gọi của X khi thi: <em>server = chỗ có màn hình</em>, <em>client = ứng dụng</em>. Ngược hẳn với "server = cái máy to trong trung tâm dữ liệu".</p>`],
      [45, 'The X Window System (2)',
        `<p class="y-chinh">🎯 Four types of messages between client and server: (1) drawing commands from the program to the workstation; (2) replies by the workstation to program queries; (3) keyboard, mouse and other event announcements; (4) error messages.</p>
<p>Drawing commands are one-way and can be batched — the client does not wait for an answer after each line it draws, which is what made X usable over slow networks. Queries (what fonts exist? how big is this window?) need a round trip, so good X programs avoid them. Events flow the other way: key presses, mouse clicks, and — important — <strong>Expose</strong> events telling a client that part of its window became visible and must be redrawn (X does not keep the hidden pixels). Errors are reported asynchronously, sometimes long after the request that caused them.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b6a2976c5b8135a73ab9ef5cd2c45f29e66ea19b.svg" alt="One X session: connect, create a window, the window manager decorates it, then events and drawing" loading="lazy" /><p class="chu-thich">🧩 One X session: connect, create a window, the window manager decorates it, then events and drawing</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slides 44-47: the X protocol — the program is the CLIENT, the screen's owner is the SERVER (possibly over a network)
participant "X client\\n(application on the remote host)" as C
participant "X server\\n(owns screen, keyboard, mouse)" as S
participant "Window manager\\n(another X client)" as WM
C -&gt; S : XOpenDisplay: connect (TCP or local socket)
C -&gt; S : XCreateSimpleWindow, XMapRaised
S -&gt; WM : "a new window wants to appear"
WM -&gt; S : add title bar and border, place it
S -&gt; C : event: Expose ("draw yourself")
C -&gt; S : drawing commands (lines, text...)
S -&gt; C : event: ButtonPress (x = 200, y = 100)
C -&gt; S : query: "what font metrics?"
S -&gt; C : reply
S -&gt; C : event: KeyPress
C -&gt; S : XCloseDisplay
@enduml</code></pre></details>
<p>➕ This message model is exactly an <strong>event-driven</strong> program, the same shape as the slides 46–47 skeleton and the Windows program on slides 49–50 — and the same shape as a Node.js server, which also waits for events (requests) and reacts.</p>
<p class="meo">🧠 Commands → server, replies and events → client. "Expose" = "please repaint yourself".</p>`,
        `<p class="y-chinh">🎯 Bốn loại thông điệp giữa client và server: (1) lệnh vẽ từ chương trình gửi tới máy trạm; (2) trả lời của máy trạm cho các câu hỏi của chương trình; (3) thông báo sự kiện bàn phím, chuột và các sự kiện khác; (4) thông điệp báo lỗi.</p>
<p>Lệnh vẽ chỉ đi một chiều và gom thành mẻ được — client không chờ trả lời sau mỗi đường nó vẽ, nhờ vậy X dùng được qua mạng chậm. Câu hỏi (có những phông nào? cửa sổ này to bao nhiêu?) cần một vòng đi-về, nên chương trình X tốt sẽ tránh. Sự kiện đi theo chiều ngược lại: phím được nhấn, chuột được bấm, và — quan trọng — sự kiện <strong>Expose</strong> báo cho client rằng một phần cửa sổ của nó vừa hiện ra và phải vẽ lại (X không giữ các điểm ảnh bị che). Lỗi được báo bất đồng bộ, có khi rất lâu sau yêu cầu gây ra nó.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b6a2976c5b8135a73ab9ef5cd2c45f29e66ea19b.svg" alt="Một phiên X: kết nối, tạo cửa sổ, trình quản lý cửa sổ trang trí nó, rồi tới sự kiện và lệnh vẽ" loading="lazy" /><p class="chu-thich">🧩 Một phiên X: kết nối, tạo cửa sổ, trình quản lý cửa sổ trang trí nó, rồi tới sự kiện và lệnh vẽ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 44-47: giao thức X — chương trình là CLIENT, chủ màn hình là SERVER (có thể qua mạng)
participant "X client\\n(application on the remote host)" as C
participant "X server\\n(owns screen, keyboard, mouse)" as S
participant "Window manager\\n(another X client)" as WM
C -&gt; S : XOpenDisplay: connect (TCP or local socket)
C -&gt; S : XCreateSimpleWindow, XMapRaised
S -&gt; WM : "a new window wants to appear"
WM -&gt; S : add title bar and border, place it
S -&gt; C : event: Expose ("draw yourself")
C -&gt; S : drawing commands (lines, text...)
S -&gt; C : event: ButtonPress (x = 200, y = 100)
C -&gt; S : query: "what font metrics?"
S -&gt; C : reply
S -&gt; C : event: KeyPress
C -&gt; S : XCloseDisplay
@enduml</code></pre></details>
<p>➕ Mô hình thông điệp này chính là một chương trình <strong>hướng sự kiện (event-driven)</strong>, cùng hình dạng với khung chương trình ở slide 46–47 và chương trình Windows ở slide 49–50 — và cùng hình dạng với một server Node.js, thứ cũng chờ sự kiện (request) rồi phản ứng.</p>
<p class="meo">🧠 Lệnh → server, trả lời và sự kiện → client. "Expose" = "làm ơn tự vẽ lại mình".</p>`],
      [46, 'The X Window System (3)',
        `<p class="y-chinh">🎯 Figure 5-34 (first half): the skeleton of an X application — declare a display, a window, a graphic context and an event; <code>XOpenDisplay</code> connects to the X server; <code>XCreateSimpleWindow</code> allocates the window; <code>XSetStandardProperties</code> announces it to the window manager; <code>XCreateGC</code> creates a graphic context; <code>XSelectInput</code> chooses the events of interest (ButtonPress, KeyPress, Expose); <code>XMapRaised</code> displays the window and sends an Expose event.</p>
<p>The <strong>graphic context (GC)</strong> holds drawing settings — colour, line width, font — so each drawing command does not have to carry them all over the network; it is created once and referred to by an identifier. <code>XSelectInput</code> is a filter: the server sends only the events the client asked for, saving traffic. Notice that the window does not appear when it is created — only when it is <strong>mapped</strong>, and the first thing the program then receives is an Expose event asking it to draw.</p>
<p>➕ The container has no X server and no Xlib, so this skeleton cannot run here; the next slide's loop is rebuilt in a few lines of JavaScript instead. To try the real thing on a Linux desktop: <code>sudo apt install libx11-dev</code>, compile with <code>gcc x.c -lX11</code>, and run it in an X session (or under XWayland).</p>
<p class="meo">🧠 Order to remember: open display → create window → properties for the window manager → GC → select input → map. Mapping is the "show" step.</p>`,
        `<p class="y-chinh">🎯 Hình 5-34 (nửa đầu): khung của một ứng dụng X — khai báo display, cửa sổ, ngữ cảnh đồ hoạ và một sự kiện; <code>XOpenDisplay</code> kết nối tới X server; <code>XCreateSimpleWindow</code> cấp phát cửa sổ; <code>XSetStandardProperties</code> báo cửa sổ cho trình quản lý cửa sổ; <code>XCreateGC</code> tạo ngữ cảnh đồ hoạ; <code>XSelectInput</code> chọn các sự kiện quan tâm (ButtonPress, KeyPress, Expose); <code>XMapRaised</code> hiện cửa sổ và gửi một sự kiện Expose.</p>
<p><strong>Ngữ cảnh đồ hoạ (graphic context — GC)</strong> giữ các thiết lập vẽ — màu, độ dày nét, phông — để lệnh vẽ nào cũng khỏi phải mang hết chúng qua mạng; nó được tạo một lần và được tham chiếu bằng một mã định danh. <code>XSelectInput</code> là một bộ lọc: server chỉ gửi những sự kiện client đã xin, đỡ tốn đường truyền. Để ý cửa sổ không hiện ra lúc được tạo — chỉ hiện khi được <strong>map</strong> (ánh xạ lên màn hình), và thứ đầu tiên chương trình nhận được sau đó là một sự kiện Expose bảo nó vẽ.</p>
<p>➕ Container không có X server và không có Xlib, nên khung này không chạy được ở đây; vòng lặp của slide sau được dựng lại bằng vài dòng JavaScript. Muốn thử thật trên Linux máy bàn: <code>sudo apt install libx11-dev</code>, biên dịch bằng <code>gcc x.c -lX11</code>, rồi chạy trong một phiên X (hoặc dưới XWayland).</p>
<p class="meo">🧠 Thứ tự cần nhớ: mở display → tạo cửa sổ → thuộc tính cho trình quản lý cửa sổ → GC → chọn input → map. Map chính là bước "hiện lên".</p>`],
      [47, 'The X Window System (4)',
        `<p class="y-chinh">🎯 Figure 5-34 (second half): the main loop — <code>while (running) { XNextEvent(disp, &amp;event); switch (event.type) { case Expose: … repaint window; case ButtonPress: … process mouse click; case Keypress: … process keyboard input; } }</code> — and at the end <code>XFreeGC</code>, <code>XDestroyWindow</code>, <code>XCloseDisplay</code> release the GC, the window's memory and the network connection.</p>
<p>The heart of every GUI program is this <strong>event loop</strong>: block until the next event arrives (<code>XNextEvent</code>), dispatch on its type, repeat. The program never "reads the mouse"; the mouse tells the program. Long work inside a <code>case</code> freezes the window — no other event is handled until it returns — the reason GUI toolkits insist on background threads for slow jobs.</p>
<p>➕ The same loop in a few lines, with a queue of events standing in for the X server:</p>
<pre><code class="language-javascript">// The skeleton of Figures 5-34 and 5-36 in a few lines: an event queue, a loop, and a switch
const hangDoi = [                                       // what the X server / Windows puts in the queue
  { type: 'Expose' },
  { type: 'ButtonPress', x: 200, y: 100 },
  { type: 'KeyPress', key: 'a' },
  { type: 'KeyPress', key: 'q' },
  { type: 'Expose' },                                   // never reached: the program quit before
];
function xuLy(ev) {                                     // the "window procedure"
  switch (ev.type) {
    case 'Expose': return 'repaint window';
    case 'ButtonPress': return &#96;process mouse click at (&#36;{ev.x}, &#36;{ev.y})&#96;;
    case 'KeyPress': return ev.key === 'q' ? 'quit' : &#96;process keyboard input '&#36;{ev.key}'&#96;;
    default: return 'default processing';
  }
}
let running = true;
while (running &amp;&amp; hangDoi.length) {                     // while (running) { XNextEvent(...); switch ... }
  const ev = hangDoi.shift();
  const viec = xuLy(ev);
  console.log(&#96;&#36;{ev.type.padEnd(12)} -&gt; &#36;{viec}&#96;);
  if (viec === 'quit') running = false;
}
console.log(&#96;left in queue: &#36;{hangDoi.length} event(s)&#96;);</code></pre>
<div class="out">$ node vong-su-kien.js<br>
Expose &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; repaint window<br>
ButtonPress &nbsp;-&gt; process mouse click at (200, 100)<br>
KeyPress &nbsp;&nbsp;&nbsp;&nbsp;-&gt; process keyboard input 'a'<br>
KeyPress &nbsp;&nbsp;&nbsp;&nbsp;-&gt; quit<br>
left in queue: 1 event(s)</div>
<p>Each event is taken from the queue and handled by a <code>switch</code>; the 'q' key sets <code>running = false</code>, so the last Expose is never processed — exactly the structure of Figure 5-34 (and of Figure 5-36 on slide 49).</p>
<div class="callout">🧭 On a real server: Node.js is this loop with network events instead of mouse clicks (libuv's event loop on top of epoll). The GUI rule "never block inside the handler" is the Node rule "never block the event loop" — a slow synchronous JSON parse or a <code>while</code> loop in a request handler stalls every other request.</div>`,
        `<p class="y-chinh">🎯 Hình 5-34 (nửa sau): vòng lặp chính — <code>while (running) { XNextEvent(disp, &amp;event); switch (event.type) { case Expose: … vẽ lại cửa sổ; case ButtonPress: … xử lý cú bấm chuột; case Keypress: … xử lý phím; } }</code> — và ở cuối <code>XFreeGC</code>, <code>XDestroyWindow</code>, <code>XCloseDisplay</code> giải phóng GC, bộ nhớ của cửa sổ và kết nối mạng.</p>
<p>Trái tim của mọi chương trình GUI là <strong>vòng lặp sự kiện (event loop)</strong> này: chặn chờ tới khi sự kiện kế tiếp tới (<code>XNextEvent</code>), rẽ nhánh theo loại của nó, lặp lại. Chương trình không bao giờ "đọc chuột"; chuột báo cho chương trình. Việc dài trong một <code>case</code> làm cửa sổ đứng hình — không sự kiện nào khác được xử lý cho tới khi nó trả về — lý do các bộ công cụ GUI bắt việc chậm phải chạy ở luồng nền.</p>
<p>➕ Cùng vòng lặp đó trong vài dòng, với một hàng đợi sự kiện đóng vai X server:</p>
<pre><code class="language-javascript">// Khung của Hình 5-34 và 5-36 trong vài dòng: một hàng đợi sự kiện, một vòng lặp, và một switch
const hangDoi = [                                       // những gì X server / Windows đưa vào hàng đợi
  { type: 'Expose' },
  { type: 'ButtonPress', x: 200, y: 100 },
  { type: 'KeyPress', key: 'a' },
  { type: 'KeyPress', key: 'q' },
  { type: 'Expose' },                                   // không bao giờ tới: chương trình đã thoát trước
];
function xuLy(ev) {                                     // "thủ tục cửa sổ"
  switch (ev.type) {
    case 'Expose': return 'repaint window';
    case 'ButtonPress': return &#96;process mouse click at (&#36;{ev.x}, &#36;{ev.y})&#96;;
    case 'KeyPress': return ev.key === 'q' ? 'quit' : &#96;process keyboard input '&#36;{ev.key}'&#96;;
    default: return 'default processing';
  }
}
let running = true;
while (running &amp;&amp; hangDoi.length) {                     // vòng lặp sự kiện
  const ev = hangDoi.shift();
  const viec = xuLy(ev);
  console.log(&#96;&#36;{ev.type.padEnd(12)} -&gt; &#36;{viec}&#96;);
  if (viec === 'quit') running = false;
}
console.log(&#96;left in queue: &#36;{hangDoi.length} event(s)&#96;);</code></pre>
<div class="out">$ node vong-su-kien.js<br>
Expose &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; repaint window<br>
ButtonPress &nbsp;-&gt; process mouse click at (200, 100)<br>
KeyPress &nbsp;&nbsp;&nbsp;&nbsp;-&gt; process keyboard input 'a'<br>
KeyPress &nbsp;&nbsp;&nbsp;&nbsp;-&gt; quit<br>
left in queue: 1 event(s)</div>
<p>Mỗi sự kiện được lấy khỏi hàng đợi và xử lý bằng một <code>switch</code>; phím 'q' đặt <code>running = false</code>, nên sự kiện Expose cuối cùng không bao giờ được xử lý — đúng cấu trúc của Hình 5-34 (và của Hình 5-36 ở slide 49).</p>
<div class="callout">🧭 Trên server thật: Node.js chính là vòng lặp này, với sự kiện mạng thay cho cú bấm chuột (vòng lặp sự kiện của libuv chạy trên epoll). Luật GUI "đừng bao giờ chặn trong trình xử lý" chính là luật Node "đừng bao giờ chặn event loop" — một lần parse JSON đồng bộ chậm hay một vòng <code>while</code> trong trình xử lý request làm đứng mọi request khác.</div>`],
      [48, 'Graphical User Interfaces (1)',
        `<p class="y-chinh">🎯 Figure 5-35: a sample window located at (200, 100) on an XGA display (1024 × 768, corners (0, 0) and (1023, 767)) — with title bar, menu bar, tool bar, client area, scroll bar and its thumb.</p>
<p>A GUI has four essential elements, summarised as <strong>WIMP</strong>: Windows, Icons, Menus and a Pointing device. The coordinate system puts (0, 0) at the <em>upper-left</em> corner, x growing to the right and y growing <em>downward</em> — unlike school mathematics. The <strong>client area</strong> is the part the program draws in; the title bar, borders and scroll bars are drawn by the system (on X, by the window manager). The GUI software is mostly in user space (X) or partly in the kernel (old Windows versions put the graphics subsystem into the kernel for speed, a source of crashes). The mouse reports movement as deltas (<strong>mickeys</strong>) plus button states; software turns them into a pointer position.</p>
<p>➕ Today's screens have more pixels and a scale factor: a 2560 × 1600 laptop panel at 200% scaling presents a "logical" 1280 × 800 to programs, so a window at (200, 100) in logical units is at (400, 200) in physical pixels. The origin and the downward y axis have not changed — HTML canvas, Android and Java Swing use the same convention.</p>
<p class="meo">🧠 Screen coordinates: origin top-left, y goes DOWN. A window position is the position of its top-left corner.</p>`,
        `<p class="y-chinh">🎯 Hình 5-35: một cửa sổ mẫu đặt ở (200, 100) trên màn hình XGA (1024 × 768, các góc (0, 0) và (1023, 767)) — có thanh tiêu đề, thanh menu, thanh công cụ, vùng client, thanh cuộn và con trượt (thumb) của nó.</p>
<p>GUI có bốn thành phần chính, gọi tắt <strong>WIMP</strong>: Windows (cửa sổ), Icons (biểu tượng), Menus (menu) và một Pointing device (thiết bị trỏ). Hệ toạ độ đặt (0, 0) ở góc <em>trên bên trái</em>, x tăng sang phải và y tăng <em>xuống dưới</em> — khác toán ở trường. <strong>Vùng client (client area)</strong> là phần chương trình tự vẽ; thanh tiêu đề, viền và thanh cuộn do hệ thống vẽ (trên X là do trình quản lý cửa sổ). Phần mềm GUI phần lớn ở không gian người dùng (X) hoặc một phần trong nhân (các bản Windows cũ đặt hệ thống đồ hoạ vào nhân cho nhanh, một nguồn gây sập máy). Chuột báo chuyển động dưới dạng độ dời (<strong>mickey</strong>) cộng trạng thái nút; phần mềm đổi chúng thành vị trí con trỏ.</p>
<p>➕ Màn hình ngày nay nhiều điểm ảnh hơn và có hệ số phóng: màn laptop 2560 × 1600 phóng 200% khai với chương trình là màn "logic" 1280 × 800, nên cửa sổ ở (200, 100) đơn vị logic nằm ở (400, 200) điểm ảnh vật lý. Gốc toạ độ và trục y đi xuống thì không đổi — canvas của HTML, Android và Java Swing đều dùng cùng quy ước.</p>
<p class="meo">🧠 Toạ độ màn hình: gốc ở góc trên trái, y đi XUỐNG. Vị trí cửa sổ là vị trí góc trên trái của nó.</p>`],
      [49, 'Graphical User Interfaces (2)',
        `<p class="y-chinh">🎯 Figure 5-36 (first half): the skeleton of a Windows main program — <code>WinMain</code> declares a <code>WNDCLASS</code>, a <code>MSG</code> and an <code>HWND</code>; fills in the class (<code>lpfnWndProc = WndProc</code> — which procedure to call, the class name, icon, cursor); <code>RegisterClass</code> tells Windows about it; <code>CreateWindow</code> allocates the window; <code>ShowWindow</code> displays it; <code>UpdateWindow</code> tells it to paint itself; then <code>while (GetMessage(&amp;msg, NULL, 0, 0)) { TranslateMessage(&amp;msg); …</code></p>
<p>The structure matches X's (slide 46) but with an important twist: the program registers a <strong>window procedure</strong> (<code>WndProc</code>) as a <strong>callback</strong>. The main loop only fetches messages from the program's queue (<code>GetMessage</code>), lets <code>TranslateMessage</code> turn raw key messages into character messages, and calls <code>DispatchMessage</code>, which in turn calls the right window procedure. The OS calls the program, not the other way around — a pattern that recurs everywhere (Java listeners, JavaScript event handlers, Spring <code>@EventListener</code>).</p>
<p>➕ The class of a window (its procedure, icon, cursor) is registered once and shared by all windows of that class — one class, many objects, the same idea as a class in Java.</p>
<p class="meo">🧠 X: you write the <code>switch</code> in the main loop. Windows: the loop dispatches, and the <code>switch</code> lives in the callback <code>WndProc</code>.</p>`,
        `<p class="y-chinh">🎯 Hình 5-36 (nửa đầu): khung của chương trình chính trên Windows — <code>WinMain</code> khai báo một <code>WNDCLASS</code>, một <code>MSG</code> và một <code>HWND</code>; điền lớp cửa sổ (<code>lpfnWndProc = WndProc</code> — gọi thủ tục nào, tên lớp, biểu tượng, con trỏ chuột); <code>RegisterClass</code> báo nó cho Windows; <code>CreateWindow</code> cấp phát cửa sổ; <code>ShowWindow</code> hiện nó; <code>UpdateWindow</code> bảo nó tự vẽ; rồi <code>while (GetMessage(&amp;msg, NULL, 0, 0)) { TranslateMessage(&amp;msg); …</code></p>
<p>Cấu trúc giống của X (slide 46) nhưng có một khác biệt quan trọng: chương trình đăng ký một <strong>thủ tục cửa sổ (window procedure)</strong> (<code>WndProc</code>) làm <strong>hàm gọi lại (callback)</strong>. Vòng lặp chính chỉ lấy thông điệp từ hàng đợi của chương trình (<code>GetMessage</code>), để <code>TranslateMessage</code> đổi thông điệp phím thô thành thông điệp ký tự, rồi gọi <code>DispatchMessage</code>, hàm này lại gọi đúng thủ tục cửa sổ. HĐH gọi chương trình, chứ không phải ngược lại — một mẫu lặp lại khắp nơi (listener của Java, trình xử lý sự kiện của JavaScript, <code>@EventListener</code> của Spring).</p>
<p>➕ Lớp của một cửa sổ (thủ tục, biểu tượng, con trỏ) được đăng ký một lần và dùng chung cho mọi cửa sổ thuộc lớp đó — một lớp, nhiều đối tượng, đúng ý tưởng lớp trong Java.</p>
<p class="meo">🧠 X: bạn tự viết <code>switch</code> trong vòng lặp chính. Windows: vòng lặp chỉ phân phát, còn <code>switch</code> nằm trong hàm gọi lại <code>WndProc</code>.</p>`],
      [50, 'Graphical User Interfaces (3)',
        `<p class="y-chinh">🎯 Figure 5-36 (second half): the message loop ends with <code>DispatchMessage(&amp;msg)</code> — "send msg to the appropriate procedure" — and <code>return(msg.wParam)</code>; the callback <code>long CALLBACK WndProc(HWND hwnd, UINT message, UINT wParam, long lParam)</code> switches on the message: <code>WM_CREATE</code> (create window), <code>WM_PAINT</code> (repaint contents), <code>WM_DESTROY</code> (destroy window), and passes everything else to <code>DefWindowProc</code>, the default.</p>
<p><code>GetMessage</code> returns 0 only for <code>WM_QUIT</code>, which ends the loop and the program. <code>wParam</code> and <code>lParam</code> carry message-specific data (for a mouse click, the coordinates packed into <code>lParam</code>). <code>DefWindowProc</code> is essential: a window must react to hundreds of messages (resize, move, minimise…), and the default procedure does the standard thing for all those the program does not care about. <code>WM_PAINT</code> plays the role of X's Expose.</p>
<p>➕ Modern Windows apps rarely write this loop by hand — WinUI, WPF, .NET MAUI, Electron (and therefore VS Code) hide it in a framework — but underneath every Windows window there is still a message queue and a window procedure, as Microsoft's documentation of the Win32 API describes.</p>
<p class="pitfall">⚠️ Match the pairs: <code>WM_PAINT</code> ↔ Expose (repaint), <code>GetMessage</code> ↔ <code>XNextEvent</code> (wait for the next event), <code>DefWindowProc</code> ↔ "default processing". An exam question on "what does DispatchMessage do?" — it calls the window procedure for the message.</p>`,
        `<p class="y-chinh">🎯 Hình 5-36 (nửa sau): vòng lặp thông điệp kết thúc bằng <code>DispatchMessage(&amp;msg)</code> — "gửi msg tới đúng thủ tục" — và <code>return(msg.wParam)</code>; hàm gọi lại <code>long CALLBACK WndProc(HWND hwnd, UINT message, UINT wParam, long lParam)</code> rẽ nhánh theo thông điệp: <code>WM_CREATE</code> (tạo cửa sổ), <code>WM_PAINT</code> (vẽ lại nội dung), <code>WM_DESTROY</code> (huỷ cửa sổ), và chuyển mọi thứ khác cho <code>DefWindowProc</code>, thủ tục mặc định.</p>
<p><code>GetMessage</code> chỉ trả về 0 khi gặp <code>WM_QUIT</code>, thứ kết thúc vòng lặp và chương trình. <code>wParam</code> và <code>lParam</code> mang dữ liệu riêng của từng thông điệp (với cú bấm chuột, toạ độ được gói trong <code>lParam</code>). <code>DefWindowProc</code> là thiết yếu: một cửa sổ phải phản ứng với hàng trăm thông điệp (đổi cỡ, di chuyển, thu nhỏ…), và thủ tục mặc định làm điều chuẩn mực cho tất cả những thông điệp chương trình không quan tâm. <code>WM_PAINT</code> đóng vai Expose của X.</p>
<p>➕ Ứng dụng Windows hiện đại hiếm khi tự viết vòng lặp này — WinUI, WPF, .NET MAUI, Electron (và vì thế cả VS Code) giấu nó trong framework — nhưng bên dưới mọi cửa sổ Windows vẫn là một hàng đợi thông điệp và một thủ tục cửa sổ, như tài liệu Win32 API của Microsoft mô tả.</p>
<p class="pitfall">⚠️ Ghép cặp: <code>WM_PAINT</code> ↔ Expose (vẽ lại), <code>GetMessage</code> ↔ <code>XNextEvent</code> (chờ sự kiện kế), <code>DefWindowProc</code> ↔ "xử lý mặc định". Câu hỏi "DispatchMessage làm gì?" — nó gọi thủ tục cửa sổ ứng với thông điệp đó.</p>`],
      [51, 'Graphical User Interfaces (4)',
        `<p class="y-chinh">🎯 Figure 5-37: an example rectangle drawn with <code>Rectangle</code> on a grid of pixels — columns 2–6, rows 1–4: a dark outline (drawn with the current <strong>pen</strong>) and a light interior (filled with the current <strong>brush</strong>). Each box represents one pixel.</p>
<p>GDI (Windows' Graphics Device Interface) draws through a <strong>device context</strong> (<code>hdc</code>) — the Windows counterpart of X's graphic context — which knows the current pen (line colour and width), brush (fill), font and the target (window, printer, bitmap). Drawing calls such as <code>MoveToEx</code>/<code>LineTo</code>, <code>Rectangle</code>, <code>Ellipse</code>, <code>TextOut</code> take logical coordinates; the device context maps them to the device. Programs draw on any device the same way — device independence again (slide 10).</p>
<p>➕ A precise detail the figure hides: Microsoft's documentation of <code>Rectangle(hdc, left, top, right, bottom)</code> says "the rectangle that is drawn excludes the bottom and right edges". So the 5 × 4 block of the figure is <code>Rectangle(hdc, 2, 1, 7, 5)</code>:</p>
<pre><code class="language-javascript">// Figure 5-37 as pixels. GDI's Rectangle(left, top, right, bottom) EXCLUDES the right and bottom edges (Microsoft Learn)
function rectangle(w, h, left, top, right, bottom) {
  const g = Array.from({ length: h }, () =&gt; Array(w).fill('.'));
  for (let y = top; y &lt; bottom; y++)
    for (let x = left; x &lt; right; x++)
      g[y][x] = (x === left || x === right - 1 || y === top || y === bottom - 1) ? '#' : 'o';   // pen = border, brush = inside
  return g;
}
const g = rectangle(9, 8, 2, 1, 7, 5);                  // gives the 5 x 4 block of the figure
console.log('   ' + [...Array(9).keys()].join(' '));
g.forEach((row, y) =&gt; console.log(&#96;&#36;{y}  &#36;{row.join(' ')}&#96;));</code></pre>
<div class="out">$ node hinh-chu-nhat.js<br>
&nbsp;&nbsp;&nbsp;0 1 2 3 4 5 6 7 8<br>
0 &nbsp;. . . . . . . . .<br>
1 &nbsp;. . # # # # # . .<br>
2 &nbsp;. . # o o o # . .<br>
3 &nbsp;. . # o o o # . .<br>
4 &nbsp;. . # # # # # . .<br>
5 &nbsp;. . . . . . . . .<br>
6 &nbsp;. . . . . . . . .<br>
7 &nbsp;. . . . . . . . .</div>
<p>Columns 2 to 6 and rows 1 to 4 are drawn; column 7 and row 5, the "right" and "bottom" arguments, are not. Half-open ranges like this — start included, end excluded — are everywhere in programming (<code>for (i = 0; i &lt; n; i++)</code>, Java's <code>substring(begin, end)</code>, Python slices).</p>
<p class="meo">🧠 Pen = outline, brush = inside, device context = "where and how to draw".</p>`,
        `<p class="y-chinh">🎯 Hình 5-37: một hình chữ nhật mẫu vẽ bằng <code>Rectangle</code> trên lưới điểm ảnh — cột 2–6, hàng 1–4: viền đậm (vẽ bằng <strong>bút — pen</strong> hiện tại) và ruột nhạt (tô bằng <strong>cọ — brush</strong> hiện tại). Mỗi ô là một điểm ảnh.</p>
<p>GDI (Graphics Device Interface của Windows) vẽ thông qua một <strong>ngữ cảnh thiết bị (device context)</strong> (<code>hdc</code>) — bản Windows của graphic context bên X — biết bút hiện tại (màu và độ dày nét), cọ (màu tô), phông và đích vẽ (cửa sổ, máy in, bitmap). Các lời gọi vẽ như <code>MoveToEx</code>/<code>LineTo</code>, <code>Rectangle</code>, <code>Ellipse</code>, <code>TextOut</code> nhận toạ độ logic; device context ánh xạ chúng sang thiết bị. Chương trình vẽ lên thiết bị nào cũng theo một cách — lại là độc lập thiết bị (slide 10).</p>
<p>➕ Một chi tiết chính xác mà hình không nói: tài liệu của Microsoft về <code>Rectangle(hdc, left, top, right, bottom)</code> ghi "hình chữ nhật được vẽ không gồm cạnh dưới và cạnh phải". Vậy khối 5 × 4 của hình là <code>Rectangle(hdc, 2, 1, 7, 5)</code>:</p>
<pre><code class="language-javascript">// Hình 5-37 dạng điểm ảnh. Rectangle(left, top, right, bottom) của GDI KHÔNG gồm cạnh phải và cạnh dưới (Microsoft Learn)
function rectangle(w, h, left, top, right, bottom) {
  const g = Array.from({ length: h }, () =&gt; Array(w).fill('.'));
  for (let y = top; y &lt; bottom; y++)
    for (let x = left; x &lt; right; x++)
      g[y][x] = (x === left || x === right - 1 || y === top || y === bottom - 1) ? '#' : 'o';   // bút = viền, cọ = ruột
  return g;
}
const g = rectangle(9, 8, 2, 1, 7, 5);                  // cho đúng khối 5 x 4 của hình
console.log('   ' + [...Array(9).keys()].join(' '));
g.forEach((row, y) =&gt; console.log(&#96;&#36;{y}  &#36;{row.join(' ')}&#96;));</code></pre>
<div class="out">$ node hinh-chu-nhat.js<br>
&nbsp;&nbsp;&nbsp;0 1 2 3 4 5 6 7 8<br>
0 &nbsp;. . . . . . . . .<br>
1 &nbsp;. . # # # # # . .<br>
2 &nbsp;. . # o o o # . .<br>
3 &nbsp;. . # o o o # . .<br>
4 &nbsp;. . # # # # # . .<br>
5 &nbsp;. . . . . . . . .<br>
6 &nbsp;. . . . . . . . .<br>
7 &nbsp;. . . . . . . . .</div>
<p>Cột 2 tới 6 và hàng 1 tới 4 được vẽ; cột 7 và hàng 5, chính là tham số "right" và "bottom", thì không. Khoảng nửa mở như vậy — gồm đầu, không gồm cuối — có mặt khắp nơi trong lập trình (<code>for (i = 0; i &lt; n; i++)</code>, <code>substring(begin, end)</code> của Java, lát cắt của Python).</p>
<p class="meo">🧠 Bút = viền, cọ = ruột, device context = "vẽ ở đâu và vẽ thế nào".</p>`],
      [52, 'Bitmaps',
        `<p class="y-chinh">🎯 Figure 5-38: copying bitmaps using <strong>BitBlt</strong> — (a) before: window 1 shows the letters ABC, window 2 is empty; (b) after: the 9 × 9 pixel block containing "A" has been copied from window 1 into window 2.</p>
<p>Drawing with lines and rectangles (vector graphics) is not enough for photographs or scanned images; for those, a <strong>bitmap</strong> stores the colour of every pixel. <code>BitBlt</code> ("bit block transfer") copies a rectangle of pixels from one device context to another — from a memory bitmap to a window, or between windows — and is the workhorse of scrolling, moving windows and drawing icons. Bitmaps are device-dependent (their size in pixels is fixed), so scaling them up shows blocky pixels — the reason fonts and icons moved to vector formats (slide 53). Windows added <strong>DIB</strong>s (device-independent bitmaps) carrying their own colour table so they can be shown on any device; the BMP file format is a DIB.</p>
<p>➕ BitBlt in a few lines — a 5 × 5 "A" copied from one bitmap into another:</p>
<pre><code class="language-javascript">// BitBlt (Figure 5-38): copy a rectangle of pixels from one bitmap into another
const tao = (w, h, c) =&gt; Array.from({ length: h }, () =&gt; Array(w).fill(c));
const cua1 = tao(15, 5, '.'), cua2 = tao(7, 5, '#');
const A = ['.###.', '#...#', '#####', '#...#', '#...#'];   // the letter A, 5 x 5 pixels
A.forEach((r, y) =&gt; [...r].forEach((p, x) =&gt; { cua1[y][x] = p; }));
function bitBlt(dst, dx, dy, w, h, src, sx, sy) {         // BitBlt(hdcDst, dx, dy, w, h, hdcSrc, sx, sy, SRCCOPY)
  for (let y = 0; y &lt; h; y++) for (let x = 0; x &lt; w; x++) dst[dy + y][dx + x] = src[sy + y][sx + x];
}
const inRa = (ten, b) =&gt; { console.log(ten); b.forEach((r) =&gt; console.log('  ' + r.join(''))); };
inRa('window 2 before', cua2);
bitBlt(cua2, 1, 0, 5, 5, cua1, 0, 0);
inRa('window 2 after BitBlt(window2, 1, 0, 5, 5, window1, 0, 0)', cua2);</code></pre>
<div class="out">$ node bitblt.js<br>
window 2 before<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
window 2 after BitBlt(window2, 1, 0, 5, 5, window1, 0, 0)<br>
&nbsp;&nbsp;#.###.#<br>
&nbsp;&nbsp;##...##<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;##...##<br>
&nbsp;&nbsp;##...##</div>
<p>The destination rectangle (columns 1–5 of window 2) was overwritten pixel by pixel with the source rectangle (columns 0–4 of window 1). Real BitBlt also takes a <strong>raster operation</strong> code: <code>SRCCOPY</code> copies, others combine source and destination with AND, OR, XOR — XOR was the classic trick for drawing and erasing a cursor.</p>
<p class="pitfall">⚠️ FE7#40: in bitmap image processing, each bit (each element) represents a single pixel's colour.</p>`,
        `<p class="y-chinh">🎯 Hình 5-38: chép bitmap bằng <strong>BitBlt</strong> — (a) trước: cửa sổ 1 hiện các chữ ABC, cửa sổ 2 trống; (b) sau: khối 9 × 9 điểm ảnh chứa chữ "A" đã được chép từ cửa sổ 1 sang cửa sổ 2.</p>
<p>Vẽ bằng đường thẳng và hình chữ nhật (đồ hoạ vector) không đủ cho ảnh chụp hay ảnh quét; với chúng, một <strong>bitmap</strong> lưu màu của từng điểm ảnh. <code>BitBlt</code> ("bit block transfer" — chuyển một khối bit) chép một hình chữ nhật điểm ảnh từ device context này sang device context khác — từ bitmap trong bộ nhớ ra cửa sổ, hoặc giữa các cửa sổ — và là con ngựa thồ của việc cuộn, di chuyển cửa sổ và vẽ biểu tượng. Bitmap phụ thuộc thiết bị (kích thước tính bằng điểm ảnh là cố định), nên phóng to sẽ thấy điểm ảnh vỡ thành ô — lý do phông chữ và biểu tượng chuyển sang dạng vector (slide 53). Windows bổ sung <strong>DIB</strong> (device-independent bitmap — bitmap độc lập thiết bị) mang bảng màu riêng để hiện được trên mọi thiết bị; định dạng tệp BMP chính là một DIB.</p>
<p>➕ BitBlt trong vài dòng — một chữ "A" 5 × 5 được chép từ bitmap này sang bitmap khác:</p>
<pre><code class="language-javascript">// BitBlt (Hình 5-38): chép một hình chữ nhật điểm ảnh từ bitmap này sang bitmap khác
const tao = (w, h, c) =&gt; Array.from({ length: h }, () =&gt; Array(w).fill(c));
const cua1 = tao(15, 5, '.'), cua2 = tao(7, 5, '#');
const A = ['.###.', '#...#', '#####', '#...#', '#...#'];   // chữ A, 5 x 5 điểm ảnh
A.forEach((r, y) =&gt; [...r].forEach((p, x) =&gt; { cua1[y][x] = p; }));
function bitBlt(dst, dx, dy, w, h, src, sx, sy) {         // sao chép nguyên khối
  for (let y = 0; y &lt; h; y++) for (let x = 0; x &lt; w; x++) dst[dy + y][dx + x] = src[sy + y][sx + x];
}
const inRa = (ten, b) =&gt; { console.log(ten); b.forEach((r) =&gt; console.log('  ' + r.join(''))); };
inRa('window 2 before', cua2);
bitBlt(cua2, 1, 0, 5, 5, cua1, 0, 0);
inRa('window 2 after BitBlt(window2, 1, 0, 5, 5, window1, 0, 0)', cua2);</code></pre>
<div class="out">$ node bitblt.js<br>
window 2 before<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;#######<br>
window 2 after BitBlt(window2, 1, 0, 5, 5, window1, 0, 0)<br>
&nbsp;&nbsp;#.###.#<br>
&nbsp;&nbsp;##...##<br>
&nbsp;&nbsp;#######<br>
&nbsp;&nbsp;##...##<br>
&nbsp;&nbsp;##...##</div>
<p>Hình chữ nhật đích (cột 1–5 của cửa sổ 2) bị ghi đè từng điểm ảnh bằng hình chữ nhật nguồn (cột 0–4 của cửa sổ 1). BitBlt thật còn nhận một mã <strong>phép toán raster</strong>: <code>SRCCOPY</code> thì chép, các mã khác kết hợp nguồn với đích bằng AND, OR, XOR — XOR là mánh kinh điển để vẽ rồi xoá con trỏ.</p>
<p class="pitfall">⚠️ FE7#40: trong xử lý ảnh bitmap, mỗi bit (mỗi phần tử) biểu diễn màu của một điểm ảnh.</p>`],
      [53, 'Fonts',
        `<p class="y-chinh">🎯 Figure 5-39: examples of character <strong>outlines</strong> at different point sizes — the same "abcdefgh" at 20, 53 and 81 points, all generated from one description of each letter.</p>
<p>Early systems stored fonts as bitmaps, one set per size — an 8-point and a 10-point font were separate files, and sizes in between did not exist. <strong>TrueType</strong> (Apple and Microsoft, early 1990s) describes each character as an outline made of straight lines and curves; to show it at any size, the outline is scaled and then <strong>rasterised</strong> (filled into pixels), with "hints" that keep small sizes readable. One point is 1/72 inch, so the pixel size depends on the screen's resolution. Rasterising every character is expensive, so systems cache the bitmaps of the sizes in use.</p>
<p>➕ Since then: <strong>OpenType</strong> (Microsoft and Adobe, 1996) merged TrueType and PostScript outlines and is today's standard (the <code>.otf</code>/<code>.ttf</code> files), "variable fonts" (OpenType 1.8, 2016) put a whole family — thin to black — in one file, and web pages load fonts as <strong>WOFF2</strong>. Anti-aliasing and sub-pixel rendering (ClearType on Windows, FreeType on Linux) use grey pixels at the edges so outlines look smooth on low-resolution screens.</p>
<p class="meo">🧠 Bitmap font = one picture per size; outline font = one recipe for every size. Every font you meet today is an outline font.</p>`,
        `<p class="y-chinh">🎯 Hình 5-39: ví dụ <strong>đường viền (outline)</strong> ký tự ở các cỡ chữ khác nhau — cùng "abcdefgh" ở cỡ 20, 53 và 81 point, đều sinh ra từ một bản mô tả duy nhất cho mỗi chữ.</p>
<p>Hệ thống đời đầu lưu phông dưới dạng bitmap, mỗi cỡ một bộ — phông 8 point và 10 point là hai tệp khác nhau, còn các cỡ ở giữa thì không tồn tại. <strong>TrueType</strong> (Apple và Microsoft, đầu thập niên 1990) mô tả mỗi ký tự bằng một đường viền gồm đoạn thẳng và đường cong; để hiện ở cỡ bất kỳ, đường viền được co giãn rồi <strong>raster hoá (rasterise)</strong> (tô thành điểm ảnh), kèm các "gợi ý (hint)" để cỡ nhỏ vẫn dễ đọc. Một point bằng 1/72 inch, nên kích thước tính bằng điểm ảnh tuỳ độ phân giải màn hình. Raster hoá từng ký tự tốn kém, nên hệ thống lưu đệm bitmap của các cỡ đang dùng.</p>
<p>➕ Từ đó tới nay: <strong>OpenType</strong> (Microsoft và Adobe, 1996) gộp đường viền TrueType và PostScript, là chuẩn hiện nay (các tệp <code>.otf</code>/<code>.ttf</code>); "phông biến thiên (variable font)" (OpenType 1.8, 2016) nhét cả một họ phông — từ mảnh tới đậm nhất — vào một tệp; trang web nạp phông dưới dạng <strong>WOFF2</strong>. Khử răng cưa và kết xuất điểm ảnh con (ClearType trên Windows, FreeType trên Linux) dùng điểm ảnh xám ở mép để đường viền trông mượt trên màn hình độ phân giải thấp.</p>
<p class="meo">🧠 Phông bitmap = mỗi cỡ một bức ảnh; phông đường viền = một công thức cho mọi cỡ. Phông nào bạn gặp hôm nay cũng là phông đường viền.</p>`],
      [54, 'Hardware Issues',
        `<p class="y-chinh">🎯 Figure 5-40: power consumption of the parts of a notebook computer, from two old studies — Li et al. (1994): display 68%, CPU 12%, hard disk 20%, memory 0.5%; Lorch and Smith (1998): display 39%, CPU 18%, hard disk 12%, modem 6%, sound 2%, memory 1%, other 22%.</p>
<p>The figure starts section 5.8, <strong>power management</strong>: battery-powered computers must stretch every joule, and desktops and data centres pay for electricity and cooling. The main hardware idea is that devices have several states — <strong>on</strong>, <strong>sleep</strong>, <strong>hibernate</strong>, <strong>off</strong> — with lower power but a longer wake-up time in the deeper states, and the OS decides when to switch. The figure tells the OS where to look first: the display, then the CPU and the disk.</p>
<p>➕ The numbers are 30 years old, and the slide should be read as "the screen is usually the biggest consumer", not as data: hard disks have been replaced by SSDs, modems have disappeared, and today a laptop CPU or GPU under load can easily outspend the screen. Modern laptops are designed around deep idle states (Intel/AMD C-states, ARM big.LITTLE cores, "modern standby"). The standard that lets the OS control all of this is ACPI on PCs; on Linux, <code>powertop</code> shows which device or process is draining the battery.</p>
<p class="meo">🧠 Power states trade energy for latency: the deeper the sleep, the cheaper it is and the longer it takes to wake up.</p>`,
        `<p class="y-chinh">🎯 Hình 5-40: mức tiêu thụ điện của các bộ phận trong máy tính xách tay, theo hai nghiên cứu cũ — Li và cộng sự (1994): màn hình 68%, CPU 12%, đĩa cứng 20%, bộ nhớ 0,5%; Lorch và Smith (1998): màn hình 39%, CPU 18%, đĩa cứng 12%, modem 6%, âm thanh 2%, bộ nhớ 1%, khác 22%.</p>
<p>Hình này mở mục 5.8, <strong>quản lý năng lượng (power management)</strong>: máy chạy pin phải kéo dài từng jun, còn máy bàn và trung tâm dữ liệu phải trả tiền điện và tiền làm mát. Ý tưởng phần cứng chính là thiết bị có nhiều trạng thái — <strong>bật (on)</strong>, <strong>ngủ (sleep)</strong>, <strong>ngủ đông (hibernate)</strong>, <strong>tắt (off)</strong> — trạng thái càng sâu càng tốn ít điện nhưng đánh thức càng lâu, và HĐH quyết định lúc nào chuyển. Hình cho HĐH biết nên nhìn vào đâu trước: màn hình, rồi CPU và đĩa.</p>
<p>➕ Các con số đã 30 năm tuổi, và nên đọc slide như "màn hình thường là thứ ngốn điện nhất", không phải như dữ liệu: đĩa cứng đã được thay bằng SSD, modem đã biến mất, và ngày nay CPU hay GPU của laptop khi chạy nặng dễ dàng tiêu nhiều hơn màn hình. Laptop hiện đại được thiết kế quanh các trạng thái rảnh sâu (C-state của Intel/AMD, lõi big.LITTLE của ARM, "modern standby"). Chuẩn cho phép HĐH điều khiển tất cả những thứ đó trên PC là ACPI; trên Linux, <code>powertop</code> cho biết thiết bị hay tiến trình nào đang rút pin.</p>
<p class="meo">🧠 Trạng thái nguồn đổi năng lượng lấy độ trễ: ngủ càng sâu càng rẻ, và đánh thức càng lâu.</p>`],
      [55, 'Operating System Issues The Display',
        `<p class="y-chinh">🎯 Figure 5-41: using <strong>zones for backlighting</strong> the display — (a) when window 2 is selected it is not moved, and the zones it touches stay lit; (b) when window 1 is selected, it is moved to fit inside fewer zones, so fewer zones need to be illuminated.</p>
<p>The display was the biggest consumer (slide 54), and in a backlit LCD most of its power goes into the backlight. The OS's simplest weapon is to turn the display off after some minutes of inactivity — users choose the timeout. The book's more ambitious idea: split the screen into independently lit zones and arrange windows so that only the zones under the active window need light. It shows the general principle of power management: the OS knows what the user is doing, the hardware does not, so cooperation saves energy.</p>
<p>➕ Today the idea came true in a different form: <strong>OLED</strong> screens have no backlight at all — each pixel emits its own light, so black pixels cost nothing. That is why phones offer dark mode partly to save battery, and why laptop and TV "local dimming" (mini-LED with hundreds or thousands of zones) is exactly Figure 5-41 done in hardware.</p>
<p class="meo">🧠 On a backlit LCD, a black pixel costs as much as a white one (the backlight is on anyway); on OLED, black is almost free.</p>`,
        `<p class="y-chinh">🎯 Hình 5-41: dùng <strong>các vùng chiếu sáng nền (zones for backlighting)</strong> cho màn hình — (a) khi cửa sổ 2 được chọn thì nó không bị dời, và các vùng nó chạm vào vẫn sáng; (b) khi cửa sổ 1 được chọn, nó được dời sao cho nằm gọn trong ít vùng hơn, nên ít vùng cần chiếu sáng hơn.</p>
<p>Màn hình là thứ ngốn điện nhất (slide 54), và với màn LCD có đèn nền, phần lớn điện năng đi vào đèn nền. Vũ khí đơn giản nhất của HĐH là tắt màn hình sau vài phút không hoạt động — người dùng tự chọn thời gian chờ. Ý tưởng tham vọng hơn của sách: chia màn hình thành các vùng chiếu sáng độc lập và sắp các cửa sổ sao cho chỉ những vùng dưới cửa sổ đang dùng mới cần sáng. Nó cho thấy nguyên lý chung của quản lý năng lượng: HĐH biết người dùng đang làm gì, phần cứng thì không, nên phối hợp với nhau sẽ tiết kiệm được năng lượng.</p>
<p>➕ Ngày nay ý tưởng thành hiện thực dưới dạng khác: màn hình <strong>OLED</strong> hoàn toàn không có đèn nền — mỗi điểm ảnh tự phát sáng, nên điểm ảnh đen chẳng tốn gì. Đó là lý do điện thoại có chế độ tối một phần để tiết kiệm pin, và "local dimming" (làm tối cục bộ) trên laptop và TV (mini-LED với hàng trăm, hàng nghìn vùng) chính là Hình 5-41 làm bằng phần cứng.</p>
<p class="meo">🧠 Trên LCD có đèn nền, điểm ảnh đen tốn điện như điểm ảnh trắng (đèn nền vẫn bật); trên OLED, màu đen gần như miễn phí.</p>`],
      [56, 'Operating System Issues The CPU',
        `<p class="y-chinh">🎯 Figure 5-42: (a) running at full clock speed — power 1.00 for time T/2; (b) cutting the voltage by two cuts the clock speed by two and the power consumption by four — power 0.25 for the whole time T.</p>
<p>A CPU's power can be cut by putting it to sleep, but also by slowing it down. The book's argument: since the power of CMOS logic grows with the square of the voltage, and the maximum clock speed is roughly proportional to the voltage, running a job at half speed and half voltage takes twice as long but uses much less energy. If the program can wait (the user will not notice a slower spell-checker, a video only needs enough speed to decode frames on time), the OS should lower the speed rather than run fast and idle. This is <strong>dynamic voltage and frequency scaling (DVFS)</strong>.</p>
<p>➕ The slide's arithmetic is simplified. The standard model of dynamic power is P = C × V² × f (C = capacitance switched, V = voltage, f = clock frequency). Halving BOTH V and f:</p>
<pre><code class="language-javascript">// Figure 5-42: run a job at full speed, or at half voltage and half clock speed
// Dynamic power of CMOS logic: P = C x V^2 x f (C = switched capacitance, V = voltage, f = clock frequency)
const P = (V, f) =&gt; V * V * f;                       // C = 1 (relative units)
const job = 1;                                       // amount of work, in "seconds at full speed"
for (const [ten, V, f] of [['full speed', 1, 1], ['half V, half f', 0.5, 0.5]]) {
  const t = job / f, p = P(V, f), e = p * t;
  console.log(&#96;&#36;{ten.padEnd(15)} power &#36;{p.toFixed(3)}  time &#36;{t.toFixed(1)}  energy &#36;{e.toFixed(3)}&#96;);
}
console.log(&#96;the slide's simpler claim (power ~ V^2 only): &#36;{P(0.5, 1).toFixed(2)} of full power&#96;);</code></pre>
<div class="out">$ node nang-luong.js<br>
full speed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;power 1.000 &nbsp;time 1.0 &nbsp;energy 1.000<br>
half V, half f &nbsp;power 0.125 &nbsp;time 2.0 &nbsp;energy 0.250<br>
the slide's simpler claim (power ~ V^2 only): 0.25 of full power</div>
<p>Power drops to 1/8, the job takes twice as long, so the energy for the same job drops to 1/4 — even better than the figure, which counts only the V² factor (power 1/4, energy 1/2). Either way, the conclusion holds: for work that can wait, slower is greener. On Linux this is the <strong>cpufreq</strong> subsystem with its <em>governors</em> (<code>performance</code>, <code>powersave</code>, <code>schedutil</code>); on servers with heavy load, administrators often pick <code>performance</code> because the latency of ramping up costs more than the energy saved.</p>
<p class="pitfall">⚠️ Read the slide's claim as "power ∝ V²" — halve the voltage, quarter the power. If an exam question follows the figure, answer with the figure; if it gives P = CV²f, include the frequency.</p>`,
        `<p class="y-chinh">🎯 Hình 5-42: (a) chạy ở xung nhịp tối đa — công suất 1,00 trong thời gian T/2; (b) giảm điện áp một nửa thì xung nhịp giảm một nửa và công suất tiêu thụ giảm bốn lần — công suất 0,25 trong cả khoảng T.</p>
<p>Có thể cắt điện năng của CPU bằng cách cho nó ngủ, nhưng cũng có thể bằng cách cho nó chạy chậm lại. Lập luận của sách: vì công suất của mạch CMOS tăng theo bình phương điện áp, và xung nhịp tối đa gần như tỉ lệ thuận với điện áp, chạy một việc ở nửa tốc độ và nửa điện áp mất gấp đôi thời gian nhưng tốn ít năng lượng hơn nhiều. Nếu chương trình chờ được (người dùng không nhận ra trình soát chính tả chậm hơn, video chỉ cần đủ nhanh để giải mã khung hình đúng hạn), HĐH nên hạ tốc độ thay vì chạy nhanh rồi ngồi không. Đó là <strong>điều chỉnh điện áp và tần số động (dynamic voltage and frequency scaling — DVFS)</strong>.</p>
<p>➕ Phép tính của slide đã được đơn giản hoá. Mô hình chuẩn của công suất động là P = C × V² × f (C = điện dung được chuyển mạch, V = điện áp, f = tần số xung nhịp). Giảm một nửa CẢ V và f:</p>
<pre><code class="language-javascript">// Hình 5-42: chạy một việc ở tốc độ tối đa, hoặc ở nửa điện áp và nửa xung nhịp
// Công suất động của mạch CMOS: P = C x V^2 x f
const P = (V, f) =&gt; V * V * f;                       // C = 1 (đơn vị tương đối)
const job = 1;                                       // lượng việc, tính bằng "giây ở tốc độ tối đa"
for (const [ten, V, f] of [['full speed', 1, 1], ['half V, half f', 0.5, 0.5]]) {
  const t = job / f, p = P(V, f), e = p * t;
  console.log(&#96;&#36;{ten.padEnd(15)} power &#36;{p.toFixed(3)}  time &#36;{t.toFixed(1)}  energy &#36;{e.toFixed(3)}&#96;);
}
console.log(&#96;the slide's simpler claim (power ~ V^2 only): &#36;{P(0.5, 1).toFixed(2)} of full power&#96;);</code></pre>
<div class="out">$ node nang-luong.js<br>
full speed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;power 1.000 &nbsp;time 1.0 &nbsp;energy 1.000<br>
half V, half f &nbsp;power 0.125 &nbsp;time 2.0 &nbsp;energy 0.250<br>
the slide's simpler claim (power ~ V^2 only): 0.25 of full power</div>
<p>Công suất còn 1/8, việc kéo dài gấp đôi, nên năng lượng cho cùng một việc còn 1/4 — còn tốt hơn hình, vốn chỉ tính thừa số V² (công suất 1/4, năng lượng 1/2). Đằng nào thì kết luận vẫn đúng: với việc chờ được, chậm hơn là xanh hơn. Trên Linux, đó là hệ thống con <strong>cpufreq</strong> với các <em>governor</em> (<code>performance</code>, <code>powersave</code>, <code>schedutil</code>); trên server tải nặng, quản trị viên hay chọn <code>performance</code> vì độ trễ của việc tăng tốc trở lại đắt hơn phần năng lượng tiết kiệm được.</p>
<p class="pitfall">⚠️ Đọc khẳng định của slide là "công suất ∝ V²" — giảm nửa điện áp, công suất còn một phần tư. Nếu câu thi đi theo hình thì trả lời theo hình; nếu đề cho P = CV²f thì phải tính cả tần số.</p>`],
      [57, 'End',
        `<p class="y-chinh">🎯 End of Chapter 5 — you have followed I/O from the device's registers to the library in your program, and met the devices every OS must manage: disks, clocks, keyboard, screen, battery.</p>
<p>Check yourself before moving on: can you classify a device as block or character (slide 2), explain memory-mapped I/O and why it must not be cached (slides 4–5), list the four DMA steps and its bus modes (slide 6), state the four properties of a precise interrupt (slide 8), compare programmed, interrupt-driven and DMA I/O (slides 12–14), put the four software layers in order and assign jobs to them (slides 15–23), compute FCFS, SSF and elevator head movement (slides 31–33), compute cylinder skew (slide 29) and a clock's holding register (slide 37), and explain stable writes (slides 35–36)? Then do the 🧪 practice lesson 5.C and the Chapter 5 quiz.</p>
<p class="meo">🧠 Next: Chapter 6 — deadlock. Its classic example is two processes each holding one dedicated device (a printer, a scanner) and waiting for the other's — the "dedicated devices" of slide 19.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 5 — bạn đã lần theo I/O từ thanh ghi của thiết bị tới thư viện trong chương trình của mình, và gặp những thiết bị mà HĐH nào cũng phải quản lý: đĩa, đồng hồ, bàn phím, màn hình, pin.</p>
<p>Tự kiểm trước khi đi tiếp: bạn có phân loại được thiết bị khối hay ký tự (slide 2), giải thích được memory-mapped I/O và vì sao không được cache nó (slide 4–5), kể được bốn bước DMA và các chế độ bus (slide 6), nêu được bốn tính chất của ngắt chính xác (slide 8), so sánh được I/O lập trình, hướng ngắt và DMA (slide 12–14), xếp đúng thứ tự bốn tầng phần mềm và gán việc cho chúng (slide 15–23), tính được quãng đầu từ của FCFS, SSF và thang máy (slide 31–33), tính được độ lệch trụ (slide 29) và thanh ghi giữ của đồng hồ (slide 37), và giải thích được ghi ổn định (slide 35–36) chưa? Rồi làm bài 🧪 thực hành 5.C và quiz Chương 5.</p>
<p class="meo">🧠 Tiếp theo: Chương 6 — bế tắc (deadlock). Ví dụ kinh điển của nó là hai tiến trình mỗi bên giữ một thiết bị dành riêng (máy in, máy quét) và chờ thiết bị của bên kia — chính "thiết bị dành riêng" ở slide 19.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 5, sections 5.4–5.8 (pp. 369–427): disks, RAID, disk-arm scheduling, stable storage, clocks, user interfaces, power management; Figures 5-18 to 5-42', 'Chương 5, mục 5.4–5.8 (tr. 369–427): đĩa, RAID, lập lịch cần đĩa, lưu trữ ổn định, đồng hồ, giao diện người dùng, quản lý năng lượng; Hình 5-18 tới 5-42'],
      ['ostep', 'Chapter 37 "Hard Disk Drives" (seek, rotation, SSTF, SCAN, C-SCAN) and Chapter 38 "Redundant Arrays of Inexpensive Disks"', 'Chương 37 "Hard Disk Drives" (seek, quay, SSTF, SCAN, C-SCAN) và Chương 38 "Redundant Arrays of Inexpensive Disks"'],
      ['mchoes', 'the device management chapter (disk scheduling with worked examples)', 'chương quản lý thiết bị (lập lịch đĩa có ví dụ giải sẵn)'],
      ['man7', 'termios(3), stty(1), clock_getres(2), timerfd_create(2), ulimit/getrlimit(2), console_codes(4) for escape sequences', 'termios(3), stty(1), clock_getres(2), timerfd_create(2), ulimit/getrlimit(2), console_codes(4) cho chuỗi thoát'],
      ['win32', 'Rectangle, BitBlt, GetMessage, DispatchMessage, DefWindowProc', 'Rectangle, BitBlt, GetMessage, DispatchMessage, DefWindowProc'],
    ]),
  ].join('\n'),
};

/* ───────── 5.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 5: disk scheduling, I/O arithmetic, RAID, devices, terminal ───────── */
const L_on_ch5 = {
  title: '5.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 5: disk scheduling, I/O arithmetic, RAID, devices, terminal|||5.C — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 5: lập lịch đĩa, bài tính I/O, RAID, thiết bị, terminal',
  slug: 'osg202-on-ch5',
  type: 'VIDEO',
  description: '7 bài tập Chương 5 có lời giải chạy thật trên Linux: lập lịch cần đĩa trên một bộ dữ liệu mới với sáu thuật toán do bộ mô phỏng vẽ (kèm một câu FE có đáp án ngân hàng sai), các phép tính kiểu FE (chi phí ngắt, thanh ghi giữ của đồng hồ, độ lệch trụ, ghi lại màn hình), chẵn lẻ RAID và dựng lại đĩa hỏng, tra loại, số major/minor, driver và đường ngắt của một thiết bị, đo ảnh hưởng của cỡ bộ đệm lên số lời gọi hệ thống, đọc mật khẩu khi tắt vọng chữ trên terminal, và đặt hạn chờ cho một lần đọc bị chặn bằng báo thức; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.C · Practice &amp; review</span>
<h2>Seven exercises: the I/O chapter, computed and run</h2>
<p class="lead">Chapter 5 gives the FE most of its calculation questions after scheduling and paging: disk-arm movement, interrupt overhead, clock registers, cylinder skew, RAID. Exercises 1–3 are those calculations — on new data, so you cannot just remember the book's answers — and every answer is produced by a simulator or a program. Exercises 4–7 are Linux practice: the same ideas, on a real kernel. Try each first (the time is a target), then open the solution.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>disk-arm scheduling: FCFS, SSF, elevator, SCAN, C-SCAN, C-LOOK, in cylinders and in ms</td><td>5.B slides 31–33</td></tr>
<tr><td>2</td><td>FE arithmetic: interrupt overhead, holding register, cylinder skew, screen rewrite</td><td>5.A slide 13, 5.B slides 29, 37, 43</td></tr>
<tr><td>3</td><td>RAID parity, rebuilding a lost disk, the small write, capacity</td><td>5.B slides 26–27</td></tr>
<tr><td>4</td><td>find a device's class, major:minor, driver and interrupt line</td><td>5.A slides 2, 7, 18–20</td></tr>
<tr><td>5</td><td>buffer size versus system calls and time</td><td>5.A slides 21–22</td></tr>
<tr><td>6</td><td>a password prompt: echo off, line editing on</td><td>5.B slide 42</td></tr>
<tr><td>7</td><td>a timeout for a blocking read with alarm()</td><td>5.B slide 38</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.C · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: chương I/O, tính ra và chạy thật</h2>
<p class="lead">Sau lập lịch CPU và phân trang, Chương 5 là nơi FE lấy nhiều câu tính toán nhất: quãng đường cần đĩa, chi phí ngắt, thanh ghi đồng hồ, độ lệch trụ, RAID. Bài 1–3 chính là các phép tính đó — trên dữ liệu mới, để bạn không thể chỉ nhớ đáp án của sách — và đáp án nào cũng do một bộ mô phỏng hay một chương trình tính ra. Bài 4–7 là thực hành Linux: cùng các ý tưởng, trên một nhân thật. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>lập lịch cần đĩa: FCFS, SSF, thang máy, SCAN, C-SCAN, C-LOOK, tính bằng cylinder và bằng ms</td><td>5.B slide 31–33</td></tr>
<tr><td>2</td><td>bài tính FE: chi phí ngắt, thanh ghi giữ, độ lệch trụ, ghi lại màn hình</td><td>5.A slide 13, 5.B slide 29, 37, 43</td></tr>
<tr><td>3</td><td>chẵn lẻ RAID, dựng lại đĩa mất, ghi nhỏ, dung lượng</td><td>5.B slide 26–27</td></tr>
<tr><td>4</td><td>tìm loại, major:minor, driver và đường ngắt của một thiết bị</td><td>5.A slide 2, 7, 18–20</td></tr>
<tr><td>5</td><td>cỡ bộ đệm so với số lời gọi hệ thống và thời gian</td><td>5.A slide 21–22</td></tr>
<tr><td>6</td><td>dấu nhắc mật khẩu: tắt vọng chữ, vẫn sửa dòng</td><td>5.B slide 42</td></tr>
<tr><td>7</td><td>hạn chờ cho một lần đọc bị chặn bằng alarm()</td><td>5.B slide 38</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — disk-arm scheduling on new data (25 min)</h3>
<p>A disk has cylinders 0–99; a seek costs 5 ms per cylinder. The arm is at cylinder <strong>30</strong>, last moving <strong>up</strong> (towards 99). Requests arrive in this order: <strong>12, 85, 40, 7, 63, 51, 92, 20</strong>. (a) Give the service order and the total movement for FCFS, SSF, the elevator (LOOK), SCAN, C-SCAN and C-LOOK (C- versions count the return jump). (b) How long does SSF spend seeking? (c) Watch out for the first step of SSF — what is special there? (d) Bonus, FE1#13: head at 25, requests 5, 48, 32, 50, 12, FCFS — the options are 108, 96, 83, 114. Which is right?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/58a7d0267c34b5849f6776621c94ac6a4f764c58.svg" alt="All six algorithms on the exercise data" loading="lazy" /><p class="chu-thich">🧮 All six algorithms on the exercise data</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const DAU = 30, YEU_CAU = [12, 85, 40, 7, 63, 51, 92, 20], MIN = 0, MAX = 99, MS = 5;
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d4bb7a134d2126f15bde41633d7ed868d1be46de.svg" alt="SSF: from 30, the requests 20 and 40 are equally close" loading="lazy" /><p class="chu-thich">🧮 SSF: from 30, the requests 20 and 40 are equally close</p></div>
<table>
<thead><tr><th>Step</th><th>Arm moves</th><th>Cylinders</th></tr></thead>
<tbody>
<tr><td>1</td><td>30 → 40</td><td>10</td></tr>
<tr><td>2</td><td>40 → 51</td><td>11</td></tr>
<tr><td>3</td><td>51 → 63</td><td>12</td></tr>
<tr><td>4</td><td>63 → 85</td><td>22</td></tr>
<tr><td>5</td><td>85 → 92</td><td>7</td></tr>
<tr><td>6</td><td>92 → 20</td><td>72</td></tr>
<tr><td>7</td><td>20 → 12</td><td>8</td></tr>
<tr><td>8</td><td>12 → 7</td><td>5</td></tr>
<tr><td colspan="2"><strong>Total</strong></td><td><strong>147</strong> × 5 ms = <strong>735 ms</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const DAU = 30, YEU_CAU = [12, 85, 40, 7, 63, 51, 92, 20], MIN = 0, MAX = 99, MS = 5;
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<ul>
<li>(a) FCFS 350 (30 → 12 → 85 → 40 → 7 → 63 → 51 → 92 → 20); SSF 147; elevator 147 (30 → 40 → 51 → 63 → 85 → 92, then 20 → 12 → 7); SCAN 161 (goes to 99 first); C-SCAN 188 (99, jump to 0, then 7, 12, 20); C-LOOK 160 (92, jump to 7, then 12, 20).</li>
<li>(b) 147 × 5 ms = <strong>735 ms</strong>.</li>
<li>(c) From 30, cylinders 20 and 40 are both 10 away — a <strong>tie</strong>. The simulator keeps the current direction (up), so SSF here equals the elevator. Breaking the tie downwards gives 30 → 20 → 12 → 7 → 40 → … → 92 = 108 — the same as the elevator moving down. In a written answer, state your tie rule.</li>
<li>(d) 25 → 5 (20) → 48 (43) → 32 (16) → 50 (18) → 12 (38) = <strong>135</strong>. None of the options is right; the question bank marks 114, which is wrong (checked with the image of the original exam). Simulator: lesson 5.B's data set "fe1".</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ffb68ec5447993fac8995b3592a5b48f108b75cf.svg" alt="FE1#13 recomputed: 135 cylinders, not 114" loading="lazy" /><p class="chu-thich">🧮 FE1#13 recomputed: 135 cylinders, not 114</p></div>
<table>
<thead><tr><th>Step</th><th>Arm moves</th><th>Why</th><th>Cylinders</th></tr></thead>
<tbody>
<tr><td>1</td><td>25 → 5</td><td>serve</td><td>20</td></tr>
<tr><td>2</td><td>5 → 48</td><td>serve</td><td>43</td></tr>
<tr><td>3</td><td>48 → 32</td><td>serve</td><td>16</td></tr>
<tr><td>4</td><td>32 → 50</td><td>serve</td><td>18</td></tr>
<tr><td>5</td><td>50 → 12</td><td>serve</td><td>38</td></tr>
<tr><td colspan="3"><strong>Total</strong></td><td><strong>135</strong></td></tr>
</tbody>
</table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
</details>`,
    `<h3>🧪 Bài 1 — lập lịch cần đĩa trên dữ liệu mới (25 phút)</h3>
<p>Một đĩa có cylinder 0–99; mỗi cylinder seek mất 5 ms. Cần đĩa đang ở cylinder <strong>30</strong>, lần cuối đang đi <strong>lên</strong> (về phía 99). Các yêu cầu tới theo thứ tự: <strong>12, 85, 40, 7, 63, 51, 92, 20</strong>. (a) Cho thứ tự phục vụ và tổng quãng đường của FCFS, SSF, thang máy (LOOK), SCAN, C-SCAN và C-LOOK (bản C- có tính cú nhảy về). (b) SSF tốn bao lâu để seek? (c) Để ý bước đầu tiên của SSF — có gì đặc biệt? (d) Thêm, FE1#13: đầu từ ở 25, yêu cầu 5, 48, 32, 50, 12, FCFS — các phương án là 108, 96, 83, 114. Cái nào đúng?</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/13301792b3fe7c7a5bae57570213e5fff2d0b358.svg" alt="Cả sáu thuật toán trên dữ liệu bài tập" loading="lazy" /><p class="chu-thich">🧮 Cả sáu thuật toán trên dữ liệu bài tập</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const DAU = 30, YEU_CAU = [12, 85, 40, 7, 63, 51, 92, 20], MIN = 0, MAX = 99, MS = 5;
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/07c191b9c2a6c3c5015bfd35398ab52b71640be4.svg" alt="SSF: từ 30, hai yêu cầu 20 và 40 cách đều nhau" loading="lazy" /><p class="chu-thich">🧮 SSF: từ 30, hai yêu cầu 20 và 40 cách đều nhau</p></div>
<table>
<thead><tr><th>Bước</th><th>Cần đi</th><th>Số cylinder</th></tr></thead>
<tbody>
<tr><td>1</td><td>30 → 40</td><td>10</td></tr>
<tr><td>2</td><td>40 → 51</td><td>11</td></tr>
<tr><td>3</td><td>51 → 63</td><td>12</td></tr>
<tr><td>4</td><td>63 → 85</td><td>22</td></tr>
<tr><td>5</td><td>85 → 92</td><td>7</td></tr>
<tr><td>6</td><td>92 → 20</td><td>72</td></tr>
<tr><td>7</td><td>20 → 12</td><td>8</td></tr>
<tr><td>8</td><td>12 → 7</td><td>5</td></tr>
<tr><td colspan="2"><strong>Tổng</strong></td><td><strong>147</strong> × 5 ms = <strong>735 ms</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const DAU = 30, YEU_CAU = [12, 85, 40, 7, 63, 51, 92, 20], MIN = 0, MAX = 99, MS = 5;
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
<ul>
<li>(a) FCFS 350 (30 → 12 → 85 → 40 → 7 → 63 → 51 → 92 → 20); SSF 147; thang máy 147 (30 → 40 → 51 → 63 → 85 → 92, rồi 20 → 12 → 7); SCAN 161 (chạy tới 99 trước); C-SCAN 188 (99, nhảy về 0, rồi 7, 12, 20); C-LOOK 160 (92, nhảy về 7, rồi 12, 20).</li>
<li>(b) 147 × 5 ms = <strong>735 ms</strong>.</li>
<li>(c) Từ 30, cylinder 20 và 40 cùng cách 10 — một chỗ <strong>hoà</strong>. Bộ mô phỏng giữ chiều đang đi (lên), nên ở đây SSF trùng thang máy. Phá hoà theo chiều xuống thì được 30 → 20 → 12 → 7 → 40 → … → 92 = 108 — bằng thang máy khi đi xuống. Bài tự luận thì ghi rõ quy ước phá hoà của bạn.</li>
<li>(d) 25 → 5 (20) → 48 (43) → 32 (16) → 50 (18) → 12 (38) = <strong>135</strong>. Không phương án nào đúng; ngân hàng câu hỏi đánh dấu 114, là SAI (đã đối chiếu ảnh đề gốc). Mô phỏng: bộ dữ liệu "fe1" của bài 5.B.</li>
</ul>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/dc4bd6c4cd7cd0679712d6a76406350e782adffa.svg" alt="Tính lại FE1#13: 135 cylinder, không phải 114" loading="lazy" /><p class="chu-thich">🧮 Tính lại FE1#13: 135 cylinder, không phải 114</p></div>
<table>
<thead><tr><th>Bước</th><th>Cần đi</th><th>Vì sao</th><th>Số cylinder</th></tr></thead>
<tbody>
<tr><td>1</td><td>25 → 5</td><td>phục vụ</td><td>20</td></tr>
<tr><td>2</td><td>5 → 48</td><td>phục vụ</td><td>43</td></tr>
<tr><td>3</td><td>48 → 32</td><td>phục vụ</td><td>16</td></tr>
<tr><td>4</td><td>32 → 50</td><td>phục vụ</td><td>18</td></tr>
<tr><td>5</td><td>50 → 12</td><td>phục vụ</td><td>38</td></tr>
<tr><td colspan="3"><strong>Tổng</strong></td><td><strong>135</strong></td></tr>
</tbody>
</table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const BO = {
  sach: { dau: 11, yeuCau: [1, 36, 16, 34, 9, 12], min: 0, max: 39, msMoiTru: 6 },
  silb: { dau: 53, yeuCau: [98, 183, 37, 122, 14, 124, 65, 67], min: 0, max: 199 },
  fe1: { dau: 25, yeuCau: [5, 48, 32, 50, 12], min: 0, max: 59 },
  fe22: { dau: 20, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
  fe26: { dau: 37, yeuCau: [10, 22, 20, 2, 40, 6, 38], min: 0, max: 49 },
};
const THUAT_TOAN = ['fcfs', 'sstf', 'look', 'scan', 'cscan', 'clook'];</code></pre></details>
</details>`),
    bi(`<h3>🧪 Exercise 2 — the FE arithmetic of Chapter 5 (20 min)</h3>
<p>(a) A modem delivers 7,000 characters/s and every character costs one interrupt of 10 µs in total. What fraction of the CPU goes to interrupts? Same for a printer at 400 characters/s with 50 µs per interrupt. (b) A programmable clock is driven by a 500-MHz crystal in square-wave mode. What value must be loaded into the holding register for a tick every 10 ms? Every 100 µs? (c) Cylinder skew for a 3600-rpm and a 5400-rpm disk with 200 sectors per track and a 1 ms track-to-track seek. (d) Copying one byte takes 10 ns: how long to rewrite a 150 × 20 text-mode memory-mapped screen?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Chapter 5 calculations, FE style — each answer computed, never guessed
const pct = (x) =&gt; &#96;&#36;{+(x * 100).toFixed(2)}%&#96;;
// (a) interrupt overhead = characters per second x cost of one interrupt
for (const [ten, cps, us] of [['modem 7,000 char/s, 10 us', 7000, 10], ['printer 400 char/s, 50 us', 400, 50], ['keyboard 10 char/s, 50 us', 10, 50]])
  console.log(&#96;(a) &#36;{ten.padEnd(28)} -&gt; &#36;{cps} x &#36;{us} us = &#36;{(cps * us) / 1000} ms per second = &#36;{pct((cps * us) / 1e6)} of the CPU&#96;);
// (b) programmable clock: holding register = crystal frequency x tick interval
for (const [mhz, tickUs] of [[500, 10000], [500, 100], [1000, 1000]])
  console.log(&#96;(b) &#36;{mhz} MHz crystal, tick &#36;{tickUs} us -&gt; load &#36;{(mhz * tickUs).toLocaleString('en-US')}&#96;);
// (c) cylinder skew = ceil(track-to-track seek / time per sector)
for (const [rpm, spt, seekUs] of [[3600, 200, 1000], [5400, 200, 1000], [7200, 500, 1000]]) {
  const perSector = 60e6 / rpm / spt;
  console.log(&#96;(c) &#36;{rpm} rpm, &#36;{spt} sectors, seek &#36;{seekUs} us -&gt; &#36;{perSector.toFixed(2)} us per sector -&gt; skew &#36;{Math.ceil(seekUs / perSector - 1e-9)} sectors&#96;);
}
// (d) rewriting a memory-mapped text screen = characters x copy time per byte
for (const [cols, rows, ns] of [[150, 20, 10], [80, 25, 10]])
  console.log(&#96;(d) &#36;{cols} x &#36;{rows} screen at &#36;{ns} ns per byte -&gt; &#36;{cols * rows} bytes -&gt; &#36;{(cols * rows * ns) / 1000} us&#96;);</code></pre>
<div class="out">$ node tinh-io.js<br>
(a) modem 7,000 char/s, 10 us &nbsp;&nbsp;&nbsp;-&gt; 7000 x 10 us = 70 ms per second = 7% of the CPU<br>
(a) printer 400 char/s, 50 us &nbsp;&nbsp;&nbsp;-&gt; 400 x 50 us = 20 ms per second = 2% of the CPU<br>
(a) keyboard 10 char/s, 50 us &nbsp;&nbsp;&nbsp;-&gt; 10 x 50 us = 0.5 ms per second = 0.05% of the CPU<br>
(b) 500 MHz crystal, tick 10000 us -&gt; load 5,000,000<br>
(b) 500 MHz crystal, tick 100 us -&gt; load 50,000<br>
(b) 1000 MHz crystal, tick 1000 us -&gt; load 1,000,000<br>
(c) 3600 rpm, 200 sectors, seek 1000 us -&gt; 83.33 us per sector -&gt; skew 12 sectors<br>
(c) 5400 rpm, 200 sectors, seek 1000 us -&gt; 55.56 us per sector -&gt; skew 18 sectors<br>
(c) 7200 rpm, 500 sectors, seek 1000 us -&gt; 16.67 us per sector -&gt; skew 60 sectors<br>
(d) 150 x 20 screen at 10 ns per byte -&gt; 3000 bytes -&gt; 30 us<br>
(d) 80 x 25 screen at 10 ns per byte -&gt; 2000 bytes -&gt; 20 us</div>
<ul>
<li>(a) overhead = rate × cost: 7,000 × 10 µs = 70 ms each second = <strong>7%</strong> (FE24#22, FE27#42, FE29#48); 400 × 50 µs = <strong>2%</strong> (FE19#27). The keyboard line shows why nobody worries about keyboard interrupts.</li>
<li>(b) holding value = frequency × interval: 500 × 10⁶ × 0.01 = <strong>5,000,000</strong> (FE25#19); × 10⁻⁴ = <strong>50,000</strong> (FE26#16).</li>
<li>(c) one sector passes in (60 s / rpm) / 200; skew = ⌈1 ms / that⌉ = <strong>12</strong> at 3600 rpm (FE25#5, FE28#25), <strong>18</strong> at 5400 rpm (FE26#3). The sector size given in the question is not needed.</li>
<li>(d) 150 × 20 = 3,000 bytes × 10 ns = <strong>30 µs</strong> (FE25#34). (A real text screen also stores one attribute byte per character — the exam ignores it.)</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — các phép tính FE của Chương 5 (20 phút)</h3>
<p>(a) Một modem đưa vào 7.000 ký tự/giây và mỗi ký tự tốn một ngắt tổng cộng 10 µs. Bao nhiêu phần CPU dành cho ngắt? Tính tương tự cho máy in 400 ký tự/giây với 50 µs mỗi ngắt. (b) Một đồng hồ lập trình được chạy bằng thạch anh 500 MHz ở chế độ sóng vuông. Phải nạp giá trị nào vào thanh ghi giữ để có tick mỗi 10 ms? Mỗi 100 µs? (c) Độ lệch trụ của đĩa 3600 vòng/phút và 5400 vòng/phút, 200 sector mỗi rãnh, seek giữa hai rãnh 1 ms. (d) Chép một byte mất 10 ns: ghi lại một màn hình văn bản ánh xạ bộ nhớ 150 × 20 mất bao lâu?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Các phép tính Chương 5 kiểu FE — đáp án nào cũng tính ra, không đoán
const pct = (x) =&gt; &#96;&#36;{+(x * 100).toFixed(2)}%&#96;;
// (a) chi phí ngắt = số ký tự mỗi giây x giá một lần ngắt
for (const [ten, cps, us] of [['modem 7,000 char/s, 10 us', 7000, 10], ['printer 400 char/s, 50 us', 400, 50], ['keyboard 10 char/s, 50 us', 10, 50]])
  console.log(&#96;(a) &#36;{ten.padEnd(28)} -&gt; &#36;{cps} x &#36;{us} us = &#36;{(cps * us) / 1000} ms per second = &#36;{pct((cps * us) / 1e6)} of the CPU&#96;);
// (b) đồng hồ lập trình: thanh ghi giữ = tần số thạch anh x khoảng tick
for (const [mhz, tickUs] of [[500, 10000], [500, 100], [1000, 1000]])
  console.log(&#96;(b) &#36;{mhz} MHz crystal, tick &#36;{tickUs} us -&gt; load &#36;{(mhz * tickUs).toLocaleString('en-US')}&#96;);
// (c) độ lệch trụ = trần(seek giữa hai rãnh / thời gian một sector)
for (const [rpm, spt, seekUs] of [[3600, 200, 1000], [5400, 200, 1000], [7200, 500, 1000]]) {
  const perSector = 60e6 / rpm / spt;
  console.log(&#96;(c) &#36;{rpm} rpm, &#36;{spt} sectors, seek &#36;{seekUs} us -&gt; &#36;{perSector.toFixed(2)} us per sector -&gt; skew &#36;{Math.ceil(seekUs / perSector - 1e-9)} sectors&#96;);
}
// (d) ghi lại màn hình văn bản ánh xạ bộ nhớ = số ký tự x thời gian chép một byte
for (const [cols, rows, ns] of [[150, 20, 10], [80, 25, 10]])
  console.log(&#96;(d) &#36;{cols} x &#36;{rows} screen at &#36;{ns} ns per byte -&gt; &#36;{cols * rows} bytes -&gt; &#36;{(cols * rows * ns) / 1000} us&#96;);</code></pre>
<div class="out">$ node tinh-io.js<br>
(a) modem 7,000 char/s, 10 us &nbsp;&nbsp;&nbsp;-&gt; 7000 x 10 us = 70 ms per second = 7% of the CPU<br>
(a) printer 400 char/s, 50 us &nbsp;&nbsp;&nbsp;-&gt; 400 x 50 us = 20 ms per second = 2% of the CPU<br>
(a) keyboard 10 char/s, 50 us &nbsp;&nbsp;&nbsp;-&gt; 10 x 50 us = 0.5 ms per second = 0.05% of the CPU<br>
(b) 500 MHz crystal, tick 10000 us -&gt; load 5,000,000<br>
(b) 500 MHz crystal, tick 100 us -&gt; load 50,000<br>
(b) 1000 MHz crystal, tick 1000 us -&gt; load 1,000,000<br>
(c) 3600 rpm, 200 sectors, seek 1000 us -&gt; 83.33 us per sector -&gt; skew 12 sectors<br>
(c) 5400 rpm, 200 sectors, seek 1000 us -&gt; 55.56 us per sector -&gt; skew 18 sectors<br>
(c) 7200 rpm, 500 sectors, seek 1000 us -&gt; 16.67 us per sector -&gt; skew 60 sectors<br>
(d) 150 x 20 screen at 10 ns per byte -&gt; 3000 bytes -&gt; 30 us<br>
(d) 80 x 25 screen at 10 ns per byte -&gt; 2000 bytes -&gt; 20 us</div>
<ul>
<li>(a) chi phí = tần suất × giá mỗi lần: 7.000 × 10 µs = 70 ms trong mỗi giây = <strong>7%</strong> (FE24#22, FE27#42, FE29#48); 400 × 50 µs = <strong>2%</strong> (FE19#27). Dòng bàn phím cho thấy vì sao chẳng ai lo về ngắt bàn phím.</li>
<li>(b) giá trị giữ = tần số × khoảng cách: 500 × 10⁶ × 0,01 = <strong>5.000.000</strong> (FE25#19); × 10⁻⁴ = <strong>50.000</strong> (FE26#16).</li>
<li>(c) một sector trôi qua trong (60 giây / số vòng mỗi phút) / 200; độ lệch = ⌈1 ms / khoảng đó⌉ = <strong>12</strong> ở 3600 vòng/phút (FE25#5, FE28#25), <strong>18</strong> ở 5400 vòng/phút (FE26#3). Cỡ sector cho trong đề là không cần.</li>
<li>(d) 150 × 20 = 3.000 byte × 10 ns = <strong>30 µs</strong> (FE25#34). (Màn hình văn bản thật còn lưu thêm một byte thuộc tính cho mỗi ký tự — đề bỏ qua.)</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — RAID parity by hand, then by program (15 min)</h3>
<p>A RAID 4 stripe holds three data bytes D0 = 0x3C, D1 = 0xA5, D2 = 0x0F and a parity byte. (a) Compute the parity. (b) Disk 1 dies — rebuild D1. (c) The program writes 0xF0 into D2: compute the new parity WITHOUT reading D0 and D1. How many disk operations does that small write cost? (d) You have 8 disks of 2 TB. Usable capacity at RAID 0, 1, 5 and 6, and how many disk failures each survives?</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// RAID exercise: parity of three data bytes, rebuild a lost disk, and usable capacity of 8 x 2 TB
#include &lt;stdio.h&gt;

int main(void) {
    unsigned char d0 = 0x3C, d1 = 0xA5, d2 = 0x0F;
    unsigned char p = d0 ^ d1 ^ d2;                              // parity strip
    printf("parity P = 0x%02X ^ 0x%02X ^ 0x%02X = 0x%02X\\n", d0, d1, d2, p);
    unsigned char d1_moi = p ^ d0 ^ d2;                          // disk 1 lost: XOR the survivors
    printf("disk 1 lost -&gt; P ^ D0 ^ D2 = 0x%02X (%s)\\n", d1_moi, d1_moi == d1 ? "correct" : "WRONG");
    unsigned char d2_new = 0xF0;                                 // small write on disk 2
    unsigned char p_new = p ^ d2 ^ d2_new;
    printf("write 0x%02X on disk 2 -&gt; new P = P ^ old ^ new = 0x%02X (full recompute 0x%02X)\\n", d2_new, p_new, d0 ^ d1 ^ d2_new);
    int n = 8, tb = 2;
    printf("8 x 2 TB: RAID 0 = %d TB, RAID 1 = %d TB, RAID 5 = %d TB, RAID 6 = %d TB\\n", n * tb, n / 2 * tb, (n - 1) * tb, (n - 2) * tb);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread raid-tinh.c -o raid-tinh &amp;&amp; ./raid-tinh<br>
parity P = 0x3C ^ 0xA5 ^ 0x0F = 0x96<br>
disk 1 lost -&gt; P ^ D0 ^ D2 = 0xA5 (correct)<br>
write 0xF0 on disk 2 -&gt; new P = P ^ old ^ new = 0x69 (full recompute 0x69)<br>
8 x 2 TB: RAID 0 = 16 TB, RAID 1 = 8 TB, RAID 5 = 14 TB, RAID 6 = 12 TB</div>
<ul>
<li>(a) P = 0x3C ⊕ 0xA5 ⊕ 0x0F = <strong>0x96</strong> (in binary: 00111100 ⊕ 10100101 = 10011001, ⊕ 00001111 = 10010110).</li>
<li>(b) D1 = P ⊕ D0 ⊕ D2 = 0xA5 — XOR every survivor, parity included.</li>
<li>(c) P′ = P ⊕ old D2 ⊕ new D2 = 0x69, identical to a full recomputation. Cost: read old D2 and old P, write new D2 and new P = <strong>4 disk operations</strong> (RAID 6: 6). On RAID 4 all these parity writes hit the same disk — RAID 5's reason to exist.</li>
<li>(d) RAID 0 16 TB (survives 0), RAID 1 8 TB (1, more if the failed disks are in different pairs), RAID 5 14 TB (1), RAID 6 12 TB (2). "All RAID levels survive one disk crash" is false (FE25#41).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — chẵn lẻ RAID bằng tay, rồi bằng chương trình (15 phút)</h3>
<p>Một sọc RAID 4 chứa ba byte dữ liệu D0 = 0x3C, D1 = 0xA5, D2 = 0x0F và một byte chẵn lẻ. (a) Tính byte chẵn lẻ. (b) Đĩa 1 chết — dựng lại D1. (c) Chương trình ghi 0xF0 vào D2: tính chẵn lẻ mới MÀ KHÔNG đọc D0 và D1. Lần ghi nhỏ đó tốn bao nhiêu thao tác đĩa? (d) Bạn có 8 đĩa 2 TB. Dung lượng dùng được ở RAID 0, 1, 5 và 6, và mỗi mức chịu được bao nhiêu đĩa hỏng?</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài RAID: chẵn lẻ của ba byte dữ liệu, dựng lại đĩa mất, và dung lượng dùng được của 8 x 2 TB
#include &lt;stdio.h&gt;

int main(void) {
    unsigned char d0 = 0x3C, d1 = 0xA5, d2 = 0x0F;
    unsigned char p = d0 ^ d1 ^ d2;                              // strip chẵn lẻ
    printf("parity P = 0x%02X ^ 0x%02X ^ 0x%02X = 0x%02X\\n", d0, d1, d2, p);
    unsigned char d1_moi = p ^ d0 ^ d2;                          // mất đĩa 1: XOR các đĩa còn lại
    printf("disk 1 lost -&gt; P ^ D0 ^ D2 = 0x%02X (%s)\\n", d1_moi, d1_moi == d1 ? "correct" : "WRONG");
    unsigned char d2_new = 0xF0;                                 // ghi nhỏ lên đĩa 2
    unsigned char p_new = p ^ d2 ^ d2_new;
    printf("write 0x%02X on disk 2 -&gt; new P = P ^ old ^ new = 0x%02X (full recompute 0x%02X)\\n", d2_new, p_new, d0 ^ d1 ^ d2_new);
    int n = 8, tb = 2;
    printf("8 x 2 TB: RAID 0 = %d TB, RAID 1 = %d TB, RAID 5 = %d TB, RAID 6 = %d TB\\n", n * tb, n / 2 * tb, (n - 1) * tb, (n - 2) * tb);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread raid-tinh.c -o raid-tinh &amp;&amp; ./raid-tinh<br>
parity P = 0x3C ^ 0xA5 ^ 0x0F = 0x96<br>
disk 1 lost -&gt; P ^ D0 ^ D2 = 0xA5 (correct)<br>
write 0xF0 on disk 2 -&gt; new P = P ^ old ^ new = 0x69 (full recompute 0x69)<br>
8 x 2 TB: RAID 0 = 16 TB, RAID 1 = 8 TB, RAID 5 = 14 TB, RAID 6 = 12 TB</div>
<ul>
<li>(a) P = 0x3C ⊕ 0xA5 ⊕ 0x0F = <strong>0x96</strong> (nhị phân: 00111100 ⊕ 10100101 = 10011001, ⊕ 00001111 = 10010110).</li>
<li>(b) D1 = P ⊕ D0 ⊕ D2 = 0xA5 — XOR mọi đĩa còn sống, kể cả đĩa chẵn lẻ.</li>
<li>(c) P′ = P ⊕ D2 cũ ⊕ D2 mới = 0x69, trùng với tính lại toàn bộ. Chi phí: đọc D2 cũ và P cũ, ghi D2 mới và P mới = <strong>4 thao tác đĩa</strong> (RAID 6: 6). Ở RAID 4, mọi lần ghi chẵn lẻ đó đổ vào cùng một đĩa — lý do RAID 5 ra đời.</li>
<li>(d) RAID 0 16 TB (chịu 0 đĩa hỏng), RAID 1 8 TB (1, nhiều hơn nếu các đĩa hỏng thuộc các cặp khác nhau), RAID 5 14 TB (1), RAID 6 12 TB (2). "Mọi mức RAID đều chịu được một đĩa hỏng" là sai (FE25#41).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — interrogate two devices (15 min)</h3>
<p>For <code>/dev/vda</code> and <code>/dev/null</code>, find with commands only: (a) block or character? (b) major and minor numbers; (c) the sysfs directory of each and, if any, the name of the driver; (d) the interrupt line of the disk. Hint: <code>stat -c</code>, the links under <code>/sys/dev/block</code> and <code>/sys/dev/char</code>, and <code>/proc/interrupts</code>.</p>
<details><summary>Solution — run in the container (root, --privileged)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 4: for two devices, find class, major:minor, the driver behind it, and (for the disk) its interrupt line<br>
$ for d in /dev/vda /dev/null; do t=$(stat -c %F $d); echo "$d: $t, major:minor $(stat -c '%Hr:%Lr' $d)"; done<br>
/dev/vda: block special file, major:minor 254:0<br>
/dev/null: character special file, major:minor 1:3<br>
# /sys/dev/&lt;block|char&gt;/&lt;major&gt;:&lt;minor&gt; is a link to the device in sysfs<br>
$ readlink -f /sys/dev/block/254:0<br>
/sys/devices/platform/40000000.pci/pci0000:00/0000:00:06.0/virtio2/block/vda<br>
$ basename "$(readlink -f /sys/dev/block/254:0/device/driver)"<br>
virtio_blk<br>
$ readlink -f /sys/dev/char/1:3<br>
/sys/devices/virtual/mem/null<br>
# /dev/null has no hardware and no driver directory: it is the "mem" driver's minor 3, purely software<br>
$ ls /sys/dev/char/1:3/<br>
dev<br>
subsystem<br>
uevent<br>
$ d=$(basename "$(readlink /sys/block/vda/device)"); grep -E " $d\\$" /proc/interrupts | awk '{print "disk interrupt line:", $1, $(NF-3), $(NF-2), $NF}'<br>
disk interrupt line: 16: GICv3 70 virtio2</div>
<p>The disk is block device 254:0; sysfs shows the whole path from the PCI bus (<code>0000:00:06.0</code>) through the virtio device <code>virtio2</code> to the block device <code>vda</code>, served by the driver <code>virtio_blk</code>, interrupt line 16 of the GICv3 controller. <code>/dev/null</code> is character device 1:3 under <code>/sys/devices/virtual</code> — no hardware, no driver directory: "virtual" devices are pure software inside a driver ("mem", major 1). Same file interface, completely different things behind it — device independence (5.A slide 10) and uniform naming by major/minor (5.A slide 20).</p>
</details>`,
    `<h3>🧪 Bài 4 — tra hỏi hai thiết bị (15 phút)</h3>
<p>Với <code>/dev/vda</code> và <code>/dev/null</code>, chỉ dùng lệnh để tìm: (a) khối hay ký tự? (b) số major và minor; (c) thư mục sysfs của mỗi cái và, nếu có, tên driver; (d) đường ngắt của đĩa. Gợi ý: <code>stat -c</code>, các liên kết dưới <code>/sys/dev/block</code> và <code>/sys/dev/char</code>, và <code>/proc/interrupts</code>.</p>
<details><summary>Lời giải — chạy trong container (root, --privileged)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 4: với hai thiết bị, tìm loại, major:minor, driver đứng sau, và (với đĩa) đường ngắt của nó<br>
$ for d in /dev/vda /dev/null; do t=$(stat -c %F $d); echo "$d: $t, major:minor $(stat -c '%Hr:%Lr' $d)"; done<br>
/dev/vda: block special file, major:minor 254:0<br>
/dev/null: character special file, major:minor 1:3<br>
# /sys/dev/&lt;block|char&gt;/&lt;major&gt;:&lt;minor&gt; là đường dẫn tới thiết bị trong sysfs<br>
$ readlink -f /sys/dev/block/254:0<br>
/sys/devices/platform/40000000.pci/pci0000:00/0000:00:06.0/virtio2/block/vda<br>
$ basename "$(readlink -f /sys/dev/block/254:0/device/driver)"<br>
virtio_blk<br>
$ readlink -f /sys/dev/char/1:3<br>
/sys/devices/virtual/mem/null<br>
# /dev/null không có phần cứng, không có thư mục driver: nó là minor 3 của driver "mem", thuần phần mềm<br>
$ ls /sys/dev/char/1:3/<br>
dev<br>
subsystem<br>
uevent<br>
$ d=$(basename "$(readlink /sys/block/vda/device)"); grep -E " $d\\$" /proc/interrupts | awk '{print "disk interrupt line:", $1, $(NF-3), $(NF-2), $NF}'<br>
disk interrupt line: 16: GICv3 70 virtio2</div>
<p>Đĩa là thiết bị khối 254:0; sysfs cho thấy trọn đường đi từ bus PCI (<code>0000:00:06.0</code>) qua thiết bị virtio <code>virtio2</code> tới thiết bị khối <code>vda</code>, do driver <code>virtio_blk</code> phục vụ, đường ngắt 16 của bộ điều khiển GICv3. <code>/dev/null</code> là thiết bị ký tự 1:3 nằm dưới <code>/sys/devices/virtual</code> — không phần cứng, không thư mục driver: thiết bị "ảo" là phần mềm thuần tuý nằm trong một driver ("mem", major 1). Cùng giao diện tệp, đằng sau là hai thứ khác hẳn nhau — độc lập thiết bị (5.A slide 10) và đặt tên thống nhất bằng major/minor (5.A slide 20).</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — how big should a buffer be? (15 min)</h3>
<p>Write 1 MiB to <code>/dev/null</code> with <code>write()</code> using buffers of 1, 16, 512, 4096 and 65,536 bytes. Predict the number of system calls for each, then measure the time. Where does the time go?</p>
<details><summary>Solution — one real run</summary>
<pre><code class="language-c">// Exercise 5: copy 1 MiB to /dev/null with different buffer sizes — count system calls and time
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static char buf[65536];

int main(void) {
    const long TONG = 1 &lt;&lt; 20;                                   // 1 MiB
    int out = open("/dev/null", O_WRONLY);
    int co[] = { 1, 16, 512, 4096, 65536 };
    for (int k = 0; k &lt; 5; k++) {
        struct timespec a, b;
        long goi = 0;
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        for (long da = 0; da &lt; TONG; da += co[k]) { write(out, buf, co[k]); goi++; }   // one system call per buffer
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        double ms = (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
        printf("buffer %5d B: %7ld write() calls, %8.2f ms\\n", co[k], goi, ms);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bo-dem.c -o bo-dem &amp;&amp; ./bo-dem<br>
buffer &nbsp;&nbsp;&nbsp;&nbsp;1 B: 1048576 write() calls, &nbsp;&nbsp;237.21 ms<br>
buffer &nbsp;&nbsp;&nbsp;16 B: &nbsp;&nbsp;65536 write() calls, &nbsp;&nbsp;&nbsp;15.63 ms<br>
buffer &nbsp;&nbsp;512 B: &nbsp;&nbsp;&nbsp;2048 write() calls, &nbsp;&nbsp;&nbsp;&nbsp;0.43 ms<br>
buffer &nbsp;4096 B: &nbsp;&nbsp;&nbsp;&nbsp;256 write() calls, &nbsp;&nbsp;&nbsp;&nbsp;0.07 ms<br>
buffer 65536 B: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 write() calls, &nbsp;&nbsp;&nbsp;&nbsp;0.00 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The number of calls is simply 1 MiB ÷ buffer size: 1,048,576 calls with 1-byte writes, 16 with 64 KB. Writing to <code>/dev/null</code> costs nothing, so the time measured is almost pure system-call overhead: with tiny buffers the program spends its life crossing into the kernel and back; from 4 KB on, the cost becomes negligible. That is why stdio uses a 4 KB buffer (5.A slide 21), and why reading a file byte by byte with <code>read(fd, &amp;c, 1)</code> is a classic performance bug.</p>
<div class="callout">🧭 Backend: Java's <code>BufferedOutputStream</code> (8 KB default), Node's stream <code>highWaterMark</code> (64 KB for file streams), and JDBC fetch sizes are the same decision: amortise a fixed per-call cost over many bytes or rows.</div>
</details>`,
    `<h3>🧪 Bài 5 — bộ đệm nên to bao nhiêu? (15 phút)</h3>
<p>Ghi 1 MiB ra <code>/dev/null</code> bằng <code>write()</code> với các bộ đệm 1, 16, 512, 4096 và 65.536 byte. Đoán số lời gọi hệ thống cho mỗi trường hợp, rồi đo thời gian. Thời gian đi đâu?</p>
<details><summary>Lời giải — một lần chạy thật</summary>
<pre><code class="language-c">// Bài 5: chép 1 MiB ra /dev/null với các cỡ bộ đệm khác nhau — đếm lời gọi hệ thống và đo thời gian
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static char buf[65536];

int main(void) {
    const long TONG = 1 &lt;&lt; 20;                                   // 1 MiB
    int out = open("/dev/null", O_WRONLY);
    int co[] = { 1, 16, 512, 4096, 65536 };
    for (int k = 0; k &lt; 5; k++) {
        struct timespec a, b;
        long goi = 0;
        clock_gettime(CLOCK_MONOTONIC, &amp;a);
        for (long da = 0; da &lt; TONG; da += co[k]) { write(out, buf, co[k]); goi++; }   // mỗi bộ đệm một lời gọi hệ thống
        clock_gettime(CLOCK_MONOTONIC, &amp;b);
        double ms = (b.tv_sec - a.tv_sec) * 1e3 + (b.tv_nsec - a.tv_nsec) / 1e6;
        printf("buffer %5d B: %7ld write() calls, %8.2f ms\\n", co[k], goi, ms);
    }
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bo-dem.c -o bo-dem &amp;&amp; ./bo-dem<br>
buffer &nbsp;&nbsp;&nbsp;&nbsp;1 B: 1048576 write() calls, &nbsp;&nbsp;237.21 ms<br>
buffer &nbsp;&nbsp;&nbsp;16 B: &nbsp;&nbsp;65536 write() calls, &nbsp;&nbsp;&nbsp;15.63 ms<br>
buffer &nbsp;&nbsp;512 B: &nbsp;&nbsp;&nbsp;2048 write() calls, &nbsp;&nbsp;&nbsp;&nbsp;0.43 ms<br>
buffer &nbsp;4096 B: &nbsp;&nbsp;&nbsp;&nbsp;256 write() calls, &nbsp;&nbsp;&nbsp;&nbsp;0.07 ms<br>
buffer 65536 B: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 write() calls, &nbsp;&nbsp;&nbsp;&nbsp;0.00 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Số lời gọi đơn giản là 1 MiB ÷ cỡ bộ đệm: 1.048.576 lời gọi khi ghi từng byte, 16 lời gọi với 64 KB. Ghi vào <code>/dev/null</code> chẳng tốn gì, nên thời gian đo được gần như toàn là chi phí của lời gọi hệ thống: với bộ đệm tí hon, chương trình dành cả đời để vượt vào nhân rồi quay ra; từ 4 KB trở lên, chi phí đó gần như biến mất. Đó là lý do stdio dùng bộ đệm 4 KB (5.A slide 21), và vì sao đọc tệp từng byte bằng <code>read(fd, &amp;c, 1)</code> là một lỗi hiệu năng kinh điển.</p>
<div class="callout">🧭 Backend: <code>BufferedOutputStream</code> của Java (mặc định 8 KB), <code>highWaterMark</code> của stream Node (64 KB với stream tệp), và fetch size của JDBC đều là cùng một quyết định: chia một chi phí cố định mỗi lần gọi cho thật nhiều byte hay nhiều dòng.</div>
</details>`),
    bi(`<h3>🧪 Exercise 6 — a password prompt (15 min)</h3>
<p>Write a C program that prints <code>Password: </code>, reads a line WITHOUT showing what is typed, then restores the terminal. Should you switch the terminal to raw mode for this? Test it with the input <code>s3cretX</code>, DEL, ENTER.</p>
<details><summary>Solution — run through a pseudo-terminal</summary>
<pre><code class="language-c">// Read a password with echo switched off, then restore the terminal
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;termios.h&gt;

int main(void) {
    struct termios cu, moi;
    tcgetattr(0, &amp;cu);
    moi = cu;
    moi.c_lflag &amp;= ~ECHO;                    // keep canonical mode, only stop echoing
    tcsetattr(0, TCSANOW, &amp;moi);
    printf("Password: ");
    fflush(stdout);
    char mk[64];
    if (!fgets(mk, sizeof mk, stdin)) mk[0] = 0;
    tcsetattr(0, TCSANOW, &amp;cu);              // ALWAYS restore, or the user's shell stays blind
    mk[strcspn(mk, "\\n")] = 0;
    printf("\\nread %zu characters, none of them was shown\\n", strlen(mk));
    return 0;
}</code></pre>
<div class="out"># Exercise 6: a password prompt — the terminal driver stops echoing, the line is still edited in canonical mode<br>
$ gcc -O0 -o mat-khau _mat-khau.c<br>
# the "user" types s3cretX, DEL, ENTER — DEL erases the X, and nothing of it appears on screen<br>
$ (sleep 0.5; printf 's3cretX\\177\\n') | script -qec ./mat-khau /dev/null | tr -d '\\r'<br>
Password:<br>
read 6 characters, none of them was shown</div>
<p>No raw mode is needed: only the <code>ECHO</code> flag is cleared, so the terminal driver stays in canonical mode — it still collects the line and still applies DEL, which erased the X: the program read 6 characters, "s3cret". Nothing appeared after the prompt. The program restores the old settings before exiting; forgetting that leaves the user's shell typing blind (the cure is to type <code>reset</code> or <code>stty sane</code>). This is what <code>getpass()</code>, <code>sudo</code>, <code>ssh</code> and <code>psql</code> do.</p>
</details>`,
    `<h3>🧪 Bài 6 — dấu nhắc mật khẩu (15 phút)</h3>
<p>Viết chương trình C in <code>Password: </code>, đọc một dòng mà KHÔNG hiện những gì được gõ, rồi trả lại terminal như cũ. Có cần chuyển terminal sang chế độ thô để làm việc này không? Thử với đầu vào <code>s3cretX</code>, DEL, ENTER.</p>
<details><summary>Lời giải — chạy qua một terminal giả</summary>
<pre><code class="language-c">// Đọc mật khẩu khi đã tắt vọng chữ, rồi trả lại terminal
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;termios.h&gt;

int main(void) {
    struct termios cu, moi;
    tcgetattr(0, &amp;cu);
    moi = cu;
    moi.c_lflag &amp;= ~ECHO;                    // giữ chế độ chính tắc, chỉ thôi vọng chữ
    tcsetattr(0, TCSANOW, &amp;moi);
    printf("Password: ");
    fflush(stdout);
    char mk[64];
    if (!fgets(mk, sizeof mk, stdin)) mk[0] = 0;
    tcsetattr(0, TCSANOW, &amp;cu);              // LUÔN trả lại, kẻo shell của người dùng bị "mù"
    mk[strcspn(mk, "\\n")] = 0;
    printf("\\nread %zu characters, none of them was shown\\n", strlen(mk));
    return 0;
}</code></pre>
<div class="out"># Bài 6: dấu nhắc mật khẩu — driver terminal thôi vọng chữ, dòng vẫn được sửa ở chế độ chính tắc<br>
$ gcc -O0 -o mat-khau _mat-khau.c<br>
# "người dùng" gõ s3cretX, DEL, ENTER — DEL xoá chữ X, và không chữ nào hiện lên màn hình<br>
$ (sleep 0.5; printf 's3cretX\\177\\n') | script -qec ./mat-khau /dev/null | tr -d '\\r'<br>
Password:<br>
read 6 characters, none of them was shown</div>
<p>Không cần chế độ thô: chỉ cờ <code>ECHO</code> bị xoá, nên driver terminal vẫn ở chế độ chính tắc — nó vẫn gom dòng và vẫn áp dụng DEL, thứ đã xoá chữ X: chương trình đọc được 6 ký tự, "s3cret". Không gì hiện ra sau dấu nhắc. Chương trình trả lại thiết lập cũ trước khi thoát; quên bước này là shell của người dùng phải gõ "mù" (cách chữa: gõ <code>reset</code> hoặc <code>stty sane</code>). Đó chính là việc <code>getpass()</code>, <code>sudo</code>, <code>ssh</code> và <code>psql</code> làm.</p>
</details>`),
    bi(`<h3>🧪 Exercise 7 — never wait forever: a timeout with alarm() (15 min)</h3>
<p>A program reads from a pipe that never receives data, so <code>read()</code> would block forever. Use the clock driver's <code>alarm()</code> service (5.B slide 38) to give up after 1 second. What does <code>read()</code> return, and why must the signal handler be installed WITHOUT <code>SA_RESTART</code>?</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 7: a timeout for a blocking read — the clock's alarm interrupts the wait
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;

static void reo(int sig) { (void)sig; }      // only needs to exist: its arrival interrupts read()

int main(void) {
    int p[2];
    pipe(p);                                  // nobody will ever write into this pipe
    struct sigaction sa = { .sa_handler = reo };   // no SA_RESTART: read() must give up
    sigaction(SIGALRM, &amp;sa, NULL);
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    alarm(1);                                 // ask the clock driver for a signal in 1 s
    char c;
    ssize_t n = read(p[0], &amp;c, 1);            // blocks...
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    printf("read returned %zd, errno = %s\\n", n, strerror(errno));
    printf("gave up after about %.0f s\\n", (b.tv_sec - a.tv_sec) + (b.tv_nsec - a.tv_nsec) / 1e9);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread canh-gioi.c -o canh-gioi &amp;&amp; ./canh-gioi<br>
read returned -1, errno = Interrupted system call<br>
gave up after about 1 s</div>
<p>After one second the kernel's timer fired, delivered SIGALRM, and the blocked <code>read()</code> returned <strong>−1 with errno = EINTR</strong>, "Interrupted system call". With <code>SA_RESTART</code> the kernel would have restarted the read automatically after the handler, and the program would wait forever again. Modern code prefers <code>poll()</code>/<code>select()</code> with a timeout, or <code>timerfd</code> (5.B slide 40), but the principle is the same: the clock is the device that turns "maybe forever" into "at most N seconds".</p>
<div class="callout">🧭 Backend: every outgoing call of a server needs a timeout — HTTP clients (<code>RestClient</code>/<code>WebClient</code> timeouts in Spring, <code>AbortSignal.timeout()</code> in Node), database pools (HikariCP <code>connectionTimeout</code>), and PostgreSQL's own <code>statement_timeout</code>. A single remote call without one can block a whole thread pool.</div>
</details>`,
    `<h3>🧪 Bài 7 — đừng bao giờ chờ mãi: hạn chờ bằng alarm() (15 phút)</h3>
<p>Một chương trình đọc từ một pipe không bao giờ có dữ liệu, nên <code>read()</code> sẽ bị chặn mãi mãi. Dùng dịch vụ <code>alarm()</code> của driver đồng hồ (5.B slide 38) để bỏ cuộc sau 1 giây. <code>read()</code> trả về gì, và vì sao hàm xử lý tín hiệu phải được cài KHÔNG có <code>SA_RESTART</code>?</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 7: hạn chờ cho một lần read bị chặn — báo thức của đồng hồ cắt ngang lần chờ
#include &lt;stdio.h&gt;
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;string.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;

static void reo(int sig) { (void)sig; }      // chỉ cần tồn tại: tín hiệu tới là cắt read()

int main(void) {
    int p[2];
    pipe(p);                                  // sẽ không ai ghi vào pipe này
    struct sigaction sa = { .sa_handler = reo };   // không có SA_RESTART: read() phải bỏ cuộc
    sigaction(SIGALRM, &amp;sa, NULL);
    struct timespec a, b;
    clock_gettime(CLOCK_MONOTONIC, &amp;a);
    alarm(1);                                 // xin driver đồng hồ một tín hiệu sau 1 giây
    char c;
    ssize_t n = read(p[0], &amp;c, 1);            // bị chặn...
    clock_gettime(CLOCK_MONOTONIC, &amp;b);
    printf("read returned %zd, errno = %s\\n", n, strerror(errno));
    printf("gave up after about %.0f s\\n", (b.tv_sec - a.tv_sec) + (b.tv_nsec - a.tv_nsec) / 1e9);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread canh-gioi.c -o canh-gioi &amp;&amp; ./canh-gioi<br>
read returned -1, errno = Interrupted system call<br>
gave up after about 1 s</div>
<p>Sau một giây, bộ hẹn giờ của nhân nổ, gửi SIGALRM, và lần <code>read()</code> đang bị chặn trả về <strong>−1 với errno = EINTR</strong>, "Interrupted system call" (lời gọi hệ thống bị ngắt). Có <code>SA_RESTART</code> thì nhân sẽ tự chạy lại lần đọc sau hàm xử lý, và chương trình lại chờ mãi. Mã hiện đại chuộng <code>poll()</code>/<code>select()</code> có hạn chờ, hoặc <code>timerfd</code> (5.B slide 40), nhưng nguyên lý giống nhau: đồng hồ là thiết bị biến "có khi mãi mãi" thành "tối đa N giây".</p>
<div class="callout">🧭 Backend: mọi lời gọi ra ngoài của server đều cần hạn chờ — HTTP client (timeout của <code>RestClient</code>/<code>WebClient</code> trong Spring, <code>AbortSignal.timeout()</code> trong Node), pool cơ sở dữ liệu (<code>connectionTimeout</code> của HikariCP), và chính <code>statement_timeout</code> của PostgreSQL. Chỉ một lời gọi từ xa thiếu hạn chờ là đủ chặn cả một thread pool.</div>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>block device / character device</strong></td><td>thiết bị khối / thiết bị ký tự</td><td>A device addressed in fixed-size blocks (disk) versus a device that delivers a stream of characters with no seek (keyboard).</td></tr>
<tr><td><strong>device controller</strong></td><td>bộ điều khiển thiết bị</td><td>The electronics of a device, with registers the OS writes commands into and reads status from.</td></tr>
<tr><td><strong>memory-mapped I/O</strong></td><td>I/O ánh xạ vào bộ nhớ</td><td>Device registers given ordinary memory addresses and accessed with normal loads and stores.</td></tr>
<tr><td><strong>I/O port</strong></td><td>cổng I/O</td><td>A device register in a separate I/O address space, reached with special instructions (IN/OUT on x86).</td></tr>
<tr><td><strong>DMA (direct memory access)</strong></td><td>truy cập bộ nhớ trực tiếp</td><td>A controller moves data between a device and memory by itself and interrupts the CPU once at the end.</td></tr>
<tr><td><strong>cycle stealing / burst mode</strong></td><td>lấy trộm chu kỳ / chế độ loạt</td><td>DMA taking one bus cycle at a time (word-at-a-time) versus holding the bus for a block of transfers.</td></tr>
<tr><td><strong>interrupt vector</strong></td><td>vector ngắt</td><td>Table of interrupt-handler addresses, indexed by the device number put on the bus.</td></tr>
<tr><td><strong>precise interrupt</strong></td><td>ngắt chính xác</td><td>An interrupt that leaves the machine in a well-defined state: PC saved, everything before it done, nothing after it started.</td></tr>
<tr><td><strong>programmed I/O / busy waiting</strong></td><td>I/O lập trình / chờ bận</td><td>The CPU does all the transfer itself, polling the device's status register in a loop.</td></tr>
<tr><td><strong>interrupt-driven I/O</strong></td><td>I/O hướng ngắt</td><td>The CPU starts a transfer, runs other work, and continues in the interrupt handler when the device is done.</td></tr>
<tr><td><strong>device driver</strong></td><td>trình điều khiển thiết bị</td><td>Device-specific kernel code that writes commands to a controller and handles its responses.</td></tr>
<tr><td><strong>device-independent I/O software</strong></td><td>phần mềm I/O độc lập thiết bị</td><td>The layer above drivers: naming, protection, buffering, error reporting, dedicated devices, block size.</td></tr>
<tr><td><strong>buffering / double buffering</strong></td><td>đệm / đệm kép</td><td>Keeping data in memory between producer and consumer; two buffers so one fills while the other is emptied.</td></tr>
<tr><td><strong>spooling / daemon</strong></td><td>spooling / tiến trình nền</td><td>Users put output in a spool directory; one daemon process alone uses the dedicated device.</td></tr>
<tr><td><strong>seek time / rotational delay</strong></td><td>thời gian tìm / độ trễ quay</td><td>Time to move the arm to the cylinder; time for the sector to rotate under the head.</td></tr>
<tr><td><strong>RAID / striping / parity</strong></td><td>RAID / chia sọc / chẵn lẻ</td><td>Many disks seen as one; data spread over drives; an XOR block that rebuilds one lost strip.</td></tr>
<tr><td><strong>cylinder skew / interleaving</strong></td><td>độ lệch trụ / xen kẽ</td><td>Offsetting sector 0 between tracks for the track-to-track seek; numbering sectors with gaps for a slow controller.</td></tr>
<tr><td><strong>SSF (SSTF) / elevator (SCAN, LOOK)</strong></td><td>dịch ngắn nhất trước / thang máy</td><td>Serve the nearest request (can starve far ones); sweep in one direction, then reverse (no starvation).</td></tr>
<tr><td><strong>stable storage</strong></td><td>lưu trữ ổn định</td><td>Two disks with stable write (disk 1, verify, then disk 2), stable read and crash recovery — writes become atomic.</td></tr>
<tr><td><strong>clock tick / holding register / watchdog</strong></td><td>tick đồng hồ / thanh ghi giữ / bộ canh gác</td><td>A periodic clock interrupt; the value reloaded into the counter; a timer that resets a hung system.</td></tr>
<tr><td><strong>canonical (cooked) / raw mode</strong></td><td>chế độ chính tắc / chế độ thô</td><td>The terminal driver collects and edits whole lines, versus passing each keystroke at once.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>block device / character device</strong></td><td>thiết bị khối / thiết bị ký tự</td><td>Thiết bị định địa chỉ theo khối cỡ cố định (đĩa) so với thiết bị đưa ra một dòng ký tự không seek được (bàn phím).</td></tr>
<tr><td><strong>device controller</strong></td><td>bộ điều khiển thiết bị</td><td>Phần điện tử của thiết bị, có các thanh ghi để HĐH ghi lệnh vào và đọc trạng thái ra.</td></tr>
<tr><td><strong>memory-mapped I/O</strong></td><td>I/O ánh xạ vào bộ nhớ</td><td>Thanh ghi thiết bị được gán địa chỉ bộ nhớ bình thường và truy cập bằng lệnh đọc/ghi bộ nhớ bình thường.</td></tr>
<tr><td><strong>I/O port</strong></td><td>cổng I/O</td><td>Thanh ghi thiết bị trong một không gian địa chỉ I/O riêng, truy cập bằng lệnh riêng (IN/OUT trên x86).</td></tr>
<tr><td><strong>DMA (direct memory access)</strong></td><td>truy cập bộ nhớ trực tiếp</td><td>Một bộ điều khiển tự chuyển dữ liệu giữa thiết bị và bộ nhớ và chỉ ngắt CPU một lần ở cuối.</td></tr>
<tr><td><strong>cycle stealing / burst mode</strong></td><td>lấy trộm chu kỳ / chế độ loạt</td><td>DMA chiếm từng chu kỳ bus một (từng từ) so với giữ bus cho cả một khối truyền.</td></tr>
<tr><td><strong>interrupt vector</strong></td><td>vector ngắt</td><td>Bảng địa chỉ các trình xử lý ngắt, đánh chỉ số bằng số hiệu thiết bị đặt trên bus.</td></tr>
<tr><td><strong>precise interrupt</strong></td><td>ngắt chính xác</td><td>Ngắt để lại máy ở trạng thái xác định: PC đã lưu, mọi lệnh trước đã xong, chưa lệnh nào sau bắt đầu.</td></tr>
<tr><td><strong>programmed I/O / busy waiting</strong></td><td>I/O lập trình / chờ bận</td><td>CPU tự làm toàn bộ việc truyền, hỏi vòng thanh ghi trạng thái của thiết bị trong một vòng lặp.</td></tr>
<tr><td><strong>interrupt-driven I/O</strong></td><td>I/O hướng ngắt</td><td>CPU khởi động việc truyền, làm việc khác, rồi làm tiếp trong trình xử lý ngắt khi thiết bị xong.</td></tr>
<tr><td><strong>device driver</strong></td><td>trình điều khiển thiết bị</td><td>Mã của nhân dành riêng cho một thiết bị, ghi lệnh vào bộ điều khiển và xử lý phản hồi.</td></tr>
<tr><td><strong>device-independent I/O software</strong></td><td>phần mềm I/O độc lập thiết bị</td><td>Tầng trên driver: đặt tên, bảo vệ, đệm, báo lỗi, thiết bị dành riêng, cỡ khối.</td></tr>
<tr><td><strong>buffering / double buffering</strong></td><td>đệm / đệm kép</td><td>Giữ dữ liệu trong bộ nhớ giữa bên sinh và bên dùng; hai bộ đệm để cái này đầy dần khi cái kia được xả.</td></tr>
<tr><td><strong>spooling / daemon</strong></td><td>spooling / tiến trình nền</td><td>Người dùng đặt output vào thư mục spool; chỉ một tiến trình daemon được dùng thiết bị dành riêng.</td></tr>
<tr><td><strong>seek time / rotational delay</strong></td><td>thời gian tìm / độ trễ quay</td><td>Thời gian dời cần tới cylinder; thời gian chờ sector quay tới dưới đầu từ.</td></tr>
<tr><td><strong>RAID / striping / parity</strong></td><td>RAID / chia sọc / chẵn lẻ</td><td>Nhiều đĩa nhìn như một; dữ liệu rải lên nhiều ổ; một khối XOR dựng lại được một strip bị mất.</td></tr>
<tr><td><strong>cylinder skew / interleaving</strong></td><td>độ lệch trụ / xen kẽ</td><td>Dịch sector 0 giữa các rãnh cho kịp seek sang rãnh kế; đánh số sector có khe cho bộ điều khiển chậm.</td></tr>
<tr><td><strong>SSF (SSTF) / elevator (SCAN, LOOK)</strong></td><td>dịch ngắn nhất trước / thang máy</td><td>Phục vụ yêu cầu gần nhất (có thể bỏ đói yêu cầu xa); quét một chiều rồi đảo chiều (không bỏ đói).</td></tr>
<tr><td><strong>stable storage</strong></td><td>lưu trữ ổn định</td><td>Hai đĩa với ghi ổn định (đĩa 1, kiểm, rồi đĩa 2), đọc ổn định và khôi phục sau sự cố — lần ghi thành nguyên tử.</td></tr>
<tr><td><strong>clock tick / holding register / watchdog</strong></td><td>tick đồng hồ / thanh ghi giữ / bộ canh gác</td><td>Ngắt đồng hồ tuần hoàn; giá trị nạp lại vào bộ đếm; bộ hẹn giờ khởi động lại hệ thống bị treo.</td></tr>
<tr><td><strong>canonical (cooked) / raw mode</strong></td><td>chế độ chính tắc / chế độ thô</td><td>Driver terminal gom và sửa cả dòng, so với chuyển ngay từng phím gõ.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 5</h2>
<ol>
<li>Devices are <strong>block</strong> (addressable blocks, seek: disks) or <strong>character</strong> (streams: keyboard, printer, network); clocks are neither. Data rates span nine orders of magnitude, so one I/O technique cannot fit all.</li>
<li>The CPU reaches controller registers through <strong>I/O ports</strong> (IN/OUT), <strong>memory-mapped I/O</strong> (ordinary loads/stores — the only option on ARM64) or a hybrid; memory-mapped registers must never be cached.</li>
<li><strong>DMA</strong>: the CPU programs address, count and direction; the controller moves the data (cycle stealing or burst mode, physical addresses) and interrupts once.</li>
<li>Interrupts go device → interrupt controller → CPU, which jumps through the <strong>interrupt vector</strong>. A <strong>precise interrupt</strong>: PC saved in a known place, all before it done, nothing after it executed, state of its instruction known.</li>
<li>Three ways to do I/O: <strong>programmed</strong> (busy waiting), <strong>interrupt-driven</strong> (one interrupt per character), <strong>DMA</strong> (one interrupt per buffer). Interrupt overhead = rate × cost per interrupt.</li>
<li>Four software layers from the bottom: <strong>interrupt handlers → device drivers → device-independent software → user-level software</strong> (+ hardware below). Goals: device independence, uniform naming, error handling near the hardware, blocking on asynchronous hardware, buffering, sharable vs dedicated.</li>
<li>Disks: access = seek + rotation + transfer, seek dominates. <strong>FCFS</strong> fair but long, <strong>SSF</strong> greedy and can starve, <strong>elevator</strong> sweeps (the book's elevator reverses at the last request = LOOK). Book example from 11: 111 / 61 / 60; always state the direction. RAID 0 stripes, 1 mirrors, 4–5 strip parity (small write = 4 I/Os), 6 survives two failures. Skew = ⌈seek / time per sector⌉. Stable write: disk 1, verify, then disk 2.</li>
<li>Clocks: holding register = crystal frequency × tick; duties: time of day, quantum, accounting, alarms, watchdogs, profiling; many timers in one sorted delta list. Terminals: canonical vs raw mode, ANSI escapes. GUIs are event loops (X: client = application, server = display; Wayland replaces X today). Power: the display first; DVFS — slower and lower voltage saves energy.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 5</h2>
<ol>
<li>Thiết bị là <strong>khối</strong> (khối định địa chỉ được, seek được: đĩa) hoặc <strong>ký tự</strong> (dòng byte: bàn phím, máy in, mạng); đồng hồ không thuộc loại nào. Tốc độ dữ liệu trải chín bậc độ lớn, nên không kỹ thuật I/O nào hợp với tất cả.</li>
<li>CPU tới thanh ghi của bộ điều khiển qua <strong>cổng I/O</strong> (IN/OUT), <strong>memory-mapped I/O</strong> (lệnh đọc/ghi bộ nhớ bình thường — lựa chọn duy nhất trên ARM64) hoặc kiểu lai; thanh ghi ánh xạ vào bộ nhớ không bao giờ được cache.</li>
<li><strong>DMA</strong>: CPU lập trình địa chỉ, số lượng và chiều truyền; bộ điều khiển tự chuyển dữ liệu (lấy trộm chu kỳ hoặc chế độ loạt, địa chỉ vật lý) và chỉ ngắt một lần.</li>
<li>Ngắt đi từ thiết bị → bộ điều khiển ngắt → CPU, CPU nhảy qua <strong>vector ngắt</strong>. <strong>Ngắt chính xác</strong>: PC lưu ở chỗ đã biết, mọi lệnh trước đã xong, không lệnh nào sau đã chạy, trạng thái lệnh tại PC đã biết.</li>
<li>Ba cách làm I/O: <strong>lập trình</strong> (chờ bận), <strong>hướng ngắt</strong> (mỗi ký tự một ngắt), <strong>DMA</strong> (mỗi bộ đệm một ngắt). Chi phí ngắt = tần suất × giá mỗi lần ngắt.</li>
<li>Bốn tầng phần mềm từ dưới lên: <strong>trình xử lý ngắt → driver → phần mềm độc lập thiết bị → phần mềm mức người dùng</strong> (+ phần cứng bên dưới). Mục tiêu: độc lập thiết bị, đặt tên thống nhất, xử lý lỗi gần phần cứng, chặn trên phần cứng bất đồng bộ, đệm, dùng chung hay dành riêng.</li>
<li>Đĩa: truy cập = tìm + quay + truyền, tìm áp đảo. <strong>FCFS</strong> công bằng mà đi xa, <strong>SSF</strong> tham lam và có thể bỏ đói, <strong>thang máy</strong> quét (thang máy của sách đảo chiều ở yêu cầu cuối = LOOK). Ví dụ của sách từ 11: 111 / 61 / 60; luôn ghi chiều xuất phát. RAID 0 chia sọc, 1 nhân bản, 4–5 chẵn lẻ theo strip (ghi nhỏ = 4 thao tác), 6 chịu hai ổ hỏng. Độ lệch trụ = ⌈seek / thời gian một sector⌉. Ghi ổn định: đĩa 1, kiểm, rồi đĩa 2.</li>
<li>Đồng hồ: thanh ghi giữ = tần số thạch anh × khoảng tick; nhiệm vụ: giờ trong ngày, lượng tử, tính cước, báo thức, watchdog, profiling; nhiều hẹn giờ trong một danh sách hiệu số có thứ tự. Terminal: chế độ chính tắc và thô, chuỗi thoát ANSI. GUI là vòng lặp sự kiện (X: client = ứng dụng, server = màn hình; ngày nay Wayland thay X). Năng lượng: màn hình trước tiên; DVFS — chậm hơn, điện áp thấp hơn thì tiết kiệm năng lượng.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch5) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) A seek to cylinder 11 is in progress when requests arrive for cylinders 1, 36, 16, 34, 9 and 12. A seek takes 6 ms per cylinder. What is the total seek time with Shortest Seek First (SSF)?|||(Dạng câu FE) Đầu từ đang tìm tới cylinder 11 thì các yêu cầu tới cho cylinder 1, 36, 16, 34, 9 và 12. Mỗi cylinder seek mất 6 ms. Tổng thời gian tìm với Shortest Seek First (SSF) là bao nhiêu?',
      options: ['366 ms|||366 ms', '360 ms|||360 ms', '666 ms|||666 ms', '566 ms|||566 ms'],
      correctIndex: 0,
      points: 1,
      explanation: "Computed by the simulator: SSF visits 12, 9, 16, 1, 34, 36 = 1 + 3 + 7 + 15 + 33 + 2 = 61 cylinders, and 61 × 6 ms = 366 ms (the book's own example, FE1#9 of SU26). 666 ms is FCFS (111 cylinders) and 360 ms is the elevator (60 cylinders) — both distractors are other algorithms on the same data. Lesson 5.B, slide 32.|||Bộ mô phỏng tính: SSF đi qua 12, 9, 16, 1, 34, 36 = 1 + 3 + 7 + 15 + 33 + 2 = 61 cylinder, và 61 × 6 ms = 366 ms (chính ví dụ của sách, FE1#9 đề SU26). 666 ms là FCFS (111 cylinder) và 360 ms là thang máy (60 cylinder) — cả hai phương án nhiễu là thuật toán khác trên cùng dữ liệu. Bài 5.B, slide 32." },
    { id: 'q2',
      question: '(FE question type) A disk queue holds requests for cylinders, in order: 10, 22, 20, 2, 40, 6, 38. The head is at cylinder 20, moving towards higher cylinders. What is the total head movement with the elevator algorithm?|||(Dạng câu FE) Hàng đợi đĩa có các yêu cầu cho cylinder, theo thứ tự: 10, 22, 20, 2, 40, 6, 38. Đầu từ đang ở cylinder 20, đi về phía cylinder lớn hơn. Tổng quãng đường đầu từ với thuật toán thang máy là bao nhiêu?',
      options: ['56|||56', '58|||58', '60|||60', '146|||146'],
      correctIndex: 1,
      points: 1,
      explanation: "Computed by the simulator: 20 is served at once (0), then 22, 38, 40 going up (20 cylinders), then the arm reverses at the last request and goes down to 10, 6, 2 (38 cylinders): 58. The book's elevator turns at the last request (LOOK), it does not run to the edge. 56 is what you get starting downwards, 146 is FCFS. Lesson 5.B, slide 33.|||Bộ mô phỏng tính: 20 được phục vụ ngay (0), rồi 22, 38, 40 khi đi lên (20 cylinder), rồi cần đảo chiều ở yêu cầu cuối và đi xuống 10, 6, 2 (38 cylinder): 58. Thang máy của sách quay đầu ở yêu cầu cuối (LOOK), không chạy ra mép đĩa. 56 là kết quả nếu bắt đầu đi xuống, 146 là FCFS. Bài 5.B, slide 33." },
    { id: 'q3',
      question: '(FE question type) What kind of memory addresses do most DMA controllers use for a transfer?|||(Dạng câu FE) Phần lớn bộ điều khiển DMA dùng loại địa chỉ bộ nhớ nào khi truyền?',
      options: ['Virtual addresses of the user process|||Địa chỉ ảo của tiến trình người dùng', 'Logical addresses of the file|||Địa chỉ logic của tệp', 'Physical memory addresses|||Địa chỉ bộ nhớ vật lý', 'I/O port numbers|||Số hiệu cổng I/O'],
      correctIndex: 2,
      points: 1,
      explanation: "The DMA controller sits on the bus next to memory, below the MMU, so it uses physical addresses; the driver must translate the buffer's virtual address (and pin the pages) before programming it. I/O port numbers address controller registers, not memory. Lesson 5.A, slide 6.|||Bộ điều khiển DMA nằm trên bus cạnh bộ nhớ, bên dưới MMU, nên nó dùng địa chỉ vật lý; driver phải dịch địa chỉ ảo của bộ đệm (và ghim các trang) trước khi lập trình nó. Số hiệu cổng I/O dùng để định địa chỉ thanh ghi bộ điều khiển, không phải bộ nhớ. Bài 5.A, slide 6." },
    { id: 'q4',
      question: '(FE question type) Which of these jobs is done by the device-independent I/O software?|||(Dạng câu FE) Việc nào sau đây do phần mềm I/O độc lập thiết bị làm?',
      options: ['Computing the track, sector and head for a disk read|||Tính rãnh, sector và đầu từ cho một lần đọc đĩa', 'Converting binary integers to ASCII for printing|||Đổi số nguyên nhị phân sang ASCII để in', 'Waking up the driver when the I/O has completed|||Đánh thức driver khi I/O đã xong', 'Checking whether the user is permitted to use the device|||Kiểm xem người dùng có được phép dùng thiết bị không'],
      correctIndex: 3,
      points: 1,
      explanation: 'Protection (with naming, buffering, error reporting, allocation of dedicated devices and a uniform block size) belongs to the device-independent layer — in UNIX it is the same rwx check as for files. Track/sector/head is the driver, integer-to-ASCII is user-level software (printf), waking the driver is the interrupt handler. Lesson 5.A, slides 19 and 23.|||Bảo vệ (cùng đặt tên, đệm, báo lỗi, cấp phát thiết bị dành riêng và cỡ khối thống nhất) thuộc tầng độc lập thiết bị — trong UNIX đó là cùng phép kiểm rwx như với tệp. Rãnh/sector/đầu từ là việc của driver, đổi số nguyên sang ASCII là phần mềm mức người dùng (printf), đánh thức driver là trình xử lý ngắt. Bài 5.A, slide 19 và 23.' },
    { id: 'q5',
      question: '(FE question type) A modem delivers 7,000 characters per second. It is run with interrupt-driven I/O, and each character costs one interrupt that takes 10 µs in total to service. What fraction of the CPU does the interrupt overhead cost?|||(Dạng câu FE) Một modem đưa vào 7.000 ký tự mỗi giây. Nó chạy bằng I/O hướng ngắt, và mỗi ký tự tốn một ngắt mất tổng cộng 10 µs để phục vụ. Chi phí ngắt chiếm bao nhiêu phần CPU?',
      options: ['4% of the CPU|||4% CPU', '93% of the CPU|||93% CPU', '7% of the CPU|||7% CPU', '96% of the CPU|||96% CPU'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: 7,000 interrupts × 10 µs = 70,000 µs = 70 ms of every second = 7% of the CPU. 93% is the part left for other work, not the overhead. Lesson 5.A, slide 13, and lesson 5.C, exercise 2.|||Output của chương trình thật: 7.000 ngắt × 10 µs = 70.000 µs = 70 ms trong mỗi giây = 7% CPU. 93% là phần còn lại cho việc khác, không phải chi phí. Bài 5.A, slide 13, và bài 5.C, bài tập 2.' },
    { id: 'q6',
      question: '(FE question type) Which RAID level works worst with operating systems that habitually ask for data one sector at a time?|||(Dạng câu FE) Mức RAID nào chạy tệ nhất với hệ điều hành quen hỏi dữ liệu từng sector một?',
      options: ['RAID 0|||RAID 0', 'RAID 1|||RAID 1', 'RAID 2|||RAID 2', 'RAID 3|||RAID 3'],
      correctIndex: 0,
      points: 1,
      explanation: 'The book says it about RAID level 0: striping pays off only for large requests that span several drives; a one-sector request touches one drive, so the result is correct but there is no parallelism and no gain. Warning: the FE question bank marks 3 (FE2#34, FE15#41) or 2 (FE8#38) for this exact sentence — those keys contradict the textbook. Lesson 5.B, slide 26.|||Sách nói câu này về RAID mức 0: chia sọc chỉ có lợi với yêu cầu lớn trải trên nhiều ổ; yêu cầu một sector chỉ chạm một ổ, nên kết quả vẫn đúng nhưng không có song song và không được lợi gì. Cảnh báo: ngân hàng câu hỏi FE đánh dấu 3 (FE2#34, FE15#41) hoặc 2 (FE8#38) cho đúng câu này — các đáp án đó trái với giáo trình. Bài 5.B, slide 26.' },
    { id: 'q7',
      question: '(FE question type) How much cylinder skew is needed for a 3600-rpm disk with a track-to-track seek time of 1 ms? The disk has 200 sectors of 512 bytes on each track.|||(Dạng câu FE) Cần độ lệch trụ bao nhiêu cho một đĩa 3600 vòng/phút với thời gian seek giữa hai rãnh 1 ms? Đĩa có 200 sector 512 byte trên mỗi rãnh.',
      options: ['24 sectors|||24 sector', '36 sectors|||36 sector', '18 sectors|||18 sector', '12 sectors|||12 sector'],
      correctIndex: 3,
      points: 1,
      explanation: 'Output of the real program: one revolution = 60 s / 3600 = 16.67 ms; one sector passes every 16.67 ms / 200 = 83.3 µs; during the 1 ms seek, 1000 / 83.3 = 12 sectors pass, so sector 0 of the next track must be shifted by 12. The 512 bytes are a distractor. 18 is the answer for 5400 rpm (FE26#3). Lesson 5.B, slide 29.|||Output của chương trình thật: một vòng = 60 giây / 3600 = 16,67 ms; cứ 16,67 ms / 200 = 83,3 µs có một sector trôi qua; trong 1 ms seek, 1000 / 83,3 = 12 sector trôi qua, nên sector 0 của rãnh kế phải dịch đi 12. 512 byte là thông tin gây nhiễu. 18 là đáp án cho 5400 vòng/phút (FE26#3). Bài 5.B, slide 29.' },
    { id: 'q8',
      question: '(FE question type) A programmable clock in square-wave mode is driven by a 500-MHz crystal. Which value must be loaded into the holding register to get a clock tick every 10 ms?|||(Dạng câu FE) Một đồng hồ lập trình được ở chế độ sóng vuông chạy bằng thạch anh 500 MHz. Phải nạp giá trị nào vào thanh ghi giữ để có một tick đồng hồ mỗi 10 ms?',
      options: ['500,000|||500.000', '5,000,000|||5.000.000', '50,000|||50.000', '50,000,000|||50.000.000'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: the counter is decremented on every pulse, 500 million pulses per second, so a 10 ms interval needs 500,000,000 × 0.01 = 5,000,000 pulses. 50,000 would give a 100 µs tick (FE26#16). Lesson 5.B, slide 37.|||Output của chương trình thật: bộ đếm giảm sau mỗi xung, 500 triệu xung mỗi giây, nên khoảng 10 ms cần 500.000.000 × 0,01 = 5.000.000 xung. 50.000 sẽ cho tick mỗi 100 µs (FE26#16). Bài 5.B, slide 37.' },
    { id: 'q9',
      question: 'A program reads one line from a Linux terminal in canonical (cooked) mode. The user types a, b, c, DEL, d, CTRL-U, x, y, z, ENTER. What does the program receive (before the newline)?|||Một chương trình đọc một dòng từ terminal Linux ở chế độ chính tắc (đã nấu). Người dùng gõ a, b, c, DEL, d, CTRL-U, x, y, z, ENTER. Chương trình nhận được gì (trước ký tự xuống dòng)?',
      options: ['abcdxyz|||abcdxyz', 'abdxyz|||abdxyz', 'xyz|||xyz', 'abc^?d^Uxyz|||abc^?d^Uxyz'],
      correctIndex: 2,
      points: 1,
      explanation: "Output of the real run through a pseudo-terminal: xyz. In canonical mode the terminal driver edits the line before the program sees it — DEL (erase on today's Linux) removes the c, then CTRL-U (kill) erases the whole line \"abd\", and only \"xyz\" plus the newline are delivered on ENTER. Option D is what a program in raw mode would receive. Lesson 5.B, slide 42.|||Output của lần chạy thật qua một terminal giả: xyz. Ở chế độ chính tắc, driver terminal sửa dòng trước khi chương trình thấy nó — DEL (xoá lùi trên Linux ngày nay) bỏ chữ c, rồi CTRL-U (kill) xoá cả dòng \"abd\", và khi nhấn ENTER chỉ \"xyz\" cùng ký tự xuống dòng được chuyển đi. Phương án D là thứ một chương trình ở chế độ thô nhận được. Bài 5.B, slide 42." },
    { id: 'q10',
      question: "(FE question type) With memory-mapped I/O, a driver waits in a loop for a device's status register to say READY. What must the hardware support so that this loop does not run forever?|||(Dạng câu FE) Với memory-mapped I/O, driver chờ trong một vòng lặp tới khi thanh ghi trạng thái của thiết bị báo READY. Phần cứng phải hỗ trợ điều gì để vòng lặp đó không chạy mãi?",
      options: ['Separate IN and OUT instructions for the registers|||Lệnh IN và OUT riêng cho các thanh ghi', 'Write-back caching of all memory pages|||Cache ghi trễ cho mọi trang bộ nhớ', 'Disabling interrupts during the loop|||Tắt ngắt trong lúc lặp', 'Selectively disabling caching, page by page|||Tắt cache có chọn lọc, theo từng trang'],
      correctIndex: 3,
      points: 1,
      explanation: "If the status register's page were cached, the first read would load the value into the cache and every later read would hit the stale copy — the loop would never see READY. The hardware must be able to turn caching off for device pages (Linux does it with ioremap). IN/OUT instructions belong to the other scheme, separate I/O space; disabling interrupts does not help. Lesson 5.A, slide 5.|||Nếu trang của thanh ghi trạng thái bị cache, lần đọc đầu nạp giá trị vào cache và mọi lần đọc sau trúng bản cũ — vòng lặp sẽ không bao giờ thấy READY. Phần cứng phải tắt được cache cho các trang thiết bị (Linux làm bằng ioremap). Lệnh IN/OUT thuộc cách kia, không gian I/O riêng; tắt ngắt chẳng giúp gì. Bài 5.A, slide 5." },
  ],
};

export default {
  slides: [L_osg5_1, L_osg5_2],
  practice: L_on_ch5,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 5 viết lại theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán và câu "in ra gì" có đáp án kiểm bằng bộ mô phỏng hoặc chương trình chạy thật: thời gian tìm của SSF, thuật toán thang máy, địa chỉ DMA dùng, việc của tầng độc lập thiết bị, chi phí ngắt của modem, mức RAID kém nhất với yêu cầu từng sector, độ lệch trụ, thanh ghi giữ của đồng hồ, chế độ chính tắc của terminal và memory-mapped I/O với cache.',
};
