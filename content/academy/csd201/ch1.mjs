/**
 * CSD201 · Chương 1 — danh sách & danh sách liên kết.
 * Bài 📑 học theo từng slide: csd4 (1-ListDataStructures.ppt, 23 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch1.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch1).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 1.A — 📑 Slide by slide · List data structures (1-ListDataStructures, slides 1–23) ───────── */
const L_csd4_1 = {
  title: '1.A — 📑 Slide by slide · List data structures (1-ListDataStructures, slides 1–23)|||1.A — 📑 Học theo từng slide · Cấu trúc danh sách (1-ListDataStructures, slide 1–23)',
  slug: 'csd201-slide-csd4-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–23 của bộ 1-ListDataStructures: ADT danh sách, nhược điểm của mảng, cấu trúc tự tham chiếu, danh sách liên kết đơn, vòng, đôi (chèn/xoá đầu–cuối vẽ lại từng bước), round-robin, LinkedList/ArrayList của java.util — 17 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.A · 1-ListDataStructures, slides 1–23</span>
<h2>List data structures — the deck, slide by slide</h2>
<p class="lead">This is the deck shown in the first sessions of the course (syllabus sessions 1–2, CLO1). Read it before lessons 1.1–1.5 below: every slide is here with what it means, a runnable Java program for every operation, the pointer moves drawn step by step, the cost in Big-O, and the traps that cost marks in the FE (final exam) and the PE (practical exam).</p>
<div class="callout"><strong>CLO1 in the syllabus:</strong> describe the list data structure and its different implementations; <strong>implement the singly linked list</strong>. The PE almost always has a linked-list question, so slides 8–12 are the ones to be able to type from memory.</div>
<h3>The whole deck in one table</h3>
<table>
<thead><tr><th>Operation</th><th>Array (n elements)</th><th>Singly linked list (head + tail)</th><th>Doubly linked list</th></tr></thead>
<tbody>
<tr><td>Read the i-th element</td><td>O(1) — <code>a[i]</code></td><td>O(n) — walk from head</td><td>O(n)</td></tr>
<tr><td>Insert / delete at the front</td><td>O(n) — shift everything</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>Insert at the end</td><td>O(1) if there is room</td><td>O(1) thanks to <code>tail</code></td><td>O(1)</td></tr>
<tr><td>Delete at the end</td><td>O(1)</td><td>O(n) — find the node before <code>tail</code></td><td>O(1) — <code>tail.prev</code></td></tr>
<tr><td>Insert / delete in the middle, position known</td><td>O(n) — shift</td><td>O(1) once you hold the node before it</td><td>O(1)</td></tr>
<tr><td>Search for a value</td><td>O(n) (O(log n) if sorted)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Extra memory</td><td>none</td><td>one reference per node</td><td>two references per node</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.A · 1-ListDataStructures, slide 1–23</span>
<h2>Cấu trúc danh sách — học bộ slide từng trang</h2>
<p class="lead">Đây là bộ slide được chiếu ở các buổi đầu của môn (buổi 1–2 theo syllabus, CLO1). Hãy đọc bài này trước các bài 1.1–1.5 bên dưới: slide nào cũng có ý nghĩa, chương trình Java chạy được cho từng thao tác, các bước đổi con trỏ (pointer) vẽ lại bằng chữ, chi phí Big-O và những bẫy hay mất điểm ở FE (thi cuối kỳ) và PE (thi thực hành).</p>
<div class="callout"><strong>CLO1 trong syllabus:</strong> mô tả cấu trúc danh sách (list) và các cách cài đặt; <strong>cài đặt được danh sách liên kết đơn (singly linked list)</strong>. Đề PE gần như luôn có một câu về danh sách liên kết, nên slide 8–12 là phần bạn phải gõ lại được mà không cần nhìn.</div>
<h3>Cả bộ slide trong một bảng</h3>
<table>
<thead><tr><th>Thao tác</th><th>Mảng (array, n phần tử)</th><th>Danh sách liên kết đơn (có head + tail)</th><th>Danh sách liên kết đôi (doubly)</th></tr></thead>
<tbody>
<tr><td>Đọc phần tử thứ i</td><td>O(1) — <code>a[i]</code></td><td>O(n) — đi từ head</td><td>O(n)</td></tr>
<tr><td>Chèn / xoá ở đầu</td><td>O(n) — phải dời cả mảng</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>Chèn ở cuối</td><td>O(1) nếu còn chỗ</td><td>O(1) nhờ <code>tail</code></td><td>O(1)</td></tr>
<tr><td>Xoá ở cuối</td><td>O(1)</td><td>O(n) — phải tìm nút đứng trước <code>tail</code></td><td>O(1) — <code>tail.prev</code></td></tr>
<tr><td>Chèn / xoá ở giữa, đã biết vị trí</td><td>O(n) — dời phần tử</td><td>O(1) khi đã cầm nút đứng trước</td><td>O(1)</td></tr>
<tr><td>Tìm một giá trị</td><td>O(n) (O(log n) nếu đã sắp xếp)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Bộ nhớ thêm</td><td>không</td><td>một tham chiếu mỗi nút</td><td>hai tham chiếu mỗi nút</td></tr>
</tbody>
</table>`),
    walkHead('csd4', 1, 23),
    walk('csd4', [
      [1, '1. List Data Structure',
        `<p class="y-chinh">🎯 Chapter 1 opens with the first structure of the course: the list, stored either in an array or in linked nodes.</p>
<p>Everything later in CSD201 — stacks, queues, trees, graphs — is built from the two ideas of this deck: <strong>contiguous storage</strong> (arrays) and <strong>nodes joined by references</strong> (linked lists).</p>`,
        `<p class="y-chinh">🎯 Chương 1 mở đầu bằng cấu trúc đầu tiên của môn: danh sách (list), lưu trong mảng (array) hoặc trong các nút (node) nối với nhau.</p>
<p>Mọi thứ phía sau của CSD201 — ngăn xếp (stack), hàng đợi (queue), cây (tree), đồ thị (graph) — đều dựng từ hai ý của bộ slide này: <strong>lưu liền nhau</strong> trong mảng và <strong>các nút nối bằng tham chiếu (reference)</strong> trong danh sách liên kết (linked list).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Four goals: what a list is, self-referential structures, the three kinds of linked list, and the lists Java already gives you.</p>
<ol>
<li><strong>Describe list structures</strong> — slides 3–4 (the list ADT and why a plain array is not always enough)</li>
<li><strong>Self-referential structures</strong> — slide 5 (a class holding a reference to its own type)</li>
<li><strong>Types of linked lists</strong> — singly (slides 6–12), circular (13–15), doubly (16–18)</li>
<li><strong>Lists in java.util</strong> — <code>LinkedList</code> and <code>ArrayList</code> (slides 19–21)</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> one ADT, several implementations — the whole chapter compares the <em>same</em> operations on different storage.</p>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu: danh sách là gì, cấu trúc tự tham chiếu, ba loại danh sách liên kết, và các danh sách Java có sẵn.</p>
<ol>
<li><strong>Mô tả cấu trúc danh sách</strong> — slide 3–4 (ADT danh sách và vì sao mảng thường chưa đủ)</li>
<li><strong>Cấu trúc tự tham chiếu (self-referential structure)</strong> — slide 5 (lớp có trường tham chiếu tới chính kiểu của nó)</li>
<li><strong>Các loại danh sách liên kết</strong> — đơn (singly, slide 6–12), vòng (circular, 13–15), đôi (doubly, 16–18)</li>
<li><strong>Danh sách trong gói java.util</strong> — lớp <code>LinkedList</code> và <code>ArrayList</code> (slide 19–21)</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một ADT (abstract data type — kiểu dữ liệu trừu tượng), nhiều cách cài đặt — cả chương so sánh <em>cùng</em> các thao tác trên những cách lưu khác nhau.</p>`],
      [3, 'List Data Structures',
        `<p class="y-chinh">🎯 A list is a sequence of items of one base type in which items can be added, deleted and read at any position — the slide lists the operations of this ADT.</p>
<ul>
<li><strong>ADT</strong> (abstract data type) = the <em>what</em>: the possible values (every sequence of BaseType items, including the empty one) and the operations — not the <em>how</em>.</li>
<li><strong>Two ways to build it</strong>: an array, or a dynamic array that grows so there is no fixed maximum; or a linked list of nodes joined by references. Their costs are very different.</li>
<li><strong>The operations on the slide</strong>: <code>getFirst()</code>, <code>getLast()</code>, <code>getNext(p)</code>, <code>getPrev(p)</code>, <code>get(p)</code>, <code>set(p,x)</code>, <code>insert(p,x)</code>, <code>remove(p)</code>, <code>removeFirst()</code>, <code>removeLast()</code>, <code>removeNext(p)</code>, <code>removePrev(p)</code>, <code>find(x)</code>, <code>size()</code>. Here <code>p</code> is a <em>position</em> — in a linked list, a node — not necessarily an index.</li>
</ul>
<p>Java is organised the same way: the interface <code>List</code> is the ADT, <code>ArrayList</code> and <code>LinkedList</code> are two implementations. One method written against <code>List</code> runs unchanged on both:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class ListAdt {
    // One method written against the List ADT works for every implementation
    static void demo(List&lt;Integer&gt; list) {
        list.add(10);                         // insert at the end
        list.add(20);
        list.add(30);
        list.add(1, 15);                      // insert(p, x): put 15 at position 1
        list.remove(Integer.valueOf(20));     // remove the element 20
        System.out.println(list.getClass().getSimpleName() + ": " + list
                + "  size=" + list.size()
                + "  first=" + list.get(0)
                + "  last=" + list.get(list.size() - 1)
                + "  find(30)=" + list.indexOf(30));
    }

    public static void main(String[] args) {
        demo(new ArrayList&lt;Integer&gt;());       // implemented with an array
        demo(new LinkedList&lt;Integer&gt;());      // implemented with linked nodes
    }
}</code></pre>
<div class="out">ArrayList: [10, 15, 30] &nbsp;size=3 &nbsp;first=10 &nbsp;last=30 &nbsp;find(30)=2<br>
LinkedList: [10, 15, 30] &nbsp;size=3 &nbsp;first=10 &nbsp;last=30 &nbsp;find(30)=2</div>
<div class="pitfall">An ADT question is never about storage. An FE option such as "a list must be stored in contiguous memory" is false: it describes one implementation (the array), not the list ADT.</div>`,
        `<p class="y-chinh">🎯 Danh sách (list) là một dãy phần tử cùng một kiểu cơ sở, cho phép thêm, xoá, đọc ở bất kỳ vị trí nào — slide liệt kê các thao tác của ADT này.</p>
<ul>
<li><strong>ADT</strong> (abstract data type — kiểu dữ liệu trừu tượng) = phần <em>làm gì</em>: tập giá trị (mọi dãy phần tử kiểu BaseType, kể cả dãy rỗng) và các thao tác — không nói <em>làm thế nào</em>.</li>
<li><strong>Hai cách cài đặt</strong>: bằng mảng (array) hoặc mảng động (dynamic array) tự nới rộng để khỏi giới hạn kích thước; hoặc bằng danh sách liên kết (linked list) gồm các nút nối nhau bằng tham chiếu. Chi phí của hai cách rất khác nhau.</li>
<li><strong>Các thao tác trên slide</strong>: <code>getFirst()</code>, <code>getLast()</code>, <code>getNext(p)</code>, <code>getPrev(p)</code>, <code>get(p)</code>, <code>set(p,x)</code>, <code>insert(p,x)</code>, <code>remove(p)</code>, <code>removeFirst()</code>, <code>removeLast()</code>, <code>removeNext(p)</code>, <code>removePrev(p)</code>, <code>find(x)</code>, <code>size()</code>. Ở đây <code>p</code> là một <em>vị trí</em> (position) — với danh sách liên kết thì là một nút — không nhất thiết là chỉ số (index).</li>
</ul>
<p>Java tổ chức đúng như vậy: interface <code>List</code> là ADT, còn <code>ArrayList</code> và <code>LinkedList</code> là hai cách cài đặt. Một hàm viết cho <code>List</code> chạy y nguyên trên cả hai:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class ListAdt {
    // Một hàm viết theo ADT List chạy được với mọi cách cài đặt
    static void demo(List&lt;Integer&gt; list) {
        list.add(10);                         // chèn vào cuối
        list.add(20);
        list.add(30);
        list.add(1, 15);                      // insert(p, x): đặt 15 vào vị trí 1
        list.remove(Integer.valueOf(20));     // xoá phần tử có giá trị 20
        System.out.println(list.getClass().getSimpleName() + ": " + list
                + "  size=" + list.size()
                + "  first=" + list.get(0)
                + "  last=" + list.get(list.size() - 1)
                + "  find(30)=" + list.indexOf(30));
    }

    public static void main(String[] args) {
        demo(new ArrayList&lt;Integer&gt;());       // cài bằng mảng động
        demo(new LinkedList&lt;Integer&gt;());      // cài bằng các nút liên kết
    }
}</code></pre>
<div class="out">ArrayList: [10, 15, 30] &nbsp;size=3 &nbsp;first=10 &nbsp;last=30 &nbsp;find(30)=2<br>
LinkedList: [10, 15, 30] &nbsp;size=3 &nbsp;first=10 &nbsp;last=30 &nbsp;find(30)=2</div>
<div class="pitfall">Câu hỏi về ADT không bao giờ hỏi chuyện lưu trữ. Phương án FE kiểu "danh sách bắt buộc lưu trong vùng nhớ liền kề" là SAI: đó là mô tả một cách cài đặt (mảng), không phải ADT danh sách.</div>`],
      [4, 'Drawbacks of Arrays',
        `<p class="y-chinh">🎯 Arrays are fast to read, but they have three limits: the size is fixed at creation, and inserting or deleting in the middle forces other elements to move.</p>
<ol>
<li><strong>Size needed at creation</strong> — <code>new int[6]</code> can never hold a 7th element; growing means allocating a bigger array and copying everything, O(n).</li>
<li><strong>Insert in the middle</strong> — every element after the position moves one cell to the right.</li>
<li><strong>Delete in the middle</strong> — every element after it moves one cell to the left.</li>
</ol>
<p class="nhan">Step by step — insert 15 at index 1 of [10, 20, 30, 40, 50] (capacity 6)</p>
<table>
<thead><tr><th>Step</th><th>Cells 0–5</th><th>What happened</th></tr></thead>
<tbody>
<tr><td>start</td><td>10 20 30 40 50 _</td><td>n = 5</td></tr>
<tr><td>1</td><td>10 20 30 40 50 50</td><td><code>a[5] = a[4]</code></td></tr>
<tr><td>2</td><td>10 20 30 40 40 50</td><td><code>a[4] = a[3]</code></td></tr>
<tr><td>3</td><td>10 20 30 30 40 50</td><td><code>a[3] = a[2]</code></td></tr>
<tr><td>4</td><td>10 20 20 30 40 50</td><td><code>a[2] = a[1]</code></td></tr>
<tr><td>5</td><td>10 15 20 30 40 50</td><td><code>a[1] = 15</code> — 4 moves in total</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Arrays;

public class ArrayShift {
    static int moves = 0;                     // how many elements had to move

    // Insert x at index pos; n = number of cells in use
    static int insertAt(int[] a, int n, int pos, int x) {
        if (n == a.length) throw new IllegalStateException("array is full");
        for (int i = n; i &gt; pos; i--) {       // shift right, from the back
            a[i] = a[i - 1];
            moves++;
        }
        a[pos] = x;
        return n + 1;
    }

    // Delete the element at index pos
    static int deleteAt(int[] a, int n, int pos) {
        for (int i = pos; i &lt; n - 1; i++) {   // shift left to close the gap
            a[i] = a[i + 1];
            moves++;
        }
        return n - 1;
    }

    public static void main(String[] args) {
        int[] a = new int[6];                 // the size is fixed when the array is created
        int n = 0;
        for (int v : new int[] {10, 20, 30, 40, 50}) a[n++] = v;

        n = insertAt(a, n, 1, 15);
        System.out.println("insert 15 at index 1 -&gt; " + Arrays.toString(Arrays.copyOf(a, n)) + "  moves=" + moves);
        moves = 0;
        n = deleteAt(a, n, 2);
        System.out.println("delete index 2      -&gt; " + Arrays.toString(Arrays.copyOf(a, n)) + "  moves=" + moves);
        n = insertAt(a, n, 0, 5);
        System.out.println("insert 5 at index 0 -&gt; " + Arrays.toString(Arrays.copyOf(a, n)));
        try {
            insertAt(a, n, 0, 1);             // a 7th element does not fit
        } catch (IllegalStateException e) {
            System.out.println("insert 1 at index 0 -&gt; " + e.getMessage());
        }
    }
}</code></pre>
<div class="out">insert 15 at index 1 -&gt; [10, 15, 20, 30, 40, 50] &nbsp;moves=4<br>
delete index 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [10, 15, 30, 40, 50] &nbsp;moves=3<br>
insert 5 at index 0 -&gt; [5, 10, 15, 30, 40, 50]<br>
insert 1 at index 0 -&gt; array is full</div>
<p><strong>Big-O:</strong> inserting or deleting at index i moves n − i elements → O(n) in the worst case (i = 0). Reading <code>a[i]</code> stays O(1) — that is what arrays are good at.</p>
<div class="pitfall">When inserting, shift from the <em>back</em> (<code>for (i = n; i &gt; pos; i--)</code>). Shifting from the front overwrites values you still need — a classic PE bug.</div>`,
        `<p class="y-chinh">🎯 Mảng đọc rất nhanh nhưng có ba giới hạn: kích thước cố định lúc tạo, và chèn/xoá ở giữa buộc các phần tử khác phải dời chỗ.</p>
<ol>
<li><strong>Phải biết kích thước khi tạo</strong> — <code>new int[6]</code> không bao giờ chứa được phần tử thứ 7; muốn lớn hơn phải cấp mảng mới rồi chép toàn bộ sang, tốn O(n).</li>
<li><strong>Chèn vào giữa</strong> — mọi phần tử phía sau vị trí chèn dời sang phải một ô.</li>
<li><strong>Xoá ở giữa</strong> — mọi phần tử phía sau dời sang trái một ô.</li>
</ol>
<p class="nhan">Từng bước — chèn 15 vào chỉ số 1 của [10, 20, 30, 40, 50] (sức chứa 6)</p>
<table>
<thead><tr><th>Bước</th><th>Ô 0–5</th><th>Việc vừa làm</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>10 20 30 40 50 _</td><td>n = 5</td></tr>
<tr><td>1</td><td>10 20 30 40 50 50</td><td><code>a[5] = a[4]</code></td></tr>
<tr><td>2</td><td>10 20 30 40 40 50</td><td><code>a[4] = a[3]</code></td></tr>
<tr><td>3</td><td>10 20 30 30 40 50</td><td><code>a[3] = a[2]</code></td></tr>
<tr><td>4</td><td>10 20 20 30 40 50</td><td><code>a[2] = a[1]</code></td></tr>
<tr><td>5</td><td>10 15 20 30 40 50</td><td><code>a[1] = 15</code> — tổng cộng 4 lần dời</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Arrays;

public class ArrayShift {
    static int moves = 0;                     // đếm số phần tử phải dời chỗ

    // Chèn x vào chỉ số pos; n = số ô đang dùng
    static int insertAt(int[] a, int n, int pos, int x) {
        if (n == a.length) throw new IllegalStateException("array is full");
        for (int i = n; i &gt; pos; i--) {       // dời sang phải, làm từ cuối về
            a[i] = a[i - 1];
            moves++;
        }
        a[pos] = x;
        return n + 1;
    }

    // Xoá phần tử ở chỉ số pos
    static int deleteAt(int[] a, int n, int pos) {
        for (int i = pos; i &lt; n - 1; i++) {   // dời sang trái để lấp chỗ trống
            a[i] = a[i + 1];
            moves++;
        }
        return n - 1;
    }

    public static void main(String[] args) {
        int[] a = new int[6];                 // kích thước cố định ngay lúc tạo mảng
        int n = 0;
        for (int v : new int[] {10, 20, 30, 40, 50}) a[n++] = v;

        n = insertAt(a, n, 1, 15);
        System.out.println("insert 15 at index 1 -&gt; " + Arrays.toString(Arrays.copyOf(a, n)) + "  moves=" + moves);
        moves = 0;
        n = deleteAt(a, n, 2);
        System.out.println("delete index 2      -&gt; " + Arrays.toString(Arrays.copyOf(a, n)) + "  moves=" + moves);
        n = insertAt(a, n, 0, 5);
        System.out.println("insert 5 at index 0 -&gt; " + Arrays.toString(Arrays.copyOf(a, n)));
        try {
            insertAt(a, n, 0, 1);             // phần tử thứ 7 không còn chỗ
        } catch (IllegalStateException e) {
            System.out.println("insert 1 at index 0 -&gt; " + e.getMessage());
        }
    }
}</code></pre>
<div class="out">insert 15 at index 1 -&gt; [10, 15, 20, 30, 40, 50] &nbsp;moves=4<br>
delete index 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [10, 15, 30, 40, 50] &nbsp;moves=3<br>
insert 5 at index 0 -&gt; [5, 10, 15, 30, 40, 50]<br>
insert 1 at index 0 -&gt; array is full</div>
<p><strong>Big-O:</strong> chèn hay xoá ở chỉ số i phải dời n − i phần tử → O(n) trong trường hợp xấu nhất (i = 0). Còn đọc <code>a[i]</code> vẫn là O(1) — đó là thế mạnh của mảng.</p>
<div class="pitfall">Khi chèn, phải dời từ <em>cuối về</em> (<code>for (i = n; i &gt; pos; i--)</code>). Dời từ đầu sẽ ghi đè lên các giá trị còn cần dùng — lỗi PE kinh điển.</div>`],
      [5, 'Self-Referential Structures',
        `<p class="y-chinh">🎯 A self-referential class has a field whose type is the class itself — that single idea lets us build chains (linked lists) and trees.</p>
<ul>
<li><strong>List node</strong> (slide, left): <code>class DataNode { Employee info; DataNode next; }</code> — one link.</li>
<li><strong>Tree node</strong> (slide, right): <code>class DataNode { Employee info; DataNode left; DataNode right; }</code> — two links.</li>
<li><strong>Why it is legal</strong>: in Java a field of class type stores a <em>reference</em> (the address of an object) or <code>null</code> — not a whole object inside the object — so there is no infinite nesting.</li>
</ul>
<pre><code class="language-java">class Employee {
    String name;
    int age;

    Employee(String name, int age) { this.name = name; this.age = age; }
}

class DataNode {                              // self-referential: it has a field of its own type
    Employee info;
    DataNode next;                            // a reference to another DataNode, or null

    DataNode(Employee info, DataNode next) { this.info = info; this.next = next; }
}

public class SelfRef {
    public static void main(String[] args) {
        DataNode c = new DataNode(new Employee("Chi", 22), null);
        DataNode b = new DataNode(new Employee("Binh", 25), c);
        DataNode a = new DataNode(new Employee("An", 30), b);   // chain a -&gt; b -&gt; c

        for (DataNode p = a; p != null; p = p.next) {           // follow the references
            System.out.println(p.info.name + " (" + p.info.age + ")"
                    + (p.next == null ? "   &lt;- next is null: end of the chain" : "   -&gt; next is " + p.next.info.name));
        }
    }
}</code></pre>
<div class="out">An (30) &nbsp;&nbsp;-&gt; next is Binh<br>
Binh (25) &nbsp;&nbsp;-&gt; next is Chi<br>
Chi (22) &nbsp;&nbsp;&lt;- next is null: end of the chain</div>
<p class="meo">🧠 <strong>Remember:</strong> the data (<code>Employee</code>) and the link (<code>next</code>) sit side by side in one node; the chain ends where <code>next == null</code>.</p>`,
        `<p class="y-chinh">🎯 Lớp tự tham chiếu (self-referential) có một trường mang kiểu của chính lớp đó — chỉ một ý này thôi đã đủ để dựng chuỗi (danh sách liên kết) và cây.</p>
<ul>
<li><strong>Nút danh sách</strong> (bên trái slide): <code>class DataNode { Employee info; DataNode next; }</code> — một liên kết.</li>
<li><strong>Nút cây</strong> (bên phải slide): <code>class DataNode { Employee info; DataNode left; DataNode right; }</code> — hai liên kết (con trái, con phải).</li>
<li><strong>Vì sao hợp lệ</strong>: trong Java, trường có kiểu lớp chỉ lưu một <em>tham chiếu</em> (reference — địa chỉ của đối tượng) hoặc <code>null</code>, không nhét cả đối tượng vào trong đối tượng, nên không bị lồng vô hạn.</li>
</ul>
<pre><code class="language-java">class Employee {
    String name;
    int age;

    Employee(String name, int age) { this.name = name; this.age = age; }
}

class DataNode {                              // tự tham chiếu: có một trường cùng kiểu với chính nó
    Employee info;
    DataNode next;                            // tham chiếu tới một DataNode khác, hoặc null

    DataNode(Employee info, DataNode next) { this.info = info; this.next = next; }
}

public class SelfRef {
    public static void main(String[] args) {
        DataNode c = new DataNode(new Employee("Chi", 22), null);
        DataNode b = new DataNode(new Employee("Binh", 25), c);
        DataNode a = new DataNode(new Employee("An", 30), b);   // chuỗi a -&gt; b -&gt; c

        for (DataNode p = a; p != null; p = p.next) {           // đi theo các tham chiếu
            System.out.println(p.info.name + " (" + p.info.age + ")"
                    + (p.next == null ? "   &lt;- next is null: end of the chain" : "   -&gt; next is " + p.next.info.name));
        }
    }
}</code></pre>
<div class="out">An (30) &nbsp;&nbsp;-&gt; next is Binh<br>
Binh (25) &nbsp;&nbsp;-&gt; next is Chi<br>
Chi (22) &nbsp;&nbsp;&lt;- next is null: end of the chain</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> dữ liệu (<code>Employee</code>) và liên kết (<code>next</code>) nằm cạnh nhau trong một nút; chuỗi kết thúc ở nút có <code>next == null</code>.</p>`],
      [6, 'Linked Lists',
        `<p class="y-chinh">🎯 A linked list is a linear data structure made of nodes, each holding some information and a reference to another node.</p>
<ul>
<li><strong>Linked structure</strong>: a collection of nodes storing data and links to other nodes.</li>
<li><strong>Linear</strong>: each item has at most one predecessor and at most one successor — array, linked list, stack, queue.</li>
<li><strong>Non-linear</strong>: everything else — tree (one parent, several children), graph (any number of neighbours).</li>
<li><strong>Two basic kinds</strong> on the slide: singly linked (one link, <code>next</code>) and doubly linked (two links, <code>prev</code> and <code>next</code>).</li>
</ul>
<p><strong>The trade-off:</strong> no shifting — inserting or deleting at a node you already hold is O(1) — but no index jump: reaching position i takes i steps, O(n).</p>
<div class="pitfall">"A linked list is non-linear because its nodes are scattered in memory" — false. Linear vs non-linear is about the <em>logical</em> order (at most one successor), not about where the nodes sit in RAM.</div>`,
        `<p class="y-chinh">🎯 Danh sách liên kết (linked list) là cấu trúc tuyến tính gồm các nút, mỗi nút giữ một ít thông tin và một tham chiếu tới nút khác.</p>
<ul>
<li><strong>Cấu trúc liên kết (linked structure)</strong>: tập các nút chứa dữ liệu và liên kết tới các nút khác.</li>
<li><strong>Tuyến tính (linear)</strong>: mỗi phần tử có nhiều nhất một phần tử đứng trước (predecessor) và một phần tử đứng sau (successor) — mảng, danh sách liên kết, stack, queue.</li>
<li><strong>Phi tuyến (non-linear)</strong>: mọi thứ còn lại — cây (một cha, nhiều con), đồ thị (bao nhiêu láng giềng cũng được).</li>
<li><strong>Hai loại cơ bản</strong> trên slide: liên kết đơn (singly — một liên kết <code>next</code>) và liên kết đôi (doubly — hai liên kết <code>prev</code> và <code>next</code>).</li>
</ul>
<p><strong>Đánh đổi:</strong> không phải dời phần tử — chèn/xoá tại một nút đang cầm trong tay là O(1) — nhưng không nhảy thẳng theo chỉ số được: tới vị trí i phải đi i bước, O(n).</p>
<div class="pitfall">"Danh sách liên kết là phi tuyến vì các nút nằm rải rác trong bộ nhớ" — SAI. Tuyến tính hay phi tuyến là nói về thứ tự <em>logic</em> (nhiều nhất một phần tử đứng sau), không phải vị trí các nút trong RAM.</div>`],
      [7, 'Singly Linked Lists',
        `<p class="y-chinh">🎯 In a singly linked list each node has two fields: <code>info</code> (the data the user cares about) and <code>next</code> (the link to its successor).</p>
<p>The slide's picture shows a small integer list with two extra references, <code>head</code> (first node) and <code>tail</code> (last node). The same shape as text, with example values:</p>
<pre><code class="language-plaintext">head                          tail
 |                             |
 v                             v
[5|*]----&gt;[8|*]----&gt;[3|*]----&gt;[9|null]</code></pre>
<ul>
<li>The last node's <code>next</code> is <code>null</code> — that is how a loop knows it has reached the end.</li>
<li><code>tail</code> is optional, but it turns "add at the end" from O(n) into O(1) (slide 10).</li>
<li>Empty list: <code>head == null</code>, and then <code>tail == null</code> too.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "the list" is only the reference <code>head</code>. Lose it and every node is lost — the garbage collector frees them.</p>`,
        `<p class="y-chinh">🎯 Trong danh sách liên kết đơn (singly linked list), mỗi nút có hai trường: <code>info</code> (dữ liệu người dùng quan tâm) và <code>next</code> (liên kết tới nút đứng sau).</p>
<p>Hình trên slide là một danh sách số nguyên nhỏ kèm hai tham chiếu phụ: <code>head</code> (nút đầu) và <code>tail</code> (nút cuối). Vẽ lại bằng chữ, với giá trị ví dụ:</p>
<pre><code class="language-plaintext">head                          tail
 |                             |
 v                             v
[5|*]----&gt;[8|*]----&gt;[3|*]----&gt;[9|null]</code></pre>
<ul>
<li><code>next</code> của nút cuối là <code>null</code> — nhờ vậy vòng lặp biết đã tới cuối danh sách.</li>
<li><code>tail</code> không bắt buộc, nhưng nó biến "thêm vào cuối" từ O(n) thành O(1) (slide 10).</li>
<li>Danh sách rỗng: <code>head == null</code>, khi đó <code>tail == null</code> luôn.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "cả danh sách" chỉ là tham chiếu <code>head</code>. Mất <code>head</code> là mất hết các nút — bộ dọn rác (garbage collector) sẽ thu hồi chúng.</p>`],
      [8, 'Singly Linked List Implementation',
        `<p class="y-chinh">🎯 The slide's code is the skeleton you will type in the PE: a <code>Node</code> class plus a <code>MyList</code> class holding <code>head</code> and <code>tail</code>.</p>
<ul>
<li><code>Node(int x, Node p)</code> — creates a node holding x whose <code>next</code> is p.</li>
<li><code>isEmpty()</code> is <code>head == null</code>; <code>clear()</code> sets <code>head = tail = null</code> and the nodes become garbage.</li>
<li><code>add(x)</code> appends at the end: the empty case sets both <code>head</code> and <code>tail</code>; otherwise link after <code>tail</code> and move <code>tail</code>.</li>
<li><code>traverse()</code> walks a pointer <code>p</code> from <code>head</code> until <code>null</code>.</li>
<li><code>search(x)</code> and <code>dele(x)</code> are only <code>{...}</code> on the slide — below they are written in full; <code>dele</code> keeps a trailing pointer <code>f</code> one node behind <code>p</code>.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node() {}
    Node(int x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    MyList() { head = tail = null; }
    boolean isEmpty() { return head == null; }
    void clear() { head = tail = null; }

    void add(int x) {                         // add at the end (as on the slide)
        if (isEmpty()) head = tail = new Node(x, null);
        else {
            Node q = new Node(x, null);
            tail.next = q;
            tail = q;
        }
    }

    void traverse() {
        Node p = head;
        while (p != null) {
            System.out.print("  " + p.info);
            p = p.next;
        }
        System.out.println();
    }

    Node search(int x) {                      // first node whose info == x, or null
        Node p = head;
        while (p != null &amp;&amp; p.info != x) p = p.next;
        return p;
    }

    void dele(int x) {                        // delete the first node whose info == x
        if (isEmpty()) return;
        if (head.info == x) {                 // case 1: x is in the head
            head = head.next;
            if (head == null) tail = null;
            return;
        }
        Node f = head, p = head.next;         // f always stays one node behind p
        while (p != null &amp;&amp; p.info != x) {
            f = p;
            p = p.next;
        }
        if (p == null) return;                // x is not in the list
        f.next = p.next;                      // link around p
        if (p == tail) tail = f;              // we removed the last node
    }
}

public class MyListDemo {
    public static void main(String[] args) {
        MyList t = new MyList();
        for (int x : new int[] {5, 8, 3, 9}) t.add(x);
        t.traverse();
        System.out.println("search(3) found: " + (t.search(3) != null) + ", search(7) found: " + (t.search(7) != null));
        t.dele(5);                            // delete the head
        t.traverse();
        t.dele(9);                            // delete the tail
        t.traverse();
        System.out.println("tail is now " + t.tail.info);
        t.add(4);                             // works only because tail was kept right
        t.traverse();
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;5 &nbsp;8 &nbsp;3 &nbsp;9<br>
search(3) found: true, search(7) found: false<br>
&nbsp;&nbsp;8 &nbsp;3 &nbsp;9<br>
&nbsp;&nbsp;8 &nbsp;3<br>
tail is now 3<br>
&nbsp;&nbsp;8 &nbsp;3 &nbsp;4</div>
<p><strong>Big-O:</strong> <code>add</code>, <code>isEmpty</code>, <code>clear</code> are O(1); <code>traverse</code>, <code>search</code>, <code>dele</code> are O(n).</p>
<div class="pitfall">Deleting the last node without updating <code>tail</code> leaves <code>tail</code> pointing at a node that is no longer in the list, and the next <code>add</code> attaches to nothing. After every delete ask: did I just remove the head? the tail?</div>`,
        `<p class="y-chinh">🎯 Code trên slide chính là bộ khung bạn sẽ gõ trong PE: lớp <code>Node</code> và lớp <code>MyList</code> giữ <code>head</code> và <code>tail</code>.</p>
<ul>
<li><code>Node(int x, Node p)</code> — tạo nút chứa x, có <code>next</code> là p.</li>
<li><code>isEmpty()</code> là <code>head == null</code>; <code>clear()</code> gán <code>head = tail = null</code>, các nút cũ thành rác (garbage).</li>
<li><code>add(x)</code> thêm vào cuối: trường hợp rỗng gán cả <code>head</code> lẫn <code>tail</code>; ngược lại nối sau <code>tail</code> rồi dời <code>tail</code>.</li>
<li><code>traverse()</code> (duyệt) cho con trỏ <code>p</code> đi từ <code>head</code> tới khi gặp <code>null</code>.</li>
<li><code>search(x)</code> (tìm) và <code>dele(x)</code> (xoá) trên slide chỉ ghi <code>{...}</code> — dưới đây viết đầy đủ; <code>dele</code> dùng thêm con trỏ <code>f</code> luôn đi sau <code>p</code> một nút.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node() {}
    Node(int x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    MyList() { head = tail = null; }
    boolean isEmpty() { return head == null; }
    void clear() { head = tail = null; }

    void add(int x) {                         // thêm vào cuối (đúng như slide)
        if (isEmpty()) head = tail = new Node(x, null);
        else {
            Node q = new Node(x, null);
            tail.next = q;
            tail = q;
        }
    }

    void traverse() {
        Node p = head;
        while (p != null) {
            System.out.print("  " + p.info);
            p = p.next;
        }
        System.out.println();
    }

    Node search(int x) {                      // nút đầu tiên có info == x, hoặc null
        Node p = head;
        while (p != null &amp;&amp; p.info != x) p = p.next;
        return p;
    }

    void dele(int x) {                        // xoá nút đầu tiên có info == x
        if (isEmpty()) return;
        if (head.info == x) {                 // trường hợp 1: x nằm ở head
            head = head.next;
            if (head == null) tail = null;
            return;
        }
        Node f = head, p = head.next;         // f luôn đi sau p đúng một nút
        while (p != null &amp;&amp; p.info != x) {
            f = p;
            p = p.next;
        }
        if (p == null) return;                // x không có trong danh sách
        f.next = p.next;                      // nối vòng qua p
        if (p == tail) tail = f;              // vừa xoá nút cuối
    }
}

public class MyListDemo {
    public static void main(String[] args) {
        MyList t = new MyList();
        for (int x : new int[] {5, 8, 3, 9}) t.add(x);
        t.traverse();
        System.out.println("search(3) found: " + (t.search(3) != null) + ", search(7) found: " + (t.search(7) != null));
        t.dele(5);                            // xoá head
        t.traverse();
        t.dele(9);                            // xoá tail
        t.traverse();
        System.out.println("tail is now " + t.tail.info);
        t.add(4);                             // chỉ đúng vì tail đã được cập nhật
        t.traverse();
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;5 &nbsp;8 &nbsp;3 &nbsp;9<br>
search(3) found: true, search(7) found: false<br>
&nbsp;&nbsp;8 &nbsp;3 &nbsp;9<br>
&nbsp;&nbsp;8 &nbsp;3<br>
tail is now 3<br>
&nbsp;&nbsp;8 &nbsp;3 &nbsp;4</div>
<p><strong>Big-O:</strong> <code>add</code>, <code>isEmpty</code>, <code>clear</code> là O(1); <code>traverse</code>, <code>search</code>, <code>dele</code> là O(n).</p>
<div class="pitfall">Xoá nút cuối mà quên cập nhật <code>tail</code> thì <code>tail</code> vẫn trỏ vào một nút không còn trong danh sách, và lệnh <code>add</code> kế tiếp nối vào "hư không". Sau mỗi lần xoá hãy tự hỏi: mình vừa xoá head? hay tail?</div>`],
      [9, 'Singly Linked Lists - 1: inserting a new node at the beginning',
        `<p class="y-chinh">🎯 Inserting at the beginning takes a few pointer moves and costs O(1), however long the list is.</p>
<p>The slide draws the steps as pictures; here is the same operation done step by step on an example:</p>
<ol>
<li>Create the new node holding the value.</li>
<li>Set its <code>next</code> to the current <code>head</code>.</li>
<li>Move <code>head</code> to the new node.</li>
<li>If the list was empty, <code>tail</code> must point to it as well.</li>
</ol>
<p class="nhan">State after each step — addFirst(10) on head → 20 → 30</p>
<table>
<thead><tr><th>Step</th><th>Code</th><th>head points to</th><th>The list read from head</th></tr></thead>
<tbody>
<tr><td>0</td><td>(start)</td><td>20</td><td>20 → 30</td></tr>
<tr><td>1–2</td><td><code>Node q = new Node(10, head);</code></td><td>20</td><td>20 → 30 (q = [10] → 20 exists but is not reachable from head yet)</td></tr>
<tr><td>3</td><td><code>head = q;</code></td><td>10</td><td>10 → 20 → 30</td></tr>
<tr><td>4</td><td><code>if (tail == null) tail = q;</code></td><td>10</td><td>unchanged — tail stays 30 because the list was not empty</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class AddFirst {
    static Node head, tail;

    static void addFirst(int x) {
        Node q = new Node(x, head);           // 1-2. new node; its next = the old head
        head = q;                             // 3. head now points to the new node
        if (tail == null) tail = q;           // 4. the list was empty: tail too
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null   (tail = ").append(tail == null ? "null" : String.valueOf(tail.info)).append(")").toString();
    }

    public static void main(String[] args) {
        System.out.println("start:        " + show());
        for (int x : new int[] {30, 20, 10}) {
            addFirst(x);
            System.out.println("addFirst(" + x + "): " + show());
        }
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head -&gt; null &nbsp;&nbsp;(tail = null)<br>
addFirst(30): head -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)<br>
addFirst(20): head -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)<br>
addFirst(10): head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)</div>
<p><strong>Big-O:</strong> O(1) — no loop, just a constant number of assignments.</p>
<p class="meo">🧠 <strong>Order matters:</strong> link the new node to the old head <em>before</em> moving <code>head</code>. Doing it the other way round makes the new node point to itself and loses the rest of the list.</p>`,
        `<p class="y-chinh">🎯 Chèn vào đầu danh sách chỉ cần vài lần đổi con trỏ và tốn O(1), dù danh sách dài bao nhiêu.</p>
<p>Slide vẽ các bước bằng hình; dưới đây là đúng thao tác đó làm từng bước trên một ví dụ:</p>
<ol>
<li>Tạo nút mới chứa giá trị.</li>
<li>Gán <code>next</code> của nó bằng <code>head</code> hiện tại.</li>
<li>Dời <code>head</code> sang nút mới.</li>
<li>Nếu danh sách đang rỗng thì <code>tail</code> cũng phải trỏ vào nút này.</li>
</ol>
<p class="nhan">Trạng thái sau từng bước — addFirst(10) trên head → 20 → 30</p>
<table>
<thead><tr><th>Bước</th><th>Code</th><th>head trỏ tới</th><th>Danh sách đọc từ head</th></tr></thead>
<tbody>
<tr><td>0</td><td>(bắt đầu)</td><td>20</td><td>20 → 30</td></tr>
<tr><td>1–2</td><td><code>Node q = new Node(10, head);</code></td><td>20</td><td>20 → 30 (q = [10] → 20 đã có nhưng chưa đi tới được từ head)</td></tr>
<tr><td>3</td><td><code>head = q;</code></td><td>10</td><td>10 → 20 → 30</td></tr>
<tr><td>4</td><td><code>if (tail == null) tail = q;</code></td><td>10</td><td>không đổi — tail vẫn là 30 vì danh sách không rỗng</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class AddFirst {
    static Node head, tail;

    static void addFirst(int x) {
        Node q = new Node(x, head);           // 1-2. tạo nút mới; next của nó = head cũ
        head = q;                             // 3. head trỏ sang nút mới
        if (tail == null) tail = q;           // 4. danh sách đang rỗng: tail cũng trỏ nút này
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null   (tail = ").append(tail == null ? "null" : String.valueOf(tail.info)).append(")").toString();
    }

    public static void main(String[] args) {
        System.out.println("start:        " + show());
        for (int x : new int[] {30, 20, 10}) {
            addFirst(x);
            System.out.println("addFirst(" + x + "): " + show());
        }
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head -&gt; null &nbsp;&nbsp;(tail = null)<br>
addFirst(30): head -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)<br>
addFirst(20): head -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)<br>
addFirst(10): head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)</div>
<p><strong>Big-O:</strong> O(1) — không có vòng lặp, chỉ một số phép gán cố định.</p>
<p class="meo">🧠 <strong>Thứ tự quan trọng:</strong> nối nút mới vào head cũ <em>trước</em>, rồi mới dời <code>head</code>. Làm ngược lại thì nút mới tự trỏ vào chính nó và phần còn lại của danh sách bị mất.</p>`],
      [10, 'Singly Linked Lists - 2: inserting a new node at the end',
        `<p class="y-chinh">🎯 Inserting at the end is O(1) when the list keeps a <code>tail</code> reference, and O(n) when it does not.</p>
<ol>
<li>Create the node with <code>next = null</code> — it will be the last one.</li>
<li>Empty list → <code>head = tail = node</code>.</li>
<li>Otherwise <code>tail.next = node</code> (the old last node links to it)…</li>
<li>…then <code>tail = node</code>.</li>
</ol>
<p class="nhan">State after each step — addLast(30) on head → 10 → 20 (tail = 20)</p>
<table>
<thead><tr><th>Step</th><th>Code</th><th>tail</th><th>The list read from head</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>Node q = new Node(30, null);</code></td><td>20</td><td>10 → 20 (q exists alone)</td></tr>
<tr><td>3</td><td><code>tail.next = q;</code></td><td>20</td><td>10 → 20 → 30</td></tr>
<tr><td>4</td><td><code>tail = q;</code></td><td>30</td><td>10 → 20 → 30</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class AddLast {
    static Node head, tail;

    static void addLast(int x) {
        Node q = new Node(x, null);           // 1. the new last node points to null
        if (head == null) {                   // 2. empty list: both ends are q
            head = tail = q;
            return;
        }
        tail.next = q;                        // 3. the old last node links to q
        tail = q;                             // 4. tail moves to q
    }

    // Without a tail reference we must walk from head to the end: O(n)
    static int addLastWithoutTail(int x) {
        Node q = new Node(x, null);
        if (head == null) { head = q; return 0; }
        Node p = head;
        int steps = 0;
        while (p.next != null) { p = p.next; steps++; }
        p.next = q;
        tail = q;
        return steps;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null   (tail = ").append(tail.info).append(")").toString();
    }

    public static void main(String[] args) {
        for (int x : new int[] {10, 20, 30}) {
            addLast(x);
            System.out.println("addLast(" + x + "):  " + show());
        }
        int steps = addLastWithoutTail(40);
        System.out.println("no-tail version walked " + steps + " links to add 40: " + show());
    }
}</code></pre>
<div class="out">addLast(10): &nbsp;head -&gt; 10 -&gt; null &nbsp;&nbsp;(tail = 10)<br>
addLast(20): &nbsp;head -&gt; 10 -&gt; 20 -&gt; null &nbsp;&nbsp;(tail = 20)<br>
addLast(30): &nbsp;head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)<br>
no-tail version walked 2 links to add 40: head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; 40 -&gt; null &nbsp;&nbsp;(tail = 40)</div>
<p>The last line shows the price of having no <code>tail</code>: to add 40 the loop first walked from 10 to 30. For n nodes that is n − 1 steps, so appending n items one by one costs O(n²) in total instead of O(n).</p>
<div class="pitfall">Swapping steps 3 and 4 (<code>tail = node; tail.next = node;</code>) makes the new node point to itself and leaves it cut off from the list.</div>`,
        `<p class="y-chinh">🎯 Chèn vào cuối là O(1) nếu danh sách giữ tham chiếu <code>tail</code>, và O(n) nếu không có.</p>
<ol>
<li>Tạo nút với <code>next = null</code> — nó sẽ là nút cuối.</li>
<li>Danh sách rỗng → <code>head = tail = nút mới</code>.</li>
<li>Ngược lại <code>tail.next = nút mới</code> (nút cuối cũ nối sang nó)…</li>
<li>…rồi <code>tail = nút mới</code>.</li>
</ol>
<p class="nhan">Trạng thái sau từng bước — addLast(30) trên head → 10 → 20 (tail = 20)</p>
<table>
<thead><tr><th>Bước</th><th>Code</th><th>tail</th><th>Danh sách đọc từ head</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>Node q = new Node(30, null);</code></td><td>20</td><td>10 → 20 (q đứng riêng)</td></tr>
<tr><td>3</td><td><code>tail.next = q;</code></td><td>20</td><td>10 → 20 → 30</td></tr>
<tr><td>4</td><td><code>tail = q;</code></td><td>30</td><td>10 → 20 → 30</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class AddLast {
    static Node head, tail;

    static void addLast(int x) {
        Node q = new Node(x, null);           // 1. nút cuối mới trỏ tới null
        if (head == null) {                   // 2. danh sách rỗng: cả hai đầu là q
            head = tail = q;
            return;
        }
        tail.next = q;                        // 3. nút cuối cũ nối sang q
        tail = q;                             // 4. dời tail sang q
    }

    // Không có tail thì phải đi từ head tới cuối: O(n)
    static int addLastWithoutTail(int x) {
        Node q = new Node(x, null);
        if (head == null) { head = q; return 0; }
        Node p = head;
        int steps = 0;
        while (p.next != null) { p = p.next; steps++; }
        p.next = q;
        tail = q;
        return steps;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null   (tail = ").append(tail.info).append(")").toString();
    }

    public static void main(String[] args) {
        for (int x : new int[] {10, 20, 30}) {
            addLast(x);
            System.out.println("addLast(" + x + "):  " + show());
        }
        int steps = addLastWithoutTail(40);
        System.out.println("no-tail version walked " + steps + " links to add 40: " + show());
    }
}</code></pre>
<div class="out">addLast(10): &nbsp;head -&gt; 10 -&gt; null &nbsp;&nbsp;(tail = 10)<br>
addLast(20): &nbsp;head -&gt; 10 -&gt; 20 -&gt; null &nbsp;&nbsp;(tail = 20)<br>
addLast(30): &nbsp;head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(tail = 30)<br>
no-tail version walked 2 links to add 40: head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; 40 -&gt; null &nbsp;&nbsp;(tail = 40)</div>
<p>Dòng cuối cho thấy cái giá của việc không có <code>tail</code>: muốn thêm 40, vòng lặp phải đi từ 10 tới 30 trước. Với n nút là n − 1 bước, nên thêm lần lượt n phần tử tốn tổng cộng O(n²) thay vì O(n).</p>
<div class="pitfall">Đảo bước 3 và 4 (<code>tail = node; tail.next = node;</code>) làm nút mới tự trỏ vào chính nó và bị tách khỏi danh sách.</div>`],
      [11, 'Singly Linked Lists - 3: deleting a node from the beginning',
        `<p class="y-chinh">🎯 Deleting the first node is essentially "move <code>head</code> one step forward" — O(1) — plus two special cases.</p>
<ol>
<li>Empty list → nothing to delete: throw an exception or return a flag.</li>
<li>Save <code>head.info</code> so it can be returned.</li>
<li>Only one node (<code>head == tail</code>) → <code>head = tail = null</code>.</li>
<li>Otherwise <code>head = head.next</code>; the old first node has no reference left and is garbage-collected.</li>
</ol>
<table>
<thead><tr><th>List before</th><th>Case</th><th>Code</th><th>head / tail after</th></tr></thead>
<tbody>
<tr><td>10 → 20 → 30</td><td>several nodes</td><td><code>head = head.next;</code></td><td>head = 20, tail = 30</td></tr>
<tr><td>30</td><td>one node (<code>head == tail</code>)</td><td><code>head = tail = null;</code></td><td>both null</td></tr>
<tr><td>(empty)</td><td>nothing to delete</td><td><code>throw …</code></td><td>unchanged</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class RemoveFirst {
    static Node head, tail;

    static int removeFirst() {
        if (head == null) throw new RuntimeException("list is empty");   // nothing to delete
        int x = head.info;                    // 1. keep the value
        if (head == tail) head = tail = null; // 2a. it was the only node
        else head = head.next;                // 2b. head moves on; the old node becomes garbage
        return x;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null").toString();
    }

    public static void main(String[] args) {
        head = tail = new Node(30, null);
        head = new Node(20, head);
        head = new Node(10, head);
        System.out.println("start:           " + show());
        for (int i = 0; i &lt; 4; i++) {
            try {
                int x = removeFirst();
                System.out.println("removeFirst()=" + x + ": " + show() + (tail == null ? "   (tail = null)" : ""));
            } catch (RuntimeException e) {
                System.out.println("removeFirst(): " + e.getMessage());
            }
        }
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null<br>
removeFirst()=10: head -&gt; 20 -&gt; 30 -&gt; null<br>
removeFirst()=20: head -&gt; 30 -&gt; null<br>
removeFirst()=30: head -&gt; null &nbsp;&nbsp;(tail = null)<br>
removeFirst(): list is empty</div>
<div class="pitfall">Forgetting case 3 leaves <code>tail</code> pointing at the deleted node while <code>head</code> is <code>null</code> — the list is "empty" and "not empty" at the same time, and later operations misbehave.</div>`,
        `<p class="y-chinh">🎯 Xoá nút đầu về bản chất là "dời <code>head</code> lên một bước" — O(1) — cộng thêm hai trường hợp đặc biệt.</p>
<ol>
<li>Danh sách rỗng → không có gì để xoá: ném ngoại lệ (exception) hoặc trả về cờ báo.</li>
<li>Lưu <code>head.info</code> lại để trả về.</li>
<li>Chỉ có một nút (<code>head == tail</code>) → <code>head = tail = null</code>.</li>
<li>Ngược lại <code>head = head.next</code>; nút đầu cũ không còn ai tham chiếu nên bị bộ dọn rác thu hồi.</li>
</ol>
<table>
<thead><tr><th>Danh sách trước</th><th>Trường hợp</th><th>Code</th><th>head / tail sau</th></tr></thead>
<tbody>
<tr><td>10 → 20 → 30</td><td>nhiều nút</td><td><code>head = head.next;</code></td><td>head = 20, tail = 30</td></tr>
<tr><td>30</td><td>một nút (<code>head == tail</code>)</td><td><code>head = tail = null;</code></td><td>cả hai là null</td></tr>
<tr><td>(rỗng)</td><td>không có gì để xoá</td><td><code>throw …</code></td><td>không đổi</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class RemoveFirst {
    static Node head, tail;

    static int removeFirst() {
        if (head == null) throw new RuntimeException("list is empty");   // không có gì để xoá
        int x = head.info;                    // 1. giữ lại giá trị
        if (head == tail) head = tail = null; // 2a. đó là nút duy nhất
        else head = head.next;                // 2b. head đi tiếp; nút cũ thành rác cho GC dọn
        return x;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null").toString();
    }

    public static void main(String[] args) {
        head = tail = new Node(30, null);
        head = new Node(20, head);
        head = new Node(10, head);
        System.out.println("start:           " + show());
        for (int i = 0; i &lt; 4; i++) {
            try {
                int x = removeFirst();
                System.out.println("removeFirst()=" + x + ": " + show() + (tail == null ? "   (tail = null)" : ""));
            } catch (RuntimeException e) {
                System.out.println("removeFirst(): " + e.getMessage());
            }
        }
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null<br>
removeFirst()=10: head -&gt; 20 -&gt; 30 -&gt; null<br>
removeFirst()=20: head -&gt; 30 -&gt; null<br>
removeFirst()=30: head -&gt; null &nbsp;&nbsp;(tail = null)<br>
removeFirst(): list is empty</div>
<div class="pitfall">Quên trường hợp 3 thì <code>tail</code> vẫn trỏ vào nút đã xoá trong khi <code>head</code> là <code>null</code> — danh sách vừa "rỗng" vừa "không rỗng", các thao tác sau chạy sai.</div>`],
      [12, 'Singly Linked List - 4: deleting an element from the end',
        `<p class="y-chinh">🎯 Deleting the last node of a singly linked list is O(n): there is no link backwards, so we must walk to the node just before <code>tail</code>.</p>
<ol>
<li>Empty → error; only one node → <code>head = tail = null</code>.</li>
<li>Move <code>p</code> from <code>head</code> while <code>p.next != tail</code>.</li>
<li><code>p.next = null</code> — cut the old last node off.</li>
<li><code>tail = p</code>.</li>
</ol>
<p class="nhan">Trace — removeLast() on 10 → 20 → 30 → 40</p>
<table>
<thead><tr><th>Step</th><th>p</th><th>p.next == tail?</th><th>Action</th></tr></thead>
<tbody>
<tr><td>1</td><td>10</td><td>no (20)</td><td>p = p.next</td></tr>
<tr><td>2</td><td>20</td><td>no (30)</td><td>p = p.next</td></tr>
<tr><td>3</td><td>30</td><td>yes (40)</td><td>stop the loop</td></tr>
<tr><td>4</td><td>30</td><td>—</td><td><code>p.next = null; tail = p;</code> → 10 → 20 → 30</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class RemoveLast {
    static Node head, tail;
    static int steps;

    static int removeLast() {
        if (head == null) throw new RuntimeException("list is empty");
        int x = tail.info;
        if (head == tail) {                   // only one node
            head = tail = null;
            return x;
        }
        Node p = head;
        steps = 0;
        while (p.next != tail) {              // find the node just before tail: O(n)
            p = p.next;
            steps++;
        }
        p.next = null;                        // cut the old tail off
        tail = p;                             // the predecessor is the new tail
        return x;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null").toString();
    }

    public static void main(String[] args) {
        int[] v = {10, 20, 30, 40};
        for (int x : v) {
            Node q = new Node(x, null);
            if (head == null) head = tail = q; else { tail.next = q; tail = q; }
        }
        System.out.println("start:          " + show());
        for (int i = 0; i &lt; 2; i++) {
            int x = removeLast();
            System.out.println("removeLast()=" + x + ": " + show() + "   (p moved " + steps + " time(s), new tail = " + tail.info + ")");
        }
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; 40 -&gt; null<br>
removeLast()=40: head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(p moved 2 time(s), new tail = 30)<br>
removeLast()=30: head -&gt; 10 -&gt; 20 -&gt; null &nbsp;&nbsp;(p moved 1 time(s), new tail = 20)</div>
<p><strong>Big-O:</strong> for n nodes the loop runs n − 2 times → O(n). This single weakness is why slides 16–18 add a <code>prev</code> link.</p>
<p class="meo">🧠 <strong>Remember:</strong> a singly linked list is cheap at the head (insert and delete), cheap to insert at the tail, and <em>expensive</em> to delete at the tail.</p>`,
        `<p class="y-chinh">🎯 Xoá nút cuối của danh sách liên kết đơn tốn O(n): không có liên kết ngược, nên phải đi tới nút đứng ngay trước <code>tail</code>.</p>
<ol>
<li>Rỗng → báo lỗi; chỉ một nút → <code>head = tail = null</code>.</li>
<li>Cho <code>p</code> đi từ <code>head</code> chừng nào <code>p.next != tail</code>.</li>
<li><code>p.next = null</code> — cắt nút cuối cũ ra.</li>
<li><code>tail = p</code>.</li>
</ol>
<p class="nhan">Lần theo — removeLast() trên 10 → 20 → 30 → 40</p>
<table>
<thead><tr><th>Bước</th><th>p</th><th>p.next == tail?</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>10</td><td>chưa (20)</td><td>p = p.next</td></tr>
<tr><td>2</td><td>20</td><td>chưa (30)</td><td>p = p.next</td></tr>
<tr><td>3</td><td>30</td><td>đúng (40)</td><td>thoát vòng lặp</td></tr>
<tr><td>4</td><td>30</td><td>—</td><td><code>p.next = null; tail = p;</code> → 10 → 20 → 30</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class RemoveLast {
    static Node head, tail;
    static int steps;

    static int removeLast() {
        if (head == null) throw new RuntimeException("list is empty");
        int x = tail.info;
        if (head == tail) {                   // chỉ có một nút
            head = tail = null;
            return x;
        }
        Node p = head;
        steps = 0;
        while (p.next != tail) {              // tìm nút đứng ngay trước tail: O(n)
            p = p.next;
            steps++;
        }
        p.next = null;                        // cắt tail cũ ra
        tail = p;                             // nút đứng trước thành tail mới
        return x;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s.append(" -&gt; null").toString();
    }

    public static void main(String[] args) {
        int[] v = {10, 20, 30, 40};
        for (int x : v) {
            Node q = new Node(x, null);
            if (head == null) head = tail = q; else { tail.next = q; tail = q; }
        }
        System.out.println("start:          " + show());
        for (int i = 0; i &lt; 2; i++) {
            int x = removeLast();
            System.out.println("removeLast()=" + x + ": " + show() + "   (p moved " + steps + " time(s), new tail = " + tail.info + ")");
        }
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; 40 -&gt; null<br>
removeLast()=40: head -&gt; 10 -&gt; 20 -&gt; 30 -&gt; null &nbsp;&nbsp;(p moved 2 time(s), new tail = 30)<br>
removeLast()=30: head -&gt; 10 -&gt; 20 -&gt; null &nbsp;&nbsp;(p moved 1 time(s), new tail = 20)</div>
<p><strong>Big-O:</strong> với n nút, vòng lặp chạy n − 2 lần → O(n). Chính điểm yếu này là lý do slide 16–18 thêm liên kết <code>prev</code>.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> danh sách liên kết đơn rẻ ở đầu (chèn và xoá), rẻ khi chèn ở cuối, nhưng <em>đắt</em> khi xoá ở cuối.</p>`],
      [13, 'Circular Lists - 1',
        `<p class="y-chinh">🎯 In a circular list the nodes form a ring: the list is finite, yet every node has a successor — the last node points back to the first.</p>
<ul>
<li>There is no <code>null</code> at the end, so <code>while (p != null)</code> never stops. Stop when you are <strong>back where you started</strong> — a do-while loop.</li>
<li>Keeping only <code>tail</code> is enough: <code>tail.next</code> is the first node, so both ends are one step away.</li>
</ul>
<pre><code class="language-java">class CNode {
    String info;
    CNode next;

    CNode(String x) { info = x; }
}

public class CircularRing {
    public static void main(String[] args) {
        CNode a = new CNode("A"), b = new CNode("B"), c = new CNode("C");
        a.next = b;
        b.next = c;
        c.next = a;                           // the last node points back to the first: a ring
        CNode tail = c;                       // keep only tail; tail.next is the first node

        StringBuilder s = new StringBuilder("one round:");
        CNode p = tail.next;
        do {                                  // do-while: visit, then test
            s.append(" ").append(p.info);
            p = p.next;
        } while (p != tail.next);             // stop when we are back at the start
        System.out.println(s);

        int nulls = 0;                        // no node has next == null
        p = tail.next;
        for (int i = 0; i &lt; 6; i++, p = p.next) if (p.next == null) nulls++;
        System.out.println("nodes with next == null seen in 6 steps: " + nulls);
        System.out.println("successor of C: " + c.next.info);
    }
}</code></pre>
<div class="out">one round: A B C<br>
nodes with next == null seen in 6 steps: 0<br>
successor of C: A</div>
<div class="pitfall">Walking a circular list with the singly-list loop <code>while (p != null)</code> is an infinite loop. When a PE program "hangs", check this first.</div>`,
        `<p class="y-chinh">🎯 Trong danh sách vòng (circular list) các nút tạo thành một vòng tròn: danh sách vẫn hữu hạn, nhưng nút nào cũng có nút đứng sau — nút cuối trỏ ngược về nút đầu.</p>
<ul>
<li>Không có <code>null</code> ở cuối nên <code>while (p != null)</code> không bao giờ dừng. Phải dừng khi <strong>quay lại điểm xuất phát</strong> — dùng vòng do-while.</li>
<li>Chỉ cần giữ <code>tail</code>: <code>tail.next</code> chính là nút đầu, nên cả hai đầu đều chỉ cách một bước.</li>
</ul>
<pre><code class="language-java">class CNode {
    String info;
    CNode next;

    CNode(String x) { info = x; }
}

public class CircularRing {
    public static void main(String[] args) {
        CNode a = new CNode("A"), b = new CNode("B"), c = new CNode("C");
        a.next = b;
        b.next = c;
        c.next = a;                           // nút cuối trỏ ngược về nút đầu: thành vòng
        CNode tail = c;                       // chỉ giữ tail; tail.next là nút đầu

        StringBuilder s = new StringBuilder("one round:");
        CNode p = tail.next;
        do {                                  // do-while: thăm trước, kiểm sau
            s.append(" ").append(p.info);
            p = p.next;
        } while (p != tail.next);             // dừng khi quay lại điểm xuất phát
        System.out.println(s);

        int nulls = 0;                        // không nút nào có next == null
        p = tail.next;
        for (int i = 0; i &lt; 6; i++, p = p.next) if (p.next == null) nulls++;
        System.out.println("nodes with next == null seen in 6 steps: " + nulls);
        System.out.println("successor of C: " + c.next.info);
    }
}</code></pre>
<div class="out">one round: A B C<br>
nodes with next == null seen in 6 steps: 0<br>
successor of C: A</div>
<div class="pitfall">Duyệt danh sách vòng bằng vòng lặp của danh sách đơn <code>while (p != null)</code> là lặp vô hạn. Khi chương trình PE bị "treo", hãy kiểm tra chỗ này đầu tiên.</div>`],
      [14, 'Circular Lists - 2: inserting nodes',
        `<p class="y-chinh">🎯 With a <code>tail</code> reference, inserting at the front (a) and at the end (b) of a circular singly linked list are both O(1) — and (b) is simply (a) followed by moving <code>tail</code>.</p>
<table>
<thead><tr><th>Case</th><th>Steps</th><th>Result</th></tr></thead>
<tbody>
<tr><td>(a) front</td><td><code>q.next = tail.next; tail.next = q;</code></td><td>q is the new first node</td></tr>
<tr><td>(b) end</td><td>do (a), then <code>tail = tail.next;</code></td><td>q is the new last node</td></tr>
<tr><td>empty list</td><td><code>q.next = q; tail = q;</code></td><td>a ring of one node</td></tr>
</tbody>
</table>
<pre><code class="language-java">class CNode {
    int info;
    CNode next;

    CNode(int x) { info = x; }
}

public class CircularList {
    static CNode tail;                        // tail.next is the first node

    static void addFirst(int x) {             // (a) insert at the front
        CNode q = new CNode(x);
        if (tail == null) {                   // empty: a single node points to itself
            q.next = q;
            tail = q;
        } else {
            q.next = tail.next;               // q -&gt; old first
            tail.next = q;                    // tail -&gt; q, so q is the new first
        }
    }

    static void addLast(int x) {              // (b) insert at the end
        addFirst(x);                          // put it right after tail…
        tail = tail.next;                     // …then call it the new tail
    }

    static void print(String label) {
        StringBuilder s = new StringBuilder(label);
        CNode p = tail.next;
        do { s.append(" ").append(p.info); p = p.next; } while (p != tail.next);
        System.out.println(s + "   (tail = " + tail.info + ", tail.next = " + tail.next.info + ")");
    }

    public static void main(String[] args) {
        addLast(1);  print("addLast(1): ");
        addLast(2);  print("addLast(2): ");
        addFirst(0); print("addFirst(0):");
        addLast(3);  print("addLast(3): ");
    }
}</code></pre>
<div class="out">addLast(1): &nbsp;1 &nbsp;&nbsp;(tail = 1, tail.next = 1)<br>
addLast(2): &nbsp;1 2 &nbsp;&nbsp;(tail = 2, tail.next = 1)<br>
addFirst(0): 0 1 2 &nbsp;&nbsp;(tail = 2, tail.next = 0)<br>
addLast(3): &nbsp;0 1 2 3 &nbsp;&nbsp;(tail = 3, tail.next = 0)</div>
<p class="meo">🧠 <strong>Remember:</strong> in a ring, "front" and "end" are the same gap — the one right after <code>tail</code>. Only which node you call <code>tail</code> decides whether the new node is first or last.</p>`,
        `<p class="y-chinh">🎯 Khi có tham chiếu <code>tail</code>, chèn vào đầu (a) và vào cuối (b) danh sách vòng đơn đều là O(1) — và (b) chỉ là (a) rồi dời <code>tail</code>.</p>
<table>
<thead><tr><th>Trường hợp</th><th>Các bước</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>(a) chèn đầu</td><td><code>q.next = tail.next; tail.next = q;</code></td><td>q thành nút đầu mới</td></tr>
<tr><td>(b) chèn cuối</td><td>làm (a), rồi <code>tail = tail.next;</code></td><td>q thành nút cuối mới</td></tr>
<tr><td>danh sách rỗng</td><td><code>q.next = q; tail = q;</code></td><td>vòng tròn một nút</td></tr>
</tbody>
</table>
<pre><code class="language-java">class CNode {
    int info;
    CNode next;

    CNode(int x) { info = x; }
}

public class CircularList {
    static CNode tail;                        // tail.next chính là nút đầu

    static void addFirst(int x) {             // (a) chèn vào đầu
        CNode q = new CNode(x);
        if (tail == null) {                   // rỗng: một nút tự trỏ về chính nó
            q.next = q;
            tail = q;
        } else {
            q.next = tail.next;               // q -&gt; nút đầu cũ
            tail.next = q;                    // tail -&gt; q, nên q thành nút đầu mới
        }
    }

    static void addLast(int x) {              // (b) chèn vào cuối
        addFirst(x);                          // đặt ngay sau tail…
        tail = tail.next;                     // …rồi gọi nó là tail mới
    }

    static void print(String label) {
        StringBuilder s = new StringBuilder(label);
        CNode p = tail.next;
        do { s.append(" ").append(p.info); p = p.next; } while (p != tail.next);
        System.out.println(s + "   (tail = " + tail.info + ", tail.next = " + tail.next.info + ")");
    }

    public static void main(String[] args) {
        addLast(1);  print("addLast(1): ");
        addLast(2);  print("addLast(2): ");
        addFirst(0); print("addFirst(0):");
        addLast(3);  print("addLast(3): ");
    }
}</code></pre>
<div class="out">addLast(1): &nbsp;1 &nbsp;&nbsp;(tail = 1, tail.next = 1)<br>
addLast(2): &nbsp;1 2 &nbsp;&nbsp;(tail = 2, tail.next = 1)<br>
addFirst(0): 0 1 2 &nbsp;&nbsp;(tail = 2, tail.next = 0)<br>
addLast(3): &nbsp;0 1 2 3 &nbsp;&nbsp;(tail = 3, tail.next = 0)</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trên vòng tròn, "đầu" và "cuối" là cùng một khe — khe ngay sau <code>tail</code>. Chỉ việc gọi nút nào là <code>tail</code> mới quyết định nút mới đứng đầu hay đứng cuối.</p>`],
      [15, 'Circular List application - Round-Robin Scheduling',
        `<p class="y-chinh">🎯 Round-robin scheduling gives every process a short time slice in cyclic order; a circular list does it with two steps repeated: serve <code>C.first()</code>, then <code>C.rotate()</code>.</p>
<ul>
<li><strong>Time slice</strong>: a process runs for a short turn and is interrupted when the slice ends, even if its job is not finished.</li>
<li><strong>rotate()</strong>: moves the first element to the end. On a circular list that is only <code>tail = tail.next</code> — O(1), no node created, destroyed or relinked.</li>
<li>A process that has finished is removed from the ring.</li>
</ul>
<pre><code class="language-java">class Proc {
    String name;
    int left;                                 // time units still needed
    Proc next;

    Proc(String name, int left) { this.name = name; this.left = left; }
}

public class RoundRobin {
    static Proc tail;                         // circular list: tail.next is the first process

    static void add(Proc p) {
        if (tail == null) { p.next = p; tail = p; }
        else { p.next = tail.next; tail.next = p; tail = p; }
    }
    static Proc first() { return tail.next; }
    static void rotate() { tail = tail.next; }        // the first element becomes the last: O(1)
    static void removeFirst() {
        Proc f = tail.next;
        if (f == tail) tail = null; else tail.next = f.next;
    }

    public static void main(String[] args) {
        add(new Proc("P1", 5));
        add(new Proc("P2", 2));
        add(new Proc("P3", 4));
        int slice = 2, clock = 0;
        while (tail != null) {
            Proc p = first();                 // 1. give a time slice to C.first()
            int run = Math.min(slice, p.left);
            p.left -= run;
            clock += run;
            System.out.println("t=" + clock + ": " + p.name + " ran " + run + (p.left == 0 ? " -&gt; finished" : " -&gt; " + p.left + " left"));
            if (p.left == 0) removeFirst();   // finished: leave the ring
            else rotate();                    // 2. C.rotate()
        }
    }
}</code></pre>
<div class="out">t=2: P1 ran 2 -&gt; 3 left<br>
t=4: P2 ran 2 -&gt; finished<br>
t=6: P3 ran 2 -&gt; 2 left<br>
t=8: P1 ran 2 -&gt; 1 left<br>
t=10: P3 ran 2 -&gt; finished<br>
t=11: P1 ran 1 -&gt; finished</div>
<p>Trace with slice = 2: P1 5→3, P2 2→done, P3 4→2, P1 3→1, P3 2→done, P1 1→done. Every process got the CPU in turn — nobody starves.</p>`,
        `<p class="y-chinh">🎯 Lập lịch xoay vòng (round-robin scheduling) cho mỗi tiến trình (process) một lát thời gian ngắn theo vòng; danh sách vòng làm việc này bằng hai bước lặp lại: phục vụ <code>C.first()</code>, rồi <code>C.rotate()</code>.</p>
<ul>
<li><strong>Lát thời gian (time slice)</strong>: tiến trình chạy một lượt ngắn và bị ngắt khi hết lượt, kể cả khi việc chưa xong.</li>
<li><strong>rotate()</strong> (xoay): đưa phần tử đầu về cuối. Trên danh sách vòng chỉ là <code>tail = tail.next</code> — O(1), không tạo, không huỷ, không nối lại nút nào.</li>
<li>Tiến trình chạy xong thì bị gỡ khỏi vòng.</li>
</ul>
<pre><code class="language-java">class Proc {
    String name;
    int left;                                 // số đơn vị thời gian còn cần chạy
    Proc next;

    Proc(String name, int left) { this.name = name; this.left = left; }
}

public class RoundRobin {
    static Proc tail;                         // danh sách vòng: tail.next là tiến trình đầu

    static void add(Proc p) {
        if (tail == null) { p.next = p; tail = p; }
        else { p.next = tail.next; tail.next = p; tail = p; }
    }
    static Proc first() { return tail.next; }
    static void rotate() { tail = tail.next; }        // phần tử đầu thành phần tử cuối: O(1)
    static void removeFirst() {
        Proc f = tail.next;
        if (f == tail) tail = null; else tail.next = f.next;
    }

    public static void main(String[] args) {
        add(new Proc("P1", 5));
        add(new Proc("P2", 2));
        add(new Proc("P3", 4));
        int slice = 2, clock = 0;
        while (tail != null) {
            Proc p = first();                 // 1. cấp một lát thời gian cho C.first()
            int run = Math.min(slice, p.left);
            p.left -= run;
            clock += run;
            System.out.println("t=" + clock + ": " + p.name + " ran " + run + (p.left == 0 ? " -&gt; finished" : " -&gt; " + p.left + " left"));
            if (p.left == 0) removeFirst();   // xong: ra khỏi vòng
            else rotate();                    // 2. C.rotate()
        }
    }
}</code></pre>
<div class="out">t=2: P1 ran 2 -&gt; 3 left<br>
t=4: P2 ran 2 -&gt; finished<br>
t=6: P3 ran 2 -&gt; 2 left<br>
t=8: P1 ran 2 -&gt; 1 left<br>
t=10: P3 ran 2 -&gt; finished<br>
t=11: P1 ran 1 -&gt; finished</div>
<p>Lần theo với lát = 2: P1 5→3, P2 2→xong, P3 4→2, P1 3→1, P3 2→xong, P1 1→xong. Tiến trình nào cũng lần lượt được dùng CPU — không ai bị bỏ đói (starvation).</p>`],
      [16, 'Doubly Linked Lists - 1',
        `<p class="y-chinh">🎯 A node of a doubly linked list has two reference fields — <code>prev</code> to its predecessor and <code>next</code> to its successor — so the list can be walked both ways.</p>
<ul>
<li><code>Node(int x, Node p, Node q)</code> sets info = x, prev = p, next = q.</li>
<li><code>add(x)</code> on the slide appends: empty → <code>head = tail = new Node(x, null, null)</code>; otherwise <code>q = new Node(x, tail, null)</code>, <code>tail.next = q</code>, <code>tail = q</code>.</li>
<li>Price: one extra reference per node. Gain: O(1) delete at the end, and O(1) delete of any node you already hold.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node prev, next;

    Node() {}
    Node(int x, Node p, Node q) { info = x; prev = p; next = q; }
}

class MyList {
    Node head, tail;

    MyList() { head = tail = null; }
    boolean isEmpty() { return head == null; }
    void clear() { head = tail = null; }

    void add(int x) {                         // add at the end, exactly as on the slide
        if (isEmpty()) head = tail = new Node(x, null, null);
        else {
            Node q = new Node(x, tail, null); // q.prev = old tail
            tail.next = q;
            tail = q;
        }
    }

    void forward() {
        for (Node p = head; p != null; p = p.next) System.out.print(p.info + " ");
        System.out.println();
    }

    void backward() {                         // possible only because of prev
        for (Node p = tail; p != null; p = p.prev) System.out.print(p.info + " ");
        System.out.println();
    }
}

public class DoublyList {
    public static void main(String[] args) {
        MyList t = new MyList();
        for (int x : new int[] {1, 2, 3, 4}) t.add(x);
        System.out.print("head to tail: ");
        t.forward();
        System.out.print("tail to head: ");
        t.backward();
    }
}</code></pre>
<div class="out">head to tail: 1 2 3 4<br>
tail to head: 4 3 2 1</div>`,
        `<p class="y-chinh">🎯 Nút của danh sách liên kết đôi (doubly linked list) có hai trường tham chiếu — <code>prev</code> trỏ tới nút đứng trước và <code>next</code> trỏ tới nút đứng sau — nên đi được theo cả hai chiều.</p>
<ul>
<li><code>Node(int x, Node p, Node q)</code> gán info = x, prev = p, next = q.</li>
<li><code>add(x)</code> trên slide thêm vào cuối: rỗng → <code>head = tail = new Node(x, null, null)</code>; ngược lại <code>q = new Node(x, tail, null)</code>, <code>tail.next = q</code>, <code>tail = q</code>.</li>
<li>Cái giá: thêm một tham chiếu mỗi nút. Cái được: xoá ở cuối O(1), và xoá O(1) bất kỳ nút nào đang cầm trong tay.</li>
</ul>
<pre><code class="language-java">class Node {
    int info;
    Node prev, next;

    Node() {}
    Node(int x, Node p, Node q) { info = x; prev = p; next = q; }
}

class MyList {
    Node head, tail;

    MyList() { head = tail = null; }
    boolean isEmpty() { return head == null; }
    void clear() { head = tail = null; }

    void add(int x) {                         // thêm vào cuối, đúng như slide
        if (isEmpty()) head = tail = new Node(x, null, null);
        else {
            Node q = new Node(x, tail, null); // q.prev = tail cũ
            tail.next = q;
            tail = q;
        }
    }

    void forward() {
        for (Node p = head; p != null; p = p.next) System.out.print(p.info + " ");
        System.out.println();
    }

    void backward() {                         // làm được là nhờ có prev
        for (Node p = tail; p != null; p = p.prev) System.out.print(p.info + " ");
        System.out.println();
    }
}

public class DoublyList {
    public static void main(String[] args) {
        MyList t = new MyList();
        for (int x : new int[] {1, 2, 3, 4}) t.add(x);
        System.out.print("head to tail: ");
        t.forward();
        System.out.print("tail to head: ");
        t.backward();
    }
}</code></pre>
<div class="out">head to tail: 1 2 3 4<br>
tail to head: 4 3 2 1</div>`],
      [17, 'Doubly Linked Lists - 2: adding a new node at the end',
        `<p class="y-chinh">🎯 Appending to a doubly linked list sets two links on the new node and one on the old tail — still O(1).</p>
<table>
<thead><tr><th>Step</th><th>Code</th><th>Links after the step (adding 30 to 10 ⇄ 20)</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>Node q = new Node(30, tail, null);</code></td><td>q.prev = 20, q.next = null</td></tr>
<tr><td>2</td><td><code>tail.next = q;</code></td><td>20.next = 30</td></tr>
<tr><td>3</td><td><code>tail = q;</code></td><td>tail = 30</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node prev, next;

    Node(int x, Node p, Node q) { info = x; prev = p; next = q; }
}

public class DoublyAddLast {
    static Node head, tail;

    static void addLast(int x) {
        if (head == null) {                   // empty list
            head = tail = new Node(x, null, null);
            return;
        }
        Node q = new Node(x, tail, null);     // 1. new node: prev = tail, next = null
        tail.next = q;                        // 2. old tail -&gt; q
        tail = q;                             // 3. tail = q
    }

    static String links() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) {
            s.append("[").append(p.prev == null ? "null" : String.valueOf(p.prev.info))
             .append("&lt;-").append(p.info).append("-&gt;")
             .append(p.next == null ? "null" : String.valueOf(p.next.info)).append("] ");
        }
        return s.toString().trim();
    }

    public static void main(String[] args) {
        for (int x : new int[] {10, 20, 30}) {
            addLast(x);
            System.out.println("addLast(" + x + "): " + links());
        }
    }
}</code></pre>
<div class="out">addLast(10): [null&lt;-10-&gt;null]<br>
addLast(20): [null&lt;-10-&gt;20] [10&lt;-20-&gt;null]<br>
addLast(30): [null&lt;-10-&gt;20] [10&lt;-20-&gt;30] [20&lt;-30-&gt;null]</div>
<p>Each bracket in the output reads <code>[prev&lt;-info-&gt;next]</code>: after every step, both directions agree.</p>
<div class="pitfall">A doubly linked list has <em>two</em> links for every connection. Setting <code>q.prev</code> but forgetting <code>tail.next = q</code> gives a list that is correct backwards and broken forwards.</div>`,
        `<p class="y-chinh">🎯 Thêm vào cuối danh sách liên kết đôi đặt hai liên kết ở nút mới và một liên kết ở tail cũ — vẫn là O(1).</p>
<table>
<thead><tr><th>Bước</th><th>Code</th><th>Liên kết sau bước (thêm 30 vào 10 ⇄ 20)</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>Node q = new Node(30, tail, null);</code></td><td>q.prev = 20, q.next = null</td></tr>
<tr><td>2</td><td><code>tail.next = q;</code></td><td>20.next = 30</td></tr>
<tr><td>3</td><td><code>tail = q;</code></td><td>tail = 30</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node prev, next;

    Node(int x, Node p, Node q) { info = x; prev = p; next = q; }
}

public class DoublyAddLast {
    static Node head, tail;

    static void addLast(int x) {
        if (head == null) {                   // danh sách rỗng
            head = tail = new Node(x, null, null);
            return;
        }
        Node q = new Node(x, tail, null);     // 1. nút mới: prev = tail, next = null
        tail.next = q;                        // 2. tail cũ -&gt; q
        tail = q;                             // 3. tail = q
    }

    static String links() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) {
            s.append("[").append(p.prev == null ? "null" : String.valueOf(p.prev.info))
             .append("&lt;-").append(p.info).append("-&gt;")
             .append(p.next == null ? "null" : String.valueOf(p.next.info)).append("] ");
        }
        return s.toString().trim();
    }

    public static void main(String[] args) {
        for (int x : new int[] {10, 20, 30}) {
            addLast(x);
            System.out.println("addLast(" + x + "): " + links());
        }
    }
}</code></pre>
<div class="out">addLast(10): [null&lt;-10-&gt;null]<br>
addLast(20): [null&lt;-10-&gt;20] [10&lt;-20-&gt;null]<br>
addLast(30): [null&lt;-10-&gt;20] [10&lt;-20-&gt;30] [20&lt;-30-&gt;null]</div>
<p>Mỗi cặp ngoặc trong output đọc là <code>[prev&lt;-info-&gt;next]</code>: sau mỗi bước, hai chiều liên kết luôn khớp nhau.</p>
<div class="pitfall">Danh sách đôi có <em>hai</em> liên kết cho mỗi mối nối. Gán <code>q.prev</code> mà quên <code>tail.next = q</code> thì danh sách đúng khi đi lùi nhưng hỏng khi đi tới.</div>`],
      [18, 'Doubly Linked Lists - 3: deleting a node from the end',
        `<p class="y-chinh">🎯 Thanks to <code>prev</code>, deleting the last node is O(1): step back to <code>tail.prev</code> and cut the link — no search at all.</p>
<ol>
<li>Empty → error; one node → <code>head = tail = null</code>.</li>
<li><code>tail = tail.prev;</code></li>
<li><code>tail.next = null;</code></li>
</ol>
<pre><code class="language-java">class Node {
    int info;
    Node prev, next;

    Node(int x, Node p, Node q) { info = x; prev = p; next = q; }
}

public class DoublyRemoveLast {
    static Node head, tail;

    static int removeLast() {
        if (tail == null) throw new RuntimeException("list is empty");
        int x = tail.info;
        if (head == tail) head = tail = null; // only one node
        else {
            tail = tail.prev;                 // 1. step back: no search needed, O(1)
            tail.next = null;                 // 2. cut the old last node off
        }
        return x;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" &lt;-&gt; ").append(p.info);
        return s.append("   (tail = ").append(tail == null ? "null" : String.valueOf(tail.info)).append(")").toString();
    }

    public static void main(String[] args) {
        for (int x : new int[] {10, 20, 30}) {
            Node q = new Node(x, tail, null);
            if (head == null) head = q; else tail.next = q;
            tail = q;
        }
        System.out.println("start:           " + show());
        for (int i = 0; i &lt; 3; i++) System.out.println("removeLast()=" + removeLast() + ": " + show());
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head &lt;-&gt; 10 &lt;-&gt; 20 &lt;-&gt; 30 &nbsp;&nbsp;(tail = 30)<br>
removeLast()=30: head &lt;-&gt; 10 &lt;-&gt; 20 &nbsp;&nbsp;(tail = 20)<br>
removeLast()=20: head &lt;-&gt; 10 &nbsp;&nbsp;(tail = 10)<br>
removeLast()=10: head &nbsp;&nbsp;(tail = null)</div>
<p>Compare with slide 12: the singly linked version had to walk the list (O(n)); here there is no loop.</p>`,
        `<p class="y-chinh">🎯 Nhờ có <code>prev</code>, xoá nút cuối chỉ tốn O(1): lùi về <code>tail.prev</code> rồi cắt liên kết — không phải tìm gì cả.</p>
<ol>
<li>Rỗng → báo lỗi; một nút → <code>head = tail = null</code>.</li>
<li><code>tail = tail.prev;</code></li>
<li><code>tail.next = null;</code></li>
</ol>
<pre><code class="language-java">class Node {
    int info;
    Node prev, next;

    Node(int x, Node p, Node q) { info = x; prev = p; next = q; }
}

public class DoublyRemoveLast {
    static Node head, tail;

    static int removeLast() {
        if (tail == null) throw new RuntimeException("list is empty");
        int x = tail.info;
        if (head == tail) head = tail = null; // chỉ có một nút
        else {
            tail = tail.prev;                 // 1. lùi một bước: không phải tìm, O(1)
            tail.next = null;                 // 2. cắt nút cuối cũ ra
        }
        return x;
    }

    static String show() {
        StringBuilder s = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) s.append(" &lt;-&gt; ").append(p.info);
        return s.append("   (tail = ").append(tail == null ? "null" : String.valueOf(tail.info)).append(")").toString();
    }

    public static void main(String[] args) {
        for (int x : new int[] {10, 20, 30}) {
            Node q = new Node(x, tail, null);
            if (head == null) head = q; else tail.next = q;
            tail = q;
        }
        System.out.println("start:           " + show());
        for (int i = 0; i &lt; 3; i++) System.out.println("removeLast()=" + removeLast() + ": " + show());
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;head &lt;-&gt; 10 &lt;-&gt; 20 &lt;-&gt; 30 &nbsp;&nbsp;(tail = 30)<br>
removeLast()=30: head &lt;-&gt; 10 &lt;-&gt; 20 &nbsp;&nbsp;(tail = 20)<br>
removeLast()=20: head &lt;-&gt; 10 &nbsp;&nbsp;(tail = 10)<br>
removeLast()=10: head &nbsp;&nbsp;(tail = null)</div>
<p>So với slide 12: bản danh sách đơn phải đi dọc danh sách (O(n)); ở đây không có vòng lặp nào.</p>`],
      [19, 'Lists in java.util - LinkedList class',
        `<p class="y-chinh">🎯 In real code you rarely write a list yourself: <code>java.util.LinkedList&lt;E&gt;</code> already offers every method on the slide.</p>
<ul>
<li><code>E</code> is the element type (generics): <code>LinkedList&lt;String&gt;</code> holds Strings.</li>
<li><code>add</code>/<code>addLast</code>, <code>addFirst</code>, <code>getFirst</code>, <code>getLast</code>, <code>removeFirst</code>, <code>removeLast</code> are O(1): Java's <code>LinkedList</code> is a <strong>doubly linked</strong> list that keeps references to its first and last nodes.</li>
<li><code>get(int index)</code> and <code>remove(int index)</code> are O(n): the list walks from whichever end is nearer.</li>
<li><code>toArray()</code> copies the elements into a new array; <code>clear()</code> empties the list.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;
import java.util.LinkedList;

public class LinkedListApi {
    public static void main(String[] args) {
        LinkedList&lt;String&gt; t = new LinkedList&lt;String&gt;();   // E = String here
        t.add("B");                           // add(E o): append at the end
        t.addFirst("A");                      // insert at the beginning
        t.addLast("C");                       // same as add
        System.out.println("list: " + t + "  size()=" + t.size());
        System.out.println("get(1)=" + t.get(1) + "  getFirst()=" + t.getFirst() + "  getLast()=" + t.getLast());
        System.out.println("remove(1)=" + t.remove(1) + " -&gt; " + t);
        System.out.println("removeFirst()=" + t.removeFirst() + ", removeLast()=" + t.removeLast() + " -&gt; " + t);
        t.add("X");
        t.add("Y");
        Object[] arr = t.toArray();           // toArray(): copy into an array
        System.out.println("toArray() -&gt; " + Arrays.toString(arr));
        t.clear();
        System.out.println("after clear(): " + t + "  size()=" + t.size());
    }
}</code></pre>
<div class="out">list: [A, B, C] &nbsp;size()=3<br>
get(1)=B &nbsp;getFirst()=A &nbsp;getLast()=C<br>
remove(1)=B -&gt; [A, C]<br>
removeFirst()=A, removeLast()=C -&gt; []<br>
toArray() -&gt; [X, Y]<br>
after clear(): [] &nbsp;size()=0</div>`,
        `<p class="y-chinh">🎯 Trong code thực tế hiếm khi phải tự viết danh sách: <code>java.util.LinkedList&lt;E&gt;</code> đã có sẵn mọi phương thức trên slide.</p>
<ul>
<li><code>E</code> là kiểu phần tử (generics — kiểu tổng quát): <code>LinkedList&lt;String&gt;</code> chứa các chuỗi.</li>
<li><code>add</code>/<code>addLast</code>, <code>addFirst</code>, <code>getFirst</code>, <code>getLast</code>, <code>removeFirst</code>, <code>removeLast</code> đều O(1): <code>LinkedList</code> của Java là danh sách <strong>liên kết đôi</strong>, giữ sẵn tham chiếu tới nút đầu và nút cuối.</li>
<li><code>get(int index)</code> và <code>remove(int index)</code> là O(n): danh sách phải đi từ đầu nào gần hơn tới vị trí đó.</li>
<li><code>toArray()</code> chép các phần tử ra một mảng mới; <code>clear()</code> làm rỗng danh sách.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;
import java.util.LinkedList;

public class LinkedListApi {
    public static void main(String[] args) {
        LinkedList&lt;String&gt; t = new LinkedList&lt;String&gt;();   // ở đây E = String
        t.add("B");                           // add(E o): thêm vào cuối
        t.addFirst("A");                      // chèn vào đầu
        t.addLast("C");                       // giống add
        System.out.println("list: " + t + "  size()=" + t.size());
        System.out.println("get(1)=" + t.get(1) + "  getFirst()=" + t.getFirst() + "  getLast()=" + t.getLast());
        System.out.println("remove(1)=" + t.remove(1) + " -&gt; " + t);
        System.out.println("removeFirst()=" + t.removeFirst() + ", removeLast()=" + t.removeLast() + " -&gt; " + t);
        t.add("X");
        t.add("Y");
        Object[] arr = t.toArray();           // toArray(): chép ra một mảng
        System.out.println("toArray() -&gt; " + Arrays.toString(arr));
        t.clear();
        System.out.println("after clear(): " + t + "  size()=" + t.size());
    }
}</code></pre>
<div class="out">list: [A, B, C] &nbsp;size()=3<br>
get(1)=B &nbsp;getFirst()=A &nbsp;getLast()=C<br>
remove(1)=B -&gt; [A, C]<br>
removeFirst()=A, removeLast()=C -&gt; []<br>
toArray() -&gt; [X, Y]<br>
after clear(): [] &nbsp;size()=0</div>`],
      [20, 'Lists in java.util - LinkedList class example',
        `<p class="y-chinh">🎯 The slide stores three (name, age) records in a <code>LinkedList</code> and prints them with <code>get(i)</code> inside a for loop.</p>
<p>The program below is the slide's code (only the class holding <code>main</code> is renamed so that the file runs), followed by the same job in modern style:</p>
<pre><code class="language-java">import java.util.LinkedList;

class Node {                                  // on the slide this "Node" is just a record: name + age
    String name;
    int age;

    Node() {}
    Node(String name1, int age1) { name = name1; age = age1; }
    void set(String name1, int age1) { name = name1; age = age1; }
    public String toString() {
        String s = name + "  " + age;
        return s;
    }
}

public class LinkedListExample {
    public static void main(String[] args) {
        // --- the slide's code (raw type LinkedList)
        LinkedList t = new LinkedList();
        Node x;
        int i;
        x = new Node("A01", 25); t.add(x);
        x = new Node("A02", 23); t.add(x);
        x = new Node("A03", 21); t.add(x);
        for (i = 0; i &lt; t.size(); i++)
            System.out.println(t.get(i));    // get(i) walks the list every time

        // --- the same with generics and a for-each loop
        LinkedList&lt;Node&gt; list = new LinkedList&lt;Node&gt;();
        list.add(new Node("A01", 25));
        list.add(new Node("A02", 23));
        list.add(new Node("A03", 21));
        int total = 0;
        for (Node e : list) total += e.age;   // one pass: O(n)
        System.out.println("average age = " + (double) total / list.size());
    }
}</code></pre>
<div class="out">A01 &nbsp;25<br>
A02 &nbsp;23<br>
A03 &nbsp;21<br>
average age = 23.0</div>
<ul>
<li>The slide uses the <strong>raw type</strong> <code>LinkedList</code> (no <code>&lt;Node&gt;</code>); it compiles only with an "unchecked" warning. Write <code>LinkedList&lt;Node&gt;</code>.</li>
<li>The slide's class is called <code>Node</code>, but it is just a data record — <code>java.util.LinkedList</code> builds its own internal nodes.</li>
</ul>
<div class="pitfall"><code>for (i = 0; i &lt; t.size(); i++) t.get(i)</code> on a <strong>LinkedList</strong> is O(n²): each <code>get(i)</code> walks up to n/2 nodes. Use a for-each loop (an iterator) — one pass, O(n).</div>`,
        `<p class="y-chinh">🎯 Slide lưu ba bản ghi (tên, tuổi) vào một <code>LinkedList</code> rồi in ra bằng <code>get(i)</code> trong vòng for.</p>
<p>Chương trình dưới là code của slide (chỉ đổi tên lớp chứa <code>main</code> để file chạy được), tiếp theo là cùng công việc viết theo kiểu hiện đại:</p>
<pre><code class="language-java">import java.util.LinkedList;

class Node {                                  // trên slide "Node" này chỉ là một bản ghi: tên + tuổi
    String name;
    int age;

    Node() {}
    Node(String name1, int age1) { name = name1; age = age1; }
    void set(String name1, int age1) { name = name1; age = age1; }
    public String toString() {
        String s = name + "  " + age;
        return s;
    }
}

public class LinkedListExample {
    public static void main(String[] args) {
        // --- code của slide (kiểu thô LinkedList)
        LinkedList t = new LinkedList();
        Node x;
        int i;
        x = new Node("A01", 25); t.add(x);
        x = new Node("A02", 23); t.add(x);
        x = new Node("A03", 21); t.add(x);
        for (i = 0; i &lt; t.size(); i++)
            System.out.println(t.get(i));    // get(i) đi lại danh sách mỗi lần

        // --- cùng việc đó với generic và vòng for-each
        LinkedList&lt;Node&gt; list = new LinkedList&lt;Node&gt;();
        list.add(new Node("A01", 25));
        list.add(new Node("A02", 23));
        list.add(new Node("A03", 21));
        int total = 0;
        for (Node e : list) total += e.age;   // một lượt: O(n)
        System.out.println("average age = " + (double) total / list.size());
    }
}</code></pre>
<div class="out">A01 &nbsp;25<br>
A02 &nbsp;23<br>
A03 &nbsp;21<br>
average age = 23.0</div>
<ul>
<li>Slide dùng <strong>kiểu thô (raw type)</strong> <code>LinkedList</code> (không có <code>&lt;Node&gt;</code>); nó chỉ biên dịch kèm cảnh báo "unchecked". Hãy viết <code>LinkedList&lt;Node&gt;</code>.</li>
<li>Lớp trên slide tên là <code>Node</code> nhưng thật ra chỉ là một bản ghi dữ liệu — <code>java.util.LinkedList</code> tự tạo các nút bên trong của nó.</li>
</ul>
<div class="pitfall"><code>for (i = 0; i &lt; t.size(); i++) t.get(i)</code> trên một <strong>LinkedList</strong> là O(n²): mỗi lần <code>get(i)</code> phải đi tới n/2 nút. Hãy dùng vòng for-each (iterator — bộ duyệt) — một lượt, O(n).</div>`],
      [21, 'Lists in java.util - ArrayList class',
        `<p class="y-chinh">🎯 <code>ArrayList&lt;E&gt;</code> is the dynamic-array implementation of the list: <code>get(i)</code> is O(1), but inserting or removing in the middle shifts elements.</p>
<ul>
<li><strong>size</strong> = number of elements; <strong>capacity</strong> = length of the hidden array. When it is full, OpenJDK allocates about 1.5 × the old capacity and copies — so appending is O(1) amortized.</li>
<li><code>ensureCapacity(n)</code> reserves room in advance; <code>trimToSize()</code> shrinks the hidden array down to the size.</li>
<li><code>add(int index, E o)</code> and <code>remove(int index)</code> shift elements → O(n).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;

public class ArrayListApi {
    public static void main(String[] args) {
        ArrayList&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;();
        a.ensureCapacity(100);                // reserve room once, avoid repeated growing
        for (int x = 1; x &lt;= 5; x++) a.add(x * 10);          // add(E o): append
        System.out.println("a = " + a + "  size()=" + a.size());
        a.add(1, 15);                         // add(int index, E o): shifts the rest right
        System.out.println("add(1, 15) -&gt; " + a + "  get(1)=" + a.get(1));
        a.remove(1);                          // remove(int index): removes POSITION 1
        System.out.println("remove(1) -&gt; " + a);
        a.remove(Integer.valueOf(10));        // removes the VALUE 10
        System.out.println("remove(Integer.valueOf(10)) -&gt; " + a);
        a.trimToSize();                       // capacity shrinks to size
        Object[] arr = a.toArray();
        System.out.println("toArray() -&gt; " + Arrays.toString(arr));
        a.clear();
        System.out.println("after clear(): size()=" + a.size() + " isEmpty()=" + a.isEmpty());
    }
}</code></pre>
<div class="out">a = [10, 20, 30, 40, 50] &nbsp;size()=5<br>
add(1, 15) -&gt; [10, 15, 20, 30, 40, 50] &nbsp;get(1)=15<br>
remove(1) -&gt; [10, 20, 30, 40, 50]<br>
remove(Integer.valueOf(10)) -&gt; [20, 30, 40, 50]<br>
toArray() -&gt; [20, 30, 40, 50]<br>
after clear(): size()=0 isEmpty()=true</div>
<div class="pitfall">On an <code>ArrayList&lt;Integer&gt;</code>, <code>remove(1)</code> removes the element <strong>at index 1</strong>, not the value 1. To remove a value write <code>remove(Integer.valueOf(1))</code>. The output above shows both.</div>`,
        `<p class="y-chinh">🎯 <code>ArrayList&lt;E&gt;</code> là cách cài danh sách bằng mảng động: <code>get(i)</code> là O(1), nhưng chèn hay xoá ở giữa phải dời phần tử.</p>
<ul>
<li><strong>size</strong> (kích thước) = số phần tử đang có; <strong>capacity</strong> (sức chứa) = độ dài mảng ẩn bên trong. Khi đầy, OpenJDK cấp mảng mới khoảng 1,5 lần sức chứa cũ rồi chép sang — vì vậy thêm vào cuối là O(1) khấu hao (amortized).</li>
<li><code>ensureCapacity(n)</code> đặt chỗ trước; <code>trimToSize()</code> thu mảng ẩn về đúng bằng size.</li>
<li><code>add(int index, E o)</code> và <code>remove(int index)</code> phải dời phần tử → O(n).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;

public class ArrayListApi {
    public static void main(String[] args) {
        ArrayList&lt;Integer&gt; a = new ArrayList&lt;Integer&gt;();
        a.ensureCapacity(100);                // đặt chỗ trước, khỏi phải nới nhiều lần
        for (int x = 1; x &lt;= 5; x++) a.add(x * 10);          // add(E o): thêm vào cuối
        System.out.println("a = " + a + "  size()=" + a.size());
        a.add(1, 15);                         // add(int index, E o): dời phần còn lại sang phải
        System.out.println("add(1, 15) -&gt; " + a + "  get(1)=" + a.get(1));
        a.remove(1);                          // remove(int index): xoá VỊ TRÍ 1
        System.out.println("remove(1) -&gt; " + a);
        a.remove(Integer.valueOf(10));        // xoá GIÁ TRỊ 10
        System.out.println("remove(Integer.valueOf(10)) -&gt; " + a);
        a.trimToSize();                       // thu dung lượng về đúng size
        Object[] arr = a.toArray();
        System.out.println("toArray() -&gt; " + Arrays.toString(arr));
        a.clear();
        System.out.println("after clear(): size()=" + a.size() + " isEmpty()=" + a.isEmpty());
    }
}</code></pre>
<div class="out">a = [10, 20, 30, 40, 50] &nbsp;size()=5<br>
add(1, 15) -&gt; [10, 15, 20, 30, 40, 50] &nbsp;get(1)=15<br>
remove(1) -&gt; [10, 20, 30, 40, 50]<br>
remove(Integer.valueOf(10)) -&gt; [20, 30, 40, 50]<br>
toArray() -&gt; [20, 30, 40, 50]<br>
after clear(): size()=0 isEmpty()=true</div>
<div class="pitfall">Với <code>ArrayList&lt;Integer&gt;</code>, <code>remove(1)</code> xoá phần tử <strong>ở chỉ số 1</strong>, không phải giá trị 1. Muốn xoá theo giá trị phải viết <code>remove(Integer.valueOf(1))</code>. Output ở trên cho thấy cả hai.</div>`],
      [22, 'Summary',
        `<p class="y-chinh">🎯 One ADT, four kinds of storage — array/dynamic array, singly, circular and doubly linked list; choose by the operations you need most.</p>
<table>
<thead><tr><th>You need…</th><th>Choose</th><th>Why</th></tr></thead>
<tbody>
<tr><td>to read by index a lot</td><td>array / <code>ArrayList</code></td><td><code>get(i)</code> is O(1)</td></tr>
<tr><td>to insert/delete at the front often</td><td>singly linked list (or <code>LinkedList</code>)</td><td>O(1) at <code>head</code></td></tr>
<tr><td>to delete at both ends or walk backwards</td><td>doubly linked list</td><td><code>prev</code> makes <code>removeLast</code> O(1)</td></tr>
<tr><td>to visit items in turns, over and over</td><td>circular linked list</td><td><code>rotate()</code> is O(1)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>The three one-line definitions from the slide:</strong> singly = a node links to its successor only; circular = the nodes form a ring; doubly = a node links to its previous and its next node.</p>`,
        `<p class="y-chinh">🎯 Một ADT, bốn kiểu lưu — mảng/mảng động, danh sách liên kết đơn, vòng và đôi; chọn theo thao tác bạn dùng nhiều nhất.</p>
<table>
<thead><tr><th>Bạn cần…</th><th>Chọn</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>đọc theo chỉ số thật nhiều</td><td>mảng / <code>ArrayList</code></td><td><code>get(i)</code> là O(1)</td></tr>
<tr><td>chèn/xoá ở đầu thường xuyên</td><td>danh sách liên kết đơn (hoặc <code>LinkedList</code>)</td><td>O(1) tại <code>head</code></td></tr>
<tr><td>xoá ở cả hai đầu hoặc đi lùi</td><td>danh sách liên kết đôi</td><td><code>prev</code> làm <code>removeLast</code> thành O(1)</td></tr>
<tr><td>lần lượt xoay vòng qua các phần tử</td><td>danh sách liên kết vòng</td><td><code>rotate()</code> là O(1)</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Ba định nghĩa một dòng trên slide:</strong> đơn = nút chỉ nối tới nút đứng sau; vòng = các nút tạo thành vòng tròn; đôi = nút nối tới cả nút trước và nút sau.</p>`],
      [23, 'Reading at home',
        `<p class="y-chinh">🎯 Chapter 3 of Goodrich 6e (Fundamental Data Structures) is the textbook version of this deck — read it after the slides.</p>
<ul>
<li><strong>§3.1 Using Arrays (p.104)</strong> — storing game entries in an array with shifting, insertion-sort, <code>java.util.Arrays</code>, two-dimensional arrays.</li>
<li><strong>§3.2 Singly Linked Lists (p.122)</strong> — a <code>SinglyLinkedList</code> class with <code>size</code>, <code>first</code>, <code>last</code>, <code>addFirst</code>, <code>addLast</code>, <code>removeFirst</code>.</li>
<li><strong>§3.3 Circularly Linked Lists (p.128)</strong> — round-robin scheduling and <code>rotate()</code>, exactly slide 15.</li>
<li><strong>§3.4 Doubly Linked Lists (p.132)</strong> — the version with header and trailer sentinel nodes (lesson 1.3 of this course).</li>
</ul>
<p>The book's lists are generic (<code>SinglyLinkedList&lt;E&gt;</code>) and the doubly linked one uses sentinels; the slides use plain <code>int</code> nodes — the same ideas in simpler packaging.</p>`,
        `<p class="y-chinh">🎯 Chương 3 của sách Goodrich bản 6 (Fundamental Data Structures) là phiên bản giáo trình của bộ slide này — đọc sau khi học slide.</p>
<ul>
<li><strong>§3.1 Using Arrays (tr.104)</strong> — lưu bảng điểm trò chơi trong mảng có dời phần tử, sắp xếp chèn (insertion-sort), lớp <code>java.util.Arrays</code>, mảng hai chiều.</li>
<li><strong>§3.2 Singly Linked Lists (tr.122)</strong> — lớp <code>SinglyLinkedList</code> với <code>size</code>, <code>first</code>, <code>last</code>, <code>addFirst</code>, <code>addLast</code>, <code>removeFirst</code>.</li>
<li><strong>§3.3 Circularly Linked Lists (tr.128)</strong> — lập lịch round-robin và <code>rotate()</code>, đúng như slide 15.</li>
<li><strong>§3.4 Doubly Linked Lists (tr.132)</strong> — bản có hai nút lính canh header và trailer (sentinel — bài 1.3 của khoá này).</li>
</ul>
<p>Danh sách trong sách là kiểu tổng quát (generic, <code>SinglyLinkedList&lt;E&gt;</code>) và bản liên kết đôi dùng nút lính canh; slide dùng nút <code>int</code> đơn giản — cùng ý tưởng, gói gọn hơn.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Why is deleting the last node O(n) in a singly linked list but O(1) in a doubly linked list?</li>
<li>After deleting the only node of a list, what must <code>head</code> and <code>tail</code> be?</li>
<li>A circular list keeps only <code>tail</code>. Where is the first node?</li>
<li>Which is faster for <code>get(i)</code>: <code>ArrayList</code> or <code>LinkedList</code>? Why?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) the singly list must walk to the node before <code>tail</code>; the doubly list reads <code>tail.prev</code>. (2) both <code>null</code>. (3) <code>tail.next</code>. (4) <code>ArrayList</code> — it indexes an array in O(1), while <code>LinkedList</code> walks O(n) nodes.</p>
<p><strong>Next:</strong> the deep-dive lessons 1.1–1.5 below (dynamic arrays, the three linked lists, sentinels, <code>ArrayList</code> vs <code>LinkedList</code>, three classic problems), then lesson 1.6 (practice, glossary, summary) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Vì sao xoá nút cuối là O(n) với danh sách liên kết đơn nhưng O(1) với danh sách liên kết đôi?</li>
<li>Sau khi xoá nút duy nhất của danh sách, <code>head</code> và <code>tail</code> phải bằng gì?</li>
<li>Danh sách vòng chỉ giữ <code>tail</code>. Nút đầu ở đâu?</li>
<li><code>get(i)</code> trên <code>ArrayList</code> hay <code>LinkedList</code> nhanh hơn? Vì sao?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) danh sách đơn phải đi tới nút đứng trước <code>tail</code>; danh sách đôi chỉ cần đọc <code>tail.prev</code>. (2) cả hai là <code>null</code>. (3) <code>tail.next</code>. (4) <code>ArrayList</code> — nó truy cập mảng theo chỉ số trong O(1), còn <code>LinkedList</code> phải đi qua O(n) nút.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu 1.1–1.5 ngay bên dưới (mảng động, ba loại danh sách liên kết, nút lính canh, <code>ArrayList</code> vs <code>LinkedList</code>, ba bài toán kinh điển), rồi bài 1.6 (thực hành, thuật ngữ, tóm tắt) và quiz của chương.</p>`),
    books([
      ['goodrich', 'Ch.3 Fundamental Data Structures — §3.1 Using Arrays p.104 · §3.2 Singly Linked Lists p.122 · §3.3 Circularly Linked Lists p.128 · §3.4 Doubly Linked Lists p.132', 'Chương 3 Fundamental Data Structures — §3.1 Using Arrays tr.104 · §3.2 Singly Linked Lists tr.122 · §3.3 Circularly Linked Lists tr.128 · §3.4 Doubly Linked Lists tr.132'],
    ]),
  ].join('\n'),
};

/* ───────── 1.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Lists & linked lists ───────── */
const L_on_ch1 = {
  title: '1.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Lists & linked lists|||1.6 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Danh sách & danh sách liên kết',
  slug: 'csd201-on-ch1',
  type: 'VIDEO',
  description: '7 bài tập kiểu đề PE trên danh sách liên kết (thêm có điều kiện, chèn vị trí k, xoá max, đảo ngược, sắp theo giá, trộn hai danh sách, Josephus trên danh sách vòng) có lời giải và test tự kiểm chạy thật; 20 thuật ngữ Anh–Việt; tóm tắt 7 ý và bảng độ phức tạp của chương 1.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.6 · Practice &amp; review</span>
<h2>Lists &amp; linked lists — practise like the PE, then review</h2>
<p class="lead">Seven exercises in the shape of the practical exam — from a ten-minute warm-up to a question interviewers love — each with a solution that tests itself. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the method yourself in Eclipse, on top of the given <code>Node</code>/<code>MyList</code> classes.</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it.</li>
</ol>
<p>In a CSD201 PE the skeleton — the <code>Node</code> class, the list class, a <code>main</code> with a menu and code that writes each answer to a file — is usually given, and you fill in the bodies of <code>f1</code>, <code>f2</code>, … Here every answer is printed on the screen instead of written to a file.</p></div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.6 · Thực hành &amp; ôn tập</span>
<h2>Danh sách &amp; danh sách liên kết — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Bảy bài tập theo dạng đề thi thực hành (PE) — từ bài khởi động mười phút tới một câu nhà tuyển dụng rất hay hỏi — bài nào cũng có lời giải tự kiểm tra được. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp để ôn trước FE.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết hàm trong Eclipse, dựa trên các lớp <code>Node</code>/<code>MyList</code> cho sẵn.</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Đề PE môn CSD201 thường cho sẵn bộ khung — lớp <code>Node</code>, lớp danh sách, hàm <code>main</code> có menu và đoạn code ghi từng đáp án ra file — còn bạn viết thân các hàm <code>f1</code>, <code>f2</code>, … Ở đây mọi kết quả được in ra màn hình thay vì ghi ra file.</p></div>`),
    bi(`<h3>🧪 Exercise 1 — f1: add to the tail, with a condition (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Cars <code>Car(owner, price)</code> are loaded into a singly linked list in the order of the data. Write <code>addLast(owner, price)</code> that appends a car <strong>only when price &gt; 0</strong>; invalid rows are skipped. <code>head</code> and <code>tail</code> must stay correct.</p>
<p class="nhan">Data → expected result</p>
<p>A 5, B −2, C 3, D 0, E 7 → <strong>expected:</strong> (A,5) (C,3) (E,7).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    boolean isEmpty() { return head == null; }

    // f1: add to the TAIL, but only when price &gt; 0
    void addLast(String owner, int price) {
        if (price &lt;= 0) return;                         // invalid data is skipped
        Node q = new Node(new Car(owner, price), null);
        if (isEmpty()) head = tail = q;
        else { tail.next = q; tail = q; }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe1AddLast {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        check("empty list prints nothing", t.traverse(), "");
        String[] owners = {"A", "B", "C", "D", "E"};
        int[] prices = {5, -2, 3, 0, 7};
        for (int i = 0; i &lt; owners.length; i++) t.addLast(owners[i], prices[i]);
        check("only price &gt; 0 kept, in input order", t.traverse(), "(A,5) (C,3) (E,7)");
        check("tail is the last valid car", t.tail.info.toString(), "(E,7)");
        t.addLast("F", 1);
        check("tail still right after one more add", t.traverse() + " | tail=" + t.tail.info, "(A,5) (C,3) (E,7) (F,1) | tail=(F,1)");
        MyList u = new MyList();
        u.addLast("X", -1);
        check("all-invalid input leaves list empty", String.valueOf(u.isEmpty()), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS empty list prints nothing<br>
PASS only price &gt; 0 kept, in input order<br>
PASS tail is the last valid car<br>
PASS tail still right after one more add<br>
PASS all-invalid input leaves list empty<br>
ALL TESTS PASSED</div>
<div class="pitfall">The empty-list case must set <strong>both</strong> <code>head</code> and <code>tail</code>. Setting only <code>head</code> leaves <code>tail == null</code>, and the second <code>addLast</code> crashes with a <code>NullPointerException</code> on <code>tail.next</code>.</div>`,
    `<h3>🧪 Bài 1 — f1: thêm vào cuối có điều kiện (kiểu PE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Các xe <code>Car(owner, price)</code> được nạp vào một danh sách liên kết đơn (singly linked list) theo đúng thứ tự dữ liệu. Viết <code>addLast(owner, price)</code> chỉ thêm xe vào cuối <strong>khi price &gt; 0</strong>; dòng không hợp lệ bị bỏ qua. <code>head</code> và <code>tail</code> phải luôn đúng.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>A 5, B −2, C 3, D 0, E 7 → <strong>kết quả mong đợi:</strong> (A,5) (C,3) (E,7).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    boolean isEmpty() { return head == null; }

    // f1: thêm vào CUỐI, chỉ khi price &gt; 0
    void addLast(String owner, int price) {
        if (price &lt;= 0) return;                         // dữ liệu không hợp lệ thì bỏ qua
        Node q = new Node(new Car(owner, price), null);
        if (isEmpty()) head = tail = q;
        else { tail.next = q; tail = q; }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe1AddLast {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        check("empty list prints nothing", t.traverse(), "");
        String[] owners = {"A", "B", "C", "D", "E"};
        int[] prices = {5, -2, 3, 0, 7};
        for (int i = 0; i &lt; owners.length; i++) t.addLast(owners[i], prices[i]);
        check("only price &gt; 0 kept, in input order", t.traverse(), "(A,5) (C,3) (E,7)");
        check("tail is the last valid car", t.tail.info.toString(), "(E,7)");
        t.addLast("F", 1);
        check("tail still right after one more add", t.traverse() + " | tail=" + t.tail.info, "(A,5) (C,3) (E,7) (F,1) | tail=(F,1)");
        MyList u = new MyList();
        u.addLast("X", -1);
        check("all-invalid input leaves list empty", String.valueOf(u.isEmpty()), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS empty list prints nothing<br>
PASS only price &gt; 0 kept, in input order<br>
PASS tail is the last valid car<br>
PASS tail still right after one more add<br>
PASS all-invalid input leaves list empty<br>
ALL TESTS PASSED</div>
<div class="pitfall">Trường hợp danh sách rỗng phải gán <strong>cả</strong> <code>head</code> lẫn <code>tail</code>. Chỉ gán <code>head</code> thì <code>tail == null</code>, và lần <code>addLast</code> thứ hai sẽ văng <code>NullPointerException</code> ở <code>tail.next</code>.</div>`),
    bi(`<h3>🧪 Exercise 2 — f2: insert at position k (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>insertAt(x, k)</code> so that after the call the new car is the node at position k (counting from 0). If <code>k &lt;= 0</code> or the list is empty, insert at the front; if k is past the end, append at the tail.</p>
<p class="nhan">Idea</p>
<p>walk a pointer <code>p</code> to position k − 1 (or stop at the tail), then <code>p.next = new Node(x, p.next)</code>. Only the front case changes <code>head</code>; only "inserted after the tail" changes <code>tail</code>.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(Car x) {
        Node q = new Node(x, null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f2: insert x so that it becomes the node at position k (0-based)
    void insertAt(Car x, int k) {
        if (head == null || k &lt;= 0) {                   // front (also covers the empty list)
            head = new Node(x, head);
            if (tail == null) tail = head;
            return;
        }
        Node p = head;                                  // p stops at position k-1 or at the tail
        for (int i = 0; i &lt; k - 1 &amp;&amp; p.next != null; i++) p = p.next;
        p.next = new Node(x, p.next);
        if (p == tail) tail = p.next;                   // inserted after the tail: new tail
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe2InsertAt {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        t.insertAt(new Car("B", 2), 3);                 // empty list: any k goes to the front
        check("insert into empty list", t.traverse() + " tail=" + t.tail.info, "(B,2) tail=(B,2)");
        t.addLast(new Car("D", 4));
        t.insertAt(new Car("A", 1), 0);
        check("k = 0 -&gt; new head", t.traverse(), "(A,1) (B,2) (D,4)");
        t.insertAt(new Car("C", 3), 2);
        check("k = 2 -&gt; middle", t.traverse(), "(A,1) (B,2) (C,3) (D,4)");
        t.insertAt(new Car("E", 5), 99);
        check("k past the end -&gt; tail", t.traverse() + " tail=" + t.tail.info, "(A,1) (B,2) (C,3) (D,4) (E,5) tail=(E,5)");
        t.insertAt(new Car("Z", 0), -5);
        check("negative k -&gt; head", t.traverse().substring(0, 5), "(Z,0)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS insert into empty list<br>
PASS k = 0 -&gt; new head<br>
PASS k = 2 -&gt; middle<br>
PASS k past the end -&gt; tail<br>
PASS negative k -&gt; head<br>
ALL TESTS PASSED</div>
<div class="pitfall">Off-by-one: stopping <code>p</code> <em>at</em> position k and inserting after it puts the car at k + 1. Check your loop with k = 1 by hand: <code>p</code> must stay on the head.</div>`,
    `<h3>🧪 Bài 2 — f2: chèn vào vị trí k (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>insertAt(x, k)</code> sao cho sau lời gọi, xe mới là nút ở vị trí k (đếm từ 0). Nếu <code>k &lt;= 0</code> hoặc danh sách rỗng thì chèn vào đầu; nếu k vượt quá cuối thì thêm vào cuối (tail).</p>
<p class="nhan">Ý tưởng</p>
<p>cho con trỏ <code>p</code> đi tới vị trí k − 1 (hoặc dừng ở tail), rồi <code>p.next = new Node(x, p.next)</code>. Chỉ trường hợp chèn đầu mới đổi <code>head</code>; chỉ trường hợp "chèn sau tail" mới đổi <code>tail</code>.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(Car x) {
        Node q = new Node(x, null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f2: chèn x để nó thành nút ở vị trí k (đếm từ 0)
    void insertAt(Car x, int k) {
        if (head == null || k &lt;= 0) {                   // chèn đầu (kể cả danh sách rỗng)
            head = new Node(x, head);
            if (tail == null) tail = head;
            return;
        }
        Node p = head;                                  // p dừng ở vị trí k-1 hoặc ở tail
        for (int i = 0; i &lt; k - 1 &amp;&amp; p.next != null; i++) p = p.next;
        p.next = new Node(x, p.next);
        if (p == tail) tail = p.next;                   // chèn sau tail: tail mới
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe2InsertAt {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        t.insertAt(new Car("B", 2), 3);                 // rỗng: k nào cũng vào đầu
        check("insert into empty list", t.traverse() + " tail=" + t.tail.info, "(B,2) tail=(B,2)");
        t.addLast(new Car("D", 4));
        t.insertAt(new Car("A", 1), 0);
        check("k = 0 -&gt; new head", t.traverse(), "(A,1) (B,2) (D,4)");
        t.insertAt(new Car("C", 3), 2);
        check("k = 2 -&gt; middle", t.traverse(), "(A,1) (B,2) (C,3) (D,4)");
        t.insertAt(new Car("E", 5), 99);
        check("k past the end -&gt; tail", t.traverse() + " tail=" + t.tail.info, "(A,1) (B,2) (C,3) (D,4) (E,5) tail=(E,5)");
        t.insertAt(new Car("Z", 0), -5);
        check("negative k -&gt; head", t.traverse().substring(0, 5), "(Z,0)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS insert into empty list<br>
PASS k = 0 -&gt; new head<br>
PASS k = 2 -&gt; middle<br>
PASS k past the end -&gt; tail<br>
PASS negative k -&gt; head<br>
ALL TESTS PASSED</div>
<div class="pitfall">Lệch một (off-by-one): cho <code>p</code> dừng <em>ở</em> vị trí k rồi chèn sau nó thì xe rơi vào vị trí k + 1. Hãy tự chạy tay vòng lặp với k = 1: <code>p</code> phải đứng yên ở head.</div>`),
    bi(`<h3>🧪 Exercise 3 — f3: delete the first car with the highest price (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Delete the <strong>first</strong> node whose price is the maximum. Handle: max at the head, max at the tail, two equal maxima, a list of one node.</p>
<p class="nhan">Idea</p>
<p>two passes — find the node (use <code>&gt;</code> so the first maximum wins), then find its predecessor and unlink it. Two passes are still O(n).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f3: delete the FIRST node whose price is the maximum
    void deleteFirstMax() {
        if (head == null) return;
        Node maxNode = head;                            // pass 1: find it (strict &gt; keeps the first one)
        for (Node p = head.next; p != null; p = p.next)
            if (p.info.price &gt; maxNode.info.price) maxNode = p;
        if (maxNode == head) {                          // pass 2: unlink it
            head = head.next;
            if (head == null) tail = null;
            return;
        }
        Node f = head;
        while (f.next != maxNode) f = f.next;           // f = the node before maxNode
        f.next = maxNode.next;
        if (maxNode == tail) tail = f;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe3DeleteMax {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String data) {                   // "A5 B9 C9" -&gt; list
        MyList t = new MyList();
        for (String w : data.split(" ")) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("A5 B9 C2 D9 E1");
        t.deleteFirstMax();
        check("max in the middle, first of two 9s", t.traverse(), "(A,5) (C,2) (D,9) (E,1)");
        t = make("A9 B1 C2");
        t.deleteFirstMax();
        check("max at the head", t.traverse(), "(B,1) (C,2)");
        t = make("A1 B2 C8");
        t.deleteFirstMax();
        check("max at the tail -&gt; tail updated", t.traverse() + " tail=" + t.tail.info, "(A,1) (B,2) tail=(B,2)");
        t = make("A7");
        t.deleteFirstMax();
        check("single node -&gt; empty list", String.valueOf(t.head == null &amp;&amp; t.tail == null), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS max in the middle, first of two 9s<br>
PASS max at the head<br>
PASS max at the tail -&gt; tail updated<br>
PASS single node -&gt; empty list<br>
ALL TESTS PASSED</div>
<div class="pitfall">Writing <code>&gt;=</code> in the search picks the <em>last</em> maximum, and the test "first of two 9s" fails. And when the deleted node is the tail, <code>tail</code> must move to its predecessor.</div>`,
    `<h3>🧪 Bài 3 — f3: xoá xe đầu tiên có giá cao nhất (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Xoá nút <strong>đầu tiên</strong> có price lớn nhất. Phải xử lý: max ở head, max ở tail, hai giá trị max bằng nhau, danh sách một nút.</p>
<p class="nhan">Ý tưởng</p>
<p>hai lượt — tìm nút đó (dùng <code>&gt;</code> để nút max đầu tiên được giữ), rồi tìm nút đứng trước nó (predecessor) và gỡ ra. Hai lượt vẫn là O(n).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f3: xoá nút ĐẦU TIÊN có price lớn nhất
    void deleteFirstMax() {
        if (head == null) return;
        Node maxNode = head;                            // lượt 1: tìm nó (dùng &gt; để giữ nút đầu tiên)
        for (Node p = head.next; p != null; p = p.next)
            if (p.info.price &gt; maxNode.info.price) maxNode = p;
        if (maxNode == head) {                          // lượt 2: gỡ nó ra
            head = head.next;
            if (head == null) tail = null;
            return;
        }
        Node f = head;
        while (f.next != maxNode) f = f.next;           // f = nút đứng trước maxNode
        f.next = maxNode.next;
        if (maxNode == tail) tail = f;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe3DeleteMax {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String data) {                   // "A5 B9 C9" -&gt; danh sách
        MyList t = new MyList();
        for (String w : data.split(" ")) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("A5 B9 C2 D9 E1");
        t.deleteFirstMax();
        check("max in the middle, first of two 9s", t.traverse(), "(A,5) (C,2) (D,9) (E,1)");
        t = make("A9 B1 C2");
        t.deleteFirstMax();
        check("max at the head", t.traverse(), "(B,1) (C,2)");
        t = make("A1 B2 C8");
        t.deleteFirstMax();
        check("max at the tail -&gt; tail updated", t.traverse() + " tail=" + t.tail.info, "(A,1) (B,2) tail=(B,2)");
        t = make("A7");
        t.deleteFirstMax();
        check("single node -&gt; empty list", String.valueOf(t.head == null &amp;&amp; t.tail == null), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS max in the middle, first of two 9s<br>
PASS max at the head<br>
PASS max at the tail -&gt; tail updated<br>
PASS single node -&gt; empty list<br>
ALL TESTS PASSED</div>
<div class="pitfall">Viết <code>&gt;=</code> khi tìm thì lấy trúng nút max <em>cuối cùng</em>, và test "first of two 9s" hỏng. Còn khi nút bị xoá là tail thì <code>tail</code> phải lùi về nút đứng trước nó.</div>`),
    bi(`<h3>🧪 Exercise 4 — reverse the list in place (interview classic · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Reverse a singly linked list without creating any node: O(n) time, O(1) extra memory. <code>head</code> and <code>tail</code> must be correct afterwards.</p>
<p class="nhan">Idea</p>
<p>three pointers <code>prev</code>, <code>cur</code>, <code>nxt</code>. At every node: remember the rest, turn the arrow back, step forward.</p>
<table>
<thead><tr><th>Step</th><th>prev</th><th>cur</th><th>Arrows so far (list 1 → 2 → 3)</th></tr></thead>
<tbody>
<tr><td>start</td><td>null</td><td>1</td><td>1 → 2 → 3</td></tr>
<tr><td>after node 1</td><td>1</td><td>2</td><td>null ← 1   2 → 3</td></tr>
<tr><td>after node 2</td><td>2</td><td>3</td><td>null ← 1 ← 2   3</td></tr>
<tr><td>after node 3</td><td>3</td><td>null</td><td>null ← 1 ← 2 ← 3 → head = 3</td></tr>
</tbody>
</table>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(int x) {
        Node q = new Node(x, null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // Reverse the list in place: no new node, O(n) time, O(1) extra memory
    void reverse() {
        Node prev = null, cur = head;
        tail = head;                                    // the old head will be the new tail
        while (cur != null) {
            Node nxt = cur.next;                        // 1. remember the rest
            cur.next = prev;                            // 2. turn the arrow around
            prev = cur;                                 // 3. step forward
            cur = nxt;
        }
        head = prev;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe4Reverse {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        for (int x = 1; x &lt;= 5; x++) t.addLast(x);
        t.reverse();
        check("1 2 3 4 5 reversed", t.traverse(), "5 4 3 2 1");
        check("head and tail swapped", t.head.info + " " + t.tail.info, "5 1");
        t.addLast(0);
        check("tail usable after reverse", t.traverse(), "5 4 3 2 1 0");
        MyList one = new MyList();
        one.addLast(7);
        one.reverse();
        check("one node", one.traverse(), "7");
        MyList empty = new MyList();
        empty.reverse();
        check("empty list", empty.traverse(), "");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 1 2 3 4 5 reversed<br>
PASS head and tail swapped<br>
PASS tail usable after reverse<br>
PASS one node<br>
PASS empty list<br>
ALL TESTS PASSED</div>
<div class="pitfall">Writing <code>cur.next = prev</code> <em>before</em> saving <code>cur.next</code> cuts the list and loses everything after <code>cur</code>. Save first, then turn.</div>`,
    `<h3>🧪 Bài 4 — đảo ngược danh sách tại chỗ (câu phỏng vấn kinh điển · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Đảo ngược danh sách liên kết đơn mà không tạo nút mới: thời gian O(n), bộ nhớ thêm O(1). Sau đó <code>head</code> và <code>tail</code> phải đúng.</p>
<p class="nhan">Ý tưởng</p>
<p>ba con trỏ <code>prev</code>, <code>cur</code>, <code>nxt</code>. Tại mỗi nút: nhớ phần còn lại, quay ngược mũi tên, rồi tiến lên.</p>
<table>
<thead><tr><th>Bước</th><th>prev</th><th>cur</th><th>Các mũi tên hiện tại (danh sách 1 → 2 → 3)</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>null</td><td>1</td><td>1 → 2 → 3</td></tr>
<tr><td>xong nút 1</td><td>1</td><td>2</td><td>null ← 1   2 → 3</td></tr>
<tr><td>xong nút 2</td><td>2</td><td>3</td><td>null ← 1 ← 2   3</td></tr>
<tr><td>xong nút 3</td><td>3</td><td>null</td><td>null ← 1 ← 2 ← 3 → head = 3</td></tr>
</tbody>
</table>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(int x) {
        Node q = new Node(x, null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // Đảo ngược tại chỗ: không tạo nút mới, O(n) thời gian, O(1) bộ nhớ thêm
    void reverse() {
        Node prev = null, cur = head;
        tail = head;                                    // head cũ sẽ thành tail mới
        while (cur != null) {
            Node nxt = cur.next;                        // 1. nhớ phần còn lại
            cur.next = prev;                            // 2. quay ngược mũi tên
            prev = cur;                                 // 3. tiến lên
            cur = nxt;
        }
        head = prev;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe4Reverse {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        for (int x = 1; x &lt;= 5; x++) t.addLast(x);
        t.reverse();
        check("1 2 3 4 5 reversed", t.traverse(), "5 4 3 2 1");
        check("head and tail swapped", t.head.info + " " + t.tail.info, "5 1");
        t.addLast(0);
        check("tail usable after reverse", t.traverse(), "5 4 3 2 1 0");
        MyList one = new MyList();
        one.addLast(7);
        one.reverse();
        check("one node", one.traverse(), "7");
        MyList empty = new MyList();
        empty.reverse();
        check("empty list", empty.traverse(), "");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 1 2 3 4 5 reversed<br>
PASS head and tail swapped<br>
PASS tail usable after reverse<br>
PASS one node<br>
PASS empty list<br>
ALL TESTS PASSED</div>
<div class="pitfall">Gán <code>cur.next = prev</code> <em>trước khi</em> lưu <code>cur.next</code> là cắt đứt danh sách, mất toàn bộ phần sau <code>cur</code>. Lưu trước, quay sau.</div>`),
    bi(`<h3>🧪 Exercise 5 — f4: sort ascending by price (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Sort the list of cars ascending by price. The PE usually accepts any correct O(n²) method.</p>
<p class="nhan">Idea</p>
<p>selection sort on nodes — for each node <code>p</code>, find the cheapest node from <code>p</code> to the end and swap the <em>data</em> (<code>info</code>) of the two nodes. Swapping data keeps every link, so <code>head</code> and <code>tail</code> stay valid for free. O(n²) comparisons.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f4: sort ascending by price — selection sort that swaps the DATA, not the nodes
    void sortByPrice() {
        for (Node p = head; p != null; p = p.next) {
            Node min = p;
            for (Node q = p.next; q != null; q = q.next)
                if (q.info.price &lt; min.info.price) min = q;
            if (min != p) {                              // swap info: head/tail links stay valid
                Car tmp = p.info; p.info = min.info; min.info = tmp;
            }
        }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe5SortByPrice {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        t.addLast("A", 5); t.addLast("B", 2); t.addLast("C", 9); t.addLast("D", 1); t.addLast("E", 7);
        t.sortByPrice();
        check("sorted by price", t.traverse(), "(D,1) (B,2) (A,5) (E,7) (C,9)");
        check("tail holds the most expensive car", t.tail.info.toString(), "(C,9)");
        MyList s = new MyList();
        s.addLast("X", 3); s.addLast("Y", 3); s.addLast("Z", 1);
        s.sortByPrice();
        check("equal prices: selection sort is NOT stable", s.traverse(), "(Z,1) (Y,3) (X,3)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS sorted by price<br>
PASS tail holds the most expensive car<br>
PASS equal prices: selection sort is NOT stable<br>
ALL TESTS PASSED</div>
<div class="pitfall">Selection sort by swapping is <strong>not stable</strong>: the third test shows (Y,3) moving before (X,3). If a task says "cars with the same price keep their original order", use insertion sort (move a node only past strictly greater prices).</div>`,
    `<h3>🧪 Bài 5 — f4: sắp tăng dần theo giá (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Sắp danh sách xe tăng dần theo price. Đề PE thường chấp nhận mọi cách O(n²) cho kết quả đúng.</p>
<p class="nhan">Ý tưởng</p>
<p>sắp xếp chọn (selection sort) trên các nút — với mỗi nút <code>p</code>, tìm nút rẻ nhất từ <code>p</code> tới cuối rồi đổi chỗ <em>dữ liệu</em> (<code>info</code>) của hai nút. Đổi dữ liệu thì mọi liên kết giữ nguyên, nên <code>head</code> và <code>tail</code> tự đúng. O(n²) phép so sánh.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner;
    int price;

    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info;
    Node next;

    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f4: sắp tăng theo price — selection sort đổi DỮ LIỆU, không đổi nút
    void sortByPrice() {
        for (Node p = head; p != null; p = p.next) {
            Node min = p;
            for (Node q = p.next; q != null; q = q.next)
                if (q.info.price &lt; min.info.price) min = q;
            if (min != p) {                              // đổi info: các liên kết head/tail vẫn đúng
                Car tmp = p.info; p.info = min.info; min.info = tmp;
            }
        }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe5SortByPrice {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyList t = new MyList();
        t.addLast("A", 5); t.addLast("B", 2); t.addLast("C", 9); t.addLast("D", 1); t.addLast("E", 7);
        t.sortByPrice();
        check("sorted by price", t.traverse(), "(D,1) (B,2) (A,5) (E,7) (C,9)");
        check("tail holds the most expensive car", t.tail.info.toString(), "(C,9)");
        MyList s = new MyList();
        s.addLast("X", 3); s.addLast("Y", 3); s.addLast("Z", 1);
        s.sortByPrice();
        check("equal prices: selection sort is NOT stable", s.traverse(), "(Z,1) (Y,3) (X,3)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS sorted by price<br>
PASS tail holds the most expensive car<br>
PASS equal prices: selection sort is NOT stable<br>
ALL TESTS PASSED</div>
<div class="pitfall">Selection sort kiểu đổi chỗ <strong>không ổn định (not stable)</strong>: test thứ ba cho thấy (Y,3) bị đưa lên trước (X,3). Nếu đề ghi "xe cùng giá giữ nguyên thứ tự ban đầu" thì phải dùng sắp xếp chèn (insertion sort — chỉ dời nút qua các giá lớn hơn hẳn).</div>`),
    bi(`<h3>🧪 Exercise 6 — merge two sorted lists (interview · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Given the heads of two ascending lists, return one ascending list made of the <em>same</em> nodes (relink them, create no new node except a helper). O(n + m).</p>
<p class="nhan">Idea</p>
<p>a dummy node in front of the result removes the "is the result empty?" special case; always append the smaller head; at the end, attach whatever list is left.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class Pe6MergeSorted {
    // Merge two ascending lists into one by RELINKING nodes (no new node)
    static Node merge(Node a, Node b) {
        Node dummy = new Node(0, null);                 // a helper node in front of the result
        Node t = dummy;
        while (a != null &amp;&amp; b != null) {
            if (a.info &lt;= b.info) { t.next = a; a = a.next; }   // &lt;= keeps equal keys of a first
            else { t.next = b; b = b.next; }
            t = t.next;
        }
        t.next = (a != null) ? a : b;                   // append whatever is left
        return dummy.next;
    }

    static Node make(int... v) {
        Node h = null;
        for (int i = v.length - 1; i &gt;= 0; i--) h = new Node(v[i], h);
        return h;
    }

    static String show(Node h) {
        StringBuilder s = new StringBuilder();
        for (Node p = h; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("interleaved", show(merge(make(1, 4, 6), make(2, 3, 7, 9))), "1 2 3 4 6 7 9");
        check("one list empty", show(merge(null, make(5, 8))), "5 8");
        check("equal keys", show(merge(make(2, 2), make(2))), "2 2 2");
        Node a = make(10, 20);
        Node m = merge(a, make(15));
        check("no new node: result starts with a's first node", String.valueOf(m == a), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS interleaved<br>
PASS one list empty<br>
PASS equal keys<br>
PASS no new node: result starts with a's first node<br>
ALL TESTS PASSED</div>
<p class="meo">🧠 <strong>Remember:</strong> this merge is exactly the heart of merge sort (Chapter 6). <code>&lt;=</code> takes equal keys from the first list first — that is what makes merge sort stable.</p>`,
    `<h3>🧪 Bài 6 — trộn hai danh sách đã sắp (phỏng vấn · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Cho head của hai danh sách tăng dần, trả về một danh sách tăng dần gồm <em>chính</em> các nút đó (nối lại liên kết, không tạo nút mới ngoài một nút phụ). O(n + m).</p>
<p class="nhan">Ý tưởng</p>
<p>một nút giả (dummy node) đứng trước kết quả giúp bỏ trường hợp đặc biệt "kết quả còn rỗng"; luôn nối head nhỏ hơn vào; cuối cùng nối phần còn dư của danh sách kia.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class Pe6MergeSorted {
    // Trộn hai danh sách tăng dần bằng cách NỐI LẠI nút (không tạo nút mới)
    static Node merge(Node a, Node b) {
        Node dummy = new Node(0, null);                 // nút giả đứng trước kết quả
        Node t = dummy;
        while (a != null &amp;&amp; b != null) {
            if (a.info &lt;= b.info) { t.next = a; a = a.next; }   // &lt;= giữ khoá bằng nhau của a đứng trước
            else { t.next = b; b = b.next; }
            t = t.next;
        }
        t.next = (a != null) ? a : b;                   // nối phần còn dư
        return dummy.next;
    }

    static Node make(int... v) {
        Node h = null;
        for (int i = v.length - 1; i &gt;= 0; i--) h = new Node(v[i], h);
        return h;
    }

    static String show(Node h) {
        StringBuilder s = new StringBuilder();
        for (Node p = h; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("interleaved", show(merge(make(1, 4, 6), make(2, 3, 7, 9))), "1 2 3 4 6 7 9");
        check("one list empty", show(merge(null, make(5, 8))), "5 8");
        check("equal keys", show(merge(make(2, 2), make(2))), "2 2 2");
        Node a = make(10, 20);
        Node m = merge(a, make(15));
        check("no new node: result starts with a's first node", String.valueOf(m == a), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS interleaved<br>
PASS one list empty<br>
PASS equal keys<br>
PASS no new node: result starts with a's first node<br>
ALL TESTS PASSED</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phép trộn này chính là trái tim của merge sort (Chương 6). Dấu <code>&lt;=</code> lấy khoá bằng nhau từ danh sách thứ nhất trước — nhờ đó merge sort ổn định (stable).</p>`),
    bi(`<h3>🧪 Exercise 7 — the Josephus circle on a circular list (~20 min)</h3>
<p class="nhan">Task</p>
<p>n people numbered 1…n sit in a circle; counting starts at person 1 and every k-th person leaves. Print the order in which they leave and the survivor. Use a circular singly linked list (slides 13–15 of the deck).</p>
<p class="nhan">Idea</p>
<p>keep a pointer <code>prev</code> to the node <em>before</em> the one being counted, so removing a person is one link change, O(1). Stop when one node points to itself. Total O(n·k).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x) { info = x; }
}

public class Pe7Josephus {
    // n people 1..n sit in a circle; every k-th person leaves
    static String play(int n, int k) {
        Node tail = null;
        for (int i = 1; i &lt;= n; i++) {                  // build the ring with addLast
            Node q = new Node(i);
            if (tail == null) q.next = q;
            else { q.next = tail.next; tail.next = q; }
            tail = q;
        }
        StringBuilder out = new StringBuilder();
        Node prev = tail;                               // the node before the current one
        while (prev.next != prev) {                     // more than one person left
            for (int i = 1; i &lt; k; i++) prev = prev.next;   // count k-1 steps
            Node out1 = prev.next;
            out.append(out1.info).append(' ');
            prev.next = out1.next;                      // unlink: O(1) in a ring
        }
        return out.toString() + "| survivor " + prev.info;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("n=7, k=3", play(7, 3), "3 6 2 7 5 1 | survivor 4");
        check("n=5, k=2", play(5, 2), "2 4 1 5 | survivor 3");
        check("k=1 removes in order", play(4, 1), "1 2 3 | survivor 4");
        check("n=1: nobody leaves", play(1, 3), "| survivor 1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS n=7, k=3<br>
PASS n=5, k=2<br>
PASS k=1 removes in order<br>
PASS n=1: nobody leaves<br>
ALL TESTS PASSED</div>
<div class="pitfall">Keeping a pointer to the current person instead of the one before it forces a second walk around the ring to find the predecessor for every removal. In a singly linked ring, always hold the node <em>before</em> the one you will delete.</div>`,
    `<h3>🧪 Bài 7 — bài toán Josephus trên danh sách vòng (~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>n người đánh số 1…n ngồi thành vòng tròn; đếm bắt đầu từ người số 1 và cứ người thứ k thì rời vòng. In thứ tự rời vòng và người còn lại cuối cùng. Dùng danh sách liên kết vòng đơn (circular singly linked list — slide 13–15 của bộ slide).</p>
<p class="nhan">Ý tưởng</p>
<p>giữ con trỏ <code>prev</code> trỏ vào nút <em>đứng trước</em> người đang được đếm, nên gỡ một người chỉ là đổi một liên kết, O(1). Dừng khi còn một nút tự trỏ về chính nó. Tổng cộng O(n·k).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x) { info = x; }
}

public class Pe7Josephus {
    // n người 1..n ngồi vòng tròn; cứ người thứ k thì rời vòng
    static String play(int n, int k) {
        Node tail = null;
        for (int i = 1; i &lt;= n; i++) {                  // dựng vòng bằng addLast
            Node q = new Node(i);
            if (tail == null) q.next = q;
            else { q.next = tail.next; tail.next = q; }
            tail = q;
        }
        StringBuilder out = new StringBuilder();
        Node prev = tail;                               // nút đứng trước người đang đếm
        while (prev.next != prev) {                     // còn hơn một người
            for (int i = 1; i &lt; k; i++) prev = prev.next;   // đếm k-1 bước
            Node out1 = prev.next;
            out.append(out1.info).append(' ');
            prev.next = out1.next;                      // gỡ ra: O(1) trên vòng
        }
        return out.toString() + "| survivor " + prev.info;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("n=7, k=3", play(7, 3), "3 6 2 7 5 1 | survivor 4");
        check("n=5, k=2", play(5, 2), "2 4 1 5 | survivor 3");
        check("k=1 removes in order", play(4, 1), "1 2 3 | survivor 4");
        check("n=1: nobody leaves", play(1, 3), "| survivor 1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS n=7, k=3<br>
PASS n=5, k=2<br>
PASS k=1 removes in order<br>
PASS n=1: nobody leaves<br>
ALL TESTS PASSED</div>
<div class="pitfall">Giữ con trỏ vào chính người đang đếm (thay vì người đứng trước) thì mỗi lần xoá lại phải đi thêm một vòng để tìm nút đứng trước. Trên vòng liên kết đơn, luôn cầm nút <em>đứng trước</em> nút sắp xoá.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>list</strong></td><td>danh sách</td><td>A sequence of items of one base type that can be read, added and removed at any position.</td></tr>
<tr><td><strong>abstract data type (ADT)</strong></td><td>kiểu dữ liệu trừu tượng</td><td>The values and operations of a type, independent of how it is stored.</td></tr>
<tr><td><strong>array</strong></td><td>mảng</td><td>Fixed-size contiguous cells, reached by index in O(1).</td></tr>
<tr><td><strong>dynamic array</strong></td><td>mảng động</td><td>An array that allocates a bigger one and copies when it is full, like <code>ArrayList</code>.</td></tr>
<tr><td><strong>capacity / size</strong></td><td>sức chứa / kích thước</td><td>Capacity is the length of the hidden array; size is the number of elements stored.</td></tr>
<tr><td><strong>node</strong></td><td>nút</td><td>One element of a linked structure: data plus links to other nodes.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu (con trỏ)</td><td>A variable that holds the address of an object, or <code>null</code>.</td></tr>
<tr><td><strong>self-referential structure</strong></td><td>cấu trúc tự tham chiếu</td><td>A class with a field of its own type, such as <code>Node next</code>.</td></tr>
<tr><td><strong>singly linked list</strong></td><td>danh sách liên kết đơn</td><td>Each node links only to its successor.</td></tr>
<tr><td><strong>doubly linked list</strong></td><td>danh sách liên kết đôi</td><td>Each node links to both its predecessor and its successor.</td></tr>
<tr><td><strong>circular linked list</strong></td><td>danh sách liên kết vòng</td><td>The last node links back to the first, so the nodes form a ring.</td></tr>
<tr><td><strong>head / tail</strong></td><td>nút đầu / nút cuối</td><td>References to the first and the last node of a list.</td></tr>
<tr><td><strong>traverse</strong></td><td>duyệt</td><td>Visit every node once, usually from <code>head</code> following <code>next</code>.</td></tr>
<tr><td><strong>predecessor / successor</strong></td><td>phần tử đứng trước / đứng sau</td><td>The item just before / just after a given item.</td></tr>
<tr><td><strong>sentinel (dummy node)</strong></td><td>nút lính canh (nút giả)</td><td>An extra node without user data that removes the empty-list special cases.</td></tr>
<tr><td><strong>garbage collector</strong></td><td>bộ dọn rác</td><td>The part of the JVM that frees objects no reference points to any more.</td></tr>
<tr><td><strong>round-robin scheduling</strong></td><td>lập lịch xoay vòng</td><td>Every process gets a short time slice, in cyclic order.</td></tr>
<tr><td><strong>amortized cost</strong></td><td>chi phí khấu hao</td><td>The average cost per operation over a long sequence, e.g. O(1) per append to an <code>ArrayList</code>.</td></tr>
<tr><td><strong>generics (type parameter E)</strong></td><td>kiểu tổng quát (tham số kiểu E)</td><td><code>LinkedList&lt;E&gt;</code> works for any element type fixed at compile time.</td></tr>
<tr><td><strong>stable sort</strong></td><td>sắp xếp ổn định</td><td>Equal keys keep their original relative order.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>list</strong></td><td>danh sách</td><td>Dãy phần tử cùng kiểu, đọc, thêm, xoá được ở bất kỳ vị trí nào.</td></tr>
<tr><td><strong>abstract data type (ADT)</strong></td><td>kiểu dữ liệu trừu tượng</td><td>Tập giá trị và thao tác của một kiểu, không phụ thuộc cách lưu trữ.</td></tr>
<tr><td><strong>array</strong></td><td>mảng</td><td>Các ô liền nhau, kích thước cố định, truy cập theo chỉ số trong O(1).</td></tr>
<tr><td><strong>dynamic array</strong></td><td>mảng động</td><td>Mảng tự cấp mảng lớn hơn rồi chép sang khi đầy, như <code>ArrayList</code>.</td></tr>
<tr><td><strong>capacity / size</strong></td><td>sức chứa / kích thước</td><td>Sức chứa là độ dài mảng ẩn bên trong; kích thước là số phần tử đang lưu.</td></tr>
<tr><td><strong>node</strong></td><td>nút</td><td>Một phần tử của cấu trúc liên kết: dữ liệu cộng liên kết tới các nút khác.</td></tr>
<tr><td><strong>reference</strong></td><td>tham chiếu (con trỏ)</td><td>Biến giữ địa chỉ của một đối tượng, hoặc <code>null</code>.</td></tr>
<tr><td><strong>self-referential structure</strong></td><td>cấu trúc tự tham chiếu</td><td>Lớp có trường mang chính kiểu của nó, như <code>Node next</code>.</td></tr>
<tr><td><strong>singly linked list</strong></td><td>danh sách liên kết đơn</td><td>Mỗi nút chỉ nối tới nút đứng sau.</td></tr>
<tr><td><strong>doubly linked list</strong></td><td>danh sách liên kết đôi</td><td>Mỗi nút nối tới cả nút đứng trước và nút đứng sau.</td></tr>
<tr><td><strong>circular linked list</strong></td><td>danh sách liên kết vòng</td><td>Nút cuối nối ngược về nút đầu, các nút tạo thành vòng tròn.</td></tr>
<tr><td><strong>head / tail</strong></td><td>nút đầu / nút cuối</td><td>Tham chiếu tới nút đầu và nút cuối của danh sách.</td></tr>
<tr><td><strong>traverse</strong></td><td>duyệt</td><td>Đi qua mỗi nút đúng một lần, thường từ <code>head</code> theo <code>next</code>.</td></tr>
<tr><td><strong>predecessor / successor</strong></td><td>phần tử đứng trước / đứng sau</td><td>Phần tử ngay trước / ngay sau một phần tử cho trước.</td></tr>
<tr><td><strong>sentinel (dummy node)</strong></td><td>nút lính canh (nút giả)</td><td>Nút phụ không chứa dữ liệu thật, giúp bỏ các trường hợp đặc biệt khi danh sách rỗng.</td></tr>
<tr><td><strong>garbage collector</strong></td><td>bộ dọn rác</td><td>Thành phần của JVM tự giải phóng đối tượng không còn tham chiếu nào trỏ tới.</td></tr>
<tr><td><strong>round-robin scheduling</strong></td><td>lập lịch xoay vòng</td><td>Mỗi tiến trình được một lát thời gian ngắn, lần lượt theo vòng.</td></tr>
<tr><td><strong>amortized cost</strong></td><td>chi phí khấu hao</td><td>Chi phí trung bình mỗi thao tác trên một chuỗi dài, ví dụ O(1) mỗi lần thêm vào <code>ArrayList</code>.</td></tr>
<tr><td><strong>generics (type parameter E)</strong></td><td>kiểu tổng quát (tham số kiểu E)</td><td><code>LinkedList&lt;E&gt;</code> dùng được cho mọi kiểu phần tử chốt lúc biên dịch.</td></tr>
<tr><td><strong>stable sort</strong></td><td>sắp xếp ổn định</td><td>Các khoá bằng nhau giữ nguyên thứ tự tương đối ban đầu.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 7 things to remember from Chapter 1</h2>
<ol>
<li><strong>List is an ADT</strong>; array and linked list are two implementations. Choose by the cost of the operations you need most.</li>
<li><strong>Array</strong>: <code>a[i]</code> in O(1); insert/delete in the middle O(n) because of shifting; capacity fixed at creation. A dynamic array (<code>ArrayList</code>) grows by copying, so appending is O(1) amortized.</li>
<li><strong>Singly linked list</strong>: O(1) at the head, O(1) append with a <code>tail</code> reference, but O(n) to delete the last node and O(n) to reach position i.</li>
<li>Every linked-list method must survive <strong>three cases</strong>: empty list, one node, and "did head or tail just change?".</li>
<li><strong>Doubly linked list</strong>: the <code>prev</code> link makes <code>removeLast</code> and deleting a held node O(1); <code>java.util.LinkedList</code> is doubly linked.</li>
<li><strong>Circular list</strong>: no <code>null</code> at the end — stop when back at the start; keep only <code>tail</code> (<code>tail.next</code> is the first node); <code>rotate()</code> is O(1) → round-robin, Josephus.</li>
<li>In Java: <code>ArrayList</code> for index-heavy work, <code>LinkedList</code>/<code>ArrayDeque</code> for work at the ends; never loop <code>get(i)</code> over a <code>LinkedList</code>; <code>remove(int)</code> removes a position, <code>remove(Object)</code> a value.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>Which three cases must every linked-list method handle?</li>
<li>Why does <code>sortByPrice</code> in Exercise 5 swap <code>info</code> instead of relinking nodes?</li>
<li>In Exercise 6, what does the dummy node save you from?</li>
<li>In a singly linked ring, which node must you hold to delete a node in O(1)?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) the empty list, a single node, and a change of <code>head</code> or <code>tail</code>. (2) Swapping data keeps every link, so <code>head</code> and <code>tail</code> stay correct with no extra work. (3) The special case "the result list is still empty" — the first append is like every other one. (4) The node <em>before</em> it, because <code>prev.next = victim.next</code> needs the predecessor.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Operation</th><th>Array / <code>ArrayList</code></th><th>Singly linked (head + tail)</th><th>Doubly linked</th><th>Circular (tail only)</th></tr></thead>
<tbody>
<tr><td><code>get(i)</code></td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>add at the front</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>add at the end</td><td>O(1) amortized</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>remove the first</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>remove the last</td><td>O(1)</td><td>O(n)</td><td>O(1)</td><td>O(n)</td></tr>
<tr><td>search a value</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>insert/delete next to a node you hold</td><td>O(n) (shifting)</td><td>O(1) after it</td><td>O(1)</td><td>O(1) after it</td></tr>
<tr><td>reverse the whole list</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 7 điều cần nhớ của Chương 1</h2>
<ol>
<li><strong>Danh sách (list) là một ADT</strong>; mảng và danh sách liên kết là hai cách cài đặt. Chọn theo chi phí của những thao tác bạn dùng nhiều nhất.</li>
<li><strong>Mảng (array)</strong>: <code>a[i]</code> trong O(1); chèn/xoá ở giữa O(n) vì phải dời phần tử; sức chứa cố định lúc tạo. Mảng động (<code>ArrayList</code>) nới rộng bằng cách chép sang mảng mới, nên thêm vào cuối là O(1) khấu hao.</li>
<li><strong>Danh sách liên kết đơn (singly linked list)</strong>: O(1) ở đầu, O(1) khi thêm vào cuối nhờ <code>tail</code>, nhưng O(n) khi xoá nút cuối và O(n) để tới vị trí i.</li>
<li>Mọi hàm trên danh sách liên kết phải chạy đúng với <strong>ba trường hợp</strong>: danh sách rỗng, một nút, và "head hoặc tail vừa bị đổi chưa?".</li>
<li><strong>Danh sách liên kết đôi (doubly linked list)</strong>: liên kết <code>prev</code> làm <code>removeLast</code> và xoá một nút đang cầm thành O(1); <code>java.util.LinkedList</code> là danh sách liên kết đôi.</li>
<li><strong>Danh sách vòng (circular list)</strong>: cuối không có <code>null</code> — dừng khi quay lại điểm xuất phát; chỉ cần giữ <code>tail</code> (<code>tail.next</code> là nút đầu); <code>rotate()</code> là O(1) → lập lịch xoay vòng (round-robin), bài Josephus.</li>
<li>Trong Java: <code>ArrayList</code> cho việc truy cập theo chỉ số, <code>LinkedList</code>/<code>ArrayDeque</code> cho việc làm ở hai đầu; đừng bao giờ lặp <code>get(i)</code> trên <code>LinkedList</code>; <code>remove(int)</code> xoá theo vị trí, <code>remove(Object)</code> xoá theo giá trị.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li>Mọi hàm trên danh sách liên kết phải xử lý ba trường hợp nào?</li>
<li>Vì sao <code>sortByPrice</code> ở Bài 5 đổi <code>info</code> thay vì nối lại các nút?</li>
<li>Ở Bài 6, nút giả (dummy node) giúp bạn tránh được điều gì?</li>
<li>Trên vòng liên kết đơn, phải cầm nút nào để xoá một nút trong O(1)?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) danh sách rỗng, danh sách một nút, và việc <code>head</code> hoặc <code>tail</code> bị thay đổi. (2) Đổi dữ liệu thì mọi liên kết giữ nguyên, nên <code>head</code> và <code>tail</code> tự đúng mà không phải làm gì thêm. (3) Trường hợp đặc biệt "danh sách kết quả còn rỗng" — lần nối đầu tiên giống hệt mọi lần khác. (4) Nút <em>đứng trước</em> nó, vì <code>prev.next = victim.next</code> cần nút đứng trước.</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Thao tác</th><th>Mảng / <code>ArrayList</code></th><th>Liên kết đơn (head + tail)</th><th>Liên kết đôi</th><th>Vòng (chỉ giữ tail)</th></tr></thead>
<tbody>
<tr><td><code>get(i)</code></td><td>O(1)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>thêm vào đầu</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>thêm vào cuối</td><td>O(1) khấu hao</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>xoá phần tử đầu</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>O(1)</td></tr>
<tr><td>xoá phần tử cuối</td><td>O(1)</td><td>O(n)</td><td>O(1)</td><td>O(n)</td></tr>
<tr><td>tìm một giá trị</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>chèn/xoá cạnh một nút đang cầm</td><td>O(n) (dời phần tử)</td><td>O(1) phía sau nó</td><td>O(1)</td><td>O(1) phía sau nó</td></tr>
<tr><td>đảo ngược cả danh sách</td><td>O(n)</td><td>O(n)</td><td>O(n)</td><td>O(n)</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch1) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'What does this code print? The constructor Node(int x, Node p) sets info = x and next = p.|||Đoạn code sau in ra gì? Hàm khởi tạo Node(int x, Node p) gán info = x và next = p.',
      code: `Node head = null;
for (int x = 1; x <= 3; x++) head = new Node(x, head);
for (Node p = head; p != null; p = p.next) System.out.print(p.info + " ");`,
      codeLang: 'java',
      options: ['3 2 1|||3 2 1', '1 2 3|||1 2 3', '3 3 3|||3 3 3', '1 1 1|||1 1 1'],
      correctIndex: 0,
      points: 1,
      explanation: 'new Node(x, head) puts every new node IN FRONT of the old head, so the value inserted last (3) becomes the head and the list reads 3 → 2 → 1. "1 2 3" is the tempting answer, but it needs appending at the tail (tail.next = q; tail = q), which this loop never does.|||new Node(x, head) đặt mỗi nút mới ĐỨNG TRƯỚC head cũ, nên giá trị chèn sau cùng (3) thành head và danh sách đọc ra 3 → 2 → 1. "1 2 3" là đáp án dễ nhầm, nhưng muốn vậy phải thêm vào cuối (tail.next = q; tail = q) — vòng lặp này không hề làm thế.' },
    { id: 'q2',
      question: 'A singly linked list keeps references to both head and tail. Which operation needs O(n) time?|||Một danh sách liên kết đơn giữ tham chiếu tới cả head và tail. Thao tác nào tốn thời gian O(n)?',
      options: ['Insert a new node at the front|||Chèn một nút mới vào đầu', 'Insert a new node at the end|||Chèn một nút mới vào cuối', 'Delete the first node|||Xoá nút đầu tiên', 'Delete the last node|||Xoá nút cuối cùng'],
      correctIndex: 3,
      points: 1,
      explanation: 'To delete the last node, tail must move back to the node before it, and a singly linked list has no backward link, so that node is found by walking from head: O(n). Inserting at the end is the tempting choice, but with a tail reference it is O(1): tail.next = q; tail = q.|||Muốn xoá nút cuối, tail phải lùi về nút đứng trước nó, mà danh sách liên kết đơn không có liên kết ngược nên phải đi từ head để tìm: O(n). Chèn vào cuối là lựa chọn dễ nhầm, nhưng khi có tail thì chỉ O(1): tail.next = q; tail = q.' },
    { id: 'q3',
      question: 'A list has exactly one node, referenced by both head and tail. A method deletes it by running only head = head.next; What is the state afterwards?|||Danh sách có đúng một nút, cả head lẫn tail cùng trỏ vào nó. Một hàm xoá nút này chỉ bằng lệnh head = head.next; Trạng thái sau đó là gì?',
      options: ['head and tail are both null, so the list is correctly empty|||head và tail đều null, danh sách rỗng đúng cách', 'head is null but tail still references the deleted node|||head là null nhưng tail vẫn trỏ vào nút đã xoá', 'head and tail both still reference the deleted node|||head và tail vẫn cùng trỏ vào nút đã xoá', 'A NullPointerException is thrown by that statement|||Lệnh đó ném ra NullPointerException'],
      correctIndex: 1,
      points: 1,
      explanation: 'head.next of the only node is null, so head becomes null — but nothing touches tail, which still points to the removed node. The next addLast would write tail.next and bring back a node that cannot be reached from head. The fix is the special case: if (head == tail) head = tail = null. There is no exception: head is not null at the moment head.next is read.|||head.next của nút duy nhất là null nên head thành null — nhưng không lệnh nào đụng tới tail, nên tail vẫn trỏ vào nút đã xoá. Lần addLast kế tiếp sẽ ghi vào tail.next và "hồi sinh" một nút không đi tới được từ head. Cách sửa là trường hợp riêng: if (head == tail) head = tail = null. Không có ngoại lệ nào: lúc đọc head.next thì head chưa phải null.' },
    { id: 'q4',
      question: 'The list is 5 → 8 → 3 and tail references the node 3. After calling dele(3) below, what is wrong?|||Danh sách là 5 → 8 → 3 và tail trỏ vào nút 3. Sau khi gọi dele(3) bên dưới, điều gì bị sai?',
      code: `static void dele(int x) {   // assume head != null and head.info != x
    Node f = head, p = head.next;
    while (p != null && p.info != x) { f = p; p = p.next; }
    if (p != null) f.next = p.next;
}`,
      codeLang: 'java',
      options: ['Node 3 is still reachable from head|||Nút 3 vẫn còn đi tới được từ head', 'The whole list becomes empty|||Cả danh sách trở thành rỗng', 'tail still references the removed node 3|||tail vẫn trỏ vào nút 3 đã bị gỡ', 'Node 8 is removed instead of node 3|||Nút 8 bị gỡ thay cho nút 3'],
      correctIndex: 2,
      points: 1,
      explanation: 'The loop stops with p on 3 and f on 8, and f.next = p.next (null) unlinks 3 correctly, so the list read from head is 5 → 8. But the code never runs if (p == tail) tail = f, so tail still points at 3 and the next append is lost. Option A is wrong: walking from head, 3 can no longer be reached.|||Vòng lặp dừng khi p ở 3 và f ở 8, rồi f.next = p.next (null) gỡ 3 đúng cách, nên đọc từ head được 5 → 8. Nhưng code không có if (p == tail) tail = f, nên tail vẫn trỏ vào 3 và lần thêm vào cuối kế tiếp bị mất. Phương án A sai: đi từ head thì không còn tới được 3.' },
    { id: 'q5',
      question: 'A circular singly linked list stores only one reference, tail. Which expression gives the first node?|||Một danh sách liên kết vòng đơn chỉ lưu một tham chiếu là tail. Biểu thức nào cho ra nút đầu tiên?',
      options: ['tail.next|||tail.next', 'tail.prev|||tail.prev', 'tail itself|||chính tail', 'null, because a ring has no first node|||null, vì vòng tròn không có nút đầu'],
      correctIndex: 0,
      points: 1,
      explanation: 'In a circular list the last node links back to the first, so tail.next is the first node — that is why keeping only tail gives O(1) access to both ends. A singly linked node has no prev field. Option D is tempting because a ring "has no end", but the list still has a node it calls first.|||Trong danh sách vòng, nút cuối nối ngược về nút đầu, nên tail.next chính là nút đầu — vì vậy chỉ giữ tail là đủ truy cập O(1) cả hai đầu. Nút của danh sách liên kết đơn không có trường prev. Phương án D dễ nhầm vì vòng tròn "không có điểm cuối", nhưng danh sách vẫn có một nút được gọi là nút đầu.' },
    { id: 'q6',
      question: 'A doubly linked list has at least two nodes. Which code removes its last node correctly?|||Một danh sách liên kết đôi có ít nhất hai nút. Đoạn code nào xoá nút cuối đúng?',
      options: ['tail = tail.prev; tail.next = null;|||tail = tail.prev; tail.next = null;', 'tail.next = null; tail = tail.prev;|||tail.next = null; tail = tail.prev;', 'tail.prev = null; tail = tail.prev;|||tail.prev = null; tail = tail.prev;', 'tail = tail.next; tail.prev = null;|||tail = tail.next; tail.prev = null;'],
      correctIndex: 0,
      points: 1,
      explanation: "Step back first, then cut: after tail = tail.prev, the new last node's next is set to null, so the old node is no longer reachable — O(1), no search. Option B looks almost the same, but it sets next of the OLD tail (already null) and only then steps back, so the new tail still links forward to the removed node. C makes tail null and D reads tail.next, which is null.|||Lùi trước rồi cắt: sau tail = tail.prev, next của nút cuối mới được gán null nên nút cũ không còn đi tới được — O(1), không phải tìm. Phương án B trông gần giống nhưng lại gán next của tail CŨ (vốn đã null) rồi mới lùi, nên tail mới vẫn nối tới nút đã xoá. C làm tail thành null, còn D đọc tail.next, vốn là null." },
    { id: 'q7',
      question: 'What does this code print?|||Đoạn code sau in ra gì?',
      code: `ArrayList<Integer> a = new ArrayList<Integer>();
a.add(10); a.add(20); a.add(1); a.add(30);
a.remove(1);
System.out.println(a);`,
      codeLang: 'java',
      options: ['[10, 20, 30]|||[10, 20, 30]', '[10, 1, 30]|||[10, 1, 30]', '[20, 1, 30]|||[20, 1, 30]', '[10, 20, 1]|||[10, 20, 1]'],
      correctIndex: 1,
      points: 1,
      explanation: 'With an int argument Java chooses remove(int index), which removes the element AT index 1 — the value 20. To remove the value 1 you must write a.remove(Integer.valueOf(1)); that call would give [10, 20, 30], the tempting option A.|||Với đối số kiểu int, Java chọn remove(int index): xoá phần tử Ở chỉ số 1 — tức giá trị 20. Muốn xoá giá trị 1 phải viết a.remove(Integer.valueOf(1)); khi đó mới ra [10, 20, 30], chính là phương án A dễ nhầm.' },
    { id: 'q8',
      question: 'list is a java.util.LinkedList<Integer> with n elements. Which loop computes the sum in O(n) total time?|||list là một java.util.LinkedList<Integer> có n phần tử. Vòng lặp nào tính tổng trong tổng thời gian O(n)?',
      options: ['for (int i = 0; i < list.size(); i++) sum += list.get(i);|||for (int i = 0; i < list.size(); i++) sum += list.get(i);', 'for (int i = list.size() - 1; i >= 0; i--) sum += list.get(i);|||for (int i = list.size() - 1; i >= 0; i--) sum += list.get(i);', 'for (int i = 0; i < list.size(); i++) sum += list.get(list.size() - 1 - i);|||for (int i = 0; i < list.size(); i++) sum += list.get(list.size() - 1 - i);', 'for (int x : list) sum += x;|||for (int x : list) sum += x;'],
      correctIndex: 3,
      points: 1,
      explanation: 'The for-each loop uses an iterator that moves one node per step: n steps in total. Every get(i) on a LinkedList walks from the nearer end, up to n/2 nodes, so any loop that calls get(i) n times is O(n²). Walking backwards (option B) does not help: each get still starts again from one end.|||Vòng for-each dùng iterator (bộ duyệt) đi một nút mỗi bước: tổng cộng n bước. Mỗi lần get(i) trên LinkedList phải đi từ đầu gần hơn, tới n/2 nút, nên vòng lặp nào gọi get(i) n lần đều là O(n²). Đi ngược (phương án B) cũng không cứu được: mỗi lần get vẫn bắt đầu lại từ một đầu.' },
    { id: 'q9',
      question: 'An array has capacity 20 and holds 10 elements in cells 0–9. How many elements must be moved to insert a new element at index 3?|||Một mảng sức chứa 20 đang giữ 10 phần tử ở các ô 0–9. Phải dời bao nhiêu phần tử để chèn một phần tử mới vào chỉ số 3?',
      options: ['3|||3', '6|||6', '7|||7', '10|||10'],
      correctIndex: 2,
      points: 1,
      explanation: 'Every element from index 3 to index 9 moves one cell to the right: 9 − 3 + 1 = 7 moves (in general n − i). Six is the classic off-by-one: forgetting that the element already sitting at index 3 must move too.|||Mọi phần tử từ chỉ số 3 tới chỉ số 9 dời sang phải một ô: 9 − 3 + 1 = 7 lần dời (tổng quát là n − i). Sáu là lỗi lệch một kinh điển: quên rằng phần tử đang nằm ở chỉ số 3 cũng phải dời.' },
    { id: 'q10',
      question: 'A music player must go to the next song, go back to the previous song and delete the current song, each in O(1). Which structure fits best?|||Một trình phát nhạc cần sang bài kế, quay lại bài trước và xoá bài đang phát, mỗi việc trong O(1). Cấu trúc nào hợp nhất?',
      options: ['An array of songs|||Một mảng các bài hát', 'A singly linked list|||Danh sách liên kết đơn', 'A doubly linked list|||Danh sách liên kết đôi', 'An ArrayList of songs|||Một ArrayList các bài hát'],
      correctIndex: 2,
      points: 1,
      explanation: 'With prev and next links you move both ways and unlink the current node in O(1) (p.prev.next = p.next; p.next.prev = p.prev). A singly linked list is the tempting choice, but "previous song" and "delete the current song" both need the predecessor, which costs O(n) to find. An array or ArrayList must shift elements on delete: O(n).|||Có liên kết prev và next thì đi được hai chiều và gỡ nút hiện tại trong O(1) (p.prev.next = p.next; p.next.prev = p.prev). Danh sách liên kết đơn là lựa chọn dễ nhầm, nhưng cả "bài trước" lẫn "xoá bài đang phát" đều cần nút đứng trước, mà tìm nó tốn O(n). Mảng hay ArrayList phải dời phần tử khi xoá: O(n).' },
  ],
};

export default {
  slides: [L_csd4_1],
  practice: L_on_ch1,
  quiz: QUIZ,
  quizDescription: '10 câu tình huống và đọc code về mảng, danh sách liên kết đơn/đôi/vòng, head/tail, ArrayList vs LinkedList — mỗi câu có giải thích vì sao đúng và vì sao phương án dễ nhầm lại sai.',
};
