/**
 * PRO192 · Chương 6 — xử lý ngoại lệ (pro11).
 * Bài 📑 học theo từng slide: pro11 (tmp_11.pptx, slide 1–17).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch6.
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab-6-ngoai-le-muon-tra.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch6).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, registerDeck, bi } from './_slides.mjs';

registerDeck('lab6', { code: 'PRO192 Lab 6', en: 'Lab 6 — CT Library: business exceptions, borrowing and returning', vi: 'Lab 6 — CT Library: ngoại lệ nghiệp vụ, mượn và trả', total: 17, w: 1280, h: 720 });

/* ───────── 6.A — 📑 Slide by slide · Exception Handling: try-catch-finally, throws, propagation (slides 1–17) ───────── */
const L_pro11_1 = {
  title: '6.A — 📑 Slide by slide · Exception Handling: try-catch-finally, throws, propagation (slides 1–17)|||6.A — 📑 Học theo từng slide · Exception Handling: try-catch-finally, throws, lan truyền ngoại lệ (slide 1–17)',
  slug: 'pro192-slide-pro11-1',
  type: 'VIDEO',
  description: 'Giảng đủ 17 slide bộ "Exception Handling" của trường, mọi chương trình đều biên dịch và chạy thật trên JDK 8 (JDK phòng thi) với stack trace thật: ngoại lệ là gì và JVM in gì khi không ai bắt, cây Throwable (checked, unchecked, Error), try-catch-finally đủ mọi đường đi, bắt cụ thể hay tổng quát và luật thứ tự catch, multi-catch, finally với return và System.exit, try lồng nhau mở file thật, throws và throw, tự tạo ngoại lệ checked giữ nguyên nhân gốc, lan truyền ngoại lệ qua mA→mB→mC và cách đọc stack trace, try-with-resources — và ba phiên bản nhập số 10..50 của slide: hai bản không biên dịch được, bản thứ ba lặp vô hạn khi dữ liệu nạp qua pipe như máy chấm PE, kèm bản sửa dùng MỘT Scanner.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.A · school deck "Exception Handling", slides 1–17</span>
<h2>When something goes wrong at run time — who notices, who handles it, and what the console prints</h2>
<p class="lead">Until now a wrong input simply crashed your programs. This deck gives Java's answer: an error at run time becomes an <strong>exception object</strong> that is <strong>thrown</strong>, travels back up the chain of method calls, and is either <strong>caught</strong> by a <code>try … catch</code> you wrote or printed by the JVM as a <strong>stack trace</strong> before the program dies. In the syllabus this is Chapter 5 (sessions 31–32, CLO4); here it is Chapter 6. It matters far beyond the FE: every LAB211 program must survive "abc" typed where a number is expected, and every PRJ301 servlet and Spring Boot controller is built on the same mechanism.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>what an exception is; what the JVM prints when nobody catches it</td><td>read "Exception in thread main …" and find the line that failed</td></tr>
<tr><td>5–6</td><td>the Throwable tree: checked, unchecked, Error</td><td>say whether javac will force you to handle a given exception</td></tr>
<tr><td>7–10</td><td>try, catch, finally; specific versus general catch; nesting</td><td>predict the output of any try statement, including finally with return</td></tr>
<tr><td>11–13</td><td>throws, propagation, the stack trace</td><td>decide where to catch, and read a trace from top to bottom</td></tr>
<tr><td>14–17</td><td>the school's input loop, three versions</td><td>write an input method that survives bad data AND piped input</td></tr>
</tbody>
</table>
<div class="callout"><strong>Every program below really ran on JDK 8</strong> — the exam room's JDK — and every stack trace is the one JDK 8 printed, line numbers included. Three of the deck's code samples turned out not to compile or not to stop; the lesson shows the real compiler messages and the fix.</div>`,
    `<span class="eyebrow">Chương 6 · Bài 6.A · bộ slide "Exception Handling" của trường, slide 1–17</span>
<h2>Khi có gì đó hỏng lúc chạy — ai phát hiện, ai xử lý, và console in ra gì</h2>
<p class="lead">Tới giờ một lần nhập sai là chương trình của bạn sập luôn. Bộ slide này đưa ra câu trả lời của Java: một lỗi lúc chạy trở thành một <strong>đối tượng ngoại lệ (exception object)</strong> được <strong>ném ra (throw)</strong>, đi ngược lên chuỗi lời gọi phương thức, và hoặc bị <strong>bắt (catch)</strong> bởi một khối <code>try … catch</code> bạn viết, hoặc bị JVM in ra thành <strong>stack trace (vết ngăn xếp)</strong> trước khi chương trình chết. Trong đề cương đây là Chapter 5 (buổi 31–32, CLO4); trên trang này là Chương 6. Nó quan trọng hơn nhiều so với đề FE: mọi chương trình LAB211 phải sống sót khi người dùng gõ "abc" vào chỗ cần số, và mọi servlet PRJ301 lẫn controller Spring Boot đều xây trên đúng cơ chế này.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>ngoại lệ là gì; JVM in gì khi không ai bắt</td><td>đọc được "Exception in thread main …" và tìm ra dòng bị lỗi</td></tr>
<tr><td>5–6</td><td>cây Throwable: checked, unchecked, Error</td><td>nói được javac có bắt bạn xử lý một ngoại lệ cho trước hay không</td></tr>
<tr><td>7–10</td><td>try, catch, finally; bắt cụ thể hay tổng quát; lồng nhau</td><td>đoán đúng output của mọi câu lệnh try, kể cả finally có return</td></tr>
<tr><td>11–13</td><td>throws, lan truyền, stack trace</td><td>quyết định bắt ở đâu, và đọc trace từ trên xuống</td></tr>
<tr><td>14–17</td><td>vòng nhập số của trường, ba phiên bản</td><td>viết hàm nhập sống sót với dữ liệu sai VÀ với dữ liệu nạp qua pipe</td></tr>
</tbody>
</table>
<div class="callout"><strong>Mọi chương trình bên dưới đều đã chạy thật trên JDK 8</strong> — JDK của phòng thi — và mọi stack trace là đúng thứ JDK 8 in ra, kể cả số dòng. Ba đoạn code mẫu của slide hoá ra không biên dịch được hoặc không bao giờ dừng; bài cho xem thông báo thật của trình biên dịch và cách sửa.</div>`),
    walkHead('pro11', 1, 17),
    walk('pro11', [
      [1, 'Exceptions',
        `<p class="y-chinh">🎯 Title slide: <strong>Exceptions</strong>, with the address of the official Oracle tutorial the deck is based on — "Lesson: Exceptions" of <em>The Java Tutorials</em>, Essential Java Classes.</p>
<p>The link on the slide starts with <code>http://</code>; today the same page is served at <code>https://docs.oracle.com/javase/tutorial/essential/exceptions/</code>. It is still worth reading after this lesson: it is short, written for Java 8 (your exam version), and it is where the slide texts on pages 3, 6 and 9 come from almost word for word.</p>
<p>The word itself: an <em>exception</em> is something that is not the normal case. Java uses it for any event that interrupts the normal path of a program — a missing file, a division by zero, text where a number was expected. The opposite word in the deck is "the normal flow of the program's instructions".</p>
<p class="meo">🧠 Keep three words apart from the start: an <strong>error</strong> in daily speech (anything wrong), an <code>Exception</code> (a Java class you can catch), and an <code>Error</code> (a Java class for problems of the JVM itself — slide 5).</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: <strong>Exceptions (ngoại lệ)</strong>, kèm địa chỉ bài hướng dẫn chính thức của Oracle mà bộ slide dựa vào — "Lesson: Exceptions" trong <em>The Java Tutorials</em>, phần Essential Java Classes.</p>
<p>Đường link trên slide bắt đầu bằng <code>http://</code>; nay cùng trang đó nằm ở <code>https://docs.oracle.com/javase/tutorial/essential/exceptions/</code>. Nên đọc nó sau bài này: ngắn, viết cho Java 8 (đúng phiên bản phòng thi), và là nơi các câu chữ ở slide 3, 6 và 9 được lấy gần như nguyên văn.</p>
<p>Bản thân chữ này: <em>exception</em> nghĩa là "ngoại lệ", thứ không thuộc trường hợp bình thường. Java dùng nó cho mọi sự kiện cắt ngang đường đi bình thường của chương trình — một file không có, một phép chia cho 0, chữ ở chỗ cần số. Từ đối lập trong slide là "the normal flow of the program's instructions" (luồng lệnh bình thường của chương trình).</p>
<p class="meo">🧠 Tách ba chữ ngay từ đầu: <strong>lỗi</strong> theo nghĩa đời thường (mọi thứ sai), <code>Exception</code> (một lớp Java bạn bắt được), và <code>Error</code> (một lớp Java cho các sự cố của chính JVM — slide 5).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Four objectives: what an <strong>exception</strong> is, the <strong>kinds of exception</strong>, <strong>exception handling</strong>, and <strong>examples</strong>.</p>
<table>
<thead><tr><th>Objective</th><th>Slides</th><th>What you will run</th></tr></thead>
<tbody>
<tr><td>Exception</td><td>3–4</td><td>the school's ExceptionDemo_1 crashing on JDK 8</td></tr>
<tr><td>Kinds of Exception</td><td>5–6</td><td>a program that classifies 11 real exception classes; javac refusing a checked one</td></tr>
<tr><td>Exception Handling</td><td>7–13</td><td>try-catch-finally on every path, throws, a real three-level propagation</td></tr>
<tr><td>Examples</td><td>14–16</td><td>the deck's integer input loop: three versions, two of them broken</td></tr>
</tbody>
</table>
<p>➕ What the deck does not cover and this lesson adds, because PE and LAB211 need it: writing your <strong>own exception class</strong> (the advanced PE paper PE-ADV1 in the Exam Room asks for exactly that), <code>throw</code> versus <code>throws</code>, <strong>multi-catch</strong> and <strong>try-with-resources</strong> (Java 7, so legal on the exam's JDK 8), and the input trap that only shows when a grader pipes data in.</p>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu: <strong>ngoại lệ</strong> là gì, <strong>các loại ngoại lệ</strong>, <strong>xử lý ngoại lệ</strong>, và <strong>ví dụ</strong>.</p>
<table>
<thead><tr><th>Mục tiêu</th><th>Slide</th><th>Bạn sẽ chạy gì</th></tr></thead>
<tbody>
<tr><td>Exception</td><td>3–4</td><td>ExceptionDemo_1 của trường sập trên JDK 8</td></tr>
<tr><td>Kinds of Exception</td><td>5–6</td><td>chương trình phân loại 11 lớp ngoại lệ thật; javac từ chối một ngoại lệ checked</td></tr>
<tr><td>Exception Handling</td><td>7–13</td><td>try-catch-finally trên mọi đường đi, throws, một lần lan truyền thật qua ba tầng</td></tr>
<tr><td>Examples</td><td>14–16</td><td>vòng nhập số nguyên của slide: ba phiên bản, hai bản bị hỏng</td></tr>
</tbody>
</table>
<p>➕ Những gì slide không nói mà bài này thêm vào, vì PE và LAB211 cần: tự viết <strong>lớp ngoại lệ của riêng mình</strong> (đề PE nâng cao PE-ADV1 trong Exam Room hỏi đúng điều đó), <code>throw</code> khác <code>throws</code> thế nào, <strong>multi-catch</strong> và <strong>try-with-resources</strong> (Java 7, nên hợp lệ trên JDK 8 của phòng thi), và cái bẫy nhập liệu chỉ lộ ra khi máy chấm nạp dữ liệu qua pipe.</p>`],
      [3, 'Exception',
        `<p class="y-chinh">🎯 An <strong>exception</strong> is an event, during the execution of a program, that disrupts the normal flow of its instructions — an invalid filename typed by the user, a missing or corrupted file ("does not exist <em>or</em> might contain", the slide has a typo), a network link that fails. When the error occurs inside a method, the method creates an <strong>exception object</strong> and hands it to the runtime system: that is <strong>throwing an exception</strong>.</p>
<p>The key word is <strong>object</strong>. An exception is not a number or an error code as in C (<code>return -1</code>); it is an instance of a class, with fields and methods like any other object. It carries three things you will use all chapter:</p>
<table>
<thead><tr><th>Inside the exception object</th><th>How you read it</th><th>Example</th></tr></thead>
<tbody>
<tr><td>its type (the class)</td><td><code>e.getClass().getName()</code></td><td>java.lang.ArithmeticException</td></tr>
<tr><td>a message</td><td><code>e.getMessage()</code></td><td>/ by zero</td></tr>
<tr><td>the stack trace: which methods were running, at which lines</td><td><code>e.printStackTrace()</code></td><td>at ExceptionDemo_1.main(ExceptionDemo_1.java:4)</td></tr>
</tbody>
</table>
<p>"Hands it off to the runtime system" means: normal execution stops at that line; the JVM now looks for code that declared it wants this kind of exception (a matching <code>catch</code>) — first in the current method, then in its caller, and so on (slides 12–13).</p>`,
        `<p class="y-chinh">🎯 <strong>Ngoại lệ (exception)</strong> là một sự kiện, xảy ra trong lúc chương trình chạy, làm gián đoạn luồng lệnh bình thường của nó — người dùng gõ một tên file không hợp lệ, một file không tồn tại hoặc dữ liệu bị hỏng (slide gõ nhầm "of" thay cho "or"), một đường mạng bị đứt. Khi lỗi xảy ra trong một phương thức, phương thức đó tạo một <strong>đối tượng ngoại lệ</strong> và giao nó cho hệ thống thời gian chạy (runtime system — tức JVM): đó là <strong>ném ngoại lệ (throwing an exception)</strong>.</p>
<p>Chữ then chốt là <strong>đối tượng</strong>. Ngoại lệ không phải một con số hay mã lỗi như trong C (<code>return -1</code>); nó là một thể hiện của một lớp, có trường và phương thức như mọi đối tượng khác. Nó mang ba thứ mà bạn sẽ dùng suốt chương:</p>
<table>
<thead><tr><th>Bên trong đối tượng ngoại lệ</th><th>Đọc bằng</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>kiểu của nó (lớp)</td><td><code>e.getClass().getName()</code></td><td>java.lang.ArithmeticException</td></tr>
<tr><td>một thông điệp</td><td><code>e.getMessage()</code></td><td>/ by zero</td></tr>
<tr><td>stack trace: những phương thức nào đang chạy, ở dòng nào</td><td><code>e.printStackTrace()</code></td><td>at ExceptionDemo_1.main(ExceptionDemo_1.java:4)</td></tr>
</tbody>
</table>
<p>"Giao cho hệ thống thời gian chạy" nghĩa là: việc chạy bình thường dừng lại ở dòng đó; JVM đi tìm đoạn code đã khai báo muốn nhận loại ngoại lệ này (một <code>catch</code> khớp) — trước hết trong phương thức hiện tại, rồi tới phương thức đã gọi nó, cứ thế đi lên (slide 12–13).</p>`],
      [4, 'Exception',
        `<p class="y-chinh">🎯 The school's <code>ExceptionDemo_1</code>: <code>int x=5, y=0;</code> then <code>System.out.println(x/y);</code> then <code>System.out.println("Hello");</code>. The output shows <code>Exception in thread "main" java.lang.ArithmeticException: / by zero</code>, one line <code>at ExceptionDemo_1.main(ExceptionDemo_1.java:4)</code>, and no "Hello".</p>
<p>Typed as on the slide and run in a console with the real JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Chapter04");
    viet(d, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int x=5, y=0;",
        "      System.out.println(x/y);",
        "      System.out.println(\\"Hello\\");",
        "  }",
        "}");
    lenh(d, "javac", "ExceptionDemo_1.java");     // compiles: javac does not evaluate x/y
    lenh(d, "java", "ExceptionDemo_1");
}</code></pre>
<div class="out">&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
Exception in thread "main" java.lang.ArithmeticException: / by zero<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionDemo_1.main(ExceptionDemo_1.java:4)<br>
(exit code 1)</div>
<p>How to read it: <strong>javac compiled it without complaint</strong> — the compiler does not compute <code>5/0</code>, so this is a run-time problem. The JVM printed the thread (<code>main</code>), the exception class with its package, the message after the colon, and the line: <strong>4</strong>, the division. Line 5 never ran, which is why "Hello" is missing. The program ended with <strong>exit code 1</strong> — NetBeans shows it as "Java Result: 1".</p>
<p>Two corrections to the slide. The red arrow points at line 3, but the exception happens at line 4, as the trace itself says — always trust the trace. And the blue box says exceptions are "thrown by JVM": here yes, but most exceptions you will meet are thrown by <em>code</em> — <code>Integer.parseInt("abc")</code> throws from inside the JDK library, and from slide 11 on you will throw your own with <code>throw</code>. You can also define new exception classes; they are not limited to "pre-defined data".</p>
<div class="pitfall">NetBeans prints "BUILD SUCCESSFUL" under a crashed program. That line is about the build tool (Ant) finishing its "run" task, not about your program. Read the red lines above it.</div>`,
        `<p class="y-chinh">🎯 <code>ExceptionDemo_1</code> của trường: <code>int x=5, y=0;</code> rồi <code>System.out.println(x/y);</code> rồi <code>System.out.println("Hello");</code>. Output hiện <code>Exception in thread "main" java.lang.ArithmeticException: / by zero</code>, một dòng <code>at ExceptionDemo_1.main(ExceptionDemo_1.java:4)</code>, và không có "Hello".</p>
<p>Gõ đúng như slide và chạy trong console với JDK 8 thật:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("Chapter04");
    viet(d, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int x=5, y=0;",
        "      System.out.println(x/y);",
        "      System.out.println(\\"Hello\\");",
        "  }",
        "}");
    lenh(d, "javac", "ExceptionDemo_1.java");     // biên dịch được: javac không tính x/y
    lenh(d, "java", "ExceptionDemo_1");
}</code></pre>
<div class="out">&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
Exception in thread "main" java.lang.ArithmeticException: / by zero<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionDemo_1.main(ExceptionDemo_1.java:4)<br>
(exit code 1)</div>
<p>Cách đọc: <strong>javac biên dịch không phàn nàn gì</strong> — trình biên dịch không tính <code>5/0</code>, nên đây là sự cố lúc chạy. JVM in ra luồng (thread <code>main</code>), lớp ngoại lệ kèm package, thông điệp sau dấu hai chấm, và dòng: <strong>4</strong>, phép chia. Dòng 5 không bao giờ chạy, nên mới thiếu "Hello". Chương trình kết thúc với <strong>mã thoát 1 (exit code 1)</strong> — NetBeans hiện thành "Java Result: 1".</p>
<p>Hai chỗ đính chính slide. Mũi tên đỏ chỉ vào dòng 3, nhưng ngoại lệ xảy ra ở dòng 4, đúng như chính trace nói — luôn tin trace. Và ô xanh nói ngoại lệ "thrown by JVM" (do JVM ném): ở đây đúng, nhưng phần lớn ngoại lệ bạn gặp là do <em>code</em> ném — <code>Integer.parseInt("abc")</code> ném ra từ bên trong thư viện JDK, và từ slide 11 bạn sẽ tự ném bằng <code>throw</code>. Bạn cũng tự định nghĩa được lớp ngoại lệ mới; chúng không chỉ là "dữ liệu định nghĩa sẵn".</p>
<div class="pitfall">NetBeans in "BUILD SUCCESSFUL" ngay dưới một chương trình đã sập. Dòng đó nói về công cụ build (Ant) đã làm xong tác vụ "run", không nói về chương trình của bạn. Hãy đọc các dòng đỏ phía trên nó.</div>`],
      [5, 'Kinds of Exception',
        `<p class="y-chinh">🎯 All exceptions descend from <code>java.lang.Throwable</code> (which implements <code>java.io.Serializable</code>). Under it: <code>Error</code> and <code>Exception</code>; under <code>Exception</code>: <code>RuntimeException</code>. <strong>Checked exceptions</strong> — "we must use the try catch blocks or throw"; <strong>unchecked exceptions</strong> = program bugs — "we may not use the try catch blocks". The two code samples show an uncaught and a caught <code>ArrayIndexOutOfBoundsException</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7379840b6bad4dff1da8edbd0cf5b3289223e34c.svg" alt="Slide 5 redrawn with the classes you will meet in PRO192, coloured by kind" loading="lazy" /><p class="chu-thich">🧩 Slide 5 redrawn with the classes you will meet in PRO192, coloured by kind</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 5 redrawn — the Throwable tree (java.lang unless noted)
' Green = unchecked (the compiler does not force you), orange = checked (catch or declare), grey = Error (do not catch)
skinparam nodesep 18
skinparam ranksep 34
left to right direction
interface "java.io.Serializable" as Ser
class Throwable {
  + getMessage() : String
  + getCause() : Throwable
  + printStackTrace() : void
  + getStackTrace() : StackTraceElement[]
}
class Error #EEEEEE
class VirtualMachineError #EEEEEE
class StackOverflowError #EEEEEE
class OutOfMemoryError #EEEEEE
class "Exception" as Exc #FFE4C4
class "java.io.IOException" as IOE #FFE4C4
class "java.io.FileNotFoundException" as FNF #FFE4C4
class InterruptedException #FFE4C4
class RuntimeException #DCFCE7
class ArithmeticException #DCFCE7
class IndexOutOfBoundsException #DCFCE7
class ArrayIndexOutOfBoundsException #DCFCE7
class NullPointerException #DCFCE7
class IllegalArgumentException #DCFCE7
class NumberFormatException #DCFCE7
class "java.util.NoSuchElementException" as NSE #DCFCE7
class "java.util.InputMismatchException" as IME #DCFCE7
Ser &lt;|.. Throwable
Throwable &lt;|-- Error
Throwable &lt;|-- Exc
Error &lt;|-- VirtualMachineError
VirtualMachineError &lt;|-- StackOverflowError
VirtualMachineError &lt;|-- OutOfMemoryError
Exc &lt;|-- IOE
IOE &lt;|-- FNF
Exc &lt;|-- InterruptedException
Exc &lt;|-- RuntimeException
RuntimeException &lt;|-- ArithmeticException
RuntimeException &lt;|-- IndexOutOfBoundsException
IndexOutOfBoundsException &lt;|-- ArrayIndexOutOfBoundsException
RuntimeException &lt;|-- NullPointerException
RuntimeException &lt;|-- IllegalArgumentException
IllegalArgumentException &lt;|-- NumberFormatException
RuntimeException &lt;|-- NSE
NSE &lt;|-- IME
hide Error members
hide VirtualMachineError members
hide StackOverflowError members
hide OutOfMemoryError members
hide Exc members
hide IOE members
hide FNF members
hide InterruptedException members
hide RuntimeException members
hide ArithmeticException members
hide IndexOutOfBoundsException members
hide ArrayIndexOutOfBoundsException members
hide NullPointerException members
hide IllegalArgumentException members
hide NumberFormatException members
hide NSE members
hide IME members
hide Ser members
legend right
  orange = CHECKED: try-catch or throws, or javac refuses
  green = unchecked (RuntimeException): program bugs or bad data
  grey = Error (also unchecked): the JVM itself is in trouble, do not catch
endlegend
@enduml</code></pre></details>
<p>The rule behind the colours (JLS §11.1.1): the <strong>unchecked</strong> classes are <code>RuntimeException</code> and its subclasses <strong>and also</strong> <code>Error</code> and its subclasses — the slide draws the "unchecked" arrow only from RuntimeException. Everything else under <code>Throwable</code> is <strong>checked</strong>. Asked to the JVM itself, for eleven classes you will meet:</p>
<pre class="trich"><code class="language-java">static String loai(Class&lt;?&gt; c) {                       // checked = an Exception that is NOT a RuntimeException
    if (Error.class.isAssignableFrom(c)) return "Error     (do not catch)";
    if (RuntimeException.class.isAssignableFrom(c)) return "unchecked (RuntimeException)";
    return "CHECKED   (catch or declare)";
}

static String toTien(Class&lt;?&gt; c) {                    // the chain of superclasses up to Throwable
    StringBuilder sb = new StringBuilder(c.getSimpleName());
    for (Class&lt;?&gt; p = c.getSuperclass(); p != Object.class; p = p.getSuperclass()) sb.append(" &lt; ").append(p.getSimpleName());
    return sb.toString();
}

public static void main(String[] args) {
    Class&lt;?&gt;[] cac = {
        java.io.FileNotFoundException.class, java.io.IOException.class, InterruptedException.class,
        ArithmeticException.class, ArrayIndexOutOfBoundsException.class, NullPointerException.class,
        NumberFormatException.class, java.util.InputMismatchException.class, ClassCastException.class,
        StackOverflowError.class, OutOfMemoryError.class };
    for (Class&lt;?&gt; c : cac) System.out.printf("%-30s %s%n   %s%n", c.getSimpleName(), loai(c), toTien(c));
}</code></pre>
<div class="out">FileNotFoundException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHECKED &nbsp;&nbsp;(catch or declare)<br>
&nbsp;&nbsp;&nbsp;FileNotFoundException &lt; IOException &lt; Exception &lt; Throwable<br>
IOException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHECKED &nbsp;&nbsp;(catch or declare)<br>
&nbsp;&nbsp;&nbsp;IOException &lt; Exception &lt; Throwable<br>
InterruptedException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHECKED &nbsp;&nbsp;(catch or declare)<br>
&nbsp;&nbsp;&nbsp;InterruptedException &lt; Exception &lt; Throwable<br>
ArithmeticException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;ArithmeticException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
ArrayIndexOutOfBoundsException unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;ArrayIndexOutOfBoundsException &lt; IndexOutOfBoundsException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
NullPointerException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;NullPointerException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
NumberFormatException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;NumberFormatException &lt; IllegalArgumentException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
InputMismatchException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;InputMismatchException &lt; NoSuchElementException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
ClassCastException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;ClassCastException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
StackOverflowError &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error &nbsp;&nbsp;&nbsp;&nbsp;(do not catch)<br>
&nbsp;&nbsp;&nbsp;StackOverflowError &lt; VirtualMachineError &lt; Error &lt; Throwable<br>
OutOfMemoryError &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error &nbsp;&nbsp;&nbsp;&nbsp;(do not catch)<br>
&nbsp;&nbsp;&nbsp;OutOfMemoryError &lt; VirtualMachineError &lt; Error &lt; Throwable</div>
<p>The slide's two programs, run on JDK 8 — the loop goes to <code>n=10</code> on an array of 5:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    System.out.println("== left program: no try/catch ==");
    File left = new File("left");
    viet(left, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int[] a= { 1,2,3,4,5};",
        "      int n=10;",
        "      for (int i=0;i&lt;n;i++)",
        "          System.out.print(\\"\\" + a[i] + \\",\\");",
        "  }",
        "}");
    lenh(left, "javac", "ExceptionDemo_1.java");
    lenh(left, "java", "ExceptionDemo_1");

    System.out.println("== right program: try + catch(Exception e) ==");
    File right = new File("right");
    viet(right, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int[] a= { 1,2,3,4,5};",
        "      int n=10;",
        "      try",
        "      { for (int i=0;i&lt;n;i++)",
        "          System.out.print(\\"\\" + a[i] + \\",\\");",
        "      }",
        "      catch(Exception e) // general exception",
        "      {   System.out.println(e);",
        "      }",
        "  }",
        "}");
    lenh(right, "javac", "ExceptionDemo_1.java");
    lenh(right, "java", "ExceptionDemo_1");
}</code></pre>
<div class="out">== left program: no try/catch ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
1,2,3,4,5,Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 5<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionDemo_1.main(ExceptionDemo_1.java:6)<br>
(exit code 1)<br>
== right program: try + catch(Exception e) ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
1,2,3,4,5,java.lang.ArrayIndexOutOfBoundsException: 5</div>
<p>Left: five numbers, then the crash at line 6 (the <code>print</code> inside the loop), exit code 1. Right: the same five numbers, then <code>println(e)</code> prints the exception's <code>toString()</code> — class name + message — and the program ends normally. On JDK 8 the message is just the bad index, <code>5</code>. A modern JDK says more — the same bugs on JDK 17+ (not what the exam room prints):</p>
<pre><code class="language-java">// Slides 4-5 compared with a modern JDK (17+): the same two bugs, clearer messages — NOT what the JDK 8 exam room prints
public class ThongBaoJdkMoi {
    static class Item { int value; }
    static Item[] list = new Item[3];                  // three null references

    public static void main(String[] args) {
        int[] a = { 1, 2, 3, 4, 5 };
        try {
            System.out.println(a[5]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println(e);                     // JDK 8: "...: 5"
        }
        try {
            System.out.println(list[1].value);
        } catch (NullPointerException e) {
            System.out.println(e);                     // JDK 8: "java.lang.NullPointerException", nothing more
        }
    }
}</code></pre>
<div class="out">java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5<br>
java.lang.NullPointerException: Cannot read field "value" because "ThongBaoJdkMoi.list[1]" is null</div>
<p class="meo">🧠 "May not use try-catch" for unchecked exceptions means "the compiler does not force you". Usually the right answer to an <code>ArrayIndexOutOfBoundsException</code> is to fix the loop (<code>i &lt; a.length</code>), not to catch it.</p>`,
        `<p class="y-chinh">🎯 Mọi ngoại lệ đều là con cháu của <code>java.lang.Throwable</code> (lớp này implements <code>java.io.Serializable</code>). Dưới nó: <code>Error</code> và <code>Exception</code>; dưới <code>Exception</code>: <code>RuntimeException</code>. <strong>Ngoại lệ checked (được kiểm tra)</strong> — "phải dùng khối try catch hoặc throw"; <strong>ngoại lệ unchecked (không kiểm tra)</strong> = lỗi lập trình — "có thể không dùng khối try catch". Hai đoạn code minh hoạ một <code>ArrayIndexOutOfBoundsException</code> không bị bắt và bị bắt.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7379840b6bad4dff1da8edbd0cf5b3289223e34c.svg" alt="Slide 5 vẽ lại với các lớp bạn sẽ gặp trong PRO192, tô màu theo loại" loading="lazy" /><p class="chu-thich">🧩 Slide 5 vẽ lại với các lớp bạn sẽ gặp trong PRO192, tô màu theo loại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 5 redrawn — the Throwable tree (java.lang unless noted)
' Xanh = unchecked (trình biên dịch không ép), cam = checked (bắt hoặc khai báo), xám = Error (đừng bắt)
skinparam nodesep 18
skinparam ranksep 34
left to right direction
interface "java.io.Serializable" as Ser
class Throwable {
  + getMessage() : String
  + getCause() : Throwable
  + printStackTrace() : void
  + getStackTrace() : StackTraceElement[]
}
class Error #EEEEEE
class VirtualMachineError #EEEEEE
class StackOverflowError #EEEEEE
class OutOfMemoryError #EEEEEE
class "Exception" as Exc #FFE4C4
class "java.io.IOException" as IOE #FFE4C4
class "java.io.FileNotFoundException" as FNF #FFE4C4
class InterruptedException #FFE4C4
class RuntimeException #DCFCE7
class ArithmeticException #DCFCE7
class IndexOutOfBoundsException #DCFCE7
class ArrayIndexOutOfBoundsException #DCFCE7
class NullPointerException #DCFCE7
class IllegalArgumentException #DCFCE7
class NumberFormatException #DCFCE7
class "java.util.NoSuchElementException" as NSE #DCFCE7
class "java.util.InputMismatchException" as IME #DCFCE7
Ser &lt;|.. Throwable
Throwable &lt;|-- Error
Throwable &lt;|-- Exc
Error &lt;|-- VirtualMachineError
VirtualMachineError &lt;|-- StackOverflowError
VirtualMachineError &lt;|-- OutOfMemoryError
Exc &lt;|-- IOE
IOE &lt;|-- FNF
Exc &lt;|-- InterruptedException
Exc &lt;|-- RuntimeException
RuntimeException &lt;|-- ArithmeticException
RuntimeException &lt;|-- IndexOutOfBoundsException
IndexOutOfBoundsException &lt;|-- ArrayIndexOutOfBoundsException
RuntimeException &lt;|-- NullPointerException
RuntimeException &lt;|-- IllegalArgumentException
IllegalArgumentException &lt;|-- NumberFormatException
RuntimeException &lt;|-- NSE
NSE &lt;|-- IME
hide Error members
hide VirtualMachineError members
hide StackOverflowError members
hide OutOfMemoryError members
hide Exc members
hide IOE members
hide FNF members
hide InterruptedException members
hide RuntimeException members
hide ArithmeticException members
hide IndexOutOfBoundsException members
hide ArrayIndexOutOfBoundsException members
hide NullPointerException members
hide IllegalArgumentException members
hide NumberFormatException members
hide NSE members
hide IME members
hide Ser members
legend right
  orange = CHECKED: try-catch or throws, or javac refuses
  green = unchecked (RuntimeException): program bugs or bad data
  grey = Error (also unchecked): the JVM itself is in trouble, do not catch
endlegend
@enduml</code></pre></details>
<p>Luật đứng sau các màu (JLS §11.1.1): các lớp <strong>unchecked</strong> là <code>RuntimeException</code> cùng lớp con của nó <strong>và cả</strong> <code>Error</code> cùng lớp con của nó — slide chỉ vẽ mũi tên "unchecked" từ RuntimeException. Mọi thứ khác dưới <code>Throwable</code> đều là <strong>checked</strong>. Hỏi thẳng JVM, với mười một lớp bạn sẽ gặp:</p>
<pre class="trich"><code class="language-java">static String loai(Class&lt;?&gt; c) {                       // checked = là Exception nhưng KHÔNG là RuntimeException
    if (Error.class.isAssignableFrom(c)) return "Error     (do not catch)";
    if (RuntimeException.class.isAssignableFrom(c)) return "unchecked (RuntimeException)";
    return "CHECKED   (catch or declare)";
}

static String toTien(Class&lt;?&gt; c) {                    // chuỗi lớp cha lên tới Throwable
    StringBuilder sb = new StringBuilder(c.getSimpleName());
    for (Class&lt;?&gt; p = c.getSuperclass(); p != Object.class; p = p.getSuperclass()) sb.append(" &lt; ").append(p.getSimpleName());
    return sb.toString();
}

public static void main(String[] args) {
    Class&lt;?&gt;[] cac = {
        java.io.FileNotFoundException.class, java.io.IOException.class, InterruptedException.class,
        ArithmeticException.class, ArrayIndexOutOfBoundsException.class, NullPointerException.class,
        NumberFormatException.class, java.util.InputMismatchException.class, ClassCastException.class,
        StackOverflowError.class, OutOfMemoryError.class };
    for (Class&lt;?&gt; c : cac) System.out.printf("%-30s %s%n   %s%n", c.getSimpleName(), loai(c), toTien(c));
}</code></pre>
<div class="out">FileNotFoundException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHECKED &nbsp;&nbsp;(catch or declare)<br>
&nbsp;&nbsp;&nbsp;FileNotFoundException &lt; IOException &lt; Exception &lt; Throwable<br>
IOException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHECKED &nbsp;&nbsp;(catch or declare)<br>
&nbsp;&nbsp;&nbsp;IOException &lt; Exception &lt; Throwable<br>
InterruptedException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CHECKED &nbsp;&nbsp;(catch or declare)<br>
&nbsp;&nbsp;&nbsp;InterruptedException &lt; Exception &lt; Throwable<br>
ArithmeticException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;ArithmeticException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
ArrayIndexOutOfBoundsException unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;ArrayIndexOutOfBoundsException &lt; IndexOutOfBoundsException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
NullPointerException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;NullPointerException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
NumberFormatException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;NumberFormatException &lt; IllegalArgumentException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
InputMismatchException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;InputMismatchException &lt; NoSuchElementException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
ClassCastException &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unchecked (RuntimeException)<br>
&nbsp;&nbsp;&nbsp;ClassCastException &lt; RuntimeException &lt; Exception &lt; Throwable<br>
StackOverflowError &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error &nbsp;&nbsp;&nbsp;&nbsp;(do not catch)<br>
&nbsp;&nbsp;&nbsp;StackOverflowError &lt; VirtualMachineError &lt; Error &lt; Throwable<br>
OutOfMemoryError &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error &nbsp;&nbsp;&nbsp;&nbsp;(do not catch)<br>
&nbsp;&nbsp;&nbsp;OutOfMemoryError &lt; VirtualMachineError &lt; Error &lt; Throwable</div>
<p>Hai chương trình của slide, chạy trên JDK 8 — vòng lặp chạy tới <code>n=10</code> trên mảng 5 phần tử:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    System.out.println("== left program: no try/catch ==");
    File left = new File("left");
    viet(left, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int[] a= { 1,2,3,4,5};",
        "      int n=10;",
        "      for (int i=0;i&lt;n;i++)",
        "          System.out.print(\\"\\" + a[i] + \\",\\");",
        "  }",
        "}");
    lenh(left, "javac", "ExceptionDemo_1.java");
    lenh(left, "java", "ExceptionDemo_1");

    System.out.println("== right program: try + catch(Exception e) ==");
    File right = new File("right");
    viet(right, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int[] a= { 1,2,3,4,5};",
        "      int n=10;",
        "      try",
        "      { for (int i=0;i&lt;n;i++)",
        "          System.out.print(\\"\\" + a[i] + \\",\\");",
        "      }",
        "      catch(Exception e) // general exception",
        "      {   System.out.println(e);",
        "      }",
        "  }",
        "}");
    lenh(right, "javac", "ExceptionDemo_1.java");
    lenh(right, "java", "ExceptionDemo_1");
}</code></pre>
<div class="out">== left program: no try/catch ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
1,2,3,4,5,Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 5<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionDemo_1.main(ExceptionDemo_1.java:6)<br>
(exit code 1)<br>
== right program: try + catch(Exception e) ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
1,2,3,4,5,java.lang.ArrayIndexOutOfBoundsException: 5</div>
<p>Bên trái: năm số, rồi sập ở dòng 6 (lệnh <code>print</code> trong vòng lặp), mã thoát 1. Bên phải: cũng năm số đó, rồi <code>println(e)</code> in <code>toString()</code> của ngoại lệ — tên lớp + thông điệp — và chương trình kết thúc bình thường. Trên JDK 8 thông điệp chỉ là chỉ số sai, <code>5</code>. JDK hiện đại nói nhiều hơn — cùng hai lỗi đó trên JDK 17+ (không phải thứ phòng thi in ra):</p>
<pre><code class="language-java">// Slide 4-5 so với JDK hiện đại (17+): cùng hai lỗi, thông báo rõ hơn — KHÔNG phải thứ phòng thi JDK 8 in ra
public class ThongBaoJdkMoi {
    static class Item { int value; }
    static Item[] list = new Item[3];                  // ba tham chiếu null

    public static void main(String[] args) {
        int[] a = { 1, 2, 3, 4, 5 };
        try {
            System.out.println(a[5]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println(e);                     // JDK 8: "...: 5"
        }
        try {
            System.out.println(list[1].value);
        } catch (NullPointerException e) {
            System.out.println(e);                     // JDK 8: "java.lang.NullPointerException", không gì thêm
        }
    }
}</code></pre>
<div class="out">java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5<br>
java.lang.NullPointerException: Cannot read field "value" because "ThongBaoJdkMoi.list[1]" is null</div>
<p class="meo">🧠 "Có thể không dùng try-catch" với ngoại lệ unchecked nghĩa là "trình biên dịch không ép bạn". Thường thì câu trả lời đúng cho một <code>ArrayIndexOutOfBoundsException</code> là sửa vòng lặp (<code>i &lt; a.length</code>), không phải bắt nó.</p>`],
      [6, 'Kinds of Exception',
        `<p class="y-chinh">🎯 A <strong>checked exception</strong> must be handled by either the <strong>try-catch</strong> mechanism or the <strong>throws-declaration</strong> mechanism. For <strong>runtime exceptions</strong>, the right time to deal with them is when you design, develop and debug your code — "runtime exceptions should never be thrown in finished code".</p>
<p>"Must" is enforced by javac. A checked exception that is neither caught nor declared is a <strong>compile error</strong>; an unchecked bug compiles and waits for run time. Both on the real JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== checked: FileReader may throw FileNotFoundException ==");
    viet(d, "ReadFile.java",
        "import java.io.FileReader;",
        "public class ReadFile {",
        "    public static void main(String[] args) {",
        "        FileReader f = new FileReader(\\"computer.txt\\");",
        "    }",
        "}");
    lenh(d, "javac", "ReadFile.java");

    System.out.println("== unchecked: the compiler says nothing, the bug waits for run time ==");
    viet(d, "Index.java",
        "public class Index {",
        "    public static void main(String[] args) {",
        "        int[] a = new int[5];",
        "        a[5] = 1;",
        "    }",
        "}");
    lenh(d, "javac", "Index.java");
    lenh(d, "java", "Index");
}</code></pre>
<div class="out">== checked: FileReader may throw FileNotFoundException ==<br>
&gt; javac ReadFile.java<br>
ReadFile.java:4: error: unreported exception FileNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileReader f = new FileReader("computer.txt");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== unchecked: the compiler says nothing, the bug waits for run time ==<br>
&gt; javac Index.java<br>
&gt; java Index<br>
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 5<br>
&nbsp;&nbsp;&nbsp;&nbsp;at Index.main(Index.java:4)<br>
(exit code 1)</div>
<p>Memorise the message <code>unreported exception X; must be caught or declared to be thrown</code> — it is the one you will see most in Chapter 9 (files) and in PRJ301 (JDBC's <code>SQLException</code> is checked too). The two ways out are exactly the slide's two mechanisms: wrap the call in <code>try … catch (FileNotFoundException e)</code>, or add <code>throws FileNotFoundException</code> to the method header and let the caller decide (slide 11).</p>
<p>The underlined sentence needs a correction. It is true for <strong>bugs</strong>: a <code>NullPointerException</code> or an array index out of bounds in finished code means the code is wrong — fix it, do not hide it with a catch. But throwing a runtime exception <em>on purpose</em> is normal in finished code: the JDK's own <code>Integer.parseInt</code> throws <code>NumberFormatException</code>, and a setter that receives a negative price may throw <code>IllegalArgumentException</code>. What should not happen is an <em>accidental</em> one.</p>
<table>
<thead><tr><th></th><th>Checked</th><th>Unchecked (RuntimeException, Error)</th></tr></thead>
<tbody>
<tr><td>javac forces handling</td><td>yes: catch or declare</td><td>no</td></tr>
<tr><td>typical cause</td><td>the outside world: file, network, database</td><td>a bug in the code, or bad input you did not check</td></tr>
<tr><td>examples</td><td>IOException, FileNotFoundException, SQLException</td><td>ArithmeticException, NullPointerException, NumberFormatException</td></tr>
<tr><td>your reaction</td><td>handle it — it can happen to correct code</td><td>fix the code; validate input before using it</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Một <strong>ngoại lệ checked</strong> phải được xử lý bằng cơ chế <strong>try-catch</strong> hoặc cơ chế <strong>khai báo throws</strong>. Với <strong>ngoại lệ lúc chạy (runtime exception)</strong>, thời điểm đúng để xử lý là khi bạn thiết kế, phát triển và gỡ lỗi code — "ngoại lệ lúc chạy không bao giờ nên bị ném ra trong code đã hoàn thiện".</p>
<p>Chữ "phải" do javac canh giữ. Một ngoại lệ checked không được bắt cũng không được khai báo là <strong>lỗi biên dịch</strong>; một lỗi unchecked thì biên dịch được và chờ tới lúc chạy. Cả hai trên JDK 8 thật:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== checked: FileReader may throw FileNotFoundException ==");
    viet(d, "ReadFile.java",
        "import java.io.FileReader;",
        "public class ReadFile {",
        "    public static void main(String[] args) {",
        "        FileReader f = new FileReader(\\"computer.txt\\");",
        "    }",
        "}");
    lenh(d, "javac", "ReadFile.java");

    System.out.println("== unchecked: the compiler says nothing, the bug waits for run time ==");
    viet(d, "Index.java",
        "public class Index {",
        "    public static void main(String[] args) {",
        "        int[] a = new int[5];",
        "        a[5] = 1;",
        "    }",
        "}");
    lenh(d, "javac", "Index.java");
    lenh(d, "java", "Index");
}</code></pre>
<div class="out">== checked: FileReader may throw FileNotFoundException ==<br>
&gt; javac ReadFile.java<br>
ReadFile.java:4: error: unreported exception FileNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FileReader f = new FileReader("computer.txt");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== unchecked: the compiler says nothing, the bug waits for run time ==<br>
&gt; javac Index.java<br>
&gt; java Index<br>
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 5<br>
&nbsp;&nbsp;&nbsp;&nbsp;at Index.main(Index.java:4)<br>
(exit code 1)</div>
<p>Hãy nhớ thông báo <code>unreported exception X; must be caught or declared to be thrown</code> (ngoại lệ X chưa được báo; phải bắt hoặc khai báo là sẽ ném) — đây là thông báo bạn gặp nhiều nhất ở Chương 9 (file) và ở PRJ301 (<code>SQLException</code> của JDBC cũng là checked). Hai lối ra đúng là hai cơ chế của slide: bọc lời gọi trong <code>try … catch (FileNotFoundException e)</code>, hoặc thêm <code>throws FileNotFoundException</code> vào đầu phương thức và để bên gọi quyết định (slide 11).</p>
<p>Câu gạch chân cần đính chính. Nó đúng với <strong>lỗi lập trình</strong>: một <code>NullPointerException</code> hay chỉ số mảng vượt giới hạn trong code đã hoàn thiện nghĩa là code sai — hãy sửa, đừng giấu nó bằng một catch. Nhưng ném một runtime exception <em>có chủ đích</em> là chuyện bình thường trong code hoàn thiện: chính <code>Integer.parseInt</code> của JDK ném <code>NumberFormatException</code>, và một setter nhận giá âm có thể ném <code>IllegalArgumentException</code>. Thứ không nên xảy ra là ngoại lệ <em>vô tình</em>.</p>
<table>
<thead><tr><th></th><th>Checked</th><th>Unchecked (RuntimeException, Error)</th></tr></thead>
<tbody>
<tr><td>javac ép xử lý</td><td>có: bắt hoặc khai báo</td><td>không</td></tr>
<tr><td>nguyên nhân điển hình</td><td>thế giới bên ngoài: file, mạng, cơ sở dữ liệu</td><td>lỗi trong code, hoặc dữ liệu nhập bạn chưa kiểm</td></tr>
<tr><td>ví dụ</td><td>IOException, FileNotFoundException, SQLException</td><td>ArithmeticException, NullPointerException, NumberFormatException</td></tr>
<tr><td>bạn phản ứng thế nào</td><td>xử lý nó — code đúng vẫn có thể gặp</td><td>sửa code; kiểm tra dữ liệu trước khi dùng</td></tr>
</tbody>
</table>`],
      [7, 'Catching exceptions: try catch finally mechanism',
        `<p class="y-chinh">🎯 Syntax: <code>try { statements that may cause exceptions }</code>, then one or more <code>catch (ExceptionType e) { handle the situation }</code>, then optionally <code>finally { statements always executed }</code>. If no exception is thrown in the try block, all catch blocks are bypassed; if one arises, the <strong>first matching</strong> catch block, if any, is executed and the others are skipped.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5e5de82a355094b1f8c7c07c0e8f7ec440868633.svg" alt="Slide 7 redrawn, with the path the slide leaves out: no catch matches" loading="lazy" /><p class="chu-thich">🧩 Slide 7 redrawn, with the path the slide leaves out: no catch matches</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 7 redrawn — one try statement, every path
' The slide's flowchart plus the path it leaves out: no catch matches
start
:run the try block;
if (an exception is thrown?) then (no)
  :skip every catch block;
elseif (a catch type matches it?\\n(first match, top to bottom)) then (yes)
  :run THAT catch block only;
  note right: father = son: catch (Exception e)\\nalso matches ArithmeticException
else (no catch matches)
  :remember the exception;
endif
:run the finally block (if any);
if (an exception is still pending?) then (yes)
  :leave the method,\\nthrow it to the caller;
  stop
else (no)
  :continue after the try statement;
endif
stop
@enduml</code></pre></details>
<p>The slide's flowchart has two exits from "e?"; there is a third, and it is the one that crashes programs: the exception does not match any catch. Then finally still runs, and the exception continues to the caller. The three slide paths in one program:</p>
<pre><code class="language-java">// release: 8
// Slide 7: the three paths through try / catch / catch / finally — no exception, first catch, second catch
public class LuongTryCatch {
    static void chia(String s) {
        System.out.println("input \\"" + s + "\\"");
        try {
            System.out.println("  try: start");
            int n = Integer.parseInt(s);                  // may throw NumberFormatException
            System.out.println("  try: 100 / " + n + " = " + (100 / n));   // may throw ArithmeticException
            System.out.println("  try: end");
        } catch (NumberFormatException e) {
            System.out.println("  catch 1: not a number -&gt; " + e.getMessage());
        } catch (ArithmeticException e) {
            System.out.println("  catch 2: " + e.getMessage());
        } finally {
            System.out.println("  finally");
        }
        System.out.println("  after the try statement");
    }

    public static void main(String[] args) {
        chia("4");      // no exception: both catch blocks are bypassed
        chia("x4");     // first matching catch runs, the rest of try is skipped
        chia("0");      // the second catch matches
    }
}</code></pre>
<div class="out">input "4"<br>
&nbsp;&nbsp;try: start<br>
&nbsp;&nbsp;try: 100 / 4 = 25<br>
&nbsp;&nbsp;try: end<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after the try statement<br>
input "x4"<br>
&nbsp;&nbsp;try: start<br>
&nbsp;&nbsp;catch 1: not a number -&gt; For input string: "x4"<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after the try statement<br>
input "0"<br>
&nbsp;&nbsp;try: start<br>
&nbsp;&nbsp;catch 2: / by zero<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after the try statement</div>
<p>Read the "x4" run carefully: <code>parseInt</code> threw, so "try: 100 / …" and "try: end" were <strong>skipped</strong> — the rest of a try block never runs after the exception. Execution jumped to the first catch whose type matches, then to finally, then to the statement after the whole try statement.</p>
<p>Grammar rules javac checks: a <code>try</code> needs at least one <code>catch</code> or a <code>finally</code> (or, from Java 7, a resource — slide 17); a variable declared inside <code>try { }</code> is not visible in <code>catch</code> or <code>finally</code>, because each block is its own scope.</p>`,
        `<p class="y-chinh">🎯 Cú pháp: <code>try { các câu lệnh có thể gây ngoại lệ }</code>, rồi một hay nhiều <code>catch (KiểuNgoạiLệ e) { xử lý tình huống }</code>, rồi tuỳ chọn <code>finally { các câu lệnh luôn được chạy }</code>. Nếu khối try không ném ngoại lệ nào, mọi khối catch bị bỏ qua; nếu có, khối catch <strong>khớp đầu tiên</strong> (nếu có) được chạy và các khối còn lại bị bỏ qua.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5e5de82a355094b1f8c7c07c0e8f7ec440868633.svg" alt="Slide 7 vẽ lại, thêm đường slide bỏ sót: không catch nào khớp" loading="lazy" /><p class="chu-thich">🧩 Slide 7 vẽ lại, thêm đường slide bỏ sót: không catch nào khớp</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 7 redrawn — one try statement, every path
' Lưu đồ của slide cộng đường mà slide bỏ sót: không catch nào khớp
start
:run the try block;
if (an exception is thrown?) then (no)
  :skip every catch block;
elseif (a catch type matches it?\\n(first match, top to bottom)) then (yes)
  :run THAT catch block only;
  note right: father = son: catch (Exception e)\\nalso matches ArithmeticException
else (no catch matches)
  :remember the exception;
endif
:run the finally block (if any);
if (an exception is still pending?) then (yes)
  :leave the method,\\nthrow it to the caller;
  stop
else (no)
  :continue after the try statement;
endif
stop
@enduml</code></pre></details>
<p>Lưu đồ của slide có hai lối ra từ "e?"; còn lối thứ ba, và chính nó làm sập chương trình: ngoại lệ không khớp catch nào. Khi đó finally vẫn chạy, rồi ngoại lệ đi tiếp lên bên gọi. Ba đường đi của slide trong một chương trình:</p>
<pre><code class="language-java">// release: 8
// Slide 7: ba đường đi qua try / catch / catch / finally — không có ngoại lệ, catch thứ nhất, catch thứ hai
public class LuongTryCatch {
    static void chia(String s) {
        System.out.println("input \\"" + s + "\\"");
        try {
            System.out.println("  try: start");
            int n = Integer.parseInt(s);                  // có thể ném NumberFormatException
            System.out.println("  try: 100 / " + n + " = " + (100 / n));   // có thể ném ArithmeticException
            System.out.println("  try: end");
        } catch (NumberFormatException e) {
            System.out.println("  catch 1: not a number -&gt; " + e.getMessage());
        } catch (ArithmeticException e) {
            System.out.println("  catch 2: " + e.getMessage());
        } finally {
            System.out.println("  finally");
        }
        System.out.println("  after the try statement");
    }

    public static void main(String[] args) {
        chia("4");      // không có ngoại lệ: bỏ qua cả hai catch
        chia("x4");     // catch khớp đầu tiên chạy, phần còn lại của try bị bỏ
        chia("0");      // catch thứ hai khớp
    }
}</code></pre>
<div class="out">input "4"<br>
&nbsp;&nbsp;try: start<br>
&nbsp;&nbsp;try: 100 / 4 = 25<br>
&nbsp;&nbsp;try: end<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after the try statement<br>
input "x4"<br>
&nbsp;&nbsp;try: start<br>
&nbsp;&nbsp;catch 1: not a number -&gt; For input string: "x4"<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after the try statement<br>
input "0"<br>
&nbsp;&nbsp;try: start<br>
&nbsp;&nbsp;catch 2: / by zero<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after the try statement</div>
<p>Đọc kỹ lần chạy "x4": <code>parseInt</code> đã ném, nên "try: 100 / …" và "try: end" bị <strong>bỏ qua</strong> — phần còn lại của khối try không bao giờ chạy sau khi có ngoại lệ. Việc thực thi nhảy tới catch đầu tiên có kiểu khớp, rồi tới finally, rồi tới câu lệnh nằm sau cả câu lệnh try.</p>
<p>Luật ngữ pháp javac kiểm: một <code>try</code> cần ít nhất một <code>catch</code> hoặc một <code>finally</code> (hoặc, từ Java 7, một tài nguyên — slide 17); biến khai báo trong <code>try { }</code> không nhìn thấy được ở <code>catch</code> hay <code>finally</code>, vì mỗi khối là một phạm vi riêng.</p>`],
      [8, 'Catching specific/general-level exception',
        `<p class="y-chinh">🎯 Two versions of the same program (<code>x=6, y=0</code>): the left catches the <strong>specific</strong> <code>ArithmeticException</code> and prints <code>e</code>; the right catches the <strong>general</strong> <code>Exception</code> and calls <code>e.printStackTrace()</code>. Both set <code>y=2</code> in the catch, so the finally block prints "Hello" and <code>6/2 = 3</code>. The note: "Type conformity: father=son;".</p>
<p>"father = son" is Chapter 4 again: a <code>catch (Exception e)</code> parameter can hold an <code>ArithmeticException</code> object exactly like <code>Father f = new Son()</code>. The two programs and two rules, on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    System.out.println("== left: catch( ArithmeticException e) ==");
    File left = new File("left");
    viet(left, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int x=6, y=0;",
        "      try",
        "      { System.out.println(x/y);",
        "        // other statements",
        "      }",
        "      catch( ArithmeticException e)",
        "      {   System.out.println(e);",
        "          y=2;",
        "      }",
        "      finally",
        "      { System.out.println(\\"Hello\\");",
        "        System.out.println(x/y);",
        "      }",
        "  }",
        "}");
    lenh(left, "javac", "ExceptionDemo_1.java");
    lenh(left, "java", "ExceptionDemo_1");

    System.out.println("== right: catch(Exception e) + e.printStackTrace() ==");
    File right = new File("right");
    viet(right, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int x=6, y=0;",
        "      try",
        "      { System.out.println(x/y);",
        "        // other statements",
        "      }",
        "      catch(Exception e) // general exception",
        "      {   e.printStackTrace();",
        "          y=2;",
        "      }",
        "      finally",
        "      { System.out.println(\\"Hello\\");",
        "        System.out.println(x/y);",
        "      }",
        "  }",
        "}");
    lenh(right, "javac", "ExceptionDemo_1.java");
    lenh(right, "java", "ExceptionDemo_1");

    System.out.println("== general catch BEFORE the specific one ==");
    File wrong = new File("wrong");
    viet(wrong, "Order.java",
        "public class Order {",
        "  public static void main (String[] args) {",
        "      int x=6, y=0;",
        "      try { System.out.println(x/y); }",
        "      catch (Exception e) { System.out.println(\\"general\\"); }",
        "      catch (ArithmeticException e) { System.out.println(\\"specific\\"); }",
        "  }",
        "}");
    lenh(wrong, "javac", "Order.java");

    System.out.println("== multi-catch (Java 7+): the alternatives must not be father and son ==");
    viet(wrong, "Multi.java",
        "public class Multi {",
        "  public static void main (String[] args) {",
        "      try { System.out.println(Integer.parseInt(args[0]) / 2); }",
        "      catch (NumberFormatException | ArithmeticException e) { System.out.println(\\"bad: \\" + e); }",
        "      catch (ArrayIndexOutOfBoundsException | RuntimeException e) { System.out.println(\\"?\\"); }",
        "  }",
        "}");
    lenh(wrong, "javac", "Multi.java");
}</code></pre>
<div class="out">== left: catch( ArithmeticException e) ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
java.lang.ArithmeticException: / by zero<br>
Hello<br>
3<br>
== right: catch(Exception e) + e.printStackTrace() ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
java.lang.ArithmeticException: / by zero<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionDemo_1.main(ExceptionDemo_1.java:5)<br>
Hello<br>
3<br>
== general catch BEFORE the specific one ==<br>
&gt; javac Order.java<br>
Order.java:6: error: exception ArithmeticException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (ArithmeticException e) { System.out.println("specific"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== multi-catch (Java 7+): the alternatives must not be father and son ==<br>
&gt; javac Multi.java<br>
Multi.java:5: error: Alternatives in a multi-catch statement cannot be related by subclassing<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (ArrayIndexOutOfBoundsException | RuntimeException e) { System.out.println("?"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;Alternative ArrayIndexOutOfBoundsException is a subclass of alternative RuntimeException<br>
1 error<br>
(exit code 1)</div>
<p>Look at the right program's order: in a real console the trace comes <strong>before</strong> "Hello", because that is the order the program wrote it. The slide's NetBeans window shows "Hello" first: <code>printStackTrace()</code> writes to <code>System.err</code>, <code>println</code> to <code>System.out</code>, and NetBeans reads the two streams separately, so their lines can interleave in any order. Never conclude the execution order from a NetBeans window that mixes red and black lines.</p>
<p>The two compile errors are FE favourites. Catches are tried <strong>top to bottom</strong>, so a general catch above a specific one makes the specific one unreachable: "exception ArithmeticException has already been caught". Order catches from son to father. And a multi-catch (<code>catch (A | B e)</code>, Java 7) may not list a class together with its own superclass. What you can print from <code>e</code>:</p>
<pre><code class="language-java">// Slide 8: four ways to show the caught object e — toString, getMessage, the class name, the stack trace
public class InTrongCatch {
    static int chia(int x, int y) {
        return x / y;                                     // line 4 of this file
    }

    public static void main(String[] args) {
        try {
            System.out.println(chia(6, 0));
        } catch (ArithmeticException e) {
            System.out.println("e                 -&gt; " + e);
            System.out.println("e.getMessage()    -&gt; " + e.getMessage());
            System.out.println("e.getClass()      -&gt; " + e.getClass().getName());
            System.out.println("e.printStackTrace(System.out):");
            e.printStackTrace(System.out);                // to stdout here; the no-argument version writes to System.err
        }
        System.out.println("the program goes on");
    }
}
// release: 8</code></pre>
<div class="out">e &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.lang.ArithmeticException: / by zero<br>
e.getMessage() &nbsp;&nbsp;&nbsp;-&gt; / by zero<br>
e.getClass() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.lang.ArithmeticException<br>
e.printStackTrace(System.out):<br>
java.lang.ArithmeticException: / by zero<br>
	at InTrongCatch.chia(InTrongCatch.java:4)<br>
	at InTrongCatch.main(InTrongCatch.java:9)<br>
the program goes on</div>
<div class="pitfall">An empty <code>catch (Exception e) { }</code> compiles and swallows everything — including bugs you need to see. In LAB211 at least print a message; never leave it empty.</div>`,
        `<p class="y-chinh">🎯 Hai phiên bản của cùng một chương trình (<code>x=6, y=0</code>): bên trái bắt ngoại lệ <strong>cụ thể</strong> <code>ArithmeticException</code> và in <code>e</code>; bên phải bắt ngoại lệ <strong>tổng quát</strong> <code>Exception</code> và gọi <code>e.printStackTrace()</code>. Cả hai gán <code>y=2</code> trong catch, nên khối finally in "Hello" và <code>6/2 = 3</code>. Ghi chú: "Type conformity: father=son;" (tương thích kiểu: cha = con).</p>
<p>"cha = con" chính là Chương 4: tham số <code>catch (Exception e)</code> giữ được một đối tượng <code>ArithmeticException</code> y như <code>Father f = new Son()</code>. Hai chương trình và hai luật, trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    System.out.println("== left: catch( ArithmeticException e) ==");
    File left = new File("left");
    viet(left, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int x=6, y=0;",
        "      try",
        "      { System.out.println(x/y);",
        "        // other statements",
        "      }",
        "      catch( ArithmeticException e)",
        "      {   System.out.println(e);",
        "          y=2;",
        "      }",
        "      finally",
        "      { System.out.println(\\"Hello\\");",
        "        System.out.println(x/y);",
        "      }",
        "  }",
        "}");
    lenh(left, "javac", "ExceptionDemo_1.java");
    lenh(left, "java", "ExceptionDemo_1");

    System.out.println("== right: catch(Exception e) + e.printStackTrace() ==");
    File right = new File("right");
    viet(right, "ExceptionDemo_1.java",
        "public class ExceptionDemo_1 {",
        "  public static void main (String[] args)",
        "  {   int x=6, y=0;",
        "      try",
        "      { System.out.println(x/y);",
        "        // other statements",
        "      }",
        "      catch(Exception e) // general exception",
        "      {   e.printStackTrace();",
        "          y=2;",
        "      }",
        "      finally",
        "      { System.out.println(\\"Hello\\");",
        "        System.out.println(x/y);",
        "      }",
        "  }",
        "}");
    lenh(right, "javac", "ExceptionDemo_1.java");
    lenh(right, "java", "ExceptionDemo_1");

    System.out.println("== general catch BEFORE the specific one ==");
    File wrong = new File("wrong");
    viet(wrong, "Order.java",
        "public class Order {",
        "  public static void main (String[] args) {",
        "      int x=6, y=0;",
        "      try { System.out.println(x/y); }",
        "      catch (Exception e) { System.out.println(\\"general\\"); }",
        "      catch (ArithmeticException e) { System.out.println(\\"specific\\"); }",
        "  }",
        "}");
    lenh(wrong, "javac", "Order.java");

    System.out.println("== multi-catch (Java 7+): the alternatives must not be father and son ==");
    viet(wrong, "Multi.java",
        "public class Multi {",
        "  public static void main (String[] args) {",
        "      try { System.out.println(Integer.parseInt(args[0]) / 2); }",
        "      catch (NumberFormatException | ArithmeticException e) { System.out.println(\\"bad: \\" + e); }",
        "      catch (ArrayIndexOutOfBoundsException | RuntimeException e) { System.out.println(\\"?\\"); }",
        "  }",
        "}");
    lenh(wrong, "javac", "Multi.java");
}</code></pre>
<div class="out">== left: catch( ArithmeticException e) ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
java.lang.ArithmeticException: / by zero<br>
Hello<br>
3<br>
== right: catch(Exception e) + e.printStackTrace() ==<br>
&gt; javac ExceptionDemo_1.java<br>
&gt; java ExceptionDemo_1<br>
java.lang.ArithmeticException: / by zero<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionDemo_1.main(ExceptionDemo_1.java:5)<br>
Hello<br>
3<br>
== general catch BEFORE the specific one ==<br>
&gt; javac Order.java<br>
Order.java:6: error: exception ArithmeticException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (ArithmeticException e) { System.out.println("specific"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== multi-catch (Java 7+): the alternatives must not be father and son ==<br>
&gt; javac Multi.java<br>
Multi.java:5: error: Alternatives in a multi-catch statement cannot be related by subclassing<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (ArrayIndexOutOfBoundsException | RuntimeException e) { System.out.println("?"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;Alternative ArrayIndexOutOfBoundsException is a subclass of alternative RuntimeException<br>
1 error<br>
(exit code 1)</div>
<p>Nhìn thứ tự của chương trình bên phải: trong console thật, trace đứng <strong>trước</strong> "Hello", vì đó là thứ tự chương trình đã ghi ra. Cửa sổ NetBeans trên slide lại hiện "Hello" trước: <code>printStackTrace()</code> ghi vào <code>System.err</code>, <code>println</code> ghi vào <code>System.out</code>, và NetBeans đọc hai luồng này riêng rẽ, nên các dòng của chúng có thể xen nhau theo bất kỳ thứ tự nào. Đừng bao giờ suy ra thứ tự thực thi từ một cửa sổ NetBeans trộn dòng đỏ với dòng đen.</p>
<p>Hai lỗi biên dịch là câu FE ưa thích. Các catch được thử <strong>từ trên xuống</strong>, nên một catch tổng quát đặt trên một catch cụ thể làm catch cụ thể không bao giờ tới được: "exception ArithmeticException has already been caught" (ngoại lệ ArithmeticException đã được bắt rồi). Hãy xếp catch từ con tới cha. Và một multi-catch (<code>catch (A | B e)</code>, Java 7) không được liệt kê một lớp cùng với chính lớp cha của nó. Những gì in được từ <code>e</code>:</p>
<pre><code class="language-java">// Slide 8: bốn cách in đối tượng e đã bắt — toString, getMessage, tên lớp, stack trace
public class InTrongCatch {
    static int chia(int x, int y) {
        return x / y;                                     // dòng 4 của file này
    }

    public static void main(String[] args) {
        try {
            System.out.println(chia(6, 0));
        } catch (ArithmeticException e) {
            System.out.println("e                 -&gt; " + e);
            System.out.println("e.getMessage()    -&gt; " + e.getMessage());
            System.out.println("e.getClass()      -&gt; " + e.getClass().getName());
            System.out.println("e.printStackTrace(System.out):");
            e.printStackTrace(System.out);                // ở đây in ra stdout; bản không tham số ghi vào System.err
        }
        System.out.println("the program goes on");
    }
}
// release: 8</code></pre>
<div class="out">e &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.lang.ArithmeticException: / by zero<br>
e.getMessage() &nbsp;&nbsp;&nbsp;-&gt; / by zero<br>
e.getClass() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.lang.ArithmeticException<br>
e.printStackTrace(System.out):<br>
java.lang.ArithmeticException: / by zero<br>
	at InTrongCatch.chia(InTrongCatch.java:4)<br>
	at InTrongCatch.main(InTrongCatch.java:9)<br>
the program goes on</div>
<div class="pitfall">Một <code>catch (Exception e) { }</code> rỗng vẫn biên dịch và nuốt mọi thứ — kể cả những lỗi bạn cần thấy. Trong LAB211 tối thiểu hãy in một thông báo; đừng bao giờ để trống.</div>`],
      [9, 'The finally block (1)',
        `<p class="y-chinh">🎯 A try block may optionally have a <strong>finally</strong> block. Its code is <em>guaranteed</em> to execute no matter what happens in the try/catch before it: the try completes without any exception; the try throws an exception handled by one of the catches; the try throws an exception <strong>not handled by any</strong> of the catches.</p>
<p>Each of the three cases, then three cases the slide does not list:</p>
<pre class="trich"><code class="language-java">static void thu(String s) {
    try {
        int y = Integer.parseInt(s);                  // "x" -&gt; NumberFormatException
        System.out.println("  try: 6 / " + y + " = " + (6 / y));
    } catch (ArithmeticException e) {                 // handles only division by zero
        System.out.println("  catch: " + e.getMessage());
    } finally {
        System.out.println("  finally");
    }
    System.out.println("  after try");               // skipped when the exception leaves the method
}</code></pre>
<pre class="trich"><code class="language-java">static int traVe() {
    try {
        System.out.println("  try: return 1");
        return 1;
    } finally {
        System.out.println("  finally runs BEFORE the method really returns");
    }
}

@SuppressWarnings("finally")
static int nuotLoi() {
    try {
        throw new IllegalStateException("lost!");
    } finally {
        return 2;                                     // a return in finally throws the exception away
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("case 1: try completes normally");
thu("2");
System.out.println("case 2: the exception is handled by a catch");
thu("0");
System.out.println("case 3: no catch matches - finally runs, then the exception leaves thu()");
try { thu("x"); } catch (NumberFormatException e) { System.out.println("  (caller) " + e); }
System.out.println("return: " + traVe());
System.out.println("return in finally: " + nuotLoi());
try {
    System.out.println("System.exit(0) inside try:");
    System.exit(0);
} finally {
    System.out.println("  this finally never prints");
}</code></pre>
<div class="out">case 1: try completes normally<br>
&nbsp;&nbsp;try: 6 / 2 = 3<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after try<br>
case 2: the exception is handled by a catch<br>
&nbsp;&nbsp;catch: / by zero<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after try<br>
case 3: no catch matches - finally runs, then the exception leaves thu()<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;(caller) java.lang.NumberFormatException: For input string: "x"<br>
&nbsp;&nbsp;try: return 1<br>
&nbsp;&nbsp;finally runs BEFORE the method really returns<br>
return: 1<br>
return in finally: 2<br>
System.exit(0) inside try:</div>
<p>Case 3 is the one that makes finally worth having: no catch in <code>thu()</code> matched the <code>NumberFormatException</code>, "after try" was skipped, but "finally" was still printed before the exception left the method. That is where cleanup goes — closing a file or a database connection that must be closed whether the work succeeded or not.</p>
<p>The three extras: a <code>return</code> inside try does not skip finally (finally runs between "decide to return 1" and "really return"); a <code>return</code> inside finally <strong>throws away</strong> a pending exception — <code>nuotLoi()</code> returned 2 and the <code>IllegalStateException</code> vanished, which is why javac can warn about it; and <code>System.exit(0)</code> stops the JVM on the spot, so its finally never prints. "Guaranteed" means "guaranteed while the JVM keeps running".</p>
<p class="meo">🧠 The deck's title says "(1)" but there is no part 2 — the cleanup story continues on slide 17 with try-with-resources, which writes the finally for you.</p>`,
        `<p class="y-chinh">🎯 Một khối try có thể có thêm (tuỳ chọn) một khối <strong>finally</strong>. Code trong đó <em>được bảo đảm</em> sẽ chạy dù chuyện gì xảy ra ở try/catch phía trước: try chạy xong không có ngoại lệ nào; try ném một ngoại lệ được một catch xử lý; try ném một ngoại lệ <strong>không được catch nào</strong> xử lý.</p>
<p>Từng trường hợp trong ba trường hợp đó, rồi ba trường hợp slide không liệt kê:</p>
<pre class="trich"><code class="language-java">static void thu(String s) {
    try {
        int y = Integer.parseInt(s);                  // "x" -&gt; NumberFormatException
        System.out.println("  try: 6 / " + y + " = " + (6 / y));
    } catch (ArithmeticException e) {                 // chỉ xử lý chia cho 0
        System.out.println("  catch: " + e.getMessage());
    } finally {
        System.out.println("  finally");
    }
    System.out.println("  after try");               // bị bỏ qua khi ngoại lệ thoát khỏi phương thức
}</code></pre>
<pre class="trich"><code class="language-java">static int traVe() {
    try {
        System.out.println("  try: return 1");
        return 1;
    } finally {
        System.out.println("  finally runs BEFORE the method really returns");
    }
}

@SuppressWarnings("finally")
static int nuotLoi() {
    try {
        throw new IllegalStateException("lost!");
    } finally {
        return 2;                                     // return trong finally vứt bỏ ngoại lệ
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("case 1: try completes normally");
thu("2");
System.out.println("case 2: the exception is handled by a catch");
thu("0");
System.out.println("case 3: no catch matches - finally runs, then the exception leaves thu()");
try { thu("x"); } catch (NumberFormatException e) { System.out.println("  (caller) " + e); }
System.out.println("return: " + traVe());
System.out.println("return in finally: " + nuotLoi());
try {
    System.out.println("System.exit(0) inside try:");
    System.exit(0);
} finally {
    System.out.println("  this finally never prints");
}</code></pre>
<div class="out">case 1: try completes normally<br>
&nbsp;&nbsp;try: 6 / 2 = 3<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after try<br>
case 2: the exception is handled by a catch<br>
&nbsp;&nbsp;catch: / by zero<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;after try<br>
case 3: no catch matches - finally runs, then the exception leaves thu()<br>
&nbsp;&nbsp;finally<br>
&nbsp;&nbsp;(caller) java.lang.NumberFormatException: For input string: "x"<br>
&nbsp;&nbsp;try: return 1<br>
&nbsp;&nbsp;finally runs BEFORE the method really returns<br>
return: 1<br>
return in finally: 2<br>
System.exit(0) inside try:</div>
<p>Trường hợp 3 là lý do finally đáng có: không catch nào trong <code>thu()</code> khớp <code>NumberFormatException</code>, "after try" bị bỏ qua, nhưng "finally" vẫn được in trước khi ngoại lệ rời khỏi phương thức. Đó là chỗ đặt việc dọn dẹp — đóng file hay kết nối cơ sở dữ liệu, thứ phải đóng dù công việc thành công hay không.</p>
<p>Ba điều thêm: <code>return</code> trong try không bỏ qua finally (finally chạy giữa lúc "quyết định trả về 1" và lúc "thật sự trả về"); <code>return</code> trong finally <strong>vứt bỏ</strong> ngoại lệ đang chờ — <code>nuotLoi()</code> trả về 2 và <code>IllegalStateException</code> biến mất, nên javac có cảnh báo về việc này; còn <code>System.exit(0)</code> dừng JVM ngay tại chỗ, nên finally của nó không bao giờ in ra. "Bảo đảm" nghĩa là "bảo đảm khi JVM còn chạy".</p>
<p class="meo">🧠 Tiêu đề slide ghi "(1)" nhưng bộ slide không có phần 2 — chuyện dọn dẹp được nói tiếp ở slide 17 với try-with-resources, thứ tự viết finally giùm bạn.</p>`],
      [10, 'Nesting of try/catch Blocks',
        `<p class="y-chinh">🎯 A try statement may be nested inside either the try block or the catch block of another try statement. The slide's pseudo code: try to open a user-specified file; if that throws <code>FileNotFoundException</code>, try to open a DEFAULT file instead; if that fails too, attempt to recover.</p>
<p>The pseudo code turned into a real method — <code>FileReader</code> really throws <code>FileNotFoundException</code> — and run twice in an empty folder, then with a <code>default.txt</code>:</p>
<pre class="trich"><code class="language-java">static String docDongDau(String tenFile) {
    BufferedReader r = null;
    try {
        r = new BufferedReader(new FileReader(tenFile));            // open a user-specified file
        return "user file: " + r.readLine();
    } catch (FileNotFoundException e) {
        System.out.println("  outer catch: " + e.getMessage());
        try {
            r = new BufferedReader(new FileReader("default.txt"));  // open a DEFAULT file instead
            return "default file: " + r.readLine();
        } catch (FileNotFoundException e2) {
            System.out.println("  inner catch: " + e2.getMessage());
            return "built-in settings";                             // attempt to recover
        } catch (IOException e2) {
            return "default file unreadable";
        }
    } catch (IOException e) {                                       // readLine() can fail too
        return "user file unreadable";
    } finally {
        if (r != null) try { r.close(); } catch (IOException e) { }  // closing can throw as well
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("run 1 - neither file exists:");
System.out.println("  =&gt; " + docDongDau("user.txt"));
try (PrintWriter w = new PrintWriter("default.txt")) { w.println("theme=dark"); }
System.out.println("run 2 - default.txt now exists:");
System.out.println("  =&gt; " + docDongDau("user.txt"));
new File("default.txt").delete();</code></pre>
<div class="out">run 1 - neither file exists:<br>
&nbsp;&nbsp;outer catch: user.txt (No such file or directory)<br>
&nbsp;&nbsp;inner catch: default.txt (No such file or directory)<br>
&nbsp;&nbsp;=&gt; built-in settings<br>
run 2 - default.txt now exists:<br>
&nbsp;&nbsp;outer catch: user.txt (No such file or directory)<br>
&nbsp;&nbsp;=&gt; default file: theme=dark</div>
<p>Three things the pseudo code hides. The inner try is in the <strong>catch</strong> block, so it only runs when the outer try failed; an exception thrown inside a catch block is <em>not</em> caught by the catches of the same try statement — it needs its own try. <code>readLine()</code> can throw <code>IOException</code> (the parent of FileNotFoundException), so each level also catches that — after the more specific one, as slide 8 requires. And the file must be closed on every path, hence one finally with its own little try, because <code>close()</code> throws <code>IOException</code> too. Slide 17's try-with-resources removes most of this noise.</p>
<p>The message part <code>(No such file or directory)</code> comes from the operating system: this ran on Linux; on the Windows machines of the exam room the same exception says <code>(The system cannot find the file specified)</code>.</p>`,
        `<p class="y-chinh">🎯 Một câu lệnh try có thể lồng bên trong khối try hoặc khối catch của một câu lệnh try khác. Mã giả trên slide: thử mở file người dùng chỉ định; nếu ném <code>FileNotFoundException</code>, thử mở file MẶC ĐỊNH thay thế; nếu vẫn hỏng, cố gắng tự khôi phục.</p>
<p>Mã giả thành một phương thức thật — <code>FileReader</code> thật sự ném <code>FileNotFoundException</code> — chạy hai lần trong một thư mục trống, rồi khi đã có <code>default.txt</code>:</p>
<pre class="trich"><code class="language-java">static String docDongDau(String tenFile) {
    BufferedReader r = null;
    try {
        r = new BufferedReader(new FileReader(tenFile));            // mở file người dùng chỉ định
        return "user file: " + r.readLine();
    } catch (FileNotFoundException e) {
        System.out.println("  outer catch: " + e.getMessage());
        try {
            r = new BufferedReader(new FileReader("default.txt"));  // mở file MẶC ĐỊNH thay thế
            return "default file: " + r.readLine();
        } catch (FileNotFoundException e2) {
            System.out.println("  inner catch: " + e2.getMessage());
            return "built-in settings";                             // cố gắng khôi phục
        } catch (IOException e2) {
            return "default file unreadable";
        }
    } catch (IOException e) {                                       // readLine() cũng có thể lỗi
        return "user file unreadable";
    } finally {
        if (r != null) try { r.close(); } catch (IOException e) { }  // đóng file cũng có thể ném
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("run 1 - neither file exists:");
System.out.println("  =&gt; " + docDongDau("user.txt"));
try (PrintWriter w = new PrintWriter("default.txt")) { w.println("theme=dark"); }
System.out.println("run 2 - default.txt now exists:");
System.out.println("  =&gt; " + docDongDau("user.txt"));
new File("default.txt").delete();</code></pre>
<div class="out">run 1 - neither file exists:<br>
&nbsp;&nbsp;outer catch: user.txt (No such file or directory)<br>
&nbsp;&nbsp;inner catch: default.txt (No such file or directory)<br>
&nbsp;&nbsp;=&gt; built-in settings<br>
run 2 - default.txt now exists:<br>
&nbsp;&nbsp;outer catch: user.txt (No such file or directory)<br>
&nbsp;&nbsp;=&gt; default file: theme=dark</div>
<p>Ba điều mã giả che đi. Try bên trong nằm trong khối <strong>catch</strong>, nên nó chỉ chạy khi try bên ngoài đã hỏng; một ngoại lệ ném ra bên trong khối catch <em>không</em> được các catch của cùng câu lệnh try đó bắt — nó cần try riêng. <code>readLine()</code> có thể ném <code>IOException</code> (lớp cha của FileNotFoundException), nên mỗi tầng còn bắt thêm nó — đặt sau catch cụ thể hơn, đúng như slide 8 đòi. Và file phải được đóng trên mọi đường đi, nên có một finally với try nhỏ của riêng nó, vì <code>close()</code> cũng ném <code>IOException</code>. try-with-resources ở slide 17 xoá phần lớn sự rườm rà này.</p>
<p>Phần thông điệp <code>(No such file or directory)</code> do hệ điều hành đưa ra: chương trình này chạy trên Linux; trên máy Windows của phòng thi cùng ngoại lệ đó sẽ ghi <code>(The system cannot find the file specified)</code>.</p>`],
      [11, 'Catching exceptions: Throws mechanism',
        `<p class="y-chinh">🎯 The <strong>throws</strong> keyword indicates what exception type may be thrown by a method. The school's <code>DemoException2</code>: <code>demoReadFile() throws FileNotFoundException</code> opens "computer.txt"; <code>main</code> calls it inside <code>try … catch (FileNotFoundException e)</code> and prints "somthing are wrong".</p>
<p>The slide's file starts at line 8 because NetBeans puts a licence comment on lines 1–7. Typed the same way and run, then with the catch removed, then with main passing the exception on:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== the slide: demoReadFile() throws, main catches ==");
    viet(d, "DemoException2.java",
        "/*", " * NetBeans puts a licence header here:", " * lines 1-7, so the code starts at line 8", " * as on the slide", " */", "", "",
        "import java.io.FileNotFoundException;",
        "import java.io.FileReader;",
        "public class DemoException2 {",
        "    public static void demoReadFile() throws FileNotFoundException",
        "    {",
        "        FileReader f=new FileReader(\\"computer.txt\\");",
        "    }",
        "    public static void main(String[] args){",
        "        try{",
        "            demoReadFile();",
        "        }catch(FileNotFoundException e)",
        "        {",
        "            System.out.println(\\"somthing are wrong\\");",
        "        }",
        "    }",
        "}");
    lenh(d, "javac", "DemoException2.java");
    lenh(d, "java", "DemoException2");

    System.out.println("== main calls demoReadFile() with no try/catch ==");
    viet(d, "NoCatch.java",
        "import java.io.*;",
        "public class NoCatch {",
        "    static void demoReadFile() throws FileNotFoundException { new FileReader(\\"computer.txt\\"); }",
        "    public static void main(String[] args) {",
        "        demoReadFile();",
        "    }",
        "}");
    lenh(d, "javac", "NoCatch.java");

    System.out.println("== main passes it on with throws: it compiles, and the JVM prints the trace ==");
    viet(d, "PassOn.java",
        "import java.io.*;",
        "public class PassOn {",
        "    static void demoReadFile() throws FileNotFoundException { new FileReader(\\"computer.txt\\"); }",
        "    public static void main(String[] args) throws FileNotFoundException {",
        "        demoReadFile();",
        "    }",
        "}");
    lenh(d, "javac", "PassOn.java");
    lenh(d, "java", "PassOn");
}</code></pre>
<div class="out">== the slide: demoReadFile() throws, main catches ==<br>
&gt; javac DemoException2.java<br>
&gt; java DemoException2<br>
somthing are wrong<br>
== main calls demoReadFile() with no try/catch ==<br>
&gt; javac NoCatch.java<br>
NoCatch.java:5: error: unreported exception FileNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;demoReadFile();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== main passes it on with throws: it compiles, and the JVM prints the trace ==<br>
&gt; javac PassOn.java<br>
&gt; java PassOn<br>
Exception in thread "main" java.io.FileNotFoundException: computer.txt (No such file or directory)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.open0(Native Method)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.open(FileInputStream.java:195)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.&lt;init&gt;(FileInputStream.java:138)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.&lt;init&gt;(FileInputStream.java:93)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileReader.&lt;init&gt;(FileReader.java:58)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at PassOn.demoReadFile(PassOn.java:3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at PassOn.main(PassOn.java:5)<br>
(exit code 1)</div>
<p><code>throws</code> is a <strong>promise in the method header</strong>: "this checked exception may come out of me — callers, deal with it". It moves the obligation one level up; it does not handle anything. When main also says <code>throws</code>, nobody is left, the JVM prints the trace and the program dies — legal, but only acceptable in throw-away test code. Notice the top five lines of that trace are inside the JDK (<code>FileInputStream.open0</code> is native code asking the operating system); your own code starts at <code>PassOn.demoReadFile(PassOn.java:3)</code>. When reading a long trace, look for the <strong>first line that belongs to your classes</strong>.</p>
<p>➕ <code>throws</code> (header, plural, a type) versus <code>throw</code> (statement, singular, an object): <code>throw new InvalidAgeException("…")</code> throws one object now. You can create your own class for it — extend <code>Exception</code> for a checked one, <code>RuntimeException</code> for an unchecked one — and pass the original exception as the <strong>cause</strong> so no information is lost:</p>
<pre class="trich"><code class="language-java">class InvalidAgeException extends Exception {             // extends Exception =&gt; CHECKED
    public InvalidAgeException(String message) { super(message); }
    public InvalidAgeException(String message, Throwable cause) { super(message, cause); }
}

class Student {
    private String name;
    private int age;

    public Student(String name, String ageText) throws InvalidAgeException {   // throws: "this may come out of me"
        this.name = name;
        int a;
        try {
            a = Integer.parseInt(ageText.trim());
        } catch (NumberFormatException e) {
            throw new InvalidAgeException("age is not a number: " + ageText, e);  // wrap, keep the cause
        }
        if (a &lt; 15 || a &gt; 60) throw new InvalidAgeException("age out of range 15..60: " + a);   // throw: "go now"
        this.age = a;
    }

    @Override
    public String toString() { return name + " (" + age + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">String[][] input = { { "An", "19" }, { "Binh", "abc" }, { "Chi", "7" } };
for (String[] row : input) {
    try {
        Student s = new Student(row[0], row[1]);
        System.out.println("created " + s);
    } catch (InvalidAgeException e) {
        System.out.println("rejected " + row[0] + ": " + e.getMessage());
        if (e.getCause() != null) System.out.println("   cause: " + e.getCause());
    }
}</code></pre>
<div class="out">created An (19)<br>
rejected Binh: age is not a number: abc<br>
&nbsp;&nbsp;&nbsp;cause: java.lang.NumberFormatException: For input string: "abc"<br>
rejected Chi: age out of range 15..60: 7</div>
<div class="callout">🧭 <strong>Go further — PE and LAB211</strong>: the Exam Room paper <strong>PE-ADV1</strong> opens with "a custom <em>checked</em> exception … must extend Exception, NOT RuntimeException" and a constructor that throws it — the pattern above. LAB211 graders also check that a wrong value is rejected with a clear message and the program goes on.</div>`,
        `<p class="y-chinh">🎯 Từ khoá <strong>throws</strong> cho biết kiểu ngoại lệ nào có thể bị một phương thức ném ra. <code>DemoException2</code> của trường: <code>demoReadFile() throws FileNotFoundException</code> mở "computer.txt"; <code>main</code> gọi nó bên trong <code>try … catch (FileNotFoundException e)</code> và in "somthing are wrong".</p>
<p>File trên slide bắt đầu ở dòng 8 vì NetBeans đặt một chú thích giấy phép ở dòng 1–7. Gõ y như vậy và chạy, rồi bỏ catch, rồi cho main chuyển tiếp ngoại lệ:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== the slide: demoReadFile() throws, main catches ==");
    viet(d, "DemoException2.java",
        "/*", " * NetBeans puts a licence header here:", " * lines 1-7, so the code starts at line 8", " * as on the slide", " */", "", "",
        "import java.io.FileNotFoundException;",
        "import java.io.FileReader;",
        "public class DemoException2 {",
        "    public static void demoReadFile() throws FileNotFoundException",
        "    {",
        "        FileReader f=new FileReader(\\"computer.txt\\");",
        "    }",
        "    public static void main(String[] args){",
        "        try{",
        "            demoReadFile();",
        "        }catch(FileNotFoundException e)",
        "        {",
        "            System.out.println(\\"somthing are wrong\\");",
        "        }",
        "    }",
        "}");
    lenh(d, "javac", "DemoException2.java");
    lenh(d, "java", "DemoException2");

    System.out.println("== main calls demoReadFile() with no try/catch ==");
    viet(d, "NoCatch.java",
        "import java.io.*;",
        "public class NoCatch {",
        "    static void demoReadFile() throws FileNotFoundException { new FileReader(\\"computer.txt\\"); }",
        "    public static void main(String[] args) {",
        "        demoReadFile();",
        "    }",
        "}");
    lenh(d, "javac", "NoCatch.java");

    System.out.println("== main passes it on with throws: it compiles, and the JVM prints the trace ==");
    viet(d, "PassOn.java",
        "import java.io.*;",
        "public class PassOn {",
        "    static void demoReadFile() throws FileNotFoundException { new FileReader(\\"computer.txt\\"); }",
        "    public static void main(String[] args) throws FileNotFoundException {",
        "        demoReadFile();",
        "    }",
        "}");
    lenh(d, "javac", "PassOn.java");
    lenh(d, "java", "PassOn");
}</code></pre>
<div class="out">== the slide: demoReadFile() throws, main catches ==<br>
&gt; javac DemoException2.java<br>
&gt; java DemoException2<br>
somthing are wrong<br>
== main calls demoReadFile() with no try/catch ==<br>
&gt; javac NoCatch.java<br>
NoCatch.java:5: error: unreported exception FileNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;demoReadFile();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== main passes it on with throws: it compiles, and the JVM prints the trace ==<br>
&gt; javac PassOn.java<br>
&gt; java PassOn<br>
Exception in thread "main" java.io.FileNotFoundException: computer.txt (No such file or directory)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.open0(Native Method)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.open(FileInputStream.java:195)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.&lt;init&gt;(FileInputStream.java:138)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileInputStream.&lt;init&gt;(FileInputStream.java:93)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.io.FileReader.&lt;init&gt;(FileReader.java:58)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at PassOn.demoReadFile(PassOn.java:3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at PassOn.main(PassOn.java:5)<br>
(exit code 1)</div>
<p><code>throws</code> là một <strong>lời hứa ở đầu phương thức</strong>: "ngoại lệ checked này có thể văng ra từ tôi — bên gọi tự lo". Nó đẩy nghĩa vụ lên một tầng; nó không xử lý gì cả. Khi main cũng nói <code>throws</code>, không còn ai nữa, JVM in trace và chương trình chết — hợp lệ, nhưng chỉ chấp nhận được trong code thử nghiệm dùng một lần. Để ý năm dòng đầu của trace đó nằm trong JDK (<code>FileInputStream.open0</code> là code native hỏi hệ điều hành); code của bạn bắt đầu ở <code>PassOn.demoReadFile(PassOn.java:3)</code>. Khi đọc một trace dài, hãy tìm <strong>dòng đầu tiên thuộc lớp của bạn</strong>.</p>
<p>➕ <code>throws</code> (ở đầu phương thức, số nhiều, một kiểu) khác <code>throw</code> (câu lệnh, số ít, một đối tượng): <code>throw new InvalidAgeException("…")</code> ném một đối tượng ngay lúc đó. Bạn có thể tự tạo lớp cho nó — kế thừa <code>Exception</code> để được loại checked, <code>RuntimeException</code> để được loại unchecked — và truyền ngoại lệ gốc vào làm <strong>nguyên nhân (cause)</strong> để không mất thông tin nào:</p>
<pre class="trich"><code class="language-java">class InvalidAgeException extends Exception {             // kế thừa Exception =&gt; CHECKED
    public InvalidAgeException(String message) { super(message); }
    public InvalidAgeException(String message, Throwable cause) { super(message, cause); }
}

class Student {
    private String name;
    private int age;

    public Student(String name, String ageText) throws InvalidAgeException {   // throws: "thứ này có thể văng ra khỏi tôi"
        this.name = name;
        int a;
        try {
            a = Integer.parseInt(ageText.trim());
        } catch (NumberFormatException e) {
            throw new InvalidAgeException("age is not a number: " + ageText, e);  // bọc lại, giữ nguyên nhân
        }
        if (a &lt; 15 || a &gt; 60) throw new InvalidAgeException("age out of range 15..60: " + a);   // throw: "ném ngay"
        this.age = a;
    }

    @Override
    public String toString() { return name + " (" + age + ")"; }
}</code></pre>
<pre class="trich"><code class="language-java">String[][] input = { { "An", "19" }, { "Binh", "abc" }, { "Chi", "7" } };
for (String[] row : input) {
    try {
        Student s = new Student(row[0], row[1]);
        System.out.println("created " + s);
    } catch (InvalidAgeException e) {
        System.out.println("rejected " + row[0] + ": " + e.getMessage());
        if (e.getCause() != null) System.out.println("   cause: " + e.getCause());
    }
}</code></pre>
<div class="out">created An (19)<br>
rejected Binh: age is not a number: abc<br>
&nbsp;&nbsp;&nbsp;cause: java.lang.NumberFormatException: For input string: "abc"<br>
rejected Chi: age out of range 15..60: 7</div>
<div class="callout">🧭 <strong>Đi tiếp — PE và LAB211</strong>: đề <strong>PE-ADV1</strong> trong Exam Room mở đầu bằng "a custom <em>checked</em> exception … must extend Exception, NOT RuntimeException" và một constructor ném nó — đúng mẫu ở trên. Người chấm LAB211 cũng kiểm tra rằng giá trị sai bị từ chối với thông báo rõ ràng và chương trình chạy tiếp.</div>`],
      [12, 'Exception Propagations',
        `<p class="y-chinh">🎯 When an exception occurs in a method, the program stack contains all the running methods — A called B, B called C, C called D. The exception travels back up through them (D → C → B → A) until a <code>catch(...)</code> takes it; the list of those methods is the <strong>stack trace</strong>, so "we can trace statements related to this exception".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5c41f99609c3a6889389f37f0ecf4f1b0ffaf4fb.svg" alt="Slides 12–13 as a sequence diagram: calls go down (black), the exception comes back up (red)" loading="lazy" /><p class="chu-thich">🧩 Slides 12–13 as a sequence diagram: calls go down (black), the exception comes back up (red)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 12-13 redrawn — calls go down, the exception comes back up
' Black arrows = calls, red = the exception travelling back through every frame that does not catch it
participant "main()" as M
participant "mA()" as A
participant "mB()" as B
participant "mC()" as C
participant "JVM" as J
M -&gt; A : obj.mA()  (line 16)
activate A
A -&gt; B : mB()  (line 4)
activate B
B -&gt; C : mC()  (line 8)
activate C
C -&gt; C : 5/0  (line 12)
C -[#DC2626]-&gt; B : ArithmeticException
deactivate C
note right of B #FEE2E2 : no try/catch here:\\nmB ends immediately
B -[#DC2626]-&gt; A : ArithmeticException
deactivate B
A -[#DC2626]-&gt; M : ArithmeticException
deactivate A
M -[#DC2626]-&gt; J : not caught in main either
J -&gt; J : print "Exception in thread main ..."\\n+ one "at" line per frame,\\nTOP = where it happened (mC, line 12)\\nexit code 1
@enduml</code></pre></details>
<p>Each method that is running owns a <strong>stack frame</strong> (Chapter 2, lesson 2.A): its local variables and the line it is executing. When D throws, the JVM checks D's frame for a matching catch; none ⇒ D's frame is thrown away and the search continues in C, at the line where C called D. A method with no matching catch simply <strong>ends at once</strong> — the rest of its code is skipped, like the rest of a try block.</p>
<p>One correction to the picture: it draws "Stack for A()" at the top. In a real stack the <strong>newest</strong> frame (D) is on top, and a stack trace prints in that order — the line that failed first, <code>main</code> last. Slide 13 shows it.</p>
<p class="meo">🧠 A propagating exception is like a complaint going up a company: the clerk (D) cannot fix it, passes it to the team lead (C), then the manager (B)… whoever has a matching <code>catch</code> handles it, and everyone below has already left the meeting.</p>`,
        `<p class="y-chinh">🎯 Khi một ngoại lệ xảy ra trong một phương thức, stack của chương trình chứa mọi phương thức đang chạy — A gọi B, B gọi C, C gọi D. Ngoại lệ đi ngược lên qua chúng (D → C → B → A) cho tới khi một <code>catch(...)</code> nhận nó; danh sách các phương thức đó chính là <strong>stack trace</strong>, nên "ta lần ra được các câu lệnh liên quan tới ngoại lệ này".</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5c41f99609c3a6889389f37f0ecf4f1b0ffaf4fb.svg" alt="Slide 12–13 vẽ thành sơ đồ tuần tự: lời gọi đi xuống (đen), ngoại lệ quay ngược lên (đỏ)" loading="lazy" /><p class="chu-thich">🧩 Slide 12–13 vẽ thành sơ đồ tuần tự: lời gọi đi xuống (đen), ngoại lệ quay ngược lên (đỏ)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 12-13 redrawn — calls go down, the exception comes back up
' Mũi tên đen = lời gọi, đỏ = ngoại lệ đi ngược qua mọi khung không bắt nó
participant "main()" as M
participant "mA()" as A
participant "mB()" as B
participant "mC()" as C
participant "JVM" as J
M -&gt; A : obj.mA()  (line 16)
activate A
A -&gt; B : mB()  (line 4)
activate B
B -&gt; C : mC()  (line 8)
activate C
C -&gt; C : 5/0  (line 12)
C -[#DC2626]-&gt; B : ArithmeticException
deactivate C
note right of B #FEE2E2 : no try/catch here:\\nmB ends immediately
B -[#DC2626]-&gt; A : ArithmeticException
deactivate B
A -[#DC2626]-&gt; M : ArithmeticException
deactivate A
M -[#DC2626]-&gt; J : not caught in main either
J -&gt; J : print "Exception in thread main ..."\\n+ one "at" line per frame,\\nTOP = where it happened (mC, line 12)\\nexit code 1
@enduml</code></pre></details>
<p>Mỗi phương thức đang chạy sở hữu một <strong>khung stack (stack frame)</strong> (Chương 2, bài 2.A): biến cục bộ của nó và dòng nó đang chạy. Khi D ném, JVM xem khung của D có catch nào khớp không; không có ⇒ khung của D bị bỏ đi và việc tìm kiếm tiếp tục ở C, tại dòng mà C đã gọi D. Một phương thức không có catch khớp thì <strong>kết thúc ngay lập tức</strong> — phần code còn lại của nó bị bỏ qua, như phần còn lại của khối try.</p>
<p>Một chỗ đính chính hình vẽ: nó vẽ "Stack for A()" ở trên cùng. Trong stack thật, khung <strong>mới nhất</strong> (D) nằm trên cùng, và stack trace in theo đúng thứ tự đó — dòng bị lỗi in đầu tiên, <code>main</code> in cuối cùng. Slide 13 cho thấy điều này.</p>
<p class="meo">🧠 Ngoại lệ lan truyền giống một lời khiếu nại đi lên trong công ty: nhân viên (D) không xử lý được, chuyển cho trưởng nhóm (C), rồi trưởng phòng (B)… ai có <code>catch</code> khớp thì xử lý, và mọi người bên dưới đã rời cuộc họp từ trước.</p>`],
      [13, 'Exception Propagations',
        `<p class="y-chinh">🎯 The school's <code>ExceptionPropagate</code>: <code>main</code> calls <code>obj.mA()</code> (line 16), <code>mA</code> calls <code>mB()</code> (line 4), <code>mB</code> calls <code>mC()</code> (line 8), and <code>mC</code> prints <code>5/0</code> (line 12). The output is one exception line and four "at" lines: mC:12, mB:8, mA:4, main:16.</p>
<p>The same 18 lines on JDK 8, then a version where <code>mA</code> catches:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("FirstPrj");
    System.out.println("== slide 13 as typed: nobody catches ==");
    viet(d, "ExceptionPropagate.java",
        "public class ExceptionPropagate {",
        "    public void mA()",
        "    {",
        "        mB();",
        "    }",
        "    public void mB()",
        "    {",
        "        mC();",
        "    }",
        "    public void mC()",
        "    {",
        "        System.out.println(5/0);",
        "    }",
        "    public static void main(String[]args){",
        "        ExceptionPropagate obj= new ExceptionPropagate();",
        "        obj.mA();",
        "    }",
        "}");
    lenh(d, "javac", "ExceptionPropagate.java");
    lenh(d, "java", "ExceptionPropagate");

    System.out.println("== mA() catches: mC and mB are abandoned, main goes on ==");
    viet(d, "CatchInA.java",
        "public class CatchInA {",
        "    public void mA() {",
        "        try { mB(); System.out.println(\\"mA: after mB\\"); }",
        "        catch (ArithmeticException e) { System.out.println(\\"mA caught: \\" + e.getMessage()); }",
        "    }",
        "    public void mB() { mC(); System.out.println(\\"mB: after mC\\"); }",
        "    public void mC() { System.out.println(5/0); }",
        "    public static void main(String[] args) {",
        "        new CatchInA().mA();",
        "        System.out.println(\\"main goes on\\");",
        "    }",
        "}");
    lenh(d, "javac", "CatchInA.java");
    lenh(d, "java", "CatchInA");
}</code></pre>
<div class="out">== slide 13 as typed: nobody catches ==<br>
&gt; javac ExceptionPropagate.java<br>
&gt; java ExceptionPropagate<br>
Exception in thread "main" java.lang.ArithmeticException: / by zero<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.mC(ExceptionPropagate.java:12)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.mB(ExceptionPropagate.java:8)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.mA(ExceptionPropagate.java:4)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.main(ExceptionPropagate.java:16)<br>
(exit code 1)<br>
== mA() catches: mC and mB are abandoned, main goes on ==<br>
&gt; javac CatchInA.java<br>
&gt; java CatchInA<br>
mA caught: / by zero<br>
main goes on</div>
<p>Identical to the slide, line for line. Read a trace like this: <strong>first line</strong> = what (ArithmeticException) and why (/ by zero); <strong>first "at"</strong> = where it happened (mC, line 12); <strong>each next "at"</strong> = who called the line above, and from which line. To fix a bug you usually look at the first "at" line in your own code; to decide where to <em>catch</em>, you walk down the list until you reach a method that knows what to do about it.</p>
<p>In the second run <code>mA</code> catches: "mB: after mC" and "mA: after mB" never print — mC and mB were abandoned mid-way, and the try block in mA was left at the call — but <code>main</code> goes on normally. Catch at the level that can make a decision (show a message, ask again, use a default), not at the lowest level that merely sees the problem.</p>
<div class="pitfall">FE pattern: "methodA calls methodB, which throws; methodB has a finally; methodA catches. What is printed?" — methodB's finally prints first, then methodA's catch, then whatever follows methodA's try. Walk up the stack, running each finally on the way.</div>`,
        `<p class="y-chinh">🎯 <code>ExceptionPropagate</code> của trường: <code>main</code> gọi <code>obj.mA()</code> (dòng 16), <code>mA</code> gọi <code>mB()</code> (dòng 4), <code>mB</code> gọi <code>mC()</code> (dòng 8), và <code>mC</code> in <code>5/0</code> (dòng 12). Output là một dòng ngoại lệ và bốn dòng "at": mC:12, mB:8, mA:4, main:16.</p>
<p>Đúng 18 dòng đó trên JDK 8, rồi một phiên bản trong đó <code>mA</code> bắt:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("FirstPrj");
    System.out.println("== slide 13 as typed: nobody catches ==");
    viet(d, "ExceptionPropagate.java",
        "public class ExceptionPropagate {",
        "    public void mA()",
        "    {",
        "        mB();",
        "    }",
        "    public void mB()",
        "    {",
        "        mC();",
        "    }",
        "    public void mC()",
        "    {",
        "        System.out.println(5/0);",
        "    }",
        "    public static void main(String[]args){",
        "        ExceptionPropagate obj= new ExceptionPropagate();",
        "        obj.mA();",
        "    }",
        "}");
    lenh(d, "javac", "ExceptionPropagate.java");
    lenh(d, "java", "ExceptionPropagate");

    System.out.println("== mA() catches: mC and mB are abandoned, main goes on ==");
    viet(d, "CatchInA.java",
        "public class CatchInA {",
        "    public void mA() {",
        "        try { mB(); System.out.println(\\"mA: after mB\\"); }",
        "        catch (ArithmeticException e) { System.out.println(\\"mA caught: \\" + e.getMessage()); }",
        "    }",
        "    public void mB() { mC(); System.out.println(\\"mB: after mC\\"); }",
        "    public void mC() { System.out.println(5/0); }",
        "    public static void main(String[] args) {",
        "        new CatchInA().mA();",
        "        System.out.println(\\"main goes on\\");",
        "    }",
        "}");
    lenh(d, "javac", "CatchInA.java");
    lenh(d, "java", "CatchInA");
}</code></pre>
<div class="out">== slide 13 as typed: nobody catches ==<br>
&gt; javac ExceptionPropagate.java<br>
&gt; java ExceptionPropagate<br>
Exception in thread "main" java.lang.ArithmeticException: / by zero<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.mC(ExceptionPropagate.java:12)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.mB(ExceptionPropagate.java:8)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.mA(ExceptionPropagate.java:4)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ExceptionPropagate.main(ExceptionPropagate.java:16)<br>
(exit code 1)<br>
== mA() catches: mC and mB are abandoned, main goes on ==<br>
&gt; javac CatchInA.java<br>
&gt; java CatchInA<br>
mA caught: / by zero<br>
main goes on</div>
<p>Y hệt slide, từng dòng một. Đọc trace như sau: <strong>dòng đầu</strong> = cái gì (ArithmeticException) và vì sao (/ by zero); <strong>dòng "at" đầu tiên</strong> = xảy ra ở đâu (mC, dòng 12); <strong>mỗi dòng "at" tiếp theo</strong> = ai đã gọi dòng phía trên, và gọi từ dòng nào. Để sửa lỗi, bạn thường nhìn dòng "at" đầu tiên nằm trong code của mình; để quyết định <em>bắt</em> ở đâu, bạn đi dần xuống danh sách tới một phương thức biết phải làm gì với nó.</p>
<p>Ở lần chạy thứ hai <code>mA</code> bắt: "mB: after mC" và "mA: after mB" không bao giờ được in — mC và mB bị bỏ dở giữa chừng, khối try trong mA bị rời ngay tại lời gọi — nhưng <code>main</code> chạy tiếp bình thường. Hãy bắt ở tầng có thể ra quyết định (hiện thông báo, hỏi lại, dùng giá trị mặc định), không phải ở tầng thấp nhất chỉ đơn thuần nhìn thấy sự cố.</p>
<div class="pitfall">Dạng câu FE: "methodA gọi methodB, methodB ném; methodB có finally; methodA bắt. In ra gì?" — finally của methodB in trước, rồi tới catch của methodA, rồi tới những gì nằm sau try của methodA. Đi ngược lên stack, chạy từng finally trên đường đi.</div>`],
      [14, 'Example: Catching Exceptions',
        `<p class="y-chinh">🎯 "Using try…catch to input an integer, 10 &lt;= n &lt;= 50": <code>inputInteger()</code> loops: print a prompt, <code>n = Integer.parseInt(in.nextLine())</code>, <code>cont = false</code>; <code>catch (Exception e)</code> prints "Required integer!"; the loop repeats <code>while (cont == true || n&lt;10 || n&gt;50)</code>.</p>
<p>The idea is the right one — <code>parseInt</code> throws <code>NumberFormatException</code> for "abc", the catch turns that into a message, the loop asks again. But typed as on the slide the code does not compile, twice:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 14, typed as on the slide (curly quotes included) ==");
    viet(d, "Slide14.java",
        "import java.util.Scanner;",
        "public class Slide14 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n;",
        "    do {",
        "       try {",
        "            System.out.print(“Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont == true|| n&lt;10 || n&gt;50);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.print(“number:” + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide14.java");

    System.out.println("== slide 14, quotes fixed ==");
    viet(d, "Slide14.java",
        "import java.util.Scanner;",
        "public class Slide14 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n;",
        "    do {",
        "       try {",
        "            System.out.print(\\"Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont == true|| n&lt;10 || n&gt;50);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.print(\\"number:\\" + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide14.java");

    System.out.println("== slide 14 with int n = 0; ==");
    viet(d, "Slide14.java",
        "import java.util.Scanner;",
        "public class Slide14 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n = 0;",
        "    do {",
        "       try {",
        "            System.out.print(\\"Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont == true|| n&lt;10 || n&gt;50);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.println(\\"number:\\" + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide14.java");
    lenhVao(d, "abc\\n5\\n70\\n20\\n", "java", "Slide14");
}</code></pre>
<div class="out">== slide 14, typed as on the slide (curly quotes included) ==<br>
&gt; javac -encoding UTF-8 Slide14.java<br>
Slide14.java:9: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:9: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:9: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:9: error: unclosed string literal<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: illegal start of expression<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
10 errors<br>
(exit code 1)<br>
== slide 14, quotes fixed ==<br>
&gt; javac -encoding UTF-8 Slide14.java<br>
Slide14.java:15: error: variable n might not have been initialized<br>
&nbsp;&nbsp;&nbsp;&nbsp;} while (cont == true|| n&lt;10 || n&gt;50);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 14 with int n = 0; ==<br>
&gt; javac -encoding UTF-8 Slide14.java<br>
&gt; java Slide14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: abc / 5 / 70 / 20)<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Enter a whole number: Enter a whole number: number:20</div>
<p>First, the slide's curly quotes <code>“ ”</code> (from PowerPoint's autocorrect) are not Java quotes: ten errors. Second, after fixing them, javac's <strong>definite assignment</strong> rule (JLS §16) refuses <code>n&lt;10</code>: <code>n</code> is assigned only inside <code>try</code>, and on the catch path it has no value. Giving it <code>int n = 0;</code> makes it compile and run. (Piped input is not echoed: the four prompts on the last line are the answers to "abc", 5, 70 and 20.)</p>
<p>The third problem only shows when running: "abc" gets "Required integer!", but <strong>5 and 70 are re-asked silently</strong> — the loop condition rejects them without any message, so the user does not know why. Slide 15 tries to fix exactly that.</p>`,
        `<p class="y-chinh">🎯 "Dùng try…catch để nhập một số nguyên, 10 &lt;= n &lt;= 50": <code>inputInteger()</code> lặp: in lời nhắc, <code>n = Integer.parseInt(in.nextLine())</code>, <code>cont = false</code>; <code>catch (Exception e)</code> in "Required integer!"; vòng lặp lặp lại <code>while (cont == true || n&lt;10 || n&gt;50)</code>.</p>
<p>Ý tưởng là đúng — <code>parseInt</code> ném <code>NumberFormatException</code> với "abc", catch biến nó thành một thông báo, vòng lặp hỏi lại. Nhưng gõ đúng như slide thì code không biên dịch được, tới hai lần:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 14, typed as on the slide (curly quotes included) ==");
    viet(d, "Slide14.java",
        "import java.util.Scanner;",
        "public class Slide14 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n;",
        "    do {",
        "       try {",
        "            System.out.print(“Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont == true|| n&lt;10 || n&gt;50);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.print(“number:” + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide14.java");

    System.out.println("== slide 14, quotes fixed ==");
    viet(d, "Slide14.java",
        "import java.util.Scanner;",
        "public class Slide14 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n;",
        "    do {",
        "       try {",
        "            System.out.print(\\"Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont == true|| n&lt;10 || n&gt;50);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.print(\\"number:\\" + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide14.java");

    System.out.println("== slide 14 with int n = 0; ==");
    viet(d, "Slide14.java",
        "import java.util.Scanner;",
        "public class Slide14 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n = 0;",
        "    do {",
        "       try {",
        "            System.out.print(\\"Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont == true|| n&lt;10 || n&gt;50);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.println(\\"number:\\" + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide14.java");
    lenhVao(d, "abc\\n5\\n70\\n20\\n", "java", "Slide14");
}</code></pre>
<div class="out">== slide 14, typed as on the slide (curly quotes included) ==<br>
&gt; javac -encoding UTF-8 Slide14.java<br>
Slide14.java:9: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:9: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:9: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:9: error: unclosed string literal<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“Enter a whole number: ");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: illegal character: '\\u201c'<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: illegal start of expression<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: illegal character: '\\u201d'<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: not a statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Slide14.java:20: error: ';' expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;System.out.print(“number:” + n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
10 errors<br>
(exit code 1)<br>
== slide 14, quotes fixed ==<br>
&gt; javac -encoding UTF-8 Slide14.java<br>
Slide14.java:15: error: variable n might not have been initialized<br>
&nbsp;&nbsp;&nbsp;&nbsp;} while (cont == true|| n&lt;10 || n&gt;50);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 14 with int n = 0; ==<br>
&gt; javac -encoding UTF-8 Slide14.java<br>
&gt; java Slide14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: abc / 5 / 70 / 20)<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Enter a whole number: Enter a whole number: number:20</div>
<p>Thứ nhất, ngoặc kép cong <code>“ ”</code> của slide (do PowerPoint tự sửa) không phải ngoặc kép Java: mười lỗi. Thứ hai, sửa xong, luật <strong>gán chắc chắn (definite assignment)</strong> của javac (JLS §16) từ chối <code>n&lt;10</code>: <code>n</code> chỉ được gán bên trong <code>try</code>, còn trên đường đi qua catch nó chưa có giá trị. Cho nó <code>int n = 0;</code> thì biên dịch và chạy được. (Dữ liệu nạp qua pipe không được in lại: bốn lời nhắc ở dòng cuối là bốn lần đọc "abc", 5, 70 và 20.)</p>
<p>Vấn đề thứ ba chỉ lộ ra khi chạy: "abc" nhận được "Required integer!", nhưng <strong>5 và 70 bị hỏi lại mà không có lời nào</strong> — điều kiện lặp loại chúng mà không in thông báo, nên người dùng không biết vì sao. Slide 15 cố sửa đúng chỗ đó.</p>`],
      [15, 'Example: Catching Exceptions',
        `<p class="y-chinh">🎯 Second version: the range check moves inside the try — <code>if (n&lt;10 || n&gt;50) throw new Exception();</code> — so a number out of range lands in the same catch and gets "Required integer!"; the loop condition becomes just <code>while (cont==true)</code>.</p>
<p>The quotes are straight this time. Compiled on JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 15: the range check throws, as typed ==");
    viet(d, "Slide15.java",
        "import java.util.Scanner;",
        "public class Slide15 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n;",
        "    do {",
        "       try {",
        "            System.out.print(\\"Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            if( n&lt;10 || n&gt;50) throw new Exception();",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont==true);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.println(\\"number:\\" + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide15.java");
}</code></pre>
<div class="out">== slide 15: the range check throws, as typed ==<br>
&gt; javac -encoding UTF-8 Slide15.java<br>
Slide15.java:17: error: variable n might not have been initialized<br>
&nbsp;&nbsp;&nbsp;&nbsp;return n;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>javac stops at <code>return n;</code> (line 17). The compiler cannot prove the loop only exits after a successful assignment, because <code>cont</code> is an ordinary variable; it reasons only about the shape of the code. Again <code>int n = 0;</code> fixes it.</p>
<p>Two design problems remain even then. <code>throw new Exception()</code> uses an exception for an <strong>ordinary decision</strong> — "is the number in range?" is a normal <code>if</code>, not an exceptional event (Effective Java: "use exceptions only for exceptional conditions"). And it produces a <strong>wrong message</strong>: a user who typed 70 is told "Required integer!", although 70 is an integer. Different mistakes deserve different messages.</p>
<p class="meo">🧠 Rule of thumb for input code: <code>try … catch</code> for what you cannot check beforehand (is "12a" a number? let <code>parseInt</code> decide), plain <code>if</code> for what you can (is 70 between 10 and 50?).</p>`,
        `<p class="y-chinh">🎯 Phiên bản thứ hai: phép kiểm khoảng chuyển vào trong try — <code>if (n&lt;10 || n&gt;50) throw new Exception();</code> — nên số ngoài khoảng rơi vào cùng catch và nhận "Required integer!"; điều kiện lặp chỉ còn <code>while (cont==true)</code>.</p>
<p>Lần này ngoặc kép thẳng. Biên dịch trên JDK 8:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 15: the range check throws, as typed ==");
    viet(d, "Slide15.java",
        "import java.util.Scanner;",
        "public class Slide15 {",
        "public static int inputInteger(){",
        "    Scanner in = new Scanner(System.in);",
        "    boolean cont = true;",
        "    int n;",
        "    do {",
        "       try {",
        "            System.out.print(\\"Enter a whole number: \\");",
        "            n = Integer.parseInt(in.nextLine());",
        "            if( n&lt;10 || n&gt;50) throw new Exception();",
        "            cont = false;",
        "       } catch (Exception e) {",
        "            System.out.println(\\"Required integer!\\");",
        "       }",
        "    } while (cont==true);",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "    int n= inputInteger();",
        "    System.out.println(\\"number:\\" + n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide15.java");
}</code></pre>
<div class="out">== slide 15: the range check throws, as typed ==<br>
&gt; javac -encoding UTF-8 Slide15.java<br>
Slide15.java:17: error: variable n might not have been initialized<br>
&nbsp;&nbsp;&nbsp;&nbsp;return n;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<p>javac dừng ở <code>return n;</code> (dòng 17): "variable n might not have been initialized" (biến n có thể chưa được khởi tạo). Trình biên dịch không chứng minh được vòng lặp chỉ thoát sau một lần gán thành công, vì <code>cont</code> là biến bình thường; nó chỉ lập luận theo hình dạng của code. Lại là <code>int n = 0;</code> sửa được.</p>
<p>Ngay cả khi đó vẫn còn hai vấn đề thiết kế. <code>throw new Exception()</code> dùng ngoại lệ cho một <strong>quyết định bình thường</strong> — "số có trong khoảng không?" là một câu <code>if</code> thông thường, không phải sự kiện bất thường (Effective Java: "chỉ dùng ngoại lệ cho những tình huống ngoại lệ"). Và nó cho ra <strong>thông báo sai</strong>: người gõ 70 bị bảo "Required integer!", dù 70 là số nguyên. Lỗi khác nhau xứng đáng nhận thông báo khác nhau.</p>
<p class="meo">🧠 Quy tắc ngón tay cái cho code nhập liệu: <code>try … catch</code> cho thứ bạn không kiểm trước được ("12a" có phải số không? để <code>parseInt</code> quyết), <code>if</code> thường cho thứ kiểm được (70 có nằm giữa 10 và 50 không?).</p>`],
      [16, 'Example: Catching Exceptions',
        `<p class="y-chinh">🎯 Third version, with the <strong>throws mechanism</strong>: <code>inputInteger() throws Exception</code> reads ONE value and throws if it is not a number or out of range; <code>main</code> loops <code>do { try { n = inputInteger(); cont = false; } catch (Exception e) { … } } while (cont == true);</code>.</p>
<p>This one compiles. Typed by hand it works. Fed the same two lines through a pipe — the way the PE marking software and LAB211 graders feed input — it never stops:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 16: inputInteger() throws, main loops ==");
    viet(d, "Slide16.java",
        "import java.util.Scanner;",
        "public class Slide16 {",
        "public static int inputInteger() throws Exception{",
        "    Scanner in = new Scanner(System.in);",
        "    System.out.print(\\"Enter a whole number: \\");",
        "    int n = Integer.parseInt(in.nextLine());",
        "    if( n&lt;10 || n&gt;50) throw new Exception();",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "     boolean cont=true; int n=0;",
        "     do{  try{ n= inputInteger();",
        "               cont=false;",
        "          }catch(Exception e){",
        "               System.out.println(\\"Required integer!\\"); }",
        "     }while(cont==true);",
        "     System.out.println(\\"number:\\"+ n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide16.java");
    System.out.println("-- typed by hand, one line at a time: works --");
    lenhTungDong(d, new String[] { "abc", "20" }, "java", "Slide16");
    System.out.println("-- the same two lines piped at once, as a grader does --");
    chay(d, "abc\\n20\\n", 6, "java", "Slide16");
}</code></pre>
<div class="out">== slide 16: inputInteger() throws, main loops ==<br>
&gt; javac -encoding UTF-8 Slide16.java<br>
-- typed by hand, one line at a time: works --<br>
&gt; java Slide16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed: abc / 20)<br>
Enter a whole number: abc<br>
Required integer!<br>
Enter a whole number: 20<br>
number:20<br>
-- the same two lines piped at once, as a grader does --<br>
&gt; java Slide16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: abc / 20)<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
... (still running after 6 lines - killed)</div>
<p>"abc / 20" typed one line at a time ends with <code>number:20</code>; the same "abc / 20" piped prints "Required integer!" forever (killed after 6 lines). Why: <code>inputInteger()</code> creates a <strong>new Scanner on every call</strong>. The first Scanner reads a whole block of input into its buffer — "abc" <em>and</em> "20" — returns "abc", and is thrown away with "20" still inside it. Every later Scanner finds an empty stream and throws <code>NoSuchElementException</code>. And because main catches the general <code>Exception</code>, that exception is swallowed too, turned into "Required integer!", and the loop asks again — forever.</p>
<p>Two lessons from one bug: create <strong>one</strong> Scanner for <code>System.in</code> for the whole program, and catch the <strong>specific</strong> exception you expect (<code>NumberFormatException</code>), so an unexpected one is not silently recycled. The fixed input method, with the range check as a plain <code>if</code> and a message for each kind of mistake:</p>
<pre class="trich"><code class="language-java">private static final Scanner SC = new Scanner(System.in);     // created once, shared by every call

public static int inputInteger(String prompt, int min, int max) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                  // echo what was typed into the transcript
        try {
            int n = Integer.parseInt(s);
            if (n &gt;= min &amp;&amp; n &lt;= max) return n;                 // a range problem is not an exception: just ask again
            System.out.println("  must be between " + min + " and " + max);
        } catch (NumberFormatException e) {                     // only "not a number" lands here
            System.out.println("  required integer!");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">int a = inputInteger("Enter a whole number (10..50): ", 10, 50);
int b = inputInteger("Enter another one (10..50): ", 10, 50);  // the call that failed with a new Scanner per call
System.out.println("numbers: " + a + ", " + b);</code></pre>
<div class="out">Enter a whole number (10..50): abc<br>
&nbsp;&nbsp;required integer!<br>
Enter a whole number (10..50): 5<br>
&nbsp;&nbsp;must be between 10 and 50<br>
Enter a whole number (10..50): 70<br>
&nbsp;&nbsp;must be between 10 and 50<br>
Enter a whole number (10..50): 20<br>
Enter another one (10..50): 33<br>
numbers: 20, 33</div>
<p>Input piped in: <code>abc / 5 / 70 / 20 / 33</code>. The second call — the one that broke the slide's version — reads "33" correctly, because the shared Scanner still holds the rest of the input. This is the method to keep for LAB211 (Chapter 6 practice turns it into a small <code>Inputter</code> class).</p>`,
        `<p class="y-chinh">🎯 Phiên bản thứ ba, dùng <strong>cơ chế throws</strong>: <code>inputInteger() throws Exception</code> đọc MỘT giá trị và ném nếu nó không phải số hoặc ngoài khoảng; <code>main</code> lặp <code>do { try { n = inputInteger(); cont = false; } catch (Exception e) { … } } while (cont == true);</code>.</p>
<p>Bản này biên dịch được. Gõ tay thì chạy đúng. Nạp cùng hai dòng đó qua pipe — cách phần mềm chấm PE và người chấm LAB211 cấp dữ liệu — thì nó không bao giờ dừng:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 16: inputInteger() throws, main loops ==");
    viet(d, "Slide16.java",
        "import java.util.Scanner;",
        "public class Slide16 {",
        "public static int inputInteger() throws Exception{",
        "    Scanner in = new Scanner(System.in);",
        "    System.out.print(\\"Enter a whole number: \\");",
        "    int n = Integer.parseInt(in.nextLine());",
        "    if( n&lt;10 || n&gt;50) throw new Exception();",
        "    return n;",
        "}",
        "public static void main(String[] args){",
        "     boolean cont=true; int n=0;",
        "     do{  try{ n= inputInteger();",
        "               cont=false;",
        "          }catch(Exception e){",
        "               System.out.println(\\"Required integer!\\"); }",
        "     }while(cont==true);",
        "     System.out.println(\\"number:\\"+ n);",
        "}",
        "}");
    lenh(d, "javac", "-encoding", "UTF-8", "Slide16.java");
    System.out.println("-- typed by hand, one line at a time: works --");
    lenhTungDong(d, new String[] { "abc", "20" }, "java", "Slide16");
    System.out.println("-- the same two lines piped at once, as a grader does --");
    chay(d, "abc\\n20\\n", 6, "java", "Slide16");
}</code></pre>
<div class="out">== slide 16: inputInteger() throws, main loops ==<br>
&gt; javac -encoding UTF-8 Slide16.java<br>
-- typed by hand, one line at a time: works --<br>
&gt; java Slide16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(typed: abc / 20)<br>
Enter a whole number: abc<br>
Required integer!<br>
Enter a whole number: 20<br>
number:20<br>
-- the same two lines piped at once, as a grader does --<br>
&gt; java Slide16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: abc / 20)<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
Enter a whole number: Required integer!<br>
... (still running after 6 lines - killed)</div>
<p>"abc / 20" gõ từng dòng một kết thúc bằng <code>number:20</code>; cùng "abc / 20" nạp qua pipe thì in "Required integer!" mãi mãi (bị giết sau 6 dòng). Vì sao: <code>inputInteger()</code> tạo <strong>một Scanner mới ở mỗi lần gọi</strong>. Scanner đầu tiên đọc cả một khối dữ liệu vào bộ đệm của nó — "abc" <em>và</em> "20" — trả về "abc", rồi bị bỏ đi trong khi "20" vẫn nằm bên trong. Mọi Scanner sau đó gặp một luồng trống và ném <code>NoSuchElementException</code>. Và vì main bắt <code>Exception</code> tổng quát, ngoại lệ đó cũng bị nuốt, biến thành "Required integer!", và vòng lặp hỏi lại — mãi mãi.</p>
<p>Hai bài học từ một lỗi: tạo <strong>một</strong> Scanner cho <code>System.in</code> dùng cho cả chương trình, và bắt <strong>đúng</strong> ngoại lệ bạn chờ đợi (<code>NumberFormatException</code>), để một ngoại lệ bất ngờ không bị âm thầm quay vòng. Hàm nhập đã sửa, phép kiểm khoảng là một <code>if</code> thường và mỗi kiểu sai có một thông báo riêng:</p>
<pre class="trich"><code class="language-java">private static final Scanner SC = new Scanner(System.in);     // tạo một lần, mọi lời gọi dùng chung

public static int inputInteger(String prompt, int min, int max) {
    while (true) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                  // in lại thứ đã gõ vào bản ghi
        try {
            int n = Integer.parseInt(s);
            if (n &gt;= min &amp;&amp; n &lt;= max) return n;                 // sai khoảng không phải ngoại lệ: chỉ cần hỏi lại
            System.out.println("  must be between " + min + " and " + max);
        } catch (NumberFormatException e) {                     // chỉ "không phải số" mới vào đây
            System.out.println("  required integer!");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">int a = inputInteger("Enter a whole number (10..50): ", 10, 50);
int b = inputInteger("Enter another one (10..50): ", 10, 50);  // lời gọi từng hỏng khi mỗi lần gọi tạo Scanner mới
System.out.println("numbers: " + a + ", " + b);</code></pre>
<div class="out">Enter a whole number (10..50): abc<br>
&nbsp;&nbsp;required integer!<br>
Enter a whole number (10..50): 5<br>
&nbsp;&nbsp;must be between 10 and 50<br>
Enter a whole number (10..50): 70<br>
&nbsp;&nbsp;must be between 10 and 50<br>
Enter a whole number (10..50): 20<br>
Enter another one (10..50): 33<br>
numbers: 20, 33</div>
<p>Dữ liệu nạp qua pipe: <code>abc / 5 / 70 / 20 / 33</code>. Lần gọi thứ hai — lần đã làm hỏng phiên bản của slide — đọc đúng "33", vì Scanner dùng chung vẫn giữ phần dữ liệu còn lại. Đây là hàm nên giữ lại cho LAB211 (bài thực hành Chương 6 biến nó thành một lớp <code>Inputter</code> nhỏ).</p>`],
      [17, 'Summary',
        `<p class="y-chinh">🎯 Summary: use the <strong>try-catch mechanism</strong> or the <strong>throws mechanism</strong> to handle errors; a single try block can have <strong>multiple catch blocks</strong>; code finalization and cleaning up go in the <strong>finally</strong> block.</p>
<table>
<thead><tr><th>Situation</th><th>Tool</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>code may fail and THIS method knows what to do</td><td>try … catch (specific type first)</td><td>7–8</td></tr>
<tr><td>code may fail and the CALLER should decide</td><td>throws in the header</td><td>11</td></tr>
<tr><td>something must happen on every path</td><td>finally</td><td>9</td></tr>
<tr><td>a checked exception you did not handle</td><td>compile error "unreported exception"</td><td>6</td></tr>
<tr><td>nobody catches it</td><td>the JVM prints the stack trace, exit code 1</td><td>4, 13</td></tr>
<tr><td>a value is wrong for your own rules</td><td>throw new …Exception("clear message")</td><td>11 ➕</td></tr>
</tbody>
</table>
<p>➕ Since Java 7 the most common cleanup has its own syntax: <strong>try-with-resources</strong>. Objects declared in <code>try ( … )</code> must implement <code>AutoCloseable</code>; the compiler generates the <code>close()</code> calls — in reverse order, before any catch runs, and an exception thrown by <code>close()</code> is attached to the main one as "suppressed" instead of replacing it:</p>
<pre class="trich"><code class="language-java">class Resource implements AutoCloseable {                 // anything AutoCloseable can go in try( ... )
    private final String name;
    private final boolean failOnClose;

    Resource(String name, boolean failOnClose) {
        this.name = name;
        this.failOnClose = failOnClose;
        System.out.println("  open " + name);
    }

    void use(boolean fail) {
        System.out.println("  use " + name);
        if (fail) throw new IllegalStateException("use of " + name + " failed");
    }

    @Override
    public void close() {
        System.out.println("  close " + name);
        if (failOnClose) throw new IllegalStateException("close of " + name + " failed");
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("1) two resources, no error:");
try (Resource a = new Resource("A", false); Resource b = new Resource("B", false)) {
    a.use(false);
    b.use(false);
}                                                  // closed in REVERSE order: B, then A

System.out.println("2) error inside the block:");
try (Resource a = new Resource("A", false)) {
    a.use(true);
} catch (IllegalStateException e) {
    System.out.println("  catch: " + e.getMessage() + "   &lt;- A was already closed");
} finally {
    System.out.println("  finally");
}

System.out.println("3) error inside AND error while closing:");
try (Resource c = new Resource("C", true)) {
    c.use(true);
} catch (IllegalStateException e) {
    System.out.println("  catch: " + e.getMessage());
    for (Throwable s : e.getSuppressed()) System.out.println("  suppressed: " + s.getMessage());
}</code></pre>
<div class="out">1) two resources, no error:<br>
&nbsp;&nbsp;open A<br>
&nbsp;&nbsp;open B<br>
&nbsp;&nbsp;use A<br>
&nbsp;&nbsp;use B<br>
&nbsp;&nbsp;close B<br>
&nbsp;&nbsp;close A<br>
2) error inside the block:<br>
&nbsp;&nbsp;open A<br>
&nbsp;&nbsp;use A<br>
&nbsp;&nbsp;close A<br>
&nbsp;&nbsp;catch: use of A failed &nbsp;&nbsp;&lt;- A was already closed<br>
&nbsp;&nbsp;finally<br>
3) error inside AND error while closing:<br>
&nbsp;&nbsp;open C<br>
&nbsp;&nbsp;use C<br>
&nbsp;&nbsp;close C<br>
&nbsp;&nbsp;catch: use of C failed<br>
&nbsp;&nbsp;suppressed: close of C failed</div>
<p>It works on the exam's JDK 8. In Chapter 9 it shrinks slide 10's nested method to a few lines: <code>try (BufferedReader r = new BufferedReader(new FileReader(name))) { … }</code> — no finally, no forgotten <code>close()</code>.</p>
<div class="pitfall">Do not put <code>new Scanner(System.in)</code> in a try-with-resources inside an input method: closing that Scanner closes <code>System.in</code> itself, and every later read in the program throws <code>NoSuchElementException</code> (measured in the Chapter 6 practice).</div>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong>: in LabFlow you rarely write try-catch in controllers. A service throws <code>LabNotFoundException</code>, and one class marked <code>@RestControllerAdvice</code> with <code>@ExceptionHandler</code> methods turns each exception type into an HTTP status (404, 400). That is slide 13's idea at the scale of a web application: catch at the one level that knows what to answer.</div>`,
        `<p class="y-chinh">🎯 Tóm tắt: dùng <strong>cơ chế try-catch</strong> hoặc <strong>cơ chế throws</strong> để xử lý lỗi; một khối try có thể có <strong>nhiều khối catch</strong>; việc kết thúc và dọn dẹp đặt trong khối <strong>finally</strong>.</p>
<table>
<thead><tr><th>Tình huống</th><th>Công cụ</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>code có thể hỏng và CHÍNH phương thức này biết phải làm gì</td><td>try … catch (kiểu cụ thể đặt trước)</td><td>7–8</td></tr>
<tr><td>code có thể hỏng và BÊN GỌI nên quyết định</td><td>throws ở đầu phương thức</td><td>11</td></tr>
<tr><td>có việc phải làm trên mọi đường đi</td><td>finally</td><td>9</td></tr>
<tr><td>một ngoại lệ checked bạn chưa xử lý</td><td>lỗi biên dịch "unreported exception"</td><td>6</td></tr>
<tr><td>không ai bắt</td><td>JVM in stack trace, mã thoát 1</td><td>4, 13</td></tr>
<tr><td>một giá trị sai theo luật riêng của bạn</td><td>throw new …Exception("thông báo rõ ràng")</td><td>11 ➕</td></tr>
</tbody>
</table>
<p>➕ Từ Java 7, kiểu dọn dẹp phổ biến nhất có cú pháp riêng: <strong>try-with-resources</strong>. Các đối tượng khai báo trong <code>try ( … )</code> phải implements <code>AutoCloseable</code>; trình biên dịch tự sinh lời gọi <code>close()</code> — theo thứ tự ngược, trước khi bất kỳ catch nào chạy, và một ngoại lệ do <code>close()</code> ném ra được gắn vào ngoại lệ chính dưới dạng "suppressed" (bị nén) thay vì thay thế nó:</p>
<pre class="trich"><code class="language-java">class Resource implements AutoCloseable {                 // mọi thứ AutoCloseable đều đặt được vào try( ... )
    private final String name;
    private final boolean failOnClose;

    Resource(String name, boolean failOnClose) {
        this.name = name;
        this.failOnClose = failOnClose;
        System.out.println("  open " + name);
    }

    void use(boolean fail) {
        System.out.println("  use " + name);
        if (fail) throw new IllegalStateException("use of " + name + " failed");
    }

    @Override
    public void close() {
        System.out.println("  close " + name);
        if (failOnClose) throw new IllegalStateException("close of " + name + " failed");
    }
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("1) two resources, no error:");
try (Resource a = new Resource("A", false); Resource b = new Resource("B", false)) {
    a.use(false);
    b.use(false);
}                                                  // đóng theo thứ tự NGƯỢC: B rồi A

System.out.println("2) error inside the block:");
try (Resource a = new Resource("A", false)) {
    a.use(true);
} catch (IllegalStateException e) {
    System.out.println("  catch: " + e.getMessage() + "   &lt;- A was already closed");
} finally {
    System.out.println("  finally");
}

System.out.println("3) error inside AND error while closing:");
try (Resource c = new Resource("C", true)) {
    c.use(true);
} catch (IllegalStateException e) {
    System.out.println("  catch: " + e.getMessage());
    for (Throwable s : e.getSuppressed()) System.out.println("  suppressed: " + s.getMessage());
}</code></pre>
<div class="out">1) two resources, no error:<br>
&nbsp;&nbsp;open A<br>
&nbsp;&nbsp;open B<br>
&nbsp;&nbsp;use A<br>
&nbsp;&nbsp;use B<br>
&nbsp;&nbsp;close B<br>
&nbsp;&nbsp;close A<br>
2) error inside the block:<br>
&nbsp;&nbsp;open A<br>
&nbsp;&nbsp;use A<br>
&nbsp;&nbsp;close A<br>
&nbsp;&nbsp;catch: use of A failed &nbsp;&nbsp;&lt;- A was already closed<br>
&nbsp;&nbsp;finally<br>
3) error inside AND error while closing:<br>
&nbsp;&nbsp;open C<br>
&nbsp;&nbsp;use C<br>
&nbsp;&nbsp;close C<br>
&nbsp;&nbsp;catch: use of C failed<br>
&nbsp;&nbsp;suppressed: close of C failed</div>
<p>Nó chạy được trên JDK 8 của phòng thi. Ở Chương 9 nó rút gọn phương thức lồng nhau của slide 10 còn vài dòng: <code>try (BufferedReader r = new BufferedReader(new FileReader(name))) { … }</code> — không finally, không quên <code>close()</code>.</p>
<div class="pitfall">Đừng đặt <code>new Scanner(System.in)</code> vào try-with-resources bên trong một hàm nhập: đóng Scanner đó là đóng luôn chính <code>System.in</code>, và mọi lần đọc sau đó trong chương trình đều ném <code>NoSuchElementException</code> (đo thật trong bài thực hành Chương 6).</div>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong>: trong LabFlow bạn hiếm khi viết try-catch trong controller. Một service ném <code>LabNotFoundException</code>, và một lớp đánh dấu <code>@RestControllerAdvice</code> với các phương thức <code>@ExceptionHandler</code> biến mỗi loại ngoại lệ thành một mã HTTP (404, 400). Đó là ý của slide 13 ở quy mô một ứng dụng web: bắt ở đúng một tầng biết phải trả lời gì.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>A method calls <code>new FileReader("a.txt")</code> and has neither try-catch nor throws. Does the program compile? What exact message do you get, and what are the two ways to fix it?</li>
<li><code>try { int[] a = new int[2]; a[2] = 1; System.out.print("A"); } catch (ArithmeticException e) { System.out.print("B"); } finally { System.out.print("C"); } System.out.print("D");</code> — what is printed, and how does the program end?</li>
<li>Why does the slide-16 input loop work when you type but loop forever when the grader pipes the input? Name both causes.</li>
</ul>
<p>Next: the 🧪 practice of Chapter 6 (a PE-ADV1-style custom checked exception, an <code>Inputter</code> for LAB211, real compile errors to name, a stack trace to read, the school's Banking project), then the quiz.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Một phương thức gọi <code>new FileReader("a.txt")</code> mà không có try-catch lẫn throws. Chương trình có biên dịch được không? Thông báo chính xác là gì, và có hai cách sửa nào?</li>
<li><code>try { int[] a = new int[2]; a[2] = 1; System.out.print("A"); } catch (ArithmeticException e) { System.out.print("B"); } finally { System.out.print("C"); } System.out.print("D");</code> — in ra gì, và chương trình kết thúc thế nào?</li>
<li>Vì sao vòng nhập ở slide 16 chạy đúng khi bạn gõ tay nhưng lặp mãi khi máy chấm nạp dữ liệu qua pipe? Kể cả hai nguyên nhân.</li>
</ul>
<p>Tiếp theo: bài 🧪 thực hành Chương 6 (ngoại lệ checked tự tạo kiểu PE-ADV1, một <code>Inputter</code> cho LAB211, lỗi biên dịch thật cần gọi tên, một stack trace cần đọc, project Banking của trường), rồi quiz.</p>`),
    books([
      ['horstmann1', 'Ch. 7.1 "Dealing with Errors" (classification, declaring checked exceptions, creating exception classes), 7.2 "Catching Exceptions" (multiple catch, rethrowing and chaining, finally, try-with-resources, analyzing stack trace elements)', 'Chương 7.1 "Dealing with Errors" (phân loại, khai báo ngoại lệ checked, tạo lớp ngoại lệ), 7.2 "Catching Exceptions" (nhiều catch, ném lại và nối chuỗi nguyên nhân, finally, try-with-resources, phân tích stack trace)'],
      ['fuOffline', 'part "Exception" — What is an Exception, Kinds of Exception, How to fix (try-catch, throws), Examples', 'phần "Exception" — What is an Exception, Kinds of Exception, How to fix (try-catch, throws), Examples'],
      ['javaTutorial', '"Lesson: Exceptions" — Catch or Specify Requirement, Catching and Handling Exceptions, The try-with-resources Statement, Unchecked Exceptions — The Controversy', '"Lesson: Exceptions" — yêu cầu Catch or Specify, bắt và xử lý ngoại lệ, câu lệnh try-with-resources, tranh luận về ngoại lệ unchecked'],
      ['jls8', '§11.1.1 The Kinds of Exceptions, §11.2 Compile-Time Checking of Exceptions, §14.20 The try statement (14.20.2 try-finally, 14.20.3 try-with-resources), §16 Definite Assignment', '§11.1.1 các loại ngoại lệ, §11.2 kiểm tra ngoại lệ lúc biên dịch, §14.20 câu lệnh try (14.20.2 try-finally, 14.20.3 try-with-resources), §16 gán chắc chắn'],
    ]),
  ].join('\n'),
};

/* ───────── 6.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Exceptions the PE way: custom exceptions, safe input, stack traces ───────── */
const L_on_ch6 = {
  title: '6.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Exceptions the PE way: custom exceptions, safe input, stack traces|||6.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Ngoại lệ kiểu PE: ngoại lệ tự tạo, nhập liệu an toàn, stack trace',
  slug: 'pro192-on-ch6',
  type: 'VIDEO',
  description: '6 bài tập Chương 6 có lời giải chạy thật trên JDK 8: ngoại lệ checked tự tạo ném từ constructor và lớp quản lý tách tầng "phát hiện / quyết định" theo dạng đề PE-ADV1, lớp Inputter dùng lại cho LAB211 (mã theo mẫu P000, chuỗi không rỗng, số trong khoảng) kèm đo thật cái bẫy try-with-resources đóng luôn System.in, sáu câu đoán output về finally/return/lan truyền, sáu lỗi biên dịch thật cần gọi tên luật, đọc hai stack trace thật có "Caused by", và sửa project Banking của trường từ sập chương trình sang cây ngoại lệ checked; 14 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.2 · Practice &amp; review</span>
<h2>Exceptions where they are graded: PE-ADV1, LAB211 input, FE traps</h2>
<p class="lead">Lesson 6.A walked the deck "Exception Handling" with every program run on JDK 8. Now the exam shapes. The classic 4-question PE rarely names exceptions, but it punishes a program that crashes on its own test data; the advanced paper <strong>PE-ADV1</strong> in the Exam Room asks for a custom <em>checked</em> exception outright; LAB211 graders type wrong values on purpose; and the FE asks "what is printed?" and "which line does not compile?" about try, catch and finally. Six exercises, each solved and run for real.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Exam link</th></tr></thead>
<tbody>
<tr><td>1</td><td>custom checked exception, constructor that validates, manager that catches</td><td>PE-ADV1 Q1 + Q3</td></tr>
<tr><td>2</td><td>an Inputter for every LAB211 program; the try-with-resources trap</td><td>LAB211, PE harness input</td></tr>
<tr><td>3</td><td>predict six outputs: finally, return, propagation</td><td>FE "what is printed?"</td></tr>
<tr><td>4</td><td>name the rule behind six real compile errors</td><td>FE "which line fails?"</td></tr>
<tr><td>5</td><td>read two real stack traces, including "Caused by"</td><td>debugging, interviews</td></tr>
<tr><td>6</td><td>the school's Banking project: from a crash to checked business exceptions</td><td>design, LAB211</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.2 · Thực hành &amp; ôn tập</span>
<h2>Ngoại lệ ở đúng chỗ bị chấm điểm: PE-ADV1, nhập liệu LAB211, bẫy FE</h2>
<p class="lead">Bài 6.A đã đi hết bộ "Exception Handling" với mọi chương trình chạy trên JDK 8. Giờ là các dạng đề. Đề PE 4 câu kiểu cũ ít khi gọi tên ngoại lệ, nhưng nó phạt chương trình sập với chính dữ liệu thử của đề; đề nâng cao <strong>PE-ADV1</strong> trong Exam Room hỏi thẳng một ngoại lệ <em>checked</em> tự tạo; người chấm LAB211 cố tình gõ giá trị sai; còn đề FE hỏi "in ra gì?" và "dòng nào không biên dịch?" về try, catch và finally. Sáu bài tập, mỗi bài đều đã giải và chạy thật.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Liên hệ đề thi</th></tr></thead>
<tbody>
<tr><td>1</td><td>ngoại lệ checked tự tạo, constructor kiểm tra dữ liệu, lớp quản lý bắt lỗi</td><td>PE-ADV1 câu 1 + câu 3</td></tr>
<tr><td>2</td><td>một Inputter cho mọi chương trình LAB211; bẫy try-with-resources</td><td>LAB211, dữ liệu vào của harness PE</td></tr>
<tr><td>3</td><td>đoán sáu output: finally, return, lan truyền</td><td>FE "in ra gì?"</td></tr>
<tr><td>4</td><td>gọi tên luật đứng sau sáu lỗi biên dịch thật</td><td>FE "dòng nào lỗi?"</td></tr>
<tr><td>5</td><td>đọc hai stack trace thật, có cả "Caused by"</td><td>gỡ lỗi, phỏng vấn</td></tr>
<tr><td>6</td><td>project Banking của trường: từ sập chương trình tới ngoại lệ nghiệp vụ checked</td><td>thiết kế, LAB211</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — A custom checked exception, PE-ADV1 style: InvalidStudentException, Student, StudentManager (~40 min)</h3>
<p>Write the classes of the diagram:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/336dba9ad516e8821b3f4f3f3ac7181f0b7ba2f2.svg" alt="Exercise 1: Student and create() throw; addStudent() is the only place that catches" loading="lazy" /><p class="chu-thich">🧩 Exercise 1: Student and create() throw; addStudent() is the only place that catches</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the throwing layer and the handling layer
' create() and the constructor detect and throw; addStudent() catches and decides; Q1 never sees an exception
class "Exception" as Exc &lt;&lt;java.lang&gt;&gt;
class InvalidStudentException {
  + InvalidStudentException(message : String)
}
class Student {
  - id : String
  - name : String
  - gpa : double
  + Student(id : String, name : String, gpa : double) &lt;&lt;throws InvalidStudentException&gt;&gt;
  + getId() : String
  + getGpa() : double
  + toString() : String
}
class StudentManager {
  - list : List&lt;Student&gt;
  - create(id : String, name : String, gpaText : String) : Student &lt;&lt;throws InvalidStudentException&gt;&gt;
  + addStudent(id : String, name : String, gpaText : String) : String
  + size() : int
  + getAverage() : double
}
class PeStudentManager {
  + {static} main(args : String[]) : void
}
Exc &lt;|-- InvalidStudentException
StudentManager o--&gt; "0..*" Student : list
StudentManager ..&gt; InvalidStudentException : catches
Student ..&gt; InvalidStudentException : throws
PeStudentManager ..&gt; StudentManager : uses
hide Exc members
@enduml</code></pre></details>
<ul>
<li><code>InvalidStudentException</code> — a <strong>checked</strong> exception (it must extend <code>Exception</code>, not <code>RuntimeException</code>) with a constructor taking the message.</li>
<li><code>Student(id, name, gpa)</code> throws it when the id is not "HE" + 6 digits (any case), the name is blank, or gpa is outside 0..10 — with the messages shown in the sample; otherwise stores the id in upper case and the name trimmed.</li>
<li><code>StudentManager.create(id, name, gpaText)</code> (private) parses the gpa — a non-number becomes <code>InvalidStudentException("Invalid gpa: …")</code> — rejects a duplicate id, and builds the Student. <code>addStudent(...)</code> calls it in a try-catch and <strong>never throws</strong>: it returns <code>ADDED id</code> or <code>FAILED id: message</code>; the list must not grow on failure.</li>
<li>Main reads T and T commands <code>add,id,name,gpa</code> / <code>avg</code> (prints <code>AVG=x.xx SIZE=n</code>).</li>
</ul>
<details><summary>Solution (run for real on JDK 8, with the input below)</summary>
<pre class="trich"><code class="language-java">class InvalidStudentException extends Exception {                // Exception, NOT RuntimeException =&gt; checked
    public InvalidStudentException(String message) {
        super(message);
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Student {
    private final String id;
    private final String name;
    private final double gpa;

    public Student(String id, String name, double gpa) throws InvalidStudentException {
        if (id == null || !id.trim().toUpperCase().matches("HE\\\\d{6}"))
            throw new InvalidStudentException("Invalid id: must be HE + 6 digits");
        if (name == null || name.trim().isEmpty())
            throw new InvalidStudentException("Invalid name: must not be blank");
        if (gpa &lt; 0 || gpa &gt; 10)
            throw new InvalidStudentException("Invalid gpa " + gpa + ": must be 0..10");
        this.id = id.trim().toUpperCase();                        // stored only when everything is valid
        this.name = name.trim();
        this.gpa = gpa;
    }

    public String getId() { return id; }
    public double getGpa() { return gpa; }

    @Override
    public String toString() { return String.format("%s|%s|%.2f", id, name, gpa); }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentManager {
    private final List&lt;Student&gt; list = new ArrayList&lt;&gt;();

    private Student create(String id, String name, String gpaText) throws InvalidStudentException {   // detects, does not decide
        double gpa;
        try {
            gpa = Double.parseDouble(gpaText.trim());
        } catch (NumberFormatException e) {
            throw new InvalidStudentException("Invalid gpa: " + gpaText.trim());   // translate into OUR exception
        }
        for (Student s : list)
            if (s.getId().equalsIgnoreCase(id.trim())) throw new InvalidStudentException("Duplicate id " + s.getId());
        return new Student(id, name, gpa);
    }

    public String addStudent(String id, String name, String gpaText) {  // decides: never throws
        try {
            Student s = create(id, name, gpaText);
            list.add(s);                                          // not reached when create() throws
            return "ADDED " + s.getId();
        } catch (InvalidStudentException e) {
            return "FAILED " + id + ": " + e.getMessage();
        }
    }

    public int size() { return list.size(); }

    public double getAverage() {
        if (list.isEmpty()) return 0;
        double sum = 0;
        for (Student s : list) sum += s.getGpa();
        return sum / list.size();
    }
}</code></pre>
<pre class="trich"><code class="language-java">public static void main(String[] args) {                      // like the PE Q1 skeleton: T, then T commands
    Scanner sc = new Scanner(System.in);
    StudentManager m = new StudentManager();
    int t = Integer.parseInt(sc.nextLine().trim());
    for (int k = 0; k &lt; t; k++) {
        String[] p = sc.nextLine().split(",", -1);            // -1 keeps empty fields
        if (p[0].equals("add") &amp;&amp; p.length == 4) System.out.println(m.addStudent(p[1], p[2], p[3]));
        else if (p[0].equals("avg")) System.out.printf("AVG=%.2f SIZE=%d%n", m.getAverage(), m.size());
        else System.out.println("BAD COMMAND " + String.join(",", p));
    }
}</code></pre>
<p>Input:</p>
<pre><code class="language-plaintext">8
add,he190001,Nguyen Van An,8.5
add,HE19002,Tran Thi Binh,7
add,HE190003,   ,9
add,HE190004,Le Van Cuong,11
add,HE190005,Pham Thi Dung,abc
add,HE190001,Do Van Em,6
add,HE190006,Hoang Thi Giang,6.25
avg</code></pre>
<div class="out">ADDED HE190001<br>
FAILED HE19002: Invalid id: must be HE + 6 digits<br>
FAILED HE190003: Invalid name: must not be blank<br>
FAILED HE190004: Invalid gpa 11.0: must be 0..10<br>
FAILED HE190005: Invalid gpa: abc<br>
FAILED HE190001: Duplicate id HE190001<br>
ADDED HE190006<br>
AVG=7.38 SIZE=2</div>
<p>The design is PE-ADV1's: <strong>detect</strong> and <strong>decide</strong> live in different methods. The constructor and <code>create()</code> only detect — they throw, because they cannot know whether the caller wants to skip the record, ask again or stop. <code>addStudent()</code> decides: skip and report. The list cannot grow on failure, and not because you were careful: <code>list.add(s)</code> comes after <code>create(...)</code> inside the try, so when create throws, that line is never reached. Note also the <strong>translation</strong> in <code>create()</code>: a <code>NumberFormatException</code> from <code>parseDouble</code> is caught and re-thrown as our own exception type, so the caller has one type to handle.</p>
</details>
<div class="pitfall">Where marks are lost: (1) <code>extends RuntimeException</code> when the paper says checked — the given harness, which wraps <code>new Student(...)</code> in try-catch, still compiles, but a marker checking "checked" fails you; (2) storing <code>id</code> before validating, so an object half-built with bad data exists; (3) a message that differs by one character from the paper's ("Invalid id:" versus "Invalid ID:").</div>`,
    `<h3>🧪 Bài 1 — Ngoại lệ checked tự tạo, kiểu PE-ADV1: InvalidStudentException, Student, StudentManager (~40 phút)</h3>
<p>Viết các lớp trong sơ đồ:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/336dba9ad516e8821b3f4f3f3ac7181f0b7ba2f2.svg" alt="Bài 1: Student và create() ném; addStudent() là chỗ duy nhất bắt" loading="lazy" /><p class="chu-thich">🧩 Bài 1: Student và create() ném; addStudent() là chỗ duy nhất bắt</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the throwing layer and the handling layer
' create() và constructor phát hiện và ném; addStudent() bắt và quyết định; Q1 không bao giờ thấy ngoại lệ
class "Exception" as Exc &lt;&lt;java.lang&gt;&gt;
class InvalidStudentException {
  + InvalidStudentException(message : String)
}
class Student {
  - id : String
  - name : String
  - gpa : double
  + Student(id : String, name : String, gpa : double) &lt;&lt;throws InvalidStudentException&gt;&gt;
  + getId() : String
  + getGpa() : double
  + toString() : String
}
class StudentManager {
  - list : List&lt;Student&gt;
  - create(id : String, name : String, gpaText : String) : Student &lt;&lt;throws InvalidStudentException&gt;&gt;
  + addStudent(id : String, name : String, gpaText : String) : String
  + size() : int
  + getAverage() : double
}
class PeStudentManager {
  + {static} main(args : String[]) : void
}
Exc &lt;|-- InvalidStudentException
StudentManager o--&gt; "0..*" Student : list
StudentManager ..&gt; InvalidStudentException : catches
Student ..&gt; InvalidStudentException : throws
PeStudentManager ..&gt; StudentManager : uses
hide Exc members
@enduml</code></pre></details>
<ul>
<li><code>InvalidStudentException</code> — một ngoại lệ <strong>checked</strong> (phải kế thừa <code>Exception</code>, không phải <code>RuntimeException</code>) có constructor nhận thông điệp.</li>
<li><code>Student(id, name, gpa)</code> ném nó khi id không phải "HE" + 6 chữ số (hoa thường đều được), tên rỗng, hoặc gpa ngoài 0..10 — với các thông điệp như mẫu; ngược lại lưu id viết hoa và tên đã cắt khoảng trắng.</li>
<li><code>StudentManager.create(id, name, gpaText)</code> (private) đổi gpa sang số — không phải số thì thành <code>InvalidStudentException("Invalid gpa: …")</code> — từ chối id trùng, và tạo Student. <code>addStudent(...)</code> gọi nó trong try-catch và <strong>không bao giờ ném</strong>: trả về <code>ADDED id</code> hoặc <code>FAILED id: thông điệp</code>; danh sách không được lớn thêm khi thất bại.</li>
<li>Main đọc T và T lệnh <code>add,id,name,gpa</code> / <code>avg</code> (in <code>AVG=x.xx SIZE=n</code>).</li>
</ul>
<details><summary>Lời giải (chạy thật trên JDK 8, với dữ liệu bên dưới)</summary>
<pre class="trich"><code class="language-java">class InvalidStudentException extends Exception {                // Exception, KHÔNG phải RuntimeException =&gt; checked
    public InvalidStudentException(String message) {
        super(message);
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Student {
    private final String id;
    private final String name;
    private final double gpa;

    public Student(String id, String name, double gpa) throws InvalidStudentException {
        if (id == null || !id.trim().toUpperCase().matches("HE\\\\d{6}"))
            throw new InvalidStudentException("Invalid id: must be HE + 6 digits");
        if (name == null || name.trim().isEmpty())
            throw new InvalidStudentException("Invalid name: must not be blank");
        if (gpa &lt; 0 || gpa &gt; 10)
            throw new InvalidStudentException("Invalid gpa " + gpa + ": must be 0..10");
        this.id = id.trim().toUpperCase();                        // chỉ lưu khi mọi thứ hợp lệ
        this.name = name.trim();
        this.gpa = gpa;
    }

    public String getId() { return id; }
    public double getGpa() { return gpa; }

    @Override
    public String toString() { return String.format("%s|%s|%.2f", id, name, gpa); }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentManager {
    private final List&lt;Student&gt; list = new ArrayList&lt;&gt;();

    private Student create(String id, String name, String gpaText) throws InvalidStudentException {   // phát hiện, không quyết định
        double gpa;
        try {
            gpa = Double.parseDouble(gpaText.trim());
        } catch (NumberFormatException e) {
            throw new InvalidStudentException("Invalid gpa: " + gpaText.trim());   // dịch sang ngoại lệ CỦA TA
        }
        for (Student s : list)
            if (s.getId().equalsIgnoreCase(id.trim())) throw new InvalidStudentException("Duplicate id " + s.getId());
        return new Student(id, name, gpa);
    }

    public String addStudent(String id, String name, String gpaText) {  // quyết định: không bao giờ ném
        try {
            Student s = create(id, name, gpaText);
            list.add(s);                                          // không chạy tới khi create() ném
            return "ADDED " + s.getId();
        } catch (InvalidStudentException e) {
            return "FAILED " + id + ": " + e.getMessage();
        }
    }

    public int size() { return list.size(); }

    public double getAverage() {
        if (list.isEmpty()) return 0;
        double sum = 0;
        for (Student s : list) sum += s.getGpa();
        return sum / list.size();
    }
}</code></pre>
<pre class="trich"><code class="language-java">public static void main(String[] args) {                      // giống khung Q1 của PE: T, rồi T lệnh
    Scanner sc = new Scanner(System.in);
    StudentManager m = new StudentManager();
    int t = Integer.parseInt(sc.nextLine().trim());
    for (int k = 0; k &lt; t; k++) {
        String[] p = sc.nextLine().split(",", -1);            // -1 giữ lại trường rỗng
        if (p[0].equals("add") &amp;&amp; p.length == 4) System.out.println(m.addStudent(p[1], p[2], p[3]));
        else if (p[0].equals("avg")) System.out.printf("AVG=%.2f SIZE=%d%n", m.getAverage(), m.size());
        else System.out.println("BAD COMMAND " + String.join(",", p));
    }
}</code></pre>
<p>Dữ liệu vào:</p>
<pre><code class="language-plaintext">8
add,he190001,Nguyen Van An,8.5
add,HE19002,Tran Thi Binh,7
add,HE190003,   ,9
add,HE190004,Le Van Cuong,11
add,HE190005,Pham Thi Dung,abc
add,HE190001,Do Van Em,6
add,HE190006,Hoang Thi Giang,6.25
avg</code></pre>
<div class="out">ADDED HE190001<br>
FAILED HE19002: Invalid id: must be HE + 6 digits<br>
FAILED HE190003: Invalid name: must not be blank<br>
FAILED HE190004: Invalid gpa 11.0: must be 0..10<br>
FAILED HE190005: Invalid gpa: abc<br>
FAILED HE190001: Duplicate id HE190001<br>
ADDED HE190006<br>
AVG=7.38 SIZE=2</div>
<p>Thiết kế là của PE-ADV1: <strong>phát hiện</strong> và <strong>quyết định</strong> nằm ở hai phương thức khác nhau. Constructor và <code>create()</code> chỉ phát hiện — chúng ném, vì chúng không thể biết bên gọi muốn bỏ qua bản ghi, hỏi lại hay dừng. <code>addStudent()</code> quyết định: bỏ qua và báo lại. Danh sách không thể lớn thêm khi thất bại, và không phải nhờ bạn cẩn thận: <code>list.add(s)</code> nằm sau <code>create(...)</code> trong try, nên khi create ném thì dòng đó không bao giờ được chạy tới. Để ý thêm việc <strong>dịch</strong> trong <code>create()</code>: một <code>NumberFormatException</code> từ <code>parseDouble</code> được bắt và ném lại thành kiểu ngoại lệ của ta, nên bên gọi chỉ phải xử lý một kiểu.</p>
</details>
<div class="pitfall">Chỗ hay mất điểm: (1) <code>extends RuntimeException</code> khi đề bảo checked — harness cho sẵn bọc <code>new Student(...)</code> trong try-catch vẫn biên dịch được, nhưng tiêu chí chấm "checked" đánh trượt bạn; (2) lưu <code>id</code> trước khi kiểm tra, tạo ra một đối tượng dựng dở với dữ liệu sai; (3) thông điệp lệch một ký tự so với đề ("Invalid id:" với "Invalid ID:").</div>`),
    bi(`<h3>🧪 Exercise 2 — An Inputter for every LAB211 program, and a trap to measure (~30 min)</h3>
<p>Write a class <code>Inputter</code> with static methods <code>readNonBlank(prompt)</code> (also squeezes inner spaces), <code>readPattern(prompt, regex, rule)</code>, <code>readInt(prompt, min, max)</code> and <code>readDouble(prompt, minExclusive)</code>. Each loops until the value is valid and prints a message that says <em>what</em> is wrong. Use it to read a product: code "P000" (P + 3 digits, any case), name not blank, price &gt; 0, quantity 1..1000. Then measure what happens if an input method wraps its own Scanner in try-with-resources.</p>
<details><summary>Solution — the Inputter, run with input full of mistakes (JDK 8)</summary>
<pre class="trich"><code class="language-java">class Inputter {
    private static final Scanner SC = new Scanner(System.in);    // the ONLY Scanner on System.in, never closed

    private static String line(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                    // echo for the transcript
        return s;
    }

    public static String readNonBlank(String prompt) {
        while (true) {
            String s = line(prompt);
            if (!s.isEmpty()) return s.replaceAll("\\\\s+", " ");    // also squeeze inner spaces
            System.out.println("  ! must not be blank");
        }
    }

    public static String readPattern(String prompt, String regex, String rule) {
        while (true) {
            String s = line(prompt);
            if (s.matches(regex)) return s.toUpperCase();
            System.out.println("  ! " + rule);
        }
    }

    public static int readInt(String prompt, int min, int max) {
        while (true) {
            String s = line(prompt);
            try {
                int n = Integer.parseInt(s);
                if (n &gt;= min &amp;&amp; n &lt;= max) return n;
                System.out.println("  ! must be " + min + ".." + max);
            } catch (NumberFormatException e) {
                System.out.println("  ! \\"" + s + "\\" is not an integer");
            }
        }
    }

    public static double readDouble(String prompt, double minExclusive) {
        while (true) {
            String s = line(prompt);
            try {
                double d = Double.parseDouble(s);
                if (d &gt; minExclusive) return d;
                System.out.println("  ! must be &gt; " + minExclusive);
            } catch (NumberFormatException e) {
                System.out.println("  ! \\"" + s + "\\" is not a number");
            }
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">String code = Inputter.readPattern("code (P000): ", "[pP]\\\\d{3}", "format is P + 3 digits, e.g. P007");
String name = Inputter.readNonBlank("name: ");
double price = Inputter.readDouble("price: ", 0);
int qty = Inputter.readInt("quantity (1..1000): ", 1, 1000);
System.out.printf("OK -&gt; %s | %s | %.2f | %d%n", code, name, price, qty);</code></pre>
<p>Input: <code>P12 / p012 / (spaces) / "  Sony   TV 65  " / -3 / 8,5 / 850.5 / 0 / 2000 / 12x / 12</code>.</p>
<div class="out">code (P000): P12<br>
&nbsp;&nbsp;! format is P + 3 digits, e.g. P007<br>
code (P000): p012<br>
name:<br>
&nbsp;&nbsp;! must not be blank<br>
name: Sony &nbsp;&nbsp;TV 65<br>
price: -3<br>
&nbsp;&nbsp;! must be &gt; 0.0<br>
price: 8,5<br>
&nbsp;&nbsp;! "8,5" is not a number<br>
price: 850.5<br>
quantity (1..1000): 0<br>
&nbsp;&nbsp;! must be 1..1000<br>
quantity (1..1000): 2000<br>
&nbsp;&nbsp;! must be 1..1000<br>
quantity (1..1000): 12x<br>
&nbsp;&nbsp;! "12x" is not an integer<br>
quantity (1..1000): 12<br>
OK -&gt; P012 | Sony TV 65 | 850.50 | 12</div>
<p>One Scanner, created once, <strong>never closed</strong>; every value read as a whole line with <code>nextLine()</code>, then converted — so the <code>nextInt()</code>/<code>nextLine()</code> trap of 7.A slide 15 cannot happen. <code>readPattern</code> uses <code>String.matches</code> with a regular expression: <code>[pP]\\d{3}</code> means "one P or p, then exactly three digits" (the FU material's Product Manager uses the same pattern). "8,5" is refused: <code>Double.parseDouble</code> accepts only a dot, whatever the computer's language.</p>
</details>
<details><summary>The trap, measured — try-with-resources around new Scanner(System.in)</summary>
<pre class="trich"><code class="language-java">static String readName() {
    try (Scanner sc = new Scanner(System.in)) {             // looks tidy: "always close resources"
        System.out.print("name: ");
        return sc.nextLine();
    }                                                        // closes the Scanner AND System.in under it
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("[" + readName() + "]");
try {
    System.out.println("[" + readName() + "]");          // there are still two lines of input
} catch (NoSuchElementException e) {
    System.out.println();
    System.out.println("second call: " + e);
}</code></pre>
<div class="out">name: [An]<br>
name:<br>
second call: java.util.NoSuchElementException: No line found</div>
<p>Input: <code>An / Binh / Chi</code> — there is plenty left, yet the second call fails with <code>NoSuchElementException: No line found</code>. Closing a Scanner closes the stream under it; <code>System.in</code> cannot be reopened. "Always close resources" applies to files and connections you opened; <code>System.in</code> belongs to the JVM — leave it open.</p>
</details>
<div class="callout">🧭 <strong>Go further — LAB211</strong>: keep this class in your own toolbox and copy it into every LAB211 project (the course allows your own materials). Add <code>readDate</code> with <code>SimpleDateFormat.setLenient(false)</code> and the class covers almost every input of the semester.</div>`,
    `<h3>🧪 Bài 2 — Một Inputter cho mọi chương trình LAB211, và một cái bẫy cần đo (~30 phút)</h3>
<p>Viết lớp <code>Inputter</code> với các phương thức static <code>readNonBlank(prompt)</code> (gộp luôn khoảng trắng thừa bên trong), <code>readPattern(prompt, regex, rule)</code>, <code>readInt(prompt, min, max)</code> và <code>readDouble(prompt, minExclusive)</code>. Mỗi hàm lặp tới khi giá trị hợp lệ và in thông báo nói rõ <em>sai ở đâu</em>. Dùng nó để nhập một sản phẩm: mã "P000" (P + 3 chữ số, hoa thường đều được), tên không rỗng, giá &gt; 0, số lượng 1..1000. Rồi đo điều gì xảy ra nếu một hàm nhập bọc Scanner riêng của nó trong try-with-resources.</p>
<details><summary>Lời giải — Inputter, chạy với dữ liệu đầy lỗi (JDK 8)</summary>
<pre class="trich"><code class="language-java">class Inputter {
    private static final Scanner SC = new Scanner(System.in);    // Scanner DUY NHẤT trên System.in, không bao giờ đóng

    private static String line(String prompt) {
        System.out.print(prompt);
        String s = SC.nextLine().trim();
        System.out.println(s);                                    // in lại cho bản ghi
        return s;
    }

    public static String readNonBlank(String prompt) {
        while (true) {
            String s = line(prompt);
            if (!s.isEmpty()) return s.replaceAll("\\\\s+", " ");    // gộp luôn khoảng trắng thừa bên trong
            System.out.println("  ! must not be blank");
        }
    }

    public static String readPattern(String prompt, String regex, String rule) {
        while (true) {
            String s = line(prompt);
            if (s.matches(regex)) return s.toUpperCase();
            System.out.println("  ! " + rule);
        }
    }

    public static int readInt(String prompt, int min, int max) {
        while (true) {
            String s = line(prompt);
            try {
                int n = Integer.parseInt(s);
                if (n &gt;= min &amp;&amp; n &lt;= max) return n;
                System.out.println("  ! must be " + min + ".." + max);
            } catch (NumberFormatException e) {
                System.out.println("  ! \\"" + s + "\\" is not an integer");
            }
        }
    }

    public static double readDouble(String prompt, double minExclusive) {
        while (true) {
            String s = line(prompt);
            try {
                double d = Double.parseDouble(s);
                if (d &gt; minExclusive) return d;
                System.out.println("  ! must be &gt; " + minExclusive);
            } catch (NumberFormatException e) {
                System.out.println("  ! \\"" + s + "\\" is not a number");
            }
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">String code = Inputter.readPattern("code (P000): ", "[pP]\\\\d{3}", "format is P + 3 digits, e.g. P007");
String name = Inputter.readNonBlank("name: ");
double price = Inputter.readDouble("price: ", 0);
int qty = Inputter.readInt("quantity (1..1000): ", 1, 1000);
System.out.printf("OK -&gt; %s | %s | %.2f | %d%n", code, name, price, qty);</code></pre>
<p>Dữ liệu vào: <code>P12 / p012 / (khoảng trắng) / "  Sony   TV 65  " / -3 / 8,5 / 850.5 / 0 / 2000 / 12x / 12</code>.</p>
<div class="out">code (P000): P12<br>
&nbsp;&nbsp;! format is P + 3 digits, e.g. P007<br>
code (P000): p012<br>
name:<br>
&nbsp;&nbsp;! must not be blank<br>
name: Sony &nbsp;&nbsp;TV 65<br>
price: -3<br>
&nbsp;&nbsp;! must be &gt; 0.0<br>
price: 8,5<br>
&nbsp;&nbsp;! "8,5" is not a number<br>
price: 850.5<br>
quantity (1..1000): 0<br>
&nbsp;&nbsp;! must be 1..1000<br>
quantity (1..1000): 2000<br>
&nbsp;&nbsp;! must be 1..1000<br>
quantity (1..1000): 12x<br>
&nbsp;&nbsp;! "12x" is not an integer<br>
quantity (1..1000): 12<br>
OK -&gt; P012 | Sony TV 65 | 850.50 | 12</div>
<p>Một Scanner, tạo một lần, <strong>không bao giờ đóng</strong>; mọi giá trị đều đọc nguyên dòng bằng <code>nextLine()</code>, rồi mới đổi kiểu — nên bẫy <code>nextInt()</code>/<code>nextLine()</code> của 7.A slide 15 không thể xảy ra. <code>readPattern</code> dùng <code>String.matches</code> với một biểu thức chính quy (regular expression): <code>[pP]\\d{3}</code> nghĩa là "một chữ P hoặc p, rồi đúng ba chữ số" (chương trình Product Manager trong học liệu FU dùng đúng mẫu này). "8,5" bị từ chối: <code>Double.parseDouble</code> chỉ nhận dấu chấm, bất kể ngôn ngữ của máy.</p>
</details>
<details><summary>Cái bẫy, đo thật — try-with-resources quanh new Scanner(System.in)</summary>
<pre class="trich"><code class="language-java">static String readName() {
    try (Scanner sc = new Scanner(System.in)) {             // trông gọn gàng: "luôn đóng tài nguyên"
        System.out.print("name: ");
        return sc.nextLine();
    }                                                        // đóng Scanner VÀ luôn System.in bên dưới
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("[" + readName() + "]");
try {
    System.out.println("[" + readName() + "]");          // vẫn còn hai dòng dữ liệu
} catch (NoSuchElementException e) {
    System.out.println();
    System.out.println("second call: " + e);
}</code></pre>
<div class="out">name: [An]<br>
name:<br>
second call: java.util.NoSuchElementException: No line found</div>
<p>Dữ liệu vào: <code>An / Binh / Chi</code> — còn thừa nhiều, vậy mà lần gọi thứ hai hỏng với <code>NoSuchElementException: No line found</code>. Đóng một Scanner là đóng luồng bên dưới nó; <code>System.in</code> không mở lại được. "Luôn đóng tài nguyên" áp dụng cho file và kết nối do bạn mở; <code>System.in</code> thuộc về JVM — hãy để nó mở.</p>
</details>
<div class="callout">🧭 <strong>Đi tiếp — LAB211</strong>: giữ lớp này trong bộ đồ nghề riêng và chép vào mọi project LAB211 (môn cho phép dùng tài liệu của chính bạn). Thêm <code>readDate</code> dùng <code>SimpleDateFormat.setLenient(false)</code> là lớp này phủ gần hết mọi kiểu nhập của cả kỳ.</div>`),
    bi(`<h3>🧪 Exercise 3 — Predict six outputs (~15 min)</h3>
<p>FE style. Write down what (a)–(f) print before opening the answer. (b) prints the value returned by <code>b()</code>; in (d) the caller catches whatever leaves <code>d()</code>.</p>
<pre class="trich"><code class="language-java">static void a() {
    try {
        Object o = "PRO192";
        Integer n = (Integer) o;                     // ClassCastException
        System.out.print("A1 ");
    } catch (RuntimeException e) {
        System.out.print("A2 ");
    } finally {
        System.out.print("A3 ");
    }
    System.out.println("A4");
}

static int b() {
    int x = 1;
    try {
        return x;
    } finally {
        x = 5;
    }
}

static void c2() {
    try {
        System.out.print("C1 ");
        int k = 10 / 0;
        System.out.print("C2 ");
    } finally {
        System.out.print("C3 ");
    }
}
static void c() {
    try {
        c2();
        System.out.print("C4 ");
    } catch (ArithmeticException e) {
        System.out.print("C5 ");
    }
    System.out.println("C6");
}

static void d() {
    try {
        throw new IllegalStateException("first");
    } catch (IllegalStateException e) {
        System.out.print("D1 ");
        Integer.parseInt("x");                       // a NEW exception, thrown inside the catch
    } catch (NumberFormatException e) {
        System.out.print("D2 ");
    } finally {
        System.out.print("D3 ");
    }
}

static void e() {
    int[] a = new int[3];
    try {
        try {
            a[3] = 1;
        } finally {
            System.out.print("E1 ");
        }
        System.out.print("E2 ");
    } catch (ArrayIndexOutOfBoundsException ex) {
        System.out.print("E3 ");
    }
    System.out.println("E4");
}

static void f() {
    for (int i = 1; i &lt;= 3; i++) {
        try {
            if (i == 2) throw new Exception("two");
            System.out.print(i);
        } catch (Exception ex) {
            System.out.print(ex.getMessage());
        } finally {
            System.out.print(".");
        }
    }
    System.out.println();
}</code></pre>
<pre class="trich"><code class="language-java">System.out.print("(a) "); a();
System.out.println("(b) " + b());
System.out.print("(c) "); c();
System.out.print("(d) ");
try { d(); } catch (NumberFormatException ex) { System.out.println("| caller got " + ex.getClass().getSimpleName()); }
System.out.print("(e) "); e();
System.out.print("(f) "); f();</code></pre>
<details><summary>Answer (real output) and the rule behind each line</summary>
<div class="out">(a) A2 A3 A4<br>
(b) 1<br>
(c) C1 C3 C5 C6<br>
(d) D1 D3 | caller got NumberFormatException<br>
(e) E1 E3 E4<br>
(f) 1.two.3.</div>
<ul>
<li><strong>(a)</strong> the cast throws <code>ClassCastException</code>, a subclass of <code>RuntimeException</code>: "father = son", the catch matches; A1 is skipped; finally; then the code after the try.</li>
<li><strong>(b)</strong> <code>return x</code> evaluates <code>x</code> (1) <em>before</em> finally runs; changing the variable in finally does not change the value already chosen. (A <code>return</code> <em>inside</em> finally would.)</li>
<li><strong>(c)</strong> <code>c2()</code> has no catch: its finally prints C3 on the way out, C2 and C4 are skipped, <code>c()</code> catches (C5) and goes on (C6).</li>
<li><strong>(d)</strong> an exception thrown <strong>inside a catch</strong> is not handled by the sibling catches of the same try — D2 never prints. finally still runs (D3), then the <code>NumberFormatException</code> leaves <code>d()</code>.</li>
<li><strong>(e)</strong> the inner try has only a finally: E1, then the exception moves to the outer try, skipping E2; the outer catch prints E3.</li>
<li><strong>(f)</strong> the try-catch is <em>inside</em> the loop, so one bad iteration does not stop the loop; finally runs once per iteration.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — Đoán sáu output (~15 phút)</h3>
<p>Kiểu FE. Ghi ra (a)–(f) in gì trước khi mở đáp án. (b) in giá trị do <code>b()</code> trả về; ở (d) bên gọi bắt bất cứ thứ gì thoát ra khỏi <code>d()</code>.</p>
<pre class="trich"><code class="language-java">static void a() {
    try {
        Object o = "PRO192";
        Integer n = (Integer) o;                     // ClassCastException
        System.out.print("A1 ");
    } catch (RuntimeException e) {
        System.out.print("A2 ");
    } finally {
        System.out.print("A3 ");
    }
    System.out.println("A4");
}

static int b() {
    int x = 1;
    try {
        return x;
    } finally {
        x = 5;
    }
}

static void c2() {
    try {
        System.out.print("C1 ");
        int k = 10 / 0;
        System.out.print("C2 ");
    } finally {
        System.out.print("C3 ");
    }
}
static void c() {
    try {
        c2();
        System.out.print("C4 ");
    } catch (ArithmeticException e) {
        System.out.print("C5 ");
    }
    System.out.println("C6");
}

static void d() {
    try {
        throw new IllegalStateException("first");
    } catch (IllegalStateException e) {
        System.out.print("D1 ");
        Integer.parseInt("x");                       // một ngoại lệ MỚI, ném bên trong catch
    } catch (NumberFormatException e) {
        System.out.print("D2 ");
    } finally {
        System.out.print("D3 ");
    }
}

static void e() {
    int[] a = new int[3];
    try {
        try {
            a[3] = 1;
        } finally {
            System.out.print("E1 ");
        }
        System.out.print("E2 ");
    } catch (ArrayIndexOutOfBoundsException ex) {
        System.out.print("E3 ");
    }
    System.out.println("E4");
}

static void f() {
    for (int i = 1; i &lt;= 3; i++) {
        try {
            if (i == 2) throw new Exception("two");
            System.out.print(i);
        } catch (Exception ex) {
            System.out.print(ex.getMessage());
        } finally {
            System.out.print(".");
        }
    }
    System.out.println();
}</code></pre>
<pre class="trich"><code class="language-java">System.out.print("(a) "); a();
System.out.println("(b) " + b());
System.out.print("(c) "); c();
System.out.print("(d) ");
try { d(); } catch (NumberFormatException ex) { System.out.println("| caller got " + ex.getClass().getSimpleName()); }
System.out.print("(e) "); e();
System.out.print("(f) "); f();</code></pre>
<details><summary>Đáp án (output thật) và luật đứng sau mỗi dòng</summary>
<div class="out">(a) A2 A3 A4<br>
(b) 1<br>
(c) C1 C3 C5 C6<br>
(d) D1 D3 | caller got NumberFormatException<br>
(e) E1 E3 E4<br>
(f) 1.two.3.</div>
<ul>
<li><strong>(a)</strong> phép ép kiểu ném <code>ClassCastException</code>, một lớp con của <code>RuntimeException</code>: "cha = con", catch khớp; A1 bị bỏ qua; finally; rồi tới code sau try.</li>
<li><strong>(b)</strong> <code>return x</code> tính <code>x</code> (bằng 1) <em>trước</em> khi finally chạy; đổi biến trong finally không đổi được giá trị đã chọn. (Một <code>return</code> <em>bên trong</em> finally thì đổi được.)</li>
<li><strong>(c)</strong> <code>c2()</code> không có catch: finally của nó in C3 trên đường thoát ra, C2 và C4 bị bỏ qua, <code>c()</code> bắt (C5) và chạy tiếp (C6).</li>
<li><strong>(d)</strong> ngoại lệ ném ra <strong>bên trong một catch</strong> không được các catch anh em của cùng try xử lý — D2 không bao giờ in. finally vẫn chạy (D3), rồi <code>NumberFormatException</code> thoát ra khỏi <code>d()</code>.</li>
<li><strong>(e)</strong> try bên trong chỉ có finally: E1, rồi ngoại lệ chuyển ra try bên ngoài, bỏ qua E2; catch bên ngoài in E3.</li>
<li><strong>(f)</strong> try-catch nằm <em>bên trong</em> vòng lặp, nên một vòng lỗi không làm dừng cả vòng lặp; finally chạy một lần cho mỗi vòng.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — Name the rule behind six real compile errors (~15 min)</h3>
<p>Each snippet breaks one rule of Chapter 6. Read the real JDK 8 message and say, in one sentence, which rule and how to fix it.</p>
<details><summary>The snippets and the real errors</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== E1 ==");
    viet(d, "E1.java",
        "public class E1 {",
        "    public static void main(String[] args) {",
        "        try { System.out.println(args[0]); }",
        "        catch (RuntimeException e) { System.out.println(\\"runtime\\"); }",
        "        catch (ArrayIndexOutOfBoundsException e) { System.out.println(\\"index\\"); }",
        "    }",
        "}");
    lenh(d, "javac", "E1.java");

    System.out.println("== E2 ==");
    viet(d, "E2.java",
        "import java.io.IOException;",
        "public class E2 {",
        "    public static void main(String[] args) {",
        "        try { System.out.println(\\"hello\\"); }",
        "        catch (IOException e) { System.out.println(\\"io\\"); }",
        "    }",
        "}");
    lenh(d, "javac", "E2.java");

    System.out.println("== E3 ==");
    viet(d, "E3.java",
        "public class E3 {",
        "    static void check(int age) throws Exception {",
        "        if (age &lt; 0) throw new Exception(\\"negative age\\");",
        "    }",
        "    public static void main(String[] args) {",
        "        check(20);",
        "    }",
        "}");
    lenh(d, "javac", "E3.java");

    System.out.println("== E4 ==");
    viet(d, "E4.java",
        "import java.io.*;",
        "class Reader1 { void read() throws FileNotFoundException { } }",
        "class Reader2 extends Reader1 {",
        "    @Override",
        "    void read() throws IOException { }",
        "}",
        "public class E4 { }");
    lenh(d, "javac", "E4.java");

    System.out.println("== E5 ==");
    viet(d, "E5.java",
        "public class E5 {",
        "    public static void main(String[] args) {",
        "        try {",
        "            int n = Integer.parseInt(\\"12\\");",
        "        }",
        "        System.out.println(\\"done\\");",
        "    }",
        "}");
    lenh(d, "javac", "E5.java");

    System.out.println("== E6 ==");
    viet(d, "E6.java",
        "public class E6 {",
        "    public static void main(String[] args) {",
        "        try {",
        "            int n = Integer.parseInt(args[0]);",
        "        } catch (NumberFormatException e) {",
        "            n = 0;",
        "        }",
        "        System.out.println(n);",
        "    }",
        "}");
    lenh(d, "javac", "E6.java");
}</code></pre>
<div class="out">== E1 ==<br>
&gt; javac E1.java<br>
E1.java:5: error: exception ArrayIndexOutOfBoundsException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (ArrayIndexOutOfBoundsException e) { System.out.println("index"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E2 ==<br>
&gt; javac E2.java<br>
E2.java:5: error: exception IOException is never thrown in body of corresponding try statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (IOException e) { System.out.println("io"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E3 ==<br>
&gt; javac E3.java<br>
E3.java:6: error: unreported exception Exception; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;check(20);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E4 ==<br>
&gt; javac E4.java<br>
E4.java:5: error: read() in Reader2 cannot override read() in Reader1<br>
&nbsp;&nbsp;&nbsp;&nbsp;void read() throws IOException { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overridden method does not throw IOException<br>
1 error<br>
(exit code 1)<br>
== E5 ==<br>
&gt; javac E5.java<br>
E5.java:3: error: 'try' without 'catch', 'finally' or resource declarations<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;try {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E6 ==<br>
&gt; javac E6.java<br>
E6.java:6: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n = 0;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable n<br>
&nbsp;&nbsp;location: class E6<br>
E6.java:8: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable n<br>
&nbsp;&nbsp;location: class E6<br>
2 errors<br>
(exit code 1)</div>
</details>
<details><summary>Answers</summary>
<ol>
<li><strong>E1</strong> — catches are tried top to bottom; a superclass catch before a subclass catch makes the second unreachable. Put <code>ArrayIndexOutOfBoundsException</code> first.</li>
<li><strong>E2</strong> — you may not catch a <strong>checked</strong> exception that the try block cannot throw (unchecked ones and <code>Exception</code> itself are allowed). Remove the catch, or put the file code there.</li>
<li><strong>E3</strong> — calling a method that <code>throws Exception</code> obliges the caller to catch or declare: wrap <code>check(20)</code> in try-catch, or add <code>throws Exception</code> to main.</li>
<li><strong>E4</strong> — an overriding method may not declare a <strong>broader</strong> checked exception than the method it overrides (FileNotFoundException → IOException is broader). Declare the same, a subclass, or none.</li>
<li><strong>E5</strong> — a <code>try</code> needs a catch, a finally, or resources in parentheses.</li>
<li><strong>E6</strong> — a variable declared inside <code>try { }</code> exists only there. Declare <code>int n;</code> before the try (and then javac checks it is assigned on every path).</li>
</ol>
</details>`,
    `<h3>🧪 Bài 4 — Gọi tên luật đứng sau sáu lỗi biên dịch thật (~15 phút)</h3>
<p>Mỗi đoạn vi phạm một luật của Chương 6. Đọc thông báo thật của JDK 8 và nói, trong một câu, đó là luật nào và sửa thế nào.</p>
<details><summary>Các đoạn code và lỗi thật</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== E1 ==");
    viet(d, "E1.java",
        "public class E1 {",
        "    public static void main(String[] args) {",
        "        try { System.out.println(args[0]); }",
        "        catch (RuntimeException e) { System.out.println(\\"runtime\\"); }",
        "        catch (ArrayIndexOutOfBoundsException e) { System.out.println(\\"index\\"); }",
        "    }",
        "}");
    lenh(d, "javac", "E1.java");

    System.out.println("== E2 ==");
    viet(d, "E2.java",
        "import java.io.IOException;",
        "public class E2 {",
        "    public static void main(String[] args) {",
        "        try { System.out.println(\\"hello\\"); }",
        "        catch (IOException e) { System.out.println(\\"io\\"); }",
        "    }",
        "}");
    lenh(d, "javac", "E2.java");

    System.out.println("== E3 ==");
    viet(d, "E3.java",
        "public class E3 {",
        "    static void check(int age) throws Exception {",
        "        if (age &lt; 0) throw new Exception(\\"negative age\\");",
        "    }",
        "    public static void main(String[] args) {",
        "        check(20);",
        "    }",
        "}");
    lenh(d, "javac", "E3.java");

    System.out.println("== E4 ==");
    viet(d, "E4.java",
        "import java.io.*;",
        "class Reader1 { void read() throws FileNotFoundException { } }",
        "class Reader2 extends Reader1 {",
        "    @Override",
        "    void read() throws IOException { }",
        "}",
        "public class E4 { }");
    lenh(d, "javac", "E4.java");

    System.out.println("== E5 ==");
    viet(d, "E5.java",
        "public class E5 {",
        "    public static void main(String[] args) {",
        "        try {",
        "            int n = Integer.parseInt(\\"12\\");",
        "        }",
        "        System.out.println(\\"done\\");",
        "    }",
        "}");
    lenh(d, "javac", "E5.java");

    System.out.println("== E6 ==");
    viet(d, "E6.java",
        "public class E6 {",
        "    public static void main(String[] args) {",
        "        try {",
        "            int n = Integer.parseInt(args[0]);",
        "        } catch (NumberFormatException e) {",
        "            n = 0;",
        "        }",
        "        System.out.println(n);",
        "    }",
        "}");
    lenh(d, "javac", "E6.java");
}</code></pre>
<div class="out">== E1 ==<br>
&gt; javac E1.java<br>
E1.java:5: error: exception ArrayIndexOutOfBoundsException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (ArrayIndexOutOfBoundsException e) { System.out.println("index"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E2 ==<br>
&gt; javac E2.java<br>
E2.java:5: error: exception IOException is never thrown in body of corresponding try statement<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;catch (IOException e) { System.out.println("io"); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E3 ==<br>
&gt; javac E3.java<br>
E3.java:6: error: unreported exception Exception; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;check(20);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E4 ==<br>
&gt; javac E4.java<br>
E4.java:5: error: read() in Reader2 cannot override read() in Reader1<br>
&nbsp;&nbsp;&nbsp;&nbsp;void read() throws IOException { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;overridden method does not throw IOException<br>
1 error<br>
(exit code 1)<br>
== E5 ==<br>
&gt; javac E5.java<br>
E5.java:3: error: 'try' without 'catch', 'finally' or resource declarations<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;try {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E6 ==<br>
&gt; javac E6.java<br>
E6.java:6: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n = 0;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable n<br>
&nbsp;&nbsp;location: class E6<br>
E6.java:8: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(n);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;variable n<br>
&nbsp;&nbsp;location: class E6<br>
2 errors<br>
(exit code 1)</div>
</details>
<details><summary>Đáp án</summary>
<ol>
<li><strong>E1</strong> — các catch được thử từ trên xuống; catch của lớp cha đặt trước catch của lớp con làm catch sau không bao giờ tới được. Đặt <code>ArrayIndexOutOfBoundsException</code> lên trước.</li>
<li><strong>E2</strong> — không được bắt một ngoại lệ <strong>checked</strong> mà khối try không thể ném (ngoại lệ unchecked và chính <code>Exception</code> thì được). Bỏ catch đi, hoặc đặt code đọc file vào try.</li>
<li><strong>E3</strong> — gọi một phương thức <code>throws Exception</code> buộc bên gọi phải bắt hoặc khai báo: bọc <code>check(20)</code> trong try-catch, hoặc thêm <code>throws Exception</code> cho main.</li>
<li><strong>E4</strong> — phương thức ghi đè không được khai báo ngoại lệ checked <strong>rộng hơn</strong> phương thức bị ghi đè (FileNotFoundException → IOException là rộng hơn). Khai báo cùng kiểu, kiểu con, hoặc không khai báo.</li>
<li><strong>E5</strong> — một <code>try</code> cần catch, finally, hoặc tài nguyên trong ngoặc tròn.</li>
<li><strong>E6</strong> — biến khai báo trong <code>try { }</code> chỉ tồn tại trong đó. Khai báo <code>int n;</code> trước try (khi đó javac kiểm nó được gán trên mọi đường đi).</li>
</ol>
</details>`),
    bi(`<h3>🧪 Exercise 5 — Read two real stack traces (~20 min)</h3>
<p><code>GradeReport</code> computes the average score of records <code>id,name,score</code>. It is run on two data sets and crashes twice. From the traces alone, answer: which record, which line, why — and how would you fix the code?</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "GradeReport.java",
        "public class GradeReport {",
        "    static double parseScore(String text) {",
        "        return Double.parseDouble(text.trim());",
        "    }",
        "    static double scoreOf(String line, int no) {",
        "        String[] f = line.split(\\",\\");",
        "        try {",
        "            return parseScore(f[2]);",
        "        } catch (NumberFormatException e) {",
        "            throw new IllegalArgumentException(\\"record \\" + no + \\": bad score in [\\" + line + \\"]\\", e);",
        "        }",
        "    }",
        "    static double average(String[] data) {",
        "        double sum = 0;",
        "        for (int i = 0; i &lt; data.length; i++) sum += scoreOf(data[i], i + 1);",
        "        return sum / data.length;",
        "    }",
        "    public static void main(String[] args) {",
        "        String[] a = { \\"HE190001,An,8.5\\", \\"HE190002,Binh\\", \\"HE190003,Chi,7\\" };",
        "        String[] b = { \\"HE190001,An,8.5\\", \\"HE190002,Binh,6\\", \\"HE190003,Chi,9;5\\" };",
        "        System.out.println(\\"average = \\" + average(args[0].equals(\\"A\\") ? a : b));",
        "    }",
        "}");
    lenh(d, "javac", "GradeReport.java");
    System.out.println("== data set A ==");
    lenh(d, "java", "GradeReport", "A");
    System.out.println("== data set B ==");
    lenh(d, "java", "GradeReport", "B");
}</code></pre>
<details><summary>The real output on JDK 8</summary>
<div class="out">&gt; javac GradeReport.java<br>
== data set A ==<br>
&gt; java GradeReport A<br>
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.scoreOf(GradeReport.java:8)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.average(GradeReport.java:15)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.main(GradeReport.java:21)<br>
(exit code 1)<br>
== data set B ==<br>
&gt; java GradeReport B<br>
Exception in thread "main" java.lang.IllegalArgumentException: record 3: bad score in [HE190003,Chi,9;5]<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.scoreOf(GradeReport.java:10)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.average(GradeReport.java:15)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.main(GradeReport.java:21)<br>
Caused by: java.lang.NumberFormatException: For input string: "9;5"<br>
&nbsp;&nbsp;&nbsp;&nbsp;at sun.misc.FloatingDecimal.readJavaFormatString(FloatingDecimal.java:2043)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at sun.misc.FloatingDecimal.parseDouble(FloatingDecimal.java:110)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.lang.Double.parseDouble(Double.java:538)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.parseScore(GradeReport.java:3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.scoreOf(GradeReport.java:8)<br>
&nbsp;&nbsp;&nbsp;&nbsp;... 2 more<br>
(exit code 1)</div>
</details>
<details><summary>Answer</summary>
<ul>
<li><strong>Set A</strong>: <code>ArrayIndexOutOfBoundsException: 2</code> at <code>scoreOf</code> line 8 — <code>f[2]</code> on a line with only two fields; called from <code>average</code> line 15, so it is a record in the loop: "HE190002,Binh" has no score. The <code>catch (NumberFormatException e)</code> did not help — a different exception type. Fix: check <code>f.length == 3</code> and report "record 2: expected 3 fields".</li>
<li><strong>Set B</strong>: the top part is our own <code>IllegalArgumentException</code>, thrown at line 10 with a message that already names the record. <strong>"Caused by"</strong> is the original <code>NumberFormatException</code> we passed as the cause — its first lines are inside the JDK (<code>FloatingDecimal</code>), and our first line is <code>parseScore</code> line 3. <strong>"... 2 more"</strong> means "the remaining 2 frames are the same as in the trace above" (average, main) — Java does not print them twice.</li>
<li>Lesson: wrapping with a cause (<code>new X(message, e)</code>) gives both the business context ("record 3") and the technical root ("9;5" is not a number). Throwing <code>new X(message)</code> without <code>e</code> would have lost the second half.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — Đọc hai stack trace thật (~20 phút)</h3>
<p><code>GradeReport</code> tính điểm trung bình của các bản ghi <code>id,name,score</code>. Nó chạy trên hai bộ dữ liệu và sập hai lần. Chỉ từ các trace, hãy trả lời: bản ghi nào, dòng nào, vì sao — và sửa code thế nào?</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "GradeReport.java",
        "public class GradeReport {",
        "    static double parseScore(String text) {",
        "        return Double.parseDouble(text.trim());",
        "    }",
        "    static double scoreOf(String line, int no) {",
        "        String[] f = line.split(\\",\\");",
        "        try {",
        "            return parseScore(f[2]);",
        "        } catch (NumberFormatException e) {",
        "            throw new IllegalArgumentException(\\"record \\" + no + \\": bad score in [\\" + line + \\"]\\", e);",
        "        }",
        "    }",
        "    static double average(String[] data) {",
        "        double sum = 0;",
        "        for (int i = 0; i &lt; data.length; i++) sum += scoreOf(data[i], i + 1);",
        "        return sum / data.length;",
        "    }",
        "    public static void main(String[] args) {",
        "        String[] a = { \\"HE190001,An,8.5\\", \\"HE190002,Binh\\", \\"HE190003,Chi,7\\" };",
        "        String[] b = { \\"HE190001,An,8.5\\", \\"HE190002,Binh,6\\", \\"HE190003,Chi,9;5\\" };",
        "        System.out.println(\\"average = \\" + average(args[0].equals(\\"A\\") ? a : b));",
        "    }",
        "}");
    lenh(d, "javac", "GradeReport.java");
    System.out.println("== data set A ==");
    lenh(d, "java", "GradeReport", "A");
    System.out.println("== data set B ==");
    lenh(d, "java", "GradeReport", "B");
}</code></pre>
<details><summary>Output thật trên JDK 8</summary>
<div class="out">&gt; javac GradeReport.java<br>
== data set A ==<br>
&gt; java GradeReport A<br>
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.scoreOf(GradeReport.java:8)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.average(GradeReport.java:15)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.main(GradeReport.java:21)<br>
(exit code 1)<br>
== data set B ==<br>
&gt; java GradeReport B<br>
Exception in thread "main" java.lang.IllegalArgumentException: record 3: bad score in [HE190003,Chi,9;5]<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.scoreOf(GradeReport.java:10)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.average(GradeReport.java:15)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.main(GradeReport.java:21)<br>
Caused by: java.lang.NumberFormatException: For input string: "9;5"<br>
&nbsp;&nbsp;&nbsp;&nbsp;at sun.misc.FloatingDecimal.readJavaFormatString(FloatingDecimal.java:2043)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at sun.misc.FloatingDecimal.parseDouble(FloatingDecimal.java:110)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at java.lang.Double.parseDouble(Double.java:538)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.parseScore(GradeReport.java:3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at GradeReport.scoreOf(GradeReport.java:8)<br>
&nbsp;&nbsp;&nbsp;&nbsp;... 2 more<br>
(exit code 1)</div>
</details>
<details><summary>Đáp án</summary>
<ul>
<li><strong>Bộ A</strong>: <code>ArrayIndexOutOfBoundsException: 2</code> ở <code>scoreOf</code> dòng 8 — <code>f[2]</code> trên một dòng chỉ có hai trường; được gọi từ <code>average</code> dòng 15, nên đó là một bản ghi trong vòng lặp: "HE190002,Binh" không có điểm. <code>catch (NumberFormatException e)</code> không giúp gì — khác kiểu ngoại lệ. Sửa: kiểm <code>f.length == 3</code> và báo "record 2: expected 3 fields".</li>
<li><strong>Bộ B</strong>: phần trên là <code>IllegalArgumentException</code> của chính ta, ném ở dòng 10 với thông điệp đã nêu tên bản ghi. <strong>"Caused by"</strong> là <code>NumberFormatException</code> gốc mà ta đã truyền vào làm nguyên nhân — các dòng đầu của nó nằm trong JDK (<code>FloatingDecimal</code>), dòng đầu tiên của ta là <code>parseScore</code> dòng 3. <strong>"... 2 more"</strong> nghĩa là "2 khung còn lại giống hệt trace phía trên" (average, main) — Java không in hai lần.</li>
<li>Bài học: bọc kèm nguyên nhân (<code>new X(message, e)</code>) cho cả ngữ cảnh nghiệp vụ ("record 3") lẫn gốc kỹ thuật ("9;5" không phải số). Ném <code>new X(message)</code> mà thiếu <code>e</code> là mất nửa sau.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — The school's Banking project: from a crash to checked business exceptions (~35 min)</h3>
<p>In the Banking project (<code>model/Account.java</code>, <code>model/Bank.java</code>) every business error is a <code>RuntimeException</code> — "Not enough money..", "Account doesnot exist!", "Invalid Login" — and <code>BankApp</code> catches none of them. Part 1: reproduce what a user experiences. Part 2: redesign with a small hierarchy of checked exceptions and a menu that handles each one and keeps running.</p>
<details><summary>Part 1 — the school's withdraw, as written, on JDK 8</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "MiniBank.java",
        "import java.util.Scanner;",
        "class Account {",
        "    private double balance;",
        "    Account(double balance) { this.balance = balance; }",
        "    double getBalance() { return balance; }",
        "    public double withdraw(double amount){",
        "        if(balance-amount&lt;0) throw new RuntimeException(\\"Not enough money..\\");",
        "        return balance-=amount;",
        "    }",
        "}",
        "public class MiniBank {",
        "    public static void main(String[] args) {",
        "        Scanner sc = new Scanner(System.in);",
        "        Account a = new Account(500);",
        "        while (sc.hasNextLine()) {",
        "            double amount = Double.parseDouble(sc.nextLine());",
        "            a.withdraw(amount);",
        "            System.out.println(\\"Successful. Your new balance \\" + a.getBalance());",
        "        }",
        "    }",
        "}");
    lenh(d, "javac", "MiniBank.java");
    lenhVao(d, "100\\n900\\n50\\n", "java", "MiniBank");
}</code></pre>
<div class="out">&gt; javac MiniBank.java<br>
&gt; java MiniBank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: 100 / 900 / 50)<br>
Successful. Your new balance 400.0<br>
Exception in thread "main" java.lang.RuntimeException: Not enough money..<br>
&nbsp;&nbsp;&nbsp;&nbsp;at Account.withdraw(MiniBank.java:7)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at MiniBank.main(MiniBank.java:17)<br>
(exit code 1)</div>
<p>One withdrawal too many and the whole bank application exits with a stack trace; the third request (50) is never processed. For a GUI or a server that is unacceptable.</p>
</details>
<details><summary>Part 2 — checked business exceptions, a menu that decides (run for real on JDK 8)</summary>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/bdda9ef301e601cb61beed490f3a1eb696336f87.svg" alt="Exercise 6: one parent BankException, two specific children" loading="lazy" /><p class="chu-thich">🧩 Exercise 6: one parent BankException, two specific children</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — business errors as a small checked hierarchy
' One parent BankException lets the menu catch "any bank error" after the specific ones
class "Exception" as Exc &lt;&lt;java.lang&gt;&gt;
class BankException
class AccountNotFoundException {
  + AccountNotFoundException(accNo : int)
}
class InsufficientFundsException {
  + InsufficientFundsException(balance : double, amount : double)
}
class Account {
  - accNo : int
  - balance : double
  + withdraw(amount : double) : void &lt;&lt;throws InsufficientFundsException&gt;&gt;
}
class Bank {
  - accounts : List&lt;Account&gt;
  + getAccount(accNo : int) : Account &lt;&lt;throws AccountNotFoundException&gt;&gt;
  + doWithdraw(accNo : int, amount : double) : void &lt;&lt;throws BankException&gt;&gt;
}
Exc &lt;|-- BankException
BankException &lt;|-- AccountNotFoundException
BankException &lt;|-- InsufficientFundsException
Bank o--&gt; "0..*" Account
hide Exc members
hide BankException members
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class BankException extends Exception {                            // parent of every business error
    BankException(String message) { super(message); }
}
class AccountNotFoundException extends BankException {
    AccountNotFoundException(int accNo) { super("account " + accNo + " does not exist"); }
}
class InsufficientFundsException extends BankException {
    InsufficientFundsException(double balance, double amount) {
        super("cannot withdraw " + amount + ", balance is only " + balance);
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Account {
    private final int accNo;
    private double balance;
    Account(int accNo, double balance) { this.accNo = accNo; this.balance = balance; }
    int getAccNo() { return accNo; }
    double getBalance() { return balance; }

    void withdraw(double amount) throws InsufficientFundsException {
        if (amount &lt;= 0) throw new IllegalArgumentException("amount must be &gt; 0");   // caller's bug: unchecked
        if (balance - amount &lt; 0) throw new InsufficientFundsException(balance, amount);
        balance -= amount;
    }
}

class Bank {
    private final List&lt;Account&gt; accounts = new ArrayList&lt;&gt;();
    void add(Account a) { accounts.add(a); }

    Account getAccount(int accNo) throws AccountNotFoundException {
        for (Account a : accounts) if (a.getAccNo() == accNo) return a;
        throw new AccountNotFoundException(accNo);
    }

    void doWithdraw(int accNo, double amount) throws BankException {   // passes both on: it cannot decide
        getAccount(accNo).withdraw(amount);
    }
}</code></pre>
<pre class="trich"><code class="language-java">Bank bank = new Bank();
bank.add(new Account(1, 500));
bank.add(new Account(2, 80));
Scanner sc = new Scanner(System.in);
while (sc.hasNextLine()) {
    String line = sc.nextLine().trim();
    System.out.print("withdraw " + line + " -&gt; ");
    try {
        String[] p = line.split("\\\\s+");
        int accNo = Integer.parseInt(p[0]);
        double amount = Double.parseDouble(p[1]);
        bank.doWithdraw(accNo, amount);
        System.out.println("OK, balance " + bank.getAccount(accNo).getBalance());
    } catch (InsufficientFundsException e) {              // specific first
        System.out.println("refused: " + e.getMessage());
    } catch (BankException e) {                           // then the parent
        System.out.println("error: " + e.getMessage());
    } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
        System.out.println("bad input, type: accountNo amount");
    } catch (IllegalArgumentException e) {
        System.out.println("bad amount: " + e.getMessage());
    }
}
System.out.println("program still running at the end");</code></pre>
<p>Input: <code>1 100 / 1 900 / 3 10 / 2 -5 / abc / 2 50</code>.</p>
<div class="out">withdraw 1 100 -&gt; OK, balance 400.0<br>
withdraw 1 900 -&gt; refused: cannot withdraw 900.0, balance is only 400.0<br>
withdraw 3 10 -&gt; error: account 3 does not exist<br>
withdraw 2 -5 -&gt; bad amount: amount must be &gt; 0<br>
withdraw abc -&gt; bad input, type: accountNo amount<br>
withdraw 2 50 -&gt; OK, balance 30.0<br>
program still running at the end</div>
<p>The choices to defend in an interview: <strong>checked</strong> for business outcomes a correct program must expect (an account can be short of money), so javac reminds every caller; <strong>unchecked</strong> <code>IllegalArgumentException</code> for a negative amount — a bug of the caller, who should have validated. <code>Bank.doWithdraw</code> declares <code>throws BankException</code> because it cannot decide anything; the menu catches the specific type first, then the parent, then input mistakes with a multi-catch.</p>
</details>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong>: modern frameworks (Spring) prefer <em>unchecked</em> business exceptions plus one global handler (<code>@RestControllerAdvice</code>), because checked ones spread <code>throws</code> through every layer. Both styles are defensible; PE-ADV1 and this exercise use checked ones so the compiler teaches you where errors flow.</div>`,
    `<h3>🧪 Bài 6 — Project Banking của trường: từ sập chương trình tới ngoại lệ nghiệp vụ checked (~35 phút)</h3>
<p>Trong project Banking (<code>model/Account.java</code>, <code>model/Bank.java</code>) mọi lỗi nghiệp vụ đều là <code>RuntimeException</code> — "Not enough money..", "Account doesnot exist!", "Invalid Login" — và <code>BankApp</code> không bắt cái nào. Phần 1: tái hiện điều người dùng gặp. Phần 2: thiết kế lại bằng một cây nhỏ các ngoại lệ checked và một menu xử lý từng loại rồi chạy tiếp.</p>
<details><summary>Phần 1 — phương thức rút tiền của trường, nguyên văn, trên JDK 8</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "MiniBank.java",
        "import java.util.Scanner;",
        "class Account {",
        "    private double balance;",
        "    Account(double balance) { this.balance = balance; }",
        "    double getBalance() { return balance; }",
        "    public double withdraw(double amount){",
        "        if(balance-amount&lt;0) throw new RuntimeException(\\"Not enough money..\\");",
        "        return balance-=amount;",
        "    }",
        "}",
        "public class MiniBank {",
        "    public static void main(String[] args) {",
        "        Scanner sc = new Scanner(System.in);",
        "        Account a = new Account(500);",
        "        while (sc.hasNextLine()) {",
        "            double amount = Double.parseDouble(sc.nextLine());",
        "            a.withdraw(amount);",
        "            System.out.println(\\"Successful. Your new balance \\" + a.getBalance());",
        "        }",
        "    }",
        "}");
    lenh(d, "javac", "MiniBank.java");
    lenhVao(d, "100\\n900\\n50\\n", "java", "MiniBank");
}</code></pre>
<div class="out">&gt; javac MiniBank.java<br>
&gt; java MiniBank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(piped input: 100 / 900 / 50)<br>
Successful. Your new balance 400.0<br>
Exception in thread "main" java.lang.RuntimeException: Not enough money..<br>
&nbsp;&nbsp;&nbsp;&nbsp;at Account.withdraw(MiniBank.java:7)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at MiniBank.main(MiniBank.java:17)<br>
(exit code 1)</div>
<p>Rút quá một lần là cả ứng dụng ngân hàng thoát kèm stack trace; yêu cầu thứ ba (50) không bao giờ được xử lý. Với giao diện đồ hoạ hay máy chủ, điều đó không chấp nhận được.</p>
</details>
<details><summary>Phần 2 — ngoại lệ nghiệp vụ checked, menu ra quyết định (chạy thật trên JDK 8)</summary>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/bdda9ef301e601cb61beed490f3a1eb696336f87.svg" alt="Bài 6: một lớp cha BankException, hai lớp con cụ thể" loading="lazy" /><p class="chu-thich">🧩 Bài 6: một lớp cha BankException, hai lớp con cụ thể</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — business errors as a small checked hierarchy
' Một lớp cha BankException cho phép menu bắt "mọi lỗi ngân hàng" sau các lỗi cụ thể
class "Exception" as Exc &lt;&lt;java.lang&gt;&gt;
class BankException
class AccountNotFoundException {
  + AccountNotFoundException(accNo : int)
}
class InsufficientFundsException {
  + InsufficientFundsException(balance : double, amount : double)
}
class Account {
  - accNo : int
  - balance : double
  + withdraw(amount : double) : void &lt;&lt;throws InsufficientFundsException&gt;&gt;
}
class Bank {
  - accounts : List&lt;Account&gt;
  + getAccount(accNo : int) : Account &lt;&lt;throws AccountNotFoundException&gt;&gt;
  + doWithdraw(accNo : int, amount : double) : void &lt;&lt;throws BankException&gt;&gt;
}
Exc &lt;|-- BankException
BankException &lt;|-- AccountNotFoundException
BankException &lt;|-- InsufficientFundsException
Bank o--&gt; "0..*" Account
hide Exc members
hide BankException members
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class BankException extends Exception {                            // lớp cha của mọi lỗi nghiệp vụ
    BankException(String message) { super(message); }
}
class AccountNotFoundException extends BankException {
    AccountNotFoundException(int accNo) { super("account " + accNo + " does not exist"); }
}
class InsufficientFundsException extends BankException {
    InsufficientFundsException(double balance, double amount) {
        super("cannot withdraw " + amount + ", balance is only " + balance);
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Account {
    private final int accNo;
    private double balance;
    Account(int accNo, double balance) { this.accNo = accNo; this.balance = balance; }
    int getAccNo() { return accNo; }
    double getBalance() { return balance; }

    void withdraw(double amount) throws InsufficientFundsException {
        if (amount &lt;= 0) throw new IllegalArgumentException("amount must be &gt; 0");   // lỗi của bên gọi: unchecked
        if (balance - amount &lt; 0) throw new InsufficientFundsException(balance, amount);
        balance -= amount;
    }
}

class Bank {
    private final List&lt;Account&gt; accounts = new ArrayList&lt;&gt;();
    void add(Account a) { accounts.add(a); }

    Account getAccount(int accNo) throws AccountNotFoundException {
        for (Account a : accounts) if (a.getAccNo() == accNo) return a;
        throw new AccountNotFoundException(accNo);
    }

    void doWithdraw(int accNo, double amount) throws BankException {   // chuyển tiếp cả hai: nó không quyết được
        getAccount(accNo).withdraw(amount);
    }
}</code></pre>
<pre class="trich"><code class="language-java">Bank bank = new Bank();
bank.add(new Account(1, 500));
bank.add(new Account(2, 80));
Scanner sc = new Scanner(System.in);
while (sc.hasNextLine()) {
    String line = sc.nextLine().trim();
    System.out.print("withdraw " + line + " -&gt; ");
    try {
        String[] p = line.split("\\\\s+");
        int accNo = Integer.parseInt(p[0]);
        double amount = Double.parseDouble(p[1]);
        bank.doWithdraw(accNo, amount);
        System.out.println("OK, balance " + bank.getAccount(accNo).getBalance());
    } catch (InsufficientFundsException e) {              // cụ thể trước
        System.out.println("refused: " + e.getMessage());
    } catch (BankException e) {                           // rồi tới lớp cha
        System.out.println("error: " + e.getMessage());
    } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
        System.out.println("bad input, type: accountNo amount");
    } catch (IllegalArgumentException e) {
        System.out.println("bad amount: " + e.getMessage());
    }
}
System.out.println("program still running at the end");</code></pre>
<p>Dữ liệu vào: <code>1 100 / 1 900 / 3 10 / 2 -5 / abc / 2 50</code>.</p>
<div class="out">withdraw 1 100 -&gt; OK, balance 400.0<br>
withdraw 1 900 -&gt; refused: cannot withdraw 900.0, balance is only 400.0<br>
withdraw 3 10 -&gt; error: account 3 does not exist<br>
withdraw 2 -5 -&gt; bad amount: amount must be &gt; 0<br>
withdraw abc -&gt; bad input, type: accountNo amount<br>
withdraw 2 50 -&gt; OK, balance 30.0<br>
program still running at the end</div>
<p>Những lựa chọn cần bảo vệ được khi phỏng vấn: <strong>checked</strong> cho các kết cục nghiệp vụ mà một chương trình đúng vẫn phải lường trước (tài khoản có thể thiếu tiền), nên javac nhắc mọi bên gọi; <strong>unchecked</strong> <code>IllegalArgumentException</code> cho số tiền âm — lỗi của bên gọi, lẽ ra phải kiểm trước. <code>Bank.doWithdraw</code> khai báo <code>throws BankException</code> vì nó không quyết được gì; menu bắt kiểu cụ thể trước, rồi lớp cha, rồi lỗi nhập liệu bằng một multi-catch.</p>
</details>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong>: framework hiện đại (Spring) chuộng ngoại lệ nghiệp vụ <em>unchecked</em> cộng một bộ xử lý toàn cục (<code>@RestControllerAdvice</code>), vì ngoại lệ checked rải <code>throws</code> qua mọi tầng. Cả hai cách đều có lý; PE-ADV1 và bài này dùng checked để trình biên dịch dạy bạn lỗi chảy đi đâu.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>exception</strong></td><td>ngoại lệ</td><td>An object describing an event that interrupts the normal flow of a program; it is thrown, and may be caught.</td></tr>
<tr><td><strong><code>throw</code></strong></td><td>ném</td><td>Statement that throws one exception object now: <code>throw new X("message")</code>.</td></tr>
<tr><td><strong><code>throws</code></strong></td><td>khai báo ném</td><td>Part of a method header listing checked exceptions the method may pass to its caller.</td></tr>
<tr><td><strong>checked exception</strong></td><td>ngoại lệ được kiểm tra</td><td>A subclass of Exception but not of RuntimeException; javac forces you to catch or declare it.</td></tr>
<tr><td><strong>unchecked exception</strong></td><td>ngoại lệ không kiểm tra</td><td>RuntimeException, Error and their subclasses; the compiler does not force handling.</td></tr>
<tr><td><strong><code>Error</code></strong></td><td>lỗi hệ thống</td><td>Throwable subclass for problems of the JVM itself (StackOverflowError, OutOfMemoryError); do not catch.</td></tr>
<tr><td><strong><code>try</code> / <code>catch</code> / <code>finally</code></strong></td><td>khối thử / bắt / luôn chạy</td><td>Code that may fail / handler for a matching exception type / cleanup that runs on every path.</td></tr>
<tr><td><strong>multi-catch</strong></td><td>bắt nhiều kiểu</td><td>Java 7 <code>catch (A | B e)</code>: one handler for several unrelated exception types.</td></tr>
<tr><td><strong>try-with-resources</strong></td><td>try kèm tài nguyên</td><td>Java 7 <code>try (R r = …) { }</code>: closes every AutoCloseable resource automatically, in reverse order.</td></tr>
<tr><td><strong>propagation</strong></td><td>lan truyền</td><td>An uncaught exception leaves the current method and continues in its caller, up the call stack.</td></tr>
<tr><td><strong>stack trace</strong></td><td>vết ngăn xếp</td><td>The list of method calls active when the exception was created, newest first, with file and line.</td></tr>
<tr><td><strong>cause / exception chaining</strong></td><td>nguyên nhân / nối chuỗi ngoại lệ</td><td>Passing the original exception into a new one (<code>new X(msg, e)</code>); printed as "Caused by:".</td></tr>
<tr><td><strong>custom exception</strong></td><td>ngoại lệ tự tạo</td><td>Your own class extending Exception (checked) or RuntimeException (unchecked) for a business error.</td></tr>
<tr><td><strong>validation</strong></td><td>kiểm tra dữ liệu</td><td>Checking input against rules (type, range, format) before storing it; a retry loop asks again.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>exception</strong></td><td>ngoại lệ</td><td>Đối tượng mô tả một sự kiện cắt ngang luồng bình thường của chương trình; nó được ném ra, và có thể được bắt.</td></tr>
<tr><td><strong><code>throw</code></strong></td><td>ném</td><td>Câu lệnh ném một đối tượng ngoại lệ ngay lúc đó: <code>throw new X("message")</code>.</td></tr>
<tr><td><strong><code>throws</code></strong></td><td>khai báo ném</td><td>Phần đầu phương thức liệt kê các ngoại lệ checked mà phương thức có thể chuyển cho bên gọi.</td></tr>
<tr><td><strong>checked exception</strong></td><td>ngoại lệ được kiểm tra</td><td>Lớp con của Exception nhưng không phải của RuntimeException; javac buộc bạn bắt hoặc khai báo nó.</td></tr>
<tr><td><strong>unchecked exception</strong></td><td>ngoại lệ không kiểm tra</td><td>RuntimeException, Error và các lớp con; trình biên dịch không ép phải xử lý.</td></tr>
<tr><td><strong><code>Error</code></strong></td><td>lỗi hệ thống</td><td>Lớp con của Throwable cho sự cố của chính JVM (StackOverflowError, OutOfMemoryError); đừng bắt.</td></tr>
<tr><td><strong><code>try</code> / <code>catch</code> / <code>finally</code></strong></td><td>khối thử / bắt / luôn chạy</td><td>Code có thể hỏng / bộ xử lý cho kiểu ngoại lệ khớp / việc dọn dẹp chạy trên mọi đường đi.</td></tr>
<tr><td><strong>multi-catch</strong></td><td>bắt nhiều kiểu</td><td>Cú pháp Java 7 <code>catch (A | B e)</code>: một bộ xử lý cho nhiều kiểu ngoại lệ không liên quan nhau.</td></tr>
<tr><td><strong>try-with-resources</strong></td><td>try kèm tài nguyên</td><td>Cú pháp Java 7 <code>try (R r = …) { }</code>: tự đóng mọi tài nguyên AutoCloseable, theo thứ tự ngược.</td></tr>
<tr><td><strong>propagation</strong></td><td>lan truyền</td><td>Ngoại lệ không bị bắt rời phương thức hiện tại và đi tiếp ở bên gọi, ngược lên stack lời gọi.</td></tr>
<tr><td><strong>stack trace</strong></td><td>vết ngăn xếp</td><td>Danh sách lời gọi phương thức đang hoạt động khi ngoại lệ được tạo, mới nhất đứng đầu, kèm file và dòng.</td></tr>
<tr><td><strong>cause / exception chaining</strong></td><td>nguyên nhân / nối chuỗi ngoại lệ</td><td>Truyền ngoại lệ gốc vào ngoại lệ mới (<code>new X(msg, e)</code>); được in thành "Caused by:".</td></tr>
<tr><td><strong>custom exception</strong></td><td>ngoại lệ tự tạo</td><td>Lớp của riêng bạn kế thừa Exception (checked) hoặc RuntimeException (unchecked) cho một lỗi nghiệp vụ.</td></tr>
<tr><td><strong>validation</strong></td><td>kiểm tra dữ liệu</td><td>Kiểm dữ liệu nhập theo luật (kiểu, khoảng, định dạng) trước khi lưu; một vòng hỏi lại sẽ hỏi lại.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 6</h2>
<ol>
<li><strong>An exception is an object</strong> with a type, a message and a stack trace; an uncaught one ends the program with exit code 1.</li>
<li><strong>Checked = Exception minus RuntimeException</strong>: catch it or declare it, or javac refuses. RuntimeException and Error are unchecked.</li>
<li><strong>Catches are tried top to bottom — son before father</strong>; a matching catch runs, the rest of the try is skipped.</li>
<li><strong>finally runs on every path</strong> (except System.exit); a return value is chosen before it runs; never return from finally.</li>
<li><strong>throws passes the duty up, throw creates the event</strong>; catch at the level that can decide what to do.</li>
<li><strong>Read a stack trace from the top</strong>: first line = what and why, first "at" in your code = where; "Caused by" = the original reason.</li>
<li><strong>One Scanner on System.in, never closed; read lines and parse</strong> — a new Scanner per call breaks under piped input.</li>
<li><strong>if for what you can check, try-catch for what you cannot</strong>; never leave a catch empty.</li>
</ol>
<p>Next: the Chapter 6 quiz, then Chapter 7 — arrays of objects, where all of this protects the add/update menus.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 6</h2>
<ol>
<li><strong>Ngoại lệ là một đối tượng</strong> có kiểu, thông điệp và stack trace; ngoại lệ không bị bắt kết thúc chương trình với mã thoát 1.</li>
<li><strong>Checked = Exception trừ đi RuntimeException</strong>: bắt hoặc khai báo, không thì javac từ chối. RuntimeException và Error là unchecked.</li>
<li><strong>Các catch được thử từ trên xuống — con trước cha</strong>; catch khớp thì chạy, phần còn lại của try bị bỏ qua.</li>
<li><strong>finally chạy trên mọi đường đi</strong> (trừ System.exit); giá trị trả về được chọn trước khi nó chạy; đừng bao giờ return trong finally.</li>
<li><strong>throws đẩy nghĩa vụ lên trên, throw tạo ra sự kiện</strong>; bắt ở tầng có thể quyết định phải làm gì.</li>
<li><strong>Đọc stack trace từ trên xuống</strong>: dòng đầu = cái gì và vì sao, dòng "at" đầu tiên trong code của bạn = ở đâu; "Caused by" = lý do gốc.</li>
<li><strong>Một Scanner trên System.in, không bao giờ đóng; đọc cả dòng rồi đổi kiểu</strong> — mỗi lần gọi một Scanner mới sẽ hỏng khi dữ liệu nạp qua pipe.</li>
<li><strong>if cho thứ kiểm được, try-catch cho thứ không kiểm được</strong>; đừng bao giờ để catch rỗng.</li>
</ol>
<p>Tiếp theo: quiz Chương 6, rồi Chương 7 — mảng đối tượng, nơi tất cả những điều này bảo vệ các menu thêm/sửa.</p>`),
  ].join('\n'),
};

/* ───────── Lab 6 — 🏗️ CT Library: business exceptions, borrowing and returning (checked exceptions, throw/catch by layer, try-with-resources) ───────── */
const L_lab6 = {
  title: 'Lab 6 — 🏗️ CT Library: business exceptions, borrowing and returning (checked exceptions, throw/catch by layer, try-with-resources)|||Lab 6 — 🏗️ CT Library: ngoại lệ nghiệp vụ, mượn và trả (ngoại lệ checked, ném/bắt đúng tầng, try-with-resources)',
  slug: 'pro192-lab-6-ngoai-le-muon-tra',
  type: 'VIDEO',
  description: 'Lab 6 của dự án CT Library (sau Chương 6), chuẩn review LAB211: mượn và trả sách thật (menu 10, 11) cùng mọi cách nó thất bại. Mỗi lỗi nghiệp vụ một lớp ngoại lệ checked có tên (gói exceptions: LibraryException trừu tượng và sáu lớp con — không tìm thấy, trùng khoá, hết bản, quá hạn mức 3, chưa mượn mà đòi trả), ném ở repository hoặc service, bắt ở controller, View in câu báo tiếng Việt nói rõ chỗ sai; lỗi nhập là InvalidInputException giữ nguyên nhân gốc, Main bắt và hỏi lại; Scanner mở bằng try-with-resources. Kèm năm lỗi javac thật (bắt lớp cha trước, quên khai throws, lớp con quên constructor), bẫy catch rỗng nuốt lỗi, return trong finally, đóng Scanner bọc System.in. Starter + đáp án tải về, bộ chấm kiểu PE 233 dòng, rubric 10 điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lab 6 · CT Library</span>
<h2>Lab 6 — business exceptions, borrowing and returning</h2>
<p class="lead">Chapter 6 taught you what an exception is, the difference between checked and unchecked, and the try–catch–finally machinery. Lab 6 puts it to work where it matters: CT Library starts lending for real, and lending fails in many honest ways — the item does not exist, nobody has a copy left, the member already holds three items, someone returns a book they never borrowed. Every one of those failures gets its own exception class, thrown in the layer that discovers it and caught in the layer that can do something about it.</p>
<p>The starter is a fresh project: Lab 5 finished, the exception classes and the borrow/return menu given, five TODOs marked <code>TODO Lab 6.x</code>. Plan about <strong>2.5 hours</strong>.</p>`,
    `<span class="eyebrow">Chương 6 · Lab 6 · CT Library</span>
<h2>Lab 6 — ngoại lệ nghiệp vụ, mượn và trả</h2>
<p class="lead">Chương 6 dạy bạn ngoại lệ là gì, checked khác unchecked ra sao, và bộ máy try–catch–finally. Lab 6 đem tất cả vào đúng chỗ cần: CT Library bắt đầu cho mượn thật, và việc mượn hỏng theo rất nhiều cách hoàn toàn bình thường — mã không có, hết bản trên kệ, thành viên đã giữ đủ ba tài liệu, có người trả cuốn mình chưa từng mượn. Mỗi kiểu hỏng có một lớp ngoại lệ riêng, được ném ở tầng phát hiện ra nó và được bắt ở tầng làm được gì đó với nó.</p>
<p>Starter là một dự án sạch: Lab 5 đã xong, các lớp ngoại lệ và menu mượn/trả cho sẵn, năm TODO đánh dấu <code>TODO Lab 6.x</code>. Dành khoảng <strong>2,5 giờ</strong>.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Lab 6 (17 slides)</h2>
<p>The deck of this lab, made for CT Library (it is not a school deck). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project, compiled with <code>javac --release 8</code> and run — the same runs you find in the steps below.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Lab 6 (17 slide)</h2>
<p>Bộ slide của lab này, dựng riêng cho CT Library (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ dự án thật, biên dịch bằng <code>javac --release 8</code> rồi chạy — đúng những lần chạy bạn gặp lại ở các bước bên dưới.</p>`),
    walk('lab6', [
      [1, 'Lab 6 — CT Library: business exceptions, borrowing and returning',
        `<p class="y-chinh">🎯 Lab 6 = Chapter 6 on a real codebase: borrowing and returning, and a named exception for each way they can fail.</p>
<p>The rule of the lab fits in one line: <em>throw where you find the problem, catch where you can answer it</em>. The menu never crashes, and no error is ever silent.</p>`,
        `<p class="y-chinh">🎯 Lab 6 = Chương 6 trên một bộ mã thật: mượn và trả, và một ngoại lệ có tên cho mỗi cách chúng có thể hỏng.</p>
<p>Luật của lab gói trong một câu: <em>ném ở nơi phát hiện ra vấn đề, bắt ở nơi trả lời được nó</em>. Menu không bao giờ sập, và không lỗi nào im lặng.</p>`],
      [2, 'Ticket CTL-6 — borrowing for real, and every way it fails',
        `<p class="y-chinh">🎯 Two new options (10 Borrow, 11 Return) and five business rules, each with a clear Vietnamese message that says what was wrong.</p>
<p>Done means: PASS 233/233 on the grader — the harness plays eleven wrong inputs and expects eleven exact messages while the menu keeps running — <code>lint.py</code> silent, no empty <code>catch</code>, no <code>catch (Exception e)</code>, and <code>throws Exception</code> gone from the whole project.</p>`,
        `<p class="y-chinh">🎯 Hai lựa chọn mới (10 Mượn, 11 Trả) và năm luật nghiệp vụ, mỗi luật một câu báo tiếng Việt nói rõ sai ở đâu.</p>
<p>Xong nghĩa là: bộ chấm PASS 233/233 — harness gõ mười một dữ liệu sai và chờ đúng mười một câu báo trong khi menu vẫn chạy tiếp — <code>lint.py</code> im lặng, không khối <code>catch</code> rỗng, không <code>catch (Exception e)</code>, và chữ <code>throws Exception</code> biến mất khỏi cả dự án.</p>`],
      [3, "What was wrong with Lab 5's exceptions",
        `<p class="y-chinh">🎯 Lab 5 used one exception for everything: <code>throw new Exception(…)</code> in the repository, <code>throws Exception</code> on every method, <code>catch (Exception e)</code> everywhere.</p>
<p>It worked, but it said nothing. A signature <code>findById(String id) throws Exception</code> does not tell you <em>what</em> can go wrong, and <code>catch (Exception e)</code> also swallows the bugs you want to see — a <code>NullPointerException</code> becomes a polite message. Lab 6 replaces "something failed" by names: <code>ItemNotFoundException</code>, <code>LoanLimitException</code>…</p>`,
        `<p class="y-chinh">🎯 Lab 5 dùng một ngoại lệ cho mọi thứ: <code>throw new Exception(…)</code> trong repository, <code>throws Exception</code> trên mọi phương thức, <code>catch (Exception e)</code> ở khắp nơi.</p>
<p>Nó chạy được, nhưng chẳng nói lên điều gì. Chữ ký <code>findById(String id) throws Exception</code> không cho biết <em>cái gì</em> có thể hỏng, và <code>catch (Exception e)</code> nuốt luôn cả những bug bạn muốn thấy — một <code>NullPointerException</code> biến thành một câu báo lịch sự. Lab 6 thay "có gì đó hỏng" bằng tên gọi: <code>ItemNotFoundException</code>, <code>LoanLimitException</code>…</p>`],
      [4, 'The exception family of CT Library',
        `<p class="y-chinh">🎯 <code>LibraryException</code> (abstract, extends <code>Exception</code>) is the parent of six business exceptions; <code>InvalidInputException</code> stands apart for input errors.</p>
<p>The names follow the reviewer's checklist item 1.3 — an exception class ends with <code>Exception</code> — and the package is <code>exceptions/</code>, exactly like <code>CarException</code> in the solved LAB211 sample. The parent is <code>abstract</code> (Lab 5): nobody throws a "generic library error". One parent buys one thing: the controller can catch the whole family in one <code>catch (LibraryException e)</code>.</p>`,
        `<p class="y-chinh">🎯 <code>LibraryException</code> (trừu tượng, extends <code>Exception</code>) là cha của sáu ngoại lệ nghiệp vụ; <code>InvalidInputException</code> đứng riêng cho lỗi nhập.</p>
<p>Tên đặt theo mục 1.3 tờ checklist của thầy — lớp ngoại lệ kết thúc bằng <code>Exception</code> — và gói là <code>exceptions/</code>, y như <code>CarException</code> trong bài mẫu LAB211. Lớp cha là <code>abstract</code> (Lab 5): không ai ném "lỗi thư viện chung chung". Có một lớp cha thì được một thứ: controller bắt được cả họ bằng một khối <code>catch (LibraryException e)</code>.</p>`],
      [5, 'Checked or unchecked? Ask who can fix it',
        `<p class="y-chinh">🎯 If the user can fix it, make it <strong>checked</strong> (javac forces someone to handle it); if only a programmer can fix it, let it be <strong>unchecked</strong> and do not catch it.</p>
<p>"B099 does not exist", "no copy left", "already three loans" are normal outcomes: checked, so the compiler will not let a caller forget them. "Item type 7" in <code>createItem</code> can only happen if the code is wrong, because <code>Validation</code> allows 1 to 3: it is an <code>IllegalArgumentException</code> (unchecked) that nobody catches — a bug should be loud. Input errors are checked too, because <code>Main</code> must ask again.</p>`,
        `<p class="y-chinh">🎯 Người dùng sửa được thì cho nó là <strong>checked</strong> (javac buộc có người xử lý); chỉ lập trình viên sửa được thì để <strong>unchecked</strong> và đừng bắt.</p>
<p>"B099 không có", "hết bản", "đã mượn đủ ba" là kết quả bình thường: checked, để trình biên dịch không cho nơi gọi quên chúng. "Loại tài liệu số 7" trong <code>createItem</code> chỉ xảy ra khi code sai, vì <code>Validation</code> chỉ cho 1 tới 3: đó là <code>IllegalArgumentException</code> (unchecked) không ai bắt — bug thì phải ồn ào. Lỗi nhập cũng checked, vì <code>Main</code> phải hỏi lại.</p>`],
      [6, 'Throw where you find it, catch where you can answer it',
        `<p class="y-chinh">🎯 Repository throws "not found / duplicate", service throws "against the rules", controller catches and hands the message to the view; utils throws input errors, <code>Main</code> catches them and asks again.</p>
<p>Each layer does only what it can: the repository knows whether a code exists but not what to say to the user; the service knows the rules but prints nothing (no <code>System.out</code> outside view and main — <code>lint.py</code> checks); the controller is where a failure becomes a result. That is why there is no <code>try</code> in the repository or the service of the solution.</p>`,
        `<p class="y-chinh">🎯 Repository ném "không có / trùng", service ném "trái luật", controller bắt rồi đưa câu báo cho view; utils ném lỗi nhập, <code>Main</code> bắt và hỏi lại.</p>
<p>Mỗi tầng chỉ làm việc nó làm được: repository biết một mã có tồn tại hay không nhưng không biết nói gì với người dùng; service biết luật nhưng không in gì (không <code>System.out</code> ngoài view và main — <code>lint.py</code> kiểm); controller là nơi một thất bại trở thành một kết quả. Vì thế repository và service của đáp án không có một khối <code>try</code> nào.</p>`],
      [7, 'One request through the layers: "10 — borrow"',
        `<p class="y-chinh">🎯 Main checks the two codes, asks the member controller first (pre-check), then the book controller runs four steps — and the first step that throws stops the rest.</p>
<p><code>findById</code> may throw <code>ItemNotFoundException</code>, <code>checkLoanLimit</code> a <code>LoanLimitException</code>, <code>checkAvailable</code> an <code>ItemNotAvailableException</code>; only if all pass does the repository take one copy off the shelf and record the loan. The real run of <code>LabNgoaiLeLanNguoc</code> prints the path an exception travels: <code>findById</code> → <code>borrowItem</code> → caught there, and the menu goes on.</p>`,
        `<p class="y-chinh">🎯 Main kiểm dạng hai mã, hỏi controller thành viên trước (kiểm trước), rồi controller sách chạy bốn bước — và bước đầu tiên ném lỗi sẽ chặn mọi bước sau.</p>
<p><code>findById</code> có thể ném <code>ItemNotFoundException</code>, <code>checkLoanLimit</code> ném <code>LoanLimitException</code>, <code>checkAvailable</code> ném <code>ItemNotAvailableException</code>; chỉ khi qua cả ba thì repository mới lấy một bản khỏi kệ và ghi lượt mượn. Lần chạy thật <code>LabNgoaiLeLanNguoc</code> in con đường một ngoại lệ đã đi: <code>findById</code> → <code>borrowItem</code> → bị bắt ở đó, và menu chạy tiếp.</p>`],
      [8, 'TODO 6.1 — two business rules in the service',
        `<p class="y-chinh">🎯 <code>checkLoanLimit</code> throws <code>LoanLimitException</code> when the member already has 3 loans; <code>checkAvailable</code> throws <code>ItemNotAvailableException</code> when the item has 0 copies.</p>
<p>The starter leaves both bodies empty, and the real starter run shows what that means: M002 borrows B003 with no copy left ("Con -1 ban tren ke") and M001 ends at "dang muon 4/3". Both methods only <code>throw</code>; the message is built from <code>Message</code>, the numbers from <code>Constants</code> (<code>MAX_LOANS_PER_MEMBER</code> = 3, <code>COPIES_MIN</code> = 0).</p>`,
        `<p class="y-chinh">🎯 <code>checkLoanLimit</code> ném <code>LoanLimitException</code> khi thành viên đã có 3 lượt mượn; <code>checkAvailable</code> ném <code>ItemNotAvailableException</code> khi tài liệu còn 0 bản.</p>
<p>Starter để trống cả hai thân, và lần chạy thật của starter cho thấy hậu quả: M002 mượn được B003 dù hết bản ("Con -1 ban tren ke") và M001 kết thúc ở "dang muon 4/3". Hai phương thức chỉ <code>throw</code>; câu báo dựng từ <code>Message</code>, con số lấy từ <code>Constants</code> (<code>MAX_LOANS_PER_MEMBER</code> = 3, <code>COPIES_MIN</code> = 0).</p>`],
      [9, 'TODO 6.2 and 6.3 — the repositories say "not found"',
        `<p class="y-chinh">🎯 <code>MemberRepository.findById</code> throws <code>MemberNotFoundException</code>; <code>LoanRepository.removeLoan</code> throws <code>LoanNotFoundException</code> when that member never borrowed that item.</p>
<p>In the starter, every member code "exists" (M009 borrows a book) and returning an item you never borrowed still adds a copy. Note the shape of <code>findById</code>: the loop returns as soon as it finds the code, so reaching the line after the loop <em>means</em> "not found" — that is where the <code>throw</code> goes.</p>`,
        `<p class="y-chinh">🎯 <code>MemberRepository.findById</code> ném <code>MemberNotFoundException</code>; <code>LoanRepository.removeLoan</code> ném <code>LoanNotFoundException</code> khi thành viên đó chưa từng mượn tài liệu đó.</p>
<p>Ở starter, mã thành viên nào cũng "có" (M009 mượn được sách) và trả một cuốn mình chưa mượn vẫn cộng thêm một bản. Để ý hình dạng của <code>findById</code>: vòng lặp <code>return</code> ngay khi thấy mã, nên chạy tới được dòng sau vòng lặp <em>nghĩa là</em> "không có" — <code>throw</code> nằm đúng ở đó.</p>`],
      [10, 'TODO 6.4 — an empty catch swallows the error',
        `<p class="y-chinh">🎯 <code>catch (LibraryException e) { }</code> compiles, never crashes — and leaves the user staring at nothing: the grader shows the missing line.</p>
<p>The project <code>bay/nuot-loi</code> is the solution with one empty catch in <code>borrowItem</code>: the real grader stops at line 30, where "B003 … dang het ban" should be and the menu header comes instead. The fix is one line, <code>resultMessage = e.getMessage();</code>. A <code>catch</code> must do something visible: show the message, try another way, or rethrow.</p>`,
        `<p class="y-chinh">🎯 <code>catch (LibraryException e) { }</code> biên dịch được, không bao giờ sập — và để người dùng nhìn vào khoảng trống: bộ chấm chỉ ra dòng bị mất.</p>
<p>Dự án <code>bay/nuot-loi</code> là đáp án với đúng một khối catch rỗng trong <code>borrowItem</code>: bộ chấm thật dừng ở dòng 30, nơi lẽ ra là "B003 … dang het ban" thì lại là tiêu đề menu. Sửa đúng một dòng, <code>resultMessage = e.getMessage();</code>. Một khối <code>catch</code> phải làm điều gì đó nhìn thấy được: báo câu lỗi, thử cách khác, hoặc ném tiếp.</p>`],
      [11, 'Trap: catch the parent first, or forget to declare',
        `<p class="y-chinh">🎯 Two real compile errors: a <code>catch</code> of the parent before the child ("has already been caught") and a call that may throw a checked exception outside any <code>try</code> ("unreported exception … must be caught or declared to be thrown").</p>
<p>The project <code>bay/bat-sai</code> plants both in the solution: <code>catch (LibraryException e)</code> before <code>catch (ItemNotAvailableException e)</code> — the second can never run, so javac refuses — and <code>updateCopies</code> with its <code>try</code> removed "because the code was validated". Order the catches from the most specific to the most general; a checked exception is caught or declared, never ignored.</p>`,
        `<p class="y-chinh">🎯 Hai lỗi biên dịch thật: <code>catch</code> lớp cha đứng trước lớp con ("has already been caught") và một lời gọi có thể ném ngoại lệ checked nằm ngoài mọi <code>try</code> ("unreported exception … must be caught or declared to be thrown").</p>
<p>Dự án <code>bay/bat-sai</code> cài cả hai vào đáp án: <code>catch (LibraryException e)</code> đứng trước <code>catch (ItemNotAvailableException e)</code> — khối sau không bao giờ chạy tới được nên javac từ chối — và <code>updateCopies</code> bị bỏ <code>try</code> "vì mã đã kiểm rồi". Xếp các catch từ cụ thể nhất tới chung nhất; ngoại lệ checked thì hoặc bắt, hoặc khai, không bao giờ lờ đi.</p>`],
      [12, 'Trap: a child exception without a constructor',
        `<p class="y-chinh">🎯 <code>LibraryException</code> has only a constructor that takes the message, so a subclass that declares none does not compile: Java writes a hidden <code>super()</code> that has nothing to call.</p>
<p>Real errors of <code>bay/thieu-ctor</code>: "constructor LibraryException in class LibraryException cannot be applied to given types … required: String, found: no arguments", and the service's <code>new LoanLimitException(…)</code> fails too. Constructors are not inherited (Chapter 4): each exception class writes its own one-liner <code>super(message)</code>.</p>`,
        `<p class="y-chinh">🎯 <code>LibraryException</code> chỉ có constructor nhận câu báo, nên lớp con không khai constructor nào sẽ không biên dịch: Java tự viết một lời gọi <code>super()</code> ngầm mà chẳng có gì để gọi.</p>
<p>Lỗi thật của <code>bay/thieu-ctor</code>: "constructor LibraryException in class LibraryException cannot be applied to given types … required: String, found: no arguments", và lời gọi <code>new LoanLimitException(…)</code> của service cũng hỏng theo. Constructor không được kế thừa (Chương 4): mỗi lớp ngoại lệ tự viết một dòng <code>super(message)</code> của mình.</p>`],
      [13, 'TODO 6.5a — InvalidInputException keeps the cause',
        `<p class="y-chinh">🎯 <code>Validation</code> throws <code>InvalidInputException</code> instead of <code>Exception</code>, and when it converts a <code>NumberFormatException</code> it passes it on as the <em>cause</em>.</p>
<p><code>super(message, cause)</code> is a constructor of <code>Exception</code> itself: the user reads <code>getMessage()</code>, the developer can still reach <code>getCause()</code> — the real run of <code>LabNguyenNhanGoc</code> prints both. <code>Main</code> now catches exactly <code>InvalidInputException</code>: a bug elsewhere is no longer disguised as "please type again".</p>`,
        `<p class="y-chinh">🎯 <code>Validation</code> ném <code>InvalidInputException</code> thay cho <code>Exception</code>, và khi đổi một <code>NumberFormatException</code> sang lỗi nhập thì chuyển nó theo làm <em>nguyên nhân gốc</em> (cause).</p>
<p><code>super(message, cause)</code> là constructor có sẵn của chính <code>Exception</code>: người dùng đọc <code>getMessage()</code>, lập trình viên vẫn lấy được <code>getCause()</code> — lần chạy thật <code>LabNguyenNhanGoc</code> in cả hai. <code>Main</code> giờ bắt đúng <code>InvalidInputException</code>: bug ở chỗ khác không còn bị ngụy trang thành "mời nhập lại".</p>`],
      [14, 'TODO 6.5b — try-with-resources, once, in main',
        `<p class="y-chinh">🎯 <code>try (Scanner scanner = new Scanner(System.in)) { runMenu(scanner); }</code>: the Scanner is closed automatically when the block ends, even if an exception escapes.</p>
<p>Open it once and pass it down. The trap <code>LabBayDongScanner</code> opens a Scanner with try-with-resources inside a helper: the first call works, but closing that Scanner closed <code>System.in</code> itself, and the second call dies with <code>java.util.NoSuchElementException: No line found</code> (real output, same on JDK 8). That is also why Lab 1's rule "Scanner only in main" exists.</p>`,
        `<p class="y-chinh">🎯 <code>try (Scanner scanner = new Scanner(System.in)) { runMenu(scanner); }</code>: Scanner tự đóng khi khối kết thúc, kể cả khi có ngoại lệ lọt ra.</p>
<p>Mở một lần rồi truyền xuống. Bẫy <code>LabBayDongScanner</code> mở Scanner bằng try-with-resources bên trong một hàm phụ: lần gọi đầu chạy được, nhưng đóng Scanner đó là đóng luôn <code>System.in</code>, và lần gọi thứ hai chết với <code>java.util.NoSuchElementException: No line found</code> (output thật, JDK 8 y hệt). Đó cũng là lý do luật "Scanner chỉ ở main" từ Lab 1.</p>`],
      [15, 'Trap: finally is for clean-up, never for return',
        `<p class="y-chinh">🎯 A <code>return</code> inside <code>finally</code> overrides the <code>try</code>'s return <em>and</em> swallows the exception: the real run of <code>LabBayFinally</code> prints 0 twice and the bug vanishes.</p>
<p><code>finally</code> runs on every path — normal return, exception, even after <code>return</code> in the try — which makes it the place to release things (close a file, a connection), not to decide the result. The fixed version keeps <code>finally</code> clean and the <code>IllegalStateException</code> reaches the caller.</p>`,
        `<p class="y-chinh">🎯 <code>return</code> trong <code>finally</code> đè giá trị return của <code>try</code> <em>và</em> nuốt luôn ngoại lệ: lần chạy thật <code>LabBayFinally</code> in 0 hai lần và bug biến mất.</p>
<p><code>finally</code> chạy trên mọi đường — return bình thường, có ngoại lệ, kể cả sau <code>return</code> trong try — nên nó là chỗ để giải phóng tài nguyên (đóng tệp, kết nối), không phải chỗ quyết định kết quả. Bản sửa giữ <code>finally</code> sạch và <code>IllegalStateException</code> tới được nơi gọi.</p>`],
      [16, 'Green: PASS 233/233, eleven messages, a silent reviewer',
        `<p class="y-chinh">🎯 Green = the grader at 233/233 (eleven wrong inputs, eleven exact messages, the menu still running) and <code>lint.py</code> silent.</p>
<p>A good order: 6.1 (two rules), 6.2 and 6.3 (two "not found"), 6.4 (fill the two empty catches) — the grader turns green after these — then 6.5a and 6.5b, which are design: the output does not move, the reviewer checks them by reading. Finish with a search for <code>throws Exception</code> and <code>catch (Exception</code>: zero hits.</p>`,
        `<p class="y-chinh">🎯 Xanh = bộ chấm 233/233 (mười một dữ liệu sai, mười một câu báo đúng, menu vẫn chạy) và <code>lint.py</code> im lặng.</p>
<p>Thứ tự nên làm: 6.1 (hai luật), 6.2 và 6.3 (hai chỗ "không có"), 6.4 (lấp hai khối catch rỗng) — xong mấy cái này bộ chấm xanh — rồi 6.5a và 6.5b, là việc thiết kế: output không đổi, thầy kiểm bằng cách đọc. Kết thúc bằng một lần tìm <code>throws Exception</code> và <code>catch (Exception</code>: không còn chỗ nào.</p>`],
      [17, 'Rubric — 10 points, PE style',
        `<p class="y-chinh">🎯 Behaviour and design share the points; the oral question is "checked or unchecked — and where do you catch it?".</p>
<p>Answer with your own classes: <code>LoanLimitException</code> is checked because the member can return a book and try again; it is thrown in <code>BookService</code> and caught in <code>BookController</code>, because the controller is the first layer that can turn it into a message.</p>`,
        `<p class="y-chinh">🎯 Hành vi và thiết kế chia nhau số điểm; câu vấn đáp là "checked hay unchecked — và bắt ở đâu?".</p>
<p>Trả lời bằng chính các lớp của bạn: <code>LoanLimitException</code> là checked vì thành viên trả bớt sách là mượn lại được; nó được ném trong <code>BookService</code> và bắt trong <code>BookController</code>, vì controller là tầng đầu tiên biến được nó thành một câu báo.</p>`],
    ]),
    bi(`<h2>1. The ticket</h2>
<div class="callout"><p><strong>CTL-6 · CT Library · priority: high.</strong> "From next week the club lends books for real. Add Borrow and Return. A member holds at most 3 items at a time; nobody borrows an item with 0 copies on the shelf; returning something you did not borrow is refused. When it fails, say exactly why — in Vietnamese, with the code that was wrong. And the menu must never crash or go quiet: I do not want to see <code>throw new Exception</code> or an empty <code>catch</code> in review again." — the team lead</p></div>
<table>
<thead><tr><th>You need</th><th>From</th></tr></thead>
<tbody>
<tr><td>what an exception is, Throwable / Error / Exception, checked vs unchecked</td><td>6.A (pro11 slides 1–9)</td></tr>
<tr><td>try–catch–finally, catch order, throw / throws, custom exceptions</td><td>6.A-2, 6.A-3 (pro11 slides 6–13)</td></tr>
<tr><td>try-with-resources, exceptions travelling up the stack</td><td>6.A-4 (pro11 slides 14–17)</td></tr>
<tr><td>abstract classes, interfaces, the CT Library layers</td><td>Lab 5</td></tr>
</tbody>
</table>`,
    `<h2>1. Ticket</h2>
<div class="callout"><p><strong>CTL-6 · CT Library · ưu tiên: cao.</strong> "Từ tuần sau câu lạc bộ cho mượn thật. Thêm Mượn và Trả. Mỗi thành viên giữ tối đa 3 tài liệu cùng lúc; không ai mượn được tài liệu còn 0 bản trên kệ; trả thứ mình không mượn thì từ chối. Hỏng thì nói đúng lý do — bằng tiếng Việt, kèm cái mã bị sai. Và menu không bao giờ được sập hay im lặng: tôi không muốn thấy lại <code>throw new Exception</code> hay khối <code>catch</code> rỗng trong buổi review." — trưởng nhóm</p></div>
<table>
<thead><tr><th>Bạn cần</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>ngoại lệ là gì, Throwable / Error / Exception, checked và unchecked</td><td>6.A (pro11 slide 1–9)</td></tr>
<tr><td>try–catch–finally, thứ tự catch, throw / throws, ngoại lệ tự định nghĩa</td><td>6.A-2, 6.A-3 (pro11 slide 6–13)</td></tr>
<tr><td>try-with-resources, ngoại lệ lan ngược trên ngăn xếp</td><td>6.A-4 (pro11 slide 14–17)</td></tr>
<tr><td>lớp trừu tượng, interface, các tầng của CT Library</td><td>Lab 5</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Requirements and acceptance criteria</h2>
<ol>
<li><strong>Borrow (10) and Return (11)</strong>: input a member code (M + 3 digits) and an item code; a borrow takes one copy off the shelf and records the loan, a return removes the loan and puts the copy back.</li>
<li><strong>Five business rules, five exceptions</strong>: unknown item ⇒ <code>ItemNotFoundException</code>; unknown member ⇒ <code>MemberNotFoundException</code>; 0 copies ⇒ <code>ItemNotAvailableException</code>; already 3 loans ⇒ <code>LoanLimitException</code>; returning an item not borrowed ⇒ <code>LoanNotFoundException</code>. Duplicate ISBN / email ⇒ <code>DuplicateKeyException</code>.</li>
<li><strong>Layers</strong>: repositories and service throw, controllers catch and give the message to the view; <code>Main</code> catches only <code>InvalidInputException</code>. No <code>try</code> in a repository or the service.</li>
<li><strong>No generic exceptions</strong>: no <code>throws Exception</code>, no <code>new Exception(…)</code>, no <code>catch (Exception e)</code>, no empty <code>catch</code>; a programming error (an unknown item type in <code>createItem</code>) is an unchecked <code>IllegalArgumentException</code>.</li>
<li>The Scanner is opened once, with try-with-resources, in <code>main</code>; no <code>System.exit</code>.</li>
</ol>
<div class="callout ok"><p><strong>Done means:</strong> <code>check.sh</code> prints <code>PASS: 233/233 dong khop expected.txt</code> · <code>lint.py</code> 0 violations · <code>javac --release 8</code> compiles · a project-wide search for <code>throws Exception</code> and <code>catch (Exception</code> finds nothing · you can say, for each exception, who throws it and who catches it.</p></div>`,
    `<h2>2. Yêu cầu và tiêu chí đạt</h2>
<ol>
<li><strong>Mượn (10) và Trả (11)</strong>: nhập mã thành viên (M + 3 chữ số) và mã tài liệu; mượn thì lấy một bản khỏi kệ và ghi lượt mượn, trả thì xoá lượt mượn và đặt bản đó lại kệ.</li>
<li><strong>Năm luật nghiệp vụ, năm ngoại lệ</strong>: tài liệu không có ⇒ <code>ItemNotFoundException</code>; thành viên không có ⇒ <code>MemberNotFoundException</code>; còn 0 bản ⇒ <code>ItemNotAvailableException</code>; đã mượn đủ 3 ⇒ <code>LoanLimitException</code>; trả thứ chưa mượn ⇒ <code>LoanNotFoundException</code>. Trùng ISBN / email ⇒ <code>DuplicateKeyException</code>.</li>
<li><strong>Tầng</strong>: repository và service ném, controller bắt rồi đưa câu báo cho view; <code>Main</code> chỉ bắt <code>InvalidInputException</code>. Repository và service không có <code>try</code>.</li>
<li><strong>Không ngoại lệ chung chung</strong>: không <code>throws Exception</code>, không <code>new Exception(…)</code>, không <code>catch (Exception e)</code>, không khối <code>catch</code> rỗng; lỗi lập trình (loại tài liệu lạ trong <code>createItem</code>) là <code>IllegalArgumentException</code> unchecked.</li>
<li>Scanner mở một lần, bằng try-with-resources, trong <code>main</code>; không <code>System.exit</code>.</li>
</ol>
<div class="callout ok"><p><strong>Xong nghĩa là:</strong> <code>check.sh</code> in <code>PASS: 233/233 dong khop expected.txt</code> · <code>lint.py</code> 0 vi phạm · <code>javac --release 8</code> biên dịch được · tìm cả dự án chữ <code>throws Exception</code> và <code>catch (Exception</code> không ra chỗ nào · với mỗi ngoại lệ, bạn nói được ai ném và ai bắt.</p></div>`),
    bi(`<h2>3. Files</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab6-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab6-starter.zip</span><span class="lc-sub">Lab 5 solution + exceptions package + borrow/return menu · TODO 6.1–6.5 · harness (233 lines) · CheckHarness</span></span>
<span class="lc-cta">Download</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab6-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab6-solution.zip</span><span class="lc-sub">the full solution — open it only after your own attempt</span></span>
<span class="lc-cta">Download</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab6/src/  (new or changed since Lab 5)
  exceptions/LibraryException.java            abstract parent of the business exceptions (given)
  exceptions/ItemNotFound… DuplicateKey… MemberNotFound… ItemNotAvailable… LoanLimit… LoanNotFound…   (given)
  exceptions/InvalidInputException.java       input errors, keeps the cause (given)
  model/Loan.java · dto/LoanRequestDTO.java · repository/LoanRepository.java   a loan (given)
  service/BookService.java                    TODO 6.1 checkLoanLimit, checkAvailable
  repository/MemberRepository.java            TODO 6.2 findById throws MemberNotFoundException
  repository/LoanRepository.java              TODO 6.3 removeLoan throws LoanNotFoundException
  controller/BookController.java              TODO 6.4 two empty catch blocks
  utils/Validation.java · main/Main.java      TODO 6.5 InvalidInputException + try-with-resources</code></pre>`,
    `<h2>3. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab6-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab6-starter.zip</span><span class="lc-sub">đáp án Lab 5 + gói exceptions + menu mượn/trả · TODO 6.1–6.5 · harness (233 dòng) · CheckHarness</span></span>
<span class="lc-cta">Tải về</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab6-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab6-solution.zip</span><span class="lc-sub">đáp án đầy đủ — chỉ mở sau khi đã tự làm</span></span>
<span class="lc-cta">Tải về</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab6/src/  (mới hoặc đổi so với Lab 5)
  exceptions/LibraryException.java            lớp cha trừu tượng của các ngoại lệ nghiệp vụ (cho sẵn)
  exceptions/ItemNotFound… DuplicateKey… MemberNotFound… ItemNotAvailable… LoanLimit… LoanNotFound…   (cho sẵn)
  exceptions/InvalidInputException.java       lỗi nhập, giữ nguyên nhân gốc (cho sẵn)
  model/Loan.java · dto/LoanRequestDTO.java · repository/LoanRepository.java   một lượt mượn (cho sẵn)
  service/BookService.java                    TODO 6.1 checkLoanLimit, checkAvailable
  repository/MemberRepository.java            TODO 6.2 findById ném MemberNotFoundException
  repository/LoanRepository.java              TODO 6.3 removeLoan ném LoanNotFoundException
  controller/BookController.java              TODO 6.4 hai khối catch rỗng
  utils/Validation.java · main/Main.java      TODO 6.5 InvalidInputException + try-with-resources</code></pre>`),
    bi(`<h2>4. Step by step</h2>
<h4>Step 0 — lint the starter, run it, read what goes wrong (10 min)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab6</code></pre>
<div class="out">✓ CTLibrary-Lab6 — sạch</div>
<p>The starter is lint-clean — the reviewer's tool does not see logic. Run it and compare with the ticket: a borrow with no copy left, an unknown member who borrows, a fourth loan, and one wrong code that prints nothing at all.</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M002 da muon B003 "Java Concurrency In Practice", han tra 14 ngay. Con -1 ban tren ke. M002 dang muon 1/3.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M009 da muon B001 "The Pragmatic Programmer", han tra 14 ngay. Con 2 ban tren ke. M009 dang muon 1/3.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon D006 "The Social Network", han tra 3 ngay. Con 0 ban tren ke. M001 dang muon 4/3.<br>
…</div>

<h4>Step 1 — TODO 6.1 the two rules (20 min)</h4>
<details><summary>Hint</summary><p>Each method is one <code>if</code> and one <code>throw</code>. The limit is reached when <code>loanCount &gt;= Constants.MAX_LOANS_PER_MEMBER</code>; an item is unavailable when <code>item.getCopies() &lt;= Constants.COPIES_MIN</code>.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Luat 1 khi muon: thanh vien chua cham han muc MAX_LOANS_PER_MEMBER; cham roi thi nem loi
public void checkLoanLimit(String memberId, int loanCount) throws LoanLimitException {
    // Da muon du so toi da: noi ro dang muon bao nhieu tren toi da bao nhieu
    if (loanCount &gt;= Constants.MAX_LOANS_PER_MEMBER) {
        throw new LoanLimitException(String.format(Message.ERROR_LOAN_LIMIT, memberId,
                loanCount, Constants.MAX_LOANS_PER_MEMBER));
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Luat 2 khi muon: tai lieu con it nhat 1 ban tren ke; het ban thi nem loi
public void checkAvailable(BookResponseDTO item) throws ItemNotAvailableException {
    // Con 0 ban: noi ro tai lieu nao het
    if (item.getCopies() &lt;= Constants.COPIES_MIN) {
        throw new ItemNotAvailableException(String.format(Message.ERROR_ITEM_NOT_AVAILABLE,
                item.getId(), item.getTitle()));
    }
}</code></pre>
</details>

<h4>Step 2 — TODO 6.2 and 6.3 the two "not found" (20 min)</h4>
<details><summary>Hint</summary><p><code>findById</code>: loop, <code>return</code> on the match; after the loop, <code>throw</code>. <code>removeLoan</code>: <code>findLoan</code> already returns <code>null</code> when there is no such loan — throw <em>before</em> <code>remove</code>.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Lay BAN SAO 1 thanh vien theo ma; khong co ma thi nem loi
public MemberResponseDTO findById(String id) throws MemberNotFoundException {
    // Duyet tung thanh vien de so ma (equals, khong bao gio ==)
    for (Member member : memberList) {
        // Dung ma thi tra ban sao dang dong bang
        if (member.getId().equals(id)) {
            return new MemberResponseDTO(member.getId(), member.getName(), member.getEmail());
        }
    }

    // Het danh sach ma khong thay: bao ro ma nao khong co
    throw new MemberNotFoundException(String.format(Message.ERROR_MEMBER_NOT_FOUND, id));
}</code></pre>
<pre class="trich"><code class="language-java">// Xoa luot muon cua dung thanh vien + tai lieu trong phieu; khong co thi nem loi
public void removeLoan(LoanRequestDTO loanRequestDTO) throws LoanNotFoundException {
    // Luot muon can xoa (null neu thanh vien khong muon tai lieu nay)
    Loan loan = findLoan(loanRequestDTO);

    // Khong muon ma doi tra: bao ro ai va tai lieu nao
    if (loan == null) {
        throw new LoanNotFoundException(String.format(Message.ERROR_LOAN_NOT_FOUND,
                loanRequestDTO.getMemberId(), loanRequestDTO.getItemId()));
    }

    // Bo luot muon khoi danh sach
    loanList.remove(loan);
}</code></pre>
</details>

<h4>Step 3 — TODO 6.4 never swallow (10 min)</h4>
<details><summary>Solution — borrowItem (returnItem has the same catch)</summary>
<pre class="trich"><code class="language-java">// Muon 1 tai lieu (phieu dien ma thanh vien + ma tai lieu; thanh vien da kiem truoc):
// kho tim tai lieu, Service kiem 2 luat, roi giam 1 ban va ghi luot muon
public void borrowItem(LoanRequestDTO loanRequestDTO) {
    // Cau ket qua se in
    String resultMessage = "";

    // Buoc nao nem loi nghiep vu thi cac buoc SAU no khong chay (khong giam ban oan)
    try {
        BookResponseDTO item = bookRepository.findById(loanRequestDTO.getItemId());
        int loanCount = loanRepository.countLoansOfMember(loanRequestDTO.getMemberId());

        // Hai luat cua Service: con han muc, con ban tren ke
        bookService.checkLoanLimit(loanRequestDTO.getMemberId(), loanCount);
        bookService.checkAvailable(item);

        // Du luat: giam 1 ban tren ke roi ghi luot muon
        bookRepository.updateCopies(toCopiesRequestDTO(item.getId(), item.getCopies() - 1));
        loanRepository.addLoan(loanRequestDTO);
        resultMessage = String.format(Message.SUCCESS_BORROW, loanRequestDTO.getMemberId(),
                item.getId(), item.getTitle(), item.getLoanDays(), item.getCopies() - 1,
                loanRequestDTO.getMemberId(), loanCount + 1, Constants.MAX_LOANS_PER_MEMBER);
    } catch (LibraryException e) {
        // Khong co ma, qua han muc hay het ban: loi nao cung mang san cau bao ro rang
        resultMessage = e.getMessage();
    }

    // In ket qua 1 lan
    showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma thanh vien phai la M + 3 chu so (vi du M001), ban nhap "X1". Moi nhap lai.<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): Khong co tai lieu nao mang ma B099. Hay chon 2 de xem ma roi thu lai.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 dang muon 3 tai lieu, da cham muc toi da 3. Hay tra bot roi muon tiep.<br>
…</div>

<h4>Step 4 — TODO 6.5 one exception for input, one Scanner (20 min)</h4>
<details><summary>Hint</summary><p>In <code>Validation</code>, a Find/Replace of <code>Exception</code> by <code>InvalidInputException</code> does most of it; then add <code>, e</code> to the two <code>throw</code> lines inside <code>catch (NumberFormatException e)</code>. In <code>Main</code>, replace the 16 <code>catch (Exception e)</code> and wrap <code>runMenu(scanner)</code> in try-with-resources.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Mo ban phim bang try-with-resources roi chay menu; ra khoi khoi try la Scanner tu dong
public static void main(String[] args) {
    // Scanner tu dong close() khi khoi try ket thuc, ke ca khi co ngoai le lot ra
    try (Scanner scanner = new Scanner(System.in)) {
        runMenu(scanner);
    }
}</code></pre>
<pre><code class="language-java">package exceptions;

/**
 * Loi NHAP LIEU: chu nguoi dung go sai dang hoac ngoai khoang. utils.Validation nem,
 * Main bat roi in cau bao va hoi lai. Tach rieng khoi ho LibraryException vi cach xu ly
 * khac han: loi nhap thi hoi lai ngay, loi nghiep vu thi bao ket qua roi ve menu.
 * Checked (extends Exception): javac nhac Main phai bat, khong de lot ra lam sap menu.
 *
 * @author CuongThai Academy
 */
public class InvalidInputException extends Exception {

    // Tao ngoai le kem cau bao loi tieng Viet
    public InvalidInputException(String message) {
        super(message);
    }

    // Tao ngoai le kem cau bao loi + NGUYEN NHAN goc (vd NumberFormatException):
    // khong lam mat dau vet, e.getCause() van lay lai duoc
    public InvalidInputException(String message, Throwable cause) {
        super(message, cause);
    }
}</code></pre>
</details>

<h4>Step 5 — grade, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 233/233 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab6-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab6-Solution — sạch</div>`,
    `<h2>4. Làm từng bước</h2>
<h4>Bước 0 — lint starter, chạy thử, đọc xem hỏng ở đâu (10 phút)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab6</code></pre>
<div class="out">✓ CTLibrary-Lab6 — sạch</div>
<p>Starter sạch lint — công cụ của thầy không nhìn thấy logic. Chạy thử rồi so với ticket: mượn được tài liệu hết bản, thành viên không tồn tại vẫn mượn được, lượt mượn thứ tư, và một mã sai mà màn hình không in gì cả.</p>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M002 da muon B003 "Java Concurrency In Practice", han tra 14 ngay. Con -1 ban tren ke. M002 dang muon 1/3.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M009 da muon B001 "The Pragmatic Programmer", han tra 14 ngay. Con 2 ban tren ke. M009 dang muon 1/3.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon D006 "The Social Network", han tra 3 ngay. Con 0 ban tren ke. M001 dang muon 4/3.<br>
…</div>

<h4>Bước 1 — TODO 6.1 hai luật (20 phút)</h4>
<details><summary>Gợi ý</summary><p>Mỗi phương thức là một <code>if</code> và một <code>throw</code>. Chạm hạn mức khi <code>loanCount &gt;= Constants.MAX_LOANS_PER_MEMBER</code>; hết bản khi <code>item.getCopies() &lt;= Constants.COPIES_MIN</code>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Luat 1 khi muon: thanh vien chua cham han muc MAX_LOANS_PER_MEMBER; cham roi thi nem loi
public void checkLoanLimit(String memberId, int loanCount) throws LoanLimitException {
    // Da muon du so toi da: noi ro dang muon bao nhieu tren toi da bao nhieu
    if (loanCount &gt;= Constants.MAX_LOANS_PER_MEMBER) {
        throw new LoanLimitException(String.format(Message.ERROR_LOAN_LIMIT, memberId,
                loanCount, Constants.MAX_LOANS_PER_MEMBER));
    }
}</code></pre>
<pre class="trich"><code class="language-java">// Luat 2 khi muon: tai lieu con it nhat 1 ban tren ke; het ban thi nem loi
public void checkAvailable(BookResponseDTO item) throws ItemNotAvailableException {
    // Con 0 ban: noi ro tai lieu nao het
    if (item.getCopies() &lt;= Constants.COPIES_MIN) {
        throw new ItemNotAvailableException(String.format(Message.ERROR_ITEM_NOT_AVAILABLE,
                item.getId(), item.getTitle()));
    }
}</code></pre>
</details>

<h4>Bước 2 — TODO 6.2 và 6.3 hai chỗ "không có" (20 phút)</h4>
<details><summary>Gợi ý</summary><p><code>findById</code>: duyệt, khớp thì <code>return</code>; sau vòng lặp thì <code>throw</code>. <code>removeLoan</code>: <code>findLoan</code> đã trả <code>null</code> khi không có lượt mượn đó — ném <em>trước</em> khi <code>remove</code>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Lay BAN SAO 1 thanh vien theo ma; khong co ma thi nem loi
public MemberResponseDTO findById(String id) throws MemberNotFoundException {
    // Duyet tung thanh vien de so ma (equals, khong bao gio ==)
    for (Member member : memberList) {
        // Dung ma thi tra ban sao dang dong bang
        if (member.getId().equals(id)) {
            return new MemberResponseDTO(member.getId(), member.getName(), member.getEmail());
        }
    }

    // Het danh sach ma khong thay: bao ro ma nao khong co
    throw new MemberNotFoundException(String.format(Message.ERROR_MEMBER_NOT_FOUND, id));
}</code></pre>
<pre class="trich"><code class="language-java">// Xoa luot muon cua dung thanh vien + tai lieu trong phieu; khong co thi nem loi
public void removeLoan(LoanRequestDTO loanRequestDTO) throws LoanNotFoundException {
    // Luot muon can xoa (null neu thanh vien khong muon tai lieu nay)
    Loan loan = findLoan(loanRequestDTO);

    // Khong muon ma doi tra: bao ro ai va tai lieu nao
    if (loan == null) {
        throw new LoanNotFoundException(String.format(Message.ERROR_LOAN_NOT_FOUND,
                loanRequestDTO.getMemberId(), loanRequestDTO.getItemId()));
    }

    // Bo luot muon khoi danh sach
    loanList.remove(loan);
}</code></pre>
</details>

<h4>Bước 3 — TODO 6.4 không bao giờ nuốt lỗi (10 phút)</h4>
<details><summary>Lời giải — borrowItem (returnItem có khối catch y vậy)</summary>
<pre class="trich"><code class="language-java">// Muon 1 tai lieu (phieu dien ma thanh vien + ma tai lieu; thanh vien da kiem truoc):
// kho tim tai lieu, Service kiem 2 luat, roi giam 1 ban va ghi luot muon
public void borrowItem(LoanRequestDTO loanRequestDTO) {
    // Cau ket qua se in
    String resultMessage = "";

    // Buoc nao nem loi nghiep vu thi cac buoc SAU no khong chay (khong giam ban oan)
    try {
        BookResponseDTO item = bookRepository.findById(loanRequestDTO.getItemId());
        int loanCount = loanRepository.countLoansOfMember(loanRequestDTO.getMemberId());

        // Hai luat cua Service: con han muc, con ban tren ke
        bookService.checkLoanLimit(loanRequestDTO.getMemberId(), loanCount);
        bookService.checkAvailable(item);

        // Du luat: giam 1 ban tren ke roi ghi luot muon
        bookRepository.updateCopies(toCopiesRequestDTO(item.getId(), item.getCopies() - 1));
        loanRepository.addLoan(loanRequestDTO);
        resultMessage = String.format(Message.SUCCESS_BORROW, loanRequestDTO.getMemberId(),
                item.getId(), item.getTitle(), item.getLoanDays(), item.getCopies() - 1,
                loanRequestDTO.getMemberId(), loanCount + 1, Constants.MAX_LOANS_PER_MEMBER);
    } catch (LibraryException e) {
        // Khong co ma, qua han muc hay het ban: loi nao cung mang san cau bao ro rang
        resultMessage = e.getMessage();
    }

    // In ket qua 1 lan
    showResult(resultMessage, new ArrayList&lt;BookResponseDTO&gt;());
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma thanh vien phai la M + 3 chu so (vi du M001), ban nhap "X1". Moi nhap lai.<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): Khong co tai lieu nao mang ma B099. Hay chon 2 de xem ma roi thu lai.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 dang muon 3 tai lieu, da cham muc toi da 3. Hay tra bot roi muon tiep.<br>
…</div>

<h4>Bước 4 — TODO 6.5 một ngoại lệ cho lỗi nhập, một Scanner (20 phút)</h4>
<details><summary>Gợi ý</summary><p>Trong <code>Validation</code>, một lần Find/Replace <code>Exception</code> thành <code>InvalidInputException</code> làm gần hết việc; rồi thêm <code>, e</code> vào hai dòng <code>throw</code> nằm trong <code>catch (NumberFormatException e)</code>. Trong <code>Main</code>, đổi 16 chỗ <code>catch (Exception e)</code> và bọc <code>runMenu(scanner)</code> bằng try-with-resources.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Mo ban phim bang try-with-resources roi chay menu; ra khoi khoi try la Scanner tu dong
public static void main(String[] args) {
    // Scanner tu dong close() khi khoi try ket thuc, ke ca khi co ngoai le lot ra
    try (Scanner scanner = new Scanner(System.in)) {
        runMenu(scanner);
    }
}</code></pre>
<pre><code class="language-java">package exceptions;

/**
 * Loi NHAP LIEU: chu nguoi dung go sai dang hoac ngoai khoang. utils.Validation nem,
 * Main bat roi in cau bao va hoi lai. Tach rieng khoi ho LibraryException vi cach xu ly
 * khac han: loi nhap thi hoi lai ngay, loi nghiep vu thi bao ket qua roi ve menu.
 * Checked (extends Exception): javac nhac Main phai bat, khong de lot ra lam sap menu.
 *
 * @author CuongThai Academy
 */
public class InvalidInputException extends Exception {

    // Tao ngoai le kem cau bao loi tieng Viet
    public InvalidInputException(String message) {
        super(message);
    }

    // Tao ngoai le kem cau bao loi + NGUYEN NHAN goc (vd NumberFormatException):
    // khong lam mat dau vet, e.getCause() van lay lai duoc
    public InvalidInputException(String message, Throwable cause) {
        super(message, cause);
    }
}</code></pre>
</details>

<h4>Bước 5 — chấm, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 233/233 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab6-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab6-Solution — sạch</div>`),
    bi(`<h2>5. The full solution — and the proof it is right</h2>
<p>The solution zip is the complete project: <code>lint.py</code> 0 violations, <code>javac --release 8</code>, the same output on a real JDK 8, and 233/233 on the grader.</p>
<details><summary>Full run — java -cp build main.Main &lt; harness/input.txt (233 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon B003 "Java Concurrency In Practice", han tra 14 ngay. Con 0 ban tren ke. M001 dang muon 1/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): B003 "Java Concurrency In Practice" dang het ban tren ke (0 ban). Hay muon tai lieu khac hoac quay lai sau.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): Khong co thanh vien nao mang ma M009. Hay chon 7 de xem ma roi thu lai.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma thanh vien phai la M + 3 chu so (vi du M001), ban nhap "X1". Moi nhap lai.<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): Khong co tai lieu nao mang ma B099. Hay chon 2 de xem ma roi thu lai.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon B001 "The Pragmatic Programmer", han tra 14 ngay. Con 2 ban tren ke. M001 dang muon 2/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon T005 "Tech Weekly", han tra 7 ngay. Con 1 ban tren ke. M001 dang muon 3/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 dang muon 3 tai lieu, da cham muc toi da 3. Hay tra bot roi muon tiep.<br>
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
0. Thoat<br>
Lua chon: --- Tra tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M002 khong muon B001 nen khong tra duoc. Kiem lai ma thanh vien va ma tai lieu.<br>
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
0. Thoat<br>
Lua chon: --- Tra tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da tra B003 "Java Concurrency In Practice". Con 1 ban tren ke. M001 dang muon 2/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M002 da muon B003 "Java Concurrency In Practice", han tra 14 ngay. Con 0 ban tren ke. M002 dang muon 1/3.<br>
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
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
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
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: ISBN-13: Tac gia: Trung ISBN 9780134685991 voi Sach B002 "Effective Java". Moi tai lieu chi them 1 lan.<br>
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
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma tai lieu (vi du B001, T005, D006): So ban: Khong co tai lieu nao mang ma B077. Hay chon 2 de xem ma roi thu lai.<br>
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
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Email: Email binh.tran@ctlib.vn da thuoc ve M001 "Tran Thi Binh". Moi thanh vien dung 1 email rieng.<br>
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
0. Thoat<br>
Lua chon: Lua chon phai la 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Lua chon: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 11. Moi nhap lai.<br>
Lua chon: Tam biet! Du lieu Lab 6 chi nam trong bo nho.</div>
</details>
<details><summary>LibraryException.java — the abstract parent of the family</summary>
<pre><code class="language-java">package exceptions;

/**
 * Lop CHA cua moi loi NGHIEP VU cua CT Library (khong tim thay, het ban, qua han muc...).
 * La ngoai le CHECKED (extends Exception): javac BUOC noi goi phai bat hoac khai throws,
 * vi day la ket qua co the xay ra va nguoi dung sua duoc — khong phai bug.
 * Abstract: khong ai nem "loi thu vien chung chung"; luon nem 1 lop con co ten ro rang.
 * Controller bat ca ho bang 1 khoi catch (LibraryException e) roi dua cau bao cho View.
 *
 * @author CuongThai Academy
 */
public abstract class LibraryException extends Exception {

    // Tao ngoai le kem cau bao loi tieng Viet (lop con goi qua super)
    protected LibraryException(String message) {
        super(message);
    }
}</code></pre>
</details>
<details><summary>LoanLimitException.java — every child is this short</summary>
<pre><code class="language-java">package exceptions;

/**
 * Thanh vien da muon du so tai lieu toi da (MAX_LOANS_PER_MEMBER). Service nem
 * khi kiem luat muon.
 *
 * @author CuongThai Academy
 */
public class LoanLimitException extends LibraryException {

    // Tao ngoai le kem cau bao loi (da dinh dang tu Message o noi nem)
    public LoanLimitException(String message) {
        super(message);
    }
}</code></pre>
</details>
<details><summary>MemberController.checkMember — the pre-check Main calls before borrowing</summary>
<pre class="trich"><code class="language-java">// Kiem TRUOC khi muon/tra: ma thanh vien trong phieu co that khong. Khong co thi View bao
// loi va tra false de Main khong goi buoc muon/tra (cuoc goi kiem truoc duoc phep)
public boolean checkMember(LoanRequestDTO loanRequestDTO) {
    // Kho tim theo ma; khong co thi kho nem MemberNotFoundException
    try {
        memberRepository.findById(loanRequestDTO.getMemberId());
        return true;
    } catch (MemberNotFoundException e) {
        // Khong co thanh vien: in cau bao cua kho, bao Main dung lai
        showResult(e.getMessage(), new ArrayList&lt;MemberResponseDTO&gt;());
        return false;
    }
}</code></pre>
</details>
<p>An exception travelling up the stack, run for real:</p>
<pre><code class="language-java">// release: 8
// Lab 6 — an exception travels UP the call stack until a catch takes it
class ItemNotFoundException extends Exception {                        // checked: javac forces a catch or throws
    ItemNotFoundException(String message) {
        super(message);
    }
}

class InMemoryBookRepository {
    String findById(String id) throws ItemNotFoundException {           // THROWS: does not know what to tell the user
        if (!id.equals("B001")) {
            throw new ItemNotFoundException("Khong co tai lieu nao mang ma " + id);
        }
        return "The Pragmatic Programmer";
    }
}

class BookController {
    private InMemoryBookRepository bookRepository = new InMemoryBookRepository();

    void borrowItem(String id) {
        try {
            String title = bookRepository.findById(id);                 // may throw: the next line is skipped
            System.out.println("Da muon \\"" + title + "\\"");
        } catch (ItemNotFoundException e) {                             // CATCHES: turns it into a message
            System.out.println("Controller bat duoc: " + e.getMessage());
            for (StackTraceElement frame : e.getStackTrace()) {          // the path it travelled, newest first
                System.out.println("    at " + frame);
            }
        }
    }
}

public class LabNgoaiLeLanNguoc {
    public static void main(String[] args) {
        BookController bookController = new BookController();
        bookController.borrowItem("B001");
        bookController.borrowItem("B099");
        System.out.println("Menu van chay tiep.");
    }
}</code></pre>
<div class="out">Da muon "The Pragmatic Programmer"<br>
Controller bat duoc: Khong co tai lieu nao mang ma B099<br>
&nbsp;&nbsp;&nbsp;&nbsp;at InMemoryBookRepository.findById(LabNgoaiLeLanNguoc.java:12)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at BookController.borrowItem(LabNgoaiLeLanNguoc.java:23)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at LabNgoaiLeLanNguoc.main(LabNgoaiLeLanNguoc.java:38)<br>
Menu van chay tiep.</div>`,
    `<h2>5. Đáp án đầy đủ — và bằng chứng là đúng</h2>
<p>Tệp zip đáp án là trọn dự án: <code>lint.py</code> 0 vi phạm, <code>javac --release 8</code>, chạy trên JDK 8 thật ra y hệt, và bộ chấm 233/233.</p>
<details><summary>Trọn lần chạy — java -cp build main.Main &lt; harness/input.txt (233 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon B003 "Java Concurrency In Practice", han tra 14 ngay. Con 0 ban tren ke. M001 dang muon 1/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): B003 "Java Concurrency In Practice" dang het ban tren ke (0 ban). Hay muon tai lieu khac hoac quay lai sau.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): Khong co thanh vien nao mang ma M009. Hay chon 7 de xem ma roi thu lai.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma thanh vien phai la M + 3 chu so (vi du M001), ban nhap "X1". Moi nhap lai.<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): Khong co tai lieu nao mang ma B099. Hay chon 2 de xem ma roi thu lai.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon B001 "The Pragmatic Programmer", han tra 14 ngay. Con 2 ban tren ke. M001 dang muon 2/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da muon T005 "Tech Weekly", han tra 7 ngay. Con 1 ban tren ke. M001 dang muon 3/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 dang muon 3 tai lieu, da cham muc toi da 3. Hay tra bot roi muon tiep.<br>
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
0. Thoat<br>
Lua chon: --- Tra tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M002 khong muon B001 nen khong tra duoc. Kiem lai ma thanh vien va ma tai lieu.<br>
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
0. Thoat<br>
Lua chon: --- Tra tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M001 da tra B003 "Java Concurrency In Practice". Con 1 ban tren ke. M001 dang muon 2/3.<br>
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
0. Thoat<br>
Lua chon: --- Muon tai lieu ---<br>
Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): M002 da muon B003 "Java Concurrency In Practice", han tra 14 ngay. Con 0 ban tren ke. M002 dang muon 1/3.<br>
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
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
6 &nbsp;&nbsp;D006 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2010 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Social Network &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;120 phut<br>
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
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: ISBN-13: Tac gia: Trung ISBN 9780134685991 voi Sach B002 "Effective Java". Moi tai lieu chi them 1 lan.<br>
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
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma tai lieu (vi du B001, T005, D006): So ban: Khong co tai lieu nao mang ma B077. Hay chon 2 de xem ma roi thu lai.<br>
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
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Email: Email binh.tran@ctlib.vn da thuoc ve M001 "Tran Thi Binh". Moi thanh vien dung 1 email rieng.<br>
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
0. Thoat<br>
Lua chon: Lua chon phai la 1 so nguyen (vi du: 1, 2, 3), khong nhap chu hay de trong. Moi nhap lai.<br>
Lua chon: Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 0 den 11. Moi nhap lai.<br>
Lua chon: Tam biet! Du lieu Lab 6 chi nam trong bo nho.</div>
</details>
<details><summary>LibraryException.java — lớp cha trừu tượng của cả họ</summary>
<pre><code class="language-java">package exceptions;

/**
 * Lop CHA cua moi loi NGHIEP VU cua CT Library (khong tim thay, het ban, qua han muc...).
 * La ngoai le CHECKED (extends Exception): javac BUOC noi goi phai bat hoac khai throws,
 * vi day la ket qua co the xay ra va nguoi dung sua duoc — khong phai bug.
 * Abstract: khong ai nem "loi thu vien chung chung"; luon nem 1 lop con co ten ro rang.
 * Controller bat ca ho bang 1 khoi catch (LibraryException e) roi dua cau bao cho View.
 *
 * @author CuongThai Academy
 */
public abstract class LibraryException extends Exception {

    // Tao ngoai le kem cau bao loi tieng Viet (lop con goi qua super)
    protected LibraryException(String message) {
        super(message);
    }
}</code></pre>
</details>
<details><summary>LoanLimitException.java — lớp con nào cũng ngắn chừng này</summary>
<pre><code class="language-java">package exceptions;

/**
 * Thanh vien da muon du so tai lieu toi da (MAX_LOANS_PER_MEMBER). Service nem
 * khi kiem luat muon.
 *
 * @author CuongThai Academy
 */
public class LoanLimitException extends LibraryException {

    // Tao ngoai le kem cau bao loi (da dinh dang tu Message o noi nem)
    public LoanLimitException(String message) {
        super(message);
    }
}</code></pre>
</details>
<details><summary>MemberController.checkMember — cuộc gọi kiểm trước mà Main gọi trước khi mượn</summary>
<pre class="trich"><code class="language-java">// Kiem TRUOC khi muon/tra: ma thanh vien trong phieu co that khong. Khong co thi View bao
// loi va tra false de Main khong goi buoc muon/tra (cuoc goi kiem truoc duoc phep)
public boolean checkMember(LoanRequestDTO loanRequestDTO) {
    // Kho tim theo ma; khong co thi kho nem MemberNotFoundException
    try {
        memberRepository.findById(loanRequestDTO.getMemberId());
        return true;
    } catch (MemberNotFoundException e) {
        // Khong co thanh vien: in cau bao cua kho, bao Main dung lai
        showResult(e.getMessage(), new ArrayList&lt;MemberResponseDTO&gt;());
        return false;
    }
}</code></pre>
</details>
<p>Một ngoại lệ lan ngược lên ngăn xếp, chạy thật:</p>
<pre><code class="language-java">// release: 8
// Lab 6 — ngoại lệ đi NGƯỢC lên ngăn xếp tới khi gặp catch
class ItemNotFoundException extends Exception {                        // checked: javac buộc bắt hoặc khai throws
    ItemNotFoundException(String message) {
        super(message);
    }
}

class InMemoryBookRepository {
    String findById(String id) throws ItemNotFoundException {           // NÉM: kho không biết nói gì với người dùng
        if (!id.equals("B001")) {
            throw new ItemNotFoundException("Khong co tai lieu nao mang ma " + id);
        }
        return "The Pragmatic Programmer";
    }
}

class BookController {
    private InMemoryBookRepository bookRepository = new InMemoryBookRepository();

    void borrowItem(String id) {
        try {
            String title = bookRepository.findById(id);                 // có thể ném: dòng sau bị bỏ qua
            System.out.println("Da muon \\"" + title + "\\"");
        } catch (ItemNotFoundException e) {                             // BẮT: biến nó thành câu báo
            System.out.println("Controller bat duoc: " + e.getMessage());
            for (StackTraceElement frame : e.getStackTrace()) {          // đường nó đã đi, khung mới nhất trước
                System.out.println("    at " + frame);
            }
        }
    }
}

public class LabNgoaiLeLanNguoc {
    public static void main(String[] args) {
        BookController bookController = new BookController();
        bookController.borrowItem("B001");
        bookController.borrowItem("B099");
        System.out.println("Menu van chay tiep.");
    }
}</code></pre>
<div class="out">Da muon "The Pragmatic Programmer"<br>
Controller bat duoc: Khong co tai lieu nao mang ma B099<br>
&nbsp;&nbsp;&nbsp;&nbsp;at InMemoryBookRepository.findById(LabNgoaiLeLanNguoc.java:12)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at BookController.borrowItem(LabNgoaiLeLanNguoc.java:23)<br>
&nbsp;&nbsp;&nbsp;&nbsp;at LabNgoaiLeLanNguoc.main(LabNgoaiLeLanNguoc.java:38)<br>
Menu van chay tiep.</div>`),
    bi(`<h2>6. Traps (with real output)</h2>
<div class="pitfall"><p><strong>Trap 1 — the empty catch.</strong> It compiles and never crashes; the grader shows the line that went missing (project <code>bay/nuot-loi</code>).</p></div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 30:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): B003 "Java Concurrency In Practice" dang het ban tren ke (0 ban). Hay muon tai lieu khac hoac quay lai sau.<br>
&nbsp;&nbsp;ban in : Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): ========== CT LIBRARY ==========<br>
…</div>
<div class="pitfall"><p><strong>Trap 2 — catching the parent before the child, and a checked call outside try.</strong> Three real compile errors (project <code>bay/bat-sai</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/controller/BookController.java:97: error: unreported exception ItemNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BookResponseDTO before = bookRepository.findById(bookRequestDTO.getId());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/controller/BookController.java:100: error: unreported exception ItemNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bookRepository.updateCopies(bookRequestDTO);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/controller/BookController.java:167: error: exception ItemNotAvailableException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} catch (ItemNotAvailableException e) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
3 errors</div>
<div class="pitfall"><p><strong>Trap 3 — a child exception without a constructor.</strong> Constructors are not inherited; the hidden <code>super()</code> finds nothing to call (project <code>bay/thieu-ctor</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/service/BookService.java:122: error: constructor LoanLimitException in class LoanLimitException cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;throw new LoanLimitException(String.format(Message.ERROR_LOAN_LIMIT, memberId,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: no arguments<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;String<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
src/exceptions/LoanLimitException.java:9: error: constructor LibraryException in class LibraryException cannot be applied to given types;<br>
public class LoanLimitException extends LibraryException {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
2 errors</div>
<div class="pitfall"><p><strong>Trap 4 — return in finally.</strong> It overrides the result and swallows the exception. No compile error.</p></div>
<pre><code class="language-java">// release: 8
// Lab 6 trap — return inside finally SWALLOWS the exception and overrides the try's return
public class LabBayFinally {
    static int countLoans(String memberId) {
        try {
            if (memberId.isEmpty()) {
                throw new IllegalStateException("ma thanh vien rong");  // a bug we WANT to see
            }
            System.out.println("  try: tra ve 3");
            return 3;
        } finally {
            System.out.println("  finally: luon chay");
            return 0;                                                   // overrides 3 AND swallows the exception
        }
    }

    static int countLoansFixed(String memberId) {
        try {
            if (memberId.isEmpty()) {
                throw new IllegalStateException("ma thanh vien rong");
            }
            return 3;
        } finally {
            System.out.println("  finally: chi don dep, khong return");  // finally = clean-up only
        }
    }

    public static void main(String[] args) {
        System.out.println("countLoans(\\"M001\\") = " + countLoans("M001"));
        System.out.println("countLoans(\\"\\")     = " + countLoans("") + "   &lt;- loi bien mat!");
        try {
            System.out.println(countLoansFixed(""));
        } catch (IllegalStateException e) {
            System.out.println("ban sua: loi hien ra -&gt; " + e);
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;try: tra ve 3<br>
&nbsp;&nbsp;finally: luon chay<br>
countLoans("M001") = 0<br>
&nbsp;&nbsp;finally: luon chay<br>
countLoans("") &nbsp;&nbsp;&nbsp;&nbsp;= 0 &nbsp;&nbsp;&lt;- loi bien mat!<br>
&nbsp;&nbsp;finally: chi don dep, khong return<br>
ban sua: loi hien ra -&gt; java.lang.IllegalStateException: ma thanh vien rong</div>
<div class="pitfall"><p><strong>Trap 5 — closing a Scanner on System.in.</strong> try-with-resources in a helper closes <code>System.in</code> for the whole program.</p></div>
<pre><code class="language-java">// release: 8
// Lab 6 trap — closing a Scanner on System.in closes System.in FOR EVERYONE
import java.util.NoSuchElementException;
import java.util.Scanner;

public class LabBayDongScanner {
    static String askName() {
        try (Scanner scanner = new Scanner(System.in)) {                 // closes System.in at the end of the block
            System.out.print("Ho ten: ");
            return scanner.nextLine();
        }
    }

    public static void main(String[] args) {
        System.out.println("lan 1 -&gt; " + askName());
        try {
            System.out.println("lan 2 -&gt; " + askName());                 // a NEW Scanner on a CLOSED stream
        } catch (NoSuchElementException e) {
            System.out.println();
            System.out.println("lan 2 sap: " + e);
        }
        System.out.println("=&gt; mo Scanner 1 lan o main (try-with-resources o main), truyen xuong.");
    }
}</code></pre>
<div class="out">Ho ten: lan 1 -&gt; An<br>
Ho ten:<br>
lan 2 sap: java.util.NoSuchElementException: No line found<br>
=&gt; mo Scanner 1 lan o main (try-with-resources o main), truyen xuong.</div>
<p>Keeping the cause when you translate an exception, run for real:</p>
<pre><code class="language-java">// release: 8
// Lab 6 — wrap a low-level exception in a business one, KEEP the cause
class InvalidInputException extends Exception {
    InvalidInputException(String message, Throwable cause) {
        super(message, cause);                                         // Exception(String, Throwable) stores the cause
    }
}

public class LabNguyenNhanGoc {
    static int getCopies(String input) throws InvalidInputException {
        try {
            return Integer.parseInt(input.trim());
        } catch (NumberFormatException e) {
            throw new InvalidInputException("So ban phai la 1 so nguyen, ban nhap \\"" + input + "\\"", e);
        }
    }

    public static void main(String[] args) {
        try {
            getCopies("ba");
        } catch (InvalidInputException e) {
            System.out.println("cau bao  : " + e.getMessage());          // for the user
            System.out.println("nguyen nhan: " + e.getCause());          // for the developer
        }
    }
}</code></pre>
<div class="out">cau bao &nbsp;: So ban phai la 1 so nguyen, ban nhap "ba"<br>
nguyen nhan: java.lang.NumberFormatException: For input string: "ba"</div>`,
    `<h2>6. Bẫy (kèm output thật)</h2>
<div class="pitfall"><p><strong>Bẫy 1 — khối catch rỗng.</strong> Biên dịch được, không bao giờ sập; bộ chấm chỉ ra dòng bị mất (dự án <code>bay/nuot-loi</code>).</p></div>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">Dong 30:<br>
&nbsp;&nbsp;can &nbsp;&nbsp;&nbsp;: Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): B003 "Java Concurrency In Practice" dang het ban tren ke (0 ban). Hay muon tai lieu khac hoac quay lai sau.<br>
&nbsp;&nbsp;ban in : Ma thanh vien (vi du M001): Ma tai lieu (vi du B001, T005, D006): ========== CT LIBRARY ==========<br>
…</div>
<div class="pitfall"><p><strong>Bẫy 2 — bắt lớp cha trước lớp con, và lời gọi checked nằm ngoài try.</strong> Ba lỗi biên dịch thật (dự án <code>bay/bat-sai</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/controller/BookController.java:97: error: unreported exception ItemNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BookResponseDTO before = bookRepository.findById(bookRequestDTO.getId());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/controller/BookController.java:100: error: unreported exception ItemNotFoundException; must be caught or declared to be thrown<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bookRepository.updateCopies(bookRequestDTO);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/controller/BookController.java:167: error: exception ItemNotAvailableException has already been caught<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} catch (ItemNotAvailableException e) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
3 errors</div>
<div class="pitfall"><p><strong>Bẫy 3 — lớp ngoại lệ con không có constructor.</strong> Constructor không được kế thừa; lời gọi <code>super()</code> ngầm không tìm được gì để gọi (dự án <code>bay/thieu-ctor</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/service/BookService.java:122: error: constructor LoanLimitException in class LoanLimitException cannot be applied to given types;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;throw new LoanLimitException(String.format(Message.ERROR_LOAN_LIMIT, memberId,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: no arguments<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;String<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
src/exceptions/LoanLimitException.java:9: error: constructor LibraryException in class LibraryException cannot be applied to given types;<br>
public class LoanLimitException extends LibraryException {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: String<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;no arguments<br>
&nbsp;&nbsp;reason: actual and formal argument lists differ in length<br>
2 errors</div>
<div class="pitfall"><p><strong>Bẫy 4 — return trong finally.</strong> Đè kết quả và nuốt ngoại lệ. Không có lỗi biên dịch nào.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 6 — return trong finally NUỐT ngoại lệ và đè giá trị return của try
public class LabBayFinally {
    static int countLoans(String memberId) {
        try {
            if (memberId.isEmpty()) {
                throw new IllegalStateException("ma thanh vien rong");  // một bug ta MUỐN thấy
            }
            System.out.println("  try: tra ve 3");
            return 3;
        } finally {
            System.out.println("  finally: luon chay");
            return 0;                                                   // đè số 3 VÀ nuốt ngoại lệ
        }
    }

    static int countLoansFixed(String memberId) {
        try {
            if (memberId.isEmpty()) {
                throw new IllegalStateException("ma thanh vien rong");
            }
            return 3;
        } finally {
            System.out.println("  finally: chi don dep, khong return");  // finally chỉ để dọn dẹp
        }
    }

    public static void main(String[] args) {
        System.out.println("countLoans(\\"M001\\") = " + countLoans("M001"));
        System.out.println("countLoans(\\"\\")     = " + countLoans("") + "   &lt;- loi bien mat!");
        try {
            System.out.println(countLoansFixed(""));
        } catch (IllegalStateException e) {
            System.out.println("ban sua: loi hien ra -&gt; " + e);
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;try: tra ve 3<br>
&nbsp;&nbsp;finally: luon chay<br>
countLoans("M001") = 0<br>
&nbsp;&nbsp;finally: luon chay<br>
countLoans("") &nbsp;&nbsp;&nbsp;&nbsp;= 0 &nbsp;&nbsp;&lt;- loi bien mat!<br>
&nbsp;&nbsp;finally: chi don dep, khong return<br>
ban sua: loi hien ra -&gt; java.lang.IllegalStateException: ma thanh vien rong</div>
<div class="pitfall"><p><strong>Bẫy 5 — đóng Scanner bọc System.in.</strong> try-with-resources trong một hàm phụ là đóng <code>System.in</code> của cả chương trình.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 6 — đóng Scanner bọc System.in là đóng System.in của CẢ chương trình
import java.util.NoSuchElementException;
import java.util.Scanner;

public class LabBayDongScanner {
    static String askName() {
        try (Scanner scanner = new Scanner(System.in)) {                 // cuối khối là System.in bị đóng
            System.out.print("Ho ten: ");
            return scanner.nextLine();
        }
    }

    public static void main(String[] args) {
        System.out.println("lan 1 -&gt; " + askName());
        try {
            System.out.println("lan 2 -&gt; " + askName());                 // Scanner MỚI trên luồng ĐÃ ĐÓNG
        } catch (NoSuchElementException e) {
            System.out.println();
            System.out.println("lan 2 sap: " + e);
        }
        System.out.println("=&gt; mo Scanner 1 lan o main (try-with-resources o main), truyen xuong.");
    }
}</code></pre>
<div class="out">Ho ten: lan 1 -&gt; An<br>
Ho ten:<br>
lan 2 sap: java.util.NoSuchElementException: No line found<br>
=&gt; mo Scanner 1 lan o main (try-with-resources o main), truyen xuong.</div>
<p>Giữ nguyên nhân gốc khi đổi ngoại lệ, chạy thật:</p>
<pre><code class="language-java">// release: 8
// Lab 6 — bọc ngoại lệ tầng thấp thành ngoại lệ của mình, GIỮ nguyên nhân gốc
class InvalidInputException extends Exception {
    InvalidInputException(String message, Throwable cause) {
        super(message, cause);                                         // Exception(String, Throwable) cất nguyên nhân
    }
}

public class LabNguyenNhanGoc {
    static int getCopies(String input) throws InvalidInputException {
        try {
            return Integer.parseInt(input.trim());
        } catch (NumberFormatException e) {
            throw new InvalidInputException("So ban phai la 1 so nguyen, ban nhap \\"" + input + "\\"", e);
        }
    }

    public static void main(String[] args) {
        try {
            getCopies("ba");
        } catch (InvalidInputException e) {
            System.out.println("cau bao  : " + e.getMessage());          // cho người dùng
            System.out.println("nguyen nhan: " + e.getCause());          // cho lập trình viên
        }
    }
}</code></pre>
<div class="out">cau bao &nbsp;: So ban phai la 1 so nguyen, ban nhap "ba"<br>
nguyen nhan: java.lang.NumberFormatException: For input string: "ba"</div>`),
    bi(`<h2>7. Rubric (10 points) and self-check</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Two rules in the service (6.1)</td><td>2</td><td>grader lines 30, 106</td></tr>
<tr><td>Two "not found" in the repositories (6.2, 6.3)</td><td>2</td><td>grader lines 45, 121</td></tr>
<tr><td>No empty catch, no generic Exception anywhere (6.4)</td><td>2</td><td>grader line 61 + a search for <code>catch (Exception</code> / <code>throws Exception</code></td></tr>
<tr><td>InvalidInputException with cause, try-with-resources (6.5)</td><td>2</td><td>read</td></tr>
<tr><td><code>lint.py</code> ✓ sạch</td><td>1</td><td><code>lint.py</code></td></tr>
<tr><td>Oral: "checked or unchecked, and where do you catch it?"</td><td>1</td><td>one question</td></tr>
</tbody>
</table>
<details><summary>1. Why is LoanLimitException checked but the unknown item type in createItem an unchecked IllegalArgumentException?</summary><p class="dap-an">✅ A loan limit is a normal outcome the user can fix (return a book) — checked, so javac makes every caller handle it. An item type outside 1–3 can only come from a programming mistake, because <code>Validation</code> already allows only 1 to 3 — unchecked, not caught, so the bug shows up loudly.</p></details>
<details><summary>2. Why do the repository and the service have no try at all?</summary><p class="dap-an">✅ They discover failures but cannot answer them: they may not print (<code>lint.py</code> forbids <code>System.out</code> outside view and main) and they do not know what the user is doing. They <code>throw</code> and declare <code>throws</code>; the controller, the first layer that can turn a failure into a result, catches.</p></details>
<details><summary>3. What does javac say if you put catch (LibraryException e) before catch (ItemNotAvailableException e)?</summary><p class="dap-an">✅ "exception ItemNotAvailableException has already been caught": the parent catch takes every child, so the second block is unreachable. Order catches from specific to general.</p></details>`,
    `<h2>7. Rubric (10 điểm) và tự kiểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Kiểm bằng</th></tr></thead>
<tbody>
<tr><td>Hai luật trong service (6.1)</td><td>2</td><td>dòng 30, 106 của bộ chấm</td></tr>
<tr><td>Hai chỗ "không có" trong repository (6.2, 6.3)</td><td>2</td><td>dòng 45, 121 của bộ chấm</td></tr>
<tr><td>Không catch rỗng, không Exception chung chung ở đâu cả (6.4)</td><td>2</td><td>dòng 61 của bộ chấm + tìm <code>catch (Exception</code> / <code>throws Exception</code></td></tr>
<tr><td>InvalidInputException giữ cause, try-with-resources (6.5)</td><td>2</td><td>đọc</td></tr>
<tr><td><code>lint.py</code> ✓ sạch</td><td>1</td><td><code>lint.py</code></td></tr>
<tr><td>Vấn đáp: "checked hay unchecked, và bắt ở đâu?"</td><td>1</td><td>một câu hỏi</td></tr>
</tbody>
</table>
<details><summary>1. Vì sao LoanLimitException là checked còn loại tài liệu lạ trong createItem là IllegalArgumentException unchecked?</summary><p class="dap-an">✅ Chạm hạn mức là kết quả bình thường người dùng sửa được (trả bớt sách) — checked, để javac buộc mọi nơi gọi xử lý nó. Loại tài liệu ngoài 1–3 chỉ có thể đến từ lỗi lập trình, vì <code>Validation</code> đã chỉ cho 1 tới 3 — unchecked, không bắt, để bug hiện ra thật ồn ào.</p></details>
<details><summary>2. Vì sao repository và service không có một khối try nào?</summary><p class="dap-an">✅ Chúng phát hiện ra thất bại nhưng không trả lời được: không được in (<code>lint.py</code> cấm <code>System.out</code> ngoài view và main) và không biết người dùng đang làm gì. Chúng <code>throw</code> và khai <code>throws</code>; controller — tầng đầu tiên biến được thất bại thành kết quả — mới bắt.</p></details>
<details><summary>3. javac nói gì nếu đặt catch (LibraryException e) trước catch (ItemNotAvailableException e)?</summary><p class="dap-an">✅ "exception ItemNotAvailableException has already been caught": khối catch lớp cha nhận hết mọi lớp con, nên khối thứ hai không bao giờ tới được. Xếp catch từ cụ thể tới chung.</p></details>`),
    bi(`<h2>8. Extra challenges and what comes next</h2>
<ul>
<li>⭐ Deleting B001 while someone is borrowing it should be refused: add <code>ItemOnLoanException</code>. Which layer throws it, and which repository does it need to ask?</li>
<li>⭐ Make <code>LoanLimitException</code> carry the numbers (<code>getLoanCount()</code>, <code>getMaxLoans()</code>) as private fields, and let the view build the sentence. What changes in <code>BookService</code>?</li>
<li>⭐⭐ Staff may hold 5 items (Lab 5's borrower types): where does that rule live so that the exception stays the same?</li>
</ul>
<div class="callout"><p><strong>Next — Lab 7 (after Chapter 7):</strong> the shelf gets crowded. Search with several criteria at once, sort on four keys, count by type with an array of objects, and clean out the items with no copy left — removing from a list while you walk it, without a <code>ConcurrentModificationException</code> and without skipping a cell.</p></div>`,
    `<h2>8. Thử thách thêm và việc tiếp theo</h2>
<ul>
<li>⭐ Xoá B001 trong khi có người đang mượn nó thì phải từ chối: thêm <code>ItemOnLoanException</code>. Tầng nào ném, và nó cần hỏi repository nào?</li>
<li>⭐ Cho <code>LoanLimitException</code> mang theo các con số (<code>getLoanCount()</code>, <code>getMaxLoans()</code>) bằng trường private, để view tự dựng câu. <code>BookService</code> đổi gì?</li>
<li>⭐⭐ Cán bộ được giữ 5 tài liệu (hai loại người mượn của Lab 5): luật đó nằm ở đâu để ngoại lệ vẫn giữ nguyên?</li>
</ul>
<div class="callout"><p><strong>Tiếp theo — Lab 7 (sau Chương 7):</strong> kệ sách đông dần. Tìm theo nhiều tiêu chí cùng lúc, sắp theo bốn khoá, thống kê theo loại bằng một mảng đối tượng, và dọn những tài liệu đã hết bản — xoá khỏi danh sách ngay khi đang duyệt nó, mà không dính <code>ConcurrentModificationException</code> và không bỏ sót ô nào.</p></div>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch6) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Which of these exceptions is CHECKED, so javac forces you to catch or declare it?|||(Dạng câu FE) Ngoại lệ nào sau đây là CHECKED, tức javac buộc bạn bắt hoặc khai báo?',
      options: ['NullPointerException|||NullPointerException', 'ArithmeticException|||ArithmeticException', 'FileNotFoundException|||FileNotFoundException', 'NumberFormatException|||NumberFormatException'],
      correctIndex: 2,
      points: 1,
      explanation: 'Checked exceptions are subclasses of Exception that are not subclasses of RuntimeException. FileNotFoundException extends IOException extends Exception, so new FileReader("x.txt") without try-catch or throws gives "unreported exception FileNotFoundException; must be caught or declared to be thrown". The other three all extend RuntimeException (NumberFormatException through IllegalArgumentException), so the compiler does not force anything.|||Ngoại lệ checked là lớp con của Exception mà không phải lớp con của RuntimeException. FileNotFoundException kế thừa IOException, IOException kế thừa Exception, nên new FileReader("x.txt") không có try-catch hay throws sẽ báo "unreported exception FileNotFoundException; must be caught or declared to be thrown". Ba lớp còn lại đều kế thừa RuntimeException (NumberFormatException qua IllegalArgumentException), nên trình biên dịch không ép gì.' },
    { id: 'q2',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `public class Q2 {
    public static void main(String[] args) {
        try {
            int kq = 10 / 0;
            System.out.print("Result " + kq + " ");
        } catch (NumberFormatException e) {
            System.out.print("Error1 ");
        } catch (ArithmeticException e) {
            System.out.print("Error2 ");
        } catch (Exception e) {
            System.out.print("Error3 ");
        }
        System.out.println("Finish");
    }
}`,
      codeLang: 'java',
      options: ['Error1 Finish|||Error1 Finish', 'Error2 Finish|||Error2 Finish', 'Error2 Error3 Finish|||Error2 Error3 Finish', 'Finish|||Finish'],
      correctIndex: 1,
      points: 1,
      explanation: '10 / 0 throws ArithmeticException, so the print in the try is skipped. Catches are tried top to bottom: NumberFormatException does not match, ArithmeticException does — it runs, and the remaining catches are skipped even though Exception would also match. Then the statement after the try prints Finish.|||10 / 0 ném ArithmeticException, nên lệnh in trong try bị bỏ qua. Các catch được thử từ trên xuống: NumberFormatException không khớp, ArithmeticException khớp — nó chạy, và các catch còn lại bị bỏ qua dù Exception cũng khớp. Rồi câu lệnh sau try in Finish.' },
    { id: 'q3',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `public class Q3 {
    static int get() {
        int x = 1;
        try {
            return x;
        } finally {
            x = 5;
        }
    }
    public static void main(String[] args) {
        System.out.println(get());
    }
}`,
      codeLang: 'java',
      options: ['1|||1', '5|||5', '6|||6', 'It does not compile: a method cannot return inside try|||Không biên dịch được: không được return bên trong try'],
      correctIndex: 0,
      points: 1,
      explanation: 'return x evaluates x (1) and keeps that value; then finally runs and changes the variable x to 5, which no longer matters — the method returns 1. Only a return statement inside finally would replace the value (and it would also swallow any pending exception, which is why it is bad practice).|||return x tính x (bằng 1) và giữ lại giá trị đó; rồi finally chạy và đổi biến x thành 5, điều không còn ảnh hưởng — phương thức trả về 1. Chỉ một câu return bên trong finally mới thay được giá trị (và nó còn nuốt mất ngoại lệ đang chờ, vì thế đó là thói quen xấu).' },
    { id: 'q4',
      question: '(FE question type) What happens when this code is compiled?|||(Dạng câu FE) Điều gì xảy ra khi biên dịch đoạn code này?',
      code: `try {
    int[] a = new int[2];
    a[5] = 1;
} catch (Exception e) {
    System.out.println("general");
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("index");
}`,
      codeLang: 'java',
      options: ['It compiles and prints general|||Biên dịch được và in general', 'It compiles and prints index|||Biên dịch được và in index', 'It compiles and prints general then index|||Biên dịch được và in general rồi index', 'It does not compile: the second catch can never be reached|||Không biên dịch được: catch thứ hai không bao giờ tới được'],
      correctIndex: 3,
      points: 1,
      explanation: 'Measured on JDK 8: "error: exception ArrayIndexOutOfBoundsException has already been caught". catch (Exception e) already accepts every subclass (father = son), so a later catch for a subclass is unreachable, and javac refuses unreachable code. Put the specific catch first.|||Đo trên JDK 8: "error: exception ArrayIndexOutOfBoundsException has already been caught". catch (Exception e) đã nhận mọi lớp con (cha = con), nên một catch phía sau cho lớp con là không bao giờ tới được, và javac từ chối code không tới được. Hãy đặt catch cụ thể lên trước.' },
    { id: 'q5',
      question: 'Which keyword is written in a METHOD HEADER to declare that the method may pass a checked exception to its caller?|||Từ khoá nào được viết ở ĐẦU PHƯƠNG THỨC để khai báo rằng phương thức có thể chuyển một ngoại lệ checked cho bên gọi?',
      options: ['throws|||throws', 'throw|||throw', 'catch|||catch', 'finally|||finally'],
      correctIndex: 0,
      points: 1,
      explanation: 'void read() throws FileNotFoundException is a promise in the header: callers must handle or declare it. throw (no s) is a statement that throws one object now, e.g. throw new Exception("bad"). catch handles an exception; finally runs cleanup code.|||void read() throws FileNotFoundException là một lời hứa ở đầu phương thức: bên gọi phải xử lý hoặc khai báo tiếp. throw (không có s) là câu lệnh ném một đối tượng ngay lúc đó, ví dụ throw new Exception("bad"). catch xử lý ngoại lệ; finally chạy code dọn dẹp.' },
    { id: 'q6',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `public class Q6 {
    static void m() {
        try {
            int k = 1 / 0;
        } finally {
            System.out.print("B ");
        }
    }
    public static void main(String[] args) {
        try {
            System.out.print("A ");
            m();
            System.out.print("X ");
        } catch (ArithmeticException e) {
            System.out.print("C ");
        }
        System.out.println("D");
    }
}`,
      codeLang: 'java',
      options: ['A C B D|||A C B D', 'A B X C D|||A B X C D', 'A B C D|||A B C D', 'A C D|||A C D'],
      correctIndex: 2,
      points: 1,
      explanation: 'm() has no catch: when 1 / 0 throws, its finally prints B on the way out, then the exception propagates to main. In main the rest of the try (X) is skipped, the catch prints C, and the code after the try prints D.|||m() không có catch: khi 1 / 0 ném, finally của nó in B trên đường thoát ra, rồi ngoại lệ lan lên main. Trong main phần còn lại của try (X) bị bỏ qua, catch in C, và code sau try in D.' },
    { id: 'q7',
      question: 'An uncaught exception prints "Exception in thread main ..." followed by several lines starting with "at". What does the FIRST "at" line show?|||Một ngoại lệ không bị bắt in "Exception in thread main ..." rồi nhiều dòng bắt đầu bằng "at". Dòng "at" ĐẦU TIÊN cho biết gì?',
      options: ['The line where main started|||Dòng nơi main bắt đầu', 'The method and line where the exception was thrown — the most recent call|||Phương thức và dòng nơi ngoại lệ bị ném — lời gọi gần nhất', 'The last line of the program|||Dòng cuối cùng của chương trình', 'The catch block that should have handled it|||Khối catch lẽ ra phải xử lý nó'],
      correctIndex: 1,
      points: 1,
      explanation: "A stack trace lists the active calls newest first. For the school's ExceptionPropagate it was mC (line 12, the division), then mB:8, mA:4, main:16 — main comes LAST. When the first lines are inside the JDK (FileInputStream, FloatingDecimal…), look for the first line that belongs to your own classes.|||Stack trace liệt kê các lời gọi đang hoạt động, mới nhất đứng đầu. Với ExceptionPropagate của trường, đó là mC (dòng 12, phép chia), rồi mB:8, mA:4, main:16 — main đứng CUỐI. Khi các dòng đầu nằm trong JDK (FileInputStream, FloatingDecimal…), hãy tìm dòng đầu tiên thuộc lớp của chính bạn." },
    { id: 'q8',
      question: 'A method readNumber() creates new Scanner(System.in) every time it is called. The program calls it twice, and the grader pipes three lines of input at once. What happens on the second call?|||Phương thức readNumber() tạo new Scanner(System.in) mỗi lần được gọi. Chương trình gọi nó hai lần, và máy chấm nạp cùng lúc ba dòng dữ liệu qua pipe. Lần gọi thứ hai thì sao?',
      options: ['It reads the second line normally|||Nó đọc dòng thứ hai bình thường', 'It reads the first line again|||Nó đọc lại dòng thứ nhất', 'It waits for the keyboard forever|||Nó chờ bàn phím mãi mãi', 'It throws NoSuchElementException, because the first Scanner buffered the rest of the input|||Nó ném NoSuchElementException, vì Scanner đầu tiên đã đệm mất phần dữ liệu còn lại'],
      correctIndex: 3,
      points: 1,
      explanation: 'Measured on JDK 8 (lesson 6.A, slide 16): the first Scanner reads a whole block into its buffer — all three lines — returns the first, and is thrown away with the rest. The second Scanner finds the stream empty. Typed by hand it works, because each Enter delivers one line at a time. If the caller also catches the general Exception and loops, the program never stops. Use one Scanner for the whole program.|||Đo trên JDK 8 (bài 6.A, slide 16): Scanner đầu tiên đọc cả một khối vào bộ đệm — cả ba dòng — trả về dòng đầu, rồi bị bỏ đi cùng phần còn lại. Scanner thứ hai gặp luồng trống. Gõ tay thì chạy được, vì mỗi lần Enter chỉ đưa vào một dòng. Nếu bên gọi còn bắt Exception tổng quát rồi lặp lại, chương trình không bao giờ dừng. Hãy dùng một Scanner cho cả chương trình.' },
    { id: 'q9',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `public class Q9 {
    static void run() {
        try {
            throw new IllegalStateException();
        } catch (IllegalStateException e) {
            System.out.print("1 ");
            int[] a = new int[1];
            a[1] = 0;
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.print("2 ");
        } finally {
            System.out.print("3 ");
        }
    }
    public static void main(String[] args) {
        try {
            run();
        } catch (RuntimeException e) {
            System.out.println("4");
        }
    }
}`,
      codeLang: 'java',
      options: ['1 3 4|||1 3 4', '1 2 3|||1 2 3', '1 2 3 4|||1 2 3 4', '1 3|||1 3'],
      correctIndex: 0,
      points: 1,
      explanation: "The first catch prints 1, then a[1] throws ArrayIndexOutOfBoundsException INSIDE that catch. The other catch clauses of the same try only guard the try block, not its catches, so 2 is never printed. finally still runs (3), then the exception leaves run() and main's catch (RuntimeException is its father) prints 4.|||Catch thứ nhất in 1, rồi a[1] ném ArrayIndexOutOfBoundsException BÊN TRONG catch đó. Các catch khác của cùng try chỉ canh khối try, không canh các catch của nó, nên 2 không bao giờ được in. finally vẫn chạy (3), rồi ngoại lệ rời run() và catch của main (RuntimeException là cha của nó) in 4." },
    { id: 'q10',
      question: 'You write class InvalidAgeException for a business rule and want the compiler to force every caller to handle it. Which class should it extend?|||Bạn viết lớp InvalidAgeException cho một luật nghiệp vụ và muốn trình biên dịch buộc mọi bên gọi phải xử lý nó. Nó nên kế thừa lớp nào?',
      options: ['RuntimeException|||RuntimeException', 'Error|||Error', 'Exception|||Exception', 'IllegalArgumentException|||IllegalArgumentException'],
      correctIndex: 2,
      points: 1,
      explanation: 'Extending Exception (and not RuntimeException) makes it checked: a constructor or method that throws it must declare throws InvalidAgeException, and callers must catch or declare it — exactly what PE-ADV1 Q1 requires. RuntimeException and IllegalArgumentException give unchecked exceptions; Error is reserved for problems of the JVM itself.|||Kế thừa Exception (và không phải RuntimeException) làm nó thành checked: constructor hay phương thức ném nó phải khai báo throws InvalidAgeException, và bên gọi phải bắt hoặc khai báo tiếp — đúng điều đề PE-ADV1 câu 1 yêu cầu. RuntimeException và IllegalArgumentException cho ngoại lệ unchecked; Error dành cho sự cố của chính JVM.' },
  ],
};

export default {
  slides: [L_pro11_1],
  practice: L_on_ch6,
  labs: [L_lab6],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 6 viết lại theo dạng câu FE PRO192, mỗi câu có giải thích song ngữ; câu "in ra gì" đã chạy thật và câu lỗi biên dịch đã đo bằng javac của JDK 8: ngoại lệ checked, catch khớp đầu tiên, return trước finally, thứ tự catch cha–con, throws, lan truyền qua finally, đọc stack trace, Scanner mới mỗi lần gọi với dữ liệu nạp qua pipe, ngoại lệ ném trong catch, và ngoại lệ checked tự tạo.',
};
