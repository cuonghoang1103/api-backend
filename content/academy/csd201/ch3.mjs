/**
 * CSD201 · Chương 3 — đệ quy.
 * Bài 📑 học theo từng slide: csd7 (3-Recursion.ppt, 25 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch3.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch3).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 3.A — 📑 Slide by slide · Recursion (3-Recursion, slides 1–25) ───────── */
const L_csd7_1 = {
  title: '3.A — 📑 Slide by slide · Recursion (3-Recursion, slides 1–25)|||3.A — 📑 Học theo từng slide · Đệ quy (3-Recursion, slide 1–25)',
  slug: 'csd201-slide-csd7-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–25 của bộ 3-Recursion: định nghĩa đệ quy, activation record và run-time stack (giải phẫu factorial(4)), đệ quy tuyến tính/nhị phân/bội, đệ quy đuôi và không đuôi, khử đệ quy bằng stack, đệ quy gián tiếp (sin–tan–cos), đệ quy lồng (h, Ackermann), đệ quy thừa (Fibonacci), Tháp Hà Nội, fractal và bông tuyết Koch — 21 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.A · 3-Recursion, slides 1–25</span>
<h2>Recursion — the deck, slide by slide</h2>
<p class="lead">This is the deck shown in syllabus sessions 11–12 (CLO3), before the review and exercise sessions 13–14. Read it before lessons 3.1–3.4 below: every slide is here with what it means, a runnable Java program for every example, the call stack and the call trees drawn step by step, the number of calls behind every Big-O, and the traps that cost marks in the FE (final exam) and the PE (practical exam).</p>
<div class="callout"><strong>CLO3 in the syllabus:</strong> describe recursive definitions, algorithms and functions, their implementation and their use. The syllabus review questions for this chapter — "What is recursion? What is the recursive step in the Fibonacci definition?", "How many main parts does a recursive algorithm have?", "What are the pros and cons of recursion?" — are answered at slides 3–4 and 23, and again in the check-yourself at the end. FE questions on this chapter commonly ask you to name a kind of recursion, predict the output of a short recursive method, or count calls or moves; a PE task may ask you to write a method recursively.</div>
<h3>The whole deck in one table</h3>
<table>
<thead><tr><th>Idea</th><th>Slides</th><th>Example in this lesson</th><th>Calls / cost</th></tr></thead>
<tbody>
<tr><td>Recursive definition = base case + inductive case</td><td>3–4, 7</td><td>N, n!, fibo(n), palindromes</td><td>the base case must always be reached</td></tr>
<tr><td>A method calls itself; the caller is suspended</td><td>5–6</td><td>sum(3), DecToBin(13)</td><td>DecToBin(n): ⌊log₂ n⌋ + 1 calls</td></tr>
<tr><td>Activation records on the run-time stack</td><td>8–10</td><td>factorial(4)</td><td>n calls, stack depth n</td></tr>
<tr><td>Linear / binary / multiple recursion</td><td>11</td><td>binary search / fibo / trib</td><td>1 / exactly 2 / 3 or more calls per activation</td></tr>
<tr><td>Tail vs non-tail recursion</td><td>12–14</td><td>tail(10), reverse()</td><td>tail → a loop; non-tail → a loop + a stack</td></tr>
<tr><td>Indirect recursion</td><td>15</td><td>sin → tan → sin</td><td>6265 calls for sin(3.0)</td></tr>
<tr><td>Nested recursion</td><td>16</td><td>h(n), Ackermann A(x, y)</td><td>A(3, 3) = 61 after 2432 calls</td></tr>
<tr><td>Excessive recursion</td><td>17–18</td><td>fibo(30)</td><td>2 692 537 calls vs 29 additions</td></tr>
<tr><td>Tower of Hanoi</td><td>19–20</td><td>3 disks</td><td>2ⁿ − 1 moves</td></tr>
<tr><td>Fractals, von Koch snowflake</td><td>21–22</td><td>Sierpinski, Koch</td><td>3 and 4 calls per activation</td></tr>
<tr><td>Recursion vs iteration</td><td>23</td><td>sum of 1..n</td><td>recursion: O(n) stack; loop: O(1)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 3 · Bài 3.A · 3-Recursion, slide 1–25</span>
<h2>Đệ quy — học bộ slide từng trang</h2>
<p class="lead">Đây là bộ slide được chiếu ở buổi 11–12 theo syllabus (CLO3), trước hai buổi ôn tập và chữa bài 13–14. Hãy đọc bài này trước các bài 3.1–3.4 bên dưới: slide nào cũng có ý nghĩa, chương trình Java chạy được cho từng ví dụ, ngăn xếp lời gọi (call stack) và cây lời gọi (call tree) vẽ lại từng bước, số lời gọi đứng sau mỗi Big-O, và những bẫy hay mất điểm ở FE (thi cuối kỳ) và PE (thi thực hành).</p>
<div class="callout"><strong>CLO3 trong syllabus:</strong> mô tả định nghĩa, thuật toán và hàm đệ quy (recursive), cách cài đặt và cách dùng chúng. Các câu hỏi ôn tập của syllabus cho chương này — "Đệ quy là gì? Bước đệ quy trong định nghĩa Fibonacci là gì?", "Một thuật toán đệ quy có mấy phần chính?", "Ưu và nhược điểm của đệ quy?" — được trả lời ở slide 3–4 và 23, và nhắc lại trong phần tự kiểm tra cuối bài. Câu hỏi FE về chương này thường yêu cầu gọi tên một loại đệ quy, đoán output của một hàm đệ quy ngắn, hoặc đếm số lời gọi hay số bước chuyển; đề PE có thể bắt viết một phương thức bằng đệ quy.</div>
<h3>Cả bộ slide trong một bảng</h3>
<table>
<thead><tr><th>Ý chính</th><th>Slide</th><th>Ví dụ trong bài</th><th>Số lời gọi / chi phí</th></tr></thead>
<tbody>
<tr><td>Định nghĩa đệ quy = trường hợp cơ sở (base case) + bước quy nạp (inductive case)</td><td>3–4, 7</td><td>N, n!, fibo(n), chuỗi đối xứng</td><td>trường hợp cơ sở phải luôn chạm tới được</td></tr>
<tr><td>Phương thức tự gọi chính nó; lần gọi bên ngoài bị tạm dừng</td><td>5–6</td><td>sum(3), DecToBin(13)</td><td>DecToBin(n): ⌊log₂ n⌋ + 1 lời gọi</td></tr>
<tr><td>Bản ghi kích hoạt (activation record) trên ngăn xếp lúc chạy (run-time stack)</td><td>8–10</td><td>factorial(4)</td><td>n lời gọi, độ sâu stack n</td></tr>
<tr><td>Đệ quy tuyến tính / nhị phân / bội (linear / binary / multiple)</td><td>11</td><td>tìm kiếm nhị phân / fibo / trib</td><td>1 / đúng 2 / từ 3 lời gọi trở lên mỗi lần kích hoạt</td></tr>
<tr><td>Đệ quy đuôi và không đuôi (tail / non-tail)</td><td>12–14</td><td>tail(10), reverse()</td><td>đuôi → vòng lặp; không đuôi → vòng lặp + stack</td></tr>
<tr><td>Đệ quy gián tiếp (indirect)</td><td>15</td><td>sin → tan → sin</td><td>6265 lời gọi cho sin(3.0)</td></tr>
<tr><td>Đệ quy lồng (nested)</td><td>16</td><td>h(n), hàm Ackermann A(x, y)</td><td>A(3, 3) = 61 sau 2432 lời gọi</td></tr>
<tr><td>Đệ quy thừa (excessive)</td><td>17–18</td><td>fibo(30)</td><td>2 692 537 lời gọi so với 29 phép cộng</td></tr>
<tr><td>Tháp Hà Nội (Tower of Hanoi)</td><td>19–20</td><td>3 đĩa</td><td>2ⁿ − 1 lần chuyển</td></tr>
<tr><td>Fractal (hình phân dạng), bông tuyết von Koch</td><td>21–22</td><td>Sierpinski, Koch</td><td>3 và 4 lời gọi mỗi lần kích hoạt</td></tr>
<tr><td>Đệ quy và vòng lặp (iteration)</td><td>23</td><td>tổng 1..n</td><td>đệ quy: stack O(n); vòng lặp: O(1)</td></tr>
</tbody>
</table>`),
    walkHead('csd7', 1, 25),
    walk('csd7', [
      [1, '3. Recursion',
        `<p class="y-chinh">🎯 Chapter 3 is about recursion: a method that solves a problem by calling itself on a smaller version of the same problem.</p>
<p>It comes right after Chapter 2 for a reason: every method call — recursive or not — is managed by the <strong>run-time stack</strong>, so stacks are the key to how recursion runs (slides 8–10) and to how it can be removed (slide 14).</p>`,
        `<p class="y-chinh">🎯 Chương 3 nói về đệ quy (recursion): một phương thức giải bài toán bằng cách tự gọi lại chính nó trên một phiên bản nhỏ hơn của cùng bài toán.</p>
<p>Chương này đứng ngay sau Chương 2 là có lý do: mọi lời gọi phương thức — đệ quy hay không — đều do <strong>ngăn xếp lúc chạy (run-time stack)</strong> quản lý, nên ngăn xếp (stack) là chìa khoá để hiểu đệ quy chạy thế nào (slide 8–10) và khử nó ra sao (slide 14).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 The eleven objectives fall into four groups: what recursion is, how the machine runs it, the kinds of recursion, and when it becomes too expensive.</p>
<ol>
<li><strong>What it is</strong> — recursive definition (slides 3–4), recursive program/algorithm (5–6), recursion application (7).</li>
<li><strong>How it runs</strong> — method calls and recursion implementation (8–9), anatomy of a recursive call (10).</li>
<li><strong>Kinds of recursion</strong> — by the number of calls: linear, binary, multiple (11); tail (12) and non-tail (13–14); indirect (15); nested (16).</li>
<li><strong>Cost</strong> — excessive recursion (17–18).</li>
</ol>
<p>After the objectives come bigger examples — the Tower of Hanoi (19–20), fractals and the von Koch snowflake (21–22) — and recursion vs iteration (23).</p>
<p class="meo">🧠 <strong>Remember:</strong> the classification words — linear, binary, multiple, tail, indirect, nested, excessive — are favourite FE vocabulary; each has its own slide and its own Java program below.</p>`,
        `<p class="y-chinh">🎯 Mười một mục tiêu gom thành bốn nhóm: đệ quy là gì, máy chạy nó thế nào, các loại đệ quy, và khi nào nó trở nên quá đắt.</p>
<ol>
<li><strong>Đệ quy là gì</strong> — định nghĩa đệ quy (recursive definition, slide 3–4), chương trình/thuật toán đệ quy (5–6), ứng dụng của đệ quy (7).</li>
<li><strong>Máy chạy đệ quy thế nào</strong> — lời gọi phương thức và cách cài đặt đệ quy (8–9), giải phẫu một lời gọi đệ quy (anatomy, 10).</li>
<li><strong>Các loại đệ quy</strong> — theo số lời gọi: tuyến tính (linear), nhị phân (binary), bội (multiple) (11); đệ quy đuôi (tail, 12) và không đuôi (non-tail, 13–14); gián tiếp (indirect, 15); lồng (nested, 16).</li>
<li><strong>Chi phí</strong> — đệ quy thừa (excessive recursion, 17–18).</li>
</ol>
<p>Sau phần mục tiêu là các ví dụ lớn hơn — Tháp Hà Nội (Tower of Hanoi, 19–20), fractal (hình phân dạng) và bông tuyết von Koch (snowflake, 21–22) — và so sánh đệ quy với vòng lặp (iteration, 23).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> các từ phân loại — linear, binary, multiple, tail, indirect, nested, excessive — là từ vựng rất hay gặp trong FE; mỗi từ có một slide riêng và một chương trình Java riêng ở dưới.</p>`],
      [3, 'Recursive definition',
        `<p class="y-chinh">🎯 A recursive (inductive) definition defines something in terms of itself, and it only works when it is well-founded: at least one base case, plus an inductive case that always leads back to it.</p>
<ul>
<li><strong>Base case</strong> — also called the anchor or the ground case: the part that does <em>not</em> refer to the thing being defined. Everything starts here.</li>
<li><strong>Inductive case</strong>: the part that <em>does</em> refer to it, building new elements from ones already defined.</li>
<li><strong>Well-founded, no infinite regress</strong>: going backwards through the inductive case must reach a base case after finitely many steps.</li>
</ul>
<p>The slide's example — defining the set of natural numbers N — is drawn as a figure. The standard form of this definition is:</p>
<pre><code class="language-plaintext">1. 0 ∈ N                          (base case)
2. if n ∈ N, then (n + 1) ∈ N     (inductive case)
3. nothing else is in N</code></pre>
<p>Clause 3 says that N contains only what clauses 1–2 produce. In the program, <code>build(n)</code> shows how every n is reached from the anchor, and <code>buildNoAnchor</code> shows what an ill-founded definition does:</p>
<pre><code class="language-java">public class NaturalNumbers {
    // Recursive definition of N: (1) 0 is in N; (2) if n is in N, then n + 1 is in N.
    // build(n) shows how n is obtained from the anchor by applying rule (2) again and again.
    static String build(int n) {
        if (n == 0) return "0";                   // base case (anchor): no reference to N itself
        return build(n - 1) + "+1";               // inductive case: uses a smaller element of N
    }

    // The same "definition" with the anchor forgotten: nothing ever stops it.
    static String buildNoAnchor(int n) {
        return buildNoAnchor(n - 1) + "+1";
    }

    public static void main(String[] args) {
        for (int n = 0; n &lt;= 4; n++)
            System.out.println(n + " is built as " + build(n));
        try {
            buildNoAnchor(3);
        } catch (StackOverflowError e) {          // the run-time stack is full
            System.out.println("buildNoAnchor(3): StackOverflowError -&gt; infinite regress, never well-founded");
        }
    }
}</code></pre>
<div class="out">0 is built as 0<br>
1 is built as 0+1<br>
2 is built as 0+1+1<br>
3 is built as 0+1+1+1<br>
4 is built as 0+1+1+1+1<br>
buildNoAnchor(3): StackOverflowError -&gt; infinite regress, never well-founded</div>
<div class="pitfall">A recursive method with no base case — or with one it never reaches — does not "return nothing": it fills the run-time stack until the JVM throws <code>StackOverflowError</code>. In the PE this is a common way for a recursive answer to crash.</div>`,
        `<p class="y-chinh">🎯 Định nghĩa đệ quy (recursive definition, còn gọi là định nghĩa quy nạp — inductive definition) định nghĩa một thứ thông qua chính nó, và chỉ dùng được khi nó "có nền" (well-founded): có ít nhất một trường hợp cơ sở, cộng với một bước quy nạp luôn dẫn về trường hợp đó.</p>
<ul>
<li><strong>Trường hợp cơ sở (base case)</strong> — còn gọi là điểm neo (anchor) hay trường hợp nền (ground case): phần <em>không</em> nhắc tới chính thứ đang được định nghĩa. Mọi thứ bắt đầu từ đây.</li>
<li><strong>Bước quy nạp (inductive case)</strong>: phần <em>có</em> nhắc tới nó, tạo phần tử mới từ những phần tử đã có.</li>
<li><strong>Có nền, không lùi vô hạn (infinite regress)</strong>: lần ngược theo bước quy nạp thì sau hữu hạn bước phải chạm tới một trường hợp cơ sở.</li>
</ul>
<p>Ví dụ của slide — định nghĩa tập số tự nhiên N — được vẽ bằng hình. Dạng chuẩn của định nghĩa này là:</p>
<pre><code class="language-plaintext">1. 0 ∈ N                              (trường hợp cơ sở)
2. nếu n ∈ N thì (n + 1) ∈ N          (bước quy nạp)
3. ngoài ra không có phần tử nào khác thuộc N</code></pre>
<p>Điều 3 nói N chỉ gồm những gì điều 1–2 tạo ra. Trong chương trình, <code>build(n)</code> cho thấy mọi n đều đi ra từ điểm neo, còn <code>buildNoAnchor</code> cho thấy một định nghĩa "không có nền" sẽ ra sao:</p>
<pre><code class="language-java">public class NaturalNumbers {
    // Định nghĩa đệ quy của N: (1) 0 thuộc N; (2) nếu n thuộc N thì n + 1 thuộc N.
    // build(n) cho thấy n được tạo ra từ điểm neo bằng cách áp dụng luật (2) nhiều lần.
    static String build(int n) {
        if (n == 0) return "0";                   // trường hợp cơ sở (neo): không nhắc tới chính N
        return build(n - 1) + "+1";               // bước quy nạp: dùng một phần tử nhỏ hơn của N
    }

    // Cùng "định nghĩa" đó nhưng quên điểm neo: không gì chặn nó lại.
    static String buildNoAnchor(int n) {
        return buildNoAnchor(n - 1) + "+1";
    }

    public static void main(String[] args) {
        for (int n = 0; n &lt;= 4; n++)
            System.out.println(n + " is built as " + build(n));
        try {
            buildNoAnchor(3);
        } catch (StackOverflowError e) {          // run-time stack đã đầy
            System.out.println("buildNoAnchor(3): StackOverflowError -&gt; infinite regress, never well-founded");
        }
    }
}</code></pre>
<div class="out">0 is built as 0<br>
1 is built as 0+1<br>
2 is built as 0+1+1<br>
3 is built as 0+1+1+1<br>
4 is built as 0+1+1+1+1<br>
buildNoAnchor(3): StackOverflowError -&gt; infinite regress, never well-founded</div>
<div class="pitfall">Phương thức đệ quy thiếu trường hợp cơ sở — hoặc có nhưng không bao giờ chạm tới — không phải là "không trả về gì": nó làm đầy ngăn xếp lúc chạy (run-time stack) cho tới khi máy ảo Java (JVM) ném <code>StackOverflowError</code>. Trong PE, đây là một lý do rất hay gặp khiến bài đệ quy bị sập.</div>`],
      [4, 'Some other examples for recursive definition',
        `<p class="y-chinh">🎯 Two recursive definitions to know by heart: the factorial n! and the Fibonacci numbers fibo(n) — each has anchor(s) and an inductive step.</p>
<pre><code class="language-plaintext">n! = 1                            if n = 0    (anchor)
n! = n * (n-1)!                   if n &gt; 0    (inductive step)

fibo(n) = n                       if n &lt; 2    (two anchors: fibo(0) = 0, fibo(1) = 1)
fibo(n) = fibo(n-1) + fibo(n-2)   otherwise   (inductive step)</code></pre>
<ul>
<li>Unfolding the definition: 4! = 4·3! = 4·3·2! = 4·3·2·1! = 4·3·2·1·0! = 4·3·2·1·1 = 24.</li>
<li>Fibonacci needs <strong>two</strong> anchors because its inductive step looks two places back.</li>
<li>The Java methods below are the two definitions typed almost word for word — that is the appeal of recursion.</li>
</ul>
<pre><code class="language-java">public class Definitions {
    // n! = 1 if n = 0 (anchor); n * (n-1)! if n &gt; 0 (inductive step)
    static long fact(int n) {
        if (n == 0) return 1;
        return n * fact(n - 1);
    }

    // fibo(n) = n if n &lt; 2; fibo(n-1) + fibo(n-2) otherwise
    static long fibo(int n) {
        if (n &lt; 2) return n;                      // two anchors: fibo(0) = 0, fibo(1) = 1
        return fibo(n - 1) + fibo(n - 2);
    }

    static int factInt(int n) {                   // the same definition, but with int
        if (n == 0) return 1;
        return n * factInt(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("n    n!        fibo(n)");
        for (int n = 0; n &lt;= 10; n++)
            System.out.printf("%-4d %-9d %d%n", n, fact(n), fibo(n));
        System.out.println("13! with long = " + fact(13) + ", with int = " + factInt(13) + "  (int overflow!)");
        System.out.println("20! = " + fact(20) + " is the largest factorial that fits in a long");
    }
}</code></pre>
<div class="out">n &nbsp;&nbsp;&nbsp;n! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fibo(n)<br>
0 &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
1 &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
2 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
3 &nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
4 &nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
5 &nbsp;&nbsp;&nbsp;120 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>
6 &nbsp;&nbsp;&nbsp;720 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8<br>
7 &nbsp;&nbsp;&nbsp;5040 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13<br>
8 &nbsp;&nbsp;&nbsp;40320 &nbsp;&nbsp;&nbsp;&nbsp;21<br>
9 &nbsp;&nbsp;&nbsp;362880 &nbsp;&nbsp;&nbsp;34<br>
10 &nbsp;&nbsp;3628800 &nbsp;&nbsp;55<br>
13! with long = 6227020800, with int = 1932053504 &nbsp;(int overflow!)<br>
20! = 2432902008176640000 is the largest factorial that fits in a long</div>
<p class="nhan">Syllabus question: "What is the recursive step in the Fibonacci definition?"</p>
<p class="dap-an">✅ <strong>Answer:</strong> fibo(n) = fibo(n−1) + fibo(n−2) for n ≥ 2. fibo(0) = 0 and fibo(1) = 1 are the base cases, not recursive steps.</p>
<div class="pitfall">Two classic slips. (1) <code>if (n &lt;= 2) return 1;</code> changes the definition: fibo(0) becomes 1 instead of the slide's 0. (2) <code>int</code> overflows silently from 13! on — the output shows 1932053504 instead of 6227020800; use <code>long</code> (enough up to 20!) or <code>BigInteger</code>.</div>`,
        `<p class="y-chinh">🎯 Hai định nghĩa đệ quy phải thuộc lòng: giai thừa (factorial) n! và dãy Fibonacci fibo(n) — mỗi định nghĩa có điểm neo (anchor) và bước quy nạp (inductive step).</p>
<pre><code class="language-plaintext">n! = 1                            nếu n = 0    (điểm neo)
n! = n * (n-1)!                   nếu n &gt; 0    (bước quy nạp)

fibo(n) = n                       nếu n &lt; 2    (hai điểm neo: fibo(0) = 0, fibo(1) = 1)
fibo(n) = fibo(n-1) + fibo(n-2)   ngược lại    (bước quy nạp)</code></pre>
<ul>
<li>Khai triển định nghĩa: 4! = 4·3! = 4·3·2! = 4·3·2·1! = 4·3·2·1·0! = 4·3·2·1·1 = 24.</li>
<li>Fibonacci cần <strong>hai</strong> điểm neo vì bước quy nạp của nó nhìn lùi về hai vị trí.</li>
<li>Hai phương thức Java dưới đây gần như chép nguyên văn hai định nghĩa — đó chính là sức hút của đệ quy (recursion).</li>
</ul>
<pre><code class="language-java">public class Definitions {
    // n! = 1 nếu n = 0 (điểm neo); n * (n-1)! nếu n &gt; 0 (bước quy nạp)
    static long fact(int n) {
        if (n == 0) return 1;
        return n * fact(n - 1);
    }

    // fibo(n) = n nếu n &lt; 2; ngược lại fibo(n-1) + fibo(n-2)
    static long fibo(int n) {
        if (n &lt; 2) return n;                      // hai điểm neo: fibo(0) = 0, fibo(1) = 1
        return fibo(n - 1) + fibo(n - 2);
    }

    static int factInt(int n) {                   // đúng định nghĩa đó, nhưng dùng int
        if (n == 0) return 1;
        return n * factInt(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("n    n!        fibo(n)");
        for (int n = 0; n &lt;= 10; n++)
            System.out.printf("%-4d %-9d %d%n", n, fact(n), fibo(n));
        System.out.println("13! with long = " + fact(13) + ", with int = " + factInt(13) + "  (int overflow!)");
        System.out.println("20! = " + fact(20) + " is the largest factorial that fits in a long");
    }
}</code></pre>
<div class="out">n &nbsp;&nbsp;&nbsp;n! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fibo(n)<br>
0 &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br>
1 &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
2 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1<br>
3 &nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2<br>
4 &nbsp;&nbsp;&nbsp;24 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
5 &nbsp;&nbsp;&nbsp;120 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5<br>
6 &nbsp;&nbsp;&nbsp;720 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8<br>
7 &nbsp;&nbsp;&nbsp;5040 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13<br>
8 &nbsp;&nbsp;&nbsp;40320 &nbsp;&nbsp;&nbsp;&nbsp;21<br>
9 &nbsp;&nbsp;&nbsp;362880 &nbsp;&nbsp;&nbsp;34<br>
10 &nbsp;&nbsp;3628800 &nbsp;&nbsp;55<br>
13! with long = 6227020800, with int = 1932053504 &nbsp;(int overflow!)<br>
20! = 2432902008176640000 is the largest factorial that fits in a long</div>
<p class="nhan">Câu hỏi trong syllabus: "Bước đệ quy trong định nghĩa Fibonacci là gì?"</p>
<p class="dap-an">✅ <strong>Đáp án:</strong> fibo(n) = fibo(n−1) + fibo(n−2) với n ≥ 2. Còn fibo(0) = 0 và fibo(1) = 1 là hai trường hợp cơ sở (base case), không phải bước đệ quy.</p>
<div class="pitfall">Hai lỗi kinh điển. (1) Viết <code>if (n &lt;= 2) return 1;</code> là đã đổi định nghĩa: fibo(0) thành 1 thay vì 0 như slide. (2) Kiểu <code>int</code> tràn số (overflow) âm thầm từ 13! trở đi — output cho ra 1932053504 thay vì 6227020800; hãy dùng <code>long</code> (đủ tới 20!) hoặc <code>BigInteger</code>.</div>`],
      [5, 'Recursive program/algorithm - 1',
        `<p class="y-chinh">🎯 Recursion is a second way to repeat work besides loops: a method calls itself, and the calling invocation is suspended until the call it made has completed.</p>
<ul>
<li><strong>Two forms</strong> (the paragraph comes from Goodrich, the textbook): a <em>method</em> that makes one or more calls to itself, or a <em>data structure</em> built from smaller instances of the same type — a linked list is a node followed by a shorter linked list; a tree node has smaller trees as children.</li>
<li><strong>No special machinery</strong>: Java runs a recursive call with exactly the same mechanism as any other method call (slides 8–9 show how).</li>
<li><strong>Suspended, then resumed</strong>: in the trace below, <code>sum(3)</code> stops in the middle of its own body, waits for <code>sum(2)</code>, and only then finishes its addition.</li>
</ul>
<pre><code class="language-java">public class LoopVsRecursion {
    static int sumLoop(int n) {                   // repetition with a loop
        int s = 0;
        for (int i = 1; i &lt;= n; i++) s += i;
        return s;
    }

    // Repetition with recursion; "pad" is only for indenting the printout.
    static int sumRec(int n, String pad) {
        System.out.println(pad + "sum(" + n + ") starts");
        if (n == 0) {
            System.out.println(pad + "sum(0) returns 0");
            return 0;
        }
        int r = n + sumRec(n - 1, pad + "  ");    // this invocation is SUSPENDED here
        System.out.println(pad + "sum(" + n + ") resumes, returns " + r);
        return r;
    }

    public static void main(String[] args) {
        System.out.println("loop:      sum(3) = " + sumLoop(3));
        int r = sumRec(3, "");
        System.out.println("recursion: sum(3) = " + r);
    }
}</code></pre>
<div class="out">loop: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum(3) = 6<br>
sum(3) starts<br>
&nbsp;&nbsp;sum(2) starts<br>
&nbsp;&nbsp;&nbsp;&nbsp;sum(1) starts<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum(0) starts<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum(0) returns 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;sum(1) resumes, returns 1<br>
&nbsp;&nbsp;sum(2) resumes, returns 3<br>
sum(3) resumes, returns 6<br>
recursion: sum(3) = 6</div>
<p>Both versions do n additions: O(n) time. The loop needs O(1) extra memory; the recursion has n + 1 invocations alive at its deepest point — O(n) stack memory.</p>
<p class="meo">🧠 <strong>Remember:</strong> read a recursive trace in two directions — "going down" (calls start, none has finished) and "coming back up" (each suspended call resumes and returns). The indentation in the output is exactly that.</p>`,
        `<p class="y-chinh">🎯 Đệ quy là cách thứ hai để lặp lại công việc, bên cạnh vòng lặp (loop): phương thức tự gọi chính nó, và lần gọi nào đã phát ra lời gọi con thì bị tạm dừng (suspended) cho tới khi lời gọi con đó chạy xong.</p>
<ul>
<li><strong>Hai dạng</strong> (đoạn văn trên slide lấy từ Goodrich, sách giáo trình): một <em>phương thức</em> gọi lại chính nó một hay nhiều lần, hoặc một <em>cấu trúc dữ liệu</em> dựng từ các thể hiện (instance) nhỏ hơn của cùng kiểu — danh sách liên kết (linked list) là một nút theo sau bởi một danh sách ngắn hơn; nút của cây (tree) có các cây nhỏ hơn làm con.</li>
<li><strong>Không cần cơ chế đặc biệt</strong>: Java chạy lời gọi đệ quy bằng đúng cơ chế của mọi lời gọi phương thức khác (slide 8–9 cho thấy cách làm).</li>
<li><strong>Tạm dừng rồi chạy tiếp</strong>: trong vết chạy (trace) dưới đây, <code>sum(3)</code> dừng ngay giữa thân hàm của nó, chờ <code>sum(2)</code> xong rồi mới làm nốt phép cộng.</li>
</ul>
<pre><code class="language-java">public class LoopVsRecursion {
    static int sumLoop(int n) {                   // lặp bằng vòng lặp
        int s = 0;
        for (int i = 1; i &lt;= n; i++) s += i;
        return s;
    }

    // Lặp bằng đệ quy; "pad" chỉ để thụt lề khi in.
    static int sumRec(int n, String pad) {
        System.out.println(pad + "sum(" + n + ") starts");
        if (n == 0) {
            System.out.println(pad + "sum(0) returns 0");
            return 0;
        }
        int r = n + sumRec(n - 1, pad + "  ");    // lần gọi này bị TẠM DỪNG ở đây
        System.out.println(pad + "sum(" + n + ") resumes, returns " + r);
        return r;
    }

    public static void main(String[] args) {
        System.out.println("loop:      sum(3) = " + sumLoop(3));
        int r = sumRec(3, "");
        System.out.println("recursion: sum(3) = " + r);
    }
}</code></pre>
<div class="out">loop: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum(3) = 6<br>
sum(3) starts<br>
&nbsp;&nbsp;sum(2) starts<br>
&nbsp;&nbsp;&nbsp;&nbsp;sum(1) starts<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum(0) starts<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum(0) returns 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;sum(1) resumes, returns 1<br>
&nbsp;&nbsp;sum(2) resumes, returns 3<br>
sum(3) resumes, returns 6<br>
recursion: sum(3) = 6</div>
<p>Cả hai bản đều làm n phép cộng: O(n) thời gian. Vòng lặp chỉ cần O(1) bộ nhớ phụ; bản đệ quy có lúc giữ n + 1 lần gọi còn sống cùng lúc — O(n) bộ nhớ ngăn xếp (stack).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đọc vết đệ quy theo hai chiều — "đi xuống" (các lời gọi bắt đầu, chưa cái nào xong) và "đi lên" (từng lời gọi đang chờ chạy tiếp rồi trả về). Phần thụt lề trong output chính là như vậy.</p>`],
      [6, 'Recursive program/algorithm - 2',
        `<p class="y-chinh">🎯 Three rules build every recursive algorithm — know how to take one step, break the problem into one step plus a smaller problem, know how and when to stop — and the slide's <code>DecToBin</code> shows all three.</p>
<ul>
<li><strong>One step</strong>: <code>q = n/2</code> and <code>r = n%2</code> — r is the last binary digit of n.</li>
<li><strong>Smaller problem</strong>: the binary digits of q, printed by <code>DecToBin(q)</code>.</li>
<li><strong>Stop</strong>: when <code>q == 0</code> there is no smaller problem left.</li>
<li><strong>Order</strong>: the print comes <em>after</em> the call, so the remainder computed last (the leftmost binary digit) is printed first.</li>
</ul>
<p class="nhan">Trace — DecToBin(13)</p>
<table>
<thead><tr><th>Activation</th><th>q = n/2</th><th>r = n%2</th><th><code>q &gt; 0</code>?</th><th>Printed on the way back</th></tr></thead>
<tbody>
<tr><td>DecToBin(13)</td><td>6</td><td>1</td><td>yes → DecToBin(6)</td><td>4th: 1</td></tr>
<tr><td>DecToBin(6)</td><td>3</td><td>0</td><td>yes → DecToBin(3)</td><td>3rd: 0</td></tr>
<tr><td>DecToBin(3)</td><td>1</td><td>1</td><td>yes → DecToBin(1)</td><td>2nd: 1</td></tr>
<tr><td>DecToBin(1)</td><td>0</td><td>1</td><td>no → stop</td><td>1st: 1</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class DecimalToBinary {
    public static void DecToBin(int n) {          // the slide's code, unchanged
        int q = n / 2;      // One step
        int r = n % 2;      // One step
        if (q &gt; 0) {
            DecToBin(q);    // smaller problem
        }
        System.out.print(r); // after all recursive calls have been made last remainder printed first
    }

    static void traced(int n, String pad) {       // the same steps, printed one by one
        int q = n / 2, r = n % 2;
        if (q &gt; 0) {
            System.out.println(pad + "DecToBin(" + n + "): q=" + q + ", r=" + r + " -&gt; call DecToBin(" + q + ") first");
            traced(q, pad + "  ");
            System.out.println(pad + "back in DecToBin(" + n + "): print " + r);
        } else {
            System.out.println(pad + "DecToBin(" + n + "): q=0, r=" + r + " -&gt; stop, print " + r);
        }
    }

    static void printFirst(int n) {               // WRONG order: print before the call
        System.out.print(n % 2);
        if (n / 2 &gt; 0) printFirst(n / 2);
    }

    public static void main(String[] args) {
        traced(13, "");
        for (int n : new int[] {13, 10, 6, 1, 0}) {
            System.out.print("DecToBin(" + n + ") prints ");
            DecToBin(n);
            System.out.println("   (Integer.toBinaryString: " + Integer.toBinaryString(n) + ")");
        }
        System.out.print("print BEFORE the call, n = 13: ");
        printFirst(13);
        System.out.println("   &lt;- reversed, wrong");
    }
}</code></pre>
<div class="out">DecToBin(13): q=6, r=1 -&gt; call DecToBin(6) first<br>
&nbsp;&nbsp;DecToBin(6): q=3, r=0 -&gt; call DecToBin(3) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;DecToBin(3): q=1, r=1 -&gt; call DecToBin(1) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DecToBin(1): q=0, r=1 -&gt; stop, print 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;back in DecToBin(3): print 1<br>
&nbsp;&nbsp;back in DecToBin(6): print 0<br>
back in DecToBin(13): print 1<br>
DecToBin(13) prints 1101 &nbsp;&nbsp;(Integer.toBinaryString: 1101)<br>
DecToBin(10) prints 1010 &nbsp;&nbsp;(Integer.toBinaryString: 1010)<br>
DecToBin(6) prints 110 &nbsp;&nbsp;(Integer.toBinaryString: 110)<br>
DecToBin(1) prints 1 &nbsp;&nbsp;(Integer.toBinaryString: 1)<br>
DecToBin(0) prints 0 &nbsp;&nbsp;(Integer.toBinaryString: 0)<br>
print BEFORE the call, n = 13: 1011 &nbsp;&nbsp;&lt;- reversed, wrong</div>
<p><strong>Big-O:</strong> every call halves n, so there are ⌊log₂ n⌋ + 1 calls, one per binary digit: O(log n) time and O(log n) stack depth. For 13: 4 calls, 4 digits.</p>
<div class="pitfall">Moving <code>System.out.print(r)</code> above the recursive call prints the digits in reverse (13 → 1011, last output line). The method also assumes n ≥ 0: in Java <code>-5 % 2</code> is −1, so <code>DecToBin(-5)</code> prints -1.</div>
<p class="meo">🧠 <strong>Remember:</strong> "print after the call = print in reverse order" — the same trick reverses a line of text on slide 13. Slide 13 of 2A-Stacks does this very conversion with an explicit stack instead.</p>`,
        `<p class="y-chinh">🎯 Ba quy tắc dựng nên mọi thuật toán đệ quy — biết làm một bước, tách bài toán thành một bước cộng một bài toán nhỏ hơn, biết dừng khi nào và dừng thế nào — và <code>DecToBin</code> (đổi thập phân sang nhị phân) của slide có đủ cả ba.</p>
<ul>
<li><strong>Một bước (one step)</strong>: <code>q = n/2</code> và <code>r = n%2</code> — r là chữ số nhị phân cuối cùng của n.</li>
<li><strong>Bài toán nhỏ hơn (smaller problem)</strong>: các chữ số nhị phân của q, do <code>DecToBin(q)</code> in ra.</li>
<li><strong>Dừng (stop)</strong>: khi <code>q == 0</code> thì không còn bài toán nhỏ hơn nào.</li>
<li><strong>Thứ tự</strong>: lệnh in đứng <em>sau</em> lời gọi, nên số dư tính ra sau cùng (chữ số nhị phân bên trái nhất) lại được in đầu tiên.</li>
</ul>
<p class="nhan">Lần theo — DecToBin(13)</p>
<table>
<thead><tr><th>Lần kích hoạt</th><th>q = n/2</th><th>r = n%2</th><th><code>q &gt; 0</code>?</th><th>In ra trên đường quay về</th></tr></thead>
<tbody>
<tr><td>DecToBin(13)</td><td>6</td><td>1</td><td>có → DecToBin(6)</td><td>thứ 4: 1</td></tr>
<tr><td>DecToBin(6)</td><td>3</td><td>0</td><td>có → DecToBin(3)</td><td>thứ 3: 0</td></tr>
<tr><td>DecToBin(3)</td><td>1</td><td>1</td><td>có → DecToBin(1)</td><td>thứ 2: 1</td></tr>
<tr><td>DecToBin(1)</td><td>0</td><td>1</td><td>không → dừng</td><td>thứ 1: 1</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class DecimalToBinary {
    public static void DecToBin(int n) {          // code của slide, giữ nguyên
        int q = n / 2;      // One step
        int r = n % 2;      // One step
        if (q &gt; 0) {
            DecToBin(q);    // smaller problem
        }
        System.out.print(r); // after all recursive calls have been made last remainder printed first
    }

    static void traced(int n, String pad) {       // đúng các bước đó, in ra từng bước
        int q = n / 2, r = n % 2;
        if (q &gt; 0) {
            System.out.println(pad + "DecToBin(" + n + "): q=" + q + ", r=" + r + " -&gt; call DecToBin(" + q + ") first");
            traced(q, pad + "  ");
            System.out.println(pad + "back in DecToBin(" + n + "): print " + r);
        } else {
            System.out.println(pad + "DecToBin(" + n + "): q=0, r=" + r + " -&gt; stop, print " + r);
        }
    }

    static void printFirst(int n) {               // SAI thứ tự: in trước khi gọi
        System.out.print(n % 2);
        if (n / 2 &gt; 0) printFirst(n / 2);
    }

    public static void main(String[] args) {
        traced(13, "");
        for (int n : new int[] {13, 10, 6, 1, 0}) {
            System.out.print("DecToBin(" + n + ") prints ");
            DecToBin(n);
            System.out.println("   (Integer.toBinaryString: " + Integer.toBinaryString(n) + ")");
        }
        System.out.print("print BEFORE the call, n = 13: ");
        printFirst(13);
        System.out.println("   &lt;- reversed, wrong");
    }
}</code></pre>
<div class="out">DecToBin(13): q=6, r=1 -&gt; call DecToBin(6) first<br>
&nbsp;&nbsp;DecToBin(6): q=3, r=0 -&gt; call DecToBin(3) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;DecToBin(3): q=1, r=1 -&gt; call DecToBin(1) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DecToBin(1): q=0, r=1 -&gt; stop, print 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;back in DecToBin(3): print 1<br>
&nbsp;&nbsp;back in DecToBin(6): print 0<br>
back in DecToBin(13): print 1<br>
DecToBin(13) prints 1101 &nbsp;&nbsp;(Integer.toBinaryString: 1101)<br>
DecToBin(10) prints 1010 &nbsp;&nbsp;(Integer.toBinaryString: 1010)<br>
DecToBin(6) prints 110 &nbsp;&nbsp;(Integer.toBinaryString: 110)<br>
DecToBin(1) prints 1 &nbsp;&nbsp;(Integer.toBinaryString: 1)<br>
DecToBin(0) prints 0 &nbsp;&nbsp;(Integer.toBinaryString: 0)<br>
print BEFORE the call, n = 13: 1011 &nbsp;&nbsp;&lt;- reversed, wrong</div>
<p><strong>Big-O:</strong> mỗi lời gọi chia đôi n, nên có ⌊log₂ n⌋ + 1 lời gọi, mỗi chữ số nhị phân một lời gọi: O(log n) thời gian và độ sâu ngăn xếp (stack) O(log n). Với 13: 4 lời gọi, 4 chữ số.</p>
<div class="pitfall">Đưa <code>System.out.print(r)</code> lên trước lời gọi đệ quy thì các chữ số bị in ngược (13 → 1011, dòng output cuối). Hàm cũng ngầm giả định n ≥ 0: trong Java <code>-5 % 2</code> bằng −1, nên <code>DecToBin(-5)</code> in ra -1.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "in sau lời gọi = in theo thứ tự ngược" — cũng mẹo này đảo ngược một dòng chữ ở slide 13. Slide 13 của bộ 2A-Stacks làm đúng phép đổi này bằng một ngăn xếp tường minh (explicit stack).</p>`],
      [7, 'Recursion application',
        `<p class="y-chinh">🎯 Recursive definitions define functions and sequences, and they serve two purposes: generating new elements, and testing whether an element belongs to a set by reducing the test to a simpler one.</p>
<p>The lesson's own example is the set P of palindromes — strings that read the same in both directions:</p>
<pre><code class="language-plaintext">1. ""  and every one-letter string are in P              (base case)
2. if s is in P and c is a letter, then c + s + c is in P  (inductive case)
3. nothing else is in P</code></pre>
<ul>
<li><strong>Generating</strong>: apply rule 2 to what you already have — level 1 is built from level 0, level 2 from level 1.</li>
<li><strong>Testing</strong> — the slide's (*): "is abba in P?" becomes "is bb in P?", then "is the empty string in P?" — a base case, so yes. "abab" fails at once: its first and last letters differ, so rule 2 cannot have produced it.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class Palindromes {
    // P: (1) "" and every one-letter string are in P; (2) if s is in P and c is a letter, c + s + c is in P.

    // Purpose 1 - GENERATE new elements: apply rule (2) to the elements we already have.
    static List&lt;String&gt; nextLevel(List&lt;String&gt; level) {
        List&lt;String&gt; res = new ArrayList&lt;String&gt;();
        for (String s : level)
            for (char c : new char[] {'a', 'b'}) res.add(c + s + c);
        return res;
    }

    // Purpose 2 - TEST membership: reduce the question to a simpler (shorter) string.
    static boolean isPal(String s, StringBuilder trace) {
        trace.append("isPal(\\"").append(s).append("\\")");
        if (s.length() &lt;= 1) return true;                             // base case
        if (s.charAt(0) != s.charAt(s.length() - 1)) return false;    // rule (2) cannot have produced s
        trace.append(" -&gt; ");
        return isPal(s.substring(1, s.length() - 1), trace);         // simpler problem
    }

    public static void main(String[] args) {
        List&lt;String&gt; level = new ArrayList&lt;String&gt;();
        level.add(""); level.add("a"); level.add("b");                // level 0 = the base elements
        System.out.println("level 0: \\"\\" a b");
        level = nextLevel(level);
        System.out.println("level 1: " + String.join(" ", level));
        level = nextLevel(level);
        System.out.println("level 2: " + level.size() + " new strings, e.g. " + level.get(1) + " " + level.get(2));
        for (String s : new String[] {"abba", "abab", "racecar"}) {
            StringBuilder t = new StringBuilder();
            boolean ok = isPal(s, t);
            System.out.println(t + " = " + ok);
        }
    }
}</code></pre>
<div class="out">level 0: "" a b<br>
level 1: aa bb aaa bab aba bbb<br>
level 2: 12 new strings, e.g. baab abba<br>
isPal("abba") -&gt; isPal("bb") -&gt; isPal("") = true<br>
isPal("abab") = false<br>
isPal("racecar") -&gt; isPal("aceca") -&gt; isPal("cec") -&gt; isPal("e") = true</div>
<p><strong>Big-O of the test:</strong> each call removes two characters, so a string of length n needs about n/2 + 1 calls. Each <code>substring</code> also copies the string, which makes this simple version O(n²) in total; passing two indexes <code>lo</code> and <code>hi</code> instead of building substrings makes it O(n).</p>
<p class="meo">🧠 <strong>Remember:</strong> "testing = reduce to a simpler problem" is exactly how you will search a binary search tree in Chapter 4: compare with the root, then ask the same question about one subtree.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa đệ quy dùng để định nghĩa hàm và dãy số, với hai mục đích: sinh ra phần tử mới (generating), và kiểm tra một phần tử có thuộc tập hay không (testing) bằng cách đưa phép kiểm tra về một phép kiểm tra đơn giản hơn.</p>
<p>Ví dụ của bài là tập P các chuỗi đối xứng (palindrome — đọc xuôi hay đọc ngược đều như nhau):</p>
<pre><code class="language-plaintext">1. ""  và mọi chuỗi một chữ cái đều thuộc P                   (trường hợp cơ sở)
2. nếu s thuộc P và c là một chữ cái thì c + s + c thuộc P    (bước quy nạp)
3. ngoài ra không có chuỗi nào khác thuộc P</code></pre>
<ul>
<li><strong>Sinh phần tử</strong>: áp luật 2 lên những gì đã có — mức 1 dựng từ mức 0, mức 2 dựng từ mức 1.</li>
<li><strong>Kiểm tra thuộc tập</strong> — dấu (*) trên slide: "abba có thuộc P?" trở thành "bb có thuộc P?", rồi "chuỗi rỗng có thuộc P?" — đó là trường hợp cơ sở (base case), nên có. "abab" bị loại ngay: chữ đầu và chữ cuối khác nhau, nên luật 2 không thể sinh ra nó.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class Palindromes {
    // P: (1) "" và mọi chuỗi một chữ cái thuộc P; (2) nếu s thuộc P và c là chữ cái thì c + s + c thuộc P.

    // Mục đích 1 - SINH phần tử mới: áp luật (2) lên các phần tử đã có.
    static List&lt;String&gt; nextLevel(List&lt;String&gt; level) {
        List&lt;String&gt; res = new ArrayList&lt;String&gt;();
        for (String s : level)
            for (char c : new char[] {'a', 'b'}) res.add(c + s + c);
        return res;
    }

    // Mục đích 2 - KIỂM TRA thuộc tập: đưa câu hỏi về một chuỗi đơn giản hơn (ngắn hơn).
    static boolean isPal(String s, StringBuilder trace) {
        trace.append("isPal(\\"").append(s).append("\\")");
        if (s.length() &lt;= 1) return true;                             // trường hợp cơ sở
        if (s.charAt(0) != s.charAt(s.length() - 1)) return false;    // luật (2) không thể sinh ra s
        trace.append(" -&gt; ");
        return isPal(s.substring(1, s.length() - 1), trace);         // bài toán đơn giản hơn
    }

    public static void main(String[] args) {
        List&lt;String&gt; level = new ArrayList&lt;String&gt;();
        level.add(""); level.add("a"); level.add("b");                // mức 0 = các phần tử cơ sở
        System.out.println("level 0: \\"\\" a b");
        level = nextLevel(level);
        System.out.println("level 1: " + String.join(" ", level));
        level = nextLevel(level);
        System.out.println("level 2: " + level.size() + " new strings, e.g. " + level.get(1) + " " + level.get(2));
        for (String s : new String[] {"abba", "abab", "racecar"}) {
            StringBuilder t = new StringBuilder();
            boolean ok = isPal(s, t);
            System.out.println(t + " = " + ok);
        }
    }
}</code></pre>
<div class="out">level 0: "" a b<br>
level 1: aa bb aaa bab aba bbb<br>
level 2: 12 new strings, e.g. baab abba<br>
isPal("abba") -&gt; isPal("bb") -&gt; isPal("") = true<br>
isPal("abab") = false<br>
isPal("racecar") -&gt; isPal("aceca") -&gt; isPal("cec") -&gt; isPal("e") = true</div>
<p><strong>Big-O của phép kiểm tra:</strong> mỗi lời gọi bỏ đi hai ký tự, nên chuỗi dài n cần khoảng n/2 + 1 lời gọi. Mỗi lần <code>substring</code> còn chép lại chuỗi, khiến bản đơn giản này tốn tổng cộng O(n²); truyền hai chỉ số <code>lo</code> và <code>hi</code> thay vì cắt chuỗi con sẽ còn O(n).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "kiểm tra = đưa về bài toán đơn giản hơn" chính là cách bạn sẽ tìm kiếm trên cây nhị phân tìm kiếm (binary search tree — BST) ở Chương 4: so với gốc, rồi hỏi đúng câu hỏi đó trên một cây con.</p>`],
      [8, 'Method calls and recursion implementation - 1',
        `<p class="y-chinh">🎯 Every method call gets an activation record (AR, also called a stack frame) pushed on top of the run-time stack; when the method ends, its AR is popped — so the first AR placed on the stack is the last one removed.</p>
<p class="nhan">What an activation record holds — the slide's list</p>
<ul>
<li><strong>Parameters and local variables</strong> of the called method.</li>
<li><strong>Dynamic link</strong>: a pointer to the caller's activation record.</li>
<li><strong>Return address</strong>: the caller's instruction right after the call, where control resumes.</li>
<li><strong>Return value</strong> (for a non-void method): placed right above the caller's AR, because the size of an AR varies from one call to another.</li>
</ul>
<p>That is the classic textbook model; the exact layout is up to the JVM, which keeps the same kinds of information in its frames. A Java program can even read the method names on its own run-time stack with <code>getStackTrace()</code> — each line below is printed from inside a method:</p>
<pre><code class="language-java">public class ActivationRecords {
    // Names of the methods whose activation records are on the JVM run-time stack right now, top first.
    static String stack() {
        StackTraceElement[] st = new Throwable().getStackTrace();
        StringBuilder s = new StringBuilder();
        for (int i = 1; i &lt; st.length; i++) {        // i = 0 is stack() itself: skip it
            if (s.length() &gt; 0) s.append(" | ");
            s.append(st[i].getMethodName());
        }
        return s.toString();
    }

    static int square(int x) {                        // AR of square: x, y, dynamic link, return address, return value
        int y = x * x;
        System.out.println("inside square(" + x + ")        stack (top first): " + stack());
        return y;
    }

    static int sumSquares(int a, int b) {
        System.out.println("inside sumSquares(" + a + "," + b + ")  stack (top first): " + stack());
        int s = square(a) + square(b);
        System.out.println("back in sumSquares      stack (top first): " + stack());
        return s;
    }

    public static void main(String[] args) {
        System.out.println("inside main             stack (top first): " + stack());
        int r = sumSquares(3, 4);
        System.out.println("back in main, r = " + r + "   stack (top first): " + stack());
    }
}</code></pre>
<div class="out">inside main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): main<br>
inside sumSquares(3,4) &nbsp;stack (top first): sumSquares | main<br>
inside square(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): square | sumSquares | main<br>
inside square(4) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): square | sumSquares | main<br>
back in sumSquares &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): sumSquares | main<br>
back in main, r = 25 &nbsp;&nbsp;stack (top first): main</div>
<table>
<thead><tr><th>Moment</th><th>Run-time stack (top first)</th><th>Inside the top AR</th></tr></thead>
<tbody>
<tr><td>inside square(3)</td><td>square, sumSquares, main</td><td>x = 3, y = 9; return address: the addition in <code>square(a) + square(b)</code></td></tr>
<tr><td>square(3) has returned</td><td>sumSquares, main</td><td>square's AR is gone; its value 9 waits for the addition</td></tr>
<tr><td>inside square(4)</td><td>square, sumSquares, main</td><td>a NEW AR: x = 4, y = 16</td></tr>
<tr><td>back in main</td><td>main</td><td>r = 9 + 16 = 25</td></tr>
</tbody>
</table>
<div class="pitfall">"A method's local variables live as long as the program" — false. They live in the method's AR and vanish when it returns. Only objects still referenced from somewhere survive, because objects live on the heap, not in the AR.</div>`,
        `<p class="y-chinh">🎯 Mỗi lời gọi phương thức được cấp một bản ghi kích hoạt (activation record — AR, còn gọi là khung ngăn xếp — stack frame) đặt lên đỉnh ngăn xếp lúc chạy (run-time stack); phương thức kết thúc thì AR của nó bị lấy ra — nên AR được đặt vào đầu tiên sẽ là AR bị lấy ra cuối cùng.</p>
<p class="nhan">Một bản ghi kích hoạt chứa gì — danh sách của slide</p>
<ul>
<li><strong>Tham số (parameter) và biến cục bộ (local variable)</strong> của phương thức được gọi.</li>
<li><strong>Liên kết động (dynamic link)</strong>: con trỏ tới AR của nơi gọi (caller).</li>
<li><strong>Địa chỉ trở về (return address)</strong>: lệnh của nơi gọi nằm ngay sau lời gọi, nơi chương trình chạy tiếp.</li>
<li><strong>Giá trị trả về (return value)</strong> (với phương thức không phải void): đặt ngay phía trên AR của nơi gọi, vì kích thước AR mỗi lần gọi mỗi khác.</li>
</ul>
<p>Đó là mô hình kinh điển trong sách; cách sắp xếp cụ thể do máy ảo Java (JVM) quyết định, nhưng khung của JVM giữ đúng những loại thông tin này. Chương trình Java còn đọc được tên các phương thức trên run-time stack của chính nó bằng <code>getStackTrace()</code> — mỗi dòng dưới đây được in từ bên trong một phương thức:</p>
<pre><code class="language-java">public class ActivationRecords {
    // Tên các phương thức đang có activation record trên run-time stack của JVM, đỉnh đứng trước.
    static String stack() {
        StackTraceElement[] st = new Throwable().getStackTrace();
        StringBuilder s = new StringBuilder();
        for (int i = 1; i &lt; st.length; i++) {        // i = 0 là chính stack(): bỏ qua
            if (s.length() &gt; 0) s.append(" | ");
            s.append(st[i].getMethodName());
        }
        return s.toString();
    }

    static int square(int x) {                        // AR của square: x, y, liên kết động, địa chỉ trở về, giá trị trả về
        int y = x * x;
        System.out.println("inside square(" + x + ")        stack (top first): " + stack());
        return y;
    }

    static int sumSquares(int a, int b) {
        System.out.println("inside sumSquares(" + a + "," + b + ")  stack (top first): " + stack());
        int s = square(a) + square(b);
        System.out.println("back in sumSquares      stack (top first): " + stack());
        return s;
    }

    public static void main(String[] args) {
        System.out.println("inside main             stack (top first): " + stack());
        int r = sumSquares(3, 4);
        System.out.println("back in main, r = " + r + "   stack (top first): " + stack());
    }
}</code></pre>
<div class="out">inside main &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): main<br>
inside sumSquares(3,4) &nbsp;stack (top first): sumSquares | main<br>
inside square(3) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): square | sumSquares | main<br>
inside square(4) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): square | sumSquares | main<br>
back in sumSquares &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stack (top first): sumSquares | main<br>
back in main, r = 25 &nbsp;&nbsp;stack (top first): main</div>
<table>
<thead><tr><th>Thời điểm</th><th>Run-time stack (đỉnh trước)</th><th>Trong AR ở đỉnh</th></tr></thead>
<tbody>
<tr><td>đang ở trong square(3)</td><td>square, sumSquares, main</td><td>x = 3, y = 9; địa chỉ trở về: phép cộng trong <code>square(a) + square(b)</code></td></tr>
<tr><td>square(3) đã trả về</td><td>sumSquares, main</td><td>AR của square đã mất; giá trị 9 của nó chờ phép cộng</td></tr>
<tr><td>đang ở trong square(4)</td><td>square, sumSquares, main</td><td>một AR MỚI: x = 4, y = 16</td></tr>
<tr><td>đã về main</td><td>main</td><td>r = 9 + 16 = 25</td></tr>
</tbody>
</table>
<div class="pitfall">"Biến cục bộ của phương thức sống suốt chương trình" — SAI. Chúng nằm trong AR của phương thức và biến mất khi phương thức trả về. Chỉ các đối tượng còn được tham chiếu từ nơi khác mới còn sống, vì đối tượng nằm trên vùng nhớ heap chứ không nằm trong AR.</div>`],
      [9, 'Method calls and recursion implementation - 2',
        `<p class="y-chinh">🎯 Because every call gets its own activation record, a recursive call is really one instantiation of the method calling another instantiation of it — each with its own parameters and locals, kept apart by the system.</p>
<ul>
<li>For the machine, recursion is nothing special: it is "calling a method that happens to have the same name as the caller".</li>
<li><strong>own(3)</strong> below creates three ARs, and each holds its own <code>local</code>. After the inner calls return, every activation still sees its own value: 10, 20, 30.</li>
<li><strong>common(3)</strong> keeps its value in a <code>static</code> field instead. A static field lives outside every AR — there is only one — so each call overwrites it and every activation ends up reading 10.</li>
</ul>
<pre><code class="language-java">public class OwnLocals {
    static int shared;                                // ONE variable for every activation

    static void own(int n) {
        int local = n * 10;                           // a NEW 'local' inside each activation record
        if (n &gt; 1) own(n - 1);
        System.out.println("own(" + n + ") ends:    local  = " + local);
    }

    static void common(int n) {
        int mine = n * 10;
        shared = mine;                                // every activation overwrites the same variable
        if (n &gt; 1) common(n - 1);
        System.out.println("common(" + n + ") ends: shared = " + shared + "   (it had stored " + mine + ")");
    }

    public static void main(String[] args) {
        own(3);
        common(3);
    }
}</code></pre>
<div class="out">own(1) ends: &nbsp;&nbsp;&nbsp;local &nbsp;= 10<br>
own(2) ends: &nbsp;&nbsp;&nbsp;local &nbsp;= 20<br>
own(3) ends: &nbsp;&nbsp;&nbsp;local &nbsp;= 30<br>
common(1) ends: shared = 10 &nbsp;&nbsp;(it had stored 10)<br>
common(2) ends: shared = 10 &nbsp;&nbsp;(it had stored 20)<br>
common(3) ends: shared = 10 &nbsp;&nbsp;(it had stored 30)</div>
<table>
<thead><tr><th>Deepest point</th><th>ARs on the stack (top first)</th><th>What the variables hold</th></tr></thead>
<tbody>
<tr><td>own(3)</td><td>own(1), own(2), own(3), main</td><td>three different <code>local</code> variables: 10, 20, 30</td></tr>
<tr><td>common(3)</td><td>common(1), common(2), common(3), main</td><td>one <code>shared</code> variable: 10 — the last write wins</td></tr>
</tbody>
</table>
<div class="pitfall">PE trap: keeping per-call data (a partial result, the "current" node) in a <code>static</code> field. It breaks as soon as a call needs its own value after an inner call has run. Pass such data as a parameter or return it. A static counter of calls is fine — it is meant to be global.</div>
<p class="meo">🧠 <strong>Remember:</strong> parameters and locals = one copy <em>per call</em>; static fields = one copy <em>per program</em>.</p>`,
        `<p class="y-chinh">🎯 Vì mỗi lời gọi có bản ghi kích hoạt (activation record — AR) riêng, một lời gọi đệ quy thật ra là một thể hiện (instantiation) của phương thức gọi một thể hiện khác của nó — mỗi thể hiện có tham số và biến cục bộ riêng, được hệ thống tách bạch.</p>
<ul>
<li>Với máy, đệ quy chẳng có gì đặc biệt: đó là "gọi một phương thức tình cờ trùng tên với nơi gọi".</li>
<li><strong>own(3)</strong> dưới đây tạo ra ba AR, mỗi AR giữ một biến <code>local</code> riêng. Sau khi các lời gọi bên trong trả về, lần kích hoạt nào cũng vẫn thấy đúng giá trị của mình: 10, 20, 30.</li>
<li><strong>common(3)</strong> lại cất giá trị vào một trường <code>static</code>. Trường static nằm ngoài mọi AR — chỉ có một bản — nên lời gọi nào cũng ghi đè lên nó và rốt cuộc mọi lần kích hoạt đều đọc ra 10.</li>
</ul>
<pre><code class="language-java">public class OwnLocals {
    static int shared;                                // MỘT biến dùng chung cho mọi lần gọi

    static void own(int n) {
        int local = n * 10;                           // mỗi activation record có một 'local' MỚI
        if (n &gt; 1) own(n - 1);
        System.out.println("own(" + n + ") ends:    local  = " + local);
    }

    static void common(int n) {
        int mine = n * 10;
        shared = mine;                                // lần gọi nào cũng ghi đè cùng một biến
        if (n &gt; 1) common(n - 1);
        System.out.println("common(" + n + ") ends: shared = " + shared + "   (it had stored " + mine + ")");
    }

    public static void main(String[] args) {
        own(3);
        common(3);
    }
}</code></pre>
<div class="out">own(1) ends: &nbsp;&nbsp;&nbsp;local &nbsp;= 10<br>
own(2) ends: &nbsp;&nbsp;&nbsp;local &nbsp;= 20<br>
own(3) ends: &nbsp;&nbsp;&nbsp;local &nbsp;= 30<br>
common(1) ends: shared = 10 &nbsp;&nbsp;(it had stored 10)<br>
common(2) ends: shared = 10 &nbsp;&nbsp;(it had stored 20)<br>
common(3) ends: shared = 10 &nbsp;&nbsp;(it had stored 30)</div>
<table>
<thead><tr><th>Lúc sâu nhất</th><th>Các AR trên stack (đỉnh trước)</th><th>Các biến chứa gì</th></tr></thead>
<tbody>
<tr><td>own(3)</td><td>own(1), own(2), own(3), main</td><td>ba biến <code>local</code> khác nhau: 10, 20, 30</td></tr>
<tr><td>common(3)</td><td>common(1), common(2), common(3), main</td><td>một biến <code>shared</code> duy nhất: 10 — lần ghi cuối thắng</td></tr>
</tbody>
</table>
<div class="pitfall">Bẫy PE: cất dữ liệu riêng của từng lời gọi (kết quả dở dang, nút "hiện tại") vào một trường <code>static</code>. Nó hỏng ngay khi một lời gọi cần giá trị của chính mình sau khi lời gọi bên trong đã chạy. Hãy truyền dữ liệu đó qua tham số (parameter) hoặc trả nó về. Còn một biến static đếm số lời gọi thì không sao — nó vốn dĩ là của chung.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> tham số và biến cục bộ = mỗi <em>lời gọi</em> một bản; trường static = cả <em>chương trình</em> một bản.</p>`],
      [10, 'Anatomy of a recursive call',
        `<p class="y-chinh">🎯 factorial(4) makes four activations: on the way down each one asks <code>N &lt;= 1?</code> and waits; on the way back the answers 1, 2, 6 and 24 are returned upwards, ending in the first call.</p>
<p>The program is the slide's factorial with a printout added at each step (the extra parameter <code>pad</code> only indents the lines by depth):</p>
<pre><code class="language-java">public class FactorialAnatomy {
    // The slide's factorial; "pad" is added only to indent the printout by depth.
    static int factorial(int N, String pad) {
        if (N &lt;= 1) {
            System.out.println(pad + "factorial(" + N + "): N &lt;= 1? YES -&gt; return 1");
            return 1;
        }
        System.out.println(pad + "factorial(" + N + "): N &lt;= 1? NO  -&gt; return " + N + " * factorial(" + (N - 1) + ")");
        int sub = factorial(N - 1, pad + "  ");      // this activation waits here
        System.out.println(pad + "factorial(" + N + ") returns " + N + " * " + sub + " = " + (N * sub));
        return N * sub;
    }

    public static void main(String[] args) {
        int r = factorial(4, "");                   // First call
        System.out.println("First call factorial(4) = " + r);
    }
}</code></pre>
<div class="out">factorial(4): N &lt;= 1? NO &nbsp;-&gt; return 4 * factorial(3)<br>
&nbsp;&nbsp;factorial(3): N &lt;= 1? NO &nbsp;-&gt; return 3 * factorial(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;factorial(2): N &lt;= 1? NO &nbsp;-&gt; return 2 * factorial(1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;factorial(1): N &lt;= 1? YES -&gt; return 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;factorial(2) returns 2 * 1 = 2<br>
&nbsp;&nbsp;factorial(3) returns 3 * 2 = 6<br>
factorial(4) returns 4 * 6 = 24<br>
First call factorial(4) = 24</div>
<p class="nhan">The run-time stack at each step (bottom → top)</p>
<table>
<thead><tr><th>Step</th><th>Event</th><th>Stack</th><th>Value</th></tr></thead>
<tbody>
<tr><td>1</td><td>first call factorial(4): <code>N &lt;= 1</code>? NO</td><td>f(4)</td><td>waits for f(3)</td></tr>
<tr><td>2</td><td>factorial(3): NO</td><td>f(4) f(3)</td><td>waits for f(2)</td></tr>
<tr><td>3</td><td>factorial(2): NO</td><td>f(4) f(3) f(2)</td><td>waits for f(1)</td></tr>
<tr><td>4</td><td>factorial(1): YES</td><td>f(4) f(3) f(2) f(1)</td><td>returns 1 — deepest point, 4 ARs</td></tr>
<tr><td>5</td><td>f(1) popped</td><td>f(4) f(3) f(2)</td><td>2 * 1 = 2 returned</td></tr>
<tr><td>6</td><td>f(2) popped</td><td>f(4) f(3)</td><td>3 * 2 = 6 returned</td></tr>
<tr><td>7</td><td>f(3) popped</td><td>f(4)</td><td>4 * 6 = 24 returned</td></tr>
<tr><td>8</td><td>f(4) popped</td><td>(only main is left)</td><td>24 reaches the caller</td></tr>
</tbody>
</table>
<ul>
<li>Nothing is multiplied on the way down; every multiplication happens on the way back up.</li>
<li><strong>Big-O:</strong> factorial(n) makes n activations and n − 1 multiplications: O(n) time and O(n) stack depth.</li>
</ul>
<div class="pitfall">FE-style question: "main calls factorial(4); how many ARs are on the stack while factorial(1) runs?" — five: four for factorial plus one for main. Count the running call too, not only the waiting ones.</div>
<p class="meo">🧠 <strong>Remember:</strong> "down: ask and wait; up: compute and return".</p>`,
        `<p class="y-chinh">🎯 factorial(4) tạo ra bốn lần kích hoạt: trên đường đi xuống mỗi lần hỏi <code>N &lt;= 1?</code> rồi đứng chờ; trên đường quay về các kết quả 1, 2, 6 và 24 được trả ngược lên, kết thúc ở lời gọi đầu tiên.</p>
<p>Chương trình là hàm factorial (giai thừa) của slide, thêm lệnh in ở từng bước (tham số phụ <code>pad</code> chỉ để thụt lề theo độ sâu):</p>
<pre><code class="language-java">public class FactorialAnatomy {
    // factorial của slide; "pad" chỉ thêm vào để thụt lề theo độ sâu.
    static int factorial(int N, String pad) {
        if (N &lt;= 1) {
            System.out.println(pad + "factorial(" + N + "): N &lt;= 1? YES -&gt; return 1");
            return 1;
        }
        System.out.println(pad + "factorial(" + N + "): N &lt;= 1? NO  -&gt; return " + N + " * factorial(" + (N - 1) + ")");
        int sub = factorial(N - 1, pad + "  ");      // lần kích hoạt này chờ ở đây
        System.out.println(pad + "factorial(" + N + ") returns " + N + " * " + sub + " = " + (N * sub));
        return N * sub;
    }

    public static void main(String[] args) {
        int r = factorial(4, "");                   // Lời gọi đầu tiên
        System.out.println("First call factorial(4) = " + r);
    }
}</code></pre>
<div class="out">factorial(4): N &lt;= 1? NO &nbsp;-&gt; return 4 * factorial(3)<br>
&nbsp;&nbsp;factorial(3): N &lt;= 1? NO &nbsp;-&gt; return 3 * factorial(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;factorial(2): N &lt;= 1? NO &nbsp;-&gt; return 2 * factorial(1)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;factorial(1): N &lt;= 1? YES -&gt; return 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;factorial(2) returns 2 * 1 = 2<br>
&nbsp;&nbsp;factorial(3) returns 3 * 2 = 6<br>
factorial(4) returns 4 * 6 = 24<br>
First call factorial(4) = 24</div>
<p class="nhan">Ngăn xếp lúc chạy (run-time stack) ở từng bước (đáy → đỉnh); mỗi f(k) là một bản ghi kích hoạt (activation record — AR)</p>
<table>
<thead><tr><th>Bước</th><th>Sự kiện</th><th>Stack</th><th>Giá trị</th></tr></thead>
<tbody>
<tr><td>1</td><td>lời gọi đầu factorial(4): <code>N &lt;= 1</code>? KHÔNG</td><td>f(4)</td><td>chờ f(3)</td></tr>
<tr><td>2</td><td>factorial(3): KHÔNG</td><td>f(4) f(3)</td><td>chờ f(2)</td></tr>
<tr><td>3</td><td>factorial(2): KHÔNG</td><td>f(4) f(3) f(2)</td><td>chờ f(1)</td></tr>
<tr><td>4</td><td>factorial(1): CÓ</td><td>f(4) f(3) f(2) f(1)</td><td>trả về 1 — sâu nhất, 4 AR</td></tr>
<tr><td>5</td><td>lấy f(1) ra</td><td>f(4) f(3) f(2)</td><td>trả về 2 * 1 = 2</td></tr>
<tr><td>6</td><td>lấy f(2) ra</td><td>f(4) f(3)</td><td>trả về 3 * 2 = 6</td></tr>
<tr><td>7</td><td>lấy f(3) ra</td><td>f(4)</td><td>trả về 4 * 6 = 24</td></tr>
<tr><td>8</td><td>lấy f(4) ra</td><td>(chỉ còn main)</td><td>24 về tới nơi gọi</td></tr>
</tbody>
</table>
<ul>
<li>Trên đường đi xuống không có phép nhân nào; mọi phép nhân đều diễn ra trên đường quay về.</li>
<li><strong>Big-O:</strong> factorial(n) tạo n lần kích hoạt và n − 1 phép nhân: O(n) thời gian và độ sâu stack O(n).</li>
</ul>
<div class="pitfall">Câu hỏi kiểu FE: "main gọi factorial(4); lúc factorial(1) đang chạy có bao nhiêu bản ghi kích hoạt (AR — activation record) trên stack?" — năm: bốn của factorial cộng một của main. Phải đếm cả lời gọi đang chạy, không chỉ các lời gọi đang chờ.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "đi xuống: hỏi rồi chờ; đi lên: tính rồi trả".</p>`],
      [11, 'Classification of recursive functions by number of recursive calls',
        `<p class="y-chinh">🎯 Counting the maximum number of recursive calls made inside one activation gives three kinds: linear recursion (1 call), binary recursion (exactly 2), multiple recursion (3 or more).</p>
<table>
<thead><tr><th>Kind</th><th>Calls per activation</th><th>Slide's example</th><th>Program below</th><th>Calls in the output</th></tr></thead>
<tbody>
<tr><td>Linear</td><td>1</td><td>binary search</td><td><code>search</code> in 16 numbers</td><td>4 (found) / 5 (absent)</td></tr>
<tr><td>Binary</td><td>exactly 2</td><td>Fibonacci numbers</td><td><code>fibo(10)</code></td><td>177</td></tr>
<tr><td>Multiple</td><td>3 or more</td><td>—</td><td><code>trib(10)</code>, 3 calls</td><td>289</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class CallCounting {
    static int calls;                                 // counts every activation

    // LINEAR: two call sites, but only ONE can run in an activation
    static int search(int[] a, int key, int lo, int hi) {
        calls++;
        if (lo &gt; hi) return -1;
        int mid = (lo + hi) / 2;
        if (a[mid] == key) return mid;
        if (key &lt; a[mid]) return search(a, key, lo, mid - 1);
        return search(a, key, mid + 1, hi);
    }

    static long fibo(int n) {                         // BINARY: exactly 2 calls
        calls++;
        if (n &lt; 2) return n;
        return fibo(n - 1) + fibo(n - 2);
    }

    static long trib(int n) {                         // MULTIPLE: 3 calls (trib = "tribonacci")
        calls++;
        if (n &lt; 3) return n == 2 ? 1 : 0;             // trib(0) = 0, trib(1) = 0, trib(2) = 1
        return trib(n - 1) + trib(n - 2) + trib(n - 3);
    }

    public static void main(String[] args) {
        int[] a = {2, 4, 5, 7, 8, 9, 12, 14, 17, 19, 22, 25, 27, 28, 33, 37};
        for (int key : new int[] {22, 3}) {
            calls = 0;
            int i = search(a, key, 0, a.length - 1);
            System.out.println("linear   search(" + key + ") in 16 numbers -&gt; index " + i + ", " + calls + " calls");
        }
        for (int n : new int[] {5, 10}) {
            calls = 0;
            long f = fibo(n);
            System.out.println("binary   fibo(" + n + ") = " + f + ", " + calls + " calls");
        }
        for (int n : new int[] {5, 10}) {
            calls = 0;
            long t = trib(n);
            System.out.println("multiple trib(" + n + ") = " + t + ", " + calls + " calls");
        }
    }
}</code></pre>
<div class="out">linear &nbsp;&nbsp;search(22) in 16 numbers -&gt; index 10, 4 calls<br>
linear &nbsp;&nbsp;search(3) in 16 numbers -&gt; index -1, 5 calls<br>
binary &nbsp;&nbsp;fibo(5) = 5, 15 calls<br>
binary &nbsp;&nbsp;fibo(10) = 55, 177 calls<br>
multiple trib(5) = 4, 13 calls<br>
multiple trib(10) = 81, 289 calls</div>
<ul>
<li><strong>Binary search is linear recursion</strong>: its body contains two call statements, but they sit in different branches, so each activation executes only one of them.</li>
<li>Linear recursion is a chain: the number of calls equals the depth — about log₂ n for binary search, n for factorial.</li>
<li>Binary and multiple recursion build a tree of calls that can grow exponentially: fibo goes from 15 calls (n = 5) to 177 (n = 10), trib from 13 to 289.</li>
<li>Goodrich §5.3.3 gives the file-system disk-usage method as multiple recursion: one call per entry of a directory. The Sierpinski triangle (slide 21) and the Koch curve (slide 22) are multiple too.</li>
</ul>
<div class="pitfall">Two FE traps. (1) "Binary search uses binary recursion" — false: count the calls that can run in one activation, not the call statements, and not the word "binary" in the name. (2) Lessons 3.2 and 3.4 below name some recursions by another rule — how many call sites <em>and</em> how much each call shrinks the input — so 3.2 calls binary search "binary recursion" and 3.4 lists Fibonacci as multiple. For questions on this deck use the slide's rule: 1 / exactly 2 / 3 or more calls that can run in one activation.</div>`,
        `<p class="y-chinh">🎯 Đếm số lời gọi đệ quy nhiều nhất trong một lần kích hoạt, ta có ba loại: đệ quy tuyến tính (linear recursion — 1 lời gọi), đệ quy nhị phân (binary recursion — đúng 2), đệ quy bội (multiple recursion — từ 3 trở lên).</p>
<table>
<thead><tr><th>Loại</th><th>Số lời gọi mỗi lần kích hoạt</th><th>Ví dụ của slide</th><th>Chương trình dưới</th><th>Số lời gọi trong output</th></tr></thead>
<tbody>
<tr><td>Tuyến tính</td><td>1</td><td>tìm kiếm nhị phân</td><td><code>search</code> trong 16 số</td><td>4 (tìm thấy) / 5 (không có)</td></tr>
<tr><td>Nhị phân</td><td>đúng 2</td><td>số Fibonacci</td><td><code>fibo(10)</code></td><td>177</td></tr>
<tr><td>Bội</td><td>từ 3 trở lên</td><td>—</td><td><code>trib(10)</code>, 3 lời gọi</td><td>289</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class CallCounting {
    static int calls;                                 // đếm mọi lần kích hoạt

    // TUYẾN TÍNH: hai chỗ gọi, nhưng mỗi lần kích hoạt chỉ MỘT lời gọi chạy
    static int search(int[] a, int key, int lo, int hi) {
        calls++;
        if (lo &gt; hi) return -1;
        int mid = (lo + hi) / 2;
        if (a[mid] == key) return mid;
        if (key &lt; a[mid]) return search(a, key, lo, mid - 1);
        return search(a, key, mid + 1, hi);
    }

    static long fibo(int n) {                         // NHỊ PHÂN: đúng 2 lời gọi
        calls++;
        if (n &lt; 2) return n;
        return fibo(n - 1) + fibo(n - 2);
    }

    static long trib(int n) {                         // BỘI: 3 lời gọi
        calls++;
        if (n &lt; 3) return n == 2 ? 1 : 0;             // trib(0) = 0, trib(1) = 0, trib(2) = 1
        return trib(n - 1) + trib(n - 2) + trib(n - 3);
    }

    public static void main(String[] args) {
        int[] a = {2, 4, 5, 7, 8, 9, 12, 14, 17, 19, 22, 25, 27, 28, 33, 37};
        for (int key : new int[] {22, 3}) {
            calls = 0;
            int i = search(a, key, 0, a.length - 1);
            System.out.println("linear   search(" + key + ") in 16 numbers -&gt; index " + i + ", " + calls + " calls");
        }
        for (int n : new int[] {5, 10}) {
            calls = 0;
            long f = fibo(n);
            System.out.println("binary   fibo(" + n + ") = " + f + ", " + calls + " calls");
        }
        for (int n : new int[] {5, 10}) {
            calls = 0;
            long t = trib(n);
            System.out.println("multiple trib(" + n + ") = " + t + ", " + calls + " calls");
        }
    }
}</code></pre>
<div class="out">linear &nbsp;&nbsp;search(22) in 16 numbers -&gt; index 10, 4 calls<br>
linear &nbsp;&nbsp;search(3) in 16 numbers -&gt; index -1, 5 calls<br>
binary &nbsp;&nbsp;fibo(5) = 5, 15 calls<br>
binary &nbsp;&nbsp;fibo(10) = 55, 177 calls<br>
multiple trib(5) = 4, 13 calls<br>
multiple trib(10) = 81, 289 calls</div>
<ul>
<li><strong>Tìm kiếm nhị phân (binary search) là đệ quy tuyến tính</strong>: thân hàm có hai câu lệnh gọi, nhưng chúng nằm ở hai nhánh khác nhau, nên mỗi lần kích hoạt chỉ chạy một trong hai.</li>
<li>Đệ quy tuyến tính là một chuỗi: số lời gọi bằng độ sâu — khoảng log₂ n với tìm kiếm nhị phân, n với giai thừa.</li>
<li>Đệ quy nhị phân và bội dựng nên một cây lời gọi (call tree) có thể phình theo hàm mũ: fibo tăng từ 15 lời gọi (n = 5) lên 177 (n = 10), trib từ 13 lên 289.</li>
<li>Goodrich §5.3.3 lấy phương thức tính dung lượng thư mục (disk usage) làm ví dụ đệ quy bội: mỗi mục trong thư mục một lời gọi. Tam giác Sierpinski (slide 21) và đường Koch (slide 22) cũng là đệ quy bội.</li>
</ul>
<div class="pitfall">Hai bẫy FE. (1) "Tìm kiếm nhị phân dùng đệ quy nhị phân" — SAI: đếm số lời gọi có thể chạy trong một lần kích hoạt, không đếm số câu lệnh gọi, và đừng để chữ "binary" trong tên đánh lừa. (2) Các bài 3.2 và 3.4 bên dưới gọi tên vài phép đệ quy theo một quy tắc khác — số chỗ gọi <em>và</em> mỗi lời gọi thu nhỏ đầu vào bao nhiêu — nên bài 3.2 gọi tìm kiếm nhị phân là "đệ quy nhị phân" còn bài 3.4 xếp Fibonacci vào loại bội. Với câu hỏi về bộ slide này, hãy dùng quy tắc của slide: 1 / đúng 2 / từ 3 lời gọi trở lên có thể chạy trong một lần kích hoạt.</div>`],
      [12, 'Tail recursion',
        `<p class="y-chinh">🎯 Tail recursion: the method makes only one recursive call, at the very end of its implementation — nothing is left to do when that call returns.</p>
<ul>
<li><code>tail(n)</code> prints n, then calls <code>tail(n-1)</code> as its last action; the slide's <code>main</code> calls <code>tail(10)</code> and prints 10 down to 1. (The slide's class <code>Main</code> is renamed <code>TailDemo</code> to match the file name.)</li>
<li>Since no work waits after the call, the call can be replaced by "update the parameter and go back to the top" — a loop (<code>tailAsLoop</code>, same output). Goodrich §5.6 calls this eliminating tail recursion.</li>
<li><strong>The slide's nonTail, as its text reads</strong>, calls <code>tail(i-1)</code> twice, not itself — so it is not recursive at all, just a method that calls the tail-recursive one twice: <code>nonTail(3)</code> prints tail(2), then 3, then tail(2).</li>
<li><strong>The usual version of this example</strong> (for instance in Drozdek's textbook) calls <code>nonTail(i-1)</code> in both places — the slide's <code>tail(i-1)</code> is most likely a typo. The first call is followed by more work, so that method is non-tail recursive; <code>nonTail(3)</code> prints 1213121.</li>
</ul>
<pre><code class="language-java">public class TailDemo {                               // the slide's class Main, renamed to match the file
    static void tail(int n) {                        // the slide's tail(): one call, the very last action
        if (n &gt; 0) {
            System.out.print(n + "  ");
            tail(n - 1);
        }
    }

    static void tailAsLoop(int n) {                  // the same method with the call replaced by a loop
        while (n &gt; 0) {
            System.out.print(n + "  ");
            n = n - 1;
        }
    }

    static void nonTailAsOnSlide(int i) {            // the slide's text: it calls tail(), not itself
        if (i &gt; 0) {
            tail(i - 1);
            System.out.print(i + "");
            tail(i - 1);
        }
    }

    static void nonTail(int i) {                     // the classic version: calls nonTail(i-1)
        if (i &gt; 0) {
            nonTail(i - 1);                          // NOT the last action: work remains after it
            System.out.print(i + "");
            nonTail(i - 1);
        }
    }

    public static void main(String[] args) {
        System.out.print("tail(10):               "); tail(10); System.out.println();
        System.out.print("tailAsLoop(10):         "); tailAsLoop(10); System.out.println();
        System.out.print("nonTail(3) as on slide: "); nonTailAsOnSlide(3); System.out.println();
        System.out.print("nonTail(3) classic:     "); nonTail(3); System.out.println();
        System.out.print("nonTail(4) classic:     "); nonTail(4); System.out.println();
    }
}</code></pre>
<div class="out">tail(10): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;9 &nbsp;8 &nbsp;7 &nbsp;6 &nbsp;5 &nbsp;4 &nbsp;3 &nbsp;2 &nbsp;1<br>
tailAsLoop(10): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;9 &nbsp;8 &nbsp;7 &nbsp;6 &nbsp;5 &nbsp;4 &nbsp;3 &nbsp;2 &nbsp;1<br>
nonTail(3) as on slide: 2 &nbsp;1 &nbsp;32 &nbsp;1<br>
nonTail(3) classic: &nbsp;&nbsp;&nbsp;&nbsp;1213121<br>
nonTail(4) classic: &nbsp;&nbsp;&nbsp;&nbsp;121312141213121</div>
<p><strong>Big-O:</strong> <code>tail(n)</code> makes n + 1 calls → O(n). The classic <code>nonTail(n)</code> makes 2ⁿ⁺¹ − 1 calls (calls(n) = 1 + 2·calls(n−1)) and prints 2ⁿ − 1 numbers → O(2ⁿ): 7 numbers for 3, 15 for 4.</p>
<div class="pitfall">"The last <em>line</em> of the method is a recursive call" is not enough. In <code>return n * fact(n-1);</code> the call is on the last line, but the multiplication runs after it returns — so it is not tail recursion. Tail means nothing at all happens after the call.</div>`,
        `<p class="y-chinh">🎯 Đệ quy đuôi (tail recursion): phương thức chỉ có một lời gọi đệ quy, nằm ở đúng cuối phần cài đặt — khi lời gọi đó trả về thì không còn việc gì phải làm.</p>
<ul>
<li><code>tail(n)</code> in n rồi gọi <code>tail(n-1)</code> như việc cuối cùng; <code>main</code> của slide gọi <code>tail(10)</code> và in từ 10 lùi về 1. (Lớp <code>Main</code> của slide được đổi tên thành <code>TailDemo</code> cho khớp tên file.)</li>
<li>Vì sau lời gọi không còn việc gì chờ, có thể thay lời gọi bằng "cập nhật tham số rồi quay lại đầu hàm" — tức một vòng lặp (<code>tailAsLoop</code>, cùng output). Goodrich §5.6 gọi việc này là khử đệ quy đuôi (eliminating tail recursion).</li>
<li><strong>Hàm nonTail đúng như chữ trên slide</strong> gọi <code>tail(i-1)</code> hai lần chứ không gọi chính nó — nên nó hoàn toàn không đệ quy, chỉ là một hàm gọi hàm đệ quy đuôi hai lần: <code>nonTail(3)</code> in tail(2), rồi 3, rồi tail(2).</li>
<li><strong>Phiên bản thường gặp của ví dụ này</strong> (chẳng hạn trong sách của Drozdek) gọi <code>nonTail(i-1)</code> ở cả hai chỗ — chữ <code>tail(i-1)</code> trên slide nhiều khả năng là lỗi gõ. Lời gọi thứ nhất còn việc phía sau, nên hàm đó là đệ quy không đuôi (non-tail recursion); <code>nonTail(3)</code> in ra 1213121.</li>
</ul>
<pre><code class="language-java">public class TailDemo {                               // lớp Main của slide, đổi tên cho khớp tên file
    static void tail(int n) {                        // tail() của slide: một lời gọi, là việc cuối cùng
        if (n &gt; 0) {
            System.out.print(n + "  ");
            tail(n - 1);
        }
    }

    static void tailAsLoop(int n) {                  // cùng phương thức, lời gọi thay bằng vòng lặp
        while (n &gt; 0) {
            System.out.print(n + "  ");
            n = n - 1;
        }
    }

    static void nonTailAsOnSlide(int i) {            // chữ trên slide: gọi tail(), không gọi chính nó
        if (i &gt; 0) {
            tail(i - 1);
            System.out.print(i + "");
            tail(i - 1);
        }
    }

    static void nonTail(int i) {                     // bản kinh điển: gọi nonTail(i-1)
        if (i &gt; 0) {
            nonTail(i - 1);                          // KHÔNG phải việc cuối: sau nó còn việc
            System.out.print(i + "");
            nonTail(i - 1);
        }
    }

    public static void main(String[] args) {
        System.out.print("tail(10):               "); tail(10); System.out.println();
        System.out.print("tailAsLoop(10):         "); tailAsLoop(10); System.out.println();
        System.out.print("nonTail(3) as on slide: "); nonTailAsOnSlide(3); System.out.println();
        System.out.print("nonTail(3) classic:     "); nonTail(3); System.out.println();
        System.out.print("nonTail(4) classic:     "); nonTail(4); System.out.println();
    }
}</code></pre>
<div class="out">tail(10): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;9 &nbsp;8 &nbsp;7 &nbsp;6 &nbsp;5 &nbsp;4 &nbsp;3 &nbsp;2 &nbsp;1<br>
tailAsLoop(10): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 &nbsp;9 &nbsp;8 &nbsp;7 &nbsp;6 &nbsp;5 &nbsp;4 &nbsp;3 &nbsp;2 &nbsp;1<br>
nonTail(3) as on slide: 2 &nbsp;1 &nbsp;32 &nbsp;1<br>
nonTail(3) classic: &nbsp;&nbsp;&nbsp;&nbsp;1213121<br>
nonTail(4) classic: &nbsp;&nbsp;&nbsp;&nbsp;121312141213121</div>
<p><strong>Big-O:</strong> <code>tail(n)</code> tạo n + 1 lời gọi → O(n). Bản <code>nonTail(n)</code> kinh điển tạo 2ⁿ⁺¹ − 1 lời gọi (calls(n) = 1 + 2·calls(n−1)) và in 2ⁿ − 1 số → O(2ⁿ): 7 số với 3, 15 số với 4.</p>
<div class="pitfall">"Dòng <em>cuối</em> của phương thức là lời gọi đệ quy" thì chưa đủ. Trong <code>return n * fact(n-1);</code> lời gọi nằm ở dòng cuối, nhưng phép nhân chạy sau khi nó trả về — nên đó không phải đệ quy đuôi. Đuôi nghĩa là sau lời gọi hoàn toàn không còn việc gì.</div>`],
      [13, 'Non-tail recursion',
        `<p class="y-chinh">🎯 Non-tail recursion: the recursive call is not the last action — work remains after it — and <code>reverse()</code> uses exactly that to print a line backwards.</p>
<ul>
<li>Each activation reads <strong>one</strong> character into its own local <code>ch</code>, calls <code>reverse()</code> for the rest of the line, and only then prints its <code>ch</code>.</li>
<li>The activation that reads <code>'\\n'</code> stops (base case); on the way back the characters are printed from the last one read to the first.</li>
<li>The run-time stack does the reversing: the characters wait inside the ARs — last in, first out.</li>
<li>The slide's program reads the keyboard; here the input comes from a file holding "hello" and a newline. Only the class <code>Main</code> is renamed <code>Reverse</code>.</li>
</ul>
<pre><code class="language-java">public class Reverse {                                // the slide's class Main, renamed to match the file
    public static void reverse() throws Exception {
        char ch = (char) System.in.read();            // one character per activation
        if (ch != '\\n') {
            reverse();                                // read the rest first...
            System.out.print(ch);                     // ...then print MY character: work after the call
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("\\nEnter a string to be reversed:");
        reverse();
        System.out.println("\\n");
    }
}</code></pre>
<div class="out"><br>
Enter a string to be reversed:<br>
olleh</div>
<table>
<thead><tr><th>Activation</th><th>Reads <code>ch</code></th><th>Then</th><th>Prints on the way back</th></tr></thead>
<tbody>
<tr><td>1</td><td>h</td><td>calls reverse()</td><td>5th: h</td></tr>
<tr><td>2</td><td>e</td><td>calls reverse()</td><td>4th: e</td></tr>
<tr><td>3</td><td>l</td><td>calls reverse()</td><td>3rd: l</td></tr>
<tr><td>4</td><td>l</td><td>calls reverse()</td><td>2nd: l</td></tr>
<tr><td>5</td><td>o</td><td>calls reverse()</td><td>1st: o</td></tr>
<tr><td>6</td><td><code>'\\n'</code></td><td>stops (base case)</td><td>nothing</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> a line of n characters makes n + 1 activations: O(n) time and O(n) stack space — the stack holds the whole line. (The empty first line of the output comes from the <code>"\\n"</code> at the start of the prompt.)</p>
<div class="pitfall">If the input ends without a newline, <code>System.in.read()</code> returns −1 at the end of input; <code>(char) -1</code> is <code>'\\uffff'</code>, never <code>'\\n'</code>, so <code>reverse()</code> recurses until <code>StackOverflowError</code>. Robust code tests the int value for −1 before casting it to <code>char</code>.</div>`,
        `<p class="y-chinh">🎯 Đệ quy không đuôi (non-tail recursion): lời gọi đệ quy không phải việc cuối cùng — sau nó vẫn còn việc — và <code>reverse()</code> tận dụng đúng điều đó để in một dòng chữ theo thứ tự ngược.</p>
<ul>
<li>Mỗi lần kích hoạt đọc <strong>một</strong> ký tự vào biến cục bộ <code>ch</code> của riêng nó, gọi <code>reverse()</code> để xử lý phần còn lại của dòng, rồi mới in <code>ch</code> của mình.</li>
<li>Lần kích hoạt đọc được <code>'\\n'</code> thì dừng (trường hợp cơ sở — base case); trên đường quay về, các ký tự được in từ ký tự đọc sau cùng tới ký tự đọc đầu tiên.</li>
<li>Chính ngăn xếp lúc chạy (run-time stack) làm việc đảo ngược: các ký tự nằm chờ trong các bản ghi kích hoạt (activation record — AR) — vào sau, ra trước (LIFO).</li>
<li>Chương trình của slide đọc từ bàn phím; ở đây đầu vào lấy từ một file chứa "hello" và một dấu xuống dòng. Chỉ đổi tên lớp <code>Main</code> thành <code>Reverse</code>.</li>
</ul>
<pre><code class="language-java">public class Reverse {                                // lớp Main của slide, đổi tên cho khớp tên file
    public static void reverse() throws Exception {
        char ch = (char) System.in.read();            // mỗi lần kích hoạt đọc một ký tự
        if (ch != '\\n') {
            reverse();                                // đọc phần còn lại trước...
            System.out.print(ch);                     // ...rồi mới in ký tự CỦA MÌNH: còn việc sau lời gọi
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("\\nEnter a string to be reversed:");
        reverse();
        System.out.println("\\n");
    }
}</code></pre>
<div class="out"><br>
Enter a string to be reversed:<br>
olleh</div>
<table>
<thead><tr><th>Lần kích hoạt</th><th>Đọc <code>ch</code></th><th>Sau đó</th><th>In ra trên đường quay về</th></tr></thead>
<tbody>
<tr><td>1</td><td>h</td><td>gọi reverse()</td><td>thứ 5: h</td></tr>
<tr><td>2</td><td>e</td><td>gọi reverse()</td><td>thứ 4: e</td></tr>
<tr><td>3</td><td>l</td><td>gọi reverse()</td><td>thứ 3: l</td></tr>
<tr><td>4</td><td>l</td><td>gọi reverse()</td><td>thứ 2: l</td></tr>
<tr><td>5</td><td>o</td><td>gọi reverse()</td><td>thứ 1: o</td></tr>
<tr><td>6</td><td><code>'\\n'</code></td><td>dừng (trường hợp cơ sở)</td><td>không in gì</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> một dòng n ký tự tạo n + 1 lần kích hoạt: O(n) thời gian và O(n) bộ nhớ stack — stack giữ cả dòng. (Dòng trống đầu tiên của output là do <code>"\\n"</code> ở đầu câu nhắc.)</p>
<div class="pitfall">Nếu đầu vào kết thúc mà không có dấu xuống dòng, <code>System.in.read()</code> trả về −1 khi hết dữ liệu; <code>(char) -1</code> là <code>'\\uffff'</code>, không bao giờ bằng <code>'\\n'</code>, nên <code>reverse()</code> gọi mãi tới khi <code>StackOverflowError</code>. Code chắc chắn phải kiểm giá trị int có bằng −1 không trước khi ép sang <code>char</code>.</div>`],
      [14, 'Convert recursion implementation to iterative implementation using stack',
        `<p class="y-chinh">🎯 A recursion can be replaced by a loop plus an explicit stack: <code>nonRecursiveReverse()</code> pushes every character onto a <code>MyStack</code>, then pops them all — the same LIFO order the run-time stack gave <code>reverse()</code>.</p>
<ul>
<li>Loop 1 reads until <code>'\\n'</code> and pushes each character — this replaces "call reverse() for the rest".</li>
<li>Loop 2 pops and prints until the stack is empty — this replaces "print on the way back".</li>
<li><code>MyStack</code> is the ArrayList-based stack of 2A-Stacks, slide 12; <code>push(ch)</code> stores the <code>char</code> as a <code>Character</code> object (autoboxing).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class MyStack {                                       // the MyStack of 2A-Stacks, slide 12 (ArrayList version)
    ArrayList&lt;Object&gt; h;
    MyStack() { h = new ArrayList&lt;Object&gt;(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.remove(h.size() - 1));
    }
}

public class NonRecursiveReverse {
    public static void nonRecursiveReverse() throws Exception {   // the slide's code
        MyStack t = new MyStack();
        char ch;
        while (true) {
            ch = (char) System.in.read();
            if (ch == '\\n') break;
            t.push(ch);                               // our stack replaces the run-time stack
        }
        while (!t.isEmpty())
            System.out.print(t.pop());
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Enter a string to be reversed:");
        nonRecursiveReverse();
        System.out.println();
    }
}</code></pre>
<div class="out">Enter a string to be reversed:<br>
olleh</div>
<table>
<thead><tr><th>Recursive reverse() — slide 13</th><th>Iterative nonRecursiveReverse() — slide 14</th></tr></thead>
<tbody>
<tr><td>the run-time stack stores the characters, one AR each</td><td>our <code>MyStack</code> stores them, one element each</td></tr>
<tr><td>limited by the thread's stack size: <code>StackOverflowError</code> on a very long line</td><td>the stack's data lives on the heap: limited only by memory</td></tr>
<tr><td>O(n) time, O(n) space</td><td>O(n) time, O(n) space</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> tail recursion → a plain loop (slide 12); non-tail recursion → a loop + your own stack (this slide). The second recipe is how iterative tree traversals are written in Chapter 4.</p>
<div class="pitfall"><code>pop()</code> returns <code>Object</code>. Printing it works because <code>print(Object)</code> calls <code>toString()</code>, but <code>char c = t.pop();</code> does not compile — write <code>char c = (Character) t.pop();</code>.</div>`,
        `<p class="y-chinh">🎯 Một phép đệ quy có thể thay bằng vòng lặp cộng một ngăn xếp tường minh (explicit stack): <code>nonRecursiveReverse()</code> đẩy (push) từng ký tự vào một <code>MyStack</code>, rồi lấy (pop) ra hết — đúng thứ tự vào sau ra trước (LIFO) mà ngăn xếp lúc chạy (run-time stack) đã cho <code>reverse()</code>.</p>
<ul>
<li>Vòng lặp 1 đọc tới <code>'\\n'</code> và push từng ký tự — thay cho "gọi reverse() cho phần còn lại".</li>
<li>Vòng lặp 2 pop và in cho tới khi stack rỗng — thay cho "in trên đường quay về".</li>
<li><code>MyStack</code> chính là stack dựng trên ArrayList ở slide 12 của bộ 2A-Stacks; <code>push(ch)</code> cất <code>char</code> dưới dạng đối tượng <code>Character</code> (tự đóng hộp — autoboxing).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class MyStack {                                       // MyStack của 2A-Stacks, slide 12 (bản ArrayList)
    ArrayList&lt;Object&gt; h;
    MyStack() { h = new ArrayList&lt;Object&gt;(); }
    boolean isEmpty() { return (h.isEmpty()); }
    void push(Object x) { h.add(x); }
    Object pop() {
        if (isEmpty()) return (null);
        return (h.remove(h.size() - 1));
    }
}

public class NonRecursiveReverse {
    public static void nonRecursiveReverse() throws Exception {   // code của slide
        MyStack t = new MyStack();
        char ch;
        while (true) {
            ch = (char) System.in.read();
            if (ch == '\\n') break;
            t.push(ch);                               // stack của ta thay cho run-time stack
        }
        while (!t.isEmpty())
            System.out.print(t.pop());
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Enter a string to be reversed:");
        nonRecursiveReverse();
        System.out.println();
    }
}</code></pre>
<div class="out">Enter a string to be reversed:<br>
olleh</div>
<table>
<thead><tr><th>reverse() đệ quy — slide 13</th><th>nonRecursiveReverse() dùng vòng lặp — slide 14</th></tr></thead>
<tbody>
<tr><td>ngăn xếp lúc chạy giữ các ký tự, mỗi ký tự một bản ghi kích hoạt (activation record — AR)</td><td><code>MyStack</code> của ta giữ chúng, mỗi ký tự một phần tử</td></tr>
<tr><td>bị giới hạn bởi kích thước stack của luồng (thread): <code>StackOverflowError</code> khi dòng quá dài</td><td>dữ liệu của stack nằm trên vùng nhớ heap (vùng nhớ động): chỉ giới hạn bởi bộ nhớ</td></tr>
<tr><td>O(n) thời gian, O(n) bộ nhớ</td><td>O(n) thời gian, O(n) bộ nhớ</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đệ quy đuôi (tail) → một vòng lặp thường (slide 12); đệ quy không đuôi (non-tail) → vòng lặp + stack của riêng mình (slide này). Công thức thứ hai là cách viết các phép duyệt cây không đệ quy ở Chương 4.</p>
<div class="pitfall"><code>pop()</code> trả về <code>Object</code>. In ra thì được vì <code>print(Object)</code> gọi <code>toString()</code>, nhưng <code>char c = t.pop();</code> không biên dịch được — phải viết <code>char c = (Character) t.pop();</code>.</div>`],
      [15, 'Indirect recursion',
        `<p class="y-chinh">🎯 Indirect recursion: f() does not call itself directly but through other methods — f() → g() → f(), or a longer chain f() → f1() → f2() → … → fn() → f(). If f() calls itself, the recursion is direct.</p>
<p>The slide names its example — sin(x) calculation — and draws its call tree. The standard formulas behind that tree compute sin(x) from values at x/3, with an anchor for tiny x:</p>
<pre><code class="language-plaintext">sin(x) = sin(x/3) * (3 - tan²(x/3)) / (1 + tan²(x/3))
tan(x) = sin(x) / cos(x)
cos(x) = 1 - 2 * sin²(x/2)
anchor:  sin(x) ≈ x - x³/6   when |x| is very small</code></pre>
<p class="nhan">One level of the call tree, built from these formulas — compare with the tree drawn on the slide</p>
<pre><code class="language-plaintext">sin(x)
├── sin(x/3)
├── tan(x/3)
│   ├── sin(x/3)
│   └── cos(x/3)
│       └── sin(x/6)
└── tan(x/3)
    ├── sin(x/3)
    └── cos(x/3)
        └── sin(x/6)</code></pre>
<ul>
<li><code>sin</code> calls <code>tan</code>, <code>tan</code> calls <code>sin</code> and <code>cos</code>, <code>cos</code> calls <code>sin</code>: no method calls itself directly, yet every chain comes back to <code>sin</code>.</li>
<li>The argument shrinks at every step (x/3, x/6, …), so every chain reaches the anchor. The program stops at |x| &lt; 0.01, where x − x³/6 is accurate to about 10⁻¹².</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class IndirectSin {
    static int nSin, nTan, nCos;                      // how many times each method runs

    static double sin(double x) {                     // sin calls tan, tan calls sin: INDIRECT recursion
        nSin++;
        if (Math.abs(x) &lt; 0.01) return x - x * x * x / 6;                  // anchor: sin x ~ x - x^3/6 for tiny x
        return sin(x / 3) * (3 - sqr(tan(x / 3))) / (1 + sqr(tan(x / 3))); // sin(x/3) once, tan(x/3) twice
    }

    static double tan(double x) {                     // tan -&gt; sin, cos
        nTan++;
        return sin(x) / cos(x);
    }

    static double cos(double x) {                     // cos -&gt; sin (cos x = 1 - 2 sin^2(x/2))
        nCos++;
        return 1 - 2 * sqr(sin(x / 2));
    }

    static double sqr(double v) { return v * v; }

    static double sin3(double x) {                    // the same identity written as 3s - 4s^3: one call per level
        nSin++;
        if (Math.abs(x) &lt; 0.01) return x - x * x * x / 6;
        double s = sin3(x / 3);
        return 3 * s - 4 * s * s * s;
    }

    public static void main(String[] args) {
        System.out.println("x     sin(x) here   Math.sin(x)   calls sin/tan/cos");
        for (double x : new double[] {0.5, 1.0, 2.0, 3.0}) {
            nSin = nTan = nCos = 0;
            double v = sin(x);
            System.out.printf(Locale.ROOT, "%.1f   %.6f      %.6f      %d/%d/%d%n", x, v, Math.sin(x), nSin, nTan, nCos);
        }
        nSin = 0;
        double w = sin3(3.0);
        System.out.printf(Locale.ROOT, "3s - 4s^3 version: sin(3.0) = %.6f after only %d calls%n", w, nSin);
    }
}</code></pre>
<div class="out">x &nbsp;&nbsp;&nbsp;&nbsp;sin(x) here &nbsp;&nbsp;Math.sin(x) &nbsp;&nbsp;calls sin/tan/cos<br>
0.5 &nbsp;&nbsp;0.479426 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.479426 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;291/116/116<br>
1.0 &nbsp;&nbsp;0.841471 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.841471 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;966/386/386<br>
2.0 &nbsp;&nbsp;0.909297 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.909297 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2226/890/890<br>
3.0 &nbsp;&nbsp;0.141120 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.141120 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3481/1392/1392<br>
3s - 4s^3 version: sin(3.0) = 0.141120 after only 7 calls</div>
<p><strong>Cost:</strong> the results match <code>Math.sin</code> to 6 decimals, but sin(3.0) takes 3481 + 1392 + 1392 = 6265 calls: every sin that has not reached the anchor starts three calls (sin once, tan twice), every tan two more, every cos one. The same identity written as sin(x) = 3s − 4s³ with s = sin(x/3) makes one call per level — 7 calls.</p>
<div class="pitfall">Indirect recursion is easy to miss when reading code in the FE: look for a cycle in "who calls whom" (sin → tan → sin), not for a method name repeated inside its own body. Every method in the cycle needs the chain to reach a base case.</div>`,
        `<p class="y-chinh">🎯 Đệ quy gián tiếp (indirect recursion): f() không tự gọi chính nó mà gọi qua các phương thức khác — f() → g() → f(), hoặc một chuỗi dài hơn f() → f1() → f2() → … → fn() → f(). Nếu f() tự gọi chính nó thì đó là đệ quy trực tiếp (direct).</p>
<p>Slide nêu tên ví dụ — tính sin(x) — và vẽ cây lời gọi của nó. Các công thức chuẩn đứng sau cây đó tính sin(x) từ các giá trị tại x/3, kèm một điểm neo (anchor) khi x rất nhỏ:</p>
<pre><code class="language-plaintext">sin(x) = sin(x/3) * (3 - tan²(x/3)) / (1 + tan²(x/3))
tan(x) = sin(x) / cos(x)
cos(x) = 1 - 2 * sin²(x/2)
điểm neo:  sin(x) ≈ x - x³/6   khi |x| rất nhỏ</code></pre>
<p class="nhan">Một tầng của cây lời gọi (call tree), dựng từ các công thức trên — hãy đối chiếu với cây vẽ trên slide</p>
<pre><code class="language-plaintext">sin(x)
├── sin(x/3)
├── tan(x/3)
│   ├── sin(x/3)
│   └── cos(x/3)
│       └── sin(x/6)
└── tan(x/3)
    ├── sin(x/3)
    └── cos(x/3)
        └── sin(x/6)</code></pre>
<ul>
<li><code>sin</code> gọi <code>tan</code>, <code>tan</code> gọi <code>sin</code> và <code>cos</code>, <code>cos</code> gọi <code>sin</code>: không phương thức nào tự gọi trực tiếp chính nó, vậy mà chuỗi nào cũng quay về <code>sin</code>.</li>
<li>Đối số nhỏ dần ở mỗi bước (x/3, x/6, …), nên chuỗi nào cũng chạm điểm neo. Chương trình dừng ở |x| &lt; 0,01, nơi x − x³/6 sai số chỉ cỡ 10⁻¹².</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class IndirectSin {
    static int nSin, nTan, nCos;                      // mỗi hàm chạy bao nhiêu lần

    static double sin(double x) {                     // sin gọi tan, tan gọi sin: đệ quy GIÁN TIẾP
        nSin++;
        if (Math.abs(x) &lt; 0.01) return x - x * x * x / 6;                  // điểm neo: sin x ~ x - x^3/6 khi x rất nhỏ
        return sin(x / 3) * (3 - sqr(tan(x / 3))) / (1 + sqr(tan(x / 3))); // sin(x/3) một lần, tan(x/3) hai lần
    }

    static double tan(double x) {                     // tan -&gt; sin, cos
        nTan++;
        return sin(x) / cos(x);
    }

    static double cos(double x) {                     // cos -&gt; sin (cos x = 1 - 2 sin^2(x/2))
        nCos++;
        return 1 - 2 * sqr(sin(x / 2));
    }

    static double sqr(double v) { return v * v; }

    static double sin3(double x) {                    // cùng hằng đẳng thức, viết thành 3s - 4s^3: mỗi tầng một lời gọi
        nSin++;
        if (Math.abs(x) &lt; 0.01) return x - x * x * x / 6;
        double s = sin3(x / 3);
        return 3 * s - 4 * s * s * s;
    }

    public static void main(String[] args) {
        System.out.println("x     sin(x) here   Math.sin(x)   calls sin/tan/cos");
        for (double x : new double[] {0.5, 1.0, 2.0, 3.0}) {
            nSin = nTan = nCos = 0;
            double v = sin(x);
            System.out.printf(Locale.ROOT, "%.1f   %.6f      %.6f      %d/%d/%d%n", x, v, Math.sin(x), nSin, nTan, nCos);
        }
        nSin = 0;
        double w = sin3(3.0);
        System.out.printf(Locale.ROOT, "3s - 4s^3 version: sin(3.0) = %.6f after only %d calls%n", w, nSin);
    }
}</code></pre>
<div class="out">x &nbsp;&nbsp;&nbsp;&nbsp;sin(x) here &nbsp;&nbsp;Math.sin(x) &nbsp;&nbsp;calls sin/tan/cos<br>
0.5 &nbsp;&nbsp;0.479426 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.479426 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;291/116/116<br>
1.0 &nbsp;&nbsp;0.841471 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.841471 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;966/386/386<br>
2.0 &nbsp;&nbsp;0.909297 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.909297 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2226/890/890<br>
3.0 &nbsp;&nbsp;0.141120 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.141120 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3481/1392/1392<br>
3s - 4s^3 version: sin(3.0) = 0.141120 after only 7 calls</div>
<p><strong>Chi phí:</strong> kết quả khớp <code>Math.sin</code> tới 6 chữ số thập phân, nhưng sin(3.0) tốn 3481 + 1392 + 1392 = 6265 lời gọi: mỗi sin chưa chạm điểm neo khởi động ba lời gọi (sin một lần, tan hai lần), mỗi tan thêm hai, mỗi cos thêm một. Cùng hằng đẳng thức đó viết thành sin(x) = 3s − 4s³ với s = sin(x/3) thì mỗi tầng chỉ một lời gọi — 7 lời gọi.</p>
<div class="pitfall">Khi đọc code trong FE rất dễ bỏ sót đệ quy gián tiếp: hãy tìm một vòng tròn trong quan hệ "ai gọi ai" (sin → tan → sin), đừng chỉ tìm tên phương thức lặp lại trong chính thân của nó. Mọi phương thức trong vòng đều cần chuỗi gọi chạm được trường hợp cơ sở (base case).</div>`],
      [16, 'Nested recursion',
        `<p class="y-chinh">🎯 Nested recursion: a function is not only defined in terms of itself, it is also used as one of its own parameters — h(2 + h(2n)), A(x − 1, A(x, y − 1)).</p>
<pre><code class="language-plaintext">h(n) = 0              if n = 0
h(n) = n              if n &gt; 4
h(n) = h(2 + h(2n))   if n &lt;= 4</code></pre>
<ul>
<li>The outer call cannot start before the inner one has finished, because the inner result <em>is</em> the outer argument.</li>
<li>The trace of h(1) below takes 7 calls and gives 14; the values h(0..6) are 0, 14, 12, 8, 10, 5, 6.</li>
<li><strong>Ackermann's function</strong> — A(0, y) = y + 1; A(x, 0) = A(x − 1, 1); A(x, y) = A(x − 1, A(x, y − 1)) — is the slide's second example, interesting because of its remarkably rapid growth. Row x = 3 is A(3, y) = 2^(y+3) − 3, so A(3, 1) = 2⁴ − 3 = 13, as the slide says. The slide's next line, A(4, 1) = 2⁶⁵⁵³⁶ − 3, skips a step: by the definition A(4, 0) = A(3, 1) = 13 and A(4, 1) = A(3, A(4, 0)) = A(3, 13) = 2¹⁶ − 3 = 65 533, while 2⁶⁵⁵³⁶ − 3 — a number with 19 729 digits — is A(4, 2) = A(3, 65 533). (In a plain-text copy of the slide the two values appear as "24 - 3" and "265536 - 3": the exponents lost their formatting.)</li>
</ul>
<pre><code class="language-java">public class NestedRecursion {
    static int hCalls, aCalls;

    static int h(int n) {                             // h(n) = 0 if n = 0; n if n &gt; 4; h(2 + h(2n)) if n &lt;= 4
        hCalls++;
        if (n == 0) return 0;
        if (n &gt; 4) return n;
        return h(2 + h(2 * n));                       // the ARGUMENT is itself a recursive call
    }

    static int traceH(int n, String pad) {            // h again, printing the inner call before the outer one
        if (n == 0 || n &gt; 4) {
            System.out.println(pad + "h(" + n + ") = " + n);
            return n;
        }
        System.out.println(pad + "h(" + n + ") needs h(" + (2 * n) + ") first");
        int inner = traceH(2 * n, pad + "  ");
        int r = h(2 + inner);
        System.out.println(pad + "h(" + n + ") = h(2 + " + inner + ") = h(" + (2 + inner) + ") = " + r);
        return r;
    }

    static int A(int x, int y) {                      // Ackermann's function
        aCalls++;
        if (x == 0) return y + 1;
        if (y == 0) return A(x - 1, 1);
        return A(x - 1, A(x, y - 1));                 // nested: A inside the argument of A
    }

    public static void main(String[] args) {
        traceH(1, "");
        hCalls = 0;
        h(1);
        System.out.print("h(1) made " + hCalls + " calls.   h(0..6) =");
        for (int n = 0; n &lt;= 6; n++) System.out.print(" " + h(n));
        System.out.println();
        System.out.println("A(x,y)  y=0  y=1  y=2  y=3");
        for (int x = 0; x &lt;= 3; x++) {
            System.out.print("x=" + x + "   ");
            for (int y = 0; y &lt;= 3; y++) System.out.printf("%5d", A(x, y));
            System.out.println();
        }
        aCalls = 0;
        int a31 = A(3, 1);
        int c31 = aCalls;
        aCalls = 0;
        int a33 = A(3, 3);
        System.out.println("A(3,1) = " + a31 + " = 2^4 - 3 after " + c31 + " calls; A(3,3) = " + a33 + " after " + aCalls + " calls");
    }
}</code></pre>
<div class="out">h(1) needs h(2) first<br>
&nbsp;&nbsp;h(2) needs h(4) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;h(4) needs h(8) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;h(8) = 8<br>
&nbsp;&nbsp;&nbsp;&nbsp;h(4) = h(2 + 8) = h(10) = 10<br>
&nbsp;&nbsp;h(2) = h(2 + 10) = h(12) = 12<br>
h(1) = h(2 + 12) = h(14) = 14<br>
h(1) made 7 calls. &nbsp;&nbsp;h(0..6) = 0 14 12 8 10 5 6<br>
A(x,y) &nbsp;y=0 &nbsp;y=1 &nbsp;y=2 &nbsp;y=3<br>
x=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;4<br>
x=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;5<br>
x=2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;9<br>
x=3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;13 &nbsp;&nbsp;29 &nbsp;&nbsp;61<br>
A(3,1) = 13 = 2^4 - 3 after 106 calls; A(3,3) = 61 after 2432 calls</div>
<table>
<thead><tr><th>Call</th><th>Inner call first</th><th>Then the outer call</th><th>Result</th></tr></thead>
<tbody>
<tr><td>h(4)</td><td>h(8) = 8</td><td>h(2 + 8) = h(10)</td><td>10</td></tr>
<tr><td>h(2)</td><td>h(4) = 10</td><td>h(2 + 10) = h(12)</td><td>12</td></tr>
<tr><td>h(1)</td><td>h(2) = 12</td><td>h(2 + 12) = h(14)</td><td>14</td></tr>
<tr><td>h(3)</td><td>h(6) = 6</td><td>h(2 + 6) = h(8)</td><td>8</td></tr>
</tbody>
</table>
<p><strong>Cost:</strong> A(3, 3) = 61 already takes 2432 calls. A(4, 1) = 65 533 takes 2 862 984 010 calls and a recursion 65 536 calls deep — with the default stack size this method usually dies with <code>StackOverflowError</code> long before the end; A(4, 2) cannot be computed this way on any computer.</p>
<div class="pitfall">Two traps. (1) If a question asks for A(4, 1), compute it from the definition: 65 533 = 2¹⁶ − 3, not the slide's 2⁶⁵⁵³⁶ − 3 (that is A(4, 2)). (2) h is only defined for n ≥ 0: for a negative n, 2n moves away from both base cases (0 and "&gt; 4") — on paper an infinite regress. In Java it does not even crash: after about 30 doublings the <code>int</code> 2n overflows (to 0 or a large positive number), so <code>h(-1)</code> quietly returns a meaningless 74. With nested recursion, check that the <em>computed</em> argument still moves toward a base case.</div>`,
        `<p class="y-chinh">🎯 Đệ quy lồng (nested recursion): hàm không chỉ được định nghĩa qua chính nó, mà còn được dùng làm một tham số của chính nó — h(2 + h(2n)), A(x − 1, A(x, y − 1)).</p>
<pre><code class="language-plaintext">h(n) = 0              nếu n = 0
h(n) = n              nếu n &gt; 4
h(n) = h(2 + h(2n))   nếu n &lt;= 4</code></pre>
<ul>
<li>Lời gọi bên ngoài không thể bắt đầu trước khi lời gọi bên trong xong, vì kết quả bên trong <em>chính là</em> đối số bên ngoài.</li>
<li>Vết chạy của h(1) dưới đây tốn 7 lời gọi và cho 14; các giá trị h(0..6) là 0, 14, 12, 8, 10, 5, 6.</li>
<li><strong>Hàm Ackermann (Ackermann's function)</strong> — A(0, y) = y + 1; A(x, 0) = A(x − 1, 1); A(x, y) = A(x − 1, A(x, y − 1)) — là ví dụ thứ hai của slide, đáng chú ý vì tăng nhanh khủng khiếp. Hàng x = 3 là A(3, y) = 2^(y+3) − 3, nên A(3, 1) = 2⁴ − 3 = 13, đúng như slide. Dòng tiếp theo của slide, A(4, 1) = 2⁶⁵⁵³⁶ − 3, thì nhảy cóc một bước: theo định nghĩa, A(4, 0) = A(3, 1) = 13 và A(4, 1) = A(3, A(4, 0)) = A(3, 13) = 2¹⁶ − 3 = 65 533, còn 2⁶⁵⁵³⁶ − 3 — một số có 19 729 chữ số — là A(4, 2) = A(3, 65 533). (Trong bản chữ trơn của slide, hai giá trị này hiện thành "24 - 3" và "265536 - 3": số mũ bị mất định dạng.)</li>
</ul>
<pre><code class="language-java">public class NestedRecursion {
    static int hCalls, aCalls;

    static int h(int n) {                             // h(n) = 0 if n = 0; n if n &gt; 4; h(2 + h(2n)) if n &lt;= 4
        hCalls++;
        if (n == 0) return 0;
        if (n &gt; 4) return n;
        return h(2 + h(2 * n));                       // THAM SỐ chính là một lời gọi đệ quy
    }

    static int traceH(int n, String pad) {            // lại là h, in lời gọi trong trước lời gọi ngoài
        if (n == 0 || n &gt; 4) {
            System.out.println(pad + "h(" + n + ") = " + n);
            return n;
        }
        System.out.println(pad + "h(" + n + ") needs h(" + (2 * n) + ") first");
        int inner = traceH(2 * n, pad + "  ");
        int r = h(2 + inner);
        System.out.println(pad + "h(" + n + ") = h(2 + " + inner + ") = h(" + (2 + inner) + ") = " + r);
        return r;
    }

    static int A(int x, int y) {                      // hàm Ackermann
        aCalls++;
        if (x == 0) return y + 1;
        if (y == 0) return A(x - 1, 1);
        return A(x - 1, A(x, y - 1));                 // lồng: A nằm trong tham số của A
    }

    public static void main(String[] args) {
        traceH(1, "");
        hCalls = 0;
        h(1);
        System.out.print("h(1) made " + hCalls + " calls.   h(0..6) =");
        for (int n = 0; n &lt;= 6; n++) System.out.print(" " + h(n));
        System.out.println();
        System.out.println("A(x,y)  y=0  y=1  y=2  y=3");
        for (int x = 0; x &lt;= 3; x++) {
            System.out.print("x=" + x + "   ");
            for (int y = 0; y &lt;= 3; y++) System.out.printf("%5d", A(x, y));
            System.out.println();
        }
        aCalls = 0;
        int a31 = A(3, 1);
        int c31 = aCalls;
        aCalls = 0;
        int a33 = A(3, 3);
        System.out.println("A(3,1) = " + a31 + " = 2^4 - 3 after " + c31 + " calls; A(3,3) = " + a33 + " after " + aCalls + " calls");
    }
}</code></pre>
<div class="out">h(1) needs h(2) first<br>
&nbsp;&nbsp;h(2) needs h(4) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;h(4) needs h(8) first<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;h(8) = 8<br>
&nbsp;&nbsp;&nbsp;&nbsp;h(4) = h(2 + 8) = h(10) = 10<br>
&nbsp;&nbsp;h(2) = h(2 + 10) = h(12) = 12<br>
h(1) = h(2 + 12) = h(14) = 14<br>
h(1) made 7 calls. &nbsp;&nbsp;h(0..6) = 0 14 12 8 10 5 6<br>
A(x,y) &nbsp;y=0 &nbsp;y=1 &nbsp;y=2 &nbsp;y=3<br>
x=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;4<br>
x=1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;5<br>
x=2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;9<br>
x=3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;13 &nbsp;&nbsp;29 &nbsp;&nbsp;61<br>
A(3,1) = 13 = 2^4 - 3 after 106 calls; A(3,3) = 61 after 2432 calls</div>
<table>
<thead><tr><th>Lời gọi</th><th>Lời gọi bên trong trước</th><th>Rồi lời gọi bên ngoài</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>h(4)</td><td>h(8) = 8</td><td>h(2 + 8) = h(10)</td><td>10</td></tr>
<tr><td>h(2)</td><td>h(4) = 10</td><td>h(2 + 10) = h(12)</td><td>12</td></tr>
<tr><td>h(1)</td><td>h(2) = 12</td><td>h(2 + 12) = h(14)</td><td>14</td></tr>
<tr><td>h(3)</td><td>h(6) = 6</td><td>h(2 + 6) = h(8)</td><td>8</td></tr>
</tbody>
</table>
<p><strong>Chi phí:</strong> A(3, 3) = 61 đã tốn 2432 lời gọi. A(4, 1) = 65 533 tốn 2 862 984 010 lời gọi với độ sâu đệ quy 65 536 lời gọi — với kích thước ngăn xếp (stack) mặc định, phương thức này thường chết vì <code>StackOverflowError</code> từ rất lâu trước khi xong; còn A(4, 2) thì không máy tính nào tính nổi theo cách này.</p>
<div class="pitfall">Hai bẫy. (1) Nếu đề hỏi A(4, 1), hãy tính từ định nghĩa: 65 533 = 2¹⁶ − 3, không phải 2⁶⁵⁵³⁶ − 3 như slide (đó là A(4, 2)). (2) h chỉ xác định với n ≥ 0: với n âm, 2n càng lúc càng xa cả hai trường hợp cơ sở (base case: 0 và "&gt; 4") — trên giấy là lùi vô hạn (infinite regress). Trong Java nó thậm chí không sập: sau khoảng 30 lần nhân đôi, giá trị <code>int</code> 2n bị tràn số (overflow) thành 0 hoặc một số dương lớn, nên <code>h(-1)</code> lặng lẽ trả về 74 — một con số vô nghĩa. Với đệ quy lồng, phải kiểm tra rằng đối số <em>được tính ra</em> vẫn tiến về một trường hợp cơ sở.</div>`],
      [17, 'Excessive recursion - 1',
        `<p class="y-chinh">🎯 The recursive fibo() "looks very natural but is extremely inefficient": it computes the same values again and again, so its number of calls grows exponentially.</p>
<ul>
<li>The code below is the slide's, plus one counter. The number of calls is exactly 2·fibo(n+1) − 1: 177 for n = 10, 21 891 for n = 20, 2 692 537 for n = 30.</li>
<li>Why: calls(n) = 1 + calls(n−1) + calls(n−2) — the call count follows almost the same recurrence as the Fibonacci numbers themselves, so it grows like fibo(n), by a factor of about 1.618 per step.</li>
<li>The loop keeps only the last two values and does n − 1 additions: fibo(50) needs 49 additions instead of more than 40 billion calls.</li>
</ul>
<pre><code class="language-java">public class FiboCalls {
    static long calls;

    static long fibo(long n) {                        // the slide's code + one counter
        calls++;
        if (n &lt; 2)
            return n;
        else
            return (fibo(n - 1) + fibo(n - 2));
    }

    static long fiboLoop(int n) {                     // iterative: n - 1 additions
        long a = 0, b = 1;                            // fibo(0), fibo(1)
        for (int i = 2; i &lt;= n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        return n == 0 ? 0 : b;
    }

    public static void main(String[] args) {
        System.out.println("n    fibo(n)   recursive calls   2*fibo(n+1)-1   loop: fibo(n), additions");
        for (int n : new int[] {5, 10, 20, 30}) {
            calls = 0;
            long f = fibo(n);
            System.out.printf("%-4d %-9d %-17d %-15d %d, %d%n", n, f, calls, 2 * fiboLoop(n + 1) - 1, fiboLoop(n), n - 1);
        }
        for (int n : new int[] {40, 50})
            System.out.println("n = " + n + ": the recursion would need " + (2 * fiboLoop(n + 1) - 1) + " calls; the loop needs " + (n - 1) + " additions");
    }
}</code></pre>
<div class="out">n &nbsp;&nbsp;&nbsp;fibo(n) &nbsp;&nbsp;recursive calls &nbsp;&nbsp;2*fibo(n+1)-1 &nbsp;&nbsp;loop: fibo(n), additions<br>
5 &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5, 4<br>
10 &nbsp;&nbsp;55 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;177 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;177 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;55, 9<br>
20 &nbsp;&nbsp;6765 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21891 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21891 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6765, 19<br>
30 &nbsp;&nbsp;832040 &nbsp;&nbsp;&nbsp;2692537 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2692537 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;832040, 29<br>
n = 40: the recursion would need 331160281 calls; the loop needs 39 additions<br>
n = 50: the recursion would need 40730022147 calls; the loop needs 49 additions</div>
<p><strong>Big-O:</strong> recursive fibo is exponential — O(φⁿ) with φ ≈ 1.618, usually quoted as the upper bound O(2ⁿ); the loop is O(n) time and O(1) memory. The recursion depth is only n, so the time, not the stack, is what explodes.</p>
<div class="pitfall">"Recursive fibo is slow because of the stack overhead" — only a small part of the story. The real cost is <em>repeated work</em>: the same subproblems are solved over and over. Removing the repetition (a loop, or the memo of slide 18) is what makes it fast.</div>
<p class="meo">🧠 <strong>Remember:</strong> excessive recursion = the call tree contains the same subproblem many times.</p>`,
        `<p class="y-chinh">🎯 Hàm fibo() đệ quy "trông rất tự nhiên nhưng cực kỳ kém hiệu quả": nó tính đi tính lại cùng những giá trị, nên số lời gọi tăng theo hàm mũ (exponential).</p>
<ul>
<li>Code dưới đây là code của slide, thêm một bộ đếm. Số lời gọi đúng bằng 2·fibo(n+1) − 1: 177 với n = 10, 21 891 với n = 20, 2 692 537 với n = 30.</li>
<li>Vì sao: calls(n) = 1 + calls(n−1) + calls(n−2) — số lời gọi tuân theo gần như cùng hệ thức truy hồi (recurrence) với chính dãy Fibonacci, nên nó tăng như fibo(n), mỗi bước gấp khoảng 1,618 lần.</li>
<li>Vòng lặp chỉ giữ hai giá trị gần nhất và làm n − 1 phép cộng: fibo(50) cần 49 phép cộng thay vì hơn 40 tỷ lời gọi.</li>
</ul>
<pre><code class="language-java">public class FiboCalls {
    static long calls;

    static long fibo(long n) {                        // code của slide + một bộ đếm
        calls++;
        if (n &lt; 2)
            return n;
        else
            return (fibo(n - 1) + fibo(n - 2));
    }

    static long fiboLoop(int n) {                     // bản lặp: n - 1 phép cộng
        long a = 0, b = 1;                            // fibo(0), fibo(1)
        for (int i = 2; i &lt;= n; i++) {
            long c = a + b;
            a = b;
            b = c;
        }
        return n == 0 ? 0 : b;
    }

    public static void main(String[] args) {
        System.out.println("n    fibo(n)   recursive calls   2*fibo(n+1)-1   loop: fibo(n), additions");
        for (int n : new int[] {5, 10, 20, 30}) {
            calls = 0;
            long f = fibo(n);
            System.out.printf("%-4d %-9d %-17d %-15d %d, %d%n", n, f, calls, 2 * fiboLoop(n + 1) - 1, fiboLoop(n), n - 1);
        }
        for (int n : new int[] {40, 50})
            System.out.println("n = " + n + ": the recursion would need " + (2 * fiboLoop(n + 1) - 1) + " calls; the loop needs " + (n - 1) + " additions");
    }
}</code></pre>
<div class="out">n &nbsp;&nbsp;&nbsp;fibo(n) &nbsp;&nbsp;recursive calls &nbsp;&nbsp;2*fibo(n+1)-1 &nbsp;&nbsp;loop: fibo(n), additions<br>
5 &nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5, 4<br>
10 &nbsp;&nbsp;55 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;177 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;177 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;55, 9<br>
20 &nbsp;&nbsp;6765 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21891 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;21891 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6765, 19<br>
30 &nbsp;&nbsp;832040 &nbsp;&nbsp;&nbsp;2692537 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2692537 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;832040, 29<br>
n = 40: the recursion would need 331160281 calls; the loop needs 39 additions<br>
n = 50: the recursion would need 40730022147 calls; the loop needs 49 additions</div>
<p><strong>Big-O:</strong> fibo đệ quy là hàm mũ — O(φⁿ) với φ ≈ 1,618, thường được ghi bằng cận trên O(2ⁿ); vòng lặp là O(n) thời gian và O(1) bộ nhớ. Độ sâu đệ quy chỉ là n, nên thứ bùng nổ là thời gian chứ không phải ngăn xếp (stack).</p>
<div class="pitfall">"fibo đệ quy chậm vì tốn chi phí stack" — mới chỉ đúng một phần nhỏ. Chi phí thật là <em>công việc lặp lại</em>: cùng các bài toán con bị giải đi giải lại. Bỏ được sự lặp lại đó (vòng lặp, hoặc ghi nhớ — memo — ở slide 18) mới làm nó nhanh.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đệ quy thừa (excessive recursion) = cây lời gọi chứa cùng một bài toán con rất nhiều lần.</p>`],
      [18, 'Excessive recursion - 2: the tree of calls for fibo(4)',
        `<p class="y-chinh">🎯 The tree of calls for fibo(4) has 9 calls for an answer of 3: Fib(2) is computed twice, Fib(1) three times and Fib(0) twice.</p>
<p class="nhan">The tree drawn from the definition — compare with the slide's figure</p>
<pre><code class="language-plaintext">                Fib(4)
              /        \\
         Fib(3)          Fib(2)
         /    \\          /    \\
    Fib(2)   Fib(1)  Fib(1)  Fib(0)
    /    \\     1       1       0
Fib(1)  Fib(0)
  1       0</code></pre>
<pre><code class="language-java">public class FiboTree {
    static int calls;
    static int[] count = new int[5];                  // count[k] = how many times Fib(k) is called

    static long fibo(int n, String pad) {             // the slide's fibo, printing each call as a tree
        calls++;
        count[n]++;
        if (n &lt; 2) {
            System.out.println(pad + "Fib(" + n + ") = " + n);
            return n;
        }
        System.out.println(pad + "Fib(" + n + ")");
        return fibo(n - 1, pad + "  ") + fibo(n - 2, pad + "  ");
    }

    static long[] memo;                               // memo[k] = fibo(k) once known, 0 = not yet
    static int memoCalls;

    static long fiboMemo(int n) {                     // the fix: remember every result
        memoCalls++;
        if (n &lt; 2) return n;
        if (memo[n] != 0) return memo[n];             // known already: no new calls
        memo[n] = fiboMemo(n - 1) + fiboMemo(n - 2);
        return memo[n];
    }

    public static void main(String[] args) {
        long f = fibo(4, "");
        System.out.print("fibo(4) = " + f + " after " + calls + " calls:");
        for (int k = 4; k &gt;= 0; k--) System.out.print(" Fib(" + k + ") x" + count[k]);
        System.out.println();
        for (int n : new int[] {4, 30, 90}) {
            memo = new long[n + 1];
            memoCalls = 0;
            long v = fiboMemo(n);
            System.out.println("with memo: fibo(" + n + ") = " + v + " after " + memoCalls + " calls");
        }
    }
}</code></pre>
<div class="out">Fib(4)<br>
&nbsp;&nbsp;Fib(3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fib(1) = 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fib(0) = 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(1) = 1<br>
&nbsp;&nbsp;Fib(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(1) = 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(0) = 0<br>
fibo(4) = 3 after 9 calls: Fib(4) x1 Fib(3) x1 Fib(2) x2 Fib(1) x3 Fib(0) x2<br>
with memo: fibo(4) = 3 after 7 calls<br>
with memo: fibo(30) = 832040 after 59 calls<br>
with memo: fibo(90) = 2880067194370816120 after 179 calls</div>
<ul>
<li>Java evaluates <code>fibo(n-1) + fibo(n-2)</code> left to right, so the output visits the whole Fib(3) branch before Fib(2).</li>
<li>For k ≥ 1, Fib(k) is called fibo(n − k + 1) times: here Fib(1) is called fibo(4) = 3 times. The tree has 2·fibo(n+1) − 1 nodes but only n + 1 different subproblems.</li>
<li><strong>The fix — memoization</strong>: store every result in an array the first time it is computed and return it directly afterwards. Then fibo(n) makes 2n − 1 calls (n ≥ 1): 59 for n = 30 instead of 2 692 537 — O(n). "Solve each subproblem once" is the door to dynamic programming.</li>
</ul>
<div class="pitfall">Using 0 to mean "not computed yet" is safe here only because fibo(k) &gt; 0 for every k ≥ 1. If 0 can be a real answer, keep a separate <code>boolean[] known</code> or fill the array with −1 first. The program also starts each run with a fresh memo array, so that every call count starts from zero; when the answers depend on input data, stale entries would even give wrong answers.</div>`,
        `<p class="y-chinh">🎯 Cây lời gọi (tree of calls) của fibo(4) có 9 lời gọi cho một đáp án bằng 3: Fib(2) bị tính hai lần, Fib(1) ba lần và Fib(0) hai lần.</p>
<p class="nhan">Cây dựng từ định nghĩa — đối chiếu với hình trên slide</p>
<pre><code class="language-plaintext">                Fib(4)
              /        \\
         Fib(3)          Fib(2)
         /    \\          /    \\
    Fib(2)   Fib(1)  Fib(1)  Fib(0)
    /    \\     1       1       0
Fib(1)  Fib(0)
  1       0</code></pre>
<pre><code class="language-java">public class FiboTree {
    static int calls;
    static int[] count = new int[5];                  // count[k] = Fib(k) bị gọi bao nhiêu lần

    static long fibo(int n, String pad) {             // fibo của slide, in mỗi lời gọi thành cây
        calls++;
        count[n]++;
        if (n &lt; 2) {
            System.out.println(pad + "Fib(" + n + ") = " + n);
            return n;
        }
        System.out.println(pad + "Fib(" + n + ")");
        return fibo(n - 1, pad + "  ") + fibo(n - 2, pad + "  ");
    }

    static long[] memo;                               // memo[k] = fibo(k) khi đã biết, 0 = chưa tính
    static int memoCalls;

    static long fiboMemo(int n) {                     // cách chữa: nhớ mọi kết quả
        memoCalls++;
        if (n &lt; 2) return n;
        if (memo[n] != 0) return memo[n];             // đã biết: không gọi thêm
        memo[n] = fiboMemo(n - 1) + fiboMemo(n - 2);
        return memo[n];
    }

    public static void main(String[] args) {
        long f = fibo(4, "");
        System.out.print("fibo(4) = " + f + " after " + calls + " calls:");
        for (int k = 4; k &gt;= 0; k--) System.out.print(" Fib(" + k + ") x" + count[k]);
        System.out.println();
        for (int n : new int[] {4, 30, 90}) {
            memo = new long[n + 1];
            memoCalls = 0;
            long v = fiboMemo(n);
            System.out.println("with memo: fibo(" + n + ") = " + v + " after " + memoCalls + " calls");
        }
    }
}</code></pre>
<div class="out">Fib(4)<br>
&nbsp;&nbsp;Fib(3)<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fib(1) = 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fib(0) = 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(1) = 1<br>
&nbsp;&nbsp;Fib(2)<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(1) = 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;Fib(0) = 0<br>
fibo(4) = 3 after 9 calls: Fib(4) x1 Fib(3) x1 Fib(2) x2 Fib(1) x3 Fib(0) x2<br>
with memo: fibo(4) = 3 after 7 calls<br>
with memo: fibo(30) = 832040 after 59 calls<br>
with memo: fibo(90) = 2880067194370816120 after 179 calls</div>
<ul>
<li>Java tính <code>fibo(n-1) + fibo(n-2)</code> từ trái sang phải, nên output đi hết nhánh Fib(3) rồi mới tới Fib(2).</li>
<li>Với k ≥ 1, Fib(k) bị gọi fibo(n − k + 1) lần: ở đây Fib(1) bị gọi fibo(4) = 3 lần. Cây có 2·fibo(n+1) − 1 nút nhưng chỉ có n + 1 bài toán con khác nhau.</li>
<li><strong>Cách chữa — ghi nhớ (memoization)</strong>: cất mỗi kết quả vào một mảng ở lần tính đầu tiên, các lần sau trả về luôn. Khi đó fibo(n) chỉ tạo 2n − 1 lời gọi (n ≥ 1): 59 với n = 30 thay vì 2 692 537 — O(n). Ý tưởng "mỗi bài toán con chỉ giải một lần" là cánh cửa dẫn vào quy hoạch động (dynamic programming).</li>
</ul>
<div class="pitfall">Dùng 0 để đánh dấu "chưa tính" chỉ an toàn ở đây vì fibo(k) &gt; 0 với mọi k ≥ 1. Nếu 0 có thể là đáp án thật, hãy giữ riêng một mảng <code>boolean[] known</code> hoặc gán sẵn −1 cho cả mảng. Chương trình cũng tạo mảng ghi nhớ (memo) mới cho mỗi lần chạy để số lời gọi đếm lại từ 0; khi đáp án phụ thuộc dữ liệu đầu vào, giá trị cũ còn sót thậm chí làm sai cả đáp án.</div>`],
      [19, 'More Examples – The Tower of Hanoi',
        `<p class="y-chinh">🎯 The Tower of Hanoi: move a stack of n disks from one rod to another under three rules — and recursion solves it in 2ⁿ − 1 moves.</p>
<ol>
<li>Only one disk may be moved at a time.</li>
<li>Each move takes the upper disk from one of the rods and slides it onto another rod, on top of the disks that may already be there.</li>
<li>No disk may be placed on top of a smaller disk.</li>
</ol>
<p>Each rod behaves like a stack from Chapter 2: you can only take or put the top disk. The program models the rods as stacks, refuses an illegal move, and solves 2 disks:</p>
<pre><code class="language-java">import java.util.ArrayList;

public class HanoiRules {
    static ArrayList&lt;Integer&gt; A = new ArrayList&lt;Integer&gt;(), B = new ArrayList&lt;Integer&gt;(), C = new ArrayList&lt;Integer&gt;();

    static ArrayList&lt;Integer&gt; rod(char r) { return r == 'A' ? A : r == 'B' ? B : C; }   // each rod is a stack: last = top

    static String show() { return "A=" + A + "  B=" + B + "  C=" + C; }

    static void move(char from, char to) {
        ArrayList&lt;Integer&gt; f = rod(from), t = rod(to);
        int disk = f.get(f.size() - 1);                          // rule 2: only the UPPER disk can be taken
        if (!t.isEmpty() &amp;&amp; t.get(t.size() - 1) &lt; disk) {        // rule 3: never onto a smaller disk
            System.out.println("try disk " + disk + ": " + from + " -&gt; " + to + "   REFUSED: disk " + disk + " cannot sit on the smaller disk " + t.get(t.size() - 1));
            return;
        }
        f.remove(f.size() - 1);                                  // rule 1: one disk per move
        t.add(disk);
        System.out.println("disk " + disk + ": " + from + " -&gt; " + to + "        " + show());
    }

    public static void main(String[] args) {
        A.add(2); A.add(1);                                      // disk 2 (big) at the bottom, disk 1 on top
        System.out.println("start:              " + show());
        move('A', 'B');
        move('A', 'B');                                          // illegal on purpose
        move('A', 'C');
        move('B', 'C');
        System.out.println("solved: 2 disks in 3 legal moves = 2^2 - 1");
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[2, 1] &nbsp;B=[] &nbsp;C=[]<br>
disk 1: A -&gt; B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[2] &nbsp;B=[1] &nbsp;C=[]<br>
try disk 2: A -&gt; B &nbsp;&nbsp;REFUSED: disk 2 cannot sit on the smaller disk 1<br>
disk 2: A -&gt; C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[] &nbsp;B=[1] &nbsp;C=[2]<br>
disk 1: B -&gt; C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[] &nbsp;B=[] &nbsp;C=[2, 1]<br>
solved: 2 disks in 3 legal moves = 2^2 - 1</div>
<ul>
<li><strong>The recursive idea</strong>: to move n disks A → C, first move the top n − 1 disks out of the way to B, then move the biggest disk to C, then move the n − 1 disks from B onto it. Both "move n − 1 disks" steps are the same problem, one disk smaller.</li>
<li><strong>How many moves?</strong> M(1) = 1 and M(n) = 2·M(n − 1) + 1, which gives M(n) = 2ⁿ − 1: 1, 3, 7, 15, … — no solution can do better, because the biggest disk can only move once the other n − 1 are all on the third rod.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> "n − 1 out of the way, the big one across, n − 1 back on top".</p>`,
        `<p class="y-chinh">🎯 Tháp Hà Nội (Tower of Hanoi): chuyển một chồng n đĩa từ cọc này sang cọc khác theo ba luật — và đệ quy giải nó bằng 2ⁿ − 1 lần chuyển.</p>
<ol>
<li>Mỗi lần chỉ được chuyển một đĩa.</li>
<li>Mỗi lần chuyển lấy đĩa trên cùng của một cọc và đặt sang một cọc khác, lên trên các đĩa có thể đã nằm sẵn ở đó.</li>
<li>Không được đặt đĩa lên trên một đĩa nhỏ hơn.</li>
</ol>
<p>Mỗi cọc hoạt động như một ngăn xếp (stack) ở Chương 2: chỉ lấy ra hay đặt vào đĩa ở đỉnh. Chương trình mô phỏng các cọc bằng stack, từ chối một lần chuyển sai luật, và giải bài 2 đĩa:</p>
<pre><code class="language-java">import java.util.ArrayList;

public class HanoiRules {
    static ArrayList&lt;Integer&gt; A = new ArrayList&lt;Integer&gt;(), B = new ArrayList&lt;Integer&gt;(), C = new ArrayList&lt;Integer&gt;();

    static ArrayList&lt;Integer&gt; rod(char r) { return r == 'A' ? A : r == 'B' ? B : C; }   // mỗi cọc là một stack: phần tử cuối = đỉnh

    static String show() { return "A=" + A + "  B=" + B + "  C=" + C; }

    static void move(char from, char to) {
        ArrayList&lt;Integer&gt; f = rod(from), t = rod(to);
        int disk = f.get(f.size() - 1);                          // luật 2: chỉ lấy được đĩa TRÊN CÙNG
        if (!t.isEmpty() &amp;&amp; t.get(t.size() - 1) &lt; disk) {        // luật 3: không đặt lên đĩa nhỏ hơn
            System.out.println("try disk " + disk + ": " + from + " -&gt; " + to + "   REFUSED: disk " + disk + " cannot sit on the smaller disk " + t.get(t.size() - 1));
            return;
        }
        f.remove(f.size() - 1);                                  // luật 1: mỗi lần chỉ một đĩa
        t.add(disk);
        System.out.println("disk " + disk + ": " + from + " -&gt; " + to + "        " + show());
    }

    public static void main(String[] args) {
        A.add(2); A.add(1);                                      // đĩa 2 (lớn) ở dưới, đĩa 1 ở trên
        System.out.println("start:              " + show());
        move('A', 'B');
        move('A', 'B');                                          // cố ý đi sai luật
        move('A', 'C');
        move('B', 'C');
        System.out.println("solved: 2 disks in 3 legal moves = 2^2 - 1");
    }
}</code></pre>
<div class="out">start: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[2, 1] &nbsp;B=[] &nbsp;C=[]<br>
disk 1: A -&gt; B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[2] &nbsp;B=[1] &nbsp;C=[]<br>
try disk 2: A -&gt; B &nbsp;&nbsp;REFUSED: disk 2 cannot sit on the smaller disk 1<br>
disk 2: A -&gt; C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[] &nbsp;B=[1] &nbsp;C=[2]<br>
disk 1: B -&gt; C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A=[] &nbsp;B=[] &nbsp;C=[2, 1]<br>
solved: 2 disks in 3 legal moves = 2^2 - 1</div>
<ul>
<li><strong>Ý tưởng đệ quy</strong>: muốn chuyển n đĩa A → C, trước hết dời n − 1 đĩa phía trên sang B cho khuất, rồi chuyển đĩa lớn nhất sang C, rồi chuyển n − 1 đĩa từ B chồng lên nó. Cả hai bước "chuyển n − 1 đĩa" đều là cùng bài toán, bớt đi một đĩa.</li>
<li><strong>Bao nhiêu lần chuyển?</strong> M(1) = 1 và M(n) = 2·M(n − 1) + 1, suy ra M(n) = 2ⁿ − 1: 1, 3, 7, 15, … — không lời giải nào làm ít hơn được, vì đĩa lớn nhất chỉ chuyển được khi n − 1 đĩa kia đã nằm hết ở cọc thứ ba.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "n − 1 đĩa dẹp sang bên, đĩa lớn sang đích, n − 1 đĩa chồng trở lại".</p>`],
      [20, 'More Examples – The Tower of Hanoi Algorithm',
        `<p class="y-chinh">🎯 <code>moveDisks(n, fromTower, toTower, auxTower)</code> is the recursive idea written down: one disk is the stopping condition; otherwise move n − 1 disks to the auxiliary rod, move disk n, and move the n − 1 disks onto it.</p>
<p>The slide's pseudo-statements "Move disk … from … to …" become a <code>move</code> method that also updates three stacks, so each output line shows the rods after the move:</p>
<pre><code class="language-java">import java.math.BigInteger;
import java.util.ArrayList;

public class Hanoi {
    static ArrayList&lt;Integer&gt; A = new ArrayList&lt;Integer&gt;(), B = new ArrayList&lt;Integer&gt;(), C = new ArrayList&lt;Integer&gt;();
    static int moves;
    static boolean print = true;

    static ArrayList&lt;Integer&gt; rod(char r) { return r == 'A' ? A : r == 'B' ? B : C; }

    static void move(int disk, char from, char to) {             // one real move (the slide's "Move disk ... from ... to ...")
        rod(from).remove(rod(from).size() - 1);
        rod(to).add(disk);
        moves++;
        if (print) System.out.println(moves + ". Move disk " + disk + " from " + from + " to " + to + "   A=" + A + " B=" + B + " C=" + C);
    }

    static void moveDisks(int n, char fromTower, char toTower, char auxTower) {   // the slide's algorithm
        if (n == 1) // Stopping condition
            move(1, fromTower, toTower);
        else {
            moveDisks(n - 1, fromTower, auxTower, toTower);
            move(n, fromTower, toTower);
            moveDisks(n - 1, auxTower, toTower, fromTower);
        }
    }

    static int solve(int n) {                                    // put n disks on A, solve A -&gt; C, return the number of moves
        A.clear(); B.clear(); C.clear();
        for (int d = n; d &gt;= 1; d--) A.add(d);
        if (print) System.out.println("start: A=" + A + " B=" + B + " C=" + C);
        moves = 0;
        moveDisks(n, 'A', 'C', 'B');
        return moves;
    }

    public static void main(String[] args) {
        solve(3);
        print = false;
        System.out.println("n = 4: " + solve(4) + " moves, n = 10: " + solve(10) + " moves, n = 20: " + solve(20) + " moves");
        System.out.println("n = 64: 2^64 - 1 = " + BigInteger.ONE.shiftLeft(64).subtract(BigInteger.ONE) + " moves");
    }
}</code></pre>
<div class="out">start: A=[3, 2, 1] B=[] C=[]<br>
1. Move disk 1 from A to C &nbsp;&nbsp;A=[3, 2] B=[] C=[1]<br>
2. Move disk 2 from A to B &nbsp;&nbsp;A=[3] B=[2] C=[1]<br>
3. Move disk 1 from C to B &nbsp;&nbsp;A=[3] B=[2, 1] C=[]<br>
4. Move disk 3 from A to C &nbsp;&nbsp;A=[] B=[2, 1] C=[3]<br>
5. Move disk 1 from B to A &nbsp;&nbsp;A=[1] B=[2] C=[3]<br>
6. Move disk 2 from B to C &nbsp;&nbsp;A=[1] B=[] C=[3, 2]<br>
7. Move disk 1 from A to C &nbsp;&nbsp;A=[] B=[] C=[3, 2, 1]<br>
n = 4: 15 moves, n = 10: 1023 moves, n = 20: 1048575 moves<br>
n = 64: 2^64 - 1 = 18446744073709551615 moves</div>
<p class="nhan">The call tree of moveDisks(3, A, C, B) — the moves happen in this order</p>
<pre><code class="language-plaintext">moveDisks(3, A→C, aux B)
├── moveDisks(2, A→B, aux C)
│   ├── moveDisks(1, A→C)      move 1: disk 1 A→C
│   ├── move 2: disk 2 A→B
│   └── moveDisks(1, C→B)      move 3: disk 1 C→B
├── move 4: disk 3 A→C
└── moveDisks(2, B→C, aux A)
    ├── moveDisks(1, B→A)      move 5: disk 1 B→A
    ├── move 6: disk 2 B→C
    └── moveDisks(1, A→C)      move 7: disk 1 A→C</code></pre>
<ul>
<li>moveDisks(n) makes 2ⁿ − 1 calls and 2ⁿ − 1 moves: O(2ⁿ) time, but only O(n) stack depth.</li>
<li>The output confirms the count: 15 moves for 4 disks, 1 048 575 for 20. The legendary 64 disks need 18 446 744 073 709 551 615 moves — about 585 billion years at one move per second.</li>
<li>Disk 1, the smallest, moves every other time: moves 1, 3, 5, 7.</li>
</ul>
<div class="pitfall">Watch the argument order of the two recursive calls: <code>moveDisks(n - 1, fromTower, auxTower, toTower)</code> and then <code>moveDisks(n - 1, auxTower, toTower, fromTower)</code>. Swapping two arguments still compiles, but the moves then break the rules or leave the disks on the wrong rod — trace n = 2 by hand to check.</div>`,
        `<p class="y-chinh">🎯 <code>moveDisks(n, fromTower, toTower, auxTower)</code> là ý tưởng đệ quy viết thành code: một đĩa là điều kiện dừng (stopping condition); ngược lại thì chuyển n − 1 đĩa sang cọc trung gian (auxiliary), chuyển đĩa n, rồi chuyển n − 1 đĩa chồng lên nó.</p>
<p>Các câu giả mã (pseudo-code) "Move disk … from … to …" của slide trở thành phương thức <code>move</code>, đồng thời cập nhật ba ngăn xếp (stack), nên mỗi dòng output cho thấy ba cọc sau lần chuyển đó:</p>
<pre><code class="language-java">import java.math.BigInteger;
import java.util.ArrayList;

public class Hanoi {
    static ArrayList&lt;Integer&gt; A = new ArrayList&lt;Integer&gt;(), B = new ArrayList&lt;Integer&gt;(), C = new ArrayList&lt;Integer&gt;();
    static int moves;
    static boolean print = true;

    static ArrayList&lt;Integer&gt; rod(char r) { return r == 'A' ? A : r == 'B' ? B : C; }

    static void move(int disk, char from, char to) {             // một lần chuyển thật ("Move disk ... from ... to ..." của slide)
        rod(from).remove(rod(from).size() - 1);
        rod(to).add(disk);
        moves++;
        if (print) System.out.println(moves + ". Move disk " + disk + " from " + from + " to " + to + "   A=" + A + " B=" + B + " C=" + C);
    }

    static void moveDisks(int n, char fromTower, char toTower, char auxTower) {   // thuật toán của slide
        if (n == 1) // Stopping condition
            move(1, fromTower, toTower);
        else {
            moveDisks(n - 1, fromTower, auxTower, toTower);
            move(n, fromTower, toTower);
            moveDisks(n - 1, auxTower, toTower, fromTower);
        }
    }

    static int solve(int n) {                                    // đặt n đĩa lên A, giải A -&gt; C, trả về số lần chuyển
        A.clear(); B.clear(); C.clear();
        for (int d = n; d &gt;= 1; d--) A.add(d);
        if (print) System.out.println("start: A=" + A + " B=" + B + " C=" + C);
        moves = 0;
        moveDisks(n, 'A', 'C', 'B');
        return moves;
    }

    public static void main(String[] args) {
        solve(3);
        print = false;
        System.out.println("n = 4: " + solve(4) + " moves, n = 10: " + solve(10) + " moves, n = 20: " + solve(20) + " moves");
        System.out.println("n = 64: 2^64 - 1 = " + BigInteger.ONE.shiftLeft(64).subtract(BigInteger.ONE) + " moves");
    }
}</code></pre>
<div class="out">start: A=[3, 2, 1] B=[] C=[]<br>
1. Move disk 1 from A to C &nbsp;&nbsp;A=[3, 2] B=[] C=[1]<br>
2. Move disk 2 from A to B &nbsp;&nbsp;A=[3] B=[2] C=[1]<br>
3. Move disk 1 from C to B &nbsp;&nbsp;A=[3] B=[2, 1] C=[]<br>
4. Move disk 3 from A to C &nbsp;&nbsp;A=[] B=[2, 1] C=[3]<br>
5. Move disk 1 from B to A &nbsp;&nbsp;A=[1] B=[2] C=[3]<br>
6. Move disk 2 from B to C &nbsp;&nbsp;A=[1] B=[] C=[3, 2]<br>
7. Move disk 1 from A to C &nbsp;&nbsp;A=[] B=[] C=[3, 2, 1]<br>
n = 4: 15 moves, n = 10: 1023 moves, n = 20: 1048575 moves<br>
n = 64: 2^64 - 1 = 18446744073709551615 moves</div>
<p class="nhan">Cây lời gọi (call tree) của moveDisks(3, A, C, B) — các lần chuyển diễn ra theo đúng thứ tự này</p>
<pre><code class="language-plaintext">moveDisks(3, A→C, trung gian B)
├── moveDisks(2, A→B, trung gian C)
│   ├── moveDisks(1, A→C)      lần 1: đĩa 1 A→C
│   ├── lần 2: đĩa 2 A→B
│   └── moveDisks(1, C→B)      lần 3: đĩa 1 C→B
├── lần 4: đĩa 3 A→C
└── moveDisks(2, B→C, trung gian A)
    ├── moveDisks(1, B→A)      lần 5: đĩa 1 B→A
    ├── lần 6: đĩa 2 B→C
    └── moveDisks(1, A→C)      lần 7: đĩa 1 A→C</code></pre>
<ul>
<li>moveDisks(n) tạo 2ⁿ − 1 lời gọi và 2ⁿ − 1 lần chuyển: O(2ⁿ) thời gian, nhưng độ sâu stack chỉ O(n).</li>
<li>Output xác nhận con số: 15 lần chuyển với 4 đĩa, 1 048 575 với 20 đĩa. 64 đĩa trong truyền thuyết cần 18 446 744 073 709 551 615 lần chuyển — khoảng 585 tỷ năm nếu mỗi giây chuyển một đĩa.</li>
<li>Đĩa 1, đĩa nhỏ nhất, cứ cách một lần lại chuyển một lần: lần 1, 3, 5, 7.</li>
</ul>
<div class="pitfall">Để ý thứ tự đối số của hai lời gọi đệ quy: <code>moveDisks(n - 1, fromTower, auxTower, toTower)</code> rồi <code>moveDisks(n - 1, auxTower, toTower, fromTower)</code>. Tráo hai đối số vẫn biên dịch được, nhưng khi đó các bước chuyển sẽ phạm luật hoặc để đĩa nằm sai cọc — hãy lần tay n = 2 để kiểm tra.</div>`],
      [21, 'More Examples – Drawing fractals',
        `<p class="y-chinh">🎯 A fractal is a shape made of smaller copies of itself, so the natural way to draw one is recursion: draw the shape by drawing its smaller copies, down to a base level that draws something simple.</p>
<p class="ghi-chu">This slide is a picture: only its title could be extracted as text. The explanation below teaches the idea the title announces, using the lesson's own example rather than describing the slide's figure.</p>
<ul>
<li><strong>Self-similar</strong>: zoom into a part and you see the whole again — just like a recursive definition, where the whole is described through smaller instances of itself.</li>
<li><strong>Level = recursion depth</strong>: level 0 is the base case (a tiny shape); every higher level is defined through level − 1.</li>
<li><strong>The lesson's own example, the Sierpinski triangle</strong>: a triangle of level k is three triangles of level k − 1 — top, bottom-left, bottom-right. That is multiple recursion with 3 calls per activation (slide 11).</li>
</ul>
<pre><code class="language-java">public class Sierpinski {
    static char[][] grid;
    static int calls;

    // Draw a Sierpinski triangle of 'size' rows whose top point is at (row, col).
    static void draw(int level, int row, int col, int size) {
        calls++;
        if (level == 0) {                                        // base case: a tiny triangle of 2 rows
            grid[row][col] = '*';
            grid[row + 1][col - 1] = '*';
            grid[row + 1][col + 1] = '*';
            return;
        }
        int half = size / 2;
        draw(level - 1, row, col, half);                         // the same picture, half size, on top
        draw(level - 1, row + half, col - half, half);           // ... bottom left
        draw(level - 1, row + half, col + half, half);           // ... bottom right
    }

    static void picture(int level) {
        int size = 2 &lt;&lt; level;                                   // rows: 2, 4, 8, 16, ...
        grid = new char[size][2 * size - 1];
        for (char[] line : grid) java.util.Arrays.fill(line, ' ');
        calls = 0;
        draw(level, 0, size - 1, size);
        System.out.println("level " + level + " (" + calls + " calls):");
        for (char[] line : grid) System.out.println(new String(line));
    }

    public static void main(String[] args) {
        picture(1);
        picture(2);
    }
}</code></pre>
<div class="out">level 1 (4 calls):<br>
&nbsp;&nbsp;&nbsp;*<br>
&nbsp;&nbsp;* *<br>
&nbsp;* &nbsp;&nbsp;*<br>
* * * *<br>
level 2 (13 calls):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* *<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* &nbsp;&nbsp;*<br>
&nbsp;&nbsp;&nbsp;&nbsp;* * * *<br>
&nbsp;&nbsp;&nbsp;* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br>
&nbsp;&nbsp;* * &nbsp;&nbsp;&nbsp;&nbsp;* *<br>
&nbsp;* &nbsp;&nbsp;* &nbsp;&nbsp;* &nbsp;&nbsp;*<br>
* * * * * * * *</div>
<p><strong>Calls:</strong> level k makes 1 + 3 + 9 + … + 3ᵏ = (3ᵏ⁺¹ − 1)/2 calls — 4 for level 1, 13 for level 2 — and draws 3ᵏ tiny triangles; the output shows 9 of them at level 2.</p>
<p class="meo">🧠 <strong>Remember:</strong> for any recursive drawing ask three questions — what does level 0 draw, how many smaller copies are there, and where does each copy go?</p>`,
        `<p class="y-chinh">🎯 Fractal (hình phân dạng) là hình được ghép từ những bản sao nhỏ hơn của chính nó, nên cách tự nhiên để vẽ fractal là đệ quy: vẽ hình bằng cách vẽ các bản sao nhỏ của nó, cho tới một mức cơ sở chỉ vẽ một thứ đơn giản.</p>
<p class="ghi-chu">Slide này là hình: chữ trích ra được chỉ có tiêu đề. Phần giảng dưới đây dạy đúng ý mà tiêu đề nêu ra, bằng ví dụ của bài chứ không mô tả hình trên slide.</p>
<ul>
<li><strong>Tự đồng dạng (self-similar)</strong>: phóng to một phần sẽ lại thấy cả hình — y như định nghĩa đệ quy, nơi cái toàn thể được mô tả qua các thể hiện nhỏ hơn của chính nó.</li>
<li><strong>Mức (level) = độ sâu đệ quy</strong>: mức 0 là trường hợp cơ sở (base case — một hình nhỏ xíu); mọi mức cao hơn được định nghĩa qua mức − 1.</li>
<li><strong>Ví dụ của bài, tam giác Sierpinski</strong>: tam giác mức k gồm ba tam giác mức k − 1 — trên, dưới trái, dưới phải. Đó là đệ quy bội (multiple recursion) với 3 lời gọi mỗi lần kích hoạt (slide 11).</li>
</ul>
<pre><code class="language-java">public class Sierpinski {
    static char[][] grid;
    static int calls;

    // Vẽ tam giác Sierpinski cao 'size' dòng, đỉnh ở (row, col).
    static void draw(int level, int row, int col, int size) {
        calls++;
        if (level == 0) {                                        // cơ sở: tam giác nhỏ 2 dòng
            grid[row][col] = '*';
            grid[row + 1][col - 1] = '*';
            grid[row + 1][col + 1] = '*';
            return;
        }
        int half = size / 2;
        draw(level - 1, row, col, half);                         // cùng hình đó, cỡ một nửa, ở trên
        draw(level - 1, row + half, col - half, half);           // ... dưới bên trái
        draw(level - 1, row + half, col + half, half);           // ... dưới bên phải
    }

    static void picture(int level) {
        int size = 2 &lt;&lt; level;                                   // số dòng: 2, 4, 8, 16, ...
        grid = new char[size][2 * size - 1];
        for (char[] line : grid) java.util.Arrays.fill(line, ' ');
        calls = 0;
        draw(level, 0, size - 1, size);
        System.out.println("level " + level + " (" + calls + " calls):");
        for (char[] line : grid) System.out.println(new String(line));
    }

    public static void main(String[] args) {
        picture(1);
        picture(2);
    }
}</code></pre>
<div class="out">level 1 (4 calls):<br>
&nbsp;&nbsp;&nbsp;*<br>
&nbsp;&nbsp;* *<br>
&nbsp;* &nbsp;&nbsp;*<br>
* * * *<br>
level 2 (13 calls):<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* *<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* &nbsp;&nbsp;*<br>
&nbsp;&nbsp;&nbsp;&nbsp;* * * *<br>
&nbsp;&nbsp;&nbsp;* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*<br>
&nbsp;&nbsp;* * &nbsp;&nbsp;&nbsp;&nbsp;* *<br>
&nbsp;* &nbsp;&nbsp;* &nbsp;&nbsp;* &nbsp;&nbsp;*<br>
* * * * * * * *</div>
<p><strong>Số lời gọi:</strong> mức k tạo 1 + 3 + 9 + … + 3ᵏ = (3ᵏ⁺¹ − 1)/2 lời gọi — 4 ở mức 1, 13 ở mức 2 — và vẽ 3ᵏ tam giác nhỏ; output cho thấy 9 tam giác như vậy ở mức 2.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> với mọi hình vẽ đệ quy, hỏi ba câu — mức 0 vẽ gì, có mấy bản sao nhỏ, và mỗi bản sao đặt ở đâu?</p>`],
      [22, 'More Examples – Von Koch snowflakes',
        `<p class="y-chinh">🎯 The von Koch snowflake: divide each side into three even parts and replace the middle third by the two other sides of a small equilateral triangle; repeat on every new segment.</p>
<ul>
<li><strong>The slide's two steps</strong>: "divide an interval side into three even parts", and at the base level "move one-third of side in the direction specified by angle" — a turtle that walks forward and turns.</li>
<li><strong>One side of level k</strong> = four sides of level k − 1 with turns of +60°, −120°, +60° between them: 4 recursive calls per activation (multiple recursion). Level 0 is one straight move.</li>
<li><strong>The snowflake</strong> = three Koch sides built on an equilateral triangle, turning 120° between sides.</li>
<li>The slide's title spells the name "Knoch"; the curve is named after the mathematician Helge von Koch.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class KochSnowflake {
    static double x, y, angle;                                   // the "turtle": position and heading in degrees
    static int segments, calls;
    static StringBuilder cmd;                                    // records the moves when not null

    static void side(double len, int level) {
        calls++;
        if (level == 0) {                                        // base: move len in the direction of 'angle'
            x += len * Math.cos(Math.toRadians(angle));
            y += len * Math.sin(Math.toRadians(angle));
            segments++;
            if (cmd != null) cmd.append("F ");
            return;
        }
        side(len / 3, level - 1);                                // divide the side into three even parts
        turn(60);                                                // the middle third becomes a bump
        side(len / 3, level - 1);
        turn(-120);
        side(len / 3, level - 1);
        turn(60);
        side(len / 3, level - 1);
    }

    static void turn(int deg) {
        angle += deg;
        if (cmd != null) cmd.append(deg &gt; 0 ? "L" + deg + " " : "R" + (-deg) + " ");
    }

    public static void main(String[] args) {
        cmd = new StringBuilder();
        side(1, 1);
        System.out.println("one side at level 1: " + cmd.toString().trim() + "   (L = turn left, R = turn right)");
        cmd = null;
        System.out.println("level  segments  segment  perimeter  closed?  calls");
        for (int k = 0; k &lt;= 4; k++) {
            x = y = angle = 0;
            segments = calls = 0;
            for (int s = 0; s &lt; 3; s++) {                        // snowflake = 3 Koch sides of a triangle
                side(1, k);
                angle -= 120;
            }
            double seg = Math.pow(3, -k);
            boolean closed = Math.abs(x) &lt; 1e-9 &amp;&amp; Math.abs(y) &lt; 1e-9;
            System.out.printf(Locale.ROOT, "%-6d %-9d %.6f %-10.6f %-8s %d%n", k, segments, seg, segments * seg, closed ? "yes" : "no", calls);
        }
    }
}</code></pre>
<div class="out">one side at level 1: F L60 F R120 F L60 F &nbsp;&nbsp;(L = turn left, R = turn right)<br>
level &nbsp;segments &nbsp;segment &nbsp;perimeter &nbsp;closed? &nbsp;calls<br>
0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.000000 3.000000 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.333333 4.000000 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;48 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.111111 5.333333 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;63<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;192 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.037037 7.111111 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;255<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;768 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.012346 9.481481 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1023</div>
<table>
<thead><tr><th>Level k</th><th>Segments = 3·4ᵏ</th><th>Segment length = 1/3ᵏ</th><th>Perimeter = 3·(4/3)ᵏ</th></tr></thead>
<tbody>
<tr><td>0</td><td>3</td><td>1</td><td>3</td></tr>
<tr><td>1</td><td>12</td><td>1/3</td><td>4</td></tr>
<tr><td>2</td><td>48</td><td>1/9</td><td>5.333…</td></tr>
<tr><td>3</td><td>192</td><td>1/27</td><td>7.111…</td></tr>
</tbody>
</table>
<p>Each level multiplies the perimeter by 4/3, so it grows without limit, while the area stays bounded (it tends to 8/5 of the starting triangle). "closed? yes" confirms that the turtle returns to its starting point at every level; the calls per level, 1 + 4 + … + 4ᵏ per side, grow like 4ᵏ.</p>
<p class="meo">🧠 <strong>Remember:</strong> Koch = "4 copies at 1/3 size" → 4ᵏ segments per side and 4-way multiple recursion; Sierpinski = "3 copies at 1/2 size".</p>`,
        `<p class="y-chinh">🎯 Bông tuyết von Koch (von Koch snowflake): chia mỗi cạnh thành ba phần bằng nhau, thay đoạn giữa bằng hai cạnh còn lại của một tam giác đều nhỏ; lặp lại trên mọi đoạn mới sinh ra.</p>
<ul>
<li><strong>Hai bước trên slide</strong>: "chia một cạnh thành ba phần bằng nhau", và ở mức cơ sở "đi một phần ba cạnh theo hướng do góc (angle) chỉ định" — một "con rùa" (turtle) đi thẳng rồi xoay.</li>
<li><strong>Một cạnh mức k</strong> = bốn cạnh mức k − 1, giữa chúng xoay +60°, −120°, +60°: 4 lời gọi đệ quy mỗi lần kích hoạt (đệ quy bội — multiple recursion). Mức 0 là một bước đi thẳng.</li>
<li><strong>Bông tuyết</strong> = ba cạnh Koch dựng trên một tam giác đều, xoay 120° giữa các cạnh.</li>
<li>Tiêu đề slide viết tên là "Knoch"; đường cong mang tên nhà toán học Helge von Koch.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class KochSnowflake {
    static double x, y, angle;                                   // "con rùa": vị trí và hướng (độ)
    static int segments, calls;
    static StringBuilder cmd;                                    // ghi lại các bước khi khác null

    static void side(double len, int level) {
        calls++;
        if (level == 0) {                                        // cơ sở: đi len theo hướng 'angle'
            x += len * Math.cos(Math.toRadians(angle));
            y += len * Math.sin(Math.toRadians(angle));
            segments++;
            if (cmd != null) cmd.append("F ");
            return;
        }
        side(len / 3, level - 1);                                // chia cạnh thành ba phần bằng nhau
        turn(60);                                                // đoạn giữa thành một cái "mỏm"
        side(len / 3, level - 1);
        turn(-120);
        side(len / 3, level - 1);
        turn(60);
        side(len / 3, level - 1);
    }

    static void turn(int deg) {
        angle += deg;
        if (cmd != null) cmd.append(deg &gt; 0 ? "L" + deg + " " : "R" + (-deg) + " ");
    }

    public static void main(String[] args) {
        cmd = new StringBuilder();
        side(1, 1);
        System.out.println("one side at level 1: " + cmd.toString().trim() + "   (L = turn left, R = turn right)");
        cmd = null;
        System.out.println("level  segments  segment  perimeter  closed?  calls");
        for (int k = 0; k &lt;= 4; k++) {
            x = y = angle = 0;
            segments = calls = 0;
            for (int s = 0; s &lt; 3; s++) {                        // bông tuyết = 3 cạnh Koch của một tam giác
                side(1, k);
                angle -= 120;
            }
            double seg = Math.pow(3, -k);
            boolean closed = Math.abs(x) &lt; 1e-9 &amp;&amp; Math.abs(y) &lt; 1e-9;
            System.out.printf(Locale.ROOT, "%-6d %-9d %.6f %-10.6f %-8s %d%n", k, segments, seg, segments * seg, closed ? "yes" : "no", calls);
        }
    }
}</code></pre>
<div class="out">one side at level 1: F L60 F R120 F L60 F &nbsp;&nbsp;(L = turn left, R = turn right)<br>
level &nbsp;segments &nbsp;segment &nbsp;perimeter &nbsp;closed? &nbsp;calls<br>
0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.000000 3.000000 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>
1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.333333 4.000000 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15<br>
2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;48 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.111111 5.333333 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;63<br>
3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;192 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.037037 7.111111 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;255<br>
4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;768 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.012346 9.481481 &nbsp;&nbsp;yes &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1023</div>
<table>
<thead><tr><th>Mức k</th><th>Số đoạn = 3·4ᵏ</th><th>Độ dài mỗi đoạn = 1/3ᵏ</th><th>Chu vi = 3·(4/3)ᵏ</th></tr></thead>
<tbody>
<tr><td>0</td><td>3</td><td>1</td><td>3</td></tr>
<tr><td>1</td><td>12</td><td>1/3</td><td>4</td></tr>
<tr><td>2</td><td>48</td><td>1/9</td><td>5,333…</td></tr>
<tr><td>3</td><td>192</td><td>1/27</td><td>7,111…</td></tr>
</tbody>
</table>
<p>Mỗi mức nhân chu vi lên 4/3, nên chu vi tăng vô hạn, trong khi diện tích vẫn bị chặn (tiến tới 8/5 diện tích tam giác ban đầu). Cột "closed? yes" xác nhận con rùa quay về đúng điểm xuất phát ở mọi mức; số lời gọi, 1 + 4 + … + 4ᵏ cho mỗi cạnh, tăng như 4ᵏ.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Koch = "4 bản sao, cỡ 1/3" → mỗi cạnh 4ᵏ đoạn và đệ quy bội 4 nhánh; Sierpinski = "3 bản sao, cỡ 1/2".</p>`],
      [23, 'Recursion vs. Iteration',
        `<p class="y-chinh">🎯 Some recursive algorithms are just as easy to write with a loop — then prefer the loop, since it avoids the overhead of the run-time stack; keep recursion for the problems that are very difficult to solve any other way.</p>
<ul>
<li><strong>The overhead</strong>: every call pushes an activation record (parameters, locals, return address, dynamic link — slide 8) and pops it later, and the memory grows with the depth of the recursion.</li>
<li><strong>Easy to loop</strong>: factorial, sums, every tail recursion (slide 12), binary search, Fibonacci (slide 17).</li>
<li><strong>Hard to loop</strong>: the Tower of Hanoi, fractals, tree traversals, backtracking — a loop version has to manage an explicit stack that imitates the recursion (slide 14).</li>
</ul>
<pre><code class="language-java">public class RecursionVsIteration {
    static long sumRec(int n) {                                  // recursion: one activation record per number
        if (n == 0) return 0;
        return n + sumRec(n - 1);
    }

    static long sumLoop(int n) {                                 // iteration: one frame, two variables
        long s = 0;
        for (int i = 1; i &lt;= n; i++) s += i;
        return s;
    }

    public static void main(String[] args) {
        for (int n : new int[] {1000, 1000000}) {
            System.out.print("n = " + n + ": loop = " + sumLoop(n) + ", recursion = ");
            try {
                System.out.println(sumRec(n));
            } catch (StackOverflowError e) {                     // thrown when the run-time stack is full
                System.out.println("StackOverflowError");
            }
        }
        try {
            try {
                sumRec(1000000);
            } catch (Exception e) {                              // does NOT match: StackOverflowError is an Error
                System.out.println("caught by catch (Exception e)");
            }
        } catch (StackOverflowError e) {
            System.out.println("catch (Exception e) missed it: StackOverflowError extends Error, not Exception");
        }
    }
}</code></pre>
<div class="out">n = 1000: loop = 500500, recursion = 500500<br>
n = 1000000: loop = 500000500000, recursion = StackOverflowError<br>
catch (Exception e) missed it: StackOverflowError extends Error, not Exception</div>
<table>
<thead><tr><th>Aspect</th><th>Recursion</th><th>Iteration</th></tr></thead>
<tbody>
<tr><td>Pros</td><td>short and close to the definition; natural for recursive structures (trees, divide and conquer, backtracking)</td><td>no call overhead; O(1) extra memory for simple loops; no stack overflow</td></tr>
<tr><td>Cons</td><td>call overhead; O(depth) stack memory; <code>StackOverflowError</code> when too deep; can repeat work (slide 17)</td><td>can be much harder to write and read for tree-shaped problems</td></tr>
</tbody>
</table>
<p class="nhan">Syllabus question: "What are the pros and cons of recursion?"</p>
<p class="dap-an">✅ <strong>Answer:</strong> the table above. In one line: recursion buys clarity on recursively structured problems and pays with call overhead, stack memory, the risk of stack overflow and — if written carelessly — repeated work.</p>
<div class="pitfall"><code>StackOverflowError</code> is an <code>Error</code>, not an <code>Exception</code>, so <code>catch (Exception e)</code> does not catch it (last output line). Never "fix" a too-deep recursion with try/catch: rewrite it as a loop or make it shallower.</div>`,
        `<p class="y-chinh">🎯 Có những thuật toán đệ quy viết bằng vòng lặp (iteration) cũng dễ y như vậy — khi đó nên dùng vòng lặp vì tránh được chi phí của ngăn xếp lúc chạy (run-time stack); hãy để dành đệ quy cho những bài toán rất khó giải theo cách khác.</p>
<ul>
<li><strong>Chi phí phụ (overhead)</strong>: mỗi lời gọi đẩy vào một bản ghi kích hoạt (activation record: tham số, biến cục bộ, địa chỉ trở về, liên kết động — slide 8) rồi sau đó lấy ra, và bộ nhớ tăng theo độ sâu đệ quy.</li>
<li><strong>Dễ chuyển sang vòng lặp</strong>: giai thừa, tính tổng, mọi đệ quy đuôi (tail recursion, slide 12), tìm kiếm nhị phân, Fibonacci (slide 17).</li>
<li><strong>Khó chuyển sang vòng lặp</strong>: Tháp Hà Nội, fractal, duyệt cây, quay lui (backtracking) — bản vòng lặp phải tự quản lý một stack tường minh bắt chước đệ quy (slide 14).</li>
</ul>
<pre><code class="language-java">public class RecursionVsIteration {
    static long sumRec(int n) {                                  // đệ quy: mỗi số một activation record
        if (n == 0) return 0;
        return n + sumRec(n - 1);
    }

    static long sumLoop(int n) {                                 // vòng lặp: một khung, hai biến
        long s = 0;
        for (int i = 1; i &lt;= n; i++) s += i;
        return s;
    }

    public static void main(String[] args) {
        for (int n : new int[] {1000, 1000000}) {
            System.out.print("n = " + n + ": loop = " + sumLoop(n) + ", recursion = ");
            try {
                System.out.println(sumRec(n));
            } catch (StackOverflowError e) {                     // ném ra khi run-time stack đầy
                System.out.println("StackOverflowError");
            }
        }
        try {
            try {
                sumRec(1000000);
            } catch (Exception e) {                              // KHÔNG bắt được: StackOverflowError là Error
                System.out.println("caught by catch (Exception e)");
            }
        } catch (StackOverflowError e) {
            System.out.println("catch (Exception e) missed it: StackOverflowError extends Error, not Exception");
        }
    }
}</code></pre>
<div class="out">n = 1000: loop = 500500, recursion = 500500<br>
n = 1000000: loop = 500000500000, recursion = StackOverflowError<br>
catch (Exception e) missed it: StackOverflowError extends Error, not Exception</div>
<table>
<thead><tr><th>Khía cạnh</th><th>Đệ quy</th><th>Vòng lặp</th></tr></thead>
<tbody>
<tr><td>Ưu điểm</td><td>ngắn, sát với định nghĩa; tự nhiên với cấu trúc đệ quy (cây, chia để trị — divide and conquer, quay lui)</td><td>không tốn chi phí gọi hàm; vòng lặp đơn giản chỉ cần O(1) bộ nhớ phụ; không bao giờ tràn stack</td></tr>
<tr><td>Nhược điểm</td><td>tốn chi phí gọi hàm; bộ nhớ stack O(độ sâu); <code>StackOverflowError</code> khi quá sâu; có thể lặp lại công việc (slide 17)</td><td>với bài toán dạng cây thì khó viết và khó đọc hơn nhiều</td></tr>
</tbody>
</table>
<p class="nhan">Câu hỏi trong syllabus: "Ưu và nhược điểm của đệ quy là gì?"</p>
<p class="dap-an">✅ <strong>Đáp án:</strong> chính là bảng trên. Gói trong một câu: đệ quy mua sự rõ ràng cho các bài toán có cấu trúc đệ quy, và trả giá bằng chi phí gọi hàm, bộ nhớ stack, nguy cơ tràn stack (stack overflow) và — nếu viết ẩu — công việc bị lặp lại.</p>
<div class="pitfall"><code>StackOverflowError</code> là một <code>Error</code>, không phải <code>Exception</code>, nên <code>catch (Exception e)</code> không bắt được nó (dòng output cuối). Đừng bao giờ "chữa" đệ quy quá sâu bằng try/catch: hãy viết lại bằng vòng lặp hoặc làm cho nó nông hơn.</div>`],
      [24, 'Summary',
        `<p class="y-chinh">🎯 The deck in four points: recursive definitions define something in terms of itself; they generate new elements and test membership in a set; they are used to define functions and sequences of numbers; tail recursion has a single recursive call at the very end of the method.</p>
<p>The table gathers every classification of the deck in one place:</p>
<table>
<thead><tr><th>Kind</th><th>How to recognise it</th><th>Example in this lesson</th></tr></thead>
<tbody>
<tr><td>Linear / binary / multiple</td><td>1 / exactly 2 / 3 or more calls in one activation</td><td>binary search / fibo / Sierpinski, Koch</td></tr>
<tr><td>Tail</td><td>the only recursive call is the very last action</td><td>tail(n) — slide 12</td></tr>
<tr><td>Non-tail</td><td>work remains after a recursive call</td><td>reverse() — slide 13</td></tr>
<tr><td>Indirect</td><td>f → g → … → f</td><td>sin → tan → sin — slide 15</td></tr>
<tr><td>Nested</td><td>a recursive call inside the argument of a recursive call</td><td>h(n), Ackermann — slide 16</td></tr>
<tr><td>Excessive</td><td>the same subproblem is solved many times</td><td>fibo(n) — slides 17–18</td></tr>
</tbody>
</table>
<ul>
<li>A correct recursion needs a base case that is always reached, and every call must move toward it.</li>
<li>Each call has its own activation record on the run-time stack: memory = O(depth).</li>
<li>Tail recursion → a loop; any recursion → a loop + an explicit stack.</li>
</ul>
<div class="pitfall">The classifications are independent. One method can belong to several kinds at once: the recursive fibo is binary <em>and</em> non-tail <em>and</em> excessive. An FE option saying "fibo is binary, so it is not excessive" is wrong.</div>
<p class="meo">🧠 <strong>Remember — one question per kind:</strong> how many calls? is the call last? who calls whom? is a call inside an argument? is work repeated?</p>`,
        `<p class="y-chinh">🎯 Cả bộ slide trong bốn ý: định nghĩa đệ quy định nghĩa một thứ qua chính nó; nó dùng để sinh phần tử mới và kiểm tra phần tử có thuộc tập; nó hay được dùng để định nghĩa hàm và dãy số; đệ quy đuôi (tail recursion) chỉ có một lời gọi đệ quy nằm ở đúng cuối phương thức.</p>
<p>Bảng dưới gom mọi cách phân loại của bộ slide vào một chỗ:</p>
<table>
<thead><tr><th>Loại</th><th>Nhận ra bằng cách nào</th><th>Ví dụ trong bài</th></tr></thead>
<tbody>
<tr><td>Tuyến tính / nhị phân / bội (linear / binary / multiple)</td><td>1 / đúng 2 / từ 3 lời gọi trở lên trong một lần kích hoạt</td><td>tìm kiếm nhị phân / fibo / Sierpinski, Koch</td></tr>
<tr><td>Đuôi (tail)</td><td>lời gọi đệ quy duy nhất là việc cuối cùng</td><td>tail(n) — slide 12</td></tr>
<tr><td>Không đuôi (non-tail)</td><td>sau một lời gọi đệ quy vẫn còn việc</td><td>reverse() — slide 13</td></tr>
<tr><td>Gián tiếp (indirect)</td><td>f → g → … → f</td><td>sin → tan → sin — slide 15</td></tr>
<tr><td>Lồng (nested)</td><td>có lời gọi đệ quy nằm trong đối số của một lời gọi đệ quy</td><td>h(n), Ackermann — slide 16</td></tr>
<tr><td>Thừa (excessive)</td><td>cùng một bài toán con bị giải nhiều lần</td><td>fibo(n) — slide 17–18</td></tr>
</tbody>
</table>
<ul>
<li>Một phép đệ quy đúng cần trường hợp cơ sở (base case) luôn chạm tới được, và mọi lời gọi phải tiến về phía nó.</li>
<li>Mỗi lời gọi có bản ghi kích hoạt (activation record) riêng trên ngăn xếp lúc chạy (run-time stack): bộ nhớ = O(độ sâu).</li>
<li>Đệ quy đuôi → một vòng lặp; mọi đệ quy → vòng lặp + một stack tường minh.</li>
</ul>
<div class="pitfall">Các cách phân loại độc lập với nhau. Một phương thức có thể thuộc nhiều loại cùng lúc: fibo đệ quy vừa là nhị phân, <em>vừa</em> không đuôi, <em>vừa</em> là đệ quy thừa. Phương án FE kiểu "fibo là đệ quy nhị phân nên không phải đệ quy thừa" là SAI.</div>
<p class="meo">🧠 <strong>Mẹo nhớ — mỗi loại một câu hỏi:</strong> mấy lời gọi? lời gọi có nằm cuối không? ai gọi ai? có lời gọi nằm trong đối số không? có việc bị lặp lại không?</p>`],
      [25, 'Reading at home',
        `<p class="y-chinh">🎯 Chapter 5 of Goodrich 6e, "Recursion" (p.189), is the textbook version of this deck — read it after the slides.</p>
<ul>
<li><strong>§5.1 Illustrative Examples (p.191)</strong> — §5.1.1 The Factorial Function (p.191), §5.1.3 Binary Search (p.196), §5.1.4 File Systems (p.198).</li>
<li><strong>§5.2 Analyzing Recursive Algorithms (p.202)</strong> — counting the activations and the work done in each one.</li>
<li><strong>§5.3 Further Examples of Recursion (p.206)</strong> — §5.3.1 Linear Recursion (p.206), §5.3.2 Binary Recursion (p.211), §5.3.3 Multiple Recursion (p.212): the classification of slide 11.</li>
<li><strong>§5.4 Designing Recursive Algorithms (p.214)</strong> — test for base cases, then recur; how to add parameters to a recursion.</li>
<li><strong>§5.6 Eliminating Tail Recursion (p.219)</strong> — turning a tail recursion into a loop, as on slide 12.</li>
</ul>
<p>The list skips §5.1.2 (Drawing an English Ruler) and §5.5 (Recursion Run Amok, about recursions that waste work, such as the naive Fibonacci of slides 17–18); both are short and worth reading too.</p>`,
        `<p class="y-chinh">🎯 Chương 5 của sách Goodrich bản 6, "Recursion" (tr.189), là phiên bản giáo trình của bộ slide này — đọc sau khi học slide.</p>
<ul>
<li><strong>§5.1 Illustrative Examples (tr.191)</strong> — §5.1.1 The Factorial Function (hàm giai thừa, tr.191), §5.1.3 Binary Search (tìm kiếm nhị phân, tr.196), §5.1.4 File Systems (hệ thống tệp, tr.198).</li>
<li><strong>§5.2 Analyzing Recursive Algorithms (phân tích thuật toán đệ quy, tr.202)</strong> — đếm số lần kích hoạt và lượng công việc trong mỗi lần.</li>
<li><strong>§5.3 Further Examples of Recursion (tr.206)</strong> — §5.3.1 Linear Recursion (đệ quy tuyến tính, tr.206), §5.3.2 Binary Recursion (đệ quy nhị phân, tr.211), §5.3.3 Multiple Recursion (đệ quy bội, tr.212): cách phân loại của slide 11.</li>
<li><strong>§5.4 Designing Recursive Algorithms (thiết kế thuật toán đệ quy, tr.214)</strong> — kiểm tra trường hợp cơ sở trước rồi mới gọi đệ quy; cách thêm tham số cho một phép đệ quy.</li>
<li><strong>§5.6 Eliminating Tail Recursion (khử đệ quy đuôi, tr.219)</strong> — biến đệ quy đuôi thành vòng lặp, như slide 12.</li>
</ul>
<p>Danh sách bỏ qua §5.1.2 (Drawing an English Ruler — vẽ thước kẻ) và §5.5 (Recursion Run Amok — những phép đệ quy làm phí công, như Fibonacci ngây thơ ở slide 17–18); cả hai đều ngắn và cũng đáng đọc.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>How many main parts does a recursive algorithm have, and what are they? (a syllabus question)</li>
<li>What does <code>f(3)</code> print, and is <code>f</code> tail recursive? <code>static void f(int n) { if (n &gt; 0) { f(n - 1); System.out.print(n); } }</code></li>
<li>Binary search contains two recursive call statements. Is it linear, binary or multiple recursion?</li>
<li>How many calls does the slide's <code>fibo(5)</code> make? How many moves does the Tower of Hanoi need for 5 disks?</li>
<li>Why does <code>catch (Exception e)</code> not stop a <code>StackOverflowError</code>?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) two — a base case (anchor) that stops the recursion, and a recursive (inductive) case that moves toward it. (2) 123 — the print runs after the call returns, so <code>f</code> is non-tail recursive. (3) linear: only one of the two calls can run in an activation. (4) 2·fibo(6) − 1 = 15 calls; 2⁵ − 1 = 31 moves. (5) <code>StackOverflowError</code> extends <code>Error</code>, not <code>Exception</code>.</p>
<p><strong>Next:</strong> the deep-dive lessons 3.1–3.4 below (recursion and the call stack; four classic recursions; analysing recursion with recursion trees and the Master theorem; designing recursion and eliminating tail calls), then lesson 3.5 (practice, glossary, summary) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Một thuật toán đệ quy có mấy phần chính, đó là những phần nào? (câu hỏi trong syllabus)</li>
<li><code>f(3)</code> in ra gì, và <code>f</code> có phải đệ quy đuôi (tail recursion) không? <code>static void f(int n) { if (n &gt; 0) { f(n - 1); System.out.print(n); } }</code></li>
<li>Tìm kiếm nhị phân có hai câu lệnh gọi đệ quy. Đó là đệ quy tuyến tính, nhị phân hay bội?</li>
<li><code>fibo(5)</code> của slide tạo bao nhiêu lời gọi? Tháp Hà Nội với 5 đĩa cần bao nhiêu lần chuyển?</li>
<li>Vì sao <code>catch (Exception e)</code> không chặn được <code>StackOverflowError</code>?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) hai phần — trường hợp cơ sở (base case, điểm neo) để dừng, và bước đệ quy (bước quy nạp — inductive case) tiến dần về phía đó. (2) 123 — lệnh in chạy sau khi lời gọi trả về, nên <code>f</code> là đệ quy không đuôi. (3) tuyến tính: mỗi lần kích hoạt chỉ một trong hai lời gọi có thể chạy. (4) 2·fibo(6) − 1 = 15 lời gọi; 2⁵ − 1 = 31 lần chuyển. (5) <code>StackOverflowError</code> kế thừa <code>Error</code>, không phải <code>Exception</code>.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu 3.1–3.4 ngay bên dưới (đệ quy và ngăn xếp lời gọi — call stack; bốn ví dụ đệ quy kinh điển; phân tích đệ quy bằng cây đệ quy và định lý Thợ — Master theorem; thiết kế đệ quy và khử đệ quy đuôi), rồi bài 3.5 (thực hành, thuật ngữ, tóm tắt) và quiz của chương.</p>`),
    books([
      ['goodrich', 'Ch.5 Recursion p.189 — §5.1 Illustrative Examples p.191 (§5.1.1 The Factorial Function p.191 · §5.1.3 Binary Search p.196 · §5.1.4 File Systems p.198) · §5.2 Analyzing Recursive Algorithms p.202 · §5.3 Further Examples of Recursion p.206 (§5.3.1 Linear p.206 · §5.3.2 Binary p.211 · §5.3.3 Multiple p.212) · §5.4 Designing Recursive Algorithms p.214 · §5.6 Eliminating Tail Recursion p.219', 'Chương 5 Recursion tr.189 — §5.1 Illustrative Examples tr.191 (§5.1.1 The Factorial Function tr.191 · §5.1.3 Binary Search tr.196 · §5.1.4 File Systems tr.198) · §5.2 Analyzing Recursive Algorithms tr.202 · §5.3 Further Examples of Recursion tr.206 (§5.3.1 Linear tr.206 · §5.3.2 Binary tr.211 · §5.3.3 Multiple tr.212) · §5.4 Designing Recursive Algorithms tr.214 · §5.6 Eliminating Tail Recursion tr.219'],
    ]),
  ].join('\n'),
};

/* ───────── 3.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Recursion ───────── */
const L_on_ch3 = {
  title: '3.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Recursion|||3.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Đệ quy',
  slug: 'csd201-on-ch3',
  type: 'VIDEO',
  description: '7 bài tập kiểu đề PE về đệ quy (đếm/tổng/max trên danh sách liên kết, in ngược và đảo danh sách, tìm kiếm nhị phân đệ quy rồi khử đệ quy đuôi, lũy thừa nhanh và đổi cơ số, sinh tập con và hoán vị bằng quay lui, đếm đường đi trên lưới và loang vùng, bài tổng hợp f1–f4 trên danh sách xe) có lời giải và test tự kiểm chạy thật; 22 thuật ngữ Anh–Việt; tóm tắt 7 ý và bảng độ phức tạp của chương 3.',
  content: [
    bi(`<span class="eyebrow">Chapter 3 · Lesson 3.5 · Practice &amp; review</span>
<h2>Recursion — practise like the PE, then review</h2>
<p class="lead">Seven exercises in the shape of the practical exam — from recursive methods on a linked list to backtracking and a grid — each with a solution that tests itself. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the method yourself in Eclipse. Unless the task says otherwise, write the recursive methods <strong>without loops</strong> — that is usually the point of a recursion question.</li>
<li>Before typing, answer the two questions of slide 3: what is the base case, and how does every call get closer to it?</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS. Only then compare with the solution and read the trap under it.</li>
</ol>
<p>In a CSD201 PE the skeleton — the data class, the <code>Node</code> and list classes, and a <code>main</code> that calls <code>f1</code>, <code>f2</code>, … and writes each answer to a file — is usually given, and you fill in the bodies. Here every answer is printed on the screen instead of written to a file.</p></div>`,
    `<span class="eyebrow">Chương 3 · Bài 3.5 · Thực hành &amp; ôn tập</span>
<h2>Đệ quy — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Bảy bài tập theo dạng đề thi thực hành (PE) — từ các hàm đệ quy trên danh sách liên kết tới quay lui (backtracking) và bài toán trên lưới — bài nào cũng có lời giải tự kiểm tra được. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp để ôn trước FE (thi cuối kỳ).</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết hàm trong Eclipse. Trừ khi đề nói khác, hãy viết các hàm đệ quy <strong>không dùng vòng lặp</strong> — thường đó chính là điều câu hỏi đệ quy muốn kiểm tra.</li>
<li>Trước khi gõ, trả lời hai câu hỏi của slide 3: trường hợp cơ sở (base case) là gì, và mỗi lời gọi tiến gần tới nó bằng cách nào?</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt). Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Đề PE môn CSD201 thường cho sẵn bộ khung — lớp dữ liệu, lớp <code>Node</code> và lớp danh sách, hàm <code>main</code> gọi <code>f1</code>, <code>f2</code>, … và ghi từng đáp án ra file — còn bạn viết thân các hàm. Ở đây mọi kết quả được in ra màn hình thay vì ghi ra file.</p></div>`),
    bi(`<h3>🧪 Exercise 1 — f1: count, sum and max on a linked list, recursively (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Cars <code>Car(owner, price)</code> are stored in a singly linked list. Without any loop, write <code>count(p)</code>, <code>sum(p)</code>, <code>countAbove(p, x)</code> (cars with price &gt; x) and <code>maxCar(p)</code> — the <strong>first</strong> car with the highest price, or <code>null</code> for an empty list. Each method works on the list that starts at node <code>p</code>; you call it with <code>head</code>.</p>
<p class="nhan">Data → expected result</p>
<p>A 5, B 9, C 2, D 9, E 1 → count 5, sum 26, countAbove(4) = 3, maxCar = (B,9).</p>
<p class="nhan">Idea</p>
<p>a list is either empty (<code>p == null</code> — the base case) or one node followed by a shorter list (<code>p.next</code>). So every answer is "what this node contributes" combined with the answer for <code>p.next</code>. For <code>maxCar</code>, the rest of the list is solved first, so keep <code>p</code> when its price is <code>&gt;=</code> the best of the rest — that is what makes the <em>first</em> of two equal maxima win.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info; Node next;
    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f1 - recursive, no loop: the list starting at p = p + the shorter list p.next
    int count(Node p) {
        if (p == null) return 0;                         // base case: empty list
        return 1 + count(p.next);
    }

    int sum(Node p) {
        if (p == null) return 0;
        return p.info.price + sum(p.next);
    }

    int countAbove(Node p, int x) {                      // cars with price &gt; x
        if (p == null) return 0;
        return (p.info.price &gt; x ? 1 : 0) + countAbove(p.next, x);
    }

    Car maxCar(Node p) {                                 // FIRST car with the highest price; null if empty
        if (p == null) return null;
        Car best = maxCar(p.next);                       // best of the rest
        return (best == null || p.info.price &gt;= best.price) ? p.info : best;   // &gt;= keeps the earlier one
    }
}

public class Pe1ListRecursion {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String data) {                    // "A5 B9" -&gt; list; "" -&gt; empty
        MyList t = new MyList();
        for (String w : data.split(" ")) if (!w.isEmpty()) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("A5 B9 C2 D9 E1");
        check("count = 5, sum = 26", t.count(t.head) + ", " + t.sum(t.head), "5, 26");
        check("countAbove(4) = 3", "" + t.countAbove(t.head, 4), "3");
        check("maxCar = first of two 9s", "" + t.maxCar(t.head), "(B,9)");
        MyList e = make("");
        check("empty list: 0, 0, null", e.count(e.head) + ", " + e.sum(e.head) + ", " + e.maxCar(e.head), "0, 0, null");
        MyList one = make("A7");
        check("one car", one.count(one.head) + ", " + one.sum(one.head) + ", " + one.maxCar(one.head), "1, 7, (A,7)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS count = 5, sum = 26<br>
PASS countAbove(4) = 3<br>
PASS maxCar = first of two 9s<br>
PASS empty list: 0, 0, null<br>
PASS one car<br>
ALL TESTS PASSED</div>
<div class="pitfall">Two classic crashes: using <code>p.next == null</code> as the only base case (an empty list then throws <code>NullPointerException</code>), and calling <code>count(head)</code> inside <code>count</code> instead of <code>count(p.next)</code> (the problem never shrinks → <code>StackOverflowError</code>). Remember too that each node costs one activation record: a list of 100 000 cars can overflow the stack, so real code uses a loop unless recursion is required.</div>`,
    `<h3>🧪 Bài 1 — f1: đếm, tính tổng và tìm max trên danh sách liên kết bằng đệ quy (kiểu PE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Các xe <code>Car(owner, price)</code> nằm trong một danh sách liên kết đơn (singly linked list). Không dùng vòng lặp nào, hãy viết <code>count(p)</code>, <code>sum(p)</code>, <code>countAbove(p, x)</code> (số xe có price &gt; x) và <code>maxCar(p)</code> — xe <strong>đầu tiên</strong> có giá cao nhất, hoặc <code>null</code> nếu danh sách rỗng. Mỗi hàm làm việc trên danh sách bắt đầu từ nút <code>p</code>; bạn gọi nó với <code>head</code>.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>A 5, B 9, C 2, D 9, E 1 → count 5, sum 26, countAbove(4) = 3, maxCar = (B,9).</p>
<p class="nhan">Ý tưởng</p>
<p>một danh sách hoặc là rỗng (<code>p == null</code> — trường hợp cơ sở), hoặc là một nút theo sau bởi một danh sách ngắn hơn (<code>p.next</code>). Vì vậy đáp án nào cũng là "phần đóng góp của nút này" kết hợp với đáp án cho <code>p.next</code>. Với <code>maxCar</code>, phần còn lại của danh sách được giải trước, nên giữ <code>p</code> khi giá của nó <code>&gt;=</code> xe tốt nhất của phần còn lại — nhờ vậy xe <em>đầu tiên</em> trong hai xe cùng giá max được chọn.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info; Node next;
    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    // f1 - đệ quy, không vòng lặp: danh sách bắt đầu ở p = p + danh sách ngắn hơn p.next
    int count(Node p) {
        if (p == null) return 0;                         // cơ sở: danh sách rỗng
        return 1 + count(p.next);
    }

    int sum(Node p) {
        if (p == null) return 0;
        return p.info.price + sum(p.next);
    }

    int countAbove(Node p, int x) {                      // số xe có price &gt; x
        if (p == null) return 0;
        return (p.info.price &gt; x ? 1 : 0) + countAbove(p.next, x);
    }

    Car maxCar(Node p) {                                 // xe ĐẦU TIÊN có giá cao nhất; null nếu rỗng
        if (p == null) return null;
        Car best = maxCar(p.next);                       // xe tốt nhất của phần còn lại
        return (best == null || p.info.price &gt;= best.price) ? p.info : best;   // &gt;= giữ xe đứng trước
    }
}

public class Pe1ListRecursion {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String data) {                    // "A5 B9" -&gt; danh sách; "" -&gt; rỗng
        MyList t = new MyList();
        for (String w : data.split(" ")) if (!w.isEmpty()) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("A5 B9 C2 D9 E1");
        check("count = 5, sum = 26", t.count(t.head) + ", " + t.sum(t.head), "5, 26");
        check("countAbove(4) = 3", "" + t.countAbove(t.head, 4), "3");
        check("maxCar = first of two 9s", "" + t.maxCar(t.head), "(B,9)");
        MyList e = make("");
        check("empty list: 0, 0, null", e.count(e.head) + ", " + e.sum(e.head) + ", " + e.maxCar(e.head), "0, 0, null");
        MyList one = make("A7");
        check("one car", one.count(one.head) + ", " + one.sum(one.head) + ", " + one.maxCar(one.head), "1, 7, (A,7)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS count = 5, sum = 26<br>
PASS countAbove(4) = 3<br>
PASS maxCar = first of two 9s<br>
PASS empty list: 0, 0, null<br>
PASS one car<br>
ALL TESTS PASSED</div>
<div class="pitfall">Hai kiểu sập kinh điển: lấy <code>p.next == null</code> làm trường hợp cơ sở duy nhất (danh sách rỗng sẽ văng <code>NullPointerException</code>), và gọi <code>count(head)</code> bên trong <code>count</code> thay vì <code>count(p.next)</code> (bài toán không nhỏ đi → <code>StackOverflowError</code>). Nhớ thêm rằng mỗi nút tốn một bản ghi kích hoạt (activation record): danh sách 100 000 xe có thể làm tràn ngăn xếp (stack), nên code thực tế dùng vòng lặp trừ khi đề bắt buộc đệ quy.</div>`),
    bi(`<h3>🧪 Exercise 2 — f2: print backwards, then reverse the list recursively (PE + interview · ~15 min)</h3>
<p class="nhan">Task</p>
<p>(a) <code>backwards(p)</code> returns the cars from the last to the first <strong>without changing the list</strong>. (b) <code>reverse()</code> reverses the links themselves, recursively, and leaves <code>head</code> and <code>tail</code> correct. Create no new node.</p>
<p class="nhan">Data → expected result</p>
<p>A 1, B 2, C 3 → backwards: (C,3) (B,2) (A,1), and the list is still (A,1) (B,2) (C,3); after reverse(): (C,3) (B,2) (A,1) with head = (C,3), tail = (A,1), tail.next = null. A one-car list stays as it is; an empty list stays empty.</p>
<p class="nhan">Idea</p>
<p>(a) is the non-tail pattern of slide 13: recurse first, add this node afterwards. (b) reverse the rest of the list first; the node right after <code>p</code> is then the <em>last</em> node of the reversed rest, so hang <code>p</code> behind it: <code>p.next.next = p; p.next = null;</code>.</p>
<table>
<thead><tr><th>Moment (list A → B → C)</th><th>Links</th><th>Returned</th></tr></thead>
<tbody>
<tr><td>reverse(C): one node — base case</td><td>A → B → C</td><td>C</td></tr>
<tr><td>back in reverse(B): <code>B.next.next = B; B.next = null;</code></td><td>A → B ← C</td><td>C</td></tr>
<tr><td>back in reverse(A): <code>A.next.next = A; A.next = null;</code></td><td>A ← B ← C</td><td>C = the new head</td></tr>
</tbody>
</table>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info; Node next;
    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }

    // f2a: the cars from the last to the first - non-tail recursion
    String backwards(Node p) {
        if (p == null) return "";
        String rest = backwards(p.next);                 // first the rest of the list...
        return rest + p.info + " ";                      // ...then this car
    }

    // f2b: reverse the links recursively; returns the new first node
    Node reverse(Node p) {
        if (p == null || p.next == null) return p;       // 0 or 1 node: already reversed
        Node newHead = reverse(p.next);                  // reverse the rest
        p.next.next = p;                                 // the old second node points back to p
        p.next = null;                                   // p is now the last node
        return newHead;
    }

    void reverse() {
        tail = head;                                     // the old head becomes the tail
        head = reverse(head);
    }
}

public class Pe2ReverseList {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String data) {
        MyList t = new MyList();
        for (String w : data.split(" ")) if (!w.isEmpty()) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("A1 B2 C3");
        check("backwards, list unchanged", t.backwards(t.head).trim() + " | " + t.traverse(), "(C,3) (B,2) (A,1) | (A,1) (B,2) (C,3)");
        t.reverse();
        check("reverse 3 nodes", t.traverse(), "(C,3) (B,2) (A,1)");
        check("head, tail, tail.next", t.head.info + " " + t.tail.info + " " + t.tail.next, "(C,3) (A,1) null");
        MyList one = make("A1");
        one.reverse();
        check("one node", one.traverse() + " tail=" + one.tail.info, "(A,1) tail=(A,1)");
        MyList e = make("");
        e.reverse();
        check("empty list stays empty", String.valueOf(e.head == null &amp;&amp; e.tail == null), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS backwards, list unchanged<br>
PASS reverse 3 nodes<br>
PASS head, tail, tail.next<br>
PASS one node<br>
PASS empty list stays empty<br>
ALL TESTS PASSED</div>
<div class="pitfall">Forgetting <code>p.next = null</code> leaves the old first node pointing at the second while the second points back at it — a two-node cycle, and the next <code>traverse()</code> never ends. Also set <code>tail = head</code> <em>before</em> reversing: afterwards the old head is no longer easy to reach.</div>`,
    `<h3>🧪 Bài 2 — f2: in ngược, rồi đảo ngược danh sách bằng đệ quy (kiểu PE + phỏng vấn · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>(a) <code>backwards(p)</code> trả về các xe từ cuối về đầu <strong>mà không làm thay đổi danh sách</strong>. (b) <code>reverse()</code> đảo ngược chính các liên kết, bằng đệ quy, và để <code>head</code>, <code>tail</code> đúng sau khi đảo. Không tạo nút mới.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>A 1, B 2, C 3 → backwards: (C,3) (B,2) (A,1), còn danh sách vẫn là (A,1) (B,2) (C,3); sau reverse(): (C,3) (B,2) (A,1) với head = (C,3), tail = (A,1), tail.next = null. Danh sách một xe giữ nguyên; danh sách rỗng vẫn rỗng.</p>
<p class="nhan">Ý tưởng</p>
<p>(a) là khuôn đệ quy không đuôi (non-tail recursion) của slide 13: gọi đệ quy trước, thêm nút này sau. (b) đảo phần còn lại của danh sách trước; khi đó nút đứng ngay sau <code>p</code> chính là nút <em>cuối</em> của phần đã đảo, nên treo <code>p</code> vào sau nó: <code>p.next.next = p; p.next = null;</code>.</p>
<table>
<thead><tr><th>Thời điểm (danh sách A → B → C)</th><th>Các liên kết</th><th>Trả về</th></tr></thead>
<tbody>
<tr><td>reverse(C): một nút — trường hợp cơ sở</td><td>A → B → C</td><td>C</td></tr>
<tr><td>quay về reverse(B): <code>B.next.next = B; B.next = null;</code></td><td>A → B ← C</td><td>C</td></tr>
<tr><td>quay về reverse(A): <code>A.next.next = A; A.next = null;</code></td><td>A ← B ← C</td><td>C = head mới</td></tr>
</tbody>
</table>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info; Node next;
    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }

    // f2a: các xe từ cuối về đầu - đệ quy không đuôi
    String backwards(Node p) {
        if (p == null) return "";
        String rest = backwards(p.next);                 // trước hết là phần còn lại...
        return rest + p.info + " ";                      // ...rồi mới tới xe này
    }

    // f2b: đảo liên kết bằng đệ quy; trả về nút đầu mới
    Node reverse(Node p) {
        if (p == null || p.next == null) return p;       // 0 hoặc 1 nút: coi như đã đảo
        Node newHead = reverse(p.next);                  // đảo phần còn lại
        p.next.next = p;                                 // nút thứ hai cũ trỏ ngược về p
        p.next = null;                                   // p giờ là nút cuối
        return newHead;
    }

    void reverse() {
        tail = head;                                     // head cũ thành tail
        head = reverse(head);
    }
}

public class Pe2ReverseList {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String data) {
        MyList t = new MyList();
        for (String w : data.split(" ")) if (!w.isEmpty()) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("A1 B2 C3");
        check("backwards, list unchanged", t.backwards(t.head).trim() + " | " + t.traverse(), "(C,3) (B,2) (A,1) | (A,1) (B,2) (C,3)");
        t.reverse();
        check("reverse 3 nodes", t.traverse(), "(C,3) (B,2) (A,1)");
        check("head, tail, tail.next", t.head.info + " " + t.tail.info + " " + t.tail.next, "(C,3) (A,1) null");
        MyList one = make("A1");
        one.reverse();
        check("one node", one.traverse() + " tail=" + one.tail.info, "(A,1) tail=(A,1)");
        MyList e = make("");
        e.reverse();
        check("empty list stays empty", String.valueOf(e.head == null &amp;&amp; e.tail == null), "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS backwards, list unchanged<br>
PASS reverse 3 nodes<br>
PASS head, tail, tail.next<br>
PASS one node<br>
PASS empty list stays empty<br>
ALL TESTS PASSED</div>
<div class="pitfall">Quên <code>p.next = null</code> thì nút đầu cũ vẫn trỏ tới nút thứ hai trong khi nút thứ hai trỏ ngược về nó — một vòng hai nút, và lần <code>traverse()</code> kế tiếp chạy mãi không dừng. Ngoài ra phải gán <code>tail = head</code> <em>trước</em> khi đảo: đảo xong thì head cũ không còn dễ tìm.</div>`),
    bi(`<h3>🧪 Exercise 3 — f3: binary search, recursive and then as a loop (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Books <code>Book(title, price)</code> are stored in an array sorted by price. Write the recursive <code>search(a, price, lo, hi)</code> that returns the index of a book with that price, or −1. Then eliminate the tail recursion: write <code>searchLoop(a, price)</code> with a <code>while</code> loop and no recursive call.</p>
<p class="nhan">Data → expected result</p>
<p>prices 12 15 20 27 31 40 46 58 → search(27) = 3, search(16) = −1; a price that is in the array is found in at most ⌊log₂ 8⌋ + 1 = 4 calls.</p>
<p class="nhan">Idea</p>
<p>both recursive calls are tail calls — their result is returned unchanged — so the loop version only changes <code>lo</code> or <code>hi</code> and goes round again, exactly as in Goodrich §5.6. Every step halves the range: O(log n) time; the recursion also needs O(log n) stack, the loop O(1).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Book {
    String title;
    int price;

    Book(String title, int price) { this.title = title; this.price = price; }
}

public class Pe3BinarySearch {
    static int calls;

    // f3: index of a book with this price in a[lo..hi] (sorted by price), or -1
    static int search(Book[] a, int price, int lo, int hi) {
        calls++;
        if (lo &gt; hi) return -1;                          // empty range: not found
        int mid = (lo + hi) / 2;
        if (a[mid].price == price) return mid;
        if (price &lt; a[mid].price) return search(a, price, lo, mid - 1);    // tail call
        return search(a, price, mid + 1, hi);                               // tail call
    }

    // The same method with the tail recursion eliminated: the call becomes "change lo/hi, loop again".
    static int searchLoop(Book[] a, int price) {
        int lo = 0, hi = a.length - 1;
        while (lo &lt;= hi) {
            int mid = (lo + hi) / 2;
            if (a[mid].price == price) return mid;
            if (price &lt; a[mid].price) hi = mid - 1; else lo = mid + 1;
        }
        return -1;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] p = {12, 15, 20, 27, 31, 40, 46, 58};
        Book[] a = new Book[p.length];
        for (int i = 0; i &lt; p.length; i++) a[i] = new Book("B" + (i + 1), p[i]);
        StringBuilder found = new StringBuilder();
        int maxCalls = 0;
        for (int i = 0; i &lt; p.length; i++) {
            calls = 0;
            found.append(search(a, p[i], 0, a.length - 1)).append(' ');
            maxCalls = Math.max(maxCalls, calls);
        }
        check("each of the 8 prices is found at its index", found.toString().trim(), "0 1 2 3 4 5 6 7");
        check("absent 10, 16, 60 -&gt; -1", search(a, 10, 0, 7) + " " + search(a, 16, 0, 7) + " " + search(a, 60, 0, 7), "-1 -1 -1");
        check("a hit needs at most 4 calls for n = 8", "" + maxCalls, "4");
        boolean same = true;
        for (int x = 0; x &lt;= 60; x++) same &amp;= search(a, x, 0, a.length - 1) == searchLoop(a, x);
        check("loop version agrees for every price 0..60", "" + same, "true");
        check("empty array -&gt; -1", search(new Book[0], 12, 0, -1) + " " + searchLoop(new Book[0], 12), "-1 -1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS each of the 8 prices is found at its index<br>
PASS absent 10, 16, 60 -&gt; -1<br>
PASS a hit needs at most 4 calls for n = 8<br>
PASS loop version agrees for every price 0..60<br>
PASS empty array -&gt; -1<br>
ALL TESTS PASSED</div>
<div class="pitfall">Writing <code>search(a, price, mid, hi)</code> instead of <code>mid + 1</code>: when <code>hi = lo + 1</code> and the price is larger than <code>a[lo]</code>, <code>mid == lo</code> and the range never shrinks → <code>StackOverflowError</code> (the loop version hangs forever). Every call must exclude <code>mid</code>. And binary search is <strong>linear</strong> recursion (slide 11), not binary recursion.</div>`,
    `<h3>🧪 Bài 3 — f3: tìm kiếm nhị phân bằng đệ quy, rồi viết lại bằng vòng lặp (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Các cuốn sách <code>Book(title, price)</code> nằm trong một mảng đã sắp theo giá. Viết hàm đệ quy <code>search(a, price, lo, hi)</code> trả về chỉ số một cuốn có giá đó, hoặc −1. Sau đó khử đệ quy đuôi (eliminate tail recursion): viết <code>searchLoop(a, price)</code> bằng vòng <code>while</code>, không có lời gọi đệ quy nào.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>giá 12 15 20 27 31 40 46 58 → search(27) = 3, search(16) = −1; một giá có trong mảng được tìm thấy sau nhiều nhất ⌊log₂ 8⌋ + 1 = 4 lời gọi.</p>
<p class="nhan">Ý tưởng</p>
<p>cả hai lời gọi đệ quy đều là lời gọi đuôi (tail call) — kết quả của chúng được trả về nguyên xi — nên bản vòng lặp chỉ việc đổi <code>lo</code> hoặc <code>hi</code> rồi lặp lại, đúng như Goodrich §5.6. Mỗi bước cắt đôi đoạn tìm: O(log n) thời gian; bản đệ quy còn tốn O(log n) ngăn xếp (stack), bản vòng lặp chỉ O(1).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Book {
    String title;
    int price;

    Book(String title, int price) { this.title = title; this.price = price; }
}

public class Pe3BinarySearch {
    static int calls;

    // f3: chỉ số một cuốn có giá này trong a[lo..hi] (đã sắp theo giá), hoặc -1
    static int search(Book[] a, int price, int lo, int hi) {
        calls++;
        if (lo &gt; hi) return -1;                          // đoạn rỗng: không có
        int mid = (lo + hi) / 2;
        if (a[mid].price == price) return mid;
        if (price &lt; a[mid].price) return search(a, price, lo, mid - 1);    // lời gọi đuôi
        return search(a, price, mid + 1, hi);                               // lời gọi đuôi
    }

    // Cùng phương thức nhưng đã khử đệ quy đuôi: lời gọi thành "đổi lo/hi, lặp lại".
    static int searchLoop(Book[] a, int price) {
        int lo = 0, hi = a.length - 1;
        while (lo &lt;= hi) {
            int mid = (lo + hi) / 2;
            if (a[mid].price == price) return mid;
            if (price &lt; a[mid].price) hi = mid - 1; else lo = mid + 1;
        }
        return -1;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] p = {12, 15, 20, 27, 31, 40, 46, 58};
        Book[] a = new Book[p.length];
        for (int i = 0; i &lt; p.length; i++) a[i] = new Book("B" + (i + 1), p[i]);
        StringBuilder found = new StringBuilder();
        int maxCalls = 0;
        for (int i = 0; i &lt; p.length; i++) {
            calls = 0;
            found.append(search(a, p[i], 0, a.length - 1)).append(' ');
            maxCalls = Math.max(maxCalls, calls);
        }
        check("each of the 8 prices is found at its index", found.toString().trim(), "0 1 2 3 4 5 6 7");
        check("absent 10, 16, 60 -&gt; -1", search(a, 10, 0, 7) + " " + search(a, 16, 0, 7) + " " + search(a, 60, 0, 7), "-1 -1 -1");
        check("a hit needs at most 4 calls for n = 8", "" + maxCalls, "4");
        boolean same = true;
        for (int x = 0; x &lt;= 60; x++) same &amp;= search(a, x, 0, a.length - 1) == searchLoop(a, x);
        check("loop version agrees for every price 0..60", "" + same, "true");
        check("empty array -&gt; -1", search(new Book[0], 12, 0, -1) + " " + searchLoop(new Book[0], 12), "-1 -1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS each of the 8 prices is found at its index<br>
PASS absent 10, 16, 60 -&gt; -1<br>
PASS a hit needs at most 4 calls for n = 8<br>
PASS loop version agrees for every price 0..60<br>
PASS empty array -&gt; -1<br>
ALL TESTS PASSED</div>
<div class="pitfall">Viết <code>search(a, price, mid, hi)</code> thay vì <code>mid + 1</code>: khi <code>hi = lo + 1</code> và giá cần tìm lớn hơn <code>a[lo]</code> thì <code>mid == lo</code>, đoạn tìm không bao giờ nhỏ lại → <code>StackOverflowError</code> (bản vòng lặp thì treo mãi). Mỗi lời gọi phải loại <code>mid</code> ra. Và tìm kiếm nhị phân là đệ quy <strong>tuyến tính</strong> (linear recursion, slide 11), không phải đệ quy nhị phân.</div>`),
    bi(`<h3>🧪 Exercise 4 — fast power and base conversion (interview · ~15 min)</h3>
<p class="nhan">Task</p>
<p>(a) <code>power(x, n)</code> computes xⁿ (n ≥ 0) with O(log n) multiplications. (b) <code>toBase(n, b)</code> writes n ≥ 0 in base b (2 to 16, digits 0–9 then A–F). (c) Check that <code>hanoiMoves(n)</code>, computed from M(n) = 2·M(n − 1) + 1, equals <code>power(2, n) − 1</code>.</p>
<p class="nhan">Data → expected result</p>
<p>power(2, 10) = 1024, power(3, 0) = 1, power(3, 30) = 205891132094649 after 9 multiplications; toBase(13, 2) = 1101, toBase(255, 16) = FF, toBase(100, 8) = 144, toBase(0, 2) = 0; hanoiMoves(n) = 2ⁿ − 1 for n = 1..40.</p>
<p class="nhan">Idea</p>
<p>(a) xⁿ = (x^(n/2))², times x once more when n is odd — n halves at every level. (b) is the <code>DecToBin</code> of slide 6 for any base: first the digits of n / b, then the digit n % b.</p>
<table>
<thead><tr><th>Call</th><th>Work after the inner call returns</th><th>Multiplications</th></tr></thead>
<tbody>
<tr><td>power(3, 30)</td><td>square power(3, 15)</td><td>1</td></tr>
<tr><td>power(3, 15)</td><td>square power(3, 7), then × 3 (15 is odd)</td><td>2</td></tr>
<tr><td>power(3, 7)</td><td>square power(3, 3), then × 3</td><td>2</td></tr>
<tr><td>power(3, 3)</td><td>square power(3, 1), then × 3</td><td>2</td></tr>
<tr><td>power(3, 1)</td><td>square power(3, 0) = 1, then × 3</td><td>2</td></tr>
<tr><td>power(3, 0)</td><td>base case: return 1</td><td>0</td></tr>
</tbody>
</table>
<p>9 multiplications in total — the test checks it — against 29 for a simple loop.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">public class Pe4PowerBase {
    static int mults;                                    // multiplications done by power()

    // x^n with O(log n) multiplications: x^n = (x^(n/2))^2, times x once more if n is odd
    static long power(long x, int n) {
        if (n == 0) return 1;
        long half = power(x, n / 2);                     // ONE recursive call, its result used twice
        long r = half * half;
        mults++;
        if (n % 2 == 1) { r = r * x; mults++; }
        return r;
    }

    // n (n &gt;= 0) written in base b (2..16): the digits of n / b, then the last digit
    static String toBase(int n, int b) {
        String digits = "0123456789ABCDEF";
        if (n &lt; b) return "" + digits.charAt(n);         // one digit: base case
        return toBase(n / b, b) + digits.charAt(n % b);
    }

    static long hanoiMoves(int n) {                      // M(0) = 0, M(n) = 2 M(n-1) + 1
        return n == 0 ? 0 : 2 * hanoiMoves(n - 1) + 1;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("2^10, 3^0, 5^3", power(2, 10) + " " + power(3, 0) + " " + power(5, 3), "1024 1 125");
        check("7^13 and 2^62", power(7, 13) + " " + power(2, 62), "96889010407 4611686018427387904");
        mults = 0;
        long v = power(3, 30);
        check("3^30 with 9 multiplications (a loop needs 29)", v + " / " + mults, "205891132094649 / 9");
        check("13 -&gt; base 2, 255 -&gt; 16, 100 -&gt; 8, 0 -&gt; 2", toBase(13, 2) + " " + toBase(255, 16) + " " + toBase(100, 8) + " " + toBase(0, 2), "1101 FF 144 0");
        boolean same = true;
        for (int b = 2; b &lt;= 16; b++)
            for (int n = 0; n &lt;= 300; n++) same &amp;= toBase(n, b).equals(Integer.toString(n, b).toUpperCase());
        check("toBase = Integer.toString for n 0..300, bases 2..16", "" + same, "true");
        boolean h = true;
        for (int n = 1; n &lt;= 40; n++) h &amp;= hanoiMoves(n) == power(2, n) - 1;
        check("hanoiMoves(n) = 2^n - 1 for n = 1..40", "" + h, "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 2^10, 3^0, 5^3<br>
PASS 7^13 and 2^62<br>
PASS 3^30 with 9 multiplications (a loop needs 29)<br>
PASS 13 -&gt; base 2, 255 -&gt; 16, 100 -&gt; 8, 0 -&gt; 2<br>
PASS toBase = Integer.toString for n 0..300, bases 2..16<br>
PASS hanoiMoves(n) = 2^n - 1 for n = 1..40<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>return power(x, n/2) * power(x, n/2);</code> looks equivalent but makes <strong>two</strong> recursive calls per level: the call tree doubles at every level and the work grows back to about n multiplications. Store the half result in a variable and use it twice. Also, <code>long</code> overflows silently past 2⁶³ − 1.</div>`,
    `<h3>🧪 Bài 4 — lũy thừa nhanh và đổi cơ số (phỏng vấn · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>(a) <code>power(x, n)</code> tính xⁿ (n ≥ 0) với O(log n) phép nhân. (b) <code>toBase(n, b)</code> viết n ≥ 0 trong cơ số b (từ 2 tới 16, chữ số 0–9 rồi A–F). (c) Kiểm tra rằng <code>hanoiMoves(n)</code>, tính theo M(n) = 2·M(n − 1) + 1, bằng <code>power(2, n) − 1</code>.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>power(2, 10) = 1024, power(3, 0) = 1, power(3, 30) = 205891132094649 sau 9 phép nhân; toBase(13, 2) = 1101, toBase(255, 16) = FF, toBase(100, 8) = 144, toBase(0, 2) = 0; hanoiMoves(n) = 2ⁿ − 1 với n = 1..40.</p>
<p class="nhan">Ý tưởng</p>
<p>(a) xⁿ = (x^(n/2))², nhân thêm x một lần nếu n lẻ — n giảm một nửa sau mỗi tầng. (b) chính là <code>DecToBin</code> của slide 6 cho cơ số bất kỳ: trước hết là các chữ số của n / b, rồi tới chữ số n % b.</p>
<table>
<thead><tr><th>Lời gọi</th><th>Việc làm sau khi lời gọi bên trong trả về</th><th>Số phép nhân</th></tr></thead>
<tbody>
<tr><td>power(3, 30)</td><td>bình phương power(3, 15)</td><td>1</td></tr>
<tr><td>power(3, 15)</td><td>bình phương power(3, 7), rồi × 3 (15 lẻ)</td><td>2</td></tr>
<tr><td>power(3, 7)</td><td>bình phương power(3, 3), rồi × 3</td><td>2</td></tr>
<tr><td>power(3, 3)</td><td>bình phương power(3, 1), rồi × 3</td><td>2</td></tr>
<tr><td>power(3, 1)</td><td>bình phương power(3, 0) = 1, rồi × 3</td><td>2</td></tr>
<tr><td>power(3, 0)</td><td>trường hợp cơ sở: trả về 1</td><td>0</td></tr>
</tbody>
</table>
<p>Tổng cộng 9 phép nhân — test có kiểm con số này — so với 29 phép nhân của một vòng lặp đơn giản.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">public class Pe4PowerBase {
    static int mults;                                    // số phép nhân power() đã làm

    // x^n với O(log n) phép nhân: x^n = (x^(n/2))^2, nhân thêm x nếu n lẻ
    static long power(long x, int n) {
        if (n == 0) return 1;
        long half = power(x, n / 2);                     // MỘT lời gọi đệ quy, kết quả dùng hai lần
        long r = half * half;
        mults++;
        if (n % 2 == 1) { r = r * x; mults++; }
        return r;
    }

    // n (n &gt;= 0) viết trong cơ số b (2..16): các chữ số của n / b, rồi chữ số cuối
    static String toBase(int n, int b) {
        String digits = "0123456789ABCDEF";
        if (n &lt; b) return "" + digits.charAt(n);         // một chữ số: trường hợp cơ sở
        return toBase(n / b, b) + digits.charAt(n % b);
    }

    static long hanoiMoves(int n) {                      // M(0) = 0, M(n) = 2 M(n-1) + 1
        return n == 0 ? 0 : 2 * hanoiMoves(n - 1) + 1;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("2^10, 3^0, 5^3", power(2, 10) + " " + power(3, 0) + " " + power(5, 3), "1024 1 125");
        check("7^13 and 2^62", power(7, 13) + " " + power(2, 62), "96889010407 4611686018427387904");
        mults = 0;
        long v = power(3, 30);
        check("3^30 with 9 multiplications (a loop needs 29)", v + " / " + mults, "205891132094649 / 9");
        check("13 -&gt; base 2, 255 -&gt; 16, 100 -&gt; 8, 0 -&gt; 2", toBase(13, 2) + " " + toBase(255, 16) + " " + toBase(100, 8) + " " + toBase(0, 2), "1101 FF 144 0");
        boolean same = true;
        for (int b = 2; b &lt;= 16; b++)
            for (int n = 0; n &lt;= 300; n++) same &amp;= toBase(n, b).equals(Integer.toString(n, b).toUpperCase());
        check("toBase = Integer.toString for n 0..300, bases 2..16", "" + same, "true");
        boolean h = true;
        for (int n = 1; n &lt;= 40; n++) h &amp;= hanoiMoves(n) == power(2, n) - 1;
        check("hanoiMoves(n) = 2^n - 1 for n = 1..40", "" + h, "true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 2^10, 3^0, 5^3<br>
PASS 7^13 and 2^62<br>
PASS 3^30 with 9 multiplications (a loop needs 29)<br>
PASS 13 -&gt; base 2, 255 -&gt; 16, 100 -&gt; 8, 0 -&gt; 2<br>
PASS toBase = Integer.toString for n 0..300, bases 2..16<br>
PASS hanoiMoves(n) = 2^n - 1 for n = 1..40<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>return power(x, n/2) * power(x, n/2);</code> trông tương đương nhưng mỗi tầng có <strong>hai</strong> lời gọi đệ quy: cây lời gọi (call tree) nhân đôi sau mỗi tầng và khối lượng công việc quay về cỡ n phép nhân. Hãy cất kết quả một nửa vào biến rồi dùng hai lần. Ngoài ra <code>long</code> tràn số (overflow) âm thầm khi vượt 2⁶³ − 1.</div>`),
    bi(`<h3>🧪 Exercise 5 — backtracking: all subsets and all permutations (interview · ~20 min)</h3>
<p class="nhan">Task</p>
<p>(a) <code>subsets(s, i, cur, out)</code> adds every subset of the letters of s to <code>out</code> — for "abc" in the order {abc}, {ab}, {ac}, {a}, {bc}, {b}, {c}, {}. (b) <code>perms(s, cur, used, out)</code> adds every permutation of s to <code>out</code>, in the order abc, acb, bac, bca, cab, cba.</p>
<p class="nhan">Idea</p>
<p>backtracking = make one decision, recurse on the rest, then undo the decision and try the next one. (a) Letter i has two decisions — take it or skip it — so the call tree is binary, with 2ⁿ leaves. (b) The next position can take any unused letter: n choices, then n − 1, … → n! leaves. Mark the letter as used before the call and unmark it after: that "un-choose" is the backtrack.</p>
<pre><code class="language-plaintext">subsets("abc") - each level decides one letter
""
├── take a: "a"
│   ├── take b: "ab"
│   │   ├── take c: "abc"  -&gt; {abc}
│   │   └── skip c: "ab"   -&gt; {ab}
│   └── skip b: "a"
│       ├── take c: "ac"   -&gt; {ac}
│       └── skip c: "a"    -&gt; {a}
└── skip a: ""
    ├── take b: "b"
    │   ├── take c: "bc"   -&gt; {bc}
    │   └── skip c: "b"    -&gt; {b}
    └── skip b: ""
        ├── take c: "c"    -&gt; {c}
        └── skip c: ""     -&gt; {}</code></pre>
<p><strong>Cost:</strong> subsets make 2ⁿ⁺¹ − 1 calls and build 2ⁿ strings of length up to n → O(n·2ⁿ); permutations reach n! leaves → O(n·n!). The depth is only n, so the time, not the stack, is the limit.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

public class Pe5Backtracking {
    // All subsets of s: for s[i], first TAKE it, then SKIP it - 2 calls per activation
    static void subsets(String s, int i, String cur, List&lt;String&gt; out) {
        if (i == s.length()) {                           // every letter decided: one subset
            out.add("{" + cur + "}");
            return;
        }
        subsets(s, i + 1, cur + s.charAt(i), out);       // take s[i]
        subsets(s, i + 1, cur, out);                     // skip s[i]
    }

    // All permutations: choose an unused letter, explore, then UN-choose it (backtrack)
    static void perms(String s, String cur, boolean[] used, List&lt;String&gt; out) {
        if (cur.length() == s.length()) {
            out.add(cur);
            return;
        }
        for (int i = 0; i &lt; s.length(); i++) {
            if (used[i]) continue;
            used[i] = true;                              // choose
            perms(s, cur + s.charAt(i), used, out);      // explore
            used[i] = false;                             // un-choose
        }
    }

    static List&lt;String&gt; subsetsOf(String s) { List&lt;String&gt; r = new ArrayList&lt;String&gt;(); subsets(s, 0, "", r); return r; }

    static List&lt;String&gt; permsOf(String s) { List&lt;String&gt; r = new ArrayList&lt;String&gt;(); perms(s, "", new boolean[s.length()], r); return r; }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("subsets of abc (take before skip)", subsetsOf("abc").toString(), "[{abc}, {ab}, {ac}, {a}, {bc}, {b}, {c}, {}]");
        check("abcd has 2^4 = 16 subsets", "" + subsetsOf("abcd").size(), "16");
        check("permutations of abc", permsOf("abc").toString(), "[abc, acb, bac, bca, cab, cba]");
        check("abcd has 4! = 24 permutations", "" + permsOf("abcd").size(), "24");
        check("aab: 6 permutations, only 3 distinct", permsOf("aab").size() + " " + new TreeSet&lt;String&gt;(permsOf("aab")), "6 [aab, aba, baa]");
        check("empty string: one subset {}, one (empty) permutation", subsetsOf("") + " " + permsOf("").size(), "[{}] 1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS subsets of abc (take before skip)<br>
PASS abcd has 2^4 = 16 subsets<br>
PASS permutations of abc<br>
PASS abcd has 4! = 24 permutations<br>
PASS aab: 6 permutations, only 3 distinct<br>
PASS empty string: one subset {}, one (empty) permutation<br>
ALL TESTS PASSED</div>
<div class="pitfall">Forgetting <code>used[i] = false;</code> after the recursive call leaves the letter marked for ever: the first permutation comes out and then nothing else. And with repeated letters ("aab") plain backtracking produces duplicates — 6 strings, only 3 different; collect them in a <code>TreeSet</code> or skip equal letters at the same level.</div>`,
    `<h3>🧪 Bài 5 — quay lui: sinh mọi tập con và mọi hoán vị (phỏng vấn · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>(a) <code>subsets(s, i, cur, out)</code> thêm mọi tập con (subset) của các chữ cái trong s vào <code>out</code> — với "abc" theo thứ tự {abc}, {ab}, {ac}, {a}, {bc}, {b}, {c}, {}. (b) <code>perms(s, cur, used, out)</code> thêm mọi hoán vị (permutation) của s vào <code>out</code>, theo thứ tự abc, acb, bac, bca, cab, cba.</p>
<p class="nhan">Ý tưởng</p>
<p>quay lui (backtracking) = đưa ra một quyết định, đệ quy cho phần còn lại, rồi huỷ quyết định đó và thử quyết định tiếp theo. (a) Với chữ thứ i có hai quyết định — lấy hoặc bỏ — nên cây lời gọi là cây nhị phân, có 2ⁿ lá. (b) Vị trí tiếp theo nhận được mọi chữ chưa dùng: n lựa chọn, rồi n − 1, … → n! lá. Đánh dấu chữ là đã dùng trước lời gọi và bỏ đánh dấu sau lời gọi: bước "bỏ chọn" đó chính là quay lui.</p>
<pre><code class="language-plaintext">subsets("abc") - mỗi tầng quyết định một chữ (lấy / bỏ)
""
├── lấy a: "a"
│   ├── lấy b: "ab"
│   │   ├── lấy c: "abc"  -&gt; {abc}
│   │   └── bỏ c:  "ab"   -&gt; {ab}
│   └── bỏ b: "a"
│       ├── lấy c: "ac"   -&gt; {ac}
│       └── bỏ c:  "a"    -&gt; {a}
└── bỏ a: ""
    ├── lấy b: "b"
    │   ├── lấy c: "bc"   -&gt; {bc}
    │   └── bỏ c:  "b"    -&gt; {b}
    └── bỏ b: ""
        ├── lấy c: "c"    -&gt; {c}
        └── bỏ c:  ""     -&gt; {}</code></pre>
<p><strong>Chi phí:</strong> sinh tập con tốn 2ⁿ⁺¹ − 1 lời gọi và dựng 2ⁿ chuỗi dài tới n → O(n·2ⁿ); sinh hoán vị đi tới n! lá → O(n·n!). Độ sâu chỉ là n, nên giới hạn nằm ở thời gian chứ không ở ngăn xếp (stack).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

public class Pe5Backtracking {
    // Mọi tập con của s: với s[i], trước LẤY rồi BỎ - 2 lời gọi mỗi lần kích hoạt
    static void subsets(String s, int i, String cur, List&lt;String&gt; out) {
        if (i == s.length()) {                           // đã quyết xong mọi chữ: một tập con
            out.add("{" + cur + "}");
            return;
        }
        subsets(s, i + 1, cur + s.charAt(i), out);       // lấy s[i]
        subsets(s, i + 1, cur, out);                     // bỏ s[i]
    }

    // Mọi hoán vị: chọn một chữ chưa dùng, đi tiếp, rồi BỎ CHỌN (quay lui)
    static void perms(String s, String cur, boolean[] used, List&lt;String&gt; out) {
        if (cur.length() == s.length()) {
            out.add(cur);
            return;
        }
        for (int i = 0; i &lt; s.length(); i++) {
            if (used[i]) continue;
            used[i] = true;                              // chọn
            perms(s, cur + s.charAt(i), used, out);      // đi tiếp
            used[i] = false;                             // bỏ chọn
        }
    }

    static List&lt;String&gt; subsetsOf(String s) { List&lt;String&gt; r = new ArrayList&lt;String&gt;(); subsets(s, 0, "", r); return r; }

    static List&lt;String&gt; permsOf(String s) { List&lt;String&gt; r = new ArrayList&lt;String&gt;(); perms(s, "", new boolean[s.length()], r); return r; }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("subsets of abc (take before skip)", subsetsOf("abc").toString(), "[{abc}, {ab}, {ac}, {a}, {bc}, {b}, {c}, {}]");
        check("abcd has 2^4 = 16 subsets", "" + subsetsOf("abcd").size(), "16");
        check("permutations of abc", permsOf("abc").toString(), "[abc, acb, bac, bca, cab, cba]");
        check("abcd has 4! = 24 permutations", "" + permsOf("abcd").size(), "24");
        check("aab: 6 permutations, only 3 distinct", permsOf("aab").size() + " " + new TreeSet&lt;String&gt;(permsOf("aab")), "6 [aab, aba, baa]");
        check("empty string: one subset {}, one (empty) permutation", subsetsOf("") + " " + permsOf("").size(), "[{}] 1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS subsets of abc (take before skip)<br>
PASS abcd has 2^4 = 16 subsets<br>
PASS permutations of abc<br>
PASS abcd has 4! = 24 permutations<br>
PASS aab: 6 permutations, only 3 distinct<br>
PASS empty string: one subset {}, one (empty) permutation<br>
ALL TESTS PASSED</div>
<div class="pitfall">Quên <code>used[i] = false;</code> sau lời gọi đệ quy thì chữ đó bị đánh dấu mãi mãi: hoán vị đầu tiên ra được, rồi không còn gì nữa. Còn khi có chữ lặp ("aab"), quay lui thông thường sinh ra bản trùng — 6 chuỗi nhưng chỉ 3 chuỗi khác nhau; hãy gom vào <code>TreeSet</code> hoặc bỏ qua các chữ giống nhau ở cùng một tầng.</div>`),
    bi(`<h3>🧪 Exercise 6 — a grid: count the paths, then flood-fill a region (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>A grid of '.' (free) and '#' (wall). (a) <code>countPaths(g)</code>: how many paths lead from the top-left to the bottom-right cell, moving only right or down and never through '#'? (b) <code>fill(g, r, c)</code>: how many '.' cells are connected to (r, c) through up/down/left/right moves? Cells already counted are marked 'x'. Then use <code>fill</code> to count the regions of a grid.</p>
<p class="nhan">Data → expected result</p>
<pre><code class="language-plaintext">..#..      region of (0,0): 3 cells
.##.#      region of (0,3): 7 cells
#...#      regions in total: 2
##.##</code></pre>
<p class="nhan">Idea</p>
<p>(a) paths(r, c) = paths(r + 1, c) + paths(r, c + 1); base cases: outside the grid or on a wall → 0, on the goal → 1. The same cell is reached along many routes, so store each answer in <code>memo[r][c]</code> (slide 18): without the memo the 16×16 test would make almost 900 million calls; with it, a few hundred. (b) Mark the cell, then add the four neighbours — multiple recursion with 4 calls, O(R·C) in total because every cell is filled at most once.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">public class Pe6Grid {
    // Paths from (r,c) to the bottom-right cell moving only right or down, avoiding '#'.
    static long paths(char[][] g, int r, int c, long[][] memo) {
        if (r &gt;= g.length || c &gt;= g[0].length || g[r][c] == '#') return 0;   // off the grid or blocked
        if (r == g.length - 1 &amp;&amp; c == g[0].length - 1) return 1;              // at the goal
        if (memo[r][c] &gt;= 0) return memo[r][c];                               // solved before
        memo[r][c] = paths(g, r + 1, c, memo) + paths(g, r, c + 1, memo);
        return memo[r][c];
    }

    static long countPaths(char[][] g) {
        long[][] memo = new long[g.length][g[0].length];
        for (long[] row : memo) java.util.Arrays.fill(row, -1);
        return paths(g, 0, 0, memo);
    }

    // Flood fill: size of the region of '.' cells connected to (r,c) in 4 directions.
    static int fill(char[][] g, int r, int c) {
        if (r &lt; 0 || r &gt;= g.length || c &lt; 0 || c &gt;= g[0].length || g[r][c] != '.') return 0;
        g[r][c] = 'x';                                   // mark BEFORE the 4 calls
        return 1 + fill(g, r + 1, c) + fill(g, r - 1, c) + fill(g, r, c + 1) + fill(g, r, c - 1);
    }

    static char[][] grid(String... rows) {
        char[][] g = new char[rows.length][];
        for (int i = 0; i &lt; rows.length; i++) g[i] = rows[i].toCharArray();
        return g;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("3x3 open grid: 6 paths", "" + countPaths(grid("...", "...", "...")), "6");
        check("3x3, centre blocked: 2 paths", "" + countPaths(grid("...", ".#.", "...")), "2");
        check("blocked start: 0 paths", "" + countPaths(grid("#..", "...", "...")), "0");
        char[][] big = new char[16][16];
        for (char[] row : big) java.util.Arrays.fill(row, '.');
        check("16x16 open grid: C(30,15) paths", "" + countPaths(big), "155117520");
        char[][] g = grid("..#..", ".##.#", "#...#", "##.##");
        check("region at (0,0) = 3, region at (0,3) = 7", fill(g, 0, 0) + " " + fill(g, 0, 3), "3 7");
        check("a wall or a visited cell counts 0", fill(g, 1, 1) + " " + fill(g, 0, 0), "0 0");
        char[][] h = grid("..#..", ".##.#", "#...#", "##.##");
        int regions = 0;
        for (int r = 0; r &lt; h.length; r++)
            for (int c = 0; c &lt; h[0].length; c++) if (fill(h, r, c) &gt; 0) regions++;
        check("number of regions = 2", "" + regions, "2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 3x3 open grid: 6 paths<br>
PASS 3x3, centre blocked: 2 paths<br>
PASS blocked start: 0 paths<br>
PASS 16x16 open grid: C(30,15) paths<br>
PASS region at (0,0) = 3, region at (0,3) = 7<br>
PASS a wall or a visited cell counts 0<br>
PASS number of regions = 2<br>
ALL TESTS PASSED</div>
<div class="pitfall">In <code>fill</code>, mark the cell <em>before</em> the four calls. Marking it afterwards (or not at all) lets two neighbours call each other back and forth until <code>StackOverflowError</code>. In <code>paths</code>, test "outside the grid or a wall" <em>before</em> reading <code>memo[r][c]</code>, or the index is out of bounds.</div>`,
    `<h3>🧪 Bài 6 — lưới ô vuông: đếm đường đi, rồi loang vùng (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Một lưới gồm '.' (ô trống) và '#' (tường). (a) <code>countPaths(g)</code>: có bao nhiêu đường đi từ ô trên-trái tới ô dưới-phải, chỉ đi sang phải hoặc đi xuống và không đi qua '#'? (b) <code>fill(g, r, c)</code>: có bao nhiêu ô '.' liền với (r, c) qua các bước lên/xuống/trái/phải? Ô đã đếm được đánh dấu 'x'. Sau đó dùng <code>fill</code> để đếm số vùng của lưới.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<pre><code class="language-plaintext">..#..      vùng chứa (0,0): 3 ô
.##.#      vùng chứa (0,3): 7 ô
#...#      tổng số vùng: 2
##.##</code></pre>
<p class="nhan">Ý tưởng</p>
<p>(a) paths(r, c) = paths(r + 1, c) + paths(r, c + 1); trường hợp cơ sở: ra ngoài lưới hoặc gặp tường → 0, tới đích → 1. Cùng một ô được đi tới theo rất nhiều ngả, nên cất đáp án của mỗi ô vào <code>memo[r][c]</code> (ghi nhớ — memoization, slide 18): không có memo thì test lưới 16×16 tốn gần 900 triệu lời gọi; có memo chỉ vài trăm. (b) Đánh dấu ô rồi cộng bốn ô láng giềng — đệ quy bội (multiple recursion) 4 lời gọi, tổng cộng O(R·C) vì mỗi ô bị loang nhiều nhất một lần.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">public class Pe6Grid {
    // Số đường từ (r,c) tới ô dưới-phải, chỉ đi sang phải hoặc xuống, tránh '#'.
    static long paths(char[][] g, int r, int c, long[][] memo) {
        if (r &gt;= g.length || c &gt;= g[0].length || g[r][c] == '#') return 0;   // ra ngoài lưới hoặc bị chặn
        if (r == g.length - 1 &amp;&amp; c == g[0].length - 1) return 1;              // tới đích
        if (memo[r][c] &gt;= 0) return memo[r][c];                               // đã giải rồi
        memo[r][c] = paths(g, r + 1, c, memo) + paths(g, r, c + 1, memo);
        return memo[r][c];
    }

    static long countPaths(char[][] g) {
        long[][] memo = new long[g.length][g[0].length];
        for (long[] row : memo) java.util.Arrays.fill(row, -1);
        return paths(g, 0, 0, memo);
    }

    // Loang: kích thước vùng ô '.' liền với (r,c) theo 4 hướng.
    static int fill(char[][] g, int r, int c) {
        if (r &lt; 0 || r &gt;= g.length || c &lt; 0 || c &gt;= g[0].length || g[r][c] != '.') return 0;
        g[r][c] = 'x';                                   // đánh dấu TRƯỚC 4 lời gọi
        return 1 + fill(g, r + 1, c) + fill(g, r - 1, c) + fill(g, r, c + 1) + fill(g, r, c - 1);
    }

    static char[][] grid(String... rows) {
        char[][] g = new char[rows.length][];
        for (int i = 0; i &lt; rows.length; i++) g[i] = rows[i].toCharArray();
        return g;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("3x3 open grid: 6 paths", "" + countPaths(grid("...", "...", "...")), "6");
        check("3x3, centre blocked: 2 paths", "" + countPaths(grid("...", ".#.", "...")), "2");
        check("blocked start: 0 paths", "" + countPaths(grid("#..", "...", "...")), "0");
        char[][] big = new char[16][16];
        for (char[] row : big) java.util.Arrays.fill(row, '.');
        check("16x16 open grid: C(30,15) paths", "" + countPaths(big), "155117520");
        char[][] g = grid("..#..", ".##.#", "#...#", "##.##");
        check("region at (0,0) = 3, region at (0,3) = 7", fill(g, 0, 0) + " " + fill(g, 0, 3), "3 7");
        check("a wall or a visited cell counts 0", fill(g, 1, 1) + " " + fill(g, 0, 0), "0 0");
        char[][] h = grid("..#..", ".##.#", "#...#", "##.##");
        int regions = 0;
        for (int r = 0; r &lt; h.length; r++)
            for (int c = 0; c &lt; h[0].length; c++) if (fill(h, r, c) &gt; 0) regions++;
        check("number of regions = 2", "" + regions, "2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 3x3 open grid: 6 paths<br>
PASS 3x3, centre blocked: 2 paths<br>
PASS blocked start: 0 paths<br>
PASS 16x16 open grid: C(30,15) paths<br>
PASS region at (0,0) = 3, region at (0,3) = 7<br>
PASS a wall or a visited cell counts 0<br>
PASS number of regions = 2<br>
ALL TESTS PASSED</div>
<div class="pitfall">Trong <code>fill</code>, phải đánh dấu ô <em>trước</em> bốn lời gọi. Đánh dấu sau (hoặc không đánh dấu) thì hai ô láng giềng gọi qua gọi lại lẫn nhau tới khi <code>StackOverflowError</code>. Trong <code>paths</code>, phải kiểm "ra ngoài lưới hoặc là tường" <em>trước</em> khi đọc <code>memo[r][c]</code>, nếu không sẽ truy cập chỉ số ngoài mảng.</div>`),
    bi(`<h3>🧪 Exercise 7 — f1–f4 on a list of cars, all recursive (close to a real PE · ~25 min)</h3>
<p class="nhan">Task</p>
<p>The given <code>MyList</code> of <code>Car(owner, price)</code> has <code>head</code>, <code>tail</code>, <code>addLast</code> and <code>traverse</code>. Write, <strong>recursively and without loops</strong>:</p>
<ol>
<li><code>f1(lo, hi)</code> — how many cars have lo ≤ price ≤ hi;</li>
<li><code>f2(x)</code> — remove every car with price &lt; x;</li>
<li><code>f3(owner, price)</code> — insert a car into a list sorted ascending by price; a car whose price equals existing ones goes after them;</li>
<li><code>f4()</code> — is the list sorted ascending by price?</li>
</ol>
<p>After <code>f2</code> and <code>f3</code>, <code>head</code> and <code>tail</code> must be correct.</p>
<p class="nhan">Data → expected result</p>
<p>A 5, B 9, C 2, D 9, E 1, F 7 → f1(2, 7) = 3; f4() = false; after f2(5): (A,5) (B,9) (D,9) (F,7); the same six cars inserted one by one with f3 give (E,1) (C,2) (A,5) (F,7) (B,9) (D,9).</p>
<p class="nhan">Idea</p>
<p>each <code>fK</code> is a short wrapper that calls a recursive helper on <code>head</code>. The helpers that change the list <strong>return the new first node</strong> of the list they were given, and every caller links that result in: <code>p.next = removeBelow(p.next, x)</code>. This one pattern handles "the first node is removed" with no special case; afterwards the wrapper repairs <code>tail</code>.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info; Node next;
    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }

    // Each fK(...) is a wrapper: it starts the recursive helper at head and repairs head/tail.
    int f1(int lo, int hi) { return countInRange(head, lo, hi); }
    void f2(int x) { head = removeBelow(head, x); tail = last(head); }
    void f3(String o, int pr) { head = insertSorted(head, new Car(o, pr)); tail = last(head); }
    boolean f4() { return isSorted(head); }

    int countInRange(Node p, int lo, int hi) {           // lo &lt;= price &lt;= hi
        if (p == null) return 0;
        return (p.info.price &gt;= lo &amp;&amp; p.info.price &lt;= hi ? 1 : 0) + countInRange(p.next, lo, hi);
    }

    Node removeBelow(Node p, int x) {                    // drop every car with price &lt; x; returns the new first node
        if (p == null) return null;
        p.next = removeBelow(p.next, x);                 // clean the rest first
        return p.info.price &lt; x ? p.next : p;            // skip p, or keep it
    }

    Node insertSorted(Node p, Car c) {                   // equal prices keep their order
        if (p == null || c.price &lt; p.info.price) return new Node(c, p);
        p.next = insertSorted(p.next, c);
        return p;
    }

    boolean isSorted(Node p) {                           // ascending by price
        if (p == null || p.next == null) return true;
        return p.info.price &lt;= p.next.info.price &amp;&amp; isSorted(p.next);
    }

    Node last(Node p) {                                  // the last node, to repair tail
        if (p == null || p.next == null) return p;
        return last(p.next);
    }
}

public class Pe7CarList {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[] data = "A5 B9 C2 D9 E1 F7".split(" ");
        MyList t = new MyList(), s = new MyList(), u = new MyList();
        for (String w : data) {
            t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
            s.f3(w.substring(0, 1), Integer.parseInt(w.substring(1)));    // build a sorted list with f3
        }
        check("f1 countInRange(2,7) = 3", "" + t.f1(2, 7), "3");
        check("f4 on the data = false", "" + t.f4(), "false");
        t.f2(5);
        check("f2 removeBelow(5), tail repaired", t.traverse() + " tail=" + t.tail.info, "(A,5) (B,9) (D,9) (F,7) tail=(F,7)");
        u.addLast("A", 1); u.addLast("B", 2);
        u.f2(5);
        check("f2 removing every car -&gt; empty list", String.valueOf(u.head == null &amp;&amp; u.tail == null), "true");
        check("f3 builds a sorted, stable list", s.traverse(), "(E,1) (C,2) (A,5) (F,7) (B,9) (D,9)");
        check("f4 = true, tail = (D,9)", s.f4() + " tail=" + s.tail.info, "true tail=(D,9)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 countInRange(2,7) = 3<br>
PASS f4 on the data = false<br>
PASS f2 removeBelow(5), tail repaired<br>
PASS f2 removing every car -&gt; empty list<br>
PASS f3 builds a sorted, stable list<br>
PASS f4 = true, tail = (D,9)<br>
ALL TESTS PASSED</div>
<div class="pitfall">The costliest mistake here is calling a helper and throwing its result away: <code>removeBelow(head, x);</code> instead of <code>head = removeBelow(head, x);</code>. The cars further down do disappear, but a first car that should go stays. The same holds for <code>insertSorted</code> when the new car becomes the first one.</div>`,
    `<h3>🧪 Bài 7 — f1–f4 trên danh sách xe, tất cả bằng đệ quy (gần đề PE thật · ~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Lớp <code>MyList</code> cho sẵn chứa các <code>Car(owner, price)</code>, có <code>head</code>, <code>tail</code>, <code>addLast</code> và <code>traverse</code>. Hãy viết, <strong>bằng đệ quy và không dùng vòng lặp</strong>:</p>
<ol>
<li><code>f1(lo, hi)</code> — có bao nhiêu xe có lo ≤ price ≤ hi;</li>
<li><code>f2(x)</code> — xoá mọi xe có price &lt; x;</li>
<li><code>f3(owner, price)</code> — chèn một xe vào danh sách đã sắp tăng dần theo giá; xe cùng giá với các xe đã có thì đứng sau chúng;</li>
<li><code>f4()</code> — danh sách có tăng dần theo giá không?</li>
</ol>
<p>Sau <code>f2</code> và <code>f3</code>, <code>head</code> và <code>tail</code> phải đúng.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>A 5, B 9, C 2, D 9, E 1, F 7 → f1(2, 7) = 3; f4() = false; sau f2(5): (A,5) (B,9) (D,9) (F,7); chèn lần lượt sáu xe đó bằng f3 được (E,1) (C,2) (A,5) (F,7) (B,9) (D,9).</p>
<p class="nhan">Ý tưởng</p>
<p>mỗi <code>fK</code> là một hàm bọc (wrapper) ngắn, gọi hàm đệ quy phụ (helper) từ <code>head</code>. Các helper làm thay đổi danh sách <strong>trả về nút đầu mới</strong> của danh sách mà nó nhận vào, và nơi gọi luôn nối kết quả đó vào: <code>p.next = removeBelow(p.next, x)</code>. Chỉ một khuôn này đã xử lý được trường hợp "nút đầu bị xoá" mà không cần trường hợp đặc biệt nào; sau đó hàm bọc sửa lại <code>tail</code>.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

class Node {
    Car info; Node next;
    Node(Car x, Node p) { info = x; next = p; }
}

class MyList {
    Node head, tail;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }

    // Mỗi fK(...) là hàm bọc: gọi hàm đệ quy từ head rồi sửa lại head/tail.
    int f1(int lo, int hi) { return countInRange(head, lo, hi); }
    void f2(int x) { head = removeBelow(head, x); tail = last(head); }
    void f3(String o, int pr) { head = insertSorted(head, new Car(o, pr)); tail = last(head); }
    boolean f4() { return isSorted(head); }

    int countInRange(Node p, int lo, int hi) {           // lo &lt;= price &lt;= hi
        if (p == null) return 0;
        return (p.info.price &gt;= lo &amp;&amp; p.info.price &lt;= hi ? 1 : 0) + countInRange(p.next, lo, hi);
    }

    Node removeBelow(Node p, int x) {                    // bỏ mọi xe có price &lt; x; trả về nút đầu mới
        if (p == null) return null;
        p.next = removeBelow(p.next, x);                 // dọn phần còn lại trước
        return p.info.price &lt; x ? p.next : p;            // bỏ qua p, hoặc giữ lại
    }

    Node insertSorted(Node p, Car c) {                   // giá bằng nhau giữ nguyên thứ tự
        if (p == null || c.price &lt; p.info.price) return new Node(c, p);
        p.next = insertSorted(p.next, c);
        return p;
    }

    boolean isSorted(Node p) {                           // tăng dần theo giá
        if (p == null || p.next == null) return true;
        return p.info.price &lt;= p.next.info.price &amp;&amp; isSorted(p.next);
    }

    Node last(Node p) {                                  // nút cuối, để sửa lại tail
        if (p == null || p.next == null) return p;
        return last(p.next);
    }
}

public class Pe7CarList {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String[] data = "A5 B9 C2 D9 E1 F7".split(" ");
        MyList t = new MyList(), s = new MyList(), u = new MyList();
        for (String w : data) {
            t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
            s.f3(w.substring(0, 1), Integer.parseInt(w.substring(1)));    // dựng danh sách đã sắp bằng f3
        }
        check("f1 countInRange(2,7) = 3", "" + t.f1(2, 7), "3");
        check("f4 on the data = false", "" + t.f4(), "false");
        t.f2(5);
        check("f2 removeBelow(5), tail repaired", t.traverse() + " tail=" + t.tail.info, "(A,5) (B,9) (D,9) (F,7) tail=(F,7)");
        u.addLast("A", 1); u.addLast("B", 2);
        u.f2(5);
        check("f2 removing every car -&gt; empty list", String.valueOf(u.head == null &amp;&amp; u.tail == null), "true");
        check("f3 builds a sorted, stable list", s.traverse(), "(E,1) (C,2) (A,5) (F,7) (B,9) (D,9)");
        check("f4 = true, tail = (D,9)", s.f4() + " tail=" + s.tail.info, "true tail=(D,9)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1 countInRange(2,7) = 3<br>
PASS f4 on the data = false<br>
PASS f2 removeBelow(5), tail repaired<br>
PASS f2 removing every car -&gt; empty list<br>
PASS f3 builds a sorted, stable list<br>
PASS f4 = true, tail = (D,9)<br>
ALL TESTS PASSED</div>
<div class="pitfall">Lỗi đắt nhất ở bài này là gọi helper rồi vứt kết quả đi: viết <code>removeBelow(head, x);</code> thay vì <code>head = removeBelow(head, x);</code>. Các xe phía sau vẫn bị xoá đúng, nhưng nếu xe đầu tiên cần xoá thì nó vẫn nằm đó. <code>insertSorted</code> cũng vậy khi xe mới trở thành xe đầu tiên.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>recursion</strong></td><td>đệ quy</td><td>A method solves a problem by calling itself on a smaller instance of the same problem.</td></tr>
<tr><td><strong>recursive (inductive) definition</strong></td><td>định nghĩa đệ quy (quy nạp)</td><td>A definition of something in terms of itself, made of a base case and an inductive case.</td></tr>
<tr><td><strong>base case (anchor)</strong></td><td>trường hợp cơ sở (điểm neo)</td><td>The case answered directly, without a recursive call; it stops the recursion.</td></tr>
<tr><td><strong>recursive case (inductive step)</strong></td><td>bước đệ quy (bước quy nạp)</td><td>The case that calls the method on a smaller input and combines the result.</td></tr>
<tr><td><strong>infinite regress</strong></td><td>lùi vô hạn</td><td>A definition or chain of calls that never reaches a base case; in Java it ends in <code>StackOverflowError</code>.</td></tr>
<tr><td><strong>activation record (stack frame)</strong></td><td>bản ghi kích hoạt (khung ngăn xếp)</td><td>The block created for every call: parameters, locals, dynamic link, return address, return value.</td></tr>
<tr><td><strong>run-time stack (call stack)</strong></td><td>ngăn xếp lúc chạy (ngăn xếp lời gọi)</td><td>The stack of activation records: pushed on a call, popped on return, last in first out.</td></tr>
<tr><td><strong>dynamic link</strong></td><td>liên kết động</td><td>The pointer in an activation record to the caller's activation record.</td></tr>
<tr><td><strong>return address</strong></td><td>địa chỉ trở về</td><td>The caller's instruction right after the call, where execution resumes.</td></tr>
<tr><td><strong>linear recursion</strong></td><td>đệ quy tuyến tính</td><td>At most one recursive call runs in each activation, as in factorial or binary search.</td></tr>
<tr><td><strong>binary recursion</strong></td><td>đệ quy nhị phân</td><td>Exactly two recursive calls in an activation, as in the naive Fibonacci.</td></tr>
<tr><td><strong>multiple recursion</strong></td><td>đệ quy bội</td><td>Three or more recursive calls in an activation, as in flood fill or the Koch curve.</td></tr>
<tr><td><strong>tail recursion</strong></td><td>đệ quy đuôi</td><td>The single recursive call is the very last action, so it can be turned into a loop.</td></tr>
<tr><td><strong>non-tail recursion</strong></td><td>đệ quy không đuôi</td><td>Work remains after a recursive call, so every waiting activation must be kept.</td></tr>
<tr><td><strong>indirect recursion</strong></td><td>đệ quy gián tiếp</td><td>A method calls itself through other methods: f → g → f.</td></tr>
<tr><td><strong>nested recursion</strong></td><td>đệ quy lồng</td><td>A recursive call appears inside an argument of a recursive call, as in h(2 + h(2n)).</td></tr>
<tr><td><strong>excessive recursion</strong></td><td>đệ quy thừa</td><td>A recursion that solves the same subproblems again and again, like the naive fibo.</td></tr>
<tr><td><strong>memoization</strong></td><td>ghi nhớ kết quả</td><td>Store every computed result and reuse it instead of computing it again.</td></tr>
<tr><td><strong>backtracking</strong></td><td>quay lui</td><td>Make a choice, recurse on the rest, then undo the choice and try the next one.</td></tr>
<tr><td><strong>call tree (recursion tree)</strong></td><td>cây lời gọi (cây đệ quy)</td><td>A tree with one node per call and an edge from each call to every call it makes.</td></tr>
<tr><td><strong>StackOverflowError</strong></td><td>lỗi tràn ngăn xếp</td><td>The <code>Error</code> the JVM throws when the run-time stack is full, usually because a recursion never stops.</td></tr>
<tr><td><strong>fractal</strong></td><td>hình phân dạng</td><td>A shape made of smaller copies of itself, drawn naturally by recursion.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>recursion</strong></td><td>đệ quy</td><td>Phương thức giải bài toán bằng cách tự gọi chính nó trên một phiên bản nhỏ hơn của cùng bài toán.</td></tr>
<tr><td><strong>recursive (inductive) definition</strong></td><td>định nghĩa đệ quy (quy nạp)</td><td>Định nghĩa một thứ thông qua chính nó, gồm trường hợp cơ sở và bước quy nạp.</td></tr>
<tr><td><strong>base case (anchor)</strong></td><td>trường hợp cơ sở (điểm neo)</td><td>Trường hợp trả lời ngay, không gọi đệ quy; nó làm phép đệ quy dừng lại.</td></tr>
<tr><td><strong>recursive case (inductive step)</strong></td><td>bước đệ quy (bước quy nạp)</td><td>Trường hợp gọi lại phương thức trên đầu vào nhỏ hơn rồi kết hợp kết quả.</td></tr>
<tr><td><strong>infinite regress</strong></td><td>lùi vô hạn</td><td>Định nghĩa hay chuỗi lời gọi không bao giờ chạm trường hợp cơ sở; trong Java nó kết thúc bằng <code>StackOverflowError</code>.</td></tr>
<tr><td><strong>activation record (stack frame)</strong></td><td>bản ghi kích hoạt (khung ngăn xếp)</td><td>Khối nhớ tạo ra cho mỗi lời gọi: tham số, biến cục bộ, liên kết động, địa chỉ trở về, giá trị trả về.</td></tr>
<tr><td><strong>run-time stack (call stack)</strong></td><td>ngăn xếp lúc chạy (ngăn xếp lời gọi)</td><td>Ngăn xếp các bản ghi kích hoạt: đẩy vào khi gọi, lấy ra khi trả về, vào sau ra trước.</td></tr>
<tr><td><strong>dynamic link</strong></td><td>liên kết động</td><td>Con trỏ trong bản ghi kích hoạt trỏ tới bản ghi kích hoạt của nơi gọi.</td></tr>
<tr><td><strong>return address</strong></td><td>địa chỉ trở về</td><td>Lệnh của nơi gọi nằm ngay sau lời gọi, nơi chương trình chạy tiếp.</td></tr>
<tr><td><strong>linear recursion</strong></td><td>đệ quy tuyến tính</td><td>Mỗi lần kích hoạt chạy nhiều nhất một lời gọi đệ quy, như giai thừa hay tìm kiếm nhị phân.</td></tr>
<tr><td><strong>binary recursion</strong></td><td>đệ quy nhị phân</td><td>Đúng hai lời gọi đệ quy trong một lần kích hoạt, như Fibonacci ngây thơ.</td></tr>
<tr><td><strong>multiple recursion</strong></td><td>đệ quy bội</td><td>Từ ba lời gọi đệ quy trở lên trong một lần kích hoạt, như loang vùng hay đường Koch.</td></tr>
<tr><td><strong>tail recursion</strong></td><td>đệ quy đuôi</td><td>Lời gọi đệ quy duy nhất là việc cuối cùng, nên có thể đổi thành vòng lặp.</td></tr>
<tr><td><strong>non-tail recursion</strong></td><td>đệ quy không đuôi</td><td>Sau lời gọi đệ quy vẫn còn việc, nên mọi lần kích hoạt đang chờ đều phải được giữ lại.</td></tr>
<tr><td><strong>indirect recursion</strong></td><td>đệ quy gián tiếp</td><td>Phương thức gọi lại chính nó thông qua phương thức khác: f → g → f.</td></tr>
<tr><td><strong>nested recursion</strong></td><td>đệ quy lồng</td><td>Lời gọi đệ quy nằm trong đối số của một lời gọi đệ quy, như h(2 + h(2n)).</td></tr>
<tr><td><strong>excessive recursion</strong></td><td>đệ quy thừa</td><td>Phép đệ quy giải đi giải lại cùng các bài toán con, như fibo ngây thơ.</td></tr>
<tr><td><strong>memoization</strong></td><td>ghi nhớ kết quả</td><td>Cất mọi kết quả đã tính để dùng lại thay vì tính lại lần nữa.</td></tr>
<tr><td><strong>backtracking</strong></td><td>quay lui</td><td>Chọn một phương án, đệ quy phần còn lại, rồi bỏ chọn và thử phương án kế tiếp.</td></tr>
<tr><td><strong>call tree (recursion tree)</strong></td><td>cây lời gọi (cây đệ quy)</td><td>Cây có mỗi lời gọi là một nút và cạnh nối mỗi lời gọi với từng lời gọi nó phát ra.</td></tr>
<tr><td><strong>StackOverflowError</strong></td><td>lỗi tràn ngăn xếp</td><td><code>Error</code> mà JVM ném ra khi ngăn xếp lúc chạy đầy, thường vì một phép đệ quy không dừng.</td></tr>
<tr><td><strong>fractal</strong></td><td>hình phân dạng</td><td>Hình ghép từ những bản sao nhỏ hơn của chính nó, vẽ tự nhiên bằng đệ quy.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 7 things to remember from Chapter 3</h2>
<ol>
<li><strong>Two parts</strong>: every recursion needs a base case that stops it and a recursive case that moves strictly toward it — otherwise <code>StackOverflowError</code>.</li>
<li><strong>The run-time stack</strong>: each call gets its own activation record (parameters, locals, return address, dynamic link), so memory = O(depth). Calls go down asking and come back up computing.</li>
<li><strong>Count the calls that can run in one activation</strong>: 1 = linear (factorial, binary search), exactly 2 = binary (fibo, subsets), 3 or more = multiple (Sierpinski, flood fill).</li>
<li><strong>Tail vs non-tail</strong>: a tail recursion (nothing after the call) becomes a loop by updating its parameters; a non-tail recursion becomes a loop plus an explicit stack.</li>
<li><strong>Indirect</strong> (f → g → f) and <strong>nested</strong> recursion (a call inside an argument: h(2 + h(2n)), Ackermann): every chain must still reach a base case.</li>
<li><strong>Excessive recursion</strong> solves the same subproblem again and again (fibo: 2·fibo(n+1) − 1 calls); memoization or a loop brings it down to O(n).</li>
<li><strong>Recursion vs iteration</strong>: prefer a loop when it is just as simple; keep recursion for tree-shaped problems — the Tower of Hanoi (2ⁿ − 1 moves), fractals, backtracking, and the trees of Chapter 4.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>What is wrong with <code>int count(Node p) { return 1 + count(p.next); }</code>?</li>
<li>Why is <code>power(x, n/2) * power(x, n/2)</code> slow although it halves n?</li>
<li>In Exercise 7, why must <code>f2</code> write <code>head = removeBelow(head, x)</code>?</li>
<li>Which exercises use binary recursion, and which use multiple recursion?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) there is no base case: at the end of the list <code>p</code> is <code>null</code>, and <code>p.next</code> throws <code>NullPointerException</code>. (2) Two calls per level double the call tree at every level, so it does about n multiplications instead of about 2·log₂ n. (3) The helper returns the new first node; if the old first car was removed, only that assignment moves <code>head</code>. (4) Binary: subsets (Exercise 5) and grid paths (Exercise 6), 2 calls each; multiple: flood fill (Exercise 6, 4 calls) and permutations (Exercise 5, up to n calls — one per unused letter).</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Algorithm</th><th>Recursive calls</th><th>Time</th><th>Stack depth</th></tr></thead>
<tbody>
<tr><td>count / sum / reverse a list of n nodes</td><td>about n</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>factorial(n)</td><td>n</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>DecToBin(n) and toBase(n, b)</td><td>⌊log_b n⌋ + 1 (b = 2 for DecToBin)</td><td>O(log n)</td><td>O(log n)</td></tr>
<tr><td>binary search in n elements</td><td>at most ⌊log₂ n⌋ + 2</td><td>O(log n)</td><td>O(log n); O(1) as a loop</td></tr>
<tr><td>fast power xⁿ</td><td>⌊log₂ n⌋ + 2</td><td>O(log n)</td><td>O(log n)</td></tr>
<tr><td>naive fibo(n)</td><td>2·fibo(n+1) − 1</td><td>O(φⁿ), within O(2ⁿ)</td><td>O(n)</td></tr>
<tr><td>fibo(n) with memo</td><td>2n − 1</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>fibo(n) with a loop</td><td>none</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>Tower of Hanoi, n disks</td><td>2ⁿ − 1</td><td>O(2ⁿ)</td><td>O(n)</td></tr>
<tr><td>all subsets of n items</td><td>2ⁿ⁺¹ − 1</td><td>O(n·2ⁿ)</td><td>O(n)</td></tr>
<tr><td>all permutations of n items</td><td>about e·n!</td><td>O(n·n!)</td><td>O(n)</td></tr>
<tr><td>grid paths with memo, R×C grid</td><td>at most 2·R·C + 1</td><td>O(R·C)</td><td>O(R + C)</td></tr>
<tr><td>flood fill, R×C grid</td><td>at most 4·R·C + 1</td><td>O(R·C)</td><td>up to O(R·C)</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 7 điều cần nhớ của Chương 3</h2>
<ol>
<li><strong>Hai phần</strong>: mọi phép đệ quy cần một trường hợp cơ sở (base case) để dừng và một bước đệ quy tiến hẳn về phía nó — nếu không sẽ <code>StackOverflowError</code>.</li>
<li><strong>Ngăn xếp lúc chạy (run-time stack)</strong>: mỗi lời gọi có bản ghi kích hoạt (activation record) riêng (tham số, biến cục bộ, địa chỉ trở về, liên kết động), nên bộ nhớ = O(độ sâu). Lời gọi đi xuống thì hỏi, quay lên thì tính.</li>
<li><strong>Đếm số lời gọi có thể chạy trong một lần kích hoạt</strong>: 1 = tuyến tính (linear — giai thừa, tìm kiếm nhị phân), đúng 2 = nhị phân (binary — fibo, sinh tập con), từ 3 trở lên = bội (multiple — Sierpinski, loang vùng).</li>
<li><strong>Đuôi và không đuôi</strong>: đệ quy đuôi (tail — sau lời gọi không còn gì) đổi thành vòng lặp bằng cách cập nhật tham số; đệ quy không đuôi (non-tail) đổi thành vòng lặp cộng một ngăn xếp tường minh.</li>
<li>Đệ quy <strong>gián tiếp</strong> (indirect — f → g → f) và <strong>lồng</strong> (nested — có lời gọi nằm trong đối số: h(2 + h(2n)), Ackermann): mọi chuỗi gọi vẫn phải chạm tới trường hợp cơ sở.</li>
<li><strong>Đệ quy thừa (excessive recursion)</strong> giải đi giải lại cùng bài toán con (fibo: 2·fibo(n+1) − 1 lời gọi); ghi nhớ (memoization) hoặc vòng lặp đưa nó về O(n).</li>
<li><strong>Đệ quy hay vòng lặp</strong>: dùng vòng lặp khi nó đơn giản như nhau; để dành đệ quy cho bài toán dạng cây — Tháp Hà Nội (2ⁿ − 1 lần chuyển), fractal (hình phân dạng), quay lui (backtracking), và các cây của Chương 4.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li><code>int count(Node p) { return 1 + count(p.next); }</code> sai ở đâu?</li>
<li>Vì sao <code>power(x, n/2) * power(x, n/2)</code> chậm dù nó chia đôi n?</li>
<li>Ở Bài 7, vì sao <code>f2</code> phải viết <code>head = removeBelow(head, x)</code>?</li>
<li>Bài tập nào dùng đệ quy nhị phân, bài nào dùng đệ quy bội?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) không có trường hợp cơ sở: tới cuối danh sách thì <code>p</code> là <code>null</code>, và <code>p.next</code> văng <code>NullPointerException</code>. (2) Hai lời gọi mỗi tầng làm cây lời gọi (call tree) nhân đôi sau mỗi tầng, nên tốn khoảng n phép nhân thay vì khoảng 2·log₂ n. (3) Hàm phụ (helper) trả về nút đầu mới; nếu xe đầu cũ bị xoá thì chỉ phép gán đó mới dời được <code>head</code>. (4) Nhị phân: sinh tập con (Bài 5) và đếm đường đi trên lưới (Bài 6), mỗi lần 2 lời gọi; bội: loang vùng (Bài 6, 4 lời gọi) và sinh hoán vị (Bài 5, tới n lời gọi — mỗi chữ chưa dùng một lời gọi).</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Thuật toán</th><th>Số lời gọi đệ quy</th><th>Thời gian</th><th>Độ sâu ngăn xếp (stack)</th></tr></thead>
<tbody>
<tr><td>đếm / tính tổng / đảo danh sách n nút</td><td>khoảng n</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>factorial(n)</td><td>n</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>DecToBin(n) và toBase(n, b)</td><td>⌊log_b n⌋ + 1 (b = 2 với DecToBin)</td><td>O(log n)</td><td>O(log n)</td></tr>
<tr><td>tìm kiếm nhị phân trong n phần tử</td><td>nhiều nhất ⌊log₂ n⌋ + 2</td><td>O(log n)</td><td>O(log n); O(1) nếu viết bằng vòng lặp</td></tr>
<tr><td>lũy thừa nhanh xⁿ</td><td>⌊log₂ n⌋ + 2</td><td>O(log n)</td><td>O(log n)</td></tr>
<tr><td>fibo(n) ngây thơ</td><td>2·fibo(n+1) − 1</td><td>O(φⁿ), nằm trong O(2ⁿ)</td><td>O(n)</td></tr>
<tr><td>fibo(n) có ghi nhớ (memo)</td><td>2n − 1</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>fibo(n) bằng vòng lặp</td><td>không có</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>Tháp Hà Nội, n đĩa</td><td>2ⁿ − 1</td><td>O(2ⁿ)</td><td>O(n)</td></tr>
<tr><td>mọi tập con của n phần tử</td><td>2ⁿ⁺¹ − 1</td><td>O(n·2ⁿ)</td><td>O(n)</td></tr>
<tr><td>mọi hoán vị của n phần tử</td><td>khoảng e·n!</td><td>O(n·n!)</td><td>O(n)</td></tr>
<tr><td>đường đi trên lưới R×C có memo</td><td>nhiều nhất 2·R·C + 1</td><td>O(R·C)</td><td>O(R + C)</td></tr>
<tr><td>loang vùng trên lưới R×C</td><td>nhiều nhất 4·R·C + 1</td><td>O(R·C)</td><td>tới O(R·C)</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch3) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'What does f(7) return?|||f(7) trả về giá trị nào?',
      code: `static int f(int n) {
    if (n <= 1) return 1;
    return n * f(n - 2);
}`,
      codeLang: 'java',
      options: ['5040|||5040', '105|||105', '35|||35', '15|||15'],
      correctIndex: 1,
      points: 1,
      explanation: 'Each call multiplies by n and recurses on n − 2: f(7) = 7 · f(5) = 7 · 5 · f(3) = 7 · 5 · 3 · f(1) = 105, and f(1) = 1 is the base case. 5040 = 7! is the tempting answer — it would need n − 1 in the recursive call.|||Mỗi lời gọi nhân với n rồi đệ quy với n − 2: f(7) = 7 · f(5) = 7 · 5 · f(3) = 7 · 5 · 3 · f(1) = 105, và f(1) = 1 là trường hợp cơ sở. 5040 = 7! là đáp án dễ nhầm — muốn ra nó thì lời gọi đệ quy phải là n − 1.' },
    { id: 'q2',
      question: 'The naive fibo(n) of slide 17 (fibo(n) = n if n < 2, else fibo(n − 1) + fibo(n − 2)) is called with n = 5. How many calls are made in total, counting the first one?|||Hàm fibo(n) ngây thơ ở slide 17 (fibo(n) = n nếu n < 2, ngược lại fibo(n − 1) + fibo(n − 2)) được gọi với n = 5. Tổng cộng có bao nhiêu lời gọi, tính cả lời gọi đầu?',
      options: ['5|||5', '9|||9', '8|||8', '15|||15'],
      correctIndex: 3,
      points: 1,
      explanation: 'calls(n) = 1 + calls(n − 1) + calls(n − 2) with calls(0) = calls(1) = 1, which gives 1, 1, 3, 5, 9, 15 for n = 0…5 (in general 2·fibo(n + 1) − 1). 9 is the count for fibo(4) — exactly the call tree drawn on slide 18 — so it is the tempting slip. The count grows exponentially, which is why this recursion is called "excessive".|||calls(n) = 1 + calls(n − 1) + calls(n − 2) với calls(0) = calls(1) = 1, cho dãy 1, 1, 3, 5, 9, 15 ứng với n = 0…5 (tổng quát là 2·fibo(n + 1) − 1). 9 là số lời gọi của fibo(4) — đúng cây lời gọi vẽ ở slide 18 — nên dễ nhầm. Số lời gọi tăng theo hàm mũ, vì thế đệ quy này được gọi là "thừa" (excessive).' },
    { id: 'q3',
      question: 'Which method is tail recursive?|||Hàm nào là đệ quy đuôi (tail recursion)?',
      options: ['void f(int n) { if (n > 0) { System.out.print(n); f(n - 1); } }|||void f(int n) { if (n > 0) { System.out.print(n); f(n - 1); } }', 'void f(int n) { if (n > 0) { f(n - 1); System.out.print(n); } }|||void f(int n) { if (n > 0) { f(n - 1); System.out.print(n); } }', 'int f(int n) { return n == 0 ? 0 : n + f(n - 1); }|||int f(int n) { return n == 0 ? 0 : n + f(n - 1); }', 'int f(int n) { return n < 2 ? n : f(n - 1) + f(n - 2); }|||int f(int n) { return n < 2 ? n : f(n - 1) + f(n - 2); }'],
      correctIndex: 0,
      points: 1,
      explanation: 'Tail recursion means the recursive call is the very last action — nothing is left to do when it returns — exactly like tail(n) on slide 12. C is the trap: the call sits at the end of the line, but the addition n + … still has to run after it returns, so the frame must be kept. B prints after the call and D makes two calls.|||Đệ quy đuôi nghĩa là lời gọi đệ quy là hành động cuối cùng — khi nó trả về thì không còn việc gì phải làm — đúng như tail(n) ở slide 12. C là cái bẫy: lời gọi nằm cuối dòng, nhưng phép cộng n + … vẫn phải chạy sau khi nó trả về, nên khung (frame) của hàm phải được giữ lại. B in sau lời gọi, còn D gọi hai lần.' },
    { id: 'q4',
      question: 'What does p(3) print?|||p(3) in ra gì?',
      code: `static void p(int n) {
    if (n == 0) return;
    System.out.print(n + " ");
    p(n - 1);
    System.out.print(n + " ");
}`,
      codeLang: 'java',
      options: ['3 2 1 3 2 1|||3 2 1 3 2 1', '1 2 3 3 2 1|||1 2 3 3 2 1', '3 2 1 1 2 3|||3 2 1 1 2 3', '3 2 1|||3 2 1'],
      correctIndex: 2,
      points: 1,
      explanation: 'Each call prints n on the way down, recurses, then prints n again on the way back. Going down prints 3 2 1; p(0) returns at once; unwinding the stack prints 1, then 2, then 3 — the last call to start is the first to finish (LIFO). "3 2 1 3 2 1" wrongly assumes the second prints happen in the same order as the first ones.|||Mỗi lời gọi in n lúc đi xuống, gọi đệ quy, rồi in n lần nữa lúc quay về. Đi xuống in 3 2 1; p(0) trả về ngay; khi stack rút dần thì in 1, rồi 2, rồi 3 — lời gọi bắt đầu sau cùng kết thúc trước tiên (LIFO). "3 2 1 3 2 1" sai vì giả định các lần in thứ hai cũng theo thứ tự như lần đầu.' },
    { id: 'q5',
      question: 'How many moves does moveDisks (the Tower of Hanoi algorithm of slide 20) make for 5 disks?|||moveDisks (thuật toán Tháp Hà Nội ở slide 20) thực hiện bao nhiêu bước chuyển với 5 đĩa?',
      options: ['25|||25', '16|||16', '32|||32', '31|||31'],
      correctIndex: 3,
      points: 1,
      explanation: 'moves(1) = 1 and moves(n) = 2·moves(n − 1) + 1, so moves(n) = 2^n − 1 = 31 for n = 5. 32 = 2^5 is the classic off-by-one; 25 = 5² would mean a polynomial algorithm, but Hanoi is exponential.|||moves(1) = 1 và moves(n) = 2·moves(n − 1) + 1, nên moves(n) = 2^n − 1 = 31 với n = 5. 32 = 2^5 là lỗi lệch một kinh điển; 25 = 5² thì như thể thuật toán là đa thức, nhưng Tháp Hà Nội là hàm mũ.' },
    { id: 'q6',
      question: 'Slide 16 defines the nested recursion h(n) = 0 if n = 0; n if n > 4; h(2 + h(2n)) if n ≤ 4. What is h(2)?|||Slide 16 định nghĩa đệ quy lồng h(n) = 0 nếu n = 0; n nếu n > 4; h(2 + h(2n)) nếu n ≤ 4. h(2) bằng bao nhiêu?',
      options: ['12|||12', '10|||10', '4|||4', '14|||14'],
      correctIndex: 0,
      points: 1,
      explanation: 'h(2) = h(2 + h(4)); h(4) = h(2 + h(8)) = h(2 + 8) = h(10) = 10; so h(2) = h(2 + 10) = h(12) = 12. 10 is the tempting answer: it is h(4), the inner call — the outer call still adds 2 and evaluates h once more. 14 is h(1).|||h(2) = h(2 + h(4)); h(4) = h(2 + h(8)) = h(2 + 8) = h(10) = 10; vậy h(2) = h(2 + 10) = h(12) = 12. 10 là đáp án dễ nhầm: đó là h(4), lời gọi bên trong — lời gọi bên ngoài vẫn cộng thêm 2 và tính h thêm một lần. 14 là h(1).' },
    { id: 'q7',
      question: "With Ackermann's function of slide 16 — A(0, y) = y + 1, A(x, 0) = A(x − 1, 1), A(x, y) = A(x − 1, A(x, y − 1)) — what is A(1, 2)?|||Với hàm Ackermann ở slide 16 — A(0, y) = y + 1, A(x, 0) = A(x − 1, 1), A(x, y) = A(x − 1, A(x, y − 1)) — A(1, 2) bằng bao nhiêu?",
      options: ['3|||3', '4|||4', '5|||5', '6|||6'],
      correctIndex: 1,
      points: 1,
      explanation: 'A(1, 0) = A(0, 1) = 2; A(1, 1) = A(0, A(1, 0)) = A(0, 2) = 3; A(1, 2) = A(0, A(1, 1)) = A(0, 3) = 4. In general A(1, y) = y + 2. 3 is A(1, 1): stopping one level too early is the usual slip when the inner call is itself recursive — that is what "nested recursion" means.|||A(1, 0) = A(0, 1) = 2; A(1, 1) = A(0, A(1, 0)) = A(0, 2) = 3; A(1, 2) = A(0, A(1, 1)) = A(0, 3) = 4. Tổng quát A(1, y) = y + 2. 3 là A(1, 1): dừng sớm một tầng là lỗi hay gặp khi chính lời gọi bên trong cũng là đệ quy — đó là ý nghĩa của "đệ quy lồng".' },
    { id: 'q8',
      question: 'f(n) returns 0 if n == 0, otherwise n + f(n − 1). What happens when a program calls f(−1) in Java?|||f(n) trả 0 nếu n == 0, ngược lại trả n + f(n − 1). Điều gì xảy ra khi chương trình Java gọi f(−1)?',
      options: ['It returns −1|||Nó trả về −1', 'It returns 0|||Nó trả về 0', 'StackOverflowError|||StackOverflowError (tràn ngăn xếp lời gọi)', 'OutOfMemoryError|||OutOfMemoryError (hết bộ nhớ heap)'],
      correctIndex: 2,
      points: 1,
      explanation: 'n goes −1, −2, −3, … and never reaches the base case 0. Every call pushes a new activation record on the run-time stack (slides 8–9) until the stack is exhausted and the JVM throws StackOverflowError. OutOfMemoryError is the tempting option, but it concerns the heap, where objects live — not the call stack.|||n chạy −1, −2, −3, … và không bao giờ chạm trường hợp cơ sở 0. Mỗi lời gọi đẩy một bản ghi kích hoạt (activation record) mới lên run-time stack (slide 8–9) cho tới khi stack cạn và JVM ném StackOverflowError. OutOfMemoryError là phương án dễ nhầm, nhưng lỗi đó nói về heap — nơi chứa đối tượng — chứ không phải stack lời gọi.' },
    { id: 'q9',
      question: 'fibo(n) = fibo(n − 1) + fibo(n − 2) is an example of which kind of recursion (classified by the number of recursive calls, slide 11)?|||fibo(n) = fibo(n − 1) + fibo(n − 2) là ví dụ của loại đệ quy nào (phân loại theo số lời gọi đệ quy, slide 11)?',
      options: ['Binary recursion|||Đệ quy nhị phân (binary recursion)', 'Linear recursion|||Đệ quy tuyến tính (linear recursion)', 'Tail recursion|||Đệ quy đuôi (tail recursion)', 'Multiple recursion|||Đệ quy bội (multiple recursion)'],
      correctIndex: 0,
      points: 1,
      explanation: 'Slide 11 counts the recursive calls inside one activation: exactly two calls → binary recursion (one call → linear, three or more → multiple). Tail recursion is a different classification — whether the call is the last action — and fibo is not tail recursive either, because the addition runs after both calls return.|||Slide 11 đếm số lời gọi đệ quy trong một lần kích hoạt: đúng hai lời gọi → đệ quy nhị phân (một lời gọi → tuyến tính, từ ba trở lên → đệ quy bội). Đệ quy đuôi là một cách phân loại khác — lời gọi có phải hành động cuối cùng không — và fibo cũng không phải đệ quy đuôi, vì phép cộng chạy sau khi cả hai lời gọi trả về.' },
    { id: 'q10',
      question: "In Ackermann's function the rule A(x, y) = A(x − 1, A(x, y − 1)) uses a recursive call as the ARGUMENT of another recursive call. What is this called?|||Trong hàm Ackermann, quy tắc A(x, y) = A(x − 1, A(x, y − 1)) dùng một lời gọi đệ quy làm ĐỐI SỐ cho một lời gọi đệ quy khác. Đó gọi là gì?",
      options: ['Indirect recursion|||Đệ quy gián tiếp (indirect recursion)', 'Nested recursion|||Đệ quy lồng (nested recursion)', 'Tail recursion|||Đệ quy đuôi (tail recursion)', 'Excessive recursion|||Đệ quy thừa (excessive recursion)'],
      correctIndex: 1,
      points: 1,
      explanation: 'Slide 16: a function "defined in terms of itself and also used as one of the parameters" is nested recursion. Indirect recursion (slide 15) is when f calls g and g calls f — a chain of different functions, which is not the case here. Ackermann does grow extremely fast, but "excessive" on slide 17 means recomputing the same values, as naive fibo does.|||Slide 16: hàm "được định nghĩa qua chính nó và chính nó còn được dùng làm một tham số" là đệ quy lồng. Đệ quy gián tiếp (slide 15) là khi f gọi g và g gọi lại f — một chuỗi các hàm khác nhau, không phải trường hợp này. Ackermann đúng là tăng cực nhanh, nhưng "excessive" ở slide 17 nghĩa là tính lại cùng một giá trị nhiều lần, như fibo ngây thơ.' },
  ],
};

export default {
  slides: [L_csd7_1],
  practice: L_on_ch3,
  quiz: QUIZ,
  quizDescription: '10 câu đọc code và lần theo đệ quy: giá trị trả về, thứ tự in, số lời gọi fibo, Tháp Hà Nội, đệ quy lồng h(n), Ackermann, tràn stack, phân loại đệ quy đuôi/nhị phân/lồng — mỗi câu có giải thích.',
};
