/**
 * PRO192 · Chương 9 — luồng & tệp (pro14).
 * Bài 📑 học theo từng slide: pro14 (tmp_14.pptx, slide 1–59).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch9.
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab-9-luu-tep.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch9).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, registerDeck, bi } from './_slides.mjs';

registerDeck('lab9', { code: 'PRO192 Lab 9', en: 'Lab 9 — CT Library: saving to a file', vi: 'Lab 9 — CT Library: lưu dữ liệu ra tệp', total: 17, w: 1280, h: 720 });

/* ───────── 9.A — 📑 Slide by slide · I/O Streams (1/3): streams, Unicode and UTF-8, java.io, the File class (slides 1–11) ───────── */
const L_pro14_1 = {
  title: '9.A — 📑 Slide by slide · I/O Streams (1/3): streams, Unicode and UTF-8, java.io, the File class (slides 1–11)|||9.A — 📑 Học theo từng slide · I/O Streams (1/3): luồng, Unicode và UTF-8, java.io, lớp File (slide 1–11)',
  slug: 'pro192-slide-pro14-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–11 bộ "I/O Streams" của trường: luồng là gì (chép file từng byte chạy thật như hình của slide), ký tự, ASCII, Unicode và UTF-8 đo bằng số byte thật (vì sao "Unicode 16 bit, 65536 ký tự" đã sai từ 1996, emoji cần hai char), giải mã sai bảng mã ra chữ vỡ, bốn loại luồng của gói java.io ghi cùng một dữ liệu ra bốn file khác nhau, lớp java.io.File chỉ đọc thông tin chứ không đọc nội dung, FileDemo của slide chạy thật trên JDK 8, bốn hàm tạo, các phương thức với đúng tên thật (mkdir/mkdirs, renameTo), getAbsolutePath với getCanonicalPath, duyệt thư mục bằng list() và cái bẫy null, duyệt đệ quy và java.nio.file trên JDK 8.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.A · school deck "I/O Streams", slides 1–11</span>
<h2>Data that survives the end of the program</h2>
<p class="lead">Everything your PRO192 programs have kept so far — arrays, <code>ArrayList</code>s, objects — lives in RAM and dies when <code>main</code> returns. Files are how data survives: LAB211 programs load their list at start and save it on "Quit", PE question 1 of several papers reads <code>input.txt</code> and writes <code>output.txt</code>, and every server you will build later reads configuration files. This lesson walks slides 1–11: what a <strong>stream</strong> is, how characters become bytes (<strong>Unicode</strong>, <strong>UTF-8</strong> — the reason Vietnamese text breaks), the four kinds of stream in <code>java.io</code>, and the class <code>java.io.File</code>. Lesson 9.B (slides 12–34) reads and writes text files; lesson 9.C (slides 35–59) binary files and objects.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>what a stream is; the chapter plan</td><td>describe input and output streams and copy a file byte by byte</td></tr>
<tr><td>6</td><td>text, UTF, Unicode</td><td>say how many bytes "ế" or an emoji takes, and why decoding with the wrong encoding gives "Viá»‡t"</td></tr>
<tr><td>7</td><td>the java.io package</td><td>name the four kinds of stream and their data unit</td></tr>
<tr><td>8–11</td><td>java.io.File</td><td>check, create, rename, delete and list files and folders without touching their content</td></tr>
</tbody>
</table>
<div class="callout"><strong>Every program in this chapter really runs.</strong> They run on a real JDK 8 (the exam JDK), inside a fresh empty folder — so the absolute paths you see start with <code>/w/</code>, a Linux folder. On your Windows lab PC the same program prints <code>C:\\…</code> paths; everything else is identical unless the lesson says otherwise.</div>`,
    `<span class="eyebrow">Chương 9 · Bài 9.A · bộ slide "I/O Streams" của trường, slide 1–11</span>
<h2>Dữ liệu sống sót sau khi chương trình kết thúc</h2>
<p class="lead">Mọi thứ chương trình PRO192 của bạn giữ tới giờ — mảng, <code>ArrayList</code>, đối tượng — nằm trong RAM và mất khi <code>main</code> kết thúc. File là cách để dữ liệu sống sót: chương trình LAB211 nạp danh sách lúc mở và lưu lại khi chọn "Quit", câu 1 của nhiều đề PE đọc <code>input.txt</code> và ghi <code>output.txt</code>, và mọi server bạn viết sau này đều đọc file cấu hình. Bài này giảng slide 1–11: <strong>luồng</strong> (stream) là gì, ký tự biến thành byte ra sao (<strong>Unicode</strong>, <strong>UTF-8</strong> — lý do chữ tiếng Việt bị vỡ), bốn loại luồng trong <code>java.io</code>, và lớp <code>java.io.File</code>. Bài 9.B (slide 12–34) đọc và ghi file văn bản; bài 9.C (slide 35–59) file nhị phân và file đối tượng.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–5</td><td>luồng là gì; kế hoạch của chương</td><td>mô tả luồng vào, luồng ra và chép một file từng byte</td></tr>
<tr><td>6</td><td>văn bản, UTF, Unicode</td><td>nói được "ế" hay một emoji tốn mấy byte, và vì sao giải mã sai bảng mã ra "Viá»‡t"</td></tr>
<tr><td>7</td><td>gói java.io</td><td>gọi tên bốn loại luồng và đơn vị dữ liệu của từng loại</td></tr>
<tr><td>8–11</td><td>java.io.File</td><td>kiểm tra, tạo, đổi tên, xoá và liệt kê file, thư mục mà không đụng tới nội dung</td></tr>
</tbody>
</table>
<div class="callout"><strong>Mọi chương trình trong chương này đều chạy thật.</strong> Chúng chạy trên JDK 8 thật (JDK của phòng thi), trong một thư mục trống mới tinh — nên đường dẫn tuyệt đối bạn thấy bắt đầu bằng <code>/w/</code>, một thư mục Linux. Trên máy Windows ở phòng lab, cùng chương trình đó in đường dẫn <code>C:\\…</code>; mọi thứ khác giống hệt, trừ khi bài nói khác.</div>`),
    walkHead('pro14', 1, 11),
    walk('pro14', [
      [1, 'I/O Streams',
        `<p class="y-chinh">🎯 Title slide: "I/O Streams" — I/O = <strong>Input/Output</strong>, how a program exchanges data with the world outside its own memory.</p>
<p>The keyboard (<code>Scanner(System.in)</code>) and the screen (<code>System.out</code>) are I/O you already use every day: <code>System.in</code> is an <code>InputStream</code> and <code>System.out</code> is a <code>PrintStream</code> — both are classes of this chapter. Files are the next step: the same idea, but the data stays on disk after the program ends.</p>
<p>This deck is long (59 slides) and full of code from the school's old Java course (JDK 1.6, Windows XP, JCreator, NetBeans 7). The API it uses still works unchanged on JDK 8, the exam JDK — but several slides contain mistakes; each one is pointed out where it appears and measured with a real run.</p>
<p class="meo">🧠 The whole chapter in one sentence: <em>pick the stream by the unit of data you want to move — bytes, characters, typed values or whole objects — and always close what you open.</em></p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: "I/O Streams" — I/O = <strong>Input/Output</strong> (vào/ra), cách chương trình trao đổi dữ liệu với thế giới bên ngoài bộ nhớ của nó.</p>
<p>Bàn phím (<code>Scanner(System.in)</code>) và màn hình (<code>System.out</code>) là I/O bạn dùng hằng ngày: <code>System.in</code> là một <code>InputStream</code> và <code>System.out</code> là một <code>PrintStream</code> — cả hai đều là lớp của chương này. File là bước tiếp theo: cùng ý tưởng, nhưng dữ liệu nằm lại trên đĩa sau khi chương trình kết thúc.</p>
<p>Bộ slide này dài (59 slide) và đầy code của khoá Java cũ của trường (JDK 1.6, Windows XP, JCreator, NetBeans 7). API trong đó vẫn chạy y nguyên trên JDK 8 của phòng thi — nhưng vài slide có lỗi; mỗi lỗi được chỉ ra ngay chỗ nó xuất hiện và đo bằng một lần chạy thật.</p>
<p class="meo">🧠 Cả chương trong một câu: <em>chọn luồng theo đơn vị dữ liệu bạn muốn chuyển — byte, ký tự, giá trị có kiểu hay cả đối tượng — và luôn đóng thứ mình đã mở.</em></p>`],
      [2, 'What are streams?',
        `<p class="y-chinh">🎯 A <strong>stream</strong> is an object that manages a data source: you read data from it into variables, or write variables to it, and type conversions happen automatically. Data is treated as a <strong>chain of units</strong> (byte, character or object) processed one unit after another. An <strong>input stream</strong> brings data from a source into the program; an <strong>output stream</strong> carries data from the program to a destination.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4f1cc83f883a25b043c93ba04f549d940da3b9f.svg" alt="Slide 2 redrawn: input stream on the left, output stream on the right; the &quot;unit&quot; depends on the class" loading="lazy" /><p class="chu-thich">🧩 Slide 2 redrawn: input stream on the left, output stream on the right; the "unit" depends on the class</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 2 — a stream moves data one unit at a time between a source/destination and your program
left to right direction
' Top row = input stream, bottom row = output stream
rectangle "Data source\\n(file, keyboard,\\nnetwork, memory)" as Src #FEF3C7
rectangle "InputStream / Reader\\nread() → one unit\\n-1 or null at the end" as In #EEF2FF
rectangle "Your program\\nint b = in.read();\\nout.write(b);" as P #ECFDF5
rectangle "OutputStream / Writer\\nwrite(unit)" as Out #EEF2FF
rectangle "Data destination\\n(file, screen,\\nnetwork, memory)" as Dst #FEF3C7
Src --&gt; In : bytes / chars
In --&gt; P : unit by unit
P --&gt; Out : unit by unit
Out --&gt; Dst : bytes / chars
note bottom of P
  unit = 1 byte (FileInputStream)
       = 1 char (FileReader)
       = an int, a String (DataInputStream)
       = a whole object (ObjectInputStream)
end note
@enduml</code></pre></details>
<p>The circle on the right of the slide (taken from Oracle's tutorial) is a byte-copy loop: <code>read(b)</code> takes one unit "d" from "In Xanadu did", puts it in an integer variable, and <code>write(b)</code> sends it out. Here is that loop, running for real on the tutorial's own file:</p>
<pre class="trich"><code class="language-java">int count = 0;
try (FileInputStream in = new FileInputStream("xanadu.txt");           // INPUT stream: data source -&gt; program
     FileOutputStream out = new FileOutputStream("outagain.txt")) {   // OUTPUT stream: program -&gt; destination
    int b;                                                             // the "Integer Variable" box of the slide
    while ((b = in.read()) != -1) {                                    // read(): ONE byte as an int 0..255, or -1 at the end
        if (count &lt; 9) System.out.print(b + "='" + (char) b + "' ");
        out.write(b);                                                  // write(b): ONE byte goes out
        count++;
    }
}                                                                      // both streams closed here, even after an exception
System.out.println("...");
System.out.println("copied " + count + " bytes, one read() and one write() each");
System.out.println("xanadu.txt " + new File("xanadu.txt").length() + " bytes, outagain.txt " + new File("outagain.txt").length() + " bytes");</code></pre>
<div class="out">73='I' 110='n' 32=' ' 88='X' 97='a' 110='n' 97='a' 100='d' 117='u' ...<br>
copied 57 bytes, one read() and one write() each<br>
xanadu.txt 57 bytes, outagain.txt 57 bytes</div>
<p>Notice the three habits you will repeat all chapter: <code>read()</code> returns an <code>int</code> (0..255 for a byte) so that it can return <strong>-1</strong> at the end; the loop tests that -1; and the streams are opened in a <code>try ( … )</code> so they are closed automatically. Byte 73 is the letter 'I', 110 is 'n', 32 is a space — a file is just numbers until someone decides how to read them.</p>
<div class="pitfall">FE: "What does <code>FileInputStream.read()</code> return at the end of the file?" → <strong>-1</strong> (not 0, not null, no exception). <code>readLine()</code> of a <code>BufferedReader</code> returns <strong>null</strong>; <code>readInt()</code> of a <code>DataInputStream</code> throws <strong>EOFException</strong>. Three classes, three ways to say "the end" — lesson 9.C measures the last one.</div>`,
        `<p class="y-chinh">🎯 <strong>Luồng</strong> (stream) là một đối tượng quản lý một nguồn dữ liệu: bạn đọc dữ liệu từ nó vào biến, hoặc ghi giá trị của biến vào nó, và việc chuyển kiểu được làm tự động. Dữ liệu được coi như một <strong>chuỗi đơn vị</strong> (byte, ký tự hay đối tượng) xử lý lần lượt từng đơn vị. <strong>Luồng vào</strong> (input stream) đưa dữ liệu từ nguồn vào chương trình; <strong>luồng ra</strong> (output stream) mang dữ liệu từ chương trình tới đích.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/e4f1cc83f883a25b043c93ba04f549d940da3b9f.svg" alt="Slide 2 vẽ lại: luồng vào bên trái, luồng ra bên phải; &quot;đơn vị&quot; tuỳ theo lớp" loading="lazy" /><p class="chu-thich">🧩 Slide 2 vẽ lại: luồng vào bên trái, luồng ra bên phải; "đơn vị" tuỳ theo lớp</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 2 — a stream moves data one unit at a time between a source/destination and your program
left to right direction
' Hàng trên = luồng vào, hàng dưới = luồng ra
rectangle "Data source\\n(file, keyboard,\\nnetwork, memory)" as Src #FEF3C7
rectangle "InputStream / Reader\\nread() → one unit\\n-1 or null at the end" as In #EEF2FF
rectangle "Your program\\nint b = in.read();\\nout.write(b);" as P #ECFDF5
rectangle "OutputStream / Writer\\nwrite(unit)" as Out #EEF2FF
rectangle "Data destination\\n(file, screen,\\nnetwork, memory)" as Dst #FEF3C7
Src --&gt; In : bytes / chars
In --&gt; P : unit by unit
P --&gt; Out : unit by unit
Out --&gt; Dst : bytes / chars
note bottom of P
  unit = 1 byte (FileInputStream)
       = 1 char (FileReader)
       = an int, a String (DataInputStream)
       = a whole object (ObjectInputStream)
end note
@enduml</code></pre></details>
<p>Vòng tròn bên phải slide (lấy từ bộ hướng dẫn của Oracle) là một vòng chép byte: <code>read(b)</code> lấy một đơn vị "d" từ "In Xanadu did", đặt vào một biến số nguyên, và <code>write(b)</code> gửi nó ra. Đây là vòng lặp đó, chạy thật trên chính file của bộ hướng dẫn:</p>
<pre class="trich"><code class="language-java">int count = 0;
try (FileInputStream in = new FileInputStream("xanadu.txt");           // luồng VÀO: nguồn -&gt; chương trình
     FileOutputStream out = new FileOutputStream("outagain.txt")) {   // luồng RA: chương trình -&gt; đích
    int b;                                                             // ô "Integer Variable" của slide
    while ((b = in.read()) != -1) {                                    // read(): MỘT byte dạng int 0..255, hoặc -1 khi hết
        if (count &lt; 9) System.out.print(b + "='" + (char) b + "' ");
        out.write(b);                                                  // write(b): MỘT byte đi ra
        count++;
    }
}                                                                      // cả hai luồng được đóng ở đây, kể cả khi có ngoại lệ
System.out.println("...");
System.out.println("copied " + count + " bytes, one read() and one write() each");
System.out.println("xanadu.txt " + new File("xanadu.txt").length() + " bytes, outagain.txt " + new File("outagain.txt").length() + " bytes");</code></pre>
<div class="out">73='I' 110='n' 32=' ' 88='X' 97='a' 110='n' 97='a' 100='d' 117='u' ...<br>
copied 57 bytes, one read() and one write() each<br>
xanadu.txt 57 bytes, outagain.txt 57 bytes</div>
<p>Để ý ba thói quen bạn sẽ lặp lại suốt chương: <code>read()</code> trả về <code>int</code> (0..255 cho một byte) để còn trả được <strong>-1</strong> khi hết; vòng lặp kiểm tra số -1 đó; và các luồng được mở trong <code>try ( … )</code> nên tự đóng. Byte 73 là chữ 'I', 110 là 'n', 32 là dấu cách — file chỉ là các con số cho tới khi có người quyết định đọc chúng thế nào.</p>
<div class="pitfall">FE: "<code>FileInputStream.read()</code> trả về gì khi hết file?" → <strong>-1</strong> (không phải 0, không phải null, không ném ngoại lệ). <code>readLine()</code> của <code>BufferedReader</code> trả <strong>null</strong>; <code>readInt()</code> của <code>DataInputStream</code> ném <strong>EOFException</strong>. Ba lớp, ba cách nói "hết rồi" — bài 9.C đo cái cuối.</div>`],
      [3, 'Why should you study this chapter?',
        `<p class="y-chinh">🎯 Files cannot be missing in large applications. Do you want to access a file in Java? How can we read/write data from/to a file?</p>
<p>Where you will meet files soon, concretely:</p>
<ul>
<li><strong>PE PRO192</strong> — question 1 of PE3, PE5 and PE9 gives a skeleton <code>Q1.java</code> with <code>read()</code> using <code>new Scanner(new File(fi))</code> and <code>printResult()</code> using <code>new FileWriter(fo)</code>; you fill in the middle. Exercise 1 of lesson 9.2 solves one.</li>
<li><strong>LAB211</strong> — almost every assignment says "load data from file when the program starts, save to file on exit"; the case studies of lesson 9.B are exactly that shape.</li>
<li><strong>PRJ301 / Spring Boot</strong> — reading uploaded files, writing logs, configuration in <code>application.properties</code>; the database replaces data files, but the stream classes stay.</li>
</ul>
<p class="meo">🧠 File code is short but unforgiving: a forgotten <code>close()</code> leaves an empty file, a missing "UTF-8" breaks Vietnamese, a wrong format crashes <code>parseInt</code>. Each of these is measured in this chapter so you recognize it on sight.</p>`,
        `<p class="y-chinh">🎯 Ứng dụng lớn không thể thiếu file. Bạn có muốn truy cập file trong Java không? Làm sao đọc/ghi dữ liệu từ/vào một file?</p>
<p>Nơi bạn sẽ sớm gặp file, cụ thể:</p>
<ul>
<li><strong>PE PRO192</strong> — câu 1 của PE3, PE5 và PE9 cho sẵn khung <code>Q1.java</code> có <code>read()</code> dùng <code>new Scanner(new File(fi))</code> và <code>printResult()</code> dùng <code>new FileWriter(fo)</code>; bạn điền phần giữa. Bài 1 của bài 9.2 giải một đề như vậy.</li>
<li><strong>LAB211</strong> — gần như bài nào cũng ghi "nạp dữ liệu từ file khi chương trình mở, lưu ra file khi thoát"; các case study của bài 9.B đúng dạng đó.</li>
<li><strong>PRJ301 / Spring Boot</strong> — đọc file người dùng tải lên, ghi log, cấu hình trong <code>application.properties</code>; cơ sở dữ liệu thay cho file dữ liệu, nhưng các lớp luồng vẫn ở đó.</li>
</ul>
<p class="meo">🧠 Code file ngắn nhưng không tha lỗi: quên <code>close()</code> để lại file rỗng, thiếu "UTF-8" làm vỡ tiếng Việt, sai định dạng làm <code>parseInt</code> sập. Từng lỗi đó được đo trong chương này để bạn nhận ra ngay khi gặp.</p>`],
      [4, 'Objectives',
        `<p class="y-chinh">🎯 Objectives: distinguish text, UTF and Unicode; access directories and files; access text files; access binary files; read/write objects from/to files.</p>
<p>These five map onto the three lessons of this chapter:</p>
<table>
<thead><tr><th>Objective</th><th>Slides</th><th>Lesson</th><th>Main classes</th></tr></thead>
<tbody>
<tr><td>Text, UTF, Unicode</td><td>6</td><td>9.A</td><td><code>String.getBytes("UTF-8")</code>, <code>new String(bytes, "UTF-8")</code></td></tr>
<tr><td>directories and files</td><td>8–11</td><td>9.A</td><td><code>java.io.File</code> (➕ <code>java.nio.file.Files</code>, Java 7)</td></tr>
<tr><td>text files</td><td>12–34</td><td>9.B</td><td><code>FileReader</code>, <code>BufferedReader</code>, <code>FileWriter</code>, <code>PrintWriter</code>, <code>InputStreamReader</code></td></tr>
<tr><td>binary files</td><td>35–47</td><td>9.C</td><td><code>RandomAccessFile</code>, <code>FileInputStream</code>/<code>FileOutputStream</code>, <code>DataInputStream</code>/<code>DataOutputStream</code></td></tr>
<tr><td>objects</td><td>48–58</td><td>9.C</td><td><code>Serializable</code>, <code>ObjectOutputStream</code>, <code>ObjectInputStream</code></td></tr>
</tbody>
</table>
<p>The syllabus lists the same goals (CLO about "streams and files"): its constructive questions "How to input an object into a file?" and "How to get an object from a file?" are answered in 9.C with programs you can run.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu: phân biệt văn bản, UTF và Unicode; truy cập thư mục và file; truy cập file văn bản; truy cập file nhị phân; đọc/ghi đối tượng từ/vào file.</p>
<p>Năm mục tiêu này ứng với ba bài của chương:</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Bài</th><th>Lớp chính</th></tr></thead>
<tbody>
<tr><td>Văn bản, UTF, Unicode</td><td>6</td><td>9.A</td><td><code>String.getBytes("UTF-8")</code>, <code>new String(bytes, "UTF-8")</code></td></tr>
<tr><td>thư mục và file</td><td>8–11</td><td>9.A</td><td><code>java.io.File</code> (➕ <code>java.nio.file.Files</code>, Java 7)</td></tr>
<tr><td>file văn bản</td><td>12–34</td><td>9.B</td><td><code>FileReader</code>, <code>BufferedReader</code>, <code>FileWriter</code>, <code>PrintWriter</code>, <code>InputStreamReader</code></td></tr>
<tr><td>file nhị phân</td><td>35–47</td><td>9.C</td><td><code>RandomAccessFile</code>, <code>FileInputStream</code>/<code>FileOutputStream</code>, <code>DataInputStream</code>/<code>DataOutputStream</code></td></tr>
<tr><td>đối tượng</td><td>48–58</td><td>9.C</td><td><code>Serializable</code>, <code>ObjectOutputStream</code>, <code>ObjectInputStream</code></td></tr>
</tbody>
</table>
<p>Đề cương môn ghi đúng các mục tiêu này (CLO về "luồng và file"): hai câu hỏi xây dựng "Làm sao đưa một đối tượng vào file?" và "Làm sao lấy một đối tượng ra từ file?" được trả lời ở bài 9.C bằng chương trình chạy được.</p>`],
      [5, 'Contents',
        `<p class="y-chinh">🎯 Contents: Text, UTF and Unicode; introduction to the java.io package; accessing directories and files; accessing binary files; accessing text files; read/write objects from/to files.</p>
<p>The contents slide lists "binary files" before "text files", but the deck itself (and this course) teaches <strong>text files first</strong> (slides 12–34) and binary files after (35–47). Text first is the right order: you can open a text file in Notepad and check with your own eyes what your program wrote; a binary file needs a hex dump, which 9.C shows you.</p>
<p>One idea links the three parts: <strong>a file is a sequence of bytes</strong>. A text file is bytes that an <em>encoding</em> turns into characters; a binary file is bytes in a layout your program decides (4 bytes for an <code>int</code>…); an object file is bytes in Java's own serialization format. Slide 7 draws those layers.</p>`,
        `<p class="y-chinh">🎯 Nội dung: văn bản, UTF và Unicode; giới thiệu gói java.io; truy cập thư mục và file; truy cập file nhị phân; truy cập file văn bản; đọc/ghi đối tượng từ/vào file.</p>
<p>Slide mục lục ghi "file nhị phân" trước "file văn bản", nhưng chính bộ slide (và khoá này) dạy <strong>file văn bản trước</strong> (slide 12–34) rồi mới tới file nhị phân (35–47). Văn bản trước là đúng thứ tự: bạn mở được file văn bản bằng Notepad và tự kiểm bằng mắt thứ chương trình đã ghi; file nhị phân thì cần xem dạng hex, bài 9.C sẽ chỉ cho bạn.</p>
<p>Một ý nối ba phần lại: <strong>file là một dãy byte</strong>. File văn bản là các byte mà một <em>bảng mã</em> (encoding) biến thành ký tự; file nhị phân là các byte theo bố cục do chương trình của bạn quyết định (4 byte cho một <code>int</code>…); file đối tượng là các byte theo định dạng tuần tự hoá riêng của Java. Slide 7 vẽ các lớp đó.</p>`],
      [6, '1- Text, UTF, and Unicode',
        `<p class="y-chinh">🎯 A character can be stored as ASCII code (8 bits, 256 characters) or Unicode (16 bits, 65,536 characters, "not completely represented"). UTF = Unicode (or UCS) Transformation Format, a standard for compressing Unicode text; UTF-8 compresses Unicode to 8-bit code units. Java uses UTF to read/write Unicode and converts between Unicode and external 8-bit encodings.</p>
<p>Two numbers on this slide are out of date. <strong>ASCII</strong> is 7 bits — 128 characters (the "256" are 8-bit code pages such as <code>windows-1252</code>, different on every system). <strong>Unicode</strong> was 16 bits only in version 1.0 (1991); since Unicode 2.0 (1996) it has room for <strong>1,114,112</strong> code points (U+0000 to U+10FFFF). A Java <code>char</code> is still 16 bits, so a character beyond U+FFFF — an emoji — needs <strong>two</strong> <code>char</code>s. Measured:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    String[] samples = { "A", "á", "ă", "ế", "€", "😀" };   // the last one is OUTSIDE the 16-bit range
    String[] names = { "A", "a-acute", "a-breve", "e-circ-acute", "euro", "emoji" };
    System.out.printf("%-12s %-10s %-7s %-18s %-7s %s%n", "char", "code point", "length", "UTF-8 bytes", "UTF-16", "windows-1252");
    for (int i = 0; i &lt; samples.length; i++) {
        String s = samples[i];
        byte[] u8 = s.getBytes("UTF-8");
        byte[] cp = s.getBytes("windows-1252");           // a character it cannot hold becomes '?' (0x3F)
        System.out.printf("%-12s %-10s %-7d %-18s %-7d %s%n",
                names[i], String.format("U+%04X", s.codePointAt(0)), s.length(), u8.length + " = " + hex(u8),
                s.getBytes("UTF-16BE").length, hex(cp));
    }
    System.out.println("Character.MAX_VALUE (largest char) = " + (int) Character.MAX_VALUE
            + ", Character.MAX_CODE_POINT = " + Character.MAX_CODE_POINT + " (0x10FFFF)");</code></pre>
<div class="out">char &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code point length &nbsp;UTF-8 bytes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UTF-16 &nbsp;windows-1252<br>
A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+0041 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 = 41 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;41<br>
a-acute &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+00E1 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 = C3 A1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E1<br>
a-breve &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+0103 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 = C4 83 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3F<br>
e-circ-acute U+1EBF &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 = E1 BA BF &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3F<br>
euro &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+20AC &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 = E2 82 AC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80<br>
emoji &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+1F600 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 = F0 9F 98 80 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3F<br>
Character.MAX_VALUE (largest char) = 65535, Character.MAX_CODE_POINT = 1114111 (0x10FFFF)<br>
UTF-8 bytes of Viet Nam : 56 69 E1 BB 87 74 20 4E 61 6D<br>
decoded as UTF-8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Việt Nam<br>
decoded as windows-1252 : Viá»‡t Nam<br>
UTF-8 known to this JVM : true</div>
<p>Read the columns: in <strong>UTF-8</strong> an ASCII letter takes 1 byte, "á"/"ă" 2 bytes, most Vietnamese letters with two marks ("ế") 3 bytes, an emoji 4 bytes. <code>windows-1252</code> simply cannot store "ă" or "ế": <code>getBytes</code> turns them into <code>3F</code> = '?' — the real reason for "?" in files written on a lab PC (lesson 9.B, slide 34). The last lines show the opposite accident: correct UTF-8 bytes read with the wrong table become "Viá»‡t" — the text is not lost, only <em>decoded</em> wrongly.</p>
<div class="callout">➕ Vocabulary that FE mixes up: <strong>Unicode</strong> = the table (a number, a "code point", for every character: "ế" = U+1EBF). <strong>UTF-8 / UTF-16</strong> = ways to store those numbers as bytes. <strong>Encoding / charset</strong> = the rule bytes ↔ characters (<code>UTF-8</code>, <code>windows-1252</code>…). The slide's link (unicode.org, Unicode 7.0 from 2014) is old; Unicode is now past version 16.</div>`,
        `<p class="y-chinh">🎯 Một ký tự có thể lưu bằng mã ASCII (8 bit, 256 ký tự) hoặc Unicode (16 bit, 65.536 ký tự, "chưa biểu diễn hết"). UTF = Unicode (hay UCS) Transformation Format, một chuẩn nén văn bản Unicode; UTF-8 nén Unicode thành các đơn vị mã 8 bit. Java dùng UTF để đọc/ghi Unicode và chuyển đổi giữa Unicode với các bảng mã 8 bit bên ngoài.</p>
<p>Hai con số trên slide đã lỗi thời. <strong>ASCII</strong> là 7 bit — 128 ký tự ("256" là các bảng mã 8 bit như <code>windows-1252</code>, mỗi hệ thống một kiểu). <strong>Unicode</strong> chỉ 16 bit ở phiên bản 1.0 (1991); từ Unicode 2.0 (1996) nó có chỗ cho <strong>1.114.112</strong> điểm mã (code point, U+0000 tới U+10FFFF). <code>char</code> của Java vẫn là 16 bit, nên một ký tự vượt quá U+FFFF — một emoji — cần <strong>hai</strong> <code>char</code>. Đo thật:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    String[] samples = { "A", "á", "ă", "ế", "€", "😀" };   // ký tự cuối nằm NGOÀI dải 16 bit
    String[] names = { "A", "a-acute", "a-breve", "e-circ-acute", "euro", "emoji" };
    System.out.printf("%-12s %-10s %-7s %-18s %-7s %s%n", "char", "code point", "length", "UTF-8 bytes", "UTF-16", "windows-1252");
    for (int i = 0; i &lt; samples.length; i++) {
        String s = samples[i];
        byte[] u8 = s.getBytes("UTF-8");
        byte[] cp = s.getBytes("windows-1252");           // ký tự không có trong bảng thành '?' (0x3F)
        System.out.printf("%-12s %-10s %-7d %-18s %-7d %s%n",
                names[i], String.format("U+%04X", s.codePointAt(0)), s.length(), u8.length + " = " + hex(u8),
                s.getBytes("UTF-16BE").length, hex(cp));
    }
    System.out.println("Character.MAX_VALUE (largest char) = " + (int) Character.MAX_VALUE
            + ", Character.MAX_CODE_POINT = " + Character.MAX_CODE_POINT + " (0x10FFFF)");</code></pre>
<div class="out">char &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;code point length &nbsp;UTF-8 bytes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UTF-16 &nbsp;windows-1252<br>
A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+0041 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 = 41 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;41<br>
a-acute &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+00E1 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 = C3 A1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;E1<br>
a-breve &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+0103 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 = C4 83 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3F<br>
e-circ-acute U+1EBF &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 = E1 BA BF &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3F<br>
euro &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+20AC &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 = E2 82 AC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;80<br>
emoji &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U+1F600 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 = F0 9F 98 80 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3F<br>
Character.MAX_VALUE (largest char) = 65535, Character.MAX_CODE_POINT = 1114111 (0x10FFFF)<br>
UTF-8 bytes of Viet Nam : 56 69 E1 BB 87 74 20 4E 61 6D<br>
decoded as UTF-8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Việt Nam<br>
decoded as windows-1252 : Viá»‡t Nam<br>
UTF-8 known to this JVM : true</div>
<p>Đọc từng cột: trong <strong>UTF-8</strong> một chữ ASCII tốn 1 byte, "á"/"ă" 2 byte, đa số chữ Việt có hai dấu ("ế") 3 byte, emoji 4 byte. <code>windows-1252</code> đơn giản là không chứa nổi "ă" hay "ế": <code>getBytes</code> biến chúng thành <code>3F</code> = '?' — lý do thật của dấu "?" trong file ghi trên máy phòng lab (bài 9.B, slide 34). Mấy dòng cuối cho thấy tai nạn ngược lại: byte UTF-8 đúng nhưng đọc bằng bảng mã sai thành "Viá»‡t" — chữ không mất, chỉ bị <em>giải mã</em> sai.</p>
<div class="callout">➕ Từ vựng FE hay trộn lẫn: <strong>Unicode</strong> = cái bảng (mỗi ký tự một con số, gọi là "điểm mã": "ế" = U+1EBF). <strong>UTF-8 / UTF-16</strong> = các cách cất những con số đó thành byte. <strong>Encoding / charset</strong> (bảng mã) = luật đổi byte ↔ ký tự (<code>UTF-8</code>, <code>windows-1252</code>…). Link trên slide (unicode.org, Unicode 7.0 năm 2014) đã cũ; Unicode giờ đã qua phiên bản 16.</div>`],
      [7, '2- Introduction to the java.io Package',
        `<p class="y-chinh">🎯 Java treats all data sources (file, directory, I/O devices…) as streams; package <code>java.io</code> holds the APIs. A stream can be <strong>binary low-level</strong> (unit = a physical byte), <strong>binary high-level</strong> (unit = a primitive value or a string), an <strong>object stream</strong> (unit = an object), or a <strong>character stream</strong> (unit = a Unicode character).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a4affaedea6a795d73eb96e91a23456eb4639877.svg" alt="Slide 7 redrawn: four kinds of stream; only the low-level byte streams touch the file, the others wrap them" loading="lazy" /><p class="chu-thich">🧩 Slide 7 redrawn: four kinds of stream; only the low-level byte streams touch the file, the others wrap them</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 7 — the four kinds of stream in java.io, by their data unit
package "BINARY streams (InputStream / OutputStream)" as B {
  rectangle "LOW level\\nunit = 1 byte\\n—\\nFileInputStream\\nFileOutputStream" as Low #EEF2FF
  rectangle "HIGH level\\nunit = int, double, boolean, String\\n—\\nDataInputStream\\nDataOutputStream" as High #EEF2FF
  rectangle "OBJECT streams\\nunit = a whole object\\n—\\nObjectInputStream\\nObjectOutputStream" as Obj #EEF2FF
}
package "CHARACTER streams (Reader / Writer)" as C {
  rectangle "unit = 1 Unicode char\\n—\\nFileReader, BufferedReader\\nFileWriter, PrintWriter\\nInputStreamReader (bytes → chars)" as Chr #ECFDF5
}
High -down-&gt; Low : wraps
Obj -down-&gt; Low : wraps
Chr -right-&gt; Low : InputStreamReader /\\nOutputStreamWriter\\nconvert with an encoding
note bottom of Low
  only these talk to the file;
  the others are filters on top
end note
@enduml</code></pre></details>
<p>The four kinds write the same data — the number 1234 and the name "Hà" — into four files. Look at the bytes:</p>
<pre class="trich"><code class="language-java">try (FileOutputStream low = new FileOutputStream("1-byte.bin")) {          // binary LOW-level: unit = 1 byte
    low.write(1234);                                                       // only the lowest byte of the int survives
    low.write("Hà".getBytes("UTF-8"));                                     // a String must be turned into bytes by YOU
}
try (DataOutputStream high = new DataOutputStream(new FileOutputStream("2-data.bin"))) {   // binary HIGH-level: unit = int, double, String
    high.writeInt(1234);                                                   // always 4 bytes
    high.writeUTF("Hà");                                                   // 2-byte length + the characters
}
try (ObjectOutputStream obj = new ObjectOutputStream(new FileOutputStream("3-object.bin"))) {   // OBJECT stream: unit = a whole object
    obj.writeObject(new Diem());
}
try (Writer chars = new OutputStreamWriter(new FileOutputStream("4-text.txt"), "UTF-8")) {   // CHARACTER stream: unit = a Unicode char
    chars.write("1234 Hà");
}</code></pre>
<div class="out">1-byte.bin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 bytes: D2 48 C3 A0<br>
2-data.bin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 bytes: 00 00 04 D2 00 03 48 C3 A0<br>
3-object.bin &nbsp;&nbsp;67 bytes: AC ED 00 05 73 72 00 04 44 69 65 6D D8 B8 CF 13 ...<br>
4-text.txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 bytes: 31 32 33 34 20 48 C3 A0</div>
<ul>
<li><strong>Low level</strong> (<code>FileOutputStream</code>): <code>write(1234)</code> kept only the lowest byte <code>D2</code> (1234 = 0x04D2) — a byte stream knows nothing about <code>int</code>.</li>
<li><strong>High level</strong> (<code>DataOutputStream</code>): the int is all 4 bytes <code>00 00 04 D2</code>; the string is a 2-byte length <code>00 03</code> then its UTF-8 bytes.</li>
<li><strong>Object</strong> (<code>ObjectOutputStream</code>): 67 bytes for one small object — the header <code>AC ED 00 05</code>, the class name "Diem", field names and types, then the values.</li>
<li><strong>Character</strong> (<code>Writer</code>): the only file a human can read: "1234 Hà" as text, 8 bytes in UTF-8.</li>
</ul>
<div class="pitfall">FE (several papers): "In which stream is the data unit a primitive type or a string?" → <strong>binary high-level stream</strong>. "Low-level vs high-level?" → low level: a <strong>byte</strong>; high level: a <strong>primitive value</strong>. "Which classes work on character streams?" → <strong>Reader/Writer</strong> and their subclasses.</div>`,
        `<p class="y-chinh">🎯 Java coi mọi nguồn dữ liệu (file, thư mục, thiết bị vào/ra…) là luồng; gói <code>java.io</code> chứa các API. Một luồng có thể là <strong>nhị phân mức thấp</strong> (đơn vị = một byte vật lý), <strong>nhị phân mức cao</strong> (đơn vị = một giá trị kiểu nguyên thuỷ hay một chuỗi), <strong>luồng đối tượng</strong> (đơn vị = một đối tượng), hoặc <strong>luồng ký tự</strong> (đơn vị = một ký tự Unicode).</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a4affaedea6a795d73eb96e91a23456eb4639877.svg" alt="Slide 7 vẽ lại: bốn loại luồng; chỉ luồng byte mức thấp chạm tới file, các loại khác bọc ngoài nó" loading="lazy" /><p class="chu-thich">🧩 Slide 7 vẽ lại: bốn loại luồng; chỉ luồng byte mức thấp chạm tới file, các loại khác bọc ngoài nó</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 7 — the four kinds of stream in java.io, by their data unit
package "BINARY streams (InputStream / OutputStream)" as B {
  rectangle "LOW level\\nunit = 1 byte\\n—\\nFileInputStream\\nFileOutputStream" as Low #EEF2FF
  rectangle "HIGH level\\nunit = int, double, boolean, String\\n—\\nDataInputStream\\nDataOutputStream" as High #EEF2FF
  rectangle "OBJECT streams\\nunit = a whole object\\n—\\nObjectInputStream\\nObjectOutputStream" as Obj #EEF2FF
}
package "CHARACTER streams (Reader / Writer)" as C {
  rectangle "unit = 1 Unicode char\\n—\\nFileReader, BufferedReader\\nFileWriter, PrintWriter\\nInputStreamReader (bytes → chars)" as Chr #ECFDF5
}
High -down-&gt; Low : wraps
Obj -down-&gt; Low : wraps
Chr -right-&gt; Low : InputStreamReader /\\nOutputStreamWriter\\nconvert with an encoding
note bottom of Low
  only these talk to the file;
  the others are filters on top
end note
@enduml</code></pre></details>
<p>Bốn loại cùng ghi một dữ liệu — số 1234 và tên "Hà" — ra bốn file. Hãy nhìn các byte:</p>
<pre class="trich"><code class="language-java">try (FileOutputStream low = new FileOutputStream("1-byte.bin")) {          // nhị phân MỨC THẤP: đơn vị = 1 byte
    low.write(1234);                                                       // chỉ byte thấp nhất của int còn lại
    low.write("Hà".getBytes("UTF-8"));                                     // String phải do BẠN đổi ra byte
}
try (DataOutputStream high = new DataOutputStream(new FileOutputStream("2-data.bin"))) {   // nhị phân MỨC CAO: đơn vị = int, double, String
    high.writeInt(1234);                                                   // luôn 4 byte
    high.writeUTF("Hà");                                                   // 2 byte độ dài + các ký tự
}
try (ObjectOutputStream obj = new ObjectOutputStream(new FileOutputStream("3-object.bin"))) {   // luồng ĐỐI TƯỢNG: đơn vị = cả một đối tượng
    obj.writeObject(new Diem());
}
try (Writer chars = new OutputStreamWriter(new FileOutputStream("4-text.txt"), "UTF-8")) {   // luồng KÝ TỰ: đơn vị = một ký tự Unicode
    chars.write("1234 Hà");
}</code></pre>
<div class="out">1-byte.bin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 bytes: D2 48 C3 A0<br>
2-data.bin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 bytes: 00 00 04 D2 00 03 48 C3 A0<br>
3-object.bin &nbsp;&nbsp;67 bytes: AC ED 00 05 73 72 00 04 44 69 65 6D D8 B8 CF 13 ...<br>
4-text.txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 bytes: 31 32 33 34 20 48 C3 A0</div>
<ul>
<li><strong>Mức thấp</strong> (<code>FileOutputStream</code>): <code>write(1234)</code> chỉ giữ byte thấp nhất <code>D2</code> (1234 = 0x04D2) — luồng byte không biết gì về <code>int</code>.</li>
<li><strong>Mức cao</strong> (<code>DataOutputStream</code>): số int đủ 4 byte <code>00 00 04 D2</code>; chuỗi là 2 byte độ dài <code>00 03</code> rồi các byte UTF-8 của nó.</li>
<li><strong>Đối tượng</strong> (<code>ObjectOutputStream</code>): 67 byte cho một đối tượng nhỏ — đầu luồng <code>AC ED 00 05</code>, tên lớp "Diem", tên và kiểu các trường, rồi mới tới giá trị.</li>
<li><strong>Ký tự</strong> (<code>Writer</code>): file duy nhất người đọc được: "1234 Hà" dạng chữ, 8 byte theo UTF-8.</li>
</ul>
<div class="pitfall">FE (nhiều đề): "Luồng nào có đơn vị dữ liệu là kiểu nguyên thuỷ hoặc chuỗi?" → <strong>luồng nhị phân mức cao</strong>. "Mức thấp và mức cao khác gì?" → mức thấp: một <strong>byte</strong>; mức cao: một <strong>giá trị kiểu nguyên thuỷ</strong>. "Lớp nào làm việc với luồng ký tự?" → <strong>Reader/Writer</strong> và các lớp con.</div>`],
      [8, '3- Accessing directories and files',
        `<p class="y-chinh">🎯 The class <code>java.io.File</code> represents a file or a directory managed by the operating system: the Java program asks the OS, through a <code>File</code> object, for information about directories and files. Four constructors: <code>File(File parent, String child)</code>, <code>File(String pathname)</code>, <code>File(String parent, String child)</code>, <code>File(URI uri)</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7e6c9183afb5aa05a74a007f0787645f0ac08f5b.svg" alt="Slide 8 redrawn: File only asks the OS about a file — reading the content needs a stream" loading="lazy" /><p class="chu-thich">🧩 Slide 8 redrawn: File only asks the OS about a file — reading the content needs a stream</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 8 — java.io.File asks the OS ABOUT a file; it never reads or writes the data
left to right direction
rectangle "Java program" as P #ECFDF5
rectangle "java.io.File\\n(a path name)\\n—\\nexists() isFile() isDirectory()\\ngetName() getAbsolutePath()\\nlength() lastModified()\\nlist() listFiles()\\ncreateNewFile() mkdir() mkdirs()\\nrenameTo() delete()" as F #EEF2FF
rectangle "Operating system\\n(Windows, macOS, Linux)" as OS #DBEAFE
database "Directories / files\\nname, size, date,\\nrights, content" as D #FEF3C7
P --&gt; F : new File("f1.txt")
F --&gt; OS : questions,\\ncreate/rename/delete
OS --&gt; D
note bottom of F
  to read or write the CONTENT you need a stream:
  FileReader / FileInputStream ... (slides 12–58)
end note
@enduml</code></pre></details>
<p>The four constructors, all naming the same file <code>f1.txt</code>:</p>
<pre class="trich"><code class="language-java">File a = new File("f1.txt");                       // File(String pathname)
File b = new File(".", "f1.txt");                  // File(String parent, String child)
File c = new File(new File("."), "f1.txt");        // File(File parent, String child)
File d = new File(a.getAbsoluteFile().toURI());    // File(URI uri) — a "file:" URI
System.out.println(a.getPath() + " | " + b.getPath() + " | " + c.getPath() + " | " + d.getPath());
System.out.println("same file? " + a.getCanonicalPath().equals(b.getCanonicalPath())
        + " " + b.getCanonicalPath().equals(c.getCanonicalPath()) + " " + c.getCanonicalPath().equals(d.getPath()));
System.out.println("URI form: " + d.toURI());</code></pre>
<p>Output (part of the run shown in full under slide 10):</p>
<pre><code class="language-plaintext">f1.txt | ./f1.txt | ./f1.txt | /w/f1.txt
same file? true true true
URI form: file:/w/f1.txt</code></pre>
<p><code>getPath()</code> gives back the name as you built it; <code>getCanonicalPath()</code> gives the single real path, so it is the safe way to compare two <code>File</code>s. A <code>URI</code> is the "file:" address form, the same as a browser uses for local files.</p>
<div class="pitfall">FE: "The File class has only one constructor with a path parameter" — <strong>false</strong>, it has four. And <code>new File("x.txt")</code> creates <strong>nothing</strong> on disk — it is just a name; the next slides show <code>createNewFile()</code>.</div>`,
        `<p class="y-chinh">🎯 Lớp <code>java.io.File</code> đại diện cho một file hay thư mục do hệ điều hành quản lý: chương trình Java hỏi hệ điều hành, thông qua một đối tượng <code>File</code>, về thông tin của thư mục và file. Bốn hàm tạo: <code>File(File parent, String child)</code>, <code>File(String pathname)</code>, <code>File(String parent, String child)</code>, <code>File(URI uri)</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7e6c9183afb5aa05a74a007f0787645f0ac08f5b.svg" alt="Slide 8 vẽ lại: File chỉ hỏi hệ điều hành VỀ file — đọc nội dung thì cần một luồng" loading="lazy" /><p class="chu-thich">🧩 Slide 8 vẽ lại: File chỉ hỏi hệ điều hành VỀ file — đọc nội dung thì cần một luồng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 8 — java.io.File asks the OS ABOUT a file; it never reads or writes the data
left to right direction
rectangle "Java program" as P #ECFDF5
rectangle "java.io.File\\n(a path name)\\n—\\nexists() isFile() isDirectory()\\ngetName() getAbsolutePath()\\nlength() lastModified()\\nlist() listFiles()\\ncreateNewFile() mkdir() mkdirs()\\nrenameTo() delete()" as F #EEF2FF
rectangle "Operating system\\n(Windows, macOS, Linux)" as OS #DBEAFE
database "Directories / files\\nname, size, date,\\nrights, content" as D #FEF3C7
P --&gt; F : new File("f1.txt")
F --&gt; OS : questions,\\ncreate/rename/delete
OS --&gt; D
note bottom of F
  to read or write the CONTENT you need a stream:
  FileReader / FileInputStream ... (slides 12–58)
end note
@enduml</code></pre></details>
<p>Bốn hàm tạo, cùng gọi tên một file <code>f1.txt</code>:</p>
<pre class="trich"><code class="language-java">File a = new File("f1.txt");                       // File(String đường-dẫn)
File b = new File(".", "f1.txt");                  // File(String parent, String child)
File c = new File(new File("."), "f1.txt");        // File(File parent, String child)
File d = new File(a.getAbsoluteFile().toURI());    // một URI dạng "file:"
System.out.println(a.getPath() + " | " + b.getPath() + " | " + c.getPath() + " | " + d.getPath());
System.out.println("same file? " + a.getCanonicalPath().equals(b.getCanonicalPath())
        + " " + b.getCanonicalPath().equals(c.getCanonicalPath()) + " " + c.getCanonicalPath().equals(d.getPath()));
System.out.println("URI form: " + d.toURI());</code></pre>
<p>Output (một phần của lần chạy đầy đủ ở slide 10):</p>
<pre><code class="language-plaintext">f1.txt | ./f1.txt | ./f1.txt | /w/f1.txt
same file? true true true
URI form: file:/w/f1.txt</code></pre>
<p><code>getPath()</code> trả lại cái tên đúng như bạn dựng; <code>getCanonicalPath()</code> trả đường dẫn thật duy nhất, nên đó là cách an toàn để so hai <code>File</code>. <code>URI</code> là dạng địa chỉ "file:", giống cách trình duyệt gọi file trên máy.</p>
<div class="pitfall">FE: "Lớp File chỉ có một hàm tạo với tham số đường dẫn" — <strong>sai</strong>, nó có bốn. Và <code>new File("x.txt")</code> <strong>không tạo gì</strong> trên đĩa — nó chỉ là một cái tên; các slide sau dùng <code>createNewFile()</code>.</div>`],
      [9, 'Accessing directories and files',
        `<p class="y-chinh">🎯 Common methods: <code>canExecute()</code>, <code>canRead()</code>, <code>canWrite()</code>; <code>exists()</code>, <code>isDirectory()</code>, <code>isFile()</code>; <code>getAbsolutePath()</code>, <code>getCanonicalPath()</code>, <code>getName()</code>, <code>getParent()</code>; <code>list()</code>; <code>delete()</code>, <code>createNewFile()</code>, "mkDir()", "rename(File newName)"; <code>length()</code>. This class helps accessing file/directory <strong>information only</strong> — it has no method to access the data in a file.</p>
<p>Two names on the slide do not exist: the real methods are <strong><code>mkdir()</code></strong> (lower-case d) — plus <code>mkdirs()</code> — and <strong><code>renameTo(File dest)</code></strong>. Every method of the list, called on a real disk:</p>
<pre class="trich"><code class="language-java">File ghost = new File("lab/../ghost.txt");          // a File object is only a NAME: nothing is created yet
System.out.println("exists " + ghost.exists() + ", length " + ghost.length() + ", lastModified " + ghost.lastModified());
System.out.println("getPath          " + ghost.getPath());
System.out.println("getAbsolutePath  " + ghost.getAbsolutePath());   // keeps the ".."
System.out.println("getCanonicalPath " + ghost.getCanonicalPath());  // ".." resolved: one real path
System.out.println("getName " + ghost.getName() + ", getParent " + ghost.getParent());
System.out.println("createNewFile -&gt; " + ghost.createNewFile() + ", again -&gt; " + ghost.createNewFile());   // true, then false: already there
System.out.println("isFile " + ghost.isFile() + ", isDirectory " + ghost.isDirectory() + ", length " + ghost.length());
File dir = new File("lab/bt/ch9");
System.out.println("mkdir()  -&gt; " + dir.mkdir() + "   (parent lab/bt does not exist)");
System.out.println("mkdirs() -&gt; " + dir.mkdirs() + "  (creates every missing folder)");
File moved = new File("lab/bt/ch9/ghost2.txt");
System.out.println("renameTo -&gt; " + ghost.renameTo(moved) + ", old exists " + ghost.exists() + ", new exists " + moved.exists());
System.out.println("delete folder that is not empty -&gt; " + dir.delete());
System.out.println("delete file -&gt; " + moved.delete() + ", then folder -&gt; " + dir.delete());</code></pre>
<pre><code class="language-plaintext">exists false, length 0, lastModified 0
getPath          lab/../ghost.txt
getAbsolutePath  /w/lab/../ghost.txt
getCanonicalPath /w/ghost.txt
getName ghost.txt, getParent lab/..
createNewFile -&gt; true, again -&gt; false
isFile true, isDirectory false, length 0
mkdir()  -&gt; false   (parent lab/bt does not exist)
mkdirs() -&gt; true  (creates every missing folder)
renameTo -&gt; true, old exists false, new exists true
delete folder that is not empty -&gt; false
delete file -&gt; true, then folder -&gt; true</code></pre>
<p>The slide's table in one line: <code>getAbsolutePath()</code> just glues the current folder in front and keeps "<code>..</code>"; <code>getCanonicalPath()</code> resolves it into the one real path (and may throw <code>IOException</code>, because it asks the OS). Notice that most methods report failure by returning <code>false</code>, not by throwing — <strong>check the boolean</strong>. <code>createNewFile()</code> is the exception: a missing parent folder makes it throw:</p>
<pre class="trich"><code class="language-java">try {
    new File("khong-co/thu-muc/x.txt").createNewFile();   // the parent folder is missing
} catch (IOException e) {
    System.out.println("createNewFile in a missing folder: " + e);
}</code></pre>
<pre><code class="language-plaintext">createNewFile in a missing folder: java.io.IOException: No such file or directory</code></pre>
<div class="pitfall">FE: "Which exception might arise when using the File object to create a new file?" → <strong>IOException</strong> (createNewFile is declared <code>throws IOException</code>). On Windows the message reads "The system cannot find the path specified" — same exception. "Which method checks that a file exists?" → <code>exists()</code>; "can be read?" → <code>canRead()</code>. The table's second column says "Solaris" — Oracle's old Unix, discontinued; read it as Linux/macOS.</div>`,
        `<p class="y-chinh">🎯 Phương thức thường dùng: <code>canExecute()</code>, <code>canRead()</code>, <code>canWrite()</code>; <code>exists()</code>, <code>isDirectory()</code>, <code>isFile()</code>; <code>getAbsolutePath()</code>, <code>getCanonicalPath()</code>, <code>getName()</code>, <code>getParent()</code>; <code>list()</code>; <code>delete()</code>, <code>createNewFile()</code>, "mkDir()", "rename(File newName)"; <code>length()</code>. Lớp này chỉ giúp truy cập <strong>thông tin</strong> của file/thư mục — nó không có phương thức nào đọc dữ liệu bên trong file.</p>
<p>Hai cái tên trên slide không tồn tại: phương thức thật là <strong><code>mkdir()</code></strong> (chữ d thường) — thêm <code>mkdirs()</code> — và <strong><code>renameTo(File dest)</code></strong>. Mọi phương thức trong danh sách, gọi trên đĩa thật:</p>
<pre class="trich"><code class="language-java">File ghost = new File("lab/../ghost.txt");          // đối tượng File chỉ là một CÁI TÊN: chưa có gì được tạo
System.out.println("exists " + ghost.exists() + ", length " + ghost.length() + ", lastModified " + ghost.lastModified());
System.out.println("getPath          " + ghost.getPath());
System.out.println("getAbsolutePath  " + ghost.getAbsolutePath());   // giữ nguyên ".."
System.out.println("getCanonicalPath " + ghost.getCanonicalPath());  // ".." đã được giải: một đường dẫn thật duy nhất
System.out.println("getName " + ghost.getName() + ", getParent " + ghost.getParent());
System.out.println("createNewFile -&gt; " + ghost.createNewFile() + ", again -&gt; " + ghost.createNewFile());   // true, rồi false: đã có rồi
System.out.println("isFile " + ghost.isFile() + ", isDirectory " + ghost.isDirectory() + ", length " + ghost.length());
File dir = new File("lab/bt/ch9");
System.out.println("mkdir()  -&gt; " + dir.mkdir() + "   (parent lab/bt does not exist)");
System.out.println("mkdirs() -&gt; " + dir.mkdirs() + "  (creates every missing folder)");
File moved = new File("lab/bt/ch9/ghost2.txt");
System.out.println("renameTo -&gt; " + ghost.renameTo(moved) + ", old exists " + ghost.exists() + ", new exists " + moved.exists());
System.out.println("delete folder that is not empty -&gt; " + dir.delete());
System.out.println("delete file -&gt; " + moved.delete() + ", then folder -&gt; " + dir.delete());</code></pre>
<pre><code class="language-plaintext">exists false, length 0, lastModified 0
getPath          lab/../ghost.txt
getAbsolutePath  /w/lab/../ghost.txt
getCanonicalPath /w/ghost.txt
getName ghost.txt, getParent lab/..
createNewFile -&gt; true, again -&gt; false
isFile true, isDirectory false, length 0
mkdir()  -&gt; false   (parent lab/bt does not exist)
mkdirs() -&gt; true  (creates every missing folder)
renameTo -&gt; true, old exists false, new exists true
delete folder that is not empty -&gt; false
delete file -&gt; true, then folder -&gt; true</code></pre>
<p>Bảng của slide gói trong một dòng: <code>getAbsolutePath()</code> chỉ dán thư mục hiện tại vào trước và giữ nguyên "<code>..</code>"; <code>getCanonicalPath()</code> giải nó ra đường dẫn thật duy nhất (và có thể ném <code>IOException</code>, vì nó hỏi hệ điều hành). Để ý: phần lớn phương thức báo thất bại bằng cách trả <code>false</code>, không ném ngoại lệ — <strong>hãy kiểm tra giá trị boolean</strong>. <code>createNewFile()</code> là ngoại lệ: thiếu thư mục cha thì nó ném lỗi:</p>
<pre class="trich"><code class="language-java">try {
    new File("khong-co/thu-muc/x.txt").createNewFile();   // thiếu thư mục cha
} catch (IOException e) {
    System.out.println("createNewFile in a missing folder: " + e);
}</code></pre>
<pre><code class="language-plaintext">createNewFile in a missing folder: java.io.IOException: No such file or directory</code></pre>
<div class="pitfall">FE: "Ngoại lệ nào có thể phát sinh khi dùng đối tượng File để tạo file mới?" → <strong>IOException</strong> (createNewFile khai báo <code>throws IOException</code>). Trên Windows thông báo là "The system cannot find the path specified" — cùng ngoại lệ đó. "Phương thức nào kiểm tra file có tồn tại?" → <code>exists()</code>; "đọc được không?" → <code>canRead()</code>. Cột thứ hai của bảng ghi "Solaris" — hệ Unix cũ của Oracle, đã ngừng; hãy đọc nó như Linux/macOS.</div>`],
      [10, 'Accessing directories and files',
        `<p class="y-chinh">🎯 "Get File Attributes Demo": <code>FileDemo.java</code> prints the name, absolute file and path, canonical path, last-modified date, hidden/can-read/can-write and size of <code>f1.txt</code> (a 30-byte Notepad file). The Vietnamese note: <code>lastModified()</code> returns a <code>long</code> — the milliseconds since January 1, 1970, 00:00:00 GMT; a <code>Date</code> object turns that number back into a date.</p>
<p>The slide's program, run for real (we first create <code>f1.txt</code> with the same text and set its date to the one in the screenshot, Mon Jan 03 20:43:20 PST 2005):</p>
<pre class="trich"><code class="language-java">static void fileDemo() throws IOException {
    File f = new File("f1.txt");
    System.out.println("Ten file la:" + f.getName());
    System.out.println("Ten file tuyet doi la:" + f.getAbsoluteFile());
    System.out.println("Duong dan tuyet doi la:" + f.getAbsolutePath());
    System.out.println("Path chuan la:" + f.getCanonicalPath());
    System.out.println("Ngay cap nhat cuoi cung la:" + new Date(f.lastModified()));
    System.out.println("Thuoc tinh Hidden:" + f.isHidden());
    System.out.println("Thuoc tinh can-read:" + f.canRead());
    System.out.println("Thuoc tinh can-write:" + f.canWrite());
    System.out.println("Kich thuoc:" + f.length() + " bytes");
}</code></pre>
<div class="out">== the slide's FileDemo ==<br>
Ten file la:f1.txt<br>
Ten file tuyet doi la:/w/f1.txt<br>
Duong dan tuyet doi la:/w/f1.txt<br>
Path chuan la:/w/f1.txt<br>
Ngay cap nhat cuoi cung la:Tue Jan 04 11:43:20 ICT 2005<br>
Thuoc tinh Hidden:false<br>
Thuoc tinh can-read:true<br>
Thuoc tinh can-write:true<br>
Kich thuoc:30 bytes<br>
== four constructors, one file ==<br>
f1.txt | ./f1.txt | ./f1.txt | /w/f1.txt<br>
same file? true true true<br>
URI form: file:/w/f1.txt<br>
== slide 9: the methods, with their real names ==<br>
exists false, length 0, lastModified 0<br>
getPath &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lab/../ghost.txt<br>
getAbsolutePath &nbsp;/w/lab/../ghost.txt<br>
getCanonicalPath /w/ghost.txt<br>
getName ghost.txt, getParent lab/..<br>
createNewFile -&gt; true, again -&gt; false<br>
isFile true, isDirectory false, length 0<br>
mkdir() &nbsp;-&gt; false &nbsp;&nbsp;(parent lab/bt does not exist)<br>
mkdirs() -&gt; true &nbsp;(creates every missing folder)<br>
renameTo -&gt; true, old exists false, new exists true<br>
delete folder that is not empty -&gt; false<br>
delete file -&gt; true, then folder -&gt; true<br>
createNewFile in a missing folder: java.io.IOException: No such file or directory</div>
<p>Same 30 bytes, same flags. The date shows the point of the note: the file stores <strong>one number</strong> of milliseconds (1104813800000); <code>new Date(…)</code> prints it in the time zone of the machine running the program. The slide's PC was in California (PST); ours is in Vietnam (ICT = UTC+7), so the same instant reads <strong>Tue Jan 04 11:43:20 ICT 2005</strong>. A file that does not exist has <code>lastModified() == 0</code> — 1 January 1970.</p>
<p>The JCreator window title "C:\\PROGRA~1\\XINOXS~1\\JCREAT~2\\GE2001.exe" is an IDE from the early 2000s; the paths "E:\\TaiLieuCacMonHocTuSoan\\…" are the teacher's own folders. <code>isHidden()</code> is true on Windows when the "hidden" attribute is set, on Linux/macOS when the name starts with a dot.</p>
<div class="callout">🧭 <strong>Go further — Java 8 dates</strong>: <code>Date</code> is the old API. On JDK 8 you can already write <code>Instant.ofEpochMilli(f.lastModified())</code> or <code>Files.getLastModifiedTime(path)</code> (package <code>java.time</code>, Java 8) — the API Spring Boot and JPA use.</div>`,
        `<p class="y-chinh">🎯 "Get File Attributes Demo": <code>FileDemo.java</code> in tên, file và đường dẫn tuyệt đối, đường dẫn chuẩn, ngày sửa cuối, các thuộc tính ẩn/đọc được/ghi được và kích thước của <code>f1.txt</code> (một file Notepad 30 byte). Ghi chú tiếng Việt trên slide: <code>lastModified()</code> trả về một số <code>long</code> — số mili giây kể từ 00:00:00 GMT ngày 1/1/1970; một đối tượng <code>Date</code> đổi con số đó ngược lại thành ngày giờ.</p>
<p>Chương trình của slide, chạy thật (trước đó ta tạo <code>f1.txt</code> với đúng nội dung và đặt ngày của nó trùng ảnh chụp, Mon Jan 03 20:43:20 PST 2005):</p>
<pre class="trich"><code class="language-java">static void fileDemo() throws IOException {
    File f = new File("f1.txt");
    System.out.println("Ten file la:" + f.getName());
    System.out.println("Ten file tuyet doi la:" + f.getAbsoluteFile());
    System.out.println("Duong dan tuyet doi la:" + f.getAbsolutePath());
    System.out.println("Path chuan la:" + f.getCanonicalPath());
    System.out.println("Ngay cap nhat cuoi cung la:" + new Date(f.lastModified()));
    System.out.println("Thuoc tinh Hidden:" + f.isHidden());
    System.out.println("Thuoc tinh can-read:" + f.canRead());
    System.out.println("Thuoc tinh can-write:" + f.canWrite());
    System.out.println("Kich thuoc:" + f.length() + " bytes");
}</code></pre>
<div class="out">== the slide's FileDemo ==<br>
Ten file la:f1.txt<br>
Ten file tuyet doi la:/w/f1.txt<br>
Duong dan tuyet doi la:/w/f1.txt<br>
Path chuan la:/w/f1.txt<br>
Ngay cap nhat cuoi cung la:Tue Jan 04 11:43:20 ICT 2005<br>
Thuoc tinh Hidden:false<br>
Thuoc tinh can-read:true<br>
Thuoc tinh can-write:true<br>
Kich thuoc:30 bytes<br>
== four constructors, one file ==<br>
f1.txt | ./f1.txt | ./f1.txt | /w/f1.txt<br>
same file? true true true<br>
URI form: file:/w/f1.txt<br>
== slide 9: the methods, with their real names ==<br>
exists false, length 0, lastModified 0<br>
getPath &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lab/../ghost.txt<br>
getAbsolutePath &nbsp;/w/lab/../ghost.txt<br>
getCanonicalPath /w/ghost.txt<br>
getName ghost.txt, getParent lab/..<br>
createNewFile -&gt; true, again -&gt; false<br>
isFile true, isDirectory false, length 0<br>
mkdir() &nbsp;-&gt; false &nbsp;&nbsp;(parent lab/bt does not exist)<br>
mkdirs() -&gt; true &nbsp;(creates every missing folder)<br>
renameTo -&gt; true, old exists false, new exists true<br>
delete folder that is not empty -&gt; false<br>
delete file -&gt; true, then folder -&gt; true<br>
createNewFile in a missing folder: java.io.IOException: No such file or directory</div>
<p>Cùng 30 byte, cùng các cờ. Dòng ngày cho thấy ý của ghi chú: file chỉ cất <strong>một con số</strong> mili giây (1104813800000); <code>new Date(…)</code> in nó theo múi giờ của máy đang chạy chương trình. Máy của slide ở California (PST); máy của ta ở Việt Nam (ICT = UTC+7), nên cùng một thời điểm đọc thành <strong>Tue Jan 04 11:43:20 ICT 2005</strong>. File không tồn tại có <code>lastModified() == 0</code> — ngày 1/1/1970.</p>
<p>Tiêu đề cửa sổ JCreator "C:\\PROGRA~1\\XINOXS~1\\JCREAT~2\\GE2001.exe" là một IDE của đầu những năm 2000; đường dẫn "E:\\TaiLieuCacMonHocTuSoan\\…" là thư mục riêng của giảng viên. <code>isHidden()</code> đúng trên Windows khi file có thuộc tính "hidden", trên Linux/macOS khi tên bắt đầu bằng dấu chấm.</p>
<div class="callout">🧭 <strong>Đi tiếp — ngày giờ Java 8</strong>: <code>Date</code> là API cũ. Trên JDK 8 bạn đã viết được <code>Instant.ofEpochMilli(f.lastModified())</code> hoặc <code>Files.getLastModifiedTime(path)</code> (gói <code>java.time</code>, Java 8) — API mà Spring Boot và JPA dùng.</div>`],
      [11, 'Accessing directories and files',
        `<p class="y-chinh">🎯 "Accessing a folder Demo": <code>FileDemo2</code> opens <code>"../BtCh10-IO"</code>, says whether it is a folder, then calls <code>list()</code> and prints each name with "Tap tin" (file) or "Thu muc" (folder). The blue box: <code>./</code> = the current folder, <code>../</code> = the parent of the current folder.</p>
<p>We build a small folder tree and run the slide's code from <code>lab/src</code>, so "<code>..</code>" means <code>lab</code>:</p>
<pre class="trich"><code class="language-java">File f = new File("lab/src/../BtCh10-IO");                  // the slide writes "../BtCh10-IO": ".." = the parent folder
String S = f.isDirectory() ? "Thu muc" : "Tap tin";
System.out.println("../BtCh10-IO la:" + S);
String L[] = f.list();                                      // names only, in NO guaranteed order
Arrays.sort(L);                                             // ➕ sort, or the order changes between machines
System.out.println("Noi dung thu muc:");
for (int i = 0; i &lt; L.length; ++i) {
    File f2 = new File(f, L[i]);
    System.out.println(L[i] + "  " + (f2.isFile() ? "Tap tin" : "Thu muc"));
}</code></pre>
<pre><code class="language-plaintext">== the slide's FileDemo2, run from lab/src (so ".." = lab) ==
../BtCh10-IO la:Thu muc
Noi dung thu muc:
FileDemo.class  Tap tin
FileDemo.java  Tap tin
data  Thu muc
f1.txt  Tap tin
f2.txt  Tap tin</code></pre>
<p>One line was added: <code>Arrays.sort(L)</code>. The Javadoc of <code>list()</code> says the names come in <strong>no guaranteed order</strong>; Windows happens to return them sorted (as in the screenshot), Linux does not. (Sorting <code>String</code>s puts upper-case before lower-case, hence <code>FileDemo…</code> before <code>data</code>.) And one trap the slide does not mention:</p>
<pre class="trich"><code class="language-java">String[] notAFolder = new File("lab/BtCh10-IO/f1.txt").list();   // list() on a FILE (or a missing path) returns null
System.out.println("list() of a file = " + notAFolder);
try {
    System.out.println(notAFolder.length);
} catch (NullPointerException e) {
    System.out.println("the slide's for loop would crash here: " + e);
}</code></pre>
<pre><code class="language-plaintext">list() of a file = null
the slide's for loop would crash here: java.lang.NullPointerException</code></pre>
<p>➕ <code>listFiles()</code> gives <code>File</code> objects instead of names — handy for a recursive walk; and <code>java.nio.file</code> (Java 7, so available on JDK 8) adds <code>Paths.get</code>, <code>Files.exists</code>, <code>Files.size</code> and folder filters:</p>
<pre class="trich"><code class="language-java">static void cay(File f, String thut) {
    System.out.println(thut + f.getName() + (f.isDirectory() ? "/" : ""));
    if (!f.isDirectory()) return;
    File[] con = f.listFiles();                                 // File objects instead of names
    Arrays.sort(con);                                           // File is Comparable: sorts by path
    for (File x : con) cay(x, thut + "    ");
}</code></pre>
<pre class="trich"><code class="language-java">Path goc = Paths.get("lab");                                // JDK 8: Paths.get (Path.of only exists from Java 11)
List&lt;String&gt; txt = new ArrayList&lt;String&gt;();
try (DirectoryStream&lt;Path&gt; ds = Files.newDirectoryStream(goc.resolve("BtCh10-IO"), "*.txt")) {   // a glob filter
    for (Path p : ds) txt.add(p.getFileName().toString());
}
Collections.sort(txt);
System.out.println("*.txt in BtCh10-IO: " + txt);
System.out.println("Files.exists " + Files.exists(goc.resolve("src/Main.java")) + ", Files.size " + Files.size(goc.resolve("src/Main.java"))
        + ", isDirectory " + Files.isDirectory(goc.resolve("BtCh10-IO/data")));</code></pre>
<div class="out">== the slide's FileDemo2, run from lab/src (so ".." = lab) ==<br>
../BtCh10-IO la:Thu muc<br>
Noi dung thu muc:<br>
FileDemo.class &nbsp;Tap tin<br>
FileDemo.java &nbsp;Tap tin<br>
data &nbsp;Thu muc<br>
f1.txt &nbsp;Tap tin<br>
f2.txt &nbsp;Tap tin<br>
list() of a file = null<br>
the slide's for loop would crash here: java.lang.NullPointerException<br>
== recursive walk with File ==<br>
lab/<br>
&nbsp;&nbsp;&nbsp;&nbsp;BtCh10-IO/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileDemo.class<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileDemo.java<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;employees.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f2.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;src/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Main.java<br>
== the same with java.nio.file (Java 7+, so fine on JDK 8) ==<br>
*.txt in BtCh10-IO: [f1.txt, f2.txt]<br>
Files.exists true, Files.size 1, isDirectory true</div>
<div class="pitfall">On JDK 8 write <code>Paths.get("lab")</code> — <code>Path.of("lab")</code> only exists from <strong>Java 11</strong>, and FE5 even has an option built on it ("<code>new Scanner(Path.of("data.txt"), StandardCharsets.UTF_8)</code>", which also needs Java 10). Code from a modern tutorial compiled on the exam machine gives "cannot find symbol".</div>`,
        `<p class="y-chinh">🎯 "Accessing a folder Demo": <code>FileDemo2</code> mở <code>"../BtCh10-IO"</code>, cho biết đó có phải thư mục không, rồi gọi <code>list()</code> và in mỗi tên kèm "Tap tin" hay "Thu muc". Hộp xanh: <code>./</code> = thư mục hiện tại, <code>../</code> = thư mục cha của thư mục hiện tại.</p>
<p>Ta dựng một cây thư mục nhỏ và chạy code của slide từ <code>lab/src</code>, nên "<code>..</code>" nghĩa là <code>lab</code>:</p>
<pre class="trich"><code class="language-java">File f = new File("lab/src/../BtCh10-IO");                  // slide viết "../BtCh10-IO": ".." = thư mục cha
String S = f.isDirectory() ? "Thu muc" : "Tap tin";
System.out.println("../BtCh10-IO la:" + S);
String L[] = f.list();                                      // chỉ có tên, KHÔNG hứa thứ tự nào
Arrays.sort(L);                                             // ➕ sắp xếp, nếu không thứ tự đổi theo máy
System.out.println("Noi dung thu muc:");
for (int i = 0; i &lt; L.length; ++i) {
    File f2 = new File(f, L[i]);
    System.out.println(L[i] + "  " + (f2.isFile() ? "Tap tin" : "Thu muc"));
}</code></pre>
<pre><code class="language-plaintext">== the slide's FileDemo2, run from lab/src (so ".." = lab) ==
../BtCh10-IO la:Thu muc
Noi dung thu muc:
FileDemo.class  Tap tin
FileDemo.java  Tap tin
data  Thu muc
f1.txt  Tap tin
f2.txt  Tap tin</code></pre>
<p>Có thêm đúng một dòng: <code>Arrays.sort(L)</code>. Javadoc của <code>list()</code> ghi rằng các tên trả về <strong>không theo thứ tự nào được hứa</strong>; Windows tình cờ trả về đã sắp (như ảnh chụp), Linux thì không. (Sắp <code>String</code> thì chữ hoa đứng trước chữ thường, nên <code>FileDemo…</code> đứng trước <code>data</code>.) Và một cái bẫy slide không nhắc:</p>
<pre class="trich"><code class="language-java">String[] notAFolder = new File("lab/BtCh10-IO/f1.txt").list();   // list() trên một FILE (hay đường dẫn không có) trả null
System.out.println("list() of a file = " + notAFolder);
try {
    System.out.println(notAFolder.length);
} catch (NullPointerException e) {
    System.out.println("the slide's for loop would crash here: " + e);
}</code></pre>
<pre><code class="language-plaintext">list() of a file = null
the slide's for loop would crash here: java.lang.NullPointerException</code></pre>
<p>➕ <code>listFiles()</code> trả về đối tượng <code>File</code> thay vì tên — tiện cho việc duyệt đệ quy; và <code>java.nio.file</code> (Java 7, nên có trên JDK 8) thêm <code>Paths.get</code>, <code>Files.exists</code>, <code>Files.size</code> và bộ lọc thư mục:</p>
<pre class="trich"><code class="language-java">static void cay(File f, String thut) {
    System.out.println(thut + f.getName() + (f.isDirectory() ? "/" : ""));
    if (!f.isDirectory()) return;
    File[] con = f.listFiles();                                 // đối tượng File thay vì tên
    Arrays.sort(con);                                           // File là Comparable: sắp theo đường dẫn
    for (File x : con) cay(x, thut + "    ");
}</code></pre>
<pre class="trich"><code class="language-java">Path goc = Paths.get("lab");                                // JDK 8: Paths.get (Path.of chỉ có từ Java 11)
List&lt;String&gt; txt = new ArrayList&lt;String&gt;();
try (DirectoryStream&lt;Path&gt; ds = Files.newDirectoryStream(goc.resolve("BtCh10-IO"), "*.txt")) {   // bộ lọc kiểu glob
    for (Path p : ds) txt.add(p.getFileName().toString());
}
Collections.sort(txt);
System.out.println("*.txt in BtCh10-IO: " + txt);
System.out.println("Files.exists " + Files.exists(goc.resolve("src/Main.java")) + ", Files.size " + Files.size(goc.resolve("src/Main.java"))
        + ", isDirectory " + Files.isDirectory(goc.resolve("BtCh10-IO/data")));</code></pre>
<div class="out">== the slide's FileDemo2, run from lab/src (so ".." = lab) ==<br>
../BtCh10-IO la:Thu muc<br>
Noi dung thu muc:<br>
FileDemo.class &nbsp;Tap tin<br>
FileDemo.java &nbsp;Tap tin<br>
data &nbsp;Thu muc<br>
f1.txt &nbsp;Tap tin<br>
f2.txt &nbsp;Tap tin<br>
list() of a file = null<br>
the slide's for loop would crash here: java.lang.NullPointerException<br>
== recursive walk with File ==<br>
lab/<br>
&nbsp;&nbsp;&nbsp;&nbsp;BtCh10-IO/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileDemo.class<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileDemo.java<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;employees.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f1.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f2.txt<br>
&nbsp;&nbsp;&nbsp;&nbsp;src/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Main.java<br>
== the same with java.nio.file (Java 7+, so fine on JDK 8) ==<br>
*.txt in BtCh10-IO: [f1.txt, f2.txt]<br>
Files.exists true, Files.size 1, isDirectory true</div>
<div class="pitfall">Trên JDK 8 hãy viết <code>Paths.get("lab")</code> — <code>Path.of("lab")</code> chỉ có từ <strong>Java 11</strong>, và FE5 còn có một phương án dựa trên nó ("<code>new Scanner(Path.of("data.txt"), StandardCharsets.UTF_8)</code>", cái này còn cần Java 10). Code chép từ bài hướng dẫn hiện đại mà biên dịch trên máy thi sẽ báo "cannot find symbol".</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>What do <code>read()</code> of a <code>FileInputStream</code> and <code>readLine()</code> of a <code>BufferedReader</code> return at the end of the data?</li>
<li>How many bytes does "Việt" take in UTF-8? Why does a lab PC sometimes save it as "Vi?t"?</li>
<li>Name the four kinds of stream of slide 7 and one class of each.</li>
<li><code>File f = new File("data/out.txt");</code> — does the file exist now? Write the two lines that create it when the folder <code>data</code> does not exist yet.</li>
<li>Why can <code>for (String s : new File(path).list())</code> throw <code>NullPointerException</code>?</li>
</ul>
<p>Continue with <strong>9.B</strong>: reading and writing text files, the two case studies, and the UTF-8 problem solved.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li><code>read()</code> của <code>FileInputStream</code> và <code>readLine()</code> của <code>BufferedReader</code> trả gì khi hết dữ liệu?</li>
<li>"Việt" tốn mấy byte trong UTF-8? Vì sao máy phòng lab đôi khi lưu nó thành "Vi?t"?</li>
<li>Kể tên bốn loại luồng của slide 7 và một lớp của mỗi loại.</li>
<li><code>File f = new File("data/out.txt");</code> — giờ file đã tồn tại chưa? Viết hai dòng tạo nó khi thư mục <code>data</code> chưa có.</li>
<li>Vì sao <code>for (String s : new File(path).list())</code> có thể ném <code>NullPointerException</code>?</li>
</ul>
<p>Học tiếp <strong>9.B</strong>: đọc và ghi file văn bản, hai case study, và giải quyết vấn đề UTF-8.</p>`),
    books([
      ['horstmann1', 'Ch. 3.7.3 "File Input and Output" (Scanner on a file, PrintWriter, the encoding argument); Ch. 3.3.3 "Unicode and the char Type" (code points, UTF-16, surrogate pairs)', 'Chương 3.7.3 "File Input and Output" (Scanner đọc file, PrintWriter, đối số bảng mã); Chương 3.3.3 "Unicode and the char Type" (điểm mã, UTF-16, cặp thay thế)'],
      ['horstmann2', 'Ch. 2.1 "Input/Output Streams" (reading and writing bytes, the complete stream zoo, combining filters); Ch. 2.5 "Working with Files" (Path, Files, directory entries)', 'Chương 2.1 "Input/Output Streams" (đọc ghi byte, toàn bộ các lớp luồng, ghép bộ lọc); Chương 2.5 "Working with Files" (Path, Files, mục thư mục)'],
      ['javaTutorial', 'trail "Basic I/O" — "I/O Streams" (Byte Streams: CopyBytes and xanadu.txt), "File I/O (Featuring NIO.2)" (Path, checking a file, listing a directory)', 'trail "Basic I/O" — "I/O Streams" (Byte Streams: CopyBytes và xanadu.txt), "File I/O (Featuring NIO.2)" (Path, kiểm tra file, liệt kê thư mục)'],
      ['apiDocs', 'java.io.File (list: "no guarantee … in any specific order"; mkdir, mkdirs, renameTo, createNewFile), java.io.FileInputStream, java.nio.file.Files, java.nio.file.Paths, java.lang.Character (MAX_CODE_POINT)', 'java.io.File (list: "không bảo đảm thứ tự"; mkdir, mkdirs, renameTo, createNewFile), java.io.FileInputStream, java.nio.file.Files, java.nio.file.Paths, java.lang.Character (MAX_CODE_POINT)'],
      ['fuOffline', 'part "Standard Input and Output" — I/O streams, standard streams System.in/out/err, Scanner', 'phần "Standard Input and Output" — luồng vào/ra, luồng chuẩn System.in/out/err, Scanner'],
    ]),
  ].join('\n'),
};

/* ───────── 9.B — 📑 Slide by slide · I/O Streams (2/3): text files, two case studies, UTF-8 (slides 12–34) ───────── */
const L_pro14_2 = {
  title: '9.B — 📑 Slide by slide · I/O Streams (2/3): text files, two case studies, UTF-8 (slides 12–34)|||9.B — 📑 Học theo từng slide · I/O Streams (2/3): file văn bản, hai case study, UTF-8 (slide 12–34)',
  slug: 'pro192-slide-pro14-2',
  type: 'VIDEO',
  description: 'Giảng slide 12–34 bộ "I/O Streams" của trường: cây Reader/Writer vẽ lại bằng UML, ba cách đọc file văn bản (read tới -1, readLine tới null, LineNumberReader) và tách dòng thành đối tượng kèm hai bẫy của file gõ tay, ghi bằng FileWriter/PrintWriter, cờ append, quên close để lại file 0 byte, write(65) ghi chữ A; case study 1 quản lý nhân viên chạy trọn vẹn (Menu, Employee, EmpList, nạp/lưu file, thêm/xoá/tăng lương/in) với các chỗ sửa: một Scanner duy nhất (đo lỗi NoSuchElementException khi có hai Scanner và dữ liệu đổ qua ống), try-with-resources, Comparable<Employee>, break; ngoại lệ checked của file trên JDK 8 thật; case study 2 ghi nối items.txt giữ mã không trùng; và vì sao tiếng Việt vỡ: FileReader/FileWriter dùng bảng mã mặc định (windows-1252 trên máy Windows tiếng Anh) — đo bằng hai JVM, sửa bằng InputStreamReader(…, "UTF-8"), hàm tạo Java 11 không có trên JDK 8.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.B · school deck "I/O Streams", slides 12–34</span>
<h2>Text files: the format you choose, the encoding you must name</h2>
<p class="lead">A text file is the format of LAB211 and of PE question 1: one record per line, fields separated by commas, readable in Notepad. Slides 12–34 teach the character streams (<code>Reader</code>/<code>Writer</code>), then two complete programs — an employee manager that loads and saves a whole file (case study 1) and an item list that only <em>appends</em> to its file (case study 2) — and end with the encoding problem that breaks Vietnamese text. The slides' code works, but it has bugs that bite exactly in an exam: several Scanners on one keyboard, files left open, a missing <code>break</code>, the default encoding. Each fix is marked ➕ and measured.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>12–15</td><td>Reader/Writer; reading and writing text</td><td>read a file line by line into objects and write it back, with append or overwrite</td></tr>
<tr><td>16–25</td><td>case study 1: employees.txt</td><td>build a LAB211-style manager that loads at start and saves on demand</td></tr>
<tr><td>26–33</td><td>case study 2: items.txt, append only</td><td>add to a file without reading the whole list, and keep codes unique</td></tr>
<tr><td>34</td><td>reading UTF-8</td><td>read and write Vietnamese correctly on JDK 8, whatever the machine's default</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.B · bộ slide "I/O Streams" của trường, slide 12–34</span>
<h2>File văn bản: định dạng do bạn chọn, bảng mã thì phải gọi tên</h2>
<p class="lead">File văn bản là định dạng của LAB211 và của câu 1 đề PE: mỗi dòng một bản ghi, các trường cách nhau bằng dấu phẩy, mở được bằng Notepad. Slide 12–34 dạy luồng ký tự (<code>Reader</code>/<code>Writer</code>), rồi hai chương trình hoàn chỉnh — quản lý nhân viên nạp và lưu cả file (case study 1) và danh sách mặt hàng chỉ <em>ghi nối</em> vào file (case study 2) — và kết thúc bằng vấn đề bảng mã làm vỡ chữ tiếng Việt. Code của slide chạy được, nhưng có những lỗi cắn đúng lúc đi thi: nhiều Scanner cho cùng một bàn phím, file mở mà không đóng, thiếu <code>break</code>, bảng mã mặc định. Mỗi chỗ sửa được đánh dấu ➕ và đo thật.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>12–15</td><td>Reader/Writer; đọc và ghi văn bản</td><td>đọc một file từng dòng thành đối tượng và ghi lại, kiểu ghi nối hoặc ghi đè</td></tr>
<tr><td>16–25</td><td>case study 1: employees.txt</td><td>dựng chương trình quản lý kiểu LAB211: nạp khi mở, lưu khi được yêu cầu</td></tr>
<tr><td>26–33</td><td>case study 2: items.txt, chỉ ghi nối</td><td>thêm vào file mà không phải đọc cả danh sách, và giữ mã không trùng</td></tr>
<tr><td>34</td><td>đọc UTF-8</td><td>đọc và ghi tiếng Việt đúng trên JDK 8, bất kể bảng mã mặc định của máy</td></tr>
</tbody>
</table>`),
    walkHead('pro14', 12, 34),
    walk('pro14', [
      [12, '4- Access Text Files',
        `<p class="y-chinh">🎯 Character streams: the two ultimate abstract classes are <strong><code>Reader</code></strong> and <strong><code>Writer</code></strong>. A <code>Reader</code> reads data from a source (device) into variables as UTF characters; a <code>Writer</code> writes UTF characters to a data source (device).</p>
<p>"UTF characters" here means Java <code>char</code>s (UTF-16 inside the JVM). The important word missing from the slide is <strong>encoding</strong>: the file holds <em>bytes</em>, so every character stream that touches a file must convert bytes ↔ chars with some encoding. The bridge classes are <code>InputStreamReader</code> (bytes → chars) and <code>OutputStreamWriter</code> (chars → bytes); <code>FileReader</code> and <code>FileWriter</code> are just those bridges with a file and the machine's <strong>default</strong> encoding built in (slide 34 shows why that matters).</p>
<table>
<thead><tr><th>Abstract class</th><th>Reads/writes</th><th>Most used subclasses</th></tr></thead>
<tbody>
<tr><td><code>Reader</code></td><td><code>int read()</code> — one char, -1 at the end</td><td><code>FileReader</code>, <code>BufferedReader</code> (<code>readLine()</code>), <code>InputStreamReader</code></td></tr>
<tr><td><code>Writer</code></td><td><code>write(int c)</code>, <code>write(String s)</code></td><td><code>FileWriter</code>, <code>PrintWriter</code> (<code>println</code>), <code>BufferedWriter</code>, <code>OutputStreamWriter</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 "Abstract" means you never write <code>new Reader()</code>: you create a concrete subclass and keep the variable as general as you need — exactly the "declare with the supertype" habit of Chapters 4–5 and 8.</p>`,
        `<p class="y-chinh">🎯 Luồng ký tự: hai lớp trừu tượng gốc là <strong><code>Reader</code></strong> và <strong><code>Writer</code></strong>. <code>Reader</code> đọc dữ liệu từ nguồn (thiết bị) vào biến dưới dạng ký tự UTF; <code>Writer</code> ghi ký tự UTF ra nguồn dữ liệu (thiết bị).</p>
<p>"Ký tự UTF" ở đây là <code>char</code> của Java (UTF-16 bên trong JVM). Chữ quan trọng mà slide thiếu là <strong>bảng mã</strong> (encoding): file chứa <em>byte</em>, nên mọi luồng ký tự chạm tới file đều phải đổi byte ↔ ký tự theo một bảng mã nào đó. Hai lớp cầu nối là <code>InputStreamReader</code> (byte → ký tự) và <code>OutputStreamWriter</code> (ký tự → byte); <code>FileReader</code> và <code>FileWriter</code> chỉ là hai cây cầu đó gắn sẵn một file và bảng mã <strong>mặc định</strong> của máy (slide 34 cho thấy vì sao điều đó quan trọng).</p>
<table>
<thead><tr><th>Lớp trừu tượng</th><th>Đọc/ghi</th><th>Lớp con hay dùng</th></tr></thead>
<tbody>
<tr><td><code>Reader</code></td><td><code>int read()</code> — một ký tự, -1 khi hết</td><td><code>FileReader</code>, <code>BufferedReader</code> (<code>readLine()</code>), <code>InputStreamReader</code></td></tr>
<tr><td><code>Writer</code></td><td><code>write(int c)</code>, <code>write(String s)</code></td><td><code>FileWriter</code>, <code>PrintWriter</code> (<code>println</code>), <code>BufferedWriter</code>, <code>OutputStreamWriter</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 "Trừu tượng" nghĩa là bạn không bao giờ viết <code>new Reader()</code>: bạn tạo một lớp con cụ thể và để biến ở kiểu tổng quát vừa đủ — đúng thói quen "khai báo bằng kiểu cha" của Chương 4–5 và 8.</p>`],
      [13, 'Access Text Files …Character Streams',
        `<p class="y-chinh">🎯 The class trees of <code>Reader</code> (BufferedReader → LineNumberReader, CharArrayReader, FilterReader → PushbackReader, InputStreamReader → FileReader, PipedReader, StringReader) and <code>Writer</code> (BufferedWriter, CharArrayWriter, FilterWriter, OutputStreamWriter → FileWriter, PipedWriter, PrintWriter, StringWriter), copied from the JDK 1.6 Javadoc.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/da11ca8a58a3354586fccc3786afb9edfe8fd87e.svg" alt="Slide 13 redrawn as UML: the classes PRO192 uses, with the methods that matter" loading="lazy" /><p class="chu-thich">🧩 Slide 13 redrawn as UML: the classes PRO192 uses, with the methods that matter</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 12–13 — the character-stream classes (java.io), redrawn as UML
abstract class Reader &lt;&lt;abstract&gt;&gt; {
  + read() : int
  + read(buf : char[]) : int
  + close() : void
}
abstract class Writer &lt;&lt;abstract&gt;&gt; {
  + write(c : int) : void
  + write(s : String) : void
  + flush() : void
  + close() : void
}
class BufferedReader {
  + readLine() : String
}
class LineNumberReader {
  + getLineNumber() : int
}
class InputStreamReader {
  + InputStreamReader(in : InputStream, charsetName : String)
}
class FileReader
class StringReader
class CharArrayReader
class BufferedWriter {
  + newLine() : void
}
class OutputStreamWriter {
  + OutputStreamWriter(out : OutputStream, charsetName : String)
}
class FileWriter {
  + FileWriter(name : String, append : boolean)
}
class PrintWriter {
  + print(x) : void
  + println(x) : void
  + printf(format, args...) : PrintWriter
}
class StringWriter
Reader &lt;|-- BufferedReader
BufferedReader &lt;|-- LineNumberReader
Reader &lt;|-- InputStreamReader
InputStreamReader &lt;|-- FileReader
Reader &lt;|-- StringReader
Reader &lt;|-- CharArrayReader
Writer &lt;|-- BufferedWriter
Writer &lt;|-- OutputStreamWriter
OutputStreamWriter &lt;|-- FileWriter
Writer &lt;|-- PrintWriter
Writer &lt;|-- StringWriter
note bottom of FileReader
  JDK 8: always the machine's DEFAULT encoding
  (no constructor with a charset before Java 11)
end note
@enduml</code></pre></details>
<p>The tree tells you two useful things. First, <strong><code>FileReader</code> IS-A <code>InputStreamReader</code></strong> and <strong><code>FileWriter</code> IS-A <code>OutputStreamWriter</code></strong> — so when you need a chosen encoding you use their parent directly. Second, <code>BufferedReader</code>, <code>PrintWriter</code> and <code>BufferedWriter</code> are <em>wrappers</em>: their constructor takes another <code>Reader</code>/<code>Writer</code> and adds features (a buffer, <code>readLine()</code>, <code>println()</code>). You stack them: <code>new BufferedReader(new FileReader("a.txt"))</code>.</p>
<p>The ones you can skip for PRO192: <code>Piped…</code> (between threads), <code>Pushback…</code> (parsers), <code>CharArray…</code>/<code>String…</code> (read/write a <code>String</code> as if it were a file — handy in tests).</p>
<div class="pitfall">FE: "Which class is the superclass of PrintWriter and FileWriter?" → <strong><code>Writer</code></strong> (FileWriter's direct parent is OutputStreamWriter, but both are Writers; <code>Object</code> is too general to be the intended answer). "Which class reads characters from a file?" → <code>FileReader</code> (and <code>BufferedReader</code> wrapping it). <code>FileInputStream</code> reads <em>bytes</em>.</div>`,
        `<p class="y-chinh">🎯 Cây lớp của <code>Reader</code> (BufferedReader → LineNumberReader, CharArrayReader, FilterReader → PushbackReader, InputStreamReader → FileReader, PipedReader, StringReader) và <code>Writer</code> (BufferedWriter, CharArrayWriter, FilterWriter, OutputStreamWriter → FileWriter, PipedWriter, PrintWriter, StringWriter), chép từ Javadoc JDK 1.6.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/da11ca8a58a3354586fccc3786afb9edfe8fd87e.svg" alt="Slide 13 vẽ lại bằng UML: các lớp PRO192 dùng, kèm những phương thức quan trọng" loading="lazy" /><p class="chu-thich">🧩 Slide 13 vẽ lại bằng UML: các lớp PRO192 dùng, kèm những phương thức quan trọng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 12–13 — the character-stream classes (java.io), redrawn as UML
abstract class Reader &lt;&lt;abstract&gt;&gt; {
  + read() : int
  + read(buf : char[]) : int
  + close() : void
}
abstract class Writer &lt;&lt;abstract&gt;&gt; {
  + write(c : int) : void
  + write(s : String) : void
  + flush() : void
  + close() : void
}
class BufferedReader {
  + readLine() : String
}
class LineNumberReader {
  + getLineNumber() : int
}
class InputStreamReader {
  + InputStreamReader(in : InputStream, charsetName : String)
}
class FileReader
class StringReader
class CharArrayReader
class BufferedWriter {
  + newLine() : void
}
class OutputStreamWriter {
  + OutputStreamWriter(out : OutputStream, charsetName : String)
}
class FileWriter {
  + FileWriter(name : String, append : boolean)
}
class PrintWriter {
  + print(x) : void
  + println(x) : void
  + printf(format, args...) : PrintWriter
}
class StringWriter
Reader &lt;|-- BufferedReader
BufferedReader &lt;|-- LineNumberReader
Reader &lt;|-- InputStreamReader
InputStreamReader &lt;|-- FileReader
Reader &lt;|-- StringReader
Reader &lt;|-- CharArrayReader
Writer &lt;|-- BufferedWriter
Writer &lt;|-- OutputStreamWriter
OutputStreamWriter &lt;|-- FileWriter
Writer &lt;|-- PrintWriter
Writer &lt;|-- StringWriter
note bottom of FileReader
  JDK 8: always the machine's DEFAULT encoding
  (no constructor with a charset before Java 11)
end note
@enduml</code></pre></details>
<p>Cây này cho bạn hai điều có ích. Một, <strong><code>FileReader</code> LÀ MỘT <code>InputStreamReader</code></strong> và <strong><code>FileWriter</code> LÀ MỘT <code>OutputStreamWriter</code></strong> — nên khi cần chọn bảng mã thì bạn dùng thẳng lớp cha của chúng. Hai, <code>BufferedReader</code>, <code>PrintWriter</code> và <code>BufferedWriter</code> là lớp <em>bọc</em> (wrapper): hàm tạo của chúng nhận một <code>Reader</code>/<code>Writer</code> khác và thêm tính năng (bộ đệm, <code>readLine()</code>, <code>println()</code>). Bạn xếp chồng chúng: <code>new BufferedReader(new FileReader("a.txt"))</code>.</p>
<p>Những lớp có thể bỏ qua ở PRO192: <code>Piped…</code> (giữa các luồng thực thi), <code>Pushback…</code> (bộ phân tích cú pháp), <code>CharArray…</code>/<code>String…</code> (đọc/ghi một <code>String</code> như thể nó là file — tiện khi kiểm thử).</p>
<div class="pitfall">FE: "Lớp nào là lớp cha của PrintWriter và FileWriter?" → <strong><code>Writer</code></strong> (cha trực tiếp của FileWriter là OutputStreamWriter, nhưng cả hai đều là Writer; <code>Object</code> quá chung để là đáp án đề muốn). "Lớp nào đọc ký tự từ file?" → <code>FileReader</code> (và <code>BufferedReader</code> bọc ngoài nó). <code>FileInputStream</code> đọc <em>byte</em>.</div>`],
      [14, 'Access Text Files … Reading Data',
        `<p class="y-chinh">🎯 Reading a text file: <code>File</code> (1) → <code>FileReader</code> (2) → either <code>read()</code> one <code>char</code> at a time (until <strong>-1</strong>), or wrap it in a <code>BufferedReader</code> and <code>readLine()</code> a <code>String</code> (until <strong>null</strong>), then <code>split</code> it into the fields of an object; a <code>LineNumberReader</code> also counts lines (<code>getLineNumber()</code>). "We must know the data format in the file."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fbba4dc01c475b2fff540d9753bf7b69ede180fd.svg" alt="Slides 14–15 redrawn: reading needs the format, writing designs it" loading="lazy" /><p class="chu-thich">🧩 Slides 14–15 redrawn: reading needs the format, writing designs it</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 14–15 — reading a text file into objects, and writing objects back as lines
left to right direction
package "READ (slide 14): we must KNOW the format" as R {
  database "employees.txt\\nE001,HOANG VAN TUAN,112" as F1 #FEF3C7
  rectangle "FileReader\\nread() → char, -1 at end" as FR #EEF2FF
  rectangle "BufferedReader\\nreadLine() → String, null at end" as BR #EEF2FF
  rectangle "split at each comma\\n+ trim() + Integer.parseInt" as SP #ECFDF5
  rectangle "new Employee(code, name, salary)\\nlist.add(...)" as O1 #ECFDF5
}
package "WRITE (slide 15): we DESIGN the format" as W {
  rectangle "for (Employee x : list)" as O2 #ECFDF5
  rectangle "code + ',' + name + ',' + salary" as CC #ECFDF5
  rectangle "PrintWriter\\nprintln(String)" as PW #EEF2FF
  rectangle "FileWriter(name[, append])\\nwrite(String)" as FW #EEF2FF
  database "employees.txt" as F2 #FEF3C7
}
F1 --&gt; FR
FR --&gt; BR
BR --&gt; SP
SP --&gt; O1
O2 --&gt; CC
CC --&gt; PW
PW --&gt; FW
FW --&gt; F2
@enduml</code></pre></details>
<p>The three ways, on the slide's own <code>employees.txt</code>:</p>
<pre class="trich"><code class="language-java">try (FileReader fr = new FileReader("employees.txt")) {     // (1) FileReader.read(): one char, -1 at the end
    int c, n = 0;
    StringBuilder first = new StringBuilder();
    while ((c = fr.read()) != -1) {
        if (c != '\\n' &amp;&amp; n &lt; 12) first.append((char) c);
        n++;
    }
    System.out.println("read(): " + n + " chars, the first 12 = " + first);
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;Employee&gt; list = new ArrayList&lt;Employee&gt;();
try (BufferedReader br = new BufferedReader(new FileReader("employees.txt"))) {   // (2) readLine(): one line, null at the end
    String line;
    while ((line = br.readLine()) != null) {               // the line comes WITHOUT its '\\n'
        String[] p = line.split(",");                      // we must know the format: code,name,salary
        list.add(new Employee(p[0], p[1], Integer.parseInt(p[2])));
    }
}
System.out.println("readLine() + split -&gt; " + list.size() + " objects: " + list);</code></pre>
<pre class="trich"><code class="language-java">try (LineNumberReader lnr = new LineNumberReader(new FileReader("employees.txt"))) {   // (3) a BufferedReader that counts lines
    String line;
    while ((line = lnr.readLine()) != null)
        System.out.println("  line " + lnr.getLineNumber() + ": " + line);
}</code></pre>
<p>Real files are typed by people, and two things go wrong with <code>split</code>:</p>
<pre class="trich"><code class="language-java">String typed = "E002, TRAN VAN LONG , 215";                // a space after each comma
String[] p = typed.split(",");
try {
    Integer.parseInt(p[2]);
} catch (NumberFormatException e) {
    System.out.println("parseInt(p[2]) -&gt; " + e);
}
System.out.println("fixed with trim(): [" + p[1].trim() + "] " + Integer.parseInt(p[2].trim()));
System.out.println("split(\\",\\") of \\"a,,b,\\" -&gt; " + Arrays.toString("a,,b,".split(",")) + "  (empty middle kept, empty end dropped)");
System.out.println("an empty last line: \\"\\".split(\\",\\").length = " + "".split(",").length + " -&gt; p[1] would throw ArrayIndexOutOfBoundsException; skip blank lines");
StringTokenizer stk = new StringTokenizer("a,,b,", ",");   // the slide's StringTokenizer skips empty fields
System.out.print("StringTokenizer -&gt; ");
while (stk.hasMoreTokens()) System.out.print("[" + stk.nextToken() + "] ");
System.out.println();</code></pre>
<div class="out">read(): 77 chars, the first 12 = E005,TRINH H<br>
readLine() + split -&gt; 3 objects: [E005 | TRINH HOANG UYEN NHU | 211, E001 | HOANG VAN TUAN | 112, E002 | TRAN VAN LONG | 215]<br>
&nbsp;&nbsp;line 1: E005,TRINH HOANG UYEN NHU,211<br>
&nbsp;&nbsp;line 2: E001,HOANG VAN TUAN,112<br>
&nbsp;&nbsp;line 3: E002,TRAN VAN LONG,215<br>
== two traps of hand-typed files ==<br>
parseInt(p[2]) -&gt; java.lang.NumberFormatException: For input string: " 215"<br>
fixed with trim(): [TRAN VAN LONG] 215<br>
split(",") of "a,,b," -&gt; [a, , b] &nbsp;(empty middle kept, empty end dropped)<br>
an empty last line: "".split(",").length = 1 -&gt; p[1] would throw ArrayIndexOutOfBoundsException; skip blank lines<br>
StringTokenizer -&gt; [a] [b]</div>
<p>Read the output: <code>read()</code> saw 77 characters (newlines included); <code>readLine()</code> gives each line <em>without</em> its newline, ready for <code>split(",")</code>. A space after the comma makes <code>parseInt(" 215")</code> throw — always <code>trim()</code> each field. An empty last line splits into <em>one</em> empty field, so <code>p[1]</code> would throw — skip blank lines. The slide's <code>StringTokenizer</code> quietly skips empty fields, which hides a missing value instead of reporting it.</p>
<div class="pitfall">FE (FE4, FE10): a file holds "Hello / Xin chao / Hallo / Anyong Haseyo", a loop calls <code>readLine()</code> k = 2 times and prints the last one → <strong>"Xin chao"</strong> (each call returns the NEXT line). And the end test is <code>!= null</code> for <code>readLine()</code> but <code>!= -1</code> for <code>read()</code> — swapping them is a compile error (an <code>int</code> cannot be compared with <code>null</code>).</div>`,
        `<p class="y-chinh">🎯 Đọc file văn bản: <code>File</code> (1) → <code>FileReader</code> (2) → hoặc <code>read()</code> từng <code>char</code> (tới khi gặp <strong>-1</strong>), hoặc bọc trong <code>BufferedReader</code> rồi <code>readLine()</code> từng <code>String</code> (tới khi gặp <strong>null</strong>), rồi <code>split</code> thành các trường của một đối tượng; <code>LineNumberReader</code> còn đếm dòng (<code>getLineNumber()</code>). "Ta phải biết định dạng dữ liệu trong file."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fbba4dc01c475b2fff540d9753bf7b69ede180fd.svg" alt="Slide 14–15 vẽ lại: đọc thì cần biết định dạng, ghi thì tự thiết kế định dạng" loading="lazy" /><p class="chu-thich">🧩 Slide 14–15 vẽ lại: đọc thì cần biết định dạng, ghi thì tự thiết kế định dạng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 14–15 — reading a text file into objects, and writing objects back as lines
left to right direction
package "READ (slide 14): we must KNOW the format" as R {
  database "employees.txt\\nE001,HOANG VAN TUAN,112" as F1 #FEF3C7
  rectangle "FileReader\\nread() → char, -1 at end" as FR #EEF2FF
  rectangle "BufferedReader\\nreadLine() → String, null at end" as BR #EEF2FF
  rectangle "split at each comma\\n+ trim() + Integer.parseInt" as SP #ECFDF5
  rectangle "new Employee(code, name, salary)\\nlist.add(...)" as O1 #ECFDF5
}
package "WRITE (slide 15): we DESIGN the format" as W {
  rectangle "for (Employee x : list)" as O2 #ECFDF5
  rectangle "code + ',' + name + ',' + salary" as CC #ECFDF5
  rectangle "PrintWriter\\nprintln(String)" as PW #EEF2FF
  rectangle "FileWriter(name[, append])\\nwrite(String)" as FW #EEF2FF
  database "employees.txt" as F2 #FEF3C7
}
F1 --&gt; FR
FR --&gt; BR
BR --&gt; SP
SP --&gt; O1
O2 --&gt; CC
CC --&gt; PW
PW --&gt; FW
FW --&gt; F2
@enduml</code></pre></details>
<p>Ba cách, trên chính file <code>employees.txt</code> của slide:</p>
<pre class="trich"><code class="language-java">try (FileReader fr = new FileReader("employees.txt")) {     // một ký tự, -1 khi hết
    int c, n = 0;
    StringBuilder first = new StringBuilder();
    while ((c = fr.read()) != -1) {
        if (c != '\\n' &amp;&amp; n &lt; 12) first.append((char) c);
        n++;
    }
    System.out.println("read(): " + n + " chars, the first 12 = " + first);
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;Employee&gt; list = new ArrayList&lt;Employee&gt;();
try (BufferedReader br = new BufferedReader(new FileReader("employees.txt"))) {   // một dòng, null khi hết
    String line;
    while ((line = br.readLine()) != null) {               // dòng trả về KHÔNG kèm '\\n'
        String[] p = line.split(",");                      // phải biết định dạng: mã,tên,lương
        list.add(new Employee(p[0], p[1], Integer.parseInt(p[2])));
    }
}
System.out.println("readLine() + split -&gt; " + list.size() + " objects: " + list);</code></pre>
<pre class="trich"><code class="language-java">try (LineNumberReader lnr = new LineNumberReader(new FileReader("employees.txt"))) {   // một BufferedReader biết đếm dòng
    String line;
    while ((line = lnr.readLine()) != null)
        System.out.println("  line " + lnr.getLineNumber() + ": " + line);
}</code></pre>
<p>File thật do người gõ, và <code>split</code> gặp hai rắc rối:</p>
<pre class="trich"><code class="language-java">String typed = "E002, TRAN VAN LONG , 215";                // có dấu cách sau mỗi dấu phẩy
String[] p = typed.split(",");
try {
    Integer.parseInt(p[2]);
} catch (NumberFormatException e) {
    System.out.println("parseInt(p[2]) -&gt; " + e);
}
System.out.println("fixed with trim(): [" + p[1].trim() + "] " + Integer.parseInt(p[2].trim()));
System.out.println("split(\\",\\") of \\"a,,b,\\" -&gt; " + Arrays.toString("a,,b,".split(",")) + "  (empty middle kept, empty end dropped)");
System.out.println("an empty last line: \\"\\".split(\\",\\").length = " + "".split(",").length + " -&gt; p[1] would throw ArrayIndexOutOfBoundsException; skip blank lines");
StringTokenizer stk = new StringTokenizer("a,,b,", ",");   // StringTokenizer của slide bỏ qua trường rỗng
System.out.print("StringTokenizer -&gt; ");
while (stk.hasMoreTokens()) System.out.print("[" + stk.nextToken() + "] ");
System.out.println();</code></pre>
<div class="out">read(): 77 chars, the first 12 = E005,TRINH H<br>
readLine() + split -&gt; 3 objects: [E005 | TRINH HOANG UYEN NHU | 211, E001 | HOANG VAN TUAN | 112, E002 | TRAN VAN LONG | 215]<br>
&nbsp;&nbsp;line 1: E005,TRINH HOANG UYEN NHU,211<br>
&nbsp;&nbsp;line 2: E001,HOANG VAN TUAN,112<br>
&nbsp;&nbsp;line 3: E002,TRAN VAN LONG,215<br>
== two traps of hand-typed files ==<br>
parseInt(p[2]) -&gt; java.lang.NumberFormatException: For input string: " 215"<br>
fixed with trim(): [TRAN VAN LONG] 215<br>
split(",") of "a,,b," -&gt; [a, , b] &nbsp;(empty middle kept, empty end dropped)<br>
an empty last line: "".split(",").length = 1 -&gt; p[1] would throw ArrayIndexOutOfBoundsException; skip blank lines<br>
StringTokenizer -&gt; [a] [b]</div>
<p>Đọc output: <code>read()</code> thấy 77 ký tự (tính cả xuống dòng); <code>readLine()</code> trả mỗi dòng <em>không kèm</em> ký tự xuống dòng, sẵn sàng cho <code>split(",")</code>. Một dấu cách sau dấu phẩy làm <code>parseInt(" 215")</code> ném lỗi — luôn <code>trim()</code> từng trường. Một dòng trống ở cuối tách ra <em>một</em> trường rỗng, nên <code>p[1]</code> sẽ ném lỗi — hãy bỏ qua dòng trống. <code>StringTokenizer</code> của slide lặng lẽ bỏ qua trường rỗng, tức là giấu một giá trị bị thiếu thay vì báo ra.</p>
<div class="pitfall">FE (FE4, FE10): file chứa "Hello / Xin chao / Hallo / Anyong Haseyo", vòng lặp gọi <code>readLine()</code> k = 2 lần rồi in dòng cuối → <strong>"Xin chao"</strong> (mỗi lần gọi trả dòng KẾ TIẾP). Và điều kiện dừng là <code>!= null</code> với <code>readLine()</code> nhưng <code>!= -1</code> với <code>read()</code> — tráo hai cái là lỗi biên dịch (không so <code>int</code> với <code>null</code> được).</div>`],
      [15, 'Access Text Files … Writing Data',
        `<p class="y-chinh">🎯 Writing a text file: variables (<code>char</code>, <code>String</code>, the fields of an object concatenated into a string) → <code>FileWriter</code> (<code>write()</code>) or a <code>PrintWriter</code> on top (<code>print()</code>, <code>println()</code>) → the file. "We must design the data format in the file." Five constructors: <code>FileWriter(File)</code>, <code>FileWriter(File, boolean append)</code>, <code>FileWriter(FileDescriptor)</code>, <code>FileWriter(String)</code>, <code>FileWriter(String, boolean append)</code>.</p>
<p>Writing, then the <code>append</code> flag, run three times each way:</p>
<pre class="trich"><code class="language-java">try (PrintWriter pw = new PrintWriter(new FileWriter("emp.txt"))) {   // FileWriter: write(); PrintWriter on top: print/println
    String code = "E005", name = "TRINH HOANG UYEN NHU";
    int salary = 211;
    pw.println(code + "," + name + "," + salary);                    // we DESIGN the format: concatenate with ","
    pw.printf("%s,%s,%d%n", "E001", "HOANG VAN TUAN", 112);           // ➕ printf works too
}
System.out.print(docHet("emp.txt"));</code></pre>
<pre class="trich"><code class="language-java">new FileWriter("log.txt").close();                                   // FileWriter(name): creates OR EMPTIES the file
for (int run = 1; run &lt;= 3; run++) {
    try (FileWriter fw = new FileWriter("log.txt")) { fw.write("run " + run + "\\n"); }
}
System.out.println("FileWriter(name) x3            -&gt; " + docHet("log.txt").replace("\\n", " | "));
for (int run = 1; run &lt;= 3; run++) {
    try (FileWriter fw = new FileWriter("log.txt", true)) { fw.write("run " + run + "\\n"); }   // append = true: add at the end
}
System.out.println("then FileWriter(name, true) x3 -&gt; " + docHet("log.txt").replace("\\n", " | "));</code></pre>
<p>And the two bugs that cost marks — a forgotten <code>close()</code>, and <code>write(int)</code>:</p>
<pre class="trich"><code class="language-java">PrintWriter forgot = new PrintWriter(new FileWriter("quen.txt"));
forgot.println("E002,TRAN VAN LONG,215");
System.out.println("before close(): quen.txt has " + new File("quen.txt").length() + " bytes   &lt;- still in the buffer");
forgot.close();                                                       // close() = flush() + release the file
System.out.println("after close():  quen.txt has " + new File("quen.txt").length() + " bytes");</code></pre>
<pre class="trich"><code class="language-java">try (FileWriter fw = new FileWriter("so.txt")) {
    fw.write(65);                                                     // write(int) writes the CHARACTER with code 65
    fw.write(" ");
    fw.write(String.valueOf(65));                                     // to write the digits, write a String
}
System.out.println("fw.write(65) then fw.write(\\"65\\") -&gt; [" + docHet("so.txt").trim() + "]");</code></pre>
<div class="out">E005,TRINH HOANG UYEN NHU,211<br>
E001,HOANG VAN TUAN,112<br>
FileWriter(name) x3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; run 3 |<br>
then FileWriter(name, true) x3 -&gt; run 3 | run 1 | run 2 | run 3 |<br>
before close(): quen.txt has 0 bytes &nbsp;&nbsp;&lt;- still in the buffer<br>
after close(): &nbsp;quen.txt has 23 bytes<br>
fw.write(65) then fw.write("65") -&gt; [A 65]</div>
<ul>
<li><code>FileWriter(name)</code> <strong>empties</strong> the file each time: after three runs only "run 3" is left. With <code>append = true</code> the three new lines go after it.</li>
<li>Before <code>close()</code> the file had <strong>0 bytes</strong>: the text waited in the writer's buffer (FileWriter keeps 8 KB in memory). <code>close()</code> flushes then releases the file. A program that ends without closing — or crashes first — leaves an empty file. <code>try ( … )</code> makes that impossible.</li>
<li><code>fw.write(65)</code> wrote the <strong>character</strong> with code 65, 'A'. To write the number, write a <code>String</code>: <code>fw.write(String.valueOf(x))</code> or <code>pw.print(x)</code>.</li>
</ul>
<div class="pitfall">➕ Two silent behaviours: <code>PrintWriter</code> never throws <code>IOException</code> — it swallows errors and you must ask <code>pw.checkError()</code>; and <code>println</code> ends lines with the system separator — <code>\\r\\n</code> on Windows, <code>\\n</code> on Linux/macOS — so a file written on the lab PC is 1 byte longer per line. FE (FE1, FE8): "How do you add content to an existing text file?" → set <strong><code>append</code> to true in the constructor of <code>FileWriter</code></strong> (not of <code>File</code>).</div>`,
        `<p class="y-chinh">🎯 Ghi file văn bản: các biến (<code>char</code>, <code>String</code>, các trường của đối tượng nối thành chuỗi) → <code>FileWriter</code> (<code>write()</code>) hoặc một <code>PrintWriter</code> bọc ngoài (<code>print()</code>, <code>println()</code>) → file. "Ta phải thiết kế định dạng dữ liệu trong file." Năm hàm tạo: <code>FileWriter(File)</code>, <code>FileWriter(File, boolean append)</code>, <code>FileWriter(FileDescriptor)</code>, <code>FileWriter(String)</code>, <code>FileWriter(String, boolean append)</code>.</p>
<p>Ghi, rồi thử cờ <code>append</code>, mỗi kiểu chạy ba lần:</p>
<pre class="trich"><code class="language-java">try (PrintWriter pw = new PrintWriter(new FileWriter("emp.txt"))) {   // FileWriter: write(); PrintWriter bọc ngoài: print/println
    String code = "E005", name = "TRINH HOANG UYEN NHU";
    int salary = 211;
    pw.println(code + "," + name + "," + salary);                    // ta THIẾT KẾ định dạng: nối bằng ","
    pw.printf("%s,%s,%d%n", "E001", "HOANG VAN TUAN", 112);           // ➕ printf cũng dùng được
}
System.out.print(docHet("emp.txt"));</code></pre>
<pre class="trich"><code class="language-java">new FileWriter("log.txt").close();                                   // tạo mới HOẶC LÀM RỖNG file
for (int run = 1; run &lt;= 3; run++) {
    try (FileWriter fw = new FileWriter("log.txt")) { fw.write("run " + run + "\\n"); }
}
System.out.println("FileWriter(name) x3            -&gt; " + docHet("log.txt").replace("\\n", " | "));
for (int run = 1; run &lt;= 3; run++) {
    try (FileWriter fw = new FileWriter("log.txt", true)) { fw.write("run " + run + "\\n"); }   // append = true: thêm vào cuối
}
System.out.println("then FileWriter(name, true) x3 -&gt; " + docHet("log.txt").replace("\\n", " | "));</code></pre>
<p>Và hai lỗi làm mất điểm — quên <code>close()</code>, và <code>write(int)</code>:</p>
<pre class="trich"><code class="language-java">PrintWriter forgot = new PrintWriter(new FileWriter("quen.txt"));
forgot.println("E002,TRAN VAN LONG,215");
System.out.println("before close(): quen.txt has " + new File("quen.txt").length() + " bytes   &lt;- still in the buffer");
forgot.close();                                                       // close() = flush() + nhả file
System.out.println("after close():  quen.txt has " + new File("quen.txt").length() + " bytes");</code></pre>
<pre class="trich"><code class="language-java">try (FileWriter fw = new FileWriter("so.txt")) {
    fw.write(65);                                                     // write(int) ghi KÝ TỰ có mã 65
    fw.write(" ");
    fw.write(String.valueOf(65));                                     // muốn ghi chữ số thì ghi String
}
System.out.println("fw.write(65) then fw.write(\\"65\\") -&gt; [" + docHet("so.txt").trim() + "]");</code></pre>
<div class="out">E005,TRINH HOANG UYEN NHU,211<br>
E001,HOANG VAN TUAN,112<br>
FileWriter(name) x3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; run 3 |<br>
then FileWriter(name, true) x3 -&gt; run 3 | run 1 | run 2 | run 3 |<br>
before close(): quen.txt has 0 bytes &nbsp;&nbsp;&lt;- still in the buffer<br>
after close(): &nbsp;quen.txt has 23 bytes<br>
fw.write(65) then fw.write("65") -&gt; [A 65]</div>
<ul>
<li><code>FileWriter(name)</code> <strong>làm rỗng</strong> file mỗi lần mở: sau ba lần chạy chỉ còn "run 3". Với <code>append = true</code> ba dòng mới được nối vào sau nó.</li>
<li>Trước <code>close()</code> file có <strong>0 byte</strong>: chữ còn nằm chờ trong bộ đệm của writer (FileWriter giữ 8 KB trong bộ nhớ). <code>close()</code> đẩy bộ đệm xuống (flush) rồi nhả file. Chương trình kết thúc mà không đóng — hoặc sập trước khi đóng — để lại file rỗng. <code>try ( … )</code> làm điều đó không thể xảy ra.</li>
<li><code>fw.write(65)</code> ghi <strong>ký tự</strong> có mã 65, tức 'A'. Muốn ghi con số thì ghi <code>String</code>: <code>fw.write(String.valueOf(x))</code> hoặc <code>pw.print(x)</code>.</li>
</ul>
<div class="pitfall">➕ Hai hành vi im lặng: <code>PrintWriter</code> không bao giờ ném <code>IOException</code> — nó nuốt lỗi và bạn phải hỏi <code>pw.checkError()</code>; và <code>println</code> kết thúc dòng bằng ký tự xuống dòng của hệ thống — <code>\\r\\n</code> trên Windows, <code>\\n</code> trên Linux/macOS — nên file ghi trên máy phòng lab dài hơn 1 byte mỗi dòng. FE (FE1, FE8): "Làm sao ghi thêm nội dung vào file văn bản đã có?" → đặt <strong><code>append</code> = true trong hàm tạo của <code>FileWriter</code></strong> (không phải của <code>File</code>).</div>`],
      [16, 'Access Text Files … Case study 1',
        `<p class="y-chinh">🎯 Problem: each employee has a code, a name and a salary. The text file <code>employees.txt</code> holds the initial employees, one per line, as <code>code,name,salary</code>. Write a program with a simple menu: add a new employee, remove an employee, promote the salary of an employee, list the employees, save the list to the file, quit.</p>
<p>This is the exact shape of a LAB211 assignment and of the FU offline "managing program" demonstrations, with one new part — persistence:</p>
<ol>
<li><strong>At start</strong>: read the file into a list of objects (if the file exists).</li>
<li><strong>While running</strong>: work only on the list in memory (add, remove, update, print).</li>
<li><strong>On "Save"</strong> (or on "Quit" after a confirmation): write the whole list back, replacing the old content.</li>
</ol>
<p>The format is the contract between step 1 and step 3: <code>E001,HOANG VAN TUAN,112</code> — the code is "E" and 3 digits, the name is stored in upper case, the salary is an integer. A comma inside a name would break it; LAB211 checks such input before it reaches the file.</p>
<p class="meo">🧠 Before you code, write the format on paper and one sample line. Every bug in slides 18–25 is easier to see once you know what the file must look like.</p>`,
        `<p class="y-chinh">🎯 Bài toán: mỗi nhân viên có mã, tên và lương. File văn bản <code>employees.txt</code> chứa các nhân viên ban đầu, mỗi dòng một người, dạng <code>mã,tên,lương</code>. Viết chương trình có menu đơn giản: thêm nhân viên mới, xoá nhân viên, tăng lương một nhân viên, liệt kê nhân viên, lưu danh sách ra file, thoát.</p>
<p>Đây đúng hình dạng một bài LAB211 và các demo "managing program" của học liệu offline FU, thêm một phần mới — lưu bền (persistence):</p>
<ol>
<li><strong>Lúc mở</strong>: đọc file thành danh sách đối tượng (nếu file đã có).</li>
<li><strong>Trong lúc chạy</strong>: chỉ làm việc trên danh sách trong bộ nhớ (thêm, xoá, sửa, in).</li>
<li><strong>Khi chọn "Save"</strong> (hoặc "Quit" sau khi hỏi lại): ghi cả danh sách ra, thay nội dung cũ.</li>
</ol>
<p>Định dạng là hợp đồng giữa bước 1 và bước 3: <code>E001,HOANG VAN TUAN,112</code> — mã là "E" và 3 chữ số, tên lưu chữ hoa, lương là số nguyên. Một dấu phẩy nằm trong tên sẽ làm hỏng định dạng; LAB211 kiểm tra dữ liệu nhập trước khi nó tới file.</p>
<p class="meo">🧠 Trước khi code, viết định dạng ra giấy kèm một dòng mẫu. Mọi lỗi ở slide 18–25 dễ thấy hơn hẳn khi bạn biết file phải trông thế nào.</p>`],
      [17, 'Access Text Files …: Case study 1- Design',
        `<p class="y-chinh">🎯 The design, as NetBeans shows it: project Chapter09 with <code>employees.txt</code> in the project folder; package <code>employees</code> with <code>Menu</code> (extends <code>Vector&lt;String&gt;</code>: <code>addMenuItem</code>, <code>getUserChoice</code>), <code>Employee</code> (implements <code>Comparable</code>: code, name, salary, getters/setters, <code>print</code>, <code>compareTo</code>), <code>EmpList</code> (extends <code>Vector&lt;Employee&gt;</code>: <code>AddFromFile</code>, <code>addNewEmp</code>, <code>find</code>, <code>print</code>, <code>promote</code>, <code>removeEmp</code>, <code>saveToFile</code>, and a <code>Scanner sc</code>), <code>ManageProgram</code> (<code>main</code>); the Output window shows the menu and an employee list sorted by code.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/be0dc2151250e8324d4b37c7b7133a4e69400e7c.svg" alt="Slide 17 redrawn as a UML class diagram (the Scanner field of EmpList left out on purpose — see slide 24)" loading="lazy" /><p class="chu-thich">🧩 Slide 17 redrawn as a UML class diagram (the Scanner field of EmpList left out on purpose — see slide 24)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 17 — case study 1: the classes of the employee manager (package employees)
class "Vector&lt;String&gt;" as VS
class "Vector&lt;Employee&gt;" as VE
interface "Comparable&lt;Employee&gt;" as Cmp
class Menu {
  + Menu()
  + addMenuItem(s : String) : void
  + getUserChoice() : int
}
class Employee {
  - code : String
  - name : String
  - salary : int
  + Employee(c : String, n : String, s : int)
  + print() : void
  + getCode() : String
  + getName() : String
  + getSalary() : int
  + setSalary(salary : int) : void
  + compareTo(emp : Employee) : int
}
class EmpList {
  + EmpList()
  + addFromFile(fName : String) : void
  + saveToFile(fName : String) : void
  - find(aCode : String) : int
  + addNewEmp() : void
  + removeEmp() : void
  + promote() : void
  + print() : void
}
class ManageProgram {
  + {static} main(args : String[]) : void
}
database "employees.txt\\ncode,name,salary\\n(one employee per line)" as F #FEF3C7
VS &lt;|-- Menu
VE &lt;|-- EmpList
Cmp &lt;|.. Employee
EmpList o-- "*" Employee
ManageProgram ..&gt; Menu : creates
ManageProgram ..&gt; EmpList : creates
EmpList ..&gt; F : addFromFile / saveToFile
@enduml</code></pre></details>
<p>Where the file lives matters: NetBeans runs your program with the <strong>project folder</strong> as the current folder, so <code>new File("employees.txt")</code> means <code>Chapter09/employees.txt</code> — next to <code>build</code>, <code>src</code>, <code>nbproject</code>, as in the screenshot — not inside <code>src</code>. Run the same <code>.jar</code> from another folder and the file is "not found".</p>
<p>Design notes: <code>Menu</code> and <code>EmpList</code> <em>extend</em> <code>Vector</code> (inheritance: "a menu is a list of strings"). It works and keeps the code short, but it also exposes every <code>Vector</code> method (anyone can call <code>list.clear()</code>). ➕ Today's choice is composition — a class that <em>has</em> a <code>private List&lt;Employee&gt;</code> — and <code>ArrayList</code> instead of the legacy <code>Vector</code> (lesson 8.A). The runnable version below keeps the slides' design so you can follow the screenshots line by line.</p>`,
        `<p class="y-chinh">🎯 Thiết kế, như NetBeans hiển thị: project Chapter09 với <code>employees.txt</code> nằm trong thư mục project; gói <code>employees</code> gồm <code>Menu</code> (extends <code>Vector&lt;String&gt;</code>: <code>addMenuItem</code>, <code>getUserChoice</code>), <code>Employee</code> (implements <code>Comparable</code>: mã, tên, lương, getter/setter, <code>print</code>, <code>compareTo</code>), <code>EmpList</code> (extends <code>Vector&lt;Employee&gt;</code>: <code>AddFromFile</code>, <code>addNewEmp</code>, <code>find</code>, <code>print</code>, <code>promote</code>, <code>removeEmp</code>, <code>saveToFile</code>, và một <code>Scanner sc</code>), <code>ManageProgram</code> (<code>main</code>); cửa sổ Output cho thấy menu và danh sách nhân viên sắp theo mã.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/be0dc2151250e8324d4b37c7b7133a4e69400e7c.svg" alt="Slide 17 vẽ lại thành sơ đồ lớp UML (cố ý bỏ trường Scanner của EmpList — xem slide 24)" loading="lazy" /><p class="chu-thich">🧩 Slide 17 vẽ lại thành sơ đồ lớp UML (cố ý bỏ trường Scanner của EmpList — xem slide 24)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 17 — case study 1: the classes of the employee manager (package employees)
class "Vector&lt;String&gt;" as VS
class "Vector&lt;Employee&gt;" as VE
interface "Comparable&lt;Employee&gt;" as Cmp
class Menu {
  + Menu()
  + addMenuItem(s : String) : void
  + getUserChoice() : int
}
class Employee {
  - code : String
  - name : String
  - salary : int
  + Employee(c : String, n : String, s : int)
  + print() : void
  + getCode() : String
  + getName() : String
  + getSalary() : int
  + setSalary(salary : int) : void
  + compareTo(emp : Employee) : int
}
class EmpList {
  + EmpList()
  + addFromFile(fName : String) : void
  + saveToFile(fName : String) : void
  - find(aCode : String) : int
  + addNewEmp() : void
  + removeEmp() : void
  + promote() : void
  + print() : void
}
class ManageProgram {
  + {static} main(args : String[]) : void
}
database "employees.txt\\ncode,name,salary\\n(one employee per line)" as F #FEF3C7
VS &lt;|-- Menu
VE &lt;|-- EmpList
Cmp &lt;|.. Employee
EmpList o-- "*" Employee
ManageProgram ..&gt; Menu : creates
ManageProgram ..&gt; EmpList : creates
EmpList ..&gt; F : addFromFile / saveToFile
@enduml</code></pre></details>
<p>File nằm ở đâu là chuyện quan trọng: NetBeans chạy chương trình với <strong>thư mục project</strong> làm thư mục hiện tại, nên <code>new File("employees.txt")</code> nghĩa là <code>Chapter09/employees.txt</code> — cạnh <code>build</code>, <code>src</code>, <code>nbproject</code>, như trong ảnh — chứ không phải trong <code>src</code>. Chạy cùng file <code>.jar</code> từ thư mục khác là "không tìm thấy file".</p>
<p>Ghi chú thiết kế: <code>Menu</code> và <code>EmpList</code> <em>kế thừa</em> <code>Vector</code> ("menu là một danh sách chuỗi"). Cách này chạy được và code ngắn, nhưng nó phơi ra mọi phương thức của <code>Vector</code> (ai cũng gọi được <code>list.clear()</code>). ➕ Lựa chọn hiện nay là kết hợp (composition) — một lớp <em>có</em> một <code>private List&lt;Employee&gt;</code> — và <code>ArrayList</code> thay cho <code>Vector</code> đời cũ (bài 8.A). Bản chạy được bên dưới giữ thiết kế của slide để bạn dò theo ảnh chụp từng dòng.</p>`],
      [18, 'Access Text Files …: Case study 1- Implementations',
        `<p class="y-chinh">🎯 Two classes: <code>Menu extends Vector&lt;String&gt;</code> with <code>addMenuItem(S)</code> and <code>getUserChoice()</code> ("DO YOURSELF — refer to the older case study"), and <code>Employee implements Comparable</code> with private code/name/salary, a constructor, <code>print()</code>, getters/setters (DO YOURSELF) and <code>compareTo(Object emp)</code> comparing the codes "for sorting".</p>
<p>The runnable version (one file, so the classes are not <code>public</code>; the whole program is under slide 25):</p>
<pre class="trich"><code class="language-java">class Menu extends Vector&lt;String&gt; {                              // slide 18: a menu IS a list of strings
    void addMenuItem(String s) { add(s); }
    int getUserChoice() {                                         // "Refer to the older case study" — written out here
        for (int i = 0; i &lt; size(); i++) System.out.print((i + 1) + "-" + get(i) + (i % 3 == 2 ? "\\n" : "   "));   // 3 items per line, to keep the transcript short
        while (true) {
            try {
                int c = Integer.parseInt(Nhap.dong("Select 1.." + size() + ": ").trim());
                if (c &gt;= 1 &amp;&amp; c &lt;= size()) return c;
            } catch (NumberFormatException e) {
                // not a number: ask again
            }
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Employee implements Comparable&lt;Employee&gt; {                 // ➕ Comparable&lt;Employee&gt;, not the raw Comparable of the slide
    private String code;
    private String name;
    private int salary;
    public Employee(String c, String n, int s) { code = c; name = n; salary = s; }
    public void print() { System.out.printf("%-8s%-25s%5d%n", code, name, salary); }
    public String getCode() { return code; }
    public String getName() { return name; }
    public int getSalary() { return salary; }
    public void setSalary(int salary) { this.salary = salary; }
    @Override
    public int compareTo(Employee emp) { return code.compareTo(emp.code); }   // sort by code
}</code></pre>
<p>Two changes from the slide. <strong>(1)</strong> <code>Employee</code> implements <code>Comparable&lt;Employee&gt;</code> and <code>compareTo(Employee emp)</code>: the slide's raw <code>Comparable</code> with <code>compareTo(Object emp)</code> and a cast compiles with an "unchecked" note and throws <code>ClassCastException</code> if anything else ever gets compared (lesson 8.B). <strong>(2)</strong> <code>getUserChoice</code> reads through a shared helper <code>Nhap</code> instead of its own <code>Scanner</code> — slide 24 shows why.</p>
<pre class="trich"><code class="language-java">class Nhap {                                                      // ➕ ONE Scanner for the whole program
    static final Scanner SC = new Scanner(System.in);
    static String dong(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine();
        System.out.println(s);                                    // echo what was read, so this transcript looks like the console
        return s;
    }
}</code></pre>
<p class="meo">🧠 <code>Nhap.dong</code> also prints back the line it read. When you type, the console shows your typing anyway; when input is piped (as the program is run here, and as a PE grader runs yours) nothing would appear — the echo keeps the transcript readable. Do not echo in a PE solution unless the paper asks.</p>`,
        `<p class="y-chinh">🎯 Hai lớp: <code>Menu extends Vector&lt;String&gt;</code> có <code>addMenuItem(S)</code> và <code>getUserChoice()</code> ("DO YOURSELF — xem case study cũ"), và <code>Employee implements Comparable</code> có mã/tên/lương private, hàm tạo, <code>print()</code>, getter/setter (DO YOURSELF) và <code>compareTo(Object emp)</code> so sánh mã "để sắp xếp".</p>
<p>Bản chạy được (một file, nên các lớp không <code>public</code>; toàn bộ chương trình ở slide 25):</p>
<pre class="trich"><code class="language-java">class Menu extends Vector&lt;String&gt; {                              // slide 18: menu LÀ một danh sách chuỗi
    void addMenuItem(String s) { add(s); }
    int getUserChoice() {                                         // "xem case study cũ" — viết ra đây
        for (int i = 0; i &lt; size(); i++) System.out.print((i + 1) + "-" + get(i) + (i % 3 == 2 ? "\\n" : "   "));   // 3 mục một dòng cho bản ghi ngắn
        while (true) {
            try {
                int c = Integer.parseInt(Nhap.dong("Select 1.." + size() + ": ").trim());
                if (c &gt;= 1 &amp;&amp; c &lt;= size()) return c;
            } catch (NumberFormatException e) {
                // không phải số: hỏi lại
            }
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Employee implements Comparable&lt;Employee&gt; {                 // ➕ Comparable&lt;Employee&gt;, không phải Comparable thô của slide
    private String code;
    private String name;
    private int salary;
    public Employee(String c, String n, int s) { code = c; name = n; salary = s; }
    public void print() { System.out.printf("%-8s%-25s%5d%n", code, name, salary); }
    public String getCode() { return code; }
    public String getName() { return name; }
    public int getSalary() { return salary; }
    public void setSalary(int salary) { this.salary = salary; }
    @Override
    public int compareTo(Employee emp) { return code.compareTo(emp.code); }   // sắp theo mã
}</code></pre>
<p>Hai chỗ đổi so với slide. <strong>(1)</strong> <code>Employee</code> hiện thực <code>Comparable&lt;Employee&gt;</code> và <code>compareTo(Employee emp)</code>: <code>Comparable</code> thô của slide với <code>compareTo(Object emp)</code> và phép ép kiểu biên dịch kèm ghi chú "unchecked" và ném <code>ClassCastException</code> nếu có thứ khác bị đem ra so (bài 8.B). <strong>(2)</strong> <code>getUserChoice</code> đọc qua lớp phụ dùng chung <code>Nhap</code> thay vì <code>Scanner</code> riêng — slide 24 cho thấy vì sao.</p>
<pre class="trich"><code class="language-java">class Nhap {                                                      // ➕ MỘT Scanner cho cả chương trình
    static final Scanner SC = new Scanner(System.in);
    static String dong(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine();
        System.out.println(s);                                    // in lại thứ vừa đọc để bản ghi giống màn hình console
        return s;
    }
}</code></pre>
<p class="meo">🧠 <code>Nhap.dong</code> còn in lại dòng vừa đọc. Khi bạn gõ, console vẫn hiện chữ bạn gõ; khi dữ liệu được đổ qua ống (như cách chương trình chạy ở đây, và như máy chấm PE chạy bài của bạn) thì không có gì hiện ra — in lại giúp bản ghi dễ đọc. Đừng in lại trong bài giải PE trừ khi đề yêu cầu.</p>`],
      [19, 'Access Text Files …: Case study 1- Implementations',
        `<p class="y-chinh">🎯 <code>EmpList extends Vector&lt;Employee&gt;</code> (imports <code>java.io.*</code>, <code>StringTokenizer</code>, <code>Vector</code>, <code>Scanner</code>, <code>Collections</code>; a field <code>Scanner sc = new Scanner(System.in)</code>) and <code>AddFromFile(String fName)</code>: check that the file exists, open <code>FileReader</code> + <code>BufferedReader</code>, read each line ("E001,Hoang Van Tuan,156"), split it with <code>StringTokenizer(details, ",")</code>, upper-case code and name, <code>parseInt</code> the salary, add a new <code>Employee</code>; then <code>bf.close(); fr.close();</code> inside the <code>try</code>, and <code>catch (Exception e)</code> prints the error.</p>
<pre class="trich"><code class="language-java">public void addFromFile(String fName) {
    File f = new File(fName);
    if (!f.exists()) return;                                  // first run: no file yet, start empty
    try (BufferedReader bf = new BufferedReader(new FileReader(f))) {   // ➕ try-with-resources closes it even on error
        String details;                                       // E001,HOANG VAN TUAN,112
        while ((details = bf.readLine()) != null) {
            if (details.trim().isEmpty()) continue;           // ➕ skip blank lines
            StringTokenizer stk = new StringTokenizer(details, ",");
            String code = stk.nextToken().trim().toUpperCase();  // ➕ trim(): "E002, TRAN" also works
            String name = stk.nextToken().trim().toUpperCase();
            int salary = Integer.parseInt(stk.nextToken().trim());
            this.add(new Employee(code, name, salary));
        }
    } catch (IOException | RuntimeException e) {               // bad number, missing field, I/O error
        System.out.println("Cannot load " + fName + ": " + e);
    }
}</code></pre>
<p>Changed: the streams are opened in <code>try ( … )</code> — in the slide, an exception on line 3 jumps to <code>catch</code> and <code>bf.close()</code> never runs, so the file stays open (on Windows an open file cannot be deleted or renamed). Each token is <code>trim()</code>med, blank lines are skipped, and the method name follows Java style (<code>addFromFile</code>, lower-case first letter). The slide's <code>catch (Exception e)</code> also hides programming bugs; catching <code>IOException</code> and the runtime errors of bad data separately says what went wrong.</p>
<p>➕ Why the compiler forces you to write <code>try</code> here at all, and what each exception looks like — measured on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== 1. FileReader throws a CHECKED exception: handle it or declare it ==");
    viet(d, "Doc.java",
        "import java.io.*;\\n" +
        "public class Doc {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        BufferedReader br = new BufferedReader(new FileReader(\\"data.txt\\"));\\n" +
        "        System.out.println(br.readLine());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Doc.java");
    System.out.println("== 2. catch the subclass FIRST ==");
    viet(d, "ThuTu.java",
        "import java.io.*;\\n" +
        "public class ThuTu {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        try {\\n" +
        "            new FileReader(\\"data.txt\\").close();\\n" +
        "        } catch (IOException e) {\\n" +
        "            System.out.println(\\"I/O\\");\\n" +
        "        } catch (FileNotFoundException e) {\\n" +
        "            System.out.println(\\"missing\\");\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "ThuTu.java");
    System.out.println("== 3. the messages at run time ==");
    thu("data.txt");                    // does not exist
    thu("lab");                         // a folder, not a file
    System.out.println("== 4. try-with-resources closes in reverse order, even when the body throws ==");
    tryWithResources();
}</code></pre>
<pre class="trich"><code class="language-java">static void thu(String name) {
    try (BufferedReader br = new BufferedReader(new FileReader(name))) {
        System.out.println(br.readLine());
    } catch (FileNotFoundException e) {                     // subclass first: the file cannot be opened
        System.out.println("FileNotFoundException: " + e.getMessage());
    } catch (IOException e) {                               // then any other I/O error while reading
        System.out.println("IOException: " + e.getMessage());
    }
}</code></pre>
<pre class="trich"><code class="language-java">static class TaiNguyen implements AutoCloseable {           // anything AutoCloseable can go in try( ... )
    final String ten;
    TaiNguyen(String ten) { this.ten = ten; System.out.println("open " + ten); }
    @Override public void close() { System.out.println("close " + ten); }
}
static void tryWithResources() {
    try (TaiNguyen a = new TaiNguyen("FileReader"); TaiNguyen b = new TaiNguyen("BufferedReader")) {
        System.out.println("reading...");
        throw new IOException("disk error while reading");
    } catch (IOException e) {
        System.out.println("caught: " + e.getMessage() + "  (both already closed)");
    }
}</code></pre>
<div class="out">== 1. FileReader throws a CHECKED exception: handle it or declare it ==<br>
&gt; javac Doc.java<br>
Doc.java:4: error: unreported exception FileNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedReader br = new BufferedReader(new FileReader("data.txt"));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Doc.java:5: error: unreported exception IOException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(br.readLine());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)<br>
== 2. catch the subclass FIRST ==<br>
&gt; javac ThuTu.java<br>
ThuTu.java:8: error: exception FileNotFoundException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} catch (FileNotFoundException e) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 3. the messages at run time ==<br>
FileNotFoundException: data.txt (No such file or directory)<br>
FileNotFoundException: lab (Is a directory)<br>
== 4. try-with-resources closes in reverse order, even when the body throws ==<br>
open FileReader<br>
open BufferedReader<br>
reading...<br>
close BufferedReader<br>
close FileReader<br>
caught: disk error while reading &nbsp;(both already closed)</div>
<div class="pitfall"><code>FileNotFoundException</code> is a subclass of <code>IOException</code>, so its <code>catch</code> must come <strong>first</strong> — the other order is a compile error ("has already been caught"). FE: "Which exception is thrown when FileInputStream cannot find the file?" → <strong>FileNotFoundException</strong>. Windows messages differ ("The system cannot find the file specified", "Access is denied") but the class is the same.</div>`,
        `<p class="y-chinh">🎯 <code>EmpList extends Vector&lt;Employee&gt;</code> (import <code>java.io.*</code>, <code>StringTokenizer</code>, <code>Vector</code>, <code>Scanner</code>, <code>Collections</code>; một trường <code>Scanner sc = new Scanner(System.in)</code>) và <code>AddFromFile(String fName)</code>: kiểm tra file có tồn tại, mở <code>FileReader</code> + <code>BufferedReader</code>, đọc từng dòng ("E001,Hoang Van Tuan,156"), tách bằng <code>StringTokenizer(details, ",")</code>, viết hoa mã và tên, <code>parseInt</code> lương, thêm một <code>Employee</code> mới; rồi <code>bf.close(); fr.close();</code> bên trong <code>try</code>, và <code>catch (Exception e)</code> in lỗi.</p>
<pre class="trich"><code class="language-java">public void addFromFile(String fName) {
    File f = new File(fName);
    if (!f.exists()) return;                                  // lần chạy đầu: chưa có file, bắt đầu rỗng
    try (BufferedReader bf = new BufferedReader(new FileReader(f))) {   // ➕ tự đóng kể cả khi lỗi
        String details;                                       // E001,HOANG VAN TUAN,112
        while ((details = bf.readLine()) != null) {
            if (details.trim().isEmpty()) continue;           // ➕ bỏ dòng trống
            StringTokenizer stk = new StringTokenizer(details, ",");
            String code = stk.nextToken().trim().toUpperCase();  // ➕ trim(): "E002, TRAN" cũng đọc được
            String name = stk.nextToken().trim().toUpperCase();
            int salary = Integer.parseInt(stk.nextToken().trim());
            this.add(new Employee(code, name, salary));
        }
    } catch (IOException | RuntimeException e) {               // số sai, thiếu trường, lỗi I/O
        System.out.println("Cannot load " + fName + ": " + e);
    }
}</code></pre>
<p>Đã đổi: các luồng được mở trong <code>try ( … )</code> — ở slide, một ngoại lệ ở dòng thứ 3 nhảy thẳng xuống <code>catch</code> và <code>bf.close()</code> không bao giờ chạy, nên file cứ mở (trên Windows file đang mở thì không xoá hay đổi tên được). Từng token được <code>trim()</code>, dòng trống bị bỏ qua, và tên phương thức theo quy ước Java (<code>addFromFile</code>, chữ đầu viết thường). <code>catch (Exception e)</code> của slide còn giấu cả lỗi lập trình; bắt riêng <code>IOException</code> và các lỗi lúc chạy do dữ liệu sai thì biết được hỏng ở đâu.</p>
<p>➕ Vì sao trình biên dịch bắt bạn phải viết <code>try</code> ở đây, và từng ngoại lệ trông thế nào — đo trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== 1. FileReader throws a CHECKED exception: handle it or declare it ==");
    viet(d, "Doc.java",
        "import java.io.*;\\n" +
        "public class Doc {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        BufferedReader br = new BufferedReader(new FileReader(\\"data.txt\\"));\\n" +
        "        System.out.println(br.readLine());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Doc.java");
    System.out.println("== 2. catch the subclass FIRST ==");
    viet(d, "ThuTu.java",
        "import java.io.*;\\n" +
        "public class ThuTu {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        try {\\n" +
        "            new FileReader(\\"data.txt\\").close();\\n" +
        "        } catch (IOException e) {\\n" +
        "            System.out.println(\\"I/O\\");\\n" +
        "        } catch (FileNotFoundException e) {\\n" +
        "            System.out.println(\\"missing\\");\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "ThuTu.java");
    System.out.println("== 3. the messages at run time ==");
    thu("data.txt");                    // không tồn tại
    thu("lab");                         // là thư mục, không phải file
    System.out.println("== 4. try-with-resources closes in reverse order, even when the body throws ==");
    tryWithResources();
}</code></pre>
<pre class="trich"><code class="language-java">static void thu(String name) {
    try (BufferedReader br = new BufferedReader(new FileReader(name))) {
        System.out.println(br.readLine());
    } catch (FileNotFoundException e) {                     // lớp con trước: không mở được file
        System.out.println("FileNotFoundException: " + e.getMessage());
    } catch (IOException e) {                               // rồi mọi lỗi I/O khác khi đọc
        System.out.println("IOException: " + e.getMessage());
    }
}</code></pre>
<pre class="trich"><code class="language-java">static class TaiNguyen implements AutoCloseable {           // mọi thứ AutoCloseable đều đặt được trong try( ... )
    final String ten;
    TaiNguyen(String ten) { this.ten = ten; System.out.println("open " + ten); }
    @Override public void close() { System.out.println("close " + ten); }
}
static void tryWithResources() {
    try (TaiNguyen a = new TaiNguyen("FileReader"); TaiNguyen b = new TaiNguyen("BufferedReader")) {
        System.out.println("reading...");
        throw new IOException("disk error while reading");
    } catch (IOException e) {
        System.out.println("caught: " + e.getMessage() + "  (both already closed)");
    }
}</code></pre>
<div class="out">== 1. FileReader throws a CHECKED exception: handle it or declare it ==<br>
&gt; javac Doc.java<br>
Doc.java:4: error: unreported exception FileNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedReader br = new BufferedReader(new FileReader("data.txt"));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Doc.java:5: error: unreported exception IOException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(br.readLine());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)<br>
== 2. catch the subclass FIRST ==<br>
&gt; javac ThuTu.java<br>
ThuTu.java:8: error: exception FileNotFoundException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} catch (FileNotFoundException e) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 3. the messages at run time ==<br>
FileNotFoundException: data.txt (No such file or directory)<br>
FileNotFoundException: lab (Is a directory)<br>
== 4. try-with-resources closes in reverse order, even when the body throws ==<br>
open FileReader<br>
open BufferedReader<br>
reading...<br>
close BufferedReader<br>
close FileReader<br>
caught: disk error while reading &nbsp;(both already closed)</div>
<div class="pitfall"><code>FileNotFoundException</code> là lớp con của <code>IOException</code>, nên <code>catch</code> của nó phải đứng <strong>trước</strong> — đảo thứ tự là lỗi biên dịch ("has already been caught"). FE: "Ngoại lệ nào được ném khi FileInputStream không tìm thấy file?" → <strong>FileNotFoundException</strong>. Thông báo trên Windows khác ("The system cannot find the file specified", "Access is denied") nhưng lớp ngoại lệ thì giống.</div>`],
      [20, 'Access Text Files …: Case study  1- Implementations',
        `<p class="y-chinh">🎯 <code>saveToFile(String fName)</code>: if the list is empty print "Empty list" and return; otherwise open <code>File</code> → <code>FileWriter fw</code> (<code>write()</code>) → <code>PrintWriter pw</code> (<code>println()</code>), write <code>code + "," + name + "," + salary</code> for each employee, close <code>pw</code> and <code>fw</code>, and <code>catch (Exception e)</code>. Then <code>find(String aCode)</code>: a loop over the list returning the index of the matching code, or -1.</p>
<pre class="trich"><code class="language-java">public void saveToFile(String fName) {
    if (this.size() == 0) {
        System.out.println("Empty list");
        return;
    }
    try (PrintWriter pw = new PrintWriter(new FileWriter(fName))) {   // FileWriter(name): the OLD content is replaced
        for (Employee x : this)
            pw.println(x.getCode() + "," + x.getName() + "," + x.getSalary());
        System.out.println("Saved " + size() + " employees to " + fName);
    } catch (IOException e) {
        System.out.println(e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">private int find(String aCode) {
    for (int i = 0; i &lt; this.size(); i++)
        if (this.get(i).getCode().equals(aCode)) return i;
    return -1;
}</code></pre>
<p><code>saveToFile</code> writes exactly the format <code>addFromFile</code> reads — the two methods are a pair, and a change in one (say, a fourth field) must be made in the other. <code>new FileWriter(fName)</code> <strong>replaces</strong> the whole file, which is what we want here: the list in memory is the complete truth. Closing <code>pw</code> also closes the <code>FileWriter</code> it wraps, so <code>try (PrintWriter pw = new PrintWriter(new FileWriter(fName)))</code> needs only one resource.</p>
<p><code>find</code> returns an <strong>index</strong> (an <code>int</code>), not the employee: callers use it both to test existence (<code>pos &lt; 0</code>) and to reach the element (<code>get(pos)</code>, <code>remove(pos)</code>). It compares with <code>equals</code> — never <code>==</code> on Strings (lesson 1.E).</p>
<div class="pitfall">A save that throws half-way leaves a half-written file and the old data is gone. ➕ The professional fix (not needed in PRO192): write to <code>employees.tmp</code>, then <code>Files.move(tmp, real, StandardCopyOption.REPLACE_EXISTING)</code> — the file is replaced only after the new one is complete.</div>`,
        `<p class="y-chinh">🎯 <code>saveToFile(String fName)</code>: danh sách rỗng thì in "Empty list" rồi thoát; ngược lại mở <code>File</code> → <code>FileWriter fw</code> (<code>write()</code>) → <code>PrintWriter pw</code> (<code>println()</code>), ghi <code>code + "," + name + "," + salary</code> cho từng nhân viên, đóng <code>pw</code> và <code>fw</code>, và <code>catch (Exception e)</code>. Rồi <code>find(String aCode)</code>: một vòng lặp qua danh sách trả về chỉ số của mã khớp, hoặc -1.</p>
<pre class="trich"><code class="language-java">public void saveToFile(String fName) {
    if (this.size() == 0) {
        System.out.println("Empty list");
        return;
    }
    try (PrintWriter pw = new PrintWriter(new FileWriter(fName))) {   // nội dung CŨ bị thay
        for (Employee x : this)
            pw.println(x.getCode() + "," + x.getName() + "," + x.getSalary());
        System.out.println("Saved " + size() + " employees to " + fName);
    } catch (IOException e) {
        System.out.println(e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">private int find(String aCode) {
    for (int i = 0; i &lt; this.size(); i++)
        if (this.get(i).getCode().equals(aCode)) return i;
    return -1;
}</code></pre>
<p><code>saveToFile</code> ghi đúng định dạng mà <code>addFromFile</code> đọc — hai phương thức này là một cặp, sửa cái này (chẳng hạn thêm trường thứ tư) thì phải sửa cái kia. <code>new FileWriter(fName)</code> <strong>thay</strong> toàn bộ file, đúng điều ta muốn ở đây: danh sách trong bộ nhớ là sự thật đầy đủ. Đóng <code>pw</code> thì cũng đóng luôn <code>FileWriter</code> nằm bên trong, nên <code>try (PrintWriter pw = new PrintWriter(new FileWriter(fName)))</code> chỉ cần một tài nguyên.</p>
<p><code>find</code> trả về <strong>chỉ số</strong> (một <code>int</code>), không phải nhân viên: nơi gọi dùng nó vừa để kiểm tra có hay không (<code>pos &lt; 0</code>) vừa để lấy phần tử (<code>get(pos)</code>, <code>remove(pos)</code>). Nó so bằng <code>equals</code> — không bao giờ <code>==</code> với String (bài 1.E).</p>
<div class="pitfall">Lưu mà ném lỗi giữa chừng thì để lại file ghi dở và dữ liệu cũ đã mất. ➕ Cách làm chuyên nghiệp (PRO192 chưa cần): ghi ra <code>employees.tmp</code>, rồi <code>Files.move(tmp, real, StandardCopyOption.REPLACE_EXISTING)</code> — file chỉ bị thay sau khi file mới đã ghi xong.</div>`],
      [21, 'Access Text Files …: Case study  1- Implementations',
        `<p class="y-chinh">🎯 <code>addNewEmp()</code>: print "Enter New Employee Details:", then <code>do { … } while (pos &gt;= 0 || !valid)</code> asking for "code E000:", upper-casing it, <code>pos = find(newCode)</code>, <code>valid = newCode.matches("^E\\\\d{3}$")</code> (pattern: E and 3 digits), with the messages "The code is duplicated." and "The code: E and 3 digits."; then name (upper case), salary (<code>Integer.parseInt(sc.nextLine())</code>), <code>this.add(new Employee(…))</code> and "New Employee has been added."</p>
<pre class="trich"><code class="language-java">public void addNewEmp() {
    String newCode, newName;
    int pos;
    boolean valid;
    System.out.println("Enter New Employee Details:");
    do {
        newCode = Nhap.dong("   code E000: ").trim().toUpperCase();
        pos = find(newCode);
        valid = newCode.matches("^E\\\\d{3}$");                 // pattern: E and 3 digits
        if (pos &gt;= 0) System.out.println("   The code is duplicated.");
        if (!valid) System.out.println("   The code: E and 3 digits.");
    } while (pos &gt;= 0 || !valid);
    newName = Nhap.dong("   name: ").trim().toUpperCase();
    int salary = Integer.parseInt(Nhap.dong("   salary: ").trim());
    this.add(new Employee(newCode, newName, salary));
    System.out.println("New Employee has been added.");
}</code></pre>
<p>The validation loop is the LAB211 pattern: ask, check every rule, print what is wrong, ask again until all rules pass. The regular expression <code>^E\\d{3}$</code> reads: start, the letter E, exactly three digits, end. In Java source the backslash is doubled: <code>"^E\\\\d{3}$"</code>. (<code>matches</code> already requires the whole string to match, so <code>^</code> and <code>$</code> are optional.) In the run under slide 25, "E1" fails the pattern, "e001" passes it after <code>toUpperCase()</code> but is a duplicate, "e003" is accepted.</p>
<div class="pitfall"><code>Integer.parseInt(sc.nextLine())</code> crashes the whole program with <code>NumberFormatException</code> if the user types "abc" or " 180" — the slide does not protect the salary. LAB211 graders type wrong values on purpose; wrap it in a loop with <code>try/catch (NumberFormatException e)</code> like <code>getUserChoice</code> does, and <code>trim()</code> first.</div>`,
        `<p class="y-chinh">🎯 <code>addNewEmp()</code>: in "Enter New Employee Details:", rồi <code>do { … } while (pos &gt;= 0 || !valid)</code> hỏi "code E000:", viết hoa, <code>pos = find(newCode)</code>, <code>valid = newCode.matches("^E\\\\d{3}$")</code> (mẫu: E và 3 chữ số), kèm các thông báo "The code is duplicated." và "The code: E and 3 digits."; rồi tên (chữ hoa), lương (<code>Integer.parseInt(sc.nextLine())</code>), <code>this.add(new Employee(…))</code> và "New Employee has been added."</p>
<pre class="trich"><code class="language-java">public void addNewEmp() {
    String newCode, newName;
    int pos;
    boolean valid;
    System.out.println("Enter New Employee Details:");
    do {
        newCode = Nhap.dong("   code E000: ").trim().toUpperCase();
        pos = find(newCode);
        valid = newCode.matches("^E\\\\d{3}$");                 // mẫu: E và 3 chữ số
        if (pos &gt;= 0) System.out.println("   The code is duplicated.");
        if (!valid) System.out.println("   The code: E and 3 digits.");
    } while (pos &gt;= 0 || !valid);
    newName = Nhap.dong("   name: ").trim().toUpperCase();
    int salary = Integer.parseInt(Nhap.dong("   salary: ").trim());
    this.add(new Employee(newCode, newName, salary));
    System.out.println("New Employee has been added.");
}</code></pre>
<p>Vòng kiểm tra này là khuôn mẫu LAB211: hỏi, kiểm mọi luật, in lỗi gì, hỏi lại tới khi mọi luật đều qua. Biểu thức chính quy (regular expression) <code>^E\\d{3}$</code> đọc là: đầu chuỗi, chữ E, đúng ba chữ số, cuối chuỗi. Trong mã nguồn Java dấu gạch ngược phải viết đôi: <code>"^E\\\\d{3}$"</code>. (<code>matches</code> vốn đã đòi khớp cả chuỗi, nên <code>^</code> và <code>$</code> có cũng được, không cũng được.) Trong lần chạy ở slide 25, "E1" sai mẫu, "e001" qua mẫu sau <code>toUpperCase()</code> nhưng bị trùng, "e003" được nhận.</p>
<div class="pitfall"><code>Integer.parseInt(sc.nextLine())</code> làm sập cả chương trình với <code>NumberFormatException</code> nếu người dùng gõ "abc" hay " 180" — slide không bảo vệ ô lương. Người chấm LAB211 cố tình gõ sai; hãy bọc nó trong vòng lặp với <code>try/catch (NumberFormatException e)</code> như <code>getUserChoice</code> làm, và <code>trim()</code> trước.</div>`],
      [22, 'Access Text Files …: Case study 1- Implementations',
        `<p class="y-chinh">🎯 <code>removeEmp()</code>: ask "Enter the code of removed employee:", upper-case it, <code>pos = find(code)</code>; if <code>pos &lt; 0</code> print "This code does not exist.", else <code>this.remove(pos)</code> and "The employee … has been removed."</p>
<pre class="trich"><code class="language-java">public void removeEmp() {
    String code = Nhap.dong("Enter the code of removed employee: ").trim().toUpperCase();
    int pos = find(code);
    if (pos &lt; 0) System.out.println("This code does not exist.");
    else {
        this.remove(pos);                                     // remove(int index)
        System.out.println("The employee " + code + " has been removed.");
    }
}</code></pre>
<p>The method is short because <code>find</code> did the work. Note which <code>remove</code> runs: <code>pos</code> is an <code>int</code>, so Java picks <code>remove(int index)</code> — exactly right here. <code>remove(Object o)</code> would need an <code>Employee</code> equal to the stored one, and <code>Employee</code> does not override <code>equals</code>, so <code>remove(new Employee("E005", …))</code> would remove nothing (lesson 8.B).</p>
<p>The removal changes only the list in memory; <code>employees.txt</code> still has E005 until the user chooses "Save". That is why <code>main</code> sets <code>changed = true</code> after options 1–3 and asks "Save changes Y/N?" on quit (slide 25). In the run, removing "E009" prints "This code does not exist."; removing "E005" works.</p>
<p class="meo">🧠 Remove-by-code is a classic PE/LAB211 function. If you ever remove inside a loop over the list, use an <code>Iterator</code> (lesson 8.A) — not <code>for-each</code> + <code>remove</code>.</p>`,
        `<p class="y-chinh">🎯 <code>removeEmp()</code>: hỏi "Enter the code of removed employee:", viết hoa, <code>pos = find(code)</code>; nếu <code>pos &lt; 0</code> in "This code does not exist.", ngược lại <code>this.remove(pos)</code> và "The employee … has been removed."</p>
<pre class="trich"><code class="language-java">public void removeEmp() {
    String code = Nhap.dong("Enter the code of removed employee: ").trim().toUpperCase();
    int pos = find(code);
    if (pos &lt; 0) System.out.println("This code does not exist.");
    else {
        this.remove(pos);                                     // remove(int chỉ-số)
        System.out.println("The employee " + code + " has been removed.");
    }
}</code></pre>
<p>Phương thức ngắn vì <code>find</code> đã làm phần việc chính. Để ý <code>remove</code> nào được gọi: <code>pos</code> là <code>int</code>, nên Java chọn <code>remove(int index)</code> — đúng thứ ta cần. <code>remove(Object o)</code> sẽ cần một <code>Employee</code> bằng với đối tượng đã cất, mà <code>Employee</code> không ghi đè <code>equals</code>, nên <code>remove(new Employee("E005", …))</code> sẽ không xoá gì cả (bài 8.B).</p>
<p>Việc xoá chỉ đổi danh sách trong bộ nhớ; <code>employees.txt</code> vẫn còn E005 cho tới khi người dùng chọn "Save". Vì thế <code>main</code> đặt <code>changed = true</code> sau các lựa chọn 1–3 và hỏi "Save changes Y/N?" khi thoát (slide 25). Trong lần chạy, xoá "E009" in "This code does not exist."; xoá "E005" thì được.</p>
<p class="meo">🧠 Xoá theo mã là chức năng kinh điển của PE/LAB211. Nếu có lúc phải xoá ngay trong vòng lặp qua danh sách, dùng <code>Iterator</code> (bài 8.A) — không dùng <code>for-each</code> + <code>remove</code>.</p>`],
      [23, 'Access Text Files …: Case study 1- Implementations',
        `<p class="y-chinh">🎯 <code>promote()</code>: ask for a code, <code>find</code> it; if found, show the old salary and repeat "new salary:" while the new value is lower than the old one, then <code>setSalary</code> and "has been updated". <code>print()</code>: if empty print "Empty List.", else <code>Collections.sort(this)</code>, print a header "EMPLOYEE LIST" and a dashed line, and call <code>print()</code> on each employee.</p>
<pre class="trich"><code class="language-java">public void promote() {
    String code = Nhap.dong("Enter the code of promoted employee: ").trim().toUpperCase();
    int pos = find(code);
    if (pos &lt; 0) System.out.println("This code does not exist.");
    else {
        int oldSalary = this.get(pos).getSalary();
        int newSalary;
        do {
            newSalary = Integer.parseInt(Nhap.dong("Old salary: " + oldSalary + ", new salary: ").trim());
        } while (newSalary &lt; oldSalary);                      // a promotion cannot lower the salary
        this.get(pos).setSalary(newSalary);
        System.out.println("The employee " + code + " has been updated.");
    }
}</code></pre>
<p>In the run, the user types 150 for E003 (old salary 180) — refused, asked again — then 200. The <code>do … while (newSalary &lt; oldSalary)</code> encodes a business rule: a promotion cannot lower the salary.</p>
<pre class="trich"><code class="language-java">public void print() {
    if (this.size() == 0) {
        System.out.println("Empty List.");
        return;
    }
    Collections.sort(this);                                   // uses compareTo: by code
    System.out.println("\\nEMPLOYEE LIST");
    System.out.println("-------------------------------------");
    for (Employee x : this) x.print();
}</code></pre>
<p><code>Collections.sort(this)</code> works because <code>EmpList</code> <em>is</em> a <code>List&lt;Employee&gt;</code> and <code>Employee</code> is <code>Comparable</code> — sort uses <code>compareTo</code>, by code. Side effect worth knowing: printing <strong>reorders the list itself</strong>, so a later "Save" writes the file sorted by code (compare the file at the end of the run with the original order E005, E001, E002). To print sorted without touching the list, sort a copy: <code>List&lt;Employee&gt; copy = new ArrayList&lt;Employee&gt;(this); Collections.sort(copy);</code>.</p>
<div class="pitfall">If <code>Employee</code> did not implement <code>Comparable</code>, <code>Collections.sort(this)</code> would be a <strong>compile error</strong> on JDK 8 ("no suitable method found for sort", lesson 8.2 exercise 6) — not a run-time one. With the raw <code>Comparable</code> of the slide it compiles, with an "unchecked" warning.</div>`,
        `<p class="y-chinh">🎯 <code>promote()</code>: hỏi mã, <code>find</code>; nếu có thì hiện lương cũ và hỏi lặp "new salary:" chừng nào giá trị mới thấp hơn cũ, rồi <code>setSalary</code> và "has been updated". <code>print()</code>: rỗng thì in "Empty List.", ngược lại <code>Collections.sort(this)</code>, in tiêu đề "EMPLOYEE LIST" và một dòng gạch, rồi gọi <code>print()</code> của từng nhân viên.</p>
<pre class="trich"><code class="language-java">public void promote() {
    String code = Nhap.dong("Enter the code of promoted employee: ").trim().toUpperCase();
    int pos = find(code);
    if (pos &lt; 0) System.out.println("This code does not exist.");
    else {
        int oldSalary = this.get(pos).getSalary();
        int newSalary;
        do {
            newSalary = Integer.parseInt(Nhap.dong("Old salary: " + oldSalary + ", new salary: ").trim());
        } while (newSalary &lt; oldSalary);                      // thăng lương thì không được giảm
        this.get(pos).setSalary(newSalary);
        System.out.println("The employee " + code + " has been updated.");
    }
}</code></pre>
<p>Trong lần chạy, người dùng gõ 150 cho E003 (lương cũ 180) — bị từ chối, hỏi lại — rồi 200. <code>do … while (newSalary &lt; oldSalary)</code> mã hoá một luật nghiệp vụ: tăng lương thì không được làm lương thấp đi.</p>
<pre class="trich"><code class="language-java">public void print() {
    if (this.size() == 0) {
        System.out.println("Empty List.");
        return;
    }
    Collections.sort(this);                                   // dùng compareTo: theo mã
    System.out.println("\\nEMPLOYEE LIST");
    System.out.println("-------------------------------------");
    for (Employee x : this) x.print();
}</code></pre>
<p><code>Collections.sort(this)</code> chạy được vì <code>EmpList</code> <em>là</em> một <code>List&lt;Employee&gt;</code> và <code>Employee</code> là <code>Comparable</code> — sort dùng <code>compareTo</code>, theo mã. Hệ quả phụ nên biết: in ra thì <strong>sắp lại chính danh sách</strong>, nên lần "Save" sau ghi file theo thứ tự mã (so file ở cuối lần chạy với thứ tự ban đầu E005, E001, E002). Muốn in có sắp xếp mà không đụng danh sách thì sắp một bản sao: <code>List&lt;Employee&gt; copy = new ArrayList&lt;Employee&gt;(this); Collections.sort(copy);</code>.</p>
<div class="pitfall">Nếu <code>Employee</code> không hiện thực <code>Comparable</code>, <code>Collections.sort(this)</code> là <strong>lỗi biên dịch</strong> trên JDK 8 ("no suitable method found for sort", bài 8.2 bài tập 6) — không phải lỗi lúc chạy. Với <code>Comparable</code> thô của slide thì biên dịch được, kèm cảnh báo "unchecked".</div>`],
      [24, 'Access Text Files …: Case study 1- Implementations',
        `<p class="y-chinh">🎯 <code>ManageProgram.main</code>, part 1: <code>String filename = "employees.txt"</code>, a <code>Scanner sc = new Scanner(System.in)</code>, <code>Menu menu = new Menu()</code> with six items, <code>int userChoice</code>, <code>boolean changed = false</code>, <code>EmpList list = new EmpList()</code>, and <code>list.AddFromFile(filename)</code> to load the initial data.</p>
<p>Count the Scanners on <code>System.in</code> in the slides' design: one in <code>main</code>, one inside <code>Menu</code> (for <code>getUserChoice</code>), one field of <code>EmpList</code> — three. Typing by hand it works, because each Scanner gets only the line you just typed. But a <code>Scanner</code> reads <strong>ahead</strong> into a buffer of up to 1024 characters; when the input comes all at once — a PE grader, <code>java ManageProgram &lt; input.txt</code> — the first Scanner swallows everything and the others find nothing:</p>
<pre><code class="language-java">// release: 8
// Slides 18, 19 and 24: the case study creates a Scanner(System.in) in Menu, in EmpList AND in main — fine when you type, broken when the input is piped (PE grader, redirected file)
import java.util.*;

class Menu {
    Scanner sc = new Scanner(System.in);                       // Scanner number 1
    int getUserChoice() {
        System.out.print("Select 1..6: ");
        return Integer.parseInt(sc.nextLine().trim());
    }
}

class EmpList {
    Scanner sc = new Scanner(System.in);                       // Scanner number 2, same System.in
    void addNewEmp() {
        System.out.print("code E000: ");
        String code = sc.nextLine();
        System.out.println("read code " + code);
    }
}

public class HaiScanner {
    public static void main(String[] args) {
        Menu menu = new Menu();
        EmpList list = new EmpList();
        int choice = menu.getUserChoice();                     // Scanner 1 reads "1" ... and buffers EVERYTHING after it
        System.out.println("choice = " + choice);
        try {
            list.addNewEmp();                                  // Scanner 2 finds System.in already empty
        } catch (NoSuchElementException e) {
            System.out.println("Scanner 2: " + e);
        }
        System.out.println("but Scanner 1 still holds: \\"" + menu.sc.nextLine() + "\\"");
    }
}</code></pre>
<div class="out">Select 1..6: choice = 1<br>
code E000: Scanner 2: java.util.NoSuchElementException: No line found<br>
but Scanner 1 still holds: "E003"</div>
<p>Input piped in: <code>1</code>, <code>E003</code>, <code>LE THI MAI</code>, <code>180</code> (one per line). Scanner 1 read "1" — and buffered the rest; Scanner 2 got <code>NoSuchElementException: No line found</code>; Scanner 1 still holds "E003". This is why the runnable version has <strong>one</strong> <code>Scanner</code>, in <code>Nhap</code>, used by every class. Part 1 of <code>main</code>:</p>
<pre class="trich"><code class="language-java">String filename = "employees.txt";
Menu menu = new Menu();
menu.addMenuItem("Add new employee");
menu.addMenuItem("Remove an employee");
menu.addMenuItem("Promoting the employee's salary");
menu.addMenuItem("Print the list");
menu.addMenuItem("Save to file");
menu.addMenuItem("Quit");
int userChoice;
boolean changed = false;
EmpList list = new EmpList();
list.addFromFile(filename);                               // load initial data
do {
    System.out.println("\\nEMPLOYEE MANAGER");
    userChoice = menu.getUserChoice();
    switch (userChoice) {
        case 1: list.addNewEmp(); changed = true; break;
        case 2: list.removeEmp(); changed = true; break;
        case 3: list.promote(); changed = true; break;
        case 4: list.print(); break;
        case 5: list.saveToFile(filename); changed = false; break;   // ➕ the slide forgot this break
        case 6:
            if (changed) {
                String response = Nhap.dong("Save changes Y/N? ").trim().toUpperCase();
                if (response.startsWith("Y")) list.saveToFile(filename);
            }
            break;
    }
} while (userChoice != 6);</code></pre>
<div class="pitfall">PE rule (measured in lesson 8.2): the given <code>Main</code> of a PE paper reads with ONE <code>Scanner</code>; never create a second <code>Scanner(System.in)</code> in your classes. And never <code>close()</code> a Scanner on <code>System.in</code> in the middle of a program — it closes <code>System.in</code> itself, for good.</div>`,
        `<p class="y-chinh">🎯 <code>ManageProgram.main</code>, phần 1: <code>String filename = "employees.txt"</code>, một <code>Scanner sc = new Scanner(System.in)</code>, <code>Menu menu = new Menu()</code> với sáu mục, <code>int userChoice</code>, <code>boolean changed = false</code>, <code>EmpList list = new EmpList()</code>, và <code>list.AddFromFile(filename)</code> để nạp dữ liệu ban đầu.</p>
<p>Đếm số Scanner trên <code>System.in</code> trong thiết kế của slide: một trong <code>main</code>, một trong <code>Menu</code> (cho <code>getUserChoice</code>), một trường của <code>EmpList</code> — ba cái. Gõ tay thì chạy được, vì mỗi Scanner chỉ nhận đúng dòng bạn vừa gõ. Nhưng <code>Scanner</code> đọc <strong>trước</strong> vào bộ đệm tới 1024 ký tự; khi dữ liệu tới một lượt — máy chấm PE, <code>java ManageProgram &lt; input.txt</code> — Scanner đầu tiên nuốt hết và các Scanner kia không còn gì:</p>
<pre><code class="language-java">// release: 8
// Slide 18, 19 và 24: case study tạo Scanner(System.in) trong Menu, trong EmpList VÀ trong main — gõ tay thì chạy, đổ dữ liệu qua đường ống (máy chấm PE, file chuyển hướng) thì hỏng
import java.util.*;

class Menu {
    Scanner sc = new Scanner(System.in);                       // Scanner số 1
    int getUserChoice() {
        System.out.print("Select 1..6: ");
        return Integer.parseInt(sc.nextLine().trim());
    }
}

class EmpList {
    Scanner sc = new Scanner(System.in);                       // Scanner số 2, cùng System.in
    void addNewEmp() {
        System.out.print("code E000: ");
        String code = sc.nextLine();
        System.out.println("read code " + code);
    }
}

public class HaiScanner {
    public static void main(String[] args) {
        Menu menu = new Menu();
        EmpList list = new EmpList();
        int choice = menu.getUserChoice();                     // Scanner 1 đọc "1" ... và gom LUÔN mọi thứ phía sau vào bộ đệm
        System.out.println("choice = " + choice);
        try {
            list.addNewEmp();                                  // Scanner 2 thấy System.in đã cạn
        } catch (NoSuchElementException e) {
            System.out.println("Scanner 2: " + e);
        }
        System.out.println("but Scanner 1 still holds: \\"" + menu.sc.nextLine() + "\\"");
    }
}</code></pre>
<div class="out">Select 1..6: choice = 1<br>
code E000: Scanner 2: java.util.NoSuchElementException: No line found<br>
but Scanner 1 still holds: "E003"</div>
<p>Dữ liệu đổ vào: <code>1</code>, <code>E003</code>, <code>LE THI MAI</code>, <code>180</code> (mỗi giá trị một dòng). Scanner 1 đọc "1" — và gom luôn phần còn lại vào bộ đệm; Scanner 2 nhận <code>NoSuchElementException: No line found</code>; Scanner 1 vẫn còn giữ "E003". Vì thế bản chạy được chỉ có <strong>một</strong> <code>Scanner</code>, trong <code>Nhap</code>, mọi lớp dùng chung. Phần 1 của <code>main</code>:</p>
<pre class="trich"><code class="language-java">String filename = "employees.txt";
Menu menu = new Menu();
menu.addMenuItem("Add new employee");
menu.addMenuItem("Remove an employee");
menu.addMenuItem("Promoting the employee's salary");
menu.addMenuItem("Print the list");
menu.addMenuItem("Save to file");
menu.addMenuItem("Quit");
int userChoice;
boolean changed = false;
EmpList list = new EmpList();
list.addFromFile(filename);                               // nạp dữ liệu ban đầu
do {
    System.out.println("\\nEMPLOYEE MANAGER");
    userChoice = menu.getUserChoice();
    switch (userChoice) {
        case 1: list.addNewEmp(); changed = true; break;
        case 2: list.removeEmp(); changed = true; break;
        case 3: list.promote(); changed = true; break;
        case 4: list.print(); break;
        case 5: list.saveToFile(filename); changed = false; break;   // ➕ slide quên break này
        case 6:
            if (changed) {
                String response = Nhap.dong("Save changes Y/N? ").trim().toUpperCase();
                if (response.startsWith("Y")) list.saveToFile(filename);
            }
            break;
    }
} while (userChoice != 6);</code></pre>
<div class="pitfall">Luật PE (đã đo ở bài 8.2): <code>Main</code> cho sẵn của đề PE đọc bằng MỘT <code>Scanner</code>; đừng bao giờ tạo <code>Scanner(System.in)</code> thứ hai trong lớp của bạn. Và đừng <code>close()</code> một Scanner trên <code>System.in</code> giữa chương trình — nó đóng luôn <code>System.in</code>, vĩnh viễn.</div>`],
      [25, 'Access Text Files …: Case study 1- Implementations',
        `<p class="y-chinh">🎯 <code>main</code>, part 2: a <code>do … while (userChoice &gt; 0 &amp;&amp; userChoice &lt; 6)</code> loop printing "EMPLOYEE MANAGER" and a <code>switch</code>: 1 add, 2 remove, 3 promote (each sets <code>changed = true</code>), 4 print, 5 <code>saveToFile</code> and <code>changed = false</code>, <code>default</code>: if <code>changed</code>, ask "Save changes Y/N?" and save on "Y".</p>
<p>The whole program, run with a scripted session: print; add (two wrong codes, then E003); promote E003 (150 refused, 200); remove E009 (missing) and E005; print; save; remove E001; quit and answer "n".</p>
<div class="out"><br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 4<br>
<br>
EMPLOYEE LIST<br>
-------------------------------------<br>
E001 &nbsp;&nbsp;&nbsp;HOANG VAN TUAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;112<br>
E002 &nbsp;&nbsp;&nbsp;TRAN VAN LONG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;215<br>
E005 &nbsp;&nbsp;&nbsp;TRINH HOANG UYEN NHU &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;211<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Employee Details:<br>
&nbsp;&nbsp;&nbsp;code E000: E1<br>
&nbsp;&nbsp;&nbsp;The code: E and 3 digits.<br>
&nbsp;&nbsp;&nbsp;code E000: e001<br>
&nbsp;&nbsp;&nbsp;The code is duplicated.<br>
&nbsp;&nbsp;&nbsp;code E000: e003<br>
&nbsp;&nbsp;&nbsp;name: le thi mai<br>
&nbsp;&nbsp;&nbsp;salary: 180<br>
New Employee has been added.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 3<br>
Enter the code of promoted employee: E003<br>
Old salary: 180, new salary: 150<br>
Old salary: 180, new salary: 200<br>
The employee E003 has been updated.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 2<br>
Enter the code of removed employee: E009<br>
This code does not exist.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 2<br>
Enter the code of removed employee: E005<br>
The employee E005 has been removed.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 4<br>
<br>
EMPLOYEE LIST<br>
-------------------------------------<br>
E001 &nbsp;&nbsp;&nbsp;HOANG VAN TUAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;112<br>
E002 &nbsp;&nbsp;&nbsp;TRAN VAN LONG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;215<br>
E003 &nbsp;&nbsp;&nbsp;LE THI MAI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 5<br>
Saved 3 employees to employees.txt<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 2<br>
Enter the code of removed employee: E001<br>
The employee E001 has been removed.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 6<br>
Save changes Y/N? n<br>
<br>
--- employees.txt after the program ended ---<br>
E001,HOANG VAN TUAN,112<br>
E002,TRAN VAN LONG,215<br>
E003,LE THI MAI,200</div>
<p>Check the file at the end: E005 is gone (removed, then saved), E003 has salary 200, and <strong>E001 is still there</strong> — it was removed after the save and the user refused to save again. The order is by code because "print" sorted the list before the save (slide 23).</p>
<div class="pitfall">The slide's <code>case 5: list.saveToFile(filename); changed = false;</code> has <strong>no <code>break</code></strong>: after saving, execution falls into <code>default</code>. It does no harm only by luck (<code>changed</code> was just set to false). Add the <code>break</code>; FE loves "what is printed" questions built on a missing break. Also: menu values 0 or 7 end the loop silently in the slide's <code>while</code>; this version's <code>getUserChoice</code> only returns 1..6.</div>
<div class="callout">🧭 <strong>Go further — LAB211</strong>: this program is a template for most LAB211 assignments. Keep the split — a model class, a list class with <code>loadFromFile</code>/<code>saveToFile</code>, one input helper with validation, a menu loop — and LAB211's "load at start, save before exit" is solved. In <strong>PRJ301</strong> the list class becomes a DAO and the file becomes a database table.</div>`,
        `<p class="y-chinh">🎯 <code>main</code>, phần 2: vòng <code>do … while (userChoice &gt; 0 &amp;&amp; userChoice &lt; 6)</code> in "EMPLOYEE MANAGER" và một <code>switch</code>: 1 thêm, 2 xoá, 3 tăng lương (mỗi cái đặt <code>changed = true</code>), 4 in, 5 <code>saveToFile</code> và <code>changed = false</code>, <code>default</code>: nếu <code>changed</code> thì hỏi "Save changes Y/N?" và lưu khi trả lời "Y".</p>
<p>Toàn bộ chương trình, chạy với một kịch bản gõ sẵn: in; thêm (hai mã sai, rồi E003); tăng lương E003 (150 bị từ chối, 200); xoá E009 (không có) và E005; in; lưu; xoá E001; thoát và trả lời "n".</p>
<div class="out"><br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 4<br>
<br>
EMPLOYEE LIST<br>
-------------------------------------<br>
E001 &nbsp;&nbsp;&nbsp;HOANG VAN TUAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;112<br>
E002 &nbsp;&nbsp;&nbsp;TRAN VAN LONG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;215<br>
E005 &nbsp;&nbsp;&nbsp;TRINH HOANG UYEN NHU &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;211<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Employee Details:<br>
&nbsp;&nbsp;&nbsp;code E000: E1<br>
&nbsp;&nbsp;&nbsp;The code: E and 3 digits.<br>
&nbsp;&nbsp;&nbsp;code E000: e001<br>
&nbsp;&nbsp;&nbsp;The code is duplicated.<br>
&nbsp;&nbsp;&nbsp;code E000: e003<br>
&nbsp;&nbsp;&nbsp;name: le thi mai<br>
&nbsp;&nbsp;&nbsp;salary: 180<br>
New Employee has been added.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 3<br>
Enter the code of promoted employee: E003<br>
Old salary: 180, new salary: 150<br>
Old salary: 180, new salary: 200<br>
The employee E003 has been updated.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 2<br>
Enter the code of removed employee: E009<br>
This code does not exist.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 2<br>
Enter the code of removed employee: E005<br>
The employee E005 has been removed.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 4<br>
<br>
EMPLOYEE LIST<br>
-------------------------------------<br>
E001 &nbsp;&nbsp;&nbsp;HOANG VAN TUAN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;112<br>
E002 &nbsp;&nbsp;&nbsp;TRAN VAN LONG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;215<br>
E003 &nbsp;&nbsp;&nbsp;LE THI MAI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;200<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 5<br>
Saved 3 employees to employees.txt<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 2<br>
Enter the code of removed employee: E001<br>
The employee E001 has been removed.<br>
<br>
EMPLOYEE MANAGER<br>
1-Add new employee &nbsp;&nbsp;2-Remove an employee &nbsp;&nbsp;3-Promoting the employee's salary<br>
4-Print the list &nbsp;&nbsp;5-Save to file &nbsp;&nbsp;6-Quit<br>
Select 1..6: 6<br>
Save changes Y/N? n<br>
<br>
--- employees.txt after the program ended ---<br>
E001,HOANG VAN TUAN,112<br>
E002,TRAN VAN LONG,215<br>
E003,LE THI MAI,200</div>
<p>Kiểm file ở cuối: E005 đã mất (bị xoá rồi lưu), E003 lương 200, và <strong>E001 vẫn còn</strong> — nó bị xoá sau lần lưu và người dùng từ chối lưu lại. Thứ tự theo mã vì "print" đã sắp danh sách trước khi lưu (slide 23).</p>
<div class="pitfall"><code>case 5: list.saveToFile(filename); changed = false;</code> của slide <strong>không có <code>break</code></strong>: lưu xong, chương trình rơi xuống <code>default</code>. Nó vô hại chỉ vì may (<code>changed</code> vừa được đặt false). Hãy thêm <code>break</code>; FE rất thích câu "in ra gì" dựng trên một break bị thiếu. Thêm nữa: nhập 0 hay 7 thì vòng <code>while</code> của slide kết thúc lặng lẽ; <code>getUserChoice</code> của bản này chỉ trả về 1..6.</div>
<div class="callout">🧭 <strong>Đi tiếp — LAB211</strong>: chương trình này là khuôn cho phần lớn bài LAB211. Giữ cách chia — lớp mô hình, lớp danh sách có <code>loadFromFile</code>/<code>saveToFile</code>, một lớp nhập liệu có kiểm tra, một vòng menu — là giải xong yêu cầu "nạp khi mở, lưu trước khi thoát" của LAB211. Sang <strong>PRJ301</strong>, lớp danh sách thành DAO và file thành một bảng trong cơ sở dữ liệu.</div>`],
      [26, 'Access Text Files …: Case study 2.- Append File Demo.',
        `<p class="y-chinh">🎯 Problem: each item has a code, a name and a price; codes cannot be duplicated. An accountant is <strong>not allowed to view</strong> the stored items (in <code>items.txt</code>) but may <strong>add</strong> new items to the file. Format: one line for the code, one for the name, one for the price. Menu: add a new item, update an item, delete an item, save items (appending them to the file).</p>
<p>What is new compared with case study 1:</p>
<ul>
<li><strong>Append, do not rewrite</strong>: the program never loads the full list, so it cannot rewrite the file — it adds the new items at the end with <code>FileWriter(file, true)</code>.</li>
<li><strong>Three lines per record</strong> instead of one line with commas: no <code>split</code> at all, a name may contain commas — but a reader must take exactly three <code>readLine()</code>s per item, and one missing line shifts everything after it.</li>
<li><strong>Uniqueness without viewing</strong>: the program reads only the <em>codes</em> already stored (<code>storedCodes</code>) and checks new codes against them.</li>
</ul>
<p class="meo">🧠 "Update" and "delete" therefore apply only to the items typed in this session, not yet saved. Changing a record already in a text file means rewriting the file — that is what case study 1 does, and what <code>RandomAccessFile</code> (lesson 9.C) avoids for fixed-length records.</p>`,
        `<p class="y-chinh">🎯 Bài toán: mỗi mặt hàng có mã, tên và giá; mã không được trùng. Kế toán <strong>không được xem</strong> các mặt hàng đã lưu (trong <code>items.txt</code>) nhưng được <strong>thêm</strong> mặt hàng mới vào file. Định dạng: một dòng cho mã, một dòng cho tên, một dòng cho giá. Menu: thêm mặt hàng, sửa một mặt hàng, xoá một mặt hàng, lưu (ghi nối vào file).</p>
<p>Điểm mới so với case study 1:</p>
<ul>
<li><strong>Ghi nối, không ghi lại</strong>: chương trình không bao giờ nạp cả danh sách, nên không thể ghi lại file — nó thêm mặt hàng mới vào cuối bằng <code>FileWriter(file, true)</code>.</li>
<li><strong>Ba dòng mỗi bản ghi</strong> thay vì một dòng có dấu phẩy: không cần <code>split</code>, tên được phép chứa dấu phẩy — nhưng bên đọc phải lấy đúng ba lần <code>readLine()</code> cho mỗi mặt hàng, thiếu một dòng là mọi thứ phía sau lệch hết.</li>
<li><strong>Không trùng mà không cần xem</strong>: chương trình chỉ đọc các <em>mã</em> đã lưu (<code>storedCodes</code>) và kiểm mã mới với chúng.</li>
</ul>
<p class="meo">🧠 Vì thế "sửa" và "xoá" chỉ áp dụng cho các mặt hàng nhập trong phiên này, chưa lưu. Muốn đổi một bản ghi đã nằm trong file văn bản thì phải ghi lại cả file — đó là việc case study 1 làm, và là việc <code>RandomAccessFile</code> (bài 9.C) tránh được với bản ghi dài cố định.</p>`],
      [27, 'Access Text Files …: Case study 2.-Design',
        `<p class="y-chinh">🎯 Design: package <code>items</code> with <code>Item</code> (code, name, price, getters/setters, <code>print</code>), <code>Menu</code>, <code>NewItems</code> (extends <code>Vector&lt;Item&gt;</code>: <code>addNewItem</code>, <code>appendToFile</code>, <code>find</code>, <code>loadStoredCodes</code>, <code>print</code>, <code>removeItem</code>, <code>updatePrice</code>, <code>valid</code>, and the field <code>storedCodes : Vector&lt;String&gt;</code>) and <code>ItemManager</code> (<code>main</code>). The screenshots: <code>Items.txt</code> before (I001/TV SONY 21/120/I002/DVD SONY S737/80), a session adding I003 "TV samsung" 79, and the file after "Save" with the three new lines at the end.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/395808c08ba9387dbf9406d2371509d48e7af66d.svg" alt="Slide 27 redrawn: NewItems holds only the new items; storedCodes holds the codes already in the file" loading="lazy" /><p class="chu-thich">🧩 Slide 27 redrawn: NewItems holds only the new items; storedCodes holds the codes already in the file</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 27 — case study 2: the accountant ADDS items; the file is only appended to
class "Vector&lt;Item&gt;" as VI
class Item {
  - code : String
  - name : String
  - price : int
  + Item(c : String, n : String, p : int)
  + print() : void
  + getCode() : String
  + getName() : String
  + getPrice() : int
  + setPrice(price : int) : void
}
class NewItems {
  - storedCodes : Vector&lt;String&gt;
  + loadStoredCodes(fName : String) : void
  - valid(aCode : String) : boolean
  - find(aCode : String) : int
  + addNewItem() : void
  + removeItem() : void
  + updatePrice() : void
  + print() : void
  + appendToFile(fName : String) : void
}
class ItemManager {
  + {static} main(args : String[]) : void
}
database "items.txt\\nI001\\nTV SONY 21\\n120\\n(3 lines per item)" as F #FEF3C7
VI &lt;|-- NewItems
NewItems o-- "*" Item : only the NEW items
ItemManager ..&gt; NewItems
NewItems ..&gt; F : loadStoredCodes reads codes only\\nappendToFile: FileWriter(f, true)
note right of NewItems
  storedCodes = codes already in the file
  ⇒ a new code must be in neither list
end note
@enduml</code></pre></details>
<p>Two lists with different jobs: <code>NewItems</code> itself (the <code>Item</code> objects typed in this session) and <code>storedCodes</code> (just the <code>String</code> codes found in the file). A new code must be absent from <strong>both</strong>. After a save, the new items move from the first list into the file, so the program reloads <code>storedCodes</code> and clears the list.</p>
<p>A detail of the screenshot: the file is named <code>Items.txt</code> while the code says <code>"items.txt"</code>. On Windows (NTFS) names are case-insensitive, so it works; on Linux or macOS-with-a-case-sensitive-disk it is "file not found". Match the case exactly.</p>`,
        `<p class="y-chinh">🎯 Thiết kế: gói <code>items</code> gồm <code>Item</code> (mã, tên, giá, getter/setter, <code>print</code>), <code>Menu</code>, <code>NewItems</code> (extends <code>Vector&lt;Item&gt;</code>: <code>addNewItem</code>, <code>appendToFile</code>, <code>find</code>, <code>loadStoredCodes</code>, <code>print</code>, <code>removeItem</code>, <code>updatePrice</code>, <code>valid</code>, và trường <code>storedCodes : Vector&lt;String&gt;</code>) và <code>ItemManager</code> (<code>main</code>). Các ảnh chụp: <code>Items.txt</code> trước (I001/TV SONY 21/120/I002/DVD SONY S737/80), một phiên thêm I003 "TV samsung" 79, và file sau khi "Save" có thêm ba dòng mới ở cuối.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/395808c08ba9387dbf9406d2371509d48e7af66d.svg" alt="Slide 27 vẽ lại: NewItems chỉ giữ các mặt hàng mới; storedCodes giữ các mã đã có trong file" loading="lazy" /><p class="chu-thich">🧩 Slide 27 vẽ lại: NewItems chỉ giữ các mặt hàng mới; storedCodes giữ các mã đã có trong file</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 27 — case study 2: the accountant ADDS items; the file is only appended to
class "Vector&lt;Item&gt;" as VI
class Item {
  - code : String
  - name : String
  - price : int
  + Item(c : String, n : String, p : int)
  + print() : void
  + getCode() : String
  + getName() : String
  + getPrice() : int
  + setPrice(price : int) : void
}
class NewItems {
  - storedCodes : Vector&lt;String&gt;
  + loadStoredCodes(fName : String) : void
  - valid(aCode : String) : boolean
  - find(aCode : String) : int
  + addNewItem() : void
  + removeItem() : void
  + updatePrice() : void
  + print() : void
  + appendToFile(fName : String) : void
}
class ItemManager {
  + {static} main(args : String[]) : void
}
database "items.txt\\nI001\\nTV SONY 21\\n120\\n(3 lines per item)" as F #FEF3C7
VI &lt;|-- NewItems
NewItems o-- "*" Item : only the NEW items
ItemManager ..&gt; NewItems
NewItems ..&gt; F : loadStoredCodes reads codes only\\nappendToFile: FileWriter(f, true)
note right of NewItems
  storedCodes = codes already in the file
  ⇒ a new code must be in neither list
end note
@enduml</code></pre></details>
<p>Hai danh sách, hai nhiệm vụ: chính <code>NewItems</code> (các đối tượng <code>Item</code> nhập trong phiên này) và <code>storedCodes</code> (chỉ các mã <code>String</code> tìm thấy trong file). Mã mới phải vắng mặt ở <strong>cả hai</strong>. Sau một lần lưu, các mặt hàng mới chuyển từ danh sách thứ nhất vào file, nên chương trình nạp lại <code>storedCodes</code> và xoá danh sách.</p>
<p>Một chi tiết của ảnh chụp: file tên <code>Items.txt</code> trong khi code ghi <code>"items.txt"</code>. Trên Windows (NTFS) tên file không phân biệt hoa thường nên vẫn chạy; trên Linux hay macOS dùng ổ phân biệt hoa thường thì "không tìm thấy file". Hãy ghi đúng chữ hoa chữ thường.</p>`],
      [28, 'Access Text Files …: Case study 2- Implementations',
        `<p class="y-chinh">🎯 "Refer to the case study 1. DO YOURSELF": the class <code>Menu</code> (as before), the class <code>Item</code> (private code/name/price, constructor, <code>print()</code>, getters and setters) and the start of <code>NewItems extends Vector&lt;Item&gt;</code> with <code>Scanner sc = new Scanner(System.in)</code>, <code>Vector&lt;String&gt; storedCodes = new Vector&lt;String&gt;()</code> ("stored codes in file") and a constructor.</p>
<pre class="trich"><code class="language-java">class Item {
    private String code;
    private String name;
    private int price;
    public Item(String c, String n, int p) { code = c; name = n; price = p; }
    public void print() { System.out.printf("%-8s%-25s%5d%n", code, name, price); }
    public String getCode() { return code; }
    public String getName() { return name; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
}</code></pre>
<p><code>Item</code> is the same pattern as <code>Employee</code> without <code>Comparable</code> (the new-item list is never sorted). In the runnable version <code>NewItems</code> extends <code>ArrayList&lt;Item&gt;</code> and <code>storedCodes</code> is a <code>List&lt;String&gt;</code> — same methods, no legacy class. And again: no <code>Scanner</code> field inside <code>NewItems</code>; it reads through the single shared <code>Nhap</code> helper of slide 18.</p>
<p>The slides' menu wording also drifts: the problem says "delete an item", the menu says "Remove an item", the third option is "Update an item's price". When you write for a grader, copy the wording of the paper exactly — PE output is compared character by character.</p>
<div class="pitfall">Exercise for yourself before the next slide: with 3 lines per item, how many <code>readLine()</code> calls does it take to collect all the codes of a file with 2 items — and what happens if the last line of the file is missing?</div>`,
        `<p class="y-chinh">🎯 "Refer to the case study 1. DO YOURSELF": lớp <code>Menu</code> (như cũ), lớp <code>Item</code> (mã/tên/giá private, hàm tạo, <code>print()</code>, getter và setter) và phần đầu của <code>NewItems extends Vector&lt;Item&gt;</code> có <code>Scanner sc = new Scanner(System.in)</code>, <code>Vector&lt;String&gt; storedCodes = new Vector&lt;String&gt;()</code> ("các mã đã lưu trong file") và một hàm tạo.</p>
<pre class="trich"><code class="language-java">class Item {
    private String code;
    private String name;
    private int price;
    public Item(String c, String n, int p) { code = c; name = n; price = p; }
    public void print() { System.out.printf("%-8s%-25s%5d%n", code, name, price); }
    public String getCode() { return code; }
    public String getName() { return name; }
    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }
}</code></pre>
<p><code>Item</code> cùng khuôn với <code>Employee</code> nhưng không có <code>Comparable</code> (danh sách mặt hàng mới không bao giờ cần sắp). Trong bản chạy được, <code>NewItems</code> kế thừa <code>ArrayList&lt;Item&gt;</code> và <code>storedCodes</code> là <code>List&lt;String&gt;</code> — cùng phương thức, không dùng lớp đời cũ. Và lần nữa: không có trường <code>Scanner</code> trong <code>NewItems</code>; nó đọc qua lớp phụ <code>Nhap</code> dùng chung của slide 18.</p>
<p>Chữ trên menu của slide cũng xê dịch: đề bài ghi "delete an item", menu ghi "Remove an item", lựa chọn thứ ba là "Update an item's price". Khi viết cho máy chấm, hãy chép đúng từng chữ của đề — output PE được so từng ký tự.</p>
<div class="pitfall">Tự làm trước khi sang slide sau: mỗi mặt hàng 3 dòng, cần bao nhiêu lần <code>readLine()</code> để gom mọi mã của một file có 2 mặt hàng — và chuyện gì xảy ra nếu file thiếu dòng cuối?</div>`],
      [29, 'Access Text Files …: Case study 4.- Implementations',
        `<p class="y-chinh">🎯 (The title says "Case study 4" — a typo for case study 2.) <code>loadStoredCodes(String fName)</code>: clear the stored codes, check the file exists, open <code>FileReader</code> + <code>BufferedReader</code>, and <code>while ((code = bf.readLine()) != null &amp;&amp; (name = bf.readLine()) != null &amp;&amp; (priceStr = bf.readLine()) != null) storedCodes.add(code);</code>, close, catch. Then <code>valid(String aCode)</code>: false if the code is in <code>storedCodes</code> or in the new-item list. <code>find</code> is DO YOURSELF.</p>
<pre class="trich"><code class="language-java">public void loadStoredCodes(String fName) {
    storedCodes.clear();
    File f = new File(fName);
    if (!f.exists()) return;
    try (BufferedReader bf = new BufferedReader(new FileReader(f))) {
        String code, name, priceStr;
        while ((code = bf.readLine()) != null &amp;&amp; (name = bf.readLine()) != null
                &amp;&amp; (priceStr = bf.readLine()) != null) {      // one item = 3 lines; we keep only the code
            storedCodes.add(code.trim());
        }
    } catch (IOException e) {
        System.out.println(e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">private boolean valid(String aCode) {
    for (String c : storedCodes) if (aCode.equals(c)) return false;   // already in the file
    return find(aCode) &lt; 0;                                           // nor in the new-item list
}
private int find(String aCode) {                              // "DO YOURSELF" on slide 29
    for (int i = 0; i &lt; size(); i++) if (get(i).getCode().equals(aCode)) return i;
    return -1;
}</code></pre>
<p>The loop condition reads three lines per turn and keeps going only if <strong>all three</strong> exist: thanks to <code>&amp;&amp;</code>'s short-circuit, the second <code>readLine()</code> runs only if the first returned a line. Answer to the question of slide 28: 2 items need 6 successful reads plus one more that returns <code>null</code>; if the last price line is missing, the last item is silently ignored — its code is never stored, so a duplicate of it would be accepted. A stricter reader counts lines and reports "bad file".</p>
<p><code>name</code> and <code>priceStr</code> are read but not used: they must be read anyway, to move past them to the next code. That is the cost of a line-based format — you cannot jump to record 50 without reading the 49 before it.</p>`,
        `<p class="y-chinh">🎯 (Tiêu đề ghi "Case study 4" — gõ nhầm, đúng là case study 2.) <code>loadStoredCodes(String fName)</code>: xoá các mã đã lưu, kiểm file có tồn tại, mở <code>FileReader</code> + <code>BufferedReader</code>, và <code>while ((code = bf.readLine()) != null &amp;&amp; (name = bf.readLine()) != null &amp;&amp; (priceStr = bf.readLine()) != null) storedCodes.add(code);</code>, đóng, bắt lỗi. Rồi <code>valid(String aCode)</code>: false nếu mã có trong <code>storedCodes</code> hoặc trong danh sách mặt hàng mới. <code>find</code> là DO YOURSELF.</p>
<pre class="trich"><code class="language-java">public void loadStoredCodes(String fName) {
    storedCodes.clear();
    File f = new File(fName);
    if (!f.exists()) return;
    try (BufferedReader bf = new BufferedReader(new FileReader(f))) {
        String code, name, priceStr;
        while ((code = bf.readLine()) != null &amp;&amp; (name = bf.readLine()) != null
                &amp;&amp; (priceStr = bf.readLine()) != null) {      // một mặt hàng = 3 dòng; chỉ giữ mã
            storedCodes.add(code.trim());
        }
    } catch (IOException e) {
        System.out.println(e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">private boolean valid(String aCode) {
    for (String c : storedCodes) if (aCode.equals(c)) return false;   // đã có trong file
    return find(aCode) &lt; 0;                                           // cũng không có trong danh sách mới
}
private int find(String aCode) {                              // "DO YOURSELF" ở slide 29
    for (int i = 0; i &lt; size(); i++) if (get(i).getCode().equals(aCode)) return i;
    return -1;
}</code></pre>
<p>Điều kiện vòng lặp đọc ba dòng mỗi lượt và chỉ đi tiếp khi <strong>cả ba</strong> đều có: nhờ <code>&amp;&amp;</code> đánh giá tắt (short-circuit), lần <code>readLine()</code> thứ hai chỉ chạy khi lần đầu trả về một dòng. Trả lời câu hỏi ở slide 28: 2 mặt hàng cần 6 lần đọc thành công cộng một lần nữa trả <code>null</code>; nếu thiếu dòng giá cuối cùng, mặt hàng cuối bị bỏ qua lặng lẽ — mã của nó không được lưu, nên một mã trùng với nó sẽ được chấp nhận. Bên đọc chặt chẽ hơn sẽ đếm dòng và báo "file hỏng".</p>
<p><code>name</code> và <code>priceStr</code> được đọc mà không dùng: vẫn phải đọc, để đi qua chúng tới mã kế tiếp. Đó là cái giá của định dạng theo dòng — bạn không nhảy được tới bản ghi thứ 50 mà không đọc 49 bản ghi trước.</p>`],
      [30, 'Access Text Files …: Case study 2- Implementations',
        `<p class="y-chinh">🎯 <code>appendToFile(String fName)</code>: if the list is empty print "Empty list"; otherwise <code>boolean append = true</code>, <code>new FileWriter(f, append)</code> ("open file for appending data"), a <code>PrintWriter</code>, and for each item <code>println</code> the code, the name and the price, then <code>pw.flush()</code> ("write to file immediately"); close; then <code>loadStoredCodes(fName)</code> ("reload stored codes") and <code>this.clear()</code> ("clear item list"). The Notepad shows I003 / TV SAMSUNG / 79 added at the end.</p>
<pre class="trich"><code class="language-java">public void appendToFile(String fName) {
    if (this.size() == 0) {
        System.out.println("Empty list");
        return;
    }
    boolean append = true;
    try (PrintWriter pw = new PrintWriter(new FileWriter(new File(fName), append))) {   // open for APPENDING
        for (Item x : this) {
            pw.println(x.getCode());                          // line 1: code
            pw.println(x.getName());                          // line 2: name
            pw.println(x.getPrice());                         // line 3: price
        }
    } catch (IOException e) {
        System.out.println(e);
        return;
    }
    System.out.println(size() + " item(s) appended to " + fName);
    this.loadStoredCodes(fName);                              // reload stored codes
    this.clear();                                             // clear the new-item list
}</code></pre>
<p>The one word that makes this "append": the second argument <code>true</code> of <code>FileWriter</code>. Without it, saving would wipe I001 and I002 — the accountant would destroy data she is not even allowed to see. (Slide 15's run shows both behaviours side by side.)</p>
<p>After the append, the new codes are in the file, so <code>loadStoredCodes</code> reads them back and <code>clear()</code> empties the session list. Saving twice therefore cannot write the same items twice. The slide's <code>pw.flush()</code> inside the loop is not wrong, just unnecessary: <code>close()</code> flushes anyway; flushing after every item only matters if the program might crash before closing.</p>
<div class="pitfall">FE: "Which statement adds content to an existing text file?" → set the <code>append</code> parameter to <strong>true</strong> in the <strong>FileWriter</strong> constructor. <code>File</code> has no append parameter; <code>FileOutputStream(name, true)</code> also appends, but writes bytes, not text.</div>`,
        `<p class="y-chinh">🎯 <code>appendToFile(String fName)</code>: danh sách rỗng thì in "Empty list"; ngược lại <code>boolean append = true</code>, <code>new FileWriter(f, append)</code> ("mở file để ghi nối"), một <code>PrintWriter</code>, và với mỗi mặt hàng <code>println</code> mã, tên và giá, rồi <code>pw.flush()</code> ("ghi xuống file ngay"); đóng; rồi <code>loadStoredCodes(fName)</code> ("nạp lại các mã đã lưu") và <code>this.clear()</code> ("xoá danh sách mặt hàng"). Notepad cho thấy I003 / TV SAMSUNG / 79 được thêm vào cuối.</p>
<pre class="trich"><code class="language-java">public void appendToFile(String fName) {
    if (this.size() == 0) {
        System.out.println("Empty list");
        return;
    }
    boolean append = true;
    try (PrintWriter pw = new PrintWriter(new FileWriter(new File(fName), append))) {   // mở để GHI NỐI
        for (Item x : this) {
            pw.println(x.getCode());                          // dòng 1: mã
            pw.println(x.getName());                          // dòng 2: tên
            pw.println(x.getPrice());                         // dòng 3: giá
        }
    } catch (IOException e) {
        System.out.println(e);
        return;
    }
    System.out.println(size() + " item(s) appended to " + fName);
    this.loadStoredCodes(fName);                              // nạp lại các mã đã lưu
    this.clear();                                             // xoá danh sách mới
}</code></pre>
<p>Đúng một chữ biến việc này thành "ghi nối": đối số thứ hai <code>true</code> của <code>FileWriter</code>. Thiếu nó, lưu sẽ xoá sạch I001 và I002 — người kế toán sẽ phá dữ liệu mà cô ấy còn không được phép xem. (Lần chạy ở slide 15 cho thấy hai hành vi cạnh nhau.)</p>
<p>Sau khi ghi nối, các mã mới đã nằm trong file, nên <code>loadStoredCodes</code> đọc chúng lại và <code>clear()</code> làm rỗng danh sách của phiên. Lưu hai lần vì thế không thể ghi cùng mặt hàng hai lần. <code>pw.flush()</code> trong vòng lặp của slide không sai, chỉ thừa: <code>close()</code> vốn đã flush; flush sau mỗi mặt hàng chỉ có ý nghĩa nếu chương trình có thể sập trước khi đóng.</p>
<div class="pitfall">FE: "Câu lệnh nào ghi thêm nội dung vào file văn bản đã có?" → đặt tham số <code>append</code> = <strong>true</strong> trong hàm tạo của <strong>FileWriter</strong>. <code>File</code> không có tham số append; <code>FileOutputStream(name, true)</code> cũng ghi nối, nhưng ghi byte chứ không phải văn bản.</div>`],
      [31, 'Access Text Files …: Case study 2- Implementations',
        `<p class="y-chinh">🎯 <code>addNewItem()</code>: <code>boolean duplicated = false, matched = true</code>; loop asking "code(format I000):", upper-case, <code>duplicated = !valid(newCode)</code>, <code>matched = newCode.matches("^I\\\\d{3}$")</code> (I and 3 digits), messages "The code is duplicated." / "The code: I and 3 digits.", <code>while (duplicated || !matched)</code>; then name (upper case) and price, add, "New Item has been added.". Then <code>removeItem()</code>, <code>updatePrice()</code>, <code>print()</code> — DO YOURSELF.</p>
<pre class="trich"><code class="language-java">public void addNewItem() {
    String newCode;
    boolean duplicated, matched;
    System.out.println("Enter New Item Details:");
    do {
        newCode = Nhap.dong("   code(format I000): ").trim().toUpperCase();
        duplicated = !valid(newCode);
        matched = newCode.matches("^I\\\\d{3}$");               // pattern: I and 3 digits
        if (duplicated) System.out.println("   The code is duplicated.");
        if (!matched) System.out.println("   The code: I and 3 digits.");
    } while (duplicated || !matched);
    String newName = Nhap.dong("   name: ").trim().toUpperCase();
    int price = Integer.parseInt(Nhap.dong("   price: ").trim());
    this.add(new Item(newCode, newName, price));
    System.out.println("New Item has been added.");
}</code></pre>
<p>Same loop as case study 1, with the uniqueness test moved into <code>valid</code> because it now checks two places. In the run below: "i001" is refused as a duplicate (it is in the file, which the accountant cannot see — she only learns "duplicated"); "I03" fails the pattern; "i003" is accepted.</p>
<p>The three DO YOURSELF methods, written out — all three work on the <strong>new</strong> items only, as the problem demands:</p>
<pre class="trich"><code class="language-java">public void removeItem() {                                    // DO YOURSELF: only from the NEW list
    int pos = find(Nhap.dong("Code of the new item to remove: ").trim().toUpperCase());
    if (pos &lt; 0) System.out.println("Not in the new-item list.");
    else System.out.println("Removed " + remove(pos).getCode() + ".");
}
public void updatePrice() {                                   // DO YOURSELF
    int pos = find(Nhap.dong("Code of the new item to update: ").trim().toUpperCase());
    if (pos &lt; 0) { System.out.println("Not in the new-item list."); return; }
    get(pos).setPrice(Integer.parseInt(Nhap.dong("   new price: ").trim()));
    System.out.println("Updated.");
}
public void print() {                                         // DO YOURSELF: the NEW items only
    if (size() == 0) { System.out.println("Empty List."); return; }
    System.out.println("\\nNEW-ITEM LIST");
    System.out.println("-------------------------------------");
    for (Item x : this) x.print();
}</code></pre>`,
        `<p class="y-chinh">🎯 <code>addNewItem()</code>: <code>boolean duplicated = false, matched = true</code>; vòng lặp hỏi "code(format I000):", viết hoa, <code>duplicated = !valid(newCode)</code>, <code>matched = newCode.matches("^I\\\\d{3}$")</code> (I và 3 chữ số), thông báo "The code is duplicated." / "The code: I and 3 digits.", <code>while (duplicated || !matched)</code>; rồi tên (chữ hoa) và giá, thêm vào, "New Item has been added.". Sau đó <code>removeItem()</code>, <code>updatePrice()</code>, <code>print()</code> — DO YOURSELF.</p>
<pre class="trich"><code class="language-java">public void addNewItem() {
    String newCode;
    boolean duplicated, matched;
    System.out.println("Enter New Item Details:");
    do {
        newCode = Nhap.dong("   code(format I000): ").trim().toUpperCase();
        duplicated = !valid(newCode);
        matched = newCode.matches("^I\\\\d{3}$");               // mẫu: I và 3 chữ số
        if (duplicated) System.out.println("   The code is duplicated.");
        if (!matched) System.out.println("   The code: I and 3 digits.");
    } while (duplicated || !matched);
    String newName = Nhap.dong("   name: ").trim().toUpperCase();
    int price = Integer.parseInt(Nhap.dong("   price: ").trim());
    this.add(new Item(newCode, newName, price));
    System.out.println("New Item has been added.");
}</code></pre>
<p>Cùng vòng lặp với case study 1, phần kiểm không trùng chuyển vào <code>valid</code> vì giờ phải kiểm hai nơi. Trong lần chạy bên dưới: "i001" bị từ chối vì trùng (nó nằm trong file mà người kế toán không được xem — cô ấy chỉ biết "duplicated"); "I03" sai mẫu; "i003" được nhận.</p>
<p>Ba phương thức DO YOURSELF, viết ra — cả ba chỉ làm việc trên các mặt hàng <strong>mới</strong>, đúng như đề yêu cầu:</p>
<pre class="trich"><code class="language-java">public void removeItem() {                                    // DO YOURSELF: chỉ trong danh sách MỚI
    int pos = find(Nhap.dong("Code of the new item to remove: ").trim().toUpperCase());
    if (pos &lt; 0) System.out.println("Not in the new-item list.");
    else System.out.println("Removed " + remove(pos).getCode() + ".");
}
public void updatePrice() {                                   // tự làm
    int pos = find(Nhap.dong("Code of the new item to update: ").trim().toUpperCase());
    if (pos &lt; 0) { System.out.println("Not in the new-item list."); return; }
    get(pos).setPrice(Integer.parseInt(Nhap.dong("   new price: ").trim()));
    System.out.println("Updated.");
}
public void print() {                                         // DO YOURSELF: chỉ mặt hàng MỚI
    if (size() == 0) { System.out.println("Empty List."); return; }
    System.out.println("\\nNEW-ITEM LIST");
    System.out.println("-------------------------------------");
    for (Item x : this) x.print();
}</code></pre>`],
      [32, 'Access Text Files …: Case study 2- Implementations',
        `<p class="y-chinh">🎯 <code>ItemManager.main</code>, part 1: <code>filename = "items.txt"</code>, a <code>Scanner</code>, a <code>Menu</code> with "Add new item", "Remove an item", "Update an item's price", "Print the list", "Save to files", "Quit", <code>int userChoice</code>, <code>NewItems list = new NewItems()</code> and <code>list.loadStoredCodes(filename)</code> ("load initial data"); the Output window shows the menu and "Select 1..6: 1".</p>
<pre class="trich"><code class="language-java">String filename = "items.txt";
String[] menu = { "Add new item", "Remove an item", "Update an item's price", "Print the list", "Save to files", "Quit" };
NewItems list = new NewItems();
list.loadStoredCodes(filename);                           // load initial data
int userChoice;
do {
    System.out.println("\\nNEW ITEM MANAGER");
    for (int i = 0; i &lt; menu.length; i++) System.out.print((i + 1) + "-" + menu[i] + (i % 3 == 2 ? "\\n" : "   "));
    userChoice = Integer.parseInt(Nhap.dong("Select 1..6: ").trim());
    switch (userChoice) {
        case 1: list.addNewItem(); break;
        case 2: list.removeItem(); break;
        case 3: list.updatePrice(); break;
        case 4: list.print(); break;
        case 5: list.appendToFile(filename); break;
        case 6:
            if (list.size() &gt; 0 &amp;&amp; Nhap.dong("Save changes Y/N? ").trim().toUpperCase().startsWith("Y"))
                list.appendToFile(filename);
            break;
    }
} while (userChoice &gt; 0 &amp;&amp; userChoice &lt; 6);</code></pre>
<p>Compared with case study 1, "load initial data" loads only codes — the program starts with an <strong>empty</strong> item list, and "Print the list" shows only what was typed in this session ("NEW-ITEM LIST"). There is also no <code>changed</code> flag: the list itself says whether anything is unsaved (<code>list.size() &gt; 0</code>), which is simpler and cannot get out of sync.</p>
<p>The runnable version prints the six options on two lines to keep the transcript short, and the <code>items.txt</code> of the screenshot is created first (region <code>chuanbi</code> of the file) so every run starts from the same data.</p>`,
        `<p class="y-chinh">🎯 <code>ItemManager.main</code>, phần 1: <code>filename = "items.txt"</code>, một <code>Scanner</code>, một <code>Menu</code> gồm "Add new item", "Remove an item", "Update an item's price", "Print the list", "Save to files", "Quit", <code>int userChoice</code>, <code>NewItems list = new NewItems()</code> và <code>list.loadStoredCodes(filename)</code> ("nạp dữ liệu ban đầu"); cửa sổ Output hiện menu và "Select 1..6: 1".</p>
<pre class="trich"><code class="language-java">String filename = "items.txt";
String[] menu = { "Add new item", "Remove an item", "Update an item's price", "Print the list", "Save to files", "Quit" };
NewItems list = new NewItems();
list.loadStoredCodes(filename);                           // nạp dữ liệu ban đầu
int userChoice;
do {
    System.out.println("\\nNEW ITEM MANAGER");
    for (int i = 0; i &lt; menu.length; i++) System.out.print((i + 1) + "-" + menu[i] + (i % 3 == 2 ? "\\n" : "   "));
    userChoice = Integer.parseInt(Nhap.dong("Select 1..6: ").trim());
    switch (userChoice) {
        case 1: list.addNewItem(); break;
        case 2: list.removeItem(); break;
        case 3: list.updatePrice(); break;
        case 4: list.print(); break;
        case 5: list.appendToFile(filename); break;
        case 6:
            if (list.size() &gt; 0 &amp;&amp; Nhap.dong("Save changes Y/N? ").trim().toUpperCase().startsWith("Y"))
                list.appendToFile(filename);
            break;
    }
} while (userChoice &gt; 0 &amp;&amp; userChoice &lt; 6);</code></pre>
<p>So với case study 1, "nạp dữ liệu ban đầu" chỉ nạp mã — chương trình bắt đầu với danh sách mặt hàng <strong>rỗng</strong>, và "Print the list" chỉ hiện những gì nhập trong phiên này ("NEW-ITEM LIST"). Cũng không có cờ <code>changed</code>: chính danh sách cho biết có gì chưa lưu (<code>list.size() &gt; 0</code>), đơn giản hơn và không bao giờ lệch nhau.</p>
<p>Bản chạy được in sáu lựa chọn trên hai dòng cho bản ghi ngắn, và <code>items.txt</code> của ảnh chụp được tạo trước (vùng <code>chuanbi</code> của file) để lần chạy nào cũng bắt đầu từ cùng dữ liệu.</p>`],
      [33, 'Access Text Files …: Case study 2- Implementations',
        `<p class="y-chinh">🎯 <code>main</code>, part 2: the <code>do … while (userChoice &gt; 0 &amp;&amp; userChoice &lt; 6)</code> loop with "NEW ITEM MANAGER" and a <code>switch</code> (1 add, 2 remove, 3 update price, 4 print, 5 <code>appendToFile</code>, <code>default</code>: if the list is not empty ask "Save changes Y/N?" and append on "Y"). The Output: add I003 TV samsung 79, print "NEW-ITEM LIST — I003 TV SAMSUNG 79", then "Select 1..6: 5".</p>
<p>The program, run: add with a duplicate and a bad code, add a second item, update its price, print, save (append), add once more — "i003" is now refused because it was reloaded from the file — and quit answering "y":</p>
<div class="out"><br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Item Details:<br>
&nbsp;&nbsp;&nbsp;code(format I000): i001<br>
&nbsp;&nbsp;&nbsp;The code is duplicated.<br>
&nbsp;&nbsp;&nbsp;code(format I000): I03<br>
&nbsp;&nbsp;&nbsp;The code: I and 3 digits.<br>
&nbsp;&nbsp;&nbsp;code(format I000): i003<br>
&nbsp;&nbsp;&nbsp;name: TV samsung<br>
&nbsp;&nbsp;&nbsp;price: 79<br>
New Item has been added.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Item Details:<br>
&nbsp;&nbsp;&nbsp;code(format I000): i004<br>
&nbsp;&nbsp;&nbsp;name: loa jbl<br>
&nbsp;&nbsp;&nbsp;price: 45<br>
New Item has been added.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 3<br>
Code of the new item to update: I004<br>
&nbsp;&nbsp;&nbsp;new price: 50<br>
Updated.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 4<br>
<br>
NEW-ITEM LIST<br>
-------------------------------------<br>
I003 &nbsp;&nbsp;&nbsp;TV SAMSUNG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;79<br>
I004 &nbsp;&nbsp;&nbsp;LOA JBL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 5<br>
2 item(s) appended to items.txt<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Item Details:<br>
&nbsp;&nbsp;&nbsp;code(format I000): i003<br>
&nbsp;&nbsp;&nbsp;The code is duplicated.<br>
&nbsp;&nbsp;&nbsp;code(format I000): i005<br>
&nbsp;&nbsp;&nbsp;name: quat panasonic<br>
&nbsp;&nbsp;&nbsp;price: 30<br>
New Item has been added.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 6<br>
Save changes Y/N? y<br>
1 item(s) appended to items.txt<br>
<br>
--- items.txt after the program ended ---<br>
I001<br>
TV SONY 21<br>
120<br>
I002<br>
DVD SONY S737<br>
80<br>
I003<br>
TV SAMSUNG<br>
79<br>
I004<br>
LOA JBL<br>
50<br>
I005<br>
QUAT PANASONIC<br>
30</div>
<p>The final file holds the two original items untouched, then I003 and I004 (first save), then I005 (saved on quit). Three lines per item, nothing rewritten. This program uses <code>case 6</code> instead of the slide's <code>default</code>, so an unexpected number does not trigger the save question.</p>
<div class="callout">➕ Text, appended, three lines per record — the same idea as a <strong>log file</strong>: servers append lines and never rewrite. When you meet <code>logback</code> or <code>log4j</code> in Spring Boot, they do exactly <code>new FileWriter(file, true)</code>, with buffering and rotation added.</div>`,
        `<p class="y-chinh">🎯 <code>main</code>, phần 2: vòng <code>do … while (userChoice &gt; 0 &amp;&amp; userChoice &lt; 6)</code> với "NEW ITEM MANAGER" và một <code>switch</code> (1 thêm, 2 xoá, 3 sửa giá, 4 in, 5 <code>appendToFile</code>, <code>default</code>: nếu danh sách không rỗng thì hỏi "Save changes Y/N?" và ghi nối khi trả lời "Y"). Output: thêm I003 TV samsung 79, in "NEW-ITEM LIST — I003 TV SAMSUNG 79", rồi "Select 1..6: 5".</p>
<p>Chương trình chạy thật: thêm với một mã trùng và một mã sai mẫu, thêm mặt hàng thứ hai, sửa giá của nó, in, lưu (ghi nối), thêm lần nữa — "i003" giờ bị từ chối vì đã được nạp lại từ file — và thoát, trả lời "y":</p>
<div class="out"><br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Item Details:<br>
&nbsp;&nbsp;&nbsp;code(format I000): i001<br>
&nbsp;&nbsp;&nbsp;The code is duplicated.<br>
&nbsp;&nbsp;&nbsp;code(format I000): I03<br>
&nbsp;&nbsp;&nbsp;The code: I and 3 digits.<br>
&nbsp;&nbsp;&nbsp;code(format I000): i003<br>
&nbsp;&nbsp;&nbsp;name: TV samsung<br>
&nbsp;&nbsp;&nbsp;price: 79<br>
New Item has been added.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Item Details:<br>
&nbsp;&nbsp;&nbsp;code(format I000): i004<br>
&nbsp;&nbsp;&nbsp;name: loa jbl<br>
&nbsp;&nbsp;&nbsp;price: 45<br>
New Item has been added.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 3<br>
Code of the new item to update: I004<br>
&nbsp;&nbsp;&nbsp;new price: 50<br>
Updated.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 4<br>
<br>
NEW-ITEM LIST<br>
-------------------------------------<br>
I003 &nbsp;&nbsp;&nbsp;TV SAMSUNG &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;79<br>
I004 &nbsp;&nbsp;&nbsp;LOA JBL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 5<br>
2 item(s) appended to items.txt<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 1<br>
Enter New Item Details:<br>
&nbsp;&nbsp;&nbsp;code(format I000): i003<br>
&nbsp;&nbsp;&nbsp;The code is duplicated.<br>
&nbsp;&nbsp;&nbsp;code(format I000): i005<br>
&nbsp;&nbsp;&nbsp;name: quat panasonic<br>
&nbsp;&nbsp;&nbsp;price: 30<br>
New Item has been added.<br>
<br>
NEW ITEM MANAGER<br>
1-Add new item &nbsp;&nbsp;2-Remove an item &nbsp;&nbsp;3-Update an item's price<br>
4-Print the list &nbsp;&nbsp;5-Save to files &nbsp;&nbsp;6-Quit<br>
Select 1..6: 6<br>
Save changes Y/N? y<br>
1 item(s) appended to items.txt<br>
<br>
--- items.txt after the program ended ---<br>
I001<br>
TV SONY 21<br>
120<br>
I002<br>
DVD SONY S737<br>
80<br>
I003<br>
TV SAMSUNG<br>
79<br>
I004<br>
LOA JBL<br>
50<br>
I005<br>
QUAT PANASONIC<br>
30</div>
<p>File cuối cùng giữ nguyên hai mặt hàng ban đầu, rồi I003 và I004 (lần lưu thứ nhất), rồi I005 (lưu khi thoát). Ba dòng mỗi mặt hàng, không ghi lại gì. Chương trình này dùng <code>case 6</code> thay cho <code>default</code> của slide, để một con số ngoài dự kiến không làm hiện câu hỏi lưu.</p>
<div class="callout">➕ Văn bản, ghi nối, ba dòng mỗi bản ghi — cùng ý tưởng với một <strong>file log</strong>: server chỉ ghi nối dòng mới và không bao giờ ghi lại. Khi gặp <code>logback</code> hay <code>log4j</code> trong Spring Boot, chúng làm đúng <code>new FileWriter(file, true)</code>, thêm bộ đệm và xoay vòng file.</div>`],
      [34, 'Access Text Files …: Read UTF-8 File content',
        `<p class="y-chinh">🎯 "UTF-8 content is stored in compressed format → a character will be stored in 1 to 3 bytes. Before reading UTF, decompressing is needed." Two snippets: <code>FileInputStream</code> (for reading bytes) → <code>InputStreamReader(f, "UTF8")</code> (for reading a Unicode character, "or UTF-8") → <code>read()</code> char by char; or the same plus a <code>BufferedReader</code> (for reading a character or a string) and <code>readLine()</code>.</p>
<p>This is the most useful slide of the deck for Vietnamese students — and the reason is the class it does <em>not</em> use. <code>FileReader</code> and <code>FileWriter</code> on JDK 8 always use the machine's <strong>default encoding</strong>; on an English-language Windows PC (the usual lab setup) that is <code>windows-1252</code>. Measured by running the same program with the two defaults:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    d.mkdirs();
    try (Writer w = new OutputStreamWriter(new FileOutputStream(new File(d, "ten.txt")), "UTF-8")) {
        w.write("Nguyễn Văn Ánh\\nTrần Thị Hoà\\n");          // a UTF-8 file, as Notepad, VS Code or NetBeans save it today
    }
    viet(d, "DocMacDinh.java",
        "import java.io.*;\\n" +
        "public class DocMacDinh {\\n" +
        "    public static void main(String[] args) throws IOException {\\n" +
        "        PrintStream out = new PrintStream(new FileOutputStream(FileDescriptor.out), true, \\"UTF-8\\");\\n" +
        "        out.println(\\"file.encoding = \\" + System.getProperty(\\"file.encoding\\"));\\n" +
        "        try (BufferedReader br = new BufferedReader(new FileReader(\\"ten.txt\\"))) {\\n" +
        "            for (String s; (s = br.readLine()) != null; ) out.println(\\"read : \\" + s);\\n" +
        "        }\\n" +
        "        try (FileWriter fw = new FileWriter(\\"ghi.txt\\")) { fw.write(\\"Lê Văn Đạt\\"); }\\n" +
        "        out.println(\\"wrote: \\" + Hex.of(\\"ghi.txt\\"));\\n" +
        "    }\\n" +
        "}\\n");
    viet(d, "DocDung.java",
        "import java.io.*;\\n" +
        "import java.nio.charset.StandardCharsets;\\n" +
        "import java.nio.file.*;\\n" +
        "public class DocDung {\\n" +
        "    public static void main(String[] args) throws IOException {\\n" +
        "        PrintStream out = new PrintStream(new FileOutputStream(FileDescriptor.out), true, \\"UTF-8\\");\\n" +
        "        out.println(\\"file.encoding = \\" + System.getProperty(\\"file.encoding\\"));\\n" +
        "        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(\\"ten.txt\\"), \\"UTF-8\\"))) {\\n" +
        "            for (String s; (s = br.readLine()) != null; ) out.println(\\"read : \\" + s);\\n" +
        "        }\\n" +
        "        try (BufferedReader br = Files.newBufferedReader(Paths.get(\\"ten.txt\\"), StandardCharsets.UTF_8)) {\\n" +
        "            out.println(\\"Files: \\" + br.readLine());\\n" +
        "        }\\n" +
        "        try (Writer w = new OutputStreamWriter(new FileOutputStream(\\"ghi.txt\\"), \\"UTF-8\\")) { w.write(\\"Lê Văn Đạt\\"); }\\n" +
        "        out.println(\\"wrote: \\" + Hex.of(\\"ghi.txt\\"));\\n" +
        "    }\\n" +
        "}\\n");
    viet(d, "Hex.java",
        "import java.nio.file.*;\\n" +
        "class Hex {\\n" +
        "    static String of(String f) throws java.io.IOException {\\n" +
        "        StringBuilder sb = new StringBuilder();\\n" +
        "        for (byte b : Files.readAllBytes(Paths.get(f))) sb.append(String.format(\\"%02X \\", b &amp; 0xFF));\\n" +
        "        return sb.toString().trim();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "-encoding", "UTF-8", "DocMacDinh.java", "DocDung.java", "Hex.java");
    System.out.println("== the lab PC: English Windows, JDK 8 -&gt; default windows-1252 ==");
    lenh(d, "java", "-Dfile.encoding=Cp1252", "DocMacDinh");
    System.out.println("== a Mac/Linux machine (or any JDK 18+) -&gt; default UTF-8 ==");
    lenh(d, "java", "-Dfile.encoding=UTF-8", "DocMacDinh");
    System.out.println("== the fix: say \\"UTF-8\\" yourself, then the default no longer matters ==");
    lenh(d, "java", "-Dfile.encoding=Cp1252", "DocDung");
    System.out.println("== the Java 11 shortcut does not exist on JDK 8 ==");
    viet(d, "Java11.java",
        "import java.io.*;\\n" +
        "import java.nio.charset.StandardCharsets;\\n" +
        "public class Java11 {\\n" +
        "    public static void main(String[] args) throws IOException {\\n" +
        "        BufferedReader br = new BufferedReader(new FileReader(\\"ten.txt\\", StandardCharsets.UTF_8));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Java11.java");
}</code></pre>
<div class="out">&gt; javac -encoding UTF-8 DocMacDinh.java DocDung.java Hex.java<br>
== the lab PC: English Windows, JDK 8 -&gt; default windows-1252 ==<br>
&gt; java -Dfile.encoding=Cp1252 DocMacDinh<br>
file.encoding = Cp1252<br>
read : Nguyá»…n VÄƒn Ã�nh<br>
read : Tráº§n Thá»‹ HoÃ<br>
wrote: 4C EA 20 56 3F 6E 20 3F 3F 74<br>
== a Mac/Linux machine (or any JDK 18+) -&gt; default UTF-8 ==<br>
&gt; java -Dfile.encoding=UTF-8 DocMacDinh<br>
file.encoding = UTF-8<br>
read : Nguyễn Văn Ánh<br>
read : Trần Thị Hoà<br>
wrote: 4C C3 AA 20 56 C4 83 6E 20 C4 90 E1 BA A1 74<br>
== the fix: say "UTF-8" yourself, then the default no longer matters ==<br>
&gt; java -Dfile.encoding=Cp1252 DocDung<br>
file.encoding = Cp1252<br>
read : Nguyễn Văn Ánh<br>
read : Trần Thị Hoà<br>
Files: Nguyễn Văn Ánh<br>
wrote: 4C C3 AA 20 56 C4 83 6E 20 C4 90 E1 BA A1 74<br>
== the Java 11 shortcut does not exist on JDK 8 ==<br>
&gt; javac Java11.java<br>
Java11.java:5: error: no suitable constructor found for FileReader(String,Charset)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedReader br = new BufferedReader(new FileReader("ten.txt", StandardCharsets.UTF_8));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;constructor FileReader.FileReader(String) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length)<br>
&nbsp;&nbsp;&nbsp;&nbsp;constructor FileReader.FileReader(File) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length)<br>
&nbsp;&nbsp;&nbsp;&nbsp;constructor FileReader.FileReader(FileDescriptor) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length)<br>
1 error<br>
(exit code 1)</div>
<ul>
<li>With <code>Cp1252</code> (the lab PC), reading a UTF-8 file gives "Nguyá»…n VÄƒn Ã�nh" — each Vietnamese letter's 2–3 bytes were decoded as 2–3 Western characters. Writing "Lê Văn Đạt" stored <code>3F</code> = '?' for "ă", "Đ" and "ạ": those letters are <strong>lost</strong>, not just garbled.</li>
<li>With <code>UTF-8</code> (macOS, Linux, and every JDK from 18 on — JEP 400 made UTF-8 the default) the same program is correct. That is why code that works on your laptop can break in the lab.</li>
<li><code>DocDung</code> names "UTF-8" (the slide's way, <code>InputStreamReader</code>/<code>OutputStreamWriter</code>) or uses <code>Files.newBufferedReader(Paths.get(…), StandardCharsets.UTF_8)</code> (Java 7+): correct whatever the default.</li>
</ul>
<div class="pitfall">The slide's code does not compile as printed: <code>in.read()</code> (the variable is <code>isr</code>), <code>br.readline()</code> (it is <code>readLine</code>), and the curly quotes “ ” from PowerPoint — javac reports "illegal character: '“'". "1 to 3 bytes" is the rule of Java's <em>modified</em> UTF-8 used by <code>writeUTF</code>; real UTF-8 uses <strong>1 to 4</strong> bytes (the emoji of slide 6). And <code>content += s</code> in a loop copies the whole string every time — use a <code>StringBuilder</code>. Finally, <code>new FileReader(f, StandardCharsets.UTF_8)</code> from a modern tutorial is <strong>Java 11</strong>: on JDK 8 it is the compile error shown above.</div>`,
        `<p class="y-chinh">🎯 "Nội dung UTF-8 được lưu dạng nén → một ký tự chiếm 1 tới 3 byte. Trước khi đọc UTF cần giải nén." Hai đoạn code: <code>FileInputStream</code> (để đọc byte) → <code>InputStreamReader(f, "UTF8")</code> (để đọc một ký tự Unicode, "hoặc UTF-8") → <code>read()</code> từng ký tự; hoặc như vậy cộng thêm <code>BufferedReader</code> (để đọc một ký tự hay một chuỗi) và <code>readLine()</code>.</p>
<p>Đây là slide có ích nhất của bộ slide với sinh viên Việt Nam — và lý do nằm ở lớp mà nó <em>không</em> dùng. <code>FileReader</code> và <code>FileWriter</code> trên JDK 8 luôn dùng <strong>bảng mã mặc định</strong> của máy; trên một máy Windows tiếng Anh (cấu hình thường gặp ở phòng lab) đó là <code>windows-1252</code>. Đo bằng cách chạy cùng một chương trình với hai mặc định:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    d.mkdirs();
    try (Writer w = new OutputStreamWriter(new FileOutputStream(new File(d, "ten.txt")), "UTF-8")) {
        w.write("Nguyễn Văn Ánh\\nTrần Thị Hoà\\n");          // một file UTF-8, như Notepad, VS Code hay NetBeans lưu ngày nay
    }
    viet(d, "DocMacDinh.java",
        "import java.io.*;\\n" +
        "public class DocMacDinh {\\n" +
        "    public static void main(String[] args) throws IOException {\\n" +
        "        PrintStream out = new PrintStream(new FileOutputStream(FileDescriptor.out), true, \\"UTF-8\\");\\n" +
        "        out.println(\\"file.encoding = \\" + System.getProperty(\\"file.encoding\\"));\\n" +
        "        try (BufferedReader br = new BufferedReader(new FileReader(\\"ten.txt\\"))) {\\n" +
        "            for (String s; (s = br.readLine()) != null; ) out.println(\\"read : \\" + s);\\n" +
        "        }\\n" +
        "        try (FileWriter fw = new FileWriter(\\"ghi.txt\\")) { fw.write(\\"Lê Văn Đạt\\"); }\\n" +
        "        out.println(\\"wrote: \\" + Hex.of(\\"ghi.txt\\"));\\n" +
        "    }\\n" +
        "}\\n");
    viet(d, "DocDung.java",
        "import java.io.*;\\n" +
        "import java.nio.charset.StandardCharsets;\\n" +
        "import java.nio.file.*;\\n" +
        "public class DocDung {\\n" +
        "    public static void main(String[] args) throws IOException {\\n" +
        "        PrintStream out = new PrintStream(new FileOutputStream(FileDescriptor.out), true, \\"UTF-8\\");\\n" +
        "        out.println(\\"file.encoding = \\" + System.getProperty(\\"file.encoding\\"));\\n" +
        "        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(\\"ten.txt\\"), \\"UTF-8\\"))) {\\n" +
        "            for (String s; (s = br.readLine()) != null; ) out.println(\\"read : \\" + s);\\n" +
        "        }\\n" +
        "        try (BufferedReader br = Files.newBufferedReader(Paths.get(\\"ten.txt\\"), StandardCharsets.UTF_8)) {\\n" +
        "            out.println(\\"Files: \\" + br.readLine());\\n" +
        "        }\\n" +
        "        try (Writer w = new OutputStreamWriter(new FileOutputStream(\\"ghi.txt\\"), \\"UTF-8\\")) { w.write(\\"Lê Văn Đạt\\"); }\\n" +
        "        out.println(\\"wrote: \\" + Hex.of(\\"ghi.txt\\"));\\n" +
        "    }\\n" +
        "}\\n");
    viet(d, "Hex.java",
        "import java.nio.file.*;\\n" +
        "class Hex {\\n" +
        "    static String of(String f) throws java.io.IOException {\\n" +
        "        StringBuilder sb = new StringBuilder();\\n" +
        "        for (byte b : Files.readAllBytes(Paths.get(f))) sb.append(String.format(\\"%02X \\", b &amp; 0xFF));\\n" +
        "        return sb.toString().trim();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "-encoding", "UTF-8", "DocMacDinh.java", "DocDung.java", "Hex.java");
    System.out.println("== the lab PC: English Windows, JDK 8 -&gt; default windows-1252 ==");
    lenh(d, "java", "-Dfile.encoding=Cp1252", "DocMacDinh");
    System.out.println("== a Mac/Linux machine (or any JDK 18+) -&gt; default UTF-8 ==");
    lenh(d, "java", "-Dfile.encoding=UTF-8", "DocMacDinh");
    System.out.println("== the fix: say \\"UTF-8\\" yourself, then the default no longer matters ==");
    lenh(d, "java", "-Dfile.encoding=Cp1252", "DocDung");
    System.out.println("== the Java 11 shortcut does not exist on JDK 8 ==");
    viet(d, "Java11.java",
        "import java.io.*;\\n" +
        "import java.nio.charset.StandardCharsets;\\n" +
        "public class Java11 {\\n" +
        "    public static void main(String[] args) throws IOException {\\n" +
        "        BufferedReader br = new BufferedReader(new FileReader(\\"ten.txt\\", StandardCharsets.UTF_8));\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Java11.java");
}</code></pre>
<div class="out">&gt; javac -encoding UTF-8 DocMacDinh.java DocDung.java Hex.java<br>
== the lab PC: English Windows, JDK 8 -&gt; default windows-1252 ==<br>
&gt; java -Dfile.encoding=Cp1252 DocMacDinh<br>
file.encoding = Cp1252<br>
read : Nguyá»…n VÄƒn Ã�nh<br>
read : Tráº§n Thá»‹ HoÃ<br>
wrote: 4C EA 20 56 3F 6E 20 3F 3F 74<br>
== a Mac/Linux machine (or any JDK 18+) -&gt; default UTF-8 ==<br>
&gt; java -Dfile.encoding=UTF-8 DocMacDinh<br>
file.encoding = UTF-8<br>
read : Nguyễn Văn Ánh<br>
read : Trần Thị Hoà<br>
wrote: 4C C3 AA 20 56 C4 83 6E 20 C4 90 E1 BA A1 74<br>
== the fix: say "UTF-8" yourself, then the default no longer matters ==<br>
&gt; java -Dfile.encoding=Cp1252 DocDung<br>
file.encoding = Cp1252<br>
read : Nguyễn Văn Ánh<br>
read : Trần Thị Hoà<br>
Files: Nguyễn Văn Ánh<br>
wrote: 4C C3 AA 20 56 C4 83 6E 20 C4 90 E1 BA A1 74<br>
== the Java 11 shortcut does not exist on JDK 8 ==<br>
&gt; javac Java11.java<br>
Java11.java:5: error: no suitable constructor found for FileReader(String,Charset)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BufferedReader br = new BufferedReader(new FileReader("ten.txt", StandardCharsets.UTF_8));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;constructor FileReader.FileReader(String) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length)<br>
&nbsp;&nbsp;&nbsp;&nbsp;constructor FileReader.FileReader(File) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length)<br>
&nbsp;&nbsp;&nbsp;&nbsp;constructor FileReader.FileReader(FileDescriptor) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length)<br>
1 error<br>
(exit code 1)</div>
<ul>
<li>Với <code>Cp1252</code> (máy phòng lab), đọc một file UTF-8 ra "Nguyá»…n VÄƒn Ã�nh" — 2–3 byte của mỗi chữ Việt bị giải mã thành 2–3 ký tự Tây Âu. Ghi "Lê Văn Đạt" thì lưu <code>3F</code> = '?' cho "ă", "Đ" và "ạ": các chữ đó <strong>mất hẳn</strong>, không chỉ bị méo.</li>
<li>Với <code>UTF-8</code> (macOS, Linux, và mọi JDK từ 18 trở đi — JEP 400 đặt UTF-8 làm mặc định) cùng chương trình chạy đúng. Đó là lý do code chạy tốt trên laptop của bạn lại hỏng ở phòng lab.</li>
<li><code>DocDung</code> gọi tên "UTF-8" (cách của slide, <code>InputStreamReader</code>/<code>OutputStreamWriter</code>) hoặc dùng <code>Files.newBufferedReader(Paths.get(…), StandardCharsets.UTF_8)</code> (Java 7+): đúng bất kể mặc định là gì.</li>
</ul>
<div class="pitfall">Code của slide in ra không biên dịch được: <code>in.read()</code> (biến tên là <code>isr</code>), <code>br.readline()</code> (đúng là <code>readLine</code>), và dấu ngoặc kép cong “ ” do PowerPoint tự đổi — javac báo "illegal character: '“'". "1 tới 3 byte" là luật của UTF-8 <em>cải biên</em> (modified UTF-8) mà <code>writeUTF</code> của Java dùng; UTF-8 thật dùng <strong>1 tới 4</strong> byte (emoji ở slide 6). Và <code>content += s</code> trong vòng lặp chép lại cả chuỗi mỗi lần — hãy dùng <code>StringBuilder</code>. Cuối cùng, <code>new FileReader(f, StandardCharsets.UTF_8)</code> chép từ bài hướng dẫn hiện đại là <strong>Java 11</strong>: trên JDK 8 nó là lỗi biên dịch như ở trên.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>A program writes with <code>new PrintWriter(new FileWriter("out.txt"))</code>, calls <code>println</code> three times and ends without <code>close()</code>. How many bytes does <code>out.txt</code> have? Fix it with one keyword.</li>
<li>Write the reader that turns a line <code>"E002, TRAN VAN LONG , 215"</code> into an <code>Employee</code> without exceptions.</li>
<li>Why does a program with a <code>Scanner</code> in <code>main</code> and another in a helper class work when you type, but fail on the PE grader?</li>
<li>Case study 2 saves with <code>new FileWriter(f)</code> by mistake. What does the accountant lose?</li>
<li>Write the two lines that read a UTF-8 file line by line on JDK 8, correct on any machine.</li>
</ul>
<p>Continue with <strong>9.C</strong>: binary files, <code>RandomAccessFile</code>, data streams, and saving whole objects.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Một chương trình ghi bằng <code>new PrintWriter(new FileWriter("out.txt"))</code>, gọi <code>println</code> ba lần rồi kết thúc mà không <code>close()</code>. <code>out.txt</code> có bao nhiêu byte? Sửa bằng một từ khoá.</li>
<li>Viết đoạn đọc biến dòng <code>"E002, TRAN VAN LONG , 215"</code> thành một <code>Employee</code> mà không ném ngoại lệ.</li>
<li>Vì sao chương trình có một <code>Scanner</code> trong <code>main</code> và một cái khác trong lớp phụ chạy được khi bạn gõ, nhưng hỏng trên máy chấm PE?</li>
<li>Case study 2 lỡ lưu bằng <code>new FileWriter(f)</code>. Người kế toán mất gì?</li>
<li>Viết hai dòng đọc một file UTF-8 từng dòng trên JDK 8, đúng trên mọi máy.</li>
</ul>
<p>Học tiếp <strong>9.C</strong>: file nhị phân, <code>RandomAccessFile</code>, luồng dữ liệu, và lưu cả đối tượng.</p>`),
    books([
      ['horstmann2', 'Ch. 2.2 "Reading and Writing Text Input and Output" (text output, text input, saving objects in text format, character encodings)', 'Chương 2.2 "Reading and Writing Text Input and Output" (ghi văn bản, đọc văn bản, lưu đối tượng dạng văn bản, bảng mã ký tự)'],
      ['horstmann1', 'Ch. 7.2 "Catching Exceptions" and 7.2.5 "The try-with-Resources Statement"; Ch. 3.7.3 "File Input and Output" (why to pass StandardCharsets.UTF_8)', 'Chương 7.2 "Catching Exceptions" và 7.2.5 "The try-with-Resources Statement"; Chương 3.7.3 "File Input and Output" (vì sao phải truyền StandardCharsets.UTF_8)'],
      ['javaTutorial', 'trail "Basic I/O" — "Character Streams", "Buffered Streams", "Scanning and Formatting"; trail "Essential Classes › Exceptions" — "The try-with-resources Statement"', 'trail "Basic I/O" — "Character Streams", "Buffered Streams", "Scanning and Formatting"; trail "Essential Classes › Exceptions" — "The try-with-resources Statement"'],
      ['apiDocs', 'java.io.FileReader ("uses the default charset"), FileWriter, BufferedReader, LineNumberReader, PrintWriter (checkError), InputStreamReader, OutputStreamWriter, java.nio.file.Files (newBufferedReader), java.util.Scanner', 'java.io.FileReader ("dùng bảng mã mặc định"), FileWriter, BufferedReader, LineNumberReader, PrintWriter (checkError), InputStreamReader, OutputStreamWriter, java.nio.file.Files (newBufferedReader), java.util.Scanner'],
    ]),
  ].join('\n'),
};

/* ───────── 9.C — 📑 Slide by slide · I/O Streams (3/3): binary files, RandomAccessFile, object files (slides 35–59) ───────── */
const L_pro14_3 = {
  title: '9.C — 📑 Slide by slide · I/O Streams (3/3): binary files, RandomAccessFile, object files (slides 35–59)|||9.C — 📑 Học theo từng slide · I/O Streams (3/3): file nhị phân, RandomAccessFile, file đối tượng (slide 35–59)',
  slug: 'pro192-slide-pro14-3',
  type: 'VIDEO',
  description: 'Giảng slide 35–59 bộ "I/O Streams" của trường: RandomAccessFile của slide chạy thật với con trỏ file in sau mỗi lần ghi (0, 11, 12, 16, 24, 37 chứ không phải "0,1,2,3,4"), bộ đệm 100 byte, chạy hai lần để lại đuôi cũ và setLength, seek để sửa tại chỗ, writeBytes làm mất tiếng Việt, các chế độ r/rw/rws/rwd; cây lớp luồng byte vẽ lại bằng UML; hai demo luồng mức thấp LStream.txt 23 byte in dạng hex và "không lớn hơn 127" thật ra là 0..255; DataOutputStream bọc FileOutputStream (HStream.txt 47 byte đếm từng byte), đọc sai thứ tự, EOFException, BufferedOutputStream; tuần tự hoá đo thật (static và transient không được ghi, đối tượng được tham chiếu được ghi theo, không gọi constructor, NotSerializableException), serialVersionUID với phiên javac/java JDK 8 thật (InvalidClassException), readObject không trả null mà ném EOFException, ghi nối file đối tượng làm hỏng file (invalid type code: AC), thứ tự trường thật khi tuần tự hoá, case study 3 quản lý sách chạy hai lần, và tóm tắt cả chương.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.C · school deck "I/O Streams", slides 35–59</span>
<h2>Binary files: bytes in a layout you decide — or Java decides</h2>
<p class="lead">A text file stores numbers as digits you can read; a binary file stores them as the bytes the computer uses — 4 bytes for any <code>int</code>, 8 for a <code>double</code>. That makes binary files compact and fast, lets you jump to a position (<code>RandomAccessFile</code>), and lets Java save <strong>whole objects</strong> with one call (serialization). The price: you cannot read them in Notepad, and the reader must use exactly the layout of the writer. Slides 35–59 cover the random-access file, the low- and high-level byte streams, and object files with the third case study; each demo of the slides runs below with its bytes printed in hex, so "binary" stops being a mystery.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>35–38</td><td>binary streams; RandomAccessFile</td><td>write typed values, seek to any byte and update in place</td></tr>
<tr><td>39–43</td><td>low-level byte streams</td><td>read and write single bytes and explain every byte of a small file</td></tr>
<tr><td>44–47</td><td>high-level (data) streams</td><td>save and load ints, doubles and strings with DataOutputStream/DataInputStream</td></tr>
<tr><td>48–58</td><td>object streams, Serializable, case study 3</td><td>save and load a list of objects, and avoid EOF, append and version traps</td></tr>
<tr><td>59</td><td>summary</td><td>choose the right class for a file task</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.C · bộ slide "I/O Streams" của trường, slide 35–59</span>
<h2>File nhị phân: các byte theo bố cục do bạn — hoặc Java — quyết định</h2>
<p class="lead">File văn bản cất con số thành các chữ số đọc được; file nhị phân cất chúng đúng như máy tính dùng — 4 byte cho mọi <code>int</code>, 8 byte cho một <code>double</code>. Nhờ vậy file nhị phân gọn và nhanh, cho phép nhảy tới một vị trí (<code>RandomAccessFile</code>), và cho Java lưu <strong>cả đối tượng</strong> bằng một lệnh (tuần tự hoá — serialization). Cái giá: bạn không đọc được nó bằng Notepad, và bên đọc phải dùng đúng bố cục của bên ghi. Slide 35–59 giảng file truy cập ngẫu nhiên, luồng byte mức thấp và mức cao, và file đối tượng cùng case study thứ ba; mọi demo của slide đều chạy bên dưới kèm các byte in dạng hex, để "nhị phân" thôi là điều bí ẩn.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>35–38</td><td>luồng nhị phân; RandomAccessFile</td><td>ghi giá trị có kiểu, nhảy tới byte bất kỳ và sửa tại chỗ</td></tr>
<tr><td>39–43</td><td>luồng byte mức thấp</td><td>đọc và ghi từng byte và giải thích từng byte của một file nhỏ</td></tr>
<tr><td>44–47</td><td>luồng mức cao (luồng dữ liệu)</td><td>lưu và nạp int, double, chuỗi bằng DataOutputStream/DataInputStream</td></tr>
<tr><td>48–58</td><td>luồng đối tượng, Serializable, case study 3</td><td>lưu và nạp một danh sách đối tượng, tránh các bẫy hết file, ghi nối và phiên bản lớp</td></tr>
<tr><td>59</td><td>tóm tắt</td><td>chọn đúng lớp cho một việc với file</td></tr>
</tbody>
</table>`),
    walkHead('pro14', 35, 59),
    walk('pro14', [
      [35, '5- Access binary files',
        `<p class="y-chinh">🎯 Binary streams. <strong>Low-level</strong> streams read/write data byte by byte. <strong>High-level</strong> streams read/write general-format data — primitives, i.e. groups of bytes that store typed values.</p>
<p>Lesson 9.A (slide 7) measured the difference on the number 1234: a low-level <code>FileOutputStream.write(1234)</code> stored one byte, <code>D2</code>; a high-level <code>DataOutputStream.writeInt(1234)</code> stored four, <code>00 00 04 D2</code>. "High level" does not mean another file format — the high-level stream is a <em>filter</em> that turns an <code>int</code> into its 4 bytes and hands them to a low-level stream underneath.</p>
<table>
<thead><tr><th></th><th>Text file</th><th>Binary file</th></tr></thead>
<tbody>
<tr><td>the number 1234</td><td>4 characters "1234" (+ a separator)</td><td>always 4 bytes <code>00 00 04 D2</code></td></tr>
<tr><td>open in Notepad</td><td>readable</td><td>unreadable symbols</td></tr>
<tr><td>reading back</td><td>parse: <code>split</code>, <code>parseInt</code></td><td><code>readInt()</code> — no parsing</td></tr>
<tr><td>jump to record n</td><td>no (read all lines before it)</td><td>yes, if records have a fixed size (<code>seek</code>)</td></tr>
</tbody>
</table>
<p class="meo">🧠 In real projects binary data files are rare — databases took that job. What you will keep using is the <em>pattern</em>: streams wrapped in streams, a fixed layout shared by writer and reader, and the end-of-file signal of each class.</p>`,
        `<p class="y-chinh">🎯 Luồng nhị phân. Luồng <strong>mức thấp</strong> đọc/ghi dữ liệu từng byte. Luồng <strong>mức cao</strong> đọc/ghi dữ liệu có định dạng tổng quát — kiểu nguyên thuỷ, tức là các nhóm byte lưu giá trị có kiểu.</p>
<p>Bài 9.A (slide 7) đã đo sự khác nhau trên con số 1234: <code>FileOutputStream.write(1234)</code> mức thấp lưu một byte, <code>D2</code>; <code>DataOutputStream.writeInt(1234)</code> mức cao lưu bốn byte, <code>00 00 04 D2</code>. "Mức cao" không có nghĩa là một định dạng file khác — luồng mức cao là một <em>bộ lọc</em> biến một <code>int</code> thành 4 byte của nó rồi chuyển cho luồng mức thấp nằm bên dưới.</p>
<table>
<thead><tr><th></th><th>File văn bản</th><th>File nhị phân</th></tr></thead>
<tbody>
<tr><td>con số 1234</td><td>4 ký tự "1234" (+ dấu phân cách)</td><td>luôn 4 byte <code>00 00 04 D2</code></td></tr>
<tr><td>mở bằng Notepad</td><td>đọc được</td><td>ký hiệu khó hiểu</td></tr>
<tr><td>đọc lại</td><td>phải phân tích: <code>split</code>, <code>parseInt</code></td><td><code>readInt()</code> — không phân tích</td></tr>
<tr><td>nhảy tới bản ghi thứ n</td><td>không (phải đọc mọi dòng trước nó)</td><td>được, nếu bản ghi dài cố định (<code>seek</code>)</td></tr>
</tbody>
</table>
<p class="meo">🧠 Trong dự án thật, file dữ liệu nhị phân hiếm gặp — cơ sở dữ liệu đã nhận việc đó. Thứ bạn sẽ còn dùng là <em>khuôn mẫu</em>: luồng bọc trong luồng, một bố cục cố định dùng chung cho bên ghi và bên đọc, và tín hiệu hết file của từng lớp.</p>`],
      [36, 'Access binary files… The java.io.RandomAccessFile class',
        `<p class="y-chinh">🎯 <code>java.io.RandomAccessFile</code> reads or modifies data in a file, compatible with the stream/reader/writer model. It supports: getting the <strong>file pointer</strong>, getting the length of the file, <strong>seeking</strong> to any position, reading and writing single bytes or groups of bytes treated as higher-level data types, and closing the file.</p>
<p>"Random access" means <strong>any position, in any order</strong> — the opposite of a stream, which goes from the start to the end once. The file pointer is the byte index where the next read or write happens; every <code>readXxx</code>/<code>writeXxx</code> moves it forward by the size of the value. <code>seek(pos)</code> moves it anywhere. Writing in the middle <em>overwrites</em> bytes in place — nothing shifts:</p>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile(fName, "rw")) {
    f.seek(12);                                             // the int starts at byte 12 (11 for writeUTF + 1 boolean)
    f.writeInt(4321);                                       // overwrite 4 bytes in place, nothing else moves
    f.seek(12);
    System.out.println("int at byte 12 is now " + f.readInt() + ", length still " + f.length());
} catch (IOException e) {
    System.out.println(e);
}</code></pre>
<pre><code class="language-plaintext">int at byte 12 is now 4321, length still 27</code></pre>
<p>That is the one thing streams cannot do, and why it matters: with fixed-size records (say 40 bytes per product) record <em>n</em> starts at <code>n * 40</code>, so you can read or update record 50 directly, without touching the 49 before it — the idea behind database files. Exercise 5 of lesson 9.2 builds such a file.</p>
<div class="pitfall">FE: "Which class lets you get the pointer of a file?" → <strong>RandomAccessFile</strong> (<code>getFilePointer()</code>). Note in the class diagram under slide 39: <code>RandomAccessFile</code> is <strong>not</strong> a stream — it extends <code>Object</code> and implements <code>DataInput</code> and <code>DataOutput</code>, which is why it has the same <code>readInt</code>/<code>writeUTF</code> methods as the data streams.</div>`,
        `<p class="y-chinh">🎯 <code>java.io.RandomAccessFile</code> đọc hoặc sửa dữ liệu trong file, tương thích với mô hình luồng/reader/writer. Nó hỗ trợ: lấy <strong>con trỏ file</strong>, lấy độ dài file, <strong>nhảy</strong> (seek) tới vị trí bất kỳ, đọc và ghi từng byte hay nhóm byte được coi là kiểu dữ liệu mức cao, và đóng file.</p>
<p>"Truy cập ngẫu nhiên" nghĩa là <strong>vị trí nào cũng được, thứ tự nào cũng được</strong> — ngược với luồng, vốn đi từ đầu tới cuối một lượt. Con trỏ file là chỉ số byte nơi lần đọc hay ghi kế tiếp diễn ra; mỗi <code>readXxx</code>/<code>writeXxx</code> đẩy nó tới thêm đúng kích thước của giá trị. <code>seek(pos)</code> đặt nó vào chỗ bất kỳ. Ghi ở giữa là <em>ghi đè</em> tại chỗ — không gì bị dời đi:</p>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile(fName, "rw")) {
    f.seek(12);                                             // int bắt đầu ở byte 12 (11 của writeUTF + 1 boolean)
    f.writeInt(4321);                                       // ghi đè 4 byte tại chỗ, không gì khác dịch chuyển
    f.seek(12);
    System.out.println("int at byte 12 is now " + f.readInt() + ", length still " + f.length());
} catch (IOException e) {
    System.out.println(e);
}</code></pre>
<pre><code class="language-plaintext">int at byte 12 is now 4321, length still 27</code></pre>
<p>Đó là điều luồng không làm được, và vì sao nó quan trọng: với bản ghi dài cố định (chẳng hạn 40 byte mỗi sản phẩm) bản ghi thứ <em>n</em> bắt đầu ở <code>n * 40</code>, nên bạn đọc hoặc sửa thẳng bản ghi 50 mà không đụng 49 bản ghi trước — ý tưởng nằm sau các file cơ sở dữ liệu. Bài 5 của bài 9.2 dựng một file như vậy.</p>
<div class="pitfall">FE: "Lớp nào cho phép lấy con trỏ của file?" → <strong>RandomAccessFile</strong> (<code>getFilePointer()</code>). Để ý trong sơ đồ lớp ở slide 39: <code>RandomAccessFile</code> <strong>không</strong> phải là luồng — nó kế thừa <code>Object</code> và hiện thực <code>DataInput</code>, <code>DataOutput</code>, vì thế nó có cùng các phương thức <code>readInt</code>/<code>writeUTF</code> như luồng dữ liệu.</div>`],
      [37, 'Access binary files …java.io.RandomAccessFile class…',
        `<p class="y-chinh">🎯 Constructors: <code>RandomAccessFile(String file, String mode)</code> and <code>RandomAccessFile(File file, String mode)</code>. Modes: <strong>"r"</strong> read only; <strong>"rw"</strong> read and write; <strong>"rws"</strong> like rw, and every change to the content <em>or metadata</em> (file attributes) is written to the device immediately; <strong>"rwd"</strong> like rw, and changes to the content (not the metadata) are written immediately — metadata are updated when the file is closed.</p>
<p>The modes and their errors, measured:</p>
<pre class="trich"><code class="language-java">try {
    new RandomAccessFile("chua-co.txt", "r");               // "r": the file must exist
} catch (IOException e) {
    System.out.println("mode r, missing file : " + e);
}
try (RandomAccessFile f = new RandomAccessFile(fName, "r")) {
    f.writeInt(1);                                          // "r": read only
} catch (IOException e) {
    System.out.println("mode r, writeInt     : " + e);
}
try {
    new RandomAccessFile(fName, "w");                       // there is no "w" mode
} catch (IllegalArgumentException | IOException e) {
    System.out.println("mode w               : " + e);
}</code></pre>
<pre><code class="language-plaintext">mode r, missing file : java.io.FileNotFoundException: chua-co.txt (No such file or directory)
mode r, writeInt     : java.io.IOException: Bad file descriptor
mode w               : java.lang.IllegalArgumentException: Illegal mode "w" must be one of "r", "rw", "rws", or "rwd"</code></pre>
<ul>
<li><code>"r"</code> needs an existing file (else <code>FileNotFoundException</code>) and refuses writes at run time (<code>IOException</code> — the message depends on the OS).</li>
<li><code>"rw"</code> creates the file if missing. It does <strong>not</strong> empty an existing file — slide 38 shows the consequence.</li>
<li>There is no <code>"w"</code> mode: <code>IllegalArgumentException</code>, an unchecked exception thrown by the constructor.</li>
</ul>
<div class="pitfall">FE (FE2, FE11, FE18): "Which mode writes changes of metadata (file attributes) immediately?" → <strong>"rws"</strong> ("s" = synchronous content + metadata; "d" = data only). "rws"/"rwd" are slower — they matter for crash safety (databases, logs), not for PRO192 programs.</div>`,
        `<p class="y-chinh">🎯 Hàm tạo: <code>RandomAccessFile(String file, String mode)</code> và <code>RandomAccessFile(File file, String mode)</code>. Chế độ: <strong>"r"</strong> chỉ đọc; <strong>"rw"</strong> đọc và ghi; <strong>"rws"</strong> như rw, và mọi thay đổi nội dung <em>hoặc siêu dữ liệu</em> (metadata — thuộc tính file) được ghi xuống thiết bị ngay; <strong>"rwd"</strong> như rw, và thay đổi nội dung (không gồm metadata) được ghi ngay — metadata cập nhật khi đóng file.</p>
<p>Các chế độ và lỗi của chúng, đo thật:</p>
<pre class="trich"><code class="language-java">try {
    new RandomAccessFile("chua-co.txt", "r");               // "r": file phải có sẵn
} catch (IOException e) {
    System.out.println("mode r, missing file : " + e);
}
try (RandomAccessFile f = new RandomAccessFile(fName, "r")) {
    f.writeInt(1);                                          // "r": chỉ đọc
} catch (IOException e) {
    System.out.println("mode r, writeInt     : " + e);
}
try {
    new RandomAccessFile(fName, "w");                       // không có chế độ "w"
} catch (IllegalArgumentException | IOException e) {
    System.out.println("mode w               : " + e);
}</code></pre>
<pre><code class="language-plaintext">mode r, missing file : java.io.FileNotFoundException: chua-co.txt (No such file or directory)
mode r, writeInt     : java.io.IOException: Bad file descriptor
mode w               : java.lang.IllegalArgumentException: Illegal mode "w" must be one of "r", "rw", "rws", or "rwd"</code></pre>
<ul>
<li><code>"r"</code> cần file đã có (nếu không thì <code>FileNotFoundException</code>) và từ chối ghi lúc chạy (<code>IOException</code> — thông báo tuỳ hệ điều hành).</li>
<li><code>"rw"</code> tạo file nếu chưa có. Nó <strong>không</strong> làm rỗng file đã có — slide 38 cho thấy hậu quả.</li>
<li>Không có chế độ <code>"w"</code>: <code>IllegalArgumentException</code>, một ngoại lệ unchecked do hàm tạo ném ra.</li>
</ul>
<div class="pitfall">FE (FE2, FE11, FE18): "Chế độ nào ghi ngay thay đổi của siêu dữ liệu (thuộc tính file)?" → <strong>"rws"</strong> ("s" = đồng bộ cả nội dung lẫn metadata; "d" = chỉ dữ liệu). "rws"/"rwd" chậm hơn — chúng quan trọng cho độ an toàn khi máy sập (cơ sở dữ liệu, log), không phải cho chương trình PRO192.</div>`],
      [38, 'Access binary files …java.io.RandomAccessFile class…',
        `<p class="y-chinh">🎯 "A demo for writing data to a file then reading data from the file. The try…catch statement must be used when accessing a file — checked exception." <code>RandomAccessFileDemo</code> writes <code>writeUTF("Mắt nai")</code>, <code>writeBoolean(true)</code>, <code>writeInt(1234)</code>, <code>writeDouble(37.456)</code>, <code>writeBytes("Hoang an Huan")</code> ("positions: 0,1,2,3,4"), <code>seek(0)</code>, reads them back in the same order, reads the rest into a <code>byte[100]</code>, prints "File length: 37". Notepad shows "Má»t nai, … Hoang an Huan".</p>
<p>The slide's program, with one line added after each write to print the file pointer:</p>
<pre class="trich"><code class="language-java">String fName = "RandomAccessFileDemo.txt";
String S1 = "Mắt nai"; boolean b = true; int n = 1234;
double x = 37.456; String S2 = "Hoang an Huan";
byte[] ar = new byte[100];                                  // for reading ASCII characters
try {
    RandomAccessFile f = new RandomAccessFile(fName, "rw");
    // Write data
    f.writeUTF(S1);      System.out.println("after writeUTF     pointer = " + f.getFilePointer());
    f.writeBoolean(b);   System.out.println("after writeBoolean pointer = " + f.getFilePointer());
    f.writeInt(n);       System.out.println("after writeInt     pointer = " + f.getFilePointer());
    f.writeDouble(x);    System.out.println("after writeDouble  pointer = " + f.getFilePointer());
    f.writeBytes(S2);    System.out.println("after writeBytes   pointer = " + f.getFilePointer());
    // Read data
    f.seek(0);                                              // seek to BOF (begin of file)
    System.out.println(f.readUTF());
    System.out.println(f.readBoolean());
    System.out.println(f.readInt());
    System.out.println(f.readDouble());
    int got = f.read(ar);                                   // reads what is left: 13 bytes into a 100-byte array
    System.out.println(new String(ar, 0, got) + "   (read returned " + got + "; new String(ar) would have "
            + new String(ar).length() + " chars, 87 of them '\\\\u0000')");
    System.out.println("File length: " + f.length());
    f.close();
} catch (Exception e) {
    System.out.println(e);
}</code></pre>
<p>The comment "positions: 0,1,2,3,4" counts <em>values</em>; the byte positions are <strong>0, 11, 12, 16, 24</strong>: <code>writeUTF</code> took 2 bytes of length + 9 bytes ("ắ" alone is 3), the boolean 1, the int 4, the double 8, and <code>writeBytes</code> 13 → 37 bytes. Reading must follow the same order and types — that is the "format" of a binary file. <code>f.read(ar)</code> returned 13, but <code>new String(ar)</code> as on the slide builds a 100-character string, 87 of them the invisible character <code>'\\u0000'</code>; use <code>new String(ar, 0, count)</code>.</p>
<p>Two things the slide does not show, run right after it:</p>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile(fName, "rw")) {   // "rw" does NOT empty an existing file
    f.writeUTF(S1); f.writeBoolean(b); f.writeInt(n); f.writeDouble(x);
    f.writeBytes("XYZ");                                    // 3 bytes instead of 13
    long end = f.getFilePointer();                          // 27: where the new data ends
    System.out.println("pointer " + end + ", length " + f.length() + " -&gt; bytes 24.. read \\"" + duoi(f, 24) + "\\": the tail is left from run 1");
    f.setLength(end);                                       // cut the file where we stopped writing
    System.out.println("after setLength(" + end + "): " + f.length() + " bytes, bytes 24.. read \\"" + duoi(f, 24) + "\\"");
} catch (IOException e) {
    System.out.println(e);
}</code></pre>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile("vn.bin", "rw")) {
    f.setLength(0);
    f.writeBytes("Lê Văn Đạt");                             // writeBytes keeps only the LOW byte of each char
    f.writeUTF("Lê Văn Đạt");
    f.seek(0);
    byte[] ten = new byte[10];
    f.readFully(ten);
    StringBuilder hex = new StringBuilder();
    for (byte t : ten) hex.append(String.format("%02X ", t &amp; 0xFF));
    System.out.println("writeBytes(\\"Lê Văn Đạt\\") stored " + hex.toString().trim());
    System.out.println("writeUTF(\\"Lê Văn Đạt\\") read back: " + f.readUTF());
} catch (IOException e) {
    System.out.println(e);
}</code></pre>
<div class="out">after writeUTF &nbsp;&nbsp;&nbsp;&nbsp;pointer = 11<br>
after writeBoolean pointer = 12<br>
after writeInt &nbsp;&nbsp;&nbsp;&nbsp;pointer = 16<br>
after writeDouble &nbsp;pointer = 24<br>
after writeBytes &nbsp;&nbsp;pointer = 37<br>
Mắt nai<br>
true<br>
1234<br>
37.456<br>
Hoang an Huan &nbsp;&nbsp;(read returned 13; new String(ar) would have 100 chars, 87 of them '\\u0000')<br>
File length: 37<br>
== run the WRITE part again with a shorter S2 ==<br>
pointer 27, length 37 -&gt; bytes 24.. read "XYZng an Huan": the tail is left from run 1<br>
after setLength(27): 27 bytes, bytes 24.. read "XYZ"<br>
int at byte 12 is now 4321, length still 27<br>
writeBytes("Lê Văn Đạt") stored 4C EA 20 56 03 6E 20 10 A1 74<br>
writeUTF("Lê Văn Đạt") read back: Lê Văn Đạt<br>
mode r, missing file : java.io.FileNotFoundException: chua-co.txt (No such file or directory)<br>
mode r, writeInt &nbsp;&nbsp;&nbsp;&nbsp;: java.io.IOException: Bad file descriptor<br>
mode w &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: java.lang.IllegalArgumentException: Illegal mode "w" must be one of "r", "rw", "rws", or "rwd"</div>
<div class="pitfall">(1) <code>"rw"</code> keeps the old file: writing a shorter text leaves the tail of the previous run ("XYZng an Huan") and the length stays 37 — call <code>setLength(…)</code> (or <code>setLength(0)</code> before writing). (2) <code>writeBytes</code> keeps only the <strong>low byte</strong> of each <code>char</code>: "ă" (U+0103) became <code>03</code>, "Đ" (U+0110) became <code>10</code> — Vietnamese is destroyed; use <code>writeUTF</code>. That is also why Notepad shows "Má»t nai": it reads the UTF bytes as <code>windows-1252</code>. FE13: <code>writeInt(8); writeChar('a');</code> → <code>length()</code> = <strong>6</strong>.</div>`,
        `<p class="y-chinh">🎯 "Một demo ghi dữ liệu ra file rồi đọc lại từ file. Phải dùng try…catch khi truy cập file — ngoại lệ checked." <code>RandomAccessFileDemo</code> ghi <code>writeUTF("Mắt nai")</code>, <code>writeBoolean(true)</code>, <code>writeInt(1234)</code>, <code>writeDouble(37.456)</code>, <code>writeBytes("Hoang an Huan")</code> ("positions: 0,1,2,3,4"), <code>seek(0)</code>, đọc lại theo đúng thứ tự, đọc phần còn lại vào <code>byte[100]</code>, in "File length: 37". Notepad hiện "Má»t nai, … Hoang an Huan".</p>
<p>Chương trình của slide, thêm một dòng sau mỗi lần ghi để in con trỏ file:</p>
<pre class="trich"><code class="language-java">String fName = "RandomAccessFileDemo.txt";
String S1 = "Mắt nai"; boolean b = true; int n = 1234;
double x = 37.456; String S2 = "Hoang an Huan";
byte[] ar = new byte[100];                                  // để đọc ký tự ASCII
try {
    RandomAccessFile f = new RandomAccessFile(fName, "rw");
    // Ghi dữ liệu
    f.writeUTF(S1);      System.out.println("after writeUTF     pointer = " + f.getFilePointer());
    f.writeBoolean(b);   System.out.println("after writeBoolean pointer = " + f.getFilePointer());
    f.writeInt(n);       System.out.println("after writeInt     pointer = " + f.getFilePointer());
    f.writeDouble(x);    System.out.println("after writeDouble  pointer = " + f.getFilePointer());
    f.writeBytes(S2);    System.out.println("after writeBytes   pointer = " + f.getFilePointer());
    // Đọc dữ liệu
    f.seek(0);                                              // về đầu file
    System.out.println(f.readUTF());
    System.out.println(f.readBoolean());
    System.out.println(f.readInt());
    System.out.println(f.readDouble());
    int got = f.read(ar);                                   // đọc phần còn lại: 13 byte vào mảng 100 byte
    System.out.println(new String(ar, 0, got) + "   (read returned " + got + "; new String(ar) would have "
            + new String(ar).length() + " chars, 87 of them '\\\\u0000')");
    System.out.println("File length: " + f.length());
    f.close();
} catch (Exception e) {
    System.out.println(e);
}</code></pre>
<p>Chú thích "positions: 0,1,2,3,4" đếm theo <em>giá trị</em>; vị trí byte thật là <strong>0, 11, 12, 16, 24</strong>: <code>writeUTF</code> tốn 2 byte độ dài + 9 byte (riêng "ắ" đã 3), boolean 1, int 4, double 8, và <code>writeBytes</code> 13 → 37 byte. Đọc phải theo đúng thứ tự và kiểu đó — đó chính là "định dạng" của file nhị phân. <code>f.read(ar)</code> trả về 13, nhưng <code>new String(ar)</code> như trên slide dựng một chuỗi 100 ký tự, 87 trong số đó là ký tự vô hình <code>'\\u0000'</code>; hãy dùng <code>new String(ar, 0, count)</code>.</p>
<p>Hai điều slide không cho thấy, chạy ngay sau nó:</p>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile(fName, "rw")) {   // "rw" KHÔNG làm rỗng file đã có
    f.writeUTF(S1); f.writeBoolean(b); f.writeInt(n); f.writeDouble(x);
    f.writeBytes("XYZ");                                    // 3 byte thay vì 13
    long end = f.getFilePointer();                          // 27: chỗ dữ liệu mới kết thúc
    System.out.println("pointer " + end + ", length " + f.length() + " -&gt; bytes 24.. read \\"" + duoi(f, 24) + "\\": the tail is left from run 1");
    f.setLength(end);                                       // cắt file tại chỗ vừa ghi xong
    System.out.println("after setLength(" + end + "): " + f.length() + " bytes, bytes 24.. read \\"" + duoi(f, 24) + "\\"");
} catch (IOException e) {
    System.out.println(e);
}</code></pre>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile("vn.bin", "rw")) {
    f.setLength(0);
    f.writeBytes("Lê Văn Đạt");                             // writeBytes chỉ giữ byte THẤP của mỗi ký tự
    f.writeUTF("Lê Văn Đạt");
    f.seek(0);
    byte[] ten = new byte[10];
    f.readFully(ten);
    StringBuilder hex = new StringBuilder();
    for (byte t : ten) hex.append(String.format("%02X ", t &amp; 0xFF));
    System.out.println("writeBytes(\\"Lê Văn Đạt\\") stored " + hex.toString().trim());
    System.out.println("writeUTF(\\"Lê Văn Đạt\\") read back: " + f.readUTF());
} catch (IOException e) {
    System.out.println(e);
}</code></pre>
<div class="out">after writeUTF &nbsp;&nbsp;&nbsp;&nbsp;pointer = 11<br>
after writeBoolean pointer = 12<br>
after writeInt &nbsp;&nbsp;&nbsp;&nbsp;pointer = 16<br>
after writeDouble &nbsp;pointer = 24<br>
after writeBytes &nbsp;&nbsp;pointer = 37<br>
Mắt nai<br>
true<br>
1234<br>
37.456<br>
Hoang an Huan &nbsp;&nbsp;(read returned 13; new String(ar) would have 100 chars, 87 of them '\\u0000')<br>
File length: 37<br>
== run the WRITE part again with a shorter S2 ==<br>
pointer 27, length 37 -&gt; bytes 24.. read "XYZng an Huan": the tail is left from run 1<br>
after setLength(27): 27 bytes, bytes 24.. read "XYZ"<br>
int at byte 12 is now 4321, length still 27<br>
writeBytes("Lê Văn Đạt") stored 4C EA 20 56 03 6E 20 10 A1 74<br>
writeUTF("Lê Văn Đạt") read back: Lê Văn Đạt<br>
mode r, missing file : java.io.FileNotFoundException: chua-co.txt (No such file or directory)<br>
mode r, writeInt &nbsp;&nbsp;&nbsp;&nbsp;: java.io.IOException: Bad file descriptor<br>
mode w &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: java.lang.IllegalArgumentException: Illegal mode "w" must be one of "r", "rw", "rws", or "rwd"</div>
<div class="pitfall">(1) <code>"rw"</code> giữ file cũ: ghi một đoạn chữ ngắn hơn thì còn sót đuôi của lần chạy trước ("XYZng an Huan") và độ dài vẫn 37 — hãy gọi <code>setLength(…)</code> (hoặc <code>setLength(0)</code> trước khi ghi). (2) <code>writeBytes</code> chỉ giữ <strong>byte thấp</strong> của mỗi <code>char</code>: "ă" (U+0103) thành <code>03</code>, "Đ" (U+0110) thành <code>10</code> — tiếng Việt bị phá huỷ; hãy dùng <code>writeUTF</code>. Đó cũng là lý do Notepad hiện "Má»t nai": nó đọc các byte UTF theo <code>windows-1252</code>. FE13: <code>writeInt(8); writeChar('a');</code> → <code>length()</code> = <strong>6</strong>.</div>`],
      [39, 'Access binary files…Binary Streams',
        `<p class="y-chinh">🎯 The class trees of <code>InputStream</code> (ByteArrayInputStream, FileInputStream, FilterInputStream → BufferedInputStream, DataInputStream, LineNumberInputStream, PushbackInputStream; ObjectInputStream, PipedInputStream, SequenceInputStream, StringBufferInputStream) and <code>OutputStream</code> (ByteArrayOutputStream, FileOutputStream, FilterOutputStream → BufferedOutputStream, DataOutputStream, PrintStream; ObjectOutputStream, PipedOutputStream), from the JDK 1.6 Javadoc.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/bc7dc7c26f46e0ee710c0c9985f9bd18c097f444.svg" alt="Slides 39 and 45 redrawn as UML: the binary-stream classes PRO192 uses, and RandomAccessFile outside the tree" loading="lazy" /><p class="chu-thich">🧩 Slides 39 and 45 redrawn as UML: the binary-stream classes PRO192 uses, and RandomAccessFile outside the tree</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 39 and 45 — the binary-stream classes (java.io), redrawn as UML
abstract class InputStream &lt;&lt;abstract&gt;&gt; {
  + read() : int
  + read(b : byte[]) : int
  + available() : int
  + close() : void
}
abstract class OutputStream &lt;&lt;abstract&gt;&gt; {
  + write(b : int) : void
  + write(b : byte[]) : void
  + flush() : void
  + close() : void
}
class FileInputStream
class ByteArrayInputStream
class FilterInputStream
class BufferedInputStream
class DataInputStream {
  + readInt() readDouble() readUTF() ...
}
class ObjectInputStream {
  + readObject() : Object
}
class FileOutputStream {
  + FileOutputStream(name : String, append : boolean)
}
class ByteArrayOutputStream
class FilterOutputStream
class BufferedOutputStream
class DataOutputStream {
  + writeInt() writeDouble() writeUTF() ...
}
class PrintStream {
  + println(x) : void
}
class ObjectOutputStream {
  + writeObject(obj : Object) : void
}
class RandomAccessFile {
  + seek(pos : long) : void
  + getFilePointer() : long
}
InputStream &lt;|-- FileInputStream
InputStream &lt;|-- ByteArrayInputStream
InputStream &lt;|-- FilterInputStream
FilterInputStream &lt;|-- BufferedInputStream
FilterInputStream &lt;|-- DataInputStream
InputStream &lt;|-- ObjectInputStream
OutputStream &lt;|-- FileOutputStream
OutputStream &lt;|-- ByteArrayOutputStream
OutputStream &lt;|-- FilterOutputStream
FilterOutputStream &lt;|-- BufferedOutputStream
FilterOutputStream &lt;|-- DataOutputStream
FilterOutputStream &lt;|-- PrintStream
OutputStream &lt;|-- ObjectOutputStream
note bottom of RandomAccessFile
  NOT a stream: extends Object,
  implements DataInput and DataOutput
end note
note bottom of PrintStream : System.out is one
@enduml</code></pre></details>
<p>The same shape as the character tree of slide 13: two abstract roots, concrete classes that touch a device (<code>FileInputStream</code>, <code>ByteArrayInputStream</code> — memory), and <strong>filters</strong> (<code>FilterInputStream</code>'s children) that wrap another stream and add something: a buffer, typed values. <code>ObjectInputStream</code>/<code>ObjectOutputStream</code> wrap a stream too, though they are not <code>Filter…</code> subclasses.</p>
<p>Old names to ignore: <code>LineNumberInputStream</code> and <code>StringBufferInputStream</code> are <strong>deprecated</strong> since JDK 1.1 (they handled characters wrongly — use <code>LineNumberReader</code>, <code>StringReader</code>). And a familiar face: <code>PrintStream</code> — <code>System.out</code> is one, which is why <code>System.out.println</code> writes bytes using the default encoding.</p>
<div class="pitfall">FE: "Which class reads bytes from a file?" → <strong>FileInputStream</strong>. "Which reads byte-oriented data such as images, audio, video?" → FileInputStream (not BufferedReader). "ObjectInputStream is a subclass of …?" → <strong>InputStream</strong>.</div>`,
        `<p class="y-chinh">🎯 Cây lớp của <code>InputStream</code> (ByteArrayInputStream, FileInputStream, FilterInputStream → BufferedInputStream, DataInputStream, LineNumberInputStream, PushbackInputStream; ObjectInputStream, PipedInputStream, SequenceInputStream, StringBufferInputStream) và <code>OutputStream</code> (ByteArrayOutputStream, FileOutputStream, FilterOutputStream → BufferedOutputStream, DataOutputStream, PrintStream; ObjectOutputStream, PipedOutputStream), lấy từ Javadoc JDK 1.6.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/bc7dc7c26f46e0ee710c0c9985f9bd18c097f444.svg" alt="Slide 39 và 45 vẽ lại bằng UML: các lớp luồng nhị phân PRO192 dùng, và RandomAccessFile nằm ngoài cây" loading="lazy" /><p class="chu-thich">🧩 Slide 39 và 45 vẽ lại bằng UML: các lớp luồng nhị phân PRO192 dùng, và RandomAccessFile nằm ngoài cây</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 39 and 45 — the binary-stream classes (java.io), redrawn as UML
abstract class InputStream &lt;&lt;abstract&gt;&gt; {
  + read() : int
  + read(b : byte[]) : int
  + available() : int
  + close() : void
}
abstract class OutputStream &lt;&lt;abstract&gt;&gt; {
  + write(b : int) : void
  + write(b : byte[]) : void
  + flush() : void
  + close() : void
}
class FileInputStream
class ByteArrayInputStream
class FilterInputStream
class BufferedInputStream
class DataInputStream {
  + readInt() readDouble() readUTF() ...
}
class ObjectInputStream {
  + readObject() : Object
}
class FileOutputStream {
  + FileOutputStream(name : String, append : boolean)
}
class ByteArrayOutputStream
class FilterOutputStream
class BufferedOutputStream
class DataOutputStream {
  + writeInt() writeDouble() writeUTF() ...
}
class PrintStream {
  + println(x) : void
}
class ObjectOutputStream {
  + writeObject(obj : Object) : void
}
class RandomAccessFile {
  + seek(pos : long) : void
  + getFilePointer() : long
}
InputStream &lt;|-- FileInputStream
InputStream &lt;|-- ByteArrayInputStream
InputStream &lt;|-- FilterInputStream
FilterInputStream &lt;|-- BufferedInputStream
FilterInputStream &lt;|-- DataInputStream
InputStream &lt;|-- ObjectInputStream
OutputStream &lt;|-- FileOutputStream
OutputStream &lt;|-- ByteArrayOutputStream
OutputStream &lt;|-- FilterOutputStream
FilterOutputStream &lt;|-- BufferedOutputStream
FilterOutputStream &lt;|-- DataOutputStream
FilterOutputStream &lt;|-- PrintStream
OutputStream &lt;|-- ObjectOutputStream
note bottom of RandomAccessFile
  NOT a stream: extends Object,
  implements DataInput and DataOutput
end note
note bottom of PrintStream : System.out is one
@enduml</code></pre></details>
<p>Cùng hình dạng với cây luồng ký tự ở slide 13: hai gốc trừu tượng, các lớp cụ thể chạm vào thiết bị (<code>FileInputStream</code>, <code>ByteArrayInputStream</code> — bộ nhớ), và các <strong>bộ lọc</strong> (con của <code>FilterInputStream</code>) bọc một luồng khác và thêm một thứ gì đó: bộ đệm, giá trị có kiểu. <code>ObjectInputStream</code>/<code>ObjectOutputStream</code> cũng bọc một luồng, dù chúng không phải lớp con của <code>Filter…</code>.</p>
<p>Tên cũ nên bỏ qua: <code>LineNumberInputStream</code> và <code>StringBufferInputStream</code> bị <strong>deprecated</strong> từ JDK 1.1 (chúng xử lý ký tự sai — hãy dùng <code>LineNumberReader</code>, <code>StringReader</code>). Và một gương mặt quen: <code>PrintStream</code> — <code>System.out</code> chính là một PrintStream, vì thế <code>System.out.println</code> ghi byte theo bảng mã mặc định.</p>
<div class="pitfall">FE: "Lớp nào đọc byte từ file?" → <strong>FileInputStream</strong>. "Lớp nào đọc dữ liệu dạng byte như ảnh, âm thanh, video?" → FileInputStream (không phải BufferedReader). "ObjectInputStream là lớp con của …?" → <strong>InputStream</strong>.</div>`],
      [40, 'Access binary files…Low-Level Binary Stream Demo.1',
        `<p class="y-chinh">🎯 <code>LowLevelStreamDemo</code>, writing: <code>FileOutputStream os</code> on "LStream.txt"; <code>os.write(n)</code> with <code>n = '5'</code>, a blank (32), then each of 1, 2, 3, 4, 5 followed by a blank, then the characters of the file name. Notes: "these values can not be greater than 127 because only the lower bytes are written to the file"; "we can not read these numbers in the file because it is a binary file. However, we can see characters" (NetBeans shows "5 □ □ □ □ □ LStream.txt").</p>
<pre class="trich"><code class="language-java">final char BLANK = 32;
final String fileName = "LStream.txt";
int[] a = { 1, 2, 3, 4, 5 };
char n = '5';
try {
    FileOutputStream os = new FileOutputStream(fileName);
    os.write(n);                                    // begin writing: the char '5' = byte 0x35
    os.write(BLANK);
    for (int i = 0; i &lt; 5; i++) {
        os.write(a[i]);                             // the NUMBER 1 = byte 0x01, not the digit '1'
        os.write(BLANK);
    }
    for (int i = 0; i &lt; fileName.length(); i++) os.write(fileName.charAt(i));
    os.close();
    System.out.println("demo 1 wrote: " + hex(fileName));
    // read data from the file then print them out
    FileInputStream is = new FileInputStream(fileName);
    int count = is.available();
    System.out.println("The size of file is " + count + " bytes");
    System.out.println("The content of file: ");
    byte[] bytes = new byte[1];
    is.read(bytes); System.out.print(new String(bytes));        // read a byte: '5'
    is.read(bytes); System.out.print(new String(bytes));        // read the blank
    for (int i = 0; i &lt; 5; i++) {
        int tmp = is.read();                                    // read an int number
        is.read(bytes);
        System.out.print(tmp + new String(bytes));
    }
    bytes = new byte[11];
    is.read(bytes);                                             // the file name stored at the end
    System.out.println(new String(bytes));
    System.out.println("one more read() at the end of the file: " + is.read());
    is.close();
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">demo 1 wrote: 35 20 01 20 02 20 03 20 04 20 05 20 4C 53 74 72 65 61 6D 2E 74 78 74</code></pre>
<p>23 bytes, each explained: <code>35</code> is the character '5', <code>20</code> the blank, <code>01</code>…<code>05</code> the <em>numbers</em> 1 to 5 (control codes, shown as boxes by the editor), then "LStream.txt" as 11 bytes. The editor shows boxes because bytes 1–5 are not printable characters — the file is fine.</p>
<p>The note about 127 is half right. <code>write(int b)</code> writes the <strong>lowest 8 bits</strong> of <code>b</code>, so the limit is 255, not 127 — measured:</p>
<pre class="trich"><code class="language-java">try (FileOutputStream os = new FileOutputStream("byte.bin")) {
    os.write(127); os.write(200); os.write(255); os.write(256); os.write(300); os.write(-1);
} catch (IOException e) {
    e.printStackTrace();
}
System.out.println("write(127), (200), (255), (256), (300), (-1) stored: " + hex("byte.bin"));
try (FileInputStream is = new FileInputStream("byte.bin")) {
    int b;
    StringBuilder sb = new StringBuilder("read() returns:");
    while ((b = is.read()) != -1) sb.append(' ').append(b).append("(byte ").append((byte) b).append(')');
    System.out.println(sb);
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">write(127), (200), (255), (256), (300), (-1) stored: 7F C8 FF 00 2C FF
read() returns: 127(byte 127) 200(byte -56) 255(byte -1) 0(byte 0) 44(byte 44) 255(byte -1)</code></pre>
<p>200 and 255 are stored and read back correctly by <code>read()</code>, which returns 0..255. What is true: 256 became 0 and 300 became 44 (300 − 256) — the high bits are dropped — and a Java <code>byte</code> is signed, so if you cast the value to <code>byte</code>, 200 shows as −56. That is where "127" comes from.</p>`,
        `<p class="y-chinh">🎯 <code>LowLevelStreamDemo</code>, phần ghi: <code>FileOutputStream os</code> trên "LStream.txt"; <code>os.write(n)</code> với <code>n = '5'</code>, một dấu cách (32), rồi lần lượt 1, 2, 3, 4, 5 mỗi số kèm một dấu cách, rồi các ký tự của tên file. Ghi chú: "các giá trị này không được lớn hơn 127 vì chỉ byte thấp được ghi ra file"; "ta không đọc được các con số này trong file vì là file nhị phân. Tuy nhiên vẫn thấy được các ký tự" (NetBeans hiện "5 □ □ □ □ □ LStream.txt").</p>
<pre class="trich"><code class="language-java">final char BLANK = 32;
final String fileName = "LStream.txt";
int[] a = { 1, 2, 3, 4, 5 };
char n = '5';
try {
    FileOutputStream os = new FileOutputStream(fileName);
    os.write(n);                                    // bắt đầu ghi: ký tự '5' = byte 0x35
    os.write(BLANK);
    for (int i = 0; i &lt; 5; i++) {
        os.write(a[i]);                             // SỐ 1 = byte 0x01, không phải chữ số '1'
        os.write(BLANK);
    }
    for (int i = 0; i &lt; fileName.length(); i++) os.write(fileName.charAt(i));
    os.close();
    System.out.println("demo 1 wrote: " + hex(fileName));
    // đọc dữ liệu từ file rồi in ra
    FileInputStream is = new FileInputStream(fileName);
    int count = is.available();
    System.out.println("The size of file is " + count + " bytes");
    System.out.println("The content of file: ");
    byte[] bytes = new byte[1];
    is.read(bytes); System.out.print(new String(bytes));        // đọc một byte: '5'
    is.read(bytes); System.out.print(new String(bytes));        // đọc dấu cách
    for (int i = 0; i &lt; 5; i++) {
        int tmp = is.read();                                    // đọc một số int
        is.read(bytes);
        System.out.print(tmp + new String(bytes));
    }
    bytes = new byte[11];
    is.read(bytes);                                             // tên file lưu ở cuối
    System.out.println(new String(bytes));
    System.out.println("one more read() at the end of the file: " + is.read());
    is.close();
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">demo 1 wrote: 35 20 01 20 02 20 03 20 04 20 05 20 4C 53 74 72 65 61 6D 2E 74 78 74</code></pre>
<p>23 byte, giải thích từng cái: <code>35</code> là ký tự '5', <code>20</code> là dấu cách, <code>01</code>…<code>05</code> là các <em>con số</em> 1 tới 5 (mã điều khiển, trình soạn thảo vẽ thành ô vuông), rồi "LStream.txt" thành 11 byte. Trình soạn thảo vẽ ô vuông vì byte 1–5 không phải ký tự in được — file không hề hỏng.</p>
<p>Ghi chú về 127 chỉ đúng một nửa. <code>write(int b)</code> ghi <strong>8 bit thấp nhất</strong> của <code>b</code>, nên giới hạn là 255 chứ không phải 127 — đo thật:</p>
<pre class="trich"><code class="language-java">try (FileOutputStream os = new FileOutputStream("byte.bin")) {
    os.write(127); os.write(200); os.write(255); os.write(256); os.write(300); os.write(-1);
} catch (IOException e) {
    e.printStackTrace();
}
System.out.println("write(127), (200), (255), (256), (300), (-1) stored: " + hex("byte.bin"));
try (FileInputStream is = new FileInputStream("byte.bin")) {
    int b;
    StringBuilder sb = new StringBuilder("read() returns:");
    while ((b = is.read()) != -1) sb.append(' ').append(b).append("(byte ").append((byte) b).append(')');
    System.out.println(sb);
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">write(127), (200), (255), (256), (300), (-1) stored: 7F C8 FF 00 2C FF
read() returns: 127(byte 127) 200(byte -56) 255(byte -1) 0(byte 0) 44(byte 44) 255(byte -1)</code></pre>
<p>200 và 255 được lưu và <code>read()</code> đọc lại đúng, vì nó trả về 0..255. Điều đúng là: 256 thành 0 và 300 thành 44 (300 − 256) — các bit cao bị bỏ — và <code>byte</code> của Java có dấu, nên nếu ép giá trị về <code>byte</code> thì 200 hiện thành −56. Con số "127" đến từ đó.</p>`],
      [41, 'Access binary files…Low-Level Binary Stream Demo.1…',
        `<p class="y-chinh">🎯 Reading the file back: <code>FileInputStream is</code>, <code>is.available()</code> for the size ("The size of file is 23 bytes"), a <code>byte[1]</code> to read '5' and the blank and print them with <code>new String(bytes)</code> ("convert an array of characters to a string for printing"), a loop of 5 that reads a number with <code>is.read()</code> and the blank after it, then a <code>byte[11]</code> for the file name stored at the end. Output: "5 1 2 3 4 5 LStream.txt".</p>
<p>The read part is inside the <code>demo1</code> region above; its output:</p>
<pre><code class="language-plaintext">The size of file is 23 bytes
The content of file:
5 1 2 3 4 5 LStream.txt
one more read() at the end of the file: -1</code></pre>
<p>The reader mirrors the writer exactly: one byte as a character, one blank, five times (a number + a blank), 11 bytes of name. Printing <code>tmp</code> — an <code>int</code> — shows "1", "2"… as numbers, which is why the console shows digits although the file holds bytes 1–5. One more <code>read()</code> at the end returns <strong>-1</strong>.</p>
<p>Two shortcuts of the slide to be careful with. <code>available()</code> is "bytes that can be read without blocking" — for a local file it equals the remaining size, but for a network or keyboard stream it can be 0 or anything; for a file's size use <code>new File(name).length()</code>. And <code>is.read(bytes)</code> may read <em>fewer</em> bytes than the array holds; its return value says how many — the slides ignore it.</p>
<div class="pitfall">FE1: a file contains "01234567890"; <code>fs.read(list, 0, 4)</code> then <code>System.out.format("%c%n", list[1])</code> → prints <strong>1</strong> (bytes 0..3 are '0','1','2','3'; index 1 is '1'; <code>%c</code> accepts a <code>byte</code>).</div>`,
        `<p class="y-chinh">🎯 Đọc file lại: <code>FileInputStream is</code>, <code>is.available()</code> để lấy kích thước ("The size of file is 23 bytes"), một <code>byte[1]</code> để đọc '5' và dấu cách rồi in bằng <code>new String(bytes)</code> ("đổi mảng ký tự thành chuỗi cho dễ in"), vòng lặp 5 lần đọc một số bằng <code>is.read()</code> và dấu cách sau nó, rồi một <code>byte[11]</code> cho tên file lưu ở cuối. Output: "5 1 2 3 4 5 LStream.txt".</p>
<p>Phần đọc nằm trong vùng <code>demo1</code> ở trên; output của nó:</p>
<pre><code class="language-plaintext">The size of file is 23 bytes
The content of file:
5 1 2 3 4 5 LStream.txt
one more read() at the end of the file: -1</code></pre>
<p>Bên đọc soi gương đúng bên ghi: một byte dạng ký tự, một dấu cách, năm lần (một số + một dấu cách), 11 byte tên file. In <code>tmp</code> — một <code>int</code> — hiện "1", "2"… dạng số, vì thế console hiện chữ số dù file chứa byte 1–5. Gọi <code>read()</code> thêm một lần ở cuối thì nhận <strong>-1</strong>.</p>
<p>Hai lối tắt của slide cần cẩn thận. <code>available()</code> là "số byte đọc được mà không phải chờ" — với file trên máy nó bằng số byte còn lại, nhưng với luồng mạng hay bàn phím nó có thể là 0 hoặc số bất kỳ; muốn kích thước file thì dùng <code>new File(name).length()</code>. Và <code>is.read(bytes)</code> có thể đọc <em>ít hơn</em> sức chứa của mảng; giá trị trả về cho biết bao nhiêu — slide bỏ qua nó.</p>
<div class="pitfall">FE1: file chứa "01234567890"; <code>fs.read(list, 0, 4)</code> rồi <code>System.out.format("%c%n", list[1])</code> → in <strong>1</strong> (byte 0..3 là '0','1','2','3'; chỉ số 1 là '1'; <code>%c</code> nhận được <code>byte</code>).</div>`],
      [42, 'Access binary files…Low-Level Binary Stream Demo.2',
        `<p class="y-chinh">🎯 Demo 2 is the same as demo 1, but each small number is converted to a <strong>digit</strong> before writing: <code>os.write(Character.forDigit(a[i], 10))</code>. "Now we can see all the file content because they are characters": NetBeans shows "5 1 2 3 4 5 LStream.txt".</p>
<pre class="trich"><code class="language-java">try (FileOutputStream os = new FileOutputStream(fileName)) {   // demo 2: the same, but digits instead of small numbers
    os.write(n);
    os.write(BLANK);
    for (int i = 0; i &lt; 5; i++) {
        os.write(Character.forDigit(a[i], 10));                 // 1 -&gt; '1' = byte 0x31
        os.write(BLANK);
    }
    for (int i = 0; i &lt; fileName.length(); i++) os.write(fileName.charAt(i));
} catch (IOException e) {
    e.printStackTrace();
}
System.out.println("demo 2 wrote: " + hex(fileName));
try (FileInputStream is = new FileInputStream(fileName)) {
    int count = is.available();
    byte[] bytes = new byte[count];
    int readCount = is.read(bytes);
    System.out.println("The content of file: " + new String(bytes) + " | Number of read bytes: " + readCount);
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">demo 2 wrote: 35 20 31 20 32 20 33 20 34 20 35 20 4C 53 74 72 65 61 6D 2E 74 78 74</code></pre>
<p>Compare with demo 1 byte by byte: only five bytes changed, <code>01</code>…<code>05</code> became <code>31</code>…<code>35</code> — the character codes of '1'…'5'. <code>Character.forDigit(1, 10)</code> returns the <code>char</code> '1' (digit 1 in base 10). The file is now a text file, written with a byte stream: for ASCII characters one char = one byte, so it works.</p>
<p>This is the whole difference between "text" and "binary" in one example: the <em>number</em> 1 is the byte <code>01</code>; the <em>character</em> '1' is the byte <code>31</code>. The reverse conversion is <code>Character.digit('1', 10)</code> → 1, or <code>c - '0'</code>.</p>
<div class="pitfall">This trick only works for ASCII. Writing <code>os.write('ă')</code> keeps only the low byte <code>03</code> (same loss as <code>writeBytes</code> on slide 38). For text with Vietnamese, use a <code>Writer</code> with UTF-8 (lesson 9.B, slide 34).</div>`,
        `<p class="y-chinh">🎯 Demo 2 giống demo 1, nhưng mỗi con số nhỏ được đổi thành <strong>chữ số</strong> trước khi ghi: <code>os.write(Character.forDigit(a[i], 10))</code>. "Giờ ta thấy được toàn bộ nội dung file vì chúng đều là ký tự": NetBeans hiện "5 1 2 3 4 5 LStream.txt".</p>
<pre class="trich"><code class="language-java">try (FileOutputStream os = new FileOutputStream(fileName)) {   // demo 2: như trên, nhưng ghi chữ số thay vì số nhỏ
    os.write(n);
    os.write(BLANK);
    for (int i = 0; i &lt; 5; i++) {
        os.write(Character.forDigit(a[i], 10));                 // 1 -&gt; '1' = byte 0x31
        os.write(BLANK);
    }
    for (int i = 0; i &lt; fileName.length(); i++) os.write(fileName.charAt(i));
} catch (IOException e) {
    e.printStackTrace();
}
System.out.println("demo 2 wrote: " + hex(fileName));
try (FileInputStream is = new FileInputStream(fileName)) {
    int count = is.available();
    byte[] bytes = new byte[count];
    int readCount = is.read(bytes);
    System.out.println("The content of file: " + new String(bytes) + " | Number of read bytes: " + readCount);
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">demo 2 wrote: 35 20 31 20 32 20 33 20 34 20 35 20 4C 53 74 72 65 61 6D 2E 74 78 74</code></pre>
<p>So với demo 1 từng byte: chỉ năm byte đổi, <code>01</code>…<code>05</code> thành <code>31</code>…<code>35</code> — mã ký tự của '1'…'5'. <code>Character.forDigit(1, 10)</code> trả về <code>char</code> '1' (chữ số 1 trong hệ cơ số 10). File giờ là một file văn bản, được ghi bằng luồng byte: với ký tự ASCII thì một ký tự = một byte, nên chạy được.</p>
<p>Đây là toàn bộ khác biệt giữa "văn bản" và "nhị phân" trong một ví dụ: <em>con số</em> 1 là byte <code>01</code>; <em>ký tự</em> '1' là byte <code>31</code>. Phép đổi ngược là <code>Character.digit('1', 10)</code> → 1, hoặc <code>c - '0'</code>.</p>
<div class="pitfall">Mẹo này chỉ đúng với ASCII. Ghi <code>os.write('ă')</code> chỉ giữ byte thấp <code>03</code> (cùng kiểu mất dữ liệu như <code>writeBytes</code> ở slide 38). Văn bản có tiếng Việt thì dùng <code>Writer</code> với UTF-8 (bài 9.B, slide 34).</div>`],
      [43, 'Access binary files…Low-Level Binary Stream Demo.2…',
        `<p class="y-chinh">🎯 Reading demo 2 in one go: <code>count = is.available()</code>, <code>byte[] bytes = new byte[count]</code>, <code>int readCount = is.read(bytes)</code>, print <code>new String(bytes)</code> and "Number of read bytes: 23". Output: "The size of file is 23 bytes / The content of file: 5 1 2 3 4 5 LStream.txt / Number of read bytes: 23".</p>
<p>The read part of <code>demo2</code> above, and the full output of the program (both demos and the byte test of slide 40):</p>
<div class="out">demo 1 wrote: 35 20 01 20 02 20 03 20 04 20 05 20 4C 53 74 72 65 61 6D 2E 74 78 74<br>
The size of file is 23 bytes<br>
The content of file:<br>
5 1 2 3 4 5 LStream.txt<br>
one more read() at the end of the file: -1<br>
demo 2 wrote: 35 20 31 20 32 20 33 20 34 20 35 20 4C 53 74 72 65 61 6D 2E 74 78 74<br>
The content of file: 5 1 2 3 4 5 LStream.txt | Number of read bytes: 23<br>
write(127), (200), (255), (256), (300), (-1) stored: 7F C8 FF 00 2C FF<br>
read() returns: 127(byte 127) 200(byte -56) 255(byte -1) 0(byte 0) 44(byte 44) 255(byte -1)</div>
<p>Reading the whole file into one array is the quickest way for small files. <code>new String(bytes)</code> uses the <strong>default encoding</strong> to turn bytes into characters — harmless for ASCII, wrong for UTF-8 Vietnamese on a lab PC; write <code>new String(bytes, "UTF-8")</code>. ➕ On JDK 8 the one-liner is <code>byte[] all = Files.readAllBytes(Paths.get("LStream.txt"));</code> (Java 7), which also handles the "read may return fewer bytes" detail for you.</p>
<p class="meo">🧠 Low-level streams in real code: copying files, images, uploads — anything where you do not care what the bytes mean. Wrap them in a <code>BufferedInputStream</code>/<code>BufferedOutputStream</code> (slide 44): reading one byte per system call is very slow on large files.</p>`,
        `<p class="y-chinh">🎯 Đọc demo 2 một lượt: <code>count = is.available()</code>, <code>byte[] bytes = new byte[count]</code>, <code>int readCount = is.read(bytes)</code>, in <code>new String(bytes)</code> và "Number of read bytes: 23". Output: "The size of file is 23 bytes / The content of file: 5 1 2 3 4 5 LStream.txt / Number of read bytes: 23".</p>
<p>Phần đọc của <code>demo2</code> ở trên, và output đầy đủ của chương trình (cả hai demo và phép thử byte ở slide 40):</p>
<div class="out">demo 1 wrote: 35 20 01 20 02 20 03 20 04 20 05 20 4C 53 74 72 65 61 6D 2E 74 78 74<br>
The size of file is 23 bytes<br>
The content of file:<br>
5 1 2 3 4 5 LStream.txt<br>
one more read() at the end of the file: -1<br>
demo 2 wrote: 35 20 31 20 32 20 33 20 34 20 35 20 4C 53 74 72 65 61 6D 2E 74 78 74<br>
The content of file: 5 1 2 3 4 5 LStream.txt | Number of read bytes: 23<br>
write(127), (200), (255), (256), (300), (-1) stored: 7F C8 FF 00 2C FF<br>
read() returns: 127(byte 127) 200(byte -56) 255(byte -1) 0(byte 0) 44(byte 44) 255(byte -1)</div>
<p>Đọc cả file vào một mảng là cách nhanh nhất cho file nhỏ. <code>new String(bytes)</code> dùng <strong>bảng mã mặc định</strong> để đổi byte thành ký tự — vô hại với ASCII, sai với tiếng Việt UTF-8 trên máy phòng lab; hãy viết <code>new String(bytes, "UTF-8")</code>. ➕ Trên JDK 8 cách một dòng là <code>byte[] all = Files.readAllBytes(Paths.get("LStream.txt"));</code> (Java 7), nó lo luôn chi tiết "read có thể trả ít byte hơn" cho bạn.</p>
<p class="meo">🧠 Luồng mức thấp trong code thật: chép file, ảnh, file tải lên — mọi việc mà bạn không quan tâm các byte mang nghĩa gì. Hãy bọc chúng trong <code>BufferedInputStream</code>/<code>BufferedOutputStream</code> (slide 44): đọc từng byte bằng một lời gọi hệ thống thì rất chậm với file lớn.</p>`],
      [44, 'Access binary filesHigh-Level Binary Stream',
        `<p class="y-chinh">🎯 More often than not, the bytes to read or write form higher-level information (int, String…). The most common high-level streams extend <code>FilterInputStream</code> and <code>FilterOutputStream</code>. They do not read/write devices such as files or sockets; they read/write <strong>other streams</strong>. <code>DataInputStream</code>/<code>DataOutputStream</code>: constructor argument an <code>InputStream</code>/<code>OutputStream</code>, methods <code>readXXX</code>/<code>writeXXX</code>. <code>BufferedInputStream</code>/<code>BufferedOutputStream</code>: read/write in large blocks.</p>
<p>The sizes every <code>writeXXX</code> uses — fixed, the same on every machine (big-endian, the high byte first):</p>
<table>
<thead><tr><th>Method</th><th>Bytes</th><th>Method</th><th>Bytes</th></tr></thead>
<tbody>
<tr><td><code>writeBoolean</code></td><td>1</td><td><code>writeInt</code> / <code>writeFloat</code></td><td>4</td></tr>
<tr><td><code>writeByte</code></td><td>1</td><td><code>writeLong</code> / <code>writeDouble</code></td><td>8</td></tr>
<tr><td><code>writeChar</code> / <code>writeShort</code></td><td>2</td><td><code>writeUTF(s)</code></td><td>2 (length) + 1–3 per char</td></tr>
</tbody>
</table>
<p>Stacking three layers — data → buffer → file — and the "write the count first" pattern, so the reader knows when to stop:</p>
<pre class="trich"><code class="language-java">try (DataOutputStream out = new DataOutputStream(
        new BufferedOutputStream(new FileOutputStream("diem.bin")))) {   // three layers: data -&gt; buffer -&gt; file
    out.writeInt(3);
    out.writeUTF("Lan"); out.writeDouble(8.5);
    out.writeUTF("Hùng"); out.writeDouble(7.0);
    out.writeUTF("Đạt"); out.writeDouble(9.25);
} catch (IOException e) {
    e.printStackTrace();
}
try (DataInputStream in = new DataInputStream(new BufferedInputStream(new FileInputStream("diem.bin")))) {
    int count = in.readInt();                                       // the count written first tells us when to stop
    for (int i = 0; i &lt; count; i++) System.out.print(in.readUTF() + "=" + in.readDouble() + "  ");
    System.out.println("| diem.bin = " + new File("diem.bin").length() + " bytes");
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">Lan=8.5  Hùng=7.0  Đạt=9.25  | diem.bin = 48 bytes</code></pre>
<p>48 bytes = 4 (count) + 3 × (2 + name + 8). "Hùng" is 5 bytes in modified UTF-8, "Đạt" 6. The buffer collects small writes and sends them to the file in 8 KB blocks; closing the outer stream flushes and closes all three.</p>
<div class="pitfall">FE: "Which object is a parameter of the DataInputStream constructor?" → an object of <strong>FileInputStream</strong> (any <code>InputStream</code>) — not a <code>File</code>, not a <code>BufferedReader</code>, not a <code>RandomAccessFile</code>. <code>new DataInputStream("a.dat")</code> does not compile.</div>`,
        `<p class="y-chinh">🎯 Phần lớn thời gian, các byte cần đọc/ghi tạo thành thông tin mức cao hơn (int, String…). Các luồng mức cao thông dụng nhất kế thừa <code>FilterInputStream</code> và <code>FilterOutputStream</code>. Chúng không đọc/ghi thiết bị như file hay socket; chúng đọc/ghi <strong>luồng khác</strong>. <code>DataInputStream</code>/<code>DataOutputStream</code>: hàm tạo nhận một <code>InputStream</code>/<code>OutputStream</code>, phương thức <code>readXXX</code>/<code>writeXXX</code>. <code>BufferedInputStream</code>/<code>BufferedOutputStream</code>: đọc/ghi theo khối lớn.</p>
<p>Kích thước mà mỗi <code>writeXXX</code> dùng — cố định, như nhau trên mọi máy (big-endian, byte cao đứng trước):</p>
<table>
<thead><tr><th>Phương thức</th><th>Byte</th><th>Phương thức</th><th>Byte</th></tr></thead>
<tbody>
<tr><td><code>writeBoolean</code></td><td>1</td><td><code>writeInt</code> / <code>writeFloat</code></td><td>4</td></tr>
<tr><td><code>writeByte</code></td><td>1</td><td><code>writeLong</code> / <code>writeDouble</code></td><td>8</td></tr>
<tr><td><code>writeChar</code> / <code>writeShort</code></td><td>2</td><td><code>writeUTF(s)</code></td><td>2 (độ dài) + 1–3 mỗi ký tự</td></tr>
</tbody>
</table>
<p>Xếp chồng ba lớp — dữ liệu → bộ đệm → file — và khuôn "ghi số lượng trước" để bên đọc biết khi nào dừng:</p>
<pre class="trich"><code class="language-java">try (DataOutputStream out = new DataOutputStream(
        new BufferedOutputStream(new FileOutputStream("diem.bin")))) {   // ba lớp: dữ liệu -&gt; bộ đệm -&gt; file
    out.writeInt(3);
    out.writeUTF("Lan"); out.writeDouble(8.5);
    out.writeUTF("Hùng"); out.writeDouble(7.0);
    out.writeUTF("Đạt"); out.writeDouble(9.25);
} catch (IOException e) {
    e.printStackTrace();
}
try (DataInputStream in = new DataInputStream(new BufferedInputStream(new FileInputStream("diem.bin")))) {
    int count = in.readInt();                                       // số lượng ghi trước cho biết khi nào dừng
    for (int i = 0; i &lt; count; i++) System.out.print(in.readUTF() + "=" + in.readDouble() + "  ");
    System.out.println("| diem.bin = " + new File("diem.bin").length() + " bytes");
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<pre><code class="language-plaintext">Lan=8.5  Hùng=7.0  Đạt=9.25  | diem.bin = 48 bytes</code></pre>
<p>48 byte = 4 (số lượng) + 3 × (2 + tên + 8). "Hùng" chiếm 5 byte theo modified UTF-8, "Đạt" 6. Bộ đệm gom các lần ghi nhỏ rồi gửi xuống file theo khối 8 KB; đóng luồng ngoài cùng là flush và đóng cả ba.</p>
<div class="pitfall">FE: "Đối tượng nào là tham số của hàm tạo DataInputStream?" → một đối tượng <strong>FileInputStream</strong> (bất kỳ <code>InputStream</code> nào) — không phải <code>File</code>, không phải <code>BufferedReader</code>, không phải <code>RandomAccessFile</code>. <code>new DataInputStream("a.dat")</code> không biên dịch.</div>`],
      [45, 'Access binary files…High-Level Binary Streams',
        `<p class="y-chinh">🎯 The <code>InputStream</code>/<code>OutputStream</code> trees again (JDK 1.6 Javadoc), with <code>DataInputStream (implements java.io.DataInput)</code> and <code>DataOutputStream (implements java.io.DataOutput)</code> framed in red.</p>
<p>The red frames point at the two <strong>interfaces</strong> that define the high-level methods: <code>DataInput</code> (<code>readInt</code>, <code>readUTF</code>, <code>readFully</code>…) and <code>DataOutput</code> (<code>writeInt</code>, <code>writeUTF</code>…). Three classes implement them: <code>DataInputStream</code>/<code>DataOutputStream</code>, <code>RandomAccessFile</code> (both), and <code>ObjectInputStream</code>/<code>ObjectOutputStream</code> (through <code>ObjectInput</code>/<code>ObjectOutput</code>, which extend them). That is why the byte layout is the same everywhere: a file written with <code>DataOutputStream.writeInt</code> can be read with <code>RandomAccessFile.readInt</code>, and an object stream can also <code>writeInt</code> between objects.</p>
<p>The class diagram is under slide 39. Programming against the interface works here too: a method <code>void save(DataOutput out)</code> can write into a <code>DataOutputStream</code> or a <code>RandomAccessFile</code> without changing a line — the same idea as <code>List</code> vs <code>ArrayList</code> in Chapter 8.</p>
<p class="meo">🧠 One picture to remember: <em>Data… = typed values over bytes; Buffered… = speed; Object… = whole objects; File… = the file itself.</em> You combine them like layers of a cake, the <code>File…</code> stream always at the bottom.</p>`,
        `<p class="y-chinh">🎯 Lại cây <code>InputStream</code>/<code>OutputStream</code> (Javadoc JDK 1.6), với <code>DataInputStream (implements java.io.DataInput)</code> và <code>DataOutputStream (implements java.io.DataOutput)</code> được đóng khung đỏ.</p>
<p>Hai khung đỏ chỉ vào hai <strong>interface</strong> định nghĩa các phương thức mức cao: <code>DataInput</code> (<code>readInt</code>, <code>readUTF</code>, <code>readFully</code>…) và <code>DataOutput</code> (<code>writeInt</code>, <code>writeUTF</code>…). Ba nhóm lớp hiện thực chúng: <code>DataInputStream</code>/<code>DataOutputStream</code>, <code>RandomAccessFile</code> (cả hai), và <code>ObjectInputStream</code>/<code>ObjectOutputStream</code> (qua <code>ObjectInput</code>/<code>ObjectOutput</code>, vốn kế thừa chúng). Vì thế bố cục byte ở đâu cũng giống nhau: file ghi bằng <code>DataOutputStream.writeInt</code> đọc được bằng <code>RandomAccessFile.readInt</code>, và luồng đối tượng cũng <code>writeInt</code> được xen giữa các đối tượng.</p>
<p>Sơ đồ lớp nằm ở slide 39. Lập trình theo interface cũng đúng ở đây: một phương thức <code>void save(DataOutput out)</code> ghi được vào <code>DataOutputStream</code> lẫn <code>RandomAccessFile</code> mà không sửa dòng nào — cùng ý tưởng <code>List</code> và <code>ArrayList</code> ở Chương 8.</p>
<p class="meo">🧠 Một hình ảnh để nhớ: <em>Data… = giá trị có kiểu trên nền byte; Buffered… = tốc độ; Object… = cả đối tượng; File… = chính cái file.</em> Bạn ghép chúng như các lớp bánh, luồng <code>File…</code> luôn nằm dưới cùng.</p>`],
      [46, 'Access binary files…High-Level Binary Stream Demo.',
        `<p class="y-chinh">🎯 <code>HighLevelStreamDemo</code>: <code>FileOutputStream os</code> on "HStream.txt", <code>DataOutputStream ds = new DataOutputStream(os)</code>; <code>writeChar('5')</code>, <code>writeChar(BLANK)</code>, then 5 × (<code>writeInt(a[i])</code>, <code>writeChar(BLANK)</code>), then <code>writeUTF(fileName)</code>; close both. The picture: DataOutputStream (int, string…) → FileOutputStream (byte) → File. "A high-level file access includes some low-level accesses (reading an int includes 4 reads of a byte)." The editor shows "□□□□?□6□□□C–".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/4410f66e49ebbdf4369bf461e3766cd1c866a091.svg" alt="Slides 46–47 redrawn: the data stream turns values into bytes; the file stream moves the bytes" loading="lazy" /><p class="chu-thich">🧩 Slides 46–47 redrawn: the data stream turns values into bytes; the file stream moves the bytes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 46–47 — a high-level stream wraps a low-level one (the HStream.txt demo)
left to right direction
rectangle "your variables\\nchar '5'  int 1..5\\nString HStream.txt" as V #ECFDF5
rectangle "DataOutputStream ds\\nwriteChar → 2 bytes\\nwriteInt → 4 bytes\\nwriteUTF → 2 + n bytes" as D #EEF2FF
rectangle "FileOutputStream os\\nwrite(byte)" as O #EEF2FF
database "HStream.txt\\n47 bytes" as F #FEF3C7
rectangle "DataInputStream dis\\nreadChar readInt readUTF\\n(same ORDER as written)" as DI #EEF2FF
rectangle "FileInputStream is\\nread() → byte" as I #EEF2FF
V --&gt; D
D --&gt; O : one writeInt = 4 write(byte)
O --&gt; F
F --&gt; I
I --&gt; DI : 4 read() = one readInt
note bottom of D
  new DataOutputStream(new FileOutputStream(name))
  closing ds also closes os
end note
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">final char BLANK = 32;
final String fileName = "HStream.txt";
int[] a = { 1, 2, 3, 4, 5 };
char n = '5';
try {
    FileOutputStream os = new FileOutputStream(fileName);          // low level: bytes to the file
    DataOutputStream ds = new DataOutputStream(os);                 // high level: int, char, String -&gt; bytes
    ds.writeChar(n);                                                // 2 bytes
    ds.writeChar(BLANK);
    for (int i = 0; i &lt; 5; i++) {
        ds.writeInt(a[i]);                                          // 4 bytes each
        ds.writeChar(BLANK);
    }
    ds.writeUTF(fileName);                                          // 2-byte length + 11 bytes
    System.out.println("ds.size() = " + ds.size() + " bytes written");
    ds.close();                                                     // closes os too
    os.close();                                                     // harmless second close
} catch (IOException e) {
    e.printStackTrace();
}
System.out.println(hex(fileName));</code></pre>
<pre><code class="language-plaintext">ds.size() = 47 bytes written
00 35 00 20 00 00 00 01 00 20 00 00 00 02 00 20
00 00 00 03 00 20 00 00 00 04 00 20 00 00 00 05
00 20 00 0B 48 53 74 72 65 61 6D 2E 74 78 74</code></pre>
<p>Count them: <code>writeChar</code> = 2 bytes (<code>00 35</code> is '5' as a 16-bit char), the blank <code>00 20</code>, each <code>writeInt</code> 4 bytes (<code>00 00 00 01</code>) + a 2-byte blank, ×5 = 30, then <code>writeUTF</code>: <code>00 0B</code> (length 11) + 11 bytes. 2 + 2 + 30 + 13 = <strong>47</strong>, the slide's number. The garbage the editor shows is these bytes read as text.</p>
<div class="pitfall">Closing: <code>ds.close()</code> closes the stream it wraps, so the slide's second <code>os.close()</code> is harmless but useless. With try-with-resources write only the outer stream: <code>try (DataOutputStream ds = new DataOutputStream(new FileOutputStream(name)))</code>. The name "HStream.<strong>txt</strong>" is misleading: it is a binary file; use <code>.dat</code> or <code>.bin</code>.</div>`,
        `<p class="y-chinh">🎯 <code>HighLevelStreamDemo</code>: <code>FileOutputStream os</code> trên "HStream.txt", <code>DataOutputStream ds = new DataOutputStream(os)</code>; <code>writeChar('5')</code>, <code>writeChar(BLANK)</code>, rồi 5 lần (<code>writeInt(a[i])</code>, <code>writeChar(BLANK)</code>), rồi <code>writeUTF(fileName)</code>; đóng cả hai. Hình vẽ: DataOutputStream (int, string…) → FileOutputStream (byte) → File. "Một lần truy cập file mức cao gồm vài lần truy cập mức thấp (đọc một int gồm 4 lần đọc một byte)." Trình soạn thảo hiện "□□□□?□6□□□C–".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/4410f66e49ebbdf4369bf461e3766cd1c866a091.svg" alt="Slide 46–47 vẽ lại: luồng dữ liệu đổi giá trị thành byte; luồng file chuyển các byte" loading="lazy" /><p class="chu-thich">🧩 Slide 46–47 vẽ lại: luồng dữ liệu đổi giá trị thành byte; luồng file chuyển các byte</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 46–47 — a high-level stream wraps a low-level one (the HStream.txt demo)
left to right direction
rectangle "your variables\\nchar '5'  int 1..5\\nString HStream.txt" as V #ECFDF5
rectangle "DataOutputStream ds\\nwriteChar → 2 bytes\\nwriteInt → 4 bytes\\nwriteUTF → 2 + n bytes" as D #EEF2FF
rectangle "FileOutputStream os\\nwrite(byte)" as O #EEF2FF
database "HStream.txt\\n47 bytes" as F #FEF3C7
rectangle "DataInputStream dis\\nreadChar readInt readUTF\\n(same ORDER as written)" as DI #EEF2FF
rectangle "FileInputStream is\\nread() → byte" as I #EEF2FF
V --&gt; D
D --&gt; O : one writeInt = 4 write(byte)
O --&gt; F
F --&gt; I
I --&gt; DI : 4 read() = one readInt
note bottom of D
  new DataOutputStream(new FileOutputStream(name))
  closing ds also closes os
end note
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">final char BLANK = 32;
final String fileName = "HStream.txt";
int[] a = { 1, 2, 3, 4, 5 };
char n = '5';
try {
    FileOutputStream os = new FileOutputStream(fileName);          // mức thấp: byte xuống file
    DataOutputStream ds = new DataOutputStream(os);                 // mức cao: int, char, String -&gt; byte
    ds.writeChar(n);                                                // 2 byte
    ds.writeChar(BLANK);
    for (int i = 0; i &lt; 5; i++) {
        ds.writeInt(a[i]);                                          // mỗi số 4 byte
        ds.writeChar(BLANK);
    }
    ds.writeUTF(fileName);                                          // 2 byte độ dài + 11 byte
    System.out.println("ds.size() = " + ds.size() + " bytes written");
    ds.close();                                                     // đóng luôn os
    os.close();                                                     // đóng lần hai, vô hại
} catch (IOException e) {
    e.printStackTrace();
}
System.out.println(hex(fileName));</code></pre>
<pre><code class="language-plaintext">ds.size() = 47 bytes written
00 35 00 20 00 00 00 01 00 20 00 00 00 02 00 20
00 00 00 03 00 20 00 00 00 04 00 20 00 00 00 05
00 20 00 0B 48 53 74 72 65 61 6D 2E 74 78 74</code></pre>
<p>Đếm: <code>writeChar</code> = 2 byte (<code>00 35</code> là '5' dạng char 16 bit), dấu cách <code>00 20</code>, mỗi <code>writeInt</code> 4 byte (<code>00 00 00 01</code>) + dấu cách 2 byte, ×5 = 30, rồi <code>writeUTF</code>: <code>00 0B</code> (độ dài 11) + 11 byte. 2 + 2 + 30 + 13 = <strong>47</strong>, đúng con số của slide. Mớ ký tự lạ trên trình soạn thảo là các byte này bị đọc như văn bản.</p>
<div class="pitfall">Đóng luồng: <code>ds.close()</code> đóng luôn luồng nó bọc, nên <code>os.close()</code> thứ hai của slide vô hại nhưng vô ích. Với try-with-resources chỉ cần ghi luồng ngoài cùng: <code>try (DataOutputStream ds = new DataOutputStream(new FileOutputStream(name)))</code>. Cái tên "HStream.<strong>txt</strong>" gây hiểu lầm: đây là file nhị phân; hãy dùng <code>.dat</code> hoặc <code>.bin</code>.</div>`],
      [47, 'Access binary files… High-Level Binary Stream Demo. …',
        `<p class="y-chinh">🎯 Reading: <code>FileInputStream is</code>, <code>DataInputStream dis = new DataInputStream(is)</code>, <code>dis.available()</code> → "The size of file is 47 bytes", then <code>readChar()</code>, <code>readChar()</code>, 5 × (<code>readInt()</code>, <code>readChar()</code>), <code>readUTF()</code> → "5 1 2 3 4 5 HStream.txt". The picture: bytes go from a-file up the FileInputStream pipe, then up the DataInputStream pipe as int/String.</p>
<pre class="trich"><code class="language-java">try (DataInputStream dis = new DataInputStream(new FileInputStream(fileName))) {
    System.out.println("The size of file is " + dis.available() + " bytes");
    System.out.print("The content of file: ");
    System.out.print(dis.readChar());
    System.out.print(dis.readChar());
    for (int i = 0; i &lt; 5; i++) {
        System.out.print(dis.readInt());
        System.out.print(dis.readChar());
    }
    System.out.println(dis.readUTF());
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<p>The rule of data streams: <strong>read in exactly the order and types you wrote</strong>. Two experiments break it — reading an <code>int</code> first, and reading past the end:</p>
<pre class="trich"><code class="language-java">try (DataInputStream dis = new DataInputStream(new FileInputStream(fileName))) {
    System.out.println("readInt() first instead of readChar(): " + dis.readInt());   // bytes 00 35 00 20 glued into one int
} catch (IOException e) {
    e.printStackTrace();
}
try (DataInputStream dis = new DataInputStream(new FileInputStream(fileName))) {
    dis.skipBytes(47);                                              // jump to the end
    dis.readInt();
} catch (IOException e) {
    System.out.println("readInt() at the end of the file: " + e);   // no -1 here: an EXCEPTION
}</code></pre>
<div class="out">ds.size() = 47 bytes written<br>
00 35 00 20 00 00 00 01 00 20 00 00 00 02 00 20<br>
00 00 00 03 00 20 00 00 00 04 00 20 00 00 00 05<br>
00 20 00 0B 48 53 74 72 65 61 6D 2E 74 78 74<br>
The size of file is 47 bytes<br>
The content of file: 5 1 2 3 4 5 HStream.txt<br>
readInt() first instead of readChar(): 3473440<br>
readInt() at the end of the file: java.io.EOFException<br>
Lan=8.5 &nbsp;Hùng=7.0 &nbsp;Đạt=9.25 &nbsp;| diem.bin = 48 bytes</div>
<p><code>readInt()</code> on the first 4 bytes <code>00 35 00 20</code> glues two chars into one number, 0x00350020 = <strong>3473440</strong> — no error, just a wrong value; the file has no types inside, only bytes. At the end, <code>readInt()</code> does not return -1 (every <code>int</code> value is valid data): it throws <strong><code>EOFException</code></strong>. So with data streams you either know the count (write it first, as on slide 44) or catch <code>EOFException</code> as "the end".</p>
<div class="callout">🧭 <strong>Go further</strong>: this "agree on a byte layout" is how network protocols and file formats (PNG, ZIP, the <code>.class</code> file itself — <code>CA FE BA BE</code>) are built. You will meet it again in CSD201 (binary search on fixed records) and when Spring Boot sends JSON — the text-based answer to the same problem.</div>`,
        `<p class="y-chinh">🎯 Phần đọc: <code>FileInputStream is</code>, <code>DataInputStream dis = new DataInputStream(is)</code>, <code>dis.available()</code> → "The size of file is 47 bytes", rồi <code>readChar()</code>, <code>readChar()</code>, 5 lần (<code>readInt()</code>, <code>readChar()</code>), <code>readUTF()</code> → "5 1 2 3 4 5 HStream.txt". Hình vẽ: các byte đi từ file lên ống FileInputStream, rồi lên ống DataInputStream thành int/String.</p>
<pre class="trich"><code class="language-java">try (DataInputStream dis = new DataInputStream(new FileInputStream(fileName))) {
    System.out.println("The size of file is " + dis.available() + " bytes");
    System.out.print("The content of file: ");
    System.out.print(dis.readChar());
    System.out.print(dis.readChar());
    for (int i = 0; i &lt; 5; i++) {
        System.out.print(dis.readInt());
        System.out.print(dis.readChar());
    }
    System.out.println(dis.readUTF());
} catch (IOException e) {
    e.printStackTrace();
}</code></pre>
<p>Luật của luồng dữ liệu: <strong>đọc đúng thứ tự và đúng kiểu đã ghi</strong>. Hai thí nghiệm phá luật — đọc một <code>int</code> trước, và đọc quá cuối file:</p>
<pre class="trich"><code class="language-java">try (DataInputStream dis = new DataInputStream(new FileInputStream(fileName))) {
    System.out.println("readInt() first instead of readChar(): " + dis.readInt());   // byte 00 35 00 20 bị dán thành một int
} catch (IOException e) {
    e.printStackTrace();
}
try (DataInputStream dis = new DataInputStream(new FileInputStream(fileName))) {
    dis.skipBytes(47);                                              // nhảy tới cuối
    dis.readInt();
} catch (IOException e) {
    System.out.println("readInt() at the end of the file: " + e);   // ở đây không có -1: mà là NGOẠI LỆ
}</code></pre>
<div class="out">ds.size() = 47 bytes written<br>
00 35 00 20 00 00 00 01 00 20 00 00 00 02 00 20<br>
00 00 00 03 00 20 00 00 00 04 00 20 00 00 00 05<br>
00 20 00 0B 48 53 74 72 65 61 6D 2E 74 78 74<br>
The size of file is 47 bytes<br>
The content of file: 5 1 2 3 4 5 HStream.txt<br>
readInt() first instead of readChar(): 3473440<br>
readInt() at the end of the file: java.io.EOFException<br>
Lan=8.5 &nbsp;Hùng=7.0 &nbsp;Đạt=9.25 &nbsp;| diem.bin = 48 bytes</div>
<p><code>readInt()</code> trên 4 byte đầu <code>00 35 00 20</code> dán hai char thành một số, 0x00350020 = <strong>3473440</strong> — không lỗi gì, chỉ ra giá trị sai; trong file không có kiểu, chỉ có byte. Ở cuối, <code>readInt()</code> không trả -1 (mọi giá trị <code>int</code> đều là dữ liệu hợp lệ): nó ném <strong><code>EOFException</code></strong>. Vậy với luồng dữ liệu, hoặc bạn biết số lượng (ghi nó trước, như slide 44) hoặc bắt <code>EOFException</code> làm dấu "hết".</p>
<div class="callout">🧭 <strong>Đi tiếp</strong>: "thống nhất một bố cục byte" là cách các giao thức mạng và định dạng file (PNG, ZIP, chính file <code>.class</code> — <code>CA FE BA BE</code>) được xây dựng. Bạn sẽ gặp lại ở CSD201 (tìm kiếm nhị phân trên bản ghi cố định) và khi Spring Boot gửi JSON — lời giải dạng văn bản cho cùng bài toán.</div>`],
      [48, '6- Access Object Files',
        `<p class="y-chinh">🎯 Two object streams: <code>ObjectInputStream</code> and <code>ObjectOutputStream</code> (children of <code>InputStream</code>/<code>OutputStream</code>, implementing <code>ObjectInput</code>/<code>ObjectOutput</code>). <strong>Serialization</strong> concatenates all the data of an object into a byte stream that can be written to a data source; <strong>static and transient data cannot be serialized</strong>. <strong>De-serialization</strong> reads the byte stream, splits it into fields and assigns them to the fields of an object. Transient fields are omitted.</p>
<p>The classes used in the next three slides — a student with every kind of field the slide talks about:</p>
<pre class="trich"><code class="language-java">class DiaChi implements Serializable {
    String thanhPho;
    DiaChi(String tp) { thanhPho = tp; }
}

class SinhVien implements Serializable {                 // a marker interface: no method to write
    private static final long serialVersionUID = 1L;     // the class's version number (lesson text, slide 53)
    static String truong = "FPTU Ha Noi";                 // static: belongs to the CLASS, not written
    String ma;
    String ten;
    double gpa;
    transient String matKhau;                            // transient: skipped on purpose
    DiaChi diaChi;                                       // a reference: the DiaChi object is written too

    SinhVien(String ma, String ten, double gpa, String mk, DiaChi dc) {
        this.ma = ma; this.ten = ten; this.gpa = gpa; matKhau = mk; diaChi = dc;
        System.out.println("  (constructor of SinhVien runs for " + ma + ")");
    }
    public String toString() {
        return ma + " " + ten + " gpa=" + gpa + " matKhau=" + matKhau + " diaChi=" + (diaChi == null ? null : diaChi.thanhPho) + " truong=" + truong;
    }
}

class KhongTuanTu {                                       // NOT Serializable
    String x = "hello";
}</code></pre>
<p>Four kinds of field, four behaviours: <code>ma</code>, <code>ten</code>, <code>gpa</code> are written; <code>truong</code> is <code>static</code> — it belongs to the class, not to the object, so it is not part of the object's data; <code>matKhau</code> is <code>transient</code> — "do not save this" (passwords, caches, open connections); <code>diaChi</code> is a <strong>reference</strong> to another object, which gets written along (it must be <code>Serializable</code> too).</p>
<p><code>implements Serializable</code> is all a class needs: <code>Serializable</code> is a <strong>marker interface</strong> — it has no methods; it only tells <code>ObjectOutputStream</code> "this class agrees to be saved". <code>serialVersionUID</code> is explained under slide 50.</p>
<div class="pitfall">FE (FE5, FE10, FE13–FE15): "Which members won't be serialized?" → <strong>transient variables</strong> (and static ones). <code>final</code> fields and inherited fields <em>are</em> serialized (if the class that declares them is Serializable).</div>`,
        `<p class="y-chinh">🎯 Hai luồng đối tượng: <code>ObjectInputStream</code> và <code>ObjectOutputStream</code> (con của <code>InputStream</code>/<code>OutputStream</code>, hiện thực <code>ObjectInput</code>/<code>ObjectOutput</code>). <strong>Tuần tự hoá</strong> (serialization) nối mọi dữ liệu của một đối tượng thành một dòng byte để ghi ra nguồn dữ liệu; <strong>dữ liệu static và transient không được tuần tự hoá</strong>. <strong>Giải tuần tự hoá</strong> (de-serialization) đọc dòng byte, tách thành các trường và gán vào các trường của một đối tượng. Trường transient bị bỏ qua.</p>
<p>Các lớp dùng cho ba slide tiếp theo — một sinh viên có đủ mọi loại trường mà slide nhắc tới:</p>
<pre class="trich"><code class="language-java">class DiaChi implements Serializable {
    String thanhPho;
    DiaChi(String tp) { thanhPho = tp; }
}

class SinhVien implements Serializable {                 // interface đánh dấu: không có phương thức nào phải viết
    private static final long serialVersionUID = 1L;     // số phiên bản của lớp (xem slide 53)
    static String truong = "FPTU Ha Noi";                 // static: thuộc về LỚP, không được ghi
    String ma;
    String ten;
    double gpa;
    transient String matKhau;                            // transient: cố ý bỏ qua
    DiaChi diaChi;                                       // một tham chiếu: đối tượng DiaChi cũng được ghi

    SinhVien(String ma, String ten, double gpa, String mk, DiaChi dc) {
        this.ma = ma; this.ten = ten; this.gpa = gpa; matKhau = mk; diaChi = dc;
        System.out.println("  (constructor of SinhVien runs for " + ma + ")");
    }
    public String toString() {
        return ma + " " + ten + " gpa=" + gpa + " matKhau=" + matKhau + " diaChi=" + (diaChi == null ? null : diaChi.thanhPho) + " truong=" + truong;
    }
}

class KhongTuanTu {                                       // KHÔNG Serializable
    String x = "hello";
}</code></pre>
<p>Bốn loại trường, bốn hành vi: <code>ma</code>, <code>ten</code>, <code>gpa</code> được ghi; <code>truong</code> là <code>static</code> — thuộc về lớp chứ không thuộc đối tượng, nên không nằm trong dữ liệu của đối tượng; <code>matKhau</code> là <code>transient</code> — "đừng lưu cái này" (mật khẩu, bộ nhớ đệm, kết nối đang mở); <code>diaChi</code> là một <strong>tham chiếu</strong> tới đối tượng khác, đối tượng đó được ghi theo (nó cũng phải <code>Serializable</code>).</p>
<p><code>implements Serializable</code> là tất cả những gì một lớp cần: <code>Serializable</code> là một <strong>interface đánh dấu</strong> (marker interface) — nó không có phương thức nào; nó chỉ báo cho <code>ObjectOutputStream</code> "lớp này đồng ý được lưu". <code>serialVersionUID</code> được giải thích ở slide 50.</p>
<div class="pitfall">FE (FE5, FE10, FE13–FE15): "Thành phần nào sẽ KHÔNG được tuần tự hoá?" → <strong>biến transient</strong> (và biến static). Trường <code>final</code> và trường kế thừa <em>vẫn</em> được tuần tự hoá (nếu lớp khai báo chúng là Serializable).</div>`],
      [49, 'Serialization',
        `<p class="y-chinh">🎯 Writing an object is called <strong>serialization</strong>; use <code>java.io.ObjectOutputStream</code>. Only the object's <strong>data</strong> is serialized, not its class definition. When an object contains references to other objects, every referenced object is serialized along with it. Not all data is written: <strong>static</strong> fields are not, <strong>transient</strong> fields are not.</p>
<pre class="trich"><code class="language-java">DiaChi hn = new DiaChi("Ha Noi");
SinhVien a = new SinhVien("HE190001", "Tran Lan", 8.5, "s3cret", hn);
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("sv.dat"))) {
    out.writeObject(a);                                  // serialization
    out.writeObject(a);                                  // the SAME object again: only a back-reference is written
}
System.out.println("written : " + a + "  -&gt; sv.dat " + new File("sv.dat").length() + " bytes");
SinhVien.truong = "FPTU HCM";                            // change the static field AFTER writing</code></pre>
<p>The object is written <strong>twice</strong> on purpose. 175 bytes for both: the second <code>writeObject(a)</code> does not repeat the data — the stream remembers every object it has written and stores only a short back-reference. That is also how it survives cycles (A refers to B, B refers back to A) without looping forever.</p>
<p>"Not its class definition" is precise: the file holds the class <em>name</em> ("SinhVien"), the field names and types and a version number — never the bytecode of the methods. To read the file, a program must have the class itself on its classpath (slide 50).</p>
<div class="pitfall">FE (FE28, FE29): "Select the INCORRECT statement about serialization" — the incorrect one says "the referenced object is <strong>not</strong> serialized along with the original object". Referenced objects ARE written (unless the field is transient).</div>`,
        `<p class="y-chinh">🎯 Việc ghi một đối tượng gọi là <strong>tuần tự hoá</strong>; dùng <code>java.io.ObjectOutputStream</code>. Chỉ <strong>dữ liệu</strong> của đối tượng được tuần tự hoá, không phải định nghĩa lớp. Khi đối tượng chứa tham chiếu tới đối tượng khác, mọi đối tượng được tham chiếu đều được tuần tự hoá theo. Không phải dữ liệu nào cũng được ghi: trường <strong>static</strong> không, trường <strong>transient</strong> cũng không.</p>
<pre class="trich"><code class="language-java">DiaChi hn = new DiaChi("Ha Noi");
SinhVien a = new SinhVien("HE190001", "Tran Lan", 8.5, "s3cret", hn);
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("sv.dat"))) {
    out.writeObject(a);                                  // tuần tự hoá
    out.writeObject(a);                                  // CÙNG đối tượng lần nữa: chỉ ghi một tham chiếu ngược
}
System.out.println("written : " + a + "  -&gt; sv.dat " + new File("sv.dat").length() + " bytes");
SinhVien.truong = "FPTU HCM";                            // đổi trường static SAU khi ghi</code></pre>
<p>Đối tượng được cố ý ghi <strong>hai lần</strong>. Cả hai chỉ tốn 175 byte: lần <code>writeObject(a)</code> thứ hai không lặp lại dữ liệu — luồng nhớ mọi đối tượng nó đã ghi và chỉ cất một tham chiếu ngược ngắn. Đó cũng là cách nó xử lý vòng tham chiếu (A trỏ tới B, B trỏ ngược về A) mà không lặp vô tận.</p>
<p>"Không phải định nghĩa lớp" là chính xác: file chứa <em>tên</em> lớp ("SinhVien"), tên và kiểu các trường và một số phiên bản — không bao giờ chứa bytecode của các phương thức. Muốn đọc file, chương trình phải có chính lớp đó trên classpath (slide 50).</p>
<div class="pitfall">FE (FE28, FE29): "Chọn phát biểu SAI về tuần tự hoá" — câu sai là câu nói "đối tượng được tham chiếu <strong>không</strong> được tuần tự hoá cùng đối tượng gốc". Đối tượng được tham chiếu CÓ được ghi (trừ khi trường đó là transient).</div>`],
      [50, 'De-serialization',
        `<p class="y-chinh">🎯 <strong>De-serialization</strong> converts a serialized representation into a <strong>replica</strong> of the original object; use <code>java.io.ObjectInputStream</code>. An object serialized by one JVM will probably be deserialized by a <em>different</em> JVM, and any JVM that tries to deserialize an object must have access to that object's class definition.</p>
<pre class="trich"><code class="language-java">try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("sv.dat"))) {
    SinhVien b = (SinhVien) in.readObject();             // de-serialization: no constructor call
    SinhVien c = (SinhVien) in.readObject();
    System.out.println("read    : " + b);
    System.out.println("b == a " + (b == a) + ", b == c " + (b == c) + ", b.diaChi == hn " + (b.diaChi == hn));
}</code></pre>
<pre class="trich"><code class="language-java">try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("x.dat"))) {
    out.writeObject(new KhongTuanTu());
    System.out.println("written");
} catch (NotSerializableException e) {
    System.out.println("writeObject(new KhongTuanTu()) -&gt; " + e);
}</code></pre>
<div class="out">&nbsp;&nbsp;(constructor of SinhVien runs for HE190001)<br>
written : HE190001 Tran Lan gpa=8.5 matKhau=s3cret diaChi=Ha Noi truong=FPTU Ha Noi &nbsp;-&gt; sv.dat 175 bytes<br>
read &nbsp;&nbsp;&nbsp;: HE190001 Tran Lan gpa=8.5 matKhau=null diaChi=Ha Noi truong=FPTU HCM<br>
b == a false, b == c true, b.diaChi == hn false<br>
writeObject(new KhongTuanTu()) -&gt; java.io.NotSerializableException: KhongTuanTu</div>
<ul>
<li>A <strong>replica</strong>: <code>b == a</code> is false — a new object with the same values; the constructor did <em>not</em> run again (its message appears once, at creation).</li>
<li><code>matKhau</code> came back <code>null</code> (transient), <code>truong</code> shows "FPTU HCM", the value the static field has <em>now</em> — it was never in the file.</li>
<li>Both reads give the same replica (<code>b == c</code>), as both writes were the same object. <code>KhongTuanTu</code>, not <code>Serializable</code>, makes <code>writeObject</code> throw <code>NotSerializableException</code> — at run time, not at compile time.</li>
</ul>
<p>"Must have the class definition" — and it must be a <strong>compatible version</strong>. A real JDK 8 session: save a <code>Book</code>, add a field to the class, recompile, read the old file:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String ghi = "import java.io.*;\\n" +
        "public class Ghi {\\n" +
        "    public static void main(String[] a) throws Exception {\\n" +
        "        try (ObjectOutputStream o = new ObjectOutputStream(new FileOutputStream(\\"books.dat\\"))) {\\n" +
        "            o.writeObject(new Book(\\"OOP WITH JAVA\\", 120));\\n" +
        "        }\\n" +
        "        System.out.println(\\"saved\\");\\n" +
        "    }\\n" +
        "}\\n";
    String doc = "import java.io.*;\\n" +
        "public class Doc {\\n" +
        "    public static void main(String[] a) throws Exception {\\n" +
        "        try (ObjectInputStream i = new ObjectInputStream(new FileInputStream(\\"books.dat\\"))) {\\n" +
        "            System.out.println(\\"read: \\" + i.readObject());\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n";
    System.out.println("== version 1 of Book, no serialVersionUID ==");
    viet(d, "Book.java", book(false, false));
    viet(d, "Ghi.java", ghi);
    viet(d, "Doc.java", doc);
    lenh(d, "javac", "Book.java", "Ghi.java", "Doc.java");
    lenh(d, "java", "Ghi");
    System.out.println("== version 2 adds a field 'year', recompile, read the OLD file ==");
    viet(d, "Book.java", book(false, true));
    lenh(d, "javac", "Book.java");
    lenh(d, "java", "Doc");
    System.out.println("== the same story with serialVersionUID = 1L in both versions ==");
    viet(d, "Book.java", book(true, false));
    lenh(d, "javac", "Book.java");
    lenh(d, "java", "Ghi");
    viet(d, "Book.java", book(true, true));
    lenh(d, "javac", "Book.java");
    lenh(d, "java", "Doc");
}

static String book(boolean uid, boolean year) {
    return "import java.io.*;\\n" +
        "public class Book implements Serializable {\\n" +
        (uid ? "    private static final long serialVersionUID = 1L;\\n" : "") +
        "    private String title;\\n" +
        "    private int price;\\n" +
        (year ? "    private int year;                // NEW in version 2\\n" : "") +
        "    public Book(String t, int p) { title = t; price = p; }\\n" +
        "    public String toString() { return title + \\" \\" + price" + (year ? " + \\" year=\\" + year" : "") + "; }\\n" +
        "}\\n";
}</code></pre>
<div class="out">== version 1 of Book, no serialVersionUID ==<br>
&gt; javac Book.java Ghi.java Doc.java<br>
&gt; java Ghi<br>
saved<br>
== version 2 adds a field 'year', recompile, read the OLD file ==<br>
&gt; javac Book.java<br>
&gt; java Doc<br>
Exception in thread "main" java.io.InvalidClassException: Book; local class incompatible: stream classdesc serialVersionUID = -1498992477618855073, local class serialVersionUID = -968807712954366521<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
== the same story with serialVersionUID = 1L in both versions ==<br>
&gt; javac Book.java<br>
&gt; java Ghi<br>
saved<br>
&gt; javac Book.java<br>
&gt; java Doc<br>
read: OOP WITH JAVA 120 year=0</div>
<div class="pitfall">Without <code>serialVersionUID</code>, Java computes one from the class's fields and methods; any edit changes it and old files fail with <code>InvalidClassException … local class incompatible</code>. Declare <code>private static final long serialVersionUID = 1L;</code> in every Serializable class: then a new field just gets its default value (year=0). FE (FE23, FE32, FE33): a class <code>A</code> without <code>implements Serializable</code> written in a <code>try</code> with an empty <code>catch</code> → it <strong>compiles</strong>, and an exception is thrown at the <code>writeObject</code> line (then silently caught).</div>`,
        `<p class="y-chinh">🎯 <strong>Giải tuần tự hoá</strong> đổi dạng đã tuần tự hoá thành một <strong>bản sao</strong> của đối tượng gốc; dùng <code>java.io.ObjectInputStream</code>. Một đối tượng được tuần tự hoá bởi JVM này có thể sẽ được giải tuần tự hoá bởi một JVM <em>khác</em>, và JVM nào muốn giải tuần tự hoá một đối tượng thì phải có định nghĩa lớp của đối tượng đó.</p>
<pre class="trich"><code class="language-java">try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("sv.dat"))) {
    SinhVien b = (SinhVien) in.readObject();             // giải tuần tự hoá: không gọi constructor
    SinhVien c = (SinhVien) in.readObject();
    System.out.println("read    : " + b);
    System.out.println("b == a " + (b == a) + ", b == c " + (b == c) + ", b.diaChi == hn " + (b.diaChi == hn));
}</code></pre>
<pre class="trich"><code class="language-java">try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("x.dat"))) {
    out.writeObject(new KhongTuanTu());
    System.out.println("written");
} catch (NotSerializableException e) {
    System.out.println("writeObject(new KhongTuanTu()) -&gt; " + e);
}</code></pre>
<div class="out">&nbsp;&nbsp;(constructor of SinhVien runs for HE190001)<br>
written : HE190001 Tran Lan gpa=8.5 matKhau=s3cret diaChi=Ha Noi truong=FPTU Ha Noi &nbsp;-&gt; sv.dat 175 bytes<br>
read &nbsp;&nbsp;&nbsp;: HE190001 Tran Lan gpa=8.5 matKhau=null diaChi=Ha Noi truong=FPTU HCM<br>
b == a false, b == c true, b.diaChi == hn false<br>
writeObject(new KhongTuanTu()) -&gt; java.io.NotSerializableException: KhongTuanTu</div>
<ul>
<li>Một <strong>bản sao</strong>: <code>b == a</code> là false — một đối tượng mới có cùng giá trị; hàm tạo <em>không</em> chạy lại (thông báo của nó chỉ hiện một lần, lúc tạo).</li>
<li><code>matKhau</code> trở về <code>null</code> (transient), <code>truong</code> hiện "FPTU HCM", giá trị mà trường static đang có <em>lúc này</em> — nó chưa bao giờ nằm trong file.</li>
<li>Hai lần đọc cho cùng một bản sao (<code>b == c</code>), vì hai lần ghi là cùng một đối tượng. <code>KhongTuanTu</code> không <code>Serializable</code> làm <code>writeObject</code> ném <code>NotSerializableException</code> — lúc chạy, không phải lúc biên dịch.</li>
</ul>
<p>"Phải có định nghĩa lớp" — và phải là <strong>phiên bản tương thích</strong>. Một phiên làm việc thật trên JDK 8: lưu một <code>Book</code>, thêm một trường vào lớp, biên dịch lại, đọc file cũ:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String ghi = "import java.io.*;\\n" +
        "public class Ghi {\\n" +
        "    public static void main(String[] a) throws Exception {\\n" +
        "        try (ObjectOutputStream o = new ObjectOutputStream(new FileOutputStream(\\"books.dat\\"))) {\\n" +
        "            o.writeObject(new Book(\\"OOP WITH JAVA\\", 120));\\n" +
        "        }\\n" +
        "        System.out.println(\\"saved\\");\\n" +
        "    }\\n" +
        "}\\n";
    String doc = "import java.io.*;\\n" +
        "public class Doc {\\n" +
        "    public static void main(String[] a) throws Exception {\\n" +
        "        try (ObjectInputStream i = new ObjectInputStream(new FileInputStream(\\"books.dat\\"))) {\\n" +
        "            System.out.println(\\"read: \\" + i.readObject());\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n";
    System.out.println("== version 1 of Book, no serialVersionUID ==");
    viet(d, "Book.java", book(false, false));
    viet(d, "Ghi.java", ghi);
    viet(d, "Doc.java", doc);
    lenh(d, "javac", "Book.java", "Ghi.java", "Doc.java");
    lenh(d, "java", "Ghi");
    System.out.println("== version 2 adds a field 'year', recompile, read the OLD file ==");
    viet(d, "Book.java", book(false, true));
    lenh(d, "javac", "Book.java");
    lenh(d, "java", "Doc");
    System.out.println("== the same story with serialVersionUID = 1L in both versions ==");
    viet(d, "Book.java", book(true, false));
    lenh(d, "javac", "Book.java");
    lenh(d, "java", "Ghi");
    viet(d, "Book.java", book(true, true));
    lenh(d, "javac", "Book.java");
    lenh(d, "java", "Doc");
}

static String book(boolean uid, boolean year) {
    return "import java.io.*;\\n" +
        "public class Book implements Serializable {\\n" +
        (uid ? "    private static final long serialVersionUID = 1L;\\n" : "") +
        "    private String title;\\n" +
        "    private int price;\\n" +
        (year ? "    private int year;                // NEW in version 2\\n" : "") +
        "    public Book(String t, int p) { title = t; price = p; }\\n" +
        "    public String toString() { return title + \\" \\" + price" + (year ? " + \\" year=\\" + year" : "") + "; }\\n" +
        "}\\n";
}</code></pre>
<div class="out">== version 1 of Book, no serialVersionUID ==<br>
&gt; javac Book.java Ghi.java Doc.java<br>
&gt; java Ghi<br>
saved<br>
== version 2 adds a field 'year', recompile, read the OLD file ==<br>
&gt; javac Book.java<br>
&gt; java Doc<br>
Exception in thread "main" java.io.InvalidClassException: Book; local class incompatible: stream classdesc serialVersionUID = -1498992477618855073, local class serialVersionUID = -968807712954366521<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
== the same story with serialVersionUID = 1L in both versions ==<br>
&gt; javac Book.java<br>
&gt; java Ghi<br>
saved<br>
&gt; javac Book.java<br>
&gt; java Doc<br>
read: OOP WITH JAVA 120 year=0</div>
<div class="pitfall">Không có <code>serialVersionUID</code>, Java tự tính một số từ các trường và phương thức của lớp; sửa gì cũng làm số đó đổi và file cũ hỏng với <code>InvalidClassException … local class incompatible</code>. Hãy khai <code>private static final long serialVersionUID = 1L;</code> trong mọi lớp Serializable: khi đó trường mới chỉ nhận giá trị mặc định (year=0). FE (FE23, FE32, FE33): lớp <code>A</code> không <code>implements Serializable</code> được ghi trong <code>try</code> có <code>catch</code> rỗng → nó <strong>biên dịch được</strong>, và một ngoại lệ bị ném ở dòng <code>writeObject</code> (rồi bị bắt im lặng).</div>`],
      [51, 'Access Object Files…: How to?',
        `<p class="y-chinh">🎯 How to: <code>class A implements java.io.Serializable { Type field1; Type field2; … }</code> — "no method is declared". Writing: <code>A obj</code> → <code>writeObject()</code> of an <code>ObjectOutputStream</code> on a <code>FileOutputStream</code> → the file. Reading: the file → <code>FileInputStream</code> → <code>ObjectInputStream f</code> → <code>readObject()</code> → "null?" → <code>A obj</code>. "We can read/write objects from/to a file using a program only."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7a2a8f165f0cd8ad9c82b6e60056186d83866e69.svg" alt="Slide 51 redrawn: the two pipelines, and what readObject really does at the end of the file" loading="lazy" /><p class="chu-thich">🧩 Slide 51 redrawn: the two pipelines, and what readObject really does at the end of the file</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 51 — writing and reading objects (class A implements java.io.Serializable)
left to right direction
rectangle "A obj\\n(fields: values;\\nreferences to other\\nSerializable objects)" as A #ECFDF5
rectangle "ObjectOutputStream\\nwriteObject(obj)" as OOS #EEF2FF
rectangle "FileOutputStream" as FOS #EEF2FF
database "books.dat\\nAC ED 00 05 (header)\\nclass description\\nfield values" as F #FEF3C7
rectangle "FileInputStream" as FIS #EEF2FF
rectangle "ObjectInputStream\\nreadObject() → Object\\n(cast it: (A) ...)" as OIS #EEF2FF
rectangle "a NEW A object\\nsame field values;\\nstatic and transient\\nfields NOT restored" as A2 #ECFDF5
A --&gt; OOS
OOS --&gt; FOS
FOS --&gt; F
F --&gt; FIS
FIS --&gt; OIS
OIS --&gt; A2
note bottom of OIS
  end of file: throws EOFException
  (it never returns null by itself)
end note
@enduml</code></pre></details>
<p>The recipe is right, with two corrections. <strong>(1)</strong> <code>readObject()</code> returns <code>Object</code>: you must cast — <code>A obj = (A) in.readObject();</code> — and it declares <code>ClassNotFoundException</code> as well as <code>IOException</code> (the reading JVM may not have class <code>A</code>). <strong>(2)</strong> The "null?" bubble is wrong: at the end of the file <code>readObject()</code> <strong>throws <code>EOFException</code></strong>; it returns <code>null</code> only if <code>null</code> was written. Slide 55 runs the slide's loop built on that bubble and shows what the user sees.</p>
<p>"Using a program only" is true in practice: the format is binary and specific to Java (it starts with <code>AC ED 00 05</code>), so Notepad shows garbage and Python or JavaScript cannot read it without a special library. That is why web systems exchange <strong>JSON</strong> instead.</p>
<div class="callout">🧭 <strong>Go further — Spring Boot / security</strong>: Java serialization is now considered dangerous for data from outside (reading a crafted file can run code; Oracle's Java chief architect Mark Reinhold called it a "horrible mistake" in 2018, and JEP 290 added deserialization filters). Use it for your own files in PRO192/LAB211; for anything that crosses a network, Spring Boot uses JSON (Jackson).</div>`,
        `<p class="y-chinh">🎯 Cách làm: <code>class A implements java.io.Serializable { Type field1; Type field2; … }</code> — "không phải khai báo phương thức nào". Ghi: <code>A obj</code> → <code>writeObject()</code> của một <code>ObjectOutputStream</code> trên một <code>FileOutputStream</code> → file. Đọc: file → <code>FileInputStream</code> → <code>ObjectInputStream f</code> → <code>readObject()</code> → "null?" → <code>A obj</code>. "Ta chỉ đọc/ghi được đối tượng từ/vào file bằng chương trình."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7a2a8f165f0cd8ad9c82b6e60056186d83866e69.svg" alt="Slide 51 vẽ lại: hai đường ống, và điều readObject thật sự làm khi hết file" loading="lazy" /><p class="chu-thich">🧩 Slide 51 vẽ lại: hai đường ống, và điều readObject thật sự làm khi hết file</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 51 — writing and reading objects (class A implements java.io.Serializable)
left to right direction
rectangle "A obj\\n(fields: values;\\nreferences to other\\nSerializable objects)" as A #ECFDF5
rectangle "ObjectOutputStream\\nwriteObject(obj)" as OOS #EEF2FF
rectangle "FileOutputStream" as FOS #EEF2FF
database "books.dat\\nAC ED 00 05 (header)\\nclass description\\nfield values" as F #FEF3C7
rectangle "FileInputStream" as FIS #EEF2FF
rectangle "ObjectInputStream\\nreadObject() → Object\\n(cast it: (A) ...)" as OIS #EEF2FF
rectangle "a NEW A object\\nsame field values;\\nstatic and transient\\nfields NOT restored" as A2 #ECFDF5
A --&gt; OOS
OOS --&gt; FOS
FOS --&gt; F
F --&gt; FIS
FIS --&gt; OIS
OIS --&gt; A2
note bottom of OIS
  end of file: throws EOFException
  (it never returns null by itself)
end note
@enduml</code></pre></details>
<p>Công thức đúng, với hai chỗ sửa. <strong>(1)</strong> <code>readObject()</code> trả về <code>Object</code>: phải ép kiểu — <code>A obj = (A) in.readObject();</code> — và nó khai báo <code>ClassNotFoundException</code> bên cạnh <code>IOException</code> (JVM đọc có thể không có lớp <code>A</code>). <strong>(2)</strong> Bong bóng "null?" là sai: hết file thì <code>readObject()</code> <strong>ném <code>EOFException</code></strong>; nó chỉ trả <code>null</code> nếu <code>null</code> đã được ghi. Slide 55 chạy vòng lặp của slide dựng trên bong bóng đó và cho thấy người dùng nhìn thấy gì.</p>
<p>"Chỉ bằng chương trình" đúng trên thực tế: định dạng là nhị phân và riêng của Java (bắt đầu bằng <code>AC ED 00 05</code>), nên Notepad hiện ký tự rác và Python hay JavaScript không đọc được nếu không có thư viện đặc biệt. Vì thế các hệ thống web trao đổi bằng <strong>JSON</strong>.</p>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot / bảo mật</strong>: tuần tự hoá Java giờ bị coi là nguy hiểm với dữ liệu từ bên ngoài (đọc một file được dựng có chủ đích có thể làm chạy mã; kiến trúc sư trưởng Java của Oracle, Mark Reinhold, gọi nó là một "sai lầm khủng khiếp" năm 2018, và JEP 290 thêm bộ lọc giải tuần tự hoá). Dùng nó cho file của chính bạn ở PRO192/LAB211; với mọi thứ đi qua mạng, Spring Boot dùng JSON (Jackson).</div>`],
      [52, 'Access Object Files…: Case study 3 - Object Streams Demo.',
        `<p class="y-chinh">🎯 Problem: Book (title, price). Write a Java program that lets the user view the books in the file <code>books.dat</code> and append a book to the file; books are read/written as binary objects.</p>
<p>The third case study puts the whole chapter together on the simplest data: two fields. Compared with the text case studies:</p>
<table>
<thead><tr><th></th><th>Case study 1 (text)</th><th>Case study 3 (objects)</th></tr></thead>
<tbody>
<tr><td>file</td><td><code>employees.txt</code>, one line per employee</td><td><code>books.dat</code>, binary</td></tr>
<tr><td>save</td><td>build a line <code>code + "," + …</code></td><td><code>writeObject(book)</code></td></tr>
<tr><td>load</td><td><code>readLine</code> + <code>split</code> + <code>parseInt</code></td><td><code>(Book) readObject()</code></td></tr>
<tr><td>the class</td><td>any class</td><td>must <code>implements Serializable</code></td></tr>
<tr><td>edit the file by hand</td><td>yes, in Notepad</td><td>no</td></tr>
</tbody>
</table>
<p>"Append a book to the file" in the problem is <em>not</em> what the program will do: slide 56 explains why an object file cannot be appended to, and the solution rewrites the whole list on "Save" — like case study 1.</p>
<p class="meo">🧠 Object files remove all parsing code — no format to design, no <code>NumberFormatException</code>. The price is the version trap of slide 50 and a file only Java can read.</p>`,
        `<p class="y-chinh">🎯 Bài toán: Book (title, price). Viết chương trình Java cho phép người dùng xem các sách trong file <code>books.dat</code> và thêm một cuốn sách vào file; sách được đọc/ghi dưới dạng đối tượng nhị phân.</p>
<p>Case study thứ ba ghép cả chương lại trên dữ liệu đơn giản nhất: hai trường. So với các case study văn bản:</p>
<table>
<thead><tr><th></th><th>Case study 1 (văn bản)</th><th>Case study 3 (đối tượng)</th></tr></thead>
<tbody>
<tr><td>file</td><td><code>employees.txt</code>, mỗi nhân viên một dòng</td><td><code>books.dat</code>, nhị phân</td></tr>
<tr><td>lưu</td><td>dựng một dòng <code>code + "," + …</code></td><td><code>writeObject(book)</code></td></tr>
<tr><td>nạp</td><td><code>readLine</code> + <code>split</code> + <code>parseInt</code></td><td><code>(Book) readObject()</code></td></tr>
<tr><td>lớp dữ liệu</td><td>lớp nào cũng được</td><td>phải <code>implements Serializable</code></td></tr>
<tr><td>sửa file bằng tay</td><td>được, bằng Notepad</td><td>không</td></tr>
</tbody>
</table>
<p>"Thêm một cuốn sách vào file" trong đề <em>không</em> phải điều chương trình sẽ làm: slide 56 giải thích vì sao không ghi nối được vào file đối tượng, và lời giải ghi lại cả danh sách khi "Save" — giống case study 1.</p>
<p class="meo">🧠 File đối tượng bỏ được toàn bộ code phân tích — không phải thiết kế định dạng, không có <code>NumberFormatException</code>. Cái giá là bẫy phiên bản ở slide 50 và một file chỉ Java đọc được.</p>`],
      [53, 'Access Object Files…: Case Study 3 - Design',
        `<p class="y-chinh">🎯 Design: package <code>books</code> with <code>Book</code>, <code>BookList</code>, <code>BookManager</code>, <code>Menu</code>. Output of the first run: "1 — Empty List.", then add "OOP With Java" 120 and "Programming Fundamentals" 145, "3 — Save to file"; of the second run: "1" lists both. Notepad shows <code>books.dat</code>: "¬í sr books.Book … I priceL titlet Ljava/lang/String; xp … OOP WITH JAVA … PROGRAMMING FUNDAMENTALS". The red note: "Java serializes data of an object from the bottom of the declaration to the beginning."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a92338baaf2dc2e108a46ddbc86aeb74446de4c1.svg" alt="Slide 53 redrawn as a UML class diagram" loading="lazy" /><p class="chu-thich">🧩 Slide 53 redrawn as a UML class diagram</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 53 — case study 3: books kept as objects in books.dat
interface "java.io.Serializable" as S
class "Vector&lt;String&gt;" as VS
class "Vector&lt;Book&gt;" as VB
class Book {
  - title : String
  - price : int
  + Book(title : String, price : int)
  + print() : void
  + getTitle() : String
  + getPrice() : int
}
class Menu {
  + addMenuItem(s : String) : void
  + getUserChoice() : int
}
class BookList {
  + loadBookFromFile(fName : String) : void
  + saveToFile(fName : String) : void
  + addNewBook() : void
  + print() : void
}
class BookManager {
  + {static} main(args : String[]) : void
}
database "books.dat\\n(binary: Book objects)" as F #FEF3C7
S &lt;|.. Book
VS &lt;|-- Menu
VB &lt;|-- BookList
BookList o-- "*" Book
BookManager ..&gt; Menu
BookManager ..&gt; BookList
BookList ..&gt; F : ObjectInputStream.readObject()\\nObjectOutputStream.writeObject()
@enduml</code></pre></details>
<p>The red note draws a conclusion from the Notepad picture: <code>Book</code> declares <code>title</code> then <code>price</code>, and the file shows "I price" before "L title". But the rule is different — measured with <code>ObjectStreamClass</code>, the object that describes how serialization sees a class:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 53: "Java serializes the data of an object from the bottom of the declaration to the beginning" — measured: the order is primitive fields first, then object fields, each group sorted BY NAME; the declaration order plays no role
import java.io.*;

class Book implements Serializable {
    private String title;            // declared 1st
    private int price;               // declared 2nd
    Book(String t, int p) { title = t; price = p; }
}

class SinhVien implements Serializable {
    String ten;                      // 1st
    int tuoi;                        // 2nd
    String lop;                      // 3rd
    double diem;                     // 4th
    boolean active;                  // 5th
}

public class ThuTuTruong {
    public static void main(String[] args) throws IOException {
        for (Class&lt;?&gt; c : new Class&lt;?&gt;[] { Book.class, SinhVien.class }) {
            ObjectStreamClass osc = ObjectStreamClass.lookup(c);           // how serialization sees the class
            StringBuilder sb = new StringBuilder();
            for (ObjectStreamField f : osc.getFields()) sb.append(f.getTypeCode()).append(' ').append(f.getName()).append(", ");
            System.out.println(c.getSimpleName() + " is written as: " + sb.substring(0, sb.length() - 2));
        }
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books.dat"))) {
            out.writeObject(new Book("OOP WITH JAVA", 120));
        }
        StringBuilder text = new StringBuilder();
        try (FileInputStream in = new FileInputStream("books.dat")) {
            for (int b; (b = in.read()) != -1; ) text.append(b &gt;= 32 &amp;&amp; b &lt; 127 ? (char) b : '.');   // what Notepad shows, roughly
        }
        System.out.println("books.dat (" + text.length() + " bytes) as text: " + text);
    }
}</code></pre>
<div class="out">Book is written as: I price, L title<br>
SinhVien is written as: Z active, D diem, I tuoi, L lop, L ten<br>
books.dat (82 bytes) as text: ....sr..Book...!J......I..priceL..titlet..Ljava/lang/String;xp...xt..OOP WITH JAVA</div>
<p>The order is: <strong>primitive fields first, then object fields, each group sorted by name</strong> (the Java Object Serialization Specification says so). <code>SinhVien</code> declares <code>ten, tuoi, lop, diem, active</code> and is written as <code>active, diem, tuoi, lop, ten</code> — not the reverse of the declaration. The letters are type codes: <code>Z</code> boolean, <code>D</code> double, <code>I</code> int, <code>L</code> an object. The text dump shows the same structure the slide's Notepad shows: the class name, the field descriptions, then the values.</p>
<p class="meo">🧠 You never need this order in code — the stream handles it. It is here because the slide states a wrong rule and because "¬í" at the start of the Notepad view is <code>AC ED</code>, the magic number of every object file.</p>`,
        `<p class="y-chinh">🎯 Thiết kế: gói <code>books</code> gồm <code>Book</code>, <code>BookList</code>, <code>BookManager</code>, <code>Menu</code>. Output lần chạy đầu: "1 — Empty List.", rồi thêm "OOP With Java" 120 và "Programming Fundamentals" 145, "3 — Save to file"; lần chạy thứ hai: "1" liệt kê cả hai. Notepad hiện <code>books.dat</code>: "¬í sr books.Book … I priceL titlet Ljava/lang/String; xp … OOP WITH JAVA … PROGRAMMING FUNDAMENTALS". Ghi chú đỏ: "Java tuần tự hoá dữ liệu của đối tượng từ cuối phần khai báo lên đầu."</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a92338baaf2dc2e108a46ddbc86aeb74446de4c1.svg" alt="Slide 53 vẽ lại thành sơ đồ lớp UML" loading="lazy" /><p class="chu-thich">🧩 Slide 53 vẽ lại thành sơ đồ lớp UML</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Slide 53 — case study 3: books kept as objects in books.dat
interface "java.io.Serializable" as S
class "Vector&lt;String&gt;" as VS
class "Vector&lt;Book&gt;" as VB
class Book {
  - title : String
  - price : int
  + Book(title : String, price : int)
  + print() : void
  + getTitle() : String
  + getPrice() : int
}
class Menu {
  + addMenuItem(s : String) : void
  + getUserChoice() : int
}
class BookList {
  + loadBookFromFile(fName : String) : void
  + saveToFile(fName : String) : void
  + addNewBook() : void
  + print() : void
}
class BookManager {
  + {static} main(args : String[]) : void
}
database "books.dat\\n(binary: Book objects)" as F #FEF3C7
S &lt;|.. Book
VS &lt;|-- Menu
VB &lt;|-- BookList
BookList o-- "*" Book
BookManager ..&gt; Menu
BookManager ..&gt; BookList
BookList ..&gt; F : ObjectInputStream.readObject()\\nObjectOutputStream.writeObject()
@enduml</code></pre></details>
<p>Ghi chú đỏ rút kết luận từ ảnh Notepad: <code>Book</code> khai báo <code>title</code> rồi <code>price</code>, và file hiện "I price" trước "L title". Nhưng luật thật khác — đo bằng <code>ObjectStreamClass</code>, đối tượng mô tả cách cơ chế tuần tự hoá nhìn một lớp:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 53: "Java tuần tự hoá dữ liệu đối tượng từ cuối khai báo lên đầu" — đo thật: thứ tự là các trường nguyên thuỷ trước, rồi trường đối tượng, mỗi nhóm sắp THEO TÊN; thứ tự khai báo không có vai trò gì
import java.io.*;

class Book implements Serializable {
    private String title;            // khai báo thứ 1
    private int price;               // khai báo thứ 2
    Book(String t, int p) { title = t; price = p; }
}

class SinhVien implements Serializable {
    String ten;                      // thứ 1
    int tuoi;                        // thứ 2
    String lop;                      // thứ 3
    double diem;                     // thứ 4
    boolean active;                  // thứ 5
}

public class ThuTuTruong {
    public static void main(String[] args) throws IOException {
        for (Class&lt;?&gt; c : new Class&lt;?&gt;[] { Book.class, SinhVien.class }) {
            ObjectStreamClass osc = ObjectStreamClass.lookup(c);           // cách cơ chế tuần tự hoá nhìn lớp
            StringBuilder sb = new StringBuilder();
            for (ObjectStreamField f : osc.getFields()) sb.append(f.getTypeCode()).append(' ').append(f.getName()).append(", ");
            System.out.println(c.getSimpleName() + " is written as: " + sb.substring(0, sb.length() - 2));
        }
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books.dat"))) {
            out.writeObject(new Book("OOP WITH JAVA", 120));
        }
        StringBuilder text = new StringBuilder();
        try (FileInputStream in = new FileInputStream("books.dat")) {
            for (int b; (b = in.read()) != -1; ) text.append(b &gt;= 32 &amp;&amp; b &lt; 127 ? (char) b : '.');   // gần như thứ Notepad hiện
        }
        System.out.println("books.dat (" + text.length() + " bytes) as text: " + text);
    }
}</code></pre>
<div class="out">Book is written as: I price, L title<br>
SinhVien is written as: Z active, D diem, I tuoi, L lop, L ten<br>
books.dat (82 bytes) as text: ....sr..Book...!J......I..priceL..titlet..Ljava/lang/String;xp...xt..OOP WITH JAVA</div>
<p>Thứ tự là: <strong>các trường kiểu nguyên thuỷ trước, rồi các trường đối tượng, mỗi nhóm sắp theo tên</strong> (Đặc tả tuần tự hoá đối tượng Java ghi như vậy). <code>SinhVien</code> khai báo <code>ten, tuoi, lop, diem, active</code> và được ghi thành <code>active, diem, tuoi, lop, ten</code> — không phải ngược thứ tự khai báo. Các chữ cái là mã kiểu: <code>Z</code> boolean, <code>D</code> double, <code>I</code> int, <code>L</code> một đối tượng. Bản in dạng chữ cho thấy đúng cấu trúc mà Notepad của slide hiện: tên lớp, mô tả các trường, rồi tới các giá trị.</p>
<p class="meo">🧠 Bạn không bao giờ cần thứ tự này khi viết code — luồng lo hết. Nó có ở đây vì slide nêu một luật sai, và vì "¬í" ở đầu khung Notepad chính là <code>AC ED</code>, con số nhận dạng của mọi file đối tượng.</p>`],
      [54, 'Access Object Files…: Case Study 3- Implementations',
        `<p class="y-chinh">🎯 "Refer to the case study 1, 2. DO YOURSELF": <code>Menu extends Vector&lt;String&gt;</code> (as before) and <code>Book implements Serializable</code> (highlighted) with private <code>title</code> and <code>price</code>, a constructor, <code>print()</code>, getters and setters.</p>
<pre class="trich"><code class="language-java">class Book implements Serializable {                             // slide 54: "implements Serializable" — no method to write
    private static final long serialVersionUID = 1L;              // ➕ fix the version, see slide 57
    private String title;
    private int price;
    public Book(String title, int price) { this.title = title; this.price = price; }
    public void print() { System.out.printf("%-30s%5d%n", title, price); }
    public String getTitle() { return title; }
    public int getPrice() { return price; }
}</code></pre>
<p>The only new word compared with <code>Employee</code> or <code>Item</code> is <code>implements Serializable</code> — no method to write. ➕ The runnable version adds <code>serialVersionUID = 1L</code> (slide 50: without it, adding a field to <code>Book</code> next week makes every saved <code>books.dat</code> unreadable).</p>
<p>A design question the slide leaves open: should <code>BookList</code> (or the <code>Menu</code>) be Serializable too? No — only the objects that go into the file need it. <code>BookList</code> writes its <code>Book</code>s one by one; if instead you write the whole list with one <code>writeObject(list)</code>, then the list class must be Serializable — <code>ArrayList</code> already is, a subclass of it inherits that (slide 55 shows this option).</p>
<div class="pitfall">FE: "To write an object with ObjectOutputStream, which interface must its class implement?" → <strong>Serializable</strong> (not Comparable, not "Writable"/"Interpretable", which do not exist in java.io). Missing it is a <strong>run-time</strong> <code>NotSerializableException</code>, never a compile error.</div>`,
        `<p class="y-chinh">🎯 "Xem case study 1, 2. DO YOURSELF": <code>Menu extends Vector&lt;String&gt;</code> (như cũ) và <code>Book implements Serializable</code> (được tô nổi) có <code>title</code> và <code>price</code> private, hàm tạo, <code>print()</code>, getter và setter.</p>
<pre class="trich"><code class="language-java">class Book implements Serializable {                             // slide 54: "implements Serializable" — không phải viết phương thức nào
    private static final long serialVersionUID = 1L;              // ➕ chốt phiên bản, xem slide 57
    private String title;
    private int price;
    public Book(String title, int price) { this.title = title; this.price = price; }
    public void print() { System.out.printf("%-30s%5d%n", title, price); }
    public String getTitle() { return title; }
    public int getPrice() { return price; }
}</code></pre>
<p>Chữ mới duy nhất so với <code>Employee</code> hay <code>Item</code> là <code>implements Serializable</code> — không phải viết phương thức nào. ➕ Bản chạy được thêm <code>serialVersionUID = 1L</code> (slide 50: thiếu nó, tuần sau thêm một trường vào <code>Book</code> là mọi file <code>books.dat</code> đã lưu không đọc được nữa).</p>
<p>Một câu hỏi thiết kế slide bỏ ngỏ: <code>BookList</code> (hay <code>Menu</code>) có cần Serializable không? Không — chỉ các đối tượng đi vào file mới cần. <code>BookList</code> ghi từng <code>Book</code> một; nếu thay vào đó bạn ghi cả danh sách bằng một lệnh <code>writeObject(list)</code>, thì lớp danh sách phải Serializable — <code>ArrayList</code> vốn đã là, lớp con của nó thừa hưởng điều đó (slide 55 cho thấy cách này).</p>
<div class="pitfall">FE: "Muốn ghi một đối tượng bằng ObjectOutputStream, lớp của nó phải hiện thực interface nào?" → <strong>Serializable</strong> (không phải Comparable, không phải "Writable"/"Interpretable" — hai cái này không có trong java.io). Thiếu nó là <code>NotSerializableException</code> <strong>lúc chạy</strong>, không bao giờ là lỗi biên dịch.</div>`],
      [55, 'Access Object Files…: Case Study 3– Implementations…',
        `<p class="y-chinh">🎯 <code>BookList extends Vector&lt;Book&gt;</code> with its own <code>Scanner</code>, and <code>loadBookFromFile(String fName)</code>: clear the list, check the file exists, <code>FileInputStream fi</code>, <code>ObjectInputStream fo</code>, then <code>while ((b = (Book)(fo.readObject())) != null) this.add(b);</code>, <code>fo.close(); fi.close();</code>, <code>catch (Exception e) { System.out.println(e); }</code>.</p>
<p>The slide's loop, run on a file holding two books:</p>
<pre class="trich"><code class="language-java">List&lt;Book&gt; list = new ArrayList&lt;Book&gt;();
try {
    FileInputStream fi = new FileInputStream("books.dat");
    ObjectInputStream fo = new ObjectInputStream(fi);
    Book b;
    while ((b = (Book) (fo.readObject())) != null) {      // the slide's loop
        list.add(b);
    }
    fo.close(); fi.close();                                 // never reached
    System.out.println("closed");
} catch (Exception e) {
    System.out.println(e);                                  // this is what the user sees at EVERY start
}
System.out.println("slide's loop: " + list.size() + " books loaded, the file was left open");</code></pre>
<p>Then two correct ways — catch <code>EOFException</code> as the normal end, or save the whole list as <strong>one</strong> object:</p>
<pre class="trich"><code class="language-java">list.clear();
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("books.dat"))) {
    while (true) list.add((Book) in.readObject());
} catch (EOFException e) {
    // (1) end of file = normal end of the loop
}
System.out.println("(1) catch EOFException: " + list);</code></pre>
<pre class="trich"><code class="language-java">ArrayList&lt;Book&gt; all = new ArrayList&lt;Book&gt;(list);
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books2.dat"))) {
    out.writeObject(all);                                   // (3) ONE object: the whole list (ArrayList is Serializable)
}
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("books2.dat"))) {
    @SuppressWarnings("unchecked")
    ArrayList&lt;Book&gt; back = (ArrayList&lt;Book&gt;) in.readObject();
    System.out.println("(3) one ArrayList: " + back);
}</code></pre>
<pre class="trich"><code class="language-java">try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("null.dat"))) {
    out.writeObject(null);                                  // readObject returns null ONLY if null was written
}
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("null.dat"))) {
    System.out.println("readObject after writeObject(null): " + in.readObject());
}</code></pre>
<div class="out">java.io.EOFException<br>
slide's loop: 2 books loaded, the file was left open<br>
(1) catch EOFException: [OOP WITH JAVA (120), PROGRAMMING FUNDAMENTALS (145)]<br>
(3) one ArrayList: [OOP WITH JAVA (120), PROGRAMMING FUNDAMENTALS (145)]<br>
readObject after writeObject(null): null</div>
<p>The slide's version "works" — both books are in the list — but only because the exception happens <em>after</em> the last add: the loop ends with <code>EOFException</code>, the <code>catch</code> prints <strong><code>java.io.EOFException</code></strong> on the screen at every start of the program, and the two <code>close()</code> calls are skipped. (A third way, from slide 44: write the count first with <code>writeInt</code>, then read exactly that many objects.) The runnable <code>loadBookFromFile</code>:</p>
<pre class="trich"><code class="language-java">public void loadBookFromFile(String fName) {
    this.clear();                                            // clear current list before loading
    File f = new File(fName);
    if (!f.exists()) return;                                 // first run: no file yet
    try (ObjectInputStream fo = new ObjectInputStream(new FileInputStream(f))) {
        while (true) this.add((Book) fo.readObject());       // ➕ no "!= null": the end is an EOFException
    } catch (EOFException e) {
        // end of file: all books read
    } catch (IOException | ClassNotFoundException e) {
        System.out.println("Cannot load " + fName + ": " + e);
    }
}</code></pre>`,
        `<p class="y-chinh">🎯 <code>BookList extends Vector&lt;Book&gt;</code> có <code>Scanner</code> riêng, và <code>loadBookFromFile(String fName)</code>: xoá danh sách, kiểm file có tồn tại, <code>FileInputStream fi</code>, <code>ObjectInputStream fo</code>, rồi <code>while ((b = (Book)(fo.readObject())) != null) this.add(b);</code>, <code>fo.close(); fi.close();</code>, <code>catch (Exception e) { System.out.println(e); }</code>.</p>
<p>Vòng lặp của slide, chạy trên một file chứa hai cuốn sách:</p>
<pre class="trich"><code class="language-java">List&lt;Book&gt; list = new ArrayList&lt;Book&gt;();
try {
    FileInputStream fi = new FileInputStream("books.dat");
    ObjectInputStream fo = new ObjectInputStream(fi);
    Book b;
    while ((b = (Book) (fo.readObject())) != null) {      // vòng lặp của slide
        list.add(b);
    }
    fo.close(); fi.close();                                 // không bao giờ chạy tới
    System.out.println("closed");
} catch (Exception e) {
    System.out.println(e);                                  // người dùng thấy dòng này MỖI lần mở chương trình
}
System.out.println("slide's loop: " + list.size() + " books loaded, the file was left open");</code></pre>
<p>Rồi hai cách đúng — bắt <code>EOFException</code> như điểm kết thúc bình thường, hoặc lưu cả danh sách thành <strong>một</strong> đối tượng:</p>
<pre class="trich"><code class="language-java">list.clear();
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("books.dat"))) {
    while (true) list.add((Book) in.readObject());
} catch (EOFException e) {
    // (1) hết file = vòng lặp kết thúc bình thường
}
System.out.println("(1) catch EOFException: " + list);</code></pre>
<pre class="trich"><code class="language-java">ArrayList&lt;Book&gt; all = new ArrayList&lt;Book&gt;(list);
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books2.dat"))) {
    out.writeObject(all);                                   // (3) MỘT đối tượng: cả danh sách (ArrayList là Serializable)
}
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("books2.dat"))) {
    @SuppressWarnings("unchecked")
    ArrayList&lt;Book&gt; back = (ArrayList&lt;Book&gt;) in.readObject();
    System.out.println("(3) one ArrayList: " + back);
}</code></pre>
<pre class="trich"><code class="language-java">try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("null.dat"))) {
    out.writeObject(null);                                  // readObject chỉ trả null KHI null được ghi
}
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("null.dat"))) {
    System.out.println("readObject after writeObject(null): " + in.readObject());
}</code></pre>
<div class="out">java.io.EOFException<br>
slide's loop: 2 books loaded, the file was left open<br>
(1) catch EOFException: [OOP WITH JAVA (120), PROGRAMMING FUNDAMENTALS (145)]<br>
(3) one ArrayList: [OOP WITH JAVA (120), PROGRAMMING FUNDAMENTALS (145)]<br>
readObject after writeObject(null): null</div>
<p>Bản của slide "chạy được" — cả hai cuốn đều vào danh sách — nhưng chỉ vì ngoại lệ xảy ra <em>sau</em> lần add cuối: vòng lặp kết thúc bằng <code>EOFException</code>, <code>catch</code> in <strong><code>java.io.EOFException</code></strong> ra màn hình mỗi lần mở chương trình, và hai lời gọi <code>close()</code> bị bỏ qua. (Cách thứ ba, từ slide 44: ghi số lượng trước bằng <code>writeInt</code>, rồi đọc đúng chừng ấy đối tượng.) <code>loadBookFromFile</code> của bản chạy được:</p>
<pre class="trich"><code class="language-java">public void loadBookFromFile(String fName) {
    this.clear();                                            // xoá danh sách hiện tại trước khi nạp
    File f = new File(fName);
    if (!f.exists()) return;                                 // lần chạy đầu: chưa có file
    try (ObjectInputStream fo = new ObjectInputStream(new FileInputStream(f))) {
        while (true) this.add((Book) fo.readObject());       // ➕ không "!= null": hết file là EOFException
    } catch (EOFException e) {
        // hết file: đã đọc đủ sách
    } catch (IOException | ClassNotFoundException e) {
        System.out.println("Cannot load " + fName + ": " + e);
    }
}</code></pre>`],
      [56, 'Access Object Files…: Case Study 3– Implementations…',
        `<p class="y-chinh">🎯 <code>saveToFile(String fName)</code>, with the comment: "You can not append data to a binary file because Java will write class information to the file each time data are appended to the file." If the list is empty print "Empty list."; otherwise <code>FileOutputStream f</code>, <code>ObjectOutputStream fo</code>, <code>for (Book b : this) fo.writeObject(b);</code>, close, catch.</p>
<pre class="trich"><code class="language-java">public void saveToFile(String fName) {                       // REWRITE the whole file: appending would break it (slide 56)
    if (this.size() == 0) {
        System.out.println("Empty list.");
        return;
    }
    try (ObjectOutputStream fo = new ObjectOutputStream(new FileOutputStream(fName))) {
        for (Book b : this) fo.writeObject(b);
        System.out.println(size() + " book(s) saved to " + fName);
    } catch (IOException e) {
        System.out.println(e);
    }
}</code></pre>
<p>The comment is right for <strong>object</strong> files, and the reason is measurable. Every new <code>ObjectOutputStream</code> begins by writing a stream header; appending with a second stream puts a second header in the middle of the file, and the reader — which expects only one — breaks:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 56: "you can not append data to a binary (object) file" — measured: appending with a NEW ObjectOutputStream writes a second stream header, and reading stops with StreamCorruptedException
import java.io.*;

class Book implements Serializable {
    private static final long serialVersionUID = 1L;
    String title;
    int price;
    Book(String t, int p) { title = t; price = p; }
    public String toString() { return title + " (" + price + ")"; }
}

public class GhiNoiDoiTuong {
    public static void main(String[] args) throws Exception {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books.dat"))) {         // run 1
            out.writeObject(new Book("OOP WITH JAVA", 120));
        }
        long len1 = new File("books.dat").length();
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books.dat", true))) {   // run 2: append = true
            out.writeObject(new Book("PROGRAMMING FUNDAMENTALS", 145));
        }
        System.out.println("bytes " + len1 + ".." + (len1 + 3) + " of books.dat: " + hex("books.dat", len1, 4) + "   &lt;- a second header AC ED 00 05");
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("books.dat"))) {
            System.out.println("1st readObject: " + in.readObject());
            System.out.println("2nd readObject: " + in.readObject());
        } catch (IOException e) {
            System.out.println("2nd readObject -&gt; " + e);
        }
        System.out.println("first 4 bytes of ANY object stream: " + hex("books.dat", 0, 4) + " (STREAM_MAGIC 0xACED, STREAM_VERSION 5)");
    }

    static String hex(String name, long from, int n) throws IOException {
        try (RandomAccessFile f = new RandomAccessFile(name, "r")) {
            f.seek(from);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i &lt; n; i++) sb.append(String.format("%02X ", f.read()));
            return sb.toString().trim();
        }
    }
}</code></pre>
<div class="out">bytes 82..85 of books.dat: AC ED 00 05 &nbsp;&nbsp;&lt;- a second header AC ED 00 05<br>
1st readObject: OOP WITH JAVA (120)<br>
2nd readObject -&gt; java.io.StreamCorruptedException: invalid type code: AC<br>
first 4 bytes of ANY object stream: AC ED 00 05 (STREAM_MAGIC 0xACED, STREAM_VERSION 5)</div>
<p>The first book reads fine; the second <code>readObject</code> meets <code>AC</code> where it expects an object and throws <code>StreamCorruptedException: invalid type code: AC</code>. So the program keeps the whole list in memory and rewrites the file on every save — as this slide does. (Plain byte or data files <em>can</em> be appended to — <code>new FileOutputStream(name, true)</code> — since they have no header.)</p>
<div class="callout">➕ A known workaround subclasses <code>ObjectOutputStream</code> and overrides <code>writeStreamHeader()</code> to write nothing when the file is not empty. It works, but one mistake corrupts the file; for PRO192 and LAB211, rewrite the whole file.</div>`,
        `<p class="y-chinh">🎯 <code>saveToFile(String fName)</code>, kèm chú thích: "Không ghi nối được vào file nhị phân vì Java sẽ ghi thông tin lớp vào file mỗi lần dữ liệu được ghi nối." Danh sách rỗng thì in "Empty list."; ngược lại <code>FileOutputStream f</code>, <code>ObjectOutputStream fo</code>, <code>for (Book b : this) fo.writeObject(b);</code>, đóng, bắt lỗi.</p>
<pre class="trich"><code class="language-java">public void saveToFile(String fName) {                       // GHI LẠI cả file: ghi nối sẽ làm hỏng (slide 56)
    if (this.size() == 0) {
        System.out.println("Empty list.");
        return;
    }
    try (ObjectOutputStream fo = new ObjectOutputStream(new FileOutputStream(fName))) {
        for (Book b : this) fo.writeObject(b);
        System.out.println(size() + " book(s) saved to " + fName);
    } catch (IOException e) {
        System.out.println(e);
    }
}</code></pre>
<p>Chú thích đúng với file <strong>đối tượng</strong>, và lý do đo được. Mỗi <code>ObjectOutputStream</code> mới bắt đầu bằng việc ghi một đầu luồng (stream header); ghi nối bằng luồng thứ hai là đặt đầu luồng thứ hai vào giữa file, và bên đọc — vốn chỉ chờ một đầu luồng — hỏng:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 56: "không ghi nối được vào file nhị phân (đối tượng)" — đo thật: ghi nối bằng một ObjectOutputStream MỚI sẽ ghi thêm một đầu luồng thứ hai, và việc đọc dừng với StreamCorruptedException
import java.io.*;

class Book implements Serializable {
    private static final long serialVersionUID = 1L;
    String title;
    int price;
    Book(String t, int p) { title = t; price = p; }
    public String toString() { return title + " (" + price + ")"; }
}

public class GhiNoiDoiTuong {
    public static void main(String[] args) throws Exception {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books.dat"))) {         // lần chạy 1
            out.writeObject(new Book("OOP WITH JAVA", 120));
        }
        long len1 = new File("books.dat").length();
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("books.dat", true))) {   // lần chạy 2: ghi nối
            out.writeObject(new Book("PROGRAMMING FUNDAMENTALS", 145));
        }
        System.out.println("bytes " + len1 + ".." + (len1 + 3) + " of books.dat: " + hex("books.dat", len1, 4) + "   &lt;- a second header AC ED 00 05");
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("books.dat"))) {
            System.out.println("1st readObject: " + in.readObject());
            System.out.println("2nd readObject: " + in.readObject());
        } catch (IOException e) {
            System.out.println("2nd readObject -&gt; " + e);
        }
        System.out.println("first 4 bytes of ANY object stream: " + hex("books.dat", 0, 4) + " (STREAM_MAGIC 0xACED, STREAM_VERSION 5)");
    }

    static String hex(String name, long from, int n) throws IOException {
        try (RandomAccessFile f = new RandomAccessFile(name, "r")) {
            f.seek(from);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i &lt; n; i++) sb.append(String.format("%02X ", f.read()));
            return sb.toString().trim();
        }
    }
}</code></pre>
<div class="out">bytes 82..85 of books.dat: AC ED 00 05 &nbsp;&nbsp;&lt;- a second header AC ED 00 05<br>
1st readObject: OOP WITH JAVA (120)<br>
2nd readObject -&gt; java.io.StreamCorruptedException: invalid type code: AC<br>
first 4 bytes of ANY object stream: AC ED 00 05 (STREAM_MAGIC 0xACED, STREAM_VERSION 5)</div>
<p>Cuốn đầu đọc ổn; lần <code>readObject</code> thứ hai gặp <code>AC</code> ở chỗ nó chờ một đối tượng và ném <code>StreamCorruptedException: invalid type code: AC</code>. Vì thế chương trình giữ cả danh sách trong bộ nhớ và ghi lại cả file mỗi lần lưu — như slide này làm. (File byte hay file dữ liệu thường thì <em>ghi nối được</em> — <code>new FileOutputStream(name, true)</code> — vì chúng không có đầu luồng.)</p>
<div class="callout">➕ Có một mẹo quen thuộc: tạo lớp con của <code>ObjectOutputStream</code> và ghi đè <code>writeStreamHeader()</code> để không ghi gì khi file đã có dữ liệu. Nó chạy được, nhưng sai một chút là hỏng file; với PRO192 và LAB211, cứ ghi lại cả file.</div>`],
      [57, 'Access Object Files…: Case Study 3– Implementations…',
        `<p class="y-chinh">🎯 <code>addNewBook()</code>: "Enter New Book Details:", "tile:" → <code>sc.nextLine().toUpperCase()</code>, "price:" → <code>Integer.parseInt(sc.nextLine())</code>, <code>this.add(new Book(title, price))</code>, "New book has been added."; <code>print()</code> (DO YOURSELF): "Empty List." or "NEW-ITEM LIST", a dashed line, and <code>x.print()</code> for each book.</p>
<pre class="trich"><code class="language-java">public void addNewBook() {
    System.out.println("Enter New Book Details:");
    String title = Nhap.dong("   title: ").trim().toUpperCase();   // the slide prints "tile:" — a typo
    int price = Integer.parseInt(Nhap.dong("   price: ").trim());
    this.add(new Book(title, price));
    System.out.println("New book has been added.");
}
public void print() {                                        // DO YOURSELF
    if (this.size() == 0) {
        System.out.println("Empty List.");
        return;
    }
    System.out.println("\\nBOOK LIST");
    System.out.println("-----------------------------------");
    for (Book x : this) x.print();
}</code></pre>
<p>Both methods are copies of case studies 1–2, which is the point of the slide's "refer to the case study 1, 2": once load and save are written, the rest of a file-based manager is the same menu code whatever the file format. Small fixes: the prompt "tile:" is a typo for "title:", and the heading "NEW-ITEM LIST" was copied from case study 2 — this version prints "BOOK LIST".</p>
<p>Notice what is <em>missing</em>: there is no check for a duplicate title and no protection of the price against "abc". Adding both is exercise-level work and exactly what LAB211 graders test first.</p>`,
        `<p class="y-chinh">🎯 <code>addNewBook()</code>: "Enter New Book Details:", "tile:" → <code>sc.nextLine().toUpperCase()</code>, "price:" → <code>Integer.parseInt(sc.nextLine())</code>, <code>this.add(new Book(title, price))</code>, "New book has been added."; <code>print()</code> (DO YOURSELF): "Empty List." hoặc "NEW-ITEM LIST", một dòng gạch, và <code>x.print()</code> cho từng cuốn.</p>
<pre class="trich"><code class="language-java">public void addNewBook() {
    System.out.println("Enter New Book Details:");
    String title = Nhap.dong("   title: ").trim().toUpperCase();   // slide in "tile:" — gõ nhầm
    int price = Integer.parseInt(Nhap.dong("   price: ").trim());
    this.add(new Book(title, price));
    System.out.println("New book has been added.");
}
public void print() {                                        // tự làm
    if (this.size() == 0) {
        System.out.println("Empty List.");
        return;
    }
    System.out.println("\\nBOOK LIST");
    System.out.println("-----------------------------------");
    for (Book x : this) x.print();
}</code></pre>
<p>Hai phương thức đều chép lại từ case study 1–2, đó chính là ý của câu "xem case study 1, 2" trên slide: khi đã viết xong nạp và lưu, phần còn lại của một chương trình quản lý dựa trên file là cùng một đoạn code menu, bất kể định dạng file. Vài chỗ sửa nhỏ: lời nhắc "tile:" gõ nhầm, đúng là "title:", và tiêu đề "NEW-ITEM LIST" bị chép từ case study 2 — bản này in "BOOK LIST".</p>
<p>Để ý thứ còn <em>thiếu</em>: không kiểm tên sách trùng và không bảo vệ ô giá trước "abc". Thêm cả hai là việc cỡ bài tập, và đúng là thứ người chấm LAB211 thử đầu tiên.</p>`],
      [58, 'Access Object Files…: Case Study 5 – Implementations…',
        `<p class="y-chinh">🎯 (Titled "Case Study 5" — it is still case study 3.) <code>BookManager.main</code>: <code>filename = "books.dat"</code>, a <code>Scanner</code>, a <code>Menu</code> with "View books", "Add new book", "Save to file", "Quit", <code>BookList list</code>, <code>list.loadBookFromFile(filename)</code>, and a <code>do … while (userChoice &gt; 0 &amp;&amp; userChoice &lt; menu.size())</code> loop with <code>case 1: list.print(); break; case 2: list.addNewBook(); break; case 3: list.saveToFile(filename);</code>. Two Output windows: the first run, then a second run listing the saved books.</p>
<pre class="trich"><code class="language-java">static void bookManager() {                                  // = BookManager.main of slide 58
    String filename = "books.dat";
    String[] menu = { "View books", "Add new book", "Save to file", "Quit" };
    BookList list = new BookList();
    list.loadBookFromFile(filename);                         // load initial data
    int userChoice;
    do {
        System.out.println("\\nBOOK MANAGER");
        for (int i = 0; i &lt; menu.length; i++) System.out.print((i + 1) + "-" + menu[i] + "   ");
        System.out.println();
        userChoice = Integer.parseInt(Nhap.dong("Select 1..4: ").trim());
        switch (userChoice) {
            case 1: list.print(); break;
            case 2: list.addNewBook(); break;
            case 3: list.saveToFile(filename); break;        // ➕ the slide has no break here (harmless, it is the last case)
        }
    } while (userChoice &gt; 0 &amp;&amp; userChoice &lt; menu.length);
}</code></pre>
<p>To show the data surviving, the program is started <strong>twice</strong> in one run (the same <code>bookManager()</code> method called two times, books.dat left on disk in between) — exactly the two Output windows of the slide:</p>
<pre class="trich"><code class="language-java">System.out.println("=============== FIRST RUN ===============");
bookManager();
System.out.println("books.dat: " + new File("books.dat").length() + " bytes");
System.out.println("=============== SECOND RUN (a new start of the program) ===============");
bookManager();</code></pre>
<div class="out">=============== FIRST RUN ===============<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 1<br>
Empty List.<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 2<br>
Enter New Book Details:<br>
&nbsp;&nbsp;&nbsp;title: OOP With Java<br>
&nbsp;&nbsp;&nbsp;price: 120<br>
New book has been added.<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 2<br>
Enter New Book Details:<br>
&nbsp;&nbsp;&nbsp;title: Programming Fundamentals<br>
&nbsp;&nbsp;&nbsp;price: 145<br>
New book has been added.<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 3<br>
2 book(s) saved to books.dat<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 4<br>
books.dat: 119 bytes<br>
=============== SECOND RUN (a new start of the program) ===============<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 1<br>
<br>
BOOK LIST<br>
-----------------------------------<br>
OOP WITH JAVA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120<br>
PROGRAMMING FUNDAMENTALS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;145<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 4</div>
<p>The first run starts with no file ("Empty List."), adds two books and saves 119 bytes; the second run is a new start of the program — the list is empty in memory until <code>loadBookFromFile</code> reads the two objects back. No <code>EOFException</code> is printed: the loader of slide 55 treats the end of the file as normal. Unlike case study 1, quitting with unsaved books loses them silently — adding the "Save changes Y/N?" question of slide 25 is a good exercise.</p>`,
        `<p class="y-chinh">🎯 (Tiêu đề ghi "Case Study 5" — thật ra vẫn là case study 3.) <code>BookManager.main</code>: <code>filename = "books.dat"</code>, một <code>Scanner</code>, một <code>Menu</code> gồm "View books", "Add new book", "Save to file", "Quit", <code>BookList list</code>, <code>list.loadBookFromFile(filename)</code>, và vòng <code>do … while (userChoice &gt; 0 &amp;&amp; userChoice &lt; menu.size())</code> với <code>case 1: list.print(); break; case 2: list.addNewBook(); break; case 3: list.saveToFile(filename);</code>. Hai cửa sổ Output: lần chạy đầu, rồi lần chạy thứ hai liệt kê các sách đã lưu.</p>
<pre class="trich"><code class="language-java">static void bookManager() {                                  // = BookManager.main của slide 58
    String filename = "books.dat";
    String[] menu = { "View books", "Add new book", "Save to file", "Quit" };
    BookList list = new BookList();
    list.loadBookFromFile(filename);                         // nạp dữ liệu ban đầu
    int userChoice;
    do {
        System.out.println("\\nBOOK MANAGER");
        for (int i = 0; i &lt; menu.length; i++) System.out.print((i + 1) + "-" + menu[i] + "   ");
        System.out.println();
        userChoice = Integer.parseInt(Nhap.dong("Select 1..4: ").trim());
        switch (userChoice) {
            case 1: list.print(); break;
            case 2: list.addNewBook(); break;
            case 3: list.saveToFile(filename); break;        // ➕ slide thiếu break ở đây (vô hại vì là case cuối)
        }
    } while (userChoice &gt; 0 &amp;&amp; userChoice &lt; menu.length);
}</code></pre>
<p>Để thấy dữ liệu sống sót, chương trình được khởi động <strong>hai lần</strong> trong một lượt chạy (cùng phương thức <code>bookManager()</code> gọi hai lần, books.dat nằm lại trên đĩa ở giữa) — đúng hai cửa sổ Output của slide:</p>
<pre class="trich"><code class="language-java">System.out.println("=============== FIRST RUN ===============");
bookManager();
System.out.println("books.dat: " + new File("books.dat").length() + " bytes");
System.out.println("=============== SECOND RUN (a new start of the program) ===============");
bookManager();</code></pre>
<div class="out">=============== FIRST RUN ===============<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 1<br>
Empty List.<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 2<br>
Enter New Book Details:<br>
&nbsp;&nbsp;&nbsp;title: OOP With Java<br>
&nbsp;&nbsp;&nbsp;price: 120<br>
New book has been added.<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 2<br>
Enter New Book Details:<br>
&nbsp;&nbsp;&nbsp;title: Programming Fundamentals<br>
&nbsp;&nbsp;&nbsp;price: 145<br>
New book has been added.<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 3<br>
2 book(s) saved to books.dat<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 4<br>
books.dat: 119 bytes<br>
=============== SECOND RUN (a new start of the program) ===============<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 1<br>
<br>
BOOK LIST<br>
-----------------------------------<br>
OOP WITH JAVA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120<br>
PROGRAMMING FUNDAMENTALS &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;145<br>
<br>
BOOK MANAGER<br>
1-View books &nbsp;&nbsp;2-Add new book &nbsp;&nbsp;3-Save to file &nbsp;&nbsp;4-Quit<br>
Select 1..4: 4</div>
<p>Lần chạy đầu bắt đầu khi chưa có file ("Empty List."), thêm hai cuốn và lưu 119 byte; lần chạy thứ hai là một lần khởi động mới — danh sách trong bộ nhớ rỗng cho tới khi <code>loadBookFromFile</code> đọc lại hai đối tượng. Không có <code>EOFException</code> nào bị in: hàm nạp ở slide 55 coi hết file là chuyện bình thường. Khác case study 1, thoát khi còn sách chưa lưu là mất chúng lặng lẽ — thêm câu hỏi "Save changes Y/N?" của slide 25 là một bài tập tốt.</p>`],
      [59, 'Summary',
        `<p class="y-chinh">🎯 Summary: text, UTF and Unicode; accessing metadata of directories/files (<code>java.io.File</code>); text streams, <code>Reader</code> and <code>Writer</code>; the <code>java.io.RandomAccessFile</code> class; binary file input and output (low and high level); object streams and <code>Serializable</code>.</p>
<p>The whole chapter as one decision table — what you want to do, and the classes to write on JDK 8:</p>
<table>
<thead><tr><th>I want to…</th><th>Write (JDK 8)</th><th>Watch out</th></tr></thead>
<tbody>
<tr><td>check, create, rename, list files</td><td><code>File</code> (<code>exists</code>, <code>mkdirs</code>, <code>renameTo</code>, <code>listFiles</code>) or <code>Files</code>/<code>Paths</code></td><td>methods return <code>false</code>; <code>list()</code> may be <code>null</code></td></tr>
<tr><td>read text line by line</td><td><code>new BufferedReader(new InputStreamReader(new FileInputStream(f), "UTF-8"))</code></td><td><code>readLine()</code> → <code>null</code>; <code>trim()</code> before <code>parseInt</code></td></tr>
<tr><td>write text</td><td><code>new PrintWriter(new OutputStreamWriter(new FileOutputStream(f, append), "UTF-8"))</code></td><td>close it; <code>append</code> or the file is emptied</td></tr>
<tr><td>read input.txt in a PE skeleton</td><td><code>new Scanner(new File(fi))</code>, <code>new FileWriter(fo)</code> as given</td><td>ASCII data, so the default encoding is fine</td></tr>
<tr><td>update a record in place</td><td><code>RandomAccessFile(f, "rw")</code>, <code>seek</code></td><td>"rw" keeps old bytes: <code>setLength</code></td></tr>
<tr><td>store typed values</td><td><code>DataOutputStream</code>/<code>DataInputStream</code> (+ <code>Buffered…</code>)</td><td>same order and types; <code>EOFException</code> at the end</td></tr>
<tr><td>store objects</td><td><code>implements Serializable</code> + <code>serialVersionUID</code>, <code>ObjectOutputStream</code></td><td>no append; <code>readObject</code> throws at EOF</td></tr>
</tbody>
</table>
<p>And one rule over all of them: open in <code>try ( … )</code>, so every stream is closed even when something fails.</p>
<div class="callout">🧭 <strong>Go further</strong>: lesson <strong>9.2</strong> (🧪 practice) solves a PE file question with the real skeleton, a LAB211 CSV manager, a Vietnamese report, an object store and a fixed-record file. <strong>LAB211</strong> uses these patterns every week; <strong>PRJ301</strong> replaces data files with a database (JDBC) but keeps streams for uploads and downloads; <strong>Spring Boot</strong> reads <code>application.properties</code> and writes logs with the same <code>java.io</code>/<code>java.nio.file</code> underneath.</div>`,
        `<p class="y-chinh">🎯 Tóm tắt: văn bản, UTF và Unicode; truy cập siêu dữ liệu của thư mục/file (<code>java.io.File</code>); luồng văn bản, <code>Reader</code> và <code>Writer</code>; lớp <code>java.io.RandomAccessFile</code>; vào/ra file nhị phân (mức thấp và mức cao); luồng đối tượng và <code>Serializable</code>.</p>
<p>Cả chương gói thành một bảng quyết định — việc bạn muốn làm, và các lớp nên viết trên JDK 8:</p>
<table>
<thead><tr><th>Tôi muốn…</th><th>Viết (JDK 8)</th><th>Cẩn thận</th></tr></thead>
<tbody>
<tr><td>kiểm tra, tạo, đổi tên, liệt kê file</td><td><code>File</code> (<code>exists</code>, <code>mkdirs</code>, <code>renameTo</code>, <code>listFiles</code>) hoặc <code>Files</code>/<code>Paths</code></td><td>phương thức trả <code>false</code>; <code>list()</code> có thể là <code>null</code></td></tr>
<tr><td>đọc văn bản từng dòng</td><td><code>new BufferedReader(new InputStreamReader(new FileInputStream(f), "UTF-8"))</code></td><td><code>readLine()</code> → <code>null</code>; <code>trim()</code> trước <code>parseInt</code></td></tr>
<tr><td>ghi văn bản</td><td><code>new PrintWriter(new OutputStreamWriter(new FileOutputStream(f, append), "UTF-8"))</code></td><td>phải đóng; thiếu <code>append</code> là file bị làm rỗng</td></tr>
<tr><td>đọc input.txt trong khung đề PE</td><td><code>new Scanner(new File(fi))</code>, <code>new FileWriter(fo)</code> như đề cho</td><td>dữ liệu ASCII nên bảng mã mặc định vẫn ổn</td></tr>
<tr><td>sửa một bản ghi tại chỗ</td><td><code>RandomAccessFile(f, "rw")</code>, <code>seek</code></td><td>"rw" giữ byte cũ: <code>setLength</code></td></tr>
<tr><td>lưu giá trị có kiểu</td><td><code>DataOutputStream</code>/<code>DataInputStream</code> (+ <code>Buffered…</code>)</td><td>đúng thứ tự và kiểu; hết file là <code>EOFException</code></td></tr>
<tr><td>lưu đối tượng</td><td><code>implements Serializable</code> + <code>serialVersionUID</code>, <code>ObjectOutputStream</code></td><td>không ghi nối; <code>readObject</code> ném lỗi khi hết file</td></tr>
</tbody>
</table>
<p>Và một luật đứng trên tất cả: mở trong <code>try ( … )</code>, để luồng nào cũng được đóng kể cả khi có lỗi.</p>
<div class="callout">🧭 <strong>Đi tiếp</strong>: bài <strong>9.2</strong> (🧪 thực hành) giải một câu PE về file với đúng khung của đề, một chương trình CSV kiểu LAB211, một báo cáo tiếng Việt, một kho đối tượng và một file bản ghi cố định. <strong>LAB211</strong> dùng các khuôn này hằng tuần; <strong>PRJ301</strong> thay file dữ liệu bằng cơ sở dữ liệu (JDBC) nhưng vẫn dùng luồng cho tải lên và tải xuống; <strong>Spring Boot</strong> đọc <code>application.properties</code> và ghi log cũng bằng <code>java.io</code>/<code>java.nio.file</code> bên dưới.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>A <code>RandomAccessFile</code> gets <code>writeInt(8)</code>, <code>writeChar('a')</code>, <code>writeUTF("Hà")</code>. What is <code>length()</code>? At which byte does the string start?</li>
<li><code>os.write(300)</code> on a <code>FileOutputStream</code>: what byte is stored? What does <code>read()</code> give back?</li>
<li>Why does <code>while ((b = (Book) in.readObject()) != null)</code> never end normally? Write a loop that does.</li>
<li>A class has <code>static int count</code>, <code>transient String password</code>, <code>final String id</code> and an <code>Address address</code>. Which are saved by <code>writeObject</code>, and what must <code>Address</code> do?</li>
<li>Why can you append to a data file but not to an object file?</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Một <code>RandomAccessFile</code> nhận <code>writeInt(8)</code>, <code>writeChar('a')</code>, <code>writeUTF("Hà")</code>. <code>length()</code> bằng bao nhiêu? Chuỗi bắt đầu ở byte nào?</li>
<li><code>os.write(300)</code> trên một <code>FileOutputStream</code>: byte nào được lưu? <code>read()</code> trả lại gì?</li>
<li>Vì sao <code>while ((b = (Book) in.readObject()) != null)</code> không bao giờ kết thúc bình thường? Viết một vòng lặp kết thúc đúng.</li>
<li>Một lớp có <code>static int count</code>, <code>transient String password</code>, <code>final String id</code> và một <code>Address address</code>. Trường nào được <code>writeObject</code> lưu, và <code>Address</code> phải làm gì?</li>
<li>Vì sao ghi nối được vào file dữ liệu mà không ghi nối được vào file đối tượng?</li>
</ul>`),
    books([
      ['horstmann2', 'Ch. 2.3 "Reading and Writing Binary Data" (DataInput/DataOutput, random-access files); Ch. 2.4 "Object Input/Output Streams and Serialization" (saving and loading serializable objects, the object serialization file format, versioning)', 'Chương 2.3 "Reading and Writing Binary Data" (DataInput/DataOutput, file truy cập ngẫu nhiên); Chương 2.4 "Object Input/Output Streams and Serialization" (lưu và nạp đối tượng tuần tự hoá, định dạng file tuần tự hoá, quản lý phiên bản)'],
      ['javaTutorial', 'trail "Basic I/O" — "Data Streams", "Object Streams", "Random Access Files"', 'trail "Basic I/O" — "Data Streams", "Object Streams", "Random Access Files"'],
      ['apiDocs', 'java.io.RandomAccessFile (modes r/rw/rws/rwd, seek, setLength), DataOutput (modified UTF-8, sizes), DataInputStream (EOFException), ObjectOutputStream, ObjectInputStream, Serializable (serialVersionUID), ObjectStreamClass; Java Object Serialization Specification §1.5–1.6 and §6 (field order, stream format)', 'java.io.RandomAccessFile (chế độ r/rw/rws/rwd, seek, setLength), DataOutput (modified UTF-8, kích thước), DataInputStream (EOFException), ObjectOutputStream, ObjectInputStream, Serializable (serialVersionUID), ObjectStreamClass; Java Object Serialization Specification §1.5–1.6 và §6 (thứ tự trường, định dạng luồng)'],
    ]),
  ].join('\n'),
};

/* ───────── 9.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Files the PE and LAB211 way: input/output files, CSV, UTF-8, objects ───────── */
const L_on_ch9 = {
  title: '9.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Files the PE and LAB211 way: input/output files, CSV, UTF-8, objects|||9.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · File kiểu PE và LAB211: file vào/ra, CSV, UTF-8, đối tượng',
  slug: 'pro192-on-ch9',
  type: 'VIDEO',
  description: '7 bài tập Chương 9 có lời giải chạy thật trên JDK 8: câu Q1 của đề PE đọc input.txt ghi output.txt bằng đúng khung Q1.java của PE3/PE5/PE9 (setFile, read, solve, printResult) với ba bộ input và một file thiếu, chương trình quản lý sinh viên kiểu LAB211 trên file CSV UTF-8 (dòng tiêu đề, dòng hỏng báo số dòng, một Scanner, lưu qua file tạm), báo cáo theo họ từ file tiếng Việt có BOM và sắp xếp bằng Collator tiếng Việt, cho project Banking của trường lưu tài khoản thành một đối tượng và lỗi trùng số tài khoản vì bộ đếm static (chạy ba JVM thật), file bản ghi dài cố định với RandomAccessFile (đọc, sửa tại chỗ, xoá), bảy lỗi biên dịch thật của JDK 8 về file và sáu câu đoán output; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lesson 9.2 · Practice &amp; review</span>
<h2>Files the way the PE and LAB211 ask for them</h2>
<p class="lead">Lessons 9.A–9.C walked the deck "I/O Streams". Now the shapes you will be graded on. Files appear in PRO192 in two places: <strong>PE question 1</strong> of the newer papers (PE3, PE5, PE9) gives a skeleton <code>Q1.java</code> that reads <code>input.txt</code> and writes <code>output.txt</code> — the grader runs it with its own files; and <strong>LAB211</strong>, where every manager program loads its data at start and saves it before exit. Both are below, plus the three things that break file programs on the lab PC (encoding, BOM, static counters), a binary-record file, and two FE-style drills. Every solution ran on JDK 8.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Exam link</th></tr></thead>
<tbody>
<tr><td>1</td><td>fill the PE skeleton: <code>read()</code> from input.txt, <code>printResult()</code> to output.txt</td><td>PE3, PE5, PE9 question 1</td></tr>
<tr><td>2</td><td>load/save a CSV list with validation and error reporting</td><td>LAB211 (every assignment), FU offline "managing program"</td></tr>
<tr><td>3</td><td>read Vietnamese UTF-8 safely (BOM), group and sort, write a report</td><td>LAB211 reports, FE encoding questions</td></tr>
<tr><td>4</td><td>save a list of objects; restore state that serialization does not keep</td><td>the school's Banking sample, FE "static/transient"</td></tr>
<tr><td>5</td><td>fixed-length records with <code>RandomAccessFile</code></td><td>FE RandomAccessFile questions, CSD201</td></tr>
<tr><td>6</td><td>name the rule behind seven real compile errors</td><td>FE "which line fails?", exam-room surprises</td></tr>
<tr><td>7</td><td>predict six outputs</td><td>FE "what is printed?"</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 9 · Bài 9.2 · Thực hành &amp; ôn tập</span>
<h2>File theo đúng cách đề PE và LAB211 yêu cầu</h2>
<p class="lead">Bài 9.A–9.C đã đi hết bộ slide "I/O Streams". Giờ là các dạng bạn sẽ bị chấm. File xuất hiện ở PRO192 tại hai chỗ: <strong>câu 1 đề PE</strong> của các đề mới (PE3, PE5, PE9) cho sẵn khung <code>Q1.java</code> đọc <code>input.txt</code> và ghi <code>output.txt</code> — máy chấm chạy nó với file của riêng nó; và <strong>LAB211</strong>, nơi mọi chương trình quản lý đều nạp dữ liệu lúc mở và lưu trước khi thoát. Cả hai có ở dưới, thêm ba thứ làm hỏng chương trình file trên máy phòng lab (bảng mã, BOM, bộ đếm static), một file bản ghi nhị phân, và hai bài luyện kiểu FE. Mọi lời giải đều đã chạy trên JDK 8.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Liên hệ đề thi</th></tr></thead>
<tbody>
<tr><td>1</td><td>điền khung PE: <code>read()</code> từ input.txt, <code>printResult()</code> ra output.txt</td><td>câu 1 PE3, PE5, PE9</td></tr>
<tr><td>2</td><td>nạp/lưu danh sách CSV có kiểm tra và báo lỗi</td><td>LAB211 (mọi bài), "managing program" của học liệu FU</td></tr>
<tr><td>3</td><td>đọc tiếng Việt UTF-8 an toàn (BOM), gom nhóm, sắp xếp, ghi báo cáo</td><td>báo cáo LAB211, câu FE về bảng mã</td></tr>
<tr><td>4</td><td>lưu danh sách đối tượng; khôi phục trạng thái mà tuần tự hoá không giữ</td><td>project Banking mẫu của trường, FE "static/transient"</td></tr>
<tr><td>5</td><td>bản ghi dài cố định với <code>RandomAccessFile</code></td><td>câu FE về RandomAccessFile, CSD201</td></tr>
<tr><td>6</td><td>gọi tên luật đứng sau bảy lỗi biên dịch thật</td><td>FE "dòng nào lỗi?", bất ngờ trong phòng thi</td></tr>
<tr><td>7</td><td>đoán sáu output</td><td>FE "in ra gì?"</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — PE question 1: input.txt → output.txt with the given Q1 skeleton (~40 min)</h3>
<p>(PE style, built on the real skeleton of PE3/PE5/PE9) Create class <code>Book</code> as in the diagram, with <code>toString()</code> returning <code>id-title-price-qty</code>, price with 2 decimals (<code>B01-Clean Code-32.50-3</code>). Then complete class <code>Q1</code>, which reads <code>input.txt</code> and writes all results to <code>output.txt</code>. Do <strong>not</strong> edit the FIXED PART. Input: the first line is T (1 ≤ T ≤ 100); each of the next T lines is one command, fields separated by commas:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/959d12773cdffa0a40ebc4608e612767b0c21a9d.svg" alt="Exercise 1: what you write (Book, the @STUDENT parts of Q1) and what the paper fixes" loading="lazy" /><p class="chu-thich">🧩 Exercise 1: what you write (Book, the @STUDENT parts of Q1) and what the paper fixes</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Exercise 1 — PE question 1 with files: you write Book and the @STUDENT parts of Q1
class Book {
  - id : String
  - title : String
  - price : double
  - qty : int
  + Book(id : String, title : String, price : double, qty : int)
  + getId() : String
  + getTitle() : String
  + getPrice() : double
  + getQty() : int
  + setQty(qty : int) : void
  + toString() : String
}
class Q1 &lt;&lt;given skeleton&gt;&gt; {
  ~ inputFile : String = "input.txt"
  ~ outputFile : String = "output.txt"
  ~ fi : String
  ~ fo : String
  + setFile(args : String[]) : void
  + read() : void
  + solve() : void
  + printResult() : void
  + {static} main(args : String[]) : void
}
database "input.txt\\nT\\nadd,B01,Clean Code,32.5,3\\n..." as IN #FEF3C7
database "output.txt\\nAdded B01\\n..." as OUT #FEF3C7
Q1 o-- "*" Book : books
IN --&gt; Q1 : read(): Scanner(new File(fi))
Q1 --&gt; OUT : printResult(): FileWriter(fo)
note right of Q1
  FIXED PART: do not edit
  @STUDENT parts: variables,
  input loop, algorithm, output
end note
@enduml</code></pre></details>
<ul>
<li><code>add,id,title,price,qty</code> — add a book and output "Added id"; if the id already exists output "Duplicated id".</li>
<li><code>sell,id,n</code> — decrease the quantity: "Sold n of id"; "Not found id" if absent; "Not enough id" if n &gt; qty.</li>
<li><code>search,id</code> — output the book's string, or "Not found".</li>
<li><code>sort</code> — sort by price descending, equal prices by title ascending; output "Sorted".</li>
<li><code>print</code> — every book's string in the current order, or "Empty".</li>
<li><code>total</code> — "Total value: x" where x = Σ price × qty with 2 decimals.</li>
</ul>
<details><summary>Solution (run for real on JDK 8, with three input files and one missing file)</summary>
<pre class="trich"><code class="language-java">class Book {
    private String id;
    private String title;
    private double price;
    private int qty;

    public Book(String id, String title, double price, int qty) {
        this.id = id; this.title = title; this.price = price; this.qty = qty;
    }
    public String getId() { return id; }
    public String getTitle() { return title; }
    public double getPrice() { return price; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    @Override
    public String toString() { return id + "-" + title + "-" + String.format("%.2f", price) + "-" + qty; }
}</code></pre>
<pre class="trich"><code class="language-java">class Q1 {
    //Change the name of input and output file based on practical paper
    String inputFile = "input.txt";
    String outputFile = "output.txt";

    //--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
    List&lt;String&gt; commands = new ArrayList&lt;String&gt;();             // the T command lines
    List&lt;Book&gt; books = new ArrayList&lt;Book&gt;();
    StringBuilder result = new StringBuilder();                  // everything printResult must write

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    String fi, fo;

    /**
     * Set input and output file for automatic rating
     * @param args path of input file and path of output file
     */
    public void setFile (String[] args){
        fi = args.length&gt;=2? args[0]: inputFile;
        fo = args.length&gt;=2? args[1]: outputFile;
    }

    /**
     * Reads data from input file
     */
    public void read(){
        try (Scanner sc  = new Scanner(new File(fi))){
    //--END FIXED PART----------------------------

            //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
            int t = Integer.parseInt(sc.nextLine().trim());        // read T with nextLine, not nextInt
            for (int i = 0; i &lt; t; i++) commands.add(sc.nextLine().trim());

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            sc.close();
        }catch(FileNotFoundException ex){
            System.out.println("Input Exception # " + ex);
        }
    }
    //--END FIXED PART----------------------------

    //ALGORITHM - @STUDENT: ADD YOUROWN METHODS HERE (IF NEED):
    Book find(String id) {
        for (Book b : books) if (b.getId().equalsIgnoreCase(id)) return b;
        return null;
    }
    void out(String line) { result.append(line).append("\\n"); }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    /**
     * Main algorithm
     */
    public void solve(){
    //--END FIXED PART----------------------------

        //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
        for (String cmd : commands) {
            String[] p = cmd.split(",");
            switch (p[0].trim().toLowerCase()) {
                case "add": {
                    String id = p[1].trim();
                    if (find(id) != null) { out("Duplicated " + id); break; }
                    books.add(new Book(id, p[2].trim(), Double.parseDouble(p[3].trim()), Integer.parseInt(p[4].trim())));
                    out("Added " + id);
                    break;
                }
                case "sell": {
                    Book b = find(p[1].trim());
                    int n = Integer.parseInt(p[2].trim());
                    if (b == null) out("Not found " + p[1].trim());
                    else if (n &gt; b.getQty()) out("Not enough " + b.getId());
                    else { b.setQty(b.getQty() - n); out("Sold " + n + " of " + b.getId()); }
                    break;
                }
                case "search": {
                    Book b = find(p[1].trim());
                    out(b == null ? "Not found" : b.toString());
                    break;
                }
                case "sort":
                    Collections.sort(books, new Comparator&lt;Book&gt;() {      // price descending, then title ascending
                        public int compare(Book a, Book b) {
                            int c = Double.compare(b.getPrice(), a.getPrice());
                            return c != 0 ? c : a.getTitle().compareTo(b.getTitle());
                        }
                    });
                    out("Sorted");
                    break;
                case "print":
                    if (books.isEmpty()) out("Empty");
                    for (Book b : books) out(b.toString());
                    break;
                case "total": {
                    double sum = 0;
                    for (Book b : books) sum += b.getPrice() * b.getQty();
                    out(String.format("Total value: %.2f", sum));
                    break;
                }
            }
        }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    }

    /**
     * Write result into output file
     */
    public void printResult(){
        try{
            FileWriter fw = new FileWriter(fo);
    //--END FIXED PART----------------------------

            //OUTPUT - @STUDENT: ADD YOUR CODE FOR OUTPUT HERE:
            fw.write(result.toString());

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            fw.flush();
            fw.close();
        }catch (IOException ex){
            System.out.println("Output Exception # " + ex);
        }
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        Q1 q = new Q1();
        q.setFile(args);
        q.read();
        q.solve();
        q.printResult();
    }
    //--END FIXED PART----------------------------
}</code></pre>
<p>The grader does what this harness does: write an input file, run <code>Q1</code> with the two paths as <code>args</code>, compare the output file with the expected one.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws IOException {
    viet("input1.txt", "7\\nadd,B01,Clean Code,32.5,3\\nadd,B02,Head First Java,28,5\\nadd,B01,Duplicate,1,1\\n"
            + "sell,B02,2\\nsell,B01,9\\nsearch,B02\\nprint\\n");
    viet("input2.txt", "6\\nprint\\nadd,B03,Effective Java,45.9,2\\nadd,B04,Java Basics,12.25,10\\nadd,B05,Algorithms,45.9,1\\nsort\\nprint\\n");
    viet("input3.txt", "4\\nadd,B06,Refactoring,40,1\\nadd,B07,Patterns,35.5,2\\nsell,B09,1\\ntotal\\n");
    for (int k = 1; k &lt;= 3; k++) {
        Q1.main(new String[] { "input" + k + ".txt", "output" + k + ".txt" });   // what the grader does: java Q1 &lt;in&gt; &lt;out&gt;
        System.out.println("== output" + k + ".txt ==");
        System.out.print(doc("output" + k + ".txt"));
    }
    System.out.println("== a missing input file ==");
    Q1.main(new String[] { "khong-co.txt", "output9.txt" });
    System.out.println("output9.txt exists: " + new File("output9.txt").exists() + ", length " + new File("output9.txt").length());
}</code></pre>
<div class="out">== output1.txt ==<br>
Added B01<br>
Added B02<br>
Duplicated B01<br>
Sold 2 of B02<br>
Not enough B01<br>
B02-Head First Java-28.00-3<br>
B01-Clean Code-32.50-3<br>
B02-Head First Java-28.00-3<br>
== output2.txt ==<br>
Empty<br>
Added B03<br>
Added B04<br>
Added B05<br>
Sorted<br>
B05-Algorithms-45.90-1<br>
B03-Effective Java-45.90-2<br>
B04-Java Basics-12.25-10<br>
== output3.txt ==<br>
Added B06<br>
Added B07<br>
Not found B09<br>
Total value: 111.00<br>
== a missing input file ==<br>
Input Exception # java.io.FileNotFoundException: khong-co.txt (No such file or directory)<br>
output9.txt exists: true, length 0</div>
<p>In <code>output2.txt</code>, B05 "Algorithms" comes before B03 "Effective Java": both cost 45.90, so the title decides. In <code>output1.txt</code>, "sell,B01,9" is refused (only 3 left). With a missing input the skeleton prints "Input Exception # …" itself and still creates an <strong>empty</strong> output file — that is the 0-mark result you get if your file name or <code>read()</code> is wrong.</p>
</details>
<div class="pitfall">Four marks are lost here every semester. (1) <strong>T with <code>nextInt()</code></strong>: then the first <code>nextLine()</code> returns the empty rest of line 1, and every command shifts by one — read T with <code>Integer.parseInt(sc.nextLine().trim())</code> as above. (2) <strong>Writing inside <code>read()</code> or printing to the console</strong>: the grader reads only <code>output.txt</code>; collect everything in a <code>StringBuilder</code> and write it in <code>printResult()</code>. (3) <strong><code>fw.write(int)</code></strong> writes a character, not a number (lesson 9.B, slide 15). (4) <code>String.format("%.2f")</code> uses the machine's locale: on a PC set to Vietnamese it prints <code>32,50</code>; the exam PCs are English, but if your output shows commas, that is why (<code>String.format(Locale.US, …)</code> fixes it).</div>`,
    `<h3>🧪 Bài 1 — Câu 1 đề PE: input.txt → output.txt với khung Q1 cho sẵn (~40 phút)</h3>
<p>(Kiểu PE, dựng trên đúng khung thật của PE3/PE5/PE9) Tạo lớp <code>Book</code> như sơ đồ, <code>toString()</code> trả về <code>id-title-price-qty</code>, giá 2 chữ số thập phân (<code>B01-Clean Code-32.50-3</code>). Rồi hoàn thành lớp <code>Q1</code>, đọc <code>input.txt</code> và ghi mọi kết quả ra <code>output.txt</code>. <strong>Không</strong> sửa phần FIXED PART. Dữ liệu vào: dòng đầu là T (1 ≤ T ≤ 100); mỗi dòng trong T dòng tiếp theo là một lệnh, các trường cách nhau bằng dấu phẩy:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/959d12773cdffa0a40ebc4608e612767b0c21a9d.svg" alt="Bài 1: phần bạn viết (Book, các phần @STUDENT của Q1) và phần đề cố định" loading="lazy" /><p class="chu-thich">🧩 Bài 1: phần bạn viết (Book, các phần @STUDENT của Q1) và phần đề cố định</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Exercise 1 — PE question 1 with files: you write Book and the @STUDENT parts of Q1
class Book {
  - id : String
  - title : String
  - price : double
  - qty : int
  + Book(id : String, title : String, price : double, qty : int)
  + getId() : String
  + getTitle() : String
  + getPrice() : double
  + getQty() : int
  + setQty(qty : int) : void
  + toString() : String
}
class Q1 &lt;&lt;given skeleton&gt;&gt; {
  ~ inputFile : String = "input.txt"
  ~ outputFile : String = "output.txt"
  ~ fi : String
  ~ fo : String
  + setFile(args : String[]) : void
  + read() : void
  + solve() : void
  + printResult() : void
  + {static} main(args : String[]) : void
}
database "input.txt\\nT\\nadd,B01,Clean Code,32.5,3\\n..." as IN #FEF3C7
database "output.txt\\nAdded B01\\n..." as OUT #FEF3C7
Q1 o-- "*" Book : books
IN --&gt; Q1 : read(): Scanner(new File(fi))
Q1 --&gt; OUT : printResult(): FileWriter(fo)
note right of Q1
  FIXED PART: do not edit
  @STUDENT parts: variables,
  input loop, algorithm, output
end note
@enduml</code></pre></details>
<ul>
<li><code>add,id,title,price,qty</code> — thêm một cuốn sách và ghi "Added id"; nếu id đã có thì ghi "Duplicated id".</li>
<li><code>sell,id,n</code> — giảm số lượng: "Sold n of id"; "Not found id" nếu không có; "Not enough id" nếu n &gt; qty.</li>
<li><code>search,id</code> — ghi chuỗi của cuốn sách, hoặc "Not found".</li>
<li><code>sort</code> — sắp theo giá giảm dần, cùng giá thì theo tên tăng dần; ghi "Sorted".</li>
<li><code>print</code> — chuỗi của từng cuốn theo thứ tự hiện tại, hoặc "Empty".</li>
<li><code>total</code> — "Total value: x" với x = Σ giá × số lượng, 2 chữ số thập phân.</li>
</ul>
<details><summary>Lời giải (chạy thật trên JDK 8, với ba file input và một file thiếu)</summary>
<pre class="trich"><code class="language-java">class Book {
    private String id;
    private String title;
    private double price;
    private int qty;

    public Book(String id, String title, double price, int qty) {
        this.id = id; this.title = title; this.price = price; this.qty = qty;
    }
    public String getId() { return id; }
    public String getTitle() { return title; }
    public double getPrice() { return price; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    @Override
    public String toString() { return id + "-" + title + "-" + String.format("%.2f", price) + "-" + qty; }
}</code></pre>
<pre class="trich"><code class="language-java">class Q1 {
    //Change the name of input and output file based on practical paper
    String inputFile = "input.txt";
    String outputFile = "output.txt";

    //--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
    List&lt;String&gt; commands = new ArrayList&lt;String&gt;();             // T dòng lệnh
    List&lt;Book&gt; books = new ArrayList&lt;Book&gt;();
    StringBuilder result = new StringBuilder();                  // mọi thứ printResult phải ghi

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    String fi, fo;

    /**
     * Set input and output file for automatic rating
     * @param args path of input file and path of output file
     */
    public void setFile (String[] args){
        fi = args.length&gt;=2? args[0]: inputFile;
        fo = args.length&gt;=2? args[1]: outputFile;
    }

    /**
     * Reads data from input file
     */
    public void read(){
        try (Scanner sc  = new Scanner(new File(fi))){
    //--END FIXED PART----------------------------

            //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
            int t = Integer.parseInt(sc.nextLine().trim());        // đọc T bằng nextLine, không dùng nextInt
            for (int i = 0; i &lt; t; i++) commands.add(sc.nextLine().trim());

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            sc.close();
        }catch(FileNotFoundException ex){
            System.out.println("Input Exception # " + ex);
        }
    }
    //--END FIXED PART----------------------------

    //ALGORITHM - @STUDENT: ADD YOUROWN METHODS HERE (IF NEED):
    Book find(String id) {
        for (Book b : books) if (b.getId().equalsIgnoreCase(id)) return b;
        return null;
    }
    void out(String line) { result.append(line).append("\\n"); }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    /**
     * Main algorithm
     */
    public void solve(){
    //--END FIXED PART----------------------------

        //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
        for (String cmd : commands) {
            String[] p = cmd.split(",");
            switch (p[0].trim().toLowerCase()) {
                case "add": {
                    String id = p[1].trim();
                    if (find(id) != null) { out("Duplicated " + id); break; }
                    books.add(new Book(id, p[2].trim(), Double.parseDouble(p[3].trim()), Integer.parseInt(p[4].trim())));
                    out("Added " + id);
                    break;
                }
                case "sell": {
                    Book b = find(p[1].trim());
                    int n = Integer.parseInt(p[2].trim());
                    if (b == null) out("Not found " + p[1].trim());
                    else if (n &gt; b.getQty()) out("Not enough " + b.getId());
                    else { b.setQty(b.getQty() - n); out("Sold " + n + " of " + b.getId()); }
                    break;
                }
                case "search": {
                    Book b = find(p[1].trim());
                    out(b == null ? "Not found" : b.toString());
                    break;
                }
                case "sort":
                    Collections.sort(books, new Comparator&lt;Book&gt;() {      // giá giảm dần, rồi tên tăng dần
                        public int compare(Book a, Book b) {
                            int c = Double.compare(b.getPrice(), a.getPrice());
                            return c != 0 ? c : a.getTitle().compareTo(b.getTitle());
                        }
                    });
                    out("Sorted");
                    break;
                case "print":
                    if (books.isEmpty()) out("Empty");
                    for (Book b : books) out(b.toString());
                    break;
                case "total": {
                    double sum = 0;
                    for (Book b : books) sum += b.getPrice() * b.getQty();
                    out(String.format("Total value: %.2f", sum));
                    break;
                }
            }
        }

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    }

    /**
     * Write result into output file
     */
    public void printResult(){
        try{
            FileWriter fw = new FileWriter(fo);
    //--END FIXED PART----------------------------

            //OUTPUT - @STUDENT: ADD YOUR CODE FOR OUTPUT HERE:
            fw.write(result.toString());

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            fw.flush();
            fw.close();
        }catch (IOException ex){
            System.out.println("Output Exception # " + ex);
        }
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        Q1 q = new Q1();
        q.setFile(args);
        q.read();
        q.solve();
        q.printResult();
    }
    //--END FIXED PART----------------------------
}</code></pre>
<p>Máy chấm làm đúng như khung chạy này: ghi một file input, chạy <code>Q1</code> với hai đường dẫn làm <code>args</code>, so file output với file đáp án.</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws IOException {
    viet("input1.txt", "7\\nadd,B01,Clean Code,32.5,3\\nadd,B02,Head First Java,28,5\\nadd,B01,Duplicate,1,1\\n"
            + "sell,B02,2\\nsell,B01,9\\nsearch,B02\\nprint\\n");
    viet("input2.txt", "6\\nprint\\nadd,B03,Effective Java,45.9,2\\nadd,B04,Java Basics,12.25,10\\nadd,B05,Algorithms,45.9,1\\nsort\\nprint\\n");
    viet("input3.txt", "4\\nadd,B06,Refactoring,40,1\\nadd,B07,Patterns,35.5,2\\nsell,B09,1\\ntotal\\n");
    for (int k = 1; k &lt;= 3; k++) {
        Q1.main(new String[] { "input" + k + ".txt", "output" + k + ".txt" });   // việc máy chấm làm
        System.out.println("== output" + k + ".txt ==");
        System.out.print(doc("output" + k + ".txt"));
    }
    System.out.println("== a missing input file ==");
    Q1.main(new String[] { "khong-co.txt", "output9.txt" });
    System.out.println("output9.txt exists: " + new File("output9.txt").exists() + ", length " + new File("output9.txt").length());
}</code></pre>
<div class="out">== output1.txt ==<br>
Added B01<br>
Added B02<br>
Duplicated B01<br>
Sold 2 of B02<br>
Not enough B01<br>
B02-Head First Java-28.00-3<br>
B01-Clean Code-32.50-3<br>
B02-Head First Java-28.00-3<br>
== output2.txt ==<br>
Empty<br>
Added B03<br>
Added B04<br>
Added B05<br>
Sorted<br>
B05-Algorithms-45.90-1<br>
B03-Effective Java-45.90-2<br>
B04-Java Basics-12.25-10<br>
== output3.txt ==<br>
Added B06<br>
Added B07<br>
Not found B09<br>
Total value: 111.00<br>
== a missing input file ==<br>
Input Exception # java.io.FileNotFoundException: khong-co.txt (No such file or directory)<br>
output9.txt exists: true, length 0</div>
<p>Trong <code>output2.txt</code>, B05 "Algorithms" đứng trước B03 "Effective Java": cùng giá 45.90 nên tên quyết định. Trong <code>output1.txt</code>, "sell,B01,9" bị từ chối (chỉ còn 3). Khi thiếu file input, chính khung in "Input Exception # …" và vẫn tạo một file output <strong>rỗng</strong> — đó là kết quả 0 điểm bạn nhận nếu tên file hay <code>read()</code> sai.</p>
</details>
<div class="pitfall">Bốn chỗ mất điểm mỗi học kỳ. (1) <strong>Đọc T bằng <code>nextInt()</code></strong>: khi đó <code>nextLine()</code> đầu tiên trả về phần rỗng còn lại của dòng 1, và mọi lệnh lệch đi một dòng — hãy đọc T bằng <code>Integer.parseInt(sc.nextLine().trim())</code> như trên. (2) <strong>Ghi bên trong <code>read()</code> hoặc in ra console</strong>: máy chấm chỉ đọc <code>output.txt</code>; gom mọi thứ vào một <code>StringBuilder</code> và ghi trong <code>printResult()</code>. (3) <strong><code>fw.write(int)</code></strong> ghi một ký tự chứ không phải con số (bài 9.B, slide 15). (4) <code>String.format("%.2f")</code> dùng locale của máy: máy đặt tiếng Việt sẽ in <code>32,50</code>; máy thi để tiếng Anh, nhưng nếu output của bạn hiện dấu phẩy thì đó là lý do (<code>String.format(Locale.US, …)</code> sửa được).</div>`),
    bi(`<h3>🧪 Exercise 2 — LAB211: a student manager over students.csv (~45 min)</h3>
<p>The file <code>students.csv</code> (UTF-8) starts with the header <code>code,name,gpa</code>, then one student per line. Write a program that:</p>
<ul>
<li>loads the file at start, skipping the header and blank lines, and <strong>reports</strong> each bad line with its line number instead of crashing (wrong number of fields, a GPA that is not a number);</li>
<li>offers 1-List, 2-Add (code <code>SE</code> + 3 digits, unique; name not empty and without commas; GPA 0..10 — ask again until valid), 3-Delete by code, 4-Save and quit, 5-Quit without saving;</li>
<li>saves safely: write a temporary file, then replace the real one.</li>
</ul>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2dd535e76489ffb827cfd796b8a3a5515f3dd488.svg" alt="Exercise 2: the classes — one input helper, a list class that owns the file" loading="lazy" /><p class="chu-thich">🧩 Exercise 2: the classes — one input helper, a list class that owns the file</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Exercise 2 — a LAB211-style manager over students.csv (UTF-8)
class Student {
  - code : String
  - name : String
  - gpa : double
  ~ toCsv() : String
  + toString() : String
}
class StudentList {
  - list : List&lt;Student&gt;
  - file : Path
  ~ load() : void
  ~ save() : void
  ~ find(code : String) : int
  ~ add() : void
  ~ delete() : void
  ~ print() : void
}
class Nhap &lt;&lt;input helper&gt;&gt; {
  - {static} SC : Scanner
  ~ {static} dong(prompt : String) : String
  ~ {static} theoMau(prompt, regex, loi) : String
  ~ {static} soThuc(prompt, min, max) : double
}
class QuanLySinhVienCsv {
  + {static} main(args : String[]) : void
}
database "students.csv\\ncode,name,gpa\\nSE001,Nguyễn Văn An,8.5" as F #FEF3C7
StudentList *-- "*" Student
StudentList ..&gt; Nhap : asks
QuanLySinhVienCsv ..&gt; StudentList
StudentList ..&gt; F : load: newBufferedReader(UTF-8)\\nsave: .tmp then Files.move
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8, with the input below)</summary>
<pre class="trich"><code class="language-java">class Student {
    private final String code;
    private final String name;
    private final double gpa;
    Student(String code, String name, double gpa) { this.code = code; this.name = name; this.gpa = gpa; }
    String getCode() { return code; }
    String toCsv() { return code + "," + name + "," + gpa; }                      // the file format
    @Override public String toString() { return String.format("%-7s%-22s%5.1f", code, name, gpa); }
}</code></pre>
<pre class="trich"><code class="language-java">class Nhap {
    private static final Scanner SC = new Scanner(System.in);                   // ONE Scanner
    static String dong(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                                  // echo, like the console
        return s;
    }
    static String theoMau(String prompt, String regex, String loi) {
        while (true) {
            String s = dong(prompt).toUpperCase();
            if (s.matches(regex)) return s;
            System.out.println(loi);
        }
    }
    static double soThuc(String prompt, double min, double max) {
        while (true) {
            try {
                double x = Double.parseDouble(dong(prompt));
                if (x &gt;= min &amp;&amp; x &lt;= max) return x;
            } catch (NumberFormatException e) {
                // not a number
            }
            System.out.println("Enter a number in " + min + ".." + max + ".");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">void load() {
    if (!Files.exists(file)) { System.out.println("No " + file + " yet: starting empty."); return; }
    try (BufferedReader br = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
        String line;
        int no = 0;
        while ((line = br.readLine()) != null) {
            no++;
            if (no == 1 &amp;&amp; line.startsWith("\\uFEFF")) line = line.substring(1);      // a BOM written by Notepad
            if (no == 1 &amp;&amp; line.equalsIgnoreCase("code,name,gpa")) continue;      // the header line
            if (line.trim().isEmpty()) continue;
            String[] p = line.split(",");
            if (p.length != 3) { System.out.println("line " + no + ": expected 3 fields, found " + p.length + " - skipped"); continue; }
            try {
                list.add(new Student(p[0].trim().toUpperCase(), p[1].trim(), Double.parseDouble(p[2].trim())));
            } catch (NumberFormatException e) {
                System.out.println("line " + no + ": bad gpa '" + p[2].trim() + "' - skipped");
            }
        }
        System.out.println("Loaded " + list.size() + " students from " + file);
    } catch (IOException e) {
        System.out.println("Cannot read " + file + ": " + e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">void save() {
    Path tmp = Paths.get(file + ".tmp");
    try (PrintWriter pw = new PrintWriter(Files.newBufferedWriter(tmp, StandardCharsets.UTF_8))) {
        pw.println("code,name,gpa");
        for (Student s : list) pw.println(s.toCsv());
    } catch (IOException e) {
        System.out.println("Save failed, " + file + " untouched: " + e);
        return;
    }
    try {
        Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);           // the old file is replaced only now
        System.out.println("Saved " + list.size() + " students to " + file);
    } catch (IOException e) {
        System.out.println("Save failed: " + e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">int find(String code) {
    for (int i = 0; i &lt; list.size(); i++) if (list.get(i).getCode().equals(code)) return i;
    return -1;
}
void add() {
    String code;
    while (true) {
        code = Nhap.theoMau("Code (SExxx): ", "SE\\\\d{3}", "Code must be SE + 3 digits.");
        if (find(code) &lt; 0) break;
        System.out.println(code + " already exists.");
    }
    String name;
    while (true) {
        name = Nhap.dong("Name: ");
        if (!name.isEmpty() &amp;&amp; !name.contains(",")) break;                  // a comma would break the CSV format
        System.out.println("Name must not be empty or contain a comma.");
    }
    double gpa = Nhap.soThuc("GPA: ", 0, 10);
    list.add(new Student(code, name, gpa));
    System.out.println("Added.");
}
void delete() {
    int pos = find(Nhap.dong("Code to delete: ").toUpperCase());
    if (pos &lt; 0) System.out.println("Not found.");
    else System.out.println("Deleted " + list.remove(pos).getCode() + ".");
}
void print() {
    if (list.isEmpty()) { System.out.println("Empty list."); return; }
    for (Student s : list) System.out.println(s);
}</code></pre>
<pre class="trich"><code class="language-java">try (Writer w = new OutputStreamWriter(new FileOutputStream("students.csv"), "UTF-8")) {
    w.write("code,name,gpa\\nSE001,Nguyễn Văn An,8.5\\nSE002,Trần Thị Bình,7.25\\nSE003,Lê Văn Cường,abc\\n\\nSE004,Phạm Dũng\\nse005,Hoàng Yến,9\\n");
}</code></pre>
<pre class="trich"><code class="language-java">StudentList sl = new StudentList("students.csv");
sl.load();
while (true) {
    System.out.println("1-List  2-Add  3-Delete  4-Save and quit  5-Quit without saving");
    String c = Nhap.dong("Choose: ");
    if (c.equals("1")) sl.print();
    else if (c.equals("2")) sl.add();
    else if (c.equals("3")) sl.delete();
    else if (c.equals("4")) { sl.save(); break; }
    else if (c.equals("5")) break;
    else System.out.println("Choose 1..5.");
}</code></pre>
<p>Keyboard input (piped in; the program echoes each line it reads):</p>
<pre><code class="language-plaintext">1
2
se01
se002
SE006
Đỗ Minh, Khoa
Đỗ Minh Khoa
11
8.75
3
SE009
3
se002
1
7
4</code></pre>
<div class="out">line 4: bad gpa 'abc' - skipped<br>
line 6: expected 3 fields, found 2 - skipped<br>
Loaded 3 students from students.csv<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 1<br>
SE001 &nbsp;Nguyễn Văn An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
SE002 &nbsp;Trần Thị Bình &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.3<br>
SE005 &nbsp;Hoàng Yến &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9.0<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 2<br>
Code (SExxx): se01<br>
Code must be SE + 3 digits.<br>
Code (SExxx): se002<br>
SE002 already exists.<br>
Code (SExxx): SE006<br>
Name: Đỗ Minh, Khoa<br>
Name must not be empty or contain a comma.<br>
Name: Đỗ Minh Khoa<br>
GPA: 11<br>
Enter a number in 0.0..10.0.<br>
GPA: 8.75<br>
Added.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 3<br>
Code to delete: SE009<br>
Not found.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 3<br>
Code to delete: se002<br>
Deleted SE002.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 1<br>
SE001 &nbsp;Nguyễn Văn An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
SE005 &nbsp;Hoàng Yến &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9.0<br>
SE006 &nbsp;Đỗ Minh Khoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.8<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 7<br>
Choose 1..5.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 4<br>
Saved 3 students to students.csv<br>
--- students.csv now (read as UTF-8) ---<br>
code,name,gpa<br>
SE001,Nguyễn Văn An,8.5<br>
SE005,Hoàng Yến,9.0<br>
SE006,Đỗ Minh Khoa,8.75</div>
<p>Lines 4 and 6 of the file are reported and skipped; "se005" is loaded as SE005. The list shows GPA with one decimal (7.25 prints as 7.3, 8.75 as 8.8) but the file keeps the full value (8.75) — formatting is for display only. The comma in "Đỗ Minh, Khoa" is refused because it would split the line into four fields next time the file is read.</p>
</details>
<div class="pitfall">LAB211 graders check exactly these: a missing file at first start (handled: "starting empty"), wrong data in the file, wrong input at every prompt, and data surviving a restart. Two habits from this solution: <strong>one</strong> <code>Scanner</code> for the whole program (lesson 9.B, slide 24), and <strong>never</strong> let a bad line or a bad number reach an uncaught <code>NumberFormatException</code>.</div>`,
    `<h3>🧪 Bài 2 — LAB211: quản lý sinh viên trên students.csv (~45 phút)</h3>
<p>File <code>students.csv</code> (UTF-8) bắt đầu bằng dòng tiêu đề <code>code,name,gpa</code>, sau đó mỗi dòng một sinh viên. Viết chương trình:</p>
<ul>
<li>nạp file lúc mở, bỏ qua dòng tiêu đề và dòng trống, và <strong>báo</strong> từng dòng hỏng kèm số dòng thay vì sập (sai số trường, GPA không phải số);</li>
<li>có 1-List, 2-Add (mã <code>SE</code> + 3 chữ số, không trùng; tên không rỗng và không chứa dấu phẩy; GPA 0..10 — hỏi lại tới khi hợp lệ), 3-Delete theo mã, 4-Save and quit, 5-Quit without saving;</li>
<li>lưu an toàn: ghi ra file tạm, rồi mới thay file thật.</li>
</ul>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2dd535e76489ffb827cfd796b8a3a5515f3dd488.svg" alt="Bài 2: các lớp — một lớp phụ nhập liệu, một lớp danh sách nắm giữ file" loading="lazy" /><p class="chu-thich">🧩 Bài 2: các lớp — một lớp phụ nhập liệu, một lớp danh sách nắm giữ file</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
allowmixing
title Exercise 2 — a LAB211-style manager over students.csv (UTF-8)
class Student {
  - code : String
  - name : String
  - gpa : double
  ~ toCsv() : String
  + toString() : String
}
class StudentList {
  - list : List&lt;Student&gt;
  - file : Path
  ~ load() : void
  ~ save() : void
  ~ find(code : String) : int
  ~ add() : void
  ~ delete() : void
  ~ print() : void
}
class Nhap &lt;&lt;input helper&gt;&gt; {
  - {static} SC : Scanner
  ~ {static} dong(prompt : String) : String
  ~ {static} theoMau(prompt, regex, loi) : String
  ~ {static} soThuc(prompt, min, max) : double
}
class QuanLySinhVienCsv {
  + {static} main(args : String[]) : void
}
database "students.csv\\ncode,name,gpa\\nSE001,Nguyễn Văn An,8.5" as F #FEF3C7
StudentList *-- "*" Student
StudentList ..&gt; Nhap : asks
QuanLySinhVienCsv ..&gt; StudentList
StudentList ..&gt; F : load: newBufferedReader(UTF-8)\\nsave: .tmp then Files.move
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8, với dữ liệu bên dưới)</summary>
<pre class="trich"><code class="language-java">class Student {
    private final String code;
    private final String name;
    private final double gpa;
    Student(String code, String name, double gpa) { this.code = code; this.name = name; this.gpa = gpa; }
    String getCode() { return code; }
    String toCsv() { return code + "," + name + "," + gpa; }                      // định dạng trong file
    @Override public String toString() { return String.format("%-7s%-22s%5.1f", code, name, gpa); }
}</code></pre>
<pre class="trich"><code class="language-java">class Nhap {
    private static final Scanner SC = new Scanner(System.in);                   // MỘT Scanner
    static String dong(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                                  // in lại, như console
        return s;
    }
    static String theoMau(String prompt, String regex, String loi) {
        while (true) {
            String s = dong(prompt).toUpperCase();
            if (s.matches(regex)) return s;
            System.out.println(loi);
        }
    }
    static double soThuc(String prompt, double min, double max) {
        while (true) {
            try {
                double x = Double.parseDouble(dong(prompt));
                if (x &gt;= min &amp;&amp; x &lt;= max) return x;
            } catch (NumberFormatException e) {
                // không phải số
            }
            System.out.println("Enter a number in " + min + ".." + max + ".");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">void load() {
    if (!Files.exists(file)) { System.out.println("No " + file + " yet: starting empty."); return; }
    try (BufferedReader br = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
        String line;
        int no = 0;
        while ((line = br.readLine()) != null) {
            no++;
            if (no == 1 &amp;&amp; line.startsWith("\\uFEFF")) line = line.substring(1);      // BOM do Notepad ghi
            if (no == 1 &amp;&amp; line.equalsIgnoreCase("code,name,gpa")) continue;      // dòng tiêu đề
            if (line.trim().isEmpty()) continue;
            String[] p = line.split(",");
            if (p.length != 3) { System.out.println("line " + no + ": expected 3 fields, found " + p.length + " - skipped"); continue; }
            try {
                list.add(new Student(p[0].trim().toUpperCase(), p[1].trim(), Double.parseDouble(p[2].trim())));
            } catch (NumberFormatException e) {
                System.out.println("line " + no + ": bad gpa '" + p[2].trim() + "' - skipped");
            }
        }
        System.out.println("Loaded " + list.size() + " students from " + file);
    } catch (IOException e) {
        System.out.println("Cannot read " + file + ": " + e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">void save() {
    Path tmp = Paths.get(file + ".tmp");
    try (PrintWriter pw = new PrintWriter(Files.newBufferedWriter(tmp, StandardCharsets.UTF_8))) {
        pw.println("code,name,gpa");
        for (Student s : list) pw.println(s.toCsv());
    } catch (IOException e) {
        System.out.println("Save failed, " + file + " untouched: " + e);
        return;
    }
    try {
        Files.move(tmp, file, StandardCopyOption.REPLACE_EXISTING);           // giờ mới thay file cũ
        System.out.println("Saved " + list.size() + " students to " + file);
    } catch (IOException e) {
        System.out.println("Save failed: " + e);
    }
}</code></pre>
<pre class="trich"><code class="language-java">int find(String code) {
    for (int i = 0; i &lt; list.size(); i++) if (list.get(i).getCode().equals(code)) return i;
    return -1;
}
void add() {
    String code;
    while (true) {
        code = Nhap.theoMau("Code (SExxx): ", "SE\\\\d{3}", "Code must be SE + 3 digits.");
        if (find(code) &lt; 0) break;
        System.out.println(code + " already exists.");
    }
    String name;
    while (true) {
        name = Nhap.dong("Name: ");
        if (!name.isEmpty() &amp;&amp; !name.contains(",")) break;                  // dấu phẩy sẽ phá định dạng CSV
        System.out.println("Name must not be empty or contain a comma.");
    }
    double gpa = Nhap.soThuc("GPA: ", 0, 10);
    list.add(new Student(code, name, gpa));
    System.out.println("Added.");
}
void delete() {
    int pos = find(Nhap.dong("Code to delete: ").toUpperCase());
    if (pos &lt; 0) System.out.println("Not found.");
    else System.out.println("Deleted " + list.remove(pos).getCode() + ".");
}
void print() {
    if (list.isEmpty()) { System.out.println("Empty list."); return; }
    for (Student s : list) System.out.println(s);
}</code></pre>
<pre class="trich"><code class="language-java">try (Writer w = new OutputStreamWriter(new FileOutputStream("students.csv"), "UTF-8")) {
    w.write("code,name,gpa\\nSE001,Nguyễn Văn An,8.5\\nSE002,Trần Thị Bình,7.25\\nSE003,Lê Văn Cường,abc\\n\\nSE004,Phạm Dũng\\nse005,Hoàng Yến,9\\n");
}</code></pre>
<pre class="trich"><code class="language-java">StudentList sl = new StudentList("students.csv");
sl.load();
while (true) {
    System.out.println("1-List  2-Add  3-Delete  4-Save and quit  5-Quit without saving");
    String c = Nhap.dong("Choose: ");
    if (c.equals("1")) sl.print();
    else if (c.equals("2")) sl.add();
    else if (c.equals("3")) sl.delete();
    else if (c.equals("4")) { sl.save(); break; }
    else if (c.equals("5")) break;
    else System.out.println("Choose 1..5.");
}</code></pre>
<p>Dữ liệu bàn phím (đổ vào qua đường ống; chương trình in lại mỗi dòng nó đọc):</p>
<pre><code class="language-plaintext">1
2
se01
se002
SE006
Đỗ Minh, Khoa
Đỗ Minh Khoa
11
8.75
3
SE009
3
se002
1
7
4</code></pre>
<div class="out">line 4: bad gpa 'abc' - skipped<br>
line 6: expected 3 fields, found 2 - skipped<br>
Loaded 3 students from students.csv<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 1<br>
SE001 &nbsp;Nguyễn Văn An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
SE002 &nbsp;Trần Thị Bình &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.3<br>
SE005 &nbsp;Hoàng Yến &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9.0<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 2<br>
Code (SExxx): se01<br>
Code must be SE + 3 digits.<br>
Code (SExxx): se002<br>
SE002 already exists.<br>
Code (SExxx): SE006<br>
Name: Đỗ Minh, Khoa<br>
Name must not be empty or contain a comma.<br>
Name: Đỗ Minh Khoa<br>
GPA: 11<br>
Enter a number in 0.0..10.0.<br>
GPA: 8.75<br>
Added.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 3<br>
Code to delete: SE009<br>
Not found.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 3<br>
Code to delete: se002<br>
Deleted SE002.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 1<br>
SE001 &nbsp;Nguyễn Văn An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
SE005 &nbsp;Hoàng Yến &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9.0<br>
SE006 &nbsp;Đỗ Minh Khoa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.8<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 7<br>
Choose 1..5.<br>
1-List &nbsp;2-Add &nbsp;3-Delete &nbsp;4-Save and quit &nbsp;5-Quit without saving<br>
Choose: 4<br>
Saved 3 students to students.csv<br>
--- students.csv now (read as UTF-8) ---<br>
code,name,gpa<br>
SE001,Nguyễn Văn An,8.5<br>
SE005,Hoàng Yến,9.0<br>
SE006,Đỗ Minh Khoa,8.75</div>
<p>Dòng 4 và 6 của file bị báo và bỏ qua; "se005" được nạp thành SE005. Danh sách hiện GPA một chữ số thập phân (7.25 in thành 7.3, 8.75 thành 8.8) nhưng file giữ nguyên giá trị đầy đủ (8.75) — định dạng chỉ để hiển thị. Dấu phẩy trong "Đỗ Minh, Khoa" bị từ chối vì lần đọc file sau nó sẽ tách dòng thành bốn trường.</p>
</details>
<div class="pitfall">Người chấm LAB211 kiểm đúng những thứ này: thiếu file ở lần mở đầu tiên (đã xử lý: "starting empty"), dữ liệu sai trong file, nhập sai ở mọi ô hỏi, và dữ liệu còn nguyên sau khi mở lại. Hai thói quen từ lời giải: <strong>một</strong> <code>Scanner</code> cho cả chương trình (bài 9.B, slide 24), và <strong>không bao giờ</strong> để một dòng hỏng hay một con số sai dẫn tới <code>NumberFormatException</code> không được bắt.</div>`),
    bi(`<h3>🧪 Exercise 3 — A Vietnamese report: count students by family name (~25 min)</h3>
<p><code>names.txt</code> holds one full name per line, saved by Notepad as "UTF-8 with BOM". Count the students of each family name (the first word) and write <code>report.txt</code> in UTF-8, family names in <strong>Vietnamese</strong> alphabetical order. First try it the obvious way and look at the counts.</p>
<details><summary>Solution and the two traps (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">static List&lt;String&gt; docDong(String name, boolean boBom) throws IOException {
    List&lt;String&gt; lines = new ArrayList&lt;String&gt;();
    try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(name), "UTF-8"))) {
        String s;
        while ((s = br.readLine()) != null) {
            if (boBom &amp;&amp; lines.isEmpty() &amp;&amp; s.startsWith("\\uFEFF")) s = s.substring(1);   // Java does NOT remove the BOM for you
            if (!s.trim().isEmpty()) lines.add(s);
        }
    }
    return lines;
}
static Map&lt;String, Integer&gt; dem(List&lt;String&gt; lines) {
    Map&lt;String, Integer&gt; m = new TreeMap&lt;String, Integer&gt;();
    for (String s : lines) {
        String h = s.trim().split("\\\\s+")[0];                                // the family name is the first word
        Integer c = m.get(h);
        m.put(h, c == null ? 1 : c + 1);
    }
    return m;
}</code></pre>
<pre class="trich"><code class="language-java">Map&lt;String, Integer&gt; counts = dem(docDong("names.txt", true));
System.out.println(counts);</code></pre>
<pre class="trich"><code class="language-java">List&lt;String&gt; ho = new ArrayList&lt;String&gt;(counts.keySet());
Collator vi = Collator.getInstance(new Locale("vi", "VN"));             // Vietnamese alphabetical order
Collections.sort(ho, vi);
System.out.println("String order : " + counts.keySet());
System.out.println("Collator(vi) : " + ho);</code></pre>
<pre class="trich"><code class="language-java">try (PrintWriter pw = new PrintWriter(new OutputStreamWriter(new FileOutputStream("report.txt"), "UTF-8"))) {
    pw.println("FAMILY NAME REPORT");
    for (String h : ho) pw.printf("%-8s %d%n", h, counts.get(h));
}
System.out.println("== report.txt (" + new File("report.txt").length() + " bytes, UTF-8) ==");
for (String s : docDong("report.txt", true)) System.out.println(s);</code></pre>
<div class="out">== attempt 1: read as UTF-8, count with a TreeMap ==<br>
{Lê=1, Nguyễn=2, Trần=2, Âu=1, Đỗ=1, \\uFEFFNguyễn=1}<br>
== attempt 2: drop the BOM ==<br>
{Lê=1, Nguyễn=3, Trần=2, Âu=1, Đỗ=1}<br>
String order : [Lê, Nguyễn, Trần, Âu, Đỗ]<br>
Collator(vi) : [Âu, Đỗ, Lê, Nguyễn, Trần]<br>
== report.txt (83 bytes, UTF-8) ==<br>
FAMILY NAME REPORT<br>
Âu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Đỗ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Lê &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Nguyễn &nbsp;&nbsp;3<br>
Trần &nbsp;&nbsp;&nbsp;&nbsp;2</div>
<ul>
<li><strong>The BOM</strong> (byte-order mark, bytes <code>EF BB BF</code> = the invisible character U+FEFF) is the first "character" of the file. Java's UTF-8 reader keeps it, so the first name's family name became <code>⟨BOM⟩Nguyễn</code> — a different key from <code>Nguyễn</code>: attempt 1 counts 2 + 1 instead of 3. The same BOM makes <code>parseInt</code> fail on the first line of a numbers file. Remove it from the first line.</li>
<li><strong>The order</strong>: <code>TreeMap&lt;String, …&gt;</code> sorts by character codes, so "Âu" (Â = U+00C2) and "Đỗ" (Đ = U+0110) land after "Trần". A <code>Collator</code> for Vietnamese (<code>new Locale("vi", "VN")</code>, available in JDK 8) gives the dictionary order: Âu, Đỗ, Lê, Nguyễn, Trần.</li>
</ul>
</details>
<div class="pitfall">Until Windows 10 version 1903 (2019), choosing "UTF-8" in Notepad wrote a BOM; newer Notepad saves UTF-8 without one by default but still offers "UTF-8 with BOM". Files made in Excel ("CSV UTF-8") also start with a BOM. Strip it whenever line 1 matters.</div>`,
    `<h3>🧪 Bài 3 — Báo cáo tiếng Việt: đếm sinh viên theo họ (~25 phút)</h3>
<p><code>names.txt</code> chứa mỗi dòng một họ tên, được Notepad lưu dạng "UTF-8 with BOM". Đếm số sinh viên của từng họ (từ đầu tiên) và ghi <code>report.txt</code> bằng UTF-8, các họ theo thứ tự chữ cái <strong>tiếng Việt</strong>. Hãy thử cách hiển nhiên trước rồi nhìn các con số đếm được.</p>
<details><summary>Lời giải và hai cái bẫy (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">static List&lt;String&gt; docDong(String name, boolean boBom) throws IOException {
    List&lt;String&gt; lines = new ArrayList&lt;String&gt;();
    try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(name), "UTF-8"))) {
        String s;
        while ((s = br.readLine()) != null) {
            if (boBom &amp;&amp; lines.isEmpty() &amp;&amp; s.startsWith("\\uFEFF")) s = s.substring(1);   // Java KHÔNG tự bỏ BOM giúp bạn
            if (!s.trim().isEmpty()) lines.add(s);
        }
    }
    return lines;
}
static Map&lt;String, Integer&gt; dem(List&lt;String&gt; lines) {
    Map&lt;String, Integer&gt; m = new TreeMap&lt;String, Integer&gt;();
    for (String s : lines) {
        String h = s.trim().split("\\\\s+")[0];                                // họ là từ đầu tiên
        Integer c = m.get(h);
        m.put(h, c == null ? 1 : c + 1);
    }
    return m;
}</code></pre>
<pre class="trich"><code class="language-java">Map&lt;String, Integer&gt; counts = dem(docDong("names.txt", true));
System.out.println(counts);</code></pre>
<pre class="trich"><code class="language-java">List&lt;String&gt; ho = new ArrayList&lt;String&gt;(counts.keySet());
Collator vi = Collator.getInstance(new Locale("vi", "VN"));             // thứ tự chữ cái tiếng Việt
Collections.sort(ho, vi);
System.out.println("String order : " + counts.keySet());
System.out.println("Collator(vi) : " + ho);</code></pre>
<pre class="trich"><code class="language-java">try (PrintWriter pw = new PrintWriter(new OutputStreamWriter(new FileOutputStream("report.txt"), "UTF-8"))) {
    pw.println("FAMILY NAME REPORT");
    for (String h : ho) pw.printf("%-8s %d%n", h, counts.get(h));
}
System.out.println("== report.txt (" + new File("report.txt").length() + " bytes, UTF-8) ==");
for (String s : docDong("report.txt", true)) System.out.println(s);</code></pre>
<div class="out">== attempt 1: read as UTF-8, count with a TreeMap ==<br>
{Lê=1, Nguyễn=2, Trần=2, Âu=1, Đỗ=1, \\uFEFFNguyễn=1}<br>
== attempt 2: drop the BOM ==<br>
{Lê=1, Nguyễn=3, Trần=2, Âu=1, Đỗ=1}<br>
String order : [Lê, Nguyễn, Trần, Âu, Đỗ]<br>
Collator(vi) : [Âu, Đỗ, Lê, Nguyễn, Trần]<br>
== report.txt (83 bytes, UTF-8) ==<br>
FAMILY NAME REPORT<br>
Âu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Đỗ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Lê &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Nguyễn &nbsp;&nbsp;3<br>
Trần &nbsp;&nbsp;&nbsp;&nbsp;2</div>
<ul>
<li><strong>BOM</strong> (byte-order mark — dấu thứ tự byte, các byte <code>EF BB BF</code> = ký tự vô hình U+FEFF) là "ký tự" đầu tiên của file. Bộ đọc UTF-8 của Java giữ nguyên nó, nên họ của tên đầu tiên thành <code>⟨BOM⟩Nguyễn</code> — một khoá khác với <code>Nguyễn</code>: lần thử 1 đếm 2 + 1 thay vì 3. Cũng chính BOM đó làm <code>parseInt</code> hỏng ở dòng đầu của một file số. Hãy bỏ nó khỏi dòng đầu tiên.</li>
<li><strong>Thứ tự</strong>: <code>TreeMap&lt;String, …&gt;</code> sắp theo mã ký tự, nên "Âu" (Â = U+00C2) và "Đỗ" (Đ = U+0110) rơi xuống sau "Trần". Một <code>Collator</code> tiếng Việt (<code>new Locale("vi", "VN")</code>, có sẵn trên JDK 8) cho thứ tự như từ điển: Âu, Đỗ, Lê, Nguyễn, Trần.</li>
</ul>
</details>
<div class="pitfall">Trước Windows 10 bản 1903 (2019), chọn "UTF-8" trong Notepad là ghi kèm BOM; Notepad mới mặc định lưu UTF-8 không BOM nhưng vẫn có lựa chọn "UTF-8 with BOM". File làm bằng Excel ("CSV UTF-8") cũng bắt đầu bằng BOM. Hãy bỏ nó mỗi khi dòng 1 có ý nghĩa.</div>`),
    bi(`<h3>🧪 Exercise 4 — Give the school's Banking sample a memory (~30 min)</h3>
<p>The school's project <code>tai-lieu/banking</code> (model <code>Account</code>, <code>Bank</code>) keeps accounts only in memory; account numbers come from <code>private static int accNum = 1000</code> and <code>accNo = ++accNum</code> in the constructor. Make <code>Bank</code> save its account list to <code>bank.dat</code> and load it at the next start. Then start the program a second time and create a new account. What number does it get?</p>
<details><summary>Solution — each run is a NEW JVM (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Account implements Serializable {
    private static final long serialVersionUID = 1L;
    private static int accNum = 1000;                      // as in the school's model.Account: NOT saved
    private final int accNo;
    private final String accName;
    private double balance;

    Account(String accName, double balance) {
        this.accNo = ++accNum;                             // the next number comes from the static counter
        this.accName = accName;
        this.balance = balance;
    }
    int getAccNo() { return accNo; }
    static void dongBoBoDem(int maxAccNo) { if (maxAccNo &gt; accNum) accNum = maxAccNo; }   // the fix
    @Override public String toString() { return accNo + " " + accName + " " + balance; }
}</code></pre>
<pre class="trich"><code class="language-java">class Bank {
    private ArrayList&lt;Account&gt; aList = new ArrayList&lt;Account&gt;();

    void createAccount(String name, double balance) { aList.add(new Account(name, balance)); }
    List&lt;Account&gt; getAccounts() { return aList; }

    void save(String fileName) throws IOException {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(fileName))) {
            out.writeObject(aList);                        // ONE object: the whole list
        }
    }
    @SuppressWarnings("unchecked")
    void load(String fileName, boolean sua) throws IOException, ClassNotFoundException {
        File f = new File(fileName);
        if (!f.exists()) return;
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(f))) {
            aList = (ArrayList&lt;Account&gt;) in.readObject();
        }
        if (sua) {
            int max = 0;
            for (Account a : aList) max = Math.max(max, a.getAccNo());
            Account.dongBoBoDem(max);                      // continue numbering after the largest saved number
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    if (args.length == 0) {                            // the driver: start the program three times, each in a fresh JVM
        chay("lan1");
        chay("lan2-loi");
        chay("lan2-sua");
        return;
    }
    Bank bank = new Bank();
    bank.load("bank.dat", args[0].equals("lan2-sua"));
    System.out.println("loaded: " + bank.getAccounts());
    if (args[0].equals("lan1")) {
        bank.createAccount("An", 500);
        bank.createAccount("Binh", 300);
        bank.save("bank.dat");
        System.out.println("saved : " + bank.getAccounts());
    } else {
        bank.createAccount("Chi", 200);
        System.out.println("after creating Chi: " + bank.getAccounts());
    }
}</code></pre>
<div class="out">&gt; java LuuNganHang lan1<br>
&nbsp;&nbsp;loaded: []<br>
&nbsp;&nbsp;saved : [1001 An 500.0, 1002 Binh 300.0]<br>
&gt; java LuuNganHang lan2-loi<br>
&nbsp;&nbsp;loaded: [1001 An 500.0, 1002 Binh 300.0]<br>
&nbsp;&nbsp;after creating Chi: [1001 An 500.0, 1002 Binh 300.0, 1001 Chi 200.0]<br>
&gt; java LuuNganHang lan2-sua<br>
&nbsp;&nbsp;loaded: [1001 An 500.0, 1002 Binh 300.0]<br>
&nbsp;&nbsp;after creating Chi: [1001 An 500.0, 1002 Binh 300.0, 1003 Chi 200.0]</div>
<p>Run 2 without the fix gives Chi the number <strong>1001 — the same as An</strong>. The accounts came back from the file, but <code>accNum</code> is <code>static</code>: it belongs to the class, is never serialized (lesson 9.C, slide 48), and restarts at 1000 in every new JVM. After loading, the fix sets the counter to the largest saved number, so Chi gets 1003. Inside one JVM you would never see the bug — that is why the driver starts a fresh <code>java</code> process for each run.</p>
</details>
<div class="pitfall">Rule: after deserializing, <strong>rebuild every piece of state that lives in static fields</strong> (counters, caches, "next id"). The same bug appears in LAB211 with auto-numbered codes loaded from a text file. ➕ A database does this for you (auto-increment / sequences) — one reason PRJ301 moves data to SQL Server.</div>`,
    `<h3>🧪 Bài 4 — Cho project Banking mẫu của trường một trí nhớ (~30 phút)</h3>
<p>Project của trường <code>tai-lieu/banking</code> (model <code>Account</code>, <code>Bank</code>) chỉ giữ tài khoản trong bộ nhớ; số tài khoản lấy từ <code>private static int accNum = 1000</code> và <code>accNo = ++accNum</code> trong hàm tạo. Hãy cho <code>Bank</code> lưu danh sách tài khoản ra <code>bank.dat</code> và nạp lại ở lần mở sau. Rồi mở chương trình lần thứ hai và tạo một tài khoản mới. Nó nhận số nào?</p>
<details><summary>Lời giải — mỗi lần chạy là một JVM MỚI (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Account implements Serializable {
    private static final long serialVersionUID = 1L;
    private static int accNum = 1000;                      // như model.Account của trường: KHÔNG được lưu
    private final int accNo;
    private final String accName;
    private double balance;

    Account(String accName, double balance) {
        this.accNo = ++accNum;                             // số tiếp theo lấy từ bộ đếm static
        this.accName = accName;
        this.balance = balance;
    }
    int getAccNo() { return accNo; }
    static void dongBoBoDem(int maxAccNo) { if (maxAccNo &gt; accNum) accNum = maxAccNo; }   // cách sửa
    @Override public String toString() { return accNo + " " + accName + " " + balance; }
}</code></pre>
<pre class="trich"><code class="language-java">class Bank {
    private ArrayList&lt;Account&gt; aList = new ArrayList&lt;Account&gt;();

    void createAccount(String name, double balance) { aList.add(new Account(name, balance)); }
    List&lt;Account&gt; getAccounts() { return aList; }

    void save(String fileName) throws IOException {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(fileName))) {
            out.writeObject(aList);                        // MỘT đối tượng: cả danh sách
        }
    }
    @SuppressWarnings("unchecked")
    void load(String fileName, boolean sua) throws IOException, ClassNotFoundException {
        File f = new File(fileName);
        if (!f.exists()) return;
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(f))) {
            aList = (ArrayList&lt;Account&gt;) in.readObject();
        }
        if (sua) {
            int max = 0;
            for (Account a : aList) max = Math.max(max, a.getAccNo());
            Account.dongBoBoDem(max);                      // đánh số tiếp sau số lớn nhất đã lưu
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    if (args.length == 0) {                            // phần điều khiển: chạy chương trình ba lần, mỗi lần một JVM mới
        chay("lan1");
        chay("lan2-loi");
        chay("lan2-sua");
        return;
    }
    Bank bank = new Bank();
    bank.load("bank.dat", args[0].equals("lan2-sua"));
    System.out.println("loaded: " + bank.getAccounts());
    if (args[0].equals("lan1")) {
        bank.createAccount("An", 500);
        bank.createAccount("Binh", 300);
        bank.save("bank.dat");
        System.out.println("saved : " + bank.getAccounts());
    } else {
        bank.createAccount("Chi", 200);
        System.out.println("after creating Chi: " + bank.getAccounts());
    }
}</code></pre>
<div class="out">&gt; java LuuNganHang lan1<br>
&nbsp;&nbsp;loaded: []<br>
&nbsp;&nbsp;saved : [1001 An 500.0, 1002 Binh 300.0]<br>
&gt; java LuuNganHang lan2-loi<br>
&nbsp;&nbsp;loaded: [1001 An 500.0, 1002 Binh 300.0]<br>
&nbsp;&nbsp;after creating Chi: [1001 An 500.0, 1002 Binh 300.0, 1001 Chi 200.0]<br>
&gt; java LuuNganHang lan2-sua<br>
&nbsp;&nbsp;loaded: [1001 An 500.0, 1002 Binh 300.0]<br>
&nbsp;&nbsp;after creating Chi: [1001 An 500.0, 1002 Binh 300.0, 1003 Chi 200.0]</div>
<p>Lần chạy 2 khi chưa sửa cho Chi số <strong>1001 — trùng với An</strong>. Các tài khoản đã về từ file, nhưng <code>accNum</code> là <code>static</code>: nó thuộc về lớp, không bao giờ được tuần tự hoá (bài 9.C, slide 48), và bắt đầu lại từ 1000 ở mỗi JVM mới. Sau khi nạp, cách sửa đặt bộ đếm bằng số lớn nhất đã lưu, nên Chi nhận 1003. Trong cùng một JVM bạn sẽ không bao giờ thấy lỗi này — vì thế phần điều khiển khởi động một tiến trình <code>java</code> mới cho mỗi lần chạy.</p>
</details>
<div class="pitfall">Luật: sau khi giải tuần tự hoá, <strong>dựng lại mọi trạng thái nằm trong trường static</strong> (bộ đếm, bộ nhớ đệm, "id kế tiếp"). Cùng lỗi này xuất hiện trong LAB211 với mã tự đánh số nạp từ file văn bản. ➕ Cơ sở dữ liệu làm việc đó giúp bạn (auto-increment / sequence) — một lý do PRJ301 chuyển dữ liệu sang SQL Server.</div>`),
    bi(`<h3>🧪 Exercise 5 — Fixed-length records with RandomAccessFile (~30 min)</h3>
<p>Store products as records of <strong>exactly 24 bytes</strong>: a 6-character code (<code>writeChars</code>, 12 bytes), a <code>double</code> price (8) and an <code>int</code> quantity (4). Write four products, read record 2 without reading the others, sell 2 units of record 1 by rewriting only its quantity, and delete record 0 without rewriting the whole file.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5972396dcdced1711593ea73fe52996a169539e5.svg" alt="Exercise 5: the layout — record n at n × 24, each field at a fixed offset inside it" loading="lazy" /><p class="chu-thich">🧩 Exercise 5: the layout — record n at n × 24, each field at a fixed offset inside it</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — products.dat: every record is 24 bytes, so record n starts at byte n * 24
rectangle "record 0  (bytes 0–23)" as R0 #EEF2FF
rectangle "record 1  (bytes 24–47)" as R1 #EEF2FF
rectangle "record 2  (bytes 48–71)" as R2 #EEF2FF
rectangle "record 3  (bytes 72–95)" as R3 #EEF2FF
rectangle "code: writeChars, 6 chars\\n12 bytes (offset 0)" as C #ECFDF5
rectangle "price: writeDouble\\n8 bytes (offset 12)" as P #ECFDF5
rectangle "qty: writeInt\\n4 bytes (offset 20)" as Q #ECFDF5
R0 -right-&gt; R1
R1 -right-&gt; R2
R2 -right-&gt; R3
R1 -down-&gt; C : inside one record
C -right-&gt; P
P -right-&gt; Q
note bottom of Q
  qty of record 1:
  seek(1 * 24 + 20) → readInt / writeInt
end note
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">static final int CODE_LEN = 6;                         // code: always 6 chars = 12 bytes (writeChar = 2 bytes)
static final int SIZE = CODE_LEN * 2 + 8 + 4;          // + double price (8) + int qty (4) = 24 bytes

static void ghi(RandomAccessFile f, int n, String code, double price, int qty) throws IOException {
    f.seek((long) n * SIZE);
    String fixed = (code + "      ").substring(0, CODE_LEN);   // pad or cut to exactly 6 chars
    f.writeChars(fixed);
    f.writeDouble(price);
    f.writeInt(qty);
}
static String doc(RandomAccessFile f, int n) throws IOException {
    f.seek((long) n * SIZE);
    StringBuilder code = new StringBuilder();
    for (int i = 0; i &lt; CODE_LEN; i++) code.append(f.readChar());
    double price = f.readDouble();
    int qty = f.readInt();
    return "#" + n + " " + code.toString().trim() + " " + price + " x" + qty;
}
static int dem(RandomAccessFile f) throws IOException { return (int) (f.length() / SIZE); }</code></pre>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile("products.dat", "rw")) {
    f.setLength(0);                                // start from an empty file
    ghi(f, 0, "P01", 12.5, 10);
    ghi(f, 1, "P02", 99.0, 3);
    ghi(f, 2, "P03", 7.25, 40);
    ghi(f, 3, "P04", 150.0, 1);
    System.out.println("file " + f.length() + " bytes = " + dem(f) + " records of " + SIZE);
    System.out.println("read record 2 directly: " + doc(f, 2));
    // sell 2 of P02: rewrite ONLY its qty — byte 1*24 + 12 + 8
    f.seek(1 * SIZE + CODE_LEN * 2 + 8);
    int qty = f.readInt();
    f.seek(1 * SIZE + CODE_LEN * 2 + 8);
    f.writeInt(qty - 2);
    System.out.println("after selling 2 of P02: " + doc(f, 1));
    // delete record 0: move the LAST record into its place, then cut the file
    byte[] last = new byte[SIZE];
    f.seek((long) (dem(f) - 1) * SIZE);
    f.readFully(last);
    f.seek(0);
    f.write(last);
    f.setLength((long) (dem(f) - 1) * SIZE);
    System.out.println("after deleting P01 (" + f.length() + " bytes):");
    for (int i = 0; i &lt; dem(f); i++) System.out.println("  " + doc(f, i));
}</code></pre>
<div class="out">file 96 bytes = 4 records of 24<br>
read record 2 directly: #2 P03 7.25 x40<br>
after selling 2 of P02: #1 P02 99.0 x1<br>
after deleting P01 (72 bytes):<br>
&nbsp;&nbsp;#0 P04 150.0 x1<br>
&nbsp;&nbsp;#1 P02 99.0 x1<br>
&nbsp;&nbsp;#2 P03 7.25 x40</div>
<p>Every position is arithmetic: record 1's quantity is at 1 × 24 + 12 + 8 = byte 44, so selling touches 4 bytes of a 96-byte file. The code is padded to exactly 6 characters — a longer code would be cut, which is the price of fixed length. Deleting moves the <em>last</em> record into the hole and shortens the file with <code>setLength</code>: two record writes instead of shifting everything (the order of records changes, which is fine for an unordered file).</p>
</details>
<div class="callout">🧭 <strong>Go further — CSD201 / databases</strong>: with records sorted by code you could binary-search the file with <code>seek</code> — O(log n) disk reads; a database index is that idea grown up. FE asks the RandomAccessFile facts: <code>getFilePointer()</code>, <code>seek()</code>, modes r/rw/rws/rwd.</div>`,
    `<h3>🧪 Bài 5 — Bản ghi dài cố định với RandomAccessFile (~30 phút)</h3>
<p>Lưu sản phẩm thành các bản ghi <strong>đúng 24 byte</strong>: mã 6 ký tự (<code>writeChars</code>, 12 byte), giá <code>double</code> (8) và số lượng <code>int</code> (4). Ghi bốn sản phẩm, đọc bản ghi 2 mà không đọc các bản khác, bán 2 cái của bản ghi 1 bằng cách chỉ ghi lại số lượng của nó, và xoá bản ghi 0 mà không ghi lại cả file.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5972396dcdced1711593ea73fe52996a169539e5.svg" alt="Bài 5: bố cục — bản ghi n ở vị trí n × 24, mỗi trường ở một khoảng lệch cố định bên trong" loading="lazy" /><p class="chu-thich">🧩 Bài 5: bố cục — bản ghi n ở vị trí n × 24, mỗi trường ở một khoảng lệch cố định bên trong</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — products.dat: every record is 24 bytes, so record n starts at byte n * 24
rectangle "record 0  (bytes 0–23)" as R0 #EEF2FF
rectangle "record 1  (bytes 24–47)" as R1 #EEF2FF
rectangle "record 2  (bytes 48–71)" as R2 #EEF2FF
rectangle "record 3  (bytes 72–95)" as R3 #EEF2FF
rectangle "code: writeChars, 6 chars\\n12 bytes (offset 0)" as C #ECFDF5
rectangle "price: writeDouble\\n8 bytes (offset 12)" as P #ECFDF5
rectangle "qty: writeInt\\n4 bytes (offset 20)" as Q #ECFDF5
R0 -right-&gt; R1
R1 -right-&gt; R2
R2 -right-&gt; R3
R1 -down-&gt; C : inside one record
C -right-&gt; P
P -right-&gt; Q
note bottom of Q
  qty of record 1:
  seek(1 * 24 + 20) → readInt / writeInt
end note
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">static final int CODE_LEN = 6;                         // mã: luôn 6 ký tự = 12 byte
static final int SIZE = CODE_LEN * 2 + 8 + 4;          // + giá double (8) + số lượng int (4) = 24 byte

static void ghi(RandomAccessFile f, int n, String code, double price, int qty) throws IOException {
    f.seek((long) n * SIZE);
    String fixed = (code + "      ").substring(0, CODE_LEN);   // đệm hoặc cắt cho đúng 6 ký tự
    f.writeChars(fixed);
    f.writeDouble(price);
    f.writeInt(qty);
}
static String doc(RandomAccessFile f, int n) throws IOException {
    f.seek((long) n * SIZE);
    StringBuilder code = new StringBuilder();
    for (int i = 0; i &lt; CODE_LEN; i++) code.append(f.readChar());
    double price = f.readDouble();
    int qty = f.readInt();
    return "#" + n + " " + code.toString().trim() + " " + price + " x" + qty;
}
static int dem(RandomAccessFile f) throws IOException { return (int) (f.length() / SIZE); }</code></pre>
<pre class="trich"><code class="language-java">try (RandomAccessFile f = new RandomAccessFile("products.dat", "rw")) {
    f.setLength(0);                                // bắt đầu từ file rỗng
    ghi(f, 0, "P01", 12.5, 10);
    ghi(f, 1, "P02", 99.0, 3);
    ghi(f, 2, "P03", 7.25, 40);
    ghi(f, 3, "P04", 150.0, 1);
    System.out.println("file " + f.length() + " bytes = " + dem(f) + " records of " + SIZE);
    System.out.println("read record 2 directly: " + doc(f, 2));
    // bán 2 cái P02: chỉ ghi lại số lượng — byte 1*24 + 12 + 8
    f.seek(1 * SIZE + CODE_LEN * 2 + 8);
    int qty = f.readInt();
    f.seek(1 * SIZE + CODE_LEN * 2 + 8);
    f.writeInt(qty - 2);
    System.out.println("after selling 2 of P02: " + doc(f, 1));
    // xoá bản ghi 0: chuyển bản ghi CUỐI vào chỗ nó, rồi cắt file
    byte[] last = new byte[SIZE];
    f.seek((long) (dem(f) - 1) * SIZE);
    f.readFully(last);
    f.seek(0);
    f.write(last);
    f.setLength((long) (dem(f) - 1) * SIZE);
    System.out.println("after deleting P01 (" + f.length() + " bytes):");
    for (int i = 0; i &lt; dem(f); i++) System.out.println("  " + doc(f, i));
}</code></pre>
<div class="out">file 96 bytes = 4 records of 24<br>
read record 2 directly: #2 P03 7.25 x40<br>
after selling 2 of P02: #1 P02 99.0 x1<br>
after deleting P01 (72 bytes):<br>
&nbsp;&nbsp;#0 P04 150.0 x1<br>
&nbsp;&nbsp;#1 P02 99.0 x1<br>
&nbsp;&nbsp;#2 P03 7.25 x40</div>
<p>Mọi vị trí đều là phép tính: số lượng của bản ghi 1 ở byte 1 × 24 + 12 + 8 = 44, nên việc bán chỉ chạm 4 byte của một file 96 byte. Mã được đệm cho đúng 6 ký tự — mã dài hơn sẽ bị cắt, đó là cái giá của độ dài cố định. Xoá thì chuyển bản ghi <em>cuối</em> vào chỗ trống rồi rút ngắn file bằng <code>setLength</code>: hai lần ghi bản ghi thay vì dời tất cả (thứ tự bản ghi thay đổi, không sao với một file không cần thứ tự).</p>
</details>
<div class="callout">🧭 <strong>Đi tiếp — CSD201 / cơ sở dữ liệu</strong>: nếu bản ghi được sắp theo mã, bạn tìm kiếm nhị phân được ngay trên file bằng <code>seek</code> — O(log n) lần đọc đĩa; chỉ mục (index) của cơ sở dữ liệu là ý tưởng đó khi trưởng thành. FE hỏi các sự thật về RandomAccessFile: <code>getFilePointer()</code>, <code>seek()</code>, các chế độ r/rw/rws/rwd.</div>`),
    bi(`<h3>🧪 Exercise 6 — Name the rule behind seven real compile errors (~15 min)</h3>
<p>Each line breaks one rule of Chapter 9 (several come from modern tutorials that the exam JDK does not support). Read the real JDK 8 message and say which rule and how to fix it.</p>
<details><summary>The lines and the real errors (javac 8)</summary>
<pre class="trich"><code class="language-java">static final String[][] LOI = {
    { "E1", "String line; while ((line = br.readLine()) != -1) System.out.println(line);" },
    { "E2", "String s = br.readline();" },
    { "E3", "String all = java.nio.file.Files.readString(java.nio.file.Paths.get(\\"a.txt\\"));" },
    { "E4", "java.nio.file.Path p = java.nio.file.Path.of(\\"a.txt\\");" },
    { "E5", "DataInputStream in = new DataInputStream(\\"a.dat\\");" },
    { "E6", "try (File f = new File(\\"a.txt\\")) { System.out.println(f.length()); }" },
    { "E7", "ObjectInputStream in = new ObjectInputStream(new FileInputStream(\\"b.dat\\")); Book b = in.readObject();" },
};</code></pre>
<div class="out">&gt; javac E1.java<br>
E1.java:4: error: incomparable types: String and int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String line; while ((line = br.readLine()) != -1) System.out.println(line);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
&gt; javac E2.java<br>
E2.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String s = br.readline();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method readline()<br>
&nbsp;&nbsp;location: variable br of type BufferedReader<br>
1 error<br>
(exit code 1)<br>
&gt; javac E3.java<br>
E3.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String all = java.nio.file.Files.readString(java.nio.file.Paths.get("a.txt"));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method readString(Path)<br>
&nbsp;&nbsp;location: class Files<br>
1 error<br>
(exit code 1)<br>
&gt; javac E4.java<br>
E4.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;java.nio.file.Path p = java.nio.file.Path.of("a.txt");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String)<br>
&nbsp;&nbsp;location: interface Path<br>
1 error<br>
(exit code 1)<br>
&gt; javac E5.java<br>
E5.java:4: error: incompatible types: String cannot be converted to InputStream<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DataInputStream in = new DataInputStream("a.dat");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Note: Some messages have been simplified; recompile with -Xdiags:verbose to get full output<br>
1 error<br>
(exit code 1)<br>
&gt; javac E6.java<br>
E6.java:4: error: incompatible types: try-with-resources not applicable to variable type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;try (File f = new File("a.txt")) { System.out.println(f.length()); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;(File cannot be converted to AutoCloseable)<br>
1 error<br>
(exit code 1)<br>
&gt; javac E7.java<br>
E7.java:4: error: incompatible types: Object cannot be converted to Book<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ObjectInputStream in = new ObjectInputStream(new FileInputStream("b.dat")); Book b = in.readObject();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
</details>
<details><summary>Answers</summary>
<ol>
<li><strong>E1</strong> — <code>readLine()</code> returns a <code>String</code>; its end-of-file value is <code>null</code>, not -1 (that is <code>read()</code>): <code>!= null</code>.</li>
<li><strong>E2</strong> — Java is case-sensitive: <code>readLine</code> (slide 34 of the deck has the same typo).</li>
<li><strong>E3</strong> — <code>Files.readString</code> is Java 11. On JDK 8: <code>new String(Files.readAllBytes(path), StandardCharsets.UTF_8)</code> or <code>Files.readAllLines(path, StandardCharsets.UTF_8)</code>.</li>
<li><strong>E4</strong> — <code>Path.of</code> is Java 11: use <code>Paths.get("a.txt")</code>.</li>
<li><strong>E5</strong> — a filter stream wraps another stream, not a file name: <code>new DataInputStream(new FileInputStream("a.dat"))</code>.</li>
<li><strong>E6</strong> — only <code>AutoCloseable</code> objects go in <code>try ( … )</code>; a <code>File</code> is just a name and opens nothing. Put the stream there.</li>
<li><strong>E7</strong> — <code>readObject()</code> returns <code>Object</code>: cast it, <code>Book b = (Book) in.readObject();</code> (and handle <code>ClassNotFoundException</code>).</li>
</ol>
</details>`,
    `<h3>🧪 Bài 6 — Gọi tên luật đứng sau bảy lỗi biên dịch thật (~15 phút)</h3>
<p>Mỗi dòng phạm một luật của Chương 9 (vài dòng đến từ bài hướng dẫn hiện đại mà JDK phòng thi không hỗ trợ). Đọc thông báo thật của JDK 8 và nói luật nào bị phạm, sửa thế nào.</p>
<details><summary>Các dòng code và lỗi thật (javac 8)</summary>
<pre class="trich"><code class="language-java">static final String[][] LOI = {
    { "E1", "String line; while ((line = br.readLine()) != -1) System.out.println(line);" },
    { "E2", "String s = br.readline();" },
    { "E3", "String all = java.nio.file.Files.readString(java.nio.file.Paths.get(\\"a.txt\\"));" },
    { "E4", "java.nio.file.Path p = java.nio.file.Path.of(\\"a.txt\\");" },
    { "E5", "DataInputStream in = new DataInputStream(\\"a.dat\\");" },
    { "E6", "try (File f = new File(\\"a.txt\\")) { System.out.println(f.length()); }" },
    { "E7", "ObjectInputStream in = new ObjectInputStream(new FileInputStream(\\"b.dat\\")); Book b = in.readObject();" },
};</code></pre>
<div class="out">&gt; javac E1.java<br>
E1.java:4: error: incomparable types: String and int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String line; while ((line = br.readLine()) != -1) System.out.println(line);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
&gt; javac E2.java<br>
E2.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String s = br.readline();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method readline()<br>
&nbsp;&nbsp;location: variable br of type BufferedReader<br>
1 error<br>
(exit code 1)<br>
&gt; javac E3.java<br>
E3.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;String all = java.nio.file.Files.readString(java.nio.file.Paths.get("a.txt"));<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method readString(Path)<br>
&nbsp;&nbsp;location: class Files<br>
1 error<br>
(exit code 1)<br>
&gt; javac E4.java<br>
E4.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;java.nio.file.Path p = java.nio.file.Path.of("a.txt");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String)<br>
&nbsp;&nbsp;location: interface Path<br>
1 error<br>
(exit code 1)<br>
&gt; javac E5.java<br>
E5.java:4: error: incompatible types: String cannot be converted to InputStream<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DataInputStream in = new DataInputStream("a.dat");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Note: Some messages have been simplified; recompile with -Xdiags:verbose to get full output<br>
1 error<br>
(exit code 1)<br>
&gt; javac E6.java<br>
E6.java:4: error: incompatible types: try-with-resources not applicable to variable type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;try (File f = new File("a.txt")) { System.out.println(f.length()); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;(File cannot be converted to AutoCloseable)<br>
1 error<br>
(exit code 1)<br>
&gt; javac E7.java<br>
E7.java:4: error: incompatible types: Object cannot be converted to Book<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ObjectInputStream in = new ObjectInputStream(new FileInputStream("b.dat")); Book b = in.readObject();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
</details>
<details><summary>Đáp án</summary>
<ol>
<li><strong>E1</strong> — <code>readLine()</code> trả về <code>String</code>; giá trị báo hết file của nó là <code>null</code>, không phải -1 (đó là của <code>read()</code>): <code>!= null</code>.</li>
<li><strong>E2</strong> — Java phân biệt hoa thường: <code>readLine</code> (slide 34 của bộ slide gõ nhầm y hệt).</li>
<li><strong>E3</strong> — <code>Files.readString</code> là Java 11. Trên JDK 8: <code>new String(Files.readAllBytes(path), StandardCharsets.UTF_8)</code> hoặc <code>Files.readAllLines(path, StandardCharsets.UTF_8)</code>.</li>
<li><strong>E4</strong> — <code>Path.of</code> là Java 11: dùng <code>Paths.get("a.txt")</code>.</li>
<li><strong>E5</strong> — luồng lọc bọc một luồng khác, không bọc tên file: <code>new DataInputStream(new FileInputStream("a.dat"))</code>.</li>
<li><strong>E6</strong> — chỉ đối tượng <code>AutoCloseable</code> mới đặt được trong <code>try ( … )</code>; <code>File</code> chỉ là một cái tên, không mở gì cả. Hãy đặt luồng vào đó.</li>
<li><strong>E7</strong> — <code>readObject()</code> trả về <code>Object</code>: phải ép kiểu, <code>Book b = (Book) in.readObject();</code> (và xử lý <code>ClassNotFoundException</code>).</li>
</ol>
</details>`),
    bi(`<h3>🧪 Exercise 7 — Predict six outputs (~15 min)</h3>
<p>Write down what each method prints, then open the answer. All six are real FE shapes.</p>
<pre class="trich"><code class="language-java">static void q1() throws IOException {
    try (FileWriter fw = new FileWriter("test.txt")) { fw.write("Hello\\nXin chao\\nHallo\\nAnyong Haseyo\\n"); }
    String line = "";
    try (BufferedReader bf = new BufferedReader(new FileReader("test.txt"))) {
        for (int i = 0; i &lt; 2; i++) line = bf.readLine();
    }
    System.out.println("Q1: " + line);
}</code></pre>
<pre class="trich"><code class="language-java">static void q2() throws IOException {
    try (FileWriter fw = new FileWriter("q2.txt")) { fw.write("A"); }
    try (FileWriter fw = new FileWriter("q2.txt")) { fw.write("B"); }
    try (FileWriter fw = new FileWriter("q2.txt", true)) { fw.write("C"); }
    try (BufferedReader br = new BufferedReader(new FileReader("q2.txt"))) { System.out.println("Q2: " + br.readLine()); }
}</code></pre>
<pre class="trich"><code class="language-java">static void q3() throws IOException {
    try (RandomAccessFile f = new RandomAccessFile("q3.dat", "rw")) {
        f.writeInt(8);
        f.writeChar('a');
    }
    System.out.println("Q3: " + new File("q3.dat").length());
}</code></pre>
<pre class="trich"><code class="language-java">static void q4() throws IOException {
    try (DataOutputStream out = new DataOutputStream(new FileOutputStream("q4.dat"))) {
        out.writeUTF("Hà");
        out.writeInt(1);
        System.out.println("Q4: " + out.size());
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void q5() throws Exception {
    try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("q5.dat"))) { out.writeObject(new Diem()); }
    try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("q5.dat"))) {
        Diem d = (Diem) in.readObject();
        System.out.println("Q5: " + d.x + " " + d.y);
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void q6() throws IOException {
    try (FileOutputStream os = new FileOutputStream("q6.bin")) { os.write(300); }
    try (FileInputStream is = new FileInputStream("q6.bin")) { System.out.println("Q6: " + is.read() + " " + is.read()); }
}</code></pre>
<p>(<code>Diem</code> is <code>class Diem implements Serializable { transient int x = 5; int y = 7; }</code>.)</p>
<details><summary>Real output and explanations</summary>
<div class="out">Q1: Xin chao<br>
Q2: BC<br>
Q3: 6<br>
Q4: 9<br>
Q5: 0 7<br>
Q6: 44 -1</div>
<ol>
<li><strong>Q1</strong> — each <code>readLine()</code> returns the next line; after two calls <code>line</code> holds line 2 (FE4, FE10).</li>
<li><strong>Q2</strong> — the second <code>FileWriter</code> emptied the file ("A" gone), the third appended: "BC".</li>
<li><strong>Q3</strong> — <code>writeInt</code> 4 bytes + <code>writeChar</code> 2 bytes = 6 (FE13).</li>
<li><strong>Q4</strong> — <code>writeUTF("Hà")</code> = 2 (length) + 1 + 2 = 5, plus 4 for the int = 9.</li>
<li><strong>Q5</strong> — <code>x</code> is transient: not written, and on reading it gets the default 0 — the initializer <code>= 5</code> does not run, because deserialization does not call the constructor. <code>y</code> = 7 was saved.</li>
<li><strong>Q6</strong> — only the low byte of 300 is written (300 − 256 = 44); the second <code>read()</code> is the end: -1.</li>
</ol>
</details>`,
    `<h3>🧪 Bài 7 — Đoán sáu output (~15 phút)</h3>
<p>Viết ra mỗi phương thức in gì, rồi mới mở đáp án. Cả sáu đều là dạng câu FE thật.</p>
<pre class="trich"><code class="language-java">static void q1() throws IOException {
    try (FileWriter fw = new FileWriter("test.txt")) { fw.write("Hello\\nXin chao\\nHallo\\nAnyong Haseyo\\n"); }
    String line = "";
    try (BufferedReader bf = new BufferedReader(new FileReader("test.txt"))) {
        for (int i = 0; i &lt; 2; i++) line = bf.readLine();
    }
    System.out.println("Q1: " + line);
}</code></pre>
<pre class="trich"><code class="language-java">static void q2() throws IOException {
    try (FileWriter fw = new FileWriter("q2.txt")) { fw.write("A"); }
    try (FileWriter fw = new FileWriter("q2.txt")) { fw.write("B"); }
    try (FileWriter fw = new FileWriter("q2.txt", true)) { fw.write("C"); }
    try (BufferedReader br = new BufferedReader(new FileReader("q2.txt"))) { System.out.println("Q2: " + br.readLine()); }
}</code></pre>
<pre class="trich"><code class="language-java">static void q3() throws IOException {
    try (RandomAccessFile f = new RandomAccessFile("q3.dat", "rw")) {
        f.writeInt(8);
        f.writeChar('a');
    }
    System.out.println("Q3: " + new File("q3.dat").length());
}</code></pre>
<pre class="trich"><code class="language-java">static void q4() throws IOException {
    try (DataOutputStream out = new DataOutputStream(new FileOutputStream("q4.dat"))) {
        out.writeUTF("Hà");
        out.writeInt(1);
        System.out.println("Q4: " + out.size());
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void q5() throws Exception {
    try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("q5.dat"))) { out.writeObject(new Diem()); }
    try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("q5.dat"))) {
        Diem d = (Diem) in.readObject();
        System.out.println("Q5: " + d.x + " " + d.y);
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void q6() throws IOException {
    try (FileOutputStream os = new FileOutputStream("q6.bin")) { os.write(300); }
    try (FileInputStream is = new FileInputStream("q6.bin")) { System.out.println("Q6: " + is.read() + " " + is.read()); }
}</code></pre>
<p>(<code>Diem</code> là <code>class Diem implements Serializable { transient int x = 5; int y = 7; }</code>.)</p>
<details><summary>Output thật và giải thích</summary>
<div class="out">Q1: Xin chao<br>
Q2: BC<br>
Q3: 6<br>
Q4: 9<br>
Q5: 0 7<br>
Q6: 44 -1</div>
<ol>
<li><strong>Q1</strong> — mỗi lần <code>readLine()</code> trả dòng kế tiếp; sau hai lần gọi, <code>line</code> giữ dòng 2 (FE4, FE10).</li>
<li><strong>Q2</strong> — <code>FileWriter</code> thứ hai làm rỗng file ("A" mất), cái thứ ba ghi nối: "BC".</li>
<li><strong>Q3</strong> — <code>writeInt</code> 4 byte + <code>writeChar</code> 2 byte = 6 (FE13).</li>
<li><strong>Q4</strong> — <code>writeUTF("Hà")</code> = 2 (độ dài) + 1 + 2 = 5, cộng 4 cho số int = 9.</li>
<li><strong>Q5</strong> — <code>x</code> là transient: không được ghi, và khi đọc nó nhận giá trị mặc định 0 — phần khởi tạo <code>= 5</code> không chạy, vì giải tuần tự hoá không gọi hàm tạo. <code>y</code> = 7 đã được lưu.</li>
<li><strong>Q6</strong> — chỉ byte thấp của 300 được ghi (300 − 256 = 44); lần <code>read()</code> thứ hai là hết file: -1.</li>
</ol>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>stream</strong></td><td>luồng</td><td>An object that moves data one unit at a time (byte, char, value, object) between a program and a source or destination.</td></tr>
<tr><td><strong>input / output stream</strong></td><td>luồng vào / luồng ra</td><td>Input streams bring data into the program (<code>read</code>), output streams send it out (<code>write</code>).</td></tr>
<tr><td><strong>byte stream / character stream</strong></td><td>luồng byte / luồng ký tự</td><td><code>InputStream</code>/<code>OutputStream</code> move raw bytes; <code>Reader</code>/<code>Writer</code> move chars and need an encoding to touch a file.</td></tr>
<tr><td><strong>encoding / charset</strong></td><td>bảng mã</td><td>The rule that turns characters into bytes and back (UTF-8, windows-1252); a wrong one garbles or loses Vietnamese.</td></tr>
<tr><td><strong>Unicode / code point</strong></td><td>Unicode / điểm mã</td><td>The table that gives every character a number, U+0000 to U+10FFFF ("ế" = U+1EBF).</td></tr>
<tr><td><strong>UTF-8</strong></td><td>UTF-8</td><td>The encoding that stores a code point in 1–4 bytes (ASCII in 1, most Vietnamese letters in 2–3); the default of JDK 18+.</td></tr>
<tr><td><strong>BOM (byte-order mark)</strong></td><td>dấu thứ tự byte</td><td>The invisible U+FEFF (bytes EF BB BF) some editors put at the start of a UTF-8 file; Java keeps it as the first char.</td></tr>
<tr><td><strong>buffer / flush</strong></td><td>bộ đệm / đẩy bộ đệm</td><td>Memory where a stream collects data before the real write; <code>flush()</code>/<code>close()</code> push it to the file.</td></tr>
<tr><td><strong>append mode</strong></td><td>chế độ ghi nối</td><td><code>new FileWriter(name, true)</code>: new data goes after the old content instead of replacing it.</td></tr>
<tr><td><strong>try-with-resources</strong></td><td>try kèm tài nguyên</td><td><code>try (Resource r = …) { }</code> (Java 7): closes every <code>AutoCloseable</code> resource automatically, even after an exception.</td></tr>
<tr><td><strong>checked exception (<code>IOException</code>)</strong></td><td>ngoại lệ được kiểm tra</td><td>An exception the compiler forces you to catch or declare; <code>FileNotFoundException</code> is its subclass.</td></tr>
<tr><td><strong>end of file (EOF)</strong></td><td>hết file</td><td>Signalled by -1 (<code>read</code>), <code>null</code> (<code>readLine</code>) or <code>EOFException</code> (<code>readInt</code>, <code>readObject</code>).</td></tr>
<tr><td><strong>random access / file pointer</strong></td><td>truy cập ngẫu nhiên / con trỏ file</td><td><code>RandomAccessFile</code> can <code>seek(pos)</code> to any byte; the pointer is where the next read or write happens.</td></tr>
<tr><td><strong>filter (wrapper) stream</strong></td><td>luồng lọc (luồng bọc)</td><td>A stream built on another stream that adds a feature: <code>BufferedInputStream</code>, <code>DataOutputStream</code>.</td></tr>
<tr><td><strong>serialization / deserialization</strong></td><td>tuần tự hoá / giải tuần tự hoá</td><td>Turning an object (and the objects it refers to) into bytes with <code>writeObject</code>, and back into a new replica with <code>readObject</code>.</td></tr>
<tr><td><strong><code>transient</code> / <code>serialVersionUID</code></strong></td><td>transient / số phiên bản tuần tự hoá</td><td>A transient field is not saved (comes back as the default value); <code>serialVersionUID</code> fixes the class version so old files stay readable.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>stream</strong></td><td>luồng</td><td>Đối tượng chuyển dữ liệu từng đơn vị (byte, ký tự, giá trị, đối tượng) giữa chương trình và một nguồn hay đích.</td></tr>
<tr><td><strong>input / output stream</strong></td><td>luồng vào / luồng ra</td><td>Luồng vào đưa dữ liệu vào chương trình (<code>read</code>), luồng ra đưa dữ liệu ra ngoài (<code>write</code>).</td></tr>
<tr><td><strong>byte stream / character stream</strong></td><td>luồng byte / luồng ký tự</td><td><code>InputStream</code>/<code>OutputStream</code> chuyển byte thô; <code>Reader</code>/<code>Writer</code> chuyển ký tự và cần một bảng mã khi chạm vào file.</td></tr>
<tr><td><strong>encoding / charset</strong></td><td>bảng mã</td><td>Luật đổi ký tự thành byte và ngược lại (UTF-8, windows-1252); dùng sai thì tiếng Việt bị méo hoặc mất.</td></tr>
<tr><td><strong>Unicode / code point</strong></td><td>Unicode / điểm mã</td><td>Bảng gán cho mỗi ký tự một con số, từ U+0000 tới U+10FFFF ("ế" = U+1EBF).</td></tr>
<tr><td><strong>UTF-8</strong></td><td>UTF-8</td><td>Bảng mã cất một điểm mã trong 1–4 byte (ASCII 1 byte, đa số chữ Việt 2–3 byte); mặc định của JDK 18+.</td></tr>
<tr><td><strong>BOM (byte-order mark)</strong></td><td>dấu thứ tự byte</td><td>Ký tự vô hình U+FEFF (byte EF BB BF) mà vài trình soạn thảo đặt ở đầu file UTF-8; Java giữ nó như ký tự đầu tiên.</td></tr>
<tr><td><strong>buffer / flush</strong></td><td>bộ đệm / đẩy bộ đệm</td><td>Vùng nhớ nơi luồng gom dữ liệu trước khi ghi thật; <code>flush()</code>/<code>close()</code> đẩy nó xuống file.</td></tr>
<tr><td><strong>append mode</strong></td><td>chế độ ghi nối</td><td><code>new FileWriter(name, true)</code>: dữ liệu mới nối sau nội dung cũ thay vì thay thế nó.</td></tr>
<tr><td><strong>try-with-resources</strong></td><td>try kèm tài nguyên</td><td><code>try (Resource r = …) { }</code> (Java 7): tự đóng mọi tài nguyên <code>AutoCloseable</code>, kể cả khi có ngoại lệ.</td></tr>
<tr><td><strong>checked exception (<code>IOException</code>)</strong></td><td>ngoại lệ được kiểm tra</td><td>Ngoại lệ mà trình biên dịch bắt buộc phải bắt hoặc khai báo; <code>FileNotFoundException</code> là lớp con của nó.</td></tr>
<tr><td><strong>end of file (EOF)</strong></td><td>hết file</td><td>Được báo bằng -1 (<code>read</code>), <code>null</code> (<code>readLine</code>) hoặc <code>EOFException</code> (<code>readInt</code>, <code>readObject</code>).</td></tr>
<tr><td><strong>random access / file pointer</strong></td><td>truy cập ngẫu nhiên / con trỏ file</td><td><code>RandomAccessFile</code> có thể <code>seek(pos)</code> tới byte bất kỳ; con trỏ là chỗ lần đọc hay ghi kế tiếp diễn ra.</td></tr>
<tr><td><strong>filter (wrapper) stream</strong></td><td>luồng lọc (luồng bọc)</td><td>Luồng dựng trên một luồng khác để thêm tính năng: <code>BufferedInputStream</code>, <code>DataOutputStream</code>.</td></tr>
<tr><td><strong>serialization / deserialization</strong></td><td>tuần tự hoá / giải tuần tự hoá</td><td>Biến một đối tượng (và các đối tượng nó tham chiếu) thành byte bằng <code>writeObject</code>, và ngược lại thành một bản sao mới bằng <code>readObject</code>.</td></tr>
<tr><td><strong><code>transient</code> / <code>serialVersionUID</code></strong></td><td>transient / số phiên bản tuần tự hoá</td><td>Trường transient không được lưu (trở về giá trị mặc định); <code>serialVersionUID</code> chốt phiên bản lớp để file cũ vẫn đọc được.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 9</h2>
<ol>
<li><strong>Choose the stream by its unit:</strong> bytes → <code>FileInputStream</code>/<code>FileOutputStream</code>; text → <code>Reader</code>/<code>Writer</code>; typed values → <code>DataInputStream</code>/<code>DataOutputStream</code>; objects → <code>ObjectInputStream</code>/<code>ObjectOutputStream</code>.</li>
<li><strong><code>File</code> only describes a file</strong> (exists, length, mkdirs, renameTo, list) — it never reads the content; most of its methods report failure by returning <code>false</code>.</li>
<li><strong>Always open in <code>try ( … )</code>:</strong> an unclosed writer leaves an empty file; file I/O throws checked <code>IOException</code> — catch <code>FileNotFoundException</code> first.</li>
<li><strong>Name the encoding:</strong> on JDK 8 <code>FileReader</code>/<code>FileWriter</code> use the machine default (windows-1252 in the lab) — use <code>InputStreamReader</code>/<code>OutputStreamWriter</code> with "UTF-8"; strip a BOM from line 1.</li>
<li><strong>Know each "end":</strong> <code>read()</code> → -1, <code>readLine()</code> → null, <code>readInt()</code>/<code>readObject()</code> → <code>EOFException</code>.</li>
<li><strong>Text files are formats you design:</strong> split, <code>trim()</code>, validate, report bad lines; <code>FileWriter(name)</code> replaces the file, <code>FileWriter(name, true)</code> appends.</li>
<li><strong>Binary files are layouts you must mirror:</strong> read in the same order and types; <code>RandomAccessFile</code> + fixed-size records lets you <code>seek</code>; <code>"rw"</code> keeps old bytes.</li>
<li><strong>Objects: <code>implements Serializable</code> + <code>serialVersionUID</code></strong>; static and transient fields are not saved; never append to an object file — rewrite it, or save the whole list as one object. And ONE <code>Scanner</code> on <code>System.in</code>.</li>
</ol>
<p>Next: the Chapter 9 quiz. Then try question 1 of <strong>PE3</strong>, <strong>PE5</strong> or <strong>PE9</strong> in the <a href="/exam?course=PRO192">Exam Room</a> against the clock — download the given <code>Q1.java</code> and the sample <code>input.txt</code> files there and run your solution with JDK 8.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 9</h2>
<ol>
<li><strong>Chọn luồng theo đơn vị:</strong> byte → <code>FileInputStream</code>/<code>FileOutputStream</code>; văn bản → <code>Reader</code>/<code>Writer</code>; giá trị có kiểu → <code>DataInputStream</code>/<code>DataOutputStream</code>; đối tượng → <code>ObjectInputStream</code>/<code>ObjectOutputStream</code>.</li>
<li><strong><code>File</code> chỉ mô tả file</strong> (exists, length, mkdirs, renameTo, list) — không bao giờ đọc nội dung; phần lớn phương thức của nó báo thất bại bằng cách trả <code>false</code>.</li>
<li><strong>Luôn mở trong <code>try ( … )</code>:</strong> writer không đóng để lại file rỗng; đọc/ghi file ném <code>IOException</code> checked — bắt <code>FileNotFoundException</code> trước.</li>
<li><strong>Gọi tên bảng mã:</strong> trên JDK 8 <code>FileReader</code>/<code>FileWriter</code> dùng mặc định của máy (windows-1252 ở phòng lab) — dùng <code>InputStreamReader</code>/<code>OutputStreamWriter</code> với "UTF-8"; bỏ BOM ở dòng 1.</li>
<li><strong>Biết từng kiểu "hết":</strong> <code>read()</code> → -1, <code>readLine()</code> → null, <code>readInt()</code>/<code>readObject()</code> → <code>EOFException</code>.</li>
<li><strong>File văn bản là định dạng do bạn thiết kế:</strong> tách, <code>trim()</code>, kiểm tra, báo dòng hỏng; <code>FileWriter(name)</code> thay cả file, <code>FileWriter(name, true)</code> ghi nối.</li>
<li><strong>File nhị phân là bố cục phải soi gương:</strong> đọc đúng thứ tự và kiểu đã ghi; <code>RandomAccessFile</code> + bản ghi cỡ cố định cho phép <code>seek</code>; <code>"rw"</code> giữ byte cũ.</li>
<li><strong>Đối tượng: <code>implements Serializable</code> + <code>serialVersionUID</code></strong>; trường static và transient không được lưu; đừng bao giờ ghi nối vào file đối tượng — ghi lại cả file, hoặc lưu cả danh sách thành một đối tượng. Và MỘT <code>Scanner</code> trên <code>System.in</code>.</li>
</ol>
<p>Tiếp theo: quiz Chương 9. Rồi thử câu 1 của <strong>PE3</strong>, <strong>PE5</strong> hoặc <strong>PE9</strong> trong <a href="/exam?course=PRO192">Exam Room</a> có bấm giờ — tải <code>Q1.java</code> và các file <code>input.txt</code> mẫu ở đó rồi chạy lời giải của bạn bằng JDK 8.</p>`),
  ].join('\n'),
};

/* ───────── Lab 9 — 🏗️ CT Library: saving to a file (FileBookRepository, CSV in UTF-8, broken lines, temp file, one line to switch) ───────── */
const L_lab9 = {
  title: 'Lab 9 — 🏗️ CT Library: saving to a file (FileBookRepository, CSV in UTF-8, broken lines, temp file, one line to switch)|||Lab 9 — 🏗️ CT Library: lưu dữ liệu ra tệp (FileBookRepository, CSV UTF-8, dòng hỏng, tệp tạm, đổi một dòng)',
  slug: 'pro192-lab-9-luu-tep',
  type: 'VIDEO',
  description: 'Lab 9 của dự án CT Library (sau Chương 9), chuẩn review LAB211: dữ liệu sống qua lần tắt máy. FileBookRepository cài cùng interface IBookRepository trên tệp data/books.csv bảng mã UTF-8 — nạp khi mở (bỏ BOM, bỏ qua dòng hỏng kèm số dòng và lý do), ghi lại sau mỗi thay đổi qua một tệp tạm rồi mới thay tệp thật, tên có dấu phẩy nằm trong ngoặc kép. Nó GIỮ một InMemoryBookRepository để làm CRUD thay vì chép lại hay kế thừa. Chương trình chuyển sang kho trên tệp bằng đúng một dòng new trong BookController; Main không đổi. Bộ chấm chạy hai lần — lưu rồi mở lại — và đòi kho y nguyên. Kèm năm bẫy chạy thật: split(",") cắt đôi tên sách, bảng mã mặc định của máy, BOM vô hình, quên close() ra tệp 0 byte, PrintWriter nuốt lỗi. Starter + đáp án tải về, bộ chấm 260 dòng, rubric 10 điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 9 · Lab 9 · CT Library</span>
<h2>Lab 9 — saving to a file</h2>
<p class="lead">Eight labs of CT Library, and every one of them forgets everything the moment the program stops. Chapter 9 gave you the tools to fix that: character streams with a named encoding, BufferedReader and PrintWriter, try-with-resources, files that are read line by line. Lab 9 puts the shelf into a CSV file — and finds out that the interface you wrote in Lab 5 was a promise: the switch from memory to file is one line.</p>
<p>The starter is a fresh project: Lab 8 finished, the storage exception, the extended contract, the CSV constants and the skeleton of <code>FileBookRepository</code> given, a sample <code>data/books.csv</code> with four broken lines, five TODOs marked <code>TODO Lab 9.x</code>. Plan about <strong>3 hours</strong>.</p>`,
    `<span class="eyebrow">Chương 9 · Lab 9 · CT Library</span>
<h2>Lab 9 — lưu dữ liệu ra tệp</h2>
<p class="lead">Tám lab CT Library, và lab nào cũng quên sạch mọi thứ ngay khi chương trình dừng. Chương 9 đã đưa bạn đồ nghề để sửa chuyện đó: luồng ký tự có gọi tên bảng mã, BufferedReader và PrintWriter, try-with-resources, tệp đọc từng dòng. Lab 9 đặt kệ sách vào một tệp CSV — và phát hiện ra rằng interface bạn viết từ Lab 5 là một lời hứa: chuyển từ bộ nhớ sang tệp chỉ là một dòng.</p>
<p>Starter là một dự án sạch: Lab 8 đã xong, ngoại lệ lưu trữ, hợp đồng mở rộng, các hằng của CSV và bộ khung <code>FileBookRepository</code> cho sẵn, một tệp mẫu <code>data/books.csv</code> có bốn dòng hỏng, năm TODO đánh dấu <code>TODO Lab 9.x</code>. Dành khoảng <strong>3 giờ</strong>.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Lab 9 (17 slides)</h2>
<p>The deck of this lab, made for CT Library (it is not a school deck). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project, compiled with <code>javac --release 8</code> and run — the same runs you find in the steps below.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Lab 9 (17 slide)</h2>
<p>Bộ slide của lab này, dựng riêng cho CT Library (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ dự án thật, biên dịch bằng <code>javac --release 8</code> rồi chạy — đúng những lần chạy bạn gặp lại ở các bước bên dưới.</p>`),
    walk('lab9', [
      [1, 'Lab 9 — CT Library: saving to a file',
        `<p class="y-chinh">🎯 Lab 9 = Chapter 9 on a real codebase: the shelf survives a restart.</p>
<p>Five TODOs — read a CSV line with quotes, load the file, quote on the way out, save through a temporary file, and the one line that switches the program over — plus five traps of text files, each run for real.</p>`,
        `<p class="y-chinh">🎯 Lab 9 = Chương 9 trên một bộ mã thật: kệ sách sống qua lần khởi động lại.</p>
<p>Năm TODO — đọc một dòng CSV có ngoặc kép, nạp tệp, bọc ngoặc kép khi ghi, lưu qua một tệp tạm, và một dòng chuyển cả chương trình sang kho mới — cộng năm cái bẫy của tệp văn bản, cái nào cũng chạy thật.</p>`],
      [2, 'Ticket CTL-9 — close the app, lose the shelf',
        `<p class="y-chinh">🎯 Keep the items in <code>data/books.csv</code> (UTF-8): load at start, save after every change, survive broken lines and titles with commas — and switch to it without touching <code>Main</code>.</p>
<p>Done means: PASS 260/260 — the grader runs the program, then runs it AGAIN in the same folder and expects the same shelf; <code>lint.py</code> silent; the four broken lines of the sample file reported with their line numbers; "Mắt Biếc" printed with its accents; and exactly one line of <code>BookController</code> changed to switch.</p>`,
        `<p class="y-chinh">🎯 Giữ tài liệu trong <code>data/books.csv</code> (UTF-8): nạp khi mở, lưu sau mỗi thay đổi, sống sót qua dòng hỏng và tên có dấu phẩy — và chuyển sang đó mà không chạm vào <code>Main</code>.</p>
<p>Xong nghĩa là: PASS 260/260 — bộ chấm chạy chương trình, rồi chạy LẠI trong cùng thư mục và đòi đúng kệ sách cũ; <code>lint.py</code> im lặng; bốn dòng hỏng của tệp mẫu được báo kèm số dòng; "Mắt Biếc" in ra đủ dấu; và đúng một dòng của <code>BookController</code> đổi để chuyển kho.</p>`],
      [3, 'The seam from Lab 5 pays off: one line',
        `<p class="y-chinh">🎯 Since Lab 5 the controller holds a field of type <code>IBookRepository</code>, and only its constructor says which class sits behind it. Lab 9 writes a second class behind the same contract and changes that one <code>new</code>.</p>
<p>Every other line of the controller, the service and the views calls the interface, so none of them changes; <code>Main</code> never knew a repository existed. That is what "program to an interface" buys — and why Spring Boot injects a <code>JpaRepository</code> the same way (Lab 9 is the hand-made version). The import line follows the <code>new</code> (NetBeans: Ctrl+Shift+I).</p>`,
        `<p class="y-chinh">🎯 Từ Lab 5, controller giữ một trường kiểu <code>IBookRepository</code>, và chỉ constructor của nó nói lớp nào đứng sau. Lab 9 viết lớp thứ hai sau cùng hợp đồng và đổi đúng chữ <code>new</code> đó.</p>
<p>Mọi dòng khác của controller, service và view đều gọi qua interface nên không dòng nào đổi; <code>Main</code> chưa bao giờ biết có repository. Đó là cái "lập trình theo interface" mua được — và là cách Spring Boot tiêm một <code>JpaRepository</code> (Lab 9 là bản làm tay). Dòng import đi theo chữ <code>new</code> (NetBeans: Ctrl+Shift+I).</p>`],
      [4, 'FileBookRepository HAS an InMemoryBookRepository',
        `<p class="y-chinh">🎯 The file repository keeps an in-memory repository inside and delegates every search, add, update and delete to it; its own code is only "load the file" and "save the file".</p>
<p>Why not copy the CRUD? Two copies drift apart. Why not <code>extends InMemoryBookRepository</code>? Its methods promise to throw only <code>DuplicateKeyException</code> or <code>ItemNotFoundException</code>, and an override may not add <code>StorageException</code> — so the subclass could not report a failed save. Composition ("has-a") avoids both: the interface declares <code>StorageException</code> on the four writing methods, the memory version simply never throws it (allowed: an implementation may throw less).</p>`,
        `<p class="y-chinh">🎯 Kho trên tệp giữ một kho bộ nhớ bên trong và uỷ quyền mọi việc tìm, thêm, sửa, xoá cho nó; mã của chính nó chỉ là "nạp tệp" và "ghi tệp".</p>
<p>Sao không chép lại CRUD? Hai bản chép sẽ lệch nhau. Sao không <code>extends InMemoryBookRepository</code>? Các phương thức của nó hứa chỉ ném <code>DuplicateKeyException</code> hay <code>ItemNotFoundException</code>, và bản ghi đè không được thêm <code>StorageException</code> — lớp con sẽ không báo được lần lưu thất bại. Kết hợp ("có một") tránh được cả hai: interface khai <code>StorageException</code> ở bốn phương thức ghi, bản bộ nhớ đơn giản là không bao giờ ném (hợp lệ: bản cài được ném ít hơn).</p>`],
      [5, 'The file: books.csv, one item per line',
        `<p class="y-chinh">🎯 Line 1 is the header; each item is 5 common columns (type, id, title, year, copies) followed by its own: a book adds ISBN and author, a magazine its issue, a DVD its minutes.</p>
<p>The columns of each type come from the object itself — <code>getExtraValueArray()</code>, abstract in <code>LibraryItem</code> — so the file code needs no <code>instanceof</code>. A title with a comma is written inside quotes. The real file after the grader's first run is shown below: the BOM of the sample is gone, the broken lines too (kept in <code>books.csv.bak</code>).</p>`,
        `<p class="y-chinh">🎯 Dòng 1 là tiêu đề; mỗi tài liệu là 5 cột chung (loại, mã, tên, năm, số bản) rồi tới cột riêng: sách thêm ISBN và tác giả, tạp chí thêm kỳ số, DVD thêm số phút.</p>
<p>Cột riêng của mỗi loại do chính đối tượng trả lời — <code>getExtraValueArray()</code>, trừu tượng ở <code>LibraryItem</code> — nên mã tệp không cần <code>instanceof</code>. Tên có dấu phẩy được ghi trong ngoặc kép. Tệp thật sau lần chạy đầu của bộ chấm in bên dưới: BOM của tệp mẫu đã mất, các dòng hỏng cũng vậy (giữ lại trong <code>books.csv.bak</code>).</p>`],
      [6, 'TODO 9.1 — a CSV line is not split(",")',
        `<p class="y-chinh">🎯 <code>split(",")</code> cuts "Refactoring, Second Edition" into two columns: 8 instead of 7. Read the line character by character with an "inside quotes" flag: a comma inside quotes is text, <code>""</code> inside quotes is one real quote.</p>
<p>The real run of <code>LabTachCsv</code> shows both on the same line, and a title that contains quotes going out and back unchanged. A quote opened and never closed makes the line broken — <code>splitLine</code> throws, the loader reports it.</p>`,
        `<p class="y-chinh">🎯 <code>split(",")</code> cắt "Refactoring, Second Edition" thành hai cột: 8 thay vì 7. Đọc dòng từng ký tự với một cờ "đang trong ngoặc kép": dấu phẩy trong ngoặc là chữ, <code>""</code> trong ngoặc là một dấu ngoặc kép thật.</p>
<p>Lần chạy thật <code>LabTachCsv</code> cho thấy cả hai trên cùng một dòng, và một tên có chứa ngoặc kép đi ra rồi đọc về y nguyên. Ngoặc kép mở mà không đóng là dòng hỏng — <code>splitLine</code> ném lỗi, bộ nạp báo lại.</p>`],
      [7, 'TODO 9.2 — load: name the encoding, count the lines',
        `<p class="y-chinh">🎯 <code>new BufferedReader(new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))</code> in a try-with-resources; <code>readLine()</code> until <code>null</code>; strip the BOM from line 1, skip the header and blank lines, load the rest one by one.</p>
<p>No file yet (first run) is not an error: the shelf starts empty and the first save creates the file. The real start of the grader's run: four lines skipped, each with the file, the line number and the reason, then "Kho co 7 tai lieu sau khi nap".</p>`,
        `<p class="y-chinh">🎯 <code>new BufferedReader(new InputStreamReader(new FileInputStream(tep), StandardCharsets.UTF_8))</code> trong try-with-resources; <code>readLine()</code> tới khi <code>null</code>; bỏ BOM ở dòng 1, bỏ qua dòng tiêu đề và dòng trống, nạp phần còn lại từng dòng một.</p>
<p>Chưa có tệp (lần chạy đầu) không phải lỗi: kho bắt đầu rỗng và lần lưu đầu tiên tạo tệp. Phần mở đầu thật của lần chạy chấm: bốn dòng bị bỏ qua, mỗi dòng kèm tên tệp, số dòng và lý do, rồi "Kho co 7 tai lieu sau khi nap".</p>`],
      [8, 'One bad line never sinks the shelf',
        `<p class="y-chinh">🎯 Each data line is loaded inside its own <code>try</code>: a broken line becomes one message and the loop goes on — the 7 good lines are all there.</p>
<p>The reasons come from the same rules as the keyboard: <code>Validation.getYear</code> refuses "20O5" (a letter O), the column count catches the magazine with no issue, the type check catches type 4, and the repository refuses a second book with B002's ISBN. The "Moi nhap lai" at the end of the keyboard messages is cut off — a file cannot be asked again. The first save after a load with broken lines copies the original to <code>books.csv.bak</code>, because those lines will not be written back.</p>`,
        `<p class="y-chinh">🎯 Mỗi dòng dữ liệu được nạp trong <code>try</code> của riêng nó: dòng hỏng thành một câu báo và vòng lặp đi tiếp — 7 dòng tốt vẫn đủ cả.</p>
<p>Lý do lấy từ đúng các luật của bàn phím: <code>Validation.getYear</code> từ chối "20O5" (chữ O), số cột bắt tạp chí thiếu kỳ số, kiểm loại bắt loại 4, và kho từ chối cuốn thứ hai trùng ISBN với B002. Đuôi "Moi nhap lai" của câu báo bàn phím bị cắt — tệp thì không hỏi lại được. Lần lưu đầu sau khi nạp có dòng hỏng chép tệp gốc sang <code>books.csv.bak</code>, vì những dòng đó sẽ không được ghi lại.</p>`],
      [9, "Trap: the machine's default encoding",
        `<p class="y-chinh">🎯 On JDK 8, <code>new FileReader(file)</code> decodes with the machine's default charset — on a Windows machine typically Cp1252 — so the UTF-8 bytes of "Mắt Biếc" come back as "Máº¯t Biáº¿c" (real run of <code>LabBangMa</code>).</p>
<p>8 characters are 12 bytes in UTF-8: <code>ắ</code> and <code>ế</code> take three each. The lab's own runs pass <code>-Dfile.encoding=UTF-8</code>, which hides the bug on the grader — on a classmate's Windows laptop it appears. Name the charset in both directions, every time (<code>FileReader(file, charset)</code> exists only from Java 11; Java 18 made UTF-8 the default).</p>`,
        `<p class="y-chinh">🎯 Trên JDK 8, <code>new FileReader(tep)</code> giải mã bằng bảng mã mặc định của máy — máy Windows thường là Cp1252 — nên các byte UTF-8 của "Mắt Biếc" quay về thành "Máº¯t Biáº¿c" (lần chạy thật <code>LabBangMa</code>).</p>
<p>8 ký tự là 12 byte UTF-8: <code>ắ</code> và <code>ế</code> mỗi chữ ba byte. Các lần chạy của lab tự truyền <code>-Dfile.encoding=UTF-8</code>, nên bộ chấm không thấy lỗi — lên máy Windows của bạn cùng lớp thì nó hiện ra. Gọi tên bảng mã ở cả hai chiều, mọi lúc (<code>FileReader(tep, charset)</code> chỉ có từ Java 11; Java 18 mới lấy UTF-8 làm mặc định).</p>`],
      [10, 'Trap: the BOM nobody sees',
        `<p class="y-chinh">🎯 Excel's "CSV UTF-8" and Notepad put three bytes EF BB BF at the start of the file; Java reads them as one invisible character, <code>⟨BOM⟩</code>. Forget to remove it and the header no longer equals the header (project <code>bay/quen-bom</code>).</p>
<p>The real output reports "dong 1: loai 'loai' khong hop le" — the two words look identical on screen and are not: <code>"⟨BOM⟩loai".equals("loai")</code> is <code>false</code>, length 5 (real run of <code>LabBangMa</code>). <code>line.replace(Constants.BOM, "")</code> on line 1 is the whole cure.</p>`,
        `<p class="y-chinh">🎯 "CSV UTF-8" của Excel và Notepad đặt ba byte EF BB BF ở đầu tệp; Java đọc chúng thành một ký tự vô hình, <code>⟨BOM⟩</code>. Quên bỏ nó thì dòng tiêu đề không còn bằng dòng tiêu đề (dự án <code>bay/quen-bom</code>).</p>
<p>Output thật báo "dong 1: loai 'loai' khong hop le" — hai chữ trông giống hệt trên màn hình mà không bằng nhau: <code>"⟨BOM⟩loai".equals("loai")</code> là <code>false</code>, độ dài 5 (lần chạy thật <code>LabBangMa</code>). <code>line.replace(Constants.BOM, "")</code> ở dòng 1 là toàn bộ thuốc chữa.</p>`],
      [11, 'TODO 9.3 — quote what needs quoting',
        `<p class="y-chinh">🎯 A value with a comma or a quote is written as <code>"…"</code>, with every inner quote doubled; any other value is written as it is.</p>
<p>Skip it (project <code>bay/khong-quote</code>) and nothing goes wrong — until the program is opened again: lines 4 and 7 of the saved file now have 8 columns, both books with a comma in the title are skipped, the shelf has 4 items instead of 6, and the search for "code" finds nothing. The bug is written in the first run and only seen in the second — that is why the grader reopens.</p>`,
        `<p class="y-chinh">🎯 Giá trị có dấu phẩy hoặc ngoặc kép được ghi thành <code>"…"</code>, mọi ngoặc kép bên trong nhân đôi; giá trị khác ghi nguyên.</p>
<p>Bỏ qua bước này (dự án <code>bay/khong-quote</code>) thì chẳng có gì hỏng — cho tới khi mở lại chương trình: dòng 4 và 7 của tệp đã lưu giờ có 8 cột, cả hai cuốn có dấu phẩy trong tên bị bỏ qua, kho còn 4 thay vì 6, và tìm "code" không ra gì. Con bọ được ghi ở lần chạy đầu và chỉ lộ ở lần thứ hai — vì thế bộ chấm phải mở lại.</p>`],
      [12, 'TODO 9.4 — save through a temporary file',
        `<p class="y-chinh">🎯 Write the whole shelf to <code>books.csv.tmp</code> inside a try-with-resources; only after it is complete and closed, <code>Files.move(tmp, real, REPLACE_EXISTING)</code>.</p>
<p>If the program dies half-way, the real file is still the old, complete one; only the .tmp is broken. The real run of <code>LabTepTam</code> "cuts the power" after 1 of 3 rows: writing in place leaves a 1-line file, writing through a temp file leaves the 3 lines untouched. Saving after every change costs one full write — fine for 300 members, and the reason a database (Lab "PostgreSQL" later) writes only the row that changed.</p>`,
        `<p class="y-chinh">🎯 Ghi cả kệ ra <code>books.csv.tmp</code> trong try-with-resources; chỉ khi tệp đã đủ và đã đóng mới <code>Files.move(tam, that, REPLACE_EXISTING)</code>.</p>
<p>Chương trình chết giữa chừng thì tệp thật vẫn là bản cũ nguyên vẹn; chỉ tệp .tmp hỏng. Lần chạy thật <code>LabTepTam</code> "cắt điện" sau 1 trên 3 dòng: ghi thẳng để lại tệp 1 dòng, ghi qua tệp tạm để 3 dòng nguyên. Lưu sau mỗi thay đổi tốn một lần ghi cả tệp — ổn với 300 thành viên, và là lý do cơ sở dữ liệu (khoá PostgreSQL sau này) chỉ ghi đúng dòng thay đổi.</p>`],
      [13, 'Trap: forget close() — a file of 0 bytes',
        `<p class="y-chinh">🎯 Without try-with-resources (and without <code>close()</code>), the text stays in the writer's buffer: the .tmp has 0 bytes, it replaces the real file, and the next start finds an empty shelf (project <code>bay/quen-close</code>).</p>
<p>The real files after the run: <code>books.csv (0 byte)</code>. On reopening, the program sees an empty repository and quietly loads the Lab 8 sample items — the grader catches it on line 187 ("Effective Java" where "Clean Code, A Handbook" should be). <code>close()</code> is what pushes the buffer to the disk; try-with-resources calls it for you, even when an exception flies.</p>`,
        `<p class="y-chinh">🎯 Không try-with-resources (và không <code>close()</code>), chữ nằm lại trong bộ đệm của writer: tệp .tmp có 0 byte, nó thay tệp thật, và lần mở sau thấy kệ rỗng (dự án <code>bay/quen-close</code>).</p>
<p>Các tệp thật sau lần chạy: <code>books.csv (0 byte)</code>. Lúc mở lại, chương trình thấy kho rỗng và lặng lẽ nạp tài liệu mẫu của Lab 8 — bộ chấm bắt được ở dòng 187 ("Effective Java" đứng chỗ của "Clean Code, A Handbook"). <code>close()</code> là thứ đẩy bộ đệm xuống đĩa; try-with-resources gọi nó hộ bạn, kể cả khi có ngoại lệ bay ra.</p>`],
      [14, 'PrintWriter never throws — ask it',
        `<p class="y-chinh">🎯 <code>PrintWriter</code> swallows every <code>IOException</code> and only raises a flag: the real run of <code>LabPrintWriterImLang</code> prints twice into a closed stream — no exception, <code>checkError()</code> true, file 0 bytes.</p>
<p>So <code>saveToFile</code> asks <code>writer.checkError()</code> before the move and turns a failure into an <code>IOException</code>, then wraps every <code>IOException</code> into a <code>StorageException</code> that keeps it as the cause. The controller catches it with the rest of <code>LibraryException</code>: the user reads "Khong ghi duoc tep data/books.csv …", the menu goes on, the change is still in memory.</p>`,
        `<p class="y-chinh">🎯 <code>PrintWriter</code> nuốt mọi <code>IOException</code> và chỉ bật một cờ: lần chạy thật <code>LabPrintWriterImLang</code> in hai lần vào một luồng đã đóng — không ngoại lệ nào, <code>checkError()</code> là true, tệp 0 byte.</p>
<p>Vì thế <code>saveToFile</code> hỏi <code>writer.checkError()</code> trước khi move và biến thất bại thành <code>IOException</code>, rồi bọc mọi <code>IOException</code> vào một <code>StorageException</code> giữ nó làm nguyên nhân. Controller bắt nó cùng phần còn lại của <code>LibraryException</code>: người dùng đọc "Khong ghi duoc tep data/books.csv …", menu chạy tiếp, thay đổi vẫn còn trong bộ nhớ.</p>`],
      [15, 'TODO 9.5 — the one line, then save and reopen',
        `<p class="y-chinh">🎯 <code>bookRepository = new FileBookRepository(Constants.BOOK_FILE_PATH);</code> — and the grader's second run, in the same folder, prints the same six items, finds "Clean Code, A Handbook" and keeps Joshua Bloch at 2 titles.</p>
<p>Not saved yet, on purpose: members and loans are still in memory, so after a restart B-items that were on loan show their lowered copies but nobody holds them. The harness avoids borrowing for that reason; saving <code>members.csv</code> and <code>loans.csv</code> with the same pattern is the first challenge below — and the final project of the course.</p>`,
        `<p class="y-chinh">🎯 <code>bookRepository = new FileBookRepository(Constants.BOOK_FILE_PATH);</code> — và lần chạy thứ hai của bộ chấm, cùng thư mục, in đúng sáu tài liệu, tìm thấy "Clean Code, A Handbook" và giữ Joshua Bloch ở 2 đầu sách.</p>
<p>Chưa lưu, có chủ ý: thành viên và lượt mượn vẫn ở bộ nhớ, nên sau khi khởi động lại, cuốn đang được mượn còn số bản đã trừ mà không ai giữ. Bộ chấm tránh việc mượn vì lý do đó; lưu <code>members.csv</code> và <code>loans.csv</code> theo cùng khuôn là thử thách đầu tiên bên dưới — và là dự án cuối khoá.</p>`],
      [16, 'Green: PASS 260/260 and a silent reviewer',
        `<p class="y-chinh">🎯 Green = the grader at 260/260 across the two runs and <code>lint.py</code> silent.</p>
<p>A good order: 9.1 (test it on the B003 line), 9.3 (it is the mirror of 9.1), 9.2, 9.4, and 9.5 last — switching before the load and save work only moves the red to other lines. Then delete <code>data/books.csv</code> and run once by hand: "Chua co tep …", the samples, and a new file appears.</p>`,
        `<p class="y-chinh">🎯 Xanh = bộ chấm 260/260 qua cả hai lần chạy và <code>lint.py</code> im lặng.</p>
<p>Thứ tự nên làm: 9.1 (thử ngay trên dòng B003), 9.3 (nó là ảnh gương của 9.1), 9.2, 9.4, và 9.5 cuối cùng — đổi dòng trước khi nạp và lưu chạy được thì chỉ dời màu đỏ sang dòng khác. Rồi xoá <code>data/books.csv</code> và tự chạy một lần: "Chua co tep …", tài liệu mẫu, và một tệp mới xuất hiện.</p>`],
      [17, 'Rubric — 10 points, PE style',
        `<p class="y-chinh">🎯 The oral question: "what did you change to move from memory to a file — and why was it so little?".</p>
<p>Answer in two sentences: one line in the controller's constructor, because every other class talks to the <code>IBookRepository</code> interface, never to the class behind it; the new class keeps the same contract, so nothing above it can tell the difference.</p>`,
        `<p class="y-chinh">🎯 Câu vấn đáp: "em đã đổi gì để chuyển từ bộ nhớ sang tệp — và vì sao ít vậy?".</p>
<p>Trả lời bằng hai câu: một dòng trong constructor của controller, vì mọi lớp khác chỉ nói chuyện với interface <code>IBookRepository</code>, không bao giờ với lớp đứng sau; lớp mới giữ đúng hợp đồng đó nên không ai ở phía trên phân biệt được.</p>`],
    ]),
    bi(`<h2>1. The ticket</h2>
<div class="callout"><p><strong>CTL-9 · CT Library · priority: high.</strong> "We typed in forty books on Saturday, closed the laptop, and on Monday the shelf was empty. Keep the items in a file the club can also open in Excel. Our old list was exported from Excel, so expect a few broken lines in it — do not lose the good ones because of them. Some titles have commas, some have Vietnamese accents. And please do not rewrite the program: you told us in Lab 5 that this would be a small change." — the team lead</p></div>
<table>
<thead><tr><th>You need</th><th>From</th></tr></thead>
<tbody>
<tr><td>streams, characters vs bytes, UTF-8 takes 1–4 bytes</td><td>9.A (pro14 slides 1–11)</td></tr>
<tr><td>reading and writing text files, BufferedReader / PrintWriter, case studies</td><td>9.B (pro14 slides 12–34)</td></tr>
<tr><td>try-with-resources, IOException, end of file = readLine() returns null</td><td>9.B, 9.2 🧪 (Bài 2 students.csv)</td></tr>
<tr><td>the interface seam IBookRepository</td><td>Lab 5</td></tr>
</tbody>
</table>`,
    `<h2>1. Ticket</h2>
<div class="callout"><p><strong>CTL-9 · CT Library · ưu tiên: cao.</strong> "Thứ bảy cả nhóm gõ vào bốn mươi cuốn sách, gập máy, thứ hai mở ra kệ trống trơn. Giữ tài liệu trong một tệp mà câu lạc bộ mở được bằng Excel. Danh sách cũ của chúng tôi xuất từ Excel, nên chắc chắn có vài dòng hỏng — đừng vì chúng mà mất các dòng tốt. Có tên sách có dấu phẩy, có tên có dấu tiếng Việt. Và làm ơn đừng viết lại chương trình: ở Lab 5 các bạn đã nói đây sẽ là một thay đổi nhỏ." — trưởng nhóm</p></div>
<table>
<thead><tr><th>Bạn cần</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>luồng, ký tự và byte, UTF-8 mất 1–4 byte</td><td>9.A (pro14 slide 1–11)</td></tr>
<tr><td>đọc ghi tệp văn bản, BufferedReader / PrintWriter, case study</td><td>9.B (pro14 slide 12–34)</td></tr>
<tr><td>try-with-resources, IOException, hết tệp = readLine() trả null</td><td>9.B, 9.2 🧪 (Bài 2 students.csv)</td></tr>
<tr><td>đường nối interface IBookRepository</td><td>Lab 5</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Requirements and acceptance criteria</h2>
<ol>
<li><strong>Same contract</strong>: <code>FileBookRepository implements IBookRepository</code>; CRUD delegated to an <code>InMemoryBookRepository</code> it holds; no CRUD code copied.</li>
<li><strong>CSV in UTF-8</strong>: <code>data/books.csv</code>, header line, 5 common columns + the type's own columns; the encoding named on read AND write; a BOM on line 1 removed.</li>
<li><strong>Quotes</strong>: a value with a comma or a quote is written quoted (inner quotes doubled) and read back as one value.</li>
<li><strong>Broken lines</strong>: skipped, each reported as "file, line number, reason"; the good lines all loaded; the original kept as <code>.bak</code> before the first save.</li>
<li><strong>Safe save</strong>: after every change; through a <code>.tmp</code> file, then <code>Files.move</code>; a failure becomes a <code>StorageException</code>, the menu goes on.</li>
<li><strong>One line</strong>: the controller's <code>new</code> switches the storage; <code>Main</code> unchanged.</li>
</ol>
<div class="callout ok"><p><strong>Done means:</strong> <code>check.sh</code> prints <code>PASS: 260/260 dong khop expected.txt</code> (two runs: save, then reopen) · <code>lint.py</code> 0 violations · <code>javac --release 8</code> compiles · <code>git diff</code> of <code>BookController</code> against the starter shows the one <code>new</code> (and its import) · you can explain why the save goes through a temporary file.</p></div>`,
    `<h2>2. Yêu cầu và tiêu chí đạt</h2>
<ol>
<li><strong>Cùng hợp đồng</strong>: <code>FileBookRepository implements IBookRepository</code>; CRUD uỷ quyền cho một <code>InMemoryBookRepository</code> nó giữ; không chép mã CRUD nào.</li>
<li><strong>CSV UTF-8</strong>: <code>data/books.csv</code>, dòng tiêu đề, 5 cột chung + cột riêng của loại; gọi tên bảng mã khi đọc LẪN khi ghi; bỏ BOM ở dòng 1.</li>
<li><strong>Ngoặc kép</strong>: giá trị có dấu phẩy hoặc ngoặc kép được ghi trong ngoặc kép (ngoặc kép bên trong nhân đôi) và đọc về thành một giá trị.</li>
<li><strong>Dòng hỏng</strong>: bỏ qua, mỗi dòng báo "tệp, số dòng, lý do"; mọi dòng tốt đều nạp đủ; tệp gốc giữ thành <code>.bak</code> trước lần lưu đầu.</li>
<li><strong>Lưu an toàn</strong>: sau mỗi thay đổi; qua tệp <code>.tmp</code> rồi <code>Files.move</code>; thất bại thành <code>StorageException</code>, menu chạy tiếp.</li>
<li><strong>Một dòng</strong>: chữ <code>new</code> của controller chuyển nơi lưu; <code>Main</code> không đổi.</li>
</ol>
<div class="callout ok"><p><strong>Xong nghĩa là:</strong> <code>check.sh</code> in <code>PASS: 260/260 dong khop expected.txt</code> (hai lần chạy: lưu rồi mở lại) · <code>lint.py</code> 0 vi phạm · <code>javac --release 8</code> biên dịch được · <code>git diff</code> của <code>BookController</code> so với starter chỉ là chữ <code>new</code> đó (và dòng import của nó) · bạn giải thích được vì sao lưu phải qua tệp tạm.</p></div>`),
    bi(`<h2>3. Files</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab9-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab9-starter.zip</span><span class="lc-sub">Lab 8 solution + StorageException, extended IBookRepository, FileBookRepository skeleton, data/books.csv · TODO 9.1–9.5 · harness (2 runs, 260 lines)</span></span>
<span class="lc-cta">Download</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab9-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab9-solution.zip</span><span class="lc-sub">the full solution — open it only after your own attempt</span></span>
<span class="lc-cta">Download</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab9/
  data/books.csv                         sample shelf: BOM, a quoted title, "Mắt Biếc", 4 broken lines
  harness/input.txt, harness/input-2.txt run 1 (change things), run 2 (reopen and look)
  harness/data/books.csv                 copied over data/ before every grading run
  src/ (new or changed since Lab 8)
    repository/FileBookRepository.java   TODO 9.2 loadFromFile · TODO 9.4 saveToFile (rest given)
    utils/CsvUtils.java                  TODO 9.1 splitLine · TODO 9.3 toCsvValue
    controller/BookController.java       TODO 9.5 the one line · load messages, catch LibraryException (given)
    repository/IBookRepository.java      StorageException on 4 writes + findLoadErrorList (given)
    repository/InMemoryBookRepository    addLoadedItem, findAllItems (given) · exceptions/StorageException (given)
    model/LibraryItem + 3 subclasses     getExtraValueArray (given) · constants: file, CSV, messages (given)</code></pre>`,
    `<h2>3. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab9-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab9-starter.zip</span><span class="lc-sub">đáp án Lab 8 + StorageException, IBookRepository mở rộng, khung FileBookRepository, data/books.csv · TODO 9.1–9.5 · harness (2 lần chạy, 260 dòng)</span></span>
<span class="lc-cta">Tải về</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab9-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab9-solution.zip</span><span class="lc-sub">đáp án đầy đủ — chỉ mở sau khi đã tự làm</span></span>
<span class="lc-cta">Tải về</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab9/
  data/books.csv                         kệ mẫu: BOM, một tên trong ngoặc kép, "Mắt Biếc", 4 dòng hỏng
  harness/input.txt, harness/input-2.txt lần chạy 1 (thay đổi), lần 2 (mở lại và xem)
  harness/data/books.csv                 chép đè lên data/ trước mỗi lần chấm
  src/ (mới hoặc đổi so với Lab 8)
    repository/FileBookRepository.java   TODO 9.2 loadFromFile · TODO 9.4 saveToFile (phần còn lại cho sẵn)
    utils/CsvUtils.java                  TODO 9.1 splitLine · TODO 9.3 toCsvValue
    controller/BookController.java       TODO 9.5 một dòng · in câu báo nạp, catch LibraryException (cho sẵn)
    repository/IBookRepository.java      StorageException ở 4 phương thức ghi + findLoadErrorList (cho sẵn)
    repository/InMemoryBookRepository    addLoadedItem, findAllItems (cho sẵn) · exceptions/StorageException (cho sẵn)
    model/LibraryItem + 3 lớp con        getExtraValueArray (cho sẵn) · constants: tệp, CSV, câu báo (cho sẵn)</code></pre>`),
    bi(`<h2>4. Step by step</h2>
<h4>Step 0 — lint the starter, run it twice (10 min)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab9</code></pre>
<div class="out">✓ CTLibrary-Lab9 — sạch</div>
<p>Clean for the reviewer's tool, useless for the club: the starter still uses the memory repository, so the first run starts from the Lab 8 samples, "Clean Code, A Handbook" is added — and the second run (the reopen) shows the samples again.</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
…</div>

<h4>Step 1 — TODO 9.1 read a CSV line (30 min)</h4>
<details><summary>Hint</summary><p>A <code>while</code> over the characters, an index you advance yourself (you must skip the second quote of <code>""</code>), a <code>StringBuilder</code> for the current value and a <code>boolean isInQuotes</code>. Five cases: inside quotes and <code>""</code> · inside quotes and <code>"</code> · inside quotes, anything else · outside and <code>"</code> · outside and <code>,</code>. Do not forget the last value after the loop.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Tach 1 dong CSV thanh cac gia tri; dau phay NAM TRONG ngoac kep la chu, khong phai dau
// ngan. Ngoac kep mo ma khong dong thi dong hong: nem InvalidInputException
public static ArrayList&lt;String&gt; splitLine(String line) throws InvalidInputException {
    // Cac gia tri da tach, gia tri dang gom, dang o trong ngoac kep hay khong, vi tri doc
    ArrayList&lt;String&gt; valueList = new ArrayList&lt;&gt;();
    StringBuilder valueBuilder = new StringBuilder();
    boolean isInQuotes = false;
    int index = 0;

    // Doc tung ky tu tu trai sang phai
    while (index &lt; line.length()) {
        // Ky tu dang doc
        char character = line.charAt(index);

        // Trong ngoac kep: "" la 1 dau ngoac kep that, " don le la dong ngoac
        if (isInQuotes) {
            // Gap dau ngoac kep: xem ky tu ke tiep
            if (character == Constants.CSV_QUOTE_CHAR) {
                // Ngoac kep doi: giu 1 dau, nhay qua dau thu hai
                if ((index + 1 &lt; line.length())
                        &amp;&amp; (line.charAt(index + 1) == Constants.CSV_QUOTE_CHAR)) {
                    valueBuilder.append(character);
                    index++;
                } else {
                    // Ngoac kep don: het phan trong ngoac
                    isInQuotes = false;
                }
            } else {
                // Moi ky tu khac trong ngoac (ke ca dau phay) la chu cua gia tri
                valueBuilder.append(character);
            }
        } else if (character == Constants.CSV_QUOTE_CHAR) {
            // Ngoai ngoac kep gap dau ngoac kep: mo phan trong ngoac
            isInQuotes = true;
        } else if (character == Constants.CSV_SEPARATOR_CHAR) {
            // Dau phay ngoai ngoac: het 1 gia tri, bat dau gia tri moi
            valueList.add(valueBuilder.toString());
            valueBuilder.setLength(0);
        } else {
            // Ky tu thuong
            valueBuilder.append(character);
        }
        index++;
    }

    // Het dong ma ngoac kep chua dong: dong hong
    if (isInQuotes) {
        throw new InvalidInputException(Message.ERROR_CSV_QUOTE);
    }

    // Gia tri cuoi cung (sau dau phay cuoi)
    valueList.add(valueBuilder.toString());
    return valueList;
}</code></pre>
</details>
<pre><code class="language-java">// release: 8
// Lab 9 — split(",") vs a CSV reader that understands quotes
import java.util.ArrayList;

public class LabTachCsv {
    public static void main(String[] args) {
        String line = "1,B003,\\"Refactoring, Second Edition\\",2018,1,9780134757599,Martin Fowler";
        System.out.println("line      : " + line);
        String[] naive = line.split(",");
        System.out.println("split(\\",\\"): " + naive.length + " columns: " + String.join(" | ", naive));
        ArrayList&lt;String&gt; good = splitLine(line);
        System.out.println("splitLine : " + good.size() + " columns: " + String.join(" | ", good));

        // writing: double the quotes inside, then wrap
        String title = "Say \\"Hi\\", Java";
        String cell = toCsvValue(title);
        System.out.println("toCsvValue(" + title + ") = " + cell);
        System.out.println("read back : " + String.join(" | ", splitLine("1," + cell + ",2020")));
    }

    static ArrayList&lt;String&gt; splitLine(String line) {
        ArrayList&lt;String&gt; values = new ArrayList&lt;&gt;();
        StringBuilder value = new StringBuilder();
        boolean inQuotes = false;
        int i = 0;
        while (i &lt; line.length()) {
            char ch = line.charAt(i);
            if (inQuotes) {
                if (ch == '"' &amp;&amp; i + 1 &lt; line.length() &amp;&amp; line.charAt(i + 1) == '"') {
                    value.append('"');
                    i++;
                } else if (ch == '"') {
                    inQuotes = false;
                } else {
                    value.append(ch);
                }
            } else if (ch == '"') {
                inQuotes = true;
            } else if (ch == ',') {
                values.add(value.toString());
                value.setLength(0);
            } else {
                value.append(ch);
            }
            i++;
        }
        values.add(value.toString());
        return values;
    }

    static String toCsvValue(String value) {
        if (!value.contains(",") &amp;&amp; !value.contains("\\"")) {
            return value;
        }
        return "\\"" + value.replace("\\"", "\\"\\"") + "\\"";
    }
}</code></pre>
<div class="out">line &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1,B003,"Refactoring, Second Edition",2018,1,9780134757599,Martin Fowler<br>
split(","): 8 columns: 1 | B003 | "Refactoring | &nbsp;Second Edition" | 2018 | 1 | 9780134757599 | Martin Fowler<br>
splitLine : 7 columns: 1 | B003 | Refactoring, Second Edition | 2018 | 1 | 9780134757599 | Martin Fowler<br>
toCsvValue(Say "Hi", Java) = "Say ""Hi"", Java"<br>
read back : 1 | Say "Hi", Java | 2020</div>

<h4>Step 2 — TODO 9.3 quote on the way out (10 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Doi 1 gia tri thanh dang ghi duoc vao CSV: co dau phay hoac ngoac kep thi nhan doi moi
// ngoac kep roi boc ca gia tri trong ngoac kep; khong co thi giu nguyen
public static String toCsvValue(String value) {
    // Gia tri thuong (khong dau phay, khong ngoac kep) ghi nguyen
    if ((!value.contains(Constants.CSV_SEPARATOR)) &amp;&amp; (!value.contains(Constants.CSV_QUOTE))) {
        return value;
    }

    // Nhan doi ngoac kep ben trong, roi boc ca gia tri
    return Constants.CSV_QUOTE + value.replace(Constants.CSV_QUOTE,
            Constants.CSV_QUOTE + Constants.CSV_QUOTE) + Constants.CSV_QUOTE;
}</code></pre>
</details>

<h4>Step 3 — TODO 9.2 load the file (35 min)</h4>
<details><summary>Hint</summary><p>Build the reader from the inside out: <code>FileInputStream</code> (bytes) → <code>InputStreamReader</code> with <code>StandardCharsets.UTF_8</code> (bytes to characters) → <code>BufferedReader</code> (whole lines). Keep your own line counter. The <code>try</code> around <code>loadLine</code> sits INSIDE the loop; the <code>catch (IOException e)</code> of the reader sits outside.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// NAP tep: dong 1 (bo BOM) phai la tieu de; moi dong sau la 1 tai lieu. Dong hong bi BO
// QUA va ghi lai "dong N: ly do" — mot dong hong khong bao gio lam hong ca kho
private void loadFromFile() {
    // Tep can doc; so dong dang doc (de bao loi); dong vua doc
    File dataFile = new File(filePath);
    int lineNumber = 0;
    String line = "";

    // Lan chay dau tien: chua co tep — kho rong, lan ghi dau tien se tao tep
    if (!dataFile.exists()) {
        loadErrorList.add(String.format(Message.FILE_NOT_FOUND, filePath));
        return;
    }

    // try-with-resources: tu dong close() ke ca khi loi. Bang ma GHI RO UTF-8 — FileReader
    // cua Java 8 dung bang ma mac dinh cua may (Windows: Cp1252, hong chu tieng Viet)
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
        // readLine() tra null khi het tep
        while ((line = reader.readLine()) != null) {
            lineNumber++;

            // Dong 1: bo dau BOM (Excel, Notepad hay them) roi bo qua dong tieu de
            if (lineNumber == Constants.CSV_HEADER_LINE) {
                line = line.replace(Constants.BOM, "");

                // Dung tieu de thi sang dong sau (khong phai tieu de: nap nhu dong du lieu)
                if (line.equals(Constants.CSV_HEADER)) {
                    continue;
                }
            }

            // Dong trong: bo qua, khong bao
            if (line.trim().isEmpty()) {
                continue;
            }

            // Nap 1 dong; hong thi ghi ly do kem so dong roi doc tiep dong sau
            try {
                loadLine(line);
            } catch (InvalidInputException | LibraryException e) {
                // Cau bao cua Validation viet cho nguoi go phim: bo duoi "Moi nhap lai."
                loadErrorList.add(String.format(Message.ERROR_CSV_LINE, filePath, lineNumber,
                        e.getMessage().replace(Message.RETRY_HINT, "")));
                isBackupNeeded = true;
            }
        }
    } catch (IOException e) {
        // Tep co ma khong doc duoc (bi khoa, khong co quyen...): bao 1 cau, kho dung du lieu
        // da nap duoc toi luc do
        loadErrorList.add(String.format(Message.ERROR_FILE_READ, filePath, e.getMessage()));
    }
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Bo qua data/books.csv dong 10: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong.<br>
Bo qua data/books.csv dong 11: can 6 cot, co 5 (ten co dau phay phai nam trong ngoac kep).<br>
Bo qua data/books.csv dong 12: loai '4' khong hop le (chi 1 Sach, 2 Tap chi, 3 DVD).<br>
Bo qua data/books.csv dong 13: Trung ISBN 9780134685991 voi Sach B002 "Effective Java". Moi tai lieu chi them 1 lan.<br>
Kho co 7 tai lieu sau khi nap.<br>
…</div>

<h4>Step 4 — TODO 9.4 save through a temp file (35 min)</h4>
<details><summary>Hint</summary><p>Three files: the real one, the <code>.tmp</code> next to it, the <code>.bak</code>. The writer lives only inside its try-with-resources; the <code>Files.move</code> comes after that block, when the .tmp is closed. One <code>catch (IOException e)</code> around everything turns into <code>StorageException</code>.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// GHI tep: viet ca kho ra TEP TAM, dong tep tam, roi moi doi ten de len tep that. Sap giua
// chung thi tep that van la ban cu nguyen ven, khong bao gio con mot nua
private void saveToFile() throws StorageException {
    // Tep that, tep tam canh no, tep sao luu
    File dataFile = new File(filePath);
    File tempFile = new File(filePath + Constants.TEMP_SUFFIX);
    File backupFile = new File(filePath + Constants.BACKUP_SUFFIX);

    try {
        // Lan ghi dau sau khi nap co dong hong: giu tep goc (dong hong se khong duoc ghi lai)
        if (isBackupNeeded &amp;&amp; dataFile.exists()) {
            Files.copy(dataFile.toPath(), backupFile.toPath(),
                    StandardCopyOption.REPLACE_EXISTING);
            isBackupNeeded = false;
        }

        // Thu muc chua tep chua co thi tao (lan chay dau tien)
        if (dataFile.getAbsoluteFile().getParentFile() != null) {
            dataFile.getAbsoluteFile().getParentFile().mkdirs();
        }

        // try-with-resources: close() day bo dem xuong dia; bang ma GHI RO UTF-8
        try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
                new FileOutputStream(tempFile), StandardCharsets.UTF_8))) {
            writer.println(Constants.CSV_HEADER);

            // Moi tai lieu 1 dong
            for (LibraryItem item : memoryRepository.findAllItems()) {
                writer.println(toCsvLine(item));
            }

            // PrintWriter KHONG nem IOException — no chi bat co loi, phai tu hoi
            if (writer.checkError()) {
                throw new IOException(Message.ERROR_WRITER);
            }
        }

        // Tep tam da du va da dong: thay tep that (ghi de neu da co)
        Files.move(tempFile.toPath(), dataFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
        // Boc IOException thanh loi cua kho, giu nguyen nhan goc
        throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                e.getMessage()), e);
    }
}</code></pre>
</details>

<h4>Step 5 — TODO 9.5 the one line, then grade (10 min)</h4>
<pre class="trich"><code class="language-java">// Dong DUY NHAT biet kho cat o dau: Lab 9 doi dung dong nay tu bo nho sang tep CSV
bookRepository = new FileBookRepository(Constants.BOOK_FILE_PATH);</code></pre>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
3 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
4 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
5 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
…</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 260/260 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab9-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab9-Solution — sạch</div>`,
    `<h2>4. Làm từng bước</h2>
<h4>Bước 0 — lint starter, chạy hai lần (10 phút)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab9</code></pre>
<div class="out">✓ CTLibrary-Lab9 — sạch</div>
<p>Sạch với công cụ của thầy, vô dụng với câu lạc bộ: starter vẫn dùng kho bộ nhớ, nên lần chạy đầu bắt đầu từ tài liệu mẫu của Lab 8, thêm được "Clean Code, A Handbook" — và lần chạy thứ hai (mở lại) lại thấy đúng tài liệu mẫu cũ.</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
…</div>

<h4>Bước 1 — TODO 9.1 đọc một dòng CSV (30 phút)</h4>
<details><summary>Gợi ý</summary><p>Một vòng <code>while</code> qua các ký tự, chỉ số tự tăng (vì phải nhảy qua dấu ngoặc kép thứ hai của <code>""</code>), một <code>StringBuilder</code> cho giá trị đang gom và một <code>boolean isInQuotes</code>. Năm trường hợp: trong ngoặc gặp <code>""</code> · trong ngoặc gặp <code>"</code> · trong ngoặc, ký tự khác · ngoài ngoặc gặp <code>"</code> · ngoài ngoặc gặp <code>,</code>. Đừng quên giá trị cuối cùng sau vòng lặp.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Tach 1 dong CSV thanh cac gia tri; dau phay NAM TRONG ngoac kep la chu, khong phai dau
// ngan. Ngoac kep mo ma khong dong thi dong hong: nem InvalidInputException
public static ArrayList&lt;String&gt; splitLine(String line) throws InvalidInputException {
    // Cac gia tri da tach, gia tri dang gom, dang o trong ngoac kep hay khong, vi tri doc
    ArrayList&lt;String&gt; valueList = new ArrayList&lt;&gt;();
    StringBuilder valueBuilder = new StringBuilder();
    boolean isInQuotes = false;
    int index = 0;

    // Doc tung ky tu tu trai sang phai
    while (index &lt; line.length()) {
        // Ky tu dang doc
        char character = line.charAt(index);

        // Trong ngoac kep: "" la 1 dau ngoac kep that, " don le la dong ngoac
        if (isInQuotes) {
            // Gap dau ngoac kep: xem ky tu ke tiep
            if (character == Constants.CSV_QUOTE_CHAR) {
                // Ngoac kep doi: giu 1 dau, nhay qua dau thu hai
                if ((index + 1 &lt; line.length())
                        &amp;&amp; (line.charAt(index + 1) == Constants.CSV_QUOTE_CHAR)) {
                    valueBuilder.append(character);
                    index++;
                } else {
                    // Ngoac kep don: het phan trong ngoac
                    isInQuotes = false;
                }
            } else {
                // Moi ky tu khac trong ngoac (ke ca dau phay) la chu cua gia tri
                valueBuilder.append(character);
            }
        } else if (character == Constants.CSV_QUOTE_CHAR) {
            // Ngoai ngoac kep gap dau ngoac kep: mo phan trong ngoac
            isInQuotes = true;
        } else if (character == Constants.CSV_SEPARATOR_CHAR) {
            // Dau phay ngoai ngoac: het 1 gia tri, bat dau gia tri moi
            valueList.add(valueBuilder.toString());
            valueBuilder.setLength(0);
        } else {
            // Ky tu thuong
            valueBuilder.append(character);
        }
        index++;
    }

    // Het dong ma ngoac kep chua dong: dong hong
    if (isInQuotes) {
        throw new InvalidInputException(Message.ERROR_CSV_QUOTE);
    }

    // Gia tri cuoi cung (sau dau phay cuoi)
    valueList.add(valueBuilder.toString());
    return valueList;
}</code></pre>
</details>
<pre><code class="language-java">// release: 8
// Lab 9 — split(",") so với bộ đọc CSV hiểu ngoặc kép
import java.util.ArrayList;

public class LabTachCsv {
    public static void main(String[] args) {
        String line = "1,B003,\\"Refactoring, Second Edition\\",2018,1,9780134757599,Martin Fowler";
        System.out.println("line      : " + line);
        String[] naive = line.split(",");
        System.out.println("split(\\",\\"): " + naive.length + " columns: " + String.join(" | ", naive));
        ArrayList&lt;String&gt; good = splitLine(line);
        System.out.println("splitLine : " + good.size() + " columns: " + String.join(" | ", good));

        // khi ghi: nhân đôi ngoặc kép bên trong rồi bọc
        String title = "Say \\"Hi\\", Java";
        String cell = toCsvValue(title);
        System.out.println("toCsvValue(" + title + ") = " + cell);
        System.out.println("read back : " + String.join(" | ", splitLine("1," + cell + ",2020")));
    }

    static ArrayList&lt;String&gt; splitLine(String line) {
        ArrayList&lt;String&gt; values = new ArrayList&lt;&gt;();
        StringBuilder value = new StringBuilder();
        boolean inQuotes = false;
        int i = 0;
        while (i &lt; line.length()) {
            char ch = line.charAt(i);
            if (inQuotes) {
                if (ch == '"' &amp;&amp; i + 1 &lt; line.length() &amp;&amp; line.charAt(i + 1) == '"') {
                    value.append('"');
                    i++;
                } else if (ch == '"') {
                    inQuotes = false;
                } else {
                    value.append(ch);
                }
            } else if (ch == '"') {
                inQuotes = true;
            } else if (ch == ',') {
                values.add(value.toString());
                value.setLength(0);
            } else {
                value.append(ch);
            }
            i++;
        }
        values.add(value.toString());
        return values;
    }

    static String toCsvValue(String value) {
        if (!value.contains(",") &amp;&amp; !value.contains("\\"")) {
            return value;
        }
        return "\\"" + value.replace("\\"", "\\"\\"") + "\\"";
    }
}</code></pre>
<div class="out">line &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1,B003,"Refactoring, Second Edition",2018,1,9780134757599,Martin Fowler<br>
split(","): 8 columns: 1 | B003 | "Refactoring | &nbsp;Second Edition" | 2018 | 1 | 9780134757599 | Martin Fowler<br>
splitLine : 7 columns: 1 | B003 | Refactoring, Second Edition | 2018 | 1 | 9780134757599 | Martin Fowler<br>
toCsvValue(Say "Hi", Java) = "Say ""Hi"", Java"<br>
read back : 1 | Say "Hi", Java | 2020</div>

<h4>Bước 2 — TODO 9.3 bọc ngoặc kép khi ghi (10 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Doi 1 gia tri thanh dang ghi duoc vao CSV: co dau phay hoac ngoac kep thi nhan doi moi
// ngoac kep roi boc ca gia tri trong ngoac kep; khong co thi giu nguyen
public static String toCsvValue(String value) {
    // Gia tri thuong (khong dau phay, khong ngoac kep) ghi nguyen
    if ((!value.contains(Constants.CSV_SEPARATOR)) &amp;&amp; (!value.contains(Constants.CSV_QUOTE))) {
        return value;
    }

    // Nhan doi ngoac kep ben trong, roi boc ca gia tri
    return Constants.CSV_QUOTE + value.replace(Constants.CSV_QUOTE,
            Constants.CSV_QUOTE + Constants.CSV_QUOTE) + Constants.CSV_QUOTE;
}</code></pre>
</details>

<h4>Bước 3 — TODO 9.2 nạp tệp (35 phút)</h4>
<details><summary>Gợi ý</summary><p>Dựng bộ đọc từ trong ra ngoài: <code>FileInputStream</code> (byte) → <code>InputStreamReader</code> với <code>StandardCharsets.UTF_8</code> (byte thành ký tự) → <code>BufferedReader</code> (cả dòng). Tự giữ bộ đếm dòng. Khối <code>try</code> quanh <code>loadLine</code> nằm TRONG vòng lặp; <code>catch (IOException e)</code> của bộ đọc nằm ngoài.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// NAP tep: dong 1 (bo BOM) phai la tieu de; moi dong sau la 1 tai lieu. Dong hong bi BO
// QUA va ghi lai "dong N: ly do" — mot dong hong khong bao gio lam hong ca kho
private void loadFromFile() {
    // Tep can doc; so dong dang doc (de bao loi); dong vua doc
    File dataFile = new File(filePath);
    int lineNumber = 0;
    String line = "";

    // Lan chay dau tien: chua co tep — kho rong, lan ghi dau tien se tao tep
    if (!dataFile.exists()) {
        loadErrorList.add(String.format(Message.FILE_NOT_FOUND, filePath));
        return;
    }

    // try-with-resources: tu dong close() ke ca khi loi. Bang ma GHI RO UTF-8 — FileReader
    // cua Java 8 dung bang ma mac dinh cua may (Windows: Cp1252, hong chu tieng Viet)
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
        // readLine() tra null khi het tep
        while ((line = reader.readLine()) != null) {
            lineNumber++;

            // Dong 1: bo dau BOM (Excel, Notepad hay them) roi bo qua dong tieu de
            if (lineNumber == Constants.CSV_HEADER_LINE) {
                line = line.replace(Constants.BOM, "");

                // Dung tieu de thi sang dong sau (khong phai tieu de: nap nhu dong du lieu)
                if (line.equals(Constants.CSV_HEADER)) {
                    continue;
                }
            }

            // Dong trong: bo qua, khong bao
            if (line.trim().isEmpty()) {
                continue;
            }

            // Nap 1 dong; hong thi ghi ly do kem so dong roi doc tiep dong sau
            try {
                loadLine(line);
            } catch (InvalidInputException | LibraryException e) {
                // Cau bao cua Validation viet cho nguoi go phim: bo duoi "Moi nhap lai."
                loadErrorList.add(String.format(Message.ERROR_CSV_LINE, filePath, lineNumber,
                        e.getMessage().replace(Message.RETRY_HINT, "")));
                isBackupNeeded = true;
            }
        }
    } catch (IOException e) {
        // Tep co ma khong doc duoc (bi khoa, khong co quyen...): bao 1 cau, kho dung du lieu
        // da nap duoc toi luc do
        loadErrorList.add(String.format(Message.ERROR_FILE_READ, filePath, e.getMessage()));
    }
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Bo qua data/books.csv dong 10: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong.<br>
Bo qua data/books.csv dong 11: can 6 cot, co 5 (ten co dau phay phai nam trong ngoac kep).<br>
Bo qua data/books.csv dong 12: loai '4' khong hop le (chi 1 Sach, 2 Tap chi, 3 DVD).<br>
Bo qua data/books.csv dong 13: Trung ISBN 9780134685991 voi Sach B002 "Effective Java". Moi tai lieu chi them 1 lan.<br>
Kho co 7 tai lieu sau khi nap.<br>
…</div>

<h4>Bước 4 — TODO 9.4 lưu qua tệp tạm (35 phút)</h4>
<details><summary>Gợi ý</summary><p>Ba tệp: tệp thật, tệp <code>.tmp</code> cạnh nó, tệp <code>.bak</code>. Writer chỉ sống trong try-with-resources của nó; <code>Files.move</code> đứng SAU khối đó, khi tệp .tmp đã đóng. Một <code>catch (IOException e)</code> bao tất cả, đổi thành <code>StorageException</code>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// GHI tep: viet ca kho ra TEP TAM, dong tep tam, roi moi doi ten de len tep that. Sap giua
// chung thi tep that van la ban cu nguyen ven, khong bao gio con mot nua
private void saveToFile() throws StorageException {
    // Tep that, tep tam canh no, tep sao luu
    File dataFile = new File(filePath);
    File tempFile = new File(filePath + Constants.TEMP_SUFFIX);
    File backupFile = new File(filePath + Constants.BACKUP_SUFFIX);

    try {
        // Lan ghi dau sau khi nap co dong hong: giu tep goc (dong hong se khong duoc ghi lai)
        if (isBackupNeeded &amp;&amp; dataFile.exists()) {
            Files.copy(dataFile.toPath(), backupFile.toPath(),
                    StandardCopyOption.REPLACE_EXISTING);
            isBackupNeeded = false;
        }

        // Thu muc chua tep chua co thi tao (lan chay dau tien)
        if (dataFile.getAbsoluteFile().getParentFile() != null) {
            dataFile.getAbsoluteFile().getParentFile().mkdirs();
        }

        // try-with-resources: close() day bo dem xuong dia; bang ma GHI RO UTF-8
        try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
                new FileOutputStream(tempFile), StandardCharsets.UTF_8))) {
            writer.println(Constants.CSV_HEADER);

            // Moi tai lieu 1 dong
            for (LibraryItem item : memoryRepository.findAllItems()) {
                writer.println(toCsvLine(item));
            }

            // PrintWriter KHONG nem IOException — no chi bat co loi, phai tu hoi
            if (writer.checkError()) {
                throw new IOException(Message.ERROR_WRITER);
            }
        }

        // Tep tam da du va da dong: thay tep that (ghi de neu da co)
        Files.move(tempFile.toPath(), dataFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
        // Boc IOException thanh loi cua kho, giu nguyen nhan goc
        throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                e.getMessage()), e);
    }
}</code></pre>
</details>

<h4>Bước 5 — TODO 9.5 một dòng, rồi chấm (10 phút)</h4>
<pre class="trich"><code class="language-java">// Dong DUY NHAT biet kho cat o dau: Lab 9 doi dung dong nay tu bo nho sang tep CSV
bookRepository = new FileBookRepository(Constants.BOOK_FILE_PATH);</code></pre>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">…<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
3 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
4 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
5 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
…</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 260/260 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab9-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab9-Solution — sạch</div>`),
    bi(`<h2>5. The full solution — and the proof it is right</h2>
<p>The solution zip is the complete project: <code>lint.py</code> 0 violations, <code>javac --release 8</code>, the same output on a real JDK 8 (accents included), and 260/260 on the grader across both runs.</p>
<details><summary>Full run — run 1, then the reopen (260 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Bo qua data/books.csv dong 10: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong.<br>
Bo qua data/books.csv dong 11: can 6 cot, co 5 (ten co dau phay phai nam trong ngoac kep).<br>
Bo qua data/books.csv dong 12: loai '4' khong hop le (chi 1 Sach, 2 Tap chi, 3 DVD).<br>
Bo qua data/books.csv dong 13: Trung ISBN 9780134685991 voi Sach B002 "Effective Java". Moi tai lieu chi them 1 lan.<br>
Kho co 7 tai lieu sau khi nap.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
3 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
4 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
5 &nbsp;&nbsp;T004 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
7 &nbsp;&nbsp;D005 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: ISBN-13: Tac gia: Da them B008 "Clean Code, A Handbook". Thu vien co 8 tai lieu.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma tai lieu (vi du B001, T005, D006): So ban: Da cap nhat so ban cua D005 "The Social Network": 1 -&gt; 0.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Xoa tai lieu ---<br>
Ma tai lieu (vi du B001, T005, D006): Da xoa T004 "Tech Weekly". Ma T004 se khong duoc cap lai.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Don kho ---<br>
Da don kho: xoa 1 tai lieu het ban (D005). Tai lieu het ban dang co nguoi muon duoc giu lai.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
3 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
4 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
5 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
3 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
4 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
5 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Tim tai lieu theo ten ---<br>
Tu khoa: No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Bao cao tac gia ---<br>
Co 4 tac gia (sap A-Z, khong trung):<br>
Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Titles<br>
David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
Martin Fowler &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Robert Martin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.</div>
</details>
<details><summary>The files in data/ after the grader's runs</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/books.csv (386 byte)<br>
loai,ma,ten,nam,so_ban,rieng_1,rieng_2<br>
1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas<br>
1,B002,Effective Java,2018,2,9780134685991,Joshua Bloch<br>
1,B003,"Refactoring, Second Edition",2018,1,9780134757599,Martin Fowler<br>
3,D006,Mắt Biếc,2019,1,117<br>
1,B007,Java Puzzlers,2005,2,9780321336781,Joshua Bloch<br>
1,B008,"Clean Code, A Handbook",2008,2,9780132350884,Robert Martin<br>
── data/books.csv.bak (564 byte)<br>
&lt;BOM&gt;loai,ma,ten,nam,so_ban,rieng_1,rieng_2<br>
1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas<br>
1,B002,Effective Java,2018,2,9780134685991,Joshua Bloch<br>
1,B003,"Refactoring, Second Edition",2018,1,9780134757599,Martin Fowler<br>
2,T004,Tech Weekly,2025,2,118<br>
3,D005,The Social Network,2010,1,120<br>
3,D006,Mắt Biếc,2019,1,117<br>
1,B007,Java Puzzlers,2005,2,9780321336781,Joshua Bloch<br>
<br>
1,B008,Head First Java,20O5,4,9780596009205,Kathy Sierra<br>
2,T009,Java Magazine,2025,1<br>
4,X010,Mystery Box,2020,1,1<br>
1,B011,Effective Java Copy,2018,1,9780134685991,Joshua Bloch</div>
</details>
<details><summary>FileBookRepository — the whole class (CRUD delegated, only load and save are its own)</summary>
<pre><code class="language-java">package repository;

import constants.Constants;
import constants.Message;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import exceptions.DuplicateKeyException;
import exceptions.InvalidInputException;
import exceptions.ItemNotFoundException;
import exceptions.LibraryException;
import exceptions.StorageException;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashSet;
import model.LibraryItem;
import utils.CsvUtils;
import utils.Validation;

/**
 * Ban cai dat THU HAI cua hop dong IBookRepository (Lab 9): du lieu song qua lan tat may, trong
 * tep CSV bang ma UTF-8 (mac dinh data/books.csv). Mo kho = NAP tep (dong hong bi bo qua, bao
 * kem so dong); moi lan THAY DOI = GHI LAI ca tep qua 1 tep tam roi moi thay tep that.
 * Thiet ke: CO (has-a) mot InMemoryBookRepository lam viec CRUD trong bo nho, lop nay chi them
 * phan doc/ghi tep — khong chep lai CRUD, khong ke thua. Controller doi InMemory sang File
 * bang DUNG MOT DONG new; Main khong biet gi.
 *
 * @author CuongThai Academy
 */
public class FileBookRepository implements IBookRepository {

    // Kho trong bo nho lam moi viec CRUD (tim, them, sua, xoa) — lop nay uy quyen cho no
    private InMemoryBookRepository memoryRepository;

    // Duong dan tep du lieu (tuong doi voi thu muc chay chuong trinh)
    private String filePath;

    // Cau bao luc nap: dong hong da bo qua, hoac tep chua co
    private ArrayList&lt;String&gt; loadErrorList;

    // Lan nap co dong hong va CHUA sao luu: lan ghi dau tien phai giu tep goc thanh .bak
    private boolean isBackupNeeded;

    // Tao kho tren tep: kho bo nho rong roi nap tep (khong nem loi: loi nap la cau bao)
    public FileBookRepository(String filePath) {
        this.filePath = filePath;
        memoryRepository = new InMemoryBookRepository();
        loadErrorList = new ArrayList&lt;&gt;();
        isBackupNeeded = false;
        loadFromFile();
    }

    // Them 1 tai lieu (kho bo nho cap ma) roi ghi lai tep
    @Override
    public String addItem(BookRequestDTO bookRequestDTO)
            throws DuplicateKeyException, StorageException {
        // Them trong bo nho truoc (trung khoa thi nem, tep khong doi)
        String newId = memoryRepository.addItem(bookRequestDTO);
        saveToFile();
        return newId;
    }

    // Sua so ban roi ghi lai tep
    @Override
    public void updateCopies(BookRequestDTO bookRequestDTO)
            throws ItemNotFoundException, StorageException {
        memoryRepository.updateCopies(bookRequestDTO);
        saveToFile();
    }

    // Xoa 1 tai lieu roi ghi lai tep
    @Override
    public void deleteItem(String id) throws ItemNotFoundException, StorageException {
        memoryRepository.deleteItem(id);
        saveToFile();
    }

    // Lay ban sao 1 tai lieu theo ma (chi doc bo nho, khong dung toi tep)
    @Override
    public BookResponseDTO findById(String id) throws ItemNotFoundException {
        return memoryRepository.findById(id);
    }

    // Dem so tai lieu
    @Override
    public int countItems() {
        return memoryRepository.countItems();
    }

    // Lay ban sao moi tai lieu
    @Override
    public ArrayList&lt;BookResponseDTO&gt; findAll() {
        return memoryRepository.findAll();
    }

    // Tim theo tu khoa trong ten
    @Override
    public ArrayList&lt;BookResponseDTO&gt; findByKeyword(String keyword) {
        return memoryRepository.findByKeyword(keyword);
    }

    // Don kho trong bo nho; co xoa gi thi ghi lai tep
    @Override
    public ArrayList&lt;String&gt; deleteOutOfStock(HashSet&lt;String&gt; loanedIdSet)
            throws StorageException {
        // Cac ma da xoa (rong thi tep khong can ghi lai)
        ArrayList&lt;String&gt; deletedIdList = memoryRepository.deleteOutOfStock(loanedIdSet);

        // Co thay doi thi ghi
        if (!deletedIdList.isEmpty()) {
            saveToFile();
        }

        return deletedIdList;
    }

    // Cac cau bao luc nap (ban sao, de Controller in)
    @Override
    public ArrayList&lt;String&gt; findLoadErrorList() {
        return new ArrayList&lt;&gt;(loadErrorList);
    }

    // NAP tep: dong 1 (bo BOM) phai la tieu de; moi dong sau la 1 tai lieu. Dong hong bi BO
    // QUA va ghi lai "dong N: ly do" — mot dong hong khong bao gio lam hong ca kho
    private void loadFromFile() {
        // Tep can doc; so dong dang doc (de bao loi); dong vua doc
        File dataFile = new File(filePath);
        int lineNumber = 0;
        String line = "";

        // Lan chay dau tien: chua co tep — kho rong, lan ghi dau tien se tao tep
        if (!dataFile.exists()) {
            loadErrorList.add(String.format(Message.FILE_NOT_FOUND, filePath));
            return;
        }

        // try-with-resources: tu dong close() ke ca khi loi. Bang ma GHI RO UTF-8 — FileReader
        // cua Java 8 dung bang ma mac dinh cua may (Windows: Cp1252, hong chu tieng Viet)
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
            // readLine() tra null khi het tep
            while ((line = reader.readLine()) != null) {
                lineNumber++;

                // Dong 1: bo dau BOM (Excel, Notepad hay them) roi bo qua dong tieu de
                if (lineNumber == Constants.CSV_HEADER_LINE) {
                    line = line.replace(Constants.BOM, "");

                    // Dung tieu de thi sang dong sau (khong phai tieu de: nap nhu dong du lieu)
                    if (line.equals(Constants.CSV_HEADER)) {
                        continue;
                    }
                }

                // Dong trong: bo qua, khong bao
                if (line.trim().isEmpty()) {
                    continue;
                }

                // Nap 1 dong; hong thi ghi ly do kem so dong roi doc tiep dong sau
                try {
                    loadLine(line);
                } catch (InvalidInputException | LibraryException e) {
                    // Cau bao cua Validation viet cho nguoi go phim: bo duoi "Moi nhap lai."
                    loadErrorList.add(String.format(Message.ERROR_CSV_LINE, filePath, lineNumber,
                            e.getMessage().replace(Message.RETRY_HINT, "")));
                    isBackupNeeded = true;
                }
            }
        } catch (IOException e) {
            // Tep co ma khong doc duoc (bi khoa, khong co quyen...): bao 1 cau, kho dung du lieu
            // da nap duoc toi luc do
            loadErrorList.add(String.format(Message.ERROR_FILE_READ, filePath, e.getMessage()));
        }
    }

    // Nap 1 dong du lieu: tach cot (dung ngoac kep), kiem tung cot bang chinh Validation cua
    // man hinh nhap, roi dua kho bo nho them GIU NGUYEN ma
    private void loadLine(String line) throws InvalidInputException, DuplicateKeyException {
        // Cac cot cua dong; phieu tai lieu se dien
        ArrayList&lt;String&gt; columnList = CsvUtils.splitLine(line);
        BookRequestDTO bookRequestDTO = new BookRequestDTO();

        // It hon so cot chung thi chua biet ca loai: dong hong
        if (columnList.size() &lt; Constants.CSV_COMMON_COLUMNS) {
            throw new InvalidInputException(String.format(Message.ERROR_CSV_COLUMNS,
                    Constants.CSV_COMMON_COLUMNS, columnList.size()));
        }

        // Loai quyet dinh so cot rieng: sach 2, tap chi 1, DVD 1
        bookRequestDTO.setItemType(readItemType(columnList.get(Constants.CSV_TYPE_INDEX)));
        checkColumnCount(columnList, bookRequestDTO.getItemType());

        // Phan chung: ten, nam, so ban (cung luat voi man hinh nhap)
        bookRequestDTO.setTitle(Validation.getTitle(columnList.get(Constants.CSV_TITLE_INDEX)));
        bookRequestDTO.setYear(Validation.getYear(columnList.get(Constants.CSV_YEAR_INDEX)));
        bookRequestDTO.setCopies(Validation.getCopies(columnList.get(Constants.CSV_COPIES_INDEX)));

        // Phan rieng cua loai (doc tu cot CSV_EXTRA_INDEX tro di)
        switch (bookRequestDTO.getItemType()) {
            // Sach: ISBN roi tac gia
            case Constants.TYPE_BOOK:
                bookRequestDTO.setIsbn(Validation.getIsbn(
                        columnList.get(Constants.CSV_EXTRA_INDEX)));
                bookRequestDTO.setAuthor(Validation.getAuthor(
                        columnList.get(Constants.CSV_EXTRA_INDEX + 1)));
                break;

            // Tap chi: ky so
            case Constants.TYPE_MAGAZINE:
                bookRequestDTO.setIssueNumber(Validation.getIssueNumber(
                        columnList.get(Constants.CSV_EXTRA_INDEX)));
                break;

            // DVD: so phut
            case Constants.TYPE_DVD:
                bookRequestDTO.setMinutes(Validation.getMinutes(
                        columnList.get(Constants.CSV_EXTRA_INDEX)));
                break;

            // Khong xay ra: readItemType chi tra ve 1 den 3
            default:
                break;
        }

        // Ma lay tu tep (kiem dang B/T/D + 3 so); kho bo nho bao trung ma / trung khoa
        memoryRepository.addLoadedItem(bookRequestDTO,
                Validation.getItemId(columnList.get(Constants.CSV_ID_INDEX)));
    }

    // Doc cot loai (1 sach, 2 tap chi, 3 DVD); sai thi bao bang loi rieng cua tep
    private int readItemType(String column) throws InvalidInputException {
        // Dung lai luat nhap loai cua man hinh, doi cau bao cho hop voi tep
        try {
            return Validation.getItemType(column);
        } catch (InvalidInputException e) {
            // Giu e lam nguyen nhan goc
            throw new InvalidInputException(String.format(Message.ERROR_CSV_TYPE, column), e);
        }
    }

    // Kiem so cot dung voi loai: so cot chung + so cot rieng cua loai
    private void checkColumnCount(ArrayList&lt;String&gt; columnList, int itemType)
            throws InvalidInputException {
        // So cot can co
        int expectedCount = Constants.CSV_COMMON_COLUMNS
                + Constants.CSV_EXTRA_COUNT_ARRAY[itemType - Constants.TYPE_BOOK];

        // Thieu hay thua cot (vd dau phay trong ten ma khong co ngoac kep) deu la dong hong
        if (columnList.size() != expectedCount) {
            throw new InvalidInputException(String.format(Message.ERROR_CSV_COLUMNS,
                    expectedCount, columnList.size()));
        }
    }

    // GHI tep: viet ca kho ra TEP TAM, dong tep tam, roi moi doi ten de len tep that. Sap giua
    // chung thi tep that van la ban cu nguyen ven, khong bao gio con mot nua
    private void saveToFile() throws StorageException {
        // Tep that, tep tam canh no, tep sao luu
        File dataFile = new File(filePath);
        File tempFile = new File(filePath + Constants.TEMP_SUFFIX);
        File backupFile = new File(filePath + Constants.BACKUP_SUFFIX);

        try {
            // Lan ghi dau sau khi nap co dong hong: giu tep goc (dong hong se khong duoc ghi lai)
            if (isBackupNeeded &amp;&amp; dataFile.exists()) {
                Files.copy(dataFile.toPath(), backupFile.toPath(),
                        StandardCopyOption.REPLACE_EXISTING);
                isBackupNeeded = false;
            }

            // Thu muc chua tep chua co thi tao (lan chay dau tien)
            if (dataFile.getAbsoluteFile().getParentFile() != null) {
                dataFile.getAbsoluteFile().getParentFile().mkdirs();
            }

            // try-with-resources: close() day bo dem xuong dia; bang ma GHI RO UTF-8
            try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
                    new FileOutputStream(tempFile), StandardCharsets.UTF_8))) {
                writer.println(Constants.CSV_HEADER);

                // Moi tai lieu 1 dong
                for (LibraryItem item : memoryRepository.findAllItems()) {
                    writer.println(toCsvLine(item));
                }

                // PrintWriter KHONG nem IOException — no chi bat co loi, phai tu hoi
                if (writer.checkError()) {
                    throw new IOException(Message.ERROR_WRITER);
                }
            }

            // Tep tam da du va da dong: thay tep that (ghi de neu da co)
            Files.move(tempFile.toPath(), dataFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            // Boc IOException thanh loi cua kho, giu nguyen nhan goc
            throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                    e.getMessage()), e);
        }
    }

    // Doi 1 tai lieu thanh 1 dong CSV: loai, ma, ten, nam, so ban, roi cac cot rieng cua loai
    // (da hinh: chinh doi tuong tra loi cot rieng cua no). Gia tri co dau phay duoc boc ngoac kep
    private String toCsvLine(LibraryItem item) {
        // Dong dang dung (khong noi chuoi bang +=)
        StringBuilder lineBuilder = new StringBuilder();

        // 5 cot chung
        lineBuilder.append(item.getItemType()).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(item.getId()).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(CsvUtils.toCsvValue(item.getTitle())).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(item.getYear()).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(item.getCopies());

        // Cac cot rieng (sach 2, tap chi 1, DVD 1)
        for (String value : item.getExtraValueArray()) {
            lineBuilder.append(Constants.CSV_SEPARATOR).append(CsvUtils.toCsvValue(value));
        }

        return lineBuilder.toString();
    }
}</code></pre>
</details>
<details><summary>BookController constructor — load messages, samples only for an empty shelf</summary>
<pre class="trich"><code class="language-java">// Tao kho, service, cac view va nap du lieu mau (sach, tap chi, DVD)
public BookController() {
    // Dong DUY NHAT biet kho cat o dau: Lab 9 doi dung dong nay tu bo nho sang tep CSV
    bookRepository = new FileBookRepository(Constants.BOOK_FILE_PATH);
    loanRepository = new LoanRepository();
    bookService = new BookService();
    bookView = new BookView();
    reportView = new ReportView();
    lateFeeView = new LateFeeView();
    typeStatView = new TypeStatView();
    historyView = new HistoryView();
    authorView = new AuthorView();
    topItemView = new TopItemView();

    // Kho tren tep bao lai luc nap (dong hong, tep chua co); kho bo nho: khong co gi
    showLoadResult();

    // Kho rong (bo nho, hoac tep chua co) moi nap du lieu mau; tep da co du lieu thi giu
    if (bookRepository.countItems() == Constants.EMPTY_COUNT) {
        // Nap du lieu mau; loi (trung khoa, ghi tep that bai) thi in ra
        try {
            loadSampleItems();
        } catch (LibraryException e) {
            // Du lieu mau trung khoa hoac khong ghi duoc tep thi bao loi
            showResult(e.getMessage(), new ArrayList&lt;BookResponseDTO&gt;());
        }
    }
}

// In cac cau bao luc nap kho (moi cau 1 dong) roi so tai lieu; khong co cau nao thi im
private void showLoadResult() {
    // Cau bao cua kho (rong voi kho bo nho va voi tep sach)
    ArrayList&lt;String&gt; loadErrorList = bookRepository.findLoadErrorList();

    // Co cau bao thi in tat ca + dong tong ket trong 1 lan goi View
    if (!loadErrorList.isEmpty()) {
        loadErrorList.add(String.format(Message.LOAD_SUMMARY, bookRepository.countItems()));
        showResult(String.join(Constants.NEW_LINE, loadErrorList),
                new ArrayList&lt;BookResponseDTO&gt;());
    }
}</code></pre>
</details>`,
    `<h2>5. Đáp án đầy đủ — và bằng chứng là đúng</h2>
<p>Tệp zip đáp án là trọn dự án: <code>lint.py</code> 0 vi phạm, <code>javac --release 8</code>, chạy trên JDK 8 thật ra y hệt (cả chữ có dấu), và bộ chấm 260/260 qua cả hai lần chạy.</p>
<details><summary>Trọn lần chạy — lần 1, rồi mở lại (260 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Bo qua data/books.csv dong 10: Nam xuat ban phai la 1 so nguyen, khong nhap chu hay de trong.<br>
Bo qua data/books.csv dong 11: can 6 cot, co 5 (ten co dau phay phai nam trong ngoac kep).<br>
Bo qua data/books.csv dong 12: loai '4' khong hop le (chi 1 Sach, 2 Tap chi, 3 DVD).<br>
Bo qua data/books.csv dong 13: Trung ISBN 9780134685991 voi Sach B002 "Effective Java". Moi tai lieu chi them 1 lan.<br>
Kho co 7 tai lieu sau khi nap.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
3 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
4 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
5 &nbsp;&nbsp;T004 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
7 &nbsp;&nbsp;D005 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: ISBN-13: Tac gia: Da them B008 "Clean Code, A Handbook". Thu vien co 8 tai lieu.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma tai lieu (vi du B001, T005, D006): So ban: Da cap nhat so ban cua D005 "The Social Network": 1 -&gt; 0.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Xoa tai lieu ---<br>
Ma tai lieu (vi du B001, T005, D006): Da xoa T004 "Tech Weekly". Ma T004 se khong duoc cap lai.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Don kho ---<br>
Da don kho: xoa 1 tai lieu het ban (D005). Tai lieu het ban dang co nguoi muon duoc giu lai.<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
3 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
4 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
5 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.<br>
===== MO LAI CHUONG TRINH (harness/input-2.txt) =====<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
2 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
3 &nbsp;&nbsp;B007 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Puzzlers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780321336781<br>
4 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;Mắt Biếc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;117 phut<br>
5 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Refactoring, Second Edition &nbsp;&nbsp;Martin Fowler, ISBN 9780134757599<br>
6 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Tim tai lieu theo ten ---<br>
Tu khoa: No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: --- Bao cao tac gia ---<br>
Co 4 tac gia (sap A-Z, khong trung):<br>
Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Titles<br>
David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
Martin Fowler &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
Robert Martin &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
========== CT LIBRARY ==========<br>
1. Them tai lieu (sach, tap chi, DVD)<br>
2. Danh sach tai lieu (sap theo ten)<br>
3. Tim tai lieu theo ten<br>
4. Cap nhat so ban<br>
5. Xoa tai lieu<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
9. Tinh phi tre han<br>
10. Muon tai lieu<br>
11. Tra tai lieu<br>
12. Tim nang cao (loai, khoang nam, tu khoa)<br>
13. Thong ke theo loai<br>
14. Don kho (xoa tai lieu het ban khong ai muon)<br>
15. Lich su muon cua thanh vien<br>
16. Bao cao tac gia<br>
17. Top 5 tai lieu duoc muon nhieu nhat<br>
0. Thoat<br>
Lua chon: Tam biet! Hen gap lai o lan mo sau.</div>
</details>
<details><summary>Các tệp trong data/ sau các lần chạy của bộ chấm</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/books.csv (386 byte)<br>
loai,ma,ten,nam,so_ban,rieng_1,rieng_2<br>
1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas<br>
1,B002,Effective Java,2018,2,9780134685991,Joshua Bloch<br>
1,B003,"Refactoring, Second Edition",2018,1,9780134757599,Martin Fowler<br>
3,D006,Mắt Biếc,2019,1,117<br>
1,B007,Java Puzzlers,2005,2,9780321336781,Joshua Bloch<br>
1,B008,"Clean Code, A Handbook",2008,2,9780132350884,Robert Martin<br>
── data/books.csv.bak (564 byte)<br>
&lt;BOM&gt;loai,ma,ten,nam,so_ban,rieng_1,rieng_2<br>
1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas<br>
1,B002,Effective Java,2018,2,9780134685991,Joshua Bloch<br>
1,B003,"Refactoring, Second Edition",2018,1,9780134757599,Martin Fowler<br>
2,T004,Tech Weekly,2025,2,118<br>
3,D005,The Social Network,2010,1,120<br>
3,D006,Mắt Biếc,2019,1,117<br>
1,B007,Java Puzzlers,2005,2,9780321336781,Joshua Bloch<br>
<br>
1,B008,Head First Java,20O5,4,9780596009205,Kathy Sierra<br>
2,T009,Java Magazine,2025,1<br>
4,X010,Mystery Box,2020,1,1<br>
1,B011,Effective Java Copy,2018,1,9780134685991,Joshua Bloch</div>
</details>
<details><summary>FileBookRepository — trọn lớp (CRUD uỷ quyền, chỉ nạp và ghi là của riêng nó)</summary>
<pre><code class="language-java">package repository;

import constants.Constants;
import constants.Message;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import exceptions.DuplicateKeyException;
import exceptions.InvalidInputException;
import exceptions.ItemNotFoundException;
import exceptions.LibraryException;
import exceptions.StorageException;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashSet;
import model.LibraryItem;
import utils.CsvUtils;
import utils.Validation;

/**
 * Ban cai dat THU HAI cua hop dong IBookRepository (Lab 9): du lieu song qua lan tat may, trong
 * tep CSV bang ma UTF-8 (mac dinh data/books.csv). Mo kho = NAP tep (dong hong bi bo qua, bao
 * kem so dong); moi lan THAY DOI = GHI LAI ca tep qua 1 tep tam roi moi thay tep that.
 * Thiet ke: CO (has-a) mot InMemoryBookRepository lam viec CRUD trong bo nho, lop nay chi them
 * phan doc/ghi tep — khong chep lai CRUD, khong ke thua. Controller doi InMemory sang File
 * bang DUNG MOT DONG new; Main khong biet gi.
 *
 * @author CuongThai Academy
 */
public class FileBookRepository implements IBookRepository {

    // Kho trong bo nho lam moi viec CRUD (tim, them, sua, xoa) — lop nay uy quyen cho no
    private InMemoryBookRepository memoryRepository;

    // Duong dan tep du lieu (tuong doi voi thu muc chay chuong trinh)
    private String filePath;

    // Cau bao luc nap: dong hong da bo qua, hoac tep chua co
    private ArrayList&lt;String&gt; loadErrorList;

    // Lan nap co dong hong va CHUA sao luu: lan ghi dau tien phai giu tep goc thanh .bak
    private boolean isBackupNeeded;

    // Tao kho tren tep: kho bo nho rong roi nap tep (khong nem loi: loi nap la cau bao)
    public FileBookRepository(String filePath) {
        this.filePath = filePath;
        memoryRepository = new InMemoryBookRepository();
        loadErrorList = new ArrayList&lt;&gt;();
        isBackupNeeded = false;
        loadFromFile();
    }

    // Them 1 tai lieu (kho bo nho cap ma) roi ghi lai tep
    @Override
    public String addItem(BookRequestDTO bookRequestDTO)
            throws DuplicateKeyException, StorageException {
        // Them trong bo nho truoc (trung khoa thi nem, tep khong doi)
        String newId = memoryRepository.addItem(bookRequestDTO);
        saveToFile();
        return newId;
    }

    // Sua so ban roi ghi lai tep
    @Override
    public void updateCopies(BookRequestDTO bookRequestDTO)
            throws ItemNotFoundException, StorageException {
        memoryRepository.updateCopies(bookRequestDTO);
        saveToFile();
    }

    // Xoa 1 tai lieu roi ghi lai tep
    @Override
    public void deleteItem(String id) throws ItemNotFoundException, StorageException {
        memoryRepository.deleteItem(id);
        saveToFile();
    }

    // Lay ban sao 1 tai lieu theo ma (chi doc bo nho, khong dung toi tep)
    @Override
    public BookResponseDTO findById(String id) throws ItemNotFoundException {
        return memoryRepository.findById(id);
    }

    // Dem so tai lieu
    @Override
    public int countItems() {
        return memoryRepository.countItems();
    }

    // Lay ban sao moi tai lieu
    @Override
    public ArrayList&lt;BookResponseDTO&gt; findAll() {
        return memoryRepository.findAll();
    }

    // Tim theo tu khoa trong ten
    @Override
    public ArrayList&lt;BookResponseDTO&gt; findByKeyword(String keyword) {
        return memoryRepository.findByKeyword(keyword);
    }

    // Don kho trong bo nho; co xoa gi thi ghi lai tep
    @Override
    public ArrayList&lt;String&gt; deleteOutOfStock(HashSet&lt;String&gt; loanedIdSet)
            throws StorageException {
        // Cac ma da xoa (rong thi tep khong can ghi lai)
        ArrayList&lt;String&gt; deletedIdList = memoryRepository.deleteOutOfStock(loanedIdSet);

        // Co thay doi thi ghi
        if (!deletedIdList.isEmpty()) {
            saveToFile();
        }

        return deletedIdList;
    }

    // Cac cau bao luc nap (ban sao, de Controller in)
    @Override
    public ArrayList&lt;String&gt; findLoadErrorList() {
        return new ArrayList&lt;&gt;(loadErrorList);
    }

    // NAP tep: dong 1 (bo BOM) phai la tieu de; moi dong sau la 1 tai lieu. Dong hong bi BO
    // QUA va ghi lai "dong N: ly do" — mot dong hong khong bao gio lam hong ca kho
    private void loadFromFile() {
        // Tep can doc; so dong dang doc (de bao loi); dong vua doc
        File dataFile = new File(filePath);
        int lineNumber = 0;
        String line = "";

        // Lan chay dau tien: chua co tep — kho rong, lan ghi dau tien se tao tep
        if (!dataFile.exists()) {
            loadErrorList.add(String.format(Message.FILE_NOT_FOUND, filePath));
            return;
        }

        // try-with-resources: tu dong close() ke ca khi loi. Bang ma GHI RO UTF-8 — FileReader
        // cua Java 8 dung bang ma mac dinh cua may (Windows: Cp1252, hong chu tieng Viet)
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new FileInputStream(dataFile), StandardCharsets.UTF_8))) {
            // readLine() tra null khi het tep
            while ((line = reader.readLine()) != null) {
                lineNumber++;

                // Dong 1: bo dau BOM (Excel, Notepad hay them) roi bo qua dong tieu de
                if (lineNumber == Constants.CSV_HEADER_LINE) {
                    line = line.replace(Constants.BOM, "");

                    // Dung tieu de thi sang dong sau (khong phai tieu de: nap nhu dong du lieu)
                    if (line.equals(Constants.CSV_HEADER)) {
                        continue;
                    }
                }

                // Dong trong: bo qua, khong bao
                if (line.trim().isEmpty()) {
                    continue;
                }

                // Nap 1 dong; hong thi ghi ly do kem so dong roi doc tiep dong sau
                try {
                    loadLine(line);
                } catch (InvalidInputException | LibraryException e) {
                    // Cau bao cua Validation viet cho nguoi go phim: bo duoi "Moi nhap lai."
                    loadErrorList.add(String.format(Message.ERROR_CSV_LINE, filePath, lineNumber,
                            e.getMessage().replace(Message.RETRY_HINT, "")));
                    isBackupNeeded = true;
                }
            }
        } catch (IOException e) {
            // Tep co ma khong doc duoc (bi khoa, khong co quyen...): bao 1 cau, kho dung du lieu
            // da nap duoc toi luc do
            loadErrorList.add(String.format(Message.ERROR_FILE_READ, filePath, e.getMessage()));
        }
    }

    // Nap 1 dong du lieu: tach cot (dung ngoac kep), kiem tung cot bang chinh Validation cua
    // man hinh nhap, roi dua kho bo nho them GIU NGUYEN ma
    private void loadLine(String line) throws InvalidInputException, DuplicateKeyException {
        // Cac cot cua dong; phieu tai lieu se dien
        ArrayList&lt;String&gt; columnList = CsvUtils.splitLine(line);
        BookRequestDTO bookRequestDTO = new BookRequestDTO();

        // It hon so cot chung thi chua biet ca loai: dong hong
        if (columnList.size() &lt; Constants.CSV_COMMON_COLUMNS) {
            throw new InvalidInputException(String.format(Message.ERROR_CSV_COLUMNS,
                    Constants.CSV_COMMON_COLUMNS, columnList.size()));
        }

        // Loai quyet dinh so cot rieng: sach 2, tap chi 1, DVD 1
        bookRequestDTO.setItemType(readItemType(columnList.get(Constants.CSV_TYPE_INDEX)));
        checkColumnCount(columnList, bookRequestDTO.getItemType());

        // Phan chung: ten, nam, so ban (cung luat voi man hinh nhap)
        bookRequestDTO.setTitle(Validation.getTitle(columnList.get(Constants.CSV_TITLE_INDEX)));
        bookRequestDTO.setYear(Validation.getYear(columnList.get(Constants.CSV_YEAR_INDEX)));
        bookRequestDTO.setCopies(Validation.getCopies(columnList.get(Constants.CSV_COPIES_INDEX)));

        // Phan rieng cua loai (doc tu cot CSV_EXTRA_INDEX tro di)
        switch (bookRequestDTO.getItemType()) {
            // Sach: ISBN roi tac gia
            case Constants.TYPE_BOOK:
                bookRequestDTO.setIsbn(Validation.getIsbn(
                        columnList.get(Constants.CSV_EXTRA_INDEX)));
                bookRequestDTO.setAuthor(Validation.getAuthor(
                        columnList.get(Constants.CSV_EXTRA_INDEX + 1)));
                break;

            // Tap chi: ky so
            case Constants.TYPE_MAGAZINE:
                bookRequestDTO.setIssueNumber(Validation.getIssueNumber(
                        columnList.get(Constants.CSV_EXTRA_INDEX)));
                break;

            // DVD: so phut
            case Constants.TYPE_DVD:
                bookRequestDTO.setMinutes(Validation.getMinutes(
                        columnList.get(Constants.CSV_EXTRA_INDEX)));
                break;

            // Khong xay ra: readItemType chi tra ve 1 den 3
            default:
                break;
        }

        // Ma lay tu tep (kiem dang B/T/D + 3 so); kho bo nho bao trung ma / trung khoa
        memoryRepository.addLoadedItem(bookRequestDTO,
                Validation.getItemId(columnList.get(Constants.CSV_ID_INDEX)));
    }

    // Doc cot loai (1 sach, 2 tap chi, 3 DVD); sai thi bao bang loi rieng cua tep
    private int readItemType(String column) throws InvalidInputException {
        // Dung lai luat nhap loai cua man hinh, doi cau bao cho hop voi tep
        try {
            return Validation.getItemType(column);
        } catch (InvalidInputException e) {
            // Giu e lam nguyen nhan goc
            throw new InvalidInputException(String.format(Message.ERROR_CSV_TYPE, column), e);
        }
    }

    // Kiem so cot dung voi loai: so cot chung + so cot rieng cua loai
    private void checkColumnCount(ArrayList&lt;String&gt; columnList, int itemType)
            throws InvalidInputException {
        // So cot can co
        int expectedCount = Constants.CSV_COMMON_COLUMNS
                + Constants.CSV_EXTRA_COUNT_ARRAY[itemType - Constants.TYPE_BOOK];

        // Thieu hay thua cot (vd dau phay trong ten ma khong co ngoac kep) deu la dong hong
        if (columnList.size() != expectedCount) {
            throw new InvalidInputException(String.format(Message.ERROR_CSV_COLUMNS,
                    expectedCount, columnList.size()));
        }
    }

    // GHI tep: viet ca kho ra TEP TAM, dong tep tam, roi moi doi ten de len tep that. Sap giua
    // chung thi tep that van la ban cu nguyen ven, khong bao gio con mot nua
    private void saveToFile() throws StorageException {
        // Tep that, tep tam canh no, tep sao luu
        File dataFile = new File(filePath);
        File tempFile = new File(filePath + Constants.TEMP_SUFFIX);
        File backupFile = new File(filePath + Constants.BACKUP_SUFFIX);

        try {
            // Lan ghi dau sau khi nap co dong hong: giu tep goc (dong hong se khong duoc ghi lai)
            if (isBackupNeeded &amp;&amp; dataFile.exists()) {
                Files.copy(dataFile.toPath(), backupFile.toPath(),
                        StandardCopyOption.REPLACE_EXISTING);
                isBackupNeeded = false;
            }

            // Thu muc chua tep chua co thi tao (lan chay dau tien)
            if (dataFile.getAbsoluteFile().getParentFile() != null) {
                dataFile.getAbsoluteFile().getParentFile().mkdirs();
            }

            // try-with-resources: close() day bo dem xuong dia; bang ma GHI RO UTF-8
            try (PrintWriter writer = new PrintWriter(new OutputStreamWriter(
                    new FileOutputStream(tempFile), StandardCharsets.UTF_8))) {
                writer.println(Constants.CSV_HEADER);

                // Moi tai lieu 1 dong
                for (LibraryItem item : memoryRepository.findAllItems()) {
                    writer.println(toCsvLine(item));
                }

                // PrintWriter KHONG nem IOException — no chi bat co loi, phai tu hoi
                if (writer.checkError()) {
                    throw new IOException(Message.ERROR_WRITER);
                }
            }

            // Tep tam da du va da dong: thay tep that (ghi de neu da co)
            Files.move(tempFile.toPath(), dataFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            // Boc IOException thanh loi cua kho, giu nguyen nhan goc
            throw new StorageException(String.format(Message.ERROR_FILE_WRITE, filePath,
                    e.getMessage()), e);
        }
    }

    // Doi 1 tai lieu thanh 1 dong CSV: loai, ma, ten, nam, so ban, roi cac cot rieng cua loai
    // (da hinh: chinh doi tuong tra loi cot rieng cua no). Gia tri co dau phay duoc boc ngoac kep
    private String toCsvLine(LibraryItem item) {
        // Dong dang dung (khong noi chuoi bang +=)
        StringBuilder lineBuilder = new StringBuilder();

        // 5 cot chung
        lineBuilder.append(item.getItemType()).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(item.getId()).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(CsvUtils.toCsvValue(item.getTitle())).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(item.getYear()).append(Constants.CSV_SEPARATOR);
        lineBuilder.append(item.getCopies());

        // Cac cot rieng (sach 2, tap chi 1, DVD 1)
        for (String value : item.getExtraValueArray()) {
            lineBuilder.append(Constants.CSV_SEPARATOR).append(CsvUtils.toCsvValue(value));
        }

        return lineBuilder.toString();
    }
}</code></pre>
</details>
<details><summary>Constructor của BookController — câu báo lúc nạp, tài liệu mẫu chỉ khi kho rỗng</summary>
<pre class="trich"><code class="language-java">// Tao kho, service, cac view va nap du lieu mau (sach, tap chi, DVD)
public BookController() {
    // Dong DUY NHAT biet kho cat o dau: Lab 9 doi dung dong nay tu bo nho sang tep CSV
    bookRepository = new FileBookRepository(Constants.BOOK_FILE_PATH);
    loanRepository = new LoanRepository();
    bookService = new BookService();
    bookView = new BookView();
    reportView = new ReportView();
    lateFeeView = new LateFeeView();
    typeStatView = new TypeStatView();
    historyView = new HistoryView();
    authorView = new AuthorView();
    topItemView = new TopItemView();

    // Kho tren tep bao lai luc nap (dong hong, tep chua co); kho bo nho: khong co gi
    showLoadResult();

    // Kho rong (bo nho, hoac tep chua co) moi nap du lieu mau; tep da co du lieu thi giu
    if (bookRepository.countItems() == Constants.EMPTY_COUNT) {
        // Nap du lieu mau; loi (trung khoa, ghi tep that bai) thi in ra
        try {
            loadSampleItems();
        } catch (LibraryException e) {
            // Du lieu mau trung khoa hoac khong ghi duoc tep thi bao loi
            showResult(e.getMessage(), new ArrayList&lt;BookResponseDTO&gt;());
        }
    }
}

// In cac cau bao luc nap kho (moi cau 1 dong) roi so tai lieu; khong co cau nao thi im
private void showLoadResult() {
    // Cau bao cua kho (rong voi kho bo nho va voi tep sach)
    ArrayList&lt;String&gt; loadErrorList = bookRepository.findLoadErrorList();

    // Co cau bao thi in tat ca + dong tong ket trong 1 lan goi View
    if (!loadErrorList.isEmpty()) {
        loadErrorList.add(String.format(Message.LOAD_SUMMARY, bookRepository.countItems()));
        showResult(String.join(Constants.NEW_LINE, loadErrorList),
                new ArrayList&lt;BookResponseDTO&gt;());
    }
}</code></pre>
</details>`),
    bi(`<h2>6. Traps (with real output)</h2>
<div class="pitfall"><p><strong>Trap 1 — split(",").</strong> 8 columns instead of 7: see Step 1.</p></div>
<div class="pitfall"><p><strong>Trap 2 — the machine's encoding.</strong> UTF-8 bytes read as windows-1252, and the invisible BOM:</p></div>
<pre><code class="language-java">// release: 8
// Lab 9 — the same bytes read with two encodings
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class LabBangMa {
    public static void main(String[] args) {
        String title = "M\\u1eaft Bi\\u1ebfc";   // "Mắt Biếc" written with escapes
        byte[] bytes = title.getBytes(StandardCharsets.UTF_8);
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(String.format("%02X ", b));
        }
        System.out.println(title.length() + " chars -&gt; " + bytes.length + " bytes in UTF-8: " + hex.toString().trim());
        System.out.println("read as UTF-8       : " + new String(bytes, StandardCharsets.UTF_8));
        System.out.println("read as windows-1252: " + new String(bytes, Charset.forName("windows-1252")));
        System.out.println("read as ISO-8859-1  : " + new String(bytes, StandardCharsets.ISO_8859_1).length() + " chars, still wrong");
        // a BOM is three bytes EF BB BF, read back as one invisible char U+FEFF
        byte[] bom = {(byte) 0xEF, (byte) 0xBB, (byte) 0xBF, 'l', 'o', 'a', 'i'};
        String first = new String(bom, StandardCharsets.UTF_8);
        System.out.println("BOM + \\"loai\\": length " + first.length() + ", equals(\\"loai\\") " + first.equals("loai")
                + ", after replace(\\"\\\\uFEFF\\", \\"\\") " + first.replace("\\uFEFF", "").equals("loai"));
    }
}</code></pre>
<div class="out">8 chars -&gt; 12 bytes in UTF-8: 4D E1 BA AF 74 20 42 69 E1 BA BF 63<br>
read as UTF-8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Mắt Biếc<br>
read as windows-1252: Máº¯t Biáº¿c<br>
read as ISO-8859-1 &nbsp;: 12 chars, still wrong<br>
BOM + "loai": length 5, equals("loai") false, after replace("\\uFEFF", "") true</div>
<div class="pitfall"><p><strong>Trap 3 — keeping the BOM.</strong> The header becomes "data" with type "loai" (project <code>bay/quen-bom</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Bo qua data/books.csv dong 1: loai '⟨BOM⟩loai' khong hop le (chi 1 Sach, 2 Tap chi, 3 DVD).<br>
…</div>
<div class="pitfall"><p><strong>Trap 4 — no quotes.</strong> Written without quotes, read back as 8 columns — two books lost at the reopen (project <code>bay/khong-quote</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/books.csv (382 byte)<br>
loai,ma,ten,nam,so_ban,rieng_1,rieng_2<br>
1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas<br>
1,B002,Effective Java,2018,2,9780134685991,Joshua Bloch<br>
1,B003,Refactoring, Second Edition,2018,1,9780134757599,Martin Fowler<br>
3,D006,Mắt Biếc,2019,1,117<br>
1,B007,Java Puzzlers,2005,2,9780321336781,Joshua Bloch<br>
1,B008,Clean Code, A Handbook,2008,2,9780132350884,Robert Martin<br>
…</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 166:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: ========== CT LIBRARY ==========<br>
&nbsp;&nbsp;ban in : Bo qua data/books.csv dong 4: can 7 cot, co 8 (ten co dau phay phai nam trong ngoac kep).<br>
…</div>
<div class="pitfall"><p><strong>Trap 5 — forgetting close().</strong> The .tmp never received its buffer: 0 bytes replace the shelf (project <code>bay/quen-close</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/books.csv (0 byte)<br>
…</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 187:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
&nbsp;&nbsp;ban in : 1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
…</div>
<p>And why a PrintWriter cannot warn you by itself — then why the temp file is worth it:</p>
<pre><code class="language-java">// release: 8
// Lab 9 — PrintWriter never throws: it only raises a flag
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

public class LabPrintWriterImLang {
    public static void main(String[] args) throws IOException {
        File file = File.createTempFile("lab9-", ".csv");
        FileOutputStream stream = new FileOutputStream(file);
        stream.close();   // the stream is already closed — every write will fail
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(stream, StandardCharsets.UTF_8));
        writer.println("loai,ma,ten,nam,so_ban,rieng_1,rieng_2");
        writer.println("1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas");
        writer.flush();
        System.out.println("println x2 + flush: no exception at all");
        System.out.println("checkError()      : " + writer.checkError());
        System.out.println("file size         : " + file.length() + " bytes");
        writer.close();
        file.delete();
    }
}</code></pre>
<div class="out">println x2 + flush: no exception at all<br>
checkError() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: true<br>
file size &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 0 bytes</div>
<pre><code class="language-java">// release: 8
// Lab 9 — a save that crashes half-way: write in place vs write to a temp file then move
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

public class LabTepTam {
    static final String[] ROWS = {"1,B001,The Pragmatic Programmer", "1,B002,Effective Java", "1,B003,Clean Code"};

    public static void main(String[] args) throws IOException {
        File dir = Files.createTempDirectory("lab9").toFile();
        File direct = new File(dir, "direct.csv");
        File safe = new File(dir, "safe.csv");
        save(direct, ROWS.length);
        save(safe, ROWS.length);
        System.out.println("before: direct " + lines(direct) + " lines, safe " + lines(safe) + " lines");

        // the power goes off after 1 of 3 rows
        try {
            save(direct, 1);
        } catch (IllegalStateException e) {
            System.out.println("in place  : crash -&gt; direct.csv now has " + lines(direct) + " line(s)");
        }
        File tmp = new File(dir, "safe.csv.tmp");
        try {
            save(tmp, 1);
            Files.move(tmp.toPath(), safe.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IllegalStateException e) {
            System.out.println("temp+move : crash -&gt; safe.csv still has " + lines(safe) + " lines (the .tmp is the broken one)");
        }
    }

    // writes ROWS but "crashes" after &#96;limit&#96; rows when limit &lt; ROWS.length
    static void save(File file, int limit) throws IOException {
        try (PrintWriter writer = new PrintWriter(file, StandardCharsets.UTF_8.name())) {
            for (int i = 0; i &lt; ROWS.length; i++) {
                if (i == limit) {
                    throw new IllegalStateException("power off");
                }
                writer.println(ROWS[i]);
            }
        }
    }

    static int lines(File file) throws IOException {
        return Files.readAllLines(file.toPath(), StandardCharsets.UTF_8).size();
    }
}</code></pre>
<div class="out">before: direct 3 lines, safe 3 lines<br>
in place &nbsp;: crash -&gt; direct.csv now has 1 line(s)<br>
temp+move : crash -&gt; safe.csv still has 3 lines (the .tmp is the broken one)</div>`,
    `<h2>6. Bẫy (kèm output thật)</h2>
<div class="pitfall"><p><strong>Bẫy 1 — split(",").</strong> 8 cột thay vì 7: xem Bước 1.</p></div>
<div class="pitfall"><p><strong>Bẫy 2 — bảng mã của máy.</strong> Byte UTF-8 đọc bằng windows-1252, và BOM vô hình:</p></div>
<pre><code class="language-java">// release: 8
// Lab 9 — cùng các byte, đọc bằng hai bảng mã
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class LabBangMa {
    public static void main(String[] args) {
        String title = "M\\u1eaft Bi\\u1ebfc";   // viết bằng mã thoát
        byte[] bytes = title.getBytes(StandardCharsets.UTF_8);
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(String.format("%02X ", b));
        }
        System.out.println(title.length() + " chars -&gt; " + bytes.length + " bytes in UTF-8: " + hex.toString().trim());
        System.out.println("read as UTF-8       : " + new String(bytes, StandardCharsets.UTF_8));
        System.out.println("read as windows-1252: " + new String(bytes, Charset.forName("windows-1252")));
        System.out.println("read as ISO-8859-1  : " + new String(bytes, StandardCharsets.ISO_8859_1).length() + " chars, still wrong");
        // BOM là ba byte EF BB BF, đọc ra một ký tự vô hình U+FEFF
        byte[] bom = {(byte) 0xEF, (byte) 0xBB, (byte) 0xBF, 'l', 'o', 'a', 'i'};
        String first = new String(bom, StandardCharsets.UTF_8);
        System.out.println("BOM + \\"loai\\": length " + first.length() + ", equals(\\"loai\\") " + first.equals("loai")
                + ", after replace(\\"\\\\uFEFF\\", \\"\\") " + first.replace("\\uFEFF", "").equals("loai"));
    }
}</code></pre>
<div class="out">8 chars -&gt; 12 bytes in UTF-8: 4D E1 BA AF 74 20 42 69 E1 BA BF 63<br>
read as UTF-8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Mắt Biếc<br>
read as windows-1252: Máº¯t Biáº¿c<br>
read as ISO-8859-1 &nbsp;: 12 chars, still wrong<br>
BOM + "loai": length 5, equals("loai") false, after replace("\\uFEFF", "") true</div>
<div class="pitfall"><p><strong>Bẫy 3 — giữ lại BOM.</strong> Dòng tiêu đề thành "dữ liệu" với loại "loai" (dự án <code>bay/quen-bom</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)</code></pre>
<div class="out">Bo qua data/books.csv dong 1: loai '⟨BOM⟩loai' khong hop le (chi 1 Sach, 2 Tap chi, 3 DVD).<br>
…</div>
<div class="pitfall"><p><strong>Bẫy 4 — không ngoặc kép.</strong> Ghi không ngoặc kép, đọc về thành 8 cột — mất hai cuốn khi mở lại (dự án <code>bay/khong-quote</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/books.csv (382 byte)<br>
loai,ma,ten,nam,so_ban,rieng_1,rieng_2<br>
1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas<br>
1,B002,Effective Java,2018,2,9780134685991,Joshua Bloch<br>
1,B003,Refactoring, Second Edition,2018,1,9780134757599,Martin Fowler<br>
3,D006,Mắt Biếc,2019,1,117<br>
1,B007,Java Puzzlers,2005,2,9780321336781,Joshua Bloch<br>
1,B008,Clean Code, A Handbook,2008,2,9780132350884,Robert Martin<br>
…</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 166:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: ========== CT LIBRARY ==========<br>
&nbsp;&nbsp;ban in : Bo qua data/books.csv dong 4: can 7 cot, co 8 (ten co dau phay phai nam trong ngoac kep).<br>
…</div>
<div class="pitfall"><p><strong>Bẫy 5 — quên close().</strong> Tệp .tmp chưa bao giờ nhận được bộ đệm: 0 byte thay cả kệ sách (dự án <code>bay/quen-close</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ mkdir -p data &amp;&amp; cp harness/data/* data/        # du lieu mau, nhu bo cham
$ java -cp build main.Main &lt; harness/input.txt
$ java -cp build main.Main &lt; harness/input-2.txt   # MO LAI chuong trinh (lan 2)
$ cat data/*</code></pre>
<div class="out">── data/books.csv (0 byte)<br>
…</div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 187:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: 1 &nbsp;&nbsp;B008 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2008 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Clean Code, A Handbook &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Robert Martin, ISBN 9780132350884<br>
&nbsp;&nbsp;ban in : 1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
…</div>
<p>Và vì sao một PrintWriter tự nó không báo được cho bạn — rồi vì sao tệp tạm đáng công:</p>
<pre><code class="language-java">// release: 8
// Lab 9 — PrintWriter không bao giờ ném lỗi: nó chỉ bật một cờ
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

public class LabPrintWriterImLang {
    public static void main(String[] args) throws IOException {
        File file = File.createTempFile("lab9-", ".csv");
        FileOutputStream stream = new FileOutputStream(file);
        stream.close();   // luồng đã đóng — mọi lần ghi sẽ hỏng
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(stream, StandardCharsets.UTF_8));
        writer.println("loai,ma,ten,nam,so_ban,rieng_1,rieng_2");
        writer.println("1,B001,The Pragmatic Programmer,2019,3,9780135957059,David Thomas");
        writer.flush();
        System.out.println("println x2 + flush: no exception at all");
        System.out.println("checkError()      : " + writer.checkError());
        System.out.println("file size         : " + file.length() + " bytes");
        writer.close();
        file.delete();
    }
}</code></pre>
<div class="out">println x2 + flush: no exception at all<br>
checkError() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: true<br>
file size &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 0 bytes</div>
<pre><code class="language-java">// release: 8
// Lab 9 — lần lưu sập giữa chừng: ghi thẳng vào tệp so với ghi tệp tạm rồi move
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

public class LabTepTam {
    static final String[] ROWS = {"1,B001,The Pragmatic Programmer", "1,B002,Effective Java", "1,B003,Clean Code"};

    public static void main(String[] args) throws IOException {
        File dir = Files.createTempDirectory("lab9").toFile();
        File direct = new File(dir, "direct.csv");
        File safe = new File(dir, "safe.csv");
        save(direct, ROWS.length);
        save(safe, ROWS.length);
        System.out.println("before: direct " + lines(direct) + " lines, safe " + lines(safe) + " lines");

        // mất điện sau 1 trên 3 dòng
        try {
            save(direct, 1);
        } catch (IllegalStateException e) {
            System.out.println("in place  : crash -&gt; direct.csv now has " + lines(direct) + " line(s)");
        }
        File tmp = new File(dir, "safe.csv.tmp");
        try {
            save(tmp, 1);
            Files.move(tmp.toPath(), safe.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IllegalStateException e) {
            System.out.println("temp+move : crash -&gt; safe.csv still has " + lines(safe) + " lines (the .tmp is the broken one)");
        }
    }

    // ghi ROWS nhưng "sập" sau &#96;limit&#96; dòng khi limit &lt; ROWS.length
    static void save(File file, int limit) throws IOException {
        try (PrintWriter writer = new PrintWriter(file, StandardCharsets.UTF_8.name())) {
            for (int i = 0; i &lt; ROWS.length; i++) {
                if (i == limit) {
                    throw new IllegalStateException("power off");
                }
                writer.println(ROWS[i]);
            }
        }
    }

    static int lines(File file) throws IOException {
        return Files.readAllLines(file.toPath(), StandardCharsets.UTF_8).size();
    }
}</code></pre>
<div class="out">before: direct 3 lines, safe 3 lines<br>
in place &nbsp;: crash -&gt; direct.csv now has 1 line(s)<br>
temp+move : crash -&gt; safe.csv still has 3 lines (the .tmp is the broken one)</div>`),
    bi(`<h2>7. Rubric (10 points) and self-check</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Quote-aware <code>splitLine</code> + <code>toCsvValue</code> (9.1, 9.3)</td><td>2</td><td>grader lines 140, 187, 214 + read</td></tr>
<tr><td>Load: UTF-8 named, BOM, header, broken lines reported with numbers (9.2)</td><td>3</td><td>grader lines 1–5, 27–33</td></tr>
<tr><td>Save: try-with-resources, .tmp then <code>Files.move</code>, <code>checkError</code>, <code>StorageException</code> (9.4)</td><td>2</td><td>grader lines 185–192 + read</td></tr>
<tr><td>One line switches the storage, <code>Main</code> unchanged (9.5)</td><td>2</td><td><code>git diff</code> + read</td></tr>
<tr><td>Oral: "why so little to change?"</td><td>1</td><td>one question</td></tr>
</tbody>
</table>
<details><summary>1. Why must the encoding be named in InputStreamReader / OutputStreamWriter on JDK 8?</summary><p class="dap-an">✅ Without it Java uses the machine's default charset (Cp1252 on many Windows machines): the same file reads differently on different computers, and Vietnamese accents break.</p></details>
<details><summary>2. Why write to books.csv.tmp first instead of straight to books.csv?</summary><p class="dap-an">✅ If the program stops half-way, only the temporary file is incomplete; the real file is replaced only after the new one is complete and closed.</p></details>
<details><summary>3. Why does FileBookRepository hold an InMemoryBookRepository instead of extending it?</summary><p class="dap-an">✅ An override may not throw a new checked exception: the subclass could not report a failed save with StorageException. Holding one reuses all the CRUD and keeps the interface's contract.</p></details>`,
    `<h2>7. Rubric (10 điểm) và tự kiểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Kiểm bằng</th></tr></thead>
<tbody>
<tr><td><code>splitLine</code> hiểu ngoặc kép + <code>toCsvValue</code> (9.1, 9.3)</td><td>2</td><td>dòng 140, 187, 214 của bộ chấm + đọc</td></tr>
<tr><td>Nạp: gọi tên UTF-8, BOM, tiêu đề, báo dòng hỏng kèm số dòng (9.2)</td><td>3</td><td>dòng 1–5, 27–33 của bộ chấm</td></tr>
<tr><td>Lưu: try-with-resources, .tmp rồi <code>Files.move</code>, <code>checkError</code>, <code>StorageException</code> (9.4)</td><td>2</td><td>dòng 185–192 của bộ chấm + đọc</td></tr>
<tr><td>Một dòng chuyển nơi lưu, <code>Main</code> không đổi (9.5)</td><td>2</td><td><code>git diff</code> + đọc</td></tr>
<tr><td>Vấn đáp: "vì sao đổi ít vậy?"</td><td>1</td><td>một câu hỏi</td></tr>
</tbody>
</table>
<details><summary>1. Vì sao trên JDK 8 phải gọi tên bảng mã ở InputStreamReader / OutputStreamWriter?</summary><p class="dap-an">✅ Không gọi tên thì Java dùng bảng mã mặc định của máy (nhiều máy Windows là Cp1252): cùng một tệp đọc ra khác nhau trên các máy khác nhau, và dấu tiếng Việt vỡ.</p></details>
<details><summary>2. Vì sao ghi ra books.csv.tmp trước thay vì ghi thẳng vào books.csv?</summary><p class="dap-an">✅ Chương trình dừng giữa chừng thì chỉ tệp tạm thiếu; tệp thật chỉ bị thay sau khi tệp mới đã đủ và đã đóng.</p></details>
<details><summary>3. Vì sao FileBookRepository giữ một InMemoryBookRepository thay vì kế thừa nó?</summary><p class="dap-an">✅ Bản ghi đè không được ném ngoại lệ checked mới: lớp con không báo được lần lưu thất bại bằng StorageException. Giữ một kho bộ nhớ thì dùng lại được toàn bộ CRUD mà vẫn đúng hợp đồng của interface.</p></details>`),
    bi(`<h2>8. Extra challenges and what comes next</h2>
<ul>
<li>⭐ Save members and loans too: <code>IMemberRepository</code> + <code>FileMemberRepository</code> (<code>members.csv</code>), <code>ILoanRepository</code> + <code>FileLoanRepository</code> (<code>loans.csv</code>) — the same pattern, and the end of "copies lowered but nobody holds it" after a restart.</li>
<li>⭐ Keep the next item number in the file (a second header line, or a small <code>meta.csv</code>) so that a deleted highest id is never given again after a restart.</li>
<li>⭐⭐ A binary backup with <code>DataOutputStream</code> (Chapter 9.C): write the count, then each item field by field; read it back mirror-wise, and compare the sizes of the two files.</li>
</ul>
<div class="callout"><p><strong>Next — the final project, CT Library 1.0:</strong> all three files, a report exported to a file, and the review checklist of LAB211 from start to end. After that, the same <code>IBookRepository</code> gets a third implementation on PostgreSQL — with <code>Main</code>, once more, unchanged.</p></div>`,
    `<h2>8. Thử thách thêm và việc tiếp theo</h2>
<ul>
<li>⭐ Lưu cả thành viên và lượt mượn: <code>IMemberRepository</code> + <code>FileMemberRepository</code> (<code>members.csv</code>), <code>ILoanRepository</code> + <code>FileLoanRepository</code> (<code>loans.csv</code>) — cùng một khuôn, và hết cảnh "số bản đã trừ mà không ai giữ" sau khi khởi động lại.</li>
<li>⭐ Giữ số thứ tự kế tiếp trong tệp (một dòng tiêu đề thứ hai, hoặc một tệp nhỏ <code>meta.csv</code>) để mã lớn nhất đã xoá không bao giờ được cấp lại sau khi khởi động lại.</li>
<li>⭐⭐ Bản sao lưu nhị phân bằng <code>DataOutputStream</code> (Chương 9.C): ghi số lượng, rồi từng tài liệu theo từng trường; đọc về soi gương, và so kích thước hai tệp.</li>
</ul>
<div class="callout"><p><strong>Tiếp theo — dự án cuối khoá CT Library 1.0:</strong> đủ cả ba tệp, một báo cáo xuất ra tệp, và checklist review LAB211 từ đầu tới cuối. Sau đó, cùng <code>IBookRepository</code> có bản cài thứ ba trên PostgreSQL — và <code>Main</code>, một lần nữa, không đổi.</p></div>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch9) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Which statement about the class java.io.File is TRUE?|||Phát biểu nào về lớp java.io.File là ĐÚNG?',
      options: ['It has read() and write() methods to access the content of the file|||Nó có các phương thức read() và write() để truy cập nội dung file', 'new File("x.txt") creates the file x.txt on the disk|||new File("x.txt") tạo file x.txt trên đĩa', 'It describes a file or a directory (name, size, existence…); reading the content needs a stream|||Nó mô tả một file hay thư mục (tên, kích thước, có tồn tại không…); đọc nội dung thì cần một luồng', 'It has only one constructor, which takes a path string|||Nó chỉ có một hàm tạo, nhận một chuỗi đường dẫn'],
      correctIndex: 2,
      points: 1,
      explanation: 'File only asks the operating system about a file: exists(), length(), isDirectory(), list(), mkdirs(), renameTo(), delete() — no method reads or writes data (A), for that you open a FileReader or FileInputStream. new File("x.txt") is just a name; nothing exists until createNewFile() or a stream creates it (B). File has four constructors: (String), (String, String), (File, String), (URI) (D).|||File chỉ hỏi hệ điều hành VỀ một file: exists(), length(), isDirectory(), list(), mkdirs(), renameTo(), delete() — không phương thức nào đọc hay ghi dữ liệu (A sai), muốn vậy phải mở FileReader hay FileInputStream. new File("x.txt") chỉ là một cái tên; chưa có gì tồn tại cho tới khi createNewFile() hoặc một luồng tạo ra nó (B sai). File có bốn hàm tạo: (String), (String, String), (File, String), (URI) (D sai).' },
    { id: 'q2',
      question: '(FE question type) test.txt holds four lines: Hello / Xin chao / Hallo / Anyong Haseyo. What is printed?|||(Dạng câu FE) test.txt có bốn dòng: Hello / Xin chao / Hallo / Anyong Haseyo. Chương trình in ra gì?',
      code: `File f = new File("test.txt");          // Hello / Xin chao / Hallo / Anyong Haseyo
try {
    FileReader fr = new FileReader(f);
    BufferedReader bf = new BufferedReader(fr);
    int k = 2;
    String line = "";
    for (int i = 0; i < k; i++) {
        line = bf.readLine();
    }
    System.out.println(line);
} catch (IOException e) {
    System.out.println(e);
}`,
      codeLang: 'java',
      options: ['Hello|||Hello', 'Xin chao|||Xin chao', 'Hallo|||Hallo', 'null|||null'],
      correctIndex: 1,
      points: 1,
      explanation: 'Each call of readLine() returns the NEXT line and moves on. The loop runs k = 2 times: the first call returns "Hello", the second "Xin chao", which is the value left in line when the loop ends. null would only come after the fourth line (end of file).|||Mỗi lần gọi readLine() trả về dòng KẾ TIẾP rồi đi tiếp. Vòng lặp chạy k = 2 lần: lần đầu trả "Hello", lần hai "Xin chao", đó là giá trị còn lại trong line khi vòng lặp kết thúc. null chỉ xuất hiện sau dòng thứ tư (hết file).' },
    { id: 'q3',
      question: 'On a lab PC with English Windows and JDK 8, a program reads a UTF-8 file of Vietnamese names with new BufferedReader(new FileReader("names.txt")). "Nguyễn" is printed as "Nguyá»…n". What is the cause and the fix?|||Trên máy phòng lab Windows tiếng Anh với JDK 8, một chương trình đọc file UTF-8 chứa tên tiếng Việt bằng new BufferedReader(new FileReader("names.txt")). "Nguyễn" bị in thành "Nguyá»…n". Nguyên nhân và cách sửa là gì?',
      options: ["FileReader decodes with the machine's default encoding (windows-1252); use new InputStreamReader(new FileInputStream(\"names.txt\"), \"UTF-8\")|||FileReader giải mã bằng bảng mã mặc định của máy (windows-1252); dùng new InputStreamReader(new FileInputStream(\"names.txt\"), \"UTF-8\")", 'BufferedReader cannot read Unicode; use FileInputStream.read() byte by byte instead|||BufferedReader không đọc được Unicode; thay bằng FileInputStream.read() từng byte', 'The file is damaged; it must be saved again as ASCII|||File bị hỏng; phải lưu lại dạng ASCII', 'Write new FileReader("names.txt", "UTF-8") — FileReader accepts an encoding name|||Viết new FileReader("names.txt", "UTF-8") — FileReader nhận tên bảng mã'],
      correctIndex: 0,
      points: 1,
      explanation: 'On JDK 8, FileReader always uses the platform default charset — windows-1252 on an English Windows PC — so the 3 UTF-8 bytes of "ễ" become 3 Western characters. Measured in lesson 9.B by running the same program with two defaults. Naming the encoding fixes it on every machine. BufferedReader reads Unicode chars fine (B); the file is correct (C); FileReader has no (String, String) constructor, and FileReader(File, Charset) only exists from Java 11 (D).|||Trên JDK 8, FileReader luôn dùng bảng mã mặc định của nền tảng — windows-1252 trên máy Windows tiếng Anh — nên 3 byte UTF-8 của "ễ" thành 3 ký tự Tây Âu. Đã đo ở bài 9.B bằng cách chạy cùng chương trình với hai mặc định. Gọi tên bảng mã thì đúng trên mọi máy. BufferedReader đọc ký tự Unicode bình thường (B sai); file không hỏng (C sai); FileReader không có hàm tạo (String, String), còn FileReader(File, Charset) chỉ có từ Java 11 (D sai).' },
    { id: 'q4',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `FileWriter a = new FileWriter("log.txt");
a.write("A");
a.close();
FileWriter b = new FileWriter("log.txt");
b.write("B");
b.close();
FileWriter c = new FileWriter("log.txt", true);
c.write("C");
c.close();
BufferedReader br = new BufferedReader(new FileReader("log.txt"));
System.out.println(br.readLine());
br.close();`,
      codeLang: 'java',
      options: ['ABC|||ABC', 'A|||A', 'BC|||BC', 'C|||C'],
      correctIndex: 2,
      points: 1,
      explanation: 'new FileWriter("log.txt") creates the file OR empties it if it exists, so the second writer erases "A" and writes "B". new FileWriter("log.txt", true) opens in append mode: "C" goes after "B". The file holds "BC". FE asks the same rule as "which statement adds content to an existing text file?" → append = true in the FileWriter constructor.|||new FileWriter("log.txt") tạo file HOẶC làm rỗng nếu đã có, nên writer thứ hai xoá "A" rồi ghi "B". new FileWriter("log.txt", true) mở ở chế độ ghi nối: "C" được ghi sau "B". File chứa "BC". FE hỏi cùng luật này dưới dạng "câu lệnh nào ghi thêm nội dung vào file văn bản đã có?" → append = true trong hàm tạo FileWriter.' },
    { id: 'q5',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `String fName = "output.txt";
int a = 8;
char c = 'a';
try {
    RandomAccessFile f = new RandomAccessFile(fName, "rw");
    f.writeInt(a);
    f.writeChar(c);
    f.close();
} catch (Exception e) {
    System.out.println(e);
}
File f = new File(fName);
System.out.println(f.length());`,
      codeLang: 'java',
      options: ['5|||5', '8|||8', '9|||9', '6|||6'],
      correctIndex: 3,
      points: 1,
      explanation: 'writeInt always writes 4 bytes (00 00 00 08) and writeChar always 2 bytes (00 61, a 16-bit char), so the file is 4 + 2 = 6 bytes. The value 8 does not matter, and a char is not 1 byte in a data stream. (On the real FE paper the file is never closed; the length is still 6 because RandomAccessFile writes straight to the file.)|||writeInt luôn ghi 4 byte (00 00 00 08) và writeChar luôn ghi 2 byte (00 61, một char 16 bit), nên file dài 4 + 2 = 6 byte. Giá trị 8 không quan trọng, và char không phải 1 byte trong luồng dữ liệu. (Trên đề FE thật file không được đóng; độ dài vẫn là 6 vì RandomAccessFile ghi thẳng xuống file.)' },
    { id: 'q6',
      question: '(FE question type) In an object stream, which members of an object are NOT written by writeObject()?|||(Dạng câu FE) Trong luồng đối tượng, thành phần nào của đối tượng KHÔNG được writeObject() ghi?',
      options: ['transient fields and static fields|||các trường transient và các trường static', 'final fields|||các trường final', 'private fields|||các trường private', 'fields inherited from a Serializable superclass|||các trường kế thừa từ một lớp cha Serializable'],
      correctIndex: 0,
      points: 1,
      explanation: 'Serialization saves the state of THIS object: transient fields are skipped on purpose, and static fields belong to the class, not the object (lesson 9.C measured a static field showing its current value after reading). final, private and inherited fields are all saved — private is no obstacle, serialization reads fields directly — provided the class declaring them is Serializable.|||Tuần tự hoá lưu trạng thái của CHÍNH đối tượng này: trường transient bị cố ý bỏ qua, còn trường static thuộc về lớp chứ không thuộc đối tượng (bài 9.C đo được trường static hiện giá trị hiện tại sau khi đọc). Trường final, private và trường kế thừa đều được lưu — private không cản được, cơ chế tuần tự hoá đọc thẳng các trường — miễn lớp khai báo chúng là Serializable.' },
    { id: 'q7',
      question: 'class Point implements Serializable { transient int x = 5; int y = 7; } — what is printed?|||class Point implements Serializable { transient int x = 5; int y = 7; } — chương trình in ra gì?',
      code: `ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("p.dat"));
out.writeObject(new Point());
out.close();
ObjectInputStream in = new ObjectInputStream(new FileInputStream("p.dat"));
Point p = (Point) in.readObject();
in.close();
System.out.println(p.x + " " + p.y);`,
      codeLang: 'java',
      options: ['5 7|||5 7', '0 7|||0 7', '0 0|||0 0', '5 0|||5 0'],
      correctIndex: 1,
      points: 1,
      explanation: "y is written and read back: 7. x is transient: it is not in the file, and when readObject builds the new Point it does NOT run Point's constructor or its field initializers, so x keeps the default value of an int, 0. \"5 7\" is the trap: = 5 runs only when you call new Point().|||y được ghi và đọc lại: 7. x là transient: nó không có trong file, và khi readObject dựng Point mới nó KHÔNG chạy hàm tạo hay phần khởi tạo trường của Point, nên x giữ giá trị mặc định của int, 0. \"5 7\" là cái bẫy: = 5 chỉ chạy khi bạn gọi new Point()." },
    { id: 'q8',
      question: 'books.dat holds two Book objects (written with writeObject). What is printed?|||books.dat chứa hai đối tượng Book (ghi bằng writeObject). Chương trình in ra gì?',
      code: `try {
    ObjectInputStream in = new ObjectInputStream(new FileInputStream("books.dat"));
    Book b;
    int n = 0;
    while ((b = (Book) in.readObject()) != null) {
        n++;
    }
    in.close();
    System.out.println(n);
} catch (Exception e) {
    System.out.println(e);
}`,
      codeLang: 'java',
      options: ['2|||2', 'java.io.EOFException|||java.io.EOFException', 'null|||null', 'java.io.NotSerializableException: Book|||java.io.NotSerializableException: Book'],
      correctIndex: 1,
      points: 1,
      explanation: "readObject() never returns null at the end of a file — it throws EOFException (it returns null only if null was written). The loop reads both books, the third call throws, the catch prints the exception and the line printing n is never reached. This is the loader of the deck's case study 3 (slides 51 and 55): it \"works\" but shows java.io.EOFException at every start. Catch EOFException as the normal end, or save the list as one object.|||readObject() không bao giờ trả null khi hết file — nó ném EOFException (chỉ trả null nếu null đã được ghi). Vòng lặp đọc được hai cuốn, lần gọi thứ ba ném lỗi, catch in ngoại lệ và dòng in n không bao giờ được chạy. Đây là hàm nạp của case study 3 trong bộ slide (slide 51 và 55): nó \"chạy được\" nhưng hiện java.io.EOFException mỗi lần mở. Hãy bắt EOFException như điểm kết thúc bình thường, hoặc lưu danh sách thành một đối tượng." },
    { id: 'q9',
      question: "(FE question type) In the RandomAccessFile class, which mode writes every change of the file's content AND metadata (file attributes) to the device immediately?|||(Dạng câu FE) Trong lớp RandomAccessFile, chế độ nào ghi ngay xuống thiết bị mọi thay đổi của nội dung VÀ siêu dữ liệu (thuộc tính) của file?",
      options: ['"rws"|||"rws"', '"rwd"|||"rwd"', '"rw"|||"rw"', '"r"|||"r"'],
      correctIndex: 0,
      points: 1,
      explanation: '"rws" = read/write, synchronous for content and metadata. "rwd" is synchronous for the content (data) only; metadata are updated later. "rw" lets the OS write when it likes; "r" is read only and throws on any write. There is no "w" mode — the constructor throws IllegalArgumentException (measured in lesson 9.C).|||"rws" = đọc/ghi, đồng bộ cả nội dung lẫn metadata. "rwd" chỉ đồng bộ nội dung (dữ liệu); metadata cập nhật sau. "rw" để hệ điều hành ghi khi nó muốn; "r" chỉ đọc và ném lỗi khi ghi. Không có chế độ "w" — hàm tạo ném IllegalArgumentException (đã đo ở bài 9.C).' },
    { id: 'q10',
      question: 'The exam machine runs JDK 8. Which line compiles there?|||Máy thi chạy JDK 8. Dòng nào biên dịch được trên máy đó?',
      options: ['Path p = Path.of("a.txt");|||Path p = Path.of("a.txt");', 'BufferedReader br = new BufferedReader(new FileReader("a.txt", StandardCharsets.UTF_8));|||BufferedReader br = new BufferedReader(new FileReader("a.txt", StandardCharsets.UTF_8));', 'String all = Files.readString(Paths.get("a.txt"));|||String all = Files.readString(Paths.get("a.txt"));', 'List<String> lines = Files.readAllLines(Paths.get("a.txt"), StandardCharsets.UTF_8);|||List<String> lines = Files.readAllLines(Paths.get("a.txt"), StandardCharsets.UTF_8);'],
      correctIndex: 3,
      points: 1,
      explanation: 'Files.readAllLines(Path, Charset), Paths.get and StandardCharsets all exist since Java 7, so D compiles on JDK 8. Path.of (A), FileReader(String, Charset) (B) and Files.readString (C) were added in Java 11 — javac 8 answers "cannot find symbol" or "no suitable constructor found" (measured in lessons 9.B and 9.2). Code copied from a modern tutorial is the usual source of these errors in the exam room.|||Files.readAllLines(Path, Charset), Paths.get và StandardCharsets đều có từ Java 7, nên D biên dịch được trên JDK 8. Path.of (A), FileReader(String, Charset) (B) và Files.readString (C) được thêm ở Java 11 — javac 8 báo "cannot find symbol" hoặc "no suitable constructor found" (đã đo ở bài 9.B và 9.2). Code chép từ bài hướng dẫn hiện đại là nguồn gây các lỗi này ở phòng thi.' },
  ],
};

export default {
  slides: [L_pro14_1, L_pro14_2, L_pro14_3],
  practice: L_on_ch9,
  labs: [L_lab9],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 9 viết lại theo dạng câu FE PRO192, mỗi câu có giải thích song ngữ; câu "in ra gì" đã chạy thật trên JDK 8: lớp java.io.File chỉ mô tả file, readLine trả dòng kế tiếp, FileReader dùng bảng mã mặc định nên tiếng Việt vỡ trên máy Windows tiếng Anh, FileWriter ghi đè và ghi nối, RandomAccessFile writeInt + writeChar dài 6 byte, trường static và transient không được tuần tự hoá, trường transient trở về giá trị mặc định, readObject hết file ném EOFException chứ không trả null, chế độ "rws", và dòng code nào biên dịch được trên JDK 8 của phòng thi.',
};
