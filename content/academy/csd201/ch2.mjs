/**
 * CSD201 · Chương 2 — ngăn xếp, hàng đợi, hàng đợi ưu tiên.
 * Bài 📑 học theo từng slide: csd5 (2A-Stacks.ppt, 19 slide); csd6 (2B-Queues.ppt, 21 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch2.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch2).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 2.A — 📑 Slide by slide · Stacks (2A-Stacks, slides 1–19) ───────── */
const L_csd5_1 = {
  title: '2.A — 📑 Slide by slide · Stacks (2A-Stacks, slides 1–19)|||2.A — 📑 Học theo từng slide · Ngăn xếp (2A-Stacks, slide 1–19)',
  slug: 'csd201-slide-csd5-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–19 của bộ 2A-Stacks: LIFO, 5 thao tác, ngoại lệ khi rỗng, ứng dụng, run-time stack, stack bằng mảng (lỗi grow() trên slide chạy thật và bản sửa) và bằng danh sách liên kết, đổi thập phân sang nhị phân, kiểm tra dấu ngoặc và thẻ HTML, lớp java.util.Stack — 15 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.A · 2A-Stacks, slides 1–19</span>
<h2>Stacks — the deck, slide by slide</h2>
<p class="lead">This is the deck of syllabus session 5 (2.1 Stacks, CLO2). Read it before lessons 2.1–2.5 below: every slide is here with what it means, a runnable Java program for every operation, the stack drawn step by step, the cost in Big-O, and the traps that cost marks in the FE and the PE — including a real bug in the slide's own <code>ArrayStack</code> code (slide 10).</p>
<div class="callout"><strong>CLO2 in the syllabus:</strong> define stack and queue; describe their basic operations and their uses. The syllabus's discussion questions for these sessions are "What is a stack?", "What are the applications of the stack?" and "What are the 3 primary methods for a stack?" — answered by slides 3, 6 and 4. Typical exam tasks: trace a sequence of push/pop, write push/pop on an array or a linked list, or use a stack to check brackets or convert a number.</div>
<h3>The whole deck in one table</h3>
<table>
<thead><tr><th>Operation</th><th>Array stack (slides 8–10)</th><th>Linked stack (slide 11)</th><th>On <code>ArrayList</code> / <code>LinkedList</code> (slide 12)</th></tr></thead>
<tbody>
<tr><td><code>push(x)</code></td><td>O(1); the push that grows the array is O(n), amortized O(1)</td><td>O(1) — a new head node</td><td>O(1) amortized / O(1) — add at the end</td></tr>
<tr><td><code>pop()</code>, <code>top()</code></td><td>O(1) — the cell <code>a[top]</code></td><td>O(1) — the head node</td><td>O(1) — the last element</td></tr>
<tr><td><code>isEmpty()</code></td><td>O(1) — <code>top == -1</code></td><td>O(1) — <code>head == null</code></td><td>O(1) — <code>h.isEmpty()</code></td></tr>
<tr><td>Can it be full?</td><td>yes — grow the array or throw an exception</td><td>no (only if memory runs out)</td><td>no — the list grows by itself</td></tr>
<tr><td><code>pop()</code> on an empty stack</td><td>throws <code>EmptyStackException</code></td><td>throws <code>EmptyStackException</code></td><td>returns <code>null</code> (slide 12's choice)</td></tr>
<tr><td>Memory per element</td><td>one cell, plus unused cells</td><td>a node: data + <code>next</code></td><td>ArrayList: one cell; LinkedList: a node with two links</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.A · 2A-Stacks, slide 1–19</span>
<h2>Ngăn xếp — học bộ slide từng trang</h2>
<p class="lead">Đây là bộ slide của buổi 5 theo syllabus (2.1 Stacks, CLO2). Hãy đọc bài này trước các bài 2.1–2.5 bên dưới: slide nào cũng có ý nghĩa, chương trình Java chạy được cho từng thao tác, ngăn xếp (stack) vẽ lại từng bước, chi phí Big-O và những bẫy hay mất điểm ở FE (thi cuối kỳ) và PE (thi thực hành) — kể cả một lỗi thật nằm ngay trong code <code>ArrayStack</code> của slide (slide 10).</p>
<div class="callout"><strong>CLO2 trong syllabus:</strong> định nghĩa được ngăn xếp (stack) và hàng đợi (queue); mô tả các thao tác cơ bản và công dụng của chúng. Câu hỏi thảo luận của syllabus cho các buổi này là "Stack là gì?", "Stack có những ứng dụng nào?" và "3 phương thức chính của stack là gì?" — lời đáp nằm ở slide 3, 6 và 4. Dạng bài thường gặp: lần theo một dãy push/pop (đẩy vào/lấy ra), viết push/pop trên mảng hoặc danh sách liên kết, hoặc dùng stack để kiểm tra dấu ngoặc, đổi cơ số một số.</div>
<h3>Cả bộ slide trong một bảng</h3>
<table>
<thead><tr><th>Thao tác</th><th>Stack bằng mảng (slide 8–10)</th><th>Stack liên kết (slide 11)</th><th>Dựa trên <code>ArrayList</code> / <code>LinkedList</code> (slide 12)</th></tr></thead>
<tbody>
<tr><td><code>push(x)</code> — đẩy vào</td><td>O(1); lần push phải nới mảng tốn O(n), khấu hao (amortized) vẫn O(1)</td><td>O(1) — tạo nút head mới</td><td>O(1) khấu hao / O(1) — thêm vào cuối</td></tr>
<tr><td><code>pop()</code>, <code>top()</code> — lấy ra, xem đỉnh</td><td>O(1) — ô <code>a[top]</code></td><td>O(1) — nút head</td><td>O(1) — phần tử cuối</td></tr>
<tr><td><code>isEmpty()</code> — kiểm tra rỗng</td><td>O(1) — <code>top == -1</code></td><td>O(1) — <code>head == null</code></td><td>O(1) — <code>h.isEmpty()</code></td></tr>
<tr><td>Có thể bị đầy?</td><td>có — nới mảng hoặc ném ngoại lệ</td><td>không (trừ khi hết bộ nhớ)</td><td>không — danh sách tự nới</td></tr>
<tr><td><code>pop()</code> khi stack rỗng</td><td>ném <code>EmptyStackException</code></td><td>ném <code>EmptyStackException</code></td><td>trả về <code>null</code> (lựa chọn của slide 12)</td></tr>
<tr><td>Bộ nhớ mỗi phần tử</td><td>một ô, cộng các ô chưa dùng</td><td>một nút: dữ liệu + <code>next</code></td><td>ArrayList: một ô; LinkedList: một nút hai liên kết</td></tr>
</tbody>
</table>`),
    walkHead('csd5', 1, 19),
    walk('csd5', [
      [1, '2. Stack and Queue - Part 1: Stack',
        `<p class="y-chinh">🎯 Chapter 2 is about two structures with restricted access — the stack and the queue; this first deck covers the stack.</p>
<p>A stack is a list you may touch at <strong>one end only</strong>. Giving up the freedom of chapter 1 (insert anywhere) buys simplicity: every stack operation is O(1), and problems such as matching brackets, undo and method calls become easy. Part 2 (deck 2B-Queues, lesson 2.B) covers queues, deques and priority queues.</p>`,
        `<p class="y-chinh">🎯 Chương 2 nói về hai cấu trúc bị giới hạn cách truy cập — ngăn xếp (stack) và hàng đợi (queue); bộ slide đầu tiên này dành cho ngăn xếp.</p>
<p>Ngăn xếp là một danh sách chỉ được đụng vào <strong>một đầu</strong>. Bỏ bớt sự tự do của chương 1 (chèn ở đâu cũng được) đổi lại sự đơn giản: mọi thao tác của stack đều O(1), và các bài toán như kiểm tra dấu ngoặc, hoàn tác (undo), gọi hàm trở nên dễ. Phần 2 (bộ 2B-Queues, bài 2.B) học hàng đợi, hàng đợi hai đầu (deque) và hàng đợi ưu tiên (priority queue).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Four goals: what a stack is, two ways to build one (an array, a singly linked list), and the stack class Java already provides.</p>
<ol>
<li><strong>Stacks</strong> — slides 3–7: the LIFO rule, the five operations, the empty-stack exception, applications, and the run-time stack behind every method call.</li>
<li><strong>Array-based stack</strong> — slides 8–10: the index <code>top</code>, the "full" problem, and the <code>ArrayStack</code> code (with a bug to find).</li>
<li><strong>Stack implemented by a singly linked list</strong> — slide 11; then stacks built on <code>ArrayList</code>/<code>LinkedList</code> (slide 12) and three applications: binary conversion, brackets, HTML tags (slides 13–16).</li>
<li><strong>Stack class in java.util</strong> — slide 17, and why modern code prefers <code>ArrayDeque</code>.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> the same pattern as chapter 1 — one ADT, several implementations; compare them by the cost of push and pop.</p>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu: ngăn xếp (stack) là gì, hai cách dựng nó (bằng mảng, bằng danh sách liên kết đơn), và lớp stack mà Java có sẵn.</p>
<ol>
<li><strong>Ngăn xếp</strong> — slide 3–7: luật LIFO (last in, first out — vào sau ra trước), năm thao tác, ngoại lệ (exception) khi stack rỗng, các ứng dụng, và ngăn xếp thời gian chạy (run-time stack) đứng sau mọi lời gọi hàm.</li>
<li><strong>Stack bằng mảng (array-based stack)</strong> — slide 8–10: chỉ số <code>top</code>, chuyện "bị đầy", và code <code>ArrayStack</code> (có một lỗi cần tìm).</li>
<li><strong>Stack bằng danh sách liên kết đơn (singly linked list)</strong> — slide 11; rồi stack dựng trên <code>ArrayList</code>/<code>LinkedList</code> (slide 12) và ba ứng dụng: đổi sang nhị phân, kiểm tra dấu ngoặc, kiểm tra thẻ HTML (slide 13–16).</li>
<li><strong>Lớp Stack trong gói java.util</strong> — slide 17, và vì sao code hiện đại chuộng <code>ArrayDeque</code> hơn.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vẫn khuôn của chương 1 — một ADT (kiểu dữ liệu trừu tượng), nhiều cách cài đặt; so sánh chúng bằng chi phí của push (đẩy vào) và pop (lấy ra).</p>`],
      [3, 'What is a stack?',
        `<p class="y-chinh">🎯 A stack is a linear structure that can be accessed only at one end, the top: the element pushed last is the first one popped (LIFO).</p>
<ul>
<li><strong>Linear</strong>: the elements form a sequence from bottom to top, like a list — but only the top can be touched.</li>
<li><strong>Push</strong> puts an element on the top; <strong>pop</strong> takes the top one off. There is no "insert in the middle" and no "read element i".</li>
<li><strong>Reverse order</strong>: elements leave in the reverse of the order they arrived — push L, I, F, O and the pops give O, F, I, L.</li>
<li>Everyday stacks: a pile of plates, the Back button of a browser, Ctrl+Z in an editor.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class ReverseLifo {
    public static void main(String[] args) {
        String word = "LIFO";
        Deque&lt;Character&gt; stack = new ArrayDeque&lt;Character&gt;();   // Java's ready-made stack (slide 17)
        for (char c : word.toCharArray()) {
            stack.push(c);                                      // always goes on the top
            System.out.println("push " + c + "   top is now " + stack.peek() + ", size " + stack.size());
        }
        StringBuilder out = new StringBuilder();
        while (!stack.isEmpty()) {
            char c = stack.pop();                               // always taken from the top
            out.append(c);
            System.out.println("pop  -&gt; " + c);
        }
        System.out.println(word + " read back from the stack: " + out);
    }
}</code></pre>
<div class="out">push L &nbsp;&nbsp;top is now L, size 1<br>
push I &nbsp;&nbsp;top is now I, size 2<br>
push F &nbsp;&nbsp;top is now F, size 3<br>
push O &nbsp;&nbsp;top is now O, size 4<br>
pop &nbsp;-&gt; O<br>
pop &nbsp;-&gt; F<br>
pop &nbsp;-&gt; I<br>
pop &nbsp;-&gt; L<br>
LIFO read back from the stack: OFIL</div>
<p class="meo">🧠 <strong>Remember:</strong> LIFO = Last In, First Out — the plate put down last is the first one picked up.</p>
<div class="pitfall">FE trap: "a stack is a FIFO structure" is false — FIFO (First In, First Out) is the queue of deck 2B. And a stack is still <em>linear</em>, even though only one end is accessible.</div>`,
        `<p class="y-chinh">🎯 Ngăn xếp (stack) là cấu trúc tuyến tính (linear) chỉ truy cập được ở một đầu gọi là đỉnh (top): phần tử được đẩy vào sau cùng sẽ được lấy ra đầu tiên (LIFO — last in, first out, vào sau ra trước).</p>
<ul>
<li><strong>Tuyến tính</strong>: các phần tử xếp thành một dãy từ đáy (bottom) lên đỉnh, giống danh sách — nhưng chỉ được đụng vào đỉnh.</li>
<li><strong>Push</strong> (đẩy vào) đặt một phần tử lên đỉnh; <strong>pop</strong> (lấy ra) nhấc phần tử trên đỉnh xuống. Không có "chèn vào giữa", cũng không có "đọc phần tử thứ i".</li>
<li><strong>Thứ tự đảo ngược</strong>: phần tử ra theo thứ tự ngược với lúc vào — push L, I, F, O thì các lần pop cho O, F, I, L.</li>
<li>Ngăn xếp đời thường: chồng đĩa, nút Back của trình duyệt, Ctrl+Z trong trình soạn thảo.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class ReverseLifo {
    public static void main(String[] args) {
        String word = "LIFO";
        Deque&lt;Character&gt; stack = new ArrayDeque&lt;Character&gt;();   // ngăn xếp có sẵn của Java (slide 17)
        for (char c : word.toCharArray()) {
            stack.push(c);                                      // luôn đặt lên đỉnh
            System.out.println("push " + c + "   top is now " + stack.peek() + ", size " + stack.size());
        }
        StringBuilder out = new StringBuilder();
        while (!stack.isEmpty()) {
            char c = stack.pop();                               // luôn lấy ra từ đỉnh
            out.append(c);
            System.out.println("pop  -&gt; " + c);
        }
        System.out.println(word + " read back from the stack: " + out);
    }
}</code></pre>
<div class="out">push L &nbsp;&nbsp;top is now L, size 1<br>
push I &nbsp;&nbsp;top is now I, size 2<br>
push F &nbsp;&nbsp;top is now F, size 3<br>
push O &nbsp;&nbsp;top is now O, size 4<br>
pop &nbsp;-&gt; O<br>
pop &nbsp;-&gt; F<br>
pop &nbsp;-&gt; I<br>
pop &nbsp;-&gt; L<br>
LIFO read back from the stack: OFIL</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> LIFO = Last In, First Out — cái đĩa đặt xuống sau cùng là cái được nhấc lên đầu tiên.</p>
<div class="pitfall">Bẫy FE: "stack là cấu trúc FIFO" là SAI — FIFO (First In, First Out — vào trước ra trước) là hàng đợi (queue) của bộ slide 2B. Và stack vẫn là cấu trúc <em>tuyến tính</em>, dù chỉ truy cập được một đầu.</div>`],
      [4, 'Operations on a stack',
        `<p class="y-chinh">🎯 Five operations manage a stack: clear, isEmpty, push, pop and top — push, pop and clear change it, isEmpty and top only look at it.</p>
<table>
<thead><tr><th>Operation</th><th>Meaning</th><th>Changes the stack?</th></tr></thead>
<tbody>
<tr><td><code>clear()</code></td><td>remove every element</td><td>yes</td></tr>
<tr><td><code>isEmpty()</code></td><td>is there no element at all?</td><td>no</td></tr>
<tr><td><code>push(el)</code></td><td>put <code>el</code> on the top</td><td>yes</td></tr>
<tr><td><code>pop()</code></td><td>take the topmost element off and return it</td><td>yes</td></tr>
<tr><td><code>top()</code></td><td>return the topmost element without removing it</td><td>no</td></tr>
</tbody>
</table>
<p>The five operations run on an example — the stack is printed from bottom (left) to top (right):</p>
<pre><code class="language-java">import java.util.ArrayList;

class SimpleStack {                                   // exactly the five operations of slide 4
    private ArrayList&lt;Integer&gt; h = new ArrayList&lt;Integer&gt;();   // index 0 = bottom, last index = top

    void clear() { h.clear(); }
    boolean isEmpty() { return h.isEmpty(); }
    void push(int el) { h.add(el); }
    int pop() { return h.remove(h.size() - 1); }      // empty stack: see slide 5
    int top() { return h.get(h.size() - 1); }         // read only, nothing removed
    public String toString() { return h.toString(); }
}

public class StackOps {
    public static void main(String[] args) {
        SimpleStack s = new SimpleStack();
        String[] ops = {"push 5", "push 3", "pop", "push 7", "top", "pop", "pop", "isEmpty", "push 9", "push 1", "clear", "isEmpty"};
        System.out.println("Operation   Output   Stack (bottom -&gt; top)");
        for (String op : ops) {
            String[] w = op.split(" ");
            String out = "-";
            if (w[0].equals("push")) s.push(Integer.parseInt(w[1]));
            else if (w[0].equals("pop")) out = String.valueOf(s.pop());
            else if (w[0].equals("top")) out = String.valueOf(s.top());
            else if (w[0].equals("isEmpty")) out = String.valueOf(s.isEmpty());
            else s.clear();
            String name = w.length &gt; 1 ? w[0] + "(" + w[1] + ")" : w[0] + "()";
            System.out.printf("%-11s %-8s %s%n", name, out, s);
        }
    }
}</code></pre>
<div class="out">Operation &nbsp;&nbsp;Output &nbsp;&nbsp;Stack (bottom -&gt; top)<br>
push(5) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5]<br>
push(3) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 3]<br>
pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5]<br>
push(7) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 7]<br>
top() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 7]<br>
pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5]<br>
pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[]<br>
isEmpty() &nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;[]<br>
push(9) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[9]<br>
push(1) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[9, 1]<br>
clear() &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[]<br>
isEmpty() &nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;[]</div>
<ul>
<li><code>top()</code> and <code>pop()</code> return the same value; only <code>pop()</code> removes it — compare the rows <code>top()</code> and <code>pop()</code> that both output 7.</li>
<li><strong>Big-O:</strong> in a good implementation all five are O(1) (slides 10–11): push, pop and top touch only the top element, and <code>clear()</code> just resets <code>top</code> or <code>head</code>.</li>
</ul>
<p class="dap-an">✅ <strong>Syllabus question "What are the 3 primary methods for a stack?"</strong> — <code>push</code>, <code>pop</code> and <code>top</code> (called <code>peek</code> in Java); <code>isEmpty</code> and <code>clear</code> are helpers.</p>
<div class="pitfall">In trace questions <code>top()</code> (or <code>peek()</code>) does <em>not</em> remove anything: the stack after <code>top()</code> is unchanged. Counting it as a pop is the most common way to lose this FE question.</div>`,
        `<p class="y-chinh">🎯 Năm thao tác (operation) quản lý một ngăn xếp (stack): clear (làm rỗng), isEmpty (kiểm tra rỗng), push (đẩy vào), pop (lấy ra) và top (xem đỉnh) — push, pop, clear làm thay đổi stack, còn isEmpty và top chỉ nhìn vào nó.</p>
<table>
<thead><tr><th>Thao tác</th><th>Ý nghĩa</th><th>Có đổi stack?</th></tr></thead>
<tbody>
<tr><td><code>clear()</code> — làm rỗng</td><td>xoá mọi phần tử</td><td>có</td></tr>
<tr><td><code>isEmpty()</code> — kiểm tra rỗng</td><td>có phải không còn phần tử nào?</td><td>không</td></tr>
<tr><td><code>push(el)</code> — đẩy vào</td><td>đặt <code>el</code> lên đỉnh (top)</td><td>có</td></tr>
<tr><td><code>pop()</code> — lấy ra</td><td>nhấc phần tử trên đỉnh ra và trả về nó</td><td>có</td></tr>
<tr><td><code>top()</code> — xem đỉnh</td><td>trả về phần tử trên đỉnh nhưng không lấy ra</td><td>không</td></tr>
</tbody>
</table>
<p>Năm thao tác chạy trên một ví dụ — stack được in từ đáy (bên trái) lên đỉnh (bên phải):</p>
<pre><code class="language-java">import java.util.ArrayList;

class SimpleStack {                                   // đúng năm thao tác của slide 4
    private ArrayList&lt;Integer&gt; h = new ArrayList&lt;Integer&gt;();   // chỉ số 0 = đáy, chỉ số cuối = đỉnh

    void clear() { h.clear(); }
    boolean isEmpty() { return h.isEmpty(); }
    void push(int el) { h.add(el); }
    int pop() { return h.remove(h.size() - 1); }      // stack rỗng: xem slide 5
    int top() { return h.get(h.size() - 1); }         // chỉ đọc, không lấy ra
    public String toString() { return h.toString(); }
}

public class StackOps {
    public static void main(String[] args) {
        SimpleStack s = new SimpleStack();
        String[] ops = {"push 5", "push 3", "pop", "push 7", "top", "pop", "pop", "isEmpty", "push 9", "push 1", "clear", "isEmpty"};
        System.out.println("Operation   Output   Stack (bottom -&gt; top)");
        for (String op : ops) {
            String[] w = op.split(" ");
            String out = "-";
            if (w[0].equals("push")) s.push(Integer.parseInt(w[1]));
            else if (w[0].equals("pop")) out = String.valueOf(s.pop());
            else if (w[0].equals("top")) out = String.valueOf(s.top());
            else if (w[0].equals("isEmpty")) out = String.valueOf(s.isEmpty());
            else s.clear();
            String name = w.length &gt; 1 ? w[0] + "(" + w[1] + ")" : w[0] + "()";
            System.out.printf("%-11s %-8s %s%n", name, out, s);
        }
    }
}</code></pre>
<div class="out">Operation &nbsp;&nbsp;Output &nbsp;&nbsp;Stack (bottom -&gt; top)<br>
push(5) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5]<br>
push(3) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 3]<br>
pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5]<br>
push(7) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 7]<br>
top() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5, 7]<br>
pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[5]<br>
pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[]<br>
isEmpty() &nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;[]<br>
push(9) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[9]<br>
push(1) &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[9, 1]<br>
clear() &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[]<br>
isEmpty() &nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;[]</div>
<ul>
<li><code>top()</code> và <code>pop()</code> trả về cùng một giá trị; chỉ <code>pop()</code> lấy nó ra — so hai dòng <code>top()</code> và <code>pop()</code> cùng in ra 7.</li>
<li><strong>Big-O:</strong> với cách cài đặt tốt, cả năm thao tác đều O(1) (slide 10–11): push, pop, top chỉ đụng tới phần tử trên đỉnh, còn <code>clear()</code> chỉ đặt lại <code>top</code> hoặc <code>head</code>.</li>
</ul>
<p class="dap-an">✅ <strong>Câu hỏi syllabus "3 phương thức (method) chính của stack là gì?"</strong> — <code>push</code>, <code>pop</code> và <code>top</code> (trong Java gọi là <code>peek</code>); <code>isEmpty</code> và <code>clear</code> chỉ là phụ trợ.</p>
<div class="pitfall">Trong câu hỏi lần theo (trace), <code>top()</code> (hay <code>peek()</code>) <em>không</em> lấy gì ra: stack sau <code>top()</code> giữ nguyên. Tính nhầm nó thành một lần pop là cách mất điểm phổ biến nhất ở dạng câu FE này.</div>`],
      [5, 'Stack Exceptions',
        `<p class="y-chinh">🎯 pop and top cannot be executed on an empty stack, so they signal the error by throwing an exception — the slide calls it StackEmptyException.</p>
<ul>
<li>An <strong>exception</strong> is an object that interrupts the normal flow: it is "thrown" by the operation that cannot run and "caught" by a caller with <code>try … catch</code>.</li>
<li><code>StackEmptyException</code> is <strong>not</strong> a JDK class — you declare it, e.g. <code>class StackEmptyException extends RuntimeException</code>. The JDK's own is <code>java.util.EmptyStackException</code>, used by <code>java.util.Stack</code> and by the slides' code on slides 10–11.</li>
<li>Extending <code>RuntimeException</code> makes it <em>unchecked</em> (callers may ignore it); extending <code>Exception</code> makes it <em>checked</em> (every caller must catch it or declare <code>throws</code>).</li>
<li>Java's modern stack, <code>ArrayDeque</code>, depends on the method: <code>pop()</code> throws <code>NoSuchElementException</code>, <code>peek()</code> quietly returns <code>null</code>.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Stack;

class StackEmptyException extends RuntimeException {  // the slide's name: NOT in the JDK, we declare it
    StackEmptyException(String msg) { super(msg); }
}

class IntStack {
    private int[] a = new int[10];
    private int top = -1;

    boolean isEmpty() { return top == -1; }
    void push(int x) { a[++top] = x; }
    int top() {
        if (isEmpty()) throw new StackEmptyException("top() on an empty stack");
        return a[top];
    }
    int pop() {
        if (isEmpty()) throw new StackEmptyException("pop() on an empty stack");
        return a[top--];
    }
}

public class EmptyStackDemo {
    public static void main(String[] args) {
        IntStack s = new IntStack();
        s.push(4);
        System.out.println("pop() = " + s.pop());
        try { s.pop(); }
        catch (StackEmptyException e) { System.out.println("pop() again -&gt; " + e); }
        try { s.top(); }
        catch (StackEmptyException e) { System.out.println("top()       -&gt; " + e.getMessage()); }
        // what the JDK does on an empty stack
        try { new Stack&lt;Integer&gt;().pop(); }
        catch (RuntimeException e) { System.out.println("java.util.Stack.pop() -&gt; " + e); }
        try { new ArrayDeque&lt;Integer&gt;().pop(); }
        catch (RuntimeException e) { System.out.println("ArrayDeque.pop()      -&gt; " + e); }
        System.out.println("ArrayDeque.peek()     -&gt; " + new ArrayDeque&lt;Integer&gt;().peek() + "   (no exception!)");
    }
}</code></pre>
<div class="out">pop() = 4<br>
pop() again -&gt; StackEmptyException: pop() on an empty stack<br>
top() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; top() on an empty stack<br>
java.util.Stack.pop() -&gt; java.util.EmptyStackException<br>
ArrayDeque.pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.util.NoSuchElementException<br>
ArrayDeque.peek() &nbsp;&nbsp;&nbsp;&nbsp;-&gt; null &nbsp;&nbsp;(no exception!)</div>
<p>The textbook (Goodrich 6th ed., §6.1) chose the other design: its <code>pop()</code> and <code>top()</code> return <code>null</code> on an empty stack. Both designs are fine — the code must say which one it follows.</p>
<div class="pitfall">Guard every loop with <code>isEmpty()</code> (<code>while (!s.isEmpty()) … s.pop()</code>). And keep the names apart in the PE: <code>EmptyStackException</code> (java.util, unchecked) is not the slide's <code>StackEmptyException</code>, which does not exist until you write it.</div>`,
        `<p class="y-chinh">🎯 pop (lấy ra) và top (xem đỉnh) không thể thực hiện trên ngăn xếp (stack) rỗng, nên chúng báo lỗi bằng cách ném ra một ngoại lệ (exception) — slide gọi nó là StackEmptyException.</p>
<ul>
<li><strong>Ngoại lệ</strong> là một đối tượng cắt ngang luồng chạy bình thường: nó được "ném" (throw) bởi thao tác không thực hiện được và được "bắt" (catch) ở nơi gọi bằng <code>try … catch</code>.</li>
<li><code>StackEmptyException</code> <strong>không</strong> phải lớp có sẵn trong JDK — bạn tự khai báo, ví dụ <code>class StackEmptyException extends RuntimeException</code>. Lớp có sẵn của JDK là <code>java.util.EmptyStackException</code>, được <code>java.util.Stack</code> dùng, và cũng là lớp mà code slide 10–11 dùng.</li>
<li>Kế thừa (extends) <code>RuntimeException</code> làm nó thành ngoại lệ <em>không kiểm tra (unchecked)</em> — nơi gọi có thể bỏ qua; kế thừa <code>Exception</code> làm nó thành ngoại lệ <em>kiểm tra (checked)</em> — nơi gọi bắt buộc phải bắt hoặc khai báo <code>throws</code>.</li>
<li>Stack hiện đại của Java là <code>ArrayDeque</code> thì tuỳ phương thức: <code>pop()</code> ném <code>NoSuchElementException</code>, còn <code>peek()</code> lặng lẽ trả về <code>null</code>.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Stack;

class StackEmptyException extends RuntimeException {  // tên trên slide: JDK KHÔNG có, ta tự khai báo
    StackEmptyException(String msg) { super(msg); }
}

class IntStack {
    private int[] a = new int[10];
    private int top = -1;

    boolean isEmpty() { return top == -1; }
    void push(int x) { a[++top] = x; }
    int top() {
        if (isEmpty()) throw new StackEmptyException("top() on an empty stack");
        return a[top];
    }
    int pop() {
        if (isEmpty()) throw new StackEmptyException("pop() on an empty stack");
        return a[top--];
    }
}

public class EmptyStackDemo {
    public static void main(String[] args) {
        IntStack s = new IntStack();
        s.push(4);
        System.out.println("pop() = " + s.pop());
        try { s.pop(); }
        catch (StackEmptyException e) { System.out.println("pop() again -&gt; " + e); }
        try { s.top(); }
        catch (StackEmptyException e) { System.out.println("top()       -&gt; " + e.getMessage()); }
        // JDK làm gì khi stack rỗng
        try { new Stack&lt;Integer&gt;().pop(); }
        catch (RuntimeException e) { System.out.println("java.util.Stack.pop() -&gt; " + e); }
        try { new ArrayDeque&lt;Integer&gt;().pop(); }
        catch (RuntimeException e) { System.out.println("ArrayDeque.pop()      -&gt; " + e); }
        System.out.println("ArrayDeque.peek()     -&gt; " + new ArrayDeque&lt;Integer&gt;().peek() + "   (no exception!)");
    }
}</code></pre>
<div class="out">pop() = 4<br>
pop() again -&gt; StackEmptyException: pop() on an empty stack<br>
top() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; top() on an empty stack<br>
java.util.Stack.pop() -&gt; java.util.EmptyStackException<br>
ArrayDeque.pop() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.util.NoSuchElementException<br>
ArrayDeque.peek() &nbsp;&nbsp;&nbsp;&nbsp;-&gt; null &nbsp;&nbsp;(no exception!)</div>
<p>Giáo trình (Goodrich bản 6, §6.1) chọn cách thiết kế còn lại: <code>pop()</code> và <code>top()</code> của sách trả về <code>null</code> khi stack rỗng. Cả hai cách đều được — code phải nói rõ mình theo cách nào.</p>
<div class="pitfall">Luôn chặn vòng lặp bằng <code>isEmpty()</code> (<code>while (!s.isEmpty()) … s.pop()</code>). Và trong PE đừng lẫn tên: <code>EmptyStackException</code> (gói java.util, unchecked) khác với <code>StackEmptyException</code> của slide — lớp này chưa hề tồn tại cho tới khi bạn tự viết nó.</div>`],
      [6, 'Applications of Stacks',
        `<p class="y-chinh">🎯 Whenever the thing opened last must be closed first, a stack is the right tool — nesting, expressions, method calls, backtracking, undo.</p>
<ul>
<li><strong>Any sort of nesting</strong> — brackets <code>{[()]}</code>, HTML tags: slides 14–16.</li>
<li><strong>Evaluating expressions</strong> — for example the postfix (RPN) expression <code>5 1 2 + 4 * + 3 -</code> evaluates to 14 with one stack of operands (lesson 2.3).</li>
<li><strong>Method calls</strong> — the run-time stack, slide 7 (and recursion, chapter 3).</li>
<li><strong>Backtracking</strong> — remember previous choices so you can go back from a dead end; <strong>choices yet to be made</strong> — when a maze is generated, the cells still to explore wait on a stack.</li>
<li><strong>Undo in a text editor</strong> — each change pushes the old text; Ctrl+Z pops it (program below).</li>
<li><strong>Auxiliary structure / component</strong> — depth-first search in graphs (chapter 5), binary conversion (slide 13).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class UndoDemo {
    static String text = "";
    static Deque&lt;String&gt; undo = new ArrayDeque&lt;String&gt;();     // earlier versions of the text

    static void type(String s) { undo.push(text); text = text + s; show("type \\"" + s + "\\""); }
    static void deleteLast(int n) { undo.push(text); text = text.substring(0, text.length() - n); show("delete " + n); }
    static void undo() {
        if (undo.isEmpty()) { System.out.println("undo           nothing to undo"); return; }
        text = undo.pop();                                   // the most recent change is undone first
        show("undo");
    }
    static void show(String action) {
        System.out.printf("%-14s text = %-12s (undo stack: %d)%n", action, "\\"" + text + "\\"", undo.size());
    }

    public static void main(String[] args) {
        type("Hi");
        type(" there");
        deleteLast(6);
        undo();
        undo();
        undo();
        undo();
    }
}</code></pre>
<div class="out">type "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 1)<br>
type " there" &nbsp;text = "Hi there" &nbsp;&nbsp;(undo stack: 2)<br>
delete 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 3)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi there" &nbsp;&nbsp;(undo stack: 2)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 1)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 0)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nothing to undo</div>
<p class="meo">🧠 <strong>Remember:</strong> "the most recent one first" → stack; "the oldest one first" → queue.</p>`,
        `<p class="y-chinh">🎯 Hễ cái gì mở sau cùng phải đóng trước tiên thì ngăn xếp (stack) là công cụ đúng — lồng nhau, biểu thức, gọi hàm, quay lui, hoàn tác.</p>
<ul>
<li><strong>Mọi kiểu lồng nhau (nesting)</strong> — dấu ngoặc <code>{[()]}</code>, thẻ HTML: slide 14–16.</li>
<li><strong>Tính giá trị biểu thức</strong> — ví dụ biểu thức hậu tố (postfix, còn gọi là RPN — ký pháp Ba Lan ngược) <code>5 1 2 + 4 * + 3 -</code> cho kết quả 14 nhờ một stack chứa toán hạng (bài 2.3).</li>
<li><strong>Gọi hàm/phương thức (method call)</strong> — ngăn xếp thời gian chạy (run-time stack), slide 7 (và đệ quy, chương 3).</li>
<li><strong>Quay lui (backtracking)</strong> — nhớ các lựa chọn đã đi để lùi lại khi gặp ngõ cụt; <strong>các lựa chọn chưa đi</strong> — khi sinh mê cung (maze), các ô còn phải khám phá nằm chờ trong một stack.</li>
<li><strong>Hoàn tác (undo) trong trình soạn thảo</strong> — mỗi lần sửa thì đẩy (push) văn bản cũ vào stack; Ctrl+Z thì lấy (pop) nó ra (chương trình bên dưới).</li>
<li><strong>Cấu trúc phụ trợ (auxiliary) / thành phần của cấu trúc khác</strong> — tìm kiếm theo chiều sâu (DFS) trên đồ thị (chương 5), đổi sang nhị phân (slide 13).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class UndoDemo {
    static String text = "";
    static Deque&lt;String&gt; undo = new ArrayDeque&lt;String&gt;();     // các phiên bản cũ của văn bản

    static void type(String s) { undo.push(text); text = text + s; show("type \\"" + s + "\\""); }
    static void deleteLast(int n) { undo.push(text); text = text.substring(0, text.length() - n); show("delete " + n); }
    static void undo() {
        if (undo.isEmpty()) { System.out.println("undo           nothing to undo"); return; }
        text = undo.pop();                                   // thay đổi gần nhất được hoàn tác trước
        show("undo");
    }
    static void show(String action) {
        System.out.printf("%-14s text = %-12s (undo stack: %d)%n", action, "\\"" + text + "\\"", undo.size());
    }

    public static void main(String[] args) {
        type("Hi");
        type(" there");
        deleteLast(6);
        undo();
        undo();
        undo();
        undo();
    }
}</code></pre>
<div class="out">type "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 1)<br>
type " there" &nbsp;text = "Hi there" &nbsp;&nbsp;(undo stack: 2)<br>
delete 6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 3)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi there" &nbsp;&nbsp;(undo stack: 2)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "Hi" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 1)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text = "" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(undo stack: 0)<br>
undo &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nothing to undo</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "cái mới nhất ra trước" → stack; "cái cũ nhất ra trước" → hàng đợi (queue).</p>`],
      [7, 'Stack in computer memory',
        `<p class="y-chinh">🎯 Every method call pushes an activation record (stack frame) on the run-time stack and every return pops it — so the method called last finishes first.</p>
<ul>
<li>An <strong>activation record (AR)</strong> holds: the parameters and local variables of the call; a <strong>dynamic link</strong> (pointer to the caller's AR); the <strong>return address</strong> (the caller's instruction right after the call); and, for a non-void method, the <strong>return value</strong>, placed just above the caller's AR.</li>
<li>A new AR goes on the top of the run-time stack; when the method ends its AR is removed from the top — so the first AR pushed (<code>main</code>) is the last one removed.</li>
<li>"AR" and "stack frame" are two names for the same thing. Recursion (chapter 3) is this mechanism with the same method on the stack several times.</li>
</ul>
<p class="nhan">The run-time stack at the deepest point of the program below (the lesson's own example)</p>
<pre><code class="language-plaintext">          +-----------------------------------------------------
top  --&gt;  | AR of square       parameter x = 3, local r
          |   dynamic link   -&gt; AR of sumSquares
          |   return address -&gt; in sumSquares, after square(a)
          +-----------------------------------------------------
          | AR of sumSquares   parameters a = 3, b = 4, local s
          |   dynamic link   -&gt; AR of main
          +-----------------------------------------------------
          | AR of main
          +-----------------------------------------------------</code></pre>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class CallStack {
    static Deque&lt;String&gt; rt = new ArrayDeque&lt;String&gt;();      // our picture of the run-time stack

    static void enter(String ar) {                           // a call: a new AR goes on top
        rt.push(ar);
        System.out.println("call   " + ar + "   stack, top first: " + rt);
    }
    static void leave(String result) {                       // a return: the top AR is removed
        String ar = rt.pop();
        System.out.println("return " + ar + " = " + result + "   stack: " + rt);
    }

    static int square(int x) {
        enter("square(x=" + x + ")");
        int r = x * x;                                       // x and r live in this AR
        leave(String.valueOf(r));
        return r;
    }
    static int sumSquares(int a, int b) {
        enter("sumSquares(a=" + a + ", b=" + b + ")");
        int s = square(a) + square(b);
        leave(String.valueOf(s));
        return s;
    }
    static void down() { down(); }                           // no base case: the stack only grows

    public static void main(String[] args) {
        rt.push("main");
        System.out.println("result = " + sumSquares(3, 4));
        try { down(); }
        catch (StackOverflowError e) { System.out.println("down() -&gt; StackOverflowError: no room left on the run-time stack"); }
    }
}</code></pre>
<div class="out">call &nbsp;&nbsp;sumSquares(a=3, b=4) &nbsp;&nbsp;stack, top first: [sumSquares(a=3, b=4), main]<br>
call &nbsp;&nbsp;square(x=3) &nbsp;&nbsp;stack, top first: [square(x=3), sumSquares(a=3, b=4), main]<br>
return square(x=3) = 9 &nbsp;&nbsp;stack: [sumSquares(a=3, b=4), main]<br>
call &nbsp;&nbsp;square(x=4) &nbsp;&nbsp;stack, top first: [square(x=4), sumSquares(a=3, b=4), main]<br>
return square(x=4) = 16 &nbsp;&nbsp;stack: [sumSquares(a=3, b=4), main]<br>
return sumSquares(a=3, b=4) = 25 &nbsp;&nbsp;stack: [main]<br>
result = 25<br>
down() -&gt; StackOverflowError: no room left on the run-time stack</div>
<p>The program keeps its own picture of the stack in an <code>ArrayDeque</code> (the real run-time stack of the JVM cannot be printed this simply); the push/pop order is exactly the order of the real frames.</p>
<div class="pitfall">A recursion with no base case (or one that is too deep) fills the run-time stack, and Java throws <code>StackOverflowError</code> — an <code>Error</code>, not an <code>Exception</code>, and not <code>OutOfMemoryError</code>. The last line of the output shows it.</div>`,
        `<p class="y-chinh">🎯 Mỗi lời gọi phương thức (method) đẩy một bản ghi kích hoạt (activation record — còn gọi là khung ngăn xếp, stack frame) lên ngăn xếp thời gian chạy (run-time stack), mỗi lần trả về thì lấy nó ra — nên phương thức được gọi sau cùng kết thúc trước tiên.</p>
<ul>
<li><strong>Bản ghi kích hoạt (AR)</strong> chứa: tham số (parameter) và biến cục bộ (local variable) của lời gọi; <strong>liên kết động (dynamic link)</strong> — con trỏ tới AR của nơi gọi (caller); <strong>địa chỉ trả về (return address)</strong> — lệnh của nơi gọi nằm ngay sau lời gọi; và với phương thức không phải void thì có <strong>giá trị trả về (return value)</strong>, đặt ngay phía trên AR của nơi gọi.</li>
<li>AR mới được đặt lên đỉnh (top) của run-time stack; phương thức kết thúc thì AR của nó bị gỡ khỏi đỉnh — nên AR được đẩy vào đầu tiên (<code>main</code>) là AR bị gỡ cuối cùng.</li>
<li>"AR" và "stack frame" là hai tên của cùng một thứ. Đệ quy (recursion, chương 3) chính là cơ chế này, với cùng một phương thức nằm trên stack nhiều lần.</li>
</ul>
<p class="nhan">Run-time stack ở điểm sâu nhất của chương trình bên dưới (ví dụ của bài)</p>
<pre><code class="language-plaintext">          +-----------------------------------------------------
top  --&gt;  | AR của square       tham số x = 3, biến cục bộ r
          |   liên kết động   -&gt; AR của sumSquares
          |   địa chỉ trả về  -&gt; trong sumSquares, sau square(a)
          +-----------------------------------------------------
          | AR của sumSquares   tham số a = 3, b = 4, biến cục bộ s
          |   liên kết động   -&gt; AR của main
          +-----------------------------------------------------
          | AR của main
          +-----------------------------------------------------</code></pre>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class CallStack {
    static Deque&lt;String&gt; rt = new ArrayDeque&lt;String&gt;();      // hình vẽ của ta về run-time stack

    static void enter(String ar) {                           // gọi hàm: một AR mới đặt lên đỉnh
        rt.push(ar);
        System.out.println("call   " + ar + "   stack, top first: " + rt);
    }
    static void leave(String result) {                       // trả về: AR trên đỉnh bị gỡ
        String ar = rt.pop();
        System.out.println("return " + ar + " = " + result + "   stack: " + rt);
    }

    static int square(int x) {
        enter("square(x=" + x + ")");
        int r = x * x;                                       // x và r nằm trong AR này
        leave(String.valueOf(r));
        return r;
    }
    static int sumSquares(int a, int b) {
        enter("sumSquares(a=" + a + ", b=" + b + ")");
        int s = square(a) + square(b);
        leave(String.valueOf(s));
        return s;
    }
    static void down() { down(); }                           // không có điểm dừng: stack chỉ lớn lên

    public static void main(String[] args) {
        rt.push("main");
        System.out.println("result = " + sumSquares(3, 4));
        try { down(); }
        catch (StackOverflowError e) { System.out.println("down() -&gt; StackOverflowError: no room left on the run-time stack"); }
    }
}</code></pre>
<div class="out">call &nbsp;&nbsp;sumSquares(a=3, b=4) &nbsp;&nbsp;stack, top first: [sumSquares(a=3, b=4), main]<br>
call &nbsp;&nbsp;square(x=3) &nbsp;&nbsp;stack, top first: [square(x=3), sumSquares(a=3, b=4), main]<br>
return square(x=3) = 9 &nbsp;&nbsp;stack: [sumSquares(a=3, b=4), main]<br>
call &nbsp;&nbsp;square(x=4) &nbsp;&nbsp;stack, top first: [square(x=4), sumSquares(a=3, b=4), main]<br>
return square(x=4) = 16 &nbsp;&nbsp;stack: [sumSquares(a=3, b=4), main]<br>
return sumSquares(a=3, b=4) = 25 &nbsp;&nbsp;stack: [main]<br>
result = 25<br>
down() -&gt; StackOverflowError: no room left on the run-time stack</div>
<p>Chương trình tự giữ một "hình vẽ" của stack bằng <code>ArrayDeque</code> (run-time stack thật của JVM không in ra đơn giản như vậy được); thứ tự push/pop đúng bằng thứ tự các khung (frame) thật.</p>
<div class="pitfall">Đệ quy không có điểm dừng (base case) hoặc quá sâu sẽ làm đầy run-time stack, và Java ném <code>StackOverflowError</code> — đó là một <code>Error</code> chứ không phải <code>Exception</code>, và cũng không phải <code>OutOfMemoryError</code>. Dòng cuối của output cho thấy điều đó.</div>`],
      [8, 'Array-based Stack - 1',
        `<p class="y-chinh">🎯 The simplest stack is an array S filled from left to right plus one integer, top, holding the index of the top element.</p>
<ul>
<li>Empty stack: <code>top = -1</code>. Push: <code>S[++top] = x</code> — move <code>top</code> first, then write. Pop: <code>return S[top--]</code> — read first, then move.</li>
<li>Size = <code>top + 1</code>; the array is full when <code>top == S.length - 1</code>.</li>
<li>The bottom is <code>S[0]</code> and never moves — nothing is ever shifted, which is why push and pop are O(1).</li>
</ul>
<p>The slide draws the array S with cells 0, 1, 2, … and the variable top marking the last filled cell. The same idea on the lesson's own example, capacity 5:</p>
<table>
<thead><tr><th>Step</th><th>S[0..4]</th><th>top</th><th>Note</th></tr></thead>
<tbody>
<tr><td>start</td><td>_ _ _ _ _</td><td>-1</td><td>empty</td></tr>
<tr><td>push(5)</td><td>5 _ _ _ _</td><td>0</td><td></td></tr>
<tr><td>push(8)</td><td>5 8 _ _ _</td><td>1</td><td></td></tr>
<tr><td>push(3)</td><td>5 8 3 _ _</td><td>2</td><td></td></tr>
<tr><td>pop() = 3</td><td>5 8 3 _ _</td><td>1</td><td>3 is still in S[2], but it is no longer in the stack</td></tr>
<tr><td>push(7)</td><td>5 8 7 _ _</td><td>2</td><td>S[2] is simply overwritten</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class ArrayStackTrace {
    static Object[] S = new Object[5];      // capacity 5, filled from left to right
    static int top = -1;                    // index of the top element; -1 = empty

    static void push(Object x) { S[++top] = x; show("push(" + x + ")"); }
    static Object pop() { Object x = S[top--]; show("pop() = " + x); return x; }

    static void show(String op) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i &lt; S.length; i++) b.append(S[i] == null ? "_" : S[i]).append(i &lt; S.length - 1 ? " " : "");
        System.out.printf("%-10s S = [%s]  top = %d%n", op, b, top);
    }

    public static void main(String[] args) {
        show("start");
        push(5);
        push(8);
        push(3);
        pop();                              // 3 stays in S[2] but is no longer in the stack
        push(7);                            // ...and is simply overwritten
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S = [_ _ _ _ _] &nbsp;top = -1<br>
push(5) &nbsp;&nbsp;&nbsp;S = [5 _ _ _ _] &nbsp;top = 0<br>
push(8) &nbsp;&nbsp;&nbsp;S = [5 8 _ _ _] &nbsp;top = 1<br>
push(3) &nbsp;&nbsp;&nbsp;S = [5 8 3 _ _] &nbsp;top = 2<br>
pop() = 3 &nbsp;S = [5 8 3 _ _] &nbsp;top = 1<br>
push(7) &nbsp;&nbsp;&nbsp;S = [5 8 7 _ _] &nbsp;top = 2</div>
<p class="meo">🧠 <strong>Remember:</strong> the stack is only the part <code>S[0..top]</code>; whatever lies to the right of <code>top</code> is leftover data.</p>
<div class="pitfall"><code>S[top++] = x</code> instead of <code>S[++top] = x</code> writes to the wrong cell — with <code>top = -1</code> it tries <code>S[-1]</code> and throws <code>ArrayIndexOutOfBoundsException</code>. Pre-increment for push, post-decrement for pop.</div>`,
        `<p class="y-chinh">🎯 Ngăn xếp (stack) đơn giản nhất là một mảng (array) S được lấp từ trái sang phải, cộng một biến nguyên top giữ chỉ số (index) của phần tử trên đỉnh.</p>
<ul>
<li>Stack rỗng: <code>top = -1</code>. Đẩy vào (push): <code>S[++top] = x</code> — tăng <code>top</code> trước rồi mới ghi. Lấy ra (pop): <code>return S[top--]</code> — đọc trước rồi mới giảm.</li>
<li>Số phần tử = <code>top + 1</code>; mảng đầy khi <code>top == S.length - 1</code>.</li>
<li>Đáy là <code>S[0]</code> và không bao giờ dịch chuyển — không phải dời phần tử nào, vì vậy push và pop đều O(1).</li>
</ul>
<p>Slide vẽ mảng S với các ô 0, 1, 2, … và biến top đánh dấu ô được lấp sau cùng. Cùng ý đó trên ví dụ của bài, sức chứa (capacity) 5:</p>
<table>
<thead><tr><th>Bước</th><th>S[0..4]</th><th>top</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>_ _ _ _ _</td><td>-1</td><td>rỗng</td></tr>
<tr><td>push(5)</td><td>5 _ _ _ _</td><td>0</td><td></td></tr>
<tr><td>push(8)</td><td>5 8 _ _ _</td><td>1</td><td></td></tr>
<tr><td>push(3)</td><td>5 8 3 _ _</td><td>2</td><td></td></tr>
<tr><td>pop() = 3</td><td>5 8 3 _ _</td><td>1</td><td>3 vẫn nằm trong S[2] nhưng không còn thuộc stack</td></tr>
<tr><td>push(7)</td><td>5 8 7 _ _</td><td>2</td><td>S[2] bị ghi đè</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class ArrayStackTrace {
    static Object[] S = new Object[5];      // sức chứa 5, lấp từ trái sang phải
    static int top = -1;                    // chỉ số phần tử đỉnh; -1 = rỗng

    static void push(Object x) { S[++top] = x; show("push(" + x + ")"); }
    static Object pop() { Object x = S[top--]; show("pop() = " + x); return x; }

    static void show(String op) {
        StringBuilder b = new StringBuilder();
        for (int i = 0; i &lt; S.length; i++) b.append(S[i] == null ? "_" : S[i]).append(i &lt; S.length - 1 ? " " : "");
        System.out.printf("%-10s S = [%s]  top = %d%n", op, b, top);
    }

    public static void main(String[] args) {
        show("start");
        push(5);
        push(8);
        push(3);
        pop();                              // 3 vẫn nằm trong S[2] nhưng không còn thuộc stack
        push(7);                            // ...và bị ghi đè
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S = [_ _ _ _ _] &nbsp;top = -1<br>
push(5) &nbsp;&nbsp;&nbsp;S = [5 _ _ _ _] &nbsp;top = 0<br>
push(8) &nbsp;&nbsp;&nbsp;S = [5 8 _ _ _] &nbsp;top = 1<br>
push(3) &nbsp;&nbsp;&nbsp;S = [5 8 3 _ _] &nbsp;top = 2<br>
pop() = 3 &nbsp;S = [5 8 3 _ _] &nbsp;top = 1<br>
push(7) &nbsp;&nbsp;&nbsp;S = [5 8 7 _ _] &nbsp;top = 2</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> stack chỉ là đoạn <code>S[0..top]</code>; mọi thứ nằm bên phải <code>top</code> chỉ là dữ liệu thừa.</p>
<div class="pitfall">Viết <code>S[top++] = x</code> thay cho <code>S[++top] = x</code> là ghi sai ô — khi <code>top = -1</code> nó ghi vào <code>S[-1]</code> và ném <code>ArrayIndexOutOfBoundsException</code> (lỗi chỉ số ngoài mảng). Push dùng tăng trước (++top), pop dùng giảm sau (top--).</div>`],
      [9, 'Array-based Stack - 2',
        `<p class="y-chinh">🎯 An array has a fixed length, so a push on a full array-based stack must fail (FullStackException) — a limit of this implementation, not of the stack ADT.</p>
<ul>
<li>The ADT has no notion of "full": in theory a stack can always take one more element. "Full" appears only because we chose an array of fixed length.</li>
<li>Three ways out: (1) throw an exception — the slide's <code>FullStackException</code>, or <code>IllegalStateException("Stack is full")</code> in the textbook's <code>ArrayStack</code>; (2) grow the array — slide 10; (3) use linked nodes — slide 11.</li>
<li><code>FullStackException</code>, like <code>StackEmptyException</code>, is not a JDK class: you have to declare it.</li>
</ul>
<pre><code class="language-java">class FullStackException extends RuntimeException {   // the slide's name; not in the JDK
    FullStackException(String m) { super(m); }
}

class FixedArrayStack {
    private Object[] S;
    private int top = -1;

    FixedArrayStack(int capacity) { S = new Object[capacity]; }
    boolean isFull() { return top == S.length - 1; }
    int size() { return top + 1; }
    void push(Object x) {
        if (isFull()) throw new FullStackException("capacity " + S.length + " reached, cannot push " + x);
        S[++top] = x;
    }
}

public class FullStack {
    public static void main(String[] args) {
        FixedArrayStack s = new FixedArrayStack(3);
        for (int x = 1; x &lt;= 4; x++) {
            try {
                s.push(x);
                System.out.println("push(" + x + ") ok, size = " + s.size() + ", isFull() = " + s.isFull());
            } catch (FullStackException e) {
                System.out.println("push(" + x + ") -&gt; " + e);
            }
        }
    }
}</code></pre>
<div class="out">push(1) ok, size = 1, isFull() = false<br>
push(2) ok, size = 2, isFull() = false<br>
push(3) ok, size = 3, isFull() = true<br>
push(4) -&gt; FullStackException: capacity 3 reached, cannot push 4</div>
<p>The slide illustrates this with a picture of the array S; the program above shows the same limit on the lesson's own example — a stack of capacity 3 refuses the fourth push.</p>
<p class="meo">🧠 <strong>Remember:</strong> "full" is a property of the <em>array</em>, "empty" is a property of the <em>stack</em> — only pop/top on an empty stack is an error of the ADT itself.</p>`,
        `<p class="y-chinh">🎯 Mảng (array) có độ dài cố định, nên thao tác đẩy vào (push) một ngăn xếp (stack) bằng mảng đã đầy buộc phải thất bại (FullStackException) — đó là giới hạn của cách cài đặt này, không phải của ADT (kiểu dữ liệu trừu tượng) ngăn xếp.</p>
<ul>
<li>ADT không có khái niệm "đầy": về lý thuyết stack luôn nhận thêm được một phần tử. "Đầy" chỉ xuất hiện vì ta chọn mảng có độ dài cố định — "not intrinsic to the Stack ADT" (không phải bản chất của ADT).</li>
<li>Ba lối ra: (1) ném ngoại lệ (exception) — <code>FullStackException</code> của slide, hoặc <code>IllegalStateException("Stack is full")</code> trong <code>ArrayStack</code> của giáo trình; (2) nới rộng mảng (grow) — slide 10; (3) dùng các nút liên kết (linked node) — slide 11.</li>
<li><code>FullStackException</code>, giống <code>StackEmptyException</code>, không có trong JDK: phải tự khai báo.</li>
</ul>
<pre><code class="language-java">class FullStackException extends RuntimeException {   // tên trên slide; JDK không có
    FullStackException(String m) { super(m); }
}

class FixedArrayStack {
    private Object[] S;
    private int top = -1;

    FixedArrayStack(int capacity) { S = new Object[capacity]; }
    boolean isFull() { return top == S.length - 1; }
    int size() { return top + 1; }
    void push(Object x) {
        if (isFull()) throw new FullStackException("capacity " + S.length + " reached, cannot push " + x);
        S[++top] = x;
    }
}

public class FullStack {
    public static void main(String[] args) {
        FixedArrayStack s = new FixedArrayStack(3);
        for (int x = 1; x &lt;= 4; x++) {
            try {
                s.push(x);
                System.out.println("push(" + x + ") ok, size = " + s.size() + ", isFull() = " + s.isFull());
            } catch (FullStackException e) {
                System.out.println("push(" + x + ") -&gt; " + e);
            }
        }
    }
}</code></pre>
<div class="out">push(1) ok, size = 1, isFull() = false<br>
push(2) ok, size = 2, isFull() = false<br>
push(3) ok, size = 3, isFull() = true<br>
push(4) -&gt; FullStackException: capacity 3 reached, cannot push 4</div>
<p>Slide minh hoạ ý này bằng hình mảng S; chương trình trên cho thấy cùng giới hạn đó trên ví dụ của bài — một stack sức chứa (capacity) 3 từ chối lần push thứ tư.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "đầy" là tính chất của <em>mảng</em>, "rỗng" là tính chất của <em>stack</em> — chỉ có pop/top trên stack rỗng mới là lỗi của chính ADT.</p>`],
      [10, 'Array implementation of a stack',
        `<p class="y-chinh">🎯 The slide's ArrayStack stores Object[] a, top and max, and grows the array by half when a push finds it full — but grow() forgets to update max, so the class crashes a little later.</p>
<ul>
<li><code>ArrayStack()</code> calls <code>this(50)</code>: default capacity 50. The array holds <code>Object</code>, so anything can be pushed (an <code>int</code> is autoboxed to <code>Integer</code>).</li>
<li><code>push</code>: <code>if (isFull() &amp;&amp; !grow()) return;</code> — when full, try to grow, then <code>a[++top] = x</code>.</li>
<li><code>top()</code> and <code>pop()</code> throw <code>EmptyStackException</code>: that is <code>java.util.EmptyStackException</code> (unchecked), so the file needs <code>import java.util.EmptyStackException;</code> or <code>import java.util.*;</code>.</li>
</ul>
<p>Below is the slide's class — only change: <code>isEmpty()</code> written once (see the second trap) — run with capacity 2, next to a <code>FixedStack</code> whose <code>grow()</code> is corrected:</p>
<pre><code class="language-java">import java.util.EmptyStackException;

class ArrayStack {                                  // the slide's code, isEmpty() kept once
    protected Object[] a;
    int top, max;

    public ArrayStack() { this(50); }
    public ArrayStack(int max1) {
        max = max1;
        a = new Object[max];
        top = -1;
    }
    protected boolean grow() {
        int max1 = max + max / 2;
        Object[] a1 = new Object[max1];
        if (a1 == null) return (false);             // never true: new never returns null
        for (int i = 0; i &lt;= top; i++) a1[i] = a[i];
        a = a1;                                     // BUG: max keeps the old capacity
        return (true);
    }
    public boolean isEmpty() { return (top == -1); }
    public boolean isFull() { return (top == max - 1); }
    public void clear() { top = -1; }
    public void push(Object x) {
        if (isFull() &amp;&amp; !grow()) return;
        a[++top] = x;
    }
    Object top() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        return (a[top]);
    }
    public Object pop() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        Object x = a[top];
        top--;
        return (x);
    }
}

class FixedStack extends ArrayStack {               // the fix, written as an override
    FixedStack(int max1) { super(max1); }
    protected boolean grow() {
        int max1 = max + max / 2;
        Object[] a1 = new Object[max1];
        for (int i = 0; i &lt;= top; i++) a1[i] = a[i];
        a = a1;
        max = max1;                                 // the missing line
        return true;
    }
}

public class ArrayStackBug {
    static String state(ArrayStack s) { return "a.length=" + s.a.length + " max=" + s.max + " top=" + s.top + " isFull()=" + s.isFull(); }

    public static void main(String[] args) {
        ArrayStack s = new ArrayStack(2);           // the slide's class, capacity 2
        for (int i = 1; i &lt;= 4; i++) {
            try { s.push(i); System.out.println("slide push(" + i + "): " + state(s)); }
            catch (ArrayIndexOutOfBoundsException e) { System.out.println("slide push(" + i + "): " + e); }
        }
        FixedStack f = new FixedStack(2);
        for (int i = 1; i &lt;= 7; i++) { f.push(i); System.out.println("fixed push(" + i + "): " + state(f)); }
        StringBuilder order = new StringBuilder();
        while (!f.isEmpty()) order.append(' ').append(f.pop());
        System.out.println("fixed pop order:" + order);
        try { f.top(); } catch (EmptyStackException e) { System.out.println("fixed top() on empty -&gt; " + e); }
    }
}</code></pre>
<div class="out">slide push(1): a.length=2 max=2 top=0 isFull()=false<br>
slide push(2): a.length=2 max=2 top=1 isFull()=true<br>
slide push(3): a.length=3 max=2 top=2 isFull()=false<br>
slide push(4): java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3<br>
fixed push(1): a.length=2 max=2 top=0 isFull()=false<br>
fixed push(2): a.length=2 max=2 top=1 isFull()=true<br>
fixed push(3): a.length=3 max=3 top=2 isFull()=true<br>
fixed push(4): a.length=4 max=4 top=3 isFull()=true<br>
fixed push(5): a.length=6 max=6 top=4 isFull()=false<br>
fixed push(6): a.length=6 max=6 top=5 isFull()=true<br>
fixed push(7): a.length=9 max=9 top=6 isFull()=false<br>
fixed pop order: 7 6 5 4 3 2 1<br>
fixed top() on empty -&gt; java.util.EmptyStackException</div>
<p class="nhan">The first four lines of the output, step by step (the slide's class, max = 2)</p>
<table>
<thead><tr><th>Call</th><th>Before</th><th>What the slide's code does</th><th>After</th></tr></thead>
<tbody>
<tr><td>push(1)</td><td>top = -1, <code>a.length</code> = 2, max = 2</td><td>not full → <code>a[0] = 1</code></td><td>top = 0</td></tr>
<tr><td>push(2)</td><td>top = 0</td><td>not full → <code>a[1] = 2</code></td><td>top = 1, <code>isFull()</code> = true</td></tr>
<tr><td>push(3)</td><td>top = 1 = max − 1</td><td>full → <code>grow()</code>: new array of 2 + 2/2 = 3 cells, but <code>max</code> stays 2 → <code>a[2] = 3</code></td><td>top = 2, <code>isFull()</code> = (2 == 1) = false</td></tr>
<tr><td>push(4)</td><td>top = 2</td><td><code>isFull()</code> is false → no grow → <code>a[3] = 4</code></td><td>ArrayIndexOutOfBoundsException: index 3, length 3</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Bug on the slide:</strong> <code>grow()</code> never sets <code>max = max1</code>. After the first grow <code>top</code> passes <code>max − 1</code>, so <code>isFull()</code> (<code>top == max-1</code>) stays false; the array never grows again and the push that reaches the end of the grown array writes outside it — the 4th push with max = 2, the 76th with the default 50 (75 cells). Fix: add <code>max = max1;</code> after <code>a = a1;</code> — <code>FixedStack</code> then grows 2 → 3 → 4 → 6 → 9 cells.</div>
<div class="pitfall">Smaller issues: (1) <code>if (a1 == null)</code> is never true — <code>new</code> never returns <code>null</code>; when memory runs out Java throws <code>OutOfMemoryError</code>. (2) The extracted text of the slide shows <code>isEmpty()</code> twice; if the code really declares it twice it does not compile (<code>method isEmpty() is already defined in class ArrayStack</code>). (3) A method <code>top()</code> next to a field <code>top</code> is legal but confusing. (4) <code>pop()</code> leaves the object in the array — write <code>a[top] = null;</code> just before <code>top--</code> so the garbage collector can free it. (5) With capacity 1, <code>max + max/2</code> is still 1: nothing grows and the second push already throws <code>ArrayIndexOutOfBoundsException</code> — use <code>max + max/2 + 1</code>.</div>
<p><strong>Big-O:</strong> push, pop, top are O(1); the push that grows copies top + 1 elements, O(n). Why the push is still O(1) amortized: after a grow to capacity c the next grow comes only after c/2 cheap pushes, and the capacities (2, 3, 4, 6, 9, …) grow geometrically, so over n pushes all the copies add up to fewer than 3n — a constant number of copies per push on average (the fixed class, run to 100,000 pushes, copies about 2.8 elements per push).</p>`,
        `<p class="y-chinh">🎯 ArrayStack của slide lưu Object[] a, top và max, và nới mảng thêm một nửa khi thao tác đẩy vào (push) gặp mảng đầy — nhưng grow() quên cập nhật max, nên lớp này sẽ sập một lúc sau đó.</p>
<ul>
<li><code>ArrayStack()</code> gọi <code>this(50)</code>: sức chứa (capacity) mặc định 50. Mảng chứa <code>Object</code>, nên đẩy gì vào cũng được (một <code>int</code> được tự đóng hộp — autoboxing — thành <code>Integer</code>).</li>
<li><code>push</code>: <code>if (isFull() &amp;&amp; !grow()) return;</code> — nếu đầy thì thử nới rộng (grow), rồi <code>a[++top] = x</code>.</li>
<li><code>top()</code> và <code>pop()</code> ném <code>EmptyStackException</code>: đó là <code>java.util.EmptyStackException</code> (ngoại lệ không kiểm tra — unchecked), nên file cần <code>import java.util.EmptyStackException;</code> hoặc <code>import java.util.*;</code>.</li>
</ul>
<p>Dưới đây là lớp của slide — chỉ sửa một chỗ: <code>isEmpty()</code> chỉ viết một lần (xem bẫy thứ hai) — chạy với sức chứa 2, đặt cạnh lớp <code>FixedStack</code> có <code>grow()</code> đã sửa:</p>
<pre><code class="language-java">import java.util.EmptyStackException;

class ArrayStack {                                  // code của slide, isEmpty() chỉ giữ một lần
    protected Object[] a;
    int top, max;

    public ArrayStack() { this(50); }
    public ArrayStack(int max1) {
        max = max1;
        a = new Object[max];
        top = -1;
    }
    protected boolean grow() {
        int max1 = max + max / 2;
        Object[] a1 = new Object[max1];
        if (a1 == null) return (false);             // không bao giờ đúng: new không trả về null
        for (int i = 0; i &lt;= top; i++) a1[i] = a[i];
        a = a1;                                     // LỖI: max vẫn giữ sức chứa cũ
        return (true);
    }
    public boolean isEmpty() { return (top == -1); }
    public boolean isFull() { return (top == max - 1); }
    public void clear() { top = -1; }
    public void push(Object x) {
        if (isFull() &amp;&amp; !grow()) return;
        a[++top] = x;
    }
    Object top() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        return (a[top]);
    }
    public Object pop() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        Object x = a[top];
        top--;
        return (x);
    }
}

class FixedStack extends ArrayStack {               // bản sửa, viết dạng ghi đè (override)
    FixedStack(int max1) { super(max1); }
    protected boolean grow() {
        int max1 = max + max / 2;
        Object[] a1 = new Object[max1];
        for (int i = 0; i &lt;= top; i++) a1[i] = a[i];
        a = a1;
        max = max1;                                 // dòng bị thiếu
        return true;
    }
}

public class ArrayStackBug {
    static String state(ArrayStack s) { return "a.length=" + s.a.length + " max=" + s.max + " top=" + s.top + " isFull()=" + s.isFull(); }

    public static void main(String[] args) {
        ArrayStack s = new ArrayStack(2);           // lớp của slide, sức chứa 2
        for (int i = 1; i &lt;= 4; i++) {
            try { s.push(i); System.out.println("slide push(" + i + "): " + state(s)); }
            catch (ArrayIndexOutOfBoundsException e) { System.out.println("slide push(" + i + "): " + e); }
        }
        FixedStack f = new FixedStack(2);
        for (int i = 1; i &lt;= 7; i++) { f.push(i); System.out.println("fixed push(" + i + "): " + state(f)); }
        StringBuilder order = new StringBuilder();
        while (!f.isEmpty()) order.append(' ').append(f.pop());
        System.out.println("fixed pop order:" + order);
        try { f.top(); } catch (EmptyStackException e) { System.out.println("fixed top() on empty -&gt; " + e); }
    }
}</code></pre>
<div class="out">slide push(1): a.length=2 max=2 top=0 isFull()=false<br>
slide push(2): a.length=2 max=2 top=1 isFull()=true<br>
slide push(3): a.length=3 max=2 top=2 isFull()=false<br>
slide push(4): java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3<br>
fixed push(1): a.length=2 max=2 top=0 isFull()=false<br>
fixed push(2): a.length=2 max=2 top=1 isFull()=true<br>
fixed push(3): a.length=3 max=3 top=2 isFull()=true<br>
fixed push(4): a.length=4 max=4 top=3 isFull()=true<br>
fixed push(5): a.length=6 max=6 top=4 isFull()=false<br>
fixed push(6): a.length=6 max=6 top=5 isFull()=true<br>
fixed push(7): a.length=9 max=9 top=6 isFull()=false<br>
fixed pop order: 7 6 5 4 3 2 1<br>
fixed top() on empty -&gt; java.util.EmptyStackException</div>
<p class="nhan">Bốn dòng đầu của output, từng bước (lớp của slide, max = 2)</p>
<table>
<thead><tr><th>Lời gọi</th><th>Trước</th><th>Code của slide làm gì</th><th>Sau</th></tr></thead>
<tbody>
<tr><td>push(1)</td><td>top = -1, <code>a.length</code> = 2, max = 2</td><td>chưa đầy → <code>a[0] = 1</code></td><td>top = 0</td></tr>
<tr><td>push(2)</td><td>top = 0</td><td>chưa đầy → <code>a[1] = 2</code></td><td>top = 1, <code>isFull()</code> = true</td></tr>
<tr><td>push(3)</td><td>top = 1 = max − 1</td><td>đầy → <code>grow()</code>: mảng mới 2 + 2/2 = 3 ô, nhưng <code>max</code> vẫn là 2 → <code>a[2] = 3</code></td><td>top = 2, <code>isFull()</code> = (2 == 1) = false</td></tr>
<tr><td>push(4)</td><td>top = 2</td><td><code>isFull()</code> sai → không nới → <code>a[3] = 4</code></td><td>ArrayIndexOutOfBoundsException: chỉ số 3, độ dài 3</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>Lỗi trên slide:</strong> <code>grow()</code> không hề gán <code>max = max1</code>. Sau lần nới đầu tiên, <code>top</code> vượt quá <code>max − 1</code>, nên <code>isFull()</code> (<code>top == max-1</code>) mãi mãi là false; mảng không bao giờ được nới nữa, và lần push chạm tới cuối mảng đã nới sẽ ghi ra ngoài mảng — lần push thứ 4 khi max = 2, lần thứ 76 với max mặc định 50 (mảng 75 ô). Cách sửa: thêm <code>max = max1;</code> sau <code>a = a1;</code> — khi đó <code>FixedStack</code> nới 2 → 3 → 4 → 6 → 9 ô.</div>
<div class="pitfall">Các lỗi nhỏ hơn: (1) <code>if (a1 == null)</code> không bao giờ đúng — <code>new</code> không bao giờ trả về <code>null</code>; hết bộ nhớ thì Java ném <code>OutOfMemoryError</code>. (2) Chữ trích từ slide cho thấy <code>isEmpty()</code> xuất hiện hai lần; nếu code thật sự khai báo hai lần thì không biên dịch được (<code>method isEmpty() is already defined in class ArrayStack</code>). (3) Phương thức <code>top()</code> trùng tên với trường (field) <code>top</code> là hợp lệ nhưng dễ rối. (4) <code>pop()</code> để lại đối tượng trong mảng — viết <code>a[top] = null;</code> ngay trước <code>top--</code> để bộ dọn rác (garbage collector) thu hồi được. (5) Sức chứa 1 thì <code>max + max/2</code> vẫn là 1: không nới được gì và ngay lần push thứ hai đã văng <code>ArrayIndexOutOfBoundsException</code> — hãy dùng <code>max + max/2 + 1</code>.</div>
<p><strong>Big-O:</strong> push, pop, top là O(1); lần push phải nới mảng thì chép top + 1 phần tử, O(n). Vì sao push vẫn O(1) khấu hao (amortized — tính trung bình trên cả dãy thao tác): sau khi nới lên sức chứa c, phải thêm c/2 lần push rẻ nữa mới tới lần nới sau, và các sức chứa (2, 3, 4, 6, 9, …) tăng theo cấp số nhân, nên qua n lần push tổng số lần chép ít hơn 3n — trung bình mỗi push chỉ chép một số hằng phần tử (lớp đã sửa, chạy tới 100.000 lần push, chép khoảng 2,8 phần tử mỗi push).</p>`],
      [11, 'Linked implementation of a stack',
        `<p class="y-chinh">🎯 With a singly linked list the top of the stack is the head: push inserts a node at the head, pop deletes the head — both O(1), and the stack is never full.</p>
<ul>
<li><code>push(x)</code>: <code>head = new Node(x, head);</code> — the new node points to the old head and becomes the head (chapter 1's "insert at the beginning" in one line).</li>
<li><code>pop()</code>: save <code>head.info</code>, then <code>head = head.next;</code> — the old first node becomes garbage.</li>
<li><code>top()</code> returns <code>head.info</code>; <code>top()</code> and <code>pop()</code> both throw <code>EmptyStackException</code> when <code>head == null</code>.</li>
<li>Why the head and not the tail? Deleting the last node of a singly linked list is O(n) (deck 1, slide 12); at the head both push and pop are O(1).</li>
</ul>
<pre><code class="language-java">import java.util.EmptyStackException;

class Node {
    public Object info;
    public Node next;
    public Node(Object x, Node p) { info = x; next = p; }
    public Node(Object x) { this(x, null); }
}

class LinkedStack {
    protected Node head;
    public LinkedStack() { head = null; }
    public boolean isEmpty() { return (head == null); }
    public void push(Object x) { head = new Node(x, head); }   // insert at the head: O(1)
    Object top() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        return (head.info);
    }
    public Object pop() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        Object x = head.info;
        head = head.next;                                        // delete the head: O(1)
        return (x);
    }
}

public class LinkedStackDemo {
    static String show(LinkedStack s) {
        StringBuilder b = new StringBuilder("head");
        for (Node p = s.head; p != null; p = p.next) b.append(" -&gt; ").append(p.info);
        return b.append(" -&gt; null").toString();
    }

    public static void main(String[] args) {
        LinkedStack s = new LinkedStack();
        for (int x = 10; x &lt;= 30; x += 10) { s.push(x); System.out.println("push(" + x + "): " + show(s)); }
        System.out.println("top() = " + s.top() + ", nothing removed: " + show(s));
        while (!s.isEmpty()) { Object x = s.pop(); System.out.println("pop() = " + x + ": " + show(s)); }
        try { s.pop(); } catch (EmptyStackException e) { System.out.println("pop() on empty -&gt; " + e); }
    }
}</code></pre>
<div class="out">push(10): head -&gt; 10 -&gt; null<br>
push(20): head -&gt; 20 -&gt; 10 -&gt; null<br>
push(30): head -&gt; 30 -&gt; 20 -&gt; 10 -&gt; null<br>
top() = 30, nothing removed: head -&gt; 30 -&gt; 20 -&gt; 10 -&gt; null<br>
pop() = 30: head -&gt; 20 -&gt; 10 -&gt; null<br>
pop() = 20: head -&gt; 10 -&gt; null<br>
pop() = 10: head -&gt; null<br>
pop() on empty -&gt; java.util.EmptyStackException</div>
<pre><code class="language-plaintext">after push(10), push(20), push(30):

head -&gt; [30|*] -&gt; [20|*] -&gt; [10|null]
         top                  bottom</code></pre>
<p><strong>Array vs linked:</strong> the array stack wastes unused cells and sometimes copies itself to grow; the linked stack pays one <code>next</code> reference per element but never fills up and never copies.</p>
<div class="pitfall"><code>clear()</code> is not on the slide — for a linked stack it is just <code>head = null;</code>. A common PE slip for push: <code>head.next = new Node(x, null)</code> hooks the new node <em>after</em> the head and cuts off every node that followed (push 10, 20, then 30 leaves 20 → 30: the 10 is lost), so the new element is not on the top (and on an empty stack it throws <code>NullPointerException</code>).</div>`,
        `<p class="y-chinh">🎯 Với danh sách liên kết đơn (singly linked list), đỉnh (top) của ngăn xếp (stack) chính là head (nút đầu): push (đẩy vào) chèn một nút (node) vào đầu, pop (lấy ra) xoá nút đầu — cả hai đều O(1), và stack không bao giờ bị đầy.</p>
<ul>
<li><code>push(x)</code>: <code>head = new Node(x, head);</code> — nút mới trỏ tới head cũ rồi trở thành head (thao tác "chèn vào đầu" của chương 1, gói trong một dòng).</li>
<li><code>pop()</code>: lưu <code>head.info</code>, rồi <code>head = head.next;</code> — nút đầu cũ thành rác (garbage).</li>
<li><code>top()</code> trả về <code>head.info</code>; cả <code>top()</code> lẫn <code>pop()</code> đều ném <code>EmptyStackException</code> khi <code>head == null</code>.</li>
<li>Vì sao dùng đầu mà không dùng cuối (tail)? Xoá nút cuối của danh sách liên kết đơn tốn O(n) (bộ slide 1, slide 12); ở đầu thì cả push lẫn pop đều O(1).</li>
</ul>
<pre><code class="language-java">import java.util.EmptyStackException;

class Node {
    public Object info;
    public Node next;
    public Node(Object x, Node p) { info = x; next = p; }
    public Node(Object x) { this(x, null); }
}

class LinkedStack {
    protected Node head;
    public LinkedStack() { head = null; }
    public boolean isEmpty() { return (head == null); }
    public void push(Object x) { head = new Node(x, head); }   // chèn vào đầu: O(1)
    Object top() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        return (head.info);
    }
    public Object pop() throws EmptyStackException {
        if (isEmpty()) throw new EmptyStackException();
        Object x = head.info;
        head = head.next;                                        // xoá nút đầu: O(1)
        return (x);
    }
}

public class LinkedStackDemo {
    static String show(LinkedStack s) {
        StringBuilder b = new StringBuilder("head");
        for (Node p = s.head; p != null; p = p.next) b.append(" -&gt; ").append(p.info);
        return b.append(" -&gt; null").toString();
    }

    public static void main(String[] args) {
        LinkedStack s = new LinkedStack();
        for (int x = 10; x &lt;= 30; x += 10) { s.push(x); System.out.println("push(" + x + "): " + show(s)); }
        System.out.println("top() = " + s.top() + ", nothing removed: " + show(s));
        while (!s.isEmpty()) { Object x = s.pop(); System.out.println("pop() = " + x + ": " + show(s)); }
        try { s.pop(); } catch (EmptyStackException e) { System.out.println("pop() on empty -&gt; " + e); }
    }
}</code></pre>
<div class="out">push(10): head -&gt; 10 -&gt; null<br>
push(20): head -&gt; 20 -&gt; 10 -&gt; null<br>
push(30): head -&gt; 30 -&gt; 20 -&gt; 10 -&gt; null<br>
top() = 30, nothing removed: head -&gt; 30 -&gt; 20 -&gt; 10 -&gt; null<br>
pop() = 30: head -&gt; 20 -&gt; 10 -&gt; null<br>
pop() = 20: head -&gt; 10 -&gt; null<br>
pop() = 10: head -&gt; null<br>
pop() on empty -&gt; java.util.EmptyStackException</div>
<pre><code class="language-plaintext">sau push(10), push(20), push(30):

head -&gt; [30|*] -&gt; [20|*] -&gt; [10|null]
         đỉnh                 đáy</code></pre>
<p><strong>Mảng hay liên kết:</strong> stack bằng mảng phí các ô chưa dùng và thỉnh thoảng phải tự chép sang mảng lớn hơn; stack liên kết tốn thêm một tham chiếu (reference) <code>next</code> cho mỗi phần tử nhưng không bao giờ đầy và không bao giờ phải chép.</p>
<div class="pitfall">Slide không có <code>clear()</code> — với stack liên kết nó chỉ là <code>head = null;</code>. Lỗi PE hay gặp khi viết push: <code>head.next = new Node(x, null)</code> là móc nút mới vào <em>sau</em> head và cắt bỏ mọi nút phía sau (push 10, 20 rồi 30 thì còn 20 → 30: số 10 bị mất), nên phần tử mới không nằm trên đỉnh (và nếu stack đang rỗng thì văng <code>NullPointerException</code>).</div>`],
      [12, 'Implementing a stack using ArrayList and LinkedList classes in Java',
        `<p class="y-chinh">🎯 A stack can reuse Java's lists: push appends at the end and pop removes the last element — ArrayList.remove(size-1) or LinkedList.removeLast(), both O(1).</p>
<ul>
<li>Both versions keep the top at the <strong>end</strong> of the list. For an <code>ArrayList</code> that matters: removing the last element shifts nothing, whereas <code>remove(0)</code> would shift every element.</li>
<li>This <code>pop()</code> returns <code>null</code> on an empty stack instead of throwing (compare slides 5, 10, 11). Simple, but ambiguous: in the output a stored <code>null</code> pops out exactly like "the stack is empty".</li>
<li>The slide uses <strong>raw types</strong> (<code>ArrayList</code> without <code>&lt;…&gt;</code>): it compiles with an "unchecked" warning and every popped value is a plain <code>Object</code>. Modern code writes <code>ArrayList&lt;Integer&gt; h = new ArrayList&lt;Integer&gt;();</code>.</li>
<li>The missing operations are one-liners: <code>top()</code> = <code>h.get(h.size() - 1)</code> (or <code>h.getLast()</code> for the <code>LinkedList</code>), <code>clear()</code> = <code>h.clear()</code>.</li>
</ul>
<pre><code class="language-java">import java.util.*;

class MyStack {                           // slide 12, left: on an ArrayList
    ArrayList h;
    MyStack() { h = new ArrayList(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.remove(h.size() - 1));
    }
}

class MyStack2 {                          // slide 12, right: on a LinkedList (renamed: one file, two classes)
    LinkedList h;
    MyStack2() { h = new LinkedList(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.removeLast());
    }
}

public class MyStackTwoWays {
    public static void main(String[] args) {
        MyStack a = new MyStack();
        MyStack2 b = new MyStack2();
        for (String x : new String[] {"red", "green", "blue"}) { a.push(x); b.push(x); }
        System.out.println("ArrayList  version pops: " + a.pop() + " " + a.pop() + " " + a.pop() + " " + a.pop());
        System.out.println("LinkedList version pops: " + b.pop() + " " + b.pop() + " " + b.pop() + " " + b.pop());
        a.push(null);                     // a null value is stored...
        System.out.println("after push(null): pop() = " + a.pop() + ", isEmpty() = " + a.isEmpty());
        System.out.println("empty stack:      pop() = " + a.pop() + ", isEmpty() = " + a.isEmpty());
    }
}</code></pre>
<div class="out">ArrayList &nbsp;version pops: blue green red null<br>
LinkedList version pops: blue green red null<br>
after push(null): pop() = null, isEmpty() = true<br>
empty stack: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pop() = null, isEmpty() = true</div>
<p>In the file the <code>LinkedList</code> version is renamed <code>MyStack2</code> because one file cannot hold two classes with the same name; on the slide both are called <code>MyStack</code>.</p>
<div class="pitfall">Taking the <em>front</em> of an <code>ArrayList</code> as the top (<code>add(0, x)</code>, <code>remove(0)</code>) makes every push and pop shift all the elements: O(n) instead of O(1). On an array-backed list the top belongs at the end.</div>`,
        `<p class="y-chinh">🎯 Có thể dựng ngăn xếp (stack) trên các danh sách có sẵn của Java: push (đẩy vào) thêm vào cuối, pop (lấy ra) xoá phần tử cuối — ArrayList.remove(size-1) hoặc LinkedList.removeLast(), cả hai đều O(1).</p>
<ul>
<li>Cả hai bản đều đặt đỉnh (top) ở <strong>cuối</strong> danh sách. Với <code>ArrayList</code> điều này rất quan trọng: xoá phần tử cuối không phải dời gì, còn <code>remove(0)</code> sẽ dời mọi phần tử.</li>
<li><code>pop()</code> ở đây trả về <code>null</code> khi stack rỗng thay vì ném ngoại lệ (exception) — so với slide 5, 10, 11. Đơn giản nhưng mơ hồ: trong output, một giá trị <code>null</code> đã cất vào khi pop ra trông y hệt "stack rỗng".</li>
<li>Slide dùng <strong>kiểu thô (raw type)</strong> — <code>ArrayList</code> không có <code>&lt;…&gt;</code>: vẫn biên dịch được nhưng kèm cảnh báo "unchecked", và giá trị pop ra chỉ là <code>Object</code>. Code hiện đại viết <code>ArrayList&lt;Integer&gt; h = new ArrayList&lt;Integer&gt;();</code> (dùng generics — kiểu tổng quát).</li>
<li>Các thao tác còn thiếu chỉ một dòng: <code>top()</code> = <code>h.get(h.size() - 1)</code> (hoặc <code>h.getLast()</code> với bản <code>LinkedList</code>), <code>clear()</code> = <code>h.clear()</code>.</li>
</ul>
<pre><code class="language-java">import java.util.*;

class MyStack {                           // slide 12, bên trái: dựa trên ArrayList
    ArrayList h;
    MyStack() { h = new ArrayList(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.remove(h.size() - 1));
    }
}

class MyStack2 {                          // slide 12, bên phải: dựa trên LinkedList (đổi tên vì một file có hai lớp)
    LinkedList h;
    MyStack2() { h = new LinkedList(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.removeLast());
    }
}

public class MyStackTwoWays {
    public static void main(String[] args) {
        MyStack a = new MyStack();
        MyStack2 b = new MyStack2();
        for (String x : new String[] {"red", "green", "blue"}) { a.push(x); b.push(x); }
        System.out.println("ArrayList  version pops: " + a.pop() + " " + a.pop() + " " + a.pop() + " " + a.pop());
        System.out.println("LinkedList version pops: " + b.pop() + " " + b.pop() + " " + b.pop() + " " + b.pop());
        a.push(null);                     // cất vào một giá trị null...
        System.out.println("after push(null): pop() = " + a.pop() + ", isEmpty() = " + a.isEmpty());
        System.out.println("empty stack:      pop() = " + a.pop() + ", isEmpty() = " + a.isEmpty());
    }
}</code></pre>
<div class="out">ArrayList &nbsp;version pops: blue green red null<br>
LinkedList version pops: blue green red null<br>
after push(null): pop() = null, isEmpty() = true<br>
empty stack: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pop() = null, isEmpty() = true</div>
<p>Trong file, bản <code>LinkedList</code> được đổi tên thành <code>MyStack2</code> vì một file không thể chứa hai lớp trùng tên; trên slide cả hai đều tên <code>MyStack</code>.</p>
<div class="pitfall">Lấy <em>đầu</em> của <code>ArrayList</code> làm đỉnh (<code>add(0, x)</code>, <code>remove(0)</code>) thì mỗi lần push và pop đều phải dời toàn bộ phần tử: O(n) thay vì O(1). Với danh sách dựa trên mảng, đỉnh phải đặt ở cuối.</div>`],
      [13, 'Convert decimal integer number to binary number using a stack',
        `<p class="y-chinh">🎯 Repeated division by 2 produces the binary digits from last to first, so pushing them on a stack and popping them all prints the number the right way round: 11 → 1011.</p>
<ul>
<li><code>k % 2</code> is the next binary digit, counted from the right; <code>k / 2</code> drops that digit; stop when <code>k</code> reaches 0.</li>
<li>The digits are produced in reverse order — and reversing is exactly what a stack does (slide 3).</li>
<li>The slide uses <code>MyStack</code> from slide 12. Its class holding <code>main</code> is called <code>Main</code>; here it is <code>DecToBin</code>, because a public class must match its file name.</li>
</ul>
<p class="nhan">Trace — decToBin(11)</p>
<table>
<thead><tr><th>k</th><th>k % 2 (pushed)</th><th>k / 2</th><th>Stack (bottom → top)</th></tr></thead>
<tbody>
<tr><td>11</td><td>1</td><td>5</td><td>1</td></tr>
<tr><td>5</td><td>1</td><td>2</td><td>1 1</td></tr>
<tr><td>2</td><td>0</td><td>1</td><td>1 1 0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1 1 0 1</td></tr>
<tr><td>0</td><td>the loop stops; pop everything: 1, 0, 1, 1</td><td>—</td><td>prints 1011</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.*;

class MyStack {                                    // slide 12, ArrayList version
    ArrayList h;
    MyStack() { h = new ArrayList(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.remove(h.size() - 1));
    }
}

public class DecToBin {                            // on the slide this class is called Main
    public static void decToBin(int k) {
        MyStack s = new MyStack();
        System.out.print(k + " in binary system is: ");
        while (k &gt; 0) {
            s.push(new Integer(k % 2));            // deprecated since Java 9: write s.push(k % 2)
            k = k / 2;
        }
        while (!s.isEmpty())
            System.out.print(s.pop());
        System.out.println();
    }

    public static void main(String[] args) {
        decToBin(11);
        System.out.println();
        // added by the lesson: the steps, then an edge case
        for (int k = 11; k &gt; 0; k = k / 2)
            System.out.println("k = " + k + "  -&gt;  push k % 2 = " + k % 2 + ",  then k = k / 2 = " + k / 2);
        decToBin(0);
    }
}</code></pre>
<div class="out">11 in binary system is: 1011<br>
<br>
k = 11 &nbsp;-&gt; &nbsp;push k % 2 = 1, &nbsp;then k = k / 2 = 5<br>
k = 5 &nbsp;-&gt; &nbsp;push k % 2 = 1, &nbsp;then k = k / 2 = 2<br>
k = 2 &nbsp;-&gt; &nbsp;push k % 2 = 0, &nbsp;then k = k / 2 = 1<br>
k = 1 &nbsp;-&gt; &nbsp;push k % 2 = 1, &nbsp;then k = k / 2 = 0<br>
0 in binary system is:</div>
<p><strong>Big-O:</strong> k has ⌊log₂ k⌋ + 1 binary digits (4 for k = 11), so each loop runs O(log k) times.</p>
<div class="pitfall"><code>decToBin(0)</code> prints nothing after the colon (last line of the output): <code>while (k &gt; 0)</code> never runs. Handle 0 separately. And <code>new Integer(k%2)</code> is deprecated since Java 9 (newer JDKs even mark it for removal): write <code>s.push(k % 2)</code> and let autoboxing create the <code>Integer</code>.</div>`,
        `<p class="y-chinh">🎯 Chia liên tiếp cho 2 sinh ra các chữ số nhị phân (binary) từ cuối lên đầu, nên đẩy chúng vào ngăn xếp (stack) rồi lấy hết ra là in được số theo đúng chiều: 11 → 1011.</p>
<ul>
<li><code>k % 2</code> là chữ số nhị phân tiếp theo, tính từ bên phải; <code>k / 2</code> bỏ chữ số đó đi; dừng khi <code>k</code> về 0.</li>
<li>Các chữ số sinh ra theo thứ tự ngược — mà đảo ngược chính là việc stack làm (slide 3).</li>
<li>Slide dùng <code>MyStack</code> của slide 12. Lớp chứa <code>main</code> trên slide tên <code>Main</code>; ở đây đổi thành <code>DecToBin</code>, vì lớp public phải trùng tên file.</li>
</ul>
<p class="nhan">Lần theo (trace) — decToBin(11)</p>
<table>
<thead><tr><th>k</th><th>k % 2 (được đẩy vào — push)</th><th>k / 2</th><th>Stack (đáy → đỉnh)</th></tr></thead>
<tbody>
<tr><td>11</td><td>1</td><td>5</td><td>1</td></tr>
<tr><td>5</td><td>1</td><td>2</td><td>1 1</td></tr>
<tr><td>2</td><td>0</td><td>1</td><td>1 1 0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1 1 0 1</td></tr>
<tr><td>0</td><td>vòng lặp dừng; lấy ra (pop) hết: 1, 0, 1, 1</td><td>—</td><td>in ra 1011</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.*;

class MyStack {                                    // slide 12, bản ArrayList
    ArrayList h;
    MyStack() { h = new ArrayList(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.remove(h.size() - 1));
    }
}

public class DecToBin {                            // trên slide lớp này tên là Main
    public static void decToBin(int k) {
        MyStack s = new MyStack();
        System.out.print(k + " in binary system is: ");
        while (k &gt; 0) {
            s.push(new Integer(k % 2));            // lỗi thời từ Java 9: viết s.push(k % 2)
            k = k / 2;
        }
        while (!s.isEmpty())
            System.out.print(s.pop());
        System.out.println();
    }

    public static void main(String[] args) {
        decToBin(11);
        System.out.println();
        // bài học thêm: từng bước, rồi một trường hợp biên
        for (int k = 11; k &gt; 0; k = k / 2)
            System.out.println("k = " + k + "  -&gt;  push k % 2 = " + k % 2 + ",  then k = k / 2 = " + k / 2);
        decToBin(0);
    }
}</code></pre>
<div class="out">11 in binary system is: 1011<br>
<br>
k = 11 &nbsp;-&gt; &nbsp;push k % 2 = 1, &nbsp;then k = k / 2 = 5<br>
k = 5 &nbsp;-&gt; &nbsp;push k % 2 = 1, &nbsp;then k = k / 2 = 2<br>
k = 2 &nbsp;-&gt; &nbsp;push k % 2 = 0, &nbsp;then k = k / 2 = 1<br>
k = 1 &nbsp;-&gt; &nbsp;push k % 2 = 1, &nbsp;then k = k / 2 = 0<br>
0 in binary system is:</div>
<p><strong>Big-O:</strong> k có ⌊log₂ k⌋ + 1 chữ số nhị phân (4 chữ số với k = 11), nên mỗi vòng lặp chạy O(log k) lần.</p>
<div class="pitfall"><code>decToBin(0)</code> không in gì sau dấu hai chấm (dòng cuối của output): vòng <code>while (k &gt; 0)</code> không chạy lần nào. Phải xử lý riêng số 0. Còn <code>new Integer(k%2)</code> đã lỗi thời (deprecated) từ Java 9 (JDK mới còn đánh dấu sẽ xoá hẳn): hãy viết <code>s.push(k % 2)</code> và để cơ chế tự đóng hộp (autoboxing) tạo <code>Integer</code>.</div>`],
      [14, 'Validate expression using stack - 1',
        `<p class="y-chinh">🎯 An expression is properly matched when every opening symbol ( { [ meets a closing symbol of the same kind, in the right nesting order.</p>
<ul>
<li>Three pairs of grouping symbols: parentheses <code>( )</code>, braces <code>{ }</code>, brackets <code>[ ]</code>. Other characters (<code>5</code>, <code>x</code>, <code>+</code>) play no role.</li>
<li>Correct on the slide: <code>( )(( )){([( )])}</code> and <code>((( )(( )){([( )])}))</code>.</li>
<li>Incorrect: <code>)(( )){([( )])}</code> starts with a closing symbol; in <code>({[ ])}</code> the <code>)</code> meets <code>{</code> — wrong nesting; <code>(</code> is never closed.</li>
</ul>
<p>The algorithm of slide 15 run on the slide's six expressions (in the program the minus sign of <code>[(5+x)−(y+z)]</code> is typed as the ASCII <code>-</code>):</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class BracketCheck {
    static boolean isMatched(String expr) {
        String opening = "({[", closing = ")}]";
        Deque&lt;Character&gt; stack = new ArrayDeque&lt;Character&gt;();
        for (char c : expr.toCharArray()) {
            if (opening.indexOf(c) &gt;= 0) stack.push(c);            // opening symbol: push
            else if (closing.indexOf(c) &gt;= 0) {                    // closing symbol
                if (stack.isEmpty()) return false;                  // nothing left to match
                if (opening.indexOf(stack.pop()) != closing.indexOf(c)) return false;   // not a valid pair
            }                                                       // any other character is ignored
        }
        return stack.isEmpty();                                     // an opening symbol left over?
    }

    public static void main(String[] args) {
        String[] tests = {"[(5+x)-(y+z)]", "( )(( )){([( )])}", "((( )(( )){([( )])}))", ")(( )){([( )])}", "({[ ])}", "("};
        for (String t : tests)
            System.out.printf("%-10s %s%n", isMatched(t) ? "Correct" : "Incorrect", t);
    }
}</code></pre>
<div class="out">Correct &nbsp;&nbsp;&nbsp;[(5+x)-(y+z)]<br>
Correct &nbsp;&nbsp;&nbsp;( )(( )){([( )])}<br>
Correct &nbsp;&nbsp;&nbsp;((( )(( )){([( )])}))<br>
Incorrect &nbsp;)(( )){([( )])}<br>
Incorrect &nbsp;({[ ])}<br>
Incorrect &nbsp;(</div>
<p class="dap-an">✅ <strong>A precise definition — what Exercise R-6.6 of the textbook asks for:</strong> a string is matched if (1) it contains no grouping symbol, or (2) it is two matched strings written one after the other, or (3) it is an opening symbol, then a matched string, then the closing symbol of the same kind.</p>
<div class="pitfall">Counting is not enough: <code>({[ ])}</code> has exactly one opening and one closing symbol of each kind, yet it is incorrect. The <em>order</em> matters — that is why the algorithm needs a stack, not three counters.</div>`,
        `<p class="y-chinh">🎯 Một biểu thức khớp đúng (properly matched) khi mỗi ký hiệu mở ( { [ gặp một ký hiệu đóng cùng loại, theo đúng thứ tự lồng nhau.</p>
<ul>
<li>Ba cặp ký hiệu nhóm (grouping symbol): ngoặc tròn (parentheses) <code>( )</code>, ngoặc nhọn (braces) <code>{ }</code>, ngoặc vuông (brackets) <code>[ ]</code>. Các ký tự khác (<code>5</code>, <code>x</code>, <code>+</code>) không có vai trò gì.</li>
<li>Đúng (correct) trên slide: <code>( )(( )){([( )])}</code> và <code>((( )(( )){([( )])}))</code>.</li>
<li>Sai (incorrect): <code>)(( )){([( )])}</code> mở đầu bằng ký hiệu đóng; trong <code>({[ ])}</code> dấu <code>)</code> lại gặp <code>{</code> — lồng sai thứ tự; <code>(</code> thì không bao giờ được đóng.</li>
</ul>
<p>Thuật toán của slide 15 chạy trên sáu biểu thức của slide (trong chương trình, dấu trừ của <code>[(5+x)−(y+z)]</code> được gõ bằng dấu <code>-</code> ASCII):</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class BracketCheck {
    static boolean isMatched(String expr) {
        String opening = "({[", closing = ")}]";
        Deque&lt;Character&gt; stack = new ArrayDeque&lt;Character&gt;();
        for (char c : expr.toCharArray()) {
            if (opening.indexOf(c) &gt;= 0) stack.push(c);            // ký hiệu mở: push
            else if (closing.indexOf(c) &gt;= 0) {                    // ký hiệu đóng
                if (stack.isEmpty()) return false;                  // không còn gì để khớp
                if (opening.indexOf(stack.pop()) != closing.indexOf(c)) return false;   // không thành cặp
            }                                                       // ký tự khác bỏ qua
        }
        return stack.isEmpty();                                     // còn ký hiệu mở chưa đóng?
    }

    public static void main(String[] args) {
        String[] tests = {"[(5+x)-(y+z)]", "( )(( )){([( )])}", "((( )(( )){([( )])}))", ")(( )){([( )])}", "({[ ])}", "("};
        for (String t : tests)
            System.out.printf("%-10s %s%n", isMatched(t) ? "Correct" : "Incorrect", t);
    }
}</code></pre>
<div class="out">Correct &nbsp;&nbsp;&nbsp;[(5+x)-(y+z)]<br>
Correct &nbsp;&nbsp;&nbsp;( )(( )){([( )])}<br>
Correct &nbsp;&nbsp;&nbsp;((( )(( )){([( )])}))<br>
Incorrect &nbsp;)(( )){([( )])}<br>
Incorrect &nbsp;({[ ])}<br>
Incorrect &nbsp;(</div>
<p class="dap-an">✅ <strong>Một định nghĩa chính xác — đúng thứ Bài tập R-6.6 của giáo trình yêu cầu:</strong> một chuỗi là khớp đúng nếu (1) nó không chứa ký hiệu nhóm nào, hoặc (2) nó là hai chuỗi khớp đúng viết nối tiếp nhau, hoặc (3) nó là một ký hiệu mở, tiếp theo một chuỗi khớp đúng, rồi ký hiệu đóng cùng loại.</p>
<div class="pitfall">Chỉ đếm số lượng là không đủ: <code>({[ ])}</code> có đúng một ký hiệu mở và một ký hiệu đóng cho mỗi loại, vậy mà vẫn sai. <em>Thứ tự</em> mới là điều quan trọng — vì vậy thuật toán cần một ngăn xếp (stack), chứ không phải ba biến đếm.</div>`],
      [15, 'Validate expression using stack - 2',
        `<p class="y-chinh">🎯 One left-to-right scan: push every opening symbol, pop and compare at every closing symbol, and at the end the stack must be empty.</p>
<ol>
<li>Opening symbol → push it.</li>
<li>Closing symbol → if the stack is empty: incorrect (nothing to match); otherwise pop and check that the two symbols form a valid pair — if not: incorrect.</li>
<li>End of the string → correct only if the stack is empty; otherwise some opening symbol was never closed.</li>
</ol>
<p class="nhan">Trace 1 — [(5+x)-(y+z)] (only grouping symbols change the stack)</p>
<table>
<thead><tr><th>Read</th><th>Action</th><th>Stack after (bottom → top)</th></tr></thead>
<tbody>
<tr><td><code>[</code></td><td>push</td><td><code>[</code></td></tr>
<tr><td><code>(</code></td><td>push</td><td><code>[(</code></td></tr>
<tr><td><code>)</code></td><td>pop <code>(</code> — a valid pair</td><td><code>[</code></td></tr>
<tr><td><code>(</code></td><td>push</td><td><code>[(</code></td></tr>
<tr><td><code>)</code></td><td>pop <code>(</code> — a valid pair</td><td><code>[</code></td></tr>
<tr><td><code>]</code></td><td>pop <code>[</code> — a valid pair</td><td>empty → end of string: Correct</td></tr>
</tbody>
</table>
<p class="nhan">Trace 2 — ({[ ])}</p>
<table>
<thead><tr><th>Read</th><th>Action</th><th>Stack after (bottom → top)</th></tr></thead>
<tbody>
<tr><td><code>(</code> then <code>{</code> then <code>[</code></td><td>push, push, push</td><td><code>({[</code></td></tr>
<tr><td><code>]</code></td><td>pop <code>[</code> — a valid pair</td><td><code>({</code></td></tr>
<tr><td><code>)</code></td><td>pop <code>{</code> — <code>{</code> and <code>)</code> are not a pair</td><td>stop: Incorrect</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;

public class BracketTrace {
    static String bottomToTop(Deque&lt;Character&gt; st) {
        StringBuilder b = new StringBuilder();
        for (Iterator&lt;Character&gt; it = st.descendingIterator(); it.hasNext(); ) b.append(it.next());
        return b.length() == 0 ? "(empty)" : b.toString();
    }

    static void trace(String expr) {
        System.out.println("scan " + expr);
        String opening = "({[", closing = ")}]";
        Deque&lt;Character&gt; st = new ArrayDeque&lt;Character&gt;();
        int pushes = 0, pops = 0;
        for (char c : expr.toCharArray()) {
            if (opening.indexOf(c) &gt;= 0) {
                st.push(c); pushes++;
                System.out.println("  " + c + "  push        stack: " + bottomToTop(st));
            } else if (closing.indexOf(c) &gt;= 0) {
                if (st.isEmpty()) { System.out.println("  " + c + "  stack is empty -&gt; Incorrect"); return; }
                char o = st.pop(); pops++;
                boolean ok = opening.indexOf(o) == closing.indexOf(c);
                System.out.println("  " + c + "  pop " + o + (ok ? " ok " : " BAD") + "   stack: " + bottomToTop(st));
                if (!ok) { System.out.println("  " + o + " and " + c + " are not a pair -&gt; Incorrect"); return; }
            }
        }
        System.out.println("  end of string, stack " + (st.isEmpty() ? "empty -&gt; Correct" : "not empty -&gt; Incorrect")
                + "  (" + pushes + " push, " + pops + " pop)");
    }

    public static void main(String[] args) {
        trace("[(5+x)-(y+z)]");
        trace("({[ ])}");
    }
}</code></pre>
<div class="out">scan [(5+x)-(y+z)]<br>
&nbsp;&nbsp;[ &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: [<br>
&nbsp;&nbsp;( &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: [(<br>
&nbsp;&nbsp;) &nbsp;pop ( ok &nbsp;&nbsp;&nbsp;stack: [<br>
&nbsp;&nbsp;( &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: [(<br>
&nbsp;&nbsp;) &nbsp;pop ( ok &nbsp;&nbsp;&nbsp;stack: [<br>
&nbsp;&nbsp;] &nbsp;pop [ ok &nbsp;&nbsp;&nbsp;stack: (empty)<br>
&nbsp;&nbsp;end of string, stack empty -&gt; Correct &nbsp;(3 push, 3 pop)<br>
scan ({[ ])}<br>
&nbsp;&nbsp;( &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: (<br>
&nbsp;&nbsp;{ &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: ({<br>
&nbsp;&nbsp;[ &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: ({[<br>
&nbsp;&nbsp;] &nbsp;pop [ ok &nbsp;&nbsp;&nbsp;stack: ({<br>
&nbsp;&nbsp;) &nbsp;pop { BAD &nbsp;&nbsp;stack: (<br>
&nbsp;&nbsp;{ and ) are not a pair -&gt; Incorrect</div>
<p><strong>Big-O:</strong> each of the n characters is read once and causes at most one push or one pop — at most n pushes and n pops, as the slide says — so O(n) time and, in the worst case (<code>((((…</code>), O(n) extra memory.</p>
<p class="meo">🧠 <strong>Remember:</strong> open → push; close → pop and compare; end → empty?</p>
<div class="pitfall">The slide's own incorrect examples catch the two classic slips: skipping the final "is the stack empty?" test accepts <code>(</code>; popping without checking <code>isEmpty()</code> crashes on the first <code>)</code> of <code>)(( )){([( )])}</code> instead of answering "incorrect".</div>`,
        `<p class="y-chinh">🎯 Quét một lượt từ trái sang phải: gặp ký hiệu mở thì đẩy vào (push), gặp ký hiệu đóng thì lấy ra (pop) rồi so, tới cuối chuỗi thì ngăn xếp (stack) phải rỗng.</p>
<ol>
<li>Ký hiệu mở → push nó vào stack.</li>
<li>Ký hiệu đóng → nếu stack rỗng: sai (không có gì để khớp); ngược lại pop và kiểm tra hai ký hiệu có tạo thành một cặp hợp lệ không — nếu không: sai.</li>
<li>Hết chuỗi → chỉ đúng khi stack rỗng; nếu còn thì có ký hiệu mở chưa bao giờ được đóng.</li>
</ol>
<p class="nhan">Lần theo 1 — [(5+x)-(y+z)] (chỉ ký hiệu nhóm mới làm stack thay đổi)</p>
<table>
<thead><tr><th>Đọc</th><th>Việc làm</th><th>Stack sau đó (đáy → đỉnh)</th></tr></thead>
<tbody>
<tr><td><code>[</code></td><td>push</td><td><code>[</code></td></tr>
<tr><td><code>(</code></td><td>push</td><td><code>[(</code></td></tr>
<tr><td><code>)</code></td><td>pop <code>(</code> — thành cặp hợp lệ</td><td><code>[</code></td></tr>
<tr><td><code>(</code></td><td>push</td><td><code>[(</code></td></tr>
<tr><td><code>)</code></td><td>pop <code>(</code> — thành cặp hợp lệ</td><td><code>[</code></td></tr>
<tr><td><code>]</code></td><td>pop <code>[</code> — thành cặp hợp lệ</td><td>rỗng → hết chuỗi: Đúng</td></tr>
</tbody>
</table>
<p class="nhan">Lần theo 2 — ({[ ])}</p>
<table>
<thead><tr><th>Đọc</th><th>Việc làm</th><th>Stack sau đó (đáy → đỉnh)</th></tr></thead>
<tbody>
<tr><td><code>(</code> rồi <code>{</code> rồi <code>[</code></td><td>push, push, push</td><td><code>({[</code></td></tr>
<tr><td><code>]</code></td><td>pop <code>[</code> — thành cặp hợp lệ</td><td><code>({</code></td></tr>
<tr><td><code>)</code></td><td>pop <code>{</code> — <code>{</code> và <code>)</code> không thành cặp</td><td>dừng: Sai</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;

public class BracketTrace {
    static String bottomToTop(Deque&lt;Character&gt; st) {
        StringBuilder b = new StringBuilder();
        for (Iterator&lt;Character&gt; it = st.descendingIterator(); it.hasNext(); ) b.append(it.next());
        return b.length() == 0 ? "(empty)" : b.toString();
    }

    static void trace(String expr) {
        System.out.println("scan " + expr);
        String opening = "({[", closing = ")}]";
        Deque&lt;Character&gt; st = new ArrayDeque&lt;Character&gt;();
        int pushes = 0, pops = 0;
        for (char c : expr.toCharArray()) {
            if (opening.indexOf(c) &gt;= 0) {
                st.push(c); pushes++;
                System.out.println("  " + c + "  push        stack: " + bottomToTop(st));
            } else if (closing.indexOf(c) &gt;= 0) {
                if (st.isEmpty()) { System.out.println("  " + c + "  stack is empty -&gt; Incorrect"); return; }
                char o = st.pop(); pops++;
                boolean ok = opening.indexOf(o) == closing.indexOf(c);
                System.out.println("  " + c + "  pop " + o + (ok ? " ok " : " BAD") + "   stack: " + bottomToTop(st));
                if (!ok) { System.out.println("  " + o + " and " + c + " are not a pair -&gt; Incorrect"); return; }
            }
        }
        System.out.println("  end of string, stack " + (st.isEmpty() ? "empty -&gt; Correct" : "not empty -&gt; Incorrect")
                + "  (" + pushes + " push, " + pops + " pop)");
    }

    public static void main(String[] args) {
        trace("[(5+x)-(y+z)]");
        trace("({[ ])}");
    }
}</code></pre>
<div class="out">scan [(5+x)-(y+z)]<br>
&nbsp;&nbsp;[ &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: [<br>
&nbsp;&nbsp;( &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: [(<br>
&nbsp;&nbsp;) &nbsp;pop ( ok &nbsp;&nbsp;&nbsp;stack: [<br>
&nbsp;&nbsp;( &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: [(<br>
&nbsp;&nbsp;) &nbsp;pop ( ok &nbsp;&nbsp;&nbsp;stack: [<br>
&nbsp;&nbsp;] &nbsp;pop [ ok &nbsp;&nbsp;&nbsp;stack: (empty)<br>
&nbsp;&nbsp;end of string, stack empty -&gt; Correct &nbsp;(3 push, 3 pop)<br>
scan ({[ ])}<br>
&nbsp;&nbsp;( &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: (<br>
&nbsp;&nbsp;{ &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: ({<br>
&nbsp;&nbsp;[ &nbsp;push &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack: ({[<br>
&nbsp;&nbsp;] &nbsp;pop [ ok &nbsp;&nbsp;&nbsp;stack: ({<br>
&nbsp;&nbsp;) &nbsp;pop { BAD &nbsp;&nbsp;stack: (<br>
&nbsp;&nbsp;{ and ) are not a pair -&gt; Incorrect</div>
<p><strong>Big-O:</strong> mỗi ký tự trong n ký tự được đọc một lần và gây ra nhiều nhất một lần push hoặc một lần pop — tối đa n lần push và n lần pop, đúng như slide nói — nên thời gian O(n), và trong trường hợp xấu nhất (<code>((((…</code>) tốn thêm O(n) bộ nhớ.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mở → push; đóng → pop rồi so; hết chuỗi → rỗng chưa?</p>
<div class="pitfall">Chính các ví dụ sai trên slide bắt được hai lỗi kinh điển: bỏ bước kiểm "stack còn rỗng không?" ở cuối thì <code>(</code> bị coi là đúng; pop mà không kiểm tra <code>isEmpty()</code> trước thì chương trình văng ngoại lệ (exception) ngay ở dấu <code>)</code> đầu tiên của <code>)(( )){([( )])}</code> thay vì trả lời "sai".</div>`],
      [16, 'Matching Parentheses and HTML Tags',
        `<p class="y-chinh">🎯 HTML and XML tags nest exactly like brackets — <code>&lt;name&gt;</code> opens, <code>&lt;/name&gt;</code> closes — so the same stack algorithm checks whether a document is valid.</p>
<ul>
<li><strong>HTML</strong> is the format of web pages; <strong>XML</strong> is an extensible markup language for structured data. Both delimit portions of text with tags.</li>
<li>Algorithm: scan the tags from left to right; opening tag → push its name; closing tag <code>&lt;/name&gt;</code> → pop and compare the two names; at the end the stack must be empty.</li>
<li>Browsers tolerate a certain number of mismatched tags (as the slide says); a validator — and any XML parser — does not.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class HtmlTags {
    // "valid", or the reason why the tags do not match
    static String check(String html) {
        Deque&lt;String&gt; stack = new ArrayDeque&lt;String&gt;();
        int i = html.indexOf('&lt;');
        while (i &gt;= 0) {
            int j = html.indexOf('&gt;', i + 1);
            if (j &lt; 0) return "invalid: '&lt;' without '&gt;'";
            String tag = html.substring(i + 1, j);                 // "body" or "/body"
            if (!tag.startsWith("/")) stack.push(tag);             // opening tag: push its name
            else {
                String name = tag.substring(1);
                if (stack.isEmpty()) return "invalid: &lt;/" + name + "&gt; closes nothing";
                String open = stack.pop();                         // must be the most recently opened tag
                if (!open.equals(name)) return "invalid: &lt;" + open + "&gt; is closed by &lt;/" + name + "&gt;";
            }
            i = html.indexOf('&lt;', j + 1);
        }
        return stack.isEmpty() ? "valid" : "invalid: &lt;" + stack.peek() + "&gt; is never closed";
    }

    public static void main(String[] args) {
        String[] docs = {
            "&lt;body&gt;&lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Some &lt;b&gt;bold&lt;/b&gt; text&lt;/p&gt;&lt;/body&gt;",
            "&lt;body&gt;&lt;p&gt;&lt;b&gt;bold&lt;/p&gt;&lt;/b&gt;&lt;/body&gt;",
            "&lt;body&gt;&lt;p&gt;Text&lt;/p&gt;",
            "&lt;p&gt;Text&lt;/p&gt;&lt;/body&gt;"
        };
        for (String d : docs) System.out.println(d + "\\n   -&gt; " + check(d));
    }
}</code></pre>
<div class="out">&lt;body&gt;&lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Some &lt;b&gt;bold&lt;/b&gt; text&lt;/p&gt;&lt;/body&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; valid<br>
&lt;body&gt;&lt;p&gt;&lt;b&gt;bold&lt;/p&gt;&lt;/b&gt;&lt;/body&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; invalid: &lt;b&gt; is closed by &lt;/p&gt;<br>
&lt;body&gt;&lt;p&gt;Text&lt;/p&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; invalid: &lt;body&gt; is never closed<br>
&lt;p&gt;Text&lt;/p&gt;&lt;/body&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; invalid: &lt;/body&gt; closes nothing</div>
<ul>
<li>Document 2: <code>&lt;b&gt;</code> was opened last, so it must be closed first; <code>&lt;/p&gt;</code> arrives too early — the same mistake as <code>({[ ])}</code> on slide 14.</li>
<li><strong>Big-O:</strong> one pass over the n characters of the document, O(n).</li>
</ul>
<div class="pitfall">This checker, like the slide's definition, knows only simple tags <code>&lt;name&gt;</code> and <code>&lt;/name&gt;</code>. Real HTML also has attributes (<code>&lt;a href="…"&gt;</code> — compare only the name before the first space) and void elements with no closing tag (<code>&lt;br&gt;</code>, <code>&lt;img&gt;</code>) that must not be pushed.</div>`,
        `<p class="y-chinh">🎯 Thẻ (tag) HTML và XML lồng nhau y như dấu ngoặc — <code>&lt;name&gt;</code> mở, <code>&lt;/name&gt;</code> đóng — nên cùng một thuật toán dùng ngăn xếp (stack) kiểm tra được một tài liệu có hợp lệ (valid) hay không.</p>
<ul>
<li><strong>HTML</strong> là định dạng của trang web; <strong>XML</strong> là ngôn ngữ đánh dấu mở rộng (extensible markup language) dùng cho dữ liệu có cấu trúc. Cả hai đều dùng thẻ để khoanh các đoạn văn bản.</li>
<li>Thuật toán: quét các thẻ từ trái sang phải; thẻ mở → đẩy (push) tên thẻ vào stack; thẻ đóng <code>&lt;/name&gt;</code> → lấy ra (pop) rồi so hai tên; hết tài liệu thì stack phải rỗng.</li>
<li>Trình duyệt chấp nhận một số thẻ không khớp (như slide nói); còn trình kiểm tra hợp lệ (validator) — và mọi bộ phân tích XML (XML parser) — thì không.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class HtmlTags {
    // "valid", hoặc lý do các thẻ không khớp
    static String check(String html) {
        Deque&lt;String&gt; stack = new ArrayDeque&lt;String&gt;();
        int i = html.indexOf('&lt;');
        while (i &gt;= 0) {
            int j = html.indexOf('&gt;', i + 1);
            if (j &lt; 0) return "invalid: '&lt;' without '&gt;'";
            String tag = html.substring(i + 1, j);                 // "body" hoặc "/body"
            if (!tag.startsWith("/")) stack.push(tag);             // thẻ mở: push tên thẻ
            else {
                String name = tag.substring(1);
                if (stack.isEmpty()) return "invalid: &lt;/" + name + "&gt; closes nothing";
                String open = stack.pop();                         // phải là thẻ mở gần nhất
                if (!open.equals(name)) return "invalid: &lt;" + open + "&gt; is closed by &lt;/" + name + "&gt;";
            }
            i = html.indexOf('&lt;', j + 1);
        }
        return stack.isEmpty() ? "valid" : "invalid: &lt;" + stack.peek() + "&gt; is never closed";
    }

    public static void main(String[] args) {
        String[] docs = {
            "&lt;body&gt;&lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Some &lt;b&gt;bold&lt;/b&gt; text&lt;/p&gt;&lt;/body&gt;",
            "&lt;body&gt;&lt;p&gt;&lt;b&gt;bold&lt;/p&gt;&lt;/b&gt;&lt;/body&gt;",
            "&lt;body&gt;&lt;p&gt;Text&lt;/p&gt;",
            "&lt;p&gt;Text&lt;/p&gt;&lt;/body&gt;"
        };
        for (String d : docs) System.out.println(d + "\\n   -&gt; " + check(d));
    }
}</code></pre>
<div class="out">&lt;body&gt;&lt;h1&gt;Title&lt;/h1&gt;&lt;p&gt;Some &lt;b&gt;bold&lt;/b&gt; text&lt;/p&gt;&lt;/body&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; valid<br>
&lt;body&gt;&lt;p&gt;&lt;b&gt;bold&lt;/p&gt;&lt;/b&gt;&lt;/body&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; invalid: &lt;b&gt; is closed by &lt;/p&gt;<br>
&lt;body&gt;&lt;p&gt;Text&lt;/p&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; invalid: &lt;body&gt; is never closed<br>
&lt;p&gt;Text&lt;/p&gt;&lt;/body&gt;<br>
&nbsp;&nbsp;&nbsp;-&gt; invalid: &lt;/body&gt; closes nothing</div>
<ul>
<li>Tài liệu 2: <code>&lt;b&gt;</code> mở sau cùng nên phải đóng trước tiên; <code>&lt;/p&gt;</code> lại tới quá sớm — cùng một lỗi với <code>({[ ])}</code> ở slide 14.</li>
<li><strong>Big-O:</strong> đi một lượt qua n ký tự của tài liệu, O(n).</li>
</ul>
<div class="pitfall">Trình kiểm tra này, giống định nghĩa trên slide, chỉ biết thẻ đơn giản <code>&lt;name&gt;</code> và <code>&lt;/name&gt;</code>. HTML thật còn có thuộc tính (attribute — <code>&lt;a href="…"&gt;</code>: chỉ so phần tên trước khoảng trắng đầu tiên) và các phần tử rỗng (void element) không có thẻ đóng (<code>&lt;br&gt;</code>, <code>&lt;img&gt;</code>) — không được push chúng.</div>`],
      [17, 'Stack class in Java',
        `<p class="y-chinh">🎯 java.util.Stack is Vector plus one constructor and five methods — push, pop, peek, empty, search; it works, but Java's own documentation recommends Deque/ArrayDeque instead.</p>
<p>The slide shows the class as a picture; the constructor and the five methods, as defined by the Java API:</p>
<table>
<thead><tr><th>Member</th><th>What it does</th><th>Big-O</th></tr></thead>
<tbody>
<tr><td><code>Stack()</code></td><td>creates an empty stack</td><td>O(1)</td></tr>
<tr><td><code>E push(E item)</code></td><td>puts <code>item</code> on the top and returns it</td><td>O(1) amortized</td></tr>
<tr><td><code>E pop()</code></td><td>removes and returns the top; <code>EmptyStackException</code> if empty</td><td>O(1)</td></tr>
<tr><td><code>E peek()</code></td><td>returns the top without removing it; <code>EmptyStackException</code> if empty</td><td>O(1)</td></tr>
<tr><td><code>boolean empty()</code></td><td>true when there is no element</td><td>O(1)</td></tr>
<tr><td><code>int search(Object o)</code></td><td>distance from the top, counting from 1 (top = 1); −1 if absent</td><td>O(n)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.EmptyStackException;
import java.util.Stack;

public class JavaUtilStack {
    public static void main(String[] args) {
        Stack&lt;String&gt; s = new Stack&lt;String&gt;();              // the one constructor
        s.push("A"); s.push("B"); s.push("C");              // push(e) also returns e
        System.out.println("stack = " + s + "   (printed bottom -&gt; top)");
        System.out.println("peek() = " + s.peek() + ", search(\\"C\\") = " + s.search("C")
                + ", search(\\"A\\") = " + s.search("A") + ", search(\\"Z\\") = " + s.search("Z"));
        System.out.println("pop() = " + s.pop() + ", now " + s + ", empty() = " + s.empty());
        s.add(0, "X");                                      // inherited from Vector: breaks LIFO!
        System.out.println("add(0, \\"X\\"), a Vector method -&gt; " + s + ", get(0) = " + s.get(0));
        s.clear();
        try { s.pop(); } catch (EmptyStackException e) { System.out.println("pop() on empty -&gt; " + e); }

        Deque&lt;String&gt; d = new ArrayDeque&lt;String&gt;();         // the recommended replacement
        d.push("A"); d.push("B"); d.push("C");
        System.out.println("ArrayDeque = " + d + "   (printed top -&gt; bottom), peek() = " + d.peek() + ", pop() = " + d.pop());
    }
}</code></pre>
<div class="out">stack = [A, B, C] &nbsp;&nbsp;(printed bottom -&gt; top)<br>
peek() = C, search("C") = 1, search("A") = 3, search("Z") = -1<br>
pop() = C, now [A, B], empty() = false<br>
add(0, "X"), a Vector method -&gt; [X, A, B], get(0) = X<br>
pop() on empty -&gt; java.util.EmptyStackException<br>
ArrayDeque = [C, B, A] &nbsp;&nbsp;(printed top -&gt; bottom), peek() = C, pop() = C</div>
<ul>
<li>Because a <code>Stack</code> <em>is a</em> <code>Vector</code>, it also has <code>add(0, x)</code>, <code>get(i)</code>, <code>remove(i)</code> — methods that break LIFO (line 4 of the output).</li>
<li><code>Vector</code> is synchronized (thread-safe), so every call pays for locking; its <code>toString()</code> and iterator go bottom → top.</li>
<li>Recommended: <code>Deque&lt;Integer&gt; st = new ArrayDeque&lt;Integer&gt;();</code> with <code>push</code>/<code>pop</code>/<code>peek</code> — faster, only stack-like methods, and it prints top → bottom.</li>
</ul>
<div class="pitfall">Name traps: <code>java.util.Stack</code> has <code>peek()</code>, not <code>top()</code>, and <code>empty()</code> (plus <code>isEmpty()</code> inherited from <code>Vector</code>). <code>search</code> counts from 1 at the top — <code>search("C")</code> is 1, not 0.</div>`,
        `<p class="y-chinh">🎯 java.util.Stack là lớp Vector cộng thêm một constructor (hàm dựng) và năm phương thức — push, pop, peek, empty, search; dùng được, nhưng chính tài liệu của Java khuyên dùng Deque/ArrayDeque thay thế.</p>
<p>Slide trình bày lớp này bằng hình; constructor và năm phương thức (method) theo đúng Java API:</p>
<table>
<thead><tr><th>Thành phần</th><th>Làm gì</th><th>Big-O</th></tr></thead>
<tbody>
<tr><td><code>Stack()</code></td><td>tạo một ngăn xếp (stack) rỗng</td><td>O(1)</td></tr>
<tr><td><code>E push(E item)</code> — đẩy vào</td><td>đặt <code>item</code> lên đỉnh và trả về chính nó</td><td>O(1) khấu hao (amortized)</td></tr>
<tr><td><code>E pop()</code> — lấy ra</td><td>gỡ và trả về phần tử đỉnh; rỗng thì ném <code>EmptyStackException</code></td><td>O(1)</td></tr>
<tr><td><code>E peek()</code> — xem đỉnh</td><td>trả về phần tử đỉnh, không gỡ; rỗng thì ném <code>EmptyStackException</code></td><td>O(1)</td></tr>
<tr><td><code>boolean empty()</code> — rỗng?</td><td>true khi không còn phần tử nào</td><td>O(1)</td></tr>
<tr><td><code>int search(Object o)</code> — tìm</td><td>khoảng cách tính từ đỉnh, bắt đầu từ 1 (đỉnh = 1); không có thì −1</td><td>O(n)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.EmptyStackException;
import java.util.Stack;

public class JavaUtilStack {
    public static void main(String[] args) {
        Stack&lt;String&gt; s = new Stack&lt;String&gt;();              // constructor duy nhất
        s.push("A"); s.push("B"); s.push("C");              // push(e) còn trả về e
        System.out.println("stack = " + s + "   (printed bottom -&gt; top)");
        System.out.println("peek() = " + s.peek() + ", search(\\"C\\") = " + s.search("C")
                + ", search(\\"A\\") = " + s.search("A") + ", search(\\"Z\\") = " + s.search("Z"));
        System.out.println("pop() = " + s.pop() + ", now " + s + ", empty() = " + s.empty());
        s.add(0, "X");                                      // kế thừa từ Vector: phá luật LIFO!
        System.out.println("add(0, \\"X\\"), a Vector method -&gt; " + s + ", get(0) = " + s.get(0));
        s.clear();
        try { s.pop(); } catch (EmptyStackException e) { System.out.println("pop() on empty -&gt; " + e); }

        Deque&lt;String&gt; d = new ArrayDeque&lt;String&gt;();         // lớp nên dùng thay thế
        d.push("A"); d.push("B"); d.push("C");
        System.out.println("ArrayDeque = " + d + "   (printed top -&gt; bottom), peek() = " + d.peek() + ", pop() = " + d.pop());
    }
}</code></pre>
<div class="out">stack = [A, B, C] &nbsp;&nbsp;(printed bottom -&gt; top)<br>
peek() = C, search("C") = 1, search("A") = 3, search("Z") = -1<br>
pop() = C, now [A, B], empty() = false<br>
add(0, "X"), a Vector method -&gt; [X, A, B], get(0) = X<br>
pop() on empty -&gt; java.util.EmptyStackException<br>
ArrayDeque = [C, B, A] &nbsp;&nbsp;(printed top -&gt; bottom), peek() = C, pop() = C</div>
<ul>
<li>Vì <code>Stack</code> <em>là một</em> <code>Vector</code> (kế thừa — extends), nó còn có <code>add(0, x)</code>, <code>get(i)</code>, <code>remove(i)</code> — những phương thức phá luật LIFO (vào sau ra trước) — dòng 4 của output.</li>
<li><code>Vector</code> được đồng bộ hoá (synchronized — an toàn đa luồng), nên lời gọi nào cũng tốn công khoá; <code>toString()</code> và bộ duyệt (iterator) của nó đi từ đáy → đỉnh.</li>
<li>Nên dùng: <code>Deque&lt;Integer&gt; st = new ArrayDeque&lt;Integer&gt;();</code> với <code>push</code>/<code>pop</code>/<code>peek</code> — nhanh hơn, chỉ có thao tác kiểu stack, và in từ đỉnh → đáy.</li>
</ul>
<div class="pitfall">Bẫy tên gọi: <code>java.util.Stack</code> có <code>peek()</code> chứ không có <code>top()</code>, và có <code>empty()</code> (cộng <code>isEmpty()</code> kế thừa từ <code>Vector</code>). <code>search</code> đếm từ 1 ở đỉnh — <code>search("C")</code> là 1, không phải 0.</div>`],
      [18, 'Summary',
        `<p class="y-chinh">🎯 A stack is a linear data structure accessed at only one end, the top, for storing and retrieving data: last in, first out.</p>
<table>
<thead><tr><th>Implementation</th><th>push / pop / top</th><th>Can it be full?</th><th>pop/top on an empty stack</th></tr></thead>
<tbody>
<tr><td>array + <code>top</code> (slides 8–10)</td><td>O(1); a growing push O(n), amortized O(1)</td><td>yes — grow (and update <code>max</code>!) or throw</td><td>exception</td></tr>
<tr><td>singly linked list, top = head (slide 11)</td><td>O(1)</td><td>never</td><td>exception</td></tr>
<tr><td><code>ArrayList</code> / <code>LinkedList</code>, top = last element (slide 12)</td><td>O(1) (amortized for <code>ArrayList</code>)</td><td>never</td><td>slide 12 returns <code>null</code></td></tr>
<tr><td><code>java.util.Stack</code> / <code>ArrayDeque</code> (slide 17)</td><td>O(1) amortized</td><td>never</td><td><code>EmptyStackException</code> / <code>pop()</code>: <code>NoSuchElementException</code>, <code>peek()</code>: <code>null</code></td></tr>
</tbody>
</table>
<ul>
<li>Uses: nesting (brackets, HTML tags), evaluating expressions, method calls (the run-time stack), backtracking, undo, number conversion.</li>
<li>Code reflexes for the PE: array push <code>a[++top] = x</code>, array pop <code>a[top--]</code>; linked push <code>head = new Node(x, head)</code>; check <code>isEmpty()</code> before every <code>pop()</code>.</li>
</ul>
<p>Which one to pick: an array stack when the maximum size is known, a linked stack when it is not; in real Java code, simply <code>ArrayDeque</code>.</p>
<p class="meo">🧠 <strong>Remember:</strong> LIFO — last in, first out — a pile of plates.</p>
<div class="pitfall">FE favourite: "which structure gives its elements back in the reverse order?" — the stack. "Which one keeps the order?" — the queue (deck 2B). Do not swap them.</div>`,
        `<p class="y-chinh">🎯 Ngăn xếp (stack) là cấu trúc dữ liệu tuyến tính chỉ truy cập được ở một đầu — đỉnh (top) — để cất và lấy dữ liệu: vào sau, ra trước (LIFO).</p>
<table>
<thead><tr><th>Cách cài đặt</th><th>push / pop / top (đẩy vào / lấy ra / xem đỉnh)</th><th>Có thể đầy?</th><th>pop/top khi stack rỗng</th></tr></thead>
<tbody>
<tr><td>mảng + <code>top</code> (slide 8–10)</td><td>O(1); lần push phải nới mảng O(n), khấu hao O(1)</td><td>có — nới mảng (và cập nhật <code>max</code>!) hoặc ném ngoại lệ</td><td>ngoại lệ (exception)</td></tr>
<tr><td>danh sách liên kết đơn, đỉnh = head (slide 11)</td><td>O(1)</td><td>không bao giờ</td><td>ngoại lệ</td></tr>
<tr><td><code>ArrayList</code> / <code>LinkedList</code>, đỉnh = phần tử cuối (slide 12)</td><td>O(1) (khấu hao với <code>ArrayList</code>)</td><td>không bao giờ</td><td>slide 12 trả về <code>null</code></td></tr>
<tr><td><code>java.util.Stack</code> / <code>ArrayDeque</code> (slide 17)</td><td>O(1) khấu hao</td><td>không bao giờ</td><td><code>EmptyStackException</code> / <code>pop()</code>: <code>NoSuchElementException</code>, <code>peek()</code>: <code>null</code></td></tr>
</tbody>
</table>
<ul>
<li>Ứng dụng: lồng nhau (dấu ngoặc, thẻ HTML), tính biểu thức, gọi hàm (run-time stack — ngăn xếp thời gian chạy), quay lui (backtracking), hoàn tác (undo), đổi cơ số.</li>
<li>Phản xạ code cho PE: push trên mảng <code>a[++top] = x</code>, pop trên mảng <code>a[top--]</code>; push liên kết <code>head = new Node(x, head)</code>; luôn kiểm tra <code>isEmpty()</code> trước mỗi <code>pop()</code>.</li>
</ul>
<p>Chọn cách nào: stack bằng mảng khi biết trước kích thước tối đa, stack liên kết khi không biết; còn trong code Java thực tế thì cứ dùng <code>ArrayDeque</code>.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> LIFO — last in, first out, vào sau ra trước — như một chồng đĩa.</p>
<div class="pitfall">Câu FE hay gặp: "cấu trúc nào trả phần tử ra theo thứ tự ngược với lúc vào?" — ngăn xếp (stack). "Cấu trúc nào giữ nguyên thứ tự?" — hàng đợi (queue, bộ slide 2B). Đừng nhầm hai cái.</div>`],
      [19, 'Reading at home',
        `<p class="y-chinh">🎯 Goodrich 6e, Chapter 6 "Stacks, Queues, and Deques" (p.225), section 6.1 Stacks (p.226), is the textbook version of this deck — read it after the slides.</p>
<ul>
<li><strong>6.1.1 The Stack ADT</strong> — the same operations; note that the book's <code>pop()</code> and <code>top()</code> return <code>null</code> on an empty stack instead of throwing.</li>
<li><strong>6.1.2 A simple array-based stack</strong> — <code>ArrayStack</code> with a fixed capacity; <code>push</code> throws <code>IllegalStateException</code> when the array is full.</li>
<li><strong>6.1.3 Implementing a stack with a singly linked list</strong> — <code>LinkedStack</code> built on the book's <code>SinglyLinkedList</code> (the adapter pattern).</li>
<li><strong>6.1.4 Reversing an array using a stack</strong> and <strong>6.1.5 Matching parentheses and HTML tags</strong> — slides 3 and 14–16 of this deck.</li>
</ul>
<p>The book's classes are generic (<code>Stack&lt;E&gt;</code>), the slides' classes store <code>Object</code> — the same ideas in older packaging.</p>`,
        `<p class="y-chinh">🎯 Chương 6 "Stacks, Queues, and Deques" (tr.225) của sách Goodrich bản 6, mục 6.1 Stacks (tr.226), là phiên bản giáo trình của bộ slide này — đọc sau khi học slide.</p>
<ul>
<li><strong>6.1.1 The Stack ADT</strong> (ADT ngăn xếp — stack) — cùng các thao tác; lưu ý <code>pop()</code> và <code>top()</code> của sách trả về <code>null</code> khi stack rỗng chứ không ném ngoại lệ.</li>
<li><strong>6.1.2 A simple array-based stack</strong> (stack bằng mảng đơn giản) — <code>ArrayStack</code> có sức chứa cố định; <code>push</code> ném <code>IllegalStateException</code> khi mảng đầy.</li>
<li><strong>6.1.3 Implementing a stack with a singly linked list</strong> (stack bằng danh sách liên kết đơn) — <code>LinkedStack</code> dựng trên <code>SinglyLinkedList</code> của sách (mẫu thiết kế adapter — bộ chuyển đổi).</li>
<li><strong>6.1.4 Reversing an array using a stack</strong> (đảo mảng bằng stack) và <strong>6.1.5 Matching parentheses and HTML tags</strong> (khớp dấu ngoặc và thẻ HTML) — slide 3 và 14–16 của bộ này.</li>
</ul>
<p>Các lớp trong sách là kiểu tổng quát (generic, <code>Stack&lt;E&gt;</code>), còn lớp trên slide lưu <code>Object</code> — cùng ý tưởng, cách đóng gói cũ hơn.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>push(1), push(2), push(3), pop(), push(4), top() — what does <code>top()</code> return, and what is in the stack (bottom → top)?</li>
<li>With the slide's <code>ArrayStack(2)</code>, which push crashes, and why?</li>
<li>Why does the linked stack push and pop at the head rather than at the tail?</li>
<li>A <code>java.util.Stack</code> received push("A"), push("B"), push("C"). What is <code>search("A")</code>?</li>
<li>Is <code>({[ ])}</code> properly matched? Where does the algorithm stop?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 4; the stack is 1 2 4 — <code>top()</code> removes nothing. (2) the 4th push: <code>grow()</code> does not update <code>max</code>, so after the first growth <code>isFull()</code> stays false and <code>a[3]</code> is outside the 3-cell array. (3) deleting the tail of a singly linked list is O(n); at the head push and pop are both O(1). (4) 3 — <code>search</code> counts from 1 at the top. (5) no: at <code>)</code> the stack pops <code>{</code>, which is not its pair.</p>
<p><strong>Next:</strong> lesson 2.B (the queues deck, slide by slide), then the deep-dive lessons 2.1–2.5 below — 2.1 stacks and queues side by side, 2.2 circular array vs linked, 2.3 stack applications (brackets, RPN, undo), 2.4 deques, 2.5 priority queues and heaps — then lesson 2.6 (practice, glossary, summary) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>push(1), push(2), push(3), pop(), push(4), top() — <code>top()</code> trả về gì, và trong ngăn xếp (stack) còn gì (đáy → đỉnh)?</li>
<li>Với <code>ArrayStack(2)</code> của slide, lần đẩy vào (push) nào làm chương trình sập, và vì sao?</li>
<li>Vì sao stack liên kết push và pop (lấy ra) ở head (nút đầu) chứ không ở tail (nút cuối)?</li>
<li>Một <code>java.util.Stack</code> lần lượt nhận push("A"), push("B"), push("C"). <code>search("A")</code> bằng bao nhiêu?</li>
<li><code>({[ ])}</code> có khớp đúng không? Thuật toán dừng ở đâu?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 4; stack là 1 2 4 — <code>top()</code> không lấy gì ra. (2) lần push thứ 4: <code>grow()</code> không cập nhật <code>max</code>, nên sau lần nới đầu tiên <code>isFull()</code> luôn sai và <code>a[3]</code> nằm ngoài mảng 3 ô. (3) xoá tail của danh sách liên kết đơn tốn O(n); ở head thì push và pop đều O(1). (4) 3 — <code>search</code> đếm từ 1 ở đỉnh. (5) không: tới <code>)</code> thì stack pop ra <code>{</code>, không phải cặp của nó.</p>
<p><strong>Học tiếp:</strong> bài 2.B (bộ slide hàng đợi, học từng slide), rồi các bài đào sâu 2.1–2.5 bên dưới — 2.1 stack và queue đặt cạnh nhau, 2.2 mảng vòng hay liên kết, 2.3 ứng dụng stack (dấu ngoặc, biểu thức hậu tố RPN, hoàn tác undo), 2.4 deque (hàng đợi hai đầu), 2.5 hàng đợi ưu tiên (priority queue) và đống (heap) — sau đó bài 2.6 (thực hành, thuật ngữ, tóm tắt) và quiz của chương.</p>`),
    books([
      ['goodrich', 'Ch.6 Stacks, Queues, and Deques p.225 — §6.1 Stacks p.226', 'Chương 6 Stacks, Queues, and Deques tr.225 — §6.1 Stacks tr.226'],
    ]),
  ].join('\n'),
};

/* ───────── 2.B — 📑 Slide by slide · Queues, deques & priority queues (2B-Queues, slides 1–21) ───────── */
const L_csd6_1 = {
  title: '2.B — 📑 Slide by slide · Queues, deques & priority queues (2B-Queues, slides 1–21)|||2.B — 📑 Học theo từng slide · Hàng đợi, deque & hàng đợi ưu tiên (2B-Queues, slide 1–21)',
  slug: 'csd201-slide-csd6-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–21 của bộ 2B-Queues: FIFO, thao tác và ví dụ trên slide chạy lại bằng Java, round-robin, hàng đợi mảng vòng (first/last quay vòng, isFull, grow vẽ lại từng bước), hàng đợi liên kết, CircularQueue với rotate(), interface Queue và java.util.Queue, deque, hàng đợi ưu tiên bằng mảng có thứ tự (lỗi grow() và assert trên slide chạy thật) — 14 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.B · 2B-Queues, slides 1–21</span>
<h2>Queues, deques and priority queues — the deck, slide by slide</h2>
<p class="lead">This is the deck of syllabus sessions 7–8 (2.2 Queues, 2.3 Double-Ended Queues, 2.4 The Priority Queue — CLO2). Read it after lesson 2.A and before the deep-dive lessons 2.1–2.5: every slide with its meaning, the slide's own table and code run in Java, the circular array drawn index by index, the cost in Big-O, and the traps — including a bug the priority-queue code shares with the stack deck.</p>
<div class="callout"><strong>CLO2 in the syllabus:</strong> define stack and queue; describe their basic operations and their uses. The syllabus's discussion questions for these sessions: "What is a queue?", "What are the differences between stack and queue?", "What is a priority queue?" (hint: an ambulance at a gate shared with other cars) — answered on slides 3 and 17. Typical exam tasks: trace enqueue/dequeue including the <em>indices</em> of a circular array, write a linked queue, insert into a priority queue kept in order.</div>
<h3>The whole deck in one table</h3>
<table>
<thead><tr><th>Structure</th><th>Add</th><th>Remove</th><th>Look at the next one</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>Queue on a circular array</td><td><code>enqueue</code> O(1); O(n) on the call that grows the array</td><td><code>dequeue</code> O(1)</td><td><code>front</code> O(1)</td><td>8–11</td></tr>
<tr><td>Queue on a singly linked list</td><td><code>enqueue</code> at <code>tail</code>, O(1)</td><td><code>dequeue</code> at <code>head</code>, O(1)</td><td><code>front</code> O(1)</td><td>12</td></tr>
<tr><td>Circular queue (circularly linked)</td><td><code>enqueue</code> O(1)</td><td><code>dequeue</code> O(1); <code>rotate()</code> O(1)</td><td><code>front</code> O(1)</td><td>13</td></tr>
<tr><td>Deque (<code>ArrayDeque</code>)</td><td><code>addFirst</code> / <code>addLast</code> O(1)</td><td><code>removeFirst</code> / <code>removeLast</code> O(1)</td><td><code>first</code> / <code>last</code> O(1)</td><td>15–16</td></tr>
<tr><td>Priority queue on a sorted array</td><td><code>enqueue</code> O(n) — shifting</td><td><code>dequeue</code> O(1) — the largest, at <code>a[top]</code></td><td><code>front</code> O(1)</td><td>17–19</td></tr>
<tr><td><code>java.util.PriorityQueue</code> (binary heap)</td><td><code>offer</code> O(log n)</td><td><code>poll</code> O(log n) — the smallest by default</td><td><code>peek</code> O(1)</td><td>19</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.B · 2B-Queues, slide 1–21</span>
<h2>Hàng đợi, deque và hàng đợi ưu tiên — học bộ slide từng trang</h2>
<p class="lead">Đây là bộ slide của buổi 7–8 theo syllabus (2.2 Queues, 2.3 Double-Ended Queues, 2.4 The Priority Queue — CLO2). Hãy đọc sau bài 2.A và trước các bài đào sâu 2.1–2.5: slide nào cũng có ý nghĩa, bảng và code của chính slide được chạy lại bằng Java, mảng vòng (circular array) vẽ lại theo từng chỉ số, chi phí Big-O và các bẫy — kể cả một lỗi mà code hàng đợi ưu tiên (priority queue) mắc giống hệt bộ slide ngăn xếp.</p>
<div class="callout"><strong>CLO2 trong syllabus:</strong> định nghĩa được ngăn xếp (stack) và hàng đợi (queue); mô tả các thao tác cơ bản và công dụng của chúng. Câu hỏi thảo luận của syllabus cho các buổi này: "Hàng đợi là gì?", "Stack và queue khác nhau thế nào?", "Hàng đợi ưu tiên là gì?" (gợi ý: xe cứu thương đi qua cổng dùng chung với các xe khác) — lời đáp ở slide 3 và 17. Dạng bài thường gặp: lần theo enqueue/dequeue (đưa vào/lấy ra) kể cả <em>chỉ số</em> của mảng vòng, viết hàng đợi liên kết, chèn vào hàng đợi ưu tiên giữ thứ tự.</div>
<h3>Cả bộ slide trong một bảng</h3>
<table>
<thead><tr><th>Cấu trúc</th><th>Thêm</th><th>Lấy ra</th><th>Xem phần tử kế tiếp</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Hàng đợi trên mảng vòng</td><td><code>enqueue</code> O(1); O(n) ở lần gọi phải nới mảng</td><td><code>dequeue</code> O(1)</td><td><code>front</code> O(1)</td><td>8–11</td></tr>
<tr><td>Hàng đợi trên danh sách liên kết đơn</td><td><code>enqueue</code> ở <code>tail</code>, O(1)</td><td><code>dequeue</code> ở <code>head</code>, O(1)</td><td><code>front</code> O(1)</td><td>12</td></tr>
<tr><td>Hàng đợi vòng (liên kết vòng)</td><td><code>enqueue</code> O(1)</td><td><code>dequeue</code> O(1); <code>rotate()</code> O(1)</td><td><code>front</code> O(1)</td><td>13</td></tr>
<tr><td>Deque — hàng đợi hai đầu (<code>ArrayDeque</code>)</td><td><code>addFirst</code> / <code>addLast</code> O(1)</td><td><code>removeFirst</code> / <code>removeLast</code> O(1)</td><td><code>first</code> / <code>last</code> O(1)</td><td>15–16</td></tr>
<tr><td>Hàng đợi ưu tiên trên mảng có thứ tự</td><td><code>enqueue</code> O(n) — phải dời phần tử</td><td><code>dequeue</code> O(1) — phần tử lớn nhất, ở <code>a[top]</code></td><td><code>front</code> O(1)</td><td>17–19</td></tr>
<tr><td><code>java.util.PriorityQueue</code> (đống nhị phân — binary heap)</td><td><code>offer</code> O(log n)</td><td><code>poll</code> O(log n) — mặc định lấy phần tử nhỏ nhất</td><td><code>peek</code> O(1)</td><td>19</td></tr>
</tbody>
</table>`),
    walkHead('csd6', 1, 21),
    walk('csd6', [
      [1, '2. Stack and Queue - Part 2: Queue',
        `<p class="y-chinh">🎯 Part 2 of chapter 2 turns from the stack, used at one end, to the queue, which uses both ends — plus two relatives, the deque and the priority queue.</p>
<p>A queue is the fair waiting line: first come, first served. The deck then generalises it in two directions: the deque (add and remove at <em>both</em> ends) and the priority queue (the most important element leaves first, whatever its arrival time).</p>`,
        `<p class="y-chinh">🎯 Phần 2 của chương 2 chuyển từ ngăn xếp (stack) — dùng một đầu — sang hàng đợi (queue) — dùng cả hai đầu — cùng hai "họ hàng": hàng đợi hai đầu (deque) và hàng đợi ưu tiên (priority queue).</p>
<p>Hàng đợi là một hàng chờ công bằng: ai tới trước được phục vụ trước. Sau đó bộ slide mở rộng nó theo hai hướng: deque (thêm và lấy ở <em>cả hai</em> đầu) và hàng đợi ưu tiên (phần tử quan trọng nhất ra trước, bất kể nó tới lúc nào).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three goals: queues and how to build them, priority queues, and the queue interfaces of Java.</p>
<ol>
<li><strong>Queues</strong> — slides 3–13: the FIFO rule, operations and their exceptions, a worked example, applications, round-robin scheduling, the circular array (slides 8–11), the linked list (slide 12), the circular queue with <code>rotate()</code> (slide 13).</li>
<li>The deck also covers the <strong>deque</strong> (double-ended queue) on slides 15–16, although the objectives do not list it.</li>
<li><strong>Priority queues</strong> — slides 17–19: the idea, then an implementation on a sorted array.</li>
<li><strong>Queue interface</strong> — slide 14 writes the queue ADT as a Java interface; this lesson also shows the real <code>java.util.Queue</code> (slides 4 and 14) and <code>java.util.PriorityQueue</code> (slide 19).</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> stack = one end (LIFO); queue = two ends with fixed roles (FIFO); deque = two ends, both roles; priority queue = order by importance.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu: hàng đợi (queue) và cách dựng nó, hàng đợi ưu tiên (priority queue), và các interface (giao diện) hàng đợi của Java.</p>
<ol>
<li><strong>Hàng đợi</strong> — slide 3–13: luật FIFO (first in, first out — vào trước ra trước), các thao tác và ngoại lệ (exception) của chúng, một ví dụ có lời giải, các ứng dụng, lập lịch xoay vòng (round-robin), mảng vòng (circular array, slide 8–11), danh sách liên kết (slide 12), hàng đợi vòng có <code>rotate()</code> (slide 13).</li>
<li>Bộ slide còn dạy <strong>deque</strong> (double-ended queue — hàng đợi hai đầu) ở slide 15–16, dù phần mục tiêu không ghi.</li>
<li><strong>Hàng đợi ưu tiên</strong> — slide 17–19: ý tưởng, rồi một cách cài đặt trên mảng có thứ tự.</li>
<li><strong>Interface hàng đợi</strong> — slide 14 viết ADT (kiểu dữ liệu trừu tượng) hàng đợi thành một interface Java; bài này còn cho xem <code>java.util.Queue</code> thật (slide 4 và 14) và <code>java.util.PriorityQueue</code> (slide 19).</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ngăn xếp (stack) = một đầu (LIFO — vào sau ra trước); queue = hai đầu, mỗi đầu một việc (FIFO); deque = hai đầu, đầu nào cũng làm được cả hai việc; hàng đợi ưu tiên = xếp theo mức quan trọng.</p>`],
      [3, 'What is a queue?',
        `<p class="y-chinh">🎯 A queue is a waiting line: it grows by adding elements at its end and shrinks by taking elements from its front — first in, first out (FIFO).</p>
<ul>
<li><strong>Both ends are used</strong>, each for one job: the rear (end) only for adding, the front only for removing. A stack uses its single end for both.</li>
<li><strong>FIFO</strong> = First In, First Out: the element that has waited longest is the next to leave, so the order of arrival is kept.</li>
<li>Everyday queues: the canteen line, print jobs, calls waiting for a support agent, the keys you type before the program reads them.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

public class StackVsQueue {
    public static void main(String[] args) {
        Deque&lt;String&gt; stack = new ArrayDeque&lt;String&gt;();
        Queue&lt;String&gt; queue = new ArrayDeque&lt;String&gt;();        // ArrayDeque is also a queue
        for (String c : new String[] {"Anna", "Binh", "Chi"}) {
            stack.push(c);                                     // stack: in at the top
            queue.add(c);                                      // queue: in at the rear
            System.out.println(c + " arrives");
        }
        StringBuilder s = new StringBuilder(), q = new StringBuilder();
        while (!stack.isEmpty()) s.append(' ').append(stack.pop());
        while (!queue.isEmpty()) q.append(' ').append(queue.remove());   // out at the front
        System.out.println("stack serves:" + s + "   (LIFO)");
        System.out.println("queue serves:" + q + "   (FIFO)");
    }
}</code></pre>
<div class="out">Anna arrives<br>
Binh arrives<br>
Chi arrives<br>
stack serves: Chi Binh Anna &nbsp;&nbsp;(LIFO)<br>
queue serves: Anna Binh Chi &nbsp;&nbsp;(FIFO)</div>
<p class="dap-an">✅ <strong>Syllabus question "What are the differences between stack and queue?"</strong> — a stack has one end, is LIFO and gives elements back in reverse order; a queue has two ends with fixed roles, is FIFO and keeps the order of arrival. Both are linear and both have O(1) add/remove.</p>
<p class="meo">🧠 <strong>Remember:</strong> FIFO = "first come, first served".</p>
<div class="pitfall">"Front" is where elements <em>leave</em>, "rear"/"end" is where they <em>arrive</em>. Drawing the queue the other way round in an FE trace swaps every answer.</div>`,
        `<p class="y-chinh">🎯 Hàng đợi (queue) là một hàng chờ: nó dài ra khi thêm phần tử vào cuối (end/rear) và ngắn lại khi lấy phần tử ở đầu (front) — vào trước, ra trước (FIFO — first in, first out).</p>
<ul>
<li><strong>Dùng cả hai đầu</strong>, mỗi đầu một việc: đầu cuối chỉ để thêm, đầu trước chỉ để lấy ra. Ngăn xếp (stack) thì dùng một đầu duy nhất cho cả hai việc.</li>
<li><strong>FIFO</strong> = First In, First Out: phần tử chờ lâu nhất là phần tử ra kế tiếp, nên thứ tự tới được giữ nguyên.</li>
<li>Hàng đợi đời thường: hàng lấy cơm ở căng-tin, các lệnh in chờ máy in, cuộc gọi chờ nhân viên tổng đài, các phím bạn gõ trước khi chương trình kịp đọc.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

public class StackVsQueue {
    public static void main(String[] args) {
        Deque&lt;String&gt; stack = new ArrayDeque&lt;String&gt;();
        Queue&lt;String&gt; queue = new ArrayDeque&lt;String&gt;();        // ArrayDeque cũng dùng làm hàng đợi được
        for (String c : new String[] {"Anna", "Binh", "Chi"}) {
            stack.push(c);                                     // stack: vào ở đỉnh
            queue.add(c);                                      // queue: vào ở cuối hàng
            System.out.println(c + " arrives");
        }
        StringBuilder s = new StringBuilder(), q = new StringBuilder();
        while (!stack.isEmpty()) s.append(' ').append(stack.pop());
        while (!queue.isEmpty()) q.append(' ').append(queue.remove());   // ra ở đầu hàng
        System.out.println("stack serves:" + s + "   (LIFO)");
        System.out.println("queue serves:" + q + "   (FIFO)");
    }
}</code></pre>
<div class="out">Anna arrives<br>
Binh arrives<br>
Chi arrives<br>
stack serves: Chi Binh Anna &nbsp;&nbsp;(LIFO)<br>
queue serves: Anna Binh Chi &nbsp;&nbsp;(FIFO)</div>
<p class="dap-an">✅ <strong>Câu hỏi syllabus "Stack và queue khác nhau thế nào?"</strong> — stack có một đầu, theo LIFO (vào sau ra trước) và trả phần tử ra theo thứ tự ngược; queue có hai đầu với vai trò cố định, theo FIFO và giữ nguyên thứ tự tới. Cả hai đều tuyến tính (linear) và đều thêm/lấy trong O(1).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> FIFO = "ai tới trước, phục vụ trước".</p>
<div class="pitfall">"Front" (đầu hàng) là chỗ phần tử <em>ra</em>, "rear"/"end" (cuối hàng) là chỗ phần tử <em>vào</em>. Vẽ hàng đợi ngược chiều trong câu lần theo (trace) ở FE là sai hết mọi đáp án.</div>`],
      [4, 'Operations on a queue',
        `<p class="y-chinh">🎯 clear, isEmpty, enqueue (put at the end), dequeue (take the first), front (look at the first without removing); dequeue and front on an empty queue throw EmptyQueueException, and front is sometimes called peek.</p>
<table>
<thead><tr><th>ADT operation (slide)</th><th>Meaning</th><th><code>java.util.Queue</code>: throws on failure</th><th><code>java.util.Queue</code>: returns a special value</th></tr></thead>
<tbody>
<tr><td><code>enqueue(el)</code></td><td>put <code>el</code> at the end</td><td><code>add(e)</code></td><td><code>offer(e)</code> — <code>false</code> if a bounded queue is full</td></tr>
<tr><td><code>dequeue()</code></td><td>take the first element out and return it</td><td><code>remove()</code> — <code>NoSuchElementException</code></td><td><code>poll()</code> — <code>null</code></td></tr>
<tr><td><code>front()</code> / <code>peek()</code></td><td>return the first element, remove nothing</td><td><code>element()</code> — <code>NoSuchElementException</code></td><td><code>peek()</code> — <code>null</code></td></tr>
<tr><td><code>isEmpty()</code>, <code>clear()</code></td><td>as named</td><td><code>isEmpty()</code>, <code>clear()</code></td><td>—</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.NoSuchElementException;
import java.util.Queue;

public class QueueNames {
    public static void main(String[] args) {
        Queue&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
        q.add(5);                                     // enqueue(5)
        q.offer(3);                                   // enqueue(3), the version that never throws
        System.out.println("queue = " + q + ", peek() = " + q.peek() + ", element() = " + q.element());   // front()
        System.out.println("remove() = " + q.remove() + ", poll() = " + q.poll() + ", isEmpty() = " + q.isEmpty());   // dequeue()
        System.out.println("empty: peek() = " + q.peek() + ", poll() = " + q.poll() + "   (null, no exception)");
        try { q.element(); } catch (NoSuchElementException e) { System.out.println("empty: element() -&gt; " + e); }
        try { q.remove(); } catch (NoSuchElementException e) { System.out.println("empty: remove()  -&gt; " + e); }
        q.add(9);
        q.clear();                                    // clear()
        System.out.println("add(9), clear() -&gt; size() = " + q.size());
    }
}</code></pre>
<div class="out">queue = [5, 3], peek() = 5, element() = 5<br>
remove() = 5, poll() = 3, isEmpty() = true<br>
empty: peek() = null, poll() = null &nbsp;&nbsp;(null, no exception)<br>
empty: element() -&gt; java.util.NoSuchElementException<br>
empty: remove() &nbsp;-&gt; java.util.NoSuchElementException<br>
add(9), clear() -&gt; size() = 0</div>
<ul>
<li><code>EmptyQueueException</code> is the ADT's name, like <code>StackEmptyException</code> in deck 2A: you declare it yourself. The JDK uses <code>NoSuchElementException</code>.</li>
<li><strong>Big-O:</strong> with a good implementation (slides 10–12) every operation is O(1).</li>
</ul>
<p>Why two families? A <em>bounded</em> queue (a fixed-size buffer) can be full, and then <code>add</code> throws <code>IllegalStateException</code> while <code>offer</code> just returns <code>false</code>. Pick <code>offer</code>/<code>poll</code>/<code>peek</code> when "empty" or "full" is a normal situation, <code>add</code>/<code>remove</code>/<code>element</code> when it would be a bug.</p>
<p class="meo">🧠 <strong>Remember:</strong> the "p" methods are polite — <code>peek()</code> and <code>poll()</code> answer <code>null</code> on an empty queue instead of throwing.</p>
<div class="pitfall">FE favourite: "which call throws on an empty <code>java.util.Queue</code>?" — <code>remove()</code> and <code>element()</code>. <code>poll()</code> and <code>peek()</code> return <code>null</code>, and code that does <code>int x = q.poll();</code> on an empty <code>Queue&lt;Integer&gt;</code> then fails with a <code>NullPointerException</code> while unboxing.</div>`,
        `<p class="y-chinh">🎯 clear (làm rỗng), isEmpty (kiểm tra rỗng), enqueue (đưa vào cuối), dequeue (lấy phần tử đầu), front (xem phần tử đầu mà không lấy ra); dequeue và front trên hàng đợi (queue) rỗng ném EmptyQueueException, và front đôi khi được gọi là peek (xem trước).</p>
<table>
<thead><tr><th>Thao tác ADT (slide)</th><th>Ý nghĩa</th><th><code>java.util.Queue</code>: ném ngoại lệ khi thất bại</th><th><code>java.util.Queue</code>: trả về giá trị đặc biệt</th></tr></thead>
<tbody>
<tr><td><code>enqueue(el)</code> — đưa vào</td><td>đặt <code>el</code> vào cuối hàng</td><td><code>add(e)</code></td><td><code>offer(e)</code> — <code>false</code> nếu hàng đợi có giới hạn đã đầy</td></tr>
<tr><td><code>dequeue()</code> — lấy ra</td><td>lấy phần tử đầu ra và trả về nó</td><td><code>remove()</code> — <code>NoSuchElementException</code></td><td><code>poll()</code> — <code>null</code></td></tr>
<tr><td><code>front()</code> / <code>peek()</code> — xem đầu</td><td>trả về phần tử đầu, không lấy ra</td><td><code>element()</code> — <code>NoSuchElementException</code></td><td><code>peek()</code> — <code>null</code></td></tr>
<tr><td><code>isEmpty()</code>, <code>clear()</code> — kiểm tra rỗng, làm rỗng</td><td>như tên gọi</td><td><code>isEmpty()</code>, <code>clear()</code></td><td>—</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.NoSuchElementException;
import java.util.Queue;

public class QueueNames {
    public static void main(String[] args) {
        Queue&lt;Integer&gt; q = new ArrayDeque&lt;Integer&gt;();
        q.add(5);                                     // enqueue(5)
        q.offer(3);                                   // enqueue(3), bản không bao giờ ném ngoại lệ
        System.out.println("queue = " + q + ", peek() = " + q.peek() + ", element() = " + q.element());   // front()
        System.out.println("remove() = " + q.remove() + ", poll() = " + q.poll() + ", isEmpty() = " + q.isEmpty());   // dequeue()
        System.out.println("empty: peek() = " + q.peek() + ", poll() = " + q.poll() + "   (null, no exception)");
        try { q.element(); } catch (NoSuchElementException e) { System.out.println("empty: element() -&gt; " + e); }
        try { q.remove(); } catch (NoSuchElementException e) { System.out.println("empty: remove()  -&gt; " + e); }
        q.add(9);
        q.clear();                                    // clear()
        System.out.println("add(9), clear() -&gt; size() = " + q.size());
    }
}</code></pre>
<div class="out">queue = [5, 3], peek() = 5, element() = 5<br>
remove() = 5, poll() = 3, isEmpty() = true<br>
empty: peek() = null, poll() = null &nbsp;&nbsp;(null, no exception)<br>
empty: element() -&gt; java.util.NoSuchElementException<br>
empty: remove() &nbsp;-&gt; java.util.NoSuchElementException<br>
add(9), clear() -&gt; size() = 0</div>
<ul>
<li><code>EmptyQueueException</code> là tên của ADT (kiểu dữ liệu trừu tượng), giống <code>StackEmptyException</code> ở bộ slide 2A: bạn tự khai báo lớp này. JDK dùng <code>NoSuchElementException</code>.</li>
<li><strong>Big-O:</strong> với cách cài đặt tốt (slide 10–12), mọi thao tác đều O(1).</li>
</ul>
<p>Vì sao có hai họ phương thức? Hàng đợi <em>có giới hạn</em> (bounded — bộ đệm cỡ cố định) có thể bị đầy, khi đó <code>add</code> ném <code>IllegalStateException</code> còn <code>offer</code> chỉ trả về <code>false</code>. Chọn <code>offer</code>/<code>poll</code>/<code>peek</code> khi "rỗng" hay "đầy" là tình huống bình thường, chọn <code>add</code>/<code>remove</code>/<code>element</code> khi đó là lỗi.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> các phương thức chữ "p" rất lịch sự — <code>peek()</code> và <code>poll()</code> trả lời <code>null</code> khi hàng rỗng chứ không ném ngoại lệ (exception).</p>
<div class="pitfall">Câu FE hay gặp: "lời gọi nào ném ngoại lệ khi <code>java.util.Queue</code> rỗng?" — <code>remove()</code> và <code>element()</code>. <code>poll()</code> và <code>peek()</code> trả về <code>null</code>, và code kiểu <code>int x = q.poll();</code> trên một <code>Queue&lt;Integer&gt;</code> rỗng sẽ văng <code>NullPointerException</code> lúc mở hộp (unboxing).</div>`],
      [5, 'Queue example',
        `<p class="y-chinh">🎯 The slide's table runs 15 operations on one queue; the program below replays them and reproduces every row — including the "error" of a dequeue on an empty queue.</p>
<pre><code class="language-java">import java.util.LinkedList;

class EmptyQueueException extends RuntimeException {}   // the name used on slide 4

class SlideQueue {                             // the operations of slides 4-5, on a java.util.LinkedList
    private LinkedList&lt;Integer&gt; h = new LinkedList&lt;Integer&gt;();

    void enqueue(int el) { h.addLast(el); }   // at the end
    int dequeue() {                           // from the front
        if (h.isEmpty()) throw new EmptyQueueException();
        return h.removeFirst();
    }
    int front() {
        if (h.isEmpty()) throw new EmptyQueueException();
        return h.getFirst();
    }
    boolean isEmpty() { return h.isEmpty(); }
    int size() { return h.size(); }
    public String toString() { String s = h.toString(); return "(" + s.substring(1, s.length() - 1) + ")"; }
}

public class QueueExample {
    public static void main(String[] args) {
        SlideQueue q = new SlideQueue();
        String[] ops = {"enqueue 5", "enqueue 3", "dequeue", "enqueue 7", "dequeue", "front", "dequeue", "dequeue",
                        "isEmpty", "enqueue 9", "enqueue 7", "size", "enqueue 3", "enqueue 5", "dequeue"};
        System.out.println("Operation    Output    Q");
        for (String op : ops) {
            String[] w = op.split(" ");
            String out = "-";
            try {
                if (w[0].equals("enqueue")) q.enqueue(Integer.parseInt(w[1]));
                else if (w[0].equals("dequeue")) out = String.valueOf(q.dequeue());
                else if (w[0].equals("front")) out = String.valueOf(q.front());
                else if (w[0].equals("isEmpty")) out = String.valueOf(q.isEmpty());
                else out = String.valueOf(q.size());
            } catch (EmptyQueueException e) {
                out = "\\"error\\"";
            }
            String name = w.length &gt; 1 ? w[0] + "(" + w[1] + ")" : w[0] + "()";
            System.out.printf("%-12s %-9s %s%n", name, out, q);
        }
    }
}</code></pre>
<div class="out">Operation &nbsp;&nbsp;&nbsp;Output &nbsp;&nbsp;&nbsp;Q<br>
enqueue(5) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5)<br>
enqueue(3) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5, 3)<br>
dequeue() &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)<br>
enqueue(7) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3, 7)<br>
dequeue() &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(7)<br>
front() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(7)<br>
dequeue() &nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;()<br>
dequeue() &nbsp;&nbsp;&nbsp;"error" &nbsp;&nbsp;()<br>
isEmpty() &nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;()<br>
enqueue(9) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9)<br>
enqueue(7) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7)<br>
size() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7)<br>
enqueue(3) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7, 3)<br>
enqueue(5) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7, 3, 5)<br>
dequeue() &nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(7, 3, 5)</div>
<ul>
<li>The Q column is written front → rear: <code>(9, 7, 3, 5)</code> means 9 leaves next and 5 arrived last.</li>
<li>Row 8: <code>dequeue()</code> on an empty queue throws <code>EmptyQueueException</code>; the program catches it and prints "error", as the slide does.</li>
<li><code>size()</code> appears in the table (row 12) although slide 4 does not list it — every real queue has it, and the interface of slide 14 includes it.</li>
<li>The slide writes "–" for "no output": <code>enqueue</code> returns nothing; the program prints "-".</li>
</ul>
<p class="dap-an">✅ <strong>One more step:</strong> after the last row, <code>dequeue()</code> would return 7 — it is at the front of (7, 3, 5).</p>
<div class="pitfall">In a trace, write the queue front → rear and keep that direction on every line. Most wrong answers come from reading the list backwards, i.e. treating the queue like a stack.</div>`,
        `<p class="y-chinh">🎯 Bảng trên slide chạy 15 thao tác trên cùng một hàng đợi (queue); chương trình dưới đây chạy lại đúng các thao tác đó và ra khớp từng dòng — kể cả dòng "error" khi dequeue (lấy ra) trên hàng đợi rỗng.</p>
<pre><code class="language-java">import java.util.LinkedList;

class EmptyQueueException extends RuntimeException {}   // tên dùng trên slide 4

class SlideQueue {                             // các thao tác của slide 4-5, dựng trên java.util.LinkedList
    private LinkedList&lt;Integer&gt; h = new LinkedList&lt;Integer&gt;();

    void enqueue(int el) { h.addLast(el); }   // vào cuối
    int dequeue() {                           // lấy ở đầu
        if (h.isEmpty()) throw new EmptyQueueException();
        return h.removeFirst();
    }
    int front() {
        if (h.isEmpty()) throw new EmptyQueueException();
        return h.getFirst();
    }
    boolean isEmpty() { return h.isEmpty(); }
    int size() { return h.size(); }
    public String toString() { String s = h.toString(); return "(" + s.substring(1, s.length() - 1) + ")"; }
}

public class QueueExample {
    public static void main(String[] args) {
        SlideQueue q = new SlideQueue();
        String[] ops = {"enqueue 5", "enqueue 3", "dequeue", "enqueue 7", "dequeue", "front", "dequeue", "dequeue",
                        "isEmpty", "enqueue 9", "enqueue 7", "size", "enqueue 3", "enqueue 5", "dequeue"};
        System.out.println("Operation    Output    Q");
        for (String op : ops) {
            String[] w = op.split(" ");
            String out = "-";
            try {
                if (w[0].equals("enqueue")) q.enqueue(Integer.parseInt(w[1]));
                else if (w[0].equals("dequeue")) out = String.valueOf(q.dequeue());
                else if (w[0].equals("front")) out = String.valueOf(q.front());
                else if (w[0].equals("isEmpty")) out = String.valueOf(q.isEmpty());
                else out = String.valueOf(q.size());
            } catch (EmptyQueueException e) {
                out = "\\"error\\"";
            }
            String name = w.length &gt; 1 ? w[0] + "(" + w[1] + ")" : w[0] + "()";
            System.out.printf("%-12s %-9s %s%n", name, out, q);
        }
    }
}</code></pre>
<div class="out">Operation &nbsp;&nbsp;&nbsp;Output &nbsp;&nbsp;&nbsp;Q<br>
enqueue(5) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5)<br>
enqueue(3) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5, 3)<br>
dequeue() &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)<br>
enqueue(7) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3, 7)<br>
dequeue() &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(7)<br>
front() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(7)<br>
dequeue() &nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;()<br>
dequeue() &nbsp;&nbsp;&nbsp;"error" &nbsp;&nbsp;()<br>
isEmpty() &nbsp;&nbsp;&nbsp;true &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;()<br>
enqueue(9) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9)<br>
enqueue(7) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7)<br>
size() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7)<br>
enqueue(3) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7, 3)<br>
enqueue(5) &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(9, 7, 3, 5)<br>
dequeue() &nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(7, 3, 5)</div>
<ul>
<li>Cột Q được viết từ đầu → cuối hàng (front → rear): <code>(9, 7, 3, 5)</code> nghĩa là 9 sắp ra, còn 5 tới sau cùng.</li>
<li>Dòng 8: <code>dequeue()</code> trên hàng rỗng ném <code>EmptyQueueException</code>; chương trình bắt (catch) nó và in "error" như slide.</li>
<li>Bảng có <code>size()</code> (dòng 12) dù slide 4 không liệt kê — hàng đợi thật nào cũng có, và giao diện (interface) của slide 14 có nó.</li>
<li>Slide ghi "–" cho "không có output": <code>enqueue</code> không trả về gì; chương trình in "-".</li>
</ul>
<p class="dap-an">✅ <strong>Thêm một bước:</strong> sau dòng cuối, <code>dequeue()</code> sẽ trả về 7 — nó đang đứng đầu (7, 3, 5).</p>
<div class="pitfall">Khi lần theo (trace), hãy viết hàng đợi từ đầu → cuối và giữ đúng chiều đó ở mọi dòng. Phần lớn đáp án sai là do đọc ngược danh sách, tức là coi hàng đợi như ngăn xếp (stack).</div>`],
      [6, 'Applications of Queues',
        `<p class="y-chinh">🎯 Queues hold work that cannot be processed immediately but must be processed in arrival order: waiting lists, shared resources such as a printer, multiprogramming — and, indirectly, parts of algorithms and of other structures.</p>
<ul>
<li><strong>Direct</strong>: waiting lists (tickets, bookings); access to a shared resource — a printer, a CPU, a network link; multiprogramming — several programs waiting for the processor (slide 7).</li>
<li><strong>Indirect — auxiliary data structure for algorithms</strong>: breadth-first search (BFS, chapter 5) visits vertices in the order they were discovered, using a queue.</li>
<li><strong>Indirect — component of other data structures</strong>: a buffer between a producer and a consumer; a priority queue built from one FIFO queue per priority level.</li>
<li>The slide's last sentence ("…useful in the following applications:") introduces applications of this FIFO property — the direct and indirect uses listed on the slide.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Queue;

class Job {
    String owner, file;
    int pages;
    Job(String owner, String file, int pages) { this.owner = owner; this.file = file; this.pages = pages; }
}

public class PrinterQueue {
    public static void main(String[] args) {
        Queue&lt;Job&gt; spool = new ArrayDeque&lt;Job&gt;();              // the shared printer's waiting list
        spool.add(new Job("Lan", "report.pdf", 3));
        spool.add(new Job("Minh", "cv.docx", 1));
        spool.add(new Job("Lan", "photo.png", 2));
        spool.add(new Job("Tuan", "slides.pptx", 4));
        System.out.println(spool.size() + " jobs waiting; the printer prints 1 page per minute");
        int clock = 0;
        while (!spool.isEmpty()) {
            Job j = spool.remove();                            // the job that has waited longest
            System.out.printf("minute %2d-%2d  %-5s %s%n", clock, clock + j.pages, j.owner, j.file);
            clock += j.pages;
        }
    }
}</code></pre>
<div class="out">4 jobs waiting; the printer prints 1 page per minute<br>
minute &nbsp;0- 3 &nbsp;Lan &nbsp;&nbsp;report.pdf<br>
minute &nbsp;3- 4 &nbsp;Minh &nbsp;cv.docx<br>
minute &nbsp;4- 6 &nbsp;Lan &nbsp;&nbsp;photo.png<br>
minute &nbsp;6-10 &nbsp;Tuan &nbsp;slides.pptx</div>
<p>Lan's second job waits behind Minh's: the printer serves by arrival, not by owner — nobody jumps the line.</p>
<p class="meo">🧠 <strong>Remember:</strong> queue = fairness. Only a priority queue (slide 17) lets someone jump ahead.</p>`,
        `<p class="y-chinh">🎯 Hàng đợi (queue) giữ những việc chưa thể xử lý ngay nhưng phải xử lý theo thứ tự tới: danh sách chờ, tài nguyên dùng chung như máy in, đa chương trình (multiprogramming) — và gián tiếp, làm một phần của thuật toán và của cấu trúc khác.</p>
<ul>
<li><strong>Trực tiếp (direct)</strong>: danh sách chờ (mua vé, đặt chỗ); truy cập tài nguyên dùng chung (shared resource) — máy in, CPU, đường truyền mạng; đa chương trình — nhiều chương trình cùng chờ bộ xử lý (slide 7).</li>
<li><strong>Gián tiếp — cấu trúc phụ trợ cho thuật toán</strong>: tìm kiếm theo chiều rộng (breadth-first search — BFS, chương 5) thăm các đỉnh theo đúng thứ tự phát hiện ra chúng, nhờ một hàng đợi.</li>
<li><strong>Gián tiếp — thành phần của cấu trúc khác</strong>: bộ đệm (buffer) giữa bên sản xuất và bên tiêu thụ; một hàng đợi ưu tiên (priority queue) dựng từ nhiều hàng đợi FIFO (vào trước ra trước), mỗi mức ưu tiên một hàng.</li>
<li>Câu cuối của slide ("…useful in the following applications:" — nhờ tính chất này mà hàng đợi còn hữu ích trong các ứng dụng sau) giới thiệu các ứng dụng của tính chất FIFO — chính là các ứng dụng trực tiếp và gián tiếp liệt kê trên slide.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Queue;

class Job {
    String owner, file;
    int pages;
    Job(String owner, String file, int pages) { this.owner = owner; this.file = file; this.pages = pages; }
}

public class PrinterQueue {
    public static void main(String[] args) {
        Queue&lt;Job&gt; spool = new ArrayDeque&lt;Job&gt;();              // danh sách chờ của máy in dùng chung
        spool.add(new Job("Lan", "report.pdf", 3));
        spool.add(new Job("Minh", "cv.docx", 1));
        spool.add(new Job("Lan", "photo.png", 2));
        spool.add(new Job("Tuan", "slides.pptx", 4));
        System.out.println(spool.size() + " jobs waiting; the printer prints 1 page per minute");
        int clock = 0;
        while (!spool.isEmpty()) {
            Job j = spool.remove();                            // việc đã chờ lâu nhất
            System.out.printf("minute %2d-%2d  %-5s %s%n", clock, clock + j.pages, j.owner, j.file);
            clock += j.pages;
        }
    }
}</code></pre>
<div class="out">4 jobs waiting; the printer prints 1 page per minute<br>
minute &nbsp;0- 3 &nbsp;Lan &nbsp;&nbsp;report.pdf<br>
minute &nbsp;3- 4 &nbsp;Minh &nbsp;cv.docx<br>
minute &nbsp;4- 6 &nbsp;Lan &nbsp;&nbsp;photo.png<br>
minute &nbsp;6-10 &nbsp;Tuan &nbsp;slides.pptx</div>
<p>Việc in thứ hai của Lan phải chờ sau việc của Minh: máy in phục vụ theo thứ tự tới, không theo người gửi — không ai được chen hàng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> hàng đợi = công bằng. Chỉ hàng đợi ưu tiên (priority queue, slide 17) mới cho phép chen lên trước.</p>`],
      [7, 'Application: Round Robin Schedulers',
        `<p class="y-chinh">🎯 A round-robin scheduler is a queue in a loop — e = Q.dequeue(); service e; Q.enqueue(e) — so every process gets an equal time slice, in circular order.</p>
<ul>
<li>Round-robin (RR) is one of the simplest CPU scheduling algorithms: equal time slices, circular order, no priorities — and <strong>starvation-free</strong>: every process gets its turn.</li>
<li>It is also used for other sharing problems, e.g. scheduling data packets in a network; the name comes from the round-robin principle — everyone takes an equal share in turn.</li>
<li>The slide's three steps: (1) dequeue the next element, (2) service it, (3) enqueue the serviced element. In the program a process that has finished is simply not enqueued again.</li>
</ul>
<p class="nhan">Trace — P1 needs 5 units, P2 needs 2, P3 needs 4; time slice = 2</p>
<table>
<thead><tr><th>Clock</th><th>Dequeued and serviced</th><th>Enqueued again?</th><th>Queue after (front → rear)</th></tr></thead>
<tbody>
<tr><td>2</td><td>P1 runs 2, 3 left</td><td>yes</td><td>P2 P3 P1</td></tr>
<tr><td>4</td><td>P2 runs 2, finished</td><td>no</td><td>P3 P1</td></tr>
<tr><td>6</td><td>P3 runs 2, 2 left</td><td>yes</td><td>P1 P3</td></tr>
<tr><td>8</td><td>P1 runs 2, 1 left</td><td>yes</td><td>P3 P1</td></tr>
<tr><td>10</td><td>P3 runs 2, finished</td><td>no</td><td>P1</td></tr>
<tr><td>11</td><td>P1 runs 1, finished</td><td>no</td><td>(empty)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Queue;

class Proc {
    String name;
    int left;                                         // time units still needed
    Proc(String name, int left) { this.name = name; this.left = left; }
}

public class RoundRobinQueue {
    static String names(Queue&lt;Proc&gt; q) {
        StringBuilder b = new StringBuilder();
        for (Proc p : q) b.append(b.length() &gt; 0 ? " " : "").append(p.name);
        return "[" + b + "]";
    }

    public static void main(String[] args) {
        Queue&lt;Proc&gt; Q = new ArrayDeque&lt;Proc&gt;();
        Q.add(new Proc("P1", 5));
        Q.add(new Proc("P2", 2));
        Q.add(new Proc("P3", 4));
        int slice = 2, clock = 0;
        while (!Q.isEmpty()) {
            Proc e = Q.remove();                      // 1. e = Q.dequeue()
            int run = Math.min(slice, e.left);        // 2. service e for one time slice
            e.left -= run;
            clock += run;
            String what = e.name + " ran " + run + (e.left &gt; 0 ? ", " + e.left + " left" : ", finished");
            if (e.left &gt; 0) Q.add(e);                 // 3. Q.enqueue(e) — only if not finished
            System.out.printf("t=%-3d %-19s queue now %s%n", clock, what, names(Q));
        }
    }
}</code></pre>
<div class="out">t=2 &nbsp;&nbsp;P1 ran 2, 3 left &nbsp;&nbsp;&nbsp;queue now [P2 P3 P1]<br>
t=4 &nbsp;&nbsp;P2 ran 2, finished &nbsp;queue now [P3 P1]<br>
t=6 &nbsp;&nbsp;P3 ran 2, 2 left &nbsp;&nbsp;&nbsp;queue now [P1 P3]<br>
t=8 &nbsp;&nbsp;P1 ran 2, 1 left &nbsp;&nbsp;&nbsp;queue now [P3 P1]<br>
t=10 &nbsp;P3 ran 2, finished &nbsp;queue now [P1]<br>
t=11 &nbsp;P1 ran 1, finished &nbsp;queue now []</div>
<p><strong>Big-O:</strong> each turn is one dequeue and at most one enqueue — O(1). Lesson 1.A (slide 15) produced the same schedule with a circular list and <code>rotate()</code>; slide 13 here explains why <code>rotate()</code> is even cheaper.</p>
<div class="pitfall">Trace traps: a process that has finished is <em>not</em> enqueued again, and the clock advances by the time actually used — P1's last turn takes 1 unit, so it finishes at 11, not 12.</div>`,
        `<p class="y-chinh">🎯 Bộ lập lịch xoay vòng (round-robin scheduler) là một hàng đợi chạy trong vòng lặp — e = Q.dequeue(); phục vụ e; Q.enqueue(e) — nên mỗi tiến trình (process) được một lát thời gian (time slice) bằng nhau, lần lượt theo vòng.</p>
<ul>
<li>Round-robin (RR) là một trong những thuật toán lập lịch CPU đơn giản nhất: lát thời gian bằng nhau, xoay vòng, không có ưu tiên — và <strong>không gây đói (starvation-free)</strong>: tiến trình nào cũng tới lượt.</li>
<li>Nó còn dùng cho các bài toán chia sẻ khác, ví dụ lập lịch gửi gói dữ liệu (data packet) trên mạng; cái tên lấy từ nguyên tắc round-robin — mọi người lần lượt nhận phần bằng nhau.</li>
<li>Ba bước trên slide: (1) dequeue (lấy ra) phần tử kế tiếp, (2) phục vụ nó, (3) enqueue (đưa vào) lại phần tử vừa phục vụ. Trong chương trình, tiến trình đã chạy xong thì không enqueue lại nữa.</li>
</ul>
<p class="nhan">Lần theo — P1 cần 5 đơn vị, P2 cần 2, P3 cần 4; lát thời gian = 2</p>
<table>
<thead><tr><th>Đồng hồ</th><th>Được dequeue và phục vụ</th><th>Enqueue lại?</th><th>Hàng đợi sau đó (đầu → cuối)</th></tr></thead>
<tbody>
<tr><td>2</td><td>P1 chạy 2, còn 3</td><td>có</td><td>P2 P3 P1</td></tr>
<tr><td>4</td><td>P2 chạy 2, xong</td><td>không</td><td>P3 P1</td></tr>
<tr><td>6</td><td>P3 chạy 2, còn 2</td><td>có</td><td>P1 P3</td></tr>
<tr><td>8</td><td>P1 chạy 2, còn 1</td><td>có</td><td>P3 P1</td></tr>
<tr><td>10</td><td>P3 chạy 2, xong</td><td>không</td><td>P1</td></tr>
<tr><td>11</td><td>P1 chạy 1, xong</td><td>không</td><td>(rỗng)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Queue;

class Proc {
    String name;
    int left;                                         // số đơn vị thời gian còn cần chạy
    Proc(String name, int left) { this.name = name; this.left = left; }
}

public class RoundRobinQueue {
    static String names(Queue&lt;Proc&gt; q) {
        StringBuilder b = new StringBuilder();
        for (Proc p : q) b.append(b.length() &gt; 0 ? " " : "").append(p.name);
        return "[" + b + "]";
    }

    public static void main(String[] args) {
        Queue&lt;Proc&gt; Q = new ArrayDeque&lt;Proc&gt;();
        Q.add(new Proc("P1", 5));
        Q.add(new Proc("P2", 2));
        Q.add(new Proc("P3", 4));
        int slice = 2, clock = 0;
        while (!Q.isEmpty()) {
            Proc e = Q.remove();                      // 1. e = Q.dequeue()
            int run = Math.min(slice, e.left);        // 2. phục vụ e trong một lát thời gian
            e.left -= run;
            clock += run;
            String what = e.name + " ran " + run + (e.left &gt; 0 ? ", " + e.left + " left" : ", finished");
            if (e.left &gt; 0) Q.add(e);                 // 3. Q.enqueue(e) — chỉ khi chưa xong
            System.out.printf("t=%-3d %-19s queue now %s%n", clock, what, names(Q));
        }
    }
}</code></pre>
<div class="out">t=2 &nbsp;&nbsp;P1 ran 2, 3 left &nbsp;&nbsp;&nbsp;queue now [P2 P3 P1]<br>
t=4 &nbsp;&nbsp;P2 ran 2, finished &nbsp;queue now [P3 P1]<br>
t=6 &nbsp;&nbsp;P3 ran 2, 2 left &nbsp;&nbsp;&nbsp;queue now [P1 P3]<br>
t=8 &nbsp;&nbsp;P1 ran 2, 1 left &nbsp;&nbsp;&nbsp;queue now [P3 P1]<br>
t=10 &nbsp;P3 ran 2, finished &nbsp;queue now [P1]<br>
t=11 &nbsp;P1 ran 1, finished &nbsp;queue now []</div>
<p><strong>Big-O:</strong> mỗi lượt là một lần dequeue và nhiều nhất một lần enqueue — O(1). Bài 1.A (slide 15) ra đúng lịch này bằng danh sách vòng và <code>rotate()</code>; slide 13 ở đây giải thích vì sao <code>rotate()</code> còn rẻ hơn nữa.</p>
<div class="pitfall">Bẫy khi lần theo (trace): tiến trình đã xong thì <em>không</em> được enqueue lại, và đồng hồ chỉ tăng đúng thời gian thực chạy — lượt cuối của P1 chỉ tốn 1 đơn vị, nên P1 xong ở 11 chứ không phải 12.</div>`],
      [8, 'Array-based Queue - 1',
        `<p class="y-chinh">🎯 An array of size N is used in a circular fashion: first (f) is the index of the front element, last (l) the index of the last one, and both move right and wrap around to 0 — nothing is ever shifted.</p>
<ul>
<li><strong>Why circular?</strong> A naive array queue that shifts everything left on each dequeue costs O(n). Moving the <em>indices</em> instead is O(1) — but they keep moving right, so after cell N − 1 they must continue at cell 0.</li>
<li><strong>Normal configuration</strong>: f ≤ l, the elements sit in f..l. <strong>Wrapped-around configuration</strong>: l &lt; f, the elements sit in f..N−1 and then 0..l.</li>
<li>The next index after i is <code>i == N-1 ? 0 : i+1</code>, which is the same as <code>(i + 1) % N</code>.</li>
</ul>
<p>The slide draws both configurations as pictures; here they are with the lesson's own values, N = 6:</p>
<pre><code class="language-plaintext">normal configuration (f = 1, l = 3)
index:   0    1    2    3    4    5
Q:     [ _ ][ 7 ][ 3 ][ 9 ][ _ ][ _ ]
              f         l
front -&gt; rear: 7 3 9

wrapped-around configuration (f = 4, l = 1)
index:   0    1    2    3    4    5
Q:     [ 2 ][ 6 ][ _ ][ _ ][ 5 ][ 8 ]
              l              f
front -&gt; rear: 5 8 2 6</code></pre>
<p>Number of elements: <code>l - f + 1</code> when f ≤ l, and <code>N - f + l + 1</code> when wrapped (6 − 4 + 1 + 1 = 4 above). The textbook (Goodrich 6e, §6.2.2) keeps f and the size instead of l — another way to tell "full" from "empty".</p>
<div class="pitfall">In the wrapped configuration l &lt; f — that is normal, not a bug. And the logical order is f, f+1, …, N−1, 0, …, l: reading the array from cell 0 gives the wrong order (2 6 5 8 instead of 5 8 2 6).</div>`,
        `<p class="y-chinh">🎯 Dùng một mảng (array) N ô theo kiểu vòng tròn: first (f) là chỉ số (index) của phần tử đầu hàng, last (l) là chỉ số của phần tử cuối hàng, cả hai chỉ tiến sang phải và quay vòng về 0 — không bao giờ phải dời phần tử.</p>
<ul>
<li><strong>Vì sao phải vòng?</strong> Hàng đợi (queue) bằng mảng kiểu "ngây thơ" dời mọi phần tử sang trái mỗi lần dequeue (lấy ra) tốn O(n). Dời <em>chỉ số</em> thay vì dời dữ liệu chỉ tốn O(1) — nhưng chỉ số cứ tiến sang phải mãi, nên sau ô N − 1 phải quay lại ô 0.</li>
<li><strong>Cấu hình thường (normal configuration)</strong>: f ≤ l, các phần tử nằm trong f..l. <strong>Cấu hình đã quay vòng (wrapped-around configuration)</strong>: l &lt; f, các phần tử nằm trong f..N−1 rồi tiếp 0..l.</li>
<li>Chỉ số kế tiếp sau i là <code>i == N-1 ? 0 : i+1</code>, cũng chính là <code>(i + 1) % N</code> (phép chia lấy dư — modulo).</li>
</ul>
<p>Slide vẽ hai cấu hình bằng hình; dưới đây là hai cấu hình đó với giá trị ví dụ của bài, N = 6:</p>
<pre><code class="language-plaintext">cấu hình thường (f = 1, l = 3)
chỉ số:  0    1    2    3    4    5
Q:     [ _ ][ 7 ][ 3 ][ 9 ][ _ ][ _ ]
              f         l
đầu -&gt; cuối: 7 3 9

cấu hình đã quay vòng (f = 4, l = 1)
chỉ số:  0    1    2    3    4    5
Q:     [ 2 ][ 6 ][ _ ][ _ ][ 5 ][ 8 ]
              l              f
đầu -&gt; cuối: 5 8 2 6</code></pre>
<p>Số phần tử: <code>l - f + 1</code> khi f ≤ l, và <code>N - f + l + 1</code> khi đã quay vòng (6 − 4 + 1 + 1 = 4 ở trên). Giáo trình (Goodrich bản 6, §6.2.2) giữ f và số phần tử (size) thay vì l — một cách khác để phân biệt "đầy" với "rỗng".</p>
<div class="pitfall">Ở cấu hình đã quay vòng thì l &lt; f — đó là bình thường, không phải lỗi. Và thứ tự logic là f, f+1, …, N−1, 0, …, l: đọc mảng từ ô 0 sẽ ra sai thứ tự (2 6 5 8 thay vì 5 8 2 6).</div>`],
      [9, 'Array-based Queue - 2',
        `<p class="ghi-chu">This slide is a figure titled "Array-based Queue in detail"; its content could not be extracted as text. The section below teaches what the title announces — how first and last move, operation by operation — on the lesson's own example, with the code of slides 10–11.</p>
<p class="y-chinh">🎯 In detail: enqueue moves last one cell right, dequeue moves first one cell right, both wrap from the last cell to 0, and the queue is full when the cell after last is first.</p>
<p class="nhan">The lesson's own example — capacity 4 (<code>_</code> = a cell that is not part of the queue)</p>
<table>
<thead><tr><th>Operation</th><th>first</th><th>last</th><th>Cells 0–3</th><th>What to notice</th></tr></thead>
<tbody>
<tr><td>start</td><td>-1</td><td>-1</td><td>_ _ _ _</td><td>empty: first = last = -1</td></tr>
<tr><td>enqueue(10)</td><td>0</td><td>0</td><td>10 _ _ _</td><td>the first element sets both indices to 0</td></tr>
<tr><td>enqueue(20), enqueue(30)</td><td>0</td><td>2</td><td>10 20 30 _</td><td>last moves right</td></tr>
<tr><td>dequeue() = 10</td><td>1</td><td>2</td><td>_ 20 30 _</td><td>first moves right; nothing is shifted</td></tr>
<tr><td>dequeue() = 20</td><td>2</td><td>2</td><td>_ _ 30 _</td><td>first == last: one element left</td></tr>
<tr><td>enqueue(40)</td><td>2</td><td>3</td><td>_ _ 30 40</td><td>last = max − 1</td></tr>
<tr><td>enqueue(50)</td><td>2</td><td>0</td><td>50 _ 30 40</td><td>last wraps to 0 → wrapped configuration</td></tr>
<tr><td>dequeue() = 30</td><td>3</td><td>0</td><td>50 _ _ 40</td><td>first = max − 1</td></tr>
<tr><td>dequeue() = 40</td><td>0</td><td>0</td><td>50 _ _ _</td><td>first wraps to 0</td></tr>
<tr><td>enqueue(60), enqueue(70)</td><td>0</td><td>2</td><td>50 60 70 _</td><td></td></tr>
<tr><td>dequeue() = 50</td><td>1</td><td>2</td><td>_ 60 70 _</td><td></td></tr>
<tr><td>enqueue(80)</td><td>1</td><td>3</td><td>_ 60 70 80</td><td></td></tr>
<tr><td>enqueue(90)</td><td>1</td><td>0</td><td>90 60 70 80</td><td>last wraps; first == last + 1 → full</td></tr>
</tbody>
</table>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first=-1 last=-1 max=4 full=false [_ _ _ _]<br>
enqueue(10) &nbsp;&nbsp;first= 0 last= 0 max=4 full=false [10 _ _ _]<br>
enqueue(20) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [10 20 _ _]<br>
enqueue(30) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [10 20 30 _]<br>
dequeue()=10 &nbsp;first= 1 last= 2 max=4 full=false [_ 20 30 _]<br>
dequeue()=20 &nbsp;first= 2 last= 2 max=4 full=false [_ _ 30 _]<br>
enqueue(40) &nbsp;&nbsp;first= 2 last= 3 max=4 full=false [_ _ 30 40]<br>
enqueue(50) &nbsp;&nbsp;first= 2 last= 0 max=4 full=false [50 _ 30 40]<br>
dequeue()=30 &nbsp;first= 3 last= 0 max=4 full=false [50 _ _ 40]<br>
dequeue()=40 &nbsp;first= 0 last= 0 max=4 full=false [50 _ _ _]<br>
enqueue(60) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [50 60 _ _]<br>
enqueue(70) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [50 60 70 _]<br>
dequeue()=50 &nbsp;first= 1 last= 2 max=4 full=false [_ 60 70 _]<br>
enqueue(80) &nbsp;&nbsp;first= 1 last= 3 max=4 full=false [_ 60 70 80]<br>
enqueue(90) &nbsp;&nbsp;first= 1 last= 0 max=4 full=true &nbsp;[90 60 70 80]<br>
enqueue(100) &nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
front()=60 &nbsp;&nbsp;&nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
dequeue() until empty: 60 70 80 90 100<br>
dequeue() on an empty queue -&gt; java.lang.Exception</div>
<p>The output above comes from the program on slide 11 (the slides' own class). Its last lines — the array growing to 6 cells, then emptying — belong to slides 10 and 11.</p>
<p class="meo">🧠 <strong>Remember:</strong> both indices only ever move forward; the queue crawls around the ring like a caterpillar.</p>
<div class="pitfall">Empty means <code>first == -1</code>, not <code>first == last</code>: <code>first == last</code> means exactly <em>one</em> element (row "dequeue() = 20"). And "full" is not <code>last == max-1</code> — in row "enqueue(40)" last is 3 while cells 0 and 1 are free.</div>`,
        `<p class="ghi-chu">Slide này là một hình có tiêu đề "Array-based Queue in detail"; nội dung của nó không trích được thành chữ. Phần dưới đây dạy đúng điều tiêu đề nói — first và last dịch chuyển thế nào qua từng thao tác — trên ví dụ của bài, với code của slide 10–11.</p>
<p class="y-chinh">🎯 Chi tiết: enqueue (đưa vào) đưa last sang phải một ô, dequeue (lấy ra) đưa first sang phải một ô, cả hai quay vòng từ ô cuối về ô 0, và hàng đợi (queue) đầy khi ô ngay sau last chính là first.</p>
<p class="nhan">Ví dụ của bài — sức chứa (capacity) 4 (<code>_</code> = ô không thuộc hàng đợi)</p>
<table>
<thead><tr><th>Thao tác</th><th>first</th><th>last</th><th>Ô 0–3</th><th>Điều cần để ý</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>-1</td><td>-1</td><td>_ _ _ _</td><td>rỗng: first = last = -1</td></tr>
<tr><td>enqueue(10)</td><td>0</td><td>0</td><td>10 _ _ _</td><td>phần tử đầu tiên đặt cả hai chỉ số về 0</td></tr>
<tr><td>enqueue(20), enqueue(30)</td><td>0</td><td>2</td><td>10 20 30 _</td><td>last tiến sang phải</td></tr>
<tr><td>dequeue() = 10</td><td>1</td><td>2</td><td>_ 20 30 _</td><td>first tiến sang phải; không dời phần tử nào</td></tr>
<tr><td>dequeue() = 20</td><td>2</td><td>2</td><td>_ _ 30 _</td><td>first == last: còn một phần tử</td></tr>
<tr><td>enqueue(40)</td><td>2</td><td>3</td><td>_ _ 30 40</td><td>last = max − 1</td></tr>
<tr><td>enqueue(50)</td><td>2</td><td>0</td><td>50 _ 30 40</td><td>last quay về 0 → cấu hình đã quay vòng</td></tr>
<tr><td>dequeue() = 30</td><td>3</td><td>0</td><td>50 _ _ 40</td><td>first = max − 1</td></tr>
<tr><td>dequeue() = 40</td><td>0</td><td>0</td><td>50 _ _ _</td><td>first quay về 0</td></tr>
<tr><td>enqueue(60), enqueue(70)</td><td>0</td><td>2</td><td>50 60 70 _</td><td></td></tr>
<tr><td>dequeue() = 50</td><td>1</td><td>2</td><td>_ 60 70 _</td><td></td></tr>
<tr><td>enqueue(80)</td><td>1</td><td>3</td><td>_ 60 70 80</td><td></td></tr>
<tr><td>enqueue(90)</td><td>1</td><td>0</td><td>90 60 70 80</td><td>last quay vòng; first == last + 1 → đầy</td></tr>
</tbody>
</table>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first=-1 last=-1 max=4 full=false [_ _ _ _]<br>
enqueue(10) &nbsp;&nbsp;first= 0 last= 0 max=4 full=false [10 _ _ _]<br>
enqueue(20) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [10 20 _ _]<br>
enqueue(30) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [10 20 30 _]<br>
dequeue()=10 &nbsp;first= 1 last= 2 max=4 full=false [_ 20 30 _]<br>
dequeue()=20 &nbsp;first= 2 last= 2 max=4 full=false [_ _ 30 _]<br>
enqueue(40) &nbsp;&nbsp;first= 2 last= 3 max=4 full=false [_ _ 30 40]<br>
enqueue(50) &nbsp;&nbsp;first= 2 last= 0 max=4 full=false [50 _ 30 40]<br>
dequeue()=30 &nbsp;first= 3 last= 0 max=4 full=false [50 _ _ 40]<br>
dequeue()=40 &nbsp;first= 0 last= 0 max=4 full=false [50 _ _ _]<br>
enqueue(60) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [50 60 _ _]<br>
enqueue(70) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [50 60 70 _]<br>
dequeue()=50 &nbsp;first= 1 last= 2 max=4 full=false [_ 60 70 _]<br>
enqueue(80) &nbsp;&nbsp;first= 1 last= 3 max=4 full=false [_ 60 70 80]<br>
enqueue(90) &nbsp;&nbsp;first= 1 last= 0 max=4 full=true &nbsp;[90 60 70 80]<br>
enqueue(100) &nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
front()=60 &nbsp;&nbsp;&nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
dequeue() until empty: 60 70 80 90 100<br>
dequeue() on an empty queue -&gt; java.lang.Exception</div>
<p>Output trên là của chương trình ở slide 11 (dùng đúng lớp của slide). Mấy dòng cuối — mảng nới lên 6 ô rồi lấy ra hết — thuộc về slide 10 và 11.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cả hai chỉ số chỉ đi tới, không bao giờ lùi; hàng đợi "bò" quanh vòng tròn như con sâu đo.</p>
<div class="pitfall">Rỗng nghĩa là <code>first == -1</code>, không phải <code>first == last</code>: <code>first == last</code> nghĩa là còn đúng <em>một</em> phần tử (dòng "dequeue() = 20"). Còn "đầy" không phải là <code>last == max-1</code> — ở dòng "enqueue(40)", last là 3 trong khi ô 0 và 1 vẫn trống.</div>`],
      [10, 'Array implementation of a queue - 1',
        `<p class="y-chinh">🎯 The slide's ArrayQueue keeps a, max, first and last (-1 when empty); isFull has two cases, and grow() copies the elements in queue order into a bigger array — and this time it does update max.</p>
<pre><code class="language-java">protected Object[] a;
protected int max;
protected int first, last;

public ArrayQueue() { this(10); }
public ArrayQueue(int max1) {
    max = max1;
    a = new Object[max];
    first = last = -1;
}
public boolean isEmpty() { return (first == -1); }
public boolean isFull() { return ((first == 0 &amp;&amp; last == max - 1) || first == last + 1); }
private boolean grow() {
    int i, j;
    int max1 = max + max / 2;
    Object[] a1 = new Object[max1];
    if (a1 == null) return (false);
    if (last &gt;= first)                          // normal configuration: one block
        for (i = first; i &lt;= last; i++) a1[i - first] = a[i];
    else {                                      // wrapped around: two blocks
        for (i = first; i &lt; max; i++) a1[i - first] = a[i];
        i = max - first;
        for (j = 0; j &lt;= last; j++) a1[i + j] = a[j];
    }
    a = a1;
    first = 0;
    last = max - 1;
    max = max1;                                 // here max IS updated
    return (true);
}</code></pre>
<ul>
<li><code>isEmpty()</code>: <code>first == -1</code>. <code>isFull()</code>: <code>first == 0 &amp;&amp; last == max-1</code> (normal configuration using every cell) or <code>first == last+1</code> (wrapped: the rear has caught up with the front).</li>
<li><code>grow()</code>: a new array of <code>max + max/2</code> cells; normal configuration → one block <code>a[first..last]</code>; wrapped → two blocks, <code>a[first..max-1]</code> then <code>a[0..last]</code>; then <code>first = 0</code>, <code>last = max - 1</code> (the old max), <code>max = max1</code>.</li>
<li>Unlike the <code>ArrayStack</code> of deck 2A and the priority queue of slide 18, this <code>grow()</code> <strong>does</strong> set <code>max = max1</code>, so the queue keeps working after it grows.</li>
</ul>
<p class="nhan">The grow() of the output line enqueue(100), drawn cell by cell</p>
<pre><code class="language-plaintext">before: max = 4, first = 1, last = 0 (wrapped and full)
index:   0     1     2     3
a:     [ 90 ][ 60 ][ 70 ][ 80 ]
          l     f

max1 = 4 + 4/2 = 6
block 1: a[1..3] = 60 70 80  -&gt;  a1[0..2]
block 2: a[0..0] = 90        -&gt;  a1[3]        (i = max - first = 3)

index:   0     1     2     3     4     5
a1:    [ 60 ][ 70 ][ 80 ][ 90 ][  _ ][  _ ]
          f                 l                 first = 0, last = 3, max = 6
then enqueue(100) writes a[++last] = a[4]</code></pre>
<div class="pitfall">A plain <code>for (i = 0; i &lt; max; i++) a1[i] = a[i];</code> copies the wrapped queue in <em>physical</em> order 90 60 70 80, so the front would no longer be at <code>first = 0</code> — that is why <code>grow()</code> has two branches. Also: <code>max + max/2</code> adds nothing when max = 1 (a test run of the slide's class with <code>ArrayQueue(1)</code> silently overwrote the first element), and <code>if (a1 == null)</code> is never true.</div>
<p><strong>Big-O:</strong> <code>isEmpty</code>, <code>isFull</code> O(1); <code>grow()</code> copies n elements, O(n) — but after growing to capacity c it cannot run again before c/2 more enqueues, and the capacities grow geometrically, so all the copies over n enqueues total fewer than 3n: enqueue stays O(1) amortized.</p>`,
        `<p class="y-chinh">🎯 ArrayQueue của slide giữ a, max, first và last (bằng -1 khi rỗng); isFull có hai trường hợp, và grow() chép các phần tử theo đúng thứ tự hàng đợi sang mảng lớn hơn — lần này có cập nhật max.</p>
<pre><code class="language-java">protected Object[] a;
protected int max;
protected int first, last;

public ArrayQueue() { this(10); }
public ArrayQueue(int max1) {
    max = max1;
    a = new Object[max];
    first = last = -1;
}
public boolean isEmpty() { return (first == -1); }
public boolean isFull() { return ((first == 0 &amp;&amp; last == max - 1) || first == last + 1); }
private boolean grow() {
    int i, j;
    int max1 = max + max / 2;
    Object[] a1 = new Object[max1];
    if (a1 == null) return (false);
    if (last &gt;= first)                          // cấu hình thường: một khối
        for (i = first; i &lt;= last; i++) a1[i - first] = a[i];
    else {                                      // đã quay vòng: hai khối
        for (i = first; i &lt; max; i++) a1[i - first] = a[i];
        i = max - first;
        for (j = 0; j &lt;= last; j++) a1[i + j] = a[j];
    }
    a = a1;
    first = 0;
    last = max - 1;
    max = max1;                                 // ở đây max CÓ được cập nhật
    return (true);
}</code></pre>
<ul>
<li><code>isEmpty()</code> (rỗng?): <code>first == -1</code>. <code>isFull()</code> (đầy?): <code>first == 0 &amp;&amp; last == max-1</code> (cấu hình thường, dùng hết mọi ô) hoặc <code>first == last+1</code> (đã quay vòng: cuối hàng đuổi kịp đầu hàng).</li>
<li><code>grow()</code> (nới rộng): tạo mảng mới <code>max + max/2</code> ô; cấu hình thường → chép một khối <code>a[first..last]</code>; đã quay vòng → chép hai khối, <code>a[first..max-1]</code> rồi <code>a[0..last]</code>; sau đó <code>first = 0</code>, <code>last = max - 1</code> (max cũ), <code>max = max1</code>.</li>
<li>Khác với <code>ArrayStack</code> của bộ slide 2A và hàng đợi ưu tiên ở slide 18, <code>grow()</code> này <strong>có</strong> gán <code>max = max1</code>, nên hàng đợi vẫn chạy đúng sau khi nới.</li>
</ul>
<p class="nhan">grow() ở dòng output enqueue(100), vẽ lại từng ô</p>
<pre><code class="language-plaintext">trước: max = 4, first = 1, last = 0 (đã quay vòng và đầy)
chỉ số:  0     1     2     3
a:     [ 90 ][ 60 ][ 70 ][ 80 ]
          l     f

max1 = 4 + 4/2 = 6
khối 1: a[1..3] = 60 70 80  -&gt;  a1[0..2]
khối 2: a[0..0] = 90        -&gt;  a1[3]        (i = max - first = 3)

chỉ số:  0     1     2     3     4     5
a1:    [ 60 ][ 70 ][ 80 ][ 90 ][  _ ][  _ ]
          f                 l                first = 0, last = 3, max = 6
sau đó enqueue(100) ghi vào a[++last] = a[4]</code></pre>
<div class="pitfall">Chép thẳng <code>for (i = 0; i &lt; max; i++) a1[i] = a[i];</code> sẽ chép hàng đợi đã quay vòng theo thứ tự <em>vật lý</em> 90 60 70 80, khi đó phần tử đầu hàng không còn nằm ở <code>first = 0</code> — vì vậy <code>grow()</code> mới cần hai nhánh. Thêm nữa: <code>max + max/2</code> không thêm được ô nào khi max = 1 (chạy thử lớp của slide với <code>ArrayQueue(1)</code> thì phần tử đầu tiên bị ghi đè mà không báo lỗi gì), và <code>if (a1 == null)</code> không bao giờ đúng.</div>
<p><strong>Big-O:</strong> <code>isEmpty</code>, <code>isFull</code> là O(1); <code>grow()</code> chép n phần tử, O(n) — nhưng sau khi nới lên sức chứa c, phải thêm c/2 lần enqueue nữa mới nới lần sau, và sức chứa tăng theo cấp số nhân, nên tổng số lần chép qua n lần enqueue ít hơn 3n: enqueue vẫn là O(1) khấu hao (amortized — tính trung bình trên cả dãy thao tác).</p>`],
      [11, 'Array implementation of a queue - 2',
        `<p class="y-chinh">🎯 enqueue writes into the cell after last (wrapping to 0), dequeue reads a[first] and moves first forward (wrapping to 0, or resetting both indices to -1 when the last element leaves) — O(1) each.</p>
<pre><code class="language-java">class ArrayQueue {                               // the slides' code, slides 10 and 11
    protected Object[] a;
    protected int max;
    protected int first, last;

    public ArrayQueue() { this(10); }
    public ArrayQueue(int max1) {
        max = max1;
        a = new Object[max];
        first = last = -1;
    }
    public boolean isEmpty() { return (first == -1); }
    public boolean isFull() { return ((first == 0 &amp;&amp; last == max - 1) || first == last + 1); }
    private boolean grow() {
        int i, j;
        int max1 = max + max / 2;
        Object[] a1 = new Object[max1];
        if (a1 == null) return (false);
        if (last &gt;= first)                          // normal configuration: one block
            for (i = first; i &lt;= last; i++) a1[i - first] = a[i];
        else {                                      // wrapped around: two blocks
            for (i = first; i &lt; max; i++) a1[i - first] = a[i];
            i = max - first;
            for (j = 0; j &lt;= last; j++) a1[i + j] = a[j];
        }
        a = a1;
        first = 0;
        last = max - 1;
        max = max1;                                 // here max IS updated
        return (true);
    }
    void enqueue(Object x) {
        if (isFull() &amp;&amp; !grow()) return;
        if (last == max - 1 || last == -1) {        // wrap to cell 0, or the first element
            a[0] = x; last = 0;
            if (first == -1) first = 0;
        } else a[++last] = x;
    }
    Object front() throws Exception {
        if (isEmpty()) throw new Exception();
        return (a[first]);
    }
    public Object dequeue() throws Exception {
        if (isEmpty()) throw new Exception();
        Object x = a[first];
        if (first == last) { first = last = -1; }   // only one element
        else if (first == max - 1) first = 0;
        else first++;
        return (x);
    }
}

public class ArrayQueueTrace {
    static void show(ArrayQueue q, String op) {       // "_" = a cell that is not in the queue
        StringBuilder b = new StringBuilder();
        for (int i = 0; i &lt; q.max; i++) {
            boolean in = q.first != -1 &amp;&amp; (q.first &lt;= q.last ? i &gt;= q.first &amp;&amp; i &lt;= q.last : i &gt;= q.first || i &lt;= q.last);
            b.append(i &gt; 0 ? " " : "").append(in ? q.a[i] : "_");
        }
        System.out.printf("%-13s first=%2d last=%2d max=%d full=%-5b [%s]%n", op, q.first, q.last, q.max, q.isFull(), b);
    }

    public static void main(String[] args) throws Exception {
        ArrayQueue q = new ArrayQueue(4);
        show(q, "start");
        int[] script = {10, 20, 30, 0, 0, 40, 50, 0, 0, 60, 70, 0, 80, 90, 100};   // 0 = dequeue()
        for (int x : script) {
            if (x == 0) { Object v = q.dequeue(); show(q, "dequeue()=" + v); }
            else { q.enqueue(x); show(q, "enqueue(" + x + ")"); }
        }
        show(q, "front()=" + q.front());
        StringBuilder all = new StringBuilder();
        while (!q.isEmpty()) all.append(' ').append(q.dequeue());
        System.out.println("dequeue() until empty:" + all);
        try { q.dequeue(); } catch (Exception e) { System.out.println("dequeue() on an empty queue -&gt; " + e); }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first=-1 last=-1 max=4 full=false [_ _ _ _]<br>
enqueue(10) &nbsp;&nbsp;first= 0 last= 0 max=4 full=false [10 _ _ _]<br>
enqueue(20) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [10 20 _ _]<br>
enqueue(30) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [10 20 30 _]<br>
dequeue()=10 &nbsp;first= 1 last= 2 max=4 full=false [_ 20 30 _]<br>
dequeue()=20 &nbsp;first= 2 last= 2 max=4 full=false [_ _ 30 _]<br>
enqueue(40) &nbsp;&nbsp;first= 2 last= 3 max=4 full=false [_ _ 30 40]<br>
enqueue(50) &nbsp;&nbsp;first= 2 last= 0 max=4 full=false [50 _ 30 40]<br>
dequeue()=30 &nbsp;first= 3 last= 0 max=4 full=false [50 _ _ 40]<br>
dequeue()=40 &nbsp;first= 0 last= 0 max=4 full=false [50 _ _ _]<br>
enqueue(60) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [50 60 _ _]<br>
enqueue(70) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [50 60 70 _]<br>
dequeue()=50 &nbsp;first= 1 last= 2 max=4 full=false [_ 60 70 _]<br>
enqueue(80) &nbsp;&nbsp;first= 1 last= 3 max=4 full=false [_ 60 70 80]<br>
enqueue(90) &nbsp;&nbsp;first= 1 last= 0 max=4 full=true &nbsp;[90 60 70 80]<br>
enqueue(100) &nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
front()=60 &nbsp;&nbsp;&nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
dequeue() until empty: 60 70 80 90 100<br>
dequeue() on an empty queue -&gt; java.lang.Exception</div>
<table>
<thead><tr><th>Method</th><th>Case</th><th>Code</th><th>Seen in the output at</th></tr></thead>
<tbody>
<tr><td><code>enqueue</code></td><td>queue full</td><td><code>grow()</code> first</td><td>enqueue(100)</td></tr>
<tr><td><code>enqueue</code></td><td>empty (<code>last == -1</code>)</td><td><code>a[0] = x; last = 0; first = 0;</code></td><td>enqueue(10)</td></tr>
<tr><td><code>enqueue</code></td><td><code>last == max-1</code></td><td>wrap: <code>a[0] = x; last = 0;</code></td><td>enqueue(50), enqueue(90)</td></tr>
<tr><td><code>enqueue</code></td><td>otherwise</td><td><code>a[++last] = x;</code></td><td>enqueue(20), enqueue(60)</td></tr>
<tr><td><code>dequeue</code></td><td>one element (<code>first == last</code>)</td><td><code>first = last = -1;</code></td><td>the last value of "until empty"</td></tr>
<tr><td><code>dequeue</code></td><td><code>first == max-1</code></td><td>wrap: <code>first = 0;</code></td><td>dequeue()=40</td></tr>
<tr><td><code>dequeue</code></td><td>otherwise</td><td><code>first++;</code></td><td>dequeue()=10</td></tr>
<tr><td><code>front</code> / <code>dequeue</code></td><td>empty queue</td><td><code>throw new Exception();</code></td><td>the last line</td></tr>
</tbody>
</table>
<ul>
<li><code>dequeue()</code> does not clear <code>a[first]</code> — the old value stays in the cell but is outside the queue (printed as <code>_</code>), like the popped cells of the array stack.</li>
<li><strong>Big-O:</strong> each branch does a constant amount of work → O(1); only the enqueue that calls <code>grow()</code> is O(n).</li>
</ul>
<p>The textbook's version (lesson 2.2) keeps the front index and the size instead of first/last: the next free cell is <code>(f + size) % N</code>, which removes every -1 special case.</p>
<p class="meo">🧠 <strong>Remember:</strong> enqueue only touches last, dequeue only touches first — each index belongs to one end of the line.</p>
<div class="pitfall"><code>throw new Exception()</code> is a <em>checked</em> exception: every caller of <code>front()</code>/<code>dequeue()</code> must catch it or declare <code>throws Exception</code> — that is why this program's <code>main</code> says <code>throws Exception</code>. A specific unchecked exception, such as slide 4's <code>EmptyQueueException extends RuntimeException</code>, is cleaner and cannot be confused with other errors.</div>`,
        `<p class="y-chinh">🎯 enqueue (đưa vào) ghi vào ô ngay sau last (quay vòng về 0), dequeue (lấy ra) đọc a[first] rồi đưa first tiến lên (quay vòng về 0, hoặc đặt lại cả hai chỉ số về -1 khi phần tử cuối cùng rời hàng) — mỗi thao tác O(1).</p>
<pre><code class="language-java">class ArrayQueue {                               // code của slide 10 và 11
    protected Object[] a;
    protected int max;
    protected int first, last;

    public ArrayQueue() { this(10); }
    public ArrayQueue(int max1) {
        max = max1;
        a = new Object[max];
        first = last = -1;
    }
    public boolean isEmpty() { return (first == -1); }
    public boolean isFull() { return ((first == 0 &amp;&amp; last == max - 1) || first == last + 1); }
    private boolean grow() {
        int i, j;
        int max1 = max + max / 2;
        Object[] a1 = new Object[max1];
        if (a1 == null) return (false);
        if (last &gt;= first)                          // cấu hình thường: một khối
            for (i = first; i &lt;= last; i++) a1[i - first] = a[i];
        else {                                      // đã quay vòng: hai khối
            for (i = first; i &lt; max; i++) a1[i - first] = a[i];
            i = max - first;
            for (j = 0; j &lt;= last; j++) a1[i + j] = a[j];
        }
        a = a1;
        first = 0;
        last = max - 1;
        max = max1;                                 // ở đây max CÓ được cập nhật
        return (true);
    }
    void enqueue(Object x) {
        if (isFull() &amp;&amp; !grow()) return;
        if (last == max - 1 || last == -1) {        // quay về ô 0, hoặc phần tử đầu tiên
            a[0] = x; last = 0;
            if (first == -1) first = 0;
        } else a[++last] = x;
    }
    Object front() throws Exception {
        if (isEmpty()) throw new Exception();
        return (a[first]);
    }
    public Object dequeue() throws Exception {
        if (isEmpty()) throw new Exception();
        Object x = a[first];
        if (first == last) { first = last = -1; }   // chỉ còn một phần tử
        else if (first == max - 1) first = 0;
        else first++;
        return (x);
    }
}

public class ArrayQueueTrace {
    static void show(ArrayQueue q, String op) {       // "_" = ô không thuộc hàng đợi
        StringBuilder b = new StringBuilder();
        for (int i = 0; i &lt; q.max; i++) {
            boolean in = q.first != -1 &amp;&amp; (q.first &lt;= q.last ? i &gt;= q.first &amp;&amp; i &lt;= q.last : i &gt;= q.first || i &lt;= q.last);
            b.append(i &gt; 0 ? " " : "").append(in ? q.a[i] : "_");
        }
        System.out.printf("%-13s first=%2d last=%2d max=%d full=%-5b [%s]%n", op, q.first, q.last, q.max, q.isFull(), b);
    }

    public static void main(String[] args) throws Exception {
        ArrayQueue q = new ArrayQueue(4);
        show(q, "start");
        int[] script = {10, 20, 30, 0, 0, 40, 50, 0, 0, 60, 70, 0, 80, 90, 100};   // 0 = dequeue()
        for (int x : script) {
            if (x == 0) { Object v = q.dequeue(); show(q, "dequeue()=" + v); }
            else { q.enqueue(x); show(q, "enqueue(" + x + ")"); }
        }
        show(q, "front()=" + q.front());
        StringBuilder all = new StringBuilder();
        while (!q.isEmpty()) all.append(' ').append(q.dequeue());
        System.out.println("dequeue() until empty:" + all);
        try { q.dequeue(); } catch (Exception e) { System.out.println("dequeue() on an empty queue -&gt; " + e); }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first=-1 last=-1 max=4 full=false [_ _ _ _]<br>
enqueue(10) &nbsp;&nbsp;first= 0 last= 0 max=4 full=false [10 _ _ _]<br>
enqueue(20) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [10 20 _ _]<br>
enqueue(30) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [10 20 30 _]<br>
dequeue()=10 &nbsp;first= 1 last= 2 max=4 full=false [_ 20 30 _]<br>
dequeue()=20 &nbsp;first= 2 last= 2 max=4 full=false [_ _ 30 _]<br>
enqueue(40) &nbsp;&nbsp;first= 2 last= 3 max=4 full=false [_ _ 30 40]<br>
enqueue(50) &nbsp;&nbsp;first= 2 last= 0 max=4 full=false [50 _ 30 40]<br>
dequeue()=30 &nbsp;first= 3 last= 0 max=4 full=false [50 _ _ 40]<br>
dequeue()=40 &nbsp;first= 0 last= 0 max=4 full=false [50 _ _ _]<br>
enqueue(60) &nbsp;&nbsp;first= 0 last= 1 max=4 full=false [50 60 _ _]<br>
enqueue(70) &nbsp;&nbsp;first= 0 last= 2 max=4 full=false [50 60 70 _]<br>
dequeue()=50 &nbsp;first= 1 last= 2 max=4 full=false [_ 60 70 _]<br>
enqueue(80) &nbsp;&nbsp;first= 1 last= 3 max=4 full=false [_ 60 70 80]<br>
enqueue(90) &nbsp;&nbsp;first= 1 last= 0 max=4 full=true &nbsp;[90 60 70 80]<br>
enqueue(100) &nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
front()=60 &nbsp;&nbsp;&nbsp;first= 0 last= 4 max=6 full=false [60 70 80 90 100 _]<br>
dequeue() until empty: 60 70 80 90 100<br>
dequeue() on an empty queue -&gt; java.lang.Exception</div>
<table>
<thead><tr><th>Phương thức</th><th>Trường hợp</th><th>Code</th><th>Thấy trong output ở</th></tr></thead>
<tbody>
<tr><td><code>enqueue</code></td><td>hàng đầy</td><td>gọi <code>grow()</code> trước</td><td>enqueue(100)</td></tr>
<tr><td><code>enqueue</code></td><td>rỗng (<code>last == -1</code>)</td><td><code>a[0] = x; last = 0; first = 0;</code></td><td>enqueue(10)</td></tr>
<tr><td><code>enqueue</code></td><td><code>last == max-1</code></td><td>quay vòng: <code>a[0] = x; last = 0;</code></td><td>enqueue(50), enqueue(90)</td></tr>
<tr><td><code>enqueue</code></td><td>còn lại</td><td><code>a[++last] = x;</code></td><td>enqueue(20), enqueue(60)</td></tr>
<tr><td><code>dequeue</code></td><td>một phần tử (<code>first == last</code>)</td><td><code>first = last = -1;</code></td><td>giá trị cuối của dòng "until empty"</td></tr>
<tr><td><code>dequeue</code></td><td><code>first == max-1</code></td><td>quay vòng: <code>first = 0;</code></td><td>dequeue()=40</td></tr>
<tr><td><code>dequeue</code></td><td>còn lại</td><td><code>first++;</code></td><td>dequeue()=10</td></tr>
<tr><td><code>front</code> / <code>dequeue</code></td><td>hàng rỗng</td><td><code>throw new Exception();</code></td><td>dòng cuối cùng</td></tr>
</tbody>
</table>
<ul>
<li><code>dequeue()</code> không xoá <code>a[first]</code> — giá trị cũ vẫn nằm trong ô nhưng đã ở ngoài hàng đợi (in ra là <code>_</code>), giống các ô đã lấy ra (pop) của ngăn xếp (stack) bằng mảng.</li>
<li><strong>Big-O:</strong> nhánh nào cũng chỉ làm một lượng việc cố định → O(1); chỉ lần enqueue phải gọi <code>grow()</code> mới là O(n).</li>
</ul>
<p>Bản trong giáo trình (bài 2.2) giữ chỉ số đầu hàng và số phần tử (size) thay cho first/last: ô trống kế tiếp là <code>(f + size) % N</code>, nhờ vậy bỏ được mọi trường hợp đặc biệt với -1.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> enqueue chỉ đụng tới last, dequeue chỉ đụng tới first — mỗi chỉ số thuộc về một đầu của hàng.</p>
<div class="pitfall"><code>throw new Exception()</code> là ngoại lệ <em>có kiểm tra (checked exception)</em>: mọi nơi gọi <code>front()</code>/<code>dequeue()</code> phải bắt (catch) nó hoặc khai báo <code>throws Exception</code> — vì vậy <code>main</code> của chương trình này ghi <code>throws Exception</code>. Một ngoại lệ không kiểm tra (unchecked) riêng, như <code>EmptyQueueException extends RuntimeException</code> của slide 4, gọn hơn và không lẫn với các lỗi khác.</div>`],
      [12, 'Linked list implementation of a queue',
        `<p class="y-chinh">🎯 With a singly linked list the front is head and the rear is tail: enqueue appends after tail, dequeue removes head — both O(1); when the last element leaves, tail must become null too.</p>
<ul>
<li><code>enqueue(x)</code>: empty → <code>head = tail = new Node(x)</code>; otherwise <code>tail.next = new Node(x); tail = tail.next;</code>.</li>
<li><code>dequeue()</code>: <code>x = head.info; head = head.next;</code> and, if the queue just became empty, <code>tail = null</code>.</li>
<li>Why remove at head and add at tail, not the other way round? Deleting the tail of a singly linked list is O(n) (deck 1, slide 12); deleting the head and appending after the tail are both O(1).</li>
</ul>
<pre><code class="language-java">class Node {
    public Object info;
    public Node next;
    public Node(Object x, Node p) { info = x; next = p; }
    public Node(Object x) { this(x, null); }
}

class MyQueue {                                   // the slide's code
    protected Node head, tail;
    public MyQueue() { head = tail = null; }
    public boolean isEmpty() { return (head == null); }
    Object front() throws Exception {
        if (isEmpty()) throw new Exception();
        return (head.info);
    }
    public Object dequeue() throws Exception {
        if (isEmpty()) throw new Exception();
        Object x = head.info;
        head = head.next;
        if (head == null) tail = null;            // the queue became empty
        return (x);
    }
    void enqueue(Object x) {
        if (isEmpty())
            head = tail = new Node(x);
        else {
            tail.next = new Node(x);
            tail = tail.next;
        }
    }
}

class BadQueue {                                  // a typical student version with two slips
    Node head, tail;
    boolean isEmpty() { return head == null; }
    void enqueue(Object x) {
        Node q = new Node(x);
        if (tail == null) head = tail = q;        // tests tail instead of head
        else { tail.next = q; tail = q; }
    }
    Object dequeue() {
        Object x = head.info;
        head = head.next;                         // forgets: if (head == null) tail = null;
        return x;
    }
}

public class MyQueueDemo {
    static String show(Node head, Node tail) {
        StringBuilder b = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) b.append(" -&gt; ").append(p.info);
        return b + " -&gt; null   (tail = " + (tail == null ? "null" : String.valueOf(tail.info)) + ")";
    }

    public static void main(String[] args) throws Exception {
        MyQueue q = new MyQueue();
        for (int x = 1; x &lt;= 3; x++) { q.enqueue(x); System.out.println("enqueue(" + x + "): " + show(q.head, q.tail)); }
        System.out.println("front() = " + q.front());
        while (!q.isEmpty()) { Object x = q.dequeue(); System.out.println("dequeue() = " + x + ": " + show(q.head, q.tail)); }
        q.enqueue(4);
        System.out.println("enqueue(4): " + show(q.head, q.tail));
        BadQueue b = new BadQueue();
        b.enqueue(1); b.dequeue(); b.enqueue(2);
        System.out.println("BadQueue: enqueue(1), dequeue(), enqueue(2) -&gt; isEmpty() = " + b.isEmpty() + ", the 2 is lost");
    }
}</code></pre>
<div class="out">enqueue(1): head -&gt; 1 -&gt; null &nbsp;&nbsp;(tail = 1)<br>
enqueue(2): head -&gt; 1 -&gt; 2 -&gt; null &nbsp;&nbsp;(tail = 2)<br>
enqueue(3): head -&gt; 1 -&gt; 2 -&gt; 3 -&gt; null &nbsp;&nbsp;(tail = 3)<br>
front() = 1<br>
dequeue() = 1: head -&gt; 2 -&gt; 3 -&gt; null &nbsp;&nbsp;(tail = 3)<br>
dequeue() = 2: head -&gt; 3 -&gt; null &nbsp;&nbsp;(tail = 3)<br>
dequeue() = 3: head -&gt; null &nbsp;&nbsp;(tail = null)<br>
enqueue(4): head -&gt; 4 -&gt; null &nbsp;&nbsp;(tail = 4)<br>
BadQueue: enqueue(1), dequeue(), enqueue(2) -&gt; isEmpty() = true, the 2 is lost</div>
<ul>
<li>Last line: <code>BadQueue</code> tests <code>tail == null</code> in <code>enqueue</code> and forgets <code>tail = null</code> in <code>dequeue</code>. After the queue empties, <code>tail</code> still points to the old node, so <code>enqueue(2)</code> links 2 behind a node that is no longer in the queue while <code>head</code> stays <code>null</code> — the 2 is lost.</li>
<li>The slide's <code>MyQueue</code> tests <code>isEmpty()</code> (that is, <code>head</code>) in <code>enqueue</code>, so it would survive that slip — but <code>tail = null</code> keeps the rule "empty ⇔ head == null and tail == null" true for every other method.</li>
</ul>
<div class="pitfall">After every dequeue ask: did the queue just become empty? If yes, <code>tail = null</code>. Forgetting it is the classic linked-queue bug of the PE.</div>`,
        `<p class="y-chinh">🎯 Với danh sách liên kết đơn (singly linked list), đầu hàng đợi (queue) là head (nút đầu) và cuối hàng là tail (nút cuối): enqueue (đưa vào) nối vào sau tail, dequeue (lấy ra) gỡ head — cả hai O(1); khi phần tử cuối cùng rời hàng thì tail cũng phải về null.</p>
<ul>
<li><code>enqueue(x)</code>: hàng rỗng → <code>head = tail = new Node(x)</code>; ngược lại <code>tail.next = new Node(x); tail = tail.next;</code>.</li>
<li><code>dequeue()</code>: <code>x = head.info; head = head.next;</code> và nếu hàng vừa rỗng thì <code>tail = null</code>.</li>
<li>Vì sao lấy ra ở head và thêm vào ở tail, chứ không ngược lại? Xoá nút cuối (tail) của danh sách liên kết đơn tốn O(n) (bộ slide 1, slide 12); còn xoá head và nối sau tail đều O(1).</li>
</ul>
<pre><code class="language-java">class Node {
    public Object info;
    public Node next;
    public Node(Object x, Node p) { info = x; next = p; }
    public Node(Object x) { this(x, null); }
}

class MyQueue {                                   // code của slide
    protected Node head, tail;
    public MyQueue() { head = tail = null; }
    public boolean isEmpty() { return (head == null); }
    Object front() throws Exception {
        if (isEmpty()) throw new Exception();
        return (head.info);
    }
    public Object dequeue() throws Exception {
        if (isEmpty()) throw new Exception();
        Object x = head.info;
        head = head.next;
        if (head == null) tail = null;            // hàng đợi vừa rỗng
        return (x);
    }
    void enqueue(Object x) {
        if (isEmpty())
            head = tail = new Node(x);
        else {
            tail.next = new Node(x);
            tail = tail.next;
        }
    }
}

class BadQueue {                                  // bản sinh viên hay viết, có hai chỗ sơ ý
    Node head, tail;
    boolean isEmpty() { return head == null; }
    void enqueue(Object x) {
        Node q = new Node(x);
        if (tail == null) head = tail = q;        // kiểm tra tail thay vì head
        else { tail.next = q; tail = q; }
    }
    Object dequeue() {
        Object x = head.info;
        head = head.next;                         // quên: if (head == null) tail = null;
        return x;
    }
}

public class MyQueueDemo {
    static String show(Node head, Node tail) {
        StringBuilder b = new StringBuilder("head");
        for (Node p = head; p != null; p = p.next) b.append(" -&gt; ").append(p.info);
        return b + " -&gt; null   (tail = " + (tail == null ? "null" : String.valueOf(tail.info)) + ")";
    }

    public static void main(String[] args) throws Exception {
        MyQueue q = new MyQueue();
        for (int x = 1; x &lt;= 3; x++) { q.enqueue(x); System.out.println("enqueue(" + x + "): " + show(q.head, q.tail)); }
        System.out.println("front() = " + q.front());
        while (!q.isEmpty()) { Object x = q.dequeue(); System.out.println("dequeue() = " + x + ": " + show(q.head, q.tail)); }
        q.enqueue(4);
        System.out.println("enqueue(4): " + show(q.head, q.tail));
        BadQueue b = new BadQueue();
        b.enqueue(1); b.dequeue(); b.enqueue(2);
        System.out.println("BadQueue: enqueue(1), dequeue(), enqueue(2) -&gt; isEmpty() = " + b.isEmpty() + ", the 2 is lost");
    }
}</code></pre>
<div class="out">enqueue(1): head -&gt; 1 -&gt; null &nbsp;&nbsp;(tail = 1)<br>
enqueue(2): head -&gt; 1 -&gt; 2 -&gt; null &nbsp;&nbsp;(tail = 2)<br>
enqueue(3): head -&gt; 1 -&gt; 2 -&gt; 3 -&gt; null &nbsp;&nbsp;(tail = 3)<br>
front() = 1<br>
dequeue() = 1: head -&gt; 2 -&gt; 3 -&gt; null &nbsp;&nbsp;(tail = 3)<br>
dequeue() = 2: head -&gt; 3 -&gt; null &nbsp;&nbsp;(tail = 3)<br>
dequeue() = 3: head -&gt; null &nbsp;&nbsp;(tail = null)<br>
enqueue(4): head -&gt; 4 -&gt; null &nbsp;&nbsp;(tail = 4)<br>
BadQueue: enqueue(1), dequeue(), enqueue(2) -&gt; isEmpty() = true, the 2 is lost</div>
<ul>
<li>Dòng cuối: <code>BadQueue</code> kiểm tra <code>tail == null</code> trong <code>enqueue</code> và quên <code>tail = null</code> trong <code>dequeue</code>. Khi hàng đã rỗng, <code>tail</code> vẫn trỏ vào nút cũ, nên <code>enqueue(2)</code> nối 2 vào sau một nút không còn trong hàng, trong khi <code>head</code> vẫn là <code>null</code> — số 2 bị mất.</li>
<li><code>MyQueue</code> của slide kiểm tra <code>isEmpty()</code> (tức là <code>head</code>) trong <code>enqueue</code>, nên thoát được lỗi đó — nhưng <code>tail = null</code> giữ cho quy tắc "rỗng ⇔ head == null và tail == null" luôn đúng với mọi phương thức khác.</li>
</ul>
<div class="pitfall">Sau mỗi lần dequeue hãy tự hỏi: hàng vừa rỗng chưa? Nếu rồi thì <code>tail = null</code>. Quên dòng này là lỗi kinh điển của hàng đợi liên kết trong đề PE.</div>`],
      [13, 'A Circular Queue',
        `<p class="y-chinh">🎯 A CircularQueue adds rotate() — move the front element to the back; on a circularly linked list that is a single assignment, cheaper than Q.enqueue(Q.dequeue()).</p>
<pre><code class="language-java">class EmptyQueueException extends RuntimeException {}

interface Queue {                                   // the ADT interface of slide 14
    public int size();
    public boolean isEmpty();
    public Object front() throws EmptyQueueException;
    public void enqueue(Object o);
    public Object dequeue() throws EmptyQueueException;
}

interface CircularQueue extends Queue {             // slide 13
    /* Rotates the front element of the queue to the back of the queue.
       This does nothing if the queue is empty. */
    void rotate();
}

class Node {
    static int created = 0;                         // counts every node ever created
    Object info;
    Node next;
    Node(Object x) { info = x; created++; }
}

class LinkedCircularQueue implements CircularQueue {
    private Node tail;                              // tail.next is the front
    private int size;

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
    public Object front() { if (isEmpty()) throw new EmptyQueueException(); return tail.next.info; }
    public void enqueue(Object o) {
        Node n = new Node(o);
        if (isEmpty()) n.next = n; else { n.next = tail.next; tail.next = n; }
        tail = n;
        size++;
    }
    public Object dequeue() {
        if (isEmpty()) throw new EmptyQueueException();
        Node head = tail.next;
        if (head == tail) tail = null; else tail.next = head.next;
        size--;
        return head.info;
    }
    public void rotate() { if (tail != null) tail = tail.next; }   // O(1): no node created, destroyed or relinked
    public String toString() {                      // front to rear
        StringBuilder b = new StringBuilder("[");
        Node p = (tail == null) ? null : tail.next;
        for (int i = 0; i &lt; size; i++, p = p.next) b.append(i &gt; 0 ? ", " : "").append(p.info);
        return b.append("]").toString();
    }
}

public class CircularQueueDemo {
    public static void main(String[] args) {
        LinkedCircularQueue q = new LinkedCircularQueue();
        for (String s : new String[] {"A", "B", "C"}) q.enqueue(s);
        System.out.println("queue " + q + "                    nodes created: " + Node.created);
        for (int k = 0; k &lt; 3; k++) { q.rotate(); System.out.println("rotate()             -&gt; " + q + "   nodes created: " + Node.created); }
        for (int k = 0; k &lt; 3; k++) { q.enqueue(q.dequeue()); System.out.println("enqueue(dequeue())   -&gt; " + q + "   nodes created: " + Node.created); }
        LinkedCircularQueue e = new LinkedCircularQueue();
        e.rotate();
        System.out.println("rotate() on an empty queue: nothing happens, size() = " + e.size());
    }
}</code></pre>
<div class="out">queue [A, B, C] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes created: 3<br>
rotate() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [B, C, A] &nbsp;&nbsp;nodes created: 3<br>
rotate() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [C, A, B] &nbsp;&nbsp;nodes created: 3<br>
rotate() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [A, B, C] &nbsp;&nbsp;nodes created: 3<br>
enqueue(dequeue()) &nbsp;&nbsp;-&gt; [B, C, A] &nbsp;&nbsp;nodes created: 4<br>
enqueue(dequeue()) &nbsp;&nbsp;-&gt; [C, A, B] &nbsp;&nbsp;nodes created: 5<br>
enqueue(dequeue()) &nbsp;&nbsp;-&gt; [A, B, C] &nbsp;&nbsp;nodes created: 6<br>
rotate() on an empty queue: nothing happens, size() = 0</div>
<ul>
<li><code>rotate()</code> is <code>tail = tail.next;</code> — the old front becomes the rear. O(1): no node is created, destroyed or relinked, so the counter stays at 3.</li>
<li><code>enqueue(dequeue())</code> gives the same order, but each call unlinks a node and builds a new one (the counter climbs to 6) — more work and more garbage.</li>
<li>"This does nothing if the queue is empty" — the last line of the output.</li>
<li>The slide's interface <code>extends Queue</code>: that is the ADT interface of slide 14, not <code>java.util.Queue</code>.</li>
</ul>
<p>A circular queue fits any cyclic arrangement: players of a turn-based game, round-robin scheduling (slide 7), the processes of lesson 1.A's slide 15.</p>
<p class="meo">🧠 <strong>Remember:</strong> a circular queue is a merry-go-round — turning it moves everyone one seat along without anyone getting off.</p>`,
        `<p class="y-chinh">🎯 CircularQueue (hàng đợi vòng) có thêm rotate() — đưa phần tử đầu hàng xuống cuối hàng; trên danh sách liên kết vòng (circularly linked list) việc đó chỉ là một phép gán, rẻ hơn Q.enqueue(Q.dequeue()).</p>
<pre><code class="language-java">class EmptyQueueException extends RuntimeException {}

interface Queue {                                   // interface ADT của slide 14
    public int size();
    public boolean isEmpty();
    public Object front() throws EmptyQueueException;
    public void enqueue(Object o);
    public Object dequeue() throws EmptyQueueException;
}

interface CircularQueue extends Queue {             // slide 13
    /* Rotates the front element of the queue to the back of the queue.
       This does nothing if the queue is empty. */
    void rotate();
}

class Node {
    static int created = 0;                         // đếm mọi nút đã từng tạo
    Object info;
    Node next;
    Node(Object x) { info = x; created++; }
}

class LinkedCircularQueue implements CircularQueue {
    private Node tail;                              // tail.next là phần tử đầu
    private int size;

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
    public Object front() { if (isEmpty()) throw new EmptyQueueException(); return tail.next.info; }
    public void enqueue(Object o) {
        Node n = new Node(o);
        if (isEmpty()) n.next = n; else { n.next = tail.next; tail.next = n; }
        tail = n;
        size++;
    }
    public Object dequeue() {
        if (isEmpty()) throw new EmptyQueueException();
        Node head = tail.next;
        if (head == tail) tail = null; else tail.next = head.next;
        size--;
        return head.info;
    }
    public void rotate() { if (tail != null) tail = tail.next; }   // O(1): không tạo, không huỷ, không nối lại nút nào
    public String toString() {                      // từ đầu tới cuối hàng
        StringBuilder b = new StringBuilder("[");
        Node p = (tail == null) ? null : tail.next;
        for (int i = 0; i &lt; size; i++, p = p.next) b.append(i &gt; 0 ? ", " : "").append(p.info);
        return b.append("]").toString();
    }
}

public class CircularQueueDemo {
    public static void main(String[] args) {
        LinkedCircularQueue q = new LinkedCircularQueue();
        for (String s : new String[] {"A", "B", "C"}) q.enqueue(s);
        System.out.println("queue " + q + "                    nodes created: " + Node.created);
        for (int k = 0; k &lt; 3; k++) { q.rotate(); System.out.println("rotate()             -&gt; " + q + "   nodes created: " + Node.created); }
        for (int k = 0; k &lt; 3; k++) { q.enqueue(q.dequeue()); System.out.println("enqueue(dequeue())   -&gt; " + q + "   nodes created: " + Node.created); }
        LinkedCircularQueue e = new LinkedCircularQueue();
        e.rotate();
        System.out.println("rotate() on an empty queue: nothing happens, size() = " + e.size());
    }
}</code></pre>
<div class="out">queue [A, B, C] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nodes created: 3<br>
rotate() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [B, C, A] &nbsp;&nbsp;nodes created: 3<br>
rotate() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [C, A, B] &nbsp;&nbsp;nodes created: 3<br>
rotate() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [A, B, C] &nbsp;&nbsp;nodes created: 3<br>
enqueue(dequeue()) &nbsp;&nbsp;-&gt; [B, C, A] &nbsp;&nbsp;nodes created: 4<br>
enqueue(dequeue()) &nbsp;&nbsp;-&gt; [C, A, B] &nbsp;&nbsp;nodes created: 5<br>
enqueue(dequeue()) &nbsp;&nbsp;-&gt; [A, B, C] &nbsp;&nbsp;nodes created: 6<br>
rotate() on an empty queue: nothing happens, size() = 0</div>
<ul>
<li><code>rotate()</code> (xoay) là <code>tail = tail.next;</code> — phần tử đầu cũ thành phần tử cuối. O(1): không tạo, không huỷ, không nối lại nút (node) nào, nên bộ đếm đứng yên ở 3.</li>
<li><code>enqueue(dequeue())</code> cho cùng thứ tự, nhưng mỗi lần gọi lại gỡ một nút và tạo một nút mới (bộ đếm tăng lên 6) — tốn công hơn và sinh thêm rác (garbage).</li>
<li>"Không làm gì nếu hàng đợi rỗng" — dòng cuối của output.</li>
<li>Giao diện (interface) của slide <code>extends Queue</code> (kế thừa Queue): đó là interface của ADT (kiểu dữ liệu trừu tượng) ở slide 14, không phải <code>java.util.Queue</code>.</li>
</ul>
<p>Hàng đợi vòng hợp với mọi thứ xếp thành vòng: người chơi trong trò chơi theo lượt (turn-based game), lập lịch xoay vòng (round-robin, slide 7), các tiến trình ở slide 15 của bài 1.A.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> hàng đợi vòng giống vòng đu quay ngựa gỗ — quay một nấc thì mọi người dịch một chỗ mà không ai phải xuống.</p>`],
      [14, 'Queue Interface in Java - 1',
        `<p class="y-chinh">🎯 The slide writes the queue ADT as a Java interface — size, isEmpty, front, enqueue, dequeue — which needs its own EmptyQueueException; the JDK's java.util.Queue is a different interface with different method names.</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.LinkedList;

class EmptyQueueException extends RuntimeException {    // required by the interface
    EmptyQueueException(String m) { super(m); }
}

interface Queue {                                       // the slide's interface
    public int size();
    public boolean isEmpty();
    public Object front() throws EmptyQueueException;
    public void enqueue(Object o);
    public Object dequeue() throws EmptyQueueException;
}

class ListQueue implements Queue {                      // implemented on top of java.util.LinkedList
    private LinkedList&lt;Object&gt; list = new LinkedList&lt;Object&gt;();
    public int size() { return list.size(); }
    public boolean isEmpty() { return list.isEmpty(); }
    public void enqueue(Object o) { list.addLast(o); }
    public Object front() {
        if (list.isEmpty()) throw new EmptyQueueException("front() of an empty queue");
        return list.getFirst();
    }
    public Object dequeue() {
        if (list.isEmpty()) throw new EmptyQueueException("dequeue() of an empty queue");
        return list.removeFirst();
    }
}

public class QueueInterface {
    public static void main(String[] args) {
        Queue q = new ListQueue();                      // "Queue" here = the slide's interface
        q.enqueue("x"); q.enqueue("y");
        System.out.println("our Queue:  size() = " + q.size() + ", front() = " + q.front() + ", dequeue() = " + q.dequeue() + ", dequeue() = " + q.dequeue());
        try { q.front(); } catch (EmptyQueueException e) { System.out.println("our Queue:  front() -&gt; " + e); }
        java.util.Queue&lt;String&gt; jq = new ArrayDeque&lt;String&gt;();   // the JDK's Queue, full name to avoid the clash
        jq.offer("x"); jq.offer("y");
        System.out.println("java.util.Queue: size() = " + jq.size() + ", peek() = " + jq.peek() + ", poll() = " + jq.poll() + ", poll() = " + jq.poll() + ", poll() = " + jq.poll());
    }
}</code></pre>
<div class="out">our Queue: &nbsp;size() = 2, front() = x, dequeue() = x, dequeue() = y<br>
our Queue: &nbsp;front() -&gt; EmptyQueueException: front() of an empty queue<br>
java.util.Queue: size() = 2, peek() = x, poll() = x, poll() = y, poll() = null</div>
<table>
<thead><tr><th>Queue ADT (slide)</th><th><code>java.util.Queue</code>: throws</th><th><code>java.util.Queue</code>: special value</th></tr></thead>
<tbody>
<tr><td><code>enqueue(o)</code></td><td><code>add(e)</code></td><td><code>offer(e)</code> → <code>false</code></td></tr>
<tr><td><code>dequeue()</code></td><td><code>remove()</code> → <code>NoSuchElementException</code></td><td><code>poll()</code> → <code>null</code></td></tr>
<tr><td><code>front()</code></td><td><code>element()</code> → <code>NoSuchElementException</code></td><td><code>peek()</code> → <code>null</code></td></tr>
<tr><td><code>size()</code>, <code>isEmpty()</code></td><td><code>size()</code>, <code>isEmpty()</code></td><td>—</td></tr>
</tbody>
</table>
<ul>
<li>"Requires the definition of class EmptyQueueException": without that class the interface does not compile.</li>
<li>"No corresponding built-in Java class" is true of this exact interface (with <code>enqueue</code>/<code>dequeue</code>/<code>front</code>), but since Java 5 the JDK has the interface <code>java.util.Queue</code>, implemented by <code>LinkedList</code>, <code>ArrayDeque</code> and <code>PriorityQueue</code>.</li>
<li><code>public</code> on interface methods is optional — they are public anyway.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> Java's names come in pairs — add/offer, remove/poll, element/peek — and in each pair the first one throws, the second one returns a special value.</p>
<div class="pitfall">Name clash: <code>import java.util.Queue;</code> plus your own <code>interface Queue</code> in the same file does not compile ("Queue is already defined in this compilation unit"). With <code>import java.util.*;</code> your own <code>Queue</code> silently wins. When you need both, write the JDK one in full: <code>java.util.Queue&lt;String&gt;</code> — as the program does.</div>`,
        `<p class="y-chinh">🎯 Slide viết ADT (kiểu dữ liệu trừu tượng) hàng đợi (queue) thành một interface (giao diện) Java — size, isEmpty, front, enqueue, dequeue — cần lớp EmptyQueueException riêng; còn java.util.Queue của JDK là một interface khác, với tên phương thức khác.</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.LinkedList;

class EmptyQueueException extends RuntimeException {    // interface cần lớp này
    EmptyQueueException(String m) { super(m); }
}

interface Queue {                                       // interface của slide
    public int size();
    public boolean isEmpty();
    public Object front() throws EmptyQueueException;
    public void enqueue(Object o);
    public Object dequeue() throws EmptyQueueException;
}

class ListQueue implements Queue {                      // cài đặt dựa trên java.util.LinkedList
    private LinkedList&lt;Object&gt; list = new LinkedList&lt;Object&gt;();
    public int size() { return list.size(); }
    public boolean isEmpty() { return list.isEmpty(); }
    public void enqueue(Object o) { list.addLast(o); }
    public Object front() {
        if (list.isEmpty()) throw new EmptyQueueException("front() of an empty queue");
        return list.getFirst();
    }
    public Object dequeue() {
        if (list.isEmpty()) throw new EmptyQueueException("dequeue() of an empty queue");
        return list.removeFirst();
    }
}

public class QueueInterface {
    public static void main(String[] args) {
        Queue q = new ListQueue();                      // "Queue" ở đây = interface của slide
        q.enqueue("x"); q.enqueue("y");
        System.out.println("our Queue:  size() = " + q.size() + ", front() = " + q.front() + ", dequeue() = " + q.dequeue() + ", dequeue() = " + q.dequeue());
        try { q.front(); } catch (EmptyQueueException e) { System.out.println("our Queue:  front() -&gt; " + e); }
        java.util.Queue&lt;String&gt; jq = new ArrayDeque&lt;String&gt;();   // Queue của JDK, viết tên đầy đủ để khỏi trùng
        jq.offer("x"); jq.offer("y");
        System.out.println("java.util.Queue: size() = " + jq.size() + ", peek() = " + jq.peek() + ", poll() = " + jq.poll() + ", poll() = " + jq.poll() + ", poll() = " + jq.poll());
    }
}</code></pre>
<div class="out">our Queue: &nbsp;size() = 2, front() = x, dequeue() = x, dequeue() = y<br>
our Queue: &nbsp;front() -&gt; EmptyQueueException: front() of an empty queue<br>
java.util.Queue: size() = 2, peek() = x, poll() = x, poll() = y, poll() = null</div>
<table>
<thead><tr><th>ADT hàng đợi (slide)</th><th><code>java.util.Queue</code>: ném ngoại lệ</th><th><code>java.util.Queue</code>: trả giá trị đặc biệt</th></tr></thead>
<tbody>
<tr><td><code>enqueue(o)</code> — đưa vào</td><td><code>add(e)</code></td><td><code>offer(e)</code> → <code>false</code></td></tr>
<tr><td><code>dequeue()</code> — lấy ra</td><td><code>remove()</code> → <code>NoSuchElementException</code></td><td><code>poll()</code> → <code>null</code></td></tr>
<tr><td><code>front()</code> — xem đầu</td><td><code>element()</code> → <code>NoSuchElementException</code></td><td><code>peek()</code> → <code>null</code></td></tr>
<tr><td><code>size()</code>, <code>isEmpty()</code></td><td><code>size()</code>, <code>isEmpty()</code></td><td>—</td></tr>
</tbody>
</table>
<ul>
<li>"Requires the definition of class EmptyQueueException" (phải định nghĩa lớp EmptyQueueException): thiếu lớp đó thì interface không biên dịch được.</li>
<li>"No corresponding built-in Java class" (không có lớp dựng sẵn tương ứng) đúng với chính interface này (có <code>enqueue</code>/<code>dequeue</code>/<code>front</code>), nhưng từ Java 5 JDK đã có interface <code>java.util.Queue</code>, được cài đặt bởi <code>LinkedList</code>, <code>ArrayDeque</code> và <code>PriorityQueue</code>.</li>
<li>Chữ <code>public</code> ở các phương thức của interface là không bắt buộc — chúng vốn đã public.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> tên trong Java đi theo cặp — add/offer, remove/poll, element/peek — trong mỗi cặp, cái đầu ném ngoại lệ, cái sau trả về giá trị đặc biệt.</p>
<div class="pitfall">Trùng tên: <code>import java.util.Queue;</code> cộng với <code>interface Queue</code> tự viết trong cùng file thì không biên dịch được ("Queue is already defined in this compilation unit"). Với <code>import java.util.*;</code> thì <code>Queue</code> tự viết lặng lẽ thắng. Khi cần cả hai, hãy viết đầy đủ tên của JDK: <code>java.util.Queue&lt;String&gt;</code> — như chương trình trên.</div>`],
      [15, 'Double-Ended Queues (Deque) - 1',
        `<p class="y-chinh">🎯 A deque (double-ended queue, pronounced "deck") supports insertion and deletion at both the front and the back — it is more general than both the stack and the queue.</p>
<ul>
<li>Said "deck" so that it is not confused with <code>dequeue</code>, the queue method, pronounced like the letters "D.Q.".</li>
<li>A stack is a deque used at one end only; a queue is a deque that adds at one end and removes at the other.</li>
<li>The slide's restaurant: the first person removed from the waitlist finds no free table and is put back at the <em>first</em> position; a customer at the end grows impatient and leaves from the <em>end</em>. A plain queue can do neither.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class RestaurantDeque {
    public static void main(String[] args) {
        Deque&lt;String&gt; wait = new ArrayDeque&lt;String&gt;();
        for (String g : new String[] {"An", "Bao", "Cuc", "Dung"}) wait.addLast(g);   // arrivals join at the back
        System.out.println("waitlist " + wait);
        String first = wait.removeFirst();                   // called for a table...
        System.out.println("removeFirst() = " + first + ", but no table is free");
        wait.addFirst(first);                                // ...back to the FIRST position
        System.out.println("addFirst(" + first + ")    -&gt; " + wait);
        String gone = wait.removeLast();                     // the last customer grows impatient
        System.out.println("removeLast() = " + gone + " (impatient) -&gt; " + wait);
        System.out.println("a table is free: removeFirst() = " + wait.removeFirst() + " -&gt; " + wait);
    }
}</code></pre>
<div class="out">waitlist [An, Bao, Cuc, Dung]<br>
removeFirst() = An, but no table is free<br>
addFirst(An) &nbsp;&nbsp;&nbsp;-&gt; [An, Bao, Cuc, Dung]<br>
removeLast() = Dung (impatient) -&gt; [An, Bao, Cuc]<br>
a table is free: removeFirst() = An -&gt; [Bao, Cuc]</div>
<p><strong>Big-O:</strong> all four end operations are O(1) — with a circular array (<code>java.util.ArrayDeque</code>) or with a doubly linked list (<code>java.util.LinkedList</code>).</p>
<p class="meo">🧠 <strong>Remember:</strong> a deque is a deck of cards — you may take a card from the top or from the bottom.</p>
<div class="pitfall">Spelling trap: deque (the structure) ≠ dequeue (the operation). And a <em>singly</em> linked list is a poor deque: <code>removeLast</code> would be O(n).</div>`,
        `<p class="y-chinh">🎯 Deque (double-ended queue — hàng đợi hai đầu, đọc là "đéc") cho phép thêm và xoá ở cả đầu lẫn cuối — tổng quát hơn cả ngăn xếp (stack) lẫn hàng đợi (queue).</p>
<ul>
<li>Đọc là "deck" để khỏi lẫn với <code>dequeue</code> — thao tác của hàng đợi, đọc như hai chữ cái "D.Q.".</li>
<li>Stack là một deque chỉ dùng một đầu; queue là một deque thêm ở đầu này và lấy ra ở đầu kia.</li>
<li>Nhà hàng trên slide: người đầu tiên được gọi ra khỏi danh sách chờ lại không có bàn trống, nên được xếp lại vào <em>đúng vị trí đầu</em>; một khách ở cuối hàng sốt ruột bỏ về từ <em>cuối</em> hàng. Hàng đợi thường không làm được cả hai việc này.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class RestaurantDeque {
    public static void main(String[] args) {
        Deque&lt;String&gt; wait = new ArrayDeque&lt;String&gt;();
        for (String g : new String[] {"An", "Bao", "Cuc", "Dung"}) wait.addLast(g);   // khách tới xếp vào cuối
        System.out.println("waitlist " + wait);
        String first = wait.removeFirst();                   // được gọi vào bàn...
        System.out.println("removeFirst() = " + first + ", but no table is free");
        wait.addFirst(first);                                // ...quay lại đúng VỊ TRÍ ĐẦU
        System.out.println("addFirst(" + first + ")    -&gt; " + wait);
        String gone = wait.removeLast();                     // khách cuối hàng sốt ruột bỏ về
        System.out.println("removeLast() = " + gone + " (impatient) -&gt; " + wait);
        System.out.println("a table is free: removeFirst() = " + wait.removeFirst() + " -&gt; " + wait);
    }
}</code></pre>
<div class="out">waitlist [An, Bao, Cuc, Dung]<br>
removeFirst() = An, but no table is free<br>
addFirst(An) &nbsp;&nbsp;&nbsp;-&gt; [An, Bao, Cuc, Dung]<br>
removeLast() = Dung (impatient) -&gt; [An, Bao, Cuc]<br>
a table is free: removeFirst() = An -&gt; [Bao, Cuc]</div>
<p><strong>Big-O:</strong> cả bốn thao tác ở hai đầu đều O(1) — dùng mảng vòng (<code>java.util.ArrayDeque</code>) hoặc danh sách liên kết đôi (doubly linked list, <code>java.util.LinkedList</code>).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> deque đọc giống "deck" — bộ bài: rút lá trên cùng hay lá dưới cùng đều được.</p>
<div class="pitfall">Bẫy chính tả: deque (cấu trúc) ≠ dequeue (thao tác). Và danh sách liên kết <em>đơn</em> làm deque rất dở: <code>removeLast</code> sẽ tốn O(n).</div>`],
      [16, 'Double-Ended Queues (Deque) - 2',
        `<p class="y-chinh">🎯 The deque ADT has four update methods — addFirst, addLast, removeFirst, removeLast — and four accessors — first, last, size, isEmpty; on an empty deque the two removals and first/last return null.</p>
<table>
<thead><tr><th>Deque ADT (slide)</th><th><code>java.util.Deque</code>: returns <code>null</code>/<code>false</code></th><th><code>java.util.Deque</code>: throws on failure</th></tr></thead>
<tbody>
<tr><td><code>addFirst(e)</code>, <code>addLast(e)</code></td><td><code>offerFirst(e)</code>, <code>offerLast(e)</code></td><td><code>addFirst(e)</code>, <code>addLast(e)</code></td></tr>
<tr><td><code>removeFirst()</code>, <code>removeLast()</code> — <code>null</code> if empty</td><td><code>pollFirst()</code>, <code>pollLast()</code></td><td><code>removeFirst()</code>, <code>removeLast()</code></td></tr>
<tr><td><code>first()</code>, <code>last()</code> — <code>null</code> if empty</td><td><code>peekFirst()</code>, <code>peekLast()</code></td><td><code>getFirst()</code>, <code>getLast()</code></td></tr>
<tr><td><code>size()</code>, <code>isEmpty()</code></td><td><code>size()</code>, <code>isEmpty()</code></td><td>—</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

public class DequeAdt {
    public static void main(String[] args) {
        Deque&lt;Integer&gt; d = new ArrayDeque&lt;Integer&gt;();
        d.addFirst(2); d.addFirst(1); d.addLast(3); d.addLast(4);
        System.out.println("addFirst(2), addFirst(1), addLast(3), addLast(4) -&gt; " + d + ", size() = " + d.size());
        System.out.println("first(): peekFirst() = " + d.peekFirst() + "   last(): peekLast() = " + d.peekLast());
        System.out.println("removeFirst() = " + d.removeFirst() + ", removeLast() = " + d.removeLast() + " -&gt; " + d);
        d.clear();
        // the ADT returns null when empty; in Java only poll/peek do
        System.out.println("empty: pollFirst() = " + d.pollFirst() + ", pollLast() = " + d.pollLast() + ", peekFirst() = " + d.peekFirst());
        try { d.removeFirst(); } catch (NoSuchElementException e) { System.out.println("empty: removeFirst() -&gt; " + e); }
        try { d.getLast(); } catch (NoSuchElementException e) { System.out.println("empty: getLast()     -&gt; " + e); }
        d.push(1); d.push(2); d.push(3);                  // as a stack: push = addFirst
        System.out.println("as a stack: push 1, 2, 3 then pop() = " + d.pop());
        d.clear();
        d.offer(1); d.offer(2); d.offer(3);               // as a queue: offer = addLast
        System.out.println("as a queue: offer 1, 2, 3 then poll() = " + d.poll());
        try { d.addLast(null); } catch (NullPointerException e) { System.out.println("addLast(null) -&gt; " + e + " (ArrayDeque refuses null)"); }
    }
}</code></pre>
<div class="out">addFirst(2), addFirst(1), addLast(3), addLast(4) -&gt; [1, 2, 3, 4], size() = 4<br>
first(): peekFirst() = 1 &nbsp;&nbsp;last(): peekLast() = 4<br>
removeFirst() = 1, removeLast() = 4 -&gt; [2, 3]<br>
empty: pollFirst() = null, pollLast() = null, peekFirst() = null<br>
empty: removeFirst() -&gt; java.util.NoSuchElementException<br>
empty: getLast() &nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.util.NoSuchElementException<br>
as a stack: push 1, 2, 3 then pop() = 3<br>
as a queue: offer 1, 2, 3 then poll() = 1<br>
addLast(null) -&gt; java.lang.NullPointerException (ArrayDeque refuses null)</div>
<ul>
<li>One <code>ArrayDeque</code> also offers the stack methods <code>push</code>/<code>pop</code>/<code>peek</code> (= <code>addFirst</code>/<code>removeFirst</code>/<code>peekFirst</code>) and the queue methods <code>offer</code>/<code>poll</code> (= <code>addLast</code>/<code>pollFirst</code>).</li>
<li><code>ArrayDeque</code> has no capacity limit, so its adds never fail; it refuses <code>null</code> elements (last line) — precisely so that <code>null</code> can mean "empty" in <code>poll</code>/<code>peek</code>.</li>
<li><strong>Big-O:</strong> every method in the table is O(1) (amortized when the array grows).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> in <code>java.util</code>, offer/poll/peek are the polite family (special value) and add/remove/get the strict one (exception) — for deques too, with First or Last added to the name.</p>
<div class="pitfall">Same name, different behaviour: the ADT's <code>removeFirst()</code> returns <code>null</code> on an empty deque, but Java's <code>ArrayDeque.removeFirst()</code> throws <code>NoSuchElementException</code> (see the output) — the <code>null</code>-returning version is <code>pollFirst()</code>.</div>`,
        `<p class="y-chinh">🎯 ADT deque (hàng đợi hai đầu) có bốn phương thức cập nhật — addFirst, addLast, removeFirst, removeLast — và bốn phương thức truy vấn (accessor) — first, last, size, isEmpty; khi deque rỗng, hai thao tác lấy ra và first/last trả về null.</p>
<table>
<thead><tr><th>ADT deque (slide)</th><th><code>java.util.Deque</code>: trả về <code>null</code>/<code>false</code></th><th><code>java.util.Deque</code>: ném ngoại lệ khi thất bại</th></tr></thead>
<tbody>
<tr><td><code>addFirst(e)</code>, <code>addLast(e)</code> — thêm vào đầu/cuối</td><td><code>offerFirst(e)</code>, <code>offerLast(e)</code></td><td><code>addFirst(e)</code>, <code>addLast(e)</code></td></tr>
<tr><td><code>removeFirst()</code>, <code>removeLast()</code> — rỗng thì <code>null</code></td><td><code>pollFirst()</code>, <code>pollLast()</code></td><td><code>removeFirst()</code>, <code>removeLast()</code></td></tr>
<tr><td><code>first()</code>, <code>last()</code> — rỗng thì <code>null</code></td><td><code>peekFirst()</code>, <code>peekLast()</code></td><td><code>getFirst()</code>, <code>getLast()</code></td></tr>
<tr><td><code>size()</code>, <code>isEmpty()</code></td><td><code>size()</code>, <code>isEmpty()</code></td><td>—</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

public class DequeAdt {
    public static void main(String[] args) {
        Deque&lt;Integer&gt; d = new ArrayDeque&lt;Integer&gt;();
        d.addFirst(2); d.addFirst(1); d.addLast(3); d.addLast(4);
        System.out.println("addFirst(2), addFirst(1), addLast(3), addLast(4) -&gt; " + d + ", size() = " + d.size());
        System.out.println("first(): peekFirst() = " + d.peekFirst() + "   last(): peekLast() = " + d.peekLast());
        System.out.println("removeFirst() = " + d.removeFirst() + ", removeLast() = " + d.removeLast() + " -&gt; " + d);
        d.clear();
        // ADT trả null khi rỗng; trong Java chỉ poll/peek làm vậy
        System.out.println("empty: pollFirst() = " + d.pollFirst() + ", pollLast() = " + d.pollLast() + ", peekFirst() = " + d.peekFirst());
        try { d.removeFirst(); } catch (NoSuchElementException e) { System.out.println("empty: removeFirst() -&gt; " + e); }
        try { d.getLast(); } catch (NoSuchElementException e) { System.out.println("empty: getLast()     -&gt; " + e); }
        d.push(1); d.push(2); d.push(3);                  // làm stack: push = addFirst
        System.out.println("as a stack: push 1, 2, 3 then pop() = " + d.pop());
        d.clear();
        d.offer(1); d.offer(2); d.offer(3);               // làm queue: offer = addLast
        System.out.println("as a queue: offer 1, 2, 3 then poll() = " + d.poll());
        try { d.addLast(null); } catch (NullPointerException e) { System.out.println("addLast(null) -&gt; " + e + " (ArrayDeque refuses null)"); }
    }
}</code></pre>
<div class="out">addFirst(2), addFirst(1), addLast(3), addLast(4) -&gt; [1, 2, 3, 4], size() = 4<br>
first(): peekFirst() = 1 &nbsp;&nbsp;last(): peekLast() = 4<br>
removeFirst() = 1, removeLast() = 4 -&gt; [2, 3]<br>
empty: pollFirst() = null, pollLast() = null, peekFirst() = null<br>
empty: removeFirst() -&gt; java.util.NoSuchElementException<br>
empty: getLast() &nbsp;&nbsp;&nbsp;&nbsp;-&gt; java.util.NoSuchElementException<br>
as a stack: push 1, 2, 3 then pop() = 3<br>
as a queue: offer 1, 2, 3 then poll() = 1<br>
addLast(null) -&gt; java.lang.NullPointerException (ArrayDeque refuses null)</div>
<ul>
<li>Một <code>ArrayDeque</code> còn có sẵn các phương thức kiểu ngăn xếp (stack) <code>push</code>/<code>pop</code>/<code>peek</code> (= <code>addFirst</code>/<code>removeFirst</code>/<code>peekFirst</code>) và kiểu hàng đợi (queue) <code>offer</code>/<code>poll</code> (= <code>addLast</code>/<code>pollFirst</code>).</li>
<li><code>ArrayDeque</code> không giới hạn sức chứa nên các thao tác thêm của nó không bao giờ thất bại; nó không nhận phần tử <code>null</code> (dòng cuối) — chính để <code>null</code> có thể mang nghĩa "rỗng" ở <code>poll</code>/<code>peek</code>.</li>
<li><strong>Big-O:</strong> mọi phương thức trong bảng đều O(1) (khấu hao — amortized — khi mảng phải nới).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trong <code>java.util</code>, offer/poll/peek là họ "lịch sự" (trả giá trị đặc biệt), add/remove/get là họ "nghiêm khắc" (ném ngoại lệ) — với deque cũng vậy, chỉ thêm First hoặc Last vào tên.</p>
<div class="pitfall">Cùng tên, khác hành vi: <code>removeFirst()</code> của ADT trả về <code>null</code> khi deque rỗng, nhưng <code>ArrayDeque.removeFirst()</code> của Java lại ném <code>NoSuchElementException</code> (xem output) — bản trả về <code>null</code> là <code>pollFirst()</code>.</div>`],
      [17, 'Priority Queues',
        `<p class="y-chinh">🎯 A priority queue lets an important element leave out of arrival order: elements are dequeued by priority first and, among equal priorities, by their current position in the queue — FIFO is broken on purpose.</p>
<ul>
<li>The slide: a priority queue can be assigned "to enable a particular process, or event, to be executed out of sequence without affecting overall system operation".</li>
<li>Examples: an emergency room treats the most severe patient first; an operating system runs high-priority processes first.</li>
<li>Rule on the slide: priority first, then "their current queue position" — equal priorities keep FIFO order.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

class Patient {
    String name;
    int severity;                                     // higher = more urgent
    int arrival;                                      // position in the waiting line
    Patient(String name, int severity, int arrival) { this.name = name; this.severity = severity; this.arrival = arrival; }
    public String toString() { return name + "(" + severity + ")"; }
}

public class TriagePQ {
    static String drain(Queue&lt;Patient&gt; q) {
        StringBuilder b = new StringBuilder();
        while (!q.isEmpty()) b.append(' ').append(q.remove());
        return b.toString();
    }

    public static void main(String[] args) {
        String[] names = {"An", "Binh", "Chi", "Dung", "Em", "Phong"};
        int[] sev = {1, 3, 3, 1, 3, 2};
        Queue&lt;Patient&gt; fifo = new ArrayDeque&lt;Patient&gt;();
        Queue&lt;Patient&gt; byPriority = new PriorityQueue&lt;Patient&gt;(new Comparator&lt;Patient&gt;() {
            public int compare(Patient x, Patient y) { return y.severity - x.severity; }
        });
        Queue&lt;Patient&gt; byPriorityThenArrival = new PriorityQueue&lt;Patient&gt;(new Comparator&lt;Patient&gt;() {
            public int compare(Patient x, Patient y) {
                if (x.severity != y.severity) return y.severity - x.severity;   // 1. priority
                return x.arrival - y.arrival;                                     // 2. current queue position
            }
        });
        for (int i = 0; i &lt; names.length; i++) {
            Patient p = new Patient(names[i], sev[i], i);
            fifo.add(p); byPriority.add(p); byPriorityThenArrival.add(p);
        }
        System.out.println("FIFO queue:                  " + drain(fifo));
        System.out.println("priority only:               " + drain(byPriority));
        System.out.println("priority, then arrival order:" + drain(byPriorityThenArrival));
    }
}</code></pre>
<div class="out">FIFO queue: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An(1) Binh(3) Chi(3) Dung(1) Em(3) Phong(2)<br>
priority only: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Binh(3) Em(3) Chi(3) Phong(2) An(1) Dung(1)<br>
priority, then arrival order: Binh(3) Chi(3) Em(3) Phong(2) An(1) Dung(1)</div>
<ul>
<li>Line 2: <code>java.util.PriorityQueue</code> compared by severity only lets Em (3) leave before Chi (3), although Chi arrived first — a heap does not keep FIFO order among ties.</li>
<li>Line 3: adding the arrival number as a second key gives exactly the slide's rule.</li>
</ul>
<p class="dap-an">✅ <strong>Syllabus question "What is a priority queue?"</strong> — a queue whose removal returns the element with the highest priority rather than the oldest one. The hint: an ambulance crosses a gate shared with other cars before the cars that arrived earlier.</p>
<div class="pitfall">"Highest priority" is a convention: in the slides' array (slides 18–19) the <em>largest</em> number leaves first, while <code>java.util.PriorityQueue</code> gives the <em>smallest</em> first unless you pass a comparator. Always check which direction a question uses.</div>`,
        `<p class="y-chinh">🎯 Hàng đợi ưu tiên (priority queue) cho phép phần tử quan trọng ra khỏi hàng không theo thứ tự tới: phần tử được lấy ra theo độ ưu tiên (priority) trước, và giữa các phần tử cùng độ ưu tiên thì theo vị trí hiện tại trong hàng — cố ý phá luật FIFO (vào trước ra trước).</p>
<ul>
<li>Slide viết: hàng đợi ưu tiên có thể được dùng "để một tiến trình (process) hay sự kiện (event) nào đó được chạy trước lượt mà không ảnh hưởng tới hoạt động chung của hệ thống".</li>
<li>Ví dụ: phòng cấp cứu chữa bệnh nhân nặng nhất trước; hệ điều hành chạy tiến trình ưu tiên cao trước.</li>
<li>Luật trên slide: xét độ ưu tiên trước, rồi tới "vị trí hiện tại trong hàng" — cùng độ ưu tiên thì vẫn giữ thứ tự FIFO.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

class Patient {
    String name;
    int severity;                                     // càng lớn càng khẩn cấp
    int arrival;                                      // vị trí trong hàng chờ
    Patient(String name, int severity, int arrival) { this.name = name; this.severity = severity; this.arrival = arrival; }
    public String toString() { return name + "(" + severity + ")"; }
}

public class TriagePQ {
    static String drain(Queue&lt;Patient&gt; q) {
        StringBuilder b = new StringBuilder();
        while (!q.isEmpty()) b.append(' ').append(q.remove());
        return b.toString();
    }

    public static void main(String[] args) {
        String[] names = {"An", "Binh", "Chi", "Dung", "Em", "Phong"};
        int[] sev = {1, 3, 3, 1, 3, 2};
        Queue&lt;Patient&gt; fifo = new ArrayDeque&lt;Patient&gt;();
        Queue&lt;Patient&gt; byPriority = new PriorityQueue&lt;Patient&gt;(new Comparator&lt;Patient&gt;() {
            public int compare(Patient x, Patient y) { return y.severity - x.severity; }
        });
        Queue&lt;Patient&gt; byPriorityThenArrival = new PriorityQueue&lt;Patient&gt;(new Comparator&lt;Patient&gt;() {
            public int compare(Patient x, Patient y) {
                if (x.severity != y.severity) return y.severity - x.severity;   // 1. độ ưu tiên
                return x.arrival - y.arrival;                                     // 2. vị trí hiện tại trong hàng
            }
        });
        for (int i = 0; i &lt; names.length; i++) {
            Patient p = new Patient(names[i], sev[i], i);
            fifo.add(p); byPriority.add(p); byPriorityThenArrival.add(p);
        }
        System.out.println("FIFO queue:                  " + drain(fifo));
        System.out.println("priority only:               " + drain(byPriority));
        System.out.println("priority, then arrival order:" + drain(byPriorityThenArrival));
    }
}</code></pre>
<div class="out">FIFO queue: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;An(1) Binh(3) Chi(3) Dung(1) Em(3) Phong(2)<br>
priority only: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Binh(3) Em(3) Chi(3) Phong(2) An(1) Dung(1)<br>
priority, then arrival order: Binh(3) Chi(3) Em(3) Phong(2) An(1) Dung(1)</div>
<ul>
<li>Dòng 2: <code>java.util.PriorityQueue</code> chỉ so theo mức độ nặng (severity) để Em (3) ra trước Chi (3), dù Chi tới trước — đống (heap) không giữ thứ tự FIFO giữa các phần tử bằng nhau.</li>
<li>Dòng 3: thêm số thứ tự tới làm khoá thứ hai thì ra đúng luật của slide.</li>
</ul>
<p class="dap-an">✅ <strong>Câu hỏi syllabus "Hàng đợi ưu tiên là gì?"</strong> — là hàng đợi mà thao tác lấy ra trả về phần tử có độ ưu tiên cao nhất chứ không phải phần tử cũ nhất. Gợi ý của syllabus: xe cứu thương đi qua cổng dùng chung trước cả những xe đã tới sớm hơn.</p>
<div class="pitfall">"Ưu tiên cao nhất" chỉ là quy ước: trong mảng của slide (slide 18–19) số <em>lớn nhất</em> ra trước, còn <code>java.util.PriorityQueue</code> mặc định cho số <em>nhỏ nhất</em> ra trước nếu không truyền bộ so sánh (comparator). Luôn xem đề dùng chiều nào.</div>`],
      [18, 'Array implementation of a priority queue - 1',
        `<p class="y-chinh">🎯 The slides keep the priority queue in a float array sorted in ascending order: enqueue finds the new value's place by shifting larger values one cell right — one step of insertion sort, O(n) — so the largest value is always at a[top].</p>
<pre><code class="language-java">class PriorityQueue {                               // the slides' class (not java.util.PriorityQueue)
    protected float[] a;
    int top, max;

    public PriorityQueue() { this(50); }
    public PriorityQueue(int max1) {
        max = max1;
        a = new float[max];
        top = -1;
    }
    protected boolean grow() {
        int max1 = max + max / 2;
        float[] a1 = new float[max1];
        if (a1 == null) return (false);
        for (int i = 0; i &lt;= top; i++)
            a1[i] = a[i];
        a = a1;                                     // same bug as ArrayStack: max is not updated
        return (true);
    }
    public boolean isEmpty() { return (top == -1); }
    public boolean isFull() { return (top == max - 1); }
    public void clear() { top = -1; }
    public void enqueue(float x) {
        if (isFull() &amp;&amp; !grow()) return;
        if (top == -1) {
            a[0] = x; top = 0;
            return;
        }
        int i = top;
        while (i &gt;= 0 &amp;&amp; x &lt; a[i]) {                // shift larger values one cell right
            a[i + 1] = a[i];
            i--;
        }
        a[i + 1] = x; top++;
    }
    public float front() {
        assert (!isEmpty());
        return (a[top]);
    }
    public float dequeue() {
        assert (!isEmpty());
        float x = a[top];
        top--;
        return (x);
    }
}

public class ArrayPQ {
    static String show(PriorityQueue q) {
        StringBuilder b = new StringBuilder("[");
        for (int i = 0; i &lt;= q.top; i++) b.append(i &gt; 0 ? ", " : "").append(q.a[i]);
        return b.append("]").toString();
    }

    public static void main(String[] args) {
        PriorityQueue q = new PriorityQueue();          // capacity 50: grow() is not needed here
        float[] data = {5, 2, 8, 2.5f, 7};
        for (float x : data) { q.enqueue(x); System.out.println("enqueue(" + x + ")  a[0..top] = " + show(q)); }
        System.out.println("front() = " + q.front() + "   (the LARGEST value, a[top])");
        StringBuilder out = new StringBuilder();
        while (!q.isEmpty()) out.append(' ').append(q.dequeue());
        System.out.println("dequeue() until empty:" + out);
        boolean on = false;
        assert on = true;                               // runs only with java -ea
        System.out.println("assertions enabled: " + on);
        try { q.dequeue(); } catch (ArrayIndexOutOfBoundsException e) { System.out.println("dequeue() on empty -&gt; " + e); }
        PriorityQueue small = new PriorityQueue(2);     // the grow() bug
        int k = 0;
        try { for (k = 1; k &lt;= 4; k++) small.enqueue(k); }
        catch (ArrayIndexOutOfBoundsException e) { System.out.println("capacity 2: enqueue(" + k + ") -&gt; " + e); }
    }
}</code></pre>
<div class="out">enqueue(5.0) &nbsp;a[0..top] = [5.0]<br>
enqueue(2.0) &nbsp;a[0..top] = [2.0, 5.0]<br>
enqueue(8.0) &nbsp;a[0..top] = [2.0, 5.0, 8.0]<br>
enqueue(2.5) &nbsp;a[0..top] = [2.0, 2.5, 5.0, 8.0]<br>
enqueue(7.0) &nbsp;a[0..top] = [2.0, 2.5, 5.0, 7.0, 8.0]<br>
front() = 8.0 &nbsp;&nbsp;(the LARGEST value, a[top])<br>
dequeue() until empty: 8.0 7.0 5.0 2.5 2.0<br>
assertions enabled: false<br>
dequeue() on empty -&gt; java.lang.ArrayIndexOutOfBoundsException: Index -1 out of bounds for length 50<br>
capacity 2: enqueue(4) -&gt; java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3</div>
<p class="nhan">The five enqueues of the output (the loop compares from <code>a[top]</code> downwards)</p>
<table>
<thead><tr><th>enqueue(x)</th><th>Shifted one cell right</th><th>a[0..top] after</th></tr></thead>
<tbody>
<tr><td>5</td><td>— (empty: <code>a[0] = 5</code>)</td><td>5</td></tr>
<tr><td>2</td><td>5</td><td>2 5</td></tr>
<tr><td>8</td><td>nothing (8 &lt; 5 is false)</td><td>2 5 8</td></tr>
<tr><td>2.5</td><td>8, 5 (the loop stops at 2)</td><td>2 2.5 5 8</td></tr>
<tr><td>7</td><td>8</td><td>2 2.5 5 7 8</td></tr>
</tbody>
</table>
<ul>
<li><strong>Big-O:</strong> enqueue shifts every value greater than x — up to n shifts, O(n); <code>isEmpty</code>, <code>isFull</code>, <code>clear</code> are O(1).</li>
<li>The last line of the output is the <code>grow()</code> bug of the stack deck again: with capacity 2 the third enqueue grows the array to 3 cells but <code>max</code> stays 2, so <code>isFull()</code> is false from then on and <code>enqueue(4)</code> writes <code>a[3]</code> → ArrayIndexOutOfBoundsException. Fix: <code>max = max1;</code> after <code>a = a1;</code>.</li>
</ul>
<div class="pitfall">Ties: <code>x &lt; a[i]</code> stops at an equal value, so a newcomer is placed <em>above</em> an older element with the same priority, and <code>dequeue()</code> (which takes <code>a[top]</code>) returns the newest one first. With bare floats you cannot tell; with objects — patients with a severity — it breaks slide 17's "current queue position" rule (a test with the same loop on objects gave Em(3) before Chi(3)). Use <code>x &lt;= a[i]</code> to keep FIFO among equals — exercise 7 of lesson 2.6 tests this.</div>
<p class="meo">🧠 <strong>Remember:</strong> sorted array = pay when you insert (O(n)), take for free (O(1)).</p>`,
        `<p class="y-chinh">🎯 Slide giữ hàng đợi ưu tiên (priority queue) trong một mảng float sắp tăng dần: enqueue (đưa vào) tìm chỗ cho giá trị mới bằng cách dời các giá trị lớn hơn sang phải một ô — đúng một bước của sắp xếp chèn (insertion sort), O(n) — nên giá trị lớn nhất luôn nằm ở a[top].</p>
<pre><code class="language-java">class PriorityQueue {                               // lớp của slide (không phải java.util.PriorityQueue)
    protected float[] a;
    int top, max;

    public PriorityQueue() { this(50); }
    public PriorityQueue(int max1) {
        max = max1;
        a = new float[max];
        top = -1;
    }
    protected boolean grow() {
        int max1 = max + max / 2;
        float[] a1 = new float[max1];
        if (a1 == null) return (false);
        for (int i = 0; i &lt;= top; i++)
            a1[i] = a[i];
        a = a1;                                     // cùng lỗi với ArrayStack: không cập nhật max
        return (true);
    }
    public boolean isEmpty() { return (top == -1); }
    public boolean isFull() { return (top == max - 1); }
    public void clear() { top = -1; }
    public void enqueue(float x) {
        if (isFull() &amp;&amp; !grow()) return;
        if (top == -1) {
            a[0] = x; top = 0;
            return;
        }
        int i = top;
        while (i &gt;= 0 &amp;&amp; x &lt; a[i]) {                // dời các giá trị lớn hơn sang phải một ô
            a[i + 1] = a[i];
            i--;
        }
        a[i + 1] = x; top++;
    }
    public float front() {
        assert (!isEmpty());
        return (a[top]);
    }
    public float dequeue() {
        assert (!isEmpty());
        float x = a[top];
        top--;
        return (x);
    }
}

public class ArrayPQ {
    static String show(PriorityQueue q) {
        StringBuilder b = new StringBuilder("[");
        for (int i = 0; i &lt;= q.top; i++) b.append(i &gt; 0 ? ", " : "").append(q.a[i]);
        return b.append("]").toString();
    }

    public static void main(String[] args) {
        PriorityQueue q = new PriorityQueue();          // sức chứa 50: ở đây không cần grow()
        float[] data = {5, 2, 8, 2.5f, 7};
        for (float x : data) { q.enqueue(x); System.out.println("enqueue(" + x + ")  a[0..top] = " + show(q)); }
        System.out.println("front() = " + q.front() + "   (the LARGEST value, a[top])");
        StringBuilder out = new StringBuilder();
        while (!q.isEmpty()) out.append(' ').append(q.dequeue());
        System.out.println("dequeue() until empty:" + out);
        boolean on = false;
        assert on = true;                               // chỉ chạy khi có java -ea
        System.out.println("assertions enabled: " + on);
        try { q.dequeue(); } catch (ArrayIndexOutOfBoundsException e) { System.out.println("dequeue() on empty -&gt; " + e); }
        PriorityQueue small = new PriorityQueue(2);     // lỗi grow()
        int k = 0;
        try { for (k = 1; k &lt;= 4; k++) small.enqueue(k); }
        catch (ArrayIndexOutOfBoundsException e) { System.out.println("capacity 2: enqueue(" + k + ") -&gt; " + e); }
    }
}</code></pre>
<div class="out">enqueue(5.0) &nbsp;a[0..top] = [5.0]<br>
enqueue(2.0) &nbsp;a[0..top] = [2.0, 5.0]<br>
enqueue(8.0) &nbsp;a[0..top] = [2.0, 5.0, 8.0]<br>
enqueue(2.5) &nbsp;a[0..top] = [2.0, 2.5, 5.0, 8.0]<br>
enqueue(7.0) &nbsp;a[0..top] = [2.0, 2.5, 5.0, 7.0, 8.0]<br>
front() = 8.0 &nbsp;&nbsp;(the LARGEST value, a[top])<br>
dequeue() until empty: 8.0 7.0 5.0 2.5 2.0<br>
assertions enabled: false<br>
dequeue() on empty -&gt; java.lang.ArrayIndexOutOfBoundsException: Index -1 out of bounds for length 50<br>
capacity 2: enqueue(4) -&gt; java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3</div>
<p class="nhan">Năm lần enqueue trong output (vòng lặp so từ <code>a[top]</code> đi xuống)</p>
<table>
<thead><tr><th>enqueue(x)</th><th>Bị dời sang phải một ô</th><th>a[0..top] sau đó</th></tr></thead>
<tbody>
<tr><td>5</td><td>— (rỗng: <code>a[0] = 5</code>)</td><td>5</td></tr>
<tr><td>2</td><td>5</td><td>2 5</td></tr>
<tr><td>8</td><td>không dời (8 &lt; 5 sai)</td><td>2 5 8</td></tr>
<tr><td>2.5</td><td>8, 5 (vòng lặp dừng ở 2)</td><td>2 2.5 5 8</td></tr>
<tr><td>7</td><td>8</td><td>2 2.5 5 7 8</td></tr>
</tbody>
</table>
<ul>
<li><strong>Big-O:</strong> enqueue dời mọi giá trị lớn hơn x — tới n lần dời, O(n); <code>isEmpty</code>, <code>isFull</code>, <code>clear</code> là O(1).</li>
<li>Dòng cuối của output lại là lỗi <code>grow()</code> của bộ slide ngăn xếp: với sức chứa (capacity) 2, lần enqueue thứ ba nới mảng lên 3 ô nhưng <code>max</code> vẫn là 2, nên từ đó <code>isFull()</code> luôn sai và <code>enqueue(4)</code> ghi vào <code>a[3]</code> → ArrayIndexOutOfBoundsException. Cách sửa: thêm <code>max = max1;</code> sau <code>a = a1;</code>.</li>
</ul>
<div class="pitfall">Trường hợp bằng nhau: <code>x &lt; a[i]</code> dừng lại ở giá trị bằng x, nên phần tử mới được đặt <em>phía trên</em> phần tử cũ có cùng độ ưu tiên, và <code>dequeue()</code> (lấy <code>a[top]</code>) trả về phần tử mới nhất trước. Với số float trần thì không phân biệt được; nhưng với đối tượng — bệnh nhân có mức độ nặng — nó phá luật "vị trí hiện tại trong hàng" của slide 17 (chạy thử cùng vòng lặp trên đối tượng thì Em(3) ra trước Chi(3)). Dùng <code>x &lt;= a[i]</code> để giữ FIFO (vào trước ra trước) giữa các phần tử bằng nhau — bài tập 7 của bài 2.6 kiểm tra đúng điều này.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mảng có thứ tự = trả giá lúc chèn (O(n)), lấy ra miễn phí (O(1)).</p>`],
      [19, 'Array implementation of a priority queue - 2',
        `<p class="y-chinh">🎯 front() returns a[top] and dequeue() removes it — the largest value, in O(1); the empty case is guarded only by assert, which Java skips unless the program is run with -ea.</p>
<pre><code class="language-java">public float front() {
    assert (!isEmpty());
    return (a[top]);
}
public float dequeue() {
    assert (!isEmpty());
    float x = a[top];
    top--;
    return (x);
}</code></pre>
<ul>
<li><code>assert (!isEmpty());</code> — with <code>java -ea</code> an empty queue raises <code>AssertionError</code>; by default assertions are <strong>disabled</strong> (the program's output under slide 18 above prints <code>assertions enabled: false</code>), so <code>dequeue()</code> on an empty queue reads <code>a[-1]</code> → ArrayIndexOutOfBoundsException: Index -1.</li>
<li>Use <code>assert</code> for "this can never happen" checks while developing; to report misuse of an ADT, throw an exception (slide 4).</li>
<li>Three ways to build a priority queue: sorted array (the slides), unsorted array, binary heap — <code>java.util.PriorityQueue</code>, lesson 2.5 and chapter 4.</li>
</ul>
<p>To see the assertion fire, run <code>java -ea ArrayPQ</code>: the empty <code>dequeue()</code> then stops with <code>AssertionError</code> before touching the array. <code>front()</code> has the same guard and the same weakness.</p>
<table>
<thead><tr><th>Implementation</th><th>enqueue / insert</th><th>dequeue / remove the top priority</th><th>front / peek</th></tr></thead>
<tbody>
<tr><td>sorted array (slides 18–19)</td><td>O(n) — shifting</td><td>O(1) — <code>a[top]</code></td><td>O(1)</td></tr>
<tr><td>unsorted array</td><td>O(1) — append</td><td>O(n) — search, then fill the gap</td><td>O(n)</td></tr>
<tr><td>binary heap (<code>java.util.PriorityQueue</code>)</td><td>O(log n)</td><td>O(log n)</td><td>O(1)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Collections;
import java.util.PriorityQueue;

public class JdkPQ {
    public static void main(String[] args) {
        float[] data = {5, 2, 8, 2.5f, 7};
        PriorityQueue&lt;Float&gt; min = new PriorityQueue&lt;Float&gt;();                                  // default: smallest first
        PriorityQueue&lt;Float&gt; max = new PriorityQueue&lt;Float&gt;(Collections.&lt;Float&gt;reverseOrder());  // largest first, like the slides
        for (float x : data) { min.offer(x); max.offer(x); }                                    // O(log n) each
        System.out.println("toString() = " + min + "   &lt;- heap order, NOT sorted");
        System.out.println("peek(): default " + min.peek() + ", reverseOrder " + max.peek());   // O(1)
        StringBuilder a = new StringBuilder(), b = new StringBuilder();
        while (!min.isEmpty()) a.append(' ').append(min.poll());                                // O(log n) each
        while (!max.isEmpty()) b.append(' ').append(max.poll());
        System.out.println("poll() order, default:     " + a);
        System.out.println("poll() order, reverseOrder:" + b);
        System.out.println("poll() on an empty queue = " + min.poll());
    }
}</code></pre>
<div class="out">toString() = [2.0, 2.5, 8.0, 5.0, 7.0] &nbsp;&nbsp;&lt;- heap order, NOT sorted<br>
peek(): default 2.0, reverseOrder 8.0<br>
poll() order, default: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0 2.5 5.0 7.0 8.0<br>
poll() order, reverseOrder: 8.0 7.0 5.0 2.5 2.0<br>
poll() on an empty queue = null</div>
<div class="pitfall">Printing a <code>java.util.PriorityQueue</code> (its <code>toString()</code> or a for-each loop) shows the internal <em>heap order</em>, not sorted order — first line of the output. Only repeated <code>poll()</code> returns the elements in priority order.</div>`,
        `<p class="y-chinh">🎯 front() trả về a[top] và dequeue() lấy nó ra — giá trị lớn nhất, trong O(1); trường hợp rỗng chỉ được chặn bằng assert (câu lệnh khẳng định), mà Java bỏ qua assert nếu chương trình không chạy với -ea.</p>
<pre><code class="language-java">public float front() {
    assert (!isEmpty());
    return (a[top]);
}
public float dequeue() {
    assert (!isEmpty());
    float x = a[top];
    top--;
    return (x);
}</code></pre>
<ul>
<li><code>assert (!isEmpty());</code> — chạy với <code>java -ea</code> thì hàng rỗng gây <code>AssertionError</code>; mặc định assertion bị <strong>tắt</strong> (output của chương trình ở phần slide 18 phía trên in <code>assertions enabled: false</code>), nên <code>dequeue()</code> trên hàng rỗng đọc <code>a[-1]</code> → ArrayIndexOutOfBoundsException: Index -1.</li>
<li>Dùng <code>assert</code> để kiểm tra những điều "không bao giờ được xảy ra" lúc phát triển; còn báo lỗi dùng sai ADT (kiểu dữ liệu trừu tượng) thì ném ngoại lệ (exception, slide 4).</li>
<li>Ba cách dựng hàng đợi ưu tiên: mảng có thứ tự (slide), mảng không thứ tự, đống nhị phân (binary heap) — <code>java.util.PriorityQueue</code>, bài 2.5 và chương 4.</li>
</ul>
<p>Muốn thấy assertion hoạt động, hãy chạy <code>java -ea ArrayPQ</code>: khi đó <code>dequeue()</code> trên hàng rỗng dừng bằng <code>AssertionError</code> trước khi đụng tới mảng. <code>front()</code> được chặn y như vậy và cũng có cùng điểm yếu.</p>
<table>
<thead><tr><th>Cách cài đặt</th><th>enqueue / chèn</th><th>dequeue / lấy phần tử ưu tiên nhất</th><th>front / xem</th></tr></thead>
<tbody>
<tr><td>mảng có thứ tự (slide 18–19)</td><td>O(n) — phải dời</td><td>O(1) — <code>a[top]</code></td><td>O(1)</td></tr>
<tr><td>mảng không thứ tự</td><td>O(1) — thêm vào cuối</td><td>O(n) — tìm, rồi lấp chỗ trống</td><td>O(n)</td></tr>
<tr><td>đống nhị phân (<code>java.util.PriorityQueue</code>)</td><td>O(log n)</td><td>O(log n)</td><td>O(1)</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Collections;
import java.util.PriorityQueue;

public class JdkPQ {
    public static void main(String[] args) {
        float[] data = {5, 2, 8, 2.5f, 7};
        PriorityQueue&lt;Float&gt; min = new PriorityQueue&lt;Float&gt;();                                  // mặc định: nhỏ nhất ra trước
        PriorityQueue&lt;Float&gt; max = new PriorityQueue&lt;Float&gt;(Collections.&lt;Float&gt;reverseOrder());  // lớn nhất ra trước, như slide
        for (float x : data) { min.offer(x); max.offer(x); }                                    // mỗi lần O(log n)
        System.out.println("toString() = " + min + "   &lt;- heap order, NOT sorted");
        System.out.println("peek(): default " + min.peek() + ", reverseOrder " + max.peek());   // O(1)
        StringBuilder a = new StringBuilder(), b = new StringBuilder();
        while (!min.isEmpty()) a.append(' ').append(min.poll());                                // mỗi lần O(log n)
        while (!max.isEmpty()) b.append(' ').append(max.poll());
        System.out.println("poll() order, default:     " + a);
        System.out.println("poll() order, reverseOrder:" + b);
        System.out.println("poll() on an empty queue = " + min.poll());
    }
}</code></pre>
<div class="out">toString() = [2.0, 2.5, 8.0, 5.0, 7.0] &nbsp;&nbsp;&lt;- heap order, NOT sorted<br>
peek(): default 2.0, reverseOrder 8.0<br>
poll() order, default: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0 2.5 5.0 7.0 8.0<br>
poll() order, reverseOrder: 8.0 7.0 5.0 2.5 2.0<br>
poll() on an empty queue = null</div>
<div class="pitfall">In một <code>java.util.PriorityQueue</code> ra (bằng <code>toString()</code> hay vòng for-each) sẽ thấy <em>thứ tự của đống (heap)</em> bên trong, không phải thứ tự đã sắp — dòng đầu của output. Chỉ <code>poll()</code> lặp đi lặp lại mới trả phần tử theo đúng thứ tự ưu tiên.</div>`],
      [20, 'Summary',
        `<p class="y-chinh">🎯 A queue is a waiting line that grows at its end and shrinks at its front — first in, first out; a priority queue dequeues by priority first, then by queue position.</p>
<table>
<thead><tr><th>Structure</th><th>Implementation in this deck</th><th>Cost of add / remove</th><th>Trap</th></tr></thead>
<tbody>
<tr><td>queue</td><td>circular array, <code>first</code>/<code>last</code> (slides 8–11)</td><td>O(1) / O(1), grow O(n)</td><td>two <code>isFull</code> cases; copy in queue order when growing</td></tr>
<tr><td>queue</td><td>singly linked list, <code>head</code>/<code>tail</code> (slide 12)</td><td>O(1) / O(1)</td><td><code>tail = null</code> when the queue empties</td></tr>
<tr><td>circular queue</td><td>circularly linked list (slide 13)</td><td>O(1); <code>rotate()</code> O(1)</td><td><code>rotate()</code> on an empty queue does nothing</td></tr>
<tr><td>deque</td><td><code>ArrayDeque</code> (slides 15–16)</td><td>O(1) at both ends</td><td>Java's <code>removeFirst()</code> throws; <code>pollFirst()</code> returns <code>null</code></td></tr>
<tr><td>priority queue</td><td>sorted <code>float</code> array (slides 18–19)</td><td>O(n) / O(1)</td><td><code>grow()</code> forgets <code>max</code>; <code>assert</code> is off by default</td></tr>
</tbody>
</table>
<ul>
<li><strong>Queuing theory</strong> (the slide's third point) is the mathematics of waiting lines: from how often requests arrive and how long each takes, it predicts waiting times and queue lengths — used to decide how many cashiers, servers or threads a system needs.</li>
<li>Uses: waiting lists, shared resources, multiprogramming and round-robin scheduling, BFS, buffers; the priority queue lets urgent work run out of sequence without disturbing the rest.</li>
<li>Code reflexes for the PE: next index <code>i == max-1 ? 0 : i+1</code>; a linked dequeue sets <code>tail = null</code> when the queue empties; an ordered insert also shifts past equal priorities (<code>x &lt;= a[i]</code>) when they must stay FIFO.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> stack — plates; queue — a canteen line; deque — a deck of cards; priority queue — the emergency room.</p>
<div class="pitfall">FE mix-up: "a priority queue is FIFO" — only among elements of equal priority. Overall it is ordered by priority.</div>`,
        `<p class="y-chinh">🎯 Hàng đợi (queue) là hàng chờ dài ra ở cuối và ngắn lại ở đầu — vào trước ra trước (FIFO); hàng đợi ưu tiên (priority queue) lấy ra theo độ ưu tiên trước, rồi theo vị trí trong hàng.</p>
<table>
<thead><tr><th>Cấu trúc</th><th>Cách cài trong bộ slide</th><th>Chi phí thêm / lấy</th><th>Bẫy</th></tr></thead>
<tbody>
<tr><td>hàng đợi</td><td>mảng vòng, <code>first</code>/<code>last</code> (slide 8–11)</td><td>O(1) / O(1), nới mảng O(n)</td><td><code>isFull</code> có hai trường hợp; khi nới phải chép theo thứ tự hàng đợi</td></tr>
<tr><td>hàng đợi</td><td>danh sách liên kết đơn, <code>head</code>/<code>tail</code> (slide 12)</td><td>O(1) / O(1)</td><td><code>tail = null</code> khi hàng vừa rỗng</td></tr>
<tr><td>hàng đợi vòng</td><td>danh sách liên kết vòng (slide 13)</td><td>O(1); <code>rotate()</code> O(1)</td><td><code>rotate()</code> trên hàng rỗng không làm gì</td></tr>
<tr><td>deque (hàng đợi hai đầu)</td><td><code>ArrayDeque</code> (slide 15–16)</td><td>O(1) ở cả hai đầu</td><td><code>removeFirst()</code> của Java ném ngoại lệ; <code>pollFirst()</code> trả <code>null</code></td></tr>
<tr><td>hàng đợi ưu tiên</td><td>mảng <code>float</code> có thứ tự (slide 18–19)</td><td>O(n) / O(1)</td><td><code>grow()</code> quên <code>max</code>; <code>assert</code> mặc định bị tắt</td></tr>
</tbody>
</table>
<ul>
<li><strong>Lý thuyết hàng đợi (queuing theory)</strong> — ý thứ ba của slide — là môn toán về các hàng chờ: từ tần suất yêu cầu tới và thời gian phục vụ mỗi yêu cầu, nó dự đoán thời gian chờ và độ dài hàng — dùng để quyết định hệ thống cần bao nhiêu quầy thu ngân, máy chủ hay luồng (thread).</li>
<li>Ứng dụng: danh sách chờ, tài nguyên dùng chung, đa chương trình và lập lịch xoay vòng (round-robin), BFS (tìm kiếm theo chiều rộng), bộ đệm (buffer); hàng đợi ưu tiên cho việc khẩn chạy trước lượt mà không làm xáo trộn phần còn lại.</li>
<li>Phản xạ code cho PE: chỉ số kế tiếp <code>i == max-1 ? 0 : i+1</code>; dequeue của hàng liên kết gán <code>tail = null</code> khi hàng vừa rỗng; chèn có thứ tự thì dời qua cả các phần tử cùng độ ưu tiên (<code>x &lt;= a[i]</code>) khi chúng phải giữ FIFO.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ngăn xếp (stack) — chồng đĩa; queue — hàng lấy cơm; deque — bộ bài; hàng đợi ưu tiên — phòng cấp cứu.</p>
<div class="pitfall">Nhầm lẫn ở FE: "hàng đợi ưu tiên là FIFO" — chỉ đúng giữa các phần tử cùng độ ưu tiên. Nhìn tổng thể, nó xếp theo độ ưu tiên.</div>`],
      [21, 'Reading at home',
        `<p class="y-chinh">🎯 Three sections of Goodrich 6e cover this deck: 6.2 Queues (p.238), 6.3 Double-Ended Queues (p.248) and 9.1 The Priority Queue Abstract Data Type (p.360).</p>
<ul>
<li><strong>§6.2 Queues</strong> — the queue ADT (<code>enqueue</code>, <code>dequeue</code>, <code>first</code>, returning <code>null</code> when empty), an array-based queue that stores the index of the front and the size, a queue on a singly linked list, and the circular queue with <code>rotate()</code> — the source of slide 13.</li>
<li><strong>§6.3 Double-Ended Queues</strong> — the deque ADT of slide 16, two implementations, and the table of <code>java.util.Deque</code> method names.</li>
<li>Read §6.2's array queue next to slides 10–11: it computes the free cell as <code>(f + sz) % data.length</code>, clears <code>data[f]</code> after a dequeue, and throws <code>IllegalStateException</code> when full instead of growing.</li>
<li><strong>§9.1 The Priority Queue ADT</strong> — entries as (key, value) pairs with <code>insert</code>, <code>min</code>, <code>removeMin</code>: the book's convention is the <em>smallest</em> key first, the opposite of the slides' array.</li>
</ul>
<p>Chapter 9 then builds priority queues with sorted and unsorted lists and with heaps — the costs in the lesson's table under slide 19; heaps return in chapter 4 of this course.</p>`,
        `<p class="y-chinh">🎯 Ba mục của sách Goodrich bản 6 ứng với bộ slide này: 6.2 Queues (tr.238), 6.3 Double-Ended Queues (tr.248) và 9.1 The Priority Queue Abstract Data Type (tr.360).</p>
<ul>
<li><strong>§6.2 Queues</strong> (hàng đợi) — ADT (kiểu dữ liệu trừu tượng) hàng đợi (<code>enqueue</code>, <code>dequeue</code>, <code>first</code>, trả về <code>null</code> khi rỗng), hàng đợi bằng mảng lưu chỉ số phần tử đầu và số phần tử, hàng đợi trên danh sách liên kết đơn, và hàng đợi vòng có <code>rotate()</code> — nguồn của slide 13.</li>
<li><strong>§6.3 Double-Ended Queues</strong> (hàng đợi hai đầu) — ADT deque của slide 16, hai cách cài đặt, và bảng tên phương thức của <code>java.util.Deque</code>.</li>
<li>Đọc hàng đợi mảng của §6.2 song song với slide 10–11: sách tính ô trống bằng <code>(f + sz) % data.length</code>, xoá <code>data[f]</code> sau mỗi lần dequeue, và ném <code>IllegalStateException</code> khi đầy thay vì nới mảng.</li>
<li><strong>§9.1 The Priority Queue ADT</strong> (ADT hàng đợi ưu tiên) — mỗi phần tử là một cặp (khoá, giá trị) — (key, value) — với <code>insert</code>, <code>min</code>, <code>removeMin</code>: quy ước của sách là khoá <em>nhỏ nhất</em> ra trước, ngược với mảng của slide.</li>
</ul>
<p>Chương 9 sau đó dựng hàng đợi ưu tiên bằng danh sách có thứ tự, không thứ tự và bằng đống (heap) — đúng các chi phí trong bảng của bài ở phần slide 19; heap sẽ quay lại ở chương 4 của môn.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>The slides' <code>ArrayQueue</code> has max = 5, first = 3, last = 4 and is not full. Where does <code>enqueue(x)</code> put x, and what are first and last afterwards?</li>
<li>Write the two cases of the slides' <code>isFull()</code>.</li>
<li>A linked queue holds one element. Which two references must be <code>null</code> after <code>dequeue()</code>?</li>
<li>Which <code>java.util.Queue</code> methods throw on an empty queue, and which return <code>null</code>?</li>
<li>The slides' priority queue holds 2 5 8 in <code>a[0..top]</code>. After <code>enqueue(6)</code>, how many values were shifted and what does <code>dequeue()</code> return?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) last == max − 1, so it wraps: <code>a[0] = x</code>, last = 0, first stays 3. (2) <code>first == 0 &amp;&amp; last == max-1</code>, or <code>first == last+1</code>. (3) <code>head</code> and <code>tail</code>. (4) <code>remove()</code> and <code>element()</code> throw; <code>poll()</code> and <code>peek()</code> return <code>null</code>. (5) one (the 8): the array becomes 2 5 6 8 and <code>dequeue()</code> returns 8, the largest.</p>
<p><strong>Next:</strong> the deep-dive lessons 2.1–2.5 below — 2.1 stacks and queues side by side, 2.2 circular array vs linked (the modulo version of slides 8–11), 2.3 stack applications (brackets, RPN, undo), 2.4 deques and the sliding-window maximum, 2.5 priority queues and heaps — then lesson 2.6 (practice, glossary, summary) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li><code>ArrayQueue</code> của slide có max = 5, first = 3, last = 4 và chưa đầy. <code>enqueue(x)</code> đặt x vào đâu, và first, last sau đó bằng bao nhiêu?</li>
<li>Viết hai trường hợp của <code>isFull()</code> trên slide.</li>
<li>Hàng đợi liên kết đang có một phần tử. Sau <code>dequeue()</code>, hai tham chiếu (reference) nào phải là <code>null</code>?</li>
<li>Những phương thức nào của <code>java.util.Queue</code> ném ngoại lệ khi hàng rỗng, những phương thức nào trả về <code>null</code>?</li>
<li>Hàng đợi ưu tiên của slide đang chứa 2 5 8 trong <code>a[0..top]</code>. Sau <code>enqueue(6)</code>, có bao nhiêu giá trị bị dời và <code>dequeue()</code> trả về gì?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) last == max − 1 nên quay vòng: <code>a[0] = x</code>, last = 0, first vẫn là 3. (2) <code>first == 0 &amp;&amp; last == max-1</code>, hoặc <code>first == last+1</code>. (3) <code>head</code> và <code>tail</code>. (4) <code>remove()</code> và <code>element()</code> ném ngoại lệ; <code>poll()</code> và <code>peek()</code> trả về <code>null</code>. (5) một giá trị (số 8): mảng thành 2 5 6 8 và <code>dequeue()</code> trả về 8, số lớn nhất.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu 2.1–2.5 bên dưới — 2.1 ngăn xếp (stack) và hàng đợi (queue) đặt cạnh nhau, 2.2 mảng vòng hay liên kết (bản dùng phép chia lấy dư của slide 8–11), 2.3 ứng dụng stack (dấu ngoặc, biểu thức hậu tố RPN, hoàn tác undo), 2.4 deque và bài toán cực đại cửa sổ trượt (sliding-window maximum), 2.5 hàng đợi ưu tiên và đống (heap) — rồi bài 2.6 (thực hành, thuật ngữ, tóm tắt) và quiz của chương.</p>`),
    books([
      ['goodrich', '§6.2 Queues p.238 · §6.3 Double-Ended Queues (Deque) p.248 · §9.1 The Priority Queue Abstract Data Type p.360', '§6.2 Queues tr.238 · §6.3 Double-Ended Queues (Deque) tr.248 · §9.1 The Priority Queue Abstract Data Type tr.360'],
    ]),
  ].join('\n'),
};

/* ───────── 2.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Stacks, queues & priority queues ───────── */
const L_on_ch2 = {
  title: '2.6 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Stacks, queues & priority queues|||2.6 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Ngăn xếp, hàng đợi & hàng đợi ưu tiên',
  slug: 'csd201-on-ch2',
  type: 'VIDEO',
  description: '7 bài tập kiểu đề PE về ngăn xếp và hàng đợi (stack mảng tự nới đúng cách, kiểm tra dấu ngoặc, tính biểu thức hậu tố RPN, hàng đợi mảng vòng có quay vòng và nới rộng, hàng đợi dựng từ hai stack, lập lịch round-robin, hàng đợi ưu tiên bệnh nhân f1–f4 trên danh sách liên kết có thứ tự) có lời giải và test tự kiểm chạy thật; 24 thuật ngữ Anh–Việt; tóm tắt 8 ý, câu hỏi tự kiểm và bảng độ phức tạp của chương 2.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.6 · Practice &amp; review</span>
<h2>Stacks, queues &amp; priority queues — practise like the PE, then review</h2>
<p class="lead">Seven exercises in the shape of the practical exam — from a ten-minute warm-up to a full f1–f4 question — each with a solution that tests itself. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary, a quick self-check and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the methods yourself in Eclipse, on top of the given classes.</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it — each trap was checked by planting that very mistake in the solution: the tests catch it.</li>
</ol>
<p>In a CSD201 PE the skeleton — a <code>Node</code> class, a stack, queue or list class, a <code>main</code> that calls <code>f1</code>, <code>f2</code>, … and writes each answer to a file — is usually given, and you fill in the method bodies. Here every answer is printed on the screen instead of written to a file.</p></div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.6 · Thực hành &amp; ôn tập</span>
<h2>Ngăn xếp, hàng đợi &amp; hàng đợi ưu tiên — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Bảy bài tập theo dạng đề thi thực hành (PE) — từ bài khởi động mười phút tới một câu f1–f4 đầy đủ — bài nào cũng có lời giải tự kiểm tra được. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình, vài câu tự kiểm tra nhanh và bảng độ phức tạp để ôn trước FE (thi cuối kỳ).</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết các hàm trong Eclipse, dựa trên các lớp cho sẵn.</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới — mỗi bẫy đều đã được thử bằng cách cài đúng lỗi đó vào lời giải: test bắt được.</li>
</ol>
<p>Đề PE môn CSD201 thường cho sẵn bộ khung — lớp <code>Node</code>, lớp ngăn xếp (stack), hàng đợi (queue) hoặc danh sách, hàm <code>main</code> gọi <code>f1</code>, <code>f2</code>, … và ghi từng đáp án ra file — còn bạn viết thân các hàm. Ở đây mọi kết quả được in ra màn hình thay vì ghi ra file.</p></div>`),
    bi(`<h3>🧪 Exercise 1 — f1, f2: an array stack that grows correctly (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p><code>MyStack</code> stores <code>int</code>s in an array <code>a</code> with an index <code>top</code> (−1 when empty) and a capacity <code>max</code>. Write <code>push</code> (f1) and <code>pop</code>/<code>top</code> (f2). A push on a full array must call <code>grow()</code>, which doubles the capacity — at least 1 cell — and keeps the elements; <code>pop</code> and <code>top</code> on an empty stack throw <code>java.util.EmptyStackException</code>.</p>
<p class="nhan">Data → expected result</p>
<p>Capacity 2, push 1…10 → capacity 16 (2 → 4 → 8 → 16), and the pops give 10 9 8 … 1.</p>
<p class="nhan">Idea</p>
<p><code>push</code> = <code>if (isFull()) grow(); a[++top] = x;</code>. <code>grow</code> = new array, copy <code>a[0..top]</code>, <code>a = a1</code>, and <code>max = max1</code> — the last line is the one the <code>ArrayStack</code> of deck 2A (slide 10) forgets.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.EmptyStackException;

class MyStack {
    int[] a;
    int top, max;

    MyStack(int max1) { max = max1; a = new int[max]; top = -1; }
    boolean isEmpty() { return top == -1; }
    boolean isFull() { return top == max - 1; }
    int size() { return top + 1; }

    void grow() {                                     // double the array, at least 1 cell
        int max1 = (max == 0) ? 1 : 2 * max;
        int[] a1 = new int[max1];
        for (int i = 0; i &lt;= top; i++) a1[i] = a[i];
        a = a1;
        max = max1;                                   // the line slide 10 forgets
    }
    // f1: push
    void push(int x) {
        if (isFull()) grow();
        a[++top] = x;
    }
    // f2: pop and top
    int pop() {
        if (isEmpty()) throw new EmptyStackException();
        return a[top--];
    }
    int top() {
        if (isEmpty()) throw new EmptyStackException();
        return a[top];
    }
}

public class Pe1ArrayStack {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyStack s = new MyStack(2);
        for (int x = 1; x &lt;= 10; x++) s.push(x);
        check("capacity 2 has grown to 16 after 10 pushes", "max=" + s.max + " size=" + s.size(), "max=16 size=10");
        check("top() does not remove", s.top() + " " + s.top() + " size=" + s.size(), "10 10 size=10");
        StringBuilder b = new StringBuilder();
        while (!s.isEmpty()) b.append(b.length() &gt; 0 ? " " : "").append(s.pop());
        check("pop order is LIFO", b.toString(), "10 9 8 7 6 5 4 3 2 1");
        MyStack z = new MyStack(0);
        z.push(5); z.push(6);
        check("capacity 0 still grows", z.pop() + " " + z.pop(), "6 5");
        String got;
        try { z.pop(); got = "no exception"; } catch (EmptyStackException e) { got = "EmptyStackException"; }
        check("pop on an empty stack throws", got, "EmptyStackException");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS capacity 2 has grown to 16 after 10 pushes<br>
PASS top() does not remove<br>
PASS pop order is LIFO<br>
PASS capacity 0 still grows<br>
PASS pop on an empty stack throws<br>
ALL TESTS PASSED</div>
<div class="pitfall">Remove <code>max = max1;</code> and this test run no longer prints FAIL — it crashes with <code>ArrayIndexOutOfBoundsException: Index 4 out of bounds for length 4</code> at the 5th push, because <code>isFull()</code> compares <code>top</code> with the old <code>max</code>. And <code>2 * max</code> alone never grows a stack created with capacity 0.</div>`,
    `<h3>🧪 Bài 1 — f1, f2: ngăn xếp bằng mảng tự nới đúng cách (kiểu PE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p><code>MyStack</code> lưu các số <code>int</code> trong mảng <code>a</code>, với chỉ số <code>top</code> (bằng −1 khi rỗng) và sức chứa (capacity) <code>max</code>. Viết <code>push</code> — đẩy vào (f1) và <code>pop</code>/<code>top</code> — lấy ra / xem đỉnh (f2). Push vào mảng đầy phải gọi <code>grow()</code> (nới rộng): gấp đôi sức chứa — ít nhất 1 ô — và giữ nguyên các phần tử; <code>pop</code> và <code>top</code> trên ngăn xếp (stack) rỗng ném <code>java.util.EmptyStackException</code>.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Sức chứa 2, push 1…10 → sức chứa 16 (2 → 4 → 8 → 16), và các lần pop cho 10 9 8 … 1.</p>
<p class="nhan">Ý tưởng</p>
<p><code>push</code> = <code>if (isFull()) grow(); a[++top] = x;</code>. <code>grow</code> = tạo mảng mới, chép <code>a[0..top]</code>, gán <code>a = a1</code>, và <code>max = max1</code> — dòng cuối này chính là dòng mà <code>ArrayStack</code> của bộ slide 2A (slide 10) bỏ quên.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.EmptyStackException;

class MyStack {
    int[] a;
    int top, max;

    MyStack(int max1) { max = max1; a = new int[max]; top = -1; }
    boolean isEmpty() { return top == -1; }
    boolean isFull() { return top == max - 1; }
    int size() { return top + 1; }

    void grow() {                                     // gấp đôi mảng, ít nhất 1 ô
        int max1 = (max == 0) ? 1 : 2 * max;
        int[] a1 = new int[max1];
        for (int i = 0; i &lt;= top; i++) a1[i] = a[i];
        a = a1;
        max = max1;                                   // dòng mà slide 10 bỏ quên
    }
    // f1: push
    void push(int x) {
        if (isFull()) grow();
        a[++top] = x;
    }
    // f2: pop và top
    int pop() {
        if (isEmpty()) throw new EmptyStackException();
        return a[top--];
    }
    int top() {
        if (isEmpty()) throw new EmptyStackException();
        return a[top];
    }
}

public class Pe1ArrayStack {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        MyStack s = new MyStack(2);
        for (int x = 1; x &lt;= 10; x++) s.push(x);
        check("capacity 2 has grown to 16 after 10 pushes", "max=" + s.max + " size=" + s.size(), "max=16 size=10");
        check("top() does not remove", s.top() + " " + s.top() + " size=" + s.size(), "10 10 size=10");
        StringBuilder b = new StringBuilder();
        while (!s.isEmpty()) b.append(b.length() &gt; 0 ? " " : "").append(s.pop());
        check("pop order is LIFO", b.toString(), "10 9 8 7 6 5 4 3 2 1");
        MyStack z = new MyStack(0);
        z.push(5); z.push(6);
        check("capacity 0 still grows", z.pop() + " " + z.pop(), "6 5");
        String got;
        try { z.pop(); got = "no exception"; } catch (EmptyStackException e) { got = "EmptyStackException"; }
        check("pop on an empty stack throws", got, "EmptyStackException");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS capacity 2 has grown to 16 after 10 pushes<br>
PASS top() does not remove<br>
PASS pop order is LIFO<br>
PASS capacity 0 still grows<br>
PASS pop on an empty stack throws<br>
ALL TESTS PASSED</div>
<div class="pitfall">Xoá dòng <code>max = max1;</code> thì lần chạy test này không in FAIL nữa mà sập luôn với <code>ArrayIndexOutOfBoundsException: Index 4 out of bounds for length 4</code> ở lần push thứ 5, vì <code>isFull()</code> so <code>top</code> với <code>max</code> cũ. Còn chỉ viết <code>2 * max</code> thì một stack tạo với sức chứa 0 sẽ không bao giờ nới được.</div>`),
    bi(`<h3>🧪 Exercise 2 — f1: balanced brackets (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>boolean isBalanced(String s)</code>: true when every <code>(</code>, <code>[</code>, <code>{</code> is closed by the matching symbol, in the right nesting order; other characters are ignored. Use a stack (<code>ArrayDeque&lt;Character&gt;</code>).</p>
<p class="nhan">Data → expected result</p>
<p>The five expressions of deck 2A, slide 14 (two correct, three incorrect), plus the empty string (true), <code>a[i] = f(b{c})</code> (true) and <code>{[}]</code> (false) — the expected value is written in each test name.</p>
<p class="nhan">Idea</p>
<p>Opening symbol → push. Closing symbol → if the stack is empty, false; otherwise pop and compare the pair. End of the string → balanced only if the stack is empty. One pass: O(n) time, O(n) stack in the worst case.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class Pe2Brackets {
    // f1: true when every ( [ { is closed by its partner, in the right order
    static boolean isBalanced(String s) {
        Deque&lt;Character&gt; st = new ArrayDeque&lt;Character&gt;();
        for (int i = 0; i &lt; s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else if (c == ')' || c == ']' || c == '}') {
                if (st.isEmpty()) return false;                   // a closing symbol with nothing open
                char o = st.pop();
                if ((c == ')' &amp;&amp; o != '(') || (c == ']' &amp;&amp; o != '[') || (c == '}' &amp;&amp; o != '{')) return false;
            }                                                     // other characters are ignored
        }
        return st.isEmpty();                                      // is something still open?
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[][] tests = {
            {"( )(( )){([( )])}", "true"}, {"((( )(( )){([( )])}))", "true"}, {")(( )){([( )])}", "false"},
            {"({[ ])}", "false"}, {"(", "false"}, {"", "true"}, {"a[i] = f(b{c})", "true"}, {"{[}]", "false"}
        };
        for (String[] t : tests) check("isBalanced(\\"" + t[0] + "\\") = " + t[1], String.valueOf(isBalanced(t[0])), t[1]);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS isBalanced("( )(( )){([( )])}") = true<br>
PASS isBalanced("((( )(( )){([( )])}))") = true<br>
PASS isBalanced(")(( )){([( )])}") = false<br>
PASS isBalanced("({[ ])}") = false<br>
PASS isBalanced("(") = false<br>
PASS isBalanced("") = true<br>
PASS isBalanced("a[i] = f(b{c})") = true<br>
PASS isBalanced("{[}]") = false<br>
ALL TESTS PASSED</div>
<div class="pitfall">Two classic losses: (1) returning <code>true</code> at the end instead of <code>st.isEmpty()</code> — then <code>(</code> counts as balanced (the planted-bug run fails exactly that test); (2) calling <code>st.pop()</code> without checking <code>isEmpty()</code> first — on an <code>ArrayDeque</code> that throws <code>NoSuchElementException</code> for inputs such as <code>)(</code>.</div>`,
    `<h3>🧪 Bài 2 — f1: kiểm tra dấu ngoặc cân bằng (kiểu PE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>boolean isBalanced(String s)</code>: trả về true khi mỗi <code>(</code>, <code>[</code>, <code>{</code> được đóng bằng đúng ký hiệu cùng cặp, theo đúng thứ tự lồng nhau; các ký tự khác bỏ qua. Dùng một ngăn xếp (stack) — <code>ArrayDeque&lt;Character&gt;</code>.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Năm biểu thức của bộ slide 2A, slide 14 (hai đúng, ba sai), cộng chuỗi rỗng (true), <code>a[i] = f(b{c})</code> (true) và <code>{[}]</code> (false) — giá trị mong đợi ghi ngay trong tên mỗi test.</p>
<p class="nhan">Ý tưởng</p>
<p>Ký hiệu mở → push (đẩy vào). Ký hiệu đóng → nếu stack rỗng thì false; ngược lại pop (lấy ra) và so cặp. Hết chuỗi → chỉ cân bằng khi stack rỗng. Một lượt quét: thời gian O(n), stack tốn O(n) trong trường hợp xấu nhất.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class Pe2Brackets {
    // f1: true khi mọi ( [ { được đóng đúng cặp, đúng thứ tự
    static boolean isBalanced(String s) {
        Deque&lt;Character&gt; st = new ArrayDeque&lt;Character&gt;();
        for (int i = 0; i &lt; s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else if (c == ')' || c == ']' || c == '}') {
                if (st.isEmpty()) return false;                   // ký hiệu đóng mà chưa có gì mở
                char o = st.pop();
                if ((c == ')' &amp;&amp; o != '(') || (c == ']' &amp;&amp; o != '[') || (c == '}' &amp;&amp; o != '{')) return false;
            }                                                     // ký tự khác bỏ qua
        }
        return st.isEmpty();                                      // còn gì chưa đóng?
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[][] tests = {
            {"( )(( )){([( )])}", "true"}, {"((( )(( )){([( )])}))", "true"}, {")(( )){([( )])}", "false"},
            {"({[ ])}", "false"}, {"(", "false"}, {"", "true"}, {"a[i] = f(b{c})", "true"}, {"{[}]", "false"}
        };
        for (String[] t : tests) check("isBalanced(\\"" + t[0] + "\\") = " + t[1], String.valueOf(isBalanced(t[0])), t[1]);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS isBalanced("( )(( )){([( )])}") = true<br>
PASS isBalanced("((( )(( )){([( )])}))") = true<br>
PASS isBalanced(")(( )){([( )])}") = false<br>
PASS isBalanced("({[ ])}") = false<br>
PASS isBalanced("(") = false<br>
PASS isBalanced("") = true<br>
PASS isBalanced("a[i] = f(b{c})") = true<br>
PASS isBalanced("{[}]") = false<br>
ALL TESTS PASSED</div>
<div class="pitfall">Hai cách mất điểm kinh điển: (1) cuối hàm trả về <code>true</code> thay vì <code>st.isEmpty()</code> — khi đó <code>(</code> bị coi là cân bằng (bản cài lỗi thử nghiệm hỏng đúng test đó); (2) gọi <code>st.pop()</code> mà không kiểm tra <code>isEmpty()</code> trước — với <code>ArrayDeque</code> sẽ văng <code>NoSuchElementException</code> ở đầu vào như <code>)(</code>.</div>`),
    bi(`<h3>🧪 Exercise 3 — f1: evaluate a postfix (RPN) expression (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>int evalRPN(String expr)</code>. Tokens are separated by spaces: integers (possibly negative, like <code>-3</code>) and the operators <code>+ - * /</code> (integer division). Throw <code>IllegalArgumentException</code> when the expression is malformed — an operator without two operands, several values left at the end, or a token that is not a number.</p>
<p class="nhan">Idea</p>
<p>A number → push it. An operator → <code>b = pop()</code>, <code>a = pop()</code>, push <code>a op b</code>. At the end exactly one value must remain — that is the result.</p>
<table>
<thead><tr><th>Token</th><th>Action</th><th>Stack after (bottom → top)</th></tr></thead>
<tbody>
<tr><td>5, 1, 2</td><td>push, push, push</td><td>5 1 2</td></tr>
<tr><td><code>+</code></td><td>b = 2, a = 1, push 3</td><td>5 3</td></tr>
<tr><td>4</td><td>push</td><td>5 3 4</td></tr>
<tr><td><code>*</code></td><td>b = 4, a = 3, push 12</td><td>5 12</td></tr>
<tr><td><code>+</code></td><td>b = 12, a = 5, push 17</td><td>17</td></tr>
<tr><td>3</td><td>push</td><td>17 3</td></tr>
<tr><td><code>-</code></td><td>b = 3, a = 17, push 14</td><td>14 → one value left: the result is 14</td></tr>
</tbody>
</table>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class Pe3Postfix {
    // f1: value of a postfix (RPN) expression whose tokens are separated by spaces
    static int evalRPN(String expr) {
        Deque&lt;Integer&gt; st = new ArrayDeque&lt;Integer&gt;();
        for (String t : expr.trim().split(" +")) {
            if (t.length() == 1 &amp;&amp; "+-*/".indexOf(t.charAt(0)) &gt;= 0) {
                if (st.size() &lt; 2) throw new IllegalArgumentException("missing operand");
                int b = st.pop(), a = st.pop();                   // b was pushed LAST
                switch (t.charAt(0)) {
                    case '+': st.push(a + b); break;
                    case '-': st.push(a - b); break;
                    case '*': st.push(a * b); break;
                    default:  st.push(a / b);
                }
            } else st.push(Integer.parseInt(t));                  // a number, possibly negative
        }
        if (st.size() != 1) throw new IllegalArgumentException("too many operands");
        return st.pop();
    }

    static String run(String e) {
        try { return String.valueOf(evalRPN(e)); } catch (IllegalArgumentException x) { return "error"; }
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[][] tests = {
            {"5 1 2 + 4 * + 3 -", "14"}, {"7 2 -", "5"}, {"8 2 /", "4"}, {"4 2 5 * + 1 3 2 * + /", "2"},
            {"-3 4 *", "-12"}, {"5 +", "error"}, {"1 2", "error"}, {"2 x +", "error"}
        };
        for (String[] t : tests) check("\\"" + t[0] + "\\" = " + t[1], run(t[0]), t[1]);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS "5 1 2 + 4 * + 3 -" = 14<br>
PASS "7 2 -" = 5<br>
PASS "8 2 /" = 4<br>
PASS "4 2 5 * + 1 3 2 * + /" = 2<br>
PASS "-3 4 *" = -12<br>
PASS "5 +" = error<br>
PASS "1 2" = error<br>
PASS "2 x +" = error<br>
ALL TESTS PASSED</div>
<div class="pitfall">The first pop is the <em>right</em> operand. Writing <code>int a = st.pop(), b = st.pop();</code> turns 14 into −14 and <code>7 2 -</code> into −5 — the planted-bug run fails four tests. Also, <code>-3</code> is a number but <code>-</code> is an operator: test the token's length before treating it as an operator.</div>`,
    `<h3>🧪 Bài 3 — f1: tính giá trị biểu thức hậu tố (RPN) (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>int evalRPN(String expr)</code> tính biểu thức hậu tố (postfix, còn gọi là RPN — ký pháp Ba Lan ngược). Các token (từng mẩu của biểu thức: một số hoặc một toán tử) cách nhau bởi dấu cách: số nguyên (có thể âm, như <code>-3</code>) và các toán tử <code>+ - * /</code> (chia nguyên). Ném <code>IllegalArgumentException</code> khi biểu thức sai — một toán tử không đủ hai toán hạng, cuối cùng còn lại nhiều giá trị, hoặc một token không phải là số.</p>
<p class="nhan">Ý tưởng</p>
<p>Gặp số → push (đẩy vào ngăn xếp). Gặp toán tử → <code>b = pop()</code>, <code>a = pop()</code>, push <code>a op b</code>. Cuối cùng phải còn đúng một giá trị — đó là kết quả.</p>
<table>
<thead><tr><th>Token</th><th>Việc làm</th><th>Stack sau đó (đáy → đỉnh)</th></tr></thead>
<tbody>
<tr><td>5, 1, 2</td><td>push, push, push</td><td>5 1 2</td></tr>
<tr><td><code>+</code></td><td>b = 2, a = 1, push 3</td><td>5 3</td></tr>
<tr><td>4</td><td>push</td><td>5 3 4</td></tr>
<tr><td><code>*</code></td><td>b = 4, a = 3, push 12</td><td>5 12</td></tr>
<tr><td><code>+</code></td><td>b = 12, a = 5, push 17</td><td>17</td></tr>
<tr><td>3</td><td>push</td><td>17 3</td></tr>
<tr><td><code>-</code></td><td>b = 3, a = 17, push 14</td><td>14 → còn một giá trị: kết quả là 14</td></tr>
</tbody>
</table>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;

public class Pe3Postfix {
    // f1: giá trị biểu thức hậu tố (RPN), các token cách nhau bởi dấu cách
    static int evalRPN(String expr) {
        Deque&lt;Integer&gt; st = new ArrayDeque&lt;Integer&gt;();
        for (String t : expr.trim().split(" +")) {
            if (t.length() == 1 &amp;&amp; "+-*/".indexOf(t.charAt(0)) &gt;= 0) {
                if (st.size() &lt; 2) throw new IllegalArgumentException("missing operand");
                int b = st.pop(), a = st.pop();                   // b được push SAU CÙNG
                switch (t.charAt(0)) {
                    case '+': st.push(a + b); break;
                    case '-': st.push(a - b); break;
                    case '*': st.push(a * b); break;
                    default:  st.push(a / b);
                }
            } else st.push(Integer.parseInt(t));                  // một số, có thể âm
        }
        if (st.size() != 1) throw new IllegalArgumentException("too many operands");
        return st.pop();
    }

    static String run(String e) {
        try { return String.valueOf(evalRPN(e)); } catch (IllegalArgumentException x) { return "error"; }
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[][] tests = {
            {"5 1 2 + 4 * + 3 -", "14"}, {"7 2 -", "5"}, {"8 2 /", "4"}, {"4 2 5 * + 1 3 2 * + /", "2"},
            {"-3 4 *", "-12"}, {"5 +", "error"}, {"1 2", "error"}, {"2 x +", "error"}
        };
        for (String[] t : tests) check("\\"" + t[0] + "\\" = " + t[1], run(t[0]), t[1]);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS "5 1 2 + 4 * + 3 -" = 14<br>
PASS "7 2 -" = 5<br>
PASS "8 2 /" = 4<br>
PASS "4 2 5 * + 1 3 2 * + /" = 2<br>
PASS "-3 4 *" = -12<br>
PASS "5 +" = error<br>
PASS "1 2" = error<br>
PASS "2 x +" = error<br>
ALL TESTS PASSED</div>
<div class="pitfall">Lần pop đầu tiên là toán hạng <em>bên phải</em>. Viết <code>int a = st.pop(), b = st.pop();</code> sẽ biến 14 thành −14 và <code>7 2 -</code> thành −5 — bản cài lỗi thử nghiệm hỏng bốn test. Thêm nữa, <code>-3</code> là một số còn <code>-</code> là toán tử: hãy xét độ dài token trước khi coi nó là toán tử.</div>`),
    bi(`<h3>🧪 Exercise 4 — f1, f2: circular array queue with wrap-around and growth (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>With the fields of deck 2B — array <code>a</code>, capacity <code>max</code> (at least 1), indices <code>first</code> and <code>last</code>, −1 when empty — write <code>enqueue</code> (f1) and <code>dequeue</code> (f2). After the last cell comes cell 0. When the array is full, <code>enqueue</code> doubles it and keeps the <em>queue</em> order; <code>dequeue</code> on an empty queue throws <code>EmptyQueueException</code>.</p>
<p class="nhan">Idea</p>
<p>Next index: <code>(i + 1) % max</code>. Full ⇔ <code>(last + 1) % max == first</code> — the same condition as the two cases of the slides' <code>isFull()</code>. <code>grow</code> copies <code>a[(first + k) % max]</code> into <code>a1[k]</code> for k = 0 … size − 1: one loop instead of the slides' two branches.</p>
<pre><code class="language-plaintext">the first test: capacity 4; enqueue 1, 2, 3; dequeue x2; enqueue 4, 5, 6
index:   0   1   2   3
a:     [ 5 | 6 | 3 | 4 ]     first = 2, last = 1  -&gt;  queue 3 4 5 6 (full)

enqueue(7): grow, a1[k] = a[(2 + k) % 4]  -&gt;  [ 3 | 4 | 5 | 6 | 7 | _ | _ | _ ]   first = 0, last = 4</code></pre>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class EmptyQueueException extends RuntimeException {}

class ArrayQueue {
    int[] a;
    int max, first = -1, last = -1;                    // -1 = empty, as on the slides

    ArrayQueue(int max1) { max = max1; a = new int[max]; }       // max1 &gt;= 1
    boolean isEmpty() { return first == -1; }
    boolean isFull() { return !isEmpty() &amp;&amp; (last + 1) % max == first; }   // = the slides' two cases
    int size() { return isEmpty() ? 0 : (last - first + max) % max + 1; }

    void grow() {                                      // copy in QUEUE order, not array order
        int n = size(), max1 = 2 * max;
        int[] a1 = new int[max1];
        for (int k = 0; k &lt; n; k++) a1[k] = a[(first + k) % max];
        a = a1; first = 0; last = n - 1; max = max1;
    }
    // f1: enqueue
    void enqueue(int x) {
        if (isFull()) grow();
        if (isEmpty()) first = last = 0;
        else last = (last + 1) % max;                  // after the last cell comes cell 0
        a[last] = x;
    }
    // f2: dequeue
    int dequeue() {
        if (isEmpty()) throw new EmptyQueueException();
        int x = a[first];
        if (first == last) first = last = -1;          // it was the only element
        else first = (first + 1) % max;
        return x;
    }
    public String toString() {                         // front -&gt; rear
        StringBuilder b = new StringBuilder();
        for (int k = 0; k &lt; size(); k++) b.append(k &gt; 0 ? " " : "").append(a[(first + k) % max]);
        return b.toString();
    }
}

public class Pe4CircularQueue {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        ArrayQueue q = new ArrayQueue(4);
        q.enqueue(1); q.enqueue(2); q.enqueue(3);
        q.dequeue(); q.dequeue();
        q.enqueue(4); q.enqueue(5); q.enqueue(6);
        check("wrap-around keeps FIFO order", q + " | first=" + q.first + " last=" + q.last, "3 4 5 6 | first=2 last=1");
        check("full after wrapping", String.valueOf(q.isFull()), "true");
        q.enqueue(7);
        check("grow while wrapped keeps the order", q + " | max=" + q.max, "3 4 5 6 7 | max=8");
        StringBuilder b = new StringBuilder();
        while (!q.isEmpty()) b.append(b.length() &gt; 0 ? " " : "").append(q.dequeue());
        check("dequeue order", b.toString(), "3 4 5 6 7");
        String got;
        try { q.dequeue(); got = "no exception"; } catch (EmptyQueueException e) { got = "EmptyQueueException"; }
        check("dequeue on an empty queue throws", got, "EmptyQueueException");
        ArrayQueue one = new ArrayQueue(1);
        one.enqueue(1); one.enqueue(2); one.enqueue(3);
        check("capacity 1 grows without losing data", one.dequeue() + " " + one.dequeue() + " " + one.dequeue(), "1 2 3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS wrap-around keeps FIFO order<br>
PASS full after wrapping<br>
PASS grow while wrapped keeps the order<br>
PASS dequeue order<br>
PASS dequeue on an empty queue throws<br>
PASS capacity 1 grows without losing data<br>
ALL TESTS PASSED</div>
<div class="pitfall">Growing with <code>a1[k] = a[k]</code> copies the <em>physical</em> order: the planted-bug run prints 5 6 3 4 7 instead of 3 4 5 6 7. And capacity 0 cannot work: the first <code>enqueue</code> already writes <code>a[0]</code> of an empty array (<code>ArrayIndexOutOfBoundsException</code>), <code>2 * max</code> would stay 0, and <code>% 0</code> throws <code>ArithmeticException</code> — that is why the constructor requires a capacity of at least 1.</div>`,
    `<h3>🧪 Bài 4 — f1, f2: hàng đợi mảng vòng có quay vòng và nới rộng (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Với các trường của bộ slide 2B — mảng <code>a</code>, sức chứa (capacity) <code>max</code> (ít nhất 1), hai chỉ số <code>first</code> và <code>last</code>, bằng −1 khi rỗng — viết <code>enqueue</code> — đưa vào hàng (f1) và <code>dequeue</code> — lấy khỏi hàng (f2). Sau ô cuối là ô 0 (mảng vòng — circular array). Khi mảng đầy, <code>enqueue</code> gấp đôi mảng và giữ đúng thứ tự <em>hàng đợi</em>; <code>dequeue</code> trên hàng đợi (queue) rỗng ném <code>EmptyQueueException</code>.</p>
<p class="nhan">Ý tưởng</p>
<p>Chỉ số kế tiếp: <code>(i + 1) % max</code>. Đầy ⇔ <code>(last + 1) % max == first</code> — cùng điều kiện với hai trường hợp của <code>isFull()</code> trên slide. <code>grow</code> chép <code>a[(first + k) % max]</code> vào <code>a1[k]</code> với k = 0 … size − 1: một vòng lặp thay cho hai nhánh của slide.</p>
<pre><code class="language-plaintext">test đầu tiên: sức chứa 4; enqueue 1, 2, 3; dequeue x2; enqueue 4, 5, 6
chỉ số:  0   1   2   3
a:     [ 5 | 6 | 3 | 4 ]     first = 2, last = 1  -&gt;  hàng đợi 3 4 5 6 (đầy)

enqueue(7): nới mảng, a1[k] = a[(2 + k) % 4]  -&gt;  [ 3 | 4 | 5 | 6 | 7 | _ | _ | _ ]   first = 0, last = 4</code></pre>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class EmptyQueueException extends RuntimeException {}

class ArrayQueue {
    int[] a;
    int max, first = -1, last = -1;                    // -1 = rỗng, như trên slide

    ArrayQueue(int max1) { max = max1; a = new int[max]; }       // max1 &gt;= 1
    boolean isEmpty() { return first == -1; }
    boolean isFull() { return !isEmpty() &amp;&amp; (last + 1) % max == first; }   // = hai trường hợp của slide
    int size() { return isEmpty() ? 0 : (last - first + max) % max + 1; }

    void grow() {                                      // chép theo thứ tự HÀNG ĐỢI, không theo thứ tự mảng
        int n = size(), max1 = 2 * max;
        int[] a1 = new int[max1];
        for (int k = 0; k &lt; n; k++) a1[k] = a[(first + k) % max];
        a = a1; first = 0; last = n - 1; max = max1;
    }
    // f1: enqueue
    void enqueue(int x) {
        if (isFull()) grow();
        if (isEmpty()) first = last = 0;
        else last = (last + 1) % max;                  // sau ô cuối là ô 0
        a[last] = x;
    }
    // f2: dequeue
    int dequeue() {
        if (isEmpty()) throw new EmptyQueueException();
        int x = a[first];
        if (first == last) first = last = -1;          // đó là phần tử duy nhất
        else first = (first + 1) % max;
        return x;
    }
    public String toString() {                         // đầu -&gt; cuối
        StringBuilder b = new StringBuilder();
        for (int k = 0; k &lt; size(); k++) b.append(k &gt; 0 ? " " : "").append(a[(first + k) % max]);
        return b.toString();
    }
}

public class Pe4CircularQueue {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        ArrayQueue q = new ArrayQueue(4);
        q.enqueue(1); q.enqueue(2); q.enqueue(3);
        q.dequeue(); q.dequeue();
        q.enqueue(4); q.enqueue(5); q.enqueue(6);
        check("wrap-around keeps FIFO order", q + " | first=" + q.first + " last=" + q.last, "3 4 5 6 | first=2 last=1");
        check("full after wrapping", String.valueOf(q.isFull()), "true");
        q.enqueue(7);
        check("grow while wrapped keeps the order", q + " | max=" + q.max, "3 4 5 6 7 | max=8");
        StringBuilder b = new StringBuilder();
        while (!q.isEmpty()) b.append(b.length() &gt; 0 ? " " : "").append(q.dequeue());
        check("dequeue order", b.toString(), "3 4 5 6 7");
        String got;
        try { q.dequeue(); got = "no exception"; } catch (EmptyQueueException e) { got = "EmptyQueueException"; }
        check("dequeue on an empty queue throws", got, "EmptyQueueException");
        ArrayQueue one = new ArrayQueue(1);
        one.enqueue(1); one.enqueue(2); one.enqueue(3);
        check("capacity 1 grows without losing data", one.dequeue() + " " + one.dequeue() + " " + one.dequeue(), "1 2 3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS wrap-around keeps FIFO order<br>
PASS full after wrapping<br>
PASS grow while wrapped keeps the order<br>
PASS dequeue order<br>
PASS dequeue on an empty queue throws<br>
PASS capacity 1 grows without losing data<br>
ALL TESTS PASSED</div>
<div class="pitfall">Nới mảng bằng <code>a1[k] = a[k]</code> là chép theo thứ tự <em>vật lý</em>: bản cài lỗi thử nghiệm in ra 5 6 3 4 7 thay vì 3 4 5 6 7. Còn sức chứa 0 thì không chạy được: ngay lần <code>enqueue</code> đầu tiên đã ghi vào <code>a[0]</code> của mảng rỗng (<code>ArrayIndexOutOfBoundsException</code>), <code>2 * max</code> mãi là 0, và <code>% 0</code> ném <code>ArithmeticException</code> — vì vậy constructor (hàm dựng) đòi sức chứa ít nhất 1.</div>`),
    bi(`<h3>🧪 Exercise 5 — a queue made of two stacks (interview classic · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Implement <code>enqueue</code>, <code>dequeue</code>, <code>front</code>, <code>isEmpty</code>, <code>size</code> of a FIFO queue using only two stacks, <code>in</code> and <code>out</code> — no array, no list. Every operation must cost O(1) amortized.</p>
<p class="nhan">Data → expected result</p>
<p>enqueue 1, 2; dequeue → 1; enqueue 3; dequeue, dequeue → 2, 3 (FIFO even when calls interleave). 100 enqueues then 100 dequeues → 1 … 100, each element moved from <code>in</code> to <code>out</code> exactly once.</p>
<p class="nhan">Idea</p>
<p><code>enqueue</code> pushes on <code>in</code>. <code>dequeue</code>/<code>front</code> work on <code>out</code>; only when <code>out</code> is <strong>empty</strong>, pour all of <code>in</code> into <code>out</code> — pouring reverses the order, so the oldest element ends up on top. Each element is moved at most once, so n operations cost O(n) in total even though one pour can cost O(n).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

class TwoStackQueue {
    private Deque&lt;Integer&gt; in = new ArrayDeque&lt;Integer&gt;();    // new elements are pushed here
    private Deque&lt;Integer&gt; out = new ArrayDeque&lt;Integer&gt;();   // elements leave from here
    int moves = 0;                                            // elements moved from in to out

    void enqueue(int x) { in.push(x); }
    private void refill() {                                   // pour ONLY when out is empty
        if (out.isEmpty())
            while (!in.isEmpty()) { out.push(in.pop()); moves++; }
    }
    int dequeue() {
        refill();
        if (out.isEmpty()) throw new NoSuchElementException("empty queue");
        return out.pop();
    }
    int front() {
        refill();
        if (out.isEmpty()) throw new NoSuchElementException("empty queue");
        return out.peek();
    }
    boolean isEmpty() { return in.isEmpty() &amp;&amp; out.isEmpty(); }
    int size() { return in.size() + out.size(); }
}

public class Pe5TwoStackQueue {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        TwoStackQueue q = new TwoStackQueue();
        q.enqueue(1); q.enqueue(2);
        String a = String.valueOf(q.dequeue());
        q.enqueue(3);                                         // arrives while 2 is still waiting in out
        check("FIFO with interleaved calls", a + " " + q.dequeue() + " " + q.dequeue(), "1 2 3");
        q.enqueue(4);
        check("front() does not remove", q.front() + " " + q.front() + " size=" + q.size(), "4 4 size=1");
        TwoStackQueue big = new TwoStackQueue();
        for (int i = 1; i &lt;= 100; i++) big.enqueue(i);
        long sum = 0;
        while (!big.isEmpty()) sum += big.dequeue();
        check("100 elements: each moved exactly once", "moves=" + big.moves + " sum=" + sum, "moves=100 sum=5050");
        String got;
        try { big.dequeue(); got = "no exception"; } catch (NoSuchElementException e) { got = "NoSuchElementException"; }
        check("dequeue on an empty queue throws", got, "NoSuchElementException");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS FIFO with interleaved calls<br>
PASS front() does not remove<br>
PASS 100 elements: each moved exactly once<br>
PASS dequeue on an empty queue throws<br>
ALL TESTS PASSED</div>
<div class="pitfall">Pouring on every dequeue, even when <code>out</code> still holds elements, puts newer elements on top of older ones: the interleaved test then returns 1 3 2 instead of 1 2 3. The rule is "refill <code>out</code> only when it is empty".</div>`,
    `<h3>🧪 Bài 5 — hàng đợi dựng từ hai ngăn xếp (câu phỏng vấn kinh điển · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Cài đặt <code>enqueue</code>, <code>dequeue</code>, <code>front</code>, <code>isEmpty</code>, <code>size</code> của một hàng đợi (queue) FIFO — vào trước ra trước — chỉ dùng hai ngăn xếp (stack) <code>in</code> và <code>out</code> — không mảng, không danh sách. Mọi thao tác phải tốn O(1) khấu hao (amortized).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>enqueue 1, 2; dequeue → 1; enqueue 3; dequeue, dequeue → 2, 3 (vẫn FIFO khi các lời gọi xen kẽ nhau). 100 lần enqueue rồi 100 lần dequeue → 1 … 100, mỗi phần tử được chuyển từ <code>in</code> sang <code>out</code> đúng một lần.</p>
<p class="nhan">Ý tưởng</p>
<p><code>enqueue</code> push (đẩy) vào <code>in</code>. <code>dequeue</code>/<code>front</code> làm việc trên <code>out</code>; chỉ khi <code>out</code> <strong>rỗng</strong> mới đổ toàn bộ <code>in</code> sang <code>out</code> — đổ sang thì thứ tự bị đảo, nên phần tử cũ nhất nằm trên đỉnh. Mỗi phần tử bị chuyển nhiều nhất một lần, nên n thao tác tốn tổng cộng O(n), dù một lần đổ có thể tốn O(n).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Deque;
import java.util.NoSuchElementException;

class TwoStackQueue {
    private Deque&lt;Integer&gt; in = new ArrayDeque&lt;Integer&gt;();    // phần tử mới được push vào đây
    private Deque&lt;Integer&gt; out = new ArrayDeque&lt;Integer&gt;();   // phần tử rời hàng từ đây
    int moves = 0;                                            // số phần tử đã chuyển từ in sang out

    void enqueue(int x) { in.push(x); }
    private void refill() {                                   // CHỈ đổ khi out rỗng
        if (out.isEmpty())
            while (!in.isEmpty()) { out.push(in.pop()); moves++; }
    }
    int dequeue() {
        refill();
        if (out.isEmpty()) throw new NoSuchElementException("empty queue");
        return out.pop();
    }
    int front() {
        refill();
        if (out.isEmpty()) throw new NoSuchElementException("empty queue");
        return out.peek();
    }
    boolean isEmpty() { return in.isEmpty() &amp;&amp; out.isEmpty(); }
    int size() { return in.size() + out.size(); }
}

public class Pe5TwoStackQueue {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        TwoStackQueue q = new TwoStackQueue();
        q.enqueue(1); q.enqueue(2);
        String a = String.valueOf(q.dequeue());
        q.enqueue(3);                                         // tới khi 2 còn chờ trong out
        check("FIFO with interleaved calls", a + " " + q.dequeue() + " " + q.dequeue(), "1 2 3");
        q.enqueue(4);
        check("front() does not remove", q.front() + " " + q.front() + " size=" + q.size(), "4 4 size=1");
        TwoStackQueue big = new TwoStackQueue();
        for (int i = 1; i &lt;= 100; i++) big.enqueue(i);
        long sum = 0;
        while (!big.isEmpty()) sum += big.dequeue();
        check("100 elements: each moved exactly once", "moves=" + big.moves + " sum=" + sum, "moves=100 sum=5050");
        String got;
        try { big.dequeue(); got = "no exception"; } catch (NoSuchElementException e) { got = "NoSuchElementException"; }
        check("dequeue on an empty queue throws", got, "NoSuchElementException");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS FIFO with interleaved calls<br>
PASS front() does not remove<br>
PASS 100 elements: each moved exactly once<br>
PASS dequeue on an empty queue throws<br>
ALL TESTS PASSED</div>
<div class="pitfall">Đổ sang ở mọi lần dequeue, kể cả khi <code>out</code> còn phần tử, sẽ đặt phần tử mới lên trên phần tử cũ: test xen kẽ khi đó trả về 1 3 2 thay vì 1 2 3. Quy tắc là "chỉ đổ đầy <code>out</code> khi nó đã rỗng".</div>`),
    bi(`<h3>🧪 Exercise 6 — f1: a round-robin scheduler with ArrayDeque (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Jobs <code>Task(name, time)</code> arrive in the order of the arrays. The CPU gives each job at most <code>q</code> time units per turn, in round-robin order (deck 2B, slide 7). Return the finishing order as <code>name@time</code>. Rows whose time is 0 or negative are skipped.</p>
<p class="nhan">Data → expected result</p>
<p>P1 5, P2 2, P3 4, q = 2 → <code>P2@4 P3@10 P1@11</code> — the trace of lesson 2.B, slide 7.</p>
<p class="nhan">Idea</p>
<p>A <code>Queue&lt;Task&gt;</code> of ready jobs. Loop: dequeue a job, run it for <code>min(q, left)</code> units, advance the clock by that amount; if time is left, enqueue it again, otherwise record <code>name@clock</code>. Each turn is O(1); the number of turns is the sum of ⌈time / q⌉ over all jobs.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Queue;

class Task {
    String name;
    int left;                                        // time units still needed
    Task(String name, int time) { this.name = name; this.left = time; }
}

public class Pe6RoundRobin {
    // f1: finishing order as "name@time" with quantum q
    static String schedule(String[] names, int[] times, int q) {
        Queue&lt;Task&gt; ready = new ArrayDeque&lt;Task&gt;();
        for (int i = 0; i &lt; names.length; i++)
            if (times[i] &gt; 0) ready.add(new Task(names[i], times[i]));   // skip invalid rows
        StringBuilder done = new StringBuilder();
        int clock = 0;
        while (!ready.isEmpty()) {
            Task t = ready.remove();                 // 1. dequeue
            int run = Math.min(q, t.left);           // 2. run for at most one quantum
            clock += run;
            t.left -= run;
            if (t.left &gt; 0) ready.add(t);            // 3. not finished: back to the rear
            else done.append(done.length() &gt; 0 ? " " : "").append(t.name).append('@').append(clock);
        }
        return done.toString();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[] p = {"P1", "P2", "P3"};
        int[] t = {5, 2, 4};
        check("quantum 2 (lesson 2.B, slide 7)", schedule(p, t, 2), "P2@4 P3@10 P1@11");
        check("quantum 1", schedule(p, t, 1), "P2@5 P3@10 P1@11");
        check("quantum &gt;= every job = first come, first served", schedule(p, t, 10), "P1@5 P2@7 P3@11");
        check("rows with time &lt;= 0 are skipped", schedule(new String[] {"A", "B", "C"}, new int[] {3, 0, 2}, 2), "C@4 A@5");
        check("no job at all", schedule(new String[0], new int[0], 2), "");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS quantum 2 (lesson 2.B, slide 7)<br>
PASS quantum 1<br>
PASS quantum &gt;= every job = first come, first served<br>
PASS rows with time &lt;= 0 are skipped<br>
PASS no job at all<br>
ALL TESTS PASSED</div>
<div class="pitfall">Adding the whole quantum to the clock (<code>clock += q</code>) instead of the time actually used makes the last turn too long: P1 then finishes at 12, not 11, and three tests fail. Only a job that uses its full turn consumes all q units.</div>`,
    `<h3>🧪 Bài 6 — f1: lập lịch xoay vòng (round-robin) bằng ArrayDeque (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Các công việc <code>Task(name, time)</code> tới theo thứ tự trong mảng. CPU cho mỗi việc tối đa <code>q</code> đơn vị thời gian mỗi lượt, theo kiểu xoay vòng (round-robin, bộ slide 2B, slide 7). Trả về thứ tự hoàn thành dạng <code>name@time</code>. Những dòng có thời gian bằng 0 hoặc âm bị bỏ qua.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>P1 5, P2 2, P3 4, q = 2 → <code>P2@4 P3@10 P1@11</code> — đúng bảng lần theo của bài 2.B, slide 7.</p>
<p class="nhan">Ý tưởng</p>
<p>Một hàng đợi <code>Queue&lt;Task&gt;</code> chứa các việc sẵn sàng. Lặp: lấy (dequeue) một việc ra, cho chạy <code>min(q, left)</code> đơn vị, đồng hồ tăng đúng chừng đó; nếu còn thời gian thì đưa (enqueue) lại vào cuối hàng, nếu không thì ghi <code>name@clock</code>. Mỗi lượt O(1); số lượt bằng tổng ⌈time / q⌉ của mọi việc.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayDeque;
import java.util.Queue;

class Task {
    String name;
    int left;                                        // số đơn vị thời gian còn cần
    Task(String name, int time) { this.name = name; this.left = time; }
}

public class Pe6RoundRobin {
    // f1: thứ tự hoàn thành dạng "tên@thời điểm", lượng tử q
    static String schedule(String[] names, int[] times, int q) {
        Queue&lt;Task&gt; ready = new ArrayDeque&lt;Task&gt;();
        for (int i = 0; i &lt; names.length; i++)
            if (times[i] &gt; 0) ready.add(new Task(names[i], times[i]));   // bỏ qua dòng không hợp lệ
        StringBuilder done = new StringBuilder();
        int clock = 0;
        while (!ready.isEmpty()) {
            Task t = ready.remove();                 // 1. dequeue
            int run = Math.min(q, t.left);           // 2. chạy tối đa một lượng tử
            clock += run;
            t.left -= run;
            if (t.left &gt; 0) ready.add(t);            // 3. chưa xong: về cuối hàng
            else done.append(done.length() &gt; 0 ? " " : "").append(t.name).append('@').append(clock);
        }
        return done.toString();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[] p = {"P1", "P2", "P3"};
        int[] t = {5, 2, 4};
        check("quantum 2 (lesson 2.B, slide 7)", schedule(p, t, 2), "P2@4 P3@10 P1@11");
        check("quantum 1", schedule(p, t, 1), "P2@5 P3@10 P1@11");
        check("quantum &gt;= every job = first come, first served", schedule(p, t, 10), "P1@5 P2@7 P3@11");
        check("rows with time &lt;= 0 are skipped", schedule(new String[] {"A", "B", "C"}, new int[] {3, 0, 2}, 2), "C@4 A@5");
        check("no job at all", schedule(new String[0], new int[0], 2), "");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS quantum 2 (lesson 2.B, slide 7)<br>
PASS quantum 1<br>
PASS quantum &gt;= every job = first come, first served<br>
PASS rows with time &lt;= 0 are skipped<br>
PASS no job at all<br>
ALL TESTS PASSED</div>
<div class="pitfall">Cộng nguyên lượng tử vào đồng hồ (<code>clock += q</code>) thay vì thời gian thật sự đã chạy làm lượt cuối dài quá: P1 khi đó xong ở 12 chứ không phải 11, và ba test hỏng. Chỉ việc nào chạy hết lượt mới tiêu hết q đơn vị.</div>`),
    bi(`<h3>🧪 Exercise 7 — PE simulation: a patient priority queue, f1–f4 (~25 min)</h3>
<p class="nhan">Task</p>
<p>Skeleton given: <code>Patient(name, severity)</code> with severity 1 (mild) … 5 (critical), <code>Node</code>, and <code>PatientQueue</code> with <code>head</code> — a singly linked list kept in order, the most urgent patient first. Write:</p>
<ul>
<li><strong>f1</strong> <code>enqueue(name, severity)</code> — insert in order, severity high → low; a patient whose severity equals others' goes <em>behind</em> them (FIFO among equals, deck 2B slide 17); skip a severity outside 1…5.</li>
<li><strong>f2</strong> <code>dequeue()</code> — remove and return the most urgent patient; <code>null</code> if nobody waits.</li>
<li><strong>f3</strong> <code>countAtLeast(k)</code> — how many patients have severity ≥ k.</li>
<li><strong>f4</strong> <code>update(name, severity)</code> — the patient's condition changes: take them out and queue them again with the new severity; <code>false</code> if the name is unknown or the severity invalid.</li>
</ul>
<p class="nhan">Data → expected result</p>
<p>An 2, Binh 5, Chi 3, Dung 5, Em 1, Phong 3, Hoa 0, Khoa 6 → Binh(5) Dung(5) Chi(3) Phong(3) An(2) Em(1) — Hoa and Khoa are invalid.</p>
<p class="nhan">Idea</p>
<p>f1: a new head only when strictly more severe than the head; otherwise walk <code>p</code> while <code>p.next.info.severity &gt;= severity</code> — passing the equals — and insert after <code>p</code>. f2: delete the head, O(1). f3: stop at the first node below k, because the list is sorted. f4: find the node <em>before</em> the patient (chapter 1), unlink, then reuse f1. Costs: f1 O(n), f2 O(1), f3 at most O(n), f4 O(n).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Patient {
    String name;
    int severity;                                   // 1 (mild) .. 5 (critical)
    Patient(String name, int severity) { this.name = name; this.severity = severity; }
    public String toString() { return name + "(" + severity + ")"; }
}

class Node {
    Patient info;
    Node next;
    Node(Patient x, Node p) { info = x; next = p; }
}

class PatientQueue {
    Node head;                                      // the most urgent patient first

    // f1: keep the list sorted, severity high -&gt; low; equal severity -&gt; behind those already waiting
    void enqueue(String name, int severity) {
        if (severity &lt; 1 || severity &gt; 5) return;    // invalid data is skipped
        Patient x = new Patient(name, severity);
        if (head == null || severity &gt; head.info.severity) { head = new Node(x, head); return; }
        Node p = head;
        while (p.next != null &amp;&amp; p.next.info.severity &gt;= severity) p = p.next;   // &gt;= passes the equals: FIFO
        p.next = new Node(x, p.next);
    }
    // f2: remove and return the most urgent patient; null if nobody waits
    Patient dequeue() {
        if (head == null) return null;
        Patient x = head.info;
        head = head.next;
        return x;
    }
    // f3: number of patients with severity &gt;= k; the list is sorted, so stop early
    int countAtLeast(int k) {
        int c = 0;
        for (Node p = head; p != null &amp;&amp; p.info.severity &gt;= k; p = p.next) c++;
        return c;
    }
    // f4: the condition of patient "name" changes: unlink, then enqueue again
    boolean update(String name, int severity) {
        if (head == null || severity &lt; 1 || severity &gt; 5) return false;
        if (head.info.name.equals(name)) head = head.next;
        else {
            Node f = head;                           // f stays one node before the patient
            while (f.next != null &amp;&amp; !f.next.info.name.equals(name)) f = f.next;
            if (f.next == null) return false;
            f.next = f.next.next;
        }
        enqueue(name, severity);
        return true;
    }
    String traverse() {
        StringBuilder b = new StringBuilder();
        for (Node p = head; p != null; p = p.next) b.append(b.length() &gt; 0 ? " " : "").append(p.info);
        return b.toString();
    }
}

public class Pe7PatientQueue {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        PatientQueue q = new PatientQueue();
        String[] names = {"An", "Binh", "Chi", "Dung", "Em", "Phong", "Hoa", "Khoa"};
        int[] sev = {2, 5, 3, 5, 1, 3, 0, 6};
        for (int i = 0; i &lt; names.length; i++) q.enqueue(names[i], sev[i]);
        check("f1 high to low, equals in arrival order", q.traverse(), "Binh(5) Dung(5) Chi(3) Phong(3) An(2) Em(1)");
        check("f3 countAtLeast(3)", String.valueOf(q.countAtLeast(3)), "4");
        check("f2 the two 5s leave in arrival order", q.dequeue() + " " + q.dequeue(), "Binh(5) Dung(5)");
        check("f4 An worsens to 3: behind Chi and Phong", q.update("An", 3) + " " + q.traverse(), "true Chi(3) Phong(3) An(3) Em(1)");
        check("f4 unknown name changes nothing", q.update("Zed", 4) + " " + q.traverse(), "false Chi(3) Phong(3) An(3) Em(1)");
        check("f4 on the head patient", q.update("Chi", 1) + " " + q.traverse(), "true Phong(3) An(3) Em(1) Chi(1)");
        check("f2 on an empty queue", String.valueOf(new PatientQueue().dequeue()), "null");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 high to low, equals in arrival order<br>
PASS f3 countAtLeast(3)<br>
PASS f2 the two 5s leave in arrival order<br>
PASS f4 An worsens to 3: behind Chi and Phong<br>
PASS f4 unknown name changes nothing<br>
PASS f4 on the head patient<br>
PASS f2 on an empty queue<br>
ALL TESTS PASSED</div>
<div class="pitfall">Writing <code>&gt;</code> instead of <code>&gt;=</code> in the walk of f1 puts a newcomer <em>in front of</em> patients with the same severity: Phong would then be seen before Chi, and the planted-bug run fails four tests. It is the tie trap of the slides' array priority queue (deck 2B, slide 18).</div>`,
    `<h3>🧪 Bài 7 — mô phỏng đề PE: hàng đợi ưu tiên bệnh nhân, f1–f4 (~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Khung cho sẵn: <code>Patient(name, severity)</code> với mức độ nặng (severity) từ 1 (nhẹ) … 5 (nguy kịch), lớp <code>Node</code>, và <code>PatientQueue</code> có <code>head</code> — một danh sách liên kết đơn (singly linked list) luôn giữ thứ tự, bệnh nhân khẩn cấp nhất đứng đầu. Đây là một hàng đợi ưu tiên (priority queue). Viết:</p>
<ul>
<li><strong>f1</strong> <code>enqueue(name, severity)</code> — chèn đúng thứ tự, mức cao → thấp; bệnh nhân cùng mức với người khác thì đứng <em>sau</em> họ (FIFO — vào trước ra trước — giữa các người bằng mức, bộ slide 2B slide 17); bỏ qua mức nằm ngoài 1…5.</li>
<li><strong>f2</strong> <code>dequeue()</code> — lấy ra và trả về bệnh nhân khẩn cấp nhất; không ai chờ thì trả <code>null</code>.</li>
<li><strong>f3</strong> <code>countAtLeast(k)</code> — có bao nhiêu bệnh nhân có mức ≥ k.</li>
<li><strong>f4</strong> <code>update(name, severity)</code> — tình trạng bệnh nhân thay đổi: đưa người đó ra rồi xếp hàng lại với mức mới; trả <code>false</code> nếu không có tên đó hoặc mức không hợp lệ.</li>
</ul>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>An 2, Binh 5, Chi 3, Dung 5, Em 1, Phong 3, Hoa 0, Khoa 6 → Binh(5) Dung(5) Chi(3) Phong(3) An(2) Em(1) — Hoa và Khoa không hợp lệ.</p>
<p class="nhan">Ý tưởng</p>
<p>f1: chỉ thành head mới khi nặng hơn hẳn head; ngược lại cho <code>p</code> đi tiếp chừng nào <code>p.next.info.severity &gt;= severity</code> — tức là đi qua những người bằng mức — rồi chèn sau <code>p</code>. f2: xoá head, O(1). f3: dừng ở nút đầu tiên có mức dưới k, vì danh sách đã sắp. f4: tìm nút <em>đứng trước</em> bệnh nhân (như chương 1), gỡ ra, rồi dùng lại f1. Chi phí: f1 O(n), f2 O(1), f3 nhiều nhất O(n), f4 O(n).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Patient {
    String name;
    int severity;                                   // 1 (nhẹ) .. 5 (nguy kịch)
    Patient(String name, int severity) { this.name = name; this.severity = severity; }
    public String toString() { return name + "(" + severity + ")"; }
}

class Node {
    Patient info;
    Node next;
    Node(Patient x, Node p) { info = x; next = p; }
}

class PatientQueue {
    Node head;                                      // bệnh nhân khẩn cấp nhất đứng đầu

    // f1: giữ danh sách theo mức cao -&gt; thấp; bằng mức -&gt; đứng sau người đã chờ
    void enqueue(String name, int severity) {
        if (severity &lt; 1 || severity &gt; 5) return;    // dữ liệu sai thì bỏ qua
        Patient x = new Patient(name, severity);
        if (head == null || severity &gt; head.info.severity) { head = new Node(x, head); return; }
        Node p = head;
        while (p.next != null &amp;&amp; p.next.info.severity &gt;= severity) p = p.next;   // &gt;= đi qua người bằng mức: FIFO
        p.next = new Node(x, p.next);
    }
    // f2: lấy ra người khẩn cấp nhất; không ai chờ thì null
    Patient dequeue() {
        if (head == null) return null;
        Patient x = head.info;
        head = head.next;
        return x;
    }
    // f3: số người có mức &gt;= k; danh sách đã sắp nên dừng sớm
    int countAtLeast(int k) {
        int c = 0;
        for (Node p = head; p != null &amp;&amp; p.info.severity &gt;= k; p = p.next) c++;
        return c;
    }
    // f4: tình trạng của bệnh nhân "name" thay đổi: gỡ ra rồi xếp hàng lại
    boolean update(String name, int severity) {
        if (head == null || severity &lt; 1 || severity &gt; 5) return false;
        if (head.info.name.equals(name)) head = head.next;
        else {
            Node f = head;                           // f đứng trước bệnh nhân đó một nút
            while (f.next != null &amp;&amp; !f.next.info.name.equals(name)) f = f.next;
            if (f.next == null) return false;
            f.next = f.next.next;
        }
        enqueue(name, severity);
        return true;
    }
    String traverse() {
        StringBuilder b = new StringBuilder();
        for (Node p = head; p != null; p = p.next) b.append(b.length() &gt; 0 ? " " : "").append(p.info);
        return b.toString();
    }
}

public class Pe7PatientQueue {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        PatientQueue q = new PatientQueue();
        String[] names = {"An", "Binh", "Chi", "Dung", "Em", "Phong", "Hoa", "Khoa"};
        int[] sev = {2, 5, 3, 5, 1, 3, 0, 6};
        for (int i = 0; i &lt; names.length; i++) q.enqueue(names[i], sev[i]);
        check("f1 high to low, equals in arrival order", q.traverse(), "Binh(5) Dung(5) Chi(3) Phong(3) An(2) Em(1)");
        check("f3 countAtLeast(3)", String.valueOf(q.countAtLeast(3)), "4");
        check("f2 the two 5s leave in arrival order", q.dequeue() + " " + q.dequeue(), "Binh(5) Dung(5)");
        check("f4 An worsens to 3: behind Chi and Phong", q.update("An", 3) + " " + q.traverse(), "true Chi(3) Phong(3) An(3) Em(1)");
        check("f4 unknown name changes nothing", q.update("Zed", 4) + " " + q.traverse(), "false Chi(3) Phong(3) An(3) Em(1)");
        check("f4 on the head patient", q.update("Chi", 1) + " " + q.traverse(), "true Phong(3) An(3) Em(1) Chi(1)");
        check("f2 on an empty queue", String.valueOf(new PatientQueue().dequeue()), "null");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 high to low, equals in arrival order<br>
PASS f3 countAtLeast(3)<br>
PASS f2 the two 5s leave in arrival order<br>
PASS f4 An worsens to 3: behind Chi and Phong<br>
PASS f4 unknown name changes nothing<br>
PASS f4 on the head patient<br>
PASS f2 on an empty queue<br>
ALL TESTS PASSED</div>
<div class="pitfall">Viết <code>&gt;</code> thay cho <code>&gt;=</code> trong vòng đi của f1 sẽ đặt người mới <em>lên trước</em> những người cùng mức: khi đó Phong được khám trước Chi, và bản cài lỗi thử nghiệm hỏng bốn test. Đây đúng là bẫy "bằng nhau" của hàng đợi ưu tiên bằng mảng trên slide (bộ slide 2B, slide 18).</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>stack</strong></td><td>ngăn xếp</td><td>A linear structure used at one end only, the top: the last element pushed is the first one popped.</td></tr>
<tr><td><strong>LIFO (last in, first out)</strong></td><td>vào sau, ra trước</td><td>The rule of a stack: elements leave in the reverse order of arrival.</td></tr>
<tr><td><strong>push / pop</strong></td><td>đẩy vào / lấy ra</td><td>Put an element on the top of a stack / remove and return the top element.</td></tr>
<tr><td><strong>top / peek</strong></td><td>xem đỉnh</td><td>Return the top element without removing it; Java calls it <code>peek()</code>.</td></tr>
<tr><td><strong>queue</strong></td><td>hàng đợi</td><td>A waiting line: elements are added at the rear and removed at the front.</td></tr>
<tr><td><strong>FIFO (first in, first out)</strong></td><td>vào trước, ra trước</td><td>The rule of a queue: the element that has waited longest leaves first.</td></tr>
<tr><td><strong>enqueue / dequeue</strong></td><td>đưa vào hàng / lấy khỏi hàng</td><td>Add an element at the rear / remove and return the front element.</td></tr>
<tr><td><strong>front / rear</strong></td><td>đầu hàng / cuối hàng</td><td>The end where elements leave / the end where they arrive.</td></tr>
<tr><td><strong>deque (double-ended queue)</strong></td><td>hàng đợi hai đầu</td><td>A queue that allows insertion and removal at both ends; pronounced "deck".</td></tr>
<tr><td><strong>priority queue</strong></td><td>hàng đợi ưu tiên</td><td>A queue whose removal returns the element of highest priority; equal priorities keep FIFO order.</td></tr>
<tr><td><strong>circular array (ring buffer)</strong></td><td>mảng vòng (bộ đệm vòng)</td><td>An array whose indices continue at 0 after the last cell, so a queue never has to shift.</td></tr>
<tr><td><strong>wrap-around</strong></td><td>quay vòng (chỉ số)</td><td>Moving an index from the last cell back to cell 0, e.g. <code>(i + 1) % N</code>.</td></tr>
<tr><td><strong>grow (resize)</strong></td><td>nới rộng mảng</td><td>Allocate a bigger array, copy the elements and update the capacity.</td></tr>
<tr><td><strong>amortized cost</strong></td><td>chi phí khấu hao</td><td>The average cost per operation over a whole sequence: one expensive step (a grow, a pour from stack to stack) is shared by the many cheap ones.</td></tr>
<tr><td><strong>activation record (stack frame)</strong></td><td>bản ghi kích hoạt (khung ngăn xếp)</td><td>The block a method call puts on the run-time stack: parameters, locals, dynamic link, return address.</td></tr>
<tr><td><strong>run-time stack (call stack)</strong></td><td>ngăn xếp thời gian chạy</td><td>The stack of activation records; the method called last returns first.</td></tr>
<tr><td><strong>stack overflow</strong></td><td>tràn ngăn xếp</td><td>The run-time stack is full, e.g. recursion without a base case; Java throws <code>StackOverflowError</code>.</td></tr>
<tr><td><strong>underflow</strong></td><td>cạn / tràn dưới (lấy từ cấu trúc rỗng)</td><td>Trying to pop or dequeue from an empty structure; it must be reported with an exception or a special value.</td></tr>
<tr><td><strong>postfix notation (RPN)</strong></td><td>ký pháp hậu tố (Ba Lan ngược)</td><td>Operators are written after their operands, e.g. <code>5 1 2 + 4 * + 3 -</code>; one stack evaluates it.</td></tr>
<tr><td><strong>delimiter matching</strong></td><td>khớp dấu ngoặc</td><td>Checking that every opening symbol is closed by its partner in the right order.</td></tr>
<tr><td><strong>round-robin scheduling</strong></td><td>lập lịch xoay vòng</td><td>Each process runs for one time slice in turn, then goes back to the rear of the queue.</td></tr>
<tr><td><strong>starvation</strong></td><td>bị bỏ đói</td><td>A process that waits forever because others always go first; round-robin prevents it.</td></tr>
<tr><td><strong>binary heap</strong></td><td>đống nhị phân</td><td>The tree structure behind <code>java.util.PriorityQueue</code>: insert and remove in O(log n).</td></tr>
<tr><td><strong>checked / unchecked exception</strong></td><td>ngoại lệ có / không kiểm tra</td><td>A checked exception must be caught or declared with <code>throws</code>; an unchecked one (a <code>RuntimeException</code>) need not.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>stack</strong></td><td>ngăn xếp</td><td>Cấu trúc tuyến tính chỉ dùng một đầu là đỉnh: phần tử đẩy vào sau cùng được lấy ra đầu tiên.</td></tr>
<tr><td><strong>LIFO (last in, first out)</strong></td><td>vào sau, ra trước</td><td>Luật của ngăn xếp: phần tử ra theo thứ tự ngược với lúc vào.</td></tr>
<tr><td><strong>push / pop</strong></td><td>đẩy vào / lấy ra</td><td>Đặt một phần tử lên đỉnh ngăn xếp / gỡ và trả về phần tử trên đỉnh.</td></tr>
<tr><td><strong>top / peek</strong></td><td>xem đỉnh</td><td>Trả về phần tử trên đỉnh mà không lấy ra; trong Java gọi là <code>peek()</code>.</td></tr>
<tr><td><strong>queue</strong></td><td>hàng đợi</td><td>Hàng chờ: phần tử được thêm ở cuối và lấy ra ở đầu.</td></tr>
<tr><td><strong>FIFO (first in, first out)</strong></td><td>vào trước, ra trước</td><td>Luật của hàng đợi: phần tử chờ lâu nhất được ra trước.</td></tr>
<tr><td><strong>enqueue / dequeue</strong></td><td>đưa vào hàng / lấy khỏi hàng</td><td>Thêm một phần tử vào cuối hàng / gỡ và trả về phần tử đầu hàng.</td></tr>
<tr><td><strong>front / rear</strong></td><td>đầu hàng / cuối hàng</td><td>Đầu nơi phần tử rời hàng / đầu nơi phần tử vào hàng.</td></tr>
<tr><td><strong>deque (double-ended queue)</strong></td><td>hàng đợi hai đầu</td><td>Hàng đợi cho phép thêm và lấy ra ở cả hai đầu; đọc là "đéc".</td></tr>
<tr><td><strong>priority queue</strong></td><td>hàng đợi ưu tiên</td><td>Hàng đợi mà thao tác lấy ra trả về phần tử ưu tiên cao nhất; cùng độ ưu tiên thì giữ thứ tự FIFO.</td></tr>
<tr><td><strong>circular array (ring buffer)</strong></td><td>mảng vòng (bộ đệm vòng)</td><td>Mảng mà chỉ số đi tiếp về 0 sau ô cuối, nhờ vậy hàng đợi không bao giờ phải dời phần tử.</td></tr>
<tr><td><strong>wrap-around</strong></td><td>quay vòng (chỉ số)</td><td>Đưa chỉ số từ ô cuối quay về ô 0, ví dụ <code>(i + 1) % N</code>.</td></tr>
<tr><td><strong>grow (resize)</strong></td><td>nới rộng mảng</td><td>Cấp mảng lớn hơn, chép các phần tử sang và cập nhật sức chứa.</td></tr>
<tr><td><strong>amortized cost</strong></td><td>chi phí khấu hao</td><td>Chi phí trung bình mỗi thao tác tính trên cả một dãy: một bước đắt (nới mảng, đổ từ stack này sang stack kia) được chia đều cho rất nhiều bước rẻ.</td></tr>
<tr><td><strong>activation record (stack frame)</strong></td><td>bản ghi kích hoạt (khung ngăn xếp)</td><td>Khối mà mỗi lời gọi hàm đặt lên run-time stack: tham số, biến cục bộ, liên kết động, địa chỉ trả về.</td></tr>
<tr><td><strong>run-time stack (call stack)</strong></td><td>ngăn xếp thời gian chạy</td><td>Ngăn xếp chứa các bản ghi kích hoạt; hàm được gọi sau cùng trả về trước tiên.</td></tr>
<tr><td><strong>stack overflow</strong></td><td>tràn ngăn xếp</td><td>Run-time stack bị đầy, ví dụ đệ quy không có điểm dừng; Java ném <code>StackOverflowError</code>.</td></tr>
<tr><td><strong>underflow</strong></td><td>cạn / tràn dưới (lấy từ cấu trúc rỗng)</td><td>Cố pop hoặc dequeue từ cấu trúc rỗng; phải báo bằng ngoại lệ hoặc một giá trị đặc biệt.</td></tr>
<tr><td><strong>postfix notation (RPN)</strong></td><td>ký pháp hậu tố (Ba Lan ngược)</td><td>Toán tử viết sau các toán hạng, ví dụ <code>5 1 2 + 4 * + 3 -</code>; một ngăn xếp là tính được.</td></tr>
<tr><td><strong>delimiter matching</strong></td><td>khớp dấu ngoặc</td><td>Kiểm tra mọi ký hiệu mở đều được đóng đúng cặp, đúng thứ tự.</td></tr>
<tr><td><strong>round-robin scheduling</strong></td><td>lập lịch xoay vòng</td><td>Mỗi tiến trình lần lượt chạy một lát thời gian rồi quay về cuối hàng đợi.</td></tr>
<tr><td><strong>starvation</strong></td><td>bị bỏ đói</td><td>Tiến trình phải chờ mãi vì luôn có tiến trình khác được ưu tiên; round-robin tránh được điều này.</td></tr>
<tr><td><strong>binary heap</strong></td><td>đống nhị phân</td><td>Cấu trúc cây đứng sau <code>java.util.PriorityQueue</code>: chèn và lấy ra trong O(log n).</td></tr>
<tr><td><strong>checked / unchecked exception</strong></td><td>ngoại lệ có / không kiểm tra</td><td>Ngoại lệ có kiểm tra phải được bắt hoặc khai báo <code>throws</code>; ngoại lệ không kiểm tra (một <code>RuntimeException</code>) thì không bắt buộc.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 2</h2>
<ol>
<li><strong>Stack = LIFO</strong>, one end (the top): push, pop, top/peek, all O(1). Uses: anything nested (brackets, HTML tags), postfix evaluation, method calls (the run-time stack of activation records), backtracking, undo.</li>
<li><strong>Array stack</strong>: <code>a[++top] = x</code> and <code>a[top--]</code>; when it grows, the capacity must be updated too (<code>max = max1</code>) — the slides' <code>ArrayStack</code> and array priority queue both forget it. <strong>Linked stack</strong>: push and pop at the head.</li>
<li><strong>Queue = FIFO</strong>, two ends: enqueue at the rear, dequeue at the front — O(1) on a circular array or on a linked list with <code>head</code> and <code>tail</code> (<code>tail = null</code> when the queue empties).</li>
<li><strong>Circular array</strong>: indices wrap with <code>(i + 1) % N</code>; full ⇔ the cell after <code>last</code> is <code>first</code>; <code>first == last</code> means one element; growing copies in queue order.</li>
<li><strong>Deque</strong> = both ends; a stack and a queue are special cases. In Java, <code>ArrayDeque</code> is the default stack <em>and</em> queue; <code>java.util.Stack</code> is a legacy <code>Vector</code>.</li>
<li><strong>Java method families</strong>: <code>add</code>/<code>remove</code>/<code>element</code> (and <code>addFirst</code>/<code>removeFirst</code>/<code>getFirst</code>) throw on failure; <code>offer</code>/<code>poll</code>/<code>peek</code> (and <code>offerFirst</code>/<code>pollFirst</code>/<code>peekFirst</code>) return <code>false</code> or <code>null</code>.</li>
<li><strong>Priority queue</strong>: removal by priority, FIFO among equals. Sorted array or sorted list: insert O(n), remove O(1). Binary heap (<code>java.util.PriorityQueue</code>): O(log n) both ways, smallest first by default, ties not FIFO, printing it does not show sorted order.</li>
<li><strong>Errors</strong>: pop/dequeue on an empty structure must be reported (<code>EmptyStackException</code>, <code>NoSuchElementException</code>, your own unchecked exception); <code>assert</code> is off unless the program runs with <code>-ea</code>; <code>throw new Exception()</code> is checked and forces <code>throws</code> on every caller.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>push 1, push 2, push 3, pop, push 4 — which element is on the top?</li>
<li>A queue on a circular array of capacity 5 has first = 4, last = 1. How many elements does it hold, and which cell does the next enqueue use?</li>
<li>Which two <code>java.util.Queue</code> methods throw on an empty queue?</li>
<li>In Exercise 5, why may <code>out</code> be refilled only when it is empty?</li>
<li>In Exercise 7, what goes wrong with <code>&gt;</code> instead of <code>&gt;=</code>?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 4 — the stack is 1 2 4. (2) 3 elements, in cells 4, 0 and 1 (5 − 4 + 1 + 1 = 3); the next enqueue uses cell 2. (3) <code>remove()</code> and <code>element()</code>. (4) Otherwise newer elements land on top of older ones in <code>out</code> and leave first — FIFO breaks (1 3 2). (5) A newcomer jumps in front of patients with the same severity, so equal priorities are no longer served in arrival order.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Structure</th><th>Add</th><th>Remove</th><th>Look at the next one</th><th>Remarks</th></tr></thead>
<tbody>
<tr><td>array stack</td><td>push O(1), O(n) when growing</td><td>pop O(1)</td><td>top O(1)</td><td>amortized O(1) push if the capacity grows by a factor</td></tr>
<tr><td>linked stack</td><td>push O(1)</td><td>pop O(1)</td><td>top O(1)</td><td>one <code>next</code> reference per element</td></tr>
<tr><td>circular array queue</td><td>enqueue O(1), O(n) when growing</td><td>dequeue O(1)</td><td>front O(1)</td><td>grow copies in queue order</td></tr>
<tr><td>linked queue (<code>head</code> + <code>tail</code>)</td><td>enqueue O(1)</td><td>dequeue O(1)</td><td>front O(1)</td><td><code>tail = null</code> when it empties</td></tr>
<tr><td>queue from two stacks</td><td>enqueue O(1)</td><td>dequeue O(1) amortized</td><td>front O(1) amortized</td><td>one refill may cost O(n)</td></tr>
<tr><td>deque (<code>ArrayDeque</code>)</td><td>O(1) at both ends</td><td>O(1) at both ends</td><td>O(1) at both ends</td><td>no <code>null</code> elements</td></tr>
<tr><td>priority queue, sorted array or list</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>shifting or walking to the place</td></tr>
<tr><td>priority queue, binary heap</td><td>O(log n)</td><td>O(log n)</td><td>O(1)</td><td><code>java.util.PriorityQueue</code>, smallest first</td></tr>
<tr><td>bracket check, postfix evaluation</td><td>—</td><td>—</td><td>—</td><td>O(n) time, O(n) stack in the worst case</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 2</h2>
<ol>
<li><strong>Ngăn xếp (stack) = LIFO</strong> (vào sau ra trước), một đầu (đỉnh — top): push (đẩy vào), pop (lấy ra), top/peek (xem đỉnh), đều O(1). Ứng dụng: mọi thứ lồng nhau (dấu ngoặc, thẻ HTML), tính biểu thức hậu tố (postfix), gọi hàm (run-time stack chứa các bản ghi kích hoạt — activation record), quay lui (backtracking), hoàn tác (undo).</li>
<li><strong>Stack bằng mảng</strong>: <code>a[++top] = x</code> và <code>a[top--]</code>; khi nới mảng phải cập nhật cả sức chứa (<code>max = max1</code>) — <code>ArrayStack</code> và hàng đợi ưu tiên bằng mảng trên slide đều quên. <strong>Stack liên kết</strong>: push và pop ở head.</li>
<li><strong>Hàng đợi (queue) = FIFO</strong> (vào trước ra trước), hai đầu: enqueue (đưa vào) ở cuối, dequeue (lấy ra) ở đầu — O(1) trên mảng vòng hoặc trên danh sách liên kết có <code>head</code> (nút đầu) và <code>tail</code> (nút cuối) (<code>tail = null</code> khi hàng vừa rỗng).</li>
<li><strong>Mảng vòng (circular array)</strong>: chỉ số quay vòng bằng <code>(i + 1) % N</code>; đầy ⇔ ô ngay sau <code>last</code> là <code>first</code>; <code>first == last</code> nghĩa là còn một phần tử; khi nới phải chép theo thứ tự hàng đợi.</li>
<li><strong>Deque (hàng đợi hai đầu)</strong> = dùng cả hai đầu; stack và queue là hai trường hợp riêng của nó. Trong Java, <code>ArrayDeque</code> là lựa chọn mặc định cho cả stack <em>lẫn</em> queue; <code>java.util.Stack</code> là lớp cũ dựa trên <code>Vector</code>.</li>
<li><strong>Hai họ phương thức của Java</strong>: <code>add</code>/<code>remove</code>/<code>element</code> (và <code>addFirst</code>/<code>removeFirst</code>/<code>getFirst</code>) ném ngoại lệ khi thất bại; <code>offer</code>/<code>poll</code>/<code>peek</code> (và <code>offerFirst</code>/<code>pollFirst</code>/<code>peekFirst</code>) trả về <code>false</code> hoặc <code>null</code>.</li>
<li><strong>Hàng đợi ưu tiên (priority queue)</strong>: lấy ra theo độ ưu tiên, bằng nhau thì FIFO. Mảng hoặc danh sách có thứ tự: chèn O(n), lấy ra O(1). Đống nhị phân (binary heap — <code>java.util.PriorityQueue</code>): cả hai chiều O(log n), mặc định nhỏ nhất ra trước, phần tử bằng nhau không giữ FIFO, in ra không thấy thứ tự đã sắp.</li>
<li><strong>Báo lỗi</strong>: pop/dequeue trên cấu trúc rỗng phải được báo (<code>EmptyStackException</code>, <code>NoSuchElementException</code>, hoặc ngoại lệ không kiểm tra tự viết); <code>assert</code> bị tắt nếu không chạy với <code>-ea</code>; <code>throw new Exception()</code> là ngoại lệ có kiểm tra (checked) nên mọi nơi gọi đều phải khai báo <code>throws</code>.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li>push 1, push 2, push 3, pop, push 4 — phần tử nào đang ở đỉnh?</li>
<li>Hàng đợi trên mảng vòng sức chứa 5 có first = 4, last = 1. Nó đang chứa mấy phần tử, và lần enqueue tiếp theo dùng ô nào?</li>
<li>Hai phương thức nào của <code>java.util.Queue</code> ném ngoại lệ khi hàng rỗng?</li>
<li>Ở Bài 5, vì sao chỉ được đổ đầy <code>out</code> khi nó đã rỗng?</li>
<li>Ở Bài 7, dùng <code>&gt;</code> thay cho <code>&gt;=</code> thì hỏng ở đâu?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 4 — stack là 1 2 4. (2) 3 phần tử, ở các ô 4, 0 và 1 (5 − 4 + 1 + 1 = 3); lần enqueue tiếp theo dùng ô 2. (3) <code>remove()</code> và <code>element()</code>. (4) Nếu không, phần tử mới nằm đè lên phần tử cũ trong <code>out</code> và ra trước — FIFO bị phá (1 3 2). (5) Người mới chen lên trước những người cùng mức, nên các độ ưu tiên bằng nhau không còn được phục vụ theo thứ tự tới.</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Cấu trúc</th><th>Thêm</th><th>Lấy ra</th><th>Xem phần tử kế tiếp</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>stack bằng mảng</td><td>push O(1), O(n) khi nới</td><td>pop O(1)</td><td>top O(1)</td><td>push O(1) khấu hao (amortized) nếu sức chứa tăng theo hệ số</td></tr>
<tr><td>stack liên kết</td><td>push O(1)</td><td>pop O(1)</td><td>top O(1)</td><td>mỗi phần tử tốn một tham chiếu <code>next</code></td></tr>
<tr><td>hàng đợi mảng vòng</td><td>enqueue O(1), O(n) khi nới</td><td>dequeue O(1)</td><td>front O(1)</td><td>khi nới chép theo thứ tự hàng đợi</td></tr>
<tr><td>hàng đợi liên kết (<code>head</code> + <code>tail</code>)</td><td>enqueue O(1)</td><td>dequeue O(1)</td><td>front O(1)</td><td><code>tail = null</code> khi hàng vừa rỗng</td></tr>
<tr><td>hàng đợi từ hai stack</td><td>enqueue O(1)</td><td>dequeue O(1) khấu hao</td><td>front O(1) khấu hao</td><td>một lần đổ có thể tốn O(n)</td></tr>
<tr><td>deque (<code>ArrayDeque</code>)</td><td>O(1) ở cả hai đầu</td><td>O(1) ở cả hai đầu</td><td>O(1) ở cả hai đầu</td><td>không nhận phần tử <code>null</code></td></tr>
<tr><td>hàng đợi ưu tiên, mảng hoặc danh sách có thứ tự</td><td>O(n)</td><td>O(1)</td><td>O(1)</td><td>phải dời hoặc đi tìm chỗ chèn</td></tr>
<tr><td>hàng đợi ưu tiên, đống nhị phân</td><td>O(log n)</td><td>O(log n)</td><td>O(1)</td><td><code>java.util.PriorityQueue</code>, nhỏ nhất ra trước</td></tr>
<tr><td>kiểm tra dấu ngoặc, tính biểu thức hậu tố</td><td>—</td><td>—</td><td>—</td><td>thời gian O(n), stack O(n) trong trường hợp xấu nhất</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch2) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'What does this code print? (ArrayDeque used as a stack: push, pop, peek)|||Đoạn code sau in ra gì? (ArrayDeque dùng như ngăn xếp: push, pop, peek)',
      code: `ArrayDeque<Integer> s = new ArrayDeque<Integer>();
s.push(1); s.push(2);
System.out.print(s.pop() + " ");
s.push(3); s.push(4);
System.out.print(s.pop() + " ");
System.out.print(s.pop() + " ");
System.out.print(s.peek());`,
      codeLang: 'java',
      options: ['2 3 4 1|||2 3 4 1', '1 3 4 2|||1 3 4 2', '2 4 3 1|||2 4 3 1', '2 4 1 3|||2 4 1 3'],
      correctIndex: 2,
      points: 1,
      explanation: 'LIFO: pop always returns the most recent element still on the stack. After push 1, 2 the pop gives 2; after push 3, 4 the pops give 4 then 3; only 1 is left and peek shows it without removing it. "2 3 4 1" treats the middle part in FIFO order — that is a queue, not a stack.|||LIFO (vào sau ra trước): pop luôn trả phần tử mới nhất còn trong ngăn xếp. Sau push 1, 2 thì pop ra 2; sau push 3, 4 thì pop ra 4 rồi 3; chỉ còn 1 và peek cho xem nó mà không lấy ra. "2 3 4 1" xử lý đoạn giữa theo thứ tự FIFO — đó là hàng đợi, không phải ngăn xếp.' },
    { id: 'q2',
      question: 'What does this code print? (offer = enqueue, poll = dequeue, peek = front)|||Đoạn code sau in ra gì? (offer = enqueue, poll = dequeue, peek = front)',
      code: `Queue<Integer> q = new ArrayDeque<Integer>();
q.offer(5); q.offer(3);
System.out.print(q.poll() + " ");
q.offer(7);
System.out.print(q.poll() + " ");
System.out.print(q.peek());`,
      codeLang: 'java',
      options: ['5 3 7|||5 3 7', '3 5 7|||3 5 7', '5 7 3|||5 7 3', '7 3 5|||7 3 5'],
      correctIndex: 0,
      points: 1,
      explanation: 'FIFO: poll removes the element that has waited longest. 5 entered first, so it leaves first; then 3; now 7 is at the front and peek shows it without removing it — the same kind of trace as the table on slide 5 of 2B-Queues. "3 5 7" is what a stack would give for the first two removals.|||FIFO (vào trước ra trước): poll lấy ra phần tử chờ lâu nhất. 5 vào trước nên ra trước; rồi tới 3; lúc này 7 đứng đầu và peek cho xem nó mà không lấy ra — đúng kiểu bảng lần theo ở slide 5 của 2B-Queues. "3 5 7" là kết quả của ngăn xếp ở hai lần lấy đầu.' },
    { id: 'q3',
      question: 'Which expression has correctly matched grouping symbols?|||Biểu thức nào có các cặp dấu nhóm khớp đúng?',
      options: ['( [ ) ]|||( [ ) ]', '{ ( } )|||{ ( } )', ') ( ( ) )|||) ( ( ) )', '( [ ] { } )|||( [ ] { } )'],
      correctIndex: 3,
      points: 1,
      explanation: 'Scan left to right with a stack: push every opening symbol; at a closing symbol the top must be its partner; at the end the stack must be empty. In ( [ ] { } ) every closing symbol meets its partner. "( [ ) ]" is the tempting one — the counts match, but ")" meets "[" on the top: counting symbols is not enough, the ORDER matters.|||Quét từ trái sang phải với một ngăn xếp: gặp dấu mở thì push; gặp dấu đóng thì đỉnh stack phải là dấu mở cùng cặp; cuối cùng stack phải rỗng. Trong ( [ ] { } ) mọi dấu đóng đều gặp đúng cặp. "( [ ) ]" là phương án dễ nhầm — số dấu khớp, nhưng ")" lại gặp "[" trên đỉnh: đếm số lượng là chưa đủ, THỨ TỰ mới quyết định.' },
    { id: 'q4',
      question: 'A circular array queue has capacity 5 (cells 0–4). The front element is at index first = 3 and the last element at index last = 1. How many elements does the queue hold?|||Một hàng đợi mảng vòng có sức chứa 5 (ô 0–4). Phần tử đầu ở chỉ số first = 3, phần tử cuối ở chỉ số last = 1. Hàng đợi đang chứa bao nhiêu phần tử?',
      options: ['3|||3', '4|||4', '2|||2', '5|||5'],
      correctIndex: 1,
      points: 1,
      explanation: 'The queue wraps around the end of the array: cells 3, 4, 0, 1 → 4 elements. In general the count is (last − first + N) mod N + 1 = (1 − 3 + 5) mod 5 + 1 = 4. Taking last − first = −2 and "fixing" the sign gives 2 or 3 — wrong because it ignores the wrap-around.|||Hàng đợi quấn qua cuối mảng: các ô 3, 4, 0, 1 → 4 phần tử. Tổng quát số phần tử là (last − first + N) mod N + 1 = (1 − 3 + 5) mod 5 + 1 = 4. Lấy last − first = −2 rồi "sửa" dấu sẽ ra 2 hoặc 3 — sai vì bỏ qua phần quấn vòng.' },
    { id: 'q5',
      question: 'The priority queue on slides 18–19 of 2B-Queues keeps its array sorted in ascending order, and dequeue() returns a[top]. After enqueue(5), enqueue(1), enqueue(9), enqueue(3), what does the first dequeue() return?|||Hàng đợi ưu tiên ở slide 18–19 của 2B-Queues giữ mảng sắp tăng dần, và dequeue() trả về a[top]. Sau enqueue(5), enqueue(1), enqueue(9), enqueue(3), lần dequeue() đầu tiên trả về gì?',
      options: ['9|||9', '1|||1', '5|||5', '3|||3'],
      correctIndex: 0,
      points: 1,
      explanation: 'enqueue inserts in order, so the array becomes [1, 3, 5, 9] and top points to 9, the largest value: this class treats a larger number as a higher priority. 1 is the tempting answer if you picture a min-queue like java.util.PriorityQueue; 5 would come out first only in plain FIFO order.|||enqueue chèn đúng thứ tự nên mảng thành [1, 3, 5, 9] và top trỏ vào 9, giá trị lớn nhất: lớp này coi số lớn hơn là ưu tiên cao hơn. 1 là đáp án dễ nhầm nếu hình dung một hàng đợi min như java.util.PriorityQueue; còn 5 chỉ ra trước nếu là FIFO thường.' },
    { id: 'q6',
      question: 'What does this code print?|||Đoạn code sau in ra gì?',
      code: `Stack<Integer> s = new Stack<Integer>();
s.push(10); s.push(20); s.push(30);
System.out.println(s.search(10));`,
      codeLang: 'java',
      options: ['1|||1', '0|||0', '3|||3', '2|||2'],
      correctIndex: 2,
      points: 1,
      explanation: 'search returns the 1-based distance from the TOP of the stack: 30 is 1, 20 is 2, 10 is 3 (and −1 if the element is absent). 0 is the tempting answer for anyone thinking in array indexes — 10 does sit at index 0 of the underlying Vector — but search does not count from the bottom.|||search trả khoảng cách tính từ ĐỈNH ngăn xếp, bắt đầu từ 1: 30 là 1, 20 là 2, 10 là 3 (không có thì trả −1). 0 là đáp án dễ nhầm với người quen chỉ số mảng — 10 đúng là nằm ở chỉ số 0 của Vector bên dưới — nhưng search không đếm từ đáy.' },
    { id: 'q7',
      question: 'In the ArrayStack of slide 10 (2A-Stacks), grow() allocates a bigger array but never updates max. The stack is created with max = 2. Which push is the first one to fail?|||Trong ArrayStack ở slide 10 (2A-Stacks), grow() cấp mảng lớn hơn nhưng không cập nhật max. Stack được tạo với max = 2. Lần push nào là lần đầu tiên bị lỗi?',
      options: ['The 3rd push: grow() returns false|||Lần push thứ 3: grow() trả về false', 'The 4th push: ArrayIndexOutOfBoundsException|||Lần push thứ 4: ArrayIndexOutOfBoundsException', 'The 3rd push: ArrayIndexOutOfBoundsException|||Lần push thứ 3: ArrayIndexOutOfBoundsException', 'None — every push succeeds|||Không lần nào — mọi lần push đều thành công'],
      correctIndex: 1,
      points: 1,
      explanation: 'Push 3 finds top == max − 1, grows the array to 3 cells and succeeds. Now top = 2 while max is still 2, so isFull() (top == max − 1) is false: push 4 does not grow again and writes a[3] into a 3-cell array → ArrayIndexOutOfBoundsException. The fix is one line in grow(): max = max1; Option C forgets that the first grow() did work.|||Lần push 3 thấy top == max − 1, nới mảng lên 3 ô và thành công. Lúc này top = 2 trong khi max vẫn là 2, nên isFull() (top == max − 1) là false: lần push 4 không nới nữa mà ghi a[3] vào mảng 3 ô → ArrayIndexOutOfBoundsException. Cách sửa chỉ một dòng trong grow(): max = max1; Phương án C quên rằng lần grow() đầu tiên vẫn chạy đúng.' },
    { id: 'q8',
      question: 'What is the value of the postfix (reverse Polish) expression 6 2 3 + * 4 − ?|||Biểu thức hậu tố (ký pháp Ba Lan ngược) 6 2 3 + * 4 − có giá trị bao nhiêu?',
      options: ['−26|||−26', '30|||30', '8|||8', '26|||26'],
      correctIndex: 3,
      points: 1,
      explanation: 'Push numbers; an operator pops two values, applies itself and pushes the result: 2 + 3 = 5, then 6 * 5 = 30, then 30 − 4 = 26. −26 comes from popping the operands in the wrong order for "−": the FIRST value popped is the RIGHT operand. 30 forgets the last step.|||Gặp số thì push; gặp toán tử thì pop hai giá trị, tính rồi push kết quả: 2 + 3 = 5, rồi 6 * 5 = 30, rồi 30 − 4 = 26. −26 xuất hiện khi lấy toán hạng sai thứ tự với phép "−": giá trị pop ra ĐẦU TIÊN là toán hạng BÊN PHẢI. 30 là quên bước cuối.' },
    { id: 'q9',
      question: 'What does decToBin(13) print?|||decToBin(13) in ra gì?',
      code: `static void decToBin(int k) {
    ArrayDeque<Integer> s = new ArrayDeque<Integer>();
    while (k > 0) { s.push(k % 2); k = k / 2; }
    while (!s.isEmpty()) System.out.print(s.pop());
}`,
      codeLang: 'java',
      options: ['1101|||1101', '1011|||1011', '0111|||0111', '11010|||11010'],
      correctIndex: 0,
      points: 1,
      explanation: 'The remainders come out least-significant bit first: 13 → 1, 6 → 0, 3 → 1, 1 → 1. The stack reverses them, so the pops print 1101 (8 + 4 + 1 = 13). 1011 is what you get by printing the remainders directly, without the stack — the bits in reverse order.|||Các số dư ra từ bit thấp nhất trước: 13 → 1, 6 → 0, 3 → 1, 1 → 1. Ngăn xếp đảo ngược chúng, nên các lần pop in ra 1101 (8 + 4 + 1 = 13). 1011 là kết quả khi in thẳng các số dư không qua stack — các bit bị đảo thứ tự.' },
    { id: 'q10',
      question: 'An emergency room treats the most severe patient first; among patients of the same severity, whoever arrived first. Which structure models the waiting list best?|||Phòng cấp cứu chữa bệnh nhân nặng nhất trước; trong số người cùng mức độ thì ai đến trước chữa trước. Cấu trúc nào mô hình hoá hàng chờ tốt nhất?',
      options: ['A stack ordered by arrival time|||Ngăn xếp theo giờ đến', 'A FIFO queue ordered by arrival time|||Hàng đợi FIFO theo giờ đến', 'A priority queue keyed by severity, then arrival|||Hàng đợi ưu tiên theo mức nặng, rồi giờ đến', 'A deque ordered by severity only|||Deque chỉ xếp theo mức nặng'],
      correctIndex: 2,
      points: 1,
      explanation: 'Dequeuing by priority breaks the FIFO rule on purpose (slide 17 of 2B-Queues), and using the arrival time as the second key keeps FIFO order among equal priorities. The plain FIFO queue is tempting because the question mentions "whoever arrived first", but it would make a critical patient wait behind minor cases.|||Lấy ra theo độ ưu tiên là cố ý phá luật FIFO (slide 17 của 2B-Queues), còn dùng giờ đến làm khoá thứ hai giữ thứ tự FIFO giữa những người cùng mức ưu tiên. Hàng đợi FIFO thường là lựa chọn dễ nhầm vì đề có nhắc "ai đến trước", nhưng như vậy bệnh nhân nguy kịch phải chờ sau các ca nhẹ.' },
  ],
};

export default {
  slides: [L_csd5_1, L_csd6_1],
  practice: L_on_ch2,
  quiz: QUIZ,
  quizDescription: '10 câu lần theo stack/queue, mảng vòng, hàng đợi ưu tiên của slide, lỗi grow() của ArrayStack, biểu thức hậu tố, đổi nhị phân bằng stack và chọn cấu trúc theo tình huống — mỗi câu có giải thích.',
};
