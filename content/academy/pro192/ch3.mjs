/**
 * PRO192 · Chương 3 — đóng gói: package, access modifier, case study (pro8 slide 26–40).
 * Bài 📑 học theo từng slide: pro8 (tmp_08.pptx, slide 26–40).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch3.
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab-3-dong-goi-va-luat-du-lieu.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch3).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, registerDeck, bi } from './_slides.mjs';

registerDeck('lab3', { code: 'PRO192 Lab 3', en: 'Lab 3 — CT Library: encapsulation and data rules', vi: 'Lab 3 — CT Library: đóng gói và luật dữ liệu', total: 15, w: 1280, h: 720, ver: 'v2' });

/* ───────── 3.A — 📑 Slide by slide · Encapsulation (3/3): packages, access modifiers, varargs, case study (slides 26–40) ───────── */
const L_pro8_3 = {
  title: '3.A — 📑 Slide by slide · Encapsulation (3/3): packages, access modifiers, varargs, case study (slides 26–40)|||3.A — 📑 Học theo từng slide · Encapsulation (3/3): package, mức truy cập, varargs, case study (slide 26–40)',
  slug: 'pro192-slide-pro8-3',
  type: 'VIDEO',
  description: 'Giảng slide 26–40 bộ "Encapsulation": package là không gian tên (cùng tên List ở java.util và java.awt), tạo package trong NetBeans và chạy lớp có package bằng java mypkg.PkgDemo (lỗi Could not find or load main class thật trên JDK 8), dòng package phải đứng đầu, bốn mức truy cập đo thật bằng javac (bảng public/protected/default/private từ 5 chỗ, kể cả protected qua tham chiếu kiểu cha), demo Box/Rectangle của slide với đúng hai lỗi biên dịch, super, varargs, và case study SportCar: chạy code của trường, chỉ ra các chỗ thiết kế yếu, rồi thiết kế lại thành lớp tự giữ luật (100–200 HP, nổ máy, phanh tay, hộp số).',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.A · school deck "Encapsulation", slides 26–40</span>
<h2>Hiding, for real: packages, access modifiers, and a class that guards its own rules</h2>
<p class="lead">Chapter 2 built classes. Chapter 3 is about <strong>hiding</strong> — the half of encapsulation that the compiler enforces. Slides 26–33 give the tools: <strong>packages</strong> (who is "near" whom) and the four <strong>access levels</strong> (<code>public</code>, <code>protected</code>, default, <code>private</code>). Slides 34–40 apply everything to a case study, a sports car. Every access rule below was measured by compiling real files on JDK 8, and the case study's code is run, criticised and redesigned.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>26–28</td><td>packages: what, how to create, how to run</td><td>create a package in NetBeans and run <code>java mypkg.PkgDemo</code> without the "could not find main class" error</td></tr>
<tr><td>29–32</td><td>access modifiers; inside/outside a class; <code>super</code></td><td>fill in the access table from memory and predict javac's errors</td></tr>
<tr><td>33</td><td>varargs</td><td>write a method that takes any number of arguments</td></tr>
<tr><td>34–40</td><td>case study: SportCar; summary</td><td>go from a problem statement to a UML box to an encapsulated class</td></tr>
</tbody>
</table>
<div class="callout">This is Chapter 3 "Encapsulation &amp; Abstraction" on the web course. The earlier lesson 3.1 below stays as a short summary; abstraction comes back at full strength with abstract classes and interfaces in Chapter 5.</div>`,
    `<span class="eyebrow">Chương 3 · Bài 3.A · bộ slide "Encapsulation" của trường, slide 26–40</span>
<h2>Che giấu, làm thật: package, access modifier, và một lớp tự canh giữ luật của nó</h2>
<p class="lead">Chương 2 dựng lớp. Chương 3 nói về <strong>che giấu</strong> — nửa của đóng gói mà trình biên dịch canh giữ. Slide 26–33 đưa công cụ: <strong>package</strong> (gói — ai "gần" ai) và bốn <strong>mức truy cập</strong> (<code>public</code>, <code>protected</code>, default, <code>private</code>). Slide 34–40 áp dụng tất cả vào một case study: chiếc xe thể thao. Mọi luật truy cập bên dưới đều được đo bằng cách biên dịch file thật trên JDK 8, còn code case study được chạy, phê bình và thiết kế lại.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>26–28</td><td>package: là gì, tạo thế nào, chạy thế nào</td><td>tạo package trong NetBeans và chạy <code>java mypkg.PkgDemo</code> không vướng lỗi "could not find main class"</td></tr>
<tr><td>29–32</td><td>access modifier; bên trong/bên ngoài một lớp; <code>super</code></td><td>tự điền bảng mức truy cập và đoán trước lỗi của javac</td></tr>
<tr><td>33</td><td>varargs (số đối số tuỳ ý)</td><td>viết phương thức nhận bao nhiêu đối số cũng được</td></tr>
<tr><td>34–40</td><td>case study: SportCar; tóm tắt</td><td>đi từ đề bài tới hộp UML tới một lớp đóng gói tốt</td></tr>
</tbody>
</table>
<div class="callout">Đây là Chương 3 "Encapsulation &amp; Abstraction" của khoá web. Bài 3.1 cũ phía dưới vẫn giữ làm bản tóm tắt ngắn; tính trừu tượng quay lại đầy đủ với abstract class và interface ở Chương 5.</div>`),
    walkHead('pro8', 26, 40),
    walk('pro8', [
      [26, 'What Is a Package?',
        `<p class="y-chinh">🎯 A <strong>package</strong> is a <strong>namespace</strong> that organises a set of related classes and interfaces. The Java platform provides an enormous class library — a set of packages — called the <strong>API</strong>; for example a <code>String</code> object contains state and behaviour for character strings.</p>
<p>"Namespace" means the package becomes part of the class's real name. <code>List</code> alone is ambiguous: the API has <code>java.util.List</code> (a collection) and <code>java.awt.List</code> (a GUI list box). The full name — package + class — is what the JVM uses:</p>
<pre><code class="language-java">// release: 8
// Slide 26: a package is a namespace. The same short name can exist in two packages; the full name (package + class) is what really identifies a class
import java.util.List;                       // import = permission to write the short name

public class GoiApi {
    public static void main(String[] args) {
        String s = "Encapsulation";          // java.lang is imported automatically
        java.util.Scanner sc = null;         // no import needed if you write the full name
        List&lt;String&gt; l = java.util.Arrays.asList("a", "b");
        java.awt.List awtList = null;        // ANOTHER class called List, in package java.awt
        System.out.println(s.getClass().getName());
        System.out.println(l.getClass().getName().startsWith("java.util.") + "  &lt;- the list's class lives in java.util");
        System.out.println(List.class.getName() + "  vs  " + java.awt.List.class.getName());
        System.out.println("String state and behaviour: length=" + s.length() + ", upper=" + s.toUpperCase() + ", sub=" + s.substring(0, 5));
    }
}</code></pre>
<div class="out">java.lang.String<br>
true &nbsp;&lt;- the list's class lives in java.util<br>
java.util.List &nbsp;vs &nbsp;java.awt.List<br>
String state and behaviour: length=13, upper=ENCAPSULATION, sub=Encap</div>
<p>Three rules from that program: <code>java.lang</code> (<code>String</code>, <code>Math</code>, <code>System</code>) is imported automatically; <code>import</code> only lets you write the <em>short</em> name, it loads nothing; and you can always skip the import by writing the full name (<code>java.util.Scanner sc</code>).</p>
<p class="meo">🧠 A package is a folder and a surname at the same time: <code>mypkg.PkgDemo</code> lives in folder <code>mypkg/</code>, and two classes may share a first name if their surnames differ.</p>`,
        `<p class="y-chinh">🎯 <strong>Package</strong> (gói) là một <strong>không gian tên (namespace)</strong> tổ chức một tập lớp và interface có liên quan. Nền tảng Java cung cấp một thư viện lớp khổng lồ — một tập package — gọi là <strong>API</strong>; ví dụ một đối tượng <code>String</code> chứa trạng thái và hành vi của chuỗi ký tự.</p>
<p>"Không gian tên" nghĩa là package trở thành một phần tên thật của lớp. Chỉ nói <code>List</code> thì mơ hồ: API có <code>java.util.List</code> (một collection) và <code>java.awt.List</code> (hộp danh sách trong giao diện đồ hoạ). Tên đầy đủ — package + lớp — mới là thứ JVM dùng:</p>
<pre><code class="language-java">// release: 8
// Slide 26: package là một không gian tên. Cùng một tên ngắn có thể có ở hai package; tên đầy đủ (package + lớp) mới thật sự xác định một lớp
import java.util.List;                       // import = được phép viết tên ngắn

public class GoiApi {
    public static void main(String[] args) {
        String s = "Encapsulation";          // java.lang được import tự động
        java.util.Scanner sc = null;         // không cần import nếu viết tên đầy đủ
        List&lt;String&gt; l = java.util.Arrays.asList("a", "b");
        java.awt.List awtList = null;        // MỘT lớp KHÁC tên List, trong package java.awt
        System.out.println(s.getClass().getName());
        System.out.println(l.getClass().getName().startsWith("java.util.") + "  &lt;- the list's class lives in java.util");
        System.out.println(List.class.getName() + "  vs  " + java.awt.List.class.getName());
        System.out.println("String state and behaviour: length=" + s.length() + ", upper=" + s.toUpperCase() + ", sub=" + s.substring(0, 5));
    }
}</code></pre>
<div class="out">java.lang.String<br>
true &nbsp;&lt;- the list's class lives in java.util<br>
java.util.List &nbsp;vs &nbsp;java.awt.List<br>
String state and behaviour: length=13, upper=ENCAPSULATION, sub=Encap</div>
<p>Ba luật từ chương trình đó: <code>java.lang</code> (<code>String</code>, <code>Math</code>, <code>System</code>) được import tự động; <code>import</code> chỉ cho phép viết tên <em>ngắn</em>, nó không nạp gì cả; và bạn luôn bỏ được import bằng cách viết tên đầy đủ (<code>java.util.Scanner sc</code>).</p>
<p class="meo">🧠 Package vừa là thư mục vừa là "họ": <code>mypkg.PkgDemo</code> nằm trong thư mục <code>mypkg/</code>, và hai lớp được trùng "tên" nếu khác "họ".</p>`],
      [27, 'User-Defined Package',
        `<p class="y-chinh">🎯 Add a Java class in NetBeans and type a name in the <strong>Package</strong> box (<code>mypkg</code>): NetBeans creates the folder <code>src/mypkg/</code> and writes <code>package mypkg;</code> as the first line. If a package is used, <strong>it must be the first line</strong> in the Java code.</p>
<p>"First line" precisely means <strong>first statement</strong>: comments and blank lines may come before it, an <code>import</code> may not. Both halves of the slide, measured on JDK 8 — the folder that <code>javac -d</code> creates from the package name, and the error when <code>package</code> is not first:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("FirstPrj");
    viet(prj, "src/mypkg/PkgDemo.java",                      // the "package" line must be the first statement of the file
        "package mypkg;\\n" +
        "public class PkgDemo {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Package Demo.\\");\\n" +
        "    }\\n" +
        "}\\n");
    new File(prj, "build/classes").mkdirs();                 // what NetBeans' Build does: compile src/ into build/classes
    lenh(prj, "javac", "-d", "build/classes", "src/mypkg/PkgDemo.java");
    cay(prj, "  ");
    lenh(new File(prj, "build/classes/mypkg"), "java", "PkgDemo");     // slide 28, red box: inside the package folder
    lenh(new File(prj, "build/classes"), "java", "mypkg.PkgDemo");     // slide 28, green box: from the root of the classes, full name
    lenh(prj, "java", "-cp", "build/classes", "mypkg.PkgDemo");        // the same from anywhere, with -cp

    viet(prj, "src/mypkg/Wrong.java",                        // the package line is NOT first
        "import java.util.Scanner;\\n" +
        "package mypkg;\\n" +
        "public class Wrong { }\\n");
    lenh(prj, "javac", "-d", "build/classes", "src/mypkg/Wrong.java");
}</code></pre>
<div class="out">&gt; javac -d build/classes src/mypkg/PkgDemo.java<br>
&nbsp;&nbsp;build/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;classes/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mypkg/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PkgDemo.class<br>
&nbsp;&nbsp;src/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mypkg/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PkgDemo.java<br>
&gt; java PkgDemo<br>
Error: Could not find or load main class PkgDemo<br>
(exit code 1)<br>
&gt; java mypkg.PkgDemo<br>
Package Demo.<br>
&gt; java -cp build/classes mypkg.PkgDemo<br>
Package Demo.<br>
&gt; javac -d build/classes src/mypkg/Wrong.java<br>
src/mypkg/Wrong.java:2: error: class, interface, or enum expected<br>
package mypkg;<br>
^<br>
1 error<br>
(exit code 1)</div>
<p>Look at the tree: the source sits in <code>src/mypkg/</code>, and javac put <code>PkgDemo.class</code> into <code>build/classes/mypkg/</code> — the folder path <strong>is</strong> the package name. The error at the end ("class, interface, or enum expected") is javac's way of saying that after an <code>import</code> it no longer accepts a <code>package</code> line.</p>
<div class="pitfall">PE: the paper says "in the default package" or "in package <code>abc</code>". The marker finds your class by its full name, so a class put in the wrong package (NetBeans' default <code>firstprj</code> package, for example) "does not exist" for it. Check the first line of every file before you build the jar.</div>`,
        `<p class="y-chinh">🎯 Thêm một lớp Java trong NetBeans và gõ tên vào ô <strong>Package</strong> (<code>mypkg</code>): NetBeans tạo thư mục <code>src/mypkg/</code> và viết <code>package mypkg;</code> ở dòng đầu. Nếu dùng package thì <strong>nó phải là dòng đầu tiên</strong> của code Java.</p>
<p>"Dòng đầu tiên" nói chính xác là <strong>câu lệnh đầu tiên</strong>: chú thích và dòng trống được đứng trước, <code>import</code> thì không. Cả hai nửa của slide, đo trên JDK 8 — thư mục mà <code>javac -d</code> tạo từ tên package, và lỗi khi <code>package</code> không đứng đầu:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("FirstPrj");
    viet(prj, "src/mypkg/PkgDemo.java",                      // dòng "package" phải là câu lệnh đầu tiên của file
        "package mypkg;\\n" +
        "public class PkgDemo {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        System.out.println(\\"Package Demo.\\");\\n" +
        "    }\\n" +
        "}\\n");
    new File(prj, "build/classes").mkdirs();                 // việc Build của NetBeans làm: dịch src/ vào build/classes
    lenh(prj, "javac", "-d", "build/classes", "src/mypkg/PkgDemo.java");
    cay(prj, "  ");
    lenh(new File(prj, "build/classes/mypkg"), "java", "PkgDemo");     // slide 28, khung đỏ: đứng trong thư mục package
    lenh(new File(prj, "build/classes"), "java", "mypkg.PkgDemo");     // slide 28, khung xanh: đứng ở gốc thư mục classes, gọi tên đầy đủ
    lenh(prj, "java", "-cp", "build/classes", "mypkg.PkgDemo");        // như trên từ bất kỳ đâu, bằng -cp

    viet(prj, "src/mypkg/Wrong.java",                        // dòng package KHÔNG đứng đầu
        "import java.util.Scanner;\\n" +
        "package mypkg;\\n" +
        "public class Wrong { }\\n");
    lenh(prj, "javac", "-d", "build/classes", "src/mypkg/Wrong.java");
}</code></pre>
<div class="out">&gt; javac -d build/classes src/mypkg/PkgDemo.java<br>
&nbsp;&nbsp;build/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;classes/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mypkg/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PkgDemo.class<br>
&nbsp;&nbsp;src/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mypkg/<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PkgDemo.java<br>
&gt; java PkgDemo<br>
Error: Could not find or load main class PkgDemo<br>
(exit code 1)<br>
&gt; java mypkg.PkgDemo<br>
Package Demo.<br>
&gt; java -cp build/classes mypkg.PkgDemo<br>
Package Demo.<br>
&gt; javac -d build/classes src/mypkg/Wrong.java<br>
src/mypkg/Wrong.java:2: error: class, interface, or enum expected<br>
package mypkg;<br>
^<br>
1 error<br>
(exit code 1)</div>
<p>Nhìn cây thư mục: mã nguồn nằm trong <code>src/mypkg/</code>, còn javac đặt <code>PkgDemo.class</code> vào <code>build/classes/mypkg/</code> — đường dẫn thư mục <strong>chính là</strong> tên package. Lỗi ở cuối ("class, interface, or enum expected" — cần class, interface hoặc enum) là cách javac nói rằng sau một <code>import</code> nó không nhận dòng <code>package</code> nữa.</p>
<div class="pitfall">PE: đề ghi "trong default package" hoặc "trong package <code>abc</code>". Máy chấm tìm lớp của bạn bằng tên đầy đủ, nên lớp đặt nhầm package (ví dụ package mặc định <code>firstprj</code> mà NetBeans tự tạo) là "không tồn tại" với nó. Kiểm dòng đầu của mọi file trước khi build jar.</div>`],
      [28, 'User-Defined Package',
        `<p class="y-chinh">🎯 Running a packaged class outside NetBeans: inside <code>build\\classes\\mypkg</code>, <code>java PkgDemo</code> fails with <code>Error: Could not find or load main class PkgDemo</code>; one folder up, in <code>build\\classes</code>, <code>java mypkg.PkgDemo</code> prints <code>Package Demo.</code> — so the file <code>PkgDemo.bat</code> contains <code>java mypkg.PkgDemo</code> and <code>Pause</code>.</p>
<p>The JDK 8 run above reproduces both boxes of the slide exactly, with the same error text as the Windows XP screenshot. The rule behind it: <code>java</code> takes the <strong>full class name</strong> (<code>mypkg.PkgDemo</code>) and looks for the file <code>mypkg/PkgDemo.class</code> <em>under each folder of the class path</em>. From inside <code>mypkg</code>, the name <code>PkgDemo</code> points to a file whose real name is <code>mypkg.PkgDemo</code> — wrong name, refused.</p>
<table>
<thead><tr><th>Where you stand</th><th>Command</th><th>Result</th></tr></thead>
<tbody>
<tr><td><code>build/classes/mypkg</code></td><td><code>java PkgDemo</code></td><td>Could not find or load main class</td></tr>
<tr><td><code>build/classes</code></td><td><code>java mypkg.PkgDemo</code></td><td>runs</td></tr>
<tr><td>anywhere</td><td><code>java -cp build/classes mypkg.PkgDemo</code></td><td>runs — the robust form</td></tr>
</tbody>
</table>
<p class="meo">🧠 Rule of thumb: stand at the root of the classes (or point <code>-cp</code> there) and type the class name with dots, never with the folder path.</p>`,
        `<p class="y-chinh">🎯 Chạy một lớp có package bên ngoài NetBeans: đứng trong <code>build\\classes\\mypkg</code>, lệnh <code>java PkgDemo</code> hỏng với <code>Error: Could not find or load main class PkgDemo</code>; lùi lên một thư mục, ở <code>build\\classes</code>, lệnh <code>java mypkg.PkgDemo</code> in ra <code>Package Demo.</code> — nên file <code>PkgDemo.bat</code> chứa <code>java mypkg.PkgDemo</code> và <code>Pause</code>.</p>
<p>Lần chạy JDK 8 ở trên tái hiện đúng cả hai khung của slide, cùng câu báo lỗi như ảnh chụp Windows XP. Luật nằm sau nó: <code>java</code> nhận <strong>tên lớp đầy đủ</strong> (<code>mypkg.PkgDemo</code>) và đi tìm file <code>mypkg/PkgDemo.class</code> <em>bên dưới từng thư mục của class path</em>. Đứng trong <code>mypkg</code> mà gọi <code>PkgDemo</code> là trỏ tới một file có tên thật là <code>mypkg.PkgDemo</code> — sai tên, bị từ chối.</p>
<table>
<thead><tr><th>Bạn đứng ở</th><th>Lệnh</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td><code>build/classes/mypkg</code></td><td><code>java PkgDemo</code></td><td>Could not find or load main class</td></tr>
<tr><td><code>build/classes</code></td><td><code>java mypkg.PkgDemo</code></td><td>chạy được</td></tr>
<tr><td>ở đâu cũng được</td><td><code>java -cp build/classes mypkg.PkgDemo</code></td><td>chạy được — cách chắc chắn nhất</td></tr>
</tbody>
</table>
<p class="meo">🧠 Mẹo nhớ: đứng ở gốc thư mục classes (hoặc chĩa <code>-cp</code> tới đó) và gõ tên lớp bằng dấu chấm, không bao giờ bằng đường dẫn thư mục.</p>`],
      [29, 'Access modifiers',
        `<p class="y-chinh">🎯 In linguistics a modifier brings out the meaning of another word; in OOP, <strong>modifiers</strong> are keywords that tell the compiler about the nature of code, data and classes. The common ones are the <strong>access modifiers</strong> (<code>public</code>, <code>protected</code>, <code>private</code>), which impose a level of access on a <strong>class</strong> (where can it be used?), <strong>methods</strong> (can they be called?) and <strong>fields</strong> (can they be read/written?).</p>
<p>There are four access levels but only three keywords: writing <strong>no</strong> modifier gives the fourth level, called <em>default</em> or <em>package-private</em>. Other modifiers you meet in PRO192 are not about access: <code>static</code> (belongs to the class, not the object), <code>final</code> (cannot change), <code>abstract</code> (Chapter 5).</p>
<p>The levels are checked by the <strong>compiler</strong>, not at run time: a forbidden access never becomes a running program. That is the difference from a comment like "please do not change this field" — the compiler turns a convention into a rule. All four levels are measured on slide 31.</p>
<div class="pitfall">FE: "Which access modifier allows you to access method calls in libraries not created in Java?" — the expected answer is <code>native</code>, which is <em>not</em> an access modifier at all (it marks a method implemented in C). Read such questions as "which modifier", not "which access level".</div>`,
        `<p class="y-chinh">🎯 Trong ngôn ngữ học, bổ ngữ (modifier) làm rõ nghĩa của từ khác; trong OOP, <strong>modifier</strong> là các từ khoá cho trình biên dịch biết bản chất của code, dữ liệu và lớp. Nhóm hay dùng là <strong>access modifier</strong> (bổ từ truy cập — <code>public</code>, <code>protected</code>, <code>private</code>), áp mức truy cập lên <strong>lớp</strong> (dùng được ở đâu?), <strong>phương thức</strong> (gọi được không?) và <strong>trường</strong> (đọc/ghi được không?).</p>
<p>Có bốn mức truy cập nhưng chỉ ba từ khoá: <strong>không</strong> viết modifier nào cho ra mức thứ tư, gọi là <em>default</em> hay <em>package-private</em> (riêng trong package). Các modifier khác gặp ở PRO192 không nói về truy cập: <code>static</code> (thuộc về lớp, không thuộc đối tượng), <code>final</code> (không đổi được), <code>abstract</code> (Chương 5).</p>
<p>Các mức truy cập được <strong>trình biên dịch</strong> kiểm, không phải lúc chạy: một truy cập bị cấm không bao giờ trở thành chương trình chạy được. Đó là chỗ khác với một dòng chú thích kiểu "xin đừng sửa trường này" — trình biên dịch biến quy ước thành luật. Cả bốn mức được đo ở slide 31.</p>
<div class="pitfall">FE: "Access modifier nào cho phép gọi phương thức trong thư viện không viết bằng Java?" — đáp án mong đợi là <code>native</code>, mà nó <em>không</em> phải access modifier (nó đánh dấu phương thức được cài bằng C). Đọc kiểu câu này thành "modifier nào", không phải "mức truy cập nào".</div>`],
      [30, 'Outside of a Class',
        `<p class="y-chinh">🎯 "Inside" a class means between the braces of that class — all of <code>IntPoint2</code>'s fields, constructors and <code>output()</code>. Code in <code>IntPoint2_Use</code> is inside <em>its</em> class but <strong>outside</strong> <code>IntPoint2</code>. Outside of a class A = another class where A is used.</p>
<p>This definition is what the access table means by "accessible from". Note that it is about <strong>classes, not objects</strong>: code inside <code>IntPoint2</code> may read the <code>private</code> fields of <em>another</em> <code>IntPoint2</code> object. That is why an <code>equals(IntPoint2 other)</code> method can compare <code>this.x == other.x</code> directly.</p>
<table>
<thead><tr><th>Code located in</th><th>Is it inside IntPoint2?</th><th>May it use IntPoint2's private x?</th></tr></thead>
<tbody>
<tr><td>a method of IntPoint2, on <code>this.x</code></td><td>yes</td><td>yes</td></tr>
<tr><td>a method of IntPoint2, on <code>other.x</code> of another IntPoint2</td><td>yes</td><td><strong>yes</strong> (same class)</td></tr>
<tr><td><code>main</code> of IntPoint2_Use</td><td>no</td><td>no</td></tr>
</tbody>
</table>
<p class="meo">🧠 Private is "private to the class's source code", not "private to each object". Two objects of the same class are like twins who can read each other's diaries.</p>`,
        `<p class="y-chinh">🎯 "Bên trong" một lớp nghĩa là nằm giữa hai dấu ngoặc của lớp đó — mọi trường, constructor và <code>output()</code> của <code>IntPoint2</code>. Code trong <code>IntPoint2_Use</code> nằm bên trong lớp <em>của nó</em> nhưng ở <strong>bên ngoài</strong> <code>IntPoint2</code>. Bên ngoài lớp A = một lớp khác nơi A được dùng.</p>
<p>Định nghĩa này chính là nghĩa của "truy cập được từ" trong bảng mức truy cập. Để ý nó nói về <strong>lớp, không phải đối tượng</strong>: code bên trong <code>IntPoint2</code> được đọc trường <code>private</code> của <em>một đối tượng</em> <code>IntPoint2</code> khác. Vì thế phương thức <code>equals(IntPoint2 other)</code> so sánh thẳng được <code>this.x == other.x</code>.</p>
<table>
<thead><tr><th>Code nằm ở</th><th>Có ở bên trong IntPoint2?</th><th>Được dùng x private của IntPoint2?</th></tr></thead>
<tbody>
<tr><td>phương thức của IntPoint2, trên <code>this.x</code></td><td>có</td><td>được</td></tr>
<tr><td>phương thức của IntPoint2, trên <code>other.x</code> của một IntPoint2 khác</td><td>có</td><td><strong>được</strong> (cùng lớp)</td></tr>
<tr><td><code>main</code> của IntPoint2_Use</td><td>không</td><td>không</td></tr>
</tbody>
</table>
<p class="meo">🧠 Private là "riêng của mã nguồn lớp", không phải "riêng của từng đối tượng". Hai đối tượng cùng lớp giống cặp sinh đôi đọc được nhật ký của nhau.</p>`],
      [31, 'Access Modifiers',
        `<p class="y-chinh">🎯 The four levels, from most open: <strong>public</strong> (free access), <strong>protected</strong> (package and subclasses), <strong>no specifier / default</strong> (package only), <strong>private</strong> (the outside cannot access). Order: <code>public &gt; protected &gt; default &gt; private</code>. <code>public</code> and default apply to interfaces, classes and members; <code>protected</code> and <code>private</code> only to members. No modifier ⇒ default.</p>
<p>Instead of memorising the slide's picture, here is the table <strong>generated by javac</strong>: a class <code>a.A</code> with one field of each level, and test classes in four places, each compiled on JDK 8 (OK = compiles, - = compile error):</p>
<pre class="trich"><code class="language-java">static final String[] FIELD = { "pub", "pro", "def", "pri" };

public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "a/A.java",
        "package a;\\n" +
        "public class A {\\n" +
        "    public    int pub = 1;\\n" +
        "    protected int pro = 2;\\n" +
        "              int def = 3;   // no modifier = default (package-private)\\n" +
        "    private   int pri = 4;\\n" +
        "    int fromInside() { return pub + pro + def + pri; }   // the class itself: all four compile\\n" +
        "}\\n");
    System.out.println(String.format("%-40s| pub | pro | def | pri", "place"));
    thu(lab, "same class          (a.A itself)      ", null);
    thu(lab, "same package        (a.SamePkg)       ", "package a;\\npublic class SamePkg { int f(A x) { return x.%s; } }\\n");
    thu(lab, "subclass, other pkg (b.Child extends) ", "package b;\\npublic class Child extends a.A { int f() { return this.%s; } }\\n");
    thu(lab, "subclass, other pkg, via an A ref     ", "package b;\\npublic class Child2 extends a.A { int f(a.A x) { return x.%s; } }\\n");
    thu(lab, "other package       (b.Stranger)      ", "package b;\\npublic class Stranger { int f(a.A x) { return x.%s; } }\\n");
    System.out.println("\\nthe real error text for one cell (private, other package):");
    viet(lab, "b/Stranger.java", "package b;\\npublic class Stranger { int f(a.A x) { return x.pri; } }\\n");
    lenh(lab, "javac", "a/A.java", "b/Stranger.java");
}

/** Compile A + a test class that touches ONE field, for each of the four fields; print OK or "-" (compile error). */
static void thu(File lab, String place, String template) throws Exception {
    StringBuilder row = new StringBuilder(String.format("%-40s|", place.trim()));
    for (String f : FIELD) {
        boolean ok;
        if (template == null) ok = bienDichDuoc(lab, "a/A.java");
        else {
            String pkg = template.startsWith("package a;") ? "a" : "b";
            String cls = template.replaceAll("(?s).*public class (\\\\w+).*", "$1");
            viet(lab, pkg + "/" + cls + ".java", String.format(template, f));
            ok = bienDichDuoc(lab, "a/A.java", pkg + "/" + cls + ".java");
        }
        row.append(ok ? " OK  |" : "  -  |");
    }
    System.out.println(row.substring(0, row.length() - 1));
}
static boolean bienDichDuoc(File dir, String... files) throws Exception {
    List&lt;String&gt; cmd = new ArrayList&lt;String&gt;();
    cmd.add(congCu("javac"));
    cmd.addAll(Arrays.asList(files));
    Process p = new ProcessBuilder(cmd).directory(dir).redirectErrorStream(true).start();
    InputStream in = p.getInputStream();
    while (in.read() &gt;= 0) { }
    return p.waitFor() == 0;
}</code></pre>
<div class="out">place &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| pub | pro | def | pri<br>
same class &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(a.A itself) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| OK &nbsp;| OK &nbsp;| OK<br>
same package &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(a.SamePkg) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| OK &nbsp;| OK &nbsp;| &nbsp;-<br>
subclass, other pkg (b.Child extends) &nbsp;&nbsp;| OK &nbsp;| OK &nbsp;| &nbsp;- &nbsp;| &nbsp;-<br>
subclass, other pkg, via an A ref &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| &nbsp;- &nbsp;| &nbsp;- &nbsp;| &nbsp;-<br>
other package &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b.Stranger) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| &nbsp;- &nbsp;| &nbsp;- &nbsp;| &nbsp;-<br>
<br>
the real error text for one cell (private, other package):<br>
&gt; javac a/A.java b/Stranger.java<br>
b/Stranger.java:2: error: pri has private access in A<br>
public class Stranger { int f(a.A x) { return x.pri; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3ab0421e4d0072abfcbc35e649553b272d0500c5.svg" alt="The four circles of visibility around a member of class A" loading="lazy" /><p class="chu-thich">🧩 The four circles of visibility around a member of class A</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 29–31 — who can see a member of class A (measured by MucTruyCap on JDK 8)
rectangle "anywhere — any package\\n(public)" as W #FFFFFF {
  rectangle "subclasses of A in OTHER packages\\n(public, protected — through this / a subclass reference)" as SUB #F8FAFC {
    rectangle "same package as A\\n(public, protected, default)" as PKG #EEF2FF {
      rectangle "inside class A\\n(public, protected, default, private)" as CLS #E0E7FF
    }
  }
}
note right of W
  order, most open → most closed:
  public &gt; protected &gt; default &gt; private
  UML marks: +  #  ~  -
  top-level class: only public or default
end note
@enduml</code></pre></details>
<p>Read row 4 carefully — it is the detail most summaries (and the slide) leave out. A subclass in <strong>another</strong> package may use a <code>protected</code> member <em>through its own objects</em> (<code>this.pro</code>, row 3), but <strong>not</strong> through a reference of the parent type (<code>x.pro</code> with <code>x</code> declared as <code>a.A</code>). The slide's arrows (public and default → class; protected and private → members only) are correct: a top-level class can only be <code>public</code> or default.</p>
<div class="pitfall">FE: "least restrictive → most restrictive" = <code>public, protected, default, private</code>. "Which allows direct access by a subclass?" → <code>protected</code>. "A default member can be accessed in all classes" → false. And <code>protected</code> also opens the member to the <strong>whole package</strong>, not only to subclasses — row 2.</div>`,
        `<p class="y-chinh">🎯 Bốn mức, từ mở nhất: <strong>public</strong> (truy cập tự do), <strong>protected</strong> (trong package và lớp con), <strong>không ghi gì / default</strong> (chỉ trong package), <strong>private</strong> (bên ngoài không truy cập được). Thứ tự: <code>public &gt; protected &gt; default &gt; private</code>. <code>public</code> và default áp được cho interface, lớp và thành viên; <code>protected</code> và <code>private</code> chỉ cho thành viên. Không ghi modifier ⇒ default.</p>
<p>Thay vì học thuộc hình trên slide, đây là bảng <strong>do javac tạo ra</strong>: một lớp <code>a.A</code> có mỗi mức một trường, và các lớp thử ở bốn chỗ, mỗi cái biên dịch trên JDK 8 (OK = biên dịch được, - = lỗi biên dịch):</p>
<pre class="trich"><code class="language-java">static final String[] FIELD = { "pub", "pro", "def", "pri" };

public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "a/A.java",
        "package a;\\n" +
        "public class A {\\n" +
        "    public    int pub = 1;\\n" +
        "    protected int pro = 2;\\n" +
        "              int def = 3;   // no modifier = default (package-private)\\n" +
        "    private   int pri = 4;\\n" +
        "    int fromInside() { return pub + pro + def + pri; }   // the class itself: all four compile\\n" +
        "}\\n");
    System.out.println(String.format("%-40s| pub | pro | def | pri", "place"));
    thu(lab, "same class          (a.A itself)      ", null);
    thu(lab, "same package        (a.SamePkg)       ", "package a;\\npublic class SamePkg { int f(A x) { return x.%s; } }\\n");
    thu(lab, "subclass, other pkg (b.Child extends) ", "package b;\\npublic class Child extends a.A { int f() { return this.%s; } }\\n");
    thu(lab, "subclass, other pkg, via an A ref     ", "package b;\\npublic class Child2 extends a.A { int f(a.A x) { return x.%s; } }\\n");
    thu(lab, "other package       (b.Stranger)      ", "package b;\\npublic class Stranger { int f(a.A x) { return x.%s; } }\\n");
    System.out.println("\\nthe real error text for one cell (private, other package):");
    viet(lab, "b/Stranger.java", "package b;\\npublic class Stranger { int f(a.A x) { return x.pri; } }\\n");
    lenh(lab, "javac", "a/A.java", "b/Stranger.java");
}

/** Compile A + a test class that touches ONE field, for each of the four fields; print OK or "-" (compile error). */
static void thu(File lab, String place, String template) throws Exception {
    StringBuilder row = new StringBuilder(String.format("%-40s|", place.trim()));
    for (String f : FIELD) {
        boolean ok;
        if (template == null) ok = bienDichDuoc(lab, "a/A.java");
        else {
            String pkg = template.startsWith("package a;") ? "a" : "b";
            String cls = template.replaceAll("(?s).*public class (\\\\w+).*", "$1");
            viet(lab, pkg + "/" + cls + ".java", String.format(template, f));
            ok = bienDichDuoc(lab, "a/A.java", pkg + "/" + cls + ".java");
        }
        row.append(ok ? " OK  |" : "  -  |");
    }
    System.out.println(row.substring(0, row.length() - 1));
}
static boolean bienDichDuoc(File dir, String... files) throws Exception {
    List&lt;String&gt; cmd = new ArrayList&lt;String&gt;();
    cmd.add(congCu("javac"));
    cmd.addAll(Arrays.asList(files));
    Process p = new ProcessBuilder(cmd).directory(dir).redirectErrorStream(true).start();
    InputStream in = p.getInputStream();
    while (in.read() &gt;= 0) { }
    return p.waitFor() == 0;
}</code></pre>
<div class="out">place &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| pub | pro | def | pri<br>
same class &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(a.A itself) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| OK &nbsp;| OK &nbsp;| OK<br>
same package &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(a.SamePkg) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| OK &nbsp;| OK &nbsp;| &nbsp;-<br>
subclass, other pkg (b.Child extends) &nbsp;&nbsp;| OK &nbsp;| OK &nbsp;| &nbsp;- &nbsp;| &nbsp;-<br>
subclass, other pkg, via an A ref &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| &nbsp;- &nbsp;| &nbsp;- &nbsp;| &nbsp;-<br>
other package &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b.Stranger) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| OK &nbsp;| &nbsp;- &nbsp;| &nbsp;- &nbsp;| &nbsp;-<br>
<br>
the real error text for one cell (private, other package):<br>
&gt; javac a/A.java b/Stranger.java<br>
b/Stranger.java:2: error: pri has private access in A<br>
public class Stranger { int f(a.A x) { return x.pri; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/3ab0421e4d0072abfcbc35e649553b272d0500c5.svg" alt="Bốn vòng tròn tầm nhìn quanh một thành viên của lớp A" loading="lazy" /><p class="chu-thich">🧩 Bốn vòng tròn tầm nhìn quanh một thành viên của lớp A</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 29–31 — who can see a member of class A (measured by MucTruyCap on JDK 8)
rectangle "anywhere — any package\\n(public)" as W #FFFFFF {
  rectangle "subclasses of A in OTHER packages\\n(public, protected — through this / a subclass reference)" as SUB #F8FAFC {
    rectangle "same package as A\\n(public, protected, default)" as PKG #EEF2FF {
      rectangle "inside class A\\n(public, protected, default, private)" as CLS #E0E7FF
    }
  }
}
note right of W
  order, most open → most closed:
  public &gt; protected &gt; default &gt; private
  UML marks: +  #  ~  -
  top-level class: only public or default
end note
@enduml</code></pre></details>
<p>Đọc kỹ hàng 4 — chi tiết mà phần lớn bản tóm tắt (và cả slide) bỏ qua. Một lớp con ở package <strong>khác</strong> được dùng thành viên <code>protected</code> <em>qua chính đối tượng của nó</em> (<code>this.pro</code>, hàng 3), nhưng <strong>không</strong> được qua một tham chiếu kiểu lớp cha (<code>x.pro</code> với <code>x</code> khai báo là <code>a.A</code>). Mũi tên trên slide (public và default → lớp; protected và private → chỉ thành viên) là đúng: lớp cấp ngoài cùng (top-level) chỉ có thể là <code>public</code> hoặc default.</p>
<div class="pitfall">FE: "ít hạn chế nhất → hạn chế nhất" = <code>public, protected, default, private</code>. "Mức nào cho lớp con truy cập trực tiếp?" → <code>protected</code>. "Thành viên default truy cập được từ mọi lớp" → sai. Và <code>protected</code> còn mở thành viên cho <strong>cả package</strong>, không chỉ cho lớp con — hàng 2.</div>`],
      [32, 'Access Modifiers',
        `<p class="y-chinh">🎯 The NetBeans demo: <code>rectPkg.Rectangle</code> (<code>protected int length; public int width; public void setSize(int l, int w)</code>), <code>boxPkg.Box extends Rectangle</code> (<code>int height; protected int price; private int weight;</code>, a <code>setSize(l, w, h)</code> that calls <code>super.setSize(l, w)</code>), and <code>boxPkg.Demo_1</code> whose <code>main</code> touches six fields; two lines carry red error marks. <code>super</code> calls a member declared in the father class; a <code>super(...)</code> constructor call must be the first statement of the subclass constructor.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9a9dc289ff02f5d8b3780fa3a446e27f4948d5e6.svg" alt="Slide 32 as a class diagram: which accesses from Demo_1 compile" loading="lazy" /><p class="chu-thich">🧩 Slide 32 as a class diagram: which accesses from Demo_1 compile</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 32 redrawn — two packages, one subclass, and the marks javac checks
package rectPkg {
  class Rectangle {
    # length : int
    + width : int
    --
    + setSize(l : int, w : int) : void
  }
}
package boxPkg {
  class Box {
    ~ height : int
    # price : int
    - weight : int
    --
    ~ setSize(l : int, w : int, h : int) : void
    ~ volume() : int
  }
  class Demo_1 {
    + {static} main(args : String[]) : void
  }
}
Box -up-|&gt; Rectangle
Demo_1 ..&gt; Box : b.height ✓  b.price ✓  b.weight ✗
Demo_1 ..&gt; Rectangle : r.width ✓  r.length ✗
@enduml</code></pre></details>
<p>The screenshot retyped and compiled on JDK 8 — exactly the two red lines fail, then the program runs without them:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("Chapter02");
    viet(prj, "rectPkg/Rectangle.java",
        "package rectPkg;\\n" +
        "public class Rectangle {\\n" +
        "    protected int length;\\n" +
        "    public int width;\\n" +
        "    public void setSize(int l, int w)\\n" +
        "    {   length = l&gt;0? l: 0;\\n" +
        "        width = w&gt;0? w: 0;\\n" +
        "    }\\n" +
        "}\\n");
    viet(prj, "boxPkg/Box.java",
        "package boxPkg;\\n" +
        "import rectPkg.Rectangle;\\n" +
        "public class Box extends Rectangle {\\n" +
        "    int height;\\n" +
        "    protected int price;\\n" +
        "    private int weight;\\n" +
        "    void setSize(int l, int w, int h)\\n" +
        "    {   super.setSize(l,w);\\n" +
        "        height = h&gt;0? h : 0;\\n" +
        "    }\\n" +
        "    int volume ()\\n" +
        "    {  return length*width*height;\\n" +
        "    }\\n" +
        "}\\n");
    String demo =
        "package boxPkg;\\n" +
        "import rectPkg.Rectangle;\\n" +
        "public class Demo_1 {\\n" +
        "    public static void main (String[] args)\\n" +
        "    { Box b = new Box();\\n" +
        "      b.setSize(1,2,3);\\n" +
        "      b.height=10;\\n" +
        "      b.price= 7;\\n" +
        "      b.weight=9;\\n" +
        "      System.out.println(\\"Volumn of the box:\\" + b.volume());\\n" +
        "      Rectangle r= new Rectangle();\\n" +
        "      r.setSize(3,5);\\n" +
        "      r.width=3;\\n" +
        "      r.length=6;\\n" +
        "    }\\n" +
        "}\\n";
    viet(prj, "boxPkg/Demo_1.java", demo);
    new File(prj, "classes").mkdirs();
    lenh(prj, "javac", "-d", "classes", "rectPkg/Rectangle.java", "boxPkg/Box.java", "boxPkg/Demo_1.java");
    // delete the two red lines and build again
    viet(prj, "boxPkg/Demo_1.java", demo.replace("      b.weight=9;\\n", "").replace("      r.length=6;\\n", ""));
    lenh(prj, "javac", "-d", "classes", "rectPkg/Rectangle.java", "boxPkg/Box.java", "boxPkg/Demo_1.java");
    lenh(prj, "java", "-cp", "classes", "boxPkg.Demo_1");
}</code></pre>
<div class="out">&gt; javac -d classes rectPkg/Rectangle.java boxPkg/Box.java boxPkg/Demo_1.java<br>
boxPkg/Demo_1.java:9: error: weight has private access in Box<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.weight=9;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
boxPkg/Demo_1.java:14: error: length has protected access in Rectangle<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r.length=6;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)<br>
&gt; javac -d classes rectPkg/Rectangle.java boxPkg/Box.java boxPkg/Demo_1.java<br>
&gt; java -cp classes boxPkg.Demo_1<br>
Volumn of the box:20</div>
<p>Each line, checked against slide 31's table: <code>b.height</code> (default) and <code>b.price</code> (protected) — Demo_1 is in the <strong>same package</strong> as Box ⇒ allowed; <code>b.weight</code> — private ⇒ only inside Box; <code>r.width</code> — public; <code>r.length</code> — protected in <code>rectPkg</code>, and Demo_1 is neither in that package nor a subclass ⇒ refused. Inside <code>Box.volume()</code>, <code>length*width*height</code> compiles because Box <em>is</em> a subclass using its own inherited <code>length</code>. The volume is 20, not 6: <code>setSize(1,2,3)</code> gave height 3, then <code>b.height=10</code> overwrote it — a direct field write that skipped the <code>h&gt;0</code> check, which is exactly why fields should be private.</p>
<div class="pitfall">The red note talks about constructors ("contructor" — typo) but the code shows <code>super.setSize</code> in an ordinary method, where it may appear anywhere. Only <code>super(...)</code> — calling the parent <em>constructor</em> — must come first (javac: "call to super must be first statement in constructor"); Chapter 4 covers it with inheritance.</div>`,
        `<p class="y-chinh">🎯 Demo NetBeans: <code>rectPkg.Rectangle</code> (<code>protected int length; public int width; public void setSize(int l, int w)</code>), <code>boxPkg.Box extends Rectangle</code> (<code>int height; protected int price; private int weight;</code>, một <code>setSize(l, w, h)</code> gọi <code>super.setSize(l, w)</code>), và <code>boxPkg.Demo_1</code> có <code>main</code> đụng tới sáu trường; hai dòng mang dấu lỗi đỏ. <code>super</code> gọi một thành viên khai báo ở lớp cha; lời gọi constructor <code>super(...)</code> phải là câu lệnh đầu tiên trong constructor của lớp con.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9a9dc289ff02f5d8b3780fa3a446e27f4948d5e6.svg" alt="Slide 32 thành sơ đồ lớp: truy cập nào từ Demo_1 biên dịch được" loading="lazy" /><p class="chu-thich">🧩 Slide 32 thành sơ đồ lớp: truy cập nào từ Demo_1 biên dịch được</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 32 redrawn — two packages, one subclass, and the marks javac checks
package rectPkg {
  class Rectangle {
    # length : int
    + width : int
    --
    + setSize(l : int, w : int) : void
  }
}
package boxPkg {
  class Box {
    ~ height : int
    # price : int
    - weight : int
    --
    ~ setSize(l : int, w : int, h : int) : void
    ~ volume() : int
  }
  class Demo_1 {
    + {static} main(args : String[]) : void
  }
}
Box -up-|&gt; Rectangle
Demo_1 ..&gt; Box : b.height ✓  b.price ✓  b.weight ✗
Demo_1 ..&gt; Rectangle : r.width ✓  r.length ✗
@enduml</code></pre></details>
<p>Ảnh chụp được gõ lại và biên dịch trên JDK 8 — đúng hai dòng đỏ bị lỗi, bỏ chúng đi thì chương trình chạy:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("Chapter02");
    viet(prj, "rectPkg/Rectangle.java",
        "package rectPkg;\\n" +
        "public class Rectangle {\\n" +
        "    protected int length;\\n" +
        "    public int width;\\n" +
        "    public void setSize(int l, int w)\\n" +
        "    {   length = l&gt;0? l: 0;\\n" +
        "        width = w&gt;0? w: 0;\\n" +
        "    }\\n" +
        "}\\n");
    viet(prj, "boxPkg/Box.java",
        "package boxPkg;\\n" +
        "import rectPkg.Rectangle;\\n" +
        "public class Box extends Rectangle {\\n" +
        "    int height;\\n" +
        "    protected int price;\\n" +
        "    private int weight;\\n" +
        "    void setSize(int l, int w, int h)\\n" +
        "    {   super.setSize(l,w);\\n" +
        "        height = h&gt;0? h : 0;\\n" +
        "    }\\n" +
        "    int volume ()\\n" +
        "    {  return length*width*height;\\n" +
        "    }\\n" +
        "}\\n");
    String demo =
        "package boxPkg;\\n" +
        "import rectPkg.Rectangle;\\n" +
        "public class Demo_1 {\\n" +
        "    public static void main (String[] args)\\n" +
        "    { Box b = new Box();\\n" +
        "      b.setSize(1,2,3);\\n" +
        "      b.height=10;\\n" +
        "      b.price= 7;\\n" +
        "      b.weight=9;\\n" +
        "      System.out.println(\\"Volumn of the box:\\" + b.volume());\\n" +
        "      Rectangle r= new Rectangle();\\n" +
        "      r.setSize(3,5);\\n" +
        "      r.width=3;\\n" +
        "      r.length=6;\\n" +
        "    }\\n" +
        "}\\n";
    viet(prj, "boxPkg/Demo_1.java", demo);
    new File(prj, "classes").mkdirs();
    lenh(prj, "javac", "-d", "classes", "rectPkg/Rectangle.java", "boxPkg/Box.java", "boxPkg/Demo_1.java");
    // xoá hai dòng đỏ rồi build lại
    viet(prj, "boxPkg/Demo_1.java", demo.replace("      b.weight=9;\\n", "").replace("      r.length=6;\\n", ""));
    lenh(prj, "javac", "-d", "classes", "rectPkg/Rectangle.java", "boxPkg/Box.java", "boxPkg/Demo_1.java");
    lenh(prj, "java", "-cp", "classes", "boxPkg.Demo_1");
}</code></pre>
<div class="out">&gt; javac -d classes rectPkg/Rectangle.java boxPkg/Box.java boxPkg/Demo_1.java<br>
boxPkg/Demo_1.java:9: error: weight has private access in Box<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.weight=9;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
boxPkg/Demo_1.java:14: error: length has protected access in Rectangle<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r.length=6;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)<br>
&gt; javac -d classes rectPkg/Rectangle.java boxPkg/Box.java boxPkg/Demo_1.java<br>
&gt; java -cp classes boxPkg.Demo_1<br>
Volumn of the box:20</div>
<p>Từng dòng, đối chiếu bảng slide 31: <code>b.height</code> (default) và <code>b.price</code> (protected) — Demo_1 <strong>cùng package</strong> với Box ⇒ được; <code>b.weight</code> — private ⇒ chỉ trong Box; <code>r.width</code> — public; <code>r.length</code> — protected trong <code>rectPkg</code>, mà Demo_1 không cùng package đó cũng không phải lớp con ⇒ bị từ chối. Trong <code>Box.volume()</code>, <code>length*width*height</code> biên dịch được vì Box <em>là</em> lớp con dùng <code>length</code> nó thừa kế. Thể tích là 20 chứ không phải 6: <code>setSize(1,2,3)</code> cho height 3, rồi <code>b.height=10</code> ghi đè — một lần ghi thẳng vào trường đã bỏ qua phép kiểm <code>h&gt;0</code>, đúng lý do vì sao trường nên để private.</p>
<div class="pitfall">Ô ghi chú đỏ nói về constructor ("contructor" — gõ nhầm) nhưng code lại minh hoạ <code>super.setSize</code> trong một phương thức thường, nơi nó đứng ở đâu cũng được. Chỉ <code>super(...)</code> — gọi <em>constructor</em> cha — mới phải đứng đầu (javac: "call to super must be first statement in constructor"); Chương 4 học kỹ cùng với kế thừa.</div>`],
      [33, 'Demo: Methods with Arbitrary Number of Arguments',
        `<p class="y-chinh">🎯 <code>double sum(double... group)</code> and <code>String concate(String... group)</code> accept any number of arguments; inside the method the group is treated as an <strong>array</strong>: <code>group.length</code> is the number of elements, <code>group[i]</code> the element at position i. The slide's output: <code>21.68</code> and <code>I love you !</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 33: the slide's varargs program run for real — then three things the slide does not show
public class ArbitraryDemo {
    public double sum(double... group) {
        double S = 0;
        for (double x : group) S += x;
        return S;
    }
    public String concate(String... group) {
        String S = "";
        for (String x : group) S += x + " ";
        return S;
    }

    static String count(String label, int... nums) {          // varargs must be the LAST parameter, and only one per method
        return label + ": " + nums.length + " number(s)";
    }

    public static void main(String[] args) {
        ArbitraryDemo obj = new ArbitraryDemo();
        double total = obj.sum(5.4, 3.2, 9.08, 4);
        System.out.println(total);
        String line = obj.concate("I", "love", "you", "!");
        System.out.println(line);
        System.out.println("[" + line + "]  &lt;- the brackets show the extra space at the end");

        System.out.println(obj.sum());                          // zero arguments: group is an EMPTY array, not null
        System.out.println(obj.sum(new double[] {1, 2, 3}));    // an existing array can be passed directly
        System.out.println(count("scores", 7, 8, 9));
    }
}</code></pre>
<div class="out">21.68<br>
I love you !<br>
[I love you ! ] &nbsp;&lt;- the brackets show the extra space at the end<br>
0.0<br>
6.0<br>
scores: 3 number(s)</div>
<p>The first two lines match the slide. The bracket line shows a small bug of the slide's <code>concate</code>: it adds a space after <em>every</em> word, so the result ends with a space — invisible on screen, but a PE output comparison fails on it. (Fix: add the space <em>between</em> words, or <code>trim()</code> the result.)</p>
<table>
<thead><tr><th>Fact</th><th>Shown by</th></tr></thead>
<tbody>
<tr><td>zero arguments are allowed: the array is empty (length 0), never <code>null</code></td><td><code>obj.sum()</code> prints <code>0.0</code></td></tr>
<tr><td>an existing array can be passed directly</td><td><code>obj.sum(new double[] {1, 2, 3})</code></td></tr>
<tr><td>the varargs parameter must be the last one, and a method has at most one</td><td><code>count(String label, int... nums)</code></td></tr>
<tr><td><code>main(String[] args)</code> may also be written <code>main(String... args)</code></td><td>same type: <code>String[]</code></td></tr>
</tbody>
</table>
<p>The feature is called <strong>varargs</strong> (variable-arity parameters) and arrived in Java 5. You use it every day without noticing: <code>System.out.printf(String format, Object... args)</code> and <code>String.format</code> are varargs methods.</p>`,
        `<p class="y-chinh">🎯 <code>double sum(double... group)</code> và <code>String concate(String... group)</code> nhận bao nhiêu đối số cũng được; bên trong phương thức, nhóm đối số được xem là một <strong>mảng</strong>: <code>group.length</code> là số phần tử, <code>group[i]</code> là phần tử ở vị trí i. Output của slide: <code>21.68</code> và <code>I love you !</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 33: chương trình varargs của slide chạy thật — rồi ba điều slide không cho thấy
public class ArbitraryDemo {
    public double sum(double... group) {
        double S = 0;
        for (double x : group) S += x;
        return S;
    }
    public String concate(String... group) {
        String S = "";
        for (String x : group) S += x + " ";
        return S;
    }

    static String count(String label, int... nums) {          // varargs phải là tham số CUỐI, và mỗi phương thức chỉ một
        return label + ": " + nums.length + " number(s)";
    }

    public static void main(String[] args) {
        ArbitraryDemo obj = new ArbitraryDemo();
        double total = obj.sum(5.4, 3.2, 9.08, 4);
        System.out.println(total);
        String line = obj.concate("I", "love", "you", "!");
        System.out.println(line);
        System.out.println("[" + line + "]  &lt;- the brackets show the extra space at the end");

        System.out.println(obj.sum());                          // không đối số: group là mảng RỖNG, không phải null
        System.out.println(obj.sum(new double[] {1, 2, 3}));    // truyền thẳng được một mảng có sẵn
        System.out.println(count("scores", 7, 8, 9));
    }
}</code></pre>
<div class="out">21.68<br>
I love you !<br>
[I love you ! ] &nbsp;&lt;- the brackets show the extra space at the end<br>
0.0<br>
6.0<br>
scores: 3 number(s)</div>
<p>Hai dòng đầu khớp slide. Dòng có ngoặc vuông cho thấy một lỗi nhỏ của <code>concate</code> trên slide: nó thêm dấu cách sau <em>mọi</em> từ, nên kết quả kết thúc bằng một dấu cách — trên màn hình không thấy, nhưng phép so output của PE trượt vì nó. (Sửa: chỉ thêm dấu cách <em>giữa</em> các từ, hoặc <code>trim()</code> kết quả.)</p>
<table>
<thead><tr><th>Sự thật</th><th>Thấy ở</th></tr></thead>
<tbody>
<tr><td>được phép không có đối số nào: mảng rỗng (length 0), không bao giờ <code>null</code></td><td><code>obj.sum()</code> in <code>0.0</code></td></tr>
<tr><td>truyền thẳng được một mảng có sẵn</td><td><code>obj.sum(new double[] {1, 2, 3})</code></td></tr>
<tr><td>tham số varargs phải đứng cuối, và mỗi phương thức có tối đa một</td><td><code>count(String label, int... nums)</code></td></tr>
<tr><td><code>main(String[] args)</code> cũng viết được là <code>main(String... args)</code></td><td>cùng kiểu: <code>String[]</code></td></tr>
</tbody>
</table>
<p>Tính năng này tên là <strong>varargs</strong> (tham số số lượng thay đổi) và có từ Java 5. Bạn dùng nó hằng ngày mà không để ý: <code>System.out.printf(String format, Object... args)</code> và <code>String.format</code> đều là phương thức varargs.</p>`],
      [34, 'Case study',
        `<p class="y-chinh">🎯 The problem: <em>"A sports car can be one of a variety of colours, with an engine power between 100 HP and 200 HP. It can be a convertible or a regular model. The car has a button that starts the engine and a parking brake. When the parking brake is released and you press the accelerator, it drives in the direction determined by the transmission setting."</em></p>
<p>Before reading the next slides, apply slide 4 yourself — and notice that this statement contains <strong>rules</strong>, not just data:</p>
<table>
<thead><tr><th>Phrase in the statement</th><th>Kind</th><th>Becomes</th></tr></thead>
<tbody>
<tr><td>sports car</td><td>main noun</td><td>class <code>SportCar</code></td></tr>
<tr><td>colour; engine power; convertible or regular</td><td>describing nouns</td><td>fields <code>colour</code>, <code>enginePower</code>, <code>convertible</code></td></tr>
<tr><td><strong>between 100 HP and 200 HP</strong></td><td>a rule (boundary condition)</td><td>a check in the constructor</td></tr>
<tr><td>starts the engine; parking brake; transmission</td><td>more state</td><td>fields <code>engineOn</code>, <code>parkingBrakeOn</code>, <code>gear</code></td></tr>
<tr><td>press the button; press the accelerator; release the brake</td><td>verbs</td><td>methods</td></tr>
<tr><td><strong>when the brake is released and you press… it drives</strong></td><td>a rule about state</td><td>logic inside <code>pressAccelerator()</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Every PE statement has these two layers. Data alone gives you fields and getters; the rules are where the marks are — they become <code>if</code>s in constructors, setters and business methods.</p>`,
        `<p class="y-chinh">🎯 Đề bài: <em>"Một chiếc xe thể thao có thể mang một trong nhiều màu, công suất động cơ trong khoảng 100 HP đến 200 HP. Nó có thể là bản mui trần (convertible) hoặc bản thường. Xe có một nút bấm để nổ máy và một phanh tay. Khi đã nhả phanh tay mà bạn đạp ga, xe chạy theo hướng do vị trí hộp số quyết định."</em></p>
<p>Trước khi đọc các slide sau, hãy tự áp slide 4 — và để ý rằng đề bài này có cả <strong>luật</strong>, không chỉ có dữ liệu:</p>
<table>
<thead><tr><th>Cụm từ trong đề</th><th>Loại</th><th>Trở thành</th></tr></thead>
<tbody>
<tr><td>sports car (xe thể thao)</td><td>danh từ chính</td><td>lớp <code>SportCar</code></td></tr>
<tr><td>màu; công suất; mui trần hay thường</td><td>danh từ mô tả</td><td>trường <code>colour</code>, <code>enginePower</code>, <code>convertible</code></td></tr>
<tr><td><strong>từ 100 HP đến 200 HP</strong></td><td>một luật (điều kiện biên)</td><td>phép kiểm trong constructor</td></tr>
<tr><td>nổ máy; phanh tay; hộp số</td><td>thêm trạng thái</td><td>trường <code>engineOn</code>, <code>parkingBrakeOn</code>, <code>gear</code></td></tr>
<tr><td>bấm nút; đạp ga; nhả phanh</td><td>động từ</td><td>phương thức</td></tr>
<tr><td><strong>khi đã nhả phanh mà đạp ga thì xe chạy</strong></td><td>luật về trạng thái</td><td>logic bên trong <code>pressAccelerator()</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Đề PE nào cũng có hai lớp này. Dữ liệu chỉ cho bạn trường và getter; điểm nằm ở các luật — chúng thành những lệnh <code>if</code> trong constructor, setter và phương thức nghiệp vụ.</p>`],
      [35, 'Report — class design',
        `<p class="y-chinh">🎯 Class design from the problem description: main noun <strong>Car</strong>; auxiliary nouns <strong>Colour</strong> (text), <strong>Engine power</strong> (number of BHP), <strong>Convertible?</strong> (yes/no), <strong>Parking brake</strong> (on/off); verbs <strong>press the start button</strong>, <strong>press the accelerator</strong>.</p>
<p>Compare with the table of slide 34. The school's analysis captures the <em>data</em> correctly and chooses good types (text → <code>String</code>, number → <code>int</code>, yes/no and on/off → <code>boolean</code>). It drops three things the statement says:</p>
<ul>
<li>the <strong>100–200 HP rule</strong> — no column for constraints;</li>
<li>the <strong>engine state</strong> — "a button that starts the engine" means the car is either running or not;</li>
<li>the <strong>transmission setting</strong> — it decides the direction, so it is state too (the FU offline material simply ignores it).</li>
</ul>
<p>Add a third column, "rules", to this kind of report and you will not lose those points. The redesign on slide 39 keeps all three.</p>`,
        `<p class="y-chinh">🎯 Thiết kế lớp từ mô tả bài toán: danh từ chính <strong>Car</strong>; danh từ phụ <strong>Colour</strong> (chữ), <strong>Engine power</strong> (số mã lực BHP), <strong>Convertible?</strong> (có/không), <strong>Parking brake</strong> (bật/tắt); động từ <strong>bấm nút khởi động</strong>, <strong>đạp ga</strong>.</p>
<p>So với bảng ở slide 34. Phân tích của trường nắm đúng phần <em>dữ liệu</em> và chọn kiểu tốt (chữ → <code>String</code>, số → <code>int</code>, có/không và bật/tắt → <code>boolean</code>). Nó bỏ mất ba điều mà đề bài có nói:</p>
<ul>
<li><strong>luật 100–200 HP</strong> — không có cột nào cho ràng buộc;</li>
<li><strong>trạng thái động cơ</strong> — "một nút để nổ máy" nghĩa là xe đang nổ máy hoặc không;</li>
<li><strong>vị trí hộp số</strong> — nó quyết định hướng chạy, nên cũng là trạng thái (học liệu offline của FU bỏ qua luôn).</li>
</ul>
<p>Thêm cột thứ ba "luật" vào kiểu báo cáo này là bạn không mất mấy điểm đó. Bản thiết kế lại ở slide 39 giữ cả ba.</p>`],
      [36, 'Report — the Car class in UML',
        `<p class="y-chinh">🎯 A UML class diagram represents the Car class: private fields <code>- Colour: String, - EnginePower: int, - Convertible: boolean, - parkingBrake: boolean</code>; public members <code>+Car(), +Car(String, int, boolean, boolean), +pressStartButton(): void, +pressAcceleratorButton(): void, +getColour(): String, +setColour(String): void, …</code></p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/aa74516fcd29d0d7bcc670a50894adddd0e2bcd5.svg" alt="Slide 36 redrawn exactly (including the capitalised field names)" loading="lazy" /><p class="chu-thich">🧩 Slide 36 redrawn exactly (including the capitalised field names)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 36 — the case study's Car class, as drawn by the slide
class Car {
  - Colour : String
  - EnginePower : int
  - Convertible : boolean
  - parkingBrake : boolean
  --
  + Car()
  + Car(String, int, boolean, boolean)
  + pressStartButton() : void
  + pressAcceleratorButton() : void
  + getColour() : String
  + setColour(String) : void
  ...
}
note right of Car
  main noun: Car
  auxiliary nouns: colour, engine power,
  convertible?, parking brake
  verbs: press the start button,
  press the accelerator
end note
@enduml</code></pre></details>
<p>The visibility marks are right — <code>-</code> for every field, <code>+</code> for the interface — so this box is a correct encapsulation sketch. Two style problems: field names start with capitals (<code>Colour</code>, <code>EnginePower</code>), which in Java signals a <em>class</em> name, and the diagram ends with "…", which a PE never does — the paper lists every member and the marker tests every one.</p>
<p class="meo">🧠 In a PE, this box <em>is</em> the question. Copy it line by line into a checklist and tick each member as you write it; the most common lost mark is a forgotten <code>+Car()</code>.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ lớp UML biểu diễn lớp Car: các trường private <code>- Colour: String, - EnginePower: int, - Convertible: boolean, - parkingBrake: boolean</code>; các thành viên public <code>+Car(), +Car(String, int, boolean, boolean), +pressStartButton(): void, +pressAcceleratorButton(): void, +getColour(): String, +setColour(String): void, …</code></p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/aa74516fcd29d0d7bcc670a50894adddd0e2bcd5.svg" alt="Slide 36 vẽ lại đúng nguyên (kể cả tên trường viết hoa)" loading="lazy" /><p class="chu-thich">🧩 Slide 36 vẽ lại đúng nguyên (kể cả tên trường viết hoa)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 36 — the case study's Car class, as drawn by the slide
class Car {
  - Colour : String
  - EnginePower : int
  - Convertible : boolean
  - parkingBrake : boolean
  --
  + Car()
  + Car(String, int, boolean, boolean)
  + pressStartButton() : void
  + pressAcceleratorButton() : void
  + getColour() : String
  + setColour(String) : void
  ...
}
note right of Car
  main noun: Car
  auxiliary nouns: colour, engine power,
  convertible?, parking brake
  verbs: press the start button,
  press the accelerator
end note
@enduml</code></pre></details>
<p>Các dấu mức truy cập đều đúng — <code>-</code> cho mọi trường, <code>+</code> cho giao diện — nên hộp này là một phác thảo đóng gói đúng. Hai lỗi phong cách: tên trường bắt đầu bằng chữ hoa (<code>Colour</code>, <code>EnginePower</code>), mà trong Java chữ hoa đầu báo hiệu tên <em>lớp</em>; và sơ đồ kết thúc bằng "…", điều đề PE không bao giờ làm — đề liệt kê đủ mọi thành viên và máy chấm kiểm từng cái.</p>
<p class="meo">🧠 Trong PE, cái hộp này <em>chính là</em> đề bài. Chép từng dòng thành một danh sách kiểm và đánh dấu từng thành viên khi viết xong; điểm hay mất nhất là quên <code>+Car()</code>.</p>`],
      [37, 'Implement',
        `<p class="y-chinh">🎯 The implementation, part 1: <code>public class Car</code> with four private fields, the no-argument constructor setting <code>Colour=""; EnginePower=0; Convertible=false; parkingBrake=false;</code>, the four-parameter constructor using <code>this.X = X</code>, and <code>pressStartButton()</code> printing "You can press the star button".</p>
<p>The whole program of slides 37–39, typed exactly (one file, <code>main</code> inside <code>Car</code>), plus two lines of ours at the end:</p>
<pre><code class="language-java">// release: 8
// Slides 37–39: the case-study code exactly as on the slides (one file, main inside Car) — run for real
public class Car {
    //fields
    private String Colour;
    private int EnginePower;
    private boolean Convertible;
    private boolean parkingBrake;
    //methods
    public Car(){
        Colour="";
        EnginePower=0;
        Convertible=false;
        parkingBrake=false;
    }

    public Car(String Colour, int EnginePower, boolean Convertible, boolean parkingBrake) {
        this.Colour = Colour;
        this.EnginePower = EnginePower;
        this.Convertible = Convertible;
        this.parkingBrake = parkingBrake;
    }

    public void pressStartButton(){
        System.out.println("You can press the star button");
    }
    public void pressAcceleratorButton(){
        System.out.println("You can press the accelerator button");
        System.out.println("Colour:"+ Colour);
        System.out.println("Engine power:"+ EnginePower);
        System.out.println("Convertible:"+ Convertible);
        System.out.println("parking brake:"+ parkingBrake);
    }

    public void setColour(String Colour) {
        this.Colour = Colour;
    }

    public String getColour() {
        return Colour;
    }

    public int getEnginePower() {
        return EnginePower;
    }

    public void setEnginePower(int EnginePower) {
        this.EnginePower = EnginePower;
    }

    public boolean isConvertible() {
        return Convertible;
    }

    public void setConvertible(boolean Convertible) {
        this.Convertible = Convertible;
    }

    public boolean isParkingBrake() {
        return parkingBrake;
    }

    public void setParkingBrake(boolean parkingBrake) {
        this.parkingBrake = parkingBrake;
    }

    public static void main(String[] args) {
        Car c=new Car();
        c.pressStartButton();
        c.pressAcceleratorButton();

        Car c2=new Car();
        c2.pressAcceleratorButton();

        Car c3=new Car("red", 100, true, true);
        c3.pressAcceleratorButton();
        c3.setColour("black");
        System.out.println("Colour of c3:" + c3.getColour());

        Car c4=new Car("blue", 900, false, false);   // added: nothing stops an impossible engine
        c4.setEnginePower(-5);
        System.out.println("Engine power of c4:" + c4.getEnginePower());
    }
}</code></pre>
<div class="out">You can press the star button<br>
You can press the accelerator button<br>
Colour:<br>
Engine power:0<br>
Convertible:false<br>
parking brake:false<br>
You can press the accelerator button<br>
Colour:<br>
Engine power:0<br>
Convertible:false<br>
parking brake:false<br>
You can press the accelerator button<br>
Colour:red<br>
Engine power:100<br>
Convertible:true<br>
parking brake:true<br>
Colour of c3:black<br>
Engine power of c4:-5</div>
<p>It compiles and prints what the FU material shows. Look at what the encapsulation actually protects, though: the fields are private, yet <code>new Car("blue", 900, false, false)</code> and <code>setEnginePower(-5)</code> are both accepted — the last line prints <code>-5</code>. Private fields with setters that check nothing guard the <em>syntax</em>, not the <em>rules</em>.</p>
<div class="pitfall">Two more details: "star button" is a typo for "start button" (if a PE asked for that exact text you would have to copy the typo!), and the no-argument constructor creates a car with <code>EnginePower=0</code> — a car the problem statement says cannot exist.</div>`,
        `<p class="y-chinh">🎯 Phần cài đặt, phần 1: <code>public class Car</code> với bốn trường private, constructor không tham số gán <code>Colour=""; EnginePower=0; Convertible=false; parkingBrake=false;</code>, constructor bốn tham số dùng <code>this.X = X</code>, và <code>pressStartButton()</code> in "You can press the star button".</p>
<p>Toàn bộ chương trình của slide 37–39, gõ đúng nguyên (một file, <code>main</code> nằm trong <code>Car</code>), cộng hai dòng của chúng ta ở cuối:</p>
<pre><code class="language-java">// release: 8
// Slide 37–39: code case study đúng nguyên như trên slide (một file, main nằm trong Car) — chạy thật
public class Car {
    //fields
    private String Colour;
    private int EnginePower;
    private boolean Convertible;
    private boolean parkingBrake;
    //methods
    public Car(){
        Colour="";
        EnginePower=0;
        Convertible=false;
        parkingBrake=false;
    }

    public Car(String Colour, int EnginePower, boolean Convertible, boolean parkingBrake) {
        this.Colour = Colour;
        this.EnginePower = EnginePower;
        this.Convertible = Convertible;
        this.parkingBrake = parkingBrake;
    }

    public void pressStartButton(){
        System.out.println("You can press the star button");
    }
    public void pressAcceleratorButton(){
        System.out.println("You can press the accelerator button");
        System.out.println("Colour:"+ Colour);
        System.out.println("Engine power:"+ EnginePower);
        System.out.println("Convertible:"+ Convertible);
        System.out.println("parking brake:"+ parkingBrake);
    }

    public void setColour(String Colour) {
        this.Colour = Colour;
    }

    public String getColour() {
        return Colour;
    }

    public int getEnginePower() {
        return EnginePower;
    }

    public void setEnginePower(int EnginePower) {
        this.EnginePower = EnginePower;
    }

    public boolean isConvertible() {
        return Convertible;
    }

    public void setConvertible(boolean Convertible) {
        this.Convertible = Convertible;
    }

    public boolean isParkingBrake() {
        return parkingBrake;
    }

    public void setParkingBrake(boolean parkingBrake) {
        this.parkingBrake = parkingBrake;
    }

    public static void main(String[] args) {
        Car c=new Car();
        c.pressStartButton();
        c.pressAcceleratorButton();

        Car c2=new Car();
        c2.pressAcceleratorButton();

        Car c3=new Car("red", 100, true, true);
        c3.pressAcceleratorButton();
        c3.setColour("black");
        System.out.println("Colour of c3:" + c3.getColour());

        Car c4=new Car("blue", 900, false, false);   // thêm vào: không gì chặn một động cơ vô lý
        c4.setEnginePower(-5);
        System.out.println("Engine power of c4:" + c4.getEnginePower());
    }
}</code></pre>
<div class="out">You can press the star button<br>
You can press the accelerator button<br>
Colour:<br>
Engine power:0<br>
Convertible:false<br>
parking brake:false<br>
You can press the accelerator button<br>
Colour:<br>
Engine power:0<br>
Convertible:false<br>
parking brake:false<br>
You can press the accelerator button<br>
Colour:red<br>
Engine power:100<br>
Convertible:true<br>
parking brake:true<br>
Colour of c3:black<br>
Engine power of c4:-5</div>
<p>Nó biên dịch và in đúng như học liệu FU. Nhưng hãy xem việc đóng gói thật ra bảo vệ được gì: các trường private, vậy mà <code>new Car("blue", 900, false, false)</code> và <code>setEnginePower(-5)</code> đều được nhận — dòng cuối in <code>-5</code>. Trường private cộng setter không kiểm gì thì chỉ canh được <em>cú pháp</em>, không canh được <em>luật</em>.</p>
<div class="pitfall">Thêm hai chi tiết: "star button" là gõ nhầm của "start button" (nếu đề PE đòi đúng chuỗi đó thì bạn phải chép cả lỗi gõ!), và constructor không tham số tạo ra một chiếc xe có <code>EnginePower=0</code> — chiếc xe mà đề bài nói là không thể tồn tại.</div>`],
      [38, 'Implement',
        `<p class="y-chinh">🎯 Part 2: <code>pressAcceleratorButton()</code> prints "You can press the accelerator button" followed by the colour, engine power, convertible flag and parking-brake state; then the getters/setters for <code>Colour</code>, <code>EnginePower</code> and <code>Convertible</code> (<code>isConvertible()</code> for the boolean).</p>
<p>Compare the method with the problem statement: "when the parking brake is <em>released</em> and you press the accelerator, it drives". The slide's <code>pressAcceleratorButton()</code> ignores the brake completely — the car with <code>parking brake:true</code> (c3 in the output) "accelerates" exactly like the others — and never drives anywhere; it only prints the fields. That is a <code>toString()</code> wearing the name of a behaviour.</p>
<table>
<thead><tr><th>Method on the slide</th><th>What the name promises</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><code>pressStartButton()</code></td><td>start the engine</td><td>prints a sentence; no state changes</td></tr>
<tr><td><code>pressAcceleratorButton()</code></td><td>drive, if the brake is released</td><td>prints the four fields</td></tr>
<tr><td><code>setEnginePower(int)</code></td><td>change the power within 100–200</td><td>accepts any int</td></tr>
</tbody>
</table>
<p class="meo">🧠 Test every method name against the statement with the question "what state changes when I call this?" If the answer is "nothing", either the method is a getter/printer or something is missing.</p>`,
        `<p class="y-chinh">🎯 Phần 2: <code>pressAcceleratorButton()</code> in "You can press the accelerator button" rồi tới màu, công suất, cờ mui trần và trạng thái phanh tay; sau đó là getter/setter cho <code>Colour</code>, <code>EnginePower</code> và <code>Convertible</code> (<code>isConvertible()</code> cho kiểu boolean).</p>
<p>So phương thức với đề bài: "khi phanh tay đã được <em>nhả</em> mà bạn đạp ga thì xe chạy". <code>pressAcceleratorButton()</code> của slide bỏ qua hoàn toàn phanh tay — chiếc xe có <code>parking brake:true</code> (c3 trong output) vẫn "tăng tốc" y như các xe khác — và chẳng chạy đi đâu cả; nó chỉ in các trường. Đó là một <code>toString()</code> khoác tên của một hành vi.</p>
<table>
<thead><tr><th>Phương thức trên slide</th><th>Cái tên hứa gì</th><th>Nó làm gì</th></tr></thead>
<tbody>
<tr><td><code>pressStartButton()</code></td><td>nổ máy</td><td>in một câu; không trạng thái nào đổi</td></tr>
<tr><td><code>pressAcceleratorButton()</code></td><td>chạy xe, nếu đã nhả phanh</td><td>in bốn trường</td></tr>
<tr><td><code>setEnginePower(int)</code></td><td>đổi công suất trong khoảng 100–200</td><td>nhận mọi số int</td></tr>
</tbody>
</table>
<p class="meo">🧠 Thử mọi tên phương thức với đề bài bằng câu hỏi "gọi cái này thì trạng thái nào đổi?" Nếu câu trả lời là "không gì cả", thì hoặc nó là getter/hàm in, hoặc đang thiếu thứ gì đó.</p>`],
      [39, 'Implement',
        `<p class="y-chinh">🎯 Part 3: <code>isParkingBrake()</code> / <code>setParkingBrake(boolean)</code>, and <code>main</code>: <code>c</code> and <code>c2</code> made with <code>new Car()</code> and "accelerated", <code>c3 = new Car("red", 100, true, true)</code>, then <code>c3.setColour("black")</code> and the colour printed.</p>
<p>Now the redesign. Same problem statement, same verbs, but the class keeps every rule of slide 34 itself: the constructor rejects power outside 100–200 HP, power and convertible have <strong>no setters</strong> (a car does not change its engine through a setter), the engine and the brake are real state, and <code>pressAccelerator()</code> applies the statement's rule in one place:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/63478bf03c41ad6203ae637fd8f29a8db2c6fd18.svg" alt="The redesigned SportCar: state + rules inside, a small public interface" loading="lazy" /><p class="chu-thich">🧩 The redesigned SportCar: state + rules inside, a small public interface</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 34–39 redesigned — SportCar keeps the rules of the problem inside the class
class SportCar {
  + {static} MIN_POWER : int = 100
  + {static} MAX_POWER : int = 200
  - colour : String
  - enginePower : int {readOnly}
  - convertible : boolean {readOnly}
  - engineOn : boolean = false
  - parkingBrakeOn : boolean = true
  - gear : char = 'P'
  --
  + SportCar(colour : String, enginePower : int, convertible : boolean)
  + pressStartButton() : void
  + releaseParkingBrake() : void
  + pullParkingBrake() : void
  + setGear(g : char) : boolean
  + pressAccelerator() : String
  + getColour() : String
  + setColour(colour : String) : void
  + getEnginePower() : int
  + isConvertible() : boolean
  + toString() : String
}
note right of SportCar
  constructor rejects power outside 100–200
  no setter for enginePower / convertible
  pressAccelerator() checks: engine on,
  brake released, gear D or R
end note
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slides 34–39 redesigned: the same problem, but the class keeps its own rules — power 100–200 HP, the engine must be started, the parking brake must be released
class SportCar {
    public static final int MIN_POWER = 100, MAX_POWER = 200;

    private String colour;                   // camelCase field names (Java convention)
    private final int enginePower;           // fixed when the car is built: no setter at all
    private final boolean convertible;
    private boolean engineOn = false;        // state the slide's design forgot
    private boolean parkingBrakeOn = true;   // a parked car has the brake on
    private char gear = 'P';                 // transmission: P, D (drive) or R (reverse)

    public SportCar(String colour, int enginePower, boolean convertible) {
        if (enginePower &lt; MIN_POWER || enginePower &gt; MAX_POWER)
            throw new IllegalArgumentException("engine power must be 100-200 HP, got " + enginePower);
        setColour(colour);
        this.enginePower = enginePower;
        this.convertible = convertible;
    }

    public void pressStartButton()   { engineOn = !engineOn; }          // the button starts AND stops the engine
    public void releaseParkingBrake() { parkingBrakeOn = false; }
    public void pullParkingBrake()    { parkingBrakeOn = true; }
    public boolean setGear(char g) {
        if (g != 'P' &amp;&amp; g != 'D' &amp;&amp; g != 'R') return false;
        gear = g;
        return true;
    }

    public String pressAccelerator() {        // the rule of the problem statement, in ONE place
        if (!engineOn) return "nothing happens: the engine is off";
        if (parkingBrakeOn) return "nothing happens: the parking brake is on";
        if (gear == 'P') return "engine roars, car stays: gear is P";
        return "drives " + (gear == 'D' ? "forward" : "backward");
    }

    public String getColour() { return colour; }
    public void setColour(String colour) {
        if (colour == null || colour.trim().isEmpty()) throw new IllegalArgumentException("colour is required");
        this.colour = colour.trim();
    }
    public int getEnginePower() { return enginePower; }
    public boolean isConvertible() { return convertible; }

    @Override
    public String toString() {
        return colour + " " + (convertible ? "convertible" : "regular") + ", " + enginePower + " HP, engine " + (engineOn ? "on" : "off") + ", gear " + gear;
    }
}

public class SportCarDemo {
    public static void main(String[] args) {
        SportCar car = new SportCar("red", 150, true);
        System.out.println(car);
        System.out.println("1. " + car.pressAccelerator());
        car.pressStartButton();
        System.out.println("2. " + car.pressAccelerator());
        car.releaseParkingBrake();
        System.out.println("3. " + car.pressAccelerator());
        car.setGear('D');
        System.out.println("4. " + car.pressAccelerator());
        System.out.println(car);
        try {
            new SportCar("blue", 900, false);
        } catch (IllegalArgumentException e) {
            System.out.println("new SportCar(\\"blue\\", 900, false) -&gt; rejected: " + e.getMessage());
        }
    }
}</code></pre>
<div class="out">red convertible, 150 HP, engine off, gear P<br>
1. nothing happens: the engine is off<br>
2. nothing happens: the parking brake is on<br>
3. engine roars, car stays: gear is P<br>
4. drives forward<br>
red convertible, 150 HP, engine on, gear D<br>
new SportCar("blue", 900, false) -&gt; rejected: engine power must be 100-200 HP, got 900</div>
<p>Read the four numbered lines as the problem statement coming to life: engine off ⇒ nothing; engine on but brake pulled ⇒ nothing; brake released in P ⇒ the engine roars but the car stays; gear D ⇒ it drives forward. And the impossible car is refused at birth. (The <code>throw new IllegalArgumentException</code> is Chapter 6; here read it as "the constructor refuses".)</p>
<div class="callout">🧭 <strong>Go further — LAB211, Spring Boot</strong>: this "rules inside the class" style is called a <em>rich domain model</em>. In LAB211 it means validation lives in the entity, not scattered in the menu code; in Spring Boot the same entity rules are often expressed with Bean Validation (<code>@Min(100) @Max(200)</code>) — but the idea is exactly this slide.</div>`,
        `<p class="y-chinh">🎯 Phần 3: <code>isParkingBrake()</code> / <code>setParkingBrake(boolean)</code>, và <code>main</code>: <code>c</code> và <code>c2</code> tạo bằng <code>new Car()</code> rồi "đạp ga", <code>c3 = new Car("red", 100, true, true)</code>, rồi <code>c3.setColour("black")</code> và in màu.</p>
<p>Giờ là bản thiết kế lại. Cùng đề bài, cùng các động từ, nhưng lớp tự giữ mọi luật của slide 34: constructor từ chối công suất ngoài 100–200 HP, công suất và mui trần <strong>không có setter</strong> (xe không đổi động cơ bằng một setter), động cơ và phanh tay là trạng thái thật, và <code>pressAccelerator()</code> áp luật của đề bài ở một chỗ duy nhất:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/63478bf03c41ad6203ae637fd8f29a8db2c6fd18.svg" alt="SportCar thiết kế lại: trạng thái + luật ở bên trong, giao diện public nhỏ" loading="lazy" /><p class="chu-thich">🧩 SportCar thiết kế lại: trạng thái + luật ở bên trong, giao diện public nhỏ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 34–39 redesigned — SportCar keeps the rules of the problem inside the class
class SportCar {
  + {static} MIN_POWER : int = 100
  + {static} MAX_POWER : int = 200
  - colour : String
  - enginePower : int {readOnly}
  - convertible : boolean {readOnly}
  - engineOn : boolean = false
  - parkingBrakeOn : boolean = true
  - gear : char = 'P'
  --
  + SportCar(colour : String, enginePower : int, convertible : boolean)
  + pressStartButton() : void
  + releaseParkingBrake() : void
  + pullParkingBrake() : void
  + setGear(g : char) : boolean
  + pressAccelerator() : String
  + getColour() : String
  + setColour(colour : String) : void
  + getEnginePower() : int
  + isConvertible() : boolean
  + toString() : String
}
note right of SportCar
  constructor rejects power outside 100–200
  no setter for enginePower / convertible
  pressAccelerator() checks: engine on,
  brake released, gear D or R
end note
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Slide 34–39 thiết kế lại: cùng đề bài, nhưng lớp tự giữ luật của nó — công suất 100–200 HP, phải nổ máy, phải nhả phanh tay
class SportCar {
    public static final int MIN_POWER = 100, MAX_POWER = 200;

    private String colour;                   // tên trường camelCase (quy ước Java)
    private final int enginePower;           // cố định khi xe được làm ra: không có setter
    private final boolean convertible;
    private boolean engineOn = false;        // trạng thái mà thiết kế của slide bỏ quên
    private boolean parkingBrakeOn = true;   // xe đang đỗ thì phanh tay đang kéo
    private char gear = 'P';                 // hộp số: P, D (tiến) hoặc R (lùi)

    public SportCar(String colour, int enginePower, boolean convertible) {
        if (enginePower &lt; MIN_POWER || enginePower &gt; MAX_POWER)
            throw new IllegalArgumentException("engine power must be 100-200 HP, got " + enginePower);
        setColour(colour);
        this.enginePower = enginePower;
        this.convertible = convertible;
    }

    public void pressStartButton()   { engineOn = !engineOn; }          // nút bấm vừa nổ vừa tắt máy
    public void releaseParkingBrake() { parkingBrakeOn = false; }
    public void pullParkingBrake()    { parkingBrakeOn = true; }
    public boolean setGear(char g) {
        if (g != 'P' &amp;&amp; g != 'D' &amp;&amp; g != 'R') return false;
        gear = g;
        return true;
    }

    public String pressAccelerator() {        // luật của đề bài, nằm ở MỘT chỗ
        if (!engineOn) return "nothing happens: the engine is off";
        if (parkingBrakeOn) return "nothing happens: the parking brake is on";
        if (gear == 'P') return "engine roars, car stays: gear is P";
        return "drives " + (gear == 'D' ? "forward" : "backward");
    }

    public String getColour() { return colour; }
    public void setColour(String colour) {
        if (colour == null || colour.trim().isEmpty()) throw new IllegalArgumentException("colour is required");
        this.colour = colour.trim();
    }
    public int getEnginePower() { return enginePower; }
    public boolean isConvertible() { return convertible; }

    @Override
    public String toString() {
        return colour + " " + (convertible ? "convertible" : "regular") + ", " + enginePower + " HP, engine " + (engineOn ? "on" : "off") + ", gear " + gear;
    }
}

public class SportCarDemo {
    public static void main(String[] args) {
        SportCar car = new SportCar("red", 150, true);
        System.out.println(car);
        System.out.println("1. " + car.pressAccelerator());
        car.pressStartButton();
        System.out.println("2. " + car.pressAccelerator());
        car.releaseParkingBrake();
        System.out.println("3. " + car.pressAccelerator());
        car.setGear('D');
        System.out.println("4. " + car.pressAccelerator());
        System.out.println(car);
        try {
            new SportCar("blue", 900, false);
        } catch (IllegalArgumentException e) {
            System.out.println("new SportCar(\\"blue\\", 900, false) -&gt; rejected: " + e.getMessage());
        }
    }
}</code></pre>
<div class="out">red convertible, 150 HP, engine off, gear P<br>
1. nothing happens: the engine is off<br>
2. nothing happens: the parking brake is on<br>
3. engine roars, car stays: gear is P<br>
4. drives forward<br>
red convertible, 150 HP, engine on, gear D<br>
new SportCar("blue", 900, false) -&gt; rejected: engine power must be 100-200 HP, got 900</div>
<p>Đọc bốn dòng đánh số như đề bài đang sống dậy: tắt máy ⇒ không gì xảy ra; nổ máy nhưng còn kéo phanh ⇒ không gì; nhả phanh ở số P ⇒ máy gầm nhưng xe đứng yên; số D ⇒ xe chạy tới. Còn chiếc xe vô lý bị từ chối ngay lúc sinh ra. (Lệnh <code>throw new IllegalArgumentException</code> thuộc Chương 6; ở đây hãy đọc là "constructor từ chối".)</p>
<div class="callout">🧭 <strong>Đi tiếp — LAB211, Spring Boot</strong>: lối viết "luật nằm trong lớp" này gọi là <em>mô hình miền giàu (rich domain model)</em>. Ở LAB211 nó nghĩa là phần kiểm tra dữ liệu nằm trong lớp thực thể, không rải rác trong code menu; ở Spring Boot cùng các luật đó thường được viết bằng Bean Validation (<code>@Min(100) @Max(200)</code>) — nhưng ý tưởng chính là slide này.</div>`],
      [40, 'Summary',
        `<p class="y-chinh">🎯 The deck's summary: the anatomy of a class and how to declare fields, methods and constructors; class-design hints (main noun → class, descriptive nouns → fields, methods = constructors, getters, setters, normal methods); creating and using objects; instantiate with an appropriate constructor; use the dot operator to reach an object's instance variables and methods.</p>
<table>
<thead><tr><th>Idea</th><th>One line</th><th>Where it ran</th></tr></thead>
<tbody>
<tr><td>find the class</td><td>main noun → class, describing nouns → fields, verbs → methods</td><td>2.B slide 4, 3.A slide 34</td></tr>
<tr><td>design rules</td><td>low coupling, high cohesion</td><td>2.B slides 6–7</td></tr>
<tr><td>constructors</td><td>same name, no return type; free one only if you write none</td><td>2.B slide 9, 2.C slides 20–24</td></tr>
<tr><td><code>this</code></td><td>the current object; solves field/parameter shadowing</td><td>2.B slide 11</td></tr>
<tr><td>getters/setters</td><td>the only doors to private data — and they must check</td><td>2.B slide 14, 3.A slide 39</td></tr>
<tr><td>passing arguments</td><td>always by value; for objects the value is a reference</td><td>2.C slide 16</td></tr>
<tr><td>packages</td><td>namespace + folder; run with <code>java pkg.Class</code></td><td>3.A slides 26–28</td></tr>
<tr><td>access levels</td><td><code>public &gt; protected &gt; default &gt; private</code>, checked by javac</td><td>3.A slides 31–32</td></tr>
</tbody>
</table>
<p>Missing from the slide's summary but central to Chapter 3: the access modifiers are what turn "please use the methods" into a compiler-enforced rule. Next: the 🧪 practice of Chapter 3 and the rewritten Chapter 3 quiz; inheritance (Chapter 4) builds on <code>protected</code> and <code>super</code> from slides 31–32.</p>`,
        `<p class="y-chinh">🎯 Phần tóm tắt của bộ slide: cấu tạo của một lớp và cách khai báo trường, phương thức, constructor; gợi ý thiết kế lớp (danh từ chính → lớp, danh từ mô tả → trường, phương thức = constructor, getter, setter, phương thức thường); tạo và dùng đối tượng; tạo thể hiện bằng constructor phù hợp; dùng toán tử dấu chấm để tới biến thể hiện và phương thức của đối tượng.</p>
<table>
<thead><tr><th>Ý</th><th>Một dòng</th><th>Đã chạy ở đâu</th></tr></thead>
<tbody>
<tr><td>tìm lớp</td><td>danh từ chính → lớp, danh từ mô tả → trường, động từ → phương thức</td><td>2.B slide 4, 3.A slide 34</td></tr>
<tr><td>luật thiết kế</td><td>liên kết thấp, kết dính cao</td><td>2.B slide 6–7</td></tr>
<tr><td>constructor</td><td>cùng tên, không kiểu trả về; có cái miễn phí chỉ khi không viết cái nào</td><td>2.B slide 9, 2.C slide 20–24</td></tr>
<tr><td><code>this</code></td><td>đối tượng hiện tại; gỡ chuyện tham số che trường</td><td>2.B slide 11</td></tr>
<tr><td>getter/setter</td><td>cửa duy nhất vào dữ liệu private — và phải kiểm tra</td><td>2.B slide 14, 3.A slide 39</td></tr>
<tr><td>truyền tham số</td><td>luôn theo giá trị; với đối tượng giá trị là tham chiếu</td><td>2.C slide 16</td></tr>
<tr><td>package</td><td>không gian tên + thư mục; chạy bằng <code>java pkg.Class</code></td><td>3.A slide 26–28</td></tr>
<tr><td>mức truy cập</td><td><code>public &gt; protected &gt; default &gt; private</code>, javac kiểm</td><td>3.A slide 31–32</td></tr>
</tbody>
</table>
<p>Phần tóm tắt của slide thiếu một ý mà Chương 3 xoay quanh: access modifier là thứ biến lời nhắn "hãy dùng phương thức" thành luật do trình biên dịch canh giữ. Tiếp theo: bài 🧪 thực hành Chương 3 và quiz Chương 3 đã viết lại; kế thừa (Chương 4) xây trên <code>protected</code> và <code>super</code> ở slide 31–32.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>You are in folder <code>build/classes/shop</code> and <code>java Main</code> fails for a class declared <code>package shop;</code>. Give two commands that work.</li>
<li>Class <code>b.Child extends a.A</code>. Inside Child, which of <code>this.pro</code>, <code>new a.A().pro</code>, <code>this.def</code> compile, if <code>pro</code> is protected and <code>def</code> default?</li>
<li>Write <code>static int max(int first, int... rest)</code>. Why is the first parameter separate?</li>
<li>List three rules of the SportCar statement and the line of code that enforces each.</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Bạn đang ở thư mục <code>build/classes/shop</code> và <code>java Main</code> hỏng với một lớp khai báo <code>package shop;</code>. Cho hai lệnh chạy được.</li>
<li>Lớp <code>b.Child extends a.A</code>. Trong Child, cái nào trong <code>this.pro</code>, <code>new a.A().pro</code>, <code>this.def</code> biên dịch được, nếu <code>pro</code> là protected và <code>def</code> là default?</li>
<li>Viết <code>static int max(int first, int... rest)</code>. Vì sao tham số đầu tiên tách riêng?</li>
<li>Kể ba luật của đề bài SportCar và dòng code canh giữ từng luật.</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 4.7 "Packages" (class importation, adding a class into a package, package access) and the "Protected Access" section of Ch. 5 "Inheritance"', 'Chương 4.7 "Packages" (import lớp, đặt lớp vào package, truy cập package) và mục "Protected Access" của Chương 5 "Inheritance"'],
      ['jls8', '§6.6 "Access Control" (6.6.2 Details on protected Access), §7.4 "Package Declarations", §8.4.1 (variable arity parameters)', 'mục 6.6 "Access Control" (6.6.2 chi tiết về protected), 7.4 "Package Declarations", 8.4.1 (tham số số lượng thay đổi)'],
      ['javaTutorial', '"Controlling Access to Members of a Class", "Creating and Using Packages", "Arbitrary Number of Arguments"', '"Controlling Access to Members of a Class", "Creating and Using Packages", "Arbitrary Number of Arguments"'],
      ['fuOffline', 'part "Encapsulation" — Package, Access modifier, the Car case study', 'phần "Encapsulation" — Package, Access modifier, case study Car'],
    ]),
  ].join('\n'),
};

/* ───────── 3.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Encapsulation for real: access, packages, jars, varargs ───────── */
const L_on_ch3 = {
  title: '3.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Encapsulation for real: access, packages, jars, varargs|||3.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Đóng gói làm thật: truy cập, package, jar, varargs',
  slug: 'pro192-on-ch3',
  type: 'VIDEO',
  description: '6 bài tập Chương 3 có lời giải chạy thật trên JDK 8: lớp tài khoản ngân hàng kiểu câu PE không có setter cho số dư, đoán 8 câu lệnh câu nào biên dịch được rồi để javac 8 trả lời, dựng project hai package và đóng file jar chạy được như bài nộp PE, ba tiện ích varargs kèm trường hợp biên, getter làm rò rỉ danh sách bên trong và cách sửa bằng danh sách chỉ đọc hoặc bản sao, thiết kế lớp bãi đỗ xe từ đề bài; 14 thuật ngữ Anh–Việt; tóm tắt 7 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.2 · Practice &amp; review</span>
<h2>Six exercises: make the compiler, not good intentions, protect your data</h2>
<p class="lead">Chapter 3 is the "hiding" half of encapsulation: packages decide who is near whom, access modifiers decide who may touch what, and a well-designed public interface decides which changes are possible at all. These exercises check each layer — and two of them show how data still leaks out of a class whose fields are all <code>private</code>. Every solution was compiled for Java 8 and run on a real JDK 8.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>1</td><td>a PE class where the important field has <strong>no</strong> setter</td><td>3.A slides 34–39</td></tr>
<tr><td>2</td><td>predict javac's access errors</td><td>3.A slides 29–32</td></tr>
<tr><td>3</td><td>packages on disk, running them, building the PE jar</td><td>3.A slides 26–28</td></tr>
<tr><td>4</td><td>varargs with their edge cases</td><td>3.A slide 33</td></tr>
<tr><td>5</td><td>a getter that leaks the inside, and two fixes</td><td>3.A slides 31, 39</td></tr>
<tr><td>6</td><td>from a statement to an encapsulated class</td><td>3.A slides 34–39</td></tr>
</tbody>
</table>
<p>PE papers with this shape: the <a href="/exam?course=PRO192">Exam Room (PRO192)</a> — PE9 (FA25) even writes "return an unmodifiable or copied list", which is exercise 5.</p>`,
    `<span class="eyebrow">Chương 3 · Bài 3.2 · Thực hành &amp; ôn tập</span>
<h2>Sáu bài tập: để trình biên dịch, chứ không phải thiện chí, bảo vệ dữ liệu của bạn</h2>
<p class="lead">Chương 3 là nửa "che giấu" của đóng gói: package quyết định ai gần ai, access modifier quyết định ai được đụng vào cái gì, và một giao diện public thiết kế tốt quyết định thay đổi nào là có thể xảy ra. Các bài tập kiểm từng lớp đó — và hai bài cho thấy dữ liệu vẫn rò ra khỏi một lớp có mọi trường đều <code>private</code>. Lời giải nào cũng đã biên dịch cho Java 8 và chạy trên JDK 8 thật.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Bài học</th></tr></thead>
<tbody>
<tr><td>1</td><td>lớp đề PE mà trường quan trọng <strong>không có</strong> setter</td><td>3.A slide 34–39</td></tr>
<tr><td>2</td><td>đoán lỗi truy cập của javac</td><td>3.A slide 29–32</td></tr>
<tr><td>3</td><td>package trên ổ đĩa, chạy chúng, đóng jar cho bài PE</td><td>3.A slide 26–28</td></tr>
<tr><td>4</td><td>varargs và các trường hợp biên</td><td>3.A slide 33</td></tr>
<tr><td>5</td><td>getter làm rò ruột lớp, và hai cách sửa</td><td>3.A slide 31, 39</td></tr>
<tr><td>6</td><td>từ đề bài tới một lớp đóng gói tốt</td><td>3.A slide 34–39</td></tr>
</tbody>
</table>
<p>Các đề PE có dạng này: <a href="/exam?course=PRO192">Exam Room (PRO192)</a> — đề PE9 (FA25) còn ghi thẳng "return an unmodifiable or copied list" (trả về danh sách chỉ đọc hoặc bản sao), chính là bài 5.</p>`),
    bi(`<h3>🧪 Exercise 1 — PE question: BankAccount (~20 min)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2eba69ad85ce421aafb1296498594acef27d8dc5.svg" alt="The diagram: notice the members that are NOT there" loading="lazy" /><p class="chu-thich">🧩 The diagram: notice the members that are NOT there</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — BankAccount: which members exist, and which deliberately do not
class BankAccount {
  - accountNo : String {readOnly}
  - owner : String
  - balance : double
  --
  + BankAccount(accountNo : String, owner : String, openingBalance : double)
  + getAccountNo() : String
  + getOwner() : String
  + setOwner(owner : String) : void
  + getBalance() : double
  + deposit(amount : double) : boolean
  + withdraw(amount : double) : boolean
  + toString() : String
}
note right of BankAccount
  no setAccountNo(), no setBalance():
  the balance changes ONLY through
  deposit() and withdraw(), which check
  amount &gt; 0 and amount &lt;= balance
end note
@enduml</code></pre></details>
<ul>
<li>The constructor stores a negative opening balance as 0. <code>setOwner</code> ignores a blank name.</li>
<li><code>deposit(amount)</code> — only if <code>amount &gt; 0</code>; returns whether it happened.</li>
<li><code>withdraw(amount)</code> — only if <code>amount &gt; 0</code> and <code>amount &lt;= balance</code>; returns whether it happened.</li>
<li><code>toString()</code> — <code>accountNo-owner-balance</code>, balance with 2 decimals.</li>
</ul>
<p class="dap-an">✅ Solution and five real test cases (TC1 deposit 50 and −5, TC2 withdraw 100 and 100.01 from 100, TC3 opening balance −20 and a blank owner):</p>
<pre class="trich"><code class="language-java">class BankAccount {
    private final String accountNo;          // fixed at creation: getter only
    private String owner;
    private double balance;                  // NO setter: only deposit/withdraw may change it

    public BankAccount(String accountNo, String owner, double openingBalance) {
        this.accountNo = accountNo;
        this.owner = owner;
        this.balance = openingBalance &gt; 0 ? openingBalance : 0;
    }

    public String getAccountNo() { return accountNo; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { if (owner != null &amp;&amp; !owner.trim().isEmpty()) this.owner = owner.trim(); }
    public double getBalance() { return balance; }

    public boolean deposit(double amount) {             // amount must be &gt; 0
        if (amount &lt;= 0) return false;
        balance += amount;
        return true;
    }

    public boolean withdraw(double amount) {            // amount &gt; 0 and not more than the balance
        if (amount &lt;= 0 || amount &gt; balance) return false;
        balance -= amount;
        return true;
    }

    @Override
    public String toString() { return accountNo + "-" + owner + "-" + String.format("%.2f", balance); }
}</code></pre>
<div class="out">TC1 OUTPUT: true A01-An-150.00<br>
TC1 OUTPUT: false A02-Binh-100.00<br>
TC2 OUTPUT: true A03-Chi-0.00<br>
TC2 OUTPUT: false A04-Dung-100.00<br>
TC3 OUTPUT: A05-Em-0.00</div>
<p>The design point: <strong>there is no <code>setBalance</code></strong>. With a setter, any caller could write <code>setBalance(1000000)</code> and every rule in <code>withdraw</code> would be decoration. The balance is changed only by the two operations that check their rule — that is encapsulation as the bank needs it. Also note the boundaries the hidden test cases love: withdrawing exactly the whole balance is allowed (<code>&lt;=</code>), 100.01 from 100 is not.</p>`,
    `<h3>🧪 Bài 1 — Câu PE: BankAccount (~20 phút)</h3>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2eba69ad85ce421aafb1296498594acef27d8dc5.svg" alt="Sơ đồ: để ý những thành viên KHÔNG có mặt" loading="lazy" /><p class="chu-thich">🧩 Sơ đồ: để ý những thành viên KHÔNG có mặt</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — BankAccount: which members exist, and which deliberately do not
class BankAccount {
  - accountNo : String {readOnly}
  - owner : String
  - balance : double
  --
  + BankAccount(accountNo : String, owner : String, openingBalance : double)
  + getAccountNo() : String
  + getOwner() : String
  + setOwner(owner : String) : void
  + getBalance() : double
  + deposit(amount : double) : boolean
  + withdraw(amount : double) : boolean
  + toString() : String
}
note right of BankAccount
  no setAccountNo(), no setBalance():
  the balance changes ONLY through
  deposit() and withdraw(), which check
  amount &gt; 0 and amount &lt;= balance
end note
@enduml</code></pre></details>
<ul>
<li>Constructor lưu số dư mở tài khoản âm thành 0. <code>setOwner</code> bỏ qua tên trống.</li>
<li><code>deposit(amount)</code> — chỉ khi <code>amount &gt; 0</code>; trả về việc có nạp được không.</li>
<li><code>withdraw(amount)</code> — chỉ khi <code>amount &gt; 0</code> và <code>amount &lt;= balance</code>; trả về việc có rút được không.</li>
<li><code>toString()</code> — <code>accountNo-owner-balance</code>, số dư 2 chữ số thập phân.</li>
</ul>
<p class="dap-an">✅ Lời giải và năm test case thật (TC1 nạp 50 và −5, TC2 rút 100 và 100.01 từ 100, TC3 số dư mở −20 và tên chủ trống):</p>
<pre class="trich"><code class="language-java">class BankAccount {
    private final String accountNo;          // cố định lúc tạo: chỉ có getter
    private String owner;
    private double balance;                  // KHÔNG có setter: chỉ deposit/withdraw được đổi nó

    public BankAccount(String accountNo, String owner, double openingBalance) {
        this.accountNo = accountNo;
        this.owner = owner;
        this.balance = openingBalance &gt; 0 ? openingBalance : 0;
    }

    public String getAccountNo() { return accountNo; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { if (owner != null &amp;&amp; !owner.trim().isEmpty()) this.owner = owner.trim(); }
    public double getBalance() { return balance; }

    public boolean deposit(double amount) {             // số tiền phải &gt; 0
        if (amount &lt;= 0) return false;
        balance += amount;
        return true;
    }

    public boolean withdraw(double amount) {            // số tiền &gt; 0 và không quá số dư
        if (amount &lt;= 0 || amount &gt; balance) return false;
        balance -= amount;
        return true;
    }

    @Override
    public String toString() { return accountNo + "-" + owner + "-" + String.format("%.2f", balance); }
}</code></pre>
<div class="out">TC1 OUTPUT: true A01-An-150.00<br>
TC1 OUTPUT: false A02-Binh-100.00<br>
TC2 OUTPUT: true A03-Chi-0.00<br>
TC2 OUTPUT: false A04-Dung-100.00<br>
TC3 OUTPUT: A05-Em-0.00</div>
<p>Điểm thiết kế: <strong>không có <code>setBalance</code></strong>. Có setter thì bên gọi nào cũng viết được <code>setBalance(1000000)</code> và mọi luật trong <code>withdraw</code> chỉ còn là trang trí. Số dư chỉ đổi qua hai thao tác có kiểm tra luật của chúng — đó là đóng gói đúng như ngân hàng cần. Để ý thêm các biên mà test case ẩn rất thích: rút đúng toàn bộ số dư thì được (<code>&lt;=</code>), rút 100.01 từ 100 thì không.</p>`),
    bi(`<h3>🧪 Exercise 2 — Which lines compile? (~10 min, on paper)</h3>
<p>Class <code>shop.Product</code> has <code>public String name</code>, <code>protected double price</code>, <code>int stock</code> (default) and <code>private double cost</code>, plus <code>public double getCost()</code>. For each statement, placed in a method <code>test(shop.Product p)</code> of the class shown, decide: compiles or error? (<code>app.Gift extends shop.Product</code>.)</p>
<pre><code class="language-plaintext">1. shop.Inventory   p.stock = 5;
2. shop.Inventory   p.cost = 0;
3. app.Main         p.name = "Pencil";
4. app.Main         p.price = 3;
5. app.Main         double c = p.getCost();
6. app.Gift         this.price = 0;
7. app.Gift         p.price = 0;
8. app.Gift         this.stock = 1;</code></pre>
<p class="dap-an">✅ javac 8 answers, statement by statement:</p>
<pre class="trich"><code class="language-java">static final String PRODUCT =
    "package shop;\\n" +
    "public class Product {\\n" +
    "    public    String name  = \\"Pen\\";\\n" +
    "    protected double price = 2;\\n" +
    "              int    stock = 10;\\n" +
    "    private   double cost  = 1;\\n" +
    "    public double getCost() { return cost; }\\n" +
    "}\\n";

public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "shop/Product.java", PRODUCT);
    // { number, file (package/Class), statement }
    String[][] tests = {
        { "1", "shop/Inventory", "p.stock = 5;" },
        { "2", "shop/Inventory", "p.cost = 0;" },
        { "3", "app/Main",       "p.name = \\"Pencil\\";" },
        { "4", "app/Main",       "p.price = 3;" },
        { "5", "app/Main",       "double c = p.getCost();" },
        { "6", "app/Gift",       "this.price = 0;" },
        { "7", "app/Gift",       "p.price = 0;" },
        { "8", "app/Gift",       "this.stock = 1;" },
    };
    for (String[] t : tests) {
        String pkg = t[1].split("/")[0], cls = t[1].split("/")[1];
        String ext = cls.equals("Gift") ? " extends shop.Product" : "";
        viet(lab, t[1] + ".java",
            "package " + pkg + ";\\n" +
            "public class " + cls + ext + " {\\n" +
            "    void test(shop.Product p) { " + t[2] + " }\\n" +
            "}\\n");
        String err = bienDich(lab, "shop/Product.java", t[1] + ".java");
        System.out.printf("%s. %-14s %-26s -&gt; %s%n", t[0], t[1].replace('/', '.'), t[2], err == null ? "compiles" : "ERROR: " + err);
        new File(lab, t[1] + ".java").delete();
    }
}

// null if it compiles, otherwise the first "error:" line without the file name
static String bienDich(File dir, String... files) throws Exception {
    List&lt;String&gt; cmd = new ArrayList&lt;String&gt;();
    cmd.add(congCu("javac"));
    cmd.addAll(Arrays.asList(files));
    Process p = new ProcessBuilder(cmd).directory(dir).redirectErrorStream(true).start();
    BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream(), "UTF-8"));
    String first = null;
    for (String line; (line = r.readLine()) != null; )
        if (first == null &amp;&amp; line.contains("error: ")) first = line.substring(line.indexOf("error: ") + 7);
    return p.waitFor() == 0 ? null : first;
}</code></pre>
<div class="out">1. shop.Inventory p.stock = 5; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; compiles<br>
2. shop.Inventory p.cost = 0; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: cost has private access in Product<br>
3. app.Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.name = "Pencil"; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; compiles<br>
4. app.Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.price = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: price has protected access in Product<br>
5. app.Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;double c = p.getCost(); &nbsp;&nbsp;&nbsp;-&gt; compiles<br>
6. app.Gift &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.price = 0; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; compiles<br>
7. app.Gift &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.price = 0; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: price has protected access in Product<br>
8. app.Gift &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.stock = 1; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: stock is not public in Product; cannot be accessed from outside package</div>
<p>The ones people get wrong: <strong>7</strong> — Gift is a subclass, yet <code>p.price</code> fails, because in another package a subclass may use <code>protected</code> members only through its <em>own</em> objects (<code>this</code>, line 6), not through a <code>Product</code> reference; and <strong>8</strong> — being a subclass gives nothing for a default member: the message even says why ("is not public … cannot be accessed from outside package"). Line 5 is the encapsulated way: the private <code>cost</code> is readable through its public getter.</p>`,
    `<h3>🧪 Bài 2 — Dòng nào biên dịch được? (~10 phút, làm trên giấy)</h3>
<p>Lớp <code>shop.Product</code> có <code>public String name</code>, <code>protected double price</code>, <code>int stock</code> (default) và <code>private double cost</code>, cộng <code>public double getCost()</code>. Với mỗi câu lệnh, đặt trong phương thức <code>test(shop.Product p)</code> của lớp ghi bên cạnh, hãy quyết định: biên dịch được hay lỗi? (<code>app.Gift extends shop.Product</code>.)</p>
<pre><code class="language-plaintext">1. shop.Inventory   p.stock = 5;
2. shop.Inventory   p.cost = 0;
3. app.Main         p.name = "Pencil";
4. app.Main         p.price = 3;
5. app.Main         double c = p.getCost();
6. app.Gift         this.price = 0;
7. app.Gift         p.price = 0;
8. app.Gift         this.stock = 1;</code></pre>
<p class="dap-an">✅ javac 8 trả lời, từng câu một:</p>
<pre class="trich"><code class="language-java">static final String PRODUCT =
    "package shop;\\n" +
    "public class Product {\\n" +
    "    public    String name  = \\"Pen\\";\\n" +
    "    protected double price = 2;\\n" +
    "              int    stock = 10;\\n" +
    "    private   double cost  = 1;\\n" +
    "    public double getCost() { return cost; }\\n" +
    "}\\n";

public static void main(String[] args) throws Exception {
    File lab = new File("lab");
    viet(lab, "shop/Product.java", PRODUCT);
    // { số, file (package/Lớp), câu lệnh }
    String[][] tests = {
        { "1", "shop/Inventory", "p.stock = 5;" },
        { "2", "shop/Inventory", "p.cost = 0;" },
        { "3", "app/Main",       "p.name = \\"Pencil\\";" },
        { "4", "app/Main",       "p.price = 3;" },
        { "5", "app/Main",       "double c = p.getCost();" },
        { "6", "app/Gift",       "this.price = 0;" },
        { "7", "app/Gift",       "p.price = 0;" },
        { "8", "app/Gift",       "this.stock = 1;" },
    };
    for (String[] t : tests) {
        String pkg = t[1].split("/")[0], cls = t[1].split("/")[1];
        String ext = cls.equals("Gift") ? " extends shop.Product" : "";
        viet(lab, t[1] + ".java",
            "package " + pkg + ";\\n" +
            "public class " + cls + ext + " {\\n" +
            "    void test(shop.Product p) { " + t[2] + " }\\n" +
            "}\\n");
        String err = bienDich(lab, "shop/Product.java", t[1] + ".java");
        System.out.printf("%s. %-14s %-26s -&gt; %s%n", t[0], t[1].replace('/', '.'), t[2], err == null ? "compiles" : "ERROR: " + err);
        new File(lab, t[1] + ".java").delete();
    }
}

// null nếu biên dịch được, ngược lại là dòng "error:" đầu tiên bỏ tên file
static String bienDich(File dir, String... files) throws Exception {
    List&lt;String&gt; cmd = new ArrayList&lt;String&gt;();
    cmd.add(congCu("javac"));
    cmd.addAll(Arrays.asList(files));
    Process p = new ProcessBuilder(cmd).directory(dir).redirectErrorStream(true).start();
    BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream(), "UTF-8"));
    String first = null;
    for (String line; (line = r.readLine()) != null; )
        if (first == null &amp;&amp; line.contains("error: ")) first = line.substring(line.indexOf("error: ") + 7);
    return p.waitFor() == 0 ? null : first;
}</code></pre>
<div class="out">1. shop.Inventory p.stock = 5; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; compiles<br>
2. shop.Inventory p.cost = 0; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: cost has private access in Product<br>
3. app.Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.name = "Pencil"; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; compiles<br>
4. app.Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.price = 3; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: price has protected access in Product<br>
5. app.Main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;double c = p.getCost(); &nbsp;&nbsp;&nbsp;-&gt; compiles<br>
6. app.Gift &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.price = 0; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; compiles<br>
7. app.Gift &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.price = 0; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: price has protected access in Product<br>
8. app.Gift &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.stock = 1; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ERROR: stock is not public in Product; cannot be accessed from outside package</div>
<p>Những câu hay sai: <strong>7</strong> — Gift là lớp con, vậy mà <code>p.price</code> vẫn lỗi, vì ở package khác lớp con chỉ được dùng thành viên <code>protected</code> qua đối tượng <em>của chính nó</em> (<code>this</code>, dòng 6), không qua một tham chiếu kiểu <code>Product</code>; và <strong>8</strong> — là lớp con cũng chẳng được gì với thành viên default: thông báo còn nói rõ lý do ("is not public … cannot be accessed from outside package" — không public, không truy cập được từ ngoài package). Dòng 5 là cách đúng tinh thần đóng gói: trường private <code>cost</code> đọc được qua getter public của nó.</p>`),
    bi(`<h3>🧪 Exercise 3 — Two packages and the jar the PE wants (~15 min)</h3>
<p>Create project <code>StudentApp</code> with <code>model.Student</code> (private id and name, constructor, getters) and <code>app.Main</code> that imports it. Compile into <code>build/classes</code>, run it, then build <code>dist/StudentApp.jar</code> whose manifest names <code>app.Main</code> as the entry point, and run the jar with <code>java -jar</code>.</p>
<p class="dap-an">✅ The whole session on JDK 8 — the same steps NetBeans' Clean and Build performs:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("StudentApp");
    viet(prj, "src/model/Student.java",
        "package model;\\n" +
        "public class Student {\\n" +
        "    private final String id;\\n" +
        "    private final String name;\\n" +
        "    public Student(String id, String name) { this.id = id; this.name = name; }\\n" +
        "    public String getId() { return id; }\\n" +
        "    public String getName() { return name; }\\n" +
        "}\\n");
    viet(prj, "src/app/Main.java",
        "package app;\\n" +
        "import model.Student;                     // another package: import it\\n" +
        "public class Main {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Student s = new Student(\\"SE190123\\", \\"An\\");\\n" +
        "        System.out.println(s.getId() + \\" \\" + s.getName());\\n" +
        "    }\\n" +
        "}\\n");
    new File(prj, "build/classes").mkdirs();
    new File(prj, "dist").mkdirs();
    lenh(prj, "javac", "-d", "build/classes", "src/model/Student.java", "src/app/Main.java");
    lenh(prj, "java", "-cp", "build/classes", "app.Main");
    lenh(prj, "jar", "cfe", "dist/StudentApp.jar", "app.Main", "-C", "build/classes", ".");   // c=create f=file e=entry point (Main-Class)
    lenh(prj, "jar", "tf", "dist/StudentApp.jar");
    JarFile jf = new JarFile(new File(prj, "dist/StudentApp.jar"));
    System.out.println("Main-Class in the manifest: " + jf.getManifest().getMainAttributes().getValue("Main-Class"));
    jf.close();
    lenh(prj, "java", "-jar", "dist/StudentApp.jar");                  // how the PE marker starts your answer
}</code></pre>
<div class="out">&gt; javac -d build/classes src/model/Student.java src/app/Main.java<br>
&gt; java -cp build/classes app.Main<br>
SE190123 An<br>
&gt; jar cfe dist/StudentApp.jar app.Main -C build/classes .<br>
&gt; jar tf dist/StudentApp.jar<br>
META-INF/<br>
META-INF/MANIFEST.MF<br>
app/<br>
app/Main.class<br>
model/<br>
model/Student.class<br>
Main-Class in the manifest: app.Main<br>
&gt; java -jar dist/StudentApp.jar<br>
SE190123 An</div>
<p>Read the <code>jar tf</code> listing: a jar is a zip of the <strong>package folders</strong> (<code>app/</code>, <code>model/</code>) plus <code>META-INF/MANIFEST.MF</code>, whose <code>Main-Class: app.Main</code> line is what makes <code>java -jar</code> work. In NetBeans the same appears in <code>dist/</code> after Clean and Build, provided Project Properties → Run → Main Class is set — the PE's "copy the jar into the run folder" step submits exactly this file.</p>
<div class="pitfall">PE: a jar built while the project's main class is unset, or after renaming a package without rebuilding, starts with "no main manifest attribute" or "Could not find or load main class" — and the marker gives 0. Run your own jar once with <code>java -jar</code> before submitting.</div>`,
    `<h3>🧪 Bài 3 — Hai package và file jar mà đề PE đòi (~15 phút)</h3>
<p>Tạo project <code>StudentApp</code> có <code>model.Student</code> (id và name private, constructor, getter) và <code>app.Main</code> import nó. Biên dịch vào <code>build/classes</code>, chạy thử, rồi đóng <code>dist/StudentApp.jar</code> có manifest ghi <code>app.Main</code> là điểm vào, và chạy jar bằng <code>java -jar</code>.</p>
<p class="dap-an">✅ Cả phiên làm việc trên JDK 8 — đúng các bước mà Clean and Build của NetBeans thực hiện:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File prj = new File("StudentApp");
    viet(prj, "src/model/Student.java",
        "package model;\\n" +
        "public class Student {\\n" +
        "    private final String id;\\n" +
        "    private final String name;\\n" +
        "    public Student(String id, String name) { this.id = id; this.name = name; }\\n" +
        "    public String getId() { return id; }\\n" +
        "    public String getName() { return name; }\\n" +
        "}\\n");
    viet(prj, "src/app/Main.java",
        "package app;\\n" +
        "import model.Student;                     // another package: import it\\n" +
        "public class Main {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Student s = new Student(\\"SE190123\\", \\"An\\");\\n" +
        "        System.out.println(s.getId() + \\" \\" + s.getName());\\n" +
        "    }\\n" +
        "}\\n");
    new File(prj, "build/classes").mkdirs();
    new File(prj, "dist").mkdirs();
    lenh(prj, "javac", "-d", "build/classes", "src/model/Student.java", "src/app/Main.java");
    lenh(prj, "java", "-cp", "build/classes", "app.Main");
    lenh(prj, "jar", "cfe", "dist/StudentApp.jar", "app.Main", "-C", "build/classes", ".");   // c=tạo f=file e=điểm vào (Main-Class)
    lenh(prj, "jar", "tf", "dist/StudentApp.jar");
    JarFile jf = new JarFile(new File(prj, "dist/StudentApp.jar"));
    System.out.println("Main-Class in the manifest: " + jf.getManifest().getMainAttributes().getValue("Main-Class"));
    jf.close();
    lenh(prj, "java", "-jar", "dist/StudentApp.jar");                  // cách máy chấm PE khởi động bài của bạn
}</code></pre>
<div class="out">&gt; javac -d build/classes src/model/Student.java src/app/Main.java<br>
&gt; java -cp build/classes app.Main<br>
SE190123 An<br>
&gt; jar cfe dist/StudentApp.jar app.Main -C build/classes .<br>
&gt; jar tf dist/StudentApp.jar<br>
META-INF/<br>
META-INF/MANIFEST.MF<br>
app/<br>
app/Main.class<br>
model/<br>
model/Student.class<br>
Main-Class in the manifest: app.Main<br>
&gt; java -jar dist/StudentApp.jar<br>
SE190123 An</div>
<p>Đọc danh sách <code>jar tf</code>: file jar là một file zip chứa các <strong>thư mục package</strong> (<code>app/</code>, <code>model/</code>) cộng <code>META-INF/MANIFEST.MF</code>, trong đó dòng <code>Main-Class: app.Main</code> là thứ làm <code>java -jar</code> chạy được. Trong NetBeans cùng thứ đó xuất hiện ở <code>dist/</code> sau Clean and Build, với điều kiện Project Properties → Run → Main Class đã được đặt — bước "chép jar vào thư mục run" của đề PE nộp đúng file này.</p>
<div class="pitfall">PE: jar build lúc project chưa đặt main class, hoặc sau khi đổi tên package mà chưa build lại, sẽ báo "no main manifest attribute" hoặc "Could not find or load main class" — và máy chấm cho 0. Tự chạy jar của mình một lần bằng <code>java -jar</code> trước khi nộp.</div>`),
    bi(`<h3>🧪 Exercise 4 — Varargs utilities and their edge cases (~15 min)</h3>
<p>Write a utility class <code>MathUtil</code> (no objects should be created from it) with: <code>max</code> of one or more ints — the signature must make "no numbers at all" impossible; <code>average</code> of any number of doubles, 0 when there are none; <code>join(sep, parts...)</code> with the separator only <em>between</em> parts.</p>
<p class="dap-an">✅ Solution and real run:</p>
<pre><code class="language-java">// release: 8
// Chapter 3 practice, exercise 4 — three varargs utilities, each with the edge case that breaks naive versions
class MathUtil {
    private MathUtil() { }                               // utility class: nobody should create objects of it

    public static int max(int first, int... rest) {      // at least ONE number is guaranteed by the signature
        int m = first;
        for (int x : rest) if (x &gt; m) m = x;
        return m;
    }

    public static double average(double... xs) {         // zero arguments: return 0 instead of 0.0/0 = NaN
        if (xs.length == 0) return 0;
        double s = 0;
        for (double x : xs) s += x;
        return s / xs.length;
    }

    public static String join(String sep, String... parts) {   // separator only BETWEEN parts
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i &lt; parts.length; i++) {
            if (i &gt; 0) sb.append(sep);
            sb.append(parts[i]);
        }
        return sb.toString();
    }
}

public class TienIchVarargs {
    public static void main(String[] args) {
        System.out.println("max(7) = " + MathUtil.max(7));
        System.out.println("max(3, 9, -2, 9) = " + MathUtil.max(3, 9, -2, 9));
        System.out.println("average() = " + MathUtil.average() + "   (naive version: " + (0.0 / 0) + ")");
        System.out.println("average(8, 9.5, 7) = " + MathUtil.average(8, 9.5, 7));
        System.out.println("[" + MathUtil.join(", ", "Java", "OOP", "PE") + "]");
        System.out.println("[" + MathUtil.join(", ") + "]   &lt;- no parts: an empty string, no stray comma");
    }
}</code></pre>
<div class="out">max(7) = 7<br>
max(3, 9, -2, 9) = 9<br>
average() = 0.0 &nbsp;&nbsp;(naive version: NaN)<br>
average(8, 9.5, 7) = 8.166666666666666<br>
[Java, OOP, PE]<br>
[] &nbsp;&nbsp;&lt;- no parts: an empty string, no stray comma</div>
<p>Three design decisions: <code>max(int first, int... rest)</code> uses the type system to require at least one argument (with <code>max(int... xs)</code>, <code>max()</code> would compile and you would have to invent an answer); <code>average()</code> returns 0 instead of the <code>NaN</code> that <code>0.0 / 0</code> gives; <code>join</code> adds the separator <em>before</em> each part except the first, the fix for slide 33's trailing space. The <code>private</code> constructor forbids <code>new MathUtil()</code> — like <code>java.lang.Math</code>.</p>`,
    `<h3>🧪 Bài 4 — Tiện ích varargs và các trường hợp biên (~15 phút)</h3>
<p>Viết lớp tiện ích <code>MathUtil</code> (không ai nên tạo đối tượng từ nó) có: <code>max</code> của một hay nhiều số int — chữ ký phải làm cho "không có số nào" là điều không thể; <code>average</code> của bao nhiêu số double cũng được, trả 0 khi không có số nào; <code>join(sep, parts...)</code> với dấu nối chỉ nằm <em>giữa</em> các phần.</p>
<p class="dap-an">✅ Lời giải và lần chạy thật:</p>
<pre><code class="language-java">// release: 8
// Thực hành Chương 3, bài 4 — ba tiện ích varargs, mỗi cái kèm trường hợp biên làm hỏng bản viết ẩu
class MathUtil {
    private MathUtil() { }                               // lớp tiện ích: không ai nên tạo đối tượng của nó

    public static int max(int first, int... rest) {      // chữ ký bảo đảm có ít nhất MỘT số
        int m = first;
        for (int x : rest) if (x &gt; m) m = x;
        return m;
    }

    public static double average(double... xs) {         // không đối số: trả 0 thay vì 0.0/0 = NaN
        if (xs.length == 0) return 0;
        double s = 0;
        for (double x : xs) s += x;
        return s / xs.length;
    }

    public static String join(String sep, String... parts) {   // dấu nối chỉ nằm GIỮA các phần
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i &lt; parts.length; i++) {
            if (i &gt; 0) sb.append(sep);
            sb.append(parts[i]);
        }
        return sb.toString();
    }
}

public class TienIchVarargs {
    public static void main(String[] args) {
        System.out.println("max(7) = " + MathUtil.max(7));
        System.out.println("max(3, 9, -2, 9) = " + MathUtil.max(3, 9, -2, 9));
        System.out.println("average() = " + MathUtil.average() + "   (naive version: " + (0.0 / 0) + ")");
        System.out.println("average(8, 9.5, 7) = " + MathUtil.average(8, 9.5, 7));
        System.out.println("[" + MathUtil.join(", ", "Java", "OOP", "PE") + "]");
        System.out.println("[" + MathUtil.join(", ") + "]   &lt;- no parts: an empty string, no stray comma");
    }
}</code></pre>
<div class="out">max(7) = 7<br>
max(3, 9, -2, 9) = 9<br>
average() = 0.0 &nbsp;&nbsp;(naive version: NaN)<br>
average(8, 9.5, 7) = 8.166666666666666<br>
[Java, OOP, PE]<br>
[] &nbsp;&nbsp;&lt;- no parts: an empty string, no stray comma</div>
<p>Ba quyết định thiết kế: <code>max(int first, int... rest)</code> dùng hệ thống kiểu để bắt buộc ít nhất một đối số (với <code>max(int... xs)</code>, lệnh <code>max()</code> vẫn biên dịch và bạn phải bịa ra một câu trả lời); <code>average()</code> trả 0 thay vì <code>NaN</code> mà <code>0.0 / 0</code> sinh ra; <code>join</code> thêm dấu nối <em>trước</em> mỗi phần trừ phần đầu, cách sửa dấu cách thừa cuối chuỗi ở slide 33. Constructor <code>private</code> cấm <code>new MathUtil()</code> — giống <code>java.lang.Math</code>.</p>`),
    bi(`<h3>🧪 Exercise 5 — All fields private, data still leaking (~15 min)</h3>
<p>A course accepts at most 2 students and no duplicates. <code>enroll</code> enforces both rules, the list is <code>private final</code>. Find the back door in <code>CourseLeaky</code>, prove it, and close it.</p>
<pre class="trich"><code class="language-java">class CourseLeaky {
    private final List&lt;String&gt; students = new ArrayList&lt;String&gt;();
    private final int capacity = 2;
    public boolean enroll(String s) {
        if (students.size() &gt;= capacity || students.contains(s)) return false;   // the rule
        return students.add(s);
    }
    public List&lt;String&gt; getStudents() { return students; }      // hands out the REAL list
}</code></pre>
<p class="dap-an">✅ The fix, and a real run of both versions:</p>
<pre class="trich"><code class="language-java">class CourseSafe {
    private final List&lt;String&gt; students = new ArrayList&lt;String&gt;();
    private final int capacity = 2;
    public boolean enroll(String s) {
        if (students.size() &gt;= capacity || students.contains(s)) return false;
        return students.add(s);
    }
    public List&lt;String&gt; getStudents() { return Collections.unmodifiableList(students); }   // a read-only VIEW
    public List&lt;String&gt; copyStudents() { return new ArrayList&lt;String&gt;(students); }         // or a copy the caller may change
}</code></pre>
<div class="out">leaky: enroll("Chi") -&gt; false &nbsp;&nbsp;(full: the rule works)<br>
leaky: students = [An, Binh, Chi, Chi] &nbsp;&nbsp;(capacity 2, duplicates — rules bypassed)<br>
safe : getStudents().add("Chi") -&gt; UnsupportedOperationException<br>
safe : my copy = [An, Binh, Chi], the course still = [An, Binh]</div>
<p><code>getStudents()</code> returns the <strong>reference</strong> to the private list (lesson 2.A: a reference is an arrow to the same object), so any caller can <code>add</code> to it directly and skip <code>enroll</code> — capacity 2, four students, a duplicate. <code>private</code> protected the <em>variable</em>, not the <em>object</em>. Two fixes: <code>Collections.unmodifiableList</code> returns a read-only view (adding throws <code>UnsupportedOperationException</code>), or return a <strong>copy</strong> that the caller may change freely without touching the course. <code>final</code> did not help either: it freezes the reference, not the list's contents.</p>`,
    `<h3>🧪 Bài 5 — Mọi trường đều private, dữ liệu vẫn rò ra (~15 phút)</h3>
<p>Một lớp học nhận tối đa 2 sinh viên và không nhận trùng. <code>enroll</code> canh cả hai luật, danh sách là <code>private final</code>. Tìm cửa sau trong <code>CourseLeaky</code>, chứng minh nó, rồi đóng nó lại.</p>
<pre class="trich"><code class="language-java">class CourseLeaky {
    private final List&lt;String&gt; students = new ArrayList&lt;String&gt;();
    private final int capacity = 2;
    public boolean enroll(String s) {
        if (students.size() &gt;= capacity || students.contains(s)) return false;   // luật
        return students.add(s);
    }
    public List&lt;String&gt; getStudents() { return students; }      // đưa ra danh sách THẬT
}</code></pre>
<p class="dap-an">✅ Cách sửa, và lần chạy thật của cả hai bản:</p>
<pre class="trich"><code class="language-java">class CourseSafe {
    private final List&lt;String&gt; students = new ArrayList&lt;String&gt;();
    private final int capacity = 2;
    public boolean enroll(String s) {
        if (students.size() &gt;= capacity || students.contains(s)) return false;
        return students.add(s);
    }
    public List&lt;String&gt; getStudents() { return Collections.unmodifiableList(students); }   // một CỬA SỔ chỉ đọc
    public List&lt;String&gt; copyStudents() { return new ArrayList&lt;String&gt;(students); }         // hoặc một bản sao bên gọi được sửa
}</code></pre>
<div class="out">leaky: enroll("Chi") -&gt; false &nbsp;&nbsp;(full: the rule works)<br>
leaky: students = [An, Binh, Chi, Chi] &nbsp;&nbsp;(capacity 2, duplicates — rules bypassed)<br>
safe : getStudents().add("Chi") -&gt; UnsupportedOperationException<br>
safe : my copy = [An, Binh, Chi], the course still = [An, Binh]</div>
<p><code>getStudents()</code> trả về <strong>tham chiếu</strong> tới danh sách private (bài 2.A: tham chiếu là mũi tên tới cùng một đối tượng), nên bên gọi nào cũng <code>add</code> thẳng vào được và bỏ qua <code>enroll</code> — sức chứa 2, bốn sinh viên, có cả trùng. <code>private</code> bảo vệ <em>biến</em>, không bảo vệ <em>đối tượng</em>. Hai cách sửa: <code>Collections.unmodifiableList</code> trả về một cửa sổ chỉ đọc (thêm vào sẽ ném <code>UnsupportedOperationException</code>), hoặc trả về một <strong>bản sao</strong> mà bên gọi tha hồ sửa mà không đụng tới lớp học. <code>final</code> cũng không cứu được: nó đóng băng tham chiếu, không đóng băng nội dung danh sách.</p>`),
    bi(`<h3>🧪 Exercise 6 — Design it yourself: a parking lot (~25 min)</h3>
<p>Statement: <em>"A parking lot has a name and a capacity between 1 and 500 slots, fixed when it is built. A car parks by its plate number and leaves by its plate number. A car cannot park when the lot is full or when it is already inside. Staff need to know whether the lot is full and how many slots are free."</em> Do slide 34's analysis first (nouns, describing nouns, verbs, <strong>rules</strong>), draw the UML box, then implement. Plates may be typed with or without spaces, dots and dashes.</p>
<p class="dap-an">✅ One good design and its real run:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/df84149ef675b2f4e595e4928148170b3cf2ed27.svg" alt="Rules inside, small public interface, a private helper" loading="lazy" /><p class="chu-thich">🧩 Rules inside, small public interface, a private helper</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — ParkingLot designed from the statement
class ParkingLot {
  - name : String {readOnly}
  - capacity : int {readOnly}
  - plates : List&lt;String&gt;
  --
  + ParkingLot(name : String, capacity : int)
  + park(plate : String) : boolean
  + leave(plate : String) : boolean
  + isFull() : boolean
  + getFreeSlots() : int
  + getName() : String
  - {static} normalise(plate : String) : String
  + toString() : String
}
note right of ParkingLot
  rules inside the class:
  capacity 1..500 (else 1)
  no park when full or already inside
  "30a-123.45" = "30A 123 45"
end note
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Chapter 3 practice, exercise 6 — from a problem statement to an encapsulated class, the way slides 34–39 should have done it
import java.util.ArrayList;
import java.util.List;

class ParkingLot {
    private final String name;
    private final int capacity;                          // 1..500, fixed when the lot is built
    private final List&lt;String&gt; plates = new ArrayList&lt;String&gt;();

    public ParkingLot(String name, int capacity) {
        if (capacity &lt; 1 || capacity &gt; 500) capacity = 1;
        this.name = name;
        this.capacity = capacity;
    }

    public boolean park(String plate) {                  // refuse when full or when the plate is already inside
        String p = normalise(plate);
        if (p.isEmpty() || isFull() || plates.contains(p)) return false;
        plates.add(p);
        return true;
    }

    public boolean leave(String plate) { return plates.remove(normalise(plate)); }

    public boolean isFull() { return plates.size() == capacity; }
    public int getFreeSlots() { return capacity - plates.size(); }
    public String getName() { return name; }

    private static String normalise(String plate) {      // private helper: part of the inside, not the interface
        return plate == null ? "" : plate.toUpperCase().replaceAll("[^A-Z0-9]", "");   // keep letters and digits only
    }

    @Override public String toString() { return name + " " + plates.size() + "/" + capacity + " " + plates; }
}

public class BaiDoXe {
    public static void main(String[] args) {
        ParkingLot lot = new ParkingLot("FPT-B1", 2);
        System.out.println("park 30A-123.45 -&gt; " + lot.park("30a-123.45"));
        System.out.println("park 30A 123 45 -&gt; " + lot.park(" 30A 123 45 ") + "   (same car, typed differently)");
        System.out.println("park 29B-555.55 -&gt; " + lot.park("29B-555.55"));
        System.out.println("park 51C-888.88 -&gt; " + lot.park("51C-888.88") + "   (full)");
        System.out.println(lot + ", free=" + lot.getFreeSlots());
        System.out.println("leave 30A-123.45 -&gt; " + lot.leave("30A-123.45") + ", leave 99Z-000.00 -&gt; " + lot.leave("99Z-000.00"));
        System.out.println(lot + ", full? " + lot.isFull());
        System.out.println(new ParkingLot("Bad", 9999) + "   (capacity outside 1..500 -&gt; 1)");
    }
}</code></pre>
<div class="out">park 30A-123.45 -&gt; true<br>
park 30A 123 45 -&gt; false &nbsp;&nbsp;(same car, typed differently)<br>
park 29B-555.55 -&gt; true<br>
park 51C-888.88 -&gt; false &nbsp;&nbsp;(full)<br>
FPT-B1 2/2 [30A12345, 29B55555], free=0<br>
leave 30A-123.45 -&gt; true, leave 99Z-000.00 -&gt; false<br>
FPT-B1 1/2 [29B55555], full? false<br>
Bad 0/1 [] &nbsp;&nbsp;(capacity outside 1..500 -&gt; 1)</div>
<p>Every rule of the statement has one line that enforces it: capacity checked in the constructor and <code>final</code>; "full" and "already inside" checked in <code>park</code>; the free count <em>computed</em>, not stored (a stored counter could disagree with the list). <code>normalise</code> is <code>private</code>: it is how the class works inside, not something callers should depend on — so "30a-123.45" and " 30A 123 45 " are the same car, and the second <code>park</code> is refused.</p>`,
    `<h3>🧪 Bài 6 — Tự thiết kế: bãi đỗ xe (~25 phút)</h3>
<p>Đề bài: <em>"Một bãi đỗ xe có tên và sức chứa từ 1 đến 500 chỗ, cố định khi xây. Xe vào bãi theo biển số và ra bãi theo biển số. Xe không được vào khi bãi đã đầy hoặc khi nó đang ở trong bãi. Nhân viên cần biết bãi đã đầy chưa và còn bao nhiêu chỗ trống."</em> Làm phần phân tích như slide 34 trước (danh từ, danh từ mô tả, động từ, <strong>luật</strong>), vẽ hộp UML, rồi mới cài đặt. Biển số có thể gõ có hoặc không có dấu cách, dấu chấm, gạch ngang.</p>
<p class="dap-an">✅ Một thiết kế tốt và lần chạy thật:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/df84149ef675b2f4e595e4928148170b3cf2ed27.svg" alt="Luật ở bên trong, giao diện public nhỏ, một hàm phụ private" loading="lazy" /><p class="chu-thich">🧩 Luật ở bên trong, giao diện public nhỏ, một hàm phụ private</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — ParkingLot designed from the statement
class ParkingLot {
  - name : String {readOnly}
  - capacity : int {readOnly}
  - plates : List&lt;String&gt;
  --
  + ParkingLot(name : String, capacity : int)
  + park(plate : String) : boolean
  + leave(plate : String) : boolean
  + isFull() : boolean
  + getFreeSlots() : int
  + getName() : String
  - {static} normalise(plate : String) : String
  + toString() : String
}
note right of ParkingLot
  rules inside the class:
  capacity 1..500 (else 1)
  no park when full or already inside
  "30a-123.45" = "30A 123 45"
end note
@enduml</code></pre></details>
<pre><code class="language-java">// release: 8
// Thực hành Chương 3, bài 6 — từ đề bài tới một lớp đóng gói tốt, theo cách mà slide 34–39 lẽ ra phải làm
import java.util.ArrayList;
import java.util.List;

class ParkingLot {
    private final String name;
    private final int capacity;                          // 1..500, cố định khi bãi được xây
    private final List&lt;String&gt; plates = new ArrayList&lt;String&gt;();

    public ParkingLot(String name, int capacity) {
        if (capacity &lt; 1 || capacity &gt; 500) capacity = 1;
        this.name = name;
        this.capacity = capacity;
    }

    public boolean park(String plate) {                  // từ chối khi đầy hoặc biển số đã ở trong bãi
        String p = normalise(plate);
        if (p.isEmpty() || isFull() || plates.contains(p)) return false;
        plates.add(p);
        return true;
    }

    public boolean leave(String plate) { return plates.remove(normalise(plate)); }

    public boolean isFull() { return plates.size() == capacity; }
    public int getFreeSlots() { return capacity - plates.size(); }
    public String getName() { return name; }

    private static String normalise(String plate) {      // hàm phụ private: thuộc phần ruột, không thuộc giao diện
        return plate == null ? "" : plate.toUpperCase().replaceAll("[^A-Z0-9]", "");   // chỉ giữ chữ và số
    }

    @Override public String toString() { return name + " " + plates.size() + "/" + capacity + " " + plates; }
}

public class BaiDoXe {
    public static void main(String[] args) {
        ParkingLot lot = new ParkingLot("FPT-B1", 2);
        System.out.println("park 30A-123.45 -&gt; " + lot.park("30a-123.45"));
        System.out.println("park 30A 123 45 -&gt; " + lot.park(" 30A 123 45 ") + "   (same car, typed differently)");
        System.out.println("park 29B-555.55 -&gt; " + lot.park("29B-555.55"));
        System.out.println("park 51C-888.88 -&gt; " + lot.park("51C-888.88") + "   (full)");
        System.out.println(lot + ", free=" + lot.getFreeSlots());
        System.out.println("leave 30A-123.45 -&gt; " + lot.leave("30A-123.45") + ", leave 99Z-000.00 -&gt; " + lot.leave("99Z-000.00"));
        System.out.println(lot + ", full? " + lot.isFull());
        System.out.println(new ParkingLot("Bad", 9999) + "   (capacity outside 1..500 -&gt; 1)");
    }
}</code></pre>
<div class="out">park 30A-123.45 -&gt; true<br>
park 30A 123 45 -&gt; false &nbsp;&nbsp;(same car, typed differently)<br>
park 29B-555.55 -&gt; true<br>
park 51C-888.88 -&gt; false &nbsp;&nbsp;(full)<br>
FPT-B1 2/2 [30A12345, 29B55555], free=0<br>
leave 30A-123.45 -&gt; true, leave 99Z-000.00 -&gt; false<br>
FPT-B1 1/2 [29B55555], full? false<br>
Bad 0/1 [] &nbsp;&nbsp;(capacity outside 1..500 -&gt; 1)</div>
<p>Mỗi luật của đề bài có một dòng canh giữ nó: sức chứa kiểm trong constructor và là <code>final</code>; "đầy" và "đã ở trong bãi" kiểm trong <code>park</code>; số chỗ trống được <em>tính ra</em>, không lưu riêng (một bộ đếm lưu riêng có thể lệch với danh sách). <code>normalise</code> là <code>private</code>: đó là cách lớp làm việc bên trong, không phải thứ bên gọi nên phụ thuộc vào — nhờ vậy "30a-123.45" và " 30A 123 45 " là cùng một xe, và lần <code>park</code> thứ hai bị từ chối.</p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>package</strong></td><td>gói</td><td>A namespace and a folder for related classes; it becomes part of each class's full name (mypkg.PkgDemo).</td></tr>
<tr><td><strong>fully qualified name</strong></td><td>tên đầy đủ</td><td>Package plus class name, e.g. java.util.List; what java and the class loader really use.</td></tr>
<tr><td><strong>import</strong></td><td>nhập tên</td><td>Lets you write a class's short name; it loads nothing and is never needed for java.lang.</td></tr>
<tr><td><strong>access modifier</strong></td><td>bổ từ truy cập</td><td>public, protected, private, or none (default): the compiler-checked level of who may use a member.</td></tr>
<tr><td><strong>public</strong></td><td>công khai</td><td>Usable from any class in any package.</td></tr>
<tr><td><strong>protected</strong></td><td>bảo vệ</td><td>Usable in the same package, and in subclasses elsewhere through their own objects.</td></tr>
<tr><td><strong>default (package-private)</strong></td><td>mặc định (riêng package)</td><td>No modifier written: usable only inside the same package, even subclasses elsewhere cannot.</td></tr>
<tr><td><strong>private</strong></td><td>riêng tư</td><td>Usable only inside the class's own source code (also on other objects of the same class).</td></tr>
<tr><td><strong>super</strong></td><td>lớp cha</td><td>Refers to members of the parent class; super(...) calls a parent constructor and must come first.</td></tr>
<tr><td><strong>varargs</strong></td><td>tham số số lượng thay đổi</td><td>A last parameter written Type... name; the arguments arrive as an array, possibly empty.</td></tr>
<tr><td><strong>jar file</strong></td><td>tệp jar</td><td>A zip of compiled package folders plus a manifest; java -jar runs its Main-Class.</td></tr>
<tr><td><strong>manifest</strong></td><td>tệp kê khai</td><td>META-INF/MANIFEST.MF inside a jar; its Main-Class line names the class with main.</td></tr>
<tr><td><strong>defensive copy</strong></td><td>bản sao phòng thủ</td><td>Returning a copy (or a read-only view) of an internal object so callers cannot change the inside.</td></tr>
<tr><td><strong>invariant</strong></td><td>bất biến của lớp</td><td>A rule that must hold for every object at all times (balance ≥ 0, plates ≤ capacity), guarded by the class's methods.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>package</strong></td><td>gói</td><td>Không gian tên và thư mục cho các lớp liên quan; nó thành một phần tên đầy đủ của lớp (mypkg.PkgDemo).</td></tr>
<tr><td><strong>fully qualified name</strong></td><td>tên đầy đủ</td><td>Tên package cộng tên lớp, vd java.util.List; thứ mà java và bộ nạp lớp thật sự dùng.</td></tr>
<tr><td><strong>import</strong></td><td>nhập tên</td><td>Cho phép viết tên ngắn của lớp; nó không nạp gì và không bao giờ cần cho java.lang.</td></tr>
<tr><td><strong>access modifier</strong></td><td>bổ từ truy cập</td><td>public, protected, private, hoặc không ghi (default): mức "ai được dùng thành viên" do trình biên dịch kiểm.</td></tr>
<tr><td><strong>public</strong></td><td>công khai</td><td>Dùng được từ mọi lớp ở mọi package.</td></tr>
<tr><td><strong>protected</strong></td><td>bảo vệ</td><td>Dùng được trong cùng package, và ở lớp con nơi khác qua chính đối tượng của lớp con.</td></tr>
<tr><td><strong>default (package-private)</strong></td><td>mặc định (riêng package)</td><td>Không ghi modifier: chỉ dùng được trong cùng package, lớp con ở nơi khác cũng không.</td></tr>
<tr><td><strong>private</strong></td><td>riêng tư</td><td>Chỉ dùng được trong mã nguồn của chính lớp (kể cả trên đối tượng khác cùng lớp).</td></tr>
<tr><td><strong>super</strong></td><td>lớp cha</td><td>Chỉ tới thành viên của lớp cha; super(...) gọi constructor cha và phải đứng đầu.</td></tr>
<tr><td><strong>varargs</strong></td><td>tham số số lượng thay đổi</td><td>Tham số cuối viết Kiểu... tên; các đối số tới dưới dạng một mảng, có thể rỗng.</td></tr>
<tr><td><strong>jar file</strong></td><td>tệp jar</td><td>Tệp zip chứa các thư mục package đã biên dịch cùng manifest; java -jar chạy Main-Class của nó.</td></tr>
<tr><td><strong>manifest</strong></td><td>tệp kê khai</td><td>META-INF/MANIFEST.MF trong jar; dòng Main-Class ghi tên lớp có main.</td></tr>
<tr><td><strong>defensive copy</strong></td><td>bản sao phòng thủ</td><td>Trả về bản sao (hoặc cửa sổ chỉ đọc) của đối tượng bên trong để bên gọi không sửa được ruột lớp.</td></tr>
<tr><td><strong>invariant</strong></td><td>bất biến của lớp</td><td>Luật phải đúng với mọi đối tượng ở mọi lúc (số dư ≥ 0, số xe ≤ sức chứa), do các phương thức của lớp canh giữ.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 7 things to remember from Chapter 3</h2>
<ol>
<li><strong>A package is a namespace and a folder.</strong> The <code>package</code> line comes first; the class's real name is <code>package.Class</code>; run it with <code>java -cp classes package.Class</code> from the root, never from inside the package folder.</li>
<li><strong>Four levels:</strong> <code>public &gt; protected &gt; default &gt; private</code>, checked by javac. A top-level class is only <code>public</code> or default.</li>
<li><strong><code>protected</code></strong> = whole package + subclasses elsewhere, and in another package only through the subclass's own objects.</li>
<li><strong>Encapsulation = private data + a small public interface that enforces the rules.</strong> A field whose value must follow rules gets no plain setter (balance, capacity).</li>
<li><strong><code>private</code> protects the variable, not the object:</strong> never return a mutable internal object from a getter — return a copy or a read-only view.</li>
<li><strong>Varargs</strong> (<code>Type... x</code>) is an array, possibly empty; last parameter only, one per method.</li>
<li><strong>The PE submission is a jar:</strong> package folders + a manifest with <code>Main-Class</code>; test it with <code>java -jar</code> before submitting.</li>
</ol>
<p>Then do the rewritten Chapter 3 quiz below. Chapter 4 (inheritance) builds directly on <code>protected</code> and <code>super</code>.</p>`,
    `<h2>📌 Tóm tắt — 7 điều cần nhớ của Chương 3</h2>
<ol>
<li><strong>Package là không gian tên và là thư mục.</strong> Dòng <code>package</code> đứng đầu; tên thật của lớp là <code>package.Lớp</code>; chạy bằng <code>java -cp classes package.Lớp</code> từ thư mục gốc, không bao giờ đứng trong thư mục package.</li>
<li><strong>Bốn mức:</strong> <code>public &gt; protected &gt; default &gt; private</code>, do javac kiểm. Lớp cấp ngoài cùng chỉ là <code>public</code> hoặc default.</li>
<li><strong><code>protected</code></strong> = cả package + lớp con ở nơi khác, và ở package khác thì chỉ qua chính đối tượng của lớp con.</li>
<li><strong>Đóng gói = dữ liệu private + một giao diện public nhỏ canh giữ luật.</strong> Trường mà giá trị phải theo luật thì không có setter trơn (số dư, sức chứa).</li>
<li><strong><code>private</code> bảo vệ biến, không bảo vệ đối tượng:</strong> đừng bao giờ trả một đối tượng bên trong sửa được ra khỏi getter — trả bản sao hoặc cửa sổ chỉ đọc.</li>
<li><strong>Varargs</strong> (<code>Kiểu... x</code>) là một mảng, có thể rỗng; chỉ được là tham số cuối, mỗi phương thức một cái.</li>
<li><strong>Bài nộp PE là một file jar:</strong> các thư mục package + manifest có <code>Main-Class</code>; tự thử bằng <code>java -jar</code> trước khi nộp.</li>
</ol>
<p>Sau đó làm quiz Chương 3 đã viết lại ở bên dưới. Chương 4 (kế thừa) xây thẳng trên <code>protected</code> và <code>super</code>.</p>`),
  ].join('\n'),
};

/* ───────── Lab 3 — 🏗️ CT Library: encapsulation and data rules (access modifiers, static, delete, report, code review) ───────── */
const L_lab3 = {
  title: 'Lab 3 — 🏗️ CT Library: encapsulation and data rules (access modifiers, static, delete, report, code review)|||Lab 3 — 🏗️ CT Library: đóng gói và luật dữ liệu (access modifier, static, xoá, thống kê, review code)',
  slug: 'pro192-lab-3-dong-goi-va-luat-du-lieu',
  type: 'VIDEO',
  description: 'Lab 3 của dự án CT Library (sau Chương 3), chuẩn review LAB211: siết luật dữ liệu (năm không ở tương lai đọc từ đồng hồ máy, email đúng dạng bằng regex và không trùng), xoá sách mà mã không bao giờ cấp lại, thống kê do service tính trên bản sao, giải thích từng access modifier, lỗi javac thật khi chạm private/package-private, bẫy bộ đếm static và getter làm rò danh sách, và review một pull request có 6 lỗi mà lint.py tìm ra. Starter + đáp án tải về, bộ chấm kiểu PE 176 dòng, đáp án qua lint.py + javac --release 8 + JDK 8 thật, rubric 10 điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lab 3 · CT Library</span>
<h2>Lab 3 — encapsulation and data rules</h2>
<p class="lead">Chapter 3 is about making the compiler — not good intentions — protect your data: packages, access modifiers, private fields, and classes that hide their state. Lab 3 puts that to work on CT Library: stricter rules that refuse nine kinds of bad data, delete without ever reusing an id, a report, and a code review where the LAB211 reviewer's tool finds six mistakes in a teammate's pull request.</p>
<p>The starter is a fresh project: Lab 2 finished, the Lab 3 bodies marked <code>TODO Lab 3.x</code> — and six planted violations. Plan about <strong>3 hours</strong>.</p>`,
    `<span class="eyebrow">Chương 3 · Lab 3 · CT Library</span>
<h2>Lab 3 — đóng gói và luật dữ liệu</h2>
<p class="lead">Chương 3 dạy cách để trình biên dịch — chứ không phải thiện chí — bảo vệ dữ liệu: package, access modifier (bổ từ truy cập), trường private, và lớp biết giấu trạng thái của mình. Lab 3 đem điều đó vào CT Library: luật chặt hơn từ chối chín kiểu dữ liệu xấu, xoá mà không bao giờ cấp lại mã, một bản thống kê, và một lần review code nơi công cụ của thầy LAB211 tìm ra sáu lỗi trong pull request của bạn cùng nhóm.</p>
<p>Starter là một dự án sạch: Lab 2 đã xong, thân các hàm của Lab 3 đánh dấu <code>TODO Lab 3.x</code> — cùng sáu vi phạm được cài sẵn. Dành khoảng <strong>3 giờ</strong>.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Lab 3 (15 slides)</h2>
<p>The deck of this lab, made for CT Library (it is not a school deck). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project, compiled with <code>javac --release 8</code> and run — the same runs you find in the steps below.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Lab 3 (15 slide)</h2>
<p>Bộ slide của lab này, dựng riêng cho CT Library (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ dự án thật, biên dịch bằng <code>javac --release 8</code> rồi chạy — đúng những lần chạy bạn gặp lại ở các bước bên dưới.</p>`),
    walk('lab3', [
      [1, 'Lab 3 — CT Library: encapsulation and data rules',
        `<p class="y-chinh">🎯 Lab 3 = Chapter 3 on a real codebase: every field private, every public method a deliberate contract, and rules that live in exactly one place.</p>
<p>There are two kinds of work here. Feature work: the year rule, the email rule, delete, the report. Review work: reading code you did not write, finding what breaks the team's rules, and fixing it. Both are daily work in a software job.</p>`,
        `<p class="y-chinh">🎯 Lab 3 = Chương 3 trên một bộ mã thật: mọi trường private, mọi phương thức public là một cam kết có chủ đích, và mỗi luật nằm đúng một chỗ.</p>
<p>Có hai loại việc. Việc tính năng: luật năm, luật email, xoá, thống kê. Việc review: đọc code mình không viết, tìm chỗ phá luật của nhóm, rồi sửa. Đi làm phần mềm, ngày nào cũng có cả hai.</p>`],
      [2, 'Ticket CTL-3 — "the data is a mess"',
        `<p class="y-chinh">🎯 The ticket is driven by real bad data: a book "published" in 2999, two members with one email — plus a pull request that prints DEBUG lines.</p>
<p>Done means: PASS 176/176, <code>lint.py</code> goes from 6 violations to 0, nine wrong values are refused each with its own sentence, deleting B003 makes the next book B006, and no year is written in the code — the rule reads the machine's clock.</p>`,
        `<p class="y-chinh">🎯 Ticket sinh ra từ dữ liệu xấu có thật: một cuốn "xuất bản" năm 2999, hai thành viên chung một email — cộng một pull request in ra các dòng DEBUG.</p>
<p>Xong nghĩa là: PASS 176/176, <code>lint.py</code> từ 6 vi phạm về 0, chín giá trị sai bị từ chối mỗi giá trị một câu riêng, xoá B003 thì cuốn sau là B006, và không có năm nào viết cứng trong code — luật đọc đồng hồ của máy.</p>`],
      [3, 'Nine wrong values, nine sentences — who checks what',
        `<p class="y-chinh">🎯 The shape of one value is checked in utils; a rule that needs the data (duplicate, not found) is checked in the repository that owns the data.</p>
<p>Validation receives only the typed text, so it can say "2999 is in the future" or "this is not an email". It cannot say "this email is already used" — that needs the member list, and utils must never import a repository. So the repository throws, the controller catches, the view prints: the same path as the duplicate ISBN of Lab 1.</p>`,
        `<p class="y-chinh">🎯 Hình dạng của một giá trị kiểm ở utils; luật cần tới dữ liệu (trùng, không có) kiểm ở repository — nơi giữ dữ liệu.</p>
<p>Validation chỉ nhận chữ vừa gõ, nên nó nói được "2999 ở tương lai" hay "đây không phải email". Nó không nói được "email này đã có người dùng" — việc đó cần danh sách thành viên, mà utils không bao giờ được import repository. Nên repository ném lỗi, controller bắt, view in: đúng con đường của trùng ISBN ở Lab 1.</p>`],
      [4, 'TODO 3.1 — a year from the future',
        `<p class="y-chinh">🎯 "Not after this year" must read the current year at run time — <code>Calendar.getInstance().get(Calendar.YEAR)</code> — never a number typed into the code.</p>
<p>The constant <code>YEAR_MAX = 2100</code> of Lab 2 is gone. Two checks now, two messages: after the current year → "o tuong lai"; before 1450 → "phai tu 1450 tro di". Neither message prints the current year: if it did, <code>expected.txt</code> would be wrong on 1 January. Designing output that stays testable is part of the job.</p>`,
        `<p class="y-chinh">🎯 "Không quá năm nay" phải đọc năm hiện tại lúc chạy — <code>Calendar.getInstance().get(Calendar.YEAR)</code> — không bao giờ là một con số gõ cứng vào code.</p>
<p>Hằng <code>YEAR_MAX = 2100</code> của Lab 2 đã bị bỏ. Giờ có hai phép kiểm, hai câu báo: sau năm hiện tại → "o tuong lai"; trước 1450 → "phai tu 1450 tro di". Không câu nào in năm hiện tại: nếu in, <code>expected.txt</code> sẽ sai vào ngày 1 tháng 1. Thiết kế output để còn kiểm thử được cũng là một phần của công việc.</p>`],
      [5, 'TODO 3.2 — an email regex you can read',
        `<p class="y-chinh">🎯 Read the regex in four pieces: a name of letters/digits, optional <code>. _ -</code> followed by more letters/digits, one <code>@</code> and a domain label, then at least one <code>.something</code>.</p>
<p>That shape refuses <code>an@@ctlib.vn</code> (two @), <code>.an@ctlib.vn</code> (starts with a dot) and <code>an nguyen@ctlib.vn</code> (a space), and accepts <code>Cuong.Le@CTLib.vn</code> because <code>getEmail</code> lower-cases first. Lower-casing first also matters for the next TODO: two emails that differ only in capital letters are the same mailbox.</p>`,
        `<p class="y-chinh">🎯 Đọc regex thành bốn mảnh: phần tên gồm chữ/số, tuỳ chọn <code>. _ -</code> theo sau là chữ/số, một <code>@</code> và một nhãn tên miền, rồi ít nhất một <code>.đuôi</code>.</p>
<p>Hình dạng đó từ chối <code>an@@ctlib.vn</code> (hai @), <code>.an@ctlib.vn</code> (mở đầu bằng dấu chấm) và <code>an nguyen@ctlib.vn</code> (có dấu cách), và nhận <code>Cuong.Le@CTLib.vn</code> vì <code>getEmail</code> đổi sang chữ thường trước. Đổi chữ thường trước cũng quan trọng cho TODO kế: hai email chỉ khác chữ hoa là cùng một hộp thư.</p>`],
      [6, 'TODO 3.3 — one email, one member',
        `<p class="y-chinh">🎯 <code>MemberRepository.findByEmail</code> walks the list with <code>equals</code>; <code>addMember</code> throws a message naming the member who already owns that email.</p>
<p>The real output shows <code>AN.NGUYEN@ctlib.vn</code> refused because M002 already has <code>an.nguyen@ctlib.vn</code> — the lower-casing in Validation made the two equal. Note that <code>addMember</code> now <code>throws Exception</code>, so the controller wraps it in <code>try/catch</code> — and so does the loading of sample members.</p>`,
        `<p class="y-chinh">🎯 <code>MemberRepository.findByEmail</code> duyệt danh sách bằng <code>equals</code>; <code>addMember</code> ném lỗi kèm câu nêu thành viên đang giữ email đó.</p>
<p>Output thật cho thấy <code>AN.NGUYEN@ctlib.vn</code> bị từ chối vì M002 đã có <code>an.nguyen@ctlib.vn</code> — bước đổi chữ thường ở Validation làm hai chuỗi bằng nhau. Để ý <code>addMember</code> giờ <code>throws Exception</code>, nên controller bọc nó trong <code>try/catch</code> — cả chỗ nạp thành viên mẫu cũng vậy.</p>`],
      [7, 'TODO 3.4 — delete, and never give an id out twice',
        `<p class="y-chinh">🎯 Deleting removes the reference from the list; the counter <code>nextBookNumber</code> never goes back, so a deleted id is never given to another book.</p>
<p>The controller keeps a copy (<code>findById</code>) before deleting, to name the book in the message. Deleting B003 twice gives "Khong co sach nao mang ma B003" the second time; the next book added gets B006, not B003. Why it matters: an old loan record or receipt that says B003 must never start pointing to a different book.</p>
<p class="meo">🧠 After <code>bookList.remove(book)</code> nothing points to that Book any more — it becomes garbage, and the GC frees it later (2.A).</p>`,
        `<p class="y-chinh">🎯 Xoá là bỏ tham chiếu khỏi danh sách; bộ đếm <code>nextBookNumber</code> không bao giờ lùi, nên mã đã xoá không bao giờ được cấp cho cuốn khác.</p>
<p>Controller lấy một bản sao (<code>findById</code>) trước khi xoá, để nêu tên sách trong câu báo. Xoá B003 hai lần thì lần hai nhận "Khong co sach nao mang ma B003"; cuốn thêm tiếp theo mang mã B006, không phải B003. Vì sao quan trọng: một phiếu mượn hay biên nhận cũ ghi B003 không bao giờ được bắt đầu trỏ sang cuốn khác.</p>
<p class="meo">🧠 Sau <code>bookList.remove(book)</code> không còn gì trỏ tới Book đó — nó thành rác, và GC dọn sau (2.A).</p>`],
      [8, 'TODO 3.5 — the report: service works on copies',
        `<p class="y-chinh">🎯 The report is business work, so it lives in <code>BookService.buildReport</code>, which receives the copies from <code>findAll()</code> — the service never sees the repository.</p>
<p>One loop adds up the copies, counts the books with 0 copies and keeps the oldest book (the first one met wins a tie). The number of titles is simply the size of the list. The result travels in a new DTO, <code>LibraryReportDTO</code>, to a new view, <code>ReportView</code>, whose <code>display()</code> prints four lines.</p>`,
        `<p class="y-chinh">🎯 Thống kê là nghiệp vụ nên nằm ở <code>BookService.buildReport</code>, nhận các bản sao từ <code>findAll()</code> — service không bao giờ thấy repository.</p>
<p>Một vòng lặp cộng số bản, đếm sách có 0 bản và giữ cuốn cũ nhất (trùng năm thì cuốn gặp trước thắng). Số đầu sách đơn giản là độ dài danh sách. Kết quả đi trong một DTO mới, <code>LibraryReportDTO</code>, tới một view mới, <code>ReportView</code>, có <code>display()</code> in bốn dòng.</p>`],
      [9, 'Access modifiers in CT Library — one reason each',
        `<p class="y-chinh">🎯 Every member of every class has the narrowest access that still lets the program work — and you can say why in one sentence.</p>
<p>Fields: always <code>private</code>. Methods another class calls: <code>public</code>, they are the contract between layers. Helpers used inside one class (<code>findBookById</code>, <code>toTitleCase</code>, <code>parseInteger</code>): <code>private</code>, so you may change them freely. Classes with only static members (<code>Validation</code>, <code>Message</code>, <code>Constants</code>, <code>Main</code>): a <code>private</code> constructor, so no object can be created. Package-private has no use in this app; <code>protected</code> arrives with inheritance in Lab 4.</p>`,
        `<p class="y-chinh">🎯 Mọi thành viên của mọi lớp có mức truy cập hẹp nhất mà chương trình vẫn chạy — và bạn nói được lý do trong một câu.</p>
<p>Trường: luôn <code>private</code>. Phương thức lớp khác gọi: <code>public</code>, đó là cam kết giữa các tầng. Hàm phụ chỉ dùng trong một lớp (<code>findBookById</code>, <code>toTitleCase</code>, <code>parseInteger</code>): <code>private</code>, để bạn đổi thoải mái. Lớp chỉ có thành viên static (<code>Validation</code>, <code>Message</code>, <code>Constants</code>, <code>Main</code>): constructor <code>private</code>, để không ai tạo được đối tượng. Mức package-private (không ghi gì) không có chỗ dùng trong ứng dụng này; <code>protected</code> tới cùng kế thừa ở Lab 4.</p>`],
      [10, 'What javac says when you break the rules',
        `<p class="y-chinh">🎯 Access rules are enforced at compile time: touching a private field or a package-private constructor from another package is a compile error, not a warning.</p>
<p>The small project <code>bay/truy-cap</code> has a <code>Book</code> in package <code>model</code> with a private <code>title</code> and a constructor with no modifier, and a <code>Main</code> in package <code>main</code> that tries both. javac answers with two errors that say exactly why. This is what "encapsulation" buys you: the rule cannot be forgotten.</p>`,
        `<p class="y-chinh">🎯 Luật truy cập được kiểm lúc biên dịch: chạm trường private hay constructor package-private từ package khác là lỗi biên dịch, không phải cảnh báo.</p>
<p>Dự án nhỏ <code>bay/truy-cap</code> có lớp <code>Book</code> trong package <code>model</code> với trường <code>title</code> private và một constructor không ghi modifier, cùng lớp <code>Main</code> trong package <code>main</code> thử cả hai. javac trả lời bằng hai lỗi nói rõ lý do. Đó là thứ "đóng gói" mang lại: luật không thể bị quên.</p>`],
      [11, 'static: where it is allowed — and the bug it hides',
        `<p class="y-chinh">🎯 A static field belongs to the class: one copy shared by every object. A static id counter makes a brand-new, empty repository start at B004.</p>
<p>That is why the reviewer allows <code>static</code> only in utils (functions that need no object, like <code>Validation.getYear</code>), constants, and the helper methods of <code>Main</code> (called from the static <code>main</code>). The instance counter of CT Library starts at B001 in every new repository — which is what tests, and later a second branch library, need.</p>`,
        `<p class="y-chinh">🎯 Trường static thuộc về lớp: một bản duy nhất dùng chung cho mọi đối tượng. Bộ đếm mã static làm một repository mới tinh, rỗng, bắt đầu ở B004.</p>
<p>Vì vậy thầy chỉ cho <code>static</code> ở utils (hàm không cần đối tượng, như <code>Validation.getYear</code>), constants, và các hàm phụ của <code>Main</code> (được gọi từ <code>main</code> static). Bộ đếm theo đối tượng của CT Library bắt đầu từ B001 ở mọi repository mới — đúng thứ mà kiểm thử, và sau này một thư viện chi nhánh thứ hai, cần.</p>`],
      [12, 'Trap: every field private — and the list still leaks',
        `<p class="y-chinh">🎯 <code>private</code> protects the field, not the object it points to: a getter that returns the list itself lets anyone <code>clear()</code> the library.</p>
<p>In the real run, clearing the result of <code>findAll()</code> leaves 2 books — it was a copy — while clearing the result of <code>getTitleList()</code> leaves 0. CT Library's repositories never return their own list: <code>findAll</code> builds new DTOs every time. (Exercise 5 of 3.2 shows the same leak with arrays and dates.)</p>`,
        `<p class="y-chinh">🎯 <code>private</code> bảo vệ cái trường, không bảo vệ đối tượng mà trường trỏ tới: một getter trả về chính danh sách cho phép bất kỳ ai <code>clear()</code> cả thư viện.</p>
<p>Trong lần chạy thật, xoá kết quả của <code>findAll()</code> vẫn còn 2 cuốn — đó là bản sao — còn xoá kết quả của <code>getTitleList()</code> thì còn 0. Repository của CT Library không bao giờ trả danh sách của chính nó: <code>findAll</code> dựng DTO mới mỗi lần. (Bài 5 của 3.2 cho thấy cùng kiểu rò rỉ với mảng và ngày tháng.)</p>`],
      [13, "TODO 3.6 — review your teammate's PR with lint.py",
        `<p class="y-chinh">🎯 Six violations in five files, each one a rule from the reviewer's sheet: a model import in a controller, a DEBUG print with a hard-coded string, a hard-coded prompt, a public field, a static counter.</p>
<p>None of them changes what the grader sees except the DEBUG line — which is exactly why a passing test is not enough. Fix them in any order and re-run <code>lint.py</code> until it prints "✓ … — sạch". In a real team this is what a code review is: someone else reading your diff against the team's rules.</p>`,
        `<p class="y-chinh">🎯 Sáu vi phạm trong năm tệp, mỗi cái là một luật trên tờ checklist của thầy: controller import model, dòng in DEBUG kèm chuỗi viết cứng, câu nhắc viết cứng, trường public, bộ đếm static.</p>
<p>Ngoài dòng DEBUG, không cái nào làm đổi thứ bộ chấm thấy — chính vì thế qua kiểm thử là chưa đủ. Sửa theo thứ tự nào cũng được, chạy lại <code>lint.py</code> tới khi in "✓ … — sạch". Ở nhóm thật, review code chính là vậy: người khác đọc thay đổi của bạn đối chiếu với luật chung.</p>`],
      [14, 'Green: PASS 176/176 and a silent reviewer',
        `<p class="y-chinh">🎯 Two green lights, both required: the grader (behaviour) and <code>lint.py</code> (the rules). LAB211 checks the second one first.</p>
<p>A good order: fix the six lint lines first (they are quick and do not change the output), then TODO 3.1–3.5 one by one with the grader after each, then <code>lint.py</code> once more, then commit.</p>`,
        `<p class="y-chinh">🎯 Hai đèn xanh, phải có đủ cả hai: bộ chấm (hành vi) và <code>lint.py</code> (luật). LAB211 kiểm cái thứ hai trước.</p>
<p>Thứ tự nên làm: sửa sáu dòng lint trước (nhanh và không đổi output), rồi TODO 3.1–3.5 từng cái một, chạy bộ chấm sau mỗi cái, rồi <code>lint.py</code> lần nữa, rồi commit.</p>`],
      [15, 'Rubric — 10 points, PE style',
        `<p class="y-chinh">🎯 Points follow the ticket: rules, delete, report, the clean review — plus one oral question, because the LAB211 reviewer always asks "why is this private?".</p>
<p>Answer the self-check aloud. If you can explain every modifier and every <code>static</code> in your project in one sentence each, you are ready for the LAB211 oral.</p>`,
        `<p class="y-chinh">🎯 Điểm đi theo ticket: luật, xoá, thống kê, lần review sạch — cộng một câu vấn đáp, vì thầy LAB211 lúc nào cũng hỏi "sao cái này private?".</p>
<p>Trả lời thành tiếng phần tự kiểm. Nếu giải thích được mọi modifier và mọi <code>static</code> trong dự án của mình, mỗi cái một câu, là bạn sẵn sàng cho phần vấn đáp LAB211.</p>`],
    ]),
    bi(`<h2>1. The ticket</h2>
<div class="callout"><p><strong>CTL-3 · CT Library · priority: high.</strong> "Data problems this week: a book 'published' in 2999, a copy count of 100, two members sharing one email (and one email written <code>an@@ctlib.vn</code>). Tighten the rules. We also need to <em>delete</em> a book — but an id must never be reused — and a small report (titles, copies, out-of-stock, oldest book). Finally, Binh's pull request is on top of yours: review it, our reviewer's tool must be silent before we merge." — the team lead</p></div>
<table>
<thead><tr><th>You need</th><th>From</th></tr></thead>
<tbody>
<tr><td>packages and the folder tree, <code>import</code></td><td>3.A (pro8 slides 26–28)</td></tr>
<tr><td>access modifiers: public, protected, default, private — the 4×4 table</td><td>3.A (pro8 slides 29–32)</td></tr>
<tr><td>designing a class that hides its state (case study)</td><td>3.A-2 (pro8 slides 34–40), 3.2 exercise 5</td></tr>
<tr><td><code>static</code> members, <code>Calendar</code></td><td>1.D, 1.E · Java API</td></tr>
<tr><td>regex with <code>matches</code></td><td>1.F slide 26</td></tr>
</tbody>
</table>`,
    `<h2>1. Ticket</h2>
<div class="callout"><p><strong>CTL-3 · CT Library · ưu tiên: cao.</strong> "Tuần này dữ liệu có vấn đề: một cuốn 'xuất bản' năm 2999, số bản 100, hai thành viên chung một email (và một email gõ <code>an@@ctlib.vn</code>). Siết luật lại. Ta cũng cần <em>xoá</em> sách — nhưng mã không bao giờ được dùng lại — và một bản thống kê nhỏ (số đầu sách, tổng số bản, đầu sách hết bản, sách cũ nhất). Cuối cùng, pull request của Bình đè lên của bạn: review nó, công cụ của thầy phải im lặng rồi mới merge." — trưởng nhóm</p></div>
<table>
<thead><tr><th>Bạn cần</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>package và cây thư mục, <code>import</code></td><td>3.A (pro8 slide 26–28)</td></tr>
<tr><td>access modifier: public, protected, default, private — bảng 4×4</td><td>3.A (pro8 slide 29–32)</td></tr>
<tr><td>thiết kế lớp biết giấu trạng thái (case study)</td><td>3.A-2 (pro8 slide 34–40), 3.2 bài 5</td></tr>
<tr><td>thành viên <code>static</code>, <code>Calendar</code></td><td>1.D, 1.E · Java API</td></tr>
<tr><td>regex với <code>matches</code></td><td>1.F slide 26</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Requirements and acceptance criteria</h2>
<ol>
<li><strong>Year</strong>: after the current year of the machine → "o tuong lai"; before 1450 → "phai tu 1450 tro di"; no year written in the code; no message prints the current year.</li>
<li><strong>Copies</strong> 0–99 (as Lab 2); <strong>ISBN</strong> unique (as Lab 1).</li>
<li><strong>Email</strong>: lower-cased, then must match <code>Constants.REGEX_EMAIL</code>; an email already used by a member → refused with the owner's id and name (checked in <code>MemberRepository</code>).</li>
<li><strong>Delete</strong> (menu 5): by id; unknown id → message; the message after deleting names the book; ids are never reused (B003 deleted ⇒ next book B006).</li>
<li><strong>Report</strong> (menu 8): number of titles, total copies, titles with 0 copies, the oldest book and its year (empty library ⇒ a dedicated line) — computed in <code>BookService</code> from the repository's copies, printed by <code>ReportView</code>.</li>
<li><strong>Review</strong>: <code>lint.py</code> on your project prints <code>✓ … — sạch</code> (the starter has 6 violations).</li>
<li>Every member has the narrowest access possible; <code>static</code> only in utils, constants and <code>Main</code>'s methods.</li>
</ol>
<div class="callout ok"><p><strong>Done means:</strong> <code>check.sh</code> prints <code>PASS: 176/176 dong khop expected.txt</code> · <code>lint.py</code> 0 violations · <code>javac --release 8</code> compiles · you can justify every <code>public</code> and every <code>static</code> in one sentence · one more commit.</p></div>`,
    `<h2>2. Yêu cầu và tiêu chí đạt</h2>
<ol>
<li><strong>Năm</strong>: sau năm hiện tại của máy → "o tuong lai"; trước 1450 → "phai tu 1450 tro di"; không viết năm nào trong code; không câu báo nào in năm hiện tại.</li>
<li><strong>Số bản</strong> 0–99 (như Lab 2); <strong>ISBN</strong> không trùng (như Lab 1).</li>
<li><strong>Email</strong>: đổi chữ thường, rồi phải khớp <code>Constants.REGEX_EMAIL</code>; email đã có thành viên dùng → từ chối, nêu mã và họ tên người đang giữ (kiểm ở <code>MemberRepository</code>).</li>
<li><strong>Xoá</strong> (menu 5): theo mã; mã không có → thông báo; câu báo sau khi xoá nêu tên sách; mã không bao giờ cấp lại (xoá B003 ⇒ cuốn sau là B006).</li>
<li><strong>Thống kê</strong> (menu 8): số đầu sách, tổng số bản, số đầu sách hết bản, sách cũ nhất kèm năm (thư viện rỗng ⇒ một dòng riêng) — tính ở <code>BookService</code> từ các bản sao của repository, in bằng <code>ReportView</code>.</li>
<li><strong>Review</strong>: <code>lint.py</code> trên dự án của bạn in <code>✓ … — sạch</code> (starter có 6 vi phạm).</li>
<li>Mọi thành viên có mức truy cập hẹp nhất có thể; <code>static</code> chỉ ở utils, constants và các hàm của <code>Main</code>.</li>
</ol>
<div class="callout ok"><p><strong>Xong nghĩa là:</strong> <code>check.sh</code> in <code>PASS: 176/176 dong khop expected.txt</code> · <code>lint.py</code> 0 vi phạm · <code>javac --release 8</code> biên dịch được · bạn giải thích được mọi <code>public</code> và mọi <code>static</code> bằng một câu · thêm một commit.</p></div>`),
    bi(`<h2>3. Files</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab3-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab3-starter.zip</span><span class="lc-sub">Lab 2 solution + Lab 3 skeleton · TODO 3.1–3.5 · 6 planted lint violations (TODO 3.6) · harness (176 lines) · CheckHarness</span></span>
<span class="lc-cta">Download</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab3-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab3-solution.zip</span><span class="lc-sub">the full solution — open it only after your own attempt</span></span>
<span class="lc-cta">Download</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab3/src/  (new or changed since Lab 2)
  utils/Validation.java            TODO 3.1 getYear · TODO 3.2 getEmail
  repository/MemberRepository.java TODO 3.3 findByEmail (+ addMember throws on a duplicate — given)
  repository/BookRepository.java   TODO 3.4 deleteBook
  service/BookService.java         TODO 3.5 buildReport
  dto/LibraryReportDTO.java        (given)   view/ReportView.java   (given)
  controller/BookController.java   deleteBook, showReport (given)
  main/Main.java                   8 menu items (given)
  TODO 3.6 — six planted violations in Book, BookRepository, BookController, MemberController, Main</code></pre>`,
    `<h2>3. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab3-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab3-starter.zip</span><span class="lc-sub">đáp án Lab 2 + khung Lab 3 · TODO 3.1–3.5 · 6 vi phạm lint cài sẵn (TODO 3.6) · harness (176 dòng) · CheckHarness</span></span>
<span class="lc-cta">Tải về</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v1/CTLibrary-Lab3-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab3-solution.zip</span><span class="lc-sub">đáp án đầy đủ — chỉ mở sau khi đã tự làm</span></span>
<span class="lc-cta">Tải về</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab3/src/  (mới hoặc đổi so với Lab 2)
  utils/Validation.java            TODO 3.1 getYear · TODO 3.2 getEmail
  repository/MemberRepository.java TODO 3.3 findByEmail (+ addMember ném lỗi khi trùng — cho sẵn)
  repository/BookRepository.java   TODO 3.4 deleteBook
  service/BookService.java         TODO 3.5 buildReport
  dto/LibraryReportDTO.java        (cho sẵn)   view/ReportView.java   (cho sẵn)
  controller/BookController.java   deleteBook, showReport (cho sẵn)
  main/Main.java                   8 mục menu (cho sẵn)
  TODO 3.6 — sáu vi phạm cài sẵn trong Book, BookRepository, BookController, MemberController, Main</code></pre>`),
    bi(`<h2>4. Step by step</h2>
<h4>Step 0 — the review first: run lint.py on the starter (20 min)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab3</code></pre>
<div class="out">✗ CTLibrary-Lab3 — 6 vi phạm<br>
&nbsp;&nbsp;[LAYER] src/controller/BookController.java:8 — package 'controller' không được import 'model' (Guide.xlsx)<br>
&nbsp;&nbsp;[PRINT] src/controller/MemberController.java:54 — không được print ngoài view và main (Guide.xlsx)<br>
&nbsp;&nbsp;[HARDCODE] src/controller/MemberController.java:54 — chuỗi "DEBUG them: " phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/main/Main.java:163 — chuỗi "Lua chon: " phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[FIELD] src/model/Book.java:27 — trường 'copies' phải private (đóng gói)<br>
&nbsp;&nbsp;[STATIC] src/repository/BookRepository.java:23 — package 'repository' không được dùng static (Guide.xlsx)</div>
<p>Read each line: rule, file, line number. Fix them (the table on slide 13 has the fix for each), run <code>lint.py</code> again until it is silent, then commit: <code>git commit -m "Lab 3.6: review fixes"</code>. Only the DEBUG line changes the program's output — and it would make the grader fail at the members step.</p>

<h4>Step 1 — TODO 3.1 the year from the clock (15 min)</h4>
<details><summary>Hint</summary><p><code>int currentYear = Calendar.getInstance().get(Calendar.YEAR);</code> (import <code>java.util.Calendar</code> in utils). Check "future" before "too early", each with its own message.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Doi chu thanh nam xuat ban: tu YEAR_MIN, khong lon hon nam hien tai cua may
public static int getYear(String input) throws Exception {
    // Nam sau khi doi va nam hien tai (lay luc chay, khong viet cung)
    int year = parseInteger(input, Message.FIELD_YEAR);
    int currentYear = Calendar.getInstance().get(Calendar.YEAR);

    // O tuong lai thi bao rieng (khong in nam hien tai de output on dinh)
    if (year &gt; currentYear) {
        throw new Exception(String.format(Message.ERROR_YEAR_FUTURE, year));
    }

    // Truoc YEAR_MIN thi bao nam nho nhat va so da nhap
    if (year &lt; Constants.YEAR_MIN) {
        throw new Exception(String.format(Message.ERROR_YEAR_MIN, Constants.YEAR_MIN, year));
    }

    return year;
}</code></pre>
</details>

<h4>Step 2 — TODO 3.2 the email shape (10 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Kiem email co ban: co phan truoc @, co ten mien co dau cham sau @
public static String getEmail(String input) throws Exception {
    // Email bo dau cach 2 dau, viet thuong
    String email = input.trim().toLowerCase();

    // Sai dang thi bao lai dung chu nguoi dung go
    if (!email.matches(Constants.REGEX_EMAIL)) {
        throw new Exception(String.format(Message.ERROR_EMAIL, input.trim()));
    }

    return email;
}</code></pre>
</details>

<h4>Step 3 — TODO 3.3 one email per member (15 min)</h4>
<details><summary>Solution — findByEmail (addMember already calls it)</summary>
<pre class="trich"><code class="language-java">// Tim thanh vien theo email; khong co thi tra null
private Member findByEmail(String email) {
    // Duyet tung thanh vien de so email
    for (Member member : memberList) {
        // So chuoi bang equals (email da viet thuong o utils)
        if (member.getEmail().equals(email)) {
            return member;
        }
    }

    return null;
}</code></pre>
<pre class="trich"><code class="language-java">// Them 1 thanh vien tu phieu nhap, tra ve ma vua cap; email da co thi nem loi
public String addMember(MemberRequestDTO memberRequestDTO) throws Exception {
    // Nguoi dang giu email nay (null neu chua co) va ma se cap
    Member existingMember = findByEmail(memberRequestDTO.getEmail());
    String newId = "";

    // Trung email thi bao ro email dang thuoc ve ai
    if (existingMember != null) {
        throw new Exception(String.format(Message.ERROR_DUPLICATE_EMAIL,
                existingMember.getEmail(), existingMember.getId(), existingMember.getName()));
    }

    // Cap ma moi, tang so thu tu cho lan sau roi them thanh vien moi
    newId = String.format(Constants.MEMBER_ID_FORMAT, nextMemberNumber);
    nextMemberNumber++;
    memberList.add(new Member(newId, memberRequestDTO.getName(), memberRequestDTO.getEmail()));
    return newId;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ho ten: Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an@@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap ".an@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an nguyen@ctlib.vn". Moi nhap lai.<br>
Email: Email an.nguyen@ctlib.vn da thuoc ve M002 "Nguyen Van An". Moi thanh vien dung 1 email rieng.<br>
…</div>

<h4>Step 4 — TODO 3.4 delete without reusing ids (15 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Xoa sach mang ma nay; khong co ma thi nem loi. nextBookNumber KHONG lui lai
public void deleteBook(String id) throws Exception {
    // Sach mang ma nay (null neu khong co)
    Book book = findBookById(id);

    // Khong co ma thi bao loi
    if (book == null) {
        throw new Exception(String.format(Message.ERROR_BOOK_NOT_FOUND, id));
    }

    // Bo tham chieu khoi danh sach; khong con ai tro toi thi doi tuong thanh rac cho GC
    bookList.remove(book);
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ma sach (vi du B001): Da xoa sach B003 "Java Concurrency In Practice". Ma B003 se khong duoc cap lai cho sach khac.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: So ban: Da them sach B006 "Design Patterns". Thu vien co 5 dau sach.<br>
…</div>

<h4>Step 5 — TODO 3.5 the report (25 min)</h4>
<details><summary>Hint</summary><p>Start from <code>new LibraryReportDTO()</code> (all zeros, empty title). In the loop: add the copies; count <code>copies == 0</code>; replace the oldest book when the report has none yet or the book is older. After the loop, the number of titles is <code>bookList.size()</code>.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Thong ke tu danh sach Controller dua vao: so dau sach, tong so ban, so dau sach het,
// sach cu nhat (trung nam thi giu sach gap truoc)
public LibraryReportDTO buildReport(ArrayList&lt;BookResponseDTO&gt; bookList) {
    // Bao cao rong: moi so bang 0, chua co sach cu nhat
    LibraryReportDTO report = new LibraryReportDTO();

    // Cong don tung sach vao bao cao
    for (BookResponseDTO book : bookList) {
        report.setTotalCopies(report.getTotalCopies() + book.getCopies());

        // Sach het ban thi dem them 1
        if (book.getCopies() == 0) {
            report.setOutOfStockTitles(report.getOutOfStockTitles() + 1);
        }

        // Sach dau tien hoac cu hon sach cu nhat dang giu thi thay
        if ((report.getOldestTitle().isEmpty()) || (book.getYear() &lt; report.getOldestYear())) {
            report.setOldestTitle(book.getTitle());
            report.setOldestYear(book.getYear());
        }
    }

    // So dau sach la so dong cua danh sach
    report.setTotalTitles(bookList.size());
    return report;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Thong ke thu vien ---<br>
So dau sach &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 14<br>
Dau sach het ban : 1<br>
Sach cu nhat &nbsp;&nbsp;&nbsp;&nbsp;: Design Patterns (1994)<br>
…</div>

<h4>Step 6 — grade, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 176/176 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab3-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab3-Solution — sạch</div>`,
    `<h2>4. Làm từng bước</h2>
<h4>Bước 0 — review trước: chạy lint.py trên starter (20 phút)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab3</code></pre>
<div class="out">✗ CTLibrary-Lab3 — 6 vi phạm<br>
&nbsp;&nbsp;[LAYER] src/controller/BookController.java:8 — package 'controller' không được import 'model' (Guide.xlsx)<br>
&nbsp;&nbsp;[PRINT] src/controller/MemberController.java:54 — không được print ngoài view và main (Guide.xlsx)<br>
&nbsp;&nbsp;[HARDCODE] src/controller/MemberController.java:54 — chuỗi "DEBUG them: " phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[HARDCODE] src/main/Main.java:163 — chuỗi "Lua chon: " phải khai báo ở constants (Message/Constants)<br>
&nbsp;&nbsp;[FIELD] src/model/Book.java:27 — trường 'copies' phải private (đóng gói)<br>
&nbsp;&nbsp;[STATIC] src/repository/BookRepository.java:23 — package 'repository' không được dùng static (Guide.xlsx)</div>
<p>Đọc từng dòng: luật, tệp, số dòng. Sửa hết (bảng ở slide 13 có cách sửa cho từng cái), chạy lại <code>lint.py</code> tới khi im lặng, rồi commit: <code>git commit -m "Lab 3.6: review fixes"</code>. Chỉ dòng DEBUG làm đổi output của chương trình — và nó sẽ làm bộ chấm hỏng ở bước thêm thành viên.</p>

<h4>Bước 1 — TODO 3.1 năm lấy từ đồng hồ (15 phút)</h4>
<details><summary>Gợi ý</summary><p><code>int currentYear = Calendar.getInstance().get(Calendar.YEAR);</code> (import <code>java.util.Calendar</code> trong utils). Kiểm "tương lai" trước "quá sớm", mỗi cái một câu báo riêng.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Doi chu thanh nam xuat ban: tu YEAR_MIN, khong lon hon nam hien tai cua may
public static int getYear(String input) throws Exception {
    // Nam sau khi doi va nam hien tai (lay luc chay, khong viet cung)
    int year = parseInteger(input, Message.FIELD_YEAR);
    int currentYear = Calendar.getInstance().get(Calendar.YEAR);

    // O tuong lai thi bao rieng (khong in nam hien tai de output on dinh)
    if (year &gt; currentYear) {
        throw new Exception(String.format(Message.ERROR_YEAR_FUTURE, year));
    }

    // Truoc YEAR_MIN thi bao nam nho nhat va so da nhap
    if (year &lt; Constants.YEAR_MIN) {
        throw new Exception(String.format(Message.ERROR_YEAR_MIN, Constants.YEAR_MIN, year));
    }

    return year;
}</code></pre>
</details>

<h4>Bước 2 — TODO 3.2 hình dạng email (10 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Kiem email co ban: co phan truoc @, co ten mien co dau cham sau @
public static String getEmail(String input) throws Exception {
    // Email bo dau cach 2 dau, viet thuong
    String email = input.trim().toLowerCase();

    // Sai dang thi bao lai dung chu nguoi dung go
    if (!email.matches(Constants.REGEX_EMAIL)) {
        throw new Exception(String.format(Message.ERROR_EMAIL, input.trim()));
    }

    return email;
}</code></pre>
</details>

<h4>Bước 3 — TODO 3.3 mỗi thành viên một email (15 phút)</h4>
<details><summary>Lời giải — findByEmail (addMember đã gọi sẵn)</summary>
<pre class="trich"><code class="language-java">// Tim thanh vien theo email; khong co thi tra null
private Member findByEmail(String email) {
    // Duyet tung thanh vien de so email
    for (Member member : memberList) {
        // So chuoi bang equals (email da viet thuong o utils)
        if (member.getEmail().equals(email)) {
            return member;
        }
    }

    return null;
}</code></pre>
<pre class="trich"><code class="language-java">// Them 1 thanh vien tu phieu nhap, tra ve ma vua cap; email da co thi nem loi
public String addMember(MemberRequestDTO memberRequestDTO) throws Exception {
    // Nguoi dang giu email nay (null neu chua co) va ma se cap
    Member existingMember = findByEmail(memberRequestDTO.getEmail());
    String newId = "";

    // Trung email thi bao ro email dang thuoc ve ai
    if (existingMember != null) {
        throw new Exception(String.format(Message.ERROR_DUPLICATE_EMAIL,
                existingMember.getEmail(), existingMember.getId(), existingMember.getName()));
    }

    // Cap ma moi, tang so thu tu cho lan sau roi them thanh vien moi
    newId = String.format(Constants.MEMBER_ID_FORMAT, nextMemberNumber);
    nextMemberNumber++;
    memberList.add(new Member(newId, memberRequestDTO.getName(), memberRequestDTO.getEmail()));
    return newId;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ho ten: Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an@@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap ".an@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an nguyen@ctlib.vn". Moi nhap lai.<br>
Email: Email an.nguyen@ctlib.vn da thuoc ve M002 "Nguyen Van An". Moi thanh vien dung 1 email rieng.<br>
…</div>

<h4>Bước 4 — TODO 3.4 xoá mà không dùng lại mã (15 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Xoa sach mang ma nay; khong co ma thi nem loi. nextBookNumber KHONG lui lai
public void deleteBook(String id) throws Exception {
    // Sach mang ma nay (null neu khong co)
    Book book = findBookById(id);

    // Khong co ma thi bao loi
    if (book == null) {
        throw new Exception(String.format(Message.ERROR_BOOK_NOT_FOUND, id));
    }

    // Bo tham chieu khoi danh sach; khong con ai tro toi thi doi tuong thanh rac cho GC
    bookList.remove(book);
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ma sach (vi du B001): Da xoa sach B003 "Java Concurrency In Practice". Ma B003 se khong duoc cap lai cho sach khac.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: So ban: Da them sach B006 "Design Patterns". Thu vien co 5 dau sach.<br>
…</div>

<h4>Bước 5 — TODO 3.5 thống kê (25 phút)</h4>
<details><summary>Gợi ý</summary><p>Bắt đầu từ <code>new LibraryReportDTO()</code> (mọi số bằng 0, tên rỗng). Trong vòng lặp: cộng số bản; đếm <code>copies == 0</code>; thay sách cũ nhất khi báo cáo chưa có cuốn nào hoặc cuốn đang xét cũ hơn. Sau vòng lặp, số đầu sách là <code>bookList.size()</code>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Thong ke tu danh sach Controller dua vao: so dau sach, tong so ban, so dau sach het,
// sach cu nhat (trung nam thi giu sach gap truoc)
public LibraryReportDTO buildReport(ArrayList&lt;BookResponseDTO&gt; bookList) {
    // Bao cao rong: moi so bang 0, chua co sach cu nhat
    LibraryReportDTO report = new LibraryReportDTO();

    // Cong don tung sach vao bao cao
    for (BookResponseDTO book : bookList) {
        report.setTotalCopies(report.getTotalCopies() + book.getCopies());

        // Sach het ban thi dem them 1
        if (book.getCopies() == 0) {
            report.setOutOfStockTitles(report.getOutOfStockTitles() + 1);
        }

        // Sach dau tien hoac cu hon sach cu nhat dang giu thi thay
        if ((report.getOldestTitle().isEmpty()) || (book.getYear() &lt; report.getOldestYear())) {
            report.setOldestTitle(book.getTitle());
            report.setOldestYear(book.getYear());
        }
    }

    // So dau sach la so dong cua danh sach
    report.setTotalTitles(bookList.size());
    return report;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Thong ke thu vien ---<br>
So dau sach &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 14<br>
Dau sach het ban : 1<br>
Sach cu nhat &nbsp;&nbsp;&nbsp;&nbsp;: Design Patterns (1994)<br>
…</div>

<h4>Bước 6 — chấm, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 176/176 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab3-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab3-Solution — sạch</div>`),
    bi(`<h2>5. The full solution — and the proof it is right</h2>
<p>The solution zip is the complete project: <code>lint.py</code> 0 violations, <code>javac --release 8</code>, the same output on a real JDK 8, and 176/176 on the grader.</p>
<details><summary>Full run — java -cp build main.Main &lt; harness/input.txt (176 lines)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So dau sach &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 4<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 10<br>
Dau sach het ban : 0<br>
Sach cu nhat &nbsp;&nbsp;&nbsp;&nbsp;: Head First Java (2005)<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: Nam xuat ban 2999 o tuong lai: khong duoc lon hon nam hien tai. Moi nhap lai.<br>
Nam xuat ban: Nam xuat ban phai tu 1450 tro di (sach in dau tien ~1450), ban nhap 1449. Moi nhap lai.<br>
Nam xuat ban: So ban: So ban phai tu 0 den 99, ban nhap 100. Moi nhap lai.<br>
So ban: So ban phai tu 0 den 99, ban nhap -3. Moi nhap lai.<br>
So ban: Da them sach B005 "Refactoring". Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: So ban: Da co sach mang ISBN 9780134685991 (B002 "Effective Java"). Moi dau sach chi them 1 lan.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): So ban: Da cap nhat so ban cua B002 "Effective Java": 2 -&gt; 5.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Xoa sach ---<br>
Ma sach (vi du B001): Da xoa sach B003 "Java Concurrency In Practice". Ma B003 se khong duoc cap lai cho sach khac.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Xoa sach ---<br>
Ma sach (vi du B001): Khong co sach nao mang ma B003. Hay chon 2 de xem ma sach roi thu lai.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: So ban: Da them sach B006 "Design Patterns". Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B006 &nbsp;9780201633610 &nbsp;1994 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Erich Gamma &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Design Patterns<br>
2 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
3 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
4 &nbsp;&nbsp;B005 &nbsp;9780134757599 &nbsp;2018 &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Martin Fowler &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Refactoring<br>
5 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an@@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap ".an@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an nguyen@ctlib.vn". Moi nhap lai.<br>
Email: Email an.nguyen@ctlib.vn da thuoc ve M002 "Nguyen Van An". Moi thanh vien dung 1 email rieng.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Email: Da them thanh vien M003 "Le Van Cuong". Cau lac bo co 3 thanh vien.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Danh sach thanh vien ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email<br>
1 &nbsp;&nbsp;M003 &nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cuong.le@ctlib.vn<br>
2 &nbsp;&nbsp;M002 &nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;an.nguyen@ctlib.vn<br>
3 &nbsp;&nbsp;M001 &nbsp;Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;binh.tran@ctlib.vn<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So dau sach &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 14<br>
Dau sach het ban : 1<br>
Sach cu nhat &nbsp;&nbsp;&nbsp;&nbsp;: Design Patterns (1994)<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 3 chi nam trong bo nho.</div>
</details>
<details><summary>ReportView.java and LibraryReportDTO — the new view and its data</summary>
<pre><code class="language-java">package view;

import constants.Message;
import dto.LibraryReportDTO;

/**
 * Man hinh thong ke: in bao cao Controller dua vao qua setter.
 * display() khong nhan tham so, goi 1 lan cho moi lan thong ke.
 *
 * @author CuongThai Academy
 */
public class ReportView {

    // Bao cao can in
    private LibraryReportDTO report;

    // Tao View voi bao cao rong
    public ReportView() {
        report = new LibraryReportDTO();
    }

    // Controller dua bao cao vao View
    public void setReport(LibraryReportDTO report) {
        this.report = report;
    }

    // In tung dong cua bao cao
    public void display() {
        System.out.println(String.format(Message.REPORT_TITLES, report.getTotalTitles()));
        System.out.println(String.format(Message.REPORT_COPIES, report.getTotalCopies()));
        System.out.println(String.format(Message.REPORT_OUT_OF_STOCK,
                report.getOutOfStockTitles()));

        // Thu vien rong thi khong co sach cu nhat
        if (report.getOldestTitle().isEmpty()) {
            System.out.println(Message.REPORT_NO_BOOK);
        } else {
            // Co sach thi in ten + nam cua sach cu nhat
            System.out.println(String.format(Message.REPORT_OLDEST, report.getOldestTitle(),
                    report.getOldestYear()));
        }
    }
}</code></pre>
</details>`,
    `<h2>5. Đáp án đầy đủ — và bằng chứng là đúng</h2>
<p>Tệp zip đáp án là trọn dự án: <code>lint.py</code> 0 vi phạm, <code>javac --release 8</code>, chạy trên JDK 8 thật ra y hệt, và bộ chấm 176/176.</p>
<details><summary>Trọn lần chạy — java -cp build main.Main &lt; harness/input.txt (176 dòng)</summary>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So dau sach &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 4<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 10<br>
Dau sach het ban : 0<br>
Sach cu nhat &nbsp;&nbsp;&nbsp;&nbsp;: Head First Java (2005)<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: Nam xuat ban 2999 o tuong lai: khong duoc lon hon nam hien tai. Moi nhap lai.<br>
Nam xuat ban: Nam xuat ban phai tu 1450 tro di (sach in dau tien ~1450), ban nhap 1449. Moi nhap lai.<br>
Nam xuat ban: So ban: So ban phai tu 0 den 99, ban nhap 100. Moi nhap lai.<br>
So ban: So ban phai tu 0 den 99, ban nhap -3. Moi nhap lai.<br>
So ban: Da them sach B005 "Refactoring". Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: So ban: Da co sach mang ISBN 9780134685991 (B002 "Effective Java"). Moi dau sach chi them 1 lan.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Cap nhat so ban ---<br>
Ma sach (vi du B001): So ban: Da cap nhat so ban cua B002 "Effective Java": 2 -&gt; 5.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Xoa sach ---<br>
Ma sach (vi du B001): Da xoa sach B003 "Java Concurrency In Practice". Ma B003 se khong duoc cap lai cho sach khac.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Xoa sach ---<br>
Ma sach (vi du B001): Khong co sach nao mang ma B003. Hay chon 2 de xem ma sach roi thu lai.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them sach ---<br>
Ten sach: ISBN-13: Tac gia: Nam xuat ban: So ban: Da them sach B006 "Design Patterns". Thu vien co 5 dau sach.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Danh sach sach ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;ISBN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Author &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title<br>
1 &nbsp;&nbsp;B006 &nbsp;9780201633610 &nbsp;1994 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Erich Gamma &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Design Patterns<br>
2 &nbsp;&nbsp;B002 &nbsp;9780134685991 &nbsp;2018 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Effective Java<br>
3 &nbsp;&nbsp;B004 &nbsp;9780596009205 &nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Head First Java<br>
4 &nbsp;&nbsp;B005 &nbsp;9780134757599 &nbsp;2018 &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Martin Fowler &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Refactoring<br>
5 &nbsp;&nbsp;B001 &nbsp;9780135957059 &nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Pragmatic Programmer<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an@@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap ".an@ctlib.vn". Moi nhap lai.<br>
Email: Email phai co dang ten@ten-mien.duoi, chi gom chu khong dau, chu so va . _ - (vi du an.nguyen@ctlib.vn), ban nhap "an nguyen@ctlib.vn". Moi nhap lai.<br>
Email: Email an.nguyen@ctlib.vn da thuoc ve M002 "Nguyen Van An". Moi thanh vien dung 1 email rieng.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Them thanh vien ---<br>
Ho ten: Email: Da them thanh vien M003 "Le Van Cuong". Cau lac bo co 3 thanh vien.<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Danh sach thanh vien ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email<br>
1 &nbsp;&nbsp;M003 &nbsp;Le Van Cuong &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cuong.le@ctlib.vn<br>
2 &nbsp;&nbsp;M002 &nbsp;Nguyen Van An &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;an.nguyen@ctlib.vn<br>
3 &nbsp;&nbsp;M001 &nbsp;Tran Thi Binh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;binh.tran@ctlib.vn<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So dau sach &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 14<br>
Dau sach het ban : 1<br>
Sach cu nhat &nbsp;&nbsp;&nbsp;&nbsp;: Design Patterns (1994)<br>
========== CT LIBRARY ==========<br>
1. Them sach<br>
2. Danh sach sach (sap theo ten)<br>
3. Tim sach theo ten<br>
4. Cap nhat so ban cua sach<br>
5. Xoa sach<br>
6. Them thanh vien<br>
7. Danh sach thanh vien<br>
8. Thong ke thu vien<br>
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 3 chi nam trong bo nho.</div>
</details>
<details><summary>ReportView.java và LibraryReportDTO — view mới và dữ liệu của nó</summary>
<pre><code class="language-java">package view;

import constants.Message;
import dto.LibraryReportDTO;

/**
 * Man hinh thong ke: in bao cao Controller dua vao qua setter.
 * display() khong nhan tham so, goi 1 lan cho moi lan thong ke.
 *
 * @author CuongThai Academy
 */
public class ReportView {

    // Bao cao can in
    private LibraryReportDTO report;

    // Tao View voi bao cao rong
    public ReportView() {
        report = new LibraryReportDTO();
    }

    // Controller dua bao cao vao View
    public void setReport(LibraryReportDTO report) {
        this.report = report;
    }

    // In tung dong cua bao cao
    public void display() {
        System.out.println(String.format(Message.REPORT_TITLES, report.getTotalTitles()));
        System.out.println(String.format(Message.REPORT_COPIES, report.getTotalCopies()));
        System.out.println(String.format(Message.REPORT_OUT_OF_STOCK,
                report.getOutOfStockTitles()));

        // Thu vien rong thi khong co sach cu nhat
        if (report.getOldestTitle().isEmpty()) {
            System.out.println(Message.REPORT_NO_BOOK);
        } else {
            // Co sach thi in ten + nam cua sach cu nhat
            System.out.println(String.format(Message.REPORT_OLDEST, report.getOldestTitle(),
                    report.getOldestYear()));
        }
    }
}</code></pre>
</details>`),
    bi(`<h2>6. Traps (with real output)</h2>
<div class="pitfall"><p><strong>Trap 1 — private and package-private from another package.</strong> Two real compile errors.</p></div>
<pre><code class="language-java">package main;

import model.Book;

/**
 * Main o package khac (main) thu cham vao Book cua package model.
 */
public final class Main {

    // Lop chi co ham static
    private Main() {
    }

    // Thu tao Book va sua thang truong private
    public static void main(String[] args) {
        Book book = new Book("Clean Code");
        book.title = "Dirty Code";
        System.out.println(book.getTitle());
    }
}</code></pre>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/main/Main.java:16: error: Book(String) is not public in Book; cannot be accessed from outside package<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Book book = new Book("Clean Code");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/main/Main.java:17: error: title has private access in Book<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;book.title = "Dirty Code";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors</div>
<div class="pitfall"><p><strong>Trap 2 — a static id counter.</strong> A brand-new repository starts at B004.</p></div>
<pre><code class="language-java">// release: 8
// Lab 3 trap — a static id counter is shared by EVERY repository
import java.util.ArrayList;

class StaticRepository {
    private static int nextNumber = 1;                    // belongs to the CLASS: one copy for all objects
    private ArrayList&lt;String&gt; idList = new ArrayList&lt;String&gt;();

    String add() {
        String id = String.format("B%03d", nextNumber);
        nextNumber++;
        idList.add(id);
        return id;
    }
}

class InstanceRepository {
    private int nextNumber = 1;                           // belongs to EACH object (what CT Library does)
    private ArrayList&lt;String&gt; idList = new ArrayList&lt;String&gt;();

    String add() {
        String id = String.format("B%03d", nextNumber);
        nextNumber++;
        idList.add(id);
        return id;
    }
}

public class LabBayStatic {
    public static void main(String[] args) {
        StaticRepository library = new StaticRepository();
        System.out.println("static  : library gets " + library.add() + ", " + library.add() + ", " + library.add());
        StaticRepository freshTest = new StaticRepository();   // a brand-new, EMPTY repository...
        System.out.println("static  : fresh repository starts at " + freshTest.add());   // ...but not at B001

        InstanceRepository library2 = new InstanceRepository();
        System.out.println("instance: library gets " + library2.add() + ", " + library2.add() + ", " + library2.add());
        InstanceRepository freshTest2 = new InstanceRepository();
        System.out.println("instance: fresh repository starts at " + freshTest2.add());
    }
}</code></pre>
<div class="out">static &nbsp;: library gets B001, B002, B003<br>
static &nbsp;: fresh repository starts at B004<br>
instance: library gets B001, B002, B003<br>
instance: fresh repository starts at B001</div>
<div class="pitfall"><p><strong>Trap 3 — a getter that returns the list itself.</strong> All fields private, and one <code>clear()</code> outside empties the library.</p></div>
<pre><code class="language-java">// release: 8
// Lab 3 trap — every field is private, yet a getter hands out the list itself
import java.util.ArrayList;

class LeakyRepository {
    private ArrayList&lt;String&gt; titleList = new ArrayList&lt;String&gt;();

    LeakyRepository() {
        titleList.add("Effective Java");
        titleList.add("Clean Code");
    }

    ArrayList&lt;String&gt; getTitleList() { return titleList; }              // the SAME list object
    ArrayList&lt;String&gt; findAll() { return new ArrayList&lt;String&gt;(titleList); }   // a copy (CT Library returns DTO copies)
    int count() { return titleList.size(); }
}

public class LabBayRoRi {
    public static void main(String[] args) {
        LeakyRepository repository = new LeakyRepository();
        repository.findAll().clear();                     // clears only the copy
        System.out.println("after findAll().clear()     : " + repository.count() + " books");
        repository.getTitleList().clear();                // clears the library itself!
        System.out.println("after getTitleList().clear(): " + repository.count() + " books");
    }
}</code></pre>
<div class="out">after findAll().clear() &nbsp;&nbsp;&nbsp;&nbsp;: 2 books<br>
after getTitleList().clear(): 0 books</div>
<div class="pitfall"><p><strong>Trap 4 — printing the current year in a message.</strong> The output changes every 1 January and <code>expected.txt</code> breaks. Keep moving values out of messages that are tested.</p></div>`,
    `<h2>6. Bẫy (kèm output thật)</h2>
<div class="pitfall"><p><strong>Bẫy 1 — private và package-private từ package khác.</strong> Hai lỗi biên dịch thật.</p></div>
<pre><code class="language-java">package main;

import model.Book;

/**
 * Main o package khac (main) thu cham vao Book cua package model.
 */
public final class Main {

    // Lop chi co ham static
    private Main() {
    }

    // Thu tao Book va sua thang truong private
    public static void main(String[] args) {
        Book book = new Book("Clean Code");
        book.title = "Dirty Code";
        System.out.println(book.getTitle());
    }
}</code></pre>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/main/Main.java:16: error: Book(String) is not public in Book; cannot be accessed from outside package<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Book book = new Book("Clean Code");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/main/Main.java:17: error: title has private access in Book<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;book.title = "Dirty Code";<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors</div>
<div class="pitfall"><p><strong>Bẫy 2 — bộ đếm mã static.</strong> Repository mới tinh bắt đầu ở B004.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 3 — bộ đếm mã static bị MỌI kho dùng chung
import java.util.ArrayList;

class StaticRepository {
    private static int nextNumber = 1;                    // thuộc LỚP: một bản cho mọi đối tượng
    private ArrayList&lt;String&gt; idList = new ArrayList&lt;String&gt;();

    String add() {
        String id = String.format("B%03d", nextNumber);
        nextNumber++;
        idList.add(id);
        return id;
    }
}

class InstanceRepository {
    private int nextNumber = 1;                           // thuộc TỪNG đối tượng (CT Library làm vậy)
    private ArrayList&lt;String&gt; idList = new ArrayList&lt;String&gt;();

    String add() {
        String id = String.format("B%03d", nextNumber);
        nextNumber++;
        idList.add(id);
        return id;
    }
}

public class LabBayStatic {
    public static void main(String[] args) {
        StaticRepository library = new StaticRepository();
        System.out.println("static  : library gets " + library.add() + ", " + library.add() + ", " + library.add());
        StaticRepository freshTest = new StaticRepository();   // một kho MỚI TINH, RỖNG...
        System.out.println("static  : fresh repository starts at " + freshTest.add());   // ...mà không bắt đầu ở B001

        InstanceRepository library2 = new InstanceRepository();
        System.out.println("instance: library gets " + library2.add() + ", " + library2.add() + ", " + library2.add());
        InstanceRepository freshTest2 = new InstanceRepository();
        System.out.println("instance: fresh repository starts at " + freshTest2.add());
    }
}</code></pre>
<div class="out">static &nbsp;: library gets B001, B002, B003<br>
static &nbsp;: fresh repository starts at B004<br>
instance: library gets B001, B002, B003<br>
instance: fresh repository starts at B001</div>
<div class="pitfall"><p><strong>Bẫy 3 — getter trả về chính danh sách.</strong> Mọi trường đều private, vậy mà một lệnh <code>clear()</code> bên ngoài xoá sạch thư viện.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 3 — mọi trường đều private, vậy mà getter đưa luôn cái danh sách ra ngoài
import java.util.ArrayList;

class LeakyRepository {
    private ArrayList&lt;String&gt; titleList = new ArrayList&lt;String&gt;();

    LeakyRepository() {
        titleList.add("Effective Java");
        titleList.add("Clean Code");
    }

    ArrayList&lt;String&gt; getTitleList() { return titleList; }              // CHÍNH đối tượng danh sách đó
    ArrayList&lt;String&gt; findAll() { return new ArrayList&lt;String&gt;(titleList); }   // một bản sao (CT Library trả bản sao DTO)
    int count() { return titleList.size(); }
}

public class LabBayRoRi {
    public static void main(String[] args) {
        LeakyRepository repository = new LeakyRepository();
        repository.findAll().clear();                     // chỉ xoá bản sao
        System.out.println("after findAll().clear()     : " + repository.count() + " books");
        repository.getTitleList().clear();                // xoá sạch chính thư viện!
        System.out.println("after getTitleList().clear(): " + repository.count() + " books");
    }
}</code></pre>
<div class="out">after findAll().clear() &nbsp;&nbsp;&nbsp;&nbsp;: 2 books<br>
after getTitleList().clear(): 0 books</div>
<div class="pitfall"><p><strong>Bẫy 4 — in năm hiện tại trong câu báo.</strong> Output đổi mỗi ngày 1 tháng 1 và <code>expected.txt</code> hỏng. Giữ các giá trị thay đổi theo thời gian ra khỏi những câu được kiểm thử.</p></div>`),
    bi(`<h2>7. Rubric (10 points) and self-check</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td>Year from the clock + 1450 rule (3.1)</td><td>1</td><td>grader lines 27–28, no year in the code</td></tr>
<tr><td>Strict email + duplicate email in the repository (3.2, 3.3)</td><td>2</td><td>grader lines 120–123</td></tr>
<tr><td>Delete, id never reused (3.4)</td><td>2</td><td>grader lines 67, 79, 91, 104</td></tr>
<tr><td>Report computed by the service on copies (3.5)</td><td>2</td><td>grader lines 12–15, 162–165</td></tr>
<tr><td>Review: <code>lint.py</code> 0 violations (3.6)</td><td>2</td><td><code>lint.py</code></td></tr>
<tr><td>Oral: explain any modifier the reviewer points at</td><td>1</td><td>one question</td></tr>
</tbody>
</table>
<details><summary>1. Why is getYear in utils but the duplicate-email check in the repository?</summary><p class="dap-an">✅ The year rule needs only the typed value (shape); "already used" needs the member list, which only the repository holds — and utils may not import a repository.</p></details>
<details><summary>2. What breaks if nextBookNumber is static?</summary><p class="dap-an">✅ All repositories share one counter: a second (or a test) repository does not start at B001, and <code>lint.py</code> rejects static outside utils/constants. Real output: "fresh repository starts at B004".</p></details>
<details><summary>3. Which getter would leak the library — and how does CT Library avoid it?</summary><p class="dap-an">✅ A <code>getBookList()</code> returning the <code>ArrayList&lt;Book&gt;</code> field itself. CT Library has no such getter: <code>findAll()</code> builds new <code>BookResponseDTO</code> copies every time, so callers can never change the stored books.</p></details>`,
    `<h2>7. Rubric (10 điểm) và tự kiểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Kiểm bằng</th></tr></thead>
<tbody>
<tr><td>Năm lấy từ đồng hồ + luật 1450 (3.1)</td><td>1</td><td>dòng 27–28 của bộ chấm, không có năm trong code</td></tr>
<tr><td>Email chặt + chặn trùng email ở repository (3.2, 3.3)</td><td>2</td><td>dòng 120–123</td></tr>
<tr><td>Xoá, mã không cấp lại (3.4)</td><td>2</td><td>dòng 67, 79, 91, 104</td></tr>
<tr><td>Thống kê do service tính trên bản sao (3.5)</td><td>2</td><td>dòng 12–15, 162–165</td></tr>
<tr><td>Review: <code>lint.py</code> 0 vi phạm (3.6)</td><td>2</td><td><code>lint.py</code></td></tr>
<tr><td>Vấn đáp: giải thích modifier bất kỳ thầy chỉ vào</td><td>1</td><td>một câu hỏi</td></tr>
</tbody>
</table>
<details><summary>1. Vì sao getYear ở utils còn chặn trùng email ở repository?</summary><p class="dap-an">✅ Luật năm chỉ cần giá trị vừa gõ (hình dạng); "đã có người dùng" cần danh sách thành viên mà chỉ repository giữ — và utils không được import repository.</p></details>
<details><summary>2. nextBookNumber mà static thì hỏng gì?</summary><p class="dap-an">✅ Mọi repository dùng chung một bộ đếm: repository thứ hai (hay repository trong bài kiểm thử) không bắt đầu từ B001, và <code>lint.py</code> từ chối static ngoài utils/constants. Output thật: "fresh repository starts at B004".</p></details>
<details><summary>3. Getter nào làm rò thư viện — và CT Library tránh bằng cách nào?</summary><p class="dap-an">✅ Một <code>getBookList()</code> trả về chính trường <code>ArrayList&lt;Book&gt;</code>. CT Library không có getter đó: <code>findAll()</code> dựng bản sao <code>BookResponseDTO</code> mới mỗi lần, nên nơi gọi không bao giờ sửa được sách đã lưu.</p></details>`),
    bi(`<h2>8. Extra challenges and what comes next</h2>
<ul>
<li>⭐ The report: add "the author with the most titles". Which class changes, which stay the same?</li>
<li>⭐ Use <strong>varargs</strong> (3.A-2): a private helper in <code>ReportView</code>, <code>printLines(String... lines)</code>, that prints any number of lines — is it still "display() with no parameters" from the controller's point of view?</li>
<li>⭐⭐ Delete a member, but refuse while the member still has books on loan — sketch where that rule would live when loans arrive (Lab 6).</li>
</ul>
<div class="callout"><p><strong>Next — Lab 4 (after Chapter 4):</strong> the club also lends magazines and DVDs. <code>LibraryItem</code> becomes the parent of <code>Book</code>, <code>Magazine</code> and <code>DVD</code>; loan days and late fees are overridden in each class, and the fee is computed without a single <code>instanceof</code> — polymorphism doing the work. <code>protected</code> finally gets a use.</p></div>`,
    `<h2>8. Thử thách thêm và việc tiếp theo</h2>
<ul>
<li>⭐ Thống kê: thêm "tác giả có nhiều đầu sách nhất". Lớp nào đổi, lớp nào giữ nguyên?</li>
<li>⭐ Dùng <strong>varargs</strong> (3.A-2): một hàm phụ private trong <code>ReportView</code>, <code>printLines(String... lines)</code>, in bao nhiêu dòng cũng được — nhìn từ controller thì nó có còn là "display() không tham số"?</li>
<li>⭐⭐ Xoá thành viên, nhưng từ chối nếu thành viên đó đang mượn sách — phác thảo luật đó sẽ nằm ở đâu khi có chức năng mượn (Lab 6).</li>
</ul>
<div class="callout"><p><strong>Tiếp theo — Lab 4 (sau Chương 4):</strong> câu lạc bộ còn cho mượn tạp chí và DVD. <code>LibraryItem</code> thành lớp cha của <code>Book</code>, <code>Magazine</code> và <code>DVD</code>; số ngày mượn và phí trễ hạn được ghi đè ở từng lớp, và phí được tính mà không cần một <code>instanceof</code> nào — đa hình làm thay. <code>protected</code> cuối cùng cũng có chỗ dùng.</p></div>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch3) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: '(FE question type) Order the access levels from the LEAST restrictive to the MOST restrictive.|||(Dạng câu FE) Sắp xếp các mức truy cập từ ÍT hạn chế nhất tới hạn chế NHẤT.',
      options: ['default, protected, private, public|||default, protected, private, public', 'public, protected, default, private|||public, protected, default, private', 'public, default, protected, private|||public, default, protected, private', 'public, private, protected, default|||public, private, protected, default'],
      correctIndex: 1,
      points: 1,
      explanation: 'public opens to everyone; protected = the whole package plus subclasses elsewhere; default (no modifier) = the package only; private = the class only. C is the usual slip: protected is MORE open than default, because it adds subclasses in other packages on top of the package.|||public mở cho mọi nơi; protected = cả package cộng lớp con ở nơi khác; default (không ghi modifier) = chỉ package; private = chỉ trong lớp. C là chỗ hay nhầm: protected MỞ hơn default, vì nó cộng thêm lớp con ở package khác lên trên package.' },
    { id: 'q2',
      question: '(FE question type) Which statement about the protected access modifier is true?|||(Dạng câu FE) Phát biểu nào về bổ từ truy cập protected là đúng?',
      options: ['A protected member can be used only inside its own class|||Thành viên protected chỉ dùng được bên trong chính lớp của nó', 'A protected member is NOT accessible from other classes in the same package|||Thành viên protected KHÔNG truy cập được từ lớp khác trong cùng package', 'Any class in any package can use a protected member|||Mọi lớp ở mọi package đều dùng được thành viên protected', 'It allows access from another package, but only through inheritance|||Nó cho phép truy cập từ package khác, nhưng chỉ qua kế thừa'],
      correctIndex: 3,
      points: 1,
      explanation: 'protected = every class of the same package (so B is false — MucTruyCap compiled it) plus subclasses in other packages. A describes private, C describes public. Some FE banks shorten the key to "it allows the outside package access" — that is true only for subclasses, which is why D says so.|||protected = mọi lớp cùng package (nên B sai — MucTruyCap đã biên dịch thử) cộng lớp con ở package khác. A tả private, C tả public. Vài bộ đề FE rút gọn đáp án thành "nó cho phép package bên ngoài truy cập" — điều đó chỉ đúng với lớp con, nên D nói rõ như vậy.' },
    { id: 'q3',
      question: '(FE question type) Select the correct statements. (1) A public member of a class can be accessed in all classes. (2) A default member can be accessed in all classes. (3) A protected member can be accessed in the package containing the class. (4) A private member can be accessed in subclasses.|||(Dạng câu FE) Chọn các phát biểu đúng. (1) Thành viên public truy cập được ở mọi lớp. (2) Thành viên default truy cập được ở mọi lớp. (3) Thành viên protected truy cập được trong package chứa lớp đó. (4) Thành viên private truy cập được ở lớp con.',
      options: ['1 and 3|||1 và 3', '1 and 2|||1 và 2', '1, 3 and 4|||1, 3 và 4', '2, 3 and 4|||2, 3 và 4'],
      correctIndex: 0,
      points: 1,
      explanation: '(1) true. (2) false: default means the same package only. (3) true: protected includes the whole package. (4) false: private stops at the class itself — a subclass inherits the field but cannot name it (it uses a getter instead).|||(1) đúng. (2) sai: default nghĩa là chỉ trong cùng package. (3) đúng: protected bao gồm cả package. (4) sai: private dừng ở chính lớp — lớp con thừa kế trường nhưng không gọi tên nó được (phải dùng getter).' },
    { id: 'q4',
      question: 'Which beginning of a source file compiles?|||Phần đầu file nguồn nào biên dịch được?',
      options: ['import java.util.Scanner; then package shop; then the class|||import java.util.Scanner; rồi package shop; rồi tới lớp', 'package shop; written AFTER the class declaration|||package shop; viết SAU phần khai báo lớp', 'a comment line, then package shop; then import java.util.Scanner; then the class|||một dòng chú thích, rồi package shop; rồi import java.util.Scanner; rồi tới lớp', 'two lines package shop; and package app; in the same file|||hai dòng package shop; và package app; trong cùng một file'],
      correctIndex: 2,
      points: 1,
      explanation: 'The package declaration must be the first STATEMENT; comments and blank lines may come before it, imports must come after it. With an import first (A) javac 8 reports "class, interface, or enum expected" at the package line — lesson 3.A ran it. A file belongs to exactly one package (D).|||Khai báo package phải là CÂU LỆNH đầu tiên; chú thích và dòng trống được đứng trước, import phải đứng sau. Có import đứng đầu (A) thì javac 8 báo "class, interface, or enum expected" ở dòng package — bài 3.A đã chạy thật. Một file thuộc đúng một package (D).' },
    { id: 'q5',
      question: 'PkgDemo.java starts with package mypkg; and was compiled into build/classes/mypkg/PkgDemo.class. Which command runs it?|||PkgDemo.java bắt đầu bằng package mypkg; và đã được biên dịch thành build/classes/mypkg/PkgDemo.class. Lệnh nào chạy được nó?',
      options: ['From build/classes: java mypkg.PkgDemo|||Đứng ở build/classes: java mypkg.PkgDemo', 'From build/classes/mypkg: java PkgDemo|||Đứng ở build/classes/mypkg: java PkgDemo', 'From build/classes: java PkgDemo|||Đứng ở build/classes: java PkgDemo', 'From build/classes/mypkg: java PkgDemo.class|||Đứng ở build/classes/mypkg: java PkgDemo.class'],
      correctIndex: 0,
      points: 1,
      explanation: 'java needs the fully qualified name (mypkg.PkgDemo) and looks for mypkg/PkgDemo.class under the class path — the current folder by default. B is the red box of slide 28: JDK 8 prints "Could not find or load main class PkgDemo". C gives the wrong name; D passes a file name, which java does not accept.|||java cần tên đầy đủ (mypkg.PkgDemo) và đi tìm mypkg/PkgDemo.class bên dưới class path — mặc định là thư mục hiện tại. B là khung đỏ của slide 28: JDK 8 in "Could not find or load main class PkgDemo". C đưa sai tên; D đưa tên file, thứ mà java không nhận.' },
    { id: 'q6',
      question: 'What does this program print?|||Chương trình này in ra gì?',
      code: `static int count(int... a) {
    return a.length;
}

public static void main(String[] args) {
    System.out.println(count() + " " + count(1, 2) + " " + count(new int[] {4, 5, 6}));
}`,
      codeLang: 'java',
      options: ['Compile error: count() needs at least one argument|||Lỗi biên dịch: count() cần ít nhất một đối số', '0 2 3|||0 2 3', '0 2 1|||0 2 1', 'A NullPointerException, because a is null in count()|||Một NullPointerException, vì a là null trong count()'],
      correctIndex: 1,
      points: 1,
      explanation: 'A varargs parameter is an array: with no arguments it is an EMPTY array (length 0, never null), with (1, 2) it has 2 elements, and an existing int[] is passed as the array itself, so 3. C treats the array as one element; A and D are the two wrong guesses about the empty call.|||Tham số varargs là một mảng: không có đối số thì là mảng RỖNG (length 0, không bao giờ null), với (1, 2) thì có 2 phần tử, còn một int[] có sẵn được truyền như chính cái mảng, nên là 3. C coi mảng là một phần tử; A và D là hai cách đoán sai về lời gọi rỗng.' },
    { id: 'q7',
      question: 'Which method declaration compiles?|||Khai báo phương thức nào biên dịch được?',
      options: ['void f(int... n, String s)|||void f(int... n, String s)', 'void f(int... a, int... b)|||void f(int... a, int... b)', 'void f(String s, int... n)|||void f(String s, int... n)', 'void f(int...)|||void f(int...)'],
      correctIndex: 2,
      points: 1,
      explanation: 'A method may have at most ONE varargs parameter and it must be the LAST one (A and B break those rules), and like any parameter it needs a name (D). printf(String format, Object... args) has exactly the shape of C.|||Một phương thức có tối đa MỘT tham số varargs và nó phải là tham số CUỐI (A và B phạm các luật đó), và như mọi tham số nó cần có tên (D). printf(String format, Object... args) có đúng hình dạng của C.' },
    { id: 'q8',
      question: '(FE question type) Class Y extends X; they are in different packages; X declares protected void fun(). Inside a method of Y with parameters Y other and X x, which calls compile?|||(Dạng câu FE) Lớp Y kế thừa X; hai lớp ở hai package khác nhau; X khai báo protected void fun(). Bên trong một phương thức của Y có tham số Y other và X x, những lời gọi nào biên dịch được?',
      options: ['Only this.fun()|||Chỉ this.fun()', 'this.fun(), other.fun() and x.fun()|||this.fun(), other.fun() và x.fun()', 'None of them, because the packages are different|||Không lời gọi nào, vì khác package', 'this.fun() and other.fun(), but not x.fun()|||this.fun() và other.fun(), nhưng không x.fun()'],
      correctIndex: 3,
      points: 1,
      explanation: 'In another package a subclass may use a protected member through references of its OWN type (Y or below): this and other qualify, so one Y may call fun() on another Y. Through a reference of the parent type X it may not — javac 8 says "fun() has protected access in X" for x.fun(). A is too strict, B ignores the rule, C ignores inheritance.|||Ở package khác, lớp con được dùng thành viên protected qua tham chiếu thuộc kiểu CỦA CHÍNH NÓ (Y hoặc thấp hơn): this và other thoả điều kiện, nên một Y gọi được fun() trên một Y khác. Qua tham chiếu kiểu cha X thì không — javac 8 báo "fun() has protected access in X" cho x.fun(). A quá chặt, B bỏ qua luật, C quên mất kế thừa.' },
    { id: 'q9',
      question: 'Course allows at most 2 students and its list is private final. What does the program print?|||Course cho tối đa 2 sinh viên và danh sách của nó là private final. Chương trình in ra gì?',
      code: `static class Course {
    private final List<String> students = new ArrayList<String>();
    public boolean enroll(String s) {
        if (students.size() >= 2) return false;
        return students.add(s);
    }
    public List<String> getStudents() { return students; }
}

public static void main(String[] args) {
    Course c = new Course();
    c.enroll("An");
    c.enroll("Binh");
    c.enroll("Chi");
    c.getStudents().add("Dung");
    System.out.println(c.getStudents().size());
}`,
      codeLang: 'java',
      options: ['2|||2', '3|||3', '4|||4', 'An UnsupportedOperationException is thrown|||Ném ra UnsupportedOperationException'],
      correctIndex: 1,
      points: 1,
      explanation: "enroll accepts An and Binh and refuses Chi (the list is full). But getStudents() returns the real private list, so main adds Dung directly and bypasses the rule: 3. private protects the variable, final freezes the reference — neither protects the list's contents. Returning Collections.unmodifiableList(students) would make D happen; returning a copy would keep the course at 2.|||enroll nhận An và Binh và từ chối Chi (đã đầy). Nhưng getStudents() trả về chính danh sách private, nên main thêm thẳng Dung và lách luật: 3. private bảo vệ biến, final đóng băng tham chiếu — không cái nào bảo vệ nội dung danh sách. Trả về Collections.unmodifiableList(students) sẽ làm D xảy ra; trả về một bản sao sẽ giữ lớp học ở 2." },
    { id: 'q10',
      question: 'rectPkg.Rectangle declares protected int length. Class Demo_1 is in package boxPkg and does NOT extend Rectangle. Its main runs Rectangle r = new Rectangle(); r.length = 6; — what happens?|||rectPkg.Rectangle khai báo protected int length. Lớp Demo_1 nằm trong package boxPkg và KHÔNG kế thừa Rectangle. main của nó chạy Rectangle r = new Rectangle(); r.length = 6; — điều gì xảy ra?',
      options: ['It compiles, because boxPkg contains a subclass of Rectangle (Box)|||Biên dịch được, vì boxPkg có một lớp con của Rectangle (Box)', 'It compiles, but an exception is thrown at run time|||Biên dịch được, nhưng ném ngoại lệ lúc chạy', 'Compile error: length has protected access in Rectangle|||Lỗi biên dịch: length has protected access in Rectangle', 'It compiles, and length is silently left at 0|||Biên dịch được, và length lặng lẽ giữ nguyên 0'],
      correctIndex: 2,
      points: 1,
      explanation: "Access is checked by the compiler for the class that writes the code: Demo_1 is neither in rectPkg nor a subclass, so protected is closed to it. That another class of boxPkg (Box) extends Rectangle gives Demo_1 nothing (A). This is slide 32's red line, reproduced on JDK 8 with exactly that message.|||Quyền truy cập được trình biên dịch kiểm cho chính lớp viết dòng code đó: Demo_1 không ở rectPkg cũng không phải lớp con, nên protected đóng với nó. Việc một lớp khác của boxPkg (Box) kế thừa Rectangle chẳng cho Demo_1 thêm gì (A). Đây là dòng đỏ ở slide 32, đã tái hiện trên JDK 8 với đúng thông báo đó." },
  ],
};

export default {
  slides: [L_pro8_3],
  practice: L_on_ch3,
  labs: [L_lab3],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 3 (viết lại, có giải thích song ngữ, lấy cảm hứng từ đề FE thật): thứ tự bốn mức truy cập, protected thật sự cho phép gì, chọn các phát biểu đúng về public/default/protected/private, dòng package phải đứng đầu, chạy một lớp có package, varargs nhận gì và khai báo nào hợp lệ, protected qua tham chiếu kiểu lớp cha ở package khác, getter làm rò rỉ danh sách private, và lỗi truy cập trong demo Box/Rectangle — câu "in ra gì" đều đã chạy thật.',
};
