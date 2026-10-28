/**
 * Operating Systems for Developers — Chương 13: Bảo mật ở tầng hệ điều hành (soạn 28/10/2026 theo _HOP-DONG.md).
 * KHUNG THUẦN PHÒNG THỦ VÀ GIÁO DỤC: mọi thực hành chỉ chạy trên chương trình ĐỒ CHƠI tự viết, trong container lab vứt
 * đi của chính người học. Không nhắm hệ thống thật nào, không có payload dùng được để tấn công phần mềm có thật — mục
 * tiêu là HIỂU cơ chế để viết code an toàn và nhận diện lỗi.
 *
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/code/ch13/*.sh → lab/out/c131-doc, c132-overflow, c133-dacquyen,
 * c134-container, c134-priv, c134-userns), cùng bộ chạy `phien`. Máy đo: Docker Desktop trên Apple Silicon (arm64,
 * nhân 7.0 linuxkit, gcc 15 / glibc 2.43, Node 22, Java 21). Vì lab là arm64 nên quy ước gọi hàm minh hoạ bằng arm64
 * (x0/x1, x29/x30) và nhắc thêm x86-64 (rdi/rsi, rbp/rsp) trong lời giảng.
 *
 * Chạy lại output (từ thư mục lab/):
 *   docker run --rm --label oslab=1 --hostname oslab [cờ] -v "$PWD/code/ch13":/lab/ch13 -w /lab/ch13 os-lab bash -c "phien <kb>.sh 2>&1" > out/<kb>.out.txt
 *   cờ: c131-doc, c132-overflow --security-opt seccomp=unconfined (setarch/ASLR, không bắt buộc) ·
 *       c133-dacquyen --sysctl net.ipv4.ip_unprivileged_port_start=1024 (để cổng 80 là cổng đặc quyền) ·
 *       c134-container: không cờ (xem container MẶC ĐỊNH) · c134-priv --privileged (tương phản) ·
 *       c134-userns --security-opt seccomp=unconfined (cho phép unprivileged user namespace).
 * Lưu ý thật đã đo: thư mục lab gắn vào là nosuid+no_xattr nên các demo setuid/capability dựng trên fs riêng của
 * container (/srv/lab). KHÔNG tắt ASLR toàn cục trên host; chỉ dùng setarch -R trong container.
 * Ranh giới: bố cục bộ nhớ/stack/ASLR ở Chương 7, chế độ user/kernel ở Chương 1, namespace/cgroup ở Chương 12 — chỉ trỏ sang.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, code } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G131 from './giang/os-13-1.mjs';
import G132 from './giang/os-13-2.mjs';
import G133 from './giang/os-13-3.mjs';
import G134 from './giang/os-13-4.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const CH1 = '/courses/operating-systems-for-developers/learn?lessonSlug=os-1-3-che-do';
const CH7 = '/courses/operating-systems-for-developers/learn?lessonSlug=os-7-1-khong-gian';
const CH12 = '/courses/operating-systems-for-developers/learn?lessonSlug=os-12-1-namespaces';

export default {
  title: 'Chapter 13 — Security at the OS layer|||Chương 13 — Bảo mật ở tầng hệ điều hành',
  description: 'Hiểu bộ nhớ và quyền đủ sâu để mổ xẻ và phòng thủ — thuần phòng thủ, chỉ trên chương trình đồ chơi trong lab vứt đi của bạn: đọc một tệp nhị phân (ELF, readelf, objdump, nm, gdb, khung stack, quy ước gọi hàm arm64/x86-64); tràn bộ đệm trên chương trình tự viết và từng lớp phòng vệ chặn nó (canary, NX, ASLR/PIE, RELRO, FORTIFY, ASan); đặc quyền (SUID, capabilities, quyền file, TOCTOU, rò bí mật qua /proc); và container nhìn từ bảo mật (vì sao --privileged và docker.sock nguy hiểm, user namespace rootless, seccomp/AppArmor, NoNewPrivileges, cứng hoá systemd).',
  lessons: [
    /* ───────────────────────── 13.1 — Reading a binary ───────────────────────── */
    {
      title: '13.1 — Reading a binary: ELF, disassembly, stack frames and the calling convention|||13.1 — Đọc một tệp nhị phân: ELF, tháo rời, khung stack và quy ước gọi hàm',
      slug: 'os-13-1-bo-nho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một chương trình C ba dòng trở thành ELF; readelf đọc phần đầu và các section; nm liệt kê ký hiệu; objdump tháo rời đúng một hàm ra mã máy arm64; và gdb dừng ở hàm đó để xem tham số, khung stack, backtrace và từng lệnh — nền móng của dịch ngược và của việc hiểu mọi lỗi bộ nhớ sau này.',
      content: `${G131}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>To defend a program, first read what it really became</h2>
<p class="lead">You want to work on backend and security, and you said it plainly: a great many vulnerabilities live at the OS layer, and to analyse code you must understand how a program sits in memory. This chapter is strictly defensive — every program here is a tiny toy you wrote, running in your own throwaway lab container, never aimed at anything real. We start at the foundation: a C program is not what runs. The compiler turns it into an <strong>ELF</strong> file of machine code, and the CPU runs that. This lesson opens one up with <code>readelf</code>, <code>nm</code>, <code>objdump</code> and <code>gdb</code>, reads one function back from its machine code, and watches a function call build a <strong>stack frame</strong> — the same frame whose edges the next two lessons are all about.</p>

<h3>A C program becomes an ELF file for one machine</h3>
<p>Here is the program we take apart — small enough to read every instruction. It computes a subtotal, a discount and a tax, so its one function <code>total()</code> has a few locals worth watching:</p>
${src('ch13/add.c', 'c')}
${run('c131-doc', 'uname -m', 1)}
${run('c131-doc', './add 100 3', 1)}
<p><code>total(100, 3)</code> = 283: subtotal 300, minus 10% = 270, plus 5% tax = 283. Now ask what kind of file <code>add</code> is:</p>
${run('c131-doc', 'file add', 1)}
<p><strong>ELF</strong> (Executable and Linkable Format) is the container Linux uses for programs, shared libraries and object files. <code>file</code> already tells you a lot: 64-bit, <strong>PIE</strong> (position-independent — the <em>DYN</em> type, so ASLR can move it, lesson 7.1), for <strong>ARM aarch64</strong> (our lab is arm64), dynamically linked against the C library, and <em>not stripped</em> (it still carries symbol names). <code>readelf -h</code> prints the header the kernel reads first when it <code>exec</code>s the file:</p>
${run('c131-doc', 'readelf -h add', 1)}
<p>The <strong>entry point</strong> is where execution begins; the type <code>DYN</code> confirms PIE; the machine is <code>AArch64</code>. The kernel validates this header, maps the file's segments into the new address space (the regions you drew in lesson 7.1) and jumps to the entry point. A program is a file with a map inside it.</p>

<h3>Sections and symbols: where the code and data live</h3>
<p>The same regions you measured in Chapter 7 are declared in the file as <strong>sections</strong>:</p>
${run('c131-doc', 'readelf -S add', 1)}
<p><code>.text</code> is the machine code, <code>.rodata</code> the read-only constants, <code>.data</code> the initialised globals, <code>.bss</code> the zero globals; <code>.plt</code> and <code>.got</code> are the tables that let the program call library functions — remember the GOT, it comes back in lesson 13.2 under RELRO. <code>nm</code> lists the <strong>symbols</strong>, so you can find a function's address by name:</p>
${run('c131-doc', 'nm add', 1)}
<p><code>T</code> means a function in <code>.text</code>. Our <code>total</code> is at offset <code>0x7e8</code>, <code>main</code> at <code>0x868</code>. (Stripping a binary removes these names — then you work with addresses only, which is why <code>nm</code> coming up empty is the first thing a reverse engineer notices.)</p>

<h3>One function, read back from machine code</h3>
<p><code>objdump -d</code> disassembles — turns machine code back into assembly. Ask for just <code>total()</code>:</p>
${run('c131-doc', 'objdump -d --no-show-raw-insn add', 1)}
<p>Read it as a story. <code>sub sp, sp, #0x20</code> makes room on the stack for the locals — this is the frame opening. <code>str w0, [sp, #12]</code> and <code>str w1, [sp, #8]</code> save the two arguments: by the <strong>arm64 calling convention</strong>, the first integer arguments arrive in registers <code>x0, x1, x2…</code> (their 32-bit halves <code>w0, w1</code> for <code>int</code>). <code>mul</code> computes the subtotal; the <code>#0x6667</code> / <code>smull</code> / <code>asr</code> dance is how the compiler divides by 10 without a divide instruction (multiply by a magic reciprocal). The result ends up in <code>w0</code> — the return-value register — and <code>add sp, sp, #0x20</code> plus <code>ret</code> closes the frame and returns. On <strong>x86-64</strong> the same ideas wear different names: arguments in <code>rdi, rsi, rdx…</code>, return in <code>rax</code>, the frame framed by <code>rbp</code>/<code>rsp</code>, and <code>ret</code> at the end.</p>

<h3>Step through it in gdb: arguments, frame, backtrace</h3>
<p>A disassembly is static; <code>gdb</code> lets you stop inside the running function and look around. This batch session breaks at <code>total</code>, runs with our arguments, and prints the arguments, the backtrace and the frame:</p>
${run('c131-doc', 'gdb -q -batch', 1)}
<p>Everything a debugger (and a reverse engineer) leans on is here. <code>info args</code> shows <code>price=100 qty=3</code>. <code>bt</code> (backtrace) shows the <strong>call chain</strong>: frame #0 is <code>total</code>, frame #1 is <code>main</code> at <code>add.c:16</code>, the line that called us — this is the same chain you see in a Node or Java stack trace, here at the machine level. <code>info frame</code> names the two pointers that define every frame: the current <code>pc</code> (program counter) and the <strong>saved pc</strong> (<code>0x…08dc</code>) — the <strong>return address</strong>, the instruction in <code>main</code> we will jump back to. Hold on to that: lesson 13.2 is entirely about what happens when a bug overwrites that saved return address. <code>x/4i $pc</code> examines memory as instructions; <code>info registers</code> shows <code>x0</code> now holds 300, the subtotal.</p>
${lab('memory', 'stack', 'en', 'Each call pushes a frame — saved registers, the return address, and the locals total() reserved with "sub sp, #0x20". Watch the frame grow and shrink as you step.')}

<div class="pitfall co-tieu-de">
<p><strong>A debugger turns ASLR off for the program it launches.</strong> Addresses in gdb are stable between runs (that is why <code>0xaaaa…</code> keeps reappearing), but the <em>same</em> program started normally gets a fresh random layout every time (lesson 7.1). So an address you noted under gdb will not match a normal run — and a memory bug that depends on a specific layout can "disappear under gdb". Reason about <em>offsets within a function</em>, which are fixed, not absolute addresses, which move.</p>
</div>

<h3>Without debug info, you still get the shape</h3>
<p>Most binaries you meet have no source and no debug symbols. Compile the helper at <code>-O2</code> and disassemble its <code>main</code>:</p>
${run('c131-doc', 'gcc -O2 greet.c', 1)}
${run('c131-doc', 'objdump -d --no-show-raw-insn greet', 1)}
<p>Even here the frame is readable: <code>sub sp, sp, #0x40</code> opens it, <code>stp x29, x30, [sp, #48]</code> saves the frame pointer (<code>x29</code>) and the return address (<code>x30</code>, the link register) together, and the three instructions around <code>sp, #40</code> that load a value, store it and reload it at the end are the <strong>stack canary</strong> being planted and checked — lesson 13.2 shows what it defends. Reading a function from its bytes is the foundation of reverse engineering, of understanding a crash dump, and of trusting that a binary does what its source says.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a service is crashing and all you have on the box is the stripped binary and a core dump — no source. Before you can reason about it you need to be fluent with the tools, so you drill them on a program you do understand.</p>
<ol>
<li>In the lab, build <code>add.c</code> with <code>gcc -O0 -g add.c -o add</code>. Run <code>readelf -h add</code> and write down the type and entry point; run <code>nm add</code> and find the address of <code>total</code>.</li>
<li><code>objdump -d add</code> and locate <code>total</code>. Identify the instruction that opens the frame and the <code>ret</code> that closes it.</li>
<li><code>gdb -q ./add</code>, then <code>break total</code>, <code>run 100 3</code>, <code>info args</code>, <code>bt</code>, <code>info frame</code>. Find the saved return address and confirm it points into <code>main</code>.</li>
<li>Rebuild stripped: <code>gcc -O2 -s add.c -o add-s</code>. Run <code>nm add-s</code> (it will say "no symbols") and <code>objdump -d add-s</code>. Can you still find the function that multiplies? What did you lose?</li>
</ol>
<p><strong>Done when:</strong> you can point at the frame-opening instruction, read the arguments out of <code>x0</code>/<code>x1</code> (or <code>rdi</code>/<code>rsi</code> on x86-64), and explain, from <code>info frame</code>, where the function will return to — in your own words.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['ELF', 'The file format Linux uses for executables, shared libraries and object files: a header plus sections/segments.'],
  ['section vs segment', '.text/.rodata/.data/.bss describe the file for the linker; segments are what the kernel maps at exec.'],
  ['symbol', 'A name attached to an address (a function or global). nm lists them; stripping removes them.'],
  ['disassembly', 'Machine code turned back into assembly (objdump -d). The inverse of what the assembler did.'],
  ['calling convention', 'The agreed rules for passing arguments and returning: arm64 x0–x7 + return in x0; x86-64 rdi,rsi,… + rax.'],
  ['stack frame', 'The slice of stack one function call owns: saved registers, the return address, and its locals.'],
  ['return address', 'Where a function jumps back to when it ends (arm64 x30/saved pc). The target of the next lesson.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A C program is compiled into an <strong>ELF</strong> file of machine code for one architecture; the kernel reads its header and maps it to run.</li>
<li><code>readelf</code> shows the header and sections; <code>nm</code> lists symbols; <code>objdump -d</code> disassembles a function back to assembly.</li>
<li>The <strong>calling convention</strong> fixes where arguments and return values go (arm64 x0–x7/x0; x86-64 rdi…/rax), so you can read any function.</li>
<li>Each call builds a <strong>stack frame</strong>: <code>sub sp, #N</code> opens it, saved <code>x29/x30</code> hold the frame pointer and return address, <code>ret</code> closes it.</li>
<li>gdb (<code>break</code>, <code>run</code>, <code>info args</code>, <code>bt</code>, <code>info frame</code>, <code>x/i</code>) stops inside a running function — the foundation of debugging and reverse engineering.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/elf.5.html', '📄', 'man 5 elf', 'The ELF format: header, sections and segments, field by field.', 'Open')}
${L('https://man7.org/linux/man-pages/man1/objdump.1.html', '🔧', 'man 1 objdump', 'Disassembly and the many ways to inspect an object file.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Muốn phòng thủ một chương trình, trước hết hãy đọc thứ nó thật sự trở thành</h2>
<p class="lead">Bạn muốn làm backend và bảo mật, và bạn nói thẳng: rất nhiều lỗ hổng nằm ở tầng hệ điều hành, muốn phân tích mã thì phải hiểu một chương trình nằm trong bộ nhớ ra sao. Chương này THUẦN PHÒNG THỦ — mọi chương trình ở đây là một món đồ chơi bé xíu bạn tự viết, chạy trong container lab vứt đi của chính bạn, không bao giờ nhắm vào thứ gì có thật. Ta bắt đầu từ nền móng: mã C không phải là thứ chạy. Trình biên dịch biến nó thành một tệp <strong>ELF</strong> gồm mã máy, và CPU chạy cái đó. Bài này mở một tệp như vậy ra bằng <code>readelf</code>, <code>nm</code>, <code>objdump</code> và <code>gdb</code>, đọc lại một hàm từ mã máy của nó, và nhìn một lời gọi hàm dựng nên một <strong>khung stack</strong> — chính cái khung mà hai bài sau xoay quanh các bờ của nó.</p>

<h3>Mã C trở thành một tệp ELF cho một máy cụ thể</h3>
<p>Đây là chương trình ta mổ xẻ — đủ nhỏ để đọc từng lệnh. Nó tính tổng tạm, chiết khấu và thuế, nên hàm <code>total()</code> duy nhất của nó có vài biến cục bộ đáng nhìn:</p>
${src('ch13/add.c', 'c')}
${run('c131-doc', 'uname -m', 1)}
${run('c131-doc', './add 100 3', 1)}
<p><code>total(100, 3)</code> = 283: tổng tạm 300, trừ 10% còn 270, cộng 5% thuế = 283. Giờ hỏi xem <code>add</code> là tệp loại gì:</p>
${run('c131-doc', 'file add', 1)}
<p><strong>ELF</strong> (Executable and Linkable Format) là định dạng Linux dùng cho chương trình, thư viện dùng chung và tệp đối tượng. <code>file</code> đã nói nhiều điều: 64-bit, <strong>PIE</strong> (độc lập vị trí — loại <em>DYN</em>, nên ASLR dời được, bài 7.1), cho <strong>ARM aarch64</strong> (lab của ta là arm64), liên kết động với thư viện C, và <em>not stripped</em> (vẫn còn tên ký hiệu). <code>readelf -h</code> in phần đầu mà nhân đọc trước tiên khi <code>exec</code> tệp:</p>
${run('c131-doc', 'readelf -h add', 1)}
<p><strong>Điểm vào (entry point)</strong> là nơi bắt đầu chạy; loại <code>DYN</code> xác nhận PIE; máy là <code>AArch64</code>. Nhân kiểm phần đầu này, ánh xạ các segment của tệp vào không gian địa chỉ mới (các vùng bạn đã vẽ ở bài 7.1) rồi nhảy tới điểm vào. Một chương trình là một tệp có sẵn tấm bản đồ bên trong.</p>

<h3>Section và symbol: mã và dữ liệu nằm ở đâu</h3>
<p>Chính các vùng bạn đã đo ở Chương 7 được khai báo trong tệp dưới dạng <strong>section</strong>:</p>
${run('c131-doc', 'readelf -S add', 1)}
<p><code>.text</code> là mã máy, <code>.rodata</code> là hằng chỉ-đọc, <code>.data</code> là biến toàn cục có giá trị đầu, <code>.bss</code> là biến toàn cục bằng 0; <code>.plt</code> và <code>.got</code> là các bảng để chương trình gọi được hàm thư viện — nhớ cái GOT, nó quay lại ở bài 13.2 trong mục RELRO. <code>nm</code> liệt kê <strong>symbol (ký hiệu)</strong>, để bạn tìm địa chỉ một hàm theo tên:</p>
${run('c131-doc', 'nm add', 1)}
<p><code>T</code> nghĩa là một hàm trong <code>.text</code>. <code>total</code> của ta ở offset <code>0x7e8</code>, <code>main</code> ở <code>0x868</code>. (Strip một tệp sẽ xoá các tên này — khi đó bạn chỉ còn làm việc với địa chỉ, và <code>nm</code> trả về rỗng là điều đầu tiên một người dịch ngược để ý.)</p>

<h3>Một hàm, đọc lại từ mã máy</h3>
<p><code>objdump -d</code> tháo rời (disassemble) — biến mã máy ngược lại thành hợp ngữ. Xin riêng <code>total()</code>:</p>
${run('c131-doc', 'objdump -d --no-show-raw-insn add', 1)}
<p>Đọc nó như một câu chuyện. <code>sub sp, sp, #0x20</code> chừa chỗ trên stack cho biến cục bộ — đây là lúc mở khung. <code>str w0, [sp, #12]</code> và <code>str w1, [sp, #8]</code> lưu hai tham số: theo <strong>quy ước gọi hàm arm64</strong>, các tham số nguyên đầu tiên tới trong thanh ghi <code>x0, x1, x2…</code> (nửa 32-bit là <code>w0, w1</code> cho <code>int</code>). <code>mul</code> tính tổng tạm; màn <code>#0x6667</code> / <code>smull</code> / <code>asr</code> là cách trình biên dịch chia cho 10 mà không dùng lệnh chia (nhân với một số nghịch đảo kỳ diệu). Kết quả rơi vào <code>w0</code> — thanh ghi giá trị trả về — rồi <code>add sp, sp, #0x20</code> cùng <code>ret</code> đóng khung và trả về. Trên <strong>x86-64</strong> cùng những ý đó mang tên khác: tham số trong <code>rdi, rsi, rdx…</code>, trả về trong <code>rax</code>, khung được đóng khung bởi <code>rbp</code>/<code>rsp</code>, và <code>ret</code> ở cuối.</p>

<h3>Đi từng bước trong gdb: tham số, khung, backtrace</h3>
<p>Một bản disassembly là tĩnh; <code>gdb</code> cho bạn dừng bên trong hàm đang chạy và nhìn quanh. Phiên batch này đặt điểm dừng ở <code>total</code>, chạy với tham số của ta, rồi in tham số, backtrace và khung:</p>
${run('c131-doc', 'gdb -q -batch', 1)}
<p>Mọi thứ một trình gỡ lỗi (và một người dịch ngược) dựa vào đều ở đây. <code>info args</code> hiện <code>price=100 qty=3</code>. <code>bt</code> (backtrace) hiện <strong>chuỗi lời gọi</strong>: khung #0 là <code>total</code>, khung #1 là <code>main</code> tại <code>add.c:16</code> — đúng dòng đã gọi ta — chính là chuỗi bạn thấy trong một stack trace của Node hay Java, ở đây ở mức mã máy. <code>info frame</code> nêu hai con trỏ định nghĩa mọi khung: <code>pc</code> hiện tại (program counter) và <strong>saved pc</strong> (<code>0x…08dc</code>) — <strong>địa chỉ trả về</strong>, chính lệnh trong <code>main</code> mà ta sẽ nhảy về. Giữ lấy nó: bài 13.2 toàn bộ nói về chuyện gì xảy ra khi một lỗi ghi đè lên địa chỉ trả về đã lưu đó. <code>x/4i $pc</code> xem bộ nhớ dưới dạng lệnh; <code>info registers</code> cho thấy <code>x0</code> giờ giữ 300, tổng tạm.</p>
${lab('memory', 'stack', 'vi', 'Mỗi lời gọi đẩy một khung — thanh ghi đã lưu, địa chỉ trả về, và các biến cục bộ mà total() chừa ra bằng "sub sp, #0x20". Nhìn khung lớn lên rồi thu lại khi bạn bước.')}

<div class="pitfall co-tieu-de">
<p><strong>Trình gỡ lỗi tắt ASLR cho chương trình nó khởi chạy.</strong> Địa chỉ trong gdb ổn định giữa các lần chạy (nên <code>0xaaaa…</code> cứ hiện lại), nhưng <em>cùng</em> chương trình đó chạy bình thường lại nhận một bố cục ngẫu nhiên mới mỗi lần (bài 7.1). Nên một địa chỉ bạn ghi lại dưới gdb sẽ không khớp với lần chạy thường — và một lỗi bộ nhớ phụ thuộc vào một bố cục cụ thể có thể "biến mất khi chạy trong gdb". Hãy lập luận theo <em>offset bên trong một hàm</em>, thứ cố định, chứ đừng theo địa chỉ tuyệt đối, thứ di chuyển.</p>
</div>

<h3>Không có thông tin gỡ lỗi, bạn vẫn thấy được hình dạng</h3>
<p>Phần lớn tệp nhị phân bạn gặp không có mã nguồn lẫn ký hiệu gỡ lỗi. Biên dịch helper ở <code>-O2</code> và tháo rời <code>main</code> của nó:</p>
${run('c131-doc', 'gcc -O2 greet.c', 1)}
${run('c131-doc', 'objdump -d --no-show-raw-insn greet', 1)}
<p>Ngay cả ở đây khung vẫn đọc được: <code>sub sp, sp, #0x40</code> mở nó, <code>stp x29, x30, [sp, #48]</code> lưu con trỏ khung (<code>x29</code>) và địa chỉ trả về (<code>x30</code>, thanh ghi liên kết) cùng nhau, và ba lệnh quanh <code>sp, #40</code> nạp một giá trị, lưu nó rồi nạp lại ở cuối chính là <strong>stack canary</strong> đang được cắm vào và kiểm — bài 13.2 cho thấy nó phòng thủ cái gì. Đọc một hàm từ byte của nó là nền móng của dịch ngược, của việc hiểu một core dump, và của việc tin rằng một tệp nhị phân làm đúng như mã nguồn nói.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một dịch vụ đang sập và trên máy bạn chỉ có tệp nhị phân đã strip và một core dump — không có mã nguồn. Trước khi lập luận được về nó, bạn phải thạo các công cụ, nên bạn luyện trên một chương trình bạn hiểu rõ.</p>
<ol>
<li>Trong lab, dựng <code>add.c</code> bằng <code>gcc -O0 -g add.c -o add</code>. Chạy <code>readelf -h add</code> và ghi lại loại cùng điểm vào; chạy <code>nm add</code> và tìm địa chỉ của <code>total</code>.</li>
<li><code>objdump -d add</code> và định vị <code>total</code>. Chỉ ra lệnh mở khung và lệnh <code>ret</code> đóng khung.</li>
<li><code>gdb -q ./add</code>, rồi <code>break total</code>, <code>run 100 3</code>, <code>info args</code>, <code>bt</code>, <code>info frame</code>. Tìm địa chỉ trả về đã lưu và xác nhận nó trỏ vào <code>main</code>.</li>
<li>Dựng lại bản strip: <code>gcc -O2 -s add.c -o add-s</code>. Chạy <code>nm add-s</code> (nó báo "no symbols") và <code>objdump -d add-s</code>. Bạn còn tìm được hàm nhân không? Bạn đã mất gì?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ được lệnh mở khung, đọc được tham số ra từ <code>x0</code>/<code>x1</code> (hoặc <code>rdi</code>/<code>rsi</code> trên x86-64), và giải thích được, từ <code>info frame</code>, hàm sẽ trả về chỗ nào — bằng lời của chính bạn.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['ELF', 'Định dạng tệp Linux dùng cho chương trình thực thi, thư viện dùng chung và tệp đối tượng: một phần đầu cộng các section/segment.'],
  ['section vs segment', '.text/.rodata/.data/.bss mô tả tệp cho trình liên kết; segment là thứ nhân ánh xạ lúc exec.'],
  ['symbol (ký hiệu)', 'Một cái tên gắn với một địa chỉ (hàm hay biến toàn cục). nm liệt kê chúng; strip xoá chúng.'],
  ['disassembly (tháo rời)', 'Mã máy biến ngược thành hợp ngữ (objdump -d). Việc ngược lại của trình hợp dịch.'],
  ['calling convention (quy ước gọi hàm)', 'Luật đã thống nhất để truyền tham số và trả về: arm64 x0–x7 + trả về x0; x86-64 rdi,rsi,… + rax.'],
  ['stack frame (khung stack)', 'Lát stack mà một lời gọi hàm sở hữu: thanh ghi đã lưu, địa chỉ trả về, và biến cục bộ.'],
  ['return address (địa chỉ trả về)', 'Nơi một hàm nhảy về khi kết thúc (arm64 x30/saved pc). Mục tiêu của bài kế.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mã C được biên dịch thành một tệp <strong>ELF</strong> gồm mã máy cho MỘT kiến trúc; nhân đọc phần đầu của nó rồi ánh xạ để chạy.</li>
<li><code>readelf</code> hiện phần đầu và các section; <code>nm</code> liệt kê ký hiệu; <code>objdump -d</code> tháo rời một hàm về hợp ngữ.</li>
<li><strong>Quy ước gọi hàm</strong> cố định nơi tham số và giá trị trả về đi qua (arm64 x0–x7/x0; x86-64 rdi…/rax), nhờ đó bạn đọc được mọi hàm.</li>
<li>Mỗi lời gọi dựng một <strong>khung stack</strong>: <code>sub sp, #N</code> mở, <code>x29/x30</code> đã lưu giữ con trỏ khung và địa chỉ trả về, <code>ret</code> đóng.</li>
<li>gdb (<code>break</code>, <code>run</code>, <code>info args</code>, <code>bt</code>, <code>info frame</code>, <code>x/i</code>) dừng bên trong một hàm đang chạy — nền móng của gỡ lỗi và dịch ngược.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/elf.5.html', '📄', 'man 5 elf', 'Định dạng ELF: phần đầu, các section và segment, từng trường một.', 'Mở')}
${L('https://man7.org/linux/man-pages/man1/objdump.1.html', '🔧', 'man 1 objdump', 'Tháo rời và nhiều cách soi một tệp đối tượng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 13.2 — Buffer overflow and its mitigations ───────────────────────── */
    {
      title: '13.2 — Buffer overflow and its mitigations: canary, NX, ASLR/PIE, RELRO, FORTIFY, ASan|||13.2 — Tràn bộ đệm và các lớp phòng vệ: canary, NX, ASLR/PIE, RELRO, FORTIFY, ASan',
      slug: 'os-13-2-overflow',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một strcpy không kiểm độ dài, trên chương trình đồ chơi tự viết: 20 byte vào bộ đệm 16 byte ghi đè một biến cục bộ; 200 byte ghi đè địa chỉ trả về và sập (Bus error, exit 135). Rồi từng lớp phòng vệ chặn CHÍNH cú tràn đó — stack canary (exit 134), NX/W^X, ASLR+PIE, Full RELRO, FORTIFY_SOURCE — đọc cờ bằng readelf; chuỗi định dạng và use-after-free/double-free bắt bằng AddressSanitizer; và bản sửa đúng.',
      content: `${G132}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>What a buffer overflow actually overwrites — and six layers that stop it</h2>
<p class="lead">In lesson 13.1 you watched a function reserve locals and save its return address on the stack. A <strong>buffer overflow</strong> is what happens when a program writes past the end of a buffer and keeps going into whatever sits next: another local, then the saved registers, then that return address. This lesson reproduces it on a toy program you compiled yourself — first with every defence off, so you can see the mechanism, then turning the modern defences back on one by one to watch each stop the exact same bug. The goal is never a working exploit; it is to understand why memory-unsafe code is dangerous and how to write code that is not.</p>

<h3>Overwriting the local next door</h3>
<p>This toy copies its argument into a 16-byte buffer with <code>strcpy</code> — no length check — and keeps an <code>int flag</code> right after it in one struct, so an over-long copy spills onto the flag. It is built <code>-fno-stack-protector -O0</code> on purpose, so nothing interferes:</p>
${src('ch13/vuln.c', 'c')}
${run('c132-overflow', './vuln hello', 1)}
${run('c132-overflow', './vuln AAAAAAAAAAAAAAAAAAAA', 1)}
<p>A short string fits and <code>flag</code> stays 0. Twenty <code>A</code>s (0x41) into sixteen bytes spill four bytes onto <code>flag</code>, which becomes <code>0x41414141</code> = 1094795585. The program never asked to change <code>flag</code>; the copy did, because C does not check. This is the whole idea of memory corruption: data written past its bounds silently becomes <em>other</em> data — a flag, a length, a pointer.</p>

<h3>Reaching the return address</h3>
<p>Put the same bug in a called function and overflow far enough to reach the saved return address from lesson 13.1:</p>
${src('ch13/retaddr.c', 'c')}
${run('c132-overflow', './retaddr AAAAAAAAAAAAAAAA', 1)}
${run('c132-overflow', './retaddr $(python3', 1)}
<p>Sixteen <code>A</code>s fit and the function returns normally. Two hundred <code>A</code>s overrun the saved <code>x30</code>/return address; when <code>ret</code> loads it, the CPU jumps to <code>0x4141414141414141</code>, an address that is not mapped as code, and the kernel kills the process — here a <strong>Bus error</strong>, exit <strong>135</strong> (128 + 7) on this arm64 machine; on x86-64 it is usually a SIGSEGV, exit 139. The payload is only <code>A</code>s: the point is to <em>see</em> that the return address is reachable, not to run anything. Making that jump land on useful code is exactly what the defences below exist to prevent.</p>
${lab('memory', 'overflow', 'en', 'Type into the buffer and watch the bytes spill past buf[16] onto the saved registers and the return address — then turn the canary, NX and ASLR on and see each one stop it.')}

<h3>Reading the defences off the binary (a checksec in a few greps)</h3>
<p>Modern toolchains build several mitigations in by default. You can read which are present straight from the ELF file — this is what <code>checksec</code> does under the hood. Rebuild the toy at <code>-O2</code> (defaults on) and inspect it:</p>
${run('c132-overflow', 'readelf -s vuln-hardened', 1)}
<p><strong>Stack canary:</strong> the hardened build links <code>__stack_chk_fail</code> (count 1); the <code>-fno-stack-protector</code> build does not (count 0). The canary is a random value the function places just before the saved return address on entry and checks before <code>ret</code>; if an overflow changed it, the check aborts.</p>
${run('c132-overflow', 'readelf -l vuln-hardened | grep -A1 GNU_STACK', 1)}
<p><strong>NX / W<sup>X</sup>:</strong> the <code>GNU_STACK</code> segment is <code>RW</code>, never <code>RWE</code> — the stack is writable but <em>not executable</em>, so even if an attacker writes bytes there, the CPU refuses to run them.</p>
${run('c132-overflow', 'readelf -h vuln-hardened', 1)}
${run('c132-overflow', 'readelf -d vuln-hardened', 1)}
<p><strong>PIE:</strong> the ELF type is <code>DYN</code>, so ASLR (lesson 7.1) moves the code at every run — an attacker cannot know an address in advance. <strong>Full RELRO:</strong> the <code>BIND_NOW</code> flag plus a <code>GNU_RELRO</code> segment (count 1) make the GOT — the table of library-function pointers from lesson 13.1 — read-only after start-up, so an overflow cannot redirect a library call. Five flags, three <code>readelf</code> commands.</p>

<h3>Each defence stops the same overflow</h3>
<p>Rebuild <code>retaddr.c</code> with the canary on (the default) and feed it the same 200 bytes:</p>
${run('c132-overflow', './retaddr-canary', 1)}
<p><code>*** stack smashing detected ***</code>, then <code>abort()</code> and exit <strong>134</strong> (128 + 6, SIGABRT). The overflow still happened, but the canary caught it <em>before</em> the corrupted return address was used — a controlled crash instead of a hijack. <strong>FORTIFY_SOURCE</strong> adds a second net: at <code>-O2 -D_FORTIFY_SOURCE=3</code> the compiler knows <code>buf</code> is 16 bytes and replaces <code>strcpy</code> with a checked version that aborts the moment the copy exceeds it:</p>
${run('c132-overflow', './retaddr-fortify', 1)}
<p><code>*** buffer overflow detected ***</code>, exit 134 — caught even earlier, at the copy itself.</p>

<h3>The real fix: don't overflow in the first place</h3>
<p>Mitigations turn a silent corruption into a crash; they do not make the code correct. The fix is a bounded copy with an explicit length check:</p>
${src('ch13/safe.c', 'c')}
${run('c132-overflow', './safe hello', 1)}
${run('c132-overflow', './safe $(python3', 1)}
<p>Long input is refused with exit 1, not overflowed. The rules: never <code>strcpy</code>/<code>gets</code>/<code>sprintf</code> into a fixed buffer — use <code>snprintf</code>, <code>strlcpy</code> or <code>fgets</code> with the size; check lengths at the boundary; and where you can, use a memory-safe language (Rust, Go, Java, JavaScript) so the whole class of bug cannot occur.</p>

<div class="pitfall co-tieu-de">
<p><strong>A user string must never be the format string.</strong> <code>printf(user)</code> lets the user's <code>%</code> conversions run — <code>%p</code> prints stack words, leaking addresses that defeat ASLR. Watch the difference:</p>
${run('c132-overflow', './fmt good', 1)}
${run('c132-overflow', './fmt bad', 1)}
<p>The "good" call prints the text literally; the "bad" call interprets <code>%p.%p.%p</code> and leaks three raw stack values. The fix is one character of discipline: always <code>printf("%s", user)</code> — the user is data, never the format. Compilers warn (<code>-Wformat-security</code>); do not silence it.</p>
</div>

<h3>Use-after-free and double-free, caught by AddressSanitizer</h3>
<p>Two more memory bugs, this time on the heap from Chapter 7. Using memory after <code>free</code>, or freeing it twice, is undefined behaviour that can corrupt the allocator. Compile with <code>-fsanitize=address</code> and AddressSanitizer stops at the exact line with both the free and the allocation stacks:</p>
${src('ch13/uaf.c', 'c')}
${run('c132-overflow', './uaf 2', 1)}
${run('c132-overflow', './df 2', 1)}
<p>ASan names the bug (<code>heap-use-after-free</code>, <code>double-free</code>), the line (<code>uaf.c:10</code>, <code>df.c:6</code>), who freed the block and who allocated it. Run your tests and CI under ASan and Valgrind; they turn "works on my machine" bugs that crash randomly in production into a precise report in seconds. This connects straight to Chapter 7's allocator: a use-after-free is reading a chunk the allocator may already have handed to someone else.</p>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> during a review you find a C helper that does <code>char path[64]; strcpy(path, request-&gt;name);</code> with no length check, and the build uses <code>-fno-stack-protector</code>. You need to show the team concretely why both the code and the build flags must change.</p>
<ol>
<li>In the lab, build <code>vuln.c</code> with <code>-fno-stack-protector -O0</code>. Feed it 15, 16, 17 and 24 bytes. At which length does <code>flag</code> first change, and why that length?</li>
<li>Build <code>retaddr.c</code> twice: with and without the canary. Feed both the 200-byte input. Record the exact message and exit code for each.</li>
<li>On the hardened binary, run the three <code>readelf</code> checks for canary, NX and PIE. Write down one sentence per flag: what it defends against.</li>
<li>Build <code>uaf.c</code> and <code>df.c</code> with <code>-fsanitize=address</code> and read the reports. Then fix <code>safe.c</code>-style and confirm it refuses long input.</li>
</ol>
<p><strong>Done when:</strong> you can state the input length that first reaches <code>flag</code>, show the canary turning a hijackable overflow into an <code>abort()</code> (exit 134), and point to the one line in the original helper that fixes the bug regardless of compiler flags.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['buffer overflow', 'Writing past the end of a buffer into whatever sits next: a local, saved registers, the return address.'],
  ['stack canary', 'A random value placed before the return address and checked before return; a change aborts (exit 134).'],
  ['NX / W^X', 'No page is both writable and executable: the stack is RW, so injected bytes cannot be run.'],
  ['ASLR + PIE', 'Random load addresses every run (lesson 7.1); PIE lets it move the code too, so addresses are unpredictable.'],
  ['RELRO', 'Makes the GOT read-only after start-up (BIND_NOW + GNU_RELRO) so an overflow cannot redirect a library call.'],
  ['FORTIFY_SOURCE', 'Compiler replaces str/mem calls with checked versions when it knows the buffer size; aborts on overflow.'],
  ['format string bug', 'Passing user text as the format (printf(user)); %p/%n leak or corrupt memory. Fix: printf("%s", user).'],
  ['use-after-free / double-free', 'Using or re-freeing a freed heap block; undefined behaviour. AddressSanitizer catches both at the exact line.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>An overflow writes past a buffer into the next thing: a local (flag became 0x41414141), then the saved <strong>return address</strong> (a crash — Bus error / exit 135 here).</li>
<li>Six defences, read off the ELF with <code>readelf</code>: <strong>canary</strong>, <strong>NX/W<sup>X</sup></strong>, <strong>ASLR/PIE</strong>, <strong>RELRO</strong>, <strong>FORTIFY_SOURCE</strong> — each turned the same overflow into a controlled abort.</li>
<li>Mitigations make a hijack into a crash; the real fix is a bounded copy + length check (<code>snprintf</code>/<code>fgets</code>), or a memory-safe language.</li>
<li>Never pass user input as a <strong>format string</strong>; always <code>printf("%s", user)</code>.</li>
<li><strong>Use-after-free</strong> and <strong>double-free</strong> are caught precisely by <strong>AddressSanitizer</strong> — run tests and CI under it.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/strcpy.3.html', '📄', 'man 3 strcpy', 'Why strcpy/strcat are unbounded, and the bounded alternatives.', 'Open')}
${L('https://clang.llvm.org/docs/AddressSanitizer.html', '🧷', 'AddressSanitizer', 'Use-after-free, double-free and overflow detection, from the compiler.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Một cú tràn bộ đệm thật sự ghi đè lên cái gì — và sáu lớp chặn nó</h2>
<p class="lead">Ở bài 13.1 bạn đã nhìn một hàm chừa chỗ cho biến cục bộ và lưu địa chỉ trả về trên stack. <strong>Tràn bộ đệm (buffer overflow)</strong> là khi một chương trình ghi quá đuôi một bộ đệm và cứ thế ghi tiếp sang bất cứ thứ gì nằm kế: một biến cục bộ khác, rồi các thanh ghi đã lưu, rồi chính địa chỉ trả về đó. Bài này tái hiện nó trên một chương trình đồ chơi bạn tự biên dịch — đầu tiên tắt hết phòng vệ để thấy cơ chế, rồi bật lại từng lớp phòng vệ hiện đại để xem mỗi cái chặn đúng cùng một lỗi. Mục tiêu không bao giờ là một mã khai thác chạy được; nó là hiểu vì sao code không an toàn bộ nhớ lại nguy hiểm và viết code không như thế ra sao.</p>

<h3>Ghi đè lên biến cục bộ bên cạnh</h3>
<p>Đồ chơi này sao chép tham số vào một bộ đệm 16 byte bằng <code>strcpy</code> — không kiểm độ dài — và giữ một <code>int flag</code> ngay sau nó trong cùng một struct, nên một cú chép quá dài tràn sang flag. Nó được dựng <code>-fno-stack-protector -O0</code> có chủ đích, để không gì xen vào:</p>
${src('ch13/vuln.c', 'c')}
${run('c132-overflow', './vuln hello', 1)}
${run('c132-overflow', './vuln AAAAAAAAAAAAAAAAAAAA', 1)}
<p>Chuỗi ngắn thì vừa và <code>flag</code> vẫn 0. Hai mươi chữ <code>A</code> (0x41) vào mười sáu byte tràn bốn byte sang <code>flag</code>, biến nó thành <code>0x41414141</code> = 1094795585. Chương trình chưa bao giờ xin đổi <code>flag</code>; cú chép đã làm, vì C không kiểm. Đó là toàn bộ ý của hỏng bộ nhớ: dữ liệu ghi quá bờ của nó lặng lẽ trở thành dữ liệu <em>khác</em> — một cờ, một độ dài, một con trỏ.</p>

<h3>Chạm tới địa chỉ trả về</h3>
<p>Đặt cùng lỗi đó vào một hàm được gọi và tràn đủ xa để chạm địa chỉ trả về đã lưu ở bài 13.1:</p>
${src('ch13/retaddr.c', 'c')}
${run('c132-overflow', './retaddr AAAAAAAAAAAAAAAA', 1)}
${run('c132-overflow', './retaddr $(python3', 1)}
<p>Mười sáu chữ <code>A</code> thì vừa và hàm trả về bình thường. Hai trăm chữ <code>A</code> ghi đè <code>x30</code>/địa chỉ trả về đã lưu; khi <code>ret</code> nạp nó, CPU nhảy tới <code>0x4141414141414141</code>, một địa chỉ không được ánh xạ là mã, và nhân giết tiến trình — ở đây là <strong>Bus error</strong>, exit <strong>135</strong> (128 + 7) trên máy arm64 này; trên x86-64 thường là SIGSEGV, exit 139. Payload chỉ toàn chữ <code>A</code>: mục đích là <em>thấy</em> rằng địa chỉ trả về chạm tới được, không phải để chạy thứ gì. Làm cho cú nhảy đó rơi trúng mã có ích chính là điều mà các lớp phòng vệ bên dưới sinh ra để ngăn.</p>
${lab('memory', 'overflow', 'vi', 'Gõ vào bộ đệm và nhìn các byte tràn quá buf[16] sang thanh ghi đã lưu và địa chỉ trả về — rồi bật canary, NX và ASLR và xem từng cái chặn nó.')}

<h3>Đọc các lớp phòng vệ ngay từ tệp nhị phân (một checksec bằng vài lệnh grep)</h3>
<p>Bộ công cụ hiện đại dựng sẵn nhiều lớp phòng vệ theo mặc định. Bạn đọc được lớp nào đang có thẳng từ tệp ELF — đó là điều <code>checksec</code> làm bên dưới. Dựng lại đồ chơi ở <code>-O2</code> (mặc định bật) rồi soi:</p>
${run('c132-overflow', 'readelf -s vuln-hardened', 1)}
<p><strong>Stack canary:</strong> bản hardened liên kết <code>__stack_chk_fail</code> (đếm được 1); bản <code>-fno-stack-protector</code> thì không (đếm 0). Canary là một giá trị ngẫu nhiên hàm đặt ngay trước địa chỉ trả về lúc vào và kiểm trước <code>ret</code>; nếu một cú tràn làm đổi nó, phép kiểm abort.</p>
${run('c132-overflow', 'readelf -l vuln-hardened | grep -A1 GNU_STACK', 1)}
<p><strong>NX / W<sup>X</sup>:</strong> segment <code>GNU_STACK</code> là <code>RW</code>, không bao giờ <code>RWE</code> — stack ghi được nhưng <em>không chạy được</em>, nên kể cả kẻ tấn công ghi byte vào đó, CPU từ chối chạy chúng.</p>
${run('c132-overflow', 'readelf -h vuln-hardened', 1)}
${run('c132-overflow', 'readelf -d vuln-hardened', 1)}
<p><strong>PIE:</strong> loại ELF là <code>DYN</code>, nên ASLR (bài 7.1) dời mã ở mỗi lần chạy — kẻ tấn công không biết trước một địa chỉ nào. <strong>Full RELRO:</strong> cờ <code>BIND_NOW</code> cộng segment <code>GNU_RELRO</code> (đếm 1) khiến GOT — bảng con trỏ hàm thư viện ở bài 13.1 — thành chỉ-đọc sau khởi động, nên một cú tràn không chuyển hướng được một lời gọi thư viện. Năm cờ, ba lệnh <code>readelf</code>.</p>

<h3>Mỗi lớp phòng vệ chặn đúng cú tràn đó</h3>
<p>Dựng lại <code>retaddr.c</code> với canary bật (mặc định) và đưa đúng 200 byte đó:</p>
${run('c132-overflow', './retaddr-canary', 1)}
<p><code>*** stack smashing detected ***</code>, rồi <code>abort()</code> và exit <strong>134</strong> (128 + 6, SIGABRT). Cú tràn vẫn xảy ra, nhưng canary bắt nó <em>trước khi</em> địa chỉ trả về đã hỏng được dùng — một cú sập có kiểm soát thay cho một cú chiếm quyền. <strong>FORTIFY_SOURCE</strong> thêm một lưới thứ hai: ở <code>-O2 -D_FORTIFY_SOURCE=3</code> trình biên dịch biết <code>buf</code> là 16 byte và thay <code>strcpy</code> bằng một bản có kiểm, abort ngay khi cú chép vượt nó:</p>
${run('c132-overflow', './retaddr-fortify', 1)}
<p><code>*** buffer overflow detected ***</code>, exit 134 — bắt còn sớm hơn, ngay tại cú chép.</p>

<h3>Bản sửa thật: đừng để tràn ngay từ đầu</h3>
<p>Các lớp phòng vệ biến một cú hỏng âm thầm thành một cú sập; chúng không làm code đúng. Bản sửa là một cú chép có chặn kèm kiểm độ dài tường minh:</p>
${src('ch13/safe.c', 'c')}
${run('c132-overflow', './safe hello', 1)}
${run('c132-overflow', './safe $(python3', 1)}
<p>Input dài bị từ chối với exit 1, không tràn. Luật: đừng bao giờ <code>strcpy</code>/<code>gets</code>/<code>sprintf</code> vào một bộ đệm cố định — dùng <code>snprintf</code>, <code>strlcpy</code> hoặc <code>fgets</code> kèm kích cỡ; kiểm độ dài ở biên; và chỗ nào được thì dùng ngôn ngữ an toàn bộ nhớ (Rust, Go, Java, JavaScript) để cả lớp lỗi này không thể xảy ra.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một chuỗi của người dùng không bao giờ được LÀM chuỗi định dạng.</strong> <code>printf(user)</code> cho các ký tự <code>%</code> của người dùng chạy — <code>%p</code> in các từ trên stack, rò ra địa chỉ làm vô hiệu ASLR. Nhìn sự khác biệt:</p>
${run('c132-overflow', './fmt good', 1)}
${run('c132-overflow', './fmt bad', 1)}
<p>Lời gọi "good" in văn bản nguyên văn; lời gọi "bad" diễn giải <code>%p.%p.%p</code> và rò ba giá trị stack thô. Bản sửa là một ký tự kỷ luật: luôn <code>printf("%s", user)</code> — người dùng là dữ liệu, không bao giờ là format. Trình biên dịch cảnh báo (<code>-Wformat-security</code>); đừng tắt nó đi.</p>
</div>

<h3>Dùng-sau-giải-phóng và giải-phóng-hai-lần, bắt bằng AddressSanitizer</h3>
<p>Thêm hai lỗi bộ nhớ, lần này trên heap của Chương 7. Dùng bộ nhớ sau <code>free</code>, hoặc giải phóng nó hai lần, là hành vi không định nghĩa có thể làm hỏng bộ cấp phát. Biên dịch với <code>-fsanitize=address</code> và AddressSanitizer dừng đúng dòng kèm cả ngăn xếp lúc free và lúc cấp phát:</p>
${src('ch13/uaf.c', 'c')}
${run('c132-overflow', './uaf 2', 1)}
${run('c132-overflow', './df 2', 1)}
<p>ASan gọi tên lỗi (<code>heap-use-after-free</code>, <code>double-free</code>), chỉ dòng (<code>uaf.c:10</code>, <code>df.c:6</code>), ai đã free khối và ai đã cấp phát nó. Hãy chạy test và CI dưới ASan và Valgrind; chúng biến những lỗi "chạy được trên máy tôi" mà sập ngẫu nhiên trên production thành một báo cáo chính xác trong vài giây. Điều này nối thẳng với bộ cấp phát ở Chương 7: use-after-free là đọc một khối mà bộ cấp phát có thể đã trao cho người khác rồi.</p>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trong một buổi review bạn tìm thấy một helper C làm <code>char path[64]; strcpy(path, request-&gt;name);</code> không kiểm độ dài, và bản dựng dùng <code>-fno-stack-protector</code>. Bạn cần cho cả nhóm thấy cụ thể vì sao cả code lẫn cờ dựng đều phải đổi.</p>
<ol>
<li>Trong lab, dựng <code>vuln.c</code> với <code>-fno-stack-protector -O0</code>. Đưa nó 15, 16, 17 và 24 byte. Ở độ dài nào <code>flag</code> lần đầu đổi, và vì sao đúng độ dài đó?</li>
<li>Dựng <code>retaddr.c</code> hai lần: có và không có canary. Đưa cả hai đúng 200 byte. Ghi lại thông điệp và mã thoát của từng bản.</li>
<li>Trên bản hardened, chạy ba phép kiểm <code>readelf</code> cho canary, NX và PIE. Viết một câu cho mỗi cờ: nó phòng chống cái gì.</li>
<li>Dựng <code>uaf.c</code> và <code>df.c</code> với <code>-fsanitize=address</code> rồi đọc báo cáo. Sau đó sửa kiểu <code>safe.c</code> và xác nhận nó từ chối input dài.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được độ dài input lần đầu chạm <code>flag</code>, cho thấy canary biến một cú tràn chiếm-quyền-được thành một <code>abort()</code> (exit 134), và chỉ được đúng một dòng trong helper gốc sửa được lỗi bất kể cờ biên dịch.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['buffer overflow (tràn bộ đệm)', 'Ghi quá đuôi một bộ đệm sang thứ nằm kế: một biến cục bộ, thanh ghi đã lưu, địa chỉ trả về.'],
  ['stack canary', 'Một giá trị ngẫu nhiên đặt trước địa chỉ trả về và kiểm trước khi trả về; đổi nó ⇒ abort (exit 134).'],
  ['NX / W^X', 'Không trang nào vừa ghi được vừa chạy được: stack là RW, nên byte chèn vào không chạy được.'],
  ['ASLR + PIE', 'Địa chỉ nạp ngẫu nhiên mỗi lần chạy (bài 7.1); PIE cho dời cả mã, nên địa chỉ không đoán được.'],
  ['RELRO', 'Làm GOT thành chỉ-đọc sau khởi động (BIND_NOW + GNU_RELRO) nên một cú tràn không chuyển hướng được lời gọi thư viện.'],
  ['FORTIFY_SOURCE', 'Trình biên dịch thay các lời gọi str/mem bằng bản có kiểm khi biết cỡ bộ đệm; abort khi tràn.'],
  ['format string bug (lỗi chuỗi định dạng)', 'Truyền văn bản người dùng làm format (printf(user)); %p/%n rò hoặc hỏng bộ nhớ. Sửa: printf("%s", user).'],
  ['use-after-free / double-free', 'Dùng hay giải phóng lại một khối heap đã free; hành vi không định nghĩa. AddressSanitizer bắt cả hai đúng dòng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một cú tràn ghi quá bộ đệm sang thứ kế: một biến cục bộ (flag thành 0x41414141), rồi <strong>địa chỉ trả về</strong> đã lưu (một cú sập — Bus error / exit 135 ở đây).</li>
<li>Sáu lớp phòng vệ, đọc từ ELF bằng <code>readelf</code>: <strong>canary</strong>, <strong>NX/W<sup>X</sup></strong>, <strong>ASLR/PIE</strong>, <strong>RELRO</strong>, <strong>FORTIFY_SOURCE</strong> — mỗi cái biến cùng cú tràn thành một abort có kiểm soát.</li>
<li>Lớp phòng vệ biến chiếm-quyền thành sập; bản sửa thật là chép có chặn + kiểm độ dài (<code>snprintf</code>/<code>fgets</code>), hoặc một ngôn ngữ an toàn bộ nhớ.</li>
<li>Đừng bao giờ truyền input người dùng làm <strong>chuỗi định dạng</strong>; luôn <code>printf("%s", user)</code>.</li>
<li><strong>Use-after-free</strong> và <strong>double-free</strong> được <strong>AddressSanitizer</strong> bắt chính xác — hãy chạy test và CI dưới nó.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/strcpy.3.html', '📄', 'man 3 strcpy', 'Vì sao strcpy/strcat không có chặn, và các lựa chọn có chặn thay thế.', 'Mở')}
${L('https://clang.llvm.org/docs/AddressSanitizer.html', '🧷', 'AddressSanitizer', 'Phát hiện use-after-free, double-free và tràn, ngay từ trình biên dịch.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 13.3 — Privilege escalation ───────────────────────── */
    {
      title: '13.3 — Privilege: SUID, capabilities, permissions, TOCTOU and /proc leaks|||13.3 — Đặc quyền: SUID, capabilities, quyền file, TOCTOU và rò qua /proc',
      slug: 'os-13-3-leo-thang',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một helper setuid-root tự viết gọi một tên lệnh qua PATH — và cách sửa đúng (bỏ đặc quyền + execle đường dẫn tuyệt đối); vì sao /bin/sh là dash lại tình cờ đỡ cho system(); một capability thay cho toàn quyền root (bind cổng 80); quyền file sai, danh sách SUID; race TOCTOU access()-rồi-open() và bản sửa O_NOFOLLOW; và bí mật rò qua /proc/<pid>/environ và cmdline — nối với cách xử lý .env của chính dự án.',
      content: `${G133}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>How a small misconfiguration becomes root</h2>
<p class="lead">Memory bugs are one road to privilege; the other is a program that already holds more privilege than it needs and hands some of it over by accident. This lesson walks five classic patterns on toy programs you build in your throwaway lab: a setuid-root helper that trusts <code>$PATH</code>, a single capability used instead of full root, a world-writable config file, a check-then-use (TOCTOU) race, and secrets leaking through <code>/proc</code>. Each one ends with the fix — the point is to recognise and close these, and to design services that have little to lose if compromised.</p>

<h3>SUID: a helper that trusts $PATH</h3>
<p>The <strong>set-user-ID</strong> bit makes a program run with the file owner's identity, not the caller's — this is how <code>passwd</code>, owned by root, can update <code>/etc/shadow</code> when you run it. Our toy is owned by root with the SUID bit set, so the unprivileged user <code>dev</code> runs it as root:</p>
${run('c133-dacquyen', 'ls -l /srv/lab/greetsuid', 1)}
${run('c133-dacquyen', 'runuser -u dev -- /srv/lab/greetsuid', 1)}
<p>The <code>s</code> in <code>-rwsr-xr-x</code> is the SUID bit; <code>euid=0</code> confirms <code>dev</code> is running as root. The bug: the helper calls <code>hostname</code> <em>by name</em>, trusting whatever <code>$PATH</code> the caller set. An attacker puts a fake <code>hostname</code> first in <code>$PATH</code>:</p>
${run('c133-dacquyen', 'runuser -u dev -- env PATH=/srv/evil /srv/lab/greetsuid', 1)}
<p>Here comes a measured subtlety worth keeping. The helper uses <code>system()</code>, which runs <code>/bin/sh</code>. On Ubuntu <code>/bin/sh</code> is <strong>dash</strong>, and dash <em>drops the extra privilege</em> when it sees <code>euid != uid</code> — so the planted binary ran as 1001, not root. That is a safety net you must never rely on; it is a property of one shell. Exec a bare command name directly and there is no shell to drop anything:</p>
${run('c133-dacquyen', 'runuser -u dev -- env PATH=/srv/evil /srv/lab/greetexec', 1)}
<p>Now the planted binary runs with <strong>euid 0</strong> — root. The fix is the same for both: drop the privilege yourself, then exec an absolute path with a clean environment — no shell, no <code>$PATH</code> search:</p>
${run('c133-dacquyen', 'runuser -u dev -- env PATH=/srv/evil /srv/lab/greetfix', 1)}
<p><code>euid=1001</code> and the real <code>/bin/hostname</code> runs. And remember lesson 13.2: a buffer overflow in a program that runs as root is not a crashed request — it is privilege escalation. A SUID program must be tiny, audited, and memory-safe.</p>
${lab('perm', 'setuid', 'en', 'What the setuid bit does to the permission check: dev runs a root-owned setuid helper, the kernel sets the effective uid to 0, and a file dev could never read (.env, mode 600) opens. Watch the real and effective uid split.', { tour: 'perm-acl' })}
${lab('memory', 'overflow', 'en', 'Recall what an overflow reaches. In a setuid-root program, reaching the return address is not a crashed request — it is root. This is why SUID binaries must be tiny and bounded.')}

<h3>Capabilities: one power instead of all of them</h3>
<p>Most programs are SUID-root only to do one privileged thing. Linux <strong>capabilities</strong> split root's power into pieces you can grant individually. Our toy binds port 80 (a privileged port). As <code>dev</code> it fails; grant it exactly <code>CAP_NET_BIND_SERVICE</code> and it works with no root at all:</p>
${run('c133-dacquyen', 'runuser -u dev -- /srv/lab/bind80', 1)}
${run('c133-dacquyen', 'setcap cap_net_bind_service=+ep', 1)}
${run('c133-dacquyen', 'runuser -u dev -- /srv/lab/bind80   # now', 1)}
<p>One capability on the file, not a setuid-root binary that can do everything. The capabilities a running process actually holds are in <code>/proc/&lt;pid&gt;/status</code>; <code>capsh</code> decodes the bitmask:</p>
${run('c133-dacquyen', "grep -E '^Cap(Prm|Eff):'", 1)}
<p>This is exactly how to run a service that needs port 80 without running it as root — and it is what Chapter 12 shows Docker doing when it drops all but a handful of capabilities.</p>
${lab('perm', 'caps', 'en', 'Root’s power, one capability at a time: CAP_DAC_OVERRIDE lets root read a mode-000 file; drop it (--cap-drop dac_override) and root is refused like anyone else. The same split lets bind80 hold CAP_NET_BIND_SERVICE and nothing more.', { tour: 'perm-acl' })}

<h3>Misconfigured permissions</h3>
<p>A config file with the wrong mode is a quiet door. World-writable means anyone on the box can rewrite it:</p>
${run('c133-dacquyen', 'chmod 666', 1)}
${run('c133-dacquyen', 'find /srv/app', 1)}
<p><code>find -perm -0002</code> lists everything world-writable — a standard audit step. And <code>find -perm -4000</code> lists the setuid-root binaries present, each a piece of attack surface to review:</p>
${run('c133-dacquyen', 'find /usr/bin -perm -4000', 1)}
<p>The rule is least privilege on the filesystem too: config files mode <code>640</code> or <code>600</code> owned by the service user, secrets never world-readable, and no SUID binary you cannot justify.</p>
${lab('perm', 'owner', 'en', 'Run the permission check yourself before trusting a mode: owner, then group, then other — the first match wins. A mode like 077 locks the owner out while everyone else reads.', { tour: 'perm-check' })}

<h3>TOCTOU: the gap between check and use</h3>
<p>A <strong>time-of-check to time-of-use</strong> race happens when a program verifies something about a path, then acts on the path again — and the path changed in between. Our toy checks with <code>access()</code>, then opens with <code>open()</code>:</p>
${src('ch13/toctou.c', 'c')}
${run('c133-dacquyen', '/tmp/toctou vuln link', 1)}
${run('c133-dacquyen', 'ln -sf secret.txt link', 1)}
<p>The symlink pointed at a public file when it was checked; an attacker repoints it at a secret before the <code>open()</code>, and the vulnerable path follows it. The fix never re-resolves the path by name: open once with <code>O_NOFOLLOW</code> (refuse a symlink at the final component), or open a directory and use <code>openat</code> with a file descriptor:</p>
${run('c133-dacquyen', '/tmp/toctou fixed', 1)}
<p><code>O_NOFOLLOW</code> refuses the symlink outright (<code>ELOOP</code>, exit 1). The general lesson: check and use must act on the <em>same</em> object — hold a file descriptor and <code>fstat</code>/<code>openat</code> through it, don't check a name and then trust the name again.</p>
${lab('fdtable', 'links', 'en', 'Why “hold the fd” works: a name is resolved to an inode only at the moment you look it up, and a symlink is just stored text that can be repointed. An open fd keeps pointing at the same open file description and inode, whatever happens to the names.', { tour: 'fdtable-deleted' })}

<h3>Secrets leaking through /proc</h3>
<p>A process's environment and command line are visible through <code>/proc</code>. Environment variables are owner-only (mode 0400) — but any process running as the <em>same user</em> can read them, which is exactly a compromised sidecar or a second service sharing the account:</p>
${run('c133-dacquyen', 'ls -l /proc/$SP/environ', 1)}
<p>There is the <code>DB_PASSWORD</code>. A secret passed as a command-line <em>argument</em> is far worse, because <code>/proc/&lt;pid&gt;/cmdline</code> and <code>ps</code> are world-readable — every user on the box sees it:</p>
${run('c133-dacquyen', 'tr', 1)}
${run('c133-dacquyen', 'runuser -u dev -- ps -eo', 1)}
<p>The token is in plain view to the unprivileged <code>dev</code>. This is why CuongThai keeps production secrets in <code>/opt/cuonghoangdev/.env</code> as a mode-restricted <em>file</em> that the service reads, loaded as environment — never passed on the command line — and why running each service under its own user matters: environment is readable by the same uid. Pass secrets through files or a secrets manager, restrict their mode, and never put a token in <code>argv</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>A misconfigured <code>sudo</code> rule is instant root — conceptually.</strong> If a user may run an editor, an interpreter or a pager via <code>sudo</code> (even <code>NOPASSWD</code> on <code>vi</code>, <code>less</code>, <code>python</code> or <code>find</code>), they can usually spawn a root shell from inside it, because those programs can run arbitrary commands. The defence is to grant <code>sudo</code> only for specific, argument-locked commands that cannot shell out, to prefer a dedicated service account with capabilities over blanket <code>sudo</code>, and to review <code>sudoers</code> the way you review code. (We describe this; we do not demonstrate an escape.)</p>
</div>

<h3>🧪 Practice (35 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you are hardening a small internal tool that currently ships a setuid-root helper and reads its database password from a command-line flag. You need to produce concrete before/after evidence for the ticket.</p>
<ol>
<li>In the lab, build <code>greetsuid</code> and <code>greetexec</code> SUID-root on the container's own fs. Run each under <code>env PATH=/srv/evil</code> with a planted <code>hostname</code>. Record the euid the planted binary reached in each case and explain the difference.</li>
<li>Build <code>bind80</code>, show it fails for <code>dev</code>, grant <code>cap_net_bind_service</code>, show it succeeds. Confirm with <code>getcap</code>.</li>
<li>Reproduce the TOCTOU demo: open via the symlink, repoint it, open again; then run the <code>O_NOFOLLOW</code> version. Record the error it returns.</li>
<li>Start a process with a secret in an env var and another with a secret in <code>argv</code>. Read both back from <code>/proc</code>. Which one could another user read, and why?</li>
</ol>
<p><strong>Done when:</strong> you can explain why the <code>execlp</code> case reached root while the <code>system()</code> case did not, show the one capability replacing SUID-root, and state the rule for where database passwords must live (file, restricted mode, never <code>argv</code>).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['SUID (set-user-ID)', 'A file bit that makes a program run as its owner (often root), regardless of who starts it.'],
  ['capability', 'One slice of the power of root (e.g. CAP_NET_BIND_SERVICE) granted on a file or process instead of full root.'],
  ['least privilege', 'Give each program and user only the power it needs; a compromise then has little to take.'],
  ['TOCTOU', 'Time-of-check to time-of-use: a path is validated, then re-resolved and used after it changed.'],
  ['O_NOFOLLOW / openat', 'Open that refuses a symlink / opens relative to a directory fd — so check and use hit the same object.'],
  ['/proc/<pid>/environ', 'The environment of a process; mode 0400, readable by the same user — so secrets in env are not private to the process.'],
  ['/proc/<pid>/cmdline', 'The command line of a process; world-readable (also ps), so a secret in argv is visible to everyone.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A <strong>SUID-root</strong> helper that trusts <code>$PATH</code> can run a planted binary as root (via <code>execlp</code>); fix by dropping privilege and <code>execle</code> an absolute path with a clean env.</li>
<li>Prefer one <strong>capability</strong> (here <code>CAP_NET_BIND_SERVICE</code> to bind :80) over a full setuid-root binary — least privilege.</li>
<li>Audit permissions (<code>find -perm -0002</code>, <code>-perm -4000</code>); keep configs <code>600</code>/<code>640</code> and secrets not world-readable.</li>
<li><strong>TOCTOU</strong>: check and use must act on the same object — <code>O_NOFOLLOW</code>/<code>openat</code>/fd-based, never re-resolve a name.</li>
<li>Secrets leak through <code>/proc</code>: <code>environ</code> to the same user, <code>cmdline</code> to everyone — keep secrets in a restricted file, never in <code>argv</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/capabilities.7.html', '📄', 'man 7 capabilities', 'Every capability and what it grants; the alternative to blanket root.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/open.2.html', '📄', 'man 2 open', 'O_NOFOLLOW, O_CREAT|O_EXCL, openat — the flags that close path races.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Một cấu hình sai nhỏ trở thành root ra sao</h2>
<p class="lead">Lỗi bộ nhớ là một con đường tới đặc quyền; con đường kia là một chương trình vốn đã giữ nhiều quyền hơn mức cần và trao bớt đi một cách tình cờ. Bài này đi qua năm khuôn mẫu kinh điển trên các chương trình đồ chơi bạn dựng trong lab vứt đi: một helper setuid-root tin vào <code>$PATH</code>, một capability dùng thay cho toàn quyền root, một tệp cấu hình ai-cũng-ghi-được, một race kiểm-rồi-dùng (TOCTOU), và bí mật rò qua <code>/proc</code>. Mỗi cái kết bằng bản sửa — mục tiêu là nhận diện và đóng chúng lại, và thiết kế dịch vụ sao cho mất ít nhất nếu bị chiếm.</p>

<h3>SUID: một helper tin vào $PATH</h3>
<p>Bit <strong>set-user-ID</strong> khiến một chương trình chạy với danh tính của chủ tệp, không phải của người gọi — đó là cách <code>passwd</code>, do root sở hữu, cập nhật được <code>/etc/shadow</code> khi bạn chạy nó. Đồ chơi của ta do root sở hữu với bit SUID bật, nên người dùng không đặc quyền <code>dev</code> chạy nó với quyền root:</p>
${run('c133-dacquyen', 'ls -l /srv/lab/greetsuid', 1)}
${run('c133-dacquyen', 'runuser -u dev -- /srv/lab/greetsuid', 1)}
<p>Chữ <code>s</code> trong <code>-rwsr-xr-x</code> là bit SUID; <code>euid=0</code> xác nhận <code>dev</code> đang chạy với quyền root. Lỗi: helper gọi <code>hostname</code> <em>theo tên</em>, tin vào bất cứ <code>$PATH</code> nào người gọi đặt. Kẻ tấn công đặt một <code>hostname</code> giả đứng đầu <code>$PATH</code>:</p>
${run('c133-dacquyen', 'runuser -u dev -- env PATH=/srv/evil /srv/lab/greetsuid', 1)}
<p>Đến một điểm tinh tế đã đo được, đáng giữ. Helper dùng <code>system()</code>, thứ chạy <code>/bin/sh</code>. Trên Ubuntu <code>/bin/sh</code> là <strong>dash</strong>, và dash <em>bỏ đặc quyền thừa</em> khi thấy <code>euid != uid</code> — nên tệp cài vào chạy với uid 1001, không phải root. Đó là một lưới đỡ bạn không bao giờ được dựa vào; nó là tính chất của riêng một shell. Exec thẳng một tên lệnh trần thì không có shell nào để bỏ gì cả:</p>
${run('c133-dacquyen', 'runuser -u dev -- env PATH=/srv/evil /srv/lab/greetexec', 1)}
<p>Giờ tệp cài vào chạy với <strong>euid 0</strong> — root. Bản sửa cho cả hai là một: tự bỏ đặc quyền đi, rồi exec một đường dẫn tuyệt đối với môi trường sạch — không shell, không tìm <code>$PATH</code>:</p>
${run('c133-dacquyen', 'runuser -u dev -- env PATH=/srv/evil /srv/lab/greetfix', 1)}
<p><code>euid=1001</code> và đúng <code>/bin/hostname</code> chạy. Và nhớ bài 13.2: một cú tràn bộ đệm trong một chương trình chạy với quyền root không phải là một yêu cầu bị sập — nó là leo thang đặc quyền. Một chương trình SUID phải bé xíu, được soát kỹ, và an toàn bộ nhớ.</p>
${lab('perm', 'setuid', 'vi', 'Bit setuid làm gì với phép kiểm quyền: dev chạy một helper setuid của root, nhân đặt uid hiệu lực = 0, và một file dev không bao giờ đọc được (.env, mode 600) mở ra. Nhìn uid thật và uid hiệu lực tách nhau.', { tour: 'perm-acl' })}
${lab('memory', 'overflow', 'vi', 'Nhớ lại cú tràn chạm tới đâu. Trong một chương trình setuid-root, chạm tới địa chỉ trả về không phải là một yêu cầu bị sập — mà là root. Đó là lý do tệp SUID phải bé xíu và có chặn.')}

<h3>Capabilities: một quyền thay cho tất cả</h3>
<p>Phần lớn chương trình chỉ cần SUID-root để làm MỘT việc đặc quyền. <strong>Capabilities</strong> của Linux chia quyền của root thành từng mảnh bạn cấp riêng được. Đồ chơi của ta bind cổng 80 (một cổng đặc quyền). Với tư cách <code>dev</code> nó hỏng; cấp đúng <code>CAP_NET_BIND_SERVICE</code> và nó chạy mà không cần root chút nào:</p>
${run('c133-dacquyen', 'runuser -u dev -- /srv/lab/bind80', 1)}
${run('c133-dacquyen', 'setcap cap_net_bind_service=+ep', 1)}
${run('c133-dacquyen', 'runuser -u dev -- /srv/lab/bind80   # now', 1)}
<p>Một capability trên tệp, không phải một tệp setuid-root làm được mọi thứ. Các capability một tiến trình đang giữ nằm ở <code>/proc/&lt;pid&gt;/status</code>; <code>capsh</code> giải mã bitmask:</p>
${run('c133-dacquyen', "grep -E '^Cap(Prm|Eff):'", 1)}
<p>Đây chính là cách chạy một dịch vụ cần cổng 80 mà không chạy nó với quyền root — và là điều Chương 12 cho thấy Docker làm khi nó bỏ hết chỉ chừa một nhúm capability.</p>
${lab('perm', 'caps', 'vi', 'Quyền của root, từng capability một: CAP_DAC_OVERRIDE cho root đọc file mode 000; bỏ nó (--cap-drop dac_override) thì root bị từ chối như mọi người. Cũng cách chia đó cho bind80 giữ đúng CAP_NET_BIND_SERVICE và không gì thêm.', { tour: 'perm-acl' })}

<h3>Quyền bị cấu hình sai</h3>
<p>Một tệp cấu hình sai mode là một cánh cửa âm thầm. Ai-cũng-ghi-được nghĩa là bất kỳ ai trên máy đều viết lại được nó:</p>
${run('c133-dacquyen', 'chmod 666', 1)}
${run('c133-dacquyen', 'find /srv/app', 1)}
<p><code>find -perm -0002</code> liệt kê mọi thứ ai-cũng-ghi-được — một bước rà soát chuẩn. Và <code>find -perm -4000</code> liệt kê các tệp setuid-root đang có, mỗi cái là một mảnh bề mặt tấn công cần soát:</p>
${run('c133-dacquyen', 'find /usr/bin -perm -4000', 1)}
<p>Luật vẫn là quyền tối thiểu, cả trên hệ thống file: tệp cấu hình mode <code>640</code> hoặc <code>600</code> do người dùng dịch vụ sở hữu, bí mật không bao giờ ai-cũng-đọc-được, và không có tệp SUID nào bạn không giải thích được.</p>
${lab('perm', 'owner', 'vi', 'Tự chạy phép kiểm quyền trước khi tin một mode: chủ, rồi nhóm, rồi other — khớp đầu tiên là chốt. Một mode như 077 khoá chính chủ ngoài cửa trong khi ai khác cũng đọc được.', { tour: 'perm-check' })}

<h3>TOCTOU: khoảng hở giữa kiểm và dùng</h3>
<p>Một race <strong>time-of-check to time-of-use</strong> xảy ra khi một chương trình xác minh điều gì đó về một đường dẫn, rồi tác động lên đường dẫn đó lần nữa — và đường dẫn đã đổi ở giữa. Đồ chơi của ta kiểm bằng <code>access()</code>, rồi mở bằng <code>open()</code>:</p>
${src('ch13/toctou.c', 'c')}
${run('c133-dacquyen', '/tmp/toctou vuln link', 1)}
${run('c133-dacquyen', 'ln -sf secret.txt link', 1)}
<p>Symlink trỏ tới một tệp công khai lúc được kiểm; kẻ tấn công trỏ lại nó sang một tệp bí mật trước khi <code>open()</code>, và đường dễ bị khai thác theo nó. Bản sửa không bao giờ phân giải lại đường dẫn theo tên: mở một lần với <code>O_NOFOLLOW</code> (từ chối symlink ở thành phần cuối), hoặc mở một thư mục rồi dùng <code>openat</code> với một file descriptor:</p>
${run('c133-dacquyen', '/tmp/toctou fixed', 1)}
<p><code>O_NOFOLLOW</code> từ chối symlink thẳng (<code>ELOOP</code>, exit 1). Bài học chung: kiểm và dùng phải tác động lên <em>cùng</em> một đối tượng — giữ một file descriptor và <code>fstat</code>/<code>openat</code> qua nó, đừng kiểm một cái tên rồi lại tin cái tên đó lần nữa.</p>
${lab('fdtable', 'links', 'vi', 'Vì sao “giữ fd” hiệu quả: một cái tên chỉ được giải ra inode đúng lúc bạn tra nó, còn symlink chỉ là chữ lưu sẵn, có thể trỏ sang chỗ khác. Một fd đang mở luôn trỏ vào cùng mô tả file mở và inode, bất kể các cái tên bị đổi thế nào.', { tour: 'fdtable-deleted' })}

<h3>Bí mật rò qua /proc</h3>
<p>Môi trường và dòng lệnh của một tiến trình nhìn thấy được qua <code>/proc</code>. Biến môi trường chỉ chủ-đọc-được (mode 0400) — nhưng bất kỳ tiến trình nào chạy dưới <em>cùng người dùng</em> đều đọc được, mà đó chính là một sidecar bị chiếm hay một dịch vụ thứ hai dùng chung tài khoản:</p>
${run('c133-dacquyen', 'ls -l /proc/$SP/environ', 1)}
<p>Kia rồi <code>DB_PASSWORD</code>. Một bí mật truyền làm <em>tham số</em> dòng lệnh còn tệ hơn nhiều, vì <code>/proc/&lt;pid&gt;/cmdline</code> và <code>ps</code> ai-cũng-đọc-được — mọi người dùng trên máy đều thấy:</p>
${run('c133-dacquyen', 'tr', 1)}
${run('c133-dacquyen', 'runuser -u dev -- ps -eo', 1)}
<p>Token hiện rõ cho <code>dev</code> không đặc quyền. Đây là lý do CuongThai giữ bí mật production trong <code>/opt/cuonghoangdev/.env</code> dưới dạng một <em>tệp</em> bị hạn chế mode mà dịch vụ đọc, nạp thành biến môi trường — không bao giờ truyền trên dòng lệnh — và là lý do chạy mỗi dịch vụ dưới người dùng riêng lại quan trọng: môi trường đọc được bởi cùng uid. Hãy truyền bí mật qua tệp hoặc một trình quản lý bí mật, hạn chế mode của chúng, và không bao giờ đặt một token vào <code>argv</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một luật <code>sudo</code> cấu hình sai là root tức thì — ở mức khái niệm.</strong> Nếu một người dùng được chạy một trình soạn thảo, một trình thông dịch hay một pager qua <code>sudo</code> (kể cả <code>NOPASSWD</code> trên <code>vi</code>, <code>less</code>, <code>python</code> hay <code>find</code>), họ thường mở được một shell root từ bên trong nó, vì các chương trình đó chạy được lệnh tuỳ ý. Phòng vệ là chỉ cấp <code>sudo</code> cho những lệnh cụ thể, khoá tham số, không thể shell ra ngoài; ưu tiên một tài khoản dịch vụ riêng kèm capabilities hơn là <code>sudo</code> rộng; và soát <code>sudoers</code> như soát code. (Ta mô tả điều này; ta không trình diễn một cú thoát.)</p>
</div>

<h3>🧪 Thực hành (35 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn đang cứng hoá một công cụ nội bộ nhỏ hiện đang kèm một helper setuid-root và đọc mật khẩu CSDL từ một cờ dòng lệnh. Bạn cần tạo bằng chứng trước/sau cụ thể cho ticket.</p>
<ol>
<li>Trong lab, dựng <code>greetsuid</code> và <code>greetexec</code> SUID-root trên fs riêng của container. Chạy mỗi cái dưới <code>env PATH=/srv/evil</code> với một <code>hostname</code> cài vào. Ghi lại euid mà tệp cài vào đạt tới ở mỗi trường hợp và giải thích khác biệt.</li>
<li>Dựng <code>bind80</code>, cho thấy nó hỏng với <code>dev</code>, cấp <code>cap_net_bind_service</code>, cho thấy nó chạy. Xác nhận bằng <code>getcap</code>.</li>
<li>Tái hiện demo TOCTOU: mở qua symlink, trỏ lại nó, mở lần nữa; rồi chạy bản <code>O_NOFOLLOW</code>. Ghi lại lỗi nó trả về.</li>
<li>Khởi động một tiến trình với bí mật trong biến môi trường và một tiến trình khác với bí mật trong <code>argv</code>. Đọc lại cả hai từ <code>/proc</code>. Cái nào một người dùng khác đọc được, và vì sao?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao trường hợp <code>execlp</code> chạm tới root còn trường hợp <code>system()</code> thì không, cho thấy một capability thay cho SUID-root, và nói được luật về nơi mật khẩu CSDL phải nằm (tệp, mode hạn chế, không bao giờ trong <code>argv</code>).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['SUID (set-user-ID)', 'Một bit tệp khiến một chương trình chạy với danh tính chủ tệp (thường là root), bất kể ai khởi động.'],
  ['capability', 'Một mảnh quyền của root (vd CAP_NET_BIND_SERVICE) cấp trên một tệp hoặc tiến trình thay cho toàn quyền root.'],
  ['least privilege (quyền tối thiểu)', 'Cho mỗi chương trình và người dùng đúng quyền cần; bị chiếm thì mất ít.'],
  ['TOCTOU', 'Time-of-check to time-of-use: một đường dẫn được kiểm, rồi được phân giải và dùng lại sau khi đã đổi.'],
  ['O_NOFOLLOW / openat', 'Mở mà từ chối symlink / mở tương đối một fd thư mục — để kiểm và dùng trúng cùng một đối tượng.'],
  ['/proc/<pid>/environ', 'Môi trường của một tiến trình; mode 0400, cùng người dùng đọc được — nên bí mật trong env không riêng tư với tiến trình.'],
  ['/proc/<pid>/cmdline', 'Dòng lệnh của một tiến trình; ai-cũng-đọc-được (và ps), nên một bí mật trong argv hiện ra cho mọi người.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một helper <strong>SUID-root</strong> tin vào <code>$PATH</code> có thể chạy một tệp cài vào với quyền root (qua <code>execlp</code>); sửa bằng cách bỏ đặc quyền và <code>execle</code> một đường dẫn tuyệt đối với env sạch.</li>
<li>Ưu tiên một <strong>capability</strong> (ở đây <code>CAP_NET_BIND_SERVICE</code> để bind :80) hơn một tệp setuid-root đầy đủ — quyền tối thiểu.</li>
<li>Rà quyền (<code>find -perm -0002</code>, <code>-perm -4000</code>); giữ cấu hình <code>600</code>/<code>640</code> và bí mật không ai-cũng-đọc-được.</li>
<li><strong>TOCTOU</strong>: kiểm và dùng phải tác động cùng một đối tượng — <code>O_NOFOLLOW</code>/<code>openat</code>/dựa-trên-fd, không bao giờ phân giải lại một cái tên.</li>
<li>Bí mật rò qua <code>/proc</code>: <code>environ</code> cho cùng người dùng, <code>cmdline</code> cho mọi người — giữ bí mật trong một tệp hạn chế, không bao giờ trong <code>argv</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/capabilities.7.html', '📄', 'man 7 capabilities', 'Mọi capability và nó cấp gì; lựa chọn thay cho root toàn phần.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/open.2.html', '📄', 'man 2 open', 'O_NOFOLLOW, O_CREAT|O_EXCL, openat — các cờ đóng lại các race đường dẫn.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 13.4 — Containers & hardening ───────────────────────── */
    {
      title: '13.4 — Containers from a security view, and a hardening checklist|||13.4 — Container nhìn từ bảo mật, và danh sách kiểm tra cứng hoá',
      slug: 'os-13-4-container-escape',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một container là một tiến trình bị nhân rào lại: mặc định nó mất phần lớn quyền của root (CapBnd bị cắt, seccomp bật, 15 device node). --privileged trả lại tất cả (41 capability, seccomp tắt, thấy cả đĩa máy chủ) — vì sao nó và docker.sock nguy hiểm, chỉ khái niệm, không có công thức thoát. User namespace rootless (root trong = dev ngoài), NoNewPrivileges vô hiệu setuid, và một danh sách cứng hoá dịch vụ backend (least privilege, systemd ProtectSystem/NoNewPrivileges, rootfs chỉ-đọc) nối với việc siết SSH của chính dự án.',
      content: `${G134}
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>A container is a fenced process — keep the fence high</h2>
<p class="lead">Chapter 12 showed that a container is not a virtual machine: it is an ordinary process that the kernel fences in with namespaces and cgroups. This closing lesson looks at that fence from a security angle — what the kernel takes away from a default container, what <code>--privileged</code> gives back and why that is dangerous, how rootless containers keep "root" harmless, and the switches that harden a real service. Everything here is read-only observation inside your own throwaway containers; no escape is demonstrated.</p>

<h3>What a default container does NOT have</h3>
<p>Run a normal container and read the privilege it holds from <code>/proc/self/status</code>:</p>
${run('c134-container', "grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):'", 1)}
<p>Three things stand out. <code>CapBnd</code> is <strong>not</strong> all-ones: the bounding set caps what any process here can ever hold, and dangerous capabilities like <code>CAP_SYS_ADMIN</code> are already absent. <code>Seccomp: 2</code> means a <strong>seccomp</strong> filter is loaded — Docker's default profile blocks ~44 dangerous syscalls. Count the capabilities left versus a full set:</p>
${run('c134-container', 'capsh --decode=$(grep CapBnd', 1)}
${run('c134-container', 'capsh --decode=0x000001ffffffffff', 1)}
<p>14 capabilities, not 41. And only a handful of device nodes are exposed — not the host's disks:</p>
${run('c134-container', 'ls /dev | wc -l', 1)}
<p>Fifteen entries: the terminal, null, zero, random — nothing that reaches the host. The kernel built this fence before your process started. That is the baseline a container gives you for free.</p>
${lab('nslayers', 'docker', 'en', 'The namespaces of a default container, one by one: pid, mnt, net, uts, ipc, cgroup and time are new — user is the host’s, so uid 0 inside is uid 0 of the kernel, held back only by capabilities and seccomp.', { tour: 'nslayers-views' })}

<h3>Why --privileged is dangerous</h3>
<p>Now the same readout inside a <code>--privileged</code> container (only ever a throwaway one):</p>
${run('c134-priv', "grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):'", 1)}
${run('c134-priv', 'capsh --decode=$(grep CapBnd', 1)}
<p><code>CapBnd</code> is now all-ones — <strong>every</strong> capability, 41 of them, including <code>CAP_SYS_ADMIN</code> (the "new root"). <code>Seccomp: 0</code> — no syscall filter. And the host's block devices appear inside the container:</p>
${run('c134-priv', 'ls /dev | wc -l', 1)}
${run('c134-priv', 'ls /dev | grep -E', 1)}
<p>169 device nodes, including <code>vda</code> (the disk behind the whole machine), <code>mem</code> and <code>kmsg</code>. Full capabilities + host devices + no seccomp is why a <code>--privileged</code> container is effectively root on the host: a process inside can reach the host's disk directly. We only read the flags here — we do not demonstrate an escape. The lesson is the rule: never run application workloads with <code>--privileged</code>. The same reasoning condemns mounting <strong>docker.sock</strong> into a container: the Docker daemon runs as root, so being able to talk to its socket is being able to start a new container that mounts the host filesystem — root on the host, by design. In a normal container the socket is simply not there:</p>
${run('c134-container', 'ls -l /var/run/docker.sock', 1)}

<h3>Rootless: "root" that cannot hurt the host</h3>
<p>A <strong>user namespace</strong> lets an unprivileged user be root <em>inside</em> a new namespace while staying unprivileged outside. As <code>dev</code>:</p>
${run('c134-userns', 'runuser -u dev -- unshare', 1)}
<p>Inside, <code>id -u</code> is 0 — root. But <code>uid_map</code> reads <code>0 1001 1</code>: UID 0 inside maps to UID 1001 (the unprivileged <code>dev</code>) outside. Its power stops at the namespace edge — it is root over its own files and nothing of the host's. This is how <strong>rootless</strong> Docker and Podman run: a compromise of "root in the container" is a compromise of one ordinary user account, not of the machine. Prefer rootless, user-namespace-remapped containers for anything you do not fully trust.</p>
${lab('nslayers', 'userns', 'en', 'Rootless “root”, seen from both sides: inside, dev is uid 0 with a full CapEff; the map 0 1001 1 says it is dev outside, and the host’s /etc still refuses it. Then remap 0 100000 65536, as rootless Docker does.', { tour: 'nslayers-views' })}

<h3>NoNewPrivileges: a one-way switch that neutralises setuid</h3>
<p><code>no_new_privs</code> is a per-process flag: once set, no <code>exec</code> can ever gain privilege, so a setuid binary simply does not elevate. Watch the setuid helper from lesson 13.3 work normally, then run it under the flag (this is what Docker's <code>--security-opt no-new-privileges</code> and systemd's <code>NoNewPrivileges=</code> set):</p>
${run('c134-container', 'echo "== setuid works normally', 1)}
${run('c134-container', 'runuser -u dev -- setpriv', 1)}
<p>Under <code>no-new-privs</code> the same SUID binary keeps <code>euid=1001</code> — the setuid bit is ignored. A service that never legitimately needs to raise privilege should run with this on; it closes off a whole class of escalation at once.</p>

<h3>seccomp and AppArmor, in one line each</h3>
<p>Two more kernel fences, at the concept level. <strong>seccomp</strong> (secure computing) filters which <em>syscalls</em> a process may make — you saw <code>Seccomp: 2</code> above, Docker's default profile that denies the dangerous ones; you can tighten it further per service. <strong>AppArmor</strong> (and SELinux on Red Hat systems) is a mandatory access control layer that confines a program to a declared set of files and operations regardless of Unix permissions — Docker ships a default AppArmor profile too. You rarely write these by hand; you keep the defaults on and only loosen them deliberately, the way the lab in Chapters 7–8 used <code>--security-opt seccomp=unconfined</code> for one measurement and never for a real workload.</p>
${lab('syscall', 'seccomp', 'en', 'seccomp at work: one filter, a few programs and actions — EPERM, ENOSYS, KILL (exit 159) — and the misleading errors a blocked call produces.', { tour: 'syscall-errno' })}

<h3>A hardening checklist for a backend service</h3>
<p>Pulling the chapter together into what you actually do for a service like the CuongThai backend:</p>
<ul>
<li><strong>Least privilege</strong>: run as a dedicated non-root user; grant a capability (e.g. <code>CAP_NET_BIND_SERVICE</code>) instead of root; drop every capability you do not use.</li>
<li><strong>Containers</strong>: never <code>--privileged</code>, never mount <code>docker.sock</code> into app containers; keep the default seccomp and AppArmor profiles; use a read-only root filesystem with a small writable volume for state; prefer rootless where you can.</li>
<li><strong>systemd hardening</strong>: for services run directly under systemd, a few directives give much of what a container does. A unit might carry:</li>
</ul>
${code(`[Service]
# Run as an unprivileged user, never root
User=app
Group=app
# No exec can gain privilege (neutralises any stray setuid) — lesson 13.3/13.4
NoNewPrivileges=yes
# Most of the filesystem is read-only; /usr and /etc cannot be written
ProtectSystem=strict
ProtectHome=yes
# A private, writable scratch area; nothing else is writable
ReadWritePaths=/var/lib/app
PrivateTmp=yes
# Drop every capability, then add back only what is needed
CapabilityBoundingSet=
AmbientCapabilities=CAP_NET_BIND_SERVICE
# Shrink the syscall surface, like seccomp in a container
SystemCallFilter=@system-service
SystemCallArchitectures=native`, 'ini')}
<p>Each line maps to a mechanism from this chapter: <code>NoNewPrivileges</code> is the switch you just measured, <code>CapabilityBoundingSet</code>/<code>AmbientCapabilities</code> are lesson 13.3's capabilities, <code>SystemCallFilter</code> is seccomp, <code>ProtectSystem=strict</code> is a read-only root like a hardened container. <code>systemd-analyze security &lt;unit&gt;</code> scores a unit against all of these.</p>

<div class="pitfall co-tieu-de">
<p><strong>Hardening the host matters as much as hardening the app — and the same ideas apply to SSH.</strong> This project's own SSH hardening (see CLAUDE.md) is least privilege at the login layer: <code>PasswordAuthentication no</code> and <code>KbdInteractiveAuthentication no</code> remove the guessable door, <code>PermitRootLogin prohibit-password</code> stops direct root password login — key-only access, the login equivalent of "drop every capability you do not need". And its lesson about drop-in ordering (a <code>01-</code> file must sort before <code>50-cloud-init.conf</code>, verified with <code>sshd -T</code>, not by reading the file) is the same discipline as reading mitigations off the binary with <code>readelf</code> instead of trusting the build flags: <em>verify the effective state, do not assume it.</em></p>
</div>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate proposes running a build agent with <code>--privileged</code> and the docker socket mounted "so it can build images". You need to show the risk concretely and propose a safer design.</p>
<ol>
<li>In the lab, run a default container and a <code>--privileged</code> one. For each, record <code>CapBnd</code>, <code>Seccomp</code> and the number of <code>/dev</code> entries. Which host devices appear only in the privileged one?</li>
<li>As <code>dev</code>, run <code>unshare -Ur</code> (seccomp unconfined) and read <code>/proc/self/uid_map</code>. Explain who "root" inside that namespace really is.</li>
<li>Run the setuid helper from 13.3 normally, then under <code>setpriv --no-new-privs</code>. Record both euids.</li>
<li>Write a minimal hardened systemd unit for a Node service that binds port 80: non-root user, one capability, <code>NoNewPrivileges</code>, read-only root with one writable path.</li>
</ol>
<p><strong>Done when:</strong> you can state the three concrete things <code>--privileged</code> hands over, show rootless mapping turning "root" into an ordinary user, and hand the teammate a unit file (or a rootless-builder suggestion) that builds images without privileged mode.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['capability bounding set', 'The ceiling on capabilities for a process tree (CapBnd); a default container already trims it to ~14.'],
  ['--privileged', 'Gives a container all 41 capabilities, no seccomp, and the host devices — effectively root on the host.'],
  ['docker.sock', 'The Docker daemon socket; mounting it into a container grants control of the daemon, i.e. root on the host.'],
  ['user namespace / rootless', 'Maps root inside to an unprivileged UID outside (uid_map 0 1001 1); "root in container" cannot touch the host.'],
  ['seccomp', 'A syscall filter; Docker loads a default profile (Seccomp: 2) that blocks dangerous syscalls.'],
  ['AppArmor / SELinux', 'Mandatory access control: confines a program to declared files/operations beyond Unix permissions.'],
  ['NoNewPrivileges', 'A one-way flag: after it, no exec can gain privilege, so setuid is neutralised.'],
  ['systemd hardening', 'Directives (ProtectSystem, NoNewPrivileges, CapabilityBoundingSet, SystemCallFilter) that sandbox a service.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A container is a fenced process: the kernel already drops most of root's power (CapBnd ~14, Seccomp 2, 15 device nodes).</li>
<li><strong>--privileged</strong> returns everything (41 caps, Seccomp 0, host disks in /dev) — never for app workloads; same for mounting <strong>docker.sock</strong>.</li>
<li><strong>Rootless</strong> user namespaces map root-inside to an unprivileged UID outside (<code>0 1001 1</code>): a container compromise is one user account, not the host.</li>
<li><strong>NoNewPrivileges</strong> neutralises setuid; keep <strong>seccomp</strong> and <strong>AppArmor</strong> defaults on.</li>
<li>Harden backend services with least privilege + a <strong>systemd</strong> unit (ProtectSystem, NoNewPrivileges, dropped capabilities, SystemCallFilter); verify the effective state, like reading flags with <code>readelf</code> or <code>sshd -T</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/user_namespaces.7.html', '📄', 'man 7 user_namespaces', 'How uid_map makes root inside an unprivileged user outside.', 'Open')}
${L('https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html', '🛡️', 'systemd.exec directives', 'ProtectSystem, NoNewPrivileges, CapabilityBoundingSet, SystemCallFilter and more.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Container là một tiến trình bị rào — hãy giữ hàng rào cao</h2>
<p class="lead">Chương 12 cho thấy container không phải máy ảo: nó là một tiến trình thường mà nhân rào lại bằng namespace và cgroup. Bài khép lại này nhìn hàng rào đó từ góc bảo mật — nhân tước gì khỏi một container mặc định, <code>--privileged</code> trả lại gì và vì sao nguy hiểm, container rootless giữ cho "root" vô hại ra sao, và những công tắc cứng hoá một dịch vụ thật. Mọi thứ ở đây là quan sát chỉ-đọc bên trong container vứt đi của chính bạn; không trình diễn cách thoát nào.</p>

<h3>Một container mặc định KHÔNG có gì</h3>
<p>Chạy một container thường và đọc quyền nó giữ từ <code>/proc/self/status</code>:</p>
${run('c134-container', "grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):'", 1)}
<p>Ba điều nổi bật. <code>CapBnd</code> <strong>không</strong> toàn số 1: tập giới hạn chặn mức capability tối đa mà bất kỳ tiến trình nào ở đây giữ được, và các capability nguy hiểm như <code>CAP_SYS_ADMIN</code> đã vắng mặt. <code>Seccomp: 2</code> nghĩa là một bộ lọc <strong>seccomp</strong> đã được nạp — hồ sơ mặc định của Docker chặn ~44 syscall nguy hiểm. Đếm số capability còn lại so với một tập đầy đủ:</p>
${run('c134-container', 'capsh --decode=$(grep CapBnd', 1)}
${run('c134-container', 'capsh --decode=0x000001ffffffffff', 1)}
<p>14 capability, không phải 41. Và chỉ một nhúm device node được lộ ra — không có đĩa của máy chủ:</p>
${run('c134-container', 'ls /dev | wc -l', 1)}
<p>Mười lăm mục: terminal, null, zero, random — không gì chạm tới máy chủ. Nhân đã dựng hàng rào này trước khi tiến trình của bạn khởi động. Đó là mức nền một container cho bạn miễn phí.</p>
${lab('nslayers', 'docker', 'vi', 'Các namespace của một container mặc định, từng cái một: pid, mnt, net, uts, ipc, cgroup và time là mới — user là của máy chủ, nên uid 0 bên trong là uid 0 của nhân, chỉ bị capability và seccomp kìm lại.', { tour: 'nslayers-views' })}

<h3>Vì sao --privileged nguy hiểm</h3>
<p>Giờ cùng số đọc đó bên trong một container <code>--privileged</code> (chỉ bao giờ là một container vứt đi):</p>
${run('c134-priv', "grep -E '^(CapBnd|CapEff|Seccomp|NoNewPrivs):'", 1)}
${run('c134-priv', 'capsh --decode=$(grep CapBnd', 1)}
<p><code>CapBnd</code> giờ toàn số 1 — <strong>mọi</strong> capability, 41 cái, kể cả <code>CAP_SYS_ADMIN</code> ("root mới"). <code>Seccomp: 0</code> — không bộ lọc syscall. Và các thiết bị khối của máy chủ hiện ra trong container:</p>
${run('c134-priv', 'ls /dev | wc -l', 1)}
${run('c134-priv', 'ls /dev | grep -E', 1)}
<p>169 device node, kể cả <code>vda</code> (đĩa đứng sau cả máy), <code>mem</code> và <code>kmsg</code>. Đủ capability + thiết bị máy chủ + không seccomp là lý do một container <code>--privileged</code> gần như là root trên máy chủ: một tiến trình bên trong chạm thẳng được tới đĩa máy chủ. Ở đây ta chỉ đọc các cờ — không trình diễn cách thoát. Bài học là cái luật: đừng bao giờ chạy tải ứng dụng với <code>--privileged</code>. Cùng lý lẽ đó lên án việc gắn <strong>docker.sock</strong> vào một container: daemon Docker chạy với quyền root, nên nói chuyện được với socket của nó là khởi động được một container mới gắn hệ thống file máy chủ — root trên máy chủ, theo thiết kế. Trong một container thường, socket đơn giản là không có ở đó:</p>
${run('c134-container', 'ls -l /var/run/docker.sock', 1)}

<h3>Rootless: "root" không hại được máy chủ</h3>
<p>Một <strong>user namespace</strong> cho một người dùng không đặc quyền làm root <em>bên trong</em> một namespace mới trong khi vẫn không đặc quyền bên ngoài. Với tư cách <code>dev</code>:</p>
${run('c134-userns', 'runuser -u dev -- unshare', 1)}
<p>Bên trong, <code>id -u</code> là 0 — root. Nhưng <code>uid_map</code> đọc <code>0 1001 1</code>: UID 0 bên trong ánh xạ tới UID 1001 (chính <code>dev</code> không đặc quyền) bên ngoài. Quyền của nó dừng ở biên namespace — nó là root trên các tệp của riêng nó chứ không phải của máy chủ. Đây là cách Docker và Podman <strong>rootless</strong> chạy: một cú chiếm "root trong container" là một cú chiếm một tài khoản người dùng thường, không phải của cả máy. Hãy ưu tiên container rootless, ánh xạ user namespace cho bất cứ thứ gì bạn chưa hoàn toàn tin.</p>
${lab('nslayers', 'userns', 'vi', '“root” rootless nhìn từ hai phía: bên trong dev là uid 0 với CapEff đầy đủ; ánh xạ 0 1001 1 cho biết bên ngoài nó là dev, và /etc của máy chủ vẫn từ chối nó. Rồi ánh xạ lại 0 100000 65536, như Docker rootless làm.', { tour: 'nslayers-views' })}

<h3>NoNewPrivileges: một công tắc một chiều vô hiệu setuid</h3>
<p><code>no_new_privs</code> là một cờ theo từng tiến trình: bật rồi thì không <code>exec</code> nào lấy thêm quyền được, nên một tệp setuid đơn giản là không leo quyền. Nhìn helper setuid của bài 13.3 chạy bình thường, rồi chạy nó dưới cờ đó (đây là thứ <code>--security-opt no-new-privileges</code> của Docker và <code>NoNewPrivileges=</code> của systemd đặt):</p>
${run('c134-container', 'echo "== setuid works normally', 1)}
${run('c134-container', 'runuser -u dev -- setpriv', 1)}
<p>Dưới <code>no-new-privs</code> cùng tệp SUID đó giữ <code>euid=1001</code> — bit setuid bị bỏ qua. Một dịch vụ không bao giờ cần nâng quyền một cách chính đáng nên chạy với cờ này bật; nó đóng cả một lớp leo thang trong một nhát.</p>

<h3>seccomp và AppArmor, mỗi cái một dòng</h3>
<p>Thêm hai hàng rào của nhân, ở mức khái niệm. <strong>seccomp</strong> (secure computing) lọc những <em>syscall</em> một tiến trình được gọi — bạn vừa thấy <code>Seccomp: 2</code>, hồ sơ mặc định của Docker từ chối những cái nguy hiểm; bạn siết thêm được theo từng dịch vụ. <strong>AppArmor</strong> (và SELinux trên hệ Red Hat) là một lớp kiểm soát truy cập bắt buộc, giam một chương trình vào một tập tệp và thao tác đã khai báo bất kể quyền Unix — Docker cũng kèm một hồ sơ AppArmor mặc định. Bạn hiếm khi viết chúng bằng tay; bạn giữ mặc định bật và chỉ nới ra một cách có chủ đích, đúng như lab ở Chương 7–8 dùng <code>--security-opt seccomp=unconfined</code> cho một phép đo và không bao giờ cho một tải thật.</p>
${lab('syscall', 'seccomp', 'vi', 'seccomp khi chạy thật: một bộ lọc, vài chương trình và hành động — EPERM, ENOSYS, KILL (exit 159) — và những lỗi gây hiểu nhầm mà một lời gọi bị chặn sinh ra.', { tour: 'syscall-errno' })}

<h3>Danh sách cứng hoá cho một dịch vụ backend</h3>
<p>Gom cả chương lại thành những việc bạn thật sự làm cho một dịch vụ như backend CuongThai:</p>
<ul>
<li><strong>Quyền tối thiểu</strong>: chạy dưới một người dùng không-root riêng; cấp một capability (vd <code>CAP_NET_BIND_SERVICE</code>) thay vì root; bỏ mọi capability bạn không dùng.</li>
<li><strong>Container</strong>: không bao giờ <code>--privileged</code>, không bao giờ gắn <code>docker.sock</code> vào container ứng dụng; giữ hồ sơ seccomp và AppArmor mặc định; dùng rootfs chỉ-đọc với một volume ghi-được nhỏ cho trạng thái; ưu tiên rootless chỗ nào được.</li>
<li><strong>Cứng hoá systemd</strong>: với dịch vụ chạy thẳng dưới systemd, vài directive cho bạn phần lớn những gì một container làm. Một unit có thể mang:</li>
</ul>
${code(`[Service]
# Chạy dưới một người dùng không đặc quyền, không bao giờ root
User=app
Group=app
# Không exec nào lấy thêm quyền được (vô hiệu mọi setuid lạc) — bài 13.3/13.4
NoNewPrivileges=yes
# Phần lớn hệ thống file là chỉ-đọc; /usr và /etc không ghi được
ProtectSystem=strict
ProtectHome=yes
# Một vùng nháp riêng, ghi được; ngoài ra không gì ghi được
ReadWritePaths=/var/lib/app
PrivateTmp=yes
# Bỏ mọi capability, rồi thêm lại đúng cái cần
CapabilityBoundingSet=
AmbientCapabilities=CAP_NET_BIND_SERVICE
# Thu nhỏ bề mặt syscall, như seccomp trong một container
SystemCallFilter=@system-service
SystemCallArchitectures=native`, 'ini')}
<p>Mỗi dòng ánh xạ tới một cơ chế trong chương này: <code>NoNewPrivileges</code> là công tắc bạn vừa đo, <code>CapabilityBoundingSet</code>/<code>AmbientCapabilities</code> là capabilities của bài 13.3, <code>SystemCallFilter</code> là seccomp, <code>ProtectSystem=strict</code> là một root chỉ-đọc như một container đã cứng hoá. <code>systemd-analyze security &lt;unit&gt;</code> chấm điểm một unit theo tất cả những cái này.</p>

<div class="pitfall co-tieu-de">
<p><strong>Cứng hoá máy chủ quan trọng ngang cứng hoá ứng dụng — và cùng những ý đó áp cho SSH.</strong> Việc siết SSH của chính dự án này (xem CLAUDE.md) là quyền tối thiểu ở tầng đăng nhập: <code>PasswordAuthentication no</code> và <code>KbdInteractiveAuthentication no</code> gỡ bỏ cánh cửa đoán được, <code>PermitRootLogin prohibit-password</code> chặn đăng nhập root bằng mật khẩu trực tiếp — chỉ vào bằng khoá, tương đương ở tầng đăng nhập của "bỏ mọi capability không cần". Và bài học về thứ tự drop-in của nó (một tệp <code>01-</code> phải sắp trước <code>50-cloud-init.conf</code>, nghiệm thu bằng <code>sshd -T</code>, không phải bằng cách đọc tệp) chính là cùng kỷ luật với việc đọc các lớp phòng vệ từ tệp nhị phân bằng <code>readelf</code> thay vì tin vào cờ dựng: <em>hãy nghiệm thu trạng thái đang hiệu lực, đừng giả định nó.</em></p>
</div>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một bạn trong nhóm đề xuất chạy một build agent với <code>--privileged</code> và gắn socket docker vào "để nó dựng được ảnh". Bạn cần cho thấy rủi ro một cách cụ thể và đề xuất thiết kế an toàn hơn.</p>
<ol>
<li>Trong lab, chạy một container mặc định và một container <code>--privileged</code>. Với mỗi cái, ghi lại <code>CapBnd</code>, <code>Seccomp</code> và số mục <code>/dev</code>. Thiết bị máy chủ nào chỉ xuất hiện ở bản privileged?</li>
<li>Với tư cách <code>dev</code>, chạy <code>unshare -Ur</code> (seccomp unconfined) và đọc <code>/proc/self/uid_map</code>. Giải thích "root" bên trong namespace đó thật ra là ai.</li>
<li>Chạy helper setuid của bài 13.3 bình thường, rồi dưới <code>setpriv --no-new-privs</code>. Ghi lại cả hai euid.</li>
<li>Viết một unit systemd cứng hoá tối giản cho một dịch vụ Node bind cổng 80: người dùng không-root, một capability, <code>NoNewPrivileges</code>, root chỉ-đọc với một đường ghi-được.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được ba thứ cụ thể mà <code>--privileged</code> trao đi, cho thấy ánh xạ rootless biến "root" thành một người dùng thường, và đưa cho bạn kia một tệp unit (hoặc gợi ý builder rootless) dựng được ảnh mà không cần chế độ privileged.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['capability bounding set', 'Trần capability cho một cây tiến trình (CapBnd); một container mặc định đã cắt còn ~14.'],
  ['--privileged', 'Cho container cả 41 capability, không seccomp, và các thiết bị máy chủ — gần như root trên máy chủ.'],
  ['docker.sock', 'Socket của daemon Docker; gắn nó vào container là trao quyền điều khiển daemon, tức root trên máy chủ.'],
  ['user namespace / rootless', 'Ánh xạ root bên trong sang một UID không đặc quyền bên ngoài (uid_map 0 1001 1); "root trong container" không chạm được máy chủ.'],
  ['seccomp', 'Một bộ lọc syscall; Docker nạp một hồ sơ mặc định (Seccomp: 2) chặn các syscall nguy hiểm.'],
  ['AppArmor / SELinux', 'Kiểm soát truy cập bắt buộc: giam một chương trình vào tệp/thao tác đã khai báo, vượt trên quyền Unix.'],
  ['NoNewPrivileges', 'Một cờ một chiều: bật rồi thì không exec nào lấy thêm quyền, nên setuid bị vô hiệu.'],
  ['systemd hardening', 'Các directive (ProtectSystem, NoNewPrivileges, CapabilityBoundingSet, SystemCallFilter) rào một dịch vụ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một container là một tiến trình bị rào: nhân đã bỏ sẵn phần lớn quyền của root (CapBnd ~14, Seccomp 2, 15 device node).</li>
<li><strong>--privileged</strong> trả lại tất cả (41 cap, Seccomp 0, đĩa máy chủ trong /dev) — không bao giờ cho tải ứng dụng; tương tự với gắn <strong>docker.sock</strong>.</li>
<li><strong>Rootless</strong> user namespace ánh xạ root-bên-trong sang một UID không đặc quyền bên ngoài (<code>0 1001 1</code>): chiếm được container là chiếm một tài khoản, không phải máy chủ.</li>
<li><strong>NoNewPrivileges</strong> vô hiệu setuid; giữ mặc định <strong>seccomp</strong> và <strong>AppArmor</strong> bật.</li>
<li>Cứng hoá dịch vụ backend bằng quyền tối thiểu + một unit <strong>systemd</strong> (ProtectSystem, NoNewPrivileges, bỏ capability, SystemCallFilter); nghiệm thu trạng thái đang hiệu lực, như đọc cờ bằng <code>readelf</code> hay <code>sshd -T</code>.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/user_namespaces.7.html', '📄', 'man 7 user_namespaces', 'Cách uid_map biến root bên trong thành một người dùng không đặc quyền bên ngoài.', 'Mở')}
${L('https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html', '🛡️', 'directive systemd.exec', 'ProtectSystem, NoNewPrivileges, CapabilityBoundingSet, SystemCallFilter và nhiều nữa.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 13.5 — Quiz ───────────────────────── */
    {
      title: '13.5 — Chapter 13 check|||13.5 — Kiểm tra Chương 13',
      slug: 'os-13-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống phòng thủ: đọc tệp nhị phân và khung stack, overflow ghi đè cái gì, canary/NX/ASLR/RELRO/FORTIFY, chuỗi định dạng, AddressSanitizer, SUID và dash, capability, TOCTOU, rò bí mật qua /proc, và --privileged vs rootless.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Check</span>
<h2>Can you read a binary, reproduce a bug on a toy, and name the defence that stops it?</h2>
<p class="lead">Ten scenario questions, each built on something measured in this chapter — all strictly defensive, all on toy programs in a throwaway lab. Most hand you an output or an exit code and ask what it means and how you would fix or harden it.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can open an ELF with readelf/nm/objdump and read one function and its stack frame.</li>
<li>I can reproduce an overflow on a toy and say exactly what each byte overwrote.</li>
<li>I can read canary/NX/ASLR/RELRO off a binary and say what each defends against.</li>
<li>I can explain SUID, capabilities, TOCTOU and /proc secret leaks, and the fix for each.</li>
<li>I can say what --privileged hands over and why rootless keeps "root" harmless.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Bạn đọc được một tệp nhị phân, tái hiện một lỗi trên đồ chơi, và gọi tên lớp phòng vệ chặn nó không?</h2>
<p class="lead">Mười câu tình huống, câu nào cũng dựng trên một thứ đã đo trong chương này — tất cả thuần phòng thủ, tất cả trên chương trình đồ chơi trong lab vứt đi. Phần lớn đưa cho bạn một output hoặc một mã thoát rồi hỏi nó nghĩa là gì và bạn sẽ sửa hoặc cứng hoá ra sao.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi mở được một ELF bằng readelf/nm/objdump và đọc được một hàm cùng khung stack của nó.</li>
<li>Tôi tái hiện được một cú tràn trên đồ chơi và nói đúng mỗi byte đã ghi đè lên cái gì.</li>
<li>Tôi đọc được canary/NX/ASLR/RELRO từ một tệp nhị phân và nói mỗi cái phòng chống gì.</li>
<li>Tôi giải thích được SUID, capabilities, TOCTOU và rò bí mật qua /proc, cùng bản sửa cho mỗi cái.</li>
<li>Tôi nói được --privileged trao đi gì và vì sao rootless giữ "root" vô hại.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: '<code>file add</code> prints <code>ELF 64-bit … pie executable … ARM aarch64 … dynamically linked</code> and <code>readelf -h</code> shows <code>Type: DYN</code>. What does the DYN/PIE part tell you?|||<code>file add</code> in <code>ELF 64-bit … pie executable … ARM aarch64 … dynamically linked</code> và <code>readelf -h</code> hiện <code>Type: DYN</code>. Phần DYN/PIE cho bạn biết gì?',
            options: ['It is a position-independent executable, so ASLR can load its code at a random address each run|||Nó là một tệp thực thi độc lập vị trí, nên ASLR nạp mã của nó ở một địa chỉ ngẫu nhiên mỗi lần chạy', 'The binary is a shared library and cannot be run directly|||Tệp nhị phân là một thư viện dùng chung và không chạy trực tiếp được', 'It was compiled without optimisation|||Nó được biên dịch không tối ưu hoá', 'It contains debug symbols|||Nó chứa ký hiệu gỡ lỗi'],
            correctIndex: 0, points: 1,
            explanation: 'EN: DYN for an executable means PIE — the loader can place the code anywhere, which is what lets ASLR randomise it (lesson 7.1/13.1). A non-PIE binary shows ET_EXEC and a fixed code address, a gift to an attacker. Shared-library vs executable, optimisation and debug symbols are separate properties shown elsewhere (file "shared object", -O flags, "not stripped").|||VI: DYN cho một tệp thực thi nghĩa là PIE — trình nạp đặt mã ở bất cứ đâu, đó là thứ cho phép ASLR ngẫu nhiên hoá nó (bài 7.1/13.1). Một tệp không-PIE hiện ET_EXEC và địa chỉ mã cố định, một món quà cho kẻ tấn công. Thư viện-vs-thực thi, tối ưu hoá và ký hiệu gỡ lỗi là các tính chất riêng hiện ở chỗ khác.' },
          { question: 'In gdb, <code>bt</code> at a breakpoint in <code>total</code> shows frame #1 as <code>main … at add.c:16</code>, and <code>info frame</code> prints a "saved pc". Why does the next lesson care so much about that saved pc?|||Trong gdb, <code>bt</code> tại điểm dừng trong <code>total</code> hiện khung #1 là <code>main … at add.c:16</code>, và <code>info frame</code> in một "saved pc". Vì sao bài kế quan tâm đến saved pc đó đến vậy?',
            options: ['It is the current instruction being executed|||Đó là lệnh đang được thực thi', 'It is the return address — where the CPU jumps back to; an overflow that overwrites it hijacks control flow|||Đó là địa chỉ trả về — nơi CPU nhảy về; một cú tràn ghi đè nó chiếm luồng điều khiển', 'It is the address of the next function to call|||Đó là địa chỉ của hàm kế sẽ gọi', 'It is a random value for ASLR|||Đó là một giá trị ngẫu nhiên cho ASLR'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The saved pc is the return address stored in the frame (arm64 saved x30). A buffer overflow that reaches it changes where the function returns to — the mechanism lesson 13.2 reproduces (200 bytes → a jump to 0x4141… → crash). The current instruction is $pc; nothing here is random or a forward call.|||VI: saved pc là địa chỉ trả về lưu trong khung (arm64 x30 đã lưu). Một cú tràn chạm tới nó đổi nơi hàm trả về — cơ chế bài 13.2 tái hiện (200 byte → nhảy tới 0x4141… → sập). Lệnh hiện tại là $pc; không có gì ở đây là ngẫu nhiên hay một lời gọi tới trước.' },
          { question: '<code>./vuln AAAAAAAAAAAAAAAAAAAA</code> (20 A’s into a 16-byte buffer) prints <code>flag = 1094795585</code>. Why did a program that never assigns flag end up changing it?|||<code>./vuln AAAAAAAAAAAAAAAAAAAA</code> (20 chữ A vào bộ đệm 16 byte) in <code>flag = 1094795585</code>. Vì sao một chương trình không bao giờ gán flag lại làm nó đổi?',
            options: ['A compiler bug reused the memory|||Một lỗi trình biên dịch dùng lại vùng nhớ đó', '1094795585 is uninitialised garbage|||1094795585 là rác chưa khởi tạo', 'The integer overflowed from arithmetic|||Số nguyên bị tràn do phép tính', 'strcpy wrote 4 bytes past buf[16] onto the adjacent int, because C does not bounds-check the copy|||strcpy ghi 4 byte quá buf[16] sang int kế bên, vì C không kiểm bờ của cú chép'],
            correctIndex: 3, points: 1,
            explanation: 'EN: 1094795585 is 0x41414141 — four A bytes. strcpy copied all 20 bytes with no length check, and the four past the 16-byte buffer landed on the adjacent flag in the struct. That is memory corruption: out-of-bounds data silently became other data. No compiler bug, no arithmetic overflow, and it is not uninitialised — flag was set to 0 first.|||VI: 1094795585 là 0x41414141 — bốn byte A. strcpy chép cả 20 byte không kiểm độ dài, và bốn byte quá bộ đệm 16 byte rơi vào flag kế bên trong struct. Đó là hỏng bộ nhớ: dữ liệu ngoài bờ lặng lẽ thành dữ liệu khác. Không lỗi trình biên dịch, không tràn số học, và không phải chưa khởi tạo — flag được đặt 0 trước.' },
          { question: 'The toy with the stack canary on, fed 200 bytes, prints <code>*** stack smashing detected ***</code> and exits <strong>134</strong>; without the canary the same input gave a Bus error (exit 135). What did the canary buy you?|||Đồ chơi bật stack canary, nhận 200 byte, in <code>*** stack smashing detected ***</code> và thoát <strong>134</strong>; không có canary thì cùng input cho Bus error (exit 135). Canary đem lại cho bạn điều gì?',
            options: ['It prevented the overflow from happening|||Nó ngăn cú tràn xảy ra', 'It turned a potential control-flow hijack into a controlled abort before the corrupted return address was used|||Nó biến một cú chiếm luồng điều khiển tiềm tàng thành một abort có kiểm soát trước khi địa chỉ trả về hỏng được dùng', 'It made the program faster|||Nó làm chương trình nhanh hơn', 'Exit 134 means the overflow was harmless|||Exit 134 nghĩa là cú tràn vô hại'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The overflow still happened — the canary (a random value before the return address) was checked before ret, found changed, and the program called abort() (SIGABRT, 128+6=134). So a hijackable return became a clean crash. It does not prevent the write or speed anything up, and exit 134 is a crash, not "harmless"; the real fix is still a bounded copy.|||VI: Cú tràn vẫn xảy ra — canary (một giá trị ngẫu nhiên trước địa chỉ trả về) được kiểm trước ret, thấy đã đổi, và chương trình gọi abort() (SIGABRT, 128+6=134). Nên một cú trả về chiếm-quyền-được thành một cú sập gọn. Nó không ngăn cú ghi hay làm nhanh gì, và exit 134 là một cú sập, không "vô hại"; bản sửa thật vẫn là một cú chép có chặn.' },
          { question: 'On a hardened binary, <code>readelf -l</code> shows the <code>GNU_STACK</code> segment as <code>RW</code> (never RWE). Which mitigation is that, and what does it stop?|||Trên một tệp nhị phân đã cứng hoá, <code>readelf -l</code> hiện segment <code>GNU_STACK</code> là <code>RW</code> (không bao giờ RWE). Đó là lớp phòng vệ nào, và nó chặn gì?',
            options: ['RELRO — it makes the GOT read-only|||RELRO — nó làm GOT chỉ-đọc', 'ASLR — it randomises the stack address|||ASLR — nó ngẫu nhiên hoá địa chỉ stack', 'NX / W^X — the stack is writable but not executable, so bytes written there cannot be run as code|||NX / W^X — stack ghi được nhưng không chạy được, nên byte ghi vào đó không chạy như mã được', 'Stack canary — it detects overflows|||Stack canary — nó phát hiện tràn'],
            correctIndex: 2, points: 1,
            explanation: 'EN: A stack marked RW (not RWE) is NX/W^X: no page is both writable and executable, so even if an attacker writes shellcode onto the stack, the CPU refuses to execute it. RELRO is about the GOT (read off BIND_NOW + GNU_RELRO), ASLR is the random base (ET_DYN/PIE), and the canary is the __stack_chk_fail symbol — three different flags you read separately.|||VI: Một stack đánh dấu RW (không RWE) là NX/W^X: không trang nào vừa ghi vừa chạy được, nên kể cả kẻ tấn công ghi shellcode lên stack, CPU từ chối chạy nó. RELRO nói về GOT (đọc từ BIND_NOW + GNU_RELRO), ASLR là gốc ngẫu nhiên (ET_DYN/PIE), và canary là ký hiệu __stack_chk_fail — ba cờ khác nhau bạn đọc riêng.' },
          { question: '<code>./fmt bad "%p.%p.%p"</code> printed <code>0xffffccfe1e87.(nil).0xe4879d1220659f11</code> while <code>./fmt good</code> printed the text literally. What is the bug and the one-line fix?|||<code>./fmt bad "%p.%p.%p"</code> in <code>0xffffccfe1e87.(nil).0xe4879d1220659f11</code> còn <code>./fmt good</code> in văn bản nguyên văn. Lỗi là gì và bản sửa một dòng là gì?',
            options: ['A format-string bug: user text was passed as the format, so %p leaked stack words. Fix: printf("%s", user)|||Một lỗi chuỗi định dạng: văn bản người dùng bị truyền làm format, nên %p rò các từ trên stack. Sửa: printf("%s", user)', 'A buffer overflow; fix by enlarging the buffer|||Một cú tràn bộ đệm; sửa bằng cách tăng kích cỡ bộ đệm', 'A use-after-free; fix with AddressSanitizer|||Một use-after-free; sửa bằng AddressSanitizer', 'Nothing is wrong; %p is meant to print addresses|||Không có gì sai; %p vốn để in địa chỉ'],
            correctIndex: 0, points: 1,
            explanation: 'EN: printf(user) lets the user’s % conversions run; %p read and printed stack values — an information leak that can defeat ASLR, and %n can even write memory. The fix is to make the user data, never the format: printf("%s", user). It is not an overflow or a heap bug, and it is definitely wrong — the program chose to interpret attacker-controlled conversions.|||VI: printf(user) cho các ký tự % của người dùng chạy; %p đọc và in các giá trị trên stack — một cú rò thông tin có thể vô hiệu ASLR, và %n còn ghi được bộ nhớ. Bản sửa là biến người dùng thành dữ liệu, không bao giờ là format: printf("%s", user). Không phải tràn hay lỗi heap, và chắc chắn là sai — chương trình đã chọn diễn giải các conversion do kẻ tấn công kiểm soát.' },
          { question: 'ASan on a toy prints <code>heap-use-after-free … SUMMARY … uaf.c:10 in main</code>, plus "freed by thread T0" and "previously allocated". How should this change your test setup?|||ASan trên một đồ chơi in <code>heap-use-after-free … SUMMARY … uaf.c:10 in main</code>, kèm "freed by thread T0" và "previously allocated". Điều này nên đổi cách bạn dựng test ra sao?',
            options: ['Nothing — ASan only works on toys|||Không gì — ASan chỉ chạy trên đồ chơi', 'Use-after-free is harmless if the program still runs|||Use-after-free vô hại nếu chương trình vẫn chạy', 'Disable the allocator to avoid the bug|||Tắt bộ cấp phát để tránh lỗi', 'Run tests and CI under -fsanitize=address (and Valgrind): it turns random production crashes into a precise file:line report in seconds|||Chạy test và CI dưới -fsanitize=address (và Valgrind): nó biến những cú sập ngẫu nhiên trên production thành một báo cáo file:dòng chính xác trong vài giây'],
            correctIndex: 3, points: 1,
            explanation: 'EN: ASan instruments heap allocations so a use-after-free or double-free stops at the exact line with the free and allocation stacks — exactly what you want in CI, where it catches bugs that otherwise crash randomly in production (Chapter 7’s allocator may already have reused the block). It works on real code, not just toys; you never disable the allocator; and UAF is undefined behaviour, never harmless.|||VI: ASan đo đạc các cấp phát heap nên một use-after-free hay double-free dừng đúng dòng kèm ngăn xếp lúc free và cấp phát — đúng thứ bạn muốn trong CI, nơi nó bắt những lỗi mà nếu không thì sập ngẫu nhiên trên production (bộ cấp phát ở Chương 7 có thể đã dùng lại khối đó). Nó chạy trên code thật, không chỉ đồ chơi; bạn không bao giờ tắt bộ cấp phát; và UAF là hành vi không định nghĩa, không bao giờ vô hại.' },
          { question: 'A setuid-root toy, run as an unprivileged user with a planted <code>hostname</code> in PATH, ran that fake at <strong>euid 1001</strong> when it used <code>system()</code> but at <strong>euid 0</strong> when it used <code>execlp()</code>. Why the difference, and what is the real fix?|||Một đồ chơi setuid-root, chạy bởi người dùng không đặc quyền với một <code>hostname</code> cài vào PATH, chạy bản giả đó ở <strong>euid 1001</strong> khi dùng <code>system()</code> nhưng ở <strong>euid 0</strong> khi dùng <code>execlp()</code>. Vì sao khác nhau, và bản sửa thật là gì?',
            options: ['execlp is buggy; always use system()|||execlp bị lỗi; luôn dùng system()', 'system() runs /bin/sh (dash), which drops privilege when euid != uid; execlp has no shell to drop it. Fix: drop privilege yourself and exec an absolute path with a clean env|||system() chạy /bin/sh (dash), thứ bỏ đặc quyền khi euid != uid; execlp không có shell để bỏ. Sửa: tự bỏ đặc quyền và exec một đường dẫn tuyệt đối với env sạch', 'The difference is random|||Khác biệt là ngẫu nhiên', 'euid 1001 means the attack failed permanently on all systems|||euid 1001 nghĩa là cuộc tấn công thất bại vĩnh viễn trên mọi hệ thống'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Ubuntu’s /bin/sh is dash, which resets privilege when euid != uid — so the system() path’s planted binary ran as 1001. execlp does a PATH search with no shell, so nothing dropped privilege and the fake ran as root. Never rely on dash’s behaviour: drop privilege explicitly (setuid(getuid())) and exec an absolute path with an empty environment — no PATH, no shell.|||VI: /bin/sh của Ubuntu là dash, thứ đặt lại đặc quyền khi euid != uid — nên tệp cài vào theo đường system() chạy ở 1001. execlp tìm PATH không có shell, nên không gì bỏ đặc quyền và bản giả chạy với quyền root. Đừng bao giờ dựa vào hành vi của dash: bỏ đặc quyền tường minh (setuid(getuid())) và exec một đường dẫn tuyệt đối với môi trường rỗng — không PATH, không shell.' },
          { question: 'A program checks a path with <code>access()</code> then opens it with <code>open()</code>; an attacker repoints a symlink in between and reads a secret. Which fix closes the race?|||Một chương trình kiểm một đường dẫn bằng <code>access()</code> rồi mở nó bằng <code>open()</code>; kẻ tấn công trỏ lại một symlink ở giữa và đọc một bí mật. Bản sửa nào đóng được race?',
            options: ['Add a sleep between access() and open()|||Thêm một sleep giữa access() và open()', 'Call access() twice|||Gọi access() hai lần', 'Open once with O_NOFOLLOW (or openat on a directory fd) so check and use act on the same object, never a re-resolved name|||Mở một lần với O_NOFOLLOW (hoặc openat trên một fd thư mục) để kiểm và dùng tác động cùng một đối tượng, không bao giờ một cái tên phân giải lại', 'Run the program as root|||Chạy chương trình với quyền root'],
            correctIndex: 2, points: 1,
            explanation: 'EN: TOCTOU exists because the path is resolved twice; O_NOFOLLOW refuses a symlink at the final component (our fix returned ELOOP), and openat with a directory fd lets check and use act on one object. A sleep widens the window; calling access() again resolves the name yet again; and running as root makes the consequences worse, not better.|||VI: TOCTOU tồn tại vì đường dẫn được phân giải hai lần; O_NOFOLLOW từ chối một symlink ở thành phần cuối (bản sửa của ta trả về ELOOP), và openat với một fd thư mục cho kiểm và dùng tác động một đối tượng. Một sleep nới rộng khoảng hở; gọi access() lần nữa lại phân giải tên thêm lần nữa; và chạy với quyền root làm hậu quả tệ hơn, không tốt hơn.' },
          { question: 'A default container shows <code>CapBnd</code> ≈ 14 caps and <code>Seccomp: 2</code>; a <code>--privileged</code> one shows 41 caps, <code>Seccomp: 0</code> and the host’s <code>vda</code> disk in /dev. A teammate wants --privileged for a build agent. What do you say?|||Một container mặc định hiện <code>CapBnd</code> ≈ 14 cap và <code>Seccomp: 2</code>; một container <code>--privileged</code> hiện 41 cap, <code>Seccomp: 0</code> và đĩa <code>vda</code> của máy chủ trong /dev. Một bạn muốn --privileged cho build agent. Bạn nói gì?',
            options: ['No: --privileged gives all capabilities, removes seccomp and exposes host devices — effectively root on the host. Use a rootless builder or drop specific capabilities instead|||Không: --privileged cho mọi capability, gỡ seccomp và lộ thiết bị máy chủ — gần như root trên máy chủ. Dùng một builder rootless hoặc bỏ các capability cụ thể thay vào đó', 'Fine — --privileged is required to build images|||Được thôi — --privileged là bắt buộc để dựng ảnh', 'It is safe as long as the image is trusted|||An toàn miễn là ảnh được tin cậy', 'Mounting docker.sock instead is the safe alternative|||Gắn docker.sock thay vào đó là lựa chọn an toàn'],
            correctIndex: 0, points: 1,
            explanation: 'EN: The measured contrast is the argument: full caps + no seccomp + host disks means a process inside can reach the host directly, so --privileged is effectively host root and must not run app or CI workloads. Modern image builds use rootless builders (Buildah/Kaniko/BuildKit rootless) or a user-namespaced daemon. Mounting docker.sock is the same danger by another door — talking to the root daemon is host root.|||VI: Sự tương phản đã đo chính là lý lẽ: đủ cap + không seccomp + đĩa máy chủ nghĩa là một tiến trình bên trong chạm thẳng máy chủ, nên --privileged gần như là root máy chủ và không được chạy tải ứng dụng hay CI. Dựng ảnh hiện đại dùng builder rootless (Buildah/Kaniko/BuildKit rootless) hoặc một daemon ánh xạ user namespace. Gắn docker.sock là cùng mối nguy qua một cánh cửa khác — nói chuyện với daemon root là root máy chủ.' },
        ],
      },
    },
  ],
};
