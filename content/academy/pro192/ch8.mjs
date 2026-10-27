/**
 * PRO192 · Chương 8 — Collections (pro13).
 * Bài 📑 học theo từng slide: pro13 (tmp_13.pptx, slide 1–27).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: pro192-on-ch8.
 * Quiz viết lại (10 câu, giữ slug pro192-quiz-ch8).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 8.A — 📑 Slide by slide · Collections (1/2): framework, generics, List, ArrayList, LinkedList (slides 1–11) ───────── */
const L_pro13_1 = {
  title: '8.A — 📑 Slide by slide · Collections (1/2): framework, generics, List, ArrayList, LinkedList (slides 1–11)|||8.A — 📑 Học theo từng slide · Collections (1/2): khung, generics, List, ArrayList, LinkedList (slide 1–11)',
  slug: 'pro192-slide-pro13-1',
  type: 'VIDEO',
  description: 'Giảng slide 1–11 bộ "Collections" của trường: ba kiểu nhóm List/Set/Map chạy thật, lịch sử khung Collections (JDK 1.2 → generics Java 5 → Java 8 → List.of chỉ có từ Java 9), cây interface vẽ lại bằng UML, generics so với kiểu thô (lỗi ClassCastException lúc chạy và lỗi biên dịch trên JDK 8 thật), 13 phương thức của Collection gọi từng cái, bẫy remove(int) với remove(Object), lập trình theo interface, phương thức List và thông báo IndexOutOfBoundsException của JDK 8, tạo list nhanh trên JDK 8 (Arrays.asList cố định kích thước), ArrayList so với LinkedList (bộ nhớ, độ phức tạp, ngăn xếp/hàng đợi), ba cách duyệt và ConcurrentModificationException khi xoá trong for-each, chương trình Vector của slide chạy y ảnh và vì sao Vector không "lỗi thời từ Java 1.6".',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.A · school deck "Collections", slides 1–11</span>
<h2>From arrays you size by hand to lists that grow by themselves</h2>
<p class="lead">Chapter 7 kept objects in arrays: you choose the size, you shift elements by hand, you write your own search. The <strong>Java Collections Framework</strong> (package <code>java.util</code>) gives you ready-made, tested data structures behind a few interfaces. This lesson walks slides 1–11: the framework and its interfaces, <strong>generics</strong> (<code>List&lt;String&gt;</code>), the methods every collection has, and the <strong>List</strong> family — <code>ArrayList</code>, <code>LinkedList</code>, <code>Vector</code> — with the <code>Iterator</code>. Lesson 8.B (slides 12–27) covers <code>Set</code> and <code>Map</code>.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>what a collection is; why a framework</td><td>pick List, Set or Map for a problem in one sentence</td></tr>
<tr><td>5–7</td><td>the interface tree; generics; the methods of Collection</td><td>read <code>List&lt;E&gt;</code>, <code>Map&lt;K,V&gt;</code> and know why the compiler now catches type mistakes</td></tr>
<tr><td>8–9</td><td>List; ArrayList, LinkedList, Vector</td><td>use index methods without IndexOutOfBoundsException, and choose ArrayList vs LinkedList</td></tr>
<tr><td>10–11</td><td>traversing with Iterator; Vector</td><td>remove elements while looping without ConcurrentModificationException</td></tr>
</tbody>
</table>
<div class="callout"><strong>JDK 8 in the exam room.</strong> Everything here compiles with <code>--release 8</code> and was run on a real JDK 8 — so no <code>List.of(...)</code> (Java 9) and no <code>var</code>. Where JDK 8 prints a different message from JDK 17/21, you see the JDK 8 one.</div>`,
    `<span class="eyebrow">Chương 8 · Bài 8.A · bộ slide "Collections" của trường, slide 1–11</span>
<h2>Từ mảng phải tự định cỡ tới danh sách tự lớn lên</h2>
<p class="lead">Chương 7 giữ đối tượng trong mảng: bạn tự chọn kích thước, tự dời phần tử, tự viết hàm tìm. <strong>Java Collections Framework</strong> (khung tập hợp của Java, gói <code>java.util</code>) cho bạn các cấu trúc dữ liệu làm sẵn, đã kiểm kỹ, nằm sau vài interface. Bài này giảng slide 1–11: khung và các interface của nó, <strong>generics</strong> (kiểu tổng quát — <code>List&lt;String&gt;</code>), các phương thức mọi collection đều có, và họ <strong>List</strong> — <code>ArrayList</code>, <code>LinkedList</code>, <code>Vector</code> — cùng <code>Iterator</code> (bộ duyệt). Bài 8.B (slide 12–27) giảng <code>Set</code> và <code>Map</code>.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>collection là gì; vì sao cần một khung</td><td>chọn List, Set hay Map cho một bài toán trong một câu</td></tr>
<tr><td>5–7</td><td>cây interface; generics; phương thức của Collection</td><td>đọc <code>List&lt;E&gt;</code>, <code>Map&lt;K,V&gt;</code> và hiểu vì sao giờ trình biên dịch bắt được lỗi sai kiểu</td></tr>
<tr><td>8–9</td><td>List; ArrayList, LinkedList, Vector</td><td>dùng phương thức chỉ số mà không dính IndexOutOfBoundsException, và chọn ArrayList hay LinkedList</td></tr>
<tr><td>10–11</td><td>duyệt bằng Iterator; Vector</td><td>xoá phần tử trong lúc lặp mà không dính ConcurrentModificationException</td></tr>
</tbody>
</table>
<div class="callout"><strong>JDK 8 ở phòng thi.</strong> Mọi thứ ở đây biên dịch với <code>--release 8</code> và đã chạy trên JDK 8 thật — nên không có <code>List.of(...)</code> (Java 9) và không có <code>var</code>. Chỗ nào JDK 8 in thông báo khác JDK 17/21, bạn thấy đúng bản của JDK 8.</div>`),
    walkHead('pro13', 1, 11),
    walk('pro13', [
      [1, 'Collections',
        `<p class="y-chinh">🎯 Title slide: "Collections", with a link to Oracle's tutorial trail on collections (docs.oracle.com/javase/tutorial/collections).</p>
<p>The link still works but now redirects to <strong>https</strong>; that tutorial was written for JDK 8 and is no longer updated — which is fine for PRO192, because the exam machine runs JDK 8. Oracle's current tutorials are on <em>dev.java</em>.</p>
<p>Where this chapter is used later: PE question 3 of many papers ("implement <code>f1(List&lt;Ladder&gt; t)</code>, <code>f2</code>, <code>f3</code>"), every 10-mark <code>Q1</code> program that keeps an <code>ArrayList</code> of objects, every LAB211 manager program, and later CSD201 (how these structures work inside) and Spring Boot (<code>List&lt;Student&gt;</code> returned from a repository).</p>
<p class="meo">🧠 One sentence for the whole deck: <em>a collection is one object that holds many references, and you choose the kind by the rule you need — order (List), no duplicates (Set), or lookup by key (Map).</em></p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: "Collections" (tập hợp), kèm link tới chuỗi bài hướng dẫn về collections của Oracle (docs.oracle.com/javase/tutorial/collections).</p>
<p>Link vẫn mở được nhưng giờ tự chuyển sang <strong>https</strong>; bộ hướng dẫn đó viết cho JDK 8 và không còn cập nhật — vẫn ổn cho PRO192, vì máy phòng thi chạy JDK 8. Hướng dẫn hiện hành của Oracle nằm ở <em>dev.java</em>.</p>
<p>Chương này được dùng về sau ở đâu: câu 3 của nhiều đề PE ("hiện thực <code>f1(List&lt;Ladder&gt; t)</code>, <code>f2</code>, <code>f3</code>"), mọi chương trình <code>Q1</code> 10 điểm giữ một <code>ArrayList</code> đối tượng, mọi chương trình quản lý của LAB211, rồi CSD201 (bên trong các cấu trúc này chạy thế nào) và Spring Boot (<code>List&lt;Student&gt;</code> trả về từ repository).</p>
<p class="meo">🧠 Một câu cho cả bộ slide: <em>collection là một đối tượng giữ nhiều tham chiếu, và bạn chọn loại theo luật mình cần — có thứ tự (List), không trùng (Set), hay tra theo khoá (Map).</em></p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 The deck's goal: the Collections Framework in package <code>java.util</code> — <strong>List</strong> (ArrayList, Vector): duplicates allowed; <strong>Set</strong> (HashSet, TreeSet): duplicates not allowed; <strong>Map</strong> (HashMap, TreeMap): key–value pairs.</p>
<p>"Duplicates are agreed" on the slide means "duplicates are <em>allowed</em>". The three kinds, fed the same five names — two of them repeated:</p>
<pre><code class="language-java">// release: 8
// Slide 2: the three kinds of group — the same five names put into a List, a Set and a Map
import java.util.*;

public class BaNhom {
    public static void main(String[] args) {
        String[] names = { "An", "Binh", "An", "Chi", "Binh" };

        List&lt;String&gt; list = new ArrayList&lt;String&gt;();       // duplicates are agreed
        Set&lt;String&gt; set = new TreeSet&lt;String&gt;();            // duplicates are not agreed
        Map&lt;String, Integer&gt; map = new TreeMap&lt;String, Integer&gt;(); // key -&gt; value (here: how many times)

        for (String n : names) {
            list.add(n);
            boolean added = set.add(n);                      // add() tells you whether the set changed
            if (!added) System.out.println("set refused duplicate: " + n);
            Integer old = map.get(n);
            map.put(n, old == null ? 1 : old + 1);
        }
        System.out.println("List " + list.size() + " " + list);
        System.out.println("Set  " + set.size() + " " + set);
        System.out.println("Map  " + map.size() + " " + map);
        System.out.println("list.get(2) = " + list.get(2) + ", map.get(\\"Binh\\") = " + map.get("Binh"));
    }
}</code></pre>
<div class="out">set refused duplicate: An<br>
set refused duplicate: Binh<br>
List 5 [An, Binh, An, Chi, Binh]<br>
Set &nbsp;3 [An, Binh, Chi]<br>
Map &nbsp;3 {An=2, Binh=2, Chi=1}<br>
list.get(2) = An, map.get("Binh") = 2</div>
<p>Read the output line by line: the List kept all five in insertion order; the Set refused the second "An" and the second "Binh" — <code>add</code> returned <code>false</code>; the Map kept one entry per name and we used the value to count. The <code>TreeSet</code>/<code>TreeMap</code> print in alphabetical order; lesson 8.B shows that a <code>HashSet</code> would not.</p>
<div class="pitfall">FE: "Which collection does not allow duplicates?" → <strong>Set</strong>. "Which stores key/value pairs?" → <strong>Map</strong>. "Which keeps insertion order and allows duplicates?" → <strong>List</strong>. Learn the three answers as a table, not as words.</div>`,
        `<p class="y-chinh">🎯 Mục tiêu của bộ slide: Collections Framework trong gói <code>java.util</code> — <strong>List</strong> (ArrayList, Vector): cho phép trùng; <strong>Set</strong> (HashSet, TreeSet): không cho trùng; <strong>Map</strong> (HashMap, TreeMap): cặp khoá–giá trị.</p>
<p>"Duplicates are agreed" trên slide nghĩa là "cho <em>phép</em> trùng" (chữ đúng là <em>allowed</em>). Ba loại, cùng nhận năm cái tên — có hai tên lặp lại:</p>
<pre><code class="language-java">// release: 8
// Slide 2: ba kiểu nhóm — cùng năm cái tên bỏ vào một List, một Set và một Map
import java.util.*;

public class BaNhom {
    public static void main(String[] args) {
        String[] names = { "An", "Binh", "An", "Chi", "Binh" };

        List&lt;String&gt; list = new ArrayList&lt;String&gt;();       // cho phép trùng
        Set&lt;String&gt; set = new TreeSet&lt;String&gt;();            // không cho trùng
        Map&lt;String, Integer&gt; map = new TreeMap&lt;String, Integer&gt;(); // khoá -&gt; giá trị (ở đây: số lần)

        for (String n : names) {
            list.add(n);
            boolean added = set.add(n);                      // add() cho biết tập có thay đổi không
            if (!added) System.out.println("set refused duplicate: " + n);
            Integer old = map.get(n);
            map.put(n, old == null ? 1 : old + 1);
        }
        System.out.println("List " + list.size() + " " + list);
        System.out.println("Set  " + set.size() + " " + set);
        System.out.println("Map  " + map.size() + " " + map);
        System.out.println("list.get(2) = " + list.get(2) + ", map.get(\\"Binh\\") = " + map.get("Binh"));
    }
}</code></pre>
<div class="out">set refused duplicate: An<br>
set refused duplicate: Binh<br>
List 5 [An, Binh, An, Chi, Binh]<br>
Set &nbsp;3 [An, Binh, Chi]<br>
Map &nbsp;3 {An=2, Binh=2, Chi=1}<br>
list.get(2) = An, map.get("Binh") = 2</div>
<p>Đọc output từng dòng: List giữ cả năm theo thứ tự thêm; Set từ chối "An" thứ hai và "Binh" thứ hai — <code>add</code> trả về <code>false</code>; Map giữ mỗi tên một mục và ta dùng giá trị để đếm. <code>TreeSet</code>/<code>TreeMap</code> in theo thứ tự chữ cái; bài 8.B cho thấy <code>HashSet</code> thì không.</p>
<div class="pitfall">FE: "Collection nào không cho phép trùng?" → <strong>Set</strong>. "Cái nào lưu cặp khoá/giá trị?" → <strong>Map</strong>. "Cái nào giữ thứ tự thêm và cho phép trùng?" → <strong>List</strong>. Học ba câu trả lời thành một bảng, đừng học thành chữ.</div>`],
      [3, 'The Collections Framework',
        `<p class="y-chinh">🎯 A <strong>collection</strong> is an object that represents a group of objects. The <strong>Collections Framework</strong> is a unified architecture for representing and manipulating collections. As a whole it is <strong>not thread-safe</strong>.</p>
<p>"The Java 2 platform includes a <em>new</em> collections framework" was news in <strong>1998</strong>. A short history, so the old words on the slides make sense:</p>
<table>
<thead><tr><th>Version (year)</th><th>What arrived</th><th>Seen in this deck</th></tr></thead>
<tbody>
<tr><td>JDK 1.0 (1996)</td><td><code>Vector</code>, <code>Hashtable</code>, <code>Enumeration</code></td><td>slide 11 (Vector)</td></tr>
<tr><td>JDK 1.2 = "Java 2" (1998)</td><td>the Collections Framework: <code>Collection</code>, <code>List</code>, <code>Set</code>, <code>Map</code>, <code>ArrayList</code>, <code>HashMap</code>, <code>TreeSet</code>, <code>Iterator</code>, class <code>Collections</code></td><td>the whole deck</td></tr>
<tr><td>Java 5 (2004)</td><td><strong>generics</strong> <code>List&lt;String&gt;</code>, for-each loop, autoboxing</td><td>slide 5 — the slides' code still uses raw types</td></tr>
<tr><td>Java 8 (2014) — the PE JDK</td><td>lambdas, <code>forEach</code>, <code>removeIf</code>, <code>Map.getOrDefault</code>, streams</td><td>➕ in these lessons</td></tr>
<tr><td>Java 9 (2017)</td><td><code>List.of</code>, <code>Set.of</code>, <code>Map.of</code> (JEP 269)</td><td>⛔ not on the PE machine — slide 8</td></tr>
</tbody>
</table>
<p>"Not thread-safe" means: if two threads change the same <code>ArrayList</code> or <code>HashMap</code> at the same time, its data can be corrupted. Only the old <code>Vector</code>/<code>Hashtable</code> lock every method. ➕ For real multi-threaded code (later, in Spring Boot services) you use <code>Collections.synchronizedList(...)</code> or the classes of <code>java.util.concurrent</code> such as <code>ConcurrentHashMap</code>. PRO192 programs are single-threaded, so the plain classes are right.</p>`,
        `<p class="y-chinh">🎯 Một <strong>collection</strong> là một đối tượng đại diện cho một nhóm đối tượng. <strong>Collections Framework</strong> là một kiến trúc thống nhất để biểu diễn và thao tác collection. Xét tổng thể nó <strong>không an toàn luồng</strong> (not thread-safe).</p>
<p>"Nền tảng Java 2 có một khung collections <em>mới</em>" là tin mới của năm <strong>1998</strong>. Một chút lịch sử để các chữ cũ trên slide có nghĩa:</p>
<table>
<thead><tr><th>Phiên bản (năm)</th><th>Thứ được thêm</th><th>Thấy ở đâu trong bộ slide</th></tr></thead>
<tbody>
<tr><td>JDK 1.0 (1996)</td><td><code>Vector</code>, <code>Hashtable</code>, <code>Enumeration</code></td><td>slide 11 (Vector)</td></tr>
<tr><td>JDK 1.2 = "Java 2" (1998)</td><td>Collections Framework: <code>Collection</code>, <code>List</code>, <code>Set</code>, <code>Map</code>, <code>ArrayList</code>, <code>HashMap</code>, <code>TreeSet</code>, <code>Iterator</code>, lớp <code>Collections</code></td><td>cả bộ slide</td></tr>
<tr><td>Java 5 (2004)</td><td><strong>generics</strong> <code>List&lt;String&gt;</code>, vòng for-each, tự đóng hộp (autoboxing)</td><td>slide 5 — code trên slide vẫn dùng kiểu thô</td></tr>
<tr><td>Java 8 (2014) — JDK của PE</td><td>lambda, <code>forEach</code>, <code>removeIf</code>, <code>Map.getOrDefault</code>, stream</td><td>➕ trong các bài này</td></tr>
<tr><td>Java 9 (2017)</td><td><code>List.of</code>, <code>Set.of</code>, <code>Map.of</code> (JEP 269)</td><td>⛔ không có trên máy thi PE — slide 8</td></tr>
</tbody>
</table>
<p>"Không an toàn luồng" nghĩa là: nếu hai luồng (thread) cùng sửa một <code>ArrayList</code> hay <code>HashMap</code> một lúc, dữ liệu bên trong có thể hỏng. Chỉ <code>Vector</code>/<code>Hashtable</code> đời cũ khoá mọi phương thức. ➕ Với code đa luồng thật (sau này, trong service Spring Boot) bạn dùng <code>Collections.synchronizedList(...)</code> hoặc các lớp của <code>java.util.concurrent</code> như <code>ConcurrentHashMap</code>. Chương trình PRO192 chạy một luồng, nên các lớp thường là đúng.</p>`],
      [4, 'The Collections Framework…',
        `<p class="y-chinh">🎯 Six benefits: less programming effort (data structures and algorithms are written for you), more performance (good implementations), interoperability between unrelated APIs (a common language to pass collections), less effort to learn APIs, less effort to design APIs, and software reuse.</p>
<p>Two of them are easy to see in code. <strong>Performance by switching implementations</strong> and <strong>interoperability</strong>: the method below takes any <code>List&lt;Double&gt;</code>, so the caller can hand it an <code>ArrayList</code>, a <code>LinkedList</code> or a <code>Vector</code> without changing one line of it; the same goes for <code>Map</code>:</p>
<pre><code class="language-java">// release: 8
// Slide 7: central interfaces vs common classes — declare the variable with the INTERFACE type, choose the class in one place
import java.util.*;

public class LapTrinhTheoGiaoDien {
    // works for ANY List: ArrayList, LinkedList, Vector…
    static double average(List&lt;Double&gt; marks) {
        double sum = 0;
        for (double m : marks) sum += m;
        return marks.isEmpty() ? 0 : sum / marks.size();
    }

    public static void main(String[] args) {
        List&lt;Double&gt; a = new ArrayList&lt;Double&gt;();
        List&lt;Double&gt; b = new LinkedList&lt;Double&gt;();
        List&lt;Double&gt; c = new Vector&lt;Double&gt;();
        for (List&lt;Double&gt; marks : Arrays.asList(a, b, c)) {
            marks.add(7.5); marks.add(9.0); marks.add(6.0);
            System.out.println(marks.getClass().getSimpleName() + " " + marks + " average " + average(marks));
        }
        Map&lt;String, Integer&gt; m1 = new HashMap&lt;String, Integer&gt;();
        Map&lt;String, Integer&gt; m2 = new TreeMap&lt;String, Integer&gt;();
        for (Map&lt;String, Integer&gt; m : Arrays.asList(m1, m2)) {
            m.put("PRO192", 3); m.put("CSD201", 3); m.put("MAE101", 3);
            System.out.println(m.getClass().getSimpleName() + " keySet()=" + m.keySet() + " values()=" + m.values());
        }
    }
}</code></pre>
<div class="out">ArrayList [7.5, 9.0, 6.0] average 7.5<br>
LinkedList [7.5, 9.0, 6.0] average 7.5<br>
Vector [7.5, 9.0, 6.0] average 7.5<br>
HashMap keySet()=[PRO192, MAE101, CSD201] values()=[3, 3, 3]<br>
TreeMap keySet()=[CSD201, MAE101, PRO192] values()=[3, 3, 3]</div>
<p>This is the habit to copy: declare the variable or parameter with the <strong>interface</strong> type (<code>List&lt;Double&gt; marks = new ArrayList&lt;Double&gt;()</code>) and name the class only after <code>new</code>. Changing <code>ArrayList</code> to <code>LinkedList</code> is then a one-word edit. Notice also that the <code>HashMap</code> line prints its keys in a different order from the <code>TreeMap</code> line — slides 18 and 24 explain why.</p>
<p class="meo">🧠 The other four benefits are one idea: everybody learns the same twenty methods (<code>add</code>, <code>size</code>, <code>contains</code>…), so your class, the PE grader's <code>Main</code> and Spring's libraries can pass a <code>List</code> to each other.</p>`,
        `<p class="y-chinh">🎯 Sáu lợi ích: bớt công lập trình (cấu trúc dữ liệu và thuật toán đã viết sẵn), hiệu năng cao hơn (cài đặt tốt), tương thích giữa các API không liên quan (một ngôn ngữ chung để truyền collection qua lại), bớt công học API, bớt công thiết kế API, và tái sử dụng phần mềm.</p>
<p>Hai lợi ích trong số đó dễ thấy bằng code. <strong>Hiệu năng nhờ đổi cài đặt</strong> và <strong>tính tương thích</strong>: phương thức dưới đây nhận mọi <code>List&lt;Double&gt;</code>, nên nơi gọi có thể đưa nó một <code>ArrayList</code>, một <code>LinkedList</code> hay một <code>Vector</code> mà không sửa một dòng nào của nó; <code>Map</code> cũng vậy:</p>
<pre><code class="language-java">// release: 8
// Slide 7: interface trung tâm và lớp thường dùng — khai báo biến bằng kiểu INTERFACE, chọn lớp ở đúng một chỗ
import java.util.*;

public class LapTrinhTheoGiaoDien {
    // chạy được với MỌI List
    static double average(List&lt;Double&gt; marks) {
        double sum = 0;
        for (double m : marks) sum += m;
        return marks.isEmpty() ? 0 : sum / marks.size();
    }

    public static void main(String[] args) {
        List&lt;Double&gt; a = new ArrayList&lt;Double&gt;();
        List&lt;Double&gt; b = new LinkedList&lt;Double&gt;();
        List&lt;Double&gt; c = new Vector&lt;Double&gt;();
        for (List&lt;Double&gt; marks : Arrays.asList(a, b, c)) {
            marks.add(7.5); marks.add(9.0); marks.add(6.0);
            System.out.println(marks.getClass().getSimpleName() + " " + marks + " average " + average(marks));
        }
        Map&lt;String, Integer&gt; m1 = new HashMap&lt;String, Integer&gt;();
        Map&lt;String, Integer&gt; m2 = new TreeMap&lt;String, Integer&gt;();
        for (Map&lt;String, Integer&gt; m : Arrays.asList(m1, m2)) {
            m.put("PRO192", 3); m.put("CSD201", 3); m.put("MAE101", 3);
            System.out.println(m.getClass().getSimpleName() + " keySet()=" + m.keySet() + " values()=" + m.values());
        }
    }
}</code></pre>
<div class="out">ArrayList [7.5, 9.0, 6.0] average 7.5<br>
LinkedList [7.5, 9.0, 6.0] average 7.5<br>
Vector [7.5, 9.0, 6.0] average 7.5<br>
HashMap keySet()=[PRO192, MAE101, CSD201] values()=[3, 3, 3]<br>
TreeMap keySet()=[CSD201, MAE101, PRO192] values()=[3, 3, 3]</div>
<p>Đây là thói quen nên chép: khai báo biến hay tham số bằng kiểu <strong>interface</strong> (<code>List&lt;Double&gt; marks = new ArrayList&lt;Double&gt;()</code>) và chỉ gọi tên lớp sau chữ <code>new</code>. Khi đó đổi <code>ArrayList</code> thành <code>LinkedList</code> chỉ là sửa một từ. Để ý thêm: dòng <code>HashMap</code> in khoá theo thứ tự khác dòng <code>TreeMap</code> — slide 18 và 24 giải thích vì sao.</p>
<p class="meo">🧠 Bốn lợi ích còn lại là một ý: ai cũng học cùng khoảng hai mươi phương thức (<code>add</code>, <code>size</code>, <code>contains</code>…), nên lớp của bạn, lớp <code>Main</code> của máy chấm PE và thư viện của Spring truyền được <code>List</code> cho nhau.</p>`],
      [5, 'Collection Interfaces',
        `<p class="y-chinh">🎯 The interface tree: <code>Iterable&lt;T&gt;</code> → <code>Collection&lt;E&gt;</code> → <code>List</code>, <code>Queue</code> (→ <code>Deque</code>), <code>Set</code> (→ <code>SortedSet</code> → <code>NavigableSet</code>); and separately <code>Map&lt;K,V&gt;</code> → <code>SortedMap</code> → <code>NavigableMap</code>. The letters are <strong>type parameters</strong>: T type, E element, K key, V value. Common operations: add, remove, search, clear.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0356ed696bea6d8ab70cbdc0d44497a175df059a.svg" alt="Slide 5 redrawn as UML: every arrow is &quot;extends&quot;; Map is a separate tree" loading="lazy" /><p class="chu-thich">🧩 Slide 5 redrawn as UML: every arrow is "extends"; Map is a separate tree</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 5 — the collection interfaces of java.util (Java 8), as a UML diagram
' Solid line with hollow triangle between interfaces = extends
interface "Iterable&lt;T&gt;" as Iterable &lt;&lt;java.lang&gt;&gt; {
  + iterator() : Iterator&lt;T&gt;
}
interface "Collection&lt;E&gt;" as Collection {
  + add(e : E) : boolean
  + remove(o : Object) : boolean
  + contains(o : Object) : boolean
  + size() : int
}
interface "List&lt;E&gt;" as List {
  + get(index : int) : E
  + add(index : int, e : E) : void
}
interface "Set&lt;E&gt;" as Set
interface "Queue&lt;E&gt;" as Queue {
  + offer(e : E) : boolean
  + poll() : E
}
interface "Deque&lt;E&gt;" as Deque
interface "SortedSet&lt;E&gt;" as SortedSet
interface "NavigableSet&lt;E&gt;" as NavigableSet
interface "Map&lt;K,V&gt;" as Map {
  + put(key : K, value : V) : V
  + get(key : Object) : V
  + keySet() : Set&lt;K&gt;
  + values() : Collection&lt;V&gt;
}
interface "SortedMap&lt;K,V&gt;" as SortedMap
interface "NavigableMap&lt;K,V&gt;" as NavigableMap
Iterable &lt;|-- Collection
Collection &lt;|-- List
Collection &lt;|-- Set
Collection &lt;|-- Queue
Queue &lt;|-- Deque
Set &lt;|-- SortedSet
SortedSet &lt;|-- NavigableSet
Map &lt;|-- SortedMap
SortedMap &lt;|-- NavigableMap
note bottom of Map
  Map does NOT extend Collection:
  its elements are &lt;key, value&gt; pairs
end note
@enduml</code></pre></details>
<p>The green box says "details in the topic Generic". The short version, run on a real JDK 8: the same mistake — a number put into a list of names — with a <strong>raw</strong> list (no <code>&lt;&gt;</code>, as the slides write it) and with <code>List&lt;String&gt;</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== 1. raw ArrayList (no &lt;E&gt;): the compiler cannot check anything ==");
    viet(d, "Raw.java",
        "import java.util.*;\\n" +
        "public class Raw {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List names = new ArrayList();\\n" +
        "        names.add(\\"An\\");\\n" +
        "        names.add(2005);              // a mistake: a number in a list of names\\n" +
        "        for (int i = 0; i &lt; names.size(); i++) {\\n" +
        "            String s = (String) names.get(i);\\n" +
        "            System.out.println(s.toUpperCase());\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Raw.java");
    lenh(d, "javac", "-Xlint:unchecked", "Raw.java");
    lenh(d, "java", "Raw");

    System.out.println("== 2. the same mistake with List&lt;String&gt;: caught before the program exists ==");
    viet(d, "Gen.java",
        "import java.util.*;\\n" +
        "public class Gen {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;String&gt; names = new ArrayList&lt;String&gt;();\\n" +
        "        names.add(\\"An\\");\\n" +
        "        names.add(2005);\\n" +
        "        for (String s : names) System.out.println(s.toUpperCase());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Gen.java");
}</code></pre>
<div class="out">== 1. raw ArrayList (no &lt;E&gt;): the compiler cannot check anything ==<br>
&gt; javac Raw.java<br>
Note: Raw.java uses unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; javac -Xlint:unchecked Raw.java<br>
Raw.java:5: warning: [unchecked] unchecked call to add(E) as a member of the raw type List<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;names.add("An");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;where E is a type-variable:<br>
&nbsp;&nbsp;&nbsp;&nbsp;E extends Object declared in interface List<br>
Raw.java:6: warning: [unchecked] unchecked call to add(E) as a member of the raw type List<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;names.add(2005); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a mistake: a number in a list of names<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;where E is a type-variable:<br>
&nbsp;&nbsp;&nbsp;&nbsp;E extends Object declared in interface List<br>
2 warnings<br>
&gt; java Raw<br>
AN<br>
Exception in thread "main" java.lang.ClassCastException: java.lang.Integer cannot be cast to java.lang.String<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
== 2. the same mistake with List&lt;String&gt;: caught before the program exists ==<br>
&gt; javac Gen.java<br>
Gen.java:6: error: no suitable method found for add(int)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;names.add(2005);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;method Collection.add(String) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(argument mismatch; int cannot be converted to String)<br>
&nbsp;&nbsp;&nbsp;&nbsp;method List.add(String) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(argument mismatch; int cannot be converted to String)<br>
Note: Some messages have been simplified; recompile with -Xdiags:verbose to get full output<br>
1 error<br>
(exit code 1)</div>
<p>With the raw list, javac only prints a "Note: … unchecked or unsafe operations" and the program crashes <em>at run time</em> with <code>ClassCastException</code> — after printing "AN", i.e. in the middle of the job. With <code>List&lt;String&gt;</code> the same line is a <strong>compile error</strong>: the bug never reaches a user. That is the whole point of generics. ➕ Type arguments must be classes: <code>List&lt;int&gt;</code> does not compile, write <code>List&lt;Integer&gt;</code> — Java converts <code>int</code> ↔ <code>Integer</code> for you (autoboxing).</p>
<div class="pitfall">Queue and Deque are "restricted lists" in the slide's words: you normally touch only the ends (offer/poll at the back and front). Slide 9 runs them with <code>LinkedList</code>.</div>`,
        `<p class="y-chinh">🎯 Cây interface: <code>Iterable&lt;T&gt;</code> → <code>Collection&lt;E&gt;</code> → <code>List</code>, <code>Queue</code> (→ <code>Deque</code>), <code>Set</code> (→ <code>SortedSet</code> → <code>NavigableSet</code>); và tách riêng <code>Map&lt;K,V&gt;</code> → <code>SortedMap</code> → <code>NavigableMap</code>. Các chữ cái là <strong>tham số kiểu</strong> (type parameter): T kiểu, E phần tử (element), K khoá (key), V giá trị (value). Thao tác chung: thêm, xoá, tìm, xoá hết.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0356ed696bea6d8ab70cbdc0d44497a175df059a.svg" alt="Slide 5 vẽ lại bằng UML: mọi mũi tên là &quot;extends&quot;; Map là một cây riêng" loading="lazy" /><p class="chu-thich">🧩 Slide 5 vẽ lại bằng UML: mọi mũi tên là "extends"; Map là một cây riêng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 5 — the collection interfaces of java.util (Java 8), as a UML diagram
' Nét liền tam giác rỗng giữa hai interface = extends
interface "Iterable&lt;T&gt;" as Iterable &lt;&lt;java.lang&gt;&gt; {
  + iterator() : Iterator&lt;T&gt;
}
interface "Collection&lt;E&gt;" as Collection {
  + add(e : E) : boolean
  + remove(o : Object) : boolean
  + contains(o : Object) : boolean
  + size() : int
}
interface "List&lt;E&gt;" as List {
  + get(index : int) : E
  + add(index : int, e : E) : void
}
interface "Set&lt;E&gt;" as Set
interface "Queue&lt;E&gt;" as Queue {
  + offer(e : E) : boolean
  + poll() : E
}
interface "Deque&lt;E&gt;" as Deque
interface "SortedSet&lt;E&gt;" as SortedSet
interface "NavigableSet&lt;E&gt;" as NavigableSet
interface "Map&lt;K,V&gt;" as Map {
  + put(key : K, value : V) : V
  + get(key : Object) : V
  + keySet() : Set&lt;K&gt;
  + values() : Collection&lt;V&gt;
}
interface "SortedMap&lt;K,V&gt;" as SortedMap
interface "NavigableMap&lt;K,V&gt;" as NavigableMap
Iterable &lt;|-- Collection
Collection &lt;|-- List
Collection &lt;|-- Set
Collection &lt;|-- Queue
Queue &lt;|-- Deque
Set &lt;|-- SortedSet
SortedSet &lt;|-- NavigableSet
Map &lt;|-- SortedMap
SortedMap &lt;|-- NavigableMap
note bottom of Map
  Map does NOT extend Collection:
  its elements are &lt;key, value&gt; pairs
end note
@enduml</code></pre></details>
<p>Hộp xanh lá nói "chi tiết ở chủ đề Generic". Bản ngắn, chạy trên JDK 8 thật: cùng một lỗi — bỏ một con số vào danh sách tên — với list <strong>kiểu thô</strong> (raw type, không có <code>&lt;&gt;</code>, như slide viết) và với <code>List&lt;String&gt;</code>:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== 1. raw ArrayList (no &lt;E&gt;): the compiler cannot check anything ==");
    viet(d, "Raw.java",
        "import java.util.*;\\n" +
        "public class Raw {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List names = new ArrayList();\\n" +
        "        names.add(\\"An\\");\\n" +
        "        names.add(2005);              // a mistake: a number in a list of names\\n" +
        "        for (int i = 0; i &lt; names.size(); i++) {\\n" +
        "            String s = (String) names.get(i);\\n" +
        "            System.out.println(s.toUpperCase());\\n" +
        "        }\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Raw.java");
    lenh(d, "javac", "-Xlint:unchecked", "Raw.java");
    lenh(d, "java", "Raw");

    System.out.println("== 2. the same mistake with List&lt;String&gt;: caught before the program exists ==");
    viet(d, "Gen.java",
        "import java.util.*;\\n" +
        "public class Gen {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;String&gt; names = new ArrayList&lt;String&gt;();\\n" +
        "        names.add(\\"An\\");\\n" +
        "        names.add(2005);\\n" +
        "        for (String s : names) System.out.println(s.toUpperCase());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Gen.java");
}</code></pre>
<div class="out">== 1. raw ArrayList (no &lt;E&gt;): the compiler cannot check anything ==<br>
&gt; javac Raw.java<br>
Note: Raw.java uses unchecked or unsafe operations.<br>
Note: Recompile with -Xlint:unchecked for details.<br>
&gt; javac -Xlint:unchecked Raw.java<br>
Raw.java:5: warning: [unchecked] unchecked call to add(E) as a member of the raw type List<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;names.add("An");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;where E is a type-variable:<br>
&nbsp;&nbsp;&nbsp;&nbsp;E extends Object declared in interface List<br>
Raw.java:6: warning: [unchecked] unchecked call to add(E) as a member of the raw type List<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;names.add(2005); &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// a mistake: a number in a list of names<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;where E is a type-variable:<br>
&nbsp;&nbsp;&nbsp;&nbsp;E extends Object declared in interface List<br>
2 warnings<br>
&gt; java Raw<br>
AN<br>
Exception in thread "main" java.lang.ClassCastException: java.lang.Integer cannot be cast to java.lang.String<br>
&nbsp;&nbsp;&nbsp;&nbsp;at ... (stack trace shortened)<br>
(exit code 1)<br>
== 2. the same mistake with List&lt;String&gt;: caught before the program exists ==<br>
&gt; javac Gen.java<br>
Gen.java:6: error: no suitable method found for add(int)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;names.add(2005);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;method Collection.add(String) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(argument mismatch; int cannot be converted to String)<br>
&nbsp;&nbsp;&nbsp;&nbsp;method List.add(String) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(argument mismatch; int cannot be converted to String)<br>
Note: Some messages have been simplified; recompile with -Xdiags:verbose to get full output<br>
1 error<br>
(exit code 1)</div>
<p>Với list thô, javac chỉ in một dòng "Note: … unchecked or unsafe operations" (ghi chú: thao tác không kiểm/không an toàn) và chương trình sập <em>lúc chạy</em> với <code>ClassCastException</code> (lỗi ép kiểu) — sau khi đã in "AN", tức là giữa chừng công việc. Với <code>List&lt;String&gt;</code> cùng dòng đó là <strong>lỗi biên dịch</strong>: lỗi không bao giờ tới tay người dùng. Đó là toàn bộ lý do có generics. ➕ Đối số kiểu phải là lớp: <code>List&lt;int&gt;</code> không biên dịch, hãy viết <code>List&lt;Integer&gt;</code> — Java tự đổi <code>int</code> ↔ <code>Integer</code> giúp bạn (autoboxing — tự đóng/mở hộp).</p>
<div class="pitfall">Queue và Deque là "danh sách bị hạn chế" theo lời slide: thường bạn chỉ đụng vào hai đầu (offer/poll ở cuối và đầu). Slide 9 chạy chúng bằng <code>LinkedList</code>.</div>`],
      [6, 'Common Methods of the interface Collection',
        `<p class="y-chinh">🎯 The table of methods every collection has: <code>add(x)</code>, <code>addAll(c)</code>, <code>clear()</code>, <code>contains(x)</code>, <code>containsAll(c)</code>, <code>isEmpty()</code>, <code>iterator()</code>, <code>remove(x)</code>, <code>removeAll(c)</code>, <code>retainAll(c)</code>, <code>size()</code>, <code>toArray()</code>. The red note: elements may be stored in an array, a tree or a hash table — to visit them all the same way you use an <strong>Iterator</strong>.</p>
<p>Each method of the table, called once — the variable has type <code>Collection&lt;String&gt;</code>, so only these methods are allowed:</p>
<pre class="trich"><code class="language-java">Collection&lt;String&gt; c = new ArrayList&lt;String&gt;();
c.add("Java");                                             // add(Object x)
c.add("SQL");
c.addAll(Arrays.asList("C", "Java", "Git"));               // addAll(Collection c)
System.out.println("after add/addAll      " + c + " size()=" + c.size());
System.out.println("contains(\\"SQL\\")        " + c.contains("SQL"));
System.out.println("containsAll([C, Git])  " + c.containsAll(Arrays.asList("C", "Git")));
c.remove("Java");                                          // remove(Object x): the FIRST equal element
System.out.println("remove(\\"Java\\")         " + c);
Collection&lt;String&gt; c2 = new ArrayList&lt;String&gt;(c);          // copy constructor
c2.removeAll(Arrays.asList("SQL", "Java"));                // removeAll(Collection c): EVERY equal element
System.out.println("removeAll([SQL, Java]) " + c2);
Collection&lt;String&gt; c3 = new ArrayList&lt;String&gt;(c);
c3.retainAll(Arrays.asList("SQL", "Git", "Python"));       // retainAll: keep only what is also in the argument
System.out.println("retainAll([SQL, Git, Python]) " + c3);
Iterator&lt;String&gt; it = c.iterator();                        // iterator(): the general way to visit every element
while (it.hasNext()) System.out.print(it.next() + " ");
System.out.println();
String[] arr = c.toArray(new String[0]);                   // toArray: back to an array
System.out.println("toArray length " + arr.length + ", arr[0]=" + arr[0]);
c.clear();                                                 // clear()
System.out.println("after clear: isEmpty()=" + c.isEmpty() + " size()=" + c.size());</code></pre>
<div class="out">after add/addAll &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Java, SQL, C, Java, Git] size()=5<br>
contains("SQL") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true<br>
containsAll([C, Git]) &nbsp;true<br>
remove("Java") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[SQL, C, Java, Git]<br>
removeAll([SQL, Java]) [C, Git]<br>
retainAll([SQL, Git, Python]) [SQL, Git]<br>
SQL C Java Git<br>
toArray length 4, arr[0]=SQL<br>
after clear: isEmpty()=true size()=0<br>
remove(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[10, 20, 1]<br>
remove(Integer.valueOf(1)) [10, 20]</div>
<p>Three details the table hides: <code>remove(x)</code> removes only the <em>first</em> equal element, <code>removeAll(c)</code> removes <em>every</em> equal element; <code>retainAll</code> is "intersection"; "equal" always means <code>equals()</code>, not <code>==</code>. (The slide's note says an Iterator is "a list of references" — it is not a list, just an object that remembers where it is and hands you the next element.)</p>
<div class="pitfall">The trap with numbers, from the last two output lines: on a <code>List&lt;Integer&gt;</code>, <code>nums.remove(1)</code> calls <code>remove(int index)</code> — it deletes the element at <strong>index</strong> 1. To delete the <strong>value</strong> 1 write <code>nums.remove(Integer.valueOf(1))</code>. FE loves this question.</div>
<pre class="trich"><code class="language-java">// trap: on a List&lt;Integer&gt;, remove(1) is remove(int index), not remove(Object)
List&lt;Integer&gt; nums = new ArrayList&lt;Integer&gt;(Arrays.asList(10, 1, 20, 1));
nums.remove(1);                      // removes the element at INDEX 1 (the first "1")
System.out.println("remove(1)                  " + nums);
nums.remove(Integer.valueOf(1));     // removes the VALUE 1
System.out.println("remove(Integer.valueOf(1)) " + nums);</code></pre>`,
        `<p class="y-chinh">🎯 Bảng phương thức mọi collection đều có: <code>add(x)</code>, <code>addAll(c)</code>, <code>clear()</code>, <code>contains(x)</code>, <code>containsAll(c)</code>, <code>isEmpty()</code>, <code>iterator()</code>, <code>remove(x)</code>, <code>removeAll(c)</code>, <code>retainAll(c)</code>, <code>size()</code>, <code>toArray()</code>. Ghi chú đỏ: phần tử có thể được lưu trong mảng, cây hay bảng băm — để đi qua tất cả theo cùng một cách thì dùng <strong>Iterator</strong>.</p>
<p>Từng phương thức trong bảng, gọi một lần — biến có kiểu <code>Collection&lt;String&gt;</code>, nên chỉ những phương thức này được phép:</p>
<pre class="trich"><code class="language-java">Collection&lt;String&gt; c = new ArrayList&lt;String&gt;();
c.add("Java");                                             // add(Object x)
c.add("SQL");
c.addAll(Arrays.asList("C", "Java", "Git"));               // addAll(Collection c)
System.out.println("after add/addAll      " + c + " size()=" + c.size());
System.out.println("contains(\\"SQL\\")        " + c.contains("SQL"));
System.out.println("containsAll([C, Git])  " + c.containsAll(Arrays.asList("C", "Git")));
c.remove("Java");                                          // remove(Object x): phần tử bằng ĐẦU TIÊN
System.out.println("remove(\\"Java\\")         " + c);
Collection&lt;String&gt; c2 = new ArrayList&lt;String&gt;(c);          // constructor sao chép
c2.removeAll(Arrays.asList("SQL", "Java"));                // removeAll: MỌI phần tử bằng
System.out.println("removeAll([SQL, Java]) " + c2);
Collection&lt;String&gt; c3 = new ArrayList&lt;String&gt;(c);
c3.retainAll(Arrays.asList("SQL", "Git", "Python"));       // retainAll: chỉ giữ cái cũng có trong đối số
System.out.println("retainAll([SQL, Git, Python]) " + c3);
Iterator&lt;String&gt; it = c.iterator();                        // iterator(): cách chung để đi qua mọi phần tử
while (it.hasNext()) System.out.print(it.next() + " ");
System.out.println();
String[] arr = c.toArray(new String[0]);                   // toArray: quay về mảng
System.out.println("toArray length " + arr.length + ", arr[0]=" + arr[0]);
c.clear();                                                 // clear()
System.out.println("after clear: isEmpty()=" + c.isEmpty() + " size()=" + c.size());</code></pre>
<div class="out">after add/addAll &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Java, SQL, C, Java, Git] size()=5<br>
contains("SQL") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;true<br>
containsAll([C, Git]) &nbsp;true<br>
remove("Java") &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[SQL, C, Java, Git]<br>
removeAll([SQL, Java]) [C, Git]<br>
retainAll([SQL, Git, Python]) [SQL, Git]<br>
SQL C Java Git<br>
toArray length 4, arr[0]=SQL<br>
after clear: isEmpty()=true size()=0<br>
remove(1) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[10, 20, 1]<br>
remove(Integer.valueOf(1)) [10, 20]</div>
<p>Ba chi tiết bảng không nói: <code>remove(x)</code> chỉ xoá phần tử bằng <em>đầu tiên</em>, <code>removeAll(c)</code> xoá <em>mọi</em> phần tử bằng; <code>retainAll</code> là "phép giao"; "bằng" luôn nghĩa là <code>equals()</code>, không phải <code>==</code>. (Ghi chú của slide nói Iterator là "một danh sách tham chiếu" — nó không phải danh sách, chỉ là một đối tượng nhớ mình đang ở đâu và đưa bạn phần tử kế tiếp.)</p>
<div class="pitfall">Cái bẫy với số, từ hai dòng output cuối: với <code>List&lt;Integer&gt;</code>, <code>nums.remove(1)</code> gọi <code>remove(int index)</code> — nó xoá phần tử ở <strong>chỉ số</strong> 1. Muốn xoá <strong>giá trị</strong> 1 thì viết <code>nums.remove(Integer.valueOf(1))</code>. FE rất thích câu này.</div>
<pre class="trich"><code class="language-java">// bẫy: với List&lt;Integer&gt;, remove(1) là remove(int index), không phải remove(Object)
List&lt;Integer&gt; nums = new ArrayList&lt;Integer&gt;(Arrays.asList(10, 1, 20, 1));
nums.remove(1);                      // xoá phần tử ở CHỈ SỐ 1
System.out.println("remove(1)                  " + nums);
nums.remove(Integer.valueOf(1));     // xoá GIÁ TRỊ 1
System.out.println("remove(Integer.valueOf(1)) " + nums);</code></pre>`],
      [7, 'The Collection Framework…',
        `<p class="y-chinh">🎯 Central interfaces on the left, commonly used classes on the right: <code>ArrayList</code>, <code>Vector</code> store a <strong>dynamic array</strong> and use an index; <code>HashSet</code>, <code>TreeSet</code> store a specific structure (hash table, tree) and are visited with an iterator; <code>HashMap</code>, <code>TreeMap</code> give you <code>keySet()</code> and <code>values()</code>, visited with an iterator. A TreeSet stores elements in ascending order, so its elements must implement <code>Comparable</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fbba37aa93d5928d600f15bdadc5df2995988aa5.svg" alt="Slide 7 redrawn: dashed arrow = implements; every class you write after new, and the interface you declare it with" loading="lazy" /><p class="chu-thich">🧩 Slide 7 redrawn: dashed arrow = implements; every class you write after new, and the interface you declare it with</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 7 — central interfaces and the classes you actually create with new
left to right direction
' Dashed line with hollow triangle = implements
interface "List&lt;E&gt;" as List
interface "Set&lt;E&gt;" as Set
interface "Deque&lt;E&gt;" as Deque
interface "NavigableSet&lt;E&gt;" as NavigableSet
interface "Map&lt;K,V&gt;" as Map
interface "NavigableMap&lt;K,V&gt;" as NavigableMap
class "ArrayList&lt;E&gt;" as ArrayList
class "Vector&lt;E&gt;" as Vector
class "LinkedList&lt;E&gt;" as LinkedList
class "HashSet&lt;E&gt;" as HashSet
class "LinkedHashSet&lt;E&gt;" as LinkedHashSet
class "TreeSet&lt;E&gt;" as TreeSet
class "HashMap&lt;K,V&gt;" as HashMap
class "TreeMap&lt;K,V&gt;" as TreeMap
List &lt;|.. ArrayList
List &lt;|.. Vector
List &lt;|.. LinkedList
Deque &lt;|.. LinkedList
Set &lt;|.. HashSet
HashSet &lt;|-- LinkedHashSet
NavigableSet &lt;|.. TreeSet
Map &lt;|.. HashMap
NavigableMap &lt;|.. TreeMap
note right of ArrayList : dynamic array — index access
note right of LinkedList : doubly linked nodes
note right of HashSet : hash table — no order
note right of TreeSet : red-black tree — sorted;\\nelements Comparable (or a Comparator)
note right of HashMap : hash table on the keys
note right of TreeMap : red-black tree on the keys
@enduml</code></pre></details>
<p>Reading the diagram as a decision table — the one you will use in every PE and LAB211 program:</p>
<table>
<thead><tr><th>You need…</th><th>Use</th><th>Declared as</th></tr></thead>
<tbody>
<tr><td>order of insertion, duplicates, access by index</td><td><code>ArrayList</code></td><td><code>List&lt;Student&gt; list = new ArrayList&lt;Student&gt;();</code></td></tr>
<tr><td>add/remove at both ends (queue, stack)</td><td><code>LinkedList</code> (➕ or <code>ArrayDeque</code>)</td><td><code>Deque&lt;String&gt; d = new LinkedList&lt;String&gt;();</code></td></tr>
<tr><td>no duplicates, order does not matter</td><td><code>HashSet</code></td><td><code>Set&lt;String&gt; s = new HashSet&lt;String&gt;();</code></td></tr>
<tr><td>no duplicates, sorted</td><td><code>TreeSet</code></td><td><code>Set&lt;String&gt; s = new TreeSet&lt;String&gt;();</code></td></tr>
<tr><td>look up by a key (id, code)</td><td><code>HashMap</code></td><td><code>Map&lt;String, Student&gt; m = new HashMap&lt;String, Student&gt;();</code></td></tr>
<tr><td>look up by key, keys sorted</td><td><code>TreeMap</code></td><td><code>Map&lt;String, Integer&gt; m = new TreeMap&lt;String, Integer&gt;();</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 In PE papers you will meet <code>ArrayList</code> almost every time; <code>HashMap</code>/<code>HashSet</code> in the "count", "distinct" and "group by" commands; <code>TreeSet</code>/<code>TreeMap</code> when the output must be sorted.</p>`,
        `<p class="y-chinh">🎯 Interface trung tâm bên trái, lớp thường dùng bên phải: <code>ArrayList</code>, <code>Vector</code> lưu một <strong>mảng động</strong> và dùng chỉ số; <code>HashSet</code>, <code>TreeSet</code> lưu một cấu trúc riêng (bảng băm, cây) và được duyệt bằng iterator; <code>HashMap</code>, <code>TreeMap</code> cho bạn <code>keySet()</code> và <code>values()</code>, duyệt bằng iterator. TreeSet lưu phần tử theo thứ tự tăng dần, nên phần tử của nó phải hiện thực <code>Comparable</code>.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fbba37aa93d5928d600f15bdadc5df2995988aa5.svg" alt="Slide 7 vẽ lại: mũi tên nét đứt = implements; mọi lớp bạn viết sau new, và interface bạn dùng để khai báo nó" loading="lazy" /><p class="chu-thich">🧩 Slide 7 vẽ lại: mũi tên nét đứt = implements; mọi lớp bạn viết sau new, và interface bạn dùng để khai báo nó</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 7 — central interfaces and the classes you actually create with new
left to right direction
' Nét đứt tam giác rỗng = implements
interface "List&lt;E&gt;" as List
interface "Set&lt;E&gt;" as Set
interface "Deque&lt;E&gt;" as Deque
interface "NavigableSet&lt;E&gt;" as NavigableSet
interface "Map&lt;K,V&gt;" as Map
interface "NavigableMap&lt;K,V&gt;" as NavigableMap
class "ArrayList&lt;E&gt;" as ArrayList
class "Vector&lt;E&gt;" as Vector
class "LinkedList&lt;E&gt;" as LinkedList
class "HashSet&lt;E&gt;" as HashSet
class "LinkedHashSet&lt;E&gt;" as LinkedHashSet
class "TreeSet&lt;E&gt;" as TreeSet
class "HashMap&lt;K,V&gt;" as HashMap
class "TreeMap&lt;K,V&gt;" as TreeMap
List &lt;|.. ArrayList
List &lt;|.. Vector
List &lt;|.. LinkedList
Deque &lt;|.. LinkedList
Set &lt;|.. HashSet
HashSet &lt;|-- LinkedHashSet
NavigableSet &lt;|.. TreeSet
Map &lt;|.. HashMap
NavigableMap &lt;|.. TreeMap
note right of ArrayList : dynamic array — index access
note right of LinkedList : doubly linked nodes
note right of HashSet : hash table — no order
note right of TreeSet : red-black tree — sorted;\\nelements Comparable (or a Comparator)
note right of HashMap : hash table on the keys
note right of TreeMap : red-black tree on the keys
@enduml</code></pre></details>
<p>Đọc sơ đồ thành một bảng quyết định — bảng bạn sẽ dùng trong mọi chương trình PE và LAB211:</p>
<table>
<thead><tr><th>Bạn cần…</th><th>Dùng</th><th>Khai báo</th></tr></thead>
<tbody>
<tr><td>thứ tự thêm, cho trùng, truy cập theo chỉ số</td><td><code>ArrayList</code></td><td><code>List&lt;Student&gt; list = new ArrayList&lt;Student&gt;();</code></td></tr>
<tr><td>thêm/xoá ở hai đầu (hàng đợi, ngăn xếp)</td><td><code>LinkedList</code> (➕ hoặc <code>ArrayDeque</code>)</td><td><code>Deque&lt;String&gt; d = new LinkedList&lt;String&gt;();</code></td></tr>
<tr><td>không trùng, không cần thứ tự</td><td><code>HashSet</code></td><td><code>Set&lt;String&gt; s = new HashSet&lt;String&gt;();</code></td></tr>
<tr><td>không trùng, có sắp xếp</td><td><code>TreeSet</code></td><td><code>Set&lt;String&gt; s = new TreeSet&lt;String&gt;();</code></td></tr>
<tr><td>tra theo một khoá (mã, id)</td><td><code>HashMap</code></td><td><code>Map&lt;String, Student&gt; m = new HashMap&lt;String, Student&gt;();</code></td></tr>
<tr><td>tra theo khoá, khoá có sắp xếp</td><td><code>TreeMap</code></td><td><code>Map&lt;String, Integer&gt; m = new TreeMap&lt;String, Integer&gt;();</code></td></tr>
</tbody>
</table>
<p class="meo">🧠 Trong đề PE bạn gặp <code>ArrayList</code> gần như lần nào cũng có; <code>HashMap</code>/<code>HashSet</code> trong các lệnh "đếm", "khác nhau", "gom nhóm"; <code>TreeSet</code>/<code>TreeMap</code> khi output phải sắp xếp.</p>`],
      [8, 'Lists',
        `<p class="y-chinh">🎯 A <strong>List</strong> keeps its elements in the order in which they were added; each element has an <strong>index</strong> starting from 0. Common methods: <code>void add(int index, Object x)</code>, <code>Object get(int index)</code>, <code>int indexOf(Object x)</code>, <code>Object remove(int index)</code>.</p>
<p>The four methods, plus <code>set</code>, and the exceptions a wrong index gives — this file runs only on a real JDK 8, because the message text is different on newer JDKs:</p>
<pre class="trich"><code class="language-java">List&lt;String&gt; q = new ArrayList&lt;String&gt;();
q.add("Lan"); q.add("Minh"); q.add("Hoa");      // add(x) appends: order of insertion
System.out.println(q);
q.add(1, "Tuan");                               // void add(int index, Object x): shifts the rest right
System.out.println("add(1, \\"Tuan\\")  " + q);
System.out.println("get(0)          " + q.get(0));
System.out.println("indexOf(\\"Hoa\\")  " + q.indexOf("Hoa") + ", indexOf(\\"Nam\\") " + q.indexOf("Nam"));
String gone = q.remove(2);                      // Object remove(int index): returns what it removed
System.out.println("remove(2)       returned " + gone + " -&gt; " + q);
q.set(0, "Lan Anh");                            // ➕ set(index, x) replaces
System.out.println("set(0, ...)     " + q + " size " + q.size());</code></pre>
<pre class="trich"><code class="language-java">try {
    q.get(3);                                   // valid indexes: 0..size()-1
} catch (IndexOutOfBoundsException e) {
    System.out.println(e);
}
try {
    q.add(5, "X");                              // add(index, x) allows 0..size() — 5 is too far
} catch (IndexOutOfBoundsException e) {
    System.out.println(e);
}
try {
    new ArrayList&lt;String&gt;().get(0);             // an empty list has no index 0
} catch (IndexOutOfBoundsException e) {
    System.out.println(e);
}</code></pre>
<div class="out">[Lan, Minh, Hoa]<br>
add(1, "Tuan") &nbsp;[Lan, Tuan, Minh, Hoa]<br>
get(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lan<br>
indexOf("Hoa") &nbsp;3, indexOf("Nam") -1<br>
remove(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;returned Minh -&gt; [Lan, Tuan, Hoa]<br>
set(0, ...) &nbsp;&nbsp;&nbsp;&nbsp;[Lan Anh, Tuan, Hoa] size 3<br>
java.lang.IndexOutOfBoundsException: Index: 3, Size: 3<br>
java.lang.IndexOutOfBoundsException: Index: 5, Size: 3<br>
java.lang.IndexOutOfBoundsException: Index: 0, Size: 0</div>
<p>Valid indexes for <code>get</code>, <code>set</code> and <code>remove</code> are <code>0..size()-1</code>; <code>add(index, x)</code> also allows <code>size()</code> (= append). JDK 8 says <code>Index: 3, Size: 3</code>; JDK 17/21 say <code>Index 3 out of bounds for length 3</code> — same exception, different words. <code>indexOf</code> returns <strong>-1</strong> when the element is absent, which is how PE "search" methods decide "Not found".</p>
<p>➕ <strong>Making a list quickly on JDK 8.</strong> Many web tutorials (and the old lesson 8.1 of this course) write <code>List.of("An", "Binh")</code> — that is Java 9. On the exam JDK:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== List.of is Java 9+: the PE machine (JDK 8) does not know it ==");
    viet(d, "Of.java",
        "import java.util.*;\\n" +
        "public class Of {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;String&gt; s = List.of(\\"An\\", \\"Binh\\");\\n" +
        "        System.out.println(s);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Of.java");
    System.out.println("(this JVM: Java " + System.getProperty("java.specification.version") + ")");
    System.out.println("== what DOES work on JDK 8 ==");
    asListDemo();
}</code></pre>
<pre class="trich"><code class="language-java">static void asListDemo() {
    String[] arr = { "An", "Binh", "Chi" };
    List&lt;String&gt; fixed = Arrays.asList(arr);        // a fixed-size VIEW of the array
    fixed.set(0, "Anh");                            // set is allowed...
    System.out.println("fixed " + fixed + ", arr[0] is now " + arr[0]);   // ...and writes through to the array
    try {
        fixed.add("Dung");                          // add/remove change the size: not allowed
    } catch (UnsupportedOperationException e) {
        System.out.println("fixed.add -&gt; " + e);
    }
    List&lt;String&gt; growable = new ArrayList&lt;String&gt;(Arrays.asList(arr));   // the JDK 8 idiom: copy into a real ArrayList
    growable.add("Dung");
    growable.remove("Binh");
    System.out.println("growable " + growable);
    List&lt;String&gt; other = new ArrayList&lt;String&gt;();
    Collections.addAll(other, "X", "Y", "Z");      // another way, no array needed
    System.out.println("addAll " + other);
    int[] nums = { 3, 1, 2 };
    System.out.println("Arrays.asList(int[]).size() = " + Arrays.asList(nums).size() + "   &lt;- ONE element: the int[] itself");
    System.out.println("Arrays.asList(3, 1, 2).size() = " + Arrays.asList(3, 1, 2).size());
    List&lt;String&gt; ro = Collections.unmodifiableList(growable);
    try { ro.add("W"); } catch (UnsupportedOperationException e) { System.out.println("unmodifiableList.add -&gt; " + e); }
}</code></pre>
<div class="out">== List.of is Java 9+: the PE machine (JDK 8) does not know it ==<br>
&gt; javac Of.java<br>
Of.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; s = List.of("An", "Binh");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String,String)<br>
&nbsp;&nbsp;location: interface List<br>
1 error<br>
(exit code 1)<br>
(this JVM: Java 1.8)<br>
== what DOES work on JDK 8 ==<br>
fixed [Anh, Binh, Chi], arr[0] is now Anh<br>
fixed.add -&gt; java.lang.UnsupportedOperationException<br>
growable [Anh, Chi, Dung]<br>
addAll [X, Y, Z]<br>
Arrays.asList(int[]).size() = 1 &nbsp;&nbsp;&lt;- ONE element: the int[] itself<br>
Arrays.asList(3, 1, 2).size() = 3<br>
unmodifiableList.add -&gt; java.lang.UnsupportedOperationException</div>
<div class="pitfall"><code>Arrays.asList(...)</code> is a <strong>fixed-size view</strong> of an array: <code>set</code> works (and changes the array too), <code>add</code>/<code>remove</code> throw <code>UnsupportedOperationException</code>. If you will add or remove, copy it: <code>new ArrayList&lt;String&gt;(Arrays.asList(...))</code>. And <code>Arrays.asList(int[])</code> is a list with ONE element — the array itself. Class <code>Collections</code> (sort, max, min, reverse, frequency…) was lesson 1.G (deck "Support Classes").</div>`,
        `<p class="y-chinh">🎯 Một <strong>List</strong> giữ phần tử theo thứ tự được thêm vào; mỗi phần tử có một <strong>chỉ số</strong> (index) bắt đầu từ 0. Phương thức thường dùng: <code>void add(int index, Object x)</code>, <code>Object get(int index)</code>, <code>int indexOf(Object x)</code>, <code>Object remove(int index)</code>.</p>
<p>Bốn phương thức đó, thêm <code>set</code>, và các ngoại lệ khi chỉ số sai — file này chỉ chạy trên JDK 8 thật, vì chữ của thông báo khác trên các JDK mới:</p>
<pre class="trich"><code class="language-java">List&lt;String&gt; q = new ArrayList&lt;String&gt;();
q.add("Lan"); q.add("Minh"); q.add("Hoa");      // add(x) thêm cuối: theo thứ tự thêm
System.out.println(q);
q.add(1, "Tuan");                               // dời phần sau sang phải
System.out.println("add(1, \\"Tuan\\")  " + q);
System.out.println("get(0)          " + q.get(0));
System.out.println("indexOf(\\"Hoa\\")  " + q.indexOf("Hoa") + ", indexOf(\\"Nam\\") " + q.indexOf("Nam"));
String gone = q.remove(2);                      // trả về phần tử bị xoá
System.out.println("remove(2)       returned " + gone + " -&gt; " + q);
q.set(0, "Lan Anh");                            // set thay thế
System.out.println("set(0, ...)     " + q + " size " + q.size());</code></pre>
<pre class="trich"><code class="language-java">try {
    q.get(3);                                   // chỉ số hợp lệ: 0..size()-1
} catch (IndexOutOfBoundsException e) {
    System.out.println(e);
}
try {
    q.add(5, "X");                              // add cho phép 0..size()
} catch (IndexOutOfBoundsException e) {
    System.out.println(e);
}
try {
    new ArrayList&lt;String&gt;().get(0);             // list rỗng không có chỉ số 0
} catch (IndexOutOfBoundsException e) {
    System.out.println(e);
}</code></pre>
<div class="out">[Lan, Minh, Hoa]<br>
add(1, "Tuan") &nbsp;[Lan, Tuan, Minh, Hoa]<br>
get(0) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lan<br>
indexOf("Hoa") &nbsp;3, indexOf("Nam") -1<br>
remove(2) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;returned Minh -&gt; [Lan, Tuan, Hoa]<br>
set(0, ...) &nbsp;&nbsp;&nbsp;&nbsp;[Lan Anh, Tuan, Hoa] size 3<br>
java.lang.IndexOutOfBoundsException: Index: 3, Size: 3<br>
java.lang.IndexOutOfBoundsException: Index: 5, Size: 3<br>
java.lang.IndexOutOfBoundsException: Index: 0, Size: 0</div>
<p>Chỉ số hợp lệ cho <code>get</code>, <code>set</code> và <code>remove</code> là <code>0..size()-1</code>; <code>add(index, x)</code> cho phép thêm cả <code>size()</code> (= thêm cuối). JDK 8 báo <code>Index: 3, Size: 3</code>; JDK 17/21 báo <code>Index 3 out of bounds for length 3</code> — cùng ngoại lệ, khác chữ. <code>indexOf</code> trả <strong>-1</strong> khi không có phần tử, đó là cách các phương thức "search" trong đề PE quyết định "Not found".</p>
<p>➕ <strong>Tạo list nhanh trên JDK 8.</strong> Nhiều bài hướng dẫn trên mạng (và bài cũ 8.1 của khoá này) viết <code>List.of("An", "Binh")</code> — đó là Java 9. Trên JDK phòng thi:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    System.out.println("== List.of is Java 9+: the PE machine (JDK 8) does not know it ==");
    viet(d, "Of.java",
        "import java.util.*;\\n" +
        "public class Of {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        List&lt;String&gt; s = List.of(\\"An\\", \\"Binh\\");\\n" +
        "        System.out.println(s);\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "Of.java");
    System.out.println("(this JVM: Java " + System.getProperty("java.specification.version") + ")");
    System.out.println("== what DOES work on JDK 8 ==");
    asListDemo();
}</code></pre>
<pre class="trich"><code class="language-java">static void asListDemo() {
    String[] arr = { "An", "Binh", "Chi" };
    List&lt;String&gt; fixed = Arrays.asList(arr);        // một KHUNG NHÌN cố định kích thước lên mảng
    fixed.set(0, "Anh");                            // set thì được...
    System.out.println("fixed " + fixed + ", arr[0] is now " + arr[0]);   // ...và ghi xuyên xuống mảng
    try {
        fixed.add("Dung");                          // add/remove đổi kích thước: không được
    } catch (UnsupportedOperationException e) {
        System.out.println("fixed.add -&gt; " + e);
    }
    List&lt;String&gt; growable = new ArrayList&lt;String&gt;(Arrays.asList(arr));   // cách viết JDK 8: chép sang một ArrayList thật
    growable.add("Dung");
    growable.remove("Binh");
    System.out.println("growable " + growable);
    List&lt;String&gt; other = new ArrayList&lt;String&gt;();
    Collections.addAll(other, "X", "Y", "Z");      // cách khác, không cần mảng
    System.out.println("addAll " + other);
    int[] nums = { 3, 1, 2 };
    System.out.println("Arrays.asList(int[]).size() = " + Arrays.asList(nums).size() + "   &lt;- ONE element: the int[] itself");
    System.out.println("Arrays.asList(3, 1, 2).size() = " + Arrays.asList(3, 1, 2).size());
    List&lt;String&gt; ro = Collections.unmodifiableList(growable);
    try { ro.add("W"); } catch (UnsupportedOperationException e) { System.out.println("unmodifiableList.add -&gt; " + e); }
}</code></pre>
<div class="out">== List.of is Java 9+: the PE machine (JDK 8) does not know it ==<br>
&gt; javac Of.java<br>
Of.java:4: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; s = List.of("An", "Binh");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String,String)<br>
&nbsp;&nbsp;location: interface List<br>
1 error<br>
(exit code 1)<br>
(this JVM: Java 1.8)<br>
== what DOES work on JDK 8 ==<br>
fixed [Anh, Binh, Chi], arr[0] is now Anh<br>
fixed.add -&gt; java.lang.UnsupportedOperationException<br>
growable [Anh, Chi, Dung]<br>
addAll [X, Y, Z]<br>
Arrays.asList(int[]).size() = 1 &nbsp;&nbsp;&lt;- ONE element: the int[] itself<br>
Arrays.asList(3, 1, 2).size() = 3<br>
unmodifiableList.add -&gt; java.lang.UnsupportedOperationException</div>
<div class="pitfall"><code>Arrays.asList(...)</code> là một <strong>khung nhìn cố định kích thước</strong> lên mảng: <code>set</code> được (và sửa luôn mảng), <code>add</code>/<code>remove</code> ném <code>UnsupportedOperationException</code> (thao tác không được hỗ trợ). Nếu sẽ thêm hay xoá, hãy chép ra: <code>new ArrayList&lt;String&gt;(Arrays.asList(...))</code>. Còn <code>Arrays.asList(int[])</code> là list có MỘT phần tử — chính cái mảng. Lớp <code>Collections</code> (sort, max, min, reverse, frequency…) là bài 1.G (bộ slide "Support Classes").</div>`],
      [9, 'Classes Implementing the interface List',
        `<p class="y-chinh">🎯 Classes implementing <code>List</code>: <code>AbstractList</code>, <code>ArrayList</code>, <code>Vector</code> (like ArrayList but <strong>synchronized</strong>), <code>LinkedList</code> (can be used as a stack, a queue or a double-ended queue — deque).</p>
<p><code>AbstractList</code> is an abstract class (Chapter 5) that implements most of <code>List</code> for you — the library uses it as a base; you never write <code>new AbstractList()</code>. The two you choose between are <code>ArrayList</code> and <code>LinkedList</code>, and the difference is how they store the elements:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/827414c9f38f065793cc855595bf5b2659bd8bdf.svg" alt="Slide 9 ➕: the same list in an ArrayList (one array) and in a LinkedList (linked nodes)" loading="lazy" /><p class="chu-thich">🧩 Slide 9 ➕: the same list in an ArrayList (one array) and in a LinkedList (linked nodes)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 9 — the same list [A, B, C] stored by ArrayList and by LinkedList
package "ArrayList: one array of references (capacity &gt;= size)" as PA {
  rectangle "elementData\\n—\\n[0] ● A\\n[1] ● B\\n[2] ● C\\n[3] null\\n…" as Arr #EEF2FF
  rectangle "size = 3" as Sz
}
package "LinkedList: one node per element, linked both ways" as PL {
  rectangle "LinkedList\\nfirst ●\\nlast ●\\nsize = 3" as LL
  rectangle "Node\\nprev = null\\nitem ● A" as N1 #ECFDF5
  rectangle "Node\\nitem ● B" as N2 #ECFDF5
  rectangle "Node\\nitem ● C\\nnext = null" as N3 #ECFDF5
}
Arr -right[hidden]- Sz
PA -down[hidden]- PL
LL -down-&gt; N1 : first
N1 -right-&gt; N2 : next
N2 -left-&gt; N1 : prev
N2 -right-&gt; N3 : next
N3 -left-&gt; N2 : prev
note right of Sz
  get(i): one step — O(1)
  add/remove in the middle:
  shift the rest — O(n)
end note
note right of N3
  get(i): walk from an end — O(n)
  add/remove at either end: O(1)
end note
@enduml</code></pre></details>
<table>
<thead><tr><th>Operation</th><th>ArrayList</th><th>LinkedList</th></tr></thead>
<tbody>
<tr><td><code>get(i)</code>, <code>set(i, x)</code></td><td>O(1) — one step into the array</td><td>O(n) — walk node by node from the nearer end</td></tr>
<tr><td><code>add(x)</code> at the end</td><td>O(1) on average (array grows ~1.5× when full)</td><td>O(1)</td></tr>
<tr><td><code>add(0, x)</code> / <code>remove(0)</code></td><td>O(n) — shift every element</td><td>O(1)</td></tr>
<tr><td>memory per element</td><td>one reference</td><td>a node: item + next + prev</td></tr>
</tbody>
</table>
<p>In practice <code>ArrayList</code> wins almost always (the old lesson 8.1 has a short video measuring a 15× gap); pick <code>LinkedList</code> when the job is a queue or a stack. Its three roles, run:</p>
<pre><code class="language-java">// release: 8
// Slide 9: LinkedList "can be used as a stack, queue, or double-ended queue (deque)" — all three, run
import java.util.*;

public class LinkedListDeque {
    public static void main(String[] args) {
        LinkedList&lt;String&gt; stack = new LinkedList&lt;String&gt;();
        stack.push("page1"); stack.push("page2"); stack.push("page3");   // stack: last in, first out (LIFO)
        System.out.println("stack " + stack + " pop() -&gt; " + stack.pop() + " -&gt; " + stack);

        Queue&lt;String&gt; queue = new LinkedList&lt;String&gt;();
        queue.offer("SV01"); queue.offer("SV02"); queue.offer("SV03");   // queue: first in, first out (FIFO)
        System.out.println("queue " + queue + " poll() -&gt; " + queue.poll() + " -&gt; " + queue + " peek() " + queue.peek());

        Deque&lt;Integer&gt; deque = new LinkedList&lt;Integer&gt;();
        deque.addFirst(2); deque.addFirst(1); deque.addLast(3); deque.addLast(4);
        System.out.println("deque " + deque + " removeFirst " + deque.removeFirst() + " removeLast " + deque.removeLast() + " -&gt; " + deque);

        LinkedList&lt;String&gt; list = new LinkedList&lt;String&gt;(Arrays.asList("b", "c"));
        list.addFirst("a"); list.add(1, "a2");                          // still a full List: index methods work
        System.out.println("as a List " + list + " get(1) " + list.get(1));
        System.out.println("empty poll() -&gt; " + new LinkedList&lt;String&gt;().poll() + " (pop() would throw NoSuchElementException)");
    }
}</code></pre>
<div class="out">stack [page3, page2, page1] pop() -&gt; page3 -&gt; [page2, page1]<br>
queue [SV01, SV02, SV03] poll() -&gt; SV01 -&gt; [SV02, SV03] peek() SV02<br>
deque [1, 2, 3, 4] removeFirst 1 removeLast 4 -&gt; [2, 3]<br>
as a List [a, a2, b, c] get(1) a2<br>
empty poll() -&gt; null (pop() would throw NoSuchElementException)</div>
<div class="callout">🧭 <strong>Go further — CSD201</strong>: you will build a linked list, a stack and a queue yourself and prove these O(…) costs. ➕ Modern code uses <code>ArrayDeque</code> for stacks and queues; the old class <code>Stack</code> extends <code>Vector</code> and is legacy.</div>`,
        `<p class="y-chinh">🎯 Các lớp hiện thực <code>List</code>: <code>AbstractList</code>, <code>ArrayList</code>, <code>Vector</code> (giống ArrayList nhưng <strong>đồng bộ hoá</strong> — synchronized), <code>LinkedList</code> (dùng được như ngăn xếp, hàng đợi hay hàng đợi hai đầu — deque).</p>
<p><code>AbstractList</code> là một lớp trừu tượng (Chương 5) hiện thực sẵn phần lớn <code>List</code> — thư viện dùng nó làm nền; bạn không bao giờ viết <code>new AbstractList()</code>. Hai lớp bạn thật sự chọn là <code>ArrayList</code> và <code>LinkedList</code>, và khác biệt nằm ở cách chúng lưu phần tử:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/827414c9f38f065793cc855595bf5b2659bd8bdf.svg" alt="Slide 9 ➕: cùng một list trong ArrayList (một mảng) và trong LinkedList (các nút nối nhau)" loading="lazy" /><p class="chu-thich">🧩 Slide 9 ➕: cùng một list trong ArrayList (một mảng) và trong LinkedList (các nút nối nhau)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 9 — the same list [A, B, C] stored by ArrayList and by LinkedList
package "ArrayList: one array of references (capacity &gt;= size)" as PA {
  rectangle "elementData\\n—\\n[0] ● A\\n[1] ● B\\n[2] ● C\\n[3] null\\n…" as Arr #EEF2FF
  rectangle "size = 3" as Sz
}
package "LinkedList: one node per element, linked both ways" as PL {
  rectangle "LinkedList\\nfirst ●\\nlast ●\\nsize = 3" as LL
  rectangle "Node\\nprev = null\\nitem ● A" as N1 #ECFDF5
  rectangle "Node\\nitem ● B" as N2 #ECFDF5
  rectangle "Node\\nitem ● C\\nnext = null" as N3 #ECFDF5
}
Arr -right[hidden]- Sz
PA -down[hidden]- PL
LL -down-&gt; N1 : first
N1 -right-&gt; N2 : next
N2 -left-&gt; N1 : prev
N2 -right-&gt; N3 : next
N3 -left-&gt; N2 : prev
note right of Sz
  get(i): one step — O(1)
  add/remove in the middle:
  shift the rest — O(n)
end note
note right of N3
  get(i): walk from an end — O(n)
  add/remove at either end: O(1)
end note
@enduml</code></pre></details>
<table>
<thead><tr><th>Thao tác</th><th>ArrayList</th><th>LinkedList</th></tr></thead>
<tbody>
<tr><td><code>get(i)</code>, <code>set(i, x)</code></td><td>O(1) — một bước vào mảng</td><td>O(n) — đi từng nút từ đầu gần hơn</td></tr>
<tr><td><code>add(x)</code> ở cuối</td><td>O(1) trung bình (mảng nới ~1,5 lần khi đầy)</td><td>O(1)</td></tr>
<tr><td><code>add(0, x)</code> / <code>remove(0)</code></td><td>O(n) — dời mọi phần tử</td><td>O(1)</td></tr>
<tr><td>bộ nhớ mỗi phần tử</td><td>một tham chiếu</td><td>một nút: item + next + prev</td></tr>
</tbody>
</table>
<p>Thực tế <code>ArrayList</code> thắng gần như mọi lúc (bài cũ 8.1 có video ngắn đo chênh 15 lần); chọn <code>LinkedList</code> khi việc cần làm là hàng đợi hay ngăn xếp. Ba vai của nó, chạy thật:</p>
<pre><code class="language-java">// release: 8
// Slide 9: LinkedList "dùng được như ngăn xếp, hàng đợi, hay hàng đợi hai đầu (deque)" — cả ba, chạy thật
import java.util.*;

public class LinkedListDeque {
    public static void main(String[] args) {
        LinkedList&lt;String&gt; stack = new LinkedList&lt;String&gt;();
        stack.push("page1"); stack.push("page2"); stack.push("page3");   // ngăn xếp: vào sau ra trước
        System.out.println("stack " + stack + " pop() -&gt; " + stack.pop() + " -&gt; " + stack);

        Queue&lt;String&gt; queue = new LinkedList&lt;String&gt;();
        queue.offer("SV01"); queue.offer("SV02"); queue.offer("SV03");   // hàng đợi: vào trước ra trước
        System.out.println("queue " + queue + " poll() -&gt; " + queue.poll() + " -&gt; " + queue + " peek() " + queue.peek());

        Deque&lt;Integer&gt; deque = new LinkedList&lt;Integer&gt;();
        deque.addFirst(2); deque.addFirst(1); deque.addLast(3); deque.addLast(4);
        System.out.println("deque " + deque + " removeFirst " + deque.removeFirst() + " removeLast " + deque.removeLast() + " -&gt; " + deque);

        LinkedList&lt;String&gt; list = new LinkedList&lt;String&gt;(Arrays.asList("b", "c"));
        list.addFirst("a"); list.add(1, "a2");                          // vẫn là List đầy đủ: phương thức chỉ số vẫn chạy
        System.out.println("as a List " + list + " get(1) " + list.get(1));
        System.out.println("empty poll() -&gt; " + new LinkedList&lt;String&gt;().poll() + " (pop() would throw NoSuchElementException)");
    }
}</code></pre>
<div class="out">stack [page3, page2, page1] pop() -&gt; page3 -&gt; [page2, page1]<br>
queue [SV01, SV02, SV03] poll() -&gt; SV01 -&gt; [SV02, SV03] peek() SV02<br>
deque [1, 2, 3, 4] removeFirst 1 removeLast 4 -&gt; [2, 3]<br>
as a List [a, a2, b, c] get(1) a2<br>
empty poll() -&gt; null (pop() would throw NoSuchElementException)</div>
<div class="callout">🧭 <strong>Đi tiếp — CSD201</strong>: bạn sẽ tự dựng danh sách liên kết, ngăn xếp và hàng đợi, và chứng minh các chi phí O(…) này. ➕ Code hiện đại dùng <code>ArrayDeque</code> cho ngăn xếp và hàng đợi; lớp cũ <code>Stack</code> kế thừa <code>Vector</code> và thuộc loại di sản (legacy).</div>`],
      [10, 'List Implementing Classes',
        `<p class="y-chinh">🎯 The slide fills an <code>ArrayList</code> with 101..110 and prints it with an index loop (<code>size()</code> + <code>get(i)</code>); the commented-out part does the same with an <strong>Iterator</strong>: <code>iterator()</code>, then <code>while (iter.hasNext()) … iter.next()</code>.</p>
<p>The slide's code, exactly (a raw <code>ArrayList</code> — <code>list.add(i)</code> boxes each <code>int</code> into an <code>Integer</code>), and then the three ways to traverse a list:</p>
<pre class="trich"><code class="language-java">ArrayList list= new ArrayList();
for (int i = 101; i &lt;= 110; i++) {
    list.add(i);
}
for (int i = 0; i &lt; list.size(); i++) {
    System.out.println(list.get(i));
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; marks = new ArrayList&lt;Integer&gt;(Arrays.asList(7, 9, 4));
Iterator&lt;Integer&gt; iter = marks.iterator();          // 1. Iterator — the commented-out part of the slide
while (iter.hasNext()) {
    System.out.print(iter.next() + " ");
}
System.out.println("&lt;- Iterator");
for (int m : marks) {                               // 2. for-each (Java 5): an Iterator written for you
    System.out.print(m + " ");
}
System.out.println("&lt;- for-each");
marks.forEach(m -&gt; System.out.print(m + " "));      // 3. Java 8 forEach + lambda
System.out.println("&lt;- forEach (Java 8)");</code></pre>
<div class="out">101<br>
102<br>
103<br>
104<br>
105<br>
106<br>
107<br>
108<br>
109<br>
110<br>
7 9 4 &lt;- Iterator<br>
7 9 4 &lt;- for-each<br>
7 9 4 &lt;- forEach (Java 8)</div>
<p>For-each is an Iterator the compiler writes for you, so it works on every collection, including sets. ➕ What the slide does not show is the most common bug of this chapter: <strong>removing while traversing</strong>. Four attempts at "remove the even numbers" from <code>[5, 8, 8, 3, 6]</code>:</p>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; a = data();
try {
    for (Integer x : a) {
        if (x % 2 == 0) a.remove(x);             // remove(Object) through the LIST, not the iterator
    }
} catch (ConcurrentModificationException e) {
    System.out.println("1. for-each + list.remove -&gt; " + e.getClass().getName() + ", list now " + a);
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; b = data();
for (int i = 0; i &lt; b.size(); i++) {
    if (b.get(i) % 2 == 0) b.remove(i);          // the next element slides into index i and is never checked
}
System.out.println("2. index loop + remove(i) -&gt; " + b + "   &lt;- one 8 survived");</code></pre>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; c = data();
Iterator&lt;Integer&gt; it = c.iterator();
while (it.hasNext()) {
    if (it.next() % 2 == 0) it.remove();         // the ONLY safe remove during iteration
}
System.out.println("3. Iterator.remove() -&gt; " + c);
List&lt;Integer&gt; d = data();
d.removeIf(x -&gt; x % 2 == 0);                     // Java 8: the same thing in one line
System.out.println("4. removeIf (Java 8) -&gt; " + d);</code></pre>
<pre class="trich"><code class="language-java">List&lt;String&gt; e = new ArrayList&lt;String&gt;(Arrays.asList("A", "B", "C"));
for (String s : e) {
    if (s.equals("B")) e.remove(s);              // removing the SECOND-TO-LAST element: no exception, loop just stops
}
System.out.println("surprise: no exception, list " + e + " — and \\"C\\" was never visited");</code></pre>
<div class="out">1. for-each + list.remove -&gt; java.util.ConcurrentModificationException, list now [5, 8, 3, 6]<br>
2. index loop + remove(i) -&gt; [5, 8, 3] &nbsp;&nbsp;&lt;- one 8 survived<br>
3. Iterator.remove() -&gt; [5, 3]<br>
4. removeIf (Java 8) -&gt; [5, 3]<br>
surprise: no exception, list [A, C] — and "C" was never visited</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5627ec5e6b6e4b044f09f4d63c4b8614cdfe5587.svg" alt="Why attempt 1 fails: the iterator checks a modification counter on every next()" loading="lazy" /><p class="chu-thich">🧩 Why attempt 1 fails: the iterator checks a modification counter on every next()</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 10 — why for-each + list.remove(x) throws ConcurrentModificationException
participant "for-each loop" as L
participant "Iterator it\\nexpectedModCount = 5" as I
participant "ArrayList list\\nmodCount = 5" as A
L -&gt; I : hasNext() / next()
I -&gt; A : modCount == expectedModCount ? yes
I --&gt; L : 8
L -&gt; A : list.remove(8)
note right of A : modCount = 6\\n(the list changed\\nbehind the iterator's back)
L -&gt; I : hasNext() / next()
I -&gt; A : modCount == expectedModCount ? 6 != 5
I --&gt; L : throw ConcurrentModificationException
== the safe way ==
L -&gt; I : it.remove()
I -&gt; A : remove, then expectedModCount = modCount
@enduml</code></pre></details>
<p>Attempt 1 changes the list "behind the iterator's back", and the iterator is <strong>fail-fast</strong>: it throws <code>ConcurrentModificationException</code> instead of continuing with damaged state. Attempt 2 throws nothing and is worse — it silently skips the element that slides into the removed position. <code>it.remove()</code> (and Java 8's <code>removeIf</code>) is the safe way. The last case is the FE's favourite: removing the <em>second-to-last</em> element ends the loop with no exception — <code>hasNext()</code> sees <code>cursor == size</code> and returns false.</p>
<div class="pitfall">PE question 3 "f3: remove all items whose …" (PE6, PE11–PE14 on the Exam Room) is exactly attempt 3. A for-each with <code>t.remove(x)</code> passes the sample test where nothing needs removing and crashes on the hidden ones.</div>`,
        `<p class="y-chinh">🎯 Slide đổ 101..110 vào một <code>ArrayList</code> rồi in bằng vòng lặp chỉ số (<code>size()</code> + <code>get(i)</code>); phần bị chú thích làm cùng việc đó bằng <strong>Iterator</strong>: <code>iterator()</code>, rồi <code>while (iter.hasNext()) … iter.next()</code>.</p>
<p>Code của slide y nguyên (một <code>ArrayList</code> thô — <code>list.add(i)</code> đóng hộp mỗi <code>int</code> thành <code>Integer</code>), rồi ba cách duyệt một list:</p>
<pre class="trich"><code class="language-java">ArrayList list= new ArrayList();
for (int i = 101; i &lt;= 110; i++) {
    list.add(i);
}
for (int i = 0; i &lt; list.size(); i++) {
    System.out.println(list.get(i));
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; marks = new ArrayList&lt;Integer&gt;(Arrays.asList(7, 9, 4));
Iterator&lt;Integer&gt; iter = marks.iterator();          // phần bị chú thích trên slide
while (iter.hasNext()) {
    System.out.print(iter.next() + " ");
}
System.out.println("&lt;- Iterator");
for (int m : marks) {                               // một Iterator được viết sẵn giúp bạn
    System.out.print(m + " ");
}
System.out.println("&lt;- for-each");
marks.forEach(m -&gt; System.out.print(m + " "));      // Java 8 forEach + lambda
System.out.println("&lt;- forEach (Java 8)");</code></pre>
<div class="out">101<br>
102<br>
103<br>
104<br>
105<br>
106<br>
107<br>
108<br>
109<br>
110<br>
7 9 4 &lt;- Iterator<br>
7 9 4 &lt;- for-each<br>
7 9 4 &lt;- forEach (Java 8)</div>
<p>For-each là một Iterator do trình biên dịch viết giúp bạn, nên nó chạy với mọi collection, kể cả set. ➕ Điều slide không cho thấy là lỗi hay gặp nhất của chương: <strong>xoá trong lúc duyệt</strong>. Bốn lần thử "xoá các số chẵn" khỏi <code>[5, 8, 8, 3, 6]</code>:</p>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; a = data();
try {
    for (Integer x : a) {
        if (x % 2 == 0) a.remove(x);             // xoá qua LIST, không qua iterator
    }
} catch (ConcurrentModificationException e) {
    System.out.println("1. for-each + list.remove -&gt; " + e.getClass().getName() + ", list now " + a);
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; b = data();
for (int i = 0; i &lt; b.size(); i++) {
    if (b.get(i) % 2 == 0) b.remove(i);          // phần tử kế trượt vào chỉ số i và không bao giờ được xét
}
System.out.println("2. index loop + remove(i) -&gt; " + b + "   &lt;- one 8 survived");</code></pre>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; c = data();
Iterator&lt;Integer&gt; it = c.iterator();
while (it.hasNext()) {
    if (it.next() % 2 == 0) it.remove();         // cách xoá DUY NHẤT an toàn khi đang duyệt
}
System.out.println("3. Iterator.remove() -&gt; " + c);
List&lt;Integer&gt; d = data();
d.removeIf(x -&gt; x % 2 == 0);                     // Java 8: cùng việc đó trong một dòng
System.out.println("4. removeIf (Java 8) -&gt; " + d);</code></pre>
<pre class="trich"><code class="language-java">List&lt;String&gt; e = new ArrayList&lt;String&gt;(Arrays.asList("A", "B", "C"));
for (String s : e) {
    if (s.equals("B")) e.remove(s);              // xoá phần tử ÁP CHÓT: không ngoại lệ, vòng lặp chỉ dừng
}
System.out.println("surprise: no exception, list " + e + " — and \\"C\\" was never visited");</code></pre>
<div class="out">1. for-each + list.remove -&gt; java.util.ConcurrentModificationException, list now [5, 8, 3, 6]<br>
2. index loop + remove(i) -&gt; [5, 8, 3] &nbsp;&nbsp;&lt;- one 8 survived<br>
3. Iterator.remove() -&gt; [5, 3]<br>
4. removeIf (Java 8) -&gt; [5, 3]<br>
surprise: no exception, list [A, C] — and "C" was never visited</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/5627ec5e6b6e4b044f09f4d63c4b8614cdfe5587.svg" alt="Vì sao lần thử 1 hỏng: iterator kiểm một bộ đếm sửa đổi ở mỗi lần next()" loading="lazy" /><p class="chu-thich">🧩 Vì sao lần thử 1 hỏng: iterator kiểm một bộ đếm sửa đổi ở mỗi lần next()</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 10 — why for-each + list.remove(x) throws ConcurrentModificationException
participant "for-each loop" as L
participant "Iterator it\\nexpectedModCount = 5" as I
participant "ArrayList list\\nmodCount = 5" as A
L -&gt; I : hasNext() / next()
I -&gt; A : modCount == expectedModCount ? yes
I --&gt; L : 8
L -&gt; A : list.remove(8)
note right of A : modCount = 6\\n(the list changed\\nbehind the iterator's back)
L -&gt; I : hasNext() / next()
I -&gt; A : modCount == expectedModCount ? 6 != 5
I --&gt; L : throw ConcurrentModificationException
== the safe way ==
L -&gt; I : it.remove()
I -&gt; A : remove, then expectedModCount = modCount
@enduml</code></pre></details>
<p>Lần 1 sửa list "sau lưng iterator", mà iterator thì <strong>fail-fast</strong> (hỏng sớm): nó ném <code>ConcurrentModificationException</code> (lỗi sửa đổi đồng thời) thay vì chạy tiếp với trạng thái đã hỏng. Lần 2 không ném gì và còn tệ hơn — nó lặng lẽ bỏ qua phần tử trượt vào vị trí vừa xoá. <code>it.remove()</code> (và <code>removeIf</code> của Java 8) là cách an toàn. Trường hợp cuối là câu FE ưa thích: xoá phần tử <em>áp chót</em> làm vòng lặp kết thúc mà không có ngoại lệ — <code>hasNext()</code> thấy <code>cursor == size</code> nên trả false.</p>
<div class="pitfall">Câu 3 đề PE "f3: remove all items whose …" (PE6, PE11–PE14 trên Exam Room) chính là lần thử 3. Một vòng for-each với <code>t.remove(x)</code> qua được test mẫu không cần xoá gì và sập ở các test ẩn.</div>`],
      [11, 'Using the Vector class',
        `<p class="y-chinh">🎯 <code>java.util.Vector&lt;E&gt;</code> implements <code>Cloneable</code>, <code>List&lt;E&gt;</code>, <code>RandomAccess</code>, <code>Serializable</code>. The demo puts an <code>Integer</code>, a <code>String</code> and two <code>Point</code>s into one Vector, prints it, removes index 2 and prints again. The red box: "Vector is obsolete from Java 1.6 but still introduced because it is a parameter in the constructor of <code>javax.swing.JTable</code>".</p>
<p>The program from the screenshot, unchanged — the output matches the slide's NetBeans window line for line:</p>
<pre><code class="language-java">// release: 8
// Slide 11: the slide's UseVector program exactly as on the screenshot (raw Vector holding an Integer, a String and two Points)
import java.util.Vector;

class Point {
  int x,y;
  Point() { x=0; y=0; }
  Point(int xx, int yy){
      x=xx; y=yy;
  }
  public String toString() { return "[" + x + "," + y + "]";}
}
public class UseVector {
  public static void main(String[] args) {
      Vector v = new Vector();
      v.add(15);
      v.add("Hello");
      v.add(new Point());
      v.add(new Point(5,-7));
      System.out.println(v);
      v.remove(2);
      System.out.println(v);
      for (int i=0;i&lt;v.size();i++) System.out.print(v.get(i) + ", ");
      System.out.println();
  }
}</code></pre>
<div class="out">[15, Hello, [0,0], [5,-7]]<br>
[15, Hello, [5,-7]]<br>
15, Hello, [5,-7],</div>
<p>Why it works: a raw <code>Vector</code> holds <code>Object</code>s, so anything fits; <code>println(v)</code> calls <code>Vector.toString()</code>, which calls each element's <code>toString()</code> — <code>Point</code> overrides it as <code>[x,y]</code>. <code>v.remove(2)</code> has an <code>int</code> argument, so it is <code>remove(int index)</code>: it removes <code>[0,0]</code>. Mixing types in one list is only a demo — the moment you need <code>x</code> of an element you must cast, which is what generics avoid.</p>
<p>Is Vector "obsolete from Java 1.6"? Not officially. It was retrofitted to implement <code>List</code> in 1.2, and its Javadoc says only: "If a thread-safe implementation is not needed, it is recommended to use ArrayList in place of Vector." It was never marked <code>@Deprecated</code> — ask javac 8 with deprecation warnings on:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Old.java",
        "import java.util.*;\\n" +
        "public class Old {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Vector&lt;String&gt; v = new Vector&lt;String&gt;();\\n" +
        "        v.add(\\"ok\\");\\n" +
        "        Hashtable&lt;String, Integer&gt; h = new Hashtable&lt;String, Integer&gt;();\\n" +
        "        h.put(\\"ok\\", 1);\\n" +
        "        Date d = new Date(2026, 9, 15);\\n" +
        "        System.out.println(v + \\" \\" + h + \\" \\" + d.getYear());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "-Xlint:deprecation", "Old.java");
    lenh(d, "java", "Old");
}</code></pre>
<div class="out">&gt; javac -Xlint:deprecation Old.java<br>
Old.java:8: warning: [deprecation] Date(int,int,int) in Date has been deprecated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date d = new Date(2026, 9, 15);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Old.java:9: warning: [deprecation] getYear() in Date has been deprecated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(v + " " + h + " " + d.getYear());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 warnings<br>
&gt; java Old<br>
[ok] {ok=1} 2026</div>
<p>Two warnings, both for <code>Date</code> (deprecated since JDK 1.1 — <code>new Date(2026, 9, 15)</code> is really the year 3926), none for <code>Vector</code> or <code>Hashtable</code>. The honest word is <strong>legacy</strong>: it works, it is synchronized (slower), use <code>ArrayList</code> in new code. The <code>JTable(Vector rowData, Vector columnNames)</code> constructor is real.</p>`,
        `<p class="y-chinh">🎯 <code>java.util.Vector&lt;E&gt;</code> hiện thực <code>Cloneable</code>, <code>List&lt;E&gt;</code>, <code>RandomAccess</code>, <code>Serializable</code>. Demo bỏ một <code>Integer</code>, một <code>String</code> và hai <code>Point</code> vào cùng một Vector, in ra, xoá chỉ số 2 rồi in lại. Hộp đỏ: "Vector lỗi thời từ Java 1.6 nhưng vẫn được giới thiệu vì nó là tham số trong constructor của <code>javax.swing.JTable</code>".</p>
<p>Chương trình trong ảnh chụp, không sửa gì — output khớp cửa sổ NetBeans của slide từng dòng:</p>
<pre><code class="language-java">// release: 8
// Slide 11: chương trình UseVector của slide y như ảnh chụp (Vector kiểu thô chứa một Integer, một String và hai Point)
import java.util.Vector;

class Point {
  int x,y;
  Point() { x=0; y=0; }
  Point(int xx, int yy){
      x=xx; y=yy;
  }
  public String toString() { return "[" + x + "," + y + "]";}
}
public class UseVector {
  public static void main(String[] args) {
      Vector v = new Vector();
      v.add(15);
      v.add("Hello");
      v.add(new Point());
      v.add(new Point(5,-7));
      System.out.println(v);
      v.remove(2);
      System.out.println(v);
      for (int i=0;i&lt;v.size();i++) System.out.print(v.get(i) + ", ");
      System.out.println();
  }
}</code></pre>
<div class="out">[15, Hello, [0,0], [5,-7]]<br>
[15, Hello, [5,-7]]<br>
15, Hello, [5,-7],</div>
<p>Vì sao chạy được: một <code>Vector</code> thô chứa các <code>Object</code>, nên gì cũng bỏ vào được; <code>println(v)</code> gọi <code>Vector.toString()</code>, hàm này gọi <code>toString()</code> của từng phần tử — <code>Point</code> ghi đè nó thành <code>[x,y]</code>. <code>v.remove(2)</code> có đối số <code>int</code>, nên đó là <code>remove(int index)</code>: nó xoá <code>[0,0]</code>. Trộn nhiều kiểu trong một list chỉ để minh hoạ — ngay khi cần lấy <code>x</code> của một phần tử bạn phải ép kiểu, đúng thứ generics tránh cho bạn.</p>
<p>Vector có "lỗi thời từ Java 1.6" không? Chính thức thì không. Nó được sửa lại để hiện thực <code>List</code> từ bản 1.2, và Javadoc của nó chỉ nói: "Nếu không cần cài đặt an toàn luồng, nên dùng ArrayList thay cho Vector." Nó chưa bao giờ bị đánh dấu <code>@Deprecated</code> (không khuyến khích dùng, sắp bỏ) — hỏi javac 8 với cảnh báo deprecation bật lên:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    viet(d, "Old.java",
        "import java.util.*;\\n" +
        "public class Old {\\n" +
        "    public static void main(String[] args) {\\n" +
        "        Vector&lt;String&gt; v = new Vector&lt;String&gt;();\\n" +
        "        v.add(\\"ok\\");\\n" +
        "        Hashtable&lt;String, Integer&gt; h = new Hashtable&lt;String, Integer&gt;();\\n" +
        "        h.put(\\"ok\\", 1);\\n" +
        "        Date d = new Date(2026, 9, 15);\\n" +
        "        System.out.println(v + \\" \\" + h + \\" \\" + d.getYear());\\n" +
        "    }\\n" +
        "}\\n");
    lenh(d, "javac", "-Xlint:deprecation", "Old.java");
    lenh(d, "java", "Old");
}</code></pre>
<div class="out">&gt; javac -Xlint:deprecation Old.java<br>
Old.java:8: warning: [deprecation] Date(int,int,int) in Date has been deprecated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date d = new Date(2026, 9, 15);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
Old.java:9: warning: [deprecation] getYear() in Date has been deprecated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.out.println(v + " " + h + " " + d.getYear());<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 warnings<br>
&gt; java Old<br>
[ok] {ok=1} 2026</div>
<p>Hai cảnh báo, cả hai cho <code>Date</code> (deprecated từ JDK 1.1 — <code>new Date(2026, 9, 15)</code> thật ra là năm 3926), không cái nào cho <code>Vector</code> hay <code>Hashtable</code>. Chữ đúng là <strong>di sản (legacy)</strong>: vẫn chạy, có đồng bộ hoá (chậm hơn), code mới thì dùng <code>ArrayList</code>. Constructor <code>JTable(Vector rowData, Vector columnNames)</code> là có thật.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>Which of List, Set, Map would you use for: the marks of one student in the order they were entered; the set of distinct subject codes in a timetable; the phone number of each student id?</li>
<li>Why is <code>List&lt;String&gt; names = new ArrayList&lt;String&gt;();</code> better than <code>ArrayList names = new ArrayList();</code>? Give two reasons.</li>
<li><code>List&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;(Arrays.asList(4, 0, 4));</code> — what is <code>a</code> after <code>a.remove(0)</code>? After <code>a.remove(Integer.valueOf(4))</code> instead?</li>
<li>Write the loop that removes every name shorter than 3 letters from a <code>List&lt;String&gt;</code>, without <code>ConcurrentModificationException</code>.</li>
</ul>
<p>Continue with <strong>8.B</strong>: sets (and the <code>equals</code>/<code>hashCode</code> bug that lets duplicates in), hash tables, <code>Comparable</code>, and maps.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Bạn dùng List, Set hay Map cho: các điểm của một sinh viên theo thứ tự nhập; tập các mã môn khác nhau trong một thời khoá biểu; số điện thoại của mỗi mã sinh viên?</li>
<li>Vì sao <code>List&lt;String&gt; names = new ArrayList&lt;String&gt;();</code> tốt hơn <code>ArrayList names = new ArrayList();</code>? Nêu hai lý do.</li>
<li><code>List&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;(Arrays.asList(4, 0, 4));</code> — <code>a</code> thành gì sau <code>a.remove(0)</code>? Nếu thay bằng <code>a.remove(Integer.valueOf(4))</code> thì sao?</li>
<li>Viết vòng lặp xoá mọi tên ngắn hơn 3 chữ khỏi một <code>List&lt;String&gt;</code>, không dính <code>ConcurrentModificationException</code>.</li>
</ul>
<p>Học tiếp <strong>8.B</strong>: set (và lỗi <code>equals</code>/<code>hashCode</code> để lọt phần tử trùng), bảng băm, <code>Comparable</code>, và map.</p>`),
    books([
      ['horstmann1', 'Ch. 9.1 "The Java Collections Framework" (interfaces vs implementations, Iterator, removing elements) and 9.3.1–9.3.2 "Linked Lists", "Array Lists"; Ch. 8 "Generic Programming" for the &lt;E&gt; notation', 'Chương 9.1 "The Java Collections Framework" (interface và cài đặt, Iterator, xoá phần tử) và 9.3.1–9.3.2 "Linked Lists", "Array Lists"; Chương 8 "Generic Programming" cho ký hiệu &lt;E&gt;'],
      ['javaTutorial', 'trail "Collections" — "Interfaces" (The Collection Interface, The List Interface), "Implementations" (List Implementations)', 'trail "Collections" — "Interfaces" (The Collection Interface, The List Interface), "Implementations" (List Implementations)'],
      ['apiDocs', 'java.util.Collection, List, ArrayList, LinkedList, Vector, Iterator, Arrays.asList', 'java.util.Collection, List, ArrayList, LinkedList, Vector, Iterator, Arrays.asList'],
      ['fuOffline', 'part "Collection" — Abstract Data Types, the Collections framework, List and ArrayList (demonstrations 1–2)', 'phần "Collection" — kiểu dữ liệu trừu tượng, khung Collections, List và ArrayList (demo 1–2)'],
    ]),
  ].join('\n'),
};

/* ───────── 8.B — 📑 Slide by slide · Collections (2/2): Set, hashing, equals/hashCode, Comparable, Map (slides 12–27) ───────── */
const L_pro13_2 = {
  title: '8.B — 📑 Slide by slide · Collections (2/2): Set, hashing, equals/hashCode, Comparable, Map (slides 12–27)|||8.B — 📑 Học theo từng slide · Collections (2/2): Set, bảng băm, equals/hashCode, Comparable, Map (slide 12–27)',
  slug: 'pro192-slide-pro13-2',
  type: 'VIDEO',
  description: 'Giảng slide 12–27 bộ "Collections" của trường: Set không cho trùng và lỗi kinh điển quên hashCode (bốn lớp Point chạy thật: 1, 2, 2, 1), Set không thêm phương thức nào (kiểm bằng phản chiếu trên JDK 8), cây bên trong TreeSet và iterator đi cây sống, TreeSet/HashSet với số ngẫu nhiên lặp lại được (rút 10 số chỉ còn 9), NavigableSet, hàm băm của slide tính thật (sai thứ tự ưu tiên toán tử) và mã băm thật của String trong HashMap, HashSet hay TreeSet hay LinkedHashSet, hợp đồng compareTo và lối tắt phép trừ bị tràn số, Student implements Comparable của slide, TreeSet coi compareTo bằng 0 là trùng nên mất sinh viên, Comparator, Map: put trả giá trị cũ, khoá so bằng equals, HashMap so với TreeMap (khoá null, thứ tự), chương trình HashMap của slide chạy thật, đếm từ, và vì sao ảnh chụp slide 26 in thứ tự khác JDK 8 (tính lại công thức băm của JDK 7).',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.B · school deck "Collections", slides 12–27</span>
<h2>Sets and maps: when "the same" is decided by equals, hashCode and compareTo</h2>
<p class="lead">A <code>List</code> never asks whether two elements are equal. A <code>Set</code> and a <code>Map</code> ask it all the time — and they ask <em>your</em> class. Slides 12–27 cover <code>HashSet</code> and <code>TreeSet</code>, the hash table and the tree behind them, <code>Comparable</code>, and <code>HashMap</code>/<code>TreeMap</code>. The thread through the whole lesson: a hash structure asks <code>hashCode()</code> then <code>equals()</code>; a tree structure asks <code>compareTo()</code>. Get those wrong and duplicates slip in, or real elements vanish — both measured below.</p>
<table>
<thead><tr><th>Slides</th><th>Topic</th><th>After this you can</th></tr></thead>
<tbody>
<tr><td>12–13</td><td>Set; equals vs ==; HashSet vs TreeSet cost</td><td>write equals + hashCode so a HashSet rejects real duplicates</td></tr>
<tr><td>14–16</td><td>TreeSet, tree, Iterator</td><td>predict the order a TreeSet prints and use first/floor/headSet</td></tr>
<tr><td>17–19</td><td>hash table; HashSet; choosing a Set</td><td>explain why a HashSet's order looks random, and choose Hash/Linked/Tree</td></tr>
<tr><td>20–22</td><td>Comparable, compareTo; a TreeSet of Students</td><td>write compareTo without the overflow bug, and know when a TreeSet drops an element</td></tr>
<tr><td>23–27</td><td>Map; HashMap, TreeMap; iterating a map</td><td>count, group and look up with a map, and print it sorted</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.B · bộ slide "Collections" của trường, slide 12–27</span>
<h2>Set và map: khi "giống nhau" do equals, hashCode và compareTo quyết định</h2>
<p class="lead">Một <code>List</code> không bao giờ hỏi hai phần tử có bằng nhau không. <code>Set</code> và <code>Map</code> thì hỏi liên tục — và chúng hỏi chính <em>lớp của bạn</em>. Slide 12–27 giảng <code>HashSet</code> và <code>TreeSet</code>, bảng băm (hash table) và cây (tree) đằng sau chúng, <code>Comparable</code>, và <code>HashMap</code>/<code>TreeMap</code>. Sợi chỉ xuyên suốt bài: cấu trúc băm hỏi <code>hashCode()</code> rồi <code>equals()</code>; cấu trúc cây hỏi <code>compareTo()</code>. Viết sai mấy hàm đó thì phần tử trùng lọt vào, hoặc phần tử thật biến mất — cả hai đều được đo bên dưới.</p>
<table>
<thead><tr><th>Slide</th><th>Chủ đề</th><th>Học xong làm được</th></tr></thead>
<tbody>
<tr><td>12–13</td><td>Set; equals và ==; chi phí HashSet và TreeSet</td><td>viết equals + hashCode để HashSet từ chối đúng phần tử trùng</td></tr>
<tr><td>14–16</td><td>TreeSet, cây, Iterator</td><td>đoán thứ tự TreeSet in ra và dùng first/floor/headSet</td></tr>
<tr><td>17–19</td><td>bảng băm; HashSet; chọn loại Set</td><td>giải thích vì sao thứ tự của HashSet trông như ngẫu nhiên, và chọn Hash/Linked/Tree</td></tr>
<tr><td>20–22</td><td>Comparable, compareTo; TreeSet chứa Student</td><td>viết compareTo không dính lỗi tràn số, và biết khi nào TreeSet làm rơi phần tử</td></tr>
<tr><td>23–27</td><td>Map; HashMap, TreeMap; duyệt map</td><td>đếm, gom nhóm và tra cứu bằng map, và in nó theo thứ tự</td></tr>
</tbody>
</table>`),
    walkHead('pro13', 12, 27),
    walk('pro13', [
      [12, 'Sets',
        `<p class="y-chinh">🎯 Lists are based on an ordering of their members; <strong>sets have no concept of order</strong>. A Set is a cluster of references and may <strong>not contain duplicate elements</strong>. Sets use the <code>equals()</code> method, not <code>==</code>, to check for duplicates: <code>addTwice</code> adds two <code>new Point(10, 20)</code> and "will print out 1, not 2".</p>
<p>That last sentence is true only for a <code>Point</code> class written correctly — the slide does not show which <code>Point</code> it means. Four versions, the slide's method run on each, in a <code>HashSet</code>:</p>
<pre class="trich"><code class="language-java">class PointNone {                          // no equals, no hashCode
    int x, y;
    PointNone(int x, int y) { this.x = x; this.y = y; }
}
class PointEq {                            // equals only — the classic bug
    int x, y;
    PointEq(int x, int y) { this.x = x; this.y = y; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PointEq)) return false;
        PointEq p = (PointEq) o;
        return x == p.x &amp;&amp; y == p.y;
    }
}
class PointFull {                          // equals + hashCode, consistent
    int x, y;
    PointFull(int x, int y) { this.x = x; this.y = y; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PointFull)) return false;
        PointFull p = (PointFull) o;
        return x == p.x &amp;&amp; y == p.y;
    }
    @Override
    public int hashCode() {
        return 31 * x + y;                 // equal points MUST give equal hash codes
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void addTwice(Set set, Object p1, Object p2) {    // the slide's method, generalised to any point class
    set.clear();
    set.add(p1);
    set.add(p2);
    System.out.println(set.size());
}

public static void main(String[] args) {
    Set set = new HashSet();
    System.out.print("java.awt.Point  -&gt; ");
    addTwice(set, new java.awt.Point(10, 20), new java.awt.Point(10, 20));
    System.out.print("PointNone       -&gt; ");
    addTwice(set, new PointNone(10, 20), new PointNone(10, 20));
    System.out.print("PointEq         -&gt; ");
    addTwice(set, new PointEq(10, 20), new PointEq(10, 20));
    System.out.print("PointFull       -&gt; ");
    addTwice(set, new PointFull(10, 20), new PointFull(10, 20));

    PointEq a = new PointEq(10, 20), b = new PointEq(10, 20);
    System.out.println("PointEq: a.equals(b)=" + a.equals(b) + " but a==b " + (a == b));
    List&lt;PointEq&gt; list = new ArrayList&lt;PointEq&gt;(); list.add(a);
    Set&lt;PointEq&gt; hs = new HashSet&lt;PointEq&gt;(); hs.add(a);
    System.out.println("PointEq: list.contains(b)=" + list.contains(b) + " (uses equals only), hashSet.contains(b)=" + hs.contains(b) + " (hashCode first)");
    Map&lt;PointFull, String&gt; m = new HashMap&lt;PointFull, String&gt;();
    m.put(new PointFull(1, 2), "shop A");
    System.out.println("PointFull as a HashMap key: get(new PointFull(1,2)) = " + m.get(new PointFull(1, 2)));
}</code></pre>
<div class="out">java.awt.Point &nbsp;-&gt; 1<br>
PointNone &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 2<br>
PointEq &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 2<br>
PointFull &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 1<br>
PointEq: a.equals(b)=true but a==b false<br>
PointEq: list.contains(b)=true (uses equals only), hashSet.contains(b)=false (hashCode first)<br>
PointFull as a HashMap key: get(new PointFull(1,2)) = shop A</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fcad25d5d7501e2720fdcdb88591b41a78ad05fb.svg" alt="Slide 12 ➕: a HashSet asks hashCode() first and equals() only inside one bucket" loading="lazy" /><p class="chu-thich">🧩 Slide 12 ➕: a HashSet asks hashCode() first and equals() only inside one bucket</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 12 — what set.add(p2) really does in a HashSet
start
:h = p2.hashCode();
:go to the bucket of h;
if (an element e there has the same hash\\nAND e.equals(p2)?) then (yes)
  :duplicate — nothing added,\\nadd returns false;
else (no)
  :store p2, add returns true;
endif
stop
note right
  equals() without hashCode():
  two equal points get two DIFFERENT
  identity hash codes ⇒ usually different buckets,
  and even in one bucket the hash test fails first ⇒
  equals() is never even called ⇒ size 2
end note
@enduml</code></pre></details>
<p><code>java.awt.Point</code> (the library class) overrides both methods, so the slide's "1" is right for it. A class with no <code>equals</code> compares identity: 2. The dangerous one is <code>PointEq</code>: <code>a.equals(b)</code> is true, <code>list.contains(b)</code> is true, yet the HashSet holds 2 and <code>contains(b)</code> is false — because the set never reaches <code>equals</code>: the two objects have different inherited hash codes. The contract (Javadoc of <code>Object.hashCode</code>): <strong>equal objects must have equal hash codes</strong>.</p>
<div class="pitfall">Rule for every class you put in a HashSet or use as a HashMap key: override <code>equals</code> and <code>hashCode</code> together, from the same fields (NetBeans: Insert Code → <code>equals() and hashCode()</code>). PE-ADV4's <code>countDistinct</code>/<code>removeDuplicates</code> on the Exam Room test exactly this.</div>`,
        `<p class="y-chinh">🎯 List dựa trên thứ tự của các phần tử; <strong>set không có khái niệm thứ tự</strong>. Set chỉ là một cụm tham chiếu và <strong>không được chứa phần tử trùng</strong>. Set dùng phương thức <code>equals()</code>, không dùng <code>==</code>, để kiểm trùng: <code>addTwice</code> thêm hai <code>new Point(10, 20)</code> và "sẽ in ra 1, không phải 2".</p>
<p>Câu cuối đó chỉ đúng với một lớp <code>Point</code> được viết đúng — slide không cho biết nó dùng <code>Point</code> nào. Bốn phiên bản, chạy phương thức của slide trên từng cái, trong một <code>HashSet</code>:</p>
<pre class="trich"><code class="language-java">class PointNone {                          // không equals, không hashCode
    int x, y;
    PointNone(int x, int y) { this.x = x; this.y = y; }
}
class PointEq {                            // chỉ có equals — lỗi kinh điển
    int x, y;
    PointEq(int x, int y) { this.x = x; this.y = y; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PointEq)) return false;
        PointEq p = (PointEq) o;
        return x == p.x &amp;&amp; y == p.y;
    }
}
class PointFull {                          // equals + hashCode, nhất quán
    int x, y;
    PointFull(int x, int y) { this.x = x; this.y = y; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PointFull)) return false;
        PointFull p = (PointFull) o;
        return x == p.x &amp;&amp; y == p.y;
    }
    @Override
    public int hashCode() {
        return 31 * x + y;                 // hai điểm bằng nhau PHẢI cho cùng mã băm
    }
}</code></pre>
<pre class="trich"><code class="language-java">static void addTwice(Set set, Object p1, Object p2) {    // phương thức của slide, tổng quát cho mọi lớp điểm
    set.clear();
    set.add(p1);
    set.add(p2);
    System.out.println(set.size());
}

public static void main(String[] args) {
    Set set = new HashSet();
    System.out.print("java.awt.Point  -&gt; ");
    addTwice(set, new java.awt.Point(10, 20), new java.awt.Point(10, 20));
    System.out.print("PointNone       -&gt; ");
    addTwice(set, new PointNone(10, 20), new PointNone(10, 20));
    System.out.print("PointEq         -&gt; ");
    addTwice(set, new PointEq(10, 20), new PointEq(10, 20));
    System.out.print("PointFull       -&gt; ");
    addTwice(set, new PointFull(10, 20), new PointFull(10, 20));

    PointEq a = new PointEq(10, 20), b = new PointEq(10, 20);
    System.out.println("PointEq: a.equals(b)=" + a.equals(b) + " but a==b " + (a == b));
    List&lt;PointEq&gt; list = new ArrayList&lt;PointEq&gt;(); list.add(a);
    Set&lt;PointEq&gt; hs = new HashSet&lt;PointEq&gt;(); hs.add(a);
    System.out.println("PointEq: list.contains(b)=" + list.contains(b) + " (uses equals only), hashSet.contains(b)=" + hs.contains(b) + " (hashCode first)");
    Map&lt;PointFull, String&gt; m = new HashMap&lt;PointFull, String&gt;();
    m.put(new PointFull(1, 2), "shop A");
    System.out.println("PointFull as a HashMap key: get(new PointFull(1,2)) = " + m.get(new PointFull(1, 2)));
}</code></pre>
<div class="out">java.awt.Point &nbsp;-&gt; 1<br>
PointNone &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 2<br>
PointEq &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 2<br>
PointFull &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; 1<br>
PointEq: a.equals(b)=true but a==b false<br>
PointEq: list.contains(b)=true (uses equals only), hashSet.contains(b)=false (hashCode first)<br>
PointFull as a HashMap key: get(new PointFull(1,2)) = shop A</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/fcad25d5d7501e2720fdcdb88591b41a78ad05fb.svg" alt="Slide 12 ➕: HashSet hỏi hashCode() trước, và chỉ hỏi equals() bên trong một ô" loading="lazy" /><p class="chu-thich">🧩 Slide 12 ➕: HashSet hỏi hashCode() trước, và chỉ hỏi equals() bên trong một ô</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 12 — what set.add(p2) really does in a HashSet
start
:h = p2.hashCode();
:go to the bucket of h;
if (an element e there has the same hash\\nAND e.equals(p2)?) then (yes)
  :duplicate — nothing added,\\nadd returns false;
else (no)
  :store p2, add returns true;
endif
stop
note right
  equals() without hashCode():
  two equal points get two DIFFERENT
  identity hash codes ⇒ usually different buckets,
  and even in one bucket the hash test fails first ⇒
  equals() is never even called ⇒ size 2
end note
@enduml</code></pre></details>
<p><code>java.awt.Point</code> (lớp có sẵn của thư viện) ghi đè cả hai phương thức, nên con số "1" của slide đúng với nó. Lớp không có <code>equals</code> thì so danh tính (identity): 2. Cái nguy hiểm là <code>PointEq</code>: <code>a.equals(b)</code> là true, <code>list.contains(b)</code> là true, vậy mà HashSet giữ 2 phần tử và <code>contains(b)</code> là false — vì set không bao giờ đi tới <code>equals</code>: hai đối tượng có mã băm kế thừa khác nhau. Hợp đồng (Javadoc của <code>Object.hashCode</code>): <strong>hai đối tượng bằng nhau phải có mã băm bằng nhau</strong>.</p>
<div class="pitfall">Luật cho mọi lớp bạn bỏ vào HashSet hay dùng làm khoá HashMap: ghi đè <code>equals</code> và <code>hashCode</code> cùng nhau, từ cùng các trường (NetBeans: Insert Code → <code>equals() and hashCode()</code>). <code>countDistinct</code>/<code>removeDuplicates</code> của đề PE-ADV4 trên Exam Room kiểm đúng điều này.</div>`],
      [13, 'Sets…',
        `<p class="y-chinh">🎯 <code>Set</code> extends <code>Collection</code> but <strong>does not add any additional methods</strong>. The two most used implementations: <strong>TreeSet</strong> — elements in ascending order, <code>log(n)</code> time for add, remove, contains; <strong>HashSet</strong> — constant time for add, remove, contains and size.</p>
<p>The first sentence can be checked instead of believed. On the exam JDK, ask the class objects themselves which method names <code>Set</code> declares that <code>Collection</code> does not — and, for contrast, which ones <code>List</code> adds:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 13: "Set extends Collection but does not add any additional methods" — checked on JDK 8 with reflection
import java.lang.reflect.Method;
import java.util.*;

public class SetKhongThemGi {
    public static void main(String[] args) {
        Set&lt;String&gt; inCollection = new TreeSet&lt;String&gt;();
        for (Method m : Collection.class.getMethods()) inCollection.add(m.getName());
        Set&lt;String&gt; declaredBySet = new TreeSet&lt;String&gt;();
        Set&lt;String&gt; newInSet = new TreeSet&lt;String&gt;();
        for (Method m : Set.class.getDeclaredMethods()) {
            declaredBySet.add(m.getName());
            if (!inCollection.contains(m.getName())) newInSet.add(m.getName());
        }
        System.out.println("Java " + System.getProperty("java.specification.version"));
        System.out.println("Set re-declares " + declaredBySet.size() + " names: " + declaredBySet);
        System.out.println("names that Collection does not have: " + newInSet);
        List&lt;String&gt; list = new ArrayList&lt;String&gt;();
        for (Method m : List.class.getDeclaredMethods()) if (!inCollection.contains(m.getName())) list.add(m.getName());
        Collections.sort(list);
        System.out.println("List, for comparison, adds: " + new TreeSet&lt;String&gt;(list));
    }
}</code></pre>
<div class="out">Java 1.8<br>
Set re-declares 15 names: [add, addAll, clear, contains, containsAll, equals, hashCode, isEmpty, iterator, remove, removeAll, retainAll, size, spliterator, toArray]<br>
names that Collection does not have: []<br>
List, for comparison, adds: [get, indexOf, lastIndexOf, listIterator, replaceAll, set, sort, subList]</div>
<p>Set re-declares 15 methods (to rewrite their documentation: <code>add</code> must return false for a duplicate) but adds none; <code>List</code> adds the index methods <code>get</code>, <code>set</code>, <code>indexOf</code>… — that is why you cannot write <code>set.get(0)</code>. ➕ Java 9 added the static factories <code>Set.of</code>/<code>Set.copyOf</code>, which is why this file is pinned to JDK 8.</p>
<table>
<thead><tr><th></th><th>HashSet</th><th>TreeSet</th></tr></thead>
<tbody>
<tr><td>structure</td><td>hash table (slide 17)</td><td>red-black tree (slide 14)</td></tr>
<tr><td>add / remove / contains</td><td>O(1) on average</td><td>O(log n)</td></tr>
<tr><td>iteration order</td><td>none promised</td><td>ascending (Comparable or a Comparator)</td></tr>
<tr><td>needs from the element</td><td><code>equals</code> + <code>hashCode</code></td><td><code>compareTo</code> (or a Comparator)</td></tr>
<tr><td><code>null</code> element</td><td>allowed (one)</td><td>not allowed</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Constant time" on the slide means "on average, with a decent <code>hashCode</code>". If every element returned the same hash code, every one would land in one bucket and a HashSet would be as slow as a list.</p>`,
        `<p class="y-chinh">🎯 <code>Set</code> kế thừa <code>Collection</code> nhưng <strong>không thêm phương thức nào</strong>. Hai cài đặt hay dùng nhất: <strong>TreeSet</strong> — phần tử theo thứ tự tăng dần, thời gian <code>log(n)</code> cho add, remove, contains; <strong>HashSet</strong> — thời gian hằng số cho add, remove, contains và size.</p>
<p>Câu đầu tiên kiểm được chứ không cần tin. Trên JDK phòng thi, hỏi chính các đối tượng lớp xem <code>Set</code> khai báo tên phương thức nào mà <code>Collection</code> không có — và, để so, <code>List</code> thêm những gì:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 13: "Set kế thừa Collection nhưng không thêm phương thức nào" — kiểm trên JDK 8 bằng phản chiếu (reflection)
import java.lang.reflect.Method;
import java.util.*;

public class SetKhongThemGi {
    public static void main(String[] args) {
        Set&lt;String&gt; inCollection = new TreeSet&lt;String&gt;();
        for (Method m : Collection.class.getMethods()) inCollection.add(m.getName());
        Set&lt;String&gt; declaredBySet = new TreeSet&lt;String&gt;();
        Set&lt;String&gt; newInSet = new TreeSet&lt;String&gt;();
        for (Method m : Set.class.getDeclaredMethods()) {
            declaredBySet.add(m.getName());
            if (!inCollection.contains(m.getName())) newInSet.add(m.getName());
        }
        System.out.println("Java " + System.getProperty("java.specification.version"));
        System.out.println("Set re-declares " + declaredBySet.size() + " names: " + declaredBySet);
        System.out.println("names that Collection does not have: " + newInSet);
        List&lt;String&gt; list = new ArrayList&lt;String&gt;();
        for (Method m : List.class.getDeclaredMethods()) if (!inCollection.contains(m.getName())) list.add(m.getName());
        Collections.sort(list);
        System.out.println("List, for comparison, adds: " + new TreeSet&lt;String&gt;(list));
    }
}</code></pre>
<div class="out">Java 1.8<br>
Set re-declares 15 names: [add, addAll, clear, contains, containsAll, equals, hashCode, isEmpty, iterator, remove, removeAll, retainAll, size, spliterator, toArray]<br>
names that Collection does not have: []<br>
List, for comparison, adds: [get, indexOf, lastIndexOf, listIterator, replaceAll, set, sort, subList]</div>
<p>Set khai báo lại 15 phương thức (để viết lại tài liệu: <code>add</code> phải trả false với phần tử trùng) nhưng không thêm cái nào; <code>List</code> thêm các phương thức chỉ số <code>get</code>, <code>set</code>, <code>indexOf</code>… — vì thế không viết được <code>set.get(0)</code>. ➕ Java 9 thêm các hàm tạo static <code>Set.of</code>/<code>Set.copyOf</code>, nên file này được ghim vào JDK 8.</p>
<table>
<thead><tr><th></th><th>HashSet</th><th>TreeSet</th></tr></thead>
<tbody>
<tr><td>cấu trúc</td><td>bảng băm (slide 17)</td><td>cây đỏ-đen (slide 14)</td></tr>
<tr><td>add / remove / contains</td><td>O(1) trung bình</td><td>O(log n)</td></tr>
<tr><td>thứ tự duyệt</td><td>không hứa gì</td><td>tăng dần (Comparable hoặc một Comparator)</td></tr>
<tr><td>cần gì ở phần tử</td><td><code>equals</code> + <code>hashCode</code></td><td><code>compareTo</code> (hoặc một Comparator)</td></tr>
<tr><td>phần tử <code>null</code></td><td>được (một cái)</td><td>không được</td></tr>
</tbody>
</table>
<p class="meo">🧠 "Thời gian hằng số" trên slide nghĩa là "trung bình, với một <code>hashCode</code> tử tế". Nếu mọi phần tử trả cùng một mã băm, tất cả rơi vào một ô và HashSet chậm như một list.</p>`],
      [14, 'TreeSet  and Iterator',
        `<p class="y-chinh">🎯 An ordered tree (from Discrete Mathematics); a set is a group of different elements; a <strong>TreeSet = Set + ordered tree</strong>, each element is a node. "Iterator: an operation in which references of all nodes are grouped to make a linked list … a way to access every node of a tree."</p>
<p>The tree behind slide 16's <code>t.add(5); t.add(2); t.add(9); t.add(30);</code> — smaller keys to the left, larger to the right:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2b8b87786a10a45a38af0e22f21191037b920356.svg" alt="Slide 14 redrawn: a binary search tree; the iterator visits left subtree → node → right subtree" loading="lazy" /><p class="chu-thich">🧩 Slide 14 redrawn: a binary search tree; the iterator visits left subtree → node → right subtree</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 14 — t.add(5); t.add(2); t.add(9); t.add(30): the tree inside the TreeSet
' Smaller keys go left, larger keys go right; the iterator visits left subtree, node, right subtree
rectangle "5\\n(root, 2nd visited)" as N5 #EEF2FF
rectangle "2\\n(1st visited)" as N2 #ECFDF5
rectangle "9\\n(3rd visited)" as N9 #ECFDF5
rectangle "30\\n(4th visited)" as N30 #ECFDF5
N5 -down-&gt; N2 : left (smaller)
N5 -down-&gt; N9 : right (larger)
N2 -right[hidden]- N9
N9 -down-&gt; N30 : right (larger)
note right of N30
  add(9) a second time: compareTo gives 0
  at node 9 ⇒ duplicate, nothing is added.
  remove(9): 30 takes its place.
  TreeMap keeps the tree balanced
  (red-black tree) ⇒ add/remove/contains O(log n)
end note
@enduml</code></pre></details>
<p>The iterator part of the slide is not accurate. A TreeSet's iterator does <strong>not</strong> collect the nodes into a linked list first: it starts at the smallest node and each <code>next()</code> moves to the in-order successor in the <em>live</em> tree. Proof — change the set after creating an iterator:</p>
<pre><code class="language-java">// release: 8
// Slide 14: a TreeSet iterator walks the tree in order (left subtree, node, right subtree) — it does not copy the nodes into a list first
import java.util.*;

public class DuyetCay {
    public static void main(String[] args) {
        TreeSet&lt;Integer&gt; t = new TreeSet&lt;Integer&gt;();
        int[] order = { 30, 9, 5, 2, 41, 17 };          // insertion order does not matter
        for (int x : order) t.add(x);
        Iterator&lt;Integer&gt; up = t.iterator();
        System.out.print("ascending : ");
        while (up.hasNext()) System.out.print(up.next() + " ");
        System.out.println();
        Iterator&lt;Integer&gt; down = t.descendingIterator();
        System.out.print("descending: ");
        while (down.hasNext()) System.out.print(down.next() + " ");
        System.out.println();

        Iterator&lt;Integer&gt; it = t.iterator();
        System.out.println("first next() = " + it.next());
        t.add(1);                                       // change the set AFTER the iterator was created
        try {
            it.next();
        } catch (ConcurrentModificationException e) {
            System.out.println("next() after add -&gt; " + e.getClass().getSimpleName() + ": the iterator walks the LIVE tree");
        }
    }
}</code></pre>
<div class="out">ascending : 2 5 9 17 30 41<br>
descending: 41 30 17 9 5 2<br>
first next() = 2<br>
next() after add -&gt; ConcurrentModificationException: the iterator walks the LIVE tree</div>
<p>If the iterator worked on a copied list it would not notice the <code>add(1)</code>; instead it throws <code>ConcurrentModificationException</code>, like the ArrayList iterator of lesson 8.A. Inside, <code>TreeSet</code> uses a <code>TreeMap</code>, which keeps the tree balanced as a <strong>red-black tree</strong>, so its height stays about log₂ n — that is where slide 13's <code>log(n)</code> comes from.</p>
<div class="callout">🧭 <strong>Go further — CSD201</strong>: binary search trees, in-order traversal and balanced trees (AVL) are a whole chapter there; MAD101 gives the mathematical "tree".</div>`,
        `<p class="y-chinh">🎯 Cây có thứ tự (học ở môn Toán rời rạc); set là nhóm các phần tử khác nhau; <strong>TreeSet = Set + cây có thứ tự</strong>, mỗi phần tử là một nút. "Iterator: một thao tác trong đó tham chiếu của mọi nút được gom lại thành một danh sách liên kết … một cách để truy cập mọi nút của cây."</p>
<p>Cái cây đằng sau <code>t.add(5); t.add(2); t.add(9); t.add(30);</code> của slide 16 — khoá nhỏ hơn sang trái, lớn hơn sang phải:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/2b8b87786a10a45a38af0e22f21191037b920356.svg" alt="Slide 14 vẽ lại: cây nhị phân tìm kiếm; iterator đi cây trái → nút → cây phải" loading="lazy" /><p class="chu-thich">🧩 Slide 14 vẽ lại: cây nhị phân tìm kiếm; iterator đi cây trái → nút → cây phải</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 14 — t.add(5); t.add(2); t.add(9); t.add(30): the tree inside the TreeSet
' Khoá nhỏ hơn sang trái, lớn hơn sang phải; iterator đi cây trái, nút, cây phải
rectangle "5\\n(root, 2nd visited)" as N5 #EEF2FF
rectangle "2\\n(1st visited)" as N2 #ECFDF5
rectangle "9\\n(3rd visited)" as N9 #ECFDF5
rectangle "30\\n(4th visited)" as N30 #ECFDF5
N5 -down-&gt; N2 : left (smaller)
N5 -down-&gt; N9 : right (larger)
N2 -right[hidden]- N9
N9 -down-&gt; N30 : right (larger)
note right of N30
  add(9) a second time: compareTo gives 0
  at node 9 ⇒ duplicate, nothing is added.
  remove(9): 30 takes its place.
  TreeMap keeps the tree balanced
  (red-black tree) ⇒ add/remove/contains O(log n)
end note
@enduml</code></pre></details>
<p>Phần nói về iterator trên slide không chính xác. Iterator của TreeSet <strong>không</strong> gom các nút thành danh sách liên kết trước: nó bắt đầu ở nút nhỏ nhất và mỗi lần <code>next()</code> nhảy tới nút kế tiếp theo thứ tự giữa (in-order successor) trên cây <em>đang sống</em>. Bằng chứng — sửa set sau khi đã tạo iterator:</p>
<pre><code class="language-java">// release: 8
// Slide 14: iterator của TreeSet đi cây theo thứ tự giữa (cây trái, nút, cây phải) — nó không chép các nút ra một danh sách trước
import java.util.*;

public class DuyetCay {
    public static void main(String[] args) {
        TreeSet&lt;Integer&gt; t = new TreeSet&lt;Integer&gt;();
        int[] order = { 30, 9, 5, 2, 41, 17 };          // thứ tự thêm không quan trọng
        for (int x : order) t.add(x);
        Iterator&lt;Integer&gt; up = t.iterator();
        System.out.print("ascending : ");
        while (up.hasNext()) System.out.print(up.next() + " ");
        System.out.println();
        Iterator&lt;Integer&gt; down = t.descendingIterator();
        System.out.print("descending: ");
        while (down.hasNext()) System.out.print(down.next() + " ");
        System.out.println();

        Iterator&lt;Integer&gt; it = t.iterator();
        System.out.println("first next() = " + it.next());
        t.add(1);                                       // sửa tập SAU khi đã tạo iterator
        try {
            it.next();
        } catch (ConcurrentModificationException e) {
            System.out.println("next() after add -&gt; " + e.getClass().getSimpleName() + ": the iterator walks the LIVE tree");
        }
    }
}</code></pre>
<div class="out">ascending : 2 5 9 17 30 41<br>
descending: 41 30 17 9 5 2<br>
first next() = 2<br>
next() after add -&gt; ConcurrentModificationException: the iterator walks the LIVE tree</div>
<p>Nếu iterator chạy trên một danh sách đã chép thì nó không biết tới <code>add(1)</code>; đằng này nó ném <code>ConcurrentModificationException</code>, giống iterator của ArrayList ở bài 8.A. Bên trong, <code>TreeSet</code> dùng một <code>TreeMap</code>, cái này giữ cây cân bằng dạng <strong>cây đỏ-đen</strong> (red-black tree), nên chiều cao luôn khoảng log₂ n — đó là gốc của <code>log(n)</code> ở slide 13.</p>
<div class="callout">🧭 <strong>Đi tiếp — CSD201</strong>: cây nhị phân tìm kiếm, duyệt thứ tự giữa và cây cân bằng (AVL) là cả một chương ở đó; MAD101 cho bạn "cây" theo nghĩa toán học.</div>`],
      [15, 'TreeSet = Set + Tree',
        `<p class="y-chinh">🎯 Ten random numbers below 100 are added to a <code>TreeSet</code> and printed with an Iterator; "the result may be" 7, 27, 36, 41, 43, 46, 49, 57, 75, 83 — ascending.</p>
<p><code>new Random()</code> gives different numbers every run, so nobody can check the slide's result. With a fixed <strong>seed</strong> — <code>new Random(16)</code> — the sequence is the same on every JVM, and the program shows something the slide's picture hides:</p>
<pre><code class="language-java">// release: 8
// Slide 15: TreeSet = Set + Tree, with the slide's random numbers made repeatable (a fixed seed) so you can check the result
import java.util.*;

public class TreeSetNgauNhien {
    public static void main(String[] args) {
        Random r = new Random(16);          // the slide writes new Random(): a different result every run
        TreeSet myset = new TreeSet();
        System.out.print("drawn: ");
        for (int i = 0; i &lt; 10; i++) {
            int number = r.nextInt(100);
            System.out.print(number + " ");
            myset.add(number);
        }
        System.out.println();
        //using Iterator
        Iterator iter = myset.iterator();
        while (iter.hasNext()) {
            System.out.print(iter.next() + " ");
        }
        System.out.println();
        System.out.println("10 numbers drawn, size() = " + myset.size());
    }
}</code></pre>
<div class="out">drawn: 51 32 75 50 53 42 13 70 50 15<br>
13 15 32 42 50 51 53 70 75<br>
10 numbers drawn, size() = 9</div>
<p>The output is ascending whatever order the numbers came in — the tree sorts them on insertion. And <strong>50 was drawn twice</strong>, so ten draws gave a set of <strong>nine</strong>: the second <code>add(50)</code> returned <code>false</code>. The slide's "result" with ten different numbers is one lucky run, not a rule.</p>
<div class="pitfall">FE/PE: "Add 10 random numbers to a TreeSet; what is its size?" — <strong>at most</strong> 10. If a paper wants exactly 10 distinct numbers, loop <code>while (set.size() &lt; 10)</code>.</div>`,
        `<p class="y-chinh">🎯 Mười số ngẫu nhiên dưới 100 được thêm vào một <code>TreeSet</code> rồi in bằng Iterator; "kết quả có thể là" 7, 27, 36, 41, 43, 46, 49, 57, 75, 83 — tăng dần.</p>
<p><code>new Random()</code> cho số khác nhau mỗi lần chạy, nên không ai kiểm được kết quả của slide. Với <strong>hạt giống</strong> (seed) cố định — <code>new Random(16)</code> — dãy số giống nhau trên mọi JVM, và chương trình cho thấy một điều bức ảnh của slide giấu đi:</p>
<pre><code class="language-java">// release: 8
// Slide 15: TreeSet = Set + Tree, số ngẫu nhiên của slide được làm lặp lại được (hạt giống cố định) để bạn kiểm kết quả
import java.util.*;

public class TreeSetNgauNhien {
    public static void main(String[] args) {
        Random r = new Random(16);          // slide viết new Random(): mỗi lần chạy một kết quả
        TreeSet myset = new TreeSet();
        System.out.print("drawn: ");
        for (int i = 0; i &lt; 10; i++) {
            int number = r.nextInt(100);
            System.out.print(number + " ");
            myset.add(number);
        }
        System.out.println();
        //using Iterator
        Iterator iter = myset.iterator();
        while (iter.hasNext()) {
            System.out.print(iter.next() + " ");
        }
        System.out.println();
        System.out.println("10 numbers drawn, size() = " + myset.size());
    }
}</code></pre>
<div class="out">drawn: 51 32 75 50 53 42 13 70 50 15<br>
13 15 32 42 50 51 53 70 75<br>
10 numbers drawn, size() = 9</div>
<p>Output tăng dần dù các số tới theo thứ tự nào — cây sắp xếp chúng ngay lúc thêm. Và <strong>50 được rút hai lần</strong>, nên mười lần rút cho một set <strong>chín</strong> phần tử: lần <code>add(50)</code> thứ hai trả <code>false</code>. "Kết quả" mười số khác nhau trên slide là một lần chạy may mắn, không phải luật.</p>
<div class="pitfall">FE/PE: "Thêm 10 số ngẫu nhiên vào TreeSet; size là bao nhiêu?" — <strong>tối đa</strong> 10. Nếu đề muốn đúng 10 số khác nhau, hãy lặp <code>while (set.size() &lt; 10)</code>.</div>`],
      [16, 'Using the TreeSet class and Iterator',
        `<p class="y-chinh">🎯 <code>UseTreeSet</code>: <code>t.add(5); t.add(2); t.add(9); t.add(30); t.add(9);</code> prints <code>[2, 5, 9, 30]</code>; <code>t.remove(9)</code> → <code>[2, 5, 30]</code>; an Iterator prints <code>2, 5, 30,</code>. A TreeSet stores elements in ascending order — natural order for numbers, dictionary order for strings; for your own objects you must implement <code>compareTo</code> of <code>Comparable</code>.</p>
<p>The slide's program, then ➕ the methods that make a TreeSet more than "a sorted set" — it is a <code>NavigableSet</code>:</p>
<pre class="trich"><code class="language-java">TreeSet t= new TreeSet();
t.add(5); t.add(2); t.add(9);t.add(30); t.add(9);
System.out.println(t);
t.remove(9);
System.out.println(t);
Iterator it= t.iterator();
while (it.hasNext())
    System.out.print(it.next() + ", ");
System.out.println();</code></pre>
<pre class="trich"><code class="language-java">TreeSet&lt;Integer&gt; s = new TreeSet&lt;Integer&gt;();
for (int x : new int[] { 5, 2, 9, 30, 17, 41 }) s.add(x);
System.out.println("set " + s);
System.out.println("first() " + s.first() + "  last() " + s.last());
System.out.println("floor(10) " + s.floor(10) + "  ceiling(10) " + s.ceiling(10) + "   &lt;- nearest &lt;= 10 and &gt;= 10");
System.out.println("lower(9) " + s.lower(9) + "  higher(9) " + s.higher(9) + "   &lt;- strictly &lt; 9 and &gt; 9");
System.out.println("headSet(17) " + s.headSet(17) + "  tailSet(17) " + s.tailSet(17) + "  subSet(5, 30) " + s.subSet(5, 30));
System.out.println("descendingSet() " + s.descendingSet());
System.out.println("pollFirst() " + s.pollFirst() + " -&gt; " + s);
System.out.println("ceiling(100) " + s.ceiling(100) + "   &lt;- null when there is no such element");</code></pre>
<div class="out">[2, 5, 9, 30]<br>
[2, 5, 30]<br>
2, 5, 30,<br>
set [2, 5, 9, 17, 30, 41]<br>
first() 2 &nbsp;last() 41<br>
floor(10) 9 &nbsp;ceiling(10) 17 &nbsp;&nbsp;&lt;- nearest &lt;= 10 and &gt;= 10<br>
lower(9) 5 &nbsp;higher(9) 17 &nbsp;&nbsp;&lt;- strictly &lt; 9 and &gt; 9<br>
headSet(17) [2, 5, 9] &nbsp;tailSet(17) [17, 30, 41] &nbsp;subSet(5, 30) [5, 9, 17]<br>
descendingSet() [41, 30, 17, 9, 5, 2]<br>
pollFirst() 2 -&gt; [5, 9, 17, 30, 41]<br>
ceiling(100) null &nbsp;&nbsp;&lt;- null when there is no such element</div>
<p>The first three lines match the screenshot exactly; the second <code>add(9)</code> changed nothing. The navigation methods answer "nearest" questions in <code>O(log n)</code> without a loop: <code>floor</code>/<code>ceiling</code> include the value itself, <code>lower</code>/<code>higher</code> do not; <code>headSet(17)</code> excludes 17, <code>tailSet(17)</code> includes it; a missing answer is <code>null</code>, so test before unboxing into an <code>int</code>.</p>
<p>And what if the elements are <strong>not</strong> Comparable? The blue box's warning, measured on JDK 8 — it fails on the very first <code>add</code>, before there is anything to compare with:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 16/21: a TreeSet of objects that are not Comparable — the exception JDK 8 really throws, already on the FIRST add
import java.util.*;

class Book {                         // forgot "implements Comparable"
    String title;
    Book(String title) { this.title = title; }
}

public class KhongComparable {
    public static void main(String[] args) {
        TreeSet&lt;Book&gt; shelf = new TreeSet&lt;Book&gt;();      // compiles: the type parameter of TreeSet is not restricted
        try {
            shelf.add(new Book("Core Java"));          // one element, nothing to compare with... still fails
        } catch (ClassCastException e) {
            System.out.println(e);
        }
        System.out.println("size after the failed add: " + shelf.size());
        TreeSet&lt;Book&gt; byTitle = new TreeSet&lt;Book&gt;(new Comparator&lt;Book&gt;() {   // the fix without touching Book: give the TreeSet a Comparator
            @Override
            public int compare(Book x, Book y) { return x.title.compareTo(y.title); }
        });
        byTitle.add(new Book("Core Java"));
        byTitle.add(new Book("Clean Code"));
        for (Book b : byTitle) System.out.println(b.title);
    }
}</code></pre>
<div class="out">java.lang.ClassCastException: Book cannot be cast to java.lang.Comparable<br>
size after the failed add: 0<br>
Clean Code<br>
Core Java</div>
<p>Since JDK 7, <code>TreeMap.put</code> compares the first key with itself precisely to fail early. The fix that does not touch the element class: give the TreeSet a <code>Comparator</code> (slide 22).</p>`,
        `<p class="y-chinh">🎯 <code>UseTreeSet</code>: <code>t.add(5); t.add(2); t.add(9); t.add(30); t.add(9);</code> in <code>[2, 5, 9, 30]</code>; <code>t.remove(9)</code> → <code>[2, 5, 30]</code>; một Iterator in <code>2, 5, 30,</code>. TreeSet lưu phần tử theo thứ tự tăng — thứ tự tự nhiên với số, thứ tự từ điển với chuỗi; với đối tượng của bạn thì phải hiện thực <code>compareTo</code> của <code>Comparable</code>.</p>
<p>Chương trình của slide, rồi ➕ các phương thức làm TreeSet hơn hẳn "một set có sắp xếp" — nó là một <code>NavigableSet</code>:</p>
<pre class="trich"><code class="language-java">TreeSet t= new TreeSet();
t.add(5); t.add(2); t.add(9);t.add(30); t.add(9);
System.out.println(t);
t.remove(9);
System.out.println(t);
Iterator it= t.iterator();
while (it.hasNext())
    System.out.print(it.next() + ", ");
System.out.println();</code></pre>
<pre class="trich"><code class="language-java">TreeSet&lt;Integer&gt; s = new TreeSet&lt;Integer&gt;();
for (int x : new int[] { 5, 2, 9, 30, 17, 41 }) s.add(x);
System.out.println("set " + s);
System.out.println("first() " + s.first() + "  last() " + s.last());
System.out.println("floor(10) " + s.floor(10) + "  ceiling(10) " + s.ceiling(10) + "   &lt;- nearest &lt;= 10 and &gt;= 10");
System.out.println("lower(9) " + s.lower(9) + "  higher(9) " + s.higher(9) + "   &lt;- strictly &lt; 9 and &gt; 9");
System.out.println("headSet(17) " + s.headSet(17) + "  tailSet(17) " + s.tailSet(17) + "  subSet(5, 30) " + s.subSet(5, 30));
System.out.println("descendingSet() " + s.descendingSet());
System.out.println("pollFirst() " + s.pollFirst() + " -&gt; " + s);
System.out.println("ceiling(100) " + s.ceiling(100) + "   &lt;- null when there is no such element");</code></pre>
<div class="out">[2, 5, 9, 30]<br>
[2, 5, 30]<br>
2, 5, 30,<br>
set [2, 5, 9, 17, 30, 41]<br>
first() 2 &nbsp;last() 41<br>
floor(10) 9 &nbsp;ceiling(10) 17 &nbsp;&nbsp;&lt;- nearest &lt;= 10 and &gt;= 10<br>
lower(9) 5 &nbsp;higher(9) 17 &nbsp;&nbsp;&lt;- strictly &lt; 9 and &gt; 9<br>
headSet(17) [2, 5, 9] &nbsp;tailSet(17) [17, 30, 41] &nbsp;subSet(5, 30) [5, 9, 17]<br>
descendingSet() [41, 30, 17, 9, 5, 2]<br>
pollFirst() 2 -&gt; [5, 9, 17, 30, 41]<br>
ceiling(100) null &nbsp;&nbsp;&lt;- null when there is no such element</div>
<p>Ba dòng đầu khớp ảnh chụp y hệt; lần <code>add(9)</code> thứ hai không đổi gì. Các phương thức điều hướng trả lời câu hỏi "gần nhất" trong <code>O(log n)</code> mà không cần vòng lặp: <code>floor</code>/<code>ceiling</code> tính cả chính giá trị đó, <code>lower</code>/<code>higher</code> thì không; <code>headSet(17)</code> không lấy 17, <code>tailSet(17)</code> có lấy; không có câu trả lời thì trả <code>null</code>, nên kiểm trước khi mở hộp vào một <code>int</code>.</p>
<p>Còn nếu phần tử <strong>không</strong> Comparable thì sao? Lời cảnh báo trong hộp xanh, đo trên JDK 8 — nó hỏng ngay lần <code>add</code> đầu tiên, khi chưa có gì để so:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 16/21: TreeSet chứa đối tượng không Comparable — ngoại lệ JDK 8 thật sự ném, ngay từ lần add ĐẦU TIÊN
import java.util.*;

class Book {                         // quên "implements Comparable"
    String title;
    Book(String title) { this.title = title; }
}

public class KhongComparable {
    public static void main(String[] args) {
        TreeSet&lt;Book&gt; shelf = new TreeSet&lt;Book&gt;();      // biên dịch được: tham số kiểu của TreeSet không bị ràng buộc
        try {
            shelf.add(new Book("Core Java"));          // một phần tử, chưa có gì để so... vẫn hỏng
        } catch (ClassCastException e) {
            System.out.println(e);
        }
        System.out.println("size after the failed add: " + shelf.size());
        TreeSet&lt;Book&gt; byTitle = new TreeSet&lt;Book&gt;(new Comparator&lt;Book&gt;() {   // sửa mà không đụng Book: đưa TreeSet một Comparator
            @Override
            public int compare(Book x, Book y) { return x.title.compareTo(y.title); }
        });
        byTitle.add(new Book("Core Java"));
        byTitle.add(new Book("Clean Code"));
        for (Book b : byTitle) System.out.println(b.title);
    }
}</code></pre>
<div class="out">java.lang.ClassCastException: Book cannot be cast to java.lang.Comparable<br>
size after the failed add: 0<br>
Clean Code<br>
Core Java</div>
<p>Từ JDK 7, <code>TreeMap.put</code> so khoá đầu tiên với chính nó đúng là để hỏng sớm. Cách sửa không đụng tới lớp phần tử: đưa TreeSet một <code>Comparator</code> (slide 22).</p>`],
      [17, 'Hash Table',
        `<p class="y-chinh">🎯 In an array, elements sit in contiguous memory and are found by linear search (slow) or binary search. In a <strong>hash table</strong> the position of an element is computed by a <strong>hash function</strong> — "Smith" → f → 5 — so add and search are very fast, O(1). The slide's example function: <code>'S'*10000+'m'*1000+'i'*100+'t'*10+'h' % 50</code>.</p>
<p>That example, computed exactly as printed, then with the parentheses it obviously intends — and then what Java really does with "Smith" in a new <code>HashMap</code> or <code>HashSet</code> (16 buckets):</p>
<pre class="trich"><code class="language-java">int asWritten = 'S'*10000+'m'*1000+'i'*100+'t'*10+'h' % 50;      // exactly as printed on the slide
int intended  = ('S'*10000+'m'*1000+'i'*100+'t'*10+'h') % 50;    // what the slide means
System.out.println("'h' % 50                 = " + ('h' % 50) + "   (% binds tighter than +)");
System.out.println("as written on the slide  = " + asWritten + "   &lt;- not an index 0..49 at all");
System.out.println("with parentheses, mod 50 = " + intended + "   &lt;- the slide's picture says 5: only an illustration");</code></pre>
<pre class="trich"><code class="language-java">String[] names = { "Smith", "Hoa", "Brown", "Linel" };
for (String s : names) {
    int h = s.hashCode();                       // s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
    int spread = h ^ (h &gt;&gt;&gt; 16);                // HashMap mixes the high bits into the low bits
    int bucket = spread &amp; (16 - 1);             // a new HashMap has 16 buckets: keep the last 4 bits
    System.out.printf("%-6s hashCode=%11d  bucket in a 16-slot table = %2d%n", s, h, bucket);
}
System.out.println("\\"Aa\\".hashCode()=" + "Aa".hashCode() + "  \\"BB\\".hashCode()=" + "BB".hashCode() + "   &lt;- a collision: same hash, different strings");</code></pre>
<div class="out">'h' % 50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 4 &nbsp;&nbsp;(% binds tighter than +)<br>
as written on the slide &nbsp;= 950664 &nbsp;&nbsp;&lt;- not an index 0..49 at all<br>
with parentheses, mod 50 = 14 &nbsp;&nbsp;&lt;- the slide's picture says 5: only an illustration<br>
Smith &nbsp;hashCode= &nbsp;&nbsp;80004067 &nbsp;bucket in a 16-slot table = &nbsp;7<br>
Hoa &nbsp;&nbsp;&nbsp;hashCode= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;72730 &nbsp;bucket in a 16-slot table = 11<br>
Brown &nbsp;hashCode= &nbsp;&nbsp;64459030 &nbsp;bucket in a 16-slot table = &nbsp;1<br>
Linel &nbsp;hashCode= &nbsp;&nbsp;73424600 &nbsp;bucket in a 16-slot table = &nbsp;8<br>
"Aa".hashCode()=2112 &nbsp;"BB".hashCode()=2112 &nbsp;&nbsp;&lt;- a collision: same hash, different strings</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f744adff8a9d712e5a162550b95567fecae97ca8.svg" alt="Slide 17 redrawn with the real numbers: String.hashCode(), HashMap's spread, the last 4 bits" loading="lazy" /><p class="chu-thich">🧩 Slide 17 redrawn with the real numbers: String.hashCode(), HashMap's spread, the last 4 bits</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 17 — where a new HashMap/HashSet (16 buckets) puts four strings
rectangle "key: Smith" as K1
rectangle "hashCode() = 80004067" as H1 #FEF9C3
rectangle "spread: h ^ (h &gt;&gt;&gt; 16)\\nindex: spread &amp; 15" as F #FEF9C3
package "table: 16 buckets" as T {
  rectangle "bucket 1\\nBrown" as B1 #ECFDF5
  rectangle "bucket 7\\nSmith" as B7 #ECFDF5
  rectangle "bucket 8\\nLinel" as B8 #ECFDF5
  rectangle "bucket 11\\nHoa" as B11 #ECFDF5
  rectangle "buckets 0, 2-6, 9, 10, 12-15\\nempty" as Be
}
K1 -down-&gt; H1
H1 -down-&gt; F
F -down-&gt; B7 : 7
B1 -right[hidden]- B7
B7 -right[hidden]- B8
B8 -right[hidden]- B11
B11 -right[hidden]- Be
note bottom of T
  Two keys in one bucket (a collision) are kept in a small list there;
  equals() tells them apart. Lookup = compute the bucket, then check
  only that bucket ⇒ O(1) on average.
end note
@enduml</code></pre></details>
<p>As printed, <code>%</code> binds tighter than <code>+</code>, so only <code>'h' % 50</code> is reduced and the result (950664) is not an index at all; with parentheses it is 14, not the 5 of the picture — the picture is an illustration. The real pipeline: <code>String.hashCode()</code> (a formula fixed by the Javadoc, so the same on every JVM), mixed by <code>h ^ (h &gt;&gt;&gt; 16)</code>, then the last bits pick the bucket. Different keys can share a bucket (<em>collision</em> — "Aa" and "BB" even share the whole hash code); the bucket keeps a small list and <code>equals</code> separates them.</p>
<p class="meo">🧠 O(1) is an <em>average</em>: compute the bucket, look only there. The table grows (doubles) when it is 75% full, which keeps buckets short.</p>`,
        `<p class="y-chinh">🎯 Trong mảng, phần tử nằm liền nhau trong bộ nhớ và được tìm bằng tìm tuyến tính (chậm) hoặc tìm nhị phân. Trong <strong>bảng băm</strong>, vị trí của phần tử được tính bằng một <strong>hàm băm</strong> (hash function) — "Smith" → f → 5 — nên thêm và tìm rất nhanh, O(1). Hàm ví dụ của slide: <code>'S'*10000+'m'*1000+'i'*100+'t'*10+'h' % 50</code>.</p>
<p>Ví dụ đó, tính đúng như in, rồi tính với cặp ngoặc rõ ràng slide muốn có — rồi tới việc Java thật sự làm với "Smith" trong một <code>HashMap</code> hay <code>HashSet</code> mới (16 ô):</p>
<pre class="trich"><code class="language-java">int asWritten = 'S'*10000+'m'*1000+'i'*100+'t'*10+'h' % 50;      // đúng như in trên slide
int intended  = ('S'*10000+'m'*1000+'i'*100+'t'*10+'h') % 50;    // điều slide muốn nói
System.out.println("'h' % 50                 = " + ('h' % 50) + "   (% binds tighter than +)");
System.out.println("as written on the slide  = " + asWritten + "   &lt;- not an index 0..49 at all");
System.out.println("with parentheses, mod 50 = " + intended + "   &lt;- the slide's picture says 5: only an illustration");</code></pre>
<pre class="trich"><code class="language-java">String[] names = { "Smith", "Hoa", "Brown", "Linel" };
for (String s : names) {
    int h = s.hashCode();                       // công thức trong Javadoc của String.hashCode
    int spread = h ^ (h &gt;&gt;&gt; 16);                // HashMap trộn bit cao xuống bit thấp
    int bucket = spread &amp; (16 - 1);             // HashMap mới có 16 ô: giữ 4 bit cuối
    System.out.printf("%-6s hashCode=%11d  bucket in a 16-slot table = %2d%n", s, h, bucket);
}
System.out.println("\\"Aa\\".hashCode()=" + "Aa".hashCode() + "  \\"BB\\".hashCode()=" + "BB".hashCode() + "   &lt;- a collision: same hash, different strings");</code></pre>
<div class="out">'h' % 50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 4 &nbsp;&nbsp;(% binds tighter than +)<br>
as written on the slide &nbsp;= 950664 &nbsp;&nbsp;&lt;- not an index 0..49 at all<br>
with parentheses, mod 50 = 14 &nbsp;&nbsp;&lt;- the slide's picture says 5: only an illustration<br>
Smith &nbsp;hashCode= &nbsp;&nbsp;80004067 &nbsp;bucket in a 16-slot table = &nbsp;7<br>
Hoa &nbsp;&nbsp;&nbsp;hashCode= &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;72730 &nbsp;bucket in a 16-slot table = 11<br>
Brown &nbsp;hashCode= &nbsp;&nbsp;64459030 &nbsp;bucket in a 16-slot table = &nbsp;1<br>
Linel &nbsp;hashCode= &nbsp;&nbsp;73424600 &nbsp;bucket in a 16-slot table = &nbsp;8<br>
"Aa".hashCode()=2112 &nbsp;"BB".hashCode()=2112 &nbsp;&nbsp;&lt;- a collision: same hash, different strings</div>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f744adff8a9d712e5a162550b95567fecae97ca8.svg" alt="Slide 17 vẽ lại với số thật: String.hashCode(), phép trộn của HashMap, 4 bit cuối" loading="lazy" /><p class="chu-thich">🧩 Slide 17 vẽ lại với số thật: String.hashCode(), phép trộn của HashMap, 4 bit cuối</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 17 — where a new HashMap/HashSet (16 buckets) puts four strings
rectangle "key: Smith" as K1
rectangle "hashCode() = 80004067" as H1 #FEF9C3
rectangle "spread: h ^ (h &gt;&gt;&gt; 16)\\nindex: spread &amp; 15" as F #FEF9C3
package "table: 16 buckets" as T {
  rectangle "bucket 1\\nBrown" as B1 #ECFDF5
  rectangle "bucket 7\\nSmith" as B7 #ECFDF5
  rectangle "bucket 8\\nLinel" as B8 #ECFDF5
  rectangle "bucket 11\\nHoa" as B11 #ECFDF5
  rectangle "buckets 0, 2-6, 9, 10, 12-15\\nempty" as Be
}
K1 -down-&gt; H1
H1 -down-&gt; F
F -down-&gt; B7 : 7
B1 -right[hidden]- B7
B7 -right[hidden]- B8
B8 -right[hidden]- B11
B11 -right[hidden]- Be
note bottom of T
  Two keys in one bucket (a collision) are kept in a small list there;
  equals() tells them apart. Lookup = compute the bucket, then check
  only that bucket ⇒ O(1) on average.
end note
@enduml</code></pre></details>
<p>Viết như trên slide thì <code>%</code> ưu tiên hơn <code>+</code>, nên chỉ <code>'h' % 50</code> bị rút gọn và kết quả (950664) chẳng phải chỉ số gì; có ngoặc thì ra 14, không phải 5 như hình — hình chỉ để minh hoạ. Đường đi thật: <code>String.hashCode()</code> (công thức cố định trong Javadoc, nên giống nhau trên mọi JVM), trộn bằng <code>h ^ (h &gt;&gt;&gt; 16)</code>, rồi vài bit cuối chọn ô. Các khoá khác nhau có thể chung một ô (<em>va chạm</em> — collision; "Aa" và "BB" còn trùng cả mã băm); ô đó giữ một danh sách nhỏ và <code>equals</code> tách chúng ra.</p>
<p class="meo">🧠 O(1) là <em>trung bình</em>: tính ra ô, chỉ nhìn vào ô đó. Bảng tự lớn gấp đôi khi đầy 75%, giữ cho các ô luôn ngắn.</p>`],
      [18, 'HashSet = Set + Hash Table',
        `<p class="y-chinh">🎯 The same ten random numbers, this time in a <code>HashSet</code>; "the result may be" 84, 55, 7, 76, 77, 95, 94, 12, 91, 44 — no visible order.</p>
<p>Same seed as slide 15, so the same draws — now into a HashSet. The program also prints, next to each number, the bucket it lands in:</p>
<pre><code class="language-java">// release: 8
// Slide 18: HashSet = Set + Hash Table — the same ten draws as slide 15 (same seed) put into a HashSet
import java.util.*;

public class HashSetNgauNhien {
    public static void main(String[] args) {
        Random r = new Random(16);
        HashSet myset = new HashSet();
        System.out.print("drawn: ");
        for (int i = 0; i &lt; 10; i++) {
            int number = r.nextInt(100);
            System.out.print(number + " ");
            myset.add(number);
        }
        System.out.println();
        //using Iterator
        Iterator iter = myset.iterator();
        while (iter.hasNext()) {
            Integer n = (Integer) iter.next();
            System.out.print(n + "(slot " + (n % 16) + ") ");
        }
        System.out.println();
        System.out.println("size() = " + myset.size());
    }
}</code></pre>
<div class="out">drawn: 51 32 75 50 53 42 13 70 50 15<br>
32(slot 0) 50(slot 2) 51(slot 3) 53(slot 5) 70(slot 6) 42(slot 10) 75(slot 11) 13(slot 13) 15(slot 15)<br>
size() = 9</div>
<p>The order is neither ascending nor insertion order, but it is not random either: an <code>Integer</code>'s hash code is its own value, a new table has 16 buckets, so each number goes to bucket <code>n % 16</code> and the iterator walks buckets 0, 1, 2… That is why 32 (bucket 0) comes first and 15 (bucket 15) last. Add more elements and the table doubles — the order changes again. The duplicate 50 is dropped here too: 9 elements.</p>
<div class="pitfall">"Unpredictable order" means: <strong>never write code or expected output that depends on a HashSet/HashMap's order</strong>. PE papers that print a set or map either sort it first or use a TreeSet/TreeMap — and so should you.</div>`,
        `<p class="y-chinh">🎯 Cũng mười số ngẫu nhiên, lần này trong một <code>HashSet</code>; "kết quả có thể là" 84, 55, 7, 76, 77, 95, 94, 12, 91, 44 — không thấy thứ tự gì.</p>
<p>Cùng hạt giống với slide 15, nên cùng các lần rút — giờ bỏ vào HashSet. Chương trình in thêm, cạnh mỗi số, cái ô (bucket) nó rơi vào:</p>
<pre><code class="language-java">// release: 8
// Slide 18: HashSet = Set + Hash Table — cùng mười lần rút như slide 15 (cùng hạt giống) bỏ vào HashSet
import java.util.*;

public class HashSetNgauNhien {
    public static void main(String[] args) {
        Random r = new Random(16);
        HashSet myset = new HashSet();
        System.out.print("drawn: ");
        for (int i = 0; i &lt; 10; i++) {
            int number = r.nextInt(100);
            System.out.print(number + " ");
            myset.add(number);
        }
        System.out.println();
        //using Iterator
        Iterator iter = myset.iterator();
        while (iter.hasNext()) {
            Integer n = (Integer) iter.next();
            System.out.print(n + "(slot " + (n % 16) + ") ");
        }
        System.out.println();
        System.out.println("size() = " + myset.size());
    }
}</code></pre>
<div class="out">drawn: 51 32 75 50 53 42 13 70 50 15<br>
32(slot 0) 50(slot 2) 51(slot 3) 53(slot 5) 70(slot 6) 42(slot 10) 75(slot 11) 13(slot 13) 15(slot 15)<br>
size() = 9</div>
<p>Thứ tự không tăng dần, cũng không theo thứ tự thêm, nhưng cũng không ngẫu nhiên: mã băm của một <code>Integer</code> chính là giá trị của nó, bảng mới có 16 ô, nên mỗi số vào ô <code>n % 16</code> và iterator đi lần lượt ô 0, 1, 2… Vì thế 32 (ô 0) ra đầu và 15 (ô 15) ra cuối. Thêm nhiều phần tử nữa thì bảng gấp đôi — thứ tự lại đổi. Số 50 trùng cũng bị bỏ ở đây: 9 phần tử.</p>
<div class="pitfall">"Thứ tự không đoán trước" nghĩa là: <strong>đừng bao giờ viết code hay output mong đợi phụ thuộc vào thứ tự của HashSet/HashMap</strong>. Đề PE nào in một set hay map thì hoặc sắp xếp trước, hoặc dùng TreeSet/TreeMap — bạn cũng nên làm vậy.</div>`],
      [19, 'HashSet or TreeSet?',
        `<p class="y-chinh">🎯 If you care about <strong>iteration order</strong>, use a TreeSet and pay the time penalty; if iteration order does not matter, use the higher-performance HashSet.</p>
<p>➕ There is a third choice the slide skips, <code>LinkedHashSet</code>: a HashSet that also remembers insertion order. The same seven words in all three (and a TreeSet that ignores case):</p>
<pre><code class="language-java">// release: 8
// Slide 19: HashSet or TreeSet? The same words in HashSet, LinkedHashSet and TreeSet — three different iteration orders
import java.util.*;

public class BaLoaiSet {
    public static void main(String[] args) {
        String[] words = { "pear", "Banana", "apple", "kiwi", "apple", "Cherry", "mango" };
        Set&lt;String&gt; hash = new HashSet&lt;String&gt;(Arrays.asList(words));
        Set&lt;String&gt; linked = new LinkedHashSet&lt;String&gt;(Arrays.asList(words));
        Set&lt;String&gt; tree = new TreeSet&lt;String&gt;(Arrays.asList(words));
        Set&lt;String&gt; treeIgnoreCase = new TreeSet&lt;String&gt;(String.CASE_INSENSITIVE_ORDER);
        treeIgnoreCase.addAll(Arrays.asList(words));
        System.out.println("HashSet       " + hash + "   &lt;- no promised order");
        System.out.println("LinkedHashSet " + linked + "   &lt;- insertion order");
        System.out.println("TreeSet       " + tree + "   &lt;- natural order: 'B' (66) &lt; 'a' (97)");
        System.out.println("TreeSet(CASE_INSENSITIVE_ORDER) " + treeIgnoreCase);
    }
}</code></pre>
<div class="out">HashSet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[apple, pear, kiwi, Cherry, Banana, mango] &nbsp;&nbsp;&lt;- no promised order<br>
LinkedHashSet [pear, Banana, apple, kiwi, Cherry, mango] &nbsp;&nbsp;&lt;- insertion order<br>
TreeSet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Banana, Cherry, apple, kiwi, mango, pear] &nbsp;&nbsp;&lt;- natural order: 'B' (66) &lt; 'a' (97)<br>
TreeSet(CASE_INSENSITIVE_ORDER) [apple, Banana, Cherry, kiwi, mango, pear]</div>
<p>All three dropped the second "apple". The TreeSet's "natural order" for strings is <code>compareTo</code> on character codes, so every capital letter comes before every small letter ("Banana", "Cherry", then "apple"); <code>String.CASE_INSENSITIVE_ORDER</code> is a ready-made <code>Comparator</code> that gives dictionary order.</p>
<table>
<thead><tr><th>You want to print…</th><th>Choose</th></tr></thead>
<tbody>
<tr><td>in any order, fastest</td><td><code>HashSet</code></td></tr>
<tr><td>in the order the user typed them</td><td><code>LinkedHashSet</code></td></tr>
<tr><td>sorted</td><td><code>TreeSet</code> (or a TreeSet with a Comparator)</td></tr>
</tbody>
</table>
<p class="meo">🧠 The same three-way choice exists for maps: <code>HashMap</code>, <code>LinkedHashMap</code>, <code>TreeMap</code>.</p>`,
        `<p class="y-chinh">🎯 Nếu bạn quan tâm <strong>thứ tự duyệt</strong>, dùng TreeSet và chịu chậm hơn; nếu thứ tự duyệt không quan trọng, dùng HashSet nhanh hơn.</p>
<p>➕ Có lựa chọn thứ ba slide bỏ qua, <code>LinkedHashSet</code>: một HashSet còn nhớ thứ tự thêm. Cùng bảy từ trong cả ba (và một TreeSet bỏ qua hoa/thường):</p>
<pre><code class="language-java">// release: 8
// Slide 19: HashSet hay TreeSet? Cùng các từ trong HashSet, LinkedHashSet và TreeSet — ba thứ tự duyệt khác nhau
import java.util.*;

public class BaLoaiSet {
    public static void main(String[] args) {
        String[] words = { "pear", "Banana", "apple", "kiwi", "apple", "Cherry", "mango" };
        Set&lt;String&gt; hash = new HashSet&lt;String&gt;(Arrays.asList(words));
        Set&lt;String&gt; linked = new LinkedHashSet&lt;String&gt;(Arrays.asList(words));
        Set&lt;String&gt; tree = new TreeSet&lt;String&gt;(Arrays.asList(words));
        Set&lt;String&gt; treeIgnoreCase = new TreeSet&lt;String&gt;(String.CASE_INSENSITIVE_ORDER);
        treeIgnoreCase.addAll(Arrays.asList(words));
        System.out.println("HashSet       " + hash + "   &lt;- no promised order");
        System.out.println("LinkedHashSet " + linked + "   &lt;- insertion order");
        System.out.println("TreeSet       " + tree + "   &lt;- natural order: 'B' (66) &lt; 'a' (97)");
        System.out.println("TreeSet(CASE_INSENSITIVE_ORDER) " + treeIgnoreCase);
    }
}</code></pre>
<div class="out">HashSet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[apple, pear, kiwi, Cherry, Banana, mango] &nbsp;&nbsp;&lt;- no promised order<br>
LinkedHashSet [pear, Banana, apple, kiwi, Cherry, mango] &nbsp;&nbsp;&lt;- insertion order<br>
TreeSet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Banana, Cherry, apple, kiwi, mango, pear] &nbsp;&nbsp;&lt;- natural order: 'B' (66) &lt; 'a' (97)<br>
TreeSet(CASE_INSENSITIVE_ORDER) [apple, Banana, Cherry, kiwi, mango, pear]</div>
<p>Cả ba đều bỏ "apple" thứ hai. "Thứ tự tự nhiên" của chuỗi trong TreeSet là <code>compareTo</code> theo mã ký tự, nên mọi chữ hoa đứng trước mọi chữ thường ("Banana", "Cherry", rồi mới "apple"); <code>String.CASE_INSENSITIVE_ORDER</code> là một <code>Comparator</code> làm sẵn cho thứ tự từ điển.</p>
<table>
<thead><tr><th>Bạn muốn in ra…</th><th>Chọn</th></tr></thead>
<tbody>
<tr><td>thứ tự nào cũng được, nhanh nhất</td><td><code>HashSet</code></td></tr>
<tr><td>theo thứ tự người dùng gõ vào</td><td><code>LinkedHashSet</code></td></tr>
<tr><td>có sắp xếp</td><td><code>TreeSet</code> (hoặc TreeSet kèm Comparator)</td></tr>
</tbody>
</table>
<p class="meo">🧠 Map cũng có đúng ba lựa chọn như vậy: <code>HashMap</code>, <code>LinkedHashMap</code>, <code>TreeMap</code>.</p>`],
      [20, 'How to TreeSet ordering elements?',
        `<p class="y-chinh">🎯 Tree sets rely on all their elements implementing <code>java.lang.Comparable</code>: <code>public int compareTo(Object x)</code> returns a positive number if the current object is "greater than" x, by whatever definition of "greater than" the class wants to use.</p>
<p>The full contract (the slide gives one third of it): <strong>negative</strong> if <code>this</code> comes before x, <strong>0</strong> if they are in the same place, <strong>positive</strong> if <code>this</code> comes after x. Only the <em>sign</em> matters — what the built-in classes actually return:</p>
<pre class="trich"><code class="language-java">System.out.println("\\"An\\".compareTo(\\"Binh\\")   = " + "An".compareTo("Binh") + "   ('A' - 'B')");
System.out.println("\\"Binh\\".compareTo(\\"An\\")   = " + "Binh".compareTo("An"));
System.out.println("\\"An\\".compareTo(\\"An\\")     = " + "An".compareTo("An"));
System.out.println("\\"An\\".compareTo(\\"Anh\\")    = " + "An".compareTo("Anh") + "   (a prefix is smaller: length difference)");
System.out.println("\\"apple\\".compareTo(\\"Banana\\") = " + "apple".compareTo("Banana") + "   (lower case comes AFTER upper case)");
System.out.println("Integer.valueOf(7).compareTo(3) = " + Integer.valueOf(7).compareTo(3) + ",  Integer.compare(3, 7) = " + Integer.compare(3, 7));
System.out.println("Double.compare(8.25, 8.5) = " + Double.compare(8.25, 8.5));</code></pre>
<pre class="trich"><code class="language-java">int a = -2_000_000_000, b = 2_000_000_000;      // a is clearly smaller than b
System.out.println("a - b = " + (a - b) + "   &lt;- POSITIVE: the subtraction overflowed, so 'a &gt; b'");
System.out.println("Integer.compare(a, b) = " + Integer.compare(a, b) + "   &lt;- correct");
double x = 8.25, y = 8.5;
System.out.println("(int) (x - y) = " + (int) (x - y) + "   &lt;- 0: two different marks treated as EQUAL");</code></pre>
<div class="out">"An".compareTo("Binh") &nbsp;&nbsp;= -1 &nbsp;&nbsp;('A' - 'B')<br>
"Binh".compareTo("An") &nbsp;&nbsp;= 1<br>
"An".compareTo("An") &nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
"An".compareTo("Anh") &nbsp;&nbsp;&nbsp;= -1 &nbsp;&nbsp;(a prefix is smaller: length difference)<br>
"apple".compareTo("Banana") = 31 &nbsp;&nbsp;(lower case comes AFTER upper case)<br>
Integer.valueOf(7).compareTo(3) = 1, &nbsp;Integer.compare(3, 7) = -1<br>
Double.compare(8.25, 8.5) = -1<br>
a - b = 294967296 &nbsp;&nbsp;&lt;- POSITIVE: the subtraction overflowed, so 'a &gt; b'<br>
Integer.compare(a, b) = -1 &nbsp;&nbsp;&lt;- correct<br>
(int) (x - y) = 0 &nbsp;&nbsp;&lt;- 0: two different marks treated as EQUAL</div>
<p><code>String.compareTo</code> returns the difference of the first differing characters (or of the lengths), so you will see values like 31 — never test <code>== 1</code>, test <code>&gt; 0</code>. The second block is a real bug that appears in many solutions: <code>return a - b;</code> overflows for large values of opposite signs and gives the wrong sign, and <code>(int) (x - y)</code> on doubles turns 8.25 vs 8.5 into "equal". Use <code>Integer.compare</code>/<code>Double.compare</code> (since Java 7 — fine on JDK 8).</p>
<div class="pitfall">The title is a slide-writer's English — "How does a TreeSet order its elements?". And the slide's <code>compareTo(Object x)</code> is the raw form; slide 21 shows the generic <code>Comparable&lt;Student&gt;</code> that avoids the cast.</div>`,
        `<p class="y-chinh">🎯 Tree set dựa vào việc mọi phần tử hiện thực <code>java.lang.Comparable</code>: <code>public int compareTo(Object x)</code> trả một số dương nếu đối tượng hiện tại "lớn hơn" x, theo bất cứ định nghĩa "lớn hơn" nào mà lớp muốn dùng.</p>
<p>Hợp đồng đầy đủ (slide chỉ nói một phần ba): <strong>âm</strong> nếu <code>this</code> đứng trước x, <strong>0</strong> nếu cùng chỗ, <strong>dương</strong> nếu <code>this</code> đứng sau x. Chỉ <em>dấu</em> là quan trọng — các lớp có sẵn thật sự trả gì:</p>
<pre class="trich"><code class="language-java">System.out.println("\\"An\\".compareTo(\\"Binh\\")   = " + "An".compareTo("Binh") + "   ('A' - 'B')");
System.out.println("\\"Binh\\".compareTo(\\"An\\")   = " + "Binh".compareTo("An"));
System.out.println("\\"An\\".compareTo(\\"An\\")     = " + "An".compareTo("An"));
System.out.println("\\"An\\".compareTo(\\"Anh\\")    = " + "An".compareTo("Anh") + "   (a prefix is smaller: length difference)");
System.out.println("\\"apple\\".compareTo(\\"Banana\\") = " + "apple".compareTo("Banana") + "   (lower case comes AFTER upper case)");
System.out.println("Integer.valueOf(7).compareTo(3) = " + Integer.valueOf(7).compareTo(3) + ",  Integer.compare(3, 7) = " + Integer.compare(3, 7));
System.out.println("Double.compare(8.25, 8.5) = " + Double.compare(8.25, 8.5));</code></pre>
<pre class="trich"><code class="language-java">int a = -2_000_000_000, b = 2_000_000_000;      // a rõ ràng nhỏ hơn b
System.out.println("a - b = " + (a - b) + "   &lt;- POSITIVE: the subtraction overflowed, so 'a &gt; b'");
System.out.println("Integer.compare(a, b) = " + Integer.compare(a, b) + "   &lt;- correct");
double x = 8.25, y = 8.5;
System.out.println("(int) (x - y) = " + (int) (x - y) + "   &lt;- 0: two different marks treated as EQUAL");</code></pre>
<div class="out">"An".compareTo("Binh") &nbsp;&nbsp;= -1 &nbsp;&nbsp;('A' - 'B')<br>
"Binh".compareTo("An") &nbsp;&nbsp;= 1<br>
"An".compareTo("An") &nbsp;&nbsp;&nbsp;&nbsp;= 0<br>
"An".compareTo("Anh") &nbsp;&nbsp;&nbsp;= -1 &nbsp;&nbsp;(a prefix is smaller: length difference)<br>
"apple".compareTo("Banana") = 31 &nbsp;&nbsp;(lower case comes AFTER upper case)<br>
Integer.valueOf(7).compareTo(3) = 1, &nbsp;Integer.compare(3, 7) = -1<br>
Double.compare(8.25, 8.5) = -1<br>
a - b = 294967296 &nbsp;&nbsp;&lt;- POSITIVE: the subtraction overflowed, so 'a &gt; b'<br>
Integer.compare(a, b) = -1 &nbsp;&nbsp;&lt;- correct<br>
(int) (x - y) = 0 &nbsp;&nbsp;&lt;- 0: two different marks treated as EQUAL</div>
<p><code>String.compareTo</code> trả hiệu của cặp ký tự khác nhau đầu tiên (hoặc hiệu độ dài), nên bạn sẽ thấy những giá trị như 31 — đừng bao giờ kiểm <code>== 1</code>, hãy kiểm <code>&gt; 0</code>. Khối thứ hai là một lỗi thật có trong rất nhiều lời giải: <code>return a - b;</code> bị tràn số với hai giá trị lớn trái dấu và cho sai dấu, còn <code>(int) (x - y)</code> với số thực biến 8.25 và 8.5 thành "bằng nhau". Hãy dùng <code>Integer.compare</code>/<code>Double.compare</code> (có từ Java 7 — dùng được trên JDK 8).</p>
<div class="pitfall">Tiêu đề là tiếng Anh của người soạn slide — đúng ra "How does a TreeSet order its elements?" (TreeSet sắp phần tử thế nào?). Và <code>compareTo(Object x)</code> của slide là dạng thô; slide 21 cho thấy dạng generic <code>Comparable&lt;Student&gt;</code> khỏi phải ép kiểu.</div>`],
      [21, 'How to TreeSet ordering elements?',
        `<p class="y-chinh">🎯 <code>class Student implements Comparable</code> with <code>compareTo(Object o)</code>: cast <code>o</code> to <code>Student</code>, return 1 if <code>no &gt; st.getNo()</code>, 0 if equal, -1 otherwise — "comparing 2 students based on their IDs (field <code>no</code>)".</p>
<p>The slide's class, completed with the constructor and getter it leaves out (<code>...</code>), next to the generic version you should write today:</p>
<pre class="trich"><code class="language-java">class Student implements Comparable{
    int no;
    String name;
    Student(int no, String name) { this.no = no; this.name = name; }
    int getNo() { return no; }
    public int compareTo(Object o) {
        Student st = (Student) o;
        if(no &gt; st.getNo())
            return 1;
        else if(no == st.getNo())
            return 0;
        else
            return -1;
    }
    public String toString() { return no + "-" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">class Student2 implements Comparable&lt;Student2&gt; {
    private final int no;
    private final String name;
    Student2(int no, String name) { this.no = no; this.name = name; }
    public int getNo() { return no; }
    @Override
    public int compareTo(Student2 other) {          // no Object, no cast
        return Integer.compare(no, other.no);
    }
    @Override
    public String toString() { return no + "-" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">Student a = new Student(19, "Lan"), b = new Student(8, "Minh");
System.out.println("a.compareTo(b) = " + a.compareTo(b) + ", b.compareTo(a) = " + b.compareTo(a) + ", a.compareTo(a) = " + a.compareTo(a));
TreeSet&lt;Student&gt; raw = new TreeSet&lt;Student&gt;(Arrays.asList(a, b, new Student(11, "Hoa")));
System.out.println("TreeSet&lt;Student&gt;  " + raw);
List&lt;Student2&gt; list = new ArrayList&lt;Student2&gt;(Arrays.asList(new Student2(19, "Lan"), new Student2(8, "Minh"), new Student2(11, "Hoa")));
Collections.sort(list);                     // Collections.sort uses the same compareTo
System.out.println("sorted Student2   " + list);
try {
    a.compareTo("not a student");           // the raw version compiles this, then fails at run time
} catch (ClassCastException e) {
    System.out.println("raw compareTo(\\"...\\") -&gt; ClassCastException");
}</code></pre>
<div class="out">a.compareTo(b) = 1, b.compareTo(a) = -1, a.compareTo(a) = 0<br>
TreeSet&lt;Student&gt; &nbsp;[8-Minh, 11-Hoa, 19-Lan]<br>
sorted Student2 &nbsp;&nbsp;[8-Minh, 11-Hoa, 19-Lan]<br>
raw compareTo("...") -&gt; ClassCastException</div>
<p>Both give the same order, and <code>Collections.sort</code> uses the same <code>compareTo</code> as the TreeSet. The difference is when mistakes are caught: the raw version happily compiles <code>a.compareTo("not a student")</code> and fails at run time with <code>ClassCastException</code>; with <code>Comparable&lt;Student2&gt;</code> that line would not compile. The if/else chain of the slide is correct but long — <code>Integer.compare(no, other.no)</code> is one line and cannot overflow.</p>
<div class="callout">🧭 <strong>Go further — Spring Boot / LabFlow AI</strong>: sorting entities is normally done by the database (<code>ORDER BY</code>, <code>Sort.by("name")</code>), but <code>Comparable</code>/<code>Comparator</code> is what you use for lists already in memory — and what interviewers ask about.</div>`,
        `<p class="y-chinh">🎯 <code>class Student implements Comparable</code> với <code>compareTo(Object o)</code>: ép <code>o</code> sang <code>Student</code>, trả 1 nếu <code>no &gt; st.getNo()</code>, 0 nếu bằng, -1 nếu còn lại — "so sánh 2 sinh viên dựa trên mã (trường <code>no</code>)".</p>
<p>Lớp của slide, bổ sung constructor và getter mà slide bỏ bằng <code>...</code>, đặt cạnh bản generic bạn nên viết ngày nay:</p>
<pre class="trich"><code class="language-java">class Student implements Comparable{
    int no;
    String name;
    Student(int no, String name) { this.no = no; this.name = name; }
    int getNo() { return no; }
    public int compareTo(Object o) {
        Student st = (Student) o;
        if(no &gt; st.getNo())
            return 1;
        else if(no == st.getNo())
            return 0;
        else
            return -1;
    }
    public String toString() { return no + "-" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">class Student2 implements Comparable&lt;Student2&gt; {
    private final int no;
    private final String name;
    Student2(int no, String name) { this.no = no; this.name = name; }
    public int getNo() { return no; }
    @Override
    public int compareTo(Student2 other) {          // không Object, không ép kiểu
        return Integer.compare(no, other.no);
    }
    @Override
    public String toString() { return no + "-" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">Student a = new Student(19, "Lan"), b = new Student(8, "Minh");
System.out.println("a.compareTo(b) = " + a.compareTo(b) + ", b.compareTo(a) = " + b.compareTo(a) + ", a.compareTo(a) = " + a.compareTo(a));
TreeSet&lt;Student&gt; raw = new TreeSet&lt;Student&gt;(Arrays.asList(a, b, new Student(11, "Hoa")));
System.out.println("TreeSet&lt;Student&gt;  " + raw);
List&lt;Student2&gt; list = new ArrayList&lt;Student2&gt;(Arrays.asList(new Student2(19, "Lan"), new Student2(8, "Minh"), new Student2(11, "Hoa")));
Collections.sort(list);                     // Collections.sort dùng chính compareTo đó
System.out.println("sorted Student2   " + list);
try {
    a.compareTo("not a student");           // bản thô biên dịch được câu này, rồi hỏng lúc chạy
} catch (ClassCastException e) {
    System.out.println("raw compareTo(\\"...\\") -&gt; ClassCastException");
}</code></pre>
<div class="out">a.compareTo(b) = 1, b.compareTo(a) = -1, a.compareTo(a) = 0<br>
TreeSet&lt;Student&gt; &nbsp;[8-Minh, 11-Hoa, 19-Lan]<br>
sorted Student2 &nbsp;&nbsp;[8-Minh, 11-Hoa, 19-Lan]<br>
raw compareTo("...") -&gt; ClassCastException</div>
<p>Cả hai cho cùng thứ tự, và <code>Collections.sort</code> dùng đúng <code>compareTo</code> mà TreeSet dùng. Khác nhau ở chỗ lỗi bị bắt lúc nào: bản thô vui vẻ biên dịch <code>a.compareTo("not a student")</code> rồi hỏng lúc chạy với <code>ClassCastException</code>; với <code>Comparable&lt;Student2&gt;</code> dòng đó sẽ không biên dịch được. Chuỗi if/else của slide đúng nhưng dài — <code>Integer.compare(no, other.no)</code> chỉ một dòng và không thể tràn số.</p>
<div class="callout">🧭 <strong>Đi tiếp — Spring Boot / LabFlow AI</strong>: sắp xếp entity thường để cơ sở dữ liệu làm (<code>ORDER BY</code>, <code>Sort.by("name")</code>), nhưng <code>Comparable</code>/<code>Comparator</code> là thứ bạn dùng cho các list đã nằm trong bộ nhớ — và là thứ người phỏng vấn hay hỏi.</div>`],
      [22, 'How to TreeSet ordering elements?',
        `<p class="y-chinh">🎯 <code>main</code> creates ten <code>Student</code>s with random numbers <code>no</code> (all named "abc"), adds them to a <code>TreeSet</code> and prints them with an Iterator: "No: 2, No: 8, … No: 96" — sorted by <code>no</code>.</p>
<p>The slide's <code>main</code>, with a fixed seed so you can check it, then ➕ the rule behind what happens:</p>
<pre class="trich"><code class="language-java">Random r =  new Random(16);                 // fixed seed instead of new Random()
TreeSet myset = new TreeSet();
for (int i = 0; i &lt; 10; i++) {
    int no = r.nextInt(100);
    Student st = new Student(no, "abc");
    myset.add(st);
}
//using Iterator
Iterator iter = myset.iterator();
while (iter.hasNext()) {
    Student st = (Student)iter.next();
    System.out.println("No: " + st.getNo());
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("10 students created, TreeSet size() = " + myset.size());
TreeSet&lt;Student&gt; klass = new TreeSet&lt;Student&gt;();
System.out.println("add 7-Lan  -&gt; " + klass.add(new Student(7, "Lan")));
System.out.println("add 7-Minh -&gt; " + klass.add(new Student(7, "Minh")) + "   &lt;- compareTo said 0: Minh is LOST");
TreeSet&lt;Student&gt; byName = new TreeSet&lt;Student&gt;(new Comparator&lt;Student&gt;() {   // ➕ another order, without touching Student
    @Override
    public int compare(Student a, Student b) {
        int c = a.getName().compareTo(b.getName());
        return c != 0 ? c : Integer.compare(a.getNo(), b.getNo());    // tie-break so different students never compare 0
    }
});
byName.add(new Student(7, "Minh")); byName.add(new Student(7, "Lan")); byName.add(new Student(3, "Lan"));
for (Student s : byName) System.out.print(s.getName() + "#" + s.getNo() + " ");
System.out.println();</code></pre>
<div class="out">No: 13<br>
No: 15<br>
No: 32<br>
No: 42<br>
No: 50<br>
No: 51<br>
No: 53<br>
No: 70<br>
No: 75<br>
10 students created, TreeSet size() = 9<br>
add 7-Lan &nbsp;-&gt; true<br>
add 7-Minh -&gt; false &nbsp;&nbsp;&lt;- compareTo said 0: Minh is LOST<br>
Lan#3 Lan#7 Minh#7</div>
<p>Ten students were created; the TreeSet holds <strong>nine</strong>. A TreeSet does not use <code>equals</code> at all: two elements are "the same" when <code>compareTo</code> returns 0. Two students with <code>no</code> 50 compare as 0, so the second is rejected — and with different names (7-Lan, 7-Minh) the second student is simply lost. This is why a <code>compareTo</code> used by a TreeSet should be <strong>consistent with equals</strong>, and why a <code>Comparator</code> needs a tie-breaker. The ➕ part sorts by name with an anonymous <code>Comparator</code> passed to the TreeSet's constructor, breaking ties by <code>no</code>, so no student disappears.</p>
<div class="pitfall">In a LAB211 "list sorted by name" feature, <code>new TreeSet&lt;Student&gt;(byNameComparator)</code> without a tie-breaker drops every student whose name already exists. Sorting a <code>List</code> with <code>Collections.sort(list, cmp)</code> never drops anything — prefer it when you just need sorted output.</div>`,
        `<p class="y-chinh">🎯 <code>main</code> tạo mười <code>Student</code> với số <code>no</code> ngẫu nhiên (cùng tên "abc"), thêm vào một <code>TreeSet</code> và in bằng Iterator: "No: 2, No: 8, … No: 96" — sắp theo <code>no</code>.</p>
<p><code>main</code> của slide, với hạt giống cố định để bạn kiểm được, rồi ➕ luật đứng sau điều xảy ra:</p>
<pre class="trich"><code class="language-java">Random r =  new Random(16);                 // hạt giống cố định thay cho new Random()
TreeSet myset = new TreeSet();
for (int i = 0; i &lt; 10; i++) {
    int no = r.nextInt(100);
    Student st = new Student(no, "abc");
    myset.add(st);
}
//using Iterator
Iterator iter = myset.iterator();
while (iter.hasNext()) {
    Student st = (Student)iter.next();
    System.out.println("No: " + st.getNo());
}</code></pre>
<pre class="trich"><code class="language-java">System.out.println("10 students created, TreeSet size() = " + myset.size());
TreeSet&lt;Student&gt; klass = new TreeSet&lt;Student&gt;();
System.out.println("add 7-Lan  -&gt; " + klass.add(new Student(7, "Lan")));
System.out.println("add 7-Minh -&gt; " + klass.add(new Student(7, "Minh")) + "   &lt;- compareTo said 0: Minh is LOST");
TreeSet&lt;Student&gt; byName = new TreeSet&lt;Student&gt;(new Comparator&lt;Student&gt;() {   // ➕ thứ tự khác, không sửa Student
    @Override
    public int compare(Student a, Student b) {
        int c = a.getName().compareTo(b.getName());
        return c != 0 ? c : Integer.compare(a.getNo(), b.getNo());    // phân xử hoà để hai sinh viên khác nhau không bao giờ so ra 0
    }
});
byName.add(new Student(7, "Minh")); byName.add(new Student(7, "Lan")); byName.add(new Student(3, "Lan"));
for (Student s : byName) System.out.print(s.getName() + "#" + s.getNo() + " ");
System.out.println();</code></pre>
<div class="out">No: 13<br>
No: 15<br>
No: 32<br>
No: 42<br>
No: 50<br>
No: 51<br>
No: 53<br>
No: 70<br>
No: 75<br>
10 students created, TreeSet size() = 9<br>
add 7-Lan &nbsp;-&gt; true<br>
add 7-Minh -&gt; false &nbsp;&nbsp;&lt;- compareTo said 0: Minh is LOST<br>
Lan#3 Lan#7 Minh#7</div>
<p>Tạo mười sinh viên; TreeSet giữ <strong>chín</strong>. TreeSet không dùng <code>equals</code> chút nào: hai phần tử là "một" khi <code>compareTo</code> trả 0. Hai sinh viên cùng <code>no</code> 50 so ra 0, nên người thứ hai bị từ chối — và với tên khác nhau (7-Lan, 7-Minh) thì sinh viên thứ hai mất luôn. Vì thế <code>compareTo</code> mà TreeSet dùng nên <strong>nhất quán với equals</strong>, và một <code>Comparator</code> cần tiêu chí phân xử hoà. Phần ➕ sắp theo tên bằng một <code>Comparator</code> ẩn danh truyền vào constructor của TreeSet, hoà thì xét <code>no</code>, nên không sinh viên nào biến mất.</p>
<div class="pitfall">Trong chức năng "danh sách sắp theo tên" của LAB211, <code>new TreeSet&lt;Student&gt;(byNameComparator)</code> không có tiêu chí phân xử hoà sẽ làm rơi mọi sinh viên trùng tên với người đã có. Sắp một <code>List</code> bằng <code>Collections.sort(list, cmp)</code> thì không bao giờ làm rơi gì — hãy ưu tiên nó khi bạn chỉ cần in ra có thứ tự.</div>`],
      [23, 'Maps',
        `<p class="y-chinh">🎯 A <code>Map</code> does not implement <code>Collection</code>. It combines two collections, <strong>keys</strong> and <strong>values</strong>, and associates <strong>exactly one value with each key</strong> — like a dictionary. Key uniqueness is checked with <code>equals()</code>, not <code>==</code>. IDs, item codes, roll numbers are keys; "the normal data type for keys is String". Each element: &lt;key, value&gt;.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7c73170221b443a1c59baad696dd37f49c41e9a2.svg" alt="Slide 23 redrawn: unique keys on the left, values (which may repeat) on the right" loading="lazy" /><p class="chu-thich">🧩 Slide 23 redrawn: unique keys on the left, values (which may repeat) on the right</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Slide 23 — a Map: a set of unique keys, each associated with exactly one value
left to right direction
package "keys (a Set: unique by equals)" {
  rectangle "SE01" as K1 #FEF9C3
  rectangle "SE02" as K2 #FEF9C3
  rectangle "SE03" as K3 #FEF9C3
}
package "values (may repeat)" {
  rectangle "0999" as V1 #ECFDF5
  rectangle "0902" as V2 #ECFDF5
}
K1 --&gt; V1
K2 --&gt; V2
K3 --&gt; V2
note bottom of V2 : two keys may share a value;\\none key never has two values:\\nput(sameKey, v) REPLACES
@enduml</code></pre></details>
<p>Every sentence of the slide, as a program — including what <code>put</code> returns, which the slide does not say:</p>
<pre class="trich"><code class="language-java">Map&lt;String, String&gt; phone = new HashMap&lt;String, String&gt;();
System.out.println("put(SE01, 0901) returned " + phone.put("SE01", "0901"));   // null: there was no old value
phone.put("SE02", "0902");
System.out.println("put(SE01, 0999) returned " + phone.put("SE01", "0999") + "   &lt;- same key: the OLD value is replaced and returned");
String key = new String("SE02");                                             // a different String object, equal content
System.out.println("get(new String(\\"SE02\\")) = " + phone.get(key) + "   &lt;- keys are compared with equals(), not ==");
System.out.println("get(\\"SE77\\") = " + phone.get("SE77") + ",  getOrDefault(\\"SE77\\", \\"none\\") = " + phone.getOrDefault("SE77", "none"));
System.out.println("containsKey(SE01) " + phone.containsKey("SE01") + ", containsValue(0902) " + phone.containsValue("0902") + ", size() " + phone.size());
System.out.println("remove(SE02) returned " + phone.remove("SE02") + " -&gt; " + phone);
System.out.println("phone instanceof Collection: " + (phone instanceof Collection));</code></pre>
<pre class="trich"><code class="language-java">Map&lt;String, Double&gt; gpa = new TreeMap&lt;String, Double&gt;();
gpa.put("Lan", 8.1); gpa.put("Hoa", 7.4); gpa.put("Minh", 9.0);
for (String k : gpa.keySet()) System.out.print(k + " ");                       // keys
System.out.println("&lt;- keySet()");
for (double v : gpa.values()) System.out.print(v + " ");                       // values
System.out.println("&lt;- values()");
for (Map.Entry&lt;String, Double&gt; e : gpa.entrySet())                             // key AND value in one pass
    System.out.print(e.getKey() + "=" + e.getValue() + " ");
System.out.println("&lt;- entrySet()");</code></pre>
<div class="out">put(SE01, 0901) returned null<br>
put(SE01, 0999) returned 0901 &nbsp;&nbsp;&lt;- same key: the OLD value is replaced and returned<br>
get(new String("SE02")) = 0902 &nbsp;&nbsp;&lt;- keys are compared with equals(), not ==<br>
get("SE77") = null, &nbsp;getOrDefault("SE77", "none") = none<br>
containsKey(SE01) true, containsValue(0902) true, size() 2<br>
remove(SE02) returned 0902 -&gt; {SE01=0999}<br>
phone instanceof Collection: false<br>
Hoa Lan Minh &lt;- keySet()<br>
7.4 8.1 9.0 &lt;- values()<br>
Hoa=7.4 Lan=8.1 Minh=9.0 &lt;- entrySet()</div>
<p><code>put</code> on an existing key <strong>replaces</strong> the value and returns the old one (<code>null</code> if there was none) — that is "exactly one value per key". <code>get</code> with an equal but different <code>String</code> object finds the entry, proving <code>equals</code> is used. <code>get</code> of a missing key returns <code>null</code>; <code>getOrDefault</code> (Java 8) avoids the null check. To visit a map you choose a view: <code>keySet()</code>, <code>values()</code> or <code>entrySet()</code> — the last gives key and value together.</p>
<p class="meo">🧠 "Keys are normally String" is a habit, not a rule: <code>Integer</code>, an enum, or your own class work too — your own class only with correct <code>equals</code> + <code>hashCode</code> (HashMap) or <code>compareTo</code> (TreeMap), exactly as for sets: a <code>HashSet</code> is in fact a <code>HashMap</code> that uses only the keys.</p>`,
        `<p class="y-chinh">🎯 <code>Map</code> không hiện thực <code>Collection</code>. Nó ghép hai tập, <strong>khoá</strong> (key) và <strong>giá trị</strong> (value), và gắn <strong>đúng một giá trị với mỗi khoá</strong> — như một cuốn từ điển. Tính duy nhất của khoá được kiểm bằng <code>equals()</code>, không phải <code>==</code>. Mã số, mã hàng, số báo danh là khoá; "kiểu dữ liệu thường dùng cho khoá là String". Mỗi phần tử: &lt;khoá, giá trị&gt;.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/7c73170221b443a1c59baad696dd37f49c41e9a2.svg" alt="Slide 23 vẽ lại: khoá duy nhất bên trái, giá trị (có thể lặp) bên phải" loading="lazy" /><p class="chu-thich">🧩 Slide 23 vẽ lại: khoá duy nhất bên trái, giá trị (có thể lặp) bên phải</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Slide 23 — a Map: a set of unique keys, each associated with exactly one value
left to right direction
package "keys (a Set: unique by equals)" {
  rectangle "SE01" as K1 #FEF9C3
  rectangle "SE02" as K2 #FEF9C3
  rectangle "SE03" as K3 #FEF9C3
}
package "values (may repeat)" {
  rectangle "0999" as V1 #ECFDF5
  rectangle "0902" as V2 #ECFDF5
}
K1 --&gt; V1
K2 --&gt; V2
K3 --&gt; V2
note bottom of V2 : two keys may share a value;\\none key never has two values:\\nput(sameKey, v) REPLACES
@enduml</code></pre></details>
<p>Từng câu của slide, thành chương trình — kể cả việc <code>put</code> trả về gì, điều slide không nói:</p>
<pre class="trich"><code class="language-java">Map&lt;String, String&gt; phone = new HashMap&lt;String, String&gt;();
System.out.println("put(SE01, 0901) returned " + phone.put("SE01", "0901"));   // null: chưa có giá trị cũ
phone.put("SE02", "0902");
System.out.println("put(SE01, 0999) returned " + phone.put("SE01", "0999") + "   &lt;- same key: the OLD value is replaced and returned");
String key = new String("SE02");                                             // đối tượng String khác, nội dung bằng
System.out.println("get(new String(\\"SE02\\")) = " + phone.get(key) + "   &lt;- keys are compared with equals(), not ==");
System.out.println("get(\\"SE77\\") = " + phone.get("SE77") + ",  getOrDefault(\\"SE77\\", \\"none\\") = " + phone.getOrDefault("SE77", "none"));
System.out.println("containsKey(SE01) " + phone.containsKey("SE01") + ", containsValue(0902) " + phone.containsValue("0902") + ", size() " + phone.size());
System.out.println("remove(SE02) returned " + phone.remove("SE02") + " -&gt; " + phone);
System.out.println("phone instanceof Collection: " + (phone instanceof Collection));</code></pre>
<pre class="trich"><code class="language-java">Map&lt;String, Double&gt; gpa = new TreeMap&lt;String, Double&gt;();
gpa.put("Lan", 8.1); gpa.put("Hoa", 7.4); gpa.put("Minh", 9.0);
for (String k : gpa.keySet()) System.out.print(k + " ");                       // các khoá
System.out.println("&lt;- keySet()");
for (double v : gpa.values()) System.out.print(v + " ");                       // các giá trị
System.out.println("&lt;- values()");
for (Map.Entry&lt;String, Double&gt; e : gpa.entrySet())                             // khoá VÀ giá trị trong một lượt
    System.out.print(e.getKey() + "=" + e.getValue() + " ");
System.out.println("&lt;- entrySet()");</code></pre>
<div class="out">put(SE01, 0901) returned null<br>
put(SE01, 0999) returned 0901 &nbsp;&nbsp;&lt;- same key: the OLD value is replaced and returned<br>
get(new String("SE02")) = 0902 &nbsp;&nbsp;&lt;- keys are compared with equals(), not ==<br>
get("SE77") = null, &nbsp;getOrDefault("SE77", "none") = none<br>
containsKey(SE01) true, containsValue(0902) true, size() 2<br>
remove(SE02) returned 0902 -&gt; {SE01=0999}<br>
phone instanceof Collection: false<br>
Hoa Lan Minh &lt;- keySet()<br>
7.4 8.1 9.0 &lt;- values()<br>
Hoa=7.4 Lan=8.1 Minh=9.0 &lt;- entrySet()</div>
<p><code>put</code> vào một khoá đã có thì <strong>thay</strong> giá trị và trả giá trị cũ (<code>null</code> nếu chưa có) — đó là "đúng một giá trị cho mỗi khoá". <code>get</code> với một đối tượng <code>String</code> khác nhưng bằng nội dung vẫn tìm thấy, chứng tỏ <code>equals</code> được dùng. <code>get</code> một khoá không có trả <code>null</code>; <code>getOrDefault</code> (Java 8) khỏi phải kiểm null. Muốn duyệt map bạn chọn một khung nhìn: <code>keySet()</code>, <code>values()</code> hoặc <code>entrySet()</code> — cái cuối cho cả khoá lẫn giá trị một lượt.</p>
<p class="meo">🧠 "Khoá thường là String" là thói quen, không phải luật: <code>Integer</code>, một enum, hay lớp của chính bạn đều được — lớp của bạn thì chỉ khi có <code>equals</code> + <code>hashCode</code> đúng (HashMap) hoặc <code>compareTo</code> (TreeMap), y như với set: thực ra <code>HashSet</code> chính là một <code>HashMap</code> chỉ dùng phần khoá.</p>`],
      [24, 'Maps..',
        `<p class="y-chinh">🎯 Java's two most important Map classes: <strong>HashMap</strong> — keys in unpredictable order, a hash table with the library's hash function; <strong>TreeMap</strong> — keys in natural order, so all keys must implement <code>Comparable</code> (a tree stores the elements).</p>
<p>The same six subject codes in both, and the places where the two behave differently — run on JDK 8 for its exact messages:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 24: HashMap (hash table, no promised order) vs TreeMap (tree, keys in natural order) — and where they behave differently
import java.util.*;

public class HashMapVaTreeMap {
    public static void main(String[] args) {
        String[] codes = { "PRO192", "MAE101", "CSD201", "SWE201", "DBI202", "JPD113" };
        Map&lt;String, Integer&gt; hash = new HashMap&lt;String, Integer&gt;();
        Map&lt;String, Integer&gt; tree = new TreeMap&lt;String, Integer&gt;();
        for (int i = 0; i &lt; codes.length; i++) { hash.put(codes[i], i + 1); tree.put(codes[i], i + 1); }
        System.out.println("HashMap " + hash);
        System.out.println("TreeMap " + tree);
        hash.put(null, 0);                                      // HashMap accepts ONE null key
        System.out.println("HashMap.put(null, 0) ok, get(null) = " + hash.get(null));
        try {
            tree.put(null, 0);                                  // TreeMap must compare keys: null cannot
        } catch (NullPointerException e) {
            System.out.println("TreeMap.put(null, 0) -&gt; " + e);
        }
        TreeMap&lt;String, Integer&gt; t = (TreeMap&lt;String, Integer&gt;) tree;
        System.out.println("firstKey() " + t.firstKey() + ", lastKey() " + t.lastKey() + ", headMap(\\"MAE\\") " + t.headMap("MAE"));
        try {
            Map&lt;Object, String&gt; bad = new TreeMap&lt;Object, String&gt;();
            bad.put(new Object(), "x");                         // key not Comparable
        } catch (ClassCastException e) {
            System.out.println("TreeMap with an Object key -&gt; " + e);
        }
    }
}</code></pre>
<div class="out">HashMap {DBI202=5, PRO192=1, MAE101=2, JPD113=6, CSD201=3, SWE201=4}<br>
TreeMap {CSD201=3, DBI202=5, JPD113=6, MAE101=2, PRO192=1, SWE201=4}<br>
HashMap.put(null, 0) ok, get(null) = 0<br>
TreeMap.put(null, 0) -&gt; java.lang.NullPointerException<br>
firstKey() CSD201, lastKey() SWE201, headMap("MAE") {CSD201=3, DBI202=5, JPD113=6}<br>
TreeMap with an Object key -&gt; java.lang.ClassCastException: java.lang.Object cannot be cast to java.lang.Comparable</div>
<p>The HashMap order follows the buckets of the codes' hash codes; the TreeMap order is alphabetical. A HashMap accepts one <code>null</code> key; a TreeMap must compare keys, so <code>put(null, …)</code> throws <code>NullPointerException</code>, and a key that is not <code>Comparable</code> throws <code>ClassCastException</code> — the same rules as slide 16 for TreeSet. Like TreeSet, a TreeMap is navigable: <code>firstKey()</code>, <code>lastKey()</code>, <code>headMap(...)</code>, <code>floorKey(...)</code>.</p>
<div class="pitfall">Old FE questions mention <code>Hashtable</code>: it is the JDK 1.0 class, synchronized, and it rejects <code>null</code> keys <em>and</em> values. <code>HashMap</code> is the unsynchronized replacement that allows them.</div>`,
        `<p class="y-chinh">🎯 Hai lớp Map quan trọng nhất của Java: <strong>HashMap</strong> — khoá theo thứ tự không đoán trước, một bảng băm với hàm băm của thư viện; <strong>TreeMap</strong> — khoá theo thứ tự tự nhiên, nên mọi khoá phải hiện thực <code>Comparable</code> (một cái cây lưu các phần tử).</p>
<p>Cùng sáu mã môn trong cả hai, và những chỗ hai lớp cư xử khác nhau — chạy trên JDK 8 để có đúng thông báo của nó:</p>
<pre><code class="language-java">// chay: jdk8
// Slide 24: HashMap (bảng băm, không hứa thứ tự) và TreeMap (cây, khoá theo thứ tự tự nhiên) — và chỗ chúng cư xử khác nhau
import java.util.*;

public class HashMapVaTreeMap {
    public static void main(String[] args) {
        String[] codes = { "PRO192", "MAE101", "CSD201", "SWE201", "DBI202", "JPD113" };
        Map&lt;String, Integer&gt; hash = new HashMap&lt;String, Integer&gt;();
        Map&lt;String, Integer&gt; tree = new TreeMap&lt;String, Integer&gt;();
        for (int i = 0; i &lt; codes.length; i++) { hash.put(codes[i], i + 1); tree.put(codes[i], i + 1); }
        System.out.println("HashMap " + hash);
        System.out.println("TreeMap " + tree);
        hash.put(null, 0);                                      // HashMap nhận MỘT khoá null
        System.out.println("HashMap.put(null, 0) ok, get(null) = " + hash.get(null));
        try {
            tree.put(null, 0);                                  // TreeMap phải so khoá: null không so được
        } catch (NullPointerException e) {
            System.out.println("TreeMap.put(null, 0) -&gt; " + e);
        }
        TreeMap&lt;String, Integer&gt; t = (TreeMap&lt;String, Integer&gt;) tree;
        System.out.println("firstKey() " + t.firstKey() + ", lastKey() " + t.lastKey() + ", headMap(\\"MAE\\") " + t.headMap("MAE"));
        try {
            Map&lt;Object, String&gt; bad = new TreeMap&lt;Object, String&gt;();
            bad.put(new Object(), "x");                         // khoá không Comparable
        } catch (ClassCastException e) {
            System.out.println("TreeMap with an Object key -&gt; " + e);
        }
    }
}</code></pre>
<div class="out">HashMap {DBI202=5, PRO192=1, MAE101=2, JPD113=6, CSD201=3, SWE201=4}<br>
TreeMap {CSD201=3, DBI202=5, JPD113=6, MAE101=2, PRO192=1, SWE201=4}<br>
HashMap.put(null, 0) ok, get(null) = 0<br>
TreeMap.put(null, 0) -&gt; java.lang.NullPointerException<br>
firstKey() CSD201, lastKey() SWE201, headMap("MAE") {CSD201=3, DBI202=5, JPD113=6}<br>
TreeMap with an Object key -&gt; java.lang.ClassCastException: java.lang.Object cannot be cast to java.lang.Comparable</div>
<p>Thứ tự của HashMap theo các ô của mã băm; thứ tự của TreeMap theo chữ cái. HashMap nhận một khoá <code>null</code>; TreeMap phải so khoá, nên <code>put(null, …)</code> ném <code>NullPointerException</code>, còn khoá không <code>Comparable</code> thì ném <code>ClassCastException</code> — cùng luật với TreeSet ở slide 16. Giống TreeSet, TreeMap điều hướng được: <code>firstKey()</code>, <code>lastKey()</code>, <code>headMap(...)</code>, <code>floorKey(...)</code>.</p>
<div class="pitfall">Câu FE cũ có nhắc <code>Hashtable</code>: đó là lớp của JDK 1.0, có đồng bộ hoá, và từ chối <code>null</code> ở cả khoá <em>lẫn</em> giá trị. <code>HashMap</code> là bản thay thế không đồng bộ hoá và cho phép null.</div>`],
      [25, 'HashMap',
        `<p class="y-chinh">🎯 A raw <code>HashMap</code> with Integer keys 1–4 and String values "One"–"Four"; a <code>keySet().iterator()</code> loop prints <code>key + ": " + mymap.get(key)</code> — output 1: One, 2: Two, 3: Three, 4: Four. "Key: integer, value: String".</p>
<p>The slide's code compiles as printed only after replacing its curly quotes (“One") with straight ones. Then ➕ the two things you will write in exams — the <code>entrySet</code> loop and the "count each word" map:</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    HashMap mymap = new HashMap();
    mymap.put(1, "One");
    mymap.put(2, "Two");
    mymap.put(3, "Three");
    mymap.put(4, "Four");
    //using Iterator
    Iterator iter = mymap.keySet().iterator();
    while (iter.hasNext()) {
        Object key = iter.next();
        System.out.println(key + ": " + mymap.get(key));
    }
    them();
}</code></pre>
<pre class="trich"><code class="language-java">static void them() {
    Map&lt;Integer, String&gt; m = new HashMap&lt;Integer, String&gt;();
    m.put(40, "Forty"); m.put(3, "Three"); m.put(17, "Seventeen");
    for (Map.Entry&lt;Integer, String&gt; e : m.entrySet())       // no second lookup with get(key)
        System.out.println(e.getKey() + " -&gt; " + e.getValue());

    String text = "to be or not to be that is the question to ask";
    Map&lt;String, Integer&gt; count = new HashMap&lt;String, Integer&gt;();
    for (String w : text.split("\\\\s+")) {
        Integer c = count.get(w);
        count.put(w, c == null ? 1 : c + 1);               // JDK 8 also: count.merge(w, 1, Integer::sum)
    }
    System.out.println("word counts, sorted by word: " + new TreeMap&lt;String, Integer&gt;(count));
}</code></pre>
<div class="out">1: One<br>
2: Two<br>
3: Three<br>
4: Four<br>
17 -&gt; Seventeen<br>
3 -&gt; Three<br>
40 -&gt; Forty<br>
word counts, sorted by word: {ask=1, be=2, is=1, not=1, or=1, question=1, that=1, the=1, to=3}</div>
<p>Why the slide's output is sorted although a HashMap promises no order: an <code>Integer</code>'s hash code is its value, so 1–4 land in buckets 1–4. With 17, 3, 40 the same rule gives buckets 1, 3, 8 — printed 17, 3, 40, clearly not sorted. The <code>keySet</code> + <code>get</code> loop looks every key up a second time; <code>entrySet()</code> hands you both halves at once. The word count is the most common map pattern in PE "statistics" commands: get the old count (or null), put count + 1; wrap the map in a <code>TreeMap</code> to print it sorted.</p>`,
        `<p class="y-chinh">🎯 Một <code>HashMap</code> thô với khoá Integer 1–4 và giá trị String "One"–"Four"; vòng <code>keySet().iterator()</code> in <code>key + ": " + mymap.get(key)</code> — output 1: One, 2: Two, 3: Three, 4: Four. "Khoá: số nguyên, giá trị: String".</p>
<p>Code của slide chỉ biên dịch được sau khi thay nháy cong (“One") bằng nháy thẳng. Rồi ➕ hai thứ bạn sẽ viết trong bài thi — vòng lặp <code>entrySet</code> và map "đếm mỗi từ":</p>
<pre class="trich"><code class="language-java">public static void main(String[] args) {
    HashMap mymap = new HashMap();
    mymap.put(1, "One");
    mymap.put(2, "Two");
    mymap.put(3, "Three");
    mymap.put(4, "Four");
    //using Iterator
    Iterator iter = mymap.keySet().iterator();
    while (iter.hasNext()) {
        Object key = iter.next();
        System.out.println(key + ": " + mymap.get(key));
    }
    them();
}</code></pre>
<pre class="trich"><code class="language-java">static void them() {
    Map&lt;Integer, String&gt; m = new HashMap&lt;Integer, String&gt;();
    m.put(40, "Forty"); m.put(3, "Three"); m.put(17, "Seventeen");
    for (Map.Entry&lt;Integer, String&gt; e : m.entrySet())       // không phải tra lần hai bằng get(key)
        System.out.println(e.getKey() + " -&gt; " + e.getValue());

    String text = "to be or not to be that is the question to ask";
    Map&lt;String, Integer&gt; count = new HashMap&lt;String, Integer&gt;();
    for (String w : text.split("\\\\s+")) {
        Integer c = count.get(w);
        count.put(w, c == null ? 1 : c + 1);               // JDK 8 cũng có: count.merge(w, 1, Integer::sum)
    }
    System.out.println("word counts, sorted by word: " + new TreeMap&lt;String, Integer&gt;(count));
}</code></pre>
<div class="out">1: One<br>
2: Two<br>
3: Three<br>
4: Four<br>
17 -&gt; Seventeen<br>
3 -&gt; Three<br>
40 -&gt; Forty<br>
word counts, sorted by word: {ask=1, be=2, is=1, not=1, or=1, question=1, that=1, the=1, to=3}</div>
<p>Vì sao output của slide có thứ tự dù HashMap không hứa thứ tự nào: mã băm của <code>Integer</code> là chính giá trị, nên 1–4 rơi vào ô 1–4. Với 17, 3, 40 cùng luật đó cho ô 1, 3, 8 — in ra 17, 3, 40, rõ ràng không sắp xếp. Vòng <code>keySet</code> + <code>get</code> tra mỗi khoá thêm một lần nữa; <code>entrySet()</code> đưa bạn cả hai nửa một lúc. Đếm từ là mẫu dùng map phổ biến nhất trong các lệnh "thống kê" của đề PE: lấy số đếm cũ (hoặc null), put số đếm + 1; bọc map trong một <code>TreeMap</code> để in có thứ tự.</p>`],
      [26, 'Using HashMap class and Iterator',
        `<p class="y-chinh">🎯 <code>UseHashMap</code>: String keys and values (Vietnamese nicknames → full names). Put three, print; put "Sáu Tấn" again with a new value, print; remove "Bình Gà", print; then iterate <code>keySet()</code> and print "key, value". The NetBeans output shows <code>{Ba Địa= Trần Mai Hoà, Sáu Tấn=Huỳnh Anh Tuấn, Bình Gà=Nguyễn Tấn Sầu}</code> first.</p>
<p>The program from the screenshot, run unchanged on JDK 8:</p>
<pre><code class="language-java">// release: 8
// Slide 26: the slide's UseHashMap exactly (String keys and values in Vietnamese); compare the printed order with the screenshot
import java.util.HashMap;
import java.util.Iterator;
public class UseHashMap {
    public static void main(String[] args){
        HashMap h = new HashMap();
        h.put("Sáu Tấn", "Huỳnh Anh Tuấn");
        h.put("Bình Gà", "Nguyễn Tấn Sầu");
        h.put("Ba Địa", " Trần Mai Hoà");
        System.out.println(h);
        h.put("Sáu Tấn","Nguyễn Văn Tuấn");
        System.out.println(h);
        h.remove("Bình Gà");
        System.out.println(h);
        Iterator it = h.keySet().iterator();
        while (it.hasNext())
        { String key= (String)(it.next());
          String value = (String)(h.get(key));
          System.out.println(key + ", " + value);
        }
    }
}</code></pre>
<div class="out">{Bình Gà=Nguyễn Tấn Sầu, Ba Địa= Trần Mai Hoà, Sáu Tấn=Huỳnh Anh Tuấn}<br>
{Bình Gà=Nguyễn Tấn Sầu, Ba Địa= Trần Mai Hoà, Sáu Tấn=Nguyễn Văn Tuấn}<br>
{Ba Địa= Trần Mai Hoà, Sáu Tấn=Nguyễn Văn Tuấn}<br>
Ba Địa, &nbsp;Trần Mai Hoà<br>
Sáu Tấn, Nguyễn Văn Tuấn</div>
<p>The behaviour matches the slide — the second <code>put("Sáu Tấn", …)</code> replaced the value, <code>remove</code> deleted one entry — but the <strong>order is different</strong>: JDK 8 prints Bình Gà first, the screenshot prints Ba Địa first. The screenshot was taken on an older JDK. HashMap's bucket formula changed in JDK 8; recomputing both formulas for these three keys:</p>
<pre><code class="language-java">// release: 8
// Slide 26: why the screenshot prints {Ba Địa, Sáu Tấn, Bình Gà} but JDK 8 prints {Bình Gà, Ba Địa, Sáu Tấn} — the bucket formulas of JDK 7 and JDK 8 HashMap, recomputed
public class ThuTuHashMapJdk7 {
    static int jdk7(int h) {                         // HashMap.hash() in JDK 7 (default settings)
        h ^= (h &gt;&gt;&gt; 20) ^ (h &gt;&gt;&gt; 12);
        return h ^ (h &gt;&gt;&gt; 7) ^ (h &gt;&gt;&gt; 4);
    }
    static int jdk8(int h) {                         // HashMap.hash() since JDK 8
        return h ^ (h &gt;&gt;&gt; 16);
    }

    public static void main(String[] args) {
        String[] keys = { "Sáu Tấn", "Bình Gà", "Ba Địa" };        // in the order the slide puts them
        for (String k : keys) {
            int h = k.hashCode();
            System.out.println(k + "  hashCode " + h + "  bucket JDK 7: " + (jdk7(h) &amp; 15) + "  bucket JDK 8: " + (jdk8(h) &amp; 15));
        }
    }
}</code></pre>
<div class="out">Sáu Tấn &nbsp;hashCode -1390684828 &nbsp;bucket JDK 7: 4 &nbsp;bucket JDK 8: 15<br>
Bình Gà &nbsp;hashCode 1011931893 &nbsp;bucket JDK 7: 6 &nbsp;bucket JDK 8: 5<br>
Ba Địa &nbsp;hashCode 1980564677 &nbsp;bucket JDK 7: 4 &nbsp;bucket JDK 8: 8</div>
<p>With JDK 7's formula, "Sáu Tấn" and "Ba Địa" share bucket 4 (JDK 7 put a newer entry at the front of its bucket, so Ba Địa comes before Sáu Tấn) and "Bình Gà" is in bucket 6: exactly the screenshot's {Ba Địa, Sáu Tấn, Bình Gà}. With JDK 8's formula the buckets are 5, 8, 15: Bình Gà, Ba Địa, Sáu Tấn. Same code, same data, two orders — the clearest proof that HashMap order must never be relied on.</p>
<div class="pitfall">Two small things in the slide's data and code: the value <code>" Trần Mai Hoà"</code> starts with a space, hence the double space in "Ba Địa,  Trần Mai Hoà"; and the casts <code>(String)</code> are needed only because the map is raw — <code>HashMap&lt;String, String&gt;</code> removes them. In the PE, also remember the rule "no accented Vietnamese in code comments".</div>`,
        `<p class="y-chinh">🎯 <code>UseHashMap</code>: khoá và giá trị là String (biệt danh tiếng Việt → họ tên). Put ba mục, in; put lại "Sáu Tấn" với giá trị mới, in; xoá "Bình Gà", in; rồi duyệt <code>keySet()</code> và in "khoá, giá trị". Output NetBeans hiện <code>{Ba Địa= Trần Mai Hoà, Sáu Tấn=Huỳnh Anh Tuấn, Bình Gà=Nguyễn Tấn Sầu}</code> đầu tiên.</p>
<p>Chương trình trong ảnh chụp, chạy nguyên trên JDK 8:</p>
<pre><code class="language-java">// release: 8
// Slide 26: UseHashMap của slide y nguyên (khoá và giá trị chuỗi tiếng Việt); so thứ tự in ra với ảnh chụp
import java.util.HashMap;
import java.util.Iterator;
public class UseHashMap {
    public static void main(String[] args){
        HashMap h = new HashMap();
        h.put("Sáu Tấn", "Huỳnh Anh Tuấn");
        h.put("Bình Gà", "Nguyễn Tấn Sầu");
        h.put("Ba Địa", " Trần Mai Hoà");
        System.out.println(h);
        h.put("Sáu Tấn","Nguyễn Văn Tuấn");
        System.out.println(h);
        h.remove("Bình Gà");
        System.out.println(h);
        Iterator it = h.keySet().iterator();
        while (it.hasNext())
        { String key= (String)(it.next());
          String value = (String)(h.get(key));
          System.out.println(key + ", " + value);
        }
    }
}</code></pre>
<div class="out">{Bình Gà=Nguyễn Tấn Sầu, Ba Địa= Trần Mai Hoà, Sáu Tấn=Huỳnh Anh Tuấn}<br>
{Bình Gà=Nguyễn Tấn Sầu, Ba Địa= Trần Mai Hoà, Sáu Tấn=Nguyễn Văn Tuấn}<br>
{Ba Địa= Trần Mai Hoà, Sáu Tấn=Nguyễn Văn Tuấn}<br>
Ba Địa, &nbsp;Trần Mai Hoà<br>
Sáu Tấn, Nguyễn Văn Tuấn</div>
<p>Hành vi khớp slide — lần <code>put("Sáu Tấn", …)</code> thứ hai thay giá trị, <code>remove</code> xoá một mục — nhưng <strong>thứ tự khác</strong>: JDK 8 in Bình Gà trước, ảnh chụp in Ba Địa trước. Ảnh được chụp trên một JDK cũ hơn. Công thức chọn ô của HashMap đổi ở JDK 8; tính lại cả hai công thức cho ba khoá này:</p>
<pre><code class="language-java">// release: 8
// Slide 26: vì sao ảnh chụp in {Ba Địa, Sáu Tấn, Bình Gà} còn JDK 8 in {Bình Gà, Ba Địa, Sáu Tấn} — tính lại công thức chọn ô của HashMap JDK 7 và JDK 8
public class ThuTuHashMapJdk7 {
    static int jdk7(int h) {                         // HashMap.hash() của JDK 7 (cài đặt mặc định)
        h ^= (h &gt;&gt;&gt; 20) ^ (h &gt;&gt;&gt; 12);
        return h ^ (h &gt;&gt;&gt; 7) ^ (h &gt;&gt;&gt; 4);
    }
    static int jdk8(int h) {                         // HashMap.hash() từ JDK 8
        return h ^ (h &gt;&gt;&gt; 16);
    }

    public static void main(String[] args) {
        String[] keys = { "Sáu Tấn", "Bình Gà", "Ba Địa" };        // theo thứ tự slide put
        for (String k : keys) {
            int h = k.hashCode();
            System.out.println(k + "  hashCode " + h + "  bucket JDK 7: " + (jdk7(h) &amp; 15) + "  bucket JDK 8: " + (jdk8(h) &amp; 15));
        }
    }
}</code></pre>
<div class="out">Sáu Tấn &nbsp;hashCode -1390684828 &nbsp;bucket JDK 7: 4 &nbsp;bucket JDK 8: 15<br>
Bình Gà &nbsp;hashCode 1011931893 &nbsp;bucket JDK 7: 6 &nbsp;bucket JDK 8: 5<br>
Ba Địa &nbsp;hashCode 1980564677 &nbsp;bucket JDK 7: 4 &nbsp;bucket JDK 8: 8</div>
<p>Với công thức của JDK 7, "Sáu Tấn" và "Ba Địa" chung ô 4 (JDK 7 đặt mục mới hơn lên đầu ô, nên Ba Địa đứng trước Sáu Tấn) còn "Bình Gà" ở ô 6: đúng {Ba Địa, Sáu Tấn, Bình Gà} của ảnh chụp. Với công thức JDK 8 các ô là 5, 8, 15: Bình Gà, Ba Địa, Sáu Tấn. Cùng code, cùng dữ liệu, hai thứ tự — bằng chứng rõ nhất rằng không bao giờ được dựa vào thứ tự của HashMap.</p>
<div class="pitfall">Hai chuyện nhỏ trong dữ liệu và code của slide: giá trị <code>" Trần Mai Hoà"</code> bắt đầu bằng dấu cách, nên mới có hai dấu cách trong "Ba Địa,  Trần Mai Hoà"; và các phép ép <code>(String)</code> chỉ cần vì map là kiểu thô — <code>HashMap&lt;String, String&gt;</code> xoá được chúng. Ở PE, nhớ thêm luật "không gõ tiếng Việt có dấu trong chú thích code".</div>`],
      [27, 'Summary',
        `<p class="y-chinh">🎯 Summary: the Collections Framework; the <code>Collection</code> super-interface and iteration; Lists; Sets; Maps.</p>
<table>
<thead><tr><th></th><th>List</th><th>Set</th><th>Map</th></tr></thead>
<tbody>
<tr><td>duplicates</td><td>allowed</td><td>no (equals/hashCode or compareTo decides)</td><td>keys no, values yes</td></tr>
<tr><td>order</td><td>insertion, by index</td><td>Hash: none · Linked: insertion · Tree: sorted</td><td>same three choices</td></tr>
<tr><td>main classes</td><td>ArrayList, LinkedList (Vector legacy)</td><td>HashSet, LinkedHashSet, TreeSet</td><td>HashMap, LinkedHashMap, TreeMap</td></tr>
<tr><td>visit with</td><td>index loop, for-each, Iterator</td><td>for-each, Iterator</td><td>keySet(), values(), entrySet()</td></tr>
<tr><td>your class needs</td><td>equals (for contains/remove)</td><td>equals + hashCode, or compareTo</td><td>the same, on the KEY</td></tr>
</tbody>
</table>
<p>Three habits from these two lessons that earn PE marks: declare with the interface (<code>List&lt;Staff&gt; list = new ArrayList&lt;Staff&gt;()</code>); remove inside a loop only with <code>Iterator.remove()</code> (or <code>removeIf</code>); never print a HashSet/HashMap expecting an order — sort it or use the Tree version.</p>
<p>Next: the 🧪 practice of Chapter 8 (lesson 8.2) turns this into PE question 3 (<code>f1/f2/f3</code> on a <code>List</code>), a <code>List</code>-subclass question, a 10-mark command program with maps, a LAB211 menu, and a bug hunt on <code>equals</code>/<code>hashCode</code>; then the rewritten Chapter 8 quiz.</p>`,
        `<p class="y-chinh">🎯 Tóm tắt: Collections Framework; interface cha <code>Collection</code> và việc duyệt; List; Set; Map.</p>
<table>
<thead><tr><th></th><th>List</th><th>Set</th><th>Map</th></tr></thead>
<tbody>
<tr><td>phần tử trùng</td><td>được</td><td>không (equals/hashCode hoặc compareTo quyết định)</td><td>khoá không, giá trị có</td></tr>
<tr><td>thứ tự</td><td>theo thứ tự thêm, có chỉ số</td><td>Hash: không có · Linked: thứ tự thêm · Tree: sắp xếp</td><td>cùng ba lựa chọn đó</td></tr>
<tr><td>lớp chính</td><td>ArrayList, LinkedList (Vector là di sản)</td><td>HashSet, LinkedHashSet, TreeSet</td><td>HashMap, LinkedHashMap, TreeMap</td></tr>
<tr><td>duyệt bằng</td><td>vòng chỉ số, for-each, Iterator</td><td>for-each, Iterator</td><td>keySet(), values(), entrySet()</td></tr>
<tr><td>lớp của bạn cần</td><td>equals (cho contains/remove)</td><td>equals + hashCode, hoặc compareTo</td><td>như trên, áp cho KHOÁ</td></tr>
</tbody>
</table>
<p>Ba thói quen từ hai bài này đem lại điểm PE: khai báo bằng interface (<code>List&lt;Staff&gt; list = new ArrayList&lt;Staff&gt;()</code>); xoá trong vòng lặp chỉ bằng <code>Iterator.remove()</code> (hoặc <code>removeIf</code>); đừng bao giờ in HashSet/HashMap mà trông đợi một thứ tự — hãy sắp xếp, hoặc dùng bản Tree.</p>
<p>Tiếp theo: bài 🧪 thực hành Chương 8 (bài 8.2) biến các điều này thành câu 3 đề PE (<code>f1/f2/f3</code> trên một <code>List</code>), câu lớp con của <code>List</code>, một chương trình 10 điểm chạy theo lệnh có dùng map, một menu LAB211, và một bài săn lỗi <code>equals</code>/<code>hashCode</code>; rồi tới quiz Chương 8 đã viết lại.</p>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ul>
<li>A class <code>Product</code> overrides <code>equals</code> (same code ⇒ equal) but not <code>hashCode</code>. What do <code>list.contains(p)</code> and <code>hashSet.contains(p)</code> return for an equal but different object? Fix it.</li>
<li>A <code>TreeSet&lt;Student&gt;</code> ordered by GPA receives three students with GPA 8.0. How many does it keep? Write a Comparator that keeps all three.</li>
<li>What does <code>map.put("SE01", "A")</code> return the first time, and the second time with value "B"?</li>
<li>Your program prints a <code>HashMap</code> and the order differs from the PE sample output. What do you change?</li>
</ul>`,
    `<h3>✅ Tự kiểm tra</h3>
<ul>
<li>Lớp <code>Product</code> ghi đè <code>equals</code> (cùng mã ⇒ bằng nhau) nhưng không ghi đè <code>hashCode</code>. <code>list.contains(p)</code> và <code>hashSet.contains(p)</code> trả gì với một đối tượng bằng nội dung nhưng khác đối tượng? Hãy sửa.</li>
<li>Một <code>TreeSet&lt;Student&gt;</code> sắp theo GPA nhận ba sinh viên cùng GPA 8.0. Nó giữ mấy người? Viết một Comparator giữ đủ cả ba.</li>
<li><code>map.put("SE01", "A")</code> trả về gì lần đầu, và lần thứ hai với giá trị "B"?</li>
<li>Chương trình của bạn in một <code>HashMap</code> và thứ tự khác output mẫu của đề PE. Bạn sửa gì?</li>
</ul>`),
    books([
      ['horstmann1', 'Ch. 9.3.3–9.3.5 "Hash Sets", "Tree Sets", "Queues and Deques"; Ch. 9.4 "Maps" (basic operations, updating map entries, map views); Ch. 5.2.2–5.2.3 "The equals Method", "The hashCode Method"', 'Chương 9.3.3–9.3.5 "Hash Sets", "Tree Sets", "Queues and Deques"; Chương 9.4 "Maps" (thao tác cơ bản, cập nhật mục, khung nhìn của map); Chương 5.2.2–5.2.3 "The equals Method", "The hashCode Method"'],
      ['javaTutorial', 'trail "Collections" — "The Set Interface", "The Map Interface", "Object Ordering" (Comparable, Comparator), "Set Implementations", "Map Implementations"', 'trail "Collections" — "The Set Interface", "The Map Interface", "Object Ordering" (Comparable, Comparator), "Set Implementations", "Map Implementations"'],
      ['apiDocs', 'java.lang.Object (equals, hashCode contracts), java.lang.Comparable, java.util.Comparator, HashSet, TreeSet, NavigableSet, HashMap, TreeMap', 'java.lang.Object (hợp đồng equals, hashCode), java.lang.Comparable, java.util.Comparator, HashSet, TreeSet, NavigableSet, HashMap, TreeMap'],
      ['fuOffline', 'part "Collection" — Set and TreeSet (demonstrations 1–3), Map and HashMap, supporting classes Collections/Arrays', 'phần "Collection" — Set và TreeSet (demo 1–3), Map và HashMap, lớp hỗ trợ Collections/Arrays'],
    ]),
  ].join('\n'),
};

/* ───────── 8.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Collections the PE way: f1/f2/f3, ArrayList subclasses, maps, menus ───────── */
const L_on_ch8 = {
  title: '8.2 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Collections the PE way: f1/f2/f3, ArrayList subclasses, maps, menus|||8.2 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Collections kiểu PE: f1/f2/f3, lớp con ArrayList, map, menu',
  slug: 'pro192-on-ch8',
  type: 'VIDEO',
  description: '7 bài tập Chương 8 có lời giải chạy thật trên JDK 8 và sơ đồ lớp: câu 3 đề PE hiện thực interface cho sẵn f1/f2/f3 trên List (tổng có điều kiện, sắp hai tiêu chí bằng Comparator, xoá tại chỗ bằng Iterator) với khung Main một Scanner, câu lớp con extends ArrayList, một câu Q1 10 điểm chạy theo lệnh dùng TreeMap/HashMap (thêm, bán, in, top k, đếm theo nhóm, dọn hàng hết), menu quản lý sinh viên của học liệu FU có kiểm tra dữ liệu, săn lỗi equals/hashCode và khoá bị đổi sau khi cất, sáu lỗi biên dịch thật của JDK 8 (gồm List.of và name clash) và sáu câu đoán output; 16 thuật ngữ Anh–Việt; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.2 · Practice &amp; review</span>
<h2>Collections the way the PE asks for them</h2>
<p class="lead">Lessons 8.A and 8.B walked the deck "Collections". Now the exam shapes. Collections appear in a PRO192 PE in three ways: question 3 of the classic 4-question papers ("the interface <code>IXxx</code> with <code>f1</code>, <code>f2</code>, <code>f3</code> on a <code>List</code> is given as byte code — implement it"), the "class <code>XxxList</code> extends <code>ArrayList&lt;Xxx&gt;</code>" question, and every 10-mark <code>Q1</code> program that keeps objects in a list or a map. All three are below, solved and run on JDK 8 with the input piped in the way the marker does it — plus a LAB211 menu, the <code>equals</code>/<code>hashCode</code> bug, and two FE-style drills.</p>
<table>
<thead><tr><th>Exercise</th><th>Skill</th><th>Exam link</th></tr></thead>
<tbody>
<tr><td>1</td><td>implement a given interface: f1/f2/f3 on a <code>List&lt;Bike&gt;</code></td><td>PE question 3 (PE6, PE11–PE14)</td></tr>
<tr><td>2</td><td>a class that extends <code>ArrayList&lt;SimCard&gt;</code></td><td>PE1 question 3</td></tr>
<tr><td>3</td><td>a command-driven Q1 with <code>TreeMap</code>, <code>HashMap</code>, a <code>Comparator</code></td><td>PE3, PE5, PE9 (10 marks)</td></tr>
<tr><td>4</td><td>a menu program with validation over an <code>ArrayList</code></td><td>LAB211, FU offline "Student managing program"</td></tr>
<tr><td>5</td><td>find and fix the missing <code>hashCode</code></td><td>PE-ADV4, FE "how many elements?"</td></tr>
<tr><td>6</td><td>name the rule behind six real compile errors</td><td>FE "which line fails?", exam-room surprises</td></tr>
<tr><td>7</td><td>predict six outputs</td><td>FE "what is printed?"</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.2 · Thực hành &amp; ôn tập</span>
<h2>Collections theo đúng cách đề PE hỏi</h2>
<p class="lead">Bài 8.A và 8.B đã đi hết bộ slide "Collections". Giờ là các dạng đề. Collections xuất hiện trong PE PRO192 theo ba cách: câu 3 của đề 4 câu kiểu cũ ("interface <code>IXxx</code> có <code>f1</code>, <code>f2</code>, <code>f3</code> trên một <code>List</code> được cho dạng byte code — hãy hiện thực nó"), câu "lớp <code>XxxList</code> extends <code>ArrayList&lt;Xxx&gt;</code>", và mọi chương trình <code>Q1</code> 10 điểm giữ đối tượng trong list hay map. Cả ba có ở dưới, đã giải và chạy trên JDK 8 với dữ liệu đổ vào đúng cách máy chấm làm — thêm một menu LAB211, lỗi <code>equals</code>/<code>hashCode</code>, và hai bài luyện kiểu FE.</p>
<table>
<thead><tr><th>Bài</th><th>Kỹ năng</th><th>Liên hệ đề thi</th></tr></thead>
<tbody>
<tr><td>1</td><td>hiện thực interface cho sẵn: f1/f2/f3 trên <code>List&lt;Bike&gt;</code></td><td>câu 3 PE (PE6, PE11–PE14)</td></tr>
<tr><td>2</td><td>một lớp extends <code>ArrayList&lt;SimCard&gt;</code></td><td>câu 3 PE1</td></tr>
<tr><td>3</td><td>Q1 chạy theo lệnh với <code>TreeMap</code>, <code>HashMap</code>, một <code>Comparator</code></td><td>PE3, PE5, PE9 (10 điểm)</td></tr>
<tr><td>4</td><td>chương trình menu có kiểm tra dữ liệu trên <code>ArrayList</code></td><td>LAB211, "Student managing program" của học liệu FU</td></tr>
<tr><td>5</td><td>tìm và sửa chỗ thiếu <code>hashCode</code></td><td>PE-ADV4, FE "có mấy phần tử?"</td></tr>
<tr><td>6</td><td>gọi tên luật đứng sau sáu lỗi biên dịch thật</td><td>FE "dòng nào lỗi?", bất ngờ trong phòng thi</td></tr>
<tr><td>7</td><td>đoán sáu output</td><td>FE "in ra gì?"</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — PE question 3: Bike and MyBike implements the given IBike (~30 min)</h3>
<p>(3 marks, PE style) Create class <code>Bike</code> as in the diagram. The interface <code>IBike</code> "is already compiled and given in byte code format" — use it, do not create IBike.java. Write <code>MyBike implements IBike</code>:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f9aa7a56a3c79a6f6dbfd72240bdeaafd2db5e54.svg" alt="Exercise 1: what you write (Bike, MyBike) and what the paper gives (IBike, Main)" loading="lazy" /><p class="chu-thich">🧩 Exercise 1: what you write (Bike, MyBike) and what the paper gives (IBike, Main)</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the diagram of a PE question 3: you write Bike and MyBike; IBike and Main are given
class Bike {
  - brand : String
  - price : int
  + Bike()
  + Bike(brand : String, price : int)
  + getBrand() : String
  + getPrice() : int
  + setBrand(brand : String) : void
  + setPrice(price : int) : void
  + toString() : String
}
interface IBike &lt;&lt;given .class&gt;&gt; {
  + f1(t : List&lt;Bike&gt;) : int
  + f2(t : List&lt;Bike&gt;) : void
  + f3(t : List&lt;Bike&gt;) : void
}
class MyBike {
  + f1(t : List&lt;Bike&gt;) : int
  + f2(t : List&lt;Bike&gt;) : void
  + f3(t : List&lt;Bike&gt;) : void
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} main(args : String[]) : void
}
IBike &lt;|.. MyBike
MyBike ..&gt; Bike : uses
Main ..&gt; IBike : IBike my = new MyBike()
Main ..&gt; Bike : builds a List&lt;Bike&gt;
@enduml</code></pre></details>
<ul>
<li><code>f1</code>: return the sum of the prices of the bikes whose brand starts with an upper-case letter.</li>
<li><code>f2</code>: sort the list by price descending; bikes with equal prices by brand ascending.</li>
<li><code>f3</code>: remove <strong>all</strong> bikes having the smallest price in the list (update the list in place, keep the order of the others).</li>
</ul>
<details><summary>Solution (run for real on JDK 8, with the input below)</summary>
<pre class="trich"><code class="language-java">// GIVEN as byte code (IBike.class) — do NOT create IBike.java in the exam
interface IBike {
    public int f1(List&lt;Bike&gt; t);
    public void f2(List&lt;Bike&gt; t);
    public void f3(List&lt;Bike&gt; t);
}</code></pre>
<pre class="trich"><code class="language-java">class Bike {
    private String brand;
    private int price;

    public Bike() {
    }

    public Bike(String brand, int price) {
        this.brand = brand;
        this.price = price;
    }

    public String getBrand() { return brand; }
    public int getPrice() { return price; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setPrice(int price) { this.price = price; }

    @Override
    public String toString() {
        return "(" + brand + ", " + price + ")";
    }
}</code></pre>
<pre class="trich"><code class="language-java">class MyBike implements IBike {

    // f1: sum of the prices of bikes whose brand starts with an upper-case letter
    @Override
    public int f1(List&lt;Bike&gt; t) {
        int sum = 0;
        for (Bike b : t) {
            String s = b.getBrand();
            if (!s.isEmpty() &amp;&amp; Character.isUpperCase(s.charAt(0))) {
                sum += b.getPrice();
            }
        }
        return sum;
    }

    // f2: sort by price descending; equal prices by brand ascending
    @Override
    public void f2(List&lt;Bike&gt; t) {
        Collections.sort(t, new Comparator&lt;Bike&gt;() {
            @Override
            public int compare(Bike a, Bike b) {
                int c = Integer.compare(b.getPrice(), a.getPrice());
                return c != 0 ? c : a.getBrand().compareTo(b.getBrand());
            }
        });
    }

    // f3: remove ALL bikes having the smallest price (in place, keep the order of the rest)
    @Override
    public void f3(List&lt;Bike&gt; t) {
        if (t.isEmpty()) return;
        int min = t.get(0).getPrice();
        for (Bike b : t) min = Math.min(min, b.getPrice());
        Iterator&lt;Bike&gt; it = t.iterator();
        while (it.hasNext()) {
            if (it.next().getPrice() == min) it.remove();
        }
    }
}</code></pre>
<p>The harness — shaped like the paper's <code>Main.class</code> (which runs one test case per run; this one runs all three on fresh copies):</p>
<pre class="trich"><code class="language-java">// shaped like the given Main.class: ONE Scanner, nextInt() followed by nextLine()
public class PeQ3Bike {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number of bikes: ");
        int n = sc.nextInt();
        sc.nextLine();                                   // eat the end of the line
        List&lt;Bike&gt; list = new ArrayList&lt;Bike&gt;();
        for (int i = 0; i &lt; n; i++) {
            System.out.print("Enter brand: ");
            String brand = sc.nextLine().trim();
            System.out.print("Enter price: ");
            int price = sc.nextInt();
            sc.nextLine();
            list.add(new Bike(brand, price));
        }
        System.out.println();
        IBike my = new MyBike();
        for (int tc = 1; tc &lt;= 3; tc++) {                // the real Main runs ONE test case per run; here all three
            List&lt;Bike&gt; t = new ArrayList&lt;Bike&gt;(list);    // a fresh copy for each test case
            System.out.println("TC" + tc + ":");
            if (tc == 1) {
                System.out.println("OUTPUT:");
                System.out.println(my.f1(t));
            } else {
                if (tc == 2) my.f2(t); else my.f3(t);
                System.out.println("OUTPUT:");
                for (Bike b : t) System.out.print(b + " ");
                System.out.println();
            }
        }
    }
}</code></pre>
<p>Keyboard input (piped in, as the marker does):</p>
<pre><code class="language-plaintext">6
Honda
30
yamaha
45
VinFast
30
Suzuki
45
piaggio
12
Ducati
12</code></pre>
<div class="out">Enter number of bikes: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price:<br>
TC1:<br>
OUTPUT:<br>
117<br>
TC2:<br>
OUTPUT:<br>
(Suzuki, 45) (yamaha, 45) (Honda, 30) (VinFast, 30) (Ducati, 12) (piaggio, 12)<br>
TC3:<br>
OUTPUT:<br>
(Honda, 30) (yamaha, 45) (VinFast, 30) (Suzuki, 45)</div>
<p>f1 = 30 + 30 + 45 + 12 = 117 (Honda, VinFast, Suzuki, Ducati). In f2, Suzuki comes before yamaha because <code>compareTo</code> compares character codes: 'S' (83) &lt; 'y' (121) — exactly what "brand ascending" means in Java unless the paper says "ignore case". f3 finds the minimum first, then removes with the Iterator in a second pass: both 12-bikes go, the others keep their order.</p>
</details>
<div class="pitfall">Three things measured for this question shape. (1) The paper's page shows <code>public int f1(List t)</code>, but <code>javap</code> on the real given <code>ILadder.class</code> of PE11 prints <code>f1(java.util.List&lt;Ladder&gt;)</code> — the web page lost the <code>&lt;Ladder&gt;</code>; write <code>List&lt;Bike&gt;</code>, and if a given interface ever is truly raw, exercise 6 (E6) shows the error you get. (2) <code>f3</code> with a for-each and <code>t.remove(b)</code> is wrong even on the sample: removing <code>piaggio</code> (second to last) ends the loop early, so <code>Ducati</code> is silently left in the list with no exception; on hidden tests where the removed element is not second to last it throws <code>ConcurrentModificationException</code> (lesson 8.A, slide 10). (3) The given Main reads with ONE <code>Scanner</code> and <code>nextInt()</code> + <code>nextLine()</code> — never create a second <code>Scanner</code> in your class.</div>`,
    `<h3>🧪 Bài 1 — Câu 3 đề PE: Bike và MyBike hiện thực IBike cho sẵn (~30 phút)</h3>
<p>(3 điểm, kiểu PE) Tạo lớp <code>Bike</code> như sơ đồ. Interface <code>IBike</code> "đã biên dịch và cho sẵn dạng byte code" — cứ dùng, đừng tạo IBike.java. Viết <code>MyBike implements IBike</code>:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/f9aa7a56a3c79a6f6dbfd72240bdeaafd2db5e54.svg" alt="Bài 1: phần bạn viết (Bike, MyBike) và phần đề cho (IBike, Main)" loading="lazy" /><p class="chu-thich">🧩 Bài 1: phần bạn viết (Bike, MyBike) và phần đề cho (IBike, Main)</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 1 — the diagram of a PE question 3: you write Bike and MyBike; IBike and Main are given
class Bike {
  - brand : String
  - price : int
  + Bike()
  + Bike(brand : String, price : int)
  + getBrand() : String
  + getPrice() : int
  + setBrand(brand : String) : void
  + setPrice(price : int) : void
  + toString() : String
}
interface IBike &lt;&lt;given .class&gt;&gt; {
  + f1(t : List&lt;Bike&gt;) : int
  + f2(t : List&lt;Bike&gt;) : void
  + f3(t : List&lt;Bike&gt;) : void
}
class MyBike {
  + f1(t : List&lt;Bike&gt;) : int
  + f2(t : List&lt;Bike&gt;) : void
  + f3(t : List&lt;Bike&gt;) : void
}
class Main &lt;&lt;given .class&gt;&gt; {
  + {static} main(args : String[]) : void
}
IBike &lt;|.. MyBike
MyBike ..&gt; Bike : uses
Main ..&gt; IBike : IBike my = new MyBike()
Main ..&gt; Bike : builds a List&lt;Bike&gt;
@enduml</code></pre></details>
<ul>
<li><code>f1</code>: trả về tổng giá các xe có hãng bắt đầu bằng chữ hoa.</li>
<li><code>f2</code>: sắp list theo giá giảm dần; xe cùng giá thì theo hãng tăng dần.</li>
<li><code>f3</code>: xoá <strong>mọi</strong> xe có giá nhỏ nhất trong list (sửa list tại chỗ, giữ thứ tự các xe còn lại).</li>
</ul>
<details><summary>Lời giải (chạy thật trên JDK 8, với dữ liệu bên dưới)</summary>
<pre class="trich"><code class="language-java">// CHO SẴN dạng byte code — trong phòng thi KHÔNG tạo IBike.java
interface IBike {
    public int f1(List&lt;Bike&gt; t);
    public void f2(List&lt;Bike&gt; t);
    public void f3(List&lt;Bike&gt; t);
}</code></pre>
<pre class="trich"><code class="language-java">class Bike {
    private String brand;
    private int price;

    public Bike() {
    }

    public Bike(String brand, int price) {
        this.brand = brand;
        this.price = price;
    }

    public String getBrand() { return brand; }
    public int getPrice() { return price; }
    public void setBrand(String brand) { this.brand = brand; }
    public void setPrice(int price) { this.price = price; }

    @Override
    public String toString() {
        return "(" + brand + ", " + price + ")";
    }
}</code></pre>
<pre class="trich"><code class="language-java">class MyBike implements IBike {

    // tổng giá các xe có hãng bắt đầu bằng chữ hoa
    @Override
    public int f1(List&lt;Bike&gt; t) {
        int sum = 0;
        for (Bike b : t) {
            String s = b.getBrand();
            if (!s.isEmpty() &amp;&amp; Character.isUpperCase(s.charAt(0))) {
                sum += b.getPrice();
            }
        }
        return sum;
    }

    // sắp giá giảm dần; giá bằng nhau thì theo hãng tăng dần
    @Override
    public void f2(List&lt;Bike&gt; t) {
        Collections.sort(t, new Comparator&lt;Bike&gt;() {
            @Override
            public int compare(Bike a, Bike b) {
                int c = Integer.compare(b.getPrice(), a.getPrice());
                return c != 0 ? c : a.getBrand().compareTo(b.getBrand());
            }
        });
    }

    // xoá MỌI xe có giá nhỏ nhất (sửa tại chỗ, giữ thứ tự phần còn lại)
    @Override
    public void f3(List&lt;Bike&gt; t) {
        if (t.isEmpty()) return;
        int min = t.get(0).getPrice();
        for (Bike b : t) min = Math.min(min, b.getPrice());
        Iterator&lt;Bike&gt; it = t.iterator();
        while (it.hasNext()) {
            if (it.next().getPrice() == min) it.remove();
        }
    }
}</code></pre>
<p>Khung chạy — dựng giống <code>Main.class</code> của đề (đề chạy mỗi lần một test case; khung này chạy cả ba trên các bản sao mới):</p>
<pre class="trich"><code class="language-java">// giống Main.class đề cho: MỘT Scanner, nextInt() rồi nextLine()
public class PeQ3Bike {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number of bikes: ");
        int n = sc.nextInt();
        sc.nextLine();                                   // nuốt phần cuối dòng
        List&lt;Bike&gt; list = new ArrayList&lt;Bike&gt;();
        for (int i = 0; i &lt; n; i++) {
            System.out.print("Enter brand: ");
            String brand = sc.nextLine().trim();
            System.out.print("Enter price: ");
            int price = sc.nextInt();
            sc.nextLine();
            list.add(new Bike(brand, price));
        }
        System.out.println();
        IBike my = new MyBike();
        for (int tc = 1; tc &lt;= 3; tc++) {                // Main thật chạy MỘT test case mỗi lần; ở đây chạy cả ba
            List&lt;Bike&gt; t = new ArrayList&lt;Bike&gt;(list);    // mỗi test case một bản sao mới
            System.out.println("TC" + tc + ":");
            if (tc == 1) {
                System.out.println("OUTPUT:");
                System.out.println(my.f1(t));
            } else {
                if (tc == 2) my.f2(t); else my.f3(t);
                System.out.println("OUTPUT:");
                for (Bike b : t) System.out.print(b + " ");
                System.out.println();
            }
        }
    }
}</code></pre>
<p>Dữ liệu bàn phím (đổ vào qua đường ống, như máy chấm làm):</p>
<pre><code class="language-plaintext">6
Honda
30
yamaha
45
VinFast
30
Suzuki
45
piaggio
12
Ducati
12</code></pre>
<div class="out">Enter number of bikes: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price: Enter brand: Enter price:<br>
TC1:<br>
OUTPUT:<br>
117<br>
TC2:<br>
OUTPUT:<br>
(Suzuki, 45) (yamaha, 45) (Honda, 30) (VinFast, 30) (Ducati, 12) (piaggio, 12)<br>
TC3:<br>
OUTPUT:<br>
(Honda, 30) (yamaha, 45) (VinFast, 30) (Suzuki, 45)</div>
<p>f1 = 30 + 30 + 45 + 12 = 117 (Honda, VinFast, Suzuki, Ducati). Trong f2, Suzuki đứng trước yamaha vì <code>compareTo</code> so mã ký tự: 'S' (83) &lt; 'y' (121) — đúng nghĩa "hãng tăng dần" trong Java, trừ khi đề ghi "không phân biệt hoa thường". f3 tìm giá nhỏ nhất trước, rồi xoá bằng Iterator ở lượt thứ hai: cả hai xe giá 12 bị xoá, các xe khác giữ thứ tự.</p>
</details>
<div class="pitfall">Ba điều đã đo cho dạng câu này. (1) Trang đề ghi <code>public int f1(List t)</code>, nhưng <code>javap</code> trên file <code>ILadder.class</code> thật của bộ given PE11 in ra <code>f1(java.util.List&lt;Ladder&gt;)</code> — trang web đã nuốt mất <code>&lt;Ladder&gt;</code>; hãy viết <code>List&lt;Bike&gt;</code>, và nếu có lúc interface cho sẵn thật sự là kiểu thô thì bài 6 (E6) cho thấy lỗi bạn sẽ gặp. (2) <code>f3</code> viết bằng for-each và <code>t.remove(b)</code> sai ngay với dữ liệu mẫu: xoá <code>piaggio</code> (áp chót) làm vòng lặp dừng sớm nên <code>Ducati</code> lặng lẽ còn lại trong list, không có ngoại lệ nào; ở test ẩn, khi phần tử bị xoá không đứng áp chót, nó ném <code>ConcurrentModificationException</code> (bài 8.A, slide 10). (3) Main của đề đọc bằng MỘT <code>Scanner</code> với <code>nextInt()</code> + <code>nextLine()</code> — đừng bao giờ tạo <code>Scanner</code> thứ hai trong lớp của bạn.</div>`),
    bi(`<h3>🧪 Exercise 2 — PE: SimCardList extends ArrayList&lt;SimCard&gt; (~25 min)</h3>
<p>(2–3 marks, PE1 style) Write class <code>SimCard</code> (<code>id</code>, <code>owner</code>, <code>balance</code>; default constructor sets "", "", 0.0; <code>toString()</code> = <code>id,owner,balance</code>) and class <code>SimCardList</code> which extends <code>ArrayList&lt;SimCard&gt;</code> with:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9a6d83f454afa4af6ec58f24fc4f68ad3fe68138.svg" alt="Exercise 2: SimCardList inherits every list method and adds four of its own" loading="lazy" /><p class="chu-thich">🧩 Exercise 2: SimCardList inherits every list method and adds four of its own</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — SimCardList IS an ArrayList&lt;SimCard&gt;: it inherits add, get, size, iterator…
class "ArrayList&lt;SimCard&gt;" as AL &lt;&lt;java.util&gt;&gt; {
  + add(e : SimCard) : boolean
  + get(index : int) : SimCard
  + size() : int
  + iterator() : Iterator&lt;SimCard&gt;
}
class SimCardList {
  + getById(id : String) : SimCard
  + countByBalance(min : double) : int
  + removeByOwner(owner : String) : int
  + sortByBalanceDesc() : void
}
class SimCard {
  - id : String
  - owner : String
  - balance : double
  + SimCard()
  + SimCard(id : String, owner : String, balance : double)
  + getId() : String
  + getOwner() : String
  + getBalance() : double
  + setBalance(balance : double) : void
  + toString() : String
}
AL &lt;|-- SimCardList
SimCardList o-- "0..*" SimCard : elements
@enduml</code></pre></details>
<ul>
<li><code>getById(id)</code>: the card with this id, ignoring case, or <code>null</code>.</li>
<li><code>countByBalance(min)</code>: the number of cards with balance ≥ min.</li>
<li><code>removeByOwner(owner)</code>: remove every card of this owner, return how many were removed.</li>
<li><code>sortByBalanceDesc()</code>: balance descending, equal balances by id ascending.</li>
</ul>
<details><summary>Solution (run for real on JDK 8)</summary>
<pre class="trich"><code class="language-java">class SimCard {
    private String id;
    private String owner;
    private double balance;

    public SimCard() {
        this("", "", 0.0);
    }

    public SimCard(String id, String owner, double balance) {
        this.id = id;
        this.owner = owner;
        this.balance = balance;
    }

    public String getId() { return id; }
    public String getOwner() { return owner; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    @Override
    public String toString() {
        return id + "," + owner + "," + balance;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SimCardList extends ArrayList&lt;SimCard&gt; {

    // the SimCard with this id (ignore case), or null
    public SimCard getById(String id) {
        for (SimCard s : this) {                       // "this" IS the list
            if (s.getId().equalsIgnoreCase(id)) return s;
        }
        return null;
    }

    // how many cards have balance &gt;= min
    public int countByBalance(double min) {
        int count = 0;
        for (SimCard s : this) {
            if (s.getBalance() &gt;= min) count++;
        }
        return count;
    }

    // remove every card of this owner; return how many were removed
    public int removeByOwner(String owner) {
        int before = size();
        Iterator&lt;SimCard&gt; it = iterator();
        while (it.hasNext()) {
            if (it.next().getOwner().equals(owner)) it.remove();
        }
        return before - size();
    }

    // balance descending, then id ascending
    public void sortByBalanceDesc() {
        Collections.sort(this, new Comparator&lt;SimCard&gt;() {
            @Override
            public int compare(SimCard a, SimCard b) {
                int c = Double.compare(b.getBalance(), a.getBalance());
                return c != 0 ? c : a.getId().compareTo(b.getId());
            }
        });
    }
}</code></pre>
<pre class="trich"><code class="language-java">SimCardList list = new SimCardList();
list.add(new SimCard("S03", "Lan", 50000.0));
list.add(new SimCard("S01", "Minh", 120000.0));
list.add(new SimCard("S04", "Lan", 0.0));
list.add(new SimCard("S02", "Hoa", 120000.0));
list.add(new SimCard("S05", "Tuan", 75500.5));
System.out.println("size() inherited from ArrayList: " + list.size());
System.out.println("getById(\\"s02\\") -&gt; " + list.getById("s02"));
System.out.println("getById(\\"S99\\") -&gt; " + list.getById("S99"));
System.out.println("countByBalance(75000) -&gt; " + list.countByBalance(75000));
list.sortByBalanceDesc();
System.out.println("sorted:");
for (SimCard s : list) System.out.println("  " + s);
System.out.println("removeByOwner(\\"Lan\\") -&gt; " + list.removeByOwner("Lan") + ", left " + list);</code></pre>
<div class="out">size() inherited from ArrayList: 5<br>
getById("s02") -&gt; S02,Hoa,120000.0<br>
getById("S99") -&gt; null<br>
countByBalance(75000) -&gt; 3<br>
sorted:<br>
&nbsp;&nbsp;S01,Minh,120000.0<br>
&nbsp;&nbsp;S02,Hoa,120000.0<br>
&nbsp;&nbsp;S05,Tuan,75500.5<br>
&nbsp;&nbsp;S03,Lan,50000.0<br>
&nbsp;&nbsp;S04,Lan,0.0<br>
removeByOwner("Lan") -&gt; 2, left [S01,Minh,120000.0, S02,Hoa,120000.0, S05,Tuan,75500.5]</div>
<p>The idea of the question is inheritance (Chapter 4) applied to a collection: <code>SimCardList</code> <em>is</em> an <code>ArrayList</code>, so <code>this</code> is the list — <code>for (SimCard s : this)</code>, <code>iterator()</code>, <code>size()</code>, <code>Collections.sort(this, …)</code> all work without any field. <code>removeByOwner</code> counts by comparing <code>size()</code> before and after, and removes through the Iterator; on JDK 8 <code>removeIf(s -&gt; s.getOwner().equals(owner))</code> is a correct one-line alternative.</p>
</details>
<div class="pitfall">Two classic slips: adding a field <code>private List&lt;SimCard&gt; list = new ArrayList&lt;&gt;()</code> inside a class that already <em>extends</em> ArrayList — the given Main adds cards to <code>this</code>, your methods search the empty field, every test returns 0/null; and comparing ids with <code>==</code> — the Main builds the id from keyboard input, so <code>==</code> is false even for "S02" vs "S02". Use <code>equals</code>/<code>equalsIgnoreCase</code>.</div>`,
    `<h3>🧪 Bài 2 — PE: SimCardList extends ArrayList&lt;SimCard&gt; (~25 phút)</h3>
<p>(2–3 điểm, kiểu PE1) Viết lớp <code>SimCard</code> (<code>id</code>, <code>owner</code>, <code>balance</code>; constructor mặc định gán "", "", 0.0; <code>toString()</code> = <code>id,owner,balance</code>) và lớp <code>SimCardList</code> kế thừa <code>ArrayList&lt;SimCard&gt;</code> với:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/9a6d83f454afa4af6ec58f24fc4f68ad3fe68138.svg" alt="Bài 2: SimCardList kế thừa mọi phương thức của list và thêm bốn phương thức riêng" loading="lazy" /><p class="chu-thich">🧩 Bài 2: SimCardList kế thừa mọi phương thức của list và thêm bốn phương thức riêng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 2 — SimCardList IS an ArrayList&lt;SimCard&gt;: it inherits add, get, size, iterator…
class "ArrayList&lt;SimCard&gt;" as AL &lt;&lt;java.util&gt;&gt; {
  + add(e : SimCard) : boolean
  + get(index : int) : SimCard
  + size() : int
  + iterator() : Iterator&lt;SimCard&gt;
}
class SimCardList {
  + getById(id : String) : SimCard
  + countByBalance(min : double) : int
  + removeByOwner(owner : String) : int
  + sortByBalanceDesc() : void
}
class SimCard {
  - id : String
  - owner : String
  - balance : double
  + SimCard()
  + SimCard(id : String, owner : String, balance : double)
  + getId() : String
  + getOwner() : String
  + getBalance() : double
  + setBalance(balance : double) : void
  + toString() : String
}
AL &lt;|-- SimCardList
SimCardList o-- "0..*" SimCard : elements
@enduml</code></pre></details>
<ul>
<li><code>getById(id)</code>: sim có id này, không phân biệt hoa thường, hoặc <code>null</code>.</li>
<li><code>countByBalance(min)</code>: số sim có số dư ≥ min.</li>
<li><code>removeByOwner(owner)</code>: xoá mọi sim của chủ này, trả số sim đã xoá.</li>
<li><code>sortByBalanceDesc()</code>: số dư giảm dần, số dư bằng nhau thì theo id tăng dần.</li>
</ul>
<details><summary>Lời giải (chạy thật trên JDK 8)</summary>
<pre class="trich"><code class="language-java">class SimCard {
    private String id;
    private String owner;
    private double balance;

    public SimCard() {
        this("", "", 0.0);
    }

    public SimCard(String id, String owner, double balance) {
        this.id = id;
        this.owner = owner;
        this.balance = balance;
    }

    public String getId() { return id; }
    public String getOwner() { return owner; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    @Override
    public String toString() {
        return id + "," + owner + "," + balance;
    }
}</code></pre>
<pre class="trich"><code class="language-java">class SimCardList extends ArrayList&lt;SimCard&gt; {

    // SimCard có id này (không phân biệt hoa thường), hoặc null
    public SimCard getById(String id) {
        for (SimCard s : this) {                       // "this" CHÍNH LÀ list
            if (s.getId().equalsIgnoreCase(id)) return s;
        }
        return null;
    }

    // bao nhiêu sim có số dư &gt;= min
    public int countByBalance(double min) {
        int count = 0;
        for (SimCard s : this) {
            if (s.getBalance() &gt;= min) count++;
        }
        return count;
    }

    // xoá mọi sim của chủ này; trả số sim đã xoá
    public int removeByOwner(String owner) {
        int before = size();
        Iterator&lt;SimCard&gt; it = iterator();
        while (it.hasNext()) {
            if (it.next().getOwner().equals(owner)) it.remove();
        }
        return before - size();
    }

    // số dư giảm dần, rồi id tăng dần
    public void sortByBalanceDesc() {
        Collections.sort(this, new Comparator&lt;SimCard&gt;() {
            @Override
            public int compare(SimCard a, SimCard b) {
                int c = Double.compare(b.getBalance(), a.getBalance());
                return c != 0 ? c : a.getId().compareTo(b.getId());
            }
        });
    }
}</code></pre>
<pre class="trich"><code class="language-java">SimCardList list = new SimCardList();
list.add(new SimCard("S03", "Lan", 50000.0));
list.add(new SimCard("S01", "Minh", 120000.0));
list.add(new SimCard("S04", "Lan", 0.0));
list.add(new SimCard("S02", "Hoa", 120000.0));
list.add(new SimCard("S05", "Tuan", 75500.5));
System.out.println("size() inherited from ArrayList: " + list.size());
System.out.println("getById(\\"s02\\") -&gt; " + list.getById("s02"));
System.out.println("getById(\\"S99\\") -&gt; " + list.getById("S99"));
System.out.println("countByBalance(75000) -&gt; " + list.countByBalance(75000));
list.sortByBalanceDesc();
System.out.println("sorted:");
for (SimCard s : list) System.out.println("  " + s);
System.out.println("removeByOwner(\\"Lan\\") -&gt; " + list.removeByOwner("Lan") + ", left " + list);</code></pre>
<div class="out">size() inherited from ArrayList: 5<br>
getById("s02") -&gt; S02,Hoa,120000.0<br>
getById("S99") -&gt; null<br>
countByBalance(75000) -&gt; 3<br>
sorted:<br>
&nbsp;&nbsp;S01,Minh,120000.0<br>
&nbsp;&nbsp;S02,Hoa,120000.0<br>
&nbsp;&nbsp;S05,Tuan,75500.5<br>
&nbsp;&nbsp;S03,Lan,50000.0<br>
&nbsp;&nbsp;S04,Lan,0.0<br>
removeByOwner("Lan") -&gt; 2, left [S01,Minh,120000.0, S02,Hoa,120000.0, S05,Tuan,75500.5]</div>
<p>Ý của câu này là kế thừa (Chương 4) áp vào collection: <code>SimCardList</code> <em>là</em> một <code>ArrayList</code>, nên <code>this</code> chính là list — <code>for (SimCard s : this)</code>, <code>iterator()</code>, <code>size()</code>, <code>Collections.sort(this, …)</code> đều chạy mà không cần trường nào. <code>removeByOwner</code> đếm bằng cách so <code>size()</code> trước và sau, và xoá qua Iterator; trên JDK 8 <code>removeIf(s -&gt; s.getOwner().equals(owner))</code> là cách viết một dòng cũng đúng.</p>
</details>
<div class="pitfall">Hai lỗi kinh điển: thêm một trường <code>private List&lt;SimCard&gt; list = new ArrayList&lt;&gt;()</code> vào một lớp vốn đã <em>extends</em> ArrayList — Main của đề thêm sim vào <code>this</code>, còn các phương thức của bạn tìm trong trường rỗng, mọi test trả 0/null; và so id bằng <code>==</code> — Main tạo id từ dữ liệu bàn phím, nên <code>==</code> là false kể cả với "S02" và "S02". Hãy dùng <code>equals</code>/<code>equalsIgnoreCase</code>.</div>`),
    bi(`<h3>🧪 Exercise 3 — A 10-mark Q1: the shop's stock in a Map (~60 min)</h3>
<p>(10 marks, PE3/PE5/PE9 style) Class <code>Item</code> (code, name, category, qty, price; <code>getValue()</code> = qty × price; <code>toString()</code> = <code>code,name,category,qty,price</code> with one decimal). Class <code>Q1</code> reads T, then T commands:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0ce5399eb1e306c088ca87a3ead5615a03cc3eb0.svg" alt="Exercise 3: one Map holds the stock; each command builds the collection it needs" loading="lazy" /><p class="chu-thich">🧩 Exercise 3: one Map holds the stock; each command builds the collection it needs</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — the stock program: a Map from code to Item, and the collections each command builds
class Item {
  - code : String
  - name : String
  - category : String
  - qty : int
  - price : double
  + getValue() : double
  + toString() : String
}
class PeQ1Kho {
  - {static} stock : Map&lt;String, Item&gt;
  + {static} solve(line : String) : void
  + {static} main(args : String[]) : void
}
PeQ1Kho o-- "0..*" Item : stock (TreeMap, key = code)
note right of PeQ1Kho
  add, sell: containsKey / get / put
  print: stock.values() (sorted by code)
  top k: copy to an ArrayList + a Comparator
  category: TreeMap&lt;String, Integer&gt; of counts
  clean: stock.values().iterator() + remove()
end note
@enduml</code></pre></details>
<ul>
<li><code>add,code,name,category,qty,price</code> → "Added code", or "Duplicate code: code".</li>
<li><code>sell,code,n</code> → "Sold n code", "Not enough code (q left)", or "Not found".</li>
<li><code>print</code> → <code>---Print---</code> then every item sorted by code (or "Empty").</li>
<li><code>top,k</code> → <code>---Top k---</code> then the k items with the largest value (value descending, then code), "code value"; k may exceed the number of items.</li>
<li><code>category</code> → <code>---Category---</code> then "category: count", categories sorted.</li>
<li><code>clean</code> → remove the items with qty 0, print "* Removed r sold-out item(s)".</li>
</ul>
<details><summary>Solution (run for real on JDK 8, with the input below)</summary>
<pre class="trich"><code class="language-java">class Item {
    private String code;
    private String name;
    private String category;
    private int qty;
    private double price;

    public Item(String code, String name, String category, int qty, double price) {
        this.code = code;
        this.name = name;
        this.category = category;
        this.qty = qty;
        this.price = price;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    public double getPrice() { return price; }
    public double getValue() { return qty * price; }

    @Override
    public String toString() {
        return String.format("%s,%s,%s,%d,%.1f", code, name, category, qty, price);
    }
}</code></pre>
<pre class="trich"><code class="language-java">// code -&gt; item; a TreeMap so that "print" is sorted by code with no extra work
static Map&lt;String, Item&gt; stock = new TreeMap&lt;String, Item&gt;();

static void solve(String line) {
    String[] p = line.split(",");
    String cmd = p[0].trim().toLowerCase();
    if (cmd.equals("add")) {
        String code = p[1].trim();
        if (stock.containsKey(code)) {
            System.out.println("Duplicate code: " + code);
        } else {
            stock.put(code, new Item(code, p[2].trim(), p[3].trim(),
                    Integer.parseInt(p[4].trim()), Double.parseDouble(p[5].trim())));
            System.out.println("Added " + code);
        }
    } else if (cmd.equals("sell")) {
        Item it = stock.get(p[1].trim());
        int n = Integer.parseInt(p[2].trim());
        if (it == null) System.out.println("Not found");
        else if (n &gt; it.getQty()) System.out.println("Not enough " + it.getCode() + " (" + it.getQty() + " left)");
        else { it.setQty(it.getQty() - n); System.out.println("Sold " + n + " " + it.getCode()); }
    } else if (cmd.equals("print")) {
        System.out.println("---Print---");
        if (stock.isEmpty()) System.out.println("Empty");
        for (Item it : stock.values()) System.out.println(it);
    } else if (cmd.equals("top")) {
        int k = Integer.parseInt(p[1].trim());
        List&lt;Item&gt; all = new ArrayList&lt;Item&gt;(stock.values());      // copy: sorting must not touch the map
        Collections.sort(all, new Comparator&lt;Item&gt;() {
            @Override
            public int compare(Item a, Item b) {
                int c = Double.compare(b.getValue(), a.getValue());   // value descending
                return c != 0 ? c : a.getCode().compareTo(b.getCode());
            }
        });
        System.out.println("---Top " + k + "---");
        for (int i = 0; i &lt; k &amp;&amp; i &lt; all.size(); i++) {             // k may exceed the size
            System.out.printf("%s %.1f%n", all.get(i).getCode(), all.get(i).getValue());
        }
    } else if (cmd.equals("category")) {
        Map&lt;String, Integer&gt; count = new TreeMap&lt;String, Integer&gt;();
        for (Item it : stock.values()) {
            Integer old = count.get(it.getCategory());
            count.put(it.getCategory(), old == null ? 1 : old + 1);
        }
        System.out.println("---Category---");
        for (Map.Entry&lt;String, Integer&gt; e : count.entrySet()) System.out.println(e.getKey() + ": " + e.getValue());
    } else if (cmd.equals("clean")) {
        int removed = 0;
        Iterator&lt;Item&gt; it = stock.values().iterator();              // removing through a VIEW removes from the map
        while (it.hasNext()) {
            if (it.next().getQty() == 0) { it.remove(); removed++; }
        }
        System.out.println("* Removed " + removed + " sold-out item(s)");
    } else {
        System.out.println("Unknown command: " + cmd);
    }
}

public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);       // ONE Scanner for the whole program
    int t = Integer.parseInt(sc.nextLine().trim());
    for (int i = 0; i &lt; t; i++) solve(sc.nextLine());
}</code></pre>
<p>Input (in the real paper this is <code>input.txt</code>, read by the FIXED part of the skeleton):</p>
<pre><code class="language-plaintext">13
add,P03,Pen,Stationery,100,1.5
add,N01,Notebook,Stationery,40,3.0
add,C07,Cable,Electronics,10,12.0
add,P03,Pencil,Stationery,5,0.5
add,M02,Mouse,Electronics,3,15.0
sell,M02,3
sell,C07,11
print
top,2
category
clean
print
top,9</code></pre>
<div class="out">Added P03<br>
Added N01<br>
Added C07<br>
Duplicate code: P03<br>
Added M02<br>
Sold 3 M02<br>
Not enough C07 (10 left)<br>
---Print---<br>
C07,Cable,Electronics,10,12.0<br>
M02,Mouse,Electronics,0,15.0<br>
N01,Notebook,Stationery,40,3.0<br>
P03,Pen,Stationery,100,1.5<br>
---Top 2---<br>
P03 150.0<br>
C07 120.0<br>
---Category---<br>
Electronics: 2<br>
Stationery: 2<br>
* Removed 1 sold-out item(s)<br>
---Print---<br>
C07,Cable,Electronics,10,12.0<br>
N01,Notebook,Stationery,40,3.0<br>
P03,Pen,Stationery,100,1.5<br>
---Top 9---<br>
P03 150.0<br>
C07 120.0<br>
N01 120.0</div>
<p>Every collection here is chosen by the rule the command needs. <strong>One map, code → item</strong>: "duplicate code" is <code>containsKey</code>, "find by code" is <code>get</code> — no loops. A <code>TreeMap</code> makes <code>print</code> sorted for free. <code>top</code> must not reorder the store, so it copies <code>values()</code> into an <code>ArrayList</code> and sorts the copy with a two-level <code>Comparator</code> (C07 and N01 both have value 120.0 → code decides). <code>category</code> is the counting pattern of lesson 8.B, slide 25. <code>clean</code> removes through <code>stock.values().iterator()</code> — removing through a view removes from the map itself.</p>
</details>
<div class="pitfall">Lost marks in Q1 programs: a <code>HashMap</code> for the store, so <code>print</code> comes out in hash order and fails the expected output; <code>for (int i = 0; i &lt; k; i++)</code> without <code>&amp;&amp; i &lt; all.size()</code> — <code>top,9</code> on three items throws <code>IndexOutOfBoundsException</code>; sorting the money values with <code>(int) (b - a)</code> (lesson 8.B, slide 20).</div>`,
    `<h3>🧪 Bài 3 — Câu Q1 10 điểm: kho hàng của cửa hàng trong một Map (~60 phút)</h3>
<p>(10 điểm, kiểu PE3/PE5/PE9) Lớp <code>Item</code> (code, name, category, qty, price; <code>getValue()</code> = qty × price; <code>toString()</code> = <code>code,name,category,qty,price</code> với một chữ số thập phân). Lớp <code>Q1</code> đọc T, rồi T lệnh:</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/0ce5399eb1e306c088ca87a3ead5615a03cc3eb0.svg" alt="Bài 3: một Map giữ kho; mỗi lệnh dựng collection mà nó cần" loading="lazy" /><p class="chu-thich">🧩 Bài 3: một Map giữ kho; mỗi lệnh dựng collection mà nó cần</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 3 — the stock program: a Map from code to Item, and the collections each command builds
class Item {
  - code : String
  - name : String
  - category : String
  - qty : int
  - price : double
  + getValue() : double
  + toString() : String
}
class PeQ1Kho {
  - {static} stock : Map&lt;String, Item&gt;
  + {static} solve(line : String) : void
  + {static} main(args : String[]) : void
}
PeQ1Kho o-- "0..*" Item : stock (TreeMap, key = code)
note right of PeQ1Kho
  add, sell: containsKey / get / put
  print: stock.values() (sorted by code)
  top k: copy to an ArrayList + a Comparator
  category: TreeMap&lt;String, Integer&gt; of counts
  clean: stock.values().iterator() + remove()
end note
@enduml</code></pre></details>
<ul>
<li><code>add,code,name,category,qty,price</code> → "Added code", hoặc "Duplicate code: code".</li>
<li><code>sell,code,n</code> → "Sold n code", "Not enough code (q left)", hoặc "Not found".</li>
<li><code>print</code> → <code>---Print---</code> rồi mọi mặt hàng sắp theo mã (hoặc "Empty").</li>
<li><code>top,k</code> → <code>---Top k---</code> rồi k mặt hàng có giá trị lớn nhất (giá trị giảm dần, rồi theo mã), dạng "code value"; k có thể lớn hơn số mặt hàng.</li>
<li><code>category</code> → <code>---Category---</code> rồi "category: count", nhóm hàng có sắp xếp.</li>
<li><code>clean</code> → xoá các mặt hàng có qty 0, in "* Removed r sold-out item(s)".</li>
</ul>
<details><summary>Lời giải (chạy thật trên JDK 8, với dữ liệu bên dưới)</summary>
<pre class="trich"><code class="language-java">class Item {
    private String code;
    private String name;
    private String category;
    private int qty;
    private double price;

    public Item(String code, String name, String category, int qty, double price) {
        this.code = code;
        this.name = name;
        this.category = category;
        this.qty = qty;
        this.price = price;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getQty() { return qty; }
    public void setQty(int qty) { this.qty = qty; }
    public double getPrice() { return price; }
    public double getValue() { return qty * price; }

    @Override
    public String toString() {
        return String.format("%s,%s,%s,%d,%.1f", code, name, category, qty, price);
    }
}</code></pre>
<pre class="trich"><code class="language-java">// mã -&gt; hàng; dùng TreeMap để lệnh "print" tự sắp theo mã
static Map&lt;String, Item&gt; stock = new TreeMap&lt;String, Item&gt;();

static void solve(String line) {
    String[] p = line.split(",");
    String cmd = p[0].trim().toLowerCase();
    if (cmd.equals("add")) {
        String code = p[1].trim();
        if (stock.containsKey(code)) {
            System.out.println("Duplicate code: " + code);
        } else {
            stock.put(code, new Item(code, p[2].trim(), p[3].trim(),
                    Integer.parseInt(p[4].trim()), Double.parseDouble(p[5].trim())));
            System.out.println("Added " + code);
        }
    } else if (cmd.equals("sell")) {
        Item it = stock.get(p[1].trim());
        int n = Integer.parseInt(p[2].trim());
        if (it == null) System.out.println("Not found");
        else if (n &gt; it.getQty()) System.out.println("Not enough " + it.getCode() + " (" + it.getQty() + " left)");
        else { it.setQty(it.getQty() - n); System.out.println("Sold " + n + " " + it.getCode()); }
    } else if (cmd.equals("print")) {
        System.out.println("---Print---");
        if (stock.isEmpty()) System.out.println("Empty");
        for (Item it : stock.values()) System.out.println(it);
    } else if (cmd.equals("top")) {
        int k = Integer.parseInt(p[1].trim());
        List&lt;Item&gt; all = new ArrayList&lt;Item&gt;(stock.values());      // chép ra: sắp xếp không được đụng vào map
        Collections.sort(all, new Comparator&lt;Item&gt;() {
            @Override
            public int compare(Item a, Item b) {
                int c = Double.compare(b.getValue(), a.getValue());   // giá trị giảm dần
                return c != 0 ? c : a.getCode().compareTo(b.getCode());
            }
        });
        System.out.println("---Top " + k + "---");
        for (int i = 0; i &lt; k &amp;&amp; i &lt; all.size(); i++) {             // k có thể lớn hơn size
            System.out.printf("%s %.1f%n", all.get(i).getCode(), all.get(i).getValue());
        }
    } else if (cmd.equals("category")) {
        Map&lt;String, Integer&gt; count = new TreeMap&lt;String, Integer&gt;();
        for (Item it : stock.values()) {
            Integer old = count.get(it.getCategory());
            count.put(it.getCategory(), old == null ? 1 : old + 1);
        }
        System.out.println("---Category---");
        for (Map.Entry&lt;String, Integer&gt; e : count.entrySet()) System.out.println(e.getKey() + ": " + e.getValue());
    } else if (cmd.equals("clean")) {
        int removed = 0;
        Iterator&lt;Item&gt; it = stock.values().iterator();              // xoá qua KHUNG NHÌN là xoá khỏi map
        while (it.hasNext()) {
            if (it.next().getQty() == 0) { it.remove(); removed++; }
        }
        System.out.println("* Removed " + removed + " sold-out item(s)");
    } else {
        System.out.println("Unknown command: " + cmd);
    }
}

public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);       // MỘT Scanner cho cả chương trình
    int t = Integer.parseInt(sc.nextLine().trim());
    for (int i = 0; i &lt; t; i++) solve(sc.nextLine());
}</code></pre>
<p>Dữ liệu vào (trong đề thật đây là <code>input.txt</code>, do phần FIXED của khung đọc):</p>
<pre><code class="language-plaintext">13
add,P03,Pen,Stationery,100,1.5
add,N01,Notebook,Stationery,40,3.0
add,C07,Cable,Electronics,10,12.0
add,P03,Pencil,Stationery,5,0.5
add,M02,Mouse,Electronics,3,15.0
sell,M02,3
sell,C07,11
print
top,2
category
clean
print
top,9</code></pre>
<div class="out">Added P03<br>
Added N01<br>
Added C07<br>
Duplicate code: P03<br>
Added M02<br>
Sold 3 M02<br>
Not enough C07 (10 left)<br>
---Print---<br>
C07,Cable,Electronics,10,12.0<br>
M02,Mouse,Electronics,0,15.0<br>
N01,Notebook,Stationery,40,3.0<br>
P03,Pen,Stationery,100,1.5<br>
---Top 2---<br>
P03 150.0<br>
C07 120.0<br>
---Category---<br>
Electronics: 2<br>
Stationery: 2<br>
* Removed 1 sold-out item(s)<br>
---Print---<br>
C07,Cable,Electronics,10,12.0<br>
N01,Notebook,Stationery,40,3.0<br>
P03,Pen,Stationery,100,1.5<br>
---Top 9---<br>
P03 150.0<br>
C07 120.0<br>
N01 120.0</div>
<p>Mỗi collection ở đây được chọn theo đúng luật mà lệnh cần. <strong>Một map, mã → mặt hàng</strong>: "trùng mã" là <code>containsKey</code>, "tìm theo mã" là <code>get</code> — không cần vòng lặp. <code>TreeMap</code> làm <code>print</code> tự có thứ tự. <code>top</code> không được đảo thứ tự kho, nên nó chép <code>values()</code> sang một <code>ArrayList</code> rồi sắp bản sao bằng một <code>Comparator</code> hai tầng (C07 và N01 cùng giá trị 120.0 → mã quyết định). <code>category</code> là mẫu đếm của bài 8.B, slide 25. <code>clean</code> xoá qua <code>stock.values().iterator()</code> — xoá qua một khung nhìn là xoá khỏi chính map.</p>
</details>
<div class="pitfall">Chỗ mất điểm trong chương trình Q1: dùng <code>HashMap</code> làm kho, nên <code>print</code> ra theo thứ tự băm và trượt output mong đợi; <code>for (int i = 0; i &lt; k; i++)</code> thiếu <code>&amp;&amp; i &lt; all.size()</code> — <code>top,9</code> trên ba mặt hàng ném <code>IndexOutOfBoundsException</code>; sắp tiền bằng <code>(int) (b - a)</code> (bài 8.B, slide 20).</div>`),
    bi(`<h3>🧪 Exercise 4 — LAB211 style: the FU material's student manager (~45 min)</h3>
<p>The FU offline material (part "Collection", demonstration 3) designs this program and leaves it to you: keep students (code, name, mark) in an <code>ArrayList</code>; a menu lets the user 1-add, 2-search by code, 3-update name and mark, 4-remove, 5-list all, 6-quit. Constraints: code has the form "S000" (S + 3 digits), name not blank, mark 0..10; a code must not be added twice. Invalid input is asked again.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/96163e1eccfa1861ec37a0bd42c34ee8fa92656f.svg" alt="Exercise 4: the class design of the FU material — every value is read through Inputter" loading="lazy" /><p class="chu-thich">🧩 Exercise 4: the class design of the FU material — every value is read through Inputter</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — the FU offline material's class design: Inputter, Student, StudentList, the program
class Inputter {
  - {static} SC : Scanner
  + {static} inputPattern(prompt : String, regex : String, error : String) : String
  + {static} inputNonBlank(prompt : String) : String
  + {static} inputMark(prompt : String) : double
  + {static} inputChoice(min : int, max : int) : int
}
class Student {
  - code : String
  - name : String
  - mark : double
  + toString() : String
}
class StudentList {
  - list : List&lt;Student&gt;
  + search(code : String) : Student
  + add() : void
  + find() : void
  + update() : void
  + remove() : void
  + printAll() : void
}
class QuanLySinhVien {
  + {static} main(args : String[]) : void
}
QuanLySinhVien --&gt; StudentList : menu 1..6
StudentList o-- "0..*" Student
StudentList ..&gt; Inputter : reads every value through it
note bottom of Inputter : one static Scanner for the whole program
@enduml</code></pre></details>
<details><summary>Solution (run for real on JDK 8, input piped in)</summary>
<pre class="trich"><code class="language-java">class Inputter {
    private static final Scanner SC = new Scanner(System.in);   // ONE Scanner, shared by every method

    static String inputPattern(String prompt, String regex, String error) {
        while (true) {
            System.out.print(prompt);
            String s = SC.nextLine().trim().toUpperCase();
            if (s.matches(regex)) return s;
            System.out.println(error);
        }
    }
    static String inputNonBlank(String prompt) {
        while (true) {
            System.out.print(prompt);
            String s = SC.nextLine().trim();
            if (!s.isEmpty()) return s;
            System.out.println("Name can not be blank.");
        }
    }
    static double inputMark(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                double m = Double.parseDouble(SC.nextLine().trim());
                if (m &gt;= 0 &amp;&amp; m &lt;= 10) return m;
            } catch (NumberFormatException e) {
                // fall through to the message
            }
            System.out.println("Mark must be a number in 0..10.");
        }
    }
    static int inputChoice(int min, int max) {
        while (true) {
            System.out.print("Choose " + min + ".." + max + ": ");
            try {
                int c = Integer.parseInt(SC.nextLine().trim());
                if (c &gt;= min &amp;&amp; c &lt;= max) return c;
            } catch (NumberFormatException e) {
                // fall through
            }
            System.out.println("Invalid choice.");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Student {
    private String code;
    private String name;
    private double mark;

    Student(String code, String name, double mark) { this.code = code; this.name = name; this.mark = mark; }
    String getCode() { return code; }
    void setName(String name) { this.name = name; }
    void setMark(double mark) { this.mark = mark; }
    @Override
    public String toString() { return String.format("%-5s %-15s %5.1f", code, name, mark); }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentList {
    private final List&lt;Student&gt; list = new ArrayList&lt;Student&gt;();

    Student search(String code) {
        for (Student s : list) if (s.getCode().equals(code)) return s;
        return null;
    }
    void add() {
        String code = Inputter.inputPattern("Code (S000): ", "S\\\\d{3}", "Code must be S followed by 3 digits.");
        if (search(code) != null) { System.out.println("Code " + code + " already exists."); return; }
        String name = Inputter.inputNonBlank("Name: ");
        double mark = Inputter.inputMark("Mark: ");
        list.add(new Student(code, name, mark));
        System.out.println("Added.");
    }
    void find() {
        Student s = search(Inputter.inputPattern("Code to search: ", "S\\\\d{3}", "Code must be S followed by 3 digits."));
        System.out.println(s == null ? "Not found." : s);
    }
    void update() {
        Student s = search(Inputter.inputPattern("Code to update: ", "S\\\\d{3}", "Code must be S followed by 3 digits."));
        if (s == null) { System.out.println("Not found."); return; }
        s.setName(Inputter.inputNonBlank("New name: "));
        s.setMark(Inputter.inputMark("New mark: "));
        System.out.println("Updated.");
    }
    void remove() {
        Student s = search(Inputter.inputPattern("Code to remove: ", "S\\\\d{3}", "Code must be S followed by 3 digits."));
        if (s == null) { System.out.println("Not found."); return; }
        list.remove(s);                                  // remove(Object): this exact object
        System.out.println("Removed.");
    }
    void printAll() {
        if (list.isEmpty()) { System.out.println("Empty list."); return; }
        List&lt;Student&gt; copy = new ArrayList&lt;Student&gt;(list);
        Collections.sort(copy, new Comparator&lt;Student&gt;() {
            @Override
            public int compare(Student a, Student b) { return a.getCode().compareTo(b.getCode()); }
        });
        for (Student s : copy) System.out.println(s);
    }
}</code></pre>
<pre class="trich"><code class="language-java">public class QuanLySinhVien {
    public static void main(String[] args) {
        StudentList students = new StudentList();
        int choice;
        do {
            System.out.println("Student managing Program");
            System.out.println("1-Add new student  2-Search  3-Update name and mark  4-Remove  5-List all  6-Quit");
            choice = Inputter.inputChoice(1, 6);
            switch (choice) {
                case 1: students.add(); break;
                case 2: students.find(); break;
                case 3: students.update(); break;
                case 4: students.remove(); break;
                case 5: students.printAll(); break;
                default: System.out.println("Bye.");
            }
        } while (choice != 6);
    }
}</code></pre>
<p>The test script (one value per line, an empty line is the blank name): add with a bad code "S12", then "s002" (accepted, upper-cased), a mark 11 refused; add S001 with a blank name and the mark "abc" refused; add S002 again (refused); search S002 and S009; list; update S001; remove S002; list; choice 7 refused; quit.</p>
<div class="out">Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code (S000): Code must be S followed by 3 digits.<br>
Code (S000): Name: Mark: Mark must be a number in 0..10.<br>
Mark: Added.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code (S000): Name: Name can not be blank.<br>
Name: Mark: Mark must be a number in 0..10.<br>
Mark: Added.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code (S000): Code S002 already exists.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to search: S002 &nbsp;Tran Lan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to search: Not found.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: S001 &nbsp;Le Minh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.0<br>
S002 &nbsp;Tran Lan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to update: New name: New mark: Updated.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to remove: Removed.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: S001 &nbsp;Le Van Minh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9.0<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Invalid choice.<br>
Choose 1..6: Bye.</div>
<p>Prompts and answers run together because the input is piped, not typed — this is what a grader or a LAB211 test script sees. Points to copy: every reading goes through <strong>one</strong> static <code>Scanner</code> and always with <code>nextLine()</code> (then <code>parseInt</code>/<code>parseDouble</code>), so there is no leftover end-of-line; validation loops until the value is valid; <code>search</code> is written once and reused by add/find/update/remove; <code>printAll</code> sorts a <em>copy</em>.</p>
</details>
<div class="pitfall">Measured in Chapter 2 (slide 15) and Chapter 5 (exercise 3): a <code>new Scanner(System.in)</code> inside each input method works when you type and throws <code>NoSuchElementException</code> when the input is piped — the first Scanner buffers the lines the second one needed. One Scanner per program.</div>
<div class="callout">🧭 <strong>Go further — LAB211</strong>: this is the skeleton of nearly every LAB211 assignment (J1.S.P0071 included): Inputter/validation, a model class, a manager class owning an <code>ArrayList</code>, a menu loop. Next step there: save the list to a file (Chapter 9).</div>`,
    `<h3>🧪 Bài 4 — Kiểu LAB211: chương trình quản lý sinh viên của học liệu FU (~45 phút)</h3>
<p>Học liệu offline FU (phần "Collection", demo 3) thiết kế chương trình này và để bạn viết: giữ sinh viên (code, name, mark) trong một <code>ArrayList</code>; menu cho người dùng 1-thêm, 2-tìm theo mã, 3-sửa tên và điểm, 4-xoá, 5-liệt kê, 6-thoát. Ràng buộc: mã có dạng "S000" (S + 3 chữ số), tên không rỗng, điểm 0..10; một mã không được thêm hai lần. Nhập sai thì hỏi lại.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/96163e1eccfa1861ec37a0bd42c34ee8fa92656f.svg" alt="Bài 4: thiết kế lớp của học liệu FU — mọi giá trị được đọc qua Inputter" loading="lazy" /><p class="chu-thich">🧩 Bài 4: thiết kế lớp của học liệu FU — mọi giá trị được đọc qua Inputter</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 4 — the FU offline material's class design: Inputter, Student, StudentList, the program
class Inputter {
  - {static} SC : Scanner
  + {static} inputPattern(prompt : String, regex : String, error : String) : String
  + {static} inputNonBlank(prompt : String) : String
  + {static} inputMark(prompt : String) : double
  + {static} inputChoice(min : int, max : int) : int
}
class Student {
  - code : String
  - name : String
  - mark : double
  + toString() : String
}
class StudentList {
  - list : List&lt;Student&gt;
  + search(code : String) : Student
  + add() : void
  + find() : void
  + update() : void
  + remove() : void
  + printAll() : void
}
class QuanLySinhVien {
  + {static} main(args : String[]) : void
}
QuanLySinhVien --&gt; StudentList : menu 1..6
StudentList o-- "0..*" Student
StudentList ..&gt; Inputter : reads every value through it
note bottom of Inputter : one static Scanner for the whole program
@enduml</code></pre></details>
<details><summary>Lời giải (chạy thật trên JDK 8, dữ liệu đổ vào qua đường ống)</summary>
<pre class="trich"><code class="language-java">class Inputter {
    private static final Scanner SC = new Scanner(System.in);   // MỘT Scanner, mọi phương thức dùng chung

    static String inputPattern(String prompt, String regex, String error) {
        while (true) {
            System.out.print(prompt);
            String s = SC.nextLine().trim().toUpperCase();
            if (s.matches(regex)) return s;
            System.out.println(error);
        }
    }
    static String inputNonBlank(String prompt) {
        while (true) {
            System.out.print(prompt);
            String s = SC.nextLine().trim();
            if (!s.isEmpty()) return s;
            System.out.println("Name can not be blank.");
        }
    }
    static double inputMark(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                double m = Double.parseDouble(SC.nextLine().trim());
                if (m &gt;= 0 &amp;&amp; m &lt;= 10) return m;
            } catch (NumberFormatException e) {
                // rơi xuống câu báo lỗi
            }
            System.out.println("Mark must be a number in 0..10.");
        }
    }
    static int inputChoice(int min, int max) {
        while (true) {
            System.out.print("Choose " + min + ".." + max + ": ");
            try {
                int c = Integer.parseInt(SC.nextLine().trim());
                if (c &gt;= min &amp;&amp; c &lt;= max) return c;
            } catch (NumberFormatException e) {
                // rơi xuống
            }
            System.out.println("Invalid choice.");
        }
    }
}</code></pre>
<pre class="trich"><code class="language-java">class Student {
    private String code;
    private String name;
    private double mark;

    Student(String code, String name, double mark) { this.code = code; this.name = name; this.mark = mark; }
    String getCode() { return code; }
    void setName(String name) { this.name = name; }
    void setMark(double mark) { this.mark = mark; }
    @Override
    public String toString() { return String.format("%-5s %-15s %5.1f", code, name, mark); }
}</code></pre>
<pre class="trich"><code class="language-java">class StudentList {
    private final List&lt;Student&gt; list = new ArrayList&lt;Student&gt;();

    Student search(String code) {
        for (Student s : list) if (s.getCode().equals(code)) return s;
        return null;
    }
    void add() {
        String code = Inputter.inputPattern("Code (S000): ", "S\\\\d{3}", "Code must be S followed by 3 digits.");
        if (search(code) != null) { System.out.println("Code " + code + " already exists."); return; }
        String name = Inputter.inputNonBlank("Name: ");
        double mark = Inputter.inputMark("Mark: ");
        list.add(new Student(code, name, mark));
        System.out.println("Added.");
    }
    void find() {
        Student s = search(Inputter.inputPattern("Code to search: ", "S\\\\d{3}", "Code must be S followed by 3 digits."));
        System.out.println(s == null ? "Not found." : s);
    }
    void update() {
        Student s = search(Inputter.inputPattern("Code to update: ", "S\\\\d{3}", "Code must be S followed by 3 digits."));
        if (s == null) { System.out.println("Not found."); return; }
        s.setName(Inputter.inputNonBlank("New name: "));
        s.setMark(Inputter.inputMark("New mark: "));
        System.out.println("Updated.");
    }
    void remove() {
        Student s = search(Inputter.inputPattern("Code to remove: ", "S\\\\d{3}", "Code must be S followed by 3 digits."));
        if (s == null) { System.out.println("Not found."); return; }
        list.remove(s);                                  // remove(Object): đúng đối tượng này
        System.out.println("Removed.");
    }
    void printAll() {
        if (list.isEmpty()) { System.out.println("Empty list."); return; }
        List&lt;Student&gt; copy = new ArrayList&lt;Student&gt;(list);
        Collections.sort(copy, new Comparator&lt;Student&gt;() {
            @Override
            public int compare(Student a, Student b) { return a.getCode().compareTo(b.getCode()); }
        });
        for (Student s : copy) System.out.println(s);
    }
}</code></pre>
<pre class="trich"><code class="language-java">public class QuanLySinhVien {
    public static void main(String[] args) {
        StudentList students = new StudentList();
        int choice;
        do {
            System.out.println("Student managing Program");
            System.out.println("1-Add new student  2-Search  3-Update name and mark  4-Remove  5-List all  6-Quit");
            choice = Inputter.inputChoice(1, 6);
            switch (choice) {
                case 1: students.add(); break;
                case 2: students.find(); break;
                case 3: students.update(); break;
                case 4: students.remove(); break;
                case 5: students.printAll(); break;
                default: System.out.println("Bye.");
            }
        } while (choice != 6);
    }
}</code></pre>
<p>Kịch bản kiểm (mỗi dòng một giá trị, dòng trống là tên rỗng): thêm với mã sai "S12", rồi "s002" (được nhận, đổi thành chữ hoa), điểm 11 bị từ chối; thêm S001 với tên rỗng và điểm "abc" bị từ chối; thêm lại S002 (bị từ chối); tìm S002 và S009; liệt kê; sửa S001; xoá S002; liệt kê; chọn 7 bị từ chối; thoát.</p>
<div class="out">Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code (S000): Code must be S followed by 3 digits.<br>
Code (S000): Name: Mark: Mark must be a number in 0..10.<br>
Mark: Added.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code (S000): Name: Name can not be blank.<br>
Name: Mark: Mark must be a number in 0..10.<br>
Mark: Added.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code (S000): Code S002 already exists.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to search: S002 &nbsp;Tran Lan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to search: Not found.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: S001 &nbsp;Le Minh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.0<br>
S002 &nbsp;Tran Lan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.5<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to update: New name: New mark: Updated.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Code to remove: Removed.<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: S001 &nbsp;Le Van Minh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9.0<br>
Student managing Program<br>
1-Add new student &nbsp;2-Search &nbsp;3-Update name and mark &nbsp;4-Remove &nbsp;5-List all &nbsp;6-Quit<br>
Choose 1..6: Invalid choice.<br>
Choose 1..6: Bye.</div>
<p>Lời nhắc và câu trả lời dính liền vì dữ liệu được đổ vào, không phải gõ — đó là thứ máy chấm hay kịch bản kiểm của LAB211 nhìn thấy. Những điểm nên chép: mọi lần đọc đều đi qua <strong>một</strong> <code>Scanner</code> static và luôn bằng <code>nextLine()</code> (rồi <code>parseInt</code>/<code>parseDouble</code>), nên không bao giờ còn sót ký tự xuống dòng; vòng kiểm tra lặp tới khi giá trị hợp lệ; <code>search</code> viết một lần, add/find/update/remove dùng lại; <code>printAll</code> sắp một <em>bản sao</em>.</p>
</details>
<div class="pitfall">Đã đo ở Chương 2 (slide 15) và Chương 5 (bài 3): <code>new Scanner(System.in)</code> trong mỗi phương thức nhập chạy được khi bạn gõ tay và ném <code>NoSuchElementException</code> khi dữ liệu được đổ vào — Scanner đầu tiên đã đệm mất các dòng mà Scanner thứ hai cần. Mỗi chương trình một Scanner.</div>
<div class="callout">🧭 <strong>Đi tiếp — LAB211</strong>: đây là bộ khung của gần như mọi bài LAB211 (kể cả J1.S.P0071): Inputter/kiểm tra dữ liệu, một lớp mô hình, một lớp quản lý giữ <code>ArrayList</code>, một vòng menu. Bước tiếp ở đó: lưu list ra file (Chương 9).</div>`),
    bi(`<h3>🧪 Exercise 5 — Bug hunt: equals without hashCode (~20 min)</h3>
<p>A shop counts its products by code. <code>ProductBug</code> says two products with the same code are equal — and yet the HashSet keeps both "P1"s and the HashMap cannot find "P1" again. Predict the four numbers of the first line, then fix the class.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/04915584be06c403862990b329c8e80cb4e74e46.svg" alt="Exercise 5: two products with code P1, with and without a matching hashCode" loading="lazy" /><p class="chu-thich">🧩 Exercise 5: two products with code P1, with and without a matching hashCode</p></div>
<details><summary>PlantUML source of this diagram — copy, edit and re-render</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — two "equal" products in a HashSet: equals alone is not enough
left to right direction
package "ProductBug (equals only)" {
  rectangle "P1/Pen\\nidentity hash A" as B1 #FEF2F2
  rectangle "P1/Pen (copy)\\nidentity hash B" as B2 #FEF2F2
  rectangle "HashSet: 2 elements\\n(two buckets, equals never asked)" as S1
}
package "Product (equals + hashCode from code)" {
  rectangle "P1/Pen\\nhash = hashCode of code P1" as P1 #ECFDF5
  rectangle "P1/Pen (copy)\\nhash = hashCode of code P1" as P2 #ECFDF5
  rectangle "HashSet: 1 element\\n(same bucket, equals says duplicate)" as S2
}
B1 --&gt; S1
B2 --&gt; S1
P1 --&gt; S2
P2 --&gt; S2
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class ProductBug {
    private String code;
    private String name;
    ProductBug(String code, String name) { this.code = code; this.name = name; }
    @Override
    public boolean equals(Object o) {                  // same code = same product
        if (this == o) return true;
        if (!(o instanceof ProductBug)) return false;
        return code.equals(((ProductBug) o).code);
    }
    // hashCode() forgotten
    @Override
    public String toString() { return code + "/" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;ProductBug&gt; list = new ArrayList&lt;ProductBug&gt;();
Set&lt;ProductBug&gt; set = new HashSet&lt;ProductBug&gt;();
Map&lt;ProductBug, Integer&gt; stock = new HashMap&lt;ProductBug, Integer&gt;();
for (ProductBug p : new ProductBug[] { new ProductBug("P1", "Pen"), new ProductBug("P1", "Pen (copy)") }) {
    if (!list.contains(p)) list.add(p);
    set.add(p);
    stock.put(p, 10);
}
System.out.println("BUG  list " + list + " | set size " + set.size() + " | map size " + stock.size()
        + " | map.get(new P1) = " + stock.get(new ProductBug("P1", "?")));

Set&lt;Product&gt; set2 = new HashSet&lt;Product&gt;();
Map&lt;Product, Integer&gt; stock2 = new HashMap&lt;Product, Integer&gt;();
for (Product p : new Product[] { new Product("P1", "Pen"), new Product("P1", "Pen (copy)") }) {
    set2.add(p);
    stock2.put(p, 10);
}
System.out.println("FIX  set size " + set2.size() + " " + set2 + " | map size " + stock2.size()
        + " | map.get(new P1) = " + stock2.get(new Product("P1", "?")));</code></pre>
<details><summary>Answer, the fix, and one more trap (real output)</summary>
<pre class="trich"><code class="language-java">class Product {
    private String code;
    private String name;
    Product(String code, String name) { this.code = code; this.name = name; }
    void setCode(String code) { this.code = code; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        return code.equals(((Product) o).code);
    }
    @Override
    public int hashCode() {
        return code.hashCode();                        // built from the SAME field as equals
    }
    @Override
    public String toString() { return code + "/" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">Product key = new Product("P2", "Ruler");
Set&lt;Product&gt; s = new HashSet&lt;Product&gt;();
s.add(key);
key.setCode("P9");                             // the field used by hashCode changes AFTER the object is stored
System.out.println("after setCode: contains(key) = " + s.contains(key) + ", remove(key) = " + s.remove(key) + ", size = " + s.size() + " " + s);</code></pre>
<div class="out">BUG &nbsp;list [P1/Pen] | set size 2 | map size 2 | map.get(new P1) = null<br>
FIX &nbsp;set size 1 [P1/Pen] | map size 1 | map.get(new P1) = 10<br>
after setCode: contains(key) = false, remove(key) = false, size = 1 [P9/Ruler]</div>
<p>The <code>ArrayList</code> uses only <code>equals</code>, so <code>contains</code> found the duplicate: one P1. The <code>HashSet</code> and <code>HashMap</code> ask <code>hashCode</code> first; <code>ProductBug</code> inherits <code>Object.hashCode()</code>, different for the two objects, so both are stored and <code>get</code> with a third P1 returns <code>null</code>. <code>Product</code> builds <code>hashCode</code> from the same field as <code>equals</code> (<code>code</code>): one element, <code>get</code> works. The last line is the second rule: a field used by <code>hashCode</code> must not change while the object sits in a hash collection — after <code>setCode("P9")</code> the object lives in P2's bucket under P9's hash, so <code>contains</code> and <code>remove</code> both fail and the set is stuck with it.</p>
</details>
<div class="pitfall">Keys should be immutable: <code>String</code>, <code>Integer</code>, or a class whose key fields are <code>final</code> with no setter. That is why student id / product code — never name or price — is the key of a map.</div>`,
    `<h3>🧪 Bài 5 — Săn lỗi: equals mà không có hashCode (~20 phút)</h3>
<p>Một cửa hàng đếm sản phẩm theo mã. <code>ProductBug</code> nói hai sản phẩm cùng mã là bằng nhau — vậy mà HashSet giữ cả hai "P1" và HashMap không tìm lại được "P1". Hãy đoán bốn con số của dòng đầu tiên, rồi sửa lớp.</p>
<div class="anh-slide uml"><img src="https://media.cuongthai.com/images/academy/PRO192/uml/04915584be06c403862990b329c8e80cb4e74e46.svg" alt="Bài 5: hai sản phẩm mã P1, có và không có hashCode tương ứng" loading="lazy" /><p class="chu-thich">🧩 Bài 5: hai sản phẩm mã P1, có và không có hashCode tương ứng</p></div>
<details><summary>Mã PlantUML của sơ đồ — chép, sửa rồi dựng lại</summary><pre><code class="language-plantuml">@startuml
title Exercise 5 — two "equal" products in a HashSet: equals alone is not enough
left to right direction
package "ProductBug (equals only)" {
  rectangle "P1/Pen\\nidentity hash A" as B1 #FEF2F2
  rectangle "P1/Pen (copy)\\nidentity hash B" as B2 #FEF2F2
  rectangle "HashSet: 2 elements\\n(two buckets, equals never asked)" as S1
}
package "Product (equals + hashCode from code)" {
  rectangle "P1/Pen\\nhash = hashCode of code P1" as P1 #ECFDF5
  rectangle "P1/Pen (copy)\\nhash = hashCode of code P1" as P2 #ECFDF5
  rectangle "HashSet: 1 element\\n(same bucket, equals says duplicate)" as S2
}
B1 --&gt; S1
B2 --&gt; S1
P1 --&gt; S2
P2 --&gt; S2
@enduml</code></pre></details>
<pre class="trich"><code class="language-java">class ProductBug {
    private String code;
    private String name;
    ProductBug(String code, String name) { this.code = code; this.name = name; }
    @Override
    public boolean equals(Object o) {                  // cùng mã = cùng sản phẩm
        if (this == o) return true;
        if (!(o instanceof ProductBug)) return false;
        return code.equals(((ProductBug) o).code);
    }
    // quên hashCode()
    @Override
    public String toString() { return code + "/" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">List&lt;ProductBug&gt; list = new ArrayList&lt;ProductBug&gt;();
Set&lt;ProductBug&gt; set = new HashSet&lt;ProductBug&gt;();
Map&lt;ProductBug, Integer&gt; stock = new HashMap&lt;ProductBug, Integer&gt;();
for (ProductBug p : new ProductBug[] { new ProductBug("P1", "Pen"), new ProductBug("P1", "Pen (copy)") }) {
    if (!list.contains(p)) list.add(p);
    set.add(p);
    stock.put(p, 10);
}
System.out.println("BUG  list " + list + " | set size " + set.size() + " | map size " + stock.size()
        + " | map.get(new P1) = " + stock.get(new ProductBug("P1", "?")));

Set&lt;Product&gt; set2 = new HashSet&lt;Product&gt;();
Map&lt;Product, Integer&gt; stock2 = new HashMap&lt;Product, Integer&gt;();
for (Product p : new Product[] { new Product("P1", "Pen"), new Product("P1", "Pen (copy)") }) {
    set2.add(p);
    stock2.put(p, 10);
}
System.out.println("FIX  set size " + set2.size() + " " + set2 + " | map size " + stock2.size()
        + " | map.get(new P1) = " + stock2.get(new Product("P1", "?")));</code></pre>
<details><summary>Đáp án, cách sửa, và thêm một cái bẫy (output thật)</summary>
<pre class="trich"><code class="language-java">class Product {
    private String code;
    private String name;
    Product(String code, String name) { this.code = code; this.name = name; }
    void setCode(String code) { this.code = code; }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        return code.equals(((Product) o).code);
    }
    @Override
    public int hashCode() {
        return code.hashCode();                        // tạo từ CÙNG trường với equals
    }
    @Override
    public String toString() { return code + "/" + name; }
}</code></pre>
<pre class="trich"><code class="language-java">Product key = new Product("P2", "Ruler");
Set&lt;Product&gt; s = new HashSet&lt;Product&gt;();
s.add(key);
key.setCode("P9");                             // trường dùng cho hashCode bị đổi SAU khi đã cất
System.out.println("after setCode: contains(key) = " + s.contains(key) + ", remove(key) = " + s.remove(key) + ", size = " + s.size() + " " + s);</code></pre>
<div class="out">BUG &nbsp;list [P1/Pen] | set size 2 | map size 2 | map.get(new P1) = null<br>
FIX &nbsp;set size 1 [P1/Pen] | map size 1 | map.get(new P1) = 10<br>
after setCode: contains(key) = false, remove(key) = false, size = 1 [P9/Ruler]</div>
<p><code>ArrayList</code> chỉ dùng <code>equals</code>, nên <code>contains</code> phát hiện bản trùng: một P1. <code>HashSet</code> và <code>HashMap</code> hỏi <code>hashCode</code> trước; <code>ProductBug</code> kế thừa <code>Object.hashCode()</code>, khác nhau cho hai đối tượng, nên cả hai được cất và <code>get</code> với một P1 thứ ba trả <code>null</code>. <code>Product</code> tạo <code>hashCode</code> từ cùng trường với <code>equals</code> (<code>code</code>): một phần tử, <code>get</code> chạy đúng. Dòng cuối là luật thứ hai: trường dùng cho <code>hashCode</code> không được đổi khi đối tượng đang nằm trong một collection băm — sau <code>setCode("P9")</code> đối tượng ở trong ô của P2 mà mang mã băm của P9, nên <code>contains</code> và <code>remove</code> đều hỏng và set bị kẹt với nó.</p>
</details>
<div class="pitfall">Khoá nên bất biến: <code>String</code>, <code>Integer</code>, hoặc một lớp có các trường khoá là <code>final</code> và không có setter. Vì thế mã sinh viên / mã sản phẩm — không bao giờ là tên hay giá — mới là khoá của map.</div>`),
    bi(`<h3>🧪 Exercise 6 — Name the rule behind six real compile errors (~15 min)</h3>
<p>Each snippet breaks one rule of Chapter 8. Read the real JDK 8 message and say, in one sentence, which rule and how to fix it.</p>
<details><summary>The snippets and the real errors (javac 8)</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String[][] cases = {
        { "E1", "List&lt;int&gt; marks = new ArrayList&lt;int&gt;();" },
        { "E2", "List&lt;String&gt; s = new List&lt;String&gt;();" },
        { "E3", "List&lt;String&gt; s = List.of(\\"An\\", \\"Binh\\");" },
        { "E4", "Map&lt;String, Integer&gt; m = new HashMap&lt;String, Integer&gt;();\\n        for (String k : m) System.out.println(k);" },
        { "E5", "List&lt;Book&gt; books = new ArrayList&lt;Book&gt;();\\n        Collections.sort(books);" },
    };
    for (String[] c : cases) {
        System.out.println("== " + c[0] + " ==");
        viet(d, c[0] + ".java",
            "import java.util.*;\\n" +
            "class Book { String title; }\\n" +
            "public class " + c[0] + " {\\n" +
            "    public static void main(String[] args) {\\n" +
            "        " + c[1] + "\\n" +
            "    }\\n" +
            "}\\n");
        lenh(d, "javac", c[0] + ".java");
    }
    System.out.println("== E6: the given interface is RAW, your class uses List&lt;Ladder&gt; ==");
    viet(d, "E6.java",
        "import java.util.*;\\n" +
        "class Ladder { }\\n" +
        "interface ILadder { int f1(List t); }\\n" +
        "public class E6 implements ILadder {\\n" +
        "    public int f1(List&lt;Ladder&gt; t) { return t.size(); }\\n" +
        "}\\n");
    lenh(d, "javac", "E6.java");
}</code></pre>
<div class="out">== E1 ==<br>
&gt; javac E1.java<br>
E1.java:5: error: unexpected type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;int&gt; marks = new ArrayList&lt;int&gt;();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: reference<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;int<br>
E1.java:5: error: unexpected type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;int&gt; marks = new ArrayList&lt;int&gt;();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: reference<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;int<br>
2 errors<br>
(exit code 1)<br>
== E2 ==<br>
&gt; javac E2.java<br>
E2.java:5: error: List is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; s = new List&lt;String&gt;();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E3 ==<br>
&gt; javac E3.java<br>
E3.java:5: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; s = List.of("An", "Binh");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String,String)<br>
&nbsp;&nbsp;location: interface List<br>
1 error<br>
(exit code 1)<br>
== E4 ==<br>
&gt; javac E4.java<br>
E4.java:6: error: for-each not applicable to expression type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (String k : m) System.out.println(k);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: array or java.lang.Iterable<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;Map&lt;String,Integer&gt;<br>
1 error<br>
(exit code 1)<br>
== E5 ==<br>
&gt; javac E5.java<br>
E5.java:6: error: no suitable method found for sort(List&lt;Book&gt;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Collections.sort(books);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;method Collections.&lt;T#1&gt;sort(List&lt;T#1&gt;) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(inference variable T#1 has incompatible bounds<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;equality constraints: Book<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;upper bounds: Comparable&lt;? super T#1&gt;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;method Collections.&lt;T#2&gt;sort(List&lt;T#2&gt;,Comparator&lt;? super T#2&gt;) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(cannot infer type-variable(s) T#2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length))<br>
&nbsp;&nbsp;where T#1,T#2 are type-variables:<br>
&nbsp;&nbsp;&nbsp;&nbsp;T#1 extends Comparable&lt;? super T#1&gt; declared in method &lt;T#1&gt;sort(List&lt;T#1&gt;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;T#2 extends Object declared in method &lt;T#2&gt;sort(List&lt;T#2&gt;,Comparator&lt;? super T#2&gt;)<br>
1 error<br>
(exit code 1)<br>
== E6: the given interface is RAW, your class uses List&lt;Ladder&gt; ==<br>
&gt; javac E6.java<br>
E6.java:4: error: E6 is not abstract and does not override abstract method f1(List) in ILadder<br>
public class E6 implements ILadder {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
E6.java:5: error: name clash: f1(List&lt;Ladder&gt;) in E6 and f1(List) in ILadder have the same erasure, yet neither overrides the other<br>
&nbsp;&nbsp;&nbsp;&nbsp;public int f1(List&lt;Ladder&gt; t) { return t.size(); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)</div>
</details>
<details><summary>Answers</summary>
<ol>
<li><strong>E1</strong> — type arguments must be reference types: <code>List&lt;Integer&gt;</code>; autoboxing converts the <code>int</code>s.</li>
<li><strong>E2</strong> — <code>List</code> is an interface: you <code>new</code> a class (<code>new ArrayList&lt;String&gt;()</code>) and keep <code>List</code> as the variable's type.</li>
<li><strong>E3</strong> — <code>List.of</code> is Java 9: on the exam JDK write <code>new ArrayList&lt;String&gt;(Arrays.asList("An", "Binh"))</code>.</li>
<li><strong>E4</strong> — a <code>Map</code> is not <code>Iterable</code>: loop over <code>m.keySet()</code>, <code>m.values()</code> or <code>m.entrySet()</code>.</li>
<li><strong>E5</strong> — <code>Collections.sort(list)</code> needs elements that are <code>Comparable</code>: implement <code>Comparable&lt;Book&gt;</code>, or call <code>Collections.sort(books, aComparator)</code>. The message is long, but its first line says it all: "no suitable method found for sort(List&lt;Book&gt;)".</li>
<li><strong>E6</strong> — a method with a <code>List&lt;Ladder&gt;</code> parameter does not override one with a raw <code>List</code> parameter (same erasure, different signature): match the interface exactly — <code>public int f1(List t)</code> and cast inside. With the real PE interfaces (generic) <code>List&lt;Ladder&gt;</code> is the right match.</li>
</ol>
</details>`,
    `<h3>🧪 Bài 6 — Gọi tên luật đứng sau sáu lỗi biên dịch thật (~15 phút)</h3>
<p>Mỗi đoạn code phạm một luật của Chương 8. Đọc thông báo thật của JDK 8 và nói, trong một câu, đó là luật nào và sửa thế nào.</p>
<details><summary>Các đoạn code và lỗi thật (javac 8)</summary>
<pre class="trich"><code class="language-java">public static void main(String[] args) throws Exception {
    File d = new File("lab");
    String[][] cases = {
        { "E1", "List&lt;int&gt; marks = new ArrayList&lt;int&gt;();" },
        { "E2", "List&lt;String&gt; s = new List&lt;String&gt;();" },
        { "E3", "List&lt;String&gt; s = List.of(\\"An\\", \\"Binh\\");" },
        { "E4", "Map&lt;String, Integer&gt; m = new HashMap&lt;String, Integer&gt;();\\n        for (String k : m) System.out.println(k);" },
        { "E5", "List&lt;Book&gt; books = new ArrayList&lt;Book&gt;();\\n        Collections.sort(books);" },
    };
    for (String[] c : cases) {
        System.out.println("== " + c[0] + " ==");
        viet(d, c[0] + ".java",
            "import java.util.*;\\n" +
            "class Book { String title; }\\n" +
            "public class " + c[0] + " {\\n" +
            "    public static void main(String[] args) {\\n" +
            "        " + c[1] + "\\n" +
            "    }\\n" +
            "}\\n");
        lenh(d, "javac", c[0] + ".java");
    }
    System.out.println("== E6: the given interface is RAW, your class uses List&lt;Ladder&gt; ==");
    viet(d, "E6.java",
        "import java.util.*;\\n" +
        "class Ladder { }\\n" +
        "interface ILadder { int f1(List t); }\\n" +
        "public class E6 implements ILadder {\\n" +
        "    public int f1(List&lt;Ladder&gt; t) { return t.size(); }\\n" +
        "}\\n");
    lenh(d, "javac", "E6.java");
}</code></pre>
<div class="out">== E1 ==<br>
&gt; javac E1.java<br>
E1.java:5: error: unexpected type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;int&gt; marks = new ArrayList&lt;int&gt;();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: reference<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;int<br>
E1.java:5: error: unexpected type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;int&gt; marks = new ArrayList&lt;int&gt;();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: reference<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;int<br>
2 errors<br>
(exit code 1)<br>
== E2 ==<br>
&gt; javac E2.java<br>
E2.java:5: error: List is abstract; cannot be instantiated<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; s = new List&lt;String&gt;();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
1 error<br>
(exit code 1)<br>
== E3 ==<br>
&gt; javac E3.java<br>
E3.java:5: error: cannot find symbol<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List&lt;String&gt; s = List.of("An", "Binh");<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;symbol: &nbsp;&nbsp;method of(String,String)<br>
&nbsp;&nbsp;location: interface List<br>
1 error<br>
(exit code 1)<br>
== E4 ==<br>
&gt; javac E4.java<br>
E4.java:6: error: for-each not applicable to expression type<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for (String k : m) System.out.println(k);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;required: array or java.lang.Iterable<br>
&nbsp;&nbsp;found: &nbsp;&nbsp;&nbsp;Map&lt;String,Integer&gt;<br>
1 error<br>
(exit code 1)<br>
== E5 ==<br>
&gt; javac E5.java<br>
E5.java:6: error: no suitable method found for sort(List&lt;Book&gt;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Collections.sort(books);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
&nbsp;&nbsp;&nbsp;&nbsp;method Collections.&lt;T#1&gt;sort(List&lt;T#1&gt;) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(inference variable T#1 has incompatible bounds<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;equality constraints: Book<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;upper bounds: Comparable&lt;? super T#1&gt;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;method Collections.&lt;T#2&gt;sort(List&lt;T#2&gt;,Comparator&lt;? super T#2&gt;) is not applicable<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(cannot infer type-variable(s) T#2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(actual and formal argument lists differ in length))<br>
&nbsp;&nbsp;where T#1,T#2 are type-variables:<br>
&nbsp;&nbsp;&nbsp;&nbsp;T#1 extends Comparable&lt;? super T#1&gt; declared in method &lt;T#1&gt;sort(List&lt;T#1&gt;)<br>
&nbsp;&nbsp;&nbsp;&nbsp;T#2 extends Object declared in method &lt;T#2&gt;sort(List&lt;T#2&gt;,Comparator&lt;? super T#2&gt;)<br>
1 error<br>
(exit code 1)<br>
== E6: the given interface is RAW, your class uses List&lt;Ladder&gt; ==<br>
&gt; javac E6.java<br>
E6.java:4: error: E6 is not abstract and does not override abstract method f1(List) in ILadder<br>
public class E6 implements ILadder {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
E6.java:5: error: name clash: f1(List&lt;Ladder&gt;) in E6 and f1(List) in ILadder have the same erasure, yet neither overrides the other<br>
&nbsp;&nbsp;&nbsp;&nbsp;public int f1(List&lt;Ladder&gt; t) { return t.size(); }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^<br>
2 errors<br>
(exit code 1)</div>
</details>
<details><summary>Đáp án</summary>
<ol>
<li><strong>E1</strong> — đối số kiểu phải là kiểu tham chiếu: <code>List&lt;Integer&gt;</code>; autoboxing tự đổi các <code>int</code>.</li>
<li><strong>E2</strong> — <code>List</code> là interface: bạn <code>new</code> một lớp (<code>new ArrayList&lt;String&gt;()</code>) và giữ <code>List</code> làm kiểu của biến.</li>
<li><strong>E3</strong> — <code>List.of</code> là Java 9: trên JDK phòng thi viết <code>new ArrayList&lt;String&gt;(Arrays.asList("An", "Binh"))</code>.</li>
<li><strong>E4</strong> — <code>Map</code> không phải <code>Iterable</code>: lặp trên <code>m.keySet()</code>, <code>m.values()</code> hoặc <code>m.entrySet()</code>.</li>
<li><strong>E5</strong> — <code>Collections.sort(list)</code> cần phần tử <code>Comparable</code>: hiện thực <code>Comparable&lt;Book&gt;</code>, hoặc gọi <code>Collections.sort(books, mộtComparator)</code>. Thông báo dài, nhưng dòng đầu đã nói hết: "no suitable method found for sort(List&lt;Book&gt;)" (không có phương thức sort nào phù hợp).</li>
<li><strong>E6</strong> — phương thức có tham số <code>List&lt;Ladder&gt;</code> không ghi đè phương thức có tham số <code>List</code> thô (cùng dạng xoá kiểu — erasure — nhưng khác chữ ký): hãy khớp interface y hệt — <code>public int f1(List t)</code> rồi ép kiểu bên trong. Với interface thật của đề PE (dạng generic) thì <code>List&lt;Ladder&gt;</code> mới là khớp đúng.</li>
</ol>
</details>`),
    bi(`<h3>🧪 Exercise 7 — Predict six outputs (~15 min)</h3>
<p>FE style. Write down what Q1–Q6 print before opening the answer.</p>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;(Arrays.asList(3, 1, 2));
a.remove(1);
a.add(0, 7);
System.out.println("Q1 " + a);</code></pre>
<pre class="trich"><code class="language-java">String[] arr = { "x", "y", "z" };
List&lt;String&gt; view = Arrays.asList(arr);
view.set(1, "Y");
Collections.reverse(view);
System.out.println("Q2 " + Arrays.toString(arr));</code></pre>
<pre class="trich"><code class="language-java">Set&lt;String&gt; byLength = new TreeSet&lt;String&gt;(new Comparator&lt;String&gt;() {
    public int compare(String s, String t) { return s.length() - t.length(); }
});
byLength.addAll(Arrays.asList("cat", "horse", "dog", "ox", "mouse"));
System.out.println("Q3 " + byLength);</code></pre>
<pre class="trich"><code class="language-java">Map&lt;String, Integer&gt; m = new HashMap&lt;String, Integer&gt;();
m.put("a", 1);
Integer r1 = m.put("a", 2);
Integer r2 = m.put("b", 3);
System.out.println("Q4 " + r1 + " " + r2 + " " + m.get("a") + " " + m.size());</code></pre>
<pre class="trich"><code class="language-java">Set&lt;Object&gt; s = new HashSet&lt;Object&gt;();
s.add(1); s.add(1L); s.add("1"); s.add(1);
System.out.println("Q5 " + s.size());</code></pre>
<pre class="trich"><code class="language-java">List&lt;String&gt; names = new ArrayList&lt;String&gt;(Arrays.asList("An", "Binh", "Chi", "Dung"));
int visited = 0;
for (String n : names) {
    visited++;
    if (n.equals("Chi")) names.remove(n);
}
System.out.println("Q6 " + names + " visited=" + visited);</code></pre>
<details><summary>Answer (real output) and the rule behind each line</summary>
<div class="out">Q1 [7, 3, 2]<br>
Q2 [z, Y, x]<br>
Q3 [ox, cat, horse]<br>
Q4 1 null 2 2<br>
Q5 3<br>
Q6 [An, Binh, Dung] visited=3</div>
<ul>
<li><strong>Q1</strong> — <code>remove(1)</code> on a <code>List&lt;Integer&gt;</code> removes index 1 (the value 1), then <code>add(0, 7)</code> inserts at the front.</li>
<li><strong>Q2</strong> — <code>Arrays.asList</code> is a view: <code>set</code> and <code>Collections.reverse</code> (which only swaps, never changes the size) write through to the array.</li>
<li><strong>Q3</strong> — the TreeSet's comparator compares lengths, so "dog" (3, like "cat") and "mouse" (5, like "horse") compare 0 → treated as duplicates and dropped.</li>
<li><strong>Q4</strong> — <code>put</code> returns the previous value: 1 for "a", <code>null</code> for the new "b"; "a" now maps to 2; two keys.</li>
<li><strong>Q5</strong> — <code>Integer</code> 1, <code>Long</code> 1 and <code>String</code> "1" are three unequal objects (<code>Integer.equals</code> is false for a <code>Long</code>); the second <code>add(1)</code> is a duplicate.</li>
<li><strong>Q6</strong> — removing "Chi", the second-to-last element, makes <code>hasNext()</code> false: no exception, and "Dung" is never visited (visited = 3).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — Đoán sáu output (~15 phút)</h3>
<p>Kiểu câu FE. Ghi ra Q1–Q6 in gì trước khi mở đáp án.</p>
<pre class="trich"><code class="language-java">List&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;(Arrays.asList(3, 1, 2));
a.remove(1);
a.add(0, 7);
System.out.println("Q1 " + a);</code></pre>
<pre class="trich"><code class="language-java">String[] arr = { "x", "y", "z" };
List&lt;String&gt; view = Arrays.asList(arr);
view.set(1, "Y");
Collections.reverse(view);
System.out.println("Q2 " + Arrays.toString(arr));</code></pre>
<pre class="trich"><code class="language-java">Set&lt;String&gt; byLength = new TreeSet&lt;String&gt;(new Comparator&lt;String&gt;() {
    public int compare(String s, String t) { return s.length() - t.length(); }
});
byLength.addAll(Arrays.asList("cat", "horse", "dog", "ox", "mouse"));
System.out.println("Q3 " + byLength);</code></pre>
<pre class="trich"><code class="language-java">Map&lt;String, Integer&gt; m = new HashMap&lt;String, Integer&gt;();
m.put("a", 1);
Integer r1 = m.put("a", 2);
Integer r2 = m.put("b", 3);
System.out.println("Q4 " + r1 + " " + r2 + " " + m.get("a") + " " + m.size());</code></pre>
<pre class="trich"><code class="language-java">Set&lt;Object&gt; s = new HashSet&lt;Object&gt;();
s.add(1); s.add(1L); s.add("1"); s.add(1);
System.out.println("Q5 " + s.size());</code></pre>
<pre class="trich"><code class="language-java">List&lt;String&gt; names = new ArrayList&lt;String&gt;(Arrays.asList("An", "Binh", "Chi", "Dung"));
int visited = 0;
for (String n : names) {
    visited++;
    if (n.equals("Chi")) names.remove(n);
}
System.out.println("Q6 " + names + " visited=" + visited);</code></pre>
<details><summary>Đáp án (output thật) và luật đứng sau mỗi dòng</summary>
<div class="out">Q1 [7, 3, 2]<br>
Q2 [z, Y, x]<br>
Q3 [ox, cat, horse]<br>
Q4 1 null 2 2<br>
Q5 3<br>
Q6 [An, Binh, Dung] visited=3</div>
<ul>
<li><strong>Q1</strong> — <code>remove(1)</code> trên <code>List&lt;Integer&gt;</code> xoá chỉ số 1 (giá trị 1), rồi <code>add(0, 7)</code> chèn lên đầu.</li>
<li><strong>Q2</strong> — <code>Arrays.asList</code> là một khung nhìn: <code>set</code> và <code>Collections.reverse</code> (chỉ hoán đổi, không đổi kích thước) ghi xuyên xuống mảng.</li>
<li><strong>Q3</strong> — comparator của TreeSet so độ dài, nên "dog" (3, như "cat") và "mouse" (5, như "horse") so ra 0 → bị coi là trùng và bị bỏ.</li>
<li><strong>Q4</strong> — <code>put</code> trả giá trị trước đó: 1 cho "a", <code>null</code> cho "b" mới; "a" giờ ứng với 2; hai khoá.</li>
<li><strong>Q5</strong> — <code>Integer</code> 1, <code>Long</code> 1 và <code>String</code> "1" là ba đối tượng không bằng nhau (<code>Integer.equals</code> trả false với một <code>Long</code>); lần <code>add(1)</code> thứ hai là trùng.</li>
<li><strong>Q6</strong> — xoá "Chi", phần tử áp chót, làm <code>hasNext()</code> thành false: không có ngoại lệ, và "Dung" không bao giờ được duyệt (visited = 3).</li>
</ul>
</details>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>collection</strong></td><td>tập hợp (collection)</td><td>One object that holds a group of references to other objects.</td></tr>
<tr><td><strong>Collections Framework</strong></td><td>khung tập hợp</td><td>The interfaces, classes and algorithms of <code>java.util</code> for storing and processing groups of objects.</td></tr>
<tr><td><strong>generics / type parameter</strong></td><td>kiểu tổng quát / tham số kiểu</td><td>The <code>&lt;E&gt;</code> of <code>List&lt;E&gt;</code>: the element type is checked by the compiler, so no casts and no ClassCastException at run time.</td></tr>
<tr><td><strong>raw type</strong></td><td>kiểu thô</td><td>A generic type used without <code>&lt;...&gt;</code> (<code>ArrayList list</code>); compiles with an "unchecked" note and loses the type checks.</td></tr>
<tr><td><strong>autoboxing</strong></td><td>tự đóng hộp</td><td>Automatic conversion between a primitive and its wrapper (<code>int</code> ↔ <code>Integer</code>), which lets <code>list.add(5)</code> work.</td></tr>
<tr><td><strong><code>List</code></strong></td><td>danh sách</td><td>Ordered collection with indexes from 0; duplicates allowed (ArrayList, LinkedList).</td></tr>
<tr><td><strong><code>Set</code></strong></td><td>tập (không trùng)</td><td>Collection without duplicates; "duplicate" is decided by equals/hashCode or compareTo (HashSet, TreeSet).</td></tr>
<tr><td><strong><code>Map</code></strong></td><td>ánh xạ (bảng khoá–giá trị)</td><td>Associates exactly one value with each unique key; not a Collection (HashMap, TreeMap).</td></tr>
<tr><td><strong>iterator</strong></td><td>bộ duyệt</td><td>Object that visits the elements one by one with <code>hasNext()</code>/<code>next()</code> and can <code>remove()</code> the last one safely.</td></tr>
<tr><td><strong>fail-fast / <code>ConcurrentModificationException</code></strong></td><td>hỏng sớm / lỗi sửa đổi đồng thời</td><td>An iterator throws this as soon as it sees the collection was changed by someone other than itself.</td></tr>
<tr><td><strong>hash table / bucket</strong></td><td>bảng băm / ô</td><td>Storage where <code>hashCode()</code> picks the bucket of an element, giving O(1) average add/search.</td></tr>
<tr><td><strong>hash collision</strong></td><td>va chạm băm</td><td>Two different keys landing in the same bucket; <code>equals</code> tells them apart.</td></tr>
<tr><td><strong><code>equals</code> / <code>hashCode</code> contract</strong></td><td>hợp đồng equals / hashCode</td><td>Equal objects must have equal hash codes; override both together, from the same fields.</td></tr>
<tr><td><strong>natural ordering (<code>Comparable</code>)</strong></td><td>thứ tự tự nhiên</td><td>The order given by a class's own <code>compareTo</code>: negative, 0 or positive.</td></tr>
<tr><td><strong><code>Comparator</code></strong></td><td>bộ so sánh</td><td>A separate object that defines another order, passed to <code>Collections.sort</code> or a TreeSet/TreeMap.</td></tr>
<tr><td><strong>legacy class</strong></td><td>lớp di sản</td><td>Pre-1.2 class kept for compatibility, synchronized and not recommended for new code (Vector, Hashtable, Stack).</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>collection</strong></td><td>tập hợp (collection)</td><td>Một đối tượng giữ một nhóm tham chiếu tới các đối tượng khác.</td></tr>
<tr><td><strong>Collections Framework</strong></td><td>khung tập hợp</td><td>Các interface, lớp và thuật toán của <code>java.util</code> để lưu và xử lý nhóm đối tượng.</td></tr>
<tr><td><strong>generics / type parameter</strong></td><td>kiểu tổng quát / tham số kiểu</td><td>Phần <code>&lt;E&gt;</code> của <code>List&lt;E&gt;</code>: kiểu phần tử được trình biên dịch kiểm, nên không cần ép kiểu và không có ClassCastException lúc chạy.</td></tr>
<tr><td><strong>raw type</strong></td><td>kiểu thô</td><td>Kiểu generic dùng không có <code>&lt;...&gt;</code> (<code>ArrayList list</code>); biên dịch kèm ghi chú "unchecked" và mất phần kiểm kiểu.</td></tr>
<tr><td><strong>autoboxing</strong></td><td>tự đóng hộp</td><td>Chuyển tự động giữa kiểu nguyên thuỷ và lớp bao của nó (<code>int</code> ↔ <code>Integer</code>), nhờ đó <code>list.add(5)</code> chạy được.</td></tr>
<tr><td><strong><code>List</code></strong></td><td>danh sách</td><td>Collection có thứ tự, chỉ số từ 0; cho phép trùng (ArrayList, LinkedList).</td></tr>
<tr><td><strong><code>Set</code></strong></td><td>tập (không trùng)</td><td>Collection không có phần tử trùng; "trùng" do equals/hashCode hoặc compareTo quyết định (HashSet, TreeSet).</td></tr>
<tr><td><strong><code>Map</code></strong></td><td>ánh xạ (bảng khoá–giá trị)</td><td>Gắn đúng một giá trị với mỗi khoá duy nhất; không phải Collection (HashMap, TreeMap).</td></tr>
<tr><td><strong>iterator</strong></td><td>bộ duyệt</td><td>Đối tượng đi qua từng phần tử bằng <code>hasNext()</code>/<code>next()</code> và có thể <code>remove()</code> phần tử vừa lấy một cách an toàn.</td></tr>
<tr><td><strong>fail-fast / <code>ConcurrentModificationException</code></strong></td><td>hỏng sớm / lỗi sửa đổi đồng thời</td><td>Iterator ném lỗi này ngay khi thấy collection bị sửa bởi thứ khác ngoài chính nó.</td></tr>
<tr><td><strong>hash table / bucket</strong></td><td>bảng băm / ô</td><td>Cách lưu trong đó <code>hashCode()</code> chọn ô cho phần tử, cho thêm/tìm trung bình O(1).</td></tr>
<tr><td><strong>hash collision</strong></td><td>va chạm băm</td><td>Hai khoá khác nhau rơi vào cùng một ô; <code>equals</code> phân biệt chúng.</td></tr>
<tr><td><strong><code>equals</code> / <code>hashCode</code> contract</strong></td><td>hợp đồng equals / hashCode</td><td>Hai đối tượng bằng nhau phải có mã băm bằng nhau; ghi đè cả hai cùng lúc, từ cùng các trường.</td></tr>
<tr><td><strong>natural ordering (<code>Comparable</code>)</strong></td><td>thứ tự tự nhiên</td><td>Thứ tự do chính <code>compareTo</code> của lớp quy định: âm, 0 hoặc dương.</td></tr>
<tr><td><strong><code>Comparator</code></strong></td><td>bộ so sánh</td><td>Một đối tượng riêng định nghĩa thứ tự khác, truyền cho <code>Collections.sort</code> hoặc TreeSet/TreeMap.</td></tr>
<tr><td><strong>legacy class</strong></td><td>lớp di sản</td><td>Lớp có từ trước bản 1.2 được giữ để tương thích, có đồng bộ hoá và không khuyên dùng cho code mới (Vector, Hashtable, Stack).</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 8</h2>
<ol>
<li><strong>List keeps order and duplicates, Set refuses duplicates, Map looks up one value per key</strong> — choose by the rule you need.</li>
<li><strong>Declare with the interface, choose the class after <code>new</code>:</strong> <code>List&lt;Student&gt; list = new ArrayList&lt;Student&gt;()</code>; always write the <code>&lt;Type&gt;</code>.</li>
<li><strong>JDK 8 has no <code>List.of</code>;</strong> <code>Arrays.asList</code> is fixed-size — copy it into a <code>new ArrayList&lt;&gt;(…)</code> before adding or removing.</li>
<li><strong>ArrayList for almost everything</strong> (index O(1)); LinkedList/ArrayDeque for queues and stacks; Vector is legacy, not deprecated.</li>
<li><strong>Remove inside a loop only with <code>Iterator.remove()</code> or <code>removeIf</code></strong> — for-each + <code>remove</code> throws ConcurrentModificationException, an index loop skips elements.</li>
<li><strong>Hash structures use <code>hashCode</code> then <code>equals</code>:</strong> override both from the same fields, and never change a key while it is stored.</li>
<li><strong>Tree structures use <code>compareTo</code>/a <code>Comparator</code>:</strong> 0 means "duplicate" — add a tie-breaker; compare with <code>Integer.compare</code>/<code>Double.compare</code>, not subtraction.</li>
<li><strong>HashSet/HashMap order is not a promise</strong> (it even changed between JDK 7 and 8): sort, or use LinkedHash…/Tree… when output order matters.</li>
</ol>
<p>Next: the Chapter 8 quiz. Then try PE question 3 of <strong>PE11</strong> or <strong>PE14</strong> and the 10-mark <strong>PE9</strong> in the <a href="/exam?course=PRO192">Exam Room</a> against the clock — the given projects there are real NetBeans projects you can run with JDK 8.</p>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 8</h2>
<ol>
<li><strong>List giữ thứ tự và phần tử trùng, Set từ chối phần tử trùng, Map tra một giá trị theo mỗi khoá</strong> — chọn theo luật bạn cần.</li>
<li><strong>Khai báo bằng interface, chọn lớp sau chữ <code>new</code>:</strong> <code>List&lt;Student&gt; list = new ArrayList&lt;Student&gt;()</code>; luôn ghi <code>&lt;Kiểu&gt;</code>.</li>
<li><strong>JDK 8 không có <code>List.of</code>;</strong> <code>Arrays.asList</code> cố định kích thước — chép sang <code>new ArrayList&lt;&gt;(…)</code> trước khi thêm hay xoá.</li>
<li><strong>ArrayList cho gần như mọi việc</strong> (chỉ số O(1)); LinkedList/ArrayDeque cho hàng đợi và ngăn xếp; Vector là di sản, không bị deprecated.</li>
<li><strong>Xoá trong vòng lặp chỉ bằng <code>Iterator.remove()</code> hoặc <code>removeIf</code></strong> — for-each + <code>remove</code> ném ConcurrentModificationException, vòng chỉ số thì bỏ sót phần tử.</li>
<li><strong>Cấu trúc băm dùng <code>hashCode</code> rồi <code>equals</code>:</strong> ghi đè cả hai từ cùng các trường, và không bao giờ đổi khoá khi nó đang được cất.</li>
<li><strong>Cấu trúc cây dùng <code>compareTo</code>/một <code>Comparator</code>:</strong> 0 nghĩa là "trùng" — thêm tiêu chí phân xử hoà; so bằng <code>Integer.compare</code>/<code>Double.compare</code>, không bằng phép trừ.</li>
<li><strong>Thứ tự của HashSet/HashMap không phải lời hứa</strong> (nó còn đổi giữa JDK 7 và 8): hãy sắp xếp, hoặc dùng LinkedHash…/Tree… khi thứ tự output quan trọng.</li>
</ol>
<p>Tiếp theo: quiz Chương 8. Rồi thử câu 3 của <strong>PE11</strong> hoặc <strong>PE14</strong> và đề 10 điểm <strong>PE9</strong> trong <a href="/exam?course=PRO192">Exam Room</a> có bấm giờ — các project given ở đó là project NetBeans thật, chạy được với JDK 8.</p>`),
  ].join('\n'),
};

/* ───────── Quiz (pro192-quiz-ch8) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Which statement about the Java Collections Framework is TRUE?|||Phát biểu nào về Java Collections Framework là ĐÚNG?',
      options: ['Map extends Collection, so a Map can be passed to a method that takes a Collection|||Map kế thừa Collection, nên truyền được một Map cho phương thức nhận Collection', 'A List keeps insertion order and allows duplicates, a Set has no duplicates, a Map holds key-value pairs with unique keys|||List giữ thứ tự thêm và cho trùng, Set không có phần tử trùng, Map giữ cặp khoá-giá trị với khoá duy nhất', 'Vector has been deprecated since Java 1.6, so code using it does not compile on JDK 8|||Vector bị deprecated từ Java 1.6, nên code dùng nó không biên dịch trên JDK 8', 'ArrayList and HashMap are synchronized, so they are safe to share between threads|||ArrayList và HashMap có đồng bộ hoá, nên dùng chung giữa các luồng an toàn'],
      correctIndex: 1,
      points: 1,
      explanation: 'B is the one-line summary of slides 2 and 5. Map is a separate interface tree — phone instanceof Collection printed false (A). Vector is a legacy class but was never @Deprecated: javac 8 with -Xlint:deprecation warns about Date, not about Vector (C). The framework as a whole is not thread-safe; only the old Vector and Hashtable are synchronized (D).|||B là bản tóm tắt một dòng của slide 2 và 5. Map là một cây interface riêng — phone instanceof Collection in ra false (A sai). Vector là lớp di sản nhưng chưa bao giờ bị @Deprecated: javac 8 với -Xlint:deprecation cảnh báo Date, không cảnh báo Vector (C sai). Xét tổng thể, khung này không an toàn luồng; chỉ Vector và Hashtable đời cũ có đồng bộ hoá (D sai).' },
    { id: 'q2',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `List<Integer> nums = new ArrayList<Integer>(Arrays.asList(10, 1, 20, 1));
nums.remove(1);
nums.remove(Integer.valueOf(1));
System.out.println(nums);`,
      codeLang: 'java',
      options: ['[10, 20, 1]|||[10, 20, 1]', '[20, 1]|||[20, 1]', '[10, 20]|||[10, 20]', '[10, 1, 20]|||[10, 1, 20]'],
      correctIndex: 2,
      points: 1,
      explanation: 'The argument of nums.remove(1) is an int, so Java picks remove(int index): the element at index 1 (the first 1) goes → [10, 20, 1]. nums.remove(Integer.valueOf(1)) passes an object, so remove(Object) removes the first element equal to 1 → [10, 20]. To delete a value from a List<Integer>, always box it explicitly.|||Đối số của nums.remove(1) là int, nên Java chọn remove(int index): phần tử ở chỉ số 1 (số 1 đầu tiên) bị xoá → [10, 20, 1]. nums.remove(Integer.valueOf(1)) truyền một đối tượng, nên remove(Object) xoá phần tử đầu tiên bằng 1 → [10, 20]. Muốn xoá một giá trị khỏi List<Integer>, luôn đóng hộp tường minh.' },
    { id: 'q3',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `Map<Character, Integer> map = new HashMap<Character, Integer>();
String data = "heLLo";
for (Character c : data.toCharArray()) {
    if (map.containsKey(c)) {
        map.put(c, map.get(c) + 1);
    } else {
        map.put(c, 0);
    }
}
System.out.println(map.get('L'));`,
      codeLang: 'java',
      options: ['1|||1', '2|||2', '0|||0', 'null|||null'],
      correctIndex: 0,
      points: 1,
      explanation: "The counter starts at 0 on the first sight of a character, not at 1. 'L' appears twice: the first time put('L', 0), the second time put('L', 0 + 1). So map.get('L') is 1. Lower-case 'l' would be a different key (Character equals is case-sensitive) and get('l') would print null.|||Bộ đếm bắt đầu từ 0 ở lần gặp đầu tiên của một ký tự, không phải từ 1. 'L' xuất hiện hai lần: lần đầu put('L', 0), lần hai put('L', 0 + 1). Nên map.get('L') là 1. Chữ 'l' thường sẽ là một khoá khác (equals của Character phân biệt hoa thường) và get('l') sẽ in null." },
    { id: 'q4',
      question: 'What is printed on JDK 8?|||Trên JDK 8 chương trình in ra gì?',
      code: `List<String> s = Arrays.asList("a", "b");
s.set(0, "x");
try {
    s.add("c");
} catch (UnsupportedOperationException e) {
    System.out.print("UOE ");
}
System.out.println(s);`,
      codeLang: 'java',
      options: ['[x, b, c]|||[x, b, c]', '[a, b, c]|||[a, b, c]', 'UOE [a, b]|||UOE [a, b]', 'UOE [x, b]|||UOE [x, b]'],
      correctIndex: 3,
      points: 1,
      explanation: 'Arrays.asList returns a fixed-size list backed by an array: set(0, "x") is allowed and changes the element, but add changes the size, so it throws UnsupportedOperationException — caught, "UOE " is printed, then the list [x, b]. On JDK 8 the growable version is new ArrayList<String>(Arrays.asList("a", "b")); List.of does not exist before Java 9 (and is not even settable).|||Arrays.asList trả một list cố định kích thước dựa trên mảng: set(0, "x") được phép và đổi phần tử, nhưng add làm đổi kích thước, nên ném UnsupportedOperationException — bị bắt, in "UOE ", rồi in list [x, b]. Trên JDK 8 bản lớn lên được là new ArrayList<String>(Arrays.asList("a", "b")); List.of không có trước Java 9 (và còn không set được).' },
    { id: 'q5',
      question: 'Class P overrides equals() (same id = equal) but not hashCode(). What is printed?|||Lớp P ghi đè equals() (cùng id = bằng nhau) nhưng không ghi đè hashCode(). Chương trình in ra gì?',
      code: `class P {
    int id;
    P(int id) { this.id = id; }
    @Override
    public boolean equals(Object o) {
        return o instanceof P && ((P) o).id == id;
    }
}
public class Q5 {
    public static void main(String[] args) {
        Set<P> set = new HashSet<P>();
        set.add(new P(1));
        set.add(new P(1));
        List<P> list = new ArrayList<P>();
        list.add(new P(1));
        System.out.println(set.size() + " " + list.contains(new P(1)));
    }
}`,
      codeLang: 'java',
      options: ['1 true|||1 true', '2 true|||2 true', '2 false|||2 false', '1 false|||1 false'],
      correctIndex: 1,
      points: 1,
      explanation: 'ArrayList.contains uses only equals, so it finds the equal P(1): true. HashSet first uses hashCode to choose a bucket; P inherits Object.hashCode(), different for the two objects, so equals is never consulted and both are stored: size 2. The contract: equal objects must have equal hash codes — override hashCode from the same field (id) and the set holds 1.|||ArrayList.contains chỉ dùng equals, nên nó tìm thấy P(1) bằng nhau: true. HashSet dùng hashCode trước để chọn ô; P kế thừa Object.hashCode(), khác nhau cho hai đối tượng, nên equals không bao giờ được hỏi và cả hai đều được cất: size 2. Hợp đồng: hai đối tượng bằng nhau phải có mã băm bằng nhau — ghi đè hashCode từ cùng trường (id) thì set chỉ giữ 1.' },
    { id: 'q6',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class S implements Comparable<S> {
    String name;
    double gpa;
    S(String name, double gpa) { this.name = name; this.gpa = gpa; }
    @Override
    public int compareTo(S o) { return Double.compare(gpa, o.gpa); }
}
public class Q6 {
    public static void main(String[] args) {
        Set<S> set = new TreeSet<S>();
        set.add(new S("An", 8.0));
        set.add(new S("Binh", 8.0));
        set.add(new S("Chi", 7.5));
        System.out.println(set.size());
    }
}`,
      codeLang: 'java',
      options: ['2|||2', '3|||3', '1|||1', 'Runtime error: ClassCastException|||Lỗi lúc chạy: ClassCastException'],
      correctIndex: 0,
      points: 1,
      explanation: 'A TreeSet never calls equals: two elements are the same when compareTo returns 0. An and Binh both have gpa 8.0, so Binh is treated as a duplicate and silently not added — the set holds An and Chi. S implements Comparable<S>, so there is no ClassCastException. To keep everyone, break ties (compare names when the gpa is equal) or sort a List instead.|||TreeSet không bao giờ gọi equals: hai phần tử là một khi compareTo trả 0. An và Binh cùng gpa 8.0, nên Binh bị coi là trùng và lặng lẽ không được thêm — set giữ An và Chi. S hiện thực Comparable<S>, nên không có ClassCastException. Muốn giữ đủ mọi người, hãy phân xử hoà (so tên khi gpa bằng nhau) hoặc sắp xếp một List.' },
    { id: 'q7',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `List<String> list = new ArrayList<String>(Arrays.asList("A", "B", "C"));
try {
    for (String s : list) {
        if (s.equals("A")) list.remove(s);
    }
    System.out.println(list);
} catch (ConcurrentModificationException e) {
    System.out.println("CME");
}`,
      codeLang: 'java',
      options: ['[B, C]|||[B, C]', '[A, B, C]|||[A, B, C]', 'CME|||CME', 'Compile error: a list cannot be changed inside for-each|||Lỗi biên dịch: không được sửa list trong for-each'],
      correctIndex: 2,
      points: 1,
      explanation: 'for-each uses a hidden Iterator. list.remove(s) changes the list behind its back (modCount 3 → 4); the next call to next() sees the mismatch and throws ConcurrentModificationException. The compiler does not check this (D). The safe way is Iterator.remove() or list.removeIf(...). Only removing the second-to-last element escapes the exception, by ending the loop early.|||for-each dùng một Iterator ẩn. list.remove(s) sửa list sau lưng nó (modCount 3 → 4); lần gọi next() kế tiếp thấy lệch và ném ConcurrentModificationException. Trình biên dịch không kiểm điều này (D sai). Cách an toàn là Iterator.remove() hoặc list.removeIf(...). Chỉ khi xoá phần tử áp chót mới thoát ngoại lệ, vì vòng lặp kết thúc sớm.' },
    { id: 'q8',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `TreeMap<String, Integer> t = new TreeMap<String, Integer>();
t.put("c", 1);
t.put("b", 2);
t.put("a", 3);
System.out.println(t.values());`,
      codeLang: 'java',
      options: ['[1, 2, 3]|||[1, 2, 3]', '[c, b, a]|||[c, b, a]', '[a, b, c]|||[a, b, c]', '[3, 2, 1]|||[3, 2, 1]'],
      correctIndex: 3,
      points: 1,
      explanation: 'A TreeMap keeps its KEYS sorted: a, b, c. values() returns the values in the order of their keys — 3 (a), 2 (b), 1 (c) — not sorted by value and not in insertion order. [a, b, c] would be t.keySet().|||TreeMap giữ các KHOÁ có thứ tự: a, b, c. values() trả các giá trị theo thứ tự khoá của chúng — 3 (a), 2 (b), 1 (c) — không sắp theo giá trị, cũng không theo thứ tự thêm. [a, b, c] mới là t.keySet().' },
    { id: 'q9',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `Set<String> h = new HashSet<String>();
h.add(null);
Set<String> t = new TreeSet<String>();
try {
    t.add(null);
    System.out.println(h.size() + " ok");
} catch (NullPointerException e) {
    System.out.println(h.size() + " NPE");
}`,
      codeLang: 'java',
      options: ['1 ok|||1 ok', '1 NPE|||1 NPE', '0 NPE|||0 NPE', 'Compile error: null is not a String|||Lỗi biên dịch: null không phải String'],
      correctIndex: 1,
      points: 1,
      explanation: "A HashSet accepts one null element (its HashMap treats a null key as hash 0), so h.size() is 1. A TreeSet with natural ordering must call compareTo on its elements, and null cannot be compared: add(null) throws NullPointerException. null is a valid value of any reference type, so it compiles (D). This is also why FE's \"main difference between HashSet and TreeSet\" has two defensible answers.|||HashSet nhận một phần tử null (HashMap bên trong coi khoá null có mã băm 0), nên h.size() là 1. TreeSet theo thứ tự tự nhiên phải gọi compareTo trên phần tử, mà null không so được: add(null) ném NullPointerException. null là giá trị hợp lệ của mọi kiểu tham chiếu, nên vẫn biên dịch (D sai). Đây cũng là lý do câu FE \"khác biệt chính giữa HashSet và TreeSet\" có hai đáp án đều bảo vệ được." },
    { id: 'q10',
      question: 'The PE machine runs JDK 8. Which line compiles there?|||Máy thi PE chạy JDK 8. Dòng nào biên dịch được ở đó?',
      options: ['List<String> s = new ArrayList<String>(Arrays.asList("a", "b"));|||List<String> s = new ArrayList<String>(Arrays.asList("a", "b"));', 'List<String> s = List.of("a", "b");|||List<String> s = List.of("a", "b");', 'var s = new ArrayList<String>();|||var s = new ArrayList<String>();', 'List<int> s = new ArrayList<int>();|||List<int> s = new ArrayList<int>();'],
      correctIndex: 0,
      points: 1,
      explanation: 'A is the JDK 8 idiom: a growable ArrayList copied from Arrays.asList. List.of is Java 9 — javac 8 says "cannot find symbol: method of(String,String)" (B). var for local variables is Java 10 (C). Type arguments must be reference types: List<int> gives "unexpected type, required: reference, found: int" (D) — write List<Integer>.|||A là cách viết của JDK 8: một ArrayList lớn lên được, chép từ Arrays.asList. List.of là Java 9 — javac 8 báo "cannot find symbol: method of(String,String)" (B sai). var cho biến cục bộ là Java 10 (C sai). Đối số kiểu phải là kiểu tham chiếu: List<int> cho lỗi "unexpected type, required: reference, found: int" (D sai) — hãy viết List<Integer>.' },
  ],
};

export default {
  slides: [L_pro13_1, L_pro13_2],
  practice: L_on_ch8,
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 8 viết lại theo dạng câu FE PRO192, mỗi câu có giải thích song ngữ; câu "in ra gì" đã chạy thật trên JDK 8: ba kiểu nhóm List/Set/Map, remove(int) với remove(Object), đếm ký tự bằng HashMap, Arrays.asList cố định kích thước, equals mà thiếu hashCode, TreeSet coi compareTo bằng 0 là trùng, xoá trong for-each và ConcurrentModificationException, TreeMap.values(), null trong HashSet và TreeSet, và dòng code nào biên dịch được trên JDK 8 của phòng thi.',
};
