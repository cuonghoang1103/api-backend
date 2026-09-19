/**
 * CEA201 · Chương 8 theo syllabus trường (= Chapter 9 bản 11e) — Operating
 * System Support, học theo từng slide, PHẦN A: slide 1–26 của deck 'cea9'
 * (deck có 51 slide).
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed và gọi phần này là
 * "Chapter 8: Operating System Support"; slide là bản 11th ed đánh số Chapter 9.
 * Vì vậy file tên ch8a nhưng mọi hình/bảng trên slide mang số 9.x.
 *
 * ⚠️ PHẠM VI THẬT của slide 1–26 (đã đối chiếu chữ trích, KHÔNG có quản lý bộ
 * nhớ): 1–6 hệ điều hành là gì + ba giao diện ISA/ABI/API + OS như bộ quản lý
 * tài nguyên · 7–11 các loại OS, máy thời kỳ chưa có OS, monitor thường trú,
 * JCL, bốn tính năng phần cứng OS cần · 12–16 đa chương trình và toàn bộ bài
 * tính hiệu suất (Fig 9.4, Fig 9.5, Table 9.1, Table 9.2, Fig 9.6) · 17–18 chia
 * sẻ thời gian · 19–21 bốn loại lập lịch · 22–26 tiến trình, PCB, và bộ máy lập
 * lịch. SWAPPING/PHÂN VÙNG/PHÂN TRANG bắt đầu từ slide 27 — nằm ở phần B.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH09-COA11e.pptx (/tmp/cea201-text/cea9.txt).
 * Slide chỉ có tiêu đề + hình/bảng (2, 4, 6, 9, 12, 13, 15, 16, 18, 20, 22, 23,
 * 24, 25, 26) đã ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn trên sơ đồ.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · Fig 9.4: 15 + 1 + 15 = 31 µs, mức dùng CPU = 1/31 = 0,0323 = 3,2 % (khớp
 *     đúng con số in trên slide).
 *   · Table 9.2 dựng lại TRỌN VẸN từ Table 9.1 với giả thiết bộ nhớ 256 MB:
 *     uniprogramming — mem×time = 2550 MB·phút / (30×256) = 33,2 % ≈ 33;
 *     đĩa 10/30 = 33,3 %; máy in 10/30 = 33,3 %; terminal 15/30 = 50 %;
 *     thông lượng 3 job / 0,5 h = 6 job/h; thời gian đáp ứng (5+20+30)/3 = 18,3.
 *     multiprogramming — mem×time = 5×230 + 5×180 + 5×100 = 2550 (ĐÚNG BẰNG số
 *     cũ) / (15×256) = 66,4 % ≈ 67; đĩa 10/15 = 66,7 %; máy in 66,7 %;
 *     thông lượng 3/0,25 h = 12; đáp ứng (5+15+10)/3 = 10,0. CPU: 20 % × 30 =
 *     6 phút bận ⇒ 6/15 = 40 % — khớp cột multiprogramming của slide.
 *   · Mức dùng CPU theo số tiến trình 1 − p^n, kiểm đủ n = 1…10 cho
 *     p = 0,2 / 0,5 / 0,8 (bảng in nguyên trong bài, slide 13).
 *     Số tiến trình để đạt ≥ 90 %: p = 0,2 → 2 · p = 0,5 → 4 · p = 0,8 → 11 ·
 *     p = 0,9 → 22.
 *   · Nối ngược Amdahl (Ch.2): uniprogramming CPU bận 6/30 phút ⇒ làm CPU NHANH
 *     VÔ HẠN chỉ còn 24 phút, tăng tốc 1,25×; còn đa chương trình cho 30/15 =
 *     2,0×. Với Fig 9.4 (f = 1/31): k = 2 → 1,0164 · k = 10 → 1,0299 ·
 *     k = 100 → 1,0330 · k → ∞ → 1,0333.
 *   · Lấy p = 30/31 = 0,968 của chính Fig 9.4 vào công thức 1 − p^n:
 *     n = 10 → 27,96 % · n = 20 → 48,1 % · n = 50 → 80,59 % · n = 100 → 96,23 %.
 *
 * Chỗ slide gốc CỤT/LỆCH — nêu rõ, không im lặng chép, không tự sửa slide:
 *   · slide 18 (Table 9.3): trên slide CHỈ còn 2 dòng (Principal objective ·
 *     Source of directives). Bảng trong sách có thêm dòng thứ ba
 *     (Source of address space / operating-system directives) — slide đã cắt.
 *   · slide 19 (Table 9.4): chữ trích bị gạch nối do xuống dòng
 *     ("han-dled"), là lỗi cắt dòng của .pptx chứ không phải từ khác.
 *   · slide 10: dòng "**Each FORTRAN instruction and each item of data…" là
 *     GHI CHÚ GIẢNG VIÊN của slide, không phải nội dung chiếu.
 *   · slide 21 tiêu đề có khoảng trắng thừa giữa hai vế ("Medium-Term
 *     Scheduling                      and Short-Term Scheduling").
 *   · Table 9.1 KHÔNG nêu nhu cầu CPU của từng job, và Table 9.2 cũng không nói
 *     tổng bộ nhớ máy là bao nhiêu. Hai con số đó được SUY NGƯỢC trong bài
 *     (6 phút CPU, 256 MB) và nói rõ là suy ngược, không phải slide ghi.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea9';

export default {
  title: '8.0a — Slide by slide: What an OS does, multiprogramming and scheduling (slides 1–26)|||8.0a — Slide bài giảng: Hệ điều hành làm gì, đa chương trình & lập lịch (slide 1–26)',
  slug: 'cea201-8-0a-slides-he-dieu-hanh-lap-lich',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương "Hỗ trợ của hệ điều hành" (slide 1–26 của bộ slide Stallings 11e) — chương duy nhất của CEA201 nhìn máy tính từ phía PHẦN MỀM HỆ THỐNG. Đi từ định nghĩa hệ điều hành và ba giao diện ISA/ABI/API, qua thời kỳ chưa có OS và monitor thường trú, tới bốn tính năng phần cứng mà OS bắt buộc phải có (bảo vệ bộ nhớ, bộ đếm thời gian, lệnh đặc quyền, ngắt), rồi giải TRỌN VẸN bài tính hiệu suất đa chương trình của Table 9.1/9.2 và công thức mức dùng CPU 1 − p^n, kết bằng bốn mức lập lịch, mô hình tiến trình năm trạng thái và khối điều khiển tiến trình PCB. Mọi con số đã kiểm bằng python3.',
  content: [
    walkHead(D, 1, 26),
    walk(D, [

      [1, 'Chapter 9 — Operating System Support (title slide)',
        `<p class="y-chinh">🎯 The one chapter in this course that looks at the machine <strong>from the software side</strong>. Everything before it asked "what does the hardware do?"; this chapter asks <strong>"what must the hardware provide so that an operating system is even possible?"</strong></p>
<ul>
<li><strong>Numbering warning, read this first.</strong> Your syllabus follows the 9th edition and calls this block <strong>Chapter 8: Operating System Support</strong>. The slide deck is the 11th edition, where the same material is <strong>Chapter 9</strong>. So the lesson is numbered 8 on the website while every figure and table on screen is numbered 9.x. They are the same content — do not go hunting for a missing chapter.</li>
<li><strong>Why an architecture course teaches OS at all.</strong> Because half of what an OS does is <em>impossible</em> without specific hardware. Memory protection needs base/limit registers or an MMU. Pre-emption needs a hardware timer. Keeping user programs out of the I/O ports needs privileged instructions and a mode bit. Slide 11 lists exactly these four, and they are the real subject of the chapter.</li>
<li><strong>Where this half ends.</strong> Slides 1–26 (this lesson) cover: what an OS is, the three interfaces, the history that produced multiprogramming, the multiprogramming performance arithmetic, time sharing, the four kinds of scheduling, the process and its control block. <strong>Memory management — swapping, partitioning, paging, virtual memory, TLB, segmentation, x86 and ARM MMUs — begins at slide 27</strong> and is the second half.</li>
<li><strong>What you already have.</strong> CSI106 chapter 5 introduced operating systems as a concept: processes, memory management, file systems, as boxes. CEA201 goes one level down and shows the <em>hardware underneath each box</em>. PRF192 gave you a C program; this chapter explains what the machine wraps around that program to make it a <em>process</em>.</li>
<li><strong>Where the exam marks are.</strong> Two places, reliably. (1) The multiprogramming utilization calculation — Table 9.1 into Table 9.2, worked on slides 14–16 of this lesson in full. (2) The five-state process model and the contents of the PCB, slides 22–23. Everything else is descriptive.</li>
</ul>
<p class="meo">💡 Hold one sentence for the whole chapter: <strong>the OS is just a program — the unusual thing is that it is a program which must be able to take the processor back.</strong> Slide 5 says this explicitly, and every hardware feature in slide 11 exists to make "take it back" possible.</p>`,
        `<p class="y-chinh">🎯 Chương DUY NHẤT của môn này nhìn cái máy <strong>từ phía phần mềm</strong>. Mọi chương trước hỏi "phần cứng làm gì?"; chương này hỏi <strong>"phần cứng phải cung cấp những gì thì hệ điều hành mới TỒN TẠI ĐƯỢC?"</strong></p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Syllabus của trường theo bản 9th ed nên gọi khối này là <strong>Chapter 8: Operating System Support</strong>. Bộ slide là bản 11th ed, cùng nội dung đó nằm ở <strong>Chapter 9</strong>. Nên bài trên web đánh số 8 trong khi mọi hình và bảng trên màn hình đánh số 9.x. Cùng một thứ — đừng đi tìm một chương bị mất.</li>
<li><strong>Vì sao môn KIẾN TRÚC lại dạy hệ điều hành.</strong> Vì một nửa việc OS làm là <em>KHÔNG THỂ</em> làm nếu thiếu phần cứng cụ thể. Bảo vệ bộ nhớ cần thanh ghi base/limit hoặc MMU. Cướp quyền (pre-emption) cần bộ đếm thời gian bằng phần cứng. Chặn chương trình người dùng đụng vào cổng I/O cần lệnh đặc quyền và một bit chế độ. Slide 11 kể đúng bốn thứ đó, và đấy mới là đề tài thật của chương.</li>
<li><strong>Nửa này dừng ở đâu.</strong> Slide 1–26 (bài này) gồm: hệ điều hành là gì, ba giao diện, lịch sử đẻ ra đa chương trình, PHÉP TÍNH hiệu suất đa chương trình, chia sẻ thời gian, bốn loại lập lịch, tiến trình và khối điều khiển tiến trình. <strong>Quản lý bộ nhớ — swapping, phân vùng, phân trang, bộ nhớ ảo, TLB, phân đoạn, MMU của x86 và ARM — bắt đầu từ slide 27</strong> và là nửa sau.</li>
<li><strong>Bạn đã có sẵn gì.</strong> CSI106 chương 5 giới thiệu hệ điều hành ở mức KHÁI NIỆM: tiến trình, quản lý bộ nhớ, hệ thống tệp, dưới dạng các ô vuông. CEA201 đi xuống một tầng và chỉ ra <em>PHẦN CỨNG NẰM DƯỚI TỪNG Ô</em>. PRF192 cho bạn một chương trình C; chương này giải thích cái máy bọc gì quanh chương trình đó để nó thành một <em>TIẾN TRÌNH</em>.</li>
<li><strong>Điểm thi nằm ở đâu.</strong> Hai chỗ, rất chắc. (1) Bài tính mức dùng tài nguyên khi đa chương trình — từ Table 9.1 ra Table 9.2, bài này giải TRỌN VẸN ở slide 14–16. (2) Mô hình tiến trình năm trạng thái và nội dung PCB, slide 22–23. Phần còn lại là mô tả.</li>
</ul>
<p class="meo">💡 Giữ một câu cho cả chương: <strong>hệ điều hành cũng chỉ là một chương trình — điều lạ là nó là chương trình PHẢI LẤY LẠI ĐƯỢC bộ xử lý.</strong> Slide 5 nói thẳng câu này, và mọi tính năng phần cứng ở slide 11 tồn tại để "lấy lại được" trở thành khả thi.</p>`],

      [2, 'Figure 9.1 — Computer Hardware and Software Structure',
        `<p class="y-chinh">🎯 A layer cake with <strong>three interfaces drawn as lines between the layers</strong>. From the top: application programs → libraries/utilities → operating system → (the ISA line) → execution hardware, system interconnect (bus), memory translation, main memory, I/O devices and networking. The braces on the right split it into <strong>Software</strong> above and <strong>Hardware</strong> below.</p>
<table>
<tr><th>Line on the figure</th><th>Drawn between</th><th>What it defines</th></tr>
<tr><td><strong>API</strong> — application programming interface</td><td>Application programs / libraries and utilities</td><td>The function calls a programmer writes (HLL level)</td></tr>
<tr><td><strong>ABI</strong> — application binary interface</td><td>Libraries and utilities / operating system</td><td>The binary-level contract: system call convention, register usage, data layout</td></tr>
<tr><td><strong>ISA</strong> — instruction set architecture</td><td>Operating system / execution hardware</td><td>The machine instructions themselves — the hardware/software boundary</td></tr>
</table>
<ul>
<li><strong>Read the notches, not just the stripes.</strong> The green software block is <em>stepped</em>: the application box reaches all the way down past libraries to touch the OS, and the OS box reaches down to touch the hardware. That shape says an application <em>may</em> bypass the library and issue a system call directly, and the OS <em>may</em> touch hardware that applications never see.</li>
<li><strong>"Memory translation" is a hardware box on this figure.</strong> That is the MMU, and it is drawn beside the bus, below the ISA line — i.e. the address translation the OS configures is performed by <em>hardware</em>. Slides 27–35 of the deck are entirely about that box; the second half of this chapter lives there.</li>
<li><strong>Why the ISA line is the most important one for this course.</strong> Everything you studied in Ch.13/Ch.14 (instruction sets, addressing modes) <em>is</em> that line. This figure is the moment the course admits that the ISA was never just a hardware topic — it is a contract, and the OS is its biggest customer.</li>
<li><strong>The practical consequence of ABI.</strong> Two programs compiled by different compilers can link together, and a binary compiled years ago still runs, because the ABI froze the calling convention. This is why a Linux x86-64 binary does not run on macOS even though the ISA is identical — same ISA, different ABI/system calls.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: API is <em>not</em> "the OS interface". On this figure the OS sits <strong>below</strong> the ABI line; the API is the level above, made of library calls. A question asking "which interface defines the boundary between hardware and software" wants <strong>ISA</strong>, not API.</p>`,
        `<p class="y-chinh">🎯 Một cái bánh nhiều tầng với <strong>BA GIAO DIỆN vẽ thành ba đường kẻ giữa các tầng</strong>. Từ trên xuống: chương trình ứng dụng → thư viện/tiện ích → hệ điều hành → (đường ISA) → phần cứng thực thi, liên kết hệ thống (bus), dịch địa chỉ bộ nhớ, bộ nhớ chính, thiết bị I/O và mạng. Hai dấu ngoặc bên phải chia thành <strong>Software</strong> ở trên và <strong>Hardware</strong> ở dưới.</p>
<table>
<tr><th>Đường trên hình</th><th>Vẽ giữa</th><th>Nó định nghĩa cái gì</th></tr>
<tr><td><strong>API</strong> — giao diện lập trình ứng dụng</td><td>Chương trình ứng dụng / thư viện và tiện ích</td><td>Những lời gọi hàm lập trình viên viết (mức ngôn ngữ bậc cao)</td></tr>
<tr><td><strong>ABI</strong> — giao diện nhị phân ứng dụng</td><td>Thư viện và tiện ích / hệ điều hành</td><td>Hợp đồng ở mức NHỊ PHÂN: quy ước gọi hệ thống, cách dùng thanh ghi, cách xếp dữ liệu</td></tr>
<tr><td><strong>ISA</strong> — kiến trúc tập lệnh</td><td>Hệ điều hành / phần cứng thực thi</td><td>Chính các lệnh máy — ranh giới phần cứng/phần mềm</td></tr>
</table>
<ul>
<li><strong>Đọc cả những chỗ KHUYẾT, đừng chỉ đọc các vạch.</strong> Khối phần mềm màu xanh vẽ theo bậc thang: ô ứng dụng thò xuống qua mặt thư viện để chạm thẳng vào OS, và ô OS thò xuống chạm phần cứng. Hình dạng đó nói rằng ứng dụng <em>CÓ THỂ</em> bỏ qua thư viện mà gọi hệ thống trực tiếp, và OS <em>CÓ THỂ</em> đụng vào phần cứng mà ứng dụng không bao giờ thấy.</li>
<li><strong>"Memory translation" là một ô PHẦN CỨNG trên hình này.</strong> Đó chính là MMU, vẽ cạnh bus, nằm DƯỚI đường ISA — tức việc dịch địa chỉ mà OS cấu hình lại do <em>PHẦN CỨNG</em> thực hiện. Slide 27–35 của deck nói toàn về cái ô đó; nửa sau của chương sống ở đấy.</li>
<li><strong>Vì sao đường ISA quan trọng nhất với môn này.</strong> Mọi thứ bạn học ở Ch.13/Ch.14 (tập lệnh, chế độ địa chỉ) CHÍNH LÀ cái đường đó. Hình này là lúc môn học thừa nhận rằng ISA chưa bao giờ chỉ là chuyện phần cứng — nó là một HỢP ĐỒNG, và OS là khách hàng lớn nhất.</li>
<li><strong>Hệ quả thực tế của ABI.</strong> Hai chương trình biên dịch bằng hai trình biên dịch khác nhau vẫn link được với nhau, và một file nhị phân dịch từ nhiều năm trước vẫn chạy, là vì ABI đã đóng băng quy ước gọi hàm. Đây cũng là lý do một file nhị phân Linux x86-64 KHÔNG chạy trên macOS dù ISA y hệt — cùng ISA, khác ABI/gọi hệ thống.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: API <em>KHÔNG PHẢI</em> là "giao diện của hệ điều hành". Trên hình này OS nằm <strong>DƯỚI</strong> đường ABI; API là tầng ở trên, làm bằng các lời gọi thư viện. Câu hỏi "giao diện nào là ranh giới giữa phần cứng và phần mềm" muốn nghe <strong>ISA</strong>, không phải API.</p>`],

      [3, 'Operating System (OS) Services',
        `<p class="y-chinh">🎯 The definition and the job list. The OS is <strong>the most important system program</strong>; it <strong>masks the details of the hardware from the programmer</strong> and gives a convenient interface for using the system. The slide then names <strong>seven service areas</strong>.</p>
<table>
<tr><th>Service on the slide</th><th>What it actually means day to day</th><th>Hardware it leans on</th></tr>
<tr><td><strong>Program creation</strong></td><td>Editors, compilers, linkers, loaders offered as utilities</td><td>—</td></tr>
<tr><td><strong>Program execution</strong></td><td>Load the program into memory, initialise files and devices, start it</td><td>Loader, memory management</td></tr>
<tr><td><strong>Access to I/O devices</strong></td><td>You write "read a line", not a device-register poke sequence</td><td>I/O modules, DMA, interrupts (Ch.7)</td></tr>
<tr><td><strong>Controlled access to files</strong></td><td>Names and permissions instead of cylinders and sectors</td><td>Disk controller (Ch.6)</td></tr>
<tr><td><strong>System access</strong></td><td>Login, protection between users, resolving contention for shared resources</td><td>Privileged mode</td></tr>
<tr><td><strong>Error detection and response</strong></td><td>Hardware faults, arithmetic overflow, illegal memory access, printer out of paper</td><td>Interrupts / exceptions</td></tr>
<tr><td><strong>Accounting</strong></td><td>Collect usage statistics — for billing, and for tuning performance</td><td>Timers, counters</td></tr>
</table>
<ul>
<li><strong>"Masks the details of the hardware" is the whole point.</strong> Without an OS, a program that wants to read a file must know the disk controller's registers. With one, it calls <code>fopen</code>. The mask is what makes a program portable across machines — the same reason the ISA line exists on slide 2, one level lower.</li>
<li><strong>Notice that two of the seven are not about convenience at all.</strong> <em>System access</em> and <em>error detection</em> are about <strong>protection</strong>: keeping users apart and keeping a faulty program from taking the machine down. Those two are the ones that need hardware support, and slide 11 supplies it.</li>
<li><strong>Accounting looks boring and is not.</strong> It is the only service that produces the <em>measurements</em> — how much CPU, how much memory, how long per job. Those measurements feed Table 9.2 on slide 15 and every scheduling decision on slides 19–21. You cannot manage what you do not measure.</li>
<li><strong>Connect to PRF192.</strong> Every one of the seven shows up in the life of your first C program: the compiler (creation), <code>./a.out</code> (execution), <code>printf</code> (I/O access), <code>fopen</code> (files), your account (system access), a segmentation fault (error detection), and <code>time ./a.out</code> (accounting).</li>
</ul>
<p class="meo">💡 Remember the seven as a story, not a list: <em>you write it (creation), you run it (execution), it talks to devices (I/O) and to files, under an account (system access); when it breaks the OS catches it (errors) and either way the OS writes down what it used (accounting)</em>.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa và bản mô tả công việc. Hệ điều hành là <strong>chương trình hệ thống quan trọng nhất</strong>; nó <strong>CHE các chi tiết phần cứng khỏi lập trình viên</strong> và đưa ra một giao diện tiện lợi để dùng máy. Rồi slide kể <strong>BẢY mảng dịch vụ</strong>.</p>
<table>
<tr><th>Dịch vụ trên slide</th><th>Thực tế hằng ngày nó là gì</th><th>Dựa vào phần cứng nào</th></tr>
<tr><td><strong>Tạo chương trình</strong></td><td>Trình soạn thảo, biên dịch, liên kết, nạp — cung cấp dạng tiện ích</td><td>—</td></tr>
<tr><td><strong>Thực thi chương trình</strong></td><td>Nạp chương trình vào bộ nhớ, khởi tạo tệp và thiết bị, cho chạy</td><td>Bộ nạp, quản lý bộ nhớ</td></tr>
<tr><td><strong>Truy cập thiết bị vào/ra</strong></td><td>Bạn viết "đọc một dòng", không phải một chuỗi thao tác thanh ghi thiết bị</td><td>Mô-đun I/O, DMA, ngắt (Ch.7)</td></tr>
<tr><td><strong>Truy cập tệp có kiểm soát</strong></td><td>Dùng TÊN và QUYỀN thay vì trụ từ và cung từ</td><td>Bộ điều khiển đĩa (Ch.6)</td></tr>
<tr><td><strong>Truy cập hệ thống</strong></td><td>Đăng nhập, bảo vệ giữa các người dùng, xử tranh chấp tài nguyên chung</td><td>Chế độ đặc quyền</td></tr>
<tr><td><strong>Phát hiện và xử lý lỗi</strong></td><td>Hỏng phần cứng, tràn số học, truy cập bộ nhớ trái phép, máy in hết giấy</td><td>Ngắt / ngoại lệ</td></tr>
<tr><td><strong>Thống kê sử dụng</strong></td><td>Thu số liệu dùng tài nguyên — để tính tiền, và để chỉnh hiệu năng</td><td>Bộ đếm thời gian, bộ đếm</td></tr>
</table>
<ul>
<li><strong>"Che chi tiết phần cứng" chính là toàn bộ ý nghĩa.</strong> Không có OS, chương trình muốn đọc tệp phải biết các thanh ghi của bộ điều khiển đĩa. Có OS, nó gọi <code>fopen</code>. Cái MẶT NẠ đó là thứ khiến chương trình chạy được trên nhiều máy — cùng lý do với đường ISA ở slide 2, thấp hơn một tầng.</li>
<li><strong>Để ý hai trong bảy cái chẳng liên quan gì tới tiện lợi.</strong> <em>Truy cập hệ thống</em> và <em>phát hiện lỗi</em> nói về <strong>BẢO VỆ</strong>: giữ người dùng tách nhau và không cho một chương trình hỏng kéo sập cả máy. Đúng hai cái đó cần phần cứng đỡ lưng, và slide 11 sẽ cấp.</li>
<li><strong>Mục "thống kê" trông chán nhưng không chán.</strong> Nó là dịch vụ DUY NHẤT sinh ra <em>SỐ ĐO</em> — bao nhiêu CPU, bao nhiêu bộ nhớ, mỗi job mất bao lâu. Những số đó nuôi Table 9.2 ở slide 15 và mọi quyết định lập lịch ở slide 19–21. Không đo được thì không quản được.</li>
<li><strong>Nối sang PRF192.</strong> Cả bảy mục đều xuất hiện trong đời một chương trình C đầu tiên của bạn: trình biên dịch (tạo), <code>./a.out</code> (thực thi), <code>printf</code> (I/O), <code>fopen</code> (tệp), tài khoản của bạn (truy cập hệ thống), lỗi segmentation fault (phát hiện lỗi), và <code>time ./a.out</code> (thống kê).</li>
</ul>
<p class="meo">💡 Nhớ bảy mục như một CÂU CHUYỆN chứ đừng nhớ như danh sách: <em>bạn viết nó (tạo), bạn chạy nó (thực thi), nó nói chuyện với thiết bị (I/O) và với tệp, dưới một tài khoản (truy cập hệ thống); hỏng thì OS bắt được (lỗi) và kiểu gì OS cũng ghi sổ nó đã xài bao nhiêu (thống kê)</em>.</p>`],

      [4, 'Interfaces — ISA, ABI and API',
        `<p class="y-chinh">🎯 Slide 2 drew the three interfaces as lines; this slide gives each one a card with two facts on it. The header is simply <strong>"Key interfaces in a typical computer system"</strong>.</p>
<table>
<tr><th>Interface</th><th>Fact 1 on the slide</th><th>Fact 2 on the slide</th></tr>
<tr><td><strong>Instruction set architecture (ISA)</strong></td><td>Defines the machine language instructions that a computer can follow</td><td><strong>Boundary between hardware and software</strong></td></tr>
<tr><td><strong>Application binary interface (ABI)</strong></td><td>Defines a standard for <strong>binary portability</strong> across programs</td><td>Defines the <strong>system call</strong> interface to the OS and to the hardware resources and services available through the user ISA</td></tr>
<tr><td><strong>Application programming interface (API)</strong></td><td>Gives a program access to the hardware resources and services available in a system through the user ISA supplemented with <strong>high-level language (HLL) library calls</strong></td><td>Using an API enables application software to be <strong>ported easily</strong> to other systems that support the same API</td></tr>
</table>
<ul>
<li><strong>The two ISA halves that the slide does not name, but the book does.</strong> There is a <em>user ISA</em> (what any program may execute) and a <em>system ISA</em> (privileged instructions only the OS may execute). Both the ABI and API cards say "through the <strong>user</strong> ISA" — that word is doing real work: applications get the user half, never the system half. Slide 11 is where the system half is introduced.</li>
<li><strong>Both ABI and API promise portability — of different things.</strong> ABI portability is for <strong>binaries</strong>: ship one compiled file, it runs on every machine with that ABI. API portability is for <strong>source</strong>: recompile and it runs. That is exactly the difference between "download the .exe" and "clone and build".</li>
<li><strong>Which layer does a system call belong to?</strong> The ABI card says it: the system call interface is part of the ABI, not the API. <code>printf</code> is API; the <code>write</code> trap it eventually performs is ABI. One C line, two interfaces.</li>
<li><strong>Why an exam likes this slide.</strong> Three acronyms, one hierarchy, easy to write a multiple-choice question about. Fix the order once: <strong>API is highest, ABI is in the middle, ISA is lowest</strong> — alphabetical order happens to be top-down here, which is a free mnemonic.</li>
</ul>
<p class="meo">💡 One sentence per level: <strong>ISA = what the CPU understands · ABI = what a compiled file must obey · API = what a programmer types.</strong></p>
<p class="pitfall">⚠️ Careful with "portability" answers. Same ISA does <em>not</em> imply same ABI (Linux vs Windows on the same x86 chip). Same API does <em>not</em> imply same binary works (POSIX source compiles on many machines; the binaries do not move).</p>`,
        `<p class="y-chinh">🎯 Slide 2 vẽ ba giao diện thành ba đường kẻ; slide này cho mỗi cái một tấm thẻ với hai ý. Tiêu đề chỉ vỏn vẹn <strong>"Các giao diện chính trong một hệ thống máy tính điển hình"</strong>.</p>
<table>
<tr><th>Giao diện</th><th>Ý 1 trên slide</th><th>Ý 2 trên slide</th></tr>
<tr><td><strong>Kiến trúc tập lệnh (ISA)</strong></td><td>Định nghĩa các lệnh ngôn ngữ máy mà máy tính có thể làm theo</td><td><strong>Ranh giới giữa phần cứng và phần mềm</strong></td></tr>
<tr><td><strong>Giao diện nhị phân ứng dụng (ABI)</strong></td><td>Định nghĩa chuẩn cho <strong>tính khả chuyển NHỊ PHÂN</strong> giữa các chương trình</td><td>Định nghĩa giao diện <strong>GỌI HỆ THỐNG</strong> tới OS và tới tài nguyên/dịch vụ phần cứng sẵn có thông qua user ISA</td></tr>
<tr><td><strong>Giao diện lập trình ứng dụng (API)</strong></td><td>Cho chương trình truy cập tài nguyên và dịch vụ của hệ thống thông qua user ISA, có bổ sung các <strong>lời gọi thư viện ngôn ngữ bậc cao (HLL)</strong></td><td>Dùng API giúp phần mềm ứng dụng <strong>CHUYỂN SANG máy khác dễ dàng</strong>, miễn máy đó cũng hỗ trợ đúng API ấy</td></tr>
</table>
<ul>
<li><strong>Hai nửa của ISA mà slide không gọi tên nhưng sách thì có.</strong> Có <em>user ISA</em> (phần lệnh mà chương trình nào cũng chạy được) và <em>system ISA</em> (lệnh đặc quyền, chỉ OS được chạy). Cả thẻ ABI lẫn thẻ API đều ghi "thông qua <strong>user</strong> ISA" — chữ đó có sức nặng thật: ứng dụng chỉ được nửa user, không bao giờ được nửa system. Slide 11 là chỗ nửa system xuất hiện.</li>
<li><strong>ABI và API đều hứa khả chuyển — nhưng khả chuyển HAI THỨ KHÁC NHAU.</strong> ABI khả chuyển cho <strong>FILE NHỊ PHÂN</strong>: gửi một file đã dịch, máy nào cùng ABI cũng chạy. API khả chuyển cho <strong>MÃ NGUỒN</strong>: dịch lại thì chạy. Đúng bằng khác biệt giữa "tải file .exe về" và "clone rồi tự build".</li>
<li><strong>Lời gọi hệ thống thuộc tầng nào?</strong> Thẻ ABI nói rõ: giao diện gọi hệ thống thuộc ABI, không thuộc API. <code>printf</code> là API; cái lệnh bẫy <code>write</code> mà cuối cùng nó thực hiện là ABI. Một dòng C, hai giao diện.</li>
<li><strong>Vì sao đề thi thích slide này.</strong> Ba từ viết tắt, một thứ bậc, rất dễ ra trắc nghiệm. Ghim thứ tự một lần: <strong>API cao nhất, ABI ở giữa, ISA thấp nhất</strong> — thứ tự bảng chữ cái tình cờ trùng với thứ tự từ trên xuống, coi như mẹo nhớ cho không.</li>
</ul>
<p class="meo">💡 Một câu cho mỗi tầng: <strong>ISA = thứ CPU hiểu · ABI = thứ file đã dịch phải tuân · API = thứ lập trình viên gõ.</strong></p>
<p class="pitfall">⚠️ Cẩn thận với các đáp án về "khả chuyển". Cùng ISA <em>KHÔNG</em> suy ra cùng ABI (Linux và Windows trên cùng con chip x86). Cùng API <em>KHÔNG</em> suy ra file nhị phân chạy được (mã nguồn POSIX dịch được trên nhiều máy; file nhị phân thì không mang đi được).</p>`],

      [5, 'Operating System as Resource Manager',
        `<p class="y-chinh">🎯 A change of viewpoint: stop seeing the OS as a convenience layer and start seeing it as a <strong>manager of resources</strong>. A computer is a set of resources for the <strong>movement, storage and processing of data</strong> and for the <strong>control of these functions</strong>; the OS is responsible for managing them.</p>
<ul>
<li><strong>The three verbs are the whole machine.</strong> <em>Movement</em> = buses and I/O (Ch.3, Ch.7). <em>Storage</em> = memory hierarchy (Ch.4–Ch.7). <em>Processing</em> = the CPU (Ch.12–Ch.16). <em>Control</em> = the control unit and, one level up, the OS. This sentence is the course's own table of contents restated from the OS's chair.</li>
<li><strong>The slide then says the OS is "unusual in two respects" — and this is the exam-worthy part.</strong> (1) <strong>The OS functions in the same way as ordinary computer software — it is a program executed by the processor.</strong> There is no second, special machine running it. (2) <strong>The OS frequently relinquishes control and must depend on the processor to allow it to regain control.</strong></li>
<li><strong>Why point (2) is the deepest sentence in the chapter.</strong> A manager that must hand over the only resource it manages, and then hope to get it back, is in a strange position. If a user program never returns control voluntarily — an infinite loop with no I/O — the OS is simply <em>gone</em>. It cannot run, because the processor is busy running the loop.</li>
<li><strong>So how does it get back?</strong> Only by hardware. An <strong>interrupt</strong> — from a timer, from an I/O device — forces the processor to fetch its next instruction from the OS. That is why slide 11 lists the timer and interrupts as <em>required</em> features, and why Ch.3's interrupt cycle turns out to have been an OS mechanism all along.</li>
<li><strong>The consequence you can feel.</strong> Cooperative multitasking (old Windows 3.x, classic Mac OS) had no forced pre-emption, so one badly written application froze the whole machine. Modern systems use the timer interrupt and simply take the processor back. Same software, different hardware bargain.</li>
</ul>
<p class="meo">💡 Picture a referee who is also one of the players and shares the same body. He can only blow the whistle when he happens to be holding the ball. The <strong>timer interrupt is the assistant referee</strong> who blows it for him.</p>`,
        `<p class="y-chinh">🎯 Đổi góc nhìn: thôi xem OS như một lớp cho tiện, hãy xem nó là <strong>BỘ QUẢN LÝ TÀI NGUYÊN</strong>. Máy tính là một tập tài nguyên để <strong>DI CHUYỂN, LƯU TRỮ và XỬ LÝ dữ liệu</strong>, cùng để <strong>ĐIỀU KHIỂN các chức năng đó</strong>; OS chịu trách nhiệm quản lý chúng.</p>
<ul>
<li><strong>Ba động từ đó chính là cả cái máy.</strong> <em>Di chuyển</em> = bus và I/O (Ch.3, Ch.7). <em>Lưu trữ</em> = phân cấp bộ nhớ (Ch.4–Ch.7). <em>Xử lý</em> = CPU (Ch.12–Ch.16). <em>Điều khiển</em> = khối điều khiển, và cao hơn một tầng là OS. Câu này chính là MỤC LỤC của môn học nói lại từ ghế của hệ điều hành.</li>
<li><strong>Rồi slide nói OS "khác thường ở hai điểm" — và đây là phần đáng ra thi.</strong> (1) <strong>OS hoạt động y như phần mềm bình thường — nó là một chương trình do bộ xử lý thực thi.</strong> Không có cái máy thứ hai đặc biệt nào chạy nó cả. (2) <strong>OS thường xuyên NHƯỜNG quyền điều khiển và phải trông cậy vào bộ xử lý để LẤY LẠI được quyền đó.</strong></li>
<li><strong>Vì sao ý (2) là câu sâu nhất của chương.</strong> Một người quản lý buộc phải giao đi chính cái tài nguyên duy nhất mình quản, rồi hy vọng được trả lại, là ở một vị thế rất lạ. Nếu chương trình người dùng không bao giờ tự trả quyền — một vòng lặp vô hạn không I/O — thì OS đơn giản là <em>BIẾN MẤT</em>. Nó không chạy được, vì bộ xử lý đang bận chạy vòng lặp kia.</li>
<li><strong>Vậy nó lấy lại bằng cách nào?</strong> Chỉ bằng PHẦN CỨNG. Một <strong>NGẮT</strong> — từ bộ đếm thời gian, từ thiết bị I/O — ép bộ xử lý lấy lệnh kế tiếp từ vùng của OS. Đó là lý do slide 11 liệt kê bộ đếm thời gian và ngắt là tính năng <em>BẮT BUỘC</em>, và là lý do chu trình ngắt học ở Ch.3 hoá ra đã luôn là một cơ chế của hệ điều hành.</li>
<li><strong>Hệ quả bạn cảm nhận được.</strong> Đa nhiệm kiểu "hợp tác" (Windows 3.x đời cũ, Mac OS cổ điển) không có cướp quyền cưỡng bức, nên một ứng dụng viết ẩu là treo cả máy. Hệ thống hiện đại dùng ngắt bộ đếm thời gian và cứ thế lấy lại bộ xử lý. Cùng phần mềm, khác cái thoả thuận với phần cứng.</li>
</ul>
<p class="meo">💡 Hình dung một trọng tài đồng thời cũng là cầu thủ và dùng CHUNG một thân thể. Ông ta chỉ thổi còi được khi tình cờ đang giữ bóng. <strong>Ngắt bộ đếm thời gian là trợ lý trọng tài</strong> thổi còi hộ ông ấy.</p>`],

      [6, 'Figure 9.2 — The Operating System as Resource Manager',
        `<p class="y-chinh">🎯 The picture that makes "the OS is just a program" concrete. Inside the <strong>Computer System</strong> box there is <strong>Memory</strong>, and inside memory two regions: <strong>Operating System Software</strong> at the top and <strong>Programs and Data</strong> below it. Beside them a column of <strong>I/O Controllers</strong>, and at the bottom one or more <strong>Processors</strong>. Outside, the <strong>I/O Devices</strong> (printers, keyboards, digital camera, …) and a <strong>Storage</strong> disk holding <em>OS · Programs · Data</em>.</p>
<ul>
<li><strong>The single most important detail: the OS is drawn INSIDE memory.</strong> Not in a special box, not on a co-processor — in the same RAM as the user's programs, fetched by the same processor over the same bus. That is assertion (1) of slide 5, drawn.</li>
<li><strong>Read the disk circle at the bottom right.</strong> It contains <em>OS</em>, <em>Programs</em>, and <em>Data</em> — three stacked strips. The OS lives on disk too, and only part of it is resident in memory at any moment. Boot is exactly the act of copying the resident part up from that circle into the memory box.</li>
<li><strong>Why the processor box is drawn twice with dots between them.</strong> The figure quietly admits multiprocessors: "Processor … Processor". Resource management gets harder, not easier, with more processors — which is why Ch.17/Ch.18 exist. In this chapter assume one.</li>
<li><strong>The arrows all point at controllers, not devices.</strong> The OS never talks to a printer; it talks to an I/O controller, which talks to the printer. That indirection is precisely Ch.7's I/O module, and it is what lets one OS drive a thousand different printers with one interface.</li>
<li><strong>What "manager" means operationally.</strong> The OS decides <em>which</em> program occupies which part of the Programs and Data region, <em>when</em> each gets a processor, and <em>who</em> may use which controller. Three decisions — memory, time, devices — and the rest of the chapter is those three in detail.</li>
</ul>
<p class="pitfall">⚠️ Trap: because the OS sits in the same memory as user programs, a user program could overwrite it — unless hardware prevents it. Nothing in <em>this</em> figure stops it. The protection arrives on slide 11 and is the reason the figure is safe in practice.</p>`,
        `<p class="y-chinh">🎯 Bức hình làm cho câu "OS cũng chỉ là một chương trình" thành cụ thể. Trong ô <strong>Computer System</strong> có <strong>Memory</strong>, và trong bộ nhớ có hai vùng: <strong>Operating System Software</strong> ở trên, <strong>Programs and Data</strong> ở dưới. Cạnh đó là một cột các <strong>I/O Controller</strong>, và dưới đáy là một hoặc nhiều <strong>Processor</strong>. Bên ngoài là các <strong>thiết bị I/O</strong> (máy in, bàn phím, máy ảnh số, …) và một vòng tròn <strong>Storage</strong> chứa <em>OS · Programs · Data</em>.</p>
<ul>
<li><strong>Chi tiết quan trọng nhất: OS được vẽ NẰM TRONG BỘ NHỚ.</strong> Không nằm trong hộp đặc biệt nào, không nằm trên một bộ đồng xử lý — nó ở chung RAM với chương trình người dùng, do cùng bộ xử lý nạp lệnh, qua cùng một bus. Đó là ý (1) của slide 5, vẽ ra thành hình.</li>
<li><strong>Đọc kỹ vòng tròn đĩa ở góc dưới bên phải.</strong> Nó chứa <em>OS</em>, <em>Programs</em>, <em>Data</em> — ba dải xếp chồng. Hệ điều hành cũng NẰM TRÊN ĐĨA, và ở mỗi thời điểm chỉ một phần của nó thường trú trong bộ nhớ. Khởi động chính là hành động chép phần thường trú ấy từ vòng tròn kia lên ô bộ nhớ.</li>
<li><strong>Vì sao ô Processor được vẽ hai lần với ba chấm ở giữa.</strong> Hình lặng lẽ thừa nhận máy nhiều bộ xử lý: "Processor … Processor". Càng nhiều bộ xử lý, quản lý tài nguyên càng KHÓ chứ không dễ đi — đó là lý do Ch.17/Ch.18 tồn tại. Trong chương này cứ coi là một.</li>
<li><strong>Mọi mũi tên đều trỏ vào CONTROLLER, không trỏ vào thiết bị.</strong> OS không bao giờ nói chuyện với máy in; nó nói với bộ điều khiển I/O, rồi bộ đó nói với máy in. Lớp gián tiếp ấy đúng là mô-đun I/O của Ch.7, và là thứ cho phép một OS điều khiển nghìn loại máy in bằng một giao diện.</li>
<li><strong>"Quản lý" nghĩa là gì trong vận hành.</strong> OS quyết định chương trình nào chiếm phần nào của vùng Programs and Data, mỗi chương trình được bộ xử lý KHI NÀO, và AI được dùng controller nào. Ba quyết định — bộ nhớ, thời gian, thiết bị — và phần còn lại của chương là ba thứ đó nói chi tiết.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: vì OS nằm chung bộ nhớ với chương trình người dùng, một chương trình người dùng CÓ THỂ ghi đè lên nó — trừ khi phần cứng ngăn lại. Trong <em>chính hình này</em> không có gì ngăn cả. Sự bảo vệ xuất hiện ở slide 11, và đó là lý do thực tế hình này vẫn an toàn.</p>`],

      [7, 'Types of Operating Systems — interactive versus batch',
        `<p class="y-chinh">🎯 The first classification, and it is about <strong>who is present while the job runs</strong>. Interactive: the user is there. Batch: the user is not.</p>
<table>
<tr><th></th><th>Interactive system</th><th>Batch system</th></tr>
<tr><td><strong>Slide's definition</strong></td><td>The user/programmer interacts <em>directly</em> with the computer to request execution of a job or to perform a transaction</td><td>The <em>opposite</em> of interactive</td></tr>
<tr><td><strong>During execution</strong></td><td>The user may, depending on the application, <em>communicate with the computer while the job runs</em></td><td>The user's program is <strong>batched together with programs from other users</strong> and submitted by a computer operator</td></tr>
<tr><td><strong>Getting results</strong></td><td>Immediately, on screen</td><td>After the program is completed, results are <strong>printed out</strong> for the user</td></tr>
<tr><td><strong>Who submits</strong></td><td>The user</td><td>A <strong>computer operator</strong> — a human job title</td></tr>
</table>
<ul>
<li><strong>Do not read this as "old versus new".</strong> Batch is alive and enormous: nightly bank settlement, payroll, ETL jobs, CI pipelines, every <code>cron</code> entry, every Slurm job on a research cluster. The name changed to "job queue"; the model did not.</li>
<li><strong>The distinction drives the OS's whole design goal.</strong> Batch wants <em>throughput</em> — finish the most jobs per hour, nobody is waiting. Interactive wants <em>response time</em> — nobody cares about throughput if the cursor stutters. Table 9.3 on slide 18 states exactly this trade-off, and slides 19–21 show it turning into different schedulers.</li>
<li><strong>Why "batched together with programs from other users" mattered so much.</strong> A single job's setup time (mount the tape, load the compiler) was huge compared with the run. Grouping jobs of the same kind let the operator pay the setup cost once — that is the historical reason batch exists, and slide 8 tells that story.</li>
<li><strong>Connect to your own habits.</strong> Running <code>./a.out</code> and typing input is interactive. Pushing to GitHub and reading a build log twenty minutes later is batch, with the CI runner as the operator. You have used both this week.</li>
</ul>
<p class="meo">💡 One-question test: <strong>can the program ask you something while it runs?</strong> Yes → interactive. No, it must have everything up front → batch. That is why batch systems needed JCL (slide 10) — all the answers had to be written down in advance.</p>`,
        `<p class="y-chinh">🎯 Cách phân loại đầu tiên, và nó nói về <strong>AI CÓ MẶT trong lúc job chạy</strong>. Tương tác: người dùng ở đó. Theo lô: người dùng không ở đó.</p>
<table>
<tr><th></th><th>Hệ tương tác (interactive)</th><th>Hệ theo lô (batch)</th></tr>
<tr><td><strong>Định nghĩa của slide</strong></td><td>Người dùng/lập trình viên tương tác <em>TRỰC TIẾP</em> với máy để yêu cầu chạy một job hoặc thực hiện một giao dịch</td><td><em>NGƯỢC LẠI</em> với tương tác</td></tr>
<tr><td><strong>Trong lúc chạy</strong></td><td>Tuỳ ứng dụng, người dùng <em>CÓ THỂ trao đổi với máy trong khi job đang chạy</em></td><td>Chương trình của người dùng bị <strong>gộp chung thành LÔ với chương trình của người khác</strong> và do một nhân viên vận hành máy nộp vào</td></tr>
<tr><td><strong>Nhận kết quả</strong></td><td>Ngay lập tức, trên màn hình</td><td>Sau khi chương trình chạy xong, kết quả được <strong>IN RA</strong> cho người dùng</td></tr>
<tr><td><strong>Ai nộp bài</strong></td><td>Chính người dùng</td><td><strong>Nhân viên vận hành máy</strong> — một chức danh có thật</td></tr>
</table>
<ul>
<li><strong>Đừng đọc đây là "cũ với mới".</strong> Batch còn sống và còn khổng lồ: quyết toán ngân hàng ban đêm, tính lương, các job ETL, pipeline CI, mọi dòng <code>cron</code>, mọi job Slurm trên cụm máy nghiên cứu. Cái tên đổi thành "hàng đợi job"; mô hình thì không đổi.</li>
<li><strong>Phân biệt này quyết định MỤC TIÊU THIẾT KẾ của cả hệ điều hành.</strong> Batch muốn <em>THÔNG LƯỢNG</em> — xong nhiều job nhất mỗi giờ, chẳng ai ngồi chờ. Tương tác muốn <em>THỜI GIAN ĐÁP ỨNG</em> — thông lượng cao mà con trỏ giật thì vô nghĩa. Table 9.3 ở slide 18 nói đúng cái đánh đổi này, và slide 19–21 cho thấy nó biến thành hai kiểu bộ lập lịch khác nhau.</li>
<li><strong>Vì sao "gộp chung với chương trình của người khác" lại quan trọng đến thế.</strong> Thời gian CHUẨN BỊ cho một job (lắp băng từ, nạp trình biên dịch) lớn kinh khủng so với thời gian chạy. Gom các job cùng loại lại cho phép trả cái giá chuẩn bị ấy MỘT LẦN — đó là lý do lịch sử sinh ra batch, và slide 8 kể câu chuyện đó.</li>
<li><strong>Nối sang thói quen của chính bạn.</strong> Chạy <code>./a.out</code> rồi gõ dữ liệu vào là tương tác. Push lên GitHub rồi hai mươi phút sau đọc log build là batch, với cái CI runner đóng vai nhân viên vận hành. Tuần này bạn đã dùng cả hai.</li>
</ul>
<p class="meo">💡 Kiểm bằng một câu hỏi: <strong>chương trình có hỏi bạn được gì trong lúc chạy không?</strong> Có → tương tác. Không, phải đưa đủ mọi thứ từ đầu → theo lô. Đó chính là lý do hệ batch cần JCL (slide 10) — mọi câu trả lời phải viết sẵn từ trước.</p>`],

      [8, 'Early Systems — the machine before there was an OS',
        `<p class="y-chinh">🎯 From the <strong>late 1940s to the mid-1950s</strong> the programmer interacted directly with the hardware — <strong>there was no OS</strong>. Processors were run from a <strong>console of display lights, toggle switches, some input device and a printer</strong>. The slide then names the two problems that forced an OS into existence: <strong>scheduling</strong> and <strong>setup time</strong>.</p>
<table>
<tr><th>Problem</th><th>What the slide says</th><th>What it cost</th></tr>
<tr><td rowspan="2"><strong>Scheduling</strong></td><td><strong>Sign-up sheets</strong> were used to reserve processor time</td><td>A human booking system for the most expensive object in the building</td></tr>
<tr><td>If the user finished early → <strong>wasted idle time</strong>; if problems occurred → the user could be <strong>forced to stop before resolving the problem</strong></td><td>Either the machine sits idle, or your debugging session is cut off mid-bug</td></tr>
<tr><td rowspan="1"><strong>Setup time</strong></td><td>A single program could involve: <strong>loading the compiler plus the source program into memory · saving the compiled program · loading and linking together the object program and common functions</strong></td><td>Minutes of tape mounting per job, often longer than the job itself</td></tr>
</table>
<ul>
<li><strong>Read the sign-up sheet as a scheduler made of paper.</strong> Everything slides 19–21 will call "long-term scheduling" was, in 1950, a clipboard on the wall. The OS did not invent scheduling — it <em>automated</em> a job humans were already doing badly.</li>
<li><strong>Both problems have the same shape: the machine is idle while a human does something.</strong> Idle because the previous booking ended early; idle while tapes are mounted; idle while the programmer thinks. In an era where the computer cost more than the building, idleness was the only metric that mattered.</li>
<li><strong>Why "forced to stop before resolving the problem" is worth a moment.</strong> It describes debugging with a stopwatch running. It also explains why <em>batch</em> won: submit your deck, go away, get a printout. You lose interactivity and gain a machine that never waits for a human.</li>
<li><strong>The fix is the resident monitor</strong> — a small program that stays in memory and starts the next job the instant the previous one ends. Slide 9 draws it, slide 10 explains how it works. The entire history of operating systems starts as "software to stop the machine being idle".</li>
</ul>
<p class="meo">💡 Keep the era's economics in mind and every design choice becomes obvious: <strong>hardware was priceless, people were cheap</strong>. Today it is exactly reversed, which is why modern OS design optimises for <em>response time and developer convenience</em> rather than utilisation.</p>`,
        `<p class="y-chinh">🎯 Từ <strong>cuối thập niên 1940 tới giữa 1950</strong>, lập trình viên tương tác thẳng với phần cứng — <strong>KHÔNG có hệ điều hành</strong>. Bộ xử lý được điều khiển từ một <strong>bàn console gồm đèn báo, công tắc gạt, một thiết bị nhập nào đó và một máy in</strong>. Rồi slide gọi tên hai vấn đề đã ép hệ điều hành phải ra đời: <strong>LẬP LỊCH</strong> và <strong>THỜI GIAN CHUẨN BỊ</strong>.</p>
<table>
<tr><th>Vấn đề</th><th>Slide nói gì</th><th>Nó tốn cái gì</th></tr>
<tr><td rowspan="2"><strong>Lập lịch</strong></td><td>Dùng <strong>TỜ ĐĂNG KÝ</strong> để giữ chỗ thời gian bộ xử lý</td><td>Một hệ thống đặt chỗ bằng tay cho vật đắt nhất trong toà nhà</td></tr>
<tr><td>Người dùng xong sớm → <strong>máy nằm không, lãng phí</strong>; gặp trục trặc → người dùng có thể <strong>bị buộc dừng trước khi kịp gỡ xong lỗi</strong></td><td>Hoặc máy ngồi chơi, hoặc buổi gỡ lỗi của bạn bị cắt giữa chừng</td></tr>
<tr><td rowspan="1"><strong>Thời gian chuẩn bị</strong></td><td>Một chương trình có thể phải: <strong>nạp trình biên dịch cùng mã nguồn vào bộ nhớ · lưu lại chương trình đã dịch · nạp rồi liên kết chương trình đối tượng với các hàm dùng chung</strong></td><td>Hàng phút lắp băng từ cho mỗi job, thường lâu hơn cả thời gian chạy</td></tr>
</table>
<ul>
<li><strong>Hãy đọc tờ đăng ký như một BỘ LẬP LỊCH LÀM BẰNG GIẤY.</strong> Mọi thứ mà slide 19–21 sẽ gọi là "lập lịch dài hạn" thì năm 1950 là một cái kẹp giấy treo tường. Hệ điều hành không phát minh ra lập lịch — nó <em>TỰ ĐỘNG HOÁ</em> một việc con người vốn đã làm, và làm tệ.</li>
<li><strong>Cả hai vấn đề cùng một hình dạng: máy nằm không trong lúc con người làm gì đó.</strong> Nằm không vì suất trước kết thúc sớm; nằm không trong lúc lắp băng; nằm không trong lúc lập trình viên ngồi nghĩ. Ở thời máy tính đắt hơn cả toà nhà, THỜI GIAN CHẾT là chỉ số duy nhất đáng quan tâm.</li>
<li><strong>Vì sao câu "bị buộc dừng trước khi gỡ xong lỗi" đáng dừng lại một nhịp.</strong> Nó mô tả cảnh gỡ lỗi với đồng hồ bấm giờ đang chạy. Nó cũng giải thích vì sao <em>BATCH</em> thắng: nộp cọc bìa đục lỗ, đi chỗ khác, quay lại lấy bản in. Bạn mất tính tương tác và được lại một cái máy không bao giờ ngồi chờ người.</li>
<li><strong>Lời giải là MONITOR THƯỜNG TRÚ</strong> — một chương trình nhỏ nằm lì trong bộ nhớ và khởi động job kế tiếp ngay khi job trước vừa dứt. Slide 9 vẽ nó, slide 10 giải thích nó chạy ra sao. Toàn bộ lịch sử hệ điều hành bắt đầu bằng "phần mềm để máy đừng nằm không".</li>
</ul>
<p class="meo">💡 Giữ trong đầu bài toán kinh tế của thời đó thì mọi lựa chọn thiết kế đều hiện ra hiển nhiên: <strong>phần cứng vô giá, con người thì rẻ</strong>. Ngày nay hoàn toàn ngược lại, nên thiết kế OS hiện đại tối ưu cho <em>thời gian đáp ứng và sự tiện lợi của lập trình viên</em> chứ không phải cho mức dùng tài nguyên.</p>`],

      [9, 'Figure 9.3 — Memory Layout for a Resident Monitor',
        `<p class="y-chinh">🎯 Memory split by one horizontal line labelled <strong>Boundary</strong>. Above it, four stacked strips braced together as the <strong>Monitor</strong>: <strong>Interrupt Processing · Device Drivers · Job Sequencing · Control Language Interpreter</strong>. Below it, one large empty block: the <strong>User Program Area</strong>.</p>
<table>
<tr><th>Strip (top to bottom)</th><th>Its job</th><th>Survives today as</th></tr>
<tr><td><strong>Interrupt Processing</strong></td><td>Handle the signals that give the monitor the processor back</td><td>Interrupt vector table + ISRs in every kernel</td></tr>
<tr><td><strong>Device Drivers</strong></td><td>Know the individual quirks of each tape, card reader, printer</td><td>The driver model — still the biggest part of a kernel by line count</td></tr>
<tr><td><strong>Job Sequencing</strong></td><td>Decide and start the next job when this one ends</td><td>The scheduler (slides 19–21)</td></tr>
<tr><td><strong>Control Language Interpreter</strong></td><td>Read and obey the JCL cards that came with the deck</td><td>The shell / command interpreter</td></tr>
</table>
<ul>
<li><strong>The boundary line is the first memory management in history.</strong> One address separates "mine" from "yours". Later in the deck this same line becomes base and limit registers, then partitions (slide 28), then paging — but the idea never changes: <em>a hardware-checked line the user program may not cross</em>.</li>
<li><strong>Notice the monitor is at the BOTTOM of the address space (drawn at top of the figure) and the user area is one contiguous block.</strong> That is deliberate: a single boundary register can then implement the whole protection scheme — "any user address below B is illegal". One comparator, complete protection.</li>
<li><strong>The four strips are a kernel in miniature.</strong> Modern Linux has the same four responsibilities, in vastly larger form: interrupt handling, drivers, scheduling, and a user command interface. If you can name these four you can read the block diagram of any OS.</li>
<li><strong>Why "resident" is the load-bearing word.</strong> Resident = always in memory, never swapped out, costs you RAM you cannot use for your program. Every byte of monitor is a byte the user program does not get — the first version of a trade-off that never goes away (slide 28's "fixed partitioning" wastes memory the same way).</li>
</ul>
<p class="pitfall">⚠️ Drawing trap: on this figure the monitor is at the <em>top</em> of the picture. Do not conclude it is at high addresses. Memory diagrams in this book are drawn with low addresses at the top; the boundary arrow points at the monitor's <strong>upper limit</strong>, which is the user area's <strong>lower</strong> bound. Always check which end of the picture is address 0 before answering an address question.</p>`,
        `<p class="y-chinh">🎯 Bộ nhớ bị cắt bởi một đường ngang ghi <strong>Boundary</strong> (ranh giới). Phía trên là bốn dải xếp chồng, được ngoặc chung lại thành <strong>Monitor</strong>: <strong>Interrupt Processing · Device Drivers · Job Sequencing · Control Language Interpreter</strong>. Phía dưới là một khối lớn để trống: <strong>User Program Area</strong> — vùng chương trình người dùng.</p>
<table>
<tr><th>Dải (từ trên xuống)</th><th>Việc của nó</th><th>Ngày nay còn sống dưới tên</th></tr>
<tr><td><strong>Interrupt Processing</strong></td><td>Xử lý các tín hiệu trả bộ xử lý về cho monitor</td><td>Bảng vector ngắt + các ISR trong mọi nhân</td></tr>
<tr><td><strong>Device Drivers</strong></td><td>Biết tính nết riêng của từng ổ băng, đầu đọc bìa, máy in</td><td>Mô hình driver — vẫn là phần dài dòng nhất của một nhân</td></tr>
<tr><td><strong>Job Sequencing</strong></td><td>Quyết định và khởi động job kế tiếp khi job này xong</td><td>Bộ lập lịch (slide 19–21)</td></tr>
<tr><td><strong>Control Language Interpreter</strong></td><td>Đọc và thi hành các thẻ JCL đi kèm cọc bìa</td><td>Shell / trình thông dịch lệnh</td></tr>
</table>
<ul>
<li><strong>Đường ranh giới là phép QUẢN LÝ BỘ NHỚ đầu tiên trong lịch sử.</strong> Một địa chỉ phân tách "của tôi" với "của anh". Về sau trong deck, chính đường này thành thanh ghi base và limit, rồi thành phân vùng (slide 28), rồi thành phân trang — nhưng ý tưởng không đổi: <em>một lằn ranh do phần cứng canh, chương trình người dùng không được vượt qua</em>.</li>
<li><strong>Để ý monitor nằm ở ĐÁY không gian địa chỉ (vẽ ở phía trên của hình) và vùng người dùng là MỘT khối liền.</strong> Đó là cố ý: khi ấy chỉ cần một thanh ghi ranh giới là đủ cài đặt toàn bộ cơ chế bảo vệ — "địa chỉ người dùng nào nhỏ hơn B đều là trái phép". Một bộ so sánh, bảo vệ trọn vẹn.</li>
<li><strong>Bốn dải đó là một cái nhân thu nhỏ.</strong> Linux hiện đại vẫn đúng bốn trách nhiệm ấy, chỉ là đồ sộ hơn vô cùng: xử lý ngắt, driver, lập lịch, và giao diện lệnh cho người dùng. Gọi được tên bốn cái này thì bạn đọc được sơ đồ khối của bất kỳ hệ điều hành nào.</li>
<li><strong>Vì sao chữ "thường trú" (resident) mới là chữ chịu lực.</strong> Thường trú = luôn nằm trong bộ nhớ, không bao giờ bị đẩy ra, tốn của bạn phần RAM mà chương trình không dùng được. Mỗi byte của monitor là một byte chương trình người dùng không có — phiên bản đầu tiên của một sự đánh đổi không bao giờ biến mất (kiểu "phân vùng cố định" ở slide 28 cũng phí bộ nhớ y như vậy).</li>
</ul>
<p class="pitfall">⚠️ Bẫy đọc hình: trên hình này monitor nằm ở <em>PHÍA TRÊN</em> bức tranh. Đừng vội kết luận nó ở địa chỉ cao. Sơ đồ bộ nhớ trong sách này vẽ địa chỉ THẤP ở trên; mũi tên Boundary trỏ vào <strong>giới hạn TRÊN</strong> của monitor, tức là cận <strong>DƯỚI</strong> của vùng người dùng. Luôn kiểm xem đầu nào của hình là địa chỉ 0 trước khi trả lời câu hỏi về địa chỉ.</p>`],

      [10, 'From the View of the Processor — how the monitor actually works, and JCL',
        `<p class="y-chinh">🎯 The same picture told from the processor's chair, where there is <strong>no "operating system" at all — only instructions coming from two different regions of memory</strong>.</p>
<ul>
<li><strong>The cycle, in the slide's own words.</strong> The processor executes instructions from the part of main memory containing the <em>monitor</em> → those instructions cause the next job to be read into <em>another part</em> of main memory → the processor executes instructions in the <em>user's program</em> until it hits an ending or an error condition → either event causes the processor to fetch its next instruction from the <em>monitor</em> again. Round and round.</li>
<li><strong>The last line of the slide is the thesis.</strong> "Monitor, or batch OS, is simply a computer program. It <strong>relies on the ability of the processor to fetch instructions from various portions of main memory in order to seize and relinquish control alternately</strong>." Seize and relinquish — the same two verbs as slide 5.</li>
<li><strong>The monitor "handles setup and scheduling", and a batch of jobs is queued up and executed as rapidly as possible with no idle time.</strong> Compare with slide 8: the sign-up sheet and the manual tape mounting are both now inside a program. That is the entire gain.</li>
<li><strong>JCL — job control language</strong> — is a <em>special type of programming language used to provide instructions to the monitor</em>. Not to the computer: <strong>to the monitor</strong>. It is the first language whose audience is the OS, and its direct descendants are the shell script, the Makefile, and the CI YAML file you write today.</li>
</ul>
<table>
<tr><th>JCL card on the slide</th><th>What it tells the monitor to do</th></tr>
<tr><td><code>$JOB</code></td><td>A new job starts here — set up accounting, reset the boundary</td></tr>
<tr><td><code>$FTN</code></td><td>Load the FORTRAN compiler and compile what follows</td></tr>
<tr><td><em>…some Fortran instructions…</em></td><td>The source program, one statement per punched card</td></tr>
<tr><td><code>$LOAD</code></td><td>Load the compiled object program (and link common functions)</td></tr>
<tr><td><code>$RUN</code></td><td>Transfer control to the user program</td></tr>
<tr><td><em>…some data…</em></td><td>The program's input, also one item per card</td></tr>
<tr><td><code>$END</code></td><td>Job finished — monitor takes back control</td></tr>
</table>
<p class="dap-an">✅ Đáp án — reading the deck: every line beginning with <code>$</code> is for the <strong>monitor</strong>; every line without one is for the <strong>compiler or the program</strong>. That single convention (a marker character that means "this line is for the system") is still how <code>#!/bin/bash</code>, <code>#include</code> and <code>@Directive</code> work.</p>
<p class="pitfall">⚠️ The extracted slide text ends with "**Each FORTRAN instruction and each item of data is on a separate punched card or a separate record on tape…". That is the <strong>speaker's note</strong> attached to the slide, not projected content — the double asterisk is the note marker. Worth knowing so you do not quote it as a slide bullet.</p>`,
        `<p class="y-chinh">🎯 Vẫn bức tranh ấy nhưng kể từ ghế của BỘ XỬ LÝ, nơi <strong>chẳng có "hệ điều hành" nào cả — chỉ có các lệnh đến từ hai vùng bộ nhớ khác nhau</strong>.</p>
<ul>
<li><strong>Vòng lặp, đúng theo lời slide.</strong> Bộ xử lý thực thi lệnh từ phần bộ nhớ chứa <em>MONITOR</em> → các lệnh đó khiến job kế tiếp được đọc vào <em>MỘT PHẦN KHÁC</em> của bộ nhớ → bộ xử lý thực thi lệnh trong <em>CHƯƠNG TRÌNH NGƯỜI DÙNG</em> cho tới khi gặp điều kiện KẾT THÚC hoặc LỖI → cả hai sự kiện đó đều khiến bộ xử lý lấy lệnh kế tiếp từ <em>MONITOR</em> trở lại. Cứ thế quay vòng.</li>
<li><strong>Dòng cuối slide mới là luận điểm.</strong> "Monitor, hay OS theo lô, đơn giản là một chương trình máy tính. Nó <strong>dựa vào khả năng của bộ xử lý lấy lệnh từ những phần khác nhau của bộ nhớ chính để GIÀNH và NHƯỜNG quyền điều khiển luân phiên</strong>." Giành và nhường — đúng hai động từ của slide 5.</li>
<li><strong>Monitor "lo phần chuẩn bị và lập lịch", và một lô job được xếp hàng rồi chạy nhanh hết mức, không có thời gian chết.</strong> So với slide 8: tờ đăng ký và việc lắp băng bằng tay giờ đều nằm bên trong một chương trình. Đó là toàn bộ cái lợi.</li>
<li><strong>JCL — ngôn ngữ điều khiển job</strong> — là <em>một loại ngôn ngữ lập trình đặc biệt dùng để ra chỉ thị cho MONITOR</em>. Không phải cho máy tính: <strong>cho monitor</strong>. Đây là ngôn ngữ đầu tiên mà người nghe là hệ điều hành, và hậu duệ trực tiếp của nó là script shell, Makefile, và cái file YAML của CI mà bạn viết hôm nay.</li>
</ul>
<table>
<tr><th>Thẻ JCL trên slide</th><th>Nó bảo monitor làm gì</th></tr>
<tr><td><code>$JOB</code></td><td>Một job mới bắt đầu từ đây — mở sổ thống kê, đặt lại ranh giới</td></tr>
<tr><td><code>$FTN</code></td><td>Nạp trình biên dịch FORTRAN và dịch phần ngay sau đó</td></tr>
<tr><td><em>…vài lệnh Fortran…</em></td><td>Mã nguồn, mỗi câu lệnh một tấm bìa đục lỗ</td></tr>
<tr><td><code>$LOAD</code></td><td>Nạp chương trình đối tượng đã dịch (và liên kết các hàm dùng chung)</td></tr>
<tr><td><code>$RUN</code></td><td>Chuyển quyền điều khiển sang chương trình người dùng</td></tr>
<tr><td><em>…vài dòng dữ liệu…</em></td><td>Dữ liệu vào của chương trình, cũng mỗi mục một tấm bìa</td></tr>
<tr><td><code>$END</code></td><td>Job xong — monitor lấy lại quyền</td></tr>
</table>
<p class="dap-an">✅ Đáp án — cách đọc cọc bìa: mọi dòng bắt đầu bằng <code>$</code> là nói với <strong>MONITOR</strong>; mọi dòng không có ký tự đó là nói với <strong>trình biên dịch hoặc chương trình</strong>. Đúng quy ước ấy (một ký tự đánh dấu nghĩa là "dòng này dành cho hệ thống") tới nay vẫn là cách <code>#!/bin/bash</code>, <code>#include</code> và <code>@Directive</code> hoạt động.</p>
<p class="pitfall">⚠️ Bản trích chữ của slide kết thúc bằng "**Each FORTRAN instruction and each item of data is on a separate punched card…". Đó là <strong>GHI CHÚ GIẢNG VIÊN</strong> gắn kèm slide, không phải nội dung được chiếu — hai dấu sao là dấu hiệu của ghi chú. Biết để khỏi trích nhầm nó thành một gạch đầu dòng của slide.</p>`],

      [11, 'Desirable Hardware Features — the four things an OS cannot be built without',
        `<p class="y-chinh">🎯 <strong>The most architecture-relevant slide in the chapter.</strong> Four hardware features, each one the answer to a specific way a user program could otherwise destroy the system.</p>
<table>
<tr><th>Feature</th><th>The slide's words</th><th>The attack it blocks</th></tr>
<tr><td><strong>Memory protection</strong></td><td>User program must not alter the memory area containing the monitor. The processor hardware should <strong>detect an error and transfer control to the monitor</strong>; the monitor aborts the job, prints an error message, and loads the next job</td><td>A stray pointer overwrites the OS and the machine dies</td></tr>
<tr><td><strong>Timer</strong></td><td>Used to prevent a job from <strong>monopolising the system</strong>. If the timer expires an <strong>interrupt occurs and control returns to the monitor</strong></td><td><code>while(1);</code> — an infinite loop that never yields</td></tr>
<tr><td><strong>Privileged instructions</strong></td><td>Can <strong>only be executed by the monitor</strong>. If the processor encounters such an instruction while executing a user program, an <strong>error interrupt occurs</strong>. <strong>I/O instructions are privileged</strong> so the monitor retains control of all I/O devices</td><td>A program reads another user's file straight off the disk controller</td></tr>
<tr><td><strong>Interrupts</strong></td><td>Gives the OS <strong>more flexibility in relinquishing control to and regaining control from</strong> user programs</td><td>The general mechanism the other three are built on</td></tr>
</table>
<ul>
<li><strong>Every row is the same sentence in different clothes: "the hardware must be able to take the processor away from the user program".</strong> Protection takes it on a bad address, the timer takes it on time, privileged instructions take it on a forbidden opcode, interrupts are the delivery van for all three.</li>
<li><strong>Privileged instructions imply a mode bit.</strong> The processor must know, at every instant, whether it is running OS code or user code — one bit in the status register. Two consequences follow: entering the OS must <em>set</em> that bit, and the only way to set it must itself be controlled. That is exactly what a system call (a deliberate trap) is.</li>
<li><strong>"I/O instructions are privileged" is why everything must go through the OS.</strong> It is not politeness — a user program physically cannot issue an <code>IN</code>/<code>OUT</code>. This is the hardware root of file permissions, of process isolation, of the whole idea that your program lives in a sandbox.</li>
<li><strong>The timer is the feature students underrate.</strong> Without it there is no pre-emption, and without pre-emption there is no time sharing (slide 17), no fair scheduling, no responsive desktop. One counter that decrements and raises an interrupt at zero buys the entire interactive computing era.</li>
<li><strong>Connect back to Ch.3 and forward to CSI106.</strong> Ch.3's interrupt cycle — check for interrupt after each instruction — was presented as an I/O efficiency trick. Here it is revealed as the OS's lifeline. CSI106 told you an OS "manages processes"; this slide tells you which four transistor-level features make that possible.</li>
</ul>
<p class="meo">💡 Mnemonic — <strong>P·T·P·I</strong>: <em>Protection</em> (where you may write), <em>Timer</em> (how long you may run), <em>Privilege</em> (what you may execute), <em>Interrupts</em> (how the OS is told). Space, time, authority, notification.</p>`,
        `<p class="y-chinh">🎯 <strong>Slide dính tới KIẾN TRÚC nhất của cả chương.</strong> Bốn tính năng phần cứng, mỗi cái là câu trả lời cho một cách cụ thể mà chương trình người dùng có thể phá nát hệ thống nếu không có nó.</p>
<table>
<tr><th>Tính năng</th><th>Nguyên văn slide</th><th>Nó chặn đòn nào</th></tr>
<tr><td><strong>Bảo vệ bộ nhớ</strong></td><td>Chương trình người dùng KHÔNG được sửa vùng nhớ chứa monitor. Phần cứng bộ xử lý phải <strong>phát hiện lỗi và chuyển quyền về monitor</strong>; monitor huỷ job, in thông báo lỗi, rồi nạp job kế tiếp</td><td>Một con trỏ lạc ghi đè lên OS và cả máy chết</td></tr>
<tr><td><strong>Bộ đếm thời gian</strong></td><td>Dùng để ngăn một job <strong>ĐỘC CHIẾM hệ thống</strong>. Bộ đếm hết giờ thì <strong>một ngắt xảy ra và quyền điều khiển quay về monitor</strong></td><td><code>while(1);</code> — vòng lặp vô hạn không bao giờ nhường</td></tr>
<tr><td><strong>Lệnh đặc quyền</strong></td><td><strong>CHỈ monitor mới được thực thi</strong>. Nếu bộ xử lý gặp lệnh loại đó trong lúc đang chạy chương trình người dùng, <strong>một ngắt lỗi xảy ra</strong>. <strong>Lệnh I/O là lệnh đặc quyền</strong> để monitor giữ quyền kiểm soát mọi thiết bị I/O</td><td>Một chương trình đọc thẳng tệp của người khác qua bộ điều khiển đĩa</td></tr>
<tr><td><strong>Ngắt</strong></td><td>Cho OS <strong>linh hoạt hơn khi NHƯỜNG quyền cho và LẤY LẠI quyền từ</strong> chương trình người dùng</td><td>Là cơ chế tổng quát mà ba cái trên đều dựng trên nó</td></tr>
</table>
<ul>
<li><strong>Mỗi dòng đều là cùng một câu, chỉ khác áo: "phần cứng phải LẤY ĐƯỢC bộ xử lý khỏi tay chương trình người dùng".</strong> Bảo vệ lấy khi ghi sai địa chỉ, bộ đếm lấy khi hết giờ, lệnh đặc quyền lấy khi gặp mã lệnh cấm, còn ngắt là chiếc xe giao hàng cho cả ba.</li>
<li><strong>Lệnh đặc quyền kéo theo một BIT CHẾ ĐỘ.</strong> Bộ xử lý phải biết ở mọi thời điểm rằng nó đang chạy mã OS hay mã người dùng — một bit trong thanh ghi trạng thái. Hai hệ quả: vào OS thì phải ĐẶT bit đó, và cách duy nhất để đặt nó cũng phải có kiểm soát. Đó chính xác là lời gọi hệ thống (một cú bẫy cố ý).</li>
<li><strong>"Lệnh I/O là lệnh đặc quyền" là lý do mọi thứ phải đi qua OS.</strong> Không phải vì lịch sự — chương trình người dùng VỀ MẶT VẬT LÝ không phát ra được lệnh <code>IN</code>/<code>OUT</code>. Đây là cái gốc phần cứng của quyền truy cập tệp, của việc cô lập tiến trình, của toàn bộ ý niệm rằng chương trình của bạn sống trong một cái hộp cát.</li>
<li><strong>Bộ đếm thời gian là thứ sinh viên hay coi nhẹ.</strong> Không có nó thì không có cướp quyền, không cướp quyền thì không có chia sẻ thời gian (slide 17), không có lập lịch công bằng, không có màn hình phản hồi mượt. Một bộ đếm lùi rồi phát ngắt khi về 0 đã mua trọn cả kỷ nguyên máy tính tương tác.</li>
<li><strong>Nối ngược Ch.3 và nối sang CSI106.</strong> Chu trình ngắt của Ch.3 — kiểm tra ngắt sau mỗi lệnh — hồi đó được giới thiệu như mẹo tăng hiệu suất I/O. Ở đây nó lộ ra là ĐƯỜNG SỐNG của hệ điều hành. CSI106 bảo bạn OS "quản lý tiến trình"; slide này chỉ ra đúng bốn tính năng ở mức transistor khiến điều đó khả thi.</li>
</ul>
<p class="meo">💡 Mẹo nhớ — <strong>P·T·P·I</strong>: <em>Protection</em> (được ghi ở ĐÂU), <em>Timer</em> (được chạy BAO LÂU), <em>Privilege</em> (được thực thi CÁI GÌ), <em>Interrupts</em> (báo cho OS BẰNG GÌ). Không gian, thời gian, thẩm quyền, thông báo.</p>`],

      [12, 'Figure 9.4 — System Utilization Example',
        `<p class="y-chinh">🎯 Seven numbers that justify the whole rest of the chapter. A single job does: <strong>read one record from file = 15 µs · execute 100 instructions = 1 µs · write one record to file = 15 µs · TOTAL = 31 µs</strong>. Therefore <strong>percent CPU utilization = 1/31 = 0.032 = 3.2 %</strong>.</p>
<table>
<tr><th>Step</th><th>Time</th><th>Who is busy</th><th>Share of the 31 µs</th></tr>
<tr><td>Read one record from file</td><td>15 µs</td><td>Disk / I/O module</td><td>48,4 %</td></tr>
<tr><td>Execute 100 instructions</td><td>1 µs</td><td><strong>Processor</strong></td><td><strong>3,2 %</strong></td></tr>
<tr><td>Write one record to file</td><td>15 µs</td><td>Disk / I/O module</td><td>48,4 %</td></tr>
<tr><td><strong>TOTAL</strong></td><td><strong>31 µs</strong></td><td>—</td><td>100 %</td></tr>
</table>
<p class="dap-an">✅ Đáp án: 15 + 1 + 15 = 31 µs. CPU utilization = 1/31 = 0,032258… → <strong>3,2 %</strong> (verified with python3, matches the slide exactly). Said another way: the processor is <strong>idle 96,8 % of the time</strong>, and 100 instructions in 1 µs means this machine runs at 100 MIPS.</p>
<ul>
<li><strong>The point is not the arithmetic, it is the shape.</strong> Nothing here is badly written or badly engineered. A perfectly ordinary I/O-bound job — read, compute a little, write — leaves the most expensive component in the building unused for 30 of every 31 microseconds.</li>
<li><strong>Now connect it to Amdahl's law from Ch.2.</strong> The processor is the part of the work with fraction <em>f</em> = 1/31. Speed it up by factor <em>k</em> and the total speedup is 1/((1−f) + f/k). Verified: <strong>k = 2 → 1,0164× · k = 10 → 1,0299× · k = 100 → 1,0330× · k = ∞ → 1,0333×</strong>. <strong>An infinitely fast processor makes this job 3,3 % faster.</strong> Buying a faster CPU is the wrong purchase.</li>
<li><strong>So what IS the right move?</strong> Not to make the 1 µs shorter, but to <em>fill the 30 µs</em> with somebody else's work. That is multiprogramming, and it is the subject of the next four slides. Amdahl says "stop optimising the small part"; multiprogramming says "then use the idle part".</li>
<li><strong>Why 15 µs for a disk record is realistic and still is.</strong> Even an NVMe SSD needs tens of microseconds; a spinning disk needs milliseconds. Processors got thousands of times faster than storage, so this ratio has got <em>worse</em> since the figure was drawn, not better.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "percent CPU utilization" here means <em>CPU busy time ÷ elapsed time</em>, not "how much of the CPU's capacity a program used". Also note the slide computes it for <strong>one job alone</strong> — with several jobs the denominator stays 31 µs but the numerator grows, which is exactly the trick of slide 13.</p>`,
        `<p class="y-chinh">🎯 Bảy con số biện minh cho toàn bộ phần còn lại của chương. Một job làm: <strong>đọc một bản ghi từ tệp = 15 µs · chạy 100 lệnh = 1 µs · ghi một bản ghi ra tệp = 15 µs · TỔNG = 31 µs</strong>. Do đó <strong>mức dùng CPU = 1/31 = 0,032 = 3,2 %</strong>.</p>
<table>
<tr><th>Bước</th><th>Thời gian</th><th>Ai đang bận</th><th>Chiếm bao nhiêu của 31 µs</th></tr>
<tr><td>Đọc một bản ghi từ tệp</td><td>15 µs</td><td>Đĩa / mô-đun I/O</td><td>48,4 %</td></tr>
<tr><td>Chạy 100 lệnh</td><td>1 µs</td><td><strong>Bộ xử lý</strong></td><td><strong>3,2 %</strong></td></tr>
<tr><td>Ghi một bản ghi ra tệp</td><td>15 µs</td><td>Đĩa / mô-đun I/O</td><td>48,4 %</td></tr>
<tr><td><strong>TỔNG</strong></td><td><strong>31 µs</strong></td><td>—</td><td>100 %</td></tr>
</table>
<p class="dap-an">✅ Đáp án: 15 + 1 + 15 = 31 µs. Mức dùng CPU = 1/31 = 0,032258… → <strong>3,2 %</strong> (đã kiểm bằng python3, khớp đúng con số in trên slide). Nói cách khác: bộ xử lý <strong>NẰM KHÔNG 96,8 % thời gian</strong>, và 100 lệnh trong 1 µs nghĩa là máy này chạy 100 MIPS.</p>
<ul>
<li><strong>Điểm mấu chốt không phải phép tính, mà là HÌNH DẠNG của nó.</strong> Ở đây không có gì viết ẩu hay thiết kế kém cả. Một job I/O bình thường nhất trần đời — đọc, tính một chút, ghi — đã để linh kiện đắt nhất toà nhà ngồi chơi 30 trên mỗi 31 micro giây.</li>
<li><strong>Bây giờ nối vào ĐỊNH LUẬT AMDAHL của Ch.2.</strong> Phần việc của bộ xử lý chiếm tỉ lệ <em>f</em> = 1/31. Tăng tốc nó lên <em>k</em> lần thì tăng tốc toàn cục là 1/((1−f) + f/k). Đã kiểm: <strong>k = 2 → 1,0164× · k = 10 → 1,0299× · k = 100 → 1,0330× · k = ∞ → 1,0333×</strong>. <strong>Một bộ xử lý NHANH VÔ HẠN chỉ làm job này nhanh hơn 3,3 %.</strong> Mua CPU xịn hơn là mua nhầm món.</li>
<li><strong>Vậy nước đi ĐÚNG là gì?</strong> Không phải rút ngắn 1 µs kia, mà <em>LẤP ĐẦY 30 µs</em> bằng việc của người khác. Đó là ĐA CHƯƠNG TRÌNH, đề tài của bốn slide kế tiếp. Amdahl nói "thôi đừng tối ưu phần nhỏ nữa"; đa chương trình nói "vậy thì dùng phần đang rảnh đi".</li>
<li><strong>Vì sao 15 µs cho một bản ghi đĩa là thực tế, và nay vẫn thế.</strong> Ngay cả SSD NVMe cũng cần hàng chục micro giây; đĩa quay cần hàng mili giây. Bộ xử lý nhanh hơn thiết bị lưu trữ hàng nghìn lần, nên tỉ lệ này từ lúc vẽ hình tới giờ còn <em>TỆ ĐI</em> chứ không khá lên.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "percent CPU utilization" ở đây nghĩa là <em>thời gian CPU bận ÷ thời gian trôi qua</em>, không phải "chương trình dùng bao nhiêu phần năng lực CPU". Và để ý slide tính cho <strong>MỘT job đứng một mình</strong> — có nhiều job thì mẫu số vẫn 31 µs nhưng tử số lớn lên, đúng là mẹo của slide 13.</p>`],

      [13, 'Figure 9.5 — Multiprogramming Example (and the 1 − p^n formula)',
        `<p class="y-chinh">🎯 Three timelines stacked. <strong>(a) Uniprogramming:</strong> Program A alternates <em>Run · Wait · Run · Wait</em> — the Run boxes are tiny, the Wait stretches are wide. <strong>(b) Multiprogramming with two programs:</strong> A and B, plus a "Combined" row where B's Run slots slide into A's Wait gaps. <strong>(c) Multiprogramming with three programs:</strong> the Combined row now shows Run A · Run B · Run C back to back before any Wait appears.</p>
<ul>
<li><strong>Read the Combined row and nothing else.</strong> That row is the processor's own diary. In (a) it is mostly blank; in (b) it has two entries per burst; in (c) three. The programs did not get faster — the <em>machine</em> got busier.</li>
<li><strong>The elapsed time of each individual program does not shrink.</strong> Look carefully: A's second Run starts at the same place in all three panels. Multiprogramming buys <em>throughput</em>, not <em>latency</em>. This is the single most misread point of the chapter.</li>
<li><strong>The formula the figure implies, and which the exam loves.</strong> Suppose each process spends a fraction <strong>p</strong> of its time waiting for I/O. With <em>n</em> independent processes in memory, all of them are waiting at the same time with probability p<sup>n</sup>, so <strong>CPU utilization ≈ 1 − p<sup>n</sup></strong>.</li>
</ul>
<table>
<tr><th>n (processes)</th><th>p = 0,2 (compute-bound)</th><th>p = 0,5 (mixed)</th><th>p = 0,8 (I/O-bound)</th></tr>
<tr><td>1</td><td>80,0 %</td><td>50,0 %</td><td>20,0 %</td></tr>
<tr><td>2</td><td>96,0 %</td><td>75,0 %</td><td>36,0 %</td></tr>
<tr><td>3</td><td>99,2 %</td><td>87,5 %</td><td>48,8 %</td></tr>
<tr><td>4</td><td>99,8 %</td><td>93,8 %</td><td>59,0 %</td></tr>
<tr><td>5</td><td>100,0 %</td><td>96,9 %</td><td>67,2 %</td></tr>
<tr><td>6</td><td>100,0 %</td><td>98,4 %</td><td>73,8 %</td></tr>
<tr><td>7</td><td>100,0 %</td><td>99,2 %</td><td>79,0 %</td></tr>
<tr><td>8</td><td>100,0 %</td><td>99,6 %</td><td>83,2 %</td></tr>
<tr><td>9</td><td>100,0 %</td><td>99,8 %</td><td>86,6 %</td></tr>
<tr><td>10</td><td>100,0 %</td><td>99,9 %</td><td>89,3 %</td></tr>
</table>
<p class="dap-an">✅ Đáp án — processes needed to reach 90 % CPU utilization: <strong>p = 0,2 → n = 2 (96,0 %) · p = 0,5 → n = 4 (93,8 %) · p = 0,8 → n = 11 (91,4 %) · p = 0,9 → n = 22 (90,2 %)</strong>. All verified with python3. <strong>The more a workload waits on I/O, the more processes you must keep in memory to keep the CPU busy</strong> — and the requirement grows very fast, which is why the degree of multiprogramming is a memory problem (slide 21) before it is a CPU problem.</p>
<ul>
<li><strong>Feed the figure from slide 12 into this formula.</strong> There p = 30/31 = 0,968. Then n = 10 → 27,96 % · n = 20 → 48,1 % · n = 50 → 80,6 % · n = 100 → 96,2 %. To saturate that processor you need about a hundred concurrent jobs — which is exactly why real servers run hundreds of threads.</li>
<li><strong>Connect back to Amdahl (Ch.2) one more time.</strong> Amdahl bounds what you gain by making a <em>part</em> faster. This formula bounds what you gain by adding <em>more work</em>. Both are curves with a ceiling and both punish the same mistake: pouring effort into the resource that is not the bottleneck.</li>
</ul>
<p class="pitfall">⚠️ 1 − p<sup>n</sup> assumes the processes wait <strong>independently</strong> and that memory is free. Neither is true: real processes queue on the same disk, and every extra process costs RAM. So treat the table as an <em>upper bound</em> — a real curve bends over earlier, and past some n you get thrashing (slide 32 of the deck).</p>`,
        `<p class="y-chinh">🎯 Ba dải thời gian xếp chồng. <strong>(a) Uniprogramming:</strong> Program A luân phiên <em>Run · Wait · Run · Wait</em> — ô Run bé tí, khoảng Wait thì rộng mênh mông. <strong>(b) Đa chương trình với hai chương trình:</strong> A và B, cộng một dòng "Combined" nơi các ô Run của B trượt vào đúng các khe Wait của A. <strong>(c) Đa chương trình với ba chương trình:</strong> dòng Combined giờ có Run A · Run B · Run C liền nhau trước khi xuất hiện một khoảng Wait nào.</p>
<ul>
<li><strong>Chỉ đọc dòng Combined, đừng đọc gì khác.</strong> Dòng đó là NHẬT KÝ của chính bộ xử lý. Ở (a) nó gần như trống; ở (b) mỗi đợt có hai mục; ở (c) ba mục. Các chương trình không hề nhanh lên — cái <em>MÁY</em> bận rộn lên.</li>
<li><strong>Thời gian trôi qua của TỪNG chương trình KHÔNG hề ngắn lại.</strong> Nhìn kỹ: ô Run thứ hai của A bắt đầu đúng một vị trí ở cả ba khung. Đa chương trình mua <em>THÔNG LƯỢNG</em>, không mua <em>ĐỘ TRỄ</em>. Đây là điểm bị hiểu nhầm nhiều nhất của cả chương.</li>
<li><strong>Công thức mà hình này ngụ ý, và đề thi rất thích.</strong> Giả sử mỗi tiến trình dành tỉ lệ <strong>p</strong> thời gian để CHỜ I/O. Với <em>n</em> tiến trình độc lập trong bộ nhớ, xác suất cả n cùng chờ một lúc là p<sup>n</sup>, nên <strong>mức dùng CPU ≈ 1 − p<sup>n</sup></strong>.</li>
</ul>
<table>
<tr><th>n (số tiến trình)</th><th>p = 0,2 (nặng tính toán)</th><th>p = 0,5 (pha trộn)</th><th>p = 0,8 (nặng I/O)</th></tr>
<tr><td>1</td><td>80,0 %</td><td>50,0 %</td><td>20,0 %</td></tr>
<tr><td>2</td><td>96,0 %</td><td>75,0 %</td><td>36,0 %</td></tr>
<tr><td>3</td><td>99,2 %</td><td>87,5 %</td><td>48,8 %</td></tr>
<tr><td>4</td><td>99,8 %</td><td>93,8 %</td><td>59,0 %</td></tr>
<tr><td>5</td><td>100,0 %</td><td>96,9 %</td><td>67,2 %</td></tr>
<tr><td>6</td><td>100,0 %</td><td>98,4 %</td><td>73,8 %</td></tr>
<tr><td>7</td><td>100,0 %</td><td>99,2 %</td><td>79,0 %</td></tr>
<tr><td>8</td><td>100,0 %</td><td>99,6 %</td><td>83,2 %</td></tr>
<tr><td>9</td><td>100,0 %</td><td>99,8 %</td><td>86,6 %</td></tr>
<tr><td>10</td><td>100,0 %</td><td>99,9 %</td><td>89,3 %</td></tr>
</table>
<p class="dap-an">✅ Đáp án — cần bao nhiêu tiến trình để CPU đạt 90 %: <strong>p = 0,2 → n = 2 (96,0 %) · p = 0,5 → n = 4 (93,8 %) · p = 0,8 → n = 11 (91,4 %) · p = 0,9 → n = 22 (90,2 %)</strong>. Tất cả đã kiểm bằng python3. <strong>Việc càng CHỜ I/O nhiều thì càng phải giữ nhiều tiến trình trong bộ nhớ để CPU khỏi rảnh</strong> — và nhu cầu đó tăng rất nhanh, nên "độ đa chương trình" là bài toán BỘ NHỚ (slide 21) trước khi là bài toán CPU.</p>
<ul>
<li><strong>Đổ số của slide 12 vào chính công thức này.</strong> Ở đó p = 30/31 = 0,968. Khi ấy n = 10 → 27,96 % · n = 20 → 48,1 % · n = 50 → 80,6 % · n = 100 → 96,2 %. Muốn no được bộ xử lý ấy phải có khoảng MỘT TRĂM job chạy song song — đúng là lý do máy chủ thật chạy hàng trăm luồng.</li>
<li><strong>Nối ngược Amdahl (Ch.2) thêm một lần.</strong> Amdahl chặn trên cái lợi khi làm MỘT PHẦN nhanh hơn. Công thức này chặn trên cái lợi khi THÊM VIỆC vào. Cả hai đều là đường cong có trần, và cả hai đều phạt đúng một sai lầm: dồn công sức vào tài nguyên KHÔNG phải nút thắt cổ chai.</li>
</ul>
<p class="pitfall">⚠️ Công thức 1 − p<sup>n</sup> giả định các tiến trình chờ <strong>ĐỘC LẬP</strong> với nhau và bộ nhớ thì miễn phí. Cả hai đều không đúng: tiến trình thật xếp hàng trên cùng một cái đĩa, và mỗi tiến trình thêm vào đều ngốn RAM. Nên hãy coi bảng trên là <em>CẬN TRÊN</em> — đường cong thật gãy sớm hơn, và qua một mức n nào đó thì sinh ra thrashing (slide 32 của deck).</p>`],

      [14, 'Table 9.1 — Sample Program Execution Attributes',
        `<p class="y-chinh">🎯 The input data for the chapter's one big calculation. Three jobs, five attributes each. Everything on slide 15 is derived from <em>this</em> table plus two assumptions.</p>
<table>
<tr><th></th><th>JOB1</th><th>JOB2</th><th>JOB3</th></tr>
<tr><td><strong>Type of job</strong></td><td>Heavy compute</td><td>Heavy I/O</td><td>Heavy I/O</td></tr>
<tr><td><strong>Duration (min)</strong></td><td>5</td><td>15</td><td>10</td></tr>
<tr><td><strong>Memory required (M)</strong></td><td>50</td><td>100</td><td>80</td></tr>
<tr><td><strong>Need disk?</strong></td><td>No</td><td>No</td><td><strong>Yes</strong></td></tr>
<tr><td><strong>Need terminal?</strong></td><td>No</td><td><strong>Yes</strong></td><td>No</td></tr>
<tr><td><strong>Need printer?</strong></td><td>No</td><td>No</td><td><strong>Yes</strong></td></tr>
</table>
<ul>
<li><strong>Check the compatibility first — that is the hidden question.</strong> Total memory needed if all three run together: 50 + 100 + 80 = <strong>230 M</strong>. No two jobs need the same dedicated device: only JOB3 wants the disk, only JOB2 the terminal, only JOB3 the printer. <strong>So the three can coexist</strong> — no device conflict, and 230 M fits (the machine has 256 M; see the note below).</li>
<li><strong>Two numbers the table does NOT give you, and slide 15 needs.</strong> (1) <em>Total memory installed</em> — reverse-engineering the 33 % figure on slide 15 gives <strong>256 M</strong>. (2) <em>How much CPU each job demands</em> — reverse-engineering the 20 % gives <strong>6 minutes of processor time in total</strong>. Both are honest deductions from the answer, not printed facts. Say so if an exam asks you to justify them.</li>
<li><strong>"Heavy compute" versus "heavy I/O" is the p of slide 13, in words.</strong> JOB1 has a small p, JOB2 and JOB3 have a large p. Notice the mix is deliberate: one CPU-hungry job and two I/O-hungry ones is exactly the blend that multiprogramming rewards most.</li>
<li><strong>Duration means "how long this job takes when it runs alone".</strong> Under uniprogramming the durations simply add: 5 + 15 + 10 = <strong>30 minutes</strong>. Under multiprogramming they overlap and the elapsed time becomes the longest one: <strong>15 minutes</strong>. Those two numbers are the spine of slide 15.</li>
</ul>
<p class="meo">💡 Before computing anything, always draw the three jobs on a time axis twice — once end to end (uniprogramming), once all starting at 0 (multiprogramming). Every percentage on slide 15 is then just "how much of that axis was this resource busy".</p>`,
        `<p class="y-chinh">🎯 Dữ liệu đầu vào cho bài tính lớn duy nhất của chương. Ba job, mỗi job năm thuộc tính. Mọi con số ở slide 15 đều suy ra từ <em>BẢNG NÀY</em> cộng hai giả thiết.</p>
<table>
<tr><th></th><th>JOB1</th><th>JOB2</th><th>JOB3</th></tr>
<tr><td><strong>Loại job</strong></td><td>Nặng tính toán</td><td>Nặng I/O</td><td>Nặng I/O</td></tr>
<tr><td><strong>Thời lượng (phút)</strong></td><td>5</td><td>15</td><td>10</td></tr>
<tr><td><strong>Bộ nhớ cần (M)</strong></td><td>50</td><td>100</td><td>80</td></tr>
<tr><td><strong>Cần đĩa?</strong></td><td>Không</td><td>Không</td><td><strong>CÓ</strong></td></tr>
<tr><td><strong>Cần terminal?</strong></td><td>Không</td><td><strong>CÓ</strong></td><td>Không</td></tr>
<tr><td><strong>Cần máy in?</strong></td><td>Không</td><td>Không</td><td><strong>CÓ</strong></td></tr>
</table>
<ul>
<li><strong>Kiểm tính TƯƠNG THÍCH trước — đó mới là câu hỏi ẩn.</strong> Tổng bộ nhớ nếu cả ba chạy cùng lúc: 50 + 100 + 80 = <strong>230 M</strong>. Không có hai job nào cần chung một thiết bị chuyên dụng: chỉ JOB3 cần đĩa, chỉ JOB2 cần terminal, chỉ JOB3 cần máy in. <strong>Vậy ba job SỐNG CHUNG được</strong> — không xung đột thiết bị, và 230 M vẫn vừa (máy có 256 M; xem ghi chú dưới).</li>
<li><strong>Hai con số bảng KHÔNG cho mà slide 15 lại cần.</strong> (1) <em>Tổng bộ nhớ máy có</em> — suy ngược từ con số 33 % của slide 15 ra <strong>256 M</strong>. (2) <em>Mỗi job đòi bao nhiêu CPU</em> — suy ngược từ con số 20 % ra <strong>tổng cộng 6 phút thời gian bộ xử lý</strong>. Cả hai là suy luận trung thực từ ĐÁP ÁN, không phải dữ kiện in trên slide. Đi thi bị hỏi thì phải nói rõ như vậy.</li>
<li><strong>"Nặng tính toán" với "nặng I/O" chính là chữ p của slide 13, diễn bằng lời.</strong> JOB1 có p nhỏ, JOB2 và JOB3 có p lớn. Để ý cách trộn là cố ý: một job đói CPU và hai job đói I/O đúng là hỗn hợp mà đa chương trình thưởng nhiều nhất.</li>
<li><strong>"Thời lượng" nghĩa là "job này chạy MỘT MÌNH thì mất bấy nhiêu".</strong> Ở chế độ uniprogramming thì các thời lượng cộng dồn: 5 + 15 + 10 = <strong>30 phút</strong>. Ở chế độ đa chương trình chúng chồng lên nhau và thời gian trôi qua bằng job dài nhất: <strong>15 phút</strong>. Hai con số đó là XƯƠNG SỐNG của slide 15.</li>
</ul>
<p class="meo">💡 Trước khi tính bất cứ thứ gì, luôn vẽ ba job lên trục thời gian HAI LẦN — một lần nối đuôi nhau (uniprogramming), một lần cùng bắt đầu ở 0 (đa chương trình). Khi ấy mọi phần trăm ở slide 15 chỉ còn là "tài nguyên này bận bao nhiêu phần của trục đó".</p>`],

      [15, 'Table 9.2 — Effects of Multiprogramming on Resource Utilization (worked in full)',
        `<p class="y-chinh">🎯 The answer table, and the single most exam-likely calculation in the chapter. Same three jobs, same machine — the <em>only</em> thing that changed is whether they run one after another or all at once.</p>
<table>
<tr><th></th><th>Uniprogramming</th><th>Multiprogramming</th><th>Change</th></tr>
<tr><td><strong>Processor use (%)</strong></td><td>20</td><td>40</td><td>×2</td></tr>
<tr><td><strong>Memory use (%)</strong></td><td>33</td><td>67</td><td>×2</td></tr>
<tr><td><strong>Disk use (%)</strong></td><td>33</td><td>67</td><td>×2</td></tr>
<tr><td><strong>Printer use (%)</strong></td><td>33</td><td>67</td><td>×2</td></tr>
<tr><td><strong>Elapsed time (min)</strong></td><td>30</td><td>15</td><td>÷2</td></tr>
<tr><td><strong>Throughput (jobs/hr)</strong></td><td>6</td><td>12</td><td>×2</td></tr>
<tr><td><strong>Mean response time (min)</strong></td><td>18</td><td>10</td><td>−44 %</td></tr>
</table>
<p class="nhan">Now derive every cell — with the two assumptions stated on slide 14: total memory = 256 M, total processor demand = 6 minutes.</p>
<table>
<tr><th>Cell</th><th>Uniprogramming (elapsed 5+15+10 = 30 min)</th><th>Multiprogramming (elapsed = max = 15 min)</th></tr>
<tr><td>Processor</td><td>6 min busy ÷ 30 = <strong>20,0 %</strong></td><td>6 min busy ÷ 15 = <strong>40,0 %</strong></td></tr>
<tr><td>Memory (time-weighted)</td><td>(5×50 + 15×100 + 10×80) = 2550 M·min ÷ (30×256) = <strong>33,2 %</strong></td><td>0–5 min: 230 M · 5–10: 180 M · 10–15: 100 M → (5×230 + 5×180 + 5×100) = 2550 ÷ (15×256) = <strong>66,4 %</strong></td></tr>
<tr><td>Disk (JOB3 only)</td><td>10 ÷ 30 = <strong>33,3 %</strong></td><td>10 ÷ 15 = <strong>66,7 %</strong></td></tr>
<tr><td>Printer (JOB3 only)</td><td>10 ÷ 30 = <strong>33,3 %</strong></td><td>10 ÷ 15 = <strong>66,7 %</strong></td></tr>
<tr><td>Terminal (JOB2 only) — <em>not in the table, but in Fig 9.6</em></td><td>15 ÷ 30 = <strong>50 %</strong></td><td>15 ÷ 15 = <strong>100 %</strong></td></tr>
<tr><td>Throughput</td><td>3 jobs ÷ 0,5 h = <strong>6 jobs/hr</strong></td><td>3 jobs ÷ 0,25 h = <strong>12 jobs/hr</strong></td></tr>
<tr><td>Mean response time</td><td>finish at 5, 20, 30 → (5+20+30)/3 = <strong>18,3 min</strong></td><td>finish at 5, 15, 10 → (5+15+10)/3 = <strong>10,0 min</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án — all figures verified with python3 and they reproduce the slide exactly (33,2 → 33; 66,4 → 67; 18,3 → 18). <strong>The elegant part: the memory·time product is 2550 M·min in BOTH columns.</strong> Multiprogramming did not reduce the work by one byte-minute — it squeezed the identical total demand into half the wall-clock time, which is why every utilisation figure doubles and elapsed time halves. That single observation explains six of the seven rows at once.</p>
<ul>
<li><strong>Mean response time is the only row that is not a clean factor of two, and the only one that can go the wrong way.</strong> It fell from 18,3 to 10,0 here because the short job (JOB1, 5 min) no longer waits behind anyone. But note JOB2 got <em>worse</em>: it finished at minute 15 under both schemes, while JOB3 finished at 30 before and 10 now. Averages hide who won and who lost.</li>
<li><strong>Cross-check against Amdahl (Ch.2).</strong> If instead of multiprogramming you had bought a processor of infinite speed, elapsed time would fall from 30 to 24 minutes (the 24 minutes of I/O wait remain) — a speedup of only <strong>1,25×</strong>. Multiprogramming gave <strong>2,00×</strong> for the price of some software. Verified with python3.</li>
<li><strong>Why memory use only reaches 67 % and not more.</strong> 230 of 256 M are occupied at the start, but JOB1 leaves at minute 5 and JOB3 at minute 10, so the average across the 15 minutes is lower. Real systems fix this by admitting a fourth job the moment JOB1 exits — that decision is <em>long-term scheduling</em>, slide 20.</li>
<li><strong>What would break this answer.</strong> If two jobs both needed the printer, they could not overlap. If memory were 128 M, all three would not fit and the elapsed time would not be 15. Always check device conflicts and the memory sum <em>before</em> assuming full overlap.</li>
</ul>
<p class="pitfall">⚠️ The classic mistake: computing processor use as "the average of the three jobs' CPU usage". It is not an average of jobs, it is <strong>busy time ÷ elapsed time</strong> — one fraction of one timeline. Similarly, memory use must be <strong>time-weighted</strong>; taking (50+100+80)/256 = 90 % is wrong because the jobs do not all live for the whole run.</p>`,
        `<p class="y-chinh">🎯 Bảng ĐÁP ÁN, và là phép tính dễ ra thi nhất của cả chương. Vẫn ba job ấy, vẫn cái máy ấy — thứ <em>DUY NHẤT</em> thay đổi là chúng chạy nối đuôi hay chạy cùng lúc.</p>
<table>
<tr><th></th><th>Uniprogramming</th><th>Multiprogramming</th><th>Đổi</th></tr>
<tr><td><strong>Mức dùng bộ xử lý (%)</strong></td><td>20</td><td>40</td><td>×2</td></tr>
<tr><td><strong>Mức dùng bộ nhớ (%)</strong></td><td>33</td><td>67</td><td>×2</td></tr>
<tr><td><strong>Mức dùng đĩa (%)</strong></td><td>33</td><td>67</td><td>×2</td></tr>
<tr><td><strong>Mức dùng máy in (%)</strong></td><td>33</td><td>67</td><td>×2</td></tr>
<tr><td><strong>Thời gian trôi qua (phút)</strong></td><td>30</td><td>15</td><td>÷2</td></tr>
<tr><td><strong>Thông lượng (job/giờ)</strong></td><td>6</td><td>12</td><td>×2</td></tr>
<tr><td><strong>Thời gian đáp ứng trung bình (phút)</strong></td><td>18</td><td>10</td><td>−44 %</td></tr>
</table>
<p class="nhan">Giờ dẫn ra TỪNG Ô — với hai giả thiết đã nêu ở slide 14: tổng bộ nhớ = 256 M, tổng nhu cầu bộ xử lý = 6 phút.</p>
<table>
<tr><th>Ô</th><th>Uniprogramming (trôi qua 5+15+10 = 30 phút)</th><th>Đa chương trình (trôi qua = job dài nhất = 15 phút)</th></tr>
<tr><td>Bộ xử lý</td><td>6 phút bận ÷ 30 = <strong>20,0 %</strong></td><td>6 phút bận ÷ 15 = <strong>40,0 %</strong></td></tr>
<tr><td>Bộ nhớ (có trọng số thời gian)</td><td>(5×50 + 15×100 + 10×80) = 2550 M·phút ÷ (30×256) = <strong>33,2 %</strong></td><td>phút 0–5: 230 M · 5–10: 180 M · 10–15: 100 M → (5×230 + 5×180 + 5×100) = 2550 ÷ (15×256) = <strong>66,4 %</strong></td></tr>
<tr><td>Đĩa (chỉ JOB3)</td><td>10 ÷ 30 = <strong>33,3 %</strong></td><td>10 ÷ 15 = <strong>66,7 %</strong></td></tr>
<tr><td>Máy in (chỉ JOB3)</td><td>10 ÷ 30 = <strong>33,3 %</strong></td><td>10 ÷ 15 = <strong>66,7 %</strong></td></tr>
<tr><td>Terminal (chỉ JOB2) — <em>không có trong bảng, nhưng có trong Fig 9.6</em></td><td>15 ÷ 30 = <strong>50 %</strong></td><td>15 ÷ 15 = <strong>100 %</strong></td></tr>
<tr><td>Thông lượng</td><td>3 job ÷ 0,5 giờ = <strong>6 job/giờ</strong></td><td>3 job ÷ 0,25 giờ = <strong>12 job/giờ</strong></td></tr>
<tr><td>Thời gian đáp ứng TB</td><td>xong ở phút 5, 20, 30 → (5+20+30)/3 = <strong>18,3 phút</strong></td><td>xong ở phút 5, 15, 10 → (5+15+10)/3 = <strong>10,0 phút</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án — mọi số đã kiểm bằng python3 và tái tạo đúng slide (33,2 → 33; 66,4 → 67; 18,3 → 18). <strong>Chỗ đẹp nhất: tích bộ-nhớ×thời-gian bằng 2550 M·phút ở CẢ HAI cột.</strong> Đa chương trình không làm giảm khối lượng công việc một byte-phút nào — nó NÉN đúng cái tổng nhu cầu ấy vào một nửa thời gian đồng hồ, nên mọi con số mức dùng đều gấp đôi còn thời gian trôi qua thì còn một nửa. Chỉ một nhận xét đó giải thích sáu trên bảy dòng cùng lúc.</p>
<ul>
<li><strong>Thời gian đáp ứng là dòng DUY NHẤT không phải hệ số 2 tròn trịa, và cũng là dòng duy nhất có thể đi theo chiều XẤU.</strong> Ở đây nó giảm từ 18,3 xuống 10,0 vì job ngắn (JOB1, 5 phút) không còn phải xếp hàng sau ai. Nhưng để ý JOB2 <em>THIỆT</em>: nó xong ở phút 15 ở cả hai chế độ, trong khi JOB3 trước xong ở phút 30 nay xong ở phút 10. Số trung bình che mất ai được ai mất.</li>
<li><strong>Đối chiếu chéo với Amdahl (Ch.2).</strong> Nếu thay vì đa chương trình bạn mua một bộ xử lý NHANH VÔ HẠN, thời gian trôi qua chỉ giảm từ 30 xuống 24 phút (24 phút chờ I/O vẫn còn nguyên) — tăng tốc vỏn vẹn <strong>1,25×</strong>. Đa chương trình cho <strong>2,00×</strong> mà chỉ tốn ít phần mềm. Đã kiểm bằng python3.</li>
<li><strong>Vì sao bộ nhớ chỉ lên tới 67 % mà không hơn.</strong> Lúc đầu 230 trên 256 M bị chiếm, nhưng JOB1 rời đi ở phút 5 và JOB3 ở phút 10, nên trung bình trên 15 phút thấp xuống. Hệ thống thật vá chỗ này bằng cách nạp job thứ tư ngay khi JOB1 kết thúc — quyết định đó là <em>LẬP LỊCH DÀI HẠN</em>, slide 20.</li>
<li><strong>Cái gì sẽ làm đáp án này sai.</strong> Nếu hai job cùng cần máy in thì chúng không chồng lên nhau được. Nếu bộ nhớ chỉ 128 M thì ba job không cùng vào được và thời gian trôi qua không còn là 15. Luôn kiểm XUNG ĐỘT THIẾT BỊ và TỔNG BỘ NHỚ <em>TRƯỚC KHI</em> giả định chồng lấn hoàn toàn.</li>
</ul>
<p class="pitfall">⚠️ Sai lầm kinh điển: tính mức dùng bộ xử lý bằng cách "lấy trung bình mức CPU của ba job". Nó KHÔNG phải trung bình theo job, nó là <strong>thời gian bận ÷ thời gian trôi qua</strong> — một phân số trên một trục thời gian. Tương tự, mức dùng bộ nhớ phải <strong>có trọng số thời gian</strong>; lấy (50+100+80)/256 = 90 % là SAI vì ba job không cùng sống suốt cả lượt chạy.</p>`],

      [16, 'Figure 9.6 — Utilization Histograms',
        `<p class="y-chinh">🎯 Table 9.2 drawn as pictures, so you can <em>see</em> the doubling. Two panels — <strong>(a) Uniprogramming</strong> on a 0–30 minute axis, <strong>(b) Multiprogramming</strong> on a 0–15 minute axis — each with five stacked bars (CPU, Memory, Disk, Terminal, Printer) plus a <strong>Job History</strong> strip at the bottom.</p>
<table>
<tr><th>Bar</th><th>Panel (a), 30-minute axis</th><th>Panel (b), 15-minute axis</th></tr>
<tr><td><strong>CPU</strong></td><td>Tall dark block only during JOB1 (0–5), then almost flat</td><td>Tall dark block at the start, over a much shorter axis</td></tr>
<tr><td><strong>Memory</strong></td><td>Three different plateaus as each job runs in turn</td><td>Highest at the start (all three resident), stepping down as jobs finish</td></tr>
<tr><td><strong>Disk</strong></td><td>Grey block only in 20–30 (JOB3's turn)</td><td>Grey block over 0–10, i.e. two thirds of the axis</td></tr>
<tr><td><strong>Terminal</strong></td><td>Green band over 5–20 (JOB2's turn)</td><td>Green band across essentially the whole axis</td></tr>
<tr><td><strong>Printer</strong></td><td>Grey block only in 20–30</td><td>Grey block over 0–10</td></tr>
<tr><td><strong>Job History</strong></td><td>JOB1 → JOB2 → JOB3, three arrows <em>end to end</em></td><td>JOB1, JOB2, JOB3, three arrows <em>all starting at 0</em></td></tr>
</table>
<ul>
<li><strong>The Job History strip is the key to the whole figure — read it first.</strong> In (a) the arrows are laid nose to tail across 30 minutes; in (b) they all begin at 0 and end at 5, 15 and 10. Everything above is a consequence of that one difference.</li>
<li><strong>The two panels have DIFFERENT axis lengths, and that is the trap.</strong> Panel (a) runs to 30, panel (b) to 15. So a bar that looks the same width in both is actually busy for <em>half</em> as long in (b) — which is exactly why the percentage doubles. Never compare bar widths across the two panels without checking the axis.</li>
<li><strong>The CPU bar makes the chapter's argument visually.</strong> In (a) it is a thin dark stub in a wide field of dashes (idle). In (b) the same amount of dark ink sits on a half-width axis. The processor did no more work — it just had less time to be idle in.</li>
<li><strong>Look at the Terminal bar in panel (b): it spans the entire axis.</strong> That is JOB2's 15 minutes over a 15-minute run = <strong>100 % utilisation</strong>. A resource at 100 % is a resource that has become the bottleneck — add a fourth job needing a terminal and it would have to wait. This is how you find the next thing to buy.</li>
<li><strong>Why five bars and not one.</strong> Utilisation is per-resource, and the resources are not interchangeable. A system can be at 40 % CPU and 100 % terminal at the same moment — "the system is 40 % used" is a meaningless sentence. Ch.2's lesson about single-number benchmarks, repeated for operating systems.</li>
</ul>
<p class="meo">💡 If you have to reproduce Table 9.2 in an exam and you have forgotten a formula, redraw this figure roughly on scrap paper. Every percentage is literally "how much of the axis is shaded" — counting shaded minutes is faster and safer than remembering seven separate rules.</p>`,
        `<p class="y-chinh">🎯 Table 9.2 vẽ thành tranh, để bạn <em>NHÌN THẤY</em> chuyện gấp đôi. Hai khung — <strong>(a) Uniprogramming</strong> trên trục 0–30 phút, <strong>(b) Multiprogramming</strong> trên trục 0–15 phút — mỗi khung có năm thanh xếp chồng (CPU, Memory, Disk, Terminal, Printer) cộng một dải <strong>Job History</strong> ở đáy.</p>
<table>
<tr><th>Thanh</th><th>Khung (a), trục 30 phút</th><th>Khung (b), trục 15 phút</th></tr>
<tr><td><strong>CPU</strong></td><td>Khối đen cao chỉ trong lúc JOB1 chạy (0–5), sau đó gần như phẳng lì</td><td>Khối đen cao ở đầu, nhưng trên một trục ngắn hơn hẳn</td></tr>
<tr><td><strong>Memory</strong></td><td>Ba mức cao khác nhau khi từng job chạy lần lượt</td><td>Cao nhất ở đầu (cả ba cùng thường trú), rồi tụt bậc khi job kết thúc</td></tr>
<tr><td><strong>Disk</strong></td><td>Khối xám chỉ ở 20–30 (lượt của JOB3)</td><td>Khối xám trải 0–10, tức hai phần ba trục</td></tr>
<tr><td><strong>Terminal</strong></td><td>Dải xanh ở 5–20 (lượt của JOB2)</td><td>Dải xanh trải gần hết trục</td></tr>
<tr><td><strong>Printer</strong></td><td>Khối xám chỉ ở 20–30</td><td>Khối xám trải 0–10</td></tr>
<tr><td><strong>Job History</strong></td><td>JOB1 → JOB2 → JOB3, ba mũi tên <em>nối đuôi nhau</em></td><td>JOB1, JOB2, JOB3, ba mũi tên <em>cùng bắt đầu ở 0</em></td></tr>
</table>
<ul>
<li><strong>Dải Job History là chìa khoá của cả hình — đọc nó trước.</strong> Ở (a) ba mũi tên nối đuôi nhau trải suốt 30 phút; ở (b) cả ba cùng xuất phát từ 0 và kết thúc ở phút 5, 15, 10. Mọi thứ phía trên đều là HỆ QUẢ của đúng một khác biệt đó.</li>
<li><strong>Hai khung có ĐỘ DÀI TRỤC KHÁC NHAU, và đó chính là cái bẫy.</strong> Khung (a) chạy tới 30, khung (b) tới 15. Nên một thanh trông rộng bằng nhau ở hai khung thật ra chỉ bận <em>một nửa</em> thời gian ở (b) — đúng là lý do phần trăm gấp đôi. Đừng bao giờ so bề rộng thanh giữa hai khung mà không nhìn trục.</li>
<li><strong>Thanh CPU diễn đạt luận điểm của cả chương bằng hình ảnh.</strong> Ở (a) nó là một cái cuống đen mảnh giữa một cánh đồng nét đứt (rảnh). Ở (b) vẫn chừng ấy mực đen nhưng nằm trên trục chỉ dài một nửa. Bộ xử lý không làm thêm việc nào — nó chỉ còn ít thời gian hơn để ngồi không.</li>
<li><strong>Nhìn thanh Terminal ở khung (b): nó trải KÍN trục.</strong> Đó là 15 phút của JOB2 trên một lượt chạy 15 phút = <strong>100 % mức dùng</strong>. Một tài nguyên ở 100 % là tài nguyên đã thành NÚT THẮT — thêm job thứ tư cần terminal thì nó phải đợi. Đây là cách người ta tìm ra thứ tiếp theo cần mua thêm.</li>
<li><strong>Vì sao năm thanh chứ không phải một.</strong> Mức dùng là theo TỪNG tài nguyên, và các tài nguyên không thay thế nhau được. Một hệ thống có thể CPU 40 % mà terminal 100 % cùng lúc — câu "hệ thống dùng 40 %" là câu vô nghĩa. Bài học của Ch.2 về chỉ số gộp một con số, nhắc lại cho hệ điều hành.</li>
</ul>
<p class="meo">💡 Đi thi phải dựng lại Table 9.2 mà quên công thức thì cứ vẽ phác lại hình này ra giấy nháp. Mọi phần trăm đúng nghĩa đen là "bao nhiêu phần của trục bị tô" — đếm số phút được tô nhanh hơn và an toàn hơn là nhớ bảy quy tắc rời rạc.</p>`],

      [17, 'Time Sharing Systems',
        `<p class="y-chinh">🎯 Multiprogramming was invented to keep the <em>processor</em> busy. <strong>Time sharing</strong> takes the same mechanism and points it at a different goal: keeping the <em>user</em> happy. It is used when the user <strong>interacts directly with the computer</strong>.</p>
<ul>
<li><strong>The slide's mechanism, word for word.</strong> The processor's time is <strong>shared among multiple users</strong>. Multiple users simultaneously access the system through <strong>terminals</strong>, with the OS <strong>interleaving the execution of each user program in a short burst or QUANTUM of computation</strong>.</li>
<li><strong>"Quantum" is the word to memorise.</strong> A quantum (or time slice) is the maximum length of one turn on the processor. When it expires the timer interrupt fires and the OS switches to the next user. That is the timer of slide 11 finally doing its day job — time sharing is <em>literally impossible</em> without it.</li>
<li><strong>The slide's own example is the arithmetic you may be asked to do.</strong> "If there are <strong>n</strong> users actively requesting service at one time, each user will only see on the average <strong>1/n</strong> of the effective computer speed."</li>
</ul>
<table>
<tr><th>n active users</th><th>Share of speed each one sees</th><th>A 1-second job now appears to take</th></tr>
<tr><td>1</td><td>100 %</td><td>1 s</td></tr>
<tr><td>2</td><td>50 %</td><td>2 s</td></tr>
<tr><td>4</td><td>25 %</td><td>4 s</td></tr>
<tr><td>10</td><td>10 %</td><td>10 s</td></tr>
<tr><td>20</td><td>5 %</td><td>20 s</td></tr>
<tr><td>50</td><td>2 %</td><td>50 s</td></tr>
</table>
<p class="dap-an">✅ Đáp án: the key qualifier is <strong>"actively requesting service"</strong>. A hundred people can be logged in while only three are actually computing — the other ninety-seven are reading, thinking or typing, and their processes are blocked. That is why a 1970s mainframe could feel responsive to dozens of terminals: human think-time is enormous compared with a quantum. It also tells you what makes such a system collapse — everyone hitting Enter at once.</p>
<ul>
<li><strong>Multiprogramming and time sharing are the same machinery, different policy.</strong> Both keep several processes in memory and switch between them. Batch multiprogramming switches when a process <em>blocks on I/O</em>; time sharing also switches when the <em>quantum expires</em>. One extra trigger, an entirely different user experience.</li>
<li><strong>Choosing the quantum is a real trade-off.</strong> Too long → the last user in the queue waits ages, response time suffers. Too short → the machine spends its time context switching (slide 23) instead of computing. Typical values are milliseconds — long compared to a switch, short compared to human perception.</li>
<li><strong>Connect to CSI106 and to your laptop.</strong> CSI106 called this "multitasking". Every desktop OS you have used is a time-sharing system where the "multiple users" are mostly one user's many windows. The quantum is still there, still driven by the same timer interrupt.</li>
</ul>
<p class="pitfall">⚠️ Trap: 1/n is an <em>average over active users</em>, not a guarantee. It ignores context-switch overhead (so the true share is slightly less than 1/n) and it ignores priority (a higher-priority process gets more than its 1/n). Do not present 1/n as an exact law.</p>`,
        `<p class="y-chinh">🎯 Đa chương trình sinh ra để giữ cho <em>BỘ XỬ LÝ</em> bận. <strong>Chia sẻ thời gian (time sharing)</strong> lấy đúng cơ chế ấy và chĩa sang một mục tiêu khác: giữ cho <em>NGƯỜI DÙNG</em> vừa lòng. Nó dùng khi người dùng <strong>tương tác trực tiếp với máy</strong>.</p>
<ul>
<li><strong>Cơ chế theo đúng chữ của slide.</strong> Thời gian của bộ xử lý được <strong>CHIA SẺ giữa nhiều người dùng</strong>. Nhiều người dùng truy cập hệ thống cùng lúc qua <strong>terminal</strong>, còn OS thì <strong>xen kẽ việc thực thi chương trình của từng người theo từng ĐỢT NGẮN hay QUANTUM tính toán</strong>.</li>
<li><strong>"Quantum" là từ phải thuộc.</strong> Quantum (hay lát thời gian) là độ dài TỐI ĐA của một lượt ngồi trên bộ xử lý. Hết quantum thì ngắt bộ đếm thời gian nổ và OS chuyển sang người kế tiếp. Đó là lúc bộ đếm thời gian của slide 11 cuối cùng cũng làm đúng nghề của nó — chia sẻ thời gian là điều <em>KHÔNG THỂ</em> nếu thiếu nó.</li>
<li><strong>Ví dụ của chính slide là phép tính bạn có thể bị hỏi.</strong> "Nếu có <strong>n</strong> người dùng đang tích cực yêu cầu phục vụ cùng lúc, mỗi người TRUNG BÌNH chỉ thấy <strong>1/n</strong> tốc độ hữu hiệu của máy."</li>
</ul>
<table>
<tr><th>n người dùng tích cực</th><th>Mỗi người thấy được bao nhiêu phần tốc độ</th><th>Việc vốn mất 1 giây nay như mất</th></tr>
<tr><td>1</td><td>100 %</td><td>1 s</td></tr>
<tr><td>2</td><td>50 %</td><td>2 s</td></tr>
<tr><td>4</td><td>25 %</td><td>4 s</td></tr>
<tr><td>10</td><td>10 %</td><td>10 s</td></tr>
<tr><td>20</td><td>5 %</td><td>20 s</td></tr>
<tr><td>50</td><td>2 %</td><td>50 s</td></tr>
</table>
<p class="dap-an">✅ Đáp án: mấu chốt nằm ở chữ bổ nghĩa <strong>"đang TÍCH CỰC yêu cầu phục vụ"</strong>. Một trăm người có thể đang đăng nhập mà chỉ ba người thật sự đang tính toán — chín mươi bảy người kia đang đọc, đang nghĩ hoặc đang gõ, và tiến trình của họ đang bị chặn. Đó là lý do một máy lớn thập niên 1970 vẫn thấy mượt với hàng chục terminal: thời gian SUY NGHĨ của con người khổng lồ so với một quantum. Nó cũng cho bạn biết cái gì làm hệ thống ấy sụp — tất cả cùng bấm Enter một lúc.</p>
<ul>
<li><strong>Đa chương trình và chia sẻ thời gian là CÙNG bộ máy, khác CHÍNH SÁCH.</strong> Cả hai đều giữ vài tiến trình trong bộ nhớ và chuyển qua lại. Batch multiprogramming chuyển khi một tiến trình <em>bị chặn vì I/O</em>; chia sẻ thời gian chuyển thêm cả khi <em>hết quantum</em>. Thêm đúng một cái cò, trải nghiệm người dùng đổi hoàn toàn.</li>
<li><strong>Chọn quantum là một đánh đổi thật.</strong> Dài quá → người xếp cuối hàng chờ mòn mỏi, thời gian đáp ứng tệ. Ngắn quá → máy dành thời gian đi chuyển ngữ cảnh (slide 23) thay vì tính toán. Giá trị điển hình là vài mili giây — dài so với một lần chuyển, ngắn so với cảm nhận của con người.</li>
<li><strong>Nối sang CSI106 và sang chiếc laptop của bạn.</strong> CSI106 gọi đây là "đa nhiệm". Mọi hệ điều hành desktop bạn từng dùng đều là hệ chia sẻ thời gian, trong đó "nhiều người dùng" chủ yếu là nhiều cửa sổ của một người. Quantum vẫn còn đó, vẫn do đúng cái ngắt bộ đếm thời gian ấy điều khiển.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: 1/n là <em>TRUNG BÌNH trên số người đang tích cực</em>, không phải một bảo đảm. Nó bỏ qua chi phí chuyển ngữ cảnh (nên phần thật sự nhận được hơi ÍT hơn 1/n) và bỏ qua độ ưu tiên (tiến trình ưu tiên cao nhận nhiều hơn 1/n). Đừng trình bày 1/n như một định luật chính xác.</p>`],

      [18, 'Table 9.3 — Batch Multiprogramming versus Time Sharing',
        `<p class="y-chinh">🎯 Two techniques built on identical machinery, separated by <strong>what they are trying to maximise</strong> and <strong>where their instructions come from</strong>.</p>
<table>
<tr><th></th><th>Batch Multiprogramming</th><th>Time Sharing</th></tr>
<tr><td><strong>Principal objective</strong></td><td><strong>Maximise processor use</strong></td><td><strong>Minimise response time</strong></td></tr>
<tr><td><strong>Source of directives to operating system</strong></td><td><strong>Job control language commands provided with the job</strong></td><td><strong>Commands entered at the terminal</strong></td></tr>
</table>
<ul>
<li><strong>Row 1 is the design goal, and the two goals genuinely conflict.</strong> Maximum processor use means never switching away from a running job until it blocks — long turns, few switches, no wasted cycles. Minimum response time means switching often so nobody waits long — short turns, many switches, overhead accepted on purpose. You can have one or the other; you tune between them.</li>
<li><strong>Row 2 is not a footnote — it explains row 1.</strong> Batch directives arrive <em>with the job</em>, written in advance (the <code>$JOB … $END</code> deck of slide 10). Nobody is waiting, so the OS is free to optimise throughput. Time-sharing directives arrive <em>from a human at a terminal</em>, one at a time, unpredictably — and a human is sitting there watching, so response time becomes the only thing that matters.</li>
<li><strong>Look again at Table 9.2 with this in mind.</strong> Its seven rows split cleanly: processor/memory/disk/printer use and throughput are <em>batch</em> metrics; mean response time is the <em>time-sharing</em> metric. The same run, judged by two different scoreboards.</li>
<li><strong>How this shows up in the scheduler.</strong> Batch favours running the job that keeps devices busiest; time sharing favours round-robin with a small quantum so every user gets a turn quickly. Same five-state model (slide 22), different dispatch rule.</li>
<li><strong>Today both live inside one machine.</strong> Your laptop gives interactive priority to the window you are typing in while batch-scheduling background indexing, backups and updates. Linux calls these scheduling <em>classes</em>; the distinction in this table is exactly why they exist.</li>
</ul>
<p class="pitfall">⚠️ The slide's version of Table 9.3 has been <strong>cut down to two rows</strong>. The table in the textbook has a third row about where the address space / operating-system directives come from. If a question references a row you cannot find on the slide, that is why — check the book, do not assume the slide is complete.</p>
<p class="meo">💡 Two words each: <strong>batch = throughput · time sharing = responsiveness</strong>. If a question asks "which is better", the answer is always "better at what" — there is no ordering between these two goals.</p>`,
        `<p class="y-chinh">🎯 Hai kỹ thuật dựng trên bộ máy y hệt nhau, phân biệt bởi <strong>thứ chúng muốn TỐI ĐA HOÁ</strong> và <strong>chỉ thị đến từ ĐÂU</strong>.</p>
<table>
<tr><th></th><th>Batch Multiprogramming (đa chương trình theo lô)</th><th>Time Sharing (chia sẻ thời gian)</th></tr>
<tr><td><strong>Mục tiêu chính</strong></td><td><strong>Tối đa mức dùng bộ xử lý</strong></td><td><strong>Tối thiểu thời gian đáp ứng</strong></td></tr>
<tr><td><strong>Nguồn chỉ thị cho hệ điều hành</strong></td><td><strong>Lệnh JCL đi kèm theo job</strong></td><td><strong>Lệnh gõ vào từ terminal</strong></td></tr>
</table>
<ul>
<li><strong>Dòng 1 là mục tiêu thiết kế, và hai mục tiêu này XUNG ĐỘT thật.</strong> Tối đa mức dùng bộ xử lý nghĩa là không bao giờ rời một job đang chạy cho tới khi nó bị chặn — lượt dài, ít chuyển, không phí chu kỳ nào. Tối thiểu thời gian đáp ứng nghĩa là chuyển liên tục để không ai phải đợi lâu — lượt ngắn, chuyển nhiều, chấp nhận chi phí một cách CỐ Ý. Bạn được cái này hoặc cái kia; việc còn lại là chỉnh giữa hai đầu.</li>
<li><strong>Dòng 2 không phải chú thích — nó GIẢI THÍCH dòng 1.</strong> Chỉ thị của batch đến <em>KÈM THEO JOB</em>, viết sẵn từ trước (cọc bìa <code>$JOB … $END</code> của slide 10). Chẳng ai ngồi đợi, nên OS rảnh tay tối ưu thông lượng. Chỉ thị của time sharing đến <em>TỪ MỘT CON NGƯỜI ngồi ở terminal</em>, từng lệnh một, không đoán trước được — và người đó đang ngồi nhìn, nên thời gian đáp ứng thành thứ duy nhất đáng kể.</li>
<li><strong>Nhìn lại Table 9.2 với ý này trong đầu.</strong> Bảy dòng của nó chia đôi rất gọn: mức dùng bộ xử lý/bộ nhớ/đĩa/máy in và thông lượng là chỉ số của <em>BATCH</em>; thời gian đáp ứng trung bình là chỉ số của <em>TIME SHARING</em>. Cùng một lượt chạy, chấm bằng hai bảng điểm khác nhau.</li>
<li><strong>Nó lộ ra ở bộ lập lịch như thế nào.</strong> Batch ưu tiên chạy job nào giữ cho thiết bị bận nhất; time sharing ưu tiên xoay vòng (round-robin) với quantum nhỏ để ai cũng sớm tới lượt. Cùng mô hình năm trạng thái (slide 22), khác luật điều phối.</li>
<li><strong>Ngày nay cả hai sống trong CÙNG một cái máy.</strong> Laptop của bạn ưu tiên tương tác cho cửa sổ bạn đang gõ, đồng thời lập lịch kiểu batch cho việc đánh chỉ mục nền, sao lưu và cập nhật. Linux gọi đó là các <em>LỚP</em> lập lịch; phân biệt trong bảng này chính là lý do chúng tồn tại.</li>
</ul>
<p class="pitfall">⚠️ Bản Table 9.3 trên slide đã bị <strong>CẮT còn hai dòng</strong>. Bảng trong giáo trình có thêm dòng thứ ba nói về nguồn của không gian địa chỉ / chỉ thị hệ điều hành. Đề hỏi một dòng mà bạn không tìm thấy trên slide thì lý do là vậy — tra sách, đừng mặc định slide là đầy đủ.</p>
<p class="meo">💡 Mỗi bên hai chữ: <strong>batch = THÔNG LƯỢNG · time sharing = ĐÁP ỨNG</strong>. Đề hỏi "cái nào tốt hơn" thì đáp án luôn là "tốt hơn ở khía cạnh nào" — giữa hai mục tiêu này không có thứ tự hơn kém.</p>`],

      [19, 'Table 9.4 — Types of Scheduling',
        `<p class="y-chinh">🎯 Four kinds of scheduling, each one a different <strong>decision</strong> taken at a different <strong>timescale</strong>. Learn them by the decision, not by the name.</p>
<table>
<tr><th>Type</th><th>The decision, in the slide's exact words</th></tr>
<tr><td><strong>Long-term scheduling</strong></td><td>The decision to <strong>add to the pool of processes to be executed</strong></td></tr>
<tr><td><strong>Medium-term scheduling</strong></td><td>The decision to <strong>add to the number of processes that are partially or fully in main memory</strong></td></tr>
<tr><td><strong>Short-term scheduling</strong></td><td>The decision as to <strong>which available process will be executed by the processor</strong></td></tr>
<tr><td><strong>I/O scheduling</strong></td><td>The decision as to <strong>which process's pending I/O request shall be handled by an available I/O device</strong></td></tr>
</table>
<p class="nhan">The comparison the exam actually wants — the three processor-related levels side by side:</p>
<table>
<tr><th></th><th>Long-term</th><th>Medium-term</th><th>Short-term</th></tr>
<tr><td><strong>Decides</strong></td><td>Does this job become a process at all?</td><td>Is this process resident in main memory?</td><td>Which ready process runs <em>right now</em>?</td></tr>
<tr><td><strong>Also called</strong></td><td>Job scheduler / admission control</td><td>Part of the <em>swapping</em> function</td><td><strong>The dispatcher</strong></td></tr>
<tr><td><strong>How often it runs</strong></td><td>Rarely — seconds to minutes, on job arrival or completion</td><td>In between — when memory pressure changes</td><td><strong>Very frequently</strong> — milliseconds, on every block, interrupt or quantum expiry</td></tr>
<tr><td><strong>Controls</strong></td><td>The <strong>total number of processes in the system</strong></td><td>The <strong>degree of multiprogramming</strong> (how many are in RAM)</td><td>Which process holds the processor</td></tr>
<tr><td><strong>Affects</strong></td><td>Throughput, and whether the system is oversubscribed at all</td><td>Memory utilisation, page-fault rate, thrashing</td><td><strong>Response time</strong> and context-switch overhead</td></tr>
<tr><td><strong>Its transition on Fig 9.7 (slide 22)</strong></td><td>New → Ready ("Admit")</td><td>Between Ready/Blocked and their swapped-out forms</td><td>Ready → Running ("Dispatch")</td></tr>
<tr><td><strong>Cost of running it</strong></td><td>Can afford to be slow and clever</td><td>Moderate</td><td><strong>Must be fast</strong> — it runs thousands of times a second, so its own cost is pure overhead</td></tr>
</table>
<ul>
<li><strong>Notice the three levels form a funnel.</strong> Long-term decides <em>who enters the building</em>; medium-term decides <em>who is in the room</em>; short-term decides <em>who is speaking</em>. Each level's output is the next level's candidate pool.</li>
<li><strong>Tie it back to the n of slide 13.</strong> The 1 − p<sup>n</sup> curve says a bigger n means a busier CPU. <strong>Medium-term scheduling is the knob that sets n.</strong> Too small and the processor idles; too large and memory thrashes. That is why this level exists at all.</li>
<li><strong>Why short-term scheduling must be cheap.</strong> If the dispatcher takes 1 ms to choose and the quantum is 10 ms, you have burned 9 % of the machine on deciding rather than doing. This is also why context switch cost (slide 23) sets a floor on how small a quantum can usefully be.</li>
<li><strong>I/O scheduling is the odd one out — and it is not about the processor at all.</strong> It orders the queue in front of a <em>device</em>. For a spinning disk this is where seek-order algorithms live (Ch.6's disk geometry is what makes ordering pay). For an SSD the payoff is much smaller — the hardware changed, so the scheduling policy had to change too.</li>
</ul>
<p class="pitfall">⚠️ The extracted text of this slide shows "han-dled" split across a line — that is the .pptx line-break, not a different word. And note the classic exam confusion: <strong>"which process runs next" is SHORT-term</strong>, while <strong>"how many processes are in memory" is MEDIUM-term</strong>. Mixing those two up is the most common lost mark on this table.</p>`,
        `<p class="y-chinh">🎯 Bốn loại lập lịch, mỗi loại là một <strong>QUYẾT ĐỊNH</strong> khác nhau ở một <strong>THANG THỜI GIAN</strong> khác nhau. Học theo QUYẾT ĐỊNH, đừng học theo cái tên.</p>
<table>
<tr><th>Loại</th><th>Quyết định, đúng nguyên văn slide</th></tr>
<tr><td><strong>Lập lịch dài hạn</strong></td><td>Quyết định <strong>THÊM vào tập các tiến trình sẽ được thực thi</strong></td></tr>
<tr><td><strong>Lập lịch trung hạn</strong></td><td>Quyết định <strong>THÊM vào số tiến trình đang nằm một phần hoặc toàn phần trong bộ nhớ chính</strong></td></tr>
<tr><td><strong>Lập lịch ngắn hạn</strong></td><td>Quyết định <strong>tiến trình SẴN SÀNG nào sẽ được bộ xử lý thực thi</strong></td></tr>
<tr><td><strong>Lập lịch I/O</strong></td><td>Quyết định <strong>yêu cầu I/O đang chờ của tiến trình nào sẽ được một thiết bị I/O rảnh phục vụ</strong></td></tr>
</table>
<p class="nhan">Phần đề thi thật sự muốn — ba mức liên quan tới bộ xử lý đặt cạnh nhau:</p>
<table>
<tr><th></th><th>Dài hạn</th><th>Trung hạn</th><th>Ngắn hạn</th></tr>
<tr><td><strong>Quyết định gì</strong></td><td>Job này có được thành tiến trình hay không?</td><td>Tiến trình này có thường trú trong bộ nhớ chính không?</td><td>Tiến trình sẵn sàng nào chạy <em>NGAY BÂY GIỜ</em>?</td></tr>
<tr><td><strong>Còn gọi là</strong></td><td>Bộ lập lịch job / kiểm soát kết nạp</td><td>Một phần của chức năng <em>SWAPPING</em></td><td><strong>Bộ điều phối (dispatcher)</strong></td></tr>
<tr><td><strong>Chạy bao lâu một lần</strong></td><td>Hiếm — hàng giây tới hàng phút, khi có job tới hoặc job xong</td><td>Ở giữa — khi áp lực bộ nhớ thay đổi</td><td><strong>Rất thường xuyên</strong> — hàng mili giây, mỗi lần bị chặn, có ngắt, hoặc hết quantum</td></tr>
<tr><td><strong>Điều khiển cái gì</strong></td><td><strong>Tổng số tiến trình trong hệ thống</strong></td><td><strong>ĐỘ ĐA CHƯƠNG TRÌNH</strong> (bao nhiêu tiến trình nằm trong RAM)</td><td>Tiến trình nào đang giữ bộ xử lý</td></tr>
<tr><td><strong>Ảnh hưởng tới</strong></td><td>Thông lượng, và việc hệ thống có bị nhận quá tải hay không</td><td>Mức dùng bộ nhớ, tần suất lỗi trang, hiện tượng thrashing</td><td><strong>Thời gian đáp ứng</strong> và chi phí chuyển ngữ cảnh</td></tr>
<tr><td><strong>Ứng với chuyển trạng thái nào ở Fig 9.7 (slide 22)</strong></td><td>New → Ready ("Admit")</td><td>Giữa Ready/Blocked và các dạng đã bị đẩy ra đĩa</td><td>Ready → Running ("Dispatch")</td></tr>
<tr><td><strong>Giá của việc chạy chính nó</strong></td><td>Được phép chậm và khôn</td><td>Vừa phải</td><td><strong>Bắt buộc PHẢI NHANH</strong> — nó chạy hàng nghìn lần mỗi giây, nên chi phí của chính nó là chi phí thuần tuý phí phạm</td></tr>
</table>
<ul>
<li><strong>Để ý ba mức tạo thành một cái PHỄU.</strong> Dài hạn quyết <em>ai được vào toà nhà</em>; trung hạn quyết <em>ai đang ở trong phòng</em>; ngắn hạn quyết <em>ai đang được nói</em>. Đầu ra của mức trên là tập ứng viên của mức dưới.</li>
<li><strong>Nối ngược chữ n của slide 13.</strong> Đường 1 − p<sup>n</sup> nói n càng lớn thì CPU càng bận. <strong>Lập lịch TRUNG HẠN chính là cái NÚM VẶN đặt n.</strong> Nhỏ quá thì bộ xử lý ngồi không; lớn quá thì bộ nhớ thrashing. Đó mới là lý do tồn tại của mức này.</li>
<li><strong>Vì sao lập lịch ngắn hạn phải RẺ.</strong> Nếu bộ điều phối mất 1 ms để chọn mà quantum là 10 ms thì bạn đã đốt 9 % cái máy vào việc QUYẾT ĐỊNH thay vì LÀM. Đây cũng là lý do chi phí chuyển ngữ cảnh (slide 23) đặt ra một cái sàn cho việc quantum nhỏ tới đâu thì còn có ích.</li>
<li><strong>Lập lịch I/O là cái lạc loài — và nó chẳng liên quan gì tới bộ xử lý.</strong> Nó sắp xếp hàng đợi trước một <em>THIẾT BỊ</em>. Với đĩa quay, đây là chỗ sống của các thuật toán sắp thứ tự tìm kiếm (chính hình học đĩa của Ch.6 làm cho việc sắp xếp có lãi). Với SSD thì cái lãi ấy nhỏ hơn nhiều — phần cứng đổi nên chính sách lập lịch cũng phải đổi theo.</li>
</ul>
<p class="pitfall">⚠️ Bản trích chữ của slide có chữ "han-dled" bị cắt qua hai dòng — đó là lỗi xuống dòng của .pptx, không phải từ khác. Và để ý nhầm lẫn kinh điển khi thi: <strong>"tiến trình nào chạy tiếp theo" là NGẮN HẠN</strong>, còn <strong>"có bao nhiêu tiến trình trong bộ nhớ" là TRUNG HẠN</strong>. Lẫn hai cái này là chỗ mất điểm phổ biến nhất ở bảng này.</p>`],

      [20, 'Long Term Scheduling',
        `<p class="y-chinh">🎯 Five boxes joined by arrows, expanding the top row of Table 9.4. Long-term scheduling <strong>determines which programs are submitted for processing</strong> — it is the gatekeeper at the door of the system.</p>
<table>
<tr><th>Box on the slide</th><th>What it says</th></tr>
<tr><td>1</td><td><strong>Determines which programs are submitted for processing</strong></td></tr>
<tr><td>2</td><td>Once submitted, <strong>a job becomes a PROCESS for the short-term scheduler</strong></td></tr>
<tr><td>3</td><td>In some systems a newly created process <strong>begins in a swapped-out condition</strong>, in which case it is added to a queue for the <strong>medium-term scheduler</strong></td></tr>
<tr><td>4 — <strong>Batch system</strong></td><td>Newly submitted jobs are <strong>routed to disk and held in a batch queue</strong>. The long-term scheduler <strong>creates processes from the queue when it can</strong></td></tr>
<tr><td>5 — <strong>Time-sharing system</strong></td><td>A process request is generated <strong>when a user attempts to connect</strong>. The OS will <strong>accept all authorized comers until the system is saturated</strong>. At that point a connection request is met with a message that <strong>the system is full and to try again later</strong></td></tr>
</table>
<ul>
<li><strong>Box 2 is the definition of "process" arriving quietly.</strong> A <em>job</em> is a request; a <em>process</em> is a job the OS has agreed to run and has built bookkeeping for. The moment of conversion is admission. Slide 23's PCB is exactly the bookkeeping that gets created here.</li>
<li><strong>The two system types make opposite promises.</strong> Batch says "I will accept everything and you will wait" — the queue on disk is unbounded, only completion time suffers. Time sharing says "I will refuse you rather than degrade everyone" — a bounded population, protecting response time. Admission control is where the Table 9.3 objective becomes a policy.</li>
<li><strong>"Until the system is saturated" is the honest version of 1/n.</strong> Slide 17 said each of n active users sees 1/n of the speed. Long-term scheduling is what stops n from growing until 1/n is unusable. The "system is full, try again later" message is not a failure — it is the scheduler defending the users already inside.</li>
<li><strong>Box 3 explains why medium-term scheduling exists at all.</strong> A process can be admitted (it exists, it has a PCB) and yet not be in memory. Existence and residency are two different things — the distinction that the whole swapping half of this chapter (slides 27+) is built on.</li>
<li><strong>You have met this policy outside OS class.</strong> A web server's connection limit, a database's max_connections, a CI system's queued builds, a nightclub's door policy — all long-term scheduling. The alternative (admit everyone) is how a server turns a busy afternoon into an outage.</li>
</ul>
<p class="meo">💡 Remember the level by its question: <strong>long-term asks "should this exist at all?"</strong> Everything about it — running rarely, affecting throughput, being allowed to say no — follows from that.</p>`,
        `<p class="y-chinh">🎯 Năm ô nối bằng mũi tên, mở rộng dòng trên cùng của Table 9.4. Lập lịch dài hạn <strong>xác định chương trình nào được nộp vào để xử lý</strong> — nó là người gác cổng ở cửa hệ thống.</p>
<table>
<tr><th>Ô trên slide</th><th>Nó nói gì</th></tr>
<tr><td>1</td><td><strong>Xác định chương trình nào được nộp vào để xử lý</strong></td></tr>
<tr><td>2</td><td>Một khi đã nộp, <strong>job trở thành một TIẾN TRÌNH đối với bộ lập lịch ngắn hạn</strong></td></tr>
<tr><td>3</td><td>Ở một số hệ thống, tiến trình vừa tạo <strong>bắt đầu ở trạng thái đã bị đẩy ra đĩa (swapped-out)</strong>, khi đó nó được thêm vào hàng đợi của <strong>bộ lập lịch trung hạn</strong></td></tr>
<tr><td>4 — <strong>Hệ theo lô</strong></td><td>Job mới nộp được <strong>đưa xuống đĩa và giữ trong hàng đợi lô</strong>. Bộ lập lịch dài hạn <strong>tạo tiến trình từ hàng đợi ấy khi nào nó làm được</strong></td></tr>
<tr><td>5 — <strong>Hệ chia sẻ thời gian</strong></td><td>Một yêu cầu tạo tiến trình sinh ra <strong>khi người dùng tìm cách kết nối</strong>. OS sẽ <strong>nhận mọi người có quyền cho tới khi hệ thống BÃO HOÀ</strong>. Tới lúc đó, yêu cầu kết nối nhận lại một thông báo rằng <strong>hệ thống đã đầy, xin thử lại sau</strong></td></tr>
</table>
<ul>
<li><strong>Ô 2 là định nghĩa của "tiến trình" xuất hiện một cách lặng lẽ.</strong> Một <em>JOB</em> là một yêu cầu; một <em>TIẾN TRÌNH</em> là job mà OS đã đồng ý chạy và đã dựng sổ sách cho nó. Khoảnh khắc chuyển đổi là lúc KẾT NẠP. Cái PCB ở slide 23 chính là bộ sổ sách được tạo ra ở đây.</li>
<li><strong>Hai loại hệ thống hứa hai điều NGƯỢC NHAU.</strong> Batch nói "tôi nhận tất, và anh sẽ phải chờ" — hàng đợi trên đĩa không có trần, chỉ thời gian hoàn thành là chịu thiệt. Time sharing nói "tôi thà TỪ CHỐI anh còn hơn làm tệ đi cho tất cả" — dân số có trần, để bảo vệ thời gian đáp ứng. Kiểm soát kết nạp là nơi mục tiêu ở Table 9.3 biến thành CHÍNH SÁCH.</li>
<li><strong>"Cho tới khi hệ thống bão hoà" là phiên bản trung thực của 1/n.</strong> Slide 17 nói mỗi người trong n người tích cực chỉ thấy 1/n tốc độ. Lập lịch dài hạn là thứ ngăn n phình to tới mức 1/n không dùng nổi. Thông báo "hệ thống đã đầy, thử lại sau" không phải một thất bại — đó là bộ lập lịch đang bảo vệ những người đã ở bên trong.</li>
<li><strong>Ô 3 giải thích vì sao lập lịch trung hạn tồn tại.</strong> Một tiến trình có thể đã được kết nạp (nó TỒN TẠI, nó có PCB) mà vẫn KHÔNG nằm trong bộ nhớ. Tồn tại và thường trú là hai chuyện khác nhau — đúng cái phân biệt mà cả nửa sau của chương về swapping (slide 27 trở đi) dựng lên trên đó.</li>
<li><strong>Bạn đã gặp chính sách này ngoài giờ học hệ điều hành.</strong> Giới hạn kết nối của một web server, max_connections của cơ sở dữ liệu, hàng đợi build của hệ CI, chính sách cửa của một quán bar — tất cả đều là lập lịch dài hạn. Phương án ngược lại (nhận tất) là cách một máy chủ biến một buổi chiều đông khách thành một sự cố chết dịch vụ.</li>
</ul>
<p class="meo">💡 Nhớ mức này bằng CÂU HỎI của nó: <strong>dài hạn hỏi "thứ này có nên tồn tại không?"</strong> Mọi đặc điểm của nó — chạy hiếm, ảnh hưởng thông lượng, được quyền nói KHÔNG — đều suy ra từ đó.</p>`],

      [21, 'Medium-Term Scheduling and Short-Term Scheduling',
        `<p class="y-chinh">🎯 The two remaining levels, side by side on one slide. Medium-term is about <strong>memory</strong>; short-term is about <strong>the next microsecond</strong>.</p>
<table>
<tr><th>Medium-Term</th><th>Short-Term</th></tr>
<tr><td>Part of the <strong>swapping</strong> function</td><td>Also known as the <strong>DISPATCHER</strong></td></tr>
<tr><td>The swapping-in decision is based on the need to <strong>manage the degree of multiprogramming</strong></td><td><strong>Executes frequently</strong> and makes the <strong>fine-grained decision of which job to execute next</strong></td></tr>
<tr><td>The swapping-in decision will consider the <strong>memory requirements of the swapped-out processes</strong></td><td>—</td></tr>
</table>
<ul>
<li><strong>"Degree of multiprogramming" is the n of slide 13 given an official name.</strong> Everything in that 1 − p<sup>n</sup> table is the medium-term scheduler's problem: raise n and the CPU gets busier, raise it too far and memory runs out. This one slide is where the arithmetic of slide 13 becomes a job title.</li>
<li><strong>Why the second bullet mentions memory requirements explicitly.</strong> Bringing a process back in is not free — it needs its pages. A 100 M process and a 20 M process are not equally easy to readmit. So the medium-term scheduler is doing a packing problem, not just a counting problem. Table 9.1's "Memory required" column is precisely the input it needs.</li>
<li><strong>"Dispatcher" is the exam word.</strong> If a question says <em>dispatcher</em>, it means short-term scheduling, and it means the <strong>Ready → Running</strong> transition on Figure 9.7 (slide 22). Nothing else in the chapter is called the dispatcher.</li>
<li><strong>"Fine-grained" versus "executes frequently" are the same fact twice.</strong> Because it runs on every block, every I/O completion and every quantum expiry, its decisions are small and constant. That is also why its algorithm must be simple: a scheduler that runs 10 000 times a second cannot afford to be clever.</li>
<li><strong>Put the three levels on one timescale and the chapter clicks.</strong> Long-term: minutes, controls <em>how many exist</em>. Medium-term: seconds, controls <em>how many are resident</em>. Short-term: milliseconds, controls <em>which one runs</em>. Three loops nested inside each other, each an order of magnitude faster than the one outside it.</li>
</ul>
<p class="pitfall">⚠️ The slide title in the original file contains a long run of stray spaces ("Medium-Term Scheduling&nbsp;&nbsp;&nbsp;&nbsp;and Short-Term Scheduling") — a formatting artefact of the .pptx, not two separate titles. Content-wise nothing is missing.</p>
<p class="meo">💡 Three questions, three levels: <strong>"may it exist?" (long) · "may it be in RAM?" (medium) · "may it run now?" (short)</strong>. Answer the question and the level names itself.</p>`,
        `<p class="y-chinh">🎯 Hai mức còn lại, đặt cạnh nhau trên cùng một slide. Trung hạn nói về <strong>BỘ NHỚ</strong>; ngắn hạn nói về <strong>micro giây kế tiếp</strong>.</p>
<table>
<tr><th>Trung hạn (Medium-Term)</th><th>Ngắn hạn (Short-Term)</th></tr>
<tr><td>Một phần của chức năng <strong>SWAPPING</strong> (đẩy ra/kéo vào)</td><td>Còn gọi là <strong>BỘ ĐIỀU PHỐI (dispatcher)</strong></td></tr>
<tr><td>Quyết định kéo-vào dựa trên nhu cầu <strong>QUẢN LÝ ĐỘ ĐA CHƯƠNG TRÌNH</strong></td><td><strong>Chạy rất thường xuyên</strong> và đưa ra <strong>quyết định MỊN về job nào chạy tiếp theo</strong></td></tr>
<tr><td>Quyết định kéo-vào sẽ cân nhắc <strong>nhu cầu bộ nhớ của các tiến trình đang bị đẩy ra</strong></td><td>—</td></tr>
</table>
<ul>
<li><strong>"Độ đa chương trình" chính là chữ n của slide 13 được cấp một cái tên chính thức.</strong> Mọi thứ trong bảng 1 − p<sup>n</sup> đều là bài toán của bộ lập lịch trung hạn: nâng n thì CPU bận hơn, nâng quá thì hết bộ nhớ. Slide này là chỗ phép tính ở slide 13 biến thành một chức danh công việc.</li>
<li><strong>Vì sao gạch đầu dòng thứ hai nhắc thẳng tới nhu cầu bộ nhớ.</strong> Kéo một tiến trình quay lại không miễn phí — nó cần chỗ cho các trang của nó. Một tiến trình 100 M và một tiến trình 20 M không dễ kéo về như nhau. Nên bộ lập lịch trung hạn đang giải một bài toán XẾP CHỖ chứ không phải bài toán ĐẾM. Cột "Memory required" của Table 9.1 chính là dữ liệu đầu vào nó cần.</li>
<li><strong>"Dispatcher" là từ khoá đi thi.</strong> Đề nói <em>dispatcher</em> tức là đang nói lập lịch NGẮN HẠN, và tức là chuyển trạng thái <strong>Ready → Running</strong> trên Figure 9.7 (slide 22). Trong cả chương không còn thứ nào được gọi là dispatcher.</li>
<li><strong>"Mịn" và "chạy rất thường xuyên" là cùng một sự thật nói hai lần.</strong> Vì nó chạy mỗi lần có tiến trình bị chặn, mỗi lần I/O xong, mỗi lần hết quantum, nên quyết định của nó nhỏ và liên tục. Đó cũng là lý do thuật toán của nó buộc phải đơn giản: một bộ lập lịch chạy 10 000 lần mỗi giây không có tiền để mà khôn.</li>
<li><strong>Đặt ba mức lên cùng một thang thời gian là cả chương sáng ra.</strong> Dài hạn: hàng phút, điều khiển <em>có bao nhiêu cái tồn tại</em>. Trung hạn: hàng giây, điều khiển <em>có bao nhiêu cái thường trú</em>. Ngắn hạn: hàng mili giây, điều khiển <em>cái nào đang chạy</em>. Ba vòng lặp lồng nhau, mỗi vòng nhanh hơn vòng ngoài một bậc độ lớn.</li>
</ul>
<p class="pitfall">⚠️ Tiêu đề slide trong file gốc có một dãy dài khoảng trắng thừa ("Medium-Term Scheduling&nbsp;&nbsp;&nbsp;&nbsp;and Short-Term Scheduling") — đó là lỗi định dạng của .pptx, không phải hai tiêu đề riêng. Về nội dung không thiếu gì.</p>
<p class="meo">💡 Ba câu hỏi, ba mức: <strong>"được phép tồn tại không?" (dài) · "được phép nằm trong RAM không?" (trung) · "được phép chạy bây giờ không?" (ngắn)</strong>. Trả lời được câu hỏi thì cái mức tự xưng tên.</p>`],

      [22, 'Figure 9.7 — Five-State Process Model',
        `<p class="y-chinh">🎯 The diagram to memorise. Five ovals — <strong>New · Ready · Running · Blocked · Exit</strong> — and six labelled arrows. Every scheduling decision in the chapter is one of these arrows.</p>
<table>
<tr><th>Transition</th><th>From → To</th><th>What causes it</th><th>Who makes the decision</th></tr>
<tr><td><strong>Admit</strong></td><td>New → Ready</td><td>The OS agrees to run this job and builds its PCB</td><td><strong>Long-term scheduler</strong></td></tr>
<tr><td><strong>Dispatch</strong></td><td>Ready → Running</td><td>The processor becomes free and this process is chosen</td><td><strong>Short-term scheduler (dispatcher)</strong></td></tr>
<tr><td><strong>Timeout</strong></td><td>Running → Ready</td><td>The <strong>quantum expired</strong> — timer interrupt</td><td>Hardware timer + dispatcher</td></tr>
<tr><td><strong>Event Wait</strong></td><td>Running → Blocked</td><td>The process asked for I/O, or waits for a lock/message</td><td><strong>The process itself</strong>, voluntarily</td></tr>
<tr><td><strong>Event Occurs</strong></td><td>Blocked → Ready</td><td>The I/O finished — an interrupt arrives</td><td>Hardware / device, via the interrupt handler</td></tr>
<tr><td><strong>Release</strong></td><td>Running → Exit</td><td>The process finished, or was aborted on an error</td><td>The process, or the OS on a fault</td></tr>
</table>
<ul>
<li><strong>Read the three states in the middle as three different kinds of "not finished".</strong> <em>Ready</em> = wants the CPU, does not have it. <em>Running</em> = has it. <em>Blocked</em> = does not want it, because it is waiting for something that is not the CPU. Confusing Ready with Blocked is the single most common error on this figure.</li>
<li><strong>Notice what arrow does NOT exist: Blocked → Running.</strong> A process that was waiting for I/O does not resume directly; it goes to <strong>Ready</strong> and must be dispatched like everyone else. Why? Because the processor is probably busy with someone else — and because fairness is the dispatcher's job, not the device's.</li>
<li><strong>Exactly one state can hold only one process (on a uniprocessor): Running.</strong> Ready and Blocked are queues and can hold many. That single fact is why a scheduler exists at all.</li>
<li><strong>Two different arrows leave Running, and the difference is who decided.</strong> <em>Timeout</em> is <strong>involuntary</strong> — the timer took the processor away (pre-emption). <em>Event Wait</em> is <strong>voluntary</strong> — the process gave it up. A system with only the voluntary arrow is cooperative multitasking, and one bad loop freezes it (slide 5 again).</li>
<li><strong>Connect to PRF192 line by line.</strong> Your program starts: New → Ready → Running. It hits <code>scanf</code>: Running → Blocked (waiting for the keyboard). You press Enter: Blocked → Ready. It gets the CPU back: Ready → Running. It reaches <code>return 0;</code>: Running → Exit. Your first C program walked this exact diagram.</li>
</ul>
<p class="meo">💡 Draw it from memory in ten seconds with a story: <em>born (New), queue (Ready), on stage (Running), stepped out for a phone call (Blocked), went home (Exit)</em>. Then add the rule "you may not walk from the phone call straight back onto the stage — rejoin the queue".</p>
<p class="pitfall">⚠️ Exam trap: "a process waiting for the processor is Blocked" — <strong>FALSE</strong>. Waiting for the <em>processor</em> is <strong>Ready</strong>; Blocked means waiting for <em>an event</em> (I/O, signal, lock). Reading the arrow labels — "Event Wait", "Event Occurs" — settles it every time.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ phải thuộc lòng. Năm hình bầu dục — <strong>New · Ready · Running · Blocked · Exit</strong> — và sáu mũi tên có nhãn. Mọi quyết định lập lịch trong chương đều là MỘT trong các mũi tên này.</p>
<table>
<tr><th>Chuyển</th><th>Từ → Đến</th><th>Nguyên nhân</th><th>Ai quyết định</th></tr>
<tr><td><strong>Admit</strong> (kết nạp)</td><td>New → Ready</td><td>OS đồng ý chạy job này và dựng PCB cho nó</td><td><strong>Bộ lập lịch dài hạn</strong></td></tr>
<tr><td><strong>Dispatch</strong> (điều phối)</td><td>Ready → Running</td><td>Bộ xử lý rảnh ra và tiến trình này được chọn</td><td><strong>Bộ lập lịch ngắn hạn (dispatcher)</strong></td></tr>
<tr><td><strong>Timeout</strong> (hết giờ)</td><td>Running → Ready</td><td><strong>Hết quantum</strong> — ngắt bộ đếm thời gian</td><td>Bộ đếm thời gian phần cứng + dispatcher</td></tr>
<tr><td><strong>Event Wait</strong> (chờ sự kiện)</td><td>Running → Blocked</td><td>Tiến trình yêu cầu I/O, hoặc chờ một khoá/thông điệp</td><td><strong>Chính tiến trình</strong>, một cách tự nguyện</td></tr>
<tr><td><strong>Event Occurs</strong> (sự kiện xảy ra)</td><td>Blocked → Ready</td><td>I/O đã xong — một ngắt tới</td><td>Phần cứng / thiết bị, qua trình xử lý ngắt</td></tr>
<tr><td><strong>Release</strong> (giải phóng)</td><td>Running → Exit</td><td>Tiến trình chạy xong, hoặc bị huỷ vì lỗi</td><td>Tiến trình, hoặc OS khi có lỗi</td></tr>
</table>
<ul>
<li><strong>Hãy đọc ba trạng thái ở giữa như BA KIỂU "chưa xong" khác nhau.</strong> <em>Ready</em> = MUỐN CPU nhưng không có. <em>Running</em> = đang có. <em>Blocked</em> = KHÔNG muốn CPU, vì đang chờ một thứ không phải CPU. Lẫn Ready với Blocked là lỗi phổ biến nhất trên sơ đồ này.</li>
<li><strong>Để ý mũi tên KHÔNG tồn tại: Blocked → Running.</strong> Tiến trình vừa chờ I/O xong KHÔNG chạy tiếp ngay; nó về <strong>Ready</strong> và phải được điều phối như mọi tiến trình khác. Vì sao? Vì bộ xử lý lúc ấy nhiều khả năng đang bận với người khác — và vì công bằng là việc của dispatcher, không phải việc của thiết bị.</li>
<li><strong>Đúng MỘT trạng thái chỉ chứa được một tiến trình (trên máy một bộ xử lý): Running.</strong> Ready và Blocked là hàng đợi, chứa được nhiều. Chỉ sự thật đó thôi đã là lý do bộ lập lịch tồn tại.</li>
<li><strong>Có HAI mũi tên rời khỏi Running, và khác nhau ở chỗ AI quyết định.</strong> <em>Timeout</em> là <strong>CƯỠNG BỨC</strong> — bộ đếm thời gian giật bộ xử lý đi (cướp quyền). <em>Event Wait</em> là <strong>TỰ NGUYỆN</strong> — tiến trình tự nhả ra. Hệ thống chỉ có mũi tên tự nguyện là đa nhiệm hợp tác, và một vòng lặp hỏng là treo cả máy (lại slide 5).</li>
<li><strong>Nối sang PRF192 từng dòng một.</strong> Chương trình của bạn khởi động: New → Ready → Running. Nó gặp <code>scanf</code>: Running → Blocked (chờ bàn phím). Bạn bấm Enter: Blocked → Ready. Nó được CPU trở lại: Ready → Running. Nó tới <code>return 0;</code>: Running → Exit. Chương trình C đầu tiên của bạn đã đi đúng sơ đồ này.</li>
</ul>
<p class="meo">💡 Vẽ lại từ trí nhớ trong mười giây bằng một câu chuyện: <em>ra đời (New), xếp hàng (Ready), lên sân khấu (Running), ra ngoài nghe điện thoại (Blocked), về nhà (Exit)</em>. Rồi thêm luật "nghe điện thoại xong KHÔNG được bước thẳng lên sân khấu — phải ra xếp hàng lại".</p>
<p class="pitfall">⚠️ Bẫy đề thi: "tiến trình đang chờ bộ xử lý là Blocked" — <strong>SAI</strong>. Chờ <em>BỘ XỬ LÝ</em> là <strong>Ready</strong>; Blocked nghĩa là chờ <em>MỘT SỰ KIỆN</em> (I/O, tín hiệu, khoá). Cứ đọc nhãn mũi tên — "Event Wait", "Event Occurs" — là dứt điểm mọi lần.</p>`],

      [23, 'Figure 9.8 — Process Control Block (and what a context switch really costs)',
        `<p class="y-chinh">🎯 One tall box, eight named fields, and three dots meaning "and more". The PCB is <strong>everything the OS must remember about a process while that process is not running</strong> — which is to say, it is what makes a process a thing rather than an event.</p>
<table>
<tr><th>Field on the figure</th><th>What it holds</th><th>Why the OS cannot manage without it</th></tr>
<tr><td><strong>Identifier</strong></td><td>The process ID</td><td>Everything else — files, signals, permissions — is keyed by it</td></tr>
<tr><td><strong>State</strong></td><td>New / Ready / Running / Blocked / Exit</td><td>Tells the dispatcher whether this process is even a candidate (Fig 9.7)</td></tr>
<tr><td><strong>Priority</strong></td><td>Relative importance</td><td>The short-term scheduler needs an ordering, not just a set</td></tr>
<tr><td><strong>Program counter</strong></td><td>The address of the <em>next instruction to be executed</em></td><td>Without it, resuming is impossible — this is the single most important word in the box</td></tr>
<tr><td><strong>Memory pointers</strong></td><td>Start/limit of the program and its data, or the page/segment table base</td><td>Where this process is allowed to be — the hardware boundary of slide 9/11</td></tr>
<tr><td><strong>Context data</strong></td><td>The <strong>contents of the processor registers</strong></td><td>The rest of the CPU state: general registers, condition codes, stack pointer</td></tr>
<tr><td><strong>I/O status information</strong></td><td>Outstanding I/O requests, devices assigned, files open</td><td>Lets the OS know what event would unblock it</td></tr>
<tr><td><strong>Accounting information</strong></td><td>Processor time used, clock time, time limits, account numbers</td><td>The "accounting" service of slide 3, and the data behind Table 9.2</td></tr>
</table>
<p class="nhan">A context switch, step by step — this is the exam answer to "why is switching expensive?":</p>
<table>
<tr><th>#</th><th>What the OS does</th><th>Cost</th></tr>
<tr><td>1</td><td>An interrupt arrives (timer or device); hardware saves at least PC and status word</td><td>Fixed, small</td></tr>
<tr><td>2</td><td>Save the <strong>program counter and all processor registers</strong> of the outgoing process into its PCB (<em>Context data</em>)</td><td>Tens of registers — see Ch.12 for how many a real CPU has</td></tr>
<tr><td>3</td><td>Update the outgoing process's <strong>State</strong> (Running → Ready or Blocked) and its accounting fields</td><td>Small</td></tr>
<tr><td>4</td><td>Move its PCB to the right queue; run the <strong>short-term scheduler</strong> to pick the next process</td><td>The dispatcher's own runtime</td></tr>
<tr><td>5</td><td>Reload the new process's <strong>memory pointers</strong> — page/segment table base, protection registers</td><td>May flush the <strong>TLB</strong> (deck slides 34–35)</td></tr>
<tr><td>6</td><td>Restore its registers and PC, set State = Running, return from interrupt</td><td>Mirror of step 2</td></tr>
</table>
<p class="dap-an">✅ Đáp án — where the real cost hides. Steps 2 and 6 are the <em>direct</em> cost, and they are measurable and modest (microseconds). The <strong>indirect</strong> cost is larger and invisible in this figure: the new process finds the <strong>cache cold</strong> (Ch.4/Ch.5 — its lines were evicted by the previous process) and the <strong>TLB flushed</strong>. So after a switch the machine runs slowly for a while even though no instruction is "switching". That is the real reason a quantum cannot be made tiny — and the reason Ch.4's locality argument reappears here.</p>
<ul>
<li><strong>Two fields tell you the chapter's whole architecture story: Program counter and Context data.</strong> They are Ch.12's processor registers, stored in RAM. The OS can only save what the ISA lets it read — which is why the register set's size is an OS cost, not just a CPU feature, and why RISC designs with many registers (Ch.17) pay for them at every switch.</li>
<li><strong>Memory pointers are the link to the second half of this chapter.</strong> Today it is a base and a limit; after slide 30 it becomes a page table base register. Same PCB slot, much bigger idea.</li>
<li><strong>The three dots at the bottom are honest.</strong> Real PCBs also hold parent/child links, credentials, signal masks, working directory, and a file descriptor table. Linux calls it <code>task_struct</code> and it is thousands of bytes. The figure is a teaching minimum, not a complete list.</li>
<li><strong>Connect to PRF192 and CSI106.</strong> <code>getpid()</code> returns the Identifier field. <code>ps</code> prints State, Priority and Accounting. CSI106 said "the OS keeps a table of processes" — this box is one row of that table, and now you know what each column costs to save and restore.</li>
</ul>
<p class="meo">💡 One-line definition worth memorising: <strong>the PCB is the process's save-file.</strong> Everything needed to switch the process off and later resume it as if nothing happened — and the Program counter is the field without which resuming is impossible.</p>`,
        `<p class="y-chinh">🎯 Một hộp dọc, tám trường có tên, và ba chấm nghĩa là "còn nữa". PCB là <strong>tất cả những gì OS phải NHỚ về một tiến trình trong lúc tiến trình đó KHÔNG chạy</strong> — nói cách khác, nó là thứ biến tiến trình thành một SỰ VẬT chứ không phải một sự kiện thoáng qua.</p>
<table>
<tr><th>Trường trên hình</th><th>Nó chứa gì</th><th>Vì sao OS không thể thiếu</th></tr>
<tr><td><strong>Identifier</strong> (định danh)</td><td>Mã số tiến trình</td><td>Mọi thứ khác — tệp, tín hiệu, quyền — đều tra theo nó</td></tr>
<tr><td><strong>State</strong> (trạng thái)</td><td>New / Ready / Running / Blocked / Exit</td><td>Cho dispatcher biết tiến trình này có phải ứng viên hay không (Fig 9.7)</td></tr>
<tr><td><strong>Priority</strong> (độ ưu tiên)</td><td>Mức quan trọng tương đối</td><td>Bộ lập lịch ngắn hạn cần một THỨ TỰ, không chỉ cần một tập hợp</td></tr>
<tr><td><strong>Program counter</strong></td><td>Địa chỉ của <em>LỆNH KẾ TIẾP sẽ được thực thi</em></td><td>Thiếu nó thì không thể chạy tiếp — đây là chữ quan trọng nhất trong cả cái hộp</td></tr>
<tr><td><strong>Memory pointers</strong> (con trỏ bộ nhớ)</td><td>Đầu/giới hạn của chương trình và dữ liệu, hoặc địa chỉ gốc bảng trang/bảng đoạn</td><td>Tiến trình này được phép nằm ở đâu — chính là ranh giới phần cứng ở slide 9/11</td></tr>
<tr><td><strong>Context data</strong> (dữ liệu ngữ cảnh)</td><td><strong>Nội dung các THANH GHI của bộ xử lý</strong></td><td>Phần còn lại của trạng thái CPU: thanh ghi đa dụng, cờ điều kiện, con trỏ ngăn xếp</td></tr>
<tr><td><strong>I/O status information</strong></td><td>Các yêu cầu I/O còn treo, thiết bị được cấp, tệp đang mở</td><td>Cho OS biết SỰ KIỆN nào sẽ gỡ chặn cho nó</td></tr>
<tr><td><strong>Accounting information</strong></td><td>Thời gian bộ xử lý đã dùng, thời gian đồng hồ, hạn mức, mã tài khoản</td><td>Chính là dịch vụ "thống kê" ở slide 3, và là dữ liệu đứng sau Table 9.2</td></tr>
</table>
<p class="nhan">Chuyển ngữ cảnh, từng bước — đây là đáp án cho câu hỏi "vì sao chuyển đổi lại tốn kém?":</p>
<table>
<tr><th>#</th><th>OS làm gì</th><th>Chi phí</th></tr>
<tr><td>1</td><td>Một ngắt tới (bộ đếm thời gian hoặc thiết bị); phần cứng lưu ít nhất PC và từ trạng thái</td><td>Cố định, nhỏ</td></tr>
<tr><td>2</td><td>Lưu <strong>program counter và TOÀN BỘ thanh ghi bộ xử lý</strong> của tiến trình đi ra vào PCB của nó (trường <em>Context data</em>)</td><td>Hàng chục thanh ghi — xem Ch.12 để biết một CPU thật có bao nhiêu</td></tr>
<tr><td>3</td><td>Cập nhật <strong>State</strong> của tiến trình đi ra (Running → Ready hoặc Blocked) và các trường thống kê</td><td>Nhỏ</td></tr>
<tr><td>4</td><td>Chuyển PCB của nó sang đúng hàng đợi; chạy <strong>bộ lập lịch ngắn hạn</strong> để chọn tiến trình kế</td><td>Chính thời gian chạy của dispatcher</td></tr>
<tr><td>5</td><td>Nạp lại <strong>memory pointers</strong> của tiến trình mới — địa chỉ gốc bảng trang/đoạn, các thanh ghi bảo vệ</td><td>Có thể phải XOÁ SẠCH <strong>TLB</strong> (slide 34–35 của deck)</td></tr>
<tr><td>6</td><td>Khôi phục thanh ghi và PC của nó, đặt State = Running, quay về từ ngắt</td><td>Ảnh gương của bước 2</td></tr>
</table>
<p class="dap-an">✅ Đáp án — chi phí THẬT nấp ở đâu. Bước 2 và 6 là chi phí <em>TRỰC TIẾP</em>, đo được và khá khiêm tốn (hàng micro giây). Chi phí <strong>GIÁN TIẾP</strong> mới lớn và không hiện trên hình này: tiến trình mới thấy <strong>CACHE NGUỘI</strong> (Ch.4/Ch.5 — các dòng của nó đã bị tiến trình trước đuổi đi) và <strong>TLB đã bị xoá</strong>. Nên sau một lần chuyển, máy chạy chậm một lúc dù chẳng có lệnh nào đang "chuyển" cả. Đó mới là lý do thật khiến quantum không thể đặt bé tí — và là lý do lập luận về tính cục bộ của Ch.4 quay lại ở đây.</p>
<ul>
<li><strong>Hai trường kể trọn câu chuyện kiến trúc của chương: Program counter và Context data.</strong> Chúng chính là các thanh ghi bộ xử lý của Ch.12, đem cất vào RAM. OS chỉ lưu được những gì ISA cho phép nó đọc — nên KÍCH THƯỚC tập thanh ghi là một chi phí của hệ điều hành chứ không chỉ là một đặc tính của CPU, và các thiết kế RISC nhiều thanh ghi (Ch.17) phải trả giá đó ở MỖI lần chuyển.</li>
<li><strong>Memory pointers là mối nối sang nửa sau của chương.</strong> Hôm nay nó là một base và một limit; sau slide 30 nó thành thanh ghi địa chỉ gốc bảng trang. Cùng một ô trong PCB, ý tưởng lớn hơn hẳn.</li>
<li><strong>Ba dấu chấm dưới đáy là sự trung thực.</strong> PCB thật còn giữ liên kết cha/con, thông tin định danh, mặt nạ tín hiệu, thư mục làm việc, và bảng mô tả tệp. Linux gọi nó là <code>task_struct</code> và nó dài hàng nghìn byte. Hình này là mức tối thiểu để dạy, không phải danh sách đầy đủ.</li>
<li><strong>Nối sang PRF192 và CSI106.</strong> <code>getpid()</code> trả về trường Identifier. Lệnh <code>ps</code> in ra State, Priority và Accounting. CSI106 bảo "OS giữ một bảng các tiến trình" — cái hộp này là MỘT DÒNG của bảng đó, và giờ bạn biết mỗi cột tốn bao nhiêu để lưu và khôi phục.</li>
</ul>
<p class="meo">💡 Định nghĩa một dòng đáng thuộc: <strong>PCB là FILE SAVE của tiến trình.</strong> Đủ mọi thứ cần thiết để tắt tiến trình đi rồi bật lại như chưa hề có chuyện gì — và Program counter là trường mà thiếu nó thì không thể chạy tiếp.</p>`],

      [24, 'Figure 9.9 — Scheduling Example',
        `<p class="y-chinh">🎯 Three snapshots of the same memory, (a) → (b) → (c), showing the processor changing hands. Each snapshot has the same layout: an <strong>Operating system</strong> region at the top holding <strong>Service handler · Interrupt handler · Scheduler</strong>, then process <strong>A</strong>, then process <strong>B</strong>, then <strong>Other partitions</strong>. A starburst labelled <strong>"In control"</strong> marks who holds the processor.</p>
<table>
<tr><th>Snapshot</th><th>A is</th><th>B is</th><th>"In control" starburst is on</th><th>What just happened</th></tr>
<tr><td><strong>(a)</strong></td><td>"Running"</td><td>"Ready"</td><td>Process <strong>A</strong>'s partition</td><td>Normal execution — the OS is not running at all</td></tr>
<tr><td><strong>(b)</strong></td><td>"Waiting"</td><td>"Ready"</td><td>The <strong>Operating system</strong>, up near the scheduler</td><td>A issued an I/O request → service call → OS took over; A is now blocked</td></tr>
<tr><td><strong>(c)</strong></td><td>"Waiting"</td><td>"Running"</td><td>Process <strong>B</strong>'s partition</td><td>The scheduler chose B and dispatched it</td></tr>
</table>
<ul>
<li><strong>The figure's one job is to show that the OS occupies the processor TOO, and only in panel (b).</strong> In (a) and (c) the OS is sitting in memory doing nothing — it is not a supervisor watching from outside, it is code that runs only when something hands it the processor. This is slide 5's second assertion, now in three frames.</li>
<li><strong>Map the frames onto Figure 9.7 (slide 22).</strong> (a) → (b) is the arrow <strong>Event Wait</strong> (Running → Blocked). (b) → (c) is <strong>Dispatch</strong> (Ready → Running) for B. The OS's own turn in (b) is the context switch of slide 23 happening.</li>
<li><strong>Note the vocabulary shift: the figure says "Waiting", Figure 9.7 says "Blocked".</strong> Same state, two names. Stallings uses both; an exam may use either. Remember they mean <em>waiting for an event, not for the processor</em>.</li>
<li><strong>Three code boxes in the OS region, three ways in.</strong> <em>Service handler</em> = the process asked (a system call). <em>Interrupt handler</em> = a device or timer forced it. <em>Scheduler</em> = the part that decides who is next, called by the other two. Slide 25 draws exactly these three boxes with their queues.</li>
<li><strong>"Other partitions" is a preview.</strong> Memory is already divided into fixed regions here — partitioning, which slide 28 of the deck will name and measure. In this figure it is only scenery; keep it in mind for the second half.</li>
</ul>
<p class="pitfall">⚠️ Do not read (a) → (b) → (c) as "three processes took turns". There are only two user processes; the middle frame is the <strong>OS itself</strong> running. A common exam mistake is to count the OS's turn as free — it is not, and it is exactly the overhead that makes very small quanta wasteful.</p>`,
        `<p class="y-chinh">🎯 Ba ảnh chụp của cùng một bộ nhớ, (a) → (b) → (c), cho thấy bộ xử lý đổi chủ. Mỗi ảnh cùng một bố cục: vùng <strong>Operating system</strong> ở trên chứa <strong>Service handler · Interrupt handler · Scheduler</strong>, rồi tiến trình <strong>A</strong>, rồi tiến trình <strong>B</strong>, rồi <strong>Other partitions</strong>. Một vòng tia sáng ghi <strong>"In control"</strong> đánh dấu ai đang giữ bộ xử lý.</p>
<table>
<tr><th>Ảnh</th><th>A đang</th><th>B đang</th><th>Vòng "In control" nằm ở</th><th>Vừa xảy ra chuyện gì</th></tr>
<tr><td><strong>(a)</strong></td><td>"Running"</td><td>"Ready"</td><td>Phân vùng của tiến trình <strong>A</strong></td><td>Chạy bình thường — hệ điều hành KHÔNG hề đang chạy</td></tr>
<tr><td><strong>(b)</strong></td><td>"Waiting"</td><td>"Ready"</td><td><strong>Hệ điều hành</strong>, ngay cạnh bộ lập lịch</td><td>A phát yêu cầu I/O → gọi dịch vụ → OS tiếp quản; A giờ bị chặn</td></tr>
<tr><td><strong>(c)</strong></td><td>"Waiting"</td><td>"Running"</td><td>Phân vùng của tiến trình <strong>B</strong></td><td>Bộ lập lịch chọn B và điều phối cho nó chạy</td></tr>
</table>
<ul>
<li><strong>Việc duy nhất của hình này là cho thấy OS CŨNG chiếm bộ xử lý, và chỉ ở khung (b).</strong> Ở (a) và (c), OS ngồi trong bộ nhớ chẳng làm gì — nó KHÔNG phải một giám thị đứng ngoài quan sát, nó là mã lệnh chỉ chạy khi có ai đó trao bộ xử lý cho nó. Đây là ý thứ hai của slide 5, nay dựng thành ba khung hình.</li>
<li><strong>Ánh xạ ba khung sang Figure 9.7 (slide 22).</strong> (a) → (b) là mũi tên <strong>Event Wait</strong> (Running → Blocked). (b) → (c) là <strong>Dispatch</strong> (Ready → Running) cho B. Lượt của chính OS ở khung (b) chính là cuộc chuyển ngữ cảnh của slide 23 đang diễn ra.</li>
<li><strong>Để ý đổi từ vựng: hình này ghi "Waiting", còn Figure 9.7 ghi "Blocked".</strong> Cùng một trạng thái, hai tên gọi. Stallings dùng cả hai; đề thi có thể dùng bất kỳ cái nào. Nhớ rằng nó nghĩa là <em>đang chờ một SỰ KIỆN, không phải chờ bộ xử lý</em>.</li>
<li><strong>Ba ô mã trong vùng OS, ba lối vào.</strong> <em>Service handler</em> = tiến trình tự XIN (một lời gọi hệ thống). <em>Interrupt handler</em> = một thiết bị hoặc bộ đếm thời gian ÉP. <em>Scheduler</em> = phần quyết định ai tiếp theo, do hai cái kia gọi tới. Slide 25 vẽ đúng ba ô đó kèm các hàng đợi của chúng.</li>
<li><strong>"Other partitions" là một cú nhá hàng.</strong> Bộ nhớ ở đây đã bị chia thành các vùng cố định — tức PHÂN VÙNG, thứ mà slide 28 của deck sẽ gọi tên và đo đạc. Trong hình này nó mới chỉ là phông nền; nhớ để dành cho nửa sau.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc (a) → (b) → (c) thành "ba tiến trình thay phiên nhau". Chỉ có HAI tiến trình người dùng; khung giữa là <strong>chính HỆ ĐIỀU HÀNH</strong> đang chạy. Sai lầm hay gặp khi thi là coi lượt của OS là miễn phí — không hề, và đó đúng là phần chi phí khiến quantum quá nhỏ trở nên lãng phí.</p>`],

      [25, 'Figure 9.10 — Key Elements of an Operating System for Multiprogramming',
        `<p class="y-chinh">🎯 The OS drawn as a machine with <strong>two inputs, three queues, and one output</strong>. Inside the grey <strong>Operating System</strong> box: a <strong>Service Call Handler (code)</strong>, an <strong>Interrupt Handler (code)</strong>, a row of three queue stacks labelled <strong>Long-Term Queue · Short-Term Queue · I/O Queues</strong>, and a <strong>Short-Term Scheduler (code)</strong> whose arrow points out of the box to <strong>Pass Control to Process</strong>.</p>
<table>
<tr><th>Element</th><th>Arrow direction</th><th>What it corresponds to</th></tr>
<tr><td><strong>Service Call from Process</strong> → Service Call Handler</td><td>In</td><td>Voluntary entry: a system call. Fig 9.7's <em>Event Wait</em></td></tr>
<tr><td><strong>Interrupt from Process</strong> → Interrupt Handler</td><td>In</td><td>A fault or trap caused by the process (bad address, privileged instruction — slide 11)</td></tr>
<tr><td><strong>Interrupt from I/O</strong> → Interrupt Handler</td><td>In</td><td>A device finished. Fig 9.7's <em>Event Occurs</em>; also the timer's Timeout</td></tr>
<tr><td><strong>Long-Term Queue</strong></td><td>Storage</td><td>Jobs admitted but not yet processes — the long-term scheduler's pool (slide 20)</td></tr>
<tr><td><strong>Short-Term Queue</strong></td><td>Storage</td><td>The <strong>Ready</strong> state of Fig 9.7, as an actual data structure of PCBs</td></tr>
<tr><td><strong>I/O Queues</strong> (drawn as several)</td><td>Storage</td><td>The <strong>Blocked</strong> state — one queue <em>per device</em>, which is why it is plural</td></tr>
<tr><td><strong>Short-Term Scheduler</strong> → Pass Control to Process</td><td>Out</td><td>Fig 9.7's <em>Dispatch</em>. The only arrow that leaves the box</td></tr>
</table>
<ul>
<li><strong>The single most useful reading: the OS has exactly three ways to start running, and one way to stop.</strong> Three arrows in (service call, process interrupt, I/O interrupt), one arrow out (pass control). There is no fourth entrance. If nothing calls and nothing interrupts, the OS does not run — slide 5's point, now as a block diagram.</li>
<li><strong>The states of Figure 9.7 are QUEUES here — that is the whole lesson of this slide.</strong> "Ready" is not an adjective stored in a variable, it is <em>membership of the short-term queue</em>. Changing state means moving a PCB from one queue to another. That is literally all a scheduler does.</li>
<li><strong>Why I/O Queues is plural and the others are singular.</strong> All ready processes compete for one processor, so one queue suffices. But blocked processes wait for <em>different</em> devices, and the disk finishing does not unblock the process waiting for the printer. One queue per device is the only arrangement that works — and it is also where I/O scheduling (Table 9.4's fourth row) operates.</li>
<li><strong>Notice the Long-Term Queue is drawn inside the OS but has no arrow out on this figure.</strong> Its exit is the <em>Admit</em> transition, performed rarely, when memory and device conditions allow. Contrast it with the short-term queue, which the scheduler drains constantly. The visual asymmetry is the timescale difference of slide 19.</li>
<li><strong>This figure is the answer to "what IS an operating system, concretely?"</strong> Two handlers, three queues, one scheduler. Everything else in a modern kernel is elaboration of these seven boxes.</li>
</ul>
<p class="meo">💡 If you can redraw this diagram and label each arrow with its Figure 9.7 transition, you have effectively learned slides 19–26 in one picture. Try it: service call → Event Wait, I/O interrupt → Event Occurs, timer interrupt → Timeout, scheduler out → Dispatch.</p>`,
        `<p class="y-chinh">🎯 Hệ điều hành vẽ thành một cỗ máy có <strong>hai loại đầu vào, ba hàng đợi, và một đầu ra</strong>. Trong ô xám <strong>Operating System</strong>: một <strong>Service Call Handler (code)</strong>, một <strong>Interrupt Handler (code)</strong>, một hàng ba chồng hàng đợi ghi <strong>Long-Term Queue · Short-Term Queue · I/O Queues</strong>, và một <strong>Short-Term Scheduler (code)</strong> có mũi tên chỉ ra khỏi ô tới <strong>Pass Control to Process</strong>.</p>
<table>
<tr><th>Thành phần</th><th>Chiều mũi tên</th><th>Nó ứng với cái gì</th></tr>
<tr><td><strong>Service Call from Process</strong> → Service Call Handler</td><td>Vào</td><td>Lối vào TỰ NGUYỆN: một lời gọi hệ thống. Là <em>Event Wait</em> của Fig 9.7</td></tr>
<tr><td><strong>Interrupt from Process</strong> → Interrupt Handler</td><td>Vào</td><td>Một lỗi hoặc bẫy do chính tiến trình gây ra (địa chỉ sai, lệnh đặc quyền — slide 11)</td></tr>
<tr><td><strong>Interrupt from I/O</strong> → Interrupt Handler</td><td>Vào</td><td>Một thiết bị vừa xong. Là <em>Event Occurs</em> của Fig 9.7; cũng là Timeout của bộ đếm thời gian</td></tr>
<tr><td><strong>Long-Term Queue</strong></td><td>Chứa</td><td>Job đã nhận nhưng chưa thành tiến trình — bể chứa của bộ lập lịch dài hạn (slide 20)</td></tr>
<tr><td><strong>Short-Term Queue</strong></td><td>Chứa</td><td>Trạng thái <strong>Ready</strong> của Fig 9.7, dưới dạng một CẤU TRÚC DỮ LIỆU thật chứa các PCB</td></tr>
<tr><td><strong>I/O Queues</strong> (vẽ thành nhiều cái)</td><td>Chứa</td><td>Trạng thái <strong>Blocked</strong> — MỖI THIẾT BỊ một hàng đợi, nên nó ở số nhiều</td></tr>
<tr><td><strong>Short-Term Scheduler</strong> → Pass Control to Process</td><td>Ra</td><td>Là <em>Dispatch</em> của Fig 9.7. Mũi tên DUY NHẤT rời khỏi ô</td></tr>
</table>
<ul>
<li><strong>Cách đọc hữu ích nhất: OS có ĐÚNG BA đường để bắt đầu chạy, và MỘT đường để dừng.</strong> Ba mũi tên vào (gọi dịch vụ, ngắt do tiến trình, ngắt do I/O), một mũi tên ra (trao quyền). Không có lối vào thứ tư. Nếu không ai gọi và không có gì ngắt thì OS KHÔNG chạy — đúng ý của slide 5, nay dưới dạng sơ đồ khối.</li>
<li><strong>Các TRẠNG THÁI của Figure 9.7 ở đây là các HÀNG ĐỢI — đó là toàn bộ bài học của slide này.</strong> "Ready" không phải một tính từ cất trong biến, nó là <em>TƯ CÁCH THÀNH VIÊN của hàng đợi ngắn hạn</em>. Đổi trạng thái nghĩa là chuyển một PCB từ hàng đợi này sang hàng đợi khác. Bộ lập lịch đúng nghĩa đen chỉ làm bấy nhiêu.</li>
<li><strong>Vì sao I/O Queues ở số NHIỀU còn hai cái kia số ít.</strong> Mọi tiến trình sẵn sàng đều tranh MỘT bộ xử lý nên một hàng đợi là đủ. Nhưng tiến trình bị chặn thì chờ những THIẾT BỊ KHÁC NHAU, và việc cái đĩa làm xong không gỡ chặn cho tiến trình đang chờ máy in. Mỗi thiết bị một hàng đợi là cách sắp xếp duy nhất chạy được — và đó cũng là nơi lập lịch I/O (dòng thứ tư của Table 9.4) hoạt động.</li>
<li><strong>Để ý Long-Term Queue vẽ trong ô OS nhưng trên hình này KHÔNG có mũi tên ra.</strong> Lối ra của nó là chuyển trạng thái <em>Admit</em>, thực hiện HIẾM, khi điều kiện bộ nhớ và thiết bị cho phép. So với hàng đợi ngắn hạn mà bộ lập lịch rút liên tục. Sự bất đối xứng trong hình chính là khác biệt THANG THỜI GIAN ở slide 19.</li>
<li><strong>Hình này là câu trả lời cho "vậy hệ điều hành CỤ THỂ là cái gì?"</strong> Hai trình xử lý, ba hàng đợi, một bộ lập lịch. Mọi thứ khác trong một nhân hiện đại đều là sự khai triển của bảy cái ô này.</li>
</ul>
<p class="meo">💡 Nếu vẽ lại được sơ đồ này và ghi nhãn mỗi mũi tên bằng đúng tên chuyển trạng thái của Figure 9.7 thì coi như bạn đã học xong slide 19–26 trong một bức tranh. Thử đi: gọi dịch vụ → Event Wait, ngắt I/O → Event Occurs, ngắt bộ đếm thời gian → Timeout, mũi tên ra của bộ lập lịch → Dispatch.</p>`],

      [26, 'Figure 9.11 — Queuing Diagram Representation of Processor Scheduling',
        `<p class="y-chinh">🎯 The whole scheduling story as a flow of processes through boxes and loops. <strong>Admit</strong> → <strong>Long-term queue</strong> → <strong>Short-term queue</strong> → <strong>Processor</strong> → <strong>End</strong>, plus two feedback paths back from the processor: a direct one to the short-term queue, and one down through the <strong>I/O 1 / I/O 2 / … / I/O n queues</strong>, each labelled <strong>I/O k Occurs</strong>.</p>
<table>
<tr><th>Path on the diagram</th><th>Fig 9.7 transition</th><th>Why a process takes it</th></tr>
<tr><td>Admit → long-term queue → short-term queue</td><td><strong>Admit</strong> (New → Ready)</td><td>The job was accepted and became a process</td></tr>
<tr><td>Short-term queue → Processor</td><td><strong>Dispatch</strong> (Ready → Running)</td><td>The dispatcher picked it</td></tr>
<tr><td>Processor → End</td><td><strong>Release</strong> (Running → Exit)</td><td>It finished or was aborted</td></tr>
<tr><td>Processor → straight back to the short-term queue (the upper feedback line)</td><td><strong>Timeout</strong> (Running → Ready)</td><td>Its quantum expired — it is still runnable, so it rejoins the queue</td></tr>
<tr><td>Processor → an I/O k queue → "I/O k Occurs" → back to the short-term queue</td><td><strong>Event Wait</strong> then <strong>Event Occurs</strong></td><td>It requested I/O, waited for that device, and the completion made it ready again</td></tr>
</table>
<ul>
<li><strong>The two feedback loops are the two different reasons a process leaves the processor, and they have very different lengths.</strong> The timeout loop is short and cheap — straight back into the ready queue. The I/O loop is long — out to a device, wait milliseconds, come back. Multiprogramming exists to fill the time processes spend on the long loop.</li>
<li><strong>Every arrow re-enters at the SHORT-TERM queue, never at the processor.</strong> Look carefully: neither feedback path touches the processor box directly. That is Figure 9.7's missing "Blocked → Running" arrow, drawn as a routing rule. Fairness is enforced by the shape of the plumbing.</li>
<li><strong>The diagram makes the two queue types visibly different.</strong> One long-term queue (a job enters it once) versus one short-term queue that a process re-enters many times in its life. A process may loop through the short-term queue thousands of times; it passes the long-term queue exactly once.</li>
<li><strong>This is a queueing network, and that is not an accident.</strong> Drawn this way, the system can be analysed with queueing theory: arrival rates, service rates, utilisation, and the ceiling you saw as 1 − p<sup>n</sup> on slide 13. The figure is the bridge from "OS description" to "performance model".</li>
<li><strong>Where the chapter goes next.</strong> Everything so far assumed a process, once admitted, stays in memory. Slide 27 breaks that assumption with <strong>swapping</strong>, adding a suspended state and a path off to disk — and that is where the second half of this chapter (and the memory management that dominates it) begins.</li>
</ul>
<p class="meo">💡 A five-second self-test for the whole lesson: put your finger on the Processor box and name the three ways out — <em>End</em>, <em>Timeout</em>, <em>I/O wait</em> — and where each one lands. If you can do that, you can answer any exam question built on Figures 9.7, 9.10 and 9.11, because they are three drawings of one mechanism.</p>`,
        `<p class="y-chinh">🎯 Trọn câu chuyện lập lịch dưới dạng DÒNG CHẢY của các tiến trình qua các ô và các vòng lặp. <strong>Admit</strong> → <strong>Long-term queue</strong> → <strong>Short-term queue</strong> → <strong>Processor</strong> → <strong>End</strong>, cộng hai đường phản hồi quay về từ bộ xử lý: một đường thẳng về hàng đợi ngắn hạn, và một đường đi xuống qua các <strong>hàng đợi I/O 1 / I/O 2 / … / I/O n</strong>, mỗi cái ghi <strong>I/O k Occurs</strong>.</p>
<table>
<tr><th>Đường đi trên sơ đồ</th><th>Chuyển trạng thái ở Fig 9.7</th><th>Vì sao tiến trình đi đường đó</th></tr>
<tr><td>Admit → hàng đợi dài hạn → hàng đợi ngắn hạn</td><td><strong>Admit</strong> (New → Ready)</td><td>Job được chấp nhận và trở thành tiến trình</td></tr>
<tr><td>Hàng đợi ngắn hạn → Processor</td><td><strong>Dispatch</strong> (Ready → Running)</td><td>Bộ điều phối chọn nó</td></tr>
<tr><td>Processor → End</td><td><strong>Release</strong> (Running → Exit)</td><td>Nó chạy xong hoặc bị huỷ</td></tr>
<tr><td>Processor → quay THẲNG về hàng đợi ngắn hạn (đường phản hồi phía trên)</td><td><strong>Timeout</strong> (Running → Ready)</td><td>Hết quantum — nó vẫn chạy được, nên xếp hàng lại</td></tr>
<tr><td>Processor → một hàng đợi I/O k → "I/O k Occurs" → về lại hàng đợi ngắn hạn</td><td><strong>Event Wait</strong> rồi <strong>Event Occurs</strong></td><td>Nó xin I/O, chờ đúng thiết bị đó, và việc hoàn tất làm nó sẵn sàng trở lại</td></tr>
</table>
<ul>
<li><strong>Hai vòng phản hồi là HAI lý do khác nhau khiến tiến trình rời bộ xử lý, và chúng dài ngắn rất khác nhau.</strong> Vòng timeout ngắn và rẻ — quay thẳng vào hàng đợi sẵn sàng. Vòng I/O thì dài — đi ra tận thiết bị, chờ hàng mili giây, rồi mới về. Đa chương trình tồn tại để LẤP ĐẦY khoảng thời gian mà tiến trình đi trên vòng dài đó.</li>
<li><strong>Mọi mũi tên đều quay về HÀNG ĐỢI NGẮN HẠN, không bao giờ về thẳng bộ xử lý.</strong> Nhìn kỹ: không đường phản hồi nào chạm thẳng vào ô Processor. Đó chính là cái mũi tên "Blocked → Running" còn THIẾU của Figure 9.7, vẽ ra thành một luật đi đường. Sự công bằng được ép buộc bằng chính hình dạng của hệ ống dẫn.</li>
<li><strong>Sơ đồ làm lộ rõ hai loại hàng đợi khác nhau thế nào.</strong> Một hàng đợi dài hạn (job vào đó đúng MỘT lần) so với một hàng đợi ngắn hạn mà tiến trình quay lại NHIỀU lần trong đời nó. Một tiến trình có thể lượn qua hàng đợi ngắn hạn hàng nghìn lần; nó đi qua hàng đợi dài hạn đúng một lần.</li>
<li><strong>Đây là một MẠNG HÀNG ĐỢI, và điều đó không phải tình cờ.</strong> Vẽ theo kiểu này thì hệ thống phân tích được bằng lý thuyết hàng đợi: tốc độ đến, tốc độ phục vụ, mức sử dụng, và cái trần mà bạn đã thấy dưới dạng 1 − p<sup>n</sup> ở slide 13. Hình này là CÂY CẦU từ "mô tả hệ điều hành" sang "mô hình hiệu năng".</li>
<li><strong>Chương đi tiếp về đâu.</strong> Tới giờ mọi thứ đều giả định rằng tiến trình một khi đã kết nạp thì nằm lì trong bộ nhớ. Slide 27 phá vỡ giả định đó bằng <strong>SWAPPING</strong>, thêm một trạng thái treo và một lối đi ra đĩa — và đó là nơi nửa sau của chương (cùng phần quản lý bộ nhớ chiếm phần lớn nó) bắt đầu.</li>
</ul>
<p class="meo">💡 Bài tự kiểm năm giây cho cả bài học: đặt ngón tay vào ô Processor và gọi tên ba lối ra — <em>End</em>, <em>Timeout</em>, <em>chờ I/O</em> — cùng nơi mỗi lối đó dẫn tới. Làm được vậy là trả lời được mọi câu hỏi thi dựng trên Figure 9.7, 9.10 và 9.11, vì ba hình đó chỉ là ba cách vẽ của MỘT cơ chế.</p>`],
    ]),
  ].join('\n'),
};
