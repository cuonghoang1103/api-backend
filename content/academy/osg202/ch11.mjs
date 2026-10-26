/**
 * OSG202 · Chương 11 — Case Study 2: Windows 8 (osg11: 11.A 1–27, 11.B 28–64).
 * Bài 📑 học theo từng slide: osg11 (tmp_11.pptx, slide 1–64).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: osg202-on-ch11.
 * Quiz MỚI (10 câu, slug osg202-quiz-ch11).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 11.A — 📑 Slide by slide · Windows: history, API layers, registry, NT structure, object manager (slides 1–27) ───────── */
const L_osg11_1 = {
  title: '11.A — 📑 Slide by slide · Windows: history, API layers, registry, NT structure, object manager (slides 1–27)|||11.A — 📑 Học theo từng slide · Windows: lịch sử, tầng API, registry, cấu trúc NT, object manager (slide 1–27)',
  slug: 'osg202-slide-osg11-1',
  type: 'VIDEO',
  description: 'Giảng đủ 27 slide đầu Chương 11 (Tanenbaum, Modern Operating Systems 4e) — chủ đề thuyết trình của môn: lịch sử Windows từ MS-DOS tới dòng NT, các tầng lập trình (Win32, WinRT, .NET, API gốc NT), registry, cấu trúc nhân (HAL, kernel, executive, driver), trình quản lý đối tượng, handle và không gian tên. Windows không chạy được trong runner Linux, nên mỗi khái niệm được vẽ bằng sơ đồ và đặt cạnh một họ hàng Linux CHẠY THẬT (file descriptor, /proc/sys, strace, cgroup…), kèm cập nhật Windows 10/11, WSL 2 và Windows Server có nguồn learn.microsoft.com.',
  content: [
    bi(`<span class="eyebrow">Chapter 11 · Lesson 11.A · deck "Chapter 11 · Case Study 2: Windows 8", slides 1–27</span>
<h2>Windows from the inside: one design, thirty years, and the same ideas you already know</h2>
<p class="lead">Chapter 11 of Tanenbaum &amp; Bos is a full case study of <strong>Windows</strong> — the other big operating-system family next to UNIX/Linux. It is also one of the three official <strong>presentation topics</strong> of OSG202 (with Chapter 7 virtualization and Chapter 10 Linux/Android). The deck was written for <strong>Windows 8 / 8.1 (2012–2013)</strong>; this lesson explains it slide by slide and then brings it up to date with <strong>Windows 10, Windows 11 and Windows Server</strong>, citing Microsoft's own documentation (learn.microsoft.com).</p>
<p>A practical problem first: <strong>our lab runs Linux</strong>, so we cannot run Windows code here. Instead every Windows idea is shown in three ways: a <strong>diagram</strong> (PlantUML), a <strong>table</strong> that puts it beside its Linux cousin, and a <strong>real program that runs on Linux</strong> and shows the cousin working. A Windows <em>handle</em> becomes a Linux file descriptor you can list in <code>/proc/self/fd</code>; a <em>job object</em> becomes a cgroup you create and kill; a <em>fiber</em> becomes a user-mode context switch (and a Java 21 virtual thread); the <em>registry</em> becomes <code>/proc/sys</code> and <code>/etc</code>; an NTFS <em>alternate data stream</em> becomes an extended attribute; an <em>access token</em> becomes your uid, gids and capabilities. Where Windows really differs, we say so.</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>11.1 History</td><td>tell the two Windows lineages apart (MS-DOS line, NT line), say who David Cutler is, and say why one Win32 API survived 30 years</td></tr>
<tr><td>5–9</td><td>11.2 Programming Windows</td><td>draw the layers apps → subsystem DLLs → ntdll → kernel, say what Win32, WinRT, .NET and the native NT API each are, and trace CreateFile down to NtCreateFile</td></tr>
<tr><td>10–11</td><td>11.2.3 The registry</td><td>name the hives, say what lives in HKLM and HKCU, and explain how Linux stores the same information</td></tr>
<tr><td>12–16</td><td>11.3 System structure</td><td>place HAL, kernel layer, executive, drivers and the hypervisor, and explain dispatcher objects and driver stacks</td></tr>
<tr><td>17–27</td><td>11.3.3 Object manager</td><td>explain objects, handles, the handle table (16 million), the object name space and the ten steps of opening a file</td></tr>
</tbody>
</table>
<div class="callout">Earlier lessons come back here: system calls (lesson 1.B), processes and threads (Chapter 2), virtual memory (Chapter 3), file systems (Chapter 4) and I/O (Chapter 5). The older web lessons are not repeated; lesson 11.B continues with processes, memory, I/O, NTFS and security. Both lessons end with the 20-minute presentation outline at the end of 11.B.</div>`,
    `<span class="eyebrow">Chương 11 · Bài 11.A · deck "Chapter 11 · Case Study 2: Windows 8", slide 1–27</span>
<h2>Windows nhìn từ bên trong: một thiết kế, ba mươi năm, và những ý tưởng bạn đã biết</h2>
<p class="lead">Chương 11 của Tanenbaum &amp; Bos là một ca nghiên cứu đầy đủ về <strong>Windows</strong> — họ hệ điều hành lớn còn lại bên cạnh UNIX/Linux. Đây cũng là một trong ba <strong>chủ đề thuyết trình</strong> chính thức của OSG202 (cùng Chương 7 ảo hoá và Chương 10 Linux/Android). Bộ slide viết cho <strong>Windows 8 / 8.1 (2012–2013)</strong>; bài này giải thích từng slide rồi cập nhật lên <strong>Windows 10, Windows 11 và Windows Server</strong>, dẫn tài liệu chính thức của Microsoft (learn.microsoft.com).</p>
<p>Một vấn đề thực tế trước: <strong>phòng thí nghiệm của ta chạy Linux</strong>, nên không chạy được mã Windows ở đây. Vì vậy mỗi ý tưởng Windows được thể hiện bằng ba cách: một <strong>sơ đồ</strong> (PlantUML), một <strong>bảng</strong> đặt nó cạnh họ hàng Linux, và một <strong>chương trình thật chạy trên Linux</strong> cho thấy họ hàng đó hoạt động. <em>Handle</em> của Windows thành file descriptor của Linux mà bạn liệt kê được ở <code>/proc/self/fd</code>; <em>job object</em> thành cgroup bạn tạo rồi giết; <em>fiber</em> thành cú chuyển ngữ cảnh ở chế độ người dùng (và luồng ảo của Java 21); <em>registry</em> thành <code>/proc/sys</code> và <code>/etc</code>; <em>luồng dữ liệu phụ</em> của NTFS thành thuộc tính mở rộng (xattr); <em>access token</em> thành uid, gid và capability của bạn. Chỗ nào Windows thật sự khác, bài nói thẳng.</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>11.1 Lịch sử</td><td>phân biệt hai dòng Windows (dòng MS-DOS, dòng NT), nói David Cutler là ai, và vì sao một Win32 API sống được 30 năm</td></tr>
<tr><td>5–9</td><td>11.2 Lập trình Windows</td><td>vẽ các tầng ứng dụng → DLL hệ thống con → ntdll → nhân, nói Win32, WinRT, .NET và API gốc NT mỗi thứ là gì, và lần theo CreateFile xuống NtCreateFile</td></tr>
<tr><td>10–11</td><td>11.2.3 Registry</td><td>kể tên các hive, nói HKLM và HKCU chứa gì, và giải thích Linux lưu cùng thông tin đó ở đâu</td></tr>
<tr><td>12–16</td><td>11.3 Cấu trúc hệ thống</td><td>xếp HAL, tầng kernel, executive, driver và hypervisor vào đúng chỗ, giải thích dispatcher object và chồng driver</td></tr>
<tr><td>17–27</td><td>11.3.3 Object manager</td><td>giải thích đối tượng, handle, bảng handle (16 triệu), không gian tên đối tượng và mười bước mở một tệp</td></tr>
</tbody>
</table>
<div class="callout">Các bài trước quay lại ở đây: lời gọi hệ thống (bài 1.B), tiến trình và luồng (Chương 2), bộ nhớ ảo (Chương 3), hệ thống tệp (Chương 4) và I/O (Chương 5). Không lặp lại các bài web cũ; bài 11.B đi tiếp với tiến trình, bộ nhớ, I/O, NTFS và bảo mật. Dàn ý thuyết trình 20 phút nằm ở cuối bài 11.B.</div>`),
    walkHead('osg11', 1, 27),
    walk('osg11', [
      [1, 'Case Study 2: Windows 8',
        `<p class="y-chinh">🎯 Chapter 11 studies <strong>Windows</strong> the way Chapter 10 studies Linux: one real system, from the API a programmer sees down to the structures inside the kernel. The title says "Windows 8", but the design you will learn is the <strong>NT design</strong>, still the core of Windows 10, Windows 11 and Windows Server today.</p>
<p>Think of two restaurants that serve the same food. Linux is a kitchen with an open counter: every tool is on the wall, everything is a file or a text setting, and customers may walk in and look. Windows is a kitchen behind a pass-through window: you place an order with a form (<em>the API</em>), the staff (<em>the executive</em>) hand back a numbered ticket (<em>a handle</em>), and everything inside is an <strong>object</strong> with an owner, a name and a list of who may touch it. Both kitchens cook the same dishes — processes, threads, memory, files — but they organise the pantry differently, and a good engineer can work in either.</p>
<p>Why a backend developer needs Windows knowledge, concretely: most laptops in your class run Windows, so you will write Node.js or Spring Boot code on Windows and deploy it to Linux. That crossing is where bugs live — line endings, file names, file permissions, paths, file locking. Many companies also run <strong>.NET and IIS</strong> on Windows Server, and the two biggest clouds both rent Windows machines. This lesson ends each topic with a 🧭 box about exactly that crossing.</p>
<table>
<thead><tr><th>Windows idea (this chapter)</th><th>Linux cousin (runs in our lab)</th><th>Where you see it</th></tr></thead>
<tbody>
<tr><td>handle</td><td>file descriptor (<code>/proc/self/fd</code>)</td><td>slides 18–19</td></tr>
<tr><td>job object</td><td>cgroup</td><td>slide 28</td></tr>
<tr><td>fiber / user-mode scheduling</td><td><code>ucontext</code>, Java virtual thread</td><td>slides 29–30</td></tr>
<tr><td>thread priority 0–31</td><td>nice −20…19 and real-time 1–99</td><td>slides 36–39</td></tr>
<tr><td>registry</td><td><code>/proc/sys</code> and <code>/etc</code></td><td>slides 10–11</td></tr>
<tr><td>I/O request packet (IRP)</td><td>system call through VFS → file system → block layer</td><td>slides 50–52</td></tr>
<tr><td>MFT record, run list</td><td>inode, extent list</td><td>slides 53–57</td></tr>
<tr><td>alternate data stream</td><td>extended attribute (xattr)</td><td>slide 54</td></tr>
<tr><td>access token, SID, ACL</td><td>uid/gid, capabilities, mode bits</td><td>slides 59–62</td></tr>
</tbody>
</table>
<p class="meo">🧠 For the exam, memorise the <em>vocabulary</em> (executive, HAL, object manager, handle, IRP, MFT, token). For the presentation, memorise one <em>comparison</em> per topic from the table above — an audience remembers "a handle is a file descriptor that works for every kind of object" far better than a list of structure fields.</p>`,
        `<p class="y-chinh">🎯 Chương 11 nghiên cứu <strong>Windows</strong> như Chương 10 nghiên cứu Linux: một hệ thống thật, từ API lập trình viên thấy xuống tận cấu trúc trong nhân. Tiêu đề ghi "Windows 8", nhưng thiết kế bạn học là <strong>thiết kế NT</strong>, vẫn là lõi của Windows 10, Windows 11 và Windows Server ngày nay.</p>
<p>Hình dung hai nhà hàng bán cùng món. Linux là căn bếp mở: mọi dụng cụ treo trên tường, mọi thứ là tệp hay dòng chữ cấu hình, khách bước vào xem được. Windows là căn bếp sau ô cửa: bạn đặt món bằng một phiếu (<em>API</em>), nhân viên (<em>executive</em>) đưa lại một phiếu số (<em>handle</em>), và mọi thứ bên trong là một <strong>đối tượng</strong> có chủ, có tên và có danh sách ai được chạm vào. Cả hai bếp nấu cùng món — tiến trình, luồng, bộ nhớ, tệp — nhưng xếp kho khác nhau, và kỹ sư giỏi làm được ở cả hai.</p>
<p>Vì sao dev backend cần biết Windows, cụ thể: đa số laptop trong lớp chạy Windows, nên bạn viết Node.js hay Spring Boot trên Windows rồi triển khai lên Linux. Chỗ chuyển qua đó là nơi lỗi sinh ra — ký tự xuống dòng, tên tệp, quyền tệp, đường dẫn, khoá tệp. Nhiều công ty còn chạy <strong>.NET và IIS</strong> trên Windows Server, và hai đám mây lớn nhất đều cho thuê máy Windows. Cuối mỗi chủ đề bài này có một ô 🧭 về đúng chỗ chuyển qua đó.</p>
<table>
<thead><tr><th>Ý tưởng Windows (chương này)</th><th>Họ hàng Linux (chạy trong lab)</th><th>Xem ở</th></tr></thead>
<tbody>
<tr><td>handle</td><td>file descriptor (<code>/proc/self/fd</code>)</td><td>slide 18–19</td></tr>
<tr><td>job object</td><td>cgroup</td><td>slide 28</td></tr>
<tr><td>fiber / lập lịch chế độ người dùng</td><td><code>ucontext</code>, luồng ảo Java</td><td>slide 29–30</td></tr>
<tr><td>ưu tiên luồng 0–31</td><td>nice −20…19 và thời gian thực 1–99</td><td>slide 36–39</td></tr>
<tr><td>registry</td><td><code>/proc/sys</code> và <code>/etc</code></td><td>slide 10–11</td></tr>
<tr><td>I/O request packet (IRP)</td><td>lời gọi hệ thống qua VFS → hệ thống tệp → tầng khối</td><td>slide 50–52</td></tr>
<tr><td>bản ghi MFT, danh sách run</td><td>inode, danh sách extent</td><td>slide 53–57</td></tr>
<tr><td>luồng dữ liệu phụ</td><td>thuộc tính mở rộng (xattr)</td><td>slide 54</td></tr>
<tr><td>access token, SID, ACL</td><td>uid/gid, capability, bit quyền</td><td>slide 59–62</td></tr>
</tbody>
</table>
<p class="meo">🧠 Cho kỳ thi, hãy nhớ <em>từ vựng</em> (executive, HAL, object manager, handle, IRP, MFT, token). Cho buổi thuyết trình, hãy nhớ một <em>phép so sánh</em> cho mỗi chủ đề trong bảng trên — khán giả nhớ "handle là file descriptor dùng được cho mọi loại đối tượng" tốt hơn nhiều so với danh sách trường cấu trúc.</p>`],
      [2, 'History of Windows through Windows 8.1',
        `<p class="y-chinh">🎯 Figure 11-1 lists Microsoft's desktop releases as <strong>two lineages</strong>: the <em>MS-DOS-based</em> line (Windows 1–3, then 95, 98, Me) and the <strong>NT-based</strong> line (NT 3.1 in 1993, NT 4.0, 2000, XP, Vista, 7, 8, 8.1). The MS-DOS line ended with Windows Me (2000); XP (2001) put everybody on the NT line. Everything in this chapter is about the NT line.</p>
<p>Imagine a family business that sells cars. For years it sells a quick, cheap model built on an old chassis (MS-DOS): it starts fast, but one bad passenger can crash the whole car because nothing separates the passengers. In parallel it develops a heavy, safe model built from scratch (NT) with seat belts, locks and separate compartments. By 2001 the safe model became cheap enough that the old chassis was retired. Customers never saw the change because the dashboard — the <strong>Win32 API</strong> — stayed the same. That is the whole story of this slide.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/a6deafe1dc871ef4d93da72145ef8ebe39b52126.svg" alt="Figure 11-1 redrawn as two lineages: the MS-DOS line ends at Windows Me, the NT line continues to Windows 11" loading="lazy" /><p class="chu-thich">🧩 Figure 11-1 redrawn as two lineages: the MS-DOS line ends at Windows Me, the NT line continues to Windows 11</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 11-1 redrawn as two lineages: the MS-DOS line died with Windows Me; the NT line (David Cutler) became every modern Windows
left to right direction
rectangle "MS-DOS line\\n(16/32-bit, no protection)" as DOS {
  rectangle "MS-DOS 1.0\\n1981" as d1
  rectangle "Windows 1.x–3.x\\n(runs ON DOS)" as w3
  rectangle "Windows 95 / 98 / Me\\n1995 – 2000" as w9
  d1 --&gt; w3
  w3 --&gt; w9
}
rectangle "NT line\\n(32/64-bit, from scratch)" as NT {
  rectangle "VAX/VMS, Mica\\n(Cutler at DEC)" as vms
  rectangle "NT 3.1 (1993)\\nNT 4.0 (1996)" as nt3
  rectangle "2000 · XP · Vista\\n7 (2009)" as xp
  rectangle "8 / 8.1\\n(2012 / 2013)" as w8
  rectangle "10 (2015)\\n11 (2021)\\nWindows Server" as w10
  vms --&gt; nt3
  nt3 --&gt; xp
  xp --&gt; w8
  w8 --&gt; w10
}
w9 ..&gt; xp : "XP replaces 98 (2001)"
note bottom of NT : one kernel design for 30+ years:\\nWin32 API on top, NT executive below
@enduml</code></pre></details>
<p>Notes on the table, because it is a classic exam source: <strong>1981</strong> MS-DOS 1.0 for the IBM PC; <strong>1990</strong> Windows 3.0 ("ten million copies in two years"); <strong>1995</strong> Windows 95 (MS-DOS embedded inside); <strong>2000</strong> Windows 2000 (NT-based) and Windows Me (the last MS-DOS-based, "inferior to Win 98" — the book is blunt); <strong>2001</strong> XP replaces 98; <strong>2006</strong> Vista ("could not supplant XP"); <strong>2009</strong> Windows 7 ("significantly improved upon Vista"); <strong>2012</strong> Windows 8, the first with the "Modern" interface; <strong>2013</strong> Windows 8.1 and a move to rapid releases.</p>
<p><strong>➕ Update — what happened after the slide (sources: Microsoft Lifecycle pages on learn.microsoft.com, read 26/10/2026).</strong> Windows 8.1 started on 13 Nov 2013 and reached end of support on <strong>10 Jan 2023</strong>. <strong>Windows 10</strong> started on <strong>29 Jul 2015</strong>; Microsoft states that version 22H2 is the final version and that support ended on <strong>14 Oct 2025</strong> (the lifecycle table lists 15 Oct 2025 06:59 UTC, which is 14 Oct in Redmond). <strong>Windows 11</strong> started on <strong>4 Oct 2021</strong> (Pacific time) and is still in support. Microsoft now ships a yearly feature update (the lifecycle page lists 24H2 on 1 Oct 2024 and 25H2 on 30 Sep 2025). The server line continued in parallel: the Windows containers page lists Windows Server 2016, 2019, 2022 and 2025.</p>
<p class="pitfall">⚠️ The slide stops at 2013, so any exam answer "the latest Windows is 8.1" is only right <em>inside the book</em>. Also: "Windows is an operating system" hides the fact that the MS-DOS line and the NT line share almost no kernel code — only the API on top is shared.</p>`,
        `<p class="y-chinh">🎯 Hình 11-1 liệt kê các bản phát hành Windows cho máy để bàn thành <strong>hai dòng</strong>: dòng <em>dựa trên MS-DOS</em> (Windows 1–3, rồi 95, 98, Me) và dòng <strong>dựa trên NT</strong> (NT 3.1 năm 1993, NT 4.0, 2000, XP, Vista, 7, 8, 8.1). Dòng MS-DOS kết thúc ở Windows Me (2000); XP (2001) đưa mọi người sang dòng NT. Mọi thứ trong chương này là về dòng NT.</p>
<p>Hình dung một hãng bán xe. Nhiều năm hãng bán một mẫu nhanh, rẻ dựng trên khung cũ (MS-DOS): nổ máy nhanh, nhưng một hành khách xấu có thể làm hỏng cả xe vì không có gì ngăn cách các hành khách. Song song hãng phát triển một mẫu nặng, an toàn dựng từ đầu (NT) có dây an toàn, khoá và khoang riêng. Đến 2001 mẫu an toàn đủ rẻ nên khung cũ bị loại. Khách hàng không thấy thay đổi vì bảng đồng hồ — <strong>Win32 API</strong> — vẫn như cũ. Đó là toàn bộ câu chuyện của slide này.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/a6deafe1dc871ef4d93da72145ef8ebe39b52126.svg" alt="Hình 11-1 vẽ lại thành hai dòng: dòng MS-DOS kết thúc ở Windows Me, dòng NT đi tiếp tới Windows 11" loading="lazy" /><p class="chu-thich">🧩 Hình 11-1 vẽ lại thành hai dòng: dòng MS-DOS kết thúc ở Windows Me, dòng NT đi tiếp tới Windows 11</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-1 vẽ lại thành hai dòng: dòng MS-DOS chết cùng Windows Me; dòng NT (David Cutler) thành mọi Windows hiện đại
left to right direction
rectangle "MS-DOS line\\n(16/32-bit, no protection)" as DOS {
  rectangle "MS-DOS 1.0\\n1981" as d1
  rectangle "Windows 1.x–3.x\\n(runs ON DOS)" as w3
  rectangle "Windows 95 / 98 / Me\\n1995 – 2000" as w9
  d1 --&gt; w3
  w3 --&gt; w9
}
rectangle "NT line\\n(32/64-bit, from scratch)" as NT {
  rectangle "VAX/VMS, Mica\\n(Cutler at DEC)" as vms
  rectangle "NT 3.1 (1993)\\nNT 4.0 (1996)" as nt3
  rectangle "2000 · XP · Vista\\n7 (2009)" as xp
  rectangle "8 / 8.1\\n(2012 / 2013)" as w8
  rectangle "10 (2015)\\n11 (2021)\\nWindows Server" as w10
  vms --&gt; nt3
  nt3 --&gt; xp
  xp --&gt; w8
  w8 --&gt; w10
}
w9 ..&gt; xp : "XP replaces 98 (2001)"
note bottom of NT : one kernel design for 30+ years:\\nWin32 API on top, NT executive below
@enduml</code></pre></details>
<p>Ghi chú về bảng, vì đây là nguồn câu thi kinh điển: <strong>1981</strong> MS-DOS 1.0 cho IBM PC; <strong>1990</strong> Windows 3.0 ("mười triệu bản trong hai năm"); <strong>1995</strong> Windows 95 (nhúng MS-DOS bên trong); <strong>2000</strong> Windows 2000 (dựa NT) và Windows Me (bản dựa MS-DOS cuối cùng, "kém Win 98" — sách nói thẳng); <strong>2001</strong> XP thay 98; <strong>2006</strong> Vista ("không thay được XP"); <strong>2009</strong> Windows 7 ("cải thiện đáng kể so với Vista"); <strong>2012</strong> Windows 8, bản đầu tiên có giao diện "Modern"; <strong>2013</strong> Windows 8.1 và chuyển sang phát hành nhanh.</p>
<p><strong>➕ Cập nhật — chuyện gì xảy ra sau slide (nguồn: các trang Microsoft Lifecycle trên learn.microsoft.com, đọc 26/10/2026).</strong> Windows 8.1 bắt đầu 13/11/2013 và hết hỗ trợ ngày <strong>10/1/2023</strong>. <strong>Windows 10</strong> bắt đầu ngày <strong>29/7/2015</strong>; Microsoft nêu bản 22H2 là bản cuối cùng và hỗ trợ kết thúc ngày <strong>14/10/2025</strong> (bảng lifecycle ghi 15/10/2025 06:59 UTC, tức 14/10 giờ Redmond). <strong>Windows 11</strong> bắt đầu ngày <strong>4/10/2021</strong> (giờ Thái Bình Dương) và còn được hỗ trợ. Microsoft nay ra một bản cập nhật tính năng mỗi năm (trang lifecycle ghi 24H2 ngày 1/10/2024 và 25H2 ngày 30/9/2025). Dòng máy chủ đi song song: trang Windows containers liệt kê Windows Server 2016, 2019, 2022 và 2025.</p>
<p class="pitfall">⚠️ Slide dừng ở 2013, nên đáp án thi "Windows mới nhất là 8.1" chỉ đúng <em>trong sách</em>. Ngoài ra: "Windows là một hệ điều hành" che mất việc dòng MS-DOS và dòng NT gần như không chung mã nhân — chỉ API ở trên là chung.</p>`],
      [3, '2000s: NT-based Windows (1)',
        `<p class="y-chinh">🎯 Figure 11-2: <strong>Dave (David) Cutler</strong> designed the operating systems that became NT — <strong>RSX-11M</strong> (1973, 16-bit, multiuser, real-time, swapping), <strong>VAX/VMS</strong> (1978, 32-bit, virtual memory), <strong>VAXELAN</strong> (1987, real-time) and <strong>PRISM/Mica</strong> (1988, cancelled in favour of MIPS/Ultrix). Microsoft hired Cutler to build a new OS; the result was Windows NT, released in 1993.</p>
<p>In the car-company story, Cutler is the chief engineer who had already built three generations of safe, industrial vehicles for another company (DEC, a minicomputer maker). When his last project was cancelled, he moved to Microsoft and brought the same engineering habits: a small portable core, strict separation of user and kernel, and a clean object model. This is why an engineer reading Windows internals meets ideas that also appear in VMS — and why NT feels more like a "big-computer" system than the DOS line ever did.</p>
<p>What was new in NT compared with the DOS line? Four things you can test: <strong>(1) protection</strong> — each process has its own address space and an owner; <strong>(2) preemptive multitasking</strong> with threads (FE bank: "Windows NT implements multitasking truly; MS-DOS does not" — FE18#4, FE26#25); <strong>(3) portability</strong> — NT was written mostly in C, with machine-specific code isolated in a thin layer (the HAL, slide 13), so it could run on different CPUs (the book mentions several; today x86-64 and Arm64); <strong>(4) security</strong> — users, groups and access control lists from day one (slides 59–62).</p>
<p>A fair comparison with the other family: Unix started in 1969–1971 at Bell Labs and Linux in 1991 as a free Unix-like kernel. So when NT appeared in 1993, the "big three ideas" of OS design — process isolation, virtual memory, preemptive scheduling — were old news in both camps; the two families differ in <em>packaging</em> (objects and handles versus files and descriptors), not in the ideas.</p>
<div class="callout">🧭 <strong>On a real server:</strong> you will meet NT's age in logs and error messages. A Windows error code such as <code>0xC0000005</code> is an <em>NTSTATUS</em> (access violation, the cousin of Linux's <code>SIGSEGV</code>); Linux reports errors as small negative numbers (<code>errno</code>) or signals. Different habits, same idea: the kernel tells you why the request failed.</div>`,
        `<p class="y-chinh">🎯 Hình 11-2: <strong>Dave (David) Cutler</strong> thiết kế các hệ điều hành đã thành NT — <strong>RSX-11M</strong> (1973, 16 bit, nhiều người dùng, thời gian thực, swapping), <strong>VAX/VMS</strong> (1978, 32 bit, bộ nhớ ảo), <strong>VAXELAN</strong> (1987, thời gian thực) và <strong>PRISM/Mica</strong> (1988, bị huỷ để nhường MIPS/Ultrix). Microsoft thuê Cutler làm một hệ điều hành mới; kết quả là Windows NT, phát hành năm 1993.</p>
<p>Trong câu chuyện hãng xe, Cutler là kỹ sư trưởng đã dựng ba thế hệ xe công nghiệp an toàn cho một hãng khác (DEC, nhà sản xuất máy tính mini). Khi dự án cuối bị huỷ, ông sang Microsoft và mang theo thói quen kỹ thuật cũ: lõi nhỏ dễ chuyển nền, tách nghiêm ngặt người dùng và nhân, mô hình đối tượng sạch. Vì vậy người đọc cấu trúc trong của Windows gặp những ý tưởng cũng có ở VMS — và vì vậy NT có cảm giác của hệ thống "máy lớn" hơn dòng DOS từng có.</p>
<p>NT mới gì so với dòng DOS? Bốn điều kiểm chứng được: <strong>(1) bảo vệ</strong> — mỗi tiến trình có không gian địa chỉ riêng và một chủ; <strong>(2) đa nhiệm chiếm quyền</strong> với luồng (ngân hàng FE: "Windows NT đa nhiệm thật; MS-DOS thì không" — FE18#4, FE26#25); <strong>(3) dễ chuyển nền</strong> — NT viết chủ yếu bằng C, mã riêng phần cứng nằm gọn ở một tầng mỏng (HAL, slide 13), nên chạy được trên nhiều CPU (sách kể vài loại; nay là x86-64 và Arm64); <strong>(4) bảo mật</strong> — người dùng, nhóm và danh sách kiểm soát truy cập ngay từ đầu (slide 59–62).</p>
<p>So sánh công bằng với họ kia: Unix bắt đầu 1969–1971 ở Bell Labs còn Linux năm 1991 là nhân tự do giống Unix. Nên khi NT xuất hiện năm 1993, "ba ý lớn" của thiết kế HĐH — cô lập tiến trình, bộ nhớ ảo, lập lịch chiếm quyền — đã cũ ở cả hai phe; hai họ khác nhau ở <em>cách đóng gói</em> (đối tượng và handle so với tệp và descriptor), không phải ở ý tưởng.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> bạn sẽ gặp tuổi của NT trong log và thông báo lỗi. Mã lỗi Windows như <code>0xC0000005</code> là một <em>NTSTATUS</em> (vi phạm truy cập, họ hàng của <code>SIGSEGV</code> trên Linux); Linux báo lỗi bằng số âm nhỏ (<code>errno</code>) hay tín hiệu. Thói quen khác, ý như nhau: nhân cho bạn biết vì sao yêu cầu thất bại.</div>`],
      [4, '2000s: NT-based Windows (2)',
        `<p class="y-chinh">🎯 Figure 11-3: the <strong>Win32 API</strong> is one programming interface that runs on <em>almost every version</em> of Windows — Win32s on 3.0/3.1, then 95/98/Me, NT/2000/Vista/7, and 8/8.1. A program written for Win32 in 1996 usually still starts on Windows 11. That stability, not a clever kernel, is Windows's real business moat.</p>
<p>Picture the plug on a lamp. Over thirty years the wiring in the wall changed completely (DOS chassis → NT kernel → 64 bit → hypervisor underneath), but the plug shape stayed, so every old lamp still lights. Microsoft's habit is to keep the <em>plug</em> (the documented Win32 functions) forever and to change anything behind it. Contrast with Linux: it promises that the <em>system-call interface</em> to user programs never breaks (a program from the 1990s still runs on a new kernel), but libraries above it change often, so "it compiled on my distro" is a normal problem.</p>
<p>One consequence that surprises beginners: Windows does <strong>not</strong> promise stable <em>system-call numbers</em>. The numbers that <code>ntdll.dll</code> loads into a register before the trap change from build to build; only ntdll (shipped with the OS) is allowed to know them (see slide 8). Linux does the opposite: it fixes the numbers forever (check <code>man 2 syscalls</code>) and lets programs call them directly. Two ways to buy the same compatibility.</p>
<p><strong>➕ 32-bit programs on 64-bit Windows.</strong> A 32-bit Win32 program still runs on a 64-bit Windows through a compatibility layer called <strong>WOW64</strong> (Windows-on-Windows 64): a 32-bit ntdll translates calls to the 64-bit kernel. The name is from Microsoft's documentation; the details of its thunking are beyond this deck (not checked line by line). Linux has the same problem and solves it differently (multilib, <code>personality</code>, 32-bit syscall entry).</p>
<p class="pitfall">⚠️ "Win32" does not mean "32-bit only": the API kept the name <em>Win32</em> in 64-bit Windows (the 64-bit version is called Win64 only informally). Exam options that say "Win32 runs only on 32-bit processors" are wrong.</p>`,
        `<p class="y-chinh">🎯 Hình 11-3: <strong>Win32 API</strong> là một giao diện lập trình chạy trên <em>hầu hết mọi phiên bản</em> Windows — Win32s trên 3.0/3.1, rồi 95/98/Me, NT/2000/Vista/7, và 8/8.1. Một chương trình Win32 viết năm 1996 thường vẫn chạy được trên Windows 11. Sự ổn định đó, chứ không phải một nhân thông minh, là hào luỹ kinh doanh thật của Windows.</p>
<p>Hình dung phích cắm của chiếc đèn. Ba mươi năm qua dây điện trong tường đổi hoàn toàn (khung DOS → nhân NT → 64 bit → hypervisor bên dưới), nhưng hình phích cắm giữ nguyên nên đèn cũ nào cũng sáng. Thói quen của Microsoft là giữ <em>phích cắm</em> (các hàm Win32 có tài liệu) mãi mãi và đổi mọi thứ phía sau. Đối lập với Linux: nó hứa <em>giao diện lời gọi hệ thống</em> với chương trình người dùng không bao giờ gãy (chương trình thập niên 1990 vẫn chạy trên nhân mới), nhưng thư viện ở trên đổi thường xuyên, nên "biên dịch được trên bản phân phối của tôi" là vấn đề bình thường.</p>
<p>Một hệ quả làm người mới ngạc nhiên: Windows <strong>không</strong> hứa <em>số hiệu lời gọi hệ thống</em> ổn định. Con số mà <code>ntdll.dll</code> nạp vào thanh ghi trước khi bẫy đổi theo từng bản dựng; chỉ ntdll (đi kèm HĐH) được phép biết chúng (xem slide 8). Linux làm ngược lại: cố định số mãi mãi (xem <code>man 2 syscalls</code>) và cho chương trình gọi thẳng. Hai cách mua cùng một sự tương thích.</p>
<p><strong>➕ Chương trình 32 bit trên Windows 64 bit.</strong> Chương trình Win32 32 bit vẫn chạy trên Windows 64 bit nhờ một tầng tương thích gọi là <strong>WOW64</strong> (Windows-on-Windows 64): một ntdll 32 bit dịch lời gọi sang nhân 64 bit. Tên này lấy từ tài liệu Microsoft; chi tiết thunk nằm ngoài bộ slide (chưa kiểm từng dòng). Linux có cùng vấn đề và giải khác (multilib, <code>personality</code>, cổng syscall 32 bit).</p>
<p class="pitfall">⚠️ "Win32" không có nghĩa "chỉ 32 bit": API giữ tên <em>Win32</em> cả trên Windows 64 bit (bản 64 bit chỉ gọi Win64 không chính thức). Phương án thi nói "Win32 chỉ chạy trên bộ xử lý 32 bit" là sai.</p>`],
      [5, 'Programming Windows (1)',
        `<p class="y-chinh">🎯 Figure 11-4 stacks Windows into layers. <strong>User mode</strong> (top): three kinds of programs — <em>Modern Windows apps</em> (WinRT, AppContainer), <em>Windows services</em> (smss, lsass, winlogon, brokers), and <em>desktop apps</em> (Explorer, .NET, Win32 GUI) — all standing on <strong>ntdll.dll</strong>, the native NT API. <strong>Kernel mode</strong>: the NTOS kernel layer, the NTOS executive, drivers, the GUI driver and the <strong>HAL</strong>. At the very bottom: the <strong>hypervisor</strong> (Hyper-V). The dashed lines are the user/kernel boundary and the hardware boundary.</p>
<p>Think of a hotel. Guests (apps) talk to the front desk (the subsystem DLLs: kernel32, user32, gdi32) in friendly language. The front desk fills in the internal forms (ntdll's Nt… functions) and slides them through a slot into the back office (kernel mode). Nobody except the front desk uses the slot. Three kinds of guests exist: the new "Modern" guests live in a locked suite (<strong>AppContainer</strong> — an extra sandbox) and are managed by a <em>process lifetime manager</em> that can freeze them when they are not on screen; services are the staff who work without a screen; desktop apps are the classic guests with the most freedom.</p>
<p>Words you must be able to define: <strong>Win32</strong> — the classic C API of Windows (<code>CreateFile</code>, <code>CreateProcess</code>); <strong>.NET</strong> — Microsoft's managed runtime (C#, garbage collector) that calls Win32 underneath; <strong>COM</strong> — Component Object Model, a binary object-calling convention used by many Windows features; <strong>WinRT</strong> — the Windows Runtime, an object-oriented API reachable from C++, .NET and JavaScript, introduced with Windows 8; <strong>AppContainer</strong> — a low-privilege sandbox for an app, tied to the token (slide 60).</p>
<p><strong>➕ Update — what became of "Modern" apps (source: learn.microsoft.com "Windows App SDK").</strong> The Windows 8 "Metro/Modern" model evolved into UWP and then into the <strong>Windows App SDK</strong>, which Microsoft calls "the recommended development platform for building new Windows desktop applications": it brings <strong>WinUI 3</strong> and the latest Windows APIs to new apps <em>and</em> to existing WPF, Windows Forms or Win32 apps; its APIs run on Windows 10 version 1809 and later. So the sharp split between "Modern" and "desktop" in this figure has blurred: one app can be a classic Win32 program that calls modern APIs.</p>
<div class="callout">🧭 <strong>On a real server:</strong> for backend work only two boxes of this picture matter — <strong>Windows services</strong> (your .NET API as a service, started at boot, like a systemd unit on Linux) and <strong>desktop-style processes</strong> run by IIS worker processes (<code>w3wp.exe</code>). Nothing from the Modern-app column runs on Windows Server.</div>`,
        `<p class="y-chinh">🎯 Hình 11-4 xếp Windows thành các tầng. <strong>Chế độ người dùng</strong> (trên): ba loại chương trình — <em>ứng dụng Windows Modern</em> (WinRT, AppContainer), <em>dịch vụ Windows</em> (smss, lsass, winlogon, broker) và <em>ứng dụng desktop</em> (Explorer, .NET, giao diện Win32) — đều đứng trên <strong>ntdll.dll</strong>, API gốc NT. <strong>Chế độ nhân</strong>: tầng kernel NTOS, executive NTOS, driver, driver GUI và <strong>HAL</strong>. Dưới cùng: <strong>hypervisor</strong> (Hyper-V). Các đường đứt nét là ranh giới người dùng/nhân và ranh giới phần cứng.</p>
<p>Hình dung một khách sạn. Khách (ứng dụng) nói chuyện với lễ tân (các DLL hệ thống con: kernel32, user32, gdi32) bằng ngôn ngữ thân thiện. Lễ tân điền phiếu nội bộ (các hàm Nt… của ntdll) rồi luồn qua một khe vào văn phòng sau (chế độ nhân). Ngoài lễ tân không ai dùng khe đó. Có ba loại khách: khách "Modern" mới ở trong một phòng khoá riêng (<strong>AppContainer</strong> — thêm một hộp cát) và do một <em>bộ quản lý vòng đời tiến trình</em> trông coi, có thể đóng băng họ khi không hiện trên màn hình; dịch vụ là nhân viên làm việc không cần màn hình; ứng dụng desktop là khách cổ điển tự do nhất.</p>
<p>Các từ phải định nghĩa được: <strong>Win32</strong> — API C cổ điển của Windows (<code>CreateFile</code>, <code>CreateProcess</code>); <strong>.NET</strong> — runtime có quản lý của Microsoft (C#, bộ dọn rác) gọi Win32 bên dưới; <strong>COM</strong> — Component Object Model, quy ước gọi đối tượng nhị phân mà nhiều tính năng Windows dùng; <strong>WinRT</strong> — Windows Runtime, API hướng đối tượng gọi được từ C++, .NET và JavaScript, ra mắt cùng Windows 8; <strong>AppContainer</strong> — hộp cát ít đặc quyền cho một ứng dụng, gắn với token (slide 60).</p>
<p><strong>➕ Cập nhật — ứng dụng "Modern" về sau ra sao (nguồn: learn.microsoft.com "Windows App SDK").</strong> Mô hình "Metro/Modern" của Windows 8 phát triển thành UWP rồi thành <strong>Windows App SDK</strong>, mà Microsoft gọi là "nền tảng phát triển được khuyến nghị để xây ứng dụng desktop Windows mới": nó mang <strong>WinUI 3</strong> và các API Windows mới nhất cho ứng dụng mới <em>và</em> cho ứng dụng WPF, Windows Forms hay Win32 có sẵn; API chạy trên Windows 10 bản 1809 trở lên. Nên ranh giới sắc nét giữa "Modern" và "desktop" trong hình đã mờ: một ứng dụng có thể là chương trình Win32 cổ điển gọi các API hiện đại.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> với việc backend chỉ hai ô của hình này quan trọng — <strong>dịch vụ Windows</strong> (API .NET của bạn chạy như một service, khởi động lúc boot, giống một unit systemd trên Linux) và <strong>tiến trình kiểu desktop</strong> do worker của IIS chạy (<code>w3wp.exe</code>). Không có gì của cột Modern chạy trên Windows Server.</div>`],
      [6, 'Programming Windows (2)',
        `<p class="y-chinh">🎯 Figure 11-5: NT was built so that <em>several APIs</em> could sit on one kernel. Each API is an <strong>environment subsystem</strong>: a set of subsystem libraries in the program, plus (sometimes) a <strong>subsystem process</strong> that keeps shared state, talking to the program through the kernel's <strong>LPC</strong> (local procedure call) message mechanism. Win32 is the only one most people have ever used, but the design allowed a POSIX and an OS/2 personality too.</p>
<p>Imagine a UN building with several interpreters. A French speaker (the OS/2 program) and an English speaker (a Win32 program) both want the same service. Each has an interpreter (<em>subsystem library</em>) who rephrases the request into the building's internal language (the native NT API), and a shared secretary (<em>subsystem process</em>, <code>csrss.exe</code> for Win32) who keeps the lists that all English speakers share — for example, which console windows exist. The building (kernel) itself speaks only its own language.</p>
<p>How the figure reads: a program process calls a function in the <em>subsystem libraries</em>; the library either handles it entirely (a pure user-mode helper), or calls the <em>native NT API / C runtime</em> in <code>ntdll</code> and traps into the kernel; or it sends an <strong>LPC message</strong> to the subsystem process when the call touches state shared by many programs. The <em>subsystem kernel support</em> is the small kernel-mode piece (for Win32: the GDI/USER driver, <code>win32k.sys</code>). The <code>CreateProcess</code> "hook" in the library lets the subsystem process learn about every new process of its kind.</p>
<p><strong>➕ The history of the extra personalities.</strong> A POSIX subsystem existed so Windows could claim POSIX compliance; "Windows Services for UNIX" and later "Subsystem for UNIX-based Applications" were add-ons, and both are long gone. The modern replacement is not another subsystem but <strong>WSL</strong>. Microsoft's WSL page states that <strong>WSL 2</strong> "uses virtualization technology to run a Linux kernel inside of a lightweight utility virtual machine", and that compared with WSL 1 it "increases file system performance and adds full system call compatibility". WSL 1 followed the book's idea (a Linux personality translated onto the NT kernel); WSL 2 gave up on translation and runs the <em>real</em> Linux kernel — see slide 63's figure.</p>
<p class="pitfall">⚠️ Do not confuse the <em>subsystem</em> (an API personality, Figure 11-5) with the <em>Windows Subsystem for Linux</em> (a product that, in version 2, is really a virtual machine). The name is historical; the technique changed.</p>`,
        `<p class="y-chinh">🎯 Hình 11-5: NT được dựng để <em>nhiều API</em> có thể ngồi trên một nhân. Mỗi API là một <strong>hệ thống con môi trường (environment subsystem)</strong>: một bộ thư viện hệ thống con trong chương trình, cộng (đôi khi) một <strong>tiến trình hệ thống con</strong> giữ trạng thái dùng chung, nói chuyện với chương trình qua cơ chế thông điệp <strong>LPC</strong> (local procedure call) của nhân. Win32 là cái duy nhất đa số người từng dùng, nhưng thiết kế cho phép cả một "nhân cách" POSIX và OS/2.</p>
<p>Hình dung một toà nhà Liên Hợp Quốc có nhiều thông dịch viên. Người nói tiếng Pháp (chương trình OS/2) và người nói tiếng Anh (chương trình Win32) cùng muốn một dịch vụ. Mỗi người có thông dịch viên (<em>thư viện hệ thống con</em>) diễn đạt lại yêu cầu bằng ngôn ngữ nội bộ của toà nhà (API gốc NT), và một thư ký chung (<em>tiến trình hệ thống con</em>, <code>csrss.exe</code> cho Win32) giữ các danh sách mà mọi người nói tiếng Anh dùng chung — ví dụ cửa sổ console nào đang tồn tại. Bản thân toà nhà (nhân) chỉ nói ngôn ngữ riêng của nó.</p>
<p>Đọc hình: một tiến trình chương trình gọi hàm trong <em>thư viện hệ thống con</em>; thư viện hoặc tự xử lý hết (hàm phụ trợ thuần chế độ người dùng), hoặc gọi <em>API gốc NT / thư viện C</em> trong <code>ntdll</code> rồi bẫy vào nhân; hoặc gửi một <strong>thông điệp LPC</strong> tới tiến trình hệ thống con khi lời gọi đụng trạng thái nhiều chương trình dùng chung. <em>Hỗ trợ nhân của hệ thống con</em> là mảnh nhỏ chế độ nhân (với Win32: driver GDI/USER, <code>win32k.sys</code>). "Móc" <code>CreateProcess</code> trong thư viện để tiến trình hệ thống con biết mọi tiến trình mới thuộc loại của nó.</p>
<p><strong>➕ Lịch sử các "nhân cách" thêm.</strong> Từng có hệ thống con POSIX để Windows tuyên bố tuân thủ POSIX; "Windows Services for UNIX" rồi "Subsystem for UNIX-based Applications" là các gói bổ sung, và cả hai đã biến mất. Thay thế hiện đại không phải một hệ thống con khác mà là <strong>WSL</strong>. Trang WSL của Microsoft nêu <strong>WSL 2</strong> "dùng công nghệ ảo hoá để chạy một nhân Linux bên trong một máy ảo tiện ích nhẹ", và so với WSL 1 nó "tăng hiệu năng hệ thống tệp và thêm tương thích đầy đủ lời gọi hệ thống". WSL 1 theo ý tưởng của sách (một nhân cách Linux được dịch lên nhân NT); WSL 2 bỏ việc dịch và chạy <em>chính</em> nhân Linux — xem hình ở slide 63.</p>
<p class="pitfall">⚠️ Đừng lẫn <em>hệ thống con</em> (một nhân cách API, Hình 11-5) với <em>Windows Subsystem for Linux</em> (một sản phẩm mà ở bản 2 thực chất là một máy ảo). Tên là di sản; kỹ thuật đã đổi.</p>`],
      [7, 'The Native NT Application Programming Interface (1)',
        `<p class="y-chinh">🎯 Figure 11-6: the NT kernel is organised around <strong>kernel-mode objects</strong>, and the table groups the common categories — <strong>Synchronization</strong> (semaphores, mutexes, events, IPC ports, I/O completion queues), <strong>I/O</strong> (files, devices, drivers, timers), <strong>Program</strong> (jobs, processes, threads, sections, tokens) and <strong>Win32 GUI</strong> (desktops, application callbacks). Every one of them is created, named, protected and closed in the <em>same way</em>, through <strong>handles</strong>.</p>
<p>Think of a library that lends not only books but also bicycles, rooms and tools. Whatever you borrow, the procedure is identical: you show your card, the librarian writes a loan slip with a number (the handle), you use the item, and you return it by number. The library does not need a separate counter for each kind of thing. That uniformity is the Windows object model — one set of verbs (create/open, duplicate, wait, close, set security) for <em>every</em> kind of kernel resource.</p>
<p>UNIX's version of the same idea is "everything is a file", and it is only partly true: files, pipes, sockets and devices share the file-descriptor interface, but processes, threads, memory regions and semaphores each have their own special calls. Windows pushes uniformity further: a <em>process</em> is an object with a handle you can wait on, duplicate and give a security descriptor to. Linux got closer to this lately with <code>pidfd_open(2)</code> (a file descriptor that stands for a process) and <code>eventfd(2)</code>/<code>timerfd_create(2)</code> (descriptors for events and timers) — both in man7.org. Slide 18 shows the fd table running.</p>
<p><strong>Why "executive object" matters:</strong> because every object has the same header (name, security, reference counts — slide 17), the kernel can implement <em>one</em> <code>NtClose</code>, <em>one</em> <code>NtDuplicateObject</code>, <em>one</em> security check for all of them. That is less code, fewer bugs and a single place to audit.</p>
<p class="meo">🧠 Memorise the four columns with one word each: <em>Wait</em> (synchronization), <em>Do I/O</em> (files, devices), <em>Run</em> (job, process, thread), <em>Show</em> (desktops). When a question asks "which of these is a kernel object?", the answer is almost always "all of them".</p>`,
        `<p class="y-chinh">🎯 Hình 11-6: nhân NT được tổ chức quanh các <strong>đối tượng chế độ nhân</strong>, và bảng gom các loại thường gặp — <strong>Đồng bộ</strong> (semaphore, mutex, event, cổng IPC, hàng đợi hoàn thành I/O), <strong>I/O</strong> (tệp, thiết bị, driver, bộ đếm giờ), <strong>Chương trình</strong> (job, tiến trình, luồng, section, token) và <strong>GUI Win32</strong> (desktop, callback ứng dụng). Mỗi loại đều được tạo, đặt tên, bảo vệ và đóng theo <em>cùng một cách</em>, qua <strong>handle</strong>.</p>
<p>Hình dung một thư viện cho mượn không chỉ sách mà cả xe đạp, phòng và dụng cụ. Mượn gì thì thủ tục cũng giống nhau: xuất trình thẻ, thủ thư ghi phiếu mượn có một số (handle), bạn dùng rồi trả theo số. Thư viện không cần quầy riêng cho từng loại. Sự đồng nhất đó là mô hình đối tượng Windows — một bộ động từ (tạo/mở, nhân đôi, chờ, đóng, đặt bảo mật) cho <em>mọi</em> loại tài nguyên nhân.</p>
<p>Phiên bản UNIX của cùng ý tưởng là "mọi thứ là tệp", và nó chỉ đúng một phần: tệp, pipe, socket và thiết bị chung giao diện file descriptor, nhưng tiến trình, luồng, vùng nhớ và semaphore mỗi loại có lời gọi đặc biệt riêng. Windows đẩy sự đồng nhất xa hơn: một <em>tiến trình</em> là đối tượng có handle bạn chờ được, nhân đôi được và gắn security descriptor được. Gần đây Linux tiến gần hơn bằng <code>pidfd_open(2)</code> (file descriptor đại diện một tiến trình) và <code>eventfd(2)</code>/<code>timerfd_create(2)</code> (descriptor cho sự kiện và bộ đếm giờ) — đều có ở man7.org. Slide 18 cho thấy bảng fd đang chạy.</p>
<p><strong>Vì sao "executive object" quan trọng:</strong> vì mọi đối tượng có cùng phần đầu (tên, bảo mật, bộ đếm tham chiếu — slide 17), nhân cài được <em>một</em> <code>NtClose</code>, <em>một</em> <code>NtDuplicateObject</code>, <em>một</em> kiểm tra bảo mật cho tất cả. Ít mã hơn, ít lỗi hơn và chỉ một chỗ để kiểm toán.</p>
<p class="meo">🧠 Nhớ bốn cột bằng một từ mỗi cột: <em>Chờ</em> (đồng bộ), <em>Làm I/O</em> (tệp, thiết bị), <em>Chạy</em> (job, tiến trình, luồng), <em>Hiện</em> (desktop). Khi câu hỏi "cái nào sau đây là đối tượng nhân?", đáp án hầu như luôn là "tất cả".</p>`],
      [8, 'The Native NT Application Programming Interface (2)',
        `<p class="y-chinh">🎯 Figure 11-7 shows real <strong>native NT calls</strong>: <code>NtCreateProcess</code>, <code>NtCreateThread</code>, <code>NtAllocateVirtualMemory</code>, <code>NtMapViewOfSection</code>, <code>NtReadVirtualMemory</code>, <code>NtWriteVirtualMemory</code>, <code>NtCreateFile</code>, <code>NtDuplicateObject</code>. Their first parameters are <strong>handles</strong> (<code>ProcHandle</code>, <code>SectHandle</code>) — so a call can act on <em>another</em> process, as long as you hold a handle to it with the right access. Applications are expected to use Win32, not these.</p>
<p>Look at <code>NtAllocateVirtualMemory(ProcHandle, Addr, Size, Type, Protection, …)</code>: the first argument names <em>whose</em> memory to allocate in. Compare Linux <code>mmap()</code>, which only ever works on the <em>calling</em> process. On Windows a debugger or an installer can allocate and write inside another process (<code>NtWriteVirtualMemory</code>) <em>if the security check passes</em>; on Linux the equivalents are <code>ptrace(2)</code> and <code>process_vm_writev(2)</code>, guarded by capabilities. Same power, different door.</p>
<p>The path of a call, shown in the sequence below, is the single most useful picture for the whole chapter: the program calls <code>CreateFileW</code> in kernel32; kernel32 converts the path to NT form and calls <code>NtCreateFile</code> in <code>ntdll.dll</code>; ntdll is only a stub — it loads a <strong>system-call number</strong> and executes the trap instruction; the kernel's dispatcher runs the executive function (here the I/O manager) and returns a handle.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/4e5a8fcd69cc71721cdf4088c95ea465c555bc17.svg" alt="One Win32 call, layer by layer: CreateFileW → NtCreateFile → trap → I/O manager → handle" loading="lazy" /><p class="chu-thich">🧩 One Win32 call, layer by layer: CreateFileW → NtCreateFile → trap → I/O manager → handle</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' One Win32 call, layer by layer (Figures 11-8 and 11-20): CreateFile is only a wrapper; the real work is NtCreateFile in the kernel
participant "Your program\\n(C#, C++, Python…)" as P
participant "kernel32 / kernelbase\\n(Win32 subsystem DLL)" as K
participant "ntdll.dll\\n(native API stub)" as N
participant "Kernel\\nsystem-call dispatcher" as D
participant "I/O manager\\n(executive)" as IO
P -&gt; K : CreateFileW("C:\\\\foo\\\\bar", GENERIC_READ, …)
K -&gt; K : convert path to NT form\\n\\\\??\\\\C:\\\\foo\\\\bar ; fill OBJECT_ATTRIBUTES
K -&gt; N : NtCreateFile(&amp;handle, access, &amp;objattr, …)
N -&gt; D : load syscall number into a register;\\nexecute the trap instruction (SYSCALL)
D -&gt; IO : IopCreateFile → open the object by name
IO --&gt; D : handle (an index into the process's handle table)
D --&gt; N : return to user mode
N --&gt; K : NTSTATUS + handle
K --&gt; P : HANDLE  (or INVALID_HANDLE_VALUE\\n+ GetLastError())
note over N, D : Windows syscall NUMBERS change between builds, so only ntdll\\n(shipped with the OS) is allowed to know them — Linux fixes its numbers forever
@enduml</code></pre></details>
<p>Linux has the same layering (your <code>open()</code> is a libc wrapper that issues a <code>syscall</code> instruction). Watch it live: <code>strace</code> prints the real system calls a program makes, with ARM64 here and x86-64 on your PC (the numbers differ; the idea does not).</p>
<div class="out"># The path of one request through the layers. Linux: program -&gt; system call -&gt; VFS -&gt; file system -&gt; block layer. Windows: CreateFile -&gt; NtCreateFile -&gt; I/O manager -&gt; IRP -&gt; driver stack<br>
$ strace -o /tmp/st.txt -e trace=openat,read,write cat /etc/hostname &gt; /dev/null<br>
$ grep -E '/etc/hostname|osg-lab' /tmp/st.txt<br>
openat(AT_FDCWD, "/etc/hostname", O_RDONLY) = 3<br>
read(3, "osg-lab\\n", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8<br>
write(1, "osg-lab\\n", 8) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8<br>
# The device "stack" of this machine's disk: block devices and the I/O scheduler layer in front of them<br>
$ ls /sys/block | grep -E "^vd"<br>
vda<br>
vdb<br>
$ cat /sys/block/vda/queue/scheduler<br>
none [mq-deadline] kyber</div>
<p>The lines <code>openat(…"/etc/hostname"…) = 3</code>, <code>read(3, …)</code>, <code>write(1, …)</code> are the Linux twins of <code>NtCreateFile</code>, <code>NtReadFile</code>, <code>NtWriteFile</code>; the number <code>3</code> is the first free slot in the descriptor table — a handle by another name (slide 18). The last two commands foreshadow slide 52: even the disk has an I/O scheduler layer in front of it.</p>
<p class="pitfall">⚠️ The "(2)" in this slide's title is missing from the book's slide numbering (slides 7 and 8 both say "Native NT API"). Do not memorise the exact parameter lists of Figure 11-7; the FE asks for the <em>idea</em> that native calls take handles and that Win32 wraps them.</p>`,
        `<p class="y-chinh">🎯 Hình 11-7 cho thấy các <strong>lời gọi NT gốc</strong> thật: <code>NtCreateProcess</code>, <code>NtCreateThread</code>, <code>NtAllocateVirtualMemory</code>, <code>NtMapViewOfSection</code>, <code>NtReadVirtualMemory</code>, <code>NtWriteVirtualMemory</code>, <code>NtCreateFile</code>, <code>NtDuplicateObject</code>. Tham số đầu của chúng là <strong>handle</strong> (<code>ProcHandle</code>, <code>SectHandle</code>) — nên một lời gọi có thể tác động lên <em>tiến trình khác</em>, miễn là bạn giữ handle tới nó với quyền đúng. Ứng dụng được mong đợi dùng Win32, không dùng các hàm này.</p>
<p>Nhìn <code>NtAllocateVirtualMemory(ProcHandle, Addr, Size, Type, Protection, …)</code>: tham số đầu nói cấp phát trong bộ nhớ của <em>ai</em>. So với <code>mmap()</code> của Linux, chỉ luôn tác động lên tiến trình <em>đang gọi</em>. Trên Windows trình gỡ lỗi hay trình cài đặt cấp phát và ghi được bên trong tiến trình khác (<code>NtWriteVirtualMemory</code>) <em>nếu kiểm tra bảo mật cho qua</em>; trên Linux tương đương là <code>ptrace(2)</code> và <code>process_vm_writev(2)</code>, được capability canh giữ. Cùng quyền lực, khác cửa.</p>
<p>Đường đi của một lời gọi, trong sơ đồ tuần tự dưới đây, là hình hữu ích nhất cho cả chương: chương trình gọi <code>CreateFileW</code> trong kernel32; kernel32 đổi đường dẫn sang dạng NT và gọi <code>NtCreateFile</code> trong <code>ntdll.dll</code>; ntdll chỉ là mẩu vỏ — nó nạp một <strong>số hiệu lời gọi hệ thống</strong> rồi thực hiện lệnh bẫy; bộ điều phối của nhân chạy hàm executive (ở đây là I/O manager) và trả về một handle.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/4e5a8fcd69cc71721cdf4088c95ea465c555bc17.svg" alt="Một lời gọi Win32, từng tầng: CreateFileW → NtCreateFile → bẫy → I/O manager → handle" loading="lazy" /><p class="chu-thich">🧩 Một lời gọi Win32, từng tầng: CreateFileW → NtCreateFile → bẫy → I/O manager → handle</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Một lời gọi Win32, từng tầng (Hình 11-8 và 11-20): CreateFile chỉ là vỏ bọc; việc thật là NtCreateFile trong nhân
participant "Your program\\n(C#, C++, Python…)" as P
participant "kernel32 / kernelbase\\n(Win32 subsystem DLL)" as K
participant "ntdll.dll\\n(native API stub)" as N
participant "Kernel\\nsystem-call dispatcher" as D
participant "I/O manager\\n(executive)" as IO
P -&gt; K : CreateFileW("C:\\\\foo\\\\bar", GENERIC_READ, …)
K -&gt; K : convert path to NT form\\n\\\\??\\\\C:\\\\foo\\\\bar ; fill OBJECT_ATTRIBUTES
K -&gt; N : NtCreateFile(&amp;handle, access, &amp;objattr, …)
N -&gt; D : load syscall number into a register;\\nexecute the trap instruction (SYSCALL)
D -&gt; IO : IopCreateFile → open the object by name
IO --&gt; D : handle (an index into the process's handle table)
D --&gt; N : return to user mode
N --&gt; K : NTSTATUS + handle
K --&gt; P : HANDLE  (or INVALID_HANDLE_VALUE\\n+ GetLastError())
note over N, D : Windows syscall NUMBERS change between builds, so only ntdll\\n(shipped with the OS) is allowed to know them — Linux fixes its numbers forever
@enduml</code></pre></details>
<p>Linux có cùng cách phân tầng (<code>open()</code> của bạn là vỏ libc phát lệnh <code>syscall</code>). Xem trực tiếp: <code>strace</code> in ra các lời gọi hệ thống thật mà một chương trình thực hiện, ở đây là ARM64 còn trên PC bạn là x86-64 (số hiệu khác; ý tưởng thì không).</p>
<div class="out"># Đường đi của một yêu cầu qua các tầng. Linux: chương trình -&gt; lời gọi hệ thống -&gt; VFS -&gt; hệ thống tệp -&gt; tầng khối. Windows: CreateFile -&gt; NtCreateFile -&gt; I/O manager -&gt; IRP -&gt; chồng driver<br>
$ strace -o /tmp/st.txt -e trace=openat,read,write cat /etc/hostname &gt; /dev/null<br>
$ grep -E '/etc/hostname|osg-lab' /tmp/st.txt<br>
openat(AT_FDCWD, "/etc/hostname", O_RDONLY) = 3<br>
read(3, "osg-lab\\n", 131072) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8<br>
write(1, "osg-lab\\n", 8) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 8<br>
# "Chồng" thiết bị của đĩa máy này: thiết bị khối và tầng lập lịch I/O đứng trước chúng<br>
$ ls /sys/block | grep -E "^vd"<br>
vda<br>
vdb<br>
$ cat /sys/block/vda/queue/scheduler<br>
none [mq-deadline] kyber</div>
<p>Các dòng <code>openat(…"/etc/hostname"…) = 3</code>, <code>read(3, …)</code>, <code>write(1, …)</code> là bản sinh đôi Linux của <code>NtCreateFile</code>, <code>NtReadFile</code>, <code>NtWriteFile</code>; số <code>3</code> là ô trống đầu tiên của bảng descriptor — một handle dưới tên khác (slide 18). Hai lệnh cuối báo trước slide 52: ngay cả đĩa cũng có một tầng lập lịch I/O đứng trước.</p>
<p class="pitfall">⚠️ Số "(2)" trong tiêu đề slide này bị thiếu trong cách đánh số của sách (slide 7 và 8 đều ghi "Native NT API"). Đừng học thuộc danh sách tham số chính xác của Hình 11-7; FE hỏi <em>ý</em> rằng lời gọi gốc nhận handle và Win32 bọc chúng.</p>`],
      [9, 'The Win32 Application Programming Interface',
        `<p class="y-chinh">🎯 Figure 11-8 pairs each <strong>Win32 call</strong> with the <strong>native NT call</strong> it wraps: <code>CreateProcess → NtCreateProcess</code>, <code>CreateThread → NtCreateThread</code>, <code>SuspendThread → NtSuspendThread</code>, <code>CreateSemaphore → NtCreateSemaphore</code>, <code>ReadFile → NtReadFile</code>, <code>DeleteFile → NtSetInformationFile</code>, <code>CreateFileMapping → NtCreateSection</code>, <code>VirtualAlloc → NtAllocateVirtualMemory</code>, <code>MapViewOfFile → NtMapViewOfSection</code>, <code>DuplicateHandle → NtDuplicateObject</code>, <code>CloseHandle → NtClose</code>.</p>
<p>Win32 is the "friendly menu" and NT is the "kitchen's order form". Sometimes the mapping is one-to-one; sometimes not — <code>DeleteFile</code> becomes <code>NtSetInformationFile</code> (deleting is just <em>setting an attribute</em> "delete on close"), and <code>CreateFileMapping</code> becomes <code>NtCreateSection</code> (a mapped file is a <em>section object</em>, slide 41). Learn the names in the left column; the exam sometimes asks "which Win32 call creates a new process" (answer <code>CreateProcess</code>).</p>
<table>
<thead><tr><th>Task</th><th>Windows (Win32 → native)</th><th>Linux (libc → system call)</th></tr></thead>
<tbody>
<tr><td>create a process</td><td><code>CreateProcess</code> → <code>NtCreateProcess</code></td><td><code>fork()</code> + <code>execve()</code> (or <code>posix_spawn</code>)</td></tr>
<tr><td>create a thread</td><td><code>CreateThread</code> → <code>NtCreateThread</code></td><td><code>pthread_create</code> → <code>clone()</code></td></tr>
<tr><td>open a file</td><td><code>CreateFile</code> → <code>NtCreateFile</code></td><td><code>open()</code> → <code>openat</code></td></tr>
<tr><td>read</td><td><code>ReadFile</code> → <code>NtReadFile</code></td><td><code>read()</code></td></tr>
<tr><td>map a file</td><td><code>CreateFileMapping</code> + <code>MapViewOfFile</code></td><td><code>mmap()</code></td></tr>
<tr><td>reserve memory</td><td><code>VirtualAlloc</code></td><td><code>mmap()</code></td></tr>
<tr><td>close</td><td><code>CloseHandle</code> → <code>NtClose</code></td><td><code>close()</code></td></tr>
</tbody>
</table>
<p><strong>FE question, with a check:</strong> "OS Win32 uses system call ___, while OS Unix uses ___ to create a new process" — answer <em>CreateProcess; fork</em> (FE19#17, FE26#47 — bank answer correct). The deeper point: <code>fork</code> clones the caller and <code>exec</code> replaces the program (two steps); <code>CreateProcess</code> builds a <em>new</em> process from a program file in one call with ten parameters. That difference explains why shell scripts that spawn thousands of processes run fast on Linux and slow under Windows tools (process creation costs more on Windows) — a real reason Git and bash scripts feel slow on Windows.</p>
<p class="pitfall">⚠️ A common wrong answer: "<code>CreateThread</code> creates a process". Process = resources container; thread = unit scheduled by the kernel (slide 28). Another: "Win32 is the Windows kernel". It is a <em>library</em> in user mode.</p>
<div class="callout">🧭 <strong>On a real server:</strong> in Node.js on Windows, <code>child_process.spawn</code> calls <code>CreateProcess</code>; on Linux it uses <code>fork/exec</code> (via libuv's <code>uv_spawn</code>). Same API, different cost and different rules for quoting arguments (Windows passes ONE command-line string; Linux passes an array — slide 31).</div>`,
        `<p class="y-chinh">🎯 Hình 11-8 ghép mỗi <strong>lời gọi Win32</strong> với <strong>lời gọi NT gốc</strong> mà nó bọc: <code>CreateProcess → NtCreateProcess</code>, <code>CreateThread → NtCreateThread</code>, <code>SuspendThread → NtSuspendThread</code>, <code>CreateSemaphore → NtCreateSemaphore</code>, <code>ReadFile → NtReadFile</code>, <code>DeleteFile → NtSetInformationFile</code>, <code>CreateFileMapping → NtCreateSection</code>, <code>VirtualAlloc → NtAllocateVirtualMemory</code>, <code>MapViewOfFile → NtMapViewOfSection</code>, <code>DuplicateHandle → NtDuplicateObject</code>, <code>CloseHandle → NtClose</code>.</p>
<p>Win32 là "thực đơn thân thiện" còn NT là "phiếu đặt món của nhà bếp". Có khi ánh xạ một-một; có khi không — <code>DeleteFile</code> thành <code>NtSetInformationFile</code> (xoá chỉ là <em>đặt một thuộc tính</em> "xoá khi đóng"), và <code>CreateFileMapping</code> thành <code>NtCreateSection</code> (tệp ánh xạ là một <em>đối tượng section</em>, slide 41). Học tên ở cột trái; đề thi đôi khi hỏi "lời gọi Win32 nào tạo tiến trình mới" (đáp án <code>CreateProcess</code>).</p>
<table>
<thead><tr><th>Việc</th><th>Windows (Win32 → gốc)</th><th>Linux (libc → lời gọi hệ thống)</th></tr></thead>
<tbody>
<tr><td>tạo tiến trình</td><td><code>CreateProcess</code> → <code>NtCreateProcess</code></td><td><code>fork()</code> + <code>execve()</code> (hoặc <code>posix_spawn</code>)</td></tr>
<tr><td>tạo luồng</td><td><code>CreateThread</code> → <code>NtCreateThread</code></td><td><code>pthread_create</code> → <code>clone()</code></td></tr>
<tr><td>mở tệp</td><td><code>CreateFile</code> → <code>NtCreateFile</code></td><td><code>open()</code> → <code>openat</code></td></tr>
<tr><td>đọc</td><td><code>ReadFile</code> → <code>NtReadFile</code></td><td><code>read()</code></td></tr>
<tr><td>ánh xạ tệp</td><td><code>CreateFileMapping</code> + <code>MapViewOfFile</code></td><td><code>mmap()</code></td></tr>
<tr><td>giữ chỗ bộ nhớ</td><td><code>VirtualAlloc</code></td><td><code>mmap()</code></td></tr>
<tr><td>đóng</td><td><code>CloseHandle</code> → <code>NtClose</code></td><td><code>close()</code></td></tr>
</tbody>
</table>
<p><strong>Câu FE, có kiểm tra:</strong> "HĐH Win32 dùng lời gọi hệ thống ___, còn Unix dùng ___ để tạo tiến trình mới" — đáp án <em>CreateProcess; fork</em> (FE19#17, FE26#47 — đáp án ngân hàng đúng). Ý sâu hơn: <code>fork</code> nhân bản người gọi và <code>exec</code> thay chương trình (hai bước); <code>CreateProcess</code> dựng tiến trình <em>mới</em> từ một tệp chương trình trong một lời gọi mười tham số. Khác biệt này giải thích vì sao script shell sinh hàng nghìn tiến trình chạy nhanh trên Linux và chậm với công cụ Windows (tạo tiến trình tốn hơn trên Windows) — một lý do thật khiến Git và script bash trên Windows thấy chậm.</p>
<p class="pitfall">⚠️ Đáp án sai hay gặp: "<code>CreateThread</code> tạo tiến trình". Tiến trình = thùng chứa tài nguyên; luồng = đơn vị được nhân lập lịch (slide 28). Một cái khác: "Win32 là nhân Windows". Nó là một <em>thư viện</em> ở chế độ người dùng.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> trong Node.js trên Windows, <code>child_process.spawn</code> gọi <code>CreateProcess</code>; trên Linux dùng <code>fork/exec</code> (qua <code>uv_spawn</code> của libuv). Cùng API, khác chi phí và khác luật trích dẫn đối số (Windows truyền MỘT chuỗi dòng lệnh; Linux truyền một mảng — slide 31).</div>`],
      [10, 'The Windows Registry (1)',
        `<p class="y-chinh">🎯 Figure 11-9: the <strong>registry</strong> is a hierarchical database of <em>keys</em> (like folders) and <em>values</em> (name + typed data) that holds the configuration of the system and of every installed program. It is stored in files called <strong>hives</strong>, mounted as <code>HKEY_LOCAL_MACHINE</code> (HKLM) — hives SYSTEM, HARDWARE, BCD, SAM, SECURITY, SOFTWARE, COMPONENTS — and <code>HKEY_USERS</code> (DEFAULT, and one <code>NTUSER.DAT</code> per user).</p>
<p>Imagine a building's electrical panel, a thermostat and a visitors' logbook all kept in <em>one</em> locked cabinet with labelled drawers. The <code>SYSTEM</code> drawer holds what the kernel needs to boot (which drivers load, in which order); <code>SOFTWARE</code> holds settings of installed programs and the COM class registrations; <code>SAM</code> holds the local user accounts (password hashes); <code>SECURITY</code> holds what the Local Security Authority needs; <code>NTUSER.DAT</code> is each resident's personal drawer, loaded when they log in; <code>HARDWARE</code> is rebuilt at every boot from what the kernel found, so it lives only in memory; <code>BCD</code> is the Boot Configuration Database, which tells the boot loader what to start.</p>
<p><strong>What Microsoft's docs add (learn.microsoft.com, "Registry Hives").</strong> A hive is "a logical group of keys, subkeys, and values in the registry that has a set of supporting files loaded into memory when the operating system is started or a user logs in". Most files live in <code>%SystemRoot%\\System32\\Config</code>; each user's <code>Ntuser.dat</code> is in the user profile. Next to a hive file there may be a <code>.log</code> (a <strong>transaction log</strong> of changes — the registry is crash-safe like a journaling file system) and, only for SYSTEM, an <code>.alt</code> backup. Do not memorise extensions; do memorise <em>that the registry is just files</em> that the kernel's <strong>configuration manager</strong> loads and keeps in memory.</p>
<p>The Linux answer to "where is the configuration?" is deliberately different: <strong>no central database</strong>. Kernel settings are a tree of virtual files under <code>/proc/sys</code> (read and write them live with <code>sysctl</code>), system-wide settings are text files under <code>/etc</code>, and per-user settings are "dotfiles" in the home directory. Run it:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Windows keeps settings in ONE database (the registry); Linux keeps them in text files under /etc and live kernel knobs under /proc/sys<br>
# HKLM\\SYSTEM (kernel settings) &lt;-&gt; /proc/sys, a tree of keys and values you can read like files<br>
$ ls /proc/sys<br>
abi<br>
debug<br>
dev<br>
fs<br>
kernel<br>
net<br>
sunrpc<br>
user<br>
vm<br>
$ sysctl kernel.ostype kernel.hostname<br>
kernel.ostype = Linux<br>
kernel.hostname = osg-lab<br>
$ echo "number of kernel values under /proc/sys: $(find /proc/sys -type f | wc -l)"<br>
number of kernel values under /proc/sys: 1771<br>
# Change a value LIVE (like editing HKLM\\SYSTEM\\...; the kernel notices at once, no reboot)<br>
$ sysctl -w kernel.hostname=registry-demo<br>
kernel.hostname = registry-demo<br>
$ echo "changed live: $(hostname)"<br>
changed live: registry-demo<br>
# HKLM\\SOFTWARE (per-application settings) &lt;-&gt; text files in /etc, edited with any editor<br>
$ ls /etc | head -12<br>
adduser.conf<br>
alternatives<br>
apparmor.d<br>
apt<br>
bash.bashrc<br>
bindresvport.blacklist<br>
ca-certificates<br>
ca-certificates.conf<br>
cron.d<br>
cron.daily<br>
cron.weekly<br>
debconf.conf<br>
# HKEY_USERS\\&lt;id&gt; (per-user hive, NTUSER.DAT) &lt;-&gt; dotfiles in the home directory<br>
$ ls -a /home/sv | head<br>
.<br>
..<br>
.bash_logout<br>
.bashrc<br>
.profile</div>
<p>Reading the output: <code>/proc/sys</code> holds a few thousand kernel knobs (the exact count depends on the kernel; here 1,771 values) — the cousin of <code>HKLM\\SYSTEM\\CurrentControlSet</code>. <code>sysctl -w kernel.hostname=registry-demo</code> changed a live kernel value in one command and <code>hostname</code> saw it at once, with no reboot — just as writing a registry value that a driver watches can take effect immediately. Settings that must survive a reboot go to <code>/etc/sysctl.d/*.conf</code> (text file) — i.e., the registry's "persistent file" idea, but each setting in its own readable file.</p>
<p class="pitfall">⚠️ The FE option "the registry is a part of the kernel that stays in RAM" (FE17#6 lists <em>registry</em> as a wrong option for "the essential component that remains in RAM": the answer there is <em>kernel</em>). The registry is a <em>database stored in hive files</em>, managed by one executive component (the configuration manager).</p>`,
        `<p class="y-chinh">🎯 Hình 11-9: <strong>registry</strong> là cơ sở dữ liệu phân cấp gồm các <em>khoá</em> (như thư mục) và <em>giá trị</em> (tên + dữ liệu có kiểu) chứa cấu hình của hệ thống và của mọi chương trình đã cài. Nó được lưu trong các tệp gọi là <strong>hive</strong>, gắn vào <code>HKEY_LOCAL_MACHINE</code> (HKLM) — các hive SYSTEM, HARDWARE, BCD, SAM, SECURITY, SOFTWARE, COMPONENTS — và <code>HKEY_USERS</code> (DEFAULT, và một <code>NTUSER.DAT</code> cho mỗi người dùng).</p>
<p>Hình dung bảng điện, bộ điều nhiệt và sổ khách của một toà nhà đều được cất trong <em>một</em> tủ khoá có các ngăn dán nhãn. Ngăn <code>SYSTEM</code> chứa thứ nhân cần để khởi động (driver nào nạp, theo thứ tự nào); <code>SOFTWARE</code> chứa cấu hình chương trình đã cài và đăng ký lớp COM; <code>SAM</code> chứa tài khoản người dùng cục bộ (băm mật khẩu); <code>SECURITY</code> chứa thứ Local Security Authority cần; <code>NTUSER.DAT</code> là ngăn riêng của mỗi cư dân, nạp khi họ đăng nhập; <code>HARDWARE</code> được dựng lại mỗi lần khởi động từ những gì nhân tìm thấy nên chỉ nằm trong bộ nhớ; <code>BCD</code> là Boot Configuration Database, bảo trình nạp khởi động chạy gì.</p>
<p><strong>Tài liệu Microsoft bổ sung gì (learn.microsoft.com, "Registry Hives").</strong> Một hive là "một nhóm logic các khoá, khoá con và giá trị trong registry, có bộ tệp hỗ trợ được nạp vào bộ nhớ khi hệ điều hành khởi động hoặc người dùng đăng nhập". Đa số tệp nằm ở <code>%SystemRoot%\\System32\\Config</code>; <code>Ntuser.dat</code> của mỗi người dùng nằm trong hồ sơ người dùng. Cạnh tệp hive có thể có <code>.log</code> (<strong>nhật ký giao dịch</strong> các thay đổi — registry an toàn khi sập nguồn như hệ thống tệp có journal) và, chỉ với SYSTEM, một bản sao <code>.alt</code>. Đừng học thuộc đuôi tệp; hãy nhớ <em>registry chỉ là các tệp</em> mà <strong>configuration manager</strong> của nhân nạp và giữ trong bộ nhớ.</p>
<p>Câu trả lời của Linux cho "cấu hình ở đâu?" cố ý khác: <strong>không có cơ sở dữ liệu trung tâm</strong>. Cấu hình nhân là cây tệp ảo dưới <code>/proc/sys</code> (đọc và ghi trực tiếp bằng <code>sysctl</code>), cấu hình toàn hệ thống là tệp văn bản dưới <code>/etc</code>, cấu hình từng người dùng là "dotfile" trong thư mục home. Chạy thử:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Windows giữ cấu hình trong MỘT cơ sở dữ liệu (registry); Linux giữ trong tệp văn bản dưới /etc và "nút vặn" nhân đang chạy dưới /proc/sys<br>
# HKLM\\SYSTEM (cấu hình nhân) &lt;-&gt; /proc/sys, cây khóa và giá trị đọc như tệp<br>
$ ls /proc/sys<br>
abi<br>
debug<br>
dev<br>
fs<br>
kernel<br>
net<br>
sunrpc<br>
user<br>
vm<br>
$ sysctl kernel.ostype kernel.hostname<br>
kernel.ostype = Linux<br>
kernel.hostname = osg-lab<br>
$ echo "number of kernel values under /proc/sys: $(find /proc/sys -type f | wc -l)"<br>
number of kernel values under /proc/sys: 1771<br>
# Đổi một giá trị NGAY (như sửa HKLM\\SYSTEM\\...; nhân biết ngay, không cần khởi động lại)<br>
$ sysctl -w kernel.hostname=registry-demo<br>
kernel.hostname = registry-demo<br>
$ echo "changed live: $(hostname)"<br>
changed live: registry-demo<br>
# HKLM\\SOFTWARE (cấu hình từng ứng dụng) &lt;-&gt; tệp văn bản trong /etc, sửa bằng trình soạn thảo bất kỳ<br>
$ ls /etc | head -12<br>
adduser.conf<br>
alternatives<br>
apparmor.d<br>
apt<br>
bash.bashrc<br>
bindresvport.blacklist<br>
ca-certificates<br>
ca-certificates.conf<br>
cron.d<br>
cron.daily<br>
cron.weekly<br>
debconf.conf<br>
# HKEY_USERS\\&lt;id&gt; (nhánh riêng người dùng, NTUSER.DAT) &lt;-&gt; tệp dotfile trong thư mục home<br>
$ ls -a /home/sv | head<br>
.<br>
..<br>
.bash_logout<br>
.bashrc<br>
.profile</div>
<p>Đọc kết quả: <code>/proc/sys</code> có vài nghìn "nút vặn" nhân (số chính xác tuỳ nhân; ở đây 1.771 giá trị) — họ hàng của <code>HKLM\\SYSTEM\\CurrentControlSet</code>. <code>sysctl -w kernel.hostname=registry-demo</code> đổi một giá trị nhân đang chạy bằng một lệnh và <code>hostname</code> thấy ngay, không cần khởi động lại — giống ghi một giá trị registry mà driver đang theo dõi có thể có hiệu lực tức thì. Cấu hình phải sống qua khởi động lại thì ghi vào <code>/etc/sysctl.d/*.conf</code> (tệp văn bản) — tức ý "tệp bền" của registry, nhưng mỗi cấu hình nằm trong một tệp đọc được riêng.</p>
<p class="pitfall">⚠️ Phương án FE "registry là một phần của nhân luôn nằm trong RAM" (FE17#6 liệt kê <em>registry</em> là phương án sai cho "thành phần thiết yếu của HĐH luôn nằm trong RAM": đáp án ở đó là <em>kernel</em>). Registry là <em>cơ sở dữ liệu lưu trong các tệp hive</em>, do một thành phần executive (configuration manager) quản lý.</p>`],
      [11, 'The Windows Registry (2)',
        `<p class="y-chinh">🎯 Figure 11-10: the Win32 registry API — <code>RegCreateKeyEx</code> (create a key), <code>RegDeleteKey</code> (delete a key), <code>RegOpenKeyEx</code> ("open a key to get a <strong>handle</strong> to it"), <code>RegEnumKeyEx</code> (list the subkeys of the key of the handle), <code>RegQueryValueEx</code> (look up the data for a value in a key). Keys are <em>objects</em> too: you open a key, get a handle, use the handle, close it.</p>
<p>Using the registry from code is like using a file system: you "open the folder" (key), "list the items" (enumerate), "read an item" (query a value). That is why the same handle idea (slide 18) and the same security descriptors (slide 61) protect registry keys as protect files; a registry key even has an ACL you can edit with <code>regedit</code>. In the object name space (slide 20) keys live under <code>\\REGISTRY</code>; the book's table calls the object type <em>Key</em> ("Registry key, used to attach registry to object manager namespace").</p>
<p><strong>Value types you will meet</strong> (from Microsoft's registry documentation, standard names): <code>REG_SZ</code> (a string), <code>REG_DWORD</code> (a 32-bit number), <code>REG_QWORD</code> (64-bit), <code>REG_BINARY</code> (raw bytes), <code>REG_MULTI_SZ</code> (several strings), <code>REG_EXPAND_SZ</code> (a string with <code>%VARIABLES%</code>). Compare Linux text files: everything is text, parsed by each program, which is flexible but means no common validation.</p>
<p><strong>Pros and cons you should be able to argue in a talk.</strong> <em>For a registry:</em> one place to back up or query, typed values, per-key security, atomic transaction log, notification when a key changes (<code>RegNotifyChangeKeyValue</code>). <em>Against:</em> one corrupted hive can stop boot; settings of uninstalled programs pile up ("registry rot"); you cannot diff or version-control it with <code>git</code> as you can <code>/etc</code>. Modern Linux server practice (configuration as text files in git, <code>/etc</code> managed by Ansible or baked into a container image) fits DevOps because of exactly the opposite choice.</p>
<p>Because it is unavoidable on Windows servers, three registry facts matter to a backend developer: environment variables for the whole machine live in <code>HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment</code> and for each user in <code>HKCU\\Environment</code> (so <code>setx /M</code> writes the registry — see Microsoft's Dev Drive page, which uses <code>setx /M npm_config_cache …</code>); Windows services are configured in <code>HKLM\\SYSTEM\\CurrentControlSet\\Services\\&lt;name&gt;</code>; and .NET/IIS settings often live in XML files, not the registry.</p>
<p class="meo">🧠 The mapping to remember: <strong>HKLM\\SYSTEM ↔ /proc/sys + /boot</strong>, <strong>HKLM\\SOFTWARE ↔ /etc</strong>, <strong>HKCU ↔ ~/.config and dotfiles</strong>, <strong>services key ↔ /etc/systemd/system</strong>. (The mapping is a teaching aid, not a rule.)</p>`,
        `<p class="y-chinh">🎯 Hình 11-10: API registry của Win32 — <code>RegCreateKeyEx</code> (tạo khoá), <code>RegDeleteKey</code> (xoá khoá), <code>RegOpenKeyEx</code> ("mở khoá để lấy <strong>handle</strong>"), <code>RegEnumKeyEx</code> (liệt kê khoá con của khoá mà handle trỏ tới), <code>RegQueryValueEx</code> (tra dữ liệu của một giá trị trong khoá). Khoá cũng là <em>đối tượng</em>: mở khoá, lấy handle, dùng handle, đóng.</p>
<p>Dùng registry từ mã giống dùng hệ thống tệp: "mở thư mục" (khoá), "liệt kê mục" (enumerate), "đọc một mục" (query value). Vì vậy cùng ý tưởng handle (slide 18) và cùng security descriptor (slide 61) bảo vệ khoá registry như bảo vệ tệp; khoá registry thậm chí có ACL sửa được bằng <code>regedit</code>. Trong không gian tên đối tượng (slide 20), khoá nằm dưới <code>\\REGISTRY</code>; bảng của sách gọi loại đối tượng là <em>Key</em> ("Khoá registry, dùng để gắn registry vào không gian tên của object manager").</p>
<p><strong>Các kiểu giá trị bạn sẽ gặp</strong> (theo tài liệu registry của Microsoft, tên chuẩn): <code>REG_SZ</code> (chuỗi), <code>REG_DWORD</code> (số 32 bit), <code>REG_QWORD</code> (64 bit), <code>REG_BINARY</code> (byte thô), <code>REG_MULTI_SZ</code> (nhiều chuỗi), <code>REG_EXPAND_SZ</code> (chuỗi có <code>%BIẾN%</code>). So với tệp văn bản Linux: mọi thứ là chữ, mỗi chương trình tự phân tích, linh hoạt nhưng không có kiểm tra chung.</p>
<p><strong>Ưu nhược bạn phải tranh luận được khi thuyết trình.</strong> <em>Ủng hộ registry:</em> một chỗ để sao lưu hay truy vấn, giá trị có kiểu, bảo mật theo từng khoá, nhật ký giao dịch nguyên tử, thông báo khi khoá đổi (<code>RegNotifyChangeKeyValue</code>). <em>Phản đối:</em> một hive hỏng có thể chặn khởi động; cấu hình của chương trình đã gỡ chất đống ("rác registry"); không diff hay quản lý phiên bản bằng <code>git</code> như <code>/etc</code>. Thực hành máy chủ Linux hiện đại (cấu hình là tệp văn bản trong git, <code>/etc</code> do Ansible quản hay nướng vào ảnh container) hợp với DevOps nhờ lựa chọn ngược lại đúng như vậy.</p>
<p>Vì không tránh được trên máy chủ Windows, ba sự thật về registry quan trọng với dev backend: biến môi trường toàn máy nằm ở <code>HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment</code> và của từng người ở <code>HKCU\\Environment</code> (nên <code>setx /M</code> ghi vào registry — xem trang Dev Drive của Microsoft, dùng <code>setx /M npm_config_cache …</code>); dịch vụ Windows được cấu hình ở <code>HKLM\\SYSTEM\\CurrentControlSet\\Services\\&lt;tên&gt;</code>; và cấu hình .NET/IIS thường nằm trong tệp XML, không phải registry.</p>
<p class="meo">🧠 Phép ánh xạ cần nhớ: <strong>HKLM\\SYSTEM ↔ /proc/sys + /boot</strong>, <strong>HKLM\\SOFTWARE ↔ /etc</strong>, <strong>HKCU ↔ ~/.config và dotfile</strong>, <strong>khoá services ↔ /etc/systemd/system</strong>. (Phép ánh xạ là công cụ dạy học, không phải luật.)</p>`],
      [12, 'Operating System Structure',
        `<p class="y-chinh">🎯 Figure 11-11: <strong>Windows kernel-mode organization.</strong> Top: <code>ntdll.dll</code> (user mode — the system library of dispatch routines). Kernel mode, in two big parts: the <strong>NTOS kernel layer</strong> (trap/exception/interrupt dispatch; CPU scheduling and synchronization: threads, ISRs, DPCs, APCs) and the <strong>NTOS executive layer</strong> (process and threads, virtual memory, object manager, configuration manager, LPC, cache manager, I/O manager, security monitor, plus a run-time library). Next to them: <strong>drivers</strong> (file systems, volume manager, TCP/IP, network interfaces, graphics, all devices). Below: the <strong>HAL</strong>, then the hardware.</p>
<p>Imagine a city. The <em>kernel layer</em> is the traffic police: tiny, always on duty, deciding in microseconds who goes next and answering every alarm (interrupt). The <em>executive</em> is city hall with departments: the property office (virtual memory), the registry of names (object manager), the records archive (cache manager), the permits office (security monitor), the post office (I/O manager, LPC). The <em>drivers</em> are contractors for particular buildings (a disk, a network card). The <em>HAL</em> is the translator who knows each neighbourhood's local customs, so city hall never has to.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/4014bce809d73cf290dc2a0507358ec8ece5be20.svg" alt="Windows layers in one picture: user mode (apps → subsystem DLLs → ntdll) and kernel mode (executive, kernel layer, drivers, HAL), with the hypervisor underneath" loading="lazy" /><p class="chu-thich">🧩 Windows layers in one picture: user mode (apps → subsystem DLLs → ntdll) and kernel mode (executive, kernel layer, drivers, HAL), with the hypervisor underneath</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figures 11-4 and 11-11: layers of Windows. User mode: apps -&gt; Win32/WinRT -&gt; ntdll. Kernel mode: executive, kernel layer, drivers, HAL. Below: hypervisor
skinparam rectangle {
  RoundCorner 4
}
rectangle "USER MODE" as U {
  rectangle "Apps: Desktop (Win32, .NET) · Modern (WinRT, AppContainer)" as apps
  rectangle "Subsystem DLLs: kernel32 · user32 · gdi32 · combase" as dll
  rectangle "ntdll.dll — native NT API stubs (NtCreateFile …), the only door into the kernel" as ntdll
  apps -[hidden]down- dll
  dll -[hidden]down- ntdll
}
rectangle "KERNEL MODE" as K {
  rectangle "NTOS executive (ntoskrnl.exe):\\nprocess/thread · virtual memory · object manager · I/O manager · cache manager\\nsecurity reference monitor · configuration manager (registry) · LPC/ALPC · power manager" as exe
  rectangle "NTOS kernel layer: dispatcher, scheduling, interrupts, DPC/APC, synchronization" as ker
  rectangle "Device drivers: file systems, volume, TCP/IP, graphics (win32k.sys), all devices" as drv
  rectangle "HAL (hal.dll) — hides chipset differences" as hal
  exe -[hidden]down- ker
  drv -[hidden]right- exe
  ker -[hidden]down- hal
}
rectangle "Hypervisor (Hyper-V: hvix64 / hvax64) — in Windows 8+ it can run UNDER the kernel" as hv
rectangle "Hardware: CPU, MMU, interrupt controllers, memory, devices, firmware" as hw
ntdll --&gt; exe : syscall / sysenter\\n(trap into kernel mode)
hal --&gt; hv
hv --&gt; hw
@enduml</code></pre></details>
<p>Unlike a textbook <em>microkernel</em>, all of this runs in kernel mode in <strong>one address space</strong> (so a bad driver can crash the whole machine — the famous blue screen, <em>bugcheck</em>). The book calls the design "layered" but notes that in practice the executive and drivers call each other freely. Windows borrowed the microkernel <em>vocabulary</em> (kernel, executive, subsystems that talk by messages) without paying the message-passing cost inside the kernel. Linux is also a monolithic kernel (Chapter 10); the practical difference is not <em>monolithic versus micro</em> but <em>object model versus file model</em>, and the way drivers are layered (slide 16).</p>
<p><strong>The terms DPC and APC</strong> (named in the figure) are worth a sentence each. An interrupt must be answered quickly, so the <em>interrupt service routine</em> (ISR) does only the urgent part and queues a <strong>deferred procedure call</strong> (DPC) for the rest, which runs soon after at lower urgency. An <strong>asynchronous procedure call</strong> (APC) is a function queued to run <em>in the context of a particular thread</em> — the way Windows delivers I/O completions to a thread or terminates it. Linux's cousins: the "top half / bottom half" of an interrupt (softirq, tasklet) and <em>signals</em>.</p>
<p><strong>➕ Power management.</strong> Chapter 11 of the book has a section on power management (11.9) that the slides skip. Power is handled by the executive's power manager together with drivers: devices and the CPU move between low-power states, and the system between sleep states. Microsoft's Modern Standby page (learn.microsoft.com) explains that Windows 8.1 introduced <strong>Connected Standby</strong> and Windows 10 extended it to <strong>Modern Standby</strong>: "instant on / instant off" like a phone, using the <strong>S0 low power idle</strong> model instead of the traditional <strong>S3 sleep</strong>, so the machine can stay connected and run short background bursts while the screen is off; resuming takes under one second. On Linux servers the cousin is <em>runtime PM</em> and <code>cpufreq</code>; in the cloud you rarely think about it because the hypervisor owns power.</p>`,
        `<p class="y-chinh">🎯 Hình 11-11: <strong>tổ chức chế độ nhân của Windows.</strong> Trên cùng: <code>ntdll.dll</code> (chế độ người dùng — thư viện hệ thống các hàm điều phối). Chế độ nhân gồm hai phần lớn: <strong>tầng kernel NTOS</strong> (điều phối bẫy/ngoại lệ/ngắt; lập lịch CPU và đồng bộ: luồng, ISR, DPC, APC) và <strong>tầng executive NTOS</strong> (tiến trình và luồng, bộ nhớ ảo, object manager, configuration manager, LPC, cache manager, I/O manager, security monitor, cùng thư viện chạy). Bên cạnh: <strong>driver</strong> (hệ thống tệp, volume manager, TCP/IP, giao diện mạng, đồ hoạ, mọi thiết bị). Phía dưới: <strong>HAL</strong>, rồi phần cứng.</p>
<p>Hình dung một thành phố. <em>Tầng kernel</em> là cảnh sát giao thông: nhỏ xíu, luôn trực, quyết định trong vài micro giây ai đi tiếp và trả lời mọi chuông báo (ngắt). <em>Executive</em> là toà thị chính với các phòng ban: phòng bất động sản (bộ nhớ ảo), sổ đăng ký tên (object manager), kho lưu trữ (cache manager), phòng cấp phép (security monitor), bưu điện (I/O manager, LPC). <em>Driver</em> là nhà thầu của từng toà nhà (một ổ đĩa, một card mạng). <em>HAL</em> là người phiên dịch biết phong tục từng khu, nên toà thị chính không phải biết.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/4014bce809d73cf290dc2a0507358ec8ece5be20.svg" alt="Các tầng Windows trong một hình: chế độ người dùng (ứng dụng → DLL hệ thống con → ntdll) và chế độ nhân (executive, tầng kernel, driver, HAL), hypervisor ở dưới" loading="lazy" /><p class="chu-thich">🧩 Các tầng Windows trong một hình: chế độ người dùng (ứng dụng → DLL hệ thống con → ntdll) và chế độ nhân (executive, tầng kernel, driver, HAL), hypervisor ở dưới</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-4 và 11-11: các tầng của Windows. Chế độ người dùng: ứng dụng -&gt; Win32/WinRT -&gt; ntdll. Chế độ nhân: executive, tầng kernel, driver, HAL. Dưới cùng: hypervisor
skinparam rectangle {
  RoundCorner 4
}
rectangle "USER MODE" as U {
  rectangle "Apps: Desktop (Win32, .NET) · Modern (WinRT, AppContainer)" as apps
  rectangle "Subsystem DLLs: kernel32 · user32 · gdi32 · combase" as dll
  rectangle "ntdll.dll — native NT API stubs (NtCreateFile …), the only door into the kernel" as ntdll
  apps -[hidden]down- dll
  dll -[hidden]down- ntdll
}
rectangle "KERNEL MODE" as K {
  rectangle "NTOS executive (ntoskrnl.exe):\\nprocess/thread · virtual memory · object manager · I/O manager · cache manager\\nsecurity reference monitor · configuration manager (registry) · LPC/ALPC · power manager" as exe
  rectangle "NTOS kernel layer: dispatcher, scheduling, interrupts, DPC/APC, synchronization" as ker
  rectangle "Device drivers: file systems, volume, TCP/IP, graphics (win32k.sys), all devices" as drv
  rectangle "HAL (hal.dll) — hides chipset differences" as hal
  exe -[hidden]down- ker
  drv -[hidden]right- exe
  ker -[hidden]down- hal
}
rectangle "Hypervisor (Hyper-V: hvix64 / hvax64) — in Windows 8+ it can run UNDER the kernel" as hv
rectangle "Hardware: CPU, MMU, interrupt controllers, memory, devices, firmware" as hw
ntdll --&gt; exe : syscall / sysenter\\n(trap into kernel mode)
hal --&gt; hv
hv --&gt; hw
@enduml</code></pre></details>
<p>Khác <em>vi nhân</em> trong sách giáo khoa, tất cả chạy ở chế độ nhân trong <strong>một không gian địa chỉ</strong> (nên driver hỏng có thể làm sập cả máy — màn hình xanh nổi tiếng, <em>bugcheck</em>). Sách gọi thiết kế là "phân tầng" nhưng ghi chú rằng thực tế executive và driver gọi lẫn nhau thoải mái. Windows mượn <em>từ vựng</em> vi nhân (kernel, executive, hệ thống con nói chuyện bằng thông điệp) mà không trả chi phí chuyền thông điệp trong nhân. Linux cũng là nhân nguyên khối (Chương 10); khác biệt thực tế không phải <em>nguyên khối hay vi nhân</em> mà là <em>mô hình đối tượng hay mô hình tệp</em>, và cách xếp tầng driver (slide 16).</p>
<p><strong>Hai thuật ngữ DPC và APC</strong> (nêu trong hình) đáng một câu mỗi cái. Ngắt phải được trả lời nhanh, nên <em>chương trình phục vụ ngắt</em> (ISR) chỉ làm phần gấp và xếp một <strong>lời gọi thủ tục hoãn</strong> (DPC) cho phần còn lại, chạy ngay sau đó với độ gấp thấp hơn. <strong>Lời gọi thủ tục bất đồng bộ</strong> (APC) là một hàm được xếp để chạy <em>trong ngữ cảnh của một luồng cụ thể</em> — cách Windows chuyển kết quả hoàn thành I/O tới một luồng hay kết thúc nó. Họ hàng Linux: "nửa trên / nửa dưới" của ngắt (softirq, tasklet) và <em>tín hiệu</em>.</p>
<p><strong>➕ Quản lý năng lượng.</strong> Chương 11 của sách có một mục quản lý năng lượng (11.9) mà slide bỏ qua. Năng lượng do power manager của executive cùng driver xử lý: thiết bị và CPU chuyển giữa các trạng thái tiết kiệm điện, và hệ thống giữa các trạng thái ngủ. Trang Modern Standby của Microsoft (learn.microsoft.com) giải thích Windows 8.1 đưa ra <strong>Connected Standby</strong> và Windows 10 mở rộng thành <strong>Modern Standby</strong>: "bật/tắt tức thì" như điện thoại, dùng mô hình <strong>S0 low power idle</strong> thay cho <strong>ngủ S3</strong> truyền thống, nên máy vẫn kết nối và chạy các đợt nền ngắn khi màn hình tắt; tiếp tục chạy mất dưới một giây. Trên máy chủ Linux họ hàng là <em>runtime PM</em> và <code>cpufreq</code>; trên đám mây bạn hiếm khi nghĩ tới vì hypervisor nắm năng lượng.</p>`],
      [13, 'The Hardware Abstraction Layer',
        `<p class="y-chinh">🎯 Figure 11-12: the <strong>Hardware Abstraction Layer (HAL)</strong>, <code>hal.dll</code>, hides the differences between motherboards: <em>device registers</em>, <em>device addresses</em>, <em>interrupts</em>, <em>DMA</em>, <em>timers</em>, <em>spin locks</em> and <em>firmware</em> interfaces. The kernel and drivers call HAL functions instead of touching chipset registers, so one NT kernel binary runs on many PC designs.</p>
<p>Think of a universal travel adapter. Your laptop charger (the kernel) has one plug; each country (each chipset) has a different socket; the adapter (HAL) is the only part that changes between countries. The list in the figure is the list of "sockets" that differ: how you read a device register (memory-mapped or I/O port), how interrupts are routed, how DMA is set up, how to read the hardware timer, how to implement a spin lock on a multiprocessor, how to call firmware.</p>
<p>A fair question from the audience: "does the HAL still matter?" Mostly less. In 1993 PCs had very different chipsets and NT also targeted non-x86 CPUs; today the hardware is far more uniform (standard interrupt controllers, ACPI tables, UEFI), and the HAL has become thinner. Linux solves the same problem with <em>architecture-specific directories</em> in the source tree (<code>arch/x86</code>, <code>arch/arm64</code>) and device trees / ACPI — the abstraction exists, but it is compiled in, not shipped as a separate DLL.</p>
<p>Why this matters to you <em>now</em>: a hypervisor is another HAL-like layer. In Windows with Hyper-V enabled (slide 5's figure) the kernel can run on top of a hypervisor and talk to <strong>virtual</strong> timers, interrupt controllers and devices; Microsoft's Hyper-V documentation describes the child partitions as seeing "a virtual view of the processor" and virtual devices reached through the <strong>VMBus</strong>. It is the same trick as in Chapter 7: abstraction layers let the same OS run on real or virtual hardware.</p>
<p class="pitfall">⚠️ The HAL is not a "driver for everything": device-specific work belongs to <strong>drivers</strong> (slides 15–16). The HAL only abstracts the <em>platform</em> pieces that every driver and the kernel itself need (interrupt controller, timer, DMA, bus access).</p>
<div class="callout">🧭 <strong>On a real server:</strong> you only notice the HAL when it breaks — after cloning a Windows disk onto very different hardware, old HAL/driver choices can produce a boot failure (the notorious <code>INACCESSIBLE_BOOT_DEVICE</code> stop code). Cloud images avoid this by using standard virtual hardware (virtio on Linux, Hyper-V synthetic devices on Windows).</div>`,
        `<p class="y-chinh">🎯 Hình 11-12: <strong>Hardware Abstraction Layer (HAL)</strong>, <code>hal.dll</code>, che giấu khác biệt giữa các bo mạch chủ: <em>thanh ghi thiết bị</em>, <em>địa chỉ thiết bị</em>, <em>ngắt</em>, <em>DMA</em>, <em>bộ đếm giờ</em>, <em>spin lock</em> và giao diện <em>firmware</em>. Nhân và driver gọi hàm HAL thay vì chạm thanh ghi chipset, nên một tệp nhị phân nhân NT chạy trên nhiều thiết kế PC.</p>
<p>Hình dung chiếc ổ cắm du lịch đa năng. Sạc laptop (nhân) có một phích; mỗi nước (mỗi chipset) có ổ cắm khác; bộ chuyển đổi (HAL) là phần duy nhất đổi theo nước. Danh sách trong hình là danh sách các "ổ cắm" khác nhau: cách đọc thanh ghi thiết bị (ánh xạ bộ nhớ hay cổng I/O), cách định tuyến ngắt, cách thiết lập DMA, cách đọc bộ đếm giờ phần cứng, cách cài spin lock trên máy đa bộ xử lý, cách gọi firmware.</p>
<p>Câu hỏi công bằng từ khán giả: "HAL còn quan trọng không?" Phần lớn là ít hơn. Năm 1993 PC có chipset rất khác nhau và NT còn nhắm CPU không phải x86; ngày nay phần cứng đồng nhất hơn nhiều (bộ điều khiển ngắt chuẩn, bảng ACPI, UEFI), và HAL đã mỏng đi. Linux giải cùng vấn đề bằng các <em>thư mục theo kiến trúc</em> trong cây mã nguồn (<code>arch/x86</code>, <code>arch/arm64</code>) và device tree / ACPI — sự trừu tượng có đó, nhưng biên dịch sẵn, không phát hành thành DLL riêng.</p>
<p>Vì sao điều này quan trọng với bạn <em>bây giờ</em>: hypervisor là một tầng giống HAL khác. Trong Windows bật Hyper-V (hình ở slide 5) nhân có thể chạy trên hypervisor và nói chuyện với bộ đếm giờ, bộ điều khiển ngắt và thiết bị <strong>ảo</strong>; tài liệu Hyper-V của Microsoft mô tả các partition con thấy "một góc nhìn ảo về bộ xử lý" và thiết bị ảo đi qua <strong>VMBus</strong>. Cùng mẹo như Chương 7: tầng trừu tượng cho phép cùng một HĐH chạy trên phần cứng thật hay ảo.</p>
<p class="pitfall">⚠️ HAL không phải "driver cho mọi thứ": việc riêng của từng thiết bị thuộc về <strong>driver</strong> (slide 15–16). HAL chỉ trừu tượng các mảnh <em>nền tảng</em> mà mọi driver và chính nhân cần (bộ điều khiển ngắt, bộ đếm giờ, DMA, truy cập bus).</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> bạn chỉ để ý HAL khi nó hỏng — sau khi nhân bản đĩa Windows sang phần cứng rất khác, lựa chọn HAL/driver cũ có thể gây lỗi khởi động (mã dừng khét tiếng <code>INACCESSIBLE_BOOT_DEVICE</code>). Ảnh đám mây tránh điều này bằng phần cứng ảo chuẩn (virtio trên Linux, thiết bị synthetic Hyper-V trên Windows).</div>`],
      [14, 'Dispatcher Objects',
        `<p class="y-chinh">🎯 Figure 11-13: every <strong>dispatcher object</strong> (an executive object a thread can wait on) starts with a <code>DISPATCHER_HEADER</code>: <em>object header</em>, a <em>notification/synchronization flag</em>, a <em>signaled state</em> and a <em>list head for waiting threads</em>, followed by object-specific data. A thread that waits on an object that is not <strong>signaled</strong> is put to sleep on that object's list; when the object becomes signaled, the kernel wakes the waiters.</p>
<p>Think of a restaurant's table buzzer. The buzzer is either silent or buzzing (<em>signaled</em>). Customers who hand in their name sit on a waiting list kept <em>at the buzzer</em>. When the buzzer goes off the host wakes up the first customer (a <em>synchronization</em> event: one waiter is released and the buzzer resets itself) or <em>everyone</em> whose name is on the list (a <em>notification</em> event: stays signaled until someone resets it). That single flag in the header is the difference between an auto-reset and a manual-reset event.</p>
<p>The beauty of the design is <strong>one wait call for everything</strong>. <code>WaitForSingleObject(handle, timeout)</code> and <code>WaitForMultipleObjects(n, handles, waitAll, timeout)</code> (slide 35) work on mutexes, semaphores, events, timers, <em>processes</em> (signaled when they exit), <em>threads</em>, <em>jobs</em>, file-change notifications and I/O completion events. A thread can wait for "any one of these 5 things", something that on classic UNIX needs <code>select()</code> or <code>poll()</code> and only for descriptors.</p>
<table>
<thead><tr><th>Windows dispatcher object</th><th>Behaviour</th><th>Linux cousin</th></tr></thead>
<tbody>
<tr><td>Event (manual-reset)</td><td>stays signaled until reset; wakes all</td><td><code>eventfd</code> + epoll, condition variable with broadcast</td></tr>
<tr><td>Event (auto-reset)</td><td>wakes ONE waiter, then clears itself</td><td><code>eventfd</code> (counter), semaphore</td></tr>
<tr><td>Mutex</td><td>owned by one thread, recursive, abandoned-mutex detection</td><td><code>pthread_mutex_t</code> (robust option)</td></tr>
<tr><td>Semaphore</td><td>counter; signaled when count &gt; 0</td><td><code>sem_t</code>, <code>eventfd(EFD_SEMAPHORE)</code></td></tr>
<tr><td>Timer</td><td>signaled at a time/period</td><td><code>timerfd_create</code></td></tr>
<tr><td>Process / thread</td><td>signaled when it terminates</td><td><code>pidfd_open</code>, <code>waitpid</code></td></tr>
</tbody>
</table>
<p>Linux grew a similar "everything is a descriptor you can wait on" model piece by piece (<code>eventfd</code>, <code>timerfd</code>, <code>signalfd</code>, <code>pidfd</code>), so that one <code>epoll_wait</code> can wait for sockets, timers and process exits together — you will see this in slide 49 (it is exactly what Node.js uses).</p>
<p class="pitfall">⚠️ <strong>Mutex vs semaphore.</strong> The Windows mutex has an <em>owner</em> (only the thread that acquired it may release it); a semaphore with count 1 has no owner. The exam answer "a mutex is a binary semaphore" (Chapter 2) is a simplification; Windows documents the difference. The book's Figure 11-21 also lists "Mutex — binary semaphore used to enter a critical region" (slide 26): both readings appear, answer as the question frames it.</p>`,
        `<p class="y-chinh">🎯 Hình 11-13: mọi <strong>dispatcher object</strong> (đối tượng executive mà luồng chờ được) bắt đầu bằng một <code>DISPATCHER_HEADER</code>: <em>phần đầu đối tượng</em>, một <em>cờ thông báo/đồng bộ</em>, một <em>trạng thái được báo hiệu (signaled)</em> và <em>đầu danh sách các luồng đang chờ</em>, rồi tới dữ liệu riêng của đối tượng. Luồng chờ một đối tượng chưa <strong>signaled</strong> bị cho ngủ trên danh sách của đối tượng đó; khi đối tượng thành signaled, nhân đánh thức những luồng đang chờ.</p>
<p>Hình dung chiếc chuông bàn của nhà hàng. Chuông hoặc im hoặc reo (<em>signaled</em>). Khách đưa tên ngồi trong danh sách chờ giữ <em>ngay tại chuông</em>. Khi chuông reo, quản lý đánh thức khách đầu tiên (event <em>đồng bộ</em>: một người chờ được thả và chuông tự reset) hoặc <em>tất cả</em> khách có tên trong danh sách (event <em>thông báo</em>: giữ signaled đến khi ai đó reset). Một cờ duy nhất trong phần đầu là khác biệt giữa event tự reset và event reset thủ công.</p>
<p>Cái hay của thiết kế là <strong>một lời gọi chờ cho mọi thứ</strong>. <code>WaitForSingleObject(handle, timeout)</code> và <code>WaitForMultipleObjects(n, handles, waitAll, timeout)</code> (slide 35) dùng được cho mutex, semaphore, event, timer, <em>tiến trình</em> (signaled khi thoát), <em>luồng</em>, <em>job</em>, thông báo thay đổi tệp và sự kiện hoàn thành I/O. Một luồng có thể chờ "bất kỳ một trong 5 thứ này", điều mà UNIX cổ điển cần <code>select()</code> hay <code>poll()</code> và chỉ cho descriptor.</p>
<table>
<thead><tr><th>Dispatcher object Windows</th><th>Hành vi</th><th>Họ hàng Linux</th></tr></thead>
<tbody>
<tr><td>Event (reset thủ công)</td><td>giữ signaled đến khi reset; đánh thức tất cả</td><td><code>eventfd</code> + epoll, biến điều kiện với broadcast</td></tr>
<tr><td>Event (tự reset)</td><td>đánh thức MỘT luồng chờ rồi tự xoá</td><td><code>eventfd</code> (bộ đếm), semaphore</td></tr>
<tr><td>Mutex</td><td>thuộc một luồng, đệ quy được, phát hiện mutex bị bỏ rơi</td><td><code>pthread_mutex_t</code> (tuỳ chọn robust)</td></tr>
<tr><td>Semaphore</td><td>bộ đếm; signaled khi đếm &gt; 0</td><td><code>sem_t</code>, <code>eventfd(EFD_SEMAPHORE)</code></td></tr>
<tr><td>Timer</td><td>signaled vào một giờ/chu kỳ</td><td><code>timerfd_create</code></td></tr>
<tr><td>Tiến trình / luồng</td><td>signaled khi kết thúc</td><td><code>pidfd_open</code>, <code>waitpid</code></td></tr>
</tbody>
</table>
<p>Linux lớn dần mô hình tương tự "mọi thứ là descriptor chờ được" từng mảnh (<code>eventfd</code>, <code>timerfd</code>, <code>signalfd</code>, <code>pidfd</code>), để một <code>epoll_wait</code> chờ được socket, bộ đếm giờ và tiến trình thoát cùng lúc — bạn sẽ thấy ở slide 49 (đúng thứ Node.js dùng).</p>
<p class="pitfall">⚠️ <strong>Mutex so với semaphore.</strong> Mutex Windows có <em>chủ</em> (chỉ luồng đã lấy mới nhả được); semaphore đếm 1 không có chủ. Đáp án thi "mutex là semaphore nhị phân" (Chương 2) là cách nói đơn giản hoá; Windows ghi rõ sự khác biệt. Hình 11-21 của sách cũng ghi "Mutex — semaphore nhị phân dùng để vào vùng găng" (slide 26): cả hai cách đọc đều xuất hiện, hãy trả lời theo cách câu hỏi đặt.</p>`],
      [15, 'The Device Drivers (1)',
        `<p class="y-chinh">🎯 Figure 11-14 (first half): the <strong>I/O manager</strong> sends an <strong>IRP</strong> (I/O request packet) <em>down a stack</em> of drivers. For each NTFS volume there is a stack: a <em>file-system filter</em> (one or more), then the <em>file-system driver</em> (NTFS), and below it more layers. The same <strong>driver code</strong> (e.g. NTFS driver, filter driver) is shared by the stacks of C: and D:, but each stack has its <strong>own device objects</strong>.</p>
<p>Think of an assembly line in a parcel depot with several inspection stations. A parcel (the IRP) goes through a security scanner (a filter driver), a customs desk (the file system), a sorter (the volume manager) and a loader (the disk driver). Each station may stamp it, pass it on, change it or stop it. Two lines (C: and D:) use the <em>same machines</em> (driver code, installed once) but each line has its own conveyor and its own station records (device objects).</p>
<p>Three words that look similar and are not: a <strong>driver object</strong> represents the <em>loaded code</em> (one per driver, with a table of functions — slide 50); a <strong>device object</strong> represents <em>one instance of a thing</em> (this disk, this volume) and links to its driver; a <strong>device stack</strong> is a chain of device objects that a request travels through. <em>Filter drivers</em> are the designed-in way to extend behaviour without changing the driver below: antivirus, encryption, backup, quota, and — on Dev Drive — the performance-mode trick that Microsoft's documentation describes (it lists filters such as <code>WdFilter</code> for Defender and <code>bindFlt</code>/<code>wcifs</code> for Docker containers, and the file-system filter manager decides which attach).</p>
<p>The Linux equivalent is the <strong>block layer + VFS</strong>: a <code>read()</code> goes through the VFS, the file system (ext4), the page cache, the block layer with its I/O scheduler, and a device driver. Stacking exists too, in <strong>device-mapper</strong> (LVM, dm-crypt, RAID) — a "filter" under the file system that encrypts or mirrors — and in <strong>overlayfs</strong>, which is how Docker image layers work (a union of directories, lower = read-only, upper = writable). So "antivirus filter on every file open" and "overlayfs under every container" are the same <em>idea</em> built differently.</p>
<p class="meo">🧠 Three-word summary for the exam: <strong>IRP goes down, completes up</strong>. A driver can finish the request itself (and the IRP never reaches lower layers) or pass it on; when the hardware is done the IRP travels back up the same stack (slide 24, step 8).</p>`,
        `<p class="y-chinh">🎯 Hình 11-14 (nửa đầu): <strong>I/O manager</strong> gửi một <strong>IRP</strong> (I/O request packet) <em>xuống một chồng</em> driver. Với mỗi volume NTFS có một chồng: một hay nhiều <em>bộ lọc hệ thống tệp</em>, rồi <em>driver hệ thống tệp</em> (NTFS), và bên dưới nữa là các tầng khác. Cùng một <strong>mã driver</strong> (vd driver NTFS, driver lọc) được chia sẻ giữa chồng của C: và D:, nhưng mỗi chồng có <strong>device object riêng</strong>.</p>
<p>Hình dung dây chuyền trong kho bưu kiện có vài trạm kiểm tra. Bưu kiện (IRP) đi qua máy soi an ninh (driver lọc), quầy hải quan (hệ thống tệp), máy phân loại (volume manager) và bộ xếp hàng (driver đĩa). Mỗi trạm có thể đóng dấu, chuyển tiếp, sửa hay chặn. Hai dây chuyền (C: và D:) dùng <em>cùng máy</em> (mã driver, cài một lần) nhưng mỗi dây có băng tải và sổ trạm riêng (device object).</p>
<p>Ba từ trông giống nhau mà khác nhau: <strong>driver object</strong> đại diện <em>mã đã nạp</em> (một cái cho mỗi driver, kèm bảng hàm — slide 50); <strong>device object</strong> đại diện <em>một thể hiện của một thứ</em> (đĩa này, volume này) và liên kết tới driver của nó; <strong>device stack</strong> là chuỗi device object mà một yêu cầu đi qua. <em>Driver lọc</em> là cách được thiết kế sẵn để mở rộng hành vi mà không sửa driver bên dưới: antivirus, mã hoá, sao lưu, hạn mức, và — trên Dev Drive — mẹo chế độ hiệu năng mà tài liệu Microsoft mô tả (nó liệt kê các bộ lọc như <code>WdFilter</code> cho Defender và <code>bindFlt</code>/<code>wcifs</code> cho container Docker, và filter manager quyết định cái nào được gắn).</p>
<p>Tương đương Linux là <strong>tầng khối + VFS</strong>: một <code>read()</code> đi qua VFS, hệ thống tệp (ext4), page cache, tầng khối với bộ lập lịch I/O của nó, và một driver thiết bị. Xếp chồng cũng có, trong <strong>device-mapper</strong> (LVM, dm-crypt, RAID) — một "bộ lọc" dưới hệ thống tệp mã hoá hay nhân đôi — và trong <strong>overlayfs</strong>, cách các lớp ảnh Docker hoạt động (hợp của các thư mục, lớp dưới chỉ đọc, lớp trên ghi được). Nên "bộ lọc antivirus ở mỗi lần mở tệp" và "overlayfs dưới mỗi container" là cùng một <em>ý</em> dựng khác nhau.</p>
<p class="meo">🧠 Tóm tắt ba từ cho kỳ thi: <strong>IRP đi xuống, hoàn thành đi lên</strong>. Một driver có thể tự hoàn thành yêu cầu (IRP không bao giờ tới tầng dưới) hoặc chuyển tiếp; khi phần cứng xong, IRP đi ngược lên qua cùng chồng (slide 24, bước 8).</p>`],
      [16, 'The Device Drivers (2)',
        `<p class="y-chinh">🎯 Figure 11-14 (second half) draws the two stacks side by side: for <strong>C:</strong> — file system filter → <em>C: file system</em> (NTFS driver) → <em>C: volume</em> (volume manager driver) → <em>C: disk class device</em> (disk class driver) → <em>C: disk partition</em> (disk mini-port driver); and the same for <strong>D:</strong>. "Each device object links to a driver object with function entry points." The braces show: a <em>device stack</em> is made of the device objects of one volume; the drivers are shared.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/1900be0aed74641251920644067755fefb874466.svg" alt="Figures 11-14 and 11-38 redrawn: C: and D: have separate device stacks (device objects) but share one copy of each driver's code" loading="lazy" /><p class="chu-thich">🧩 Figures 11-14 and 11-38 redrawn: C: and D: have separate device stacks (device objects) but share one copy of each driver's code</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figures 11-14 and 11-38: two NTFS volumes C: and D: have their OWN device stacks of device objects, but share the same driver code
skinparam rectangle {
  RoundCorner 3
}
rectangle "I/O manager\\nIRP (I/O Request Packet): operation code, buffers,\\ncompletion info, the thread, a chain link" as io #FEF9C3
package "Device stack of C:" as sc {
  rectangle "C: file-system filter\\n(device object)" as c1
  rectangle "C: file system\\n(device object)" as c2
  rectangle "C: volume\\n(device object)" as c3
  rectangle "C: disk class device" as c4
  rectangle "C: disk partition" as c5
}
package "Device stack of D:" as sd {
  rectangle "D: file-system filter" as d1
  rectangle "D: file system" as d2
  rectangle "D: volume" as d3
  rectangle "D: disk class device" as d4
  rectangle "D: disk partition" as d5
}
package "Driver code (one copy in memory)" as dr {
  rectangle "filter driver" as x1
  rectangle "NTFS driver" as x2
  rectangle "volume manager driver" as x3
  rectangle "disk class driver" as x4
  rectangle "disk mini-port driver" as x5
}
io --&gt; c1
c1 --&gt; c2
c2 --&gt; c3
c3 --&gt; c4
c4 --&gt; c5
io --&gt; d1
d1 --&gt; d2
d2 --&gt; d3
d3 --&gt; d4
d4 --&gt; d5
c1 ..&gt; x1
d1 ..&gt; x1
c2 ..&gt; x2
d2 ..&gt; x2
c3 ..&gt; x3
d3 ..&gt; x3
c4 ..&gt; x4
d4 ..&gt; x4
c5 ..&gt; x5
d5 ..&gt; x5
note bottom of dr : each level has a dispatch table:\\nCREATE, READ, WRITE, FLUSH, IOCTL, CLEANUP, CLOSE …
@enduml</code></pre></details>
<p>Read the picture bottom-up to understand the layers: the <strong>disk mini-port driver</strong> speaks to one concrete controller (SATA, NVMe, USB); the <strong>disk class driver</strong> knows what any disk can do (read sectors, report size) independent of controller; the <strong>volume manager</strong> turns partitions or sets of partitions (spanned, striped, mirrored volumes) into <em>volumes</em>; the <strong>file-system driver</strong> turns a volume into files; <strong>filter drivers</strong> may sit anywhere. This layering is why you can put NTFS on a USB stick, a virtual disk (VHDX), an SSD or a network disk with no change in NTFS.</p>
<p>Linux layering is the same idea with different names. See the real layers of the machine running this lesson (printed by the second part of the program on slide 8): the block devices <code>vda</code>, <code>vdb</code> (virtio disks of Docker's VM) with an I/O scheduler (<code>mq-deadline</code>) chosen per queue. A file system (ext4) sits on top of <code>vda</code>/<code>vdb</code>; device-mapper may add LVM or encryption between them — just as a volume manager sits between disk and NTFS.</p>
<p><strong>Driver models today.</strong> Microsoft's driver framework moved from the Windows Driver Model (WDM, 1990s, what the book describes) to the <em>Windows Driver Frameworks</em> (KMDF/UMDF), and <strong>user-mode drivers</strong> are encouraged because a user-mode crash cannot blue-screen the machine. This is a direct lesson from the monolithic-kernel weakness of slide 12. Linux's answer is the opposite choice (drivers are kernel code, mostly open-source and reviewed by many), plus FUSE and eBPF for the cases where you want logic outside the kernel. A security extension on top: with <strong>HVCI</strong> (slide 63) Windows refuses to load kernel drivers that are not correctly signed, even if an attacker has admin rights.</p>
<p class="pitfall">⚠️ Exam wording: "<em>each device object links to a driver object</em>" (not the other way around as the main pointer), and "the stacking is represented by device objects" (Figure 11-38 caption: "The stacking is represented by device objects"). If a question asks what represents the stack, answer <em>device objects</em>, not "drivers".</p>`,
        `<p class="y-chinh">🎯 Hình 11-14 (nửa sau) vẽ hai chồng cạnh nhau: với <strong>C:</strong> — bộ lọc hệ thống tệp → <em>hệ thống tệp C:</em> (driver NTFS) → <em>volume C:</em> (driver volume manager) → <em>thiết bị lớp đĩa C:</em> (driver lớp đĩa) → <em>phân vùng đĩa C:</em> (driver mini-port đĩa); và tương tự với <strong>D:</strong>. "Mỗi device object liên kết tới một driver object có các điểm vào hàm." Dấu ngoặc nhọn cho thấy: <em>device stack</em> gồm các device object của một volume; driver được dùng chung.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/1900be0aed74641251920644067755fefb874466.svg" alt="Hình 11-14 và 11-38 vẽ lại: C: và D: có chồng thiết bị (device object) riêng nhưng dùng chung một bản mã của mỗi driver" loading="lazy" /><p class="chu-thich">🧩 Hình 11-14 và 11-38 vẽ lại: C: và D: có chồng thiết bị (device object) riêng nhưng dùng chung một bản mã của mỗi driver</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-14 và 11-38: hai volume NTFS C: và D: có chồng device object RIÊNG, nhưng dùng chung mã driver
skinparam rectangle {
  RoundCorner 3
}
rectangle "I/O manager\\nIRP (I/O Request Packet): operation code, buffers,\\ncompletion info, the thread, a chain link" as io #FEF9C3
package "Device stack of C:" as sc {
  rectangle "C: file-system filter\\n(device object)" as c1
  rectangle "C: file system\\n(device object)" as c2
  rectangle "C: volume\\n(device object)" as c3
  rectangle "C: disk class device" as c4
  rectangle "C: disk partition" as c5
}
package "Device stack of D:" as sd {
  rectangle "D: file-system filter" as d1
  rectangle "D: file system" as d2
  rectangle "D: volume" as d3
  rectangle "D: disk class device" as d4
  rectangle "D: disk partition" as d5
}
package "Driver code (one copy in memory)" as dr {
  rectangle "filter driver" as x1
  rectangle "NTFS driver" as x2
  rectangle "volume manager driver" as x3
  rectangle "disk class driver" as x4
  rectangle "disk mini-port driver" as x5
}
io --&gt; c1
c1 --&gt; c2
c2 --&gt; c3
c3 --&gt; c4
c4 --&gt; c5
io --&gt; d1
d1 --&gt; d2
d2 --&gt; d3
d3 --&gt; d4
d4 --&gt; d5
c1 ..&gt; x1
d1 ..&gt; x1
c2 ..&gt; x2
d2 ..&gt; x2
c3 ..&gt; x3
d3 ..&gt; x3
c4 ..&gt; x4
d4 ..&gt; x4
c5 ..&gt; x5
d5 ..&gt; x5
note bottom of dr : each level has a dispatch table:\\nCREATE, READ, WRITE, FLUSH, IOCTL, CLEANUP, CLOSE …
@enduml</code></pre></details>
<p>Đọc hình từ dưới lên để hiểu các tầng: <strong>driver mini-port đĩa</strong> nói với một bộ điều khiển cụ thể (SATA, NVMe, USB); <strong>driver lớp đĩa</strong> biết mọi ổ đĩa làm được gì (đọc sector, báo dung lượng) không phụ thuộc bộ điều khiển; <strong>volume manager</strong> biến phân vùng hay tập phân vùng (volume nối, sọc, gương) thành <em>volume</em>; <strong>driver hệ thống tệp</strong> biến volume thành tệp; <strong>driver lọc</strong> có thể nằm ở bất kỳ đâu. Phân tầng này là lý do bạn đặt NTFS lên USB, đĩa ảo (VHDX), SSD hay đĩa mạng mà NTFS không phải đổi.</p>
<p>Phân tầng của Linux là cùng ý với tên khác. Xem các tầng thật của máy chạy bài này (in bởi phần hai của chương trình ở slide 8): thiết bị khối <code>vda</code>, <code>vdb</code> (đĩa virtio của máy ảo Docker) với bộ lập lịch I/O (<code>mq-deadline</code>) chọn cho mỗi hàng đợi. Một hệ thống tệp (ext4) nằm trên <code>vda</code>/<code>vdb</code>; device-mapper có thể thêm LVM hay mã hoá ở giữa — như volume manager nằm giữa đĩa và NTFS.</p>
<p><strong>Mô hình driver ngày nay.</strong> Khung driver của Microsoft đã chuyển từ Windows Driver Model (WDM, thập niên 1990, thứ sách mô tả) sang <em>Windows Driver Frameworks</em> (KMDF/UMDF), và <strong>driver chế độ người dùng</strong> được khuyến khích vì một vụ sập ở chế độ người dùng không làm màn hình xanh cả máy. Đây là bài học trực tiếp từ điểm yếu nhân nguyên khối ở slide 12. Câu trả lời của Linux là lựa chọn ngược lại (driver là mã nhân, phần lớn mã nguồn mở và nhiều người rà soát), cộng FUSE và eBPF cho trường hợp muốn đặt logic ngoài nhân. Thêm một lớp bảo mật: với <strong>HVCI</strong> (slide 63) Windows từ chối nạp driver nhân không được ký đúng, kể cả khi kẻ tấn công có quyền admin.</p>
<p class="pitfall">⚠️ Cách diễn đạt trong đề thi: "<em>mỗi device object liên kết tới một driver object</em>" (không phải ngược lại là con trỏ chính), và "việc xếp chồng được biểu diễn bằng device object" (chú thích Hình 11-38: "The stacking is represented by device objects"). Nếu câu hỏi hỏi cái gì biểu diễn chồng, đáp <em>device object</em>, không phải "driver".</p>`],
      [17, 'Implementation of the Object Manager',
        `<p class="y-chinh">🎯 Figure 11-15: every executive object has an <strong>object header</strong> (the same for all types) and an <strong>object body</strong> (type-specific). The header holds: <em>object name</em>, <em>directory in which the object lives</em>, <em>security information</em> (who may use it), <em>quota charges</em> (what it costs to use), <em>list of processes with handles</em>, <em>reference counts</em> and a <em>pointer to the type object</em>. The <strong>type object</strong> (one per kind: Process, Thread, Mutex, File …) holds: type name, access types, access rights, quota charges, "synchronizable?", "pageable?", and the <strong>methods</strong> — <em>Open, Close, Delete, Query name, Parse, Security</em>.</p>
<p>Think of an ID card system. Each card (object) has the same top strip printed by the city office: name, address of the issuing office, who may inspect it, how many copies exist. The photo and personal details below the strip differ by kind of card (driver's licence, library card). The <em>card type</em> (type object) is a template that also says what the holder is allowed to do with it and which clerk handles special requests (methods). One office (the object manager) can therefore deal with any kind of card because the top strip is the same.</p>
<p><strong>Two counters decide when an object dies</strong> — a classic exam detail. The <em>handle count</em> says how many handles (slide 18) point at it; the <em>pointer (reference) count</em> says how many kernel structures hold a direct pointer. When both fall to zero the object is deleted and its <em>Delete</em> method runs. A <em>temporary</em> object (the default) also disappears when its name's last handle closes; a <em>permanent</em> one survives until explicitly deleted (a named device or a registry key, for example). Compare Linux's <code>struct file</code>: a kernel reference count shared by every descriptor made with <code>dup()</code> or inherited by <code>fork()</code>; the open file is released only when the last descriptor closes — you will see that in slide 18's program.</p>
<p><strong>Quota charges</strong> link objects to resource accounting: creating a process or opening a file is charged to the process's quota, so a program cannot exhaust kernel memory by creating objects without end. Linux does the same job with <em>rlimits</em> and <em>cgroups</em> (slide 28).</p>
<p><strong>Methods as function pointers</strong> are object orientation written in C: the type object contains pointers to functions, and the object manager calls <code>type->OpenProcedure(…)</code>. Linux does the same in a famous place: <code>struct file_operations</code> holds <code>open</code>, <code>read</code>, <code>write</code>, <code>release</code>… and every file system and driver fills in its own table. Different names, one design pattern (a "vtable").</p>
<p class="pitfall">⚠️ "Header vs body" trap: the <em>name</em> and <em>security</em> live in the header (common to all objects), the data that makes a thread a thread (registers, priority) lives in the body. The <em>type object</em> is not inside each object; each object only has a <em>pointer</em> to it.</p>`,
        `<p class="y-chinh">🎯 Hình 11-15: mỗi đối tượng executive có một <strong>phần đầu (object header)</strong> (giống nhau cho mọi loại) và một <strong>phần thân (object body)</strong> (riêng theo loại). Phần đầu giữ: <em>tên đối tượng</em>, <em>thư mục chứa đối tượng</em>, <em>thông tin bảo mật</em> (ai được dùng), <em>phí hạn mức</em> (dùng thì tốn gì), <em>danh sách tiến trình có handle</em>, <em>bộ đếm tham chiếu</em> và <em>con trỏ tới type object</em>. <strong>Type object</strong> (một cái cho mỗi loại: Process, Thread, Mutex, File …) giữ: tên loại, kiểu truy cập, quyền truy cập, phí hạn mức, "đồng bộ được?", "phân trang được?", và các <strong>phương thức</strong> — <em>Open, Close, Delete, Query name, Parse, Security</em>.</p>
<p>Hình dung hệ thống thẻ căn cước. Mỗi thẻ (đối tượng) có cùng dải trên in bởi cơ quan thành phố: tên, địa chỉ nơi cấp, ai được kiểm tra, có bao nhiêu bản. Ảnh và thông tin cá nhân bên dưới khác theo loại thẻ (bằng lái, thẻ thư viện). <em>Loại thẻ</em> (type object) là khuôn mẫu cũng nói người giữ được làm gì với nó và nhân viên nào lo yêu cầu đặc biệt (phương thức). Một cơ quan (object manager) vì thế xử lý được mọi loại thẻ vì dải trên giống nhau.</p>
<p><strong>Hai bộ đếm quyết định khi nào đối tượng chết</strong> — chi tiết thi kinh điển. <em>Bộ đếm handle</em> cho biết có bao nhiêu handle (slide 18) trỏ tới nó; <em>bộ đếm con trỏ (tham chiếu)</em> cho biết có bao nhiêu cấu trúc nhân giữ con trỏ trực tiếp. Khi cả hai về 0 đối tượng bị xoá và phương thức <em>Delete</em> chạy. Đối tượng <em>tạm</em> (mặc định) cũng biến mất khi handle cuối của tên đóng; đối tượng <em>vĩnh viễn</em> sống tới khi bị xoá tường minh (thiết bị có tên hay khoá registry chẳng hạn). So với <code>struct file</code> của Linux: một bộ đếm tham chiếu nhân chia sẻ giữa mọi descriptor tạo bằng <code>dup()</code> hay được <code>fork()</code> thừa kế; tệp mở chỉ được giải phóng khi descriptor cuối đóng — bạn sẽ thấy ở chương trình của slide 18.</p>
<p><strong>Phí hạn mức</strong> nối đối tượng với kế toán tài nguyên: tạo tiến trình hay mở tệp bị tính vào hạn mức của tiến trình, nên chương trình không thể vắt kiệt bộ nhớ nhân bằng cách tạo đối tượng không dứt. Linux làm cùng việc bằng <em>rlimit</em> và <em>cgroup</em> (slide 28).</p>
<p><strong>Phương thức là con trỏ hàm</strong> là hướng đối tượng viết bằng C: type object chứa con trỏ tới hàm, và object manager gọi <code>type->OpenProcedure(…)</code>. Linux làm y vậy ở một chỗ nổi tiếng: <code>struct file_operations</code> chứa <code>open</code>, <code>read</code>, <code>write</code>, <code>release</code>… và mỗi hệ thống tệp, driver điền bảng riêng. Tên khác, một mẫu thiết kế ("vtable").</p>
<p class="pitfall">⚠️ Bẫy "đầu so với thân": <em>tên</em> và <em>bảo mật</em> nằm ở phần đầu (chung cho mọi đối tượng), dữ liệu làm một luồng thành luồng (thanh ghi, độ ưu tiên) nằm ở phần thân. <em>Type object</em> không nằm trong từng đối tượng; mỗi đối tượng chỉ có một <em>con trỏ</em> tới nó.</p>`],
      [18, 'Handles (1)',
        `<p class="y-chinh">🎯 Figure 11-16: a <strong>handle</strong> is an <em>index into the process's handle table</em>. The <strong>handle table descriptor</strong> holds a pointer to a table; in the minimal case the table is one memory page of up to <strong>512 entries</strong>, and each entry points to an object. A handle is meaningful <em>only inside its process</em>: the same number in another process refers to a different object (or nothing).</p>
<p>Return to the cloakroom. You hand over your coat and receive ticket <strong>7</strong>. The ticket says nothing about your coat; it only works at this cloakroom, for you; ticket 7 held by another guest refers to a different coat. The attendant can also check the <em>rights</em> printed on your ticket (may you take it out? may you only look?). This is exactly why handles are safe: a program can only name objects it was <em>given</em> a ticket for, and every use goes through the kernel's check.</p>
<p>Linux has the same device and it is older than Windows: the <strong>file descriptor</strong> (fd) is an index into the process's <em>descriptor table</em>, each slot pointing to an <em>open file description</em> in the kernel. The program below opens three files, duplicates one (<code>dup</code> = Win32 <code>DuplicateHandle</code>), marks one <em>close-on-exec</em> (= <code>bInheritHandle = FALSE</code>), then <code>fork</code>s and <code>exec</code>s a new program and asks which numbers survived.</p>
<pre><code class="language-c">// A handle (Windows) and a file descriptor (Linux) are both a small number that indexes a per-process table
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;limits.h&gt;
#include &lt;sys/wait.h&gt;

static void report(int fd) {
    char link[64], target[PATH_MAX];
    snprintf(link, sizeof link, "/proc/self/fd/%d", fd);
    ssize_t n = readlink(link, target, sizeof target - 1);
    if (n &lt; 0) printf("  fd %d: closed (no such entry)\\n", fd);
    else { target[n] = 0; printf("  fd %d: open -&gt; %s\\n", fd, target); }
}

int main(int argc, char **argv) {
    if (argc &gt; 1 &amp;&amp; strcmp(argv[1], "child") == 0) {          // after exec: who survived?
        printf("child after exec (pid differs, program replaced):\\n");
        report(3); report(4); report(5);
        return 0;
    }
    int a = open("/etc/hostname", O_RDONLY);                  // like CreateFile(..., bInheritHandle = TRUE)
    int b = open("/etc/passwd", O_RDONLY | O_CLOEXEC);        // like bInheritHandle = FALSE: closed on exec
    int c = dup(a);                                           // like DuplicateHandle: a 2nd number, the SAME open file
    close(c);
    int d = open("/etc/group", O_RDONLY);
    printf("parent: a=%d b=%d d=%d (numbers are table slots, lowest free one first)\\n", a, b, d);
    printf("parent before exec:\\n");
    report(3); report(4); report(5);
    fflush(stdout);
    pid_t p = fork();
    if (p == 0) { execl("/proc/self/exe", argv[0], "child", (char *)NULL); perror("exec"); _exit(1); }
    waitpid(p, NULL, 0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-fd.c -o bang-fd &amp;&amp; ./bang-fd<br>
parent: a=3 b=4 d=5 (numbers are table slots, lowest free one first)<br>
parent before exec:<br>
&nbsp;&nbsp;fd 3: open -&gt; /etc/hostname<br>
&nbsp;&nbsp;fd 4: open -&gt; /etc/passwd<br>
&nbsp;&nbsp;fd 5: open -&gt; /etc/group<br>
child after exec (pid differs, program replaced):<br>
&nbsp;&nbsp;fd 3: open -&gt; /etc/hostname<br>
&nbsp;&nbsp;fd 4: closed (no such entry)<br>
&nbsp;&nbsp;fd 5: open -&gt; /etc/group</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read it as a handle story. <strong>(1)</strong> The numbers 3, 4, 5 are the lowest free slots (0, 1, 2 are standard input/output/error — Windows has the same three as <em>standard handles</em>). <strong>(2)</strong> The kernel resolves <code>/proc/self/fd/3</code> to the object the slot points to — Windows tools such as Process Explorer show the same thing. <strong>(3)</strong> After <code>exec</code>, fd 3 and fd 5 are still open in the new program (inherited) but fd 4, opened with <code>O_CLOEXEC</code>, is gone. In Win32 you decide per handle with <code>bInheritHandle</code> (and <code>CreateProcess(…, bInheritHandles, …)</code>). This is the technique that lets a parent give a child a pipe on its standard output — a shell, a CI runner or Node's <code>spawn</code> all rely on it.</p>
<p><strong>Handle leaks are real production bugs.</strong> A server that opens files or sockets and forgets to close them slowly fills its table and then fails with "Too many open files" (Linux, errno <code>EMFILE</code>) or its Windows twin. Windows' <code>CloseHandle</code>/Linux <code>close()</code> must be called for <em>every</em> successful open; in Node use <code>fs.promises</code> with <code>try/finally</code> or streams that close themselves; in Java use try-with-resources.</p>
<p class="pitfall">⚠️ A handle is <em>not</em> a pointer and <em>not</em> unique across processes. Two processes can both have handle 0x1C pointing to different objects; to share an object you must <em>duplicate</em> the handle into the other process (<code>DuplicateHandle</code>) or give both a <em>name</em> (slide 20).</p>`,
        `<p class="y-chinh">🎯 Hình 11-16: một <strong>handle</strong> là <em>một chỉ mục vào bảng handle của tiến trình</em>. <strong>Bộ mô tả bảng handle</strong> giữ con trỏ tới một bảng; ở trường hợp tối thiểu bảng là một trang nhớ chứa tối đa <strong>512 mục</strong>, mỗi mục trỏ tới một đối tượng. Handle chỉ có nghĩa <em>trong tiến trình của nó</em>: cùng con số ở tiến trình khác chỉ một đối tượng khác (hoặc không có gì).</p>
<p>Quay lại phòng gửi áo. Bạn đưa áo và nhận phiếu số <strong>7</strong>. Phiếu không nói gì về chiếc áo; nó chỉ dùng ở phòng gửi này, cho bạn; phiếu 7 của khách khác ứng với chiếc áo khác. Nhân viên còn kiểm được <em>quyền</em> in trên phiếu (bạn được lấy ra? hay chỉ được xem?). Chính vì vậy handle an toàn: chương trình chỉ gọi tên được các đối tượng nó <em>được phát</em> phiếu, và mọi lần dùng đều qua kiểm tra của nhân.</p>
<p>Linux có cùng cơ chế và còn lâu đời hơn Windows: <strong>file descriptor</strong> (fd) là chỉ mục vào <em>bảng descriptor</em> của tiến trình, mỗi ô trỏ tới một <em>open file description</em> trong nhân. Chương trình dưới đây mở ba tệp, nhân đôi một (<code>dup</code> = <code>DuplicateHandle</code> của Win32), đánh dấu một cái <em>close-on-exec</em> (= <code>bInheritHandle = FALSE</code>), rồi <code>fork</code> và <code>exec</code> một chương trình mới và hỏi số nào còn sống.</p>
<pre><code class="language-c">// Handle (Windows) và file descriptor (Linux) đều là một số nhỏ làm chỉ mục vào bảng riêng của từng tiến trình
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;limits.h&gt;
#include &lt;sys/wait.h&gt;

static void report(int fd) {
    char link[64], target[PATH_MAX];
    snprintf(link, sizeof link, "/proc/self/fd/%d", fd);
    ssize_t n = readlink(link, target, sizeof target - 1);
    if (n &lt; 0) printf("  fd %d: closed (no such entry)\\n", fd);
    else { target[n] = 0; printf("  fd %d: open -&gt; %s\\n", fd, target); }
}

int main(int argc, char **argv) {
    if (argc &gt; 1 &amp;&amp; strcmp(argv[1], "child") == 0) {          // sau exec: ai còn sống?
        printf("child after exec (pid differs, program replaced):\\n");
        report(3); report(4); report(5);
        return 0;
    }
    int a = open("/etc/hostname", O_RDONLY);                  // như CreateFile(..., bInheritHandle = TRUE)
    int b = open("/etc/passwd", O_RDONLY | O_CLOEXEC);        // như bInheritHandle = FALSE: đóng khi exec
    int c = dup(a);                                           // như DuplicateHandle: số thứ hai, CÙNG một tệp đang mở
    close(c);
    int d = open("/etc/group", O_RDONLY);
    printf("parent: a=%d b=%d d=%d (numbers are table slots, lowest free one first)\\n", a, b, d);
    printf("parent before exec:\\n");
    report(3); report(4); report(5);
    fflush(stdout);
    pid_t p = fork();
    if (p == 0) { execl("/proc/self/exe", argv[0], "child", (char *)NULL); perror("exec"); _exit(1); }
    waitpid(p, NULL, 0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bang-fd.c -o bang-fd &amp;&amp; ./bang-fd<br>
parent: a=3 b=4 d=5 (numbers are table slots, lowest free one first)<br>
parent before exec:<br>
&nbsp;&nbsp;fd 3: open -&gt; /etc/hostname<br>
&nbsp;&nbsp;fd 4: open -&gt; /etc/passwd<br>
&nbsp;&nbsp;fd 5: open -&gt; /etc/group<br>
child after exec (pid differs, program replaced):<br>
&nbsp;&nbsp;fd 3: open -&gt; /etc/hostname<br>
&nbsp;&nbsp;fd 4: closed (no such entry)<br>
&nbsp;&nbsp;fd 5: open -&gt; /etc/group</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc như một câu chuyện handle. <strong>(1)</strong> Các số 3, 4, 5 là các ô trống thấp nhất (0, 1, 2 là vào/ra/lỗi chuẩn — Windows có đúng ba cái đó gọi là <em>standard handle</em>). <strong>(2)</strong> Nhân giải <code>/proc/self/fd/3</code> thành đối tượng mà ô trỏ tới — công cụ Windows như Process Explorer cho thấy điều tương tự. <strong>(3)</strong> Sau <code>exec</code>, fd 3 và fd 5 vẫn mở trong chương trình mới (thừa kế) nhưng fd 4, mở bằng <code>O_CLOEXEC</code>, biến mất. Trong Win32 bạn quyết định theo từng handle bằng <code>bInheritHandle</code> (và <code>CreateProcess(…, bInheritHandles, …)</code>). Đây là kỹ thuật cho phép cha đưa cho con một pipe làm đầu ra chuẩn — shell, CI runner hay <code>spawn</code> của Node đều dựa vào nó.</p>
<p><strong>Rò handle là lỗi production có thật.</strong> Máy chủ mở tệp hay socket mà quên đóng sẽ dần đầy bảng rồi lỗi "Too many open files" (Linux, errno <code>EMFILE</code>) hay bản sinh đôi trên Windows. <code>CloseHandle</code> của Windows/<code>close()</code> của Linux phải được gọi cho <em>mỗi</em> lần mở thành công; trong Node dùng <code>fs.promises</code> với <code>try/finally</code> hay stream tự đóng; trong Java dùng try-with-resources.</p>
<p class="pitfall">⚠️ Handle <em>không</em> phải con trỏ và <em>không</em> duy nhất giữa các tiến trình. Hai tiến trình có thể cùng có handle 0x1C trỏ tới đối tượng khác nhau; để chia sẻ một đối tượng phải <em>nhân đôi</em> handle sang tiến trình kia (<code>DuplicateHandle</code>) hoặc cho cả hai một <em>cái tên</em> (slide 20).</p>`],
      [19, 'Handles (2)',
        `<p class="y-chinh">🎯 Figure 11-17: a <strong>maximal handle table</strong> has three levels — a top level of up to <strong>32</strong> pointers, mid-level pages of <strong>1024</strong> pointers, and bottom pages of <strong>512</strong> handle entries — so a process can hold <strong>32 × 1024 × 512 = 16,777,216</strong> (2²⁴, "16 million") handles. The table grows <em>on demand</em>: one page for a small process, a tree for a huge one.</p>
<p>Where do the numbers come from? A page is 4096 bytes. A bottom entry of 8 bytes (the 32-bit layout the book draws) gives 4096 / 8 = <strong>512</strong> entries per page. A mid-level page holds 4-byte pointers: 4096 / 4 = <strong>1024</strong>. With 32 top-level pointers: 512 × 1024 × 32 = 2²⁴. Let a program do the multiplication, and then — to feel why 2²⁴ is plenty but not infinite — look at the same idea on Linux:</p>
<pre><code class="language-javascript">// Numbers from the Windows chapter, computed
// 1) Handle table capacity (Figures 11-16 and 11-17: 32-bit entries of 8 bytes)
const PAGE = 4096, ENTRY = 8, PTR = 4;
const perPage = PAGE / ENTRY;                // handles in one bottom page
const perMid = PAGE / PTR;                   // pointers in a mid-level page
const top = 32;                              // pointers in the top level of the book's figure
console.log('handles per bottom page      :', perPage);
console.log('minimal table (1 page)       :', perPage, 'handles');
console.log('two-level table              :', perPage * perMid, 'handles (', perMid, 'x', perPage, ')');
console.log('maximal table                :', perPage * perMid * top, '= 2^' + Math.log2(perPage * perMid * top), '=', (perPage * perMid * top / 2 ** 20), 'Mi handles');
// 2) The self-map trick (Figure 11-32), 32-bit non-PAE: PTEs of the whole address space sit in a 4 MiB window at 0xC0000000
const hex = (n) =&gt; '0x' + (n &gt;&gt;&gt; 0).toString(16).padStart(8, '0');
const pteAddr = (va) =&gt; (0xC0000000 + (va &gt;&gt;&gt; 12) * 4) &gt;&gt;&gt; 0;
const pdeAddr = (va) =&gt; (0xC0300000 + (va &gt;&gt;&gt; 22) * 4) &gt;&gt;&gt; 0;
console.log('PTE address of VA 0xe4321000 :', hex(pteAddr(0xe4321000)), ' &lt;- figure says 0xc0390c84');
console.log('PDE address of VA 0xe4321000 :', hex(pdeAddr(0xe4321000)));
console.log('PDE of the window itself     :', hex(pdeAddr(0xC0000000)), ' &lt;- the self-map entry, PD[0x300]');
console.log('page directory index of 0xc0300000 :', (0xC0300000 &gt;&gt;&gt; 22).toString(16), '(= 0x300, the figure\\'s label)');
// 3) A 64-bit PTE (Figure 11-31): decode the flag bits of a sample entry
const flags = [['P', 0], ['R/W', 1], ['U/S', 2], ['PWT', 3], ['PCD', 4], ['A', 5], ['D', 6], ['PAT', 7], ['G', 8]];
const pte = 0x8000000012345027n;             // NX=1, frame 0x12345, flags 0x27
const set = flags.filter(([, b]) =&gt; (pte &gt;&gt; BigInt(b)) &amp; 1n).map(([n]) =&gt; n);
console.log('sample PTE', '0x' + pte.toString(16), '-&gt; frame', '0x' + ((pte &gt;&gt; 12n) &amp; 0xFFFFFFFFFFn).toString(16), 'flags:', set.join(' '), (pte &gt;&gt; 63n) &amp; 1n ? '+ NX (no execute)' : '');
// 4) 32-bit address space split (Figure 11-28)
const GiB = 2 ** 30;
console.log('user part  : 0 .. 2 GiB    =', 2 * GiB / 2 ** 20, 'MiB minus 64 KiB at both ends (invalid guard zones)');
console.log('usable user:', (2 * GiB - 2 * 64 * 1024) / 2 ** 20, 'MiB');</code></pre>
<div class="out">$ node tinh-windows.js<br>
handles per bottom page &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512<br>
minimal table (1 page) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512 handles<br>
two-level table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 524288 handles ( 1024 x 512 )<br>
maximal table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 16777216 = 2^24 = 16 Mi handles<br>
PTE address of VA 0xe4321000 : 0xc0390c84 &nbsp;&lt;- figure says 0xc0390c84<br>
PDE address of VA 0xe4321000 : 0xc0300e40<br>
PDE of the window itself &nbsp;&nbsp;&nbsp;&nbsp;: 0xc0300c00 &nbsp;&lt;- the self-map entry, PD[0x300]<br>
page directory index of 0xc0300000 : 300 (= 0x300, the figure's label)<br>
sample PTE 0x8000000012345027 -&gt; frame 0x12345 flags: P R/W U/S A + NX (no execute)<br>
user part &nbsp;: 0 .. 2 GiB &nbsp;&nbsp;&nbsp;= 2048 MiB minus 64 KiB at both ends (invalid guard zones)<br>
usable user: 2047.875 MiB</div>
<p>The first lines reproduce the book's numbers (512 per page; 524,288 with two levels; <strong>16,777,216</strong> with three). Now the Linux counterpart, with a deliberately small limit to make the failure visible:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--ulimit=nofile=64:64</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A Windows handle table can grow to 16 million entries; the Linux descriptor table is capped by a per-process limit (RLIMIT_NOFILE) and a system-wide one<br>
$ echo "soft limit (ulimit -n): $(ulimit -Sn) &nbsp;&nbsp;hard limit: $(ulimit -Hn)"<br>
soft limit (ulimit -n): 64 &nbsp;&nbsp;hard limit: 64<br>
$ sysctl fs.nr_open fs.file-max<br>
fs.nr_open = 1048576<br>
fs.file-max = 811758<br>
# Leak descriptors on purpose (a "handle leak") and watch the limit of 64 stop us<br>
$ bash -c 'n=0; while eval "exec $((n+3))&lt;/etc/hostname"; do n=$((n+1)); done; echo "opened $n extra descriptors"' 2&gt;&amp;1 | tail -2<br>
bash: line 1: /etc/hostname: Too many open files<br>
opened 61 extra descriptors</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Linux caps the descriptor table with <code>RLIMIT_NOFILE</code> (the <code>ulimit -n</code> value — Debian's default is 1024; this run forced <strong>64</strong>) and the kernel-wide ceiling <code>fs.nr_open</code> (1,048,576 here) plus the machine-wide open-file count <code>fs.file-max</code>. Windows gives each process room for up to 16 million handles and charges them as <em>quota</em>; Linux gives a small default and lets you raise it. Neither is "better": the Linux default protects a server from leaks early; Windows tolerates huge handle counts (some servers hold hundreds of thousands) but then leaks hide longer.</p>
<p><strong>➕ A detail about 64-bit.</strong> The figures show the 32-bit entry size (8 bytes). On 64-bit Windows pointers are 8 bytes, so entries are larger and the numbers per page differ; Windows Internals gives the exact layout, and I did not verify it against Microsoft Learn (which documents the <em>behaviour</em>, not the table layout). The 16-million (2²⁴) ceiling per process is the book's figure and also what Microsoft engineers have written about handle limits in their blog posts — treat it as the book's number, not as a guarantee for every build.</p>
<p class="pitfall">⚠️ Calculation traps: do not multiply 512 × 1024 × 1024 (the top level has <strong>32</strong>, not 1024, pointers in the book's figure). If a question gives different page or entry sizes, redo the three divisions and the product as the program does.</p>
<div class="callout">🧭 <strong>On a real server:</strong> in production Node/Java on Linux, raise the limit for the service (<code>LimitNOFILE=65536</code> in a systemd unit, or <code>docker run --ulimit nofile=65536:65536</code>) and graph <code>ls /proc/&lt;pid&gt;/fd | wc -l</code>. On Windows, the same job is done by Performance Monitor's "Handle Count" counter.</div>`,
        `<p class="y-chinh">🎯 Hình 11-17: <strong>bảng handle cực đại</strong> có ba tầng — tầng trên cùng tối đa <strong>32</strong> con trỏ, các trang tầng giữa <strong>1024</strong> con trỏ, và các trang đáy <strong>512</strong> mục handle — nên một tiến trình giữ được <strong>32 × 1024 × 512 = 16.777.216</strong> (2²⁴, "16 triệu") handle. Bảng lớn lên <em>theo nhu cầu</em>: một trang cho tiến trình nhỏ, một cây cho tiến trình khổng lồ.</p>
<p>Các con số từ đâu ra? Một trang là 4096 byte. Mục đáy 8 byte (bố cục 32 bit mà sách vẽ) cho 4096 / 8 = <strong>512</strong> mục mỗi trang. Trang tầng giữa chứa con trỏ 4 byte: 4096 / 4 = <strong>1024</strong>. Với 32 con trỏ tầng trên: 512 × 1024 × 32 = 2²⁴. Để chương trình làm phép nhân, rồi — để cảm nhận vì sao 2²⁴ là nhiều nhưng không vô hạn — nhìn cùng ý tưởng trên Linux:</p>
<pre><code class="language-javascript">// Các con số của chương Windows, tính ra
// Sức chứa bảng handle (Hình 11-16 và 11-17: mục 8 byte của bản 32 bit)
const PAGE = 4096, ENTRY = 8, PTR = 4;
const perPage = PAGE / ENTRY;                // số handle trong một trang đáy
const perMid = PAGE / PTR;                   // số con trỏ trong trang giữa
const top = 32;                              // số con trỏ ở tầng trên cùng trong hình của sách
console.log('handles per bottom page      :', perPage);
console.log('minimal table (1 page)       :', perPage, 'handles');
console.log('two-level table              :', perPage * perMid, 'handles (', perMid, 'x', perPage, ')');
console.log('maximal table                :', perPage * perMid * top, '= 2^' + Math.log2(perPage * perMid * top), '=', (perPage * perMid * top / 2 ** 20), 'Mi handles');
// Mẹo tự ánh xạ (Hình 11-32), 32 bit không PAE: PTE của cả không gian địa chỉ nằm trong cửa sổ 4 MiB ở 0xC0000000
const hex = (n) =&gt; '0x' + (n &gt;&gt;&gt; 0).toString(16).padStart(8, '0');
const pteAddr = (va) =&gt; (0xC0000000 + (va &gt;&gt;&gt; 12) * 4) &gt;&gt;&gt; 0;
const pdeAddr = (va) =&gt; (0xC0300000 + (va &gt;&gt;&gt; 22) * 4) &gt;&gt;&gt; 0;
console.log('PTE address of VA 0xe4321000 :', hex(pteAddr(0xe4321000)), ' &lt;- figure says 0xc0390c84');
console.log('PDE address of VA 0xe4321000 :', hex(pdeAddr(0xe4321000)));
console.log('PDE of the window itself     :', hex(pdeAddr(0xC0000000)), ' &lt;- the self-map entry, PD[0x300]');
console.log('page directory index of 0xc0300000 :', (0xC0300000 &gt;&gt;&gt; 22).toString(16), '(= 0x300, the figure\\'s label)');
// PTE 64 bit (Hình 11-31): giải mã các bit cờ của một mục mẫu
const flags = [['P', 0], ['R/W', 1], ['U/S', 2], ['PWT', 3], ['PCD', 4], ['A', 5], ['D', 6], ['PAT', 7], ['G', 8]];
const pte = 0x8000000012345027n;             // NX=1, khung 0x12345, cờ 0x27
const set = flags.filter(([, b]) =&gt; (pte &gt;&gt; BigInt(b)) &amp; 1n).map(([n]) =&gt; n);
console.log('sample PTE', '0x' + pte.toString(16), '-&gt; frame', '0x' + ((pte &gt;&gt; 12n) &amp; 0xFFFFFFFFFFn).toString(16), 'flags:', set.join(' '), (pte &gt;&gt; 63n) &amp; 1n ? '+ NX (no execute)' : '');
// Chia không gian địa chỉ 32 bit (Hình 11-28)
const GiB = 2 ** 30;
console.log('user part  : 0 .. 2 GiB    =', 2 * GiB / 2 ** 20, 'MiB minus 64 KiB at both ends (invalid guard zones)');
console.log('usable user:', (2 * GiB - 2 * 64 * 1024) / 2 ** 20, 'MiB');</code></pre>
<div class="out">$ node tinh-windows.js<br>
handles per bottom page &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512<br>
minimal table (1 page) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512 handles<br>
two-level table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 524288 handles ( 1024 x 512 )<br>
maximal table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 16777216 = 2^24 = 16 Mi handles<br>
PTE address of VA 0xe4321000 : 0xc0390c84 &nbsp;&lt;- figure says 0xc0390c84<br>
PDE address of VA 0xe4321000 : 0xc0300e40<br>
PDE of the window itself &nbsp;&nbsp;&nbsp;&nbsp;: 0xc0300c00 &nbsp;&lt;- the self-map entry, PD[0x300]<br>
page directory index of 0xc0300000 : 300 (= 0x300, the figure's label)<br>
sample PTE 0x8000000012345027 -&gt; frame 0x12345 flags: P R/W U/S A + NX (no execute)<br>
user part &nbsp;: 0 .. 2 GiB &nbsp;&nbsp;&nbsp;= 2048 MiB minus 64 KiB at both ends (invalid guard zones)<br>
usable user: 2047.875 MiB</div>
<p>Những dòng đầu tái hiện số của sách (512 mỗi trang; 524.288 với hai tầng; <strong>16.777.216</strong> với ba tầng). Giờ là phiên bản Linux, với giới hạn cố ý nhỏ để thấy lỗi:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--ulimit=nofile=64:64</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bảng handle Windows lớn tới 16 triệu mục; bảng descriptor Linux bị chặn bởi giới hạn từng tiến trình (RLIMIT_NOFILE) và giới hạn toàn hệ thống<br>
$ echo "soft limit (ulimit -n): $(ulimit -Sn) &nbsp;&nbsp;hard limit: $(ulimit -Hn)"<br>
soft limit (ulimit -n): 64 &nbsp;&nbsp;hard limit: 64<br>
$ sysctl fs.nr_open fs.file-max<br>
fs.nr_open = 1048576<br>
fs.file-max = 811758<br>
# Cố tình làm rò descriptor (một "rò handle") và xem giới hạn 64 chặn ta<br>
$ bash -c 'n=0; while eval "exec $((n+3))&lt;/etc/hostname"; do n=$((n+1)); done; echo "opened $n extra descriptors"' 2&gt;&amp;1 | tail -2<br>
bash: line 1: /etc/hostname: Too many open files<br>
opened 61 extra descriptors</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Linux chặn bảng descriptor bằng <code>RLIMIT_NOFILE</code> (giá trị <code>ulimit -n</code> — mặc định Debian là 1024; lần chạy này ép <strong>64</strong>) và trần toàn nhân <code>fs.nr_open</code> (ở đây 1.048.576) cộng số tệp mở toàn máy <code>fs.file-max</code>. Windows cho mỗi tiến trình chỗ cho tới 16 triệu handle và tính chúng như <em>hạn mức</em>; Linux cho mặc định nhỏ và cho bạn nâng lên. Không cái nào "tốt hơn": mặc định của Linux bảo vệ máy chủ khỏi rò rỉ sớm; Windows chịu được số handle rất lớn (có máy chủ giữ hàng trăm nghìn) nhưng rò rỉ ẩn lâu hơn.</p>
<p><strong>➕ Một chi tiết về 64 bit.</strong> Hình vẽ kích thước mục 32 bit (8 byte). Trên Windows 64 bit con trỏ dài 8 byte nên mục lớn hơn và số mục mỗi trang khác; Windows Internals cho bố cục chính xác, và tôi không đối chiếu với Microsoft Learn (nơi chỉ tài liệu hoá <em>hành vi</em>, không phải bố cục bảng). Trần 16 triệu (2²⁴) mỗi tiến trình là số của sách và cũng là thứ kỹ sư Microsoft từng viết trong blog về giới hạn handle — hãy xem là số của sách, không phải bảo đảm cho mọi bản dựng.</p>
<p class="pitfall">⚠️ Bẫy tính toán: đừng nhân 512 × 1024 × 1024 (tầng trên cùng có <strong>32</strong>, không phải 1024, con trỏ trong hình của sách). Nếu đề cho cỡ trang hay cỡ mục khác, hãy làm lại ba phép chia và tích như chương trình.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> với Node/Java production trên Linux, hãy nâng giới hạn cho dịch vụ (<code>LimitNOFILE=65536</code> trong unit systemd, hoặc <code>docker run --ulimit nofile=65536:65536</code>) và vẽ đồ thị <code>ls /proc/&lt;pid&gt;/fd | wc -l</code>. Trên Windows, việc đó do bộ đếm "Handle Count" của Performance Monitor làm.</div>`],
      [20, 'The Object Name Space (1)',
        `<p class="y-chinh">🎯 Figure 11-18: objects can have <strong>names</strong>, and the names live in a tree called the <strong>object name space</strong>. Each object <em>type</em> supplies up to six procedures that the object manager calls: <strong>Open</strong> (for every new handle; rarely used), <strong>Parse</strong> (for object types that <em>extend the name space</em> — used for files and registry keys), <strong>Close</strong> (at the last handle close; cleans up visible side effects), <strong>Delete</strong> (at the last pointer dereference; the object is about to be deleted), <strong>Security</strong> (get or set the security descriptor) and <strong>QueryName</strong> (get the object's name; rarely used outside the kernel).</p>
<p>A name space is a phone book for kernel objects. Most objects (a thread) have no name and are reached only through handles. Some need a name so that <em>unrelated</em> programs can find the same object: two processes that want one shared mutex agree on the name <code>Global\\MyAppLock</code> and each calls <code>CreateMutex</code> with it; the first creates, the second <em>opens</em> the same object. A <strong>Parse</strong> procedure is what makes a name space extensible: when the lookup reaches an object that is the <em>root of another name space</em> — a volume (whose inside is a file system) or a registry — the manager hands the remaining part of the path to that object's Parse routine. The object manager doesn't know what a file is; it only knows the volume object says "give me the rest."</p>
<p>The Win32 side of names (Microsoft, "Naming Files, Paths, and Namespaces"): a Win32 path such as <code>C:\\foo\\bar</code> is converted to an NT path; the special prefix <code>\\\\?\\</code> "tells the Windows APIs to disable all string parsing and to send the string that follows it straight to the file system" (and allows paths longer than <strong>MAX_PATH = 260</strong> characters, a limit that applies to editions before Windows 10 version 1607 unless enabled by a registry key or policy); <code>\\\\.\\</code> reaches the device name space, e.g. <code>\\\\.\\PhysicalDrive0</code>. Microsoft also says that "the Windows Object Manager makes [NT namespace APIs] unnecessary in most cases" and recommends the free Sysinternals tool <strong>WinObj</strong> to browse the tree.</p>
<p>Linux does not have a separate name space for kernel objects: <em>the file system tree is the name space</em>. A named pipe is a file (<code>mkfifo</code>), a POSIX semaphore is a file under <code>/dev/shm</code>, a UNIX socket is a file, a device is a file under <code>/dev</code>. One name space, files for everything — this is the "everything is a file" half of UNIX that really is true, and it is the simpler one for beginners.</p>
<p class="pitfall">⚠️ Three of the six procedures are easy to swap in a quiz: <em>Close</em> fires on the <strong>last handle</strong> close, <em>Delete</em> on the <strong>last pointer</strong> release (so Close comes first, Delete later or never if the object is permanent). <em>Parse</em> is the one used for files and registry keys.</p>`,
        `<p class="y-chinh">🎯 Hình 11-18: đối tượng có thể có <strong>tên</strong>, và các tên nằm trong một cây gọi là <strong>không gian tên đối tượng</strong>. Mỗi <em>loại</em> đối tượng cung cấp tối đa sáu thủ tục mà object manager gọi: <strong>Open</strong> (mỗi handle mới; hiếm dùng), <strong>Parse</strong> (với loại đối tượng <em>mở rộng không gian tên</em> — dùng cho tệp và khoá registry), <strong>Close</strong> (khi đóng handle cuối; dọn các tác dụng phụ nhìn thấy được), <strong>Delete</strong> (khi bỏ tham chiếu con trỏ cuối; đối tượng sắp bị xoá), <strong>Security</strong> (lấy hay đặt security descriptor) và <strong>QueryName</strong> (lấy tên đối tượng; hiếm dùng ngoài nhân).</p>
<p>Không gian tên là danh bạ cho các đối tượng nhân. Đa số đối tượng (một luồng) không có tên và chỉ tới được qua handle. Một số cần tên để các chương trình <em>không liên quan</em> tìm thấy cùng một đối tượng: hai tiến trình muốn dùng chung một mutex thoả thuận tên <code>Global\\MyAppLock</code> và mỗi bên gọi <code>CreateMutex</code> với tên đó; bên đầu tạo, bên sau <em>mở</em> cùng đối tượng. Thủ tục <strong>Parse</strong> làm cho không gian tên mở rộng được: khi tra cứu tới một đối tượng là <em>gốc của một không gian tên khác</em> — một volume (bên trong là hệ thống tệp) hay một registry — trình quản lý đưa phần còn lại của đường dẫn cho thủ tục Parse của đối tượng đó. Object manager không biết tệp là gì; nó chỉ biết đối tượng volume nói "đưa tôi phần còn lại."</p>
<p>Phía Win32 của tên (Microsoft, "Naming Files, Paths, and Namespaces"): đường dẫn Win32 như <code>C:\\foo\\bar</code> được đổi sang đường dẫn NT; tiền tố đặc biệt <code>\\\\?\\</code> "bảo các API Windows tắt mọi phân tích chuỗi và gửi chuỗi theo sau thẳng tới hệ thống tệp" (và cho phép đường dẫn dài hơn <strong>MAX_PATH = 260</strong> ký tự, giới hạn áp dụng cho các bản trước Windows 10 version 1607 trừ khi bật bằng khoá registry hay chính sách); <code>\\\\.\\</code> tới không gian tên thiết bị, vd <code>\\\\.\\PhysicalDrive0</code>. Microsoft cũng nói "Windows Object Manager khiến [API không gian tên NT] không cần thiết trong đa số trường hợp" và khuyên dùng công cụ Sysinternals miễn phí <strong>WinObj</strong> để duyệt cây.</p>
<p>Linux không có không gian tên riêng cho đối tượng nhân: <em>cây hệ thống tệp chính là không gian tên</em>. Named pipe là một tệp (<code>mkfifo</code>), semaphore POSIX là một tệp dưới <code>/dev/shm</code>, socket UNIX là một tệp, thiết bị là một tệp dưới <code>/dev</code>. Một không gian tên, tệp cho mọi thứ — đây là nửa "mọi thứ là tệp" của UNIX thật sự đúng, và là nửa đơn giản hơn cho người mới.</p>
<p class="pitfall">⚠️ Ba trong sáu thủ tục dễ bị đảo trong câu trắc nghiệm: <em>Close</em> chạy khi đóng <strong>handle cuối</strong>, <em>Delete</em> khi nhả <strong>con trỏ cuối</strong> (nên Close đến trước, Delete đến sau hoặc không bao giờ nếu đối tượng vĩnh viễn). <em>Parse</em> là cái dùng cho tệp và khoá registry.</p>`],
      [21, 'The Object Name Space (2)',
        `<p class="y-chinh">🎯 Figure 11-19 lists typical <strong>directories of the object name space</strong>: <code>\\??</code> (starting place for looking up MS-DOS devices like <code>C:</code>), <code>\\DosDevices</code> (official name of <code>\\??</code>, really a symbolic link to it), <code>\\Device</code> (all discovered I/O devices), <code>\\Driver</code> (objects for each loaded driver), <code>\\ObjectTypes</code> (the type objects of Figure 11-21), <code>\\Windows</code> (objects for sending messages to all Win32 GUI windows), <code>\\BaseNamedObjects</code> (user-created Win32 objects such as semaphores and mutexes), <code>\\Arcname</code> (partition names discovered by the boot loader), <code>\\NLS</code> (national-language-support objects), <code>\\FileSystem</code> (file-system driver objects), <code>\\Security</code> (security-system objects) and <code>\\KnownDLLs</code> (key shared libraries opened early and held open).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b62c4fdd97903ffebfaf0598a20a2784bb7ab57d.svg" alt="The object name space as a tree: \\?? holds C: as a symbolic link to \\Device\\HarddiskVolume3, whose Parse method hands the rest of the path to the NTFS driver" loading="lazy" /><p class="chu-thich">🧩 The object name space as a tree: \\?? holds C: as a symbolic link to \\Device\\HarddiskVolume3, whose Parse method hands the rest of the path to the NTFS driver</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figures 11-18 to 11-21: the object manager's name space is a tree; \\?? holds DOS drive letters as SYMBOLIC LINKS into \\Device
skinparam rectangle {
  RoundCorner 3
}
rectangle "\\\\  (root directory object)" as root
rectangle "\\\\??\\n(DosDevices: C:, D:, COM1…)" as dos
rectangle "\\\\Device\\n(every discovered device)" as dev
rectangle "\\\\Driver\\n(loaded drivers)" as drv
rectangle "\\\\ObjectTypes\\n(Process, Thread, Event, Mutex…)" as ot
rectangle "\\\\BaseNamedObjects\\n(user mutexes, semaphores)" as bno
rectangle "\\\\KnownDLLs\\n(shared libs held open)" as kd
rectangle "\\\\Windows\\n(GUI window objects)" as win
root --&gt; dos
root --&gt; dev
root --&gt; drv
root --&gt; ot
root --&gt; bno
root --&gt; kd
root --&gt; win
rectangle "C:  =  symbolic link\\n→ \\\\Device\\\\HarddiskVolume3" as c
rectangle "\\\\Device\\\\HarddiskVolume3\\n(device object of the volume)" as vol
rectangle "NTFS driver\\n(\\\\Driver\\\\Ntfs) — runs the file system" as ntfs
dos --&gt; c
c ..&gt; vol : "parse"
dev --&gt; vol
vol --&gt; ntfs : "Parse method\\nhands the rest of the path (\\\\foo\\\\bar)\\nto the file system"
note bottom of c : The Win32 path  C:\\\\foo\\\\bar\\nbecomes  \\\\??\\\\C:\\\\foo\\\\bar → \\\\Device\\\\HarddiskVolume3\\\\foo\\\\bar
@enduml</code></pre></details>
<p>The most important arrow in the picture is the one from <code>C:</code> to the device. In <code>\\??</code> the letters <code>C:</code> and <code>D:</code> are <strong>symbolic links</strong> to device objects such as <code>\\Device\\HarddiskVolume3</code>. That is why drive letters are only a Win32 convention: they are names in <code>\\??</code>, and tools like <code>subst</code> and Docker for Windows can create or remove them. Microsoft's naming page confirms the same layout with today's names: "the subfolder called <code>Global??</code> is where the Win32 namespace resides … <code>C:</code> is a symlink to HarddiskVolume1 …"; modern Windows has per-session copies of <code>\\??</code> (for multi-user Terminal Services) and a <code>GLOBALROOT</code> link (path <code>\\\\?\\GLOBALROOT</code>) to reach the true root. The book's <code>\\??</code> is thus today's <code>\\GLOBAL??</code> plus a per-session view.</p>
<p>The Linux comparison is a page of the same <code>/dev</code>, <code>/proc</code>, <code>/sys</code> story you already know: devices are files under <code>/dev</code> (the cousin of <code>\\Device</code>), the kernel exposes its own objects as a virtual tree in <code>/proc</code> and <code>/sys</code> (the cousin of the whole object name space made <em>browsable like files</em>), and symbolic links (<code>ln -s</code>) exist in every Linux file system. Windows hides this tree from ordinary users; Linux puts it under <code>ls</code>. Try <code>ls /proc/self/ns</code> in the lab of Chapter 7: even <em>namespaces</em> are links in a file tree.</p>
<p class="pitfall">⚠️ <code>\\??</code> versus <code>\\Device</code>: the first holds <em>names applications use</em> (aliases), the second holds the <em>real device objects</em>. The exam asks "Which directory is the starting place for looking up MS-DOS devices such as C:" — answer <code>\\??</code>; "official name <code>\\DosDevices</code> is really a symbolic link to <code>\\??</code>".</p>`,
        `<p class="y-chinh">🎯 Hình 11-19 liệt kê các <strong>thư mục điển hình của không gian tên đối tượng</strong>: <code>\\??</code> (điểm bắt đầu tra cứu các thiết bị MS-DOS như <code>C:</code>), <code>\\DosDevices</code> (tên chính thức của <code>\\??</code>, thật ra là liên kết tượng trưng tới nó), <code>\\Device</code> (mọi thiết bị I/O được phát hiện), <code>\\Driver</code> (đối tượng cho mỗi driver đã nạp), <code>\\ObjectTypes</code> (các type object của Hình 11-21), <code>\\Windows</code> (đối tượng để gửi thông điệp tới mọi cửa sổ GUI Win32), <code>\\BaseNamedObjects</code> (đối tượng Win32 do người dùng tạo như semaphore và mutex), <code>\\Arcname</code> (tên phân vùng do trình nạp khởi động phát hiện), <code>\\NLS</code> (đối tượng hỗ trợ ngôn ngữ quốc gia), <code>\\FileSystem</code> (đối tượng driver hệ thống tệp), <code>\\Security</code> (đối tượng của hệ thống bảo mật) và <code>\\KnownDLLs</code> (các thư viện chia sẻ quan trọng được mở sớm và giữ mở).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/b62c4fdd97903ffebfaf0598a20a2784bb7ab57d.svg" alt="Không gian tên đối tượng dạng cây: \\?? giữ C: là liên kết tượng trưng tới \\Device\\HarddiskVolume3, mà phương thức Parse của nó đưa phần còn lại của đường dẫn cho driver NTFS" loading="lazy" /><p class="chu-thich">🧩 Không gian tên đối tượng dạng cây: \\?? giữ C: là liên kết tượng trưng tới \\Device\\HarddiskVolume3, mà phương thức Parse của nó đưa phần còn lại của đường dẫn cho driver NTFS</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-18 đến 11-21: không gian tên của trình quản lý đối tượng là một cây; \\?? chứa ký tự ổ đĩa kiểu DOS dưới dạng LIÊN KẾT TƯỢNG TRƯNG tới \\Device
skinparam rectangle {
  RoundCorner 3
}
rectangle "\\\\  (root directory object)" as root
rectangle "\\\\??\\n(DosDevices: C:, D:, COM1…)" as dos
rectangle "\\\\Device\\n(every discovered device)" as dev
rectangle "\\\\Driver\\n(loaded drivers)" as drv
rectangle "\\\\ObjectTypes\\n(Process, Thread, Event, Mutex…)" as ot
rectangle "\\\\BaseNamedObjects\\n(user mutexes, semaphores)" as bno
rectangle "\\\\KnownDLLs\\n(shared libs held open)" as kd
rectangle "\\\\Windows\\n(GUI window objects)" as win
root --&gt; dos
root --&gt; dev
root --&gt; drv
root --&gt; ot
root --&gt; bno
root --&gt; kd
root --&gt; win
rectangle "C:  =  symbolic link\\n→ \\\\Device\\\\HarddiskVolume3" as c
rectangle "\\\\Device\\\\HarddiskVolume3\\n(device object of the volume)" as vol
rectangle "NTFS driver\\n(\\\\Driver\\\\Ntfs) — runs the file system" as ntfs
dos --&gt; c
c ..&gt; vol : "parse"
dev --&gt; vol
vol --&gt; ntfs : "Parse method\\nhands the rest of the path (\\\\foo\\\\bar)\\nto the file system"
note bottom of c : The Win32 path  C:\\\\foo\\\\bar\\nbecomes  \\\\??\\\\C:\\\\foo\\\\bar → \\\\Device\\\\HarddiskVolume3\\\\foo\\\\bar
@enduml</code></pre></details>
<p>Mũi tên quan trọng nhất trong hình là mũi tên từ <code>C:</code> tới thiết bị. Trong <code>\\??</code>, các chữ <code>C:</code> và <code>D:</code> là <strong>liên kết tượng trưng</strong> tới các device object như <code>\\Device\\HarddiskVolume3</code>. Vì vậy ký tự ổ đĩa chỉ là quy ước của Win32: chúng là tên trong <code>\\??</code>, và các công cụ như <code>subst</code> và Docker for Windows tạo hay gỡ được. Trang đặt tên của Microsoft xác nhận cùng bố cục với tên ngày nay: "thư mục con gọi là <code>Global??</code> là nơi không gian tên Win32 cư trú … <code>C:</code> là symlink tới HarddiskVolume1 …"; Windows hiện đại có bản <code>\\??</code> riêng cho từng phiên (cho Terminal Services nhiều người dùng) và một liên kết <code>GLOBALROOT</code> (đường dẫn <code>\\\\?\\GLOBALROOT</code>) để tới gốc thật. Vậy <code>\\??</code> của sách là <code>\\GLOBAL??</code> ngày nay cộng một góc nhìn theo phiên.</p>
<p>Phép so sánh Linux là một trang của câu chuyện <code>/dev</code>, <code>/proc</code>, <code>/sys</code> bạn đã biết: thiết bị là tệp dưới <code>/dev</code> (họ hàng của <code>\\Device</code>), nhân phơi các đối tượng của nó thành một cây ảo trong <code>/proc</code> và <code>/sys</code> (họ hàng của cả không gian tên đối tượng nhưng <em>duyệt được như tệp</em>), và liên kết tượng trưng (<code>ln -s</code>) có ở mọi hệ thống tệp Linux. Windows giấu cây này khỏi người dùng thường; Linux đặt nó dưới <code>ls</code>. Thử <code>ls /proc/self/ns</code> trong lab của Chương 7: ngay cả <em>namespace</em> cũng là liên kết trong một cây tệp.</p>
<p class="pitfall">⚠️ <code>\\??</code> so với <code>\\Device</code>: cái đầu giữ <em>tên ứng dụng dùng</em> (bí danh), cái sau giữ <em>device object thật</em>. Đề thi hỏi "Thư mục nào là điểm bắt đầu tra cứu thiết bị MS-DOS như C:" — đáp <code>\\??</code>; "tên chính thức <code>\\DosDevices</code> thật ra là liên kết tượng trưng tới <code>\\??</code>".</p>`],
      [22, 'The Object Name Space (3)',
        `<p class="y-chinh">🎯 The slides now walk the <strong>Parse procedure</strong> through one example, <code>CreateFile("C:\\foo\\bar")</code>. <strong>Step 1:</strong> the executive component passes a <em>Unicode</em> path name for the name space. <strong>Step 2:</strong> the object manager searches through directories and symbolic links. <strong>Step 3:</strong> it calls the <em>Parse</em> procedure of the object type it reached (the device). <strong>Step 4:</strong> the I/O manager creates an <strong>IRP</strong>, allocates a <strong>file object</strong> and sends the request to the stack of I/O devices.</p>
<p>Imagine posting a parcel to "Building 3, Floor 2, Room 5". The street directory (object manager) knows the buildings: it finds Building 3 and discovers that the building is "run by its own management" (a device with a Parse procedure). So it hands the parcel and the rest of the address ("Floor 2, Room 5") to that building's mail room (the file system), which knows its own floors and rooms. The street directory never learns what is inside; it only knows who to ask next.</p>
<p>Two vocabulary points. First, names are <strong>Unicode</strong> (UTF-16) throughout Windows — Linux names are just bytes (UTF-8 by convention). That is why a file name created on Windows may become unreadable "mojibake" on Linux if the tool guesses the encoding wrong, and why NTFS and ext4 do not have the same rules about what characters are legal (try both ways in <code>khac-biet-he-thong-tep.sh</code> on slide 31). Second, the <em>file object</em> is not the file: it is the kernel object representing <em>one open instance</em> (position, access rights, sharing mode) of a file, and the handle you finally get refers to it — the Linux equivalent is the <em>open file description</em> behind each file descriptor, which holds the offset. Two descriptors made by <code>dup()</code> share one offset (slide 18); two separate <code>open()</code> calls of the same path have independent offsets, just as two <code>CreateFile</code> calls create two file objects.</p>
<p class="meo">🧠 Remember the four-verb chain of this slide: <strong>pass name → search directories/links → call Parse → build IRP + file object</strong>. The next two slides continue at step 5.</p>`,
        `<p class="y-chinh">🎯 Các slide giờ dẫn <strong>thủ tục Parse</strong> qua một ví dụ, <code>CreateFile("C:\\foo\\bar")</code>. <strong>Bước 1:</strong> thành phần executive đưa một tên đường dẫn <em>Unicode</em> cho không gian tên. <strong>Bước 2:</strong> object manager tìm qua các thư mục và liên kết tượng trưng. <strong>Bước 3:</strong> nó gọi thủ tục <em>Parse</em> của loại đối tượng đã tới (thiết bị). <strong>Bước 4:</strong> I/O manager tạo một <strong>IRP</strong>, cấp một <strong>file object</strong> và gửi yêu cầu tới chồng thiết bị I/O.</p>
<p>Hình dung gửi bưu kiện tới "Toà 3, Tầng 2, Phòng 5". Danh bạ phố (object manager) biết các toà nhà: nó tìm Toà 3 và thấy toà này "do ban quản lý riêng điều hành" (thiết bị có thủ tục Parse). Nên nó đưa bưu kiện cùng phần còn lại của địa chỉ ("Tầng 2, Phòng 5") cho phòng thư của toà đó (hệ thống tệp), nơi biết tầng và phòng của mình. Danh bạ phố không bao giờ biết bên trong có gì; nó chỉ biết hỏi ai tiếp.</p>
<p>Hai điểm từ vựng. Một, tên là <strong>Unicode</strong> (UTF-16) trong toàn Windows — tên Linux chỉ là byte (UTF-8 theo quy ước). Vì vậy tên tệp tạo trên Windows có thể thành "mojibake" khó đọc trên Linux nếu công cụ đoán sai bảng mã, và vì sao NTFS và ext4 không cùng luật về ký tự nào hợp lệ (thử cả hai chiều trong <code>khac-biet-he-thong-tep.sh</code> ở slide 31). Hai, <em>file object</em> không phải tệp: nó là đối tượng nhân đại diện cho <em>một lần mở</em> (vị trí, quyền, chế độ chia sẻ) của tệp, và handle bạn nhận cuối cùng trỏ tới nó — tương đương Linux là <em>open file description</em> đứng sau mỗi file descriptor, giữ offset. Hai descriptor tạo bằng <code>dup()</code> chia sẻ một offset (slide 18); hai lần <code>open()</code> riêng của cùng đường dẫn có offset độc lập, giống hai lần <code>CreateFile</code> tạo hai file object.</p>
<p class="meo">🧠 Nhớ chuỗi bốn động từ của slide này: <strong>đưa tên → tìm thư mục/liên kết → gọi Parse → dựng IRP + file object</strong>. Hai slide sau tiếp tục từ bước 5.</p>`],
      [23, 'The Object Name Space (4)',
        `<p class="y-chinh">🎯 Steps 5–7 (the slide numbers every item "5" — a typo; they are steps 5, 6, 7). <strong>5:</strong> the IRP is passed down the I/O stack until it reaches the <em>device object representing the file-system instance</em>. <strong>6:</strong> device objects met on the way <em>toward the file system</em> are <strong>file-system filter drivers</strong>. <strong>7:</strong> the file-system device object has a link to the <strong>file-system driver object</strong> (NTFS), whose entry point (<code>NtfsCreateFile</code>) does the real work.</p>
<p>Back to the parcel: the mail room receives the parcel on a conveyor, but before the clerk (the file system) sees it, it passes <em>inspectors</em> (the filters: antivirus, backup, encryption, quota). Each inspector looks at the label and either lets it pass, changes it, or stops it with "refused". Only the last device object on the way has a pointer to the code that understands rooms and floors.</p>
<p>Why is this design clever? Because <strong>nothing in the middle needs to know about NTFS</strong>. An antivirus filter knows only "an <em>open file</em> request is passing"; a backup filter knows "a <em>write</em> is passing". So Microsoft (or a vendor) can add a feature to every file system by adding a filter, without touching NTFS, ReFS or FAT. The cost: every file open touches every filter in the stack. This is the real cause of "my build is slow because antivirus scans every file": 10,000 small files × 1 filter × 1 open each. That is why the <strong>Dev Drive</strong> exists (slide 58): Microsoft's page says that on a Dev Drive the filter manager "will turn OFF all filters … with the exception of antivirus filters", and Defender runs in a lighter <em>performance mode</em> — less work at step 6.</p>
<p>On Linux the same job is done differently: the <em>VFS</em> is a thin layer with no general filter chain; features are added through <em>Linux Security Modules</em> (LSM hooks: SELinux, AppArmor), <em>fanotify/inotify</em> (userspace is told about file events), and stackable file systems (overlayfs, ecryptfs). Same needs, different plumbing.</p>
<p class="pitfall">⚠️ Careful with the word "device": a <em>device object</em> here is a <strong>kernel data structure</strong> (a node in a stack), not necessarily a piece of hardware. The "file-system device object" represents a mounted volume instance; no hardware at that level. A question like "which object does the IRP reach at step 5?" wants "the device object that represents the file system instance".</p>`,
        `<p class="y-chinh">🎯 Bước 5–7 (slide ghi mọi mục là "5" — lỗi đánh máy; đó là các bước 5, 6, 7). <strong>5:</strong> IRP được chuyển xuống chồng I/O cho tới khi tới <em>device object đại diện cho thể hiện hệ thống tệp</em>. <strong>6:</strong> các device object gặp trên đường <em>tới hệ thống tệp</em> là <strong>driver lọc hệ thống tệp</strong>. <strong>7:</strong> device object của hệ thống tệp có liên kết tới <strong>driver object của hệ thống tệp</strong> (NTFS), mà điểm vào (<code>NtfsCreateFile</code>) làm việc thật.</p>
<p>Quay lại bưu kiện: phòng thư nhận bưu kiện trên băng tải, nhưng trước khi nhân viên (hệ thống tệp) thấy nó, nó đi qua các <em>thanh tra</em> (bộ lọc: antivirus, sao lưu, mã hoá, hạn mức). Mỗi thanh tra nhìn nhãn và hoặc cho qua, hoặc sửa, hoặc chặn với "từ chối". Chỉ device object cuối trên đường mới có con trỏ tới mã hiểu phòng và tầng.</p>
<p>Vì sao thiết kế này khéo? Vì <strong>không gì ở giữa cần biết về NTFS</strong>. Bộ lọc antivirus chỉ biết "một yêu cầu <em>mở tệp</em> đang đi qua"; bộ lọc sao lưu biết "một lần <em>ghi</em> đang đi qua". Nên Microsoft (hay nhà cung cấp) thêm được tính năng cho mọi hệ thống tệp bằng cách thêm một bộ lọc, không đụng NTFS, ReFS hay FAT. Cái giá: mỗi lần mở tệp chạm mọi bộ lọc trong chồng. Đây là nguyên nhân thật của "build của tôi chậm vì antivirus quét từng tệp": 10.000 tệp nhỏ × 1 bộ lọc × 1 lần mở mỗi tệp. Đó là lý do <strong>Dev Drive</strong> tồn tại (slide 58): trang của Microsoft nói trên Dev Drive filter manager "sẽ TẮT mọi bộ lọc … trừ bộ lọc antivirus", và Defender chạy ở <em>chế độ hiệu năng</em> nhẹ hơn — bớt việc ở bước 6.</p>
<p>Trên Linux việc này làm khác: <em>VFS</em> là tầng mỏng không có chuỗi lọc tổng quát; tính năng được thêm qua <em>Linux Security Modules</em> (móc LSM: SELinux, AppArmor), <em>fanotify/inotify</em> (không gian người dùng được báo về sự kiện tệp) và hệ thống tệp xếp chồng (overlayfs, ecryptfs). Cùng nhu cầu, đường ống khác.</p>
<p class="pitfall">⚠️ Cẩn thận với từ "device": một <em>device object</em> ở đây là <strong>cấu trúc dữ liệu nhân</strong> (một nút trong chồng), không nhất thiết là một phần cứng. "Device object của hệ thống tệp" đại diện cho một thể hiện volume đã gắn; không có phần cứng ở tầng đó. Câu như "IRP tới đối tượng nào ở bước 5?" muốn "device object đại diện cho thể hiện hệ thống tệp".</p>`],
      [24, 'The Object Name Space (5)',
        `<p class="y-chinh">🎯 Steps 8–10 (numbered "8, 8, 8" on the slide — again a typo). <strong>8:</strong> NTFS fills in the <em>file object</em> and returns it to the I/O manager, which returns it <em>up through all the devices on the stack</em> (the IRP completes). <strong>9:</strong> the object manager is finished with its name-space lookup and creates a <strong>handle</strong> in the process's handle table that points to the file object. <strong>10:</strong> the final step is to <strong>return to the user-mode caller</strong> with that handle.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7a53fbfccb5a2d050e0523df76470f1c858e0e8d.svg" alt="The ten steps of CreateFile(&quot;C:\\foo\\bar&quot;): name lookup, Parse, IRP down the device stack, NTFS fills the file object, IRP completes up, handle returned" loading="lazy" /><p class="chu-thich">🧩 The ten steps of CreateFile("C:\\foo\\bar"): name lookup, Parse, IRP down the device stack, NTFS fills the file object, IRP completes up, handle returned</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 11-20: the 10 steps of CreateFile("C:\\foo\\bar") through the object manager, the I/O manager and the file system stack
participant "Win32\\nCreateFile" as W
participant "I/O manager" as IO
participant "Object manager" as OM
participant "C: device stack\\n(filter → NTFS)" as ST
W -&gt; IO : (1) NtCreateFile(\\\\??\\\\C:\\\\foo\\\\bar)
IO -&gt; OM : (2) ObOpenObjectByName(\\\\??\\\\C:\\\\foo\\\\bar)
OM -&gt; OM : (3) look up \\\\?? → C: → \\\\Device\\\\HarddiskVolume3\\nthe device object "has a Parse method"
OM -&gt; IO : (3) call the Parse routine for type "Device":\\nIopParseDevice(device, \\\\foo\\\\bar)
IO -&gt; IO : (4) allocate a FILE OBJECT and an IRP (I/O request packet)
IO -&gt; ST : (5) IoCallDriver: pass the IRP down the stack
ST -&gt; ST : (6) file-system filter drivers see it first\\n(antivirus, encryption, backup …)
ST -&gt; ST : (7) NTFS: NtfsCreateFile — walks \\\\foo → bar in the MFT,\\nchecks the security descriptor, fills the file object
ST --&gt; IO : (8) IoCompleteRequest: the IRP travels back UP the stack
IO --&gt; OM : (8) the file object is complete
OM -&gt; OM : (9) create a HANDLE in the process's handle table\\npointing to the file object
OM --&gt; W : (10) the handle returns to user mode
@enduml</code></pre></details>
<p>Now the whole story fits in one sentence: <em>a name is resolved by the object manager, the last directory in the path hands over to a file system by its Parse method, the file system answers with a file object, and the object manager hides that object behind a small number.</em> Two details deserve attention. <strong>Completion goes up the same stack</strong>: any filter may inspect or change the result on the way back (an encryption filter decrypts here). And <strong>the handle is created last</strong>: if anything failed earlier — file does not exist, access denied — no handle exists and the Win32 call returns <code>INVALID_HANDLE_VALUE</code> with an error code you read via <code>GetLastError()</code>.</p>
<p>Compare the Linux path of <code>open("/foo/bar", O_RDONLY)</code>: the VFS walks the path component by component using the <em>dentry cache</em>, asks the file system for the <em>inode</em> of each component, checks permission bits (and capabilities, LSMs), allocates a <code>struct file</code>, installs it into the lowest free slot of the descriptor table and returns that number (slide 18). The two pipelines have the same shape; the difference is <strong>who owns each step</strong>: in Windows the <em>I/O manager</em> and <em>object manager</em> own the lookup and delegate to drivers by IRP; in Linux the <em>VFS</em> owns it and calls file-system functions through <code>file_operations</code>/<code>inode_operations</code>.</p>
<p class="pitfall">⚠️ The IRP is <em>not</em> a system call and <em>not</em> a handle. The system call is the <em>trap</em> from user to kernel (<code>NtCreateFile</code>); the IRP is an <em>internal kernel request packet</em> created by the I/O manager to talk to drivers. The user program never sees an IRP. Questions that say "the IRP is returned to the application" are wrong; what returns is the handle.</p>`,
        `<p class="y-chinh">🎯 Bước 8–10 (slide đánh số "8, 8, 8" — lại là lỗi đánh máy). <strong>8:</strong> NTFS điền <em>file object</em> và trả cho I/O manager, nó trả <em>ngược lên qua mọi thiết bị trên chồng</em> (IRP hoàn thành). <strong>9:</strong> object manager xong việc tra không gian tên và tạo một <strong>handle</strong> trong bảng handle của tiến trình trỏ tới file object. <strong>10:</strong> bước cuối là <strong>trả về cho bên gọi ở chế độ người dùng</strong> cùng handle đó.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/7a53fbfccb5a2d050e0523df76470f1c858e0e8d.svg" alt="Mười bước của CreateFile(&quot;C:\\foo\\bar&quot;): tra tên, Parse, IRP đi xuống chồng thiết bị, NTFS điền file object, IRP hoàn thành đi lên, trả handle" loading="lazy" /><p class="chu-thich">🧩 Mười bước của CreateFile("C:\\foo\\bar"): tra tên, Parse, IRP đi xuống chồng thiết bị, NTFS điền file object, IRP hoàn thành đi lên, trả handle</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-20: 10 bước của CreateFile("C:\\foo\\bar") qua object manager, I/O manager và chồng hệ thống tệp
participant "Win32\\nCreateFile" as W
participant "I/O manager" as IO
participant "Object manager" as OM
participant "C: device stack\\n(filter → NTFS)" as ST
W -&gt; IO : (1) NtCreateFile(\\\\??\\\\C:\\\\foo\\\\bar)
IO -&gt; OM : (2) ObOpenObjectByName(\\\\??\\\\C:\\\\foo\\\\bar)
OM -&gt; OM : (3) look up \\\\?? → C: → \\\\Device\\\\HarddiskVolume3\\nthe device object "has a Parse method"
OM -&gt; IO : (3) call the Parse routine for type "Device":\\nIopParseDevice(device, \\\\foo\\\\bar)
IO -&gt; IO : (4) allocate a FILE OBJECT and an IRP (I/O request packet)
IO -&gt; ST : (5) IoCallDriver: pass the IRP down the stack
ST -&gt; ST : (6) file-system filter drivers see it first\\n(antivirus, encryption, backup …)
ST -&gt; ST : (7) NTFS: NtfsCreateFile — walks \\\\foo → bar in the MFT,\\nchecks the security descriptor, fills the file object
ST --&gt; IO : (8) IoCompleteRequest: the IRP travels back UP the stack
IO --&gt; OM : (8) the file object is complete
OM -&gt; OM : (9) create a HANDLE in the process's handle table\\npointing to the file object
OM --&gt; W : (10) the handle returns to user mode
@enduml</code></pre></details>
<p>Giờ cả câu chuyện gói trong một câu: <em>object manager phân giải một cái tên, thư mục cuối trong đường dẫn giao cho hệ thống tệp qua phương thức Parse, hệ thống tệp đáp bằng một file object, và object manager giấu đối tượng đó sau một số nhỏ.</em> Hai chi tiết đáng chú ý. <strong>Hoàn thành đi lên cùng chồng</strong>: bất kỳ bộ lọc nào cũng có thể xem hay sửa kết quả trên đường về (bộ lọc mã hoá giải mã ở đây). Và <strong>handle được tạo sau cùng</strong>: nếu có gì thất bại trước đó — tệp không tồn tại, bị từ chối truy cập — không có handle nào và lời gọi Win32 trả <code>INVALID_HANDLE_VALUE</code> với mã lỗi đọc qua <code>GetLastError()</code>.</p>
<p>So với đường đi Linux của <code>open("/foo/bar", O_RDONLY)</code>: VFS đi từng thành phần của đường dẫn bằng <em>dentry cache</em>, hỏi hệ thống tệp <em>inode</em> của từng thành phần, kiểm bit quyền (và capability, LSM), cấp một <code>struct file</code>, cài vào ô trống thấp nhất của bảng descriptor và trả số đó (slide 18). Hai đường ống cùng hình dạng; khác biệt là <strong>ai sở hữu từng bước</strong>: ở Windows <em>I/O manager</em> và <em>object manager</em> sở hữu việc tra và uỷ quyền cho driver bằng IRP; ở Linux <em>VFS</em> sở hữu và gọi hàm hệ thống tệp qua <code>file_operations</code>/<code>inode_operations</code>.</p>
<p class="pitfall">⚠️ IRP <em>không</em> phải lời gọi hệ thống và <em>không</em> phải handle. Lời gọi hệ thống là <em>cú bẫy</em> từ người dùng vào nhân (<code>NtCreateFile</code>); IRP là <em>gói yêu cầu nội bộ của nhân</em> do I/O manager tạo để nói chuyện với driver. Chương trình người dùng không bao giờ thấy IRP. Câu nói "IRP được trả cho ứng dụng" là sai; thứ trả về là handle.</p>`],
      [25, 'The Object Name Space (6)',
        `<p class="y-chinh">🎯 Figure 11-20 puts it all in one diagram: (a) the <strong>flow</strong> — Win32 <code>CreateFile(C:\\foo\\bar)</code> in user mode → <code>NtCreateFile(\\??\\C:\\foo\\bar)</code> → I/O manager (1) → object manager <code>OpenObjectByName(\\??\\C:\\foo\\bar)</code> (2, 3) → I/O manager <code>IopParseDevice(DeviceObject, \\foo\\bar)</code> → file object and IRP (4) → <code>IoCallDriver</code> down the stack of <em>C:</em> (5) → file-system filters (6) → NTFS <code>NtfsCreateFile()</code> (7) → <code>IoCompleteRequest</code> (8) → handle (9) → return to user mode (10); (b) the <strong>name space</strong> — Devices, <code>??</code>, <code>C:</code> (a link), <code>Harddisk1</code> and the device object for the C: volume with a symbolic link to <code>\\Device\\Harddisk1</code>.</p>
<p>This figure is the <em>one</em> to draw in an exam or a talk because it ties three chapters together: system calls (Chapter 1), the file system (Chapter 4) and I/O drivers (Chapter 5). Practise drawing it in this order: 1) a vertical line with "user mode / kernel mode" dashed in the middle; 2) the three layers I/O manager → object manager → I/O manager again (it appears twice: first to start, later to build the IRP); 3) the C: stack at the bottom left with "filters" and NTFS; 4) the little tree at the right with the symbolic link; 5) number the ten steps.</p>
<p>A word about the name <code>\\??\\C:</code>: the <code>\\??\\</code> prefix means "look in the DOS-device directory". The Win32 layer adds it (with <code>\\Device\\Harddisk1</code> in the figure; Microsoft's current naming page shows <code>HarddiskVolume1</code> for the same idea). Newer Windows versions put the per-session variant of this directory first, then the global one — the old book's single <code>\\??</code> is a simplification.</p>
<p>Linux has no <code>\\??\\</code> prefix, but it has a close cousin for finding a device by a stable <em>name</em> instead of the path: <code>/dev/disk/by-uuid/…</code> and <code>/dev/disk/by-label/…</code>, which are symbolic links created by <code>udev</code> to the real block device (<code>/dev/vda1</code>). Drive letters ≈ <code>by-label</code> links; the real device ≈ <code>\\Device\\HarddiskVolumeN</code>.</p>
<p class="pitfall">⚠️ Figure 11-20 numbers the steps (1)–(10) but the I/O manager appears <em>twice</em> at different heights; do not read that as two I/O managers. It is one component acting at two moments: at the start (receives <code>NtCreateFile</code>) and when it parses the device and creates the IRP.</p>`,
        `<p class="y-chinh">🎯 Hình 11-20 gói tất cả vào một sơ đồ: (a) <strong>luồng</strong> — Win32 <code>CreateFile(C:\\foo\\bar)</code> ở chế độ người dùng → <code>NtCreateFile(\\??\\C:\\foo\\bar)</code> → I/O manager (1) → object manager <code>OpenObjectByName(\\??\\C:\\foo\\bar)</code> (2, 3) → I/O manager <code>IopParseDevice(DeviceObject, \\foo\\bar)</code> → file object và IRP (4) → <code>IoCallDriver</code> xuống chồng của <em>C:</em> (5) → bộ lọc hệ thống tệp (6) → NTFS <code>NtfsCreateFile()</code> (7) → <code>IoCompleteRequest</code> (8) → handle (9) → trả về chế độ người dùng (10); (b) <strong>không gian tên</strong> — Devices, <code>??</code>, <code>C:</code> (một liên kết), <code>Harddisk1</code> và device object của volume C: với liên kết tượng trưng tới <code>\\Device\\Harddisk1</code>.</p>
<p>Hình này là hình <em>duy nhất</em> nên vẽ trong đề thi hay buổi thuyết trình vì nó buộc ba chương lại: lời gọi hệ thống (Chương 1), hệ thống tệp (Chương 4) và driver I/O (Chương 5). Tập vẽ theo thứ tự: 1) một đường dọc có nét đứt "chế độ người dùng / chế độ nhân" ở giữa; 2) ba lớp I/O manager → object manager → I/O manager lần nữa (xuất hiện hai lần: lần đầu để bắt đầu, sau để dựng IRP); 3) chồng C: ở góc dưới trái với "bộ lọc" và NTFS; 4) cây nhỏ bên phải với liên kết tượng trưng; 5) đánh số mười bước.</p>
<p>Một lời về tên <code>\\??\\C:</code>: tiền tố <code>\\??\\</code> nghĩa là "tìm trong thư mục thiết bị DOS". Tầng Win32 thêm nó (với <code>\\Device\\Harddisk1</code> trong hình; trang đặt tên hiện hành của Microsoft ghi <code>HarddiskVolume1</code> cho cùng ý). Các bản Windows mới đặt biến thể theo phiên của thư mục này trước, rồi mới tới bản toàn cục — <code>\\??</code> đơn của sách cũ là một sự đơn giản hoá.</p>
<p>Linux không có tiền tố <code>\\??\\</code>, nhưng có họ hàng gần để tìm thiết bị theo một <em>tên</em> ổn định thay vì đường dẫn: <code>/dev/disk/by-uuid/…</code> và <code>/dev/disk/by-label/…</code>, là các liên kết tượng trưng do <code>udev</code> tạo tới thiết bị khối thật (<code>/dev/vda1</code>). Ký tự ổ đĩa ≈ liên kết <code>by-label</code>; thiết bị thật ≈ <code>\\Device\\HarddiskVolumeN</code>.</p>
<p class="pitfall">⚠️ Hình 11-20 đánh số bước (1)–(10) nhưng I/O manager xuất hiện <em>hai lần</em> ở hai độ cao; đừng đọc là hai I/O manager. Đó là một thành phần hoạt động ở hai thời điểm: lúc đầu (nhận <code>NtCreateFile</code>) và khi nó phân tích thiết bị và tạo IRP.</p>`],
      [26, 'The Object Name Space (7)',
        `<p class="y-chinh">🎯 Figure 11-21 (first half) lists <strong>common executive object types</strong> managed by the object manager: <em>Process</em> (user process), <em>Thread</em> (thread within a process), <em>Semaphore</em> (counting semaphore for interprocess synchronization), <em>Mutex</em> (binary semaphore used to enter a critical region), <em>Event</em> (synchronization object with persistent state — signaled or not), <em>ALPC Port</em> (mechanism for interprocess message passing), <em>Timer</em> (lets a thread sleep for a fixed interval), <em>Queue</em> (completion notification on asynchronous I/O), <em>Open file</em> (an open file) and <em>Access token</em> (security descriptor for some object).</p>
<p>Count them against Chapter 2: process, thread (execution); semaphore, mutex, event, timer (synchronization); ALPC port (message passing, the "IPC" of Chapter 2); queue (an <em>I/O completion port</em>, slide 49); open file (I/O); access token (security, slide 60). Windows implements <em>every</em> Chapter 2 mechanism as an object, so it is manageable with the same <code>WaitForSingleObject</code>/<code>CloseHandle</code> calls. Notice also the <em>ALPC port</em> (the book's earlier LPC): named ports are how a Windows service accepts connections from clients on the same machine — Linux uses <em>UNIX domain sockets</em>, D-Bus and pipes.</p>
<table>
<thead><tr><th>Object type</th><th>What it is</th><th>Linux cousin</th></tr></thead>
<tbody>
<tr><td>Process / Thread</td><td>resources / unit scheduled</td><td>process / task (<code>clone</code>)</td></tr>
<tr><td>Semaphore / Mutex / Event / Timer</td><td>wait-able sync objects</td><td><code>sem_t</code> / <code>pthread_mutex_t</code> / <code>eventfd</code> / <code>timerfd</code></td></tr>
<tr><td>ALPC Port</td><td>local message passing</td><td>UNIX domain socket, D-Bus</td></tr>
<tr><td>Queue (I/O completion port)</td><td>batch of completed async I/O</td><td><code>epoll</code> (readiness), <code>io_uring</code> (completion)</td></tr>
<tr><td>Open file</td><td>one open instance of a file</td><td>open file description (<code>struct file</code>)</td></tr>
<tr><td>Access token</td><td>identity + privileges of a process</td><td>uid/gids + capabilities (slide 60)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ The slide lists <em>Mutex</em> as a "binary semaphore", while slide 14 explained that a Windows mutex has an <em>owner</em>. In the book's table (and so in an exam) "binary semaphore used to enter a critical region" is the accepted wording. Know both.</p>`,
        `<p class="y-chinh">🎯 Hình 11-21 (nửa đầu) liệt kê các <strong>loại đối tượng executive thường gặp</strong> do object manager quản lý: <em>Process</em> (tiến trình người dùng), <em>Thread</em> (luồng trong một tiến trình), <em>Semaphore</em> (semaphore đếm để đồng bộ giữa các tiến trình), <em>Mutex</em> (semaphore nhị phân để vào vùng găng), <em>Event</em> (đối tượng đồng bộ có trạng thái bền — signaled hay không), <em>ALPC Port</em> (cơ chế truyền thông điệp giữa các tiến trình), <em>Timer</em> (cho luồng ngủ một khoảng cố định), <em>Queue</em> (thông báo hoàn thành I/O bất đồng bộ), <em>Open file</em> (một tệp đang mở) và <em>Access token</em> (security descriptor của một đối tượng nào đó).</p>
<p>Đếm chúng theo Chương 2: tiến trình, luồng (thực thi); semaphore, mutex, event, timer (đồng bộ); ALPC port (truyền thông điệp, "IPC" của Chương 2); queue (một <em>I/O completion port</em>, slide 49); open file (I/O); access token (bảo mật, slide 60). Windows cài <em>mọi</em> cơ chế của Chương 2 thành đối tượng, nên quản lý được bằng cùng các lời gọi <code>WaitForSingleObject</code>/<code>CloseHandle</code>. Để ý cả <em>ALPC port</em> (LPC trước đó của sách): các cổng có tên là cách một dịch vụ Windows nhận kết nối từ client trên cùng máy — Linux dùng <em>UNIX domain socket</em>, D-Bus và pipe.</p>
<table>
<thead><tr><th>Loại đối tượng</th><th>Là gì</th><th>Họ hàng Linux</th></tr></thead>
<tbody>
<tr><td>Process / Thread</td><td>tài nguyên / đơn vị được lập lịch</td><td>tiến trình / task (<code>clone</code>)</td></tr>
<tr><td>Semaphore / Mutex / Event / Timer</td><td>đối tượng đồng bộ chờ được</td><td><code>sem_t</code> / <code>pthread_mutex_t</code> / <code>eventfd</code> / <code>timerfd</code></td></tr>
<tr><td>ALPC Port</td><td>truyền thông điệp cục bộ</td><td>UNIX domain socket, D-Bus</td></tr>
<tr><td>Queue (I/O completion port)</td><td>lô I/O bất đồng bộ đã xong</td><td><code>epoll</code> (sẵn sàng), <code>io_uring</code> (hoàn thành)</td></tr>
<tr><td>Open file</td><td>một lần mở tệp</td><td>open file description (<code>struct file</code>)</td></tr>
<tr><td>Access token</td><td>danh tính + đặc quyền của tiến trình</td><td>uid/gid + capability (slide 60)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Slide liệt kê <em>Mutex</em> là "semaphore nhị phân", trong khi slide 14 giải thích mutex Windows có <em>chủ</em>. Trong bảng của sách (và nên trong đề thi) "semaphore nhị phân dùng để vào vùng găng" là cách viết được chấp nhận. Hãy biết cả hai.</p>`],
      [27, 'The Object Name Space (8)',
        `<p class="y-chinh">🎯 Figure 11-21 (second half, the rest of the table): <em>Open file</em>, <em>Access token</em>, <em>Profile</em> (data structure used for profiling CPU usage), <em>Section</em> (object used for representing <strong>mappable files</strong>), <em>Key</em> (registry key, used to attach the registry to the object manager name space), <em>Object directory</em> (directory for grouping objects within the object manager), <em>Symbolic link</em> (refers to another object manager object by path name), <em>Device</em> (I/O device object for a physical device, bus, driver, or volume instance) and <em>Device driver</em> (each loaded device driver has its own object). The top row, <em>Queue</em>, is cut off at the slide edge — the picture is the same table scrolled.</p>
<p>Three of these deserve a closer look because you will meet them again. <strong>Section</strong> is how Windows does memory-mapped files and shared memory: <code>CreateFileMapping</code> makes a section object, <code>MapViewOfFile</code> maps part of it into an address space (slide 41), and two processes mapping the same section share memory — the cousin of <code>mmap(MAP_SHARED)</code> and <code>shm_open</code>. <strong>Symbolic link</strong> and <strong>Object directory</strong> are why the name space can be a <em>tree</em> (directories) with <em>aliases</em> (links); Windows has the same three-way structure as a UNIX directory tree. <strong>Key</strong> shows how the registry (slide 10) plugs into the same tree.</p>
<p>The list ends our look at the object manager. A final check on why it matters in daily work: Sysinternals' <strong>WinObj</strong> shows this tree; <strong>Handle</strong> and <strong>Process Explorer</strong> show which process holds which handle (the answer to "who is locking my file?" — see slide 31); <strong>Process Monitor</strong> logs every <code>NtCreateFile</code>. On Linux the same questions are answered by <code>lsof</code>, <code>fuser</code> and <code>strace</code>, and by listing <code>/proc/&lt;pid&gt;/fd</code> exactly as in slide 18.</p>
<p><strong>🧪 Self-check (answers in the practice lesson 11.C).</strong> (1) Which object type represents a memory-mapped file? (2) Which directory holds the drive letters? (3) What is created last when CreateFile succeeds? (4) What is the difference between the Close and Delete procedures? If you can answer these without looking, you have the 17–27 half of the chapter.</p>
<p class="meo">🧠 Closing analogy for the whole first half: <strong>the object manager is the librarian</strong> (names, cards, borrow slips), <strong>the I/O manager is the courier</strong> (IRPs through stacks), <strong>the HAL is the translator</strong>, and <strong>the registry is the card catalogue of settings</strong>.</p>`,
        `<p class="y-chinh">🎯 Hình 11-21 (nửa sau, phần còn lại của bảng): <em>Open file</em>, <em>Access token</em>, <em>Profile</em> (cấu trúc dữ liệu dùng để lấy mẫu mức dùng CPU), <em>Section</em> (đối tượng biểu diễn <strong>tệp ánh xạ được</strong>), <em>Key</em> (khoá registry, dùng gắn registry vào không gian tên của object manager), <em>Object directory</em> (thư mục để gom đối tượng trong object manager), <em>Symbolic link</em> (chỉ tới đối tượng khác của object manager bằng tên đường dẫn), <em>Device</em> (device object I/O cho thiết bị vật lý, bus, driver hay thể hiện volume) và <em>Device driver</em> (mỗi driver đã nạp có đối tượng riêng). Hàng trên cùng, <em>Queue</em>, bị cắt ở mép slide — hình là cùng bảng được cuộn.</p>
<p>Ba trong số này đáng xem kỹ vì bạn sẽ gặp lại. <strong>Section</strong> là cách Windows làm tệp ánh xạ bộ nhớ và bộ nhớ chia sẻ: <code>CreateFileMapping</code> tạo đối tượng section, <code>MapViewOfFile</code> ánh xạ một phần vào không gian địa chỉ (slide 41), và hai tiến trình ánh xạ cùng một section chia sẻ bộ nhớ — họ hàng của <code>mmap(MAP_SHARED)</code> và <code>shm_open</code>. <strong>Symbolic link</strong> và <strong>Object directory</strong> là lý do không gian tên là một <em>cây</em> (thư mục) có <em>bí danh</em> (liên kết); Windows có cùng cấu trúc ba phần như cây thư mục UNIX. <strong>Key</strong> cho thấy registry (slide 10) cắm vào cùng cây như thế nào.</p>
<p>Danh sách này kết thúc phần xem object manager. Kiểm cuối vì sao nó quan trọng trong việc hằng ngày: <strong>WinObj</strong> của Sysinternals hiện cây này; <strong>Handle</strong> và <strong>Process Explorer</strong> cho biết tiến trình nào giữ handle nào (câu trả lời cho "ai đang khoá tệp của tôi?" — xem slide 31); <strong>Process Monitor</strong> ghi mọi <code>NtCreateFile</code>. Trên Linux các câu hỏi này được trả lời bằng <code>lsof</code>, <code>fuser</code> và <code>strace</code>, và bằng liệt kê <code>/proc/&lt;pid&gt;/fd</code> đúng như slide 18.</p>
<p><strong>🧪 Tự kiểm (đáp án ở bài thực hành 11.C).</strong> (1) Loại đối tượng nào biểu diễn tệp ánh xạ bộ nhớ? (2) Thư mục nào chứa ký tự ổ đĩa? (3) Cái gì được tạo sau cùng khi CreateFile thành công? (4) Khác biệt giữa thủ tục Close và Delete là gì? Nếu trả lời được mà không nhìn, bạn đã nắm nửa slide 17–27 của chương.</p>
<p class="meo">🧠 Phép ví kết thúc cho cả nửa đầu: <strong>object manager là thủ thư</strong> (tên, thẻ, phiếu mượn), <strong>I/O manager là người chuyển phát</strong> (IRP qua các chồng), <strong>HAL là người phiên dịch</strong>, và <strong>registry là mục lục thẻ của cấu hình</strong>.</p>`],
    ]),
    bi(`<h2>🎤 First half of the talk: slides 1–27 in 8 minutes</h2>
<p>If your group presents Chapter 11, this half is the "foundations and big picture" part. Suggested split: <strong>speaker 1</strong> (2 min) — the two lineages and why NT survived (slides 2–4, picture from slide 2); <strong>speaker 2</strong> (3 min) — the layers and one call traced from <code>CreateFile</code> to <code>NtCreateFile</code> (slides 5–9, the sequence diagram of slide 8); <strong>speaker 3</strong> (3 min) — structure and the object manager: executive/HAL/drivers, handles, and the ten steps of opening a file (slides 12–25, picture of slide 25). The full 20-minute outline with demonstrations, likely questions and English phrases is at the end of lesson 11.B.</p>
<p>Demonstration for this half (1 minute, works on any Linux or WSL): <code>ls -l /proc/self/fd</code> — "these are Linux's handles"; then open a second terminal tab and run <code>sudo lsof -p &lt;pid&gt;</code> for a Node process. On Windows say: "the same view in Process Explorer, <em>View → Lower Pane → Handles</em>".</p>`,
    `<h2>🎤 Nửa đầu của bài nói: slide 1–27 trong 8 phút</h2>
<p>Nếu nhóm bạn trình bày Chương 11, nửa này là phần "nền tảng và bức tranh lớn". Gợi ý chia: <strong>người nói 1</strong> (2 phút) — hai dòng và vì sao NT sống sót (slide 2–4, hình ở slide 2); <strong>người nói 2</strong> (3 phút) — các tầng và một lời gọi lần theo từ <code>CreateFile</code> tới <code>NtCreateFile</code> (slide 5–9, sơ đồ tuần tự ở slide 8); <strong>người nói 3</strong> (3 phút) — cấu trúc và object manager: executive/HAL/driver, handle, và mười bước mở một tệp (slide 12–25, hình ở slide 25). Dàn ý 20 phút đầy đủ với demo, câu hỏi hay gặp và cụm tiếng Anh nằm ở cuối bài 11.B.</p>
<p>Demo cho nửa này (1 phút, chạy trên mọi Linux hay WSL): <code>ls -l /proc/self/fd</code> — "đây là handle của Linux"; rồi mở một tab terminal thứ hai và chạy <code>sudo lsof -p &lt;pid&gt;</code> cho một tiến trình Node. Trên Windows nói: "cùng góc nhìn đó trong Process Explorer, <em>View → Lower Pane → Handles</em>".</p>`),
    books([
      ['mos4', 'Chapter 11 "Case Study 2: Windows 8", sections 11.1–11.3 (history, programming Windows, system structure, object manager), Figures 11-1 to 11-21', 'Chương 11 "Case Study 2: Windows 8", mục 11.1–11.3 (lịch sử, lập trình Windows, cấu trúc hệ thống, object manager), Hình 11-1 tới 11-21'],
      ['win32', 'Microsoft Learn (Win32): Naming Files, Paths, and Namespaces · Registry Hives · Job Objects · Fibers · Thread Pools', 'Microsoft Learn (Win32): Naming Files, Paths, and Namespaces · Registry Hives · Job Objects · Fibers · Thread Pools'],
      ['man7', 'open(2), dup(2), proc(5) (/proc/pid/fd), strace(1), getrlimit(2), sysctl(8)', 'open(2), dup(2), proc(5) (/proc/pid/fd), strace(1), getrlimit(2), sysctl(8)'],
    ]),
  ].join('\n'),
};

/* ───────── 11.B — 📑 Slide by slide · Windows: threads, scheduling, memory, I/O, NTFS, security, Windows 10/11 (slides 28–64) ───────── */
const L_osg11_2 = {
  title: '11.B — 📑 Slide by slide · Windows: threads, scheduling, memory, I/O, NTFS, security, Windows 10/11 (slides 28–64)|||11.B — 📑 Học theo từng slide · Windows: luồng, lập lịch, bộ nhớ, I/O, NTFS, bảo mật, Windows 10/11 (slide 28–64)',
  slug: 'osg202-slide-osg11-2',
  type: 'VIDEO',
  description: 'Giảng đủ 37 slide sau của Chương 11 (Tanenbaum, Modern Operating Systems 4e) — chủ đề thuyết trình của môn: job, tiến trình, luồng, fiber, thread pool và lập lịch chế độ người dùng; lập lịch ưu tiên 32 mức và đảo ngược ưu tiên; bộ nhớ ảo, lỗi trang, tập làm việc và các danh sách trang; I/O, IRP và chồng driver; hệ thống tệp NTFS (MFT, run, nén); bảo mật (SID, token, ACL, mức toàn vẹn, giảm thiểu khai thác). Mỗi ý có sơ đồ, mô phỏng hoặc chương trình Linux chạy thật làm họ hàng, kèm cập nhật Windows 10/11, WSL 2, VBS/HVCI, ReFS, Dev Drive, Windows containers có nguồn learn.microsoft.com, và dàn ý thuyết trình 20 phút.',
  content: [
    bi(`<span class="eyebrow">Chapter 11 · Lesson 11.B · deck "Chapter 11 · Case Study 2: Windows 8", slides 28–64</span>
<h2>Inside Windows at work: running programs, memory, files and protection</h2>
<p class="lead">Lesson 11.A showed how Windows is built and how a name becomes a handle. This lesson shows what Windows <em>does all day</em>: it runs <strong>threads</strong> at 32 priority levels, hands out <strong>virtual memory</strong> page by page, moves <strong>I/O requests</strong> down stacks of drivers, stores files in the <strong>NTFS</strong> master file table, and decides who may touch what with <strong>tokens and ACLs</strong>. As before, the lab runs Linux, so each topic pairs the Windows diagram with a <em>real Linux program</em>, and each ends with what changed in <strong>Windows 10/11 and Windows Server</strong> (Microsoft Learn sources).</p>
<table>
<thead><tr><th>Slides</th><th>Book section</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>28–35</td><td>11.4 Processes and threads</td><td>draw job → process → thread → fiber, explain thread pools and why user-mode scheduling was dropped, and name the Win32 calls for processes, threads and synchronization</td></tr>
<tr><td>36–39</td><td>11.4.3 Scheduling</td><td>read the 32-level priority table, compute a base priority, and explain priority inversion with the boost fix</td></tr>
<tr><td>40–48</td><td>11.5 Memory management</td><td>describe the 2 GB/2 GB layout, VirtualAlloc reserve/commit, the five page-fault kinds, working sets and the standby/modified/free/zeroed lists</td></tr>
<tr><td>49–52</td><td>11.7 I/O</td><td>follow an IRP down a device stack, and compare IOCP with epoll</td></tr>
<tr><td>53–58</td><td>11.8 NTFS</td><td>read an MFT record, explain runs, alternate data streams and compression, and know ReFS and Dev Drive</td></tr>
<tr><td>59–63</td><td>11.10 Security</td><td>explain SID, access token, security descriptor, DACL order, integrity levels and the main exploit mitigations, plus VBS/HVCI</td></tr>
<tr><td>64</td><td>summary</td><td>present the chapter in 20 minutes (outline at the end of this lesson)</td></tr>
</tbody>
</table>
<div class="callout">Slides on caching (book section 11.6) and power management (11.9) are not in the deck; this lesson adds them as ➕ boxes (slide 48 and slide 12) from Microsoft Learn. Practice and quiz are in lesson 11.C; the FE-bank check is summarised at the end of 11.C.</div>`,
    `<span class="eyebrow">Chương 11 · Bài 11.B · deck "Chapter 11 · Case Study 2: Windows 8", slide 28–64</span>
<h2>Windows làm việc bên trong: chạy chương trình, bộ nhớ, tệp và bảo vệ</h2>
<p class="lead">Bài 11.A cho thấy Windows được dựng thế nào và một cái tên thành handle ra sao. Bài này cho thấy Windows <em>làm gì cả ngày</em>: chạy <strong>luồng</strong> ở 32 mức ưu tiên, cấp <strong>bộ nhớ ảo</strong> từng trang, chuyển <strong>yêu cầu I/O</strong> xuống chồng driver, lưu tệp trong bảng tệp chủ <strong>NTFS</strong>, và quyết định ai được chạm vào gì bằng <strong>token và ACL</strong>. Như trước, lab chạy Linux, nên mỗi chủ đề ghép sơ đồ Windows với một <em>chương trình Linux thật</em>, và kết thúc bằng những gì đã đổi ở <strong>Windows 10/11 và Windows Server</strong> (nguồn Microsoft Learn).</p>
<table>
<thead><tr><th>Slide</th><th>Mục trong sách</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>28–35</td><td>11.4 Tiến trình và luồng</td><td>vẽ job → tiến trình → luồng → fiber, giải thích thread pool và vì sao lập lịch chế độ người dùng bị bỏ, và gọi tên các lời gọi Win32 cho tiến trình, luồng và đồng bộ</td></tr>
<tr><td>36–39</td><td>11.4.3 Lập lịch</td><td>đọc bảng ưu tiên 32 mức, tính độ ưu tiên gốc, và giải thích đảo ngược ưu tiên cùng cách sửa bằng boost</td></tr>
<tr><td>40–48</td><td>11.5 Quản lý bộ nhớ</td><td>mô tả bố cục 2 GB/2 GB, VirtualAlloc reserve/commit, năm loại lỗi trang, tập làm việc và các danh sách standby/modified/free/zeroed</td></tr>
<tr><td>49–52</td><td>11.7 I/O</td><td>lần theo một IRP xuống chồng thiết bị, và so IOCP với epoll</td></tr>
<tr><td>53–58</td><td>11.8 NTFS</td><td>đọc một bản ghi MFT, giải thích run, luồng dữ liệu phụ và nén, và biết ReFS và Dev Drive</td></tr>
<tr><td>59–63</td><td>11.10 Bảo mật</td><td>giải thích SID, access token, security descriptor, thứ tự DACL, mức toàn vẹn và các biện pháp giảm thiểu khai thác chính, cộng VBS/HVCI</td></tr>
<tr><td>64</td><td>tóm tắt</td><td>trình bày chương trong 20 phút (dàn ý ở cuối bài này)</td></tr>
</tbody>
</table>
<div class="callout">Các slide về bộ đệm (mục sách 11.6) và quản lý năng lượng (11.9) không có trong deck; bài này thêm chúng thành ô ➕ (slide 48 và slide 12) từ Microsoft Learn. Thực hành và quiz ở bài 11.C; phần đối chiếu ngân hàng FE tóm tắt ở cuối 11.C.</div>`),
    walkHead('osg11', 28, 64),
    walk('osg11', [
      [28, 'Jobs, Processes, Threads, Fibers',
        `<p class="y-chinh">🎯 Figure 11-22: Windows has <strong>four</strong> levels of execution units. A <strong>job</strong> is a group of processes with shared limits (optional). A <strong>process</strong> is a container of resources (address space, handle table, token). A <strong>thread</strong> is what the kernel schedules. A <strong>fiber</strong> is a lightweight unit that <em>your program</em> schedules on top of a thread (optional). "Jobs and fibers are optional; not all processes are in jobs or contain fibers."</p>
<p>Picture a company. The <em>job</em> is a department budget that applies to several teams ("together you may use at most 8 cars and 20% of the electricity"). A <em>process</em> is one team with its office (rooms and keys = address space and handles). A <em>thread</em> is one employee, who can be sent to work by the building's manager (the kernel). A <em>fiber</em> is a task-card that one employee carries and swaps for another by their own choice, without the manager knowing. Only employees get paid CPU time; teams and departments are just labels with rules.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/721ef3c005317901923d53a5c90e4e0fad56eeec.svg" alt="Figure 11-22 with Linux cousins: job ≈ cgroup, process ≈ process, thread ≈ thread (task), fiber ≈ ucontext/coroutine" loading="lazy" /><p class="chu-thich">🧩 Figure 11-22 with Linux cousins: job ≈ cgroup, process ≈ process, thread ≈ thread (task), fiber ≈ ucontext/coroutine</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 11-22: job &gt; process &gt; thread &gt; fiber. Jobs and fibers are optional. The kernel schedules only THREADS
skinparam rectangle {
  RoundCorner 3
}
rectangle "Job (optional)\\nlimits + accounting for a group of processes\\nLinux cousin: cgroup" as job #FEF9C3
rectangle "Process A\\ncontainer of resources:\\naddress space, handle table, access token\\nLinux cousin: process" as pa
rectangle "Process B" as pb
rectangle "Thread A1\\nscheduled by the kernel\\n(priority 0–31)\\nLinux cousin: thread (task)" as t1 #DBEAFE
rectangle "Thread A2" as t2 #DBEAFE
rectangle "Thread B1" as t3 #DBEAFE
rectangle "Fiber (optional)\\nscheduled by YOUR code\\n(SwitchToFiber)\\nLinux cousin: ucontext / coroutine" as f1 #DCFCE7
rectangle "Fiber" as f2 #DCFCE7
job --&gt; pa
job --&gt; pb
pa --&gt; t1
pa --&gt; t2
pb --&gt; t3
t1 ..&gt; f1 : "runs"
t1 ..&gt; f2 : "runs"
note right of job : A process may sit in a job (and, since Windows 8,\\nin NESTED jobs). Windows containers and\\nAppContainer apps are built from jobs.
@enduml</code></pre></details>
<p>The Windows <em>job object</em> (Microsoft, "Job Objects") "allows groups of processes to be managed as a unit": it can enforce limits such as working-set size, process priority and an end-of-job time limit; <code>TerminateJobObject</code> kills every member; with <code>JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE</code>, closing the last handle kills the whole group. Children of a process in a job join the job by default. <strong>Nested jobs</strong> were added in Windows 8 and Windows Server 2012 — the very version of this deck — so a process can sit in a hierarchy of jobs whose limits combine. Linux's <strong>cgroup v2</strong> is the same idea (a tree of groups with controllers). Run the equivalent of the Win32 calls, line by line:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A Windows job object = a Linux cgroup: a group of processes with shared limits and accounting<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+pids +cpu +memory" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
# CreateJobObject<br>
$ mkdir /sys/fs/cgroup/job1<br>
# SetInformationJobObject: at most 4 processes, 20% of one CPU<br>
$ echo 4 &gt; /sys/fs/cgroup/job1/pids.max<br>
$ echo "20000 100000" &gt; /sys/fs/cgroup/job1/cpu.max<br>
$ echo "pids.max = $(cat /sys/fs/cgroup/job1/pids.max)"<br>
pids.max = 4<br>
$ echo "cpu.max = $(cat /sys/fs/cgroup/job1/cpu.max)"<br>
cpu.max = 20000 100000<br>
# AssignProcessToJobObject: put a shell in the job; children inherit the membership (as in a Windows job)<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/job1/cgroup.procs; for i in 1 2 3 4 5 6; do sleep 60 &amp; done 2&gt;/dev/null; sleep 0.3' 2&gt;&amp;1<br>
$ echo "refusals: $(grep ^max /sys/fs/cgroup/job1/pids.events)"<br>
refusals: max 5<br>
# QueryInformationJobObject<br>
$ echo "processes in the job: $(wc -l &lt; /sys/fs/cgroup/job1/cgroup.procs)"<br>
processes in the job: 3<br>
# TerminateJobObject: kill every member at once<br>
$ echo 1 &gt; /sys/fs/cgroup/job1/cgroup.kill<br>
$ sleep 0.5<br>
$ echo "after cgroup.kill: $(wc -l &lt; /sys/fs/cgroup/job1/cgroup.procs) processes"<br>
after cgroup.kill: 0 processes</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Each comment names the Win32 function it mimics: <code>mkdir</code> ≈ <code>CreateJobObject</code>, writing <code>pids.max</code> and <code>cpu.max</code> ≈ <code>SetInformationJobObject</code> (here: at most 4 processes, and "20000 of every 100000 microseconds" = 20% of one CPU), writing a PID into <code>cgroup.procs</code> ≈ <code>AssignProcessToJobObject</code>, reading it ≈ <code>QueryInformationJobObject</code>, and <code>cgroup.kill</code> ≈ <code>TerminateJobObject</code>. The counter <code>pids.events max</code> shows how many <code>fork</code> attempts the limit refused — the fork-bomb defence. <strong>Docker is built on exactly this</strong>: <code>docker run --memory=… --cpus=… --pids-limit=…</code> writes cgroup files; Windows containers use jobs for the same purpose.</p>
<p class="pitfall">⚠️ Do not call a <em>job</em> a "kind of process" or a "batch job" from the mainframe days. A job object is a <strong>kernel object that groups processes</strong>. Also: the kernel schedules <em>threads</em>, never processes or fibers — a recurring FE-style statement ("the CPU schedules processes") is a simplification.</p>`,
        `<p class="y-chinh">🎯 Hình 11-22: Windows có <strong>bốn</strong> mức đơn vị thực thi. <strong>Job</strong> là nhóm tiến trình dùng chung giới hạn (tuỳ chọn). <strong>Tiến trình</strong> là thùng chứa tài nguyên (không gian địa chỉ, bảng handle, token). <strong>Luồng</strong> là thứ nhân lập lịch. <strong>Fiber</strong> là đơn vị nhẹ mà <em>chương trình của bạn</em> lập lịch bên trên một luồng (tuỳ chọn). "Job và fiber là tuỳ chọn; không phải tiến trình nào cũng nằm trong job hay chứa fiber."</p>
<p>Hình dung một công ty. <em>Job</em> là ngân sách phòng ban áp dụng cho vài đội ("cả nhóm được dùng tối đa 8 xe và 20% điện"). <em>Tiến trình</em> là một đội với văn phòng riêng (phòng và chìa khoá = không gian địa chỉ và handle). <em>Luồng</em> là một nhân viên, được quản lý toà nhà (nhân) cử đi làm. <em>Fiber</em> là tấm thẻ việc một nhân viên mang theo và tự đổi sang việc khác theo ý mình mà quản lý không biết. Chỉ nhân viên được trả thời gian CPU; đội và phòng ban chỉ là nhãn có luật.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/721ef3c005317901923d53a5c90e4e0fad56eeec.svg" alt="Hình 11-22 kèm họ hàng Linux: job ≈ cgroup, tiến trình ≈ tiến trình, luồng ≈ luồng (task), fiber ≈ ucontext/coroutine" loading="lazy" /><p class="chu-thich">🧩 Hình 11-22 kèm họ hàng Linux: job ≈ cgroup, tiến trình ≈ tiến trình, luồng ≈ luồng (task), fiber ≈ ucontext/coroutine</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-22: job &gt; process &gt; thread &gt; fiber. Job và fiber là tuỳ chọn. Nhân chỉ lập lịch LUỒNG
skinparam rectangle {
  RoundCorner 3
}
rectangle "Job (optional)\\nlimits + accounting for a group of processes\\nLinux cousin: cgroup" as job #FEF9C3
rectangle "Process A\\ncontainer of resources:\\naddress space, handle table, access token\\nLinux cousin: process" as pa
rectangle "Process B" as pb
rectangle "Thread A1\\nscheduled by the kernel\\n(priority 0–31)\\nLinux cousin: thread (task)" as t1 #DBEAFE
rectangle "Thread A2" as t2 #DBEAFE
rectangle "Thread B1" as t3 #DBEAFE
rectangle "Fiber (optional)\\nscheduled by YOUR code\\n(SwitchToFiber)\\nLinux cousin: ucontext / coroutine" as f1 #DCFCE7
rectangle "Fiber" as f2 #DCFCE7
job --&gt; pa
job --&gt; pb
pa --&gt; t1
pa --&gt; t2
pb --&gt; t3
t1 ..&gt; f1 : "runs"
t1 ..&gt; f2 : "runs"
note right of job : A process may sit in a job (and, since Windows 8,\\nin NESTED jobs). Windows containers and\\nAppContainer apps are built from jobs.
@enduml</code></pre></details>
<p><em>Job object</em> của Windows (Microsoft, "Job Objects") "cho phép quản lý nhóm tiến trình như một đơn vị": nó áp được giới hạn như cỡ tập làm việc, độ ưu tiên tiến trình và giới hạn thời gian kết thúc job; <code>TerminateJobObject</code> giết mọi thành viên; với <code>JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE</code>, đóng handle cuối giết cả nhóm. Tiến trình con của một tiến trình trong job mặc định gia nhập job. <strong>Job lồng nhau</strong> được thêm vào Windows 8 và Windows Server 2012 — chính phiên bản của bộ slide này — nên một tiến trình ngồi trong một phân cấp job có giới hạn cộng dồn. <strong>cgroup v2</strong> của Linux là cùng ý (một cây nhóm có các bộ điều khiển). Chạy tương đương của các lời gọi Win32, từng dòng:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Job object của Windows = cgroup của Linux: nhóm tiến trình có giới hạn và thống kê chung<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+pids +cpu +memory" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
# CreateJobObject<br>
$ mkdir /sys/fs/cgroup/job1<br>
# SetInformationJobObject: tối đa 4 tiến trình, 20% của một CPU<br>
$ echo 4 &gt; /sys/fs/cgroup/job1/pids.max<br>
$ echo "20000 100000" &gt; /sys/fs/cgroup/job1/cpu.max<br>
$ echo "pids.max = $(cat /sys/fs/cgroup/job1/pids.max)"<br>
pids.max = 4<br>
$ echo "cpu.max = $(cat /sys/fs/cgroup/job1/cpu.max)"<br>
cpu.max = 20000 100000<br>
# AssignProcessToJobObject: cho một shell vào job; tiến trình con thừa hưởng tư cách thành viên (như job Windows)<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/job1/cgroup.procs; for i in 1 2 3 4 5 6; do sleep 60 &amp; done 2&gt;/dev/null; sleep 0.3' 2&gt;&amp;1<br>
$ echo "refusals: $(grep ^max /sys/fs/cgroup/job1/pids.events)"<br>
refusals: max 5<br>
# QueryInformationJobObject<br>
$ echo "processes in the job: $(wc -l &lt; /sys/fs/cgroup/job1/cgroup.procs)"<br>
processes in the job: 3<br>
# TerminateJobObject: giết mọi thành viên cùng lúc<br>
$ echo 1 &gt; /sys/fs/cgroup/job1/cgroup.kill<br>
$ sleep 0.5<br>
$ echo "after cgroup.kill: $(wc -l &lt; /sys/fs/cgroup/job1/cgroup.procs) processes"<br>
after cgroup.kill: 0 processes</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Mỗi chú thích nêu tên hàm Win32 mà nó mô phỏng: <code>mkdir</code> ≈ <code>CreateJobObject</code>, ghi <code>pids.max</code> và <code>cpu.max</code> ≈ <code>SetInformationJobObject</code> (ở đây: tối đa 4 tiến trình, và "20000 trên mỗi 100000 micro giây" = 20% một CPU), ghi một PID vào <code>cgroup.procs</code> ≈ <code>AssignProcessToJobObject</code>, đọc nó ≈ <code>QueryInformationJobObject</code>, và <code>cgroup.kill</code> ≈ <code>TerminateJobObject</code>. Bộ đếm <code>pids.events max</code> cho biết có bao nhiêu lần <code>fork</code> bị giới hạn từ chối — phòng thủ trước bom fork. <strong>Docker dựng trên đúng thứ này</strong>: <code>docker run --memory=… --cpus=… --pids-limit=…</code> ghi các tệp cgroup; container Windows dùng job cho cùng mục đích.</p>
<p class="pitfall">⚠️ Đừng gọi <em>job</em> là "một loại tiến trình" hay "batch job" thời máy lớn. Job object là một <strong>đối tượng nhân gom các tiến trình</strong>. Ngoài ra: nhân lập lịch <em>luồng</em>, không bao giờ là tiến trình hay fiber — câu kiểu FE lặp đi lặp lại ("CPU lập lịch tiến trình") là cách nói đơn giản hoá.</p>`],
      [29, 'Thread Pools and User-Mode Scheduling (1)',
        `<p class="y-chinh">🎯 The slide lists the key elements of <strong>User-Mode Scheduling (UMS)</strong>: <strong>(1) user-mode switching</strong> (a thread switches to another UMS thread without entering the kernel), <strong>(2) re-entering the user-mode scheduler</strong> (when a UMS thread blocks in the kernel, control returns to the application's scheduler), and <strong>(3) system call completion</strong> (the blocked thread is queued back to the application's list when the system call finishes). The title also promises <strong>thread pools</strong> — the part that survived.</p>
<p>Everyday picture of a thread pool: a restaurant does not hire a new waiter for every customer and fire him after the meal. It keeps a team of, say, eight waiters and a queue of tables; whoever is free takes the next table. Hiring (creating a thread: a stack, kernel structures, scheduling) is expensive; reusing is cheap. That is a <strong>thread pool</strong>. Microsoft's description: "a collection of worker threads that efficiently execute asynchronous callbacks on behalf of the application"; the architecture has worker threads, waiter threads, a work queue, <em>a default thread pool for each process</em> and a worker factory. By default each pool has a maximum of <strong>500 worker threads</strong>, and the pool tries to keep the number of ready/running threads below the number of processors. You queue a <em>work item</em> (<code>SubmitThreadpoolWork</code>), a <em>wait</em> on a handle, a <em>timer</em>, or an <em>I/O</em> binding; the pool decides which thread runs the callback.</p>
<p>The same design runs inside the programs you write. Node.js (libuv) has a <em>global thread pool</em>; libuv's documentation says it runs "file system operations and DNS functions" (<code>getaddrinfo</code>) plus user code from <code>uv_queue_work</code>, and warns that the pool is "quite limited" in size (the default is 4 threads). The experiment below runs 8 CPU-heavy jobs (<code>crypto.pbkdf2</code>, which Node offloads to the pool) with the pool at 1, 4 and 8 threads on a 10-CPU container:</p>
<div class="out"># Node's libuv thread pool (default 4 threads) runs file system / crypto work, like the Windows thread pool runs callbacks<br>
$ cat &gt; /tmp/pool.js &lt;&lt;'JS'<br>
&gt; const crypto = require('crypto');<br>
&gt; const t0 = Date.now();<br>
&gt; let left = 8;<br>
&gt; for (let i = 0; i &lt; 8; i++) crypto.pbkdf2('pw', 'salt', 400000, 32, 'sha512', () =&gt; {<br>
&gt; &nbsp;&nbsp;if (--left === 0) console.log('8 pbkdf2 jobs took', String(Date.now() - t0).padStart(5), 'ms');<br>
&gt; });<br>
&gt; JS<br>
$ for n in 1 4 8; do printf 'size %s &nbsp;' $n; UV_THREADPOOL_SIZE=$n node /tmp/pool.js | sed 's/8 pbkdf2 jobs took//'; done<br>
size 1 &nbsp;&nbsp;&nbsp;2093 ms<br>
size 4 &nbsp;&nbsp;&nbsp;&nbsp;916 ms<br>
size 8 &nbsp;&nbsp;&nbsp;&nbsp;711 ms<br>
$ nproc<br>
10</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>One thread: the 8 jobs run one after another (about 8 × 260 ms ≈ 2.1 s). Four threads: two waves of four (about 0.9 s). Eight threads: one wave (about 0.7 s — not 8× faster than one, because memory and CPU limits and scheduling add overhead). Your numbers will differ run to run (the output is "one real run"), but the <em>shape</em> — time falls as the pool grows, then flattens — is the lesson. Java's equivalent is <code>ExecutorService</code> with a fixed pool (and, since Java 21, virtual threads — next slide); .NET's is <code>ThreadPool</code> and <code>Task</code>, built on the Windows pool.</p>
<p><strong>➕ Update — UMS is gone (source: learn.microsoft.com, "User-Mode Scheduling").</strong> The page now opens with a warning: "<em>As of Windows 11, user-mode scheduling is not supported. All calls fail with the error <code>ERROR_NOT_SUPPORTED</code>.</em>" UMS was available only for 64-bit applications on AMD64 and Itanium versions of Windows 7 / Server 2008 R2 through <strong>Windows 10 version 21H2 and Windows Server 2022</strong>, and "is not available on Arm64, 32-bit versions of Windows or on Windows 11". The slide describes a feature that has been removed — a good example for a talk of "OS features that die".</p>
<p class="pitfall">⚠️ Thread pool ≠ UMS ≠ fiber. Pool: the <em>system</em> reuses kernel threads for short callbacks. UMS: the <em>application</em> switches between kernel threads in user mode (removed). Fiber: the <em>application</em> switches between code paths on one thread (still exists, slide 30).</p>`,
        `<p class="y-chinh">🎯 Slide liệt kê các yếu tố chính của <strong>Lập lịch chế độ người dùng (UMS)</strong>: <strong>(1) chuyển đổi ở chế độ người dùng</strong> (một luồng chuyển sang luồng UMS khác mà không vào nhân), <strong>(2) quay lại bộ lập lịch chế độ người dùng</strong> (khi luồng UMS bị chặn trong nhân, quyền điều khiển trở về bộ lập lịch của ứng dụng), và <strong>(3) hoàn thành lời gọi hệ thống</strong> (luồng bị chặn được xếp lại vào danh sách của ứng dụng khi lời gọi hệ thống xong). Tiêu đề cũng hứa <strong>thread pool</strong> — phần còn sống sót.</p>
<p>Hình dung đời thường về thread pool: nhà hàng không thuê một người phục vụ mới cho mỗi khách rồi sa thải sau bữa ăn. Nó giữ một đội, giả sử tám người, và một hàng bàn; ai rảnh nhận bàn kế. Thuê (tạo luồng: một stack, cấu trúc nhân, lập lịch) tốn kém; tái sử dụng thì rẻ. Đó là <strong>thread pool</strong>. Mô tả của Microsoft: "một tập các luồng làm việc thực thi hiệu quả các callback bất đồng bộ thay mặt ứng dụng"; kiến trúc gồm luồng làm việc, luồng chờ, hàng đợi việc, <em>một thread pool mặc định cho mỗi tiến trình</em> và một worker factory. Mặc định mỗi pool tối đa <strong>500 luồng làm việc</strong>, và pool cố giữ số luồng sẵn sàng/đang chạy dưới số bộ xử lý. Bạn xếp một <em>work item</em> (<code>SubmitThreadpoolWork</code>), một <em>chờ</em> trên handle, một <em>timer</em>, hay một ràng buộc <em>I/O</em>; pool quyết định luồng nào chạy callback.</p>
<p>Cùng thiết kế đó chạy bên trong chương trình bạn viết. Node.js (libuv) có <em>thread pool toàn cục</em>; tài liệu libuv nói nó chạy "các thao tác hệ thống tệp và hàm DNS" (<code>getaddrinfo</code>) cùng mã người dùng từ <code>uv_queue_work</code>, và cảnh báo pool "khá hạn chế" về cỡ (mặc định 4 luồng). Thí nghiệm dưới đây chạy 8 việc nặng CPU (<code>crypto.pbkdf2</code>, mà Node đẩy sang pool) với pool 1, 4 và 8 luồng trên container 10 CPU:</p>
<div class="out"># Thread pool của libuv trong Node (mặc định 4 luồng) chạy việc tệp / mật mã, như thread pool Windows chạy callback<br>
$ cat &gt; /tmp/pool.js &lt;&lt;'JS'<br>
&gt; const crypto = require('crypto');<br>
&gt; const t0 = Date.now();<br>
&gt; let left = 8;<br>
&gt; for (let i = 0; i &lt; 8; i++) crypto.pbkdf2('pw', 'salt', 400000, 32, 'sha512', () =&gt; {<br>
&gt; &nbsp;&nbsp;if (--left === 0) console.log('8 pbkdf2 jobs took', String(Date.now() - t0).padStart(5), 'ms');<br>
&gt; });<br>
&gt; JS<br>
$ for n in 1 4 8; do printf 'size %s &nbsp;' $n; UV_THREADPOOL_SIZE=$n node /tmp/pool.js | sed 's/8 pbkdf2 jobs took//'; done<br>
size 1 &nbsp;&nbsp;&nbsp;2093 ms<br>
size 4 &nbsp;&nbsp;&nbsp;&nbsp;916 ms<br>
size 8 &nbsp;&nbsp;&nbsp;&nbsp;711 ms<br>
$ nproc<br>
10</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Một luồng: 8 việc chạy lần lượt (khoảng 8 × 260 ms ≈ 2,1 s). Bốn luồng: hai đợt bốn (khoảng 0,9 s). Tám luồng: một đợt (khoảng 0,7 s — không nhanh gấp 8 lần một luồng, vì giới hạn bộ nhớ và CPU và chi phí lập lịch). Số của bạn sẽ khác mỗi lần chạy (kết quả là "một lần chạy thật"), nhưng <em>hình dạng</em> — thời gian giảm khi pool lớn lên, rồi phẳng — là bài học. Tương đương Java là <code>ExecutorService</code> với pool cố định (và, từ Java 21, luồng ảo — slide sau); của .NET là <code>ThreadPool</code> và <code>Task</code>, dựng trên pool Windows.</p>
<p><strong>➕ Cập nhật — UMS đã chết (nguồn: learn.microsoft.com, "User-Mode Scheduling").</strong> Trang nay mở đầu bằng một cảnh báo: "<em>Từ Windows 11, lập lịch chế độ người dùng không được hỗ trợ. Mọi lời gọi thất bại với lỗi <code>ERROR_NOT_SUPPORTED</code>.</em>" UMS chỉ có cho ứng dụng 64 bit trên các bản Windows AMD64 và Itanium từ Windows 7 / Server 2008 R2 đến <strong>Windows 10 version 21H2 và Windows Server 2022</strong>, và "không có trên Arm64, các bản Windows 32 bit hay Windows 11". Slide mô tả một tính năng đã bị gỡ — ví dụ hay cho bài nói về "tính năng HĐH đã chết".</p>
<p class="pitfall">⚠️ Thread pool ≠ UMS ≠ fiber. Pool: <em>hệ thống</em> tái dùng luồng nhân cho các callback ngắn. UMS: <em>ứng dụng</em> chuyển giữa các luồng nhân ở chế độ người dùng (đã gỡ). Fiber: <em>ứng dụng</em> chuyển giữa các đường mã trên một luồng (vẫn còn, slide 30).</p>`],
      [30, 'Thread Pools and User-Mode Scheduling (2)',
        `<p class="y-chinh">🎯 Figure 11-23 is the vocabulary table for this section: <strong>Job</strong> — collection of processes that share quotas and limits (used in AppContainers); <strong>Process</strong> — container for holding resources; <strong>Thread</strong> — entity scheduled by the kernel; <strong>Fiber</strong> — lightweight thread managed entirely in user space (rarely used); <strong>Thread pool</strong> — task-oriented programming model, built on top of threads; <strong>User-mode thread</strong> — abstraction allowing user-mode thread switching, an extension of threads.</p>
<p>Memorise the table as a ladder of <em>who does the scheduling</em>: job and process = nobody schedules them (they own things); thread = <strong>kernel</strong> schedules; fiber = <strong>your code</strong> schedules, invisibly to the kernel; pool = <strong>the library</strong> picks a thread for each task; UMS thread = the kernel schedules a <em>kernel thread</em> but your code picks <em>which UMS thread runs on it</em>. Microsoft's Fibers page: "A fiber is a unit of execution that must be manually scheduled by the application"; "in general, fibers do not provide advantages over a well-designed multithreaded application", but they "can make it easier to port applications that were designed to schedule their own threads". The only state kept per fiber is its <strong>stack, a subset of registers and the fiber data</strong>; fibers are not preemptively scheduled — you switch with <code>SwitchToFiber</code>, after <code>ConvertThreadToFiber</code> and <code>CreateFiber</code>.</p>
<p>Run the Linux cousin: <code>ucontext</code> saves and restores registers and a stack pointer. The program creates 3 fibers, each prints 3 steps and yields to our own round-robin "scheduler" in <code>main</code>:</p>
<pre><code class="language-c">// A user-mode "fiber": cooperative switching with ucontext, the Linux cousin of ConvertThreadToFiber / CreateFiber / SwitchToFiber
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;ucontext.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

#define N 3
static ucontext_t main_ctx, fib[N];
static char *stack[N];

static long tid(void) { return syscall(SYS_gettid); }

static void worker(int id) {
    for (int step = 1; step &lt;= 3; step++) {
        printf("fiber %d step %d  (on OS thread %s main)\\n", id, step, tid() == getpid() ? "==" : "!=");
        swapcontext(&amp;fib[id], &amp;main_ctx);                      // like SwitchToFiber(scheduler): give control back
    }
    printf("fiber %d done\\n", id);
}

int main(void) {
    for (int i = 0; i &lt; N; i++) {                              // like CreateFiber(stackSize, fn, param)
        stack[i] = malloc(64 * 1024);
        getcontext(&amp;fib[i]);
        fib[i].uc_stack.ss_sp = stack[i];
        fib[i].uc_stack.ss_size = 64 * 1024;
        fib[i].uc_link = &amp;main_ctx;                            // where to go when the fiber function returns
        makecontext(&amp;fib[i], (void (*)(void))worker, 1, i);
    }
    // our own round-robin "scheduler": the kernel knows NOTHING about it
    for (int round = 0; round &lt; 4; round++)
        for (int i = 0; i &lt; N; i++)
            swapcontext(&amp;main_ctx, &amp;fib[i]);
    printf("all fibers finished; OS threads used: 1\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread soi-fiber.c -o soi-fiber &amp;&amp; ./soi-fiber<br>
fiber 0 step 1 &nbsp;(on OS thread == main)<br>
fiber 1 step 1 &nbsp;(on OS thread == main)<br>
fiber 2 step 1 &nbsp;(on OS thread == main)<br>
fiber 0 step 2 &nbsp;(on OS thread == main)<br>
fiber 1 step 2 &nbsp;(on OS thread == main)<br>
fiber 2 step 2 &nbsp;(on OS thread == main)<br>
fiber 0 step 3 &nbsp;(on OS thread == main)<br>
fiber 1 step 3 &nbsp;(on OS thread == main)<br>
fiber 2 step 3 &nbsp;(on OS thread == main)<br>
fiber 0 done<br>
fiber 1 done<br>
fiber 2 done<br>
all fibers finished; OS threads used: 1</div>
<p>Output order is 0, 1, 2, 0, 1, 2 … — a schedule <em>we</em> wrote, with a single OS thread (<code>on OS thread == main</code>): the kernel saw one thread and never knew there were three tasks. The price you pay: if one fiber blocks in a system call (a slow <code>read</code>), the <em>whole thread</em> blocks, so every other fiber waits. That is exactly why UMS tried to add "re-enter the scheduler when a system call blocks" (slide 29) and why the idea was finally dropped.</p>
<p>The modern replacement: runtimes that do fibers well. <strong>Java 21 virtual threads</strong> are fibers built into the JVM: the runtime parks a virtual thread when it blocks (<code>Thread.sleep</code>, socket read) and runs another on the same <em>carrier</em> OS thread — so blocking no longer stalls others. The program below starts <strong>100,000</strong> virtual threads that each sleep 500 ms:</p>
<pre><code class="language-java">// Java 21 virtual threads: the managed cousin of a Windows fiber, but the runtime (not you) switches them
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.nio.file.*;

public class LuongAo {
    static int osThreads() throws Exception {                  // Linux: count entries in /proc/self/task
        try (var s = Files.list(Path.of("/proc/self/task"))) { return (int) s.count(); }
    }
    public static void main(String[] args) throws Exception {
        final int N = 100_000;
        AtomicInteger done = new AtomicInteger(), peak = new AtomicInteger();
        long t0 = System.nanoTime();
        try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {   // one cheap thread per task
            for (int i = 0; i &lt; N; i++) {
                pool.submit(() -&gt; {
                    try { Thread.sleep(500); } catch (InterruptedException e) { }   // blocks: the carrier is released
                    done.incrementAndGet();
                });
            }
            Thread.sleep(250);
            peak.set(osThreads());
        }
        long ms = (System.nanoTime() - t0) / 1_000_000;
        System.out.println("virtual threads: " + done.get() + " done");
        System.out.println("carrier OS threads at most: " + peak.get() + "  (not 100000)");
        System.out.println("finished in " + (ms &lt; 5000 ? "under 5 s" : "over 5 s") + " although every task slept 500 ms");
    }
}</code></pre>
<div class="out">$ javac LuongAo.java &amp;&amp; java LuongAo<br>
virtual threads: 100000 done<br>
carrier OS threads at most: 39 &nbsp;(not 100000)<br>
finished in under 5 s although every task slept 500 ms</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>100,000 tasks finished in a few seconds using only a few dozen OS threads (the carriers). Node.js reaches the same goal differently (<code>async/await</code> on one event-loop thread, slide 49); C# <code>async/await</code> and Go goroutines are cousins too. In .NET on Windows an <code>await</code> continues on the thread pool — the fiber idea lives on inside the compiler, not in the Win32 fiber API.</p>
<p class="pitfall">⚠️ FE-style trap: "a fiber is scheduled by the kernel" — false. And "UMS threads are fibers" — false: UMS threads each have their <em>own thread context</em>; fibers share the thread's (Microsoft: "UMS threads differ from fibers in that each UMS thread has its own thread context instead of sharing the thread context of a single thread").</p>`,
        `<p class="y-chinh">🎯 Hình 11-23 là bảng từ vựng cho mục này: <strong>Job</strong> — tập tiến trình dùng chung hạn mức và giới hạn (dùng trong AppContainer); <strong>Process</strong> — thùng chứa tài nguyên; <strong>Thread</strong> — thực thể được nhân lập lịch; <strong>Fiber</strong> — luồng nhẹ được quản lý hoàn toàn ở không gian người dùng (hiếm dùng); <strong>Thread pool</strong> — mô hình lập trình hướng tác vụ, dựng trên luồng; <strong>User-mode thread</strong> — trừu tượng cho phép chuyển luồng ở chế độ người dùng, một phần mở rộng của luồng.</p>
<p>Học bảng như một chiếc thang <em>ai làm việc lập lịch</em>: job và tiến trình = không ai lập lịch chúng (chúng sở hữu đồ); luồng = <strong>nhân</strong> lập lịch; fiber = <strong>mã của bạn</strong> lập lịch, nhân không thấy; pool = <strong>thư viện</strong> chọn luồng cho mỗi tác vụ; luồng UMS = nhân lập lịch một <em>luồng nhân</em> nhưng mã của bạn chọn <em>luồng UMS nào chạy trên đó</em>. Trang Fibers của Microsoft: "Fiber là đơn vị thực thi phải được ứng dụng lập lịch thủ công"; "nói chung, fiber không có lợi thế hơn một ứng dụng đa luồng thiết kế tốt", nhưng chúng "có thể giúp chuyển các ứng dụng vốn tự lập lịch luồng sang dễ hơn". Trạng thái duy nhất giữ cho mỗi fiber là <strong>stack, một tập con thanh ghi và dữ liệu fiber</strong>; fiber không được lập lịch chiếm quyền — bạn chuyển bằng <code>SwitchToFiber</code>, sau <code>ConvertThreadToFiber</code> và <code>CreateFiber</code>.</p>
<p>Chạy họ hàng Linux: <code>ucontext</code> lưu và khôi phục thanh ghi và con trỏ stack. Chương trình tạo 3 fiber, mỗi cái in 3 bước và nhường lại cho "bộ lập lịch" round-robin của ta trong <code>main</code>:</p>
<pre><code class="language-c">// "Fiber" chế độ người dùng: chuyển đổi hợp tác bằng ucontext, họ hàng Linux của ConvertThreadToFiber / CreateFiber / SwitchToFiber
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;ucontext.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/syscall.h&gt;

#define N 3
static ucontext_t main_ctx, fib[N];
static char *stack[N];

static long tid(void) { return syscall(SYS_gettid); }

static void worker(int id) {
    for (int step = 1; step &lt;= 3; step++) {
        printf("fiber %d step %d  (on OS thread %s main)\\n", id, step, tid() == getpid() ? "==" : "!=");
        swapcontext(&amp;fib[id], &amp;main_ctx);                      // như SwitchToFiber(bộ lập lịch): trả quyền điều khiển
    }
    printf("fiber %d done\\n", id);
}

int main(void) {
    for (int i = 0; i &lt; N; i++) {                              // như CreateFiber(cỡ stack, hàm, tham số)
        stack[i] = malloc(64 * 1024);
        getcontext(&amp;fib[i]);
        fib[i].uc_stack.ss_sp = stack[i];
        fib[i].uc_stack.ss_size = 64 * 1024;
        fib[i].uc_link = &amp;main_ctx;                            // về đâu khi hàm của fiber return
        makecontext(&amp;fib[i], (void (*)(void))worker, 1, i);
    }
    // "bộ lập lịch" round-robin của riêng ta: nhân KHÔNG biết gì về nó
    for (int round = 0; round &lt; 4; round++)
        for (int i = 0; i &lt; N; i++)
            swapcontext(&amp;main_ctx, &amp;fib[i]);
    printf("all fibers finished; OS threads used: 1\\n");
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread soi-fiber.c -o soi-fiber &amp;&amp; ./soi-fiber<br>
fiber 0 step 1 &nbsp;(on OS thread == main)<br>
fiber 1 step 1 &nbsp;(on OS thread == main)<br>
fiber 2 step 1 &nbsp;(on OS thread == main)<br>
fiber 0 step 2 &nbsp;(on OS thread == main)<br>
fiber 1 step 2 &nbsp;(on OS thread == main)<br>
fiber 2 step 2 &nbsp;(on OS thread == main)<br>
fiber 0 step 3 &nbsp;(on OS thread == main)<br>
fiber 1 step 3 &nbsp;(on OS thread == main)<br>
fiber 2 step 3 &nbsp;(on OS thread == main)<br>
fiber 0 done<br>
fiber 1 done<br>
fiber 2 done<br>
all fibers finished; OS threads used: 1</div>
<p>Thứ tự ra là 0, 1, 2, 0, 1, 2 … — một lịch <em>ta</em> tự viết, với một luồng HĐH duy nhất (<code>on OS thread == main</code>): nhân thấy một luồng và không bao giờ biết có ba tác vụ. Cái giá phải trả: nếu một fiber bị chặn trong lời gọi hệ thống (một <code>read</code> chậm), <em>cả luồng</em> bị chặn, mọi fiber khác phải chờ. Đó chính là lý do UMS cố thêm "quay lại bộ lập lịch khi lời gọi hệ thống bị chặn" (slide 29) và vì sao ý tưởng cuối cùng bị bỏ.</p>
<p>Thay thế hiện đại: các runtime làm fiber tốt. <strong>Luồng ảo của Java 21</strong> là fiber dựng sẵn trong JVM: runtime đỗ một luồng ảo khi nó bị chặn (<code>Thread.sleep</code>, đọc socket) và chạy luồng khác trên cùng luồng HĐH <em>chở</em> — nên chặn không còn làm kẹt luồng khác. Chương trình dưới đây khởi động <strong>100.000</strong> luồng ảo mỗi cái ngủ 500 ms:</p>
<pre><code class="language-java">// Luồng ảo của Java 21: họ hàng "có quản lý" của fiber Windows, nhưng runtime (không phải bạn) chuyển đổi chúng
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.nio.file.*;

public class LuongAo {
    static int osThreads() throws Exception {                  // Linux: đếm mục trong /proc/self/task
        try (var s = Files.list(Path.of("/proc/self/task"))) { return (int) s.count(); }
    }
    public static void main(String[] args) throws Exception {
        final int N = 100_000;
        AtomicInteger done = new AtomicInteger(), peak = new AtomicInteger();
        long t0 = System.nanoTime();
        try (var pool = Executors.newVirtualThreadPerTaskExecutor()) {   // mỗi việc một luồng rẻ
            for (int i = 0; i &lt; N; i++) {
                pool.submit(() -&gt; {
                    try { Thread.sleep(500); } catch (InterruptedException e) { }   // chặn: luồng chở được thả ra
                    done.incrementAndGet();
                });
            }
            Thread.sleep(250);
            peak.set(osThreads());
        }
        long ms = (System.nanoTime() - t0) / 1_000_000;
        System.out.println("virtual threads: " + done.get() + " done");
        System.out.println("carrier OS threads at most: " + peak.get() + "  (not 100000)");
        System.out.println("finished in " + (ms &lt; 5000 ? "under 5 s" : "over 5 s") + " although every task slept 500 ms");
    }
}</code></pre>
<div class="out">$ javac LuongAo.java &amp;&amp; java LuongAo<br>
virtual threads: 100000 done<br>
carrier OS threads at most: 39 &nbsp;(not 100000)<br>
finished in under 5 s although every task slept 500 ms</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>100.000 tác vụ xong trong vài giây chỉ dùng vài chục luồng HĐH (các luồng chở). Node.js đạt cùng mục tiêu theo cách khác (<code>async/await</code> trên một luồng vòng lặp sự kiện, slide 49); <code>async/await</code> của C# và goroutine của Go cũng là họ hàng. Trong .NET trên Windows một <code>await</code> tiếp tục trên thread pool — ý tưởng fiber sống tiếp trong trình biên dịch, không trong API fiber của Win32.</p>
<p class="pitfall">⚠️ Bẫy kiểu FE: "fiber do nhân lập lịch" — sai. Và "luồng UMS là fiber" — sai: mỗi luồng UMS có <em>ngữ cảnh luồng riêng</em>; fiber dùng chung ngữ cảnh của luồng (Microsoft: "luồng UMS khác fiber ở chỗ mỗi luồng UMS có ngữ cảnh luồng riêng thay vì dùng chung ngữ cảnh của một luồng").</p>`],
      [31, 'Job, Process, Thread, and Fiber Management API Calls (1)',
        `<p class="y-chinh">🎯 The next three slides list the <strong>differences from UNIX</strong> in process management. This slide: <strong>(1)</strong> the search path for finding the program to execute is buried in the Win32 library code, while UNIX manages it more explicitly (the shell's <code>PATH</code>); <strong>(2)</strong> the current working directory is a kernel-mode concept in UNIX but a <em>user-mode string</em> in Windows; <strong>(3)</strong> UNIX parses the command line and passes an <em>array</em> of parameters, while Win32 leaves argument parsing to the individual program.</p>
<p>These look like footnotes; they are the root of daily Windows-versus-Linux bugs. Think of ordering a taxi. In UNIX you hand the driver a <em>list of separate stops</em> (an array) and he reads it as written. In Win32 you hand him <em>one long sentence</em> and each driver (each program, through its C runtime or <code>CommandLineToArgvW</code>) decides where the words split and what the quotes mean — so two programs can read the same sentence differently. Run the Linux behaviour first, then the traps that appear when code written on Windows moves to Linux:</p>
<pre><code class="language-javascript">// Windows hands a new process ONE command-line string (each program splits it); Linux hands an ARRAY of arguments
const { spawnSync } = require('child_process');
const show = 'i=0; for a in "$@"; do i=$((i+1)); printf "argv[%s] = [%s]\\\\n" $i "$a"; done';
// Array form: no quoting problems, spaces and quotes survive untouched
const r1 = spawnSync('/bin/sh', ['-c', show, 'x', 'hello world', 'say "hi"', "it's"], { encoding: 'utf8' });
process.stdout.write('execve with an array:\\n' + r1.stdout);
// String form through a shell: the SHELL splits it, and quoting becomes your problem
const r2 = spawnSync('/bin/sh', ['-c', 'set -- hello world say "hi"; ' + show], { encoding: 'utf8' });
process.stdout.write('one string split by the shell:\\n' + r2.stdout);
// The classic bug: user input glued into a command string
const filename = 'report.txt; echo INJECTED';
const r3 = spawnSync('/bin/sh', ['-c', 'echo processing ' + filename], { encoding: 'utf8' });
process.stdout.write('string concatenation:\\n' + r3.stdout);
const r4 = spawnSync('echo', ['processing', filename], { encoding: 'utf8' });
process.stdout.write('array (safe):\\n' + r4.stdout);</code></pre>
<div class="out">$ node args-array.js<br>
execve with an array:<br>
argv[1] = [hello world]<br>
argv[2] = [say "hi"]<br>
argv[3] = [it's]<br>
one string split by the shell:<br>
argv[1] = [hello]<br>
argv[2] = [world]<br>
argv[3] = [say]<br>
argv[4] = [hi]<br>
string concatenation:<br>
processing report.txt<br>
INJECTED<br>
array (safe):<br>
processing report.txt; echo INJECTED</div>
<p>Line 1: an <em>array</em> passes <code>hello world</code> as one argument, quotes and apostrophes untouched. Line 2: when one <em>string</em> goes through the shell, the <strong>shell</strong> splits it — <code>hello</code>, <code>world</code>, <code>say</code>, <code>hi</code> (the quotes were eaten). Line 3 is the classic <strong>command injection</strong> bug: building a command by gluing user input into a string runs <code>echo INJECTED</code> as a second command; the array form (line 4) printed the dangerous text harmlessly. On Windows the string form is the <em>only</em> form at the system-call level, so the same mistake is easy there too (<code>cmd.exe /c</code> with user input); safe code uses <code>spawn(file, argsArray)</code> in Node, <code>ProcessBuilder</code> in Java, <code>subprocess.run([...])</code> in Python.</p>
<p>The second difference, the <strong>current directory</strong>, shows in CI scripts: on Linux <code>cd</code> changes a property of the <em>process in the kernel</em> that children inherit; on Windows the library keeps it as a string and also a per-drive current directory (<code>C:tmp.txt</code> is relative to the current directory <em>of drive C</em> — Microsoft's naming page documents this odd form). The third is <strong>where the program is searched</strong>: Win32 <code>CreateProcess</code> looks first in the <em>application's own directory</em> and the current directory before <code>PATH</code> (a source of "DLL/exe hijacking" security bugs); Linux executes exactly the path you give or searches <code>PATH</code> only in the <code>exec*p</code> functions.</p>
<p><strong>Deployment gotchas from Windows to Linux</strong> — run these two programs once and you will recognise the bugs. First, file <em>names</em> and <em>line endings</em>:</p>
<div class="out"># Linux treats names as bytes: letter case matters, backslash and colon are ordinary letters. NTFS (default) ignores case and forbids \\ / : * ? " &lt; &gt; |<br>
$ cd /tmp &amp;&amp; mkdir -p site &amp;&amp; cd site<br>
$ echo one &gt; App.js; echo two &gt; app.js; echo three &gt; APP.JS<br>
$ ls<br>
APP.JS<br>
App.js<br>
app.js<br>
$ echo "import './App.js' &nbsp;-&gt; $(cat App.js) &nbsp;&nbsp;| &nbsp;&nbsp;import './app.js' -&gt; $(cat app.js)"<br>
import './App.js' &nbsp;-&gt; one &nbsp;&nbsp;| &nbsp;&nbsp;import './app.js' -&gt; two<br>
# Names a Windows checkout cannot create: reserved device names, trailing dot, a colon<br>
$ touch con aux nul "report." "a:b" 'back\\slash'<br>
$ ls<br>
APP.JS<br>
App.js<br>
a:b<br>
app.js<br>
aux<br>
back\\slash<br>
con<br>
nul<br>
report.<br>
# Permissions: a file copied from a Windows disk often arrives with every execute bit set (755), or none<br>
$ printf '#!/bin/sh\\necho I run\\n' &gt; run.sh<br>
$ ls -l run.sh | cut -c1-10<br>
-rw-r--r--<br>
$ ./run.sh 2&gt;&amp;1 | head -1<br>
bash: ./run.sh: Permission denied<br>
$ chmod +x run.sh &amp;&amp; ./run.sh<br>
I run</div>
<div class="out"># Windows ends a text line with CR+LF (\\r\\n); Linux with LF (\\n) only. A script saved on Windows breaks bash<br>
# Make the file the way Notepad would save it (every line ends with \\r\\n)<br>
$ printf '#!/bin/bash\\r\\necho "deploying..."\\r\\nexport APP_ENV=production\\r\\necho "env is $APP_ENV"\\r\\n' &gt; /tmp/deploy.sh<br>
$ chmod +x /tmp/deploy.sh<br>
$ file /tmp/deploy.sh<br>
/tmp/deploy.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators<br>
# Run it directly: the kernel reads the interpreter name "/bin/bash\\r" and cannot find it<br>
$ /tmp/deploy.sh<br>
bash: /tmp/deploy.sh: cannot execute: required file not found<br>
$ echo "exit code: $?"<br>
exit code: 127<br>
# Run it with bash explicitly: the \\r becomes part of every command and value<br>
$ bash /tmp/deploy.sh 2&gt;&amp;1 | cat -A<br>
deploying...^M$<br>
env is production^M^M$<br>
# The tell-tale sign: od shows the 0d byte before every 0a<br>
$ head -c 40 /tmp/deploy.sh | od -c | head -3<br>
0000000 &nbsp;&nbsp;# &nbsp;&nbsp;! &nbsp;&nbsp;/ &nbsp;&nbsp;b &nbsp;&nbsp;i &nbsp;&nbsp;n &nbsp;&nbsp;/ &nbsp;&nbsp;b &nbsp;&nbsp;a &nbsp;&nbsp;s &nbsp;&nbsp;h &nbsp;\\r &nbsp;\\n &nbsp;&nbsp;e &nbsp;&nbsp;c &nbsp;&nbsp;h<br>
0000020 &nbsp;&nbsp;o &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" &nbsp;&nbsp;d &nbsp;&nbsp;e &nbsp;&nbsp;p &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;y &nbsp;&nbsp;i &nbsp;&nbsp;n &nbsp;&nbsp;g &nbsp;&nbsp;. &nbsp;&nbsp;. &nbsp;&nbsp;. &nbsp;&nbsp;"<br>
0000040 &nbsp;\\r &nbsp;\\n &nbsp;&nbsp;e &nbsp;&nbsp;x &nbsp;&nbsp;p &nbsp;&nbsp;o &nbsp;&nbsp;r &nbsp;&nbsp;t<br>
# Fix: strip the CR (what dos2unix does). git config core.autocrlf and a .gitattributes file prevent it at the source<br>
$ sed -i 's/\\r$//' /tmp/deploy.sh<br>
$ file /tmp/deploy.sh<br>
/tmp/deploy.sh: Bourne-Again shell script, ASCII text executable<br>
$ /tmp/deploy.sh &amp;&amp; echo "fixed: ok"<br>
deploying...<br>
env is production<br>
fixed: ok</div>
<p>Read them as a checklist. <strong>Case:</strong> on Linux <code>App.js</code>, <code>app.js</code> and <code>APP.JS</code> are three files; NTFS by default treats them as one (Microsoft: "Do not assume case sensitivity"), so an <code>import './app.js'</code> that works on a case-insensitive Windows laptop <em>fails on the Linux server</em> if the real file is <code>App.js</code> — the most common "works on my machine" bug in Node projects. <strong>Names:</strong> Windows forbids <code>&lt; &gt; : " / \\ | ? *</code>, names ending in a space or period, and the device names <code>CON, PRN, AUX, NUL, COM1–9, LPT1–9</code> (even with an extension); Linux allowed all of those in the second listing, so a repository created on Linux can <strong>fail to check out on Windows</strong>. <strong>Permissions:</strong> a script copied from Windows arrives without the execute bit (<code>Permission denied</code>); <code>git update-index --chmod=+x</code> or <code>chmod +x</code> fixes it. <strong>Line endings:</strong> Notepad-style CRLF breaks the shebang line (<em>"cannot execute: required file not found"</em> because the interpreter name became <code>/bin/bash\\r</code>) and silently appends <code>\\r</code> to every value (<code>env is production^M</code>); <code>file</code> reveals "with CRLF line terminators", and <code>sed -i 's/\\r$//'</code> (or <code>dos2unix</code>) repairs it. Prevent it at the source with <code>.gitattributes</code> (<code>* text=auto eol=lf</code>, or <code>*.sh text eol=lf</code>).</p>
<p class="pitfall">⚠️ The bash message depends on the version and path: older bash says <code>/bin/bash^M: bad interpreter: No such file or directory</code>; this lab's bash says "cannot execute: required file not found". Same cause. FE rarely asks it, but interviews do.</p>`,
        `<p class="y-chinh">🎯 Ba slide tiếp theo liệt kê các <strong>khác biệt với UNIX</strong> trong quản lý tiến trình. Slide này: <strong>(1)</strong> đường tìm chương trình để chạy bị chôn trong mã thư viện Win32, trong khi UNIX quản lý tường minh hơn (<code>PATH</code> của shell); <strong>(2)</strong> thư mục làm việc hiện tại là khái niệm chế độ nhân ở UNIX nhưng là một <em>chuỗi chế độ người dùng</em> ở Windows; <strong>(3)</strong> UNIX phân tích dòng lệnh và truyền một <em>mảng</em> tham số, còn Win32 để việc phân tích đối số cho từng chương trình.</p>
<p>Các điểm này trông như chú thích; chúng là gốc của lỗi Windows-so-với-Linux hằng ngày. Hình dung gọi taxi. Ở UNIX bạn đưa tài xế một <em>danh sách các điểm dừng riêng lẻ</em> (một mảng) và anh đọc đúng như viết. Ở Win32 bạn đưa <em>một câu dài</em> và mỗi tài xế (mỗi chương trình, qua thư viện C hay <code>CommandLineToArgvW</code>) tự quyết chỗ tách chữ và ý nghĩa dấu nháy — nên hai chương trình có thể đọc cùng một câu khác nhau. Chạy hành vi Linux trước, rồi các bẫy xuất hiện khi mã viết trên Windows chuyển sang Linux:</p>
<pre><code class="language-javascript">// Windows đưa cho tiến trình mới MỘT chuỗi dòng lệnh (mỗi chương trình tự tách); Linux đưa MỘT MẢNG đối số
const { spawnSync } = require('child_process');
const show = 'i=0; for a in "$@"; do i=$((i+1)); printf "argv[%s] = [%s]\\\\n" $i "$a"; done';
// Dạng mảng: không có vấn đề trích dẫn, khoảng trắng và dấu nháy giữ nguyên
const r1 = spawnSync('/bin/sh', ['-c', show, 'x', 'hello world', 'say "hi"', "it's"], { encoding: 'utf8' });
process.stdout.write('execve with an array:\\n' + r1.stdout);
// Dạng chuỗi qua shell: SHELL tách nó, và trích dẫn thành vấn đề của bạn
const r2 = spawnSync('/bin/sh', ['-c', 'set -- hello world say "hi"; ' + show], { encoding: 'utf8' });
process.stdout.write('one string split by the shell:\\n' + r2.stdout);
// Lỗi kinh điển: dữ liệu người dùng dán vào chuỗi lệnh
const filename = 'report.txt; echo INJECTED';
const r3 = spawnSync('/bin/sh', ['-c', 'echo processing ' + filename], { encoding: 'utf8' });
process.stdout.write('string concatenation:\\n' + r3.stdout);
const r4 = spawnSync('echo', ['processing', filename], { encoding: 'utf8' });
process.stdout.write('array (safe):\\n' + r4.stdout);</code></pre>
<div class="out">$ node args-array.js<br>
execve with an array:<br>
argv[1] = [hello world]<br>
argv[2] = [say "hi"]<br>
argv[3] = [it's]<br>
one string split by the shell:<br>
argv[1] = [hello]<br>
argv[2] = [world]<br>
argv[3] = [say]<br>
argv[4] = [hi]<br>
string concatenation:<br>
processing report.txt<br>
INJECTED<br>
array (safe):<br>
processing report.txt; echo INJECTED</div>
<p>Dòng 1: một <em>mảng</em> truyền <code>hello world</code> thành một đối số, dấu nháy và dấu nháy đơn giữ nguyên. Dòng 2: khi một <em>chuỗi</em> đi qua shell, <strong>shell</strong> tách nó — <code>hello</code>, <code>world</code>, <code>say</code>, <code>hi</code> (dấu nháy bị ăn mất). Dòng 3 là lỗi kinh điển <strong>chèn lệnh (command injection)</strong>: dựng lệnh bằng cách dán dữ liệu người dùng vào chuỗi chạy <code>echo INJECTED</code> như lệnh thứ hai; dạng mảng (dòng 4) in văn bản nguy hiểm một cách vô hại. Trên Windows dạng chuỗi là dạng <em>duy nhất</em> ở mức lời gọi hệ thống, nên cùng lỗi đó cũng dễ xảy ra (<code>cmd.exe /c</code> với dữ liệu người dùng); mã an toàn dùng <code>spawn(file, argsArray)</code> trong Node, <code>ProcessBuilder</code> trong Java, <code>subprocess.run([...])</code> trong Python.</p>
<p>Khác biệt thứ hai, <strong>thư mục hiện tại</strong>, hiện ra trong script CI: trên Linux <code>cd</code> đổi một thuộc tính của <em>tiến trình trong nhân</em> mà con thừa hưởng; trên Windows thư viện giữ nó như một chuỗi và còn có thư mục hiện tại theo từng ổ (<code>C:tmp.txt</code> là tương đối với thư mục hiện tại <em>của ổ C</em> — trang đặt tên của Microsoft ghi dạng lạ này). Thứ ba là <strong>nơi tìm chương trình</strong>: <code>CreateProcess</code> của Win32 tìm trước ở <em>thư mục của chính ứng dụng</em> và thư mục hiện tại rồi mới tới <code>PATH</code> (nguồn của lỗi bảo mật "chiếm DLL/exe"); Linux chạy đúng đường dẫn bạn đưa hoặc chỉ tìm <code>PATH</code> trong các hàm <code>exec*p</code>.</p>
<p><strong>Bẫy triển khai từ Windows sang Linux</strong> — chạy hai chương trình này một lần là bạn nhận ra các lỗi. Trước hết, <em>tên</em> tệp và <em>ký tự xuống dòng</em>:</p>
<div class="out"># Linux coi tên là dãy byte: hoa/thường khác nhau, dấu \\ và : là chữ thường. NTFS (mặc định) bỏ qua hoa/thường và cấm \\ / : * ? " &lt; &gt; |<br>
$ cd /tmp &amp;&amp; mkdir -p site &amp;&amp; cd site<br>
$ echo one &gt; App.js; echo two &gt; app.js; echo three &gt; APP.JS<br>
$ ls<br>
APP.JS<br>
App.js<br>
app.js<br>
$ echo "import './App.js' &nbsp;-&gt; $(cat App.js) &nbsp;&nbsp;| &nbsp;&nbsp;import './app.js' -&gt; $(cat app.js)"<br>
import './App.js' &nbsp;-&gt; one &nbsp;&nbsp;| &nbsp;&nbsp;import './app.js' -&gt; two<br>
# Tên mà bản checkout trên Windows không tạo được: tên thiết bị dành riêng, dấu chấm cuối, dấu hai chấm<br>
$ touch con aux nul "report." "a:b" 'back\\slash'<br>
$ ls<br>
APP.JS<br>
App.js<br>
a:b<br>
app.js<br>
aux<br>
back\\slash<br>
con<br>
nul<br>
report.<br>
# Quyền: tệp chép từ đĩa Windows thường đến với đủ bit thực thi (755), hoặc không có<br>
$ printf '#!/bin/sh\\necho I run\\n' &gt; run.sh<br>
$ ls -l run.sh | cut -c1-10<br>
-rw-r--r--<br>
$ ./run.sh 2&gt;&amp;1 | head -1<br>
bash: ./run.sh: Permission denied<br>
$ chmod +x run.sh &amp;&amp; ./run.sh<br>
I run</div>
<div class="out"># Windows kết thúc dòng bằng CR+LF (\\r\\n); Linux chỉ bằng LF (\\n). Script lưu trên Windows làm hỏng bash<br>
# Tạo tệp như Notepad lưu (mỗi dòng kết thúc bằng \\r\\n)<br>
$ printf '#!/bin/bash\\r\\necho "deploying..."\\r\\nexport APP_ENV=production\\r\\necho "env is $APP_ENV"\\r\\n' &gt; /tmp/deploy.sh<br>
$ chmod +x /tmp/deploy.sh<br>
$ file /tmp/deploy.sh<br>
/tmp/deploy.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators<br>
# Chạy trực tiếp: nhân đọc tên trình thông dịch "/bin/bash\\r" và không tìm thấy<br>
$ /tmp/deploy.sh<br>
bash: /tmp/deploy.sh: cannot execute: required file not found<br>
$ echo "exit code: $?"<br>
exit code: 127<br>
# Chạy bằng bash tường minh: \\r thành một phần của mọi lệnh và giá trị<br>
$ bash /tmp/deploy.sh 2&gt;&amp;1 | cat -A<br>
deploying...^M$<br>
env is production^M^M$<br>
# Dấu hiệu nhận biết: od hiện byte 0d trước mỗi 0a<br>
$ head -c 40 /tmp/deploy.sh | od -c | head -3<br>
0000000 &nbsp;&nbsp;# &nbsp;&nbsp;! &nbsp;&nbsp;/ &nbsp;&nbsp;b &nbsp;&nbsp;i &nbsp;&nbsp;n &nbsp;&nbsp;/ &nbsp;&nbsp;b &nbsp;&nbsp;a &nbsp;&nbsp;s &nbsp;&nbsp;h &nbsp;\\r &nbsp;\\n &nbsp;&nbsp;e &nbsp;&nbsp;c &nbsp;&nbsp;h<br>
0000020 &nbsp;&nbsp;o &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" &nbsp;&nbsp;d &nbsp;&nbsp;e &nbsp;&nbsp;p &nbsp;&nbsp;l &nbsp;&nbsp;o &nbsp;&nbsp;y &nbsp;&nbsp;i &nbsp;&nbsp;n &nbsp;&nbsp;g &nbsp;&nbsp;. &nbsp;&nbsp;. &nbsp;&nbsp;. &nbsp;&nbsp;"<br>
0000040 &nbsp;\\r &nbsp;\\n &nbsp;&nbsp;e &nbsp;&nbsp;x &nbsp;&nbsp;p &nbsp;&nbsp;o &nbsp;&nbsp;r &nbsp;&nbsp;t<br>
# Sửa: bỏ ký tự CR (việc dos2unix làm). git config core.autocrlf và tệp .gitattributes ngăn từ gốc<br>
$ sed -i 's/\\r$//' /tmp/deploy.sh<br>
$ file /tmp/deploy.sh<br>
/tmp/deploy.sh: Bourne-Again shell script, ASCII text executable<br>
$ /tmp/deploy.sh &amp;&amp; echo "fixed: ok"<br>
deploying...<br>
env is production<br>
fixed: ok</div>
<p>Đọc như một danh sách kiểm. <strong>Hoa/thường:</strong> trên Linux <code>App.js</code>, <code>app.js</code> và <code>APP.JS</code> là ba tệp; NTFS mặc định coi là một (Microsoft: "Đừng giả định phân biệt hoa thường"), nên <code>import './app.js'</code> chạy được trên laptop Windows không phân biệt hoa thường sẽ <em>lỗi trên server Linux</em> nếu tệp thật là <code>App.js</code> — lỗi "chạy được trên máy tôi" phổ biến nhất của dự án Node. <strong>Tên:</strong> Windows cấm <code>&lt; &gt; : " / \\ | ? *</code>, tên kết thúc bằng khoảng trắng hay dấu chấm, và các tên thiết bị <code>CON, PRN, AUX, NUL, COM1–9, LPT1–9</code> (kể cả có đuôi); Linux cho phép hết ở danh sách thứ hai, nên kho mã tạo trên Linux có thể <strong>không checkout được trên Windows</strong>. <strong>Quyền:</strong> script chép từ Windows đến mà không có bit thực thi (<code>Permission denied</code>); <code>git update-index --chmod=+x</code> hay <code>chmod +x</code> sửa được. <strong>Xuống dòng:</strong> CRLF kiểu Notepad làm hỏng dòng shebang (<em>"cannot execute: required file not found"</em> vì tên trình thông dịch thành <code>/bin/bash\\r</code>) và lặng lẽ thêm <code>\\r</code> vào mọi giá trị (<code>env is production^M</code>); <code>file</code> lộ ra "with CRLF line terminators", và <code>sed -i 's/\\r$//'</code> (hay <code>dos2unix</code>) sửa được. Ngăn từ gốc bằng <code>.gitattributes</code> (<code>* text=auto eol=lf</code>, hay <code>*.sh text eol=lf</code>).</p>
<p class="pitfall">⚠️ Thông báo của bash tuỳ phiên bản và đường dẫn: bash cũ nói <code>/bin/bash^M: bad interpreter: No such file or directory</code>; bash của lab này nói "cannot execute: required file not found". Cùng nguyên nhân. FE hiếm hỏi, nhưng phỏng vấn thì có.</p>`],
      [32, 'Job, Process, Thread, and Fiber Management API Calls (2)',
        `<p class="y-chinh">🎯 More differences from UNIX (the slide numbers three items "4"; they are 4, 5, 6). <strong>4:</strong> inheritance of file descriptors in UNIX is a property of the <em>descriptor</em>; in Windows it is also a property of the <em>handle</em> at process creation. <strong>5:</strong> new processes are passed information about the primary <em>window</em> directly in Win32; in UNIX it is passed as parameters to GUI applications. <strong>6:</strong> Windows has <strong>no SETUID bit</strong> as a property of the executable, but one process can create a process that runs as a different user (with the proper token).</p>
<p>The third point is the biggest idea. On Linux, a program file can carry the <em>setuid</em> bit: whoever runs it temporarily becomes the file's owner (that is how <code>passwd</code>, owned by root, lets you change your own password). That puts a powerful trick <em>inside a file</em>. Windows refuses to do that; instead, a process that already holds the right can start another process under another identity by giving <code>CreateProcessAsUser</code> a <strong>token</strong> (slide 60), or ask the user via <strong>UAC</strong> (User Account Control: "Run as administrator" starts a process with a different, elevated token). The power sits in the <em>caller's token</em>, not in the file.</p>
<p>Try the Linux side: three identities reading one file, then the same root, once with and once without the capability that lets it override file permissions:</p>
<div class="out"># A file has owner, group and "other" permission bits (a tiny DACL of 3 entries). root bypasses them with a capability, as an administrator holds SeBackupPrivilege<br>
$ echo hello &gt; /tmp/secret.txt; chmod 600 /tmp/secret.txt; chown 1000:1000 /tmp/secret.txt<br>
$ ls -l /tmp/secret.txt<br>
-rw------- 1 sv sv 6 Oct 26 03:22 /tmp/secret.txt<br>
$ echo "--- uid 2000 (another plain user), no capabilities:"<br>
--- uid 2000 (another plain user), no capabilities:<br>
$ setpriv --reuid=2000 --regid=2000 --clear-groups cat /tmp/secret.txt 2&gt;&amp;1 | sed 's#^cat: /tmp/#secret.txt: #; s#secret.txt: secret.txt#secret.txt#'<br>
secret.txt: Permission denied<br>
$ echo "--- the owner, uid 1000:"; setpriv --reuid=1000 --regid=1000 --clear-groups cat /tmp/secret.txt<br>
--- the owner, uid 1000:<br>
hello<br>
$ echo "--- root:"<br>
--- root:<br>
$ cat /tmp/secret.txt<br>
hello<br>
$ echo "--- root, but with the capability CAP_DAC_OVERRIDE removed:"<br>
--- root, but with the capability CAP_DAC_OVERRIDE removed:<br>
$ setpriv --bounding-set=-dac_override --inh-caps=-dac_override cat /tmp/secret.txt 2&gt;&amp;1 | head -2<br>
cat: /tmp/secret.txt: Permission denied</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Reading it: the file belongs to uid 1000 with mode <code>-rw-------</code> (only the owner may read). Another user (uid 2000) gets <em>Permission denied</em>; the owner reads it; <strong>root reads it too</strong> — not because root owns it, but because root's process holds the capability <code>CAP_DAC_OVERRIDE</code>; remove that one capability (<code>setpriv --bounding-set=-dac_override</code>) and even root is refused. This is Linux's version of a Windows <em>privilege</em> such as <code>SeBackupPrivilege</code> (read any file to make a backup): rights granted to an <em>identity</em>, not hidden in a file. The setuid bit exists on Linux (see <code>ls -l /usr/bin/passwd</code>) and is a classic privilege-escalation target for attackers; Windows's design avoids that class of bug.</p>
<p>Point 4 is the handle inheritance demonstrated in slide 18 (<code>O_CLOEXEC</code> ↔ <code>bInheritHandle = FALSE</code>): <em>who can use which open file</em> is decided at the moment of process creation. Point 5 is a GUI detail (the child's first window should appear as the parent asked — maximised, minimised, hidden: <code>STARTUPINFO.wShowWindow</code>) with no UNIX analogue because UNIX processes do not own windows; X11/Wayland clients simply open one.</p>
<p class="pitfall">⚠️ "Windows has no way to run a program as another user" is false: it has <code>runas</code>, services running as <code>LocalSystem</code>/<code>NetworkService</code>, scheduled tasks with stored credentials, and <code>CreateProcessAsUser</code>. What it lacks is the <em>setuid bit on the file</em>.</p>`,
        `<p class="y-chinh">🎯 Thêm các khác biệt với UNIX (slide đánh ba mục là "4"; chúng là 4, 5, 6). <strong>4:</strong> thừa kế file descriptor ở UNIX là thuộc tính của <em>descriptor</em>; ở Windows còn là thuộc tính của <em>handle</em> lúc tạo tiến trình. <strong>5:</strong> tiến trình mới được truyền thông tin về <em>cửa sổ</em> chính trực tiếp trong Win32; ở UNIX nó truyền như tham số cho ứng dụng GUI. <strong>6:</strong> Windows <strong>không có bit SETUID</strong> như thuộc tính của tệp thực thi, nhưng một tiến trình có thể tạo tiến trình chạy dưới người dùng khác (với token đúng).</p>
<p>Điểm thứ ba là ý lớn nhất. Trên Linux, một tệp chương trình có thể mang bit <em>setuid</em>: ai chạy nó tạm thời thành chủ tệp (cách <code>passwd</code>, thuộc root, cho bạn đổi mật khẩu của chính mình). Điều đó đặt một mẹo quyền lực <em>bên trong một tệp</em>. Windows từ chối làm vậy; thay vào đó, một tiến trình đã có quyền thích hợp có thể khởi động tiến trình khác dưới danh tính khác bằng cách đưa cho <code>CreateProcessAsUser</code> một <strong>token</strong> (slide 60), hoặc hỏi người dùng qua <strong>UAC</strong> (User Account Control: "Run as administrator" khởi động tiến trình với một token khác, nâng quyền). Quyền lực nằm ở <em>token của bên gọi</em>, không ở tệp.</p>
<p>Thử phía Linux: ba danh tính cùng đọc một tệp, rồi cùng root, một lần có và một lần không có capability cho phép nó vượt quyền tệp:</p>
<div class="out"># Tệp có bit quyền cho chủ, nhóm, "người khác" (DACL nhỏ 3 mục). root vượt qua bằng một capability, như quản trị viên giữ SeBackupPrivilege<br>
$ echo hello &gt; /tmp/secret.txt; chmod 600 /tmp/secret.txt; chown 1000:1000 /tmp/secret.txt<br>
$ ls -l /tmp/secret.txt<br>
-rw------- 1 sv sv 6 Oct 26 03:22 /tmp/secret.txt<br>
$ echo "--- uid 2000 (another plain user), no capabilities:"<br>
--- uid 2000 (another plain user), no capabilities:<br>
$ setpriv --reuid=2000 --regid=2000 --clear-groups cat /tmp/secret.txt 2&gt;&amp;1 | sed 's#^cat: /tmp/#secret.txt: #; s#secret.txt: secret.txt#secret.txt#'<br>
secret.txt: Permission denied<br>
$ echo "--- the owner, uid 1000:"; setpriv --reuid=1000 --regid=1000 --clear-groups cat /tmp/secret.txt<br>
--- the owner, uid 1000:<br>
hello<br>
$ echo "--- root:"<br>
--- root:<br>
$ cat /tmp/secret.txt<br>
hello<br>
$ echo "--- root, but with the capability CAP_DAC_OVERRIDE removed:"<br>
--- root, but with the capability CAP_DAC_OVERRIDE removed:<br>
$ setpriv --bounding-set=-dac_override --inh-caps=-dac_override cat /tmp/secret.txt 2&gt;&amp;1 | head -2<br>
cat: /tmp/secret.txt: Permission denied</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc: tệp thuộc uid 1000 với mode <code>-rw-------</code> (chỉ chủ được đọc). Người dùng khác (uid 2000) nhận <em>Permission denied</em>; chủ đọc được; <strong>root cũng đọc được</strong> — không phải vì root sở hữu nó, mà vì tiến trình root giữ capability <code>CAP_DAC_OVERRIDE</code>; bỏ đúng một capability đó (<code>setpriv --bounding-set=-dac_override</code>) thì ngay cả root cũng bị từ chối. Đây là phiên bản Linux của <em>đặc quyền (privilege)</em> Windows như <code>SeBackupPrivilege</code> (đọc mọi tệp để sao lưu): quyền cấp cho một <em>danh tính</em>, không giấu trong tệp. Bit setuid tồn tại trên Linux (xem <code>ls -l /usr/bin/passwd</code>) và là mục tiêu leo thang đặc quyền kinh điển của kẻ tấn công; thiết kế của Windows tránh loại lỗi đó.</p>
<p>Điểm 4 là thừa kế handle đã minh hoạ ở slide 18 (<code>O_CLOEXEC</code> ↔ <code>bInheritHandle = FALSE</code>): <em>ai dùng được tệp mở nào</em> được quyết định ngay lúc tạo tiến trình. Điểm 5 là chi tiết GUI (cửa sổ đầu tiên của tiến trình con nên hiện như cha yêu cầu — phóng to, thu nhỏ, ẩn: <code>STARTUPINFO.wShowWindow</code>) không có tương đương UNIX vì tiến trình UNIX không sở hữu cửa sổ; client X11/Wayland chỉ việc mở một cái.</p>
<p class="pitfall">⚠️ "Windows không có cách chạy chương trình dưới người dùng khác" là sai: có <code>runas</code>, dịch vụ chạy dưới <code>LocalSystem</code>/<code>NetworkService</code>, tác vụ định kỳ với thông tin đăng nhập đã lưu, và <code>CreateProcessAsUser</code>. Cái nó thiếu là <em>bit setuid trên tệp</em>.</p>`],
      [33, 'Job, Process, Thread, and Fiber Management API Calls (3)',
        `<p class="y-chinh">🎯 Last difference (item 7): the <strong>process and thread handles</strong> returned by Windows when it creates a process can be used <em>at any time</em> to modify the new process or thread in many ways; UNIX makes modifications to a new process <strong>only between <code>fork</code> and <code>exec</code></strong>, and only in limited ways. So <code>CreateProcess</code> gives you a <em>remote control</em> for the child; <code>fork</code> gives you a <em>clone</em> that you can adjust before it becomes another program.</p>
<p>Think of two ways to open a new shop. UNIX: first you <em>copy your existing shop</em> (fork — same staff, same keys), then in the empty copy you change things (close drawers you do not want to share, change the sign — the window between fork and exec) and finally hang a new name over it (exec). Windows: you fill in a <em>form with ten fields</em> (program, command line, security, whether handles are inherited, creation flags, environment, directory, window settings…), and the office builds a brand-new shop for you and gives you a <em>key</em> (the handle) that lets you inspect it, adjust its priority, suspend it, give it to a job, wait for it, or terminate it at any later time.</p>
<p>The UNIX window between fork and exec is powerful because it runs <em>your own code in the child</em>: you can <code>dup2</code> a pipe onto standard output, <code>chdir</code>, drop privileges, set <code>rlimit</code>s, join a cgroup — exactly what shells and container runtimes do (Docker's runc does this between clone and exec). The Windows way trades that generality for a single call with explicit parameters and later control through handles (<code>SetPriorityClass(hProcess, …)</code>, <code>AssignProcessToJobObject(hJob, hProcess)</code>, <code>TerminateProcess(hProcess)</code>). Modern Linux has copied part of it: <code>posix_spawn</code> (one call, like <code>CreateProcess</code>), <code>pidfd_open</code> (a handle-like descriptor for a child) and <code>clone3</code> with flags (including <code>CLONE_INTO_CGROUP</code>, which starts the child already inside a cgroup — a one-call "create into job").</p>
<table>
<thead><tr><th>Need</th><th>Windows way</th><th>Linux way</th></tr></thead>
<tbody>
<tr><td>start the child suspended, adjust it, then run</td><td><code>CreateProcess(..., CREATE_SUSPENDED)</code> then <code>ResumeThread</code></td><td><code>fork</code>, adjust in the child, <code>exec</code></td></tr>
<tr><td>give the child a pipe as stdout</td><td><code>STARTUPINFO.hStdOutput</code> + inherit handles</td><td><code>pipe</code>, <code>dup2</code> in the child</td></tr>
<tr><td>put the child in a resource group</td><td><code>AssignProcessToJobObject</code></td><td>write PID to <code>cgroup.procs</code>, or <code>CLONE_INTO_CGROUP</code></td></tr>
<tr><td>wait for the child</td><td><code>WaitForSingleObject(hProcess)</code></td><td><code>waitpid</code>, or wait on a <code>pidfd</code> in epoll</td></tr>
<tr><td>kill the child</td><td><code>TerminateProcess(hProcess, code)</code></td><td><code>kill(pid, SIGKILL)</code>, <code>pidfd_send_signal</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 One sentence to remember for the exam: <strong>"Windows modifies the new process through handles at any time; UNIX only between fork and exec."</strong> It is the answer to "what is the difference in how the new process is configured".</p>
<div class="callout">🧭 <strong>On a real server:</strong> when a Windows service must stop a misbehaving child and everything the child started, the standard answer is a <strong>job object with KILL_ON_JOB_CLOSE</strong> (the process tree dies with the supervisor — the cousin of Docker's "stop the container, all processes die" via cgroup). On Linux, kill the <em>process group</em> or the cgroup (<code>cgroup.kill</code>, slide 28), not just the PID.</div>`,
        `<p class="y-chinh">🎯 Khác biệt cuối (mục 7): <strong>handle tiến trình và luồng</strong> mà Windows trả về khi tạo tiến trình có thể dùng <em>bất kỳ lúc nào</em> để sửa tiến trình hay luồng mới theo nhiều cách; UNIX chỉ sửa tiến trình mới <strong>giữa <code>fork</code> và <code>exec</code></strong>, và chỉ theo vài cách hạn chế. Nên <code>CreateProcess</code> cho bạn một <em>điều khiển từ xa</em> cho tiến trình con; <code>fork</code> cho bạn một <em>bản nhân bản</em> mà bạn chỉnh được trước khi nó thành chương trình khác.</p>
<p>Hình dung hai cách mở cửa hàng mới. UNIX: trước hết bạn <em>sao chép cửa hàng hiện có</em> (fork — cùng nhân viên, cùng chìa khoá), rồi trong bản sao trống bạn đổi vài thứ (đóng ngăn kéo không muốn chia sẻ, đổi biển — khoảng giữa fork và exec) và cuối cùng treo tên mới lên (exec). Windows: bạn điền một <em>phiếu mười ô</em> (chương trình, dòng lệnh, bảo mật, có thừa kế handle không, cờ tạo, môi trường, thư mục, cài đặt cửa sổ…), và văn phòng dựng cho bạn một cửa hàng hoàn toàn mới và đưa bạn một <em>chìa khoá</em> (handle) cho phép kiểm tra nó, chỉnh độ ưu tiên, tạm dừng, đưa vào một job, chờ nó, hay kết thúc nó bất kỳ lúc nào sau đó.</p>
<p>Khoảng giữa fork và exec của UNIX mạnh vì nó chạy <em>mã của chính bạn trong tiến trình con</em>: bạn <code>dup2</code> một pipe vào đầu ra chuẩn, <code>chdir</code>, hạ đặc quyền, đặt <code>rlimit</code>, vào một cgroup — đúng việc shell và runtime container làm (runc của Docker làm điều này giữa clone và exec). Cách của Windows đổi tính tổng quát đó lấy một lời gọi với tham số tường minh và điều khiển sau này qua handle (<code>SetPriorityClass(hProcess, …)</code>, <code>AssignProcessToJobObject(hJob, hProcess)</code>, <code>TerminateProcess(hProcess)</code>). Linux hiện đại đã sao chép một phần: <code>posix_spawn</code> (một lời gọi, như <code>CreateProcess</code>), <code>pidfd_open</code> (descriptor giống handle cho tiến trình con) và <code>clone3</code> với cờ (gồm <code>CLONE_INTO_CGROUP</code>, khởi động tiến trình con đã nằm trong cgroup — "tạo vào job" một lời gọi).</p>
<table>
<thead><tr><th>Nhu cầu</th><th>Cách Windows</th><th>Cách Linux</th></tr></thead>
<tbody>
<tr><td>khởi động con ở trạng thái tạm dừng, chỉnh, rồi chạy</td><td><code>CreateProcess(..., CREATE_SUSPENDED)</code> rồi <code>ResumeThread</code></td><td><code>fork</code>, chỉnh trong con, <code>exec</code></td></tr>
<tr><td>cho con một pipe làm stdout</td><td><code>STARTUPINFO.hStdOutput</code> + thừa kế handle</td><td><code>pipe</code>, <code>dup2</code> trong con</td></tr>
<tr><td>cho con vào nhóm tài nguyên</td><td><code>AssignProcessToJobObject</code></td><td>ghi PID vào <code>cgroup.procs</code>, hay <code>CLONE_INTO_CGROUP</code></td></tr>
<tr><td>chờ con</td><td><code>WaitForSingleObject(hProcess)</code></td><td><code>waitpid</code>, hay chờ một <code>pidfd</code> trong epoll</td></tr>
<tr><td>giết con</td><td><code>TerminateProcess(hProcess, code)</code></td><td><code>kill(pid, SIGKILL)</code>, <code>pidfd_send_signal</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Một câu cần nhớ cho kỳ thi: <strong>"Windows sửa tiến trình mới qua handle bất kỳ lúc nào; UNIX chỉ giữa fork và exec."</strong> Đó là đáp án cho "khác biệt trong cách cấu hình tiến trình mới là gì".</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> khi một dịch vụ Windows phải dừng một tiến trình con hỏng và mọi thứ nó đã khởi động, câu trả lời chuẩn là một <strong>job object với KILL_ON_JOB_CLOSE</strong> (cả cây tiến trình chết cùng bộ giám sát — họ hàng của "dừng container, mọi tiến trình chết" của Docker qua cgroup). Trên Linux, hãy giết <em>nhóm tiến trình</em> hay cgroup (<code>cgroup.kill</code>, slide 28), không chỉ PID.</div>`],
      [34, 'Implementation of Processes and Threads (1)',
        `<p class="y-chinh">🎯 Figure 11-24 (first part): the principal <strong>Win32 calls for processes, threads and fibers</strong> — <code>CreateProcess</code> (create a new process), <code>CreateThread</code> (create a new thread in an existing process), <code>CreateFiber</code> (create a new fiber), <code>ExitProcess</code> (terminate the current process and all its threads), <code>ExitThread</code>, <code>ExitFiber</code>, <code>SwitchToFiber</code> (run a different fiber on the current thread), <code>SetPriorityClass</code> (set the priority class of a process), <code>SetThreadPriority</code>, <code>CreateSemaphore</code>, <code>CreateMutex</code>, <code>OpenSemaphore</code>, <code>OpenMutex</code> — the table continues on the next slide (it is cut at the slide edge).</p>
<p>Group the list by <em>what object it touches</em>: process (<code>CreateProcess</code>, <code>ExitProcess</code>, <code>SetPriorityClass</code>), thread (<code>CreateThread</code>, <code>ExitThread</code>, <code>SetThreadPriority</code>), fiber (the three Fiber calls) and synchronization objects (<code>Create…/Open…</code> pairs). The <em>Create/Open</em> pair is the name-space idea of slide 20: <code>CreateMutex("Global\\\\Lock")</code> creates or opens, and <code>OpenMutex("Global\\\\Lock")</code> only opens an <em>existing</em> object by name.</p>
<p><strong>What <code>CreateProcess</code> does inside</strong> (summarised from the book's section on process implementation; Windows Internals gives every step): the library <em>opens the program file</em> and creates a <strong>section</strong> object that maps it; asks the kernel to create the <strong>process object</strong> (address space, handle table, a token copied from the parent); creates the <strong>initial thread</strong> with its stack; tells the <strong>subsystem process</strong> (csrss) about the new process; and finally lets the thread start — it begins in ntdll, which loads the needed DLLs, then jumps to the program's entry point. That is why a Windows process starts "heavier" than a forked Linux process: it is built from scratch, whereas <code>fork</code> clones page tables with copy-on-write (see <code>phan-loai-loi-trang.c</code>, slide 44) and <code>exec</code> maps the new image.</p>
<p><strong>Exit calls</strong> teach a safety point: <code>ExitProcess</code> ends <em>all threads</em> of the process; <code>ExitThread</code> ends one; and per Microsoft, if a fiber function returns, "the thread running the fiber exits" — a common beginner bug. In Linux <code>exit()</code>/<code>_exit()</code> ends the whole process (all threads), <code>pthread_exit()</code> one thread; returning from <code>main</code> ends the process even if other threads still run.</p>
<p class="meo">🧠 Memory hook: <strong>C-E-S-P</strong> — Create, Exit, Switch, Priority. For each of process / thread / fiber there is a Create and an Exit; priority is set on process (class) and thread (level) — slide 37 explains how the two combine.</p>`,
        `<p class="y-chinh">🎯 Hình 11-24 (phần đầu): các <strong>lời gọi Win32 chính cho tiến trình, luồng và fiber</strong> — <code>CreateProcess</code> (tạo tiến trình mới), <code>CreateThread</code> (tạo luồng mới trong tiến trình có sẵn), <code>CreateFiber</code> (tạo fiber mới), <code>ExitProcess</code> (kết thúc tiến trình hiện tại và mọi luồng của nó), <code>ExitThread</code>, <code>ExitFiber</code>, <code>SwitchToFiber</code> (chạy fiber khác trên luồng hiện tại), <code>SetPriorityClass</code> (đặt lớp ưu tiên của tiến trình), <code>SetThreadPriority</code>, <code>CreateSemaphore</code>, <code>CreateMutex</code>, <code>OpenSemaphore</code>, <code>OpenMutex</code> — bảng tiếp ở slide sau (bị cắt ở mép slide).</p>
<p>Gom danh sách theo <em>đối tượng nó chạm</em>: tiến trình (<code>CreateProcess</code>, <code>ExitProcess</code>, <code>SetPriorityClass</code>), luồng (<code>CreateThread</code>, <code>ExitThread</code>, <code>SetThreadPriority</code>), fiber (ba lời gọi Fiber) và đối tượng đồng bộ (các cặp <code>Create…/Open…</code>). Cặp <em>Create/Open</em> là ý tưởng không gian tên của slide 20: <code>CreateMutex("Global\\\\Lock")</code> tạo hoặc mở, còn <code>OpenMutex("Global\\\\Lock")</code> chỉ mở một đối tượng <em>đã có</em> theo tên.</p>
<p><strong>Bên trong <code>CreateProcess</code> làm gì</strong> (tóm từ mục cài đặt tiến trình của sách; Windows Internals nêu từng bước): thư viện <em>mở tệp chương trình</em> và tạo một đối tượng <strong>section</strong> ánh xạ nó; nhờ nhân tạo <strong>đối tượng tiến trình</strong> (không gian địa chỉ, bảng handle, token sao từ cha); tạo <strong>luồng khởi đầu</strong> cùng stack; báo cho <strong>tiến trình hệ thống con</strong> (csrss) về tiến trình mới; và cuối cùng cho luồng chạy — nó bắt đầu trong ntdll, nạp các DLL cần thiết, rồi nhảy tới điểm vào của chương trình. Vì vậy tiến trình Windows khởi động "nặng" hơn tiến trình Linux fork: nó được dựng từ đầu, còn <code>fork</code> sao bảng trang bằng copy-on-write (xem <code>phan-loai-loi-trang.c</code>, slide 44) và <code>exec</code> ánh xạ ảnh mới.</p>
<p><strong>Các lời gọi thoát</strong> dạy một điểm an toàn: <code>ExitProcess</code> kết thúc <em>mọi luồng</em> của tiến trình; <code>ExitThread</code> kết thúc một; và theo Microsoft, nếu hàm fiber return thì "luồng đang chạy fiber thoát" — lỗi người mới hay gặp. Trong Linux <code>exit()</code>/<code>_exit()</code> kết thúc cả tiến trình (mọi luồng), <code>pthread_exit()</code> một luồng; return khỏi <code>main</code> kết thúc tiến trình dù luồng khác còn chạy.</p>
<p class="meo">🧠 Mẹo nhớ: <strong>C-E-S-P</strong> — Create, Exit, Switch, Priority. Với mỗi tiến trình / luồng / fiber có một Create và một Exit; độ ưu tiên đặt trên tiến trình (lớp) và luồng (mức) — slide 37 giải thích hai cái kết hợp thế nào.</p>`],
      [35, 'Implementation of Processes and Threads (2)',
        `<p class="y-chinh">🎯 Figure 11-24 (the rest): <strong>synchronization calls</strong> — <code>WaitForSingleObject</code> (block on a single semaphore, mutex, etc.), <code>WaitForMultipleObjects</code> (block until any/all of a set of handles is signaled), <code>PulseEvent</code> (set an event to signaled then to non-signaled), <code>ReleaseMutex</code>, <code>ReleaseSemaphore</code> (increase the count by 1), <code>EnterCriticalSection</code> / <code>LeaveCriticalSection</code> (acquire / release the lock of a critical section), <code>WaitOnAddress</code> (block until the memory at an address changes), <code>WakeByAddressSingle</code> (wake the first thread waiting on this address), <code>WakeByAddressAll</code>, and <code>InitOnceExecuteOnce</code> (ensure an initialization routine runs only once).</p>
<p>A Windows <strong>critical section</strong> is not a kernel object: it is a structure in your own memory that is acquired with an atomic instruction in user mode (<em>fast path</em>, no system call) and only falls back to a kernel wait when there is contention. That is why it is much cheaper than a mutex object for threads of <em>one process</em>. The mutex <em>object</em> can be named and shared across processes but costs a system call per operation. <strong>WaitOnAddress</strong> (Windows 8, the version of this deck) is the Windows version of the idea "sleep until this memory word changes" — the primitive on which fast locks are built.</p>
<p>Linux has the same building block, older and famous: <strong>futex</strong> ("fast user-space mutex", <code>futex(2)</code>): the program first checks and changes a memory word with atomic instructions; only if it must wait does it call <code>futex(FUTEX_WAIT)</code>, which sleeps <em>only if the word still has the expected value</em>, and the other side calls <code>FUTEX_WAKE</code>. <code>pthread_mutex_lock</code>, <code>sem_wait</code> and Java's <code>LockSupport.park</code> are all futex users. Run the cousin of <code>WaitOnAddress</code>/<code>WakeByAddressSingle</code>:</p>
<pre><code class="language-c">// Windows WaitOnAddress / WakeByAddressSingle  &lt;-&gt;  Linux futex(2): sleep in the kernel until a memory word changes
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;
#include &lt;linux/futex.h&gt;
#include &lt;sys/syscall.h&gt;

static atomic_int word = 0;                 // the shared memory word both sides look at
static atomic_int a_calls = 0;

static long futex(atomic_int *addr, int op, int val) { return syscall(SYS_futex, addr, op, val, NULL, NULL, 0); }

static void *waiter(void *arg) {            // like: WaitOnAddress(&amp;word, &amp;undesired, 4, INFINITE)
    while (atomic_load(&amp;word) == 0) {       // user-mode check first: no system call if the value is already right
        atomic_fetch_add(&amp;a_calls, 1);
        futex(&amp;word, FUTEX_WAIT, 0);        // sleep ONLY IF word is still 0 (atomic check inside the kernel)
    }
    printf("A: woken by thread B: value is now %d\\n", atomic_load(&amp;word));
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_create(&amp;a, NULL, waiter, NULL);
    usleep(200000);                         // let A go to sleep
    atomic_store(&amp;word, 42);
    futex(&amp;word, FUTEX_WAKE, 1);            // like: WakeByAddressSingle(&amp;word)
    pthread_join(a, NULL);
    printf("futex calls issued by A: %d (a spurious wake-up would make it 2)\\n", atomic_load(&amp;a_calls));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread futex-cho-dia-chi.c -o futex-cho-dia-chi &amp;&amp; ./futex-cho-dia-chi<br>
A: woken by thread B: value is now 42<br>
futex calls issued by A: 1 (a spurious wake-up would make it 2)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Thread A checks the word (0), asks the kernel to sleep <em>while it is 0</em>; thread B stores 42 and wakes one waiter; A resumes, sees 42, and leaves its loop after exactly one <code>futex</code> call. The loop <code>while (word == 0)</code> around the wait is the standard defence against <em>spurious wake-ups</em> — Microsoft documents the same pattern for <code>WaitOnAddress</code> (re-check after waking).</p>
<p><strong>Deprecated calls to avoid:</strong> <code>PulseEvent</code> is on the slide, but Microsoft's documentation advises not to use it (it is unreliable because a thread that has just left a kernel wait for an unrelated reason can miss the pulse); use an event with explicit set/reset, a condition variable, or <code>WaitOnAddress</code>. Linux has the matching lesson: a <code>pthread_cond_signal</code> with no waiter is <em>lost</em>, which is why the predicate loop is mandatory. This is a good answer to the oral question "<em>why do threads need a predicate and not only a signal?</em>".</p>
<p class="pitfall">⚠️ <code>WaitForMultipleObjects(waitAll = TRUE)</code> waits for <em>all</em> handles; <code>FALSE</code> returns when <em>any one</em> is signaled and tells you which. Mixing them up is a favourite exam trick. And <code>ReleaseMutex</code> by a thread that does <em>not own</em> the mutex fails — unlike a binary semaphore (slide 14).</p>`,
        `<p class="y-chinh">🎯 Hình 11-24 (phần còn lại): các <strong>lời gọi đồng bộ</strong> — <code>WaitForSingleObject</code> (chặn trên một semaphore, mutex…), <code>WaitForMultipleObjects</code> (chặn tới khi bất kỳ/tất cả một tập handle được signaled), <code>PulseEvent</code> (đặt event thành signaled rồi non-signaled), <code>ReleaseMutex</code>, <code>ReleaseSemaphore</code> (tăng bộ đếm 1), <code>EnterCriticalSection</code> / <code>LeaveCriticalSection</code> (lấy / nhả khoá của vùng găng), <code>WaitOnAddress</code> (chặn tới khi bộ nhớ ở một địa chỉ thay đổi), <code>WakeByAddressSingle</code> (đánh thức luồng đầu tiên đang chờ địa chỉ này), <code>WakeByAddressAll</code>, và <code>InitOnceExecuteOnce</code> (bảo đảm thủ tục khởi tạo chỉ chạy một lần).</p>
<p><strong>Critical section</strong> của Windows không phải đối tượng nhân: nó là cấu trúc trong bộ nhớ của chính bạn, được lấy bằng lệnh nguyên tử ở chế độ người dùng (<em>đường nhanh</em>, không lời gọi hệ thống) và chỉ rơi xuống chờ trong nhân khi có tranh chấp. Vì vậy nó rẻ hơn nhiều so với đối tượng mutex cho các luồng của <em>một tiến trình</em>. <em>Đối tượng</em> mutex có thể đặt tên và chia sẻ giữa các tiến trình nhưng tốn một lời gọi hệ thống cho mỗi thao tác. <strong>WaitOnAddress</strong> (Windows 8, phiên bản của bộ slide này) là phiên bản Windows của ý "ngủ tới khi từ nhớ này đổi" — nguyên liệu để dựng các khoá nhanh.</p>
<p>Linux có cùng viên gạch, cũ hơn và nổi tiếng: <strong>futex</strong> ("fast user-space mutex", <code>futex(2)</code>): chương trình trước hết kiểm và đổi một từ nhớ bằng lệnh nguyên tử; chỉ khi phải chờ mới gọi <code>futex(FUTEX_WAIT)</code>, ngủ <em>chỉ khi từ đó còn giá trị mong đợi</em>, và bên kia gọi <code>FUTEX_WAKE</code>. <code>pthread_mutex_lock</code>, <code>sem_wait</code> và <code>LockSupport.park</code> của Java đều dùng futex. Chạy họ hàng của <code>WaitOnAddress</code>/<code>WakeByAddressSingle</code>:</p>
<pre><code class="language-c">// WaitOnAddress / WakeByAddressSingle của Windows &lt;-&gt; futex(2) của Linux: ngủ trong nhân cho tới khi một từ nhớ đổi
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdatomic.h&gt;
#include &lt;pthread.h&gt;
#include &lt;unistd.h&gt;
#include &lt;linux/futex.h&gt;
#include &lt;sys/syscall.h&gt;

static atomic_int word = 0;                 // từ nhớ chung hai bên cùng nhìn
static atomic_int a_calls = 0;

static long futex(atomic_int *addr, int op, int val) { return syscall(SYS_futex, addr, op, val, NULL, NULL, 0); }

static void *waiter(void *arg) {            // như: WaitOnAddress(&amp;word, &amp;giá-trị-không-muốn, 4, INFINITE)
    while (atomic_load(&amp;word) == 0) {       // kiểm tra ở chế độ người dùng trước: không lời gọi hệ thống nếu giá trị đã đúng
        atomic_fetch_add(&amp;a_calls, 1);
        futex(&amp;word, FUTEX_WAIT, 0);        // ngủ CHỈ KHI word vẫn là 0 (kiểm tra nguyên tử trong nhân)
    }
    printf("A: woken by thread B: value is now %d\\n", atomic_load(&amp;word));
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_create(&amp;a, NULL, waiter, NULL);
    usleep(200000);                         // để A đi ngủ
    atomic_store(&amp;word, 42);
    futex(&amp;word, FUTEX_WAKE, 1);            // như: WakeByAddressSingle(&amp;word)
    pthread_join(a, NULL);
    printf("futex calls issued by A: %d (a spurious wake-up would make it 2)\\n", atomic_load(&amp;a_calls));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread futex-cho-dia-chi.c -o futex-cho-dia-chi &amp;&amp; ./futex-cho-dia-chi<br>
A: woken by thread B: value is now 42<br>
futex calls issued by A: 1 (a spurious wake-up would make it 2)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Luồng A kiểm từ đó (0), xin nhân cho ngủ <em>khi nó còn là 0</em>; luồng B ghi 42 và đánh thức một luồng chờ; A tiếp tục, thấy 42, và rời vòng lặp sau đúng một lời gọi <code>futex</code>. Vòng <code>while (word == 0)</code> quanh lời gọi chờ là phòng thủ chuẩn trước <em>đánh thức giả (spurious wake-up)</em> — Microsoft ghi cùng mẫu cho <code>WaitOnAddress</code> (kiểm lại sau khi thức).</p>
<p><strong>Lời gọi lỗi thời nên tránh:</strong> <code>PulseEvent</code> có trên slide, nhưng tài liệu Microsoft khuyên không dùng (nó không đáng tin vì một luồng vừa rời lần chờ trong nhân vì lý do khác có thể lỡ xung); hãy dùng event với set/reset tường minh, biến điều kiện, hay <code>WaitOnAddress</code>. Linux có bài học tương ứng: <code>pthread_cond_signal</code> không có người chờ thì bị <em>mất</em>, nên vòng kiểm vị từ là bắt buộc. Đây là câu trả lời hay cho câu hỏi vấn đáp "<em>vì sao luồng cần vị từ chứ không chỉ tín hiệu?</em>".</p>
<p class="pitfall">⚠️ <code>WaitForMultipleObjects(waitAll = TRUE)</code> chờ <em>tất cả</em> handle; <code>FALSE</code> trả về khi <em>bất kỳ một</em> cái signaled và cho biết cái nào. Lẫn hai cái là mẹo thi ưa thích. Và <code>ReleaseMutex</code> bởi luồng <em>không sở hữu</em> mutex sẽ thất bại — khác semaphore nhị phân (slide 14).</p>`],
      [36, 'Scheduling (1)',
        `<p class="y-chinh">🎯 <strong>Conditions that invoke scheduling</strong> (the book's list): <strong>(1)</strong> a running thread blocks on a semaphore, mutex, event, I/O, etc.; <strong>(2)</strong> a thread signals an object (e.g., does an <em>up</em> on a semaphore); <strong>(3)</strong> the <em>quantum expires</em>; <strong>(4)</strong> an I/O operation completes; <strong>(5)</strong> a timed wait expires. In every case the scheduler asks the same question: <em>which ready thread has the highest priority?</em></p>
<p>Imagine a single doctor in a clinic. She re-decides who to see next when: the patient she is seeing has to go for an X-ray (1, blocks), she finishes a task that frees a nurse (2, signals), her time slot for this patient is over (3, quantum), an X-ray result comes back (4, I/O completes), or the "come back in ten minutes" patient returns (5, timed wait). Those five events are the only moments the question "who next?" is asked. Between them nothing changes, which is why a scheduler is cheap.</p>
<p>The book makes a point worth remembering: in Windows there is <strong>no central scheduler thread</strong>. When a thread can no longer run, <em>the same thread</em>, now running in kernel mode, executes the scheduling code and switches to the next thread. Linux behaves the same (<code>schedule()</code> is called by the task that is giving up the CPU, or on the way out of an interrupt) — the "scheduler" is a function, not a process. That design avoids an extra context switch.</p>
<p><strong>Quantum</strong> is the length of a time slice (Chapter 2). The Windows quantum is a small multiple of the clock-interrupt interval and can differ between client and server editions and between foreground and background; the exact values are in Windows Internals and are not in the deck or in the Win32 documentation I checked, so this lesson does not quote numbers — a good rule for the exam: <em>quantum is configurable, not a fixed constant</em>. Linux's <code>CFS/EEVDF</code> scheduler (Chapter 10) does not use fixed quanta at all but fair shares; see <code>/proc/sys/kernel/sched_*</code>.</p>
<p><strong>Preemption rule</strong> (from Microsoft's "Scheduling Priorities" page, which you will use on the next slides): "If a higher-priority thread becomes available to run, the system ceases to execute the lower-priority thread (without allowing it to finish using its time slice) and assigns a full time slice to the higher-priority thread." — events (2), (4), (5) can make a <em>higher</em> thread ready, and then the running thread is preempted immediately, not at the end of its quantum.</p>
<p class="pitfall">⚠️ Event (3), "quantum expires", is the <em>only</em> one that is about the clock; the other four are about threads becoming blocked or ready. Exam options that say "scheduling happens only when the timer interrupts" are wrong.</p>`,
        `<p class="y-chinh">🎯 <strong>Các điều kiện gọi lập lịch</strong> (danh sách của sách): <strong>(1)</strong> một luồng đang chạy bị chặn trên semaphore, mutex, event, I/O…; <strong>(2)</strong> một luồng báo hiệu một đối tượng (vd <em>up</em> trên semaphore); <strong>(3)</strong> <em>quantum hết</em>; <strong>(4)</strong> một thao tác I/O hoàn thành; <strong>(5)</strong> một lần chờ có hẹn giờ hết hạn. Trong mọi trường hợp bộ lập lịch hỏi cùng một câu: <em>luồng sẵn sàng nào có độ ưu tiên cao nhất?</em></p>
<p>Hình dung một bác sĩ duy nhất trong phòng khám. Cô quyết định lại khám ai tiếp khi: bệnh nhân đang khám phải đi chụp X-quang (1, chặn), cô xong việc giải phóng một y tá (2, báo hiệu), thời gian dành cho bệnh nhân này hết (3, quantum), kết quả X-quang về (4, I/O hoàn thành), hay bệnh nhân "quay lại sau mười phút" trở lại (5, chờ hẹn giờ). Năm sự kiện đó là những lúc duy nhất câu "ai tiếp theo?" được hỏi. Giữa chúng không có gì đổi, vì vậy bộ lập lịch rẻ.</p>
<p>Sách nêu một điểm đáng nhớ: trong Windows <strong>không có luồng lập lịch trung tâm</strong>. Khi một luồng không chạy tiếp được, <em>chính luồng đó</em>, lúc này chạy ở chế độ nhân, thực thi mã lập lịch và chuyển sang luồng kế. Linux cũng vậy (<code>schedule()</code> được gọi bởi task đang nhường CPU, hay trên đường ra khỏi ngắt) — "bộ lập lịch" là một hàm, không phải một tiến trình. Thiết kế đó tránh thêm một lần chuyển ngữ cảnh.</p>
<p><strong>Quantum</strong> là độ dài một lát thời gian (Chương 2). Quantum của Windows là bội số nhỏ của khoảng ngắt đồng hồ và có thể khác giữa bản client và server và giữa foreground và background; giá trị chính xác nằm trong Windows Internals và không có trong deck hay tài liệu Win32 tôi đã kiểm, nên bài này không trích số — quy tắc tốt cho kỳ thi: <em>quantum cấu hình được, không phải hằng số cố định</em>. Bộ lập lịch <code>CFS/EEVDF</code> của Linux (Chương 10) hoàn toàn không dùng quantum cố định mà dùng phần chia công bằng; xem <code>/proc/sys/kernel/sched_*</code>.</p>
<p><strong>Quy tắc chiếm quyền</strong> (từ trang "Scheduling Priorities" của Microsoft, bạn sẽ dùng ở các slide sau): "Nếu một luồng ưu tiên cao hơn trở nên sẵn sàng chạy, hệ thống ngừng thực thi luồng ưu tiên thấp (không cho nó dùng hết lát thời gian) và cấp một lát thời gian đầy đủ cho luồng ưu tiên cao hơn." — các sự kiện (2), (4), (5) có thể làm một luồng <em>cao hơn</em> sẵn sàng, và khi đó luồng đang chạy bị chiếm quyền ngay, không đợi hết quantum.</p>
<p class="pitfall">⚠️ Sự kiện (3), "quantum hết", là sự kiện <em>duy nhất</em> liên quan đồng hồ; bốn cái còn lại là về việc luồng bị chặn hay sẵn sàng. Phương án thi nói "lập lịch chỉ xảy ra khi ngắt đồng hồ" là sai.</p>`],
      [37, 'Scheduling (2)',
        `<p class="y-chinh">🎯 Figure 11-25 maps <strong>Win32 priorities to Windows (kernel) priorities</strong>. A thread's priority is decided by <em>two</em> choices: the <strong>priority class of its process</strong> (Real-time, High, Above normal, Normal, Below normal, Idle) and the <strong>priority level of the thread inside that class</strong> (Time critical, Highest, Above normal, Normal, Below normal, Lowest, Idle). Together they give a <strong>base priority</strong> from 1 to 31 (0 is reserved for the zero-page thread).</p>
<p>It is like a multiplication table you read with two fingers: put one finger on the <em>column</em> for the process's class, another on the <em>row</em> for the thread's level; the number at the crossing is the priority. A normal desktop program is in the <strong>Normal</strong> class and its threads are at <strong>Normal</strong> level, so base priority <strong>8</strong>. The input thread of a GUI app often sits one or two steps higher (above normal / highest → 9 or 10) so the interface feels responsive; a background indexer lowers itself (below normal / lowest → 7 or 6).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d853cccc6f0423da29c5f99ee9090c9356163afe.svg" alt="Figure 11-25 computed: Normal class + Highest thread = base priority 10 (the highlighted cell)" loading="lazy" /><p class="chu-thich">🧮 Figure 11-25 computed: Normal class + Highest thread = base priority 10 (the highlighted cell)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const LOP = [['idle', 'Idle', 4], ['below', 'Below normal', 6], ['normal', 'Normal', 8], ['above', 'Above normal', 10], ['high', 'High', 13], ['real', 'Real-time', 24]];
export const MUC = [['timecritical', 'Time critical'], ['highest', 'Highest'], ['abovenormal', 'Above normal'], ['normal', 'Normal'], ['belownormal', 'Below normal'], ['lowest', 'Lowest'], ['idle', 'Idle']];
const LECH = { highest: 2, abovenormal: 1, normal: 0, belownormal: -1, lowest: -2 };
export function goc(lop, muc) {
  const real = lop === 'real';
  if (muc === 'idle') return real ? 16 : 1;
  if (muc === 'timecritical') return real ? 31 : 15;
  return LOP.find((l) =&gt; l[0] === lop)[2] + LECH[muc];
}</code></pre></details>
<p>The simulator does not copy the figure; it <em>computes</em> every cell from a rule: base of the class (Idle 4, Below normal 6, Normal 8, Above normal 10, High 13, Real-time 24) plus an offset (Highest +2, Above normal +1, Normal 0, Below normal −1, Lowest −2); "Idle" level is always <strong>1</strong> (16 for the Real-time class) and "Time critical" always <strong>15</strong> (31 for Real-time). The result matches both the book's table and Microsoft's "Base Priority" table in "Scheduling Priorities" (all 42 cells agreed when I compared them). Two things to notice in the picture: (a) the pink column — the Real-time class lives at 16–31, <strong>all above</strong> every other class; (b) the High class's <em>Highest</em> and <em>Time critical</em> are both 15.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/f42c6723c5bd6592bd0f4c917d25ced58b86eabe.svg" alt="The whole table as computed by the simulator" loading="lazy" /><p class="chu-thich">🧮 The whole table as computed by the simulator</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const LOP = [['idle', 'Idle', 4], ['below', 'Below normal', 6], ['normal', 'Normal', 8], ['above', 'Above normal', 10], ['high', 'High', 13], ['real', 'Real-time', 24]];
export const MUC = [['timecritical', 'Time critical'], ['highest', 'Highest'], ['abovenormal', 'Above normal'], ['normal', 'Normal'], ['belownormal', 'Below normal'], ['lowest', 'Lowest'], ['idle', 'Idle']];
const LECH = { highest: 2, abovenormal: 1, normal: 0, belownormal: -1, lowest: -2 };
export function goc(lop, muc) {
  const real = lop === 'real';
  if (muc === 'idle') return real ? 16 : 1;
  if (muc === 'timecritical') return real ? 31 : 15;
  return LOP.find((l) =&gt; l[0] === lop)[2] + LECH[muc];
}</code></pre></details>
<p><strong>Why two numbers?</strong> The class gives the system an easy way to rank <em>programs</em> (a user marks a game "High", a virus scanner "Below normal"), the level lets one program rank its own <em>threads</em>. Microsoft's advice on the same page: use the High class "with care" — "if a thread runs at the highest priority level for extended periods, other threads in the system will not get processor time" — and "you should almost never use REALTIME_PRIORITY_CLASS, because this interrupts system threads that manage mouse input, keyboard input, and background disk flushing."</p>
<p><strong>Exam skill:</strong> given "a process in the <em>Above normal</em> class creates a thread at <em>Lowest</em>", the answer is <strong>8</strong> (row Lowest, column Above normal). Compute it with the rule or read the table; check the simulator (<code>uu-tien-bang.mjs#above-lowest</code> gives 8).</p>
<p class="pitfall">⚠️ "Priority 15 is higher than priority 16" is a classic slip: <em>bigger number = more urgent</em> in Windows (0–31), the <strong>opposite</strong> of Linux's <code>nice</code> (−20 is most urgent, +19 least). Linux's real-time policies use 1–99 with bigger = more urgent, like Windows; slide 38 compares them.</p>`,
        `<p class="y-chinh">🎯 Hình 11-25 ánh xạ <strong>ưu tiên Win32 sang ưu tiên Windows (nhân)</strong>. Độ ưu tiên của một luồng được quyết định bởi <em>hai</em> lựa chọn: <strong>lớp ưu tiên của tiến trình</strong> (Real-time, High, Above normal, Normal, Below normal, Idle) và <strong>mức ưu tiên của luồng trong lớp đó</strong> (Time critical, Highest, Above normal, Normal, Below normal, Lowest, Idle). Cùng nhau chúng cho <strong>độ ưu tiên gốc</strong> từ 1 đến 31 (0 dành riêng cho luồng zero-page).</p>
<p>Giống bảng cửu chương đọc bằng hai ngón tay: đặt một ngón lên <em>cột</em> của lớp tiến trình, ngón kia lên <em>hàng</em> của mức luồng; số ở chỗ giao là độ ưu tiên. Chương trình desktop bình thường thuộc lớp <strong>Normal</strong> và luồng của nó ở mức <strong>Normal</strong>, nên độ ưu tiên gốc <strong>8</strong>. Luồng nhập liệu của ứng dụng GUI thường đặt cao hơn một hai bậc (above normal / highest → 9 hay 10) để giao diện cảm giác nhạy; trình lập chỉ mục nền tự hạ thấp (below normal / lowest → 7 hay 6).</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3075715581e46be33206e7fa3c9f076994fc6210.svg" alt="Hình 11-25 được tính ra: lớp Normal + luồng Highest = độ ưu tiên gốc 10 (ô được tô sáng)" loading="lazy" /><p class="chu-thich">🧮 Hình 11-25 được tính ra: lớp Normal + luồng Highest = độ ưu tiên gốc 10 (ô được tô sáng)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const LOP = [['idle', 'Idle', 4], ['below', 'Below normal', 6], ['normal', 'Normal', 8], ['above', 'Above normal', 10], ['high', 'High', 13], ['real', 'Real-time', 24]];
export const MUC = [['timecritical', 'Time critical'], ['highest', 'Highest'], ['abovenormal', 'Above normal'], ['normal', 'Normal'], ['belownormal', 'Below normal'], ['lowest', 'Lowest'], ['idle', 'Idle']];
const LECH = { highest: 2, abovenormal: 1, normal: 0, belownormal: -1, lowest: -2 };
export function goc(lop, muc) {
  const real = lop === 'real';
  if (muc === 'idle') return real ? 16 : 1;
  if (muc === 'timecritical') return real ? 31 : 15;
  return LOP.find((l) =&gt; l[0] === lop)[2] + LECH[muc];
}</code></pre></details>
<p>Bộ mô phỏng không chép hình; nó <em>tính</em> từng ô từ một quy tắc: gốc của lớp (Idle 4, Below normal 6, Normal 8, Above normal 10, High 13, Real-time 24) cộng độ lệch (Highest +2, Above normal +1, Normal 0, Below normal −1, Lowest −2); mức "Idle" luôn là <strong>1</strong> (16 với lớp Real-time) và "Time critical" luôn <strong>15</strong> (31 với Real-time). Kết quả khớp cả bảng của sách và bảng "Base Priority" của Microsoft trong "Scheduling Priorities" (cả 42 ô đều khớp khi tôi so). Hai điều cần để ý trong hình: (a) cột hồng — lớp Real-time nằm ở 16–31, <strong>trên hết</strong> mọi lớp khác; (b) <em>Highest</em> và <em>Time critical</em> của lớp High đều là 15.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cc2de64cc88a93973e0b2023be1cc49b3220bf43.svg" alt="Toàn bộ bảng do bộ mô phỏng tính" loading="lazy" /><p class="chu-thich">🧮 Toàn bộ bảng do bộ mô phỏng tính</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const LOP = [['idle', 'Idle', 4], ['below', 'Below normal', 6], ['normal', 'Normal', 8], ['above', 'Above normal', 10], ['high', 'High', 13], ['real', 'Real-time', 24]];
export const MUC = [['timecritical', 'Time critical'], ['highest', 'Highest'], ['abovenormal', 'Above normal'], ['normal', 'Normal'], ['belownormal', 'Below normal'], ['lowest', 'Lowest'], ['idle', 'Idle']];
const LECH = { highest: 2, abovenormal: 1, normal: 0, belownormal: -1, lowest: -2 };
export function goc(lop, muc) {
  const real = lop === 'real';
  if (muc === 'idle') return real ? 16 : 1;
  if (muc === 'timecritical') return real ? 31 : 15;
  return LOP.find((l) =&gt; l[0] === lop)[2] + LECH[muc];
}</code></pre></details>
<p><strong>Vì sao hai con số?</strong> Lớp cho hệ thống cách dễ để xếp hạng <em>chương trình</em> (người dùng đánh dấu game "High", trình quét virus "Below normal"), mức cho một chương trình xếp hạng các <em>luồng</em> của chính nó. Lời khuyên của Microsoft trên cùng trang: dùng lớp High "cẩn thận" — "nếu một luồng chạy ở mức ưu tiên cao nhất trong thời gian dài, các luồng khác trong hệ thống sẽ không nhận được thời gian bộ xử lý" — và "bạn gần như không bao giờ nên dùng REALTIME_PRIORITY_CLASS, vì nó ngắt các luồng hệ thống quản lý nhập chuột, bàn phím và xả đĩa nền."</p>
<p><strong>Kỹ năng thi:</strong> cho "một tiến trình lớp <em>Above normal</em> tạo luồng ở mức <em>Lowest</em>", đáp án là <strong>8</strong> (hàng Lowest, cột Above normal). Tính bằng quy tắc hay đọc bảng; kiểm bằng bộ mô phỏng (<code>uu-tien-bang.mjs#above-lowest</code> cho 8).</p>
<p class="pitfall">⚠️ "Ưu tiên 15 cao hơn ưu tiên 16" là cú trượt kinh điển: <em>số lớn hơn = gấp hơn</em> ở Windows (0–31), <strong>ngược</strong> với <code>nice</code> của Linux (−20 gấp nhất, +19 ít nhất). Các chính sách thời gian thực của Linux dùng 1–99 với số lớn hơn = gấp hơn, như Windows; slide 38 so sánh chúng.</p>`],
      [38, 'Scheduling (3)',
        `<p class="y-chinh">🎯 Figure 11-26: <strong>Windows supports 32 priorities for threads</strong>. The right side shows a <em>ready queue per priority</em> with threads waiting in each; the scheduler runs the first thread from the <strong>highest non-empty queue</strong> ("next thread to run"). Priorities <strong>16–31</strong> are <em>system (real-time) priorities</em>, <strong>1–15</strong> are <em>user priorities</em>; priority <strong>0</strong> holds the <em>zero-page thread</em> (which zeroes free pages, slide 48), and the <em>idle thread</em> runs when nothing else can.</p>
<p>A good picture is a building with 32 floors and a queue at each floor's door. The clerk always serves the <em>top floor that has anyone waiting</em>; inside a floor the queue is first-come, first-served in turns (round-robin, one quantum each). Lower floors are served only when all higher floors are empty — which is why a thread on floor 8 never runs while a thread on floor 12 is ready and compute-bound (this is the seed of priority inversion, next slide). Windows keeps a bitmap of non-empty queues so it finds the top floor in a few instructions.</p>
<p>Microsoft's page states the same rule as: "The system treats all threads with the same priority as equal. The system assigns time slices in a round-robin fashion to all threads with the highest priority. If none of these threads are ready to run, the system assigns time slices in a round-robin fashion to all threads with the next highest priority." It adds: "Only the zero-page thread can have a priority of zero."</p>
<p>Linux uses <strong>two</strong> priority systems. Normal threads (<code>SCHED_OTHER</code>) have no static priority; fairness comes from the <em>nice</em> value (−20…+19: lower = more CPU share). <strong>Real-time</strong> threads (<code>SCHED_FIFO</code>, <code>SCHED_RR</code>) have static priority <strong>1–99</strong>; any real-time thread beats every normal thread, exactly like Windows class 16–31 beats 1–15. Run the facts:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_NICE</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Windows has priorities 0-31; Linux has TWO scales: nice (-20..19) for normal threads, and real-time 1-99<br>
$ chrt -m<br>
SCHED_OTHER min/max priority	: 0/0<br>
SCHED_FIFO min/max priority	: 1/99<br>
SCHED_RR min/max priority	: 1/99<br>
SCHED_BATCH min/max priority	: 0/0<br>
SCHED_IDLE min/max priority	: 0/0<br>
SCHED_DEADLINE min/max priority	: 0/0<br>
# Normal threads: policy SCHED_OTHER, priority shown as 0, the weight comes from nice<br>
$ echo "default nice: $(nice)"; echo "nice 10 -&gt; $(nice -n 10 nice)"<br>
default nice: 0<br>
nice 10 -&gt; 10<br>
# Real-time: FIFO or RR with priority 1-99, always beats every normal thread (like Windows class 16-31)<br>
$ chrt -f 50 sh -c 'chrt -p $$'<br>
pid 16's current scheduling policy: SCHED_FIFO<br>
pid 16's current scheduling priority: 50<br>
$ chrt -r 10 sh -c 'chrt -p $$'<br>
pid 20's current scheduling policy: SCHED_RR<br>
pid 20's current scheduling priority: 10<br>
# Each thread of a process has its own priority, like a Windows thread<br>
$ ps -o pid,cls,ni,rtprio,pri,comm -p $$<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID CLS &nbsp;NI RTPRIO PRI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;TS &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;19 bash</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The first block is <code>chrt -m</code>: the kernel says <code>SCHED_OTHER</code> has priority range 0/0 (no static priority), <code>SCHED_FIFO</code> and <code>SCHED_RR</code> have 1…99. Next, <code>nice -n 10</code> shows how a normal thread is lowered. Then <code>chrt -f 50</code> and <code>chrt -r 10</code> start a program as real-time FIFO (priority 50) and round-robin (priority 10) — needing the capability <code>CAP_SYS_NICE</code>, which we granted to this container; just as on Windows, setting the Real-time class needs a privilege (<em>SeIncreaseBasePriorityPrivilege</em>). Finally <code>ps</code> shows class <code>TS</code> (time-sharing) for a normal shell.</p>
<table>
<thead><tr><th>Idea</th><th>Windows</th><th>Linux</th></tr></thead>
<tbody>
<tr><td>number of levels</td><td>32 (0–31)</td><td>nice 40 values (−20…19) for normal; 99 real-time levels</td></tr>
<tr><td>bigger = more urgent?</td><td>yes</td><td>real-time: yes; nice: NO (lower = more urgent)</td></tr>
<tr><td>real-time band</td><td>16–31 (class Real-time)</td><td><code>SCHED_FIFO</code>/<code>SCHED_RR</code> 1–99</td></tr>
<tr><td>same level</td><td>round-robin quantum</td><td>RR: quantum; FIFO: until it blocks or yields</td></tr>
<tr><td>who may use it</td><td>privilege required for Real-time</td><td><code>CAP_SYS_NICE</code> / <code>RLIMIT_RTPRIO</code></td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Do not copy a number between the two systems: "Windows 8 ≈ Linux nice 0" is a popular but loose comparison — a Windows base priority is a <em>strict-priority</em> ranking, Linux's nice is a <em>weight</em> in a fair-share scheduler. Compare ideas, not numbers.</p>
<div class="callout">🧭 <strong>On a real server:</strong> a Windows service that does background work should set <code>THREAD_PRIORITY_BELOW_NORMAL</code> or run in a Below-normal process; in Docker on Linux use <code>--cpu-shares</code> (weight) or <code>--cpus</code> (quota) instead of changing nice. Never give a web server real-time priority: a request thread that spins can starve the whole machine, including your SSH session.</div>`,
        `<p class="y-chinh">🎯 Hình 11-26: <strong>Windows hỗ trợ 32 mức ưu tiên cho luồng</strong>. Bên phải thể hiện <em>một hàng đợi sẵn sàng cho mỗi mức ưu tiên</em> với các luồng chờ trong mỗi hàng; bộ lập lịch chạy luồng đầu tiên từ <strong>hàng đợi không rỗng cao nhất</strong> ("luồng kế để chạy"). Ưu tiên <strong>16–31</strong> là <em>ưu tiên hệ thống (thời gian thực)</em>, <strong>1–15</strong> là <em>ưu tiên người dùng</em>; ưu tiên <strong>0</strong> chứa <em>luồng zero-page</em> (xoá sạch trang trống, slide 48), và <em>luồng idle</em> chạy khi không còn gì khác.</p>
<p>Hình ảnh tốt là toà nhà 32 tầng với một hàng đợi trước cửa mỗi tầng. Nhân viên luôn phục vụ <em>tầng cao nhất có người chờ</em>; trong một tầng thì hàng đợi theo thứ tự đến trước phục vụ trước theo lượt (round-robin, mỗi người một quantum). Tầng thấp chỉ được phục vụ khi mọi tầng cao trống — vì vậy luồng ở tầng 8 không bao giờ chạy khi luồng ở tầng 12 sẵn sàng và nặng tính toán (đó là hạt giống của đảo ngược ưu tiên, slide sau). Windows giữ một bitmap các hàng đợi không rỗng nên tìm tầng cao nhất bằng vài lệnh.</p>
<p>Trang của Microsoft nêu cùng quy tắc: "Hệ thống coi mọi luồng cùng ưu tiên là bằng nhau. Hệ thống cấp lát thời gian theo kiểu round-robin cho mọi luồng có ưu tiên cao nhất. Nếu không luồng nào trong số đó sẵn sàng chạy, hệ thống cấp lát thời gian round-robin cho mọi luồng có ưu tiên cao kế tiếp." Nó thêm: "Chỉ luồng zero-page mới có thể có ưu tiên bằng không."</p>
<p>Linux dùng <strong>hai</strong> hệ ưu tiên. Luồng thường (<code>SCHED_OTHER</code>) không có ưu tiên tĩnh; sự công bằng đến từ giá trị <em>nice</em> (−20…+19: thấp hơn = nhiều phần CPU hơn). Luồng <strong>thời gian thực</strong> (<code>SCHED_FIFO</code>, <code>SCHED_RR</code>) có ưu tiên tĩnh <strong>1–99</strong>; bất kỳ luồng thời gian thực nào cũng thắng mọi luồng thường, giống lớp 16–31 của Windows thắng 1–15. Chạy sự thật:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_NICE</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Windows có độ ưu tiên 0-31; Linux có HAI thang: nice (-20..19) cho luồng thường, và thời gian thực 1-99<br>
$ chrt -m<br>
SCHED_OTHER min/max priority	: 0/0<br>
SCHED_FIFO min/max priority	: 1/99<br>
SCHED_RR min/max priority	: 1/99<br>
SCHED_BATCH min/max priority	: 0/0<br>
SCHED_IDLE min/max priority	: 0/0<br>
SCHED_DEADLINE min/max priority	: 0/0<br>
# Luồng thường: chính sách SCHED_OTHER, độ ưu tiên hiện 0, trọng số do nice quyết định<br>
$ echo "default nice: $(nice)"; echo "nice 10 -&gt; $(nice -n 10 nice)"<br>
default nice: 0<br>
nice 10 -&gt; 10<br>
# Thời gian thực: FIFO hoặc RR ưu tiên 1-99, luôn thắng mọi luồng thường (như lớp 16-31 của Windows)<br>
$ chrt -f 50 sh -c 'chrt -p $$'<br>
pid 16's current scheduling policy: SCHED_FIFO<br>
pid 16's current scheduling priority: 50<br>
$ chrt -r 10 sh -c 'chrt -p $$'<br>
pid 20's current scheduling policy: SCHED_RR<br>
pid 20's current scheduling priority: 10<br>
# Mỗi luồng của một tiến trình có độ ưu tiên riêng, như luồng Windows<br>
$ ps -o pid,cls,ni,rtprio,pri,comm -p $$<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID CLS &nbsp;NI RTPRIO PRI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;TS &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;19 bash</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Khối đầu là <code>chrt -m</code>: nhân nói <code>SCHED_OTHER</code> có dải ưu tiên 0/0 (không có ưu tiên tĩnh), <code>SCHED_FIFO</code> và <code>SCHED_RR</code> có 1…99. Tiếp theo, <code>nice -n 10</code> cho thấy một luồng thường bị hạ thế nào. Rồi <code>chrt -f 50</code> và <code>chrt -r 10</code> khởi động chương trình ở FIFO thời gian thực (ưu tiên 50) và round-robin (ưu tiên 10) — cần capability <code>CAP_SYS_NICE</code>, mà ta cấp cho container này; giống Windows, đặt lớp Real-time cần một đặc quyền (<em>SeIncreaseBasePriorityPrivilege</em>). Cuối cùng <code>ps</code> hiện lớp <code>TS</code> (time-sharing) cho một shell thường.</p>
<table>
<thead><tr><th>Ý</th><th>Windows</th><th>Linux</th></tr></thead>
<tbody>
<tr><td>số mức</td><td>32 (0–31)</td><td>nice 40 giá trị (−20…19) cho luồng thường; 99 mức thời gian thực</td></tr>
<tr><td>số lớn hơn = gấp hơn?</td><td>có</td><td>thời gian thực: có; nice: KHÔNG (thấp hơn = gấp hơn)</td></tr>
<tr><td>vùng thời gian thực</td><td>16–31 (lớp Real-time)</td><td><code>SCHED_FIFO</code>/<code>SCHED_RR</code> 1–99</td></tr>
<tr><td>cùng mức</td><td>quantum round-robin</td><td>RR: quantum; FIFO: tới khi chặn hoặc nhường</td></tr>
<tr><td>ai được dùng</td><td>cần đặc quyền cho Real-time</td><td><code>CAP_SYS_NICE</code> / <code>RLIMIT_RTPRIO</code></td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Đừng chép con số giữa hai hệ: "Windows 8 ≈ Linux nice 0" là so sánh phổ biến nhưng lỏng lẻo — độ ưu tiên gốc Windows là xếp hạng <em>ưu tiên chặt</em>, nice của Linux là một <em>trọng số</em> trong bộ lập lịch chia công bằng. So sánh ý tưởng, không so sánh số.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> dịch vụ Windows làm việc nền nên đặt <code>THREAD_PRIORITY_BELOW_NORMAL</code> hay chạy trong tiến trình Below-normal; trong Docker trên Linux dùng <code>--cpu-shares</code> (trọng số) hay <code>--cpus</code> (hạn mức) thay vì đổi nice. Đừng bao giờ cho web server ưu tiên thời gian thực: một luồng yêu cầu quay vòng có thể bỏ đói cả máy, kể cả phiên SSH của bạn.</div>`],
      [39, 'Scheduling (4)',
        `<p class="y-chinh">🎯 Figure 11-27: <strong>priority inversion</strong>. (a) A thread at priority <strong>12</strong> does a <em>down</em> on a semaphore that is held by a thread at priority <strong>4</strong> and blocks. (b) Now a thread at priority <strong>8</strong> is running; the priority-4 thread is ready but "would like to do an up on the semaphore but never gets scheduled" — so the most urgent thread (12) waits behind a medium thread (8) that does not even need the semaphore. The urgent thread has been "inverted" below a less important one.</p>
<p>A traffic story. An ambulance (12) needs to pass, but a slow delivery van (4) is blocking the only narrow bridge, waiting for its own turn to move. A private car (8) arrives and — being more important than the van — takes every green light, so the van never moves, so the bridge is never cleared, so the ambulance never crosses. Nobody did anything wrong by the scheduler's rules; the <em>combination</em> is the bug. This is not theoretical: the 1997 Mars Pathfinder lander repeatedly reset because of exactly this pattern (widely reported; the fix was to enable priority inheritance on the mutex) — a favourite story in real-time courses.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4dad29148636126be2022b5bd3e7fb99bcdd00c9.svg" alt="The scenario with plain strict priority: T12 is blocked from t = 3 to t = 24 and finishes at 26, because T8 keeps T4 from running" loading="lazy" /><p class="chu-thich">🧮 The scenario with plain strict priority: T12 is blocked from t = 3 to t = 24 and finishes at 26, because T8 keeps T4 from running</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<p>The simulator runs Figure 11-27's setting: T4 takes the semaphore S at t = 0 and needs 4 units of work while holding it; T8 (compute-bound, 20 units) arrives at t = 2 and preempts T4 after only 2 units; T12 arrives at t = 3, asks for S and blocks. From then on only T8 runs. T4 gets the CPU again only when T8 finishes at t = 22; it releases S at 24 and T12 finally runs 2 units and ends at <strong>26</strong> — it waited 23 units for a 2-unit job.</p>
<p><strong>How Windows breaks the inversion:</strong> the book describes the <strong>Balance Set Manager</strong>, a system thread that wakes about once a second, scans the ready queues, and for any thread that has been ready but not running for roughly <strong>4 seconds</strong>, <strong>boosts its priority to 15 for two quanta</strong>, then lets it drop back. (Microsoft's Learn pages say only that "the system can boost and lower the dynamic priority … to ensure that it is responsive and that no threads are starved", that boosts apply only to base priorities <strong>0–15</strong>, and that after a boost "the scheduler reduces that priority by one level each time the thread completes a time slice"; the 4-second figure is the book's and Windows Internals', not Learn's.) The simulation uses a scaled-down threshold of 4 time units:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/95acdf390bb0d0eaf22338319c6914cd918d590c.svg" alt="With the anti-starvation boost: T4 is lifted at t = 6, frees S at t = 8, T12 finishes at t = 10" loading="lazy" /><p class="chu-thich">🧮 With the anti-starvation boost: T4 is lifted at t = 6, frees S at t = 8, T12 finishes at t = 10</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<p>With the boost, T4 (ready since t = 2) is lifted to 15 at t = 6, preempts T8, finishes its critical section in 2 units, releases S at t = 8, and T12 runs from 8 to <strong>10</strong> instead of 26. T8 is delayed but still completes (at 26). The boost is not elegant — it fixes starvation, not <em>inversion</em> in particular — which is why real-time systems prefer <strong>priority inheritance</strong>: while T12 waits on S, T4 temporarily <em>inherits</em> priority 12, so T8 cannot preempt it. Linux offers this directly: <code>pthread_mutexattr_setprotocol(PTHREAD_PRIO_INHERIT)</code> and the in-kernel <em>rt-mutex</em>, used by <code>PREEMPT_RT</code>.</p>
<p class="meo">🧠 Three-line answer for the exam: <strong>(1)</strong> high-priority thread blocked on a resource held by a low-priority thread; <strong>(2)</strong> a medium-priority thread prevents the low one from running; <strong>(3)</strong> fixes: priority inheritance, or Windows's random/periodic boost of starved threads.</p>
<p class="pitfall">⚠️ Learn also notes: "if you have a thread waiting for another thread with a lower priority to complete some task, be sure to block the execution of the waiting high-priority thread" (use a wait function, not a busy loop) — "otherwise, the process may become deadlocked, because the thread with lower priority is never scheduled". A <em>spin-waiting</em> high-priority thread is the deadliest version of this slide.</p>`,
        `<p class="y-chinh">🎯 Hình 11-27: <strong>đảo ngược ưu tiên (priority inversion)</strong>. (a) Một luồng ưu tiên <strong>12</strong> thực hiện <em>down</em> trên một semaphore đang do luồng ưu tiên <strong>4</strong> giữ và bị chặn. (b) Giờ một luồng ưu tiên <strong>8</strong> đang chạy; luồng ưu tiên 4 sẵn sàng nhưng "muốn up semaphore mà không bao giờ được lập lịch" — nên luồng gấp nhất (12) phải đợi sau một luồng trung bình (8) thậm chí không cần semaphore. Luồng gấp bị "đảo" xuống dưới một luồng ít quan trọng hơn.</p>
<p>Một câu chuyện giao thông. Xe cứu thương (12) cần qua, nhưng một xe tải giao hàng chậm (4) chặn cây cầu hẹp duy nhất, đang đợi tới lượt mình di chuyển. Một xe con (8) tới và — quan trọng hơn xe tải — chiếm mọi đèn xanh, nên xe tải không bao giờ nhúc nhích, nên cầu không bao giờ thông, nên xe cứu thương không bao giờ qua. Theo luật của bộ lập lịch không ai làm sai; <em>sự kết hợp</em> mới là lỗi. Đây không phải lý thuyết: tàu đổ bộ Mars Pathfinder năm 1997 liên tục tự khởi động lại vì đúng mẫu này (được báo cáo rộng rãi; cách sửa là bật kế thừa ưu tiên trên mutex) — câu chuyện ưa thích trong các khoá thời gian thực.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/76e2f26cfd901a2866a05d1c229a43ea3977741d.svg" alt="Kịch bản với ưu tiên chặt thuần: T12 bị chặn từ t = 3 tới t = 24 và xong lúc 26, vì T8 giữ T4 không chạy được" loading="lazy" /><p class="chu-thich">🧮 Kịch bản với ưu tiên chặt thuần: T12 bị chặn từ t = 3 tới t = 24 và xong lúc 26, vì T8 giữ T4 không chạy được</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<p>Bộ mô phỏng chạy bối cảnh của Hình 11-27: T4 lấy semaphore S lúc t = 0 và cần 4 đơn vị việc khi giữ nó; T8 (nặng tính toán, 20 đơn vị) tới lúc t = 2 và chiếm quyền T4 sau chỉ 2 đơn vị; T12 tới lúc t = 3, xin S và bị chặn. Từ đó chỉ T8 chạy. T4 chỉ có CPU lại khi T8 xong lúc t = 22; nó nhả S lúc 24 và T12 cuối cùng chạy 2 đơn vị và xong lúc <strong>26</strong> — nó đợi 23 đơn vị cho một việc 2 đơn vị.</p>
<p><strong>Windows phá đảo ngược thế nào:</strong> sách mô tả <strong>Balance Set Manager</strong>, một luồng hệ thống thức dậy khoảng mỗi giây, quét các hàng đợi sẵn sàng, và với luồng nào sẵn sàng mà không chạy suốt khoảng <strong>4 giây</strong> thì <strong>đẩy ưu tiên lên 15 trong hai quantum</strong>, rồi để nó tụt về. (Các trang Learn của Microsoft chỉ nói "hệ thống có thể tăng và giảm ưu tiên động … để đảm bảo đáp ứng nhanh và không luồng nào bị bỏ đói", rằng boost chỉ áp cho ưu tiên gốc <strong>0–15</strong>, và sau boost "bộ lập lịch giảm ưu tiên đó một mức mỗi khi luồng hoàn thành một lát thời gian"; con số 4 giây là của sách và Windows Internals, không phải của Learn.) Mô phỏng dùng ngưỡng thu nhỏ 4 đơn vị thời gian:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5b25537f22e3b3b5d84c00f58a1286ad9c13053e.svg" alt="Với boost chống đói: T4 được nâng lúc t = 6, nhả S lúc t = 8, T12 xong lúc t = 10" loading="lazy" /><p class="chu-thich">🧮 Với boost chống đói: T4 được nâng lúc t = 6, nhả S lúc t = 8, T12 xong lúc t = 10</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<p>Với boost, T4 (sẵn sàng từ t = 2) được nâng lên 15 lúc t = 6, chiếm quyền T8, xong vùng găng trong 2 đơn vị, nhả S lúc t = 8, và T12 chạy từ 8 tới <strong>10</strong> thay vì 26. T8 bị trễ nhưng vẫn xong (lúc 26). Boost không thanh lịch — nó chữa việc bị bỏ đói, không riêng gì <em>đảo ngược</em> — vì vậy hệ thời gian thực ưa <strong>kế thừa ưu tiên</strong>: trong lúc T12 chờ S, T4 tạm thời <em>thừa kế</em> ưu tiên 12, nên T8 không chiếm quyền được. Linux cung cấp thẳng điều này: <code>pthread_mutexattr_setprotocol(PTHREAD_PRIO_INHERIT)</code> và <em>rt-mutex</em> trong nhân, dùng bởi <code>PREEMPT_RT</code>.</p>
<p class="meo">🧠 Đáp án ba dòng cho kỳ thi: <strong>(1)</strong> luồng ưu tiên cao bị chặn trên tài nguyên do luồng ưu tiên thấp giữ; <strong>(2)</strong> một luồng ưu tiên trung bình ngăn luồng thấp chạy; <strong>(3)</strong> cách sửa: kế thừa ưu tiên, hoặc boost định kỳ luồng bị bỏ đói của Windows.</p>
<p class="pitfall">⚠️ Learn cũng ghi: "nếu bạn có một luồng chờ luồng khác ưu tiên thấp hơn hoàn thành việc nào đó, hãy chắc chắn chặn việc thực thi luồng ưu tiên cao đang chờ" (dùng hàm chờ, không phải vòng bận) — "nếu không, tiến trình có thể bị deadlock, vì luồng ưu tiên thấp không bao giờ được lập lịch". Luồng ưu tiên cao <em>chờ quay vòng (spin)</em> là phiên bản chết người nhất của slide này.</p>`],
      [40, 'Memory Management Fundamental Concepts',
        `<p class="y-chinh">🎯 Figure 11-28 (the title lost a space: "Memory Management — Fundamental Concepts"): the <strong>virtual address space of three user processes on the x86</strong>. Each 4 GB space is split in two: the <em>lower 2 GB is private</em> to each process (its code and data; the bottom and top 64 KB are invalid to catch stray pointers) and the <em>upper 2 GB is shared</em> by all processes (system data, HAL + OS, stacks/data, each process's own page tables, the <em>paged pool</em> and the <em>nonpaged pool</em>). White areas are private; shaded areas are shared among all processes.</p>
<p>A hotel with a shared basement. Every guest (process) has a private 2-GB suite that looks like it starts at address zero, and every guest also sees the same hotel facilities (the kernel) in the upper half — but cannot touch them without the front desk (user mode cannot access kernel addresses). Because the kernel is mapped in <em>every</em> process, a system call does not need to switch address spaces, which makes it faster; the price is that the user program gets only half of a 32-bit space.</p>
<p>The numbers are checkable. Run the arithmetic: user space is 2 GiB minus 2 × 64 KiB of guard zones = 2,047.875 MiB. Where a 32-bit program needs more, Microsoft's "Memory Limits" page lists the options: <strong>2 GB</strong> by default, up to <strong>3 GB</strong> with the <em>/LARGEADDRESSAWARE</em> flag and the old <em>4GT (/3GB)</em> switch on 32-bit Windows, and <strong>4 GB</strong> for a 32-bit process on 64-bit Windows if the large-address-aware flag is set.</p>
<pre><code class="language-javascript">// Numbers from the Windows chapter, computed
// 1) Handle table capacity (Figures 11-16 and 11-17: 32-bit entries of 8 bytes)
const PAGE = 4096, ENTRY = 8, PTR = 4;
const perPage = PAGE / ENTRY;                // handles in one bottom page
const perMid = PAGE / PTR;                   // pointers in a mid-level page
const top = 32;                              // pointers in the top level of the book's figure
console.log('handles per bottom page      :', perPage);
console.log('minimal table (1 page)       :', perPage, 'handles');
console.log('two-level table              :', perPage * perMid, 'handles (', perMid, 'x', perPage, ')');
console.log('maximal table                :', perPage * perMid * top, '= 2^' + Math.log2(perPage * perMid * top), '=', (perPage * perMid * top / 2 ** 20), 'Mi handles');
// 2) The self-map trick (Figure 11-32), 32-bit non-PAE: PTEs of the whole address space sit in a 4 MiB window at 0xC0000000
const hex = (n) =&gt; '0x' + (n &gt;&gt;&gt; 0).toString(16).padStart(8, '0');
const pteAddr = (va) =&gt; (0xC0000000 + (va &gt;&gt;&gt; 12) * 4) &gt;&gt;&gt; 0;
const pdeAddr = (va) =&gt; (0xC0300000 + (va &gt;&gt;&gt; 22) * 4) &gt;&gt;&gt; 0;
console.log('PTE address of VA 0xe4321000 :', hex(pteAddr(0xe4321000)), ' &lt;- figure says 0xc0390c84');
console.log('PDE address of VA 0xe4321000 :', hex(pdeAddr(0xe4321000)));
console.log('PDE of the window itself     :', hex(pdeAddr(0xC0000000)), ' &lt;- the self-map entry, PD[0x300]');
console.log('page directory index of 0xc0300000 :', (0xC0300000 &gt;&gt;&gt; 22).toString(16), '(= 0x300, the figure\\'s label)');
// 3) A 64-bit PTE (Figure 11-31): decode the flag bits of a sample entry
const flags = [['P', 0], ['R/W', 1], ['U/S', 2], ['PWT', 3], ['PCD', 4], ['A', 5], ['D', 6], ['PAT', 7], ['G', 8]];
const pte = 0x8000000012345027n;             // NX=1, frame 0x12345, flags 0x27
const set = flags.filter(([, b]) =&gt; (pte &gt;&gt; BigInt(b)) &amp; 1n).map(([n]) =&gt; n);
console.log('sample PTE', '0x' + pte.toString(16), '-&gt; frame', '0x' + ((pte &gt;&gt; 12n) &amp; 0xFFFFFFFFFFn).toString(16), 'flags:', set.join(' '), (pte &gt;&gt; 63n) &amp; 1n ? '+ NX (no execute)' : '');
// 4) 32-bit address space split (Figure 11-28)
const GiB = 2 ** 30;
console.log('user part  : 0 .. 2 GiB    =', 2 * GiB / 2 ** 20, 'MiB minus 64 KiB at both ends (invalid guard zones)');
console.log('usable user:', (2 * GiB - 2 * 64 * 1024) / 2 ** 20, 'MiB');</code></pre>
<div class="out">$ node tinh-windows.js<br>
handles per bottom page &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512<br>
minimal table (1 page) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512 handles<br>
two-level table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 524288 handles ( 1024 x 512 )<br>
maximal table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 16777216 = 2^24 = 16 Mi handles<br>
PTE address of VA 0xe4321000 : 0xc0390c84 &nbsp;&lt;- figure says 0xc0390c84<br>
PDE address of VA 0xe4321000 : 0xc0300e40<br>
PDE of the window itself &nbsp;&nbsp;&nbsp;&nbsp;: 0xc0300c00 &nbsp;&lt;- the self-map entry, PD[0x300]<br>
page directory index of 0xc0300000 : 300 (= 0x300, the figure's label)<br>
sample PTE 0x8000000012345027 -&gt; frame 0x12345 flags: P R/W U/S A + NX (no execute)<br>
user part &nbsp;: 0 .. 2 GiB &nbsp;&nbsp;&nbsp;= 2048 MiB minus 64 KiB at both ends (invalid guard zones)<br>
usable user: 2047.875 MiB</div>
<p>(The last two lines of the program print the 2 GiB split; the rest is used on slides 19 and 45.) <strong>➕ Windows 8 → today:</strong> a 64-bit process has a vastly bigger space. Microsoft's table: <strong>128 TB</strong> user-mode and 128 TB kernel-mode virtual address space on x64 <em>Windows 8.1 / Server 2012 R2 or later</em>; <strong>8 TB</strong> on "Windows 8 and Server 2012 or earlier" — so the Windows 8 of this deck was <em>the last</em> to have the 8 TB limit. Physical memory limits (same page): Windows 10 and 11 Home <strong>128 GB</strong>, Pro <strong>2 TB</strong>, Pro for Workstations and Enterprise <strong>6 TB</strong>; Windows Server 2016 <strong>24 TB</strong>; Windows 8 (x64) 128 GB, Pro/Enterprise 512 GB. 32-bit client versions cap at 4 GB.</p>
<p>Linux's layout is the same split with different proportions. On 64-bit Linux the user half is <strong>128 TiB</strong> (47 bits) on x86-64 (48-bit virtual addresses; the kernel half is the top half) — the page-table-level names differ but the idea matches. The programs of slide 42 print a real Linux layout.</p>
<p class="pitfall">⚠️ <strong>"Each process has its own 4 GB"</strong> is only half true on 32-bit Windows: 4 GB of <em>addresses</em> exist but 2 GB of them show the same kernel to everyone. And "the paged pool is in the lower half" is wrong; both pools are in the shared upper (system) half. The exam question "which areas are shared among all processes" → shaded: nonpaged pool, paged pool, HAL + OS, system data (not page tables: each process's page tables are its <em>own</em> mapping though they live in the system area).</p>`,
        `<p class="y-chinh">🎯 Hình 11-28 (tiêu đề mất một dấu cách: "Memory Management — Fundamental Concepts"): <strong>không gian địa chỉ ảo của ba tiến trình người dùng trên x86</strong>. Mỗi không gian 4 GB chia đôi: <em>2 GB dưới là riêng</em> của từng tiến trình (mã và dữ liệu của nó; 64 KB dưới cùng và trên cùng không hợp lệ để bắt con trỏ lạc) và <em>2 GB trên là chung</em> cho mọi tiến trình (dữ liệu hệ thống, HAL + HĐH, stack/dữ liệu, bảng trang riêng của mỗi tiến trình, <em>paged pool</em> và <em>nonpaged pool</em>). Vùng trắng là riêng; vùng tô bóng là chung cho mọi tiến trình.</p>
<p>Một khách sạn có tầng hầm chung. Mỗi khách (tiến trình) có một phòng 2 GB riêng trông như bắt đầu từ địa chỉ không, và mọi khách cũng thấy cùng tiện ích của khách sạn (nhân) ở nửa trên — nhưng không chạm được nếu không qua lễ tân (chế độ người dùng không truy cập được địa chỉ nhân). Vì nhân được ánh xạ trong <em>mọi</em> tiến trình, lời gọi hệ thống không cần đổi không gian địa chỉ, nhanh hơn; cái giá là chương trình người dùng chỉ có một nửa không gian 32 bit.</p>
<p>Các con số kiểm chứng được. Chạy phép tính: không gian người dùng là 2 GiB trừ 2 × 64 KiB vùng đệm = 2.047,875 MiB. Khi chương trình 32 bit cần hơn, trang "Memory Limits" của Microsoft liệt kê các lựa chọn: <strong>2 GB</strong> mặc định, tới <strong>3 GB</strong> với cờ <em>/LARGEADDRESSAWARE</em> và công tắc cũ <em>4GT (/3GB)</em> trên Windows 32 bit, và <strong>4 GB</strong> cho tiến trình 32 bit trên Windows 64 bit nếu đặt cờ large-address-aware.</p>
<pre><code class="language-javascript">// Các con số của chương Windows, tính ra
// Sức chứa bảng handle (Hình 11-16 và 11-17: mục 8 byte của bản 32 bit)
const PAGE = 4096, ENTRY = 8, PTR = 4;
const perPage = PAGE / ENTRY;                // số handle trong một trang đáy
const perMid = PAGE / PTR;                   // số con trỏ trong trang giữa
const top = 32;                              // số con trỏ ở tầng trên cùng trong hình của sách
console.log('handles per bottom page      :', perPage);
console.log('minimal table (1 page)       :', perPage, 'handles');
console.log('two-level table              :', perPage * perMid, 'handles (', perMid, 'x', perPage, ')');
console.log('maximal table                :', perPage * perMid * top, '= 2^' + Math.log2(perPage * perMid * top), '=', (perPage * perMid * top / 2 ** 20), 'Mi handles');
// Mẹo tự ánh xạ (Hình 11-32), 32 bit không PAE: PTE của cả không gian địa chỉ nằm trong cửa sổ 4 MiB ở 0xC0000000
const hex = (n) =&gt; '0x' + (n &gt;&gt;&gt; 0).toString(16).padStart(8, '0');
const pteAddr = (va) =&gt; (0xC0000000 + (va &gt;&gt;&gt; 12) * 4) &gt;&gt;&gt; 0;
const pdeAddr = (va) =&gt; (0xC0300000 + (va &gt;&gt;&gt; 22) * 4) &gt;&gt;&gt; 0;
console.log('PTE address of VA 0xe4321000 :', hex(pteAddr(0xe4321000)), ' &lt;- figure says 0xc0390c84');
console.log('PDE address of VA 0xe4321000 :', hex(pdeAddr(0xe4321000)));
console.log('PDE of the window itself     :', hex(pdeAddr(0xC0000000)), ' &lt;- the self-map entry, PD[0x300]');
console.log('page directory index of 0xc0300000 :', (0xC0300000 &gt;&gt;&gt; 22).toString(16), '(= 0x300, the figure\\'s label)');
// PTE 64 bit (Hình 11-31): giải mã các bit cờ của một mục mẫu
const flags = [['P', 0], ['R/W', 1], ['U/S', 2], ['PWT', 3], ['PCD', 4], ['A', 5], ['D', 6], ['PAT', 7], ['G', 8]];
const pte = 0x8000000012345027n;             // NX=1, khung 0x12345, cờ 0x27
const set = flags.filter(([, b]) =&gt; (pte &gt;&gt; BigInt(b)) &amp; 1n).map(([n]) =&gt; n);
console.log('sample PTE', '0x' + pte.toString(16), '-&gt; frame', '0x' + ((pte &gt;&gt; 12n) &amp; 0xFFFFFFFFFFn).toString(16), 'flags:', set.join(' '), (pte &gt;&gt; 63n) &amp; 1n ? '+ NX (no execute)' : '');
// Chia không gian địa chỉ 32 bit (Hình 11-28)
const GiB = 2 ** 30;
console.log('user part  : 0 .. 2 GiB    =', 2 * GiB / 2 ** 20, 'MiB minus 64 KiB at both ends (invalid guard zones)');
console.log('usable user:', (2 * GiB - 2 * 64 * 1024) / 2 ** 20, 'MiB');</code></pre>
<div class="out">$ node tinh-windows.js<br>
handles per bottom page &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512<br>
minimal table (1 page) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 512 handles<br>
two-level table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 524288 handles ( 1024 x 512 )<br>
maximal table &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 16777216 = 2^24 = 16 Mi handles<br>
PTE address of VA 0xe4321000 : 0xc0390c84 &nbsp;&lt;- figure says 0xc0390c84<br>
PDE address of VA 0xe4321000 : 0xc0300e40<br>
PDE of the window itself &nbsp;&nbsp;&nbsp;&nbsp;: 0xc0300c00 &nbsp;&lt;- the self-map entry, PD[0x300]<br>
page directory index of 0xc0300000 : 300 (= 0x300, the figure's label)<br>
sample PTE 0x8000000012345027 -&gt; frame 0x12345 flags: P R/W U/S A + NX (no execute)<br>
user part &nbsp;: 0 .. 2 GiB &nbsp;&nbsp;&nbsp;= 2048 MiB minus 64 KiB at both ends (invalid guard zones)<br>
usable user: 2047.875 MiB</div>
<p>(Hai dòng cuối của chương trình in cách chia 2 GiB; phần còn lại dùng ở slide 19 và 45.) <strong>➕ Từ Windows 8 tới nay:</strong> tiến trình 64 bit có không gian lớn hơn rất nhiều. Bảng của Microsoft: <strong>128 TB</strong> không gian ảo chế độ người dùng và 128 TB chế độ nhân trên x64 <em>Windows 8.1 / Server 2012 R2 trở lên</em>; <strong>8 TB</strong> ở "Windows 8 và Server 2012 hoặc cũ hơn" — nên Windows 8 của bộ slide này là bản <em>cuối cùng</em> có giới hạn 8 TB. Giới hạn bộ nhớ vật lý (cùng trang): Windows 10 và 11 Home <strong>128 GB</strong>, Pro <strong>2 TB</strong>, Pro for Workstations và Enterprise <strong>6 TB</strong>; Windows Server 2016 <strong>24 TB</strong>; Windows 8 (x64) 128 GB, Pro/Enterprise 512 GB. Bản client 32 bit giới hạn 4 GB.</p>
<p>Bố cục của Linux là cùng cách chia với tỉ lệ khác. Trên Linux 64 bit nửa người dùng là <strong>128 TiB</strong> (47 bit) trên x86-64 (địa chỉ ảo 48 bit; nửa nhân là nửa trên) — tên các tầng bảng trang khác nhưng ý tưởng khớp. Chương trình ở slide 42 in một bố cục Linux thật.</p>
<p class="pitfall">⚠️ <strong>"Mỗi tiến trình có 4 GB riêng"</strong> chỉ đúng một nửa trên Windows 32 bit: có 4 GB <em>địa chỉ</em> nhưng 2 GB trong đó hiện cùng một nhân cho mọi người. Và "paged pool nằm ở nửa dưới" là sai; cả hai pool nằm ở nửa trên chung (hệ thống). Câu thi "vùng nào chung giữa mọi tiến trình" → vùng tô bóng: nonpaged pool, paged pool, HAL + HĐH, dữ liệu hệ thống (không phải bảng trang: bảng trang của mỗi tiến trình là ánh xạ <em>riêng</em> của nó dù nằm trong vùng hệ thống).</p>`],
      [41, 'Memory-Management System Calls',
        `<p class="y-chinh">🎯 Figure 11-29: the principal <strong>Win32 virtual-memory calls</strong>: <code>VirtualAlloc</code> (reserve or commit a region), <code>VirtualFree</code> (release or decommit), <code>VirtualProtect</code> (change read/write/execute protection), <code>VirtualQuery</code> (ask about a region's status), <code>VirtualLock</code> (make a region <em>memory resident</em> — disable paging for it), <code>VirtualUnlock</code>, <code>CreateFileMapping</code> (create a file-mapping object, optionally named), <code>MapViewOfFile</code> (map part of a file into the address space), <code>UnmapViewOfFile</code>, <code>OpenFileMapping</code>.</p>
<p>The key idea is the <strong>two-step allocation: reserve, then commit</strong>. <em>Reserve</em> = "keep these addresses for me" (like putting a "reserved" card on a restaurant's table: nobody else gets them, but no food is cooked yet). <em>Commit</em> = "back them with real storage" (the kitchen promises a meal: RAM or paging-file space is set aside). A thread can reserve 1 GB cheaply (a stack that may need to grow, a big buffer) and commit only the first 16 MB. Touching a committed page the first time makes the kernel supply a <strong>zero-filled</strong> page on demand (slide 44). Touching a merely <em>reserved</em> page is an <strong>access violation</strong> — the fatal fault.</p>
<p>Linux has no separate verbs, but the same effect is produced by <code>mmap</code> with different protections: <code>mmap(PROT_NONE)</code> ≈ <code>MEM_RESERVE</code> (addresses taken, no access, no memory), <code>mprotect(PROT_READ|PROT_WRITE)</code> ≈ <code>MEM_COMMIT</code>, <code>munmap</code> ≈ <code>VirtualFree</code>, <code>mlock</code> ≈ <code>VirtualLock</code>, and reading <code>/proc/self/maps</code> ≈ <code>VirtualQuery</code>. This is exactly what the JVM, Go and .NET runtimes do to manage their heaps. The program below reserves 1 GiB, commits 16 MiB, touches it, and then deliberately touches reserved-only memory:</p>
<pre><code class="language-c">// VirtualAlloc(MEM_RESERVE) then MEM_COMMIT: reserve address space first, give it memory later; pages are zero-filled on first touch
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;unistd.h&gt;

static long status_kib(const char *key) {
    FILE *f = fopen("/proc/self/status", "r"); char line[256]; long v = -1;
    while (fgets(line, sizeof line, f)) if (!strncmp(line, key, strlen(key))) { v = atol(line + strlen(key) + 1); break; }
    fclose(f); return v;
}
static long faults(void) { struct rusage r; getrusage(RUSAGE_SELF, &amp;r); return r.ru_minflt; }

int main(void) {
    const size_t GiB = 1UL &lt;&lt; 30, MiB16 = 16UL &lt;&lt; 20;
    long vm0 = status_kib("VmSize:"), rss0 = status_kib("VmRSS:");
    // MEM_RESERVE: 1 GiB of addresses, no access, no memory
    char *p = mmap(NULL, GiB, PROT_NONE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    printf("reserve: VmSize grew by %ld MiB, RSS grew by %ld KiB\\n", (status_kib("VmSize:") - vm0) / 1024, status_kib("VmRSS:") - rss0);
    // MEM_COMMIT the first 16 MiB (make it readable/writable)
    madvise(p, MiB16, MADV_NOHUGEPAGE);                          // keep 4 KiB pages so every fault is visible
    mprotect(p, MiB16, PROT_READ | PROT_WRITE);
    long rss1 = status_kib("VmRSS:"), f1 = faults();
    printf("commit only: RSS grew by %ld KiB (committed is not yet resident)\\n", rss1 - rss0);
    for (size_t i = 0; i &lt; MiB16; i += 4096) p[i] = 1;          // first touch = page fault, kernel hands a ZEROED page
    printf("commit + touch: RSS grew by %ld KiB\\n4 KiB pages: minor faults %ld (one per page)\\n", status_kib("VmRSS:") - rss0, faults() - f1);
    // The same 16 MiB with transparent huge pages: the kernel may hand out 2 MiB at a time
    char *h = mmap(NULL, 64UL &lt;&lt; 20, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    h = (char *)(((unsigned long)h + (2UL &lt;&lt; 20) - 1) &amp; ~((2UL &lt;&lt; 20) - 1));
    madvise(h, MiB16, MADV_HUGEPAGE);
    long f2 = faults();
    for (size_t i = 0; i &lt; MiB16; i += 4096) h[i] = 1;
    printf("huge pages: minor faults %ld for the same 16 MiB\\n", faults() - f2);
    // Reading an untouched committed page gives zeros: the OS never shows another process's old data
    char *q = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    printf("fresh page first byte: %d (zero-filled before you see it)\\n", q[0]);
    // Access violation: touching RESERVED-only memory is a fatal fault, like writing to an uncommitted page on Windows
    fflush(stdout);
    if (fork() == 0) { p[MiB16 + 8] = 1; _exit(0); }
    int st; wait(&amp;st);
    if (WIFSIGNALED(st)) printf("touching reserved-only memory: killed by signal %d (SIGSEGV = Windows ACCESS_VIOLATION)\\n", WTERMSIG(st));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread loi-trang.c -o loi-trang &amp;&amp; ./loi-trang<br>
reserve: VmSize grew by 1024 MiB, RSS grew by 0 KiB<br>
commit only: RSS grew by 132 KiB (committed is not yet resident)<br>
commit + touch: RSS grew by 16520 KiB<br>
4 KiB pages: minor faults 4097 (one per page)<br>
huge pages: minor faults 8 for the same 16 MiB<br>
fresh page first byte: 0 (zero-filled before you see it)<br>
touching reserved-only memory: killed by signal 11 (SIGSEGV = Windows ACCESS_VIOLATION)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Read it line by line. <strong>Reserve:</strong> the process's virtual size (<code>VmSize</code>) grew by 1,024 MiB but its resident set (<code>RSS</code>) by 0 KiB — a gigabyte of addresses cost no RAM. <strong>Commit:</strong> after <code>mprotect</code> the resident size grew only by about 132 KiB — <em>committed ≠ resident</em>: the pages are promised, not yet present. <strong>Touch:</strong> writing one byte per 4 KiB made RSS jump by 16,520 KiB (16 MiB) and produced <strong>4,097 minor page faults</strong>, one per page (we turned off transparent huge pages with <code>madvise</code> to make every fault visible); with huge pages left on, the same 16 MiB needed only <strong>8</strong> faults of 2 MiB each — the kernel can hand out bigger pages, as Windows does with "large pages" (<code>MEM_LARGE_PAGES</code>). <strong>Fresh page:</strong> reads as 0 — the OS never shows you another process's old data (slide 59, item 5). <strong>Access violation:</strong> writing to reserved-only memory killed the child with <code>SIGSEGV</code> (signal 11), Linux's version of Windows <code>EXCEPTION_ACCESS_VIOLATION</code>.</p>
<p><strong>Memory-mapped files</strong> (<code>CreateFileMapping</code> + <code>MapViewOfFile</code>) let you treat a file as an array: reading byte <em>n</em> of the array faults in the right part of the file from disk. Database engines (SQLite, LMDB, parts of PostgreSQL) and the program loader (executables and DLLs/shared libraries are <em>mapped</em>, not read, see slide 42) use this. Windows has a subtlety Linux does not: a <em>mapped</em> executable file cannot be deleted or overwritten while running ("file in use"), whereas Linux lets you delete the name and keep running the old inode — which is why you can replace a binary on a Linux server without stopping it but cannot on Windows (a common deployment annoyance).</p>
<p class="pitfall">⚠️ "VirtualAlloc with MEM_COMMIT allocates RAM" is a half-truth: it allocates <em>commit charge</em> (a promise counted against RAM + paging file); RAM is used only when pages are touched. The Task Manager's "Committed" versus "In use" numbers show exactly the gap you measured here.</p>`,
        `<p class="y-chinh">🎯 Hình 11-29: các <strong>lời gọi bộ nhớ ảo Win32</strong> chính: <code>VirtualAlloc</code> (giữ chỗ hoặc commit một vùng), <code>VirtualFree</code> (giải phóng hoặc decommit), <code>VirtualProtect</code> (đổi quyền đọc/ghi/chạy), <code>VirtualQuery</code> (hỏi trạng thái một vùng), <code>VirtualLock</code> (làm một vùng <em>thường trú trong bộ nhớ</em> — tắt phân trang cho nó), <code>VirtualUnlock</code>, <code>CreateFileMapping</code> (tạo đối tượng ánh xạ tệp, có thể đặt tên), <code>MapViewOfFile</code> (ánh xạ một phần tệp vào không gian địa chỉ), <code>UnmapViewOfFile</code>, <code>OpenFileMapping</code>.</p>
<p>Ý chính là <strong>cấp phát hai bước: reserve, rồi commit</strong>. <em>Reserve</em> = "giữ các địa chỉ này cho tôi" (như đặt thẻ "đã đặt" lên bàn nhà hàng: không ai khác được, nhưng chưa nấu món nào). <em>Commit</em> = "đỡ chúng bằng bộ lưu trữ thật" (bếp hứa một bữa ăn: RAM hoặc chỗ trong tệp phân trang được dành riêng). Một luồng có thể reserve 1 GB rẻ (một stack có thể cần lớn thêm, một bộ đệm lớn) và chỉ commit 16 MB đầu. Chạm một trang đã commit lần đầu khiến nhân cung cấp một trang <strong>điền số 0</strong> theo yêu cầu (slide 44). Chạm một trang chỉ mới <em>reserve</em> là <strong>vi phạm truy cập</strong> — lỗi chết.</p>
<p>Linux không có động từ riêng, nhưng cùng hiệu quả được tạo bằng <code>mmap</code> với quyền khác nhau: <code>mmap(PROT_NONE)</code> ≈ <code>MEM_RESERVE</code> (địa chỉ bị chiếm, không truy cập, không bộ nhớ), <code>mprotect(PROT_READ|PROT_WRITE)</code> ≈ <code>MEM_COMMIT</code>, <code>munmap</code> ≈ <code>VirtualFree</code>, <code>mlock</code> ≈ <code>VirtualLock</code>, và đọc <code>/proc/self/maps</code> ≈ <code>VirtualQuery</code>. Đây đúng là việc runtime JVM, Go và .NET làm để quản lý heap. Chương trình dưới đây reserve 1 GiB, commit 16 MiB, chạm vào, rồi cố ý chạm vùng chỉ reserve:</p>
<pre><code class="language-c">// VirtualAlloc(MEM_RESERVE) rồi MEM_COMMIT: giữ chỗ không gian địa chỉ trước, cấp bộ nhớ sau; trang được điền số 0 ở lần chạm đầu
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;unistd.h&gt;

static long status_kib(const char *key) {
    FILE *f = fopen("/proc/self/status", "r"); char line[256]; long v = -1;
    while (fgets(line, sizeof line, f)) if (!strncmp(line, key, strlen(key))) { v = atol(line + strlen(key) + 1); break; }
    fclose(f); return v;
}
static long faults(void) { struct rusage r; getrusage(RUSAGE_SELF, &amp;r); return r.ru_minflt; }

int main(void) {
    const size_t GiB = 1UL &lt;&lt; 30, MiB16 = 16UL &lt;&lt; 20;
    long vm0 = status_kib("VmSize:"), rss0 = status_kib("VmRSS:");
    // MEM_RESERVE: 1 GiB địa chỉ, không quyền truy cập, không bộ nhớ
    char *p = mmap(NULL, GiB, PROT_NONE, MAP_PRIVATE | MAP_ANONYMOUS | MAP_NORESERVE, -1, 0);
    printf("reserve: VmSize grew by %ld MiB, RSS grew by %ld KiB\\n", (status_kib("VmSize:") - vm0) / 1024, status_kib("VmRSS:") - rss0);
    // MEM_COMMIT 16 MiB đầu (cho phép đọc/ghi)
    madvise(p, MiB16, MADV_NOHUGEPAGE);                          // giữ trang 4 KiB để thấy từng lỗi
    mprotect(p, MiB16, PROT_READ | PROT_WRITE);
    long rss1 = status_kib("VmRSS:"), f1 = faults();
    printf("commit only: RSS grew by %ld KiB (committed is not yet resident)\\n", rss1 - rss0);
    for (size_t i = 0; i &lt; MiB16; i += 4096) p[i] = 1;          // chạm lần đầu = lỗi trang, nhân đưa một trang ĐÃ XÓA SẠCH
    printf("commit + touch: RSS grew by %ld KiB\\n4 KiB pages: minor faults %ld (one per page)\\n", status_kib("VmRSS:") - rss0, faults() - f1);
    // Cũng 16 MiB nhưng với transparent huge pages: nhân có thể cấp mỗi lần 2 MiB
    char *h = mmap(NULL, 64UL &lt;&lt; 20, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    h = (char *)(((unsigned long)h + (2UL &lt;&lt; 20) - 1) &amp; ~((2UL &lt;&lt; 20) - 1));
    madvise(h, MiB16, MADV_HUGEPAGE);
    long f2 = faults();
    for (size_t i = 0; i &lt; MiB16; i += 4096) h[i] = 1;
    printf("huge pages: minor faults %ld for the same 16 MiB\\n", faults() - f2);
    // Đọc trang đã commit chưa chạm cho ra số 0: HĐH không bao giờ lộ dữ liệu cũ của tiến trình khác
    char *q = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    printf("fresh page first byte: %d (zero-filled before you see it)\\n", q[0]);
    // Vi phạm truy cập: chạm vào vùng CHỈ ĐƯỢC GIỮ CHỖ là lỗi chết, như ghi vào trang chưa commit trên Windows
    fflush(stdout);
    if (fork() == 0) { p[MiB16 + 8] = 1; _exit(0); }
    int st; wait(&amp;st);
    if (WIFSIGNALED(st)) printf("touching reserved-only memory: killed by signal %d (SIGSEGV = Windows ACCESS_VIOLATION)\\n", WTERMSIG(st));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread loi-trang.c -o loi-trang &amp;&amp; ./loi-trang<br>
reserve: VmSize grew by 1024 MiB, RSS grew by 0 KiB<br>
commit only: RSS grew by 132 KiB (committed is not yet resident)<br>
commit + touch: RSS grew by 16520 KiB<br>
4 KiB pages: minor faults 4097 (one per page)<br>
huge pages: minor faults 8 for the same 16 MiB<br>
fresh page first byte: 0 (zero-filled before you see it)<br>
touching reserved-only memory: killed by signal 11 (SIGSEGV = Windows ACCESS_VIOLATION)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Đọc từng dòng. <strong>Reserve:</strong> kích thước ảo của tiến trình (<code>VmSize</code>) tăng 1.024 MiB nhưng tập thường trú (<code>RSS</code>) tăng 0 KiB — một gigabyte địa chỉ không tốn RAM. <strong>Commit:</strong> sau <code>mprotect</code> kích thước thường trú chỉ tăng khoảng 132 KiB — <em>committed ≠ thường trú</em>: các trang được hứa, chưa có mặt. <strong>Chạm:</strong> ghi một byte mỗi 4 KiB làm RSS nhảy 16.520 KiB (16 MiB) và gây <strong>4.097 lỗi trang nhỏ (minor)</strong>, mỗi trang một lỗi (ta tắt transparent huge pages bằng <code>madvise</code> để thấy từng lỗi); để huge page bật, cùng 16 MiB chỉ cần <strong>8</strong> lỗi mỗi lỗi 2 MiB — nhân có thể cấp trang lớn hơn, như Windows với "large pages" (<code>MEM_LARGE_PAGES</code>). <strong>Trang mới:</strong> đọc ra 0 — HĐH không bao giờ cho bạn thấy dữ liệu cũ của tiến trình khác (slide 59, mục 5). <strong>Vi phạm truy cập:</strong> ghi vào vùng chỉ reserve giết tiến trình con bằng <code>SIGSEGV</code> (tín hiệu 11), phiên bản Linux của <code>EXCEPTION_ACCESS_VIOLATION</code> của Windows.</p>
<p><strong>Tệp ánh xạ bộ nhớ</strong> (<code>CreateFileMapping</code> + <code>MapViewOfFile</code>) cho phép coi tệp như một mảng: đọc byte thứ <em>n</em> của mảng sẽ nạp đúng phần tệp từ đĩa. Các engine cơ sở dữ liệu (SQLite, LMDB, một phần PostgreSQL) và bộ nạp chương trình (tệp thực thi và DLL/thư viện chia sẻ được <em>ánh xạ</em>, không đọc, xem slide 42) dùng điều này. Windows có một tinh tế mà Linux không có: tệp thực thi đang được <em>ánh xạ</em> không thể bị xoá hay ghi đè khi đang chạy ("file in use"), trong khi Linux cho bạn xoá tên và tiếp tục chạy inode cũ — vì vậy bạn thay một tệp nhị phân trên server Linux mà không dừng nó được nhưng trên Windows thì không (một phiền toái triển khai phổ biến).</p>
<p class="pitfall">⚠️ "VirtualAlloc với MEM_COMMIT cấp RAM" là nửa sự thật: nó cấp <em>phí commit (commit charge)</em> (một lời hứa tính vào RAM + tệp phân trang); RAM chỉ dùng khi trang được chạm. Các số "Committed" và "In use" trong Task Manager cho thấy đúng khoảng cách bạn vừa đo ở đây.</p>`],
      [42, 'Implementation of Memory Management',
        `<p class="y-chinh">🎯 Figure 11-30: <strong>mapped regions with their shadow pages on disk</strong>. A process's address space is a set of <strong>regions</strong> (stack, data, shared library, program). Each region is backed on disk: the program region by the <code>.exe</code> file (<em>Prog1.exe</em>, <em>Prog2.exe</em>), the shared library by <code>Lib.dll</code>, and the writable regions (stack, data) by the <strong>paging file</strong>. "The <em>lib.dll</em> file is mapped into two address spaces at the same time" — one set of physical pages shared by two processes.</p>
<p>A library with photocopies. The original book (the DLL file on disk) stays in the library; each reader (process) gets a window onto it. Readers who only look share the same physical pages in RAM. A reader who writes on his copy gets a private duplicate of just that page (copy-on-write). Notes a reader makes that never existed in any book (stack, heap) are saved, when RAM is short, in the library's <em>notebook</em> (the paging file). The name "shadow pages on disk" in the figure means: <em>every virtual page has a place on disk that can hold it when it is not in RAM</em>.</p>
<p>The Linux layout of a running program is the same story, and you can read it. The program below prints the mappings of a real process: the program itself (file-backed, read-only code and read-write data), the <strong>heap</strong> (anonymous), the shared C library <code>libc.so.6</code> (file-backed — <em>one</em> copy in RAM shared by every process that uses it), the kernel-provided <code>[vdso]</code>, and the <strong>stack</strong> (anonymous, grows on demand):</p>
<div class="out"># Figure 11-28 on Linux: the private part of an address space = program, heap, shared libraries mapped from FILES, stack<br>
$ cat /proc/self/maps | awk '{ n = split($1, a, "-"); printf "%-34s %s %-10s %s\\n", $1, $2, $5 == 0 ? "(anonymous)" : "(file)", $6 }' | grep -E "\\[heap\\]|\\[stack\\]|libc.so|\\[vdso\\]" | grep -v -E "^[^ ]+ +---p"<br>
aaaaf7387000-aaaaf73a8000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rw-p (anonymous) [heap]<br>
ffffb1b80000-ffffb1d0c000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r-xp (file) &nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffb1d1c000-ffffb1d20000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r--p (file) &nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffb1d20000-ffffb1d22000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rw-p (file) &nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffb1d74000-ffffb1d76000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r-xp (anonymous) [vdso]<br>
ffffdf236000-ffffdf257000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rw-p (anonymous) [stack]<br>
# Windows commits memory against a hard limit; Linux by default promises more than it has (overcommit) and kills on OOM<br>
$ echo "vm.overcommit_memory = $(sysctl -n vm.overcommit_memory) &nbsp;&nbsp;(0 = heuristic, 1 = always, 2 = strict like Windows's commit limit)"<br>
vm.overcommit_memory = 1 &nbsp;&nbsp;(0 = heuristic, 1 = always, 2 = strict like Windows's commit limit)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The permission column <code>r-xp</code> / <code>r--p</code> / <code>rw-p</code> is Windows's page protection (<code>PAGE_EXECUTE_READ</code>, <code>PAGE_READONLY</code>, <code>PAGE_READWRITE</code>), and <code>p</code> means <em>private</em> (copy-on-write) rather than <em>shared</em>. The addresses start at different places each time (ASLR, slide 63). Note the <strong>overcommit</strong> line: Windows keeps <em>commit accounting</em> — the sum of all commit charges may not exceed <em>RAM + paging-file size</em> (the "commit limit"), so a <code>VirtualAlloc(MEM_COMMIT)</code> can fail up front with "out of memory"; Linux by default may promise more than exists and then kill a process (the OOM killer) when pages are actually touched — in this lab's VM the policy happens to be <code>1</code> ("always"); a typical server defaults to <code>0</code> (heuristic) and <code>2</code> is the strict, Windows-like mode.</p>
<p><strong>The paging file:</strong> Windows swaps to <code>pagefile.sys</code> on a normal volume (and <code>swapfile.sys</code> for Modern apps); Linux uses a swap partition or file (this lab VM has 1 GiB of swap, as <code>SwapTotal</code> showed on slide 47). Both keep it <em>optional</em> in principle, but Windows's strict commit limit makes it more important there: no page file means a smaller commit limit.</p>
<div class="callout">🧭 <strong>On a real server:</strong> you will see this when a Java or .NET service on Windows dies with "OutOfMemory" while Task Manager still shows free RAM: the <em>commit limit</em> (RAM + page file) was hit, not the RAM. On Linux the equivalent surprise is a container killed by the OOM killer because it crossed its <code>--memory</code> limit (cgroup, slide 28) even though the host has plenty. Both are "promise versus reality" bugs.</div>`,
        `<p class="y-chinh">🎯 Hình 11-30: <strong>các vùng ánh xạ cùng trang bóng trên đĩa</strong>. Không gian địa chỉ của một tiến trình là một tập các <strong>vùng</strong> (stack, dữ liệu, thư viện chia sẻ, chương trình). Mỗi vùng có chỗ đỡ trên đĩa: vùng chương trình bởi tệp <code>.exe</code> (<em>Prog1.exe</em>, <em>Prog2.exe</em>), thư viện chia sẻ bởi <code>Lib.dll</code>, và các vùng ghi được (stack, dữ liệu) bởi <strong>tệp phân trang (paging file)</strong>. "Tệp <em>lib.dll</em> được ánh xạ vào hai không gian địa chỉ cùng lúc" — một bộ trang vật lý chia sẻ bởi hai tiến trình.</p>
<p>Một thư viện có máy photocopy. Quyển sách gốc (tệp DLL trên đĩa) ở lại thư viện; mỗi độc giả (tiến trình) có một cửa sổ nhìn vào nó. Độc giả chỉ đọc dùng chung các trang vật lý trong RAM. Độc giả viết lên bản của mình có một bản sao riêng chỉ của trang đó (copy-on-write). Ghi chú của độc giả chưa từng có trong sách nào (stack, heap) được lưu, khi RAM thiếu, vào <em>sổ tay</em> của thư viện (tệp phân trang). Cái tên "trang bóng trên đĩa" trong hình nghĩa là: <em>mỗi trang ảo có một chỗ trên đĩa để chứa nó khi không ở trong RAM</em>.</p>
<p>Bố cục Linux của một chương trình đang chạy là cùng câu chuyện, và bạn đọc được. Chương trình dưới đây in các ánh xạ của một tiến trình thật: chính chương trình (dựa trên tệp, mã chỉ đọc và dữ liệu đọc-ghi), <strong>heap</strong> (ẩn danh), thư viện C chia sẻ <code>libc.so.6</code> (dựa trên tệp — <em>một</em> bản trong RAM chia sẻ cho mọi tiến trình dùng nó), <code>[vdso]</code> do nhân cung cấp, và <strong>stack</strong> (ẩn danh, lớn dần theo nhu cầu):</p>
<div class="out"># Hình 11-28 trên Linux: phần riêng của không gian địa chỉ = chương trình, heap, thư viện chia sẻ ánh xạ từ TỆP, stack<br>
$ cat /proc/self/maps | awk '{ n = split($1, a, "-"); printf "%-34s %s %-10s %s\\n", $1, $2, $5 == 0 ? "(anonymous)" : "(file)", $6 }' | grep -E "\\[heap\\]|\\[stack\\]|libc.so|\\[vdso\\]" | grep -v -E "^[^ ]+ +---p"<br>
aaaaf7387000-aaaaf73a8000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rw-p (anonymous) [heap]<br>
ffffb1b80000-ffffb1d0c000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r-xp (file) &nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffb1d1c000-ffffb1d20000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r--p (file) &nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffb1d20000-ffffb1d22000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rw-p (file) &nbsp;&nbsp;&nbsp;&nbsp;/usr/lib/aarch64-linux-gnu/libc.so.6<br>
ffffb1d74000-ffffb1d76000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r-xp (anonymous) [vdso]<br>
ffffdf236000-ffffdf257000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rw-p (anonymous) [stack]<br>
# Windows commit bộ nhớ dựa trên một giới hạn cứng; Linux mặc định hứa nhiều hơn mình có (overcommit) và giết khi hết bộ nhớ<br>
$ echo "vm.overcommit_memory = $(sysctl -n vm.overcommit_memory) &nbsp;&nbsp;(0 = heuristic, 1 = always, 2 = strict like Windows's commit limit)"<br>
vm.overcommit_memory = 1 &nbsp;&nbsp;(0 = heuristic, 1 = always, 2 = strict like Windows's commit limit)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Cột quyền <code>r-xp</code> / <code>r--p</code> / <code>rw-p</code> là bảo vệ trang của Windows (<code>PAGE_EXECUTE_READ</code>, <code>PAGE_READONLY</code>, <code>PAGE_READWRITE</code>), và <code>p</code> nghĩa là <em>riêng</em> (copy-on-write) chứ không phải <em>chung</em>. Địa chỉ bắt đầu ở chỗ khác nhau mỗi lần (ASLR, slide 63). Để ý dòng <strong>overcommit</strong>: Windows giữ <em>kế toán commit</em> — tổng mọi phí commit không được vượt <em>RAM + cỡ tệp phân trang</em> ("giới hạn commit"), nên <code>VirtualAlloc(MEM_COMMIT)</code> có thể thất bại ngay với "hết bộ nhớ"; Linux mặc định có thể hứa nhiều hơn có rồi giết một tiến trình (OOM killer) khi trang thực sự được chạm — trong máy ảo của lab này chính sách tình cờ là <code>1</code> ("luôn luôn"); server điển hình mặc định <code>0</code> (heuristic) và <code>2</code> là chế độ chặt, giống Windows.</p>
<p><strong>Tệp phân trang:</strong> Windows swap ra <code>pagefile.sys</code> trên một volume thường (và <code>swapfile.sys</code> cho ứng dụng Modern); Linux dùng phân vùng hay tệp swap (máy ảo lab này có 1 GiB swap, như <code>SwapTotal</code> đã hiện ở slide 47). Cả hai về nguyên tắc để nó <em>tuỳ chọn</em>, nhưng giới hạn commit chặt của Windows khiến nó quan trọng hơn ở đó: không có tệp phân trang nghĩa là giới hạn commit nhỏ hơn.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> bạn sẽ thấy điều này khi một dịch vụ Java hay .NET trên Windows chết với "OutOfMemory" trong khi Task Manager vẫn hiện RAM trống: <em>giới hạn commit</em> (RAM + tệp phân trang) bị chạm, không phải RAM. Trên Linux bất ngờ tương đương là container bị OOM killer giết vì vượt giới hạn <code>--memory</code> (cgroup, slide 28) dù máy chủ còn nhiều. Cả hai là lỗi "lời hứa so với thực tế".</div>`],
      [43, 'Page Fault Handling (1)',
        `<p class="y-chinh">🎯 Figure 11-31: a <strong>page table entry (PTE) for a mapped page on the Intel x86 and AMD x64</strong>. The 64-bit entry holds: the <strong>physical page number</strong> (the frame), and flag bits <strong>P</strong> (present/valid), <strong>R/W</strong> (read/write), <strong>U/S</strong> (user/supervisor), <strong>PWT</strong> (page write-through), <strong>PCD</strong> (page cache disable), <strong>A</strong> (accessed — "referenced"), <strong>D</strong> (dirty — "modified"), <strong>PAT</strong> (page attribute table), <strong>G</strong> (global page), <strong>NX</strong> (no execute) and <strong>AVL</strong> (available to the OS) bits.</p>
<p>A PTE is the entry in the "phone book" that tells the hardware where a page lives and what is allowed with it. <strong>P</strong>: is the page in RAM right now? If 0, any access raises a page fault and the OS decides what to do. <strong>R/W</strong> and <strong>U/S</strong>: may it be written? may user code touch it? <strong>A</strong> and <strong>D</strong> are set by the hardware itself when the page is read or written — the OS later reads them to decide which pages are idle (A = 0) and which must be written to disk before reuse (D = 1). <strong>NX</strong> is "never run code from this page" — the hardware half of the mitigation on slide 63.</p>
<p>These are the <em>same bits</em> that Chapter 3's page tables use on any x86 machine, including Linux. The program on slide 40 decodes a sample 64-bit entry with exactly the figure's layout: for <code>0x8000000012345027</code> it prints <em>frame 0x12345</em> and the flags <code>P R/W U/S A</code> plus <strong>NX</strong> — i.e. "present, writable, user-accessible, has been accessed, never executable, lives in physical frame 0x12345". Try changing the constant to <code>0x…67</code> (adding the D bit, 0x40) and see "dirty" appear. Linux decodes the same entry in <code>/proc/self/pagemap</code> (present, soft-dirty, exclusive bits) and the kernel's <code>pte_t</code> helpers (<code>pte_dirty()</code>, <code>pte_young()</code>) are named after these bits.</p>
<p>When the <strong>P bit is 0</strong>, the hardware ignores all the other bits — so the OS reuses them to store <em>where the page really is</em>: "in the paging file at offset X", "demand-zero", "shared with prototype PTE Y". That trick is why a "not present" PTE of a swapped-out page still tells Windows (or Linux's swap entry format) how to find the data.</p>
<p class="pitfall">⚠️ Do not confuse the <em>R/W</em> bit (a protection) with the <em>D</em> bit (history of writing); and do not confuse <em>present</em> (in RAM) with <em>committed</em> (promised, slide 41). A committed page that was never touched has P = 0 until the first fault supplies a zero page.</p>`,
        `<p class="y-chinh">🎯 Hình 11-31: một <strong>mục bảng trang (PTE) cho trang đã ánh xạ trên Intel x86 và AMD x64</strong>. Mục 64 bit chứa: <strong>số trang vật lý</strong> (khung), và các bit cờ <strong>P</strong> (có mặt/hợp lệ), <strong>R/W</strong> (đọc/ghi), <strong>U/S</strong> (người dùng/giám sát), <strong>PWT</strong> (ghi xuyên trang), <strong>PCD</strong> (tắt cache trang), <strong>A</strong> (đã truy cập — "đã tham chiếu"), <strong>D</strong> (dơ — "đã sửa"), <strong>PAT</strong> (bảng thuộc tính trang), <strong>G</strong> (trang toàn cục), <strong>NX</strong> (không thực thi) và các bit <strong>AVL</strong> (dành cho HĐH).</p>
<p>PTE là mục trong "danh bạ" cho phần cứng biết trang nằm đâu và được làm gì. <strong>P</strong>: trang có đang ở trong RAM không? Nếu 0, mọi truy cập gây lỗi trang và HĐH quyết định làm gì. <strong>R/W</strong> và <strong>U/S</strong>: có ghi được không? mã người dùng có chạm được không? <strong>A</strong> và <strong>D</strong> do chính phần cứng đặt khi trang được đọc hay ghi — HĐH sau đó đọc chúng để quyết định trang nào rảnh (A = 0) và trang nào phải ghi xuống đĩa trước khi dùng lại (D = 1). <strong>NX</strong> là "không bao giờ chạy mã từ trang này" — nửa phần cứng của biện pháp ở slide 63.</p>
<p>Đây là <em>cùng các bit</em> mà bảng trang ở Chương 3 dùng trên mọi máy x86, kể cả Linux. Chương trình ở slide 40 giải mã một mục 64 bit mẫu đúng bố cục của hình: với <code>0x8000000012345027</code> nó in <em>khung 0x12345</em> và các cờ <code>P R/W U/S A</code> cộng <strong>NX</strong> — tức "có mặt, ghi được, người dùng truy cập được, đã được truy cập, không bao giờ thực thi, nằm ở khung vật lý 0x12345". Thử đổi hằng số thành <code>0x…67</code> (thêm bit D, 0x40) và xem "dơ" xuất hiện. Linux giải mã cùng mục trong <code>/proc/self/pagemap</code> (các bit có mặt, soft-dirty, độc quyền) và các hàm trợ giúp <code>pte_t</code> của nhân (<code>pte_dirty()</code>, <code>pte_young()</code>) được đặt tên theo các bit này.</p>
<p>Khi <strong>bit P bằng 0</strong>, phần cứng bỏ qua mọi bit khác — nên HĐH dùng lại chúng để lưu <em>trang thật sự ở đâu</em>: "trong tệp phân trang ở offset X", "điền số 0 theo yêu cầu", "chia sẻ với PTE nguyên mẫu Y". Mẹo đó là lý do một PTE "không có mặt" của trang bị swap ra vẫn cho Windows (hay định dạng swap entry của Linux) biết tìm dữ liệu thế nào.</p>
<p class="pitfall">⚠️ Đừng lẫn bit <em>R/W</em> (một sự bảo vệ) với bit <em>D</em> (lịch sử ghi); và đừng lẫn <em>có mặt</em> (trong RAM) với <em>committed</em> (được hứa, slide 41). Một trang committed chưa từng chạm có P = 0 cho tới khi lỗi đầu tiên cung cấp một trang số 0.</p>`],
      [44, 'Page Fault Handling (2)',
        `<p class="y-chinh">🎯 <strong>Categories of page faults</strong> (the book's list): <strong>(1)</strong> the page referenced is <em>not committed</em>; <strong>(2)</strong> attempted access to a page <em>in violation of the permissions</em>; <strong>(3)</strong> a shared <em>copy-on-write</em> page was about to be modified; <strong>(4)</strong> the <em>stack needs to grow</em>; <strong>(5)</strong> the page referenced is <em>committed but not currently mapped in</em>. Cases (1) and (2) are errors (the process gets an access-violation exception); (3), (4) and (5) are normal and invisible to the program.</p>
<p>Think of the five reasons a librarian may stop you at the desk. (1) You ask for a shelf that does not exist — error. (2) You try to write in a reference book — refused. (3) Two readers share one copy and one wants to write — the librarian photocopies <em>only that page</em> for him (copy-on-write). (4) You are stacking papers on a table and run out of room — the librarian slides in another table (stack growth). (5) The book exists but is in the basement — she fetches it (the page is in the paging file or the mapped file; "hard" if it needs disk, "soft" if it is already in memory on a list, slide 47).</p>
<p>Every case can be provoked on Linux and counted with <code>getrusage(2)</code>. The program below does (a) touch 8 never-touched pages (<strong>demand-zero</strong>, case 5's cousin), (b) fork and write in the child (<strong>copy-on-write</strong>, case 3), (c) recurse to force <strong>stack growth</strong> (case 4), (d) write to a read-only page (<strong>permission violation</strong>, case 2), and finally reports the <strong>major</strong> (disk) faults:</p>
<pre><code class="language-c">// The five page-fault categories of slide 44, each provoked on purpose and counted with getrusage(2)
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;unistd.h&gt;
#include &lt;stdlib.h&gt;

static long minflt(void) { struct rusage r; getrusage(RUSAGE_SELF, &amp;r); return r.ru_minflt; }
static long deep(int n) { volatile char pad[4096]; pad[0] = (char)n; return n ? deep(n - 1) + pad[0] : pad[0]; }

int main(void) {
    long f0;
    // (a) demand-zero: a committed page nobody touched yet
    char *p = mmap(NULL, 8 * 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(p, 8 * 4096, MADV_NOHUGEPAGE);
    f0 = minflt(); for (int i = 0; i &lt; 8; i++) p[i * 4096] = 1;
    printf("demand-zero page: %ld faults for 8 pages\\n", minflt() - f0);
    // (b) copy-on-write: after fork parent and child SHARE the pages read-only; the first write copies
    fflush(stdout);
    pid_t c = fork();
    if (c == 0) { f0 = minflt(); for (int i = 0; i &lt; 8; i++) p[i * 4096] = 2; printf("copy-on-write page: %ld faults for 8 pages written in the child\\n", minflt() - f0); fflush(stdout); _exit(0); }
    waitpid(c, NULL, 0);
    // (c) stack growth: touching new stack pages below the current limit
    f0 = minflt(); deep(40);
    printf("stack growth: %ld faults for ~40 new stack pages\\n", minflt() - f0);
    // (d) protection violation: write to a read-only page
    char *ro = mmap(NULL, 4096, PROT_READ, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    fflush(stdout);
    if (fork() == 0) { ro[0] = 1; _exit(0); }
    int st; wait(&amp;st);
    printf("write to read-only page: killed by signal %d\\n", WIFSIGNALED(st) ? WTERMSIG(st) : 0);
    // (e) page committed but not resident: a file page not yet in memory is read from disk (major fault)
    struct rusage r; getrusage(RUSAGE_SELF, &amp;r);
    printf("major (disk) faults so far in this process: %ld — everything above was served from memory\\n", r.ru_majflt);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread phan-loai-loi-trang.c -o phan-loai-loi-trang &amp;&amp; ./phan-loai-loi-trang<br>
demand-zero page: 8 faults for 8 pages<br>
copy-on-write page: 8 faults for 8 pages written in the child<br>
stack growth: 41 faults for ~40 new stack pages<br>
write to read-only page: killed by signal 11<br>
major (disk) faults so far in this process: 1 — everything above was served from memory</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>Eight demand-zero pages → <strong>8</strong> faults (one each); eight pages written after <code>fork</code> → <strong>8</strong> copy-on-write faults in the child (each first write allocated a private copy); forty new stack pages → <strong>41</strong> faults (growing the stack is just touching pages below the current limit); the write to a read-only page <strong>killed the process with SIGSEGV</strong>. The last line shows only <strong>1 major fault</strong> in the whole run: everything else was served from memory — the cost of a <em>minor</em> fault is on the order of a microsecond or less, a <em>major</em> one (disk) is thousands of times more (Chapter 3: milliseconds for a hard disk).</p>
<p><strong>How Windows names the cases in code.</strong> Windows distinguishes <em>hard faults</em> (the data must be read from disk) from <em>soft faults</em> (the page is already in memory on the standby or modified list, or is a demand-zero page, needing only a PTE fix) — the terms you meet in Resource Monitor ("Hard Faults/sec") and in Performance Monitor. A shared page that is <em>copy-on-write</em> is detected by a PTE flag and a <strong>prototype PTE</strong> (a PTE shared by all processes mapping the same section). In Linux terms: minor fault ≈ soft, major fault ≈ hard.</p>
<p class="pitfall">⚠️ An FE-style question: "<em>Which page fault is NOT an error?</em>" — copy-on-write, stack growth and "committed but not mapped" are normal; "not committed" and "permission violation" are errors that raise an exception. Also remember: a page fault is <em>not</em> always bad — a program that has never faulted has not touched any memory yet.</p>`,
        `<p class="y-chinh">🎯 <strong>Các loại lỗi trang</strong> (danh sách của sách): <strong>(1)</strong> trang được tham chiếu <em>chưa được commit</em>; <strong>(2)</strong> cố truy cập một trang <em>vi phạm quyền</em>; <strong>(3)</strong> một trang chia sẻ <em>copy-on-write</em> sắp bị sửa; <strong>(4)</strong> <em>stack cần lớn thêm</em>; <strong>(5)</strong> trang được tham chiếu <em>đã commit nhưng hiện chưa được ánh xạ vào</em>. Trường hợp (1) và (2) là lỗi (tiến trình nhận ngoại lệ vi phạm truy cập); (3), (4), (5) bình thường và vô hình với chương trình.</p>
<p>Hình dung năm lý do thủ thư chặn bạn ở quầy. (1) Bạn xin một kệ không tồn tại — lỗi. (2) Bạn cố viết lên sách tham khảo — bị từ chối. (3) Hai độc giả dùng chung một bản và một người muốn viết — thủ thư photo <em>chỉ trang đó</em> cho anh ta (copy-on-write). (4) Bạn xếp giấy lên bàn và hết chỗ — thủ thư kê thêm một bàn (stack lớn thêm). (5) Cuốn sách có nhưng nằm dưới hầm — cô đi lấy (trang ở tệp phân trang hay tệp ánh xạ; "cứng" nếu cần đĩa, "mềm" nếu đã ở trong bộ nhớ trên một danh sách, slide 47).</p>
<p>Mọi trường hợp đều gây ra được trên Linux và đếm bằng <code>getrusage(2)</code>. Chương trình dưới đây (a) chạm 8 trang chưa từng chạm (<strong>điền số 0 theo yêu cầu</strong>, họ hàng của trường hợp 5), (b) fork và ghi trong tiến trình con (<strong>copy-on-write</strong>, trường hợp 3), (c) đệ quy để ép <strong>stack lớn thêm</strong> (trường hợp 4), (d) ghi vào trang chỉ đọc (<strong>vi phạm quyền</strong>, trường hợp 2), và cuối cùng báo các lỗi <strong>lớn (major)</strong> (đĩa):</p>
<pre><code class="language-c">// Năm loại lỗi trang của slide 44, mỗi loại cố ý gây ra và đếm bằng getrusage(2)
#define _GNU_SOURCE
#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;sys/mman.h&gt;
#include &lt;sys/resource.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;unistd.h&gt;
#include &lt;stdlib.h&gt;

static long minflt(void) { struct rusage r; getrusage(RUSAGE_SELF, &amp;r); return r.ru_minflt; }
static long deep(int n) { volatile char pad[4096]; pad[0] = (char)n; return n ? deep(n - 1) + pad[0] : pad[0]; }

int main(void) {
    long f0;
    // (a) điền số 0 theo yêu cầu: trang đã commit mà chưa ai chạm
    char *p = mmap(NULL, 8 * 4096, PROT_READ | PROT_WRITE, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    madvise(p, 8 * 4096, MADV_NOHUGEPAGE);
    f0 = minflt(); for (int i = 0; i &lt; 8; i++) p[i * 4096] = 1;
    printf("demand-zero page: %ld faults for 8 pages\\n", minflt() - f0);
    // (b) copy-on-write: sau fork cha và con CHIA SẺ trang chỉ đọc; lần ghi đầu tiên sao chép
    fflush(stdout);
    pid_t c = fork();
    if (c == 0) { f0 = minflt(); for (int i = 0; i &lt; 8; i++) p[i * 4096] = 2; printf("copy-on-write page: %ld faults for 8 pages written in the child\\n", minflt() - f0); fflush(stdout); _exit(0); }
    waitpid(c, NULL, 0);
    // (c) stack lớn thêm: chạm trang stack mới dưới mức hiện tại
    f0 = minflt(); deep(40);
    printf("stack growth: %ld faults for ~40 new stack pages\\n", minflt() - f0);
    // (d) vi phạm quyền: ghi vào trang chỉ đọc
    char *ro = mmap(NULL, 4096, PROT_READ, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
    fflush(stdout);
    if (fork() == 0) { ro[0] = 1; _exit(0); }
    int st; wait(&amp;st);
    printf("write to read-only page: killed by signal %d\\n", WIFSIGNALED(st) ? WTERMSIG(st) : 0);
    // (e) trang đã commit nhưng không có trong RAM: trang tệp chưa vào bộ nhớ sẽ đọc từ đĩa (lỗi lớn)
    struct rusage r; getrusage(RUSAGE_SELF, &amp;r);
    printf("major (disk) faults so far in this process: %ld — everything above was served from memory\\n", r.ru_majflt);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread phan-loai-loi-trang.c -o phan-loai-loi-trang &amp;&amp; ./phan-loai-loi-trang<br>
demand-zero page: 8 faults for 8 pages<br>
copy-on-write page: 8 faults for 8 pages written in the child<br>
stack growth: 41 faults for ~40 new stack pages<br>
write to read-only page: killed by signal 11<br>
major (disk) faults so far in this process: 1 — everything above was served from memory</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Tám trang điền số 0 → <strong>8</strong> lỗi (mỗi trang một); tám trang ghi sau <code>fork</code> → <strong>8</strong> lỗi copy-on-write trong tiến trình con (mỗi lần ghi đầu tiên cấp một bản riêng); bốn mươi trang stack mới → <strong>41</strong> lỗi (stack lớn thêm chỉ là chạm trang dưới mức hiện tại); lần ghi vào trang chỉ đọc <strong>giết tiến trình bằng SIGSEGV</strong>. Dòng cuối cho thấy chỉ <strong>1 lỗi lớn</strong> trong cả lần chạy: mọi thứ khác phục vụ từ bộ nhớ — chi phí một lỗi <em>nhỏ</em> cỡ một micro giây hoặc ít hơn, một lỗi <em>lớn</em> (đĩa) gấp hàng nghìn lần (Chương 3: cỡ mili giây cho đĩa cứng).</p>
<p><strong>Windows gọi tên các trường hợp trong mã thế nào.</strong> Windows phân biệt <em>lỗi cứng (hard fault)</em> (dữ liệu phải đọc từ đĩa) với <em>lỗi mềm (soft fault)</em> (trang đã ở trong bộ nhớ trên danh sách standby hay modified, hoặc là trang điền số 0, chỉ cần sửa PTE) — các thuật ngữ bạn gặp trong Resource Monitor ("Hard Faults/sec") và Performance Monitor. Một trang chia sẻ <em>copy-on-write</em> được phát hiện bằng cờ PTE và một <strong>PTE nguyên mẫu (prototype PTE)</strong> (PTE chia sẻ bởi mọi tiến trình ánh xạ cùng một section). Theo thuật ngữ Linux: lỗi minor ≈ mềm, lỗi major ≈ cứng.</p>
<p class="pitfall">⚠️ Một câu kiểu FE: "<em>Lỗi trang nào KHÔNG phải là lỗi?</em>" — copy-on-write, stack lớn thêm và "đã commit nhưng chưa ánh xạ" là bình thường; "chưa commit" và "vi phạm quyền" là lỗi gây ngoại lệ. Cũng nhớ: lỗi trang <em>không</em> phải lúc nào cũng xấu — chương trình chưa từng gây lỗi trang là chưa chạm bộ nhớ nào.</p>`],
      [45, 'The Page Replacement Algorithm (1)',
        `<p class="y-chinh">🎯 Figure 11-32: the <strong>self-map</strong> trick. The page tables and page directory of the current process must be reachable by the kernel <em>through virtual addresses</em>, but the tables themselves are made of physical pages. Windows solves it by making <strong>one entry of the page directory point to the page directory itself</strong> (index <code>0x300</code>, address <code>0xC0300000</code> on 32-bit non-PAE x86). Then every PTE of the whole 4 GB space appears at a fixed place — a 4-MB window starting at <code>0xC0000000</code> — and the kernel computes the address of any PTE with a shift and an add.</p>
<p>Imagine a notebook that contains the instructions for finding every other notebook, and one of its own pages says "this notebook is notebook number 0x300 on the shelf". By always keeping that one page, you can read <em>any</em> notebook, including the index, through the same shelf-lookup rule — no special door needed.</p>
<p>Check it with arithmetic. For a 32-bit address <em>VA</em>, the PTE of that page sits at <code>0xC0000000 + (VA >> 12) × 4</code> (4-KB pages: the page number is VA >> 12; each PTE is 4 bytes), and the page-directory entry at <code>0xC0300000 + (VA >> 22) × 4</code>. For the figure's example <code>VA = 0xe4321000</code> the program of slide 40 prints PTE address <strong><code>0xc0390c84</code></strong> — exactly the number in Figure 11-32 — and PDE address <code>0xc0300e40</code>; and the self-map entry itself is <code>PD[0x300]</code>. This is the idea of a <em>recursive page-table mapping</em>, used by several operating systems (many hobby kernels use it too).</p>
<p><strong>➕ x64 Windows:</strong> there are four levels of tables (the book's figure is the 32-bit case, as its caption says: "shown for 32-bit PTEs"); the self-map still exists at one entry of the top-level table. Microsoft's own pages do not document where that entry sits (current Windows versions may randomise it as a hardening measure; I did not verify this against a Microsoft source, so treat it as "check Windows Internals"). Linux uses a different approach for kernel access to page tables — it has the whole physical memory mapped into the kernel's address space (the "direct map") and uses physical-to-virtual helper functions.</p>
<p class="pitfall">⚠️ The slide title says "Page Replacement Algorithm" but the figure is about <em>page-table access</em>, not replacement; the replacement discussion starts on slide 46. It is a misfiled figure in the deck — a good detail for a talk about "slide errors".</p>`,
        `<p class="y-chinh">🎯 Hình 11-32: mẹo <strong>tự ánh xạ (self-map)</strong>. Bảng trang và thư mục trang của tiến trình hiện tại phải tới được bởi nhân <em>qua địa chỉ ảo</em>, nhưng chính các bảng được tạo từ trang vật lý. Windows giải quyết bằng cách cho <strong>một mục của thư mục trang trỏ tới chính thư mục trang</strong> (chỉ số <code>0x300</code>, địa chỉ <code>0xC0300000</code> trên x86 32 bit không PAE). Khi đó mọi PTE của cả không gian 4 GB hiện ra ở một chỗ cố định — cửa sổ 4 MB bắt đầu ở <code>0xC0000000</code> — và nhân tính địa chỉ của bất kỳ PTE nào bằng một phép dịch và một phép cộng.</p>
<p>Hình dung một cuốn sổ chứa hướng dẫn tìm mọi cuốn sổ khác, và một trang của chính nó ghi "cuốn sổ này là cuốn số 0x300 trên kệ". Bằng cách luôn giữ trang đó, bạn đọc được <em>bất kỳ</em> cuốn sổ nào, kể cả mục lục, qua cùng quy tắc tra kệ — không cần cửa đặc biệt.</p>
<p>Kiểm bằng số học. Với địa chỉ 32 bit <em>VA</em>, PTE của trang đó nằm ở <code>0xC0000000 + (VA >> 12) × 4</code> (trang 4 KB: số trang là VA >> 12; mỗi PTE 4 byte), và mục thư mục trang ở <code>0xC0300000 + (VA >> 22) × 4</code>. Với ví dụ của hình <code>VA = 0xe4321000</code> chương trình ở slide 40 in địa chỉ PTE <strong><code>0xc0390c84</code></strong> — đúng con số trong Hình 11-32 — và địa chỉ PDE <code>0xc0300e40</code>; còn mục tự ánh xạ chính là <code>PD[0x300]</code>. Đây là ý tưởng <em>ánh xạ bảng trang đệ quy</em>, dùng bởi vài hệ điều hành (nhiều nhân tự chế cũng dùng).</p>
<p><strong>➕ Windows x64:</strong> có bốn tầng bảng (hình của sách là trường hợp 32 bit, như chú thích nói: "shown for 32-bit PTEs"); mục tự ánh xạ vẫn tồn tại ở một mục của bảng tầng trên cùng. Trang của Microsoft không tài liệu hoá mục đó nằm đâu (các bản Windows hiện tại có thể ngẫu nhiên hoá nó như một biện pháp gia cố; tôi không đối chiếu với nguồn Microsoft, nên hãy coi là "tra Windows Internals"). Linux dùng cách khác để nhân truy cập bảng trang — nó ánh xạ toàn bộ bộ nhớ vật lý vào không gian địa chỉ của nhân ("direct map") và dùng các hàm trợ giúp đổi vật lý-sang-ảo.</p>
<p class="pitfall">⚠️ Tiêu đề slide ghi "Page Replacement Algorithm" nhưng hình nói về <em>truy cập bảng trang</em>, không phải thay trang; phần bàn về thay trang bắt đầu ở slide 46. Đây là hình xếp nhầm chỗ trong bộ slide — chi tiết hay cho bài nói về "lỗi của slide".</p>`],
      [46, 'The Page Replacement Algorithm (2)',
        `<p class="y-chinh">🎯 The <strong>working-set manager</strong> works at three levels of activity: <strong>(1) lots of memory available</strong> — pages are simply added to working sets as needed, which grow freely; <strong>(2) memory getting tight</strong> — the manager starts to <em>trim</em> working sets (take pages away from processes that use more than their share), and a process that faults may now have to give a page back; <strong>(3) memory is tight</strong> — it trims aggressively, so processes keep only their most recently used pages. Replacement is <strong>local</strong> (per-process working sets) rather than one global clock.</p>
<p>Seat belts in a theatre. When the house is empty (level 1) everyone may spread out. When it fills (level 2) ushers ask people who took two seats to give one back. When it is packed (level 3) each person gets exactly one seat, and the usher always asks the one who has not moved the longest. The pages the usher takes away do not vanish: they go to the <em>standby/modified</em> lists, so if the person returns quickly (a <em>soft</em> fault) he gets the same seat back with no walk to the basement.</p>
<p>Chapter 3 gave you global algorithms (FIFO, LRU, clock). Windows mixes <strong>local</strong> policies and <strong>list-based caching</strong>. The simulator below is a deliberately simple model (not the Windows code): each process keeps a working set of 3 pages replaced FIFO; a page leaving the working set goes to a <em>standby list</em>. With <strong>no standby list</strong>, the reference string 1 2 3 4 1 2 5 1 2 3 4 5 (the famous Belady string, 3 frames) costs the textbook <strong>9</strong> faults, all of them disk reads:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/79e2ce21b61a56e4b1fd7a7f024d7cafd310346f.svg" alt="Working set of 3 pages, no standby list: 9 hard faults (the FIFO number from Chapter 3)" loading="lazy" /><p class="chu-thich">🧮 Working set of 3 pages, no standby list: 9 hard faults (the FIFO number from Chapter 3)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<p>Now give the process a standby list of 3 pages. Pages evicted from the working set are still in memory; touching them again is a <strong>soft fault</strong> — only the page table is fixed:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8c2f7b8758217056fa7ad4638e97902562197366.svg" alt="The same working set plus a standby list: 5 hard + 4 soft faults — only first-time references touch the disk" loading="lazy" /><p class="chu-thich">🧮 The same working set plus a standby list: 5 hard + 4 soft faults — only first-time references touch the disk</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<p>Five hard faults — one per <em>distinct</em> page (1, 2, 3, 4, 5) — and four soft ones. In this model the standby list turned four disk reads into four cheap fixes. That is the practical effect of the lists on slide 47–48: the cost of a bad eviction decision is small if the evicted page waits a while before being reused. Linux pursues the same goal with a global <em>active/inactive</em> LRU and the page cache (slide 47's <code>/proc/meminfo</code>).</p>
<p>A note on the figure for FE-style questions: the algorithm is <em>not</em> "FIFO" or "LRU" in the exam sense; the book calls it a <strong>working-set algorithm</strong> (per process, with a minimum and a maximum working-set size; it checks the accessed bits and ages pages). If a question asks for the Windows replacement policy, the safe answer is <em>"working-set based, local to each process, with standby/modified lists as a cache of recently trimmed pages"</em>.</p>
<p class="pitfall">⚠️ <strong>Soft faults are not free of cost but they are cheap</strong>; do not describe them as "no fault". The simulator counts them separately because Resource Monitor does the same: "Hard Faults/sec" is the number that correlates with a slow, thrashing machine, while thousands of soft faults per second are normal.</p>`,
        `<p class="y-chinh">🎯 <strong>Bộ quản lý tập làm việc (working-set manager)</strong> hoạt động ở ba mức: <strong>(1) nhiều bộ nhớ trống</strong> — trang chỉ việc được thêm vào tập làm việc khi cần, tập này lớn tự do; <strong>(2) bộ nhớ đang chật</strong> — bộ quản lý bắt đầu <em>tỉa (trim)</em> tập làm việc (lấy trang của tiến trình dùng nhiều hơn phần mình), và tiến trình gây lỗi giờ có thể phải trả lại một trang; <strong>(3) bộ nhớ chật</strong> — nó tỉa quyết liệt, nên tiến trình chỉ giữ các trang dùng gần nhất. Thay trang là <strong>cục bộ</strong> (tập làm việc theo tiến trình) chứ không phải một đồng hồ toàn cục.</p>
<p>Ghế trong rạp hát. Khi rạp vắng (mức 1) ai cũng ngồi thoải mái. Khi đầy dần (mức 2) người soát vé nhờ ai chiếm hai ghế trả lại một. Khi chật kín (mức 3) mỗi người đúng một ghế, và người soát vé luôn hỏi người lâu chưa nhúc nhích nhất. Những trang người soát vé lấy đi không biến mất: chúng vào danh sách <em>standby/modified</em>, nên nếu người đó quay lại nhanh (lỗi <em>mềm</em>) anh ta lấy lại đúng ghế đó mà không phải đi xuống hầm.</p>
<p>Chương 3 cho bạn các thuật toán toàn cục (FIFO, LRU, clock). Windows trộn chính sách <strong>cục bộ</strong> và <strong>bộ đệm dựa trên danh sách</strong>. Bộ mô phỏng dưới đây là mô hình cố ý đơn giản (không phải mã Windows): mỗi tiến trình giữ tập làm việc 3 trang thay FIFO; trang rời tập làm việc vào một <em>danh sách standby</em>. Với <strong>không có danh sách standby</strong>, chuỗi tham chiếu 1 2 3 4 1 2 5 1 2 3 4 5 (chuỗi Belady nổi tiếng, 3 khung) tốn <strong>9</strong> lỗi sách giáo khoa, tất cả là đọc đĩa:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3051dd7bf5b60eaf7dd79956c01a936e8b1742fd.svg" alt="Tập làm việc 3 trang, không có danh sách standby: 9 lỗi cứng (số FIFO của Chương 3)" loading="lazy" /><p class="chu-thich">🧮 Tập làm việc 3 trang, không có danh sách standby: 9 lỗi cứng (số FIFO của Chương 3)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<p>Giờ cho tiến trình một danh sách standby 3 trang. Trang bị đuổi khỏi tập làm việc vẫn ở trong bộ nhớ; chạm lại là <strong>lỗi mềm</strong> — chỉ sửa bảng trang:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a8572fbc39598c026b4e0fe7045a7b1b9fb32f58.svg" alt="Cùng tập làm việc cộng danh sách standby: 5 lỗi cứng + 4 lỗi mềm — chỉ lần tham chiếu đầu tiên mới chạm đĩa" loading="lazy" /><p class="chu-thich">🧮 Cùng tập làm việc cộng danh sách standby: 5 lỗi cứng + 4 lỗi mềm — chỉ lần tham chiếu đầu tiên mới chạm đĩa</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<p>Năm lỗi cứng — mỗi trang <em>khác nhau</em> một lỗi (1, 2, 3, 4, 5) — và bốn lỗi mềm. Trong mô hình này danh sách standby biến bốn lần đọc đĩa thành bốn lần sửa rẻ. Đó là hiệu quả thực tế của các danh sách ở slide 47–48: chi phí của một quyết định đuổi sai nhỏ nếu trang bị đuổi chờ một lúc trước khi dùng lại. Linux theo đuổi cùng mục tiêu bằng LRU <em>active/inactive</em> toàn cục và page cache (<code>/proc/meminfo</code> ở slide 47).</p>
<p>Lưu ý về hình cho câu hỏi kiểu FE: thuật toán <em>không</em> phải "FIFO" hay "LRU" theo nghĩa đề thi; sách gọi là <strong>thuật toán tập làm việc</strong> (theo tiến trình, có cỡ tập làm việc tối thiểu và tối đa; nó kiểm bit đã truy cập và làm già trang). Nếu câu hỏi hỏi chính sách thay trang của Windows, đáp án an toàn là <em>"dựa trên tập làm việc, cục bộ cho từng tiến trình, với danh sách standby/modified làm bộ đệm cho các trang vừa bị tỉa"</em>.</p>
<p class="pitfall">⚠️ <strong>Lỗi mềm không miễn phí nhưng rẻ</strong>; đừng mô tả chúng là "không lỗi". Bộ mô phỏng đếm riêng vì Resource Monitor cũng vậy: "Hard Faults/sec" là con số tương quan với máy chậm, bị thrashing, còn hàng nghìn lỗi mềm mỗi giây là bình thường.</p>`],
      [47, 'Physical Memory Management (1)',
        `<p class="y-chinh">🎯 Figure 11-33: the <strong>page frame database</strong> — one entry for <em>every physical page frame</em> in RAM, with fields such as <strong>State</strong> (Clean, Dirty, Active, Free, Zeroed …), <strong>Cnt</strong> (reference count), <strong>WS</strong> (which working set owns it), <strong>Other</strong>, <strong>PT</strong> (the page-table entry that maps it) and <strong>Next</strong> (link to the next frame in its list). On the left, <strong>list headers</strong> — <em>Standby</em>, <em>Modified</em>, <em>Free</em>, <em>Zeroed</em> — point at the first frame of each linked list; on the right, page tables point back to frames. Each frame sits on at most one list.</p>
<p>The page frame database is the hotel's <em>room register</em>: one line per room (frame), saying who occupies it (active, in which working set), or whether it is waiting on the cleaning list (modified: must be cleaned, i.e. written to disk), on the "freshly cleaned but still has the guest's belongings" list (standby: contents valid, can be reclaimed by the old guest), on the "empty, needs cleaning" list (free) or "ready, spotless" list (zeroed). The four <em>lists</em> are just the register's index cards stacked by category.</p>
<p>Linux has the same bookkeeping under another name: <code>struct page</code> (one per frame, <code>mem_map</code>) and the <strong>LRU lists</strong> (active/inactive × anonymous/file) plus the <strong>page cache</strong>. You can read their sizes live from <code>/proc/meminfo</code>:</p>
<div class="out"># Windows keeps pages on named lists (standby, modified, free, zeroed); Linux keeps active/inactive LRU lists and a page cache. /proc/meminfo is the dashboard<br>
$ grep -E '^(MemTotal|MemFree|MemAvailable|Cached|Dirty|Writeback|Active\\(anon\\)|Inactive\\(anon\\)|Active\\(file\\)|Inactive\\(file\\)|AnonPages|Mapped|Shmem|SwapTotal):' /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
MemFree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3263272 kB<br>
MemAvailable: &nbsp;&nbsp;&nbsp;4738140 kB<br>
Cached: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1762376 kB<br>
Active(anon): &nbsp;&nbsp;&nbsp;&nbsp;822776 kB<br>
Inactive(anon): &nbsp;1914544 kB<br>
Active(file): &nbsp;&nbsp;&nbsp;&nbsp;573580 kB<br>
Inactive(file): &nbsp;1005472 kB<br>
SwapTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048572 kB<br>
Dirty: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;148 kB<br>
Writeback: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 kB<br>
AnonPages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2391692 kB<br>
Mapped: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;584972 kB<br>
Shmem: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;308468 kB</div>
<p>How to read it as a Windows person: <code>MemFree</code> ≈ the <strong>free + zeroed</strong> lists; <code>Cached</code> and <code>Active/Inactive(file)</code> ≈ the <strong>standby</strong> list (clean file pages that can be reused or re-claimed — Windows shows the same thing as "Cached" in Task Manager); <code>Dirty</code> and <code>Writeback</code> ≈ the <strong>modified</strong> list; <code>AnonPages</code> and <code>Active/Inactive(anon)</code> ≈ pages in <strong>working sets</strong> backed by the paging file; <code>MemAvailable</code> is Linux's estimate of "free + reclaimable" — what Windows 8's Task Manager calls <em>Available</em>. The Linux machine of this lab has 8 GB of RAM, of which only 3 GB are truly free; the rest is used by caches that can be dropped instantly — the same reason a healthy Windows PC shows "90% memory used" and runs fine.</p>
<p class="pitfall">⚠️ "<em>Free memory is wasted memory</em>" — both systems deliberately fill RAM with cached file pages (standby / page cache) because unused RAM does nothing; they give it back at once when a program needs it. A monitoring alert "RAM > 90%" is meaningless without asking <em>how much of it is reclaimable cache</em> (Linux: <code>MemAvailable</code>; Windows: <em>Available</em> or Standby).</p>
<div class="callout">🧭 <strong>On a real server:</strong> in the Docker/Kubernetes world, "memory used by the container" includes the page cache of files it read; a database container can look "full" while healthy. Set limits and alerts on the <em>working set</em> (the <code>memory.current</code> minus reclaimable cache in cgroup v2; Kubernetes reports it as <code>container_memory_working_set_bytes</code> — the same term Windows uses).</div>`,
        `<p class="y-chinh">🎯 Hình 11-33: <strong>cơ sở dữ liệu khung trang (page frame database)</strong> — một mục cho <em>mỗi khung trang vật lý</em> trong RAM, với các trường như <strong>State</strong> (Clean, Dirty, Active, Free, Zeroed …), <strong>Cnt</strong> (bộ đếm tham chiếu), <strong>WS</strong> (tập làm việc nào sở hữu), <strong>Other</strong>, <strong>PT</strong> (mục bảng trang ánh xạ nó) và <strong>Next</strong> (liên kết tới khung kế trong danh sách). Bên trái, các <strong>đầu danh sách</strong> — <em>Standby</em>, <em>Modified</em>, <em>Free</em>, <em>Zeroed</em> — trỏ tới khung đầu của mỗi danh sách liên kết; bên phải, bảng trang trỏ ngược về khung. Mỗi khung nằm trên nhiều nhất một danh sách.</p>
<p>Cơ sở dữ liệu khung trang là <em>sổ đăng ký phòng</em> của khách sạn: một dòng mỗi phòng (khung), ghi ai đang ở (active, trong tập làm việc nào), hay phòng đang chờ trên danh sách dọn dẹp (modified: phải dọn, tức ghi xuống đĩa), trên danh sách "vừa dọn nhưng còn đồ của khách" (standby: nội dung hợp lệ, khách cũ lấy lại được), trên danh sách "trống, cần dọn" (free) hay "sẵn sàng, sạch bong" (zeroed). Bốn <em>danh sách</em> chỉ là các thẻ mục lục của sổ xếp theo loại.</p>
<p>Linux có cùng sổ sách dưới tên khác: <code>struct page</code> (một cái cho mỗi khung, <code>mem_map</code>) và các <strong>danh sách LRU</strong> (active/inactive × ẩn danh/tệp) cộng <strong>page cache</strong>. Bạn đọc cỡ của chúng trực tiếp từ <code>/proc/meminfo</code>:</p>
<div class="out"># Windows giữ trang trên các danh sách có tên (standby, modified, free, zeroed); Linux giữ danh sách LRU active/inactive và page cache. /proc/meminfo là bảng đồng hồ<br>
$ grep -E '^(MemTotal|MemFree|MemAvailable|Cached|Dirty|Writeback|Active\\(anon\\)|Inactive\\(anon\\)|Active\\(file\\)|Inactive\\(file\\)|AnonPages|Mapped|Shmem|SwapTotal):' /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
MemFree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3263272 kB<br>
MemAvailable: &nbsp;&nbsp;&nbsp;4738140 kB<br>
Cached: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1762376 kB<br>
Active(anon): &nbsp;&nbsp;&nbsp;&nbsp;822776 kB<br>
Inactive(anon): &nbsp;1914544 kB<br>
Active(file): &nbsp;&nbsp;&nbsp;&nbsp;573580 kB<br>
Inactive(file): &nbsp;1005472 kB<br>
SwapTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1048572 kB<br>
Dirty: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;148 kB<br>
Writeback: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 kB<br>
AnonPages: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2391692 kB<br>
Mapped: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;584972 kB<br>
Shmem: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;308468 kB</div>
<p>Cách đọc theo kiểu người Windows: <code>MemFree</code> ≈ danh sách <strong>free + zeroed</strong>; <code>Cached</code> và <code>Active/Inactive(file)</code> ≈ danh sách <strong>standby</strong> (trang tệp sạch có thể dùng lại hay đòi lại — Windows hiện cùng thứ đó là "Cached" trong Task Manager); <code>Dirty</code> và <code>Writeback</code> ≈ danh sách <strong>modified</strong>; <code>AnonPages</code> và <code>Active/Inactive(anon)</code> ≈ trang trong <strong>tập làm việc</strong> có tệp phân trang đỡ; <code>MemAvailable</code> là ước lượng của Linux về "trống + thu hồi được" — thứ Task Manager của Windows 8 gọi là <em>Available</em>. Máy Linux của lab này có 8 GB RAM, trong đó chỉ 3 GB thật sự trống; phần còn lại do các bộ đệm có thể bỏ ngay — cùng lý do một PC Windows khoẻ mạnh hiện "dùng 90% bộ nhớ" mà vẫn chạy tốt.</p>
<p class="pitfall">⚠️ "<em>Bộ nhớ trống là bộ nhớ lãng phí</em>" — cả hai hệ cố ý lấp RAM bằng trang tệp được đệm (standby / page cache) vì RAM không dùng chẳng làm gì; chúng trả lại ngay khi chương trình cần. Một cảnh báo giám sát "RAM > 90%" là vô nghĩa nếu không hỏi <em>bao nhiêu trong đó là bộ đệm thu hồi được</em> (Linux: <code>MemAvailable</code>; Windows: <em>Available</em> hay Standby).</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> trong thế giới Docker/Kubernetes, "bộ nhớ container dùng" gồm cả page cache của các tệp nó đã đọc; container cơ sở dữ liệu có thể trông "đầy" mà vẫn khoẻ. Đặt giới hạn và cảnh báo trên <em>tập làm việc (working set)</em> (<code>memory.current</code> trừ bộ đệm thu hồi được trong cgroup v2; Kubernetes báo là <code>container_memory_working_set_bytes</code> — chính thuật ngữ Windows dùng).</div>`],
      [48, 'Physical Memory Management (2)',
        `<p class="y-chinh">🎯 Figure 11-34: the <strong>various page lists and the transitions between them</strong>, numbered (1)–(8): <strong>(1)</strong> a page is evicted from all working sets (to the <em>modified</em> list if dirty, to <em>standby</em> if clean); <strong>(2)</strong> a <em>soft page fault</em> brings it back to a working set; <strong>(3)</strong> process exit — its pages go to the <em>free</em> list; <strong>(4)</strong> the <em>modified page writer</em> writes dirty pages out, moving them to standby; <strong>(5)</strong> <em>dealloc</em> — a standby page is repurposed and goes to free; <strong>(6)</strong> a page is referenced — a free page can be handed to a working set; <strong>(7)</strong> the <em>zero page thread</em> turns free pages into zeroed pages; <strong>(8)</strong> a zero page is needed (demand-zero). A separate <em>bad memory page list</em> holds frames with errors.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e130bd441526a53fad0868d924bd01021a1d8923.svg" alt="Figure 11-34 as a state diagram: working set → modified/standby → free → zeroed → working set, with the soft-fault shortcut" loading="lazy" /><p class="chu-thich">🧩 Figure 11-34 as a state diagram: working set → modified/standby → free → zeroed → working set, with the soft-fault shortcut</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figure 11-34: the lives of a physical page frame: working set -&gt; standby / modified -&gt; free -&gt; zeroed -&gt; working set
state "Working set\\n(in a process)" as WS
state "Modified list\\n(dirty, must be written)" as MOD
state "Standby list\\n(clean, content still valid)" as SB
state "Free list\\n(content stale)" as FREE
state "Zeroed list\\n(all zero, ready)" as ZERO
state "Bad list\\n(failing RAM)" as BAD
[*] --&gt; FREE
WS --&gt; MOD : (1) trimmed from working set,\\npage is dirty
WS --&gt; SB : (1) trimmed, page is clean
WS --&gt; FREE : (3) process exits
SB --&gt; WS : (2) SOFT fault:\\npage referenced again, no disk
MOD --&gt; WS : (2) soft fault
MOD --&gt; SB : (4) modified-page writer\\nwrites it to disk
SB --&gt; FREE : (5) dealloc: frame needed\\nfor other use
FREE --&gt; ZERO : (7) zero-page thread\\n(priority 0 — runs when idle)
FREE --&gt; WS : (6) page needed\\n(contents will be overwritten)
ZERO --&gt; WS : (8) zero page needed\\n(demand-zero fault)
FREE --&gt; BAD
@enduml</code></pre></details>
<p>Follow one page through its life: a program allocates and touches memory → the kernel takes a page from the <strong>zeroed</strong> list (8) and puts it in the working set (the page must be zero so you never see old data). The program stops using it → working-set trimming moves it to <strong>modified</strong> (dirty) (1). The <strong>modified page writer</strong> thread writes it to the paging file → it moves to <strong>standby</strong> (4). If the program touches it now → soft fault (2), straight back. If instead memory is needed elsewhere → the page leaves standby for <strong>free</strong> (5). The <strong>zero-page thread</strong> — the lowest-priority thread in the system, priority 0, which runs only when nothing else wants the CPU (slide 38) — turns it into <strong>zeroed</strong> (7), ready to start again. The cycle is closed.</p>
<p><strong>➕ Section 11.6 — the cache manager (not in the deck; source: Microsoft Learn, "File Caching").</strong> Windows keeps file data in the <em>system file cache</em>, managed by the <strong>cache manager</strong>. It is a <em>write-back</em> cache: "write operations write file data to the system file cache rather than to the disk"; the policy of delaying the disk write is <strong>lazy writing</strong>. Concretely, "a 256 KB region of data is read into a 256 KB cache <em>slot</em> in system address space"; the cache manager "spawns a process every second called a <strong>lazy writer</strong>" that "queues <strong>one-eighth</strong> of the pages that have not been flushed recently to be written to disk". Programs can bypass it: <code>FILE_FLAG_NO_BUFFERING</code> (read/write go straight to disk — database engines use this), <code>FILE_FLAG_WRITE_THROUGH</code> (write the cache <em>and</em> disk immediately), or call <code>FlushFileBuffers</code>. Remember the design: the cache is built <em>on top of</em> the memory manager — a cached file is mapped into the system cache's address range, so reading a cached file is just a (soft) page fault.</p>
<p>The Linux cousin is the <strong>page cache</strong> with write-back controlled by <code>vm.dirty_*</code> settings and the <code>fsync()</code> family: <code>O_DIRECT</code> ≈ <code>NO_BUFFERING</code>, <code>O_SYNC</code> ≈ <code>WRITE_THROUGH</code>, <code>fsync()</code> ≈ <code>FlushFileBuffers</code>. This is the root of the famous <em>durability</em> question for databases: PostgreSQL calls <code>fsync</code> (on Windows <code>FlushFileBuffers</code>) before saying "COMMIT done"; without it a power cut loses "committed" data still sitting in the cache.</p>
<p class="pitfall">⚠️ Two lists often confused in quizzes: <strong>Modified</strong> = dirty, <em>must</em> be written before reuse; <strong>Standby</strong> = clean, can be reused immediately <em>or</em> reclaimed back by its old owner. Also: the zeroed list exists for <em>security and speed</em> (a demand-zero fault gets a ready page), not for caching file data.</p>`,
        `<p class="y-chinh">🎯 Hình 11-34: <strong>các danh sách trang và chuyển đổi giữa chúng</strong>, đánh số (1)–(8): <strong>(1)</strong> một trang bị đuổi khỏi mọi tập làm việc (vào danh sách <em>modified</em> nếu dơ, vào <em>standby</em> nếu sạch); <strong>(2)</strong> một <em>lỗi trang mềm</em> đưa nó về tập làm việc; <strong>(3)</strong> tiến trình thoát — trang của nó vào danh sách <em>free</em>; <strong>(4)</strong> <em>modified page writer</em> ghi trang dơ ra, chuyển chúng sang standby; <strong>(5)</strong> <em>dealloc</em> — trang standby được dùng vào việc khác và chuyển sang free; <strong>(6)</strong> một trang được tham chiếu — trang free có thể giao cho một tập làm việc; <strong>(7)</strong> <em>luồng zero page</em> biến trang free thành trang zeroed; <strong>(8)</strong> cần một trang số 0 (điền số 0 theo yêu cầu). Một <em>danh sách trang bộ nhớ hỏng</em> riêng giữ các khung bị lỗi.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/e130bd441526a53fad0868d924bd01021a1d8923.svg" alt="Hình 11-34 dạng sơ đồ trạng thái: tập làm việc → modified/standby → free → zeroed → tập làm việc, kèm đường tắt lỗi mềm" loading="lazy" /><p class="chu-thich">🧩 Hình 11-34 dạng sơ đồ trạng thái: tập làm việc → modified/standby → free → zeroed → tập làm việc, kèm đường tắt lỗi mềm</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-34: vòng đời của một khung trang vật lý: tập làm việc -&gt; standby / modified -&gt; free -&gt; zeroed -&gt; tập làm việc
state "Working set\\n(in a process)" as WS
state "Modified list\\n(dirty, must be written)" as MOD
state "Standby list\\n(clean, content still valid)" as SB
state "Free list\\n(content stale)" as FREE
state "Zeroed list\\n(all zero, ready)" as ZERO
state "Bad list\\n(failing RAM)" as BAD
[*] --&gt; FREE
WS --&gt; MOD : (1) trimmed from working set,\\npage is dirty
WS --&gt; SB : (1) trimmed, page is clean
WS --&gt; FREE : (3) process exits
SB --&gt; WS : (2) SOFT fault:\\npage referenced again, no disk
MOD --&gt; WS : (2) soft fault
MOD --&gt; SB : (4) modified-page writer\\nwrites it to disk
SB --&gt; FREE : (5) dealloc: frame needed\\nfor other use
FREE --&gt; ZERO : (7) zero-page thread\\n(priority 0 — runs when idle)
FREE --&gt; WS : (6) page needed\\n(contents will be overwritten)
ZERO --&gt; WS : (8) zero page needed\\n(demand-zero fault)
FREE --&gt; BAD
@enduml</code></pre></details>
<p>Lần theo một trang trong vòng đời: chương trình cấp phát và chạm bộ nhớ → nhân lấy một trang từ danh sách <strong>zeroed</strong> (8) và đặt vào tập làm việc (trang phải là số 0 để bạn không bao giờ thấy dữ liệu cũ). Chương trình ngừng dùng → việc tỉa tập làm việc chuyển nó sang <strong>modified</strong> (dơ) (1). Luồng <strong>modified page writer</strong> ghi nó vào tệp phân trang → nó sang <strong>standby</strong> (4). Nếu chương trình chạm vào lúc này → lỗi mềm (2), quay về ngay. Nếu thay vào đó nơi khác cần bộ nhớ → trang rời standby sang <strong>free</strong> (5). <strong>Luồng zero-page</strong> — luồng ưu tiên thấp nhất hệ thống, ưu tiên 0, chỉ chạy khi không gì khác muốn CPU (slide 38) — biến nó thành <strong>zeroed</strong> (7), sẵn sàng bắt đầu lại. Vòng đời khép kín.</p>
<p><strong>➕ Mục 11.6 — cache manager (không có trong deck; nguồn: Microsoft Learn, "File Caching").</strong> Windows giữ dữ liệu tệp trong <em>bộ đệm tệp hệ thống (system file cache)</em>, do <strong>cache manager</strong> quản lý. Đó là bộ đệm <em>ghi trễ (write-back)</em>: "thao tác ghi ghi dữ liệu tệp vào bộ đệm tệp hệ thống thay vì đĩa"; chính sách trì hoãn ghi đĩa là <strong>lazy writing</strong>. Cụ thể, "một vùng dữ liệu 256 KB được đọc vào một <em>ô (slot)</em> bộ đệm 256 KB trong không gian địa chỉ hệ thống"; cache manager "sinh một tiến trình mỗi giây gọi là <strong>lazy writer</strong>" "xếp <strong>một phần tám</strong> số trang chưa được xả gần đây để ghi xuống đĩa". Chương trình có thể bỏ qua nó: <code>FILE_FLAG_NO_BUFFERING</code> (đọc/ghi đi thẳng đĩa — engine cơ sở dữ liệu dùng), <code>FILE_FLAG_WRITE_THROUGH</code> (ghi bộ đệm <em>và</em> đĩa ngay), hay gọi <code>FlushFileBuffers</code>. Nhớ thiết kế: bộ đệm được dựng <em>trên</em> bộ quản lý bộ nhớ — tệp được đệm được ánh xạ vào dải địa chỉ của bộ đệm hệ thống, nên đọc tệp đã đệm chỉ là một lỗi trang (mềm).</p>
<p>Họ hàng Linux là <strong>page cache</strong> với ghi trễ điều khiển bởi các cài đặt <code>vm.dirty_*</code> và họ <code>fsync()</code>: <code>O_DIRECT</code> ≈ <code>NO_BUFFERING</code>, <code>O_SYNC</code> ≈ <code>WRITE_THROUGH</code>, <code>fsync()</code> ≈ <code>FlushFileBuffers</code>. Đây là gốc của câu hỏi nổi tiếng về <em>độ bền</em> với cơ sở dữ liệu: PostgreSQL gọi <code>fsync</code> (trên Windows là <code>FlushFileBuffers</code>) trước khi nói "COMMIT xong"; thiếu nó thì mất điện làm mất dữ liệu "đã commit" còn nằm trong bộ đệm.</p>
<p class="pitfall">⚠️ Hai danh sách hay bị lẫn trong câu trắc nghiệm: <strong>Modified</strong> = dơ, <em>phải</em> ghi trước khi dùng lại; <strong>Standby</strong> = sạch, dùng lại được ngay <em>hoặc</em> chủ cũ đòi lại được. Cũng nhớ: danh sách zeroed có vì <em>bảo mật và tốc độ</em> (một lỗi điền-số-0 nhận được trang sẵn), không phải để đệm dữ liệu tệp.</p>`],
      [49, 'Input/Output API Calls',
        `<p class="y-chinh">🎯 Figure 11-35: the <strong>native NT calls for I/O</strong> — <code>NtCreateFile</code> (open new or existing files or devices), <code>NtReadFile</code>, <code>NtWriteFile</code>, <code>NtQueryDirectoryFile</code>, <code>NtQueryVolumeInformationFile</code>, <code>NtSetVolumeInformationFile</code>, <code>NtNotifyChangeDirectoryFile</code> (complete when anything in the directory or sub-tree changes), <code>NtQueryInformationFile</code>, <code>NtSetInformationFile</code>, <code>NtLockFile</code>, <code>NtUnlockFile</code>, <code>NtFsControlFile</code> (miscellaneous operations on a file), <code>NtFlushBuffersFile</code>, <code>NtCancelIoFile</code>, <code>NtDeviceIoControlFile</code> (special operations on a device). In the Win32 layer these become <code>CreateFile</code>, <code>ReadFile</code>, <code>WriteFile</code>, <code>FindFirstFile</code>, <code>ReadDirectoryChangesW</code>, <code>LockFile</code>, <code>DeviceIoControl</code>, <code>CancelIo</code> and friends.</p>
<p>Two design points stand out. First, <strong>one verb for files and devices</strong>: <code>NtCreateFile</code> opens a file, a disk, a serial port or a named pipe — the result is always a handle you read and write. Second, <strong>I/O is asynchronous by design</strong>: any of these calls can be issued in <em>overlapped</em> mode (<code>FILE_FLAG_OVERLAPPED</code>), returning at once while the I/O manager completes the request later and reports it — through an event, a callback, or an <strong>I/O completion port (IOCP)</strong>. <code>DeviceIoControl</code> / <code>ioctl</code> is the escape hatch for everything that does not fit read/write (formatting a disk, reading S.M.A.R.T., sending a command to a USB device).</p>
<p><strong>IOCP in one paragraph</strong> (Microsoft, "I/O Completion Ports"): you create a completion port, associate file or socket handles with it, start overlapped operations, and a <em>small pool of threads</em> calls <code>GetQueuedCompletionStatus</code> to receive finished operations. "When a completion packet is queued … if the number of threads running is less than the <em>concurrency value</em>, one of the waiting threads (the most recent one) is allowed to process it"; waiting threads are released in <em>last-in-first-out</em> order (keeping caches warm); the recommended concurrency value is "the number of CPUs". Microsoft also says the thread-pool I/O API (<code>CreateThreadpoolIo</code>) is simpler "for new code that doesn't need manual thread control", and uses IOCP internally. IOCP is the reason one Windows process can serve tens of thousands of connections with a handful of threads — it is IIS's and .NET's engine.</p>
<p>The Linux model is the mirror image: <strong>readiness notification</strong>. With <code>epoll</code> you ask "tell me <em>when this socket is ready</em> to read", then you call <code>read</code> yourself; with IOCP the system <em>performs</em> the read and tells you "it is <em>done</em>". (Linux's newer <code>io_uring</code> adds a true completion model.) <strong>Node.js hides the difference</strong>: libuv's documentation says its polling backends are "epoll on Linux, kqueue on OSX and other BSDs, event ports on SunOS and IOCP on Windows". See the Linux side live:</p>
<pre><code class="language-javascript">// Node's event loop sits on epoll (Linux); on Windows the same libuv code sits on IOCP
const fs = require('fs');
const net = require('net');
const server = net.createServer(() =&gt; {}).listen(0, '127.0.0.1', () =&gt; {
  setTimeout(() =&gt; {
    const kinds = new Set();
    for (const fd of fs.readdirSync('/proc/self/fd')) {
      try { kinds.add(fs.readlinkSync('/proc/self/fd/' + fd).replace(/:\\[\\d+\\]/, '')); } catch {}
    }
    const interesting = [...kinds].filter((k) =&gt; /anon_inode|socket|pipe|eventfd|eventpoll/.test(k)).sort();
    console.log('descriptor kinds held by this Node process:', interesting.join(', '));
    const threads = fs.readdirSync('/proc/self/task').length;
    console.log('threads in the process:', threads, '(main thread + V8 platform workers + libuv pool starts lazily)');
    server.close();
  }, 50);
});</code></pre>
<div class="out">$ node epoll-node.js<br>
descriptor kinds held by this Node process: anon_inode:[eventfd], anon_inode:[eventpoll], pipe, socket<br>
threads in the process: 7 (main thread + V8 platform workers + libuv pool starts lazily)</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The Node process holds an <code>anon_inode:[eventpoll]</code> descriptor (the epoll instance — the event loop's heart), an <code>eventfd</code> (to wake the loop from other threads), a pipe, and the listening <code>socket</code>; and it already has several threads (V8's platform workers and, when used, libuv's pool). Your <code>async/await</code> JavaScript code sits on top of exactly this — on Windows the same program would show an IOCP handle instead.</p>
<table>
<thead><tr><th>Aspect</th><th>Windows IOCP</th><th>Linux epoll</th></tr></thead>
<tbody>
<tr><td>model</td><td>completion ("your read is done")</td><td>readiness ("you may read now")</td></tr>
<tr><td>who does the I/O</td><td>the kernel, in the background</td><td>your thread, after the notification</td></tr>
<tr><td>thread pool</td><td>built-in design (concurrency value)</td><td>you build it (or use libuv/Netty)</td></tr>
<tr><td>used by</td><td>IIS, .NET sockets on Windows, libuv on Windows</td><td>Nginx, Node.js, Netty/Java NIO on Linux</td></tr>
<tr><td>newer cousin</td><td>thread-pool I/O API</td><td>io_uring (completion model)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ An FE-style slip: "epoll and IOCP are the same". They solve the same problem (many connections, few threads) with <strong>opposite</strong> models (readiness vs completion). Another slip: "asynchronous I/O means multithreaded" — async I/O can be done by one thread (Node) or by a pool (IOCP workers); the asynchrony is in <em>not waiting</em>, not in the thread count.</p>`,
        `<p class="y-chinh">🎯 Hình 11-35: các <strong>lời gọi NT gốc cho I/O</strong> — <code>NtCreateFile</code> (mở tệp hay thiết bị mới hoặc có sẵn), <code>NtReadFile</code>, <code>NtWriteFile</code>, <code>NtQueryDirectoryFile</code>, <code>NtQueryVolumeInformationFile</code>, <code>NtSetVolumeInformationFile</code>, <code>NtNotifyChangeDirectoryFile</code> (hoàn thành khi có gì trong thư mục hay cây con thay đổi), <code>NtQueryInformationFile</code>, <code>NtSetInformationFile</code>, <code>NtLockFile</code>, <code>NtUnlockFile</code>, <code>NtFsControlFile</code> (các thao tác tạp trên tệp), <code>NtFlushBuffersFile</code>, <code>NtCancelIoFile</code>, <code>NtDeviceIoControlFile</code> (thao tác đặc biệt trên thiết bị). Ở tầng Win32 chúng thành <code>CreateFile</code>, <code>ReadFile</code>, <code>WriteFile</code>, <code>FindFirstFile</code>, <code>ReadDirectoryChangesW</code>, <code>LockFile</code>, <code>DeviceIoControl</code>, <code>CancelIo</code> và các bạn.</p>
<p>Hai điểm thiết kế nổi bật. Một, <strong>một động từ cho tệp và thiết bị</strong>: <code>NtCreateFile</code> mở tệp, đĩa, cổng nối tiếp hay named pipe — kết quả luôn là một handle để đọc và ghi. Hai, <strong>I/O bất đồng bộ từ thiết kế</strong>: bất kỳ lời gọi nào cũng phát được ở chế độ <em>overlapped</em> (<code>FILE_FLAG_OVERLAPPED</code>), trả về ngay trong khi I/O manager hoàn thành yêu cầu sau và báo — qua một event, một callback, hay một <strong>I/O completion port (IOCP)</strong>. <code>DeviceIoControl</code> / <code>ioctl</code> là cửa thoát cho mọi thứ không vừa với đọc/ghi (định dạng đĩa, đọc S.M.A.R.T., gửi lệnh cho thiết bị USB).</p>
<p><strong>IOCP trong một đoạn</strong> (Microsoft, "I/O Completion Ports"): bạn tạo một completion port, gắn handle tệp hay socket vào nó, khởi động các thao tác overlapped, và một <em>nhóm luồng nhỏ</em> gọi <code>GetQueuedCompletionStatus</code> để nhận các thao tác đã xong. "Khi một completion packet được xếp vào … nếu số luồng đang chạy ít hơn <em>giá trị đồng thời (concurrency value)</em>, một trong các luồng đang chờ (luồng gần nhất) được phép xử lý nó"; các luồng chờ được thả theo thứ tự <em>vào-sau-ra-trước (LIFO)</em> (giữ bộ đệm CPU còn ấm); giá trị đồng thời khuyến nghị là "số CPU". Microsoft cũng nói API I/O của thread pool (<code>CreateThreadpoolIo</code>) đơn giản hơn "cho mã mới không cần điều khiển luồng thủ công", và dùng IOCP bên trong. IOCP là lý do một tiến trình Windows phục vụ được hàng chục nghìn kết nối với vài luồng — nó là động cơ của IIS và .NET.</p>
<p>Mô hình Linux là ảnh phản chiếu: <strong>thông báo sẵn sàng (readiness)</strong>. Với <code>epoll</code> bạn hỏi "báo tôi <em>khi socket này sẵn sàng</em> để đọc", rồi tự gọi <code>read</code>; với IOCP hệ thống <em>thực hiện</em> việc đọc và báo "nó <em>xong rồi</em>". (<code>io_uring</code> mới hơn của Linux thêm mô hình hoàn thành thật sự.) <strong>Node.js che giấu sự khác biệt</strong>: tài liệu libuv nói các backend thăm dò của nó là "epoll trên Linux, kqueue trên OSX và các BSD khác, event ports trên SunOS và IOCP trên Windows". Xem phía Linux trực tiếp:</p>
<pre><code class="language-javascript">// Vòng lặp sự kiện của Node nằm trên epoll (Linux); trên Windows cùng mã libuv đó nằm trên IOCP
const fs = require('fs');
const net = require('net');
const server = net.createServer(() =&gt; {}).listen(0, '127.0.0.1', () =&gt; {
  setTimeout(() =&gt; {
    const kinds = new Set();
    for (const fd of fs.readdirSync('/proc/self/fd')) {
      try { kinds.add(fs.readlinkSync('/proc/self/fd/' + fd).replace(/:\\[\\d+\\]/, '')); } catch {}
    }
    const interesting = [...kinds].filter((k) =&gt; /anon_inode|socket|pipe|eventfd|eventpoll/.test(k)).sort();
    console.log('descriptor kinds held by this Node process:', interesting.join(', '));
    const threads = fs.readdirSync('/proc/self/task').length;
    console.log('threads in the process:', threads, '(main thread + V8 platform workers + libuv pool starts lazily)');
    server.close();
  }, 50);
});</code></pre>
<div class="out">$ node epoll-node.js<br>
descriptor kinds held by this Node process: anon_inode:[eventfd], anon_inode:[eventpoll], pipe, socket<br>
threads in the process: 7 (main thread + V8 platform workers + libuv pool starts lazily)</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Tiến trình Node giữ một descriptor <code>anon_inode:[eventpoll]</code> (thể hiện epoll — trái tim của vòng lặp sự kiện), một <code>eventfd</code> (để đánh thức vòng lặp từ luồng khác), một pipe, và <code>socket</code> đang lắng nghe; và nó đã có vài luồng (các worker nền tảng của V8 và, khi dùng, pool của libuv). Mã JavaScript <code>async/await</code> của bạn ngồi trên đúng thứ này — trên Windows cùng chương trình sẽ hiện một handle IOCP thay thế.</p>
<table>
<thead><tr><th>Khía cạnh</th><th>IOCP Windows</th><th>epoll Linux</th></tr></thead>
<tbody>
<tr><td>mô hình</td><td>hoàn thành ("việc đọc của bạn xong rồi")</td><td>sẵn sàng ("bạn đọc được rồi")</td></tr>
<tr><td>ai làm I/O</td><td>nhân, ở nền</td><td>luồng của bạn, sau thông báo</td></tr>
<tr><td>thread pool</td><td>thiết kế có sẵn (giá trị đồng thời)</td><td>bạn tự dựng (hay dùng libuv/Netty)</td></tr>
<tr><td>dùng bởi</td><td>IIS, socket .NET trên Windows, libuv trên Windows</td><td>Nginx, Node.js, Netty/Java NIO trên Linux</td></tr>
<tr><td>họ hàng mới</td><td>API I/O của thread pool</td><td>io_uring (mô hình hoàn thành)</td></tr>
</tbody>
</table>
<p class="pitfall">⚠️ Một cú trượt kiểu FE: "epoll và IOCP là một". Chúng giải cùng bài toán (nhiều kết nối, ít luồng) bằng các mô hình <strong>ngược nhau</strong> (sẵn sàng so với hoàn thành). Một cú trượt khác: "I/O bất đồng bộ nghĩa là đa luồng" — I/O bất đồng bộ làm được bằng một luồng (Node) hay một nhóm (worker IOCP); tính bất đồng bộ nằm ở <em>không phải chờ</em>, không ở số luồng.</p>`],
      [50, 'Device Drivers',
        `<p class="y-chinh">🎯 Figure 11-36: <strong>a single level in a device stack</strong>. A <strong>device object</strong> contains a pointer to its <strong>driver object</strong> and <em>instance data</em>, and a link to the <em>next device object</em> in the stack. The driver object holds a <strong>dispatch table</strong> — pointers to the driver's entry points for the operations <strong>CREATE, READ, WRITE, FLUSH, IOCTL, CLEANUP, CLOSE, …</strong> — which lead into the <em>loaded driver code</em>. The I/O manager calls the right entry for each IRP's operation code.</p>
<p>A restaurant order slip travels to a kitchen. The slip (IRP) carries an operation code — "grill", "chop", "wash". The kitchen has one <em>menu board</em> (the dispatch table) saying which cook (function in the driver) handles each code. A new kind of food is added by hiring a cook and adding a line to the board — no need to change the waiters. A <strong>driver</strong> in Windows is a loadable kernel module (<code>.sys</code>) whose <code>DriverEntry</code> fills that table and creates device objects.</p>
<p>The Linux twin is the <code>file_operations</code> structure you met on slide 17: a driver registers a table of functions (<code>.open</code>, <code>.read</code>, <code>.write</code>, <code>.unlocked_ioctl</code>, <code>.release</code> …) with a <em>major number</em>; the node <code>/dev/xxx</code> carries that number, and the VFS calls the right function when a program uses it. See it work:</p>
<div class="out"># A Linux driver registers a table of functions (file_operations); a device node /dev/x has a major number that picks the driver<br>
$ ls -l /dev/null /dev/zero /dev/urandom<br>
crw-rw-rw- 1 root root 1, 3 Oct 26 03:43 /dev/null<br>
crw-rw-rw- 1 root root 1, 9 Oct 26 03:43 /dev/urandom<br>
crw-rw-rw- 1 root root 1, 5 Oct 26 03:43 /dev/zero<br>
$ cat /proc/devices | head -14<br>
Character devices:<br>
&nbsp;&nbsp;1 mem<br>
&nbsp;&nbsp;4 /dev/vc/0<br>
&nbsp;&nbsp;4 tty<br>
&nbsp;&nbsp;4 ttyS<br>
&nbsp;&nbsp;5 /dev/tty<br>
&nbsp;&nbsp;5 /dev/console<br>
&nbsp;&nbsp;5 /dev/ptmx<br>
&nbsp;&nbsp;7 vcs<br>
&nbsp;10 misc<br>
&nbsp;13 input<br>
&nbsp;21 sg<br>
&nbsp;89 i2c<br>
108 ppp<br>
# Same program, three drivers: open/read/write dispatch to different code behind one interface<br>
$ head -c 8 /dev/zero | od -An -tx1<br>
&nbsp;00 00 00 00 00 00 00 00<br>
$ head -c 8 /dev/null | od -An -tx1<br>
$ echo "written into /dev/null: nothing stored" &gt; /dev/null; echo "exit: $?"<br>
exit: 0</div>
<p>The <code>ls -l</code> shows <strong>character devices</strong> (<code>c</code>) with major/minor pairs: <code>1, 3</code> is <code>/dev/null</code>, <code>1, 5</code> is <code>/dev/zero</code>, <code>1, 9</code> is <code>/dev/urandom</code> — all served by driver <strong>major 1</strong> (<code>mem</code>, as <code>/proc/devices</code> lists). The three commands at the end use the <em>same program</em> (<code>head</code>, <code>echo</code>) but different drivers: reading <code>/dev/zero</code> returns zeros, reading <code>/dev/null</code> returns nothing, writing to <code>/dev/null</code> throws data away and "succeeds". That is the <em>dispatch table in action</em>: the same <code>read()</code> call lands in different code. In Windows terms: <code>NtReadFile</code> on a handle to <code>\\Device\\Null</code> reaches the Null driver's READ entry.</p>
<p><strong>➕ Modern driver models.</strong> The book's "driver object + dispatch table" is the WDM model. Today most Windows drivers are written with <strong>WDF</strong> (Windows Driver Frameworks: kernel-mode KMDF and user-mode UMDF), where the framework supplies the table and plug-and-play/power boilerplate; <strong>user-mode drivers</strong> are preferred when possible because a crash there cannot blue-screen the kernel (see slide 16). Linux drivers are almost always in-tree kernel code, loaded as modules (<code>lsmod</code>), with user-space alternatives (FUSE, UIO, libusb, eBPF).</p>
<p class="pitfall">⚠️ A <em>driver</em> is not always for hardware: <strong>file systems</strong> (NTFS), the <strong>network stack</strong> (TCP/IP), <strong>filters</strong> (antivirus) and <strong>virtual devices</strong> (<code>/dev/null</code>, a ram disk) are all drivers. That is why Figure 11-11 lists "drivers: file systems, volume manager, TCP/IP stack, net interfaces, graphics devices, all other devices".</p>`,
        `<p class="y-chinh">🎯 Hình 11-36: <strong>một tầng trong chồng thiết bị</strong>. Một <strong>device object</strong> chứa con trỏ tới <strong>driver object</strong> của nó và <em>dữ liệu thể hiện</em>, và liên kết tới <em>device object kế</em> trong chồng. Driver object giữ một <strong>bảng điều phối (dispatch table)</strong> — con trỏ tới các điểm vào của driver cho các thao tác <strong>CREATE, READ, WRITE, FLUSH, IOCTL, CLEANUP, CLOSE, …</strong> — dẫn vào <em>mã driver đã nạp</em>. I/O manager gọi đúng điểm vào cho mã thao tác của mỗi IRP.</p>
<p>Một phiếu gọi món đi tới nhà bếp. Phiếu (IRP) mang mã thao tác — "nướng", "thái", "rửa". Bếp có một <em>bảng thực đơn</em> (bảng điều phối) cho biết đầu bếp nào (hàm trong driver) lo mã nào. Thêm loại món mới bằng cách thuê đầu bếp và thêm một dòng lên bảng — không cần đổi người phục vụ. <strong>Driver</strong> trong Windows là một mô-đun nhân nạp được (<code>.sys</code>) mà <code>DriverEntry</code> điền bảng đó và tạo các device object.</p>
<p>Bản sinh đôi Linux là cấu trúc <code>file_operations</code> bạn gặp ở slide 17: driver đăng ký một bảng hàm (<code>.open</code>, <code>.read</code>, <code>.write</code>, <code>.unlocked_ioctl</code>, <code>.release</code> …) với một <em>số major</em>; nút <code>/dev/xxx</code> mang số đó, và VFS gọi đúng hàm khi chương trình dùng nó. Xem nó chạy:</p>
<div class="out"># Driver Linux đăng ký một bảng hàm (file_operations); nút thiết bị /dev/x có số major chọn driver<br>
$ ls -l /dev/null /dev/zero /dev/urandom<br>
crw-rw-rw- 1 root root 1, 3 Oct 26 03:43 /dev/null<br>
crw-rw-rw- 1 root root 1, 9 Oct 26 03:43 /dev/urandom<br>
crw-rw-rw- 1 root root 1, 5 Oct 26 03:43 /dev/zero<br>
$ cat /proc/devices | head -14<br>
Character devices:<br>
&nbsp;&nbsp;1 mem<br>
&nbsp;&nbsp;4 /dev/vc/0<br>
&nbsp;&nbsp;4 tty<br>
&nbsp;&nbsp;4 ttyS<br>
&nbsp;&nbsp;5 /dev/tty<br>
&nbsp;&nbsp;5 /dev/console<br>
&nbsp;&nbsp;5 /dev/ptmx<br>
&nbsp;&nbsp;7 vcs<br>
&nbsp;10 misc<br>
&nbsp;13 input<br>
&nbsp;21 sg<br>
&nbsp;89 i2c<br>
108 ppp<br>
# Cùng một chương trình, ba driver: open/read/write chuyển tới mã khác nhau sau một giao diện<br>
$ head -c 8 /dev/zero | od -An -tx1<br>
&nbsp;00 00 00 00 00 00 00 00<br>
$ head -c 8 /dev/null | od -An -tx1<br>
$ echo "written into /dev/null: nothing stored" &gt; /dev/null; echo "exit: $?"<br>
exit: 0</div>
<p><code>ls -l</code> cho thấy <strong>thiết bị ký tự</strong> (<code>c</code>) với cặp major/minor: <code>1, 3</code> là <code>/dev/null</code>, <code>1, 5</code> là <code>/dev/zero</code>, <code>1, 9</code> là <code>/dev/urandom</code> — đều do driver <strong>major 1</strong> (<code>mem</code>, như <code>/proc/devices</code> liệt kê) phục vụ. Ba lệnh cuối dùng <em>cùng chương trình</em> (<code>head</code>, <code>echo</code>) nhưng driver khác nhau: đọc <code>/dev/zero</code> trả về số 0, đọc <code>/dev/null</code> không trả gì, ghi vào <code>/dev/null</code> vứt dữ liệu và "thành công". Đó là <em>bảng điều phối đang hoạt động</em>: cùng lời gọi <code>read()</code> hạ cánh vào mã khác nhau. Theo thuật ngữ Windows: <code>NtReadFile</code> trên handle tới <code>\\Device\\Null</code> tới điểm vào READ của driver Null.</p>
<p><strong>➕ Mô hình driver hiện đại.</strong> "Driver object + bảng điều phối" của sách là mô hình WDM. Ngày nay đa số driver Windows viết bằng <strong>WDF</strong> (Windows Driver Frameworks: KMDF chế độ nhân và UMDF chế độ người dùng), nơi khung cung cấp bảng và phần soạn sẵn plug-and-play/năng lượng; <strong>driver chế độ người dùng</strong> được ưa khi có thể vì vụ sập ở đó không làm màn hình xanh nhân (xem slide 16). Driver Linux hầu như luôn là mã nhân trong cây, nạp thành mô-đun (<code>lsmod</code>), với các lựa chọn không gian người dùng (FUSE, UIO, libusb, eBPF).</p>
<p class="pitfall">⚠️ <em>Driver</em> không phải lúc nào cũng cho phần cứng: <strong>hệ thống tệp</strong> (NTFS), <strong>ngăn xếp mạng</strong> (TCP/IP), <strong>bộ lọc</strong> (antivirus) và <strong>thiết bị ảo</strong> (<code>/dev/null</code>, đĩa RAM) đều là driver. Vì vậy Hình 11-11 liệt kê "driver: hệ thống tệp, volume manager, ngăn xếp TCP/IP, giao diện mạng, thiết bị đồ hoạ, mọi thiết bị khác".</p>`],
      [51, 'I/O Request Packets',
        `<p class="y-chinh">🎯 Figure 11-37: the <strong>major fields of an I/O Request Packet (IRP)</strong>: <em>Flags</em>, <em>Operation code</em>, <em>Buffer pointers</em> (with a <em>kernel buffer address</em> and a <em>user buffer address</em>), <em>Memory descriptor list head</em> (MDLs), <em>Thread's IRP chain link</em> (the IRP belongs to the requesting thread), <em>Completion/cancel info</em>, <em>Completion APC block</em>, <em>Driver queuing and communication</em>, and the <em>IRP driver-stack data</em> (a small area per driver in the stack, shown dashed). "Next IRP" links requests of the same thread.</p>
<p>An IRP is a <strong>work order</strong> that travels with a job through the factory: it says what to do (operation code), on which material (the buffers), who asked (the thread), what to do on completion (the APC block), whether it was cancelled, and each station (driver) gets a little box in the margin (stack data) to write its own notes. The same order moves down the line, is completed, and comes back up — it is never copied for each station, which makes the stack cheap.</p>
<p>Three words from the figure need defining. <strong>MDL</strong> (<em>memory descriptor list</em>) describes the <em>physical pages</em> behind a user buffer, so a device can do DMA into it after the kernel has <strong>locked</strong> those pages in RAM (a page being DMA'd must not be swapped out; this is the cousin of <code>mlock</code> and of Linux's <code>get_user_pages</code> and scatter-gather lists). Windows has three buffering styles — <strong>buffered I/O</strong> (copy through a kernel buffer; safe, slower), <strong>direct I/O</strong> (an MDL maps the user's pages; no copy) and <strong>neither</strong> (raw user pointer; the driver is responsible) — a choice every driver writer makes. <strong>Completion APC</strong>: when the IRP completes the I/O manager queues an <em>asynchronous procedure call</em> to the original thread to copy results and signal the event (slide 12). <strong>Cancel info</strong>: <code>CancelIoEx</code> asks the I/O manager to cancel pending IRPs — the reason a slow request can be abandoned.</p>
<p>Linux's counterparts: the block layer's <code>struct bio</code>/<code>struct request</code> (operation, sector, list of pages = the scatter-gather list), <code>struct urb</code> for USB, <code>struct sk_buff</code> for packets — and for the user interface the <code>io_uring</code> <em>submission queue entry</em> (operation code, buffer address, user data) and <em>completion queue entry</em> (result), which look surprisingly like an IRP's front and back. The idea — "describe the request as a data structure and pass it down" — is universal.</p>
<p class="pitfall">⚠️ An IRP is allocated by the <em>I/O manager</em> per request and sent down one stack; it is <strong>not</strong> a thread, not a process and not an interrupt. Do not confuse the <em>IRP</em> (a software request) with the <em>IRQ</em> (a hardware interrupt line) — both abbreviations differ by one letter, which is a classic quiz trap.</p>`,
        `<p class="y-chinh">🎯 Hình 11-37: các <strong>trường chính của I/O Request Packet (IRP)</strong>: <em>Flags</em>, <em>Mã thao tác</em>, <em>Con trỏ bộ đệm</em> (có <em>địa chỉ bộ đệm nhân</em> và <em>địa chỉ bộ đệm người dùng</em>), <em>Đầu danh sách mô tả bộ nhớ</em> (MDL), <em>Liên kết chuỗi IRP của luồng</em> (IRP thuộc luồng yêu cầu), <em>Thông tin hoàn thành/huỷ</em>, <em>Khối APC hoàn thành</em>, <em>Xếp hàng và liên lạc của driver</em>, và <em>dữ liệu chồng-driver của IRP</em> (một vùng nhỏ cho mỗi driver trong chồng, vẽ nét đứt). "Next IRP" nối các yêu cầu của cùng một luồng.</p>
<p>IRP là một <strong>lệnh sản xuất</strong> đi cùng một việc qua nhà máy: nó nói phải làm gì (mã thao tác), trên nguyên liệu nào (các bộ đệm), ai yêu cầu (luồng), làm gì khi hoàn thành (khối APC), có bị huỷ không, và mỗi trạm (driver) có một ô nhỏ ở lề (dữ liệu chồng) để ghi chú riêng. Cùng lệnh đó đi xuống dây chuyền, được hoàn thành, và đi ngược lên — không bao giờ sao chép cho mỗi trạm, nên chồng rẻ.</p>
<p>Ba từ trong hình cần định nghĩa. <strong>MDL</strong> (<em>memory descriptor list</em>) mô tả các <em>trang vật lý</em> đằng sau một bộ đệm người dùng, để thiết bị làm DMA vào đó sau khi nhân đã <strong>khoá</strong> các trang đó trong RAM (trang đang DMA không được swap ra; họ hàng của <code>mlock</code> và của <code>get_user_pages</code> cùng danh sách scatter-gather ở Linux). Windows có ba kiểu đệm — <strong>I/O có đệm (buffered)</strong> (sao qua bộ đệm nhân; an toàn, chậm hơn), <strong>I/O trực tiếp (direct)</strong> (một MDL ánh xạ trang của người dùng; không sao chép) và <strong>neither</strong> (con trỏ người dùng thô; driver tự chịu trách nhiệm) — lựa chọn mà mỗi người viết driver phải đưa ra. <strong>APC hoàn thành</strong>: khi IRP hoàn thành I/O manager xếp một <em>lời gọi thủ tục bất đồng bộ</em> tới luồng gốc để sao kết quả và báo event (slide 12). <strong>Thông tin huỷ</strong>: <code>CancelIoEx</code> nhờ I/O manager huỷ các IRP đang chờ — lý do một yêu cầu chậm bỏ được.</p>
<p>Đối ứng Linux: <code>struct bio</code>/<code>struct request</code> của tầng khối (thao tác, sector, danh sách trang = danh sách scatter-gather), <code>struct urb</code> cho USB, <code>struct sk_buff</code> cho gói tin — và cho giao diện người dùng là <em>mục hàng đợi gửi (submission queue entry)</em> của <code>io_uring</code> (mã thao tác, địa chỉ bộ đệm, dữ liệu người dùng) và <em>mục hàng đợi hoàn thành</em> (kết quả), trông giống phần đầu và phần cuối của một IRP đến bất ngờ. Ý tưởng — "mô tả yêu cầu thành một cấu trúc dữ liệu và chuyển xuống" — là phổ quát.</p>
<p class="pitfall">⚠️ IRP được <em>I/O manager</em> cấp cho mỗi yêu cầu và gửi xuống một chồng; nó <strong>không</strong> phải luồng, không phải tiến trình và không phải ngắt. Đừng lẫn <em>IRP</em> (một yêu cầu phần mềm) với <em>IRQ</em> (một đường ngắt phần cứng) — hai chữ viết tắt chỉ khác một chữ cái, bẫy trắc nghiệm kinh điển.</p>`],
      [52, 'Device Stacks',
        `<p class="y-chinh">🎯 Figure 11-38: <strong>Windows allows drivers to be stacked to work with a specific instance of a device</strong>; "the stacking is represented by device objects". A user program calls Win32; the <em>rest of Windows</em> (I/O manager) dispatches to one of three kinds of stack: a <strong>monolithic</strong> driver (one driver does everything), a stack of <strong>function driver → bus driver</strong>, or a stack with a <strong>filter</strong> on top (<em>filter → function → bus</em>). Below sits the HAL, then the <strong>controllers</strong> and the real devices — a printer, a camcorder, a CD/DVD drive in the figure.</p>
<p>Think of plugging a USB camera into a laptop. The <strong>bus driver</strong> (USB) is the receptionist who notices a new visitor and reads its ID card ("a video device, vendor X"). The system then finds and loads the <strong>function driver</strong> — the expert who actually knows how to talk to cameras — and stacks it on top of the bus driver's device object. If the manufacturer also wants a special filter (for example to add noise reduction), it inserts a <strong>filter driver</strong> above or below the function driver. This is <strong>Plug and Play</strong>: the stack is <em>built dynamically</em> when the device appears, and torn down when it is unplugged.</p>
<p>Linux does the same with <strong>buses and drivers</strong> in <code>sysfs</code>: each bus (<code>pci</code>, <code>usb</code>, <code>virtio</code>, <code>platform</code> …) enumerates devices, matches each with a driver by <em>modalias</em> (vendor/device IDs), and binds them; <code>udev</code> then creates the <code>/dev</code> node and runs rules. Look at the real tree of this lab's VM — a <em>virtio</em> network card found on the <em>virtio bus</em>, matched to the <code>virtio_net</code> driver by the ID string in <code>modalias</code>:</p>
<div class="out"># A device is found by a BUS driver, matched to a FUNCTION driver, and may have filters: the Windows device stack, as sysfs shows it on Linux<br>
$ ls /sys/bus<br>
amba<br>
clockevents<br>
clocksource<br>
container<br>
cpu<br>
dax<br>
event_source<br>
faux<br>
gpio<br>
hid<br>
i2c<br>
mdio_bus<br>
mmc<br>
mmc_rpmb<br>
nd<br>
pci<br>
pci_express<br>
platform<br>
scsi<br>
sdio<br>
serial<br>
serial-base<br>
serio<br>
soc<br>
typec<br>
usb<br>
usb-serial<br>
virtio<br>
workqueue<br>
$ d=$(ls /sys/bus/virtio/devices | head -1)<br>
$ echo "first virtio device: $d"<br>
first virtio device: virtio0<br>
$ echo "driver -&gt; $(basename "$(readlink /sys/bus/virtio/devices/$d/driver)")"<br>
driver -&gt; virtio_net<br>
$ echo "bus &nbsp;&nbsp;&nbsp;-&gt; $(basename "$(readlink /sys/bus/virtio/devices/$d/subsystem)")"<br>
bus &nbsp;&nbsp;&nbsp;-&gt; virtio<br>
$ cat /sys/bus/virtio/devices/$d/modalias<br>
virtio:d00000001v00001AF4</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>The first list is every <strong>bus type</strong> the kernel knows (<code>pci</code>, <code>usb</code>, <code>virtio</code> …); the device <code>virtio0</code> sits on the <code>virtio</code> bus; its <code>driver</code> link points to <code>virtio_net</code>; and <code>modalias</code> <code>virtio:d00000001v00001AF4</code> is the identity card (device 1 = network, vendor 0x1AF4 = Red Hat/virtio) the kernel matched. Replace <code>virtio</code> with <code>usb</code> on your own laptop and you see the camera story above. The Windows equivalent view is <em>Device Manager → Properties → Details → Hardware Ids / Driver</em>, and the tool <code>pnputil</code>.</p>
<p><strong>Why layering pays.</strong> The disk driver does not care whether the request came from NTFS or from a raw copy; a filter can add encryption without touching the file system; the same bus driver serves every USB device. The cost is <em>latency and complexity</em> — long stacks are hard to debug (a bug in one filter can hang file access for a whole machine, a common cause of "my system freezes when I plug in X").</p>
<p class="pitfall">⚠️ In Figure 11-38 "function driver" is <em>not</em> a driver that implements a mathematical function; it is the driver that implements the <em>main function</em> of the device (the camera, the disk), as opposed to the <em>bus</em> driver (how to reach it) and <em>filters</em> (modify behaviour). Exam answer for "what is a filter driver": <em>an optional layer that observes or alters requests between other drivers without replacing them</em>.</p>`,
        `<p class="y-chinh">🎯 Hình 11-38: <strong>Windows cho phép xếp chồng driver để làm việc với một thể hiện cụ thể của thiết bị</strong>; "việc xếp chồng được biểu diễn bằng device object". Một chương trình người dùng gọi Win32; <em>phần còn lại của Windows</em> (I/O manager) điều phối tới một trong ba loại chồng: driver <strong>nguyên khối (monolithic)</strong> (một driver làm tất cả), chồng <strong>driver chức năng → driver bus</strong>, hay chồng có <strong>bộ lọc</strong> ở trên (<em>bộ lọc → chức năng → bus</em>). Phía dưới là HAL, rồi các <strong>bộ điều khiển</strong> và thiết bị thật — máy in, máy quay, ổ CD/DVD trong hình.</p>
<p>Hình dung cắm một camera USB vào laptop. <strong>Driver bus</strong> (USB) là lễ tân nhận ra vị khách mới và đọc thẻ căn cước ("thiết bị video, hãng X"). Hệ thống sau đó tìm và nạp <strong>driver chức năng</strong> — chuyên gia thực sự biết nói chuyện với camera — và xếp nó lên trên device object của driver bus. Nếu nhà sản xuất còn muốn một bộ lọc đặc biệt (ví dụ thêm khử nhiễu), nó chèn một <strong>driver lọc</strong> trên hay dưới driver chức năng. Đó là <strong>Plug and Play</strong>: chồng được <em>dựng động</em> khi thiết bị xuất hiện, và dỡ ra khi rút.</p>
<p>Linux làm tương tự với <strong>bus và driver</strong> trong <code>sysfs</code>: mỗi bus (<code>pci</code>, <code>usb</code>, <code>virtio</code>, <code>platform</code> …) liệt kê thiết bị, ghép mỗi cái với một driver theo <em>modalias</em> (ID hãng/thiết bị), và gắn chúng; <code>udev</code> rồi tạo nút <code>/dev</code> và chạy các luật. Nhìn cây thật của máy ảo lab này — một card mạng <em>virtio</em> tìm thấy trên <em>bus virtio</em>, ghép với driver <code>virtio_net</code> bằng chuỗi ID trong <code>modalias</code>:</p>
<div class="out"># Thiết bị được driver BUS tìm ra, ghép với driver CHỨC NĂNG, và có thể có bộ lọc: chồng thiết bị Windows, như sysfs thể hiện trên Linux<br>
$ ls /sys/bus<br>
amba<br>
clockevents<br>
clocksource<br>
container<br>
cpu<br>
dax<br>
event_source<br>
faux<br>
gpio<br>
hid<br>
i2c<br>
mdio_bus<br>
mmc<br>
mmc_rpmb<br>
nd<br>
pci<br>
pci_express<br>
platform<br>
scsi<br>
sdio<br>
serial<br>
serial-base<br>
serio<br>
soc<br>
typec<br>
usb<br>
usb-serial<br>
virtio<br>
workqueue<br>
$ d=$(ls /sys/bus/virtio/devices | head -1)<br>
$ echo "first virtio device: $d"<br>
first virtio device: virtio0<br>
$ echo "driver -&gt; $(basename "$(readlink /sys/bus/virtio/devices/$d/driver)")"<br>
driver -&gt; virtio_net<br>
$ echo "bus &nbsp;&nbsp;&nbsp;-&gt; $(basename "$(readlink /sys/bus/virtio/devices/$d/subsystem)")"<br>
bus &nbsp;&nbsp;&nbsp;-&gt; virtio<br>
$ cat /sys/bus/virtio/devices/$d/modalias<br>
virtio:d00000001v00001AF4</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Danh sách đầu là mọi <strong>loại bus</strong> nhân biết (<code>pci</code>, <code>usb</code>, <code>virtio</code> …); thiết bị <code>virtio0</code> nằm trên bus <code>virtio</code>; liên kết <code>driver</code> của nó trỏ tới <code>virtio_net</code>; và <code>modalias</code> <code>virtio:d00000001v00001AF4</code> là thẻ căn cước (thiết bị 1 = mạng, hãng 0x1AF4 = Red Hat/virtio) mà nhân đã ghép. Thay <code>virtio</code> bằng <code>usb</code> trên laptop của bạn là thấy câu chuyện camera ở trên. Góc nhìn tương đương Windows là <em>Device Manager → Properties → Details → Hardware Ids / Driver</em>, và công cụ <code>pnputil</code>.</p>
<p><strong>Vì sao phân tầng có lợi.</strong> Driver đĩa không quan tâm yêu cầu đến từ NTFS hay từ một lần chép thô; bộ lọc thêm được mã hoá mà không đụng hệ thống tệp; cùng driver bus phục vụ mọi thiết bị USB. Cái giá là <em>độ trễ và độ phức tạp</em> — chồng dài khó gỡ lỗi (lỗi trong một bộ lọc có thể treo truy cập tệp cả máy, nguyên nhân thường gặp của "máy tôi đứng khi cắm X").</p>
<p class="pitfall">⚠️ Trong Hình 11-38 "driver chức năng (function driver)" <em>không</em> phải driver cài một hàm toán học; nó là driver cài <em>chức năng chính</em> của thiết bị (camera, đĩa), đối lập với driver <em>bus</em> (cách tới nó) và <em>bộ lọc</em> (sửa hành vi). Đáp án thi cho "driver lọc là gì": <em>một tầng tuỳ chọn quan sát hay thay đổi yêu cầu giữa các driver khác mà không thay thế chúng</em>.</p>`],
      [53, 'Implementation of the NT File System (1)',
        `<p class="y-chinh">🎯 Figure 11-39: <strong>NTFS is built around one table — the Master File Table (MFT)</strong>. Each record is 1 KB. The first records are <strong>metadata files</strong>, which are ordinary files with names starting with <code>$</code>: record 0 <code>$Mft</code> (the MFT itself), 1 <code>$MftMirr</code> (a mirror copy of the first records), 2 <code>$LogFile</code> (the log used for recovery), 3 <code>$Volume</code>, 4 <code>$AttrDef</code> (attribute definitions), 5 <code>\\</code> (the <em>root directory</em>), 6 <code>$Bitmap</code> (which blocks are in use), 7 <code>$Boot</code> (bootstrap loader), 8 <code>$BadClus</code> (list of bad blocks), 9 <code>$Secure</code> (security descriptors for all files), 10 <code>$Upcase</code> (case-conversion table), 11 <code>$Extend</code> (extensions: quotas etc.), 12–15 reserved, and 16 onwards the first <strong>user files</strong>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c50d1a42313acd31ae4d99a86ffa77350182315e.svg" alt="NTFS as one table: the first MFT records are system files; a user file is one record made of attributes" loading="lazy" /><p class="chu-thich">🧩 NTFS as one table: the first MFT records are system files; a user file is one record made of attributes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figures 11-39 to 11-43: NTFS = one table, the MFT. Everything (even the MFT itself, the bitmap, the log) is a FILE with an MFT record made of attributes
skinparam rectangle {
  RoundCorner 3
}
package "MFT (Master File Table) — 1 KiB per record" as mft {
  rectangle "0  $Mft — the MFT itself" as r0
  rectangle "1  $MftMirr — copy of the first records" as r1
  rectangle "2  $LogFile — recovery log (journal)" as r2
  rectangle "3  $Volume" as r3
  rectangle "4  $AttrDef" as r4
  rectangle "5  \\\\  (root directory)" as r5
  rectangle "6  $Bitmap — which clusters are free" as r6
  rectangle "7  $Boot — boot loader" as r7
  rectangle "8  $BadClus   9  $Secure   10  $Upcase   11  $Extend" as r8
  rectangle "16…  first USER file" as r16
}
rectangle "Record of one user file" as rec #FEF9C3 {
  rectangle "record header" as h
  rectangle "$STANDARD_INFORMATION\\nflags, timestamps" as a1
  rectangle "$FILE_NAME\\nUnicode name (+ 8.3 short name)" as a2
  rectangle "$DATA\\nsmall file: bytes INSIDE the record\\nbig file: list of RUNS (start, length)" as a3
  rectangle "other $DATA streams (alternate\\ndata streams): file:stream" as a4
  h -[hidden]down- a1
  a1 -[hidden]down- a2
  a2 -[hidden]down- a3
  a3 -[hidden]down- a4
}
r16 ..&gt; rec
note bottom of rec : too many runs for 1 KiB?\\nthe record points to EXTENSION records (Figure 11-42);\\na small directory lives in $INDEX_ROOT, a big one in a B+ tree
@enduml</code></pre></details>
<p>The elegant idea: <em>the file system describes itself with files</em>. The map of free space (<code>$Bitmap</code>), the recovery log (<code>$LogFile</code>), even the list of records (<code>$Mft</code>) are all files, so the same code that reads user files reads the structures of the file system. To mount a volume NTFS reads the boot sector, finds record 0, and from record 0 learns where every other MFT record lives.</p>
<p>Compare with the ext4 you used in Chapter 4: there is no single table, but the same roles are spread across structures — <strong>superblock</strong> (≈ <code>$Boot</code>/<code>$Volume</code>), <strong>block and inode bitmaps</strong> (≈ <code>$Bitmap</code>), <strong>inode table</strong> (≈ the MFT: one fixed-size record per file; an NTFS record is 1 KB, an ext4 inode is typically 256 bytes), <strong>journal</strong> (≈ <code>$LogFile</code>) and the <strong>lost+found</strong> directory (a place for orphans found by <code>fsck</code>; NTFS uses <code>chkdsk</code>). The directory entry holds a name and an <em>inode number</em> in ext4, a name and an <em>MFT record number</em> in NTFS (slide 57).</p>
<p><strong>➕ Limits — Windows 8 versus now (source: Microsoft Learn, "ReFS overview", feature table).</strong> NTFS: maximum file name length <strong>255</strong> Unicode characters, path <strong>32K</strong> characters, <strong>maximum file size and volume size 256 TB</strong> (ReFS: 35 PB). NTFS has features ReFS lacks — <em>transactions, object IDs, short (8.3) names, disk quotas, bootability, shrinking, removable-media support</em> — and ReFS has <em>block clone</em> and <em>sparse VDL</em> that NTFS lacks. Both support BitLocker, hard links, junctions/symlinks, reparse points, sparse files, named streams (slide 54), ACLs, USN journal and volume snapshots. In the 2012 book, NTFS was "the" Windows file system; in 2026 it is still the default for the system drive, but a second file system exists for specific jobs (slide 58).</p>
<p><strong>Why a Linux developer cares.</strong> When Docker Desktop or WSL 2 mounts a Windows folder into Linux (<code>/mnt/c</code> or a bind mount), every file operation crosses from Linux's ext4/VFS world into NTFS — through a network-file-system-like bridge. Microsoft's own advice on WSL (also on the Dev Drive page): <em>"for the best performance files should be stored on the Linux file system"</em>, not on the Windows drive. Put your <code>node_modules</code>, build output and Postgres data directory inside the Linux side (<code>~/project</code>), not under <code>/mnt/c</code>.</p>
<p class="pitfall">⚠️ The MFT record is <em>not</em> the file's data: for a small file the data may live inside the record, but for most files the record holds <em>attributes</em> and a <em>list of runs</em> pointing to the data on disk (slides 55–56). Also "$MftMirr is a backup of the whole MFT" is wrong: it mirrors only the first few critical records (so the volume can still be mounted if record 0 is damaged).</p>`,
        `<p class="y-chinh">🎯 Hình 11-39: <strong>NTFS xây quanh một bảng — Master File Table (MFT)</strong>. Mỗi bản ghi dài 1 KB. Các bản ghi đầu là <strong>tệp siêu dữ liệu</strong>, là tệp bình thường có tên bắt đầu bằng <code>$</code>: bản ghi 0 <code>$Mft</code> (chính MFT), 1 <code>$MftMirr</code> (bản sao gương của các bản ghi đầu), 2 <code>$LogFile</code> (nhật ký dùng để phục hồi), 3 <code>$Volume</code>, 4 <code>$AttrDef</code> (định nghĩa thuộc tính), 5 <code>\\</code> (<em>thư mục gốc</em>), 6 <code>$Bitmap</code> (khối nào đang dùng), 7 <code>$Boot</code> (bộ nạp khởi động), 8 <code>$BadClus</code> (danh sách khối hỏng), 9 <code>$Secure</code> (security descriptor cho mọi tệp), 10 <code>$Upcase</code> (bảng đổi hoa/thường), 11 <code>$Extend</code> (phần mở rộng: hạn mức…), 12–15 dành riêng, và từ 16 trở đi là các <strong>tệp người dùng</strong> đầu tiên.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/c50d1a42313acd31ae4d99a86ffa77350182315e.svg" alt="NTFS là một bảng: các bản ghi MFT đầu là tệp hệ thống; một tệp người dùng là một bản ghi gồm các thuộc tính" loading="lazy" /><p class="chu-thich">🧩 NTFS là một bảng: các bản ghi MFT đầu là tệp hệ thống; một tệp người dùng là một bản ghi gồm các thuộc tính</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-39 đến 11-43: NTFS = một bảng, MFT. Mọi thứ (kể cả chính MFT, bitmap, nhật ký) đều là TỆP có bản ghi MFT gồm các thuộc tính
skinparam rectangle {
  RoundCorner 3
}
package "MFT (Master File Table) — 1 KiB per record" as mft {
  rectangle "0  $Mft — the MFT itself" as r0
  rectangle "1  $MftMirr — copy of the first records" as r1
  rectangle "2  $LogFile — recovery log (journal)" as r2
  rectangle "3  $Volume" as r3
  rectangle "4  $AttrDef" as r4
  rectangle "5  \\\\  (root directory)" as r5
  rectangle "6  $Bitmap — which clusters are free" as r6
  rectangle "7  $Boot — boot loader" as r7
  rectangle "8  $BadClus   9  $Secure   10  $Upcase   11  $Extend" as r8
  rectangle "16…  first USER file" as r16
}
rectangle "Record of one user file" as rec #FEF9C3 {
  rectangle "record header" as h
  rectangle "$STANDARD_INFORMATION\\nflags, timestamps" as a1
  rectangle "$FILE_NAME\\nUnicode name (+ 8.3 short name)" as a2
  rectangle "$DATA\\nsmall file: bytes INSIDE the record\\nbig file: list of RUNS (start, length)" as a3
  rectangle "other $DATA streams (alternate\\ndata streams): file:stream" as a4
  h -[hidden]down- a1
  a1 -[hidden]down- a2
  a2 -[hidden]down- a3
  a3 -[hidden]down- a4
}
r16 ..&gt; rec
note bottom of rec : too many runs for 1 KiB?\\nthe record points to EXTENSION records (Figure 11-42);\\na small directory lives in $INDEX_ROOT, a big one in a B+ tree
@enduml</code></pre></details>
<p>Ý tưởng thanh lịch: <em>hệ thống tệp tự mô tả bằng tệp</em>. Bản đồ chỗ trống (<code>$Bitmap</code>), nhật ký phục hồi (<code>$LogFile</code>), thậm chí danh sách các bản ghi (<code>$Mft</code>) đều là tệp, nên cùng mã đọc tệp người dùng đọc cả cấu trúc của hệ thống tệp. Để mount một volume NTFS đọc sector khởi động, tìm bản ghi 0, và từ bản ghi 0 biết mọi bản ghi MFT khác nằm đâu.</p>
<p>So với ext4 bạn dùng ở Chương 4: không có một bảng duy nhất, nhưng cùng các vai trò được rải ra các cấu trúc — <strong>superblock</strong> (≈ <code>$Boot</code>/<code>$Volume</code>), <strong>bitmap khối và inode</strong> (≈ <code>$Bitmap</code>), <strong>bảng inode</strong> (≈ MFT: một bản ghi cỡ cố định mỗi tệp; bản ghi NTFS 1 KB, inode ext4 thường 256 byte), <strong>journal</strong> (≈ <code>$LogFile</code>) và thư mục <strong>lost+found</strong> (nơi cho các tệp mồ côi do <code>fsck</code> tìm ra; NTFS dùng <code>chkdsk</code>). Mục thư mục chứa tên và <em>số inode</em> ở ext4, tên và <em>số bản ghi MFT</em> ở NTFS (slide 57).</p>
<p><strong>➕ Giới hạn — Windows 8 so với nay (nguồn: Microsoft Learn, "ReFS overview", bảng tính năng).</strong> NTFS: độ dài tên tệp tối đa <strong>255</strong> ký tự Unicode, đường dẫn <strong>32K</strong> ký tự, <strong>cỡ tệp và cỡ volume tối đa 256 TB</strong> (ReFS: 35 PB). NTFS có các tính năng ReFS thiếu — <em>giao dịch, object ID, tên ngắn (8.3), hạn mức đĩa, khả năng khởi động, thu nhỏ, hỗ trợ phương tiện tháo rời</em> — và ReFS có <em>block clone</em> và <em>sparse VDL</em> mà NTFS thiếu. Cả hai hỗ trợ BitLocker, hard link, junction/symlink, reparse point, tệp thưa, luồng có tên (slide 54), ACL, nhật ký USN và snapshot volume. Trong sách 2012, NTFS là hệ thống tệp "duy nhất" của Windows; năm 2026 nó vẫn là mặc định cho ổ hệ thống, nhưng có thêm một hệ thống tệp thứ hai cho việc riêng (slide 58).</p>
<p><strong>Vì sao dev Linux quan tâm.</strong> Khi Docker Desktop hay WSL 2 mount thư mục Windows vào Linux (<code>/mnt/c</code> hay bind mount), mọi thao tác tệp chuyển từ thế giới ext4/VFS của Linux sang NTFS — qua một cây cầu giống hệ thống tệp mạng. Lời khuyên của chính Microsoft về WSL (cũng ở trang Dev Drive): <em>"để có hiệu năng tốt nhất, tệp nên lưu trên hệ thống tệp Linux"</em>, không phải ổ Windows. Hãy đặt <code>node_modules</code>, đầu ra build và thư mục dữ liệu Postgres bên phía Linux (<code>~/project</code>), không dưới <code>/mnt/c</code>.</p>
<p class="pitfall">⚠️ Bản ghi MFT <em>không</em> phải dữ liệu của tệp: với tệp nhỏ dữ liệu có thể nằm trong bản ghi, nhưng với đa số tệp bản ghi giữ <em>thuộc tính</em> và một <em>danh sách run</em> trỏ tới dữ liệu trên đĩa (slide 55–56). Cũng vậy "$MftMirr là bản sao lưu của cả MFT" là sai: nó chỉ gương vài bản ghi quan trọng đầu tiên (để volume vẫn mount được nếu bản ghi 0 hỏng).</p>`],
      [54, 'Implementation of the NT File System (2)',
        `<p class="y-chinh">🎯 Figure 11-40: the <strong>attributes used in MFT records</strong>. A file is <em>a bundle of attributes</em>: <strong>Standard information</strong> (flag bits, timestamps), <strong>File name</strong> (Unicode; may be repeated for the MS-DOS short name), <strong>Security descriptor</strong> (obsolete — now in <code>$Extend$Secure</code>), <strong>Attribute list</strong> (location of additional MFT records, if needed), <strong>Object ID</strong> (64-bit file identifier unique to this volume), <strong>Reparse point</strong> (used for mounting and symbolic links), <strong>Volume name</strong>, <strong>Volume information</strong>, <strong>Index root</strong> (used for directories), <strong>Index allocation</strong> and <strong>Bitmap</strong> (for very large directories), <strong>Logged utility stream</strong> (controls logging to <code>$LogFile</code>) and <strong>Data</strong> (stream data; <em>may be repeated</em>).</p>
<p>The last line — "Data: stream data; <strong>may be repeated</strong>" — is the key. A file can have <em>several</em> data attributes, each with a name. The unnamed one is "the file" you normally see; the others are <strong>alternate data streams (ADS)</strong>. Microsoft ("File Streams") writes their full name as <code>filename:streamname:$DATA</code>, e.g. <code>myfile.dat:stream1:$DATA</code>; the default stream is <code>filename::$DATA</code>, equivalent to plain <code>filename</code>. "Each stream … has its own allocation size, actual size, and valid data length", its own compression, encryption and sparseness; "there are no file times associated with a stream"; and the stream type is internal ("users can't create new stream types"). Streams can be listed with <code>dir /r</code> or <code>FindFirstStreamW</code>.</p>
<p>What are ADS used for? Legitimately: browsers store the download origin in a stream named <code>Zone.Identifier</code> (Windows's "this file came from the internet" warning — the <em>mark of the web</em>), Explorer keeps thumbnails and summary info, backup tools keep metadata. Illegitimately: malware can hide data in a stream that the directory listing and the reported file size never show, and security scanners must enumerate streams. <strong>The big surprise for developers:</strong> copy an NTFS file to a FAT/exFAT USB stick, a Linux server, a zip file or a cloud drive and the extra streams are <strong>silently lost</strong>.</p>
<p>Linux has no ADS, but has the closest cousin: <strong>extended attributes (xattr)</strong> — name/value pairs glued to an inode (<code>user.*</code> for programs, <code>security.*</code> for SELinux, <code>system.posix_acl_*</code> for ACLs). The program below recreates the ADS story step by step on <code>tmpfs</code>:</p>
<pre><code class="language-c">// NTFS "file:stream" alternate data streams &lt;-&gt; Linux extended attributes (xattr): extra named data glued to ONE file
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;
#include &lt;sys/xattr.h&gt;

int main(void) {
    const char *path = "/dev/shm/report.txt";                  // tmpfs: supports user.* xattrs on modern kernels
    int fd = open(path, O_CREAT | O_WRONLY | O_TRUNC, 0644);
    write(fd, "hello world", 11);                              // the DEFAULT stream: report.txt::$DATA
    close(fd);
    const char *note = "scanned from the internet";            // like: echo ... &gt; report.txt:Zone.Identifier
    if (setxattr(path, "user.zone", note, strlen(note), 0) != 0) { perror("setxattr"); return 1; }
    const char *sum = "quarterly numbers, draft";
    setxattr(path, "user.summary", sum, strlen(sum), 0);
    struct stat st; stat(path, &amp;st);
    printf("ls sees: size %lld bytes - the extra data is invisible to size and to cat\\n", (long long)st.st_size);
    char names[256]; ssize_t n = listxattr(path, names, sizeof names);   // like FindFirstStreamW / dir /r
    printf("streams (xattr names):");
    for (char *p = names; p &lt; names + n; p += strlen(p) + 1) printf(" %s", p);
    printf("\\n");
    char buf[64]; ssize_t m = getxattr(path, "user.summary", buf, sizeof buf);
    printf("named stream \\"summary\\" = %zd bytes: %.*s\\n", m, (int)m, buf);
    // Copy with plain cp: the extra streams are LOST, exactly like copying an NTFS file to FAT
    system("cp /dev/shm/report.txt /dev/shm/copy.txt");
    printf("after cp (no --preserve=xattr): copy has %zd xattr bytes of names\\n", listxattr("/dev/shm/copy.txt", names, sizeof names));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ads-xattr.c -o ads-xattr &amp;&amp; ./ads-xattr<br>
ls sees: size 11 bytes - the extra data is invisible to size and to cat<br>
streams (xattr names): user.zone user.summary<br>
named stream "summary" = 24 bytes: quarterly numbers, draft<br>
after cp (no --preserve=xattr): copy has 0 xattr bytes of names</div>
<p>It creates <code>report.txt</code> with 11 bytes of normal content, glues two named values to it (<code>user.zone</code> ≈ <code>Zone.Identifier</code>; <code>user.summary</code>), and shows: <code>stat</code> still sees <strong>size 11</strong> (extra data invisible to the size and to <code>cat</code> — exactly like ADS), <code>listxattr</code> lists the stream names (≈ <code>dir /r</code>), <code>getxattr</code> reads one (24 bytes), and a plain <code>cp</code> makes a copy with <strong>zero</strong> extended attributes — the very same loss as copying an NTFS file to FAT. (<code>cp -a</code> or <code>--preserve=xattr</code> would keep them, as Windows's <code>robocopy /copyall</code> does.) Differences: xattrs are size-limited and not meant for large data (an ADS can be gigabytes), and many Linux file systems or mounts do not enable them.</p>
<p class="pitfall">⚠️ "<em>An alternate data stream is a hidden file</em>" is imprecise: it is another <em>data attribute of the same MFT record</em>, with no directory entry of its own. And "ADS exist on FAT" is false — they exist only on file systems that support named streams (NTFS and ReFS in the comparison table: "Named streams ✅").</p>`,
        `<p class="y-chinh">🎯 Hình 11-40: các <strong>thuộc tính dùng trong bản ghi MFT</strong>. Một tệp là <em>một bó thuộc tính</em>: <strong>Standard information</strong> (bit cờ, mốc thời gian), <strong>File name</strong> (Unicode; có thể lặp cho tên ngắn MS-DOS), <strong>Security descriptor</strong> (đã lỗi thời — nay ở <code>$Extend$Secure</code>), <strong>Attribute list</strong> (vị trí các bản ghi MFT bổ sung, nếu cần), <strong>Object ID</strong> (định danh tệp 64 bit duy nhất trong volume), <strong>Reparse point</strong> (dùng cho mounting và liên kết tượng trưng), <strong>Volume name</strong>, <strong>Volume information</strong>, <strong>Index root</strong> (dùng cho thư mục), <strong>Index allocation</strong> và <strong>Bitmap</strong> (cho thư mục rất lớn), <strong>Logged utility stream</strong> (điều khiển ghi nhật ký vào <code>$LogFile</code>) và <strong>Data</strong> (dữ liệu luồng; <em>có thể lặp</em>).</p>
<p>Dòng cuối — "Data: dữ liệu luồng; <strong>có thể lặp</strong>" — là chìa khoá. Một tệp có thể có <em>nhiều</em> thuộc tính dữ liệu, mỗi cái có tên. Cái không tên là "tệp" bạn thường thấy; các cái khác là <strong>luồng dữ liệu phụ (alternate data stream, ADS)</strong>. Microsoft ("File Streams") viết tên đầy đủ của chúng là <code>filename:streamname:$DATA</code>, vd <code>myfile.dat:stream1:$DATA</code>; luồng mặc định là <code>filename::$DATA</code>, tương đương <code>filename</code> thuần. "Mỗi luồng … có cỡ cấp phát, cỡ thực và độ dài dữ liệu hợp lệ riêng", trạng thái nén, mã hoá và thưa riêng; "không có mốc thời gian gắn với luồng"; và kiểu luồng là nội bộ ("người dùng không tạo được kiểu luồng mới"). Liệt kê luồng bằng <code>dir /r</code> hay <code>FindFirstStreamW</code>.</p>
<p>ADS dùng làm gì? Hợp pháp: trình duyệt lưu nguồn tải xuống trong luồng tên <code>Zone.Identifier</code> (cảnh báo "tệp này từ internet" của Windows — <em>mark of the web</em>), Explorer giữ ảnh thu nhỏ và thông tin tóm tắt, công cụ sao lưu giữ siêu dữ liệu. Bất hợp pháp: mã độc giấu dữ liệu trong luồng mà danh sách thư mục và cỡ tệp báo không bao giờ hiện, và trình quét bảo mật phải liệt kê luồng. <strong>Bất ngờ lớn cho lập trình viên:</strong> chép tệp NTFS sang USB FAT/exFAT, server Linux, tệp zip hay ổ đám mây và các luồng phụ <strong>lặng lẽ mất</strong>.</p>
<p>Linux không có ADS, nhưng có họ hàng gần nhất: <strong>thuộc tính mở rộng (xattr)</strong> — cặp tên/giá trị dán vào một inode (<code>user.*</code> cho chương trình, <code>security.*</code> cho SELinux, <code>system.posix_acl_*</code> cho ACL). Chương trình dưới đây dựng lại câu chuyện ADS từng bước trên <code>tmpfs</code>:</p>
<pre><code class="language-c">// Luồng dữ liệu phụ "tệp:luồng" của NTFS &lt;-&gt; thuộc tính mở rộng (xattr) của Linux: dữ liệu có tên gắn vào MỘT tệp
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/stat.h&gt;
#include &lt;sys/xattr.h&gt;

int main(void) {
    const char *path = "/dev/shm/report.txt";                  // tmpfs: hỗ trợ xattr user.* trên nhân mới
    int fd = open(path, O_CREAT | O_WRONLY | O_TRUNC, 0644);
    write(fd, "hello world", 11);                              // luồng MẶC ĐỊNH: report.txt::$DATA
    close(fd);
    const char *note = "scanned from the internet";            // như: echo ... &gt; report.txt:Zone.Identifier
    if (setxattr(path, "user.zone", note, strlen(note), 0) != 0) { perror("setxattr"); return 1; }
    const char *sum = "quarterly numbers, draft";
    setxattr(path, "user.summary", sum, strlen(sum), 0);
    struct stat st; stat(path, &amp;st);
    printf("ls sees: size %lld bytes - the extra data is invisible to size and to cat\\n", (long long)st.st_size);
    char names[256]; ssize_t n = listxattr(path, names, sizeof names);   // như FindFirstStreamW / dir /r
    printf("streams (xattr names):");
    for (char *p = names; p &lt; names + n; p += strlen(p) + 1) printf(" %s", p);
    printf("\\n");
    char buf[64]; ssize_t m = getxattr(path, "user.summary", buf, sizeof buf);
    printf("named stream \\"summary\\" = %zd bytes: %.*s\\n", m, (int)m, buf);
    // Chép bằng cp thường: luồng phụ MẤT, y như chép tệp NTFS sang FAT
    system("cp /dev/shm/report.txt /dev/shm/copy.txt");
    printf("after cp (no --preserve=xattr): copy has %zd xattr bytes of names\\n", listxattr("/dev/shm/copy.txt", names, sizeof names));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread ads-xattr.c -o ads-xattr &amp;&amp; ./ads-xattr<br>
ls sees: size 11 bytes - the extra data is invisible to size and to cat<br>
streams (xattr names): user.zone user.summary<br>
named stream "summary" = 24 bytes: quarterly numbers, draft<br>
after cp (no --preserve=xattr): copy has 0 xattr bytes of names</div>
<p>Nó tạo <code>report.txt</code> với 11 byte nội dung thường, dán hai giá trị có tên vào (<code>user.zone</code> ≈ <code>Zone.Identifier</code>; <code>user.summary</code>), và cho thấy: <code>stat</code> vẫn thấy <strong>cỡ 11</strong> (dữ liệu thêm vô hình với cỡ và với <code>cat</code> — đúng như ADS), <code>listxattr</code> liệt kê tên luồng (≈ <code>dir /r</code>), <code>getxattr</code> đọc một cái (24 byte), và một lệnh <code>cp</code> thường tạo bản sao với <strong>không</strong> thuộc tính mở rộng nào — đúng sự mất mát khi chép tệp NTFS sang FAT. (<code>cp -a</code> hay <code>--preserve=xattr</code> sẽ giữ chúng, như <code>robocopy /copyall</code> của Windows.) Khác biệt: xattr bị giới hạn cỡ và không dành cho dữ liệu lớn (một ADS có thể hàng gigabyte), và nhiều hệ thống tệp hay điểm mount Linux không bật chúng.</p>
<p class="pitfall">⚠️ "<em>Luồng dữ liệu phụ là tệp ẩn</em>" là không chính xác: nó là <em>thuộc tính dữ liệu khác của cùng bản ghi MFT</em>, không có mục thư mục riêng. Và "ADS có trên FAT" là sai — chúng chỉ tồn tại trên hệ thống tệp hỗ trợ luồng có tên (NTFS và ReFS trong bảng so sánh: "Named streams ✅").</p>`],
      [55, 'Storage Allocation (1)',
        `<p class="y-chinh">🎯 Figure 11-41: <strong>an MFT record for a three-run, nine-block stream</strong>. After the record header, the <em>standard information</em> and <em>file name</em> attributes comes the <strong>data attribute</strong>. In the figure its header says "0 9" (virtual blocks 0 to 9, i.e. nine blocks) and then three <strong>runs</strong>: "20 4", "64 2", "80 3" — each run is <em>(first disk block, number of blocks)</em>. So blocks 20–23, 64–65 and 80–82 on the disk hold the nine blocks of the file, in order. The remaining space in the 1-KB record is unused.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/fd27b919f63ceab5b52fa2140dd1409d3dbbc83c.svg" alt="Figure 11-41 computed: three runs (20, 4), (64, 2), (80, 3) → blocks 20–23, 64–65, 80–82: nine blocks of data" loading="lazy" /><p class="chu-thich">🧮 Figure 11-41 computed: three runs (20, 4), (64, 2), (80, 3) → blocks 20–23, 64–65, 80–82: nine blocks of data</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const DON_VI_NEN = 16;
// 3-run: [LCN bắt đầu, độ dài]
const RUN_3 = [[20, 4], [64, 2], [80, 3]];
// nen: mỗi đơn vị 16 khối → số khối còn lại sau khi nén (16 = không nén được) và khối đĩa bắt đầu
const NEN = [{ con: 8, lcn: 30 }, { con: 16, lcn: 40 }, { con: 8, lcn: 85 }];
function runCuaNen(units) {
  const runs = [];
  for (const u of units) {
    runs.push([u.lcn, u.con]);
    if (u.con &lt; DON_VI_NEN) runs.push([0, DON_VI_NEN - u.con]);       // phần "tiết kiệm được" = run rỗng
  }
  return runs;
}</code></pre></details>
<p>A <em>run</em> is NTFS's way of writing down "consecutive blocks" with two numbers instead of one number per block. A file stored in one piece needs a single run; a badly fragmented one needs many. This is the same reason ext4 replaced the old block-pointer lists with <strong>extents</strong>: a 1-GB contiguous file costs one extent record, not 262,144 block numbers. The size accounting is simple: file size in blocks = sum of run lengths (4 + 2 + 3 = 9).</p>
<p>Make Linux write the same idea. The program below builds an ext4 image (1-KiB blocks, so one block here ≈ one NTFS 1-KB unit), copies a file with data in blocks 0–3, 10–11 and 20–22 and holes between, and asks the file system for its <em>inode</em> — the Linux twin of the MFT record:</p>
<div class="out"># An NTFS MFT record lists a file's runs (start, length); an ext4 inode lists its extents. Same idea, different packaging<br>
# A tiny ext4 image with 1 KiB blocks (a "volume"; no mount needed)<br>
# Build a source file with data in blocks 0-3, 10-11 and 20-22 (holes between): 9 data blocks, like Figure 11-41<br>
$ dd if=/dev/urandom of=/tmp/src.bin bs=1024 seek=0 count=4 conv=notrunc 2&gt;/dev/null<br>
$ dd if=/dev/urandom of=/tmp/src.bin bs=1024 seek=10 count=2 conv=notrunc 2&gt;/dev/null<br>
$ dd if=/dev/urandom of=/tmp/src.bin bs=1024 seek=20 count=3 conv=notrunc 2&gt;/dev/null<br>
# Copy it into the volume (debugfs keeps holes as holes) and read the "MFT record" = the inode<br>
$ debugfs -R "stat runs.bin" /tmp/vol.img 2&gt;/dev/null | grep -E "^Inode:|^User:|^Links:|^EXTENTS|^\\("<br>
Inode: 12 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x80000<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 23552<br>
Links: 1 &nbsp;&nbsp;Blockcount: 18<br>
EXTENTS:<br>
(0-1):80-81, (2-3):83-84, (10-11):85-86, (20-22):87-89<br>
# Blockcount counts 512-byte sectors: 9 data blocks of 1 KiB = 18. The holes cost nothing<br>
# The directory entry holds only a name and the inode number (the "MFT index")<br>
$ debugfs -R "ls /" /tmp/vol.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(968) runs.bin</div>
<p>Read the <code>EXTENTS:</code> line: <code>(0-1):80-81, (2-3):83-84, (10-11):85-86, (20-22):87-89</code> — each entry is <em>(file block range):(disk block range)</em>, i.e. the same <em>(where, how long)</em> pairs as the NTFS runs. The file has <strong>9 data blocks</strong> in four extents (the allocator happened to split the first four blocks around one block used for metadata, so four extents rather than the three you expect — real file systems do not always match the textbook figure). <strong>Blockcount: 18</strong> counts 512-byte sectors: 9 blocks × 2 = 18 — <strong>the holes cost nothing</strong>, just as a <em>sparse</em> NTFS file stores only the runs that have data. The file is 23,552 bytes long (23 KiB) but occupies 9 KiB on disk. The last command shows the directory: just names and inode numbers (<code>12 runs.bin</code>) — the entry points at the inode as an NTFS directory entry points at the MFT record.</p>
<p><strong>Capacity of one record:</strong> ext4 stores up to <strong>four extents inside the inode itself</strong> (the 60-byte <code>i_block</code> area: a 12-byte header and four 12-byte extents; this run used exactly four); more extents need an <em>extent tree</em> of extra blocks. NTFS stores as many runs as fit in the 1-KB record, then continues in <em>extension records</em> (next slide).</p>
<p class="pitfall">⚠️ <strong>Run length, not end address.</strong> "<code>20 4</code>" means 4 blocks starting at 20 (blocks 20, 21, 22, 23), not "from 20 to 4". A common exam slip is to read the second number as an end block. Another: "0 9" in the header is the <em>virtual</em> range of the file, unrelated to disk block numbers.</p>`,
        `<p class="y-chinh">🎯 Hình 11-41: <strong>một bản ghi MFT cho luồng 9 khối trong 3 run</strong>. Sau đầu bản ghi, các thuộc tính <em>standard information</em> và <em>file name</em> là <strong>thuộc tính dữ liệu</strong>. Trong hình phần đầu của nó ghi "0 9" (khối ảo 0 tới 9, tức chín khối) rồi ba <strong>run</strong>: "20 4", "64 2", "80 3" — mỗi run là <em>(khối đĩa đầu, số khối)</em>. Vậy khối 20–23, 64–65 và 80–82 trên đĩa chứa chín khối của tệp, theo thứ tự. Phần còn lại của bản ghi 1 KB không dùng.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/22d67e2fb65dabf2bbeca0c4f2f37e33c592ce83.svg" alt="Hình 11-41 được tính ra: ba run (20, 4), (64, 2), (80, 3) → khối 20–23, 64–65, 80–82: chín khối dữ liệu" loading="lazy" /><p class="chu-thich">🧮 Hình 11-41 được tính ra: ba run (20, 4), (64, 2), (80, 3) → khối 20–23, 64–65, 80–82: chín khối dữ liệu</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const DON_VI_NEN = 16;
// 3-run: [LCN bắt đầu, độ dài]
const RUN_3 = [[20, 4], [64, 2], [80, 3]];
// nen: mỗi đơn vị 16 khối → số khối còn lại sau khi nén (16 = không nén được) và khối đĩa bắt đầu
const NEN = [{ con: 8, lcn: 30 }, { con: 16, lcn: 40 }, { con: 8, lcn: 85 }];
function runCuaNen(units) {
  const runs = [];
  for (const u of units) {
    runs.push([u.lcn, u.con]);
    if (u.con &lt; DON_VI_NEN) runs.push([0, DON_VI_NEN - u.con]);       // phần "tiết kiệm được" = run rỗng
  }
  return runs;
}</code></pre></details>
<p><em>Run</em> là cách NTFS ghi "các khối liên tiếp" bằng hai số thay vì một số cho mỗi khối. Tệp lưu một mảnh cần một run; tệp phân mảnh nặng cần nhiều. Đó cũng là lý do ext4 thay danh sách con trỏ khối cũ bằng <strong>extent</strong>: một tệp 1 GB liền mạch tốn một bản ghi extent, không phải 262.144 số khối. Kế toán kích thước đơn giản: cỡ tệp theo khối = tổng độ dài các run (4 + 2 + 3 = 9).</p>
<p>Cho Linux viết cùng ý. Chương trình dưới đây dựng một ảnh ext4 (khối 1 KiB, nên một khối ở đây ≈ một đơn vị 1 KB của NTFS), chép vào một tệp có dữ liệu ở khối 0–3, 10–11 và 20–22 với lỗ trống giữa, và hỏi hệ thống tệp về <em>inode</em> của nó — bản sinh đôi Linux của bản ghi MFT:</p>
<div class="out"># Bản ghi MFT của NTFS liệt kê các run (điểm đầu, độ dài) của tệp; inode của ext4 liệt kê các extent. Cùng ý tưởng, đóng gói khác<br>
# Một ảnh ext4 nhỏ khối 1 KiB (một "volume"; không cần mount)<br>
# Dựng tệp nguồn có dữ liệu ở khối 0-3, 10-11 và 20-22 (có lỗ trống giữa): 9 khối dữ liệu, như Hình 11-41<br>
$ dd if=/dev/urandom of=/tmp/src.bin bs=1024 seek=0 count=4 conv=notrunc 2&gt;/dev/null<br>
$ dd if=/dev/urandom of=/tmp/src.bin bs=1024 seek=10 count=2 conv=notrunc 2&gt;/dev/null<br>
$ dd if=/dev/urandom of=/tmp/src.bin bs=1024 seek=20 count=3 conv=notrunc 2&gt;/dev/null<br>
# Chép vào volume (debugfs giữ lỗ trống là lỗ trống) rồi đọc "bản ghi MFT" = inode<br>
$ debugfs -R "stat runs.bin" /tmp/vol.img 2&gt;/dev/null | grep -E "^Inode:|^User:|^Links:|^EXTENTS|^\\("<br>
Inode: 12 &nbsp;&nbsp;Type: regular &nbsp;&nbsp;&nbsp;Mode: &nbsp;0644 &nbsp;&nbsp;Flags: 0x80000<br>
User: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Group: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Project: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;Size: 23552<br>
Links: 1 &nbsp;&nbsp;Blockcount: 18<br>
EXTENTS:<br>
(0-1):80-81, (2-3):83-84, (10-11):85-86, (20-22):87-89<br>
# Blockcount đếm sector 512 byte: 9 khối dữ liệu 1 KiB = 18. Các lỗ trống không tốn gì<br>
# Mục thư mục chỉ chứa tên và số inode (chỉ số "MFT")<br>
$ debugfs -R "ls /" /tmp/vol.img 2&gt;/dev/null<br>
&nbsp;2 &nbsp;(12) . &nbsp;&nbsp;&nbsp;2 &nbsp;(12) .. &nbsp;&nbsp;&nbsp;11 &nbsp;(20) lost+found &nbsp;&nbsp;&nbsp;12 &nbsp;(968) runs.bin</div>
<p>Đọc dòng <code>EXTENTS:</code>: <code>(0-1):80-81, (2-3):83-84, (10-11):85-86, (20-22):87-89</code> — mỗi mục là <em>(dải khối của tệp):(dải khối đĩa)</em>, tức cùng các cặp <em>(ở đâu, dài bao nhiêu)</em> như run NTFS. Tệp có <strong>9 khối dữ liệu</strong> trong bốn extent (bộ cấp phát tình cờ chia bốn khối đầu quanh một khối dùng cho siêu dữ liệu, nên bốn extent thay vì ba như bạn kỳ vọng — hệ thống tệp thật không phải lúc nào cũng khớp hình sách). <strong>Blockcount: 18</strong> đếm sector 512 byte: 9 khối × 2 = 18 — <strong>các lỗ trống không tốn gì</strong>, như tệp NTFS <em>thưa</em> chỉ lưu các run có dữ liệu. Tệp dài 23.552 byte (23 KiB) nhưng chiếm 9 KiB trên đĩa. Lệnh cuối cho thấy thư mục: chỉ tên và số inode (<code>12 runs.bin</code>) — mục trỏ tới inode như mục thư mục NTFS trỏ tới bản ghi MFT.</p>
<p><strong>Sức chứa của một bản ghi:</strong> ext4 lưu tới <strong>bốn extent ngay trong inode</strong> (vùng <code>i_block</code> 60 byte: phần đầu 12 byte và bốn extent 12 byte; lần chạy này dùng đúng bốn); nhiều extent hơn cần một <em>cây extent</em> trong các khối thêm. NTFS lưu bao nhiêu run vừa trong bản ghi 1 KB, rồi tiếp tục trong <em>bản ghi mở rộng</em> (slide sau).</p>
<p class="pitfall">⚠️ <strong>Độ dài run, không phải địa chỉ cuối.</strong> "<code>20 4</code>" nghĩa là 4 khối bắt đầu từ 20 (khối 20, 21, 22, 23), không phải "từ 20 tới 4". Cú trượt thi hay gặp là đọc số thứ hai thành khối cuối. Một cái khác: "0 9" ở phần đầu là dải <em>ảo</em> của tệp, không liên quan số khối đĩa.</p>`],
      [56, 'Storage Allocation (2)',
        `<p class="y-chinh">🎯 Figure 11-42: <strong>a file that requires three MFT records to store all its runs</strong>. The <em>base record</em> (record 102) holds the first runs (Run #1 … Run #k) and an <strong>attribute list</strong> that says "more of this file is in MFT 105 and MFT 108". The <em>first extension record</em> (105) holds Run #k+1 … Run #m, and the <em>second extension record</em> (108) holds Run #m+1 … Run #n. So a file with thousands of fragments is still just one file whose base record points to extras.</p>
<p>Think of an address book where one person has so many phone numbers that they do not fit on one card. The first card says "continued on cards 105 and 108". Readers who only need the name never leave the first card; readers who need <em>all</em> numbers follow the pointers. The 1-KB record size is a trade-off: small enough to read in one disk access for the common small file, big enough to hold the attributes and several runs.</p>
<p>When does this happen in real life? With <strong>heavily fragmented files</strong>: a virtual-machine disk image or a database file that has grown slowly over years, or a log file appended to by many programs. Each fragment is a run; with, say, 1,000 fragments a 1-KB record cannot hold them. A file system that can describe such files <em>cheaply</em> and still keep the common case (one or two runs) tiny is exactly what NTFS's two-level design achieves. In ext4 the cousin is the <em>extent tree</em> (up to four extents in the inode, then index blocks pointing to leaf blocks) and, in older ext2/3, the <em>indirect blocks</em> you computed in Chapter 4.</p>
<p><strong>How to tell fragmentation on Linux:</strong> <code>filefrag file</code> prints the number of extents; <code>e4defrag</code> can defragment. Windows has <code>defrag.exe</code>, <code>Optimize-Volume</code>, and, since SSDs, "retrim" instead of defragment — because fragmentation hurts hard disks (seeks) far more than SSDs (Chapter 5).</p>
<p><strong>Tiny files cost nothing extra:</strong> if a file's data fits inside the MFT record itself, the <em>data attribute is "resident"</em> and no data block is allocated at all (the book mentions this); ext4 has the same feature, called <code>inline_data</code>, but it is off by default. For a server that stores millions of tiny files (session files, thumbnails) the file system's handling of small files matters more than its raw throughput.</p>
<p class="pitfall">⚠️ The numbers 105, 108, 102 in the figure are <em>MFT record numbers</em>, not disk blocks and not run lengths. And an extension record is <em>not</em> a copy: it holds <em>additional</em> runs not present in the base record.</p>`,
        `<p class="y-chinh">🎯 Hình 11-42: <strong>một tệp cần ba bản ghi MFT để lưu hết các run</strong>. <em>Bản ghi gốc</em> (bản ghi 102) giữ các run đầu (Run #1 … Run #k) và một <strong>danh sách thuộc tính</strong> nói "phần còn lại của tệp này ở MFT 105 và MFT 108". <em>Bản ghi mở rộng thứ nhất</em> (105) giữ Run #k+1 … Run #m, và <em>bản ghi mở rộng thứ hai</em> (108) giữ Run #m+1 … Run #n. Vậy một tệp có hàng nghìn mảnh vẫn chỉ là một tệp mà bản ghi gốc trỏ tới các bản ghi phụ.</p>
<p>Hình dung sổ địa chỉ mà một người có quá nhiều số điện thoại nên không vừa một thẻ. Thẻ đầu ghi "tiếp ở thẻ 105 và 108". Người đọc chỉ cần tên thì không rời thẻ đầu; người cần <em>mọi</em> số theo các con trỏ. Cỡ bản ghi 1 KB là một sự đánh đổi: đủ nhỏ để đọc trong một lần truy cập đĩa với tệp nhỏ thường gặp, đủ lớn để chứa các thuộc tính và vài run.</p>
<p>Khi nào chuyện này xảy ra ngoài đời? Với <strong>tệp phân mảnh nặng</strong>: ảnh đĩa máy ảo hay tệp cơ sở dữ liệu lớn dần qua nhiều năm, hay tệp log được nhiều chương trình nối thêm. Mỗi mảnh là một run; với, giả sử, 1.000 mảnh thì một bản ghi 1 KB không chứa nổi. Hệ thống tệp mô tả được tệp như vậy <em>rẻ</em> mà vẫn giữ trường hợp thường (một hai run) rất nhỏ chính là điều thiết kế hai tầng của NTFS đạt được. Ở ext4 họ hàng là <em>cây extent</em> (tối đa bốn extent trong inode, rồi khối chỉ mục trỏ tới khối lá) và, ở ext2/3 cũ, các <em>khối gián tiếp</em> bạn đã tính ở Chương 4.</p>
<p><strong>Biết phân mảnh trên Linux thế nào:</strong> <code>filefrag file</code> in số extent; <code>e4defrag</code> chống phân mảnh được. Windows có <code>defrag.exe</code>, <code>Optimize-Volume</code>, và, từ SSD, "retrim" thay cho chống phân mảnh — vì phân mảnh hại đĩa cứng (seek) nhiều hơn SSD (Chương 5).</p>
<p><strong>Tệp bé không tốn thêm:</strong> nếu dữ liệu của tệp vừa trong chính bản ghi MFT, <em>thuộc tính dữ liệu "thường trú (resident)"</em> và không cấp khối dữ liệu nào (sách có nhắc); ext4 có tính năng tương tự, gọi <code>inline_data</code>, nhưng mặc định tắt. Với server lưu hàng triệu tệp nhỏ (tệp phiên, ảnh thu nhỏ), cách hệ thống tệp xử lý tệp nhỏ quan trọng hơn thông lượng thô.</p>
<p class="pitfall">⚠️ Các số 105, 108, 102 trong hình là <em>số bản ghi MFT</em>, không phải khối đĩa và không phải độ dài run. Và bản ghi mở rộng <em>không</em> phải bản sao: nó giữ các run <em>thêm</em> không có trong bản ghi gốc.</p>`],
      [57, 'Storage Allocation (3)',
        `<p class="y-chinh">🎯 Figure 11-43: <strong>the MFT record for a small directory</strong>. A directory is a file whose data is a sorted index. In a small directory the index lives <em>inside the MFT record</em> in an <strong>index root</strong> attribute: a list of entries, each with "the <strong>MFT index for the file</strong>, the <strong>length of the file name</strong>, the <strong>file name itself</strong> and various fields and flags". Standard-information and index-root headers precede the entries; the rest of the record is unused.</p>
<p>The index root is a <em>mini phone book inside one card</em>: for each file name, the number of that file's own MFT record. Looking up <code>bar</code> in directory <code>foo</code> means reading foo's record, finding the entry "bar → record 417", and then reading record 417 — step 7 of the opening procedure on slide 24. Names are kept <strong>sorted</strong>, so the search can be a binary search rather than a scan.</p>
<p>When a directory grows too large for one record, NTFS converts it to a <strong>B+ tree</strong>: the record keeps an index root pointing to <strong>index allocation</strong> blocks (and a <strong>bitmap</strong> saying which of them are in use) — the attributes you saw in Figure 11-40. Microsoft's "File Streams" page confirms the vocabulary: <code>$INDEX_ROOT</code> "represents root of the b-tree of an index" and is present on every directory; <code>$INDEX_ALLOCATION</code> is "the stream type of a directory … used to implement filename allocation for large directories", with default stream name <code>$I30</code>; <code>$BITMAP</code> manages "the allocation of these chunks" (4 KB chunks, regardless of cluster size). A directory with a million files stays fast because each lookup walks only a few levels.</p>
<p>ext4's equivalent is the <strong>htree</strong> (hashed B-tree directories, <code>dir_index</code>), which solved the old ext2 problem of scanning directories linearly. Compare costs: a directory with 100,000 entries in a purely linear format needs on average 50,000 name comparisons; a B-tree needs a handful. This matters for backend work — a cache directory or upload folder with millions of files is routine, so choose a layout that spreads files across subdirectories (like Git's <code>.git/objects/ab/cdef…</code> trick) regardless of file system.</p>
<p>The last lines of the program on slide 55 showed the Linux directory entry: <code>12 runs.bin</code> — an inode number and a name, exactly the pair that Figure 11-43 draws for NTFS (MFT index and name). <code>ls -i</code> prints the same inode numbers; <code>ls -l</code> adds the attributes <em>read from the inode</em>, not from the directory — which is why <code>ls -l</code> of a huge directory is slow (one inode read per file) while a name-only <code>ls -f</code> is quick. Windows Explorer and <code>dir</code> are slow on big folders for the same reason: file names come from the directory index, sizes and dates from each file's MFT record (although NTFS also duplicates some of them into the index entry to speed this up — another trade-off).</p>
<p class="pitfall">⚠️ "<em>A directory is a special kind of file</em>" is true in both worlds — and the data is the <em>index</em>. In NTFS a directory is still an MFT record with attributes (<code>$INDEX_ROOT</code>, maybe <code>$INDEX_ALLOCATION</code> and <code>$BITMAP</code>), not a different kind of structure.</p>`,
        `<p class="y-chinh">🎯 Hình 11-43: <strong>bản ghi MFT cho một thư mục nhỏ</strong>. Thư mục là một tệp mà dữ liệu là một chỉ mục đã sắp xếp. Trong thư mục nhỏ chỉ mục nằm <em>ngay trong bản ghi MFT</em> ở thuộc tính <strong>index root</strong>: một danh sách các mục, mỗi mục có "<strong>chỉ số MFT của tệp</strong>, <strong>độ dài tên tệp</strong>, <strong>chính tên tệp</strong> và các trường cùng cờ khác". Phần đầu standard-information và index-root đứng trước các mục; phần còn lại của bản ghi không dùng.</p>
<p>Index root là một <em>danh bạ nhỏ trong một thẻ</em>: với mỗi tên tệp, số bản ghi MFT riêng của tệp đó. Tìm <code>bar</code> trong thư mục <code>foo</code> nghĩa là đọc bản ghi của foo, tìm mục "bar → bản ghi 417", rồi đọc bản ghi 417 — bước 7 của thủ tục mở ở slide 24. Các tên được giữ <strong>có thứ tự</strong>, nên tìm kiếm có thể là tìm nhị phân thay vì quét.</p>
<p>Khi thư mục lớn quá một bản ghi, NTFS chuyển nó thành <strong>cây B+</strong>: bản ghi giữ một index root trỏ tới các khối <strong>index allocation</strong> (và một <strong>bitmap</strong> nói khối nào đang dùng) — các thuộc tính bạn thấy ở Hình 11-40. Trang "File Streams" của Microsoft xác nhận từ vựng: <code>$INDEX_ROOT</code> "biểu diễn gốc của cây b của một chỉ mục" và có trên mọi thư mục; <code>$INDEX_ALLOCATION</code> là "kiểu luồng của một thư mục … dùng để cài cấp phát tên tệp cho thư mục lớn", với tên luồng mặc định <code>$I30</code>; <code>$BITMAP</code> quản lý "việc cấp phát các mảnh này" (mảnh 4 KB, bất kể cỡ cluster). Một thư mục có một triệu tệp vẫn nhanh vì mỗi lần tra chỉ đi qua vài tầng.</p>
<p>Tương đương của ext4 là <strong>htree</strong> (thư mục B-tree băm, <code>dir_index</code>), giải quyết vấn đề cũ của ext2 là quét thư mục tuyến tính. So chi phí: thư mục 100.000 mục ở định dạng tuyến tính thuần cần trung bình 50.000 lần so sánh tên; B-tree cần một nắm. Điều này quan trọng với việc backend — thư mục cache hay thư mục upload có hàng triệu tệp là chuyện thường, nên hãy chọn bố cục rải tệp ra các thư mục con (như mẹo <code>.git/objects/ab/cdef…</code> của Git) bất kể hệ thống tệp.</p>
<p>Các dòng cuối của chương trình ở slide 55 cho thấy mục thư mục Linux: <code>12 runs.bin</code> — một số inode và một tên, đúng cặp mà Hình 11-43 vẽ cho NTFS (chỉ số MFT và tên). <code>ls -i</code> in cùng các số inode; <code>ls -l</code> thêm các thuộc tính <em>đọc từ inode</em>, không từ thư mục — vì vậy <code>ls -l</code> của thư mục khổng lồ chậm (mỗi tệp một lần đọc inode) trong khi <code>ls -f</code> chỉ tên thì nhanh. Windows Explorer và <code>dir</code> chậm trên thư mục lớn vì cùng lý do: tên tệp lấy từ chỉ mục thư mục, cỡ và ngày từ bản ghi MFT của từng tệp (dù NTFS cũng sao một số vào mục chỉ mục để tăng tốc — một sự đánh đổi khác).</p>
<p class="pitfall">⚠️ "<em>Thư mục là một loại tệp đặc biệt</em>" đúng ở cả hai thế giới — và dữ liệu là <em>chỉ mục</em>. Trong NTFS một thư mục vẫn là một bản ghi MFT có thuộc tính (<code>$INDEX_ROOT</code>, có thể <code>$INDEX_ALLOCATION</code> và <code>$BITMAP</code>), không phải một loại cấu trúc khác.</p>`],
      [58, 'File Compression',
        `<p class="y-chinh">🎯 Figure 11-44: <strong>(a) a 48-block file compressed to 32 blocks; (b) the MFT record of the file after compression</strong>. NTFS compresses in <strong>units of 16 blocks</strong>. In the figure: unit 1 (blocks 0–15) compresses to 8 blocks stored at disk blocks 30–37; unit 2 (blocks 16–31) does <em>not</em> compress and stays at 16 blocks (disk 40–55); unit 3 (blocks 32–47) compresses to 8 blocks (disk 85–92). The MFT record lists <strong>five runs</strong>, two of them <em>empty</em> (disk address 0): <code>0 48 | 30 8 | 0 8 | 40 16 | 85 8 | 0 8</code>. An empty run means "these blocks are not stored" — the gap that decompression refills.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cd47de5128ad60f995f3e0e525c0dae73ece2727.svg" alt="Figure 11-44 computed: three 16-block units (16 → 8, 16 → 16, 16 → 8) give 32 disk blocks and five runs, two of them empty" loading="lazy" /><p class="chu-thich">🧮 Figure 11-44 computed: three 16-block units (16 → 8, 16 → 16, 16 → 8) give 32 disk blocks and five runs, two of them empty</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const DON_VI_NEN = 16;
// 3-run: [LCN bắt đầu, độ dài]
const RUN_3 = [[20, 4], [64, 2], [80, 3]];
// nen: mỗi đơn vị 16 khối → số khối còn lại sau khi nén (16 = không nén được) và khối đĩa bắt đầu
const NEN = [{ con: 8, lcn: 30 }, { con: 16, lcn: 40 }, { con: 8, lcn: 85 }];
function runCuaNen(units) {
  const runs = [];
  for (const u of units) {
    runs.push([u.lcn, u.con]);
    if (u.con &lt; DON_VI_NEN) runs.push([0, DON_VI_NEN - u.con]);       // phần "tiết kiệm được" = run rỗng
  }
  return runs;
}</code></pre></details>
<p>The rule is a good exam question: a unit is stored compressed <strong>only if it saves at least one block</strong>; otherwise it is kept as is. Reads decompress a whole 16-block unit at a time, which is why random access in a compressed file costs more CPU. The trade-off is the classic one: you spend CPU to save disk space and (on slow disks) disk time. On a modern SSD with a fast CPU the winner depends on the data: text and source code compress well; JPEG, MP4 and encrypted data do not — slide 58's example unit 2 is exactly such a "does not compress" case.</p>
<p>Linux does <strong>transparent compression</strong> in the <em>file system</em> only in some designs: Btrfs (<code>compress=zstd</code> mount option), ZFS (<code>compression=lz4</code>), F2FS and SquashFS (read-only). ext4 has none, and databases (PostgreSQL TOAST, <code>pg_dump -Z</code>) and web servers (<code>gzip</code>, Brotli over HTTP) compress at higher layers instead. A modern backend developer rarely uses NTFS compression; it matters for the oral exam because it shows <em>how a file system maps logical blocks to runs</em> — the skill of slides 55–57.</p>
<p><strong>➕ What replaced and extended NTFS (sources: Microsoft Learn "ReFS overview" and "Dev Drive").</strong> <strong>ReFS</strong> (Resilient File System) is "a modern file system developed by Microsoft to maximize data availability, scale efficiently to large data sets … and provide data integrity with resiliency to corruption": <em>checksums for metadata and optionally for data</em> ("integrity streams") with automatic repair when used with Storage Spaces, <em>block cloning</em> (copying a range of bytes as a cheap metadata operation), <em>sparse VDL</em> (zero a file almost instantly), volumes up to <strong>35 PB</strong>, and no support for booting from it. <strong>Dev Drive</strong> (Windows 11, build 10.0.22621.2338 or later; minimum 50 GB; <em>"Dev Drives are available on all Windows SKU versions"</em>) is a <em>ReFS-formatted</em> volume for developers: "Source code repositories and project files", "Package caches" (npm, NuGet, pip, Maven, Gradle, Cargo …) and "Build output and intermediate files". Its main trick is to turn off every filter driver except antivirus and let Microsoft Defender use <strong>performance mode</strong> (asynchronous scanning) on a volume you have marked <em>trusted</em> (<code>fsutil devdrv trust D:</code>); starting with Windows 11 24H2 and Windows Server 2025 it also gets block cloning. Create one with <code>Format D: /DevDrv /Q</code> or <code>Format-Volume -DriveLetter D -DevDrive</code>.</p>
<p class="pitfall">⚠️ <strong>Dev Drive is not for WSL files.</strong> Microsoft's FAQ: WSL "runs in a VHD and for the best performance files should be stored on the Linux file system"; accessing Dev Drive files from Linux through WSL gives <em>no</em> speed-up, and the WSL <code>metadata</code> mount option (Linux permissions in extended attributes) "is not supported on ReFS". Use a Dev Drive for Windows-side tools (Visual Studio, Node on Windows, Git for Windows); keep Linux projects inside the Linux distribution.</p>
<div class="callout">🧭 <strong>On a real server:</strong> for a Windows file server, ReFS is recommended for virtualization and backup targets (Hyper-V VHDX operations get faster with block clone and sparse VDL), NTFS for everything else; for your laptop, a Dev Drive speeds up <code>npm install</code> and builds mostly because antivirus does less work per file (slide 23).</div>`,
        `<p class="y-chinh">🎯 Hình 11-44: <strong>(a) một tệp 48 khối nén xuống 32 khối; (b) bản ghi MFT của tệp sau khi nén</strong>. NTFS nén theo <strong>đơn vị 16 khối</strong>. Trong hình: đơn vị 1 (khối 0–15) nén còn 8 khối lưu ở khối đĩa 30–37; đơn vị 2 (khối 16–31) <em>không</em> nén được và giữ 16 khối (đĩa 40–55); đơn vị 3 (khối 32–47) nén còn 8 khối (đĩa 85–92). Bản ghi MFT liệt kê <strong>năm run</strong>, hai trong số đó <em>rỗng</em> (địa chỉ đĩa 0): <code>0 48 | 30 8 | 0 8 | 40 16 | 85 8 | 0 8</code>. Run rỗng nghĩa là "các khối này không được lưu" — khoảng trống mà giải nén lấp lại.</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/cab320774fa48e63a37bc0966e296e50068a4fb0.svg" alt="Hình 11-44 được tính ra: ba đơn vị 16 khối (16 → 8, 16 → 16, 16 → 8) cho 32 khối đĩa và năm run, hai cái rỗng" loading="lazy" /><p class="chu-thich">🧮 Hình 11-44 được tính ra: ba đơn vị 16 khối (16 → 8, 16 → 16, 16 → 8) cho 32 khối đĩa và năm run, hai cái rỗng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const DON_VI_NEN = 16;
// 3-run: [LCN bắt đầu, độ dài]
const RUN_3 = [[20, 4], [64, 2], [80, 3]];
// nen: mỗi đơn vị 16 khối → số khối còn lại sau khi nén (16 = không nén được) và khối đĩa bắt đầu
const NEN = [{ con: 8, lcn: 30 }, { con: 16, lcn: 40 }, { con: 8, lcn: 85 }];
function runCuaNen(units) {
  const runs = [];
  for (const u of units) {
    runs.push([u.lcn, u.con]);
    if (u.con &lt; DON_VI_NEN) runs.push([0, DON_VI_NEN - u.con]);       // phần "tiết kiệm được" = run rỗng
  }
  return runs;
}</code></pre></details>
<p>Quy tắc là một câu thi hay: một đơn vị được lưu nén <strong>chỉ khi tiết kiệm được ít nhất một khối</strong>; nếu không giữ nguyên. Đọc giải nén cả một đơn vị 16 khối mỗi lần, nên truy cập ngẫu nhiên trong tệp nén tốn CPU hơn. Sự đánh đổi kinh điển: dùng CPU để tiết kiệm chỗ đĩa và (trên đĩa chậm) thời gian đĩa. Trên SSD hiện đại với CPU nhanh, bên thắng tuỳ dữ liệu: văn bản và mã nguồn nén tốt; JPEG, MP4 và dữ liệu mã hoá thì không — đơn vị 2 trong ví dụ chính là trường hợp "không nén được".</p>
<p>Linux làm <strong>nén trong suốt</strong> ở <em>hệ thống tệp</em> chỉ trong vài thiết kế: Btrfs (tuỳ chọn mount <code>compress=zstd</code>), ZFS (<code>compression=lz4</code>), F2FS và SquashFS (chỉ đọc). ext4 không có, và cơ sở dữ liệu (TOAST của PostgreSQL, <code>pg_dump -Z</code>) cùng web server (<code>gzip</code>, Brotli trên HTTP) nén ở tầng cao hơn. Lập trình viên backend hiện đại hiếm dùng nén NTFS; nó quan trọng cho vấn đáp vì cho thấy <em>hệ thống tệp ánh xạ khối logic sang run thế nào</em> — kỹ năng của slide 55–57.</p>
<p><strong>➕ Cái gì thay thế và mở rộng NTFS (nguồn: Microsoft Learn "ReFS overview" và "Dev Drive").</strong> <strong>ReFS</strong> (Resilient File System) là "hệ thống tệp hiện đại do Microsoft phát triển để tối đa hoá tính sẵn sàng của dữ liệu, mở rộng hiệu quả tới tập dữ liệu lớn … và cung cấp toàn vẹn dữ liệu với khả năng chịu hỏng": <em>checksum cho siêu dữ liệu và tuỳ chọn cho dữ liệu</em> ("integrity streams") với tự sửa khi dùng cùng Storage Spaces, <em>block cloning</em> (chép một dải byte như một thao tác siêu dữ liệu rẻ), <em>sparse VDL</em> (xoá sạch một tệp gần như tức thì), volume tới <strong>35 PB</strong>, và không hỗ trợ khởi động từ nó. <strong>Dev Drive</strong> (Windows 11, build 10.0.22621.2338 trở lên; tối thiểu 50 GB; <em>"Dev Drive có trên mọi SKU Windows"</em>) là volume <em>định dạng ReFS</em> cho lập trình viên: "kho mã nguồn và tệp dự án", "bộ đệm gói" (npm, NuGet, pip, Maven, Gradle, Cargo …) và "đầu ra build cùng tệp trung gian". Mẹo chính là tắt mọi driver lọc trừ antivirus và để Microsoft Defender dùng <strong>chế độ hiệu năng</strong> (quét bất đồng bộ) trên volume bạn đã đánh dấu <em>tin cậy</em> (<code>fsutil devdrv trust D:</code>); từ Windows 11 24H2 và Windows Server 2025 nó còn có block cloning. Tạo bằng <code>Format D: /DevDrv /Q</code> hay <code>Format-Volume -DriveLetter D -DevDrive</code>.</p>
<p class="pitfall">⚠️ <strong>Dev Drive không dành cho tệp WSL.</strong> FAQ của Microsoft: WSL "chạy trong một VHD và để có hiệu năng tốt nhất tệp nên lưu trên hệ thống tệp Linux"; truy cập tệp Dev Drive từ Linux qua WSL <em>không</em> nhanh hơn, và tuỳ chọn mount <code>metadata</code> của WSL (quyền Linux trong thuộc tính mở rộng) "không được hỗ trợ trên ReFS". Dùng Dev Drive cho công cụ phía Windows (Visual Studio, Node trên Windows, Git for Windows); giữ dự án Linux bên trong bản phân phối Linux.</p>
<div class="callout">🧭 <strong>Trên server thật:</strong> với máy chủ tệp Windows, ReFS được khuyến nghị cho ảo hoá và đích sao lưu (thao tác Hyper-V VHDX nhanh hơn nhờ block clone và sparse VDL), NTFS cho mọi thứ khác; với laptop của bạn, Dev Drive tăng tốc <code>npm install</code> và build chủ yếu vì antivirus làm ít việc hơn cho mỗi tệp (slide 23).</div>`],
      [59, 'Security in Windows 8',
        `<p class="y-chinh">🎯 <strong>Security properties inherited from NT</strong>: <strong>(1)</strong> secure login with anti-spoofing measures; <strong>(2)</strong> discretionary access controls; <strong>(3)</strong> privileged access controls; <strong>(4)</strong> address-space protection per process; <strong>(5)</strong> new pages must be zeroed before being mapped in; <strong>(6)</strong> security auditing.</p>
<p>Six locks on one house. (1) The front door asks for ID, and a fake doorbell cannot trick you: Windows's login screen is reached by a key combination that only the kernel can receive (<strong>Ctrl+Alt+Del</strong>, the <em>secure attention sequence</em>), so a program cannot paint a fake login window. (2) <strong>Discretionary</strong>: the owner of a file decides who may open it (the DACL, slide 61). (3) <strong>Privileged</strong>: some actions (load a driver, back up all files, change the clock) need a <em>privilege</em> in the token — not just a file permission (slide 60). (4) Each process lives in its own address space (Chapter 3) — one cannot read another's memory. (5) A page given to a new process is wiped first, so you never find another process's passwords in "fresh" memory. (6) <em>Auditing</em>: the system can log who tried what (the SACL, slide 61).</p>
<p>Every item has a Linux twin you can run: (1) <strong>login</strong> (PAM, <code>login</code>, SSH keys); (2) <strong>mode bits and ACLs</strong> (<code>chmod</code>, <code>setfacl</code>) — slide 32; (3) <strong>capabilities</strong> (<code>CAP_NET_ADMIN</code>, <code>CAP_SYS_PTRACE</code>…) — slide 60; (4) <strong>MMU isolation</strong> per process; (5) <strong>zero-fill-on-demand</strong> — you saw "fresh page first byte: 0" on slide 41, and the zeroed list on slide 48; (6) <strong>auditd</strong> and <code>journald</code>. It is striking how much of the list is shared: the 1960s–70s ideas (Multics, UNIX) are the foundation of both.</p>
<p><strong>Item 5 deserves a security story</strong>: zeroing pages is the reason a stolen-memory attack has to read <em>live</em> memory, not leftovers; it is also why a freshly started database does not "inherit" data from the process that ran before it. (If a system skipped zeroing, a "memory remanence" bug would leak secrets between users — the same family of bug as Heartbleed's leakage <em>inside</em> one process, which no page-zeroing can prevent.) The deck gave a slide to each of these six points, but each is one line; the real story is in the next four slides, which show <em>how</em> (3) and (2) are implemented.</p>
<p><strong>➕ Windows 10/11 added a seventh layer:</strong> hypervisor-based isolation (VBS, slide 63) that protects even from a compromised kernel, plus biometric sign-in and credential isolation. These come from "Virtualization-based security" documentation on learn.microsoft.com — the model "assumes that the kernel can be compromised".</p>
<p class="pitfall">⚠️ <strong>Authentication is not authorization.</strong> Items 1 (login) and 2–3 (what you may do afterwards) are different mechanisms; confusing them is the most common wrong answer in security questions ("the ACL checks your password" — no: the logon checks the password, the ACL checks the <em>token it produced</em>).</p>`,
        `<p class="y-chinh">🎯 <strong>Các thuộc tính bảo mật thừa hưởng từ NT</strong>: <strong>(1)</strong> đăng nhập an toàn với biện pháp chống giả mạo; <strong>(2)</strong> kiểm soát truy cập tuỳ ý (discretionary); <strong>(3)</strong> kiểm soát truy cập đặc quyền; <strong>(4)</strong> bảo vệ không gian địa chỉ theo từng tiến trình; <strong>(5)</strong> trang mới phải được xoá sạch trước khi ánh xạ vào; <strong>(6)</strong> kiểm toán bảo mật.</p>
<p>Sáu ổ khoá trên một ngôi nhà. (1) Cửa trước hỏi giấy tờ, và chuông cửa giả không lừa được bạn: màn hình đăng nhập của Windows đạt tới bằng một tổ hợp phím mà chỉ nhân nhận được (<strong>Ctrl+Alt+Del</strong>, <em>secure attention sequence</em>), nên chương trình không vẽ được cửa sổ đăng nhập giả. (2) <strong>Tuỳ ý (discretionary)</strong>: chủ tệp quyết định ai được mở (DACL, slide 61). (3) <strong>Đặc quyền</strong>: một số hành động (nạp driver, sao lưu mọi tệp, đổi đồng hồ) cần một <em>đặc quyền</em> trong token — không chỉ quyền tệp (slide 60). (4) Mỗi tiến trình sống trong không gian địa chỉ riêng (Chương 3) — không đọc được bộ nhớ của tiến trình khác. (5) Một trang giao cho tiến trình mới được xoá trước, nên bạn không bao giờ tìm thấy mật khẩu của tiến trình khác trong bộ nhớ "mới". (6) <em>Kiểm toán</em>: hệ thống ghi log được ai đã thử gì (SACL, slide 61).</p>
<p>Mỗi mục có bản sinh đôi Linux bạn chạy được: (1) <strong>login</strong> (PAM, <code>login</code>, khoá SSH); (2) <strong>bit mode và ACL</strong> (<code>chmod</code>, <code>setfacl</code>) — slide 32; (3) <strong>capability</strong> (<code>CAP_NET_ADMIN</code>, <code>CAP_SYS_PTRACE</code>…) — slide 60; (4) <strong>cô lập MMU</strong> theo tiến trình; (5) <strong>zero-fill-on-demand</strong> — bạn đã thấy "fresh page first byte: 0" ở slide 41, và danh sách zeroed ở slide 48; (6) <strong>auditd</strong> và <code>journald</code>. Đáng ngạc nhiên là bao nhiêu trong danh sách là chung: các ý tưởng thập niên 1960–70 (Multics, UNIX) là nền của cả hai.</p>
<p><strong>Mục 5 đáng một câu chuyện bảo mật</strong>: xoá trang là lý do tấn công đánh cắp bộ nhớ phải đọc bộ nhớ <em>đang sống</em>, không phải tàn dư; cũng là lý do một cơ sở dữ liệu mới khởi động không "thừa hưởng" dữ liệu từ tiến trình chạy trước nó. (Nếu hệ thống bỏ xoá, lỗi "tàn dư bộ nhớ" sẽ làm lộ bí mật giữa người dùng — cùng họ lỗi với việc Heartbleed rò rỉ <em>bên trong</em> một tiến trình, mà việc xoá trang không ngăn được.) Bộ slide dành một slide cho mỗi điểm trong sáu điểm này, nhưng mỗi cái chỉ một dòng; câu chuyện thật ở bốn slide sau, cho thấy (3) và (2) được cài <em>thế nào</em>.</p>
<p><strong>➕ Windows 10/11 thêm lớp thứ bảy:</strong> cô lập dựa trên hypervisor (VBS, slide 63) bảo vệ ngay cả khi nhân bị xâm phạm, cộng đăng nhập sinh trắc học và cô lập thông tin xác thực. Những điều này đến từ tài liệu "Virtualization-based security" trên learn.microsoft.com — mô hình "giả định nhân có thể bị xâm phạm".</p>
<p class="pitfall">⚠️ <strong>Xác thực không phải phân quyền.</strong> Mục 1 (đăng nhập) và 2–3 (việc bạn được làm sau đó) là các cơ chế khác nhau; lẫn chúng là đáp án sai phổ biến nhất trong câu hỏi bảo mật ("ACL kiểm tra mật khẩu của bạn" — không: đăng nhập kiểm mật khẩu, ACL kiểm <em>token mà nó tạo ra</em>).</p>`],
      [60, 'Fundamental Security Concepts',
        `<p class="y-chinh">🎯 Figure 11-45: the <strong>access token</strong>, a kernel object that says <em>who this process acts as</em>. Fields: <strong>Header</strong>, <strong>Expiration time</strong>, <strong>Groups</strong>, <strong>Default CACL</strong> (the default DACL given to objects the process creates), <strong>User SID</strong>, <strong>Group SID</strong> (primary group), <strong>Restricted SIDs</strong>, <strong>Privileges</strong>, <strong>Impersonation level</strong> and <strong>Integrity level</strong>. Every process has a token (copied from its parent unless changed); every thread may also hold a temporary <em>impersonation token</em> to act as a client.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/54ebf665039813fe01fdbd8eff57e1a3375ec4bf.svg" alt="Access token (who you are) compared with the security descriptor (who may do what): AccessCheck gives GRANTED or DENIED" loading="lazy" /><p class="chu-thich">🧩 Access token (who you are) compared with the security descriptor (who may do what): AccessCheck gives GRANTED or DENIED</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Figures 11-45 and 11-46: the ACCESS TOKEN (who you are) is compared with the SECURITY DESCRIPTOR (who may do what)
class "Access token\\n(one per process, in the kernel)" as T {
  user SID
  group SIDs (+ flags: enabled / deny-only)
  default DACL for new objects
  restricted SIDs
  privileges (SeDebug, SeBackup …)
  impersonation level
  integrity level (Low / Medium / High / System)
  expiration time
}
class "Security descriptor\\n(attached to a file, key, mutex…)" as SD {
  owner SID
  group SID
  DACL — who may do what
  SACL — what to audit + integrity label
}
class "DACL = ordered list of ACE" as D
class "ACE" as A {
  type: Allow | Deny
  trustee SID (user or group)
  access mask (bits)
}
SD *-- D
D "1" *-- "0..*" A
T ..&gt; SD : AccessCheck(token, descriptor, desired access)\\n→ GRANTED or DENIED
note right of A : read ACEs IN ORDER: stop at a matching Deny,\\nor when the Allows add up to every requested right
@enduml</code></pre></details>
<p>An access token is a <em>visitor badge</em> pinned to every process: your name (<strong>user SID</strong> — a <em>security identifier</em>, a long unique number, not a name), the clubs you belong to (<strong>group SIDs</strong> — Administrators, Users, Everyone…), special powers you may switch on (<strong>privileges</strong> such as "debug programs" or "back up files"), and how trusted you are (<strong>integrity level</strong>). Doors (objects) hold a <em>list of rules</em> (the descriptor, next slide); the guard (the kernel) compares the badge to the rules <em>every time</em>. Microsoft's description: the system "compares the trustee in each ACE to the trustees identified in the thread's access token. An access token contains security identifiers (SIDs) that identify the user and the group accounts to which the user belongs. A token also contains a logon SID that identifies the current logon session. During an access check, the system ignores group SIDs that are not enabled."</p>
<p><strong>Integrity levels (Microsoft, "Mandatory Integrity Control").</strong> Microsoft says: "Windows defines four integrity levels: <strong>low, medium, high, and system</strong>. Standard users receive medium, elevated users receive high"; services run at system. Rule: <em>a principal with a low integrity level cannot write to an object with a medium integrity level, even if that object's DACL allows write access</em> — "mandatory" because it is checked <em>before</em> the DACL and the owner cannot override it; objects without a label count as medium; a new process gets the <em>minimum</em> of the user's level and the file's level; by default objects carry the policy <em>no-write-up</em>. This is how browsers sandbox their tab processes (Low) and why a hacked tab cannot rewrite your documents. <strong>AppContainer</strong> (slide 5) is an even stricter sandbox: Microsoft notes that "processes running with a low integrity level cannot obtain access to a process which is associated with an app container".</p>
<p>Linux's token is spread over several fields of a process — <em>run it</em>, first as an ordinary user (the lab's <code>sv</code>, uid 1000), then as root:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># A Windows access token (user SID, group SIDs, privileges) &lt;-&gt; the identity every Linux process carries: uid, gids, capabilities<br>
$ id<br>
uid=1000(sv) gid=1000(sv) groups=1000(sv)<br>
$ grep -E '^(Uid|Gid|Groups|CapInh|CapPrm|CapEff|CapBnd|NoNewPrivs):' /proc/self/status<br>
Uid:	1000	1000	1000	1000<br>
Gid:	1000	1000	1000	1000<br>
Groups:	1000<br>
CapInh:	0000000000000000<br>
CapPrm:	0000000000000000<br>
CapEff:	0000000000000000<br>
CapBnd:	00000000a80425fb<br>
NoNewPrivs:	0</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--cap-add=SYS_NICE</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># root = the user whose token has (nearly) every privilege enabled. Decode the bitmask into names<br>
$ id -u<br>
0<br>
$ grep CapEff /proc/self/status<br>
CapEff:	00000000a88425fb<br>
$ node _cap-ten.js "$(awk '/CapEff/{print $2}' /proc/self/status)"<br>
15 capabilities: chown, dac_override, fowner, fsetid, kill, setgid, setuid, setpcap, ...<br>
# A privilege can be DROPPED for one command (like running with a restricted token)<br>
$ setpriv --bounding-set=-dac_override,-chown,-kill sh -c 'grep CapEff /proc/self/status; node _cap-ten.js "$(awk "/CapEff/{print \\$2}" /proc/self/status)"'<br>
CapEff:	00000000a88425d8<br>
12 capabilities: fowner, fsetid, setgid, setuid, setpcap, net_bind_service, net_raw, sys_chroot, ...</div>
<p><strong>User SID ↔ uid:</strong> <code>uid=1000(sv)</code>; <strong>group SIDs ↔ gids:</strong> <code>gid=1000</code>, supplementary <code>Groups: 1000</code>; <strong>privileges ↔ capabilities:</strong> <code>CapEff</code> (effective), <code>CapPrm</code> (permitted), <code>CapBnd</code> (bounding set — the ceiling) are bit masks. The ordinary user has <code>CapEff 0000000000000000</code>: <em>no</em> privileges, exactly like a standard user's non-elevated token. root's <code>CapEff 00000000a88425fb</code> decodes (small Node helper, names from <code>capabilities(7)</code>) to 15 capabilities, including <code>chown</code>, <code>dac_override</code>, <code>kill</code>, <code>setuid</code>… (Docker already removed many; a full root host has about 40). The second block drops three capabilities with <code>setpriv --bounding-set=-dac_override,-chown,-kill</code> and the mask changes to <code>…25d8</code>: <strong>root with a restricted token</strong>. <strong>Integrity level</strong> has no direct Linux twin; the nearest ideas are LSMs (SELinux/AppArmor labels) and namespaces/seccomp sandboxes.</p>
<p class="pitfall">⚠️ <strong>A SID is not a username.</strong> Two accounts with the same name on different machines have different SIDs, and renaming an account keeps its SID — so permissions follow the <em>SID</em>. Likewise Linux permissions follow the <em>uid number</em>, not the name — the reason that files copied between two Linux machines (or into a Docker volume) show a strange owner "1000" when the two machines map names differently.</p>`,
        `<p class="y-chinh">🎯 Hình 11-45: <strong>access token</strong>, một đối tượng nhân nói <em>tiến trình này hành động như ai</em>. Các trường: <strong>Header</strong>, <strong>Expiration time</strong>, <strong>Groups</strong>, <strong>Default CACL</strong> (DACL mặc định gán cho đối tượng tiến trình tạo ra), <strong>User SID</strong>, <strong>Group SID</strong> (nhóm chính), <strong>Restricted SIDs</strong>, <strong>Privileges</strong>, <strong>Impersonation level</strong> và <strong>Integrity level</strong>. Mỗi tiến trình có một token (sao từ cha trừ khi đổi); mỗi luồng cũng có thể giữ một <em>token mạo danh (impersonation)</em> tạm thời để hành động như một client.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/54ebf665039813fe01fdbd8eff57e1a3375ec4bf.svg" alt="Access token (bạn là ai) được so với security descriptor (ai được làm gì): AccessCheck cho GRANTED hay DENIED" loading="lazy" /><p class="chu-thich">🧩 Access token (bạn là ai) được so với security descriptor (ai được làm gì): AccessCheck cho GRANTED hay DENIED</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Hình 11-45 và 11-46: ACCESS TOKEN (bạn là ai) được so với SECURITY DESCRIPTOR (ai được làm gì)
class "Access token\\n(one per process, in the kernel)" as T {
  user SID
  group SIDs (+ flags: enabled / deny-only)
  default DACL for new objects
  restricted SIDs
  privileges (SeDebug, SeBackup …)
  impersonation level
  integrity level (Low / Medium / High / System)
  expiration time
}
class "Security descriptor\\n(attached to a file, key, mutex…)" as SD {
  owner SID
  group SID
  DACL — who may do what
  SACL — what to audit + integrity label
}
class "DACL = ordered list of ACE" as D
class "ACE" as A {
  type: Allow | Deny
  trustee SID (user or group)
  access mask (bits)
}
SD *-- D
D "1" *-- "0..*" A
T ..&gt; SD : AccessCheck(token, descriptor, desired access)\\n→ GRANTED or DENIED
note right of A : read ACEs IN ORDER: stop at a matching Deny,\\nor when the Allows add up to every requested right
@enduml</code></pre></details>
<p>Access token là một <em>thẻ khách</em> ghim trên mỗi tiến trình: tên bạn (<strong>user SID</strong> — một <em>security identifier</em>, một số dài duy nhất, không phải tên), các câu lạc bộ bạn thuộc về (<strong>group SID</strong> — Administrators, Users, Everyone…), quyền đặc biệt bạn bật được (<strong>đặc quyền (privilege)</strong> như "gỡ lỗi chương trình" hay "sao lưu tệp"), và mức độ tin cậy (<strong>integrity level</strong>). Cửa (đối tượng) giữ một <em>danh sách luật</em> (descriptor, slide sau); người gác (nhân) so thẻ với luật <em>mỗi lần</em>. Mô tả của Microsoft: hệ thống "so sánh trustee trong mỗi ACE với các trustee xác định trong access token của luồng. Access token chứa các security identifier (SID) xác định người dùng và các tài khoản nhóm mà người dùng thuộc về. Token cũng chứa một logon SID xác định phiên đăng nhập hiện tại. Trong lúc kiểm tra truy cập, hệ thống bỏ qua các group SID không được bật."</p>
<p><strong>Mức toàn vẹn (Microsoft, "Mandatory Integrity Control").</strong> Microsoft ghi: "Windows định nghĩa bốn mức toàn vẹn: <strong>low, medium, high và system</strong>. Người dùng chuẩn nhận medium, người dùng nâng quyền nhận high"; dịch vụ chạy ở system. Luật: <em>chủ thể có mức toàn vẹn thấp không ghi được vào đối tượng mức medium, kể cả khi DACL của đối tượng cho phép ghi</em> — "bắt buộc (mandatory)" vì được kiểm <em>trước</em> DACL và chủ sở hữu không ghi đè được; đối tượng không có nhãn được coi là medium; tiến trình mới nhận <em>mức nhỏ nhất</em> giữa mức của người dùng và mức của tệp; mặc định đối tượng mang chính sách <em>no-write-up</em>. Đây là cách trình duyệt cô lập các tiến trình tab (Low) và vì sao một tab bị hack không ghi đè được tài liệu của bạn. <strong>AppContainer</strong> (slide 5) là hộp cát còn chặt hơn: Microsoft ghi "tiến trình chạy ở mức toàn vẹn thấp không truy cập được một tiến trình gắn với app container".</p>
<p>Token của Linux rải trên nhiều trường của một tiến trình — <em>chạy thử</em>, trước hết như người dùng thường (<code>sv</code> của lab, uid 1000), rồi như root:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Access token của Windows (SID người dùng, SID nhóm, đặc quyền) &lt;-&gt; danh tính mỗi tiến trình Linux mang theo: uid, gid, capability<br>
$ id<br>
uid=1000(sv) gid=1000(sv) groups=1000(sv)<br>
$ grep -E '^(Uid|Gid|Groups|CapInh|CapPrm|CapEff|CapBnd|NoNewPrivs):' /proc/self/status<br>
Uid:	1000	1000	1000	1000<br>
Gid:	1000	1000	1000	1000<br>
Groups:	1000<br>
CapInh:	0000000000000000<br>
CapPrm:	0000000000000000<br>
CapEff:	0000000000000000<br>
CapBnd:	00000000a80425fb<br>
NoNewPrivs:	0</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--cap-add=SYS_NICE</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># root = người dùng mà token bật (gần như) mọi đặc quyền. Giải mã mặt nạ bit thành tên<br>
$ id -u<br>
0<br>
$ grep CapEff /proc/self/status<br>
CapEff:	00000000a88425fb<br>
$ node _cap-ten.js "$(awk '/CapEff/{print $2}' /proc/self/status)"<br>
15 capabilities: chown, dac_override, fowner, fsetid, kill, setgid, setuid, setpcap, ...<br>
# Một đặc quyền có thể bị BỎ cho một lệnh (như chạy với token bị hạn chế)<br>
$ setpriv --bounding-set=-dac_override,-chown,-kill sh -c 'grep CapEff /proc/self/status; node _cap-ten.js "$(awk "/CapEff/{print \\$2}" /proc/self/status)"'<br>
CapEff:	00000000a88425d8<br>
12 capabilities: fowner, fsetid, setgid, setuid, setpcap, net_bind_service, net_raw, sys_chroot, ...</div>
<p><strong>User SID ↔ uid:</strong> <code>uid=1000(sv)</code>; <strong>group SID ↔ gid:</strong> <code>gid=1000</code>, bổ sung <code>Groups: 1000</code>; <strong>đặc quyền ↔ capability:</strong> <code>CapEff</code> (hiệu lực), <code>CapPrm</code> (được phép), <code>CapBnd</code> (tập chặn — trần) là các mặt nạ bit. Người dùng thường có <code>CapEff 0000000000000000</code>: <em>không</em> đặc quyền nào, đúng như token không nâng quyền của người dùng chuẩn. <code>CapEff 00000000a88425fb</code> của root giải mã (trợ giúp Node nhỏ, tên từ <code>capabilities(7)</code>) thành 15 capability, gồm <code>chown</code>, <code>dac_override</code>, <code>kill</code>, <code>setuid</code>… (Docker đã bỏ nhiều; máy chủ root đầy đủ có khoảng 40). Khối thứ hai bỏ ba capability bằng <code>setpriv --bounding-set=-dac_override,-chown,-kill</code> và mặt nạ đổi thành <code>…25d8</code>: <strong>root với token bị hạn chế</strong>. <strong>Mức toàn vẹn</strong> không có bản sinh đôi Linux trực tiếp; ý gần nhất là LSM (nhãn SELinux/AppArmor) và hộp cát namespace/seccomp.</p>
<p class="pitfall">⚠️ <strong>SID không phải tên người dùng.</strong> Hai tài khoản cùng tên trên hai máy có SID khác nhau, và đổi tên tài khoản giữ nguyên SID — nên quyền đi theo <em>SID</em>. Tương tự quyền Linux đi theo <em>số uid</em>, không phải tên — lý do tệp chép giữa hai máy Linux (hay vào Docker volume) hiện chủ lạ "1000" khi hai máy ánh xạ tên khác nhau.</p>`],
      [61, 'Security API Calls (1)',
        `<p class="y-chinh">🎯 Figure 11-46: <strong>an example security descriptor for a file</strong>. The descriptor has a <em>header</em>, <strong>Owner SID</strong>, <strong>Group SID</strong>, a <strong>DACL</strong> (discretionary ACL: who may do what) and a <strong>SACL</strong> (system ACL: what to <em>audit</em>). The DACL's entries (<strong>ACEs</strong>, access control entries) in order: <strong>Deny Elvis 111111</strong>, <strong>Allow Cathy 110000</strong>, <strong>Allow Ida 111111</strong>, <strong>Allow Everyone 100000</strong>. The SACL has <strong>Audit Marilyn 111111</strong>. Each ACE has a type (allow/deny/audit), a trustee (user or group) and a <em>mask of rights</em> — here six bits.</p>
<p>Think of a club door with a list pinned beside it. <em>The guard reads the list from the top, line by line, and stops as soon as the answer is settled.</em> Line 1 says "Elvis — all six rights DENIED": so whatever else follows, Elvis is out. Line 2 allows Cathy two rights (the top two bits). Line 3 gives Ida everything. Line 4 gives <em>everyone else</em> the first right only. Order matters. Microsoft (<em>"How AccessCheck Works"</em>): "The system examines each ACE in sequence until one of the following events occurs: an access-denied ACE explicitly denies any of the requested access rights to one of the trustees listed in the thread's access token; one or more access-allowed ACEs … explicitly grant all the requested access rights; all ACEs have been checked and there is still at least one requested access right that has not been explicitly allowed, in which case, access is <strong>implicitly denied</strong>." And: "if the object does not have a DACL, the system grants access".</p>
<p>The six bits are not named in the figure; our simulator labels them <strong>R W X D P O</strong> = read, write, execute, delete, change permissions, take ownership (labels are ours; the real masks have dozens of file-specific bits). Run the algorithm on the figure's list — each picture shows the ACEs, which were examined, and the verdict:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/82dfe5a91d58a4365292d8607a554cafe8406959.svg" alt="Elvis asks to read: ACE 1 denies him everything → DENIED, although &quot;Everyone&quot; may read (ACE 4 is never reached)" loading="lazy" /><p class="chu-thich">🧮 Elvis asks to read: ACE 1 denies him everything → DENIED, although "Everyone" may read (ACE 4 is never reached)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3dd65392948264db24fb1291050512e68a4871d1.svg" alt="Cathy asks to read and write: ACE 1 does not apply to her, ACE 2 grants exactly R and W → GRANTED" loading="lazy" /><p class="chu-thich">🧮 Cathy asks to read and write: ACE 1 does not apply to her, ACE 2 grants exactly R and W → GRANTED</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4e4b648c56ab018f680d50d0025f2d516cc80df6.svg" alt="Marilyn (only in Everyone) asks to write: only R is ever granted → still missing W after the last ACE → DENIED (implicit)" loading="lazy" /><p class="chu-thich">🧮 Marilyn (only in Everyone) asks to write: only R is ever granted → still missing W after the last ACE → DENIED (implicit)</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/d910784ca3d66c772c7798208fec875b0f694871.svg" alt="Move &quot;Allow Everyone&quot; to the top: now Elvis is GRANTED read — the order of ACEs changed the answer" loading="lazy" /><p class="chu-thich">🧮 Move "Allow Everyone" to the top: now Elvis is GRANTED read — the order of ACEs changed the answer</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<p>Four results, one lesson. Elvis is denied because the <em>Deny</em> comes first even though <em>Everyone</em> (which includes him) may read. Cathy gets exactly her two rights. Marilyn is not named in any ACE except as a member of Everyone, so she gets read only; her request to <em>write</em> is refused <em>implicitly</em> — nobody said no, but nobody said yes. In the fourth picture the same four ACEs are reordered so that the Allow-for-Everyone comes before Elvis's Deny: the guard stops at line 1 and lets Elvis read. Real Windows therefore keeps DACLs in a <em>canonical order</em> (explicit Deny entries first, then explicit Allow, then inherited ones) — Microsoft's API (<code>AddAccessDeniedAce</code>, <code>AddAccessAllowedAce</code>) puts the burden on the programmer.</p>
<p>The <strong>SACL</strong> (Audit Marilyn 111111) is not an access rule: it says "write a log entry whenever Marilyn touches this file" — item 6 of slide 59. The same SACL also carries the file's <strong>integrity label</strong> (slide 60). A NULL DACL (no DACL at all) means <em>everyone has full access</em>; an <em>empty</em> DACL (present but no ACEs) means <em>nobody</em> has access — a famously dangerous difference.</p>
<p class="pitfall">⚠️ Two exam traps. (1) <strong>"Deny always wins"</strong> is only true when the Deny is <em>reached first</em>: in the reordered list Elvis passes. (2) <strong>"If no ACE mentions you, you get default access"</strong> is false for a DACL that exists: no matching Allow means <em>denied</em> (implicit deny); only a <em>missing</em> DACL grants everything.</p>`,
        `<p class="y-chinh">🎯 Hình 11-46: <strong>một security descriptor ví dụ cho một tệp</strong>. Descriptor có <em>đầu</em>, <strong>Owner SID</strong>, <strong>Group SID</strong>, một <strong>DACL</strong> (ACL tuỳ ý: ai được làm gì) và một <strong>SACL</strong> (ACL hệ thống: cái gì cần <em>kiểm toán</em>). Các mục của DACL (<strong>ACE</strong>, access control entry) theo thứ tự: <strong>Deny Elvis 111111</strong>, <strong>Allow Cathy 110000</strong>, <strong>Allow Ida 111111</strong>, <strong>Allow Everyone 100000</strong>. SACL có <strong>Audit Marilyn 111111</strong>. Mỗi ACE có một loại (cho phép/từ chối/kiểm toán), một trustee (người dùng hay nhóm) và một <em>mặt nạ quyền</em> — ở đây sáu bit.</p>
<p>Hình dung cửa câu lạc bộ có một danh sách ghim bên cạnh. <em>Người gác đọc danh sách từ trên xuống, từng dòng, và dừng ngay khi câu trả lời đã rõ.</em> Dòng 1 nói "Elvis — cả sáu quyền bị TỪ CHỐI": nên bất kể điều gì theo sau, Elvis ra ngoài. Dòng 2 cho Cathy hai quyền (hai bit trên). Dòng 3 cho Ida mọi thứ. Dòng 4 cho <em>mọi người khác</em> chỉ quyền đầu. Thứ tự quan trọng. Microsoft (<em>"How AccessCheck Works"</em>): "Hệ thống xét từng ACE theo thứ tự cho tới khi xảy ra một trong các sự kiện: một ACE access-denied từ chối rõ ràng bất kỳ quyền xin nào với một trong các trustee trong access token của luồng; một hay nhiều ACE access-allowed … cho phép rõ ràng mọi quyền xin; mọi ACE đã kiểm mà vẫn còn ít nhất một quyền xin chưa được cho phép rõ ràng, khi đó truy cập bị <strong>từ chối ngầm</strong>." Và: "nếu đối tượng không có DACL, hệ thống cho phép truy cập".</p>
<p>Sáu bit không được đặt tên trong hình; bộ mô phỏng của ta gán nhãn <strong>R W X D P O</strong> = đọc, ghi, chạy, xoá, đổi quyền, lấy quyền sở hữu (nhãn là của ta; mặt nạ thật có hàng chục bit riêng cho tệp). Chạy thuật toán trên danh sách của hình — mỗi hình cho thấy các ACE, cái nào đã được xét, và kết luận:</p>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/71454532efe620b1268399ffad0291f63bc9bc72.svg" alt="Elvis xin đọc: ACE 1 từ chối mọi thứ của anh → DENIED, dù &quot;Everyone&quot; được đọc (ACE 4 không bao giờ tới)" loading="lazy" /><p class="chu-thich">🧮 Elvis xin đọc: ACE 1 từ chối mọi thứ của anh → DENIED, dù "Everyone" được đọc (ACE 4 không bao giờ tới)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/9d53f5bbc7cbfd01f27f8af37c1c14bfe1428da2.svg" alt="Cathy xin đọc và ghi: ACE 1 không áp dụng cho cô, ACE 2 cho đúng R và W → GRANTED" loading="lazy" /><p class="chu-thich">🧮 Cathy xin đọc và ghi: ACE 1 không áp dụng cho cô, ACE 2 cho đúng R và W → GRANTED</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/efe6f0ce2a050068b7724702ce37bb4f3a7726a9.svg" alt="Marilyn (chỉ thuộc Everyone) xin ghi: chỉ R được cấp → sau ACE cuối vẫn thiếu W → DENIED (ngầm)" loading="lazy" /><p class="chu-thich">🧮 Marilyn (chỉ thuộc Everyone) xin ghi: chỉ R được cấp → sau ACE cuối vẫn thiếu W → DENIED (ngầm)</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/ff367e268ead280b0385cc489517fa18dbf49d49.svg" alt="Đưa &quot;Allow Everyone&quot; lên đầu: giờ Elvis được GRANTED quyền đọc — thứ tự ACE đã đổi đáp án" loading="lazy" /><p class="chu-thich">🧮 Đưa "Allow Everyone" lên đầu: giờ Elvis được GRANTED quyền đọc — thứ tự ACE đã đổi đáp án</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const BIT = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; (5 - BIT.indexOf(c))), 0);
const chuoi = (m) =&gt; BIT.split('').map((c, i) =&gt; (m &gt;&gt; (5 - i)) &amp; 1).join('');
const DACL = [
  { loai: 'Deny', ai: 'Elvis', quyen: mask('RWXDPO') },     // 111111
  { loai: 'Allow', ai: 'Cathy', quyen: mask('RW') },        // 110000
  { loai: 'Allow', ai: 'Ida', quyen: mask('RWXDPO') },      // 111111
  { loai: 'Allow', ai: 'Everyone', quyen: mask('R') },      // 100000
];
// token: người nào thuộc nhóm nào (mọi người đều thuộc Everyone)
const SID_CUA = (ten) =&gt; [ten, 'Everyone'];
export function accessCheck(dacl, ten, xin) {
  const sids = SID_CUA(ten); const want = mask(xin); let got = 0; const vet = [];
  for (const a of dacl) {
    if (!sids.includes(a.ai)) { vet.push({ a, kq: 'skip', got }); continue; }
    if (a.loai === 'Deny' &amp;&amp; (a.quyen &amp; want)) { vet.push({ a, kq: 'deny', got }); return { ok: false, vet }; }
    if (a.loai === 'Allow') { got |= a.quyen &amp; want; vet.push({ a, kq: (got === want ? 'grant' : 'add'), got }); if (got === want) return { ok: true, vet }; }
    else vet.push({ a, kq: 'skip', got });
  }
  return { ok: false, vet, ngam: true };
}</code></pre></details>
<p>Bốn kết quả, một bài học. Elvis bị từ chối vì <em>Deny</em> đứng trước dù <em>Everyone</em> (gồm cả anh) được đọc. Cathy nhận đúng hai quyền. Marilyn không được nêu trong ACE nào ngoài tư cách thành viên Everyone, nên chỉ được đọc; yêu cầu <em>ghi</em> của cô bị từ chối <em>ngầm</em> — không ai nói không, nhưng không ai nói có. Ở hình thứ tư cùng bốn ACE được xếp lại để Allow-cho-Everyone đứng trước Deny của Elvis: người gác dừng ở dòng 1 và cho Elvis đọc. Vì vậy Windows thật giữ DACL theo <em>thứ tự chuẩn</em> (các mục Deny tường minh trước, rồi Allow tường minh, rồi các mục thừa kế) — API của Microsoft (<code>AddAccessDeniedAce</code>, <code>AddAccessAllowedAce</code>) đặt gánh nặng lên lập trình viên.</p>
<p><strong>SACL</strong> (Audit Marilyn 111111) không phải luật truy cập: nó nói "ghi một mục log mỗi khi Marilyn chạm vào tệp này" — mục 6 của slide 59. Cùng SACL đó còn mang <strong>nhãn toàn vẹn</strong> của tệp (slide 60). DACL NULL (không có DACL) nghĩa là <em>mọi người có toàn quyền</em>; DACL <em>rỗng</em> (có nhưng không ACE) nghĩa là <em>không ai</em> có quyền — một khác biệt nguy hiểm nổi tiếng.</p>
<p class="pitfall">⚠️ Hai bẫy thi. (1) <strong>"Deny luôn thắng"</strong> chỉ đúng khi Deny <em>được xét trước</em>: trong danh sách xếp lại Elvis qua được. (2) <strong>"Nếu không ACE nào nhắc tới bạn, bạn có quyền mặc định"</strong> là sai với DACL đã tồn tại: không có Allow khớp nghĩa là <em>bị từ chối</em> (từ chối ngầm); chỉ DACL <em>vắng</em> mới cho mọi thứ.</p>`],
      [62, 'Security API Calls (2)',
        `<p class="y-chinh">🎯 Figure 11-47: the <strong>principal Win32 API functions for security</strong>: <code>InitializeSecurityDescriptor</code> (prepare a new security descriptor), <code>LookupAccountSid</code> (look up the SID for a given user name), <code>SetSecurityDescriptorOwner</code>, <code>SetSecurityDescriptorGroup</code>, <code>InitializeAcl</code> (initialize a DACL or SACL), <code>AddAccessAllowedAce</code> (add a new ACE allowing access), <code>AddAccessDeniedAce</code>, <code>DeleteAce</code>, <code>SetSecurityDescriptorDacl</code> (attach a DACL to a security descriptor).</p>
<p>Read the list as a recipe in four steps for protecting a new object: (1) <em>make an empty descriptor</em> (<code>InitializeSecurityDescriptor</code>); (2) <em>fill the owner and group</em> using SIDs you get by name from <code>LookupAccountSid</code>; (3) <em>build an ACL</em> (<code>InitializeAcl</code>) and add ACEs <em>in the order you want them examined</em> (<code>AddAccessDeniedAce</code> before <code>AddAccessAllowedAce</code>); (4) <em>attach the ACL</em> (<code>SetSecurityDescriptorDacl</code>) and pass the descriptor when you create the object (<code>CreateFile(…, &amp;sa, …)</code>). Most people never write this; they use <code>icacls</code> on the command line, the <em>Security</em> tab in Explorer, or PowerShell's <code>Get-Acl</code> / <code>Set-Acl</code>, which do the same through friendlier layers:</p>
<pre><code class="language-powershell"># Show the DACL of a folder (the ACEs of slide 61, in order)
icacls C:\\site\\uploads
# Give user "build" read+execute, and explicitly DENY write to the group "Guests"
icacls C:\\site\\uploads /grant build:(OI)(CI)RX
icacls C:\\site\\uploads /deny Guests:(OI)(CI)W
# PowerShell version: copy the ACL of one folder to another
Get-Acl C:\\site\\uploads | Set-Acl C:\\site\\backup</code></pre>
<p>Same job on Linux — two levels. The <strong>classic</strong> three-ACE DACL is <code>chmod</code>/<code>chown</code> (owner, group, others — slide 32); the <strong>ACL extension</strong> lets you add named users and groups, almost like Windows ACEs, but with no explicit <em>Deny</em> entry — you remove permission instead:</p>
<pre><code class="language-bash"># classic mode bits: owner rw, group r, others nothing
chmod 640 report.txt &amp;&amp; chown alice:staff report.txt
# POSIX ACL (needs the 'acl' package and a file system with ACL support)
setfacl -m u:build:rx uploads/      # add a named user, like AddAccessAllowedAce
setfacl -m g:guests:--- uploads/    # take everything from a group (no 'deny' ACE exists)
getfacl uploads/                    # print the list, like icacls</code></pre>
<p>Key differences to know for a comparison slide: Windows ACLs have <em>explicit Deny</em>, <em>inheritance flags</em> ((OI) object inherit, (CI) container inherit) and an <em>ordered</em> list evaluated first-match; POSIX ACLs are evaluated as a <em>set</em> (the most specific matching entry among user, group and other wins; a <code>mask</code> entry caps the group class), have no Deny, and <em>default ACLs</em> on directories play the role of inheritance. On Linux the <em>capabilities</em> (slide 60) and an LSM such as SELinux add the rest.</p>
<p>The <strong>Win32 call <code>LookupAccountSid</code></strong> reminds you of an important point: names are for people, SIDs are for the kernel. The API converts between them, and it can fail (an account can be deleted while its SID lives on in old ACEs — you will see raw <code>S-1-5-21-…</code> strings in the Security tab: "orphaned SIDs"). Linux's matching annoyance is a file owned by a numeric uid with no matching user in <code>/etc/passwd</code> (shown by <code>ls -l</code> as a number).</p>
<p class="pitfall">⚠️ Do not set a DACL to <em>NULL</em> to "turn permissions off" — it grants <strong>everyone full control</strong> (slide 61); a classic vulnerability pattern in installers. If you mean "nobody", create an <em>empty</em> DACL; if you mean "inherit from the parent", do not set one at all.</p>`,
        `<p class="y-chinh">🎯 Hình 11-47: các <strong>hàm API Win32 chính cho bảo mật</strong>: <code>InitializeSecurityDescriptor</code> (chuẩn bị một security descriptor mới), <code>LookupAccountSid</code> (tra SID cho một tên người dùng), <code>SetSecurityDescriptorOwner</code>, <code>SetSecurityDescriptorGroup</code>, <code>InitializeAcl</code> (khởi tạo DACL hay SACL), <code>AddAccessAllowedAce</code> (thêm ACE mới cho phép truy cập), <code>AddAccessDeniedAce</code>, <code>DeleteAce</code>, <code>SetSecurityDescriptorDacl</code> (gắn DACL vào security descriptor).</p>
<p>Đọc danh sách như công thức bốn bước để bảo vệ một đối tượng mới: (1) <em>tạo một descriptor rỗng</em> (<code>InitializeSecurityDescriptor</code>); (2) <em>điền chủ và nhóm</em> bằng các SID lấy theo tên từ <code>LookupAccountSid</code>; (3) <em>dựng một ACL</em> (<code>InitializeAcl</code>) và thêm các ACE <em>theo thứ tự bạn muốn chúng được xét</em> (<code>AddAccessDeniedAce</code> trước <code>AddAccessAllowedAce</code>); (4) <em>gắn ACL</em> (<code>SetSecurityDescriptorDacl</code>) và truyền descriptor khi tạo đối tượng (<code>CreateFile(…, &amp;sa, …)</code>). Đa số người không bao giờ viết thế này; họ dùng <code>icacls</code> trên dòng lệnh, tab <em>Security</em> trong Explorer, hay <code>Get-Acl</code> / <code>Set-Acl</code> của PowerShell, làm cùng việc qua các tầng thân thiện hơn:</p>
<pre><code class="language-powershell"># Show the DACL of a folder (the ACEs of slide 61, in order)
icacls C:\\site\\uploads
# Give user "build" read+execute, and explicitly DENY write to the group "Guests"
icacls C:\\site\\uploads /grant build:(OI)(CI)RX
icacls C:\\site\\uploads /deny Guests:(OI)(CI)W
# PowerShell version: copy the ACL of one folder to another
Get-Acl C:\\site\\uploads | Set-Acl C:\\site\\backup</code></pre>
<p>Cùng việc trên Linux — hai mức. DACL <strong>cổ điển</strong> ba-ACE là <code>chmod</code>/<code>chown</code> (chủ, nhóm, người khác — slide 32); <strong>phần mở rộng ACL</strong> cho thêm người dùng và nhóm có tên, gần như ACE của Windows, nhưng không có mục <em>Deny</em> tường minh — bạn gỡ quyền thay vào đó:</p>
<pre><code class="language-bash"># classic mode bits: owner rw, group r, others nothing
chmod 640 report.txt &amp;&amp; chown alice:staff report.txt
# POSIX ACL (needs the 'acl' package and a file system with ACL support)
setfacl -m u:build:rx uploads/      # add a named user, like AddAccessAllowedAce
setfacl -m g:guests:--- uploads/    # take everything from a group (no 'deny' ACE exists)
getfacl uploads/                    # print the list, like icacls</code></pre>
<p>Khác biệt chính cần biết cho slide so sánh: ACL Windows có <em>Deny tường minh</em>, <em>cờ thừa kế</em> ((OI) object inherit, (CI) container inherit) và danh sách <em>có thứ tự</em> xét khớp đầu tiên; ACL POSIX được đánh giá như một <em>tập</em> (mục khớp cụ thể nhất trong user, group và other thắng; mục <code>mask</code> chặn trần lớp nhóm), không có Deny, và <em>ACL mặc định</em> trên thư mục đóng vai trò thừa kế. Trên Linux các <em>capability</em> (slide 60) và một LSM như SELinux thêm phần còn lại.</p>
<p><strong>Lời gọi Win32 <code>LookupAccountSid</code></strong> nhắc một điểm quan trọng: tên dành cho người, SID dành cho nhân. API đổi qua lại giữa chúng, và có thể thất bại (một tài khoản có thể bị xoá trong khi SID của nó còn sống trong các ACE cũ — bạn sẽ thấy chuỗi thô <code>S-1-5-21-…</code> trong tab Security: "SID mồ côi"). Phiền toái tương ứng của Linux là tệp thuộc một uid số không có người dùng khớp trong <code>/etc/passwd</code> (<code>ls -l</code> hiện là một con số).</p>
<p class="pitfall">⚠️ Đừng đặt DACL là <em>NULL</em> để "tắt quyền" — nó cho <strong>mọi người toàn quyền</strong> (slide 61); mẫu lỗ hổng kinh điển trong trình cài đặt. Nếu ý bạn là "không ai", tạo DACL <em>rỗng</em>; nếu ý bạn là "thừa kế từ cha", đừng đặt gì cả.</p>`],
      [63, 'Security Mitigations',
        `<p class="y-chinh">🎯 Figure 11-48: <strong>some of the principal security mitigations in Windows</strong>: <strong>/GS compiler flag</strong> (add a canary to stack frames to protect branch targets), <strong>Exception hardening</strong> (restrict what code can be invoked as exception handlers), <strong>NX MMU protection</strong> (mark code as non-executable to hinder attack payloads), <strong>ASLR</strong> (randomize the address space to make ROP attacks difficult), <strong>Heap hardening</strong> (check for common heap-usage errors), <strong>VTGuard</strong> (validate virtual function tables), <strong>Code Integrity</strong> (verify that libraries and drivers are properly cryptographically signed), <strong>Patchguard</strong> (detect attempts to modify kernel data, e.g. by rootkits), <strong>Windows Update</strong> (regular security patches) and <strong>Windows Defender</strong> (built-in basic antivirus).</p>
<p>The theme is <strong>defence in depth</strong>: assume a bug exists (a buffer overflow in C/C++ code) and make exploiting it harder at every step. A <em>canary</em> (/GS) is a secret value placed before the return address; if an overflow overwrites it the function aborts instead of returning to attacker code. <em>NX</em> forbids running code from data pages (the NX bit you saw in the PTE on slide 43). <em>ASLR</em> shuffles where the stack, heap and libraries are loaded each run, so an attacker cannot hard-code addresses — you can watch it on Linux:</p>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--security-opt=seccomp=unconfined</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># ASLR: the stack, heap and libraries load at a RANDOM address each run, so an exploit cannot hard-code where code lives<br>
$ show() { grep '\\[stack\\]' /proc/self/maps | cut -d- -f1 | sed 's/^/stack at /'; }<br>
$ echo "ASLR on (default): two runs"<br>
ASLR on (default): two runs<br>
$ bash -c "$(declare -f show); show"; bash -c "$(declare -f show); show"<br>
stack at ffffc5e89000<br>
stack at ffffde5b6000<br>
$ echo "ASLR switched off for one command (setarch -R): two runs"<br>
ASLR switched off for one command (setarch -R): two runs<br>
$ setarch -R bash -c "$(declare -f show); show"; setarch -R bash -c "$(declare -f show); show"<br>
stack at fffffffdf000<br>
stack at fffffffdf000<br>
$ cat /proc/sys/kernel/randomize_va_space | sed 's/^/kernel.randomize_va_space = /'<br>
kernel.randomize_va_space = 2</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<p>With ASLR on (the default, <code>kernel.randomize_va_space = 2</code>) two runs of the same program put the stack at <em>different</em> addresses; with ASLR switched off for one command (<code>setarch -R</code>) both runs put it at the <em>same</em> address — exactly what an attacker wants. Linux has the same menu: stack protector (<code>gcc -fstack-protector</code>, canaries), NX, ASLR/PIE, hardened heap allocators, <em>kernel module signing</em> (≈ Code Integrity) and <em>seccomp</em> (restrict system calls). Windows's <strong>Patchguard</strong> (kernel patch protection on 64-bit) has no exact Linux twin; the closest are lockdown mode and signed modules.</p>
<p><strong>➕ What came after the 2013 list (sources: Microsoft Learn).</strong> <strong>Control Flow Guard (CFG)</strong> — "a highly-optimized platform security feature that was created to combat memory corruption vulnerabilities": the compiler (<code>/guard:cf</code>) adds checks and builds a table of valid <em>indirect call</em> targets; at run time Windows verifies the target and "immediately terminates the program" if it is invalid; it extends /GS, DEP and ASLR; supported on Windows 10 and 11 clients and Windows Server 2019 and later. <strong>Virtualization-based security (VBS)</strong> — Microsoft: it "uses hardware virtualization and the Windows hypervisor to create an isolated virtual environment that becomes the root of trust of the OS that <em>assumes the kernel can be compromised</em>". Its flagship feature is <strong>memory integrity (HVCI, hypervisor-protected code integrity)</strong>: kernel code integrity runs inside the isolated environment, so "kernel memory pages are only made executable after passing code integrity checks … and executable pages themselves are never writable" — "even if there are vulnerabilities like a buffer overflow that allow malware to attempt to modify memory, executable code pages cannot be modified". VBS requires a 64-bit CPU with virtualization extensions, <em>second-level address translation</em> (EPT/RVI), an IOMMU, TPM 2.0 and Secure Boot. Remember the chain: <strong>hardware virtualization → hypervisor → secure world (VTL1) → trusted kernel checks</strong> (see the figure below). This is Chapter 7 (hypervisor, nested paging) used for <em>security</em> instead of for renting servers.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/df7af32096d83abdf95edf413d72db948264620c.svg" alt="Modern Windows on a hypervisor: the normal Windows (VTL0) and a secure world (VTL1) for VBS/HVCI, next to the WSL 2 utility VM and Hyper-V-isolated containers" loading="lazy" /><p class="chu-thich">🧩 Modern Windows on a hypervisor: the normal Windows (VTL0) and a secure world (VTL1) for VBS/HVCI, next to the WSL 2 utility VM and Hyper-V-isolated containers</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
' Modern Windows on a hypervisor: VBS splits the machine into virtual trust levels (VTL0 = normal Windows, VTL1 = secure kernel); WSL 2 and Windows containers also use Hyper-V
skinparam rectangle {
  RoundCorner 3
}
rectangle "Hardware (CPU with virtualization + SLAT, IOMMU, TPM 2.0, Secure Boot)" as hw
rectangle "Hyper-V hypervisor (type 1, runs first)" as hv
rectangle "Root partition = the Windows you use" as root #E0E7FF {
  rectangle "VTL0 (normal world)\\nWindows kernel + drivers + apps\\nHyper-V management, WSL 2 launcher" as v0
  rectangle "VTL1 (secure world)\\nsecure kernel · HVCI (memory integrity)\\nCredential Guard (LSA isolated)" as v1 #DCFCE7
}
rectangle "WSL 2 lightweight utility VM\\nreal Linux kernel — your distros\\nare containers inside it" as wsl #FEF9C3
rectangle "Hyper-V isolated\\nWindows container\\n(own Windows kernel)" as wc #FEF9C3
hw --&gt; hv
hv --&gt; root
hv --&gt; wsl
hv --&gt; wc
v1 -[hidden]down- v0
note bottom of wsl : docs: "WSL 2 uses virtualization technology to run a Linux kernel\\ninside of a lightweight utility virtual machine"
@enduml</code></pre></details>
<p><strong>➕ The same hypervisor also runs your Linux:</strong> the WSL 2 lightweight utility VM (slide 6) and <strong>Windows containers</strong>. Microsoft's container page: containers "run on top of the host operating system's kernel", and unlike a virtual machine "which runs a complete operating system – including its own kernel"; Windows containers can run on Windows 10 (via Docker Desktop) and Windows Server 2016, 2019, 2022 and 2025. In Windows terminology <em>process isolation</em> shares the host kernel (a job-based container, slide 28) and <em>Hyper-V isolation</em> gives each container its own tiny kernel in a utility VM — "container versus VM" (Chapter 7) is a <em>dial</em> on Windows, not two separate products.</p>
<p class="pitfall">⚠️ "<em>Windows Defender / antivirus is what makes Windows secure</em>" is the wrong mental model: the strongest protections (NX, ASLR, CFG, HVCI, signed drivers, least privilege) are <em>built into the OS and compiler</em>; antivirus is a last line. Also, "ASLR prevents buffer overflows" is wrong: it only makes <em>exploiting</em> them harder (it hides addresses; the overflow still happens).</p>`,
        `<p class="y-chinh">🎯 Hình 11-48: <strong>một số biện pháp giảm thiểu bảo mật chính trong Windows</strong>: <strong>cờ biên dịch /GS</strong> (thêm canary vào khung stack để bảo vệ đích nhảy), <strong>gia cố ngoại lệ</strong> (hạn chế mã nào được gọi như trình xử lý ngoại lệ), <strong>bảo vệ NX MMU</strong> (đánh dấu mã là không thực thi để cản payload tấn công), <strong>ASLR</strong> (ngẫu nhiên hoá không gian địa chỉ để làm khó tấn công ROP), <strong>gia cố heap</strong> (kiểm các lỗi dùng heap thường gặp), <strong>VTGuard</strong> (xác thực bảng hàm ảo), <strong>Code Integrity</strong> (kiểm thư viện và driver được ký mật mã đúng), <strong>Patchguard</strong> (phát hiện cố gắng sửa dữ liệu nhân, vd bởi rootkit), <strong>Windows Update</strong> (bản vá bảo mật đều đặn) và <strong>Windows Defender</strong> (antivirus cơ bản dựng sẵn).</p>
<p>Chủ đề là <strong>phòng thủ nhiều lớp</strong>: giả định có lỗi (tràn bộ đệm trong mã C/C++) và làm việc khai thác khó hơn ở mỗi bước. <em>Canary</em> (/GS) là một giá trị bí mật đặt trước địa chỉ trả về; nếu tràn ghi đè nó thì hàm huỷ thay vì trở về mã của kẻ tấn công. <em>NX</em> cấm chạy mã từ trang dữ liệu (bit NX bạn thấy trong PTE ở slide 43). <em>ASLR</em> xáo trộn nơi stack, heap và thư viện được nạp mỗi lần chạy, để kẻ tấn công không cố định được địa chỉ — bạn xem được trên Linux:</p>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--security-opt=seccomp=unconfined</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># ASLR: stack, heap và thư viện nạp ở địa chỉ NGẪU NHIÊN mỗi lần chạy, nên mã khai thác không cố định được chỗ mã nằm<br>
$ show() { grep '\\[stack\\]' /proc/self/maps | cut -d- -f1 | sed 's/^/stack at /'; }<br>
$ echo "ASLR on (default): two runs"<br>
ASLR on (default): two runs<br>
$ bash -c "$(declare -f show); show"; bash -c "$(declare -f show); show"<br>
stack at ffffc5e89000<br>
stack at ffffde5b6000<br>
$ echo "ASLR switched off for one command (setarch -R): two runs"<br>
ASLR switched off for one command (setarch -R): two runs<br>
$ setarch -R bash -c "$(declare -f show); show"; setarch -R bash -c "$(declare -f show); show"<br>
stack at fffffffdf000<br>
stack at fffffffdf000<br>
$ cat /proc/sys/kernel/randomize_va_space | sed 's/^/kernel.randomize_va_space = /'<br>
kernel.randomize_va_space = 2</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<p>Với ASLR bật (mặc định, <code>kernel.randomize_va_space = 2</code>) hai lần chạy cùng chương trình đặt stack ở địa chỉ <em>khác nhau</em>; với ASLR tắt cho một lệnh (<code>setarch -R</code>) cả hai lần đặt nó ở <em>cùng</em> địa chỉ — đúng điều kẻ tấn công muốn. Linux có cùng thực đơn: stack protector (<code>gcc -fstack-protector</code>, canary), NX, ASLR/PIE, bộ cấp phát heap gia cố, <em>ký mô-đun nhân</em> (≈ Code Integrity) và <em>seccomp</em> (hạn chế lời gọi hệ thống). <strong>Patchguard</strong> của Windows (bảo vệ vá nhân trên 64 bit) không có bản sinh đôi Linux chính xác; gần nhất là lockdown mode và mô-đun có ký.</p>
<p><strong>➕ Điều đến sau danh sách 2013 (nguồn: Microsoft Learn).</strong> <strong>Control Flow Guard (CFG)</strong> — "một tính năng bảo mật nền tảng được tối ưu cao, tạo ra để chống lỗ hổng hỏng bộ nhớ": trình biên dịch (<code>/guard:cf</code>) thêm kiểm tra và dựng bảng các đích <em>gọi gián tiếp</em> hợp lệ; lúc chạy Windows xác minh đích và "kết thúc chương trình ngay" nếu không hợp lệ; nó mở rộng /GS, DEP và ASLR; hỗ trợ trên client Windows 10 và 11 và Windows Server 2019 trở lên. <strong>Bảo mật dựa trên ảo hoá (VBS)</strong> — Microsoft: nó "dùng ảo hoá phần cứng và hypervisor Windows để tạo một môi trường ảo cô lập trở thành gốc tin cậy của HĐH mà <em>giả định nhân có thể bị xâm phạm</em>". Tính năng đầu bảng là <strong>memory integrity (HVCI, hypervisor-protected code integrity)</strong>: kiểm toàn vẹn mã nhân chạy trong môi trường cô lập, nên "trang bộ nhớ nhân chỉ được làm thực thi được sau khi qua kiểm toàn vẹn mã … và bản thân trang thực thi không bao giờ ghi được" — "kể cả khi có lỗ hổng như tràn bộ đệm cho phép mã độc cố sửa bộ nhớ, trang mã thực thi không sửa được". VBS đòi hỏi CPU 64 bit có mở rộng ảo hoá, <em>dịch địa chỉ cấp hai</em> (EPT/RVI), IOMMU, TPM 2.0 và Secure Boot. Nhớ chuỗi: <strong>ảo hoá phần cứng → hypervisor → thế giới an toàn (VTL1) → kiểm tra nhân tin cậy</strong> (xem hình dưới). Đây là Chương 7 (hypervisor, phân trang lồng) dùng cho <em>bảo mật</em> thay vì cho thuê máy chủ.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/OSG202/uml/df7af32096d83abdf95edf413d72db948264620c.svg" alt="Windows hiện đại trên hypervisor: Windows thường (VTL0) và thế giới an toàn (VTL1) cho VBS/HVCI, cạnh máy ảo tiện ích WSL 2 và container cô lập bằng Hyper-V" loading="lazy" /><p class="chu-thich">🧩 Windows hiện đại trên hypervisor: Windows thường (VTL0) và thế giới an toàn (VTL1) cho VBS/HVCI, cạnh máy ảo tiện ích WSL 2 và container cô lập bằng Hyper-V</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
' Windows hiện đại trên hypervisor: VBS chia máy thành các mức tin cậy ảo (VTL0 = Windows thường, VTL1 = nhân an toàn); WSL 2 và Windows container cũng dùng Hyper-V
skinparam rectangle {
  RoundCorner 3
}
rectangle "Hardware (CPU with virtualization + SLAT, IOMMU, TPM 2.0, Secure Boot)" as hw
rectangle "Hyper-V hypervisor (type 1, runs first)" as hv
rectangle "Root partition = the Windows you use" as root #E0E7FF {
  rectangle "VTL0 (normal world)\\nWindows kernel + drivers + apps\\nHyper-V management, WSL 2 launcher" as v0
  rectangle "VTL1 (secure world)\\nsecure kernel · HVCI (memory integrity)\\nCredential Guard (LSA isolated)" as v1 #DCFCE7
}
rectangle "WSL 2 lightweight utility VM\\nreal Linux kernel — your distros\\nare containers inside it" as wsl #FEF9C3
rectangle "Hyper-V isolated\\nWindows container\\n(own Windows kernel)" as wc #FEF9C3
hw --&gt; hv
hv --&gt; root
hv --&gt; wsl
hv --&gt; wc
v1 -[hidden]down- v0
note bottom of wsl : docs: "WSL 2 uses virtualization technology to run a Linux kernel\\ninside of a lightweight utility virtual machine"
@enduml</code></pre></details>
<p><strong>➕ Cùng hypervisor đó cũng chạy Linux của bạn:</strong> máy ảo tiện ích nhẹ của WSL 2 (slide 6) và <strong>container Windows</strong>. Trang container của Microsoft: container "chạy trên nhân của HĐH chủ", và khác máy ảo "chạy một HĐH hoàn chỉnh – gồm cả nhân riêng"; container Windows chạy được trên Windows 10 (qua Docker Desktop) và Windows Server 2016, 2019, 2022 và 2025. Theo thuật ngữ Windows <em>cô lập tiến trình (process isolation)</em> chia sẻ nhân chủ (container dựa trên job, slide 28) và <em>cô lập Hyper-V</em> cho mỗi container một nhân nhỏ riêng trong máy ảo tiện ích — "container so với VM" (Chương 7) là một <em>núm vặn</em> trên Windows, không phải hai sản phẩm riêng.</p>
<p class="pitfall">⚠️ "<em>Windows Defender / antivirus làm Windows an toàn</em>" là mô hình tư duy sai: các bảo vệ mạnh nhất (NX, ASLR, CFG, HVCI, driver có ký, đặc quyền tối thiểu) được <em>dựng vào HĐH và trình biên dịch</em>; antivirus là tuyến cuối. Ngoài ra, "ASLR ngăn tràn bộ đệm" là sai: nó chỉ làm việc <em>khai thác</em> khó hơn (nó giấu địa chỉ; tràn vẫn xảy ra).</p>`],
      [64, 'End',
        `<p class="y-chinh">🎯 End of Chapter 11. Windows is <strong>the NT design wrapped in the Win32 API</strong>: a layered but single-address-space kernel (HAL → kernel → executive → drivers); <em>everything is an object</em> reached through <strong>handles</strong> and a <strong>name space</strong>; threads scheduled by <strong>32 strict priorities</strong>; <strong>demand-paged virtual memory</strong> with working sets and page lists; I/O by <strong>IRPs through driver stacks</strong>; files in <strong>NTFS</strong> (an MFT of attribute records and runs); protection by <strong>tokens, descriptors and ACLs</strong> with integrity levels and layers of mitigations — and today all of it can sit on a hypervisor (VBS, WSL 2, containers).</p>
<table>
<thead><tr><th>Topic</th><th>One sentence to remember</th><th>Linux twin you ran</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>Structure</td><td>HAL + kernel + executive + drivers, one address space; ntdll is the only door</td><td>strace of <code>cat</code></td><td>5–16</td></tr>
<tr><td>Objects and handles</td><td>every resource is an object; a handle is an index into a per-process table (max 16 M)</td><td><code>/proc/self/fd</code>, <code>ulimit -n</code></td><td>17–27</td></tr>
<tr><td>Registry</td><td>a database of keys and values stored in hive files</td><td><code>/proc/sys</code> + <code>/etc</code></td><td>10–11</td></tr>
<tr><td>Job / process / thread / fiber</td><td>kernel schedules threads only; job = limits for a group</td><td>cgroup, <code>ucontext</code>, virtual threads</td><td>28–35</td></tr>
<tr><td>Scheduling</td><td>32 priorities, highest ready runs; real-time 16–31; boost cures starvation</td><td><code>chrt</code>, <code>nice</code></td><td>36–39</td></tr>
<tr><td>Memory</td><td>reserve vs commit; 5 page-fault kinds; working sets + standby/modified/free/zeroed</td><td><code>mmap</code>, <code>getrusage</code>, <code>/proc/meminfo</code></td><td>40–48</td></tr>
<tr><td>I/O</td><td>IRP down a device stack, completes up; IOCP completion vs epoll readiness</td><td><code>epoll</code>, <code>/sys/bus</code></td><td>49–52</td></tr>
<tr><td>NTFS</td><td>MFT record = attributes; runs = (start, length); ADS = extra data attributes</td><td><code>debugfs</code>, xattr</td><td>53–58</td></tr>
<tr><td>Security</td><td>token (who) × descriptor (what) → AccessCheck, ACEs in order; integrity levels</td><td><code>id</code>, capabilities, <code>setpriv</code></td><td>59–63</td></tr>
</tbody>
</table>
<p>Where this connects. Chapter 7's hypervisors are now <em>inside</em> Windows (Hyper-V, VBS, WSL 2, Hyper-V containers). Chapter 10's Linux is a first-class guest and a Windows developer's daily environment. Chapter 9's security ideas (ACL, capability, sandbox, mitigations) appear here in concrete Windows form. Chapter 12 (design) will use Windows's choices — uniform objects, layering, stable API versus changeable internals — as case studies of trade-offs. In your own work: <strong>write code on Windows with WSL 2, deploy to Linux, and know the six crossing bugs</strong> — line endings, case, forbidden names, execute bits, path length (MAX_PATH 260 unless long paths are enabled) and file locking.</p>
<p class="meo">🧠 Exam checklist from this chapter: can you (1) draw the user/kernel layers and name ntdll, executive, HAL; (2) list the ten steps of CreateFile; (3) compute the handle capacity (32 × 1024 × 512); (4) read the priority table (Normal + Highest = 10; Idle = 1); (5) explain priority inversion and the boost; (6) list the five page-fault kinds; (7) draw the page-list diagram; (8) read an MFT run list (20 4, 64 2, 80 3 = 9 blocks); (9) run AccessCheck on an ACL; (10) name three mitigations. If yes, you are ready for both the FE questions and the oral presentation.</p>`,
        `<p class="y-chinh">🎯 Hết Chương 11. Windows là <strong>thiết kế NT bọc trong Win32 API</strong>: một nhân phân tầng nhưng chung một không gian địa chỉ (HAL → kernel → executive → driver); <em>mọi thứ là đối tượng</em> tới được qua <strong>handle</strong> và một <strong>không gian tên</strong>; luồng được lập lịch bằng <strong>32 mức ưu tiên chặt</strong>; <strong>bộ nhớ ảo phân trang theo yêu cầu</strong> với tập làm việc và danh sách trang; I/O bằng <strong>IRP qua chồng driver</strong>; tệp trong <strong>NTFS</strong> (một MFT các bản ghi thuộc tính và run); bảo vệ bằng <strong>token, descriptor và ACL</strong> với mức toàn vẹn và nhiều lớp giảm thiểu — và ngày nay tất cả có thể nằm trên một hypervisor (VBS, WSL 2, container).</p>
<table>
<thead><tr><th>Chủ đề</th><th>Một câu để nhớ</th><th>Bản sinh đôi Linux bạn đã chạy</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Cấu trúc</td><td>HAL + kernel + executive + driver, một không gian địa chỉ; ntdll là cửa duy nhất</td><td>strace của <code>cat</code></td><td>5–16</td></tr>
<tr><td>Đối tượng và handle</td><td>mọi tài nguyên là đối tượng; handle là chỉ mục vào bảng riêng từng tiến trình (tối đa 16 M)</td><td><code>/proc/self/fd</code>, <code>ulimit -n</code></td><td>17–27</td></tr>
<tr><td>Registry</td><td>cơ sở dữ liệu khoá và giá trị lưu trong tệp hive</td><td><code>/proc/sys</code> + <code>/etc</code></td><td>10–11</td></tr>
<tr><td>Job / tiến trình / luồng / fiber</td><td>nhân chỉ lập lịch luồng; job = giới hạn cho một nhóm</td><td>cgroup, <code>ucontext</code>, luồng ảo</td><td>28–35</td></tr>
<tr><td>Lập lịch</td><td>32 mức ưu tiên, sẵn sàng cao nhất chạy; thời gian thực 16–31; boost chữa đói</td><td><code>chrt</code>, <code>nice</code></td><td>36–39</td></tr>
<tr><td>Bộ nhớ</td><td>reserve so với commit; 5 loại lỗi trang; tập làm việc + standby/modified/free/zeroed</td><td><code>mmap</code>, <code>getrusage</code>, <code>/proc/meminfo</code></td><td>40–48</td></tr>
<tr><td>I/O</td><td>IRP đi xuống chồng thiết bị, hoàn thành đi lên; IOCP hoàn thành so với epoll sẵn sàng</td><td><code>epoll</code>, <code>/sys/bus</code></td><td>49–52</td></tr>
<tr><td>NTFS</td><td>bản ghi MFT = thuộc tính; run = (đầu, dài); ADS = thuộc tính dữ liệu thêm</td><td><code>debugfs</code>, xattr</td><td>53–58</td></tr>
<tr><td>Bảo mật</td><td>token (ai) × descriptor (gì) → AccessCheck, ACE theo thứ tự; mức toàn vẹn</td><td><code>id</code>, capability, <code>setpriv</code></td><td>59–63</td></tr>
</tbody>
</table>
<p>Chương này nối tiếp sang đâu. Các hypervisor của Chương 7 giờ nằm <em>bên trong</em> Windows (Hyper-V, VBS, WSL 2, container Hyper-V). Linux của Chương 10 là khách hạng nhất và môi trường hằng ngày của dev Windows. Các ý bảo mật của Chương 9 (ACL, capability, hộp cát, giảm thiểu) xuất hiện ở đây dưới dạng Windows cụ thể. Chương 12 (thiết kế) sẽ dùng các lựa chọn của Windows — đối tượng đồng nhất, phân tầng, API ổn định so với phần trong đổi được — làm ca nghiên cứu về đánh đổi. Trong công việc của bạn: <strong>viết mã trên Windows với WSL 2, triển khai lên Linux, và biết sáu lỗi chuyển qua</strong> — ký tự xuống dòng, hoa/thường, tên bị cấm, bit thực thi, độ dài đường dẫn (MAX_PATH 260 trừ khi bật đường dẫn dài) và khoá tệp.</p>
<p class="meo">🧠 Danh sách kiểm cho kỳ thi từ chương này: bạn có (1) vẽ được các tầng người dùng/nhân và gọi tên ntdll, executive, HAL; (2) liệt kê mười bước của CreateFile; (3) tính sức chứa handle (32 × 1024 × 512); (4) đọc bảng ưu tiên (Normal + Highest = 10; Idle = 1); (5) giải thích đảo ngược ưu tiên và boost; (6) kể năm loại lỗi trang; (7) vẽ sơ đồ danh sách trang; (8) đọc một danh sách run MFT (20 4, 64 2, 80 3 = 9 khối); (9) chạy AccessCheck trên một ACL; (10) kể ba biện pháp giảm thiểu. Nếu có, bạn sẵn sàng cho cả câu FE và buổi thuyết trình.</p>`],
    ]),
    bi(`<h2>🎤 Presentation outline — 20 minutes, for a group of 4–5</h2>
<p>Chapter 11 is an official presentation topic of OSG202 (about 20 minutes per group; ask your lecturer for the current rubric — this outline does not guess the marks). The talk below gives every member a part, keeps <strong>one live demonstration</strong> that is also recorded, and stays honest about the fact that the deck describes Windows 8 while you are presenting in 2026.</p>
<table>
<thead><tr><th>Minutes</th><th>Part</th><th>Speaker</th><th>Slides / material from these lessons</th></tr></thead>
<tbody>
<tr><td>0–2</td><td>Hook: "You code on Windows and deploy to Linux — what breaks?" (line endings, case, names) + agenda</td><td>1</td><td>11.A slide 1; demo 1 below</td></tr>
<tr><td>2–5</td><td>History and design goals: two lineages, Cutler, one Win32 API for 30 years; Windows 8 → 10/11 dates</td><td>1</td><td>slides 2–4, the lineage picture</td></tr>
<tr><td>5–9</td><td>Structure: layers, ntdll, executive, HAL; one call traced; objects, handles, name space; ten steps of CreateFile</td><td>2</td><td>slides 5–25, pictures of slides 8 and 25</td></tr>
<tr><td>9–12</td><td>Processes, threads, scheduling: job/process/thread/fiber, 32 priorities, priority inversion + boost; UMS removed</td><td>3</td><td>slides 28–39, the two inversion pictures</td></tr>
<tr><td>12–15</td><td>Memory and I/O: reserve/commit, page faults, working sets and lists; IRP and driver stacks; IOCP vs epoll</td><td>4</td><td>slides 40–52, the page-list diagram</td></tr>
<tr><td>15–18</td><td>NTFS and security: MFT and runs, ADS; token + ACL (run AccessCheck live: the ACE-order picture) ; VBS/HVCI and WSL 2 on the hypervisor</td><td>5 (or 2)</td><td>slides 53–63, pictures of slides 55, 61, 63</td></tr>
<tr><td>18–20</td><td>Summary table (slide 64) + questions</td><td>all</td><td>slide 64</td></tr>
</tbody>
</table>
<ul>
<li><strong>Demo 1 (2 minutes) — the three bugs that bite on deployment.</strong> On Windows with WSL 2: in the Ubuntu terminal create <code>printf '#!/bin/bash\\r\\necho hi\\r\\n' &gt; t.sh; chmod +x t.sh; ./t.sh; file t.sh; sed -i 's/\\r$//' t.sh; ./t.sh</code> (the first run fails, the last works); then <code>touch App.js app.js; ls</code> inside <code>~</code> (two files) and the same inside <code>/mnt/c/…</code> (the second creation fails or overwrites, because the Windows folder is case-insensitive). Compare with slide 31's output.</li>
<li><strong>Demo 2 (1 minute) — the handle table is a folder you can open.</strong> <code>ls -l /proc/self/fd</code> and <code>ls /proc/$$/fd | wc -l</code> in WSL; on Windows show the same view in Process Explorer (Lower Pane → Handles). Say: "a handle is a file descriptor that works for every kind of object".</li>
<li><strong>Backup:</strong> record both demos as 30-second screen videos and keep the pictures on a slide. A live demo that fails costs more marks than a recorded one that works.</li>
<li><strong>Slide design for an audience that reads English slowly:</strong> one idea per slide, at most six lines, a picture from these lessons instead of a paragraph, English keywords on the slide and Vietnamese explanation spoken; show the <em>comparison table</em> (Windows idea ↔ Linux twin) as the one dense slide. Rehearse once with a timer — most groups run 30% over.</li>
<li><strong>Be honest about the date.</strong> Say on slide 2: "the textbook describes Windows 8; we checked Microsoft Learn for what changed" and quote one fact per part (Windows 10 ended support 14 Oct 2025; UMS is not supported on Windows 11; memory limits 128 TB; Dev Drive on Windows 11; Windows 8.1 ended 10 Jan 2023).</li>
</ul>
<h3>Questions the audience (and lecturer) tend to ask — with short answers</h3>
<table>
<thead><tr><th>Question</th><th>Short answer</th></tr></thead>
<tbody>
<tr><td>Is Windows a microkernel?</td><td>No: the executive, drivers and graphics run in kernel mode in one address space (it is "layered monolithic"); it borrowed microkernel vocabulary (kernel, executive, subsystems with message passing) but not the isolation. Drivers can be user-mode (UMDF) to limit crashes.</td></tr>
<tr><td>What is a handle, and how is it different from a pointer or a file descriptor?</td><td>An index into a per-process table of kernel objects with access rights; meaningless in another process. A Linux file descriptor is the same idea for files, pipes, sockets and (via pidfd/eventfd) processes and events; Windows uses it for every object type.</td></tr>
<tr><td>What happens when you call CreateFile?</td><td>Win32 → NtCreateFile → trap → I/O manager → object manager resolves \\??\\C:\\foo\\bar through a symbolic link to the volume device → Parse hands the rest of the path to NTFS via an IRP down the device stack → file object → handle in the process table → return. (ten steps)</td></tr>
<tr><td>Priority inversion?</td><td>A high-priority thread waits for a resource held by a low-priority thread which a medium thread keeps from running. Windows boosts starved threads (the book: ready 4 s → priority 15 for two quanta); real-time systems use priority inheritance.</td></tr>
<tr><td>Hard fault vs soft fault?</td><td>Hard: the data must be read from disk. Soft: the page is already in memory on the standby/modified list or is demand-zero; only the page table is fixed.</td></tr>
<tr><td>What is NTFS's central structure?</td><td>The MFT: one 1-KB record per file, made of attributes (name, security, data…); file data is a list of runs (start, length); small files and small directories live inside the record; extra runs go to extension records.</td></tr>
<tr><td>What is an alternate data stream?</td><td>Another named $DATA attribute of the same file (file:stream). Invisible to size and listing; lost on copy to FAT or non-NTFS; Linux's cousin is an extended attribute.</td></tr>
<tr><td>Why does the order of ACEs matter?</td><td>AccessCheck reads ACEs in order and stops at the first Deny that matches or when Allows add up to every requested right; no match = implicit deny; no DACL = full access.</td></tr>
<tr><td>What did Windows 10/11 change in security?</td><td>Layers around the kernel: VBS/HVCI (the kernel is assumed compromisable; code integrity runs in a hypervisor-isolated secure world), Control Flow Guard, memory integrity, mandatory integrity levels and AppContainer, plus Secure Boot/TPM requirements.</td></tr>
<tr><td>Is WSL 2 an emulator?</td><td>No. WSL 1 translated Linux calls onto the NT kernel; WSL 2 runs a real Linux kernel in a lightweight utility VM on Hyper-V (Microsoft Learn), which gives full system-call compatibility and faster file I/O inside the Linux file system.</td></tr>
</tbody>
</table>
<h3>Useful English for the talk</h3>
<ul>
<li>"In this part we will explain how …" · "As you can see on this figure, …" · "The main difference is that …" · "For example, on Linux the equivalent is …" · "This is important because …" · "To sum up, …" · "Thank you — we are happy to take questions."</li>
<li>Words to pronounce: <em>kernel</em> (KUR-nl), <em>executive</em> (ig-ZEK-yoo-tiv), <em>handle</em>, <em>registry</em> (REJ-is-tree), <em>hive</em> (HIGH-v), <em>fiber</em> (FY-ber), <em>NTFS</em> ("en-tee-eff-ess"), <em>MFT</em> ("em-eff-tee"), <em>ACL</em> ("ay-see-el"), <em>token</em>, <em>privilege</em> (PRIV-i-lij), <em>mitigation</em> (mit-i-GAY-shun).</li>
</ul>
<h2>📌 What you can now do</h2>
<ul>
<li>Tell the two Windows lineages apart and give the support dates of Windows 8.1, 10 and 11 from Microsoft Lifecycle pages.</li>
<li>Draw the Windows layers and trace one Win32 call to the kernel; name the HAL, executive components, drivers and the hypervisor.</li>
<li>Explain objects, handles (16 million per process), the object name space and the ten steps of opening a file; compare with file descriptors and VFS.</li>
<li>Describe job, process, thread, fiber, thread pool and why user-mode scheduling was removed; reproduce each with a Linux cousin (cgroup, ucontext, virtual threads).</li>
<li>Compute Win32 base priorities, explain priority inversion with and without the boost, and compare with nice and real-time priorities.</li>
<li>Explain reserve/commit, the five page-fault kinds, working sets and the standby/modified/free/zeroed lists, the cache manager, and the 2 GB/2 GB versus 128 TB layouts.</li>
<li>Follow an IRP down a device stack and contrast IOCP with epoll; read an NTFS MFT record, runs, alternate data streams, compression, ReFS and Dev Drive.</li>
<li>Evaluate an ACL in order (allow, deny, implicit deny), read an access token, and name the mitigations (canary, NX, ASLR, CFG, HVCI/VBS) — and avoid the Windows-to-Linux deployment bugs.</li>
</ul>`,
    `<h2>🎤 Dàn ý thuyết trình — 20 phút, cho nhóm 4–5 người</h2>
<p>Chương 11 là một chủ đề thuyết trình chính thức của OSG202 (khoảng 20 phút mỗi nhóm; hãy hỏi giảng viên thang chấm hiện hành — dàn ý này không đoán điểm). Bài nói dưới đây cho mỗi thành viên một phần, giữ <strong>một demo sống</strong> cũng được quay sẵn, và trung thực về việc bộ slide mô tả Windows 8 trong khi bạn trình bày năm 2026.</p>
<table>
<thead><tr><th>Phút</th><th>Phần</th><th>Người nói</th><th>Slide / tư liệu từ các bài này</th></tr></thead>
<tbody>
<tr><td>0–2</td><td>Mở đầu: "Bạn code trên Windows và triển khai lên Linux — cái gì hỏng?" (ký tự xuống dòng, hoa/thường, tên) + chương trình</td><td>1</td><td>slide 1 của 11.A; demo 1 bên dưới</td></tr>
<tr><td>2–5</td><td>Lịch sử và mục tiêu thiết kế: hai dòng, Cutler, một Win32 API suốt 30 năm; mốc Windows 8 → 10/11</td><td>1</td><td>slide 2–4, hình hai dòng</td></tr>
<tr><td>5–9</td><td>Cấu trúc: các tầng, ntdll, executive, HAL; một lời gọi được lần theo; đối tượng, handle, không gian tên; mười bước CreateFile</td><td>2</td><td>slide 5–25, hình ở slide 8 và 25</td></tr>
<tr><td>9–12</td><td>Tiến trình, luồng, lập lịch: job/tiến trình/luồng/fiber, 32 mức ưu tiên, đảo ngược ưu tiên + boost; UMS bị gỡ</td><td>3</td><td>slide 28–39, hai hình đảo ngược</td></tr>
<tr><td>12–15</td><td>Bộ nhớ và I/O: reserve/commit, lỗi trang, tập làm việc và danh sách; IRP và chồng driver; IOCP so với epoll</td><td>4</td><td>slide 40–52, sơ đồ danh sách trang</td></tr>
<tr><td>15–18</td><td>NTFS và bảo mật: MFT và run, ADS; token + ACL (chạy AccessCheck trực tiếp: hình thứ tự ACE); VBS/HVCI và WSL 2 trên hypervisor</td><td>5 (hoặc 2)</td><td>slide 53–63, hình ở slide 55, 61, 63</td></tr>
<tr><td>18–20</td><td>Bảng tóm tắt (slide 64) + câu hỏi</td><td>cả nhóm</td><td>slide 64</td></tr>
</tbody>
</table>
<ul>
<li><strong>Demo 1 (2 phút) — ba lỗi cắn khi triển khai.</strong> Trên Windows với WSL 2: trong terminal Ubuntu tạo <code>printf '#!/bin/bash\\r\\necho hi\\r\\n' &gt; t.sh; chmod +x t.sh; ./t.sh; file t.sh; sed -i 's/\\r$//' t.sh; ./t.sh</code> (lần chạy đầu lỗi, lần cuối chạy được); rồi <code>touch App.js app.js; ls</code> trong <code>~</code> (hai tệp) và cùng lệnh trong <code>/mnt/c/…</code> (lần tạo thứ hai lỗi hoặc ghi đè, vì thư mục Windows không phân biệt hoa thường). So với kết quả ở slide 31.</li>
<li><strong>Demo 2 (1 phút) — bảng handle là thư mục bạn mở được.</strong> <code>ls -l /proc/self/fd</code> và <code>ls /proc/$$/fd | wc -l</code> trong WSL; trên Windows cho xem cùng góc nhìn trong Process Explorer (Lower Pane → Handles). Nói: "handle là file descriptor dùng được cho mọi loại đối tượng".</li>
<li><strong>Dự phòng:</strong> quay cả hai demo thành video màn hình 30 giây và giữ ảnh chụp trên một slide. Demo sống bị hỏng mất điểm hơn demo quay sẵn chạy tốt.</li>
<li><strong>Thiết kế slide cho khán giả đọc tiếng Anh chậm:</strong> mỗi slide một ý, tối đa sáu dòng, dùng một hình của các bài này thay cho đoạn văn, từ khoá tiếng Anh trên slide còn lời giải thích nói bằng tiếng Việt; chiếu <em>bảng so sánh</em> (ý Windows ↔ bản sinh đôi Linux) làm slide dày duy nhất. Tập thử một lần có bấm giờ — đa số nhóm quá giờ 30%.</li>
<li><strong>Trung thực về mốc thời gian.</strong> Nói ở slide 2: "sách mô tả Windows 8; chúng tôi kiểm Microsoft Learn để biết cái gì đã đổi" và trích một sự kiện mỗi phần (Windows 10 hết hỗ trợ 14/10/2025; UMS không được hỗ trợ trên Windows 11; giới hạn bộ nhớ 128 TB; Dev Drive trên Windows 11; Windows 8.1 hết hỗ trợ 10/1/2023).</li>
</ul>
<h3>Câu hỏi khán giả (và giảng viên) hay hỏi — kèm đáp án ngắn</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>Đáp án ngắn</th></tr></thead>
<tbody>
<tr><td>Windows có phải vi nhân không?</td><td>Không: executive, driver và đồ hoạ chạy ở chế độ nhân trong một không gian địa chỉ ("nguyên khối phân tầng"); nó mượn từ vựng vi nhân (kernel, executive, hệ thống con truyền thông điệp) nhưng không mượn sự cô lập. Driver có thể ở chế độ người dùng (UMDF) để giới hạn sự cố.</td></tr>
<tr><td>Handle là gì, khác con trỏ hay file descriptor thế nào?</td><td>Một chỉ mục vào bảng riêng từng tiến trình các đối tượng nhân kèm quyền truy cập; vô nghĩa ở tiến trình khác. File descriptor của Linux là cùng ý cho tệp, pipe, socket và (qua pidfd/eventfd) tiến trình và sự kiện; Windows dùng cho mọi loại đối tượng.</td></tr>
<tr><td>Chuyện gì xảy ra khi gọi CreateFile?</td><td>Win32 → NtCreateFile → bẫy → I/O manager → object manager phân giải \\??\\C:\\foo\\bar qua liên kết tượng trưng tới thiết bị volume → Parse đưa phần còn lại của đường dẫn cho NTFS bằng IRP đi xuống chồng thiết bị → file object → handle trong bảng tiến trình → trả về. (mười bước)</td></tr>
<tr><td>Đảo ngược ưu tiên?</td><td>Luồng ưu tiên cao chờ tài nguyên do luồng ưu tiên thấp giữ mà luồng trung bình giữ không cho chạy. Windows boost luồng bị đói (sách: sẵn sàng 4 s → ưu tiên 15 trong hai quantum); hệ thời gian thực dùng kế thừa ưu tiên.</td></tr>
<tr><td>Lỗi cứng so với lỗi mềm?</td><td>Cứng: dữ liệu phải đọc từ đĩa. Mềm: trang đã ở trong bộ nhớ trên danh sách standby/modified hoặc là điền-số-0; chỉ sửa bảng trang.</td></tr>
<tr><td>Cấu trúc trung tâm của NTFS?</td><td>MFT: một bản ghi 1 KB mỗi tệp, gồm các thuộc tính (tên, bảo mật, dữ liệu…); dữ liệu tệp là danh sách run (đầu, dài); tệp nhỏ và thư mục nhỏ nằm trong bản ghi; run thêm sang bản ghi mở rộng.</td></tr>
<tr><td>Luồng dữ liệu phụ là gì?</td><td>Một thuộc tính $DATA có tên khác của cùng tệp (file:stream). Vô hình với cỡ và danh sách; mất khi chép sang FAT hay không phải NTFS; họ hàng Linux là thuộc tính mở rộng.</td></tr>
<tr><td>Vì sao thứ tự ACE quan trọng?</td><td>AccessCheck đọc ACE theo thứ tự và dừng ở Deny đầu tiên khớp hoặc khi các Allow cộng đủ mọi quyền xin; không khớp = từ chối ngầm; không có DACL = toàn quyền.</td></tr>
<tr><td>Windows 10/11 đổi gì trong bảo mật?</td><td>Các lớp quanh nhân: VBS/HVCI (nhân được giả định có thể bị xâm phạm; kiểm toàn vẹn mã chạy trong thế giới an toàn cô lập bằng hypervisor), Control Flow Guard, memory integrity, mức toàn vẹn bắt buộc và AppContainer, cộng yêu cầu Secure Boot/TPM.</td></tr>
<tr><td>WSL 2 có phải bộ giả lập không?</td><td>Không. WSL 1 dịch lời gọi Linux lên nhân NT; WSL 2 chạy nhân Linux thật trong máy ảo tiện ích nhẹ trên Hyper-V (Microsoft Learn), cho tương thích lời gọi hệ thống đầy đủ và I/O tệp nhanh hơn trong hệ thống tệp Linux.</td></tr>
</tbody>
</table>
<h3>Tiếng Anh hữu ích khi nói</h3>
<ul>
<li>"In this part we will explain how …" (Ở phần này chúng tôi sẽ giải thích …) · "As you can see on this figure, …" (Như bạn thấy trên hình này, …) · "The main difference is that …" (Khác biệt chính là …) · "For example, on Linux the equivalent is …" (Ví dụ, trên Linux tương đương là …) · "This is important because …" · "To sum up, …" (Tóm lại, …) · "Thank you — we are happy to take questions."</li>
<li>Từ cần luyện phát âm: <em>kernel</em> (KUR-nl), <em>executive</em> (ig-ZEK-yoo-tiv), <em>handle</em>, <em>registry</em> (REJ-is-tree), <em>hive</em> (HIGH-v), <em>fiber</em> (FY-ber), <em>NTFS</em> ("en-ti-ép-ét"), <em>MFT</em>, <em>ACL</em>, <em>token</em>, <em>privilege</em> (PRIV-i-lij), <em>mitigation</em> (mit-i-GAY-shun).</li>
</ul>
<h2>📌 Bạn đã làm được gì</h2>
<ul>
<li>Phân biệt hai dòng Windows và nêu mốc hỗ trợ của Windows 8.1, 10 và 11 từ các trang Microsoft Lifecycle.</li>
<li>Vẽ các tầng Windows và lần theo một lời gọi Win32 xuống nhân; gọi tên HAL, các thành phần executive, driver và hypervisor.</li>
<li>Giải thích đối tượng, handle (16 triệu mỗi tiến trình), không gian tên đối tượng và mười bước mở một tệp; so với file descriptor và VFS.</li>
<li>Mô tả job, tiến trình, luồng, fiber, thread pool và vì sao lập lịch chế độ người dùng bị gỡ; tái hiện mỗi cái bằng một họ hàng Linux (cgroup, ucontext, luồng ảo).</li>
<li>Tính độ ưu tiên gốc Win32, giải thích đảo ngược ưu tiên có và không có boost, và so với nice và ưu tiên thời gian thực.</li>
<li>Giải thích reserve/commit, năm loại lỗi trang, tập làm việc và các danh sách standby/modified/free/zeroed, cache manager, và bố cục 2 GB/2 GB so với 128 TB.</li>
<li>Lần theo một IRP xuống chồng thiết bị và đối chiếu IOCP với epoll; đọc một bản ghi MFT của NTFS, run, luồng dữ liệu phụ, nén, ReFS và Dev Drive.</li>
<li>Đánh giá một ACL theo thứ tự (allow, deny, từ chối ngầm), đọc một access token, và gọi tên các biện pháp giảm thiểu (canary, NX, ASLR, CFG, HVCI/VBS) — và tránh các lỗi triển khai từ Windows sang Linux.</li>
</ul>`),
    books([
      ['mos4', 'Chapter 11 "Case Study 2: Windows 8", sections 11.4–11.11 (processes and threads, memory, caching, I/O, NTFS, power, security), Figures 11-22 to 11-48', 'Chương 11 "Case Study 2: Windows 8", mục 11.4–11.11 (tiến trình và luồng, bộ nhớ, bộ đệm, I/O, NTFS, năng lượng, bảo mật), Hình 11-22 tới 11-48'],
      ['win32', 'Microsoft Learn (Win32): Scheduling Priorities · Priority Boosts · Job Objects · Fibers · Thread Pools · I/O Completion Ports · File Streams · File Caching · How AccessCheck Works · Mandatory Integrity Control · Control Flow Guard · Memory Limits for Windows Releases', 'Microsoft Learn (Win32): Scheduling Priorities · Priority Boosts · Job Objects · Fibers · Thread Pools · I/O Completion Ports · File Streams · File Caching · How AccessCheck Works · Mandatory Integrity Control · Control Flow Guard · Memory Limits for Windows Releases'],
      ['man7', 'mmap(2), mprotect(2), futex(2), getrusage(2), sched(7), chrt(1), capabilities(7), xattr(7), epoll(7), cgroups(7), proc(5)', 'mmap(2), mprotect(2), futex(2), getrusage(2), sched(7), chrt(1), capabilities(7), xattr(7), epoll(7), cgroups(7), proc(5)'],
      ['kernelDocs', 'Documentation/admin-guide/cgroup-v2.rst, Documentation/filesystems/ext4 (extents), Documentation/admin-guide/sysctl', 'Documentation/admin-guide/cgroup-v2.rst, Documentation/filesystems/ext4 (extent), Documentation/admin-guide/sysctl'],
    ]),
  ].join('\n'),
};

/* ───────── 11.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 11: handles, priorities, ACLs, jobs, CRLF, NTFS ───────── */
const L_on_ch11 = {
  title: '11.C — 🧪 Practice + 🗂 Glossary + 📌 Summary · Chapter 11: handles, priorities, ACLs, jobs, CRLF, NTFS|||11.C — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Chương 11: handle, ưu tiên, ACL, job, CRLF, NTFS',
  slug: 'osg202-on-ch11',
  type: 'VIDEO',
  description: '7 bài tập Chương 11 (Windows) có lời giải chạy thật trên Linux: các phép tính kiểu FE (sức chứa bảng handle, địa chỉ PTE tự ánh xạ, độ ưu tiên gốc, run NTFS), đảo ngược ưu tiên và danh sách trang do bộ mô phỏng vẽ, AccessCheck trên DACL mới với hai thứ tự ACE, bảng descriptor và sự thừa hưởng, một job có giới hạn bộ nhớ dựng bằng cgroup, tìm và sửa ký tự xuống dòng CRLF, và kiểm một đáp án ngân hàng FE mơ hồ (FAT-32 với khối 16 KB) bằng cách tính.',
  content: [
    bi(`<span class="eyebrow">Chapter 11 · Lesson 11.C · Practice &amp; review</span>
<h2>Seven exercises: Windows, computed — and run on Linux</h2>
<p class="lead">Chapter 11 is a presentation topic, but the FE still asks it: process creation calls, process versus thread, critical sections, virtual memory, FAT sizes. This lesson trains the <em>numbers</em> (handle table, priorities, PTE addresses, NTFS runs), the <em>order rules</em> (ACEs) and the <em>deployment skills</em> (descriptors, memory-limited jobs, line endings) from lessons 11.A and 11.B. Every answer is produced by a program or a simulator.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>1</td><td>FE arithmetic: handle capacity, self-map PTE address, base priority, NTFS runs</td><td>11.A 19, 11.B 37, 45, 55</td></tr>
<tr><td>2</td><td>priority inversion with and without the boost; working set + standby list</td><td>11.B 39, 46</td></tr>
<tr><td>3</td><td>AccessCheck on a new DACL, two ACE orders</td><td>11.B 61</td></tr>
<tr><td>4</td><td>descriptors as a per-process table; inheritance and close</td><td>11.A 18</td></tr>
<tr><td>5</td><td>a job with a memory limit (cgroup)</td><td>11.B 28</td></tr>
<tr><td>6</td><td>find and fix CRLF line endings in a folder</td><td>11.B 31</td></tr>
<tr><td>7</td><td>check a question-bank answer by computing it (FAT-32)</td><td>11.B 53, FE bank</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 11 · Bài 11.C · Thực hành &amp; ôn tập</span>
<h2>Bảy bài tập: Windows, tính ra — và chạy trên Linux</h2>
<p class="lead">Chương 11 là chủ đề thuyết trình, nhưng FE vẫn hỏi: lời gọi tạo tiến trình, tiến trình so với luồng, vùng găng, bộ nhớ ảo, cỡ FAT. Bài này luyện các <em>con số</em> (bảng handle, độ ưu tiên, địa chỉ PTE, run NTFS), các <em>luật thứ tự</em> (ACE) và <em>kỹ năng triển khai</em> (descriptor, job giới hạn bộ nhớ, ký tự xuống dòng) từ bài 11.A và 11.B. Mọi đáp án đều do chương trình hay bộ mô phỏng tạo ra.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>1</td><td>bài tính FE: sức chứa handle, địa chỉ PTE tự ánh xạ, độ ưu tiên gốc, run NTFS</td><td>11.A 19, 11.B 37, 45, 55</td></tr>
<tr><td>2</td><td>đảo ngược ưu tiên có và không có boost; tập làm việc + danh sách standby</td><td>11.B 39, 46</td></tr>
<tr><td>3</td><td>AccessCheck trên DACL mới, hai thứ tự ACE</td><td>11.B 61</td></tr>
<tr><td>4</td><td>descriptor là bảng riêng từng tiến trình; thừa hưởng và đóng</td><td>11.A 18</td></tr>
<tr><td>5</td><td>một job có giới hạn bộ nhớ (cgroup)</td><td>11.B 28</td></tr>
<tr><td>6</td><td>tìm và sửa ký tự xuống dòng CRLF trong một thư mục</td><td>11.B 31</td></tr>
<tr><td>7</td><td>kiểm đáp án ngân hàng bằng cách tính (FAT-32)</td><td>11.B 53, ngân hàng FE</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — the FE arithmetic of Chapter 11 (25 min)</h3>
<p>(a) A kernel uses 4096-byte pages, 16-byte handle-table entries, 8-byte pointers in the middle level and <strong>16</strong> pointers in the top level. How many handles can a process hold with a one-, two- and three-level table? (b) On 32-bit x86 with the self-map of slide 45 (PTE window at <code>0xC0000000</code>, page directory at <code>0xC0300000</code>, 4-byte entries) give the address of the PTE and of the page-directory entry for virtual address <code>0x7ff12345</code>. (c) Base priority of a thread at <em>Lowest</em> in the <em>High</em> class; of <em>Highest</em> in the <em>Below normal</em> class. (d) A file's MFT record lists the runs (100, 8), (300, 16), (900, 4) with 4-KiB clusters: file size, and the highest cluster used.</p>
<details><summary>Solution — computed by a program and the simulator</summary>
<pre><code class="language-javascript">// Practice 1: the Chapter 11 calculations, on NEW numbers, computed by a program
// (a) handle table: 4096-byte pages, 16-byte entries, 8-byte pointers, 16 pointers in the top level
const PAGE = 4096, ENTRY = 16, PTR = 8, TOP = 16;
const bottom = PAGE / ENTRY, mid = PAGE / PTR;
console.log(&#96;(a) per bottom page &#36;{bottom}; one-level &#36;{bottom}; two-level &#36;{bottom * mid}; three-level &#36;{bottom * mid * TOP} = 2^&#36;{Math.log2(bottom * mid * TOP)}&#96;);
// (b) self-map on 32-bit x86 (PTE window at 0xC0000000, PD at 0xC0300000, 4-byte entries)
const hex = (n) =&gt; '0x' + (n &gt;&gt;&gt; 0).toString(16).padStart(8, '0');
const va = 0x7ff12345;
console.log(&#96;(b) VA &#36;{hex(va)}: page number &#36;{hex(va &gt;&gt;&gt; 12)}, offset &#36;{hex(va &amp; 0xfff)}, PTE at &#36;{hex(0xC0000000 + (va &gt;&gt;&gt; 12) * 4)}, PDE at &#36;{hex(0xC0300000 + (va &gt;&gt;&gt; 22) * 4)}&#96;);
// (c) priority: class base + offset (Normal 8, Below normal 6, High 13; highest +2, lowest -2)
const base = { normal: 8, below: 6, high: 13 }, off = { highest: 2, lowest: -2 };
console.log(&#96;(c) High+Lowest = &#36;{base.high + off.lowest}; Below normal+Highest = &#36;{base.below + off.highest}; Normal+Lowest = &#36;{base.normal + off.lowest}&#96;);
// (d) NTFS runs (start length): file size in blocks and in bytes with 4 KiB clusters
const runs = [[100, 8], [300, 16], [900, 4]];
const blocks = runs.reduce((s, r) =&gt; s + r[1], 0);
console.log(&#96;(d) runs &#36;{JSON.stringify(runs)}: &#36;{blocks} clusters = &#36;{blocks * 4} KiB; last disk cluster used &#36;{Math.max(...runs.map((r) =&gt; r[0] + r[1] - 1))}&#96;);</code></pre>
<div class="out">$ node tinh-bai-tap.js<br>
(a) per bottom page 256; one-level 256; two-level 131072; three-level 2097152 = 2^21<br>
(b) VA 0x7ff12345: page number 0x0007ff12, offset 0x00000345, PTE at 0xc01ffc48, PDE at 0xc03007fc<br>
(c) High+Lowest = 11; Below normal+Highest = 8; Normal+Lowest = 6<br>
(d) runs [[100,8],[300,16],[900,4]]: 28 clusters = 112 KiB; last disk cluster used 903</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/17ae57c25d78be721e6102dd0bac5dc0d33a35e5.svg" alt="Exercise (c) in the table: High class, Lowest level = 11" loading="lazy" /><p class="chu-thich">🧮 Exercise (c) in the table: High class, Lowest level = 11</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">export const LOP = [['idle', 'Idle', 4], ['below', 'Below normal', 6], ['normal', 'Normal', 8], ['above', 'Above normal', 10], ['high', 'High', 13], ['real', 'Real-time', 24]];
export const MUC = [['timecritical', 'Time critical'], ['highest', 'Highest'], ['abovenormal', 'Above normal'], ['normal', 'Normal'], ['belownormal', 'Below normal'], ['lowest', 'Lowest'], ['idle', 'Idle']];
const LECH = { highest: 2, abovenormal: 1, normal: 0, belownormal: -1, lowest: -2 };
export function goc(lop, muc) {
  const real = lop === 'real';
  if (muc === 'idle') return real ? 16 : 1;
  if (muc === 'timecritical') return real ? 31 : 15;
  return LOP.find((l) =&gt; l[0] === lop)[2] + LECH[muc];
}</code></pre></details>
<ul>
<li>(a) bottom page 4096 / 16 = <strong>256</strong> entries; mid page 4096 / 8 = <strong>512</strong> pointers; so one level 256, two levels 256 × 512 = <strong>131,072</strong>, three levels 256 × 512 × 16 = <strong>2,097,152</strong> = 2²¹. (The book's figure has 8-byte entries, 4-byte pointers and 32 top pointers: 512 × 1024 × 32 = 2²⁴ = 16,777,216.)</li>
<li>(b) page number = VA &gt;&gt; 12 = <code>0x7ff12</code>; PTE address = <code>0xC0000000 + 0x7ff12 × 4</code> = <strong><code>0xc01ffc48</code></strong>; PDE address = <code>0xC0300000 + (VA &gt;&gt; 22) × 4</code> = <code>0xC0300000 + 0x1ff × 4</code> = <strong><code>0xc03007fc</code></strong>. (The same method gives <code>0xc0390c84</code> for the book's <code>0xe4321000</code>.)</li>
<li>(c) High class base 13, Lowest −2 → <strong>11</strong> (the table above); Below normal base 6, Highest +2 → <strong>8</strong>.</li>
<li>(d) 8 + 16 + 4 = <strong>28 clusters</strong> × 4 KiB = <strong>112 KiB</strong> (allocated size; the real size may be a little smaller); the highest cluster is 900 + 4 − 1 = <strong>903</strong>. The trap: the second number of a run is a <em>length</em>, not an end address.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — các phép tính FE của Chương 11 (25 phút)</h3>
<p>(a) Một nhân dùng trang 4096 byte, mục bảng handle 16 byte, con trỏ 8 byte ở tầng giữa và <strong>16</strong> con trỏ ở tầng trên cùng. Một tiến trình giữ được bao nhiêu handle với bảng một, hai và ba tầng? (b) Trên x86 32 bit với tự ánh xạ của slide 45 (cửa sổ PTE ở <code>0xC0000000</code>, thư mục trang ở <code>0xC0300000</code>, mục 4 byte) cho địa chỉ của PTE và của mục thư mục trang với địa chỉ ảo <code>0x7ff12345</code>. (c) Độ ưu tiên gốc của luồng ở mức <em>Lowest</em> trong lớp <em>High</em>; của <em>Highest</em> trong lớp <em>Below normal</em>. (d) Bản ghi MFT của một tệp liệt kê các run (100, 8), (300, 16), (900, 4) với cluster 4 KiB: cỡ tệp, và cluster cao nhất được dùng.</p>
<details><summary>Lời giải — chương trình và bộ mô phỏng tính</summary>
<pre><code class="language-javascript">// Bài 1: các phép tính của Chương 11, trên số MỚI, do chương trình tính
// (a) bảng handle: trang 4096 byte, mục 16 byte, con trỏ 8 byte, 16 con trỏ ở tầng trên
const PAGE = 4096, ENTRY = 16, PTR = 8, TOP = 16;
const bottom = PAGE / ENTRY, mid = PAGE / PTR;
console.log(&#96;(a) per bottom page &#36;{bottom}; one-level &#36;{bottom}; two-level &#36;{bottom * mid}; three-level &#36;{bottom * mid * TOP} = 2^&#36;{Math.log2(bottom * mid * TOP)}&#96;);
// (b) tự ánh xạ trên x86 32 bit
const hex = (n) =&gt; '0x' + (n &gt;&gt;&gt; 0).toString(16).padStart(8, '0');
const va = 0x7ff12345;
console.log(&#96;(b) VA &#36;{hex(va)}: page number &#36;{hex(va &gt;&gt;&gt; 12)}, offset &#36;{hex(va &amp; 0xfff)}, PTE at &#36;{hex(0xC0000000 + (va &gt;&gt;&gt; 12) * 4)}, PDE at &#36;{hex(0xC0300000 + (va &gt;&gt;&gt; 22) * 4)}&#96;);
// (c) độ ưu tiên: gốc lớp + độ lệch
const base = { normal: 8, below: 6, high: 13 }, off = { highest: 2, lowest: -2 };
console.log(&#96;(c) High+Lowest = &#36;{base.high + off.lowest}; Below normal+Highest = &#36;{base.below + off.highest}; Normal+Lowest = &#36;{base.normal + off.lowest}&#96;);
// (d) run NTFS: cỡ tệp theo khối và theo byte với cluster 4 KiB
const runs = [[100, 8], [300, 16], [900, 4]];
const blocks = runs.reduce((s, r) =&gt; s + r[1], 0);
console.log(&#96;(d) runs &#36;{JSON.stringify(runs)}: &#36;{blocks} clusters = &#36;{blocks * 4} KiB; last disk cluster used &#36;{Math.max(...runs.map((r) =&gt; r[0] + r[1] - 1))}&#96;);</code></pre>
<div class="out">$ node tinh-bai-tap.js<br>
(a) per bottom page 256; one-level 256; two-level 131072; three-level 2097152 = 2^21<br>
(b) VA 0x7ff12345: page number 0x0007ff12, offset 0x00000345, PTE at 0xc01ffc48, PDE at 0xc03007fc<br>
(c) High+Lowest = 11; Below normal+Highest = 8; Normal+Lowest = 6<br>
(d) runs [[100,8],[300,16],[900,4]]: 28 clusters = 112 KiB; last disk cluster used 903</div>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/80ca4cb468245d6062b3c242c59b5b8cab178824.svg" alt="Bài (c) trong bảng: lớp High, mức Lowest = 11" loading="lazy" /><p class="chu-thich">🧮 Bài (c) trong bảng: lớp High, mức Lowest = 11</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">export const LOP = [['idle', 'Idle', 4], ['below', 'Below normal', 6], ['normal', 'Normal', 8], ['above', 'Above normal', 10], ['high', 'High', 13], ['real', 'Real-time', 24]];
export const MUC = [['timecritical', 'Time critical'], ['highest', 'Highest'], ['abovenormal', 'Above normal'], ['normal', 'Normal'], ['belownormal', 'Below normal'], ['lowest', 'Lowest'], ['idle', 'Idle']];
const LECH = { highest: 2, abovenormal: 1, normal: 0, belownormal: -1, lowest: -2 };
export function goc(lop, muc) {
  const real = lop === 'real';
  if (muc === 'idle') return real ? 16 : 1;
  if (muc === 'timecritical') return real ? 31 : 15;
  return LOP.find((l) =&gt; l[0] === lop)[2] + LECH[muc];
}</code></pre></details>
<ul>
<li>(a) trang đáy 4096 / 16 = <strong>256</strong> mục; trang giữa 4096 / 8 = <strong>512</strong> con trỏ; nên một tầng 256, hai tầng 256 × 512 = <strong>131.072</strong>, ba tầng 256 × 512 × 16 = <strong>2.097.152</strong> = 2²¹. (Hình của sách có mục 8 byte, con trỏ 4 byte và 32 con trỏ trên cùng: 512 × 1024 × 32 = 2²⁴ = 16.777.216.)</li>
<li>(b) số trang = VA &gt;&gt; 12 = <code>0x7ff12</code>; địa chỉ PTE = <code>0xC0000000 + 0x7ff12 × 4</code> = <strong><code>0xc01ffc48</code></strong>; địa chỉ PDE = <code>0xC0300000 + (VA &gt;&gt; 22) × 4</code> = <code>0xC0300000 + 0x1ff × 4</code> = <strong><code>0xc03007fc</code></strong>. (Cùng cách cho <code>0xc0390c84</code> với <code>0xe4321000</code> của sách.)</li>
<li>(c) Lớp High gốc 13, Lowest −2 → <strong>11</strong> (bảng trên); Below normal gốc 6, Highest +2 → <strong>8</strong>.</li>
<li>(d) 8 + 16 + 4 = <strong>28 cluster</strong> × 4 KiB = <strong>112 KiB</strong> (cỡ cấp phát; cỡ thật có thể nhỏ hơn chút); cluster cao nhất là 900 + 4 − 1 = <strong>903</strong>. Bẫy: số thứ hai của một run là <em>độ dài</em>, không phải địa chỉ cuối.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — priority inversion and page lists (20 min)</h3>
<p>(a) Thread T4 (priority 4) holds semaphore S for 4 units of work, T8 (priority 8, 20 units of pure computation) arrives at t = 2, T12 (priority 12, needs S, 2 units) arrives at t = 3. With strict priorities, when does T12 finish and how long was it blocked? (b) With the anti-starvation boost (a ready thread that waits 4 units is lifted to 15 for two quanta), when does it finish? (c) On the reference string 1 2 3 4 1 2 5 1 2 3 4 5 a process has a working set of 3 pages replaced FIFO. How many hard faults with no standby list, and how many hard and soft faults with a standby list of 3?</p>
<details><summary>Solution — computed by the simulator</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/4dad29148636126be2022b5bd3e7fb99bcdd00c9.svg" alt="(a) strict priority: T12 finishes at 26" loading="lazy" /><p class="chu-thich">🧮 (a) strict priority: T12 finishes at 26</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/95acdf390bb0d0eaf22338319c6914cd918d590c.svg" alt="(b) with the boost: T12 finishes at 10" loading="lazy" /><p class="chu-thich">🧮 (b) with the boost: T12 finishes at 10</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/79e2ce21b61a56e4b1fd7a7f024d7cafd310346f.svg" alt="(c) no standby list: 9 hard faults" loading="lazy" /><p class="chu-thich">🧮 (c) no standby list: 9 hard faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/8c2f7b8758217056fa7ad4638e97902562197366.svg" alt="(c) standby list of 3: 5 hard + 4 soft faults" loading="lazy" /><p class="chu-thich">🧮 (c) standby list of 3: 5 hard + 4 soft faults</p></div>
<details><summary>This picture is COMPUTED, not drawn by hand — see the simulator code (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<ul>
<li>(a) T12 blocks at t = 3 and is unblocked at t = 24 (T4 can only finish after T8 ends at 22), runs 2 units and ends at <strong>26</strong>: blocked <strong>21</strong> units (3 → 24), a 2-unit job took 23 units from arrival.</li>
<li>(b) T4 has waited since t = 2; at t = 6 it is boosted to 15, preempts T8, releases S at t = 8, and T12 runs 8 → <strong>10</strong>. T8 pays: it ends at 26.</li>
<li>(c) <strong>9</strong> hard faults with no standby list (the FIFO count of Chapter 3); with a 3-page standby list only the 5 first references hit the disk (<strong>5 hard</strong>) and 4 re-references are <strong>soft</strong>. Note the hit count (3) is the same: the lists do not change what is <em>in</em> the working set, only the <em>price</em> of a miss.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — đảo ngược ưu tiên và danh sách trang (20 phút)</h3>
<p>(a) Luồng T4 (ưu tiên 4) giữ semaphore S trong 4 đơn vị việc, T8 (ưu tiên 8, 20 đơn vị tính toán thuần) tới lúc t = 2, T12 (ưu tiên 12, cần S, 2 đơn vị) tới lúc t = 3. Với ưu tiên chặt, T12 xong lúc nào và bị chặn bao lâu? (b) Với boost chống đói (luồng sẵn sàng đợi 4 đơn vị được nâng lên 15 trong hai quantum), nó xong lúc nào? (c) Trên chuỗi tham chiếu 1 2 3 4 1 2 5 1 2 3 4 5 một tiến trình có tập làm việc 3 trang thay FIFO. Bao nhiêu lỗi cứng khi không có danh sách standby, và bao nhiêu lỗi cứng và mềm với danh sách standby 3?</p>
<details><summary>Lời giải — bộ mô phỏng tính</summary>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/76e2f26cfd901a2866a05d1c229a43ea3977741d.svg" alt="(a) ưu tiên chặt: T12 xong lúc 26" loading="lazy" /><p class="chu-thich">🧮 (a) ưu tiên chặt: T12 xong lúc 26</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/5b25537f22e3b3b5d84c00f58a1286ad9c13053e.svg" alt="(b) với boost: T12 xong lúc 10" loading="lazy" /><p class="chu-thich">🧮 (b) với boost: T12 xong lúc 10</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const LUONG = [
  { ten: 'T4',  base: 4,  den: 0, plan: [{ acq: 'S' }, { cpu: 4 }, { rel: 'S' }] },      // holds S while it computes 4 units
  { ten: 'T8',  base: 8,  den: 2, plan: [{ cpu: 20 }] },                                 // compute-bound
  { ten: 'T12', base: 12, den: 3, plan: [{ acq: 'S' }, { cpu: 2 }, { rel: 'S' }] },      // urgent thread, needs S
];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/3051dd7bf5b60eaf7dd79956c01a936e8b1742fd.svg" alt="(c) không có standby: 9 lỗi cứng" loading="lazy" /><p class="chu-thich">🧮 (c) không có standby: 9 lỗi cứng</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<div class="anh-slide uml sim"><img src="https://media.cuongthai.com/images/academy/OSG202/hinh/a8572fbc39598c026b4e0fe7045a7b1b9fb32f58.svg" alt="(c) standby 3: 5 lỗi cứng + 4 lỗi mềm" loading="lazy" /><p class="chu-thich">🧮 (c) standby 3: 5 lỗi cứng + 4 lỗi mềm</p></div>
<details><summary>Hình này do máy TÍNH thật — xem mã mô phỏng (JavaScript)</summary><pre><code class="language-javascript">const CHUOI = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];</code></pre></details>
<ul>
<li>(a) T12 bị chặn lúc t = 3 và được mở lúc t = 24 (T4 chỉ xong sau khi T8 kết thúc lúc 22), chạy 2 đơn vị và kết thúc lúc <strong>26</strong>: bị chặn <strong>21</strong> đơn vị (3 → 24), một việc 2 đơn vị tốn 23 đơn vị kể từ lúc tới.</li>
<li>(b) T4 đợi từ t = 2; lúc t = 6 nó được nâng lên 15, chiếm quyền T8, nhả S lúc t = 8, và T12 chạy 8 → <strong>10</strong>. T8 trả giá: nó xong lúc 26.</li>
<li>(c) <strong>9</strong> lỗi cứng khi không có standby (số FIFO của Chương 3); với standby 3 trang chỉ 5 lần tham chiếu đầu chạm đĩa (<strong>5 cứng</strong>) và 4 lần tham chiếu lại là <strong>mềm</strong>. Để ý số lần trúng (3) giống nhau: các danh sách không đổi <em>cái gì ở trong</em> tập làm việc, chỉ đổi <em>giá</em> của một lần trượt.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — AccessCheck on a new DACL (15 min)</h3>
<p>Users: <em>dana</em> is in Staff; <em>ivo</em> is in Staff <strong>and</strong> Interns; <em>max</em> is only in Everyone. List 1 (in this order): <em>Allow Staff RW</em>, <em>Deny Interns W</em>, <em>Allow Everyone R</em>. List 2 is the same three ACEs but with <em>Deny Interns W</em> first. For each list, what happens when dana asks RW, ivo asks W, max asks R, max asks W?</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-javascript">// Practice 3: AccessCheck on a new DACL (order matters), computed by a program
const BITS = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; BITS.indexOf(c)), 0);
function check(dacl, groups, want) {
  const w = mask(want); let got = 0;
  for (const a of dacl) {
    if (!groups.includes(a.who)) continue;
    if (a.type === 'Deny' &amp;&amp; (a.m &amp; w)) return 'DENIED (Deny ' + a.who + ')';
    if (a.type === 'Allow') { got |= a.m &amp; w; if (got === w) return 'GRANTED'; }
  }
  return 'DENIED (implicit)';
}
const A = (type, who, rights) =&gt; ({ type, who, m: mask(rights) });
const list1 = [A('Allow', 'Staff', 'RW'), A('Deny', 'Interns', 'W'), A('Allow', 'Everyone', 'R')];
const list2 = [A('Deny', 'Interns', 'W'), A('Allow', 'Staff', 'RW'), A('Allow', 'Everyone', 'R')];
const tok = { dana: ['dana', 'Staff', 'Everyone'], ivo: ['ivo', 'Staff', 'Interns', 'Everyone'], max: ['max', 'Everyone'] };
for (const [n, l] of [['list 1 (Allow Staff first)', list1], ['list 2 (Deny Interns first)', list2]]) {
  console.log(n);
  for (const [who, want] of [['dana', 'RW'], ['ivo', 'W'], ['max', 'R'], ['max', 'W']]) console.log(&#96;  &#36;{who} asks &#36;{want}: &#36;{check(l, tok[who], want)}&#96;);
}</code></pre>
<div class="out">$ node acl-bai-tap.js<br>
list 1 (Allow Staff first)<br>
&nbsp;&nbsp;dana asks RW: GRANTED<br>
&nbsp;&nbsp;ivo asks W: GRANTED<br>
&nbsp;&nbsp;max asks R: GRANTED<br>
&nbsp;&nbsp;max asks W: DENIED (implicit)<br>
list 2 (Deny Interns first)<br>
&nbsp;&nbsp;dana asks RW: GRANTED<br>
&nbsp;&nbsp;ivo asks W: DENIED (Deny Interns)<br>
&nbsp;&nbsp;max asks R: GRANTED<br>
&nbsp;&nbsp;max asks W: DENIED (implicit)</div>
<ul>
<li><strong>List 1:</strong> dana RW → ACE 1 (Staff) grants both: GRANTED. <strong>ivo W → ACE 1 grants W first: GRANTED</strong> — the Deny for Interns is never reached! max R → ACE 1 and 2 do not apply, ACE 3 grants R: GRANTED. max W → only R is ever granted: DENIED (implicit).</li>
<li><strong>List 2:</strong> dana RW: ACE 1 (Deny Interns) does not apply to her; ACE 2 grants RW: GRANTED. <strong>ivo W → ACE 1 denies W: DENIED.</strong> max R: GRANTED; max W: DENIED (implicit).</li>
<li>Lesson: the <em>same</em> three entries give a different answer for ivo purely because of order. That is why Windows keeps explicit Deny entries first (the <em>canonical order</em>) — and why a rule written as "Allow Staff, but not Interns" must put the Deny ahead. Compare slide 61's simulator.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — AccessCheck trên DACL mới (15 phút)</h3>
<p>Người dùng: <em>dana</em> thuộc Staff; <em>ivo</em> thuộc Staff <strong>và</strong> Interns; <em>max</em> chỉ thuộc Everyone. Danh sách 1 (theo thứ tự này): <em>Allow Staff RW</em>, <em>Deny Interns W</em>, <em>Allow Everyone R</em>. Danh sách 2 là cùng ba ACE nhưng <em>Deny Interns W</em> đứng đầu. Với mỗi danh sách, chuyện gì xảy ra khi dana xin RW, ivo xin W, max xin R, max xin W?</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-javascript">// Bài 3: AccessCheck trên DACL mới (thứ tự quan trọng), do chương trình tính
const BITS = 'RWXDPO';
const mask = (s) =&gt; [...s].reduce((m, c) =&gt; m | (1 &lt;&lt; BITS.indexOf(c)), 0);
function check(dacl, groups, want) {
  const w = mask(want); let got = 0;
  for (const a of dacl) {
    if (!groups.includes(a.who)) continue;
    if (a.type === 'Deny' &amp;&amp; (a.m &amp; w)) return 'DENIED (Deny ' + a.who + ')';
    if (a.type === 'Allow') { got |= a.m &amp; w; if (got === w) return 'GRANTED'; }
  }
  return 'DENIED (implicit)';
}
const A = (type, who, rights) =&gt; ({ type, who, m: mask(rights) });
const list1 = [A('Allow', 'Staff', 'RW'), A('Deny', 'Interns', 'W'), A('Allow', 'Everyone', 'R')];
const list2 = [A('Deny', 'Interns', 'W'), A('Allow', 'Staff', 'RW'), A('Allow', 'Everyone', 'R')];
const tok = { dana: ['dana', 'Staff', 'Everyone'], ivo: ['ivo', 'Staff', 'Interns', 'Everyone'], max: ['max', 'Everyone'] };
for (const [n, l] of [['list 1 (Allow Staff first)', list1], ['list 2 (Deny Interns first)', list2]]) {
  console.log(n);
  for (const [who, want] of [['dana', 'RW'], ['ivo', 'W'], ['max', 'R'], ['max', 'W']]) console.log(&#96;  &#36;{who} asks &#36;{want}: &#36;{check(l, tok[who], want)}&#96;);
}</code></pre>
<div class="out">$ node acl-bai-tap.js<br>
list 1 (Allow Staff first)<br>
&nbsp;&nbsp;dana asks RW: GRANTED<br>
&nbsp;&nbsp;ivo asks W: GRANTED<br>
&nbsp;&nbsp;max asks R: GRANTED<br>
&nbsp;&nbsp;max asks W: DENIED (implicit)<br>
list 2 (Deny Interns first)<br>
&nbsp;&nbsp;dana asks RW: GRANTED<br>
&nbsp;&nbsp;ivo asks W: DENIED (Deny Interns)<br>
&nbsp;&nbsp;max asks R: GRANTED<br>
&nbsp;&nbsp;max asks W: DENIED (implicit)</div>
<ul>
<li><strong>Danh sách 1:</strong> dana RW → ACE 1 (Staff) cho cả hai: GRANTED. <strong>ivo W → ACE 1 cho W trước: GRANTED</strong> — Deny của Interns không bao giờ tới! max R → ACE 1 và 2 không áp dụng, ACE 3 cho R: GRANTED. max W → chỉ R được cấp: DENIED (ngầm).</li>
<li><strong>Danh sách 2:</strong> dana RW: ACE 1 (Deny Interns) không áp dụng cho cô; ACE 2 cho RW: GRANTED. <strong>ivo W → ACE 1 từ chối W: DENIED.</strong> max R: GRANTED; max W: DENIED (ngầm).</li>
<li>Bài học: ba mục <em>giống nhau</em> cho đáp án khác với ivo chỉ vì thứ tự. Đó là lý do Windows giữ các mục Deny tường minh lên đầu (<em>thứ tự chuẩn</em>) — và vì sao luật viết "Allow Staff, nhưng không cho Interns" phải đặt Deny phía trước. So với bộ mô phỏng ở slide 61.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — descriptors are a per-process table (10 min)</h3>
<p>In a shell, open <code>/etc/hostname</code> on descriptor 3 and <code>/etc/passwd</code> on descriptor 9 (<code>exec 3&lt;… 9&lt;…</code>). (a) Which targets do <code>/proc/self/fd/3</code> and <code>/9</code> show? (b) Does a child shell see them? (c) After you close 9 in the parent, what does a new child see? This is the Linux version of handle inheritance (<code>bInheritHandle</code>).</p>
<details><summary>Solution — run for real</summary>
<div class="out"># Practice 4: descriptors are a per-process table; a child inherits them unless close-on-exec<br>
$ exec 3&lt;/etc/hostname 9&lt;/etc/passwd<br>
$ for fd in 3 9; do echo "parent fd $fd -&gt; $(readlink /proc/self/fd/$fd)"; done<br>
parent fd 3 -&gt; /etc/hostname<br>
parent fd 9 -&gt; /etc/passwd<br>
# a child shell inherits fd 3 and 9 (like bInheritHandle = TRUE)<br>
$ bash -c 'for fd in 3 9; do echo "child &nbsp;fd $fd -&gt; $(readlink /proc/self/fd/$fd)"; done'<br>
child &nbsp;fd 3 -&gt; /etc/hostname<br>
child &nbsp;fd 9 -&gt; /etc/passwd<br>
# close one in the parent: the child no longer has it<br>
$ exec 9&lt;&amp;-<br>
$ bash -c 'echo "child after parent closed 9: $(ls /proc/self/fd | tr "\\n" " ")"'<br>
child after parent closed 9: 0 1 2 3 4<br>
$ echo "count of open descriptors in this shell: $(ls /proc/$$/fd | wc -l)"<br>
count of open descriptors in this shell: 6</div>
<ul>
<li>(a) the kernel resolves each slot to the object it points to: <code>3 → /etc/hostname</code>, <code>9 → /etc/passwd</code>.</li>
<li>(b) <strong>yes</strong>: the child shows the same two targets — inherited at process creation, because these descriptors do not have close-on-exec.</li>
<li>(c) after <code>exec 9&lt;&amp;-</code> the new child lists <code>0 1 2 3 4</code>: 0–2 are the standard streams, 3 is still inherited, 4 is the descriptor <code>ls</code> itself uses to read the directory; 9 is gone. The counts differ by one or two from run to run because the shell opens temporary descriptors (the output is masked for numbers).</li>
<li>Windows: the same experiment with <code>CreateFile(…, bInheritHandle = TRUE/FALSE)</code> and <code>CreateProcess(…, bInheritHandles, …)</code>; Process Explorer's lower pane lists a process's handles the way <code>ls /proc/&lt;pid&gt;/fd</code> does.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — descriptor là bảng riêng từng tiến trình (10 phút)</h3>
<p>Trong một shell, mở <code>/etc/hostname</code> trên descriptor 3 và <code>/etc/passwd</code> trên descriptor 9 (<code>exec 3&lt;… 9&lt;…</code>). (a) <code>/proc/self/fd/3</code> và <code>/9</code> cho thấy đích nào? (b) Shell con có thấy chúng không? (c) Sau khi đóng 9 ở cha, một shell con mới thấy gì? Đây là phiên bản Linux của thừa kế handle (<code>bInheritHandle</code>).</p>
<details><summary>Lời giải — chạy thật</summary>
<div class="out"># Bài 4: descriptor là bảng riêng từng tiến trình; tiến trình con thừa hưởng trừ khi close-on-exec<br>
$ exec 3&lt;/etc/hostname 9&lt;/etc/passwd<br>
$ for fd in 3 9; do echo "parent fd $fd -&gt; $(readlink /proc/self/fd/$fd)"; done<br>
parent fd 3 -&gt; /etc/hostname<br>
parent fd 9 -&gt; /etc/passwd<br>
# shell con thừa hưởng fd 3 và 9 (như bInheritHandle = TRUE)<br>
$ bash -c 'for fd in 3 9; do echo "child &nbsp;fd $fd -&gt; $(readlink /proc/self/fd/$fd)"; done'<br>
child &nbsp;fd 3 -&gt; /etc/hostname<br>
child &nbsp;fd 9 -&gt; /etc/passwd<br>
# đóng một cái ở cha: con không còn nó<br>
$ exec 9&lt;&amp;-<br>
$ bash -c 'echo "child after parent closed 9: $(ls /proc/self/fd | tr "\\n" " ")"'<br>
child after parent closed 9: 0 1 2 3 4<br>
$ echo "count of open descriptors in this shell: $(ls /proc/$$/fd | wc -l)"<br>
count of open descriptors in this shell: 6</div>
<ul>
<li>(a) nhân giải mỗi ô thành đối tượng nó trỏ tới: <code>3 → /etc/hostname</code>, <code>9 → /etc/passwd</code>.</li>
<li>(b) <strong>có</strong>: shell con cho thấy cùng hai đích — thừa hưởng lúc tạo tiến trình, vì các descriptor này không có close-on-exec.</li>
<li>(c) sau <code>exec 9&lt;&amp;-</code> shell con mới liệt kê <code>0 1 2 3 4</code>: 0–2 là luồng chuẩn, 3 vẫn được thừa hưởng, 4 là descriptor mà chính <code>ls</code> dùng để đọc thư mục; 9 đã mất. Số đếm lệch một hai đơn vị giữa các lần chạy vì shell mở descriptor tạm (kết quả được che số).</li>
<li>Windows: cùng thí nghiệm với <code>CreateFile(…, bInheritHandle = TRUE/FALSE)</code> và <code>CreateProcess(…, bInheritHandles, …)</code>; ngăn dưới của Process Explorer liệt kê handle của một tiến trình như <code>ls /proc/&lt;pid&gt;/fd</code>.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — a job with a memory limit (15 min)</h3>
<p>A Windows job object can limit the memory of a group of processes; Linux uses a cgroup. Create a cgroup with <code>memory.max</code> = 16 MiB, put a program that allocates without end (<code>tail /dev/zero</code>) in it, and answer: (a) what exit status does the program get and what does the kernel count? (b) is the rest of the machine (your shell) affected? (c) which Win32 function and which Docker option correspond?</p>
<details><summary>Solution — run for real (🎲 one real run)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Practice 5: a "job" with a memory limit: the member is killed, the rest of the machine is fine<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+memory" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
$ mkdir /sys/fs/cgroup/job16 &amp;&amp; echo 16M &gt; /sys/fs/cgroup/job16/memory.max<br>
$ echo "memory.max = $(cat /sys/fs/cgroup/job16/memory.max)"<br>
memory.max = 16777216<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/job16/cgroup.procs; tail /dev/zero'; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;20 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bash -c 'echo $$ &gt; /sys/fs/cgroup/job16/cgroup.procs; tail /dev/zero'<br>
exit=137<br>
$ grep oom_kill /sys/fs/cgroup/job16/memory.events<br>
oom_kill 1<br>
$ echo "this shell is still alive: $(date +%Y)" | sed 's/[0-9]\\{4\\}/YYYY/'<br>
this shell is still alive: YYYY</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li>(a) <code>exit=137</code> = 128 + 9 (SIGKILL) and <code>oom_kill 1</code> in <code>memory.events</code>: the kernel killed <em>only</em> that process because the <em>group</em> crossed its limit.</li>
<li>(b) no — the shell that started it is outside the group and prints its line afterwards. (This demo must run with <code>--privileged</code> because it writes under <code>/sys/fs/cgroup</code>.)</li>
<li>(c) Windows: <code>SetInformationJobObject</code> with <code>JobObjectExtendedLimitInformation</code> (<code>JOB_OBJECT_LIMIT_JOB_MEMORY</code>); Docker: <code>docker run --memory=16m</code> (Docker writes exactly this cgroup file). For a container that hits the limit, <code>docker inspect</code> shows <code>OOMKilled: true</code> and exit code 137 — the same two numbers.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — một job có giới hạn bộ nhớ (15 phút)</h3>
<p>Job object của Windows giới hạn được bộ nhớ của một nhóm tiến trình; Linux dùng cgroup. Tạo một cgroup với <code>memory.max</code> = 16 MiB, đặt vào đó một chương trình cấp phát không dứt (<code>tail /dev/zero</code>), và trả lời: (a) chương trình nhận mã thoát nào và nhân đếm gì? (b) phần còn lại của máy (shell của bạn) có bị ảnh hưởng không? (c) hàm Win32 nào và tuỳ chọn Docker nào tương ứng?</p>
<details><summary>Lời giải — chạy thật (🎲 một lần chạy thật)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5: một "job" có giới hạn bộ nhớ: thành viên bị giết, phần còn lại của máy không sao<br>
$ mkdir /sys/fs/cgroup/init &amp;&amp; echo $$ &gt; /sys/fs/cgroup/init/cgroup.procs<br>
$ echo "+memory" &gt; /sys/fs/cgroup/cgroup.subtree_control<br>
$ mkdir /sys/fs/cgroup/job16 &amp;&amp; echo 16M &gt; /sys/fs/cgroup/job16/memory.max<br>
$ echo "memory.max = $(cat /sys/fs/cgroup/job16/memory.max)"<br>
memory.max = 16777216<br>
$ bash -c 'echo $$ &gt; /sys/fs/cgroup/job16/cgroup.procs; tail /dev/zero'; echo "exit=$?"<br>
bash: &nbsp;&nbsp;&nbsp;20 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bash -c 'echo $$ &gt; /sys/fs/cgroup/job16/cgroup.procs; tail /dev/zero'<br>
exit=137<br>
$ grep oom_kill /sys/fs/cgroup/job16/memory.events<br>
oom_kill 1<br>
$ echo "this shell is still alive: $(date +%Y)" | sed 's/[0-9]\\{4\\}/YYYY/'<br>
this shell is still alive: YYYY</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li>(a) <code>exit=137</code> = 128 + 9 (SIGKILL) và <code>oom_kill 1</code> trong <code>memory.events</code>: nhân giết <em>chỉ</em> tiến trình đó vì <em>nhóm</em> vượt giới hạn.</li>
<li>(b) không — shell đã khởi động nó nằm ngoài nhóm và in dòng của nó sau đó. (Demo này phải chạy với <code>--privileged</code> vì nó ghi dưới <code>/sys/fs/cgroup</code>.)</li>
<li>(c) Windows: <code>SetInformationJobObject</code> với <code>JobObjectExtendedLimitInformation</code> (<code>JOB_OBJECT_LIMIT_JOB_MEMORY</code>); Docker: <code>docker run --memory=16m</code> (Docker ghi đúng tệp cgroup này). Với container chạm giới hạn, <code>docker inspect</code> cho thấy <code>OOMKilled: true</code> và mã thoát 137 — cùng hai con số.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — find and fix CRLF in a folder (15 min)</h3>
<p>A teammate on Windows commits a project; on the Linux server <code>./run.sh</code> says "required file not found" and <code>.env</code> values end with an invisible character. Create a small folder with two CRLF files and one clean file; (a) list the CRLF files, (b) convert them in place, (c) prove with <code>od -c</code> that the <code>\\r</code> is gone, (d) say what you would add to the repository so it never happens again.</p>
<details><summary>Solution — run for real</summary>
<div class="out"># Practice 6: find and fix Windows line endings in a folder (what dos2unix / .gitattributes would do)<br>
$ mkdir -p /tmp/repo/src &amp;&amp; cd /tmp/repo<br>
$ printf 'a=1\\r\\nb=2\\r\\n' &gt; .env<br>
$ printf 'echo hi\\r\\n' &gt; src/run.sh<br>
$ printf 'plain\\n' &gt; src/ok.txt<br>
$ echo "CRLF files: $(grep -rlI $'\\r' . | wc -l)"<br>
CRLF files: 2<br>
$ grep -rlI $'\\r' . | sort<br>
./.env<br>
./src/run.sh<br>
$ grep -rlI $'\\r' . | xargs sed -i 's/\\r$//'<br>
$ echo "CRLF files after fix: $(grep -rlI $'\\r' . | wc -l)"<br>
CRLF files after fix: 0<br>
$ od -c .env | head -2<br>
0000000 &nbsp;&nbsp;a &nbsp;&nbsp;= &nbsp;&nbsp;1 &nbsp;\\n &nbsp;&nbsp;b &nbsp;&nbsp;= &nbsp;&nbsp;2 &nbsp;\\n<br>
0000010</div>
<ul>
<li>(a) <code>grep -rlI $'\\r' .</code> lists every <em>text</em> file (<code>-I</code> skips binaries) that contains a carriage return: <code>./.env</code> and <code>./src/run.sh</code> — 2 files.</li>
<li>(b) <code>xargs sed -i 's/\\r$//'</code> strips the trailing CR of each line (the job of <code>dos2unix</code>); the second count is 0.</li>
<li>(c) <code>od -c .env</code> now shows <code>a = 1 \\n b = 2 \\n</code> — only <code>\\n</code>.</li>
<li>(d) a <code>.gitattributes</code> with <code>* text=auto eol=lf</code> (or <code>*.sh text eol=lf</code>) so Git normalises line endings on checkout, an <code>.editorconfig</code> with <code>end_of_line = lf</code>, and a CI step that fails if <code>grep -rlI $'\\r'</code> finds anything. Also commit the execute bit (<code>git update-index --chmod=+x run.sh</code>).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — tìm và sửa CRLF trong một thư mục (15 phút)</h3>
<p>Một đồng đội trên Windows commit dự án; trên server Linux <code>./run.sh</code> báo "required file not found" và giá trị trong <code>.env</code> kết thúc bằng một ký tự vô hình. Tạo một thư mục nhỏ có hai tệp CRLF và một tệp sạch; (a) liệt kê các tệp CRLF, (b) chuyển chúng tại chỗ, (c) chứng minh bằng <code>od -c</code> rằng <code>\\r</code> đã mất, (d) nói bạn sẽ thêm gì vào kho để không bao giờ lặp lại.</p>
<details><summary>Lời giải — chạy thật</summary>
<div class="out"># Bài 6: tìm và sửa ký tự xuống dòng Windows trong một thư mục (việc dos2unix / .gitattributes làm)<br>
$ mkdir -p /tmp/repo/src &amp;&amp; cd /tmp/repo<br>
$ printf 'a=1\\r\\nb=2\\r\\n' &gt; .env<br>
$ printf 'echo hi\\r\\n' &gt; src/run.sh<br>
$ printf 'plain\\n' &gt; src/ok.txt<br>
$ echo "CRLF files: $(grep -rlI $'\\r' . | wc -l)"<br>
CRLF files: 2<br>
$ grep -rlI $'\\r' . | sort<br>
./.env<br>
./src/run.sh<br>
$ grep -rlI $'\\r' . | xargs sed -i 's/\\r$//'<br>
$ echo "CRLF files after fix: $(grep -rlI $'\\r' . | wc -l)"<br>
CRLF files after fix: 0<br>
$ od -c .env | head -2<br>
0000000 &nbsp;&nbsp;a &nbsp;&nbsp;= &nbsp;&nbsp;1 &nbsp;\\n &nbsp;&nbsp;b &nbsp;&nbsp;= &nbsp;&nbsp;2 &nbsp;\\n<br>
0000010</div>
<ul>
<li>(a) <code>grep -rlI $'\\r' .</code> liệt kê mọi tệp <em>văn bản</em> (<code>-I</code> bỏ qua nhị phân) có ký tự carriage return: <code>./.env</code> và <code>./src/run.sh</code> — 2 tệp.</li>
<li>(b) <code>xargs sed -i 's/\\r$//'</code> bỏ CR cuối mỗi dòng (việc của <code>dos2unix</code>); số đếm thứ hai là 0.</li>
<li>(c) <code>od -c .env</code> giờ cho <code>a = 1 \\n b = 2 \\n</code> — chỉ có <code>\\n</code>.</li>
<li>(d) một <code>.gitattributes</code> với <code>* text=auto eol=lf</code> (hay <code>*.sh text eol=lf</code>) để Git chuẩn hoá ký tự xuống dòng khi checkout, một <code>.editorconfig</code> với <code>end_of_line = lf</code>, và một bước CI làm hỏng nếu <code>grep -rlI $'\\r'</code> tìm thấy gì. Đồng thời commit cả bit thực thi (<code>git update-index --chmod=+x run.sh</code>).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — check a question-bank answer by computing it (15 min)</h3>
<p>FE5#26, FE7#33 and FE8#32 ask: "In Windows 95, what is the maximum partition size if the FAT type is FAT-32 and the block size is 16 KB?" with the bank answer <strong>2 TB</strong>; FE3#26 and others ask the FAT-16 / 4 KB version with the bank answer <strong>256 MB</strong>. Compute both. Is the bank right?</p>
<details><summary>Solution — computed by a program</summary>
<pre><code class="language-javascript">// Practice 7: check a question-bank answer by computing it (FE5#26, FE7#33, FE8#32: Windows 95 FAT-32, 16 KB blocks)
const KB = 1024, TB = 2 ** 40;
const fat16 = 2 ** 16 * 4 * KB;                              // FAT-16, 4 KB clusters (FE3#26): 2^16 entries
console.log(&#96;FAT-16, 4 KB clusters : &#36;{fat16 / 2 ** 20} MB   (bank answer 256 MB: correct)&#96;);
const fat32 = 2 ** 28 * 16 * KB;                             // FAT-32 uses 28 bits of its 32-bit entry
console.log(&#96;FAT-32, 16 KB clusters: &#36;{fat32 / TB} TB    (28-bit cluster numbers)&#96;);
const bySectors = 2 ** 32 * 512;                             // 32-bit sector count in the partition table
console.log(&#96;32-bit sector count   : &#36;{bySectors / TB} TB    (the real limit of the MBR partition table: bank answer 2 TB)&#96;);
console.log(&#96;min of the two limits : &#36;{Math.min(fat32, bySectors) / TB} TB&#96;);</code></pre>
<div class="out">$ node fat-fe.js<br>
FAT-16, 4 KB clusters : 256 MB &nbsp;&nbsp;(bank answer 256 MB: correct)<br>
FAT-32, 16 KB clusters: 4 TB &nbsp;&nbsp;&nbsp;(28-bit cluster numbers)<br>
32-bit sector count &nbsp;&nbsp;: 2 TB &nbsp;&nbsp;&nbsp;(the real limit of the MBR partition table: bank answer 2 TB)<br>
min of the two limits : 2 TB</div>
<ul>
<li><strong>FAT-16 / 4 KB:</strong> 2¹⁶ clusters × 4 KB = <strong>256 MB</strong> — the bank is right (FE3#26, FE4#32, FE12#32, FE14#36, FE15#33).</li>
<li><strong>FAT-32 / 16 KB:</strong> a FAT-32 entry is 32 bits but only <strong>28</strong> are used for the cluster number, so 2²⁸ × 16 KB = <strong>4 TB</strong>. The bank's <strong>2 TB</strong> equals 2³² sectors × 512 bytes — the limit of a <em>32-bit sector count</em> in the MBR partition table, which would cap the partition at 2 TB whatever the cluster size. So 2 TB is defensible as the real-world answer and 4 TB as the pure-FAT answer: the question is <strong>ambiguous</strong>; in the exam give the bank's option (2 TB) and know why. (This belongs to Chapter 4, lesson 4.A–B; it is reported to the Chapter 4 owner.)</li>
<li>Method: always compute <em>entries × cluster size</em>, then check the other limits (sector count, file-size field) and take the smaller.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — kiểm một đáp án ngân hàng bằng cách tính (15 phút)</h3>
<p>FE5#26, FE7#33 và FE8#32 hỏi: "Trong Windows 95, cỡ phân vùng tối đa là bao nhiêu nếu kiểu FAT là FAT-32 và cỡ khối 16 KB?" với đáp án ngân hàng <strong>2 TB</strong>; FE3#26 và các đề khác hỏi bản FAT-16 / 4 KB với đáp án ngân hàng <strong>256 MB</strong>. Tính cả hai. Ngân hàng đúng không?</p>
<details><summary>Lời giải — chương trình tính</summary>
<pre><code class="language-javascript">// Bài 7: kiểm đáp án ngân hàng bằng cách tính (FE5#26, FE7#33, FE8#32)
const KB = 1024, TB = 2 ** 40;
const fat16 = 2 ** 16 * 4 * KB;                              // FAT-16, cluster 4 KB
console.log(&#96;FAT-16, 4 KB clusters : &#36;{fat16 / 2 ** 20} MB   (bank answer 256 MB: correct)&#96;);
const fat32 = 2 ** 28 * 16 * KB;                             // FAT-32 dùng 28 trong 32 bit của mục
console.log(&#96;FAT-32, 16 KB clusters: &#36;{fat32 / TB} TB    (28-bit cluster numbers)&#96;);
const bySectors = 2 ** 32 * 512;                             // số sector 32 bit trong bảng phân vùng
console.log(&#96;32-bit sector count   : &#36;{bySectors / TB} TB    (the real limit of the MBR partition table: bank answer 2 TB)&#96;);
console.log(&#96;min of the two limits : &#36;{Math.min(fat32, bySectors) / TB} TB&#96;);</code></pre>
<div class="out">$ node fat-fe.js<br>
FAT-16, 4 KB clusters : 256 MB &nbsp;&nbsp;(bank answer 256 MB: correct)<br>
FAT-32, 16 KB clusters: 4 TB &nbsp;&nbsp;&nbsp;(28-bit cluster numbers)<br>
32-bit sector count &nbsp;&nbsp;: 2 TB &nbsp;&nbsp;&nbsp;(the real limit of the MBR partition table: bank answer 2 TB)<br>
min of the two limits : 2 TB</div>
<ul>
<li><strong>FAT-16 / 4 KB:</strong> 2¹⁶ cluster × 4 KB = <strong>256 MB</strong> — ngân hàng đúng (FE3#26, FE4#32, FE12#32, FE14#36, FE15#33).</li>
<li><strong>FAT-32 / 16 KB:</strong> một mục FAT-32 là 32 bit nhưng chỉ <strong>28</strong> bit dùng cho số cluster, nên 2²⁸ × 16 KB = <strong>4 TB</strong>. <strong>2 TB</strong> của ngân hàng bằng 2³² sector × 512 byte — giới hạn của <em>số sector 32 bit</em> trong bảng phân vùng MBR, sẽ chặn phân vùng ở 2 TB bất kể cỡ cluster. Vậy 2 TB biện hộ được như đáp án thực tế và 4 TB như đáp án FAT thuần: câu hỏi <strong>mơ hồ</strong>; trong kỳ thi hãy chọn phương án của ngân hàng (2 TB) và biết vì sao. (Điều này thuộc Chương 4, bài 4.A–B; đã báo người giữ Chương 4.)</li>
<li>Phương pháp: luôn tính <em>số mục × cỡ cluster</em>, rồi kiểm các giới hạn khác (số sector, trường cỡ tệp) và lấy cái nhỏ hơn.</li>
</ul>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>Windows NT</strong></td><td>Windows NT</td><td>The 1993 design (David Cutler) behind every modern Windows: protected, preemptive, portable, secure.</td></tr>
<tr><td><strong>Win32 API</strong></td><td>Win32 API</td><td>The documented user-mode programming interface of Windows (CreateFile, CreateProcess…), stable for 30 years.</td></tr>
<tr><td><strong>ntdll.dll / native NT API</strong></td><td>ntdll.dll / API NT gốc</td><td>The user-mode library of Nt… stubs that execute the system-call trap; the only door into the kernel.</td></tr>
<tr><td><strong>executive</strong></td><td>executive</td><td>The upper kernel-mode layer: processes, memory, objects, I/O, cache, security, registry managers.</td></tr>
<tr><td><strong>HAL</strong></td><td>HAL (tầng trừu tượng phần cứng)</td><td>Hardware Abstraction Layer: hides motherboard differences (interrupts, timers, DMA) from kernel and drivers.</td></tr>
<tr><td><strong>registry / hive</strong></td><td>registry / hive</td><td>Database of keys and values holding Windows configuration, stored in hive files (SYSTEM, SOFTWARE, NTUSER.DAT…).</td></tr>
<tr><td><strong>object manager</strong></td><td>object manager</td><td>Executive component that creates, names, protects and counts references to all kernel objects.</td></tr>
<tr><td><strong>handle</strong></td><td>handle</td><td>An index into a process's handle table pointing to a kernel object, with access rights; up to about 16 million per process.</td></tr>
<tr><td><strong>object name space</strong></td><td>không gian tên đối tượng</td><td>The tree of named kernel objects (\\??, \\Device, \\Driver…); drive letters are symbolic links in it.</td></tr>
<tr><td><strong>IRP</strong></td><td>IRP (gói yêu cầu I/O)</td><td>I/O Request Packet: the kernel structure that travels down a stack of drivers and completes back up.</td></tr>
<tr><td><strong>job / process / thread / fiber</strong></td><td>job / tiến trình / luồng / fiber</td><td>Group with limits / resource container / unit the kernel schedules / unit your code schedules inside a thread.</td></tr>
<tr><td><strong>base priority</strong></td><td>độ ưu tiên gốc</td><td>Priority 0–31 from the process class and thread level (Normal + Normal = 8); 16–31 is real-time.</td></tr>
<tr><td><strong>priority inversion</strong></td><td>đảo ngược ưu tiên</td><td>A high-priority thread waits for a resource held by a low-priority thread that a medium one keeps from running.</td></tr>
<tr><td><strong>reserve / commit</strong></td><td>reserve / commit</td><td>Reserve address space first (VirtualAlloc MEM_RESERVE), back it with storage later (MEM_COMMIT).</td></tr>
<tr><td><strong>working set</strong></td><td>tập làm việc</td><td>The pages of a process currently in RAM; the working-set manager trims it when memory is tight.</td></tr>
<tr><td><strong>standby / modified / free / zeroed list</strong></td><td>danh sách standby / modified / free / zeroed</td><td>Physical page lists: clean-but-valid, dirty-must-write, empty, empty-and-zero-filled.</td></tr>
<tr><td><strong>hard / soft fault</strong></td><td>lỗi cứng / lỗi mềm</td><td>Page fault that needs a disk read / one fixed from memory (standby, modified or demand-zero page).</td></tr>
<tr><td><strong>IOCP</strong></td><td>IOCP (I/O completion port)</td><td>Windows queue where finished asynchronous I/O is delivered to a small pool of threads (completion model).</td></tr>
<tr><td><strong>NTFS / MFT</strong></td><td>NTFS / MFT</td><td>Windows file system built around the Master File Table: one 1-KB record of attributes per file.</td></tr>
<tr><td><strong>run</strong></td><td>run</td><td>A pair (first disk block, length) in an MFT record describing consecutive blocks of a file.</td></tr>
<tr><td><strong>alternate data stream</strong></td><td>luồng dữ liệu phụ</td><td>A named extra $DATA attribute of an NTFS file (file:stream); lost when copied to non-NTFS.</td></tr>
<tr><td><strong>ReFS / Dev Drive</strong></td><td>ReFS / Dev Drive</td><td>Resilient File System (checksums, block clone, 35 PB) / a ReFS volume tuned for developer workloads on Windows 11.</td></tr>
<tr><td><strong>SID / access token</strong></td><td>SID / access token</td><td>Unique security identifier of a user or group / the kernel object listing a process's user, groups, privileges and integrity level.</td></tr>
<tr><td><strong>DACL / ACE / SACL</strong></td><td>DACL / ACE / SACL</td><td>Ordered list of allow/deny entries / one entry / the list that says what to audit (and holds the integrity label).</td></tr>
<tr><td><strong>integrity level</strong></td><td>mức toàn vẹn</td><td>Low, medium, high, system: a principal cannot write to a higher-integrity object (checked before the DACL).</td></tr>
<tr><td><strong>ASLR / NX / CFG</strong></td><td>ASLR / NX / CFG</td><td>Random load addresses / no code from data pages / checks of indirect-call targets: exploit mitigations.</td></tr>
<tr><td><strong>VBS / HVCI</strong></td><td>VBS / HVCI</td><td>Virtualization-based security / memory integrity: the hypervisor isolates a secure world that checks kernel code.</td></tr>
<tr><td><strong>WSL 2</strong></td><td>WSL 2</td><td>A real Linux kernel in a lightweight utility VM on Hyper-V, giving full system-call compatibility.</td></tr>
<tr><td><strong>CRLF</strong></td><td>CRLF</td><td>The two-character Windows line ending \\r\\n (Linux uses \\n); the usual cause of "required file not found" on scripts.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>Windows NT</strong></td><td>Windows NT</td><td>Thiết kế năm 1993 (David Cutler) nằm dưới mọi Windows hiện đại: có bảo vệ, chiếm quyền, dễ chuyển nền, an toàn.</td></tr>
<tr><td><strong>Win32 API</strong></td><td>Win32 API</td><td>Giao diện lập trình chế độ người dùng có tài liệu của Windows (CreateFile, CreateProcess…), ổn định suốt 30 năm.</td></tr>
<tr><td><strong>ntdll.dll / native NT API</strong></td><td>ntdll.dll / API NT gốc</td><td>Thư viện chế độ người dùng gồm các mẩu Nt… thực hiện lệnh bẫy lời gọi hệ thống; cửa duy nhất vào nhân.</td></tr>
<tr><td><strong>executive</strong></td><td>executive</td><td>Tầng chế độ nhân phía trên: các bộ quản lý tiến trình, bộ nhớ, đối tượng, I/O, bộ đệm, bảo mật, registry.</td></tr>
<tr><td><strong>HAL</strong></td><td>HAL (tầng trừu tượng phần cứng)</td><td>Hardware Abstraction Layer: che khác biệt bo mạch chủ (ngắt, bộ đếm giờ, DMA) khỏi nhân và driver.</td></tr>
<tr><td><strong>registry / hive</strong></td><td>registry / hive</td><td>Cơ sở dữ liệu khoá và giá trị chứa cấu hình Windows, lưu trong tệp hive (SYSTEM, SOFTWARE, NTUSER.DAT…).</td></tr>
<tr><td><strong>object manager</strong></td><td>object manager</td><td>Thành phần executive tạo, đặt tên, bảo vệ và đếm tham chiếu mọi đối tượng nhân.</td></tr>
<tr><td><strong>handle</strong></td><td>handle</td><td>Chỉ mục vào bảng handle của tiến trình trỏ tới một đối tượng nhân, kèm quyền truy cập; tối đa khoảng 16 triệu mỗi tiến trình.</td></tr>
<tr><td><strong>object name space</strong></td><td>không gian tên đối tượng</td><td>Cây các đối tượng nhân có tên (\\??, \\Device, \\Driver…); ký tự ổ đĩa là liên kết tượng trưng trong đó.</td></tr>
<tr><td><strong>IRP</strong></td><td>IRP (gói yêu cầu I/O)</td><td>I/O Request Packet: cấu trúc nhân đi xuống một chồng driver và hoàn thành ngược lên.</td></tr>
<tr><td><strong>job / process / thread / fiber</strong></td><td>job / tiến trình / luồng / fiber</td><td>Nhóm có giới hạn / thùng tài nguyên / đơn vị nhân lập lịch / đơn vị mã của bạn lập lịch bên trong một luồng.</td></tr>
<tr><td><strong>base priority</strong></td><td>độ ưu tiên gốc</td><td>Ưu tiên 0–31 từ lớp tiến trình và mức luồng (Normal + Normal = 8); 16–31 là thời gian thực.</td></tr>
<tr><td><strong>priority inversion</strong></td><td>đảo ngược ưu tiên</td><td>Luồng ưu tiên cao chờ tài nguyên do luồng ưu tiên thấp giữ mà luồng trung bình giữ không cho chạy.</td></tr>
<tr><td><strong>reserve / commit</strong></td><td>reserve / commit</td><td>Giữ chỗ không gian địa chỉ trước (MEM_RESERVE), đỡ bằng bộ lưu trữ sau (MEM_COMMIT).</td></tr>
<tr><td><strong>working set</strong></td><td>tập làm việc</td><td>Các trang của một tiến trình hiện ở trong RAM; bộ quản lý tập làm việc tỉa nó khi bộ nhớ chật.</td></tr>
<tr><td><strong>standby / modified / free / zeroed list</strong></td><td>danh sách standby / modified / free / zeroed</td><td>Các danh sách trang vật lý: sạch-còn hợp lệ, dơ-phải ghi, trống, trống-và-đã-xoá-số-0.</td></tr>
<tr><td><strong>hard / soft fault</strong></td><td>lỗi cứng / lỗi mềm</td><td>Lỗi trang cần đọc đĩa / lỗi sửa được từ bộ nhớ (trang standby, modified hay điền-số-0).</td></tr>
<tr><td><strong>IOCP</strong></td><td>IOCP (I/O completion port)</td><td>Hàng đợi Windows nơi I/O bất đồng bộ đã xong được chuyển cho một nhóm luồng nhỏ (mô hình hoàn thành).</td></tr>
<tr><td><strong>NTFS / MFT</strong></td><td>NTFS / MFT</td><td>Hệ thống tệp Windows xây quanh Master File Table: một bản ghi thuộc tính 1 KB cho mỗi tệp.</td></tr>
<tr><td><strong>run</strong></td><td>run</td><td>Một cặp (khối đĩa đầu, độ dài) trong bản ghi MFT mô tả các khối liên tiếp của một tệp.</td></tr>
<tr><td><strong>alternate data stream</strong></td><td>luồng dữ liệu phụ</td><td>Thuộc tính $DATA phụ có tên của tệp NTFS (file:stream); mất khi chép sang hệ không phải NTFS.</td></tr>
<tr><td><strong>ReFS / Dev Drive</strong></td><td>ReFS / Dev Drive</td><td>Resilient File System (checksum, block clone, 35 PB) / volume ReFS tối ưu cho tải của lập trình viên trên Windows 11.</td></tr>
<tr><td><strong>SID / access token</strong></td><td>SID / access token</td><td>Định danh bảo mật duy nhất của người dùng hay nhóm / đối tượng nhân liệt kê người dùng, nhóm, đặc quyền và mức toàn vẹn của tiến trình.</td></tr>
<tr><td><strong>DACL / ACE / SACL</strong></td><td>DACL / ACE / SACL</td><td>Danh sách có thứ tự các mục allow/deny / một mục / danh sách nói cái gì cần kiểm toán (và chứa nhãn toàn vẹn).</td></tr>
<tr><td><strong>integrity level</strong></td><td>mức toàn vẹn</td><td>Low, medium, high, system: chủ thể không ghi được vào đối tượng toàn vẹn cao hơn (kiểm trước DACL).</td></tr>
<tr><td><strong>ASLR / NX / CFG</strong></td><td>ASLR / NX / CFG</td><td>Địa chỉ nạp ngẫu nhiên / không chạy mã từ trang dữ liệu / kiểm đích gọi gián tiếp: các biện pháp giảm thiểu khai thác.</td></tr>
<tr><td><strong>VBS / HVCI</strong></td><td>VBS / HVCI</td><td>Bảo mật dựa trên ảo hoá / memory integrity: hypervisor cô lập một thế giới an toàn kiểm mã nhân.</td></tr>
<tr><td><strong>WSL 2</strong></td><td>WSL 2</td><td>Nhân Linux thật trong máy ảo tiện ích nhẹ trên Hyper-V, cho tương thích đầy đủ lời gọi hệ thống.</td></tr>
<tr><td><strong>CRLF</strong></td><td>CRLF</td><td>Ký tự xuống dòng hai ký tự \\r\\n của Windows (Linux dùng \\n); nguyên nhân thường gặp của "required file not found" ở script.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember about Windows</h2>
<ol>
<li>Windows is the <strong>NT design</strong> (Cutler, 1993) behind the <strong>Win32 API</strong>: user mode (apps → subsystem DLLs → <code>ntdll</code>) and kernel mode (executive, kernel layer, drivers, HAL) in <em>one</em> address space. Windows 8.1 ended support on 10 Jan 2023, Windows 10 on 14 Oct 2025; Windows 11 is current.</li>
<li><strong>Everything is an object</strong> reached through a <strong>handle</strong> (an index into a per-process table, up to 2²⁴ = 16 M entries) or a <strong>name</strong> in the object name space; <code>C:</code> is a symbolic link to <code>\\Device\\HarddiskVolumeN</code>. CreateFile takes ten steps: lookup → Parse → IRP down the device stack → file object → handle.</li>
<li><strong>Job → process → thread → fiber</strong>: the kernel schedules threads only; a job limits a group (cgroup); fibers are switched by your code; user-mode scheduling is not supported on Windows 11; thread pools and IOCP are the modern tools.</li>
<li><strong>32 priorities</strong>: base = class + level (Normal + Normal = 8, 16–31 real-time); highest ready runs, round-robin within a level; priority inversion is cured by boosting starved threads (book: 4 s → 15) or priority inheritance.</li>
<li><strong>Virtual memory</strong>: reserve then commit; five page-fault kinds (hard/soft); working sets trimmed into standby/modified lists, then free → zeroed; user space 2 GB on 32-bit, 128 TB on x64 since 8.1.</li>
<li><strong>I/O</strong>: IRPs go down driver stacks (filter → function → bus) and complete up; IOCP (completion) versus epoll (readiness); the cache manager does lazy write-back.</li>
<li><strong>NTFS</strong>: the MFT of attribute records; data = runs (start, length); directories are B+ trees; alternate data streams; compression in 16-block units; ReFS and Dev Drive are the modern additions.</li>
<li><strong>Security</strong>: token (SIDs, privileges, integrity) × security descriptor (owner, DACL, SACL); ACEs are read <em>in order</em> (Deny first), no match = denied, no DACL = full access; mitigations (canary, NX, ASLR, CFG) and VBS/HVCI on the hypervisor. When deploying from Windows to Linux watch CRLF, case, reserved names, execute bits and long paths.</li>
</ol>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ về Windows</h2>
<ol>
<li>Windows là <strong>thiết kế NT</strong> (Cutler, 1993) đứng sau <strong>Win32 API</strong>: chế độ người dùng (ứng dụng → DLL hệ thống con → <code>ntdll</code>) và chế độ nhân (executive, tầng kernel, driver, HAL) trong <em>một</em> không gian địa chỉ. Windows 8.1 hết hỗ trợ ngày 10/1/2023, Windows 10 ngày 14/10/2025; Windows 11 là bản hiện hành.</li>
<li><strong>Mọi thứ là đối tượng</strong> tới được qua <strong>handle</strong> (chỉ mục vào bảng riêng từng tiến trình, tối đa 2²⁴ = 16 M mục) hoặc một <strong>cái tên</strong> trong không gian tên đối tượng; <code>C:</code> là liên kết tượng trưng tới <code>\\Device\\HarddiskVolumeN</code>. CreateFile có mười bước: tra tên → Parse → IRP xuống chồng thiết bị → file object → handle.</li>
<li><strong>Job → tiến trình → luồng → fiber</strong>: nhân chỉ lập lịch luồng; job giới hạn một nhóm (cgroup); fiber do mã của bạn chuyển; lập lịch chế độ người dùng không được hỗ trợ trên Windows 11; thread pool và IOCP là công cụ hiện đại.</li>
<li><strong>32 mức ưu tiên</strong>: gốc = lớp + mức (Normal + Normal = 8, 16–31 thời gian thực); luồng sẵn sàng cao nhất chạy, round-robin trong một mức; đảo ngược ưu tiên được chữa bằng boost luồng bị đói (sách: 4 s → 15) hay kế thừa ưu tiên.</li>
<li><strong>Bộ nhớ ảo</strong>: reserve rồi commit; năm loại lỗi trang (cứng/mềm); tập làm việc bị tỉa vào danh sách standby/modified, rồi free → zeroed; không gian người dùng 2 GB ở 32 bit, 128 TB ở x64 từ 8.1.</li>
<li><strong>I/O</strong>: IRP đi xuống chồng driver (bộ lọc → chức năng → bus) và hoàn thành đi lên; IOCP (hoàn thành) so với epoll (sẵn sàng); cache manager ghi trễ lazy write-back.</li>
<li><strong>NTFS</strong>: MFT các bản ghi thuộc tính; dữ liệu = run (đầu, dài); thư mục là cây B+; luồng dữ liệu phụ; nén theo đơn vị 16 khối; ReFS và Dev Drive là bổ sung hiện đại.</li>
<li><strong>Bảo mật</strong>: token (SID, đặc quyền, toàn vẹn) × security descriptor (chủ, DACL, SACL); ACE đọc <em>theo thứ tự</em> (Deny trước), không khớp = bị từ chối, không có DACL = toàn quyền; các biện pháp giảm thiểu (canary, NX, ASLR, CFG) và VBS/HVCI trên hypervisor. Khi triển khai từ Windows sang Linux hãy để ý CRLF, hoa/thường, tên dành riêng, bit thực thi và đường dẫn dài.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch11) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) OS Win32 uses the system call ____, while OS Unix uses the system call ____ to create a new process.|||(Dạng câu FE) HĐH Win32 dùng lời gọi hệ thống ____, còn HĐH Unix dùng lời gọi hệ thống ____ để tạo một tiến trình mới.',
      options: ['fork; CreateProcess|||fork; CreateProcess', 'copy; CreateProcess|||copy; CreateProcess', 'CreateProcess; fork|||CreateProcess; fork', 'CreateProcess; copy|||CreateProcess; copy'],
      correctIndex: 2,
      points: 1,
      explanation: "Win32's <code>CreateProcess</code> builds a brand-new process from a program file in ONE call with many parameters; UNIX's <code>fork</code> clones the caller and a later <code>exec</code> replaces the program (two steps, with a window in between to adjust the child). The bank answer is correct (FE19#17, FE26#47). Lesson 11.A, slide 9 and 11.B slide 33.|||<code>CreateProcess</code> của Win32 dựng một tiến trình hoàn toàn mới từ tệp chương trình trong MỘT lời gọi nhiều tham số; <code>fork</code> của UNIX nhân bản người gọi và <code>exec</code> sau đó thay chương trình (hai bước, có khoảng giữa để chỉnh tiến trình con). Đáp án ngân hàng đúng (FE19#17, FE26#47). Bài 11.A, slide 9 và 11.B slide 33." },
    { id: 'q2',
      question: 'A Windows handle table is drawn with 4096-byte pages, 8-byte entries in the bottom pages, 4-byte pointers in the middle pages and 32 pointers in the top level. How many handles can a process hold at most?|||Một bảng handle Windows được vẽ với trang 4096 byte, mục 8 byte ở các trang đáy, con trỏ 4 byte ở các trang giữa và 32 con trỏ ở tầng trên cùng. Một tiến trình giữ được tối đa bao nhiêu handle?',
      options: ['16,777,216|||16.777.216', '524,288|||524.288', '134,217,728|||134.217.728', '4,194,304|||4.194.304'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by a program: a bottom page holds 4096 / 8 = 512 entries, a middle page 4096 / 4 = 1,024 pointers, the top level 32 pointers: 512 × 1,024 × 32 = 16,777,216 = 2²⁴ (Figure 11-17). 524,288 is the two-level table (512 × 1,024); 134,217,728 wrongly uses 256 top-level pointers; 4,194,304 uses 8. Lesson 11.A, slide 19; practice 11.C, exercise 1.|||Do chương trình tính: trang đáy chứa 4096 / 8 = 512 mục, trang giữa 4096 / 4 = 1.024 con trỏ, tầng trên 32 con trỏ: 512 × 1.024 × 32 = 16.777.216 = 2²⁴ (Hình 11-17). 524.288 là bảng hai tầng (512 × 1.024); 134.217.728 dùng nhầm 256 con trỏ tầng trên; 4.194.304 dùng 8. Bài 11.A, slide 19; thực hành 11.C, bài 1.' },
    { id: 'q3',
      question: 'Which page fault is a NORMAL event that the program never notices (not an error)?|||Lỗi trang nào là sự kiện BÌNH THƯỜNG mà chương trình không hề biết (không phải lỗi)?',
      options: ['The page referenced is not committed|||Trang được tham chiếu chưa được commit', 'A write to a page whose protection is read-only|||Ghi vào một trang có quyền chỉ đọc', 'A jump to a page marked no-execute|||Nhảy tới một trang đánh dấu không thực thi', 'A write to a shared copy-on-write page|||Ghi vào một trang chia sẻ copy-on-write'],
      correctIndex: 3,
      points: 1,
      explanation: 'The book lists five fault categories: not committed (error), permission violation (error), copy-on-write (normal: the kernel makes a private copy and resumes), stack growth (normal) and committed-but-not-mapped (normal). Options a, b and c all end in an access violation exception (on Linux: SIGSEGV). Our program counted copy-on-write faults after <code>fork</code>. Lesson 11.B, slide 44.|||Sách liệt kê năm loại lỗi: chưa commit (lỗi), vi phạm quyền (lỗi), copy-on-write (bình thường: nhân tạo bản sao riêng rồi tiếp tục), stack lớn thêm (bình thường) và đã commit-chưa ánh xạ (bình thường). Các phương án a, b, c đều kết thúc bằng ngoại lệ vi phạm truy cập (trên Linux: SIGSEGV). Chương trình của ta đã đếm lỗi copy-on-write sau <code>fork</code>. Bài 11.B, slide 44.' },
    { id: 'q4',
      question: 'According to Microsoft Learn, what is the status of user-mode scheduling (UMS) on Windows 11?|||Theo Microsoft Learn, lập lịch chế độ người dùng (UMS) trên Windows 11 ở trạng thái nào?',
      options: ['Enabled by default for all 64-bit applications|||Bật mặc định cho mọi ứng dụng 64 bit', 'Not supported: all calls fail with ERROR_NOT_SUPPORTED|||Không được hỗ trợ: mọi lời gọi thất bại với ERROR_NOT_SUPPORTED', 'Available only on Windows Server editions|||Chỉ có trên các bản Windows Server', 'Replaced by fibers with the same API|||Được thay bằng fiber với cùng API'],
      correctIndex: 1,
      points: 1,
      explanation: "Microsoft's page opens with a warning: \"As of Windows 11, user-mode scheduling is not supported. All calls fail with the error ERROR_NOT_SUPPORTED.\" UMS existed for 64-bit applications from Windows 7 / Server 2008 R2 through Windows 10 21H2 / Server 2022 (not on Arm64 or 32-bit). The Chapter 11 slide describes a feature that has been removed; fibers still exist but are a different mechanism. Lesson 11.B, slides 29–30.|||Trang của Microsoft mở đầu bằng cảnh báo: \"Từ Windows 11, lập lịch chế độ người dùng không được hỗ trợ. Mọi lời gọi thất bại với lỗi ERROR_NOT_SUPPORTED.\" UMS có cho ứng dụng 64 bit từ Windows 7 / Server 2008 R2 đến Windows 10 21H2 / Server 2022 (không có trên Arm64 hay 32 bit). Slide Chương 11 mô tả một tính năng đã bị gỡ; fiber vẫn còn nhưng là cơ chế khác. Bài 11.B, slide 29–30." },
    { id: 'q5',
      question: "A process of the Above normal priority class creates a thread at the Lowest priority level. What is the thread's base priority (Figure 11-25)?|||Một tiến trình lớp ưu tiên Above normal tạo một luồng ở mức ưu tiên Lowest. Độ ưu tiên gốc của luồng (Hình 11-25) là bao nhiêu?",
      options: ['8|||8', '6|||6', '10|||10', '4|||4'],
      correctIndex: 0,
      points: 1,
      explanation: "Computed by the simulator: the Above normal class has base 10 and Lowest subtracts 2, so 8 (row Lowest, column Above normal; it matches Microsoft's Base Priority table). 6 is Normal + Lowest, 10 is Above normal + Normal, and 4 is Idle class + Normal. Remember: a bigger number is MORE urgent in Windows. Lesson 11.B, slide 37.|||Do bộ mô phỏng tính: lớp Above normal có gốc 10 và Lowest trừ 2, nên 8 (hàng Lowest, cột Above normal; khớp bảng Base Priority của Microsoft). 6 là Normal + Lowest, 10 là Above normal + Normal, và 4 là lớp Idle + Normal. Nhớ: ở Windows số lớn hơn là GẤP hơn. Bài 11.B, slide 37." },
    { id: 'q6',
      question: "A file's DACL is, in order: Deny Elvis (all rights); Allow Cathy (read, write); Allow Ida (all rights); Allow Everyone (read). Marilyn belongs only to Everyone and asks for WRITE access. What does AccessCheck decide?|||DACL của một tệp theo thứ tự: Deny Elvis (mọi quyền); Allow Cathy (đọc, ghi); Allow Ida (mọi quyền); Allow Everyone (đọc). Marilyn chỉ thuộc Everyone và xin quyền GHI. AccessCheck quyết định gì?",
      options: ['GRANTED|||GRANTED', 'Only read is granted|||Chỉ cấp quyền đọc', 'DENIED|||DENIED', 'An error: Marilyn has no ACE|||Lỗi: Marilyn không có ACE'],
      correctIndex: 2,
      points: 1,
      explanation: "Computed by the simulator: ACEs 1–3 do not apply to Marilyn's token (SIDs Marilyn and Everyone); ACE 4 grants only read; after the last ACE write has not been explicitly allowed, so access is implicitly denied. AccessCheck is all-or-nothing for the requested rights (b is wrong); a missing ACE is not an error — only a missing DACL would grant everything. Lesson 11.B, slide 61.|||Do bộ mô phỏng tính: ACE 1–3 không áp dụng cho token của Marilyn (SID Marilyn và Everyone); ACE 4 chỉ cho đọc; sau ACE cuối quyền ghi chưa được cho phép rõ ràng, nên truy cập bị từ chối ngầm. AccessCheck là tất-cả-hoặc-không với các quyền xin (b sai); thiếu ACE không phải lỗi — chỉ DACL vắng mới cho mọi thứ. Bài 11.B, slide 61." },
    { id: 'q7',
      question: "Thread T4 (priority 4) holds a semaphore for 4 units of work; T8 (priority 8, 20 units) arrives at time 2; T12 (priority 12, needs the semaphore for 2 units) arrives at time 3. With Windows's anti-starvation boost (a ready thread that waits 4 units is raised to 15 for two quanta), at what time does T12 finish?|||Luồng T4 (ưu tiên 4) giữ một semaphore trong 4 đơn vị việc; T8 (ưu tiên 8, 20 đơn vị) tới lúc 2; T12 (ưu tiên 12, cần semaphore trong 2 đơn vị) tới lúc 3. Với boost chống đói của Windows (luồng sẵn sàng đợi 4 đơn vị được nâng lên 15 trong hai quantum), T12 xong lúc nào?",
      options: ['26|||26', '10|||10', '22|||22', '6|||6'],
      correctIndex: 1,
      points: 1,
      explanation: 'Computed by the simulator: T4 has waited since time 2; at time 6 it is boosted to 15, preempts T8, releases the semaphore at 8, and T12 runs 8 → 10. Without the boost T12 would finish at 26 (option a), because T8 would keep T4 from running until it ends at 22. The boost cures starvation; priority inheritance would cure the inversion more directly. Lesson 11.B, slide 39.|||Do bộ mô phỏng tính: T4 đợi từ lúc 2; lúc 6 nó được nâng lên 15, chiếm quyền T8, nhả semaphore lúc 8, và T12 chạy 8 → 10. Không có boost thì T12 xong lúc 26 (phương án a), vì T8 giữ T4 không chạy cho tới khi nó xong lúc 22. Boost chữa việc bị đói; kế thừa ưu tiên chữa đảo ngược trực tiếp hơn. Bài 11.B, slide 39.' },
    { id: 'q8',
      question: 'An NTFS MFT record lists three runs for a file: (20, 4), (64, 2) and (80, 3), each written as (first disk block, number of blocks). How many blocks does the file occupy?|||Một bản ghi MFT của NTFS liệt kê ba run cho một tệp: (20, 4), (64, 2) và (80, 3), mỗi run viết là (khối đĩa đầu, số khối). Tệp chiếm bao nhiêu khối?',
      options: ['9|||9', '12|||12', '166|||166', '3|||3'],
      correctIndex: 0,
      points: 1,
      explanation: 'Computed by the simulator: the second number of each run is a LENGTH, so 4 + 2 + 3 = 9 blocks (disk blocks 20–23, 64–65 and 80–82; Figure 11-41). 166 adds the start addresses; 12 adds 4 + 2 + 3 + 3 by also counting the runs; 3 is only the number of runs. Lesson 11.B, slide 55.|||Do bộ mô phỏng tính: số thứ hai của mỗi run là ĐỘ DÀI, nên 4 + 2 + 3 = 9 khối (khối đĩa 20–23, 64–65 và 80–82; Hình 11-41). 166 cộng địa chỉ đầu; 12 đếm thừa; 3 chỉ là số run. Bài 11.B, slide 55.' },
    { id: 'q9',
      question: 'NTFS compresses a 48-block file in units of 16 blocks; unit 1 shrinks to 8 blocks, unit 2 does not shrink, unit 3 shrinks to 8 blocks. How many disk blocks does the compressed file use (Figure 11-44)?|||NTFS nén một tệp 48 khối theo đơn vị 16 khối; đơn vị 1 co còn 8 khối, đơn vị 2 không co, đơn vị 3 co còn 8 khối. Tệp nén dùng bao nhiêu khối đĩa (Hình 11-44)?',
      options: ['24|||24', '40|||40', '16|||16', '32|||32'],
      correctIndex: 3,
      points: 1,
      explanation: 'Computed by the simulator: 8 + 16 + 8 = 32 blocks on disk; the two "empty" runs (disk address 0, 8 blocks each) mean blocks that are not stored. A unit is kept compressed only if it saves at least one block, which is why the incompressible middle unit stays at 16. Lesson 11.B, slide 58.|||Do bộ mô phỏng tính: 8 + 16 + 8 = 32 khối trên đĩa; hai run "rỗng" (địa chỉ đĩa 0, mỗi cái 8 khối) nghĩa là các khối không được lưu. Một đơn vị chỉ được giữ nén nếu tiết kiệm ít nhất một khối, vì thế đơn vị giữa không nén được ở lại 16. Bài 11.B, slide 58.' },
    { id: 'q10',
      question: 'A process has a working set of 3 pages replaced FIFO and a standby list of 3 pages. For the reference string 1 2 3 4 1 2 5 1 2 3 4 5, how many HARD faults (disk reads) occur?|||Một tiến trình có tập làm việc 3 trang thay FIFO và danh sách standby 3 trang. Với chuỗi tham chiếu 1 2 3 4 1 2 5 1 2 3 4 5, có bao nhiêu lỗi CỨNG (đọc đĩa)?',
      options: ['9|||9', '4|||4', '5|||5', '12|||12'],
      correctIndex: 2,
      points: 1,
      explanation: 'Computed by the simulator: only the five first references to distinct pages (1, 2, 3, 4, 5) go to disk; the four later references to evicted pages find them on the standby list and cost only a SOFT fault. With no standby list the same string costs 9 hard faults (option a, the FIFO number of Chapter 3). Lesson 11.B, slides 46–48.|||Do bộ mô phỏng tính: chỉ năm lần tham chiếu đầu tới các trang khác nhau (1, 2, 3, 4, 5) đi tới đĩa; bốn lần tham chiếu sau tới trang bị đuổi thấy chúng trên danh sách standby và chỉ tốn lỗi MỀM. Không có danh sách standby thì cùng chuỗi tốn 9 lỗi cứng (phương án a, số FIFO của Chương 3). Bài 11.B, slide 46–48.' },
  ],
};

const QUIZ_LESSON = {
  title: 'Chapter 11 Quiz|||Quiz chương 11',
  slug: 'osg202-quiz-ch11',
  type: 'QUIZ',
  description: '10 câu ôn Chương 11 (Windows) theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán có đáp án kiểm bằng bộ mô phỏng hoặc chương trình chạy thật: lời gọi tạo tiến trình của Win32 và UNIX, sức chứa bảng handle, loại lỗi trang không phải lỗi, lập lịch chế độ người dùng trên Windows 11, độ ưu tiên gốc, AccessCheck với DACL, đảo ngược ưu tiên có boost, run NTFS, nén NTFS và số lỗi cứng khi có danh sách standby.',
  quiz: QUIZ,
};

export default {
  slides: [L_osg11_1, L_osg11_2],
  practice: L_on_ch11,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 11 (Windows) theo dạng câu FE OSG202, mỗi câu có giải thích song ngữ, câu tính toán có đáp án kiểm bằng bộ mô phỏng hoặc chương trình chạy thật: lời gọi tạo tiến trình của Win32 và UNIX, sức chứa bảng handle, loại lỗi trang không phải lỗi, lập lịch chế độ người dùng trên Windows 11, độ ưu tiên gốc, AccessCheck với DACL, đảo ngược ưu tiên có boost, run NTFS, nén NTFS và số lỗi cứng khi có danh sách standby.',
  quizLesson: QUIZ_LESSON,
  lessons: [L_osg11_1, L_osg11_2, L_on_ch11, QUIZ_LESSON],
};
