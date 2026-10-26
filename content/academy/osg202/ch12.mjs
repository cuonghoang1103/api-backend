/**
 * OSG202 · Chương 12 — Operating System Design (osg12: 12.A 1–18).
 * Bài 📑 học theo từng slide: osg12 (tmp_12.pptx, slide 1–18).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch12.
 * Quiz MỚI (10 câu, slug osg202-quiz-ch12).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 12.A — 📑 Slide by slide · OS Design: goals, interface, structure, naming, space–time, caching, projects (slides 1–18) ───────── */
const L_osg12_1 = {
  title: '12.A — 📑 Slide by slide · OS Design: goals, interface, structure, naming, space–time, caching, projects (slides 1–18)|||12.A — 📑 Học theo từng slide · Thiết kế HĐH: mục tiêu, giao diện, cấu trúc, đặt tên, không gian–thời gian, cache, dự án (slide 1–18)',
  slug: 'osg202-slide-osg12-1',
  type: 'VIDEO',
  description: 'Giảng đủ 18 slide của Chương 12 (Tanenbaum, Modern Operating Systems 4e) — chương nói về cách THIẾT KẾ một hệ điều hành và, rộng hơn, mọi hệ thống phần mềm lớn: bốn mục tiêu, ba nguyên tắc thiết kế giao diện, mô hình thực thi thuật toán và hướng sự kiện, cấu trúc phân lớp và microkernel, cơ chế và chính sách, đặt tên, gắn kết sớm và muộn, tĩnh và động, ẩn phần cứng, đánh đổi không gian và thời gian, bộ đệm, nhóm lập trình viên trưởng, luật Brooks, và xu hướng ảo hoá — mỗi ý có chương trình chạy thật trên Linux, mô phỏng hoặc sơ đồ, và liên hệ thẳng tới thiết kế API, cache Redis/HTTP, monolith và microservices.',
  content: [
    bi(`<span class="eyebrow">Chapter 12 · Lesson 12.A · deck "Chapter 12 · Operating System Design", slides 1–18</span>
<h2>How to design a big system: the lessons of fifty years of operating systems</h2>
<p class="lead">Chapters 1–11 explained what an operating system IS. Chapter 12 asks a different question: <strong>how do you design one</strong> so that it is simple, fast and still understandable ten years later? It is the shortest chapter of the book and the one that transfers best: everything here applies to a backend service, a framework, a database or an API with hundreds of endpoints. The 18 slides follow sections 12.1–12.6 of the book: the nature of the design problem (slides 1–2), interface design (3–4), implementation — structure, naming, binding time, hiding the hardware (5–9), performance — space–time trade-offs and caching (10–14), project management (15–16) and trends (17–18). Every idea is attached to a program that runs on a real Linux, a simulation or a diagram, because design advice you cannot test is just opinion.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>12.1 The nature of the design problem</td><td>state the four goals of a general-purpose OS and say why design is hard</td></tr>
<tr><td>3–4</td><td>12.2 Interface design</td><td>judge an interface by simplicity, completeness and efficiency; tell algorithmic code from event-driven code</td></tr>
<tr><td>5–6</td><td>12.3.1 System structure</td><td>compare layered, microkernel, exokernel and monolithic designs and say what each costs</td></tr>
<tr><td>7–8</td><td>12.3 Naming, binding time, static vs dynamic</td><td>explain an external name mapped to an internal name, late binding and why fixed-size tables hurt</td></tr>
<tr><td>9</td><td>12.3 Useful techniques: hiding the hardware</td><td>isolate platform-specific code behind one switch</td></tr>
<tr><td>10–14</td><td>12.4 Performance</td><td>trade space for time, build a cache, and measure before you optimise</td></tr>
<tr><td>15–16</td><td>12.5 Project management</td><td>use Brooks' law and the "working system from day 1" idea</td></tr>
<tr><td>17–18</td><td>12.6 Trends</td><td>place virtualization and the cloud in the picture</td></tr>
</tbody>
</table>
<div class="callout">The old web lessons 1.x–11.x are the foundation; this chapter keeps pointing back to them ("the file system of lesson 4", "the scheduler of lesson 2") because design is about how the parts fit. Chapter 7 (Advanced 1) already covered virtualization in depth — slide 17 only connects it to design.</div>`,
    `<span class="eyebrow">Chương 12 · Bài 12.A · deck "Chapter 12 · Operating System Design", slide 1–18</span>
<h2>Thiết kế một hệ thống lớn thế nào: bài học của năm mươi năm hệ điều hành</h2>
<p class="lead">Các chương 1–11 giải thích hệ điều hành LÀ gì. Chương 12 hỏi một câu khác: <strong>thiết kế một hệ điều hành thế nào</strong> để nó đơn giản, nhanh và mười năm sau vẫn còn hiểu được? Đây là chương ngắn nhất của sách và cũng là chương "mang đi dùng ở chỗ khác" tốt nhất: mọi điều ở đây áp dụng được cho một dịch vụ backend, một framework, một cơ sở dữ liệu hay một API có hàng trăm endpoint. 18 slide đi theo mục 12.1–12.6 của sách: bản chất bài toán thiết kế (slide 1–2), thiết kế giao diện (3–4), cài đặt — cấu trúc, đặt tên, thời điểm gắn kết, ẩn phần cứng (5–9), hiệu năng — đánh đổi không gian–thời gian và bộ đệm (10–14), quản lý dự án (15–16) và xu hướng (17–18). Mỗi ý gắn với một chương trình chạy thật trên Linux, một mô phỏng hoặc một sơ đồ, vì lời khuyên thiết kế mà không thử được thì chỉ là ý kiến.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–2</td><td>12.1 Bản chất bài toán thiết kế</td><td>nêu bốn mục tiêu của HĐH đa năng và giải thích vì sao thiết kế khó</td></tr>
<tr><td>3–4</td><td>12.2 Thiết kế giao diện</td><td>đánh giá một giao diện theo tính đơn giản, đầy đủ, hiệu quả; phân biệt mã thuật toán với mã hướng sự kiện</td></tr>
<tr><td>5–6</td><td>12.3.1 Cấu trúc hệ thống</td><td>so sánh thiết kế phân lớp, microkernel, exokernel, nguyên khối và nói mỗi loại trả giá gì</td></tr>
<tr><td>7–8</td><td>12.3 Đặt tên, thời điểm gắn kết, tĩnh và động</td><td>giải thích tên ngoài ánh xạ thành tên trong, gắn kết muộn, và vì sao bảng cỡ cố định gây hại</td></tr>
<tr><td>9</td><td>12.3 Kỹ thuật hữu ích: ẩn phần cứng</td><td>cô lập mã riêng cho từng nền tảng sau một công tắc</td></tr>
<tr><td>10–14</td><td>12.4 Hiệu năng</td><td>đổi không gian lấy thời gian, dựng bộ đệm, và đo trước khi tối ưu</td></tr>
<tr><td>15–16</td><td>12.5 Quản lý dự án</td><td>dùng luật Brooks và ý "có hệ thống chạy được từ ngày 1"</td></tr>
<tr><td>17–18</td><td>12.6 Xu hướng</td><td>đặt ảo hoá và đám mây vào bức tranh chung</td></tr>
</tbody>
</table>
<div class="callout">Các bài web cũ 1.x–11.x là nền; chương này liên tục chỉ ngược về chúng ("hệ thống tệp ở bài 4", "bộ lập lịch ở bài 2") vì thiết kế là chuyện các bộ phận khớp với nhau thế nào. Chương 7 (Advanced 1) đã nói sâu về ảo hoá — slide 17 chỉ nối nó vào bài toán thiết kế.</div>`),
    walkHead('osg12', 1, 18),
    walk('osg12', [
      [1, 'Operating System Design',
        `<p class="y-chinh">🎯 Chapter 12 is about <strong>design</strong>, not about one particular mechanism: what an OS should do, how its interface should look, how to build it, how to make it fast, and how to run the project of writing it. Tanenbaum wrote it from the experience of designing MINIX, and its advice is deliberately general — it fits any large software system.</p>
<p>Think of the earlier chapters as a tour of a finished city: roads (I/O), water supply (memory), police (protection). Design is the work of the <strong>city planner</strong> who decided where the roads go — and who had to decide with incomplete knowledge, a limited budget and thousands of future residents nobody has met yet. A planner cannot try the city out first; he has principles, hard-won rules of thumb and the mistakes of earlier cities. That is exactly what this chapter hands over. A <strong>design principle</strong> (a rule of thumb that has paid off often, such as "keep the interface simple") is not a law of physics: two principles can pull in opposite directions (simplicity versus completeness) and the designer's job is to choose, and to know the price.</p>
<p>The book's order — and the order of the 18 slides — is: the nature of the problem (§12.1), the <strong>interface</strong> the system shows to programmers (§12.2), the <strong>implementation</strong> behind it (§12.3), <strong>performance</strong> (§12.4), the <strong>project</strong> that builds it (§12.5) and <strong>trends</strong> (§12.6). Notice that the interface comes before the implementation: users and programmers live with an interface for decades (POSIX <code>open</code> is from the 1970s), while the code behind it is rewritten many times.</p>
<p>➕ Why a backend developer should care: every service you write is a small operating system. It <em>defines abstractions</em> (an "order", a "session"), offers <em>primitive operations</em> (endpoints), must <em>isolate</em> users from each other (tenants, permissions) and <em>manage resources</em> (connections, memory, threads, queue length). When you pick between a monolith and microservices, between a cache and a database read, between a hard-coded rule and a configuration file, you repeat decisions the OS designers made — often with better-documented consequences. Interview questions such as "design a URL shortener" or "design a rate limiter" test the same skill.</p>
<p class="meo">🧠 Tip: while you read the chapter, ask of every idea "where does this appear in the backend code I write?" — slides 9, 13–14 and 15–16 each have a 🧭 box that answers it.</p>`,
        `<p class="y-chinh">🎯 Chương 12 nói về <strong>thiết kế</strong>, không phải về một cơ chế cụ thể: HĐH nên làm gì, giao diện của nó nên ra sao, xây nó thế nào, làm nó nhanh thế nào, và điều hành dự án viết ra nó thế nào. Tanenbaum viết chương này từ kinh nghiệm thiết kế MINIX, và lời khuyên của ông cố ý nói chung — hợp với mọi hệ thống phần mềm lớn.</p>
<p>Hãy coi các chương trước là chuyến tham quan một thành phố đã xây xong: đường sá (I/O), cấp nước (bộ nhớ), công an (bảo vệ). Thiết kế là việc của <strong>nhà quy hoạch</strong> đã quyết định đường chạy qua đâu — và phải quyết định khi hiểu biết còn thiếu, ngân sách có hạn, và hàng ngàn cư dân tương lai chưa ai gặp. Nhà quy hoạch không thể thử thành phố trước; ông có các nguyên tắc, các quy tắc ngón tay cái rút ra khó nhọc, và sai lầm của những thành phố đi trước. Đó chính xác là thứ chương này trao lại. <strong>Nguyên tắc thiết kế (design principle)</strong> — quy tắc ngón tay cái đã nhiều lần sinh lời, như "giữ giao diện đơn giản" — không phải định luật vật lý: hai nguyên tắc có thể kéo ngược nhau (đơn giản và đầy đủ) và việc của người thiết kế là chọn, và biết cái giá.</p>
<p>Thứ tự của sách — cũng là thứ tự 18 slide — là: bản chất bài toán (§12.1), <strong>giao diện (interface)</strong> hệ thống bày ra cho lập trình viên (§12.2), <strong>cài đặt (implementation)</strong> đằng sau nó (§12.3), <strong>hiệu năng (performance)</strong> (§12.4), <strong>dự án (project)</strong> dựng nên nó (§12.5) và <strong>xu hướng (trends)</strong> (§12.6). Để ý rằng giao diện đứng trước cài đặt: người dùng và lập trình viên sống với một giao diện hàng chục năm (<code>open</code> của POSIX có từ thập niên 1970), còn mã phía sau được viết lại nhiều lần.</p>
<p>➕ Vì sao dân backend cần quan tâm: mỗi dịch vụ bạn viết là một hệ điều hành nhỏ. Nó <em>định nghĩa các khái niệm trừu tượng</em> ("đơn hàng", "phiên đăng nhập"), cung cấp <em>thao tác nguyên thuỷ</em> (các endpoint), phải <em>cô lập</em> người dùng với nhau (tenant, quyền) và <em>quản lý tài nguyên</em> (kết nối, bộ nhớ, luồng, độ dài hàng đợi). Khi chọn giữa monolith và microservices, giữa cache và đọc cơ sở dữ liệu, giữa quy tắc viết cứng và tệp cấu hình, bạn lặp lại những quyết định mà người thiết kế HĐH từng đưa ra — thường với hậu quả đã được ghi lại kỹ hơn. Các câu phỏng vấn như "thiết kế dịch vụ rút gọn URL" hay "thiết kế bộ giới hạn tốc độ" kiểm tra đúng kỹ năng này.</p>
<p class="meo">🧠 Mẹo: trong lúc đọc chương, với mỗi ý hãy hỏi "nó xuất hiện ở đâu trong mã backend tôi viết?" — các slide 9, 13–14 và 15–16 đều có ô 🧭 trả lời câu đó.</p>`],
      [2, 'Goals',
        `<p class="y-chinh">🎯 The four main goals of a general-purpose operating system: <strong>(1) define abstractions</strong> (process, address space, file…), <strong>(2) provide primitive operations</strong> (the system calls that act on the abstractions), <strong>(3) ensure isolation</strong> (one process or user cannot damage another) and <strong>(4) manage the hardware</strong> (CPU, memory, disks, network — share them fairly and efficiently).</p>
<p><strong>Abstraction</strong> (a simplified model that hides messy detail — "a file is a named sequence of bytes" instead of "cylinders, sectors and a disk queue") is the main thing an OS sells. Programmers do not want to know that a disk exists; they want <code>open</code>, <code>read</code>, <code>close</code>. The abstractions are the vocabulary of the whole system, so choosing them is the most important design decision — and the hardest to undo, because every program written later speaks that vocabulary. <strong>Primitive operations</strong> are the small set of actions on those abstractions that user code cannot build for itself, usually because they need kernel mode: create a process, map memory, write to a device. Everything else (a database, a web server) is built from them. <strong>Isolation</strong> (protection) means a bug or an attack in one program stays in that program: separate address spaces, user ids, file permissions. <strong>Hardware management</strong> means turning scarce devices into a fair, efficient shared resource: the scheduler shares the CPU, virtual memory shares RAM, the I/O layers share the disk.</p>
<p>➕ The four goals are those of a <em>general-purpose</em> OS (laptop, server, phone). An embedded or real-time OS has other priorities: a pacemaker's OS cares about a guaranteed deadline, a sensor node about microwatts, and both may drop most of the abstractions. Even among general-purpose systems the goals conflict: strong isolation costs speed (every crossing of a boundary has a price — measured on slide 6), and rich abstractions cost simplicity.</p>
<p>➕ <strong>Why design is hard</strong> (book §12.1.2, in the book's spirit): (a) nobody can say exactly what the system will be used for — the designers of UNIX did not imagine web servers; (b) an OS is huge — Linux has tens of millions of lines of code and thousands of contributors, so no single head holds it all; (c) many things happen at once, so a design must be correct under concurrency (lesson 2); (d) the system must defend itself against hostile programs and users (lesson 9); (e) it is shared, so a choice that suits one program may hurt another; (f) it must stay compatible with software written decades ago, so mistakes are permanent; (g) it must be portable across hardware that did not exist when it was designed. The result: there is no single best design, only trade-offs.</p>
<p>➕ Isolation, run for real. The program below runs as an ordinary user (<code>--user sv</code>) and tries to step outside its box; the kernel refuses every time with "Permission denied", and the only thing it may do is act on its own files and processes:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Goal 3, isolation: an ordinary user cannot touch other users' secrets, system files or kernel settings<br>
$ id -un<br>
sv<br>
# 1. the password hashes live in a file only root may read<br>
$ ls -l /etc/shadow<br>
-rw-r----- 1 root shadow 498 Oct 26 00:25 /etc/shadow<br>
$ cat /etc/shadow<br>
cat: /etc/shadow: Permission denied<br>
# 2. root's home directory<br>
$ ls /root<br>
ls: cannot open directory '/root': Permission denied<br>
# 3. overwrite a system file<br>
$ echo hacked &gt; /etc/passwd<br>
bash: /etc/passwd: Permission denied<br>
# 4. change a kernel setting<br>
$ echo 1 &gt; /proc/sys/kernel/panic<br>
bash: /proc/sys/kernel/panic: Read-only file system<br>
# 5. what I MAY do: my own files and my own processes<br>
$ echo mine &gt; ~/note.txt &amp;&amp; cat ~/note.txt<br>
mine<br>
$ sleep 30 &amp; kill $(jobs -p) &amp;&amp; echo "killed my own sleep"<br>
killed my own sleep</div>
<p>Note case 4: here <code>/proc/sys</code> is read-only for a second reason — Docker mounts it that way. Real isolation is layered: user ids, file permissions, mount options, namespaces (lesson 7/10). Layers are also a design idea, coming on slide 5.</p>
<p class="pitfall">⚠️ Exam wording: the slide lists four goals, but books and tests phrase the same idea differently ("an OS is an extended machine and a resource manager" — lesson 1). Do not treat "abstractions" and "primitives" as the same: an abstraction is the <em>thing</em> (a process), a primitive is an <em>action</em> on it (fork). A frequent distractor is a goal like "maximise CPU speed" — not a goal of an OS; speed is a property you pursue under the four goals.</p>
<p>🧭 <strong>On a real server:</strong> the same four goals describe a container platform. Docker defines abstractions (image, container, volume), offers primitives (<code>run</code>, <code>stop</code>), isolates with namespaces and cgroups, and manages the hardware with CPU and memory limits (<code>--cpus</code>, <code>--memory</code>, which an earlier lesson used to make the OOM killer appear).</p>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu chính của hệ điều hành đa năng: <strong>(1) định nghĩa các khái niệm trừu tượng (abstractions)</strong> (tiến trình, không gian địa chỉ, tệp…), <strong>(2) cung cấp thao tác nguyên thuỷ (primitive operations)</strong> (các lời gọi hệ thống tác động lên các khái niệm đó), <strong>(3) bảo đảm cô lập (isolation)</strong> (một tiến trình hay người dùng không phá được kẻ khác) và <strong>(4) quản lý phần cứng</strong> (CPU, bộ nhớ, đĩa, mạng — chia sẻ công bằng và hiệu quả).</p>
<p><strong>Trừu tượng hoá (abstraction)</strong> — mô hình đơn giản hoá che đi chi tiết rối rắm, như "tệp là một dãy byte có tên" thay cho "cylinder, sector và hàng đợi đĩa" — là thứ chính mà HĐH bán. Lập trình viên không muốn biết có cái đĩa; họ muốn <code>open</code>, <code>read</code>, <code>close</code>. Các khái niệm trừu tượng là bộ từ vựng của cả hệ thống, nên chọn chúng là quyết định thiết kế quan trọng nhất — và khó rút lại nhất, vì mọi chương trình viết sau này đều nói bộ từ vựng ấy. <strong>Thao tác nguyên thuỷ (primitive operations)</strong> là tập nhỏ các hành động trên những khái niệm đó mà mã người dùng không tự dựng được, thường vì cần chế độ nhân: tạo tiến trình, ánh xạ bộ nhớ, ghi ra thiết bị. Mọi thứ khác (cơ sở dữ liệu, web server) được dựng từ chúng. <strong>Cô lập (isolation)</strong> — bảo vệ — nghĩa là lỗi hay cuộc tấn công ở một chương trình nằm lại trong chương trình đó: không gian địa chỉ riêng, mã người dùng, quyền tệp. <strong>Quản lý phần cứng</strong> nghĩa là biến thiết bị khan hiếm thành tài nguyên dùng chung công bằng và hiệu quả: bộ lập lịch chia CPU, bộ nhớ ảo chia RAM, các tầng I/O chia đĩa.</p>
<p>➕ Bốn mục tiêu này là của HĐH <em>đa năng</em> (laptop, máy chủ, điện thoại). HĐH nhúng hay thời gian thực có ưu tiên khác: HĐH của máy tạo nhịp tim cần hạn chót được bảo đảm, nút cảm biến cần từng micro-oát, và cả hai có thể bỏ phần lớn các khái niệm trừu tượng. Ngay giữa các hệ đa năng, các mục tiêu cũng xung đột: cô lập mạnh tốn tốc độ (mỗi lần vượt ranh giới có giá — đo ở slide 6), và trừu tượng phong phú tốn sự đơn giản.</p>
<p>➕ <strong>Vì sao thiết kế khó</strong> (sách §12.1.2, theo tinh thần của sách): (a) không ai nói chính xác hệ thống sẽ được dùng vào việc gì — người thiết kế UNIX không hình dung ra web server; (b) HĐH khổng lồ — Linux có hàng chục triệu dòng mã và hàng ngàn người đóng góp, không cái đầu nào chứa hết; (c) nhiều việc xảy ra cùng lúc, nên thiết kế phải đúng khi đồng thời (bài 2); (d) hệ thống phải tự vệ trước chương trình và người dùng thù địch (bài 9); (e) nó dùng chung, nên lựa chọn hợp chương trình này có thể hại chương trình khác; (f) nó phải tương thích với phần mềm viết từ hàng chục năm trước, nên sai lầm là vĩnh viễn; (g) nó phải chạy được trên phần cứng chưa tồn tại lúc thiết kế. Kết quả: không có một thiết kế tốt nhất, chỉ có các đánh đổi.</p>
<p>➕ Cô lập, chạy thật. Chương trình dưới đây chạy bằng người dùng thường (<code>--user sv</code>) và thử bước ra khỏi hộp của mình; nhân từ chối mọi lần bằng "Permission denied", và việc duy nhất nó được làm là tác động lên tệp và tiến trình của chính nó:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Mục tiêu 3, cô lập: người dùng thường không đụng được vào bí mật của người khác, tệp hệ thống hay cấu hình nhân<br>
$ id -un<br>
sv<br>
# 1. băm mật khẩu nằm trong tệp chỉ root được đọc<br>
$ ls -l /etc/shadow<br>
-rw-r----- 1 root shadow 498 Oct 26 00:25 /etc/shadow<br>
$ cat /etc/shadow<br>
cat: /etc/shadow: Permission denied<br>
# 2. thư mục nhà của root<br>
$ ls /root<br>
ls: cannot open directory '/root': Permission denied<br>
# 3. ghi đè một tệp hệ thống<br>
$ echo hacked &gt; /etc/passwd<br>
bash: /etc/passwd: Permission denied<br>
# 4. đổi một cấu hình của nhân<br>
$ echo 1 &gt; /proc/sys/kernel/panic<br>
bash: /proc/sys/kernel/panic: Read-only file system<br>
# 5. thứ tôi ĐƯỢC làm: tệp và tiến trình của chính tôi<br>
$ echo mine &gt; ~/note.txt &amp;&amp; cat ~/note.txt<br>
mine<br>
$ sleep 30 &amp; kill $(jobs -p) &amp;&amp; echo "killed my own sleep"<br>
killed my own sleep</div>
<p>Để ý ca 4: ở đây <code>/proc/sys</code> chỉ-đọc vì thêm một lý do — Docker gắn nó như vậy. Cô lập thật là nhiều lớp: mã người dùng, quyền tệp, tuỳ chọn mount, namespace (bài 7/10). Phân lớp cũng là một ý thiết kế, sắp tới ở slide 5.</p>
<p class="pitfall">⚠️ Cách hỏi trong đề: slide liệt kê bốn mục tiêu, nhưng sách và đề diễn đạt cùng ý theo cách khác ("HĐH là máy mở rộng và là bộ quản lý tài nguyên" — bài 1). Đừng coi "abstraction" và "primitive" là một: abstraction là <em>vật</em> (tiến trình), primitive là <em>hành động</em> trên nó (fork). Phương án gây nhiễu hay gặp là một "mục tiêu" như "tối đa hoá tốc độ CPU" — không phải mục tiêu của HĐH; tốc độ là tính chất ta theo đuổi bên dưới bốn mục tiêu.</p>
<p>🧭 <strong>Trên server thật:</strong> bốn mục tiêu ấy cũng mô tả một nền tảng container. Docker định nghĩa khái niệm (image, container, volume), cung cấp thao tác nguyên thuỷ (<code>run</code>, <code>stop</code>), cô lập bằng namespace và cgroup, và quản lý phần cứng bằng giới hạn CPU và bộ nhớ (<code>--cpus</code>, <code>--memory</code>, thứ một bài trước đã dùng để làm OOM killer xuất hiện).</p>`],
      [3, 'Interface Design — Guiding Principles',
        `<p class="y-chinh">🎯 Three guiding principles for an interface: <strong>simplicity</strong> (easy to understand, easy to implement without bugs), <strong>completeness</strong> (it must let users do everything they legitimately need) and <strong>efficiency</strong> (a call that looks cheap must BE cheap, or programmers will use it wrongly). Einstein's rule quoted in the book sums it up: "everything should be as simple as possible, but no simpler".</p>
<p>The <strong>interface</strong> (the set of calls, data formats and rules through which other code uses a component — for an OS, the system calls) is the most permanent part of a design, so the book spends its attention here first. <strong>Simplicity</strong>: a small set of orthogonal ideas beats a big set of special cases. <strong>Orthogonal</strong> (independent, each feature does one job and combines freely with the others — like the three axes of space) is the key word: UNIX has <code>fork</code> (make a copy) and <code>exec</code> (replace the program), two simple calls that combine into "start a program", with a gap between them where a shell can redirect files and set up pipes; Windows' <code>CreateProcess</code> has ten parameters doing all of it at once. The UNIX way is not "better" in every respect, but it is easier to learn and to extend. <strong>Completeness</strong>: simplicity must not become poverty — Einstein's "but no simpler". If the interface lacks one needed operation, programmers invent ugly workarounds that bypass the design. <strong>Efficiency</strong>: programmers carry a mental cost model. They expect <code>lseek</code> (move a pointer) to be cheap and <code>read</code> of a megabyte to be costly; an interface that hides a disk access behind an innocent-looking call produces slow programs. A feature that cannot be implemented efficiently is often better left out.</p>
<p>➕ A concrete picture of "one interface, many implementations" is the <strong>table of function pointers</strong>. The program below defines a tiny device interface (<code>read</code>, <code>write</code>) and three implementations: a black hole, a source of zeros and a 16-byte RAM disk. The function <code>use</code> works with all three without knowing which it got — this is how Linux's <code>struct file_operations</code> lets one <code>read()</code> system call serve disks, terminals, sockets and <code>/dev/zero</code>:</p>
<pre><code class="language-c">// Indirection: ONE call site, many implementations — a table of function pointers (the idea behind struct file_operations)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

struct device_ops {                       // "the interface": a table of function pointers
    const char *name;
    int (*read)(char *buf, int n);
    int (*write)(const char *buf, int n);
};
static int null_read(char *b, int n)  { (void) b; (void) n; return 0; }                       // end of file at once
static int null_write(const char *b, int n) { (void) b; return n; }                           // swallow everything
static int zero_read(char *b, int n)  { memset(b, 0, n); return n; }                          // endless zeros
static int zero_write(const char *b, int n) { (void) b; return n; }
static char store[16]; static int used;
static int mem_read(char *b, int n)   { if (n &gt; used) n = used; memcpy(b, store, n); return n; }  // a tiny RAM disk
static int mem_write(const char *b, int n) { if (n &gt; 16) n = 16; memcpy(store, b, n); used = n; return n; }
static struct device_ops devices[] = {
    { "null", null_read, null_write },
    { "zero", zero_read, zero_write },
    { "mem",  mem_read,  mem_write  },
};
static void use(struct device_ops *d) {   // does NOT know which device it got
    char buf[8] = "XXXXXXX";
    int w = d-&gt;write("hello", 5);
    int r = d-&gt;read(buf, 5);              // one indirect call, the table decides
    printf("%-5s: write=%d read=%d first byte=%d\\n", d-&gt;name, w, r, r ? buf[0] : -1);
}
int main(void) {
    for (int i = 0; i &lt; 3; i++) use(&amp;devices[i]);
    printf("device_independent: %d devices, one function &#96;use&#96;\\n", 3);
    printf("null: read=%d (a device that never has data)\\n", 0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-ham.c -o bang-ham &amp;&amp; ./bang-ham<br>
null : write=5 read=0 first byte=-1<br>
zero : write=5 read=5 first byte=0<br>
mem &nbsp;: write=5 read=5 first byte=104<br>
device_independent: 3 devices, one function &#96;use&#96;<br>
null: read=0 (a device that never has data)</div>
<p>The three devices behave differently (the black hole returns 0 bytes, the zero device 5 bytes of 0, the RAM disk gives back <code>h</code> = 104), but the interface is identical. That is simplicity (two operations) and orthogonality (any device with those two operations plugs in).</p>
<p>➕ Other principles worth knowing: <strong>least astonishment</strong> (the system should do what an experienced user expects), and Butler Lampson's famous <em>Hints for Computer System Design</em> (ACM SOSP 1983): "do one thing at a time and do it well", "keep it simple", "make it fast, rather than general or powerful" — a warning that completeness has limits. Lampson also advises "keep basic interfaces stable" — Linux's rule that the kernel must never break user space comes from the same idea.</p>
<p class="pitfall">⚠️ The three principles pull against each other, and exam answers that treat them as three separate boxes lose the point. A feature that makes the interface more complete usually makes it less simple; an efficient special case (a combined system call) usually breaks orthogonality. The designer's job is the balance, and the right answer to "which is most important?" is "it depends — but never drop simplicity first".</p>
<p>🧭 <strong>On a real server — API design:</strong> judge a REST or GraphQL API with the same three questions. <em>Simple</em>: can a new developer guess the endpoint names (<code>GET /orders/42</code>) and the error format? <em>Complete</em>: can a client do everything it legitimately needs without a hack — filtering, pagination, bulk update? <em>Efficient</em>: does an innocent call hide a hidden cost (the "N+1 queries" bug, an unbounded list)? Orthogonality shows in PATCH vs PUT and in filters that combine freely. Interview question: "Design the API of a to-do service" — answer with these three words.</p>`,
        `<p class="y-chinh">🎯 Ba nguyên tắc dẫn đường cho một giao diện: <strong>đơn giản (simplicity)</strong> (dễ hiểu, dễ cài đặt không lỗi), <strong>đầy đủ (completeness)</strong> (phải cho người dùng làm mọi việc họ chính đáng cần) và <strong>hiệu quả (efficiency)</strong> (lời gọi trông rẻ thì PHẢI rẻ, không thì lập trình viên dùng sai). Câu của Einstein được sách trích tóm gọn: "mọi thứ nên đơn giản hết mức có thể, nhưng không đơn giản hơn".</p>
<p><strong>Giao diện (interface)</strong> — tập các lời gọi, định dạng dữ liệu và quy tắc để mã khác dùng một thành phần; với HĐH là các lời gọi hệ thống — là phần bền vững nhất của một thiết kế, nên sách dành sự chú ý cho nó trước. <strong>Đơn giản</strong>: một tập nhỏ các ý trực giao thắng một tập lớn các trường hợp đặc biệt. <strong>Trực giao (orthogonal)</strong> — độc lập, mỗi tính năng làm một việc và ghép tự do với các tính năng khác, như ba trục của không gian — là từ khoá: UNIX có <code>fork</code> (tạo bản sao) và <code>exec</code> (thay chương trình), hai lời gọi đơn giản ghép thành "khởi động một chương trình", với một khe hở giữa chúng để shell chuyển hướng tệp và dựng pipe; <code>CreateProcess</code> của Windows có mười tham số làm tất cả cùng lúc. Cách UNIX không "tốt hơn" về mọi mặt, nhưng dễ học và dễ mở rộng hơn. <strong>Đầy đủ</strong>: đơn giản không được thành nghèo nàn — "nhưng không đơn giản hơn" của Einstein. Nếu giao diện thiếu một thao tác cần thiết, lập trình viên bịa ra cách vòng xấu xí đi lách thiết kế. <strong>Hiệu quả</strong>: lập trình viên mang trong đầu một mô hình chi phí. Họ kỳ vọng <code>lseek</code> (dời con trỏ) rẻ và <code>read</code> một megabyte đắt; giao diện giấu một lần truy cập đĩa sau một lời gọi trông vô hại sinh ra chương trình chậm. Tính năng không cài đặt được hiệu quả thường nên bỏ.</p>
<p>➕ Hình ảnh cụ thể của "một giao diện, nhiều cài đặt" là <strong>bảng con trỏ hàm</strong>. Chương trình dưới định nghĩa một giao diện thiết bị bé xíu (<code>read</code>, <code>write</code>) và ba cài đặt: một hố đen, một nguồn số không và một đĩa RAM 16 byte. Hàm <code>use</code> chạy với cả ba mà không biết nó nhận cái nào — đây là cách <code>struct file_operations</code> của Linux cho phép MỘT lời gọi <code>read()</code> phục vụ đĩa, terminal, socket và <code>/dev/zero</code>:</p>
<pre><code class="language-c">// Gián tiếp: MỘT chỗ gọi, nhiều cài đặt — bảng con trỏ hàm (ý tưởng của struct file_operations)
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

struct device_ops {                       // "giao diện": bảng con trỏ hàm
    const char *name;
    int (*read)(char *buf, int n);
    int (*write)(const char *buf, int n);
};
static int null_read(char *b, int n)  { (void) b; (void) n; return 0; }                       // hết tệp ngay
static int null_write(const char *b, int n) { (void) b; return n; }                           // nuốt hết
static int zero_read(char *b, int n)  { memset(b, 0, n); return n; }                          // số không vô tận
static int zero_write(const char *b, int n) { (void) b; return n; }
static char store[16]; static int used;
static int mem_read(char *b, int n)   { if (n &gt; used) n = used; memcpy(b, store, n); return n; }  // đĩa RAM nhỏ xíu
static int mem_write(const char *b, int n) { if (n &gt; 16) n = 16; memcpy(store, b, n); used = n; return n; }
static struct device_ops devices[] = {
    { "null", null_read, null_write },
    { "zero", zero_read, zero_write },
    { "mem",  mem_read,  mem_write  },
};
static void use(struct device_ops *d) {   // KHÔNG biết mình nhận thiết bị nào
    char buf[8] = "XXXXXXX";
    int w = d-&gt;write("hello", 5);
    int r = d-&gt;read(buf, 5);              // một lời gọi gián tiếp, bảng quyết định
    printf("%-5s: write=%d read=%d first byte=%d\\n", d-&gt;name, w, r, r ? buf[0] : -1);
}
int main(void) {
    for (int i = 0; i &lt; 3; i++) use(&amp;devices[i]);
    printf("device_independent: %d devices, one function &#96;use&#96;\\n", 3);
    printf("null: read=%d (a device that never has data)\\n", 0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-ham.c -o bang-ham &amp;&amp; ./bang-ham<br>
null : write=5 read=0 first byte=-1<br>
zero : write=5 read=5 first byte=0<br>
mem &nbsp;: write=5 read=5 first byte=104<br>
device_independent: 3 devices, one function &#96;use&#96;<br>
null: read=0 (a device that never has data)</div>
<p>Ba thiết bị cư xử khác nhau (hố đen trả 0 byte, thiết bị zero trả 5 byte 0, đĩa RAM trả lại <code>h</code> = 104), nhưng giao diện giống hệt. Đó là đơn giản (hai thao tác) và trực giao (thiết bị nào có hai thao tác ấy cũng cắm vào được).</p>
<p>➕ Các nguyên tắc khác đáng biết: <strong>ít gây ngạc nhiên nhất (least astonishment)</strong> (hệ thống nên làm đúng điều người dùng có kinh nghiệm chờ đợi), và bài <em>Hints for Computer System Design</em> nổi tiếng của Butler Lampson (ACM SOSP 1983): "mỗi lần làm một việc và làm cho tốt", "giữ đơn giản", "làm cho nhanh, đừng làm cho tổng quát hay quyền năng" — lời cảnh báo rằng sự đầy đủ có giới hạn. Lampson còn khuyên "giữ ổn định các giao diện cơ bản" — quy tắc của Linux rằng nhân không bao giờ được phá không gian người dùng xuất phát từ cùng ý đó.</p>
<p class="pitfall">⚠️ Ba nguyên tắc kéo ngược nhau, và bài làm coi chúng là ba ô riêng rẽ sẽ mất ý chính. Tính năng làm giao diện đầy đủ hơn thường làm nó kém đơn giản; một trường hợp đặc biệt hiệu quả (lời gọi hệ thống gộp) thường phá tính trực giao. Việc của người thiết kế là cân bằng, và câu trả lời đúng cho "cái nào quan trọng nhất?" là "tuỳ — nhưng đừng bỏ sự đơn giản trước tiên".</p>
<p>🧭 <strong>Trên server thật — thiết kế API:</strong> đánh giá một API REST hay GraphQL bằng đúng ba câu hỏi. <em>Đơn giản</em>: lập trình viên mới có đoán được tên endpoint (<code>GET /orders/42</code>) và định dạng lỗi không? <em>Đầy đủ</em>: client làm được mọi việc chính đáng mà không cần mẹo — lọc, phân trang, cập nhật hàng loạt? <em>Hiệu quả</em>: một lời gọi vô hại có giấu chi phí ngầm (lỗi "N+1 truy vấn", danh sách không giới hạn)? Tính trực giao thấy ở PATCH so với PUT và ở các bộ lọc ghép tự do. Câu phỏng vấn: "Thiết kế API cho dịch vụ to-do" — trả lời bằng ba từ này.</p>`],
      [4, 'Execution Paradigms',
        `<p class="y-chinh">🎯 Figure 12-1: two ways a program is organised. (a) <strong>Algorithmic code</strong>: <code>main</code> runs a fixed order — <code>init</code>, <code>do_something</code>, <code>read</code>, <code>do_something_else</code>, <code>write</code>, <code>exit</code>; the program decides when to ask for input. (b) <strong>Event-driven code</strong>: <code>main</code> calls <code>init</code>, then sits in a loop <code>while (get_message(&amp;msg))</code> and runs a <code>switch</code> on the message type; the OUTSIDE decides what happens next.</p>
<p>An <strong>execution paradigm</strong> (the basic shape of control flow of a program) is the first decision an interface forces on its users, because it decides who is in charge. In <strong>algorithmic</strong> programs — classic UNIX tools like <code>sort</code> or <code>cc</code> — the program is in charge: it calls <code>read</code> when it needs data and the call blocks until the data arrive. In <strong>event-driven</strong> programs — graphical applications, servers — the system is in charge: the program has handlers for key presses, mouse clicks, timers or incoming packets and waits in the message loop. The same logic of two programmers can look completely different: the algorithmic version is one straight story; the event-driven version is a set of small reactions with a <em>state</em> kept between them, because after each reaction control returns to the loop and local variables vanish. That is why event-driven code often has "state machines" and callbacks — the price of letting events arrive in any order.</p>
<p>➕ Running both shapes for real. The algorithmic function always produces the same trace; the event-driven function produces a different trace depending on the order of the messages, with no change in the program:</p>
<pre><code class="language-javascript">// Figure 12-1: algorithmic code vs event-driven code, the same job done both ways
const { EventEmitter } = require('node:events');

// (a) ALGORITHMIC: the program decides the order — init, do, read, do, write, exit
function algorithmic(input) {
  const trace = [];
  trace.push('init');
  trace.push('do_something');
  const data = input.trim();            // "read"
  trace.push('do_something_else');
  trace.push(&#96;write &#36;{data.toUpperCase()}&#96;);
  trace.push('exit');
  return trace;
}

// (b) EVENT-DRIVEN: the OUTSIDE decides the order; the program only reacts
function eventDriven(messages) {
  const trace = ['init'];
  const bus = new EventEmitter();
  bus.on('key', (m) =&gt; trace.push(&#96;case key: &#36;{m.data}&#96;));        // case 1
  bus.on('click', (m) =&gt; trace.push(&#96;case click: &#36;{m.data}&#96;));    // case 2
  bus.on('timer', (m) =&gt; trace.push(&#96;case timer: &#36;{m.data}&#96;));    // case 3
  for (const m of messages) bus.emit(m.type, m);                  // while (get_message(&amp;msg)) switch (msg.type) ...
  return trace;
}
const a1 = algorithmic('  hello ');
const e1 = eventDriven([{ type: 'click', data: 'OK button' }, { type: 'key', data: 'h' }, { type: 'timer', data: 'tick' }]);
const e2 = eventDriven([{ type: 'timer', data: 'tick' }, { type: 'timer', data: 'tick' }, { type: 'key', data: 'x' }]);
console.log('algorithmic :', a1.join(' -&gt; '));
console.log('event-driven, run 1:', e1.join(' -&gt; '));
console.log('event-driven, run 2:', e2.join(' -&gt; '));
const again = algorithmic('  hello ');
console.log('same result:', JSON.stringify(a1) === JSON.stringify(again), '(algorithmic = same order every run; event-driven = order set by the events)');</code></pre>
<div class="out">$ node hai-mo-hinh.js<br>
algorithmic : init -&gt; do_something -&gt; do_something_else -&gt; write HELLO -&gt; exit<br>
event-driven, run 1: init -&gt; case click: OK button -&gt; case key: h -&gt; case timer: tick<br>
event-driven, run 2: init -&gt; case timer: tick -&gt; case timer: tick -&gt; case key: x<br>
same result: true (algorithmic = same order every run; event-driven = order set by the events)</div>
<p>In the second and third lines the same program, same handlers, behaved in the order the events arrived — which is the whole point of the paradigm and also the main source of its bugs (a handler must work in <em>every</em> order, including the ones the programmer never imagined).</p>
<p>➕ The paradigm also shapes the <strong>system calls</strong>: an algorithmic system wants blocking calls (<code>read</code> returns when data are there); an event-driven one wants a way to wait for <em>many</em> sources at once — <code>select</code>, <code>poll</code>, <code>epoll</code> (Linux) or I/O completion ports (Windows). The book lists the third big choice of an interface after "paradigm of execution" and "paradigm of the user interface": the <strong>data paradigm</strong>. UNIX says "everything is a file" (a byte stream: disk, pipe, terminal — the table of function pointers on slide 3), Windows says "everything is an object with a handle".</p>
<p class="pitfall">⚠️ Do not confuse event-driven with multithreaded. A single thread can handle a thousand connections in an event loop (Node.js), and a multithreaded server can be perfectly algorithmic (one blocking thread per connection). The choice is about <em>who decides the order</em>, not about how many threads exist. Test wording: "in event-driven code the main loop gets a message and dispatches on its type" — that is Figure 12-1(b).</p>
<p>🧭 <strong>On a real server:</strong> Node.js is event-driven — <code>server.on('request', handler)</code> registers a reaction and the libuv loop (built on <code>epoll</code> on Linux) calls it; one slow synchronous handler blocks every client. Classic Spring MVC with Tomcat is algorithmic — one thread per request that can block on a database call; Spring WebFlux and Netty are event-driven. Choosing between them is choosing a paradigm, with the trade-off "simple straight-line code with many threads" versus "few threads, but callbacks and state". Interview: "why is Node good for I/O-heavy and bad for CPU-heavy work?" — because one loop thread serves all events.</p>`,
        `<p class="y-chinh">🎯 Hình 12-1: hai cách tổ chức một chương trình. (a) <strong>Mã thuật toán (algorithmic)</strong>: <code>main</code> chạy theo thứ tự cố định — <code>init</code>, <code>do_something</code>, <code>read</code>, <code>do_something_else</code>, <code>write</code>, <code>exit</code>; chương trình tự quyết khi nào xin dữ liệu vào. (b) <strong>Mã hướng sự kiện (event-driven)</strong>: <code>main</code> gọi <code>init</code> rồi ngồi trong vòng lặp <code>while (get_message(&amp;msg))</code> và chạy <code>switch</code> theo loại tin; BÊN NGOÀI quyết định việc kế tiếp.</p>
<p><strong>Mô hình thực thi (execution paradigm)</strong> — hình dạng cơ bản của luồng điều khiển trong chương trình — là quyết định đầu tiên mà một giao diện áp lên người dùng nó, vì nó quyết định ai là người cầm lái. Trong chương trình <strong>thuật toán</strong> — các công cụ UNIX cổ điển như <code>sort</code> hay <code>cc</code> — chương trình cầm lái: nó gọi <code>read</code> khi cần dữ liệu và lời gọi chặn tới khi dữ liệu tới. Trong chương trình <strong>hướng sự kiện</strong> — ứng dụng đồ hoạ, máy chủ — hệ thống cầm lái: chương trình có các trình xử lý cho phím bấm, nhấp chuột, bộ hẹn giờ hay gói tin tới và chờ trong vòng lặp tin nhắn. Cùng một logic của hai lập trình viên có thể trông hoàn toàn khác: bản thuật toán là một câu chuyện thẳng; bản hướng sự kiện là một tập phản ứng nhỏ cùng <em>trạng thái</em> được giữ giữa chúng, vì sau mỗi phản ứng quyền điều khiển trở về vòng lặp và biến cục bộ biến mất. Vì thế mã hướng sự kiện hay có "máy trạng thái" và callback — cái giá của việc cho sự kiện tới theo thứ tự bất kỳ.</p>
<p>➕ Chạy thật cả hai hình dạng. Hàm thuật toán luôn cho cùng một vết; hàm hướng sự kiện cho vết khác nhau tuỳ thứ tự các tin, mà chương trình không đổi:</p>
<pre><code class="language-javascript">// Hình 12-1: mã thuật toán và mã hướng sự kiện, cùng một việc làm theo hai cách
const { EventEmitter } = require('node:events');

// (a) THUẬT TOÁN: chương trình quyết định thứ tự
function algorithmic(input) {
  const trace = [];
  trace.push('init');
  trace.push('do_something');
  const data = input.trim();            // "đọc"
  trace.push('do_something_else');
  trace.push(&#96;write &#36;{data.toUpperCase()}&#96;);
  trace.push('exit');
  return trace;
}

// (b) HƯỚNG SỰ KIỆN: BÊN NGOÀI quyết định thứ tự, chương trình chỉ phản ứng
function eventDriven(messages) {
  const trace = ['init'];
  const bus = new EventEmitter();
  bus.on('key', (m) =&gt; trace.push(&#96;case key: &#36;{m.data}&#96;));        // trường hợp 1
  bus.on('click', (m) =&gt; trace.push(&#96;case click: &#36;{m.data}&#96;));    // trường hợp 2
  bus.on('timer', (m) =&gt; trace.push(&#96;case timer: &#36;{m.data}&#96;));    // trường hợp 3
  for (const m of messages) bus.emit(m.type, m);                  // vòng get_message
  return trace;
}
const a1 = algorithmic('  hello ');
const e1 = eventDriven([{ type: 'click', data: 'OK button' }, { type: 'key', data: 'h' }, { type: 'timer', data: 'tick' }]);
const e2 = eventDriven([{ type: 'timer', data: 'tick' }, { type: 'timer', data: 'tick' }, { type: 'key', data: 'x' }]);
console.log('algorithmic :', a1.join(' -&gt; '));
console.log('event-driven, run 1:', e1.join(' -&gt; '));
console.log('event-driven, run 2:', e2.join(' -&gt; '));
const again = algorithmic('  hello ');
console.log('same result:', JSON.stringify(a1) === JSON.stringify(again), '(algorithmic = same order every run; event-driven = order set by the events)');</code></pre>
<div class="out">$ node hai-mo-hinh.js<br>
algorithmic : init -&gt; do_something -&gt; do_something_else -&gt; write HELLO -&gt; exit<br>
event-driven, run 1: init -&gt; case click: OK button -&gt; case key: h -&gt; case timer: tick<br>
event-driven, run 2: init -&gt; case timer: tick -&gt; case timer: tick -&gt; case key: x<br>
same result: true (algorithmic = same order every run; event-driven = order set by the events)</div>
<p>Ở dòng thứ hai và thứ ba, cùng một chương trình, cùng các trình xử lý, cư xử theo thứ tự sự kiện tới — đó là toàn bộ ý nghĩa của mô hình và cũng là nguồn lỗi chính của nó (một trình xử lý phải chạy đúng ở <em>mọi</em> thứ tự, kể cả những thứ tự lập trình viên chưa từng nghĩ tới).</p>
<p>➕ Mô hình cũng định hình các <strong>lời gọi hệ thống</strong>: hệ thuật toán muốn lời gọi chặn (<code>read</code> trả về khi dữ liệu đã có); hệ hướng sự kiện muốn cách chờ <em>nhiều</em> nguồn cùng lúc — <code>select</code>, <code>poll</code>, <code>epoll</code> (Linux) hay I/O completion port (Windows). Sách còn nêu lựa chọn lớn thứ ba của một giao diện, sau "mô hình thực thi" và "mô hình giao diện người dùng": <strong>mô hình dữ liệu</strong>. UNIX nói "mọi thứ là tệp" (một luồng byte: đĩa, pipe, terminal — bảng con trỏ hàm ở slide 3), Windows nói "mọi thứ là một đối tượng có handle".</p>
<p class="pitfall">⚠️ Đừng lẫn hướng sự kiện với đa luồng. Một luồng đơn có thể phục vụ một ngàn kết nối trong vòng lặp sự kiện (Node.js), và một máy chủ đa luồng có thể hoàn toàn theo kiểu thuật toán (một luồng chặn cho mỗi kết nối). Lựa chọn là về <em>ai quyết định thứ tự</em>, không phải số luồng. Cách hỏi trong đề: "trong mã hướng sự kiện, vòng lặp chính nhận một tin và điều phối theo loại tin" — đó là Hình 12-1(b).</p>
<p>🧭 <strong>Trên server thật:</strong> Node.js hướng sự kiện — <code>server.on('request', handler)</code> đăng ký một phản ứng và vòng lặp libuv (dựa trên <code>epoll</code> ở Linux) gọi nó; một handler đồng bộ chậm chặn mọi client. Spring MVC cổ điển với Tomcat theo kiểu thuật toán — mỗi request một luồng có thể chặn ở lời gọi cơ sở dữ liệu; Spring WebFlux và Netty hướng sự kiện. Chọn giữa chúng là chọn một mô hình, với đánh đổi "mã thẳng đơn giản nhưng nhiều luồng" so với "ít luồng, nhưng callback và trạng thái". Phỏng vấn: "vì sao Node tốt cho việc nặng I/O và dở cho việc nặng CPU?" — vì một luồng vòng lặp phục vụ mọi sự kiện.</p>`],
      [5, 'System Structure — Layered Systems',
        `<p class="y-chinh">🎯 Figure 12-2: one possible design of a modern <strong>layered</strong> OS, seven layers from the bottom — 1 hide the low-level hardware · 2 interrupt handling, context switching, MMU · 3 threads, thread scheduling, synchronisation · 4 device drivers · 5 virtual memory · 6 file systems · 7 system-call handler. The rule: a layer uses only the services of the layer directly below it.</p>
<p>A <strong>layered system</strong> (a structure where each layer is built on the one below and offers a cleaner interface to the one above) is the oldest answer to "how do I organise a big program". The ancestor is Dijkstra's THE operating system (1968), with six layers and a proof-like discipline that let a small team get it right. Why do it? <em>Understanding</em>: you can study layer 3 without the file system. <em>Replacement</em>: a new CPU changes layer 1 and perhaps 2 only; the rest does not notice. <em>Testing</em>: test each layer with the one below already trusted. In Figure 12-2 the lowest layer is a <strong>hardware abstraction layer</strong> (code that hides the differences between machines; Windows has a literally named "HAL"); layer 2 handles the raw machine events; threads come next because everything above wants to wait and be woken; drivers sit above threads because a driver needs to block; virtual memory and file systems come above drivers because they use the disk.</p>
<p>➕ The trouble is that real dependencies are not a clean stack. Virtual memory (layer 5) needs the disk to page out, which means a driver (4); but a file system (6) wants to cache file blocks in memory, which means using memory management (5), and "mmap" of a file makes layer 5 use layer 6. A strict layering that forbids calling "upwards" forces awkward workarounds; a loose layering lets everything call everything and becomes a tangle. Another price is speed: each crossing between layers is a call, and a request through seven layers pays seven calls plus any data conversion — the reason that many performance-critical systems <em>bypass</em> layers (zero-copy <code>sendfile</code>, kernel-bypass networking).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/0a230b16d41d436179525cb826f1bab108665242.svg" alt="Figure 12-2 as a stack: each layer calls only the layer below" loading="lazy" /><p class="chu-thich">🧩 Figure 12-2 as a stack: each layer calls only the layer below</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 12-2 as a stack: each layer uses only the layer BELOW it
title Layered OS (Figure 12-2)
rectangle "7  System call handler" as L7
rectangle "6  File system 1 | ... | File system m" as L6
rectangle "5  Virtual memory" as L5
rectangle "4  Drivers 1 ... n" as L4
rectangle "3  Threads: scheduling, synchronisation" as L3
rectangle "2  Interrupt handling, context switching, MMU" as L2
rectangle "1  Hide the low-level hardware" as L1
L7 -down-&gt; L6 : calls
L6 -down-&gt; L5
L5 -down-&gt; L4
L4 -down-&gt; L3
L3 -down-&gt; L2
L2 -down-&gt; L1
note right of L1 : The only code that knows the CPU model
@enduml</code></pre></details>
<p>➕ In practice, Linux is layered <em>inside its subsystems</em> rather than as one stack: a <code>write</code> goes through the VFS (generic file API) → the file system (ext4) → the page cache → the block layer → the disk driver. Network code is layered the same way (socket → TCP → IP → driver) — the TCP/IP model of lesson 5 is itself a layered design with the same pros and cons.</p>
<p class="pitfall">⚠️ "Layered" is not "modular". Modules (loadable pieces with a defined interface) can be arranged in any graph; layers are a special arrangement with a strict "only downwards, only one step" rule. A frequent exam statement: "in a layered system each layer provides services to the layer above and uses the services of the layer below" — true. "Layers make the system faster" — false; they make it clearer and easier to verify, usually at some cost in speed.</p>
<p>🧭 <strong>On a real server:</strong> the layered architecture of a backend — <em>controller → service → repository → database</em> — is exactly this idea. The controller must not talk to the database directly; the repository hides SQL from the service; replacing PostgreSQL with another database changes only the bottom layer. And it has the same trap: a request that crosses all layers for a trivial read (copying one object into four DTO types) is slow and verbose, so teams add a shortcut — the "bypass" of the OS designers. Interview: "what does each layer of your Spring Boot project do, and what may it call?"</p>`,
        `<p class="y-chinh">🎯 Hình 12-2: một thiết kế khả dĩ của HĐH <strong>phân lớp (layered)</strong> hiện đại, bảy tầng từ dưới lên — 1 che phần cứng mức thấp · 2 xử lý ngắt, chuyển ngữ cảnh, MMU · 3 luồng, lập lịch luồng, đồng bộ · 4 driver thiết bị · 5 bộ nhớ ảo · 6 hệ thống tệp · 7 trình xử lý lời gọi hệ thống. Quy tắc: một tầng chỉ dùng dịch vụ của tầng ngay bên dưới.</p>
<p><strong>Hệ thống phân lớp (layered system)</strong> — cấu trúc mà mỗi tầng dựng trên tầng dưới và đưa giao diện gọn hơn cho tầng trên — là câu trả lời lâu đời nhất cho "tổ chức một chương trình lớn thế nào". Tổ tiên là HĐH THE của Dijkstra (1968), với sáu tầng và kỷ luật gần như chứng minh được giúp một nhóm nhỏ làm đúng. Vì sao làm vậy? <em>Dễ hiểu</em>: nghiên cứu được tầng 3 mà không cần hệ thống tệp. <em>Dễ thay</em>: CPU mới chỉ đổi tầng 1 và có thể tầng 2; phần còn lại không hay biết. <em>Dễ kiểm thử</em>: kiểm thử từng tầng khi tầng dưới đã đáng tin. Trong Hình 12-2, tầng thấp nhất là <strong>lớp trừu tượng phần cứng (hardware abstraction layer)</strong> — mã che sự khác nhau giữa các máy; Windows có hẳn một thành phần tên "HAL"; tầng 2 xử lý các sự kiện thô của máy; luồng đứng kế vì mọi thứ phía trên đều muốn chờ và được đánh thức; driver đứng trên luồng vì driver cần chặn; bộ nhớ ảo và hệ thống tệp đứng trên driver vì chúng dùng đĩa.</p>
<p>➕ Rắc rối là các phụ thuộc thật không phải một chồng sạch. Bộ nhớ ảo (tầng 5) cần đĩa để đẩy trang ra, tức cần driver (4); nhưng hệ thống tệp (6) muốn đệm khối tệp trong bộ nhớ, tức dùng quản lý bộ nhớ (5), và "mmap" một tệp khiến tầng 5 dùng tầng 6. Phân lớp nghiêm ngặt cấm gọi "lên trên" buộc phải có cách vòng vụng về; phân lớp lỏng lẻo để mọi thứ gọi mọi thứ và thành mớ rối. Một cái giá khác là tốc độ: mỗi lần qua tầng là một lời gọi, và một yêu cầu đi qua bảy tầng trả bảy lời gọi cộng chuyển đổi dữ liệu — lý do nhiều hệ thống cần hiệu năng <em>đi vòng</em> các tầng (<code>sendfile</code> zero-copy, mạng bỏ qua nhân).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/0a230b16d41d436179525cb826f1bab108665242.svg" alt="Hình 12-2 dạng chồng: mỗi tầng chỉ gọi tầng bên dưới" loading="lazy" /><p class="chu-thich">🧩 Hình 12-2 dạng chồng: mỗi tầng chỉ gọi tầng bên dưới</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 12-2 dạng chồng: mỗi tầng chỉ dùng tầng NGAY DƯỚI
title Layered OS (Figure 12-2)
rectangle "7  System call handler" as L7
rectangle "6  File system 1 | ... | File system m" as L6
rectangle "5  Virtual memory" as L5
rectangle "4  Drivers 1 ... n" as L4
rectangle "3  Threads: scheduling, synchronisation" as L3
rectangle "2  Interrupt handling, context switching, MMU" as L2
rectangle "1  Hide the low-level hardware" as L1
L7 -down-&gt; L6 : calls
L6 -down-&gt; L5
L5 -down-&gt; L4
L4 -down-&gt; L3
L3 -down-&gt; L2
L2 -down-&gt; L1
note right of L1 : The only code that knows the CPU model
@enduml</code></pre></details>
<p>➕ Trên thực tế, Linux phân lớp <em>bên trong từng hệ thống con</em> chứ không thành một chồng duy nhất: một lệnh <code>write</code> đi qua VFS (API tệp chung) → hệ thống tệp (ext4) → bộ nhớ đệm trang → tầng khối → driver đĩa. Mã mạng phân lớp tương tự (socket → TCP → IP → driver) — mô hình TCP/IP của bài 5 chính là một thiết kế phân lớp với cùng ưu nhược điểm.</p>
<p class="pitfall">⚠️ "Phân lớp" không phải "mô-đun". Mô-đun (mảnh nạp được, có giao diện xác định) có thể xếp theo đồ thị bất kỳ; tầng là cách xếp đặc biệt với luật nghiêm "chỉ đi xuống, chỉ một bước". Phát biểu hay gặp trong đề: "trong hệ phân lớp, mỗi tầng cung cấp dịch vụ cho tầng trên và dùng dịch vụ của tầng dưới" — đúng. "Phân lớp làm hệ thống nhanh hơn" — sai; nó làm hệ thống rõ ràng và dễ kiểm chứng hơn, thường với cái giá về tốc độ.</p>
<p>🧭 <strong>Trên server thật:</strong> kiến trúc phân lớp của một backend — <em>controller → service → repository → cơ sở dữ liệu</em> — chính là ý này. Controller không được nói chuyện thẳng với cơ sở dữ liệu; repository che SQL khỏi service; đổi PostgreSQL sang cơ sở dữ liệu khác chỉ đổi tầng dưới cùng. Và nó có cùng cái bẫy: một yêu cầu đi qua mọi tầng chỉ để đọc tầm thường (chép một đối tượng sang bốn kiểu DTO) thì chậm và dài dòng, nên nhóm thêm đường tắt — chính là việc "đi vòng" của người thiết kế HĐH. Phỏng vấn: "mỗi tầng trong dự án Spring Boot của bạn làm gì và được gọi tầng nào?"</p>`],
      [6, 'Microkernel-Based Client-Server Systems',
        `<p class="y-chinh">🎯 Figure 12-3: in a <strong>microkernel-based client-server system</strong> the kernel is tiny and does only the work that needs kernel mode — messages between processes, scheduling, address spaces. File server, process server, memory server and drivers are ordinary <strong>user-mode processes</strong>; a client gets a service by <strong>sending a message</strong> to the right server.</p>
<p>The idea attacks the biggest weakness of a big kernel: a bug in <em>any</em> of its millions of lines — a graphics driver, a rarely used file system — can crash the whole machine, because all of it runs in kernel mode with full power. In a <strong>microkernel</strong> (a kernel reduced to the minimum: IPC, basic scheduling, memory mapping) a driver is just a process; if it dies, the system notices and starts a fresh copy — MINIX 3 has a "reincarnation server" for exactly that. Smaller kernel code also means fewer bugs and a chance to <em>prove</em> it correct: the seL4 microkernel (about 8,700 lines of C and 600 lines of assembly) is the first general-purpose OS kernel with a machine-checked proof that its C code matches its specification (Klein et al., ACM SOSP 2009). Microkernels in use: QNX (cars, medical devices), the L4 family, MINIX 3 (inside Intel's management engine, according to widely reported findings), seL4 in defence and aerospace research.</p>
<p>➕ The price is <strong>communication</strong>. Where a monolithic kernel serves <code>read</code> with function calls inside one program, a microkernel needs messages between processes — each one a trip through the kernel plus a context switch (lesson 2). The model below counts the steps of one <code>read()</code> to disk; it is a <em>model</em>, not a measurement (the second figure is the program that measures):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/20552f64cc753b757aab6bef402d930f676a4ed9.svg" alt="Monolithic: one trap in, one return out — everything in between is plain function calls" loading="lazy" /><p class="chu-thich">🧮 Monolithic: one trap in, one return out — everything in between is plain function calls</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/** Trả các bước [{ noi, nhan }] theo thứ tự; noi: 0 = tiến trình người dùng, 1 = nhân, 2 = máy chủ tệp (user mode), 3 = trình điều khiển đĩa (user mode). */
export function cacBuoc(kieu) {
  if (kieu === 'nguyen-khoi') return [
    { noi: 0, nhan: 'read()' }, { noi: 1, nhan: 'trap' }, { noi: 1, nhan: 'VFS+FS+driver' }, { noi: 1, nhan: 'return' }, { noi: 0, nhan: 'data' },
  ];
  return [
    { noi: 0, nhan: 'send' }, { noi: 1, nhan: 'IPC' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'send' }, { noi: 3, nhan: 'disk' },
    { noi: 1, nhan: 'reply' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'reply' }, { noi: 0, nhan: 'data' },
  ];
}
/** Đổi chế độ = mỗi lần đi giữa nhân (noi 1) và không gian người dùng (noi ≠ 1). */
export function doiCheDo(buoc) { let n = 0; for (let i = 1; i &lt; buoc.length; i++) if ((buoc[i].noi === 1) !== (buoc[i - 1].noi === 1)) n++; return n; }</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/91c5a95caf81fd3c802ad238ecc7daf9ad7d234d.svg" alt="Microkernel: four messages, each crossing into the kernel and out again" loading="lazy" /><p class="chu-thich">🧮 Microkernel: four messages, each crossing into the kernel and out again</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/** Trả các bước [{ noi, nhan }] theo thứ tự; noi: 0 = tiến trình người dùng, 1 = nhân, 2 = máy chủ tệp (user mode), 3 = trình điều khiển đĩa (user mode). */
export function cacBuoc(kieu) {
  if (kieu === 'nguyen-khoi') return [
    { noi: 0, nhan: 'read()' }, { noi: 1, nhan: 'trap' }, { noi: 1, nhan: 'VFS+FS+driver' }, { noi: 1, nhan: 'return' }, { noi: 0, nhan: 'data' },
  ];
  return [
    { noi: 0, nhan: 'send' }, { noi: 1, nhan: 'IPC' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'send' }, { noi: 3, nhan: 'disk' },
    { noi: 1, nhan: 'reply' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'reply' }, { noi: 0, nhan: 'data' },
  ];
}
/** Đổi chế độ = mỗi lần đi giữa nhân (noi 1) và không gian người dùng (noi ≠ 1). */
export function doiCheDo(buoc) { let n = 0; for (let i = 1; i &lt; buoc.length; i++) if ((buoc[i].noi === 1) !== (buoc[i - 1].noi === 1)) n++; return n; }</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e05f1f460105a3c5123b9d5ffb40defe5a619b28.svg" alt="The same read() as a sequence diagram: client → file server → disk driver and back" loading="lazy" /><p class="chu-thich">🧩 The same read() as a sequence diagram: client → file server → disk driver and back</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' One read() on a microkernel: four messages
participant "Client\\nprocess" as C
participant "Microkernel" as K
participant "File\\nserver" as FS
participant "Disk\\ndriver" as D
C -&gt; K : 1. send(FS, READ file 3, 4096 bytes)
K -&gt; FS : deliver the message
FS -&gt; FS : find the block (a cache hit would stop here)
FS -&gt; K : 2. send(DISK, READ block 812)
K -&gt; D : deliver
D -&gt; D : program the controller, wait for the interrupt
D -&gt; K : 3. reply(block data)
K -&gt; FS : deliver
FS -&gt; K : 4. reply(data)
K -&gt; C : deliver — the client's read() returns
note over C, D : a monolithic kernel does the same work with ONE trap and plain function calls inside the kernel
@enduml</code></pre></details>
<p>Now the measurement. The program compares a cheap system call (<code>getppid</code>, which does no real work) with a "message round trip" to another process through a pair of pipes — the shape of a microkernel request. Both are real; the number depends on the machine, so the run is marked as one sample (🎲) and only the ratio is checked:</p>
<pre><code class="language-c">// What a microkernel pays: a system call vs a message to another process (measured, not modelled)
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;time.h&gt;

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec + t.tv_nsec / 1e9; }

int main(void) {
    enum { N = 100000 };
    // 1. monolithic style: ask the kernel directly — ONE crossing user -&gt; kernel -&gt; user
    double t0 = now();
    for (int i = 0; i &lt; N; i++) syscall(SYS_getppid);
    double per_call = (now() - t0) / N;

    // 2. microkernel style: ask a SERVER PROCESS — a request message and a reply message, each through the kernel
    int req[2], rep[2]; pipe(req); pipe(rep);
    if (fork() == 0) {                                    // the "server"
        char c;
        close(req[1]); close(rep[0]);                     // keep only our own ends, or read() never sees end-of-file
        while (read(req[0], &amp;c, 1) == 1) write(rep[1], &amp;c, 1);   // receive, do the work, reply
        _exit(0);
    }
    char c = 'x';
    t0 = now();
    for (int i = 0; i &lt; N; i++) { write(req[1], &amp;c, 1); read(rep[0], &amp;c, 1); }
    double per_msg = (now() - t0) / N;
    close(req[1]); wait(NULL);

    printf("system call        : %6.0f ns\\n", per_call * 1e9);
    printf("message round trip : %6.0f ns\\n", per_msg * 1e9);
    printf("message (pipe round trip) / system call: %.0fx\\n", per_msg / per_call);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread goi-vs-tin-nhan.c -o goi-vs-tin-nhan &amp;&amp; ./goi-vs-tin-nhan<br>
system call &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;1544 ns<br>
message round trip : &nbsp;87003 ns<br>
message (pipe round trip) / system call: 56x</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>On this Docker-for-Mac virtual machine the message costs tens of times a system call (the exact ratio changes from run to run and from machine to machine; on a real Linux PC a system call is far below a microsecond, so the ratio is larger). That gap is the argument of the long <strong>Torvalds–Tanenbaum debate</strong> (January 1992, <code>comp.os.minix</code>, "LINUX is obsolete"): Tanenbaum said microkernels were the future; Linux stayed monolithic for speed and simplicity of sharing data between components. Modern L4-family kernels cut the cost of a message to a few hundred cycles with careful design — the reason seL4 and QNX are practical.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/851da250656e5f0676aa4d94ec813a76d1f23c5b.svg" alt="Four structures in one picture: monolithic, microkernel, exokernel and hypervisor" loading="lazy" /><p class="chu-thich">🧩 Four structures in one picture: monolithic, microkernel, exokernel and hypervisor</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Four OS structures, side by side
title Where does the code run?
package "Monolithic (Linux)" {
  rectangle "apps" as M1
  rectangle "KERNEL: scheduler + VM + FS + drivers + TCP/IP\\n(one program, one address space)" as M2
  M1 --&gt; M2 : system call
}
package "Microkernel (MINIX 3, seL4, QNX)" {
  rectangle "apps + FS server + driver servers + net server\\n(user mode, separate processes)" as K1
  rectangle "TINY kernel: IPC, scheduling, address spaces" as K2
  K1 --&gt; K2 : messages
}
package "Exokernel (research)" {
  rectangle "apps + library OS (each app brings its own OS code)" as E1
  rectangle "exokernel: ONLY protects and hands out raw resources" as E2
  E1 --&gt; E2 : secure bindings
}
package "Hypervisor (cloud)" {
  rectangle "guest OS 1 | guest OS 2 | guest OS 3" as H1
  rectangle "hypervisor: shares the hardware between whole OSes" as H2
  H1 --&gt; H2 : trap / hypercall
}
@enduml</code></pre></details>
<p>➕ Two more structures from the book. An <strong>exokernel</strong> (MIT, Engler, Kaashoek and O'Toole, SOSP 1995) goes further than a microkernel: it does <em>no</em> abstraction at all, only protecting and handing out raw resources (disk blocks, physical pages, CPU time slices) — each application links a <em>library operating system</em> that provides the abstractions it wants. It remains mostly a research idea, but its spirit lives on in unikernels and in kernel-bypass libraries. <strong>Extensible systems</strong> let code be loaded into the kernel at run time: Linux's loadable modules (<code>lsmod</code>) make a monolithic kernel flexible, and eBPF programs run verified code inside the kernel.</p>
<p>➕ <strong>Mechanism versus policy</strong> (book §12.3, "implementation") is the design rule that makes a microkernel make sense. The <strong>mechanism</strong> is the means — a queue of jobs, a priority field, a switch that moves the CPU from one process to another. The <strong>policy</strong> is the decision about how to use the means — which job goes next, who gets which priority. Keep them apart, and policy can change (a new scheduling rule, a new quota) without touching the delicate kernel code; put them together and every change of opinion is a kernel change. In a microkernel the kernel keeps only mechanisms and servers in user mode set the policy. Below, one unchanged queue (the mechanism) runs two policies; the same four jobs wait 10 time units on average when the oldest goes first and 4 when the shortest goes first:</p>
<pre><code class="language-javascript">// MECHANISM vs POLICY: one job queue (mechanism), two ways to pick the next job (policy)
const jobs = [{ name: 'A', cost: 10 }, { name: 'B', cost: 2 }, { name: 'C', cost: 6 }, { name: 'D', cost: 2 }];  // all arrive at time 0

function runQueue(jobs, pickNext) {          // MECHANISM: queue + run one at a time
  const waiting = [...jobs]; let t = 0; const log = []; let totalWait = 0;
  while (waiting.length) {
    const job = waiting.splice(pickNext(waiting), 1)[0];   // the ONLY place a policy is consulted
    totalWait += t; log.push(&#96;&#36;{job.name}@&#36;{t}&#96;); t += job.cost;
  }
  return { log, avgWait: totalWait / jobs.length };
}
const fifo = () =&gt; 0;                                                          // POLICY 1: oldest first
const shortestFirst = (q) =&gt; q.reduce((best, j, i) =&gt; (j.cost &lt; q[best].cost ? i : best), 0);   // POLICY 2
const a = runQueue(jobs, fifo), b = runQueue(jobs, shortestFirst);
console.log(&#96;FIFO policy: average wait = &#36;{a.avgWait}   order: &#36;{a.log.join(' ')}&#96;);
console.log(&#96;shortest-first policy: average wait = &#36;{b.avgWait}   order: &#36;{b.log.join(' ')}&#96;);
console.log('mechanism ran 2 policies without a single change');</code></pre>
<div class="out">$ node co-che-chinh-sach.js<br>
FIFO policy: average wait = 10 &nbsp;&nbsp;order: A@0 B@10 C@12 D@18<br>
shortest-first policy: average wait = 4 &nbsp;&nbsp;order: B@0 D@2 C@4 A@10<br>
mechanism ran 2 policies without a single change</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6c82278df39f135bdf9a73b8d908dfddf0942692.svg" alt="Policy 1, oldest first: the long job A blocks the three short ones" loading="lazy" /><p class="chu-thich">🧮 Policy 1, oldest first: the long job A blocks the three short ones</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bfce13f0dc08099747f7a2f3f5bff3c2ced5a073.svg" alt="Policy 2, shortest first: the same queue, a one-line change of policy" loading="lazy" /><p class="chu-thich">🧮 Policy 2, shortest first: the same queue, a one-line change of policy</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<p>Linux shows the same split: the kernel's scheduler implements mechanisms (run queues, priorities, time slices, <code>sched_setscheduler</code>) and offers several policy classes (<code>SCHED_OTHER</code>, <code>SCHED_FIFO</code>, <code>SCHED_RR</code>, <code>SCHED_DEADLINE</code> — man7 <code>sched(7)</code>); user programs choose with <code>chrt</code> or <code>nice</code>. A backend has the same split in <em>config versus code</em>: the retry loop is the mechanism, "three attempts with exponential back-off" is the policy and belongs in configuration.</p>
<p class="pitfall">⚠️ In Figure 12-3 the <em>drivers and servers are in user mode</em>; a "hybrid" kernel like Windows NT or macOS XNU (Mach + BSD) keeps a microkernel-<em>style</em> design on paper but runs most services inside kernel mode for speed. Do not answer "Linux is a microkernel because it has modules" — modules run in kernel mode, in the same address space; that is monolithic. And "microkernels are slower" is true for IPC-heavy work, not a law.</p>
<p>🧭 <strong>On a real server — monolith versus microservices:</strong> it is the same trade-off one level up. A monolith (one deployable program, in-process calls) is fast and simple to debug; microservices (small processes talking over the network) isolate failures and allow independent deployment — and pay with network messages, partial failures and harder debugging. The cost table above explains why several teams have written about merging chatty services back together. Interview: "when would you NOT use microservices?" — when the services talk to each other more than they work, or the team is small.</p>`,
        `<p class="y-chinh">🎯 Hình 12-3: trong <strong>hệ máy khách–máy chủ dựa trên microkernel</strong>, nhân rất bé và chỉ làm việc cần chế độ nhân — tin nhắn giữa các tiến trình, lập lịch, không gian địa chỉ. Máy chủ tệp, máy chủ tiến trình, máy chủ bộ nhớ và driver là các <strong>tiến trình chế độ người dùng</strong> bình thường; client nhận dịch vụ bằng cách <strong>gửi tin nhắn</strong> tới máy chủ đúng.</p>
<p>Ý tưởng này tấn công điểm yếu lớn nhất của một nhân to: lỗi ở <em>bất kỳ</em> dòng nào trong hàng triệu dòng — một driver đồ hoạ, một hệ thống tệp ít dùng — có thể làm sập cả máy, vì tất cả chạy ở chế độ nhân với đầy đủ quyền. Trong <strong>microkernel</strong> — nhân rút xuống mức tối thiểu: IPC, lập lịch cơ bản, ánh xạ bộ nhớ — driver chỉ là một tiến trình; nếu nó chết, hệ thống nhận ra và khởi động bản mới — MINIX 3 có hẳn một "reincarnation server" (máy chủ tái sinh) cho việc đó. Mã nhân nhỏ hơn cũng có nghĩa là ít lỗi hơn và có cơ hội <em>chứng minh</em> nó đúng: nhân seL4 (khoảng 8.700 dòng C và 600 dòng hợp ngữ) là nhân HĐH đa năng đầu tiên có chứng minh kiểm bằng máy rằng mã C khớp với đặc tả (Klein và cs., ACM SOSP 2009). Microkernel đang dùng: QNX (ô tô, thiết bị y tế), họ L4, MINIX 3 (nằm trong bộ quản lý của Intel theo các phát hiện được đưa tin rộng rãi), seL4 trong nghiên cứu quốc phòng và hàng không.</p>
<p>➕ Cái giá là <strong>giao tiếp</strong>. Nơi nhân nguyên khối phục vụ <code>read</code> bằng lời gọi hàm trong một chương trình, microkernel cần tin nhắn giữa các tiến trình — mỗi tin là một chuyến qua nhân cộng một lần chuyển ngữ cảnh (bài 2). Mô hình dưới đếm các bước của một <code>read()</code> xuống đĩa; nó là <em>mô hình</em>, không phải số đo (hình thứ hai bên dưới mới là chương trình đo):</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/54ba98e543867f8b55e89f7ced1235cbf7c209ad.svg" alt="Nguyên khối: một lần bẫy vào, một lần trả ra — mọi thứ giữa chừng chỉ là lời gọi hàm" loading="lazy" /><p class="chu-thich">🧮 Nguyên khối: một lần bẫy vào, một lần trả ra — mọi thứ giữa chừng chỉ là lời gọi hàm</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/** Trả các bước [{ noi, nhan }] theo thứ tự; noi: 0 = tiến trình người dùng, 1 = nhân, 2 = máy chủ tệp (user mode), 3 = trình điều khiển đĩa (user mode). */
export function cacBuoc(kieu) {
  if (kieu === 'nguyen-khoi') return [
    { noi: 0, nhan: 'read()' }, { noi: 1, nhan: 'trap' }, { noi: 1, nhan: 'VFS+FS+driver' }, { noi: 1, nhan: 'return' }, { noi: 0, nhan: 'data' },
  ];
  return [
    { noi: 0, nhan: 'send' }, { noi: 1, nhan: 'IPC' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'send' }, { noi: 3, nhan: 'disk' },
    { noi: 1, nhan: 'reply' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'reply' }, { noi: 0, nhan: 'data' },
  ];
}
/** Đổi chế độ = mỗi lần đi giữa nhân (noi 1) và không gian người dùng (noi ≠ 1). */
export function doiCheDo(buoc) { let n = 0; for (let i = 1; i &lt; buoc.length; i++) if ((buoc[i].noi === 1) !== (buoc[i - 1].noi === 1)) n++; return n; }</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/926b52169ca6133987abb917d42e26522e03de5a.svg" alt="Microkernel: bốn tin nhắn, mỗi tin vào nhân rồi ra lại" loading="lazy" /><p class="chu-thich">🧮 Microkernel: bốn tin nhắn, mỗi tin vào nhân rồi ra lại</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/** Trả các bước [{ noi, nhan }] theo thứ tự; noi: 0 = tiến trình người dùng, 1 = nhân, 2 = máy chủ tệp (user mode), 3 = trình điều khiển đĩa (user mode). */
export function cacBuoc(kieu) {
  if (kieu === 'nguyen-khoi') return [
    { noi: 0, nhan: 'read()' }, { noi: 1, nhan: 'trap' }, { noi: 1, nhan: 'VFS+FS+driver' }, { noi: 1, nhan: 'return' }, { noi: 0, nhan: 'data' },
  ];
  return [
    { noi: 0, nhan: 'send' }, { noi: 1, nhan: 'IPC' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'send' }, { noi: 3, nhan: 'disk' },
    { noi: 1, nhan: 'reply' }, { noi: 2, nhan: 'FS' }, { noi: 1, nhan: 'reply' }, { noi: 0, nhan: 'data' },
  ];
}
/** Đổi chế độ = mỗi lần đi giữa nhân (noi 1) và không gian người dùng (noi ≠ 1). */
export function doiCheDo(buoc) { let n = 0; for (let i = 1; i &lt; buoc.length; i++) if ((buoc[i].noi === 1) !== (buoc[i - 1].noi === 1)) n++; return n; }</code></pre></details>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e05f1f460105a3c5123b9d5ffb40defe5a619b28.svg" alt="Cùng lời gọi read() dạng sơ đồ tuần tự: client → máy chủ tệp → driver đĩa và ngược lại" loading="lazy" /><p class="chu-thich">🧩 Cùng lời gọi read() dạng sơ đồ tuần tự: client → máy chủ tệp → driver đĩa và ngược lại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Một read() trên microkernel: bốn tin nhắn
participant "Client\\nprocess" as C
participant "Microkernel" as K
participant "File\\nserver" as FS
participant "Disk\\ndriver" as D
C -&gt; K : 1. send(FS, READ file 3, 4096 bytes)
K -&gt; FS : deliver the message
FS -&gt; FS : find the block (a cache hit would stop here)
FS -&gt; K : 2. send(DISK, READ block 812)
K -&gt; D : deliver
D -&gt; D : program the controller, wait for the interrupt
D -&gt; K : 3. reply(block data)
K -&gt; FS : deliver
FS -&gt; K : 4. reply(data)
K -&gt; C : deliver — the client's read() returns
note over C, D : a monolithic kernel does the same work with ONE trap and plain function calls inside the kernel
@enduml</code></pre></details>
<p>Giờ là số đo. Chương trình so một lời gọi hệ thống rẻ (<code>getppid</code>, không làm việc gì thật) với một "vòng tin nhắn" tới tiến trình khác qua một cặp pipe — hình dạng của một yêu cầu microkernel. Cả hai đều thật; con số phụ thuộc máy, nên lần chạy được đánh dấu là một mẫu (🎲) và chỉ tỉ số được kiểm:</p>
<pre><code class="language-c">// Cái giá của microkernel: lời gọi hệ thống so với tin nhắn tới tiến trình khác (đo thật, không phải mô hình)
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;time.h&gt;

static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec + t.tv_nsec / 1e9; }

int main(void) {
    enum { N = 100000 };
    // kiểu nguyên khối: hỏi thẳng nhân — MỘT lần qua ranh giới
    double t0 = now();
    for (int i = 0; i &lt; N; i++) syscall(SYS_getppid);
    double per_call = (now() - t0) / N;

    // kiểu microkernel: hỏi một TIẾN TRÌNH MÁY CHỦ — một tin yêu cầu và một tin trả lời, mỗi tin đều qua nhân
    int req[2], rep[2]; pipe(req); pipe(rep);
    if (fork() == 0) {                                    // "máy chủ"
        char c;
        close(req[1]); close(rep[0]);                     // chỉ giữ đầu của mình, không thì read() không bao giờ thấy hết tệp
        while (read(req[0], &amp;c, 1) == 1) write(rep[1], &amp;c, 1);   // nhận, làm việc, trả lời
        _exit(0);
    }
    char c = 'x';
    t0 = now();
    for (int i = 0; i &lt; N; i++) { write(req[1], &amp;c, 1); read(rep[0], &amp;c, 1); }
    double per_msg = (now() - t0) / N;
    close(req[1]); wait(NULL);

    printf("system call        : %6.0f ns\\n", per_call * 1e9);
    printf("message round trip : %6.0f ns\\n", per_msg * 1e9);
    printf("message (pipe round trip) / system call: %.0fx\\n", per_msg / per_call);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread goi-vs-tin-nhan.c -o goi-vs-tin-nhan &amp;&amp; ./goi-vs-tin-nhan<br>
system call &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &nbsp;&nbsp;1544 ns<br>
message round trip : &nbsp;87003 ns<br>
message (pipe round trip) / system call: 56x</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Trên máy ảo Docker-cho-Mac này, một tin nhắn tốn gấp hàng chục lần một lời gọi hệ thống (tỉ số chính xác đổi theo từng lần chạy và từng máy; trên PC Linux thật một lời gọi hệ thống thấp hơn nhiều so với một micro-giây, nên tỉ số còn lớn hơn). Khoảng cách ấy là lập luận của cuộc <strong>tranh luận Torvalds–Tanenbaum</strong> dài (tháng 1/1992, <code>comp.os.minix</code>, "LINUX is obsolete"): Tanenbaum nói microkernel là tương lai; Linux vẫn nguyên khối vì tốc độ và vì chia sẻ dữ liệu giữa các thành phần đơn giản. Nhân họ L4 hiện đại cắt giá một tin nhắn xuống vài trăm chu kỳ nhờ thiết kế cẩn thận — lý do seL4 và QNX dùng được trong thực tế.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/851da250656e5f0676aa4d94ec813a76d1f23c5b.svg" alt="Bốn cấu trúc trong một hình: nguyên khối, microkernel, exokernel và hypervisor" loading="lazy" /><p class="chu-thich">🧩 Bốn cấu trúc trong một hình: nguyên khối, microkernel, exokernel và hypervisor</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bốn cấu trúc HĐH, đặt cạnh nhau
title Where does the code run?
package "Monolithic (Linux)" {
  rectangle "apps" as M1
  rectangle "KERNEL: scheduler + VM + FS + drivers + TCP/IP\\n(one program, one address space)" as M2
  M1 --&gt; M2 : system call
}
package "Microkernel (MINIX 3, seL4, QNX)" {
  rectangle "apps + FS server + driver servers + net server\\n(user mode, separate processes)" as K1
  rectangle "TINY kernel: IPC, scheduling, address spaces" as K2
  K1 --&gt; K2 : messages
}
package "Exokernel (research)" {
  rectangle "apps + library OS (each app brings its own OS code)" as E1
  rectangle "exokernel: ONLY protects and hands out raw resources" as E2
  E1 --&gt; E2 : secure bindings
}
package "Hypervisor (cloud)" {
  rectangle "guest OS 1 | guest OS 2 | guest OS 3" as H1
  rectangle "hypervisor: shares the hardware between whole OSes" as H2
  H1 --&gt; H2 : trap / hypercall
}
@enduml</code></pre></details>
<p>➕ Hai cấu trúc nữa trong sách. <strong>Exokernel</strong> (MIT, Engler, Kaashoek và O'Toole, SOSP 1995) đi xa hơn microkernel: nó <em>không</em> trừu tượng hoá gì cả, chỉ bảo vệ và phát tài nguyên thô (khối đĩa, trang vật lý, lát thời gian CPU) — mỗi ứng dụng liên kết một <em>hệ điều hành thư viện (library OS)</em> cung cấp những trừu tượng nó muốn. Nó chủ yếu vẫn là ý tưởng nghiên cứu, nhưng tinh thần của nó sống tiếp trong unikernel và các thư viện bỏ qua nhân. <strong>Hệ thống mở rộng được (extensible systems)</strong> cho phép nạp mã vào nhân lúc chạy: module nạp động của Linux (<code>lsmod</code>) làm nhân nguyên khối linh hoạt, và chương trình eBPF chạy mã đã được kiểm chứng ngay trong nhân.</p>
<p>➕ <strong>Cơ chế so với chính sách (mechanism vs policy)</strong> (sách §12.3, "cài đặt") là quy tắc thiết kế làm microkernel có lý. <strong>Cơ chế</strong> là phương tiện — hàng đợi việc, trường độ ưu tiên, công tắc chuyển CPU từ tiến trình này sang tiến trình khác. <strong>Chính sách</strong> là quyết định cách dùng phương tiện — việc nào kế tiếp, ai được ưu tiên nào. Giữ chúng tách ra thì chính sách đổi được (luật lập lịch mới, hạn mức mới) mà không động tới mã nhân mong manh; gộp lại thì mỗi lần đổi ý là một thay đổi nhân. Trong microkernel, nhân chỉ giữ cơ chế còn các máy chủ ở chế độ người dùng đặt chính sách. Dưới đây, một hàng đợi không đổi (cơ chế) chạy hai chính sách; cùng bốn việc đó chờ trung bình 10 đơn vị thời gian khi việc cũ nhất đi trước và 4 khi việc ngắn nhất đi trước:</p>
<pre><code class="language-javascript">// CƠ CHẾ và CHÍNH SÁCH: một hàng đợi việc (cơ chế), hai cách chọn việc kế (chính sách)
const jobs = [{ name: 'A', cost: 10 }, { name: 'B', cost: 2 }, { name: 'C', cost: 6 }, { name: 'D', cost: 2 }];  // tất cả đến lúc 0

function runQueue(jobs, pickNext) {          // CƠ CHẾ: hàng đợi + chạy từng việc
  const waiting = [...jobs]; let t = 0; const log = []; let totalWait = 0;
  while (waiting.length) {
    const job = waiting.splice(pickNext(waiting), 1)[0];   // chỗ DUY NHẤT hỏi chính sách
    totalWait += t; log.push(&#96;&#36;{job.name}@&#36;{t}&#96;); t += job.cost;
  }
  return { log, avgWait: totalWait / jobs.length };
}
const fifo = () =&gt; 0;                                                          // CHÍNH SÁCH 1: đến trước làm trước
const shortestFirst = (q) =&gt; q.reduce((best, j, i) =&gt; (j.cost &lt; q[best].cost ? i : best), 0);   // CHÍNH SÁCH 2
const a = runQueue(jobs, fifo), b = runQueue(jobs, shortestFirst);
console.log(&#96;FIFO policy: average wait = &#36;{a.avgWait}   order: &#36;{a.log.join(' ')}&#96;);
console.log(&#96;shortest-first policy: average wait = &#36;{b.avgWait}   order: &#36;{b.log.join(' ')}&#96;);
console.log('mechanism ran 2 policies without a single change');</code></pre>
<div class="out">$ node co-che-chinh-sach.js<br>
FIFO policy: average wait = 10 &nbsp;&nbsp;order: A@0 B@10 C@12 D@18<br>
shortest-first policy: average wait = 4 &nbsp;&nbsp;order: B@0 D@2 C@4 A@10<br>
mechanism ran 2 policies without a single change</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ed2b6ff803fed670643de11d7b5cf5773028e9ce.svg" alt="Chính sách 1, cũ nhất trước: việc dài A chặn ba việc ngắn" loading="lazy" /><p class="chu-thich">🧮 Chính sách 1, cũ nhất trước: việc dài A chặn ba việc ngắn</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9e196c0ee93b53a93717eadfa5a634d8f7a7da44.svg" alt="Chính sách 2, ngắn nhất trước: cùng hàng đợi, đổi chính sách bằng một dòng" loading="lazy" /><p class="chu-thich">🧮 Chính sách 2, ngắn nhất trước: cùng hàng đợi, đổi chính sách bằng một dòng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<p>Linux cho thấy cùng sự chia tách: bộ lập lịch của nhân cài đặt các cơ chế (hàng đợi chạy, độ ưu tiên, lát thời gian, <code>sched_setscheduler</code>) và cung cấp nhiều lớp chính sách (<code>SCHED_OTHER</code>, <code>SCHED_FIFO</code>, <code>SCHED_RR</code>, <code>SCHED_DEADLINE</code> — man7 <code>sched(7)</code>); chương trình người dùng chọn bằng <code>chrt</code> hay <code>nice</code>. Backend có cùng sự chia tách ở <em>cấu hình so với mã</em>: vòng thử lại là cơ chế, "ba lần thử với lùi luỹ thừa" là chính sách và nên nằm trong cấu hình.</p>
<p class="pitfall">⚠️ Trong Hình 12-3, <em>driver và máy chủ ở chế độ người dùng</em>; nhân "lai (hybrid)" như Windows NT hay XNU của macOS (Mach + BSD) giữ thiết kế kiểu microkernel <em>trên giấy</em> nhưng chạy phần lớn dịch vụ trong chế độ nhân để lấy tốc độ. Đừng trả lời "Linux là microkernel vì có module" — module chạy ở chế độ nhân, trong cùng không gian địa chỉ; đó là nguyên khối. Và "microkernel chậm hơn" đúng với việc nặng IPC, không phải định luật.</p>
<p>🧭 <strong>Trên server thật — monolith so với microservices:</strong> cùng đánh đổi ở một tầng cao hơn. Monolith (một chương trình triển khai, gọi trong tiến trình) nhanh và dễ gỡ lỗi; microservices (các tiến trình nhỏ nói chuyện qua mạng) cô lập lỗi và cho triển khai độc lập — và trả bằng tin nhắn mạng, lỗi từng phần và gỡ lỗi khó hơn. Bảng chi phí ở trên giải thích vì sao vài nhóm đã viết về việc gộp lại các dịch vụ nói chuyện quá nhiều. Phỏng vấn: "khi nào bạn KHÔNG dùng microservices?" — khi các dịch vụ nói chuyện với nhau nhiều hơn là làm việc, hoặc nhóm nhỏ.</p>`],
      [7, 'Naming',
        `<p class="y-chinh">🎯 Figure 12-4: <strong>names</strong> come in two kinds. The <em>external name</em> is for people — <code>/usr/ast/books/mos2/Chap-12</code>. The <em>internal name</em> is for the system — a small number, here i-node 2. A <strong>directory</strong> is the table that maps one to the other: the entry <code>Chap-12</code> holds 2, and i-node 2 describes the file.</p>
<p>Almost every OS object needs a name: files, processes, devices, network hosts. The book's advice is that a design should give each object an <strong>internal name</strong> that is cheap for the machine (an index, a pointer, a number) and let <strong>external names</strong> be rich strings for people, with a mapping in between. Why two? Because the two audiences want opposite things: humans want long, memorable, hierarchical names that can be renamed freely, while the machine wants a fixed small key that never changes. The mapping layer — the directory — is what lets you <em>rename</em> a file without touching its contents, give it <em>several names</em>, or <em>move</em> it by changing only the directory. The same pattern is everywhere: file name → i-node number; open file → <strong>file descriptor</strong> (a small integer the process uses, mapped by the kernel to the real open-file object); host name → IP address (DNS); URL → server and resource; variable name → memory address.</p>
<p>➕ See the two levels with real tools. Below, one file gets <em>two external names</em> (a <strong>hard link</strong> — a second directory entry for the same i-node) and a <em>symbolic link</em> (a different object whose content is another name). Removing the original name does not kill the data, because the i-node still has one name left; the symbolic link breaks, because it stored a name, not an i-node:</p>
<div class="out"># Figure 12-4: an external NAME is mapped by a directory to an internal NAME (the i-node number)<br>
$ echo "chapter twelve" &gt; Chap-12<br>
# a second external name for the SAME internal object (a hard link)<br>
$ ln Chap-12 ban-sao-cung-inode<br>
# a symbolic link is a different thing: a file whose content is another NAME<br>
$ ln -s Chap-12 lien-ket-mem<br>
$ [ "$(stat -c %i Chap-12)" = "$(stat -c %i ban-sao-cung-inode)" ] &amp;&amp; echo "Chap-12 and ban-sao-cung-inode: SAME internal name (i-node)"<br>
Chap-12 and ban-sao-cung-inode: SAME internal name (i-node)<br>
$ [ "$(stat -c %i Chap-12)" = "$(stat -c %i lien-ket-mem)" ] || echo "Chap-12 and lien-ket-mem: DIFFERENT i-node"<br>
Chap-12 and lien-ket-mem: DIFFERENT i-node<br>
$ stat -c '%n: %h name(s) for this i-node' Chap-12<br>
Chap-12: 2 name(s) for this i-node<br>
$ readlink lien-ket-mem<br>
Chap-12<br>
# remove the original name: the object survives because another name still points to it<br>
$ rm Chap-12<br>
$ cat ban-sao-cung-inode<br>
chapter twelve<br>
# the symbolic link now holds a name that no longer resolves<br>
$ cat lien-ket-mem<br>
cat: lien-ket-mem: No such file or directory<br>
# ls -i prints the internal names; we count distinct ones<br>
$ ls -i | awk '{print $1}' | sort -u | wc -l<br>
2</div>
<p>The distinction is the whole of Figure 12-4: <code>Chap-12</code> and <code>ban-sao-cung-inode</code> are two directory entries holding the <em>same internal name</em>; <code>lien-ket-mem</code> holds an <em>external name</em> and has to look it up again every time — which is why it can dangle. (Details of i-nodes: lesson 4.)</p>
<p>➕ <strong>Binding time</strong> (book §12.3.5) is the moment when a name is tied to the thing it names. It can be early — at <em>compile time</em> (a constant, a fixed address), at <em>link time</em>, at <em>load time</em>, or late — at <em>run time</em>. Early binding is fast and lets the compiler check; late binding is flexible. A design chooses a moment per name, and the whole art lies in choosing it per case. The program below is compiled <em>once</em>; the pricing policy it uses is named only at run time (<code>dlopen</code> loads a shared library by name, <code>dlsym</code> finds the function by name), so swapping a policy needs no recompilation of the host — and a missing plugin is discovered only when it is asked for:</p>
<div class="out"># Binding time: the host program is compiled ONCE; the policy is chosen at RUN time by loading a plugin (dlopen)<br>
$ cat &gt; host.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;dlfcn.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;void *h = dlopen(argv[1], RTLD_NOW); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* LATE binding: the name is known only now */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (!h) { printf("cannot load %s: %s\\n", argv[1], dlerror()); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int (*price)(int) = (int (*)(int)) dlsym(h, "price"); /* find the function by its NAME */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("%s: price(100) = %d\\n", argv[1], price(100));<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;dlclose(h);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ cat &gt; normal.c &lt;&lt;'END'<br>
&gt; int price(int net) { return net + net / 10; } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* + 10 % VAT */<br>
&gt; END<br>
$ cat &gt; promo.c &lt;&lt;'END'<br>
&gt; int price(int net) { return (net + net / 10) * 8 / 10; } /* VAT, then 20 % off */<br>
&gt; END<br>
$ gcc -o host host.c<br>
$ gcc -shared -fPIC -o normal.so normal.c<br>
$ gcc -shared -fPIC -o promo.so promo.c<br>
# the same host binary, two behaviours — nothing recompiled between the two runs<br>
$ ./host ./normal.so<br>
./normal.so: price(100) = 110<br>
$ ./host ./promo.so<br>
./promo.so: price(100) = 88<br>
# a plugin that does not exist: the error appears only at run time<br>
$ ./host ./missing.so<br>
cannot load ./missing.so: ./missing.so: cannot open shared object file: No such file or directory<br>
# the host does not list the plugin at link time<br>
$ ldd ./host | grep -c 'normal\\|promo'<br>
0</div>
<p>The last line shows that the host binary does not list <code>normal.so</code> or <code>promo.so</code> among its libraries (<code>ldd</code> counted 0): binding happened at the latest possible moment. The price of late binding is exactly the error on the third run — what would have been a compile error became a run-time error.</p>
<p class="pitfall">⚠️ Do not mix up <em>name</em>, <em>object</em> and <em>binding</em>. A name is only a label; the object can live on after the name is gone (hard link example) and a name can outlive the object (the symbolic link that dangles). A test favourite: "after <code>rm</code> of the original file, can you still read the data through a hard link?" — yes; "through a symbolic link?" — no.</p>
<p>🧭 <strong>On a real server:</strong> a REST resource has an external name (<code>/orders/42</code>, or a slug in a URL) and an internal one (primary key <code>id = 1048576</code>) — and the rule "never expose or depend on a mutable external name as the key" is Figure 12-4 in database form. Environment variables and service discovery are late binding: the code says <code>db-host</code>, the deployment decides what that means (Kubernetes DNS, Docker network aliases). Interview: "why use a surrogate key instead of the email as primary key?" — the email is an external name that changes.</p>`,
        `<p class="y-chinh">🎯 Hình 12-4: <strong>tên</strong> có hai loại. <em>Tên ngoài</em> dành cho con người — <code>/usr/ast/books/mos2/Chap-12</code>. <em>Tên trong</em> dành cho hệ thống — một số nhỏ, ở đây là i-node 2. <strong>Thư mục (directory)</strong> là bảng ánh xạ cái này sang cái kia: mục <code>Chap-12</code> chứa số 2, và i-node 2 mô tả tệp.</p>
<p>Gần như mọi đối tượng của HĐH đều cần tên: tệp, tiến trình, thiết bị, máy trên mạng. Lời khuyên của sách là thiết kế nên cho mỗi đối tượng một <strong>tên trong</strong> rẻ cho máy (chỉ số, con trỏ, số) và để <strong>tên ngoài</strong> là chuỗi giàu nghĩa cho người, với một phép ánh xạ ở giữa. Vì sao hai? Vì hai đối tượng người dùng muốn thứ trái ngược: con người muốn tên dài, dễ nhớ, phân cấp, đổi tự do, còn máy muốn một khoá nhỏ cố định không bao giờ đổi. Tầng ánh xạ — thư mục — là thứ cho phép <em>đổi tên</em> tệp mà không động tới nội dung, cho nó <em>nhiều tên</em>, hoặc <em>di chuyển</em> nó chỉ bằng cách sửa thư mục. Khuôn mẫu này có ở khắp nơi: tên tệp → số i-node; tệp đang mở → <strong>file descriptor (bộ mô tả tệp)</strong> (một số nguyên nhỏ tiến trình dùng, nhân ánh xạ sang đối tượng tệp mở thật); tên máy → địa chỉ IP (DNS); URL → máy chủ và tài nguyên; tên biến → địa chỉ bộ nhớ.</p>
<p>➕ Xem hai tầng bằng công cụ thật. Dưới đây, một tệp có <em>hai tên ngoài</em> (<strong>hard link</strong> — mục thư mục thứ hai cho cùng i-node) và một <em>liên kết mềm (symbolic link)</em> (đối tượng khác mà nội dung là một tên khác). Xoá tên gốc không giết dữ liệu, vì i-node còn một tên; liên kết mềm gãy, vì nó lưu một tên, không phải i-node:</p>
<div class="out"># Hình 12-4: TÊN ngoài được thư mục ánh xạ thành TÊN trong (số i-node)<br>
$ echo "chapter twelve" &gt; Chap-12<br>
# tên ngoài thứ hai cho CÙNG một đối tượng bên trong (hard link)<br>
$ ln Chap-12 ban-sao-cung-inode<br>
# liên kết mềm là thứ khác: tệp có nội dung là một TÊN khác<br>
$ ln -s Chap-12 lien-ket-mem<br>
$ [ "$(stat -c %i Chap-12)" = "$(stat -c %i ban-sao-cung-inode)" ] &amp;&amp; echo "Chap-12 and ban-sao-cung-inode: SAME internal name (i-node)"<br>
Chap-12 and ban-sao-cung-inode: SAME internal name (i-node)<br>
$ [ "$(stat -c %i Chap-12)" = "$(stat -c %i lien-ket-mem)" ] || echo "Chap-12 and lien-ket-mem: DIFFERENT i-node"<br>
Chap-12 and lien-ket-mem: DIFFERENT i-node<br>
$ stat -c '%n: %h name(s) for this i-node' Chap-12<br>
Chap-12: 2 name(s) for this i-node<br>
$ readlink lien-ket-mem<br>
Chap-12<br>
# xoá tên gốc: đối tượng vẫn sống vì còn tên khác trỏ tới<br>
$ rm Chap-12<br>
$ cat ban-sao-cung-inode<br>
chapter twelve<br>
# liên kết mềm giờ giữ một tên không còn phân giải được<br>
$ cat lien-ket-mem<br>
cat: lien-ket-mem: No such file or directory<br>
# ls -i in tên trong; ta đếm số tên khác nhau<br>
$ ls -i | awk '{print $1}' | sort -u | wc -l<br>
2</div>
<p>Sự phân biệt chính là toàn bộ Hình 12-4: <code>Chap-12</code> và <code>ban-sao-cung-inode</code> là hai mục thư mục chứa <em>cùng một tên trong</em>; <code>lien-ket-mem</code> chứa một <em>tên ngoài</em> và phải tra lại mỗi lần — nên nó có thể treo (dangling). (Chi tiết i-node: bài 4.)</p>
<p>➕ <strong>Thời điểm gắn kết (binding time)</strong> (sách §12.3.5) là lúc một tên được buộc vào vật nó chỉ. Có thể sớm — lúc <em>biên dịch</em> (hằng, địa chỉ cố định), lúc <em>liên kết</em>, lúc <em>nạp</em>, hoặc muộn — lúc <em>chạy</em>. Gắn kết sớm nhanh và cho trình biên dịch kiểm tra; gắn kết muộn linh hoạt. Một thiết kế chọn một thời điểm cho từng tên, và toàn bộ nghệ thuật nằm ở chọn cho từng trường hợp. Chương trình dưới được dịch <em>một lần</em>; chính sách tính giá nó dùng chỉ được gọi tên lúc chạy (<code>dlopen</code> nạp thư viện chia sẻ theo tên, <code>dlsym</code> tìm hàm theo tên), nên đổi chính sách không cần dịch lại chương trình chủ — và plugin thiếu chỉ bị phát hiện khi được hỏi tới:</p>
<div class="out"># Thời điểm gắn kết: chương trình chủ dịch MỘT lần; chính sách được chọn lúc CHẠY bằng cách nạp plugin (dlopen)<br>
$ cat &gt; host.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;dlfcn.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;void *h = dlopen(argv[1], RTLD_NOW); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* LATE binding: the name is known only now */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (!h) { printf("cannot load %s: %s\\n", argv[1], dlerror()); return 1; }<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int (*price)(int) = (int (*)(int)) dlsym(h, "price"); /* find the function by its NAME */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("%s: price(100) = %d\\n", argv[1], price(100));<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;dlclose(h);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ cat &gt; normal.c &lt;&lt;'END'<br>
&gt; int price(int net) { return net + net / 10; } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* + 10 % VAT */<br>
&gt; END<br>
$ cat &gt; promo.c &lt;&lt;'END'<br>
&gt; int price(int net) { return (net + net / 10) * 8 / 10; } /* VAT, then 20 % off */<br>
&gt; END<br>
$ gcc -o host host.c<br>
$ gcc -shared -fPIC -o normal.so normal.c<br>
$ gcc -shared -fPIC -o promo.so promo.c<br>
# cùng một tệp host, hai hành vi — không dịch lại gì giữa hai lần chạy<br>
$ ./host ./normal.so<br>
./normal.so: price(100) = 110<br>
$ ./host ./promo.so<br>
./promo.so: price(100) = 88<br>
# plugin không tồn tại: lỗi chỉ hiện lúc chạy<br>
$ ./host ./missing.so<br>
cannot load ./missing.so: ./missing.so: cannot open shared object file: No such file or directory<br>
# lúc liên kết, host không hề ghi plugin<br>
$ ldd ./host | grep -c 'normal\\|promo'<br>
0</div>
<p>Dòng cuối cho thấy tệp chủ không liệt kê <code>normal.so</code> hay <code>promo.so</code> trong các thư viện của nó (<code>ldd</code> đếm được 0): gắn kết xảy ra ở thời điểm muộn nhất có thể. Cái giá của gắn kết muộn chính là lỗi ở lần chạy thứ ba — thứ lẽ ra là lỗi biên dịch đã thành lỗi lúc chạy.</p>
<p class="pitfall">⚠️ Đừng lẫn <em>tên</em>, <em>đối tượng</em> và <em>gắn kết</em>. Tên chỉ là nhãn; đối tượng có thể sống tiếp khi tên đã mất (ví dụ hard link) và tên có thể sống lâu hơn đối tượng (liên kết mềm treo). Câu hay gặp: "sau khi <code>rm</code> tệp gốc, còn đọc được dữ liệu qua hard link không?" — còn; "qua liên kết mềm?" — không.</p>
<p>🧭 <strong>Trên server thật:</strong> một tài nguyên REST có tên ngoài (<code>/orders/42</code>, hay slug trong URL) và tên trong (khoá chính <code>id = 1048576</code>) — và quy tắc "không bao giờ để lộ hay phụ thuộc một tên ngoài có thể đổi làm khoá" là Hình 12-4 dưới dạng cơ sở dữ liệu. Biến môi trường và service discovery là gắn kết muộn: mã nói <code>db-host</code>, môi trường triển khai quyết định nó nghĩa là gì (DNS của Kubernetes, bí danh mạng Docker). Phỏng vấn: "vì sao dùng khoá thay thế (surrogate key) thay vì email làm khoá chính?" — email là tên ngoài và sẽ đổi.</p>`],
      [8, 'Static vs. Dynamic Structures',
        `<p class="y-chinh">🎯 Figure 12-5: the code that searches the process table for a given PID — a <code>for</code> loop over <code>proc_table[0] … proc_table[PROC_TABLE_SIZE − 1]</code>. The table is a <strong>static structure</strong>: its size is fixed when the kernel is built. The alternative is a <strong>dynamic structure</strong> (a list, tree or hash table that grows and shrinks) allocated while the system runs.</p>
<p>The static choice is attractive for a kernel: an array needs no allocator, cannot run out of memory in the middle of a critical operation, and is trivially simple to write — the loop on the slide is the whole search. Its costs are two. <em>Waste or limit</em>: a table sized for the worst case wastes memory on every normal day, and a table sized for the normal case turns the abnormal day into an error ("cannot create process"). <em>Speed</em>: finding one entry by scanning is O(n) — acceptable for 64 processes, painful for 100,000. A <strong>dynamic</strong> structure fixes both (it uses exactly what is needed, and a hash index finds an entry in about one step) but requires an allocator inside the kernel, can fail at the worst time ("out of memory" while the kernel is handling an interrupt), and costs code and care. The book's conclusion: static structures are simple but waste memory; dynamic ones save memory at the price of complexity — the designer weighs which failure is worse.</p>
<p>➕ The scan versus an index, counted by a program on a table of 1,024 slots (the worst case is the last pid):</p>
<pre><code class="language-c">// Slide 8 (Figure 12-5): searching the process table — static array scan vs a dynamic index
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define PROC_TABLE_SIZE 1024            // STATIC: fixed when the kernel is compiled
struct proc { int proc_pid; };
static struct proc proc_table[PROC_TABLE_SIZE];

int find_scan(int pid, long *cmp) {     // the book's loop, Figure 12-5
    struct proc *p; int found = 0;
    for (p = &amp;proc_table[0]; p &lt; &amp;proc_table[PROC_TABLE_SIZE]; p++) {
        (*cmp)++;
        if (p-&gt;proc_pid == pid) { found = 1; break; }
    }
    return found;
}
#define HASH_SIZE 4099                  // DYNAMIC-style: an index keyed by pid
static int hash_table[HASH_SIZE];       // slot = index in proc_table + 1, 0 = empty
static void hash_put(int pid, int slot) { int h = pid % HASH_SIZE; while (hash_table[h]) h = (h + 1) % HASH_SIZE; hash_table[h] = slot + 1; }
static int hash_find(int pid, long *cmp) {
    int h = pid % HASH_SIZE;
    while (hash_table[h]) { (*cmp)++; if (proc_table[hash_table[h] - 1].proc_pid == pid) return 1; h = (h + 1) % HASH_SIZE; }
    return 0;
}
int main(void) {
    for (int i = 0; i &lt; PROC_TABLE_SIZE; i++) { proc_table[i].proc_pid = 1000 + i; hash_put(1000 + i, i); }
    long c1 = 0, c2 = 0;
    int last = 1000 + PROC_TABLE_SIZE - 1;
    printf("pid %d found by scan: %d\\n", last, find_scan(last, &amp;c1));
    printf("fixed table, worst case: %ld comparisons\\n", c1);
    printf("pid %d found by index: %d\\n", last, hash_find(last, &amp;c2));
    printf("index table: %ld comparison\\n", c2);
    printf("memory: table %zu bytes + index %zu bytes\\n", sizeof proc_table, sizeof hash_table);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-tien-trinh.c -o bang-tien-trinh &amp;&amp; ./bang-tien-trinh<br>
pid 2023 found by scan: 1<br>
fixed table, worst case: 1024 comparisons<br>
pid 2023 found by index: 1<br>
index table: 1 comparison<br>
memory: table 4096 bytes + index 16396 bytes</div>
<p>The scan needed 1,024 comparisons; the index needed one. The index paid for this with 16 KB of extra memory (four times the table) — this is a <strong>space–time trade-off</strong> (slides 10–12) hidden inside a static-versus-dynamic question, and the two topics are one theme seen from two sides. Real Linux uses neither a plain array nor one big list: it keeps tasks in a tree (the pid namespace's IDR/XArray tree) so lookup by pid is fast, while the <em>limit</em> on how many exist is still a number you can read and change.</p>
<p>➕ And the "static limit" really bites. In the program below the container allows at most 20 processes (<code>--pids-limit=20</code>, the cgroup <code>pids.max</code> of lesson 7); <code>fork</code> keeps creating children until the table of the cgroup is full, and the system answers with a normal error, not a crash:</p>
<pre><code class="language-c">// A STATIC table has a fixed size: here the container allows at most 20 processes, and fork() runs out of slots
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    int made = 0;
    for (;;) {
        pid_t p = fork();
        if (p == 0) { pause(); _exit(0); }              // child: just occupy a slot
        if (p &lt; 0) { printf("fork failed: %s (errno %d)\\n", strerror(errno), errno); break; }
        made++;
    }
    printf("created %d children before the table was full\\n", made);
    signal(SIGTERM, SIG_IGN);
    kill(0, SIGTERM);                                   // clean up the whole process group
    while (wait(NULL) &gt; 0) {}
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--pids-limit=20</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread het-cho-trong-bang.c -o het-cho-trong-bang &amp;&amp; ./het-cho-trong-bang<br>
fork failed: Resource temporarily unavailable (errno 11)<br>
created 18 children before the table was full</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The run is one sample (🎲): the number of children depends on how many processes already exist in the box (18 here, with the shell and the program itself using the other 2). The error <code>EAGAIN</code> ("Resource temporarily unavailable") is the system saying "the static table is full — try again later".</p>
<p class="pitfall">⚠️ "Static is bad, dynamic is good" is the wrong summary. Embedded and real-time systems often <em>choose</em> static allocation on purpose, because they must never fail at an unexpected moment and must know their worst-case memory use in advance. The right answer to "which is better?" is "depends on whether predictability or flexibility matters more". Also note: <code>PROC_TABLE_SIZE</code> as a compile-time constant is early binding (slide 7) — static structures and early binding go together.</p>
<p>🧭 <strong>On a real server:</strong> fixed-size pools are static structures you tune every week — a database connection pool of 10, an <code>nginx</code> <code>worker_connections</code> of 1024, a thread pool of 200 in Tomcat, Linux <code>ulimit -n</code> for open files. When the pool is full you get exactly the symptoms above: "too many connections", <code>EMFILE</code>, requests queueing. Sizing them is the static-versus-dynamic decision made by you. PostgreSQL's <code>max_connections</code> is static for the same reason as the kernel's table — shared memory for the slots is reserved at start-up — which is why a pooler like PgBouncer sits in front.</p>`,
        `<p class="y-chinh">🎯 Hình 12-5: đoạn mã tìm trong bảng tiến trình một PID cho trước — vòng <code>for</code> qua <code>proc_table[0] … proc_table[PROC_TABLE_SIZE − 1]</code>. Bảng là <strong>cấu trúc tĩnh (static structure)</strong>: cỡ của nó cố định từ lúc dựng nhân. Phương án kia là <strong>cấu trúc động (dynamic structure)</strong> — danh sách, cây hay bảng băm lớn lên và co lại — được cấp phát khi hệ thống đang chạy.</p>
<p>Lựa chọn tĩnh hấp dẫn với một nhân: mảng không cần bộ cấp phát, không thể hết bộ nhớ giữa một thao tác tới hạn, và viết cực đơn giản — vòng lặp trên slide là toàn bộ phép tìm. Cái giá có hai. <em>Lãng phí hoặc giới hạn</em>: bảng cỡ cho trường hợp xấu nhất lãng phí bộ nhớ mỗi ngày bình thường, còn bảng cỡ cho trường hợp thường biến ngày bất thường thành lỗi ("không tạo được tiến trình"). <em>Tốc độ</em>: tìm một mục bằng quét là O(n) — chấp nhận được với 64 tiến trình, đau với 100.000. Cấu trúc <strong>động</strong> sửa cả hai (dùng đúng cái cần, và chỉ mục băm tìm một mục trong chừng một bước) nhưng đòi bộ cấp phát trong nhân, có thể hỏng đúng lúc tệ nhất ("hết bộ nhớ" khi nhân đang xử lý ngắt), và tốn mã và công chăm sóc. Kết luận của sách: cấu trúc tĩnh đơn giản nhưng phí bộ nhớ; cấu trúc động tiết kiệm bộ nhớ bằng giá phức tạp — người thiết kế cân xem thất bại nào tệ hơn.</p>
<p>➕ Quét so với chỉ mục, do chương trình đếm trên bảng 1.024 ô (trường hợp xấu nhất là pid cuối):</p>
<pre><code class="language-c">// Slide 8 (Hình 12-5): tìm trong bảng tiến trình — quét mảng tĩnh và chỉ mục động
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define PROC_TABLE_SIZE 1024            // TĨNH: cố định lúc biên dịch nhân
struct proc { int proc_pid; };
static struct proc proc_table[PROC_TABLE_SIZE];

int find_scan(int pid, long *cmp) {     // vòng lặp của sách, Hình 12-5
    struct proc *p; int found = 0;
    for (p = &amp;proc_table[0]; p &lt; &amp;proc_table[PROC_TABLE_SIZE]; p++) {
        (*cmp)++;
        if (p-&gt;proc_pid == pid) { found = 1; break; }
    }
    return found;
}
#define HASH_SIZE 4099                  // kiểu ĐỘNG: chỉ mục khoá theo pid
static int hash_table[HASH_SIZE];       // ô = chỉ số trong proc_table + 1, 0 = trống
static void hash_put(int pid, int slot) { int h = pid % HASH_SIZE; while (hash_table[h]) h = (h + 1) % HASH_SIZE; hash_table[h] = slot + 1; }
static int hash_find(int pid, long *cmp) {
    int h = pid % HASH_SIZE;
    while (hash_table[h]) { (*cmp)++; if (proc_table[hash_table[h] - 1].proc_pid == pid) return 1; h = (h + 1) % HASH_SIZE; }
    return 0;
}
int main(void) {
    for (int i = 0; i &lt; PROC_TABLE_SIZE; i++) { proc_table[i].proc_pid = 1000 + i; hash_put(1000 + i, i); }
    long c1 = 0, c2 = 0;
    int last = 1000 + PROC_TABLE_SIZE - 1;
    printf("pid %d found by scan: %d\\n", last, find_scan(last, &amp;c1));
    printf("fixed table, worst case: %ld comparisons\\n", c1);
    printf("pid %d found by index: %d\\n", last, hash_find(last, &amp;c2));
    printf("index table: %ld comparison\\n", c2);
    printf("memory: table %zu bytes + index %zu bytes\\n", sizeof proc_table, sizeof hash_table);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-tien-trinh.c -o bang-tien-trinh &amp;&amp; ./bang-tien-trinh<br>
pid 2023 found by scan: 1<br>
fixed table, worst case: 1024 comparisons<br>
pid 2023 found by index: 1<br>
index table: 1 comparison<br>
memory: table 4096 bytes + index 16396 bytes</div>
<p>Quét cần 1.024 phép so sánh; chỉ mục cần một. Chỉ mục trả cho điều này bằng 16 KB bộ nhớ thêm (gấp bốn lần bảng) — đây là một <strong>đánh đổi không gian–thời gian</strong> (slide 10–12) ẩn trong câu hỏi tĩnh–động, và hai chủ đề là một mạch nhìn từ hai phía. Linux thật không dùng mảng trơn lẫn một danh sách lớn: nó giữ các tác vụ trong cây (IDR/XArray tree của pid namespace) để tìm theo pid nhanh, trong khi <em>giới hạn</em> số lượng vẫn là một con số bạn đọc và đổi được.</p>
<p>➕ Và "giới hạn tĩnh" thật sự cắn. Trong chương trình dưới, container chỉ cho tối đa 20 tiến trình (<code>--pids-limit=20</code>, <code>pids.max</code> của cgroup ở bài 7); <code>fork</code> cứ tạo con tới khi bảng của cgroup đầy, và hệ thống đáp bằng một lỗi bình thường, không sập:</p>
<pre><code class="language-c">// Bảng TĨNH có cỡ cố định: container này chỉ cho tối đa 20 tiến trình, và fork() hết ô
#include &lt;errno.h&gt;
#include &lt;signal.h&gt;
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    int made = 0;
    for (;;) {
        pid_t p = fork();
        if (p == 0) { pause(); _exit(0); }              // con: chỉ chiếm một ô
        if (p &lt; 0) { printf("fork failed: %s (errno %d)\\n", strerror(errno), errno); break; }
        made++;
    }
    printf("created %d children before the table was full\\n", made);
    signal(SIGTERM, SIG_IGN);
    kill(0, SIGTERM);                                   // dọn cả nhóm tiến trình
    while (wait(NULL) &gt; 0) {}
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--pids-limit=20</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread het-cho-trong-bang.c -o het-cho-trong-bang &amp;&amp; ./het-cho-trong-bang<br>
fork failed: Resource temporarily unavailable (errno 11)<br>
created 18 children before the table was full</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Lần chạy là một mẫu (🎲): số con phụ thuộc số tiến trình đã có trong hộp (ở đây 18, shell và chính chương trình dùng 2 ô còn lại). Lỗi <code>EAGAIN</code> ("Resource temporarily unavailable") là hệ thống nói "bảng tĩnh đã đầy — thử lại sau".</p>
<p class="pitfall">⚠️ "Tĩnh là xấu, động là tốt" là tóm tắt sai. Hệ nhúng và thời gian thực thường <em>chủ động chọn</em> cấp phát tĩnh, vì chúng không bao giờ được hỏng vào lúc bất ngờ và phải biết trước mức dùng bộ nhớ xấu nhất. Câu trả lời đúng cho "cái nào tốt hơn?" là "tuỳ dự đoán được hay linh hoạt quan trọng hơn". Cũng để ý: <code>PROC_TABLE_SIZE</code> là hằng lúc biên dịch tức gắn kết sớm (slide 7) — cấu trúc tĩnh và gắn kết sớm đi cùng nhau.</p>
<p>🧭 <strong>Trên server thật:</strong> các pool cỡ cố định là cấu trúc tĩnh bạn chỉnh mỗi tuần — pool kết nối cơ sở dữ liệu 10, <code>worker_connections</code> của <code>nginx</code> 1024, pool luồng 200 của Tomcat, <code>ulimit -n</code> cho tệp mở của Linux. Khi pool đầy bạn gặp đúng các triệu chứng trên: "too many connections", <code>EMFILE</code>, yêu cầu xếp hàng. Định cỡ chúng là quyết định tĩnh–động do chính bạn đưa ra. <code>max_connections</code> của PostgreSQL tĩnh vì cùng lý do với bảng của nhân — bộ nhớ chia sẻ cho các ô được dành sẵn lúc khởi động — nên mới có bộ gom như PgBouncer đứng trước.</p>`],
      [9, 'Hiding the Hardware',
        `<p class="y-chinh">🎯 Figure 12-6: hardware-dependent code hidden behind <strong>conditional compilation</strong>. (a) CPU-dependent: <code>#if (CPU == IA32) … #endif</code> and <code>#if (CPU == ULTRASPARC) … #endif</code> around the start-up code of each CPU. (b) Word-length-dependent: <code>#if (WORD_LENGTH == 32) typedef int Register;</code> and <code>#if (WORD_LENGTH == 64) typedef long Register;</code>. Both include <code>config.h</code>, which defines <code>CPU</code> and <code>WORD_LENGTH</code> once.</p>
<p>The lesson is a rule of thumb for portable software: <strong>machine-dependent code must be few, small and in known places</strong>. The configuration file <code>config.h</code> is the one place where the platform is named; everything else asks "is the word 64 bits?" through a name (<code>Register</code>) rather than hard-coding <code>long</code>. This is <em>hiding the hardware</em> (book §12.3, "useful techniques"): the first layer of Figure 12-2 on slide 5. The cost of ignoring the rule is the classic porting disaster — assumptions such as "an <code>int</code> is 32 bits", "a pointer fits in an <code>int</code>" or "the bytes of a number are stored lowest first" scattered over a million lines, each one waiting to break on the next CPU.</p>
<p>➕ The same technique for real, compiled on this container's CPU. The <code>#if</code> blocks pick the code at <em>compile time</em> (early binding — the unused branch does not even exist in the binary); a <code>typedef</code> gives the machine word one name:</p>
<pre><code class="language-c">// Figure 12-6: hiding the hardware with conditional compilation
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;

// "config.h": written by the build system, NOT by hand
#if defined(__x86_64__)
#  define CPU "x86-64"
#elif defined(__aarch64__)
#  define CPU "ARM64"
#else
#  define CPU "other"
#endif
#if __SIZEOF_POINTER__ == 8
#  define WORD_LENGTH 64
typedef long Register;
#else
#  define WORD_LENGTH 32
typedef int Register;
#endif
static void init(void) {
#if defined(__x86_64__)
    printf("init: x86-64 specific start-up code would be here\\n");
#elif defined(__aarch64__)
    printf("init: ARM64 specific start-up code would be here\\n");
#endif
}
int main(void) {
    init();
    printf("compiled for CPU = %s, WORD_LENGTH = %d\\n", CPU, WORD_LENGTH);
    printf("sizeof(Register) = %zu bytes, sizeof(void *) = %zu bytes\\n", sizeof(Register), sizeof(void *));
    printf("int32_t = %zu bytes always, int = %zu, long = %zu (these CHANGE with the platform)\\n", sizeof(int32_t), sizeof(int), sizeof(long));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread an-phan-cung.c -o an-phan-cung &amp;&amp; ./an-phan-cung<br>
init: ARM64 specific start-up code would be here<br>
compiled for CPU = ARM64, WORD_LENGTH = 64<br>
sizeof(Register) = 8 bytes, sizeof(void *) = 8 bytes<br>
int32_t = 4 bytes always, int = 4, long = 8 (these CHANGE with the platform)</div>
<p>This run is on ARM64 (the container of a Mac with Apple silicon); on an x86-64 PC or WSL the same source prints <code>x86-64</code> in the first lines. Note the last line: the <em>sizes of <code>int</code> and <code>long</code> change with the platform</em> (Windows 64-bit keeps <code>long</code> at 4 bytes; Linux 64-bit makes it 8) — that is why portable code uses fixed-size types like <code>int32_t</code> from <code>&lt;stdint.h&gt;</code>. The slide's CPUs are dated: IA32 is 32-bit x86 and UltraSPARC is Sun's CPU; today the two names to know are x86-64 and ARM64 (<code>__x86_64__</code>, <code>__aarch64__</code>).</p>
<p>➕ In practice the kernels avoid <code>#if</code> inside ordinary code — a file full of <code>#ifdef</code> is hard to read and test. Linux keeps machine-dependent code in separate directories, <code>arch/x86</code>, <code>arch/arm64</code>, <code>arch/riscv</code> … with the same function names, and the build system picks one directory; the portable code in <code>kernel/</code> and <code>mm/</code> just calls the function. That is "hiding the hardware" by <em>indirection</em> (a level between the caller and the thing called — slide 3's table of function pointers is one) instead of by the preprocessor.</p>
<p class="pitfall">⚠️ Conditional compilation hides differences but does not remove them: every <code>#if</code> doubles the configurations to test, and a branch that is never compiled on your machine can be broken for months without anyone noticing. Prefer a thin interface with one implementation per platform; use <code>#if</code> only to select between them.</p>
<p>🧭 <strong>On a real server:</strong> "hiding the hardware" is the reason Docker images, the JVM ("write once, run anywhere") and Node's cross-platform APIs exist: your Spring Boot code never asks the CPU model. The same rule applies to <em>environments</em>: put every difference between development and production (URLs, keys, pool sizes) into configuration read in one place, not into <code>if (env == "prod")</code> scattered through the code — the twelve-factor-app rule is <code>config.h</code> for servers. Interview: "how do you make the same build run in dev, staging and production?"</p>`,
        `<p class="y-chinh">🎯 Hình 12-6: mã phụ thuộc phần cứng được giấu sau <strong>biên dịch có điều kiện (conditional compilation)</strong>. (a) Phụ thuộc CPU: <code>#if (CPU == IA32) … #endif</code> và <code>#if (CPU == ULTRASPARC) … #endif</code> bao quanh mã khởi động của từng CPU. (b) Phụ thuộc độ dài từ máy: <code>#if (WORD_LENGTH == 32) typedef int Register;</code> và <code>#if (WORD_LENGTH == 64) typedef long Register;</code>. Cả hai include <code>config.h</code>, nơi định nghĩa <code>CPU</code> và <code>WORD_LENGTH</code> đúng một lần.</p>
<p>Bài học là một quy tắc ngón tay cái cho phần mềm khả chuyển: <strong>mã phụ thuộc máy phải ít, nhỏ và ở những chỗ biết trước</strong>. Tệp cấu hình <code>config.h</code> là nơi duy nhất gọi tên nền tảng; mọi thứ khác hỏi "từ máy có 64 bit không?" qua một cái tên (<code>Register</code>) chứ không viết cứng <code>long</code>. Đây là <em>ẩn phần cứng (hiding the hardware)</em> (sách §12.3, "kỹ thuật hữu ích"): tầng đầu tiên của Hình 12-2 ở slide 5. Cái giá của việc bỏ qua quy tắc là thảm hoạ chuyển mã kinh điển — những giả định như "<code>int</code> là 32 bit", "con trỏ chứa vừa trong <code>int</code>" hay "byte của một số lưu byte thấp trước" rải trong một triệu dòng, mỗi cái chờ vỡ ở CPU kế tiếp.</p>
<p>➕ Cùng kỹ thuật chạy thật, dịch trên CPU của container này. Các khối <code>#if</code> chọn mã lúc <em>biên dịch</em> (gắn kết sớm — nhánh không dùng thậm chí không tồn tại trong tệp nhị phân); <code>typedef</code> cho từ máy một cái tên:</p>
<pre><code class="language-c">// Hình 12-6: ẩn phần cứng bằng biên dịch có điều kiện
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;

// "config.h": do hệ thống build sinh ra, KHÔNG viết tay
#if defined(__x86_64__)
#  define CPU "x86-64"
#elif defined(__aarch64__)
#  define CPU "ARM64"
#else
#  define CPU "other"
#endif
#if __SIZEOF_POINTER__ == 8
#  define WORD_LENGTH 64
typedef long Register;
#else
#  define WORD_LENGTH 32
typedef int Register;
#endif
static void init(void) {
#if defined(__x86_64__)
    printf("init: x86-64 specific start-up code would be here\\n");
#elif defined(__aarch64__)
    printf("init: ARM64 specific start-up code would be here\\n");
#endif
}
int main(void) {
    init();
    printf("compiled for CPU = %s, WORD_LENGTH = %d\\n", CPU, WORD_LENGTH);
    printf("sizeof(Register) = %zu bytes, sizeof(void *) = %zu bytes\\n", sizeof(Register), sizeof(void *));
    printf("int32_t = %zu bytes always, int = %zu, long = %zu (these CHANGE with the platform)\\n", sizeof(int32_t), sizeof(int), sizeof(long));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread an-phan-cung.c -o an-phan-cung &amp;&amp; ./an-phan-cung<br>
init: ARM64 specific start-up code would be here<br>
compiled for CPU = ARM64, WORD_LENGTH = 64<br>
sizeof(Register) = 8 bytes, sizeof(void *) = 8 bytes<br>
int32_t = 4 bytes always, int = 4, long = 8 (these CHANGE with the platform)</div>
<p>Lần chạy này trên ARM64 (container của máy Mac chip Apple); trên PC x86-64 hay WSL cùng mã nguồn in <code>x86-64</code> ở các dòng đầu. Để ý dòng cuối: <em>cỡ của <code>int</code> và <code>long</code> đổi theo nền tảng</em> (Windows 64 bit giữ <code>long</code> 4 byte; Linux 64 bit cho nó 8) — vì thế mã khả chuyển dùng kiểu cỡ cố định như <code>int32_t</code> trong <code>&lt;stdint.h&gt;</code>. Các CPU trên slide đã cũ: IA32 là x86 32 bit và UltraSPARC là CPU của Sun; ngày nay hai cái tên cần biết là x86-64 và ARM64 (<code>__x86_64__</code>, <code>__aarch64__</code>).</p>
<p>➕ Thực tế các nhân tránh <code>#if</code> trong mã thường — tệp đầy <code>#ifdef</code> khó đọc và khó kiểm thử. Linux giữ mã phụ thuộc máy trong các thư mục riêng, <code>arch/x86</code>, <code>arch/arm64</code>, <code>arch/riscv</code> … với cùng tên hàm, và hệ thống build chọn một thư mục; mã khả chuyển trong <code>kernel/</code> và <code>mm/</code> chỉ việc gọi hàm. Đó là "ẩn phần cứng" bằng <em>gián tiếp (indirection)</em> — một tầng giữa người gọi và vật được gọi; bảng con trỏ hàm ở slide 3 là một ví dụ — thay vì bằng bộ tiền xử lý.</p>
<p class="pitfall">⚠️ Biên dịch có điều kiện che sự khác biệt nhưng không loại bỏ nó: mỗi <code>#if</code> nhân đôi số cấu hình phải kiểm thử, và nhánh không bao giờ được dịch trên máy bạn có thể hỏng hàng tháng mà không ai hay. Hãy ưu tiên giao diện mỏng với một cài đặt cho mỗi nền tảng; chỉ dùng <code>#if</code> để chọn giữa chúng.</p>
<p>🧭 <strong>Trên server thật:</strong> "ẩn phần cứng" là lý do Docker image, JVM ("viết một lần, chạy mọi nơi") và các API đa nền tảng của Node tồn tại: mã Spring Boot của bạn không bao giờ hỏi đời CPU. Cùng quy tắc áp cho <em>môi trường</em>: đưa mọi khác biệt giữa phát triển và sản xuất (URL, khoá, cỡ pool) vào cấu hình đọc ở một chỗ, đừng rải <code>if (env == "prod")</code> khắp mã — quy tắc twelve-factor app là <code>config.h</code> cho máy chủ. Phỏng vấn: "làm sao cho cùng một bản build chạy ở dev, staging và production?"</p>`],
      [10, 'Space-Time Trade-offs (1)',
        `<p class="y-chinh">🎯 Figure 12-7(a): <code>bit_count(int byte)</code> counts the 1-bits in a byte with a <strong>loop</strong> of <code>BYTE_SIZE = 8</code> iterations — <code>if ((byte &gt;&gt; i) &amp; 1) count++</code>. It uses almost no memory and does about eight steps of work per call. This is the starting point of the book's main performance example: the same job, three ways, each trading <strong>space</strong> (memory) against <strong>time</strong>.</p>
<p>Before the three versions, the book's performance section (§12.4) gives two warnings that matter more than any trick. <strong>Why are operating systems slow?</strong> Often not because the code is bad, but because of <em>crossings</em> (every system call, context switch or copy between layers costs) and <em>too many layers</em>. <strong>What should you optimise?</strong> Only what a measurement says is slow: an improvement of 1% in a function that takes 1% of the time earns 0.01%, while it adds complexity forever. Donald Knuth's remark — "premature optimization is the root of all evil" (<em>Structured Programming with go to Statements</em>, 1974) — means exactly this: first make it correct and simple, then <em>measure</em>, then optimise the real bottleneck.</p>
<p>➕ Measuring first, for real. A program writes 100,000 bytes to the output two ways: one system call per byte, or through the C library's buffer. Looking at the clock tells you <em>that</em> one is slower; <code>strace -c</code> (count system calls) tells you <em>why</em>:</p>
<div class="out"># Measure BEFORE you optimise: where does the time go? Count system calls with strace -c<br>
$ cat &gt; ghi.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int n = 100000;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (!strcmp(argv[1], "unbuf")) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt; n; i++) write(1, "x", 1); &nbsp;&nbsp;&nbsp;&nbsp;/* one system call per byte */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;} else {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt; n; i++) putchar('x'); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* stdio collects bytes in a buffer */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;}<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ gcc -O2 -o ghi ghi.c<br>
# time each version, output thrown away<br>
$ TIMEFORMAT='%R s elapsed'<br>
$ time ./ghi unbuf &gt; /dev/null<br>
0.060 s elapsed<br>
$ time ./ghi buf &gt; /dev/null<br>
0.002 s elapsed<br>
# count the write system calls<br>
$ strace -c -e trace=write -o u.txt ./ghi unbuf &gt; /dev/null<br>
$ strace -c -e trace=write -o b.txt ./ghi buf &gt; /dev/null<br>
$ awk '/ write$/ {print "unbuffered: " $4 " write calls for 100000 bytes"}' u.txt<br>
unbuffered: 100000 write calls for 100000 bytes<br>
$ awk '/ write$/ {print "buffered: " $4 " write calls for 100000 bytes"}' b.txt<br>
buffered: 25 write calls for 100000 bytes</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Unbuffered: 100,000 <code>write</code> calls, one per byte, each crossing into the kernel; buffered: 25 calls (100,000 bytes ÷ 4,096-byte buffer), because the library <em>trades a little memory — a 4 KB buffer — for time</em>. Both numbers of calls are exact; the elapsed times are one sample on this machine (🎲) and vary — the point is the ratio of calls, which is also the ratio of kernel crossings. This is a <strong>space–time trade-off</strong> in its purest form, and it is the reason <code>printf</code> is faster than a loop of <code>write(1, &amp;c, 1)</code>.</p>
<p>➕ Now the book's example itself. The code below is Figure 12-7(a), the loop; the full comparison of all three versions is on the next slide because it needs a measurement.</p>
<pre class="trich"><code class="language-c">int bit_count(int byte) {             // (a) loop: 8 iterations per call
    int i, count = 0;
    for (i = 0; i &lt; BYTE_SIZE; i++)
        if ((byte &gt;&gt; i) &amp; 1) count++;
    return count;
}</code></pre>
<p>Each call tests eight bits one by one: eight comparisons of <code>i &lt; BYTE_SIZE</code>, eight shifts, eight <code>&amp;</code> operations, up to eight increments, eight <code>i++</code>. If the program counts the bits of millions of bytes — compressing data, computing error-correcting codes, working on a bitmap allocator — those few operations are repeated millions of times, and the question "can I avoid recomputing?" becomes worth asking.</p>
<p class="pitfall">⚠️ The slide only shows version (a); exam questions often ask "which of the three uses the most memory / the least time?" — the answer table is on slide 11. And do not read "space–time trade-off" as "you always gain one by losing the other": sometimes a better algorithm gains both, and a bad design loses both.</p>
<p>🧭 <strong>On a real server:</strong> "measure before optimising" is the first rule of every performance interview. Real tools: <code>strace -c</code>/<code>perf</code> for the OS, the query planner (<code>EXPLAIN ANALYZE</code> in PostgreSQL, lesson 3's pg course) for the database, Spring Boot Actuator and a profiler for the JVM, <code>clinic.js</code> or <code>--cpu-prof</code> for Node. A classic discovery: the endpoint thought to be slow because of "heavy JSON" is slow because it makes 400 database calls — an <em>N+1</em> problem you only see with measurements.</p>`,
        `<p class="y-chinh">🎯 Hình 12-7(a): <code>bit_count(int byte)</code> đếm các bit 1 trong một byte bằng một <strong>vòng lặp</strong> <code>BYTE_SIZE = 8</code> lần — <code>if ((byte &gt;&gt; i) &amp; 1) count++</code>. Nó gần như không dùng bộ nhớ và làm chừng tám bước việc cho mỗi lần gọi. Đây là điểm xuất phát của ví dụ hiệu năng chính trong sách: cùng một việc, ba cách, mỗi cách đánh đổi <strong>không gian (space)</strong> (bộ nhớ) lấy <strong>thời gian (time)</strong>.</p>
<p>Trước ba phiên bản, phần hiệu năng của sách (§12.4) đưa hai lời cảnh báo quan trọng hơn mọi mẹo. <strong>Vì sao HĐH chậm?</strong> Thường không phải vì mã dở, mà vì <em>các lần vượt ranh giới</em> (mỗi lời gọi hệ thống, chuyển ngữ cảnh hay sao chép giữa các tầng đều tốn) và <em>quá nhiều tầng</em>. <strong>Nên tối ưu gì?</strong> Chỉ cái mà phép đo nói là chậm: cải thiện 1% ở hàm chiếm 1% thời gian chỉ được 0,01%, mà thêm độ phức tạp mãi mãi. Câu của Donald Knuth — "tối ưu sớm là gốc rễ của mọi điều xấu" (<em>Structured Programming with go to Statements</em>, 1974) — nghĩa đúng như vậy: trước hết làm cho đúng và đơn giản, rồi <em>đo</em>, rồi mới tối ưu nút cổ chai thật.</p>
<p>➕ Đo trước, chạy thật. Một chương trình ghi 100.000 byte ra output theo hai cách: mỗi byte một lời gọi hệ thống, hoặc qua bộ đệm của thư viện C. Nhìn đồng hồ cho biết <em>rằng</em> một bản chậm hơn; <code>strace -c</code> (đếm lời gọi hệ thống) cho biết <em>vì sao</em>:</p>
<div class="out"># ĐO TRƯỚC khi tối ưu: thời gian đi đâu? Đếm lời gọi hệ thống bằng strace -c<br>
$ cat &gt; ghi.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt; #include &lt;unistd.h&gt;<br>
&gt; int main(int argc, char **argv) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int n = 100000;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if (!strcmp(argv[1], "unbuf")) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt; n; i++) write(1, "x", 1); &nbsp;&nbsp;&nbsp;&nbsp;/* one system call per byte */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;} else {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt; n; i++) putchar('x'); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* stdio collects bytes in a buffer */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;}<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ gcc -O2 -o ghi ghi.c<br>
# bấm giờ từng bản, output vứt đi<br>
$ TIMEFORMAT='%R s elapsed'<br>
$ time ./ghi unbuf &gt; /dev/null<br>
0.060 s elapsed<br>
$ time ./ghi buf &gt; /dev/null<br>
0.002 s elapsed<br>
# đếm số lời gọi hệ thống write<br>
$ strace -c -e trace=write -o u.txt ./ghi unbuf &gt; /dev/null<br>
$ strace -c -e trace=write -o b.txt ./ghi buf &gt; /dev/null<br>
$ awk '/ write$/ {print "unbuffered: " $4 " write calls for 100000 bytes"}' u.txt<br>
unbuffered: 100000 write calls for 100000 bytes<br>
$ awk '/ write$/ {print "buffered: " $4 " write calls for 100000 bytes"}' b.txt<br>
buffered: 25 write calls for 100000 bytes</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Không đệm: 100.000 lời gọi <code>write</code>, mỗi byte một lời gọi, mỗi lời gọi đều vượt vào nhân; có đệm: 25 lời gọi (100.000 byte ÷ bộ đệm 4.096 byte), vì thư viện <em>đổi một ít bộ nhớ — bộ đệm 4 KB — lấy thời gian</em>. Cả hai số lời gọi đều chính xác; thời gian trôi qua là một mẫu trên máy này (🎲) và thay đổi — điều chính là tỉ số lời gọi, cũng là tỉ số lần vượt vào nhân. Đây là <strong>đánh đổi không gian–thời gian</strong> ở dạng thuần nhất, và là lý do <code>printf</code> nhanh hơn một vòng lặp <code>write(1, &amp;c, 1)</code>.</p>
<p>➕ Giờ là chính ví dụ của sách. Mã dưới là Hình 12-7(a), vòng lặp; so sánh đủ ba phiên bản ở slide sau vì cần một phép đo.</p>
<pre class="trich"><code class="language-c">int bit_count(int byte) {             // (a) vòng lặp: 8 vòng cho mỗi lần gọi
    int i, count = 0;
    for (i = 0; i &lt; BYTE_SIZE; i++)
        if ((byte &gt;&gt; i) &amp; 1) count++;
    return count;
}</code></pre>
<p>Mỗi lần gọi thử từng bit trong tám bit: tám phép so sánh <code>i &lt; BYTE_SIZE</code>, tám phép dịch, tám phép <code>&amp;</code>, tối đa tám phép tăng, tám phép <code>i++</code>. Nếu chương trình đếm bit của hàng triệu byte — nén dữ liệu, tính mã sửa lỗi, làm việc với bộ cấp phát bitmap — vài phép toán ấy lặp hàng triệu lần, và câu hỏi "có tránh tính lại được không?" đáng hỏi.</p>
<p class="pitfall">⚠️ Slide chỉ cho thấy phiên bản (a); đề thường hỏi "trong ba bản, bản nào dùng nhiều bộ nhớ nhất / ít thời gian nhất?" — bảng đáp án ở slide 11. Và đừng đọc "đánh đổi không gian–thời gian" thành "luôn được cái này bằng cách mất cái kia": đôi khi thuật toán tốt hơn được cả hai, và thiết kế tồi mất cả hai.</p>
<p>🧭 <strong>Trên server thật:</strong> "đo trước khi tối ưu" là quy tắc đầu tiên của mọi buổi phỏng vấn hiệu năng. Công cụ thật: <code>strace -c</code>/<code>perf</code> cho HĐH, trình lập kế hoạch truy vấn (<code>EXPLAIN ANALYZE</code> của PostgreSQL) cho cơ sở dữ liệu, Spring Boot Actuator và profiler cho JVM, <code>clinic.js</code> hay <code>--cpu-prof</code> cho Node. Một phát hiện kinh điển: endpoint tưởng chậm vì "JSON nặng" thật ra chậm vì gọi cơ sở dữ liệu 400 lần — vấn đề <em>N+1</em> chỉ thấy khi có số đo.</p>`],
      [11, 'Space-Time Trade-offs (2)',
        `<p class="y-chinh">🎯 Figure 12-7(b) and (c): two faster versions. (b) A <strong>macro</strong> that adds the eight bits with no loop — <code>(b&amp;1) + ((b&gt;&gt;1)&amp;1) + … + ((b&gt;&gt;7)&amp;1)</code> — and is expanded in place (no call, no loop counter). (c) A <strong>table lookup</strong>: <code>char bits[256] = {0, 1, 1, 2, 1, 2, 2, 3, …}</code> and <code>#define bit_count(b) (int) bits[b]</code> — the answer for every possible byte is computed in advance and the work per call becomes one memory read.</p>
<p>A <strong>macro</strong> (text the preprocessor pastes into the code before compiling) removes the <em>function call</em> and the loop control, at the price of longer code. The <strong>lookup table</strong> removes the <em>computation</em> entirely, at the price of 256 bytes of memory and the cost of building it once. This is the cleanest possible space–time trade-off: <em>precompute</em> every answer you will ever need, store them, then look them up. It works when the input space is small (a byte has only 256 values) and the same questions come up again and again. The book's point is the principle — "when speed matters, consider trading memory for time" — not this particular function.</p>
<p>➕ All three versions on the same machine, 20 million calls each, with a check that they agree for every byte value (a program that computes both the result and the time):</p>
<pre><code class="language-c">// Figure 12-7 of the book: three ways to count the 1-bits of a byte
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;

#define BYTE_SIZE 8
int bit_count(int byte) {             // (a) loop: 8 iterations per call
    int i, count = 0;
    for (i = 0; i &lt; BYTE_SIZE; i++)
        if ((byte &gt;&gt; i) &amp; 1) count++;
    return count;
}
#define BIT_COUNT_MACRO(b) (((b)&amp;1) + (((b)&gt;&gt;1)&amp;1) + (((b)&gt;&gt;2)&amp;1) + (((b)&gt;&gt;3)&amp;1) + \\
                            (((b)&gt;&gt;4)&amp;1) + (((b)&gt;&gt;5)&amp;1) + (((b)&gt;&gt;6)&amp;1) + (((b)&gt;&gt;7)&amp;1))   // (b) macro: no loop
static unsigned char bits[256];       // (c) lookup table: 256 bytes of memory
#define BIT_COUNT_TABLE(b) ((int) bits[(b)])
static void build_table(void) {       // built ONCE, at start-up
    for (int i = 0; i &lt; 256; i++) bits[i] = bit_count(i);
}

static double now(void) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t);
    return t.tv_sec + t.tv_nsec / 1e9;
}

int main(void) {
    build_table();
    int same = 1;
    for (int b = 0; b &lt; 256; b++)
        if (bit_count(b) != BIT_COUNT_MACRO(b) || bit_count(b) != BIT_COUNT_TABLE(b) || bit_count(b) != __builtin_popcount(b)) same = 0;
    printf("loop == macro == table == builtin: %s\\n", same ? "yes" : "NO");
    printf("table size: %zu bytes\\n", sizeof bits);

    enum { N = 20000000 };
    volatile long sink = 0;     // volatile: keeps the compiler from deleting the loops
    double t0 = now(); long s = 0;
    for (int i = 0; i &lt; N; i++) s += bit_count(i &amp; 255);
    double t_loop = now() - t0; sink = s;
    t0 = now(); s = 0;
    for (int i = 0; i &lt; N; i++) s += BIT_COUNT_MACRO(i &amp; 255);
    double t_macro = now() - t0; sink = s;
    t0 = now(); s = 0;
    for (int i = 0; i &lt; N; i++) s += BIT_COUNT_TABLE(i &amp; 255);
    double t_table = now() - t0; sink = s;
    (void) sink;
    printf("%d calls each (gcc -O0, no optimisation)\\n", N);
    printf("loop  : %7.1f ms\\n", t_loop * 1000);
    printf("macro : %7.1f ms\\n", t_macro * 1000);
    printf("table : %7.1f ms\\n", t_table * 1000);
    printf("table is faster than loop: %d\\n", t_table &lt; t_loop);
    printf("speed-up loop/table: %.1fx\\n", t_loop / t_table);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dem-bit.c -o dem-bit &amp;&amp; ./dem-bit<br>
loop == macro == table == builtin: yes<br>
table size: 256 bytes<br>
20000000 calls each (gcc -O0, no optimisation)<br>
loop &nbsp;: &nbsp;&nbsp;180.8 ms<br>
macro : &nbsp;&nbsp;&nbsp;65.5 ms<br>
table : &nbsp;&nbsp;&nbsp;74.4 ms<br>
table is faster than loop: 1<br>
speed-up loop/table: 2.4x</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The loop is by far the slowest (about 2–3 times). But look at the surprise in the run: the <strong>macro is as fast as the table</strong> (65 ms against 74 ms here) — and not slower. Eight shifts and masks in registers are as cheap as one trip to memory. A table pays a hidden cost: its 256 bytes must stay in the CPU cache (a tiny table does; a 64 KB table for 16-bit values competes with your real data for the cache and can be <em>slower</em> than computing). This is what "measure, do not guess" means. Also note the compile level: <code>gcc -O0</code> means no optimisation; with <code>-O2</code> the compiler can unroll the loop, and with the right target a modern CPU has a single instruction that counts bits (<code>POPCNT</code> on x86 since around 2008, <code>CNT</code> on ARM) which beats all three — the best trade-off is sometimes to use what the hardware already offers (<code>__builtin_popcount</code>, <code>Integer.bitCount</code> in Java — the check in the program compared against it).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/76e766aef710a6996e716337d00f18a34a0bbb27.svg" alt="Basic operations per call, counted by the simulator: loop vs macro vs table, and when the table pays back its cost of construction" loading="lazy" /><p class="chu-thich">🧮 Basic operations per call, counted by the simulator: loop vs macro vs table, and when the table pays back its cost of construction</p></div>
<table><thead><tr><th>Version</th><th>operations per call</th><th>extra memory</th></tr></thead><tbody><tr><td>(a)</td><td>38</td><td>0</td></tr><tr><td>(b)</td><td>23</td><td>0 (longer code)</td></tr><tr><td>(c)</td><td>1</td><td>256 bytes</td></tr></tbody></table>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/** Mỗi hàm trả [kết quả, số phép toán cơ bản đã thực hiện]; phép toán = một lần so sánh, dịch, AND, cộng, tăng, nạp bộ nhớ. */
function demVongLap(b) {
  let ops = 0, count = 0;
  ops++;                                                    // i = 0
  for (let i = 0; ; i++) {
    ops++; if (!(i &lt; 8)) break;                             // so sánh i &lt; 8
    ops += 2; if ((b &gt;&gt; i) &amp; 1) { count++; ops++; }         // dịch + AND (+ cộng nếu là bit 1)
    ops++;                                                  // i++
  }
  return [count, ops];
}
function demMacro(b) {                                      // 8 lần (dịch + AND) + 7 phép cộng, không vòng lặp
  let s = 0; for (let i = 0; i &lt; 8; i++) s += (b &gt;&gt; i) &amp; 1;
  return [s, 8 * 2 + 7];
}
const BANG = Array.from({ length: 256 }, (_, i) =&gt; demVongLap(i)[0]);
function demBang(b) { return [BANG[b], 1]; }                // một lần nạp bộ nhớ
const TB = (f) =&gt; { let t = 0; for (let b = 0; b &lt; 256; b++) t += f(b)[1]; return t / 256; };
export function demBit() {
  const loop = TB(demVongLap), macro = TB(demMacro), bang = TB(demBang);
  let xayBang = 0; for (let b = 0; b &lt; 256; b++) xayBang += demVongLap(b)[1];   // dựng bảng = 256 lần chạy vòng lặp
  const tietKiem = loop - bang;
  return { loop, macro, bang, xayBang, hoaVon: Math.ceil(xayBang / tietKiem) };
}
/** Hình 12-8: n điểm ảnh, paletteSize màu; bitChiSo = số bit mỗi chỉ số. */
export function nen(n, paletteSize, bitChiSo = 8) {
  const tho = n * 24, nen = n * bitChiSo + paletteSize * 24;
  return { tho, nen, hoaVon: Math.floor((paletteSize * 24) / (24 - bitChiSo)) + 1 };   // N nhỏ nhất để nen &lt; tho
}</code></pre></details>
<p>The simulation counts basic operations rather than nanoseconds, which makes it exact and repeatable: the loop costs 38 operations per call on average, the macro 23, the table 1; building the table costs 9,728 operations once (256 runs of the loop), so it pays for itself after 263 calls. (Operation counts are a cost <em>model</em>: the real clock gave the loop 2–3 times the macro's time, the model 1.65 times — the model gets the order right, and measurement gets the size.) After that the table wins forever — for a program that counts bits twice, a loop is the better choice.</p>
<p class="pitfall">⚠️ Common wrong answers: "the table is always the fastest" (measured above: not against a macro) and "a macro is a function" (it is text substitution — evaluated arguments can be evaluated twice: <code>bit_count(x++)</code> breaks the macro version; a table lookup macro <code>bits[x++]</code> evaluates once but is still dangerous in other macros). For the exam: remember that (b) and (c) trade <em>code size or memory</em> for <em>time</em>.</p>
<p>🧭 <strong>On a real server:</strong> precomputing is everywhere: a lookup table for country codes instead of calling a service; a <strong>materialised view</strong> or summary table in PostgreSQL (store the daily totals instead of summing a billion rows each time); a <strong>CDN</strong> that stores pages in advance; an index (a table of positions built once so lookups are fast, paid with disk space and slower writes). Each has the same bill: memory/disk now, and the duty to keep the stored answers <em>correct</em> when the data changes (slide 14). The memoisation of the next slides is the same idea created lazily, on first use.</p>`,
        `<p class="y-chinh">🎯 Hình 12-7(b) và (c): hai phiên bản nhanh hơn. (b) Một <strong>macro</strong> cộng tám bit không cần vòng lặp — <code>(b&amp;1) + ((b&gt;&gt;1)&amp;1) + … + ((b&gt;&gt;7)&amp;1)</code> — và được khai triển ngay tại chỗ (không gọi hàm, không biến đếm vòng). (c) <strong>Tra bảng (table lookup)</strong>: <code>char bits[256] = {0, 1, 1, 2, 1, 2, 2, 3, …}</code> và <code>#define bit_count(b) (int) bits[b]</code> — đáp án cho mọi byte có thể được tính sẵn và việc cho mỗi lần gọi thành một lần đọc bộ nhớ.</p>
<p><strong>Macro</strong> — văn bản mà bộ tiền xử lý dán vào mã trước khi biên dịch — bỏ <em>lời gọi hàm</em> và điều khiển vòng lặp, với giá mã dài hơn. <strong>Bảng tra</strong> bỏ hẳn <em>phép tính</em>, với giá 256 byte bộ nhớ và chi phí dựng nó một lần. Đây là đánh đổi không gian–thời gian sạch nhất có thể: <em>tính sẵn</em> mọi đáp án bạn sẽ cần, cất chúng, rồi tra. Nó hiệu quả khi không gian đầu vào nhỏ (một byte chỉ có 256 giá trị) và cùng những câu hỏi lặp đi lặp lại. Điểm của sách là nguyên lý — "khi tốc độ quan trọng, hãy cân nhắc đổi bộ nhớ lấy thời gian" — chứ không phải hàm cụ thể này.</p>
<p>➕ Cả ba phiên bản trên cùng một máy, mỗi bản 20 triệu lần gọi, kèm phép kiểm chúng khớp nhau với mọi giá trị byte (chương trình tính cả kết quả lẫn thời gian):</p>
<pre><code class="language-c">// Hình 12-7 của sách: ba cách đếm bit 1 trong một byte
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;

#define BYTE_SIZE 8
int bit_count(int byte) {             // (a) vòng lặp: 8 vòng cho mỗi lần gọi
    int i, count = 0;
    for (i = 0; i &lt; BYTE_SIZE; i++)
        if ((byte &gt;&gt; i) &amp; 1) count++;
    return count;
}
#define BIT_COUNT_MACRO(b) (((b)&amp;1) + (((b)&gt;&gt;1)&amp;1) + (((b)&gt;&gt;2)&amp;1) + (((b)&gt;&gt;3)&amp;1) + \\
                            (((b)&gt;&gt;4)&amp;1) + (((b)&gt;&gt;5)&amp;1) + (((b)&gt;&gt;6)&amp;1) + (((b)&gt;&gt;7)&amp;1))   // (b) macro: không vòng lặp
static unsigned char bits[256];       // (c) bảng tra: 256 byte bộ nhớ
#define BIT_COUNT_TABLE(b) ((int) bits[(b)])
static void build_table(void) {       // dựng MỘT lần, lúc khởi động
    for (int i = 0; i &lt; 256; i++) bits[i] = bit_count(i);
}

static double now(void) {
    struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t);
    return t.tv_sec + t.tv_nsec / 1e9;
}

int main(void) {
    build_table();
    int same = 1;
    for (int b = 0; b &lt; 256; b++)
        if (bit_count(b) != BIT_COUNT_MACRO(b) || bit_count(b) != BIT_COUNT_TABLE(b) || bit_count(b) != __builtin_popcount(b)) same = 0;
    printf("loop == macro == table == builtin: %s\\n", same ? "yes" : "NO");
    printf("table size: %zu bytes\\n", sizeof bits);

    enum { N = 20000000 };
    volatile long sink = 0;     // volatile: không cho trình biên dịch xoá vòng đo
    double t0 = now(); long s = 0;
    for (int i = 0; i &lt; N; i++) s += bit_count(i &amp; 255);
    double t_loop = now() - t0; sink = s;
    t0 = now(); s = 0;
    for (int i = 0; i &lt; N; i++) s += BIT_COUNT_MACRO(i &amp; 255);
    double t_macro = now() - t0; sink = s;
    t0 = now(); s = 0;
    for (int i = 0; i &lt; N; i++) s += BIT_COUNT_TABLE(i &amp; 255);
    double t_table = now() - t0; sink = s;
    (void) sink;
    printf("%d calls each (gcc -O0, no optimisation)\\n", N);
    printf("loop  : %7.1f ms\\n", t_loop * 1000);
    printf("macro : %7.1f ms\\n", t_macro * 1000);
    printf("table : %7.1f ms\\n", t_table * 1000);
    printf("table is faster than loop: %d\\n", t_table &lt; t_loop);
    printf("speed-up loop/table: %.1fx\\n", t_loop / t_table);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread dem-bit.c -o dem-bit &amp;&amp; ./dem-bit<br>
loop == macro == table == builtin: yes<br>
table size: 256 bytes<br>
20000000 calls each (gcc -O0, no optimisation)<br>
loop &nbsp;: &nbsp;&nbsp;180.8 ms<br>
macro : &nbsp;&nbsp;&nbsp;65.5 ms<br>
table : &nbsp;&nbsp;&nbsp;74.4 ms<br>
table is faster than loop: 1<br>
speed-up loop/table: 2.4x</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Vòng lặp chậm nhất hẳn (chừng 2–3 lần). Nhưng hãy nhìn bất ngờ trong lần chạy: <strong>macro nhanh ngang bảng tra</strong> (65 ms so với 74 ms ở đây) — không chậm hơn. Tám phép dịch và che trong thanh ghi rẻ ngang một chuyến ra bộ nhớ. Bảng tra trả một chi phí ngầm: 256 byte của nó phải ở lại trong cache CPU (bảng nhỏ thì được; bảng 64 KB cho giá trị 16 bit tranh cache với dữ liệu thật của bạn và có thể <em>chậm hơn</em> tính toán). Đó là điều "hãy đo, đừng đoán" muốn nói. Cũng để ý mức biên dịch: <code>gcc -O0</code> là không tối ưu; với <code>-O2</code> trình biên dịch có thể trải vòng lặp, và với đích phù hợp CPU hiện đại có một lệnh đếm bit (<code>POPCNT</code> trên x86 từ khoảng 2008, <code>CNT</code> trên ARM) thắng cả ba — đánh đổi tốt nhất đôi khi là dùng thứ phần cứng đã có (<code>__builtin_popcount</code>, <code>Integer.bitCount</code> trong Java — phép kiểm trong chương trình đã so với nó).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b66da9b6b4013c5c55b11381fdc75bd08889bb5d.svg" alt="Số phép toán cơ bản mỗi lần gọi do bộ mô phỏng đếm: vòng lặp, macro, bảng tra, và khi nào bảng tra hoàn vốn chi phí dựng" loading="lazy" /><p class="chu-thich">🧮 Số phép toán cơ bản mỗi lần gọi do bộ mô phỏng đếm: vòng lặp, macro, bảng tra, và khi nào bảng tra hoàn vốn chi phí dựng</p></div>
<table><thead><tr><th>Phiên bản</th><th>phép toán mỗi lần gọi</th><th>bộ nhớ thêm</th></tr></thead><tbody><tr><td>(a)</td><td>38</td><td>0</td></tr><tr><td>(b)</td><td>23</td><td>0 (mã dài hơn)</td></tr><tr><td>(c)</td><td>1</td><td>256 byte</td></tr></tbody></table>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/** Mỗi hàm trả [kết quả, số phép toán cơ bản đã thực hiện]; phép toán = một lần so sánh, dịch, AND, cộng, tăng, nạp bộ nhớ. */
function demVongLap(b) {
  let ops = 0, count = 0;
  ops++;                                                    // i = 0
  for (let i = 0; ; i++) {
    ops++; if (!(i &lt; 8)) break;                             // so sánh i &lt; 8
    ops += 2; if ((b &gt;&gt; i) &amp; 1) { count++; ops++; }         // dịch + AND (+ cộng nếu là bit 1)
    ops++;                                                  // i++
  }
  return [count, ops];
}
function demMacro(b) {                                      // 8 lần (dịch + AND) + 7 phép cộng, không vòng lặp
  let s = 0; for (let i = 0; i &lt; 8; i++) s += (b &gt;&gt; i) &amp; 1;
  return [s, 8 * 2 + 7];
}
const BANG = Array.from({ length: 256 }, (_, i) =&gt; demVongLap(i)[0]);
function demBang(b) { return [BANG[b], 1]; }                // một lần nạp bộ nhớ
const TB = (f) =&gt; { let t = 0; for (let b = 0; b &lt; 256; b++) t += f(b)[1]; return t / 256; };
export function demBit() {
  const loop = TB(demVongLap), macro = TB(demMacro), bang = TB(demBang);
  let xayBang = 0; for (let b = 0; b &lt; 256; b++) xayBang += demVongLap(b)[1];   // dựng bảng = 256 lần chạy vòng lặp
  const tietKiem = loop - bang;
  return { loop, macro, bang, xayBang, hoaVon: Math.ceil(xayBang / tietKiem) };
}
/** Hình 12-8: n điểm ảnh, paletteSize màu; bitChiSo = số bit mỗi chỉ số. */
export function nen(n, paletteSize, bitChiSo = 8) {
  const tho = n * 24, nen = n * bitChiSo + paletteSize * 24;
  return { tho, nen, hoaVon: Math.floor((paletteSize * 24) / (24 - bitChiSo)) + 1 };   // N nhỏ nhất để nen &lt; tho
}</code></pre></details>
<p>Mô phỏng đếm phép toán cơ bản chứ không đếm nano-giây, nên chính xác và lặp lại được: vòng lặp tốn 38 phép toán mỗi lần gọi (trung bình), macro 23, bảng tra 1; dựng bảng tốn 9.728 phép toán một lần (256 lần chạy vòng lặp), nên nó tự hoàn vốn sau 263 lần gọi. (Số phép toán là <em>mô hình</em> chi phí: đồng hồ thật cho vòng lặp gấp 2–3 lần thời gian của macro, mô hình cho 1,65 lần — mô hình đúng thứ tự, phép đo mới đúng độ lớn.) Từ đó bảng thắng mãi mãi — với chương trình chỉ đếm bit hai lần thì vòng lặp là lựa chọn tốt hơn.</p>
<p class="pitfall">⚠️ Đáp án sai thường gặp: "bảng tra luôn nhanh nhất" (đo ở trên: không với macro) và "macro là một hàm" (nó là thay thế văn bản — đối số có thể bị tính hai lần: <code>bit_count(x++)</code> làm hỏng bản macro; macro tra bảng <code>bits[x++]</code> chỉ tính một lần nhưng vẫn nguy hiểm trong macro khác). Cho kỳ thi: nhớ rằng (b) và (c) đổi <em>cỡ mã hoặc bộ nhớ</em> lấy <em>thời gian</em>.</p>
<p>🧭 <strong>Trên server thật:</strong> tính sẵn có ở khắp nơi: bảng tra mã quốc gia thay vì gọi dịch vụ; <strong>materialized view</strong> hay bảng tổng hợp trong PostgreSQL (lưu tổng theo ngày thay vì cộng một tỉ dòng mỗi lần); <strong>CDN</strong> lưu sẵn trang; chỉ mục (bảng vị trí dựng một lần để tra nhanh, trả bằng dung lượng đĩa và ghi chậm hơn). Mỗi thứ có cùng hoá đơn: bộ nhớ/đĩa ngay bây giờ, và bổn phận giữ các đáp án đã lưu <em>đúng</em> khi dữ liệu đổi (slide 14). Memoization ở các slide sau là cùng ý tưởng được tạo lười, khi dùng lần đầu.</p>`],
      [12, 'Space-Time Trade-offs (3)',
        `<p class="y-chinh">🎯 Figure 12-8: the trade-off in the other direction — <strong>spend time to save space</strong>. (a) A piece of an uncompressed image: every pixel stored as 24 bits (three colours × 8 bits). (b) The same piece stored with a <strong>colour palette</strong> (as in GIF): each pixel is an index of 8 bits. (c) The palette: a table of 12 colours with their 24-bit values. To draw a pixel you look the colour up in the palette — one extra step — and the picture takes far less room.</p>
<p>So far we traded memory for speed. Compression does the opposite: it spends CPU time (look up the palette, decode) to save memory, disk space or network bandwidth. The palette idea is valid when an image uses few distinct colours: store each colour once (24 bits) and refer to it by a short number (8 bits in GIF, which allows at most 256 colours). The saving grows with the image size, but there is a <strong>break-even point</strong>: the palette itself costs space. Tanenbaum's figure shows a piece of a larger image; with the numbers of the figure it is easy to be fooled.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/72f6655c6f455548c87a460dd7a670113ee4ad16.svg" alt="The sixteen pixels of Figure 12-8 in bits: raw, palette with 8-bit indices, palette with 4-bit indices" loading="lazy" /><p class="chu-thich">🧮 The sixteen pixels of Figure 12-8 in bits: raw, palette with 8-bit indices, palette with 4-bit indices</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">/** Mỗi hàm trả [kết quả, số phép toán cơ bản đã thực hiện]; phép toán = một lần so sánh, dịch, AND, cộng, tăng, nạp bộ nhớ. */
function demVongLap(b) {
  let ops = 0, count = 0;
  ops++;                                                    // i = 0
  for (let i = 0; ; i++) {
    ops++; if (!(i &lt; 8)) break;                             // so sánh i &lt; 8
    ops += 2; if ((b &gt;&gt; i) &amp; 1) { count++; ops++; }         // dịch + AND (+ cộng nếu là bit 1)
    ops++;                                                  // i++
  }
  return [count, ops];
}
function demMacro(b) {                                      // 8 lần (dịch + AND) + 7 phép cộng, không vòng lặp
  let s = 0; for (let i = 0; i &lt; 8; i++) s += (b &gt;&gt; i) &amp; 1;
  return [s, 8 * 2 + 7];
}
const BANG = Array.from({ length: 256 }, (_, i) =&gt; demVongLap(i)[0]);
function demBang(b) { return [BANG[b], 1]; }                // một lần nạp bộ nhớ
const TB = (f) =&gt; { let t = 0; for (let b = 0; b &lt; 256; b++) t += f(b)[1]; return t / 256; };
export function demBit() {
  const loop = TB(demVongLap), macro = TB(demMacro), bang = TB(demBang);
  let xayBang = 0; for (let b = 0; b &lt; 256; b++) xayBang += demVongLap(b)[1];   // dựng bảng = 256 lần chạy vòng lặp
  const tietKiem = loop - bang;
  return { loop, macro, bang, xayBang, hoaVon: Math.ceil(xayBang / tietKiem) };
}
/** Hình 12-8: n điểm ảnh, paletteSize màu; bitChiSo = số bit mỗi chỉ số. */
export function nen(n, paletteSize, bitChiSo = 8) {
  const tho = n * 24, nen = n * bitChiSo + paletteSize * 24;
  return { tho, nen, hoaVon: Math.floor((paletteSize * 24) / (24 - bitChiSo)) + 1 };   // N nhỏ nhất để nen &lt; tho
}</code></pre></details>
<p>Count it: 16 pixels × 24 bits = <strong>384 bits</strong> raw. With a 12-colour palette: 12 × 24 = 288 bits of palette plus 16 × 8 = 128 bits of indices = <strong>416 bits — more than the original</strong>. With only as many index bits as 12 colours need (4 bits) it is 352 bits, a small win. A real image has thousands of pixels: for 1,000,000 pixels and a 256-colour palette the total is 8,006,144 bits, one third of the raw 24,000,000. The lesson is not in the figure's arithmetic but in the shape: <em>fixed cost plus a smaller per-item cost</em> pays back only after enough items. The break-even for 8-bit indices is 19 pixels in this example (a palette of 12 colours costs 288 bits; each pixel saves 16 bits).</p>
<p>➕ The same on text. A hundred thousand repetitive JSON lines, compressed with <code>gzip</code> at two settings, and random bytes, which have no pattern to exploit:</p>
<div class="out"># Figure 12-8's idea on a real file: spend CPU time to save space (and network bytes)<br>
# 100000 repetitive JSON lines (a typical API log or response body)<br>
$ yes '{"id":1,"status":"ok","message":"hello world"}' | head -n 100000 &gt; data.json<br>
$ wc -c &lt; data.json<br>
4700000<br>
$ gzip -1 -c data.json | wc -c<br>
31983<br>
$ gzip -9 -c data.json | wc -c<br>
13757<br>
# random bytes have no pattern: nothing to save<br>
$ head -c 100000 /dev/urandom &gt; rnd.bin<br>
$ [ "$(gzip -9 -c rnd.bin | wc -c)" -gt 100000 ] &amp;&amp; echo "random data: the gzip output is LARGER than the input"<br>
random data: the gzip output is LARGER than the input</div>
<p>4,700,000 bytes shrink to 31,983 with <code>gzip -1</code> (fast, 0.7%) and 13,757 with <code>gzip -9</code> (slow, 0.3%): a higher level spends more CPU time to save <em>more</em> space — a dial, not an on/off switch. On random data the output is <em>larger</em> than the input: you cannot compress what has no redundancy, and the container header costs a few bytes. (The numbers are exact for this input and this gzip version.)</p>
<p class="pitfall">⚠️ Two traps. First, "compression always saves space" — false for tiny or already-compressed data (JPEG, MP4, encrypted files: gzip them and they grow). Second, GIF's lookup is <em>lossless</em> only when the image really has ≤ 256 colours; converting a photograph to a palette is <em>lossy</em>. Exam questions that give pixel counts and colour counts ("how many bits with a palette?") are plain arithmetic: indices plus palette.</p>
<p>🧭 <strong>On a real server:</strong> HTTP compression (<code>Content-Encoding: gzip</code> or <code>br</code> for Brotli) is this trade-off made on every request: CPU on the server and the browser against bytes on the network. Turn it on for text (HTML, JSON, JavaScript); do not waste CPU compressing images or videos that are already compressed. The same dial exists in PostgreSQL (TOAST compression of big values), in Kafka (producer compression), in backups (<code>pg_dump | gzip</code> — level 1 for speed, level 9 for archives) and in log shipping. Interview: "your API returns 2 MB of JSON to mobile users; what do you do?" — pagination first, compression second.</p>`,
        `<p class="y-chinh">🎯 Hình 12-8: đánh đổi theo chiều ngược lại — <strong>tốn thời gian để tiết kiệm không gian</strong>. (a) Một mảnh ảnh không nén: mỗi điểm ảnh lưu 24 bit (ba màu × 8 bit). (b) Cùng mảnh ấy lưu bằng <strong>bảng màu (colour palette)</strong> (như GIF): mỗi điểm ảnh là một chỉ số 8 bit. (c) Bảng màu: bảng 12 màu cùng giá trị 24 bit của chúng. Để vẽ một điểm ảnh bạn tra màu trong bảng màu — thêm một bước — và bức ảnh chiếm ít chỗ hơn nhiều.</p>
<p>Từ đầu tới giờ ta đổi bộ nhớ lấy tốc độ. Nén làm ngược lại: nó tốn thời gian CPU (tra bảng màu, giải mã) để tiết kiệm bộ nhớ, dung lượng đĩa hay băng thông mạng. Ý tưởng bảng màu đúng khi ảnh dùng ít màu khác nhau: lưu mỗi màu một lần (24 bit) và tham chiếu bằng số ngắn (8 bit trong GIF, cho tối đa 256 màu). Mức tiết kiệm tăng theo cỡ ảnh, nhưng có <strong>điểm hoà vốn (break-even point)</strong>: chính bảng màu cũng tốn chỗ. Hình của Tanenbaum cho một mảnh của ảnh lớn hơn; với các số trong hình rất dễ bị lừa.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/c110035604749601c8a012d9d9f22bcd2cd39228.svg" alt="Mười sáu điểm ảnh của Hình 12-8 tính bằng bit: thô, bảng màu với chỉ số 8 bit, bảng màu với chỉ số 4 bit" loading="lazy" /><p class="chu-thich">🧮 Mười sáu điểm ảnh của Hình 12-8 tính bằng bit: thô, bảng màu với chỉ số 8 bit, bảng màu với chỉ số 4 bit</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">/** Mỗi hàm trả [kết quả, số phép toán cơ bản đã thực hiện]; phép toán = một lần so sánh, dịch, AND, cộng, tăng, nạp bộ nhớ. */
function demVongLap(b) {
  let ops = 0, count = 0;
  ops++;                                                    // i = 0
  for (let i = 0; ; i++) {
    ops++; if (!(i &lt; 8)) break;                             // so sánh i &lt; 8
    ops += 2; if ((b &gt;&gt; i) &amp; 1) { count++; ops++; }         // dịch + AND (+ cộng nếu là bit 1)
    ops++;                                                  // i++
  }
  return [count, ops];
}
function demMacro(b) {                                      // 8 lần (dịch + AND) + 7 phép cộng, không vòng lặp
  let s = 0; for (let i = 0; i &lt; 8; i++) s += (b &gt;&gt; i) &amp; 1;
  return [s, 8 * 2 + 7];
}
const BANG = Array.from({ length: 256 }, (_, i) =&gt; demVongLap(i)[0]);
function demBang(b) { return [BANG[b], 1]; }                // một lần nạp bộ nhớ
const TB = (f) =&gt; { let t = 0; for (let b = 0; b &lt; 256; b++) t += f(b)[1]; return t / 256; };
export function demBit() {
  const loop = TB(demVongLap), macro = TB(demMacro), bang = TB(demBang);
  let xayBang = 0; for (let b = 0; b &lt; 256; b++) xayBang += demVongLap(b)[1];   // dựng bảng = 256 lần chạy vòng lặp
  const tietKiem = loop - bang;
  return { loop, macro, bang, xayBang, hoaVon: Math.ceil(xayBang / tietKiem) };
}
/** Hình 12-8: n điểm ảnh, paletteSize màu; bitChiSo = số bit mỗi chỉ số. */
export function nen(n, paletteSize, bitChiSo = 8) {
  const tho = n * 24, nen = n * bitChiSo + paletteSize * 24;
  return { tho, nen, hoaVon: Math.floor((paletteSize * 24) / (24 - bitChiSo)) + 1 };   // N nhỏ nhất để nen &lt; tho
}</code></pre></details>
<p>Hãy đếm: 16 điểm ảnh × 24 bit = <strong>384 bit</strong> thô. Với bảng 12 màu: 12 × 24 = 288 bit bảng màu cộng 16 × 8 = 128 bit chỉ số = <strong>416 bit — nhiều hơn bản gốc</strong>. Chỉ dùng số bit chỉ số 12 màu cần (4 bit) thì là 352 bit, thắng nhẹ. Ảnh thật có hàng ngàn điểm: với 1.000.000 điểm và bảng 256 màu, tổng là 8.006.144 bit, một phần ba của 24.000.000 bit thô. Bài học không nằm ở số học của hình mà ở hình dạng: <em>chi phí cố định cộng chi phí trên mỗi phần tử nhỏ hơn</em> chỉ hoàn vốn sau đủ nhiều phần tử. Điểm hoà vốn với chỉ số 8 bit là 19 điểm ảnh trong ví dụ này (bảng 12 màu tốn 288 bit; mỗi điểm ảnh tiết kiệm 16 bit).</p>
<p>➕ Tương tự trên văn bản. Một trăm ngàn dòng JSON lặp lại, nén bằng <code>gzip</code> ở hai mức, và byte ngẫu nhiên không có quy luật nào để khai thác:</p>
<div class="out"># Ý của Hình 12-8 trên tệp thật: tốn thời gian CPU để tiết kiệm không gian (và byte mạng)<br>
# 100000 dòng JSON lặp lại (log hay thân phản hồi API điển hình)<br>
$ yes '{"id":1,"status":"ok","message":"hello world"}' | head -n 100000 &gt; data.json<br>
$ wc -c &lt; data.json<br>
4700000<br>
$ gzip -1 -c data.json | wc -c<br>
31983<br>
$ gzip -9 -c data.json | wc -c<br>
13757<br>
# byte ngẫu nhiên không có quy luật: không có gì để tiết kiệm<br>
$ head -c 100000 /dev/urandom &gt; rnd.bin<br>
$ [ "$(gzip -9 -c rnd.bin | wc -c)" -gt 100000 ] &amp;&amp; echo "random data: the gzip output is LARGER than the input"<br>
random data: the gzip output is LARGER than the input</div>
<p>4.700.000 byte co lại còn 31.983 với <code>gzip -1</code> (nhanh, 0,7%) và 13.757 với <code>gzip -9</code> (chậm, 0,3%): mức cao hơn tốn thêm thời gian CPU để tiết kiệm <em>nhiều hơn</em> — một cái núm vặn, không phải công tắc. Với dữ liệu ngẫu nhiên, đầu ra <em>lớn hơn</em> đầu vào: không nén được thứ không có dư thừa, và phần đầu tệp tốn vài byte. (Các số chính xác cho đầu vào này và phiên bản gzip này.)</p>
<p class="pitfall">⚠️ Hai cái bẫy. Một, "nén luôn tiết kiệm chỗ" — sai với dữ liệu bé xíu hay đã nén (JPEG, MP4, tệp mã hoá: gzip chúng sẽ phình ra). Hai, phép tra của GIF chỉ <em>không mất mát</em> khi ảnh thực sự có ≤ 256 màu; đổi ảnh chụp sang bảng màu là <em>có mất mát</em>. Câu đề cho số điểm ảnh và số màu ("bao nhiêu bit khi dùng bảng màu?") chỉ là số học thuần: chỉ số cộng bảng màu.</p>
<p>🧭 <strong>Trên server thật:</strong> nén HTTP (<code>Content-Encoding: gzip</code> hay <code>br</code> cho Brotli) là đánh đổi này thực hiện ở mỗi yêu cầu: CPU của server và trình duyệt đổi lấy byte trên mạng. Bật cho văn bản (HTML, JSON, JavaScript); đừng phí CPU nén ảnh hay video vốn đã nén. Cùng cái núm có ở PostgreSQL (nén TOAST cho giá trị lớn), ở Kafka (nén phía producer), ở sao lưu (<code>pg_dump | gzip</code> — mức 1 cho nhanh, mức 9 cho lưu trữ) và ở chuyển log. Phỏng vấn: "API trả 2 MB JSON cho người dùng di động; bạn làm gì?" — phân trang trước, nén sau.</p>`],
      [13, 'Caching (1)',
        `<p class="y-chinh">🎯 Looking up the file <code>/usr/ast/mbox</code> takes six disk accesses: (1) read the i-node of the root directory (i-node 1), (2) read the root directory (block 1), (3) read the i-node of <code>/usr</code> (i-node 6), (4) read the <code>/usr</code> directory (block 132), (5) read the i-node of <code>/usr/ast</code> (i-node 26), (6) read the <code>/usr/ast</code> directory (block 406). Only now is the i-node number of <code>mbox</code> known. The fix is a <strong>cache</strong>.</p>
<p>A <strong>cache</strong> (a small, fast store that keeps copies of recently or frequently used data from a bigger, slower store) is the most successful idea in computer design: CPU caches in front of RAM, the page cache in front of the disk, the browser cache in front of the network. It works because of <strong>locality</strong> — programs that used something just now are likely to use it again soon (temporal locality) or to use its neighbours (spatial locality). The slide's example shows why the file system needs one: a path walk costs two disk accesses (the directory's i-node and its block) per component, and disks (even SSDs) are thousands of times slower than RAM. Without caching, every <code>open("/usr/ast/mbox")</code> would pay the full price, even though the root directory is the same for everybody, every time.</p>
<p>➕ The slide's six steps, executed by a program on the book's toy disk (Figure 4-34). Each directory costs one i-node read plus one block read, and the cache stores <code>path → i-node number</code> (Figure 12-9 on the next slide):</p>
<pre><code class="language-javascript">// Slides 13-14: looking up /usr/ast/mbox, with and without an i-node cache
// the toy disk of the book's Figure 4-34 (i-node numbers and directory blocks)
const DIR = {   // directory i-node -&gt; { block, entries }
  1:  { block: 1,   entries: { usr: 6 } },
  6:  { block: 132, entries: { ast: 26, bal: 45 } },
  26: { block: 406, entries: { mbox: 60, books: 92 } },
};
let disk = 0;
const readInode = (n) =&gt; { disk++; return DIR[n] || { block: null, entries: {} }; };   // 1 disk access
const readDirBlock = (d) =&gt; { disk++; return d.entries; };                              // 1 disk access
const icache = new Map();                          // path -&gt; i-node number (Figure 12-9)
function lookup(pathName, useCache) {
  if (useCache &amp;&amp; icache.has(pathName)) return icache.get(pathName);     // hit: ZERO disk accesses
  let ino = 1, walked = '';
  for (const part of pathName.split('/').filter(Boolean)) {
    walked += '/' + part;
    if (useCache &amp;&amp; icache.has(walked)) { ino = icache.get(walked); continue; }   // a cached prefix saves reads
    const dir = readInode(ino);                    // read the i-node of the directory
    const entries = readDirBlock(dir);             // read the directory block
    ino = entries[part];
    if (useCache) icache.set(walked, ino);
  }
  return ino;
}
const count = (f) =&gt; { disk = 0; f(); return disk; };
console.log(&#96;no cache, every time: &#36;{count(() =&gt; lookup('/usr/ast/mbox', false))} disk reads&#96;);
console.log(&#96;first lookup: &#36;{count(() =&gt; lookup('/usr/ast/mbox', true))} disk reads  (i-node number found: &#36;{lookup('/usr/ast/mbox', true)})&#96;);
console.log(&#96;second lookup: &#36;{count(() =&gt; lookup('/usr/ast/mbox', true))} disk reads&#96;);
console.log(&#96;sibling /usr/ast/books: &#36;{count(() =&gt; lookup('/usr/ast/books', true))} disk reads  (the prefix /usr/ast was cached)&#96;);</code></pre>
<div class="out">$ node tra-duong-dan.js<br>
no cache, every time: 6 disk reads<br>
first lookup: 6 disk reads &nbsp;(i-node number found: 60)<br>
second lookup: 0 disk reads<br>
sibling /usr/ast/books: 2 disk reads &nbsp;(the prefix /usr/ast was cached)</div>
<p>Cold, the walk reads the disk six times (note: reading the i-node 60 of <code>mbox</code> itself is a seventh access, which the slide does not count). Asked again, it reads <strong>zero</strong> times. Asked for a <em>neighbour</em>, <code>/usr/ast/books</code>, it needs two reads — one i-node and one block, those of <code>/usr/ast</code> — because the cached prefix saved the first four reads but the last directory still has to be read to find <code>books</code>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/b932ec69ea60e125197810e1bd1dba76619c1e7e.svg" alt="Disk reads per lookup: the cold lookup, the repeated lookup, and a lookup of a neighbouring path" loading="lazy" /><p class="chu-thich">🧮 Disk reads per lookup: the cold lookup, the repeated lookup, and a lookup of a neighbouring path</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const T_DEM = 100, T_CHAM = 100000;               // ns: RAM (bộ đệm) · lưu trữ chậm (100 µs)
export const eat = (h, tDem = T_DEM, tCham = T_CHAM) =&gt; h * tDem + (1 - h) * tCham;
/** Tra đường dẫn trên đĩa đồ chơi của Hình 4-34; mỗi thư mục cần 2 lần đọc (i-node + khối). */
const DIR = { 1: { usr: 6 }, 6: { ast: 26, bal: 45 }, 26: { mbox: 60, books: 92 } };
export function tra(duong, icache) {
  let ino = 1, walked = '', doc = 0;
  for (const part of duong.split('/').filter(Boolean)) {
    walked += '/' + part;
    if (icache.has(walked)) { ino = icache.get(walked); continue; }
    doc += 2; ino = DIR[ino][part]; icache.set(walked, ino);
  }
  return { ino, doc };
}</code></pre></details>
<p>➕ How much does a cache save <em>on average</em>? Let <em>h</em> be the <strong>hit ratio</strong> (the fraction of requests found in the cache). Average access time = <em>h</em> × t<sub>cache</sub> + (1 − <em>h</em>) × t<sub>slow</sub>. With a 100 ns cache and a 100 µs slow store:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/befc35034f55055fd9052c7cf62d77515872a9b9.svg" alt="Average access time against hit ratio — a straight line: each point of hit ratio lost adds about 1 µs" loading="lazy" /><p class="chu-thich">🧮 Average access time against hit ratio — a straight line: each point of hit ratio lost adds about 1 µs</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const T_DEM = 100, T_CHAM = 100000;               // ns: RAM (bộ đệm) · lưu trữ chậm (100 µs)
export const eat = (h, tDem = T_DEM, tCham = T_CHAM) =&gt; h * tDem + (1 - h) * tCham;
/** Tra đường dẫn trên đĩa đồ chơi của Hình 4-34; mỗi thư mục cần 2 lần đọc (i-node + khối). */
const DIR = { 1: { usr: 6 }, 6: { ast: 26, bal: 45 }, 26: { mbox: 60, books: 92 } };
export function tra(duong, icache) {
  let ino = 1, walked = '', doc = 0;
  for (const part of duong.split('/').filter(Boolean)) {
    walked += '/' + part;
    if (icache.has(walked)) { ino = icache.get(walked); continue; }
    doc += 2; ino = DIR[ino][part]; icache.set(walked, ino);
  }
  return { ino, doc };
}</code></pre></details>
<p>At <em>h</em> = 0.9 the average is about 10,000 ns (100 ns × 0.9 + 100,000 ns × 0.1 ≈ 10,090 ns), at <em>h</em> = 0.99 it is about 1,100 ns, at 1.0 it is 100 ns. The slow store dominates even when it is rarely used: a 99% hit ratio is still ten times slower than a perfect one. That is why the last few percent of hit ratio are worth fighting for — and why the sizing of a cache is a design question, not a detail.</p>
<p class="pitfall">⚠️ Careful with average formulas in exams: some books add the cache time to the miss path (a miss first checks the cache: <em>h</em>·t<sub>c</sub> + (1−<em>h</em>)(t<sub>c</sub> + t<sub>slow</sub>)). Check which convention the question states. Another trap: the six accesses of the slide are the <em>cold</em> cost; a question asking "how many disk accesses for the second lookup with an i-node cache?" has answer 0.</p>
<p>🧭 <strong>On a real server:</strong> the Linux kernel already does this for you: the <strong>dentry cache</strong> (directory entries, name → i-node) and the <strong>page cache</strong> (file contents) are why the second <code>cat</code> of a file is instant and why "free memory" on a long-running server looks tiny — it is full of cache and the kernel gives it back when programs need memory. Your own stack adds more layers: the application cache (Redis, in-process Caffeine/<code>Map</code>), the database buffer cache (<code>shared_buffers</code> in PostgreSQL), the CDN, the browser. Interview: "walk me through every cache a request passes between the user and the disk".</p>`,
        `<p class="y-chinh">🎯 Tra tệp <code>/usr/ast/mbox</code> tốn sáu lần truy cập đĩa: (1) đọc i-node của thư mục gốc (i-node 1), (2) đọc thư mục gốc (khối 1), (3) đọc i-node của <code>/usr</code> (i-node 6), (4) đọc thư mục <code>/usr</code> (khối 132), (5) đọc i-node của <code>/usr/ast</code> (i-node 26), (6) đọc thư mục <code>/usr/ast</code> (khối 406). Tới lúc này mới biết số i-node của <code>mbox</code>. Cách chữa là một <strong>bộ đệm (cache)</strong>.</p>
<p><strong>Bộ đệm (cache)</strong> — kho nhỏ, nhanh giữ bản sao của dữ liệu vừa dùng hay hay dùng từ một kho lớn hơn, chậm hơn — là ý tưởng thành công nhất trong thiết kế máy tính: cache CPU trước RAM, bộ nhớ đệm trang (page cache) trước đĩa, cache trình duyệt trước mạng. Nó hiệu quả nhờ <strong>tính cục bộ (locality)</strong> — chương trình vừa dùng một thứ thì nhiều khả năng sắp dùng lại (cục bộ thời gian) hoặc dùng các thứ nằm cạnh nó (cục bộ không gian). Ví dụ của slide cho thấy vì sao hệ thống tệp cần một cái: đi theo đường dẫn tốn hai lần truy cập đĩa (i-node của thư mục và khối của nó) cho mỗi thành phần, mà đĩa (kể cả SSD) chậm hơn RAM hàng ngàn lần. Không có bộ đệm, mỗi <code>open("/usr/ast/mbox")</code> sẽ trả đủ giá, dù thư mục gốc giống nhau với mọi người, mọi lần.</p>
<p>➕ Sáu bước của slide, do chương trình chạy trên đĩa đồ chơi của sách (Hình 4-34). Mỗi thư mục tốn một lần đọc i-node cộng một lần đọc khối, và bộ đệm lưu <code>đường dẫn → số i-node</code> (Hình 12-9 ở slide sau):</p>
<pre><code class="language-javascript">// Slide 13-14: tra /usr/ast/mbox, có và không có bộ đệm i-node
// đĩa đồ chơi của Hình 4-34 trong sách
const DIR = {   // directory i-node -&gt; { block, entries }
  1:  { block: 1,   entries: { usr: 6 } },
  6:  { block: 132, entries: { ast: 26, bal: 45 } },
  26: { block: 406, entries: { mbox: 60, books: 92 } },
};
let disk = 0;
const readInode = (n) =&gt; { disk++; return DIR[n] || { block: null, entries: {} }; };   // 1 lần truy cập đĩa
const readDirBlock = (d) =&gt; { disk++; return d.entries; };                              // 1 lần truy cập đĩa
const icache = new Map();                          // đường dẫn -&gt; số i-node (Hình 12-9)
function lookup(pathName, useCache) {
  if (useCache &amp;&amp; icache.has(pathName)) return icache.get(pathName);     // trúng: KHÔNG lần đọc đĩa nào
  let ino = 1, walked = '';
  for (const part of pathName.split('/').filter(Boolean)) {
    walked += '/' + part;
    if (useCache &amp;&amp; icache.has(walked)) { ino = icache.get(walked); continue; }   // tiền tố có trong bộ đệm tiết kiệm lần đọc
    const dir = readInode(ino);                    // đọc i-node của thư mục
    const entries = readDirBlock(dir);             // đọc khối thư mục
    ino = entries[part];
    if (useCache) icache.set(walked, ino);
  }
  return ino;
}
const count = (f) =&gt; { disk = 0; f(); return disk; };
console.log(&#96;no cache, every time: &#36;{count(() =&gt; lookup('/usr/ast/mbox', false))} disk reads&#96;);
console.log(&#96;first lookup: &#36;{count(() =&gt; lookup('/usr/ast/mbox', true))} disk reads  (i-node number found: &#36;{lookup('/usr/ast/mbox', true)})&#96;);
console.log(&#96;second lookup: &#36;{count(() =&gt; lookup('/usr/ast/mbox', true))} disk reads&#96;);
console.log(&#96;sibling /usr/ast/books: &#36;{count(() =&gt; lookup('/usr/ast/books', true))} disk reads  (the prefix /usr/ast was cached)&#96;);</code></pre>
<div class="out">$ node tra-duong-dan.js<br>
no cache, every time: 6 disk reads<br>
first lookup: 6 disk reads &nbsp;(i-node number found: 60)<br>
second lookup: 0 disk reads<br>
sibling /usr/ast/books: 2 disk reads &nbsp;(the prefix /usr/ast was cached)</div>
<p>Nguội, phép đi đường đọc đĩa sáu lần (lưu ý: đọc chính i-node 60 của <code>mbox</code> là lần truy cập thứ bảy, slide không đếm). Hỏi lại, nó đọc <strong>không</strong> lần nào. Hỏi một <em>hàng xóm</em>, <code>/usr/ast/books</code>, nó cần hai lần đọc — một i-node và một khối, của <code>/usr/ast</code> — vì tiền tố trong bộ đệm tiết kiệm bốn lần đọc đầu nhưng thư mục cuối vẫn phải được đọc để tìm <code>books</code>.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f289531a84b9ec17451896958f8ac4449061c9fd.svg" alt="Số lần đọc đĩa mỗi lần tra: tra nguội, tra lặp lại, và tra một đường dẫn hàng xóm" loading="lazy" /><p class="chu-thich">🧮 Số lần đọc đĩa mỗi lần tra: tra nguội, tra lặp lại, và tra một đường dẫn hàng xóm</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const T_DEM = 100, T_CHAM = 100000;               // ns: RAM (bộ đệm) · lưu trữ chậm (100 µs)
export const eat = (h, tDem = T_DEM, tCham = T_CHAM) =&gt; h * tDem + (1 - h) * tCham;
/** Tra đường dẫn trên đĩa đồ chơi của Hình 4-34; mỗi thư mục cần 2 lần đọc (i-node + khối). */
const DIR = { 1: { usr: 6 }, 6: { ast: 26, bal: 45 }, 26: { mbox: 60, books: 92 } };
export function tra(duong, icache) {
  let ino = 1, walked = '', doc = 0;
  for (const part of duong.split('/').filter(Boolean)) {
    walked += '/' + part;
    if (icache.has(walked)) { ino = icache.get(walked); continue; }
    doc += 2; ino = DIR[ino][part]; icache.set(walked, ino);
  }
  return { ino, doc };
}</code></pre></details>
<p>➕ Bộ đệm tiết kiệm bao nhiêu <em>trung bình</em>? Gọi <em>h</em> là <strong>tỉ lệ trúng (hit ratio)</strong> — phần yêu cầu tìm thấy trong bộ đệm. Thời gian truy cập trung bình = <em>h</em> × t<sub>đệm</sub> + (1 − <em>h</em>) × t<sub>chậm</sub>. Với bộ đệm 100 ns và kho chậm 100 µs:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/edea6a4a60dfcab84c29ce0f0fcb37c4b1ac31d1.svg" alt="Thời gian truy cập trung bình theo tỉ lệ trúng — một đường thẳng: mỗi điểm phần trăm trúng bị mất thêm chừng 1 µs" loading="lazy" /><p class="chu-thich">🧮 Thời gian truy cập trung bình theo tỉ lệ trúng — một đường thẳng: mỗi điểm phần trăm trúng bị mất thêm chừng 1 µs</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const T_DEM = 100, T_CHAM = 100000;               // ns: RAM (bộ đệm) · lưu trữ chậm (100 µs)
export const eat = (h, tDem = T_DEM, tCham = T_CHAM) =&gt; h * tDem + (1 - h) * tCham;
/** Tra đường dẫn trên đĩa đồ chơi của Hình 4-34; mỗi thư mục cần 2 lần đọc (i-node + khối). */
const DIR = { 1: { usr: 6 }, 6: { ast: 26, bal: 45 }, 26: { mbox: 60, books: 92 } };
export function tra(duong, icache) {
  let ino = 1, walked = '', doc = 0;
  for (const part of duong.split('/').filter(Boolean)) {
    walked += '/' + part;
    if (icache.has(walked)) { ino = icache.get(walked); continue; }
    doc += 2; ino = DIR[ino][part]; icache.set(walked, ino);
  }
  return { ino, doc };
}</code></pre></details>
<p>Với <em>h</em> = 0,9 trung bình xấp xỉ 10.000 ns (100 ns × 0,9 + 100.000 ns × 0,1 ≈ 10.090 ns), với <em>h</em> = 0,99 là chừng 1.100 ns, với 1,0 là 100 ns. Kho chậm áp đảo ngay cả khi hiếm dùng: tỉ lệ trúng 99% vẫn chậm hơn mười lần so với hoàn hảo. Vì thế mấy phần trăm cuối của tỉ lệ trúng đáng giành giật — và vì thế định cỡ bộ đệm là câu hỏi thiết kế, không phải chi tiết.</p>
<p class="pitfall">⚠️ Cẩn thận với công thức trung bình trong đề: một số sách cộng thời gian bộ đệm vào đường trượt (trượt thì kiểm bộ đệm trước: <em>h</em>·t<sub>đ</sub> + (1−<em>h</em>)(t<sub>đ</sub> + t<sub>chậm</sub>)). Hãy kiểm đề nêu quy ước nào. Bẫy khác: sáu lần truy cập của slide là chi phí <em>nguội</em>; câu hỏi "tra lần thứ hai với bộ đệm i-node cần bao nhiêu lần truy cập đĩa?" có đáp án 0.</p>
<p>🧭 <strong>Trên server thật:</strong> nhân Linux đã làm việc này cho bạn: <strong>dentry cache</strong> (mục thư mục, tên → i-node) và <strong>page cache</strong> (nội dung tệp) là lý do lần <code>cat</code> thứ hai của một tệp tức thì và lý do "bộ nhớ trống" trên server chạy lâu trông rất nhỏ — nó đầy cache và nhân trả lại khi chương trình cần bộ nhớ. Stack của bạn thêm nhiều tầng nữa: cache ứng dụng (Redis, Caffeine/<code>Map</code> trong tiến trình), bộ đệm khối của cơ sở dữ liệu (<code>shared_buffers</code> của PostgreSQL), CDN, trình duyệt. Phỏng vấn: "kể mọi cache một yêu cầu đi qua giữa người dùng và đĩa".</p>`],
      [14, 'Caching (2)',
        `<p class="y-chinh">🎯 Figure 12-9: part of the <strong>i-node cache</strong> — a table of <em>path → i-node number</em>: <code>/usr → 6</code>, <code>/usr/ast → 26</code>, <code>/usr/ast/mbox → 60</code>, <code>/usr/ast/books → 92</code>, <code>/usr/bal → 45</code>, <code>/usr/bal/paper.ps → 85</code>. It is looked up first, and only on a miss does the system walk the directories (slide 13). The book adds the two hard questions of every cache: <strong>how big</strong> and <strong>what to throw out</strong>.</p>
<p>A cache is not free, and a <em>cache design</em> answers four questions. (1) <strong>What do I store?</strong> (here: the result of a whole lookup, not individual blocks — deciding the <em>unit</em> is a design choice). (2) <strong>How big?</strong> a cache as big as the data is the data. (3) <strong>What do I throw out when it is full?</strong> The usual policy is <strong>LRU</strong> (least recently used — evict the entry whose last use is oldest), a bet on locality; alternatives are FIFO, LFU (least frequently used) and random. (4) <strong>What if the original changes?</strong> This is the hard one: a cached copy can become <strong>stale</strong> (out of date), and a stale i-node cache entry that says "mbox is i-node 60" after the file was deleted would send a program to the wrong data. Real systems answer it with <strong>invalidation</strong> (remove the entry when the original changes), <strong>write-through</strong> (change the original and the cache together) or a <strong>time limit</strong> (TTL — trust a copy only for a while).</p>
<p>➕ Question 3 in Java 21: a real bounded cache. <code>LinkedHashMap</code> in access order plus <code>removeEldestEntry</code> is a complete LRU; 10 requests for i-node numbers with room for 3 entries:</p>
<pre><code class="language-java">// A real bounded cache in Java 21: LinkedHashMap in access order = LRU
import java.util.*;

public class LruCache {
    static class Lru&lt;K, V&gt; extends LinkedHashMap&lt;K, V&gt; {
        final int capacity;
        final List&lt;K&gt; evicted = new ArrayList&lt;&gt;();
        Lru(int capacity) { super(16, 0.75f, true); this.capacity = capacity; }   // true = access order
        @Override protected boolean removeEldestEntry(Map.Entry&lt;K, V&gt; eldest) {
            boolean full = size() &gt; capacity;
            if (full) evicted.add(eldest.getKey());   // the least recently used entry goes
            return full;
        }
    }
    static int diskReads = 0;
    static String readFromDisk(int inode) { diskReads++; return "inode-" + inode; }

    public static void main(String[] args) {
        Lru&lt;Integer, String&gt; cache = new Lru&lt;&gt;(3);
        int[] requests = {1, 2, 3, 1, 1, 2, 4, 1, 2, 2};   // i-node numbers asked for
        int hits = 0;
        for (int r : requests) {
            if (cache.get(r) != null) hits++;               // get() also marks r as recently used
            else cache.put(r, readFromDisk(r));
        }
        System.out.println("requests: " + requests.length + ", hits: " + hits + ", disk reads: " + diskReads);
        System.out.println("hit ratio: " + (double) hits / requests.length);
        System.out.println("evicted: " + cache.evicted);
        System.out.println("still cached (oldest first): " + cache.keySet());
    }
}</code></pre>
<div class="out">$ javac LruCache.java &amp;&amp; java LruCache<br>
requests: 10, hits: 6, disk reads: 4<br>
hit ratio: 0.6<br>
evicted: [3]<br>
still cached (oldest first): [4, 1, 2]</div>
<p>4 misses (disk reads) and 6 hits, so the hit ratio is 0.6; only i-node 3 was evicted, because when 4 arrived the least recently used entry was 3 (1 and 2 had been used since). Change the capacity or the request order and the numbers change — the policy, not luck, decides.</p>
<p>➕ Question 4, the price of a cache, with a fake clock so the output is the same every run. A cached answer is trusted for 3 ticks; at tick 2 someone else changes the original:</p>
<pre><code class="language-javascript">// The price of a cache: a copy can go STALE. Fake clock, so the run is the same every time
let clock = 0;                                           // our own clock (no Date)
const disk = new Map([['/usr/ast/mbox', 'inode 60: size 100']]);
let diskReads = 0;
const readDisk = (k) =&gt; { diskReads++; return disk.get(k); };

const TTL = 3;                                           // how long a copy is trusted
const cache = new Map();                                 // key -&gt; { value, expires }
function get(key) {
  const e = cache.get(key);
  if (e &amp;&amp; e.expires &gt; clock) return { value: e.value, from: 'cache' };       // hit
  const value = readDisk(key);                                                 // miss: go to the slow place
  cache.set(key, { value, expires: clock + TTL });
  return { value, from: 'disk' };
}
let stale = 0;
function show(label) {
  const r = get('/usr/ast/mbox');
  const fresh = disk.get('/usr/ast/mbox');
  const isStale = r.value !== fresh;
  if (isStale) stale++;
  console.log(&#96;t=&#36;{clock} &#36;{label.padEnd(22)} -&gt; &#36;{r.value.padEnd(20)} from &#36;{r.from.padEnd(5)} &#36;{isStale ? '  &lt;-- STALE' : ''}&#96;);
}
show('first read');
clock = 1; show('read again');
clock = 2; disk.set('/usr/ast/mbox', 'inode 60: size 250'); console.log('t=2 (another process appends to the file: the disk copy changes)');
show('read after the change');
clock = 3; show('read again');
clock = 4; show('after the TTL ran out');
console.log(&#96;stale answers served: &#36;{stale}&#96;);
console.log(&#96;disk reads: &#36;{diskReads} (a program with no cache would have read the disk 5 times, one per request)&#96;);</code></pre>
<div class="out">$ node lam-het-han.js<br>
t=0 first read &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; inode 60: size 100 &nbsp;&nbsp;from disk<br>
t=1 read again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; inode 60: size 100 &nbsp;&nbsp;from cache<br>
t=2 (another process appends to the file: the disk copy changes)<br>
t=2 read after the change &nbsp;-&gt; inode 60: size 100 &nbsp;&nbsp;from cache &nbsp;&nbsp;&lt;-- STALE<br>
t=3 read again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; inode 60: size 250 &nbsp;&nbsp;from disk<br>
t=4 after the TTL ran out &nbsp;-&gt; inode 60: size 250 &nbsp;&nbsp;from cache<br>
stale answers served: 1<br>
disk reads: 2 (a program with no cache would have read the disk 5 times, one per request)</div>
<p>The program served one <strong>stale</strong> answer (size 100 after the file already had size 250), then recovered when the entry expired; it still did 2 disk reads instead of 5. A time limit does not remove staleness — it <em>bounds</em> it (here: at most 3 ticks). Whether that is acceptable is a business decision: fine for a product description, wrong for an account balance. There is a famous saying: "there are only two hard things in computer science: cache invalidation and naming things" (Phil Karlton) — and slides 7 and 14 are those two things.</p>
<p>➕ A cache of <em>function results</em> is called <strong>memoisation</strong>. The Node program below memoises a naive Fibonacci: the plain version makes 29,860,703 calls for <code>fib(35)</code>, the memoised version 36 — it pays a <code>Map</code> of 36 entries. The Java version shows a trap: the natural <code>computeIfAbsent(n, k -&gt; fib(k-1) + fib(k-2))</code> fails with <code>ConcurrentModificationException</code> because the recursive calls modify the same <code>HashMap</code> while it is computing (the Java 9+ documentation says the mapping function must not modify the map; Java 8 silently corrupted it); use <code>get</code>, compute, then <code>put</code>:</p>
<pre><code class="language-javascript">// Space-time trade-off in one function: remember answers (memoisation)
let plainCalls = 0;
function fibPlain(n) { plainCalls++; return n &lt; 2 ? n : fibPlain(n - 1) + fibPlain(n - 2); }

function memoize(fn) {
  const cache = new Map();                       // the extra MEMORY we pay
  const wrapped = (n) =&gt; {
    if (cache.has(n)) return cache.get(n);       // hit: no work
    const v = fn(n); cache.set(n, v); return v;  // miss: work once, remember
  };
  wrapped.size = () =&gt; cache.size;
  return wrapped;
}
let memoCalls = 0;
const fibMemo = memoize((n) =&gt; { memoCalls++; return n &lt; 2 ? n : fibMemo(n - 1) + fibMemo(n - 2); });

const N = 35;
let t0 = process.hrtime.bigint();
const a = fibPlain(N);
const tPlain = Number(process.hrtime.bigint() - t0) / 1e6;
t0 = process.hrtime.bigint();
const b = fibMemo(N);
const tMemo = Number(process.hrtime.bigint() - t0) / 1e6;
console.log(&#96;fib(&#36;{N}) plain   = &#36;{a}&#96;);
console.log(&#96;fib(&#36;{N}) memoised = &#36;{b}&#96;);
console.log(&#96;same answer: &#36;{a === b}&#96;);
console.log(&#96;plain calls: &#36;{plainCalls}&#96;);
console.log(&#96;memoised calls: &#36;{memoCalls}  (cache holds &#36;{fibMemo.size()} entries)&#96;);
console.log(&#96;plain: &#36;{tPlain.toFixed(1)} ms · memoised: &#36;{tMemo.toFixed(3)} ms&#96;);</code></pre>
<div class="out">$ node bo-nho-dem.js<br>
fib(35) plain &nbsp;&nbsp;= 9227465<br>
fib(35) memoised = 9227465<br>
same answer: true<br>
plain calls: 29860703<br>
memoised calls: 36 &nbsp;(cache holds 36 entries)<br>
plain: 108.5 ms · memoised: 0.121 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<pre><code class="language-java">// Memoisation in Java 21 — and the trap of a recursive computeIfAbsent
import java.util.*;

public class MemoFib {
    static Map&lt;Integer, Long&gt; bad = new HashMap&lt;&gt;();
    static long fibBad(int n) {                 // WRONG: the mapping function changes the same map
        if (n &lt; 2) return n;
        return bad.computeIfAbsent(n, k -&gt; fibBad(k - 1) + fibBad(k - 2));
    }
    static Map&lt;Integer, Long&gt; good = new HashMap&lt;&gt;();
    static long fibGood(int n) {                // RIGHT: look, compute, then store
        if (n &lt; 2) return n;
        Long hit = good.get(n);
        if (hit != null) return hit;
        long v = fibGood(n - 1) + fibGood(n - 2);
        good.put(n, v);
        return v;
    }
    public static void main(String[] args) {
        try {
            fibBad(40);
            System.out.println("computeIfAbsent: no error (unexpected)");
        } catch (ConcurrentModificationException e) {
            System.out.println("computeIfAbsent: ConcurrentModificationException");
        }
        System.out.println("get/put memo: fib(40) = " + fibGood(40) + " (map holds " + good.size() + " entries)");
    }
}</code></pre>
<div class="out">$ javac MemoFib.java &amp;&amp; java MemoFib<br>
computeIfAbsent: ConcurrentModificationException<br>
get/put memo: fib(40) = 102334155 (map holds 39 entries)</div>
<p>➕ Three more techniques of the book's §12.4 belong beside caches. A <strong>hint</strong> is a cached value that may be wrong but is cheap to check — you try it and, if it fails, fall back to the slow way (example: "the file is probably at the block where it was last time"). <strong>Exploiting locality</strong> means arranging data so that things used together are close — read-ahead (reading the next disk blocks before they are asked for), keeping related rows on the same page. <strong>Optimising the common case</strong> means writing a fast path for what happens 95% of the time and leaving the slow general code for the rest; the result must be the same, and it must be <em>measured</em>:</p>
<pre><code class="language-javascript">// Optimise the COMMON case: a fast path in front of the general code
const path = require('node:path');
function normalizeGeneral(p) { return path.posix.normalize(p); }          // handles everything, slowly
let fast = 0;
function normalizeFast(p) {
  // the common case (95 %): already clean — no "//", no "/./", no "/../"
  if (!p.includes('//') &amp;&amp; !p.includes('/./') &amp;&amp; !p.includes('/../') &amp;&amp; !p.endsWith('/.')) { fast++; return p; }
  return path.posix.normalize(p);                                          // rare case: the general code
}
const inputs = [];
for (let i = 0; i &lt; 1000000; i++) inputs.push(i % 20 === 0 ? &#96;/usr//ast/./books/../mbox&#36;{i % 7}&#96; : &#96;/usr/ast/books/mos4/chap-&#36;{i % 13}&#96;);
let t0 = process.hrtime.bigint(); let a = 0;
for (const p of inputs) a += normalizeGeneral(p).length;
const tGeneral = Number(process.hrtime.bigint() - t0) / 1e6;
t0 = process.hrtime.bigint(); let b = 0;
for (const p of inputs) b += normalizeFast(p).length;
const tFast = Number(process.hrtime.bigint() - t0) / 1e6;
console.log(&#96;same results: &#36;{a === b}&#96;);
console.log(&#96;fast path taken: &#36;{fast} of &#36;{inputs.length}&#96;);
console.log(&#96;general only: &#36;{tGeneral.toFixed(0)} ms · with fast path: &#36;{tFast.toFixed(0)} ms&#96;);</code></pre>
<div class="out">$ node duong-thuong-gap.js<br>
same results: true<br>
fast path taken: 950000 of 1000000<br>
general only: 562 ms · with fast path: 162 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>A cheap string test in front of the general <code>path.normalize</code> served 950,000 of 1,000,000 inputs and cut the time to about a third (the times are one sample, 🎲; the count of 950,000 is exact). The rare 5% still take the slow path and give identical results.</p>
<p class="pitfall">⚠️ Caching mistakes that cost real exams and real incidents: (a) assuming a cache is always right — it is a <em>copy</em>; (b) forgetting that a cache hides slowness during tests and a restart ("cold cache") brings it back all at once — the <em>thundering herd</em> where thousands of requests miss together; (c) mixing the two formulas of average time (slide 13); (d) caching per-user data under a shared key (a security bug: user B sees user A's page). For the exam: "a cache works because of locality of reference" and "LRU evicts the entry unused for the longest time".</p>
<p>🧭 <strong>On a real server:</strong> every item above has a name you will use. <strong>Redis</strong> with <code>maxmemory</code> and <code>maxmemory-policy allkeys-lru</code> is an LRU cache (Redis actually samples a few keys — five by default, per its documentation — instead of keeping an exact LRU list); <code>EXPIRE</code> is the TTL; "cache-aside" (look in Redis, on a miss read PostgreSQL then store) is slide 13's walk with an application cache. <strong>HTTP caching</strong> (RFC 9111, June 2022) lets browsers and CDNs keep copies governed by <code>Cache-Control: max-age</code> and revalidate with <code>ETag</code> — the TTL idea on the network. When the underlying row changes, you must delete or update the key — the invalidation problem; many outages begin with "we forgot to clear the cache". Interview: "how do you keep Redis consistent with the database?"</p>`,
        `<p class="y-chinh">🎯 Hình 12-9: một phần của <strong>bộ đệm i-node (i-node cache)</strong> — bảng <em>đường dẫn → số i-node</em>: <code>/usr → 6</code>, <code>/usr/ast → 26</code>, <code>/usr/ast/mbox → 60</code>, <code>/usr/ast/books → 92</code>, <code>/usr/bal → 45</code>, <code>/usr/bal/paper.ps → 85</code>. Nó được tra trước, và chỉ khi trượt hệ thống mới đi qua các thư mục (slide 13). Sách thêm hai câu hỏi khó của mọi bộ đệm: <strong>to bao nhiêu</strong> và <strong>đuổi cái gì</strong>.</p>
<p>Bộ đệm không miễn phí, và một <em>thiết kế bộ đệm</em> trả lời bốn câu hỏi. (1) <strong>Lưu cái gì?</strong> (ở đây: kết quả của cả một phép tra, không phải từng khối riêng — chọn <em>đơn vị</em> là một quyết định thiết kế). (2) <strong>To bao nhiêu?</strong> bộ đệm to bằng dữ liệu thì nó chính là dữ liệu. (3) <strong>Đuổi cái gì khi đầy?</strong> Chính sách thường dùng là <strong>LRU</strong> (least recently used — đuổi mục có lần dùng cuối cũ nhất), một cú đặt cược vào tính cục bộ; các phương án khác là FIFO, LFU (least frequently used — ít dùng nhất) và ngẫu nhiên. (4) <strong>Nếu bản gốc đổi thì sao?</strong> Đây là câu khó: bản sao trong bộ đệm có thể thành <strong>cũ (stale)</strong>, và một mục i-node cũ nói "mbox là i-node 60" sau khi tệp đã bị xoá sẽ đưa chương trình tới dữ liệu sai. Hệ thống thật trả lời bằng <strong>vô hiệu hoá (invalidation)</strong> — xoá mục khi bản gốc đổi, <strong>ghi xuyên (write-through)</strong> — đổi bản gốc và bộ đệm cùng lúc, hoặc <strong>giới hạn thời gian (TTL)</strong> — chỉ tin một bản sao trong một lúc.</p>
<p>➕ Câu 3 trong Java 21: một bộ đệm có giới hạn thật. <code>LinkedHashMap</code> theo thứ tự truy cập cộng <code>removeEldestEntry</code> là một LRU hoàn chỉnh; 10 yêu cầu số i-node, chỗ cho 3 mục:</p>
<pre><code class="language-java">// Một bộ đệm có giới hạn thật bằng Java 21: LinkedHashMap theo thứ tự truy cập = LRU
import java.util.*;

public class LruCache {
    static class Lru&lt;K, V&gt; extends LinkedHashMap&lt;K, V&gt; {
        final int capacity;
        final List&lt;K&gt; evicted = new ArrayList&lt;&gt;();
        Lru(int capacity) { super(16, 0.75f, true); this.capacity = capacity; }   // true = xếp theo lần truy cập
        @Override protected boolean removeEldestEntry(Map.Entry&lt;K, V&gt; eldest) {
            boolean full = size() &gt; capacity;
            if (full) evicted.add(eldest.getKey());   // mục lâu không dùng nhất bị đuổi
            return full;
        }
    }
    static int diskReads = 0;
    static String readFromDisk(int inode) { diskReads++; return "inode-" + inode; }

    public static void main(String[] args) {
        Lru&lt;Integer, String&gt; cache = new Lru&lt;&gt;(3);
        int[] requests = {1, 2, 3, 1, 1, 2, 4, 1, 2, 2};   // số i-node được hỏi
        int hits = 0;
        for (int r : requests) {
            if (cache.get(r) != null) hits++;               // get() cũng đánh dấu r vừa dùng
            else cache.put(r, readFromDisk(r));
        }
        System.out.println("requests: " + requests.length + ", hits: " + hits + ", disk reads: " + diskReads);
        System.out.println("hit ratio: " + (double) hits / requests.length);
        System.out.println("evicted: " + cache.evicted);
        System.out.println("still cached (oldest first): " + cache.keySet());
    }
}</code></pre>
<div class="out">$ javac LruCache.java &amp;&amp; java LruCache<br>
requests: 10, hits: 6, disk reads: 4<br>
hit ratio: 0.6<br>
evicted: [3]<br>
still cached (oldest first): [4, 1, 2]</div>
<p>4 lần trượt (đọc đĩa) và 6 lần trúng, nên tỉ lệ trúng là 0,6; chỉ i-node 3 bị đuổi, vì khi 4 tới thì mục lâu không dùng nhất là 3 (1 và 2 đã được dùng sau đó). Đổi sức chứa hay thứ tự yêu cầu thì số đổi theo — chính sách, không phải may rủi, quyết định.</p>
<p>➕ Câu 4, cái giá của bộ đệm, với đồng hồ giả để output lần nào cũng như nhau. Một đáp án trong bộ đệm được tin trong 3 nhịp; ở nhịp 2 người khác đổi bản gốc:</p>
<pre><code class="language-javascript">// Cái giá của bộ đệm: bản sao có thể CŨ. Đồng hồ giả, nên lần nào chạy cũng như nhau
let clock = 0;                                           // đồng hồ riêng (không dùng Date)
const disk = new Map([['/usr/ast/mbox', 'inode 60: size 100']]);
let diskReads = 0;
const readDisk = (k) =&gt; { diskReads++; return disk.get(k); };

const TTL = 3;                                           // một bản sao được tin bao lâu
const cache = new Map();                                 // key -&gt; { value, expires }
function get(key) {
  const e = cache.get(key);
  if (e &amp;&amp; e.expires &gt; clock) return { value: e.value, from: 'cache' };       // trúng
  const value = readDisk(key);                                                 // trượt: ra chỗ chậm
  cache.set(key, { value, expires: clock + TTL });
  return { value, from: 'disk' };
}
let stale = 0;
function show(label) {
  const r = get('/usr/ast/mbox');
  const fresh = disk.get('/usr/ast/mbox');
  const isStale = r.value !== fresh;
  if (isStale) stale++;
  console.log(&#96;t=&#36;{clock} &#36;{label.padEnd(22)} -&gt; &#36;{r.value.padEnd(20)} from &#36;{r.from.padEnd(5)} &#36;{isStale ? '  &lt;-- STALE' : ''}&#96;);
}
show('first read');
clock = 1; show('read again');
clock = 2; disk.set('/usr/ast/mbox', 'inode 60: size 250'); console.log('t=2 (another process appends to the file: the disk copy changes)');
show('read after the change');
clock = 3; show('read again');
clock = 4; show('after the TTL ran out');
console.log(&#96;stale answers served: &#36;{stale}&#96;);
console.log(&#96;disk reads: &#36;{diskReads} (a program with no cache would have read the disk 5 times, one per request)&#96;);</code></pre>
<div class="out">$ node lam-het-han.js<br>
t=0 first read &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; inode 60: size 100 &nbsp;&nbsp;from disk<br>
t=1 read again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; inode 60: size 100 &nbsp;&nbsp;from cache<br>
t=2 (another process appends to the file: the disk copy changes)<br>
t=2 read after the change &nbsp;-&gt; inode 60: size 100 &nbsp;&nbsp;from cache &nbsp;&nbsp;&lt;-- STALE<br>
t=3 read again &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; inode 60: size 250 &nbsp;&nbsp;from disk<br>
t=4 after the TTL ran out &nbsp;-&gt; inode 60: size 250 &nbsp;&nbsp;from cache<br>
stale answers served: 1<br>
disk reads: 2 (a program with no cache would have read the disk 5 times, one per request)</div>
<p>Chương trình đã trả một đáp án <strong>cũ</strong> (kích thước 100 khi tệp đã có kích thước 250), rồi hồi phục khi mục hết hạn; nó vẫn chỉ đọc đĩa 2 lần thay vì 5. Giới hạn thời gian không loại bỏ sự cũ — nó <em>chặn trên</em> (ở đây: tối đa 3 nhịp). Chấp nhận được hay không là quyết định nghiệp vụ: ổn với mô tả sản phẩm, sai với số dư tài khoản. Có câu nói nổi tiếng: "trong khoa học máy tính chỉ có hai việc khó: vô hiệu hoá cache và đặt tên" (Phil Karlton) — và slide 7 với slide 14 chính là hai việc đó.</p>
<p>➕ Bộ đệm <em>kết quả hàm</em> gọi là <strong>memoization</strong>. Chương trình Node dưới ghi nhớ hàm Fibonacci ngây thơ: bản thường gọi 29.860.703 lần cho <code>fib(35)</code>, bản có ghi nhớ 36 lần — nó trả một <code>Map</code> 36 mục. Bản Java cho thấy một cái bẫy: cách tự nhiên <code>computeIfAbsent(n, k -&gt; fib(k-1) + fib(k-2))</code> hỏng với <code>ConcurrentModificationException</code> vì các lời gọi đệ quy sửa chính <code>HashMap</code> đang tính (tài liệu Java 9+ nói hàm ánh xạ không được sửa map; Java 8 lặng lẽ làm hỏng nó); hãy dùng <code>get</code>, tính, rồi <code>put</code>:</p>
<pre><code class="language-javascript">// Đánh đổi không gian–thời gian trong một hàm: nhớ lại đáp án (memoisation)
let plainCalls = 0;
function fibPlain(n) { plainCalls++; return n &lt; 2 ? n : fibPlain(n - 1) + fibPlain(n - 2); }

function memoize(fn) {
  const cache = new Map();                       // BỘ NHỚ thêm ta phải trả
  const wrapped = (n) =&gt; {
    if (cache.has(n)) return cache.get(n);       // trúng: không làm gì
    const v = fn(n); cache.set(n, v); return v;  // trượt: làm một lần rồi nhớ
  };
  wrapped.size = () =&gt; cache.size;
  return wrapped;
}
let memoCalls = 0;
const fibMemo = memoize((n) =&gt; { memoCalls++; return n &lt; 2 ? n : fibMemo(n - 1) + fibMemo(n - 2); });

const N = 35;
let t0 = process.hrtime.bigint();
const a = fibPlain(N);
const tPlain = Number(process.hrtime.bigint() - t0) / 1e6;
t0 = process.hrtime.bigint();
const b = fibMemo(N);
const tMemo = Number(process.hrtime.bigint() - t0) / 1e6;
console.log(&#96;fib(&#36;{N}) plain   = &#36;{a}&#96;);
console.log(&#96;fib(&#36;{N}) memoised = &#36;{b}&#96;);
console.log(&#96;same answer: &#36;{a === b}&#96;);
console.log(&#96;plain calls: &#36;{plainCalls}&#96;);
console.log(&#96;memoised calls: &#36;{memoCalls}  (cache holds &#36;{fibMemo.size()} entries)&#96;);
console.log(&#96;plain: &#36;{tPlain.toFixed(1)} ms · memoised: &#36;{tMemo.toFixed(3)} ms&#96;);</code></pre>
<div class="out">$ node bo-nho-dem.js<br>
fib(35) plain &nbsp;&nbsp;= 9227465<br>
fib(35) memoised = 9227465<br>
same answer: true<br>
plain calls: 29860703<br>
memoised calls: 36 &nbsp;(cache holds 36 entries)<br>
plain: 108.5 ms · memoised: 0.121 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<pre><code class="language-java">// Memoisation trong Java 21 — và cái bẫy computeIfAbsent đệ quy
import java.util.*;

public class MemoFib {
    static Map&lt;Integer, Long&gt; bad = new HashMap&lt;&gt;();
    static long fibBad(int n) {                 // SAI: hàm ánh xạ sửa chính map đó
        if (n &lt; 2) return n;
        return bad.computeIfAbsent(n, k -&gt; fibBad(k - 1) + fibBad(k - 2));
    }
    static Map&lt;Integer, Long&gt; good = new HashMap&lt;&gt;();
    static long fibGood(int n) {                // ĐÚNG: tra, tính, rồi mới cất
        if (n &lt; 2) return n;
        Long hit = good.get(n);
        if (hit != null) return hit;
        long v = fibGood(n - 1) + fibGood(n - 2);
        good.put(n, v);
        return v;
    }
    public static void main(String[] args) {
        try {
            fibBad(40);
            System.out.println("computeIfAbsent: no error (unexpected)");
        } catch (ConcurrentModificationException e) {
            System.out.println("computeIfAbsent: ConcurrentModificationException");
        }
        System.out.println("get/put memo: fib(40) = " + fibGood(40) + " (map holds " + good.size() + " entries)");
    }
}</code></pre>
<div class="out">$ javac MemoFib.java &amp;&amp; java MemoFib<br>
computeIfAbsent: ConcurrentModificationException<br>
get/put memo: fib(40) = 102334155 (map holds 39 entries)</div>
<p>➕ Ba kỹ thuật nữa của §12.4 trong sách đứng cạnh bộ đệm. <strong>Gợi ý (hint)</strong> là giá trị đã đệm có thể sai nhưng rẻ để kiểm — bạn thử nó và nếu hỏng thì lùi về đường chậm (ví dụ: "tệp có lẽ ở khối như lần trước"). <strong>Khai thác tính cục bộ</strong> là sắp xếp dữ liệu sao cho thứ dùng cùng nhau nằm gần nhau — đọc trước (đọc các khối đĩa kế tiếp trước khi được hỏi), giữ các dòng liên quan trong cùng trang. <strong>Tối ưu trường hợp thường gặp</strong> là viết một đường nhanh cho việc xảy ra 95% số lần và để mã tổng quát chậm cho phần còn lại; kết quả phải giống nhau, và phải được <em>đo</em>:</p>
<pre><code class="language-javascript">// Tối ưu TRƯỜNG HỢP THƯỜNG GẶP: một đường nhanh đặt trước mã tổng quát
const path = require('node:path');
function normalizeGeneral(p) { return path.posix.normalize(p); }          // xử lý mọi thứ, chậm
let fast = 0;
function normalizeFast(p) {
  // trường hợp thường gặp (95 %): đã sạch
  if (!p.includes('//') &amp;&amp; !p.includes('/./') &amp;&amp; !p.includes('/../') &amp;&amp; !p.endsWith('/.')) { fast++; return p; }
  return path.posix.normalize(p);                                          // hiếm gặp: mã tổng quát
}
const inputs = [];
for (let i = 0; i &lt; 1000000; i++) inputs.push(i % 20 === 0 ? &#96;/usr//ast/./books/../mbox&#36;{i % 7}&#96; : &#96;/usr/ast/books/mos4/chap-&#36;{i % 13}&#96;);
let t0 = process.hrtime.bigint(); let a = 0;
for (const p of inputs) a += normalizeGeneral(p).length;
const tGeneral = Number(process.hrtime.bigint() - t0) / 1e6;
t0 = process.hrtime.bigint(); let b = 0;
for (const p of inputs) b += normalizeFast(p).length;
const tFast = Number(process.hrtime.bigint() - t0) / 1e6;
console.log(&#96;same results: &#36;{a === b}&#96;);
console.log(&#96;fast path taken: &#36;{fast} of &#36;{inputs.length}&#96;);
console.log(&#96;general only: &#36;{tGeneral.toFixed(0)} ms · with fast path: &#36;{tFast.toFixed(0)} ms&#96;);</code></pre>
<div class="out">$ node duong-thuong-gap.js<br>
same results: true<br>
fast path taken: 950000 of 1000000<br>
general only: 562 ms · with fast path: 162 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Một phép thử chuỗi rẻ đặt trước <code>path.normalize</code> tổng quát đã phục vụ 950.000 trên 1.000.000 đầu vào và cắt thời gian còn chừng một phần ba (thời gian là một mẫu, 🎲; con số 950.000 chính xác). 5% hiếm gặp vẫn đi đường chậm và cho kết quả giống hệt.</p>
<p class="pitfall">⚠️ Các lỗi cache đã làm mất điểm thi và gây sự cố thật: (a) cho rằng cache luôn đúng — nó là một <em>bản sao</em>; (b) quên rằng cache che sự chậm khi kiểm thử và khởi động lại ("cache nguội") làm nó quay lại cùng lúc — <em>thundering herd</em> (đàn bò tót), hàng ngàn yêu cầu cùng trượt; (c) lẫn hai công thức thời gian trung bình (slide 13); (d) đệm dữ liệu từng người dùng dưới một khoá chung (lỗi bảo mật: B thấy trang của A). Cho kỳ thi: "cache hoạt động nhờ tính cục bộ tham chiếu" và "LRU đuổi mục không dùng lâu nhất".</p>
<p>🧭 <strong>Trên server thật:</strong> mỗi mục trên đều có một cái tên bạn sẽ dùng. <strong>Redis</strong> với <code>maxmemory</code> và <code>maxmemory-policy allkeys-lru</code> là một cache LRU (Redis thực ra lấy mẫu vài khoá — mặc định năm, theo tài liệu của nó — thay vì giữ danh sách LRU chính xác); <code>EXPIRE</code> là TTL; "cache-aside" (tìm trong Redis, trượt thì đọc PostgreSQL rồi lưu) là phép đi đường của slide 13 với cache ứng dụng. <strong>Cache HTTP</strong> (RFC 9111, tháng 6/2022) cho trình duyệt và CDN giữ bản sao theo <code>Cache-Control: max-age</code> và xác nhận lại bằng <code>ETag</code> — ý TTL trên mạng. Khi dòng gốc đổi, bạn phải xoá hay cập nhật khoá — bài toán vô hiệu hoá; nhiều sự cố bắt đầu bằng "chúng tôi quên xoá cache". Phỏng vấn: "làm sao giữ Redis nhất quán với cơ sở dữ liệu?"</p>`],
      [15, 'Project Management — Team Structure',
        `<p class="y-chinh">🎯 Figure 12-10: Mills' proposal for a <strong>chief programmer team</strong> of ten people — chief programmer (architectural design, writes the code), copilot (helper and sounding board), administrator (people, budget, space, equipment), editor (documentation, which the chief programmer writes), two secretaries, program clerk (archives of code and documents), toolsmith (any tools the chief needs), tester (tests the chief's code), language lawyer (part-timer who advises on the language).</p>
<p>Writing a big system is mostly a problem of <em>people</em>, not of code. The book builds on Fred Brooks' <em>The Mythical Man-Month</em> (1975, after managing IBM's OS/360). The central observation: people and months are <strong>not interchangeable</strong>. Work that can be split perfectly (picking apples) speeds up with more workers; work with dependencies (designing an interface that everyone must agree on) does not — and adding people costs <em>communication</em>. A team of <em>n</em> people has <em>n</em>(<em>n</em>−1)/2 pairs who may need to talk: 3 people have 3 channels, 10 have 45, 50 have 1,225. <strong>Brooks' law</strong>: "adding manpower to a late software project makes it later" — the new people must be taught (taking the time of the experienced ones) and the channels multiply. His quip: nine women cannot make a baby in one month.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ae2da0e2804a0158dd1a30d4a877f463c79b6959.svg" alt="Communication channels grow with the square of the team size" loading="lazy" /><p class="chu-thich">🧮 Communication channels grow with the square of the team size</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const kenh = (n) =&gt; (n * (n - 1)) / 2;
/** W tháng-người, phần s không chia được: thời gian với n người. */
export const thang = (W, s, n) =&gt; s * W + ((1 - s) * W) / n;</code></pre></details>
<p>➕ Brooks' solution, adapted from Harlan Mills, is Figure 12-10: do not use ten equal programmers; use <strong>one</strong> brain for the design and the core code (the chief programmer, who is ten times more productive than an average programmer — a figure Brooks quotes from studies of the 1960s), surrounded by specialists who remove every other burden from him. The structure keeps the <em>conceptual integrity</em> of the system — one mind's design — while still using ten people. The book then points out the model's limits: it was proposed in the early 1970s, when most of the work was one big program; and finding a chief programmer who is both a great designer and a manager of nine people is hard.</p>
<p>➕ Where does this leave the 10-person team that does not match the figure? Even without a chief programmer, the arithmetic holds. The second graph models Brooks' other point: part of any job cannot be divided, and that part sets a floor under the time no matter how many people you add. For a 12 person-month job in which a quarter is strictly sequential, one person needs 12 months, two need 7.5, twelve need 3.75, and a hundred need 3.09 — never below 3:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/50d45cbbb7d9fc1ac839fdd01832148ebbb2357f.svg" alt="Time against team size when 25% of the job cannot be divided" loading="lazy" /><p class="chu-thich">🧮 Time against team size when 25% of the job cannot be divided</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const kenh = (n) =&gt; (n * (n - 1)) / 2;
/** W tháng-người, phần s không chia được: thời gian với n người. */
export const thang = (W, s, n) =&gt; s * W + ((1 - s) * W) / n;</code></pre></details>
<pre><code class="language-javascript">// Brooks: the number of communication channels in a team of n people is n(n-1)/2
const channels = (n) =&gt; (n * (n - 1)) / 2;
console.log(' n | channels | channels per person');
for (const n of [2, 3, 5, 10, 20, 50]) {
  console.log(&#96;&#36;{String(n).padStart(2)} | &#36;{String(channels(n)).padStart(8)} | &#36;{(channels(n) / n).toFixed(1).padStart(5)}&#96;);
}
// "nine women cannot make a baby in one month": work that cannot be split gives no speed-up
// Brooks' simple model: W person-months of work. A fraction s cannot be divided at all.
// With n people the time is  s*W + (1-s)*W/n  (months) — it never goes below s*W.
function months(W, s, n) { return s * W + ((1 - s) * W) / n; }
console.log('\\nA 12 person-month job, 25% of it cannot be divided:');
for (const n of [1, 2, 4, 12, 100]) console.log(&#96;&#36;{String(n).padStart(3)} people -&gt; &#36;{months(12, 0.25, n).toFixed(2)} months (floor = &#36;{months(12, 0.25, 1e9).toFixed(2)})&#96;);</code></pre>
<div class="out">$ node brooks.js<br>
&nbsp;n | channels | channels per person<br>
&nbsp;2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;0.5<br>
&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;1.0<br>
&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 | &nbsp;&nbsp;2.0<br>
10 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 | &nbsp;&nbsp;4.5<br>
20 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;190 | &nbsp;&nbsp;9.5<br>
50 | &nbsp;&nbsp;&nbsp;&nbsp;1225 | &nbsp;24.5<br>
<br>
A 12 person-month job, 25% of it cannot be divided:<br>
&nbsp;&nbsp;1 people -&gt; 12.00 months (floor = 3.00)<br>
&nbsp;&nbsp;2 people -&gt; 7.50 months (floor = 3.00)<br>
&nbsp;&nbsp;4 people -&gt; 5.25 months (floor = 3.00)<br>
&nbsp;12 people -&gt; 3.75 months (floor = 3.00)<br>
100 people -&gt; 3.09 months (floor = 3.00)</div>
<p>The first table gives the channel counts (45 for ten people, 1,225 for fifty); the second part is the model <code>s·W + (1−s)·W/n</code>, a simple form of Amdahl's law (lesson 8) applied to a team.</p>
<p>➕ Two more ideas from the same family. <strong>Conway's law</strong> (Melvin Conway, 1968): an organisation that designs a system produces a design that copies its own communication structure — four teams, four modules; a team split between two time zones, an interface that is awkward exactly there. Linux shows the other answer: a <em>hierarchy of maintainers</em> — Linus Torvalds at the top, subsystem maintainers below, and patches flowing upwards after review — which keeps the number of people any one person must talk to small. Open-source projects do not use the chief programmer team; they use review.</p>
<p class="pitfall">⚠️ "More programmers = faster" is the intuitive and wrong answer. The exam wording to know: the channel count formula n(n−1)/2 (so do not answer n²/2 or n−1); Brooks' law (late project + more people = later); the chief programmer team has ONE person making the design decisions. Also: the slide's table is a <em>proposal</em> of 1971–72, not a description of how Google or Linux work — it is cited to illustrate why structure matters.</p>
<p>🧭 <strong>On a real server — a real team:</strong> every sprint planning meeting is this slide. A late feature one week before release: do not add three engineers — cut scope, or remove a dependency. Keep teams small (the two-pizza-team rule of thumb), give each service one owning team (Conway's law as a design tool: the "inverse Conway manoeuvre"), and use code review as the cheap form of communication that scales. Interview: "your project is two weeks late; the manager wants to add four people. What do you say?" — quote the arithmetic, not an opinion.</p>`,
        `<p class="y-chinh">🎯 Hình 12-10: đề xuất của Mills cho một <strong>nhóm lập trình viên trưởng (chief programmer team)</strong> mười người — lập trình viên trưởng (thiết kế kiến trúc, viết mã), phó (trợ thủ và người để bàn bạc), quản trị (con người, ngân sách, chỗ ngồi, thiết bị), biên tập (tài liệu, do lập trình viên trưởng viết), hai thư ký, thủ thư chương trình (lưu trữ mã và tài liệu), thợ công cụ (mọi công cụ lập trình viên trưởng cần), người kiểm thử (kiểm thử mã của lập trình viên trưởng), luật sư ngôn ngữ (người làm bán thời gian tư vấn về ngôn ngữ).</p>
<p>Viết một hệ thống lớn chủ yếu là bài toán về <em>con người</em>, không phải về mã. Sách dựa trên <em>The Mythical Man-Month</em> (Tháng-người huyền thoại, 1975) của Fred Brooks, sau khi ông quản lý OS/360 của IBM. Quan sát trung tâm: người và tháng <strong>không đổi chỗ cho nhau được</strong>. Việc chia hoàn hảo được (hái táo) nhanh lên khi thêm người; việc có phụ thuộc (thiết kế một giao diện mà mọi người phải đồng ý) thì không — và thêm người tốn <em>giao tiếp</em>. Nhóm <em>n</em> người có <em>n</em>(<em>n</em>−1)/2 cặp có thể phải nói chuyện với nhau: 3 người có 3 kênh, 10 người có 45, 50 người có 1.225. <strong>Luật Brooks</strong>: "thêm nhân lực vào dự án phần mềm đang trễ làm nó trễ hơn" — người mới phải được dạy (lấy thời gian của người có kinh nghiệm) và số kênh nhân lên. Câu đùa của ông: chín người phụ nữ không đẻ được một đứa bé trong một tháng.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/47d7af1323acfe364ce24a575d3dd5be8be25559.svg" alt="Số kênh giao tiếp tăng theo bình phương cỡ nhóm" loading="lazy" /><p class="chu-thich">🧮 Số kênh giao tiếp tăng theo bình phương cỡ nhóm</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const kenh = (n) =&gt; (n * (n - 1)) / 2;
/** W tháng-người, phần s không chia được: thời gian với n người. */
export const thang = (W, s, n) =&gt; s * W + ((1 - s) * W) / n;</code></pre></details>
<p>➕ Giải pháp của Brooks, rút từ Harlan Mills, là Hình 12-10: đừng dùng mười lập trình viên ngang nhau; dùng <strong>một</strong> bộ óc cho thiết kế và mã lõi (lập trình viên trưởng, năng suất gấp mười lần lập trình viên trung bình — con số Brooks trích từ các nghiên cứu thập niên 1960), bao quanh bởi các chuyên gia gỡ mọi gánh nặng khác khỏi ông. Cấu trúc giữ được <em>sự toàn vẹn khái niệm (conceptual integrity)</em> của hệ thống — thiết kế của một trí óc — mà vẫn dùng được mười người. Sách rồi chỉ ra giới hạn của mô hình: nó được đề xuất đầu thập niên 1970, khi phần lớn việc là một chương trình lớn; và tìm một lập trình viên trưởng vừa là nhà thiết kế giỏi vừa quản lý được chín người là khó.</p>
<p>➕ Vậy nhóm mười người không giống hình thì sao? Dù không có lập trình viên trưởng, phép tính vẫn đúng. Đồ thị thứ hai mô hình hoá ý khác của Brooks: một phần của mọi việc không chia được, và phần ấy đặt một mức sàn cho thời gian dù thêm bao nhiêu người. Với việc 12 tháng-người mà một phần tư thuần tuần tự, một người cần 12 tháng, hai người 7,5, mười hai người 3,75, và một trăm người 3,09 — không bao giờ dưới 3:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/90be34eb9ac6b2c2a7bde4d76388dcd52d3d7154.svg" alt="Thời gian theo cỡ nhóm khi 25% công việc không chia được" loading="lazy" /><p class="chu-thich">🧮 Thời gian theo cỡ nhóm khi 25% công việc không chia được</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const kenh = (n) =&gt; (n * (n - 1)) / 2;
/** W tháng-người, phần s không chia được: thời gian với n người. */
export const thang = (W, s, n) =&gt; s * W + ((1 - s) * W) / n;</code></pre></details>
<pre><code class="language-javascript">// Brooks: số kênh giao tiếp trong một nhóm n người là n(n-1)/2
const channels = (n) =&gt; (n * (n - 1)) / 2;
console.log(' n | channels | channels per person');
for (const n of [2, 3, 5, 10, 20, 50]) {
  console.log(&#96;&#36;{String(n).padStart(2)} | &#36;{String(channels(n)).padStart(8)} | &#36;{(channels(n) / n).toFixed(1).padStart(5)}&#96;);
}
// "chín người phụ nữ không đẻ được đứa bé trong một tháng"
// Brooks' simple model: W person-months of work. A fraction s cannot be divided at all.
// Mô hình đơn giản: W tháng-người; phần s không chia được.
function months(W, s, n) { return s * W + ((1 - s) * W) / n; }
console.log('\\nA 12 person-month job, 25% of it cannot be divided:');
for (const n of [1, 2, 4, 12, 100]) console.log(&#96;&#36;{String(n).padStart(3)} people -&gt; &#36;{months(12, 0.25, n).toFixed(2)} months (floor = &#36;{months(12, 0.25, 1e9).toFixed(2)})&#96;);</code></pre>
<div class="out">$ node brooks.js<br>
&nbsp;n | channels | channels per person<br>
&nbsp;2 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 | &nbsp;&nbsp;0.5<br>
&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;1.0<br>
&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 | &nbsp;&nbsp;2.0<br>
10 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;45 | &nbsp;&nbsp;4.5<br>
20 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;190 | &nbsp;&nbsp;9.5<br>
50 | &nbsp;&nbsp;&nbsp;&nbsp;1225 | &nbsp;24.5<br>
<br>
A 12 person-month job, 25% of it cannot be divided:<br>
&nbsp;&nbsp;1 people -&gt; 12.00 months (floor = 3.00)<br>
&nbsp;&nbsp;2 people -&gt; 7.50 months (floor = 3.00)<br>
&nbsp;&nbsp;4 people -&gt; 5.25 months (floor = 3.00)<br>
&nbsp;12 people -&gt; 3.75 months (floor = 3.00)<br>
100 people -&gt; 3.09 months (floor = 3.00)</div>
<p>Bảng đầu cho số kênh (45 cho mười người, 1.225 cho năm mươi); phần thứ hai là mô hình <code>s·W + (1−s)·W/n</code>, một dạng đơn giản của định luật Amdahl (bài 8) áp cho một nhóm người.</p>
<p>➕ Hai ý nữa cùng họ. <strong>Luật Conway</strong> (Melvin Conway, 1968): tổ chức thiết kế một hệ thống sẽ cho ra thiết kế sao chép cấu trúc giao tiếp của chính nó — bốn nhóm, bốn mô-đun; nhóm bị chia ở hai múi giờ, giao diện vụng đúng chỗ đó. Linux cho thấy đáp án khác: một <em>hệ thống phân cấp người bảo trì</em> — Linus Torvalds ở trên cùng, người bảo trì từng hệ thống con bên dưới, và bản vá chảy lên sau khi được xét duyệt — giữ số người mà mỗi người phải nói chuyện ở mức nhỏ. Dự án mã nguồn mở không dùng nhóm lập trình viên trưởng; họ dùng xét duyệt (review).</p>
<p class="pitfall">⚠️ "Nhiều lập trình viên hơn = nhanh hơn" là đáp án trực giác và sai. Cách hỏi trong đề cần nhớ: công thức số kênh n(n−1)/2 (đừng trả lời n²/2 hay n−1); luật Brooks (dự án trễ + thêm người = trễ hơn); nhóm lập trình viên trưởng chỉ có MỘT người đưa ra quyết định thiết kế. Ngoài ra: bảng trên slide là một <em>đề xuất</em> năm 1971–72, không phải mô tả cách Google hay Linux làm việc — nó được trích để minh hoạ vì sao cấu trúc quan trọng.</p>
<p>🧭 <strong>Trên server thật — nhóm thật:</strong> mỗi buổi lên kế hoạch sprint chính là slide này. Tính năng trễ một tuần trước ngày phát hành: đừng thêm ba kỹ sư — cắt phạm vi, hoặc gỡ một phụ thuộc. Giữ nhóm nhỏ (quy tắc ngón tay cái "nhóm hai cái pizza"), cho mỗi dịch vụ một nhóm sở hữu (luật Conway làm công cụ thiết kế: "inverse Conway manoeuvre"), và dùng code review như hình thức giao tiếp rẻ mà mở rộng được. Phỏng vấn: "dự án của bạn trễ hai tuần; quản lý muốn thêm bốn người. Bạn nói gì?" — trích phép tính, đừng đưa ý kiến.</p>`],
      [16, 'The Role of Experience',
        `<p class="y-chinh">🎯 Figure 12-11: two ways to organise a project. (a) <strong>Traditional design in stages</strong> — Plan → Code → Test modules → Test system → Deploy; no running system exists until near the end. (b) <strong>A working system from day 1</strong>: a <em>main program</em> that calls <em>dummy procedures</em> (1, 2, 3) which do nothing yet; the system runs from the first day, and each dummy is replaced by a real part while the whole keeps running.</p>
<p>Experience matters because the traditional plan, (a), is a <strong>bet</strong> that the plan was right: integration — the first time the parts are put together — is left to the end, and that is where the surprises live (interfaces that do not match, performance that is ten times too slow). In the alternative, (b), the skeleton exists from the start: the interfaces are fixed in code on day one, every new piece is tested <em>inside the running whole</em>, and at every point in time you have something to show, measure and, if the project is cancelled, ship. Brooks called the idea <em>"grow, don't build, software"</em>; today it carries names such as <strong>walking skeleton</strong>, <strong>incremental development</strong>, <strong>continuous integration</strong>. The book also stresses what experience teaches: a first design is usually too simple or too tangled, and the dangerous time is the <strong>second system</strong> — Brooks' <em>second-system effect</em>: the designer, freed from the first one's limits, puts in every idea he held back, and builds a bloated, late system. Tanenbaum's warning against over-ambitious redesigns follows.</p>
<p>➕ The slide's figure (b), in code. The main program never changes; it calls three parts. On day 1 all three are dummies — and the system already runs and can be tested end to end. By day 3 two parts have been replaced by real ones, with no change to the main program:</p>
<pre><code class="language-javascript">// Figure 12-11(b): a working system from day 1 — a main program that calls DUMMY procedures, replaced one by one
const parts = {
  parse:  (x) =&gt; { console.log('  parse: dummy');  return x; },        // dummy procedure 1
  price:  (x) =&gt; { console.log('  price: dummy');  return x; },        // dummy procedure 2
  report: (x) =&gt; { console.log('  report: dummy'); return x; },        // dummy procedure 3
};
function main(input) {                                                 // the main program NEVER changes
  return parts.report(parts.price(parts.parse(input)));
}
const real = () =&gt; Object.values(parts).filter((f) =&gt; !f.toString().includes('dummy')).length;
const check = (day) =&gt; { const out = main('3 apples'); console.log(&#96;day &#36;{day}: system runs, output = &#36;{JSON.stringify(out)}, real parts: &#36;{real()} of 3&#96;); };

check(1);                                                              // day 1: all three parts are dummies, the system already runs
parts.parse = (x) =&gt; { const [n, what] = x.split(' '); console.log('  parse: REAL'); return { n: Number(n), what }; };
parts.price = (o) =&gt; { if (typeof o === 'string') return o; console.log('  price: REAL'); return { ...o, total: o.n * 2 }; };
parts.report = (o) =&gt; { console.log('  report: dummy'); return o; };
check(3);                                                              // day 3: two parts are real, one still a dummy</code></pre>
<div class="out">$ node khung-xuong.js<br>
&nbsp;&nbsp;parse: dummy<br>
&nbsp;&nbsp;price: dummy<br>
&nbsp;&nbsp;report: dummy<br>
day 1: system runs, output = "3 apples", real parts: 0 of 3<br>
&nbsp;&nbsp;parse: REAL<br>
&nbsp;&nbsp;price: REAL<br>
&nbsp;&nbsp;report: dummy<br>
day 3: system runs, output = {"n":3,"what":"apples","total":6}, real parts: 2 of 3</div>
<p>The output has the same shape on both days; only the content gets richer. Contrast with (a): in a staged plan, <code>report</code> would not exist until "Test system" and the first time the three met would be the day before the deadline.</p>
<p>➕ <strong>No silver bullet</strong> (Brooks, 1986 — an essay later printed in <em>IEEE Computer</em>, 1987 — the book's last topic in §12.5): no single technique, tool or language will improve software productivity by a factor of ten within a decade, because what is hard about software is <em>essential</em> complexity — the problem itself: it is <em>complex</em> (no two parts alike), must <em>conform</em> to the messy outside world, must <em>change</em> forever, and is <em>invisible</em> (no blueprint you can look at). Tools that remove <em>accidental</em> complexity (high-level languages, IDEs, version control) have helped enormously but cannot touch the essence. Four decades of programming languages, frameworks and, recently, AI coding assistants have been judged against this essay — they speed up the typing, and do not decide <em>what</em> to build.</p>
<p class="pitfall">⚠️ "Waterfall is always wrong" is too simple. Staged planning is sensible when requirements are fixed and the cost of change is huge (a spacecraft, a medical device), and (b) is not "no design" — you still design the interfaces, on day 1, and fix them. Also, "second-system effect" is about the <em>second</em> system a person designs, not about version 2 of a product. Likely wording: "which approach produces a system that runs from the first day?" — (b), dummy procedures.</p>
<p>🧭 <strong>On a real server:</strong> (b) is a modern delivery pipeline. Day 1 of a new service: <code>GET /health</code> returns 200, Docker image builds, CI is green, it is deployed (to staging) — with every endpoint still a stub that returns fixed JSON. Then each endpoint is replaced by a real one behind the same URL, tests run on every push, and the product owner sees something real from the first week. Interview: "how do you start a new project?" — "a walking skeleton, deployed, then thicken it" is a strong answer. This repository's own rule that a push to <code>main</code> only triggers lint while deploys are explicit steps is the same discipline: the whole must always be runnable.</p>`,
        `<p class="y-chinh">🎯 Hình 12-11: hai cách tổ chức một dự án. (a) <strong>Thiết kế truyền thống theo giai đoạn</strong> — Lập kế hoạch → Viết mã → Kiểm thử mô-đun → Kiểm thử hệ thống → Triển khai; không có hệ thống chạy được cho tới gần cuối. (b) <strong>Hệ thống chạy được từ ngày 1</strong>: một <em>chương trình chính</em> gọi các <em>thủ tục giả (dummy procedures)</em> (1, 2, 3) chưa làm gì; hệ thống chạy từ ngày đầu, và mỗi thủ tục giả được thay bằng một phần thật trong khi cả hệ thống vẫn chạy.</p>
<p>Kinh nghiệm quan trọng vì kế hoạch truyền thống, (a), là một <strong>canh bạc</strong> rằng kế hoạch đúng: tích hợp — lần đầu các phần được ráp vào nhau — để dành tới cuối, mà đó là nơi các bất ngờ sống (giao diện không khớp, hiệu năng chậm gấp mười lần). Ở phương án (b), bộ khung có từ đầu: giao diện được cố định trong mã ngay ngày đầu, mỗi mảnh mới được kiểm thử <em>bên trong tổng thể đang chạy</em>, và ở mọi thời điểm bạn có thứ để trình diễn, đo đạc và, nếu dự án bị huỷ, giao đi. Brooks gọi ý này là <em>"nuôi lớn, đừng xây, phần mềm"</em>; ngày nay nó mang những tên như <strong>walking skeleton (bộ xương biết đi)</strong>, <strong>phát triển gia tăng</strong>, <strong>tích hợp liên tục (CI)</strong>. Sách cũng nhấn mạnh điều kinh nghiệm dạy: thiết kế đầu tiên thường quá đơn giản hoặc quá rối, và thời điểm nguy hiểm là <strong>hệ thống thứ hai</strong> — <em>hiệu ứng hệ thống thứ hai (second-system effect)</em> của Brooks: người thiết kế, thoát khỏi giới hạn của hệ thống đầu, nhét vào mọi ý tưởng đã kìm nén, và dựng một hệ thống phình to, trễ. Lời cảnh báo của Tanenbaum chống lại việc thiết kế lại quá tham vọng đi theo sau.</p>
<p>➕ Hình (b) của slide, bằng mã. Chương trình chính không bao giờ đổi; nó gọi ba phần. Ngày 1 cả ba đều giả — và hệ thống đã chạy và kiểm thử được từ đầu đến cuối. Tới ngày 3 hai phần đã được thay bằng phần thật, không đổi gì ở chương trình chính:</p>
<pre><code class="language-javascript">// Hình 12-11(b): hệ thống chạy được từ ngày 1 — chương trình chính gọi thủ tục GIẢ, thay từng cái một
const parts = {
  parse:  (x) =&gt; { console.log('  parse: dummy');  return x; },        // thủ tục giả 1
  price:  (x) =&gt; { console.log('  price: dummy');  return x; },        // thủ tục giả 2
  report: (x) =&gt; { console.log('  report: dummy'); return x; },        // thủ tục giả 3
};
function main(input) {                                                 // chương trình chính KHÔNG bao giờ đổi
  return parts.report(parts.price(parts.parse(input)));
}
const real = () =&gt; Object.values(parts).filter((f) =&gt; !f.toString().includes('dummy')).length;
const check = (day) =&gt; { const out = main('3 apples'); console.log(&#96;day &#36;{day}: system runs, output = &#36;{JSON.stringify(out)}, real parts: &#36;{real()} of 3&#96;); };

check(1);                                                              // ngày 1: ba phần đều giả, hệ thống đã chạy
parts.parse = (x) =&gt; { const [n, what] = x.split(' '); console.log('  parse: REAL'); return { n: Number(n), what }; };
parts.price = (o) =&gt; { if (typeof o === 'string') return o; console.log('  price: REAL'); return { ...o, total: o.n * 2 }; };
parts.report = (o) =&gt; { console.log('  report: dummy'); return o; };
check(3);                                                              // ngày 3: hai phần thật, một còn giả</code></pre>
<div class="out">$ node khung-xuong.js<br>
&nbsp;&nbsp;parse: dummy<br>
&nbsp;&nbsp;price: dummy<br>
&nbsp;&nbsp;report: dummy<br>
day 1: system runs, output = "3 apples", real parts: 0 of 3<br>
&nbsp;&nbsp;parse: REAL<br>
&nbsp;&nbsp;price: REAL<br>
&nbsp;&nbsp;report: dummy<br>
day 3: system runs, output = {"n":3,"what":"apples","total":6}, real parts: 2 of 3</div>
<p>Đầu ra có cùng hình dạng ở cả hai ngày; chỉ nội dung giàu lên. So với (a): trong kế hoạch theo giai đoạn, <code>report</code> sẽ không tồn tại cho tới "Kiểm thử hệ thống" và lần đầu ba phần gặp nhau là ngày trước hạn chót.</p>
<p>➕ <strong>Không có viên đạn bạc (no silver bullet)</strong> (Brooks, 1986 — bài luận sau đó in trong <em>IEEE Computer</em>, 1987 — chủ đề cuối của §12.5 trong sách): không một kỹ thuật, công cụ hay ngôn ngữ đơn lẻ nào cải thiện năng suất phần mềm gấp mười lần trong một thập kỷ, vì cái khó của phần mềm là độ phức tạp <em>bản chất</em> — chính bài toán: nó <em>phức tạp</em> (không hai phần giống nhau), phải <em>tuân theo</em> thế giới bên ngoài lộn xộn, phải <em>thay đổi</em> mãi mãi, và <em>vô hình</em> (không có bản vẽ nào để nhìn). Công cụ gỡ độ phức tạp <em>ngẫu nhiên</em> (ngôn ngữ bậc cao, IDE, quản lý phiên bản) đã giúp rất nhiều nhưng không chạm được bản chất. Bốn thập kỷ ngôn ngữ lập trình, framework và gần đây là trợ lý lập trình AI đều bị đem ra đối chiếu với bài luận này — chúng tăng tốc việc gõ, và không quyết định <em>xây cái gì</em>.</p>
<p class="pitfall">⚠️ "Thác nước (waterfall) luôn sai" là quá đơn giản. Lập kế hoạch theo giai đoạn hợp lý khi yêu cầu cố định và giá của thay đổi khổng lồ (tàu vũ trụ, thiết bị y tế), và (b) không phải "không thiết kế" — bạn vẫn thiết kế giao diện, ngay ngày 1, và cố định chúng. Ngoài ra, "hiệu ứng hệ thống thứ hai" nói về hệ thống <em>thứ hai</em> mà một người thiết kế, không phải về phiên bản 2 của một sản phẩm. Cách hỏi có thể gặp: "cách tiếp cận nào cho hệ thống chạy được từ ngày đầu?" — (b), thủ tục giả.</p>
<p>🧭 <strong>Trên server thật:</strong> (b) là một đường ống phát hành hiện đại. Ngày 1 của một dịch vụ mới: <code>GET /health</code> trả 200, Docker image dựng được, CI xanh, được triển khai (lên staging) — với mọi endpoint còn là stub trả JSON cố định. Sau đó từng endpoint được thay bằng bản thật sau cùng một URL, test chạy mỗi lần push, và chủ sản phẩm thấy thứ thật từ tuần đầu. Phỏng vấn: "bạn bắt đầu một dự án mới thế nào?" — "một bộ xương biết đi, đã triển khai, rồi làm dày dần" là câu trả lời mạnh. Quy tắc của chính kho mã này, rằng push lên <code>main</code> chỉ chạy lint còn triển khai là bước chủ động, cùng một kỷ luật: tổng thể luôn phải chạy được.</p>`],
      [17, 'Trends In Operating System Design — Virtualization and the Cloud',
        `<p class="y-chinh">🎯 Figure 12-12: a <strong>hypervisor</strong> running four <strong>virtual machines</strong> — Windows, Linux, Linux and "other OS" — on one piece of hardware. The first trend of the book's §12.6: whole operating systems become <em>programs</em> that run on top of a thin layer, and the machines of the <strong>cloud</strong> are rented slices of such hardware.</p>
<p>A <strong>virtual machine</strong> (a software imitation of a complete computer, with its own virtual CPU, memory and disks, on which a whole guest OS runs) lets one physical server host many isolated systems; the <strong>hypervisor</strong> (virtual machine monitor — the layer that shares the hardware between them) plays exactly the role the OS plays for processes, one level down. Why does it belong in a chapter on design? Because it changes the question: when the unit of deployment is a machine image, the operating system need not be general-purpose, so designers can trim it to one job — and the hypervisor becomes a second, very small kernel whose chief goal is <em>isolation</em>. The <strong>cloud</strong> (computing rented by the hour from a provider's data centres) is built on this. The book lists other trends in the same section — multicore and many-core machines (lessons 2 and 8), 64-bit address spaces so large that "everything can be mapped", seamless data access across devices, battery-powered computers (every design decision becomes an energy decision) and embedded systems. Chapter 7 treats virtualization in depth (Advanced 1, N1.A); here the link to design is enough.</p>
<p>➕ The picture of 2026 is richer than Figure 12-12. Between "a process" and "a whole VM" there is now the <strong>container</strong>: it is <em>not</em> a virtual machine — it is an ordinary group of processes that the kernel isolates with namespaces and limits with cgroups, <strong>sharing the host's kernel</strong>. In between, <strong>microVMs</strong> such as AWS Firecracker (open-sourced in 2018, built on Linux KVM, designed to start tiny VMs fast; AWS runs Lambda and Fargate on it, according to the AWS Open Source Blog) give VM-grade isolation at nearly container cost. Check the container claim with a real command:</p>
<div class="out"># Slide 17: a container is NOT a virtual machine — it uses the kernel of the machine below it<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
# its own view of the process table (a PID namespace): process 1 is the program we started, not a system manager<br>
$ cat /proc/1/comm<br>
bash<br>
$ ls /proc | grep -c '^[0-9]'<br>
3<br>
# the kernel name tells you who built it: this is the kernel of Docker Desktop's small Linux virtual machine<br>
$ cat /proc/version | cut -d' ' -f1-3<br>
Linux version 7.0.12-linuxkit</div>
<p>The container reports a Linux kernel named <code>…-linuxkit</code>: that is the kernel of Docker Desktop's small Linux VM, <em>not</em> a kernel of the container — the container has none. Its own view of the system is a tiny one (a PID namespace in which process 1 is the shell of this lesson, and a handful of processes in total). The slide's hypervisor is one layer further down, under the VM that Docker Desktop itself runs in.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/851da250656e5f0676aa4d94ec813a76d1f23c5b.svg" alt="The same four structures again: the hypervisor is a very small &quot;kernel&quot; for whole operating systems" loading="lazy" /><p class="chu-thich">🧩 The same four structures again: the hypervisor is a very small "kernel" for whole operating systems</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Four OS structures, side by side
title Where does the code run?
package "Monolithic (Linux)" {
  rectangle "apps" as M1
  rectangle "KERNEL: scheduler + VM + FS + drivers + TCP/IP\\n(one program, one address space)" as M2
  M1 --&gt; M2 : system call
}
package "Microkernel (MINIX 3, seL4, QNX)" {
  rectangle "apps + FS server + driver servers + net server\\n(user mode, separate processes)" as K1
  rectangle "TINY kernel: IPC, scheduling, address spaces" as K2
  K1 --&gt; K2 : messages
}
package "Exokernel (research)" {
  rectangle "apps + library OS (each app brings its own OS code)" as E1
  rectangle "exokernel: ONLY protects and hands out raw resources" as E2
  E1 --&gt; E2 : secure bindings
}
package "Hypervisor (cloud)" {
  rectangle "guest OS 1 | guest OS 2 | guest OS 3" as H1
  rectangle "hypervisor: shares the hardware between whole OSes" as H2
  H1 --&gt; H2 : trap / hypercall
}
@enduml</code></pre></details>
<p class="pitfall">⚠️ Container versus virtual machine is a favourite question: a VM has its own kernel and a hypervisor under it (heavier, stronger isolation, boots in seconds); a container shares the host kernel (lighter, starts in milliseconds, weaker isolation — a kernel bug affects all). "Docker is a hypervisor" is false. Another: the hypervisor in Figure 12-12 is <em>type 1</em> (bare metal, directly on the hardware); a type 2 hypervisor (VirtualBox, VMware Workstation) runs as a program inside a host OS (details: lesson N1.A).</p>
<p>🧭 <strong>On a real server:</strong> your VPS is a virtual machine; your Docker containers run inside it; your database may be a managed service on another cloud VM — three levels of "operating system" stacked. Know which level you are talking to: <code>top</code> inside a container shows the whole host's CPU unless you look at the cgroup; a "noisy neighbour" VM can slow you down; killing the container does not reboot the VM. Design consequence: stateless processes, configuration from the environment (slide 9) and replaceable instances, because the layer below may move or restart you. Interview: "container or VM — and why?"</p>`,
        `<p class="y-chinh">🎯 Hình 12-12: một <strong>hypervisor</strong> chạy bốn <strong>máy ảo (virtual machine)</strong> — Windows, Linux, Linux và "HĐH khác" — trên một bộ phần cứng. Xu hướng đầu tiên của §12.6 trong sách: cả hệ điều hành trở thành các <em>chương trình</em> chạy trên một lớp mỏng, và các máy của <strong>đám mây (cloud)</strong> là các lát phần cứng như vậy được cho thuê.</p>
<p><strong>Máy ảo (virtual machine)</strong> — bản bắt chước bằng phần mềm của một máy tính hoàn chỉnh, với CPU, bộ nhớ và đĩa ảo riêng, trên đó chạy cả một HĐH khách — cho một máy chủ vật lý chứa nhiều hệ thống cô lập; <strong>hypervisor (bộ giám sát máy ảo)</strong> — lớp chia phần cứng giữa chúng — đóng đúng vai mà HĐH đóng với tiến trình, thấp hơn một bậc. Vì sao nó thuộc chương về thiết kế? Vì nó đổi câu hỏi: khi đơn vị triển khai là một ảnh máy, HĐH không cần đa năng, nên người thiết kế có thể gọt nó cho một việc — và hypervisor trở thành một nhân thứ hai rất nhỏ với mục tiêu chính là <em>cô lập</em>. <strong>Đám mây</strong> — năng lực tính toán thuê theo giờ từ các trung tâm dữ liệu của nhà cung cấp — được dựng trên điều này. Sách liệt kê các xu hướng khác trong cùng mục — máy nhiều lõi và rất nhiều lõi (bài 2 và 8), không gian địa chỉ 64 bit lớn tới mức "có thể ánh xạ mọi thứ", truy cập dữ liệu liền mạch giữa các thiết bị, máy tính chạy pin (mỗi quyết định thiết kế thành quyết định năng lượng) và hệ nhúng. Chương 7 xử lý ảo hoá sâu (Advanced 1, N1.A); ở đây chỉ cần nối nó vào thiết kế.</p>
<p>➕ Bức tranh 2026 giàu hơn Hình 12-12. Giữa "một tiến trình" và "cả một máy ảo" nay có <strong>container</strong>: nó <em>không</em> phải máy ảo — nó là một nhóm tiến trình bình thường mà nhân cô lập bằng namespace và giới hạn bằng cgroup, <strong>dùng chung nhân của máy chủ</strong>. Ở giữa nữa, các <strong>microVM</strong> như AWS Firecracker (mã nguồn mở năm 2018, dựng trên KVM của Linux, thiết kế để khởi động nhanh các VM bé; AWS chạy Lambda và Fargate trên nó, theo AWS Open Source Blog) cho cô lập cỡ máy ảo với giá gần container. Kiểm lời khẳng định về container bằng lệnh thật:</p>
<div class="out"># Slide 17: container KHÔNG phải máy ảo — nó dùng nhân của máy bên dưới<br>
$ uname -srm<br>
Linux 7.0.12-linuxkit aarch64<br>
# góc nhìn riêng về bảng tiến trình (PID namespace): tiến trình 1 là chương trình ta khởi động, không phải trình quản lý hệ thống<br>
$ cat /proc/1/comm<br>
bash<br>
$ ls /proc | grep -c '^[0-9]'<br>
3<br>
# tên nhân cho biết ai dựng nó: đây là nhân của máy ảo Linux nhỏ trong Docker Desktop<br>
$ cat /proc/version | cut -d' ' -f1-3<br>
Linux version 7.0.12-linuxkit</div>
<p>Container báo một nhân Linux tên <code>…-linuxkit</code>: đó là nhân của máy ảo Linux nhỏ trong Docker Desktop, <em>không phải</em> nhân của container — container không có nhân. Góc nhìn riêng của nó về hệ thống rất nhỏ (một PID namespace trong đó tiến trình 1 là shell của bài này, và tổng cộng vài tiến trình). Hypervisor của slide nằm thấp thêm một lớp, dưới máy ảo mà chính Docker Desktop chạy trong đó.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/851da250656e5f0676aa4d94ec813a76d1f23c5b.svg" alt="Lại bốn cấu trúc ấy: hypervisor là một &quot;nhân&quot; rất nhỏ cho cả hệ điều hành" loading="lazy" /><p class="chu-thich">🧩 Lại bốn cấu trúc ấy: hypervisor là một "nhân" rất nhỏ cho cả hệ điều hành</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Bốn cấu trúc HĐH, đặt cạnh nhau
title Where does the code run?
package "Monolithic (Linux)" {
  rectangle "apps" as M1
  rectangle "KERNEL: scheduler + VM + FS + drivers + TCP/IP\\n(one program, one address space)" as M2
  M1 --&gt; M2 : system call
}
package "Microkernel (MINIX 3, seL4, QNX)" {
  rectangle "apps + FS server + driver servers + net server\\n(user mode, separate processes)" as K1
  rectangle "TINY kernel: IPC, scheduling, address spaces" as K2
  K1 --&gt; K2 : messages
}
package "Exokernel (research)" {
  rectangle "apps + library OS (each app brings its own OS code)" as E1
  rectangle "exokernel: ONLY protects and hands out raw resources" as E2
  E1 --&gt; E2 : secure bindings
}
package "Hypervisor (cloud)" {
  rectangle "guest OS 1 | guest OS 2 | guest OS 3" as H1
  rectangle "hypervisor: shares the hardware between whole OSes" as H2
  H1 --&gt; H2 : trap / hypercall
}
@enduml</code></pre></details>
<p class="pitfall">⚠️ Container so với máy ảo là câu hỏi ưa thích: VM có nhân riêng và hypervisor bên dưới (nặng hơn, cô lập mạnh hơn, khởi động vài giây); container dùng chung nhân máy chủ (nhẹ hơn, khởi động vài mili-giây, cô lập yếu hơn — một lỗi nhân ảnh hưởng tất cả). "Docker là hypervisor" là sai. Khác: hypervisor trong Hình 12-12 là <em>loại 1</em> (chạy trực tiếp trên phần cứng); hypervisor loại 2 (VirtualBox, VMware Workstation) chạy như một chương trình trong HĐH chủ (chi tiết: bài N1.A).</p>
<p>🧭 <strong>Trên server thật:</strong> VPS của bạn là một máy ảo; các container Docker chạy trong đó; cơ sở dữ liệu có thể là dịch vụ quản lý trên máy ảo đám mây khác — ba tầng "hệ điều hành" chồng lên nhau. Biết bạn đang nói với tầng nào: <code>top</code> trong container hiện CPU của cả máy chủ trừ khi bạn nhìn cgroup; một VM "hàng xóm ồn ào" có thể làm bạn chậm; giết container không khởi động lại VM. Hệ quả thiết kế: tiến trình không trạng thái, cấu hình từ môi trường (slide 9) và các bản thể thay thế được, vì tầng dưới có thể chuyển hoặc khởi động lại bạn. Phỏng vấn: "container hay VM — và vì sao?"</p>`],
      [18, 'End',
        `<p class="y-chinh">🎯 End of Chapter 12 — and of the book's lessons. The chapter in one paragraph: a design is a set of <strong>trade-offs</strong>, never a recipe; the <strong>interface</strong> lasts longer than the code behind it; <strong>structure</strong> (layers, microkernel) buys clarity and isolation at a price in speed; <strong>names</strong> and <strong>binding time</strong> decide how flexible the system is; <strong>space and time</strong> trade against each other, with caches as the best example and staleness as their bill; and a project is run by <strong>people</strong> who follow Brooks' arithmetic, not by schedules.</p>
<p>A checklist you can carry into any design review, with the slide where each question appeared:</p>
<table>
<thead><tr><th>Question</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>What are the abstractions and primitive operations — and is anything missing?</td><td>2, 3</td></tr>
<tr><td>Is the interface simple, complete and efficient, and are its parts orthogonal?</td><td>3</td></tr>
<tr><td>Who is in charge of the control flow — the program or the outside events?</td><td>4</td></tr>
<tr><td>How many layers, and may a layer skip one? What is the cost of each crossing?</td><td>5, 6</td></tr>
<tr><td>What has a name, what is the internal key, and when is each name bound?</td><td>7</td></tr>
<tr><td>Which sizes are fixed at build time, and what happens when they are full?</td><td>8</td></tr>
<tr><td>Where does the platform-specific code live — and is it small and in one place?</td><td>9</td></tr>
<tr><td>Did I measure before optimising? Which resource am I trading for which?</td><td>10–12</td></tr>
<tr><td>What is cached, how big, what is evicted, and how does it stay correct?</td><td>13, 14</td></tr>
<tr><td>How many people communicate, and does a running skeleton exist from day 1?</td><td>15, 16</td></tr>
<tr><td>Which layer of virtualisation am I really running on?</td><td>17</td></tr>
</tbody>
</table>
<p>Next: lesson 12.B (<code>osg202-on-ch12</code>) gives you six exercises with solutions that run — space–time trade-off, memoisation, mechanism versus policy, late binding, the cost of a message and Brooks' arithmetic — and the Chapter 12 quiz checks them in the style of the FE questions. The ⭐ in-depth section that follows shows how these ideas look inside a real backend.</p>
<p class="meo">🧠 Tip for the exam and for interviews: for every concept of this chapter keep one concrete example ready — "orthogonality: <code>fork</code> and <code>exec</code>", "mechanism versus policy: the scheduler's queue and its algorithm", "space–time: a lookup table", "stale cache: a TTL", "Brooks: channels = n(n−1)/2". An example makes an answer sound like experience instead of memory.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 12 — và hết các bài học của cuốn sách. Cả chương trong một đoạn: thiết kế là một tập <strong>đánh đổi</strong>, không bao giờ là công thức; <strong>giao diện</strong> sống lâu hơn mã phía sau nó; <strong>cấu trúc</strong> (tầng, microkernel) mua sự rõ ràng và cô lập bằng giá tốc độ; <strong>tên</strong> và <strong>thời điểm gắn kết</strong> quyết định hệ thống linh hoạt tới đâu; <strong>không gian và thời gian</strong> đổi chác lẫn nhau, với bộ đệm là ví dụ tốt nhất và sự cũ là hoá đơn của chúng; và một dự án được điều hành bởi <strong>con người</strong> theo phép tính của Brooks, không phải bởi lịch biểu.</p>
<p>Một danh sách kiểm có thể mang vào mọi buổi review thiết kế, kèm slide nơi mỗi câu hỏi xuất hiện:</p>
<table>
<thead><tr><th>Câu hỏi</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Các khái niệm trừu tượng và thao tác nguyên thuỷ là gì — và còn thiếu gì không?</td><td>2, 3</td></tr>
<tr><td>Giao diện có đơn giản, đầy đủ, hiệu quả không, các phần có trực giao không?</td><td>3</td></tr>
<tr><td>Ai cầm lái luồng điều khiển — chương trình hay sự kiện bên ngoài?</td><td>4</td></tr>
<tr><td>Bao nhiêu tầng, một tầng có được nhảy cóc không? Mỗi lần vượt tầng tốn gì?</td><td>5, 6</td></tr>
<tr><td>Cái gì có tên, khoá trong là gì, và mỗi tên được gắn kết lúc nào?</td><td>7</td></tr>
<tr><td>Kích thước nào cố định lúc dựng, và chuyện gì xảy ra khi chúng đầy?</td><td>8</td></tr>
<tr><td>Mã riêng cho nền tảng nằm ở đâu — nhỏ và ở một chỗ không?</td><td>9</td></tr>
<tr><td>Tôi đã đo trước khi tối ưu chưa? Tôi đổi tài nguyên nào lấy tài nguyên nào?</td><td>10–12</td></tr>
<tr><td>Cái gì được đệm, to bao nhiêu, đuổi cái gì, và nó đúng thế nào?</td><td>13, 14</td></tr>
<tr><td>Bao nhiêu người giao tiếp, và bộ xương chạy được có từ ngày 1 không?</td><td>15, 16</td></tr>
<tr><td>Tôi thật sự đang chạy trên tầng ảo hoá nào?</td><td>17</td></tr>
</tbody>
</table>
<p>Tiếp theo: bài 12.B (<code>osg202-on-ch12</code>) cho bạn sáu bài tập có lời giải chạy được — đánh đổi không gian–thời gian, memoization, cơ chế so với chính sách, gắn kết muộn, giá của một tin nhắn và phép tính của Brooks — và quiz Chương 12 kiểm tra chúng theo kiểu câu FE. Phần ⭐ chuyên sâu theo sau cho thấy các ý này trông thế nào bên trong một backend thật.</p>
<p class="meo">🧠 Mẹo cho kỳ thi và phỏng vấn: với mỗi khái niệm của chương hãy giữ sẵn một ví dụ cụ thể — "trực giao: <code>fork</code> và <code>exec</code>", "cơ chế so với chính sách: hàng đợi của bộ lập lịch và thuật toán của nó", "không gian–thời gian: bảng tra", "cache cũ: TTL", "Brooks: số kênh = n(n−1)/2". Một ví dụ làm câu trả lời nghe như kinh nghiệm thay vì trí nhớ.</p>`],
    ]),
    books([
      ['mos4', 'Chapter 12 "Operating System Design", sections 12.1–12.6 (Figures 12-1 to 12-12)', 'Chương 12 "Operating System Design", mục 12.1–12.6 (Hình 12-1 tới 12-12)'],
      ['man7', 'dlopen(3), dlsym(3), strace(1), fork(2), execve(2), cgroups(7), namespaces(7), getppid(2)', 'dlopen(3), dlsym(3), strace(1), fork(2), execve(2), cgroups(7), namespaces(7), getppid(2)'],
      ['kernelDocs', '"Overview of the Linux Virtual File System" (dentry and inode caches), Documentation/process/ (maintainers and submitting patches)', '"Overview of the Linux Virtual File System" (bộ đệm dentry và inode), Documentation/process/ (người bảo trì và gửi bản vá)'],
    ]),
  ].join('\n'),
};

/* ───────── 12.B — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 12: space–time, caches, mechanism vs policy, binding, Brooks ───────── */
const L_on_ch12 = {
  title: '12.B — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 12: space–time, caches, mechanism vs policy, binding, Brooks|||12.B — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 12: không gian–thời gian, cache, cơ chế/chính sách, gắn kết, Brooks',
  slug: 'osg202-on-ch12',
  type: 'VIDEO',
  description: '8 bài tập Chương 12 có lời giải chạy thật trên Linux: bảng tra 8 bit so với 16 bit (bảng to không luôn nhanh hơn vì bộ nhớ đệm CPU), kích thước ảnh với bảng màu và thời gian truy cập trung bình của bộ đệm, memoization đường đi trên lưới 12×12, đếm lần trúng của FIFO, LRU và OPT, thêm chính sách thứ ba vào một cơ chế hàng đợi không đổi, gắn kết muộn bằng LD_PRELOAD, đếm lời gọi hệ thống của dd khi đổi cỡ khối, và phép tính kênh giao tiếp cùng thời gian dự án theo luật Brooks; kèm bảng thuật ngữ Anh–Việt và tóm tắt chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 12 · Lesson 12.B · Practice &amp; review</span>
<h2>Eight exercises: design rules, tested instead of believed</h2>
<p class="lead">Chapter 12 has almost no calculation questions in the FE bank — the questions that do appear ask which structure has which property (monolithic, layered, microkernel, client-server) and which layer does what. So this lesson does something different from lessons 2–6: instead of drills, every exercise <em>tests a design rule</em> from lesson 12.A with a program you can run and change. Do the exercise on paper or in your head first, then open the solution — a design intuition is built exactly in the gap between what you expected and what the machine printed. Exercise 1 is the best example: you will probably predict "the bigger table is faster", and be wrong.</p>
<table>
<thead><tr><th>Exercise</th><th>Design rule</th><th>Slides of 12.A</th></tr></thead>
<tbody>
<tr><td>1</td><td>a bigger lookup table is not automatically faster (cache effects)</td><td>10–11</td></tr>
<tr><td>2</td><td>space for time and time for space: palette size, average access time</td><td>12–13</td></tr>
<tr><td>3</td><td>memoisation: a cache of function results</td><td>14</td></tr>
<tr><td>4</td><td>replacement policy changes the hit ratio (FIFO, LRU, OPT)</td><td>14</td></tr>
<tr><td>5</td><td>mechanism versus policy: add a policy without touching the mechanism</td><td>6</td></tr>
<tr><td>6</td><td>late binding: change behaviour at load time</td><td>7</td></tr>
<tr><td>7</td><td>measure first: count system calls before optimising</td><td>10</td></tr>
<tr><td>8</td><td>Brooks: channels and the indivisible part of a job</td><td>15</td></tr>
</tbody>
</table>
<div class="callout">Read the "design" slides (12.A) first if the words mechanism, policy, binding time or hit ratio are unfamiliar; the glossary at the end lists 14 terms in English and Vietnamese.</div>`,
    `<span class="eyebrow">Chương 12 · Bài 12.B · Thực hành &amp; ôn tập</span>
<h2>Tám bài tập: quy tắc thiết kế, được kiểm thử thay vì tin</h2>
<p class="lead">Chương 12 hầu như không có câu tính toán trong ngân hàng FE — những câu có xuất hiện hỏi cấu trúc nào có tính chất nào (nguyên khối, phân lớp, microkernel, client-server) và tầng nào làm gì. Vì vậy bài này làm khác các bài 2–6: thay vì luyện, mỗi bài tập <em>kiểm thử một quy tắc thiết kế</em> của bài 12.A bằng một chương trình bạn chạy và sửa được. Hãy làm bài trên giấy hoặc trong đầu trước, rồi mới mở lời giải — trực giác thiết kế được hình thành đúng ở khoảng cách giữa điều bạn chờ đợi và điều máy in ra. Bài 1 là ví dụ rõ nhất: nhiều khả năng bạn sẽ đoán "bảng to hơn thì nhanh hơn", và sai.</p>
<table>
<thead><tr><th>Bài</th><th>Quy tắc thiết kế</th><th>Slide của 12.A</th></tr></thead>
<tbody>
<tr><td>1</td><td>bảng tra to hơn không tự động nhanh hơn (hiệu ứng bộ nhớ đệm)</td><td>10–11</td></tr>
<tr><td>2</td><td>đổi không gian lấy thời gian và ngược lại: cỡ bảng màu, thời gian truy cập trung bình</td><td>12–13</td></tr>
<tr><td>3</td><td>memoization: bộ đệm cho kết quả hàm</td><td>14</td></tr>
<tr><td>4</td><td>chính sách thay thế đổi tỉ lệ trúng (FIFO, LRU, OPT)</td><td>14</td></tr>
<tr><td>5</td><td>cơ chế so với chính sách: thêm chính sách mà không đụng cơ chế</td><td>6</td></tr>
<tr><td>6</td><td>gắn kết muộn: đổi hành vi lúc nạp</td><td>7</td></tr>
<tr><td>7</td><td>đo trước: đếm lời gọi hệ thống trước khi tối ưu</td><td>10</td></tr>
<tr><td>8</td><td>Brooks: số kênh và phần không chia được của một việc</td><td>15</td></tr>
</tbody>
</table>
<div class="callout">Hãy đọc các slide "thiết kế" (12.A) trước nếu các từ cơ chế, chính sách, thời điểm gắn kết hay tỉ lệ trúng còn lạ; bảng thuật ngữ cuối bài liệt kê 14 từ bằng tiếng Anh và tiếng Việt.</div>`),
    bi(`<h3>🧪 Exercise 1 — a bigger table: faster or slower? (15 min)</h3>
<p>A 32-bit number can be counted with the 8-bit table of lesson 12.A (four lookups: 256 bytes) or with a 16-bit table (two lookups: 65,536 bytes). (a) How much memory does each table use and how many lookups per number? (b) Predict which version is faster. (c) Run the program and compare with your prediction — then explain the result using the idea that a table must stay in the CPU cache.</p>
<details><summary>Solution — run on this container</summary>
<pre><code class="language-c">// Exercise 1: count the bits of a 32-bit number with an 8-bit table (4 lookups) or a 16-bit table (2 lookups)
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;time.h&gt;

static unsigned char t8[256];
static unsigned char t16[65536];
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec + t.tv_nsec / 1e9; }

static int pop8(uint32_t x)  { return t8[x &amp; 255] + t8[(x &gt;&gt; 8) &amp; 255] + t8[(x &gt;&gt; 16) &amp; 255] + t8[x &gt;&gt; 24]; }
static int pop16(uint32_t x) { return t16[x &amp; 65535] + t16[x &gt;&gt; 16]; }

int main(void) {
    for (int i = 0; i &lt; 256; i++) t8[i] = __builtin_popcount(i);
    for (int i = 0; i &lt; 65536; i++) t16[i] = __builtin_popcount(i);
    int same = 1;
    for (uint32_t x = 0; x &lt; 5000000; x += 7919) if (pop8(x) != pop16(x) || pop8(x) != __builtin_popcount(x)) same = 0;
    printf("same answers: %s\\n", same ? "yes" : "NO");
    printf("8-bit table: %zu bytes, 4 lookups per number\\n", sizeof t8);
    printf("16-bit table: %zu bytes, 2 lookups per number\\n", sizeof t16);
    enum { N = 30000000 };
    volatile long sink; long s = 0;
    double t0 = now();
    for (uint32_t i = 0; i &lt; N; i++) s += pop8(i * 2654435761u);
    double a = now() - t0; sink = s; s = 0;
    t0 = now();
    for (uint32_t i = 0; i &lt; N; i++) s += pop16(i * 2654435761u);
    double b = now() - t0; sink = s; (void) sink;
    printf("8-bit table : %6.1f ms\\n16-bit table: %6.1f ms\\n", a * 1000, b * 1000);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-16.c -o bang-16 &amp;&amp; ./bang-16<br>
same answers: yes<br>
8-bit table: 256 bytes, 4 lookups per number<br>
16-bit table: 65536 bytes, 2 lookups per number<br>
8-bit table : &nbsp;&nbsp;95.1 ms<br>
16-bit table: &nbsp;120.6 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li>(a) 256 bytes and 4 lookups, against 65,536 bytes (64 KiB, 256 times more) and 2 lookups. Both tables give the same answer for every input the program tried (and match <code>__builtin_popcount</code>).</li>
<li>(b)/(c) Half as many lookups suggests the 16-bit table wins. The run shows the opposite on this machine (about 95 ms against 120 ms; one sample, 🎲 — the exact numbers vary, and on another CPU the two can be close). The 256-byte table lives in the fastest cache for the whole run; the 64 KiB table does not fit in the smallest data cache of many CPUs (32–64 KiB per core) and also pushes the program's other data out. The lesson: <strong>the space of a table is a cost in time too</strong>, once it stops fitting in cache. Measure; do not count lookups.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — bảng to hơn: nhanh hơn hay chậm hơn? (15 phút)</h3>
<p>Một số 32 bit có thể được đếm bit bằng bảng 8 bit của bài 12.A (bốn lần tra: 256 byte) hoặc bằng bảng 16 bit (hai lần tra: 65.536 byte). (a) Mỗi bảng dùng bao nhiêu bộ nhớ và bao nhiêu lần tra cho mỗi số? (b) Đoán bản nào nhanh hơn. (c) Chạy chương trình và so với dự đoán — rồi giải thích kết quả bằng ý rằng bảng phải ở lại trong bộ nhớ đệm CPU.</p>
<details><summary>Lời giải — chạy trên container này</summary>
<pre><code class="language-c">// Bài 1: đếm bit của số 32 bit bằng bảng 8 bit (4 lần tra) hoặc bảng 16 bit (2 lần tra)
#include &lt;stdio.h&gt;
#include &lt;stdint.h&gt;
#include &lt;time.h&gt;

static unsigned char t8[256];
static unsigned char t16[65536];
static double now(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &amp;t); return t.tv_sec + t.tv_nsec / 1e9; }

static int pop8(uint32_t x)  { return t8[x &amp; 255] + t8[(x &gt;&gt; 8) &amp; 255] + t8[(x &gt;&gt; 16) &amp; 255] + t8[x &gt;&gt; 24]; }
static int pop16(uint32_t x) { return t16[x &amp; 65535] + t16[x &gt;&gt; 16]; }

int main(void) {
    for (int i = 0; i &lt; 256; i++) t8[i] = __builtin_popcount(i);
    for (int i = 0; i &lt; 65536; i++) t16[i] = __builtin_popcount(i);
    int same = 1;
    for (uint32_t x = 0; x &lt; 5000000; x += 7919) if (pop8(x) != pop16(x) || pop8(x) != __builtin_popcount(x)) same = 0;
    printf("same answers: %s\\n", same ? "yes" : "NO");
    printf("8-bit table: %zu bytes, 4 lookups per number\\n", sizeof t8);
    printf("16-bit table: %zu bytes, 2 lookups per number\\n", sizeof t16);
    enum { N = 30000000 };
    volatile long sink; long s = 0;
    double t0 = now();
    for (uint32_t i = 0; i &lt; N; i++) s += pop8(i * 2654435761u);
    double a = now() - t0; sink = s; s = 0;
    t0 = now();
    for (uint32_t i = 0; i &lt; N; i++) s += pop16(i * 2654435761u);
    double b = now() - t0; sink = s; (void) sink;
    printf("8-bit table : %6.1f ms\\n16-bit table: %6.1f ms\\n", a * 1000, b * 1000);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-16.c -o bang-16 &amp;&amp; ./bang-16<br>
same answers: yes<br>
8-bit table: 256 bytes, 4 lookups per number<br>
16-bit table: 65536 bytes, 2 lookups per number<br>
8-bit table : &nbsp;&nbsp;95.1 ms<br>
16-bit table: &nbsp;120.6 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li>(a) 256 byte và 4 lần tra, so với 65.536 byte (64 KiB, gấp 256 lần) và 2 lần tra. Cả hai bảng cho cùng đáp án với mọi đầu vào chương trình thử (và khớp <code>__builtin_popcount</code>).</li>
<li>(b)/(c) Số lần tra giảm một nửa gợi ý bảng 16 bit thắng. Lần chạy cho thấy điều ngược lại trên máy này (khoảng 95 ms so với 120 ms; một mẫu, 🎲 — số chính xác thay đổi, và trên CPU khác hai bản có thể sát nhau). Bảng 256 byte nằm trong cache nhanh nhất suốt lần chạy; bảng 64 KiB không vừa cache dữ liệu nhỏ nhất của nhiều CPU (32–64 KiB mỗi lõi) và còn đẩy dữ liệu khác của chương trình ra. Bài học: <strong>không gian của một bảng cũng là chi phí thời gian</strong> khi nó không còn vừa cache. Hãy đo; đừng đếm số lần tra.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — palette and average access time (20 min)</h3>
<p>(a) A 640 × 480 image uses at most 256 colours, stored as a 256-entry palette of 24-bit colours plus one 8-bit index per pixel. How many bytes is it raw (24 bits per pixel) and with the palette? What fraction is saved? (b) A cache access takes 20 ns, an access to the slow store takes 200,000 ns (200 µs), and the hit ratio is 0.95. What is the average access time with average = h × t<sub>cache</sub> + (1 − h) × t<sub>slow</sub>? What fraction of that time comes from the 5% of misses?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e1702f6138be5b6c59169d8d8d5544393b2bcac5.svg" alt="Exercise 2(a): the image in bytes" loading="lazy" /><p class="chu-thich">🧮 Exercise 2(a): the image in bytes</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9810ea539b302791309f5d175e1191b9b5bdfb37.svg" alt="Exercise 2(b): average access time on a log scale" loading="lazy" /><p class="chu-thich">🧮 Exercise 2(b): average access time on a log scale</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<ul>
<li>(a) Raw: 307,200 pixels × 3 bytes = <strong>921,600 bytes</strong>. With the palette: 307,200 × 1 byte + 256 × 3 bytes = <strong>307,968 bytes</strong> — 33.4%, so 66.6% saved. The palette (768 bytes) is a rounding error here; in lesson 12.A's 16-pixel image it was the whole problem. Break-even needs more pixels than the palette size × 1.5 (slide 12).</li>
<li>(b) 0.95 × 20 + 0.05 × 200,000 = 19 + 10,000 = <strong>10,019 ns</strong>. The misses are 10,000 of the 10,019 ns: <strong>99.8%</strong> of the time comes from 5% of the requests. To halve the average you must halve the <em>miss</em> ratio (or the slow time), not the cache time.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — bảng màu và thời gian truy cập trung bình (20 phút)</h3>
<p>(a) Một ảnh 640 × 480 dùng tối đa 256 màu, lưu bằng bảng màu 256 mục gồm màu 24 bit cộng một chỉ số 8 bit cho mỗi điểm ảnh. Thô (24 bit mỗi điểm ảnh) và với bảng màu thì mấy byte? Tiết kiệm bao nhiêu phần? (b) Một lần truy cập bộ đệm tốn 20 ns, truy cập kho chậm tốn 200.000 ns (200 µs), tỉ lệ trúng 0,95. Thời gian truy cập trung bình theo trung bình = h × t<sub>đệm</sub> + (1 − h) × t<sub>chậm</sub> là bao nhiêu? Bao nhiêu phần thời gian đó đến từ 5% lần trượt?</p>
<details><summary>Lời giải — do bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e74a9943316fc6d56655260430154c2c196da04c.svg" alt="Bài 2(a): ảnh tính bằng byte" loading="lazy" /><p class="chu-thich">🧮 Bài 2(a): ảnh tính bằng byte</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/613762982c0e4b05b3caa96093f8dbb2cf6d6728.svg" alt="Bài 2(b): thời gian truy cập trung bình trên thang log" loading="lazy" /><p class="chu-thich">🧮 Bài 2(b): thời gian truy cập trung bình trên thang log</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<ul>
<li>(a) Thô: 307.200 điểm ảnh × 3 byte = <strong>921.600 byte</strong>. Với bảng màu: 307.200 × 1 byte + 256 × 3 byte = <strong>307.968 byte</strong> — 33,4%, tức tiết kiệm 66,6%. Bảng màu (768 byte) chỉ là sai số làm tròn ở đây; trong ảnh 16 điểm của bài 12.A nó là toàn bộ vấn đề. Hoà vốn cần nhiều điểm ảnh hơn cỡ bảng màu × 1,5 (slide 12).</li>
<li>(b) 0,95 × 20 + 0,05 × 200.000 = 19 + 10.000 = <strong>10.019 ns</strong>. Các lần trượt chiếm 10.000 trên 10.019 ns: <strong>99,8%</strong> thời gian đến từ 5% yêu cầu. Muốn giảm một nửa trung bình bạn phải giảm một nửa tỉ lệ <em>trượt</em> (hoặc thời gian của kho chậm), không phải thời gian bộ đệm.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — memoise a two-argument function (20 min)</h3>
<p>The number of routes across a grid from corner to corner, moving only right or down, is <code>paths(r, c) = paths(r−1, c) + paths(r, c−1)</code> with <code>paths(0, c) = paths(r, 0) = 1</code>. (a) Estimate how many calls <code>paths(12, 12)</code> makes without a cache (guess: thousands? millions?). (b) Write a memoised version — what must the cache key be? (c) How many calls and how many cache entries does it need?</p>
<details><summary>Solution — run on this container</summary>
<pre><code class="language-javascript">// Exercise 3: count the routes across a 12 x 12 grid (right or down) — plain recursion vs memoisation
let plain = 0;
function paths(r, c) { plain++; return r === 0 || c === 0 ? 1 : paths(r - 1, c) + paths(r, c - 1); }
let memoCalls = 0;
const cache = new Map();
function pathsMemo(r, c) {
  const key = r + ',' + c;                 // two arguments: the key is both of them
  if (cache.has(key)) return cache.get(key);
  memoCalls++;
  const v = r === 0 || c === 0 ? 1 : pathsMemo(r - 1, c) + pathsMemo(r, c - 1);
  cache.set(key, v);
  return v;
}
const a = paths(12, 12), b = pathsMemo(12, 12);
console.log(&#96;paths = &#36;{a} (same: &#36;{a === b})&#96;);
console.log(&#96;plain calls: &#36;{plain}&#96;);
console.log(&#96;memoised calls: &#36;{memoCalls}, cache entries: &#36;{cache.size}&#96;);</code></pre>
<div class="out">$ node duong-luoi.js<br>
paths = 2704156 (same: true)<br>
plain calls: 5408311<br>
memoised calls: 168, cache entries: 168</div>
<pre class="trich"><code class="language-javascript">function pathsMemo(r, c) {
  const key = r + ',' + c;                 // two arguments: the key is both of them
  if (cache.has(key)) return cache.get(key);
  memoCalls++;
  const v = r === 0 || c === 0 ? 1 : pathsMemo(r - 1, c) + pathsMemo(r, c - 1);
  cache.set(key, v);
  return v;
}</code></pre>
<ul>
<li>(a) The plain version makes <strong>5,408,311 calls</strong> to find 2,704,156 routes — every route is counted one by one by the leaves of the recursion, so the calls are about twice the answer.</li>
<li>(b) The function has two arguments, so the key is the pair — a string <code>"r,c"</code> (or a number <code>r * 13 + c</code>). Keying by <code>r</code> alone would make the cache return a wrong answer for a different <code>c</code> — the commonest memoisation bug.</li>
<li>(c) Each of the distinct (r, c) pairs is computed once: <strong>168 calls and 168 entries</strong> (13 × 13 = 169 pairs, minus the unused corner). Millions of calls became 168, for 168 map entries — a <strong>space–time trade-off</strong>, here a spectacular one because the same sub-problems repeat. In Java do not use <code>computeIfAbsent</code> with recursion on the same map (it throws <code>ConcurrentModificationException</code>, see slide 14).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — memoize một hàm hai đối số (20 phút)</h3>
<p>Số đường đi qua một lưới từ góc này sang góc kia, chỉ đi sang phải hoặc xuống, là <code>paths(r, c) = paths(r−1, c) + paths(r, c−1)</code> với <code>paths(0, c) = paths(r, 0) = 1</code>. (a) Ước lượng <code>paths(12, 12)</code> thực hiện bao nhiêu lời gọi khi không có bộ đệm (đoán: hàng ngàn? hàng triệu?). (b) Viết bản có memoization — khoá của bộ đệm phải là gì? (c) Nó cần bao nhiêu lời gọi và bao nhiêu mục bộ đệm?</p>
<details><summary>Lời giải — chạy trên container này</summary>
<pre><code class="language-javascript">// Bài 3: đếm đường đi qua lưới 12 x 12 (sang phải hoặc xuống) — đệ quy thường và memoization
let plain = 0;
function paths(r, c) { plain++; return r === 0 || c === 0 ? 1 : paths(r - 1, c) + paths(r, c - 1); }
let memoCalls = 0;
const cache = new Map();
function pathsMemo(r, c) {
  const key = r + ',' + c;                 // hai đối số: khoá gồm cả hai
  if (cache.has(key)) return cache.get(key);
  memoCalls++;
  const v = r === 0 || c === 0 ? 1 : pathsMemo(r - 1, c) + pathsMemo(r, c - 1);
  cache.set(key, v);
  return v;
}
const a = paths(12, 12), b = pathsMemo(12, 12);
console.log(&#96;paths = &#36;{a} (same: &#36;{a === b})&#96;);
console.log(&#96;plain calls: &#36;{plain}&#96;);
console.log(&#96;memoised calls: &#36;{memoCalls}, cache entries: &#36;{cache.size}&#96;);</code></pre>
<div class="out">$ node duong-luoi.js<br>
paths = 2704156 (same: true)<br>
plain calls: 5408311<br>
memoised calls: 168, cache entries: 168</div>
<pre class="trich"><code class="language-javascript">function pathsMemo(r, c) {
  const key = r + ',' + c;                 // hai đối số: khoá gồm cả hai
  if (cache.has(key)) return cache.get(key);
  memoCalls++;
  const v = r === 0 || c === 0 ? 1 : pathsMemo(r - 1, c) + pathsMemo(r, c - 1);
  cache.set(key, v);
  return v;
}</code></pre>
<ul>
<li>(a) Bản thường thực hiện <strong>5.408.311 lời gọi</strong> để tìm 2.704.156 đường — mỗi đường được các lá của đệ quy đếm từng cái một, nên số lời gọi gấp khoảng hai lần đáp án.</li>
<li>(b) Hàm có hai đối số nên khoá là cặp — chuỗi <code>"r,c"</code> (hoặc số <code>r * 13 + c</code>). Khoá chỉ theo <code>r</code> sẽ làm bộ đệm trả đáp án sai cho <code>c</code> khác — lỗi memoization phổ biến nhất.</li>
<li>(c) Mỗi cặp (r, c) khác nhau được tính một lần: <strong>168 lời gọi và 168 mục</strong> (13 × 13 = 169 cặp, trừ góc không dùng). Hàng triệu lời gọi thành 168, với giá 168 mục trong map — một <strong>đánh đổi không gian–thời gian</strong>, ở đây ngoạn mục vì các bài toán con lặp lại. Trong Java đừng dùng <code>computeIfAbsent</code> đệ quy trên cùng một map (nó ném <code>ConcurrentModificationException</code>, xem slide 14).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — which victim? FIFO, LRU and OPT (15 min)</h3>
<p>A cache with 3 entries starts empty and receives the requests 1 2 3 1 4 1 2 5 1 2. Count the hits with (a) FIFO, (b) LRU, (c) OPT (evict the entry whose next use is farthest in the future). (d) Why can OPT not be built into a real cache?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/7632ec27aee170959710ab9fbfb7c24a0fc3307e.svg" alt="Exercise 4: hits of FIFO, LRU and OPT" loading="lazy" /><p class="chu-thich">🧮 Exercise 4: hits of FIFO, LRU and OPT</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<ul>
<li>(a) FIFO: <strong>3 hits</strong> — it evicts the oldest <em>arrival</em>, even when that entry (the number 1) is used again and again. (b) LRU: <strong>4 hits</strong> — recent use predicts future use, so 1 stays. (c) OPT: <strong>5 hits</strong> — the lower bound on misses, 5 of 10.</li>
<li>(d) OPT needs to know the future of the request string; real caches only have the past. It is used as a <em>yardstick</em>: LRU at 4 of the possible 5 is close to the best any policy could do on this string. The same algorithms appear for page replacement (lesson 3); a cache is just a page frame table with another name. FE5#22 and FE15#23 ask the same LRU 3-frame question with different strings.</li>
<li>Redis note: <code>allkeys-lru</code> uses an <em>approximation</em> (it samples a few keys, five by default, and evicts the oldest of the sample — Redis documentation) because an exact LRU list costs memory and time on every access — another trade-off of this chapter.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — nạn nhân nào? FIFO, LRU và OPT (15 phút)</h3>
<p>Một bộ đệm 3 mục bắt đầu trống và nhận các yêu cầu 1 2 3 1 4 1 2 5 1 2. Đếm số lần trúng với (a) FIFO, (b) LRU, (c) OPT (đuổi mục có lần dùng kế tiếp xa nhất trong tương lai). (d) Vì sao OPT không thể xây vào một bộ đệm thật?</p>
<details><summary>Lời giải — do bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/e79a3717f6ea65f32ea7ca1e485af5296585fc1e.svg" alt="Bài 4: số lần trúng của FIFO, LRU và OPT" loading="lazy" /><p class="chu-thich">🧮 Bài 4: số lần trúng của FIFO, LRU và OPT</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<ul>
<li>(a) FIFO: <strong>3 lần trúng</strong> — nó đuổi mục <em>đến</em> sớm nhất, kể cả khi mục đó (số 1) được dùng lại liên tục. (b) LRU: <strong>4 lần trúng</strong> — dùng gần đây dự đoán dùng sắp tới, nên số 1 ở lại. (c) OPT: <strong>5 lần trúng</strong> — cận dưới của số lần trượt, 5 trên 10.</li>
<li>(d) OPT cần biết tương lai của chuỗi yêu cầu; bộ đệm thật chỉ có quá khứ. Nó được dùng như một <em>thước đo</em>: LRU được 4 trên 5 khả dĩ, gần với mức tốt nhất mà chính sách nào cũng đạt được trên chuỗi này. Các thuật toán này cũng xuất hiện ở thay trang (bài 3); bộ đệm chỉ là bảng khung trang mang tên khác. FE5#22 và FE15#23 hỏi đúng câu LRU 3 khung này với chuỗi khác.</li>
<li>Ghi chú Redis: <code>allkeys-lru</code> dùng một phép <em>xấp xỉ</em> (lấy mẫu vài khoá, mặc định năm, và đuổi khoá cũ nhất trong mẫu — tài liệu Redis) vì danh sách LRU chính xác tốn bộ nhớ và thời gian ở mỗi lần truy cập — một đánh đổi nữa của chương này.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — add a third policy without touching the mechanism (20 min)</h3>
<p>The job queue of lesson 12.A runs four jobs A (cost 10), B (2), C (6), D (2), all present at time 0. With "oldest first" the average wait is 10; with "shortest first" it is 4. Add a <em>third</em> policy "highest priority first" (priorities A 3, B 1, C 2, D 4 — a small number is more important) <strong>without editing</strong> <code>runQueue</code>. (a) What are the three average waits? (b) How do you prove the mechanism did not change?</p>
<details><summary>Solution — computed and run</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/6c82278df39f135bdf9a73b8d908dfddf0942692.svg" alt="Policy 1 — oldest first" loading="lazy" /><p class="chu-thich">🧮 Policy 1 — oldest first</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/bfce13f0dc08099747f7a2f3f5bff3c2ced5a073.svg" alt="Policy 2 — shortest first" loading="lazy" /><p class="chu-thich">🧮 Policy 2 — shortest first</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<pre><code class="language-javascript">// Exercise 4: add a THIRD policy (highest priority first) — the mechanism is not touched
const jobs = [{ name: 'A', cost: 10, prio: 3 }, { name: 'B', cost: 2, prio: 1 }, { name: 'C', cost: 6, prio: 2 }, { name: 'D', cost: 2, prio: 4 }];
function runQueue(jobs, pickNext) {                       // the MECHANISM, exactly as in the lesson
  const waiting = [...jobs]; let t = 0; const log = []; let totalWait = 0;
  while (waiting.length) {
    const job = waiting.splice(pickNext(waiting), 1)[0];
    totalWait += t; log.push(&#96;&#36;{job.name}@&#36;{t}&#96;); t += job.cost;
  }
  return { log, avgWait: totalWait / jobs.length };
}
const before = runQueue.toString();
const highestPriority = (q) =&gt; q.reduce((best, j, i) =&gt; (j.prio &lt; q[best].prio ? i : best), 0);   // small number = important
const r = runQueue(jobs, highestPriority);
console.log(&#96;priority policy: average wait = &#36;{r.avgWait}   order: &#36;{r.log.join(' ')}&#96;);
console.log(&#96;mechanism source unchanged: &#36;{before === runQueue.toString()}&#96;);</code></pre>
<div class="out">$ node chinh-sach-moi.js<br>
priority policy: average wait = 7 &nbsp;&nbsp;order: B@0 C@2 A@8 D@18<br>
mechanism source unchanged: true</div>
<pre class="trich"><code class="language-javascript">const highestPriority = (q) =&gt; q.reduce((best, j, i) =&gt; (j.prio &lt; q[best].prio ? i : best), 0);   // small number = important</code></pre>
<ul>
<li>(a) Average waits: oldest first <strong>10</strong>, shortest first <strong>4</strong> (the minimum possible for these jobs — the same reason SJF is optimal in lesson 2), highest priority first <strong>7</strong> (order B, C, A, D). The priority policy is not "better" or "worse" — it optimises something else: B and C, the important jobs, start at 0 and 2.</li>
<li>(b) The program prints <code>mechanism source unchanged: true</code> by comparing the source text of <code>runQueue</code> before and after — the new policy was one line passed as a function. In a real system the same shape is the Linux scheduler classes, a servlet <code>Filter</code> chain, or a Spring <code>@Primary</code> bean: the framework is the mechanism, your class is the policy.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — thêm chính sách thứ ba mà không đụng cơ chế (20 phút)</h3>
<p>Hàng đợi việc của bài 12.A chạy bốn việc A (chi phí 10), B (2), C (6), D (2), tất cả có mặt lúc 0. Với "đến trước làm trước" thời gian chờ trung bình là 10; với "ngắn nhất làm trước" là 4. Hãy thêm chính sách <em>thứ ba</em> "ưu tiên cao nhất trước" (độ ưu tiên A 3, B 1, C 2, D 4 — số nhỏ quan trọng hơn) <strong>mà không sửa</strong> <code>runQueue</code>. (a) Ba thời gian chờ trung bình là bao nhiêu? (b) Làm sao chứng minh cơ chế không đổi?</p>
<details><summary>Lời giải — tính và chạy</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ed2b6ff803fed670643de11d7b5cf5773028e9ce.svg" alt="Chính sách 1 — đến trước làm trước" loading="lazy" /><p class="chu-thich">🧮 Chính sách 1 — đến trước làm trước</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9e196c0ee93b53a93717eadfa5a634d8f7a7da44.svg" alt="Chính sách 2 — ngắn nhất làm trước" loading="lazy" /><p class="chu-thich">🧮 Chính sách 2 — ngắn nhất làm trước</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const DS = [{ ten: 'A', den: 0, chay: 10 }, { ten: 'B', den: 0, chay: 2 }, { ten: 'C', den: 0, chay: 6 }, { ten: 'D', den: 0, chay: 2 }];</code></pre></details>
<pre><code class="language-javascript">// Bài 4: thêm chính sách THỨ BA (ưu tiên cao trước) — cơ chế không bị đụng tới
const jobs = [{ name: 'A', cost: 10, prio: 3 }, { name: 'B', cost: 2, prio: 1 }, { name: 'C', cost: 6, prio: 2 }, { name: 'D', cost: 2, prio: 4 }];
function runQueue(jobs, pickNext) {                       // CƠ CHẾ, y như trong bài
  const waiting = [...jobs]; let t = 0; const log = []; let totalWait = 0;
  while (waiting.length) {
    const job = waiting.splice(pickNext(waiting), 1)[0];
    totalWait += t; log.push(&#96;&#36;{job.name}@&#36;{t}&#96;); t += job.cost;
  }
  return { log, avgWait: totalWait / jobs.length };
}
const before = runQueue.toString();
const highestPriority = (q) =&gt; q.reduce((best, j, i) =&gt; (j.prio &lt; q[best].prio ? i : best), 0);   // số nhỏ = quan trọng
const r = runQueue(jobs, highestPriority);
console.log(&#96;priority policy: average wait = &#36;{r.avgWait}   order: &#36;{r.log.join(' ')}&#96;);
console.log(&#96;mechanism source unchanged: &#36;{before === runQueue.toString()}&#96;);</code></pre>
<div class="out">$ node chinh-sach-moi.js<br>
priority policy: average wait = 7 &nbsp;&nbsp;order: B@0 C@2 A@8 D@18<br>
mechanism source unchanged: true</div>
<pre class="trich"><code class="language-javascript">const highestPriority = (q) =&gt; q.reduce((best, j, i) =&gt; (j.prio &lt; q[best].prio ? i : best), 0);   // số nhỏ = quan trọng</code></pre>
<ul>
<li>(a) Chờ trung bình: đến trước làm trước <strong>10</strong>, ngắn nhất làm trước <strong>4</strong> (nhỏ nhất có thể với các việc này — cùng lý do SJF tối ưu ở bài 2), ưu tiên cao nhất trước <strong>7</strong> (thứ tự B, C, A, D). Chính sách ưu tiên không "tốt hơn" hay "tệ hơn" — nó tối ưu thứ khác: B và C, các việc quan trọng, bắt đầu ở 0 và 2.</li>
<li>(b) Chương trình in <code>mechanism source unchanged: true</code> bằng cách so mã nguồn của <code>runQueue</code> trước và sau — chính sách mới là một dòng truyền vào như một hàm. Trong hệ thống thật cùng hình dạng này là các lớp lập lịch của Linux, chuỗi <code>Filter</code> của servlet, hay bean <code>@Primary</code> của Spring: framework là cơ chế, lớp của bạn là chính sách.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — late binding you can see (20 min)</h3>
<p>A C program calls <code>time(NULL)</code>. (a) Where does the code of <code>time</code> come from, and when is the program bound to it? (b) Using only environment settings and a tiny shared library, make the <em>same, unchanged</em> binary see a different time. (c) Which binding time does that prove?</p>
<details><summary>Solution — run on this container</summary>
<div class="out"># Exercise 5: late binding made visible — the SAME program, a different time(), chosen at load time<br>
$ cat &gt; prog.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;time.h&gt;<br>
&gt; int main(void) { printf("time(NULL) = %ld\\n", (long) time(NULL) &gt; 1000000000L ? 1L : 0L); return 0; }<br>
&gt; END<br>
$ cat &gt; fake.c &lt;&lt;'END'<br>
&gt; #include &lt;time.h&gt;<br>
&gt; time_t time(time_t *t) { if (t) *t = 0; return 0; } &nbsp;&nbsp;/* our own time(): always the epoch */<br>
&gt; END<br>
$ gcc -o prog prog.c<br>
$ gcc -shared -fPIC -o fake.so fake.c<br>
# 1. normal run: the C library's time() is bound at load time<br>
$ ./prog<br>
time(NULL) = 1<br>
# 2. the loader is told to look in fake.so FIRST<br>
$ LD_PRELOAD=./fake.so ./prog<br>
time(NULL) = 0<br>
# the program binary did not change<br>
$ ./prog<br>
time(NULL) = 1</div>
<ul>
<li>(a) <code>time</code> lives in the shared C library (glibc); the executable only holds a <em>name</em> and a slot. The dynamic loader fills the slot when the program <strong>starts</strong> (load time), searching libraries in order.</li>
<li>(b) <code>LD_PRELOAD=./fake.so</code> tells the loader to search <code>fake.so</code> <em>first</em>. Our <code>time()</code> returned 0, so the program printed <code>time(NULL) = 0</code> instead of 1 (the test prints whether the clock looks like a real date). Running <code>./prog</code> again without the variable shows 1 — the binary never changed.</li>
<li>(c) <strong>Load-time binding</strong> (later than link time, earlier than a <code>dlopen</code> at run time): the name was resolved late enough to be interposed. This is how profilers, <code>fakeroot</code>, memory checkers and test tools work; it is also why <code>LD_PRELOAD</code> is ignored for setuid programs — late binding is flexible, and that flexibility is an attack surface.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — gắn kết muộn nhìn thấy được (20 phút)</h3>
<p>Một chương trình C gọi <code>time(NULL)</code>. (a) Mã của <code>time</code> đến từ đâu, và chương trình được gắn với nó lúc nào? (b) Chỉ dùng cài đặt môi trường và một thư viện chia sẻ bé xíu, làm cho <em>cùng một</em> tệp nhị phân <em>không đổi</em> thấy một thời gian khác. (c) Điều đó chứng minh thời điểm gắn kết nào?</p>
<details><summary>Lời giải — chạy trên container này</summary>
<div class="out"># Bài 5: gắn kết muộn nhìn thấy được — CÙNG một chương trình, time() khác, chọn lúc nạp<br>
$ cat &gt; prog.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;time.h&gt;<br>
&gt; int main(void) { printf("time(NULL) = %ld\\n", (long) time(NULL) &gt; 1000000000L ? 1L : 0L); return 0; }<br>
&gt; END<br>
$ cat &gt; fake.c &lt;&lt;'END'<br>
&gt; #include &lt;time.h&gt;<br>
&gt; time_t time(time_t *t) { if (t) *t = 0; return 0; } &nbsp;&nbsp;/* our own time(): always the epoch */<br>
&gt; END<br>
$ gcc -o prog prog.c<br>
$ gcc -shared -fPIC -o fake.so fake.c<br>
# 1. chạy thường: time() của thư viện C được gắn lúc nạp<br>
$ ./prog<br>
time(NULL) = 1<br>
# 2. bộ nạp được bảo tìm trong fake.so TRƯỚC<br>
$ LD_PRELOAD=./fake.so ./prog<br>
time(NULL) = 0<br>
# tệp chương trình không đổi<br>
$ ./prog<br>
time(NULL) = 1</div>
<ul>
<li>(a) <code>time</code> nằm trong thư viện C chia sẻ (glibc); tệp thực thi chỉ giữ một <em>cái tên</em> và một ô. Bộ nạp động điền ô khi chương trình <strong>khởi động</strong> (lúc nạp), tìm thư viện theo thứ tự.</li>
<li>(b) <code>LD_PRELOAD=./fake.so</code> bảo bộ nạp tìm <code>fake.so</code> <em>trước</em>. <code>time()</code> của ta trả 0, nên chương trình in <code>time(NULL) = 0</code> thay vì 1 (phép thử in ra đồng hồ có trông như ngày thật không). Chạy lại <code>./prog</code> không có biến cho ra 1 — tệp nhị phân chưa hề đổi.</li>
<li>(c) <strong>Gắn kết lúc nạp</strong> (muộn hơn lúc liên kết, sớm hơn <code>dlopen</code> lúc chạy): cái tên được phân giải đủ muộn để bị chen vào. Đây là cách các công cụ profiler, <code>fakeroot</code>, kiểm tra bộ nhớ và kiểm thử hoạt động; cũng là lý do <code>LD_PRELOAD</code> bị bỏ qua với chương trình setuid — gắn kết muộn linh hoạt, và sự linh hoạt ấy là một bề mặt tấn công.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — predict, then count the system calls (20 min)</h3>
<p>The command <code>dd if=/dev/zero of=/dev/null bs=B count=N</code> copies B × N bytes. Both runs below move 100,000 bytes: (1) <code>bs=1 count=100000</code>, (2) <code>bs=100000 count=1</code>. (a) Predict how many <code>read</code> and <code>write</code> system calls each makes. (b) Which is faster, and by what mechanism? (c) What does this say about "optimise the code" versus "reduce the crossings"?</p>
<details><summary>Solution — counted by strace on this container</summary>
<div class="out"># Exercise 7: predict, then count — system calls made by dd with a 1-byte and a 100000-byte block<br>
$ strace -c -e trace=read,write -o /tmp/a.txt dd if=/dev/zero of=/dev/null bs=1 count=100000 2&gt;/dev/null<br>
$ awk '$NF=="read" {print "bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;read calls = " $4}' /tmp/a.txt<br>
bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;read calls = 100001<br>
$ awk '$NF=="write" {print "bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;write calls = " $4}' /tmp/a.txt<br>
bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;write calls = 100003<br>
$ strace -c -e trace=read,write -o /tmp/b.txt dd if=/dev/zero of=/dev/null bs=100000 count=1 2&gt;/dev/null<br>
$ awk '$NF=="read" {print "bs=100000: read calls = " $4}' /tmp/b.txt<br>
bs=100000: read calls = 2<br>
$ awk '$NF=="write" {print "bs=100000: write calls = " $4}' /tmp/b.txt<br>
bs=100000: write calls = 4<br>
$ echo "bytes moved: 100000 in both cases"<br>
bytes moved: 100000 in both cases</div>
<ul>
<li>(a) With <code>bs=1</code>: one <code>read</code> and one <code>write</code> per byte — <strong>100,001 reads and 100,003 writes</strong> (the few extra calls are <code>dd</code>'s own start-up and its final statistics line). With one block of 100,000 bytes: <strong>2 reads and 4 writes</strong>, the same few extra calls. The data moved are identical.</li>
<li>(b) The second is far faster: every system call crosses into the kernel (lesson 12.A, slide 6: tens of nanoseconds up to microseconds each), and the first makes about 200,000 of them. A larger block <em>trades memory</em> (a 100,000-byte buffer) <em>for time</em> — the same trade as the stdio buffer in slide 10.</li>
<li>(c) Nothing in the <em>code</em> of <code>dd</code> got faster; the number of crossings fell by a factor of 50,000. Counting the right thing (system calls, not lines of code) is the whole skill of "measure before optimising". The cure for slow database code is similar: one query that returns 100 rows beats 100 queries that return one.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — đoán rồi đếm lời gọi hệ thống (20 phút)</h3>
<p>Lệnh <code>dd if=/dev/zero of=/dev/null bs=B count=N</code> chép B × N byte. Cả hai lần chạy dưới đây chuyển 100.000 byte: (1) <code>bs=1 count=100000</code>, (2) <code>bs=100000 count=1</code>. (a) Đoán mỗi lần tạo ra bao nhiêu lời gọi hệ thống <code>read</code> và <code>write</code>. (b) Lần nào nhanh hơn, và bằng cơ chế nào? (c) Điều này nói gì về "tối ưu mã" so với "giảm số lần vượt ranh giới"?</p>
<details><summary>Lời giải — strace đếm trên container này</summary>
<div class="out"># Bài 7: đoán rồi đếm — lời gọi hệ thống do dd tạo ra với khối 1 byte và khối 100000 byte<br>
$ strace -c -e trace=read,write -o /tmp/a.txt dd if=/dev/zero of=/dev/null bs=1 count=100000 2&gt;/dev/null<br>
$ awk '$NF=="read" {print "bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;read calls = " $4}' /tmp/a.txt<br>
bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;read calls = 100001<br>
$ awk '$NF=="write" {print "bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;write calls = " $4}' /tmp/a.txt<br>
bs=1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;write calls = 100003<br>
$ strace -c -e trace=read,write -o /tmp/b.txt dd if=/dev/zero of=/dev/null bs=100000 count=1 2&gt;/dev/null<br>
$ awk '$NF=="read" {print "bs=100000: read calls = " $4}' /tmp/b.txt<br>
bs=100000: read calls = 2<br>
$ awk '$NF=="write" {print "bs=100000: write calls = " $4}' /tmp/b.txt<br>
bs=100000: write calls = 4<br>
$ echo "bytes moved: 100000 in both cases"<br>
bytes moved: 100000 in both cases</div>
<ul>
<li>(a) Với <code>bs=1</code>: mỗi byte một <code>read</code> và một <code>write</code> — <strong>100.001 read và 100.003 write</strong> (vài lời gọi thừa là phần khởi động của chính <code>dd</code> và dòng thống kê cuối). Với một khối 100.000 byte: <strong>2 read và 4 write</strong>, cùng vài lời gọi thừa. Dữ liệu chuyển giống hệt nhau.</li>
<li>(b) Lần hai nhanh hơn nhiều: mỗi lời gọi hệ thống vượt vào nhân (bài 12.A, slide 6: từ hàng chục nano-giây tới micro-giây mỗi lần), và lần đầu tạo ra chừng 200.000 lần. Khối lớn hơn <em>đổi bộ nhớ</em> (bộ đệm 100.000 byte) <em>lấy thời gian</em> — cùng đánh đổi với bộ đệm stdio ở slide 10.</li>
<li>(c) Không có gì trong <em>mã</em> của <code>dd</code> nhanh hơn; số lần vượt ranh giới giảm 50.000 lần. Đếm đúng thứ (lời gọi hệ thống, không phải số dòng mã) là toàn bộ kỹ năng "đo trước khi tối ưu". Cách chữa mã cơ sở dữ liệu chậm cũng tương tự: một truy vấn trả 100 dòng thắng 100 truy vấn trả một dòng.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 8 — Brooks' arithmetic (15 min)</h3>
<p>(a) How many communication channels have teams of 6 and of 12 people? (b) A job needs 20 person-months, and 40% of it cannot be divided at all. How long does it take with 4 people, using time = s·W + (1 − s)·W / n? (c) The manager adds 4 more people to a project that is already late. Name two reasons it gets later, not earlier.</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/31fe7c3a78fc7926e80b56ec6131067e6779c0a7.svg" alt="Exercise 8: channels and months" loading="lazy" /><p class="chu-thich">🧮 Exercise 8: channels and months</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<ul>
<li>(a) n(n−1)/2: <strong>15</strong> channels for 6 people, <strong>66</strong> for 12 — double the people, more than four times the channels (4.4×).</li>
<li>(b) 0.4 × 20 + 0.6 × 20 / 4 = 8 + 3 = <strong>11 months</strong>. Even with unlimited people the time cannot go below the indivisible 8 months.</li>
<li>(c) (1) <em>Training</em>: the new people must be taught, which takes time from the experienced people who were already behind. (2) <em>Communication</em>: from 8 to 12 people the channels grow from 28 to 66 — more meetings, more misunderstandings. (3) A part of the work is indivisible and cannot be shared at all. Brooks' law: adding people to a late project makes it later — the cure is to cut scope or move the date.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 8 — phép tính của Brooks (15 phút)</h3>
<p>(a) Nhóm 6 người và nhóm 12 người có bao nhiêu kênh giao tiếp? (b) Một việc cần 20 tháng-người, và 40% của nó không chia được chút nào. Với 4 người mất bao lâu, theo thời gian = s·W + (1 − s)·W / n? (c) Quản lý thêm 4 người vào một dự án đã trễ. Nêu hai lý do nó trễ hơn chứ không sớm hơn.</p>
<details><summary>Lời giải — do bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/2da501915f551a9aec7f6c849375c0842d04755d.svg" alt="Bài 8: số kênh và số tháng" loading="lazy" /><p class="chu-thich">🧮 Bài 8: số kênh và số tháng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const PIXELS = 640 * 480, MAU_SO = 256;
const CHUOI = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2];</code></pre></details>
<ul>
<li>(a) n(n−1)/2: <strong>15</strong> kênh cho 6 người, <strong>66</strong> cho 12 người — gấp đôi số người, hơn bốn lần số kênh (4,4 lần).</li>
<li>(b) 0,4 × 20 + 0,6 × 20 / 4 = 8 + 3 = <strong>11 tháng</strong>. Ngay cả với vô hạn người, thời gian không xuống dưới 8 tháng không chia được.</li>
<li>(c) (1) <em>Đào tạo</em>: người mới phải được dạy, lấy thời gian của những người có kinh nghiệm vốn đã bị trễ. (2) <em>Giao tiếp</em>: từ 8 lên 12 người, số kênh tăng từ 28 lên 66 — thêm họp, thêm hiểu nhầm. (3) Một phần công việc không chia được và không thể chia sẻ. Luật Brooks: thêm người vào dự án trễ làm nó trễ hơn — cách chữa là cắt phạm vi hoặc dời ngày.</li>
</ul>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>design principle</strong></td><td>nguyên tắc thiết kế</td><td>A rule of thumb that has paid off often, such as "keep the interface simple"; principles can conflict, so the designer must choose.</td></tr>
<tr><td><strong>interface</strong></td><td>giao diện</td><td>The calls, data formats and rules through which other code uses a component; the most permanent part of a design.</td></tr>
<tr><td><strong>orthogonality</strong></td><td>tính trực giao</td><td>Features are independent: each does one job and combines freely with the others (fork and exec).</td></tr>
<tr><td><strong>mechanism / policy</strong></td><td>cơ chế / chính sách</td><td>The mechanism provides the means (a queue); the policy decides how they are used (which job next) and can be replaced without changing the mechanism.</td></tr>
<tr><td><strong>layered system</strong></td><td>hệ thống phân lớp</td><td>A structure in which each layer uses only the services of the layer directly below it.</td></tr>
<tr><td><strong>microkernel</strong></td><td>microkernel (nhân tối giản)</td><td>A kernel reduced to messages, scheduling and address spaces; drivers and servers run as user-mode processes.</td></tr>
<tr><td><strong>exokernel</strong></td><td>exokernel</td><td>A kernel that only protects and hands out raw resources; each application brings a library operating system.</td></tr>
<tr><td><strong>binding time</strong></td><td>thời điểm gắn kết</td><td>The moment a name is tied to what it names: compile, link, load or run time; earlier is faster, later is more flexible.</td></tr>
<tr><td><strong>static / dynamic structure</strong></td><td>cấu trúc tĩnh / động</td><td>Fixed size chosen at build time (simple, predictable) versus allocated and resized at run time (flexible, more complex).</td></tr>
<tr><td><strong>space–time trade-off</strong></td><td>đánh đổi không gian–thời gian</td><td>Spending memory to save time (lookup table, cache) or time to save memory (compression).</td></tr>
<tr><td><strong>cache / hit ratio</strong></td><td>bộ đệm / tỉ lệ trúng</td><td>A small fast store of copies of recently used data; the hit ratio is the fraction of requests found in it.</td></tr>
<tr><td><strong>stale entry / invalidation</strong></td><td>mục cũ / vô hiệu hoá</td><td>A cached copy that no longer matches the original; invalidation removes or updates it when the original changes.</td></tr>
<tr><td><strong>memoisation</strong></td><td>memoization (ghi nhớ kết quả hàm)</td><td>Caching the results of a function by its arguments so that each distinct call is computed once.</td></tr>
<tr><td><strong>Brooks' law</strong></td><td>luật Brooks</td><td>Adding people to a late software project makes it later; a team of n people has n(n−1)/2 communication channels.</td></tr>
<tr><td><strong>hypervisor</strong></td><td>hypervisor (bộ giám sát máy ảo)</td><td>The layer that shares the hardware among whole virtual machines, each with its own guest operating system.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>design principle</strong></td><td>nguyên tắc thiết kế</td><td>Quy tắc ngón tay cái đã nhiều lần sinh lời, như "giữ giao diện đơn giản"; các nguyên tắc có thể xung đột nên người thiết kế phải chọn.</td></tr>
<tr><td><strong>interface</strong></td><td>giao diện</td><td>Các lời gọi, định dạng dữ liệu và quy tắc để mã khác dùng một thành phần; phần bền vững nhất của một thiết kế.</td></tr>
<tr><td><strong>orthogonality</strong></td><td>tính trực giao</td><td>Các tính năng độc lập: mỗi cái làm một việc và ghép tự do với cái khác (fork và exec).</td></tr>
<tr><td><strong>mechanism / policy</strong></td><td>cơ chế / chính sách</td><td>Cơ chế cung cấp phương tiện (hàng đợi); chính sách quyết định cách dùng (việc nào kế tiếp) và thay được mà không đổi cơ chế.</td></tr>
<tr><td><strong>layered system</strong></td><td>hệ thống phân lớp</td><td>Cấu trúc trong đó mỗi tầng chỉ dùng dịch vụ của tầng ngay bên dưới.</td></tr>
<tr><td><strong>microkernel</strong></td><td>microkernel (nhân tối giản)</td><td>Nhân rút xuống tin nhắn, lập lịch và không gian địa chỉ; driver và máy chủ chạy như tiến trình chế độ người dùng.</td></tr>
<tr><td><strong>exokernel</strong></td><td>exokernel</td><td>Nhân chỉ bảo vệ và phát tài nguyên thô; mỗi ứng dụng mang theo một hệ điều hành thư viện.</td></tr>
<tr><td><strong>binding time</strong></td><td>thời điểm gắn kết</td><td>Lúc một tên được buộc vào vật nó chỉ: biên dịch, liên kết, nạp hay chạy; sớm thì nhanh, muộn thì linh hoạt.</td></tr>
<tr><td><strong>static / dynamic structure</strong></td><td>cấu trúc tĩnh / động</td><td>Cỡ cố định chọn lúc dựng (đơn giản, dự đoán được) so với cấp phát và đổi cỡ lúc chạy (linh hoạt, phức tạp hơn).</td></tr>
<tr><td><strong>space–time trade-off</strong></td><td>đánh đổi không gian–thời gian</td><td>Tốn bộ nhớ để tiết kiệm thời gian (bảng tra, bộ đệm) hoặc tốn thời gian để tiết kiệm bộ nhớ (nén).</td></tr>
<tr><td><strong>cache / hit ratio</strong></td><td>bộ đệm / tỉ lệ trúng</td><td>Kho nhỏ nhanh giữ bản sao dữ liệu vừa dùng; tỉ lệ trúng là phần yêu cầu tìm thấy trong đó.</td></tr>
<tr><td><strong>stale entry / invalidation</strong></td><td>mục cũ / vô hiệu hoá</td><td>Bản sao trong bộ đệm không còn khớp bản gốc; vô hiệu hoá xoá hoặc cập nhật nó khi bản gốc đổi.</td></tr>
<tr><td><strong>memoisation</strong></td><td>memoization (ghi nhớ kết quả hàm)</td><td>Đệm kết quả của hàm theo đối số để mỗi lời gọi khác nhau chỉ được tính một lần.</td></tr>
<tr><td><strong>Brooks' law</strong></td><td>luật Brooks</td><td>Thêm người vào dự án phần mềm trễ làm nó trễ hơn; nhóm n người có n(n−1)/2 kênh giao tiếp.</td></tr>
<tr><td><strong>hypervisor</strong></td><td>hypervisor (bộ giám sát máy ảo)</td><td>Lớp chia phần cứng giữa các máy ảo trọn vẹn, mỗi máy có HĐH khách riêng.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 12</h2>
<ol>
<li>A general-purpose OS has four goals: define <strong>abstractions</strong>, provide <strong>primitive operations</strong>, ensure <strong>isolation</strong>, manage the <strong>hardware</strong>. Design is hard because the system is huge, shared, concurrent, hostile-facing, compatible with the past and used in ways nobody predicted.</li>
<li>Judge an interface by <strong>simplicity, completeness, efficiency</strong> — they pull against each other. <strong>Orthogonal</strong> small parts (<code>fork</code> + <code>exec</code>) beat a big special-case call. The interface outlives the code behind it.</li>
<li><strong>Algorithmic</strong> code decides its own order; <strong>event-driven</strong> code reacts to events in the order they arrive (the <code>get_message</code> loop; Node, GUI). It is about who is in charge, not about threads.</li>
<li><strong>Structure:</strong> layered (clear, but costly crossings), microkernel (isolation and reliability, paid in messages — about 50× a system call in our measurement), exokernel (research), monolithic (fast, no information hiding). Microservices versus monolith is the same trade-off.</li>
<li><strong>Names</strong> map external (human) to internal (machine) names through a directory; <strong>binding time</strong> goes from compile to run time — early = fast, late = flexible. <strong>Static</strong> tables are simple and predictable but fixed; <strong>dynamic</strong> structures are flexible but complex.</li>
<li><strong>Hide the hardware</strong>: keep platform-specific code few, small and in known places (<code>config.h</code>, <code>arch/</code> directories, configuration files).</li>
<li><strong>Performance:</strong> measure before optimising. Space↔time trade-offs: lookup table, macro, compression; a bigger table can be slower. A <strong>cache</strong> works through locality; the average time is dominated by the misses; it must handle <strong>staleness</strong> (invalidation, TTL) and eviction (LRU).</li>
<li><strong>Projects:</strong> channels = n(n−1)/2; Brooks' law; the chief programmer team (one designer); a working system from day 1 (dummy procedures); <em>no silver bullet</em>. Trend: virtualization, containers (a shared kernel, not a VM) and the cloud.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 12</h2>
<ol>
<li>HĐH đa năng có bốn mục tiêu: định nghĩa <strong>khái niệm trừu tượng</strong>, cung cấp <strong>thao tác nguyên thuỷ</strong>, bảo đảm <strong>cô lập</strong>, quản lý <strong>phần cứng</strong>. Thiết kế khó vì hệ thống khổng lồ, dùng chung, đồng thời, đối mặt kẻ thù, tương thích với quá khứ và được dùng theo cách không ai dự đoán.</li>
<li>Đánh giá giao diện theo <strong>đơn giản, đầy đủ, hiệu quả</strong> — chúng kéo ngược nhau. Các phần nhỏ <strong>trực giao</strong> (<code>fork</code> + <code>exec</code>) thắng một lời gọi lớn nhiều trường hợp đặc biệt. Giao diện sống lâu hơn mã phía sau.</li>
<li>Mã <strong>thuật toán</strong> tự quyết thứ tự; mã <strong>hướng sự kiện</strong> phản ứng với sự kiện theo thứ tự chúng tới (vòng lặp <code>get_message</code>; Node, GUI). Đây là chuyện ai cầm lái, không phải chuyện luồng.</li>
<li><strong>Cấu trúc:</strong> phân lớp (rõ ràng, nhưng vượt tầng tốn kém), microkernel (cô lập và tin cậy, trả bằng tin nhắn — khoảng 50 lần một lời gọi hệ thống trong phép đo của ta), exokernel (nghiên cứu), nguyên khối (nhanh, không che thông tin). Microservices so với monolith là cùng đánh đổi.</li>
<li><strong>Tên</strong> ánh xạ tên ngoài (cho người) sang tên trong (cho máy) qua thư mục; <strong>thời điểm gắn kết</strong> từ biên dịch tới lúc chạy — sớm = nhanh, muộn = linh hoạt. Bảng <strong>tĩnh</strong> đơn giản, dự đoán được nhưng cố định; cấu trúc <strong>động</strong> linh hoạt nhưng phức tạp.</li>
<li><strong>Ẩn phần cứng</strong>: giữ mã riêng cho nền tảng ít, nhỏ và ở chỗ biết trước (<code>config.h</code>, thư mục <code>arch/</code>, tệp cấu hình).</li>
<li><strong>Hiệu năng:</strong> đo trước khi tối ưu. Đánh đổi không gian↔thời gian: bảng tra, macro, nén; bảng to hơn có thể chậm hơn. <strong>Bộ đệm</strong> hoạt động nhờ tính cục bộ; thời gian trung bình bị các lần trượt áp đảo; phải xử lý <strong>sự cũ</strong> (vô hiệu hoá, TTL) và việc đuổi mục (LRU).</li>
<li><strong>Dự án:</strong> số kênh = n(n−1)/2; luật Brooks; nhóm lập trình viên trưởng (một nhà thiết kế); hệ thống chạy được từ ngày 1 (thủ tục giả); <em>không có viên đạn bạc</em>. Xu hướng: ảo hoá, container (dùng chung nhân, không phải VM) và đám mây.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch12) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Which of the following is NOT a feature of a monolithic operating system?|||(Dạng câu FE) Điều nào sau đây KHÔNG phải đặc điểm của hệ điều hành nguyên khối?',
      options: ['The OS runs as a single program in kernel mode|||HĐH chạy như một chương trình duy nhất ở chế độ nhân', 'The OS is a collection of procedures linked into one large executable|||HĐH là một tập thủ tục được liên kết thành một tệp thực thi lớn', 'Information hiding: every procedure is hidden from every other procedure|||Che giấu thông tin: mỗi thủ tục được giấu khỏi mọi thủ tục khác', 'Any procedure may call any other procedure|||Thủ tục nào cũng có thể gọi thủ tục bất kỳ khác'],
      correctIndex: 2,
      points: 1,
      explanation: "In a monolithic kernel there is NO information hiding between procedures: every procedure may call every other one, which is what makes it fast and what makes it hard to verify (lesson 12.A, slide 6; book §1.7.1). A, B and D are the standard description. Warning: the bank has this question with different keys — FE12#6 \"information hiding\" (the answer here) but FE5#7 and FE14#8 \"organized as a hierarchy\"; the book says a monolithic system has no strict hierarchy either, so the question is ambiguous, and FE12#6's key matches the book best.|||Trong nhân nguyên khối KHÔNG có che giấu thông tin giữa các thủ tục: thủ tục nào cũng gọi được thủ tục khác, điều làm nó nhanh và cũng làm nó khó kiểm chứng (bài 12.A, slide 6; sách §1.7.1). A, B, D là mô tả chuẩn. Cảnh báo: ngân hàng có câu này với đáp án khác nhau — FE12#6 \"che giấu thông tin\" (đáp án ở đây) còn FE5#7 và FE14#8 \"tổ chức như một hệ phân cấp\"; sách nói hệ nguyên khối cũng không có phân cấp chặt, nên câu mơ hồ, và đáp án của FE12#6 hợp sách nhất." },
    { id: 'q2',
      question: '(FE question type) In what scenario is a microkernel-based structure advantageous compared with a monolithic one?|||(Dạng câu FE) Trong tình huống nào cấu trúc dựa trên microkernel có lợi hơn cấu trúc nguyên khối?',
      options: ['When every application needs direct access to the hardware|||Khi mọi ứng dụng cần truy cập trực tiếp phần cứng', 'When isolating faulty drivers and services from the kernel is crucial|||Khi việc cô lập driver và dịch vụ hỏng khỏi nhân là then chốt', 'When the fastest possible system calls are required|||Khi cần lời gọi hệ thống nhanh nhất có thể', 'When one big program should control everything|||Khi một chương trình lớn nên kiểm soát mọi thứ'],
      correctIndex: 1,
      points: 1,
      explanation: 'A microkernel runs drivers and servers as ordinary user-mode processes, so a crash in one of them does not take the kernel down (MINIX 3 even restarts the dead process) — isolation is its advantage. The price is messages between processes (about 56 times a system call in the measurement of lesson 12.A, slide 6), which is why C is the opposite of the truth, and A and D describe the monolithic style. FE10#2.|||Microkernel chạy driver và máy chủ như tiến trình chế độ người dùng thường, nên một cái sập không kéo nhân sập (MINIX 3 còn khởi động lại tiến trình chết) — cô lập là lợi thế của nó. Cái giá là tin nhắn giữa các tiến trình (khoảng 56 lần một lời gọi hệ thống trong phép đo ở bài 12.A, slide 6), nên C là ngược sự thật, còn A và D mô tả kiểu nguyên khối. FE10#2.' },
    { id: 'q3',
      question: 'A team has 10 people and every pair may need to talk to each other. How many communication channels exist?|||Một nhóm có 10 người và mỗi cặp có thể cần nói chuyện với nhau. Có bao nhiêu kênh giao tiếp?',
      options: ['45|||45', '100|||100', '20|||20', '90|||90'],
      correctIndex: 0,
      points: 1,
      explanation: "Computed by the simulator: n(n−1)/2 = 10 × 9 / 2 = 45. 90 is n(n−1) — it counts each pair twice (A→B and B→A); 100 is n²; 20 is 2n. Doubling the team to 20 gives 190, almost four times as many (Brooks' law, lesson 12.A, slide 15).|||Do bộ mô phỏng tính: n(n−1)/2 = 10 × 9 / 2 = 45. 90 là n(n−1) — đếm mỗi cặp hai lần (A→B và B→A); 100 là n²; 20 là 2n. Nhân đôi nhóm lên 20 người cho 190, gần gấp bốn (luật Brooks, bài 12.A, slide 15)." },
    { id: 'q4',
      question: 'An image has 16 pixels of 24 bits each and uses only 12 different colours. It is stored with a colour palette (12 entries of 24 bits) and one 8-bit index per pixel. How many bits does it take?|||Một ảnh có 16 điểm ảnh, mỗi điểm 24 bit, và chỉ dùng 12 màu khác nhau. Nó được lưu bằng bảng màu (12 mục, mỗi mục 24 bit) và một chỉ số 8 bit cho mỗi điểm ảnh. Cần bao nhiêu bit?',
      options: ['128|||128', '288|||288', '352|||352', '416|||416'],
      correctIndex: 3,
      points: 1,
      explanation: 'Computed by the simulator: indices 16 × 8 = 128 bits plus the palette 12 × 24 = 288 bits = 416 bits — MORE than the 16 × 24 = 384 bits of the raw image. 128 and 288 are each only one part; 352 is the total with 4-bit indices (a different question). A palette pays back only for larger images (lesson 12.A, slide 12).|||Do bộ mô phỏng tính: chỉ số 16 × 8 = 128 bit cộng bảng màu 12 × 24 = 288 bit = 416 bit — NHIỀU HƠN 16 × 24 = 384 bit của ảnh thô. 128 và 288 mỗi cái chỉ là một phần; 352 là tổng khi chỉ số 4 bit (một câu hỏi khác). Bảng màu chỉ hoàn vốn với ảnh lớn hơn (bài 12.A, slide 12).' },
    { id: 'q5',
      question: 'A cache access takes 100 ns and an access to the slow store takes 100,000 ns. With a hit ratio of 0.9, what is the average access time (average = h × cache time + (1 − h) × slow time)?|||Một lần truy cập bộ đệm tốn 100 ns và một lần truy cập kho chậm tốn 100.000 ns. Với tỉ lệ trúng 0,9, thời gian truy cập trung bình là bao nhiêu (trung bình = h × thời gian đệm + (1 − h) × thời gian chậm)?',
      options: ['100 ns|||100 ns', '1090 ns|||1090 ns', '10090 ns|||10090 ns', '90100 ns|||90100 ns'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: 0.9 × 100 + 0.1 × 100,000 = 90 + 10,000 = 10,090 ns. The 10 % of misses supplies 99% of the time; 1,090 ns would be a hit ratio of 0.99; 90,100 ns swaps h and 1 − h. Lesson 12.A, slide 13.|||Do bộ mô phỏng tính: 0,9 × 100 + 0,1 × 100.000 = 90 + 10.000 = 10.090 ns. 10 % trượt đóng góp 99% thời gian; 1.090 ns ứng với tỉ lệ trúng 0,99; 90.100 ns là đổi chỗ h và 1 − h. Bài 12.A, slide 13.' },
    { id: 'q6',
      question: 'A cache holds 3 entries and uses LRU replacement. Starting empty, the requests are 1 2 3 1 4 1 2 5 1 2. How many requests are hits?|||Một bộ đệm chứa 3 mục và dùng thay thế LRU. Bắt đầu trống, các yêu cầu là 1 2 3 1 4 1 2 5 1 2. Có bao nhiêu yêu cầu là trúng?',
      options: ['4|||4', '3|||3', '5|||5', '6|||6'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by a program: the hits are the second 1, the third 1, the second 2 and the last 1 or 2 — 4 hits and 6 misses (FIFO gets 3 hits, and OPT, which looks into the future, gets 5 — the best any cache could do). Each request that finds its number in the 3 recent entries is a hit; 4 evicts 2 and 5 evicts 3 in the order LRU decides. Lesson 12.A, slide 14; practice 12.B, exercise 4.|||Do chương trình tính: các lần trúng là số 1 thứ hai, số 1 thứ ba, số 2 thứ hai và lần cuối — 4 lần trúng và 6 lần trượt (FIFO được 3 lần trúng, và OPT, thứ nhìn vào tương lai, được 5 — mức tốt nhất mà một bộ đệm có thể đạt). Mỗi yêu cầu thấy số của nó trong 3 mục gần đây là trúng; 4 và 5 đuổi các mục theo thứ tự LRU quyết định. Bài 12.A, slide 14; bài tập 12.B, bài 4.' },
    { id: 'q7',
      question: 'Which statement separates MECHANISM from POLICY correctly?|||Phát biểu nào phân biệt đúng CƠ CHẾ với CHÍNH SÁCH?',
      options: ['A mechanism decides which job runs; a policy is the queue that stores jobs|||Cơ chế quyết định việc nào chạy; chính sách là hàng đợi lưu các việc', 'A mechanism is always in the kernel; a policy is always in a library|||Cơ chế luôn ở trong nhân; chính sách luôn ở trong thư viện', 'A mechanism is the algorithm; a policy is the hardware it runs on|||Cơ chế là thuật toán; chính sách là phần cứng nó chạy trên đó', 'A mechanism provides the means (a queue, a switch); a policy decides how they are used (which job next) and can be replaced without touching the mechanism|||Cơ chế cung cấp phương tiện (hàng đợi, công tắc); chính sách quyết định dùng chúng thế nào (việc nào kế tiếp) và thay được mà không động tới cơ chế'],
      correctIndex: 3,
      points: 1,
      explanation: "Mechanism = the means, policy = the decision about their use. The job queue is the mechanism; \"oldest first\" or \"shortest first\" is the policy — the lesson's code ran two policies on one unchanged queue (average wait 10 and 4), and practice exercise 5 adds a third. A has the roles reversed; B and C invent a location or a hardware meaning. Lesson 12.A, slide 6.|||Cơ chế = phương tiện, chính sách = quyết định về cách dùng chúng. Hàng đợi việc là cơ chế; \"đến trước làm trước\" hay \"ngắn nhất làm trước\" là chính sách — mã trong bài chạy hai chính sách trên một hàng đợi không đổi (chờ trung bình 10 và 4), và bài tập 5 thêm chính sách thứ ba. A đảo vai; B và C bịa ra một vị trí hay một nghĩa phần cứng. Bài 12.A, slide 6." },
    { id: 'q8',
      question: 'A host program is compiled once and loads one of several plugins by name when it starts (dlopen). When is the choice of plugin bound?|||Một chương trình chủ được dịch một lần và nạp một trong nhiều plugin theo tên khi khởi động (dlopen). Lựa chọn plugin được gắn kết lúc nào?',
      options: ['At compile time|||Lúc biên dịch', 'At run time (late binding)|||Lúc chạy (gắn kết muộn)', 'At link time|||Lúc liên kết', 'When the hardware is designed|||Lúc thiết kế phần cứng'],
      correctIndex: 1,
      points: 1,
      explanation: "The name is only known when the program runs, so the binding happens at run time — late binding. The lesson's host binary did not even list the plugins among its libraries (ldd counted 0), and a missing plugin was found only at run time. Early binding (compile or link time) is faster and lets tools check; late binding is flexible. Lesson 12.A, slide 7; practice exercise 6.|||Tên chỉ biết khi chương trình chạy, nên việc gắn kết xảy ra lúc chạy — gắn kết muộn. Tệp chủ trong bài thậm chí không liệt kê plugin trong các thư viện của nó (ldd đếm 0), và plugin thiếu chỉ bị phát hiện lúc chạy. Gắn kết sớm (lúc biên dịch hay liên kết) nhanh hơn và cho công cụ kiểm tra; gắn kết muộn linh hoạt. Bài 12.A, slide 7; bài tập 6." },
    { id: 'q9',
      question: 'A job needs 12 person-months of work; a quarter of it cannot be divided between people. With 12 people, how many months does it take (time = s·W + (1 − s)·W / n)?|||Một việc cần 12 tháng-người; một phần tư của nó không chia được giữa nhiều người. Với 12 người thì mất bao nhiêu tháng (thời gian = s·W + (1 − s)·W / n)?',
      options: ['3.75|||3,75', '1|||1', '3|||3', '6|||6'],
      correctIndex: 0,
      points: 1,
      explanation: "Computed by the simulator: 0.25 × 12 + 0.75 × 12 / 12 = 3 + 0.75 = 3.75 months. The answer 1 assumes everything divides (12 / 12); 3 is the floor that no number of people can break; 6 would be 12 / 2. Twelve people save only 8.25 of the 12 months — Brooks' arithmetic (lesson 12.A, slide 15, second graph).|||Do bộ mô phỏng tính: 0,25 × 12 + 0,75 × 12 / 12 = 3 + 0,75 = 3,75 tháng. Đáp án 1 giả sử mọi thứ chia được (12 / 12); 3 là mức sàn mà số người nào cũng không phá được; 6 sẽ là 12 / 2. Mười hai người chỉ tiết kiệm 8,25 trong 12 tháng — phép tính của Brooks (bài 12.A, slide 15, đồ thị thứ hai)." },
    { id: 'q10',
      question: 'A file-system cache says "/usr/ast/mbox is i-node 60", but the file was deleted and its i-node reused. What is this problem called and what is a standard remedy?|||Một bộ đệm của hệ thống tệp nói "/usr/ast/mbox là i-node 60", nhưng tệp đã bị xoá và i-node được dùng lại. Vấn đề này gọi là gì và cách chữa chuẩn là gì?',
      options: ['A cache miss; make the cache bigger|||Trượt bộ đệm; làm bộ đệm to hơn', 'A page fault; swap the page in|||Lỗi trang; nạp trang vào', 'A stale entry; invalidate the entry when the original changes, or limit its lifetime (TTL)|||Mục bị cũ; vô hiệu hoá mục khi bản gốc đổi, hoặc giới hạn thời gian sống (TTL)', 'A deadlock; order the locks|||Bế tắc; sắp thứ tự khoá'],
      correctIndex: 2,
      points: 1,
      explanation: "A cached copy that no longer matches the original is STALE. The cure is invalidation (remove or update the entry when the original changes), write-through, or a time limit (TTL) that bounds how long a stale answer can be served — in the lesson's fake-clock program one stale answer was served before the entry expired. A bigger cache does not fix wrong data; page faults and deadlocks are different problems. Lesson 12.A, slide 14.|||Bản sao trong bộ đệm không còn khớp bản gốc là CŨ (stale). Cách chữa là vô hiệu hoá (xoá hoặc cập nhật mục khi bản gốc đổi), ghi xuyên, hoặc giới hạn thời gian (TTL) chặn trên thời gian một đáp án cũ còn được trả — trong chương trình đồng hồ giả ở bài, một đáp án cũ đã được trả trước khi mục hết hạn. Bộ đệm to hơn không sửa được dữ liệu sai; lỗi trang và bế tắc là vấn đề khác. Bài 12.A, slide 14." },
  ],
};

const QUIZ_LESSON = {
  title: 'Chapter 12 Quiz|||Quiz chương 12',
  slug: 'osg202-quiz-ch12',
  type: 'QUIZ',
  description: '10 câu ôn Chương 12 theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán kiểm bằng mô phỏng hoặc chương trình chạy thật: đặc điểm hệ nguyên khối, lợi thế microkernel, số kênh giao tiếp của nhóm, kích thước ảnh dùng bảng màu, thời gian truy cập trung bình của bộ đệm, đếm lần trúng LRU, phân biệt cơ chế và chính sách, gắn kết muộn, thời gian dự án theo luật Brooks và bộ đệm bị cũ.',
  quiz: QUIZ,
};

export default {
  slides: [L_osg12_1],
  practice: L_on_ch12,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 12 theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán kiểm bằng mô phỏng hoặc chương trình chạy thật: đặc điểm hệ nguyên khối, lợi thế microkernel, số kênh giao tiếp của nhóm, kích thước ảnh dùng bảng màu, thời gian truy cập trung bình của bộ đệm, đếm lần trúng LRU, phân biệt cơ chế và chính sách, gắn kết muộn, thời gian dự án theo luật Brooks và bộ đệm bị cũ.',
  quizLesson: QUIZ_LESSON,
  lessons: [L_osg12_1, L_on_ch12, QUIZ_LESSON],
};
