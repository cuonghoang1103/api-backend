/**
 * PRO192 · Chương 5 — interface, abstract class, lớp lồng/ẩn danh (pro10 slide 12–27).
 * Bài 📑 học theo từng slide: pro10 (tmp_10.pptx, slide 12–27).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch5.
 * Bài 🏗️ LAB CT Library (chuẩn LAB211, deck tự dựng): pro192-lab-5-truu-tuong-va-interface.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch5).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, registerDeck, bi } from './_slides.mjs';

registerDeck('lab5', { code: 'PRO192 Lab 5', en: 'Lab 5 — CT Library: abstract classes and interfaces', vi: 'Lab 5 — CT Library: lớp trừu tượng và interface', total: 16, w: 1280, h: 720, ver: 'v2' });

/* ───────── 5.A — 📑 Slide by slide · Polymorphism (2/2): interfaces, abstract classes, anonymous classes (slides 12–27) ───────── */
const L_pro10_2 = {
  title: '5.A — 📑 Slide by slide · Polymorphism (2/2): interfaces, abstract classes, anonymous classes (slides 12–27)|||5.A — 📑 Học theo từng slide · Polymorphism (2/2): interface, lớp trừu tượng, lớp ẩn danh (slide 12–27)',
  slug: 'pro192-slide-pro10-2',
  type: 'VIDEO',
  description: 'Giảng slide 12–27 bộ "Polymorphism" của trường: interface thật sự chứa gì (javap cho thấy trường là public static final, phương thức default/static của Java 8, private method chỉ từ Java 9 — đo thật trên JDK 8), vì sao và khi nào dùng interface, ví dụ điều khiển VNRemote/ChinaRemote/KoreaRemote chạy thật, chỗ mơ hồ khi hai interface trùng tên, lớp trừu tượng Shape/Circle/Rect, lớp abstract không có phương thức abstract, lỗi "Error. Why?" khi lớp con quên phương thức, nhiều tầng trừu tượng, lớp lồng (static, inner, local, anonymous) và tên file .class thật, lớp ẩn danh và lambda Java 8, adapter — và chỉ ra câu sai trên slide 26.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.A · school deck "Polymorphism", slides 12–27</span>
<h2>Contracts without bodies — interfaces, abstract classes, and classes with no name</h2>
<p class="lead">Lesson 4.B ended with overriding: a subclass <em>may</em> replace a parent's method. This half of the deck is about forcing it to. An <strong>abstract class</strong> is a parent that leaves some methods without a body; an <strong>interface</strong> is a pure list of what a class promises to do. Both cannot be instantiated, both make polymorphism the only way to use them — and both are on every PE paper: question 4 hands you an interface to implement, and the new 10-mark papers start with "Create 1 Interface, 1 Abstract Class and 2 classes" (Exam Room PE3, PE5). Slides 23–26 add nested and anonymous classes, the shortcut used for one-off implementations.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>12–17</td><td>interfaces: members, why, implement, many, extend</td><td>write and implement an interface, and know what javac adds to its fields and methods</td></tr>
<tr><td>18–22</td><td>abstract classes and abstract methods</td><td>decide when a class must be abstract and read the "does not override abstract method" error</td></tr>
<tr><td>23–26</td><td>nested and anonymous classes</td><td>write an anonymous class or a Java 8 lambda, and name the .class files they produce</td></tr>
<tr><td>27</td><td>summary</td><td>explain polymorphism through a parent or interface reference</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.A · bộ slide "Polymorphism" của trường, slide 12–27</span>
<h2>Hợp đồng không có thân — interface, lớp trừu tượng, và những lớp không có tên</h2>
<p class="lead">Bài 4.B kết thúc ở ghi đè: lớp con <em>có thể</em> thay phương thức của cha. Nửa sau của bộ slide nói về việc <em>buộc</em> nó phải thay. <strong>Lớp trừu tượng (abstract class)</strong> là lớp cha để lại vài phương thức không có thân; <strong>interface</strong> là một danh sách thuần những gì một lớp hứa sẽ làm. Cả hai đều không tạo đối tượng được, cả hai chỉ dùng được qua đa hình — và cả hai có mặt trong mọi đề PE: câu 4 đưa sẵn một interface để bạn hiện thực, còn dạng đề mới 10 điểm mở đầu bằng "Create 1 Interface, 1 Abstract Class and 2 classes" (Exam Room PE3, PE5). Slide 23–26 thêm lớp lồng và lớp ẩn danh, lối tắt cho những cài đặt dùng một lần.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>12–17</td><td>interface: thành viên, vì sao, implement, nhiều, mở rộng</td><td>viết và hiện thực một interface, biết javac tự thêm gì vào trường và phương thức của nó</td></tr>
<tr><td>18–22</td><td>lớp trừu tượng và phương thức trừu tượng</td><td>quyết định khi nào một lớp phải là abstract và đọc được lỗi "does not override abstract method"</td></tr>
<tr><td>23–26</td><td>lớp lồng và lớp ẩn danh</td><td>viết một lớp ẩn danh hoặc lambda Java 8, và gọi tên các file .class chúng sinh ra</td></tr>
<tr><td>27</td><td>tóm tắt</td><td>giải thích đa hình qua một tham chiếu kiểu cha hoặc kiểu interface</td></tr>
</tbody>
</table>`),
    walkHead('pro10', 12, 27),
    walk('pro10', [
      [12, 'Interface',
        `<p class="y-chinh">🎯 An <strong>interface</strong> is a reference type, similar to a class, that can contain only constants, initialized fields, static methods, prototypes (abstract methods), default methods and nested types. It is the core of the classes that implement it; it cannot be instantiated; it can only be implemented by classes or extended by other interfaces.</p>
<p>What javac really makes of the slide's <code>VNRemote</code> (slide 14), and four things JDK 8 refuses:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== the slide's VNRemote, and what javac really made of it ==");
    viet(d, "VNRemote.java",
        "public interface VNRemote {\\n" +
        "    final int MAXofButtons = 20;   // constant\\n" +
        "    int price = 10;                // variable must be initialized\\n" +
        "    public static void setTimer(int number) {\\n" +
        "        System.out.println(\\"shut down after \\" + number + \\" seconds\\");\\n" +
        "    }\\n" +
        "    public abstract void onDevice();\\n" +
        "    abstract public void offDevice();\\n" +
        "    default void setLock() {\\n" +
        "        System.out.println(\\"set lock in the default method\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "VNRemote.java");
    lenh(d, "javap", "VNRemote");

    System.out.println("== 1. an interface cannot be instantiated ==");
    viet(d, "New.java",
        "public class New {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        VNRemote r = new VNRemote();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "New.java");

    System.out.println("== 2. \\"int price = 10\\" is a constant, not a variable ==");
    viet(d, "Assign.java",
        "public class Assign {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        VNRemote.price = 11;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Assign.java");

    System.out.println("== 3. a field without a value ==");
    viet(d, "NoValue.java",
        "interface NoValue {\\n" +
        "    int price;\\n" +
        "}\\n");
    lenh(d, "javac", "NoValue.java");

    System.out.println("== 4. a private method in an interface: Java 9+, not Java 8 ==");
    viet(d, "PrivateHelper.java",
        "interface PrivateHelper {\\n" +
        "    private void log() { }\\n" +
        "}\\n");
    lenh(d, "javac", "PrivateHelper.java");
}</code></pre>
<div class="out">== the slide's VNRemote, and what javac really made of it ==<br>
&gt; javac VNRemote.java<br>
&gt; javap VNRemote<br>
Compiled from "VNRemote.java"<br>
public interface VNRemote {<br>
&nbsp;&nbsp;public static final int MAXofButtons;<br>
&nbsp;&nbsp;public static final int price;<br>
&nbsp;&nbsp;public static void setTimer(int);<br>
&nbsp;&nbsp;public abstract void onDevice();<br>
&nbsp;&nbsp;public abstract void offDevice();<br>
&nbsp;&nbsp;public void setLock();<br>
}<br>
== 1. an interface cannot be instantiated ==<br>
&gt; javac New.java<br>
New.java:3: error: VNRemote is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VNRemote r = new VNRemote();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 2. "int price = 10" is a constant, not a variable ==<br>
&gt; javac Assign.java<br>
Assign.java:3: error: cannot assign a value to final variable price<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VNRemote.price = 11;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 3. a field without a value ==<br>
&gt; javac NoValue.java<br>
NoValue.java:2: error: = expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;int price;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 4. a private method in an interface: Java 9+, not Java 8 ==<br>
&gt; javac PrivateHelper.java<br>
PrivateHelper.java:2: error: modifier private not allowed here<br>
&nbsp;&nbsp;&nbsp;&nbsp;private void log() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
PrivateHelper.java:2: error: interface abstract methods cannot have body<br>
&nbsp;&nbsp;&nbsp;&nbsp;private void log() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)</div>
<p>Read the javap listing: <code>final int MAXofButtons</code> and <code>int price</code> both became <code>public static final</code> — so the slide's "initialized fields" are constants too, and "variable must be initialized" really means "every interface field is a constant, so it needs a value" (case 3). Methods without a body became <code>public abstract</code>; the default method <code>setLock</code> is a public instance method with a body (JDK 8's javap does not print the word <code>default</code>).</p>
<p>Two corrections. "Cannot be instantiated <em>because they have no-body methods</em>": the real reason is that an interface has <strong>no constructor</strong> — an interface with zero methods still cannot be <code>new</code>-ed. And the member list is Java 8's; Java 9 added <strong>private</strong> methods (case 4 shows JDK 8 refusing one), so the word "only" depends on the version.</p>`,
        `<p class="y-chinh">🎯 <strong>Interface</strong> là một kiểu tham chiếu, giống lớp, chỉ có thể chứa hằng, trường đã khởi tạo, phương thức static, nguyên mẫu (phương thức trừu tượng), phương thức default và kiểu lồng. Nó là lõi của các lớp hiện thực nó; nó không tạo đối tượng được; nó chỉ có thể được lớp hiện thực (implement) hoặc được interface khác mở rộng (extend).</p>
<p>Thứ javac thật sự làm ra từ <code>VNRemote</code> của slide (slide 14), và bốn điều JDK 8 từ chối:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== the slide's VNRemote, and what javac really made of it ==");
    viet(d, "VNRemote.java",
        "public interface VNRemote {\\n" +
        "    final int MAXofButtons = 20;   // constant\\n" +
        "    int price = 10;                // variable must be initialized\\n" +
        "    public static void setTimer(int number) {\\n" +
        "        System.out.println(\\"shut down after \\" + number + \\" seconds\\");\\n" +
        "    }\\n" +
        "    public abstract void onDevice();\\n" +
        "    abstract public void offDevice();\\n" +
        "    default void setLock() {\\n" +
        "        System.out.println(\\"set lock in the default method\\");\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "VNRemote.java");
    lenh(d, "javap", "VNRemote");

    System.out.println("== 1. an interface cannot be instantiated ==");
    viet(d, "New.java",
        "public class New {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        VNRemote r = new VNRemote();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "New.java");

    System.out.println("== 2. \\"int price = 10\\" is a constant, not a variable ==");
    viet(d, "Assign.java",
        "public class Assign {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        VNRemote.price = 11;\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Assign.java");

    System.out.println("== 3. a field without a value ==");
    viet(d, "NoValue.java",
        "interface NoValue {\\n" +
        "    int price;\\n" +
        "}\\n");
    lenh(d, "javac", "NoValue.java");

    System.out.println("== 4. a private method in an interface: Java 9+, not Java 8 ==");
    viet(d, "PrivateHelper.java",
        "interface PrivateHelper {\\n" +
        "    private void log() { }\\n" +
        "}\\n");
    lenh(d, "javac", "PrivateHelper.java");
}</code></pre>
<div class="out">== the slide's VNRemote, and what javac really made of it ==<br>
&gt; javac VNRemote.java<br>
&gt; javap VNRemote<br>
Compiled from "VNRemote.java"<br>
public interface VNRemote {<br>
&nbsp;&nbsp;public static final int MAXofButtons;<br>
&nbsp;&nbsp;public static final int price;<br>
&nbsp;&nbsp;public static void setTimer(int);<br>
&nbsp;&nbsp;public abstract void onDevice();<br>
&nbsp;&nbsp;public abstract void offDevice();<br>
&nbsp;&nbsp;public void setLock();<br>
}<br>
== 1. an interface cannot be instantiated ==<br>
&gt; javac New.java<br>
New.java:3: error: VNRemote is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VNRemote r = new VNRemote();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 2. "int price = 10" is a constant, not a variable ==<br>
&gt; javac Assign.java<br>
Assign.java:3: error: cannot assign a value to final variable price<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VNRemote.price = 11;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 3. a field without a value ==<br>
&gt; javac NoValue.java<br>
NoValue.java:2: error: = expected<br>
&nbsp;&nbsp;&nbsp;&nbsp;int price;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== 4. a private method in an interface: Java 9+, not Java 8 ==<br>
&gt; javac PrivateHelper.java<br>
PrivateHelper.java:2: error: modifier private not allowed here<br>
&nbsp;&nbsp;&nbsp;&nbsp;private void log() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
PrivateHelper.java:2: error: interface abstract methods cannot have body<br>
&nbsp;&nbsp;&nbsp;&nbsp;private void log() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)</div>
<p>Đọc danh sách của javap: <code>final int MAXofButtons</code> và <code>int price</code> đều thành <code>public static final</code> — nên "trường đã khởi tạo" trên slide cũng là hằng, và câu "variable must be initialized" thật ra nghĩa là "mọi trường của interface đều là hằng nên phải có giá trị" (trường hợp 3). Phương thức không thân thành <code>public abstract</code>; phương thức default <code>setLock</code> là phương thức thể hiện public có thân (javap của JDK 8 không in chữ <code>default</code>).</p>
<p>Hai chỗ đính chính. "Không tạo đối tượng được <em>vì có phương thức không thân</em>": lý do thật là interface <strong>không có constructor</strong> — một interface không có phương thức nào vẫn không <code>new</code> được. Và danh sách thành viên là của Java 8; Java 9 thêm phương thức <strong>private</strong> (trường hợp 4 cho thấy JDK 8 từ chối), nên chữ "chỉ" tuỳ phiên bản.</p>`],
      [13, 'Why and When to Use Interfaces?',
        `<p class="y-chinh">🎯 Objects define their interaction with the outside world through the methods they <strong>expose</strong> — an interface names that set of methods. Java does not support multiple inheritance of classes, but a class can <strong>implement several interfaces</strong>, which gives the same effect for types.</p>
<p>The FU material's picture is a restaurant: the customer reads the <strong>Menu</strong> (the interface), the <strong>Chef</strong> implements it, and the customer never needs to know which chef cooked. In code: <code>Menu m = new Chef(); m.getSalad();</code> — the caller depends only on the interface, so you can replace the Chef class without touching the caller.</p>
<table>
<thead><tr><th>Use an interface when</th><th>Example on this site</th></tr></thead>
<tbody>
<tr><td>unrelated classes need the same ability</td><td><code>Comparable</code> for Student and for Product (Chapter 8)</td></tr>
<tr><td>you want callers to depend on "what", not "which class"</td><td>PE Q4: the marker's Main uses <code>IString</code>, never your class name</td></tr>
<tr><td>a class must play several roles</td><td>Television is a VNRemote and a ChinaRemote (slide 16)</td></tr>
</tbody>
</table>
<p>➕ Why Java refused multiple inheritance of classes: if <code>C</code> extended both <code>A</code> and <code>B</code> and both had a field <code>price</code> or a method body <code>setLock()</code>, which one would <code>C</code> get? (the "diamond problem"). Interfaces avoid fields with state, and slide 16 shows the compiler's answer when two default methods still collide.</p>
<div class="callout">🧭 <strong>Go further — Spring Boot</strong>: LabFlow's code is written against interfaces — <code>LabRepository extends JpaRepository&lt;Lab, Long&gt;</code> — and Spring generates the class that implements it at run time. You write the "what"; the framework supplies the "which class".</div>`,
        `<p class="y-chinh">🎯 Đối tượng định nghĩa cách nó tương tác với thế giới bên ngoài qua các phương thức nó <strong>công khai ra</strong> — interface đặt tên cho bộ phương thức đó. Java không cho đa kế thừa lớp, nhưng một lớp có thể <strong>hiện thực nhiều interface</strong>, cho cùng hiệu quả về mặt kiểu.</p>
<p>Hình ảnh trong học liệu FU là một nhà hàng: khách đọc <strong>Menu</strong> (interface), <strong>Chef</strong> (đầu bếp) hiện thực nó, và khách không cần biết đầu bếp nào nấu. Trong code: <code>Menu m = new Chef(); m.getSalad();</code> — bên gọi chỉ phụ thuộc vào interface, nên bạn thay được lớp Chef mà không phải đụng vào bên gọi.</p>
<table>
<thead><tr><th>Dùng interface khi</th><th>Ví dụ trên trang này</th></tr></thead>
<tbody>
<tr><td>các lớp không liên quan cần cùng một khả năng</td><td><code>Comparable</code> cho Student và cho Product (Chương 8)</td></tr>
<tr><td>muốn bên gọi phụ thuộc vào "cái gì" chứ không phải "lớp nào"</td><td>PE câu 4: Main của máy chấm dùng <code>IString</code>, không bao giờ dùng tên lớp của bạn</td></tr>
<tr><td>một lớp phải đóng nhiều vai</td><td>Television vừa là VNRemote vừa là ChinaRemote (slide 16)</td></tr>
</tbody>
</table>
<p>➕ Vì sao Java từ chối đa kế thừa lớp: nếu <code>C</code> kế thừa cả <code>A</code> lẫn <code>B</code> và cả hai đều có trường <code>price</code> hay thân phương thức <code>setLock()</code>, thì <code>C</code> nhận bản nào? (gọi là "vấn đề hình thoi" — diamond problem). Interface tránh trường có trạng thái, và slide 16 cho thấy câu trả lời của trình biên dịch khi hai phương thức default vẫn va nhau.</p>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot</strong>: code của LabFlow viết dựa trên interface — <code>LabRepository extends JpaRepository&lt;Lab, Long&gt;</code> — và Spring tự sinh lớp hiện thực nó lúc chạy. Bạn viết "cái gì"; framework lo "lớp nào".</div>`],
      [14, 'Example: how to create an interface',
        `<p class="y-chinh">🎯 <code>VNRemote</code> declares a constant <code>MAXofButtons</code>, a field <code>price</code>, a static method <code>setTimer</code>, two abstract methods <code>onDevice</code>/<code>offDevice</code> written two ways (<code>public abstract</code>, <code>abstract public</code>), and a <strong>default</strong> method <code>setLock</code> with a body.</p>
<pre class="trich"><code class="language-java">interface VNRemote {
    final int MAXofButtons=20;// constant
    int price=10;// variable must be initialized
    public static void setTimer(int number) {
        System.out.println("shut down after "+ number +" seconds");
    }
    public abstract void onDevice();//no body
    abstract public void offDevice();//no body
    default void setLock(){
        System.out.println("set lock in the default method");
    }
}</code></pre>
<table>
<thead><tr><th>Member as written</th><th>What it really is</th><th>How it is used</th></tr></thead>
<tbody>
<tr><td><code>final int MAXofButtons=20;</code></td><td><code>public static final</code> constant</td><td><code>VNRemote.MAXofButtons</code></td></tr>
<tr><td><code>int price=10;</code></td><td>also <code>public static final</code></td><td><code>VNRemote.price</code> — cannot be changed</td></tr>
<tr><td><code>public static void setTimer(int)</code></td><td>static method (Java 8+)</td><td>only <code>VNRemote.setTimer(…)</code> — not through an object or the implementing class</td></tr>
<tr><td><code>public abstract void onDevice();</code></td><td>abstract method</td><td>every implementing class must give a body</td></tr>
<tr><td><code>default void setLock(){…}</code></td><td>default method (Java 8+), public</td><td>inherited by implementers, may be overridden</td></tr>
</tbody>
</table>
<p>The keyword order <code>abstract public</code> versus <code>public abstract</code> does not matter, and inside an interface both words are optional — <code>void onDevice();</code> means exactly the same. PE papers write interface methods as <code>public String f1(String str);</code>; copy them as given.</p>`,
        `<p class="y-chinh">🎯 <code>VNRemote</code> khai báo một hằng <code>MAXofButtons</code>, một trường <code>price</code>, một phương thức static <code>setTimer</code>, hai phương thức trừu tượng <code>onDevice</code>/<code>offDevice</code> viết theo hai cách (<code>public abstract</code>, <code>abstract public</code>), và một phương thức <strong>default</strong> <code>setLock</code> có thân.</p>
<pre class="trich"><code class="language-java">interface VNRemote {
    final int MAXofButtons=20;// constant
    int price=10;// variable must be initialized
    public static void setTimer(int number) {
        System.out.println("shut down after "+ number +" seconds");
    }
    public abstract void onDevice();//no body
    abstract public void offDevice();//no body
    default void setLock(){
        System.out.println("set lock in the default method");
    }
}</code></pre>
<table>
<thead><tr><th>Thành viên như đã viết</th><th>Thật ra là gì</th><th>Dùng thế nào</th></tr></thead>
<tbody>
<tr><td><code>final int MAXofButtons=20;</code></td><td>hằng <code>public static final</code></td><td><code>VNRemote.MAXofButtons</code></td></tr>
<tr><td><code>int price=10;</code></td><td>cũng là <code>public static final</code></td><td><code>VNRemote.price</code> — không đổi được</td></tr>
<tr><td><code>public static void setTimer(int)</code></td><td>phương thức static (Java 8+)</td><td>chỉ <code>VNRemote.setTimer(…)</code> — không qua đối tượng hay qua lớp hiện thực</td></tr>
<tr><td><code>public abstract void onDevice();</code></td><td>phương thức trừu tượng</td><td>mọi lớp hiện thực phải cho nó một thân</td></tr>
<tr><td><code>default void setLock(){…}</code></td><td>phương thức default (Java 8+), public</td><td>lớp hiện thực được kế thừa, có thể ghi đè</td></tr>
</tbody>
</table>
<p>Thứ tự từ khoá <code>abstract public</code> hay <code>public abstract</code> không quan trọng, và trong interface cả hai từ đều có thể bỏ — <code>void onDevice();</code> nghĩa y hệt. Đề PE viết phương thức interface dạng <code>public String f1(String str);</code>; cứ chép đúng như đề.</p>`],
      [15, 'Example: implement an interface',
        `<p class="y-chinh">🎯 <code>Television implements VNRemote</code> and overrides the two abstract methods. In <code>main</code>, a variable of the <strong>interface type</strong> holds a Television: <code>VNRemote remote = new Television();</code> — the slide's arrows connect each call to its line of output.</p>
<pre class="trich"><code class="language-java">class Television implements VNRemote{
    //...
    @Override
    public void onDevice() {
        System.out.println("on TV");
    }
    @Override
    public void offDevice() {
        System.out.println("off TV");
    }
}</code></pre>
<pre class="trich"><code class="language-java">VNRemote remote=new Television();
remote.setLock();
remote.onDevice();
remote.offDevice();
VNRemote.setTimer(10000);
System.out.println("TV remote's price:"+VNRemote.price);
System.out.println("TV Remote has: " + VNRemote.MAXofButtons + "buttons");</code></pre>
<div class="out">set lock in the default method<br>
on TV<br>
off TV<br>
shut down after 10000 seconds<br>
TV remote's price:10<br>
TV Remote has: 20buttons</div>
<p>Exactly the slide's six lines. <code>remote.setLock()</code> runs the interface's default body because Television did not override it; <code>onDevice</code>/<code>offDevice</code> run Television's bodies; the static method and the constants are reached through the <strong>interface name</strong>. The "TV Remote has: 20buttons" line has no space before "buttons" — copied from the slide on purpose: in a PE, output spacing is graded.</p>
<div class="pitfall">An implementing method must be <code>public</code>, because interface methods are implicitly public. <code>void onDevice() { … }</code> in Television (no <code>public</code>) is "attempting to assign weaker access privileges; was public" — FE21 q27 and FE22 q24 in the Exam Room are exactly this.</div>`,
        `<p class="y-chinh">🎯 <code>Television implements VNRemote</code> và ghi đè hai phương thức trừu tượng. Trong <code>main</code>, một biến <strong>kiểu interface</strong> giữ một Television: <code>VNRemote remote = new Television();</code> — các mũi tên trên slide nối mỗi lời gọi với dòng output của nó.</p>
<pre class="trich"><code class="language-java">class Television implements VNRemote{
    //...
    @Override
    public void onDevice() {
        System.out.println("on TV");
    }
    @Override
    public void offDevice() {
        System.out.println("off TV");
    }
}</code></pre>
<pre class="trich"><code class="language-java">VNRemote remote=new Television();
remote.setLock();
remote.onDevice();
remote.offDevice();
VNRemote.setTimer(10000);
System.out.println("TV remote's price:"+VNRemote.price);
System.out.println("TV Remote has: " + VNRemote.MAXofButtons + "buttons");</code></pre>
<div class="out">set lock in the default method<br>
on TV<br>
off TV<br>
shut down after 10000 seconds<br>
TV remote's price:10<br>
TV Remote has: 20buttons</div>
<p>Đúng sáu dòng như slide. <code>remote.setLock()</code> chạy thân default của interface vì Television không ghi đè nó; <code>onDevice</code>/<code>offDevice</code> chạy thân của Television; phương thức static và các hằng được gọi qua <strong>tên interface</strong>. Dòng "TV Remote has: 20buttons" không có dấu cách trước "buttons" — chép nguyên từ slide có chủ đích: ở PE, khoảng trắng trong output cũng bị chấm.</p>
<div class="pitfall">Phương thức hiện thực phải là <code>public</code>, vì phương thức interface ngầm là public. <code>void onDevice() { … }</code> trong Television (thiếu <code>public</code>) là lỗi "attempting to assign weaker access privileges; was public" — FE21 câu 27 và FE22 câu 24 trong Exam Room hỏi đúng điều này.</div>`],
      [16, 'Example: multiple interfaces',
        `<p class="y-chinh">🎯 <code>class Television implements VNRemote, ChinaRemote</code> — interfaces are separated by commas, and the class must implement the abstract methods of <strong>both</strong>. A <code>ChinaRemote</code> variable can now hold a Television too.</p>
<pre class="trich"><code class="language-java">interface ChinaRemote {
    int price =5;
    void increaseVolumn();
    void descVolumn();
}

class Television implements VNRemote,ChinaRemote{
    @Override
    public void onDevice() { System.out.println("on TV"); }
    @Override
    public void offDevice() { System.out.println("off TV"); }
    @Override
    public void increaseVolumn() {
        System.out.println("increase volumn");
    }
    @Override
    public void descVolumn() {
        System.out.println("descrease volumn");
    }
}</code></pre>
<pre class="trich"><code class="language-java">VNRemote remote=new Television();
remote.setLock();
remote.onDevice();
remote.offDevice();
VNRemote.setTimer(10000);
System.out.println("TV remote's price:"+VNRemote.price);
System.out.println("TV Remote has: " + VNRemote.MAXofButtons + "buttons");
ChinaRemote remote2=new Television();
remote2.increaseVolumn();</code></pre>
<pre class="trich"><code class="language-java">Television tv = new Television();         // the class type sees BOTH sets of methods
tv.onDevice();
tv.descVolumn();
System.out.println("tv instanceof VNRemote: " + (tv instanceof VNRemote) + ", instanceof ChinaRemote: " + (tv instanceof ChinaRemote));
System.out.println("VNRemote.price=" + VNRemote.price + ", ChinaRemote.price=" + ChinaRemote.price);</code></pre>
<div class="out">set lock in the default method<br>
on TV<br>
off TV<br>
shut down after 10000 seconds<br>
TV remote's price:10<br>
TV Remote has: 20buttons<br>
increase volumn<br>
on TV<br>
descrease volumn<br>
tv instanceof VNRemote: true, instanceof ChinaRemote: true<br>
VNRemote.price=10, ChinaRemote.price=5</div>
<p>The first seven lines are the slide's output. Each interface variable sees only its own interface's methods (<code>remote2.onDevice()</code> would not compile — ChinaRemote has no onDevice); the class-type variable <code>tv</code> sees all of them. Both interfaces declare <code>price</code> (10 and 5): fine while you write <code>VNRemote.price</code>, but the plain name collides — and two default methods with the same signature collide too:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== the simple name price is ambiguous inside Television ==");
    viet(d, "Price.java",
        "interface VNRemote    { int price = 10; void onDevice(); }\\n" +
        "interface ChinaRemote { int price = 5;  void increaseVolumn(); }\\n" +
        "class Television implements VNRemote, ChinaRemote {\\n" +
        "    public void onDevice() { }\\n" +
        "    public void increaseVolumn() { }\\n" +
        "    int cost() { return price; }\\n" +
        "}\\n");
    lenh(d, "javac", "Price.java");

    System.out.println("== two default methods with the same signature ==");
    viet(d, "Lock.java",
        "interface VNRemote    { default void setLock() { System.out.println(\\"VN lock\\"); } }\\n" +
        "interface ChinaRemote { default void setLock() { System.out.println(\\"China lock\\"); } }\\n" +
        "class Television implements VNRemote, ChinaRemote { }\\n");
    lenh(d, "javac", "Lock.java");

    System.out.println("== the fix: override it, and pick a parent with X.super.method() ==");
    viet(d, "LockFixed.java",
        "interface VNRemote    { default void setLock() { System.out.println(\\"VN lock\\"); } }\\n" +
        "interface ChinaRemote { default void setLock() { System.out.println(\\"China lock\\"); } }\\n" +
        "class Television implements VNRemote, ChinaRemote {\\n" +
        "    @Override\\n" +
        "    public void setLock() {\\n" +
        "        VNRemote.super.setLock();\\n" +
        "        System.out.println(\\"and the TV's own child lock\\");\\n" +
        "    }\\n" +
        "}\\n" +
        "public class LockFixed {\\n" +
        "    public static void main(String[] args) { new Television().setLock(); }\\n" +
        "}\\n");
    lenh(d, "javac", "LockFixed.java");
    lenh(d, "java", "LockFixed");
}</code></pre>
<div class="out">== the simple name price is ambiguous inside Television ==<br>
&gt; javac Price.java<br>
Price.java:6: error: reference to price is ambiguous<br>
&nbsp;&nbsp;&nbsp;&nbsp;int cost() { return price; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;both variable price in VNRemote and variable price in ChinaRemote match<br>
1 error<br>
(exit code 1)<br>
== two default methods with the same signature ==<br>
&gt; javac Lock.java<br>
Lock.java:3: error: class Television inherits unrelated defaults for setLock() from types VNRemote and ChinaRemote<br>
class Television implements VNRemote, ChinaRemote { }<br>
^<br>
1 error<br>
(exit code 1)<br>
== the fix: override it, and pick a parent with X.super.method() ==<br>
&gt; javac LockFixed.java<br>
&gt; java LockFixed<br>
VN lock<br>
and the TV's own child lock</div>
<p>Java's rule for default-method conflicts: the class must override the method, and may call one parent explicitly with <code>InterfaceName.super.method()</code>. (The slide's <code>increaseVolumn</code> and "descrease" are typos for <em>volume</em> and <em>decrease</em>.)</p>`,
        `<p class="y-chinh">🎯 <code>class Television implements VNRemote, ChinaRemote</code> — các interface cách nhau bằng dấu phẩy, và lớp phải hiện thực phương thức trừu tượng của <strong>cả hai</strong>. Giờ một biến <code>ChinaRemote</code> cũng giữ được một Television.</p>
<pre class="trich"><code class="language-java">interface ChinaRemote {
    int price =5;
    void increaseVolumn();
    void descVolumn();
}

class Television implements VNRemote,ChinaRemote{
    @Override
    public void onDevice() { System.out.println("on TV"); }
    @Override
    public void offDevice() { System.out.println("off TV"); }
    @Override
    public void increaseVolumn() {
        System.out.println("increase volumn");
    }
    @Override
    public void descVolumn() {
        System.out.println("descrease volumn");
    }
}</code></pre>
<pre class="trich"><code class="language-java">VNRemote remote=new Television();
remote.setLock();
remote.onDevice();
remote.offDevice();
VNRemote.setTimer(10000);
System.out.println("TV remote's price:"+VNRemote.price);
System.out.println("TV Remote has: " + VNRemote.MAXofButtons + "buttons");
ChinaRemote remote2=new Television();
remote2.increaseVolumn();</code></pre>
<pre class="trich"><code class="language-java">Television tv = new Television();         // kiểu lớp thấy CẢ HAI bộ phương thức
tv.onDevice();
tv.descVolumn();
System.out.println("tv instanceof VNRemote: " + (tv instanceof VNRemote) + ", instanceof ChinaRemote: " + (tv instanceof ChinaRemote));
System.out.println("VNRemote.price=" + VNRemote.price + ", ChinaRemote.price=" + ChinaRemote.price);</code></pre>
<div class="out">set lock in the default method<br>
on TV<br>
off TV<br>
shut down after 10000 seconds<br>
TV remote's price:10<br>
TV Remote has: 20buttons<br>
increase volumn<br>
on TV<br>
descrease volumn<br>
tv instanceof VNRemote: true, instanceof ChinaRemote: true<br>
VNRemote.price=10, ChinaRemote.price=5</div>
<p>Bảy dòng đầu là output của slide. Mỗi biến kiểu interface chỉ thấy phương thức của interface đó (<code>remote2.onDevice()</code> sẽ không biên dịch — ChinaRemote không có onDevice); biến kiểu lớp <code>tv</code> thấy tất cả. Cả hai interface đều khai báo <code>price</code> (10 và 5): ổn khi bạn viết <code>VNRemote.price</code>, nhưng tên trơn thì va nhau — và hai phương thức default cùng chữ ký cũng va nhau:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== the simple name price is ambiguous inside Television ==");
    viet(d, "Price.java",
        "interface VNRemote    { int price = 10; void onDevice(); }\\n" +
        "interface ChinaRemote { int price = 5;  void increaseVolumn(); }\\n" +
        "class Television implements VNRemote, ChinaRemote {\\n" +
        "    public void onDevice() { }\\n" +
        "    public void increaseVolumn() { }\\n" +
        "    int cost() { return price; }\\n" +
        "}\\n");
    lenh(d, "javac", "Price.java");

    System.out.println("== two default methods with the same signature ==");
    viet(d, "Lock.java",
        "interface VNRemote    { default void setLock() { System.out.println(\\"VN lock\\"); } }\\n" +
        "interface ChinaRemote { default void setLock() { System.out.println(\\"China lock\\"); } }\\n" +
        "class Television implements VNRemote, ChinaRemote { }\\n");
    lenh(d, "javac", "Lock.java");

    System.out.println("== the fix: override it, and pick a parent with X.super.method() ==");
    viet(d, "LockFixed.java",
        "interface VNRemote    { default void setLock() { System.out.println(\\"VN lock\\"); } }\\n" +
        "interface ChinaRemote { default void setLock() { System.out.println(\\"China lock\\"); } }\\n" +
        "class Television implements VNRemote, ChinaRemote {\\n" +
        "    @Override\\n" +
        "    public void setLock() {\\n" +
        "        VNRemote.super.setLock();\\n" +
        "        System.out.println(\\"and the TV's own child lock\\");\\n" +
        "    }\\n" +
        "}\\n" +
        "public class LockFixed {\\n" +
        "    public static void main(String[] args) { new Television().setLock(); }\\n" +
        "}\\n");
    lenh(d, "javac", "LockFixed.java");
    lenh(d, "java", "LockFixed");
}</code></pre>
<div class="out">== the simple name price is ambiguous inside Television ==<br>
&gt; javac Price.java<br>
Price.java:6: error: reference to price is ambiguous<br>
&nbsp;&nbsp;&nbsp;&nbsp;int cost() { return price; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;both variable price in VNRemote and variable price in ChinaRemote match<br>
1 error<br>
(exit code 1)<br>
== two default methods with the same signature ==<br>
&gt; javac Lock.java<br>
Lock.java:3: error: class Television inherits unrelated defaults for setLock() from types VNRemote and ChinaRemote<br>
class Television implements VNRemote, ChinaRemote { }<br>
^<br>
1 error<br>
(exit code 1)<br>
== the fix: override it, and pick a parent with X.super.method() ==<br>
&gt; javac LockFixed.java<br>
&gt; java LockFixed<br>
VN lock<br>
and the TV's own child lock</div>
<p>Luật Java cho xung đột phương thức default: lớp phải ghi đè phương thức đó, và có thể gọi đích danh một cha bằng <code>TênInterface.super.phươngThức()</code>. (<code>increaseVolumn</code> và "descrease" trên slide là lỗi gõ của <em>volume</em> và <em>decrease</em>.)</p>`],
      [17, 'Example: how to extend interfaces',
        `<p class="y-chinh">🎯 <code>interface KoreaRemote extends VNRemote</code> adds <code>subtitle(String)</code>. <code>AirCondition implements KoreaRemote</code>, so it must implement <code>subtitle</code> <strong>and</strong> the inherited <code>onDevice</code>/<code>offDevice</code>; it gets <code>setLock()</code> for free.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9f4479b89ed31b92b32e78f23ab5c28dec1d8a06.svg" alt="Slides 14–17 in UML: dashed arrows = implements, solid arrow between interfaces = extends" loading="lazy" /><p class="chu-thich">🧩 Slides 14–17 in UML: dashed arrows = implements, solid arrow between interfaces = extends</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slides 14-17 — the remote-control interfaces and the classes that implement them
' Dashed line with hollow triangle = implements; solid line with hollow triangle between interfaces = extends
interface VNRemote {
  + MAXofButtons : int = 20 {static, final}
  + price : int = 10 {static, final}
  + {static} setTimer(number : int) : void
  + {abstract} onDevice() : void
  + {abstract} offDevice() : void
  + setLock() : void «default»
}
interface ChinaRemote {
  + price : int = 5 {static, final}
  + {abstract} increaseVolumn() : void
  + {abstract} descVolumn() : void
}
interface KoreaRemote {
  + {abstract} subtitle(language : String) : void
}
class Television {
  + onDevice() : void
  + offDevice() : void
  + increaseVolumn() : void
  + descVolumn() : void
}
class AirCondition {
  + subtitle(language : String) : void
  + onDevice() : void
  + offDevice() : void
}
VNRemote &lt;|.. Television
ChinaRemote &lt;|.. Television
VNRemote &lt;|-- KoreaRemote
KoreaRemote &lt;|.. AirCondition
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">interface KoreaRemote extends VNRemote {
    void subtitle(String language);
}

class AirCondition implements KoreaRemote{
    //...
    @Override
    public void subtitle(String language) {
        System.out.println("display " +language);
    }
    @Override
    public void onDevice() {System.out.println("on AC"); }
    @Override
    public void offDevice() {System.out.println("off AC");}
}</code></pre>
<pre class="trich"><code class="language-java">KoreaRemote re=new AirCondition();
re.onDevice();
re.subtitle("Korean");
re.setLock();</code></pre>
<pre class="trich"><code class="language-java">VNRemote vn = re;                          // a KoreaRemote IS a VNRemote
vn.offDevice();
System.out.println("re instanceof VNRemote: " + (re instanceof VNRemote));</code></pre>
<div class="out">on AC<br>
display Korean<br>
set lock in the default method<br>
off AC<br>
re instanceof VNRemote: true</div>
<p>The first three lines are the slide's. Keywords to keep straight: a class <code>extends</code> one class and <code>implements</code> interfaces; an interface <code>extends</code> interfaces — and it may extend <strong>several</strong> (<code>interface SmartRemote extends KoreaRemote, ChinaRemote</code> is legal). Because a KoreaRemote is-a VNRemote, the AirCondition fits in a <code>VNRemote</code> variable.</p>
<p class="meo">🧠 In UML: class-to-interface is a <strong>dashed</strong> line with a hollow triangle ("realization"); interface-to-interface and class-to-class are <strong>solid</strong> lines with a hollow triangle ("generalization").</p>`,
        `<p class="y-chinh">🎯 <code>interface KoreaRemote extends VNRemote</code> thêm <code>subtitle(String)</code>. <code>AirCondition implements KoreaRemote</code>, nên nó phải hiện thực <code>subtitle</code> <strong>và</strong> cả <code>onDevice</code>/<code>offDevice</code> được kế thừa; còn <code>setLock()</code> thì có sẵn.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9f4479b89ed31b92b32e78f23ab5c28dec1d8a06.svg" alt="Slide 14–17 bằng UML: mũi tên nét đứt = implements, mũi tên nét liền giữa hai interface = extends" loading="lazy" /><p class="chu-thich">🧩 Slide 14–17 bằng UML: mũi tên nét đứt = implements, mũi tên nét liền giữa hai interface = extends</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slides 14-17 — the remote-control interfaces and the classes that implement them
' Nét đứt tam giác rỗng = implements; nét liền tam giác rỗng giữa hai interface = extends
interface VNRemote {
  + MAXofButtons : int = 20 {static, final}
  + price : int = 10 {static, final}
  + {static} setTimer(number : int) : void
  + {abstract} onDevice() : void
  + {abstract} offDevice() : void
  + setLock() : void «default»
}
interface ChinaRemote {
  + price : int = 5 {static, final}
  + {abstract} increaseVolumn() : void
  + {abstract} descVolumn() : void
}
interface KoreaRemote {
  + {abstract} subtitle(language : String) : void
}
class Television {
  + onDevice() : void
  + offDevice() : void
  + increaseVolumn() : void
  + descVolumn() : void
}
class AirCondition {
  + subtitle(language : String) : void
  + onDevice() : void
  + offDevice() : void
}
VNRemote &lt;|.. Television
ChinaRemote &lt;|.. Television
VNRemote &lt;|-- KoreaRemote
KoreaRemote &lt;|.. AirCondition
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">interface KoreaRemote extends VNRemote {
    void subtitle(String language);
}

class AirCondition implements KoreaRemote{
    //...
    @Override
    public void subtitle(String language) {
        System.out.println("display " +language);
    }
    @Override
    public void onDevice() {System.out.println("on AC"); }
    @Override
    public void offDevice() {System.out.println("off AC");}
}</code></pre>
<pre class="trich"><code class="language-java">KoreaRemote re=new AirCondition();
re.onDevice();
re.subtitle("Korean");
re.setLock();</code></pre>
<pre class="trich"><code class="language-java">VNRemote vn = re;                          // KoreaRemote LÀ một VNRemote
vn.offDevice();
System.out.println("re instanceof VNRemote: " + (re instanceof VNRemote));</code></pre>
<div class="out">on AC<br>
display Korean<br>
set lock in the default method<br>
off AC<br>
re instanceof VNRemote: true</div>
<p>Ba dòng đầu là của slide. Từ khoá cần phân biệt rõ: lớp <code>extends</code> một lớp và <code>implements</code> các interface; interface <code>extends</code> các interface — và được mở rộng <strong>nhiều</strong> interface (<code>interface SmartRemote extends KoreaRemote, ChinaRemote</code> là hợp lệ). Vì KoreaRemote là một VNRemote, AirCondition vừa với một biến <code>VNRemote</code>.</p>
<p class="meo">🧠 Trong UML: lớp-tới-interface là đường <strong>nét đứt</strong> có tam giác rỗng ("realization" — hiện thực hoá); interface-tới-interface và lớp-tới-lớp là đường <strong>nét liền</strong> có tam giác rỗng ("generalization" — tổng quát hoá).</p>`],
      [18, 'Abstract Classes',
        `<p class="y-chinh">🎯 An <strong>abstract class</strong> defines <em>what</em> behaviours a class is required to perform without having to provide an explicit implementation — the result of very high generalization. Syntax: <code>public abstract class ClassName { … }</code>. Not all of its methods need to be abstract; it can also declare implemented methods.</p>
<p>Compared with an interface, an abstract class is a <strong>real class with holes</strong>: it can have fields with state, constructors, private methods, and normal methods — plus <strong>abstract methods</strong>, declared with <code>abstract</code> and a semicolon instead of a body. The FU antique shop explains when you need one: <code>displayPrice()</code> belongs to every Item, but Item does not know height or weight, so it cannot write the body — each subclass must.</p>
<table>
<thead><tr><th></th><th>Abstract class</th><th>Interface (Java 8)</th></tr></thead>
<tbody>
<tr><td>instantiate with new</td><td>no</td><td>no</td></tr>
<tr><td>fields</td><td>any (with state)</td><td>only public static final constants</td></tr>
<tr><td>constructors</td><td>yes (run by <code>super(...)</code>)</td><td>no</td></tr>
<tr><td>methods with a body</td><td>yes</td><td>default and static only</td></tr>
<tr><td>a class can have</td><td>one abstract parent</td><td>many interfaces</td></tr>
<tr><td>use when</td><td>subclasses share code and state</td><td>unrelated classes share an ability</td></tr>
</tbody>
</table>
<p class="meo">🧠 PE3's diagram writes <code>+addData(): String {abstract}</code> — the <code>{abstract}</code> marker (or italics) in a class box means "declare it with <code>abstract</code>, no body".</p>`,
        `<p class="y-chinh">🎯 <strong>Lớp trừu tượng (abstract class)</strong> định nghĩa <em>những hành vi nào</em> một lớp bắt buộc phải có mà không cần cung cấp cài đặt cụ thể — kết quả của sự tổng quát hoá rất cao. Cú pháp: <code>public abstract class TenLop { … }</code>. Không phải mọi phương thức của nó đều phải trừu tượng; nó cũng có thể khai báo phương thức đã cài đặt.</p>
<p>So với interface, lớp trừu tượng là <strong>một lớp thật nhưng có lỗ hổng</strong>: nó có trường mang trạng thái, constructor, phương thức private và phương thức bình thường — cộng thêm các <strong>phương thức trừu tượng</strong>, khai báo bằng <code>abstract</code> và dấu chấm phẩy thay cho thân. Cửa hàng đồ cổ trong học liệu FU giải thích khi nào cần nó: <code>displayPrice()</code> thuộc về mọi Item, nhưng Item không biết chiều cao hay cân nặng nên không viết được thân — mỗi lớp con phải viết.</p>
<table>
<thead><tr><th></th><th>Lớp trừu tượng</th><th>Interface (Java 8)</th></tr></thead>
<tbody>
<tr><td>tạo bằng new</td><td>không</td><td>không</td></tr>
<tr><td>trường</td><td>tuỳ ý (có trạng thái)</td><td>chỉ hằng public static final</td></tr>
<tr><td>constructor</td><td>có (chạy qua <code>super(...)</code>)</td><td>không</td></tr>
<tr><td>phương thức có thân</td><td>có</td><td>chỉ default và static</td></tr>
<tr><td>một lớp có thể có</td><td>một cha trừu tượng</td><td>nhiều interface</td></tr>
<tr><td>dùng khi</td><td>các lớp con chia sẻ code và trạng thái</td><td>các lớp không liên quan chia sẻ một khả năng</td></tr>
</tbody>
</table>
<p class="meo">🧠 Sơ đồ đề PE3 ghi <code>+addData(): String {abstract}</code> — dấu <code>{abstract}</code> (hoặc chữ nghiêng) trong hộp lớp nghĩa là "khai báo bằng <code>abstract</code>, không có thân".</p>`],
      [19, 'Abstract classes',
        `<p class="y-chinh">🎯 <code>public abstract class Shape</code> declares two abstract methods; <code>Circle</code> and <code>Rect</code> extend it and implement both. <code>Shape s = new Shape();</code> is a compile error; the "Modified" version <code>Shape s = new Circle(5);</code> runs and prints 78.53981633974483.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b556924ae050b99171c3fbc7a9a9d445ff2555f4.svg" alt="Slide 19 in UML: the abstract class name and abstract methods in italics" loading="lazy" /><p class="chu-thich">🧩 Slide 19 in UML: the abstract class name and abstract methods in italics</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 19 — abstract class Shape (name in italics) and two concrete subclasses
' {abstract} methods have no body in Shape; Circle and Rect must give both a body
abstract class Shape {
  + {abstract} circumstance() : double
  + {abstract} area() : double
}
class Circle {
  ~ r : double
  + Circle(rr : double)
  + circumstance() : double
  + area() : double
}
class Rect {
  ~ l : double
  ~ w : double
  + Rect(ll : double, ww : double)
  + circumstance() : double
  + area() : double
}
Shape &lt;|-- Circle
Shape &lt;|-- Rect
note bottom of Shape
  new Shape(): compile error
  Shape s = new Circle(5); s.area() gives 78.53981633974483
end note
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 19: Shape s = new Shape(); ==");
    viet(d, "Program.java",
        "abstract class Shape {\\n" +
        "    abstract public double area();\\n" +
        "}\\n" +
        "class Program {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Shape s = new Shape();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Program.java");

    System.out.println("== slide 20: abstract class with NO abstract method ==");
    viet(d, "AbstractDemo2.java",
        "public abstract class AbstractDemo2 {\\n" +
        "    void m1() { System.out.println(\\"m1\\"); }\\n" +
        "    void m2() { }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        AbstractDemo2 obj = new AbstractDemo2();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "AbstractDemo2.java");

    System.out.println("== slide 21: 'Error. Why?' ==");
    viet(d, "AbstractDemo2.java",
        "public abstract class AbstractDemo2 {\\n" +
        "    void m1() { System.out.println(\\"m1\\"); }\\n" +
        "    abstract void m2();\\n" +
        "}\\n" +
        "class Derived extends AbstractDemo2 {\\n" +
        "    public void m1() { System.out.println(\\"m1\\"); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Derived obj = new Derived();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "AbstractDemo2.java");

    System.out.println("== two more: an abstract method with a body; abstract + final ==");
    viet(d, "More.java",
        "abstract class A {\\n" +
        "    abstract void m() { }\\n" +
        "}\\n" +
        "final abstract class B { }\\n");
    lenh(d, "javac", "More.java");
}</code></pre>
<div class="out">== slide 19: Shape s = new Shape(); ==<br>
&gt; javac Program.java<br>
Program.java:6: error: Shape is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shape s = new Shape();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 20: abstract class with NO abstract method ==<br>
&gt; javac AbstractDemo2.java<br>
AbstractDemo2.java:5: error: AbstractDemo2 is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AbstractDemo2 obj = new AbstractDemo2();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 21: 'Error. Why?' ==<br>
&gt; javac AbstractDemo2.java<br>
AbstractDemo2.java:5: error: Derived is not abstract and does not override abstract method m2() in AbstractDemo2<br>
class Derived extends AbstractDemo2 {<br>
^<br>
1 error<br>
(exit code 1)<br>
== two more: an abstract method with a body; abstract + final ==<br>
&gt; javac More.java<br>
More.java:4: error: illegal combination of modifiers: abstract and final<br>
final abstract class B { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
More.java:2: error: abstract methods cannot have a body<br>
&nbsp;&nbsp;&nbsp;&nbsp;abstract void m() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)</div>
<p>The first case is the slide's red line. The modified program, plus a loop over several shapes — the point of making Shape abstract is that code like this works for every present and future shape:</p>
<pre class="trich"><code class="language-java">abstract class Shape {
    abstract public double circumstance();
    abstract public double area();
}
class Circle extends Shape {
    double r;
    public Circle (double rr) { r=rr; }
    public double circumstance() { return 2*Math.PI*r; }
    public double area() { return Math.PI*r*r; }
}
class Rect extends Shape {
    double l,w;
    public Rect(double ll, double ww){
        l = ll; w = ww;
    }
    public double circumstance() { return 2*(l+w); }
    public double area() { return l*w; }
}</code></pre>
<pre class="trich"><code class="language-java">Shape[] shapes = { new Circle(5), new Rect(3, 4), new Circle(1) };
double total = 0;
for (Shape sh : shapes) {
    System.out.printf("%-6s area=%8.3f perimeter=%7.3f%n", sh.getClass().getSimpleName(), sh.area(), sh.circumstance());
    total += sh.area();
}
System.out.printf("total area = %.3f%n", total);</code></pre>
<div class="out">78.53981633974483<br>
Circle area= &nbsp;78.540 perimeter= 31.416<br>
Rect &nbsp;&nbsp;area= &nbsp;12.000 perimeter= 14.000<br>
Circle area= &nbsp;&nbsp;3.142 perimeter= &nbsp;6.283<br>
total area = 93.681</div>
<p>78.53981633974483 = π·5², exactly the slide's output. Two notes on the slide's code: <code>circumstance()</code> is a mistranslation — the perimeter of a circle is its <em>circumference</em>; and the screenshot puts <code>package shapes;</code> plus three package-private classes in one file with the public <code>Shape</code> — legal, but in a PE keep one public class per file as NetBeans creates them.</p>`,
        `<p class="y-chinh">🎯 <code>public abstract class Shape</code> khai báo hai phương thức trừu tượng; <code>Circle</code> và <code>Rect</code> kế thừa nó và hiện thực cả hai. <code>Shape s = new Shape();</code> là lỗi biên dịch; bản "Modified" <code>Shape s = new Circle(5);</code> chạy và in 78.53981633974483.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b556924ae050b99171c3fbc7a9a9d445ff2555f4.svg" alt="Slide 19 bằng UML: tên lớp trừu tượng và phương thức trừu tượng in nghiêng" loading="lazy" /><p class="chu-thich">🧩 Slide 19 bằng UML: tên lớp trừu tượng và phương thức trừu tượng in nghiêng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 19 — abstract class Shape (name in italics) and two concrete subclasses
' Phương thức {abstract} không có thân trong Shape; Circle và Rect phải cho cả hai một thân
abstract class Shape {
  + {abstract} circumstance() : double
  + {abstract} area() : double
}
class Circle {
  ~ r : double
  + Circle(rr : double)
  + circumstance() : double
  + area() : double
}
class Rect {
  ~ l : double
  ~ w : double
  + Rect(ll : double, ww : double)
  + circumstance() : double
  + area() : double
}
Shape &lt;|-- Circle
Shape &lt;|-- Rect
note bottom of Shape
  new Shape(): compile error
  Shape s = new Circle(5); s.area() gives 78.53981633974483
end note
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== slide 19: Shape s = new Shape(); ==");
    viet(d, "Program.java",
        "abstract class Shape {\\n" +
        "    abstract public double area();\\n" +
        "}\\n" +
        "class Program {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Shape s = new Shape();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Program.java");

    System.out.println("== slide 20: abstract class with NO abstract method ==");
    viet(d, "AbstractDemo2.java",
        "public abstract class AbstractDemo2 {\\n" +
        "    void m1() { System.out.println(\\"m1\\"); }\\n" +
        "    void m2() { }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        AbstractDemo2 obj = new AbstractDemo2();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "AbstractDemo2.java");

    System.out.println("== slide 21: 'Error. Why?' ==");
    viet(d, "AbstractDemo2.java",
        "public abstract class AbstractDemo2 {\\n" +
        "    void m1() { System.out.println(\\"m1\\"); }\\n" +
        "    abstract void m2();\\n" +
        "}\\n" +
        "class Derived extends AbstractDemo2 {\\n" +
        "    public void m1() { System.out.println(\\"m1\\"); }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Derived obj = new Derived();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "AbstractDemo2.java");

    System.out.println("== two more: an abstract method with a body; abstract + final ==");
    viet(d, "More.java",
        "abstract class A {\\n" +
        "    abstract void m() { }\\n" +
        "}\\n" +
        "final abstract class B { }\\n");
    lenh(d, "javac", "More.java");
}</code></pre>
<div class="out">== slide 19: Shape s = new Shape(); ==<br>
&gt; javac Program.java<br>
Program.java:6: error: Shape is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shape s = new Shape();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 20: abstract class with NO abstract method ==<br>
&gt; javac AbstractDemo2.java<br>
AbstractDemo2.java:5: error: AbstractDemo2 is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AbstractDemo2 obj = new AbstractDemo2();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== slide 21: 'Error. Why?' ==<br>
&gt; javac AbstractDemo2.java<br>
AbstractDemo2.java:5: error: Derived is not abstract and does not override abstract method m2() in AbstractDemo2<br>
class Derived extends AbstractDemo2 {<br>
^<br>
1 error<br>
(exit code 1)<br>
== two more: an abstract method with a body; abstract + final ==<br>
&gt; javac More.java<br>
More.java:4: error: illegal combination of modifiers: abstract and final<br>
final abstract class B { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
More.java:2: error: abstract methods cannot have a body<br>
&nbsp;&nbsp;&nbsp;&nbsp;abstract void m() { }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)</div>
<p>Trường hợp đầu chính là dòng gạch đỏ trên slide. Chương trình đã sửa, thêm một vòng lặp qua vài hình — mục đích của việc cho Shape là abstract là để code kiểu này chạy được với mọi hình hiện có và sau này:</p>
<pre class="trich"><code class="language-java">abstract class Shape {
    abstract public double circumstance();
    abstract public double area();
}
class Circle extends Shape {
    double r;
    public Circle (double rr) { r=rr; }
    public double circumstance() { return 2*Math.PI*r; }
    public double area() { return Math.PI*r*r; }
}
class Rect extends Shape {
    double l,w;
    public Rect(double ll, double ww){
        l = ll; w = ww;
    }
    public double circumstance() { return 2*(l+w); }
    public double area() { return l*w; }
}</code></pre>
<pre class="trich"><code class="language-java">Shape[] shapes = { new Circle(5), new Rect(3, 4), new Circle(1) };
double total = 0;
for (Shape sh : shapes) {
    System.out.printf("%-6s area=%8.3f perimeter=%7.3f%n", sh.getClass().getSimpleName(), sh.area(), sh.circumstance());
    total += sh.area();
}
System.out.printf("total area = %.3f%n", total);</code></pre>
<div class="out">78.53981633974483<br>
Circle area= &nbsp;78.540 perimeter= 31.416<br>
Rect &nbsp;&nbsp;area= &nbsp;12.000 perimeter= 14.000<br>
Circle area= &nbsp;&nbsp;3.142 perimeter= &nbsp;6.283<br>
total area = 93.681</div>
<p>78.53981633974483 = π·5², đúng output trên slide. Hai ghi chú về code của slide: <code>circumstance()</code> là dịch nhầm — chu vi hình tròn là <em>circumference</em>; và ảnh chụp đặt <code>package shapes;</code> cùng ba lớp package-private chung một file với lớp public <code>Shape</code> — hợp lệ, nhưng làm PE thì giữ mỗi file một lớp public đúng như NetBeans tạo.</p>`],
      [20, 'This class has no abstract method but is declared abstract, so we cannot instantiate it',
        `<p class="y-chinh">🎯 <code>AbstractDemo2</code> has no abstract method — <code>m1()</code> prints, <code>m2()</code> is empty — but it is declared <code>abstract</code>, so <code>new AbstractDemo2()</code> is refused. "Abstract" is a property of the <strong>class</strong>, not a count of its methods.</p>
<p>The error is the second case of the session on slide 19 ("AbstractDemo2 is abstract; cannot be instantiated"). The slide's comments say "It is not abstract class" next to each method — they mean "this is not an abstract <em>method</em>". The FU material's definition "an abstract class is a class that contains one or more abstract methods" is therefore incomplete: the rule is one-way — a class <em>with</em> an abstract method <strong>must</strong> be abstract, but an abstract class need not have one.</p>
<pre class="trich"><code class="language-java">abstract class AbstractDemo2 {                  // slide 20: abstract, but no abstract method
    void m1() { System.out.println("m1 from AbstractDemo2"); }
    void m2() { }
}
class Concrete extends AbstractDemo2 { }        // an empty subclass is enough to create objects

abstract class Shape {
    abstract double area();
    abstract double perimeter();
    String describe() {                         // concrete method that CALLS the abstract ones
        return getClass().getSimpleName() + ": area=" + area() + ", perimeter=" + perimeter();
    }
}
abstract class Polygon extends Shape {          // implements only perimeter() -&gt; must stay abstract
    protected double[] sides;
    Polygon(double... sides) { this.sides = sides; }
    @Override
    double perimeter() {
        double p = 0;
        for (double s : sides) p += s;
        return p;
    }
}
class Square extends Polygon {                  // implements the last abstract method -&gt; concrete
    Square(double a) { super(a, a, a, a); }
    @Override
    double area() { return sides[0] * sides[0]; }
}</code></pre>
<div class="out">m1 from AbstractDemo2<br>
Square: area=9.0, perimeter=12.0<br>
s instanceof Polygon: true</div>
<p>An empty subclass (<code>class Concrete extends AbstractDemo2 { }</code>) is enough to create objects. Why write such a class? To say "use me only as a parent". Real examples: <code>java.awt.event.MouseAdapter</code> is an abstract class whose methods all have empty bodies (slide 26).</p>`,
        `<p class="y-chinh">🎯 <code>AbstractDemo2</code> không có phương thức trừu tượng nào — <code>m1()</code> in ra, <code>m2()</code> rỗng — nhưng được khai báo <code>abstract</code>, nên <code>new AbstractDemo2()</code> bị từ chối. "Trừu tượng" là tính chất của <strong>lớp</strong>, không phải là đếm số phương thức.</p>
<p>Lỗi này là trường hợp thứ hai trong phiên ở slide 19 ("AbstractDemo2 is abstract; cannot be instantiated"). Chú thích trên slide ghi "It is not abstract class" cạnh mỗi phương thức — ý là "đây không phải <em>phương thức</em> trừu tượng". Định nghĩa của học liệu FU "lớp trừu tượng là lớp chứa một hay nhiều phương thức trừu tượng" vì thế chưa đủ: luật chỉ đi một chiều — lớp <em>có</em> phương thức trừu tượng <strong>bắt buộc</strong> là abstract, còn lớp abstract thì không cần có cái nào.</p>
<pre class="trich"><code class="language-java">abstract class AbstractDemo2 {                  // slide 20: abstract nhưng không có phương thức trừu tượng
    void m1() { System.out.println("m1 from AbstractDemo2"); }
    void m2() { }
}
class Concrete extends AbstractDemo2 { }        // một lớp con rỗng là đủ để tạo đối tượng

abstract class Shape {
    abstract double area();
    abstract double perimeter();
    String describe() {                         // phương thức cụ thể GỌI các phương thức trừu tượng
        return getClass().getSimpleName() + ": area=" + area() + ", perimeter=" + perimeter();
    }
}
abstract class Polygon extends Shape {          // chỉ hiện thực perimeter() -&gt; phải vẫn là abstract
    protected double[] sides;
    Polygon(double... sides) { this.sides = sides; }
    @Override
    double perimeter() {
        double p = 0;
        for (double s : sides) p += s;
        return p;
    }
}
class Square extends Polygon {                  // hiện thực phương thức trừu tượng cuối cùng -&gt; cụ thể
    Square(double a) { super(a, a, a, a); }
    @Override
    double area() { return sides[0] * sides[0]; }
}</code></pre>
<div class="out">m1 from AbstractDemo2<br>
Square: area=9.0, perimeter=12.0<br>
s instanceof Polygon: true</div>
<p>Một lớp con rỗng (<code>class Concrete extends AbstractDemo2 { }</code>) là đủ để tạo đối tượng. Viết lớp như vậy để làm gì? Để nói "chỉ dùng tôi làm lớp cha". Ví dụ thật: <code>java.awt.event.MouseAdapter</code> là lớp trừu tượng mà mọi phương thức đều có thân rỗng (slide 26).</p>`],
      [21, 'Error. Why?',
        `<p class="y-chinh">🎯 <code>AbstractDemo2</code> now declares <code>abstract void m2();</code>. <code>Derived extends AbstractDemo2</code> overrides <code>m1()</code> but not <code>m2()</code> — so Derived still has an abstract method, and a class with an abstract method must itself be abstract. Hence the error on <code>class Derived</code>.</p>
<p>The JDK 8 message (third case of the session on slide 19) says it all: <em>Derived is not abstract and does not override abstract method m2() in AbstractDemo2</em>. Notice <strong>where</strong> the error points: at the class header, not at <code>new Derived()</code>. Two fixes, depending on what you want:</p>
<table>
<thead><tr><th>Fix</th><th>Code</th><th>Result</th></tr></thead>
<tbody>
<tr><td>implement the missing method</td><td><code>void m2() { … }</code> in Derived</td><td>Derived is concrete; <code>new Derived()</code> works</td></tr>
<tr><td>admit that Derived is incomplete</td><td><code>abstract class Derived …</code></td><td>compiles, but <code>new Derived()</code> is now the error</td></tr>
</tbody>
</table>
<p>Also visible in the screenshot: Derived's <code>m1()</code> is <code>public</code> while the parent's is package-private. That is allowed — an override may <em>widen</em> access, never narrow it (lesson 4.B, slide 7).</p>
<div class="pitfall">PE trap: the abstract class in the paper declares <code>+getInfo(): String {abstract}</code> and <code>+getType(): String {abstract}</code> (PE5). Forget one in one subclass and the project does not build — all 10 marks of a single-question paper depend on it. Let NetBeans help: the light bulb on the class line → "Implement all abstract methods".</div>`,
        `<p class="y-chinh">🎯 Giờ <code>AbstractDemo2</code> khai báo <code>abstract void m2();</code>. <code>Derived extends AbstractDemo2</code> ghi đè <code>m1()</code> nhưng không ghi đè <code>m2()</code> — nên Derived vẫn còn một phương thức trừu tượng, mà lớp có phương thức trừu tượng thì chính nó phải là abstract. Vì thế lỗi nằm ở <code>class Derived</code>.</p>
<p>Thông báo của JDK 8 (trường hợp thứ ba trong phiên ở slide 19) nói hết: <em>Derived is not abstract and does not override abstract method m2() in AbstractDemo2</em> (Derived không phải abstract và không ghi đè phương thức trừu tượng m2() của AbstractDemo2). Để ý lỗi chỉ <strong>vào đâu</strong>: vào dòng khai báo lớp, không phải vào <code>new Derived()</code>. Hai cách sửa, tuỳ ý bạn muốn:</p>
<table>
<thead><tr><th>Cách sửa</th><th>Code</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>hiện thực phương thức còn thiếu</td><td><code>void m2() { … }</code> trong Derived</td><td>Derived thành lớp cụ thể; <code>new Derived()</code> chạy được</td></tr>
<tr><td>thừa nhận Derived chưa hoàn chỉnh</td><td><code>abstract class Derived …</code></td><td>biên dịch được, nhưng giờ <code>new Derived()</code> mới là lỗi</td></tr>
</tbody>
</table>
<p>Cũng thấy trong ảnh chụp: <code>m1()</code> của Derived là <code>public</code> trong khi của cha là package-private. Điều đó được phép — bản ghi đè được <em>nới rộng</em> quyền truy cập, không bao giờ thu hẹp (bài 4.B, slide 7).</p>
<div class="pitfall">Bẫy PE: lớp trừu tượng trong đề khai báo <code>+getInfo(): String {abstract}</code> và <code>+getType(): String {abstract}</code> (PE5). Quên một cái ở một lớp con là project không build — cả 10 điểm của đề một câu phụ thuộc vào nó. Để NetBeans giúp: bóng đèn ở dòng khai báo lớp → "Implement all abstract methods".</div>`],
      [22, 'Implementing Abstract Methods',
        `<p class="y-chinh">🎯 A subclass of an abstract class inherits <strong>all</strong> of its features, abstract methods included. To replace an inherited abstract method with a concrete version, the subclass simply overrides it. Abstract classes <strong>cannot be instantiated</strong>.</p>
<p>"Inherits the abstract methods too" explains a middle layer: a subclass may implement only some of them and stay abstract, and the next level finishes the job. The program on slide 20 shows it — <code>Polygon</code> implements <code>perimeter()</code> only, so it must be abstract; <code>Square</code> adds <code>area()</code> and is concrete:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7ca929670bcd19e73bb8fc8b28e20276cb58ddc5.svg" alt="Slide 22: two abstract levels, then a concrete class" loading="lazy" /><p class="chu-thich">🧩 Slide 22: two abstract levels, then a concrete class</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 22 — a class stays abstract until every inherited abstract method has a body
' Polygon implements perimeter() only, so it must stay abstract; Square adds area() and becomes concrete
abstract class Shape {
  ~ {abstract} area() : double
  ~ {abstract} perimeter() : double
  ~ describe() : String
}
abstract class Polygon {
  # sides : double[]
  ~ perimeter() : double
}
class Square {
  ~ Square(a : double)
  ~ area() : double
}
Shape &lt;|-- Polygon
Polygon &lt;|-- Square
@enduml</code></pre></details>
<p>Look at <code>Shape.describe()</code> in that program: a <strong>concrete</strong> method in the abstract class that <strong>calls</strong> the abstract ones. It works because whatever object runs it is a concrete subclass with real bodies. This pattern has a name, the <strong>template method</strong>: the parent fixes the steps, the children fill in the details.</p>
<div class="callout">🧭 <strong>Go further — the school's Banking project</strong>: <code>textview/Menu.java</code> is exactly this. <code>abstract class Menu</code> has a concrete <code>run()</code> loop (display, read a choice, repeat) that calls <code>public abstract void execute(int n)</code>; <code>BankApp extends Menu</code> fills in what each choice does. The 🧪 practice of Chapter 5 rebuilds this menu for a LAB211-style program — and fixes a real bug in it.</div>`,
        `<p class="y-chinh">🎯 Lớp con của một lớp trừu tượng kế thừa <strong>mọi</strong> đặc điểm của nó, kể cả phương thức trừu tượng. Muốn thay một phương thức trừu tượng được kế thừa bằng bản cụ thể, lớp con chỉ cần ghi đè nó. Lớp trừu tượng <strong>không tạo đối tượng được</strong>.</p>
<p>"Kế thừa cả phương thức trừu tượng" giải thích một tầng ở giữa: lớp con có thể chỉ hiện thực một phần và vẫn là abstract, tầng kế tiếp làm nốt. Chương trình ở slide 20 cho thấy điều đó — <code>Polygon</code> chỉ hiện thực <code>perimeter()</code> nên phải là abstract; <code>Square</code> thêm <code>area()</code> và trở thành lớp cụ thể:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7ca929670bcd19e73bb8fc8b28e20276cb58ddc5.svg" alt="Slide 22: hai tầng trừu tượng, rồi một lớp cụ thể" loading="lazy" /><p class="chu-thich">🧩 Slide 22: hai tầng trừu tượng, rồi một lớp cụ thể</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 22 — a class stays abstract until every inherited abstract method has a body
' Polygon chỉ hiện thực perimeter() nên vẫn phải là abstract; Square thêm area() và trở thành cụ thể
abstract class Shape {
  ~ {abstract} area() : double
  ~ {abstract} perimeter() : double
  ~ describe() : String
}
abstract class Polygon {
  # sides : double[]
  ~ perimeter() : double
}
class Square {
  ~ Square(a : double)
  ~ area() : double
}
Shape &lt;|-- Polygon
Polygon &lt;|-- Square
@enduml</code></pre></details>
<p>Nhìn <code>Shape.describe()</code> trong chương trình đó: một phương thức <strong>cụ thể</strong> trong lớp trừu tượng <strong>gọi</strong> các phương thức trừu tượng. Nó chạy được vì đối tượng nào chạy nó cũng là một lớp con cụ thể có thân thật. Mẫu này có tên là <strong>template method</strong> (phương thức khuôn mẫu): lớp cha cố định các bước, lớp con điền chi tiết.</p>
<div class="callout">🧭 <strong>Đi tiếp — project Banking của trường</strong>: <code>textview/Menu.java</code> đúng là như vậy. <code>abstract class Menu</code> có vòng lặp cụ thể <code>run()</code> (hiện menu, đọc lựa chọn, lặp lại) gọi tới <code>public abstract void execute(int n)</code>; <code>BankApp extends Menu</code> điền việc mà mỗi lựa chọn làm. Bài 🧪 thực hành Chương 5 dựng lại menu này cho một chương trình kiểu LAB211 — và sửa một lỗi thật trong nó.</div>`],
      [23, 'Nested Class (optional)',
        `<p class="y-chinh">🎯 A <strong>nested class</strong> is a class declared inside another class. Why: to group a helper with the only class that uses it, to let it reach the outer class's private members, and to write shorter code. Types: local class, anonymous class, … — the slide points to the Oracle Java Tutorials for the rest.</p>
<p>➕ The "…" hides two more kinds. All four, in one program, with the class names the compiler gives them:</p>
<pre class="trich"><code class="language-java">static class Config {                         // 1. static nested: no hidden link to an outer object
    String version() { return "1.0"; }
}

class Engine {                                // 2. inner: every Engine belongs to one LopLong object
    String whose() { return "engine of " + owner; }   // can read the outer object's private field
}

Greeter makeGreeters(final String name) {
    class Polite implements Greeter {         // 3. local: declared inside a method
        public String greet() { return "Good morning, " + name; }
    }
    Greeter casual = new Greeter() {          // 4. anonymous: declared AND created in one expression
        public String greet() { return "Hi " + name; }
    };
    System.out.println(new Polite().greet() + "   [" + Polite.class.getName() + "]");
    System.out.println(casual.greet() + "   [" + casual.getClass().getName() + "]");
    return casual;
}</code></pre>
<pre class="trich"><code class="language-java">LopLong.Config c = new LopLong.Config();          // no outer object needed
System.out.println("Config " + c.version() + "   [" + c.getClass().getName() + "]");
LopLong outer = new LopLong();
LopLong.Engine e = outer.new Engine();            // inner needs an outer object: outer.new
System.out.println(e.whose() + "   [" + e.getClass().getName() + "]");
outer.makeGreeters("Cuong");</code></pre>
<div class="out">Config 1.0 &nbsp;&nbsp;[LopLong$Config]<br>
engine of LopLong object &nbsp;&nbsp;[LopLong$Engine]<br>
Good morning, Cuong &nbsp;&nbsp;[LopLong$1Polite]<br>
Hi Cuong &nbsp;&nbsp;[LopLong$1]</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/d8805d2c6960d56ace44cad7f13ec583af272a44.svg" alt="Slide 23: the four kinds of nested class and where each is declared" loading="lazy" /><p class="chu-thich">🧩 Slide 23: the four kinds of nested class and where each is declared</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 23 — four kinds of nested class\\n(circle-plus = "declared inside", not inheritance)
' The nesting symbol shows where a class is declared, not inheritance
class LopLong {
  - owner : String
  ~ makeGreeters(name : String) : Greeter
}
class "Config" as Config &lt;&lt;static nested&gt;&gt;
class "Engine" as Engine &lt;&lt;inner&gt;&gt;
class "Polite" as Polite &lt;&lt;local&gt;&gt;
class "LopLong$1" as Anon &lt;&lt;anonymous&gt;&gt;
interface Greeter {
  + greet() : String
}
LopLong +-- Config
LopLong +-- Engine
LopLong +-- Polite
LopLong +-- Anon
Polite ..|&gt; Greeter
Anon ..|&gt; Greeter
hide Config members
hide Engine members
hide Polite members
hide Anon members
note bottom of Config
  file: LopLong$Config.class
end note
note bottom of Engine
  file: LopLong$Engine.class
end note
@enduml</code></pre></details>
<table>
<thead><tr><th>Kind</th><th>Declared</th><th>Needs an outer object?</th><th>File name</th></tr></thead>
<tbody>
<tr><td>static nested</td><td>in the class, <code>static class Config</code></td><td>no: <code>new LopLong.Config()</code></td><td><code>LopLong$Config.class</code></td></tr>
<tr><td>inner</td><td>in the class, <code>class Engine</code></td><td>yes: <code>outer.new Engine()</code></td><td><code>LopLong$Engine.class</code></td></tr>
<tr><td>local</td><td>inside a method</td><td>runs inside the method</td><td><code>LopLong$1Polite.class</code></td></tr>
<tr><td>anonymous</td><td>inside an expression, no name</td><td>runs inside the method</td><td><code>LopLong$1.class</code></td></tr>
</tbody>
</table>
<p>The school's Banking project uses an inner class: <code>TransactionMenu</code> is declared inside <code>BankApp</code>, so its <code>execute</code> can call <code>doDeposit()</code> and read <code>curAcc</code> of the BankApp object that created it.</p>`,
        `<p class="y-chinh">🎯 <strong>Lớp lồng (nested class)</strong> là lớp khai báo bên trong một lớp khác. Để làm gì: gom một lớp phụ với lớp duy nhất dùng nó, cho nó chạm tới thành viên private của lớp ngoài, và viết code ngắn hơn. Các loại: lớp cục bộ (local), lớp ẩn danh (anonymous), … — slide trỏ sang Oracle Java Tutorials cho phần còn lại.</p>
<p>➕ Dấu "…" giấu thêm hai loại. Cả bốn loại, trong một chương trình, kèm tên lớp mà trình biên dịch đặt cho chúng:</p>
<pre class="trich"><code class="language-java">static class Config {                         // 1. lồng tĩnh: không có liên kết ngầm tới đối tượng bên ngoài
    String version() { return "1.0"; }
}

class Engine {                                // 2. lớp trong: mỗi Engine thuộc về một đối tượng LopLong
    String whose() { return "engine of " + owner; }   // đọc được trường private của đối tượng ngoài
}

Greeter makeGreeters(final String name) {
    class Polite implements Greeter {         // 3. cục bộ: khai báo trong một phương thức
        public String greet() { return "Good morning, " + name; }
    }
    Greeter casual = new Greeter() {          // 4. ẩn danh: khai báo VÀ tạo trong một biểu thức
        public String greet() { return "Hi " + name; }
    };
    System.out.println(new Polite().greet() + "   [" + Polite.class.getName() + "]");
    System.out.println(casual.greet() + "   [" + casual.getClass().getName() + "]");
    return casual;
}</code></pre>
<pre class="trich"><code class="language-java">LopLong.Config c = new LopLong.Config();          // không cần đối tượng ngoài
System.out.println("Config " + c.version() + "   [" + c.getClass().getName() + "]");
LopLong outer = new LopLong();
LopLong.Engine e = outer.new Engine();            // lớp trong cần đối tượng ngoài: outer.new
System.out.println(e.whose() + "   [" + e.getClass().getName() + "]");
outer.makeGreeters("Cuong");</code></pre>
<div class="out">Config 1.0 &nbsp;&nbsp;[LopLong$Config]<br>
engine of LopLong object &nbsp;&nbsp;[LopLong$Engine]<br>
Good morning, Cuong &nbsp;&nbsp;[LopLong$1Polite]<br>
Hi Cuong &nbsp;&nbsp;[LopLong$1]</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/d8805d2c6960d56ace44cad7f13ec583af272a44.svg" alt="Slide 23: bốn loại lớp lồng và chỗ khai báo của từng loại" loading="lazy" /><p class="chu-thich">🧩 Slide 23: bốn loại lớp lồng và chỗ khai báo của từng loại</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 23 — four kinds of nested class\\n(circle-plus = "declared inside", not inheritance)
' Ký hiệu lồng cho biết lớp được khai báo ở đâu, không phải kế thừa
class LopLong {
  - owner : String
  ~ makeGreeters(name : String) : Greeter
}
class "Config" as Config &lt;&lt;static nested&gt;&gt;
class "Engine" as Engine &lt;&lt;inner&gt;&gt;
class "Polite" as Polite &lt;&lt;local&gt;&gt;
class "LopLong$1" as Anon &lt;&lt;anonymous&gt;&gt;
interface Greeter {
  + greet() : String
}
LopLong +-- Config
LopLong +-- Engine
LopLong +-- Polite
LopLong +-- Anon
Polite ..|&gt; Greeter
Anon ..|&gt; Greeter
hide Config members
hide Engine members
hide Polite members
hide Anon members
note bottom of Config
  file: LopLong$Config.class
end note
note bottom of Engine
  file: LopLong$Engine.class
end note
@enduml</code></pre></details>
<table>
<thead><tr><th>Loại</th><th>Khai báo ở đâu</th><th>Cần đối tượng ngoài?</th><th>Tên file</th></tr></thead>
<tbody>
<tr><td>lồng tĩnh (static nested)</td><td>trong lớp, <code>static class Config</code></td><td>không: <code>new LopLong.Config()</code></td><td><code>LopLong$Config.class</code></td></tr>
<tr><td>lớp trong (inner)</td><td>trong lớp, <code>class Engine</code></td><td>có: <code>outer.new Engine()</code></td><td><code>LopLong$Engine.class</code></td></tr>
<tr><td>cục bộ (local)</td><td>trong một phương thức</td><td>sống trong phương thức đó</td><td><code>LopLong$1Polite.class</code></td></tr>
<tr><td>ẩn danh (anonymous)</td><td>trong một biểu thức, không có tên</td><td>sống trong phương thức đó</td><td><code>LopLong$1.class</code></td></tr>
</tbody>
</table>
<p>Project Banking của trường dùng lớp trong: <code>TransactionMenu</code> khai báo bên trong <code>BankApp</code>, nên <code>execute</code> của nó gọi được <code>doDeposit()</code> và đọc được <code>curAcc</code> của chính đối tượng BankApp đã tạo ra nó.</p>`],
      [24, 'Anonymous Classes',
        `<p class="y-chinh">🎯 <strong>Anonymous classes</strong> have no name — the compiler names them. They appear where an object of an interface or abstract class is created and the missing methods are written right there. They make code concise, declare and instantiate a class at the same time, are like local classes without a name, and are meant for a class used <strong>only once</strong>.</p>
<p>Correction: the parent of an anonymous class does not have to be an interface or an abstract class — <code>new Thread() { public void run() { … } }</code> extends an ordinary class. And since Java 8, when the interface has exactly <strong>one</strong> abstract method, a <strong>lambda</strong> says the same thing in one line. One Comparator, three ways:</p>
<pre class="trich"><code class="language-java">class ByLength implements Comparator&lt;String&gt; {        // 1. a named class, used once
    @Override
    public int compare(String a, String b) { return a.length() - b.length(); }
}</code></pre>
<pre class="trich"><code class="language-java">Collections.sort(names, new ByLength());
System.out.println("named class : " + names);

Collections.sort(names, new Comparator&lt;String&gt;() {   // 2. anonymous: no separate class name
    @Override
    public int compare(String a, String b) { return b.compareTo(a); }   // Z..A
});
System.out.println("anonymous   : " + names);

Collections.sort(names, (a, b) -&gt; a.compareTo(b));  // 3. lambda: only for an interface with ONE abstract method
System.out.println("lambda      : " + names);</code></pre>
<div class="out">named class : [An, Hoa, Binh, Dung, Cuong]<br>
anonymous &nbsp;&nbsp;: [Hoa, Dung, Cuong, Binh, An]<br>
lambda &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [An, Binh, Cuong, Dung, Hoa]</div>
<p>All three are legal on JDK 8 — lambdas are a Java 8 feature, so you may use them in the PE (sorting a list in PE3's "sort" command is the typical place). Anonymous classes are still needed when the parent has several abstract methods, like slide 25's <code>Interface1</code>.</p>
<div class="pitfall">FE trap: an anonymous class (or lambda) may read a local variable of the enclosing method only if that variable is never changed — "effectively final" (Java 8). Assigning to it inside or after the class is a compile error.</div>`,
        `<p class="y-chinh">🎯 <strong>Lớp ẩn danh (anonymous class)</strong> không có tên — trình biên dịch đặt tên cho nó. Nó xuất hiện ở chỗ tạo một đối tượng từ interface hoặc lớp trừu tượng, và các phương thức còn thiếu được viết ngay tại đó. Nó làm code gọn, khai báo và tạo đối tượng cùng một lúc, giống lớp cục bộ nhưng không có tên, và dành cho lớp chỉ dùng <strong>một lần</strong>.</p>
<p>Đính chính: cha của lớp ẩn danh không nhất thiết là interface hay lớp trừu tượng — <code>new Thread() { public void run() { … } }</code> kế thừa một lớp bình thường. Và từ Java 8, khi interface có đúng <strong>một</strong> phương thức trừu tượng, một <strong>lambda</strong> nói cùng điều đó trong một dòng. Một Comparator, ba cách viết:</p>
<pre class="trich"><code class="language-java">class ByLength implements Comparator&lt;String&gt; {        // 1. một lớp có tên, chỉ dùng một lần
    @Override
    public int compare(String a, String b) { return a.length() - b.length(); }
}</code></pre>
<pre class="trich"><code class="language-java">Collections.sort(names, new ByLength());
System.out.println("named class : " + names);

Collections.sort(names, new Comparator&lt;String&gt;() {   // 2. ẩn danh: không cần tên lớp riêng
    @Override
    public int compare(String a, String b) { return b.compareTo(a); }   // Z..A
});
System.out.println("anonymous   : " + names);

Collections.sort(names, (a, b) -&gt; a.compareTo(b));  // 3. lambda: chỉ cho interface có MỘT phương thức trừu tượng
System.out.println("lambda      : " + names);</code></pre>
<div class="out">named class : [An, Hoa, Binh, Dung, Cuong]<br>
anonymous &nbsp;&nbsp;: [Hoa, Dung, Cuong, Binh, An]<br>
lambda &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [An, Binh, Cuong, Dung, Hoa]</div>
<p>Cả ba đều hợp lệ trên JDK 8 — lambda là tính năng của Java 8, nên dùng được trong PE (sắp xếp danh sách ở lệnh "sort" của PE3 là chỗ điển hình). Lớp ẩn danh vẫn cần khi cha có nhiều phương thức trừu tượng, như <code>Interface1</code> ở slide 25.</p>
<div class="pitfall">Bẫy FE: lớp ẩn danh (hay lambda) chỉ được đọc biến cục bộ của phương thức bao ngoài nếu biến đó không bao giờ bị đổi — "effectively final" (thực chất là final, Java 8). Gán lại nó bên trong hay sau lớp đó là lỗi biên dịch.</div>`],
      [25, 'Anonymous Class',
        `<p class="y-chinh">🎯 The slide's example: <code>Interface1</code> declares <code>M1()</code> and <code>M2()</code>; inside <code>Anonymous1.main</code>, <code>new Interface1() { … };</code> implements both on the spot. The class name is given by the compiler: <strong>ContainerClass$Number</strong> — here <code>Anonymous1$1.class</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 25: the school's anonymous class — Interface1 is implemented "on the spot", and the compiler names the class Anonymous1$1

// New - Java Interface
interface Interface1 {
    void M1();
    void M2();
}
public class Anonymous1 {
    public static void main(String[] args) {
        Interface1 obj = new Interface1() {
            public void M1()
            { System.out.println("M1");}
            public void M2()
            { System.out.println("M2");}
        };
        obj.M1();
        obj.M2();
    }
}</code></pre>
<div class="out">M1<br>
M2</div>
<p>Note the <code>};</code> at the end: the braces close the class body, the semicolon ends the assignment statement — forgetting it is the most common syntax error with anonymous classes. The slide's file list (build\\classes) shows three files; here is the same check on JDK 8 with every kind of nested class in one source file:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Anonymous1.java",
        "interface Interface1 { void M1(); void M2(); }\\n" +
        "class Anonymous1 {\\n" +
        "    static class Helper { }\\n" +
        "    class Inner { }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        class Local { }\\n" +
        "        Interface1 obj = new Interface1() {\\n" +
        "            public void M1() { System.out.println(\\"M1\\"); }\\n" +
        "            public void M2() { System.out.println(\\"M2\\"); }\\n" +
        "        };\\n" +
        "        Interface1 obj2 = new Interface1() {\\n" +
        "            public void M1() { }\\n" +
        "            public void M2() { }\\n" +
        "        };\\n" +
        "        obj.M1();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Anonymous1.java");
    System.out.println("&gt; dir *.class");
    String[] files = d.list();
    Arrays.sort(files);
    for (String f : files) if (f.endsWith(".class")) System.out.println(f);
}</code></pre>
<div class="out">&gt; javac Anonymous1.java<br>
&gt; dir *.class<br>
Anonymous1$1.class<br>
Anonymous1$1Local.class<br>
Anonymous1$2.class<br>
Anonymous1$Helper.class<br>
Anonymous1$Inner.class<br>
Anonymous1.class<br>
Interface1.class</div>
<p>Anonymous classes are numbered in order of appearance (<code>$1</code>, <code>$2</code>); local classes get a number <em>and</em> their name (<code>$1Local</code>); member classes just their name. When you submit a PE jar, all these files must be inside it — NetBeans' Clean and Build does that for you.</p>`,
        `<p class="y-chinh">🎯 Ví dụ trên slide: <code>Interface1</code> khai báo <code>M1()</code> và <code>M2()</code>; bên trong <code>Anonymous1.main</code>, <code>new Interface1() { … };</code> hiện thực cả hai tại chỗ. Tên lớp do trình biên dịch đặt: <strong>LớpChứa$Số</strong> — ở đây là <code>Anonymous1$1.class</code>.</p>
<pre><code class="language-java">// release: 8
// Slide 25: lớp ẩn danh của trường — Interface1 được hiện thực "tại chỗ", và trình biên dịch đặt tên lớp là Anonymous1$1

// New - Java Interface
interface Interface1 {
    void M1();
    void M2();
}
public class Anonymous1 {
    public static void main(String[] args) {
        Interface1 obj = new Interface1() {
            public void M1()
            { System.out.println("M1");}
            public void M2()
            { System.out.println("M2");}
        };
        obj.M1();
        obj.M2();
    }
}</code></pre>
<div class="out">M1<br>
M2</div>
<p>Để ý <code>};</code> ở cuối: cặp ngoặc nhọn đóng thân lớp, dấu chấm phẩy kết thúc câu lệnh gán — quên nó là lỗi cú pháp hay gặp nhất với lớp ẩn danh. Danh sách file trên slide (build\\classes) có ba file; đây là cùng phép kiểm đó trên JDK 8 với đủ mọi loại lớp lồng trong một file nguồn:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Anonymous1.java",
        "interface Interface1 { void M1(); void M2(); }\\n" +
        "class Anonymous1 {\\n" +
        "    static class Helper { }\\n" +
        "    class Inner { }\\n" +
        "    public static void main(String[] args) {\\n" +
        "        class Local { }\\n" +
        "        Interface1 obj = new Interface1() {\\n" +
        "            public void M1() { System.out.println(\\"M1\\"); }\\n" +
        "            public void M2() { System.out.println(\\"M2\\"); }\\n" +
        "        };\\n" +
        "        Interface1 obj2 = new Interface1() {\\n" +
        "            public void M1() { }\\n" +
        "            public void M2() { }\\n" +
        "        };\\n" +
        "        obj.M1();\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Anonymous1.java");
    System.out.println("&gt; dir *.class");
    String[] files = d.list();
    Arrays.sort(files);
    for (String f : files) if (f.endsWith(".class")) System.out.println(f);
}</code></pre>
<div class="out">&gt; javac Anonymous1.java<br>
&gt; dir *.class<br>
Anonymous1$1.class<br>
Anonymous1$1Local.class<br>
Anonymous1$2.class<br>
Anonymous1$Helper.class<br>
Anonymous1$Inner.class<br>
Anonymous1.class<br>
Interface1.class</div>
<p>Lớp ẩn danh được đánh số theo thứ tự xuất hiện (<code>$1</code>, <code>$2</code>); lớp cục bộ có số <em>và</em> tên (<code>$1Local</code>); lớp thành viên chỉ có tên. Khi nộp file jar PE, mọi file này phải nằm trong đó — Clean and Build của NetBeans làm việc đó giúp bạn.</p>`],
      [26, 'Anonymous Class…',
        `<p class="y-chinh">🎯 <code>MyAdapter</code> is an abstract class with only concrete methods. An anonymous subclass overrides just <code>M1()</code>; <code>obj.M2()</code> runs the inherited body. The technique is common when only some methods need overriding, especially in event programming.</p>
<pre class="trich"><code class="language-java">// abstract class contains all concrete methods
abstract class MyAdapter {
    public void M1() { System.out.println("M1");}
    public void M2() { System.out.println("M2");}
}</code></pre>
<pre class="trich"><code class="language-java">// Overriding one method
MyAdapter obj = new MyAdapter()
{   public void M1()
    {   System.out.println("M1 overridden");
    }
};
obj.M2();
obj.M1();</code></pre>
<pre class="trich"><code class="language-java">System.out.println("-- zero methods overridden --");
MyAdapter plain = new MyAdapter() { };   // an anonymous subclass with an EMPTY body
plain.M1();
plain.M2();</code></pre>
<div class="out">M2<br>
M1 overridden<br>
-- zero methods overridden --<br>
M1<br>
M2</div>
<p>The first two lines are the slide's. The blue box claims "the abstract class can be used <strong>only when at least one</strong> of its methods is overridden" — the last three lines refute it: <code>new MyAdapter() { }</code> with an <strong>empty</strong> body compiles and runs. What an abstract class needs is a subclass, any subclass; the empty anonymous body is one. Likewise the red box's "concrete methods … can not be used because the class is abstract" really means "cannot be used <em>without a subclass object</em>".</p>
<p>➕ "Event programming": in Swing, <code>WindowListener</code> has seven methods; <code>WindowAdapter</code> is an abstract class implementing all seven with empty bodies, so you write <code>new WindowAdapter() { public void windowClosing(WindowEvent e) { … } }</code> and override just the one you need. The school's Banking GUI (<code>view/BankGUI.java</code>) wires every menu item and button with an anonymous <code>ActionListener</code> generated by NetBeans.</p>`,
        `<p class="y-chinh">🎯 <code>MyAdapter</code> là lớp trừu tượng chỉ có phương thức cụ thể. Một lớp con ẩn danh chỉ ghi đè <code>M1()</code>; <code>obj.M2()</code> chạy thân được kế thừa. Kỹ thuật này hay dùng khi chỉ cần ghi đè vài phương thức, nhất là trong lập trình sự kiện.</p>
<pre class="trich"><code class="language-java">// abstract class contains all concrete methods
abstract class MyAdapter {
    public void M1() { System.out.println("M1");}
    public void M2() { System.out.println("M2");}
}</code></pre>
<pre class="trich"><code class="language-java">// Overriding one method
MyAdapter obj = new MyAdapter()
{   public void M1()
    {   System.out.println("M1 overridden");
    }
};
obj.M2();
obj.M1();</code></pre>
<pre class="trich"><code class="language-java">System.out.println("-- zero methods overridden --");
MyAdapter plain = new MyAdapter() { };   // một lớp con ẩn danh có thân RỖNG
plain.M1();
plain.M2();</code></pre>
<div class="out">M2<br>
M1 overridden<br>
-- zero methods overridden --<br>
M1<br>
M2</div>
<p>Hai dòng đầu là của slide. Ô màu xanh khẳng định "lớp trừu tượng <strong>chỉ dùng được khi ít nhất một</strong> phương thức của nó bị ghi đè" — ba dòng cuối bác bỏ điều đó: <code>new MyAdapter() { }</code> với thân <strong>rỗng</strong> vẫn biên dịch và chạy. Thứ lớp trừu tượng cần là một lớp con, lớp con nào cũng được; thân ẩn danh rỗng cũng là một lớp con. Tương tự, câu trong ô đỏ "phương thức cụ thể … không dùng được vì lớp là abstract" thật ra nghĩa là "không dùng được <em>nếu không có đối tượng của lớp con</em>".</p>
<p>➕ "Lập trình sự kiện": trong Swing, <code>WindowListener</code> có bảy phương thức; <code>WindowAdapter</code> là lớp trừu tượng hiện thực cả bảy bằng thân rỗng, nên bạn viết <code>new WindowAdapter() { public void windowClosing(WindowEvent e) { … } }</code> và chỉ ghi đè đúng cái mình cần. Giao diện của project Banking (<code>view/BankGUI.java</code>) nối mọi mục menu và nút bấm bằng một <code>ActionListener</code> ẩn danh do NetBeans sinh ra.</p>`],
      [27, 'Summary',
        `<p class="y-chinh">🎯 Polymorphism is an OO concept: the ability of an object to take on many forms. Overloading and overriding are the techniques that implement it, and in OOP it happens when a <strong>parent class or interface reference</strong> is used to refer to a <strong>child class object</strong>.</p>
<table>
<thead><tr><th>Form</th><th>Code</th><th>Who decides</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>overloading</td><td><code>show(int)</code>, <code>show(Object)</code></td><td>compiler, static types</td><td>4.B slides 5–6</td></tr>
<tr><td>overriding through a parent reference</td><td><code>Father obj = new Son(); obj.m2();</code></td><td>JVM, object's class</td><td>4.B slides 7–11</td></tr>
<tr><td>overriding through an interface reference</td><td><code>VNRemote r = new Television(); r.onDevice();</code></td><td>JVM, object's class</td><td>5.A slides 14–17</td></tr>
<tr><td>forced overriding</td><td>abstract method in an abstract class</td><td>compiler refuses incomplete subclasses</td><td>5.A slides 18–22</td></tr>
<tr><td>one-off implementation</td><td>anonymous class, Java 8 lambda</td><td>—</td><td>5.A slides 23–26</td></tr>
</tbody>
</table>
<p>The last bullet is the one to keep: write variables and parameters with the <strong>most general type that is enough</strong> — <code>Item</code>, <code>Shape</code>, <code>VNRemote</code>, <code>List</code> — and let each object answer in its own way. Next: the 🧪 practice of Chapter 5 (a full 10-mark PE paper with an interface, an abstract class and two classes), then the quiz.</p>`,
        `<p class="y-chinh">🎯 Đa hình là một khái niệm hướng đối tượng: khả năng một đối tượng mang nhiều hình dạng. Nạp chồng và ghi đè là các kỹ thuật hiện thực nó, và trong OOP nó xảy ra khi một <strong>tham chiếu kiểu lớp cha hoặc interface</strong> được dùng để trỏ tới một <strong>đối tượng lớp con</strong>.</p>
<table>
<thead><tr><th>Dạng</th><th>Code</th><th>Ai quyết định</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>nạp chồng</td><td><code>show(int)</code>, <code>show(Object)</code></td><td>trình biên dịch, kiểu tĩnh</td><td>4.B slide 5–6</td></tr>
<tr><td>ghi đè qua tham chiếu kiểu cha</td><td><code>Father obj = new Son(); obj.m2();</code></td><td>JVM, lớp của đối tượng</td><td>4.B slide 7–11</td></tr>
<tr><td>ghi đè qua tham chiếu kiểu interface</td><td><code>VNRemote r = new Television(); r.onDevice();</code></td><td>JVM, lớp của đối tượng</td><td>5.A slide 14–17</td></tr>
<tr><td>buộc phải ghi đè</td><td>phương thức abstract trong lớp abstract</td><td>trình biên dịch từ chối lớp con chưa đủ</td><td>5.A slide 18–22</td></tr>
<tr><td>cài đặt dùng một lần</td><td>lớp ẩn danh, lambda Java 8</td><td>—</td><td>5.A slide 23–26</td></tr>
</tbody>
</table>
<p>Gạch đầu dòng cuối là điều cần giữ: khai báo biến và tham số bằng <strong>kiểu tổng quát nhất mà vẫn đủ dùng</strong> — <code>Item</code>, <code>Shape</code>, <code>VNRemote</code>, <code>List</code> — và để mỗi đối tượng tự trả lời theo cách riêng. Tiếp theo: bài 🧪 thực hành Chương 5 (trọn một đề PE 10 điểm với interface, lớp trừu tượng và hai lớp), rồi quiz.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>An interface declares <code>int MAX = 5;</code>. Which is true: each implementing object has its own MAX; MAX can be changed with a setter; MAX is <code>public static final</code>?</li>
<li>A class <code>implements Comparable&lt;Student&gt;</code> but has no <code>compareTo</code>. What does javac say, and what are the two ways to make it compile?</li>
<li>Rewrite slide 25's anonymous class as a lambda. Why is that impossible for <code>Interface1</code> but possible for <code>Comparator</code>?</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Một interface khai báo <code>int MAX = 5;</code>. Câu nào đúng: mỗi đối tượng hiện thực có MAX riêng; MAX đổi được bằng setter; MAX là <code>public static final</code>?</li>
<li>Một lớp <code>implements Comparable&lt;Student&gt;</code> nhưng không có <code>compareTo</code>. javac báo gì, và có hai cách nào để biên dịch được?</li>
<li>Viết lại lớp ẩn danh ở slide 25 bằng lambda. Vì sao không làm được với <code>Interface1</code> nhưng làm được với <code>Comparator</code>?</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 5.1.9 "Abstract Classes", Ch. 6.1 "Interfaces" (static and default methods, resolving default conflicts), 6.3 "Inner Classes" (local, anonymous, static)', 'Chương 5.1.9 "Abstract Classes", Chương 6.1 "Interfaces" (phương thức static và default, giải xung đột default), 6.3 "Inner Classes" (cục bộ, ẩn danh, static)'],
      ['fuOffline', 'part "Polymorphism" — Abstract Class (displayPrice), Interfaces (Menu/Chef, VIPMenu)', 'phần "Polymorphism" — Abstract Class (displayPrice), Interfaces (Menu/Chef, VIPMenu)'],
      ['javaTutorial', '"Interfaces and Inheritance", "Default Methods", "Abstract Methods and Classes", "Nested Classes", "Anonymous Classes", "Lambda Expressions"', '"Interfaces and Inheritance", "Default Methods", "Abstract Methods and Classes", "Nested Classes", "Anonymous Classes", "Lambda Expressions"'],
      ['jls8', '§9 Interfaces (§9.3 fields are implicitly public static final, §9.4 methods), §8.1.1.1 abstract Classes, §15.9.5 Anonymous Class Declarations', '§9 Interfaces (§9.3 trường ngầm public static final, §9.4 phương thức), §8.1.1.1 lớp abstract, §15.9.5 khai báo lớp ẩn danh'],
    ]),
  ].join('\n'),
};

/* ───────── 5.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Interfaces and abstract classes the PE way: a 10-mark paper, Q4, menus ───────── */
const L_on_ch5 = {
  title: '5.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Interfaces and abstract classes the PE way: a 10-mark paper, Q4, menus|||5.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Interface, lớp trừu tượng kiểu PE: đề 10 điểm, câu 4, menu',
  slug: 'pro192-on-ch5',
  type: 'VIDEO',
  description: '7 bài tập Chương 5 có lời giải chạy thật trên JDK 8 và sơ đồ lớp cho từng bài: trọn một đề PE 10 điểm (1 interface, 1 lớp trừu tượng, 2 lớp con, lớp Q1 xử lý các lệnh add/print/search/level/sort/total/clear), câu 4 PE hiện thực interface cho sẵn (đếm từ độ dài chẵn, viết hoa chữ đầu), lớp Menu trừu tượng của project Banking của trường dựng lại thành template method — kèm đo thật lỗi tạo Scanner mới mỗi lần gọi, sắp xếp bằng Comparable, Comparator ẩn danh và lambda Java 8, sáu câu đoán output, sáu lỗi biên dịch thật cần gọi tên luật, và bài thiết kế chọn interface hay lớp trừu tượng; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.2 · Practice &amp; review</span>
<h2>Interfaces and abstract classes — where the 10-mark PE papers are</h2>
<p class="lead">Lesson 5.A walked the second half of deck "Polymorphism". Now the exam shapes. Since 2025 several PRO192 PE papers are a single 10-mark question that opens with "Create 1 Interface, 1 Abstract Class and 2 classes" and ends with a <code>Q1</code> class that executes commands (Exam Room <strong>PE3</strong>, <strong>PE5</strong>); the classic 4-question papers still close with question 4, "implement the given interface". Both are below, solved and run on JDK 8, with the class diagram the paper would give you. The other five exercises cover the school's own abstract <code>Menu</code>, sorting with interfaces you did not write, and the FE's favourite traps.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Exam link</th></tr></thead>
<tbody>
<tr><td>1</td><td>interface + abstract class + 2 subclasses + a command-driven Q1</td><td>PE3, PE5 (10 marks)</td></tr>
<tr><td>2</td><td>implement a given interface: string processing</td><td>PE question 4 (PE2, PE4, PE10–PE14)</td></tr>
<tr><td>3</td><td>the Banking project's abstract Menu: a real bug and the fix</td><td>LAB211 menus</td></tr>
<tr><td>4</td><td>Comparable, Comparator as anonymous class and as lambda</td><td>PE "sort" commands, Chapter 8</td></tr>
<tr><td>5</td><td>predict six outputs on interfaces and anonymous classes</td><td>FE "what is printed?"</td></tr>
<tr><td>6</td><td>name the rule behind six real compile errors</td><td>FE "which line fails?"</td></tr>
<tr><td>7</td><td>interface or abstract class? a payroll that also pays invoices</td><td>design, interviews</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.2 · Thực hành &amp; ôn tập</span>
<h2>Interface và lớp trừu tượng — nơi có các đề PE 10 điểm</h2>
<p class="lead">Bài 5.A đã đi hết nửa sau bộ "Polymorphism". Giờ là các dạng đề. Từ 2025 nhiều đề PE PRO192 chỉ có một câu 10 điểm mở đầu bằng "Create 1 Interface, 1 Abstract Class and 2 classes" và kết thúc bằng lớp <code>Q1</code> thực thi các lệnh (Exam Room <strong>PE3</strong>, <strong>PE5</strong>); đề 4 câu kiểu cũ vẫn khép lại bằng câu 4 "hiện thực interface cho sẵn". Cả hai có ở dưới đây, đã giải và chạy trên JDK 8, kèm sơ đồ lớp mà đề sẽ đưa cho bạn. Năm bài còn lại xoay quanh <code>Menu</code> trừu tượng của chính trường, việc sắp xếp bằng các interface bạn không tự viết, và các bẫy FE ưa thích.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Liên hệ đề thi</th></tr></thead>
<tbody>
<tr><td>1</td><td>interface + lớp trừu tượng + 2 lớp con + Q1 chạy theo lệnh</td><td>PE3, PE5 (10 điểm)</td></tr>
<tr><td>2</td><td>hiện thực interface cho sẵn: xử lý chuỗi</td><td>câu 4 PE (PE2, PE4, PE10–PE14)</td></tr>
<tr><td>3</td><td>Menu trừu tượng của project Banking: một lỗi thật và cách sửa</td><td>menu LAB211</td></tr>
<tr><td>4</td><td>Comparable, Comparator dạng lớp ẩn danh và dạng lambda</td><td>lệnh "sort" trong PE, Chương 8</td></tr>
<tr><td>5</td><td>đoán sáu output về interface và lớp ẩn danh</td><td>FE "in ra gì?"</td></tr>
<tr><td>6</td><td>gọi tên luật đứng sau sáu lỗi biên dịch thật</td><td>FE "dòng nào lỗi?"</td></tr>
<tr><td>7</td><td>interface hay lớp trừu tượng? bảng lương trả cả hoá đơn</td><td>thiết kế, phỏng vấn</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — A 10-mark PE paper: IEmployee, Staff, FullTime, PartTime, Q1 (~60 min)</h3>
<p>(10 marks, PE3/PE5 style) Create 1 interface, 1 abstract class and 2 classes as in the diagram, then the class <code>Q1</code>:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6dd78ab8a49e4fc6e07805b271f9f89f9b3a88a7.svg" alt="Exercise 1: the class diagram — Staff, getSalary() and addData() in italics are abstract" loading="lazy" /><p class="chu-thich">🧩 Exercise 1: the class diagram — Staff, getSalary() and addData() in italics are abstract</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — 1 interface, 1 abstract class, 2 classes and the Q1 driver
' Same shape as PE3 (ISmartDevice, Device, SmartPhone) and PE5 (Task, WorkTask, PersonalTask)
interface IEmployee {
  + getSalaryInfo() : String
  + checkLevel() : String
}
abstract class Staff {
  - id : String
  - name : String
  + Staff()
  + Staff(id : String, name : String)
  + getId() : String
  + getName() : String
  + setId(id : String) : void
  + setName(name : String) : void
  + {abstract} getSalary() : double
  + {abstract} addData() : String
}
class FullTime {
  - baseSalary : double
  - bonus : double
  + FullTime(id, name, baseSalary, bonus)
  + getSalary() : double
  + addData() : String
  + getSalaryInfo() : String
  + checkLevel() : String
}
class PartTime {
  - hours : int
  - rate : double
  + PartTime(id, name, hours, rate)
  + getSalary() : double
  + addData() : String
  + getSalaryInfo() : String
  + checkLevel() : String
}
class PeQ1Staff {
  ~ list : ArrayList&lt;Staff&gt;
  + read() : void
  + solve() : void
  + printResult() : void
}
Staff &lt;|-- FullTime
Staff &lt;|-- PartTime
IEmployee &lt;|.. FullTime
IEmployee &lt;|.. PartTime
PeQ1Staff o-- "0..*" Staff
@enduml</code></pre></details>
<ul>
<li><code>FullTime.getSalary()</code> = baseSalary + bonus; <code>PartTime.getSalary()</code> = hours × rate.</li>
<li><code>getSalaryInfo()</code> returns <code>FullTime(id,name,salary)</code> or <code>PartTime(id,name,salary)</code>, salary with one decimal; <code>addData()</code> returns that string + " is added".</li>
<li><code>checkLevel()</code>: FullTime is "Senior" when salary ≥ 15000; PartTime when hours ≥ 100; otherwise "Junior".</li>
<li><code>Q1</code> reads T, then T commands: <code>add-full,id,name,base,bonus</code> · <code>add-part,id,name,hours,rate</code> · <code>print</code> (header <code>---Print---</code>, or "Empty") · <code>search,id</code> (<code>---Search Result---</code>, or "Not found") · <code>level,id</code> (<code>---Level---</code>, "id is Senior/Junior") · <code>sort</code> (<code>---Sort---</code>, salary descending, then id) · <code>total</code> ("Total salary: x") · <code>clear</code> ("* Remove all Staff").</li>
</ul>
<details><summary>Solution (run for real on JDK 8, with the input below)</summary>
<pre class="trich"><code class="language-java">interface IEmployee {
    String getSalaryInfo();
    String checkLevel();
}</code></pre>
<pre class="trich"><code class="language-java">abstract class Staff {
    private String id;
    private String name;

    public Staff() {
    }

    public Staff(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }

    public abstract double getSalary();      // {abstract} in the diagram
    public abstract String addData();
}</code></pre>
<pre class="trich"><code class="language-java">class FullTime extends Staff implements IEmployee {
    private double baseSalary;
    private double bonus;

    public FullTime() {
    }

    public FullTime(String id, String name, double baseSalary, double bonus) {
        super(id, name);
        this.baseSalary = baseSalary;
        this.bonus = bonus;
    }

    @Override
    public double getSalary() { return baseSalary + bonus; }

    @Override
    public String getSalaryInfo() {
        return String.format("FullTime(%s,%s,%.1f)", getId(), getName(), getSalary());
    }

    @Override
    public String addData() { return getSalaryInfo() + " is added"; }

    @Override
    public String checkLevel() { return getSalary() &gt;= 15000 ? "Senior" : "Junior"; }
}</code></pre>
<pre class="trich"><code class="language-java">class PartTime extends Staff implements IEmployee {
    private int hours;
    private double rate;

    public PartTime() {
    }

    public PartTime(String id, String name, int hours, double rate) {
        super(id, name);
        this.hours = hours;
        this.rate = rate;
    }

    @Override
    public double getSalary() { return hours * rate; }

    @Override
    public String getSalaryInfo() {
        return String.format("PartTime(%s,%s,%.1f)", getId(), getName(), getSalary());
    }

    @Override
    public String addData() { return getSalaryInfo() + " is added"; }

    @Override
    public String checkLevel() { return hours &gt;= 100 ? "Senior" : "Junior"; }
}</code></pre>
<pre class="trich"><code class="language-java">//--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
int n;
String[] lines;
StringBuilder result = new StringBuilder();
ArrayList&lt;Staff&gt; list = new ArrayList&lt;&gt;();

// in the real paper this part is FIXED and reads input.txt; here it reads the keyboard
public void read() {
    Scanner sc = new Scanner(System.in);
    //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
    n = Integer.parseInt(sc.nextLine().trim());
    lines = new String[n];
    for (int i = 0; i &lt; n; i++) lines[i] = sc.nextLine().trim();
}

//ALGORITHM - @STUDENT: ADD YOUR OWN METHODS HERE (IF NEED):
private Staff find(String id) {
    for (Staff s : list) if (s.getId().equalsIgnoreCase(id)) return s;
    return null;
}

private void out(String s) { result.append(s).append("\\n"); }

public void solve() {
    //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
    for (int i = 0; i &lt; n; i++) {
        String[] p = lines[i].split(",");
        String cmd = p[0].trim();
        if (cmd.equals("add-full")) {
            Staff s = new FullTime(p[1], p[2], Double.parseDouble(p[3]), Double.parseDouble(p[4]));
            list.add(s);
            out(s.addData());
        } else if (cmd.equals("add-part")) {
            Staff s = new PartTime(p[1], p[2], Integer.parseInt(p[3]), Double.parseDouble(p[4]));
            list.add(s);
            out(s.addData());
        } else if (cmd.equals("print")) {
            out("---Print---");
            if (list.isEmpty()) out("Empty");
            for (Staff s : list) out(((IEmployee) s).getSalaryInfo());   // every Staff here also implements IEmployee
        } else if (cmd.equals("search")) {
            out("---Search Result---");
            Staff s = find(p[1]);
            out(s == null ? "Not found" : ((IEmployee) s).getSalaryInfo());
        } else if (cmd.equals("level")) {
            out("---Level---");
            Staff s = find(p[1]);
            out(s == null ? "Not found" : s.getId() + " is " + ((IEmployee) s).checkLevel());
        } else if (cmd.equals("sort")) {
            out("---Sort---");
            if (list.isEmpty()) out("Empty");
            Collections.sort(list, new Comparator&lt;Staff&gt;() {               // salary descending, then id
                @Override
                public int compare(Staff a, Staff b) {
                    int c = Double.compare(b.getSalary(), a.getSalary());
                    return c != 0 ? c : a.getId().compareTo(b.getId());
                }
            });
            for (Staff s : list) out(((IEmployee) s).getSalaryInfo());
        } else if (cmd.equals("total")) {
            double sum = 0;
            for (Staff s : list) sum += s.getSalary();
            out(String.format("Total salary: %.1f", sum));
        } else if (cmd.equals("clear")) {
            list.clear();
            out("* Remove all Staff");
        }
    }
}

// in the real paper: FIXED, writes output.txt
public void printResult() {
    System.out.print(result);
}

public static void main(String[] args) {
    PeQ1Staff q = new PeQ1Staff();
    q.read();
    q.solve();
    q.printResult();
}</code></pre>
<p>Input (in the real paper this is <code>input.txt</code>):</p>
<pre><code class="language-plaintext">12
add-full,E02,Hoa,9000,1000
add-part,P01,Minh,120,95
add-full,E01,Lan,12000,3500
print
search,P01
search,X99
level,E01
level,E02
sort
total
clear
print</code></pre>
<div class="out">FullTime(E02,Hoa,10000.0) is added<br>
PartTime(P01,Minh,11400.0) is added<br>
FullTime(E01,Lan,15500.0) is added<br>
---Print---<br>
FullTime(E02,Hoa,10000.0)<br>
PartTime(P01,Minh,11400.0)<br>
FullTime(E01,Lan,15500.0)<br>
---Search Result---<br>
PartTime(P01,Minh,11400.0)<br>
---Search Result---<br>
Not found<br>
---Level---<br>
E01 is Senior<br>
---Level---<br>
E02 is Junior<br>
---Sort---<br>
FullTime(E01,Lan,15500.0)<br>
PartTime(P01,Minh,11400.0)<br>
FullTime(E02,Hoa,10000.0)<br>
Total salary: 36900.0<br>
* Remove all Staff<br>
---Print---<br>
Empty</div>
<p>How the pieces map to the paper: the skeleton's FIXED parts (<code>read()</code>'s try block, <code>printResult()</code>, <code>main</code>) open <code>input.txt</code>/<code>output.txt</code> in the real exam — you never touch them; everything after <code>@STUDENT</code> is what you write, and it is identical here. <code>list</code> is an <code>ArrayList&lt;Staff&gt;</code>, so <code>getSalary()</code> needs no cast. <code>getSalaryInfo()</code> belongs to <code>IEmployee</code>, which Staff does not implement, hence <code>((IEmployee) s)</code> — safe, because both concrete classes implement it. If the diagram allowed it, <code>abstract class Staff implements IEmployee</code> (leaving the two methods abstract) would remove every cast.</p>
</details>
<div class="pitfall">Where 10-mark papers are lost: (1) one missing <code>@Override</code> body of an <code>{abstract}</code> method — the whole project does not build; (2) a header line typed differently (<code>---Search Result---</code> has a space, <code>---Print---</code> does not); (3) sorting with <code>(int)(b.getSalary() - a.getSalary())</code> — 0.4 becomes 0 and the order breaks; use <code>Double.compare</code>.</div>`,
    `<h3>🧪 Bài 1 — Một đề PE 10 điểm: IEmployee, Staff, FullTime, PartTime, Q1 (~60 phút)</h3>
<p>(10 điểm, kiểu PE3/PE5) Tạo 1 interface, 1 lớp trừu tượng và 2 lớp như sơ đồ, rồi lớp <code>Q1</code>:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/6dd78ab8a49e4fc6e07805b271f9f89f9b3a88a7.svg" alt="Bài 1: sơ đồ lớp — Staff, getSalary() và addData() in nghiêng là trừu tượng" loading="lazy" /><p class="chu-thich">🧩 Bài 1: sơ đồ lớp — Staff, getSalary() và addData() in nghiêng là trừu tượng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — 1 interface, 1 abstract class, 2 classes and the Q1 driver
' Cùng hình dạng PE3 (ISmartDevice, Device, SmartPhone) và PE5 (Task, WorkTask, PersonalTask)
interface IEmployee {
  + getSalaryInfo() : String
  + checkLevel() : String
}
abstract class Staff {
  - id : String
  - name : String
  + Staff()
  + Staff(id : String, name : String)
  + getId() : String
  + getName() : String
  + setId(id : String) : void
  + setName(name : String) : void
  + {abstract} getSalary() : double
  + {abstract} addData() : String
}
class FullTime {
  - baseSalary : double
  - bonus : double
  + FullTime(id, name, baseSalary, bonus)
  + getSalary() : double
  + addData() : String
  + getSalaryInfo() : String
  + checkLevel() : String
}
class PartTime {
  - hours : int
  - rate : double
  + PartTime(id, name, hours, rate)
  + getSalary() : double
  + addData() : String
  + getSalaryInfo() : String
  + checkLevel() : String
}
class PeQ1Staff {
  ~ list : ArrayList&lt;Staff&gt;
  + read() : void
  + solve() : void
  + printResult() : void
}
Staff &lt;|-- FullTime
Staff &lt;|-- PartTime
IEmployee &lt;|.. FullTime
IEmployee &lt;|.. PartTime
PeQ1Staff o-- "0..*" Staff
@enduml</code></pre></details>
<ul>
<li><code>FullTime.getSalary()</code> = baseSalary + bonus; <code>PartTime.getSalary()</code> = hours × rate.</li>
<li><code>getSalaryInfo()</code> trả về <code>FullTime(id,name,salary)</code> hoặc <code>PartTime(id,name,salary)</code>, salary một chữ số thập phân; <code>addData()</code> trả về chuỗi đó + " is added".</li>
<li><code>checkLevel()</code>: FullTime là "Senior" khi salary ≥ 15000; PartTime khi hours ≥ 100; còn lại "Junior".</li>
<li><code>Q1</code> đọc T, rồi T lệnh: <code>add-full,id,name,base,bonus</code> · <code>add-part,id,name,hours,rate</code> · <code>print</code> (dòng đầu <code>---Print---</code>, hoặc "Empty") · <code>search,id</code> (<code>---Search Result---</code>, hoặc "Not found") · <code>level,id</code> (<code>---Level---</code>, "id is Senior/Junior") · <code>sort</code> (<code>---Sort---</code>, lương giảm dần, rồi theo id) · <code>total</code> ("Total salary: x") · <code>clear</code> ("* Remove all Staff").</li>
</ul>
<details><summary>Lời giải (chạy thật trên JDK 8, với dữ liệu bên dưới)</summary>
<pre class="trich"><code class="language-java">interface IEmployee {
    String getSalaryInfo();
    String checkLevel();
}</code></pre>
<pre class="trich"><code class="language-java">abstract class Staff {
    private String id;
    private String name;

    public Staff() {
    }

    public Staff(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }

    public abstract double getSalary();      // {abstract} trên sơ đồ
    public abstract String addData();
}</code></pre>
<pre class="trich"><code class="language-java">class FullTime extends Staff implements IEmployee {
    private double baseSalary;
    private double bonus;

    public FullTime() {
    }

    public FullTime(String id, String name, double baseSalary, double bonus) {
        super(id, name);
        this.baseSalary = baseSalary;
        this.bonus = bonus;
    }

    @Override
    public double getSalary() { return baseSalary + bonus; }

    @Override
    public String getSalaryInfo() {
        return String.format("FullTime(%s,%s,%.1f)", getId(), getName(), getSalary());
    }

    @Override
    public String addData() { return getSalaryInfo() + " is added"; }

    @Override
    public String checkLevel() { return getSalary() &gt;= 15000 ? "Senior" : "Junior"; }
}</code></pre>
<pre class="trich"><code class="language-java">class PartTime extends Staff implements IEmployee {
    private int hours;
    private double rate;

    public PartTime() {
    }

    public PartTime(String id, String name, int hours, double rate) {
        super(id, name);
        this.hours = hours;
        this.rate = rate;
    }

    @Override
    public double getSalary() { return hours * rate; }

    @Override
    public String getSalaryInfo() {
        return String.format("PartTime(%s,%s,%.1f)", getId(), getName(), getSalary());
    }

    @Override
    public String addData() { return getSalaryInfo() + " is added"; }

    @Override
    public String checkLevel() { return hours &gt;= 100 ? "Senior" : "Junior"; }
}</code></pre>
<pre class="trich"><code class="language-java">//--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
int n;
String[] lines;
StringBuilder result = new StringBuilder();
ArrayList&lt;Staff&gt; list = new ArrayList&lt;&gt;();

// trong đề thật phần này CỐ ĐỊNH và đọc input.txt; ở đây đọc bàn phím
public void read() {
    Scanner sc = new Scanner(System.in);
    //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
    n = Integer.parseInt(sc.nextLine().trim());
    lines = new String[n];
    for (int i = 0; i &lt; n; i++) lines[i] = sc.nextLine().trim();
}

//ALGORITHM - @STUDENT: ADD YOUR OWN METHODS HERE (IF NEED):
private Staff find(String id) {
    for (Staff s : list) if (s.getId().equalsIgnoreCase(id)) return s;
    return null;
}

private void out(String s) { result.append(s).append("\\n"); }

public void solve() {
    //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
    for (int i = 0; i &lt; n; i++) {
        String[] p = lines[i].split(",");
        String cmd = p[0].trim();
        if (cmd.equals("add-full")) {
            Staff s = new FullTime(p[1], p[2], Double.parseDouble(p[3]), Double.parseDouble(p[4]));
            list.add(s);
            out(s.addData());
        } else if (cmd.equals("add-part")) {
            Staff s = new PartTime(p[1], p[2], Integer.parseInt(p[3]), Double.parseDouble(p[4]));
            list.add(s);
            out(s.addData());
        } else if (cmd.equals("print")) {
            out("---Print---");
            if (list.isEmpty()) out("Empty");
            for (Staff s : list) out(((IEmployee) s).getSalaryInfo());   // mọi Staff ở đây đều implements IEmployee
        } else if (cmd.equals("search")) {
            out("---Search Result---");
            Staff s = find(p[1]);
            out(s == null ? "Not found" : ((IEmployee) s).getSalaryInfo());
        } else if (cmd.equals("level")) {
            out("---Level---");
            Staff s = find(p[1]);
            out(s == null ? "Not found" : s.getId() + " is " + ((IEmployee) s).checkLevel());
        } else if (cmd.equals("sort")) {
            out("---Sort---");
            if (list.isEmpty()) out("Empty");
            Collections.sort(list, new Comparator&lt;Staff&gt;() {               // lương giảm dần, rồi theo id
                @Override
                public int compare(Staff a, Staff b) {
                    int c = Double.compare(b.getSalary(), a.getSalary());
                    return c != 0 ? c : a.getId().compareTo(b.getId());
                }
            });
            for (Staff s : list) out(((IEmployee) s).getSalaryInfo());
        } else if (cmd.equals("total")) {
            double sum = 0;
            for (Staff s : list) sum += s.getSalary();
            out(String.format("Total salary: %.1f", sum));
        } else if (cmd.equals("clear")) {
            list.clear();
            out("* Remove all Staff");
        }
    }
}

// trong đề thật: CỐ ĐỊNH, ghi output.txt
public void printResult() {
    System.out.print(result);
}

public static void main(String[] args) {
    PeQ1Staff q = new PeQ1Staff();
    q.read();
    q.solve();
    q.printResult();
}</code></pre>
<p>Dữ liệu vào (trong đề thật đây là <code>input.txt</code>):</p>
<pre><code class="language-plaintext">12
add-full,E02,Hoa,9000,1000
add-part,P01,Minh,120,95
add-full,E01,Lan,12000,3500
print
search,P01
search,X99
level,E01
level,E02
sort
total
clear
print</code></pre>
<div class="out">FullTime(E02,Hoa,10000.0) is added<br>
PartTime(P01,Minh,11400.0) is added<br>
FullTime(E01,Lan,15500.0) is added<br>
---Print---<br>
FullTime(E02,Hoa,10000.0)<br>
PartTime(P01,Minh,11400.0)<br>
FullTime(E01,Lan,15500.0)<br>
---Search Result---<br>
PartTime(P01,Minh,11400.0)<br>
---Search Result---<br>
Not found<br>
---Level---<br>
E01 is Senior<br>
---Level---<br>
E02 is Junior<br>
---Sort---<br>
FullTime(E01,Lan,15500.0)<br>
PartTime(P01,Minh,11400.0)<br>
FullTime(E02,Hoa,10000.0)<br>
Total salary: 36900.0<br>
* Remove all Staff<br>
---Print---<br>
Empty</div>
<p>Các mảnh ứng với đề thế nào: phần FIXED của khung (khối try trong <code>read()</code>, <code>printResult()</code>, <code>main</code>) mở <code>input.txt</code>/<code>output.txt</code> trong đề thật — bạn không bao giờ đụng vào; mọi thứ sau <code>@STUDENT</code> là phần bạn viết, và nó y hệt ở đây. <code>list</code> là <code>ArrayList&lt;Staff&gt;</code>, nên <code>getSalary()</code> không cần ép kiểu. <code>getSalaryInfo()</code> thuộc <code>IEmployee</code>, mà Staff không implements nó, nên mới có <code>((IEmployee) s)</code> — an toàn, vì cả hai lớp cụ thể đều implements nó. Nếu sơ đồ cho phép, <code>abstract class Staff implements IEmployee</code> (để hai phương thức đó ở dạng trừu tượng) sẽ xoá hết các phép ép.</p>
</details>
<div class="pitfall">Chỗ hay mất trọn 10 điểm: (1) thiếu thân <code>@Override</code> của một phương thức <code>{abstract}</code> — cả project không build; (2) gõ dòng tiêu đề khác đi (<code>---Search Result---</code> có dấu cách, <code>---Print---</code> thì không); (3) sắp xếp bằng <code>(int)(b.getSalary() - a.getSalary())</code> — 0.4 thành 0 và thứ tự hỏng; hãy dùng <code>Double.compare</code>.</div>`),
    bi(`<h3>🧪 Exercise 2 — PE question 4: implement the given IWord (~20 min)</h3>
<p>(2–3 marks, PE style) The interface <code>IWord</code> is "already compiled and given in byte code format" — use it, do not create IWord.java. Write <code>MyWord implements IWord</code>: <code>f1(str)</code> counts the words whose length is even; <code>f2(str)</code> returns the string with each word capitalised (first letter upper case, the rest lower case) and exactly one space between words. Words may be separated by several spaces.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a6c6211abca3eecb33ca3c2889531096cafd3962.svg" alt="Exercise 2: the given Main knows only the interface" loading="lazy" /><p class="chu-thich">🧩 Exercise 2: the given Main knows only the interface</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — PE question 4: implement the given interface
' The given Main depends only on IWord; it never names MyWord except in "new MyWord()"
interface IWord &lt;&lt;given, byte code&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
}
class MyWord {
  + f1(str : String) : int
  + f2(str : String) : String
}
class "Main (given)" as Main
IWord &lt;|.. MyWord
Main ..&gt; IWord : uses
Main ..&gt; MyWord : creates
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">// given in byte code: you use it, you do not write it
interface IWord {
    public int f1(String str);
    public String f2(String str);
}</code></pre>
<pre class="trich"><code class="language-java">class MyWord implements IWord {
    // f1: count the words whose length is an even number
    @Override
    public int f1(String str) {
        String s = str.trim();
        if (s.isEmpty()) return 0;
        int count = 0;
        for (String w : s.split("\\\\s+")) {       // one or more spaces between words
            if (w.length() % 2 == 0) count++;
        }
        return count;
    }

    // f2: capitalise each word (first letter upper case, the rest lower case), words separated by one space
    @Override
    public String f2(String str) {
        String s = str.trim();
        if (s.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (String w : s.split("\\\\s+")) {
            if (sb.length() &gt; 0) sb.append(" ");
            sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1).toLowerCase());
        }
        return sb.toString();
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void run(String str, int tc) {
    System.out.println("Enter string: " + str);
    System.out.println("1. Test f1 (count even-length words)");
    System.out.println("2. Test f2 (capitalise each word)");
    System.out.println("Enter TC (1 or 2): " + tc);
    IWord w = new MyWord();                  // the given Main only knows the interface type
    System.out.println("OUTPUT:");
    if (tc == 1) System.out.println(w.f1(str));
    else System.out.println(w.f2(str));
    System.out.println();
}</code></pre>
<div class="out">Enter string: &nbsp;&nbsp;java is &nbsp;a fun language<br>
1. Test f1 (count even-length words)<br>
2. Test f2 (capitalise each word)<br>
Enter TC (1 or 2): 1<br>
OUTPUT:<br>
3<br>
<br>
Enter string: &nbsp;&nbsp;java is &nbsp;a fun language<br>
1. Test f1 (count even-length words)<br>
2. Test f2 (capitalise each word)<br>
Enter TC (1 or 2): 2<br>
OUTPUT:<br>
Java Is A Fun Language<br>
<br>
Enter string: hELLO &nbsp;&nbsp;fpt UNIVERSITY<br>
1. Test f1 (count even-length words)<br>
2. Test f2 (capitalise each word)<br>
Enter TC (1 or 2): 2<br>
OUTPUT:<br>
Hello Fpt University</div>
<p>"java is a fun language" has even-length words java (4), is (2), language (8) → 3. The two techniques that make string questions safe: <code>trim()</code> first, then <code>split("\\\\s+")</code> — one or more whitespace characters — so double spaces never produce empty "words". The given Main writes <code>IWord w = new MyWord();</code>: your class must be named exactly <code>MyWord</code> and its methods must be <code>public</code>, or the marker's code does not compile.</p>
</details>
<div class="pitfall"><code>"a  b".split(" ")</code> gives <strong>three</strong> parts — "a", "", "b" — and the empty one is counted as a word of even length 0. That single bug fails most test cases of question 4.</div>`,
    `<h3>🧪 Bài 2 — Câu 4 đề PE: hiện thực IWord cho sẵn (~20 phút)</h3>
<p>(2–3 điểm, kiểu PE) Interface <code>IWord</code> "đã biên dịch và cho sẵn dạng byte code" — cứ dùng, đừng tạo IWord.java. Viết <code>MyWord implements IWord</code>: <code>f1(str)</code> đếm số từ có độ dài chẵn; <code>f2(str)</code> trả về chuỗi với mỗi từ được viết hoa chữ đầu (chữ đầu hoa, còn lại thường) và đúng một dấu cách giữa các từ. Các từ có thể cách nhau nhiều dấu cách.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/a6c6211abca3eecb33ca3c2889531096cafd3962.svg" alt="Bài 2: Main đề cho chỉ biết interface" loading="lazy" /><p class="chu-thich">🧩 Bài 2: Main đề cho chỉ biết interface</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — PE question 4: implement the given interface
' Main đề cho chỉ phụ thuộc IWord; nó chỉ nhắc tên MyWord ở "new MyWord()"
interface IWord &lt;&lt;given, byte code&gt;&gt; {
  + f1(str : String) : int
  + f2(str : String) : String
}
class MyWord {
  + f1(str : String) : int
  + f2(str : String) : String
}
class "Main (given)" as Main
IWord &lt;|.. MyWord
Main ..&gt; IWord : uses
Main ..&gt; MyWord : creates
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">// cho sẵn dạng byte code: bạn dùng, không phải viết
interface IWord {
    public int f1(String str);
    public String f2(String str);
}</code></pre>
<pre class="trich"><code class="language-java">class MyWord implements IWord {
    // f1: đếm số từ có độ dài chẵn
    @Override
    public int f1(String str) {
        String s = str.trim();
        if (s.isEmpty()) return 0;
        int count = 0;
        for (String w : s.split("\\\\s+")) {       // giữa các từ có thể nhiều dấu cách
            if (w.length() % 2 == 0) count++;
        }
        return count;
    }

    // f2: viết hoa chữ đầu mỗi từ (chữ đầu hoa, còn lại thường), các từ cách nhau một dấu cách
    @Override
    public String f2(String str) {
        String s = str.trim();
        if (s.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (String w : s.split("\\\\s+")) {
            if (sb.length() &gt; 0) sb.append(" ");
            sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1).toLowerCase());
        }
        return sb.toString();
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void run(String str, int tc) {
    System.out.println("Enter string: " + str);
    System.out.println("1. Test f1 (count even-length words)");
    System.out.println("2. Test f2 (capitalise each word)");
    System.out.println("Enter TC (1 or 2): " + tc);
    IWord w = new MyWord();                  // Main đề cho chỉ biết kiểu interface
    System.out.println("OUTPUT:");
    if (tc == 1) System.out.println(w.f1(str));
    else System.out.println(w.f2(str));
    System.out.println();
}</code></pre>
<div class="out">Enter string: &nbsp;&nbsp;java is &nbsp;a fun language<br>
1. Test f1 (count even-length words)<br>
2. Test f2 (capitalise each word)<br>
Enter TC (1 or 2): 1<br>
OUTPUT:<br>
3<br>
<br>
Enter string: &nbsp;&nbsp;java is &nbsp;a fun language<br>
1. Test f1 (count even-length words)<br>
2. Test f2 (capitalise each word)<br>
Enter TC (1 or 2): 2<br>
OUTPUT:<br>
Java Is A Fun Language<br>
<br>
Enter string: hELLO &nbsp;&nbsp;fpt UNIVERSITY<br>
1. Test f1 (count even-length words)<br>
2. Test f2 (capitalise each word)<br>
Enter TC (1 or 2): 2<br>
OUTPUT:<br>
Hello Fpt University</div>
<p>"java is a fun language" có các từ độ dài chẵn java (4), is (2), language (8) → 3. Hai kỹ thuật giúp câu xử lý chuỗi an toàn: <code>trim()</code> trước, rồi <code>split("\\\\s+")</code> — một hay nhiều ký tự trắng — để hai dấu cách liền nhau không bao giờ sinh ra "từ" rỗng. Main đề cho viết <code>IWord w = new MyWord();</code>: lớp của bạn phải tên đúng <code>MyWord</code> và các phương thức phải <code>public</code>, không thì code của máy chấm không biên dịch được.</p>
</details>
<div class="pitfall"><code>"a  b".split(" ")</code> cho ra <strong>ba</strong> phần — "a", "", "b" — và phần rỗng bị đếm là một từ độ dài chẵn 0. Chỉ một lỗi đó là đủ trượt phần lớn test case của câu 4.</div>`),
    bi(`<h3>🧪 Exercise 3 — The school's abstract Menu: measure the bug, then fix it (~30 min)</h3>
<p>The Banking project (<code>textview/Menu.java</code>) is an abstract class: <code>run()</code> loops "display, read a choice, <code>execute(n)</code>", and <code>execute</code> is abstract, so <code>BankApp</code> only writes what each choice does — the template method of lesson 5.A, slide 22. But its <code>getSelected()</code> creates a new <code>Scanner</code> on every call. Part 1: run that method twice with piped input <code>1 / 2 / 0</code>. Part 2: rewrite <code>Menu</code> so that it works with any input source, and use it for a small student manager.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b41d36dfcbdd7650c90bce73b1f6462873459a96.svg" alt="Exercise 3: run() is final and fixed in Menu; a subclass writes only execute()" loading="lazy" /><p class="chu-thich">🧩 Exercise 3: run() is final and fixed in Menu; a subclass writes only execute()</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — the school's abstract Menu, fixed: run() is a template method
' run() is final and calls the abstract execute(); a subclass writes only execute()
abstract class Menu {
  # {static} SC : Scanner
  - title : String
  - choices : String[]
  # Menu(title : String, choices : String...)
  - display() : void
  # {static} ask(msg : String) : String
  - getSelected() : int
  + {abstract} execute(n : int) : void
  + run() : void {final}
}
class StudentMenu {
  - students : ArrayList&lt;String[]&gt;
  + execute(n : int) : void
}
Menu &lt;|-- StudentMenu
note right of Menu
  Banking project: BankApp extends Menu,
  TransactionMenu (inner class) extends Menu
end note
@enduml</code></pre></details>
<details><summary>Part 1 — the real run of the Banking method</summary>
<pre class="trich"><code class="language-java">// as in banking/src/textview/Menu.java
public static int getSelected() {
    System.out.print("Please select..:");
    Scanner sc = new Scanner(System.in);
    return sc.nextInt();
}</code></pre>
<pre class="trich"><code class="language-java">try {
    int a = getSelected();
    System.out.println(" got " + a);
    int b = getSelected();              // the input still has "2", "0" — but the first Scanner already buffered them
    System.out.println(" got " + b);
} catch (java.util.NoSuchElementException e) {
    System.out.println();
    System.out.println("second call failed: " + e.getClass().getName());
}</code></pre>
<div class="out">Please select..: got 1<br>
Please select..:<br>
second call failed: java.util.NoSuchElementException</div>
<p>The first Scanner reads a whole block of input into its buffer — all three lines — and returns "1". It is then thrown away together with the buffered "2" and "0". The second Scanner reads from a stream that is already empty: <code>NoSuchElementException</code>. Typing by hand hides the bug (each Enter delivers one line at a time); graders that pipe a file expose it.</p>
</details>
<details><summary>Part 2 — the fixed Menu and a concrete StudentMenu (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">abstract class Menu {
    protected static final Scanner SC = new Scanner(System.in);   // ONE Scanner for every menu
    private final String title;
    private final String[] choices;

    protected Menu(String title, String... choices) {
        this.title = title;
        this.choices = choices;
    }

    private void display() {
        System.out.println("== " + title + " ==");
        for (int i = 0; i &lt; choices.length; i++) System.out.println((i + 1) + ". " + choices[i]);
    }

    protected static String ask(String msg) {
        System.out.print(msg);
        String s = SC.nextLine().trim();
        System.out.println(s);                                    // echo the typed value into the transcript
        return s;
    }

    private int getSelected() {
        while (true) {
            try {
                return Integer.parseInt(ask("Please select..: "));
            } catch (NumberFormatException e) {
                System.out.println("  ! enter a number");
            }
        }
    }

    public abstract void execute(int n);                         // the only step a subclass must write

    public final void run() {                                     // template method: the steps are fixed here
        while (true) {
            display();
            int n = getSelected();
            if (n &lt; 1 || n &gt; choices.length) { System.out.println("Bye"); return; }
            execute(n);
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentMenu extends Menu {
    private final ArrayList&lt;String[]&gt; students = new ArrayList&lt;&gt;();   // {id, name, gpa}

    StudentMenu() { super("STUDENT MANAGER", "Add student", "List students", "Find by id"); }

    @Override
    public void execute(int n) {
        switch (n) {
            case 1:
                students.add(new String[] { ask("  id: ").toUpperCase(), ask("  name: "), ask("  gpa: ") });
                System.out.println("  added, total " + students.size());
                break;
            case 2:
                for (String[] s : students) System.out.println("  " + s[0] + " | " + s[1] + " | " + s[2]);
                break;
            default:
                String id = ask("  id: ");
                for (String[] s : students) if (s[0].equalsIgnoreCase(id)) { System.out.println("  found: " + s[1]); return; }
                System.out.println("  not found");
        }
    }
}</code></pre>
<p>Input: <code>1, he190001, Nguyen Van An, 8.5, x, 1, he190002, Tran Thi Binh, 7.25, 2, 3, HE190002, 3, he999999, 4</code>.</p>
<div class="out">== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 1<br>
&nbsp;&nbsp;id: he190001<br>
&nbsp;&nbsp;name: Nguyen Van An<br>
&nbsp;&nbsp;gpa: 8.5<br>
&nbsp;&nbsp;added, total 1<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: x<br>
&nbsp;&nbsp;! enter a number<br>
Please select..: 1<br>
&nbsp;&nbsp;id: he190002<br>
&nbsp;&nbsp;name: Tran Thi Binh<br>
&nbsp;&nbsp;gpa: 7.25<br>
&nbsp;&nbsp;added, total 2<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 2<br>
&nbsp;&nbsp;HE190001 | Nguyen Van An | 8.5<br>
&nbsp;&nbsp;HE190002 | Tran Thi Binh | 7.25<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 3<br>
&nbsp;&nbsp;id: HE190002<br>
&nbsp;&nbsp;found: Tran Thi Binh<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 3<br>
&nbsp;&nbsp;id: he999999<br>
&nbsp;&nbsp;not found<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 4<br>
Bye</div>
<p>Three design choices: one <code>static final Scanner</code> shared by every menu (the fix); <code>run()</code> is <code>final</code>, so no subclass can break the loop; and choices are read with <code>nextLine()</code> + <code>parseInt</code> inside a retry loop, so "x" is asked again instead of crashing. The school's version also uses a raw <code>ArrayList</code> (no <code>&lt;String&gt;</code>) — legal, but the compiler then cannot check what goes in.</p>
</details>`,
    `<h3>🧪 Bài 3 — Menu trừu tượng của trường: đo lỗi, rồi sửa (~30 phút)</h3>
<p>Project Banking (<code>textview/Menu.java</code>) là một lớp trừu tượng: <code>run()</code> lặp "hiện menu, đọc lựa chọn, <code>execute(n)</code>", và <code>execute</code> là trừu tượng, nên <code>BankApp</code> chỉ viết việc mà mỗi lựa chọn làm — đúng template method của bài 5.A, slide 22. Nhưng <code>getSelected()</code> của nó tạo một <code>Scanner</code> mới ở mỗi lần gọi. Phần 1: chạy phương thức đó hai lần với dữ liệu nạp qua pipe <code>1 / 2 / 0</code>. Phần 2: viết lại <code>Menu</code> để nó chạy được với mọi nguồn dữ liệu, rồi dùng nó cho một chương trình quản lý sinh viên nhỏ.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b41d36dfcbdd7650c90bce73b1f6462873459a96.svg" alt="Bài 3: run() là final và cố định trong Menu; lớp con chỉ viết execute()" loading="lazy" /><p class="chu-thich">🧩 Bài 3: run() là final và cố định trong Menu; lớp con chỉ viết execute()</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — the school's abstract Menu, fixed: run() is a template method
' run() là final và gọi execute() trừu tượng; lớp con chỉ viết execute()
abstract class Menu {
  # {static} SC : Scanner
  - title : String
  - choices : String[]
  # Menu(title : String, choices : String...)
  - display() : void
  # {static} ask(msg : String) : String
  - getSelected() : int
  + {abstract} execute(n : int) : void
  + run() : void {final}
}
class StudentMenu {
  - students : ArrayList&lt;String[]&gt;
  + execute(n : int) : void
}
Menu &lt;|-- StudentMenu
note right of Menu
  Banking project: BankApp extends Menu,
  TransactionMenu (inner class) extends Menu
end note
@enduml</code></pre></details>
<details><summary>Phần 1 — chạy thật phương thức của Banking</summary>
<pre class="trich"><code class="language-java">// như trong banking/src/textview/Menu.java
public static int getSelected() {
    System.out.print("Please select..:");
    Scanner sc = new Scanner(System.in);
    return sc.nextInt();
}</code></pre>
<pre class="trich"><code class="language-java">try {
    int a = getSelected();
    System.out.println(" got " + a);
    int b = getSelected();              // dữ liệu nhập vẫn còn "2", "0" — nhưng Scanner đầu đã đệm mất
    System.out.println(" got " + b);
} catch (java.util.NoSuchElementException e) {
    System.out.println();
    System.out.println("second call failed: " + e.getClass().getName());
}</code></pre>
<div class="out">Please select..: got 1<br>
Please select..:<br>
second call failed: java.util.NoSuchElementException</div>
<p>Scanner đầu tiên đọc cả một khối dữ liệu vào bộ đệm — cả ba dòng — và trả về "1". Rồi nó bị bỏ đi cùng với "2" và "0" đã đệm. Scanner thứ hai đọc từ một luồng đã trống: <code>NoSuchElementException</code>. Gõ tay thì lỗi bị che (mỗi lần Enter chỉ đưa vào một dòng); người chấm nạp dữ liệu từ file qua pipe thì lỗi lộ ra.</p>
</details>
<details><summary>Phần 2 — Menu đã sửa và một StudentMenu cụ thể (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">abstract class Menu {
    protected static final Scanner SC = new Scanner(System.in);   // MỘT Scanner cho mọi menu
    private final String title;
    private final String[] choices;

    protected Menu(String title, String... choices) {
        this.title = title;
        this.choices = choices;
    }

    private void display() {
        System.out.println("== " + title + " ==");
        for (int i = 0; i &lt; choices.length; i++) System.out.println((i + 1) + ". " + choices[i]);
    }

    protected static String ask(String msg) {
        System.out.print(msg);
        String s = SC.nextLine().trim();
        System.out.println(s);                                    // in lại giá trị đã gõ vào bản ghi
        return s;
    }

    private int getSelected() {
        while (true) {
            try {
                return Integer.parseInt(ask("Please select..: "));
            } catch (NumberFormatException e) {
                System.out.println("  ! enter a number");
            }
        }
    }

    public abstract void execute(int n);                         // bước duy nhất lớp con phải viết

    public final void run() {                                     // phương thức khuôn mẫu: các bước cố định ở đây
        while (true) {
            display();
            int n = getSelected();
            if (n &lt; 1 || n &gt; choices.length) { System.out.println("Bye"); return; }
            execute(n);
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentMenu extends Menu {
    private final ArrayList&lt;String[]&gt; students = new ArrayList&lt;&gt;();   // {mã, tên, điểm}

    StudentMenu() { super("STUDENT MANAGER", "Add student", "List students", "Find by id"); }

    @Override
    public void execute(int n) {
        switch (n) {
            case 1:
                students.add(new String[] { ask("  id: ").toUpperCase(), ask("  name: "), ask("  gpa: ") });
                System.out.println("  added, total " + students.size());
                break;
            case 2:
                for (String[] s : students) System.out.println("  " + s[0] + " | " + s[1] + " | " + s[2]);
                break;
            default:
                String id = ask("  id: ");
                for (String[] s : students) if (s[0].equalsIgnoreCase(id)) { System.out.println("  found: " + s[1]); return; }
                System.out.println("  not found");
        }
    }
}</code></pre>
<p>Dữ liệu vào: <code>1, he190001, Nguyen Van An, 8.5, x, 1, he190002, Tran Thi Binh, 7.25, 2, 3, HE190002, 3, he999999, 4</code>.</p>
<div class="out">== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 1<br>
&nbsp;&nbsp;id: he190001<br>
&nbsp;&nbsp;name: Nguyen Van An<br>
&nbsp;&nbsp;gpa: 8.5<br>
&nbsp;&nbsp;added, total 1<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: x<br>
&nbsp;&nbsp;! enter a number<br>
Please select..: 1<br>
&nbsp;&nbsp;id: he190002<br>
&nbsp;&nbsp;name: Tran Thi Binh<br>
&nbsp;&nbsp;gpa: 7.25<br>
&nbsp;&nbsp;added, total 2<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 2<br>
&nbsp;&nbsp;HE190001 | Nguyen Van An | 8.5<br>
&nbsp;&nbsp;HE190002 | Tran Thi Binh | 7.25<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 3<br>
&nbsp;&nbsp;id: HE190002<br>
&nbsp;&nbsp;found: Tran Thi Binh<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 3<br>
&nbsp;&nbsp;id: he999999<br>
&nbsp;&nbsp;not found<br>
== STUDENT MANAGER ==<br>
1. Add student<br>
2. List students<br>
3. Find by id<br>
Please select..: 4<br>
Bye</div>
<p>Ba lựa chọn thiết kế: một <code>static final Scanner</code> dùng chung cho mọi menu (chính là cách sửa); <code>run()</code> là <code>final</code>, nên không lớp con nào phá được vòng lặp; và lựa chọn được đọc bằng <code>nextLine()</code> + <code>parseInt</code> trong vòng hỏi lại, nên "x" được hỏi lại thay vì sập. Bản của trường còn dùng <code>ArrayList</code> thô (không có <code>&lt;String&gt;</code>) — hợp lệ, nhưng khi đó trình biên dịch không kiểm được thứ gì được bỏ vào.</p>
</details>`),
    bi(`<h3>🧪 Exercise 4 — Sorting with interfaces you did not write (~20 min)</h3>
<p>Give <code>Phone</code> a natural order by id with <code>Comparable&lt;Phone&gt;</code>; then sort the same list by storage (descending, ties by id) with a <code>Comparator</code> written as an anonymous class, and by model name (A–Z, ignore case) with a Java 8 lambda.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b844ea1ab4140432b62350ed1b8424eb6b07ed08.svg" alt="Exercise 4: one class implements Comparable; two Comparators are written on the spot" loading="lazy" /><p class="chu-thich">🧩 Exercise 4: one class implements Comparable; two Comparators are written on the spot</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — one natural order (Comparable), any number of other orders (Comparator)
' Phone implements Comparable&lt;Phone&gt;; the Comparators are an anonymous class and a lambda in main
interface "Comparable&lt;Phone&gt;" as Comparable {
  + compareTo(other : Phone) : int
}
interface "Comparator&lt;Phone&gt;" as Comparator {
  + compare(a : Phone, b : Phone) : int
}
class Phone {
  - id : String
  - model : String
  - storage : int
  + compareTo(other : Phone) : int
  + toString() : String
}
class "(anonymous) storage desc" as Anon
class "(lambda) by model" as Lam
Comparable &lt;|.. Phone
Comparator &lt;|.. Anon
Comparator &lt;|.. Lam
hide Anon members
hide Lam members
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class Phone implements Comparable&lt;Phone&gt; {
    private final String id;
    private final String model;
    private final int storage;          // GB
    Phone(String id, String model, int storage) { this.id = id; this.model = model; this.storage = storage; }
    String getId() { return id; }
    String getModel() { return model; }
    int getStorage() { return storage; }

    @Override
    public int compareTo(Phone other) {  // natural order: by id
        return id.compareTo(other.id);
    }

    @Override
    public String toString() { return id + "(" + model + "," + storage + "GB)"; }
}</code></pre>
<pre class="trich"><code class="language-java">Collections.sort(list);                                  // uses compareTo
System.out.println("by id         : " + list);

Collections.sort(list, new Comparator&lt;Phone&gt;() {         // anonymous class
    @Override
    public int compare(Phone a, Phone b) {
        if (a.getStorage() != b.getStorage()) return b.getStorage() - a.getStorage();   // storage DESC
        return a.getId().compareTo(b.getId());           // tie: id ASC
    }
});
System.out.println("storage desc  : " + list);

Collections.sort(list, (a, b) -&gt; a.getModel().compareToIgnoreCase(b.getModel()));   // Java 8 lambda
System.out.println("by model (A-Z): " + list);</code></pre>
<div class="out">by id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [SP01(iPhone 15,256GB), SP02(Pixel 8,128GB), SP03(Galaxy A55,128GB), SP04(Redmi 13,256GB)]<br>
storage desc &nbsp;: [SP01(iPhone 15,256GB), SP04(Redmi 13,256GB), SP02(Pixel 8,128GB), SP03(Galaxy A55,128GB)]<br>
by model (A-Z): [SP03(Galaxy A55,128GB), SP01(iPhone 15,256GB), SP02(Pixel 8,128GB), SP04(Redmi 13,256GB)]</div>
<p><code>Collections.sort(list)</code> compiles only because <code>Phone implements Comparable&lt;Phone&gt;</code> — the library calls <em>your</em> <code>compareTo</code> through the interface, the purest example of polymorphism in this chapter. <code>Comparator</code> has one abstract method, so the lambda <code>(a, b) -&gt; …</code> is legal and works on the exam's JDK 8. Return a negative number, zero or a positive number; for <code>double</code> fields use <code>Double.compare</code>, never subtraction cast to int.</p>
</details>
<div class="callout">🧭 <strong>Go further — Chapter 8 and Spring Boot</strong>: <code>TreeSet</code> and <code>TreeMap</code> keep elements sorted by the same <code>compareTo</code>; in LabFlow, Spring Data turns <code>Sort.by("storage").descending()</code> into SQL — still a "comparator", now in the database.</div>`,
    `<h3>🧪 Bài 4 — Sắp xếp bằng các interface bạn không tự viết (~20 phút)</h3>
<p>Cho <code>Phone</code> một thứ tự tự nhiên theo id bằng <code>Comparable&lt;Phone&gt;</code>; rồi sắp xếp cùng danh sách đó theo dung lượng (giảm dần, bằng nhau thì theo id) với một <code>Comparator</code> viết dạng lớp ẩn danh, và theo tên model (A–Z, không phân biệt hoa thường) với một lambda Java 8.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b844ea1ab4140432b62350ed1b8424eb6b07ed08.svg" alt="Bài 4: một lớp hiện thực Comparable; hai Comparator viết tại chỗ" loading="lazy" /><p class="chu-thich">🧩 Bài 4: một lớp hiện thực Comparable; hai Comparator viết tại chỗ</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — one natural order (Comparable), any number of other orders (Comparator)
' Phone hiện thực Comparable&lt;Phone&gt;; các Comparator là một lớp ẩn danh và một lambda trong main
interface "Comparable&lt;Phone&gt;" as Comparable {
  + compareTo(other : Phone) : int
}
interface "Comparator&lt;Phone&gt;" as Comparator {
  + compare(a : Phone, b : Phone) : int
}
class Phone {
  - id : String
  - model : String
  - storage : int
  + compareTo(other : Phone) : int
  + toString() : String
}
class "(anonymous) storage desc" as Anon
class "(lambda) by model" as Lam
Comparable &lt;|.. Phone
Comparator &lt;|.. Anon
Comparator &lt;|.. Lam
hide Anon members
hide Lam members
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class Phone implements Comparable&lt;Phone&gt; {
    private final String id;
    private final String model;
    private final int storage;          // GB
    Phone(String id, String model, int storage) { this.id = id; this.model = model; this.storage = storage; }
    String getId() { return id; }
    String getModel() { return model; }
    int getStorage() { return storage; }

    @Override
    public int compareTo(Phone other) {  // thứ tự tự nhiên: theo id
        return id.compareTo(other.id);
    }

    @Override
    public String toString() { return id + "(" + model + "," + storage + "GB)"; }
}</code></pre>
<pre class="trich"><code class="language-java">Collections.sort(list);                                  // dùng compareTo
System.out.println("by id         : " + list);

Collections.sort(list, new Comparator&lt;Phone&gt;() {         // lớp ẩn danh
    @Override
    public int compare(Phone a, Phone b) {
        if (a.getStorage() != b.getStorage()) return b.getStorage() - a.getStorage();   // storage GIẢM
        return a.getId().compareTo(b.getId());           // bằng nhau: id TĂNG
    }
});
System.out.println("storage desc  : " + list);

Collections.sort(list, (a, b) -&gt; a.getModel().compareToIgnoreCase(b.getModel()));   // lambda Java 8
System.out.println("by model (A-Z): " + list);</code></pre>
<div class="out">by id &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [SP01(iPhone 15,256GB), SP02(Pixel 8,128GB), SP03(Galaxy A55,128GB), SP04(Redmi 13,256GB)]<br>
storage desc &nbsp;: [SP01(iPhone 15,256GB), SP04(Redmi 13,256GB), SP02(Pixel 8,128GB), SP03(Galaxy A55,128GB)]<br>
by model (A-Z): [SP03(Galaxy A55,128GB), SP01(iPhone 15,256GB), SP02(Pixel 8,128GB), SP04(Redmi 13,256GB)]</div>
<p><code>Collections.sort(list)</code> biên dịch được chỉ vì <code>Phone implements Comparable&lt;Phone&gt;</code> — thư viện gọi <code>compareTo</code> của <em>bạn</em> qua interface, ví dụ đa hình thuần nhất của chương này. <code>Comparator</code> có một phương thức trừu tượng, nên lambda <code>(a, b) -&gt; …</code> là hợp lệ và chạy được trên JDK 8 của phòng thi. Trả về số âm, số 0 hoặc số dương; với trường <code>double</code> hãy dùng <code>Double.compare</code>, đừng bao giờ trừ rồi ép sang int.</p>
</details>
<div class="callout">🧭 <strong>Đi tiếp — Chương 8 và Spring Boot</strong>: <code>TreeSet</code> và <code>TreeMap</code> giữ phần tử có thứ tự theo đúng <code>compareTo</code> đó; trong LabFlow, Spring Data biến <code>Sort.by("storage").descending()</code> thành SQL — vẫn là một "comparator", chỉ là nằm trong cơ sở dữ liệu.</div>`),
    bi(`<h3>🧪 Exercise 5 — Predict six outputs (~15 min)</h3>
<p>FE style. Read the types, then write down what (a)–(f) print before opening the answer.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c6a85a324ac4304d03c28e59eaa98c403d48491b.svg" alt="Exercise 5: the interface Greeting, the abstract Counter, and Child that inherits hello() twice" loading="lazy" /><p class="chu-thich">🧩 Exercise 5: the interface Greeting, the abstract Counter, and Child that inherits hello() twice</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — the types behind the six predictions
' Greeting has one abstract method (so a lambda fits); Child inherits hello() from both a class and an interface
interface Greeting {
  + PREFIX : String = "Hi " {static, final}
  + greet(name : String) : String
  + twice(name : String) : String «default»
  + {static} shout(s : String) : String
}
abstract class Counter {
  # value : int
  ~ Counter(start : int)
  ~ {abstract} step() : int
  ~ next() : int
}
class Base {
  + hello() : String
}
interface Friendly {
  + hello() : String «default»
}
class Child
Base &lt;|-- Child
Friendly &lt;|.. Child
hide Child members
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">interface Greeting {
    String PREFIX = "Hi ";                                // public static final
    String greet(String name);
    default String twice(String name) { return greet(name) + " / " + greet(name); }
    static String shout(String s) { return s.toUpperCase(); }
}

abstract class Counter {
    protected int value;
    Counter(int start) { value = start; System.out.println("  Counter(" + start + ")"); }
    abstract int step();
    int next() { value += step(); return value; }
}

class Base { public String hello() { return "Base.hello"; } }
interface Friendly { default String hello() { return "Friendly.hello"; } }
class Child extends Base implements Friendly { }</code></pre>
<pre class="trich"><code class="language-java">Greeting g = new Greeting() {
    public String greet(String name) { return PREFIX + name; }
};
System.out.println("(a) " + g.greet("An"));
System.out.println("(b) " + g.twice("Binh"));
System.out.println("(c) " + Greeting.shout("ok"));

final int base = 10;                              // effectively final: may be captured
System.out.println("(d)");
Counter c = new Counter(base) {
    int step() { return 5; }
};
c.next();
System.out.println("  value = " + c.next());

System.out.println("(e) " + new Child().hello());
Greeting lambda = name -&gt; "Hello " + name;        // ONE abstract method -&gt; a lambda fits
System.out.println("(f) " + lambda.twice("Cuong"));</code></pre>
<details><summary>Answer (real output) and the rule behind each line</summary>
<div class="out">(a) Hi An<br>
(b) Hi Binh / Hi Binh<br>
(c) OK<br>
(d)<br>
&nbsp;&nbsp;Counter(10)<br>
&nbsp;&nbsp;value = 20<br>
(e) Base.hello<br>
(f) Hello Cuong / Hello Cuong</div>
<ul>
<li><strong>(a)</strong> <code>PREFIX</code> is an interface constant, visible inside the anonymous class as if it were its own.</li>
<li><strong>(b)</strong> the default method <code>twice()</code> calls the abstract <code>greet()</code> — dynamic, so the anonymous class's body runs twice.</li>
<li><strong>(c)</strong> a static interface method is called through the interface name only.</li>
<li><strong>(d)</strong> creating an anonymous subclass of an abstract class <strong>runs the abstract class's constructor</strong> (with <code>base</code> as argument); <code>base</code> may be captured because it never changes; 10 + 5 + 5 = 20.</li>
<li><strong>(e)</strong> "class wins": when a superclass method and an interface default method collide, the class's method is used — no compile error.</li>
<li><strong>(f)</strong> <code>Greeting</code> has one abstract method, so a lambda can implement it, and it still gets the default <code>twice()</code>.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — Đoán sáu output (~15 phút)</h3>
<p>Kiểu FE. Đọc các kiểu, rồi ghi ra (a)–(f) in gì trước khi mở đáp án.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/c6a85a324ac4304d03c28e59eaa98c403d48491b.svg" alt="Bài 5: interface Greeting, lớp trừu tượng Counter, và Child nhận hello() từ hai nơi" loading="lazy" /><p class="chu-thich">🧩 Bài 5: interface Greeting, lớp trừu tượng Counter, và Child nhận hello() từ hai nơi</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — the types behind the six predictions
' Greeting có một phương thức trừu tượng (nên lambda dùng được); Child nhận hello() từ cả một lớp lẫn một interface
interface Greeting {
  + PREFIX : String = "Hi " {static, final}
  + greet(name : String) : String
  + twice(name : String) : String «default»
  + {static} shout(s : String) : String
}
abstract class Counter {
  # value : int
  ~ Counter(start : int)
  ~ {abstract} step() : int
  ~ next() : int
}
class Base {
  + hello() : String
}
interface Friendly {
  + hello() : String «default»
}
class Child
Base &lt;|-- Child
Friendly &lt;|.. Child
hide Child members
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">interface Greeting {
    String PREFIX = "Hi ";                                // public static final
    String greet(String name);
    default String twice(String name) { return greet(name) + " / " + greet(name); }
    static String shout(String s) { return s.toUpperCase(); }
}

abstract class Counter {
    protected int value;
    Counter(int start) { value = start; System.out.println("  Counter(" + start + ")"); }
    abstract int step();
    int next() { value += step(); return value; }
}

class Base { public String hello() { return "Base.hello"; } }
interface Friendly { default String hello() { return "Friendly.hello"; } }
class Child extends Base implements Friendly { }</code></pre>
<pre class="trich"><code class="language-java">Greeting g = new Greeting() {
    public String greet(String name) { return PREFIX + name; }
};
System.out.println("(a) " + g.greet("An"));
System.out.println("(b) " + g.twice("Binh"));
System.out.println("(c) " + Greeting.shout("ok"));

final int base = 10;                              // thực chất final: được phép bắt giữ
System.out.println("(d)");
Counter c = new Counter(base) {
    int step() { return 5; }
};
c.next();
System.out.println("  value = " + c.next());

System.out.println("(e) " + new Child().hello());
Greeting lambda = name -&gt; "Hello " + name;        // MỘT phương thức trừu tượng -&gt; lambda dùng được
System.out.println("(f) " + lambda.twice("Cuong"));</code></pre>
<details><summary>Đáp án (output thật) và luật đứng sau mỗi dòng</summary>
<div class="out">(a) Hi An<br>
(b) Hi Binh / Hi Binh<br>
(c) OK<br>
(d)<br>
&nbsp;&nbsp;Counter(10)<br>
&nbsp;&nbsp;value = 20<br>
(e) Base.hello<br>
(f) Hello Cuong / Hello Cuong</div>
<ul>
<li><strong>(a)</strong> <code>PREFIX</code> là hằng của interface, thấy được bên trong lớp ẩn danh như thể của chính nó.</li>
<li><strong>(b)</strong> phương thức default <code>twice()</code> gọi phương thức trừu tượng <code>greet()</code> — lời gọi động, nên thân của lớp ẩn danh chạy hai lần.</li>
<li><strong>(c)</strong> phương thức static của interface chỉ gọi được qua tên interface.</li>
<li><strong>(d)</strong> tạo một lớp con ẩn danh của lớp trừu tượng <strong>có chạy constructor của lớp trừu tượng</strong> (với đối số <code>base</code>); <code>base</code> được phép bắt giữ vì nó không bao giờ đổi; 10 + 5 + 5 = 20.</li>
<li><strong>(e)</strong> "lớp thắng" (class wins): khi phương thức của lớp cha và phương thức default của interface va nhau, phương thức của lớp được dùng — không có lỗi biên dịch.</li>
<li><strong>(f)</strong> <code>Greeting</code> có một phương thức trừu tượng, nên lambda hiện thực được nó, và nó vẫn nhận phương thức default <code>twice()</code>.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — Name the rule behind six real compile errors (~15 min)</h3>
<p>Each snippet breaks one rule of Chapter 5. Read the real JDK 8 message and say, in one sentence, which rule and how to fix it.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b41e443170141f5cfabf98efb5b4605fe3ee2c0f.svg" alt="Exercise 6: what the snippets should have built" loading="lazy" /><p class="chu-thich">🧩 Exercise 6: what the snippets should have built</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — what the six snippets should have built
' Each correct version satisfies one rule: implement every abstract method, keep it public, never new an abstract type
interface Shape {
  + area() : double
}
class Circle {
  ~ r : double
  + area() : double
}
class Square {
  ~ a : double
  + area() : double
}
abstract class Animal {
  ~ {abstract} sound() : void
}
class Dog {
  ~ sound() : void
}
interface Remote {
  + price : int = 10 {static, final}
}
Shape &lt;|.. Circle
Shape &lt;|.. Square
Animal &lt;|-- Dog
@enduml</code></pre></details>
<details><summary>The snippets and the real errors</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String[][] cases = {
        { "E1.java",
          "interface Shape { double area(); }\\n" +
          "class Circle implements Shape { double r = 1; }\\n" },
        { "E2.java",
          "interface Shape { double area(); }\\n" +
          "class Square implements Shape { double a = 2; double area() { return a * a; } }\\n" },
        { "E3.java",
          "abstract class Animal { abstract void sound(); }\\n" +
          "class Zoo { Animal a = new Animal(); }\\n" },
        { "E4.java",
          "interface Box {\\n" +
          "    protected void open();\\n" +
          "}\\n" },
        { "E5.java",
          "interface Remote { int price = 10; }\\n" +
          "class TV implements Remote { void cheaper() { price = 5; } }\\n" },
        { "E6.java",
          "import java.util.*;\\n" +
          "class Total {\\n" +
          "    int run(List&lt;Integer&gt; list) {\\n" +
          "        int sum = 0;\\n" +
          "        list.forEach(x -&gt; sum += x);\\n" +
          "        return sum;\\n" +
          "    }\\n" +
          "}\\n" },
    };
    for (String[] c : cases) {
        System.out.println("== " + c[0] + " ==");
        viet(d, c[0], c[1]);
        lenh(d, "javac", c[0]);
    }
}</code></pre>
<div class="out">== E1.java ==<br>
&gt; javac E1.java<br>
E1.java:2: error: Circle is not abstract and does not override abstract method area() in Shape<br>
class Circle implements Shape { double r = 1; }<br>
^<br>
1 error<br>
(exit code 1)<br>
== E2.java ==<br>
&gt; javac E2.java<br>
E2.java:2: error: area() in Square cannot implement area() in Shape<br>
class Square implements Shape { double a = 2; double area() { return a * a; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
1 error<br>
(exit code 1)<br>
== E3.java ==<br>
&gt; javac E3.java<br>
E3.java:2: error: Animal is abstract; cannot be instantiated<br>
class Zoo { Animal a = new Animal(); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E4.java ==<br>
&gt; javac E4.java<br>
E4.java:2: error: modifier protected not allowed here<br>
&nbsp;&nbsp;&nbsp;&nbsp;protected void open();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E5.java ==<br>
&gt; javac E5.java<br>
E5.java:2: error: cannot assign a value to final variable price<br>
class TV implements Remote { void cheaper() { price = 5; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E6.java ==<br>
&gt; javac E6.java<br>
E6.java:5: error: local variables referenced from a lambda expression must be final or effectively final<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;list.forEach(x -&gt; sum += x);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
</details>
<details><summary>Answers</summary>
<ol>
<li><strong>E1</strong> — a concrete class must implement every abstract method of its interface: add <code>public double area()</code>, or declare <code>Circle</code> abstract (FE20 q2).</li>
<li><strong>E2</strong> — interface methods are public, an implementation cannot narrow that: write <code>public double area()</code> (FE21 q27).</li>
<li><strong>E3</strong> — an abstract class cannot be instantiated: create a concrete subclass, or an anonymous one with <code>new Animal() { void sound() { … } }</code>.</li>
<li><strong>E4</strong> — interface members cannot be <code>protected</code> (or private, on Java 8): remove the modifier (FE20 q10).</li>
<li><strong>E5</strong> — interface fields are <code>final</code>: a constant cannot be reassigned; keep changeable state in the class.</li>
<li><strong>E6</strong> — a lambda (like an anonymous class) may use only effectively final local variables: use a normal <code>for</code> loop to add up.</li>
</ol>
</details>`,
    `<h3>🧪 Bài 6 — Gọi tên luật đứng sau sáu lỗi biên dịch thật (~15 phút)</h3>
<p>Mỗi đoạn phạm một luật của Chương 5. Đọc thông báo thật của JDK 8 và nói, trong một câu, đó là luật nào và sửa thế nào.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/b41e443170141f5cfabf98efb5b4605fe3ee2c0f.svg" alt="Bài 6: thứ mà các đoạn code lẽ ra phải dựng" loading="lazy" /><p class="chu-thich">🧩 Bài 6: thứ mà các đoạn code lẽ ra phải dựng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 6 — what the six snippets should have built
' Mỗi bản đúng thoả một luật: hiện thực mọi phương thức trừu tượng, giữ public, không new một kiểu trừu tượng
interface Shape {
  + area() : double
}
class Circle {
  ~ r : double
  + area() : double
}
class Square {
  ~ a : double
  + area() : double
}
abstract class Animal {
  ~ {abstract} sound() : void
}
class Dog {
  ~ sound() : void
}
interface Remote {
  + price : int = 10 {static, final}
}
Shape &lt;|.. Circle
Shape &lt;|.. Square
Animal &lt;|-- Dog
@enduml</code></pre></details>
<details><summary>Các đoạn code và lỗi thật</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String[][] cases = {
        { "E1.java",
          "interface Shape { double area(); }\\n" +
          "class Circle implements Shape { double r = 1; }\\n" },
        { "E2.java",
          "interface Shape { double area(); }\\n" +
          "class Square implements Shape { double a = 2; double area() { return a * a; } }\\n" },
        { "E3.java",
          "abstract class Animal { abstract void sound(); }\\n" +
          "class Zoo { Animal a = new Animal(); }\\n" },
        { "E4.java",
          "interface Box {\\n" +
          "    protected void open();\\n" +
          "}\\n" },
        { "E5.java",
          "interface Remote { int price = 10; }\\n" +
          "class TV implements Remote { void cheaper() { price = 5; } }\\n" },
        { "E6.java",
          "import java.util.*;\\n" +
          "class Total {\\n" +
          "    int run(List&lt;Integer&gt; list) {\\n" +
          "        int sum = 0;\\n" +
          "        list.forEach(x -&gt; sum += x);\\n" +
          "        return sum;\\n" +
          "    }\\n" +
          "}\\n" },
    };
    for (String[] c : cases) {
        System.out.println("== " + c[0] + " ==");
        viet(d, c[0], c[1]);
        lenh(d, "javac", c[0]);
    }
}</code></pre>
<div class="out">== E1.java ==<br>
&gt; javac E1.java<br>
E1.java:2: error: Circle is not abstract and does not override abstract method area() in Shape<br>
class Circle implements Shape { double r = 1; }<br>
^<br>
1 error<br>
(exit code 1)<br>
== E2.java ==<br>
&gt; javac E2.java<br>
E2.java:2: error: area() in Square cannot implement area() in Shape<br>
class Square implements Shape { double a = 2; double area() { return a * a; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;attempting to assign weaker access privileges; was public<br>
1 error<br>
(exit code 1)<br>
== E3.java ==<br>
&gt; javac E3.java<br>
E3.java:2: error: Animal is abstract; cannot be instantiated<br>
class Zoo { Animal a = new Animal(); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E4.java ==<br>
&gt; javac E4.java<br>
E4.java:2: error: modifier protected not allowed here<br>
&nbsp;&nbsp;&nbsp;&nbsp;protected void open();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E5.java ==<br>
&gt; javac E5.java<br>
E5.java:2: error: cannot assign a value to final variable price<br>
class TV implements Remote { void cheaper() { price = 5; } }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E6.java ==<br>
&gt; javac E6.java<br>
E6.java:5: error: local variables referenced from a lambda expression must be final or effectively final<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;list.forEach(x -&gt; sum += x);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)</div>
</details>
<details><summary>Đáp án</summary>
<ol>
<li><strong>E1</strong> — lớp cụ thể phải hiện thực mọi phương thức trừu tượng của interface: thêm <code>public double area()</code>, hoặc khai báo <code>Circle</code> là abstract (FE20 câu 2).</li>
<li><strong>E2</strong> — phương thức interface là public, bản hiện thực không được thu hẹp: viết <code>public double area()</code> (FE21 câu 27).</li>
<li><strong>E3</strong> — lớp trừu tượng không tạo đối tượng được: tạo một lớp con cụ thể, hoặc một lớp ẩn danh <code>new Animal() { void sound() { … } }</code>.</li>
<li><strong>E4</strong> — thành viên của interface không được là <code>protected</code> (hay private, ở Java 8): bỏ từ khoá đó (FE20 câu 10).</li>
<li><strong>E5</strong> — trường của interface là <code>final</code>: không gán lại được hằng; trạng thái thay đổi được thì để trong lớp.</li>
<li><strong>E6</strong> — lambda (như lớp ẩn danh) chỉ dùng được biến cục bộ thực chất là final: dùng vòng <code>for</code> thường để cộng dồn.</li>
</ol>
</details>`),
    bi(`<h3>🧪 Exercise 7 — Interface or abstract class? A payroll that also pays invoices (~25 min)</h3>
<p>A company pays salaried employees (weekly salary), hourly employees (wage × hours, overtime above 40 hours at 1.5×) and supplier invoices (quantity × unit price). One loop must print every payment and the total. Design it: which type is an interface, which is an abstract class, and why?</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/27f21947ca6b9e4d34f433e3c2f5c68346c55cab.svg" alt="Exercise 7: Payable is the ability; Employee is the family" loading="lazy" /><p class="chu-thich">🧩 Exercise 7: Payable is the ability; Employee is the family</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — an interface for the ability, an abstract class for the family
' Invoice is payable but is not an employee; both kinds fit in one Payable[]
interface Payable {
  + getPaymentAmount() : double
  + describe() : String
  + paymentLine() : String «default»
}
abstract class Employee {
  - name : String
  # Employee(name : String)
  + getName() : String
  + describe() : String
}
class SalariedEmployee {
  - weeklySalary : double
  + getPaymentAmount() : double
}
class HourlyEmployee {
  - wage : double
  - hours : int
  + getPaymentAmount() : double
}
class Invoice {
  - part : String
  - quantity : int
  - unitPrice : double
  + getPaymentAmount() : double
  + describe() : String
}
Payable &lt;|.. Employee
Payable &lt;|.. Invoice
Employee &lt;|-- SalariedEmployee
Employee &lt;|-- HourlyEmployee
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">interface Payable {
    double getPaymentAmount();
    default String paymentLine() { return String.format("%-28s %10.1f", describe(), getPaymentAmount()); }
    String describe();
}

abstract class Employee implements Payable {          // abstract: may leave Payable's method unimplemented
    private final String name;
    protected Employee(String name) { this.name = name; }
    public String getName() { return name; }
    @Override
    public String describe() { return getClass().getSimpleName() + " " + name; }
}

class SalariedEmployee extends Employee {
    private final double weeklySalary;
    SalariedEmployee(String name, double weeklySalary) { super(name); this.weeklySalary = weeklySalary; }
    @Override
    public double getPaymentAmount() { return weeklySalary; }
}

class HourlyEmployee extends Employee {
    private final double wage;
    private final int hours;
    HourlyEmployee(String name, double wage, int hours) { super(name); this.wage = wage; this.hours = hours; }
    @Override
    public double getPaymentAmount() {
        return hours &lt;= 40 ? wage * hours : wage * 40 + wage * 1.5 * (hours - 40);   // overtime x1.5
    }
}

class Invoice implements Payable {                    // NOT an employee, still payable
    private final String part;
    private final int quantity;
    private final double unitPrice;
    Invoice(String part, int quantity, double unitPrice) { this.part = part; this.quantity = quantity; this.unitPrice = unitPrice; }
    @Override
    public double getPaymentAmount() { return quantity * unitPrice; }
    @Override
    public String describe() { return "Invoice " + part + " x" + quantity; }
}</code></pre>
<pre class="trich"><code class="language-java">Payable[] bills = {
    new SalariedEmployee("Lan", 800),
    new HourlyEmployee("Minh", 20, 45),
    new Invoice("keyboard", 3, 25.5),
};
double total = 0;
for (Payable p : bills) {
    System.out.println(p.paymentLine());
    total += p.getPaymentAmount();
}
System.out.printf("%-28s %10.1f%n", "TOTAL", total);</code></pre>
<div class="out">SalariedEmployee Lan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;800.0<br>
HourlyEmployee Minh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;950.0<br>
Invoice keyboard x3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;76.5<br>
TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1826.5</div>
<p>An invoice is not an employee, so it cannot extend <code>Employee</code> — but it must be paid. That shared <strong>ability</strong> is the interface <code>Payable</code>; the shared <strong>state</strong> (name) and behaviour of employees is the abstract class. Note <code>abstract class Employee implements Payable</code> without writing <code>getPaymentAmount()</code>: an abstract class may leave interface methods to its subclasses (FE20 q2's correct answer). Minh's pay: 20 × 40 + 20 × 1.5 × 5 = 950.</p>
</details>
<div class="callout">🧭 <strong>Go further — interviews and Spring Boot</strong>: "abstract class or interface?" is one of the most asked Java fresher questions. Answer with this example: interface for a capability that unrelated classes share (and that a class can have several of); abstract class for a family that shares code and fields. In Spring, services are injected through interfaces (<code>PaymentService</code>) so the implementation can change without touching the controllers.</div>`,
    `<h3>🧪 Bài 7 — Interface hay lớp trừu tượng? Bảng lương trả cả hoá đơn (~25 phút)</h3>
<p>Một công ty trả lương cho nhân viên lương tuần, nhân viên theo giờ (lương giờ × số giờ, quá 40 giờ thì tính 1,5 lần) và trả hoá đơn nhà cung cấp (số lượng × đơn giá). Một vòng lặp phải in mọi khoản trả và tổng cộng. Hãy thiết kế: kiểu nào là interface, kiểu nào là lớp trừu tượng, và vì sao?</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/27f21947ca6b9e4d34f433e3c2f5c68346c55cab.svg" alt="Bài 7: Payable là khả năng; Employee là họ hàng" loading="lazy" /><p class="chu-thich">🧩 Bài 7: Payable là khả năng; Employee là họ hàng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 7 — an interface for the ability, an abstract class for the family
' Invoice phải trả tiền nhưng không phải nhân viên; cả hai loại vừa với một Payable[]
interface Payable {
  + getPaymentAmount() : double
  + describe() : String
  + paymentLine() : String «default»
}
abstract class Employee {
  - name : String
  # Employee(name : String)
  + getName() : String
  + describe() : String
}
class SalariedEmployee {
  - weeklySalary : double
  + getPaymentAmount() : double
}
class HourlyEmployee {
  - wage : double
  - hours : int
  + getPaymentAmount() : double
}
class Invoice {
  - part : String
  - quantity : int
  - unitPrice : double
  + getPaymentAmount() : double
  + describe() : String
}
Payable &lt;|.. Employee
Payable &lt;|.. Invoice
Employee &lt;|-- SalariedEmployee
Employee &lt;|-- HourlyEmployee
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">interface Payable {
    double getPaymentAmount();
    default String paymentLine() { return String.format("%-28s %10.1f", describe(), getPaymentAmount()); }
    String describe();
}

abstract class Employee implements Payable {          // abstract: được phép chưa hiện thực phương thức của Payable
    private final String name;
    protected Employee(String name) { this.name = name; }
    public String getName() { return name; }
    @Override
    public String describe() { return getClass().getSimpleName() + " " + name; }
}

class SalariedEmployee extends Employee {
    private final double weeklySalary;
    SalariedEmployee(String name, double weeklySalary) { super(name); this.weeklySalary = weeklySalary; }
    @Override
    public double getPaymentAmount() { return weeklySalary; }
}

class HourlyEmployee extends Employee {
    private final double wage;
    private final int hours;
    HourlyEmployee(String name, double wage, int hours) { super(name); this.wage = wage; this.hours = hours; }
    @Override
    public double getPaymentAmount() {
        return hours &lt;= 40 ? wage * hours : wage * 40 + wage * 1.5 * (hours - 40);   // tăng ca x1.5
    }
}

class Invoice implements Payable {                    // KHÔNG phải nhân viên, nhưng vẫn phải trả tiền
    private final String part;
    private final int quantity;
    private final double unitPrice;
    Invoice(String part, int quantity, double unitPrice) { this.part = part; this.quantity = quantity; this.unitPrice = unitPrice; }
    @Override
    public double getPaymentAmount() { return quantity * unitPrice; }
    @Override
    public String describe() { return "Invoice " + part + " x" + quantity; }
}</code></pre>
<pre class="trich"><code class="language-java">Payable[] bills = {
    new SalariedEmployee("Lan", 800),
    new HourlyEmployee("Minh", 20, 45),
    new Invoice("keyboard", 3, 25.5),
};
double total = 0;
for (Payable p : bills) {
    System.out.println(p.paymentLine());
    total += p.getPaymentAmount();
}
System.out.printf("%-28s %10.1f%n", "TOTAL", total);</code></pre>
<div class="out">SalariedEmployee Lan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;800.0<br>
HourlyEmployee Minh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;950.0<br>
Invoice keyboard x3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;76.5<br>
TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1826.5</div>
<p>Hoá đơn không phải nhân viên, nên nó không thể extends <code>Employee</code> — nhưng nó vẫn phải được trả tiền. <strong>Khả năng</strong> chung đó là interface <code>Payable</code>; <strong>trạng thái</strong> chung (tên) và hành vi chung của nhân viên là lớp trừu tượng. Để ý <code>abstract class Employee implements Payable</code> mà không viết <code>getPaymentAmount()</code>: lớp trừu tượng được để phương thức của interface cho lớp con viết (đáp án đúng của FE20 câu 2). Lương của Minh: 20 × 40 + 20 × 1,5 × 5 = 950.</p>
</details>
<div class="callout">🧭 <strong>Đi tiếp — phỏng vấn và Spring Boot</strong>: "lớp trừu tượng hay interface?" là một trong các câu hỏi phỏng vấn Java fresher hay gặp nhất. Hãy trả lời bằng ví dụ này: interface cho một khả năng mà các lớp không liên quan cùng có (và một lớp có thể có nhiều khả năng); lớp trừu tượng cho một họ hàng dùng chung code và trường. Trong Spring, service được tiêm qua interface (<code>PaymentService</code>) để đổi được cài đặt mà không phải đụng vào controller.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>interface</strong></td><td>giao diện (interface)</td><td>A reference type listing what a class promises to do: abstract methods, constants, and since Java 8 default and static methods.</td></tr>
<tr><td><strong><code>implements</code></strong></td><td>hiện thực</td><td>Keyword with which a class promises to provide the methods of one or more interfaces.</td></tr>
<tr><td><strong>abstract class</strong></td><td>lớp trừu tượng</td><td>A class marked abstract: cannot be instantiated, may have fields, constructors, concrete and abstract methods.</td></tr>
<tr><td><strong>abstract method</strong></td><td>phương thức trừu tượng</td><td>A method declared without a body; every concrete subclass must implement it.</td></tr>
<tr><td><strong>concrete class</strong></td><td>lớp cụ thể</td><td>A class with no missing method bodies, so <code>new</code> works on it.</td></tr>
<tr><td><strong>constant (interface field)</strong></td><td>hằng (trường của interface)</td><td>Every interface field is implicitly public static final and must be given a value.</td></tr>
<tr><td><strong>default method</strong></td><td>phương thức mặc định</td><td>An interface method with a body (Java 8); implementers inherit it and may override it.</td></tr>
<tr><td><strong>static interface method</strong></td><td>phương thức static của interface</td><td>Belongs to the interface; called only as <code>InterfaceName.method()</code>.</td></tr>
<tr><td><strong>multiple inheritance of type</strong></td><td>đa kế thừa kiểu</td><td>A class can implement several interfaces, so one object can be seen through several types.</td></tr>
<tr><td><strong>diamond problem</strong></td><td>vấn đề hình thoi</td><td>Ambiguity when two parents provide the same member; Java forbids it for classes and forces an override for defaults.</td></tr>
<tr><td><strong>template method</strong></td><td>phương thức khuôn mẫu</td><td>A concrete method of an abstract class that fixes the steps and calls abstract methods for the details.</td></tr>
<tr><td><strong>nested / inner class</strong></td><td>lớp lồng / lớp trong</td><td>A class declared inside another; an inner (non-static) one belongs to an outer object.</td></tr>
<tr><td><strong>anonymous class</strong></td><td>lớp ẩn danh</td><td>A class without a name, declared and instantiated in one expression, used once.</td></tr>
<tr><td><strong>lambda expression</strong></td><td>biểu thức lambda</td><td>Java 8 shorthand for implementing an interface that has exactly one abstract method.</td></tr>
<tr><td><strong>effectively final</strong></td><td>thực chất là final</td><td>A local variable never reassigned; only such variables can be used inside lambdas and anonymous classes.</td></tr>
<tr><td><strong><code>Comparable</code> / <code>Comparator</code></strong></td><td>so sánh được / bộ so sánh</td><td>compareTo gives a class its natural order; a Comparator object gives any other order.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>interface</strong></td><td>giao diện (interface)</td><td>Kiểu tham chiếu liệt kê những gì một lớp hứa sẽ làm: phương thức trừu tượng, hằng, và từ Java 8 có thêm phương thức default và static.</td></tr>
<tr><td><strong><code>implements</code></strong></td><td>hiện thực</td><td>Từ khoá để một lớp hứa cung cấp các phương thức của một hay nhiều interface.</td></tr>
<tr><td><strong>abstract class</strong></td><td>lớp trừu tượng</td><td>Lớp đánh dấu abstract: không tạo đối tượng được, có thể có trường, constructor, phương thức cụ thể và trừu tượng.</td></tr>
<tr><td><strong>abstract method</strong></td><td>phương thức trừu tượng</td><td>Phương thức khai báo không có thân; mọi lớp con cụ thể phải hiện thực nó.</td></tr>
<tr><td><strong>concrete class</strong></td><td>lớp cụ thể</td><td>Lớp không còn thiếu thân phương thức nào, nên dùng <code>new</code> được.</td></tr>
<tr><td><strong>constant (interface field)</strong></td><td>hằng (trường của interface)</td><td>Mọi trường của interface ngầm là public static final và phải được gán giá trị.</td></tr>
<tr><td><strong>default method</strong></td><td>phương thức mặc định</td><td>Phương thức interface có thân (Java 8); lớp hiện thực được kế thừa và có thể ghi đè.</td></tr>
<tr><td><strong>static interface method</strong></td><td>phương thức static của interface</td><td>Thuộc về interface; chỉ gọi được dạng <code>TênInterface.phươngThức()</code>.</td></tr>
<tr><td><strong>multiple inheritance of type</strong></td><td>đa kế thừa kiểu</td><td>Một lớp hiện thực được nhiều interface, nên một đối tượng nhìn được qua nhiều kiểu.</td></tr>
<tr><td><strong>diamond problem</strong></td><td>vấn đề hình thoi</td><td>Sự mơ hồ khi hai cha cùng cung cấp một thành viên; Java cấm với lớp và buộc ghi đè với default.</td></tr>
<tr><td><strong>template method</strong></td><td>phương thức khuôn mẫu</td><td>Phương thức cụ thể của lớp trừu tượng cố định các bước và gọi phương thức trừu tượng cho phần chi tiết.</td></tr>
<tr><td><strong>nested / inner class</strong></td><td>lớp lồng / lớp trong</td><td>Lớp khai báo bên trong lớp khác; lớp trong (không static) thuộc về một đối tượng bên ngoài.</td></tr>
<tr><td><strong>anonymous class</strong></td><td>lớp ẩn danh</td><td>Lớp không tên, khai báo và tạo đối tượng trong một biểu thức, dùng một lần.</td></tr>
<tr><td><strong>lambda expression</strong></td><td>biểu thức lambda</td><td>Cách viết tắt của Java 8 để hiện thực một interface có đúng một phương thức trừu tượng.</td></tr>
<tr><td><strong>effectively final</strong></td><td>thực chất là final</td><td>Biến cục bộ không bao giờ bị gán lại; chỉ biến như vậy mới dùng được trong lambda và lớp ẩn danh.</td></tr>
<tr><td><strong><code>Comparable</code> / <code>Comparator</code></strong></td><td>so sánh được / bộ so sánh</td><td>compareTo cho lớp một thứ tự tự nhiên; một đối tượng Comparator cho mọi thứ tự khác.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 5</h2>
<ol>
<li><strong>Neither an interface nor an abstract class can be <code>new</code>-ed</strong> — you create a concrete subclass (named or anonymous).</li>
<li><strong>Interface fields are <code>public static final</code> constants;</strong> interface methods are <code>public</code>, so every implementation must be <code>public</code>.</li>
<li><strong>Java 8 interfaces may have <code>default</code> and <code>static</code> methods;</strong> private interface methods need Java 9 — not in the PE.</li>
<li><strong>A class with an abstract method must be abstract;</strong> an abstract class need not have one, and it may leave interface methods unimplemented.</li>
<li><strong>A concrete subclass implements every inherited abstract method</strong> — or the build fails with "is not abstract and does not override abstract method".</li>
<li><strong>One class extends one class but implements many interfaces;</strong> clashing defaults must be overridden (<code>X.super.m()</code>), and a superclass method beats a default ("class wins").</li>
<li><strong>Interface for an ability, abstract class for a family</strong> — <code>Payable</code> versus <code>Employee</code>.</li>
<li><strong>Anonymous classes and lambdas implement on the spot;</strong> a lambda needs exactly one abstract method, both may only read effectively final locals.</li>
</ol>
<p>Next: the Chapter 5 quiz, then Progress Test 1 — it covers Chapters 1–5. Before it, redo exercise 1 here and one 10-mark paper (PE3 or PE5) in the <a href="/exam?course=PRO192">Exam Room</a> against the clock.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 5</h2>
<ol>
<li><strong>Cả interface lẫn lớp trừu tượng đều không <code>new</code> được</strong> — bạn tạo một lớp con cụ thể (có tên hoặc ẩn danh).</li>
<li><strong>Trường của interface là hằng <code>public static final</code>;</strong> phương thức interface là <code>public</code>, nên mọi bản hiện thực phải <code>public</code>.</li>
<li><strong>Interface Java 8 có thể có phương thức <code>default</code> và <code>static</code>;</strong> phương thức private trong interface cần Java 9 — không dùng trong PE.</li>
<li><strong>Lớp có phương thức trừu tượng thì phải là abstract;</strong> lớp abstract thì không cần có cái nào, và được phép chưa hiện thực phương thức của interface.</li>
<li><strong>Lớp con cụ thể hiện thực mọi phương thức trừu tượng được kế thừa</strong> — không thì build hỏng với "is not abstract and does not override abstract method".</li>
<li><strong>Một lớp extends một lớp nhưng implements nhiều interface;</strong> các default va nhau phải được ghi đè (<code>X.super.m()</code>), và phương thức của lớp cha thắng default ("class wins").</li>
<li><strong>Interface cho khả năng, lớp trừu tượng cho họ hàng</strong> — <code>Payable</code> so với <code>Employee</code>.</li>
<li><strong>Lớp ẩn danh và lambda hiện thực tại chỗ;</strong> lambda cần đúng một phương thức trừu tượng, cả hai chỉ đọc được biến cục bộ thực chất là final.</li>
</ol>
<p>Tiếp theo: quiz Chương 5, rồi Progress Test 1 — bao gồm Chương 1–5. Trước đó, làm lại bài 1 ở đây và một đề 10 điểm (PE3 hoặc PE5) trong <a href="/exam?course=PRO192">Exam Room</a> có bấm giờ.</p>`),
  ].join('\n'),
};

/* ───────── Lab 5 — 🏗️ CT Library: abstract classes and interfaces (abstract LibraryItem, IBookRepository interface, IFeePolicy) ───────── */
const L_lab5 = {
  title: 'Lab 5 — 🏗️ CT Library: abstract classes and interfaces (abstract LibraryItem, IBookRepository interface, IFeePolicy)|||Lab 5 — 🏗️ CT Library: lớp trừu tượng và interface (LibraryItem abstract, interface IBookRepository, IFeePolicy)',
  slug: 'pro192-lab-5-truu-tuong-va-interface',
  type: 'VIDEO',
  description: 'Lab 5 của dự án CT Library (sau Chương 5), chuẩn review LAB211: LibraryItem thành lớp trừu tượng với sáu phương thức trừu tượng (không ai tạo được "tài liệu chung chung", lớp con quên một phương thức là lỗi biên dịch); kho sách tách thành interface IBookRepository và bản cài đầu tiên InMemoryBookRepository — controller chỉ biết interface, một dòng duy nhất biết nơi lưu, để Lab 9 cắm kho tệp mà Main không đổi; phí trễ theo chính sách IFeePolicy (mẫu Strategy: sinh viên giảm 50%, cán bộ miễn 2 ngày đầu). Kèm bốn lỗi javac thật, bẫy hằng trong interface, lớp ẩn danh. Starter + đáp án tải về, bộ chấm kiểu PE 163 dòng, rubric 10 điểm.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lab 5 · CT Library</span>
<h2>Lab 5 — abstract classes and interfaces</h2>
<p class="lead">Chapter 5 gave you two ways to say "this is a contract": an <code>abstract</code> class (a parent nobody can instantiate, with methods every child must write) and an <code>interface</code> (a list of abilities any class can sign). Lab 5 answers three review comments on Lab 4 with exactly those tools — and builds the most important seam of CT Library: the controller stops caring <em>where</em> the books are stored.</p>
<p>The starter is a fresh project: Lab 4 finished, the new interfaces given, five TODOs marked <code>TODO Lab 5.x</code>. Plan about <strong>2.5 hours</strong>.</p>`,
    `<span class="eyebrow">Chương 5 · Lab 5 · CT Library</span>
<h2>Lab 5 — lớp trừu tượng và interface</h2>
<p class="lead">Chương 5 cho bạn hai cách nói "đây là một hợp đồng": lớp <code>abstract</code> (lớp cha không ai tạo được đối tượng, có những phương thức mọi lớp con buộc phải viết) và <code>interface</code> (danh sách khả năng mà lớp nào cũng ký được). Lab 5 trả lời ba nhận xét review về Lab 4 bằng đúng hai công cụ đó — và dựng đường nối quan trọng nhất của CT Library: controller thôi quan tâm sách được lưu <em>ở đâu</em>.</p>
<p>Starter là một dự án sạch: Lab 4 đã xong, các interface mới cho sẵn, năm TODO đánh dấu <code>TODO Lab 5.x</code>. Dành khoảng <strong>2,5 giờ</strong>.</p>`),
    bi(`<h2>📑 Slide by slide — PRO192 Lab 5 (16 slides)</h2>
<p>The deck of this lab, made for CT Library (it is not a school deck). Each slide is followed by its key idea and the explanation; every piece of code and every output on the slides comes from the real project, compiled with <code>javac --release 8</code> and run — the same runs you find in the steps below.</p>`,
    `<h2>📑 Học theo từng slide — PRO192 Lab 5 (16 slide)</h2>
<p>Bộ slide của lab này, dựng riêng cho CT Library (không phải slide của trường). Dưới mỗi slide là ý chính và lời giảng; mọi đoạn code, mọi output trên slide đều lấy từ dự án thật, biên dịch bằng <code>javac --release 8</code> rồi chạy — đúng những lần chạy bạn gặp lại ở các bước bên dưới.</p>`),
    walk('lab5', [
      [1, 'Lab 5 — CT Library: abstract classes and interfaces',
        `<p class="y-chinh">🎯 Lab 5 = Chapter 5 on a real codebase: an abstract parent, a repository contract, and a fee policy contract.</p>
<p>The output barely changes — that is the point. This lab is about the shape of the code: what javac now refuses, and which future changes become one-line changes.</p>`,
        `<p class="y-chinh">🎯 Lab 5 = Chương 5 trên một bộ mã thật: một lớp cha trừu tượng, một hợp đồng cho kho sách, một hợp đồng cho chính sách phí.</p>
<p>Output gần như không đổi — đó chính là ý. Lab này nói về hình dạng của code: javac giờ từ chối những gì, và thay đổi nào trong tương lai trở thành thay đổi một dòng.</p>`],
      [2, 'Ticket CTL-5 — three review comments on Lab 4',
        `<p class="y-chinh">🎯 The ticket is a code review: a "generic item" with 0 loan days can be created, the controller is glued to a list in memory, and students and staff should not pay the same fee.</p>
<p>Done means: PASS 163/163, <code>lint.py</code> silent (the starter shows 1 violation), <code>new LibraryItem(…)</code> anywhere is a compile error, the controller's field has the interface type, and a third fee policy would be one new class.</p>`,
        `<p class="y-chinh">🎯 Ticket là một lần review code: tạo được "tài liệu chung chung" 0 ngày mượn, controller dính chặt vào một danh sách trong bộ nhớ, và sinh viên với cán bộ không nên trả cùng mức phí.</p>
<p>Xong nghĩa là: PASS 163/163, <code>lint.py</code> im lặng (starter báo 1 vi phạm), <code>new LibraryItem(…)</code> ở bất kỳ đâu là lỗi biên dịch, trường của controller mang kiểu interface, và chính sách phí thứ ba chỉ là thêm một lớp.</p>`],
      [3, "What was wrong with Lab 4's parent class",
        `<p class="y-chinh">🎯 Lab 4's <code>LibraryItem</code> had to answer the six questions with meaningless defaults: "Tai lieu", "I", 0 days, 0 đ, an empty detail, the id as key.</p>
<p>The real danger is not the object nobody creates — it is the subclass that <em>forgets</em> one override: it compiles and silently returns those defaults, the AudioBook trap of Lab 4 moved into the model. <code>abstract</code> fixes both: no generic object can exist, and every subclass must implement all six methods or javac refuses.</p>`,
        `<p class="y-chinh">🎯 <code>LibraryItem</code> của Lab 4 phải trả lời sáu câu hỏi bằng giá trị mặc định vô nghĩa: "Tai lieu", "I", 0 ngày, 0 đồng, chi tiết rỗng, khoá là mã.</p>
<p>Nguy hiểm thật không phải đối tượng chẳng ai tạo — mà là lớp con <em>quên</em> một bản ghi đè: vẫn biên dịch và lặng lẽ trả các giá trị đó, đúng bẫy AudioBook của Lab 4 dời vào model. <code>abstract</code> sửa cả hai: không đối tượng chung chung nào tồn tại được, và mọi lớp con buộc phải cài đủ sáu phương thức, không thì javac từ chối.</p>`],
      [4, 'TODO 5.1 — abstract LibraryItem',
        `<p class="y-chinh">🎯 <code>public abstract class LibraryItem</code>, and the six questions become <code>public abstract …;</code> — a signature with no body.</p>
<p>An abstract class still has fields, getters, setters and a constructor: <code>Book</code> calls it through <code>super(...)</code> exactly as in Lab 4. The empty JavaBean constructor is gone — nobody may call <code>new LibraryItem()</code> anyway — and <code>lint.py</code> agrees: a concrete model class without it is a <code>[JAVABEAN]</code> violation (the starter's only one), an abstract one is exempt.</p>`,
        `<p class="y-chinh">🎯 <code>public abstract class LibraryItem</code>, và sáu câu hỏi thành <code>public abstract …;</code> — chữ ký không có thân.</p>
<p>Lớp trừu tượng vẫn có trường, getter, setter và constructor: <code>Book</code> gọi nó qua <code>super(...)</code> y như Lab 4. Constructor rỗng kiểu JavaBean bỏ đi — đằng nào cũng không ai được gọi <code>new LibraryItem()</code> — và <code>lint.py</code> đồng ý: lớp model cụ thể thiếu nó là vi phạm <code>[JAVABEAN]</code> (vi phạm duy nhất của starter), lớp trừu tượng thì được miễn.</p>`],
      [5, 'What javac now refuses — three real errors',
        `<p class="y-chinh">🎯 Three mistakes planted in the solution (<code>bay/truu-tuong</code>) become three compile errors: a child missing one abstract method, an implementation missing one interface method, and <code>new</code> on an abstract class.</p>
<p>Read the first two carefully: "is not abstract and does not override abstract method …" names the missing method and where it was promised. That message is the contract working — in Lab 4 the same mistakes compiled and ran wrong.</p>`,
        `<p class="y-chinh">🎯 Ba lỗi cài vào đáp án (<code>bay/truu-tuong</code>) thành ba lỗi biên dịch: lớp con thiếu một phương thức trừu tượng, bản cài thiếu một phương thức của interface, và <code>new</code> một lớp trừu tượng.</p>
<p>Đọc kỹ hai lỗi đầu: "is not abstract and does not override abstract method …" nêu đúng phương thức còn thiếu và nơi nó được hứa. Thông báo đó chính là hợp đồng đang làm việc — ở Lab 4 cùng những lỗi này vẫn biên dịch và chạy sai.</p>`],
      [6, 'Abstract class or interface? (Chapter 5)',
        `<p class="y-chinh">🎯 An abstract class shares code inside one family (is-a); an interface lets unrelated classes be swapped behind one name (can-do).</p>
<p>Concretely: an abstract class can have fields, constructors and method bodies, and a class extends only one; an interface has only constants and (until Java 8's default/static) abstract methods, and a class may implement many. CT Library uses both for what each is good at: <code>LibraryItem</code> shares id/title/year/copies, <code>IBookRepository</code> and <code>IFeePolicy</code> are swap points.</p>`,
        `<p class="y-chinh">🎯 Lớp trừu tượng chia sẻ code trong một gia đình (is-a); interface cho những lớp không liên quan thay nhau được dưới một cái tên (can-do).</p>
<p>Cụ thể: lớp trừu tượng có trường, constructor và thân phương thức, và một lớp chỉ extends được một lớp; interface chỉ có hằng và (trước default/static của Java 8) phương thức trừu tượng, và một lớp implements được nhiều interface. CT Library dùng mỗi thứ đúng sở trường: <code>LibraryItem</code> chia sẻ mã/tên/năm/số bản, <code>IBookRepository</code> và <code>IFeePolicy</code> là các điểm thay thế.</p>`],
      [7, 'The seam — the controller talks to a contract',
        `<p class="y-chinh">🎯 <code>BookController</code> holds a field of type <code>IBookRepository</code> (the interface); <code>InMemoryBookRepository</code> implements it today, <code>FileBookRepository</code> will in Lab 9.</p>
<p>The reviewer's layer rules still hold: the controller keeps the repository and does the CRUD; <code>BookService</code> keeps no repository — only its fee policies. Only one line in the controller's constructor names the implementation, so swapping the storage in Lab 9 touches that line, never <code>Main</code>. Later the same seam takes a PostgreSQL implementation.</p>`,
        `<p class="y-chinh">🎯 <code>BookController</code> giữ một trường kiểu <code>IBookRepository</code> (interface); hôm nay <code>InMemoryBookRepository</code> cài nó, Lab 9 sẽ có <code>FileBookRepository</code>.</p>
<p>Luật tầng của thầy vẫn giữ: controller giữ repository và làm CRUD; <code>BookService</code> không giữ repository — chỉ giữ các chính sách phí. Chỉ một dòng trong constructor của controller gọi tên bản cài, nên đổi kho ở Lab 9 chỉ chạm dòng đó, không bao giờ chạm <code>Main</code>. Về sau chính đường nối này nhận bản cài PostgreSQL.</p>`],
      [8, 'TODO 5.2 — the contract and its first implementation',
        `<p class="y-chinh">🎯 <code>IBookRepository</code> lists seven methods (given); <code>InMemoryBookRepository implements IBookRepository</code> and puts <code>@Override</code> on each.</p>
<p>The name follows the reviewer's checklist (item 1.3): an interface starts with <code>I</code> — <code>IBookRepository</code>, <code>IFeePolicy</code>, like <code>ISortStrategy</code> in the solved LAB211 sample — while the classes that implement it keep plain names (<code>InMemoryBookRepository</code>). Interface methods are <code>public abstract</code> without saying it, so the implementation must keep them <code>public</code>. The class body is the Lab 4 repository, unchanged: it just signs the contract. Forget one method and javac names it (slide 5).</p>`,
        `<p class="y-chinh">🎯 <code>IBookRepository</code> liệt kê bảy phương thức (cho sẵn); <code>InMemoryBookRepository implements IBookRepository</code> và đặt <code>@Override</code> trên từng cái.</p>
<p>Tên đặt theo tờ checklist của thầy (mục 1.3): interface bắt đầu bằng <code>I</code> — <code>IBookRepository</code>, <code>IFeePolicy</code>, như <code>ISortStrategy</code> trong bài mẫu LAB211 — còn lớp cài đặt giữ tên trơn (<code>InMemoryBookRepository</code>). Phương thức của interface ngầm là <code>public abstract</code>, nên bản cài phải giữ <code>public</code>. Thân lớp là repository của Lab 4, không đổi: nó chỉ ký hợp đồng. Quên một phương thức thì javac gọi đúng tên (slide 5).</p>`],
      [9, 'TODO 5.3 — one line knows where the books live',
        `<p class="y-chinh">🎯 Declare the controller's field with the interface type; keep <code>new InMemoryBookRepository()</code> in the constructor — the only line that knows the storage.</p>
<p>It compiles because a class that implements <code>IBookRepository</code> is-a <code>IBookRepository</code>: the assignment is an upcast, like <code>LibraryItem item = new Dvd()</code>. The real run of <code>LabDoiKho</code> shows the same client code on two repositories; in Lab 9 the second one writes <code>books.csv</code> for real.</p>`,
        `<p class="y-chinh">🎯 Khai trường của controller bằng kiểu interface; giữ <code>new InMemoryBookRepository()</code> trong constructor — dòng duy nhất biết nơi lưu.</p>
<p>Biên dịch được vì một lớp cài <code>IBookRepository</code> là một <code>IBookRepository</code>: phép gán là ép lên, như <code>LibraryItem item = new Dvd()</code>. Lần chạy thật <code>LabDoiKho</code> cho thấy cùng một đoạn code chạy trên hai kho; ở Lab 9 kho thứ hai ghi <code>books.csv</code> thật.</p>`],
      [10, 'IFeePolicy — the Strategy pattern in one interface',
        `<p class="y-chinh">🎯 <code>IFeePolicy</code> (name + <code>calculateFee</code>) has two implementations; <code>BookService</code> keeps them in an <code>ArrayList&lt;IFeePolicy&gt;</code> and picks one by the borrower type.</p>
<p>Told with the reviewer's four elements: <strong>Name</strong> Strategy (Behavioral). <strong>Problem</strong>: one fee rule per kind of borrower, with more coming. <strong>Solution</strong>: each rule is a class behind one interface. <strong>Consequences</strong>: a new borrower type is a new class plus one line in the constructor and no <code>if</code> in the formula — at the cost of more, smaller classes.</p>`,
        `<p class="y-chinh">🎯 <code>IFeePolicy</code> (tên + <code>calculateFee</code>) có hai bản cài; <code>BookService</code> giữ chúng trong một <code>ArrayList&lt;IFeePolicy&gt;</code> và chọn theo loại người mượn.</p>
<p>Kể theo bốn yếu tố thầy hay hỏi: <strong>Tên</strong> Strategy (nhóm Behavioral). <strong>Vấn đề</strong>: mỗi loại người mượn một luật phí, và sẽ còn thêm. <strong>Giải pháp</strong>: mỗi luật là một lớp sau một interface. <strong>Hệ quả</strong>: thêm loại người mượn là thêm một lớp cộng một dòng trong constructor, không thêm <code>if</code> vào công thức — đổi lại có nhiều lớp nhỏ hơn.</p>`],
      [11, 'TODO 5.4 and 5.5 — two bodies, two rules',
        `<p class="y-chinh">🎯 Student: full fee then minus 50%; staff: the first 2 late days are free, the rest at full price.</p>
<p>Real output for a book 6 days late (12,000 đ full): the student pays 6,000, the staff member 8,000. A DVD 1 day late (5,000 đ) costs staff 0. Order matters in integer arithmetic: <code>fullFee * 50 / 100</code> multiplies first; <code>fullFee * (50 / 100)</code> is always 0 because <code>50 / 100</code> is 0 in <code>int</code>.</p>`,
        `<p class="y-chinh">🎯 Sinh viên: phí đầy đủ rồi giảm 50%; cán bộ: 2 ngày trễ đầu được miễn, phần còn lại tính đủ.</p>
<p>Output thật với một cuốn sách trễ 6 ngày (đủ là 12.000 đ): sinh viên trả 6.000, cán bộ trả 8.000. Một DVD trễ 1 ngày (5.000 đ) thì cán bộ trả 0. Thứ tự rất quan trọng với số nguyên: <code>fullFee * 50 / 100</code> nhân trước; <code>fullFee * (50 / 100)</code> luôn bằng 0 vì <code>50 / 100</code> là 0 với <code>int</code>.</p>`],
      [12, 'One request through the layers: "9 — late fee"',
        `<p class="y-chinh">🎯 Main reads and checks the input, the controller asks the repository <em>interface</em> for a copy, the service picks the borrower's <em>policy</em>, the view prints two lines.</p>
<p>Two interfaces sit on that path, and each hides one decision: the controller does not know where the item is stored, the service does not know which fee rule it is running. That is what "depend on abstractions" (the D of SOLID) looks like in a console app.</p>`,
        `<p class="y-chinh">🎯 Main đọc và kiểm dữ liệu nhập, controller hỏi <em>interface</em> kho lấy một bản sao, service chọn <em>chính sách</em> của người mượn, view in hai dòng.</p>
<p>Trên đường đi có hai interface, mỗi cái giấu một quyết định: controller không biết tài liệu nằm ở đâu, service không biết đang chạy luật phí nào. Đó là hình dạng của "phụ thuộc vào trừu tượng" (chữ D trong SOLID) trong một ứng dụng console.</p>`],
      [13, 'Trap: a "field" in an interface is a constant',
        `<p class="y-chinh">🎯 Every variable declared in an interface is <code>public static final</code>: assigning to it is a compile error.</p>
<p>The project <code>bay/hang-interface</code> declares <code>int MAX_ITEMS = 500;</code> in <code>IBookRepository</code> and tries <code>MAX_ITEMS = 1000;</code> in the implementation. javac 21 says "cannot assign a value to static final variable"; the JDK 8 javac of the exam room says "cannot assign a value to final variable MAX_ITEMS" (checked on a real JDK 8). An interface describes abilities, not state — numbers belong in <code>Constants</code>.</p>`,
        `<p class="y-chinh">🎯 Mọi biến khai trong interface đều là <code>public static final</code>: gán lại là lỗi biên dịch.</p>
<p>Dự án <code>bay/hang-interface</code> khai <code>int MAX_ITEMS = 500;</code> trong <code>IBookRepository</code> rồi thử <code>MAX_ITEMS = 1000;</code> ở bản cài. javac 21 báo "cannot assign a value to static final variable"; javac JDK 8 của phòng thi báo "cannot assign a value to final variable MAX_ITEMS" (đã kiểm trên JDK 8 thật). Interface mô tả khả năng, không giữ trạng thái — con số thì nằm ở <code>Constants</code>.</p>`],
      [14, 'Anonymous classes — you have used one since Lab 1',
        `<p class="y-chinh">🎯 The <code>new Comparator&lt;BookResponseDTO&gt;() { … }</code> in <code>sortByTitle</code> is an anonymous class: a class with no name that implements an interface on the spot.</p>
<p>javac still writes a real class file for it, named <code>BookService$1.class</code>; in <code>LabChinhSach</code> the third fee policy is written the same way and <code>getClass().getName()</code> prints <code>LabChinhSach$1</code>. Useful for a one-off rule; a rule you keep (Student, Staff) deserves a named class.</p>`,
        `<p class="y-chinh">🎯 <code>new Comparator&lt;BookResponseDTO&gt;() { … }</code> trong <code>sortByTitle</code> là một lớp ẩn danh: lớp không tên cài một interface ngay tại chỗ.</p>
<p>javac vẫn ghi ra một tệp class thật cho nó, tên <code>BookService$1.class</code>; trong <code>LabChinhSach</code> chính sách phí thứ ba viết cùng cách và <code>getClass().getName()</code> in ra <code>LabChinhSach$1</code>. Hợp với luật dùng một lần; luật giữ lâu (Student, Staff) xứng đáng một lớp có tên.</p>`],
      [15, 'Green: PASS 163/163 and a silent reviewer',
        `<p class="y-chinh">🎯 Green = the grader at 163/163 and <code>lint.py</code> silent; only TODO 5.4 and 5.5 change the output.</p>
<p>A good order: 5.1 (lint becomes silent), 5.2 (<code>implements</code> + seven <code>@Override</code>), 5.3 (the field type — still compiles only if 5.2 is done), then 5.4 and 5.5 until <code>check.sh</code> passes. 5.1–5.3 are design work the reviewer checks by reading and with javac, like in LAB211.</p>`,
        `<p class="y-chinh">🎯 Xanh = bộ chấm 163/163 và <code>lint.py</code> im lặng; chỉ TODO 5.4 và 5.5 làm đổi output.</p>
<p>Thứ tự nên làm: 5.1 (lint im lặng), 5.2 (<code>implements</code> + bảy <code>@Override</code>), 5.3 (kiểu của trường — chỉ biên dịch được khi đã xong 5.2), rồi 5.4 và 5.5 tới khi <code>check.sh</code> qua. 5.1–5.3 là việc thiết kế, thầy kiểm bằng cách đọc và bằng javac, đúng như LAB211.</p>`],
      [16, 'Rubric — 10 points, PE style',
        `<p class="y-chinh">🎯 Design carries half the points here, because the output barely moves; the oral question is the classic "abstract class or interface?".</p>
<p>Answer in two sentences: one family sharing code ⇒ abstract class; interchangeable abilities across classes ⇒ interface. Then point at <code>LibraryItem</code> and at <code>IBookRepository</code> in your own project.</p>`,
        `<p class="y-chinh">🎯 Ở lab này thiết kế chiếm nửa số điểm, vì output gần như không đổi; câu vấn đáp là câu kinh điển "lớp trừu tượng hay interface?".</p>
<p>Trả lời bằng hai câu: một gia đình dùng chung code ⇒ lớp trừu tượng; khả năng thay thế được giữa các lớp ⇒ interface. Rồi chỉ vào <code>LibraryItem</code> và <code>IBookRepository</code> trong chính dự án của bạn.</p>`],
    ]),
    bi(`<h2>1. The ticket</h2>
<div class="callout"><p><strong>CTL-5 · CT Library · priority: medium.</strong> "Review notes on Lab 4: (1) someone can write <code>new LibraryItem()</code> — an item with 0 loan days must not exist; (2) the controller is welded to an <code>ArrayList</code> in memory, and in a few weeks we save to files, later to PostgreSQL — I do not want to rewrite the controller each time; (3) the board decided students get 50% off late fees and staff get 2 free late days. Option 9 must ask who is borrowing." — the team lead</p></div>
<table>
<thead><tr><th>You need</th><th>From</th></tr></thead>
<tbody>
<tr><td>interfaces: why, how to write, implement, extend</td><td>5.A (pro10 slides 12–17)</td></tr>
<tr><td>abstract classes and abstract methods</td><td>5.A (pro10 slides 18–19), 5.A-2 (slides 20–22)</td></tr>
<tr><td>nested and anonymous classes</td><td>5.A-2 (pro10 slides 23–27)</td></tr>
<tr><td>upcasting, polymorphism</td><td>Chapter 4, Lab 4</td></tr>
</tbody>
</table>`,
    `<h2>1. Ticket</h2>
<div class="callout"><p><strong>CTL-5 · CT Library · ưu tiên: trung bình.</strong> "Ghi chú review Lab 4: (1) ai đó viết được <code>new LibraryItem()</code> — tài liệu 0 ngày mượn không được tồn tại; (2) controller hàn chặt vào một <code>ArrayList</code> trong bộ nhớ, mà vài tuần nữa ta lưu ra tệp, sau này lưu PostgreSQL — tôi không muốn viết lại controller mỗi lần; (3) ban chủ nhiệm quyết: sinh viên giảm 50% phí trễ, cán bộ được miễn 2 ngày trễ đầu. Lựa chọn 9 phải hỏi ai là người mượn." — trưởng nhóm</p></div>
<table>
<thead><tr><th>Bạn cần</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>interface: vì sao, cách viết, cài đặt, mở rộng</td><td>5.A (pro10 slide 12–17)</td></tr>
<tr><td>lớp trừu tượng và phương thức trừu tượng</td><td>5.A (pro10 slide 18–19), 5.A-2 (slide 20–22)</td></tr>
<tr><td>lớp lồng và lớp ẩn danh</td><td>5.A-2 (pro10 slide 23–27)</td></tr>
<tr><td>ép lên, đa hình</td><td>Chương 4, Lab 4</td></tr>
</tbody>
</table>`),
    bi(`<h2>2. Requirements and acceptance criteria</h2>
<ol>
<li><strong>Abstract parent</strong>: <code>LibraryItem</code> is <code>abstract</code>; the six questions are abstract methods; <code>new LibraryItem(…)</code> anywhere fails to compile.</li>
<li><strong>Repository contract</strong>: <code>repository.IBookRepository</code> is an interface with seven methods; <code>InMemoryBookRepository</code> implements it with <code>@Override</code> on each.</li>
<li><strong>The seam</strong>: <code>BookController</code>'s field has the type <code>IBookRepository</code>; the only line naming <code>InMemoryBookRepository</code> is in the controller's constructor; <code>Main</code> never mentions a repository.</li>
<li><strong>Fee policies</strong>: <code>service.IFeePolicy</code> (name + <code>calculateFee</code>); student = full fee minus 50%, staff = first 2 late days free; option 9 asks "Nguoi muon (1 Sinh vien, 2 Can bo)" and prints the full fee and the fee to pay.</li>
<li>The service keeps no repository; numbers (50, 2, 100) live in <code>Constants</code>.</li>
</ol>
<div class="callout ok"><p><strong>Done means:</strong> <code>check.sh</code> prints <code>PASS: 163/163 dong khop expected.txt</code> · <code>lint.py</code> 0 violations · <code>javac --release 8</code> compiles · typing <code>new LibraryItem("", "", 0, 0)</code> anywhere gives "LibraryItem is abstract; cannot be instantiated" · you can explain abstract class vs interface with your own classes.</p></div>`,
    `<h2>2. Yêu cầu và tiêu chí đạt</h2>
<ol>
<li><strong>Lớp cha trừu tượng</strong>: <code>LibraryItem</code> là <code>abstract</code>; sáu câu hỏi là phương thức trừu tượng; <code>new LibraryItem(…)</code> ở bất kỳ đâu đều không biên dịch được.</li>
<li><strong>Hợp đồng kho</strong>: <code>repository.IBookRepository</code> là interface có bảy phương thức; <code>InMemoryBookRepository</code> cài nó, <code>@Override</code> trên từng cái.</li>
<li><strong>Đường nối</strong>: trường của <code>BookController</code> mang kiểu <code>IBookRepository</code>; dòng duy nhất gọi tên <code>InMemoryBookRepository</code> nằm trong constructor của controller; <code>Main</code> không hề nhắc tới repository.</li>
<li><strong>Chính sách phí</strong>: <code>service.IFeePolicy</code> (tên + <code>calculateFee</code>); sinh viên = phí đầy đủ giảm 50%, cán bộ = miễn 2 ngày trễ đầu; lựa chọn 9 hỏi "Nguoi muon (1 Sinh vien, 2 Can bo)" và in phí đầy đủ cùng phí phải trả.</li>
<li>Service không giữ repository; các con số (50, 2, 100) nằm ở <code>Constants</code>.</li>
</ol>
<div class="callout ok"><p><strong>Xong nghĩa là:</strong> <code>check.sh</code> in <code>PASS: 163/163 dong khop expected.txt</code> · <code>lint.py</code> 0 vi phạm · <code>javac --release 8</code> biên dịch được · gõ <code>new LibraryItem("", "", 0, 0)</code> ở bất kỳ đâu ra "LibraryItem is abstract; cannot be instantiated" · bạn giải thích được lớp trừu tượng và interface bằng chính các lớp của mình.</p></div>`),
    bi(`<h2>3. Files</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v2/CTLibrary-Lab5-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab5-starter.zip</span><span class="lc-sub">Lab 4 solution + IBookRepository / IFeePolicy interfaces · TODO 5.1–5.5 · harness (163 lines) · CheckHarness</span></span>
<span class="lc-cta">Download</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v2/CTLibrary-Lab5-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab5-solution.zip</span><span class="lc-sub">the full solution — open it only after your own attempt</span></span>
<span class="lc-cta">Download</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab5/src/  (new or changed since Lab 4)
  model/LibraryItem.java                    TODO 5.1 make it abstract
  repository/IBookRepository.java            the interface, 7 methods (given)
  repository/InMemoryBookRepository.java    the Lab 4 repository · TODO 5.2 implements + @Override
  controller/BookController.java            TODO 5.3 field typed by the interface
  service/IFeePolicy.java                    the interface (given)
  service/StudentFeePolicy.java             TODO 5.4 calculateFee
  service/StaffFeePolicy.java               TODO 5.5 calculateFee
  service/BookService.java, dto/LateFeeDTO, view/LateFeeView, main/Main (option 9 asks the borrower)   (given)</code></pre>`,
    `<h2>3. Tệp tải về</h2>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v2/CTLibrary-Lab5-starter.zip" target="_blank" rel="noopener">
<span class="lc-ico">🧰</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab5-starter.zip</span><span class="lc-sub">đáp án Lab 4 + interface IBookRepository / IFeePolicy · TODO 5.1–5.5 · harness (163 dòng) · CheckHarness</span></span>
<span class="lc-cta">Tải về</span>
</a>
<a class="link-card" href="https://media.cuongthai.com/files/academy/PRO192/labs/v2/CTLibrary-Lab5-solution.zip" target="_blank" rel="noopener">
<span class="lc-ico">✅</span>
<span class="lc-body"><span class="lc-title">CTLibrary-Lab5-solution.zip</span><span class="lc-sub">đáp án đầy đủ — chỉ mở sau khi đã tự làm</span></span>
<span class="lc-cta">Tải về</span>
</a>
<pre><code class="language-plaintext">CTLibrary-Lab5/src/  (mới hoặc đổi so với Lab 4)
  model/LibraryItem.java                    TODO 5.1 biến thành abstract
  repository/IBookRepository.java            interface, 7 phương thức (cho sẵn)
  repository/InMemoryBookRepository.java    repository của Lab 4 · TODO 5.2 implements + @Override
  controller/BookController.java            TODO 5.3 trường mang kiểu interface
  service/IFeePolicy.java                    interface (cho sẵn)
  service/StudentFeePolicy.java             TODO 5.4 calculateFee
  service/StaffFeePolicy.java               TODO 5.5 calculateFee
  service/BookService.java, dto/LateFeeDTO, view/LateFeeView, main/Main (lựa chọn 9 hỏi người mượn)   (cho sẵn)</code></pre>`),
    bi(`<h2>4. Step by step</h2>
<h4>Step 0 — lint the starter, run it (10 min)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab5</code></pre>
<div class="out">✗ CTLibrary-Lab5 — 1 vi phạm<br>
&nbsp;&nbsp;[JAVABEAN] src/model/LibraryItem.java:1 — lớp LibraryItem thiếu constructor rỗng public (JavaBean — MVC JSP)</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Sinh vien (giam 50%). Phi day du 12000 dong, phai tra 0 dong.<br>
…</div>
<p>One lint violation (fixed by 5.1) and fees to pay of 0 (fixed by 5.4 and 5.5). The other TODOs do not change the output — they change what the compiler can check for you.</p>

<h4>Step 1 — TODO 5.1 abstract LibraryItem (15 min)</h4>
<details><summary>Hint</summary><p>Add <code>abstract</code> to the class line; replace each of the six bodies by a semicolon and add <code>abstract</code> to the signature. Delete the empty constructor. Then, as a test, write <code>new LibraryItem("", "", 0, 0)</code> anywhere: javac must refuse. Remove it again.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">    // Ten loai tai lieu ("Sach", "Tap chi", "DVD") — moi lop con BUOC phai tra loi
    public abstract String getTypeName();

    // Chu cai dau cua ma (B, T, D)
    public abstract String getIdPrefix();

    // So ngay duoc muon
    public abstract int getLoanDays();

    // Phi tre moi ngay (dong)
    public abstract int getLateFeePerDay();

    // Thong tin rieng cua tung loai (tac gia + ISBN, ky so, so phut)
    public abstract String getDetail();

    // Khoa chong trung (2 tai lieu cung khoa la trung)
    public abstract String getUniqueKey();
}</code></pre>
</details>

<h4>Step 2 — TODO 5.2 implements IBookRepository (15 min)</h4>
<details><summary>Solution — the class line (the body is the Lab 4 repository, now with @Override)</summary>
<pre class="trich"><code class="language-java">/**
 * Ban cai dat THU NHAT cua hop dong IBookRepository: giu tai lieu trong bo nho bang MOT
 * danh sach kieu cha ArrayList&amp;lt;LibraryItem&amp;gt; (sach, tap chi, DVD); cap ma va lam CRUD.
 * Tat chuong trinh la mat du lieu — Lab 9 them FileBookRepository cung cai interface nay.
 * Chi createItem biet ten cac lop con; moi cho khac goi qua bien kieu cha (da hinh).
 *
 * @author CuongThai Academy
 */
public class InMemoryBookRepository implements IBookRepository {

    // Moi tai lieu dang co (sach, tap chi, DVD chung mot danh sach kieu cha)
    private ArrayList&lt;LibraryItem&gt; itemList;

    // So thu tu se cap cho tai lieu ke tiep (dung chung cho moi loai, khong static)
    private int nextItemNumber;

    // Tao kho rong, so thu tu dau tien la 1
    public InMemoryBookRepository() {
        itemList = new ArrayList&lt;&gt;();
        nextItemNumber = Constants.FIRST_ID_NUMBER;
    }</code></pre>
</details>
<details><summary>The interface (given)</summary>
<pre><code class="language-java">package repository;

import dto.BookRequestDTO;
import dto.BookResponseDTO;
import java.util.ArrayList;

/**
 * HOP DONG cua kho sach (interface): Controller chi biet "kho lam duoc gi", khong biet
 * "kho cat tai lieu o dau". Ban dau tien luu trong bo nho (InMemoryBookRepository);
 * Lab 9 them FileBookRepository (tep CSV), sau nay JdbcBookRepository (PostgreSQL) —
 * cung cai interface nay nen Main va Controller khong phai doi.
 * Ten co tien to I: checklist thay muc 1.3 (interface I..., nhu ISortStrategy trong bai mau).
 *
 * @author CuongThai Academy
 */
public interface IBookRepository {

    // Them 1 tai lieu tu phieu, tra ve ma vua cap; trung khoa thi nem loi
    String addItem(BookRequestDTO bookRequestDTO) throws Exception;

    // Sua so ban cua tai lieu mang ma trong phieu; khong co ma thi nem loi
    void updateCopies(BookRequestDTO bookRequestDTO) throws Exception;

    // Xoa tai lieu mang ma nay; khong co ma thi nem loi; ma khong bao gio cap lai
    void deleteItem(String id) throws Exception;

    // Lay BAN SAO 1 tai lieu theo ma; khong co ma thi nem loi
    BookResponseDTO findById(String id) throws Exception;

    // Dem so tai lieu dang co
    int countItems();

    // Lay ban sao moi tai lieu theo thu tu da them
    ArrayList&lt;BookResponseDTO&gt; findAll();

    // Tim tai lieu co ten chua tu khoa (khong phan biet hoa thuong)
    ArrayList&lt;BookResponseDTO&gt; findByKeyword(String keyword);
}</code></pre>
</details>

<h4>Step 3 — TODO 5.3 the field type (5 min)</h4>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Kho tai lieu kieu INTERFACE (CRUD nam o Controller, khong o Service)
private IBookRepository bookRepository;</code></pre>
<pre class="trich"><code class="language-java">// Tao kho, service, cac view va nap du lieu mau (sach, tap chi, DVD)
public BookController() {
    // Dong DUY NHAT biet kho cat o dau (bo nho); Lab 9 thay bang FileBookRepository
    bookRepository = new InMemoryBookRepository();
    bookService = new BookService();</code></pre>
</details>

<h4>Step 4 — TODO 5.4 and 5.5 the two policies (25 min)</h4>
<details><summary>Hint</summary><p>Student: <code>fullFee * (PERCENT_FULL - STUDENT_DISCOUNT_PERCENT) / PERCENT_FULL</code> — multiply first. Staff: <code>Math.max(0, daysLate - STAFF_FREE_DAYS) * lateFeePerDay</code>.</p></details>
<details><summary>Solution</summary>
<pre class="trich"><code class="language-java">// Phi day du (ngay tre x phi/ngay) nhan phan tram con phai tra (100 - 50)
@Override
public int calculateFee(int daysLate, int lateFeePerDay) {
    // Phi khi chua giam
    int fullFee = daysLate * lateFeePerDay;

    return fullFee * (Constants.PERCENT_FULL - Constants.STUDENT_DISCOUNT_PERCENT)
            / Constants.PERCENT_FULL;
}</code></pre>
<pre class="trich"><code class="language-java">// Bo di STAFF_FREE_DAYS ngay tre dau (khong am), phan con lai tinh du phi
@Override
public int calculateFee(int daysLate, int lateFeePerDay) {
    // So ngay tre con phai tra tien
    int chargedDays = Math.max(0, daysLate - Constants.STAFF_FREE_DAYS);

    return chargedDays * lateFeePerDay;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 12000 dong, phai tra 8000 dong.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): D006 "The Social Network" (DVD): han muon 3 ngay, da giu 4 ngay, tre 1 ngay x 5000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 5000 dong, phai tra 0 dong.<br>
…</div>

<h4>Step 5 — grade, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 163/163 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab5-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab5-Solution — sạch</div>`,
    `<h2>4. Làm từng bước</h2>
<h4>Bước 0 — lint starter, chạy thử (10 phút)</h4>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab5</code></pre>
<div class="out">✗ CTLibrary-Lab5 — 1 vi phạm<br>
&nbsp;&nbsp;[JAVABEAN] src/model/LibraryItem.java:1 — lớp LibraryItem thiếu constructor rỗng public (JavaBean — MVC JSP)</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Sinh vien (giam 50%). Phi day du 12000 dong, phai tra 0 dong.<br>
…</div>
<p>Một vi phạm lint (5.1 sửa) và phí phải trả bằng 0 (5.4 và 5.5 sửa). Các TODO còn lại không đổi output — chúng đổi những gì trình biên dịch kiểm hộ bạn.</p>

<h4>Bước 1 — TODO 5.1 LibraryItem trừu tượng (15 phút)</h4>
<details><summary>Gợi ý</summary><p>Thêm <code>abstract</code> vào dòng khai báo lớp; thay thân của sáu phương thức bằng dấu chấm phẩy và thêm <code>abstract</code> vào chữ ký. Xoá constructor rỗng. Rồi thử gõ <code>new LibraryItem("", "", 0, 0)</code> ở đâu đó: javac phải từ chối. Xoá dòng thử đi.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">    // Ten loai tai lieu ("Sach", "Tap chi", "DVD") — moi lop con BUOC phai tra loi
    public abstract String getTypeName();

    // Chu cai dau cua ma (B, T, D)
    public abstract String getIdPrefix();

    // So ngay duoc muon
    public abstract int getLoanDays();

    // Phi tre moi ngay (dong)
    public abstract int getLateFeePerDay();

    // Thong tin rieng cua tung loai (tac gia + ISBN, ky so, so phut)
    public abstract String getDetail();

    // Khoa chong trung (2 tai lieu cung khoa la trung)
    public abstract String getUniqueKey();
}</code></pre>
</details>

<h4>Bước 2 — TODO 5.2 implements IBookRepository (15 phút)</h4>
<details><summary>Lời giải — dòng khai báo lớp (thân là repository của Lab 4, giờ có @Override)</summary>
<pre class="trich"><code class="language-java">/**
 * Ban cai dat THU NHAT cua hop dong IBookRepository: giu tai lieu trong bo nho bang MOT
 * danh sach kieu cha ArrayList&amp;lt;LibraryItem&amp;gt; (sach, tap chi, DVD); cap ma va lam CRUD.
 * Tat chuong trinh la mat du lieu — Lab 9 them FileBookRepository cung cai interface nay.
 * Chi createItem biet ten cac lop con; moi cho khac goi qua bien kieu cha (da hinh).
 *
 * @author CuongThai Academy
 */
public class InMemoryBookRepository implements IBookRepository {

    // Moi tai lieu dang co (sach, tap chi, DVD chung mot danh sach kieu cha)
    private ArrayList&lt;LibraryItem&gt; itemList;

    // So thu tu se cap cho tai lieu ke tiep (dung chung cho moi loai, khong static)
    private int nextItemNumber;

    // Tao kho rong, so thu tu dau tien la 1
    public InMemoryBookRepository() {
        itemList = new ArrayList&lt;&gt;();
        nextItemNumber = Constants.FIRST_ID_NUMBER;
    }</code></pre>
</details>
<details><summary>Interface (cho sẵn)</summary>
<pre><code class="language-java">package repository;

import dto.BookRequestDTO;
import dto.BookResponseDTO;
import java.util.ArrayList;

/**
 * HOP DONG cua kho sach (interface): Controller chi biet "kho lam duoc gi", khong biet
 * "kho cat tai lieu o dau". Ban dau tien luu trong bo nho (InMemoryBookRepository);
 * Lab 9 them FileBookRepository (tep CSV), sau nay JdbcBookRepository (PostgreSQL) —
 * cung cai interface nay nen Main va Controller khong phai doi.
 * Ten co tien to I: checklist thay muc 1.3 (interface I..., nhu ISortStrategy trong bai mau).
 *
 * @author CuongThai Academy
 */
public interface IBookRepository {

    // Them 1 tai lieu tu phieu, tra ve ma vua cap; trung khoa thi nem loi
    String addItem(BookRequestDTO bookRequestDTO) throws Exception;

    // Sua so ban cua tai lieu mang ma trong phieu; khong co ma thi nem loi
    void updateCopies(BookRequestDTO bookRequestDTO) throws Exception;

    // Xoa tai lieu mang ma nay; khong co ma thi nem loi; ma khong bao gio cap lai
    void deleteItem(String id) throws Exception;

    // Lay BAN SAO 1 tai lieu theo ma; khong co ma thi nem loi
    BookResponseDTO findById(String id) throws Exception;

    // Dem so tai lieu dang co
    int countItems();

    // Lay ban sao moi tai lieu theo thu tu da them
    ArrayList&lt;BookResponseDTO&gt; findAll();

    // Tim tai lieu co ten chua tu khoa (khong phan biet hoa thuong)
    ArrayList&lt;BookResponseDTO&gt; findByKeyword(String keyword);
}</code></pre>
</details>

<h4>Bước 3 — TODO 5.3 kiểu của trường (5 phút)</h4>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Kho tai lieu kieu INTERFACE (CRUD nam o Controller, khong o Service)
private IBookRepository bookRepository;</code></pre>
<pre class="trich"><code class="language-java">// Tao kho, service, cac view va nap du lieu mau (sach, tap chi, DVD)
public BookController() {
    // Dong DUY NHAT biet kho cat o dau (bo nho); Lab 9 thay bang FileBookRepository
    bookRepository = new InMemoryBookRepository();
    bookService = new BookService();</code></pre>
</details>

<h4>Bước 4 — TODO 5.4 và 5.5 hai chính sách (25 phút)</h4>
<details><summary>Gợi ý</summary><p>Sinh viên: <code>fullFee * (PERCENT_FULL - STUDENT_DISCOUNT_PERCENT) / PERCENT_FULL</code> — nhân trước. Cán bộ: <code>Math.max(0, daysLate - STAFF_FREE_DAYS) * lateFeePerDay</code>.</p></details>
<details><summary>Lời giải</summary>
<pre class="trich"><code class="language-java">// Phi day du (ngay tre x phi/ngay) nhan phan tram con phai tra (100 - 50)
@Override
public int calculateFee(int daysLate, int lateFeePerDay) {
    // Phi khi chua giam
    int fullFee = daysLate * lateFeePerDay;

    return fullFee * (Constants.PERCENT_FULL - Constants.STUDENT_DISCOUNT_PERCENT)
            / Constants.PERCENT_FULL;
}</code></pre>
<pre class="trich"><code class="language-java">// Bo di STAFF_FREE_DAYS ngay tre dau (khong am), phan con lai tinh du phi
@Override
public int calculateFee(int daysLate, int lateFeePerDay) {
    // So ngay tre con phai tra tien
    int chargedDays = Math.max(0, daysLate - Constants.STAFF_FREE_DAYS);

    return chargedDays * lateFeePerDay;
}</code></pre>
</details>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 12000 dong, phai tra 8000 dong.<br>
…</div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")
$ java -cp build main.Main &lt; harness/input.txt</code></pre>
<div class="out">…<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): D006 "The Social Network" (DVD): han muon 3 ngay, da giu 4 ngay, tre 1 ngay x 5000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 5000 dong, phai tra 0 dong.<br>
…</div>

<h4>Bước 5 — chấm, lint, commit</h4>
<pre><code class="language-bash">$ ./check.sh        # Windows: check.bat · NetBeans: Run File on test/harness/CheckHarness.java</code></pre>
<div class="out">PASS: 163/163 dong khop expected.txt</div>
<pre><code class="language-bash">$ python3 lint.py CTLibrary-Lab5-Solution</code></pre>
<div class="out">✓ CTLibrary-Lab5-Solution — sạch</div>`),
    bi(`<h2>5. The full solution — and the proof it is right</h2>
<p>The solution zip is the complete project: <code>lint.py</code> 0 violations, <code>javac --release 8</code>, the same output on a real JDK 8, and 163/163 on the grader.</p>
<details><summary>Full run — java -cp build main.Main &lt; harness/input.txt (163 lines)</summary>
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
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Sinh vien (giam 50%). Phi day du 12000 dong, phai tra 6000 dong.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 12000 dong, phai tra 8000 dong.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): D006 "The Social Network" (DVD): han muon 3 ngay, da giu 4 ngay, tre 1 ngay x 5000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 5000 dong, phai tra 0 dong.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 2. Moi nhap lai.<br>
Nguoi muon (1 Sinh vien, 2 Can bo): T005 "Tech Weekly" (Tap chi): han muon 7 ngay, da giu 10 ngay, tre 3 ngay x 1000 dong/ngay.<br>
Nguoi muon: Sinh vien (giam 50%). Phi day du 3000 dong, phai tra 1500 dong.<br>
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
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: So phut: Da them D007 "The Imitation Game". Thu vien co 7 tai lieu.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): D007 "The Imitation Game" (DVD): han muon 3 ngay, da giu 9 ngay, tre 6 ngay x 5000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 30000 dong, phai tra 20000 dong.<br>
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
0. Thoat<br>
Lua chon: --- Xoa tai lieu ---<br>
Ma tai lieu (vi du B001, T005, D006): Da xoa T005 "Tech Weekly". Ma T005 se khong duoc cap lai.<br>
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
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;D007 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Imitation Game &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;114 phut<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
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
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So tai lieu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 6<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 12<br>
Tai lieu het ban : 0<br>
Cu nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Head First Java (2005)<br>
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
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 5 chi nam trong bo nho.</div>
</details>
<details><summary>BookService — the service keeps fee policies, never a repository</summary>
<pre><code class="language-java">package service;

import constants.Constants;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import dto.LateFeeDTO;
import dto.LibraryReportDTO;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

/**
 * Nghiep vu tai lieu: sap xep, danh so, thong ke va tinh phi tre han tren cac dong bang
 * Controller dua vao. Service KHONG giu repository; no chi giu cac CHINH SACH phi
 * (danh sach kieu interface IFeePolicy) — luat nghiep vu, khong phai du lieu.
 *
 * @author CuongThai Academy
 */
public class BookService {

    // Chinh sach phi theo loai nguoi muon; vi tri 0 = loai 1 (sinh vien), 1 = loai 2 (can bo)
    private ArrayList&lt;IFeePolicy&gt; feePolicyList;

    // Tao service voi cac chinh sach phi; them loai nguoi muon = them 1 dong o day
    public BookService() {
        feePolicyList = new ArrayList&lt;&gt;();
        feePolicyList.add(new StudentFeePolicy());
        feePolicyList.add(new StaffFeePolicy());
    }

    // Sap cac dong bang theo ten (A-Z, khong phan biet hoa thuong), trung ten thi theo ma;
    // xong danh so thu tu tu 1
    public ArrayList&lt;BookResponseDTO&gt; sortByTitle(ArrayList&lt;BookResponseDTO&gt; itemList) {
        // Ban sao de khong lam doi thu tu cua danh sach goc
        ArrayList&lt;BookResponseDTO&gt; sortedList = new ArrayList&lt;&gt;(itemList);

        // Comparator viet bang LOP AN DANH (Chuong 5): lop khong ten cai interface tai cho
        Collections.sort(sortedList, new Comparator&lt;BookResponseDTO&gt;() {
            // So ten truoc, trung ten thi so ma
            @Override
            public int compare(BookResponseDTO first, BookResponseDTO second) {
                // Ket qua so ten (0 = trung ten)
                int byTitle = first.getTitle().compareToIgnoreCase(second.getTitle());

                // Trung ten (vd 2 ky cua cung tap chi) thi ma quyet dinh thu tu
                if (byTitle == 0) {
                    return first.getId().compareTo(second.getId());
                }
                return byTitle;
            }
        });

        // Danh so thu tu sau khi sap xep
        for (int i = 0; i &lt; sortedList.size(); i++) {
            sortedList.get(i).setNo(i + 1);
        }

        return sortedList;
    }

    // Thong ke tu danh sach Controller dua vao: so tai lieu, tong so ban, so tai lieu het,
    // tai lieu cu nhat (trung nam thi giu tai lieu gap truoc)
    public LibraryReportDTO buildReport(ArrayList&lt;BookResponseDTO&gt; itemList) {
        // Bao cao rong: moi so bang 0, chua co tai lieu cu nhat
        LibraryReportDTO report = new LibraryReportDTO();

        // Cong don tung tai lieu vao bao cao
        for (BookResponseDTO item : itemList) {
            report.setTotalCopies(report.getTotalCopies() + item.getCopies());

            // Het ban thi dem them 1
            if (item.getCopies() == 0) {
                report.setOutOfStockTitles(report.getOutOfStockTitles() + 1);
            }

            // Tai lieu dau tien hoac cu hon tai lieu cu nhat dang giu thi thay
            if ((report.getOldestTitle().isEmpty()) || (item.getYear() &lt; report.getOldestYear())) {
                report.setOldestTitle(item.getTitle());
                report.setOldestYear(item.getYear());
            }
        }

        // So tai lieu la so dong cua danh sach
        report.setTotalTitles(itemList.size());
        return report;
    }

    // Tinh phi tre: ngay tre = ngay giu - han muon (khong am); phi day du = ngay tre x phi/ngay;
    // phi phai tra do CHINH SACH cua loai nguoi muon trong phieu quyet dinh (da hinh qua interface)
    public LateFeeDTO calculateLateFee(BookResponseDTO item, BookRequestDTO bookRequestDTO) {
        // Ket qua; so ngay tre; chinh sach ung voi loai nguoi muon (loai 1 o vi tri 0)
        LateFeeDTO lateFee = new LateFeeDTO();
        int daysLate = Math.max(0, bookRequestDTO.getDaysKept() - item.getLoanDays());
        IFeePolicy feePolicy = feePolicyList.get(bookRequestDTO.getBorrowerType()
                - Constants.FIRST_BORROWER_TYPE);

        // Chep thong tin tai lieu de View in
        lateFee.setId(item.getId());
        lateFee.setTitle(item.getTitle());
        lateFee.setTypeName(item.getTypeName());
        lateFee.setLoanDays(item.getLoanDays());
        lateFee.setLateFeePerDay(item.getLateFeePerDay());

        // So ngay giu, so ngay tre, phi day du, roi phi sau chinh sach
        lateFee.setDaysKept(bookRequestDTO.getDaysKept());
        lateFee.setDaysLate(daysLate);
        lateFee.setFullFee(daysLate * item.getLateFeePerDay());
        lateFee.setPolicyName(feePolicy.getPolicyName());
        lateFee.setTotalFee(feePolicy.calculateFee(daysLate, item.getLateFeePerDay()));
        return lateFee;
    }
}</code></pre>
</details>
<details><summary>IFeePolicy.java — the strategy contract</summary>
<pre><code class="language-java">package service;

/**
 * HOP DONG chinh sach phi tre (interface — mau Strategy): moi loai nguoi muon mot cach tinh.
 * BookService giu cac chinh sach trong ArrayList kieu IFeePolicy va goi chung mot dong;
 * them loai nguoi muon moi = them 1 lop cai interface nay, khong sua cong thuc nao.
 *
 * @author CuongThai Academy
 */
public interface IFeePolicy {

    // Ten chinh sach de in ra (vi du "Sinh vien - giam 50%")
    String getPolicyName();

    // Phi phai tra khi tre daysLate ngay voi muc phi lateFeePerDay dong/ngay
    int calculateFee(int daysLate, int lateFeePerDay);
}</code></pre>
</details>`,
    `<h2>5. Đáp án đầy đủ — và bằng chứng là đúng</h2>
<p>Tệp zip đáp án là trọn dự án: <code>lint.py</code> 0 vi phạm, <code>javac --release 8</code>, chạy trên JDK 8 thật ra y hệt, và bộ chấm 163/163.</p>
<details><summary>Trọn lần chạy — java -cp build main.Main &lt; harness/input.txt (163 dòng)</summary>
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
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;T005 &nbsp;Tap chi &nbsp;2025 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;&nbsp;Tech Weekly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ky so 118<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Sinh vien (giam 50%). Phi day du 12000 dong, phai tra 6000 dong.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): B002 "Effective Java" (Sach): han muon 14 ngay, da giu 20 ngay, tre 6 ngay x 2000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 12000 dong, phai tra 8000 dong.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): D006 "The Social Network" (DVD): han muon 3 ngay, da giu 4 ngay, tre 1 ngay x 5000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 5000 dong, phai tra 0 dong.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): Lua chon nam ngoai khoang cho phep. Hay nhap 1 so tu 1 den 2. Moi nhap lai.<br>
Nguoi muon (1 Sinh vien, 2 Can bo): T005 "Tech Weekly" (Tap chi): han muon 7 ngay, da giu 10 ngay, tre 3 ngay x 1000 dong/ngay.<br>
Nguoi muon: Sinh vien (giam 50%). Phi day du 3000 dong, phai tra 1500 dong.<br>
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
0. Thoat<br>
Lua chon: --- Them tai lieu ---<br>
Loai (1 Sach, 2 Tap chi, 3 DVD): Ten: Nam xuat ban: So ban: So phut: Da them D007 "The Imitation Game". Thu vien co 7 tai lieu.<br>
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
0. Thoat<br>
Lua chon: --- Tinh phi tre han ---<br>
Ma tai lieu (vi du B001, T005, D006): So ngay da giu: Nguoi muon (1 Sinh vien, 2 Can bo): D007 "The Imitation Game" (DVD): han muon 3 ngay, da giu 9 ngay, tre 6 ngay x 5000 dong/ngay.<br>
Nguoi muon: Can bo (mien 2 ngay tre dau). Phi day du 30000 dong, phai tra 20000 dong.<br>
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
0. Thoat<br>
Lua chon: --- Xoa tai lieu ---<br>
Ma tai lieu (vi du B001, T005, D006): Da xoa T005 "Tech Weekly". Ma T005 se khong duoc cap lai.<br>
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
0. Thoat<br>
Lua chon: --- Danh sach tai lieu ---<br>
No &nbsp;Id &nbsp;&nbsp;&nbsp;Type &nbsp;&nbsp;&nbsp;&nbsp;Year &nbsp;Copies Days &nbsp;Fee &nbsp;&nbsp;&nbsp;Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Detail<br>
1 &nbsp;&nbsp;B002 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2018 &nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Effective Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joshua Bloch, ISBN 9780134685991<br>
2 &nbsp;&nbsp;B004 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2005 &nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Head First Java &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kathy Sierra, ISBN 9780596009205<br>
3 &nbsp;&nbsp;B003 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2006 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;Java Concurrency In Practice &nbsp;Brian Goetz, ISBN 9780321349606<br>
4 &nbsp;&nbsp;D007 &nbsp;DVD &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2014 &nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;5000 &nbsp;&nbsp;The Imitation Game &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;114 phut<br>
5 &nbsp;&nbsp;B001 &nbsp;Sach &nbsp;&nbsp;&nbsp;&nbsp;2019 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;2000 &nbsp;&nbsp;The Pragmatic Programmer &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;David Thomas, ISBN 9780135957059<br>
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
0. Thoat<br>
Lua chon: --- Thong ke thu vien ---<br>
So tai lieu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 6<br>
Tong so ban &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 12<br>
Tai lieu het ban : 0<br>
Cu nhat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Head First Java (2005)<br>
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
0. Thoat<br>
Lua chon: Tam biet! Du lieu Lab 5 chi nam trong bo nho.</div>
</details>
<details><summary>BookService — service giữ các chính sách phí, không bao giờ giữ repository</summary>
<pre><code class="language-java">package service;

import constants.Constants;
import dto.BookRequestDTO;
import dto.BookResponseDTO;
import dto.LateFeeDTO;
import dto.LibraryReportDTO;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

/**
 * Nghiep vu tai lieu: sap xep, danh so, thong ke va tinh phi tre han tren cac dong bang
 * Controller dua vao. Service KHONG giu repository; no chi giu cac CHINH SACH phi
 * (danh sach kieu interface IFeePolicy) — luat nghiep vu, khong phai du lieu.
 *
 * @author CuongThai Academy
 */
public class BookService {

    // Chinh sach phi theo loai nguoi muon; vi tri 0 = loai 1 (sinh vien), 1 = loai 2 (can bo)
    private ArrayList&lt;IFeePolicy&gt; feePolicyList;

    // Tao service voi cac chinh sach phi; them loai nguoi muon = them 1 dong o day
    public BookService() {
        feePolicyList = new ArrayList&lt;&gt;();
        feePolicyList.add(new StudentFeePolicy());
        feePolicyList.add(new StaffFeePolicy());
    }

    // Sap cac dong bang theo ten (A-Z, khong phan biet hoa thuong), trung ten thi theo ma;
    // xong danh so thu tu tu 1
    public ArrayList&lt;BookResponseDTO&gt; sortByTitle(ArrayList&lt;BookResponseDTO&gt; itemList) {
        // Ban sao de khong lam doi thu tu cua danh sach goc
        ArrayList&lt;BookResponseDTO&gt; sortedList = new ArrayList&lt;&gt;(itemList);

        // Comparator viet bang LOP AN DANH (Chuong 5): lop khong ten cai interface tai cho
        Collections.sort(sortedList, new Comparator&lt;BookResponseDTO&gt;() {
            // So ten truoc, trung ten thi so ma
            @Override
            public int compare(BookResponseDTO first, BookResponseDTO second) {
                // Ket qua so ten (0 = trung ten)
                int byTitle = first.getTitle().compareToIgnoreCase(second.getTitle());

                // Trung ten (vd 2 ky cua cung tap chi) thi ma quyet dinh thu tu
                if (byTitle == 0) {
                    return first.getId().compareTo(second.getId());
                }
                return byTitle;
            }
        });

        // Danh so thu tu sau khi sap xep
        for (int i = 0; i &lt; sortedList.size(); i++) {
            sortedList.get(i).setNo(i + 1);
        }

        return sortedList;
    }

    // Thong ke tu danh sach Controller dua vao: so tai lieu, tong so ban, so tai lieu het,
    // tai lieu cu nhat (trung nam thi giu tai lieu gap truoc)
    public LibraryReportDTO buildReport(ArrayList&lt;BookResponseDTO&gt; itemList) {
        // Bao cao rong: moi so bang 0, chua co tai lieu cu nhat
        LibraryReportDTO report = new LibraryReportDTO();

        // Cong don tung tai lieu vao bao cao
        for (BookResponseDTO item : itemList) {
            report.setTotalCopies(report.getTotalCopies() + item.getCopies());

            // Het ban thi dem them 1
            if (item.getCopies() == 0) {
                report.setOutOfStockTitles(report.getOutOfStockTitles() + 1);
            }

            // Tai lieu dau tien hoac cu hon tai lieu cu nhat dang giu thi thay
            if ((report.getOldestTitle().isEmpty()) || (item.getYear() &lt; report.getOldestYear())) {
                report.setOldestTitle(item.getTitle());
                report.setOldestYear(item.getYear());
            }
        }

        // So tai lieu la so dong cua danh sach
        report.setTotalTitles(itemList.size());
        return report;
    }

    // Tinh phi tre: ngay tre = ngay giu - han muon (khong am); phi day du = ngay tre x phi/ngay;
    // phi phai tra do CHINH SACH cua loai nguoi muon trong phieu quyet dinh (da hinh qua interface)
    public LateFeeDTO calculateLateFee(BookResponseDTO item, BookRequestDTO bookRequestDTO) {
        // Ket qua; so ngay tre; chinh sach ung voi loai nguoi muon (loai 1 o vi tri 0)
        LateFeeDTO lateFee = new LateFeeDTO();
        int daysLate = Math.max(0, bookRequestDTO.getDaysKept() - item.getLoanDays());
        IFeePolicy feePolicy = feePolicyList.get(bookRequestDTO.getBorrowerType()
                - Constants.FIRST_BORROWER_TYPE);

        // Chep thong tin tai lieu de View in
        lateFee.setId(item.getId());
        lateFee.setTitle(item.getTitle());
        lateFee.setTypeName(item.getTypeName());
        lateFee.setLoanDays(item.getLoanDays());
        lateFee.setLateFeePerDay(item.getLateFeePerDay());

        // So ngay giu, so ngay tre, phi day du, roi phi sau chinh sach
        lateFee.setDaysKept(bookRequestDTO.getDaysKept());
        lateFee.setDaysLate(daysLate);
        lateFee.setFullFee(daysLate * item.getLateFeePerDay());
        lateFee.setPolicyName(feePolicy.getPolicyName());
        lateFee.setTotalFee(feePolicy.calculateFee(daysLate, item.getLateFeePerDay()));
        return lateFee;
    }
}</code></pre>
</details>
<details><summary>IFeePolicy.java — hợp đồng của chiến lược</summary>
<pre><code class="language-java">package service;

/**
 * HOP DONG chinh sach phi tre (interface — mau Strategy): moi loai nguoi muon mot cach tinh.
 * BookService giu cac chinh sach trong ArrayList kieu IFeePolicy va goi chung mot dong;
 * them loai nguoi muon moi = them 1 lop cai interface nay, khong sua cong thuc nao.
 *
 * @author CuongThai Academy
 */
public interface IFeePolicy {

    // Ten chinh sach de in ra (vi du "Sinh vien - giam 50%")
    String getPolicyName();

    // Phi phai tra khi tre daysLate ngay voi muc phi lateFeePerDay dong/ngay
    int calculateFee(int daysLate, int lateFeePerDay);
}</code></pre>
</details>`),
    bi(`<h2>6. Traps (with real output)</h2>
<div class="pitfall"><p><strong>Trap 1 — new on an abstract class, a child missing a method, an implementation missing a method.</strong> Three real compile errors (the project <code>bay/truu-tuong</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/model/Dvd.java:13: error: Dvd is not abstract and does not override abstract method getUniqueKey() in LibraryItem<br>
public class Dvd extends LibraryItem {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/repository/InMemoryBookRepository.java:21: error: InMemoryBookRepository is not abstract and does not override abstract method countItems() in IBookRepository<br>
public class InMemoryBookRepository implements IBookRepository {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/repository/InMemoryBookRepository.java:153: error: LibraryItem is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return new LibraryItem("", bookRequestDTO.getTitle(), bookRequestDTO.getYear(),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
3 errors</div>
<div class="pitfall"><p><strong>Trap 2 — a "field" in an interface.</strong> It is <code>public static final</code>; assigning it is an error (JDK 8 javac: "cannot assign a value to final variable MAX_ITEMS").</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/repository/InMemoryBookRepository.java:33: error: cannot assign a value to static final variable MAX_ITEMS<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX_ITEMS = 1000;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error</div>
<div class="pitfall"><p><strong>Trap 3 — integer division before multiplication.</strong> <code>fullFee * (50 / 100)</code> is always 0: compute <code>fullFee * 50 / 100</code>. No compile error — only the grader turns red.</p></div>
<pre><code class="language-java">// release: 8
// Lab 5 trap — integer division: (50 / 100) is 0, so dividing first loses everything
public class LabBayChiaNguyen {
    public static void main(String[] args) {
        int fullFee = 12000;                                // 6 days late x 2000
        int discountPercent = 50;
        System.out.println("multiply first: " + fullFee * (100 - discountPercent) / 100);
        System.out.println("divide first  : " + fullFee * ((100 - discountPercent) / 100));
        System.out.println("50 / 100      = " + (50 / 100) + "   (int / int keeps only the integer part)");
        System.out.println("50.0 / 100    = " + (50.0 / 100));
    }
}</code></pre>
<div class="out">multiply first: 6000<br>
divide first &nbsp;: 0<br>
50 / 100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0 &nbsp;&nbsp;(int / int keeps only the integer part)<br>
50.0 / 100 &nbsp;&nbsp;&nbsp;= 0.5</div>
<div class="pitfall"><p><strong>Trap 4 — typing the field with the class.</strong> <code>private InMemoryBookRepository bookRepository;</code> compiles and runs the same — but every method the controller calls is now free to be one only the in-memory class has, and Lab 9 must edit more than one line. The rubric checks the type.</p></div>
<p>The seam and the policies, run for real:</p>
<pre><code class="language-java">// release: 8
// Lab 5 — the seam: the SAME client code runs on two different repositories because it only knows the interface
import java.util.ArrayList;

interface IBookRepository {
    void addTitle(String title);
    ArrayList&lt;String&gt; findAll();
    String getStorageName();
}

class InMemoryBookRepository implements IBookRepository {
    private ArrayList&lt;String&gt; titleList = new ArrayList&lt;String&gt;();
    @Override public void addTitle(String title) { titleList.add(title); }
    @Override public ArrayList&lt;String&gt; findAll() { return new ArrayList&lt;String&gt;(titleList); }
    @Override public String getStorageName() { return "memory"; }
}

// a stand-in for Lab 9's FileBookRepository: it "writes" every line it stores
class FakeFileBookRepository implements IBookRepository {
    private ArrayList&lt;String&gt; lineList = new ArrayList&lt;String&gt;();
    @Override public void addTitle(String title) { lineList.add(title); System.out.println("  books.csv &lt;- " + title); }
    @Override public ArrayList&lt;String&gt; findAll() { return new ArrayList&lt;String&gt;(lineList); }
    @Override public String getStorageName() { return "file books.csv"; }
}

class Library {                                             // plays the controller: knows ONLY the interface
    private IBookRepository bookRepository;
    Library(IBookRepository bookRepository) { this.bookRepository = bookRepository; }
    void run() {
        bookRepository.addTitle("Effective Java");
        bookRepository.addTitle("Head First Java");
        System.out.println(bookRepository.getStorageName() + ": " + bookRepository.findAll());
    }
}

public class LabDoiKho {
    public static void main(String[] args) {
        new Library(new InMemoryBookRepository()).run();     // today
        new Library(new FakeFileBookRepository()).run();     // Lab 9: only this line changes
    }
}</code></pre>
<div class="out">memory: [Effective Java, Head First Java]<br>
&nbsp;&nbsp;books.csv &lt;- Effective Java<br>
&nbsp;&nbsp;books.csv &lt;- Head First Java<br>
file books.csv: [Effective Java, Head First Java]</div>
<pre><code class="language-java">// release: 8
// Lab 5 — IFeePolicy as a Strategy: one loop over ArrayList&lt;IFeePolicy&gt;, plus a third policy written as an ANONYMOUS class
import java.util.ArrayList;

interface IFeePolicy {
    String getPolicyName();
    int calculateFee(int daysLate, int lateFeePerDay);
}

class StudentFeePolicy implements IFeePolicy {
    @Override public String getPolicyName() { return "Sinh vien (giam 50%)"; }
    @Override public int calculateFee(int daysLate, int lateFeePerDay) { return daysLate * lateFeePerDay * 50 / 100; }
}

class StaffFeePolicy implements IFeePolicy {
    @Override public String getPolicyName() { return "Can bo (mien 2 ngay tre dau)"; }
    @Override public int calculateFee(int daysLate, int lateFeePerDay) { return Math.max(0, daysLate - 2) * lateFeePerDay; }
}

public class LabChinhSach {
    public static void main(String[] args) {
        ArrayList&lt;IFeePolicy&gt; feePolicyList = new ArrayList&lt;IFeePolicy&gt;();
        feePolicyList.add(new StudentFeePolicy());
        feePolicyList.add(new StaffFeePolicy());
        feePolicyList.add(new IFeePolicy() {                 // anonymous class: no name, implements IFeePolicy right here
            @Override public String getPolicyName() { return "Tuan le doc sach (mien phi)"; }
            @Override public int calculateFee(int daysLate, int lateFeePerDay) { return 0; }
        });
        for (IFeePolicy feePolicy : feePolicyList) {          // a book 6 days late, 2000 per day
            System.out.println(feePolicy.getPolicyName() + " -&gt; " + feePolicy.calculateFee(6, 2000)
                    + "   [" + feePolicy.getClass().getName() + "]");
        }
    }
}</code></pre>
<div class="out">Sinh vien (giam 50%) -&gt; 6000 &nbsp;&nbsp;[StudentFeePolicy]<br>
Can bo (mien 2 ngay tre dau) -&gt; 8000 &nbsp;&nbsp;[StaffFeePolicy]<br>
Tuan le doc sach (mien phi) -&gt; 0 &nbsp;&nbsp;[LabChinhSach$1]</div>`,
    `<h2>6. Bẫy (kèm output thật)</h2>
<div class="pitfall"><p><strong>Bẫy 1 — new một lớp trừu tượng, lớp con thiếu phương thức, bản cài thiếu phương thức.</strong> Ba lỗi biên dịch thật (dự án <code>bay/truu-tuong</code>).</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/model/Dvd.java:13: error: Dvd is not abstract and does not override abstract method getUniqueKey() in LibraryItem<br>
public class Dvd extends LibraryItem {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/repository/InMemoryBookRepository.java:21: error: InMemoryBookRepository is not abstract and does not override abstract method countItems() in IBookRepository<br>
public class InMemoryBookRepository implements IBookRepository {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
src/repository/InMemoryBookRepository.java:153: error: LibraryItem is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return new LibraryItem("", bookRequestDTO.getTitle(), bookRequestDTO.getYear(),<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
3 errors</div>
<div class="pitfall"><p><strong>Bẫy 2 — "trường" trong interface.</strong> Nó là <code>public static final</code>; gán lại là lỗi (javac JDK 8: "cannot assign a value to final variable MAX_ITEMS").</p></div>
<pre><code class="language-bash">$ javac --release 8 -encoding UTF-8 -d build $(find src -name "*.java")</code></pre>
<div class="out">src/repository/InMemoryBookRepository.java:33: error: cannot assign a value to static final variable MAX_ITEMS<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAX_ITEMS = 1000;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error</div>
<div class="pitfall"><p><strong>Bẫy 3 — chia số nguyên trước khi nhân.</strong> <code>fullFee * (50 / 100)</code> luôn bằng 0: hãy tính <code>fullFee * 50 / 100</code>. Không có lỗi biên dịch nào — chỉ có bộ chấm báo đỏ.</p></div>
<pre><code class="language-java">// release: 8
// Bẫy Lab 5 — chia số nguyên: (50 / 100) bằng 0, chia trước là mất sạch
public class LabBayChiaNguyen {
    public static void main(String[] args) {
        int fullFee = 12000;                                // trễ 6 ngày x 2000
        int discountPercent = 50;
        System.out.println("multiply first: " + fullFee * (100 - discountPercent) / 100);
        System.out.println("divide first  : " + fullFee * ((100 - discountPercent) / 100));
        System.out.println("50 / 100      = " + (50 / 100) + "   (int / int keeps only the integer part)");
        System.out.println("50.0 / 100    = " + (50.0 / 100));
    }
}</code></pre>
<div class="out">multiply first: 6000<br>
divide first &nbsp;: 0<br>
50 / 100 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0 &nbsp;&nbsp;(int / int keeps only the integer part)<br>
50.0 / 100 &nbsp;&nbsp;&nbsp;= 0.5</div>
<div class="pitfall"><p><strong>Bẫy 4 — khai trường bằng lớp cụ thể.</strong> <code>private InMemoryBookRepository bookRepository;</code> vẫn biên dịch và chạy y vậy — nhưng controller giờ có thể gọi cả những phương thức chỉ bản trong bộ nhớ mới có, và Lab 9 phải sửa nhiều hơn một dòng. Rubric kiểm đúng kiểu này.</p></div>
<p>Đường nối và các chính sách, chạy thật:</p>
<pre><code class="language-java">// release: 8
// Lab 5 — đường nối: CÙNG một đoạn code chạy trên hai kho khác nhau vì nó chỉ biết interface
import java.util.ArrayList;

interface IBookRepository {
    void addTitle(String title);
    ArrayList&lt;String&gt; findAll();
    String getStorageName();
}

class InMemoryBookRepository implements IBookRepository {
    private ArrayList&lt;String&gt; titleList = new ArrayList&lt;String&gt;();
    @Override public void addTitle(String title) { titleList.add(title); }
    @Override public ArrayList&lt;String&gt; findAll() { return new ArrayList&lt;String&gt;(titleList); }
    @Override public String getStorageName() { return "memory"; }
}

// bản đóng thế FileBookRepository của Lab 9: "ghi" ra mỗi dòng nó lưu
class FakeFileBookRepository implements IBookRepository {
    private ArrayList&lt;String&gt; lineList = new ArrayList&lt;String&gt;();
    @Override public void addTitle(String title) { lineList.add(title); System.out.println("  books.csv &lt;- " + title); }
    @Override public ArrayList&lt;String&gt; findAll() { return new ArrayList&lt;String&gt;(lineList); }
    @Override public String getStorageName() { return "file books.csv"; }
}

class Library {                                             // đóng vai controller: CHỈ biết interface
    private IBookRepository bookRepository;
    Library(IBookRepository bookRepository) { this.bookRepository = bookRepository; }
    void run() {
        bookRepository.addTitle("Effective Java");
        bookRepository.addTitle("Head First Java");
        System.out.println(bookRepository.getStorageName() + ": " + bookRepository.findAll());
    }
}

public class LabDoiKho {
    public static void main(String[] args) {
        new Library(new InMemoryBookRepository()).run();     // hôm nay
        new Library(new FakeFileBookRepository()).run();     // Lab 9: chỉ dòng này đổi
    }
}</code></pre>
<div class="out">memory: [Effective Java, Head First Java]<br>
&nbsp;&nbsp;books.csv &lt;- Effective Java<br>
&nbsp;&nbsp;books.csv &lt;- Head First Java<br>
file books.csv: [Effective Java, Head First Java]</div>
<pre><code class="language-java">// release: 8
// Lab 5 — IFeePolicy kiểu Strategy: một vòng lặp trên ArrayList&lt;IFeePolicy&gt;, cộng chính sách thứ ba viết bằng lớp ẨN DANH
import java.util.ArrayList;

interface IFeePolicy {
    String getPolicyName();
    int calculateFee(int daysLate, int lateFeePerDay);
}

class StudentFeePolicy implements IFeePolicy {
    @Override public String getPolicyName() { return "Sinh vien (giam 50%)"; }
    @Override public int calculateFee(int daysLate, int lateFeePerDay) { return daysLate * lateFeePerDay * 50 / 100; }
}

class StaffFeePolicy implements IFeePolicy {
    @Override public String getPolicyName() { return "Can bo (mien 2 ngay tre dau)"; }
    @Override public int calculateFee(int daysLate, int lateFeePerDay) { return Math.max(0, daysLate - 2) * lateFeePerDay; }
}

public class LabChinhSach {
    public static void main(String[] args) {
        ArrayList&lt;IFeePolicy&gt; feePolicyList = new ArrayList&lt;IFeePolicy&gt;();
        feePolicyList.add(new StudentFeePolicy());
        feePolicyList.add(new StaffFeePolicy());
        feePolicyList.add(new IFeePolicy() {                 // lớp ẩn danh: không tên, cài IFeePolicy ngay tại chỗ
            @Override public String getPolicyName() { return "Tuan le doc sach (mien phi)"; }
            @Override public int calculateFee(int daysLate, int lateFeePerDay) { return 0; }
        });
        for (IFeePolicy feePolicy : feePolicyList) {          // một cuốn sách trễ 6 ngày, 2000 đồng/ngày
            System.out.println(feePolicy.getPolicyName() + " -&gt; " + feePolicy.calculateFee(6, 2000)
                    + "   [" + feePolicy.getClass().getName() + "]");
        }
    }
}</code></pre>
<div class="out">Sinh vien (giam 50%) -&gt; 6000 &nbsp;&nbsp;[StudentFeePolicy]<br>
Can bo (mien 2 ngay tre dau) -&gt; 8000 &nbsp;&nbsp;[StaffFeePolicy]<br>
Tuan le doc sach (mien phi) -&gt; 0 &nbsp;&nbsp;[LabChinhSach$1]</div>`),
    bi(`<h2>7. Rubric (10 points) and self-check</h2>
<table>
<thead><tr><th>Part</th><th>Points</th><th>How it is checked</th></tr></thead>
<tbody>
<tr><td><code>abstract</code> LibraryItem, 6 abstract methods (5.1)</td><td>2</td><td>read + <code>new LibraryItem(…)</code> fails to compile</td></tr>
<tr><td><code>implements IBookRepository</code> + <code>@Override</code> (5.2)</td><td>2</td><td>read + javac</td></tr>
<tr><td>Controller field typed by the interface (5.3)</td><td>1</td><td>read</td></tr>
<tr><td>Student and staff fee rules (5.4, 5.5)</td><td>3</td><td>grader lines 33, 47, 61, 76, 103</td></tr>
<tr><td><code>lint.py</code> ✓ sạch</td><td>1</td><td><code>lint.py</code></td></tr>
<tr><td>Oral: "abstract class or interface?"</td><td>1</td><td>one question</td></tr>
</tbody>
</table>
<details><summary>1. Can an abstract class have a constructor? Who calls it?</summary><p class="dap-an">✅ Yes. Nobody can <code>new</code> it, but each subclass constructor calls it through <code>super(...)</code> to build the common part — <code>LibraryItem(id, title, year, copies)</code> is <code>protected</code> for exactly that.</p></details>
<details><summary>2. Which single line changes when Lab 9 saves to a file?</summary><p class="dap-an">✅ <code>bookRepository = new InMemoryBookRepository();</code> in <code>BookController</code>'s constructor becomes <code>new FileBookRepository(…)</code>. <code>Main</code>, the other controller methods and the service stay word for word.</p></details>
<details><summary>3. Why fullFee * 50 / 100 and not fullFee * (50 / 100)?</summary><p class="dap-an">✅ With <code>int</code>, <code>50 / 100</code> is 0, so the second form is always 0. Multiplying first keeps the precision until the final division.</p></details>`,
    `<h2>7. Rubric (10 điểm) và tự kiểm</h2>
<table>
<thead><tr><th>Phần</th><th>Điểm</th><th>Kiểm bằng</th></tr></thead>
<tbody>
<tr><td><code>abstract</code> LibraryItem, 6 phương thức trừu tượng (5.1)</td><td>2</td><td>đọc + <code>new LibraryItem(…)</code> không biên dịch được</td></tr>
<tr><td><code>implements IBookRepository</code> + <code>@Override</code> (5.2)</td><td>2</td><td>đọc + javac</td></tr>
<tr><td>Trường của controller mang kiểu interface (5.3)</td><td>1</td><td>đọc</td></tr>
<tr><td>Luật phí sinh viên và cán bộ (5.4, 5.5)</td><td>3</td><td>dòng 33, 47, 61, 76, 103 của bộ chấm</td></tr>
<tr><td><code>lint.py</code> ✓ sạch</td><td>1</td><td><code>lint.py</code></td></tr>
<tr><td>Vấn đáp: "lớp trừu tượng hay interface?"</td><td>1</td><td>một câu hỏi</td></tr>
</tbody>
</table>
<details><summary>1. Lớp trừu tượng có constructor không? Ai gọi nó?</summary><p class="dap-an">✅ Có. Không ai <code>new</code> được nó, nhưng constructor của mỗi lớp con gọi nó qua <code>super(...)</code> để dựng phần chung — <code>LibraryItem(id, title, year, copies)</code> là <code>protected</code> chính vì vậy.</p></details>
<details><summary>2. Khi Lab 9 lưu ra tệp, dòng duy nhất nào đổi?</summary><p class="dap-an">✅ <code>bookRepository = new InMemoryBookRepository();</code> trong constructor của <code>BookController</code> thành <code>new FileBookRepository(…)</code>. <code>Main</code>, các phương thức khác của controller và service giữ nguyên từng chữ.</p></details>
<details><summary>3. Vì sao fullFee * 50 / 100 mà không phải fullFee * (50 / 100)?</summary><p class="dap-an">✅ Với <code>int</code>, <code>50 / 100</code> bằng 0, nên dạng thứ hai luôn bằng 0. Nhân trước giữ được độ chính xác tới phép chia cuối cùng.</p></details>`),
    bi(`<h2>8. Extra challenges and what comes next</h2>
<ul>
<li>⭐ Add a third policy, <code>GuestFeePolicy</code> (full fee + 1,000 đ service charge if late): count the lines you change outside the new class.</li>
<li>⭐ Do for members what you did for books: <code>interface MemberRepository</code> + <code>InMemoryMemberRepository</code>. Which controller line changes?</li>
<li>⭐⭐ Give <code>LibraryItem</code> a <em>concrete</em> method <code>calculateLateFee(int daysKept)</code> that calls the abstract <code>getLoanDays()</code> and <code>getLateFeePerDay()</code> — that is the Template Method pattern (5.A-2). Where would CT Library call it, given that the controller never sees a model?</li>
</ul>
<div class="callout"><p><strong>Next — Lab 6 (after Chapter 6):</strong> borrowing for real, and when it fails. Checked business exceptions such as <code>ItemNotAvailableException</code> and <code>LoanLimitException</code>, thrown in the repository or service, caught in the controller, and a menu that never crashes.</p></div>`,
    `<h2>8. Thử thách thêm và việc tiếp theo</h2>
<ul>
<li>⭐ Thêm chính sách thứ ba <code>GuestFeePolicy</code> (khách: phí đầy đủ + 1.000 đ phí dịch vụ nếu trễ): đếm số dòng bạn phải đổi ngoài lớp mới.</li>
<li>⭐ Làm cho thành viên điều bạn đã làm cho sách: <code>interface MemberRepository</code> + <code>InMemoryMemberRepository</code>. Dòng nào trong controller đổi?</li>
<li>⭐⭐ Cho <code>LibraryItem</code> một phương thức <em>cụ thể</em> <code>calculateLateFee(int daysKept)</code> gọi hai phương thức trừu tượng <code>getLoanDays()</code> và <code>getLateFeePerDay()</code> — đó là mẫu Template Method (5.A-2). CT Library sẽ gọi nó ở đâu, khi controller không bao giờ thấy model?</li>
</ul>
<div class="callout"><p><strong>Tiếp theo — Lab 6 (sau Chương 6):</strong> mượn sách thật, và khi nó thất bại. Ngoại lệ nghiệp vụ kiểu checked như <code>ItemNotAvailableException</code>, <code>LoanLimitException</code>, ném ở repository hoặc service, bắt ở controller, và một menu không bao giờ sập.</p></div>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch5) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'An interface declares int MAX = 5; Which statement is TRUE?|||Một interface khai báo int MAX = 5; Câu nào ĐÚNG?',
      options: ['MAX is implicitly public static final: one constant, shared, and it cannot be changed|||MAX ngầm là public static final: một hằng, dùng chung, và không đổi được', 'Each implementing object gets its own copy of MAX|||Mỗi đối tượng hiện thực có một bản MAX riêng', 'An implementing class may assign MAX = 6 in its constructor|||Lớp hiện thực được gán MAX = 6 trong constructor của nó', 'It does not compile: interfaces cannot have fields|||Không biên dịch: interface không có trường được'],
      correctIndex: 0,
      points: 1,
      explanation: "Every interface field is implicitly public static final — javap of the slide's VNRemote prints \"public static final int price\". Static means one copy for everyone (B is wrong); final means \"cannot assign a value to final variable\" (C); and constant fields are exactly what an interface may hold (D).|||Mọi trường của interface ngầm là public static final — javap của VNRemote trên slide in ra \"public static final int price\". Static nghĩa là một bản cho tất cả (B sai); final nghĩa là \"cannot assign a value to final variable\" (C sai); và trường hằng đúng là thứ interface được phép chứa (D sai)." },
    { id: 'q2',
      question: '(FE question type) Interface Inty declares five methods. Class Classy declares implements Inty but implements none of the five. Which is true?|||(Dạng câu FE) Interface Inty khai báo năm phương thức. Lớp Classy khai báo implements Inty nhưng không hiện thực cái nào. Câu nào đúng?',
      options: ['The class compiles as it is|||Lớp biên dịch được như vậy', 'The class compiles if it is declared public|||Lớp biên dịch được nếu khai báo public', 'The class compiles if it is declared abstract|||Lớp biên dịch được nếu khai báo abstract', 'The class compiles if it is declared protected|||Lớp biên dịch được nếu khai báo protected'],
      correctIndex: 2,
      points: 1,
      explanation: 'A class that still has abstract methods must itself be abstract — otherwise javac says "Classy is not abstract and does not override abstract method …". Declaring it abstract postpones the five methods to a concrete subclass. Access modifiers change nothing (B), and a top-level class cannot even be protected (D).|||Lớp còn phương thức trừu tượng thì chính nó phải là abstract — không thì javac báo "Classy is not abstract and does not override abstract method …". Khai báo abstract là dời năm phương thức đó cho một lớp con cụ thể. Từ khoá phạm vi không thay đổi gì (B sai), và lớp cấp cao nhất còn không được là protected (D sai).' },
    { id: 'q3',
      question: '(FE question type) What happens when you compile and run this program?|||(Dạng câu FE) Điều gì xảy ra khi biên dịch và chạy chương trình này?',
      code: `interface A {
    void foo();
    void fun();
}
class B implements A {
    void foo() { System.out.print("B1"); }
    void fun() { System.out.print("B2"); }
}
public class Main {
    public static void main(String[] args) {
        A a = new B();
        a.foo();
        a.fun();
    }
}`,
      codeLang: 'java',
      options: ['The output is B1B2|||Output là B1B2', 'The output is B2B1|||Output là B2B1', 'It runs with no output|||Chạy mà không in gì', 'It does not compile|||Không biên dịch được'],
      correctIndex: 3,
      points: 1,
      explanation: "Interface methods are implicitly public. B's foo() and fun() have package access, which is weaker, so javac reports \"foo() in B cannot implement foo() in A — attempting to assign weaker access privileges; was public\". Adding public to both methods makes it print B1B2.|||Phương thức interface ngầm là public. foo() và fun() của B mang quyền package, hẹp hơn, nên javac báo \"foo() in B cannot implement foo() in A — attempting to assign weaker access privileges; was public\". Thêm public vào cả hai phương thức thì nó in B1B2." },
    { id: 'q4',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `abstract class A {
    public A() { System.out.print("Father "); }
    abstract public void out();
}
class B extends A {
    public B() { System.out.print("Son "); }
    @Override
    public void out() { System.out.println("out"); }
}
public class Q4 {
    public static void main(String[] args) {
        A a = new B();
        a.out();
    }
}`,
      codeLang: 'java',
      options: ['Son out|||Son out', 'Father Son out|||Father Son out', 'out|||out', 'Compile error: an abstract class cannot have a constructor|||Lỗi biên dịch: lớp trừu tượng không có constructor được'],
      correctIndex: 1,
      points: 1,
      explanation: "An abstract class cannot be instantiated, but it CAN have constructors — they run as part of creating a subclass object. new B() runs A() first (Father), then B()'s body (Son), then a.out() runs B's implementation (out).|||Lớp trừu tượng không tạo đối tượng được, nhưng nó CÓ THỂ có constructor — chúng chạy như một phần của việc tạo đối tượng lớp con. new B() chạy A() trước (Father), rồi thân của B() (Son), rồi a.out() chạy bản hiện thực của B (out)." },
    { id: 'q5',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `abstract class A {
    private int a, b;
    public void call(int a, int b) {
        this.a = a;
        this.b = b;
        System.out.println(a + b);
    }
}
public class Q5 {
    public static void main(String[] args) {
        A m = new A() { };
        m.call(12, 25);
    }
}`,
      codeLang: 'java',
      options: ['37|||37', '1225|||1225', '0|||0', 'Compile error at A m = new A() { };|||Lỗi biên dịch ở A m = new A() { };'],
      correctIndex: 0,
      points: 1,
      explanation: "A is abstract but has no abstract method, so new A() { } — an anonymous subclass with an empty body — is a complete class and compiles. call(12, 25) prints the parameters' sum, 37 (a + b inside call refers to the parameters, which shadow the fields). Compare slide 26: an abstract class does not need a method to be overridden to be usable.|||A là abstract nhưng không có phương thức trừu tượng nào, nên new A() { } — một lớp con ẩn danh có thân rỗng — là một lớp hoàn chỉnh và biên dịch được. call(12, 25) in tổng của hai tham số, 37 (a + b trong call là các tham số, chúng che các trường). So với slide 26: lớp trừu tượng không cần có phương thức bị ghi đè mới dùng được." },
    { id: 'q6',
      question: '(FE question type) Which declaration inside an interface does NOT compile on Java 8?|||(Dạng câu FE) Khai báo nào bên trong interface KHÔNG biên dịch được trên Java 8?',
      options: ['void close();|||void close();', 'public void empty();|||public void empty();', 'protected void open();|||protected void open();', 'default void lock() { }|||default void lock() { }'],
      correctIndex: 2,
      points: 1,
      explanation: 'Interface members are public; javac 8 says "modifier protected not allowed here". A is implicitly public abstract, B says the same explicitly, and D is a Java 8 default method with a body — all legal.|||Thành viên của interface là public; javac 8 báo "modifier protected not allowed here". A ngầm là public abstract, B nói điều đó tường minh, còn D là phương thức default có thân của Java 8 — đều hợp lệ.' },
    { id: 'q7',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `interface IA { void show(); }
interface IB { void show(); }
class MyClass implements IA, IB {
    @Override
    public void show() { System.out.println("@MyClass"); }
}
public class Q7 {
    public static void main(String[] args) {
        IA objA = new MyClass();
        objA.show();
    }
}`,
      codeLang: 'java',
      options: ['Compile error: show() is ambiguous|||Lỗi biên dịch: show() mơ hồ', '@MyClass|||@MyClass', 'Runtime error in objA.show()|||Lỗi lúc chạy ở objA.show()', 'Nothing is printed|||Không in gì'],
      correctIndex: 1,
      points: 1,
      explanation: 'Two interfaces may declare the same abstract method; one public show() in MyClass implements both, because there is no body to choose between. Ambiguity arises only with two DEFAULT methods (bodies) or two fields of the same name — slide 16 of deck "Polymorphism".|||Hai interface có thể khai báo cùng một phương thức trừu tượng; một show() public trong MyClass hiện thực cả hai, vì không có thân nào để phải chọn. Sự mơ hồ chỉ xảy ra với hai phương thức DEFAULT (có thân) hoặc hai trường cùng tên — slide 16 bộ "Polymorphism".' },
    { id: 'q8',
      question: 'What is printed on Java 8?|||Trên Java 8 chương trình in ra gì?',
      code: `interface Calc { int apply(int x); }
public class Q8 {
    public static void main(String[] args) {
        int base = 10;
        Calc c = new Calc() {
            public int apply(int x) { return x + base; }
        };
        System.out.println(c.apply(5) + " " + c.getClass().getName());
    }
}`,
      codeLang: 'java',
      options: ['15 Calc|||15 Calc', '15 Q8|||15 Q8', 'Compile error: base must be declared final|||Lỗi biên dịch: base phải khai báo final', '15 Q8$1|||15 Q8$1'],
      correctIndex: 3,
      points: 1,
      explanation: 'Since Java 8 an anonymous class may use a local variable that is never reassigned ("effectively final") without the word final, so it compiles (C was true only before Java 8). apply(5) returns 15. The class has no name; the compiler names it after its container plus a number: Q8$1 — the same rule as Anonymous1$1 on slide 25.|||Từ Java 8, lớp ẩn danh được dùng biến cục bộ không bao giờ bị gán lại ("thực chất là final") mà không cần chữ final, nên nó biên dịch được (C chỉ đúng trước Java 8). apply(5) trả 15. Lớp này không có tên; trình biên dịch đặt tên theo lớp chứa cộng một con số: Q8$1 — cùng luật với Anonymous1$1 ở slide 25.' },
    { id: 'q9',
      question: 'interface VN { static void setTimer(int n) { System.out.println("timer " + n); } } and class TV implements VN { }. Which call compiles?|||interface VN { static void setTimer(int n) { System.out.println("timer " + n); } } và class TV implements VN { }. Lời gọi nào biên dịch được?',
      options: ['VN.setTimer(5);|||VN.setTimer(5);', 'TV.setTimer(5);|||TV.setTimer(5);', 'new TV().setTimer(5);|||new TV().setTimer(5);', 'All three|||Cả ba'],
      correctIndex: 0,
      points: 1,
      explanation: 'A static method of an interface belongs to the interface only — it is NOT inherited by implementing classes (unlike a static method of a superclass). The real JDK 8 javac rejects both B and C with "cannot find symbol: method setTimer(int), location: class TV".|||Phương thức static của interface chỉ thuộc về interface — nó KHÔNG được lớp hiện thực kế thừa (khác với phương thức static của lớp cha). javac thật của JDK 8 từ chối cả B lẫn C với "cannot find symbol: method setTimer(int), location: class TV".' },
    { id: 'q10',
      question: 'Which statement about abstract classes and interfaces in Java 8 is TRUE?|||Câu nào về lớp trừu tượng và interface trong Java 8 là ĐÚNG?',
      options: ['An interface can declare a constructor for its implementing classes|||Interface có thể khai báo constructor cho các lớp hiện thực nó', 'An abstract class can have constructors, which run when a subclass object is created|||Lớp trừu tượng có thể có constructor, chúng chạy khi tạo đối tượng lớp con', 'An abstract class must contain at least one abstract method|||Lớp trừu tượng phải chứa ít nhất một phương thức trừu tượng', 'A class can extend two abstract classes if it implements all their methods|||Một lớp có thể extends hai lớp trừu tượng nếu nó hiện thực mọi phương thức của chúng'],
      correctIndex: 1,
      points: 1,
      explanation: "An abstract class is a real class with holes: fields, constructors (run through super(...)) and concrete methods are all allowed. Interfaces have no constructors (A). Slide 20's AbstractDemo2 is abstract with zero abstract methods (C). Java allows one superclass only, abstract or not (D) — several types come from interfaces.|||Lớp trừu tượng là một lớp thật có lỗ hổng: trường, constructor (chạy qua super(...)) và phương thức cụ thể đều được phép. Interface không có constructor (A sai). AbstractDemo2 ở slide 20 là abstract mà không có phương thức trừu tượng nào (C sai). Java chỉ cho một lớp cha, trừu tượng hay không (D sai) — nhiều kiểu thì lấy từ interface." },
  ],
};

export default {
  slides: [L_pro10_2],
  practice: L_on_ch5,
  labs: [L_lab5],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 5 viết lại theo dạng câu FE PRO192, mỗi câu có giải thích song ngữ; câu "in ra gì" đã chạy thật và câu lỗi biên dịch đã đo bằng javac của JDK 8: trường của interface là hằng, lớp implements thiếu phương thức, quên public khi hiện thực, constructor của lớp trừu tượng, lớp ẩn danh thân rỗng, protected trong interface, hai interface cùng một phương thức, lớp ẩn danh bắt giữ biến và tên Q8$1, phương thức static của interface, và so sánh lớp trừu tượng với interface.',
};
