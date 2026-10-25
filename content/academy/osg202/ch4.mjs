/**
 * OSG202 · Chương 4 — File Systems (osg4: 4.A 1–28, 4.B 29–49).
 * Bài 📑 học theo từng slide: osg4 (tmp_04.pptx, slide 1–49).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch4.
 * Quiz viết lại (10 câu, giữ slug osg202-quiz-ch4).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 4.A — 📑 Slide by slide · File Systems: files, directories, FAT, i-nodes, links, journaling, VFS (slides 1–28) ───────── */
const L_osg4_1 = {
  title: '4.A — 📑 Slide by slide · File Systems: files, directories, FAT, i-nodes, links, journaling, VFS (slides 1–28)|||4.A — 📑 Học theo từng slide · File Systems: tệp, thư mục, FAT, i-node, liên kết, nhật ký, VFS (slide 1–28)',
  slug: 'osg202-slide-osg4-1',
  type: 'VIDEO',
  description: 'Giảng đủ 28 slide đầu của Chương 4 (Tanenbaum, Modern Operating Systems 4e): ba yêu cầu của lưu trữ lâu dài, đĩa là dãy khối, đặt tên và phần mở rộng, cấu trúc và kiểu tệp, thuộc tính và 11 thao tác trên tệp, chương trình chép tệp Hình 4-5 (bản in không biên dịch được — chạy thật với -DTRUE=1 và đếm lời gọi hệ thống), thư mục một cấp và phân cấp, đường dẫn, bố cục đĩa MBR + superblock dựng thật, cấp phát liên tục, danh sách liên kết, FAT (đọc chuỗi cluster thật trong ảnh FAT-16), i-node với khối gián tiếp (ext2 thật qua debugfs), cài đặt thư mục, liên kết cứng và mềm, hệ thống tệp có nhật ký (rút điện thật rồi để e2fsck phát lại nhật ký) và VFS — kèm mô phỏng tính toán và chỗ slide sai hay lỗi thời.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.A · deck "Chapter 4 · File Systems", slides 1–28</span>
<h2>Files, directories, and how a file system turns a disk of blocks into named files</h2>
<p class="lead">The first part of the deck follows sections 4.1–4.3 of the book. It starts from what a user sees — files with names, types, attributes and operations, arranged in directories — and then opens the disk to show how a file system is <em>implemented</em>: the layout of a partition, four ways to remember which blocks belong to a file (contiguous, linked list, FAT, i-node), how directories are stored, how one file can live in two directories, how a journal survives a power cut, and how Linux puts many file systems behind one interface (the VFS). Almost every figure is rebuilt for real in the course container: we format disk images, write files, and then read the raw bytes ourselves.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>Chapter 4 intro</td><td>state the three requirements for long-term storage and the "read block k / write block k" view of a disk</td></tr>
<tr><td>5–12</td><td>4.1 Files</td><td>explain naming, structure, types, attributes and the 11 file operations; run and trace the copy program of Figure 4-5</td></tr>
<tr><td>13–16</td><td>4.2 Directories</td><td>compare single-level and hierarchical directories, use absolute and relative paths, list the directory operations</td></tr>
<tr><td>17–21</td><td>4.3.1–4.3.2 Layout, implementing files</td><td>draw a disk layout; compare contiguous, linked-list, FAT and i-node allocation</td></tr>
<tr><td>22–25</td><td>4.3.3–4.3.4 Directories, shared files</td><td>say where attributes live, how long names are stored, hard vs symbolic links</td></tr>
<tr><td>26–28</td><td>4.3.6–4.3.7 Journaling, VFS</td><td>explain why a journal makes crashes safe and how the VFS dispatches read() to the right file system</td></tr>
</tbody>
</table>
<div class="callout">The older web lessons 4.1 and 4.2 further down stay as short summaries (4.2 has a worked "where is byte 5,000,000?" example and the rwx permission rules). This lesson refers to them instead of repeating them, and Chapter 1 lesson 1.B already showed hard links (Figure 1-21) and mount — here we go one level deeper.</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.A · deck "Chapter 4 · File Systems", slide 1–28</span>
<h2>Tệp, thư mục, và cách hệ thống tệp biến một cái đĩa đầy khối thành các tệp có tên</h2>
<p class="lead">Phần đầu bộ slide đi theo mục 4.1–4.3 của sách. Nó bắt đầu từ thứ người dùng nhìn thấy — tệp có tên, kiểu, thuộc tính và các thao tác, xếp trong thư mục — rồi mới mở cái đĩa ra để thấy hệ thống tệp được <em>cài đặt</em> thế nào: bố cục của một phân vùng, bốn cách nhớ khối nào thuộc tệp nào (liên tục, danh sách liên kết, FAT, i-node), thư mục được lưu ra sao, một tệp nằm trong hai thư mục bằng cách nào, nhật ký (journal) giúp sống sót khi mất điện ra sao, và Linux đặt nhiều hệ thống tệp sau một giao diện chung (VFS) thế nào. Gần như hình nào cũng được dựng lại thật trong container của môn: ta định dạng ảnh đĩa, ghi tệp, rồi tự đọc từng byte thô.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>Mở đầu Chương 4</td><td>nêu ba yêu cầu của lưu trữ lâu dài và cách nhìn đĩa là "đọc khối k / ghi khối k"</td></tr>
<tr><td>5–12</td><td>4.1 Tệp</td><td>giải thích cách đặt tên, cấu trúc, kiểu, thuộc tính và 11 thao tác trên tệp; chạy và theo dõi chương trình chép tệp Hình 4-5</td></tr>
<tr><td>13–16</td><td>4.2 Thư mục</td><td>so sánh thư mục một cấp và phân cấp, dùng đường dẫn tuyệt đối và tương đối, kể các thao tác trên thư mục</td></tr>
<tr><td>17–21</td><td>4.3.1–4.3.2 Bố cục, cài đặt tệp</td><td>vẽ bố cục đĩa; so sánh cấp phát liên tục, danh sách liên kết, FAT và i-node</td></tr>
<tr><td>22–25</td><td>4.3.3–4.3.4 Thư mục, tệp dùng chung</td><td>nói được thuộc tính nằm ở đâu, tên dài lưu thế nào, liên kết cứng và mềm</td></tr>
<tr><td>26–28</td><td>4.3.6–4.3.7 Nhật ký, VFS</td><td>giải thích vì sao nhật ký làm sự cố mất điện an toàn và VFS chuyển read() tới đúng hệ thống tệp ra sao</td></tr>
</tbody>
</table>
<div class="callout">Hai bài web cũ 4.1 và 4.2 phía dưới vẫn giữ làm bản tóm tắt ngắn (4.2 có ví dụ "byte thứ 5.000.000 nằm ở đâu?" và luật quyền rwx). Bài này dẫn sang chúng thay vì lặp lại; còn bài 1.B của Chương 1 đã cho thấy liên kết cứng (Hình 1-21) và mount — ở đây ta đi sâu thêm một tầng.</div>`),
    walkHead('osg4', 1, 28),
    walk('osg4', [
      [1, 'File Systems',
        `<p class="y-chinh">🎯 Chapter 4 of <em>Modern Operating Systems</em> — file systems: how the OS stores information that must outlive every program, on devices that only know numbered blocks. Syllabus sessions on CLO4 (file management); the FE asks many questions here, including calculations (maximum file size with i-nodes, FAT partition limits, space efficiency).</p>
<p>So far the course has built two abstractions: the <strong>process</strong> (an abstraction of the CPU, Chapter 2) and the <strong>address space</strong> (an abstraction of memory, Chapter 3). This chapter builds the third: the <strong>file</strong>, an abstraction of the disk. The part of the OS that implements it is the <strong>file system</strong>.</p>
<p>Two points of view run through the whole chapter: the <em>user's</em> view (names, directories, operations — slides 5–16) and the <em>implementer's</em> view (blocks, i-nodes, free lists, caches — slides 17–45).</p>
<p class="meo">🧠 Everything in UNIX that you can open, read and write — a document, a directory, a disk, a pipe, /proc — goes through the file-system interface. Learn this chapter well and Linux stops being mysterious.</p>`,
        `<p class="y-chinh">🎯 Chương 4 của <em>Modern Operating Systems</em> — hệ thống tệp (file system): cách HĐH lưu thông tin phải sống lâu hơn mọi chương trình, trên những thiết bị chỉ biết các khối được đánh số. Đây là các buổi của CLO4 (quản lý tệp); đề FE hỏi rất nhiều ở chương này, kể cả câu tính toán (cỡ tệp tối đa với i-node, giới hạn phân vùng FAT, hiệu suất dùng chỗ).</p>
<p>Tới giờ môn học đã dựng hai trừu tượng: <strong>tiến trình (process)</strong> — trừu tượng của CPU (Chương 2) — và <strong>không gian địa chỉ (address space)</strong> — trừu tượng của bộ nhớ (Chương 3). Chương này dựng cái thứ ba: <strong>tệp (file)</strong>, trừu tượng của đĩa. Phần HĐH cài đặt nó là <strong>hệ thống tệp</strong>.</p>
<p>Hai góc nhìn chạy suốt chương: góc nhìn của <em>người dùng</em> (tên, thư mục, thao tác — slide 5–16) và góc nhìn của <em>người cài đặt</em> (khối, i-node, danh sách khối trống, bộ đệm — slide 17–45).</p>
<p class="meo">🧠 Mọi thứ trong UNIX mà bạn mở, đọc, ghi được — một văn bản, một thư mục, một cái đĩa, một pipe, /proc — đều đi qua giao diện hệ thống tệp. Học kỹ chương này thì Linux hết bí ẩn.</p>`],
      [2, 'File Systems (1)',
        `<p class="y-chinh">🎯 Three essential requirements for long-term information storage: (1) store a <strong>very large</strong> amount of information; (2) the information must <strong>survive the termination</strong> of the process using it; (3) <strong>multiple processes</strong> must be able to access it concurrently.</p>
<p>Why not just keep data in a process's address space? Because each requirement fails there: the address space is limited (a few GB of RAM, while a database can be terabytes); it disappears when the process ends (or crashes, or the power goes); and it is private to one process, so a second program cannot read it. The book's example is an airline reservation system: the bookings must outlive any one program, be far larger than memory, and be shared by many agents at once.</p>
<p>➕ Requirement 2, seen for real: the same program runs three times. A counter kept in a <em>variable</em> starts from zero every time; a counter kept in a <em>file</em> remembers:</p>
<pre><code class="language-c">// Requirement 2 of slide 2: memory dies with the process, a file survives it
#include &lt;stdio.h&gt;

int in_memory = 0;                                   // a variable: lives only as long as the process

int main(void) {
    in_memory++;
    int in_file = 0;
    FILE *f = fopen("counter.txt", "r");             // read the counter saved by the PREVIOUS run, if any
    if (f) { fscanf(f, "%d", &amp;in_file); fclose(f); }
    in_file++;
    f = fopen("counter.txt", "w");                   // save it for the NEXT run
    fprintf(f, "%d\\n", in_file);
    fclose(f);
    printf("run: counter in memory = %d, counter in file = %d\\n", in_memory, in_file);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ben-vung.c -o ben-vung &amp;&amp; ./ben-vung; ./ben-vung; ./ben-vung<br>
run: counter in memory = 1, counter in file = 1<br>
run: counter in memory = 1, counter in file = 2<br>
run: counter in memory = 1, counter in file = 3</div>
<p>Each run is a new process with a fresh address space, so <code>in_memory</code> is always 1. The file <code>counter.txt</code> is outside every process — it is owned by the file system — so it grows 1, 2, 3.</p>
<p class="pitfall">⚠️ "Information must survive termination of the process using it" is the FE's wording for <strong>persistence</strong>; do not confuse it with requirement 3 (concurrent access), which is about sharing.</p>`,
        `<p class="y-chinh">🎯 Ba yêu cầu cốt lõi của lưu trữ thông tin lâu dài: (1) lưu được một lượng thông tin <strong>rất lớn</strong>; (2) thông tin phải <strong>sống sót khi tiến trình đang dùng nó kết thúc</strong>; (3) <strong>nhiều tiến trình</strong> phải truy cập được nó cùng lúc.</p>
<p>Sao không giữ dữ liệu luôn trong không gian địa chỉ của tiến trình? Vì yêu cầu nào cũng hỏng ở đó: không gian địa chỉ có hạn (vài GB RAM, trong khi một cơ sở dữ liệu có thể nhiều terabyte); nó biến mất khi tiến trình kết thúc (hoặc sập, hoặc mất điện); và nó riêng của một tiến trình, chương trình thứ hai không đọc được. Ví dụ của sách là hệ thống đặt vé máy bay: dữ liệu đặt chỗ phải sống lâu hơn mọi chương trình, lớn hơn bộ nhớ rất nhiều, và được nhiều nhân viên dùng cùng lúc.</p>
<p>➕ Yêu cầu 2, xem tận mắt: cùng một chương trình chạy ba lần. Biến đếm giữ trong <em>biến</em> lần nào cũng bắt đầu lại từ 0; biến đếm giữ trong <em>tệp</em> thì nhớ được:</p>
<pre><code class="language-c">// Yêu cầu 2 của slide 2: bộ nhớ chết theo tiến trình, tệp thì sống sót
#include &lt;stdio.h&gt;

int in_memory = 0;                                   // một biến: chỉ sống bằng tuổi tiến trình

int main(void) {
    in_memory++;
    int in_file = 0;
    FILE *f = fopen("counter.txt", "r");             // đọc biến đếm lần chạy TRƯỚC đã lưu, nếu có
    if (f) { fscanf(f, "%d", &amp;in_file); fclose(f); }
    in_file++;
    f = fopen("counter.txt", "w");                   // lưu lại cho lần chạy SAU
    fprintf(f, "%d\\n", in_file);
    fclose(f);
    printf("run: counter in memory = %d, counter in file = %d\\n", in_memory, in_file);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ben-vung.c -o ben-vung &amp;&amp; ./ben-vung; ./ben-vung; ./ben-vung<br>
run: counter in memory = 1, counter in file = 1<br>
run: counter in memory = 1, counter in file = 2<br>
run: counter in memory = 1, counter in file = 3</div>
<p>Mỗi lần chạy là một tiến trình mới với không gian địa chỉ mới tinh, nên <code>in_memory</code> luôn là 1. Tệp <code>counter.txt</code> nằm ngoài mọi tiến trình — nó thuộc về hệ thống tệp — nên nó tăng 1, 2, 3.</p>
<p class="pitfall">⚠️ "Information must survive termination of the process using it" là cách FE nói về <strong>tính bền vững (persistence)</strong>; đừng nhầm với yêu cầu 3 (truy cập đồng thời) — yêu cầu đó nói về chia sẻ.</p>`],
      [3, 'File Systems (2)',
        `<p class="y-chinh">🎯 The hardware view: think of a disk as a <strong>linear sequence of fixed-size blocks</strong> that supports only two operations — <strong>read block k</strong> and <strong>write block k</strong>.</p>
<p>That is all a disk (or SSD, or USB stick) offers: no names, no directories, no "file". Blocks are numbered 0, 1, 2, … and have one size (512 bytes or 4 KB on today's drives). The disk does not know which block belongs to whom; everything else in this chapter is software built on these two operations. (The book adds: think of it this way even though real disks have cylinders and heads — the driver hides that, Chapter 5.)</p>
<p>➕ A 1 MB file plays the role of a disk with 256 blocks of 4096 bytes. <code>dd</code> with <code>seek</code>/<code>skip</code> is exactly "write block k" and "read block k":</p>
<div class="out"># Slide 3: a disk is just "read block k / write block k" — a 1 MB image file plays the disk<br>
$ truncate -s 1M disk.img<br>
# the "disk" has 256 blocks of 4096 bytes, all zero<br>
$ echo $(( $(stat -c %s disk.img) / 4096 )) blocks<br>
256 blocks<br>
# write block 5 = skip 5 blocks, write one block (conv=notrunc: do not cut the disk short)<br>
$ printf 'hello, block 5' | dd of=disk.img bs=4096 seek=5 conv=notrunc status=none<br>
# read block 5 back, and block 6 for comparison<br>
$ dd if=disk.img bs=4096 skip=5 count=1 status=none | od -A d -c | head -2<br>
0000000 &nbsp;&nbsp;h &nbsp;&nbsp;e &nbsp;&nbsp;l &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;c &nbsp;&nbsp;k &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;\\0 &nbsp;\\0<br>
0000016 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
$ dd if=disk.img bs=4096 skip=6 count=1 status=none | od -A d -c | head -2<br>
0000000 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
*<br>
# the byte address of block k is k * 4096<br>
$ od -A d -c -j $((5 * 4096)) -N 16 disk.img<br>
0020480 &nbsp;&nbsp;h &nbsp;&nbsp;e &nbsp;&nbsp;l &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;c &nbsp;&nbsp;k &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;\\0 &nbsp;\\0<br>
0020496</div>
<p>Block 5 starts at byte 5 × 4096 = 20480, which is what <code>od -j</code> confirms. Block 6 is still all zeros. Every file system you meet later — FAT, ext4, NTFS — is a set of rules for deciding <em>which</em> k to read and write.</p>
<p class="meo">🧠 On Linux a real disk is a <strong>block special file</strong> such as <code>/dev/sda</code> or <code>/dev/nvme0n1</code>: the same <code>dd if=/dev/sda bs=4096 skip=5 count=1</code> reads block 5 of the physical drive (as root).</p>`,
        `<p class="y-chinh">🎯 Góc nhìn phần cứng: hãy coi đĩa là một <strong>dãy tuyến tính các khối cỡ cố định</strong> chỉ hỗ trợ hai thao tác — <strong>đọc khối k</strong> và <strong>ghi khối k</strong>.</p>
<p>Đĩa (hay SSD, hay USB) chỉ cho có thế: không tên, không thư mục, không có "tệp". Các khối được đánh số 0, 1, 2, … và cùng một cỡ (512 byte hoặc 4 KB trên ổ ngày nay). Đĩa không biết khối nào của ai; mọi thứ còn lại trong chương là phần mềm dựng trên hai thao tác này. (Sách thêm: cứ nghĩ như vậy dù đĩa thật có cylinder và đầu đọc — driver giấu chuyện đó đi, Chương 5.)</p>
<p>➕ Một tệp 1 MB đóng vai cái đĩa có 256 khối 4096 byte. <code>dd</code> với <code>seek</code>/<code>skip</code> chính là "ghi khối k" và "đọc khối k":</p>
<div class="out"># Slide 3: đĩa chỉ là "đọc khối k / ghi khối k" — một tệp ảnh 1 MB đóng vai cái đĩa<br>
$ truncate -s 1M disk.img<br>
# "đĩa" có 256 khối 4096 byte, toàn số 0<br>
$ echo $(( $(stat -c %s disk.img) / 4096 )) blocks<br>
256 blocks<br>
# ghi khối 5 = bỏ qua 5 khối, ghi một khối (conv=notrunc: không cắt ngắn đĩa)<br>
$ printf 'hello, block 5' | dd of=disk.img bs=4096 seek=5 conv=notrunc status=none<br>
# đọc lại khối 5, và khối 6 để so sánh<br>
$ dd if=disk.img bs=4096 skip=5 count=1 status=none | od -A d -c | head -2<br>
0000000 &nbsp;&nbsp;h &nbsp;&nbsp;e &nbsp;&nbsp;l &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;c &nbsp;&nbsp;k &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;\\0 &nbsp;\\0<br>
0000016 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
$ dd if=disk.img bs=4096 skip=6 count=1 status=none | od -A d -c | head -2<br>
0000000 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
*<br>
# địa chỉ byte của khối k là k * 4096<br>
$ od -A d -c -j $((5 * 4096)) -N 16 disk.img<br>
0020480 &nbsp;&nbsp;h &nbsp;&nbsp;e &nbsp;&nbsp;l &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;c &nbsp;&nbsp;k &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;\\0 &nbsp;\\0<br>
0020496</div>
<p>Khối 5 bắt đầu ở byte 5 × 4096 = 20480, đúng như <code>od -j</code> xác nhận. Khối 6 vẫn toàn số 0. Mọi hệ thống tệp bạn gặp sau này — FAT, ext4, NTFS — đều là một bộ luật để quyết định đọc và ghi khối k <em>nào</em>.</p>
<p class="meo">🧠 Trên Linux, một đĩa thật là một <strong>tệp đặc biệt kiểu khối (block special file)</strong> như <code>/dev/sda</code> hay <code>/dev/nvme0n1</code>: cùng lệnh <code>dd if=/dev/sda bs=4096 skip=5 count=1</code> đọc khối 5 của ổ vật lý (với quyền root).</p>`],
      [4, 'File Systems (3)',
        `<p class="y-chinh">🎯 Questions that quickly arise with "just blocks": (1) how do you <strong>find</strong> information? (2) how do you keep one user from <strong>reading another user's</strong> data? (3) how do you know <strong>which blocks are free</strong>?</p>
<p>These three questions are the table of contents of the chapter. The answer to all of them is a new abstraction: the <strong>file</strong> — a named, protected unit of information created by processes, which the OS manages. Processes no longer think about blocks; the file system answers the three questions on their behalf:</p>
<table>
<thead><tr><th>Question</th><th>Answer in this chapter</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>How to find information?</td><td>names → directories → i-nodes → block addresses</td><td>13–16, 21–23, 45</td></tr>
<tr><td>How to protect it?</td><td>attributes (owner, protection bits), checked on every open</td><td>8, and lesson 4.2 (rwx)</td></tr>
<tr><td>Which blocks are free?</td><td>a free list or a bitmap, kept on the disk itself</td><td>29–32</td></tr>
<tr><td>And if the power fails in the middle?</td><td>journaling, consistency checks, backups</td><td>26, 34–37</td></tr>
</tbody>
</table>
<p>The book also notes that files are as important to the user as processes: users judge an OS largely by its file system — how files are named, protected and how fast they are.</p>
<p class="meo">🧠 A <strong>file</strong> is a logical unit of information created by processes; a <strong>file system</strong> is the part of the OS that manages files. FE: "Which of the following is NOT a task of file management?" — allocating and freeing <em>memory</em> is not (FE21 question 18).</p>`,
        `<p class="y-chinh">🎯 Các câu hỏi nảy ra ngay khi "chỉ có khối": (1) làm sao <strong>tìm</strong> được thông tin? (2) làm sao giữ cho người này <strong>không đọc được dữ liệu của người khác</strong>? (3) làm sao biết <strong>khối nào còn trống</strong>?</p>
<p>Ba câu hỏi này chính là mục lục của chương. Câu trả lời chung là một trừu tượng mới: <strong>tệp</strong> — một đơn vị thông tin có tên, được bảo vệ, do tiến trình tạo ra và HĐH quản lý. Tiến trình không còn nghĩ về khối nữa; hệ thống tệp trả lời ba câu hỏi thay cho chúng:</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Câu trả lời trong chương</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Tìm thông tin thế nào?</td><td>tên → thư mục → i-node → địa chỉ khối</td><td>13–16, 21–23, 45</td></tr>
<tr><td>Bảo vệ thế nào?</td><td>thuộc tính (chủ sở hữu, bit bảo vệ), kiểm mỗi lần open</td><td>8, và bài 4.2 (rwx)</td></tr>
<tr><td>Khối nào trống?</td><td>danh sách khối trống hoặc bitmap, lưu ngay trên đĩa</td><td>29–32</td></tr>
<tr><td>Mất điện giữa chừng thì sao?</td><td>nhật ký, kiểm tra nhất quán, sao lưu</td><td>26, 34–37</td></tr>
</tbody>
</table>
<p>Sách còn nhận xét tệp quan trọng với người dùng không kém tiến trình: người dùng đánh giá một HĐH phần lớn qua hệ thống tệp của nó — đặt tên thế nào, bảo vệ thế nào, nhanh tới đâu.</p>
<p class="meo">🧠 <strong>Tệp</strong> là đơn vị thông tin logic do tiến trình tạo ra; <strong>hệ thống tệp</strong> là phần HĐH quản lý tệp. FE: "Việc nào KHÔNG phải nhiệm vụ quản lý tệp?" — cấp phát và thu hồi <em>bộ nhớ</em> thì không (FE21 câu 18).</p>`],
      [5, 'File Naming',
        `<p class="y-chinh">🎯 Figure 4-1: some typical file extensions — <code>.bak</code> backup, <code>.c</code> C source, <code>.gif</code>, <code>.jpg</code> images, <code>.html</code>, <code>.mp3</code>, <code>.mpg</code>, <code>.o</code> object file (compiler output, not yet linked), <code>.pdf</code>, <code>.ps</code>, <code>.tex</code>, <code>.txt</code>, <code>.zip</code> compressed archive.</p>
<p>When a process creates a file it gives it a <strong>name</strong>; when the process ends, the file and its name remain. Rules differ by system: MS-DOS allowed 1–8 characters plus a 3-character extension ("8.3"); UNIX allows long names, is <strong>case-sensitive</strong> (<code>Readme</code> and <code>readme</code> are two files) and treats the extension as a mere convention. Windows (NTFS) keeps case but by default ignores it when looking names up, and Windows itself <em>does</em> use the extension to decide which program opens a file.</p>
<p>➕ On Linux, <code>file</code> ignores the name and looks at the content (the magic number at the start). But some <em>programs</em> do rely on extensions — gcc refuses a C program called <code>notes.txt</code>:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 5: on UNIX an extension is only a convention — file(1) looks at the bytes<br>
$ printf 'int main(void){return 0;}\\n' &gt; prog.c<br>
$ gcc prog.c -o prog<br>
$ cp prog photo.jpg<br>
$ cp prog.c notes.txt<br>
$ echo "just some text" | gzip &gt; report.pdf<br>
$ file prog prog.c photo.jpg notes.txt report.pdf<br>
prog: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=51eb0dcb5fe4dab84b61dda055e0c15f93ee17da, for GNU/Linux 3.7.0, not stripped<br>
prog.c: &nbsp;&nbsp;&nbsp;&nbsp;C source, ASCII text<br>
photo.jpg: &nbsp;ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=51eb0dcb5fe4dab84b61dda055e0c15f93ee17da, for GNU/Linux 3.7.0, not stripped<br>
notes.txt: &nbsp;C source, ASCII text<br>
report.pdf: gzip compressed data, from Unix, original size modulo 2^32 15<br>
# but some PROGRAMS do care: gcc decides the language from the extension<br>
$ gcc notes.txt -o x<br>
/usr/bin/ld:notes.txt: file format not recognized; treating as linker script<br>
/usr/bin/ld:notes.txt:1: syntax error<br>
collect2: error: ld returned 1 exit status<br>
# Linux names are case-sensitive and may be up to 255 bytes<br>
$ touch Readme readme README<br>
$ ls R* r*<br>
README<br>
Readme<br>
readme<br>
report.pdf<br>
$ getconf NAME_MAX .<br>
255</div>
<p>A compiled program renamed <code>photo.jpg</code> is still an ELF executable, and a gzip archive called <code>report.pdf</code> is still gzip. The last lines show three files differing only in case, and the limit <code>NAME_MAX</code> = 255 bytes per name component on Linux.</p>
<p class="pitfall">⚠️ FE asks "which extension is used for backup files?" (<code>.bak</code>, FE6 question 23), "for compressed archives?" (<code>.zip</code>, FE6 question 24) — straight from Figure 4-1. FE11 question 27 asks how many letters "all current operating systems allow as legal file names": the book's sentence is "strings of one to eight letters".</p>`,
        `<p class="y-chinh">🎯 Hình 4-1: vài phần mở rộng (extension) tệp điển hình — <code>.bak</code> tệp sao lưu, <code>.c</code> mã nguồn C, <code>.gif</code>, <code>.jpg</code> ảnh, <code>.html</code>, <code>.mp3</code>, <code>.mpg</code>, <code>.o</code> tệp đối tượng (đầu ra trình biên dịch, chưa liên kết), <code>.pdf</code>, <code>.ps</code>, <code>.tex</code>, <code>.txt</code>, <code>.zip</code> kho nén.</p>
<p>Khi tạo tệp, tiến trình đặt cho nó một <strong>tên</strong>; khi tiến trình kết thúc, tệp và tên vẫn còn. Luật mỗi hệ một khác: MS-DOS cho 1–8 ký tự cộng phần mở rộng 3 ký tự ("8.3"); UNIX cho tên dài, <strong>phân biệt hoa thường</strong> (<code>Readme</code> và <code>readme</code> là hai tệp) và coi phần mở rộng chỉ là quy ước. Windows (NTFS) giữ hoa thường nhưng mặc định không phân biệt khi tra tên, và chính Windows <em>có</em> dùng phần mở rộng để quyết định chương trình nào mở tệp.</p>
<p>➕ Trên Linux, lệnh <code>file</code> bỏ qua cái tên và nhìn nội dung (magic number ở đầu tệp). Nhưng vài <em>chương trình</em> thì dựa vào phần mở rộng — gcc từ chối chương trình C tên <code>notes.txt</code>:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 5: trên UNIX phần mở rộng chỉ là quy ước — lệnh file nhìn vào nội dung<br>
$ printf 'int main(void){return 0;}\\n' &gt; prog.c<br>
$ gcc prog.c -o prog<br>
$ cp prog photo.jpg<br>
$ cp prog.c notes.txt<br>
$ echo "just some text" | gzip &gt; report.pdf<br>
$ file prog prog.c photo.jpg notes.txt report.pdf<br>
prog: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=51eb0dcb5fe4dab84b61dda055e0c15f93ee17da, for GNU/Linux 3.7.0, not stripped<br>
prog.c: &nbsp;&nbsp;&nbsp;&nbsp;C source, ASCII text<br>
photo.jpg: &nbsp;ELF 64-bit LSB pie executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux-aarch64.so.1, BuildID[sha1]=51eb0dcb5fe4dab84b61dda055e0c15f93ee17da, for GNU/Linux 3.7.0, not stripped<br>
notes.txt: &nbsp;C source, ASCII text<br>
report.pdf: gzip compressed data, from Unix, original size modulo 2^32 15<br>
# nhưng vài CHƯƠNG TRÌNH thì để ý: gcc chọn ngôn ngữ theo phần mở rộng<br>
$ gcc notes.txt -o x<br>
/usr/bin/ld:notes.txt: file format not recognized; treating as linker script<br>
/usr/bin/ld:notes.txt:1: syntax error<br>
collect2: error: ld returned 1 exit status<br>
# tên trên Linux phân biệt hoa thường và dài tới 255 byte<br>
$ touch Readme readme README<br>
$ ls R* r*<br>
README<br>
Readme<br>
readme<br>
report.pdf<br>
$ getconf NAME_MAX .<br>
255</div>
<p>Chương trình đã biên dịch đổi tên thành <code>photo.jpg</code> vẫn là tệp thực thi ELF, và kho gzip tên <code>report.pdf</code> vẫn là gzip. Mấy dòng cuối cho thấy ba tệp chỉ khác hoa thường, và giới hạn <code>NAME_MAX</code> = 255 byte cho mỗi thành phần tên trên Linux.</p>
<p class="pitfall">⚠️ FE hỏi "phần mở rộng nào dùng cho tệp sao lưu?" (<code>.bak</code>, FE6 câu 23), "cho kho nén?" (<code>.zip</code>, FE6 câu 24) — lấy thẳng từ Hình 4-1. FE11 câu 27 hỏi "mọi HĐH hiện nay cho tên tệp hợp lệ dài bao nhiêu chữ": câu của sách là "chuỗi từ một tới tám chữ cái".</p>`],
      [6, 'File Structure',
        `<p class="y-chinh">🎯 Figure 4-2: three kinds of files — (a) an unstructured <strong>byte sequence</strong>; (b) a <strong>record sequence</strong> of fixed-length records; (c) a <strong>tree</strong> of records, each with a key field, sorted on the key (Ant, Fox, Pig at the top; Cat, Cow, Dog, Goat…).</p>
<p>(a) is what UNIX and Windows use: the OS does not know or care what is inside — meaning is imposed by programs. This gives maximum flexibility; a database, an image and a text file are all "just bytes". (b) was used by old mainframes in the days of 80-column punched cards: read and write work on whole records. (c) lets you fetch "the record with key Pony" without knowing its position; it was used on some large mainframes for commercial data processing.</p>
<p>➕ A "record file" on Linux is simply a convention your program follows on top of a byte sequence — fixed-size structs plus <code>lseek</code>:</p>
<pre><code class="language-c">// Slide 6: the OS sees a byte sequence; a "record file" is just a convention on top (fixed-size records + lseek)
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;

struct record { char name[12]; int score; };          // 16 bytes per record

int main(void) {
    int fd = open("students.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    const char *names[] = { "An", "Binh", "Cuong", "Dung" };
    for (int i = 0; i &lt; 4; i++) {
        struct record r = { 0 };
        strcpy(r.name, names[i]);
        r.score = 70 + 5 * i;
        write(fd, &amp;r, sizeof r);
    }
    printf("file size = %ld bytes = 4 records x %zu bytes\\n", (long)lseek(fd, 0, SEEK_END), sizeof(struct record));
    // record k starts at byte k * sizeof(record): jump straight to it
    struct record r;
    lseek(fd, 2 * sizeof r, SEEK_SET);
    read(fd, &amp;r, sizeof r);
    printf("record 2: %s %d\\n", r.name, r.score);
    // update record 1 in place (the "UPDATE" of old record-oriented systems)
    lseek(fd, 1 * sizeof r, SEEK_SET);
    read(fd, &amp;r, sizeof r);
    r.score = 99;
    lseek(fd, 1 * sizeof r, SEEK_SET);
    write(fd, &amp;r, sizeof r);
    close(fd);
    fflush(stdout);
    // to the OS it is still only bytes:
    return system("od -A d -t c -N 32 students.dat");
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ban-ghi.c -o ban-ghi &amp;&amp; ./ban-ghi<br>
file size = 64 bytes = 4 records x 16 bytes<br>
record 2: Cuong 80<br>
0000000 &nbsp;&nbsp;A &nbsp;&nbsp;n &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;&nbsp;F &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
0000016 &nbsp;&nbsp;B &nbsp;&nbsp;i &nbsp;&nbsp;n &nbsp;&nbsp;h &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;&nbsp;c &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
0000032</div>
<p>Record k starts at byte k × 16, so the program jumps straight to record 2 and updates record 1 in place (the old "UPDATE" operation). <code>od</code> shows that, to the OS, the file is still 64 bytes: the score 70 appears as the character <code>F</code> (ASCII 70) and the new score 99 as <code>c</code>.</p>
<div class="callout">🧭 <strong>On a real server:</strong> structure (c) lives on — not inside the OS, but inside databases. PostgreSQL stores each table as byte-sequence files under <code>base/</code> and builds B-tree indexes (a tree keyed on a column) itself.</div>
<p class="pitfall">⚠️ FE: "Which file structure is used by UNIX/Windows?" — byte sequence (FE18 question 9). "…on large mainframes / with fixed-length records?" — record sequence (FE28 question 24, FE26 question 21). "Which is NOT a file structure?" — <em>ring</em> (FE23 question 38).</p>`,
        `<p class="y-chinh">🎯 Hình 4-2: ba loại tệp — (a) <strong>dãy byte (byte sequence)</strong> không cấu trúc; (b) <strong>dãy bản ghi (record sequence)</strong> các bản ghi độ dài cố định; (c) <strong>cây (tree)</strong> các bản ghi, mỗi bản ghi có một trường khoá, sắp xếp theo khoá (Ant, Fox, Pig ở trên; Cat, Cow, Dog, Goat…).</p>
<p>(a) là thứ UNIX và Windows dùng: HĐH không biết và không quan tâm bên trong có gì — ý nghĩa do chương trình gán. Cách này linh hoạt tối đa; một cơ sở dữ liệu, một bức ảnh, một tệp văn bản đều "chỉ là byte". (b) được máy lớn (mainframe) xưa dùng thời bìa đục lỗ 80 cột: đọc và ghi theo nguyên bản ghi. (c) cho phép lấy "bản ghi có khoá Pony" mà không cần biết vị trí; nó được dùng trên vài mainframe lớn cho xử lý dữ liệu thương mại.</p>
<p>➕ Một "tệp bản ghi" trên Linux chỉ là quy ước chương trình của bạn tự theo, đặt trên dãy byte — struct cỡ cố định cộng <code>lseek</code>:</p>
<pre><code class="language-c">// Slide 6: HĐH chỉ thấy một dãy byte; "tệp bản ghi" chỉ là quy ước bên trên (bản ghi cỡ cố định + lseek)
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;

struct record { char name[12]; int score; };          // 16 byte mỗi bản ghi

int main(void) {
    int fd = open("students.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    const char *names[] = { "An", "Binh", "Cuong", "Dung" };
    for (int i = 0; i &lt; 4; i++) {
        struct record r = { 0 };
        strcpy(r.name, names[i]);
        r.score = 70 + 5 * i;
        write(fd, &amp;r, sizeof r);
    }
    printf("file size = %ld bytes = 4 records x %zu bytes\\n", (long)lseek(fd, 0, SEEK_END), sizeof(struct record));
    // bản ghi k bắt đầu ở byte k * sizeof(record): nhảy thẳng tới đó
    struct record r;
    lseek(fd, 2 * sizeof r, SEEK_SET);
    read(fd, &amp;r, sizeof r);
    printf("record 2: %s %d\\n", r.name, r.score);
    // sửa bản ghi 1 tại chỗ (lệnh "UPDATE" của các hệ hướng bản ghi xưa)
    lseek(fd, 1 * sizeof r, SEEK_SET);
    read(fd, &amp;r, sizeof r);
    r.score = 99;
    lseek(fd, 1 * sizeof r, SEEK_SET);
    write(fd, &amp;r, sizeof r);
    close(fd);
    fflush(stdout);
    // với HĐH nó vẫn chỉ là các byte:
    return system("od -A d -t c -N 32 students.dat");
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ban-ghi.c -o ban-ghi &amp;&amp; ./ban-ghi<br>
file size = 64 bytes = 4 records x 16 bytes<br>
record 2: Cuong 80<br>
0000000 &nbsp;&nbsp;A &nbsp;&nbsp;n &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;&nbsp;F &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
0000016 &nbsp;&nbsp;B &nbsp;&nbsp;i &nbsp;&nbsp;n &nbsp;&nbsp;h &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;\\0 &nbsp;&nbsp;c &nbsp;\\0 &nbsp;\\0 &nbsp;\\0<br>
0000032</div>
<p>Bản ghi k bắt đầu ở byte k × 16, nên chương trình nhảy thẳng tới bản ghi 2 và sửa bản ghi 1 tại chỗ (thao tác "UPDATE" thời xưa). <code>od</code> cho thấy với HĐH tệp vẫn chỉ là 64 byte: điểm 70 hiện thành ký tự <code>F</code> (mã ASCII 70) và điểm mới 99 thành <code>c</code>.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> cấu trúc (c) vẫn sống — không phải trong HĐH mà trong cơ sở dữ liệu. PostgreSQL lưu mỗi bảng thành các tệp dãy byte dưới <code>base/</code> và tự dựng chỉ mục B-tree (một cây có khoá là một cột).</div>
<p class="pitfall">⚠️ FE: "Cấu trúc tệp nào UNIX/Windows dùng?" — dãy byte (FE18 câu 9). "…trên mainframe lớn / với bản ghi độ dài cố định?" — dãy bản ghi (FE28 câu 24, FE26 câu 21). "Cái nào KHÔNG phải cấu trúc tệp?" — <em>ring</em> (FE23 câu 38).</p>`],
      [7, 'File Types',
        `<p class="y-chinh">🎯 Figure 4-3: (a) an <strong>executable file</strong> — a header (magic number, text size, data size, BSS size, symbol table size, entry point, flags) followed by text, data, relocation bits and the symbol table; (b) an <strong>archive</strong> — a library of compiled modules, each with its own header (module name, date, owner, protection, size).</p>
<p>UNIX and Windows have <strong>regular files</strong> (user data, ASCII or binary) and <strong>directories</strong> (system files that hold the structure); UNIX adds <strong>character special files</strong> (serial devices: terminals, printers, <code>/dev/null</code>) and <strong>block special files</strong> (disks). An executable is a binary regular file that the OS will only run if it has the right format — recognised by its <strong>magic number</strong>.</p>
<p>➕ The figure shows the old UNIX <code>a.out</code> format; Linux has used <strong>ELF</strong> since the mid-1990s. Same idea, newer layout — here every file type, a real ELF header, and a real archive:</p>
<div class="out"># Slide 7: file types — regular, directory, character special, block special, link, pipe<br>
$ mkdir dir; mkfifo pipe; ln -s /etc/hostname link; echo hi &gt; text.txt<br>
$ stat -c "%A &nbsp;%-22F %n" text.txt dir /dev/null link pipe<br>
-rw-r--r-- &nbsp;regular file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text.txt<br>
drwxr-xr-x &nbsp;directory &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dir<br>
crw-rw-rw- &nbsp;character special file /dev/null<br>
lrwxrwxrwx &nbsp;symbolic link &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;link<br>
prw-r--r-- &nbsp;fifo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pipe<br>
# Figure 4-3(a) today: an executable starts with a magic number — ELF = 7f 'E' 'L' 'F'<br>
$ printf 'int x = 42;\\nint main(void){return x;}\\n' &gt; a.c<br>
$ gcc a.c -o a.out<br>
$ od -A d -t x1 -N 4 a.out<br>
0000000 7f 45 4c 46<br>
0000004<br>
$ readelf -h a.out | grep -E 'Magic|Class|Type|Machine|Entry'<br>
&nbsp;&nbsp;Magic: &nbsp;&nbsp;7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00<br>
&nbsp;&nbsp;Class: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELF64<br>
&nbsp;&nbsp;Type: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DYN (Position-Independent Executable file)<br>
&nbsp;&nbsp;Machine: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AArch64<br>
&nbsp;&nbsp;Entry point address: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x600<br>
$ readelf -S -W a.out | grep -E ' \\.(text|data|bss|symtab) '<br>
&nbsp;&nbsp;[13] .text &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PROGBITS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000000600 000600 000124 00 &nbsp;AX &nbsp;0 &nbsp;&nbsp;0 64<br>
&nbsp;&nbsp;[23] .data &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PROGBITS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000020020 010020 000014 00 &nbsp;WA &nbsp;0 &nbsp;&nbsp;0 &nbsp;8<br>
&nbsp;&nbsp;[24] .bss &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NOBITS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000020034 010034 000004 00 &nbsp;WA &nbsp;0 &nbsp;&nbsp;0 &nbsp;1<br>
&nbsp;&nbsp;[26] .symtab &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SYMTAB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000000000 010060 000858 18 &nbsp;&nbsp;&nbsp;&nbsp;27 &nbsp;66 &nbsp;8<br>
# Figure 4-3(b): an archive = a header + object modules, each with its own header<br>
$ printf 'int f(void){return 1;}\\n' &gt; f.c; printf 'int g(void){return 2;}\\n' &gt; g.c<br>
$ gcc -c f.c g.c<br>
$ ar rcs libdemo.a f.o g.o<br>
$ head -c 7 libdemo.a; echo<br>
!&lt;arch&gt;<br>
$ ar t libdemo.a<br>
f.o<br>
g.o</div>
<p><code>stat</code> names each type (the first letter of <code>ls -l</code>: <code>-</code>, <code>d</code>, <code>c</code>, <code>l</code>, <code>p</code>). The executable starts with the magic bytes <code>7f 45 4c 46</code> = DEL "E" "L" "F"; its sections <code>.text</code>, <code>.data</code>, <code>.bss</code>, <code>.symtab</code> are exactly the parts of Figure 4-3(a). The archive starts with the magic string <code>!&lt;arch&gt;</code> followed by the modules <code>f.o</code> and <code>g.o</code>, as in (b). (No block device appears: a container is not given the disks.)</p>
<p class="pitfall">⚠️ FE1 question 2: a <strong>regular file</strong> is "a user-created file containing ASCII or binary data". FE10 question 29: "a sequence of bytes organized into blocks understandable by the system's linker" — an <strong>object file</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 4-3: (a) một <strong>tệp thực thi (executable)</strong> — phần đầu (magic number, cỡ text, cỡ data, cỡ BSS, cỡ bảng ký hiệu, điểm vào, cờ) rồi tới text, data, bit tái định vị và bảng ký hiệu; (b) một <strong>kho lưu trữ (archive)</strong> — thư viện các module đã biên dịch, mỗi module có phần đầu riêng (tên module, ngày, chủ, quyền, cỡ).</p>
<p>UNIX và Windows có <strong>tệp thường (regular file)</strong> — dữ liệu người dùng, ASCII hoặc nhị phân — và <strong>thư mục (directory)</strong> — tệp hệ thống giữ cấu trúc; UNIX còn có <strong>tệp đặc biệt kiểu ký tự (character special)</strong> — thiết bị nối tiếp: terminal, máy in, <code>/dev/null</code> — và <strong>tệp đặc biệt kiểu khối (block special)</strong> — đĩa. Tệp thực thi là tệp thường nhị phân mà HĐH chỉ chịu chạy khi đúng định dạng — nhận ra nhờ <strong>magic number</strong>.</p>
<p>➕ Hình vẽ định dạng <code>a.out</code> cũ của UNIX; Linux dùng <strong>ELF</strong> từ giữa thập niên 1990. Cùng ý tưởng, bố cục mới hơn — đây là mọi kiểu tệp, một header ELF thật và một kho lưu trữ thật:</p>
<div class="out"># Slide 7: các kiểu tệp — thường, thư mục, ký tự đặc biệt, khối đặc biệt, liên kết, pipe<br>
$ mkdir dir; mkfifo pipe; ln -s /etc/hostname link; echo hi &gt; text.txt<br>
$ stat -c "%A &nbsp;%-22F %n" text.txt dir /dev/null link pipe<br>
-rw-r--r-- &nbsp;regular file &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text.txt<br>
drwxr-xr-x &nbsp;directory &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dir<br>
crw-rw-rw- &nbsp;character special file /dev/null<br>
lrwxrwxrwx &nbsp;symbolic link &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;link<br>
prw-r--r-- &nbsp;fifo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pipe<br>
# Hình 4-3(a) ngày nay: tệp thực thi mở đầu bằng một magic number — ELF = 7f 'E' 'L' 'F'<br>
$ printf 'int x = 42;\\nint main(void){return x;}\\n' &gt; a.c<br>
$ gcc a.c -o a.out<br>
$ od -A d -t x1 -N 4 a.out<br>
0000000 7f 45 4c 46<br>
0000004<br>
$ readelf -h a.out | grep -E 'Magic|Class|Type|Machine|Entry'<br>
&nbsp;&nbsp;Magic: &nbsp;&nbsp;7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00<br>
&nbsp;&nbsp;Class: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELF64<br>
&nbsp;&nbsp;Type: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DYN (Position-Independent Executable file)<br>
&nbsp;&nbsp;Machine: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AArch64<br>
&nbsp;&nbsp;Entry point address: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0x600<br>
$ readelf -S -W a.out | grep -E ' \\.(text|data|bss|symtab) '<br>
&nbsp;&nbsp;[13] .text &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PROGBITS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000000600 000600 000124 00 &nbsp;AX &nbsp;0 &nbsp;&nbsp;0 64<br>
&nbsp;&nbsp;[23] .data &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PROGBITS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000020020 010020 000014 00 &nbsp;WA &nbsp;0 &nbsp;&nbsp;0 &nbsp;8<br>
&nbsp;&nbsp;[24] .bss &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NOBITS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000020034 010034 000004 00 &nbsp;WA &nbsp;0 &nbsp;&nbsp;0 &nbsp;1<br>
&nbsp;&nbsp;[26] .symtab &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SYMTAB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0000000000000000 010060 000858 18 &nbsp;&nbsp;&nbsp;&nbsp;27 &nbsp;66 &nbsp;8<br>
# Hình 4-3(b): một thư viện lưu trữ = phần đầu + các module đối tượng, mỗi module có header riêng<br>
$ printf 'int f(void){return 1;}\\n' &gt; f.c; printf 'int g(void){return 2;}\\n' &gt; g.c<br>
$ gcc -c f.c g.c<br>
$ ar rcs libdemo.a f.o g.o<br>
$ head -c 7 libdemo.a; echo<br>
!&lt;arch&gt;<br>
$ ar t libdemo.a<br>
f.o<br>
g.o</div>
<p><code>stat</code> gọi tên từng kiểu (chính là chữ cái đầu của <code>ls -l</code>: <code>-</code>, <code>d</code>, <code>c</code>, <code>l</code>, <code>p</code>). Tệp thực thi mở đầu bằng các byte magic <code>7f 45 4c 46</code> = DEL "E" "L" "F"; các phần <code>.text</code>, <code>.data</code>, <code>.bss</code>, <code>.symtab</code> đúng là các phần của Hình 4-3(a). Kho lưu trữ mở đầu bằng chuỗi magic <code>!&lt;arch&gt;</code> rồi tới các module <code>f.o</code> và <code>g.o</code>, như (b). (Không có thiết bị khối nào: container không được giao đĩa.)</p>
<p class="pitfall">⚠️ FE1 câu 2: <strong>tệp thường</strong> là "tệp người dùng tạo, chứa dữ liệu ASCII hoặc nhị phân". FE10 câu 29: "một dãy byte tổ chức thành khối mà trình liên kết hiểu được" — <strong>tệp đối tượng (object file)</strong>.</p>`],
      [8, 'File Attributes',
        `<p class="y-chinh">🎯 Figure 4-4: some possible file attributes (also called <strong>metadata</strong>) — protection, password, creator, owner, read-only/hidden/system/archive/ASCII-binary/random-access/temporary flags, lock flags, record length, key position and length, creation time, time of last access, time of last change, current size, maximum size.</p>
<p>Besides its name and data, every file carries this "data about the data". No system has all of them. The first four control access; the flags are on/off bits (the <em>archive flag</em> is cleared by a backup program and set by the OS when the file changes — slide 34); key fields only exist for record-oriented files; the times drive tools such as <code>make</code> and backup programs.</p>
<p>➕ On Linux the attributes live in the file's <strong>i-node</strong> (slide 21), and <code>stat</code> prints them:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 4-4 on Linux: the attributes live in the i-node, stat(1) prints them<br>
$ echo "exam notes" &gt; notes.txt<br>
$ stat notes.txt<br>
&nbsp;&nbsp;File: notes.txt<br>
&nbsp;&nbsp;Size: 11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	Blocks: 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IO Block: 4096 &nbsp;&nbsp;regular file<br>
Device: 0,82	Inode: 358541 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Links: 1<br>
Access: (0644/-rw-r--r--) &nbsp;Uid: ( 1000/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sv) &nbsp;&nbsp;Gid: ( 1000/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sv)<br>
Access: 2026-10-26 01:34:06.574956219 +0700<br>
Modify: 2026-10-26 01:34:06.575266011 +0700<br>
Change: 2026-10-26 01:34:06.575266011 +0700<br>
&nbsp;Birth: 2026-10-26 01:34:06.574956219 +0700<br>
# Protection + owner: change them<br>
$ chmod 640 notes.txt<br>
$ stat -c 'mode %a (%A) &nbsp;owner %U &nbsp;group %G &nbsp;size %s bytes' notes.txt<br>
mode 640 (-rw-r-----) &nbsp;owner sv &nbsp;group sv &nbsp;size 11 bytes<br>
# set the "time of last change" by hand (backup tools and make rely on it)<br>
$ touch -d '2026-01-01 08:00:00' notes.txt<br>
$ stat -c 'last modification: %y' notes.txt<br>
last modification: 2026-01-01 08:00:00.000000000 +0700<br>
# "Hidden flag" on UNIX = a name starting with a dot<br>
$ touch .secret<br>
$ ls<br>
notes.txt<br>
$ ls -a<br>
.<br>
..<br>
.bash_logout<br>
.bashrc<br>
.profile<br>
.secret<br>
notes.txt</div>
<p>Protection = mode <code>0644</code> (rw-r--r--); owner = Uid 1000 (sv); times = Access, Modify, Change and Birth (creation, newer kernels); size = 11 bytes; and the i-node number and link count. <code>chmod</code> sets the protection, <code>touch -d</code> sets the time of last change. The "hidden flag" of UNIX is not a flag at all: a name starting with a dot is simply not listed by <code>ls</code> without <code>-a</code>.</p>
<p class="pitfall">⚠️ FE4 question 24: "Which file attribute specifies who can access the file and in what way?" — <strong>Protection</strong> (not Owner, not Password). Read the "Meaning" column of Figure 4-4 carefully — FE copies it word for word.</p>`,
        `<p class="y-chinh">🎯 Hình 4-4: một số thuộc tính tệp có thể có (còn gọi là <strong>siêu dữ liệu — metadata</strong>) — bảo vệ, mật khẩu, người tạo, chủ sở hữu, các cờ chỉ-đọc/ẩn/hệ thống/lưu trữ/ASCII-nhị phân/truy cập ngẫu nhiên/tạm thời, cờ khoá, độ dài bản ghi, vị trí và độ dài khoá, thời điểm tạo, thời điểm truy cập cuối, thời điểm sửa cuối, cỡ hiện tại, cỡ tối đa.</p>
<p>Ngoài tên và dữ liệu, tệp nào cũng mang theo thứ "dữ liệu về dữ liệu" này. Không hệ nào có đủ tất cả. Bốn thuộc tính đầu kiểm soát quyền truy cập; các cờ là bit bật/tắt (<em>cờ archive</em> được chương trình sao lưu xoá và được HĐH bật lại khi tệp thay đổi — slide 34); các trường khoá chỉ có ở tệp hướng bản ghi; các mốc thời gian là thứ công cụ như <code>make</code> và chương trình sao lưu dựa vào.</p>
<p>➕ Trên Linux các thuộc tính nằm trong <strong>i-node</strong> của tệp (slide 21), và <code>stat</code> in chúng ra:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 4-4 trên Linux: thuộc tính nằm trong i-node, lệnh stat in chúng ra<br>
$ echo "exam notes" &gt; notes.txt<br>
$ stat notes.txt<br>
&nbsp;&nbsp;File: notes.txt<br>
&nbsp;&nbsp;Size: 11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	Blocks: 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IO Block: 4096 &nbsp;&nbsp;regular file<br>
Device: 0,82	Inode: 358541 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Links: 1<br>
Access: (0644/-rw-r--r--) &nbsp;Uid: ( 1000/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sv) &nbsp;&nbsp;Gid: ( 1000/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sv)<br>
Access: 2026-10-26 01:34:06.574956219 +0700<br>
Modify: 2026-10-26 01:34:06.575266011 +0700<br>
Change: 2026-10-26 01:34:06.575266011 +0700<br>
&nbsp;Birth: 2026-10-26 01:34:06.574956219 +0700<br>
# Bảo vệ + chủ sở hữu: đổi thử<br>
$ chmod 640 notes.txt<br>
$ stat -c 'mode %a (%A) &nbsp;owner %U &nbsp;group %G &nbsp;size %s bytes' notes.txt<br>
mode 640 (-rw-r-----) &nbsp;owner sv &nbsp;group sv &nbsp;size 11 bytes<br>
# đặt tay "thời điểm sửa cuối" (công cụ sao lưu và make dựa vào nó)<br>
$ touch -d '2026-01-01 08:00:00' notes.txt<br>
$ stat -c 'last modification: %y' notes.txt<br>
last modification: 2026-01-01 08:00:00.000000000 +0700<br>
# "Cờ ẩn" trên UNIX = tên bắt đầu bằng dấu chấm<br>
$ touch .secret<br>
$ ls<br>
notes.txt<br>
$ ls -a<br>
.<br>
..<br>
.bash_logout<br>
.bashrc<br>
.profile<br>
.secret<br>
notes.txt</div>
<p>Bảo vệ = mode <code>0644</code> (rw-r--r--); chủ sở hữu = Uid 1000 (sv); thời gian = Access (truy cập), Modify (sửa nội dung), Change (đổi thuộc tính) và Birth (tạo, nhân mới); cỡ = 11 byte; cùng số i-node và số liên kết. <code>chmod</code> đặt quyền bảo vệ, <code>touch -d</code> đặt thời điểm sửa cuối. "Cờ ẩn" của UNIX hoàn toàn không phải cờ: tên bắt đầu bằng dấu chấm chỉ đơn giản là không được <code>ls</code> liệt kê nếu không có <code>-a</code>.</p>
<p class="pitfall">⚠️ FE4 câu 24: "Thuộc tính nào cho biết ai được truy cập tệp và theo cách nào?" — <strong>Protection</strong> (không phải Owner, không phải Password). Đọc kỹ cột "Meaning" của Hình 4-4 — FE chép nguyên văn.</p>`],
      [9, 'File Operations',
        `<p class="y-chinh">🎯 The common file operations (system calls): Create, Delete, Open, Close, Read, Write, Append, Seek, Get attributes, Set attributes, Rename. ⚠️ The slide numbers the right-hand column "7. 7. 7. 7. 7." — a PowerPoint numbering bug; they are operations 7 to 11.</p>
<p>What each one is for, in the book's words: <strong>Create</strong> announces that the file is coming and sets some attributes; <strong>Delete</strong> frees the disk space; <strong>Open</strong> lets the system fetch the attributes and disk addresses into memory for rapid access; <strong>Close</strong> frees that internal table space; <strong>Read</strong>/<strong>Write</strong> work at the current position; <strong>Append</strong> is a restricted write that only adds at the end; <strong>Seek</strong> repositions the file pointer for random access; <strong>Get/Set attributes</strong> read or change metadata (make, chmod); <strong>Rename</strong> changes the name without copying.</p>
<p>➕ All eleven on a real file, each as one system call:</p>
<pre><code class="language-c">// Slide 9: the 11 file operations, each one a real system call
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

int main(void) {
    int fd = open("f.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);   // 1 Create (+ 3 Open)
    printf("1 create + 3 open  -&gt; fd %d\\n", fd);
    printf("6 write            -&gt; %zd bytes\\n", write(fd, "Hello", 5));
    close(fd);                                                     // 4 Close
    puts("4 close");
    fd = open("f.txt", O_WRONLY | O_APPEND);                       // 7 Append: every write goes to the END
    lseek(fd, 0, SEEK_SET);                                        // ...even after a seek to the start
    printf("7 append           -&gt; %zd bytes\\n", write(fd, ", world", 7));
    close(fd);
    fd = open("f.txt", O_RDONLY);
    char buf[16] = { 0 };
    printf("8 seek             -&gt; position %ld\\n", (long)lseek(fd, 7, SEEK_SET));   // 8 Seek
    printf("5 read             -&gt; %zd bytes: \\"%s\\"\\n", read(fd, buf, 5), buf);    // 5 Read
    struct stat st;
    fstat(fd, &amp;st);                                                // 9 Get attributes
    printf("9 get attributes   -&gt; size %ld, mode %o\\n", (long)st.st_size, st.st_mode &amp; 0777);
    close(fd);
    chmod("f.txt", 0600);                                          // 10 Set attributes
    stat("f.txt", &amp;st);
    printf("10 set attributes  -&gt; mode now %o\\n", st.st_mode &amp; 0777);
    printf("11 rename          -&gt; %d\\n", rename("f.txt", "g.txt")); // 11 Rename
    printf("2 delete           -&gt; %d\\n", unlink("g.txt"));          // 2 Delete (unlink the name)
    printf("  open again       -&gt; %d (the file is gone)\\n", open("g.txt", O_RDONLY));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thao-tac-tep.c -o thao-tac-tep &amp;&amp; ./thao-tac-tep<br>
1 create + 3 open &nbsp;-&gt; fd 3<br>
6 write &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 5 bytes<br>
4 close<br>
7 append &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 7 bytes<br>
8 seek &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; position 7<br>
5 read &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 5 bytes: "world"<br>
9 get attributes &nbsp;&nbsp;-&gt; size 12, mode 644<br>
10 set attributes &nbsp;-&gt; mode now 600<br>
11 rename &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
2 delete &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;open again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; -1 (the file is gone)</div>
<p>Notice two details. With <code>O_APPEND</code> the write lands at the end even after <code>lseek</code> to 0 — the kernel moves the pointer to the end before every write, atomically. And after <code>unlink</code> ("Delete") the name is gone: <code>open</code> returns −1. Create + Open are one call on UNIX (<code>open</code> with <code>O_CREAT</code>); the old <code>creat</code> also exists (slide 11).</p>
<p class="pitfall">⚠️ FE asks the purpose of an operation: "announce that the file is coming and set some attributes" = <strong>CREATE</strong> (FE18 question 37, FE25 question 26); "specify from where to take the data" = <strong>SEEK</strong> (FE23 question 28, FE28 question 17); in UNIX the call that moves the file pointer is <code>lseek</code> (FE4 question 6).</p>`,
        `<p class="y-chinh">🎯 Các thao tác (lời gọi hệ thống) thường gặp trên tệp: Create, Delete, Open, Close, Read, Write, Append, Seek, Get attributes, Set attributes, Rename. ⚠️ Slide đánh số cột phải là "7. 7. 7. 7. 7." — lỗi tự đánh số của PowerPoint; đúng ra là thao tác 7 tới 11.</p>
<p>Công dụng từng thao tác, theo đúng lời sách: <strong>Create</strong> báo cho hệ thống biết tệp sắp có và đặt vài thuộc tính; <strong>Delete</strong> giải phóng chỗ trên đĩa; <strong>Open</strong> cho hệ thống nạp thuộc tính và địa chỉ đĩa vào bộ nhớ để truy cập nhanh; <strong>Close</strong> giải phóng chỗ trong bảng nội bộ đó; <strong>Read</strong>/<strong>Write</strong> làm ở vị trí hiện tại; <strong>Append</strong> là dạng ghi hạn chế, chỉ thêm vào cuối; <strong>Seek</strong> dời con trỏ tệp để truy cập ngẫu nhiên; <strong>Get/Set attributes</strong> đọc hoặc đổi siêu dữ liệu (make, chmod); <strong>Rename</strong> đổi tên mà không phải chép tệp.</p>
<p>➕ Cả mười một thao tác trên một tệp thật, mỗi thao tác là một lời gọi hệ thống:</p>
<pre><code class="language-c">// Slide 9: 11 thao tác trên tệp, mỗi thao tác là một lời gọi hệ thống thật
#include &lt;stdio.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

int main(void) {
    int fd = open("f.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);   // 1 Tạo (+ 3 Mở)
    printf("1 create + 3 open  -&gt; fd %d\\n", fd);
    printf("6 write            -&gt; %zd bytes\\n", write(fd, "Hello", 5));
    close(fd);                                                     // 4 Đóng
    puts("4 close");
    fd = open("f.txt", O_WRONLY | O_APPEND);                       // 7 Nối thêm: mọi lần ghi đều vào CUỐI
    lseek(fd, 0, SEEK_SET);                                        // ...kể cả khi đã seek về đầu
    printf("7 append           -&gt; %zd bytes\\n", write(fd, ", world", 7));
    close(fd);
    fd = open("f.txt", O_RDONLY);
    char buf[16] = { 0 };
    printf("8 seek             -&gt; position %ld\\n", (long)lseek(fd, 7, SEEK_SET));   // 8 Dời vị trí
    printf("5 read             -&gt; %zd bytes: \\"%s\\"\\n", read(fd, buf, 5), buf);    // 5 Đọc
    struct stat st;
    fstat(fd, &amp;st);                                                // 9 Lấy thuộc tính
    printf("9 get attributes   -&gt; size %ld, mode %o\\n", (long)st.st_size, st.st_mode &amp; 0777);
    close(fd);
    chmod("f.txt", 0600);                                          // 10 Đặt thuộc tính
    stat("f.txt", &amp;st);
    printf("10 set attributes  -&gt; mode now %o\\n", st.st_mode &amp; 0777);
    printf("11 rename          -&gt; %d\\n", rename("f.txt", "g.txt")); // 11 Đổi tên
    printf("2 delete           -&gt; %d\\n", unlink("g.txt"));          // 2 Xoá (gỡ cái tên)
    printf("  open again       -&gt; %d (the file is gone)\\n", open("g.txt", O_RDONLY));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thao-tac-tep.c -o thao-tac-tep &amp;&amp; ./thao-tac-tep<br>
1 create + 3 open &nbsp;-&gt; fd 3<br>
6 write &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 5 bytes<br>
4 close<br>
7 append &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 7 bytes<br>
8 seek &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; position 7<br>
5 read &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 5 bytes: "world"<br>
9 get attributes &nbsp;&nbsp;-&gt; size 12, mode 644<br>
10 set attributes &nbsp;-&gt; mode now 600<br>
11 rename &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
2 delete &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;open again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; -1 (the file is gone)</div>
<p>Để ý hai chi tiết. Với <code>O_APPEND</code>, lệnh ghi vẫn rơi vào cuối dù đã <code>lseek</code> về 0 — nhân dời con trỏ tới cuối trước mỗi lần ghi, một cách nguyên tử. Và sau <code>unlink</code> ("Delete") cái tên biến mất: <code>open</code> trả về −1. Trên UNIX, Create + Open là một lời gọi (<code>open</code> với <code>O_CREAT</code>); lời gọi cũ <code>creat</code> vẫn còn (slide 11).</p>
<p class="pitfall">⚠️ FE hỏi công dụng một thao tác: "báo tệp sắp có và đặt vài thuộc tính" = <strong>CREATE</strong> (FE18 câu 37, FE25 câu 26); "chỉ định lấy dữ liệu từ chỗ nào" = <strong>SEEK</strong> (FE23 câu 28, FE28 câu 17); trên UNIX lời gọi dời con trỏ tệp là <code>lseek</code> (FE4 câu 6).</p>`],
      [10, 'Example Program Using File System Calls (1)',
        `<p class="y-chinh">🎯 Figure 4-5, part 1: a simple program to copy a file — the headers, an ANSI prototype of <code>main</code>, <code>BUF_SIZE 4096</code> (copy in 4 KB pieces) and <code>OUTPUT_MODE 0700</code> (protection bits of the new file), then the variables <code>in_fd</code>, <code>out_fd</code>, <code>rd_count</code>, <code>wt_count</code> and <code>buffer</code>.</p>
<p>The program is called as <code>copy abc xyz</code>: copy file <code>abc</code> to <code>xyz</code>. If <code>xyz</code> exists it is overwritten. It uses nothing but four system calls — <code>open</code>, <code>creat</code>, <code>read</code>, <code>write</code> (plus <code>close</code>) — and reports errors only through its <strong>exit status</strong> (1–5), which is why the book says "error checking and reporting is minimal". Here is the whole program, typed exactly as printed in the book, compiled and run on Linux:</p>
<pre><code class="language-c">/* File copy program. Error checking and reporting is minimal. */

#include &lt;sys/types.h&gt;                        /* include necessary header files */
#include &lt;fcntl.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;

int main(int argc, char *argv[]);             /* ANSI prototype */

#define BUF_SIZE 4096                         /* use a buffer size of 4096 bytes */
#define OUTPUT_MODE 0700                      /* protection bits for output file */

int main(int argc, char *argv[])
{
    int in_fd, out_fd, rd_count, wt_count;
    char buffer[BUF_SIZE];

    if (argc != 3) exit(1);                   /* syntax error if argc is not 3 */

    /* Open the input file and create the output file */
    in_fd = open(argv[1], O_RDONLY);          /* open the source file */
    if (in_fd &lt; 0) exit(2);                   /* if it cannot be opened, exit */
    out_fd = creat(argv[2], OUTPUT_MODE);     /* create the destination file */
    if (out_fd &lt; 0) exit(3);                  /* if it cannot be created, exit */

    /* Copy loop */
    while (TRUE) {
        rd_count = read(in_fd, buffer, BUF_SIZE);    /* read a block of data */
        if (rd_count &lt;= 0) break;                    /* if end of file or error, exit loop */
        wt_count = write(out_fd, buffer, rd_count);  /* write data */
        if (wt_count &lt;= 0) exit(4);                  /* wt_count &lt;= 0 is an error */
    }

    /* Close the files */
    close(in_fd);
    close(out_fd);
    if (rd_count == 0)                        /* no error on last read */
        exit(0);
    else
        exit(5);                              /* error on last read */
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -DTRUE=1 copy.c -o copy &amp;&amp; seq 1 3000 &gt; in.txt &amp;&amp; ./copy in.txt out.txt; echo "exit status $?"; cmp in.txt out.txt &amp;&amp; echo "identical, $(stat -c %s out.txt) bytes"<br>
exit status 0<br>
identical, 13893 bytes</div>
<p>Look at the command line: it needs <code>-DTRUE=1</code>. Exactly as printed, Figure 4-5 <strong>does not compile</strong> — <code>while (TRUE)</code> uses a name that none of its four headers defines (the book's own environment defined it elsewhere). Slide 12 shows the real compiler error. With that one fix, the copy of 13,893 bytes is byte-for-byte identical.</p>
<p class="meo">🧠 <code>0700</code> is octal: rwx for the owner, nothing for group and others. Lesson 4.2 explains reading permissions in octal.</p>`,
        `<p class="y-chinh">🎯 Hình 4-5, phần 1: một chương trình đơn giản để chép tệp — các header, một prototype ANSI của <code>main</code>, <code>BUF_SIZE 4096</code> (chép từng mẩu 4 KB) và <code>OUTPUT_MODE 0700</code> (bit bảo vệ của tệp mới), rồi các biến <code>in_fd</code>, <code>out_fd</code>, <code>rd_count</code>, <code>wt_count</code> và <code>buffer</code>.</p>
<p>Chương trình được gọi kiểu <code>copy abc xyz</code>: chép tệp <code>abc</code> sang <code>xyz</code>. Nếu <code>xyz</code> đã có thì bị ghi đè. Nó chỉ dùng bốn lời gọi hệ thống — <code>open</code>, <code>creat</code>, <code>read</code>, <code>write</code> (cộng <code>close</code>) — và báo lỗi duy nhất qua <strong>mã thoát (exit status)</strong> 1–5, vì thế sách nói "kiểm tra và báo lỗi ở mức tối thiểu". Đây là cả chương trình, gõ đúng như in trong sách, biên dịch và chạy trên Linux:</p>
<pre><code class="language-c">/* File copy program. Error checking and reporting is minimal. */

#include &lt;sys/types.h&gt;                        /* include necessary header files */
#include &lt;fcntl.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;

int main(int argc, char *argv[]);             /* ANSI prototype */

#define BUF_SIZE 4096                         /* use a buffer size of 4096 bytes */
#define OUTPUT_MODE 0700                      /* protection bits for output file */

int main(int argc, char *argv[])
{
    int in_fd, out_fd, rd_count, wt_count;
    char buffer[BUF_SIZE];

    if (argc != 3) exit(1);                   /* syntax error if argc is not 3 */

    /* Open the input file and create the output file */
    in_fd = open(argv[1], O_RDONLY);          /* open the source file */
    if (in_fd &lt; 0) exit(2);                   /* if it cannot be opened, exit */
    out_fd = creat(argv[2], OUTPUT_MODE);     /* create the destination file */
    if (out_fd &lt; 0) exit(3);                  /* if it cannot be created, exit */

    /* Copy loop */
    while (TRUE) {
        rd_count = read(in_fd, buffer, BUF_SIZE);    /* read a block of data */
        if (rd_count &lt;= 0) break;                    /* if end of file or error, exit loop */
        wt_count = write(out_fd, buffer, rd_count);  /* write data */
        if (wt_count &lt;= 0) exit(4);                  /* wt_count &lt;= 0 is an error */
    }

    /* Close the files */
    close(in_fd);
    close(out_fd);
    if (rd_count == 0)                        /* no error on last read */
        exit(0);
    else
        exit(5);                              /* error on last read */
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread -DTRUE=1 copy.c -o copy &amp;&amp; seq 1 3000 &gt; in.txt &amp;&amp; ./copy in.txt out.txt; echo "exit status $?"; cmp in.txt out.txt &amp;&amp; echo "identical, $(stat -c %s out.txt) bytes"<br>
exit status 0<br>
identical, 13893 bytes</div>
<p>Nhìn dòng lệnh: nó cần <code>-DTRUE=1</code>. Đúng như in, Hình 4-5 <strong>không biên dịch được</strong> — <code>while (TRUE)</code> dùng một cái tên mà không header nào trong bốn header của nó định nghĩa (môi trường của tác giả định nghĩa ở chỗ khác). Slide 12 cho xem lỗi thật của trình biên dịch. Sửa đúng chỗ đó, bản chép 13.893 byte giống hệt bản gốc từng byte.</p>
<p class="meo">🧠 <code>0700</code> là hệ bát phân: rwx cho chủ sở hữu, không gì cho nhóm và người khác. Bài 4.2 giải thích cách đọc quyền ở hệ bát phân.</p>`],
      [11, 'Example Program Using File System Calls (2)',
        `<p class="y-chinh">🎯 Figure 4-5, part 2: <code>if (argc != 3) exit(1);</code> then <code>in_fd = open(argv[1], O_RDONLY)</code> (exit 2 on failure), <code>out_fd = creat(argv[2], OUTPUT_MODE)</code> (exit 3), and the start of the copy loop.</p>
<p><code>open</code> and <code>creat</code> return a <strong>file descriptor</strong>, a small integer the program uses in every later call; a negative value means failure. <code>creat</code> is the historical UNIX call; today it is defined as <code>open(path, O_CREAT | O_WRONLY | O_TRUNC, mode)</code>. The loop reads up to <code>BUF_SIZE</code> bytes, and <code>read</code> returns how many it actually got: <code>&gt; 0</code> data, <code>0</code> end of file, <code>&lt; 0</code> error.</p>
<p>➕ Every exit path, tested for real, and the system calls counted with <code>strace</code>:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># 1. Figure 4-5 exactly as printed does NOT compile: TRUE is not defined in any of its headers<br>
$ gcc copy.c -o copy<br>
copy.c: In function ‘main’:<br>
copy.c:29:12: error: ‘TRUE’ undeclared (first use in this function)<br>
&nbsp;&nbsp;&nbsp;29 | &nbsp;&nbsp;&nbsp;&nbsp;while (TRUE) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~<br>
copy.c:29:12: note: each undeclared identifier is reported only once for each function it appears in<br>
$ gcc -DTRUE=1 copy.c -o copy<br>
# 2. the exit codes are the program's only "error messages"<br>
$ ./copy; echo "exit $? &nbsp;(wrong number of arguments)"<br>
exit 1 &nbsp;(wrong number of arguments)<br>
$ ./copy no-such-file out.txt; echo "exit $? &nbsp;(source cannot be opened)"<br>
exit 2 &nbsp;(source cannot be opened)<br>
$ ./copy copy.c /proc/out.txt; echo "exit $? &nbsp;(destination cannot be created)"<br>
exit 3 &nbsp;(destination cannot be created)<br>
$ seq 1 3000 &gt; in.txt<br>
$ ./copy in.txt out.txt; echo "exit $? &nbsp;(success)"<br>
exit 0 &nbsp;(success)<br>
# 3. OUTPUT_MODE 0700 asked for rwx------ ; umask (022) only removes bits, so 0700 survives<br>
$ stat -c '%A %s bytes %n' in.txt out.txt<br>
-rw-r--r-- 13893 bytes in.txt<br>
-rwx------ 13893 bytes out.txt<br>
# 4. count the system calls: 13,893 bytes with a 4096-byte buffer, then with a 1-byte buffer<br>
$ strace -o trace.log ./copy in.txt out2.txt<br>
$ sed -n '/openat.*"in.txt"/,$p' trace.log | grep -c '^read(3'<br>
5<br>
$ grep -c '^write(4' trace.log<br>
4<br>
$ sed 's/BUF_SIZE 4096/BUF_SIZE 1/' copy.c &gt; copy1.c &amp;&amp; gcc -DTRUE=1 copy1.c -o copy1<br>
$ strace -o trace1.log ./copy1 in.txt out3.txt<br>
$ sed -n '/openat.*"in.txt"/,$p' trace1.log | grep -c '^read(3'<br>
13894<br>
$ grep -c '^write(4' trace1.log<br>
13893</div>
<p>Exit 1, 2, 3 are the three early failures (wrong arguments, missing source, destination in <code>/proc</code> where files cannot be created). The new file really is <code>rwx------</code>. With a 4096-byte buffer, 13,893 bytes take <strong>5 reads</strong> (3 full + 1 partial + the final read that returns 0) and 4 writes; with a 1-byte buffer the same copy takes 13,894 reads and 13,893 writes — each one a trip into the kernel. That is why I/O is done in blocks.</p>
<p class="pitfall">⚠️ The first <code>read(3, …)</code> in a full strace log is not the program: it is the dynamic loader reading <code>libc.so.6</code> before <code>main</code> starts — the session therefore counts only after the <code>openat("in.txt")</code>.</p>`,
        `<p class="y-chinh">🎯 Hình 4-5, phần 2: <code>if (argc != 3) exit(1);</code> rồi <code>in_fd = open(argv[1], O_RDONLY)</code> (lỗi thì exit 2), <code>out_fd = creat(argv[2], OUTPUT_MODE)</code> (exit 3), và phần đầu vòng lặp chép.</p>
<p><code>open</code> và <code>creat</code> trả về một <strong>bộ mô tả tệp (file descriptor)</strong>, số nguyên nhỏ mà chương trình dùng trong mọi lời gọi sau đó; giá trị âm nghĩa là thất bại. <code>creat</code> là lời gọi lịch sử của UNIX; ngày nay nó được định nghĩa bằng <code>open(path, O_CREAT | O_WRONLY | O_TRUNC, mode)</code>. Vòng lặp đọc tối đa <code>BUF_SIZE</code> byte, và <code>read</code> trả về số byte thật sự nhận được: <code>&gt; 0</code> có dữ liệu, <code>0</code> hết tệp, <code>&lt; 0</code> lỗi.</p>
<p>➕ Mọi đường thoát, thử thật, và đếm lời gọi hệ thống bằng <code>strace</code>:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># 1. Hình 4-5 đúng như in KHÔNG biên dịch được: TRUE không được định nghĩa trong header nào của nó<br>
$ gcc copy.c -o copy<br>
copy.c: In function ‘main’:<br>
copy.c:29:12: error: ‘TRUE’ undeclared (first use in this function)<br>
&nbsp;&nbsp;&nbsp;29 | &nbsp;&nbsp;&nbsp;&nbsp;while (TRUE) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~<br>
copy.c:29:12: note: each undeclared identifier is reported only once for each function it appears in<br>
$ gcc -DTRUE=1 copy.c -o copy<br>
# 2. mã thoát là "thông báo lỗi" duy nhất của chương trình<br>
$ ./copy; echo "exit $? &nbsp;(wrong number of arguments)"<br>
exit 1 &nbsp;(wrong number of arguments)<br>
$ ./copy no-such-file out.txt; echo "exit $? &nbsp;(source cannot be opened)"<br>
exit 2 &nbsp;(source cannot be opened)<br>
$ ./copy copy.c /proc/out.txt; echo "exit $? &nbsp;(destination cannot be created)"<br>
exit 3 &nbsp;(destination cannot be created)<br>
$ seq 1 3000 &gt; in.txt<br>
$ ./copy in.txt out.txt; echo "exit $? &nbsp;(success)"<br>
exit 0 &nbsp;(success)<br>
# 3. OUTPUT_MODE 0700 xin rwx------ ; umask (022) chỉ gỡ bớt bit, nên 0700 giữ nguyên<br>
$ stat -c '%A %s bytes %n' in.txt out.txt<br>
-rw-r--r-- 13893 bytes in.txt<br>
-rwx------ 13893 bytes out.txt<br>
# 4. đếm lời gọi hệ thống: 13.893 byte với bộ đệm 4096 byte, rồi với bộ đệm 1 byte<br>
$ strace -o trace.log ./copy in.txt out2.txt<br>
$ sed -n '/openat.*"in.txt"/,$p' trace.log | grep -c '^read(3'<br>
5<br>
$ grep -c '^write(4' trace.log<br>
4<br>
$ sed 's/BUF_SIZE 4096/BUF_SIZE 1/' copy.c &gt; copy1.c &amp;&amp; gcc -DTRUE=1 copy1.c -o copy1<br>
$ strace -o trace1.log ./copy1 in.txt out3.txt<br>
$ sed -n '/openat.*"in.txt"/,$p' trace1.log | grep -c '^read(3'<br>
13894<br>
$ grep -c '^write(4' trace1.log<br>
13893</div>
<p>Exit 1, 2, 3 là ba lỗi sớm (sai số đối số, thiếu tệp nguồn, đích nằm trong <code>/proc</code> nơi không tạo được tệp). Tệp mới đúng là <code>rwx------</code>. Với bộ đệm 4096 byte, 13.893 byte tốn <strong>5 lần read</strong> (3 lần đầy + 1 lần thiếu + lần read cuối trả 0) và 4 lần write; với bộ đệm 1 byte, cùng việc chép tốn 13.894 lần read và 13.893 lần write — mỗi lần là một chuyến vào nhân. Đó là lý do I/O được làm theo khối.</p>
<p class="pitfall">⚠️ Lần <code>read(3, …)</code> đầu tiên trong log strace đầy đủ không phải của chương trình: đó là trình nạp động đọc <code>libc.so.6</code> trước khi <code>main</code> chạy — nên phiên ở trên chỉ đếm từ sau <code>openat("in.txt")</code>.</p>`],
      [12, 'Example Program Using File System Calls (3)',
        `<p class="y-chinh">🎯 Figure 4-5, part 3: the copy loop — <code>rd_count = read(…)</code>, stop if <code>rd_count &lt;= 0</code>; <code>wt_count = write(out_fd, buffer, rd_count)</code>, exit 4 if <code>wt_count &lt;= 0</code>; then close both files and exit 0 if the last read returned 0 (end of file), or 5 if it returned an error.</p>
<p>Two subtle points. The program writes <code>rd_count</code> bytes, not <code>BUF_SIZE</code>: the last piece is usually shorter. And the final status distinguishes a normal end (<code>rd_count == 0</code>) from a read error (<code>rd_count &lt; 0</code>) — the only reason the loop variable is checked after the loop. What the session of slide 11 showed first is the compiler's verdict on the figure as printed: <code>error: 'TRUE' undeclared</code>. Older books often relied on <code>#define TRUE 1</code> in a project header; in C today you write <code>while (1)</code>, or <code>#include &lt;stdbool.h&gt;</code> and <code>while (true)</code>.</p>
<p>➕ Two improvements a professional version needs: <strong>partial writes</strong> — <code>write</code> may write fewer bytes than asked (on pipes, sockets, full disks), so robust code loops until all <code>rd_count</code> bytes are written; and <strong>EINTR</strong> — a signal can interrupt <code>read</code>, which then returns −1 with <code>errno == EINTR</code> and should simply be retried.</p>
<p class="meo">🧠 Practice lesson 4.C revisits this loop; Chapter 1's exercise 1.C-4 built the same copier from scratch. Compare the two: the logic is identical, only the error reporting differs.</p>`,
        `<p class="y-chinh">🎯 Hình 4-5, phần 3: vòng lặp chép — <code>rd_count = read(…)</code>, dừng nếu <code>rd_count &lt;= 0</code>; <code>wt_count = write(out_fd, buffer, rd_count)</code>, exit 4 nếu <code>wt_count &lt;= 0</code>; rồi đóng cả hai tệp và exit 0 nếu lần đọc cuối trả 0 (hết tệp), hoặc 5 nếu nó trả lỗi.</p>
<p>Hai điểm tinh tế. Chương trình ghi <code>rd_count</code> byte chứ không phải <code>BUF_SIZE</code>: mẩu cuối thường ngắn hơn. Và trạng thái cuối phân biệt kết thúc bình thường (<code>rd_count == 0</code>) với lỗi đọc (<code>rd_count &lt; 0</code>) — lý do duy nhất biến của vòng lặp được kiểm sau vòng lặp. Thứ đầu tiên phiên ở slide 11 cho thấy là phán quyết của trình biên dịch về hình in trong sách: <code>error: 'TRUE' undeclared</code>. Sách cũ hay dựa vào <code>#define TRUE 1</code> trong một header của dự án; C ngày nay viết <code>while (1)</code>, hoặc <code>#include &lt;stdbool.h&gt;</code> rồi <code>while (true)</code>.</p>
<p>➕ Hai chỗ một bản chuyên nghiệp phải sửa: <strong>ghi thiếu (partial write)</strong> — <code>write</code> có thể ghi ít byte hơn yêu cầu (với pipe, socket, đĩa đầy), nên code chắc chắn phải lặp tới khi ghi đủ <code>rd_count</code> byte; và <strong>EINTR</strong> — một tín hiệu có thể ngắt <code>read</code>, khi đó nó trả −1 với <code>errno == EINTR</code> và chỉ cần gọi lại.</p>
<p class="meo">🧠 Bài thực hành 4.C quay lại vòng lặp này; bài tập 1.C-4 của Chương 1 đã tự dựng đúng chương trình chép này từ đầu. So hai bản: logic y hệt, chỉ khác cách báo lỗi.</p>`],
      [13, 'Single-Level Directory Systems',
        `<p class="y-chinh">🎯 Figure 4-6: a <strong>single-level directory system</strong> — one directory (the root) containing all the files, here four: A, B, C, D (in the figure each letter is the owner, not the file name).</p>
<p>To keep track of files, file systems use <strong>directories</strong> (folders), which in many systems are themselves files. The simplest design has exactly one: every file of every user lives in it. Advantages: simple, and finding a file means searching one place. Disadvantage: with several users, names collide — if two users both create a file called <code>mailbox</code>, the second overwrites the first — and even one user with thousands of files cannot organise them.</p>
<p>The book notes that this design is still used on simple embedded devices such as some digital cameras and music players, where a single user stores a small number of files. ➕ Early personal computers (the CDC 6600 supercomputer of the 1960s and the first PCs) also had a single directory.</p>
<p class="pitfall">⚠️ FE2 question 23 / FE4 question 27: "The simplest form of directory system is having one directory containing all the files. It is called the ___" — the bank answers <strong>root directory</strong> (the book: "sometimes it is called the root directory"). The <em>structure</em> is called single-level; the <em>directory itself</em> is the root.</p>`,
        `<p class="y-chinh">🎯 Hình 4-6: một <strong>hệ thư mục một cấp (single-level directory)</strong> — một thư mục duy nhất (thư mục gốc) chứa mọi tệp, ở đây là bốn tệp: A, B, C, D (trên hình mỗi chữ cái là chủ sở hữu, không phải tên tệp).</p>
<p>Để theo dõi tệp, hệ thống tệp dùng <strong>thư mục (directory, folder)</strong>, mà ở nhiều hệ, bản thân thư mục cũng là tệp. Thiết kế đơn giản nhất có đúng một thư mục: mọi tệp của mọi người dùng nằm hết trong đó. Ưu điểm: đơn giản, tìm tệp chỉ cần lục một chỗ. Nhược điểm: khi có nhiều người dùng, tên đụng nhau — nếu hai người cùng tạo tệp <code>mailbox</code>, tệp sau ghi đè tệp trước — và ngay cả một người có hàng nghìn tệp cũng không sắp xếp được.</p>
<p>Sách ghi rằng thiết kế này vẫn được dùng trên thiết bị nhúng đơn giản như vài máy ảnh số và máy nghe nhạc, nơi một người lưu ít tệp. ➕ Các máy tính cá nhân đời đầu (và siêu máy tính CDC 6600 thập niên 1960) cũng chỉ có một thư mục.</p>
<p class="pitfall">⚠️ FE2 câu 23 / FE4 câu 27: "Dạng hệ thư mục đơn giản nhất là có một thư mục chứa mọi tệp. Nó được gọi là ___" — ngân hàng chọn <strong>root directory</strong> (sách: "đôi khi được gọi là thư mục gốc"). <em>Cấu trúc</em> thì gọi là một cấp; còn <em>bản thân thư mục</em> là thư mục gốc.</p>`],
      [14, 'Hierarchical Directory Systems',
        `<p class="y-chinh">🎯 Figure 4-7: a <strong>hierarchical directory system</strong> — a tree: the root directory contains user directories (A, B, C), which contain files and user subdirectories, nested to any depth.</p>
<p>The hierarchy solves both problems of slide 13: each user has a private directory, so two users can both have a file called <code>mailbox</code>; and each user can group related files (a directory per course, per project) as deeply as needed. This ability to create an arbitrary number of subdirectories is the book's reason why "nearly all modern file systems are organized in this manner".</p>
<p>➕ The figure is drawn again for real in slide 15 (a UNIX tree, built with <code>mkdir -p</code> and shown by <code>tree</code>). ➕ Strictly, once links exist (slides 24–25) the hierarchy is no longer a tree but a <strong>directed acyclic graph</strong> — one file can have two parents.</p>
<p class="pitfall">⚠️ FE1 question 3: "Which directory structure would be the most efficient in preventing filename conflicts while allowing quick lookups?" — <strong>tree-structured</strong> (hierarchical). A two-level directory (one directory per user, no subdirectories) prevents conflicts between users but not within one user.</p>`,
        `<p class="y-chinh">🎯 Hình 4-7: một <strong>hệ thư mục phân cấp (hierarchical)</strong> — một cây: thư mục gốc chứa thư mục của từng người dùng (A, B, C), các thư mục này chứa tệp và thư mục con, lồng nhau bao nhiêu tầng cũng được.</p>
<p>Phân cấp giải được cả hai vấn đề của slide 13: mỗi người có thư mục riêng, nên hai người cùng có tệp tên <code>mailbox</code> cũng không sao; và mỗi người gom các tệp liên quan (mỗi môn học, mỗi dự án một thư mục) sâu bao nhiêu tuỳ thích. Khả năng tạo số lượng thư mục con tuỳ ý chính là lý do sách nói "gần như mọi hệ thống tệp hiện đại đều tổ chức theo cách này".</p>
<p>➕ Hình này được dựng lại thật ở slide 15 (một cây UNIX, dựng bằng <code>mkdir -p</code> và hiện bằng <code>tree</code>). ➕ Nói chính xác, khi đã có liên kết (slide 24–25) thì cấu trúc không còn là cây mà là <strong>đồ thị có hướng không chu trình (DAG)</strong> — một tệp có thể có hai cha.</p>
<p class="pitfall">⚠️ FE1 câu 3: "Cấu trúc thư mục nào hiệu quả nhất trong việc tránh trùng tên tệp mà vẫn tra nhanh?" — <strong>dạng cây (tree-structured)</strong>, tức phân cấp. Thư mục hai cấp (mỗi người một thư mục, không có thư mục con) tránh trùng tên giữa các người dùng nhưng không tránh trùng trong cùng một người.</p>`],
      [15, 'Path Names',
        `<p class="y-chinh">🎯 Figure 4-8: a UNIX directory tree — the root <code>/</code> contains <code>bin</code>, <code>etc</code>, <code>lib</code>, <code>usr</code>, <code>tmp</code>; <code>/usr</code> contains <code>ast</code>, <code>jim</code>, <code>lib</code>; <code>/usr/lib</code> contains <code>dict.</code>. A file is named by a <strong>path name</strong> such as <code>/usr/jim</code>.</p>
<p>Two kinds of path names. An <strong>absolute path name</strong> starts at the root and is unique: <code>/usr/ast/mailbox</code> (UNIX uses <code>/</code>, Windows <code>\\</code>, MULTICS used <code>&gt;</code>). A <strong>relative path name</strong> is interpreted from the <strong>working directory</strong> (current directory) of the process: if the working directory is <code>/usr/ast</code>, then <code>mailbox</code> means <code>/usr/ast/mailbox</code>. Every directory has two special entries: <code>.</code> (itself) and <code>..</code> (its parent).</p>
<p>➕ The book's own example — from <code>/usr/ast</code>, copy the dictionary with <code>cp ../lib/dictionary .</code> — on Figure 4-8 rebuilt under a home directory:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 4-8 rebuilt under ~/fig48 (the real / is not ours to change)<br>
$ mkdir -p fig48/{bin,etc,lib,tmp} fig48/usr/{ast,jim,lib}<br>
$ echo "a, aback, abandon" &gt; fig48/usr/lib/dictionary<br>
$ tree fig48<br>
fig48<br>
├── bin<br>
├── etc<br>
├── lib<br>
├── tmp<br>
└── usr<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── ast<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── jim<br>
&nbsp;&nbsp;&nbsp;&nbsp;└── lib<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── dictionary<br>
<br>
9 directories, 1 file<br>
# absolute path: starts at the root; relative path: starts at the working directory<br>
$ cd fig48/usr/ast<br>
$ pwd<br>
/home/sv/fig48/usr/ast<br>
$ cp ../lib/dictionary .<br>
$ ls<br>
dictionary<br>
$ realpath ../lib/dictionary ./dictionary<br>
/home/sv/fig48/usr/lib/dictionary<br>
/home/sv/fig48/usr/ast/dictionary<br>
# every directory contains "." (itself) and ".." (its parent): same i-numbers<br>
$ ls -id . .. ../../usr<br>
360850 .<br>
360849 ..<br>
360849 ../../usr<br>
# the root's ".." is the root itself<br>
$ ls -id / /..<br>
359588 /<br>
359588 /..</div>
<p><code>realpath</code> turns each relative name into its absolute form. <code>ls -id</code> proves what <code>.</code> and <code>..</code> are: <code>..</code> inside <code>ast</code> has the same i-number as <code>../../usr</code> — they are just directory entries pointing at existing i-nodes. And the root's <code>..</code> is the root itself (same number).</p>
<p class="pitfall">⚠️ FE: "How does a relative path differ from an absolute path?" — it <strong>depends on the current working directory</strong> (FE10 question 31). "An absolute path name in Linux is with respect to the ___" — the <strong>root directory</strong> (FE18 question 42). "What does <code>~</code> represent?" — the home directory of the current user (FE9 question 28; <code>~</code> is expanded by the shell, not by the kernel).</p>`,
        `<p class="y-chinh">🎯 Hình 4-8: một cây thư mục UNIX — gốc <code>/</code> chứa <code>bin</code>, <code>etc</code>, <code>lib</code>, <code>usr</code>, <code>tmp</code>; <code>/usr</code> chứa <code>ast</code>, <code>jim</code>, <code>lib</code>; <code>/usr/lib</code> chứa <code>dict.</code>. Một tệp được gọi bằng <strong>đường dẫn (path name)</strong> như <code>/usr/jim</code>.</p>
<p>Có hai loại đường dẫn. <strong>Đường dẫn tuyệt đối (absolute)</strong> bắt đầu từ gốc và là duy nhất: <code>/usr/ast/mailbox</code> (UNIX dùng <code>/</code>, Windows dùng <code>\\</code>, MULTICS dùng <code>&gt;</code>). <strong>Đường dẫn tương đối (relative)</strong> được hiểu từ <strong>thư mục làm việc (working directory)</strong> — thư mục hiện tại — của tiến trình: nếu thư mục làm việc là <code>/usr/ast</code> thì <code>mailbox</code> nghĩa là <code>/usr/ast/mailbox</code>. Thư mục nào cũng có hai mục đặc biệt: <code>.</code> (chính nó) và <code>..</code> (thư mục cha).</p>
<p>➕ Đúng ví dụ của sách — đứng ở <code>/usr/ast</code>, chép từ điển bằng <code>cp ../lib/dictionary .</code> — trên Hình 4-8 dựng lại dưới thư mục nhà:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Dựng lại Hình 4-8 dưới ~/fig48 (cây / thật không phải của mình để sửa)<br>
$ mkdir -p fig48/{bin,etc,lib,tmp} fig48/usr/{ast,jim,lib}<br>
$ echo "a, aback, abandon" &gt; fig48/usr/lib/dictionary<br>
$ tree fig48<br>
fig48<br>
├── bin<br>
├── etc<br>
├── lib<br>
├── tmp<br>
└── usr<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── ast<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── jim<br>
&nbsp;&nbsp;&nbsp;&nbsp;└── lib<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── dictionary<br>
<br>
9 directories, 1 file<br>
# đường dẫn tuyệt đối: bắt đầu từ gốc; tương đối: bắt đầu từ thư mục làm việc<br>
$ cd fig48/usr/ast<br>
$ pwd<br>
/home/sv/fig48/usr/ast<br>
$ cp ../lib/dictionary .<br>
$ ls<br>
dictionary<br>
$ realpath ../lib/dictionary ./dictionary<br>
/home/sv/fig48/usr/lib/dictionary<br>
/home/sv/fig48/usr/ast/dictionary<br>
# thư mục nào cũng có "." (chính nó) và ".." (cha nó): cùng số i-node<br>
$ ls -id . .. ../../usr<br>
360850 .<br>
360849 ..<br>
360849 ../../usr<br>
# ".." của gốc chính là gốc<br>
$ ls -id / /..<br>
359588 /<br>
359588 /..</div>
<p><code>realpath</code> đổi mỗi tên tương đối ra dạng tuyệt đối. <code>ls -id</code> chứng minh <code>.</code> và <code>..</code> là gì: <code>..</code> bên trong <code>ast</code> có cùng số i-node với <code>../../usr</code> — chúng chỉ là các mục thư mục trỏ vào i-node có sẵn. Và <code>..</code> của gốc chính là gốc (cùng số).</p>
<p class="pitfall">⚠️ FE: "Đường dẫn tương đối khác tuyệt đối thế nào?" — nó <strong>phụ thuộc thư mục làm việc hiện tại</strong> (FE10 câu 31). "Đường dẫn tuyệt đối trong Linux tính từ ___" — <strong>thư mục gốc</strong> (FE18 câu 42). "<code>~</code> nghĩa là gì?" — thư mục nhà của người dùng hiện tại (FE9 câu 28; <code>~</code> do shell khai triển, không phải nhân).</p>`],
      [16, 'Directory Operations',
        `<p class="y-chinh">🎯 The system calls for managing directories: Create, Delete, Opendir, Closedir, Readdir, Rename, Link, Unlink. ⚠️ The slide numbers the right column "5. 5. 5. 5." — the same PowerPoint numbering bug as slide 9; they are operations 5 to 8.</p>
<p>The book's descriptions: <strong>Create</strong> makes an empty directory (with only <code>.</code> and <code>..</code>); <strong>Delete</strong> removes a directory, and only an empty one; <strong>Opendir</strong> must be called before reading, like open for files; <strong>Closedir</strong> frees internal table space; <strong>Readdir</strong> returns the next entry in a standard format, whatever the on-disk structure (old programs read directories with plain <code>read</code> and broke when the format changed); <strong>Rename</strong>; <strong>Link</strong> makes a file appear in more than one directory (a hard link — slide 24); <strong>Unlink</strong> removes a directory entry, and if the file is present in only one directory, the file itself is removed.</p>
<p>➕ All eight as POSIX calls (<code>mkdir</code>, <code>rmdir</code>, <code>opendir</code>, <code>readdir</code>, <code>closedir</code>, <code>rename</code>, <code>link</code>, <code>unlink</code>):</p>
<pre><code class="language-c">// Slide 16: the 8 directory operations as POSIX calls
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;dirent.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

static int cmp(const void *a, const void *b) { return strcmp(*(char **)a, *(char **)b); }

static void list(const char *path) {
    DIR *d = opendir(path);                          // 3 Opendir
    char *names[32]; int n = 0;
    struct dirent *e;
    while ((e = readdir(d)) != NULL)                 // 5 Readdir: one entry per call
        names[n++] = strdup(e-&gt;d_name);
    closedir(d);                                     // 4 Closedir
    qsort(names, n, sizeof *names, cmp);             // readdir order is NOT alphabetical; sort for printing
    printf("   %s:", path);
    for (int i = 0; i &lt; n; i++) { printf(" %s", names[i]); free(names[i]); }
    putchar('\\n');
}

int main(void) {
    printf("1 create  mkdir(\\"proj\\")          -&gt; %d\\n", mkdir("proj", 0755));
    close(open("proj/a.txt", O_CREAT | O_WRONLY, 0644));
    list("proj");
    printf("6 rename  rename(a.txt, b.txt)   -&gt; %d\\n", rename("proj/a.txt", "proj/b.txt"));
    printf("7 link    link(b.txt, c.txt)     -&gt; %d\\n", link("proj/b.txt", "proj/c.txt"));
    list("proj");
    printf("2 delete  rmdir(\\"proj\\")          -&gt; %d (%s)\\n", rmdir("proj"), strerror(errno));
    printf("8 unlink  unlink(b.txt)          -&gt; %d\\n", unlink("proj/b.txt"));
    printf("8 unlink  unlink(c.txt)          -&gt; %d\\n", unlink("proj/c.txt"));
    list("proj");
    printf("2 delete  rmdir(\\"proj\\")          -&gt; %d\\n", rmdir("proj"));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thao-tac-thu-muc.c -o thao-tac-thu-muc &amp;&amp; ./thao-tac-thu-muc<br>
1 create &nbsp;mkdir("proj") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;&nbsp;proj: . .. a.txt<br>
6 rename &nbsp;rename(a.txt, b.txt) &nbsp;&nbsp;-&gt; 0<br>
7 link &nbsp;&nbsp;&nbsp;link(b.txt, c.txt) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;&nbsp;proj: . .. b.txt c.txt<br>
2 delete &nbsp;rmdir("proj") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; -1 (Directory not empty)<br>
8 unlink &nbsp;unlink(b.txt) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
8 unlink &nbsp;unlink(c.txt) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;&nbsp;proj: . ..<br>
2 delete &nbsp;rmdir("proj") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0</div>
<p><code>rmdir</code> on a non-empty directory fails with "Directory not empty"; after both names are unlinked it succeeds. The program sorts the names because <code>readdir</code> returns entries in the file system's internal order (on ext4, hash order), not alphabetically.</p>
<p class="pitfall">⚠️ FE6 question 27 / FE13 question 27: "When a directory has been read, it should be closed to free up internal table space" — <strong>Closedir</strong>. FE19 question 26: the call "to allow the file to appear in more than one directory" — <strong>LINK</strong>.</p>`,
        `<p class="y-chinh">🎯 Các lời gọi hệ thống quản lý thư mục: Create, Delete, Opendir, Closedir, Readdir, Rename, Link, Unlink. ⚠️ Slide đánh số cột phải "5. 5. 5. 5." — cùng lỗi đánh số PowerPoint như slide 9; đúng ra là thao tác 5 tới 8.</p>
<p>Mô tả của sách: <strong>Create</strong> tạo thư mục rỗng (chỉ có <code>.</code> và <code>..</code>); <strong>Delete</strong> xoá thư mục, và chỉ xoá được thư mục rỗng; <strong>Opendir</strong> phải gọi trước khi đọc, như open với tệp; <strong>Closedir</strong> giải phóng chỗ trong bảng nội bộ; <strong>Readdir</strong> trả mục kế tiếp theo một định dạng chuẩn, bất kể cấu trúc trên đĩa (chương trình xưa đọc thư mục bằng <code>read</code> trơn và hỏng khi định dạng đổi); <strong>Rename</strong>; <strong>Link</strong> cho một tệp xuất hiện trong nhiều thư mục (liên kết cứng — slide 24); <strong>Unlink</strong> gỡ một mục thư mục, và nếu tệp chỉ có mặt ở một thư mục thì chính tệp bị xoá.</p>
<p>➕ Cả tám dưới dạng lời gọi POSIX (<code>mkdir</code>, <code>rmdir</code>, <code>opendir</code>, <code>readdir</code>, <code>closedir</code>, <code>rename</code>, <code>link</code>, <code>unlink</code>):</p>
<pre><code class="language-c">// Slide 16: 8 thao tác trên thư mục dưới dạng lời gọi POSIX
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;dirent.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;

static int cmp(const void *a, const void *b) { return strcmp(*(char **)a, *(char **)b); }

static void list(const char *path) {
    DIR *d = opendir(path);                          // 3 Mở thư mục
    char *names[32]; int n = 0;
    struct dirent *e;
    while ((e = readdir(d)) != NULL)                 // 5 Đọc thư mục: mỗi lần gọi một mục
        names[n++] = strdup(e-&gt;d_name);
    closedir(d);                                     // 4 Đóng thư mục
    qsort(names, n, sizeof *names, cmp);             // thứ tự readdir KHÔNG theo abc; sắp lại để in
    printf("   %s:", path);
    for (int i = 0; i &lt; n; i++) { printf(" %s", names[i]); free(names[i]); }
    putchar('\\n');
}

int main(void) {
    printf("1 create  mkdir(\\"proj\\")          -&gt; %d\\n", mkdir("proj", 0755));
    close(open("proj/a.txt", O_CREAT | O_WRONLY, 0644));
    list("proj");
    printf("6 rename  rename(a.txt, b.txt)   -&gt; %d\\n", rename("proj/a.txt", "proj/b.txt"));
    printf("7 link    link(b.txt, c.txt)     -&gt; %d\\n", link("proj/b.txt", "proj/c.txt"));
    list("proj");
    printf("2 delete  rmdir(\\"proj\\")          -&gt; %d (%s)\\n", rmdir("proj"), strerror(errno));
    printf("8 unlink  unlink(b.txt)          -&gt; %d\\n", unlink("proj/b.txt"));
    printf("8 unlink  unlink(c.txt)          -&gt; %d\\n", unlink("proj/c.txt"));
    list("proj");
    printf("2 delete  rmdir(\\"proj\\")          -&gt; %d\\n", rmdir("proj"));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread thao-tac-thu-muc.c -o thao-tac-thu-muc &amp;&amp; ./thao-tac-thu-muc<br>
1 create &nbsp;mkdir("proj") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;&nbsp;proj: . .. a.txt<br>
6 rename &nbsp;rename(a.txt, b.txt) &nbsp;&nbsp;-&gt; 0<br>
7 link &nbsp;&nbsp;&nbsp;link(b.txt, c.txt) &nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;&nbsp;proj: . .. b.txt c.txt<br>
2 delete &nbsp;rmdir("proj") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; -1 (Directory not empty)<br>
8 unlink &nbsp;unlink(b.txt) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
8 unlink &nbsp;unlink(c.txt) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0<br>
&nbsp;&nbsp;&nbsp;proj: . ..<br>
2 delete &nbsp;rmdir("proj") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 0</div>
<p><code>rmdir</code> một thư mục còn đồ thì lỗi "Directory not empty"; sau khi gỡ cả hai cái tên thì thành công. Chương trình sắp xếp tên vì <code>readdir</code> trả mục theo thứ tự nội bộ của hệ thống tệp (trên ext4 là thứ tự băm), không theo abc.</p>
<p class="pitfall">⚠️ FE6 câu 27 / FE13 câu 27: "Đọc xong thư mục thì nên đóng nó để giải phóng chỗ trong bảng nội bộ" — <strong>Closedir</strong>. FE19 câu 26: lời gọi "cho phép tệp xuất hiện ở nhiều thư mục" — <strong>LINK</strong>.</p>`],
      [17, 'File System Layout',
        `<p class="y-chinh">🎯 Figure 4-9: a possible file-system layout — the whole disk starts with the <strong>MBR</strong> (Master Boot Record, sector 0) containing the <strong>partition table</strong>; each <strong>partition</strong> holds its own file system: boot block, <strong>superblock</strong>, free-space management, i-nodes, root directory, then files and directories.</p>
<p>At power-on the BIOS reads and runs the MBR; the MBR code finds the <em>active</em> partition, reads its first block (the <strong>boot block</strong>) and runs it, and the boot block loads the OS of that partition. Every partition starts with a boot block, even if it contains no OS (it might later). The <strong>superblock</strong> holds the key parameters of the file system — a magic number identifying its type, the number of blocks, and other administrative information — and is read into memory at boot or first use. Then come the free-space structures (bitmap or list), the i-nodes, the root directory, and the rest.</p>
<p>➕ Figure 4-9 built byte by byte: a C program writes a classic MBR with two partitions into a 20 MiB image, then partition 1 is formatted with ext4:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 4-9 for real: a 20 MiB "disk" with an MBR, two partitions, and an ext4 file system inside partition 1<br>
$ truncate -s 20M disk.img<br>
$ gcc -o mbr _mbr.c &amp;&amp; ./mbr disk.img<br>
entry 1: active type 0x83 &nbsp;start sector &nbsp;2048 &nbsp;20480 sectors = 10 MiB<br>
entry 2: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type 0x0c &nbsp;start sector 22528 &nbsp;18432 sectors = 9 MiB<br>
entry 3: empty<br>
entry 4: empty<br>
signature: 55 aa<br>
$ file disk.img<br>
disk.img: DOS/MBR boot sector; partition 1 : ID=0x83, active, start-CHS (0x0,0,0), end-CHS (0x0,0,0), startsector 2048, 20480 sectors; partition 2 : ID=0xc, start-CHS (0x0,0,0), end-CHS (0x0,0,0), startsector 22528, 18432 sectors<br>
# sector 0 = the MBR: boot code, then the partition table at byte 446, then 55 AA<br>
$ od -A d -t x1 -j 446 -N 66 disk.img<br>
0000446 80 00 00 00 83 00 00 00 00 08 00 00 00 50 00 00<br>
0000462 00 00 00 00 0c 00 00 00 00 58 00 00 00 48 00 00<br>
0000478 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00<br>
*<br>
0000510 55 aa<br>
0000512<br>
# give partition 1 (starting at sector 2048 = byte 1048576) its own device and format it<br>
$ DEV=$(losetup -f --show -o 1048576 --sizelimit 10485760 disk.img); echo $DEV<br>
/dev/loop0<br>
$ mkfs.ext4 -q -L part1 $DEV<br>
# inside the partition: block 0 = boot block (left empty by ext4), then the superblock at byte 1024<br>
$ od -A d -t x1 -N 16 $DEV<br>
0000000 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00<br>
0000016<br>
$ dumpe2fs -h $DEV 2&gt;/dev/null | grep -E '^(Filesystem volume name|Filesystem magic number|Block count|Block size|Inode count|Free blocks|Free inodes|First block|Inode size)'<br>
Filesystem volume name: &nbsp;&nbsp;part1<br>
Filesystem magic number: &nbsp;0xEF53<br>
Inode count: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2560<br>
Block count: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10240<br>
Free blocks: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8395<br>
Free inodes: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2549<br>
First block: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Block size: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024<br>
Inode size:	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256<br>
# the magic number 0xEF53 sits at byte 1024 + 56 of the partition (little-endian: 53 ef)<br>
$ od -A d -t x1 -j 1080 -N 2 $DEV<br>
0001080 53 ef<br>
0001082<br>
$ losetup -d $DEV</div>
<p>The partition table really starts at byte 446 (four 16-byte entries: 0x80 = active, type 0x83 = Linux, start sector 2048 = <code>00 08 00 00</code> little-endian), and sector 0 ends with <code>55 aa</code>; <code>file</code> recognises it. Inside the partition, block 0 is left as an empty boot block and the superblock at byte 1024 carries the ext4 magic number <code>0xEF53</code> (stored as <code>53 ef</code>), the block count and i-node count.</p>
<p>➕ Out of date: the MBR allows only <strong>4 primary partitions</strong> and, with 32-bit sector numbers, disks of at most 2 TiB. Today's PCs boot with <strong>UEFI</strong> from a <strong>GPT</strong> partition table (part of the UEFI specification), which keeps a "protective MBR" in sector 0 only for old tools.</p>
<p class="pitfall">⚠️ FE: "Sector 0 of the disk is called the ___ and is used to boot the computer" — <strong>MBR</strong> (FE5 question 31, FE2 question 24). "The first block of every partition" — <strong>boot block</strong> (FE4 question 28). "The block with a magic number, the number of blocks and other key administrative information" — <strong>superblock</strong> (FE22 question 44). Max partitions with an MBR — <strong>4</strong> (FE27 question 23).</p>`,
        `<p class="y-chinh">🎯 Hình 4-9: một bố cục hệ thống tệp khả dĩ — cả cái đĩa mở đầu bằng <strong>MBR</strong> (Master Boot Record, sector 0) chứa <strong>bảng phân vùng (partition table)</strong>; mỗi <strong>phân vùng</strong> chứa hệ thống tệp riêng: boot block, <strong>superblock</strong>, quản lý chỗ trống, i-node, thư mục gốc, rồi tới tệp và thư mục.</p>
<p>Khi bật máy, BIOS đọc và chạy MBR; mã trong MBR tìm phân vùng <em>active</em>, đọc khối đầu của nó (<strong>boot block</strong>) và chạy, rồi boot block nạp HĐH của phân vùng đó. Phân vùng nào cũng bắt đầu bằng một boot block, kể cả khi không chứa HĐH (biết đâu sau này có). <strong>Superblock</strong> giữ các tham số chính của hệ thống tệp — một magic number cho biết loại, số khối, và thông tin quản trị khác — và được đọc vào bộ nhớ khi khởi động hoặc lần đầu dùng. Sau đó là cấu trúc chỗ trống (bitmap hoặc danh sách), các i-node, thư mục gốc, và phần còn lại.</p>
<p>➕ Hình 4-9 dựng từng byte: một chương trình C ghi một MBR cổ điển có hai phân vùng vào ảnh 20 MiB, rồi phân vùng 1 được định dạng ext4:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 4-9 chạy thật: một "đĩa" 20 MiB có MBR, hai phân vùng, và một hệ thống tệp ext4 trong phân vùng 1<br>
$ truncate -s 20M disk.img<br>
$ gcc -o mbr _mbr.c &amp;&amp; ./mbr disk.img<br>
entry 1: active type 0x83 &nbsp;start sector &nbsp;2048 &nbsp;20480 sectors = 10 MiB<br>
entry 2: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type 0x0c &nbsp;start sector 22528 &nbsp;18432 sectors = 9 MiB<br>
entry 3: empty<br>
entry 4: empty<br>
signature: 55 aa<br>
$ file disk.img<br>
disk.img: DOS/MBR boot sector; partition 1 : ID=0x83, active, start-CHS (0x0,0,0), end-CHS (0x0,0,0), startsector 2048, 20480 sectors; partition 2 : ID=0xc, start-CHS (0x0,0,0), end-CHS (0x0,0,0), startsector 22528, 18432 sectors<br>
# sector 0 = MBR: mã khởi động, rồi bảng phân vùng ở byte 446, rồi 55 AA<br>
$ od -A d -t x1 -j 446 -N 66 disk.img<br>
0000446 80 00 00 00 83 00 00 00 00 08 00 00 00 50 00 00<br>
0000462 00 00 00 00 0c 00 00 00 00 58 00 00 00 48 00 00<br>
0000478 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00<br>
*<br>
0000510 55 aa<br>
0000512<br>
# cho phân vùng 1 (bắt đầu ở sector 2048 = byte 1048576) một thiết bị riêng rồi định dạng<br>
$ DEV=$(losetup -f --show -o 1048576 --sizelimit 10485760 disk.img); echo $DEV<br>
/dev/loop0<br>
$ mkfs.ext4 -q -L part1 $DEV<br>
# bên trong phân vùng: khối 0 = boot block (ext4 để trống), rồi superblock ở byte 1024<br>
$ od -A d -t x1 -N 16 $DEV<br>
0000000 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00<br>
0000016<br>
$ dumpe2fs -h $DEV 2&gt;/dev/null | grep -E '^(Filesystem volume name|Filesystem magic number|Block count|Block size|Inode count|Free blocks|Free inodes|First block|Inode size)'<br>
Filesystem volume name: &nbsp;&nbsp;part1<br>
Filesystem magic number: &nbsp;0xEF53<br>
Inode count: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2560<br>
Block count: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10240<br>
Free blocks: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8395<br>
Free inodes: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2549<br>
First block: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Block size: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024<br>
Inode size:	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;256<br>
# magic number 0xEF53 nằm ở byte 1024 + 56 của phân vùng (little-endian: 53 ef)<br>
$ od -A d -t x1 -j 1080 -N 2 $DEV<br>
0001080 53 ef<br>
0001082<br>
$ losetup -d $DEV</div>
<p>Bảng phân vùng đúng là bắt đầu ở byte 446 (bốn mục 16 byte: 0x80 = active, kiểu 0x83 = Linux, sector đầu 2048 = <code>00 08 00 00</code> theo little-endian), và sector 0 kết thúc bằng <code>55 aa</code>; lệnh <code>file</code> nhận ra nó. Bên trong phân vùng, khối 0 để trống làm boot block và superblock ở byte 1024 mang magic number của ext4 <code>0xEF53</code> (lưu thành <code>53 ef</code>), số khối và số i-node.</p>
<p>➕ Đã lỗi thời: MBR chỉ cho <strong>4 phân vùng chính</strong> và, vì số sector 32 bit, đĩa tối đa 2 TiB. PC ngày nay khởi động bằng <strong>UEFI</strong> từ bảng phân vùng <strong>GPT</strong> (một phần của đặc tả UEFI), chỉ giữ một "MBR bảo vệ" ở sector 0 cho công cụ cũ.</p>
<p class="pitfall">⚠️ FE: "Sector 0 của đĩa gọi là ___ và dùng để khởi động máy" — <strong>MBR</strong> (FE5 câu 31, FE2 câu 24). "Khối đầu tiên của mọi phân vùng" — <strong>boot block</strong> (FE4 câu 28). "Khối chứa magic number, số khối và các thông tin quản trị chính" — <strong>superblock</strong> (FE22 câu 44). Số phân vùng tối đa với MBR — <strong>4</strong> (FE27 câu 23).</p>`],
      [18, 'Implementing FilesContiguous Layout',
        `<p class="y-chinh">🎯 Figure 4-10: <strong>contiguous allocation</strong> — (a) seven files A–G each stored as a run of consecutive blocks (A 4 blocks, B 3, C 6, D 5, E 12, F 6, G 3); (b) the disk after files D and F have been removed: two holes, of 5 and 6 blocks.</p>
<p>Two big advantages: it is <strong>simple</strong> (a file is just "first block + number of blocks") and the <strong>read performance is excellent</strong> — one seek, then the whole file streams off the disk. One big drawback: over time the disk becomes <strong>fragmented</strong>. Deleting files leaves holes; a new file needs one hole big enough, and its final size must be known when it is created. The simulator replays the figure and then tries to store two new files with first fit:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c7506cdbe499485e369c95ba57e28ed15f67684e.svg" alt="(a) seven files laid out one after another" loading="lazy" /><p class="chu-thich">🧮 (a) seven files laid out one after another</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TEP = [['A', 4], ['B', 3], ['C', 6], ['D', 5], ['E', 12], ['F', 6], ['G', 3]];
const N = 42;                                         // disk size in blocks

function datLienTuc() {                               // lay the files out one after another
  const disk = Array(N).fill(null);
  let k = 0;
  for (const [ten, n] of TEP) { for (let i = 0; i &lt; n; i++) disk[k + i] = ten; k += n; }
  return disk;
}
function cacLo(disk) {                                // holes = runs of free blocks: [start, length]
  const lo = [];
  for (let i = 0; i &lt; N; ) {
    if (disk[i] !== null) { i++; continue; }
    let j = i; while (j &lt; N &amp;&amp; disk[j] === null) j++;
    lo.push([i, j - i]); i = j;
  }
  return lo;
}
function firstFit(disk, ten, n) {                     // first hole big enough; null if none
  const h = cacLo(disk).find(([, len]) =&gt; len &gt;= n);
  if (!h) return null;
  for (let i = 0; i &lt; n; i++) disk[h[0] + i] = ten;
  return h[0];
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/94f207eb94387135a779c20f7dbb546293026c9d.svg" alt="(b) D and F removed: holes of 5 and 6 blocks" loading="lazy" /><p class="chu-thich">🧮 (b) D and F removed: holes of 5 and 6 blocks</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TEP = [['A', 4], ['B', 3], ['C', 6], ['D', 5], ['E', 12], ['F', 6], ['G', 3]];
const N = 42;                                         // disk size in blocks

function datLienTuc() {                               // lay the files out one after another
  const disk = Array(N).fill(null);
  let k = 0;
  for (const [ten, n] of TEP) { for (let i = 0; i &lt; n; i++) disk[k + i] = ten; k += n; }
  return disk;
}
function cacLo(disk) {                                // holes = runs of free blocks: [start, length]
  const lo = [];
  for (let i = 0; i &lt; N; ) {
    if (disk[i] !== null) { i++; continue; }
    let j = i; while (j &lt; N &amp;&amp; disk[j] === null) j++;
    lo.push([i, j - i]); i = j;
  }
  return lo;
}
function firstFit(disk, ten, n) {                     // first hole big enough; null if none
  const h = cacLo(disk).find(([, len]) =&gt; len &gt;= n);
  if (!h) return null;
  for (let i = 0; i &lt; n; i++) disk[h[0] + i] = ten;
  return h[0];
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ecf82bc9f107b8546bd61a9fef680fb8d0f992bf.svg" alt="(c) 14 blocks are free, yet a 7-block file does not fit — external fragmentation" loading="lazy" /><p class="chu-thich">🧮 (c) 14 blocks are free, yet a 7-block file does not fit — external fragmentation</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TEP = [['A', 4], ['B', 3], ['C', 6], ['D', 5], ['E', 12], ['F', 6], ['G', 3]];
const N = 42;                                         // disk size in blocks

function datLienTuc() {                               // lay the files out one after another
  const disk = Array(N).fill(null);
  let k = 0;
  for (const [ten, n] of TEP) { for (let i = 0; i &lt; n; i++) disk[k + i] = ten; k += n; }
  return disk;
}
function cacLo(disk) {                                // holes = runs of free blocks: [start, length]
  const lo = [];
  for (let i = 0; i &lt; N; ) {
    if (disk[i] !== null) { i++; continue; }
    let j = i; while (j &lt; N &amp;&amp; disk[j] === null) j++;
    lo.push([i, j - i]); i = j;
  }
  return lo;
}
function firstFit(disk, ten, n) {                     // first hole big enough; null if none
  const h = cacLo(disk).find(([, len]) =&gt; len &gt;= n);
  if (!h) return null;
  for (let i = 0; i &lt; n; i++) disk[h[0] + i] = ten;
  return h[0];
}</code></pre></details>
<p>Where contiguous allocation still wins: <strong>write-once media</strong> — CD-ROMs, DVDs (slide 46), where file sizes are known in advance and nothing is ever deleted. ➕ And in a modern form everywhere: <strong>extents</strong>. ext4, NTFS, XFS and APFS describe a file as a few runs "(start, length)" instead of a block list. Here ext4 really does it:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 18 today: ext4 stores a file as EXTENTS — runs of contiguous blocks (start, length)<br>
$ mkfs.ext4 -q -b 4096 disk.img 64M<br>
Creating regular file disk.img<br>
$ mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
# a 10 MB file written in one go: the allocator finds contiguous space<br>
$ head -c 10M /dev/zero &gt; /mnt/d/video.bin &amp;&amp; sync<br>
$ filefrag -v /mnt/d/video.bin | sed -n '2,4p;$p'<br>
File size of /mnt/d/video.bin is 10485760 (2560 blocks of 4096 bytes)<br>
&nbsp;ext: &nbsp;&nbsp;&nbsp;&nbsp;logical_offset: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;physical_offset: length: &nbsp;&nbsp;expected: flags:<br>
&nbsp;&nbsp;&nbsp;0: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.. &nbsp;&nbsp;&nbsp;2559: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2065.. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4624: &nbsp;&nbsp;2560: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last,eof<br>
/mnt/d/video.bin: 1 extent found<br>
# now force fragmentation: two files growing at the same time, 64 KB each turn<br>
$ for i in $(seq 1 40); do head -c 64K /dev/zero &gt;&gt; /mnt/d/a.log; sync; head -c 64K /dev/zero &gt;&gt; /mnt/d/b.log; sync; done<br>
$ filefrag /mnt/d/a.log /mnt/d/b.log<br>
/mnt/d/a.log: 40 extents found<br>
/mnt/d/b.log: 40 extents found<br>
$ umount /mnt/d</div>
<p>A 10 MB file written in one go is one extent of 2560 blocks — perfectly contiguous. Two files growing in turns end up in 40 extents each: fragmentation is still a real effect, which is why the allocator delays decisions (delayed allocation) and tries to keep files together.</p>
<p class="pitfall">⚠️ FE21 question 13: "What is INCORRECT about contiguous allocation?" — "it does not cause disk fragmentation" (it does). FE19 question 12: its main disadvantage — the file cannot grow unless the space after it is free. FE1 question 1: "uses both index blocks and contiguous portions" — <strong>extent-based</strong> allocation. FE10 question 30: keeping related blocks close for retrieval speed — <strong>contiguous</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 4-10: <strong>cấp phát liên tục (contiguous allocation)</strong> — (a) bảy tệp A–G, mỗi tệp là một dải khối liền nhau (A 4 khối, B 3, C 6, D 5, E 12, F 6, G 3); (b) đĩa sau khi xoá tệp D và F: hai lỗ trống, 5 và 6 khối.</p>
<p>Hai ưu điểm lớn: <strong>đơn giản</strong> (một tệp chỉ là "khối đầu + số khối") và <strong>đọc cực nhanh</strong> — dịch đầu từ một lần, rồi cả tệp chảy ra khỏi đĩa. Một nhược điểm lớn: lâu dần đĩa bị <strong>phân mảnh (fragmentation)</strong>. Xoá tệp để lại lỗ; tệp mới cần một lỗ đủ lớn, và cỡ cuối cùng của nó phải biết ngay lúc tạo. Bộ mô phỏng diễn lại hình rồi thử lưu hai tệp mới bằng first fit:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cba29f06257dfc9babdcfc1ddb238ff86c696f99.svg" alt="(a) bảy tệp đặt nối tiếp nhau" loading="lazy" /><p class="chu-thich">🧮 (a) bảy tệp đặt nối tiếp nhau</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TEP = [['A', 4], ['B', 3], ['C', 6], ['D', 5], ['E', 12], ['F', 6], ['G', 3]];
const N = 42;                                         // cỡ đĩa (khối)

function datLienTuc() {                               // đặt các tệp nối tiếp nhau
  const disk = Array(N).fill(null);
  let k = 0;
  for (const [ten, n] of TEP) { for (let i = 0; i &lt; n; i++) disk[k + i] = ten; k += n; }
  return disk;
}
function cacLo(disk) {                                // lỗ = dải khối trống liên tiếp
  const lo = [];
  for (let i = 0; i &lt; N; ) {
    if (disk[i] !== null) { i++; continue; }
    let j = i; while (j &lt; N &amp;&amp; disk[j] === null) j++;
    lo.push([i, j - i]); i = j;
  }
  return lo;
}
function firstFit(disk, ten, n) {                     // lỗ đầu tiên đủ lớn; không có ⇒ null
  const h = cacLo(disk).find(([, len]) =&gt; len &gt;= n);
  if (!h) return null;
  for (let i = 0; i &lt; n; i++) disk[h[0] + i] = ten;
  return h[0];
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/27f6c50fcbc8bb5bf2e85c7eb53cfe83880eee15.svg" alt="(b) xoá D và F: hai lỗ 5 và 6 khối" loading="lazy" /><p class="chu-thich">🧮 (b) xoá D và F: hai lỗ 5 và 6 khối</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TEP = [['A', 4], ['B', 3], ['C', 6], ['D', 5], ['E', 12], ['F', 6], ['G', 3]];
const N = 42;                                         // cỡ đĩa (khối)

function datLienTuc() {                               // đặt các tệp nối tiếp nhau
  const disk = Array(N).fill(null);
  let k = 0;
  for (const [ten, n] of TEP) { for (let i = 0; i &lt; n; i++) disk[k + i] = ten; k += n; }
  return disk;
}
function cacLo(disk) {                                // lỗ = dải khối trống liên tiếp
  const lo = [];
  for (let i = 0; i &lt; N; ) {
    if (disk[i] !== null) { i++; continue; }
    let j = i; while (j &lt; N &amp;&amp; disk[j] === null) j++;
    lo.push([i, j - i]); i = j;
  }
  return lo;
}
function firstFit(disk, ten, n) {                     // lỗ đầu tiên đủ lớn; không có ⇒ null
  const h = cacLo(disk).find(([, len]) =&gt; len &gt;= n);
  if (!h) return null;
  for (let i = 0; i &lt; n; i++) disk[h[0] + i] = ten;
  return h[0];
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fbe93fcdc9e1316fb34a0b8d781cffdbbb7516fa.svg" alt="(c) trống 14 khối mà tệp 7 khối vẫn không vừa — phân mảnh ngoài" loading="lazy" /><p class="chu-thich">🧮 (c) trống 14 khối mà tệp 7 khối vẫn không vừa — phân mảnh ngoài</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TEP = [['A', 4], ['B', 3], ['C', 6], ['D', 5], ['E', 12], ['F', 6], ['G', 3]];
const N = 42;                                         // cỡ đĩa (khối)

function datLienTuc() {                               // đặt các tệp nối tiếp nhau
  const disk = Array(N).fill(null);
  let k = 0;
  for (const [ten, n] of TEP) { for (let i = 0; i &lt; n; i++) disk[k + i] = ten; k += n; }
  return disk;
}
function cacLo(disk) {                                // lỗ = dải khối trống liên tiếp
  const lo = [];
  for (let i = 0; i &lt; N; ) {
    if (disk[i] !== null) { i++; continue; }
    let j = i; while (j &lt; N &amp;&amp; disk[j] === null) j++;
    lo.push([i, j - i]); i = j;
  }
  return lo;
}
function firstFit(disk, ten, n) {                     // lỗ đầu tiên đủ lớn; không có ⇒ null
  const h = cacLo(disk).find(([, len]) =&gt; len &gt;= n);
  if (!h) return null;
  for (let i = 0; i &lt; n; i++) disk[h[0] + i] = ten;
  return h[0];
}</code></pre></details>
<p>Chỗ cấp phát liên tục vẫn thắng: <strong>phương tiện ghi một lần</strong> — CD-ROM, DVD (slide 46), nơi cỡ tệp biết trước và không bao giờ xoá. ➕ Và ở dạng hiện đại thì có mặt khắp nơi: <strong>extent</strong>. ext4, NTFS, XFS, APFS mô tả một tệp bằng vài dải "(khối đầu, độ dài)" thay cho danh sách từng khối. Đây là ext4 làm thật:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 18 ngày nay: ext4 lưu tệp dạng EXTENT — các dải khối liên tục (khối đầu, độ dài)<br>
$ mkfs.ext4 -q -b 4096 disk.img 64M<br>
Creating regular file disk.img<br>
$ mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
# một tệp 10 MB ghi một lèo: bộ cấp phát tìm được chỗ liền nhau<br>
$ head -c 10M /dev/zero &gt; /mnt/d/video.bin &amp;&amp; sync<br>
$ filefrag -v /mnt/d/video.bin | sed -n '2,4p;$p'<br>
File size of /mnt/d/video.bin is 10485760 (2560 blocks of 4096 bytes)<br>
&nbsp;ext: &nbsp;&nbsp;&nbsp;&nbsp;logical_offset: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;physical_offset: length: &nbsp;&nbsp;expected: flags:<br>
&nbsp;&nbsp;&nbsp;0: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.. &nbsp;&nbsp;&nbsp;2559: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2065.. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4624: &nbsp;&nbsp;2560: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last,eof<br>
/mnt/d/video.bin: 1 extent found<br>
# giờ ép phân mảnh: hai tệp lớn lên cùng lúc, mỗi lượt 64 KB<br>
$ for i in $(seq 1 40); do head -c 64K /dev/zero &gt;&gt; /mnt/d/a.log; sync; head -c 64K /dev/zero &gt;&gt; /mnt/d/b.log; sync; done<br>
$ filefrag /mnt/d/a.log /mnt/d/b.log<br>
/mnt/d/a.log: 40 extents found<br>
/mnt/d/b.log: 40 extents found<br>
$ umount /mnt/d</div>
<p>Tệp 10 MB ghi một lèo là một extent 2560 khối — liền mạch hoàn toàn. Hai tệp lớn lên xen kẽ thì mỗi tệp thành 40 extent: phân mảnh vẫn là chuyện có thật, vì thế bộ cấp phát hoãn quyết định (delayed allocation) và cố giữ các khối của một tệp ở gần nhau.</p>
<p class="pitfall">⚠️ FE21 câu 13: "Điều nào SAI về cấp phát liên tục?" — "nó không gây phân mảnh đĩa" (có gây). FE19 câu 12: nhược điểm chính — tệp không lớn thêm được trừ khi chỗ ngay sau nó còn trống. FE1 câu 1: "dùng cả khối chỉ mục lẫn các đoạn liên tục" — cấp phát <strong>theo extent</strong>. FE10 câu 30: giữ các khối liên quan gần nhau để truy xuất nhanh — <strong>liên tục</strong>.</p>`],
      [19, 'Implementing FilesLinked List Allocation',
        `<p class="y-chinh">🎯 Figure 4-11: storing a file as a <strong>linked list of disk blocks</strong> — the first word of each block points to the next. File A occupies physical blocks 4, 7, 2, 10, 12; file B occupies 6, 3, 11, 14.</p>
<p>Advantages: <strong>every block can be used</strong> — no external fragmentation, any free block anywhere will do; and the directory entry only needs the address of the first block. Disadvantages: <strong>random access is extremely slow</strong> — to reach block n the OS must read the n blocks before it; and the data in a block is no longer a power of two (the pointer eats a few bytes), which is awkward because programs read and write in power-of-two sizes. The simulator counts the reads:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/dac4b1562a6ec66843078733a2e03d2e9715932e.svg" alt="Linked allocation: to reach file block 3 of A, four blocks must be read" loading="lazy" /><p class="chu-thich">🧮 Linked allocation: to reach file block 3 of A, four blocks must be read</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TEP = { A: [4, 7, 2, 10, 12], B: [6, 3, 11, 14] };
const KHOI = 1024, CON_TRO = 4;
const docDeToi = (ten, k) =&gt; TEP[ten].slice(0, k + 1);   // blocks read to reach logical block k</code></pre></details>
<p>Reading logical block k costs k + 1 disk reads (here 4 → 7 → 2 → 10). With a 1024-byte block and a 4-byte pointer, each block carries 1020 bytes of data, so a program reading 1024 bytes needs pieces of two blocks. ➕ One more weakness: a single corrupted pointer loses the rest of the file.</p>
<p class="pitfall">⚠️ FE3 question 24: "Which file allocation method uses pointers in each file block to the next block?" — <strong>linked allocation</strong>. Old lesson 4.2 has the comparison table of all three methods.</p>`,
        `<p class="y-chinh">🎯 Hình 4-11: lưu tệp dưới dạng <strong>danh sách liên kết các khối đĩa</strong> — từ (word) đầu tiên của mỗi khối trỏ tới khối kế. Tệp A nằm ở các khối vật lý 4, 7, 2, 10, 12; tệp B nằm ở 6, 3, 11, 14.</p>
<p>Ưu điểm: <strong>khối nào cũng dùng được</strong> — không phân mảnh ngoài, khối trống ở đâu cũng xài được; và mục thư mục chỉ cần địa chỉ khối đầu. Nhược điểm: <strong>truy cập ngẫu nhiên cực chậm</strong> — muốn tới khối n, HĐH phải đọc n khối đứng trước; và dữ liệu trong một khối không còn là luỹ thừa của 2 (con trỏ ăn mất vài byte), bất tiện vì chương trình hay đọc ghi theo cỡ luỹ thừa của 2. Bộ mô phỏng đếm số lần đọc:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0687fd5e88a2586ba04e4e44c5ba3e58e497890b.svg" alt="Cấp phát liên kết: muốn tới khối tệp 3 của A phải đọc bốn khối" loading="lazy" /><p class="chu-thich">🧮 Cấp phát liên kết: muốn tới khối tệp 3 của A phải đọc bốn khối</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TEP = { A: [4, 7, 2, 10, 12], B: [6, 3, 11, 14] };
const KHOI = 1024, CON_TRO = 4;
const docDeToi = (ten, k) =&gt; TEP[ten].slice(0, k + 1);   // các khối phải đọc để tới khối logic k</code></pre></details>
<p>Đọc khối logic k tốn k + 1 lần đọc đĩa (ở đây 4 → 7 → 2 → 10). Với khối 1024 byte và con trỏ 4 byte, mỗi khối chỉ mang 1020 byte dữ liệu, nên chương trình đọc 1024 byte phải ghép từ hai khối. ➕ Thêm một điểm yếu: một con trỏ hỏng là mất toàn bộ phần sau của tệp.</p>
<p class="pitfall">⚠️ FE3 câu 24: "Cách cấp phát nào dùng con trỏ trong mỗi khối của tệp trỏ tới khối kế?" — <strong>cấp phát liên kết (linked)</strong>. Bài cũ 4.2 có bảng so sánh cả ba cách.</p>`],
      [20, 'Implementing FilesLinked List – Table in Memory',
        `<p class="y-chinh">🎯 Figure 4-12: linked-list allocation using a <strong>file allocation table (FAT)</strong> in main memory — the pointers of Figure 4-11 are taken out of the blocks and put into one table with an entry per disk block. File A starts at block 4 and follows 4 → 7 → 2 → 10 → 12; file B 6 → 3 → 11 → 14; −1 marks the end.</p>
<p>This keeps the advantages of the linked list and removes both problems: the whole block is now data, and <strong>random access is fast</strong> because the chain is followed in RAM, without disk reads. The directory entry only stores the starting block number. This is the MS-DOS / Windows 9x method — and, on USB sticks and SD cards, still everywhere today.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/0ae31efd2e508a9f271242a96c16ad01a214aa28.svg" alt="Figure 4-12: the FAT and the two chains" loading="lazy" /><p class="chu-thich">🧮 Figure 4-12: the FAT and the two chains</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const FAT = Array(16).fill(null);                     // null = unused block
Object.assign(FAT, { 4: 7, 7: 2, 2: 10, 10: 12, 12: -1, 6: 3, 3: 11, 11: 14, 14: -1 });
const DAU = { A: 4, B: 6 };                           // first block, stored in the directory entry
function chuoi(dau) {                                 // follow FAT[k] until -1 — in memory, no disk reads
  const ds = [];
  for (let k = dau; k !== -1; k = FAT[k]) ds.push(k);
  return ds;
}
// the size of the table for a big disk (book §4.3.2): one entry per block
const coFat = (diskBytes, blockBytes, entryBytes) =&gt; (diskBytes / blockBytes) * entryBytes;</code></pre></details>
<p>The price: the <strong>whole table must be in memory</strong> all the time, one entry per block, whether files are open or not. For a big disk that is huge:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6944a08b94e2cfdccd408b01fe02c51fa03ae82a.svg" alt="RAM needed by the FAT of a 1 TB disk with 1 KB blocks" loading="lazy" /><p class="chu-thich">🧮 RAM needed by the FAT of a 1 TB disk with 1 KB blocks</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const FAT = Array(16).fill(null);                     // null = unused block
Object.assign(FAT, { 4: 7, 7: 2, 2: 10, 10: 12, 12: -1, 6: 3, 3: 11, 11: 14, 14: -1 });
const DAU = { A: 4, B: 6 };                           // first block, stored in the directory entry
function chuoi(dau) {                                 // follow FAT[k] until -1 — in memory, no disk reads
  const ds = [];
  for (let k = dau; k !== -1; k = FAT[k]) ds.push(k);
  return ds;
}
// the size of the table for a big disk (book §4.3.2): one entry per block
const coFat = (diskBytes, blockBytes, entryBytes) =&gt; (diskBytes / blockBytes) * entryBytes;</code></pre></details>
<p>➕ A real FAT-16 image, written with a deliberate gap (write A, write B, delete A, remount, write C), then read <em>by hand</em> — boot sector, FAT, root directory, chains — by a small C program that knows nothing but the on-disk format:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 4-12 on a real FAT-16 "USB stick" (8 MB image, 1 cluster = 1 sector = 512 bytes)<br>
$ truncate -s 8M usb.img<br>
$ mkfs.vfat -F 16 -s 1 -i 12345678 -n DEMO usb.img &gt; /dev/null<br>
$ mkdir -p /mnt/usb &amp;&amp; mount -o loop usb.img /mnt/usb<br>
# write A (2 clusters) and B (2 clusters), delete A, then write C (5 clusters)<br>
$ head -c 1000 /dev/zero | tr '\\0' 'A' &gt; /mnt/usb/A.TXT<br>
$ head -c 1000 /dev/zero | tr '\\0' 'B' &gt; /mnt/usb/B.TXT<br>
$ ls -l /mnt/usb<br>
total 2<br>
-rwxr-xr-x 1 root root 1000 Oct 26 01:16 A.TXT<br>
-rwxr-xr-x 1 root root 1000 Oct 26 01:16 B.TXT<br>
$ rm /mnt/usb/A.TXT<br>
# unmount and mount again: the driver starts searching for free clusters from the beginning<br>
$ umount /mnt/usb &amp;&amp; mount -o loop usb.img /mnt/usb<br>
$ head -c 2500 /dev/zero | tr '\\0' 'C' &gt; /mnt/usb/C.TXT<br>
$ ls -l /mnt/usb<br>
total 4<br>
-rwxr-xr-x 1 root root 1000 Oct 26 01:16 B.TXT<br>
-rwxr-xr-x 1 root root 2500 Oct 26 01:16 C.TXT<br>
$ umount /mnt/usb<br>
# now read the raw image ourselves — no file-system driver, just bytes<br>
$ gcc -Wall -o doc-fat _doc-fat.c<br>
$ ./doc-fat usb.img<br>
bytes/sector 512, sectors/cluster 1, 2 FATs of 64 sectors<br>
FAT at byte 512, root directory at byte 66048, cluster 2 at byte 82432<br>
<br>
C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.TXT &nbsp;size &nbsp;2500 &nbsp;first cluster 3 &nbsp;chain: 3 4 7 8 9 -&gt; EOF<br>
B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.TXT &nbsp;size &nbsp;1000 &nbsp;first cluster 5 &nbsp;chain: 5 6 -&gt; EOF<br>
# the FAT itself: entries 0..12, 2 bytes each (0xffff = end of chain)<br>
$ od -A d -t x2 -j 512 -N 26 usb.img<br>
0000512 fff8 ffff 0000 0004 0007 0006 ffff 0008<br>
0000528 0009 ffff 0000 0000 0000<br>
0000538</div>
<p>C.TXT (2500 bytes = 5 clusters of 512) starts at cluster 3 and jumps over B: 3 → 4 → 7 → 8 → 9, exactly a Figure 4-12 chain. In the raw FAT, entry 3 holds <code>0004</code>, entry 4 holds <code>0007</code>, entry 9 holds <code>ffff</code> (end); B is 5 → 6. (Cluster 2 is still free: the Linux driver happened to start its search after it.)</p>
<p class="pitfall">⚠️ FE: "A table in main memory storing the linked list of allocation of disk blocks is called" — <strong>File Allocation Table</strong> (FE18 question 31, FE26 question 27). "MS-DOS is implemented with" — <strong>linked allocation using FAT</strong> (FE17 question 18, FE22 question 15).</p>`,
        `<p class="y-chinh">🎯 Hình 4-12: cấp phát danh sách liên kết dùng một <strong>bảng cấp phát tệp (FAT — File Allocation Table)</strong> trong bộ nhớ chính — các con trỏ của Hình 4-11 được lấy ra khỏi khối và gom vào một bảng, mỗi khối đĩa một mục. Tệp A bắt đầu ở khối 4 và đi 4 → 7 → 2 → 10 → 12; tệp B 6 → 3 → 11 → 14; −1 đánh dấu hết.</p>
<p>Cách này giữ ưu điểm của danh sách liên kết và bỏ được cả hai vấn đề: cả khối giờ là dữ liệu, và <strong>truy cập ngẫu nhiên nhanh</strong> vì chuỗi được lần trong RAM, không cần đọc đĩa. Mục thư mục chỉ lưu số khối bắt đầu. Đây là cách của MS-DOS / Windows 9x — và trên USB, thẻ SD thì đến nay vẫn ở khắp nơi.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/697decbc3f78b3401850ba37415b5080fbbcd566.svg" alt="Hình 4-12: bảng FAT và hai chuỗi" loading="lazy" /><p class="chu-thich">🧮 Hình 4-12: bảng FAT và hai chuỗi</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const FAT = Array(16).fill(null);                     // null = khối chưa dùng
Object.assign(FAT, { 4: 7, 7: 2, 2: 10, 10: 12, 12: -1, 6: 3, 3: 11, 11: 14, 14: -1 });
const DAU = { A: 4, B: 6 };                           // khối đầu, ghi trong mục thư mục
function chuoi(dau) {                                 // lần FAT[k] tới -1 — trong RAM, không đọc đĩa
  const ds = [];
  for (let k = dau; k !== -1; k = FAT[k]) ds.push(k);
  return ds;
}
// cỡ bảng cho đĩa lớn (mục 4.3.2): mỗi khối một mục
const coFat = (diskBytes, blockBytes, entryBytes) =&gt; (diskBytes / blockBytes) * entryBytes;</code></pre></details>
<p>Cái giá: <strong>cả bảng phải nằm trong bộ nhớ</strong> suốt thời gian, mỗi khối một mục, dù tệp có đang mở hay không. Với đĩa lớn thì khổng lồ:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/316b9aa68b17e07ae3c277f81a0a0ed66c36a61e.svg" alt="RAM cần cho FAT của đĩa 1 TB, khối 1 KB" loading="lazy" /><p class="chu-thich">🧮 RAM cần cho FAT của đĩa 1 TB, khối 1 KB</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const FAT = Array(16).fill(null);                     // null = khối chưa dùng
Object.assign(FAT, { 4: 7, 7: 2, 2: 10, 10: 12, 12: -1, 6: 3, 3: 11, 11: 14, 14: -1 });
const DAU = { A: 4, B: 6 };                           // khối đầu, ghi trong mục thư mục
function chuoi(dau) {                                 // lần FAT[k] tới -1 — trong RAM, không đọc đĩa
  const ds = [];
  for (let k = dau; k !== -1; k = FAT[k]) ds.push(k);
  return ds;
}
// cỡ bảng cho đĩa lớn (mục 4.3.2): mỗi khối một mục
const coFat = (diskBytes, blockBytes, entryBytes) =&gt; (diskBytes / blockBytes) * entryBytes;</code></pre></details>
<p>➕ Một ảnh FAT-16 thật, cố ý tạo khoảng hở (ghi A, ghi B, xoá A, gắn lại, ghi C), rồi đọc <em>bằng tay</em> — boot sector, FAT, thư mục gốc, các chuỗi — bằng một chương trình C nhỏ chỉ biết định dạng trên đĩa:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 4-12 trên một "USB" FAT-16 thật (ảnh 8 MB, 1 cluster = 1 sector = 512 byte)<br>
$ truncate -s 8M usb.img<br>
$ mkfs.vfat -F 16 -s 1 -i 12345678 -n DEMO usb.img &gt; /dev/null<br>
$ mkdir -p /mnt/usb &amp;&amp; mount -o loop usb.img /mnt/usb<br>
# ghi A (2 cluster) và B (2 cluster), xoá A, rồi ghi C (5 cluster)<br>
$ head -c 1000 /dev/zero | tr '\\0' 'A' &gt; /mnt/usb/A.TXT<br>
$ head -c 1000 /dev/zero | tr '\\0' 'B' &gt; /mnt/usb/B.TXT<br>
$ ls -l /mnt/usb<br>
total 2<br>
-rwxr-xr-x 1 root root 1000 Oct 26 01:16 A.TXT<br>
-rwxr-xr-x 1 root root 1000 Oct 26 01:16 B.TXT<br>
$ rm /mnt/usb/A.TXT<br>
# gỡ rồi gắn lại: driver tìm cluster trống lại từ đầu<br>
$ umount /mnt/usb &amp;&amp; mount -o loop usb.img /mnt/usb<br>
$ head -c 2500 /dev/zero | tr '\\0' 'C' &gt; /mnt/usb/C.TXT<br>
$ ls -l /mnt/usb<br>
total 4<br>
-rwxr-xr-x 1 root root 1000 Oct 26 01:16 B.TXT<br>
-rwxr-xr-x 1 root root 2500 Oct 26 01:16 C.TXT<br>
$ umount /mnt/usb<br>
# giờ tự đọc ảnh thô — không driver hệ thống tệp, chỉ có byte<br>
$ gcc -Wall -o doc-fat _doc-fat.c<br>
$ ./doc-fat usb.img<br>
bytes/sector 512, sectors/cluster 1, 2 FATs of 64 sectors<br>
FAT at byte 512, root directory at byte 66048, cluster 2 at byte 82432<br>
<br>
C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.TXT &nbsp;size &nbsp;2500 &nbsp;first cluster 3 &nbsp;chain: 3 4 7 8 9 -&gt; EOF<br>
B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.TXT &nbsp;size &nbsp;1000 &nbsp;first cluster 5 &nbsp;chain: 5 6 -&gt; EOF<br>
# chính bảng FAT: mục 0..12, mỗi mục 2 byte (0xffff = hết chuỗi)<br>
$ od -A d -t x2 -j 512 -N 26 usb.img<br>
0000512 fff8 ffff 0000 0004 0007 0006 ffff 0008<br>
0000528 0009 ffff 0000 0000 0000<br>
0000538</div>
<p>C.TXT (2500 byte = 5 cluster 512 byte) bắt đầu ở cluster 3 và nhảy qua B: 3 → 4 → 7 → 8 → 9, đúng một chuỗi kiểu Hình 4-12. Trong FAT thô, mục 3 chứa <code>0004</code>, mục 4 chứa <code>0007</code>, mục 9 chứa <code>ffff</code> (hết); B là 5 → 6. (Cluster 2 vẫn trống: driver Linux tình cờ bắt đầu tìm từ sau nó.)</p>
<p class="pitfall">⚠️ FE: "Bảng trong bộ nhớ chính lưu danh sách liên kết cấp phát khối đĩa gọi là" — <strong>File Allocation Table</strong> (FE18 câu 31, FE26 câu 27). "MS-DOS cài đặt bằng" — <strong>cấp phát liên kết dùng FAT</strong> (FE17 câu 18, FE22 câu 15).</p>`],
      [21, 'Implementing Files   I-nodes',
        `<p class="y-chinh">🎯 Figure 4-13: an example <strong>i-node</strong> (index-node) — a small record holding the file's attributes and the addresses of its first disk blocks (block 0 … block 7 in the figure), plus the address of a <strong>block of pointers</strong> holding more disk addresses for larger files.</p>
<p>Each file has its own i-node, and it only needs to be in memory while the file is <strong>open</strong>. That is the big advantage over FAT: memory grows with the number of open files (k open files × n bytes), not with the size of the disk. Small files need nothing but the i-node; a bigger file uses the last address for a <strong>single indirect block</strong>, and real systems add double and triple indirect blocks (slide 44). This is <strong>indexed allocation</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fec098d7708d3b1ae0035fd33eb6fe42f77a263a.svg" alt="An i-node with 10 direct addresses and one single indirect block: maximum file size, computed" loading="lazy" /><p class="chu-thich">🧮 An i-node with 10 direct addresses and one single indirect block: maximum file size, computed</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // block numbers per indirect block
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [level, blocks reachable]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>The FE calculation: with 1 KB blocks and 4-byte block numbers, an indirect block holds 1024 / 4 = 256 numbers, so 10 direct + 256 indirect = 266 blocks = <strong>266 KB</strong> (FE21 question 16). ➕ Now on a real ext2 file system (12 direct pointers, 1 KB blocks), with no mounting — <code>debugfs</code> reads the image directly:</p>
<div class="out"># Figure 4-13 on a real ext2 file system (1 KB blocks, 12 direct pointers + indirect blocks) — no mount needed: debugfs reads the image<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ echo "hello" &gt; small.txt<br>
$ head -c 300000 /dev/zero | tr '\\0' 'x' &gt; big.txt<br>
$ debugfs -w -R "write small.txt small.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
$ debugfs -w -R "write big.txt big.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 13<br>
# small file: one data block, listed directly in the i-node<br>
$ debugfs -R "stat small.txt" fs.img 2&gt;/dev/null | grep -E '^Inode|Size:|^\\(|^BLOCKS|TOTAL' | grep -v Fragment<br>
Inode: 12 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x0<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 6<br>
BLOCKS:<br>
(0):290<br>
TOTAL: 1<br>
# 300,000 bytes = 293 blocks: 12 direct, then a single-indirect block (IND), then a double-indirect one (DIND)<br>
$ debugfs -R "stat big.txt" fs.img 2&gt;/dev/null | grep -E '^Inode|Size:|^\\(|TOTAL' | grep -v Fragment<br>
Inode: 13 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x0<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 300000<br>
(0-11):291-302, (IND):303, (12-267):304-559, (DIND):560, (IND):561, (268-292):562-586<br>
TOTAL: 296<br>
# the single-indirect block is just an array of 4-byte block numbers<br>
$ IND=$(debugfs -R "stat big.txt" fs.img 2&gt;/dev/null | grep -o '(IND):[0-9]*' | head -1 | cut -d: -f2)<br>
$ debugfs -R "bd $IND" fs.img 2&gt;/dev/null | head -3<br>
0000 &nbsp;3001 0000 3101 0000 3201 0000 3301 0000 &nbsp;0...1...2...3...<br>
0020 &nbsp;3401 0000 3501 0000 3601 0000 3701 0000 &nbsp;4...5...6...7...<br>
0040 &nbsp;3801 0000 3901 0000 3a01 0000 3b01 0000 &nbsp;8...9...:...;...</div>
<p>The 6-byte file has one data block listed in the i-node. The 300,000-byte file (293 blocks) uses 12 direct blocks (0–11), then an <strong>IND</strong> block covering logical blocks 12–267 (256 of them), then a <strong>DIND</strong> block for the rest: 293 data blocks + 3 pointer blocks = TOTAL 296. And the IND block itself is just an array of 4-byte block numbers — <code>3001 0000</code> is 0x130 = 304, the next is 305… exactly the data blocks listed.</p>
<p class="pitfall">⚠️ FE23 question 25: "Which allocation method do i-nodes use?" — <strong>indexed allocation</strong>. FE3 question 21: "Indexed allocation uses" — <strong>a table of pointers for each file</strong>. Count direct addresses carefully in calculation questions: the FE bank uses 10, ext2/ext4 use 12.</p>`,
        `<p class="y-chinh">🎯 Hình 4-13: một <strong>i-node</strong> (index-node — nút chỉ mục) mẫu — một bản ghi nhỏ giữ thuộc tính của tệp và địa chỉ các khối đĩa đầu tiên (block 0 … block 7 trên hình), cộng địa chỉ của một <strong>khối con trỏ</strong> chứa thêm địa chỉ đĩa cho tệp lớn.</p>
<p>Mỗi tệp có i-node riêng, và i-node chỉ cần nằm trong bộ nhớ khi tệp đang <strong>mở</strong>. Đó là ưu điểm lớn so với FAT: bộ nhớ tăng theo số tệp đang mở (k tệp mở × n byte), không theo cỡ đĩa. Tệp nhỏ chỉ cần mỗi i-node; tệp lớn hơn dùng địa chỉ cuối cho một <strong>khối gián tiếp đơn (single indirect)</strong>, và hệ thật thêm khối gián tiếp đôi và ba (slide 44). Đây là <strong>cấp phát chỉ mục (indexed allocation)</strong>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ca0037efe0218068e2030a91ee4f0942a833ed90.svg" alt="i-node có 10 địa chỉ trực tiếp và một khối gián tiếp đơn: cỡ tệp tối đa do máy tính" loading="lazy" /><p class="chu-thich">🧮 i-node có 10 địa chỉ trực tiếp và một khối gián tiếp đơn: cỡ tệp tối đa do máy tính</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // số hiệu khối trong một khối gián tiếp
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [mức, số khối với tới được]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>Phép tính kiểu FE: khối 1 KB, số hiệu khối 4 byte thì một khối gián tiếp chứa 1024 / 4 = 256 số hiệu, nên 10 trực tiếp + 256 gián tiếp = 266 khối = <strong>266 KB</strong> (FE21 câu 16). ➕ Giờ trên một hệ thống tệp ext2 thật (12 con trỏ trực tiếp, khối 1 KB), không cần mount — <code>debugfs</code> đọc thẳng ảnh đĩa:</p>
<div class="out"># Hình 4-13 trên một hệ thống tệp ext2 thật (khối 1 KB, 12 con trỏ trực tiếp + khối gián tiếp) — không cần mount: debugfs đọc thẳng ảnh đĩa<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ echo "hello" &gt; small.txt<br>
$ head -c 300000 /dev/zero | tr '\\0' 'x' &gt; big.txt<br>
$ debugfs -w -R "write small.txt small.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
$ debugfs -w -R "write big.txt big.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 13<br>
# tệp nhỏ: một khối dữ liệu, ghi thẳng trong i-node<br>
$ debugfs -R "stat small.txt" fs.img 2&gt;/dev/null | grep -E '^Inode|Size:|^\\(|^BLOCKS|TOTAL' | grep -v Fragment<br>
Inode: 12 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x0<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 6<br>
BLOCKS:<br>
(0):290<br>
TOTAL: 1<br>
# 300.000 byte = 293 khối: 12 trực tiếp, rồi một khối gián tiếp đơn (IND), rồi một khối gián tiếp đôi (DIND)<br>
$ debugfs -R "stat big.txt" fs.img 2&gt;/dev/null | grep -E '^Inode|Size:|^\\(|TOTAL' | grep -v Fragment<br>
Inode: 13 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x0<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 300000<br>
(0-11):291-302, (IND):303, (12-267):304-559, (DIND):560, (IND):561, (268-292):562-586<br>
TOTAL: 296<br>
# khối gián tiếp đơn chỉ là một mảng số hiệu khối 4 byte<br>
$ IND=$(debugfs -R "stat big.txt" fs.img 2&gt;/dev/null | grep -o '(IND):[0-9]*' | head -1 | cut -d: -f2)<br>
$ debugfs -R "bd $IND" fs.img 2&gt;/dev/null | head -3<br>
0000 &nbsp;3001 0000 3101 0000 3201 0000 3301 0000 &nbsp;0...1...2...3...<br>
0020 &nbsp;3401 0000 3501 0000 3601 0000 3701 0000 &nbsp;4...5...6...7...<br>
0040 &nbsp;3801 0000 3901 0000 3a01 0000 3b01 0000 &nbsp;8...9...:...;...</div>
<p>Tệp 6 byte có một khối dữ liệu ghi ngay trong i-node. Tệp 300.000 byte (293 khối) dùng 12 khối trực tiếp (0–11), rồi một khối <strong>IND</strong> phủ khối logic 12–267 (256 khối), rồi một khối <strong>DIND</strong> cho phần còn lại: 293 khối dữ liệu + 3 khối con trỏ = TOTAL 296. Và chính khối IND chỉ là một mảng số hiệu khối 4 byte — <code>3001 0000</code> là 0x130 = 304, số kế là 305… đúng các khối dữ liệu đã liệt kê.</p>
<p class="pitfall">⚠️ FE23 câu 25: "i-node dùng cách cấp phát nào?" — <strong>cấp phát chỉ mục (indexed)</strong>. FE3 câu 21: "Cấp phát chỉ mục dùng" — <strong>một bảng con trỏ cho mỗi tệp</strong>. Đếm kỹ số địa chỉ trực tiếp trong câu tính toán: ngân hàng FE dùng 10, ext2/ext4 dùng 12.</p>`],
      [22, 'Implementing Directories (1)',
        `<p class="y-chinh">🎯 Figure 4-14: two ways to store a directory — (a) a simple directory with <strong>fixed-size entries</strong> holding the name, the disk addresses and the attributes (games, mail, news, work — each with its attributes); (b) a directory in which each entry holds just the name and a <strong>reference to an i-node</strong>, where the attributes live.</p>
<p>Opening a file means turning a path into the information needed to find its data. The directory entry provides it: in (a) — the MS-DOS/Windows FAT way (slide 41) — the attributes and the first block are right in the entry; in (b) — the UNIX way (slide 43) — the entry is only (name, i-number) and everything else is in the i-node. Design (b) makes entries small and fixed, and it is what makes <strong>hard links</strong> possible (slide 24): two entries can point at one i-node only if the attributes are not stored in the entries.</p>
<p>➕ Design (b) on ext2: <code>debugfs ls</code> prints each entry as "i-number (entry length) name", and the attributes of <code>mail</code> come from its i-node:</p>
<div class="out"># Figure 4-14(b) + 4-15(a) on ext2: a directory entry = (i-number, length of entry, name) — attributes are in the i-node<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ for f in games a-rather-long-file-name-for-a-lab-report.txt mail news work; do echo "$f" &gt; $f; debugfs -w -R "write $f $f" fs.img 2&gt;/dev/null &gt;/dev/null; done<br>
# "ls" of debugfs prints: i-number (entry length) name. Entry length = 8 bytes of header + the name, rounded up to 4; the LAST entry absorbs the rest of the 1024-byte block<br>
$ debugfs -R "ls /" fs.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(16) games<br>
&nbsp;13 &nbsp;(52) a-rather-long-file-name-for-a-lab-report.txt &nbsp;&nbsp;&nbsp;14 &nbsp;(12) mail<br>
&nbsp;15 &nbsp;(12) news &nbsp;&nbsp;&nbsp;16 &nbsp;(888) work<br>
# the attributes of "mail" come from its i-node (14), not from the directory<br>
$ debugfs -R "stat &lt;14&gt;" fs.img 2&gt;/dev/null | grep -E '^Inode|^User|Size:|^Links' | grep -v Fragment<br>
Inode: 14 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x0<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 5<br>
Links: 1 &nbsp;&nbsp;Blockcount: 2</div>
<p>The directory gives <code>mail</code> → i-node 14; i-node 14 holds the type, mode 0644, owner, size 5 and link count — nothing of that is in the directory. (The entry lengths of the other names are the subject of slide 23.)</p>
<p class="pitfall">⚠️ FE19 question 46 and many others: "A directory in UNIX/Linux consists of" — <strong>i-node number and file name</strong>; the options with size, location and dates describe design (a), not UNIX. FE18 question 15: "special files with listings of filenames and their attributes" — <strong>directories</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 4-14: hai cách lưu một thư mục — (a) thư mục đơn giản gồm các <strong>mục cỡ cố định</strong> chứa tên, địa chỉ đĩa và thuộc tính (games, mail, news, work — mỗi cái kèm thuộc tính); (b) thư mục mà mỗi mục chỉ giữ tên và một <strong>tham chiếu tới i-node</strong>, nơi chứa thuộc tính.</p>
<p>Mở một tệp nghĩa là biến đường dẫn thành thông tin cần để tìm dữ liệu của nó. Mục thư mục cung cấp thông tin đó: ở (a) — cách của MS-DOS/Windows FAT (slide 41) — thuộc tính và khối đầu nằm ngay trong mục; ở (b) — cách của UNIX (slide 43) — mục chỉ là (tên, số i-node), mọi thứ khác nằm trong i-node. Thiết kế (b) làm mục nhỏ và cố định, và chính nó làm được <strong>liên kết cứng</strong> (slide 24): hai mục chỉ cùng trỏ được vào một i-node khi thuộc tính không nằm trong mục.</p>
<p>➕ Thiết kế (b) trên ext2: <code>debugfs ls</code> in mỗi mục dạng "số i-node (độ dài mục) tên", và thuộc tính của <code>mail</code> lấy từ i-node của nó:</p>
<div class="out"># Hình 4-14(b) + 4-15(a) trên ext2: một mục thư mục = (số i-node, độ dài mục, tên) — thuộc tính nằm trong i-node<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ for f in games a-rather-long-file-name-for-a-lab-report.txt mail news work; do echo "$f" &gt; $f; debugfs -w -R "write $f $f" fs.img 2&gt;/dev/null &gt;/dev/null; done<br>
# lệnh "ls" của debugfs in: số i-node (độ dài mục) tên. Độ dài mục = 8 byte đầu mục + tên, làm tròn lên bội của 4; mục CUỐI ôm phần còn lại của khối 1024 byte<br>
$ debugfs -R "ls /" fs.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(16) games<br>
&nbsp;13 &nbsp;(52) a-rather-long-file-name-for-a-lab-report.txt &nbsp;&nbsp;&nbsp;14 &nbsp;(12) mail<br>
&nbsp;15 &nbsp;(12) news &nbsp;&nbsp;&nbsp;16 &nbsp;(888) work<br>
# thuộc tính của "mail" lấy từ i-node của nó (14), không phải từ thư mục<br>
$ debugfs -R "stat &lt;14&gt;" fs.img 2&gt;/dev/null | grep -E '^Inode|^User|Size:|^Links' | grep -v Fragment<br>
Inode: 14 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x0<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 5<br>
Links: 1 &nbsp;&nbsp;Blockcount: 2</div>
<p>Thư mục cho <code>mail</code> → i-node 14; i-node 14 giữ kiểu tệp, mode 0644, chủ sở hữu, cỡ 5 và số liên kết — thư mục không có thứ nào trong số đó. (Độ dài mục của các tên khác là chuyện của slide 23.)</p>
<p class="pitfall">⚠️ FE19 câu 46 và nhiều đề khác: "Một thư mục trong UNIX/Linux gồm" — <strong>số i-node và tên tệp</strong>; các phương án có cỡ, vị trí, ngày tháng là tả thiết kế (a), không phải UNIX. FE18 câu 15: "tệp đặc biệt liệt kê tên tệp và thuộc tính của chúng" — <strong>thư mục</strong>.</p>`],
      [23, 'Implementing Directories (2)',
        `<p class="y-chinh">🎯 Figure 4-15: two ways of handling <strong>long file names</strong> in a directory — (a) <strong>in-line</strong>: each entry has a fixed header (entry length, attributes) followed by the name, padded to a word boundary (☒ = end-of-name marker); (b) <strong>in a heap</strong>: fixed-size entries hold a pointer to the name, and all names sit together in a heap at the end of the directory. (The slide's caption says "Tw o ways" — a typo.)</p>
<p>Long names (up to 255 characters) break fixed-size entries: reserving 255 bytes per entry wastes space. (a) saves space, but deleting an entry leaves a variable-size gap — the same fragmentation problem as contiguous files — and an entry may cross a page boundary. (b) keeps entries fixed and easy to manage, at the cost of managing the heap. For directories with thousands of entries, linear search is slow, so the book adds <strong>hash tables</strong> in each directory, or caching the results of searches.</p>
<p>➕ ext2/ext4 use design (a) — look at the entry lengths in the session of slide 22: <code>games</code> (12 bytes: 8-byte header + 5-letter name rounded up to 4) vs <code>a-rather-long-file-name-for-a-lab-report.txt</code> (52 bytes = 8 + 44). The last entry (<code>work</code>, 888) absorbs the rest of the 1024-byte block, so a new name can be added in the free space; a deleted entry is merged into the previous one by increasing its length. And for big directories ext4 builds exactly the book's hash idea: the <code>dir_index</code> feature (an "htree", a hash-keyed B-tree) appears in the feature list of the session at slide 26.</p>
<p class="meo">🧠 Linux also keeps a <strong>dentry cache</strong> in RAM: recently looked-up names map straight to i-nodes, so <code>/usr/lib/...</code> is not searched on disk every time — the "caching the results of searches" of the book.</p>`,
        `<p class="y-chinh">🎯 Hình 4-15: hai cách xử lý <strong>tên tệp dài</strong> trong thư mục — (a) <strong>nằm ngay trong mục (in-line)</strong>: mỗi mục có phần đầu cố định (độ dài mục, thuộc tính) rồi tới tên, đệm cho tròn một từ máy (☒ = dấu hết tên); (b) <strong>trong một heap</strong>: các mục cỡ cố định giữ con trỏ tới tên, còn mọi tên nằm chung trong một heap ở cuối thư mục. (Chú thích slide ghi "Tw o ways" — lỗi chữ.)</p>
<p>Tên dài (tới 255 ký tự) phá hỏng mục cỡ cố định: dành 255 byte cho mỗi mục thì phí chỗ. (a) tiết kiệm chỗ, nhưng xoá một mục để lại lỗ cỡ thay đổi — đúng vấn đề phân mảnh của tệp liên tục — và một mục có thể vắt qua ranh giới trang. (b) giữ mục cỡ cố định, dễ quản lý, đổi lại phải quản lý heap. Với thư mục hàng nghìn mục, tìm tuần tự rất chậm, nên sách thêm <strong>bảng băm (hash table)</strong> trong mỗi thư mục, hoặc lưu đệm kết quả tìm kiếm.</p>
<p>➕ ext2/ext4 dùng thiết kế (a) — xem độ dài mục trong phiên ở slide 22: <code>games</code> (12 byte: 8 byte đầu mục + tên 5 chữ làm tròn lên bội của 4) so với <code>a-rather-long-file-name-for-a-lab-report.txt</code> (52 byte = 8 + 44). Mục cuối (<code>work</code>, 888) ôm phần còn lại của khối 1024 byte, nên tên mới được thêm vào phần trống đó; mục bị xoá được gộp vào mục đứng trước bằng cách tăng độ dài của mục đó. Và với thư mục lớn, ext4 dựng đúng ý tưởng băm của sách: tính năng <code>dir_index</code> (một "htree" — cây B có khoá là giá trị băm) có trong danh sách tính năng ở phiên của slide 26.</p>
<p class="meo">🧠 Linux còn giữ một <strong>dentry cache</strong> trong RAM: tên vừa tra được ánh xạ thẳng tới i-node, nên <code>/usr/lib/...</code> không phải lục trên đĩa mỗi lần — chính là "lưu đệm kết quả tìm kiếm" của sách.</p>`],
      [24, 'Shared Files (1)',
        `<p class="y-chinh">🎯 Figure 4-16: a file system containing a <strong>shared file</strong> — one file (marked "?") appears both in a directory of user B and in a directory of user C. The structure is no longer a tree but a <strong>directed acyclic graph (DAG)</strong>.</p>
<p>When people work together, one file should appear in several directories — and a change through one name must be seen through the other. Copying would make two diverging files. Two real solutions: (1) a <strong>hard link</strong> — the directory entries simply point to the same i-node (possible because of design (b), slide 22); the i-node keeps a <strong>link count</strong>. (2) a <strong>symbolic link</strong> — a new small file of type LINK whose content is the path name of the target; the OS follows the path when the link is opened.</p>
<p>➕ Both kinds, and every property the FE asks about, tested for real:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 24: two ways to share a file — hard link (same i-node) vs symbolic link (a small file holding a path)<br>
$ echo "shared data" &gt; original.txt<br>
$ ln original.txt hard.txt<br>
$ ln -s original.txt soft.txt<br>
$ stat -c "%i %A %h links &nbsp;%N" original.txt hard.txt soft.txt<br>
361385 -rw-r--r-- 2 links &nbsp;'original.txt'<br>
361385 -rw-r--r-- 2 links &nbsp;'hard.txt'<br>
361387 lrwxrwxrwx 1 links &nbsp;'soft.txt' -&gt; 'original.txt'<br>
# the symbolic link is a separate file; its "content" (12 bytes) is the path<br>
$ stat -c '%n: %s bytes, %h links, i-node %i' soft.txt original.txt<br>
soft.txt: 12 bytes, 1 links, i-node 361387<br>
original.txt: 12 bytes, 2 links, i-node 361385<br>
$ readlink soft.txt<br>
original.txt<br>
# remove the original name<br>
$ rm original.txt<br>
$ cat hard.txt<br>
shared data<br>
$ cat soft.txt<br>
cat: soft.txt: No such file or directory<br>
$ stat -c "%A %N" soft.txt<br>
lrwxrwxrwx 'soft.txt' -&gt; 'original.txt'<br>
# hard links cannot cross file systems (/dev/shm is another file system: tmpfs), symbolic links can<br>
$ ln hard.txt /dev/shm/h.txt<br>
ln: failed to create hard link '/dev/shm/h.txt' =&gt; 'hard.txt': Invalid cross-device link<br>
$ ln -s ~/hard.txt /dev/shm/s.txt &amp;&amp; cat /dev/shm/s.txt<br>
shared data<br>
# no hard links to directories (they would create cycles); a symbolic link to a directory is fine<br>
$ mkdir docs<br>
$ ln docs docs2<br>
ln: docs: hard link not allowed for directory<br>
$ ln -s docs docs3 &amp;&amp; stat -c "%A %N" docs3<br>
lrwxrwxrwx 'docs3' -&gt; 'docs'</div>
<p>The hard link shares i-number and data, and the count goes to 2. The symbolic link is a separate i-node whose 12 bytes of "content" are the path <code>original.txt</code>. After <code>rm original.txt</code> the hard link still works (count back to 1, data intact) but the symbolic link <strong>dangles</strong>. A hard link cannot cross into another file system (<code>Invalid cross-device link</code> — i-numbers are only meaningful inside one file system) and cannot point to a directory; a symbolic link can do both.</p>
<p class="pitfall">⚠️ FE1 question 4 describes "a new file, of type LINK, containing just the path name" — that is <strong>symbolic linking</strong>. "NOT correct about hard links?" — "they can point to files in the network / on other machines" (FE19 question 36, FE28 question 32). Symbolic links <em>can</em> point to files on other machines (the book: by giving a network address with the path) and do need space for the path (FE23 question 29). Which techniques let a file appear in more than one directory? — <strong>both</strong> (FE20 question 9; FE22 question 25's key "Hard link" only is incomplete — see the chapter quiz).</p>`,
        `<p class="y-chinh">🎯 Hình 4-16: một hệ thống tệp có <strong>tệp dùng chung (shared file)</strong> — một tệp (đánh dấu "?") vừa nằm trong một thư mục của người dùng B vừa nằm trong một thư mục của người dùng C. Cấu trúc không còn là cây mà là <strong>đồ thị có hướng không chu trình (DAG)</strong>.</p>
<p>Khi làm việc nhóm, một tệp nên xuất hiện ở nhiều thư mục — và sửa qua tên này thì tên kia phải thấy. Chép ra hai bản thì hai tệp sẽ lệch nhau. Có hai giải pháp thật: (1) <strong>liên kết cứng (hard link)</strong> — các mục thư mục đơn giản là cùng trỏ vào một i-node (làm được nhờ thiết kế (b), slide 22); i-node giữ một <strong>số đếm liên kết (link count)</strong>. (2) <strong>liên kết mềm (symbolic link)</strong> — một tệp nhỏ mới kiểu LINK mà nội dung là đường dẫn tới tệp đích; HĐH lần theo đường dẫn khi mở liên kết.</p>
<p>➕ Cả hai loại, và mọi tính chất FE hay hỏi, thử thật:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 24: hai cách chia sẻ một tệp — liên kết cứng (cùng i-node) và liên kết mềm (một tệp nhỏ chứa đường dẫn)<br>
$ echo "shared data" &gt; original.txt<br>
$ ln original.txt hard.txt<br>
$ ln -s original.txt soft.txt<br>
$ stat -c "%i %A %h links &nbsp;%N" original.txt hard.txt soft.txt<br>
361385 -rw-r--r-- 2 links &nbsp;'original.txt'<br>
361385 -rw-r--r-- 2 links &nbsp;'hard.txt'<br>
361387 lrwxrwxrwx 1 links &nbsp;'soft.txt' -&gt; 'original.txt'<br>
# liên kết mềm là một tệp riêng; "nội dung" (12 byte) của nó chính là đường dẫn<br>
$ stat -c '%n: %s bytes, %h links, i-node %i' soft.txt original.txt<br>
soft.txt: 12 bytes, 1 links, i-node 361387<br>
original.txt: 12 bytes, 2 links, i-node 361385<br>
$ readlink soft.txt<br>
original.txt<br>
# xoá cái tên gốc<br>
$ rm original.txt<br>
$ cat hard.txt<br>
shared data<br>
$ cat soft.txt<br>
cat: soft.txt: No such file or directory<br>
$ stat -c "%A %N" soft.txt<br>
lrwxrwxrwx 'soft.txt' -&gt; 'original.txt'<br>
# liên kết cứng không vượt được hệ thống tệp (/dev/shm là hệ thống tệp khác: tmpfs), liên kết mềm thì được<br>
$ ln hard.txt /dev/shm/h.txt<br>
ln: failed to create hard link '/dev/shm/h.txt' =&gt; 'hard.txt': Invalid cross-device link<br>
$ ln -s ~/hard.txt /dev/shm/s.txt &amp;&amp; cat /dev/shm/s.txt<br>
shared data<br>
# không có liên kết cứng tới thư mục (sẽ tạo chu trình); liên kết mềm tới thư mục thì được<br>
$ mkdir docs<br>
$ ln docs docs2<br>
ln: docs: hard link not allowed for directory<br>
$ ln -s docs docs3 &amp;&amp; stat -c "%A %N" docs3<br>
lrwxrwxrwx 'docs3' -&gt; 'docs'</div>
<p>Liên kết cứng dùng chung số i-node và dữ liệu, số đếm lên 2. Liên kết mềm là một i-node riêng mà 12 byte "nội dung" là đường dẫn <code>original.txt</code>. Sau <code>rm original.txt</code>, liên kết cứng vẫn chạy (số đếm về 1, dữ liệu nguyên vẹn) còn liên kết mềm thành <strong>trỏ vào hư không (dangling)</strong>. Liên kết cứng không vượt sang hệ thống tệp khác được (<code>Invalid cross-device link</code> — số i-node chỉ có nghĩa trong một hệ thống tệp) và không trỏ tới thư mục được; liên kết mềm làm được cả hai.</p>
<p class="pitfall">⚠️ FE1 câu 4 tả "một tệp mới kiểu LINK chỉ chứa đường dẫn" — đó là <strong>liên kết mềm (symbolic)</strong>. "Điều nào SAI về liên kết cứng?" — "trỏ được tới tệp trên mạng / trên máy khác" (FE19 câu 36, FE28 câu 32). Liên kết mềm <em>trỏ được</em> tới tệp trên máy khác (sách: ghi thêm địa chỉ mạng vào đường dẫn) và cần chỗ để lưu đường dẫn (FE23 câu 29). Kỹ thuật nào cho tệp xuất hiện ở nhiều thư mục? — <strong>cả hai</strong> (FE20 câu 9; đáp án "chỉ Hard link" của FE22 câu 25 là thiếu — xem quiz chương).</p>`],
      [25, 'Shared Files (2)',
        `<p class="y-chinh">🎯 Figure 4-17: the problem with hard links — (a) before linking: C's directory points to an i-node with Owner = C, Count = 1; (b) after B links to it: two directories, the same i-node, Count = 2; (c) after the original owner C removes the file: only B's entry remains, but the i-node still says Owner = C, Count = 1.</p>
<p>Removing a name only decrements the count; the i-node and the data stay until the count reaches 0. So after (c) the file belongs to C (and is charged to C's <strong>disk quota</strong>, slide 33) although C no longer has any way to reach it, and B keeps it alive. Symbolic links avoid this — only the true owner has a pointer to the i-node, and removing the file just leaves B's link dangling — but they cost an extra i-node, extra disk reads to follow the path, and they break if the file is moved. Another danger the book mentions: a backup program may copy a linked file twice, once per name.</p>
<p>➕ Figure 4-17 with real users <code>c</code> and <code>b</code> — and a twist the book could not show:</p>
<div class="out"># Figure 4-17 with real users c and b<br>
$ useradd -m c; useradd -m b<br>
$ mkdir /shared &amp;&amp; chmod 1777 /shared<br>
# (a) C creates the file: owner c, link count 1<br>
$ runuser -u c -- sh -c 'echo "C wrote this" &gt; /shared/report.txt'<br>
$ stat -c '%n: owner %U, %h link(s)' /shared/report.txt<br>
/shared/report.txt: owner c, 1 link(s)<br>
# (b) B tries to link it into his own directory — refused by a modern kernel rule (protected_hardlinks)<br>
$ runuser -u b -- ln /shared/report.txt /home/b/report.txt<br>
ln: failed to create hard link '/home/b/report.txt' =&gt; '/shared/report.txt': Operation not permitted<br>
$ cat /proc/sys/fs/protected_hardlinks<br>
1<br>
# the book's situation needs a link B is allowed to make: here the administrator makes it<br>
$ ln /shared/report.txt /home/b/report.txt<br>
$ stat -c '%n: owner %U, %h link(s)' /shared/report.txt /home/b/report.txt<br>
/shared/report.txt: owner c, 2 link(s)<br>
/home/b/report.txt: owner c, 2 link(s)<br>
# (c) C removes "her" file — only her name goes away<br>
$ runuser -u c -- rm /shared/report.txt<br>
$ stat -c '%n: owner %U, %h link(s)' /home/b/report.txt<br>
/home/b/report.txt: owner c, 1 link(s)<br>
$ cat /home/b/report.txt<br>
C wrote this</div>
<p>When <code>b</code> himself tries to link C's file, a modern Linux kernel <strong>refuses</strong>: <code>Operation not permitted</code>. The setting <code>fs.protected_hardlinks = 1</code> (added in Linux 3.6, 2012; enabled by Debian and Ubuntu) allows a hard link only if you own the file or can read and write it — introduced exactly because of tricks like this one (a user pinning someone else's file, or racing a privileged program in <code>/tmp</code>). The administrator can still make the link, and then (b) and (c) happen exactly as in the book: after C removes her name, B's link shows owner c, 1 link, and the data survives.</p>
<p class="pitfall">⚠️ FE19 question 36's options: hard links "do not require extra disk space" (true — only a directory entry) and "require increasing the link count in the i-node" (true). Old lesson 4.2 tells the production version of this story: deleting a log file a process still holds frees nothing.</p>`,
        `<p class="y-chinh">🎯 Hình 4-17: rắc rối của liên kết cứng — (a) trước khi liên kết: thư mục của C trỏ tới một i-node có Owner = C, Count = 1; (b) sau khi B liên kết tới nó: hai thư mục, cùng một i-node, Count = 2; (c) sau khi chủ gốc C xoá tệp: chỉ còn mục của B, nhưng i-node vẫn ghi Owner = C, Count = 1.</p>
<p>Xoá một cái tên chỉ làm giảm số đếm; i-node và dữ liệu còn nguyên cho tới khi số đếm về 0. Nên sau (c) tệp vẫn thuộc về C (và bị tính vào <strong>hạn ngạch đĩa — quota</strong> của C, slide 33) dù C không còn đường nào tới nó, còn B thì giữ nó sống. Liên kết mềm tránh được chuyện này — chỉ chủ thật có con trỏ tới i-node, xoá tệp chỉ khiến liên kết của B trỏ vào hư không — nhưng tốn thêm một i-node, thêm lần đọc đĩa để lần đường dẫn, và gãy khi tệp bị dời đi. Một nguy cơ khác sách nhắc: chương trình sao lưu có thể chép một tệp có liên kết hai lần, mỗi tên một lần.</p>
<p>➕ Hình 4-17 với hai người dùng thật <code>c</code> và <code>b</code> — kèm một chi tiết sách không thể cho thấy:</p>
<div class="out"># Hình 4-17 với hai người dùng thật c và b<br>
$ useradd -m c; useradd -m b<br>
$ mkdir /shared &amp;&amp; chmod 1777 /shared<br>
# (a) C tạo tệp: chủ là c, số liên kết 1<br>
$ runuser -u c -- sh -c 'echo "C wrote this" &gt; /shared/report.txt'<br>
$ stat -c '%n: owner %U, %h link(s)' /shared/report.txt<br>
/shared/report.txt: owner c, 1 link(s)<br>
# (b) B thử liên kết nó vào thư mục của mình — bị một luật của nhân hiện đại từ chối (protected_hardlinks)<br>
$ runuser -u b -- ln /shared/report.txt /home/b/report.txt<br>
ln: failed to create hard link '/home/b/report.txt' =&gt; '/shared/report.txt': Operation not permitted<br>
$ cat /proc/sys/fs/protected_hardlinks<br>
1<br>
# tình huống của sách cần một liên kết B được phép tạo: ở đây quản trị viên tạo hộ<br>
$ ln /shared/report.txt /home/b/report.txt<br>
$ stat -c '%n: owner %U, %h link(s)' /shared/report.txt /home/b/report.txt<br>
/shared/report.txt: owner c, 2 link(s)<br>
/home/b/report.txt: owner c, 2 link(s)<br>
# (c) C xoá tệp "của mình" — chỉ cái tên của C biến mất<br>
$ runuser -u c -- rm /shared/report.txt<br>
$ stat -c '%n: owner %U, %h link(s)' /home/b/report.txt<br>
/home/b/report.txt: owner c, 1 link(s)<br>
$ cat /home/b/report.txt<br>
C wrote this</div>
<p>Khi chính <code>b</code> thử liên kết tệp của C, nhân Linux hiện đại <strong>từ chối</strong>: <code>Operation not permitted</code>. Thiết lập <code>fs.protected_hardlinks = 1</code> (có từ Linux 3.6, năm 2012; Debian và Ubuntu bật sẵn) chỉ cho tạo liên kết cứng khi bạn sở hữu tệp hoặc đọc-ghi được nó — được thêm vào đúng vì những mánh như thế này (người dùng "ghim" tệp của người khác, hoặc chạy đua với chương trình đặc quyền trong <code>/tmp</code>). Quản trị viên vẫn tạo được liên kết, và rồi (b), (c) diễn ra y như sách: sau khi C xoá tên của mình, liên kết của B ghi chủ là c, 1 liên kết, dữ liệu vẫn còn.</p>
<p class="pitfall">⚠️ Các phương án của FE19 câu 36: liên kết cứng "không tốn thêm chỗ đĩa" (đúng — chỉ một mục thư mục) và "phải tăng số đếm liên kết trong i-node" (đúng). Bài cũ 4.2 kể phiên bản thực tế của câu chuyện này: xoá một tệp log mà tiến trình vẫn đang giữ thì chẳng giải phóng được gì.</p>`],
      [26, 'Journaling File Systems',
        `<p class="y-chinh">🎯 Removing a file in UNIX takes three steps: (1) remove the file from its directory; (2) release the i-node to the pool of free i-nodes; (3) return all its disk blocks to the pool of free disk blocks. A <strong>journaling file system</strong> first writes these steps to a log, and only then performs them.</p>
<p>If the system crashes between the steps, the disk is inconsistent: after step 1 alone, the i-node and blocks are lost to everyone; if the order were changed and the crash came after step 2, the directory would point to a free i-node that may be reused for another file. The journal fixes this: write a log entry listing the actions and <strong>commit</strong> it to disk; then do the actions; then erase the log entry. After a crash, the recovery code reads the log and <strong>replays</strong> any committed entry that was not finished. For this to work the logged operations must be <strong>idempotent</strong> (doing them twice = doing them once: "mark i-node 13 free", not "add 1 to the free count"), and several steps can be grouped into one atomic transaction.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7eadb50185c47dbc5053ecc1a275b27e56effd2a.svg" alt="Removing a file with a journal: the plan is committed first, the steps follow" loading="lazy" /><p class="chu-thich">🧩 Removing a file with a journal: the plan is committed first, the steps follow</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Slide 26: removing a file with a journal — write the plan first, then do it
participant "File system" as FS
participant "Journal\\n(on disk)" as J
participant "Directory, i-nodes,\\nfree-block bitmap (on disk)" as M
FS -&gt; J : 1. log entry: "remove the name, free i-node 13,\\nfree blocks 290–292" + COMMIT
note right of J : the plan is now safe on disk
FS -&gt; M : 2. remove the directory entry
FS -&gt; M : 3. release the i-node
FS -&gt; M : 4. return the blocks to the free pool
FS -&gt; J : 5. mark the log entry done (checkpoint)
note over FS, M : crash before step 1 completes ⇒ nothing happened\\ncrash after the COMMIT ⇒ at reboot the log is REPLAYED (the steps are idempotent)
@enduml</code></pre></details>
<p>➕ A real "power cut": an ext4 image is mounted, a directory and a file are written and committed (<code>sync</code>), and the disk is copied <em>while still mounted</em> — as a crash would leave it. On that copy, e2fsck finds a journal to replay:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 26 for real: pull the plug on an ext4 disk and let the journal repair it<br>
$ mkfs.ext4 -q -b 4096 disk.img 64M<br>
Creating regular file disk.img<br>
$ dumpe2fs -h disk.img 2&gt;/dev/null | grep -E '^Filesystem features|^Total journal size'<br>
Filesystem features: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;has_journal ext_attr resize_inode dir_index filetype extent 64bit flex_bg sparse_super large_file huge_file dir_nlink extra_isize metadata_csum<br>
Total journal size: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096k<br>
$ mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
$ mkdir /mnt/d/reports &amp;&amp; echo "grades of 2026" &gt; /mnt/d/reports/grades.txt<br>
# sync = commit the transaction to the JOURNAL (the "log entry" of slide 26)<br>
$ sync<br>
# "power cut": copy the disk exactly as it is now, while it is still mounted<br>
$ cp disk.img crashed.img<br>
$ umount /mnt/d<br>
$ dumpe2fs -h crashed.img 2&gt;/dev/null | grep -o needs_recovery<br>
needs_recovery<br>
# the crashed copy: fsck finds a journal that still must be replayed<br>
$ e2fsck -fy crashed.img 2&gt;&amp;1 | grep -v '^e2fsck'<br>
crashed.img: recovering journal<br>
Pass 1: Checking inodes, blocks, and sizes<br>
Pass 2: Checking directory structure<br>
Pass 3: Checking directory connectivity<br>
Pass 4: Checking reference counts<br>
Pass 5: Checking group summary information<br>
Free blocks count wrong (14319, counted=14317).<br>
Fix? yes<br>
<br>
Free inodes count wrong (16373, counted=16371).<br>
Fix? yes<br>
<br>
<br>
crashed.img: ***** FILE SYSTEM WAS MODIFIED *****<br>
crashed.img: 13/16384 files (7.7% non-contiguous), 2067/16384 blocks<br>
$ debugfs -R "ls -l /reports" crashed.img 2&gt;/dev/null | awk '{print $1, $NF}'<br>
12 .<br>
2 ..<br>
13 grades.txt<br>
<br>
$ debugfs -R "cat /reports/grades.txt" crashed.img 2&gt;/dev/null<br>
grades of 2026</div>
<p>The superblock of the crashed copy carries the <code>needs_recovery</code> flag; e2fsck says <code>recovering journal</code>, replays the committed transaction and then only has to fix the summary counters. The file <code>reports/grades.txt</code> is there with its content — no hour-long scan of the whole disk. (The 4 MB journal is listed among the features: <code>has_journal</code>.)</p>
<p class="pitfall">⚠️ FE4 question 29: both statements are true — a log-structured FS appends <em>all</em> changes sequentially to a log; a journaling FS first writes a log entry listing the actions, and only after it is on disk do the operations begin. FE17 question 29 and FE25 question 50 ask the same sentence with opposite keys (log-structured vs journaling) — see the chapter quiz; the book's term for logging changes to make crashes safe is <strong>journaling</strong> (ext3/ext4, NTFS).</p>`,
        `<p class="y-chinh">🎯 Xoá một tệp trong UNIX gồm ba bước: (1) gỡ tệp khỏi thư mục; (2) trả i-node về kho i-node trống; (3) trả mọi khối đĩa của nó về kho khối trống. Một <strong>hệ thống tệp có nhật ký (journaling)</strong> ghi các bước này vào một nhật ký trước, rồi mới thực hiện.</p>
<p>Nếu máy sập giữa các bước, đĩa không nhất quán: chỉ xong bước 1 thì i-node và khối bị mất với mọi người; nếu đổi thứ tự và sập sau bước 2 thì thư mục trỏ tới một i-node đã trống, có thể bị dùng lại cho tệp khác. Nhật ký sửa được: ghi một mục nhật ký liệt kê các hành động và <strong>commit</strong> (chốt) nó xuống đĩa; rồi làm các hành động; rồi xoá mục nhật ký. Sau sự cố, mã phục hồi đọc nhật ký và <strong>phát lại (replay)</strong> mọi mục đã chốt mà chưa xong. Muốn vậy các thao tác ghi trong nhật ký phải <strong>lũy đẳng (idempotent)</strong> — làm hai lần = làm một lần: "đánh dấu i-node 13 trống", chứ không phải "cộng 1 vào số i-node trống" — và nhiều bước có thể gom thành một giao dịch nguyên tử.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7eadb50185c47dbc5053ecc1a275b27e56effd2a.svg" alt="Xoá tệp có nhật ký: kế hoạch được chốt trước, các bước theo sau" loading="lazy" /><p class="chu-thich">🧩 Xoá tệp có nhật ký: kế hoạch được chốt trước, các bước theo sau</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Slide 26: xoá một tệp có nhật ký — ghi kế hoạch trước, rồi mới làm
participant "File system" as FS
participant "Journal\\n(on disk)" as J
participant "Directory, i-nodes,\\nfree-block bitmap (on disk)" as M
FS -&gt; J : 1. log entry: "remove the name, free i-node 13,\\nfree blocks 290–292" + COMMIT
note right of J : the plan is now safe on disk
FS -&gt; M : 2. remove the directory entry
FS -&gt; M : 3. release the i-node
FS -&gt; M : 4. return the blocks to the free pool
FS -&gt; J : 5. mark the log entry done (checkpoint)
note over FS, M : crash before step 1 completes ⇒ nothing happened\\ncrash after the COMMIT ⇒ at reboot the log is REPLAYED (the steps are idempotent)
@enduml</code></pre></details>
<p>➕ Một lần "mất điện" thật: ảnh ext4 được mount, ghi một thư mục và một tệp rồi chốt (<code>sync</code>), và cái đĩa được chép lại <em>khi vẫn đang mount</em> — đúng trạng thái sự cố để lại. Trên bản chép đó, e2fsck thấy một nhật ký cần phát lại:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 26 chạy thật: rút điện một đĩa ext4 rồi để nhật ký sửa nó<br>
$ mkfs.ext4 -q -b 4096 disk.img 64M<br>
Creating regular file disk.img<br>
$ dumpe2fs -h disk.img 2&gt;/dev/null | grep -E '^Filesystem features|^Total journal size'<br>
Filesystem features: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;has_journal ext_attr resize_inode dir_index filetype extent 64bit flex_bg sparse_super large_file huge_file dir_nlink extra_isize metadata_csum<br>
Total journal size: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096k<br>
$ mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
$ mkdir /mnt/d/reports &amp;&amp; echo "grades of 2026" &gt; /mnt/d/reports/grades.txt<br>
# sync = ghi giao dịch vào NHẬT KÝ ("mục nhật ký" của slide 26)<br>
$ sync<br>
# "mất điện": chép nguyên cái đĩa đúng lúc này, khi nó vẫn đang được mount<br>
$ cp disk.img crashed.img<br>
$ umount /mnt/d<br>
$ dumpe2fs -h crashed.img 2&gt;/dev/null | grep -o needs_recovery<br>
needs_recovery<br>
# bản bị "mất điện": fsck thấy một nhật ký còn phải phát lại<br>
$ e2fsck -fy crashed.img 2&gt;&amp;1 | grep -v '^e2fsck'<br>
crashed.img: recovering journal<br>
Pass 1: Checking inodes, blocks, and sizes<br>
Pass 2: Checking directory structure<br>
Pass 3: Checking directory connectivity<br>
Pass 4: Checking reference counts<br>
Pass 5: Checking group summary information<br>
Free blocks count wrong (14319, counted=14317).<br>
Fix? yes<br>
<br>
Free inodes count wrong (16373, counted=16371).<br>
Fix? yes<br>
<br>
<br>
crashed.img: ***** FILE SYSTEM WAS MODIFIED *****<br>
crashed.img: 13/16384 files (7.7% non-contiguous), 2067/16384 blocks<br>
$ debugfs -R "ls -l /reports" crashed.img 2&gt;/dev/null | awk '{print $1, $NF}'<br>
12 .<br>
2 ..<br>
13 grades.txt<br>
<br>
$ debugfs -R "cat /reports/grades.txt" crashed.img 2&gt;/dev/null<br>
grades of 2026</div>
<p>Superblock của bản bị "mất điện" mang cờ <code>needs_recovery</code>; e2fsck báo <code>recovering journal</code>, phát lại giao dịch đã chốt và sau đó chỉ phải sửa các bộ đếm tổng. Tệp <code>reports/grades.txt</code> còn nguyên nội dung — không phải quét cả đĩa hàng giờ. (Nhật ký 4 MB nằm trong danh sách tính năng: <code>has_journal</code>.)</p>
<p class="pitfall">⚠️ FE4 câu 29: cả hai phát biểu đều đúng — hệ thống tệp dạng log (log-structured) nối <em>mọi</em> thay đổi tuần tự vào một log; hệ có nhật ký (journaling) ghi trước một mục nhật ký liệt kê các hành động, và chỉ khi nó đã nằm trên đĩa thì các thao tác mới bắt đầu. FE17 câu 29 và FE25 câu 50 hỏi cùng một câu mà khoá ngược nhau (log-structured và journaling) — xem quiz chương; thuật ngữ của sách cho việc ghi nhật ký để an toàn khi sập là <strong>journaling</strong> (ext3/ext4, NTFS).</p>`],
      [27, 'Virtual File Systems (1)',
        `<p class="y-chinh">🎯 Figure 4-18: position of the <strong>virtual file system (VFS)</strong> — user processes call POSIX (open, read, write…) on the VFS; below the VFS interface sit several concrete file systems (FS 1, FS 2, FS 3), all sharing one buffer cache.</p>
<p>A computer uses many file systems at once: the system disk (ext4), a USB stick (FAT), a network share (NFS), and in-memory ones. Windows gives each its own drive letter; UNIX mounts them all into <strong>one tree</strong>, and the VFS is the layer that makes this possible. It is an abstraction layer: the upper interface is the POSIX calls programs use; the lower interface is a set of functions (read, write, open, lookup…) that each concrete file system must provide. The VFS handles everything common — paths, file descriptors, the cache — and calls the right file system for the rest.</p>
<p>➕ The course container mounts several kinds side by side, and the same <code>read()</code> works on all of them:</p>
<div class="out"># Figure 4-18: one tree, many file systems under the VFS<br>
# file systems this kernel knows ("nodev" = needs no disk: they live in memory or in the kernel)<br>
$ grep -E 'ext4|vfat|tmpfs|proc$|sysfs|overlay|nfs' /proc/filesystems<br>
nodev	sysfs<br>
nodev	tmpfs<br>
nodev	proc<br>
nodev	devtmpfs<br>
	ext4<br>
	vfat<br>
nodev	nfs<br>
nodev	nfs4<br>
nodev	nfsd<br>
nodev	overlay<br>
# which file system serves each directory of the container<br>
$ for d in / /proc /sys /dev /dev/shm; do printf '%-9s %s\\n' $d $(stat -f -c %T $d); done<br>
/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;overlayfs<br>
/proc &nbsp;&nbsp;&nbsp;&nbsp;proc<br>
/sys &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sysfs<br>
/dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tmpfs<br>
/dev/shm &nbsp;tmpfs<br>
# the SAME read() works on all of them — the VFS forwards it to the right code<br>
$ head -c 40 /etc/os-release; echo<br>
PRETTY_NAME="Debian GNU/Linux 12 (bookwo<br>
$ head -c 40 /proc/version; echo<br>
Linux version 7.0.12-linuxkit (root@buil<br>
$ cat /sys/kernel/mm/transparent_hugepage/enabled<br>
[always] madvise never<br>
$ echo "temporary" &gt; /dev/shm/t &amp;&amp; cat /dev/shm/t<br>
temporary</div>
<p><code>/proc/filesystems</code> lists what this kernel can mount — "nodev" marks file systems that need no disk (proc, sysfs, tmpfs, overlay — and NFS, which lives on another machine). The root of the container is <strong>overlayfs</strong> (Docker's layered image), <code>/proc</code> is procfs (its "files" are generated by the kernel on each read), <code>/dev/shm</code> is tmpfs (RAM). One <code>head</code>, one <code>cat</code>, and the VFS routes each read to completely different code.</p>
<p class="pitfall">⚠️ FE9 question 39 / FE2 question 27: a USB stick is integrated by <strong>mounting</strong> it on a directory; files copied to that directory go to the stick. Chapter 1 slide 24 showed the mount for real.</p>`,
        `<p class="y-chinh">🎯 Hình 4-18: vị trí của <strong>hệ thống tệp ảo (VFS — virtual file system)</strong> — tiến trình người dùng gọi POSIX (open, read, write…) xuống VFS; bên dưới giao diện VFS là nhiều hệ thống tệp cụ thể (FS 1, FS 2, FS 3), dùng chung một bộ đệm (buffer cache).</p>
<p>Một máy dùng nhiều hệ thống tệp cùng lúc: đĩa hệ thống (ext4), USB (FAT), thư mục chia sẻ qua mạng (NFS), và các loại nằm trong bộ nhớ. Windows cho mỗi cái một ký tự ổ đĩa; UNIX mount tất cả vào <strong>một cây duy nhất</strong>, và VFS là tầng làm được điều đó. Nó là một tầng trừu tượng: giao diện phía trên là các lời gọi POSIX mà chương trình dùng; giao diện phía dưới là một bộ hàm (read, write, open, lookup…) mà mỗi hệ thống tệp cụ thể phải cung cấp. VFS lo mọi phần chung — đường dẫn, bộ mô tả tệp, bộ đệm — và gọi đúng hệ thống tệp cho phần còn lại.</p>
<p>➕ Container của môn mount nhiều loại cạnh nhau, và cùng một <code>read()</code> chạy trên tất cả:</p>
<div class="out"># Hình 4-18: một cây, nhiều hệ thống tệp dưới VFS<br>
# hệ thống tệp nhân này biết ("nodev" = không cần đĩa: nằm trong bộ nhớ hoặc trong nhân)<br>
$ grep -E 'ext4|vfat|tmpfs|proc$|sysfs|overlay|nfs' /proc/filesystems<br>
nodev	sysfs<br>
nodev	tmpfs<br>
nodev	proc<br>
nodev	devtmpfs<br>
	ext4<br>
	vfat<br>
nodev	nfs<br>
nodev	nfs4<br>
nodev	nfsd<br>
nodev	overlay<br>
# hệ thống tệp nào phục vụ từng thư mục của container<br>
$ for d in / /proc /sys /dev /dev/shm; do printf '%-9s %s\\n' $d $(stat -f -c %T $d); done<br>
/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;overlayfs<br>
/proc &nbsp;&nbsp;&nbsp;&nbsp;proc<br>
/sys &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sysfs<br>
/dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tmpfs<br>
/dev/shm &nbsp;tmpfs<br>
# CÙNG một read() chạy trên tất cả — VFS chuyển nó tới đúng đoạn mã<br>
$ head -c 40 /etc/os-release; echo<br>
PRETTY_NAME="Debian GNU/Linux 12 (bookwo<br>
$ head -c 40 /proc/version; echo<br>
Linux version 7.0.12-linuxkit (root@buil<br>
$ cat /sys/kernel/mm/transparent_hugepage/enabled<br>
[always] madvise never<br>
$ echo "temporary" &gt; /dev/shm/t &amp;&amp; cat /dev/shm/t<br>
temporary</div>
<p><code>/proc/filesystems</code> liệt kê những gì nhân này mount được — "nodev" đánh dấu loại không cần đĩa (proc, sysfs, tmpfs, overlay — và NFS, nằm trên máy khác). Gốc của container là <strong>overlayfs</strong> (ảnh nhiều lớp của Docker), <code>/proc</code> là procfs ("tệp" của nó do nhân sinh ra mỗi lần đọc), <code>/dev/shm</code> là tmpfs (RAM). Một lệnh <code>head</code>, một lệnh <code>cat</code>, và VFS đưa mỗi lần đọc tới những đoạn mã hoàn toàn khác nhau.</p>
<p class="pitfall">⚠️ FE9 câu 39 / FE2 câu 27: USB được ghép vào hệ thống tệp bằng cách <strong>mount</strong> nó lên một thư mục; tệp chép vào thư mục đó nằm trên USB. Slide 24 của Chương 1 đã mount thật.</p>`],
      [28, 'Virtual File Systems (2)',
        `<p class="y-chinh">🎯 Figure 4-19: a simplified view of the data structures and code used by the VFS and a concrete file system to do a <code>read</code> — process table → file descriptors → <strong>v-nodes</strong> → a table of <strong>function pointers</strong> (write, read, open) → the read function of FS 1.</p>
<p>The book's walk-through: when a file system is <strong>registered</strong> (at boot or when its module loads) it gives the VFS a list of the addresses of its functions. When it is <strong>mounted</strong>, the VFS records it. When a file is <strong>opened</strong>, the VFS parses the path, finds the right file system, asks it for the file's i-node, and creates a <strong>v-node</strong> in RAM holding that information plus pointers to the function table. The process gets back a file descriptor. Every later <code>read(fd, …)</code> follows fd → v-node → function pointer → the concrete file system's read. In Linux the v-node is <code>struct inode</code>, the open file is <code>struct file</code> and the function table is <code>struct file_operations</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/fa8d287b76452fe820b97f432777994f772796b6.svg" alt="Figure 4-19 as a sequence: read(fd) goes fd → v-node → function pointer → concrete FS → cache or disk" loading="lazy" /><p class="chu-thich">🧩 Figure 4-19 as a sequence: read(fd) goes fd → v-node → function pointer → concrete FS → cache or disk</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 4-19 as a sequence: read(fd, buf, n) through the VFS
participant "User process" as P
participant "File descriptor table\\n(per process)" as FD
participant "VFS\\n(v-node / struct file)" as V
participant "Concrete FS\\n(ext4, vfat, NFS…)" as FS
participant "Buffer / page cache" as C
participant "Disk driver" as D
P -&gt; FD : read(fd = 4, buf, 4096)
FD -&gt; V : fd 4 → the open-file object\\n(position, flags, pointer to the v-node)
V -&gt; FS : v-node-&gt;ops-&gt;read(…)\\n(function pointer filled in at mount / open)
FS -&gt; C : need block k of this file
alt block already cached
  C --&gt; FS : the block (no disk I/O)
else not cached
  C -&gt; D : read block k
  D --&gt; C : block arrives (interrupt)
  C --&gt; FS : the block
end
FS --&gt; V : bytes copied to buf
V --&gt; P : return n (and advance the file position)
@enduml</code></pre></details>
<p>➕ What the process sees of this: only the descriptor numbers. strace shows the identical call sequence for a file on a disk file system and a file in procfs; <code>/proc/&lt;pid&gt;/fd</code> shows where each descriptor points:</p>
<div class="out"># Figure 4-19: the process sees only file descriptors; behind each one the kernel keeps a pointer to the right file system's code<br>
# strace: cat calls the same openat/read/close whether the name is on a disk file system (/etc/hostname — Docker bind-mounts it from the VM's ext4 disk) or in procfs (/proc)<br>
$ strace -e trace=openat,read,close cat /etc/hostname /proc/version 2&gt;&amp;1 &gt;/dev/null | sed -n '/hostname/,$p' | cut -c1-70<br>
openat(AT_FDCWD, "/etc/hostname", O_RDONLY) = 3<br>
read(3, "osg-lab\\n", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8<br>
read(3, "", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
openat(AT_FDCWD, "/proc/version", O_RDONLY) = 3<br>
read(3, "Linux version 7.0.12-linuxkit (r"..., 131072) = 156<br>
read(3, "", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
+++ exited with 0 +++<br>
# the shell opens two files as fd 3 and 4; /proc shows what each descriptor points to<br>
$ exec 3&lt; /etc/hostname 4&lt; /proc/uptime<br>
$ readlink /proc/$$/fd/3 /proc/$$/fd/4<br>
/etc/hostname<br>
/proc/uptime<br>
$ stat -f -c '%T' /etc/hostname /proc/uptime<br>
ext2/ext3<br>
proc</div>
<p><code>/etc/hostname</code> is reported as "ext2/ext3" because Docker bind-mounts it from the VM's ext4 disk (ext2/3/4 share the magic number 0xEF53, so <code>stat -f</code> cannot tell them apart); <code>/proc/version</code> is procfs. Same <code>openat → read → read (0) → close</code> in both cases — the difference is entirely below the VFS.</p>
<div class="callout">🧭 <strong>Backend link:</strong> this is the same design as an interface in Java or a driver API in Node — <code>DataSource</code>/JDBC lets one Spring Boot program talk to PostgreSQL or MySQL through one set of calls. The VFS is that pattern, written in C with function pointers, inside the kernel.</div>`,
        `<p class="y-chinh">🎯 Hình 4-19: cái nhìn đơn giản hoá về các cấu trúc dữ liệu và mã mà VFS cùng một hệ thống tệp cụ thể dùng để làm một lần <code>read</code> — bảng tiến trình → bộ mô tả tệp → <strong>v-node</strong> → bảng <strong>con trỏ hàm</strong> (write, read, open) → hàm read của FS 1.</p>
<p>Sách kể từng bước: khi một hệ thống tệp được <strong>đăng ký</strong> (lúc khởi động hoặc khi nạp module của nó), nó đưa cho VFS danh sách địa chỉ các hàm của mình. Khi được <strong>mount</strong>, VFS ghi nhận nó. Khi một tệp được <strong>mở</strong>, VFS phân tích đường dẫn, tìm đúng hệ thống tệp, hỏi nó i-node của tệp, và tạo một <strong>v-node</strong> trong RAM chứa thông tin đó cùng con trỏ tới bảng hàm. Tiến trình nhận lại một bộ mô tả tệp. Mọi lần <code>read(fd, …)</code> sau đó đi theo fd → v-node → con trỏ hàm → hàm read của hệ thống tệp cụ thể. Trong Linux, v-node là <code>struct inode</code>, tệp đang mở là <code>struct file</code>, còn bảng hàm là <code>struct file_operations</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/fa8d287b76452fe820b97f432777994f772796b6.svg" alt="Hình 4-19 dạng tuần tự: read(fd) đi fd → v-node → con trỏ hàm → FS cụ thể → bộ đệm hoặc đĩa" loading="lazy" /><p class="chu-thich">🧩 Hình 4-19 dạng tuần tự: read(fd) đi fd → v-node → con trỏ hàm → FS cụ thể → bộ đệm hoặc đĩa</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 4-19 dạng tuần tự: read(fd, buf, n) đi qua VFS
participant "User process" as P
participant "File descriptor table\\n(per process)" as FD
participant "VFS\\n(v-node / struct file)" as V
participant "Concrete FS\\n(ext4, vfat, NFS…)" as FS
participant "Buffer / page cache" as C
participant "Disk driver" as D
P -&gt; FD : read(fd = 4, buf, 4096)
FD -&gt; V : fd 4 → the open-file object\\n(position, flags, pointer to the v-node)
V -&gt; FS : v-node-&gt;ops-&gt;read(…)\\n(function pointer filled in at mount / open)
FS -&gt; C : need block k of this file
alt block already cached
  C --&gt; FS : the block (no disk I/O)
else not cached
  C -&gt; D : read block k
  D --&gt; C : block arrives (interrupt)
  C --&gt; FS : the block
end
FS --&gt; V : bytes copied to buf
V --&gt; P : return n (and advance the file position)
@enduml</code></pre></details>
<p>➕ Phần tiến trình nhìn thấy: chỉ có các con số bộ mô tả. strace cho thấy chuỗi lời gọi y hệt với một tệp trên hệ thống tệp đĩa và một tệp trong procfs; <code>/proc/&lt;pid&gt;/fd</code> cho thấy mỗi bộ mô tả trỏ tới đâu:</p>
<div class="out"># Hình 4-19: tiến trình chỉ thấy bộ mô tả tệp; sau mỗi cái, nhân giữ con trỏ tới đúng mã của hệ thống tệp<br>
# strace: cat gọi cùng openat/read/close dù cái tên nằm trên hệ thống tệp đĩa (/etc/hostname — Docker gắn nó từ đĩa ext4 của máy ảo) hay trong procfs (/proc)<br>
$ strace -e trace=openat,read,close cat /etc/hostname /proc/version 2&gt;&amp;1 &gt;/dev/null | sed -n '/hostname/,$p' | cut -c1-70<br>
openat(AT_FDCWD, "/etc/hostname", O_RDONLY) = 3<br>
read(3, "osg-lab\\n", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8<br>
read(3, "", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
openat(AT_FDCWD, "/proc/version", O_RDONLY) = 3<br>
read(3, "Linux version 7.0.12-linuxkit (r"..., 131072) = 156<br>
read(3, "", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
close(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
+++ exited with 0 +++<br>
# shell mở hai tệp thành fd 3 và 4; /proc cho thấy mỗi bộ mô tả trỏ tới đâu<br>
$ exec 3&lt; /etc/hostname 4&lt; /proc/uptime<br>
$ readlink /proc/$$/fd/3 /proc/$$/fd/4<br>
/etc/hostname<br>
/proc/uptime<br>
$ stat -f -c '%T' /etc/hostname /proc/uptime<br>
ext2/ext3<br>
proc</div>
<p><code>/etc/hostname</code> được báo là "ext2/ext3" vì Docker gắn nó từ đĩa ext4 của máy ảo (ext2/3/4 dùng chung magic number 0xEF53 nên <code>stat -f</code> không phân biệt được); <code>/proc/version</code> là procfs. Cả hai đều <code>openat → read → read (0) → close</code> — khác biệt nằm trọn bên dưới VFS.</p>
<div class="callout">🧭 <strong>Liên hệ backend:</strong> đây đúng là thiết kế interface trong Java hay API driver trong Node — <code>DataSource</code>/JDBC cho một chương trình Spring Boot nói chuyện với PostgreSQL hay MySQL qua cùng một bộ lời gọi. VFS là mẫu đó, viết bằng C với con trỏ hàm, nằm trong nhân.</div>`],
    ]),
    books([
      ['mos4', 'Chapter 4, sections 4.1–4.3, Figures 4-1 to 4-19', 'Chương 4, mục 4.1–4.3, Hình 4-1 tới 4-19'],
      ['mchoes', 'Chapter 8 "File Management" — file organisation, allocation methods and directories explained a second time', 'Chương 8 "File Management" — tổ chức tệp, cách cấp phát và thư mục, giảng lần thứ hai'],
      ['ostep', 'Chapter 39 "Interlude: Files and Directories", Chapter 40 "File System Implementation", Chapter 42 "Crash Consistency: FSCK and Journaling"', 'Chương 39 "Interlude: Files and Directories", Chương 40 "File System Implementation", Chương 42 "Crash Consistency: FSCK and Journaling"'],
      ['man7', 'open(2), creat(2), read(2), write(2), lseek(2), stat(2), link(2), symlink(2), unlink(2), rename(2), opendir(3), readdir(3), debugfs(8), dumpe2fs(8), filefrag(8), proc_sys_fs(5) for protected_hardlinks', 'open(2), creat(2), read(2), write(2), lseek(2), stat(2), link(2), symlink(2), unlink(2), rename(2), opendir(3), readdir(3), debugfs(8), dumpe2fs(8), filefrag(8), proc_sys_fs(5) cho protected_hardlinks'],
      ['kernelDocs', 'The ext4 data structures — Block and inode allocation, "The Contents of inode.i_block" (block maps and extent trees), "Virtual File System" overview', 'Cấu trúc dữ liệu ext4 — cấp phát khối và i-node, "The Contents of inode.i_block" (block map và cây extent), tổng quan "Virtual File System"'],
    ]),
  ].join('\n'),
};

/* ───────── 4.B — 📑 Slide by slide · File Systems: block size, free space, quotas, backup, fsck, cache, FAT, V7 (slides 29–49) ───────── */
const L_osg4_2 = {
  title: '4.B — 📑 Slide by slide · File Systems: block size, free space, quotas, backup, fsck, cache, FAT, V7 (slides 29–49)|||4.B — 📑 Học theo từng slide · File Systems: cỡ khối, khối trống, quota, sao lưu, fsck, FAT, V7 (slide 29–49)',
  slug: 'osg202-slide-osg4-2',
  type: 'VIDEO',
  description: 'Giảng đủ 21 slide cuối Chương 4: phân bố cỡ tệp (đo lại thật trên Debian 12), chọn cỡ khối (mô phỏng tốc độ và hiệu suất dùng chỗ theo mô hình đĩa của sách), theo dõi khối trống bằng danh sách liên kết và bitmap, khối con trỏ trong RAM, hạn ngạch đĩa (bảng quota thật của ext4), sao lưu vật lý và logic (thuật toán bốn pha tính lại khớp sách từng bit, tar gia tăng thật), kiểm tra nhất quán (cố ý làm hỏng ảnh ext2 rồi để e2fsck sửa khối mất tích, khối trùng, số liên kết sai), bộ đệm và ghi trễ (page cache, khối bẩn, sync), giảm dịch đầu từ (block group của ext4), hệ thống tệp MS-DOS FAT (mục thư mục 32 byte giải mã thật, bảng cỡ phân vùng tối đa tính bằng máy), UNIX V7 (mục 16 byte, i-node với khối gián tiếp ba tầng, tra đường dẫn /usr/ast/mbox từng bước) và ISO 9660 với Rock Ridge, Joliet — kèm chỗ slide lỗi thời.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.B · deck "Chapter 4 · File Systems", slides 29–49</span>
<h2>Managing and optimising a file system, and three real file systems</h2>
<p class="lead">The second half follows sections 4.4–4.5 of the book. Lesson 4.A showed how files are stored; this lesson asks how to <em>run</em> a file system well: which block size to pick, how to remember free blocks, how to stop one user filling the disk, how to back it up, how to repair it after a crash, and how to make it fast with caching and good placement. It ends with three real designs — MS-DOS FAT, UNIX V7 and the ISO 9660 CD-ROM format — whose numbers the FE loves to ask (FAT partition limits, i-node file sizes).</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>29–30</td><td>4.4.1 Disk-space management</td><td>explain the block-size trade-off and compute space efficiency and data rate</td></tr>
<tr><td>31–33</td><td>4.4.1 Free blocks, quotas</td><td>compare a free list with a bitmap; read a quota table</td></tr>
<tr><td>34–36</td><td>4.4.2 Backups</td><td>distinguish physical and logical dumps, run the four-phase dump algorithm</td></tr>
<tr><td>37</td><td>4.4.3 Consistency</td><td>classify missing, duplicate-free and duplicate-data blocks and say how fsck repairs them</td></tr>
<tr><td>38–40</td><td>4.4.4 Performance</td><td>explain the buffer cache, write-back vs write-through, block groups</td></tr>
<tr><td>41–48</td><td>4.5 Example file systems</td><td>compute FAT limits, follow a V7 lookup, compute the max file size of an i-node</td></tr>
</tbody>
</table>
<div class="callout">Practice lesson 4.C right after this one collects all the calculation types of the chapter with solutions computed by the simulators, plus Linux exercises (inode exhaustion, link counts, fsck).</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.B · deck "Chapter 4 · File Systems", slide 29–49</span>
<h2>Quản lý và tối ưu một hệ thống tệp, và ba hệ thống tệp có thật</h2>
<p class="lead">Nửa sau đi theo mục 4.4–4.5 của sách. Bài 4.A cho thấy tệp được lưu thế nào; bài này hỏi làm sao <em>vận hành</em> hệ thống tệp cho tốt: chọn cỡ khối nào, nhớ khối trống ra sao, chặn một người dùng làm đầy đĩa thế nào, sao lưu thế nào, sửa sau sự cố ra sao, và làm cho nhanh bằng bộ đệm và cách đặt dữ liệu. Cuối bài là ba thiết kế có thật — FAT của MS-DOS, UNIX V7 và định dạng CD-ROM ISO 9660 — với những con số FE rất hay hỏi (giới hạn phân vùng FAT, cỡ tệp tối đa với i-node).</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>29–30</td><td>4.4.1 Quản lý chỗ trên đĩa</td><td>giải thích sự đánh đổi khi chọn cỡ khối, tính hiệu suất dùng chỗ và tốc độ dữ liệu</td></tr>
<tr><td>31–33</td><td>4.4.1 Khối trống, hạn ngạch</td><td>so sánh danh sách khối trống với bitmap; đọc một bảng quota</td></tr>
<tr><td>34–36</td><td>4.4.2 Sao lưu</td><td>phân biệt sao lưu vật lý và logic, chạy thuật toán dump bốn pha</td></tr>
<tr><td>37</td><td>4.4.3 Nhất quán</td><td>phân loại khối mất tích, trùng trong danh sách trống, trùng dữ liệu và nói fsck sửa thế nào</td></tr>
<tr><td>38–40</td><td>4.4.4 Hiệu năng</td><td>giải thích bộ đệm khối, ghi trễ và ghi xuyên, nhóm khối</td></tr>
<tr><td>41–48</td><td>4.5 Ví dụ hệ thống tệp</td><td>tính giới hạn FAT, theo dõi một lần tra đường dẫn V7, tính cỡ tệp tối đa của i-node</td></tr>
</tbody>
</table>
<div class="callout">Bài thực hành 4.C ngay sau bài này gom mọi dạng tính toán của chương, lời giải do bộ mô phỏng tính, cùng các bài Linux (hết i-node, số liên kết, fsck).</div>`),
    walkHead('osg4', 29, 49),
    walk('osg4', [
      [29, 'Disk Space Management (1)',
        `<p class="y-chinh">🎯 Figure 4-20: percentage of files smaller than a given size, measured at a university (VU) in 1984 and 2005, and on a web server — e.g. in 2005 about 59% of files were at most 4 KB and about 90% at most 64 KB; very few files exceed 1 MB.</p>
<p>Almost all file systems chop files into fixed-size <strong>blocks</strong> that need not be adjacent (the alternative — storing a file as consecutive bytes — fails when the file grows, the same problem as segmentation in Chapter 3). The question is then: how big should a block be? To answer it, you need the <strong>distribution of file sizes</strong>, which is what this figure gives. Its lesson: most files are small, but most of the <em>space</em> is taken by a few big files.</p>
<p>➕ The figure's data are old, so here is the same measurement today, on every file of the Debian 12 system in the course container:</p>
<div class="out"># Figure 4-20 measured again, today: what fraction of the files in this Debian 12 system are at most N bytes?<br>
$ find / -xdev -type f -printf '%s\\n' 2&gt;/dev/null &gt; sizes.txt<br>
$ wc -l &lt; sizes.txt<br>
17193<br>
$ for n in 1024 2048 4096 8192 16384 65536 1048576 16777216; do awk -v n=$n '$1 &lt;= n {c++} END {printf "&lt;= %9d bytes: %6.2f%%\\n", n, 100*c/NR}' sizes.txt; done<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 bytes: &nbsp;26.35%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2048 bytes: &nbsp;44.72%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096 bytes: &nbsp;61.71%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8192 bytes: &nbsp;72.24%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;16384 bytes: &nbsp;82.02%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;65536 bytes: &nbsp;90.46%<br>
&lt;= &nbsp;&nbsp;1048576 bytes: &nbsp;99.58%<br>
&lt;= &nbsp;16777216 bytes: &nbsp;99.95%<br>
# the median file, and how much space 4 KB blocks waste on these files<br>
$ sort -n sizes.txt | awk '{ a[NR] = $1 } END { print "median size:", a[int(NR/2)], "bytes" }'<br>
median size: 2489 bytes<br>
$ awk '{ used += $1; alloc += int(($1 + 4095) / 4096) * 4096 } END { printf "data %.0f MB, allocated in 4 KB blocks %.0f MB, efficiency %.1f%%\\n", used/1048576, alloc/1048576, 100*used/alloc }' sizes.txt<br>
data 971 MB, allocated in 4 KB blocks 1011 MB, efficiency 96.0%</div>
<p>Of 17,193 files, 61.7% are at most 4 KB and 90.5% at most 64 KB — remarkably close to the VU 2005 column (59.13% and 90.84%). The median file is about 2.5 KB. With 4 KB blocks, the 971 MB of data occupy 1011 MB: 96% efficiency, because the few large files dominate the space.</p>
<p class="meo">🧠 "Most files are small" is why i-nodes have direct pointers (slide 21) and why ext4 can even store a tiny file <em>inside</em> the i-node (inline data). "Most bytes are in big files" is why big blocks and extents matter.</p>`,
        `<p class="y-chinh">🎯 Hình 4-20: phần trăm số tệp nhỏ hơn một cỡ cho trước, đo ở một trường đại học (VU) năm 1984 và 2005, và trên một máy chủ web — ví dụ năm 2005 khoảng 59% số tệp không quá 4 KB và khoảng 90% không quá 64 KB; rất ít tệp vượt 1 MB.</p>
<p>Gần như mọi hệ thống tệp chặt tệp thành các <strong>khối (block)</strong> cỡ cố định, không cần nằm liền nhau (cách còn lại — lưu tệp thành các byte liên tiếp — hỏng khi tệp lớn thêm, cùng vấn đề với phân đoạn ở Chương 3). Câu hỏi khi đó là: khối nên to cỡ nào? Muốn trả lời phải biết <strong>phân bố cỡ tệp</strong>, chính là thứ hình này cho. Bài học của nó: đa số tệp nhỏ, nhưng phần lớn <em>dung lượng</em> lại do một số ít tệp lớn chiếm.</p>
<p>➕ Số liệu trên hình đã cũ, nên đây là cùng phép đo hôm nay, trên mọi tệp của hệ Debian 12 trong container của môn:</p>
<div class="out"># Đo lại Hình 4-20 hôm nay: bao nhiêu phần trăm tệp của hệ Debian 12 này có cỡ tối đa N byte?<br>
$ find / -xdev -type f -printf '%s\\n' 2&gt;/dev/null &gt; sizes.txt<br>
$ wc -l &lt; sizes.txt<br>
17193<br>
$ for n in 1024 2048 4096 8192 16384 65536 1048576 16777216; do awk -v n=$n '$1 &lt;= n {c++} END {printf "&lt;= %9d bytes: %6.2f%%\\n", n, 100*c/NR}' sizes.txt; done<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1024 bytes: &nbsp;26.35%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2048 bytes: &nbsp;44.72%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096 bytes: &nbsp;61.71%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8192 bytes: &nbsp;72.24%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;16384 bytes: &nbsp;82.02%<br>
&lt;= &nbsp;&nbsp;&nbsp;&nbsp;65536 bytes: &nbsp;90.46%<br>
&lt;= &nbsp;&nbsp;1048576 bytes: &nbsp;99.58%<br>
&lt;= &nbsp;16777216 bytes: &nbsp;99.95%<br>
# tệp trung vị, và khối 4 KB làm phí bao nhiêu chỗ trên các tệp này<br>
$ sort -n sizes.txt | awk '{ a[NR] = $1 } END { print "median size:", a[int(NR/2)], "bytes" }'<br>
median size: 2489 bytes<br>
$ awk '{ used += $1; alloc += int(($1 + 4095) / 4096) * 4096 } END { printf "data %.0f MB, allocated in 4 KB blocks %.0f MB, efficiency %.1f%%\\n", used/1048576, alloc/1048576, 100*used/alloc }' sizes.txt<br>
data 971 MB, allocated in 4 KB blocks 1011 MB, efficiency 96.0%</div>
<p>Trong 17.193 tệp, 61,7% không quá 4 KB và 90,5% không quá 64 KB — sát đáng ngạc nhiên với cột VU 2005 (59,13% và 90,84%). Tệp trung vị khoảng 2,5 KB. Với khối 4 KB, 971 MB dữ liệu chiếm 1011 MB: hiệu suất 96%, vì vài tệp lớn chiếm phần lớn dung lượng.</p>
<p class="meo">🧠 "Đa số tệp nhỏ" là lý do i-node có con trỏ trực tiếp (slide 21) và ext4 còn cất được tệp tí hon <em>ngay trong</em> i-node (inline data). "Đa số byte nằm trong tệp lớn" là lý do khối lớn và extent quan trọng.</p>`],
      [30, 'Disk Space Management (2)',
        `<p class="y-chinh">🎯 Figure 4-21: the dashed curve (left scale) is the <strong>data rate</strong> of a disk, the solid curve (right scale) the <strong>disk-space efficiency</strong>, as the block size grows from 1 KB to 1 MB, when all files are 4 KB.</p>
<p>The trade-off: <strong>small blocks waste less space</strong> (a 4 KB file in a 1 MB block wastes almost all of it) but a file spans many blocks, and each block costs a seek and a rotational delay — so <strong>small blocks are slow</strong>. Big blocks are fast but waste space. The book's model: 1 MB per track, rotation 8.33 ms, average seek 5 ms, so reading a k-byte block takes 5 + 4.165 + (k / 1,000,000) × 8.33 ms. The simulator computes both curves from that formula:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8091b25cb09249a4a81cc75547dc06b6e3c8f618.svg" alt="Data rate rises, space efficiency falls, as blocks grow" loading="lazy" /><p class="chu-thich">🧮 Data rate rises, space efficiency falls, as blocks grow</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const SEEK = 5, QUAY = 8.33, RANH = 1_000_000;        // ms, ms per rotation, bytes per track
const thoiGian = (k) =&gt; SEEK + QUAY / 2 + (k / RANH) * QUAY;              // ms to read one k-byte block
const tocDo = (k) =&gt; k / 1e6 / (thoiGian(k) / 1000);                      // MB/s
const hieuSuat = (tep, khoi) =&gt; tep / (Math.ceil(tep / khoi) * khoi);     // useful bytes / allocated bytes</code></pre></details>
<p>For 4 KB files, efficiency is 100% up to 4 KB blocks, then halves with each doubling (8 KB → 50%, 16 KB → 25%); the data rate grows almost linearly until the transfer time dominates the seek (about 58.6 MB/s at 1 MB). The two goals are in conflict, and historically file systems chose 1–4 KB. ➕ Today 4 KB is the default of ext4 and NTFS (it matches the memory page size and the 4 KB physical sector of modern drives), and big-block behaviour is obtained differently — with extents and read-ahead.</p>
<p class="pitfall">⚠️ FE19 question 39: a 4 KB file on a file system with 8 KB blocks — space efficiency <strong>50%</strong> (verified by the simulator, variant hs-4-8). FE24 question 41: the larger the block, the <strong>faster</strong> the data rate; FE27 question 16: the larger the block, the <strong>worse</strong> the space utilisation.</p>`,
        `<p class="y-chinh">🎯 Hình 4-21: đường nét đứt (trục trái) là <strong>tốc độ dữ liệu</strong> của đĩa, đường nét liền (trục phải) là <strong>hiệu suất dùng chỗ</strong>, khi cỡ khối tăng từ 1 KB tới 1 MB, với mọi tệp đều 4 KB.</p>
<p>Sự đánh đổi: <strong>khối nhỏ ít phí chỗ</strong> (tệp 4 KB nằm trong khối 1 MB thì phí gần hết) nhưng tệp trải trên nhiều khối, mà mỗi khối tốn một lần tìm (seek) và một lần chờ quay — nên <strong>khối nhỏ thì chậm</strong>. Khối lớn thì nhanh nhưng phí chỗ. Mô hình của sách: 1 MB mỗi rãnh, quay một vòng 8,33 ms, thời gian tìm trung bình 5 ms, nên đọc một khối k byte mất 5 + 4,165 + (k / 1.000.000) × 8,33 ms. Bộ mô phỏng tính cả hai đường từ công thức đó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9fa02c77074f0cc722c092e815f37d7599c3df65.svg" alt="Tốc độ dữ liệu tăng, hiệu suất dùng chỗ giảm, khi khối to dần" loading="lazy" /><p class="chu-thich">🧮 Tốc độ dữ liệu tăng, hiệu suất dùng chỗ giảm, khi khối to dần</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const SEEK = 5, QUAY = 8.33, RANH = 1_000_000;        // ms, ms mỗi vòng, byte mỗi rãnh
const thoiGian = (k) =&gt; SEEK + QUAY / 2 + (k / RANH) * QUAY;              // ms để đọc một khối k byte
const tocDo = (k) =&gt; k / 1e6 / (thoiGian(k) / 1000);                      // MB/s
const hieuSuat = (tep, khoi) =&gt; tep / (Math.ceil(tep / khoi) * khoi);     // byte có ích / byte được cấp</code></pre></details>
<p>Với tệp 4 KB, hiệu suất là 100% cho tới khối 4 KB, rồi giảm một nửa mỗi lần khối gấp đôi (8 KB → 50%, 16 KB → 25%); tốc độ dữ liệu tăng gần tuyến tính cho tới khi thời gian truyền lấn át thời gian tìm (khoảng 58,6 MB/s ở khối 1 MB). Hai mục tiêu xung đột nhau, và trong lịch sử các hệ thống tệp chọn 1–4 KB. ➕ Ngày nay 4 KB là mặc định của ext4 và NTFS (khớp với cỡ trang bộ nhớ và sector vật lý 4 KB của ổ hiện đại), còn hiệu quả của khối lớn thì đạt bằng cách khác — extent và đọc trước.</p>
<p class="pitfall">⚠️ FE19 câu 39: tệp 4 KB trên hệ thống tệp khối 8 KB — hiệu suất dùng chỗ <strong>50%</strong> (bộ mô phỏng kiểm, biến thể hs-4-8). FE24 câu 41: khối càng lớn thì tốc độ dữ liệu càng <strong>nhanh</strong>; FE27 câu 16: khối càng lớn thì hiệu suất dùng chỗ càng <strong>tệ</strong>.</p>`],
      [31, 'Keeping Track of Free Blocks (1)',
        `<p class="y-chinh">🎯 Figure 4-22: two ways to remember which blocks are free — (a) a <strong>linked list of disk blocks</strong>, each holding as many free-block numbers as fit ("a 1-KB disk block can hold 256 32-bit disk block numbers"); (b) a <strong>bitmap</strong> with one bit per block (1 = free in the book's figure, 0 = allocated).</p>
<p>In (a), each list block holds 255 free-block numbers plus one slot pointing to the next list block. The list only needs space for free blocks, so it shrinks as the disk fills. In (b), a disk of n blocks needs n bits, always. The book's example: a 1 TB disk with 1 KB blocks has about 1 billion (2³⁰) blocks; the free list then needs about 4 million blocks when the disk is empty, the bitmap 131,072 blocks:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6a5d4fb53c1fed963427c3be95dbec19be025eb5.svg" alt="Free list versus bitmap for a 1 TB disk with 1 KB blocks" loading="lazy" /><p class="chu-thich">🧮 Free list versus bitmap for a 1 TB disk with 1 KB blocks</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function soSanh(soKhoi, khoiBytes, soBytes = 4) {
  const moiKhoi = khoiBytes / soBytes - 1;             // numbers per free-list block (one slot links to the next block)
  const danhSach = Math.ceil(soKhoi / moiKhoi);        // free list when the disk is EMPTY (worst case)
  const bitmap = Math.ceil(soKhoi / (khoiBytes * 8));  // 1 bit per block, always
  return { moiKhoi, danhSach, bitmap };
}</code></pre></details>
<p>The bitmap is smaller unless the disk is nearly full (a free-list entry costs 32 bits, a bitmap entry 1 bit), and it has another advantage: free blocks <em>near each other</em> are easy to find, so a file can be kept close together. ➕ ext4 uses bitmaps, one per block group:</p>
<div class="out"># Figure 4-22(b) on ext4: free space is tracked with BITMAPS — one bit per block, one bitmap per block group<br>
$ mkfs.ext4 -q -b 4096 -O ^flex_bg disk.img 256M<br>
Creating regular file disk.img<br>
$ dumpe2fs disk.img 2&gt;/dev/null | grep -E '^Group 0|^Group 1:|Block bitmap at|free blocks,' | head -6<br>
Group 0: (Blocks 0-32767) csum 0xaad0<br>
&nbsp;&nbsp;Block bitmap at 33 (+33), csum 0x43956bfe<br>
&nbsp;&nbsp;30679 free blocks, 32757 free inodes, 2 directories, 32757 unused inodes<br>
Group 1: (Blocks 32768-65535) csum 0xfdf9 [INODE_UNINIT]<br>
&nbsp;&nbsp;Block bitmap at 32801 (+33), csum 0x343f0efd<br>
&nbsp;&nbsp;26589 free blocks, 32768 free inodes, 0 directories, 32768 unused inodes<br>
# one bitmap block = 4096 bytes x 8 bits = 32768 blocks = 128 MB of disk<br>
$ dumpe2fs -h disk.img 2&gt;/dev/null | grep -E '^(Block count|Free blocks|Blocks per group)'<br>
Block count: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;65536<br>
Free blocks: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;57268<br>
Blocks per group: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768<br>
# test individual bits: is block 100 in use? is block 20000? which is the first free block?<br>
$ debugfs -R "testb 100" disk.img 2&gt;/dev/null<br>
Block 100 marked in use<br>
$ debugfs -R "testb 20000" disk.img 2&gt;/dev/null<br>
Block 20000 not in use<br>
$ debugfs -R "ffb" disk.img 2&gt;/dev/null<br>
Free blocks found: 2089</div>
<p>A 4 KB bitmap block holds 32,768 bits, so it covers 32,768 blocks = 128 MB — exactly one group (Group 0: blocks 0–32767, its block bitmap at block 33). <code>testb</code> reads a single bit and <code>ffb</code> finds the first free block, the very operations the allocator does.</p>
<p class="pitfall">⚠️ FE10 question 35: a 1 KB block with 32-bit block numbers holds <strong>255</strong> numbers on the free list (not 256 — one slot is the link to the next block); the simulator's answer. FE18 question 26: both a linked list and a bitmap are used to keep track of free blocks.</p>`,
        `<p class="y-chinh">🎯 Hình 4-22: hai cách nhớ khối nào trống — (a) một <strong>danh sách liên kết các khối đĩa</strong>, mỗi khối chứa được bao nhiêu số hiệu khối trống thì chứa ("một khối đĩa 1 KB chứa được 256 số hiệu khối 32 bit"); (b) một <strong>bitmap</strong> mỗi khối một bit (trên hình sách 1 = trống, 0 = đã cấp).</p>
<p>Ở (a), mỗi khối danh sách chứa 255 số hiệu khối trống cộng một ô trỏ tới khối danh sách kế. Danh sách chỉ cần chỗ cho các khối trống, nên co lại khi đĩa đầy dần. Ở (b), đĩa n khối luôn cần n bit. Ví dụ của sách: đĩa 1 TB khối 1 KB có khoảng 1 tỉ (2³⁰) khối; khi đĩa trống, danh sách cần khoảng 4 triệu khối, bitmap cần 131.072 khối:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/eec3f13007d2615f6dea17c9a4443ede3e3e147b.svg" alt="Danh sách khối trống so với bitmap cho đĩa 1 TB, khối 1 KB" loading="lazy" /><p class="chu-thich">🧮 Danh sách khối trống so với bitmap cho đĩa 1 TB, khối 1 KB</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function soSanh(soKhoi, khoiBytes, soBytes = 4) {
  const moiKhoi = khoiBytes / soBytes - 1;             // số hiệu mỗi khối danh sách (một ô nối sang khối kế)
  const danhSach = Math.ceil(soKhoi / moiKhoi);        // danh sách khi đĩa TRỐNG (trường hợp xấu nhất)
  const bitmap = Math.ceil(soKhoi / (khoiBytes * 8));  // 1 bit mỗi khối, luôn luôn
  return { moiKhoi, danhSach, bitmap };
}</code></pre></details>
<p>Bitmap nhỏ hơn trừ khi đĩa gần đầy (mỗi mục danh sách tốn 32 bit, mỗi mục bitmap 1 bit), và nó còn một lợi thế: dễ tìm các khối trống <em>nằm gần nhau</em>, nên giữ được các khối của một tệp ở gần nhau. ➕ ext4 dùng bitmap, mỗi nhóm khối một cái:</p>
<div class="out"># Hình 4-22(b) trên ext4: chỗ trống được theo dõi bằng BITMAP — một bit mỗi khối, mỗi nhóm khối một bitmap<br>
$ mkfs.ext4 -q -b 4096 -O ^flex_bg disk.img 256M<br>
Creating regular file disk.img<br>
$ dumpe2fs disk.img 2&gt;/dev/null | grep -E '^Group 0|^Group 1:|Block bitmap at|free blocks,' | head -6<br>
Group 0: (Blocks 0-32767) csum 0xaad0<br>
&nbsp;&nbsp;Block bitmap at 33 (+33), csum 0x43956bfe<br>
&nbsp;&nbsp;30679 free blocks, 32757 free inodes, 2 directories, 32757 unused inodes<br>
Group 1: (Blocks 32768-65535) csum 0xfdf9 [INODE_UNINIT]<br>
&nbsp;&nbsp;Block bitmap at 32801 (+33), csum 0x343f0efd<br>
&nbsp;&nbsp;26589 free blocks, 32768 free inodes, 0 directories, 32768 unused inodes<br>
# một khối bitmap = 4096 byte x 8 bit = 32768 khối = 128 MB đĩa<br>
$ dumpe2fs -h disk.img 2&gt;/dev/null | grep -E '^(Block count|Free blocks|Blocks per group)'<br>
Block count: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;65536<br>
Free blocks: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;57268<br>
Blocks per group: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;32768<br>
# thử từng bit: khối 100 đang dùng không? khối 20000? khối trống đầu tiên là khối nào?<br>
$ debugfs -R "testb 100" disk.img 2&gt;/dev/null<br>
Block 100 marked in use<br>
$ debugfs -R "testb 20000" disk.img 2&gt;/dev/null<br>
Block 20000 not in use<br>
$ debugfs -R "ffb" disk.img 2&gt;/dev/null<br>
Free blocks found: 2089</div>
<p>Một khối bitmap 4 KB chứa 32.768 bit, nên phủ 32.768 khối = 128 MB — đúng một nhóm (Group 0: khối 0–32767, bitmap khối của nó ở khối 33). <code>testb</code> đọc một bit và <code>ffb</code> tìm khối trống đầu tiên, đúng những thao tác bộ cấp phát làm.</p>
<p class="pitfall">⚠️ FE10 câu 35: khối 1 KB, số hiệu 32 bit thì mỗi khối danh sách chứa <strong>255</strong> số (không phải 256 — một ô là liên kết tới khối kế); đáp án của bộ mô phỏng. FE18 câu 26: cả danh sách liên kết lẫn bitmap đều được dùng để theo dõi khối trống.</p>`],
      [32, 'Keeping Track of Free Blocks (2)',
        `<p class="y-chinh">🎯 Figure 4-23: (a) an almost-full block of pointers to free disk blocks in memory, and three blocks of pointers on disk; (b) the result of freeing a three-block file; (c) an alternative strategy for handling the three free blocks. Shaded entries are pointers to free disk blocks.</p>
<p>With the free-list method only one block of pointers is kept in RAM. When a block is freed its number is added there; when a block is needed a number is taken from there. The danger is <strong>thrashing at the boundary</strong>: in (a) the block in memory has room for two more entries. Freeing a 3-block file overflows it, so the full block is written to disk — (b). If a 3-block temporary file is now created, the in-memory block runs empty and a full block must be read back — and a program that keeps creating and deleting temporary files causes disk I/O every time.</p>
<p>The book's fix (c): when the block overflows, <strong>split</strong> it — write half to disk and keep the other half in memory. Now the system can handle a series of create/delete operations of temporary files without any disk I/O; only when the block really fills or empties is a half-full block exchanged with the disk. The simulator runs four create/delete cycles both ways:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b30e856739f5ec426717b82fc36f1fc2ac24267b.svg" alt="Naive strategy: I/O on every cycle; split strategy: one I/O in total" loading="lazy" /><p class="chu-thich">🧮 Naive strategy: I/O on every cycle; split strategy: one I/O in total</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const C = 8, BAT_DAU = 6;
const THAO_TAC = [3, -3, 3, -3, 3, -3, 3, -3];        // +3 = a 3-block file is freed, −3 = a 3-block file is written
function chay(tachDoi) {
  let mem = BAT_DAU, io = 0;
  const buoc = [{ mem, io: 0 }];
  for (const op of THAO_TAC) {
    let ioBuoc = 0;
    for (let k = 0; k &lt; Math.abs(op); k++) {
      if (op &gt; 0) {                                     // free one block: add its number
        if (mem === C) { ioBuoc++; mem = tachDoi ? C / 2 : 0; }   // write the full block (or half of it) to disk
        mem++;
      } else {                                          // allocate one block: take a number
        if (mem === 0) { ioBuoc++; mem = tachDoi ? C / 2 : C; }   // read a block of numbers back from disk
        mem--;
      }
    }
    io += ioBuoc;
    buoc.push({ mem, io: ioBuoc, op });
  }
  return { buoc, io };
}</code></pre></details>
<p>8 disk operations against 1 for the same work. The same "keep a reserve in the middle, not at the edge" idea appears in memory allocators and connection pools: never let a cache oscillate around an exact boundary.</p>
<p class="meo">🧠 With a bitmap the problem does not arise in this form: the bitmap blocks of the area being used stay in memory and bits are flipped there.</p>`,
        `<p class="y-chinh">🎯 Hình 4-23: (a) một khối con trỏ tới các khối đĩa trống, gần đầy, nằm trong bộ nhớ, và ba khối con trỏ trên đĩa; (b) kết quả sau khi giải phóng một tệp 3 khối; (c) một chiến lược khác để xử lý ba khối vừa trống. Các ô tô đậm là con trỏ tới khối đĩa trống.</p>
<p>Với cách danh sách khối trống, chỉ một khối con trỏ được giữ trong RAM. Khối nào được giải phóng thì số hiệu của nó được thêm vào đó; cần khối thì lấy một số từ đó. Nguy cơ là <strong>dao động ở ngay ranh giới</strong>: ở (a) khối trong bộ nhớ chỉ còn chỗ cho hai mục. Giải phóng một tệp 3 khối làm nó tràn, nên khối đầy bị ghi ra đĩa — (b). Nếu giờ tạo một tệp tạm 3 khối, khối trong bộ nhớ cạn và phải đọc lại một khối đầy — và một chương trình cứ tạo rồi xoá tệp tạm sẽ gây I/O đĩa mỗi lần.</p>
<p>Cách sửa của sách (c): khi khối tràn, <strong>tách đôi</strong> nó — ghi một nửa ra đĩa, giữ nửa kia trong bộ nhớ. Giờ hệ thống xử lý được một loạt thao tác tạo/xoá tệp tạm mà không có I/O đĩa nào; chỉ khi khối thật sự đầy hoặc cạn mới đổi một khối nửa đầy với đĩa. Bộ mô phỏng chạy bốn vòng tạo/xoá theo cả hai cách:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c63a948cef1a1f093d69e7f57ed76b66d6fb579c.svg" alt="Cách ngây thơ: mỗi vòng có I/O; cách tách đôi: cả thảy một lần I/O" loading="lazy" /><p class="chu-thich">🧮 Cách ngây thơ: mỗi vòng có I/O; cách tách đôi: cả thảy một lần I/O</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const C = 8, BAT_DAU = 6;
const THAO_TAC = [3, -3, 3, -3, 3, -3, 3, -3];        // +3 = xoá tệp 3 khối, −3 = ghi tệp 3 khối
function chay(tachDoi) {
  let mem = BAT_DAU, io = 0;
  const buoc = [{ mem, io: 0 }];
  for (const op of THAO_TAC) {
    let ioBuoc = 0;
    for (let k = 0; k &lt; Math.abs(op); k++) {
      if (op &gt; 0) {                                     // giải phóng một khối: thêm số hiệu của nó
        if (mem === C) { ioBuoc++; mem = tachDoi ? C / 2 : 0; }   // ghi khối đầy (hay nửa khối) ra đĩa
        mem++;
      } else {                                          // cấp một khối: lấy một số hiệu
        if (mem === 0) { ioBuoc++; mem = tachDoi ? C / 2 : C; }   // đọc lại một khối số hiệu từ đĩa
        mem--;
      }
    }
    io += ioBuoc;
    buoc.push({ mem, io: ioBuoc, op });
  }
  return { buoc, io };
}</code></pre></details>
<p>8 lần thao tác đĩa so với 1 cho cùng một khối lượng việc. Ý tưởng "giữ dự trữ ở giữa, đừng ở sát mép" này còn gặp ở bộ cấp phát bộ nhớ và pool kết nối: đừng bao giờ để bộ đệm dao động quanh đúng một ranh giới.</p>
<p class="meo">🧠 Với bitmap thì vấn đề không xảy ra dưới dạng này: các khối bitmap của vùng đang dùng nằm sẵn trong bộ nhớ và bit được lật ngay tại đó.</p>`],
      [33, 'Disk Quotas',
        `<p class="y-chinh">🎯 Figure 4-24: quotas are kept track of on a <strong>per-user basis</strong> in a quota table — the open-file table entry (attributes, disk addresses, user = 8) has a <strong>quota pointer</strong> to user 8's quota record: soft block limit, hard block limit, current number of blocks, block warnings left, soft file limit, hard file limit, current number of files, file warnings left.</p>
<p>On a multi-user system the administrator assigns each user a maximum number of files and blocks, and the OS makes sure no one exceeds it. When a file is opened, its owner's quota record is brought into the in-memory quota table. Each time a block is added to a file, the owner's block count goes up and is checked against both limits. The <strong>hard limit</strong> can never be exceeded. The <strong>soft limit</strong> may be exceeded during a session; at the next login the user is warned and the "warnings left" counter is decremented, and when it reaches zero the user is not allowed to log in until they clean up.</p>
<p>➕ ext4 keeps exactly this table on disk, in hidden i-nodes 3 (users) and 4 (groups). Here two users get files, and the table is read back:</p>
<div class="out"># Figure 4-24 on ext4: the "quota" feature keeps one quota record per user — blocks and files in use, soft and hard limits<br>
$ mkfs.ext4 -q -b 4096 -O quota disk.img 64M<br>
Creating regular file disk.img<br>
# the quota tables are themselves stored in two hidden i-nodes<br>
$ dumpe2fs -h disk.img 2&gt;/dev/null | grep -E 'quota inode'<br>
User quota inode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
Group quota inode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4<br>
# user 1001 gets two files (3 MB + 1 MB), user 1002 five small files<br>
$ head -c 3M /dev/zero | tr '\\0' x &gt; a1.bin; head -c 1M /dev/zero | tr '\\0' y &gt; a2.bin; echo note &gt; b.txt<br>
$ for f in a1.bin a2.bin; do debugfs -w -R "write $f $f" disk.img &gt;/dev/null 2&gt;&amp;1; debugfs -w -R "sif $f uid 1001" disk.img 2&gt;/dev/null; done<br>
$ for i in 1 2 3 4 5; do debugfs -w -R "write b.txt b$i.txt" disk.img &gt;/dev/null 2&gt;&amp;1; debugfs -w -R "sif b$i.txt uid 1002" disk.img 2&gt;/dev/null; done<br>
# we changed owners behind the kernel's back, so the usage counters are stale — fsck recounts them<br>
$ e2fsck -fy disk.img 2&gt;&amp;1 | grep -iE 'quota|usage' | head -4<br>
[QUOTA WARNING] Missing quota entry ID 1001<br>
[QUOTA WARNING] Missing quota entry ID 1002<br>
Update quota info for quota type 0? yes<br>
[QUOTA WARNING] Usage inconsistent for ID 0:actual (4235264, 9) != expected (20480, 2)<br>
# the quota table: user id, space used (bytes), soft/hard block limits, files used, soft/hard file limits (0 = no limit set)<br>
$ debugfs -R "lq user" disk.img 2&gt;/dev/null<br>
&nbsp;&nbsp;&nbsp;user id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;space &nbsp;&nbsp;&nbsp;quota &nbsp;&nbsp;&nbsp;limit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inodes &nbsp;&nbsp;&nbsp;quota &nbsp;&nbsp;&nbsp;limit<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20480 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1001 &nbsp;&nbsp;&nbsp;4194304 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1002 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20480 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0</div>
<p>User 1001 uses 4,194,304 bytes in 2 files, user 1002 uses 20,480 bytes (5 files × one 4 KB block), root has the two directories. The columns are Figure 4-24's: space and files used, soft limit ("quota") and hard limit ("limit"), 0 = not set. (The limits themselves are set with the <code>setquota</code>/<code>edquota</code> tools, which the course image does not install.)</p>
<div class="callout">🧭 <strong>On a real server:</strong> quotas are the reason a runaway log cannot fill a shared disk — and Kubernetes applies the same idea to containers with <code>ephemeral-storage</code> limits (the pod is evicted when it exceeds them), while XFS project quotas limit Docker volumes.</div>
<p class="pitfall">⚠️ FE13 question 26: "a mechanism for enforcing a limit on individual user space" — <strong>disk quota</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 4-24: hạn ngạch (quota) được theo dõi <strong>theo từng người dùng</strong> trong một bảng quota — mục trong bảng tệp đang mở (thuộc tính, địa chỉ đĩa, user = 8) có một <strong>con trỏ quota</strong> trỏ tới bản ghi quota của người dùng 8: giới hạn khối mềm, giới hạn khối cứng, số khối hiện dùng, số lần cảnh báo khối còn lại, giới hạn tệp mềm, giới hạn tệp cứng, số tệp hiện có, số lần cảnh báo tệp còn lại.</p>
<p>Trên hệ nhiều người dùng, quản trị viên giao cho mỗi người một số tệp và số khối tối đa, và HĐH bảo đảm không ai vượt. Khi một tệp được mở, bản ghi quota của chủ nó được đưa vào bảng quota trong bộ nhớ. Mỗi lần thêm một khối vào tệp, số khối của chủ tăng lên và được so với cả hai giới hạn. <strong>Giới hạn cứng (hard limit)</strong> không bao giờ được vượt. <strong>Giới hạn mềm (soft limit)</strong> được vượt trong một phiên làm việc; lần đăng nhập sau người dùng bị cảnh báo và bộ đếm "số lần cảnh báo còn lại" giảm đi, khi nó về 0 thì người dùng không được đăng nhập cho tới khi dọn dẹp.</p>
<p>➕ ext4 giữ đúng bảng này trên đĩa, trong hai i-node ẩn số 3 (người dùng) và 4 (nhóm). Ở đây hai người dùng nhận tệp, rồi bảng được đọc lại:</p>
<div class="out"># Hình 4-24 trên ext4: tính năng "quota" giữ một bản ghi hạn ngạch cho mỗi người dùng — số khối và số tệp đang dùng, giới hạn mềm và cứng<br>
$ mkfs.ext4 -q -b 4096 -O quota disk.img 64M<br>
Creating regular file disk.img<br>
# chính các bảng hạn ngạch được cất trong hai i-node ẩn<br>
$ dumpe2fs -h disk.img 2&gt;/dev/null | grep -E 'quota inode'<br>
User quota inode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
Group quota inode: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4<br>
# người dùng 1001 có hai tệp (3 MB + 1 MB), người dùng 1002 có năm tệp nhỏ<br>
$ head -c 3M /dev/zero | tr '\\0' x &gt; a1.bin; head -c 1M /dev/zero | tr '\\0' y &gt; a2.bin; echo note &gt; b.txt<br>
$ for f in a1.bin a2.bin; do debugfs -w -R "write $f $f" disk.img &gt;/dev/null 2&gt;&amp;1; debugfs -w -R "sif $f uid 1001" disk.img 2&gt;/dev/null; done<br>
$ for i in 1 2 3 4 5; do debugfs -w -R "write b.txt b$i.txt" disk.img &gt;/dev/null 2&gt;&amp;1; debugfs -w -R "sif b$i.txt uid 1002" disk.img 2&gt;/dev/null; done<br>
# ta đổi chủ sở hữu sau lưng nhân, nên bộ đếm mức dùng đã cũ — fsck đếm lại<br>
$ e2fsck -fy disk.img 2&gt;&amp;1 | grep -iE 'quota|usage' | head -4<br>
[QUOTA WARNING] Missing quota entry ID 1001<br>
[QUOTA WARNING] Missing quota entry ID 1002<br>
Update quota info for quota type 0? yes<br>
[QUOTA WARNING] Usage inconsistent for ID 0:actual (4235264, 9) != expected (20480, 2)<br>
# bảng hạn ngạch: mã người dùng, dung lượng đã dùng (byte), giới hạn khối mềm/cứng, số tệp đã dùng, giới hạn tệp mềm/cứng (0 = chưa đặt)<br>
$ debugfs -R "lq user" disk.img 2&gt;/dev/null<br>
&nbsp;&nbsp;&nbsp;user id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;space &nbsp;&nbsp;&nbsp;quota &nbsp;&nbsp;&nbsp;limit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;inodes &nbsp;&nbsp;&nbsp;quota &nbsp;&nbsp;&nbsp;limit<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20480 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1001 &nbsp;&nbsp;&nbsp;4194304 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1002 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20480 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0</div>
<p>Người dùng 1001 dùng 4.194.304 byte trong 2 tệp, người dùng 1002 dùng 20.480 byte (5 tệp × một khối 4 KB), root giữ hai thư mục. Các cột chính là của Hình 4-24: dung lượng và số tệp đã dùng, giới hạn mềm ("quota") và cứng ("limit"), 0 = chưa đặt. (Bản thân giới hạn được đặt bằng công cụ <code>setquota</code>/<code>edquota</code>, ảnh của môn không cài.)</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> quota là lý do một tệp log chạy loạn không làm đầy được đĩa dùng chung — và Kubernetes áp đúng ý tưởng đó cho container bằng giới hạn <code>ephemeral-storage</code> (pod bị đuổi khi vượt), còn quota theo project của XFS giới hạn volume của Docker.</div>
<p class="pitfall">⚠️ FE13 câu 26: "cơ chế áp giới hạn chỗ đĩa cho từng người dùng" — <strong>disk quota</strong>.</p>`],
      [34, 'File System Backups (1)',
        `<p class="y-chinh">🎯 Backups (to tape, in the book) are made to handle one of two potential problems: (1) <strong>recover from disaster</strong> — a disk crash, fire, flood; (2) <strong>recover from stupidity</strong> — users accidentally deleting files they need later.</p>
<p>Disasters are rare; stupidity is common — which is why Windows has a Recycle Bin and why backups must allow restoring <em>single files</em>, not just whole disks. The book lists the design questions: <strong>what</strong> to back up (not the binaries you can reinstall, not <code>/dev</code> or temporary files — usually just the users' directories); <strong>incremental dumps</strong> (a full dump weekly, then only what changed since); <strong>compression</strong> (risky: one bad spot can ruin the rest); backing up a <strong>live</strong> file system (files change during the dump — take a snapshot); and <strong>physical security</strong> of the tapes (store them off-site, lock them up).</p>
<p>Two strategies: a <strong>physical dump</strong> copies every disk block from 0 to the last, in order — simple and fast, but it copies unused blocks too, cannot skip directories and cannot restore one file. A <strong>logical dump</strong> starts at directories and recursively copies the files and directories that changed since a date — the algorithm of slides 35–36.</p>
<div class="callout">🧭 <strong>On a real server:</strong> the same split exists for PostgreSQL — <code>pg_dump</code> is a <em>logical</em> dump (SQL, restore one table), <code>pg_basebackup</code> + WAL archiving is a <em>physical</em> one (byte copy of the data directory, point-in-time recovery). The 3-2-1 rule: 3 copies, on 2 different media, 1 off-site.</div>
<p class="pitfall">⚠️ FE25 question 16: "Strategy used for dumping a disk to tapes" — <strong>both physical dump and logical dump</strong>.</p>`,
        `<p class="y-chinh">🎯 Sao lưu (ra băng từ, theo sách) được làm để xử lý một trong hai vấn đề: (1) <strong>phục hồi sau thảm hoạ</strong> — đĩa hỏng, cháy, lụt; (2) <strong>phục hồi sau sự ngớ ngẩn</strong> — người dùng lỡ xoá tệp mà sau này lại cần.</p>
<p>Thảm hoạ thì hiếm; ngớ ngẩn thì thường xuyên — vì thế Windows có Thùng rác và bản sao lưu phải khôi phục được <em>từng tệp</em>, không chỉ cả đĩa. Sách liệt kê các câu hỏi thiết kế: sao lưu <strong>cái gì</strong> (không sao các chương trình có thể cài lại, không sao <code>/dev</code> hay tệp tạm — thường chỉ thư mục của người dùng); <strong>sao lưu gia tăng (incremental)</strong> — mỗi tuần một bản đầy đủ, rồi chỉ sao phần đã đổi; <strong>nén</strong> (rủi ro: một chỗ hỏng có thể làm hỏng phần còn lại); sao lưu hệ thống tệp <strong>đang chạy</strong> (tệp thay đổi trong lúc sao — phải chụp snapshot); và <strong>an ninh vật lý</strong> của băng (cất ở nơi khác, khoá lại).</p>
<p>Hai chiến lược: <strong>sao lưu vật lý (physical dump)</strong> chép mọi khối đĩa từ 0 tới khối cuối, theo thứ tự — đơn giản và nhanh, nhưng chép cả khối không dùng, không bỏ qua được thư mục và không khôi phục được một tệp lẻ. <strong>Sao lưu logic (logical dump)</strong> bắt đầu từ thư mục và đệ quy chép những tệp và thư mục đã đổi từ một mốc ngày — thuật toán của slide 35–36.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> PostgreSQL cũng chia đúng như vậy — <code>pg_dump</code> là sao lưu <em>logic</em> (SQL, khôi phục được một bảng), <code>pg_basebackup</code> + lưu trữ WAL là sao lưu <em>vật lý</em> (chép nguyên byte thư mục dữ liệu, khôi phục về một thời điểm). Quy tắc 3-2-1: 3 bản sao, trên 2 loại phương tiện, 1 bản ở nơi khác.</div>
<p class="pitfall">⚠️ FE25 câu 16: "Chiến lược dùng để sao lưu đĩa ra băng" — <strong>cả sao lưu vật lý lẫn logic</strong>.</p>`],
      [35, 'File System Backups (2)',
        `<p class="y-chinh">🎯 Figure 4-25: a file system to be dumped. Squares are directories, circles are files; each is labelled with its i-node number (1 is the root). The shaded items have been modified since the last dump: files 3, 8, 9, 17, 21, 24, 26 and directories 16, 20, 22.</p>
<p>The goal of an <strong>incremental logical dump</strong>: write to tape only what changed — but in a way that can be restored onto an <em>empty</em> disk. That forces a rule that surprises everyone: <strong>every directory on the path to a modified file must be dumped too</strong>, even if the directory itself did not change. Directory 7 has not changed, but files 8 and 9 below it have; to restore them, the restore program must first recreate directories 1, 5, 6 and 7 with the right names and attributes. Two more reasons: it lets you restore a single file, and directories carry attributes (owner, mode) that must be restored with them.</p>
<p>So the dumper needs two pieces of information per i-node: "modified since the last dump?" and "is it a directory on the way to something modified?". It keeps them in a <strong>bitmap indexed by i-node number</strong> — slide 36. ➕ GNU tar's incremental mode does exactly this on Linux:</p>
<div class="out"># Slides 34–36 with GNU tar: a full LOGICAL dump, then an incremental one that contains only what changed<br>
$ mkdir -p home/ast/src home/ast/docs home/jim<br>
$ echo "int main(){}" &gt; home/ast/src/main.c; echo "notes" &gt; home/ast/docs/notes.txt; echo "todo" &gt; home/jim/todo.txt<br>
# Monday: full dump (level 0); tar remembers what it saw in a snapshot file<br>
$ tar --create --file=monday-full.tar --listed-incremental=snapshot.snar home<br>
$ tar --list --file=monday-full.tar<br>
home/<br>
home/ast/<br>
home/ast/docs/<br>
home/ast/src/<br>
home/jim/<br>
home/ast/docs/notes.txt<br>
home/ast/src/main.c<br>
home/jim/todo.txt<br>
# Tuesday: one file changes, one file is added<br>
$ echo "int main(){ return 0; }" &gt; home/ast/src/main.c<br>
$ echo "report" &gt; home/jim/report.txt<br>
$ tar --create --file=tuesday-incr.tar --listed-incremental=snapshot.snar home<br>
# only the changed files — plus every DIRECTORY on the way to them (like Figure 4-26)<br>
$ tar --list --file=tuesday-incr.tar<br>
home/<br>
home/ast/<br>
home/ast/docs/<br>
home/ast/src/<br>
home/jim/<br>
home/ast/src/main.c<br>
home/jim/report.txt<br>
$ ls -l monday-full.tar tuesday-incr.tar | awk '{print $5, $NF}'<br>
10240 monday-full.tar<br>
10240 tuesday-incr.tar<br>
# a PHYSICAL dump would copy every block of the disk, used or not, e.g. dd if=/dev/sda of=disk.img</div>
<p>Tuesday's incremental archive holds only <code>main.c</code> and the new <code>report.txt</code> — plus every directory on the way (<code>home/</code>, <code>home/ast/</code>, <code>home/ast/src/</code>, <code>home/jim/</code>; tar stores the directory listings so it can also restore deletions). The snapshot file <code>snapshot.snar</code> plays the role of "the date of the last dump".</p>
<p class="meo">🧠 The book also warns about links (a file with two names must be restored once), holes in sparse files (do not write gigabytes of zeros) and special files such as named pipes, which must never be read during a dump.</p>`,
        `<p class="y-chinh">🎯 Hình 4-25: một hệ thống tệp sắp được sao lưu. Hình vuông là thư mục, hình tròn là tệp; mỗi cái ghi số i-node (1 là gốc). Các mục tô xám đã bị sửa từ lần sao lưu trước: tệp 3, 8, 9, 17, 21, 24, 26 và thư mục 16, 20, 22.</p>
<p>Mục tiêu của <strong>sao lưu logic gia tăng</strong>: chỉ ghi ra băng phần đã đổi — nhưng theo cách khôi phục được lên một đĩa <em>trống trơn</em>. Điều đó buộc phải có một luật làm ai cũng ngạc nhiên: <strong>mọi thư mục trên đường tới một tệp đã sửa cũng phải được sao lưu</strong>, kể cả khi bản thân thư mục không đổi. Thư mục 7 không đổi, nhưng tệp 8 và 9 bên dưới nó đã đổi; muốn khôi phục chúng, chương trình khôi phục phải dựng lại thư mục 1, 5, 6, 7 với đúng tên và thuộc tính trước. Thêm hai lý do: để khôi phục được một tệp lẻ, và vì thư mục mang thuộc tính (chủ, quyền) phải được khôi phục kèm.</p>
<p>Vậy chương trình sao lưu cần hai thông tin cho mỗi i-node: "đã sửa từ lần trước chưa?" và "có phải thư mục nằm trên đường tới thứ đã sửa không?". Nó giữ chúng trong một <strong>bitmap đánh chỉ số theo số i-node</strong> — slide 36. ➕ Chế độ gia tăng của GNU tar làm đúng như vậy trên Linux:</p>
<div class="out"># Slide 34–36 với GNU tar: một bản sao lưu LOGIC đầy đủ, rồi một bản gia tăng chỉ chứa phần đã đổi<br>
$ mkdir -p home/ast/src home/ast/docs home/jim<br>
$ echo "int main(){}" &gt; home/ast/src/main.c; echo "notes" &gt; home/ast/docs/notes.txt; echo "todo" &gt; home/jim/todo.txt<br>
# Thứ Hai: sao lưu đầy đủ (mức 0); tar ghi nhớ những gì đã thấy vào một tệp snapshot<br>
$ tar --create --file=monday-full.tar --listed-incremental=snapshot.snar home<br>
$ tar --list --file=monday-full.tar<br>
home/<br>
home/ast/<br>
home/ast/docs/<br>
home/ast/src/<br>
home/jim/<br>
home/ast/docs/notes.txt<br>
home/ast/src/main.c<br>
home/jim/todo.txt<br>
# Thứ Ba: một tệp đổi, một tệp được thêm<br>
$ echo "int main(){ return 0; }" &gt; home/ast/src/main.c<br>
$ echo "report" &gt; home/jim/report.txt<br>
$ tar --create --file=tuesday-incr.tar --listed-incremental=snapshot.snar home<br>
# chỉ các tệp đã đổi — cộng MỌI THƯ MỤC trên đường tới chúng (như Hình 4-26)<br>
$ tar --list --file=tuesday-incr.tar<br>
home/<br>
home/ast/<br>
home/ast/docs/<br>
home/ast/src/<br>
home/jim/<br>
home/ast/src/main.c<br>
home/jim/report.txt<br>
$ ls -l monday-full.tar tuesday-incr.tar | awk '{print $5, $NF}'<br>
10240 monday-full.tar<br>
10240 tuesday-incr.tar<br>
# sao lưu VẬT LÝ sẽ chép mọi khối của đĩa, dùng hay không, vd dd if=/dev/sda of=disk.img</div>
<p>Bản gia tăng ngày Thứ Ba chỉ chứa <code>main.c</code> và tệp mới <code>report.txt</code> — cộng mọi thư mục trên đường đi (<code>home/</code>, <code>home/ast/</code>, <code>home/ast/src/</code>, <code>home/jim/</code>; tar lưu cả danh sách mục của thư mục để còn khôi phục được việc xoá). Tệp snapshot <code>snapshot.snar</code> đóng vai "ngày của lần sao lưu trước".</p>
<p class="meo">🧠 Sách còn cảnh báo về liên kết (tệp có hai tên chỉ được khôi phục một lần), lỗ trong tệp thưa (đừng ghi hàng GB số 0) và tệp đặc biệt như named pipe, thứ không bao giờ được đọc trong lúc sao lưu.</p>`],
      [36, 'File System Backups (3)',
        `<p class="y-chinh">🎯 Figure 4-26: the bitmaps used by the logical dumping algorithm, one cell per i-node 1–32, after each of its phases: (a) phase 1, (b) phase 2, (c) phase 3, (d) phase 4.</p>
<p>The four phases, in the book's order. <strong>Phase 1</strong> walks the tree from the root and marks every <em>modified file</em> and <em>every directory</em> (modified or not). <strong>Phase 2</strong> walks the tree again and <em>unmarks</em> every directory that has nothing modified in or under it (10, 11, 14, 27, 29, 30). <strong>Phase 3</strong> scans the i-nodes in numerical order and dumps all marked directories, with their attributes. <strong>Phase 4</strong> dumps the marked files. The simulator runs the algorithm on the tree of Figure 4-25 and checks its four bitmaps against the slide, cell by cell:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bbad2e4c3a9cbbc3aa61a61dd8d71dfd2558c8cd.svg" alt="The four phases recomputed — identical to Figure 4-26" loading="lazy" /><p class="chu-thich">🧮 The four phases recomputed — identical to Figure 4-26</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CON = {                                          // directory → children (Figure 4-25)
  1: [2, 5, 16, 18, 27], 2: [3, 4], 5: [6], 6: [7, 10], 7: [8, 9], 10: [11, 14], 11: [12, 13], 14: [15],
  16: [17], 18: [19], 19: [20, 22], 20: [21], 22: [23], 23: [24, 25, 26], 27: [28, 29], 29: [30], 30: [31, 32],
};
const DA_SUA = new Set([3, 8, 9, 17, 21, 24, 26, 16, 20, 22]);
const laThuMuc = (i) =&gt; i in CON;
function dump() {
  const N = 32, pha = [];
  const dau = new Set();
  for (let i = 1; i &lt;= N; i++) if (laThuMuc(i) || DA_SUA.has(i)) dau.add(i);          // phase 1
  pha.push(new Set(dau));
  const giu = (d) =&gt; {                                 // phase 2: post-order — keep d if it or anything below is modified
    let co = DA_SUA.has(d);
    for (const c of CON[d]) co = (laThuMuc(c) ? giu(c) : dau.has(c)) || co;
    if (!co) dau.delete(d);
    return co;
  };
  giu(1);
  pha.push(new Set(dau));
  pha.push(new Set([...dau].filter(laThuMuc)));        // phase 3: directories, in i-node order
  pha.push(new Set([...dau].filter((i) =&gt; !laThuMuc(i))));   // phase 4: files
  return pha;
}</code></pre></details>
<p>Result: directories 1, 2, 5, 6, 7, 16, 18, 19, 20, 22, 23 go to tape first, then files 3, 8, 9, 17, 21, 24, 26. Note directory 2: it did not change, but file 3 below it did, so it stays marked. Dumping all the directories first means a restore can create the whole skeleton (with the right owners and modes) before any file arrives.</p>
<p class="meo">🧠 Restoring: first restore the most recent full dump onto an empty disk, then each incremental dump in order. Files deleted between dumps reappear — a known weakness the book mentions.</p>`,
        `<p class="y-chinh">🎯 Hình 4-26: các bitmap của thuật toán sao lưu logic, mỗi ô ứng với một i-node 1–32, sau từng pha: (a) pha 1, (b) pha 2, (c) pha 3, (d) pha 4.</p>
<p>Bốn pha, đúng thứ tự của sách. <strong>Pha 1</strong> duyệt cây từ gốc và đánh dấu mọi <em>tệp đã sửa</em> và <em>mọi thư mục</em> (sửa hay không). <strong>Pha 2</strong> duyệt cây lần nữa và <em>bỏ dấu</em> mọi thư mục không có gì đã sửa ở trong hay ở dưới nó (10, 11, 14, 27, 29, 30). <strong>Pha 3</strong> quét các i-node theo thứ tự số và sao lưu mọi thư mục còn dấu, kèm thuộc tính. <strong>Pha 4</strong> sao lưu các tệp còn dấu. Bộ mô phỏng chạy thuật toán trên cây của Hình 4-25 và so bốn bitmap với slide, từng ô một:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7a7f6e1964bf268e3cc9a3ef8ee5eb9cfd4f59f3.svg" alt="Bốn pha tính lại — giống hệt Hình 4-26" loading="lazy" /><p class="chu-thich">🧮 Bốn pha tính lại — giống hệt Hình 4-26</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CON = {                                          // thư mục → các con (Hình 4-25)
  1: [2, 5, 16, 18, 27], 2: [3, 4], 5: [6], 6: [7, 10], 7: [8, 9], 10: [11, 14], 11: [12, 13], 14: [15],
  16: [17], 18: [19], 19: [20, 22], 20: [21], 22: [23], 23: [24, 25, 26], 27: [28, 29], 29: [30], 30: [31, 32],
};
const DA_SUA = new Set([3, 8, 9, 17, 21, 24, 26, 16, 20, 22]);
const laThuMuc = (i) =&gt; i in CON;
function dump() {
  const N = 32, pha = [];
  const dau = new Set();
  for (let i = 1; i &lt;= N; i++) if (laThuMuc(i) || DA_SUA.has(i)) dau.add(i);          // pha 1
  pha.push(new Set(dau));
  const giu = (d) =&gt; {                                 // pha 2: duyệt sau — giữ d nếu nó hay thứ gì bên dưới đã sửa
    let co = DA_SUA.has(d);
    for (const c of CON[d]) co = (laThuMuc(c) ? giu(c) : dau.has(c)) || co;
    if (!co) dau.delete(d);
    return co;
  };
  giu(1);
  pha.push(new Set(dau));
  pha.push(new Set([...dau].filter(laThuMuc)));        // pha 3: thư mục, theo thứ tự i-node
  pha.push(new Set([...dau].filter((i) =&gt; !laThuMuc(i))));   // pha 4: tệp
  return pha;
}</code></pre></details>
<p>Kết quả: thư mục 1, 2, 5, 6, 7, 16, 18, 19, 20, 22, 23 ra băng trước, rồi tới tệp 3, 8, 9, 17, 21, 24, 26. Để ý thư mục 2: nó không đổi, nhưng tệp 3 bên dưới đổi, nên nó giữ dấu. Sao lưu mọi thư mục trước nghĩa là khi khôi phục, ta dựng được cả bộ khung (đúng chủ, đúng quyền) trước khi tệp nào tới.</p>
<p class="meo">🧠 Khôi phục: trước hết khôi phục bản đầy đủ gần nhất lên đĩa trống, rồi lần lượt từng bản gia tăng theo thứ tự. Tệp bị xoá giữa các lần sao lưu sẽ xuất hiện lại — một điểm yếu sách có nhắc.</p>`],
      [37, 'File System Consistency',
        `<p class="y-chinh">🎯 Figure 4-27: file-system states, shown as two counters per block (blocks 0–15): (a) <strong>consistent</strong>; (b) <strong>missing block</strong> (block 2 is in neither table); (c) <strong>duplicate block in the free list</strong> (block 4 counted twice as free); (d) <strong>duplicate data block</strong> (block 5 used by two files).</p>
<p>If the system crashes before all modified blocks are written, the file system can be inconsistent — worst when the lost blocks are i-node, directory or free-list blocks. A <strong>file-system checker</strong> (<code>fsck</code> on UNIX, <code>chkdsk</code>/<code>sfc</code> on Windows) checks two things. <strong>Blocks:</strong> it builds two tables of counters — how many times each block appears in a file (reading every i-node), and how many times it appears in the free list or bitmap. In a consistent system each block has exactly one 1. <strong>Files:</strong> it counts how many directory entries point to each i-node and compares with the link count stored in the i-node. The simulator builds the four states from real file block lists and classifies every block:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/06dd94359f29dc72a2bbd1976e5a6820a2f588d4.svg" alt="(b) block 2 is missing" loading="lazy" /><p class="chu-thich">🧮 (b) block 2 is missing</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TEP = { F1: [0, 1, 3], F2: [5, 6, 7, 8], F3: [11, 12, 13] };    // blocks of each file
const TRONG = [2, 4, 9, 10, 14, 15];                                  // the free list
function trangThai(bien) {
  const tep = JSON.parse(JSON.stringify(TEP)), trong = [...TRONG];
  if (bien === 'b') trong.splice(trong.indexOf(2), 1);                // block 2 dropped from the free list
  if (bien === 'c') trong.push(4);                                     // block 4 listed twice
  if (bien === 'd') tep.F3.push(5);                                    // block 5 also claimed by F3
  const dung = Array(16).fill(0), tr = Array(16).fill(0);
  for (const ds of Object.values(tep)) for (const b of ds) dung[b]++;   // count "in use"
  for (const b of trong) tr[b]++;                                      // count "free"
  const loi = [];
  for (let b = 0; b &lt; 16; b++) {
    if (dung[b] + tr[b] === 0) loi.push([b, 'mat']);                   // missing ⇒ add to free list
    else if (tr[b] &gt; 1) loi.push([b, 'trong2']);                       // duplicate free ⇒ rebuild free list
    else if (dung[b] &gt; 1) loi.push([b, 'dung2']);                      // duplicate data ⇒ copy block, give one file the copy
    else if (dung[b] === 1 &amp;&amp; tr[b] === 1) loi.push([b, 'ca-hai']);    // used AND free ⇒ remove from free list
  }
  return { dung, tr, loi };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fb6cd9e12725b41243cb994dbdde58b0a3a7a600.svg" alt="(d) block 5 belongs to two files" loading="lazy" /><p class="chu-thich">🧮 (d) block 5 belongs to two files</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const TEP = { F1: [0, 1, 3], F2: [5, 6, 7, 8], F3: [11, 12, 13] };    // blocks of each file
const TRONG = [2, 4, 9, 10, 14, 15];                                  // the free list
function trangThai(bien) {
  const tep = JSON.parse(JSON.stringify(TEP)), trong = [...TRONG];
  if (bien === 'b') trong.splice(trong.indexOf(2), 1);                // block 2 dropped from the free list
  if (bien === 'c') trong.push(4);                                     // block 4 listed twice
  if (bien === 'd') tep.F3.push(5);                                    // block 5 also claimed by F3
  const dung = Array(16).fill(0), tr = Array(16).fill(0);
  for (const ds of Object.values(tep)) for (const b of ds) dung[b]++;   // count "in use"
  for (const b of trong) tr[b]++;                                      // count "free"
  const loi = [];
  for (let b = 0; b &lt; 16; b++) {
    if (dung[b] + tr[b] === 0) loi.push([b, 'mat']);                   // missing ⇒ add to free list
    else if (tr[b] &gt; 1) loi.push([b, 'trong2']);                       // duplicate free ⇒ rebuild free list
    else if (dung[b] &gt; 1) loi.push([b, 'dung2']);                      // duplicate data ⇒ copy block, give one file the copy
    else if (dung[b] === 1 &amp;&amp; tr[b] === 1) loi.push([b, 'ca-hai']);    // used AND free ⇒ remove from free list
  }
  return { dung, tr, loi };
}</code></pre></details>
<p>The repairs: missing block → <strong>add it to the free list</strong>; duplicate in the free list → <strong>rebuild the free list</strong>; duplicate data block → <strong>allocate a free block, copy block 5 into it, and give the copy to one file</strong> (and report it — one file is probably garbled). Link count too <em>high</em> → wasted space only; too <em>low</em> → dangerous (the i-node would be freed while a directory still points to it), so fsck sets it to the counted value. ➕ All three repairs, really done by e2fsck on an ext2 image damaged on purpose with debugfs:</p>
<div class="out"># Slide 37 for real: damage an ext2 image on purpose, then let e2fsck find and repair each problem<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ echo "file one" &gt; one.txt; echo "file two" &gt; two.txt<br>
$ debugfs -w -R "write one.txt one.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
$ debugfs -w -R "write two.txt two.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 13<br>
$ debugfs -R "blocks one.txt" fs.img 2&gt;/dev/null<br>
290<br>
$ debugfs -R "blocks two.txt" fs.img 2&gt;/dev/null<br>
291<br>
# damage 1 — a MISSING block: mark free block 3000 "in use" although no file owns it<br>
$ debugfs -w -R "setb 3000" fs.img 2&gt;/dev/null<br>
# damage 2 — a DUPLICATE data block: make two.txt point at one.txt's block 290<br>
$ debugfs -w -R "sif two.txt block[0] 290" fs.img 2&gt;/dev/null<br>
# damage 3 — a wrong LINK COUNT in an i-node: one.txt claims 5 links, but only one directory entry exists<br>
$ debugfs -w -R "sif one.txt links_count 5" fs.img 2&gt;/dev/null<br>
$ e2fsck -fy fs.img 2&gt;&amp;1 | grep -v '^e2fsck'<br>
Pass 1: Checking inodes, blocks, and sizes<br>
<br>
Running additional passes to resolve blocks claimed by more than one inode...<br>
Pass 1B: Rescanning for multiply-claimed blocks<br>
Multiply-claimed block(s) in inode 12: 290<br>
Multiply-claimed block(s) in inode 13: 290<br>
Pass 1C: Scanning directories for inodes with multiply-claimed blocks<br>
Pass 1D: Reconciling multiply-claimed blocks<br>
(There are 2 inodes containing multiply-claimed blocks.)<br>
<br>
File /one.txt (inode #12, mod time Mon Oct 26 01:23:43 2026)<br>
&nbsp;&nbsp;has 1 multiply-claimed block(s), shared with 1 file(s):<br>
	/two.txt (inode #13, mod time Mon Oct 26 01:23:43 2026)<br>
Clone multiply-claimed blocks? yes<br>
<br>
File /two.txt (inode #13, mod time Mon Oct 26 01:23:43 2026)<br>
&nbsp;&nbsp;has 1 multiply-claimed block(s), shared with 1 file(s):<br>
	/one.txt (inode #12, mod time Mon Oct 26 01:23:43 2026)<br>
Multiply-claimed blocks already reassigned or cloned.<br>
<br>
Pass 2: Checking directory structure<br>
Pass 3: Checking directory connectivity<br>
Pass 4: Checking reference counts<br>
Inode 12 ref count is 5, should be 1. &nbsp;Fix? yes<br>
<br>
Pass 5: Checking group summary information<br>
Block bitmap differences: &nbsp;-3000<br>
Fix? yes<br>
<br>
<br>
fs.img: ***** FILE SYSTEM WAS MODIFIED *****<br>
fs.img: 13/1024 files (0.0% non-contiguous), 292/4096 blocks<br>
# after the repair each file has its OWN block again; the cloned copy still holds one.txt's bytes<br>
$ debugfs -R "blocks one.txt" fs.img 2&gt;/dev/null<br>
291<br>
$ debugfs -R "blocks two.txt" fs.img 2&gt;/dev/null<br>
290<br>
$ debugfs -R "cat two.txt" fs.img 2&gt;/dev/null<br>
file one</div>
<p>Pass 1B finds block 290 claimed by i-nodes 12 and 13 and <strong>clones</strong> it — one.txt gets a fresh block 291 holding the same bytes ("file one"), exactly the book's repair. Pass 4 fixes the link count 5 → 1. Pass 5 finds block 3000 marked in use but owned by nothing (<code>-3000</code>) and frees it.</p>
<p class="pitfall">⚠️ FE21 question 34: the solution for the "missing block" problem — <strong>the checker adds the missing blocks to the free list</strong>. Know which fix goes with which state: rebuild the free list is for (c), copy-the-block is for (d).</p>`,
        `<p class="y-chinh">🎯 Hình 4-27: các trạng thái hệ thống tệp, vẽ thành hai bộ đếm cho mỗi khối (khối 0–15): (a) <strong>nhất quán</strong>; (b) <strong>khối mất tích (missing block)</strong> — khối 2 không có mặt ở bảng nào; (c) <strong>khối trùng trong danh sách trống</strong> — khối 4 được đếm trống hai lần; (d) <strong>khối dữ liệu trùng</strong> — khối 5 bị hai tệp cùng dùng.</p>
<p>Nếu máy sập trước khi mọi khối đã sửa được ghi xuống, hệ thống tệp có thể không nhất quán — tệ nhất khi các khối bị mất là khối i-node, thư mục hay danh sách khối trống. Một <strong>bộ kiểm tra hệ thống tệp</strong> (<code>fsck</code> trên UNIX, <code>chkdsk</code>/<code>sfc</code> trên Windows) kiểm hai thứ. <strong>Khối:</strong> nó dựng hai bảng đếm — mỗi khối xuất hiện bao nhiêu lần trong một tệp (đọc mọi i-node), và bao nhiêu lần trong danh sách trống hay bitmap. Ở hệ nhất quán, mỗi khối có đúng một số 1. <strong>Tệp:</strong> nó đếm số mục thư mục trỏ tới mỗi i-node và so với số liên kết ghi trong i-node. Bộ mô phỏng dựng bốn trạng thái từ danh sách khối thật của các tệp rồi phân loại từng khối:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ae08b4341145f3ac13572f3239c1d5ad67c8b9c9.svg" alt="(b) khối 2 mất tích" loading="lazy" /><p class="chu-thich">🧮 (b) khối 2 mất tích</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TEP = { F1: [0, 1, 3], F2: [5, 6, 7, 8], F3: [11, 12, 13] };    // các khối của từng tệp
const TRONG = [2, 4, 9, 10, 14, 15];                                  // danh sách khối trống
function trangThai(bien) {
  const tep = JSON.parse(JSON.stringify(TEP)), trong = [...TRONG];
  if (bien === 'b') trong.splice(trong.indexOf(2), 1);                // khối 2 rơi khỏi danh sách trống
  if (bien === 'c') trong.push(4);                                     // khối 4 ghi hai lần
  if (bien === 'd') tep.F3.push(5);                                    // khối 5 cũng bị F3 nhận
  const dung = Array(16).fill(0), tr = Array(16).fill(0);
  for (const ds of Object.values(tep)) for (const b of ds) dung[b]++;   // đếm "đang dùng"
  for (const b of trong) tr[b]++;                                      // đếm "trống"
  const loi = [];
  for (let b = 0; b &lt; 16; b++) {
    if (dung[b] + tr[b] === 0) loi.push([b, 'mat']);                   // mất tích ⇒ thêm vào danh sách trống
    else if (tr[b] &gt; 1) loi.push([b, 'trong2']);                       // trùng trong danh sách trống ⇒ dựng lại danh sách
    else if (dung[b] &gt; 1) loi.push([b, 'dung2']);                      // trùng dữ liệu ⇒ chép khối, cho một tệp bản sao
    else if (dung[b] === 1 &amp;&amp; tr[b] === 1) loi.push([b, 'ca-hai']);    // vừa dùng vừa trống ⇒ gỡ khỏi danh sách trống
  }
  return { dung, tr, loi };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d97f1829b17955f4ad7fd3bab72aeb482c908113.svg" alt="(d) khối 5 thuộc về hai tệp" loading="lazy" /><p class="chu-thich">🧮 (d) khối 5 thuộc về hai tệp</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const TEP = { F1: [0, 1, 3], F2: [5, 6, 7, 8], F3: [11, 12, 13] };    // các khối của từng tệp
const TRONG = [2, 4, 9, 10, 14, 15];                                  // danh sách khối trống
function trangThai(bien) {
  const tep = JSON.parse(JSON.stringify(TEP)), trong = [...TRONG];
  if (bien === 'b') trong.splice(trong.indexOf(2), 1);                // khối 2 rơi khỏi danh sách trống
  if (bien === 'c') trong.push(4);                                     // khối 4 ghi hai lần
  if (bien === 'd') tep.F3.push(5);                                    // khối 5 cũng bị F3 nhận
  const dung = Array(16).fill(0), tr = Array(16).fill(0);
  for (const ds of Object.values(tep)) for (const b of ds) dung[b]++;   // đếm "đang dùng"
  for (const b of trong) tr[b]++;                                      // đếm "trống"
  const loi = [];
  for (let b = 0; b &lt; 16; b++) {
    if (dung[b] + tr[b] === 0) loi.push([b, 'mat']);                   // mất tích ⇒ thêm vào danh sách trống
    else if (tr[b] &gt; 1) loi.push([b, 'trong2']);                       // trùng trong danh sách trống ⇒ dựng lại danh sách
    else if (dung[b] &gt; 1) loi.push([b, 'dung2']);                      // trùng dữ liệu ⇒ chép khối, cho một tệp bản sao
    else if (dung[b] === 1 &amp;&amp; tr[b] === 1) loi.push([b, 'ca-hai']);    // vừa dùng vừa trống ⇒ gỡ khỏi danh sách trống
  }
  return { dung, tr, loi };
}</code></pre></details>
<p>Cách sửa: khối mất tích → <strong>thêm vào danh sách trống</strong>; trùng trong danh sách trống → <strong>dựng lại danh sách trống</strong>; khối dữ liệu trùng → <strong>cấp một khối trống, chép khối 5 sang đó, và cho một tệp giữ bản sao</strong> (kèm báo lỗi — nhiều khả năng một tệp đã bị hỏng nội dung). Số liên kết <em>cao</em> quá → chỉ phí chỗ; <em>thấp</em> quá → nguy hiểm (i-node sẽ bị giải phóng trong khi thư mục vẫn trỏ tới), nên fsck đặt lại bằng số đếm được. ➕ Cả ba cách sửa, do e2fsck làm thật trên một ảnh ext2 bị debugfs cố ý làm hỏng:</p>
<div class="out"># Slide 37 chạy thật: cố ý làm hỏng một ảnh ext2, rồi để e2fsck tìm và sửa từng lỗi<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ echo "file one" &gt; one.txt; echo "file two" &gt; two.txt<br>
$ debugfs -w -R "write one.txt one.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
$ debugfs -w -R "write two.txt two.txt" fs.img 2&gt;/dev/null<br>
Allocated inode: 13<br>
$ debugfs -R "blocks one.txt" fs.img 2&gt;/dev/null<br>
290<br>
$ debugfs -R "blocks two.txt" fs.img 2&gt;/dev/null<br>
291<br>
# hỏng 1 — khối MẤT TÍCH: đánh dấu khối trống 3000 là "đang dùng" dù không tệp nào sở hữu<br>
$ debugfs -w -R "setb 3000" fs.img 2&gt;/dev/null<br>
# hỏng 2 — khối dữ liệu TRÙNG: cho two.txt trỏ vào khối 290 của one.txt<br>
$ debugfs -w -R "sif two.txt block[0] 290" fs.img 2&gt;/dev/null<br>
# hỏng 3 — SỐ LIÊN KẾT sai trong i-node: one.txt khai 5 liên kết, nhưng chỉ có một mục thư mục<br>
$ debugfs -w -R "sif one.txt links_count 5" fs.img 2&gt;/dev/null<br>
$ e2fsck -fy fs.img 2&gt;&amp;1 | grep -v '^e2fsck'<br>
Pass 1: Checking inodes, blocks, and sizes<br>
<br>
Running additional passes to resolve blocks claimed by more than one inode...<br>
Pass 1B: Rescanning for multiply-claimed blocks<br>
Multiply-claimed block(s) in inode 12: 290<br>
Multiply-claimed block(s) in inode 13: 290<br>
Pass 1C: Scanning directories for inodes with multiply-claimed blocks<br>
Pass 1D: Reconciling multiply-claimed blocks<br>
(There are 2 inodes containing multiply-claimed blocks.)<br>
<br>
File /one.txt (inode #12, mod time Mon Oct 26 01:23:43 2026)<br>
&nbsp;&nbsp;has 1 multiply-claimed block(s), shared with 1 file(s):<br>
	/two.txt (inode #13, mod time Mon Oct 26 01:23:43 2026)<br>
Clone multiply-claimed blocks? yes<br>
<br>
File /two.txt (inode #13, mod time Mon Oct 26 01:23:43 2026)<br>
&nbsp;&nbsp;has 1 multiply-claimed block(s), shared with 1 file(s):<br>
	/one.txt (inode #12, mod time Mon Oct 26 01:23:43 2026)<br>
Multiply-claimed blocks already reassigned or cloned.<br>
<br>
Pass 2: Checking directory structure<br>
Pass 3: Checking directory connectivity<br>
Pass 4: Checking reference counts<br>
Inode 12 ref count is 5, should be 1. &nbsp;Fix? yes<br>
<br>
Pass 5: Checking group summary information<br>
Block bitmap differences: &nbsp;-3000<br>
Fix? yes<br>
<br>
<br>
fs.img: ***** FILE SYSTEM WAS MODIFIED *****<br>
fs.img: 13/1024 files (0.0% non-contiguous), 292/4096 blocks<br>
# sau khi sửa mỗi tệp lại có khối RIÊNG; bản nhân đôi vẫn mang nội dung của one.txt<br>
$ debugfs -R "blocks one.txt" fs.img 2&gt;/dev/null<br>
291<br>
$ debugfs -R "blocks two.txt" fs.img 2&gt;/dev/null<br>
290<br>
$ debugfs -R "cat two.txt" fs.img 2&gt;/dev/null<br>
file one</div>
<p>Pass 1B thấy khối 290 bị i-node 12 và 13 cùng nhận và <strong>nhân bản</strong> nó — one.txt được một khối mới 291 mang cùng nội dung ("file one"), đúng cách sửa của sách. Pass 4 sửa số liên kết 5 → 1. Pass 5 thấy khối 3000 bị đánh dấu đang dùng mà không ai sở hữu (<code>-3000</code>) và giải phóng nó.</p>
<p class="pitfall">⚠️ FE21 câu 34: cách giải quyết "khối mất tích" — <strong>bộ kiểm tra thêm các khối mất tích vào danh sách trống</strong>. Nhớ cách sửa nào đi với trạng thái nào: dựng lại danh sách trống là cho (c), chép khối là cho (d).</p>`],
      [38, 'File System Performance (1)',
        `<p class="y-chinh">🎯 Figure 4-28: the <strong>buffer cache</strong> data structures — a <strong>hash table</strong> (hashed on device and block number) for fast lookup, and a <strong>doubly linked list</strong> of all cached blocks ordered by use, from the front (least recently used, LRU) to the rear (most recently used, MRU).</p>
<p>Reading a word from memory takes nanoseconds; reading a block from a hard disk takes milliseconds — about a million times longer (Chapter 1, slide 14). So file systems keep a <strong>block cache</strong> (buffer cache): a set of disk blocks kept in RAM. On every read request the OS hashes (device, block) to see whether the block is cached; a hit costs no disk access. On a miss it reads the block into the cache, and if the cache is full it must evict one — the page-replacement problem of Chapter 3 again, but here exact <strong>LRU is affordable</strong> because cache references are rare (one per read call, not one per instruction), so the list can be updated on every access.</p>
<p>➕ Linux merged the buffer cache into the <strong>page cache</strong> (all free RAM is used to cache file pages). Measured: read a 100 MB file just after mounting (nothing cached), then again:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 4-28 today: Linux keeps recently read blocks in the PAGE CACHE (in RAM)<br>
$ mkfs.ext4 -q disk.img 256M &amp;&amp; mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
Creating regular file disk.img<br>
$ head -c 100M /dev/urandom &gt; /mnt/d/data.bin<br>
# unmount + mount again: the kernel drops every cached block of this file system<br>
$ umount /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
$ c0=$(awk '/^Cached:/ {print $2}' /proc/meminfo)<br>
$ t0=$(date +%s%N); cat /mnt/d/data.bin &gt; /dev/null; t1=$(date +%s%N)<br>
$ c1=$(awk '/^Cached:/ {print $2}' /proc/meminfo)<br>
$ cat /mnt/d/data.bin &gt; /dev/null; t2=$(date +%s%N)<br>
$ echo "first read: $(( 100 * 1000000000 / (t1 - t0) )) MB/s &nbsp;&nbsp;(from the disk)"<br>
first read: 751 MB/s &nbsp;&nbsp;(from the disk)<br>
$ echo "second read: $(( 100 * 1000000000 / (t2 - t1) )) MB/s &nbsp;&nbsp;(from the cache)"<br>
second read: 9502 MB/s &nbsp;&nbsp;(from the cache)<br>
$ echo "cached grew by $(( (c1 - c0) / 1024 )) MB"<br>
cached grew by 135 MB<br>
$ umount /mnt/d</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The second read is an order of magnitude faster — it never touched the "disk". The cache grew by more than the 100 MB file itself (135 MB in the run shown): part of the data is cached twice, once as pages of <code>data.bin</code> in the ext4 file system and once as pages of <code>disk.img</code>, the file behind the loop device — the VFS layers really are stacked. (Numbers vary from run to run; the property checked is that the second read is faster and the cache grew by at least 80 MB.)</p>
<div class="callout">🧭 <strong>On a real server:</strong> this is why PostgreSQL's <code>shared_buffers</code> is usually set to only about 25% of RAM — the OS page cache is the second-level cache for the database files — and why "free" memory on a busy Linux server looks almost zero: it is used as cache and released on demand.</div>`,
        `<p class="y-chinh">🎯 Hình 4-28: cấu trúc dữ liệu của <strong>bộ đệm khối (buffer cache)</strong> — một <strong>bảng băm</strong> (băm theo thiết bị và số hiệu khối) để tra nhanh, và một <strong>danh sách liên kết đôi</strong> chứa mọi khối đang được đệm, sắp theo lúc dùng, từ đầu (dùng lâu nhất, LRU) tới cuối (vừa dùng nhất, MRU).</p>
<p>Đọc một từ trong bộ nhớ mất vài nano giây; đọc một khối từ đĩa cứng mất vài mili giây — lâu hơn khoảng một triệu lần (Chương 1, slide 14). Nên hệ thống tệp giữ một <strong>bộ đệm khối</strong>: một tập khối đĩa nằm trong RAM. Mỗi yêu cầu đọc, HĐH băm (thiết bị, khối) để xem khối có trong bộ đệm chưa; trúng thì không tốn lần truy cập đĩa nào. Trượt thì đọc khối vào bộ đệm, và nếu bộ đệm đầy phải đuổi một khối — lại là bài toán thay trang của Chương 3, nhưng ở đây <strong>LRU chính xác là làm được</strong> vì tham chiếu tới bộ đệm hiếm (mỗi lời gọi read một lần, không phải mỗi lệnh máy một lần), nên cập nhật danh sách ở mọi lần truy cập cũng không sao.</p>
<p>➕ Linux đã gộp buffer cache vào <strong>page cache</strong> (mọi phần RAM rảnh đều dùng để đệm các trang của tệp). Đo thật: đọc một tệp 100 MB ngay sau khi mount (chưa có gì trong bộ đệm), rồi đọc lại:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 4-28 ngày nay: Linux giữ các khối vừa đọc trong PAGE CACHE (trong RAM)<br>
$ mkfs.ext4 -q disk.img 256M &amp;&amp; mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
Creating regular file disk.img<br>
$ head -c 100M /dev/urandom &gt; /mnt/d/data.bin<br>
# gỡ + gắn lại: nhân bỏ mọi khối đã cache của hệ thống tệp này<br>
$ umount /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
$ c0=$(awk '/^Cached:/ {print $2}' /proc/meminfo)<br>
$ t0=$(date +%s%N); cat /mnt/d/data.bin &gt; /dev/null; t1=$(date +%s%N)<br>
$ c1=$(awk '/^Cached:/ {print $2}' /proc/meminfo)<br>
$ cat /mnt/d/data.bin &gt; /dev/null; t2=$(date +%s%N)<br>
$ echo "first read: $(( 100 * 1000000000 / (t1 - t0) )) MB/s &nbsp;&nbsp;(from the disk)"<br>
first read: 751 MB/s &nbsp;&nbsp;(from the disk)<br>
$ echo "second read: $(( 100 * 1000000000 / (t2 - t1) )) MB/s &nbsp;&nbsp;(from the cache)"<br>
second read: 9502 MB/s &nbsp;&nbsp;(from the cache)<br>
$ echo "cached grew by $(( (c1 - c0) / 1024 )) MB"<br>
cached grew by 135 MB<br>
$ umount /mnt/d</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Lần đọc thứ hai nhanh hơn cả một bậc — nó không hề chạm tới "đĩa". Bộ đệm tăng nhiều hơn chính tệp 100 MB (135 MB ở lần chạy trên): một phần dữ liệu được đệm hai lần, một lần là các trang của <code>data.bin</code> trong hệ thống tệp ext4 và một lần là các trang của <code>disk.img</code>, tệp nằm sau thiết bị loop — các tầng VFS đúng là chồng lên nhau. (Số đo đổi mỗi lần chạy; tính chất được kiểm là lần đọc thứ hai nhanh hơn và bộ đệm tăng ít nhất 80 MB.)</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> đây là lý do <code>shared_buffers</code> của PostgreSQL thường chỉ đặt khoảng 25% RAM — page cache của HĐH là bộ đệm tầng hai cho các tệp dữ liệu — và lý do bộ nhớ "free" trên một máy chủ Linux bận rộn trông gần như bằng 0: nó đang được dùng làm bộ đệm và sẽ được nhả ra khi cần.</div>`],
      [39, 'File System Performance (2)',
        `<p class="y-chinh">🎯 Some blocks are rarely referenced twice within a short interval. This leads to a <strong>modified LRU</strong> scheme that takes two factors into account: (1) is the block likely to be needed again soon? (2) is the block essential to the consistency of the file system?</p>
<p>Pure LRU is undesirable for a file system: if an i-node block is modified and stays at the MRU end for a long time, a crash will lose it and corrupt the file system. So blocks are divided into categories — i-node blocks, indirect blocks, directory blocks, full data blocks, partly full data blocks. Blocks not likely to be needed soon (a full data block just written) go to the <strong>front</strong> of the list, to be reused quickly; blocks likely needed again (a partly full block being written) go to the rear. And any block essential to consistency (anything except data blocks) that has been modified is <strong>written to disk immediately</strong>.</p>
<p>Even so, data must not stay in the cache too long. UNIX runs <code>sync</code> every 30 seconds (the "update" daemon) — a crash loses at most 30 seconds of work. Old Windows (MS-DOS/FAT) used a <strong>write-through cache</strong>: every modified block is written to disk at once, safe for removable floppies but costing more I/O. The book adds <strong>block read-ahead</strong>: when a file is read sequentially, fetch block k + 1 before it is asked for. ➕ Linux today:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Slide 39: writes go to the cache first ("dirty" blocks) and reach the disk later — or when you call sync<br>
# a dirty block older than 30 s (3000 centiseconds) is written back by the flusher thread, which wakes every N centiseconds (kernel default 500; this VM uses 1500)<br>
$ cat /proc/sys/vm/dirty_expire_centisecs /proc/sys/vm/dirty_writeback_centisecs<br>
3000<br>
1500<br>
$ mkfs.ext4 -q disk.img 256M &amp;&amp; mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
Creating regular file disk.img<br>
$ head -c 60M /dev/urandom &gt; /mnt/d/log.bin<br>
$ echo "Dirty before sync: $(awk '/^Dirty:/ {print $2}' /proc/meminfo) kB"<br>
Dirty before sync: 70880 kB<br>
$ sync<br>
$ echo "Dirty after sync: $(awk '/^Dirty:/ {print $2}' /proc/meminfo) kB"<br>
Dirty after sync: 144 kB<br>
# block read-ahead: when a file is read sequentially, the kernel fetches this many KB ahead<br>
$ cat /sys/block/$(basename $(findmnt -n -o SOURCE /mnt/d))/queue/read_ahead_kb<br>
128<br>
$ umount /mnt/d</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>A dirty page older than 3000 centiseconds (30 s — the classic UNIX interval) is written back by the kernel's flusher threads, which wake every 500 centiseconds by default (this VM is configured with 1500). Writing 60 MB leaves tens of megabytes of <code>Dirty</code> memory (the file plus metadata — about 70 MB in the run shown); <code>sync</code> forces it to the disk and Dirty drops to almost nothing. Read-ahead for the loop device is 128 KB.</p>
<div class="callout">🧭 <strong>On a real server:</strong> "written" ≠ "on disk". A database cannot rely on the 30-second writeback: PostgreSQL calls <code>fsync()</code> on its WAL at every commit (setting <code>synchronous_commit</code>), and in 2018 a famous bug report ("fsyncgate") showed what happens when an <code>fsync</code> error is ignored — the data is silently lost.</div>
<p class="pitfall">⚠️ FE20 question 22 / FE22 question 16: "Increasing file-system performance is implemented by ___" — <strong>all of the other choices</strong> (buffer cache, block read-ahead, defragmenting disks).</p>`,
        `<p class="y-chinh">🎯 Có những khối hiếm khi được tham chiếu hai lần trong một khoảng ngắn. Điều đó dẫn tới một phương án <strong>LRU cải tiến</strong> tính đến hai yếu tố: (1) khối có khả năng sắp được dùng lại không? (2) khối có thiết yếu cho tính nhất quán của hệ thống tệp không?</p>
<p>LRU thuần không hợp với hệ thống tệp: nếu một khối i-node bị sửa và nằm ở đầu MRU rất lâu, một lần sập sẽ làm mất nó và hỏng cả hệ thống tệp. Nên khối được chia loại — khối i-node, khối gián tiếp, khối thư mục, khối dữ liệu đầy, khối dữ liệu đầy một phần. Khối ít khả năng sớm cần lại (một khối dữ liệu đầy vừa ghi xong) được đặt ở <strong>đầu</strong> danh sách, để sớm được dùng lại; khối có khả năng cần lại (khối đang ghi dở) đặt ở cuối. Và mọi khối thiết yếu cho tính nhất quán (mọi thứ trừ khối dữ liệu) hễ bị sửa là được <strong>ghi xuống đĩa ngay</strong>.</p>
<p>Dù vậy, dữ liệu cũng không được nằm trong bộ đệm quá lâu. UNIX chạy <code>sync</code> mỗi 30 giây (tiến trình nền "update") — sập máy thì mất tối đa 30 giây công việc. Windows xưa (MS-DOS/FAT) dùng <strong>bộ đệm ghi xuyên (write-through)</strong>: khối nào bị sửa là ghi xuống đĩa ngay, an toàn cho đĩa mềm rút ra cắm vào nhưng tốn nhiều I/O hơn. Sách thêm <strong>đọc trước khối (block read-ahead)</strong>: khi tệp được đọc tuần tự, nạp sẵn khối k + 1 trước khi được hỏi tới. ➕ Linux ngày nay:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Slide 39: lệnh ghi vào cache trước (khối "bẩn") và tới đĩa sau — hoặc khi bạn gọi sync<br>
# khối bẩn cũ hơn 30 giây (3000 phần trăm giây) được luồng flusher ghi xuống; luồng này thức dậy mỗi N phần trăm giây (mặc định của nhân 500; máy ảo này đặt 1500)<br>
$ cat /proc/sys/vm/dirty_expire_centisecs /proc/sys/vm/dirty_writeback_centisecs<br>
3000<br>
1500<br>
$ mkfs.ext4 -q disk.img 256M &amp;&amp; mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
Creating regular file disk.img<br>
$ head -c 60M /dev/urandom &gt; /mnt/d/log.bin<br>
$ echo "Dirty before sync: $(awk '/^Dirty:/ {print $2}' /proc/meminfo) kB"<br>
Dirty before sync: 70880 kB<br>
$ sync<br>
$ echo "Dirty after sync: $(awk '/^Dirty:/ {print $2}' /proc/meminfo) kB"<br>
Dirty after sync: 144 kB<br>
# đọc trước khối: khi tệp được đọc tuần tự, nhân nạp trước chừng này KB<br>
$ cat /sys/block/$(basename $(findmnt -n -o SOURCE /mnt/d))/queue/read_ahead_kb<br>
128<br>
$ umount /mnt/d</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Trang bẩn cũ hơn 3000 phần trăm giây (30 giây — đúng khoảng thời gian UNIX kinh điển) được các luồng flusher của nhân ghi xuống; chúng thức dậy mặc định mỗi 500 phần trăm giây (máy ảo này cấu hình 1500). Ghi 60 MB để lại hàng chục MB bộ nhớ <code>Dirty</code> (tệp cộng siêu dữ liệu — khoảng 70 MB ở lần chạy trên); <code>sync</code> ép nó xuống đĩa và Dirty tụt về gần bằng 0. Đọc trước của thiết bị loop là 128 KB.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> "đã ghi" ≠ "đã nằm trên đĩa". Cơ sở dữ liệu không thể trông vào chu kỳ ghi 30 giây: PostgreSQL gọi <code>fsync()</code> cho WAL ở mỗi lần commit (tham số <code>synchronous_commit</code>), và năm 2018 một báo cáo lỗi nổi tiếng ("fsyncgate") cho thấy chuyện gì xảy ra khi lỗi của <code>fsync</code> bị bỏ qua — dữ liệu mất mà không ai hay.</div>
<p class="pitfall">⚠️ FE20 câu 22 / FE22 câu 16: "Tăng hiệu năng hệ thống tệp được làm bằng ___" — <strong>tất cả các phương án còn lại</strong> (bộ đệm khối, đọc trước khối, chống phân mảnh đĩa).</p>`],
      [40, 'Reducing Disk Arm Motion',
        `<p class="y-chinh">🎯 Figure 4-29: (a) i-nodes placed at the start of the disk; (b) the disk divided into <strong>cylinder groups</strong>, each with its own blocks and i-nodes.</p>
<p>Caching reduces the <em>number</em> of disk accesses; placement reduces the <em>cost</em> of each one. In (a), reading a file means a seek to the i-node area at the start of the disk and then a long seek to the data — on average half the disk. Better: put the i-nodes in the middle, or — the Berkeley Fast File System (1984) idea — split the disk into <strong>cylinder groups</strong>, each with its own superblock copy, i-nodes and free-block bitmap, and allocate a file's blocks in the same group as its i-node. Also: allocate blocks that will be read in sequence in <strong>consecutive</strong> positions (the bitmap makes "find a free block near block k" easy, slide 31), and allocate in groups of blocks.</p>
<p>➕ ext2/ext3/ext4 call them <strong>block groups</strong> (32,768 blocks = 128 MB each with 4 KB blocks). On ext2 each group has its own i-node table right at its start; ext4 adds <strong>flex_bg</strong>, gathering the bitmaps and i-node tables of 16 groups into the first one (fewer seeks to read metadata, long free runs for big files):</p>
<div class="out"># Figure 4-29(b) today: ext2/ext3/ext4 split the disk into BLOCK GROUPS (the BSD "cylinder groups"), each with its own bitmaps and i-node table<br>
$ mkfs.ext2 -q -b 4096 disk2.img 512M<br>
Creating regular file disk2.img<br>
$ dumpe2fs disk2.img 2&gt;/dev/null | grep -E '^Group [0-3]:|Inode table at' | head -8<br>
Group 0: (Blocks 0-32767)<br>
&nbsp;&nbsp;Inode table at 35-546 (+35)<br>
Group 1: (Blocks 32768-65535)<br>
&nbsp;&nbsp;Inode table at 32803-33314 (+35)<br>
Group 2: (Blocks 65536-98303)<br>
&nbsp;&nbsp;Inode table at 65538-66049 (+2)<br>
Group 3: (Blocks 98304-131071)<br>
&nbsp;&nbsp;Inode table at 98339-98850 (+35)<br>
# ext4's flex_bg gathers the bitmaps and i-node tables of 16 groups into the first one (fewer seeks when reading metadata, long free runs for big files)<br>
$ mkfs.ext4 -q -b 4096 disk4.img 512M<br>
Creating regular file disk4.img<br>
$ dumpe2fs disk4.img 2&gt;/dev/null | grep -E '^Group [0-3]:|Inode table at' | head -8<br>
Group 0: (Blocks 0-32767) csum 0xe301<br>
&nbsp;&nbsp;Inode table at 73-584 (+73)<br>
Group 1: (Blocks 32768-65535) csum 0xbc5c [INODE_UNINIT, BLOCK_UNINIT]<br>
&nbsp;&nbsp;Inode table at 585-1096 (bg #0 + 585)<br>
Group 2: (Blocks 65536-98303) csum 0x282f [INODE_UNINIT]<br>
&nbsp;&nbsp;Inode table at 1097-1608 (bg #0 + 1097)<br>
Group 3: (Blocks 98304-131071) csum 0x3c6b [INODE_UNINIT]<br>
&nbsp;&nbsp;Inode table at 1609-2120 (bg #0 + 1609)</div>
<p>On ext2, group 1's i-node table is at block 32803 — inside group 1 (+35 from its start); on ext4 it is at block 585 — inside group 0 ("bg #0 + 585"). (Group 2 of ext2 shows +2 instead of +35: it holds no backup copy of the superblock — "sparse_super" keeps backups only in groups 0, 1 and powers of 3, 5, 7.)</p>
<p class="pitfall">⚠️ All this is about <strong>moving arms</strong>. On SSDs there is no arm and no rotation; random reads cost the same as sequential ones, and <strong>defragmenting an SSD is harmful</strong> — it only wears out flash cells with pointless writes (FE1 question 5). The OS sends TRIM instead (<code>fstrim</code>).</p>`,
        `<p class="y-chinh">🎯 Hình 4-29: (a) i-node đặt ở đầu đĩa; (b) đĩa chia thành các <strong>nhóm cylinder (cylinder group)</strong>, mỗi nhóm có khối và i-node riêng.</p>
<p>Bộ đệm giảm <em>số lần</em> truy cập đĩa; cách đặt dữ liệu giảm <em>giá</em> của mỗi lần. Ở (a), đọc một tệp nghĩa là dịch đầu từ tới vùng i-node ở đầu đĩa rồi lại dịch một quãng dài tới dữ liệu — trung bình nửa cái đĩa. Tốt hơn: đặt i-node ở giữa, hoặc — ý tưởng của Berkeley Fast File System (1984) — chia đĩa thành các <strong>nhóm cylinder</strong>, mỗi nhóm có bản sao superblock, i-node và bitmap khối trống riêng, và cấp các khối của một tệp trong cùng nhóm với i-node của nó. Thêm nữa: cấp các khối sẽ được đọc tuần tự ở các vị trí <strong>liên tiếp</strong> (bitmap làm cho việc "tìm khối trống gần khối k" dễ dàng, slide 31), và cấp theo từng cụm khối.</p>
<p>➕ ext2/ext3/ext4 gọi chúng là <strong>nhóm khối (block group)</strong> (32.768 khối = 128 MB mỗi nhóm với khối 4 KB). Trên ext2 mỗi nhóm có bảng i-node riêng ngay ở đầu nhóm; ext4 thêm <strong>flex_bg</strong>, gom bitmap và bảng i-node của 16 nhóm về nhóm đầu tiên (ít lần dịch đầu từ khi đọc siêu dữ liệu, dải trống dài cho tệp lớn):</p>
<div class="out"># Hình 4-29(b) ngày nay: ext2/ext3/ext4 chia đĩa thành các NHÓM KHỐI ("cylinder group" của BSD), mỗi nhóm có bitmap và bảng i-node riêng<br>
$ mkfs.ext2 -q -b 4096 disk2.img 512M<br>
Creating regular file disk2.img<br>
$ dumpe2fs disk2.img 2&gt;/dev/null | grep -E '^Group [0-3]:|Inode table at' | head -8<br>
Group 0: (Blocks 0-32767)<br>
&nbsp;&nbsp;Inode table at 35-546 (+35)<br>
Group 1: (Blocks 32768-65535)<br>
&nbsp;&nbsp;Inode table at 32803-33314 (+35)<br>
Group 2: (Blocks 65536-98303)<br>
&nbsp;&nbsp;Inode table at 65538-66049 (+2)<br>
Group 3: (Blocks 98304-131071)<br>
&nbsp;&nbsp;Inode table at 98339-98850 (+35)<br>
# flex_bg của ext4 gom bitmap và bảng i-node của 16 nhóm về nhóm đầu (ít lần dịch đầu từ khi đọc siêu dữ liệu, dải trống dài cho tệp lớn)<br>
$ mkfs.ext4 -q -b 4096 disk4.img 512M<br>
Creating regular file disk4.img<br>
$ dumpe2fs disk4.img 2&gt;/dev/null | grep -E '^Group [0-3]:|Inode table at' | head -8<br>
Group 0: (Blocks 0-32767) csum 0xe301<br>
&nbsp;&nbsp;Inode table at 73-584 (+73)<br>
Group 1: (Blocks 32768-65535) csum 0xbc5c [INODE_UNINIT, BLOCK_UNINIT]<br>
&nbsp;&nbsp;Inode table at 585-1096 (bg #0 + 585)<br>
Group 2: (Blocks 65536-98303) csum 0x282f [INODE_UNINIT]<br>
&nbsp;&nbsp;Inode table at 1097-1608 (bg #0 + 1097)<br>
Group 3: (Blocks 98304-131071) csum 0x3c6b [INODE_UNINIT]<br>
&nbsp;&nbsp;Inode table at 1609-2120 (bg #0 + 1609)</div>
<p>Trên ext2, bảng i-node của nhóm 1 ở khối 32803 — nằm trong nhóm 1 (+35 tính từ đầu nhóm); trên ext4 nó ở khối 585 — nằm trong nhóm 0 ("bg #0 + 585"). (Nhóm 2 của ext2 ghi +2 thay vì +35: nó không giữ bản sao superblock — "sparse_super" chỉ giữ bản sao ở nhóm 0, 1 và các luỹ thừa của 3, 5, 7.)</p>
<p class="pitfall">⚠️ Tất cả chuyện này là để <strong>bớt dịch cánh tay đầu từ</strong>. Trên SSD không có cánh tay, không có quay; đọc ngẫu nhiên tốn ngang đọc tuần tự, và <strong>chống phân mảnh SSD là có hại</strong> — chỉ làm mòn tế bào flash bằng những lần ghi vô ích (FE1 câu 5). HĐH gửi lệnh TRIM thay vào đó (<code>fstrim</code>).</p>`],
      [41, 'The MS-DOS File System (1)',
        `<p class="y-chinh">🎯 Figure 4-30: the MS-DOS <strong>directory entry</strong>, 32 bytes: file name (8), extension (3), attributes (1), reserved (10), time (2), date (2), first block number (2), size (4).</p>
<p>MS-DOS (and Windows 95/98, and every FAT USB stick today) uses design (a) of slide 22: the attributes are in the directory entry, and there are no i-nodes. The <strong>first block number</strong> is the index of the file's first block in the FAT (slide 20); following the FAT gives the rest. The attributes byte holds read-only, hidden, system, volume label, directory and archive bits. Time and date are packed into 16 bits each: hours/minutes/seconds ÷ 2, and year since 1980/month/day — so a FAT date can only go up to 2107 and seconds are only even. The 4-byte size limits a file to 4 GB.</p>
<p>➕ The real 32 bytes of an entry, from a FAT-16 image, decoded field by field by a small C program:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Figure 4-30 for real: the 32-byte MS-DOS directory entry inside a FAT-16 image<br>
$ truncate -s 8M usb.img &amp;&amp; mkfs.vfat -F 16 -s 1 -i 12345678 -n DEMO usb.img &gt; /dev/null<br>
$ mkdir -p /mnt/usb &amp;&amp; mount -o loop,time_offset=420 usb.img /mnt/usb<br>
# FAT stores LOCAL time with no time zone; time_offset=420 tells Linux the clock is UTC+7 (Vietnam)<br>
$ echo "hello" &gt; /mnt/usb/README.TXT<br>
$ echo "week 4" &gt; "/mnt/usb/Lecture notes.txt"<br>
$ touch -d '2026-10-20 08:30:00' /mnt/usb/*<br>
$ umount /mnt/usb<br>
# the raw bytes of the README.TXT entry: 8 + 3 name, attributes, 10 reserved, time, date, first block, size<br>
$ od -A d -t x1 -j $((66048 + 32)) -N 32 usb.img<br>
0066080 52 45 41 44 4d 45 20 20 54 58 54 20 00 54 34 0b<br>
0066096 5a 5d 54 5d 00 00 c0 43 54 5d 03 00 06 00 00 00<br>
0066112<br>
$ gcc -o muc-fat _muc-fat.c &amp;&amp; ./muc-fat usb.img<br>
name "DEMO &nbsp;&nbsp;&nbsp;" ext " &nbsp;&nbsp;" attr 0x08 &nbsp;time 01:25:40 &nbsp;date 2026-10-26 &nbsp;first block 0 &nbsp;size 0<br>
name "README &nbsp;" ext "TXT" attr 0x20 &nbsp;time 08:30:00 &nbsp;date 2026-10-20 &nbsp;first block 3 &nbsp;size 6<br>
[long-name piece, sequence 0x42]<br>
[long-name piece, sequence 0x01]<br>
name "LECTUR~1" ext "TXT" attr 0x20 &nbsp;time 08:30:00 &nbsp;date 2026-10-20 &nbsp;first block 4 &nbsp;size 7</div>
<p>Bytes 0–10 are <code>README  TXT</code> (space-padded, no dot stored); byte 11 = <code>0x20</code> (archive bit); bytes 26–27 = <code>03 00</code> → first block 3; bytes 28–31 = <code>06 00 00 00</code> → size 6. The "reserved" ten bytes are no longer empty: since Windows 95/FAT-32 they hold the creation time, the last-access date and the high 16 bits of the first block number (FAT-32 needs 28-bit block numbers — the book mentions this). And the long name "Lecture notes.txt" was stored the Windows 95 way: two hidden <strong>long-name entries</strong> (attribute 0x0F) followed by a short alias <code>LECTUR~1.TXT</code> that old software can still read.</p>
<p class="meo">🧠 FAT stores <em>local</em> time with no time zone — the session needed <code>time_offset=420</code> so that Linux would write Vietnam time (UTC+7). That is why a FAT stick moved between countries shows shifted times.</p>`,
        `<p class="y-chinh">🎯 Hình 4-30: <strong>mục thư mục</strong> của MS-DOS, 32 byte: tên tệp (8), phần mở rộng (3), thuộc tính (1), dành riêng (10), giờ (2), ngày (2), số hiệu khối đầu (2), cỡ (4).</p>
<p>MS-DOS (cả Windows 95/98, và mọi USB định dạng FAT ngày nay) dùng thiết kế (a) của slide 22: thuộc tính nằm trong mục thư mục, không có i-node. <strong>Số hiệu khối đầu</strong> là chỉ số khối đầu tiên của tệp trong FAT (slide 20); lần theo FAT là ra phần còn lại. Byte thuộc tính chứa các bit chỉ-đọc, ẩn, hệ thống, nhãn đĩa, thư mục và archive. Giờ và ngày được nén vào 16 bit mỗi thứ: giờ/phút/giây ÷ 2, và năm kể từ 1980/tháng/ngày — nên ngày FAT chỉ tới năm 2107 và giây luôn chẵn. Cỡ 4 byte giới hạn một tệp ở 4 GB.</p>
<p>➕ Đúng 32 byte thật của một mục, lấy từ ảnh FAT-16, được một chương trình C nhỏ giải mã từng trường:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Hình 4-30 chạy thật: mục thư mục MS-DOS 32 byte bên trong một ảnh FAT-16<br>
$ truncate -s 8M usb.img &amp;&amp; mkfs.vfat -F 16 -s 1 -i 12345678 -n DEMO usb.img &gt; /dev/null<br>
$ mkdir -p /mnt/usb &amp;&amp; mount -o loop,time_offset=420 usb.img /mnt/usb<br>
# FAT lưu giờ ĐỊA PHƯƠNG không kèm múi giờ; time_offset=420 báo Linux đồng hồ là UTC+7 (Việt Nam)<br>
$ echo "hello" &gt; /mnt/usb/README.TXT<br>
$ echo "week 4" &gt; "/mnt/usb/Lecture notes.txt"<br>
$ touch -d '2026-10-20 08:30:00' /mnt/usb/*<br>
$ umount /mnt/usb<br>
# byte thô của mục README.TXT: tên 8 + 3, thuộc tính, 10 byte dành riêng, giờ, ngày, khối đầu, cỡ<br>
$ od -A d -t x1 -j $((66048 + 32)) -N 32 usb.img<br>
0066080 52 45 41 44 4d 45 20 20 54 58 54 20 00 54 34 0b<br>
0066096 5a 5d 54 5d 00 00 c0 43 54 5d 03 00 06 00 00 00<br>
0066112<br>
$ gcc -o muc-fat _muc-fat.c &amp;&amp; ./muc-fat usb.img<br>
name "DEMO &nbsp;&nbsp;&nbsp;" ext " &nbsp;&nbsp;" attr 0x08 &nbsp;time 01:25:40 &nbsp;date 2026-10-26 &nbsp;first block 0 &nbsp;size 0<br>
name "README &nbsp;" ext "TXT" attr 0x20 &nbsp;time 08:30:00 &nbsp;date 2026-10-20 &nbsp;first block 3 &nbsp;size 6<br>
[long-name piece, sequence 0x42]<br>
[long-name piece, sequence 0x01]<br>
name "LECTUR~1" ext "TXT" attr 0x20 &nbsp;time 08:30:00 &nbsp;date 2026-10-20 &nbsp;first block 4 &nbsp;size 7</div>
<p>Byte 0–10 là <code>README  TXT</code> (đệm bằng dấu cách, không lưu dấu chấm); byte 11 = <code>0x20</code> (bit archive); byte 26–27 = <code>03 00</code> → khối đầu 3; byte 28–31 = <code>06 00 00 00</code> → cỡ 6. Mười byte "dành riêng" giờ không còn trống: từ Windows 95/FAT-32 chúng chứa giờ tạo, ngày truy cập cuối và 16 bit cao của số hiệu khối đầu (FAT-32 cần số hiệu khối 28 bit — sách có nhắc). Còn tên dài "Lecture notes.txt" được lưu theo cách của Windows 95: hai <strong>mục tên dài</strong> ẩn (thuộc tính 0x0F) rồi tới một bí danh ngắn <code>LECTUR~1.TXT</code> mà phần mềm cũ vẫn đọc được.</p>
<p class="meo">🧠 FAT lưu giờ <em>địa phương</em>, không kèm múi giờ — phiên ở trên cần <code>time_offset=420</code> để Linux ghi theo giờ Việt Nam (UTC+7). Đó là lý do USB FAT mang qua nước khác thì giờ của tệp bị lệch.</p>`],
      [42, 'The MS-DOS File System (2)',
        `<p class="y-chinh">🎯 Figure 4-31: maximum partition size for different block sizes — FAT-12: 2, 4, 8, 16 MB for blocks of 0.5–4 KB; FAT-16: 128 MB to 2048 MB for blocks of 2–32 KB; FAT-32: 1 TB for 4 KB blocks and 2 TB above. The empty boxes are forbidden combinations.</p>
<p>The number in the name is the size of a FAT entry in bits, so it fixes how many blocks can be addressed: FAT-12 → 2¹² = 4096 blocks, FAT-16 → 2¹⁶ = 65,536 blocks. Maximum partition = number of blocks × block size. FAT-32 uses only 28 of its 32 bits for block numbers (2²⁸ blocks), and in addition the partition is limited to <strong>2 TB</strong> because the MBR partition table (slide 17) stores sector counts in 32 bits: 2³² × 512 bytes. The simulator recomputes the whole table from those rules:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fd91a85e9560b0f78925a640fcda06149d32ca40.svg" alt="Figure 4-31 recomputed; FAT-32 with 16 KB blocks is capped at 2 TB" loading="lazy" /><p class="chu-thich">🧮 Figure 4-31 recomputed; FAT-32 with 16 KB blocks is capped at 2 TB</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIT = { fat12: 12, fat16: 16, fat32: 28 };
const CHO_PHEP = { fat12: [0.5, 1, 2, 4], fat16: [2, 4, 8, 16, 32], fat32: [4, 8, 16, 32] };   // Figure 4-31's non-empty cells
const TRAN_MBR_KB = 2 ** 32 * 512 / 1024;              // 2 TB expressed in KB
function toiDa(loai, khoiKB) {
  if (!CHO_PHEP[loai].includes(khoiKB)) return null;
  const kb = Math.min(2 ** BIT[loai] * khoiKB, TRAN_MBR_KB);
  return kb;
}
const chu = (kb) =&gt; (kb &gt;= 2 ** 30 ? &#96;&#36;{kb / 2 ** 30} TB&#96; : &#96;&#36;{kb / 1024} MB&#96;);</code></pre></details>
<p>Every number on the slide comes out of one multiplication: FAT-16 with 4 KB blocks = 65,536 × 4 KB = 256 MB; FAT-32 with 4 KB = 2²⁸ × 4 KB = 1 TB; with 8 KB the product (2 TB) meets the MBR cap, so 16 and 32 KB stay at 2 TB. The FAT itself also costs memory: a FAT-16 has at most 65,536 entries × 2 bytes = 128 KB, small enough for RAM — FAT-32 on a big disk is not (slide 20).</p>
<p>➕ Out of date: Windows can still use FAT-32 but its 4 GB file limit rules it out for video and disk images; SD cards above 32 GB (SDXC) and most large USB sticks use <strong>exFAT</strong> — a 64-bit FAT whose specification Microsoft published in 2019 (with a free-space <em>bitmap</em> instead of scanning the FAT); Linux gained a native exFAT driver in kernel 5.7 (2020).</p>
<p class="pitfall">⚠️ FE asks this table again and again: FAT-16 + 4 KB → <strong>256 MB</strong> (FE3 question 26, FE4 question 32); FAT-32 + 16 KB → <strong>2 TB</strong> (FE5 question 26, FE7 question 33); FAT-12 + 2 KB → <strong>8 MB</strong> (FE21 question 9); FAT-32 + 4 KB → <strong>1 TB</strong> (FE22 question 38). Learn the rule, not the table: blocks × block size, FAT-32 capped at 2 TB.</p>`,
        `<p class="y-chinh">🎯 Hình 4-31: cỡ phân vùng tối đa với các cỡ khối khác nhau — FAT-12: 2, 4, 8, 16 MB cho khối 0,5–4 KB; FAT-16: 128 MB tới 2048 MB cho khối 2–32 KB; FAT-32: 1 TB với khối 4 KB và 2 TB trở lên. Ô trống là tổ hợp bị cấm.</p>
<p>Con số trong tên là cỡ một mục FAT tính bằng bit, nên nó quyết định địa chỉ hoá được bao nhiêu khối: FAT-12 → 2¹² = 4096 khối, FAT-16 → 2¹⁶ = 65.536 khối. Phân vùng tối đa = số khối × cỡ khối. FAT-32 chỉ dùng 28 trong 32 bit cho số hiệu khối (2²⁸ khối), và thêm nữa phân vùng bị giới hạn ở <strong>2 TB</strong> vì bảng phân vùng MBR (slide 17) ghi số sector bằng 32 bit: 2³² × 512 byte. Bộ mô phỏng tính lại cả bảng từ đúng các luật đó:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8a7308870590957d2b9676d32466c59a1bb45f3b.svg" alt="Hình 4-31 tính lại; FAT-32 khối 16 KB bị chặn ở 2 TB" loading="lazy" /><p class="chu-thich">🧮 Hình 4-31 tính lại; FAT-32 khối 16 KB bị chặn ở 2 TB</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIT = { fat12: 12, fat16: 16, fat32: 28 };
const CHO_PHEP = { fat12: [0.5, 1, 2, 4], fat16: [2, 4, 8, 16, 32], fat32: [4, 8, 16, 32] };   // các ô có số trên Hình 4-31
const TRAN_MBR_KB = 2 ** 32 * 512 / 1024;              // 2 TB tính bằng KB
function toiDa(loai, khoiKB) {
  if (!CHO_PHEP[loai].includes(khoiKB)) return null;
  const kb = Math.min(2 ** BIT[loai] * khoiKB, TRAN_MBR_KB);
  return kb;
}
const chu = (kb) =&gt; (kb &gt;= 2 ** 30 ? &#96;&#36;{kb / 2 ** 30} TB&#96; : &#96;&#36;{kb / 1024} MB&#96;);</code></pre></details>
<p>Mọi con số trên slide ra từ một phép nhân: FAT-16 khối 4 KB = 65.536 × 4 KB = 256 MB; FAT-32 khối 4 KB = 2²⁸ × 4 KB = 1 TB; với khối 8 KB tích (2 TB) chạm trần MBR, nên khối 16 và 32 KB vẫn chỉ 2 TB. Bản thân FAT cũng tốn bộ nhớ: FAT-16 có tối đa 65.536 mục × 2 byte = 128 KB, đủ nhỏ để nằm trong RAM — còn FAT-32 trên đĩa lớn thì không (slide 20).</p>
<p>➕ Đã lỗi thời: Windows vẫn dùng được FAT-32 nhưng giới hạn tệp 4 GB loại nó khỏi video và ảnh đĩa; thẻ SD trên 32 GB (SDXC) và đa số USB dung lượng lớn dùng <strong>exFAT</strong> — một FAT 64 bit mà Microsoft công bố đặc tả năm 2019 (có <em>bitmap</em> chỗ trống thay vì quét FAT); Linux có driver exFAT gốc từ nhân 5.7 (năm 2020).</p>
<p class="pitfall">⚠️ FE hỏi bảng này mãi: FAT-16 + 4 KB → <strong>256 MB</strong> (FE3 câu 26, FE4 câu 32); FAT-32 + 16 KB → <strong>2 TB</strong> (FE5 câu 26, FE7 câu 33); FAT-12 + 2 KB → <strong>8 MB</strong> (FE21 câu 9); FAT-32 + 4 KB → <strong>1 TB</strong> (FE22 câu 38). Học luật chứ đừng học thuộc bảng: số khối × cỡ khối, FAT-32 bị chặn ở 2 TB.</p>`],
      [43, 'The UNIX V7 File System (1)',
        `<p class="y-chinh">🎯 Figure 4-32: a UNIX V7 <strong>directory entry</strong> — 16 bytes: a 2-byte <strong>i-node number</strong> and a 14-byte <strong>file name</strong>.</p>
<p>UNIX Version 7 (1979, on the PDP-11) is the ancestor of every UNIX file system. Its directories use design (b) of slide 22: an entry is just (i-number, name); everything else is in the i-node. File names can be up to 14 characters, any ASCII except <code>/</code> and NUL. The 2-byte i-number limits a file system to 64K files. A directory is an ordinary file holding an unsorted list of these entries; removing a file sets its i-number to 0.</p>
<p>➕ ext2 (1993) keeps the same idea with longer fields: 4-byte i-number, 2-byte entry length (for variable-size entries, slide 23), 1-byte name length, 1-byte file type, and a name of up to 255 bytes. The raw bytes of a real root directory block:</p>
<div class="out"># Figure 4-32 vs ext2: V7 used 16-byte entries (2-byte i-number + 14-byte name); ext2 uses variable entries<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ debugfs -R "ls /" fs.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(12) bin<br>
&nbsp;13 &nbsp;(12) dev &nbsp;&nbsp;&nbsp;14 &nbsp;(956) usr<br>
# the raw bytes of the root directory block: 4-byte i-number, 2-byte entry length, 1-byte name length, 1-byte type, name<br>
$ debugfs -R "bd $(debugfs -R 'blocks /' fs.img 2&gt;/dev/null)" fs.img 2&gt;/dev/null | head -4<br>
0000 &nbsp;0200 0000 0c00 0102 2e00 0000 0200 0000 &nbsp;................<br>
0020 &nbsp;0c00 0202 2e2e 0000 0b00 0000 1400 0a02 &nbsp;................<br>
0040 &nbsp;6c6f 7374 2b66 6f75 6e64 0000 0c00 0000 &nbsp;lost+found......<br>
0060 &nbsp;0c00 0302 6269 6e00 0d00 0000 0c00 0302 &nbsp;....bin.........<br>
# a 2-byte i-number limits V7 to 65,535 files per file system; ext2's 4 bytes allow about 4 billion<br>
$ echo $(( (1 &lt;&lt; 16) - 1 )) $(( (1 &lt;&lt; 32) - 1 ))<br>
65535 4294967295</div>
<p>Read the first entry byte by byte (debugfs prints pairs of bytes): <code>0200 0000</code> = i-number 2 (little-endian), <code>0c00</code> = entry length 12, <code>01</code> = name length 1, <code>02</code> = type "directory", <code>2e</code> = "."; then i-node 2 again for "..", 11 for <code>lost+found</code> (length 0x14 = 20), 12 for <code>bin</code>… A 2-byte i-number allows 65,535 files; ext2's 4 bytes allow about 4.3 billion.</p>
<p class="pitfall">⚠️ FE: "A directory in UNIX/Linux consists of" — <strong>i-node number and file name</strong> (FE19 question 46, FE24 question 16, FE27 question 11, FE29 question 38). The entry does not hold size, location or dates.</p>`,
        `<p class="y-chinh">🎯 Hình 4-32: một <strong>mục thư mục</strong> của UNIX V7 — 16 byte: <strong>số i-node</strong> 2 byte và <strong>tên tệp</strong> 14 byte.</p>
<p>UNIX Version 7 (1979, trên máy PDP-11) là tổ tiên của mọi hệ thống tệp UNIX. Thư mục của nó dùng thiết kế (b) của slide 22: một mục chỉ là (số i-node, tên); mọi thứ khác nằm trong i-node. Tên tệp dài tối đa 14 ký tự, mọi ký tự ASCII trừ <code>/</code> và NUL. Số i-node 2 byte giới hạn mỗi hệ thống tệp ở 64K tệp. Thư mục là một tệp bình thường chứa danh sách không sắp xếp các mục này; xoá tệp thì đặt số i-node của mục về 0.</p>
<p>➕ ext2 (1993) giữ đúng ý tưởng đó với các trường dài hơn: số i-node 4 byte, độ dài mục 2 byte (cho mục cỡ thay đổi, slide 23), độ dài tên 1 byte, kiểu tệp 1 byte, và tên dài tới 255 byte. Các byte thô của một khối thư mục gốc thật:</p>
<div class="out"># Hình 4-32 so với ext2: V7 dùng mục 16 byte (số i-node 2 byte + tên 14 byte); ext2 dùng mục độ dài thay đổi<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
$ debugfs -R "ls /" fs.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(12) bin<br>
&nbsp;13 &nbsp;(12) dev &nbsp;&nbsp;&nbsp;14 &nbsp;(956) usr<br>
# byte thô của khối thư mục gốc: số i-node 4 byte, độ dài mục 2 byte, độ dài tên 1 byte, kiểu 1 byte, tên<br>
$ debugfs -R "bd $(debugfs -R 'blocks /' fs.img 2&gt;/dev/null)" fs.img 2&gt;/dev/null | head -4<br>
0000 &nbsp;0200 0000 0c00 0102 2e00 0000 0200 0000 &nbsp;................<br>
0020 &nbsp;0c00 0202 2e2e 0000 0b00 0000 1400 0a02 &nbsp;................<br>
0040 &nbsp;6c6f 7374 2b66 6f75 6e64 0000 0c00 0000 &nbsp;lost+found......<br>
0060 &nbsp;0c00 0302 6269 6e00 0d00 0000 0c00 0302 &nbsp;....bin.........<br>
# số i-node 2 byte giới hạn V7 ở 65.535 tệp mỗi hệ thống tệp; 4 byte của ext2 cho khoảng 4 tỉ<br>
$ echo $(( (1 &lt;&lt; 16) - 1 )) $(( (1 &lt;&lt; 32) - 1 ))<br>
65535 4294967295</div>
<p>Đọc mục đầu tiên từng byte (debugfs in từng cặp byte): <code>0200 0000</code> = số i-node 2 (little-endian), <code>0c00</code> = độ dài mục 12, <code>01</code> = độ dài tên 1, <code>02</code> = kiểu "thư mục", <code>2e</code> = "."; rồi lại i-node 2 cho "..", 11 cho <code>lost+found</code> (độ dài 0x14 = 20), 12 cho <code>bin</code>… Số i-node 2 byte cho 65.535 tệp; 4 byte của ext2 cho khoảng 4,3 tỉ.</p>
<p class="pitfall">⚠️ FE: "Một thư mục trong UNIX/Linux gồm" — <strong>số i-node và tên tệp</strong> (FE19 câu 46, FE24 câu 16, FE27 câu 11, FE29 câu 38). Mục không chứa cỡ, vị trí hay ngày tháng.</p>`],
      [44, 'The UNIX V7 File System (2)',
        `<p class="y-chinh">🎯 Figure 4-33: a UNIX <strong>i-node</strong> — the attributes, then disk addresses: the first ten point directly to data blocks, the next to a <strong>single indirect block</strong>, then a <strong>double indirect block</strong>, then a <strong>triple indirect block</strong>, each level fanning out to more blocks of addresses and finally to data blocks.</p>
<p>The V7 i-node holds the file's attributes — size, three times (creation, last access, last modification), owner, group, protection, and the count of directory entries pointing to it (the link count, slide 25) — and 13 disk addresses. Small files are reached with no extra reads; big files pay one, two or three pointer blocks. The maximum file size follows from the block size and the size of a block number. With 1 KB blocks and 4-byte numbers (P = 256 per indirect block):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d6839eacc7618d598dd4eb3960c51491f76863d7.svg" alt="V7-style i-node, 1 KB blocks: 10 + 256 + 65,536 + 16,777,216 blocks" loading="lazy" /><p class="chu-thich">🧮 V7-style i-node, 1 KB blocks: 10 + 256 + 65,536 + 16,777,216 blocks</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // block numbers per indirect block
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [level, blocks reachable]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>About 16 GB. The same tree with ext2's 12 direct pointers and 4 KB blocks (P = 1024) reaches about 4 TB — the "4 TiB for block maps" in the ext4 documentation:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7814d7a0f63a9ff8dad48211c7fda10f918908ee.svg" alt="ext2 i-node with 4 KB blocks: about 4 TB" loading="lazy" /><p class="chu-thich">🧮 ext2 i-node with 4 KB blocks: about 4 TB</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // block numbers per indirect block
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [level, blocks reachable]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>➕ Every level, on a real ext2 file system with 1 KB blocks: a <strong>sparse</strong> file with a few bytes at logical blocks 0, 300 and 70,000 (the holes are not stored):</p>
<div class="out"># Figure 4-33 on ext2 (1 KB blocks, 4-byte block numbers ⇒ 256 per indirect block): which logical blocks go where<br>
$ mkfs.ext2 -q -b 1024 fs.img 8M<br>
Creating regular file fs.img<br>
# a SPARSE file: a few bytes at the start, at logical block 300 and at block 70,000 (~68 MB) — the gaps are holes, not stored<br>
$ printf 'start' &gt; sparse; printf 'middle' | dd of=sparse bs=1024 seek=300 conv=notrunc status=none; printf 'end' | dd of=sparse bs=1024 seek=70000 conv=notrunc status=none<br>
$ ls -ls sparse | awk '{print "allocated:", $1, "KB &nbsp;&nbsp;size:", $6, "bytes"}'<br>
allocated: 308 KB &nbsp;&nbsp;size: 71680003 bytes<br>
$ debugfs -w -R "write sparse sparse" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
# block 0 is direct; block 300 needs the double-indirect tree; block 70,000 needs the TRIPLE-indirect one<br>
$ debugfs -R "stat sparse" fs.img 2&gt;/dev/null | grep -E '^\\(|TOTAL'<br>
(0):562, (DIND):563, (IND):564, (300):565, (TIND):566, (DIND):567, (IND):568, (70000):569<br>
TOTAL: 8<br>
# the boundaries: 12 direct (0–11), single 12–267, double 268–65803, triple from 65804<br>
$ echo $((12 + 256)) $((12 + 256 + 256*256))<br>
268 65804<br>
# the same file on ext4: no indirect blocks, just extents (start, length)<br>
$ mkfs.ext4 -q -b 1024 fs4.img 8M<br>
Creating regular file fs4.img<br>
$ debugfs -w -R "write sparse sparse" fs4.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
$ debugfs -R "stat sparse" fs4.img 2&gt;/dev/null | grep -A1 EXTENTS<br>
EXTENTS:<br>
(0):1618, (300):1619, (70000):1620</div>
<p>Block 0 is direct; block 300 sits behind (DIND) → (IND); block 70,000 is beyond 12 + 256 + 65,536 = 65,804, so it needs <strong>(TIND) → (DIND) → (IND)</strong>. Three data blocks cost five pointer blocks (TOTAL 8). The simulator gives the path inside the tree for any byte:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/895f6233659656253a22471995ef4f78f2f0e760.svg" alt="Byte 71,680,000 = logical block 70,000: triple indirect, slots [0][16][100]" loading="lazy" /><p class="chu-thich">🧮 Byte 71,680,000 = logical block 70,000: triple indirect, slots [0][16][100]</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function viTri(N, khoi, truc = 12, so = 4) {
  const P = khoi / so;
  let b = Math.floor(N / khoi);                       // logical block number
  const logic = b;
  if (b &lt; truc) return { logic, muc: 0, chiSo: [b] };
  b -= truc;
  for (let m = 1; m &lt;= 3; m++) {
    const tam = P ** m;                               // blocks reachable through this level
    if (b &lt; tam) {
      const chiSo = [];                               // index inside each pointer block, top level first
      for (let k = m - 1; k &gt;= 0; k--) chiSo.push(Math.floor(b / P ** k) % P);
      return { logic, muc: m, chiSo, viTriTrongVung: b };
    }
    b -= tam;
  }
  throw new Error('quá cỡ tệp tối đa');
}</code></pre></details>
<p>The same file on ext4 needs no pointer blocks at all: three <strong>extents</strong> stored right in the i-node (ext4 holds four extents in the i-node, each up to 32,768 blocks). Old lesson 4.2 works the example "byte 5,000,000 with 4 KB blocks" (block 1220, double indirect, slot 184 — <code>vi-tri-byte.mjs#4k-5000000</code> gives the same).</p>
<p class="pitfall">⚠️ FE calculation questions vary only the parameters: FE21 question 16 (10 direct + single, 1 KB → 266 KB), FE25 question 48 (10 direct + a <em>double</em> indirect only → 10 + 256² = 65,546 KB), FE26 question 49 (10 direct, 1024 KB blocks → 10 MB). Always ask: block size? address size? which levels exist? Practice lesson 4.C runs all three.</p>`,
        `<p class="y-chinh">🎯 Hình 4-33: một <strong>i-node</strong> UNIX — các thuộc tính, rồi các địa chỉ đĩa: mười địa chỉ đầu trỏ thẳng tới khối dữ liệu, địa chỉ kế trỏ tới một <strong>khối gián tiếp đơn</strong>, rồi một <strong>khối gián tiếp đôi</strong>, rồi một <strong>khối gián tiếp ba</strong>, mỗi tầng toả ra thêm các khối địa chỉ và cuối cùng tới khối dữ liệu.</p>
<p>i-node của V7 giữ thuộc tính của tệp — cỡ, ba mốc thời gian (tạo, truy cập cuối, sửa cuối), chủ, nhóm, quyền bảo vệ, và số mục thư mục trỏ tới nó (số liên kết, slide 25) — cùng 13 địa chỉ đĩa. Tệp nhỏ được với tới mà không tốn lần đọc thêm; tệp lớn trả giá một, hai hay ba khối con trỏ. Cỡ tệp tối đa suy ra từ cỡ khối và cỡ một số hiệu khối. Với khối 1 KB và số hiệu 4 byte (P = 256 số mỗi khối gián tiếp):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/1c679c71b98cdd9aaef02b4ab3ccba8880a89152.svg" alt="i-node kiểu V7, khối 1 KB: 10 + 256 + 65.536 + 16.777.216 khối" loading="lazy" /><p class="chu-thich">🧮 i-node kiểu V7, khối 1 KB: 10 + 256 + 65.536 + 16.777.216 khối</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // số hiệu khối trong một khối gián tiếp
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [mức, số khối với tới được]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>Khoảng 16 GB. Cùng cái cây đó với 12 con trỏ trực tiếp của ext2 và khối 4 KB (P = 1024) với tới khoảng 4 TB — chính là con số "4 TiB cho block map" trong tài liệu ext4:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/41e1239bcf53383dc8abbfbcb67c47f78b34aac4.svg" alt="i-node ext2 với khối 4 KB: khoảng 4 TB" loading="lazy" /><p class="chu-thich">🧮 i-node ext2 với khối 4 KB: khoảng 4 TB</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // số hiệu khối trong một khối gián tiếp
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [mức, số khối với tới được]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>➕ Mọi tầng, trên một hệ thống tệp ext2 thật khối 1 KB: một tệp <strong>thưa (sparse)</strong> chỉ có vài byte ở khối logic 0, 300 và 70.000 (các lỗ không được lưu):</p>
<div class="out"># Hình 4-33 trên ext2 (khối 1 KB, số hiệu khối 4 byte ⇒ 256 số mỗi khối gián tiếp): khối logic nào nằm ở đâu<br>
$ mkfs.ext2 -q -b 1024 fs.img 8M<br>
Creating regular file fs.img<br>
# một tệp THƯA: vài byte ở đầu, ở khối logic 300 và ở khối 70.000 (~68 MB) — khoảng giữa là lỗ, không được lưu<br>
$ printf 'start' &gt; sparse; printf 'middle' | dd of=sparse bs=1024 seek=300 conv=notrunc status=none; printf 'end' | dd of=sparse bs=1024 seek=70000 conv=notrunc status=none<br>
$ ls -ls sparse | awk '{print "allocated:", $1, "KB &nbsp;&nbsp;size:", $6, "bytes"}'<br>
allocated: 308 KB &nbsp;&nbsp;size: 71680003 bytes<br>
$ debugfs -w -R "write sparse sparse" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
# khối 0 là trực tiếp; khối 300 cần cây gián tiếp đôi; khối 70.000 cần cây gián tiếp BA<br>
$ debugfs -R "stat sparse" fs.img 2&gt;/dev/null | grep -E '^\\(|TOTAL'<br>
(0):562, (DIND):563, (IND):564, (300):565, (TIND):566, (DIND):567, (IND):568, (70000):569<br>
TOTAL: 8<br>
# các ranh giới: 12 trực tiếp (0–11), đơn 12–267, đôi 268–65803, ba từ 65804<br>
$ echo $((12 + 256)) $((12 + 256 + 256*256))<br>
268 65804<br>
# cùng tệp đó trên ext4: không có khối gián tiếp, chỉ có extent (khối đầu, độ dài)<br>
$ mkfs.ext4 -q -b 1024 fs4.img 8M<br>
Creating regular file fs4.img<br>
$ debugfs -w -R "write sparse sparse" fs4.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
$ debugfs -R "stat sparse" fs4.img 2&gt;/dev/null | grep -A1 EXTENTS<br>
EXTENTS:<br>
(0):1618, (300):1619, (70000):1620</div>
<p>Khối 0 là trực tiếp; khối 300 nằm sau (DIND) → (IND); khối 70.000 vượt quá 12 + 256 + 65.536 = 65.804, nên cần <strong>(TIND) → (DIND) → (IND)</strong>. Ba khối dữ liệu tốn năm khối con trỏ (TOTAL 8). Bộ mô phỏng chỉ đường đi trong cây cho byte bất kỳ:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d8c67d9885b2ad67c871e91b4eb1850f45d245d1.svg" alt="Byte 71.680.000 = khối logic 70.000: gián tiếp ba, các ô [0][16][100]" loading="lazy" /><p class="chu-thich">🧮 Byte 71.680.000 = khối logic 70.000: gián tiếp ba, các ô [0][16][100]</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function viTri(N, khoi, truc = 12, so = 4) {
  const P = khoi / so;
  let b = Math.floor(N / khoi);                       // số hiệu khối logic
  const logic = b;
  if (b &lt; truc) return { logic, muc: 0, chiSo: [b] };
  b -= truc;
  for (let m = 1; m &lt;= 3; m++) {
    const tam = P ** m;                               // số khối với tới qua mức này
    if (b &lt; tam) {
      const chiSo = [];                               // chỉ số trong từng khối con trỏ, từ mức trên xuống
      for (let k = m - 1; k &gt;= 0; k--) chiSo.push(Math.floor(b / P ** k) % P);
      return { logic, muc: m, chiSo, viTriTrongVung: b };
    }
    b -= tam;
  }
  throw new Error('quá cỡ tệp tối đa');
}</code></pre></details>
<p>Cùng tệp đó trên ext4 không cần khối con trỏ nào: ba <strong>extent</strong> nằm ngay trong i-node (ext4 chứa bốn extent trong i-node, mỗi extent tới 32.768 khối). Bài cũ 4.2 giải ví dụ "byte 5.000.000 với khối 4 KB" (khối 1220, gián tiếp đôi, ô 184 — <code>vi-tri-byte.mjs#4k-5000000</code> cho cùng kết quả).</p>
<p class="pitfall">⚠️ Câu tính toán FE chỉ đổi tham số: FE21 câu 16 (10 trực tiếp + đơn, khối 1 KB → 266 KB), FE25 câu 48 (10 trực tiếp + chỉ một gián tiếp <em>đôi</em> → 10 + 256² = 65.546 KB), FE26 câu 49 (10 trực tiếp, khối 1024 KB → 10 MB). Luôn hỏi: cỡ khối? cỡ địa chỉ? có những tầng nào? Bài thực hành 4.C chạy cả ba.</p>`],
      [45, 'The UNIX V7 File System (3)',
        `<p class="y-chinh">🎯 Figure 4-34: the steps in looking up <code>/usr/ast/mbox</code> — the root directory says <code>usr</code> is i-node 6; i-node 6 says <code>/usr</code> is in block 132; block 132 says <code>/usr/ast</code> is i-node 26; i-node 26 says <code>/usr/ast</code> is in block 406; block 406 says <code>/usr/ast/mbox</code> is i-node 60.</p>
<p>When a file is opened, the file system takes the path apart one component at a time. The root's i-node is at a fixed, known place on the disk. From it the root directory is read and searched for <code>usr</code>; that gives an i-number; the i-node gives the blocks of <code>/usr</code>; they are searched for <code>ast</code>; and so on, until the i-node of <code>mbox</code> is brought into memory, where it stays until the file is closed. A relative path does the same starting from the working directory, and <code>..</code> is just one more entry to look up.</p>
<p>➕ Figure 4-34 rebuilt in an ext2 image and walked by hand with debugfs — each command is one step of the kernel's lookup:</p>
<div class="out"># Figure 4-34 rebuilt: look up /usr/ast/mbox step by step, the way the kernel does<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
# step 1: the root directory is always i-node 2 on ext2 (V7 used i-node 1); read its block and find "usr"<br>
$ debugfs -R "ls /" fs.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(12) bin<br>
&nbsp;13 &nbsp;(12) dev &nbsp;&nbsp;&nbsp;14 &nbsp;(12) lib &nbsp;&nbsp;&nbsp;15 &nbsp;(12) etc &nbsp;&nbsp;&nbsp;16 &nbsp;(12) usr<br>
&nbsp;17 &nbsp;(920) tmp<br>
# step 2: i-node of /usr says where its directory block is; read it and find "ast"<br>
$ debugfs -R "blocks &lt;16&gt;" fs.img 2&gt;/dev/null<br>
294<br>
$ debugfs -R "ls &lt;16&gt;" fs.img 2&gt;/dev/null<br>
&nbsp;16 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;18 &nbsp;(12) ast &nbsp;&nbsp;&nbsp;19 &nbsp;(988) jim<br>
# step 3: i-node of /usr/ast ⇒ its block ⇒ the entry "mbox"<br>
$ debugfs -R "blocks &lt;18&gt;" fs.img 2&gt;/dev/null<br>
296<br>
$ debugfs -R "ls &lt;18&gt;" fs.img 2&gt;/dev/null<br>
&nbsp;18 &nbsp;(12) . &nbsp;&nbsp;&nbsp;16 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;20 &nbsp;(1000) mbox<br>
$ debugfs -R "cat &lt;20&gt;" fs.img 2&gt;/dev/null<br>
From: prof<br>
# the reverse question (i-node ⇒ name) needs a search of every directory<br>
$ debugfs -R "ncheck 20" fs.img 2&gt;/dev/null<br>
Inode	Pathname<br>
20	/usr/ast/mbox<br>
# on the live system, namei(1) shows every component the kernel walks — including a symbolic link it must follow<br>
$ namei /etc/os-release<br>
f: /etc/os-release<br>
&nbsp;d /<br>
&nbsp;d etc<br>
&nbsp;l os-release -&gt; ../usr/lib/os-release<br>
&nbsp;&nbsp;&nbsp;d ..<br>
&nbsp;&nbsp;&nbsp;d usr<br>
&nbsp;&nbsp;&nbsp;d lib<br>
&nbsp;&nbsp;&nbsp;- os-release</div>
<p>Root (i-node 2 on ext2) → <code>usr</code> = i-node 16 → block 294 → <code>ast</code> = i-node 18 → block 296 → <code>mbox</code> = i-node 20 → its content. On a cold cache that is seven disk reads (root i-node, root block, i-node 16, block 294, i-node 18, block 296, i-node 20) before the first byte of <code>mbox</code> can even be located; that is why the dentry and i-node caches (slide 23) matter. The reverse question — which name has i-node 20? — needs a search of every directory (<code>ncheck</code>). Finally <code>namei</code> shows the kernel's walk on the live system, including a symbolic link it must follow: <code>/etc/os-release</code> → <code>../usr/lib/os-release</code>.</p>
<p class="meo">🧠 Lookup permissions: to pass through a directory you need its <strong>x</strong> bit at every step (lesson 4.2). A "Permission denied" on <code>/a/b/c/file</code> may come from <code>b</code>, not from the file.</p>`,
        `<p class="y-chinh">🎯 Hình 4-34: các bước tra <code>/usr/ast/mbox</code> — thư mục gốc cho biết <code>usr</code> là i-node 6; i-node 6 cho biết <code>/usr</code> nằm ở khối 132; khối 132 cho biết <code>/usr/ast</code> là i-node 26; i-node 26 cho biết <code>/usr/ast</code> nằm ở khối 406; khối 406 cho biết <code>/usr/ast/mbox</code> là i-node 60.</p>
<p>Khi mở một tệp, hệ thống tệp tách đường dẫn ra từng thành phần một. i-node của gốc nằm ở một chỗ cố định đã biết trên đĩa. Từ đó thư mục gốc được đọc và tìm <code>usr</code>; ra một số i-node; i-node cho biết các khối của <code>/usr</code>; các khối đó được tìm <code>ast</code>; và cứ thế, cho tới khi i-node của <code>mbox</code> được nạp vào bộ nhớ, nơi nó ở lại tới khi tệp được đóng. Đường dẫn tương đối làm y như vậy nhưng xuất phát từ thư mục làm việc, còn <code>..</code> chỉ là thêm một mục cần tra.</p>
<p>➕ Hình 4-34 dựng lại trong ảnh ext2 và đi tay bằng debugfs — mỗi lệnh là một bước tra của nhân:</p>
<div class="out"># Dựng lại Hình 4-34: tra /usr/ast/mbox từng bước, đúng cách nhân làm<br>
$ mkfs.ext2 -q -b 1024 fs.img 4M<br>
Creating regular file fs.img<br>
# bước 1: thư mục gốc luôn là i-node 2 trên ext2 (V7 dùng i-node 1); đọc khối của nó và tìm "usr"<br>
$ debugfs -R "ls /" fs.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(12) bin<br>
&nbsp;13 &nbsp;(12) dev &nbsp;&nbsp;&nbsp;14 &nbsp;(12) lib &nbsp;&nbsp;&nbsp;15 &nbsp;(12) etc &nbsp;&nbsp;&nbsp;16 &nbsp;(12) usr<br>
&nbsp;17 &nbsp;(920) tmp<br>
# bước 2: i-node của /usr cho biết khối thư mục của nó ở đâu; đọc khối đó và tìm "ast"<br>
$ debugfs -R "blocks &lt;16&gt;" fs.img 2&gt;/dev/null<br>
294<br>
$ debugfs -R "ls &lt;16&gt;" fs.img 2&gt;/dev/null<br>
&nbsp;16 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;18 &nbsp;(12) ast &nbsp;&nbsp;&nbsp;19 &nbsp;(988) jim<br>
# bước 3: i-node của /usr/ast ⇒ khối của nó ⇒ mục "mbox"<br>
$ debugfs -R "blocks &lt;18&gt;" fs.img 2&gt;/dev/null<br>
296<br>
$ debugfs -R "ls &lt;18&gt;" fs.img 2&gt;/dev/null<br>
&nbsp;18 &nbsp;(12) . &nbsp;&nbsp;&nbsp;16 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;20 &nbsp;(1000) mbox<br>
$ debugfs -R "cat &lt;20&gt;" fs.img 2&gt;/dev/null<br>
From: prof<br>
# câu hỏi ngược (i-node ⇒ tên) phải lục mọi thư mục<br>
$ debugfs -R "ncheck 20" fs.img 2&gt;/dev/null<br>
Inode	Pathname<br>
20	/usr/ast/mbox<br>
# trên hệ đang chạy, namei(1) cho thấy từng thành phần nhân đi qua — kể cả liên kết mềm phải lần theo<br>
$ namei /etc/os-release<br>
f: /etc/os-release<br>
&nbsp;d /<br>
&nbsp;d etc<br>
&nbsp;l os-release -&gt; ../usr/lib/os-release<br>
&nbsp;&nbsp;&nbsp;d ..<br>
&nbsp;&nbsp;&nbsp;d usr<br>
&nbsp;&nbsp;&nbsp;d lib<br>
&nbsp;&nbsp;&nbsp;- os-release</div>
<p>Gốc (i-node 2 trên ext2) → <code>usr</code> = i-node 16 → khối 294 → <code>ast</code> = i-node 18 → khối 296 → <code>mbox</code> = i-node 20 → nội dung. Khi bộ đệm còn lạnh, đó là bảy lần đọc đĩa (i-node gốc, khối gốc, i-node 16, khối 294, i-node 18, khối 296, i-node 20) trước khi kịp biết byte đầu tiên của <code>mbox</code> nằm ở đâu; vì thế bộ đệm dentry và i-node (slide 23) mới quan trọng. Câu hỏi ngược — tên nào có i-node 20? — phải lục mọi thư mục (<code>ncheck</code>). Cuối cùng <code>namei</code> cho thấy nhân đi trên hệ thật, kể cả một liên kết mềm phải lần theo: <code>/etc/os-release</code> → <code>../usr/lib/os-release</code>.</p>
<p class="meo">🧠 Quyền khi tra: muốn đi xuyên qua một thư mục bạn cần bit <strong>x</strong> của nó ở mỗi bước (bài 4.2). Lỗi "Permission denied" với <code>/a/b/c/file</code> có thể đến từ <code>b</code>, không phải từ tệp.</p>`],
      [46, 'The ISO 9660 File System',
        `<p class="y-chinh">🎯 Figure 4-35: the <strong>ISO 9660 directory entry</strong> — directory entry length (1 byte), extended attribute record length (1), location of file (8), file size (8), date and time (7), flags (1), interleave (2), CD # (4), L = name length (1), file name (base name . ext ; version, 4–15 bytes), padding, and a system-use area.</p>
<p>ISO 9660 (1988) is the standard file system of CD-ROMs, designed so that every computer can read every CD. CDs are <strong>write-once</strong>, so files are stored <strong>contiguously</strong> (slide 18) — no free list is needed. Data is in 2048-byte logical blocks; the disc starts with 16 unused blocks and then the <em>primary volume descriptor</em>, which points to the root directory. Numbers that both Intel (little-endian) and Motorola/SPARC (big-endian) machines must read are stored <strong>twice</strong>, once in each byte order — that is why "location" and "size" take 8 bytes for a 32-bit value. Names: level 1 allows 8.3 names (+ ";1" version) and contiguous files; level 2 allows 31-character names; level 3 allows a file to consist of several extents. Directories may nest at most 8 levels.</p>
<p>➕ No CD burner in a container — but the format is plain bytes, so a C program can build one entry by hand:</p>
<pre><code class="language-c">// Figure 4-35: build one ISO 9660 directory entry by hand and print its bytes
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdint.h&gt;

static void both32(uint8_t *p, uint32_t v) {          // "both-endian": little-endian copy, then big-endian copy
    for (int i = 0; i &lt; 4; i++) { p[i] = v &gt;&gt; (8 * i); p[7 - i] = v &gt;&gt; (8 * i); }
}

int main(void) {
    const char *name = "README.TXT;1";             // 8.3 name + ";1" = version number
    uint8_t e[64] = { 0 };
    int L = strlen(name);
    e[0] = 33 + L + (L % 2 == 0);                     // directory entry length (padded to an even size)
    e[1] = 0;                                         // extended attribute record length
    both32(e + 2, 23);                                // location of file: first logical block (2 KB each on a CD)
    both32(e + 10, 5000);                             // file size in bytes
    uint8_t when[7] = { 126, 10, 26, 9, 15, 0, 28 };  // years since 1900, month, day, hour, min, sec, offset in 15-min units (+7 h)
    memcpy(e + 18, when, 7);
    e[25] = 0;                                        // flags: 0 = ordinary file, 2 = directory
    e[26] = 0; e[27] = 0;                             // interleave (unit size, gap)
    e[28] = 1; e[31] = 1;                             // CD number = volume sequence number 1 (both-endian 16 bits)
    e[32] = L;                                        // L = length of the name
    memcpy(e + 33, name, L);
    for (int i = 0; i &lt; e[0]; i++) printf("%02x%s", e[i], (i % 16 == 15) ? "\\n" : " ");
    printf("\\nentry length %d bytes; location %u (LE) / %u (BE); size %u; date %d-%02d-%02d; name %.*s\\n",
           e[0], e[2] | e[3] &lt;&lt; 8 | e[4] &lt;&lt; 16 | (uint32_t)e[5] &lt;&lt; 24,
           (uint32_t)e[6] &lt;&lt; 24 | e[7] &lt;&lt; 16 | e[8] &lt;&lt; 8 | e[9],
           e[10] | e[11] &lt;&lt; 8 | e[12] &lt;&lt; 16 | (uint32_t)e[13] &lt;&lt; 24, 1900 + e[18], e[19], e[20], e[32], e + 33);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread iso-muc.c -o iso-muc &amp;&amp; ./iso-muc<br>
2e 00 17 00 00 00 00 00 00 17 88 13 00 00 00 00<br>
13 88 7e 0a 1a 09 0f 00 1c 00 00 00 01 00 00 01<br>
0c 52 45 41 44 4d 45 2e 54 58 54 3b 31 00<br>
entry length 46 bytes; location 23 (LE) / 23 (BE); size 5000; date 2026-10-26; name README.TXT;1</div>
<p>Byte 0 = 0x2e = 46, the entry length; bytes 2–9 = <code>17 00 00 00 00 00 00 17</code>: block 23 written little-endian then big-endian; bytes 10–17 the size 5000 the same way; bytes 18–24 the date (126 = years since 1900 → 2026, month 10, day 26, then time and the time-zone offset 28 × 15 min = +7 h); byte 32 = 12 = name length, then <code>README.TXT;1</code>.</p>
<p>➕ Out of date: optical discs have almost disappeared from PCs, but the <code>.iso</code> file has not — Linux and Windows installers are distributed as ISO 9660 (+ UDF) images and mounted as loop devices. DVDs and Blu-ray discs use <strong>UDF</strong> (Universal Disk Format) instead. FE1 question 6: the level that allows a file to consist of several extents is <strong>Level 3</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 4-35: <strong>mục thư mục ISO 9660</strong> — độ dài mục (1 byte), độ dài bản ghi thuộc tính mở rộng (1), vị trí tệp (8), cỡ tệp (8), ngày giờ (7), cờ (1), interleave (2), số CD (4), L = độ dài tên (1), tên tệp (tên gốc . đuôi ; phiên bản, 4–15 byte), byte đệm, và một vùng dành cho hệ thống (system use).</p>
<p>ISO 9660 (1988) là hệ thống tệp chuẩn của CD-ROM, thiết kế để máy nào cũng đọc được đĩa nào. CD là phương tiện <strong>ghi một lần</strong>, nên tệp được lưu <strong>liên tục</strong> (slide 18) — không cần danh sách khối trống. Dữ liệu nằm trong các khối logic 2048 byte; đĩa mở đầu bằng 16 khối không dùng rồi tới <em>primary volume descriptor</em>, trỏ tới thư mục gốc. Các số mà cả máy Intel (little-endian) lẫn Motorola/SPARC (big-endian) phải đọc được thì được ghi <strong>hai lần</strong>, mỗi lần theo một thứ tự byte — vì thế "vị trí" và "cỡ" chiếm 8 byte cho một giá trị 32 bit. Tên: mức 1 cho tên 8.3 (+ phiên bản ";1") và tệp liên tục; mức 2 cho tên 31 ký tự; mức 3 cho một tệp gồm nhiều extent. Thư mục lồng nhau tối đa 8 tầng.</p>
<p>➕ Container không có ổ ghi CD — nhưng định dạng chỉ là byte, nên một chương trình C tự dựng được một mục:</p>
<pre><code class="language-c">// Hình 4-35: tự dựng một mục thư mục ISO 9660 và in ra từng byte
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdint.h&gt;

static void both32(uint8_t *p, uint32_t v) {          // "hai chiều": bản little-endian rồi bản big-endian
    for (int i = 0; i &lt; 4; i++) { p[i] = v &gt;&gt; (8 * i); p[7 - i] = v &gt;&gt; (8 * i); }
}

int main(void) {
    const char *name = "README.TXT;1";             // tên 8.3 + ";1" = số phiên bản
    uint8_t e[64] = { 0 };
    int L = strlen(name);
    e[0] = 33 + L + (L % 2 == 0);                     // độ dài mục (đệm cho chẵn)
    e[1] = 0;                                         // độ dài bản ghi thuộc tính mở rộng
    both32(e + 2, 23);                                // vị trí tệp: khối logic đầu (mỗi khối 2 KB trên CD)
    both32(e + 10, 5000);                             // cỡ tệp tính bằng byte
    uint8_t when[7] = { 126, 10, 26, 9, 15, 0, 28 };  // năm từ 1900, tháng, ngày, giờ, phút, giây, độ lệch theo 15 phút (+7 giờ)
    memcpy(e + 18, when, 7);
    e[25] = 0;                                        // cờ: 0 = tệp thường, 2 = thư mục
    e[26] = 0; e[27] = 0;                             // interleave (cỡ đơn vị, khoảng hở)
    e[28] = 1; e[31] = 1;                             // số CD = số thứ tự đĩa 1 (16 bit hai chiều)
    e[32] = L;                                        // L = độ dài tên
    memcpy(e + 33, name, L);
    for (int i = 0; i &lt; e[0]; i++) printf("%02x%s", e[i], (i % 16 == 15) ? "\\n" : " ");
    printf("\\nentry length %d bytes; location %u (LE) / %u (BE); size %u; date %d-%02d-%02d; name %.*s\\n",
           e[0], e[2] | e[3] &lt;&lt; 8 | e[4] &lt;&lt; 16 | (uint32_t)e[5] &lt;&lt; 24,
           (uint32_t)e[6] &lt;&lt; 24 | e[7] &lt;&lt; 16 | e[8] &lt;&lt; 8 | e[9],
           e[10] | e[11] &lt;&lt; 8 | e[12] &lt;&lt; 16 | (uint32_t)e[13] &lt;&lt; 24, 1900 + e[18], e[19], e[20], e[32], e + 33);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread iso-muc.c -o iso-muc &amp;&amp; ./iso-muc<br>
2e 00 17 00 00 00 00 00 00 17 88 13 00 00 00 00<br>
13 88 7e 0a 1a 09 0f 00 1c 00 00 00 01 00 00 01<br>
0c 52 45 41 44 4d 45 2e 54 58 54 3b 31 00<br>
entry length 46 bytes; location 23 (LE) / 23 (BE); size 5000; date 2026-10-26; name README.TXT;1</div>
<p>Byte 0 = 0x2e = 46, độ dài mục; byte 2–9 = <code>17 00 00 00 00 00 00 17</code>: khối 23 ghi little-endian rồi big-endian; byte 10–17 là cỡ 5000 theo cùng cách; byte 18–24 là ngày (126 = số năm kể từ 1900 → 2026, tháng 10, ngày 26, rồi giờ và độ lệch múi giờ 28 × 15 phút = +7 giờ); byte 32 = 12 = độ dài tên, rồi <code>README.TXT;1</code>.</p>
<p>➕ Đã lỗi thời: đĩa quang gần như biến mất khỏi PC, nhưng tệp <code>.iso</code> thì chưa — bộ cài Linux và Windows được phát hành dưới dạng ảnh ISO 9660 (+ UDF) và được mount như thiết bị loop. DVD và Blu-ray dùng <strong>UDF</strong> (Universal Disk Format). FE1 câu 6: mức cho phép một tệp gồm nhiều extent là <strong>Level 3</strong>.</p>`],
      [47, 'Rock Ridge Extensions',
        `<p class="y-chinh">🎯 The <strong>Rock Ridge</strong> extensions add UNIX features to ISO 9660, stored in the system-use area of each entry: PX — POSIX attributes; PN — major and minor device numbers; SL — symbolic link; NM — alternative name; CL — child location; PL — parent location; RE — relocation; TF — time stamps. ⚠️ The slide numbers them "1. 2. 3. 5. 5. 5. 5. 5." — the same PowerPoint bug as slides 9 and 16; they are items 1 to 8.</p>
<p>Plain ISO 9660 cannot represent what a UNIX file system needs, so a UNIX group defined extensions that old readers simply ignore (they only see the system-use bytes as padding). <strong>PX</strong> carries the rwx bits, owner (UID) and group (GID); <strong>PN</strong> lets a CD contain special files (<code>/dev</code> entries); <strong>SL</strong> stores a symbolic link; <strong>NM</strong> gives a second, long and case-sensitive name next to the 8.3 one; <strong>CL</strong>, <strong>PL</strong> and <strong>RE</strong> work around the 8-level nesting limit — a deep directory is relocated higher in the tree and these entries record where it really belongs; <strong>TF</strong> stores the UNIX times (creation, modification, access).</p>
<p>➕ This is why a Linux install ISO, mounted on Linux, shows long names, symlinks and permissions, while a minimal ISO 9660 reader sees only upper-case 8.3 names.</p>
<p class="pitfall">⚠️ FE2 question 26: "Which extension field provides an alternative name for a file or directory?" — <strong>NM (Alternate Name)</strong>.</p>`,
        `<p class="y-chinh">🎯 Phần mở rộng <strong>Rock Ridge</strong> thêm tính năng UNIX vào ISO 9660, lưu trong vùng system-use của mỗi mục: PX — thuộc tính POSIX; PN — số thiết bị major và minor; SL — liên kết mềm; NM — tên thay thế; CL — vị trí con; PL — vị trí cha; RE — tái định vị; TF — mốc thời gian. ⚠️ Slide đánh số "1. 2. 3. 5. 5. 5. 5. 5." — cùng lỗi PowerPoint như slide 9 và 16; đúng ra là mục 1 tới 8.</p>
<p>ISO 9660 trơn không biểu diễn được những gì một hệ thống tệp UNIX cần, nên một nhóm UNIX định nghĩa các phần mở rộng mà trình đọc cũ chỉ đơn giản là bỏ qua (chúng coi các byte system-use như byte đệm). <strong>PX</strong> mang bit rwx, chủ (UID) và nhóm (GID); <strong>PN</strong> cho CD chứa được tệp đặc biệt (các mục <code>/dev</code>); <strong>SL</strong> lưu một liên kết mềm; <strong>NM</strong> cho một tên thứ hai, dài và phân biệt hoa thường, bên cạnh tên 8.3; <strong>CL</strong>, <strong>PL</strong> và <strong>RE</strong> lách giới hạn lồng 8 tầng — một thư mục quá sâu được dời lên cao hơn trong cây và các mục này ghi lại chỗ thật của nó; <strong>TF</strong> lưu các mốc thời gian UNIX (tạo, sửa, truy cập).</p>
<p>➕ Đó là lý do một ISO cài đặt Linux mount trên Linux thì hiện tên dài, liên kết mềm và quyền, còn một trình đọc ISO 9660 tối giản chỉ thấy tên 8.3 viết hoa.</p>
<p class="pitfall">⚠️ FE2 câu 26: "Trường mở rộng nào cung cấp tên thay thế cho tệp hay thư mục?" — <strong>NM (Alternate Name)</strong>.</p>`],
      [48, 'Joliet Extensions',
        `<p class="y-chinh">🎯 The <strong>Joliet</strong> extensions (Microsoft) add to ISO 9660: (1) long file names; (2) the Unicode character set; (3) directory nesting deeper than eight levels; (4) directory names with extensions.</p>
<p>Microsoft wanted CDs to carry the long Windows 95 names, so Joliet adds a second directory tree (a "supplementary volume descriptor") in which names are stored in Unicode (UCS-2, up to 64 characters) — making non-Latin names such as Vietnamese or Japanese possible. A Joliet-aware reader uses the second tree; an old reader still sees the plain ISO 9660 tree. Rock Ridge (UNIX) and Joliet (Windows) can both be on the same disc, which is what CD-authoring tools usually do.</p>
<p>➕ The same pattern — a minimal standard everyone reads, plus extensions in fields old readers ignore — appears again and again: VFAT long names hidden in FAT entries (slide 41), ext4 features flagged in the superblock so ext2 tools refuse what they do not understand, HTTP headers. For DVDs, both were replaced by UDF.</p>
<p class="meo">🧠 Chapter summary in one line: <strong>files</strong> (names, attributes, operations) → <strong>directories</strong> (trees, paths, links) → <strong>implementation</strong> (layout, allocation, free space) → <strong>reliability and speed</strong> (journal, fsck, backup, cache) → <strong>real systems</strong> (FAT, UNIX V7/ext, ISO 9660).</p>`,
        `<p class="y-chinh">🎯 Phần mở rộng <strong>Joliet</strong> (của Microsoft) thêm vào ISO 9660: (1) tên tệp dài; (2) bộ ký tự Unicode; (3) thư mục lồng sâu hơn tám tầng; (4) tên thư mục có phần mở rộng.</p>
<p>Microsoft muốn CD mang được tên dài của Windows 95, nên Joliet thêm một cây thư mục thứ hai (một "supplementary volume descriptor") trong đó tên được lưu bằng Unicode (UCS-2, tối đa 64 ký tự) — nhờ vậy tên không phải chữ Latin như tiếng Việt hay tiếng Nhật mới lưu được. Trình đọc hiểu Joliet dùng cây thứ hai; trình đọc cũ vẫn thấy cây ISO 9660 trơn. Rock Ridge (UNIX) và Joliet (Windows) có thể cùng nằm trên một đĩa, và các công cụ ghi CD thường làm vậy.</p>
<p>➕ Cùng một khuôn mẫu — một chuẩn tối thiểu ai cũng đọc được, cộng phần mở rộng đặt trong các trường mà trình đọc cũ bỏ qua — gặp đi gặp lại: tên dài VFAT giấu trong các mục FAT (slide 41), tính năng ext4 đánh dấu trong superblock để công cụ ext2 từ chối thứ nó không hiểu, các header HTTP. Với DVD, cả hai được thay bằng UDF.</p>
<p class="meo">🧠 Tóm tắt chương trong một dòng: <strong>tệp</strong> (tên, thuộc tính, thao tác) → <strong>thư mục</strong> (cây, đường dẫn, liên kết) → <strong>cài đặt</strong> (bố cục, cấp phát, chỗ trống) → <strong>tin cậy và tốc độ</strong> (nhật ký, fsck, sao lưu, bộ đệm) → <strong>hệ thống thật</strong> (FAT, UNIX V7/ext, ISO 9660).</p>`],
      [49, 'End',
        `<p class="y-chinh">🎯 End of Chapter 4 — you can now explain what a file system does, how it stores files on a disk of numbered blocks, how it keeps them safe and fast, and how three real file systems are built.</p>
<p>Check yourself before moving on: can you compare contiguous, linked, FAT and i-node allocation (slides 18–21)? compute the maximum file size of an i-node (slide 44) and the maximum FAT partition (slide 42)? explain hard vs symbolic links (slides 24–25), journaling (slide 26), the free list vs the bitmap (slide 31), the four repairs of fsck (slide 37) and the four phases of a logical dump (slide 36)? Then do practice lesson 4.C and the Chapter 4 quiz.</p>
<p class="meo">🧠 Next: Chapter 5 (Input/Output) goes one level down — how the driver turns "read block k" into commands for a real disk, and how disk-arm scheduling (FCFS, SSF, elevator) decides the order of the requests this chapter generates.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 4 — giờ bạn giải thích được hệ thống tệp làm gì, nó lưu tệp trên một cái đĩa gồm các khối đánh số ra sao, giữ chúng an toàn và nhanh thế nào, và ba hệ thống tệp có thật được xây ra sao.</p>
<p>Tự kiểm trước khi đi tiếp: bạn có so sánh được cấp phát liên tục, liên kết, FAT và i-node (slide 18–21) không? tính được cỡ tệp tối đa của i-node (slide 44) và cỡ phân vùng FAT tối đa (slide 42)? giải thích được liên kết cứng và mềm (slide 24–25), nhật ký (slide 26), danh sách khối trống và bitmap (slide 31), bốn cách sửa của fsck (slide 37) và bốn pha của sao lưu logic (slide 36)? Rồi làm bài thực hành 4.C và quiz Chương 4.</p>
<p class="meo">🧠 Tiếp theo: Chương 5 (Nhập/Xuất) đi xuống thêm một tầng — driver biến "đọc khối k" thành lệnh cho một cái đĩa thật thế nào, và lập lịch cánh tay đĩa (FCFS, SSF, thang máy) quyết định thứ tự các yêu cầu mà chương này tạo ra ra sao.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 4, sections 4.4–4.5, Figures 4-20 to 4-35', 'Chương 4, mục 4.4–4.5, Hình 4-20 tới 4-35'],
      ['mchoes', 'Chapter 8 "File Management" (record formats, data compression, access control)', 'Chương 8 "File Management" (định dạng bản ghi, nén dữ liệu, kiểm soát truy cập)'],
      ['ostep', 'Chapter 41 "Locality and The Fast File System" (cylinder groups) and Chapter 42 "Crash Consistency: FSCK and Journaling"', 'Chương 41 "Locality and The Fast File System" (nhóm cylinder) và Chương 42 "Crash Consistency: FSCK and Journaling"'],
      ['man7', 'e2fsck(8), debugfs(8) (testb, ffb, setb, sif, lq, bd, ncheck), dumpe2fs(8), mkfs.vfat(8), tar(1) --listed-incremental, sync(2), fsync(2), proc(5) for /proc/sys/vm/dirty_*', 'e2fsck(8), debugfs(8) (testb, ffb, setb, sif, lq, bd, ncheck), dumpe2fs(8), mkfs.vfat(8), tar(1) --listed-incremental, sync(2), fsync(2), proc(5) cho /proc/sys/vm/dirty_*'],
      ['kernelDocs', 'ext4 documentation: "Block Groups" (flex_bg), "Blocks" (size limits), "The Contents of inode.i_block" (block maps vs extents)', 'tài liệu ext4: "Block Groups" (flex_bg), "Blocks" (giới hạn cỡ), "The Contents of inode.i_block" (block map và extent)'],
      ['win32', 'exFAT file system specification (learn.microsoft.com) — the 64-bit successor of FAT-32', 'Đặc tả hệ thống tệp exFAT (learn.microsoft.com) — người kế nhiệm 64 bit của FAT-32'],
    ]),
  ].join('\n'),
};

/* ───────── 4.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 4: i-node sizes, FAT, block size, links, server incidents ───────── */
const L_on_ch4 = {
  title: '4.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 4: i-node sizes, FAT, block size, links, server incidents|||4.C — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 4: cỡ tệp i-node, FAT, cỡ khối, liên kết, sự cố máy chủ',
  slug: 'osg202-on-ch4',
  type: 'VIDEO',
  description: '7 bài tập Chương 4 có lời giải chạy thật: tính cỡ tệp tối đa với i-node theo đúng ba dạng đề FE (do bộ mô phỏng tính), tìm khối chứa byte thứ N và số lần đọc đĩa rồi kiểm bằng debugfs trên ext2 thật, cỡ phân vùng FAT tối đa và lần theo chuỗi FAT, các phép tính về cỡ khối (hiệu suất dùng chỗ, phân mảnh trong, danh sách khối trống và bitmap), đoán số liên kết của tệp và thư mục, sự cố "hết chỗ" vì hết i-node và tệp log đã xoá vẫn chiếm đĩa trên máy chủ Linux; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.C · Practice &amp; review</span>
<h2>Seven exercises: the chapter's calculations and two real server incidents</h2>
<p class="lead">The FE tests Chapter 4 in two ways: definitions (which allocation method, what a directory contains) and calculations (maximum file size, FAT partition size, space efficiency). Exercises 1–4 cover every calculation type with answers computed by the course simulators and checked on real file systems; exercises 5–7 are Linux skills a backend developer needs — predicting link counts, and two classic "the disk is full" incidents. Try each one first (the time is a target), then open the solution.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>maximum file size of an i-node (three FE variants)</td><td>4.A slide 21, 4.B slide 44</td></tr>
<tr><td>2</td><td>which block holds byte N, how many disk reads</td><td>4.B slide 44</td></tr>
<tr><td>3</td><td>FAT partition limits and following a FAT chain</td><td>4.A slide 20, 4.B slide 42</td></tr>
<tr><td>4</td><td>block size: efficiency, internal fragmentation, free list vs bitmap</td><td>4.B slides 30–31</td></tr>
<tr><td>5</td><td>link counts of files and directories</td><td>4.A slides 24–25</td></tr>
<tr><td>6</td><td>"No space left on device" with free space — inode exhaustion</td><td>4.A slide 21, lesson 4.2</td></tr>
<tr><td>7</td><td>a deleted file that still fills the disk</td><td>4.A slide 25</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.C · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: các phép tính của chương và hai sự cố máy chủ có thật</h2>
<p class="lead">FE kiểm Chương 4 theo hai kiểu: định nghĩa (cách cấp phát nào, thư mục chứa gì) và tính toán (cỡ tệp tối đa, cỡ phân vùng FAT, hiệu suất dùng chỗ). Bài 1–4 phủ mọi dạng tính toán, đáp án do bộ mô phỏng của môn tính và được kiểm trên hệ thống tệp thật; bài 5–7 là kỹ năng Linux một dev backend cần — đoán số liên kết, và hai sự cố "đầy đĩa" kinh điển. Tự làm từng bài trước (thời gian ghi kèm là mục tiêu), rồi mới mở lời giải.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>cỡ tệp tối đa của i-node (ba biến thể đề FE)</td><td>4.A slide 21, 4.B slide 44</td></tr>
<tr><td>2</td><td>byte thứ N nằm ở khối nào, mấy lần đọc đĩa</td><td>4.B slide 44</td></tr>
<tr><td>3</td><td>giới hạn phân vùng FAT và lần theo chuỗi FAT</td><td>4.A slide 20, 4.B slide 42</td></tr>
<tr><td>4</td><td>cỡ khối: hiệu suất, phân mảnh trong, danh sách trống và bitmap</td><td>4.B slide 30–31</td></tr>
<tr><td>5</td><td>số liên kết của tệp và thư mục</td><td>4.A slide 24–25</td></tr>
<tr><td>6</td><td>"No space left on device" khi còn chỗ — hết i-node</td><td>4.A slide 21, bài 4.2</td></tr>
<tr><td>7</td><td>tệp đã xoá mà vẫn chiếm đĩa</td><td>4.A slide 25</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — the largest possible file (15 min)</h3>
<p>All blocks are 1 KB and disk addresses are 4 bytes. Compute the largest possible file for each i-node: (a) 10 direct addresses + one single indirect address (FE21 question 16); (b) 10 direct addresses + one <em>double</em> indirect address and no single indirect (FE25 question 48); (c) only 10 direct addresses, but blocks of 1024 KB (FE26 question 49).</p>
<details><summary>Solution — computed by the simulator</summary>
<p>Step 1: numbers per indirect block P = block size / address size = 1024 / 4 = 256. Step 2: add up the blocks each level can reach: direct = 10, single = P, double = P², triple = P³. Step 3: multiply by the block size.</p>
<p>(a) 10 + 256 = 266 blocks → <strong>266 KB</strong> (the picture is in lesson 4.A, slide 21).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/567a6fbf323b360260b1918e930b18cc0455d932.svg" alt="(b) 10 direct + a double indirect only: 10 + 256 × 256 = 65,546 blocks" loading="lazy" /><p class="chu-thich">🧮 (b) 10 direct + a double indirect only: 10 + 256 × 256 = 65,546 blocks</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // block numbers per indirect block
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [level, blocks reachable]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5d43090e575ea4667b15901cf0f2b2d73776fd94.svg" alt="(c) 10 direct pointers to 1024 KB blocks: 10 MB" loading="lazy" /><p class="chu-thich">🧮 (c) 10 direct pointers to 1024 KB blocks: 10 MB</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // block numbers per indirect block
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [level, blocks reachable]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>(b) the double indirect block points to 256 single indirect blocks, each pointing to 256 data blocks: 65,536 blocks, plus the 10 direct = <strong>65,546 KB</strong> — the trap answer 65,536 KB forgets the direct blocks. (c) no indirection at all: 10 × 1024 KB = <strong>10 MB</strong>. The FE25 image cut off the block size; 1 KB is the only value consistent with the options.</p>
</details>`,
    `<h3>🧪 Bài 1 — tệp lớn nhất có thể (15 phút)</h3>
<p>Mọi khối là 1 KB và địa chỉ đĩa 4 byte. Tính cỡ tệp lớn nhất với mỗi i-node: (a) 10 địa chỉ trực tiếp + một địa chỉ gián tiếp đơn (FE21 câu 16); (b) 10 địa chỉ trực tiếp + một địa chỉ gián tiếp <em>đôi</em>, không có gián tiếp đơn (FE25 câu 48); (c) chỉ 10 địa chỉ trực tiếp, nhưng khối 1024 KB (FE26 câu 49).</p>
<details><summary>Lời giải — do bộ mô phỏng tính</summary>
<p>Bước 1: số hiệu trong mỗi khối gián tiếp P = cỡ khối / cỡ địa chỉ = 1024 / 4 = 256. Bước 2: cộng số khối mỗi tầng với tới được: trực tiếp = 10, đơn = P, đôi = P², ba = P³. Bước 3: nhân với cỡ khối.</p>
<p>(a) 10 + 256 = 266 khối → <strong>266 KB</strong> (hình ở bài 4.A, slide 21).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6a7623865f6c73b229129d2d662b8b2084074240.svg" alt="(b) 10 trực tiếp + chỉ một gián tiếp đôi: 10 + 256 × 256 = 65.546 khối" loading="lazy" /><p class="chu-thich">🧮 (b) 10 trực tiếp + chỉ một gián tiếp đôi: 10 + 256 × 256 = 65.546 khối</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // số hiệu khối trong một khối gián tiếp
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [mức, số khối với tới được]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3e02d5e366b7ccedfadce7bc62aee8bcfe935016.svg" alt="(c) 10 con trỏ trực tiếp tới khối 1024 KB: 10 MB" loading="lazy" /><p class="chu-thich">🧮 (c) 10 con trỏ trực tiếp tới khối 1024 KB: 10 MB</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIEN = {
  v7: { truc: 10, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-1k': { truc: 12, muc: [1, 2, 3], khoiKB: 1, so: 4 },
  'ext2-4k': { truc: 12, muc: [1, 2, 3], khoiKB: 4, so: 4 },
  fe21: { truc: 10, muc: [1], khoiKB: 1, so: 4 },
  fe25: { truc: 10, muc: [2], khoiKB: 1, so: 4 },
  fe26: { truc: 10, muc: [], khoiKB: 1024, so: 4 },
};
function coToiDa({ truc, muc, khoiKB, so }) {
  const P = (khoiKB * 1024) / so;                     // số hiệu khối trong một khối gián tiếp
  const phan = [[0, truc], ...muc.map((m) =&gt; [m, P ** m])];   // [mức, số khối với tới được]
  const khoi = phan.reduce((s, [, n]) =&gt; s + n, 0);
  return { P, phan, khoi, KB: khoi * khoiKB };
}</code></pre></details>
<p>(b) khối gián tiếp đôi trỏ tới 256 khối gián tiếp đơn, mỗi khối trỏ tới 256 khối dữ liệu: 65.536 khối, cộng 10 khối trực tiếp = <strong>65.546 KB</strong> — phương án bẫy 65.536 KB quên mất các khối trực tiếp. (c) không có gián tiếp nào: 10 × 1024 KB = <strong>10 MB</strong>. Ảnh đề FE25 bị mất chữ ở cỡ khối; 1 KB là giá trị duy nhất khớp với các phương án.</p>
</details>`),
    bi(`<h3>🧪 Exercise 2 — where is byte N, and how many disk reads? (15 min)</h3>
<p>An ext2 file system has 1 KB blocks, 12 direct pointers and 4-byte block numbers. For logical blocks 11, 12, 267, 268 and 65,804 of a file, say which part of the i-node tree holds them. How many disk reads does it take to read byte 307,200 if the i-node is already in memory?</p>
<details><summary>Solution — simulator, then checked with debugfs on a real image</summary>
<p>Ranges: direct 0–11; single indirect 12 … 12 + 256 − 1 = 267; double 268 … 268 + 65,536 − 1 = 65,803; triple from 65,804. So 11 is the last direct block, 12 the first through IND, 267 the last through IND, 268 the first through DIND, 65,804 the first through TIND. Byte 307,200 = 307,200 / 1024 = logical block 300 → double indirect:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c84310b2853da2550803823740bdcc65bbc2a201.svg" alt="Byte 307,200 = logical block 300: DIND slot 0 → IND slot 32 → data: 3 reads" loading="lazy" /><p class="chu-thich">🧮 Byte 307,200 = logical block 300: DIND slot 0 → IND slot 32 → data: 3 reads</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">function viTri(N, khoi, truc = 12, so = 4) {
  const P = khoi / so;
  let b = Math.floor(N / khoi);                       // logical block number
  const logic = b;
  if (b &lt; truc) return { logic, muc: 0, chiSo: [b] };
  b -= truc;
  for (let m = 1; m &lt;= 3; m++) {
    const tam = P ** m;                               // blocks reachable through this level
    if (b &lt; tam) {
      const chiSo = [];                               // index inside each pointer block, top level first
      for (let k = m - 1; k &gt;= 0; k--) chiSo.push(Math.floor(b / P ** k) % P);
      return { logic, muc: m, chiSo, viTriTrongVung: b };
    }
    b -= tam;
  }
  throw new Error('quá cỡ tệp tối đa');
}</code></pre></details>
<p>The same five boundary blocks written into a real ext2 image — the pointer blocks debugfs lists show exactly which levels were needed:</p>
<div class="out"># Exercise 2 checked on a real ext2 file system (1 KB blocks): where do logical blocks 11, 12, 267, 268 and 65804 live?<br>
$ mkfs.ext2 -q -b 1024 fs.img 8M<br>
Creating regular file fs.img<br>
$ debugfs -w -R "write f f" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
# the i-node's own view: which pointer blocks were needed<br>
$ debugfs -R "stat f" fs.img 2&gt;/dev/null | grep -E '^\\(|TOTAL'<br>
(11):562, (IND):563, (12):564, (267):565, (DIND):566, (IND):567, (268):568, (TIND):569, (DIND):570, (IND):571, (65804):572<br>
TOTAL: 11<br>
# bmap = "logical block k of this file is physical block …"<br>
$ for k in 11 12 267 268 65804; do echo "logical $k -&gt; physical $(debugfs -R "bmap f $k" fs.img 2&gt;/dev/null)"; done<br>
logical 11 -&gt; physical 562<br>
logical 12 -&gt; physical 564<br>
logical 267 -&gt; physical 565<br>
logical 268 -&gt; physical 568<br>
logical 65804 -&gt; physical 572</div>
<p>Block 11 sits directly after the i-node; 12 and 267 share one (IND) block; 268 needs (DIND) → (IND); 65,804 needs (TIND) → (DIND) → (IND). Five data blocks cost six pointer blocks (TOTAL 11) — a sparse file with data far apart is the worst case for indirect blocks, and the reason ext4 switched to extents.</p>
</details>`,
    `<h3>🧪 Bài 2 — byte thứ N nằm đâu, mấy lần đọc đĩa? (15 phút)</h3>
<p>Một hệ thống tệp ext2 có khối 1 KB, 12 con trỏ trực tiếp và số hiệu khối 4 byte. Với các khối logic 11, 12, 267, 268 và 65.804 của một tệp, hãy nói phần nào của cây i-node giữ chúng. Đọc byte 307.200 tốn mấy lần đọc đĩa nếu i-node đã nằm trong bộ nhớ?</p>
<details><summary>Lời giải — bộ mô phỏng, rồi kiểm bằng debugfs trên ảnh thật</summary>
<p>Các dải: trực tiếp 0–11; gián tiếp đơn 12 … 12 + 256 − 1 = 267; đôi 268 … 268 + 65.536 − 1 = 65.803; ba từ 65.804. Vậy 11 là khối trực tiếp cuối, 12 là khối đầu qua IND, 267 là khối cuối qua IND, 268 là khối đầu qua DIND, 65.804 là khối đầu qua TIND. Byte 307.200 = 307.200 / 1024 = khối logic 300 → gián tiếp đôi:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f71a439f01d28edd4737e8717827627be016fb69.svg" alt="Byte 307.200 = khối logic 300: DIND ô 0 → IND ô 32 → dữ liệu: 3 lần đọc" loading="lazy" /><p class="chu-thich">🧮 Byte 307.200 = khối logic 300: DIND ô 0 → IND ô 32 → dữ liệu: 3 lần đọc</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">function viTri(N, khoi, truc = 12, so = 4) {
  const P = khoi / so;
  let b = Math.floor(N / khoi);                       // số hiệu khối logic
  const logic = b;
  if (b &lt; truc) return { logic, muc: 0, chiSo: [b] };
  b -= truc;
  for (let m = 1; m &lt;= 3; m++) {
    const tam = P ** m;                               // số khối với tới qua mức này
    if (b &lt; tam) {
      const chiSo = [];                               // chỉ số trong từng khối con trỏ, từ mức trên xuống
      for (let k = m - 1; k &gt;= 0; k--) chiSo.push(Math.floor(b / P ** k) % P);
      return { logic, muc: m, chiSo, viTriTrongVung: b };
    }
    b -= tam;
  }
  throw new Error('quá cỡ tệp tối đa');
}</code></pre></details>
<p>Đúng năm khối ranh giới đó được ghi vào một ảnh ext2 thật — các khối con trỏ debugfs liệt kê cho thấy đã cần những tầng nào:</p>
<div class="out"># Bài 2 kiểm trên ext2 thật (khối 1 KB): khối logic 11, 12, 267, 268 và 65804 nằm ở đâu?<br>
$ mkfs.ext2 -q -b 1024 fs.img 8M<br>
Creating regular file fs.img<br>
$ debugfs -w -R "write f f" fs.img 2&gt;/dev/null<br>
Allocated inode: 12<br>
# góc nhìn của chính i-node: đã cần những khối con trỏ nào<br>
$ debugfs -R "stat f" fs.img 2&gt;/dev/null | grep -E '^\\(|TOTAL'<br>
(11):562, (IND):563, (12):564, (267):565, (DIND):566, (IND):567, (268):568, (TIND):569, (DIND):570, (IND):571, (65804):572<br>
TOTAL: 11<br>
# bmap = "khối logic k của tệp này là khối vật lý …"<br>
$ for k in 11 12 267 268 65804; do echo "logical $k -&gt; physical $(debugfs -R "bmap f $k" fs.img 2&gt;/dev/null)"; done<br>
logical 11 -&gt; physical 562<br>
logical 12 -&gt; physical 564<br>
logical 267 -&gt; physical 565<br>
logical 268 -&gt; physical 568<br>
logical 65804 -&gt; physical 572</div>
<p>Khối 11 nằm ngay sau i-node; 12 và 267 dùng chung một khối (IND); 268 cần (DIND) → (IND); 65.804 cần (TIND) → (DIND) → (IND). Năm khối dữ liệu tốn sáu khối con trỏ (TOTAL 11) — tệp thưa có dữ liệu nằm xa nhau là trường hợp tệ nhất của khối gián tiếp, và là lý do ext4 chuyển sang extent.</p>
</details>`),
    bi(`<h3>🧪 Exercise 3 — FAT limits and FAT chains (15 min)</h3>
<p>(a) What is the maximum partition size for FAT-12 with 2 KB blocks (FE21 question 9) and for FAT-32 with 4 KB blocks (FE22 question 38)? (b) A FAT with 1 KB blocks has FAT[2] = 9, FAT[3] = −1, FAT[5] = 3, FAT[8] = 12, FAT[9] = 5, FAT[12] = −1, FAT[14] = 8. File A starts at block 2, file B at block 14. Write both chains; in which physical block is byte 3000 of file A?</p>
<details><summary>Solution — simulator for (a), a program for (b)</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/749e1930429c406a6a105e1b1ce232d670c4eb7c.svg" alt="FAT-12, 2 KB blocks: 4096 × 2 KB = 8 MB" loading="lazy" /><p class="chu-thich">🧮 FAT-12, 2 KB blocks: 4096 × 2 KB = 8 MB</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIT = { fat12: 12, fat16: 16, fat32: 28 };
const CHO_PHEP = { fat12: [0.5, 1, 2, 4], fat16: [2, 4, 8, 16, 32], fat32: [4, 8, 16, 32] };   // Figure 4-31's non-empty cells
const TRAN_MBR_KB = 2 ** 32 * 512 / 1024;              // 2 TB expressed in KB
function toiDa(loai, khoiKB) {
  if (!CHO_PHEP[loai].includes(khoiKB)) return null;
  const kb = Math.min(2 ** BIT[loai] * khoiKB, TRAN_MBR_KB);
  return kb;
}
const chu = (kb) =&gt; (kb &gt;= 2 ** 30 ? &#96;&#36;{kb / 2 ** 30} TB&#96; : &#96;&#36;{kb / 1024} MB&#96;);</code></pre></details>
<p>(a) FAT-12: 2¹² = 4096 blocks × 2 KB = <strong>8 MB</strong>. FAT-32: 2²⁸ blocks × 4 KB = <strong>1 TB</strong> (still under the 2 TB MBR cap). (b) Follow FAT[k] from the first block until −1:</p>
<pre><code class="language-javascript">// Exercise 3: follow a FAT chain and find which physical block holds a given byte
const FAT = { 2: 9, 3: -1, 5: 3, 8: 12, 9: 5, 12: -1, 14: 8 };   // the exam's table (other entries: free)
const BLOCK = 1024;

function chain(first) {                               // follow FAT[k] until -1
  const out = [];
  for (let k = first; k !== -1; k = FAT[k]) out.push(k);
  return out;
}
for (const [name, first] of [['A', 2], ['B', 14]]) {
  const c = chain(first);
  console.log(&#96;&#36;{name}: starts at &#36;{first}, chain &#36;{c.join(' -&gt; ')}, &#36;{c.length} blocks = at most &#36;{c.length * BLOCK} bytes&#96;);
}
const byte = 3000;                                    // which block holds byte 3000 of file A?
const logical = Math.floor(byte / BLOCK);
console.log(&#96;byte &#36;{byte} of A: logical block &#36;{logical} -&gt; physical block &#36;{chain(2)[logical]} (offset &#36;{byte % BLOCK} inside it)&#96;);
console.log(&#96;FAT lookups needed: &#36;{logical} (all in RAM, no disk read)&#96;);</code></pre>
<div class="out">$ node fat-bai.js<br>
A: starts at 2, chain 2 -&gt; 9 -&gt; 5 -&gt; 3, 4 blocks = at most 4096 bytes<br>
B: starts at 14, chain 14 -&gt; 8 -&gt; 12, 3 blocks = at most 3072 bytes<br>
byte 3000 of A: logical block 2 -&gt; physical block 5 (offset 952 inside it)<br>
FAT lookups needed: 2 (all in RAM, no disk read)</div>
<p>Byte 3000 is in logical block ⌊3000 / 1024⌋ = 2 of A, at offset 952; the chain 2 → 9 → 5 → 3 says logical block 2 is physical block <strong>5</strong>. Two FAT lookups, all in memory — no disk read until the data block itself.</p>
</details>`,
    `<h3>🧪 Bài 3 — giới hạn FAT và chuỗi FAT (15 phút)</h3>
<p>(a) Cỡ phân vùng tối đa của FAT-12 khối 2 KB (FE21 câu 9) và của FAT-32 khối 4 KB (FE22 câu 38) là bao nhiêu? (b) Một FAT khối 1 KB có FAT[2] = 9, FAT[3] = −1, FAT[5] = 3, FAT[8] = 12, FAT[9] = 5, FAT[12] = −1, FAT[14] = 8. Tệp A bắt đầu ở khối 2, tệp B ở khối 14. Viết hai chuỗi; byte 3000 của tệp A nằm ở khối vật lý nào?</p>
<details><summary>Lời giải — bộ mô phỏng cho (a), một chương trình cho (b)</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/27db8350c668c9dcfa98f3758395f8df31a8c979.svg" alt="FAT-12, khối 2 KB: 4096 × 2 KB = 8 MB" loading="lazy" /><p class="chu-thich">🧮 FAT-12, khối 2 KB: 4096 × 2 KB = 8 MB</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIT = { fat12: 12, fat16: 16, fat32: 28 };
const CHO_PHEP = { fat12: [0.5, 1, 2, 4], fat16: [2, 4, 8, 16, 32], fat32: [4, 8, 16, 32] };   // các ô có số trên Hình 4-31
const TRAN_MBR_KB = 2 ** 32 * 512 / 1024;              // 2 TB tính bằng KB
function toiDa(loai, khoiKB) {
  if (!CHO_PHEP[loai].includes(khoiKB)) return null;
  const kb = Math.min(2 ** BIT[loai] * khoiKB, TRAN_MBR_KB);
  return kb;
}
const chu = (kb) =&gt; (kb &gt;= 2 ** 30 ? &#96;&#36;{kb / 2 ** 30} TB&#96; : &#96;&#36;{kb / 1024} MB&#96;);</code></pre></details>
<p>(a) FAT-12: 2¹² = 4096 khối × 2 KB = <strong>8 MB</strong>. FAT-32: 2²⁸ khối × 4 KB = <strong>1 TB</strong> (vẫn dưới trần 2 TB của MBR). (b) Lần FAT[k] từ khối đầu tới khi gặp −1:</p>
<pre><code class="language-javascript">// Bài 3: lần một chuỗi FAT và tìm khối vật lý chứa một byte cho trước
const FAT = { 2: 9, 3: -1, 5: 3, 8: 12, 9: 5, 12: -1, 14: 8 };   // bảng của đề (các mục khác: trống)
const BLOCK = 1024;

function chain(first) {                               // lần FAT[k] tới khi gặp -1
  const out = [];
  for (let k = first; k !== -1; k = FAT[k]) out.push(k);
  return out;
}
for (const [name, first] of [['A', 2], ['B', 14]]) {
  const c = chain(first);
  console.log(&#96;&#36;{name}: starts at &#36;{first}, chain &#36;{c.join(' -&gt; ')}, &#36;{c.length} blocks = at most &#36;{c.length * BLOCK} bytes&#96;);
}
const byte = 3000;                                    // byte 3000 của tệp A nằm ở khối nào?
const logical = Math.floor(byte / BLOCK);
console.log(&#96;byte &#36;{byte} of A: logical block &#36;{logical} -&gt; physical block &#36;{chain(2)[logical]} (offset &#36;{byte % BLOCK} inside it)&#96;);
console.log(&#96;FAT lookups needed: &#36;{logical} (all in RAM, no disk read)&#96;);</code></pre>
<div class="out">$ node fat-bai.js<br>
A: starts at 2, chain 2 -&gt; 9 -&gt; 5 -&gt; 3, 4 blocks = at most 4096 bytes<br>
B: starts at 14, chain 14 -&gt; 8 -&gt; 12, 3 blocks = at most 3072 bytes<br>
byte 3000 of A: logical block 2 -&gt; physical block 5 (offset 952 inside it)<br>
FAT lookups needed: 2 (all in RAM, no disk read)</div>
<p>Byte 3000 nằm ở khối logic ⌊3000 / 1024⌋ = 2 của A, tại vị trí 952 trong khối; chuỗi 2 → 9 → 5 → 3 cho biết khối logic 2 là khối vật lý <strong>5</strong>. Hai lần tra FAT, toàn trong bộ nhớ — chưa đọc đĩa lần nào cho tới khối dữ liệu.</p>
</details>`),
    bi(`<h3>🧪 Exercise 4 — block-size arithmetic (15 min)</h3>
<p>(a) Space efficiency of a 4 KB file with 8 KB blocks, a 4 KB file with 1 KB blocks, a 10 KB file with 4 KB blocks, a 1 KB file with 4 KB blocks. (b) How many bytes does a 10,000-byte file waste with 4 KB blocks? (c) With 32-bit block numbers, how many list blocks does a free list need for an empty 1 TB disk with 1 KB blocks, and for an empty 500 GB disk with 4 KB blocks? Compare with a bitmap.</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Exercise 4: the block-size calculations of the chapter
const KB = 1024;
const eff = (file, block) =&gt; file / (Math.ceil(file / block) * block);
console.log('(a) space efficiency');
for (const [f, b] of [[4, 8], [4, 1], [10, 4], [1, 4]]) {
  console.log(&#96;    &#36;{f} KB file, &#36;{b} KB blocks: &#36;{Math.ceil(f / b)} block(s), efficiency &#36;{(100 * eff(f * KB, b * KB)).toFixed(1)}%&#96;);
}
console.log('(b) a 10,000-byte file with 4 KB blocks');
const n = Math.ceil(10000 / (4 * KB));
console.log(&#96;    &#36;{n} blocks = &#36;{n * 4 * KB} bytes allocated, &#36;{n * 4 * KB - 10000} bytes wasted in the last block&#96;);
console.log('(c) free-space bookkeeping, 32-bit block numbers');
for (const [diskGB, blockKB] of [[1024, 1], [500, 4]]) {
  const blocks = (diskGB * KB * KB) / blockKB;               // disk size in blocks
  const perList = (blockKB * KB) / 4 - 1;                    // numbers per free-list block
  console.log(&#96;    &#36;{diskGB} GB disk, &#36;{blockKB} KB blocks: &#36;{blocks} blocks; free list &#36;{perList} numbers/block -&gt; &#36;{Math.ceil(blocks / perList)} list blocks when empty; bitmap &#36;{Math.ceil(blocks / (blockKB * KB * 8))} blocks&#96;);
}</code></pre>
<div class="out">$ node tinh-khoi.js<br>
(a) space efficiency<br>
&nbsp;&nbsp;&nbsp;&nbsp;4 KB file, 8 KB blocks: 1 block(s), efficiency 50.0%<br>
&nbsp;&nbsp;&nbsp;&nbsp;4 KB file, 1 KB blocks: 4 block(s), efficiency 100.0%<br>
&nbsp;&nbsp;&nbsp;&nbsp;10 KB file, 4 KB blocks: 3 block(s), efficiency 83.3%<br>
&nbsp;&nbsp;&nbsp;&nbsp;1 KB file, 4 KB blocks: 1 block(s), efficiency 25.0%<br>
(b) a 10,000-byte file with 4 KB blocks<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 blocks = 12288 bytes allocated, 2288 bytes wasted in the last block<br>
(c) free-space bookkeeping, 32-bit block numbers<br>
&nbsp;&nbsp;&nbsp;&nbsp;1024 GB disk, 1 KB blocks: 1073741824 blocks; free list 255 numbers/block -&gt; 4210753 list blocks when empty; bitmap 131072 blocks<br>
&nbsp;&nbsp;&nbsp;&nbsp;500 GB disk, 4 KB blocks: 131072000 blocks; free list 1023 numbers/block -&gt; 128126 list blocks when empty; bitmap 4000 blocks</div>
<p>(a) efficiency = file size / (blocks needed × block size): 50%, 100%, 83.3%, 25% — the FE19 question 39 answer is the first line. (b) 3 blocks = 12,288 bytes for 10,000 bytes: 2,288 bytes of <strong>internal fragmentation</strong>, all in the last block. (c) a 4 KB list block holds 4096 / 4 − 1 = 1023 numbers (255 for 1 KB, FE10 question 35). The bitmap is about 32 times smaller than the free list of an empty disk; the list only wins when fewer than about 1 block in 32 is free.</p>
</details>`,
    `<h3>🧪 Bài 4 — tính toán cỡ khối (15 phút)</h3>
<p>(a) Hiệu suất dùng chỗ của tệp 4 KB với khối 8 KB, tệp 4 KB với khối 1 KB, tệp 10 KB với khối 4 KB, tệp 1 KB với khối 4 KB. (b) Tệp 10.000 byte phí bao nhiêu byte với khối 4 KB? (c) Với số hiệu khối 32 bit, danh sách khối trống cần bao nhiêu khối danh sách cho đĩa 1 TB trống, khối 1 KB, và cho đĩa 500 GB trống, khối 4 KB? So với bitmap.</p>
<details><summary>Lời giải — do chương trình tính</summary>
<pre><code class="language-javascript">// Bài 4: các phép tính về cỡ khối của chương
const KB = 1024;
const eff = (file, block) =&gt; file / (Math.ceil(file / block) * block);
console.log('(a) space efficiency');
for (const [f, b] of [[4, 8], [4, 1], [10, 4], [1, 4]]) {
  console.log(&#96;    &#36;{f} KB file, &#36;{b} KB blocks: &#36;{Math.ceil(f / b)} block(s), efficiency &#36;{(100 * eff(f * KB, b * KB)).toFixed(1)}%&#96;);
}
console.log('(b) a 10,000-byte file with 4 KB blocks');
const n = Math.ceil(10000 / (4 * KB));
console.log(&#96;    &#36;{n} blocks = &#36;{n * 4 * KB} bytes allocated, &#36;{n * 4 * KB - 10000} bytes wasted in the last block&#96;);
console.log('(c) free-space bookkeeping, 32-bit block numbers');
for (const [diskGB, blockKB] of [[1024, 1], [500, 4]]) {
  const blocks = (diskGB * KB * KB) / blockKB;               // cỡ đĩa tính bằng khối
  const perList = (blockKB * KB) / 4 - 1;                    // số hiệu mỗi khối danh sách
  console.log(&#96;    &#36;{diskGB} GB disk, &#36;{blockKB} KB blocks: &#36;{blocks} blocks; free list &#36;{perList} numbers/block -&gt; &#36;{Math.ceil(blocks / perList)} list blocks when empty; bitmap &#36;{Math.ceil(blocks / (blockKB * KB * 8))} blocks&#96;);
}</code></pre>
<div class="out">$ node tinh-khoi.js<br>
(a) space efficiency<br>
&nbsp;&nbsp;&nbsp;&nbsp;4 KB file, 8 KB blocks: 1 block(s), efficiency 50.0%<br>
&nbsp;&nbsp;&nbsp;&nbsp;4 KB file, 1 KB blocks: 4 block(s), efficiency 100.0%<br>
&nbsp;&nbsp;&nbsp;&nbsp;10 KB file, 4 KB blocks: 3 block(s), efficiency 83.3%<br>
&nbsp;&nbsp;&nbsp;&nbsp;1 KB file, 4 KB blocks: 1 block(s), efficiency 25.0%<br>
(b) a 10,000-byte file with 4 KB blocks<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 blocks = 12288 bytes allocated, 2288 bytes wasted in the last block<br>
(c) free-space bookkeeping, 32-bit block numbers<br>
&nbsp;&nbsp;&nbsp;&nbsp;1024 GB disk, 1 KB blocks: 1073741824 blocks; free list 255 numbers/block -&gt; 4210753 list blocks when empty; bitmap 131072 blocks<br>
&nbsp;&nbsp;&nbsp;&nbsp;500 GB disk, 4 KB blocks: 131072000 blocks; free list 1023 numbers/block -&gt; 128126 list blocks when empty; bitmap 4000 blocks</div>
<p>(a) hiệu suất = cỡ tệp / (số khối cần × cỡ khối): 50%, 100%, 83,3%, 25% — đáp án FE19 câu 39 là dòng đầu. (b) 3 khối = 12.288 byte cho 10.000 byte: 2.288 byte <strong>phân mảnh trong (internal fragmentation)</strong>, nằm hết ở khối cuối. (c) một khối danh sách 4 KB chứa 4096 / 4 − 1 = 1023 số (255 với khối 1 KB, FE10 câu 35). Bitmap nhỏ hơn khoảng 32 lần so với danh sách của một đĩa trống; danh sách chỉ thắng khi dưới khoảng 1 khối trên 32 còn trống.</p>
</details>`),
    bi(`<h3>🧪 Exercise 5 — predict the link counts (10 min)</h3>
<p>Write down every number before running: a file <code>a</code> gets hard links <code>b</code> (to a) and <code>c</code> (to b), and a symbolic link <code>s</code> to <code>a</code>. What are the link counts of a, b, c, s? After <code>rm a</code>, what are the counts of b and c, and what does <code>cat s</code> do? Then: a directory <code>d</code> with three subdirectories x, y, z — link count of d and of d/x? After removing z?</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 5: predict every link count before running the line<br>
$ echo data &gt; a<br>
$ ln a b<br>
$ ln b c<br>
$ ln -s a s<br>
$ stat -c '%n %h' a b c s<br>
a 3<br>
b 3<br>
c 3<br>
s 1<br>
$ rm a<br>
$ stat -c '%n %h' b c<br>
b 2<br>
c 2<br>
$ cat s<br>
cat: s: No such file or directory<br>
# a directory: "." inside it + its entry in the parent + ".." of each subdirectory<br>
$ mkdir d d/x d/y d/z<br>
$ stat -c '%n %h' d d/x<br>
d 5<br>
d/x 2<br>
$ rmdir d/z<br>
$ stat -c '%n %h' d<br>
d 4</div>
<p>a, b, c are three names of one i-node: count 3 (it does not matter that c was linked "to b"); s is its own i-node with count 1. After <code>rm a</code>: 2, and <code>s</code> dangles because it stored the <em>name</em> "a". A directory's count = 1 (its entry in the parent) + 1 (its own <code>.</code>) + one <code>..</code> per subdirectory: d = 2 + 3 = 5, then 4; an empty directory such as d/x has 2. That is why <code>ls -l</code> on a directory tells you how many subdirectories it has.</p>
</details>`,
    `<h3>🧪 Bài 5 — đoán số liên kết (10 phút)</h3>
<p>Ghi ra mọi con số trước khi chạy: tệp <code>a</code> có liên kết cứng <code>b</code> (tới a) và <code>c</code> (tới b), và liên kết mềm <code>s</code> tới <code>a</code>. Số liên kết của a, b, c, s là bao nhiêu? Sau <code>rm a</code>, số của b và c là bao nhiêu, và <code>cat s</code> làm gì? Rồi: thư mục <code>d</code> có ba thư mục con x, y, z — số liên kết của d và d/x? Sau khi xoá z?</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5: đoán từng số liên kết trước khi chạy dòng lệnh<br>
$ echo data &gt; a<br>
$ ln a b<br>
$ ln b c<br>
$ ln -s a s<br>
$ stat -c '%n %h' a b c s<br>
a 3<br>
b 3<br>
c 3<br>
s 1<br>
$ rm a<br>
$ stat -c '%n %h' b c<br>
b 2<br>
c 2<br>
$ cat s<br>
cat: s: No such file or directory<br>
# một thư mục: "." bên trong + mục của nó ở thư mục cha + ".." của mỗi thư mục con<br>
$ mkdir d d/x d/y d/z<br>
$ stat -c '%n %h' d d/x<br>
d 5<br>
d/x 2<br>
$ rmdir d/z<br>
$ stat -c '%n %h' d<br>
d 4</div>
<p>a, b, c là ba cái tên của một i-node: số đếm 3 (không quan trọng c được liên kết "tới b"); s là i-node riêng, số đếm 1. Sau <code>rm a</code>: 2, và <code>s</code> trỏ vào hư không vì nó lưu <em>cái tên</em> "a". Số liên kết của thư mục = 1 (mục của nó ở thư mục cha) + 1 (<code>.</code> của chính nó) + mỗi thư mục con một <code>..</code>: d = 2 + 3 = 5, rồi 4; thư mục rỗng như d/x có 2. Vì thế <code>ls -l</code> trên một thư mục cho biết nó có bao nhiêu thư mục con.</p>
</details>`),
    bi(`<h3>🧪 Exercise 6 — "No space left on device", but the disk is empty (15 min)</h3>
<p>A server writes thousands of tiny cache files and suddenly every write fails with "No space left on device", although <code>df -h</code> says the disk is almost empty. Reproduce it on a small ext4 image formatted with only 64 i-nodes, and find the cause with one command.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 6: "No space left on device" while df says the disk is mostly free<br>
$ mkfs.ext4 -q -N 64 disk.img 64M<br>
Creating regular file disk.img<br>
$ mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
$ for i in $(seq 1 100); do echo x &gt; /mnt/d/f$i 2&gt;/dev/null || { echo "failed at file $i"; break; }; done<br>
bash: /mnt/d/f54: No space left on device<br>
failed at file 54<br>
$ echo x &gt; /mnt/d/one-more<br>
bash: /mnt/d/one-more: No space left on device<br>
$ df -h /mnt/d | awk 'NR == 2 {print "space used: &nbsp;" $5}'<br>
space used: &nbsp;1%<br>
$ df -i /mnt/d | awk 'NR == 2 {print "i-nodes used: " $5, "(" $3 " of " $2 ")"}'<br>
i-nodes used: 100% (64 of 64)<br>
$ umount /mnt/d</div>
<p>The 54th file fails (the root directory, <code>lost+found</code> and the reserved i-nodes 1–10 already used the rest) while only 1% of the space is used: <code>df -i</code> shows 64 of 64 i-nodes in use. On ext4 the i-node table is created by <code>mkfs</code> with a fixed size (one i-node per 16 KB of disk by default); a workload of many tiny files — mail spools, PHP sessions, npm caches, Docker layers — can exhaust it. Fixes: delete files, or reformat with more i-nodes (<code>mkfs.ext4 -i</code> / <code>-N</code>) or use XFS/btrfs, which allocate i-nodes dynamically. Always check both <code>df -h</code> and <code>df -i</code>.</p>
</details>`,
    `<h3>🧪 Bài 6 — "No space left on device" mà đĩa còn trống (15 phút)</h3>
<p>Một máy chủ ghi hàng nghìn tệp cache tí hon và bỗng nhiên mọi lần ghi đều lỗi "No space left on device", dù <code>df -h</code> báo đĩa gần như trống. Hãy tái hiện trên một ảnh ext4 nhỏ định dạng với chỉ 64 i-node, và tìm nguyên nhân bằng một lệnh.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 6: "No space left on device" trong khi df báo đĩa còn trống nhiều<br>
$ mkfs.ext4 -q -N 64 disk.img 64M<br>
Creating regular file disk.img<br>
$ mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
$ for i in $(seq 1 100); do echo x &gt; /mnt/d/f$i 2&gt;/dev/null || { echo "failed at file $i"; break; }; done<br>
bash: /mnt/d/f54: No space left on device<br>
failed at file 54<br>
$ echo x &gt; /mnt/d/one-more<br>
bash: /mnt/d/one-more: No space left on device<br>
$ df -h /mnt/d | awk 'NR == 2 {print "space used: &nbsp;" $5}'<br>
space used: &nbsp;1%<br>
$ df -i /mnt/d | awk 'NR == 2 {print "i-nodes used: " $5, "(" $3 " of " $2 ")"}'<br>
i-nodes used: 100% (64 of 64)<br>
$ umount /mnt/d</div>
<p>Tệp thứ 54 thất bại (thư mục gốc, <code>lost+found</code> và các i-node dành riêng 1–10 đã dùng phần còn lại) trong khi mới dùng 1% dung lượng: <code>df -i</code> cho thấy 64 trên 64 i-node đã dùng. Trên ext4, bảng i-node được <code>mkfs</code> tạo với cỡ cố định (mặc định một i-node mỗi 16 KB đĩa); một tải gồm nhiều tệp tí hon — hàng đợi thư, session PHP, cache npm, các lớp Docker — có thể làm cạn nó. Cách xử lý: xoá bớt tệp, hoặc định dạng lại với nhiều i-node hơn (<code>mkfs.ext4 -i</code> / <code>-N</code>) hoặc dùng XFS/btrfs, loại cấp i-node động. Luôn kiểm cả <code>df -h</code> lẫn <code>df -i</code>.</p>
</details>`),
    bi(`<h3>🧪 Exercise 7 — a deleted log file that still fills the disk (15 min)</h3>
<p>The disk of a server is full. You find a 40 MB <code>app.log</code>, delete it — and <code>df</code> does not change. Explain why using slide 25, prove it with <code>/proc</code>, rescue the content, and free the space.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 7: a deleted log file that still fills the disk<br>
$ mkfs.ext4 -q disk.img 64M &amp;&amp; mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
Creating regular file disk.img<br>
$ head -c 40M /dev/zero &gt; /mnt/d/app.log<br>
# a "server" keeps the log open (fd 3)<br>
$ sleep 300 3&lt; /mnt/d/app.log &amp; PID=$!<br>
$ df -m /mnt/d | awk 'NR == 2 {print "used MB:", $3}'<br>
used MB: 41<br>
$ rm /mnt/d/app.log<br>
$ ls /mnt/d<br>
lost+found<br>
$ df -m /mnt/d | awk 'NR == 2 {print "used MB after rm:", $3}'<br>
used MB after rm: 41<br>
# the name is gone, the i-node is not: the process still holds it<br>
$ ls -l /proc/$PID/fd/3 | awk '{print $9, $10, $11, $12}'<br>
/proc/17/fd/3 -&gt; /mnt/d/app.log (deleted)<br>
# rescue the data through /proc, then stop the holder<br>
$ cp /proc/$PID/fd/3 /tmp/rescued.log &amp;&amp; ls -l /tmp/rescued.log | awk '{print $5, $9}'<br>
41943040 /tmp/rescued.log<br>
$ kill $PID; wait $PID 2&gt;/dev/null<br>
$ df -m /mnt/d | awk 'NR == 2 {print "used MB after the process exits:", $3}'<br>
used MB after the process exits: 1<br>
$ umount /mnt/d</div>
<p><code>rm</code> only removed the directory entry; the i-node's link count dropped to 0, but a process still has the file open, so the kernel keeps the i-node and its blocks (used MB stays at 41). <code>/proc/&lt;pid&gt;/fd/3</code> still points to it, marked <code>(deleted)</code>, and can even be copied out. The space returns only when the last descriptor is closed — here when the "server" exits (used MB back to 1). On a real server: find such files with <code>lsof +L1</code>, then restart the process or truncate the file through <code>/proc/&lt;pid&gt;/fd/N</code>; better, rotate logs with <code>logrotate</code> using <code>copytruncate</code> or a signal so the program reopens its log.</p>
</details>`,
    `<h3>🧪 Bài 7 — tệp log đã xoá mà vẫn chiếm đầy đĩa (15 phút)</h3>
<p>Đĩa của một máy chủ bị đầy. Bạn tìm ra tệp <code>app.log</code> 40 MB, xoá nó — và <code>df</code> không đổi. Giải thích vì sao bằng slide 25, chứng minh qua <code>/proc</code>, cứu lấy nội dung, và giải phóng chỗ.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 7: tệp log đã xoá mà vẫn chiếm đĩa<br>
$ mkfs.ext4 -q disk.img 64M &amp;&amp; mkdir -p /mnt/d &amp;&amp; mount -o loop disk.img /mnt/d<br>
Creating regular file disk.img<br>
$ head -c 40M /dev/zero &gt; /mnt/d/app.log<br>
# một "server" giữ tệp log mở (fd 3)<br>
$ sleep 300 3&lt; /mnt/d/app.log &amp; PID=$!<br>
$ df -m /mnt/d | awk 'NR == 2 {print "used MB:", $3}'<br>
used MB: 41<br>
$ rm /mnt/d/app.log<br>
$ ls /mnt/d<br>
lost+found<br>
$ df -m /mnt/d | awk 'NR == 2 {print "used MB after rm:", $3}'<br>
used MB after rm: 41<br>
# tên đã mất, i-node thì chưa: tiến trình vẫn giữ nó<br>
$ ls -l /proc/$PID/fd/3 | awk '{print $9, $10, $11, $12}'<br>
/proc/17/fd/3 -&gt; /mnt/d/app.log (deleted)<br>
# cứu dữ liệu qua /proc, rồi dừng kẻ giữ tệp<br>
$ cp /proc/$PID/fd/3 /tmp/rescued.log &amp;&amp; ls -l /tmp/rescued.log | awk '{print $5, $9}'<br>
41943040 /tmp/rescued.log<br>
$ kill $PID; wait $PID 2&gt;/dev/null<br>
$ df -m /mnt/d | awk 'NR == 2 {print "used MB after the process exits:", $3}'<br>
used MB after the process exits: 1<br>
$ umount /mnt/d</div>
<p><code>rm</code> chỉ gỡ mục thư mục; số liên kết của i-node về 0, nhưng một tiến trình vẫn đang mở tệp, nên nhân giữ lại i-node và các khối của nó (số MB đã dùng vẫn 41). <code>/proc/&lt;pid&gt;/fd/3</code> vẫn trỏ tới nó, gắn nhãn <code>(deleted)</code>, và còn chép ra được. Chỗ trống chỉ trở lại khi bộ mô tả cuối cùng được đóng — ở đây là khi "server" thoát (số MB đã dùng về 1). Trên máy chủ thật: tìm các tệp như vậy bằng <code>lsof +L1</code>, rồi khởi động lại tiến trình hoặc cắt cụt tệp qua <code>/proc/&lt;pid&gt;/fd/N</code>; tốt hơn là xoay vòng log bằng <code>logrotate</code> với <code>copytruncate</code> hoặc gửi tín hiệu để chương trình mở lại tệp log.</p>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>file system</strong></td><td>hệ thống tệp</td><td>The part of the OS that turns a disk of numbered blocks into named, protected files and directories.</td></tr>
<tr><td><strong>block</strong></td><td>khối</td><td>The fixed-size unit (often 4 KB) in which a disk is read, written and allocated.</td></tr>
<tr><td><strong>file attributes (metadata)</strong></td><td>thuộc tính tệp (siêu dữ liệu)</td><td>Data about a file: protection, owner, times, size — on UNIX stored in the i-node.</td></tr>
<tr><td><strong>absolute / relative path</strong></td><td>đường dẫn tuyệt đối / tương đối</td><td>A path from the root, versus a path from the process's working directory.</td></tr>
<tr><td><strong>superblock</strong></td><td>siêu khối</td><td>Block holding the key parameters of a file system: magic number, block and i-node counts.</td></tr>
<tr><td><strong>MBR / boot block</strong></td><td>bản ghi khởi động chính / khối khởi động</td><td>Sector 0 of the disk with the partition table; the first block of every partition.</td></tr>
<tr><td><strong>contiguous allocation</strong></td><td>cấp phát liên tục</td><td>Each file is one run of consecutive blocks: fast reads, external fragmentation.</td></tr>
<tr><td><strong>linked-list allocation</strong></td><td>cấp phát danh sách liên kết</td><td>Each block points to the next one: no fragmentation, very slow random access.</td></tr>
<tr><td><strong>file allocation table (FAT)</strong></td><td>bảng cấp phát tệp</td><td>The linked-list pointers moved into one table in RAM, one entry per block.</td></tr>
<tr><td><strong>i-node (index node)</strong></td><td>nút chỉ mục</td><td>Per-file record with the attributes and block addresses, plus single/double/triple indirect blocks.</td></tr>
<tr><td><strong>indirect block</strong></td><td>khối gián tiếp</td><td>A disk block that holds only block numbers (256 per 1 KB block with 4-byte numbers).</td></tr>
<tr><td><strong>extent</strong></td><td>dải khối (extent)</td><td>A run (start block, length) describing many contiguous blocks at once — ext4, NTFS, XFS.</td></tr>
<tr><td><strong>hard link / symbolic link</strong></td><td>liên kết cứng / liên kết mềm</td><td>Another directory entry for the same i-node, versus a small file holding a path.</td></tr>
<tr><td><strong>link count</strong></td><td>số liên kết</td><td>Number of directory entries pointing to an i-node; the file is freed at 0 (and when closed).</td></tr>
<tr><td><strong>journaling file system</strong></td><td>hệ thống tệp có nhật ký</td><td>Writes the planned changes to a log and commits them before doing them; replays the log after a crash.</td></tr>
<tr><td><strong>virtual file system (VFS)</strong></td><td>hệ thống tệp ảo</td><td>Kernel layer giving all file systems one interface and dispatching calls through function pointers.</td></tr>
<tr><td><strong>free list / bitmap</strong></td><td>danh sách khối trống / bitmap</td><td>Two ways to record free blocks: lists of block numbers, or one bit per block.</td></tr>
<tr><td><strong>disk quota</strong></td><td>hạn ngạch đĩa</td><td>Per-user limits on blocks and files, with a soft limit (warnings) and a hard limit.</td></tr>
<tr><td><strong>physical / logical dump</strong></td><td>sao lưu vật lý / logic</td><td>Copy every disk block in order, versus copy changed files and the directories leading to them.</td></tr>
<tr><td><strong>buffer (page) cache</strong></td><td>bộ đệm khối (page cache)</td><td>Disk blocks kept in RAM, looked up by hash, replaced with (modified) LRU.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>file system</strong></td><td>hệ thống tệp</td><td>Phần HĐH biến một đĩa gồm các khối đánh số thành các tệp và thư mục có tên, được bảo vệ.</td></tr>
<tr><td><strong>block</strong></td><td>khối</td><td>Đơn vị cỡ cố định (thường 4 KB) để đọc, ghi và cấp phát đĩa.</td></tr>
<tr><td><strong>file attributes (metadata)</strong></td><td>thuộc tính tệp (siêu dữ liệu)</td><td>Dữ liệu về tệp: quyền, chủ, thời gian, cỡ — trên UNIX nằm trong i-node.</td></tr>
<tr><td><strong>absolute / relative path</strong></td><td>đường dẫn tuyệt đối / tương đối</td><td>Đường dẫn tính từ gốc, so với đường dẫn tính từ thư mục làm việc của tiến trình.</td></tr>
<tr><td><strong>superblock</strong></td><td>siêu khối</td><td>Khối giữ tham số chính của hệ thống tệp: magic number, số khối và số i-node.</td></tr>
<tr><td><strong>MBR / boot block</strong></td><td>bản ghi khởi động chính / khối khởi động</td><td>Sector 0 của đĩa chứa bảng phân vùng; khối đầu tiên của mọi phân vùng.</td></tr>
<tr><td><strong>contiguous allocation</strong></td><td>cấp phát liên tục</td><td>Mỗi tệp là một dải khối liền nhau: đọc nhanh, bị phân mảnh ngoài.</td></tr>
<tr><td><strong>linked-list allocation</strong></td><td>cấp phát danh sách liên kết</td><td>Mỗi khối trỏ tới khối kế: không phân mảnh, truy cập ngẫu nhiên rất chậm.</td></tr>
<tr><td><strong>file allocation table (FAT)</strong></td><td>bảng cấp phát tệp</td><td>Các con trỏ của danh sách liên kết dời vào một bảng trong RAM, mỗi khối một mục.</td></tr>
<tr><td><strong>i-node (index node)</strong></td><td>nút chỉ mục</td><td>Bản ghi riêng của mỗi tệp chứa thuộc tính và địa chỉ khối, cộng khối gián tiếp đơn/đôi/ba.</td></tr>
<tr><td><strong>indirect block</strong></td><td>khối gián tiếp</td><td>Khối đĩa chỉ chứa số hiệu khối (256 số mỗi khối 1 KB với số hiệu 4 byte).</td></tr>
<tr><td><strong>extent</strong></td><td>dải khối (extent)</td><td>Một dải (khối đầu, độ dài) mô tả nhiều khối liền nhau một lúc — ext4, NTFS, XFS.</td></tr>
<tr><td><strong>hard link / symbolic link</strong></td><td>liên kết cứng / liên kết mềm</td><td>Thêm một mục thư mục cho cùng i-node, so với một tệp nhỏ chứa đường dẫn.</td></tr>
<tr><td><strong>link count</strong></td><td>số liên kết</td><td>Số mục thư mục trỏ tới một i-node; tệp được giải phóng khi về 0 (và đã đóng).</td></tr>
<tr><td><strong>journaling file system</strong></td><td>hệ thống tệp có nhật ký</td><td>Ghi các thay đổi dự định vào nhật ký và chốt trước khi làm; phát lại nhật ký sau sự cố.</td></tr>
<tr><td><strong>virtual file system (VFS)</strong></td><td>hệ thống tệp ảo</td><td>Tầng của nhân cho mọi hệ thống tệp một giao diện chung và chuyển lời gọi qua con trỏ hàm.</td></tr>
<tr><td><strong>free list / bitmap</strong></td><td>danh sách khối trống / bitmap</td><td>Hai cách ghi nhận khối trống: danh sách số hiệu khối, hoặc mỗi khối một bit.</td></tr>
<tr><td><strong>disk quota</strong></td><td>hạn ngạch đĩa</td><td>Giới hạn số khối và số tệp cho mỗi người dùng, có giới hạn mềm (cảnh báo) và cứng.</td></tr>
<tr><td><strong>physical / logical dump</strong></td><td>sao lưu vật lý / logic</td><td>Chép mọi khối đĩa theo thứ tự, so với chép tệp đã đổi và các thư mục dẫn tới chúng.</td></tr>
<tr><td><strong>buffer (page) cache</strong></td><td>bộ đệm khối (page cache)</td><td>Các khối đĩa giữ trong RAM, tra bằng băm, thay theo LRU (cải tiến).</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 4</h2>
<ol>
<li>Long-term storage must be <strong>large</strong>, <strong>persistent</strong> and <strong>shared</strong>; a disk only offers "read/write block k", and the file system builds named, protected files on top.</li>
<li>UNIX and Windows files are <strong>byte sequences</strong>; attributes (protection, owner, times, size) are metadata; the operations are create, delete, open, close, read, write, append, seek, get/set attributes, rename.</li>
<li>Directories form a <strong>hierarchy</strong>; paths are absolute (from <code>/</code>) or relative (from the working directory); <code>.</code> and <code>..</code> are ordinary entries.</li>
<li>Four ways to find a file's blocks: <strong>contiguous</strong> (fast, fragments — CD-ROM, extents), <strong>linked list</strong> (slow random access), <strong>FAT</strong> (fast, but the whole table in RAM), <strong>i-node</strong> (indexed: direct + single/double/triple indirect, in RAM only when open).</li>
<li>Max file size = (direct + P + P² + P³) × block size, with P = block size / address size. FAT partition = 2^bits × block size (FAT-32: 28 bits, capped at 2 TB).</li>
<li>A UNIX directory entry is just (i-number, name); hard links share an i-node (link count), symbolic links store a path; a file is freed when its count is 0 and no process has it open.</li>
<li>Reliability: <strong>journaling</strong> (commit the plan, then act, replay after a crash), <strong>fsck</strong> (missing → free list, duplicate free → rebuild list, duplicate data → copy the block), <strong>backups</strong> (physical vs logical, incremental, the four-phase dump).</li>
<li>Performance: block size trade-off (speed vs space), free <strong>bitmap</strong>, <strong>buffer cache</strong> with modified LRU and delayed writes (<code>sync</code> every 30 s), read-ahead, block/cylinder groups — and on SSDs, no defragmentation.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 4</h2>
<ol>
<li>Lưu trữ lâu dài phải <strong>lớn</strong>, <strong>bền</strong> và <strong>dùng chung được</strong>; đĩa chỉ cho "đọc/ghi khối k", hệ thống tệp dựng tệp có tên, được bảo vệ ở bên trên.</li>
<li>Tệp của UNIX và Windows là <strong>dãy byte</strong>; thuộc tính (quyền, chủ, thời gian, cỡ) là siêu dữ liệu; các thao tác là create, delete, open, close, read, write, append, seek, get/set attributes, rename.</li>
<li>Thư mục hợp thành <strong>phân cấp</strong>; đường dẫn là tuyệt đối (từ <code>/</code>) hoặc tương đối (từ thư mục làm việc); <code>.</code> và <code>..</code> là các mục bình thường.</li>
<li>Bốn cách tìm các khối của tệp: <strong>liên tục</strong> (nhanh, phân mảnh — CD-ROM, extent), <strong>danh sách liên kết</strong> (truy cập ngẫu nhiên chậm), <strong>FAT</strong> (nhanh, nhưng cả bảng nằm trong RAM), <strong>i-node</strong> (chỉ mục: trực tiếp + gián tiếp đơn/đôi/ba, chỉ nằm trong RAM khi tệp mở).</li>
<li>Cỡ tệp tối đa = (trực tiếp + P + P² + P³) × cỡ khối, với P = cỡ khối / cỡ địa chỉ. Phân vùng FAT = 2^số bit × cỡ khối (FAT-32: 28 bit, bị chặn ở 2 TB).</li>
<li>Mục thư mục UNIX chỉ là (số i-node, tên); liên kết cứng dùng chung i-node (số liên kết), liên kết mềm lưu đường dẫn; tệp được giải phóng khi số liên kết về 0 và không tiến trình nào còn mở nó.</li>
<li>Tin cậy: <strong>nhật ký</strong> (chốt kế hoạch, rồi làm, phát lại sau sự cố), <strong>fsck</strong> (mất tích → danh sách trống, trùng trong danh sách trống → dựng lại danh sách, trùng dữ liệu → chép khối), <strong>sao lưu</strong> (vật lý và logic, gia tăng, thuật toán bốn pha).</li>
<li>Hiệu năng: đánh đổi cỡ khối (tốc độ và chỗ), <strong>bitmap</strong> khối trống, <strong>bộ đệm khối</strong> với LRU cải tiến và ghi trễ (<code>sync</code> mỗi 30 giây), đọc trước, nhóm khối/nhóm cylinder — và với SSD, không chống phân mảnh.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch4) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) An i-node contains 10 direct addresses of 4 bytes each and one single indirect address; all disk blocks are 1 KB. What is the largest possible file?|||(Dạng câu FE) Một i-node chứa 10 địa chỉ trực tiếp, mỗi địa chỉ 4 byte, và một địa chỉ gián tiếp đơn; mọi khối đĩa là 1 KB. Tệp lớn nhất có thể là bao nhiêu?',
      options: ['262 KB|||262 KB', '264 KB|||264 KB', '266 KB|||266 KB', '268 KB|||268 KB'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: one 1 KB indirect block holds 1024 / 4 = 256 block numbers, so the file can have 10 direct + 256 indirect = 266 blocks of 1 KB = 266 KB. The trap answers come from using 252 or 254 numbers per block, or forgetting that the direct blocks count too. Lesson 4.A slide 21 and lesson 4.B slide 44 (the full tree with double and triple indirect blocks).|||Do bộ mô phỏng tính: một khối gián tiếp 1 KB chứa 1024 / 4 = 256 số hiệu khối, nên tệp có được 10 khối trực tiếp + 256 khối gián tiếp = 266 khối 1 KB = 266 KB. Các phương án bẫy đến từ việc lấy 252 hay 254 số mỗi khối, hoặc quên cộng các khối trực tiếp. Bài 4.A slide 21 và bài 4.B slide 44 (cả cây với khối gián tiếp đôi, ba).' },
    { id: 'q2',
      question: '(FE question type) In Windows 95, what is the maximum partition size if the FAT type is FAT-16 and the block size is 4 KB?|||(Dạng câu FE) Trên Windows 95, cỡ phân vùng tối đa là bao nhiêu nếu loại FAT là FAT-16 và cỡ khối là 4 KB?',
      options: ['128 MB|||128 MB', '256 MB|||256 MB', '512 MB|||512 MB', '1024 MB|||1024 MB'],
      correctIndex: 1,
      points: 1,
      explanation: 'Computed by the simulator: a FAT-16 entry has 16 bits, so at most 2^16 = 65,536 blocks can be addressed; 65,536 × 4 KB = 256 MB (Figure 4-31). 128 MB is the 2 KB column, 512 MB the 8 KB column. The same rule gives FAT-32 + 4 KB = 2^28 × 4 KB = 1 TB, and FAT-32 is capped at 2 TB by the 32-bit sector count of the MBR. Lesson 4.B, slide 42.|||Do bộ mô phỏng tính: một mục FAT-16 có 16 bit, nên địa chỉ hoá được tối đa 2^16 = 65.536 khối; 65.536 × 4 KB = 256 MB (Hình 4-31). 128 MB là cột khối 2 KB, 512 MB là cột 8 KB. Cùng luật cho FAT-32 + 4 KB = 2^28 × 4 KB = 1 TB, và FAT-32 bị chặn ở 2 TB vì MBR ghi số sector bằng 32 bit. Bài 4.B, slide 42.' },
    { id: 'q3',
      question: '(FE question type) A directory entry in UNIX/Linux consists of…|||(Dạng câu FE) Một mục thư mục trong UNIX/Linux gồm…',
      options: ['the i-node number and the file name|||số i-node và tên tệp', 'the file name, size, location, creation date and owner ID|||tên tệp, cỡ, vị trí, ngày tạo và mã chủ sở hữu', 'only the file name; the OS searches the disk for the data|||chỉ tên tệp; HĐH lục đĩa để tìm dữ liệu', 'the file name, size and location of the file on disk|||tên tệp, cỡ và vị trí của tệp trên đĩa'],
      correctIndex: 0,
      points: 1,
      explanation: 'UNIX uses design (b) of Figure 4-14: an entry is just (i-number, name) — 2 + 14 bytes in V7 (Figure 4-32), variable length in ext2/ext4. Size, block addresses, dates and owner are all in the i-node; that is what makes hard links possible. Options B and D describe the MS-DOS/FAT entry (Figure 4-30). The real ext2 bytes are shown in lesson 4.B, slide 43.|||UNIX dùng thiết kế (b) của Hình 4-14: một mục chỉ là (số i-node, tên) — 2 + 14 byte ở V7 (Hình 4-32), độ dài thay đổi ở ext2/ext4. Cỡ, địa chỉ khối, ngày tháng và chủ sở hữu đều nằm trong i-node; nhờ vậy mới có liên kết cứng. Phương án B và D tả mục thư mục MS-DOS/FAT (Hình 4-30). Các byte thật của ext2 có ở bài 4.B, slide 43.' },
    { id: 'q4',
      question: '(FE question type) Which linking technique allows a file to appear in more than one directory?|||(Dạng câu FE) Kỹ thuật liên kết nào cho phép một tệp xuất hiện ở nhiều thư mục?',
      options: ['Hard link only|||Chỉ liên kết cứng', 'Symbolic link only|||Chỉ liên kết mềm', 'Neither — a file can only be copied|||Không cái nào — chỉ có thể chép tệp', 'Both hard links and symbolic links|||Cả liên kết cứng lẫn liên kết mềm'],
      correctIndex: 3,
      points: 1,
      explanation: 'Both techniques of slide 24 make one file visible from several directories: a hard link adds a second directory entry with the same i-number (link count +1); a symbolic link is a small LINK file holding the path. They differ in what happens next: a hard link cannot cross file systems or point to a directory, a symbolic link can (even to another machine) but dangles if the target is removed. The bank has this question twice with different keys — FE20 question 9 says "Both" (correct), FE22 question 25 says "Hard link" (incomplete). Lesson 4.A, slides 24–25.|||Cả hai kỹ thuật ở slide 24 đều cho một tệp hiện ra ở nhiều thư mục: liên kết cứng thêm một mục thư mục thứ hai cùng số i-node (số liên kết +1); liên kết mềm là một tệp LINK nhỏ chứa đường dẫn. Chúng khác nhau ở chuyện sau đó: liên kết cứng không vượt hệ thống tệp, không trỏ tới thư mục; liên kết mềm làm được (kể cả tới máy khác) nhưng trỏ vào hư không nếu đích bị xoá. Ngân hàng có câu này hai lần với hai khoá khác nhau — FE20 câu 9 ghi "Both" (đúng), FE22 câu 25 ghi "Hard link" (thiếu). Bài 4.A, slide 24–25.' },
    { id: 'q5',
      question: '(FE question type) A file system uses 8 KB blocks. What is the space efficiency for a 4 KB file?|||(Dạng câu FE) Một hệ thống tệp dùng khối 8 KB. Hiệu suất dùng chỗ của một tệp 4 KB là bao nhiêu?',
      options: ['50%|||50%', '75%|||75%', '25%|||25%', '100%|||100%'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by the simulator: the 4 KB file needs one whole 8 KB block, so useful bytes / allocated bytes = 4 / 8 = 50%; the other half of the block is internal fragmentation. With 16 KB blocks it would be 25%, with 4 KB or smaller blocks 100%. Bigger blocks: faster data rate but worse space efficiency (Figure 4-21). Lesson 4.B, slide 30.|||Do bộ mô phỏng tính: tệp 4 KB cần nguyên một khối 8 KB, nên byte có ích / byte được cấp = 4 / 8 = 50%; nửa còn lại của khối là phân mảnh trong. Với khối 16 KB sẽ là 25%, với khối 4 KB hoặc nhỏ hơn là 100%. Khối càng lớn: tốc độ dữ liệu càng nhanh nhưng hiệu suất dùng chỗ càng tệ (Hình 4-21). Bài 4.B, slide 30.' },
    { id: 'q6',
      question: '(FE question type) A file-system checker finds a block that appears neither in any file nor in the free list (a "missing block"). What does it do?|||(Dạng câu FE) Bộ kiểm tra hệ thống tệp thấy một khối không nằm trong tệp nào cũng không nằm trong danh sách trống (một "khối mất tích"). Nó làm gì?',
      options: ['It rebuilds the whole free list from scratch|||Dựng lại toàn bộ danh sách trống từ đầu', 'It allocates a free block and copies the missing block into it|||Cấp một khối trống và chép khối mất tích sang đó', 'It adds the missing block to the free list|||Thêm khối mất tích vào danh sách trống', 'It deletes every file that is near the missing block|||Xoá mọi tệp nằm gần khối mất tích'],
      correctIndex: 2,
      points: 1,
      explanation: 'A missing block (Figure 4-27b: in-use counter 0, free counter 0) only wastes space, so the checker simply adds it to the free list — FE21 question 34. Rebuilding the free list is the fix for a block that appears twice in the free list (4-27c); allocating a free block and copying is the fix for a duplicate DATA block (4-27d). Lesson 4.B slide 37 shows e2fsck doing all of them on a damaged image ("Block bitmap differences: -3000").|||Khối mất tích (Hình 4-27b: bộ đếm đang dùng 0, bộ đếm trống 0) chỉ làm phí chỗ, nên bộ kiểm tra chỉ việc thêm nó vào danh sách trống — FE21 câu 34. Dựng lại danh sách trống là cách sửa cho khối xuất hiện hai lần trong danh sách trống (4-27c); cấp khối trống rồi chép là cách sửa cho khối DỮ LIỆU trùng (4-27d). Bài 4.B slide 37 cho e2fsck làm cả ba trên một ảnh bị hỏng ("Block bitmap differences: -3000").' },
    { id: 'q7',
      question: '(FE question type) To remove a file, UNIX must remove it from its directory, release its i-node and return its blocks to the free pool. What does a journaling file system do differently?|||(Dạng câu FE) Để xoá một tệp, UNIX phải gỡ nó khỏi thư mục, trả i-node và trả các khối về kho khối trống. Hệ thống tệp có nhật ký (journaling) làm gì khác?',
      options: ['It performs the three steps in reverse order|||Làm ba bước theo thứ tự ngược lại', 'It appends every change of the whole file system to a log and never updates data in place|||Nối mọi thay đổi của cả hệ thống tệp vào một log và không bao giờ sửa dữ liệu tại chỗ', 'It runs fsck on the whole disk after each deletion|||Chạy fsck trên cả đĩa sau mỗi lần xoá', 'It first writes a log entry listing the three actions to disk, then performs them, then erases the log entry|||Ghi trước xuống đĩa một mục nhật ký liệt kê ba hành động, rồi mới thực hiện, rồi xoá mục nhật ký'],
      correctIndex: 3,
      points: 1,
      explanation: "Journaling = write the plan first (commit it to disk), then act; after a crash the committed but unfinished entry is replayed, so the logged operations must be idempotent. Option B is a log-structured file system (LFS), a different design — FE4 question 29 has both definitions as true statements. Careful: FE17 question 29 and FE25 question 50 ask the same sentence with opposite keys (log-structured vs journaling); for \"logging to make crash recovery safe\" the book's term is journaling. Lesson 4.A, slide 26 pulls the plug on a real ext4 disk.|||Journaling = ghi kế hoạch trước (chốt xuống đĩa), rồi mới làm; sau sự cố, mục đã chốt mà chưa làm xong được phát lại, nên các thao tác ghi trong nhật ký phải lũy đẳng. Phương án B là hệ thống tệp dạng log (LFS), một thiết kế khác — FE4 câu 29 coi cả hai định nghĩa là đúng. Cẩn thận: FE17 câu 29 và FE25 câu 50 hỏi cùng một câu mà khoá ngược nhau (log-structured và journaling); với \"ghi nhật ký để phục hồi an toàn sau sự cố\", thuật ngữ của sách là journaling. Bài 4.A, slide 26 rút điện thật một đĩa ext4." },
    { id: 'q8',
      question: 'In the file allocation table of Figure 4-12 (FAT[2]=10, FAT[3]=11, FAT[4]=7, FAT[6]=3, FAT[7]=2, FAT[10]=12, FAT[11]=14, FAT[12]=-1, FAT[14]=-1), file A starts at block 4. Which blocks does file A occupy, in order?|||Trong bảng FAT của Hình 4-12 (FAT[2]=10, FAT[3]=11, FAT[4]=7, FAT[6]=3, FAT[7]=2, FAT[10]=12, FAT[11]=14, FAT[12]=-1, FAT[14]=-1), tệp A bắt đầu ở khối 4. Tệp A chiếm những khối nào, theo thứ tự?',
      options: ['4, 5, 6, 7, 8|||4, 5, 6, 7, 8', '4, 7, 2, 10, 12|||4, 7, 2, 10, 12', '4, 7, 2, 10, 12, 14|||4, 7, 2, 10, 12, 14', '2, 4, 7, 10, 12|||2, 4, 7, 10, 12'],
      correctIndex: 1,
      points: 1,
      explanation: "Computed by the simulator: start at the block written in the directory entry (4), then repeatedly read FAT[k]: 4 → 7 → 2 → 10 → 12, and FAT[12] = -1 ends the chain. Blocks are in chain order, not numerical order (D), and are not consecutive (A); 14 ends file B's chain 6 → 3 → 11 → 14 (C). The chain is followed in RAM, so reaching block 3 of the file needs no disk reads — the advantage over Figure 4-11. Lesson 4.A, slide 20, with a real FAT-16 chain read by hand.|||Do bộ mô phỏng tính: bắt đầu ở khối ghi trong mục thư mục (4), rồi đọc FAT[k] liên tiếp: 4 → 7 → 2 → 10 → 12, và FAT[12] = -1 kết thúc chuỗi. Các khối theo thứ tự chuỗi, không theo thứ tự số (D), và không liền nhau (A); 14 là chỗ kết thúc chuỗi của tệp B 6 → 3 → 11 → 14 (C). Chuỗi được lần trong RAM, nên tới khối 3 của tệp không tốn lần đọc đĩa nào — ưu điểm so với Hình 4-11. Bài 4.A, slide 20, kèm một chuỗi FAT-16 thật đọc bằng tay." },
    { id: 'q9',
      question: '(FE question type) Free blocks are kept in a linked list of disk blocks. With 1 KB blocks and 32-bit disk block numbers, how many free-block numbers does each block of the list hold?|||(Dạng câu FE) Khối trống được giữ trong một danh sách liên kết các khối đĩa. Với khối 1 KB và số hiệu khối 32 bit, mỗi khối của danh sách chứa bao nhiêu số hiệu khối trống?',
      options: ['255|||255', '256|||256', '1024|||1024', '32|||32'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by the simulator: 1024 bytes / 4 bytes = 256 slots, but one slot is needed for the pointer to the next block of the list, leaving 255 free-block numbers (FE10 question 35; the book: "each block on the free list holds the numbers of 255 free blocks"). 256 forgets the link. For a 1 TB disk this list needs about 4.2 million blocks when the disk is empty, a bitmap only 131,072. Lesson 4.B, slide 31.|||Do bộ mô phỏng tính: 1024 byte / 4 byte = 256 ô, nhưng một ô phải dành cho con trỏ tới khối kế của danh sách, còn 255 số hiệu khối trống (FE10 câu 35; sách: "mỗi khối của danh sách chứa số hiệu của 255 khối trống"). 256 là quên mất ô liên kết. Với đĩa 1 TB, danh sách này cần khoảng 4,2 triệu khối khi đĩa trống, bitmap chỉ 131.072. Bài 4.B, slide 31.' },
    { id: 'q10',
      question: 'What does this C fragment print (st_nlink is the link count stored in the i-node)?|||Đoạn C này in ra gì (st_nlink là số liên kết ghi trong i-node)?',
      code: `close(creat("a", 0644));
link("a", "b");
link("b", "c");
symlink("a", "s");
unlink("a");
struct stat st;
stat("c", &st);
printf("%ld", (long)st.st_nlink);`,
      codeLang: 'c',
      options: ['1|||1', '3|||3', '4|||4', '2|||2'],
      correctIndex: 3,
      points: 1,
      explanation: 'Output of the real program: 2. The file gets three names a, b, c (count 3); the symbolic link s is a separate i-node and does not change the count; unlink("a") removes one name, leaving 2 — b and c still reach the same data, while s now dangles. Lesson 4.A slides 24–25, and practice 4.C exercise 5.|||Output của chương trình thật: 2. Tệp có ba tên a, b, c (số đếm 3); liên kết mềm s là một i-node riêng nên không đổi số đếm; unlink("a") gỡ một tên, còn 2 — b và c vẫn tới cùng dữ liệu, còn s giờ trỏ vào hư không. Bài 4.A slide 24–25, và bài tập 5 của thực hành 4.C.' },
  ],
};

export default {
  slides: [L_osg4_1, L_osg4_2],
  practice: L_on_ch4,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 4 viết lại theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán và câu "in ra gì" có đáp án kiểm bằng mô phỏng hoặc chương trình C chạy thật: cỡ tệp tối đa với i-node có khối gián tiếp, cỡ phân vùng FAT-16 tối đa, thư mục UNIX chứa gì, liên kết cứng và mềm, hiệu suất dùng chỗ theo cỡ khối, cách fsck sửa khối mất tích, hệ thống tệp có nhật ký, chuỗi FAT, danh sách khối trống và số liên kết sau link/unlink.',
};
