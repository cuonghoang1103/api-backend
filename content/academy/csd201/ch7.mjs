/**
 * CSD201 · Chương 7 — băm.
 * Bài 📑 học theo từng slide: csd13 (7-Hashing.ppt, 40 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch7.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch7).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 7.A — 📑 Slide by slide · Hashing, part 1: hash tables, hash functions & open addressing (7-Hashing, slides 1–20) ───────── */
const L_csd13_1 = {
  title: '7.A — 📑 Slide by slide · Hashing, part 1: hash tables, hash functions & open addressing (7-Hashing, slides 1–20)|||7.A — 📑 Học theo từng slide · Băm, phần 1: bảng băm, hàm băm & địa chỉ mở (7-Hashing, slide 1–20)',
  slug: 'csd201-slide-csd13-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–20 của bộ 7-Hashing: vì sao cần băm, bảng băm và hàm băm (chia lấy dư, gấp số, bình phương lấy giữa, trích chữ số, đổi cơ số), va chạm, địa chỉ mở với dò tuyến tính và dò bậc hai (vẽ lại từng lần dò), hệ số tải — 18 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.A · 7-Hashing, slides 1–20</span>
<h2>Hashing, part 1 — the deck, slide by slide</h2>
<p class="lead">This is the first half of the hashing deck (syllabus sessions 49–50, CLO7). It answers three questions: why we want something faster than a sorted array or a balanced BST, how a hash function turns a key into an array index, and what to do when two keys want the same index (open addressing: linear and quadratic probing). Every slide comes with its key idea, runnable Java, a probe-by-probe trace of every insertion, the Big-O and why, and the traps that cost marks in the FE and the PE.</p>
<div class="callout"><strong>CLO7 in the syllabus:</strong> explain hashing and its applications — the concept of a hash, what a hash function and a hash table are. Two of the syllabus's discussion questions are answered in this part: <em>"What are the advantages and disadvantages of hashing?"</em> (slides 3–4) and <em>"How to select hash functions?"</em> (slides 7–14). A favourite FE question gives you keys, a table size and a probing rule and asks in which cell a key ends up — slides 16–20 train exactly that, by hand and in Java.</div>
<h3>Part 1 in one table</h3>
<table>
<thead><tr><th>Idea</th><th>Rule</th><th>Example from the deck</th><th>Cost / remark</th></tr></thead>
<tbody>
<tr><td>Hash table</td><td>index = h(key), in 0 … M − 1</td><td>four employee records into cells 0–9 (slide 6)</td><td>insert, search, delete O(1) on average, O(n) in the worst case</td></tr>
<tr><td>Division</td><td>h(x) = x % M</td><td>choose M prime — not even, not 2ᵖ (slide 12)</td><td>O(1)</td></tr>
<tr><td>Folding</td><td>cut the digits into parts, add the parts</td><td>72320354121324 → 704 (shift), 902 (boundary)</td><td>O(number of digits)</td></tr>
<tr><td>Mid-square</td><td>square the key, keep the middle digits</td><td>3121² = 9740641 → 406</td><td>O(1) for fixed-size keys</td></tr>
<tr><td>Extraction</td><td>keep only some digits</td><td>123-45-6789 → 1289</td><td>O(1)</td></tr>
<tr><td>Radix transformation</td><td>write the key in another base</td><td>345 = 423 in base 9 → 423</td><td>O(number of digits)</td></tr>
<tr><td>Linear probing</td><td>try (h(x) + i) % M, i = 1, 2, …</td><td>89, 18, 49, 58, 69 into 10 cells (slide 16)</td><td>primary clustering</td></tr>
<tr><td>Quadratic probing</td><td>try (h(x) + i²) % M, i = 1, 2, …</td><td>49 → 0, 58 → 2, 69 → 3 (slide 19)</td><td>reaches only (M + 1)/2 cells when M is prime</td></tr>
<tr><td>Load factor</td><td>α = n / M</td><td>by Knuth's formula a miss costs ≈ 2.5 probes at α = 0.5, ≈ 50 at α = 0.9 (slide 18)</td><td>keep α ≤ 0.5 for open addressing</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.A · 7-Hashing, slide 1–20</span>
<h2>Băm, phần 1 — học bộ slide từng trang</h2>
<p class="lead">Đây là nửa đầu bộ slide về băm (buổi 49–50 theo syllabus, CLO7). Nó trả lời ba câu hỏi: vì sao cần một cấu trúc nhanh hơn mảng đã sắp xếp hay cây nhị phân tìm kiếm (BST) cân bằng, hàm băm (hash function) biến khoá (key) thành chỉ số mảng như thế nào, và làm gì khi hai khoá đòi cùng một chỉ số (địa chỉ mở — open addressing: dò tuyến tính và dò bậc hai). Slide nào cũng có ý chính, code Java chạy được, bảng lần theo từng lần dò (probe) của mỗi lần chèn, độ phức tạp Big-O kèm lý do, và những bẫy hay mất điểm ở FE (thi cuối kỳ) và PE (thi thực hành).</p>
<div class="callout"><strong>CLO7 trong syllabus:</strong> giải thích được băm (hashing) và ứng dụng — khái niệm "băm", thế nào là hàm băm và bảng băm (hash table). Hai câu hỏi thảo luận của syllabus nằm gọn trong phần này: <em>"Ưu và nhược điểm của băm là gì?"</em> (slide 3–4) và <em>"Chọn hàm băm thế nào?"</em> (slide 7–14). Dạng câu FE rất hay gặp: cho sẵn các khoá, kích thước bảng và quy tắc dò, hỏi khoá rơi vào ô nào — slide 16–20 luyện đúng dạng đó, cả bằng tay lẫn bằng Java.</div>
<h3>Cả phần 1 trong một bảng</h3>
<table>
<thead><tr><th>Ý tưởng</th><th>Quy tắc</th><th>Ví dụ trong bộ slide</th><th>Chi phí / lưu ý</th></tr></thead>
<tbody>
<tr><td>Bảng băm (hash table)</td><td>chỉ số = h(khoá), trong 0 … M − 1</td><td>bốn bản ghi nhân viên vào các ô 0–9 (slide 6)</td><td>chèn, tìm, xoá O(1) trung bình, O(n) xấu nhất</td></tr>
<tr><td>Chia lấy dư (division)</td><td>h(x) = x % M</td><td>chọn M nguyên tố — không chẵn, không phải 2ᵖ (slide 12)</td><td>O(1)</td></tr>
<tr><td>Gấp số (folding)</td><td>cắt các chữ số thành từng phần rồi cộng lại</td><td>72320354121324 → 704 (gấp dịch), 902 (gấp biên)</td><td>O(số chữ số)</td></tr>
<tr><td>Bình phương lấy giữa (mid-square)</td><td>bình phương khoá, giữ các chữ số ở giữa</td><td>3121² = 9740641 → 406</td><td>O(1) với khoá cỡ cố định</td></tr>
<tr><td>Trích chữ số (extraction)</td><td>chỉ giữ vài chữ số</td><td>123-45-6789 → 1289</td><td>O(1)</td></tr>
<tr><td>Đổi cơ số (radix transformation)</td><td>viết khoá trong hệ cơ số khác</td><td>345 = 423 trong hệ 9 → 423</td><td>O(số chữ số)</td></tr>
<tr><td>Dò tuyến tính (linear probing)</td><td>thử (h(x) + i) % M, i = 1, 2, …</td><td>89, 18, 49, 58, 69 vào 10 ô (slide 16)</td><td>bị vón cục sơ cấp (primary clustering)</td></tr>
<tr><td>Dò bậc hai (quadratic probing)</td><td>thử (h(x) + i²) % M, i = 1, 2, …</td><td>49 → 0, 58 → 2, 69 → 3 (slide 19)</td><td>chỉ với tới (M + 1)/2 ô khi M nguyên tố</td></tr>
<tr><td>Hệ số tải (load factor)</td><td>α = n / M</td><td>theo công thức Knuth, tìm trượt tốn ≈ 2,5 lần dò khi α = 0,5, ≈ 50 khi α = 0,9 (slide 18)</td><td>giữ α ≤ 0,5 với địa chỉ mở</td></tr>
</tbody>
</table>`),
    walkHead('csd13', 1, 20),
    walk('csd13', [
      [1, '7. Hashing',
        `<p class="y-chinh">🎯 Chapter 7 is about hashing: store each item in an array at an index computed from its key, so that insert, search and delete take constant time on average.</p>
<p>After lists, stacks, queues, trees, graphs and sorting, this deck answers one question: how can a program find one record among millions without comparing it with the others? Java's <code>HashMap</code> and <code>HashSet</code>, which you will use in almost every project, are built on the ideas of these 40 slides.</p>`,
        `<p class="y-chinh">🎯 Chương 7 nói về băm (hashing): đặt mỗi phần tử vào mảng tại chỉ số (index) tính ra từ khoá (key) của nó, nhờ vậy chèn, tìm và xoá chỉ tốn thời gian hằng số trung bình.</p>
<p>Sau danh sách, ngăn xếp, hàng đợi, cây, đồ thị và sắp xếp, bộ slide này trả lời một câu hỏi: làm sao tìm một bản ghi giữa hàng triệu bản ghi mà không phải so sánh với các bản ghi khác? <code>HashMap</code> và <code>HashSet</code> của Java — thứ bạn sẽ dùng trong gần như mọi dự án — được dựng từ chính các ý của 40 slide này.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Ten topics, from "why hash at all" to the hash classes of java.util — this lesson walks through slides 1–20, lesson 7.B through slides 21–40.</p>
<ol>
<li><strong>Why hashing?</strong> — slide 3; <strong>Hash table</strong> — slides 4–6 and 10</li>
<li><strong>Hash functions</strong> — slides 7–14: division, folding, mid-square, extraction, radix transformation</li>
<li><strong>Collision resolution</strong> — slides 15–24: open addressing (16–20), chaining (21), coalesced hashing (22–23), buckets (24)</li>
<li><strong>Deletion</strong> — slide 25; <strong>Perfect hash functions</strong> — slide 26; <strong>Hash functions for extendible files</strong> — slide 27</li>
<li><strong>Hash code</strong> — slide 29 (slide 28 adds cryptographic hash functions); <strong>Maps</strong> — slides 30–33; <strong>Hashing in java.util</strong> — slides 34–37</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> the whole chapter is two questions — <em>which cell?</em> (the hash function) and <em>what if that cell is taken?</em> (collision resolution).</p>`,
        `<p class="y-chinh">🎯 Mười chủ đề, từ "vì sao phải băm" tới các lớp băm của java.util — bài này đi qua slide 1–20, bài 7.B đi qua slide 21–40.</p>
<ol>
<li><strong>Vì sao cần băm?</strong> — slide 3; <strong>bảng băm (hash table)</strong> — slide 4–6 và 10</li>
<li><strong>Hàm băm (hash function)</strong> — slide 7–14: chia lấy dư, gấp số, bình phương lấy giữa, trích chữ số, đổi cơ số</li>
<li><strong>Giải quyết va chạm (collision resolution)</strong> — slide 15–24: địa chỉ mở (open addressing, 16–20), dây chuyền (chaining, 21), băm gộp dây (coalesced hashing, 22–23), bucket — thùng chứa nhiều chỗ (24)</li>
<li><strong>Xoá (deletion)</strong> — slide 25; <strong>hàm băm hoàn hảo (perfect hash function)</strong> — slide 26; <strong>hàm băm cho tệp mở rộng (extendible files)</strong> — slide 27</li>
<li><strong>Mã băm (hash code)</strong> — slide 29 (slide 28 nói thêm hàm băm mật mã); <strong>Map (ánh xạ khoá → giá trị)</strong> — slide 30–33; <strong>băm trong java.util</strong> — slide 34–37</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cả chương chỉ là hai câu hỏi — <em>vào ô nào?</em> (hàm băm) và <em>ô đó có người rồi thì sao?</em> (giải quyết va chạm).</p>`],
      [3, 'Why hashing?',
        `<p class="y-chinh">🎯 A sorted array searches in O(log n) but inserts and deletes in O(n); a balanced BST does all three in O(log n); a hash table aims at O(1) on average.</p>
<ul>
<li><strong>Sorted array</strong>: binary search halves the range at every step → about log₂ n steps. But inserting or deleting must shift elements to keep the array sorted → O(n).</li>
<li><strong>Balanced BST</strong> (for example AVL, chapter 4): the height stays O(log n), so insert, search and delete are all O(log n).</li>
<li><strong>Hash table</strong>: compute the index from the key and go straight there — the number of steps does not grow with n.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class WhyHashing {
    // binary search in a sorted array; returns how many comparisons it made
    static int binarySearchSteps(int[] a, int key) {
        int lo = 0, hi = a.length - 1, steps = 0;
        while (lo &lt;= hi) {
            int mid = (lo + hi) / 2;
            steps++;
            if (a[mid] == key) return steps;
            if (a[mid] &lt; key) lo = mid + 1; else hi = mid - 1;
        }
        return steps;
    }

    // hash table with linear probing, h(x) = x % M; returns the cells probed to insert x
    static int insertProbes(int[] t, int x) {
        int m = t.length, i = x % m, probes = 1;
        while (t[i] != 0) { i = (i + 1) % m; probes++; }
        t[i] = x;
        return probes;
    }

    static boolean isPrime(int n) {
        for (int d = 2; (long) d * d &lt;= n; d++) if (n % d == 0) return false;
        return n &gt; 1;
    }

    public static void main(String[] args) {
        System.out.println("      n | binary search | insert into sorted array | hash table, load 0.5");
        System.out.println("        | (loop steps)  | (elements shifted)       | (average probes)");
        for (int n = 1000; n &lt;= 1000000; n *= 10) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = 2 * i;             // sorted array 0, 2, 4, ...
            int cmp = binarySearchSteps(a, -1);                   // -1 is smaller than all: worst case
            int shifts = n;                                       // inserting -1 moves all n elements
            int m = 2 * n;
            while (!isPrime(m)) m++;                              // table size: a prime, about 2n
            int[] t = new int[m];
            long probes = 0, x = 1;
            for (int i = 1; i &lt;= n; i++) {
                x = x * 48271 % 2147483647;                       // n distinct pseudo-random keys
                probes += insertProbes(t, (int) x);
            }
            System.out.println(String.format(Locale.US, "%7d | %13d | %24d | %.2f", n, cmp, shifts, (double) probes / n));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n | binary search | insert into sorted array | hash table, load 0.5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| (loop steps) &nbsp;| (elements shifted) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| (average probes)<br>
&nbsp;&nbsp;&nbsp;1000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 | 1.53<br>
&nbsp;&nbsp;10000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 | 1.48<br>
&nbsp;100000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000 | 1.50<br>
1000000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000000 | 1.50</div>
<p>Read the columns: binary search needs about 3 more steps each time n is multiplied by 10 (log₂ 10 ≈ 3.3); shifting grows exactly like n; the hash table stays near 1.5 probes because its load factor is kept at 0.5 (slide 18).</p>
<p class="dap-an">✅ <strong>Answer:</strong> yes — the hash table: insert, search and delete in O(1) on average. The price: O(n) in the worst case (all keys piled into one place) and no ordering at all (slide 4).</p>
<div class="pitfall">FE trap: "a hash table searches in O(1) in the worst case" is false. O(1) is the <em>average</em> (expected) cost with a good hash function and a low load factor; if all n keys collide, a search degrades to O(n).</div>`,
        `<p class="y-chinh">🎯 Mảng đã sắp xếp tìm trong O(log n) nhưng chèn và xoá mất O(n); cây nhị phân tìm kiếm cân bằng (balanced BST) làm cả ba việc trong O(log n); bảng băm (hash table) nhắm tới O(1) trung bình.</p>
<ul>
<li><strong>Mảng đã sắp xếp</strong>: tìm kiếm nhị phân (binary search) chia đôi đoạn tìm sau mỗi bước → khoảng log₂ n bước. Nhưng chèn hay xoá phải dời phần tử để mảng vẫn đúng thứ tự → O(n).</li>
<li><strong>Cây BST cân bằng</strong>, ví dụ cây AVL ở chương 4: chiều cao luôn là O(log n), nên chèn, tìm, xoá đều O(log n).</li>
<li><strong>Bảng băm</strong>: tính chỉ số từ khoá rồi tới thẳng ô đó — số bước không tăng theo n.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class WhyHashing {
    // tìm nhị phân trên mảng đã sắp; trả về số lần so sánh
    static int binarySearchSteps(int[] a, int key) {
        int lo = 0, hi = a.length - 1, steps = 0;
        while (lo &lt;= hi) {
            int mid = (lo + hi) / 2;
            steps++;
            if (a[mid] == key) return steps;
            if (a[mid] &lt; key) lo = mid + 1; else hi = mid - 1;
        }
        return steps;
    }

    // bảng băm dò tuyến tính, h(x) = x % M; trả về số ô đã dò khi chèn x
    static int insertProbes(int[] t, int x) {
        int m = t.length, i = x % m, probes = 1;
        while (t[i] != 0) { i = (i + 1) % m; probes++; }
        t[i] = x;
        return probes;
    }

    static boolean isPrime(int n) {
        for (int d = 2; (long) d * d &lt;= n; d++) if (n % d == 0) return false;
        return n &gt; 1;
    }

    public static void main(String[] args) {
        System.out.println("      n | binary search | insert into sorted array | hash table, load 0.5");
        System.out.println("        | (loop steps)  | (elements shifted)       | (average probes)");
        for (int n = 1000; n &lt;= 1000000; n *= 10) {
            int[] a = new int[n];
            for (int i = 0; i &lt; n; i++) a[i] = 2 * i;             // mảng đã sắp 0, 2, 4, ...
            int cmp = binarySearchSteps(a, -1);                   // -1 nhỏ hơn mọi phần tử: trường hợp xấu
            int shifts = n;                                       // chèn -1 phải dời cả n phần tử
            int m = 2 * n;
            while (!isPrime(m)) m++;                              // cỡ bảng: số nguyên tố khoảng 2n
            int[] t = new int[m];
            long probes = 0, x = 1;
            for (int i = 1; i &lt;= n; i++) {
                x = x * 48271 % 2147483647;                       // n khoá giả ngẫu nhiên khác nhau
                probes += insertProbes(t, (int) x);
            }
            System.out.println(String.format(Locale.US, "%7d | %13d | %24d | %.2f", n, cmp, shifts, (double) probes / n));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n | binary search | insert into sorted array | hash table, load 0.5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| (loop steps) &nbsp;| (elements shifted) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| (average probes)<br>
&nbsp;&nbsp;&nbsp;1000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 | 1.53<br>
&nbsp;&nbsp;10000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10000 | 1.48<br>
&nbsp;100000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;100000 | 1.50<br>
1000000 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19 | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000000 | 1.50</div>
<p>Đọc các cột: tìm nhị phân cần thêm khoảng 3 bước mỗi khi n nhân 10 (log₂ 10 ≈ 3,3); số lần dời tăng đúng như n; bảng băm đứng yên quanh 1,5 lần dò (probe) vì hệ số tải (load factor) của nó được giữ ở 0,5 (slide 18).</p>
<p class="dap-an">✅ <strong>Đáp án:</strong> có — bảng băm: chèn, tìm, xoá O(1) trung bình. Cái giá phải trả: O(n) trong trường hợp xấu nhất (mọi khoá dồn vào một chỗ) và hoàn toàn không giữ thứ tự (slide 4).</p>
<div class="pitfall">Bẫy FE: "bảng băm tìm kiếm O(1) trong trường hợp xấu nhất" là SAI. O(1) là chi phí <em>trung bình</em> (kỳ vọng) khi hàm băm tốt và hệ số tải thấp; nếu cả n khoá va chạm (collision) với nhau, phép tìm tụt xuống O(n).</div>`],
      [4, 'Hash Tables',
        `<p class="y-chinh">🎯 A hash table supports only part of what a BST supports — insert, delete and find, in constant average time — and gives up every operation that needs the keys in order.</p>
<ul>
<li><strong>Hash table ADT</strong>: insert, delete, find by key. <strong>Hashing</strong> is the name of the technique that implements it.</li>
<li><strong>Not efficient</strong>: <code>findMin</code>, <code>findMax</code>, printing the whole table in sorted order — the keys are scattered on purpose, so these need a scan of every item, O(n), plus O(n log n) to sort.</li>
<li><strong>A BST keeps the keys in order</strong>: <code>findMin</code> is a walk down the left edge — O(log n) when balanced.</li>
</ul>
<pre><code class="language-java">import java.util.HashSet;
import java.util.TreeSet;

public class HashVsTree {
    public static void main(String[] args) {
        int[] keys = {35, 8, 21, 60, 3, 47};
        HashSet&lt;Integer&gt; hash = new HashSet&lt;Integer&gt;();      // a hash table
        TreeSet&lt;Integer&gt; tree = new TreeSet&lt;Integer&gt;();      // a balanced BST (red-black tree)
        for (int k : keys) { hash.add(k); tree.add(k); }
        System.out.println("inserted:      [35, 8, 21, 60, 3, 47]");
        System.out.println("HashSet order: " + hash + "   &lt;- cell order, not sorted");
        System.out.println("TreeSet order: " + tree + "   &lt;- sorted");
        int min = Integer.MAX_VALUE, looked = 0;
        for (int k : hash) { looked++; if (k &lt; min) min = k; }   // findMin in a hash table: look at every key
        System.out.println("hash table findMin = " + min + " after looking at " + looked + " of " + hash.size() + " keys: O(n)");
        System.out.println("TreeSet first()    = " + tree.first() + " by walking the left edge: O(log n)");
        System.out.println("contains(60): hash " + hash.contains(60) + ", tree " + tree.contains(60) + "  &lt;- both fast");
    }
}</code></pre>
<div class="out">inserted: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[35, 8, 21, 60, 3, 47]<br>
HashSet order: [35, 3, 21, 8, 60, 47] &nbsp;&nbsp;&lt;- cell order, not sorted<br>
TreeSet order: [3, 8, 21, 35, 47, 60] &nbsp;&nbsp;&lt;- sorted<br>
hash table findMin = 3 after looking at 6 of 6 keys: O(n)<br>
TreeSet first() &nbsp;&nbsp;&nbsp;= 3 by walking the left edge: O(log n)<br>
contains(60): hash true, tree true &nbsp;&lt;- both fast</div>
<p><code>HashSet</code> printed the keys in the order of its cells — neither the insertion order nor sorted — so its minimum had to be found by looking at all 6 keys. <code>TreeSet</code> (a balanced BST) answers in O(log n). Both answer <code>contains</code> fast.</p>
<p class="meo">🧠 <strong>Remember:</strong> hash = "where is key k?" in one jump; tree = "what comes before or after k?". Need both speed and order? <code>TreeMap</code>/<code>TreeSet</code>, at O(log n).</p>
<div class="pitfall">FE question "Which operation is NOT efficient on a hash table?" — the answer is the one that needs ordering: find min/max or print in sorted order. Insert, delete and search by key are the efficient ones.</div>`,
        `<p class="y-chinh">🎯 Bảng băm (hash table) chỉ hỗ trợ một phần những gì cây nhị phân tìm kiếm (BST) làm được — chèn, xoá, tìm với thời gian hằng số trung bình — và bỏ hẳn mọi thao tác cần các khoá (key) theo thứ tự.</p>
<ul>
<li><strong>ADT bảng băm</strong> (abstract data type — kiểu dữ liệu trừu tượng): chèn, xoá, tìm theo khoá. <strong>Băm (hashing)</strong> là tên của kỹ thuật cài đặt nó.</li>
<li><strong>Không hiệu quả</strong>: <code>findMin</code> (tìm nhỏ nhất), <code>findMax</code> (tìm lớn nhất), in cả bảng theo thứ tự — các khoá cố tình bị rải lung tung, nên những việc này phải quét mọi phần tử, O(n), cộng thêm O(n log n) nếu cần sắp xếp.</li>
<li><strong>Cây BST giữ các khoá theo thứ tự</strong>: <code>findMin</code> chỉ là đi dọc mép trái — O(log n) khi cây cân bằng.</li>
</ul>
<pre><code class="language-java">import java.util.HashSet;
import java.util.TreeSet;

public class HashVsTree {
    public static void main(String[] args) {
        int[] keys = {35, 8, 21, 60, 3, 47};
        HashSet&lt;Integer&gt; hash = new HashSet&lt;Integer&gt;();      // một bảng băm
        TreeSet&lt;Integer&gt; tree = new TreeSet&lt;Integer&gt;();      // một BST cân bằng (cây đỏ-đen)
        for (int k : keys) { hash.add(k); tree.add(k); }
        System.out.println("inserted:      [35, 8, 21, 60, 3, 47]");
        System.out.println("HashSet order: " + hash + "   &lt;- cell order, not sorted");
        System.out.println("TreeSet order: " + tree + "   &lt;- sorted");
        int min = Integer.MAX_VALUE, looked = 0;
        for (int k : hash) { looked++; if (k &lt; min) min = k; }   // findMin trên bảng băm: phải xem mọi khoá
        System.out.println("hash table findMin = " + min + " after looking at " + looked + " of " + hash.size() + " keys: O(n)");
        System.out.println("TreeSet first()    = " + tree.first() + " by walking the left edge: O(log n)");
        System.out.println("contains(60): hash " + hash.contains(60) + ", tree " + tree.contains(60) + "  &lt;- both fast");
    }
}</code></pre>
<div class="out">inserted: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[35, 8, 21, 60, 3, 47]<br>
HashSet order: [35, 3, 21, 8, 60, 47] &nbsp;&nbsp;&lt;- cell order, not sorted<br>
TreeSet order: [3, 8, 21, 35, 47, 60] &nbsp;&nbsp;&lt;- sorted<br>
hash table findMin = 3 after looking at 6 of 6 keys: O(n)<br>
TreeSet first() &nbsp;&nbsp;&nbsp;= 3 by walking the left edge: O(log n)<br>
contains(60): hash true, tree true &nbsp;&lt;- both fast</div>
<p><code>HashSet</code> in các khoá theo thứ tự các ô của nó — không phải thứ tự chèn, cũng không được sắp xếp — nên muốn tìm nhỏ nhất phải xem cả 6 khoá. <code>TreeSet</code> (một BST cân bằng) trả lời trong O(log n). Còn <code>contains</code> (có chứa không) thì cả hai đều nhanh.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> băm = "khoá k ở đâu?" trong một bước nhảy; cây = "đứng trước/sau k là gì?". Cần cả nhanh lẫn thứ tự? Dùng <code>TreeMap</code>/<code>TreeSet</code>, O(log n).</p>
<div class="pitfall">Câu FE "Thao tác nào KHÔNG hiệu quả trên bảng băm?" — đáp án là thao tác cần thứ tự: tìm min/max hoặc in theo thứ tự tăng dần. Chèn, xoá, tìm theo khoá mới là các thao tác hiệu quả.</div>`],
      [5, 'General Idea',
        `<p class="y-chinh">🎯 The ideal hash table is just an array of fixed size TableSize; each item has a key, and a hash function maps that key to an index from 0 to TableSize − 1.</p>
<ul>
<li><strong>Key</strong>: the data member used to compute the index — an integer, a string… for example the ID or the name inside a large employee record.</li>
<li><strong>TableSize</strong>: the length of the array; items sit at the indexes 0 … TableSize − 1.</li>
<li><strong>Hash function</strong>: the mapping key → index. The program below uses the simplest one, <code>id % TableSize</code>.</li>
</ul>
<pre><code class="language-java">class Employee {
    int id;              // the key
    String name;
    int salary;

    Employee(int id, String name, int salary) { this.id = id; this.name = name; this.salary = salary; }
    public String toString() { return id + " " + name + " " + salary; }
}

public class IdTable {
    static final int TABLE_SIZE = 10;
    static Employee[] table = new Employee[TABLE_SIZE];

    static int hash(int key) { return key % TABLE_SIZE; }      // key -&gt; index 0..TableSize-1

    static void put(Employee e) { table[hash(e.id)] = e; }      // collisions are ignored until slide 15

    static Employee get(int id) {
        Employee e = table[hash(id)];                           // jump straight to one cell
        return (e != null &amp;&amp; e.id == id) ? e : null;            // the cell must hold THIS key
    }

    public static void main(String[] args) {
        put(new Employee(1003, "An", 1500));
        put(new Employee(2017, "Binh", 1800));
        put(new Employee(3025, "Chi", 2100));
        for (int i = 0; i &lt; TABLE_SIZE; i++)
            System.out.println("[" + i + "] " + (table[i] == null ? "-" : table[i].toString()));
        System.out.println("get(2017) -&gt; " + get(2017));
        System.out.println("get(4443) -&gt; " + get(4443) + "   (cell 3 holds key 1003, not 4443)");
    }
}</code></pre>
<div class="out">[0] -<br>
[1] -<br>
[2] -<br>
[3] 1003 An 1500<br>
[4] -<br>
[5] 3025 Chi 2100<br>
[6] -<br>
[7] 2017 Binh 1800<br>
[8] -<br>
[9] -<br>
get(2017) -&gt; 2017 Binh 1800<br>
get(4443) -&gt; null &nbsp;&nbsp;(cell 3 holds key 1003, not 4443)</div>
<p><code>get(4443)</code> shows why the whole item, key included, is stored in the cell: cell 3 is occupied, but by key 1003, so the search must compare keys before answering.</p>
<p><strong>Big-O:</strong> <code>hash</code> is a single <code>%</code> and the array access is O(1), so <code>put</code> and <code>get</code> are O(1) — as long as no two keys want the same cell (slide 15).</p>
<div class="pitfall">The index must be in 0 … TableSize − 1. A hash function that can return TableSize (or a negative number, slide 29) crashes with <code>ArrayIndexOutOfBoundsException</code>.</div>`,
        `<p class="y-chinh">🎯 Bảng băm lý tưởng chỉ là một mảng có kích thước cố định TableSize; mỗi phần tử có một khoá (key), và hàm băm (hash function) ánh xạ khoá đó thành một chỉ số từ 0 tới TableSize − 1.</p>
<ul>
<li><strong>Khoá</strong>: trường dữ liệu dùng để tính chỉ số — số nguyên, chuỗi… ví dụ mã (ID) hoặc tên nằm trong một bản ghi nhân viên lớn.</li>
<li><strong>TableSize</strong> (kích thước bảng): độ dài của mảng; các phần tử nằm ở chỉ số 0 … TableSize − 1.</li>
<li><strong>Hàm băm</strong>: phép ánh xạ khoá → chỉ số. Chương trình dưới dùng hàm đơn giản nhất, <code>id % TableSize</code>.</li>
</ul>
<pre><code class="language-java">class Employee {
    int id;              // khoá
    String name;
    int salary;

    Employee(int id, String name, int salary) { this.id = id; this.name = name; this.salary = salary; }
    public String toString() { return id + " " + name + " " + salary; }
}

public class IdTable {
    static final int TABLE_SIZE = 10;
    static Employee[] table = new Employee[TABLE_SIZE];

    static int hash(int key) { return key % TABLE_SIZE; }      // khoá -&gt; chỉ số 0..TableSize-1

    static void put(Employee e) { table[hash(e.id)] = e; }      // tạm bỏ qua va chạm (xem từ slide 15)

    static Employee get(int id) {
        Employee e = table[hash(id)];                           // nhảy thẳng tới một ô
        return (e != null &amp;&amp; e.id == id) ? e : null;            // ô đó phải chứa ĐÚNG khoá này
    }

    public static void main(String[] args) {
        put(new Employee(1003, "An", 1500));
        put(new Employee(2017, "Binh", 1800));
        put(new Employee(3025, "Chi", 2100));
        for (int i = 0; i &lt; TABLE_SIZE; i++)
            System.out.println("[" + i + "] " + (table[i] == null ? "-" : table[i].toString()));
        System.out.println("get(2017) -&gt; " + get(2017));
        System.out.println("get(4443) -&gt; " + get(4443) + "   (cell 3 holds key 1003, not 4443)");
    }
}</code></pre>
<div class="out">[0] -<br>
[1] -<br>
[2] -<br>
[3] 1003 An 1500<br>
[4] -<br>
[5] 3025 Chi 2100<br>
[6] -<br>
[7] 2017 Binh 1800<br>
[8] -<br>
[9] -<br>
get(2017) -&gt; 2017 Binh 1800<br>
get(4443) -&gt; null &nbsp;&nbsp;(cell 3 holds key 1003, not 4443)</div>
<p><code>get(4443)</code> cho thấy vì sao phải lưu cả phần tử (kèm khoá) trong ô: ô 3 có người, nhưng là khoá 1003, nên phép tìm phải so khoá rồi mới trả lời.</p>
<p><strong>Big-O:</strong> <code>hash</code> chỉ là một phép <code>%</code>, truy cập mảng là O(1), nên <code>put</code> và <code>get</code> đều O(1) — miễn là không có hai khoá cùng đòi một ô (slide 15).</p>
<div class="pitfall">Chỉ số phải nằm trong 0 … TableSize − 1. Hàm băm nào có thể trả về TableSize (hoặc số âm, slide 29) sẽ làm chương trình văng <code>ArrayIndexOutOfBoundsException</code> (lỗi chỉ số ngoài mảng).</div>`],
      [6, 'Hash Table Example - 1',
        `<p class="y-chinh">🎯 The example: four items — mary 28200, dave 27500, phil 31250, john 25000 — pass through a hash function that turns each key into one of the indexes 0–9 of the hash table.</p>
<ul>
<li>Each item is a (name, salary) record; the name plays the role of the key. Only the key enters the hash function, but the whole item is stored in the cell it returns.</li>
<li>The slide does not state which hash function its picture uses, so the cells shown there cannot be recomputed here. Instead, the lesson's own hash function — the sum of the character codes, modulo 10 — shows how such a cell is computed.</li>
</ul>
<pre><code class="language-java">public class NameHash {
    // the lesson's own hash function: sum of the character codes % tableSize
    static int sumOfCodes(String key) {
        int sum = 0;
        for (int i = 0; i &lt; key.length(); i++) sum += key.charAt(i);
        return sum;
    }

    public static void main(String[] args) {
        String[] names = {"mary", "dave", "phil", "john"};
        int[] salary = {28200, 27500, 31250, 25000};
        String[] table = new String[10];
        for (int i = 0; i &lt; names.length; i++) {
            int sum = sumOfCodes(names[i]);
            int h = sum % 10;
            System.out.print(names[i] + ": sum of codes = " + sum + ", " + sum + " % 10 = " + h);
            if (table[h] == null) {
                table[h] = names[i] + " " + salary[i];
                System.out.println("  -&gt; stored in cell " + h);
            } else {
                System.out.println("  -&gt; cell " + h + " already holds " + table[h] + ": COLLISION");
            }
        }
        for (int i = 0; i &lt; 10; i++) System.out.println("[" + i + "] " + (table[i] == null ? "-" : table[i]));
    }
}</code></pre>
<div class="out">mary: sum of codes = 441, 441 % 10 = 1 &nbsp;-&gt; stored in cell 1<br>
dave: sum of codes = 416, 416 % 10 = 6 &nbsp;-&gt; stored in cell 6<br>
phil: sum of codes = 429, 429 % 10 = 9 &nbsp;-&gt; stored in cell 9<br>
john: sum of codes = 431, 431 % 10 = 1 &nbsp;-&gt; cell 1 already holds mary 28200: COLLISION<br>
[0] -<br>
[1] mary 28200<br>
[2] -<br>
[3] -<br>
[4] -<br>
[5] -<br>
[6] dave 27500<br>
[7] -<br>
[8] -<br>
[9] phil 31250</div>
<ul>
<li>mary, dave and phil go to cells 1, 6 and 9. But "john" sums to 431, and 431 % 10 = 1: cell 1 already holds mary — a <strong>collision</strong> (slide 15). Four keys, ten cells, and two of them already clash.</li>
<li>Where john should go instead is exactly what slides 16–25 answer.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> key → hash function → index → cell. The cell stores the whole record; the function only ever sees the key.</p>`,
        `<p class="y-chinh">🎯 Ví dụ: bốn phần tử — mary 28200, dave 27500, phil 31250, john 25000 — đi qua một hàm băm, hàm này biến khoá của mỗi phần tử thành một trong các chỉ số 0–9 của bảng băm.</p>
<ul>
<li>Mỗi phần tử là một bản ghi (tên, lương); tên đóng vai trò khoá (key). Chỉ khoá đi vào hàm băm, nhưng cả phần tử được cất vào ô mà hàm trả về.</li>
<li>Slide không nói hình của nó dùng hàm băm nào, nên ở đây không tính lại được đúng các ô trong hình. Thay vào đó, hàm băm riêng của bài — tổng mã các ký tự, chia lấy dư cho 10 — cho thấy một ô được tính ra như thế nào.</li>
</ul>
<pre><code class="language-java">public class NameHash {
    // hàm băm riêng của bài: tổng mã các ký tự % tableSize
    static int sumOfCodes(String key) {
        int sum = 0;
        for (int i = 0; i &lt; key.length(); i++) sum += key.charAt(i);
        return sum;
    }

    public static void main(String[] args) {
        String[] names = {"mary", "dave", "phil", "john"};
        int[] salary = {28200, 27500, 31250, 25000};
        String[] table = new String[10];
        for (int i = 0; i &lt; names.length; i++) {
            int sum = sumOfCodes(names[i]);
            int h = sum % 10;
            System.out.print(names[i] + ": sum of codes = " + sum + ", " + sum + " % 10 = " + h);
            if (table[h] == null) {
                table[h] = names[i] + " " + salary[i];
                System.out.println("  -&gt; stored in cell " + h);
            } else {
                System.out.println("  -&gt; cell " + h + " already holds " + table[h] + ": COLLISION");
            }
        }
        for (int i = 0; i &lt; 10; i++) System.out.println("[" + i + "] " + (table[i] == null ? "-" : table[i]));
    }
}</code></pre>
<div class="out">mary: sum of codes = 441, 441 % 10 = 1 &nbsp;-&gt; stored in cell 1<br>
dave: sum of codes = 416, 416 % 10 = 6 &nbsp;-&gt; stored in cell 6<br>
phil: sum of codes = 429, 429 % 10 = 9 &nbsp;-&gt; stored in cell 9<br>
john: sum of codes = 431, 431 % 10 = 1 &nbsp;-&gt; cell 1 already holds mary 28200: COLLISION<br>
[0] -<br>
[1] mary 28200<br>
[2] -<br>
[3] -<br>
[4] -<br>
[5] -<br>
[6] dave 27500<br>
[7] -<br>
[8] -<br>
[9] phil 31250</div>
<ul>
<li>mary, dave, phil vào các ô 1, 6, 9. Nhưng "john" có tổng 431, và 431 % 10 = 1: ô 1 đã có mary — một <strong>va chạm (collision)</strong> (slide 15). Bốn khoá, mười ô, mà đã có hai khoá đụng nhau.</li>
<li>John phải đi đâu thay thế — đó chính là điều slide 16–25 trả lời.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoá → hàm băm → chỉ số → ô. Ô cất cả bản ghi; hàm băm chỉ nhìn thấy khoá.</p>`],
      [7, 'Hash Function - 1',
        `<p class="y-chinh">🎯 A good hash function has two duties: it must be simple to compute, and it must distribute the keys evenly among the cells.</p>
<ul>
<li><strong>Simple to compute</strong>: it runs on every insert, search and delete; a slow hash function eats the O(1) advantage.</li>
<li><strong>Even distribution</strong>: when many keys share a cell, those keys must be searched one by one there.</li>
<li><strong>Perfect hash function</strong>: if we know in advance which keys will occur (the reserved words of a language, say), we can build a function with no collision at all — slide 26. In most cases we do not know them.</li>
</ul>
<pre><code class="language-java">public class HashSpread {
    static int firstLetter(String s) { return s.charAt(0) % 10; }          // uses one character only

    static int polynomial(String s) {                                      // uses every character
        int h = 0;
        for (int i = 0; i &lt; s.length(); i++) h = 31 * h + s.charAt(i);
        return Math.floorMod(h, 10);
    }

    static String counts(String[] keys, boolean poly) {
        int[] c = new int[10];
        int worst = 0;
        for (String k : keys) {
            int i = poly ? polynomial(k) : firstLetter(k);
            c[i]++;
            worst = Math.max(worst, c[i]);
        }
        StringBuilder s = new StringBuilder();
        for (int x : c) s.append(String.format("%3d", x));
        return s + "   | fullest cell: " + worst + " keys";
    }

    public static void main(String[] args) {
        String[] ids = new String[20];
        for (int i = 0; i &lt; 20; i++) ids[i] = String.format("SE1700%02d", i + 1);   // SE170001 .. SE170020
        System.out.println("keys: " + ids[0] + " .. " + ids[19] + " (20 student IDs), 10 cells");
        System.out.println("cell:              0  1  2  3  4  5  6  7  8  9");
        System.out.println("first letter:   " + counts(ids, false));
        System.out.println("polynomial:     " + counts(ids, true));
    }
}</code></pre>
<div class="out">keys: SE170001 .. SE170020 (20 student IDs), 10 cells<br>
cell: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;1 &nbsp;2 &nbsp;3 &nbsp;4 &nbsp;5 &nbsp;6 &nbsp;7 &nbsp;8 &nbsp;9<br>
first letter: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 &nbsp;0 20 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;| fullest cell: 20 keys<br>
polynomial: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;2 &nbsp;1 &nbsp;2 &nbsp;3 &nbsp;2 &nbsp;2 &nbsp;2 &nbsp;2 &nbsp;2 &nbsp;&nbsp;| fullest cell: 3 keys</div>
<p>Same 20 keys, same 10 cells. The function that looks only at the first letter sends all 20 keys to cell 3 — every ID starts with S — so a search there is a linear search. The polynomial function uses every character and never puts more than 3 keys in a cell.</p>
<div class="pitfall">A hash function that ignores part of the key (only the first letter, only the length, only the first digits) is the classic "bad hash function" in FE questions: keys that differ only in the ignored part always collide.</div>`,
        `<p class="y-chinh">🎯 Hàm băm tốt có hai nhiệm vụ: phải dễ tính, và phải phân bố các khoá đều khắp các ô.</p>
<ul>
<li><strong>Dễ tính</strong>: nó chạy trong mọi lần chèn, tìm, xoá; hàm băm chậm sẽ ăn mất lợi thế O(1).</li>
<li><strong>Phân bố đều</strong>: khi nhiều khoá chung một ô, các khoá đó phải được tìm lần lượt từng cái tại đó.</li>
<li><strong>Hàm băm hoàn hảo (perfect hash function)</strong>: nếu biết trước những khoá nào sẽ xuất hiện (ví dụ các từ khoá dành riêng của một ngôn ngữ), ta dựng được một hàm không hề có va chạm (collision) — slide 26. Còn đa số trường hợp ta không biết trước.</li>
</ul>
<pre><code class="language-java">public class HashSpread {
    static int firstLetter(String s) { return s.charAt(0) % 10; }          // chỉ dùng một ký tự

    static int polynomial(String s) {                                      // dùng mọi ký tự
        int h = 0;
        for (int i = 0; i &lt; s.length(); i++) h = 31 * h + s.charAt(i);
        return Math.floorMod(h, 10);
    }

    static String counts(String[] keys, boolean poly) {
        int[] c = new int[10];
        int worst = 0;
        for (String k : keys) {
            int i = poly ? polynomial(k) : firstLetter(k);
            c[i]++;
            worst = Math.max(worst, c[i]);
        }
        StringBuilder s = new StringBuilder();
        for (int x : c) s.append(String.format("%3d", x));
        return s + "   | fullest cell: " + worst + " keys";
    }

    public static void main(String[] args) {
        String[] ids = new String[20];
        for (int i = 0; i &lt; 20; i++) ids[i] = String.format("SE1700%02d", i + 1);   // SE170001 .. SE170020
        System.out.println("keys: " + ids[0] + " .. " + ids[19] + " (20 student IDs), 10 cells");
        System.out.println("cell:              0  1  2  3  4  5  6  7  8  9");
        System.out.println("first letter:   " + counts(ids, false));
        System.out.println("polynomial:     " + counts(ids, true));
    }
}</code></pre>
<div class="out">keys: SE170001 .. SE170020 (20 student IDs), 10 cells<br>
cell: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;1 &nbsp;2 &nbsp;3 &nbsp;4 &nbsp;5 &nbsp;6 &nbsp;7 &nbsp;8 &nbsp;9<br>
first letter: &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;0 &nbsp;0 20 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;0 &nbsp;&nbsp;| fullest cell: 20 keys<br>
polynomial: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;2 &nbsp;1 &nbsp;2 &nbsp;3 &nbsp;2 &nbsp;2 &nbsp;2 &nbsp;2 &nbsp;2 &nbsp;&nbsp;| fullest cell: 3 keys</div>
<p>Cùng 20 khoá, cùng 10 ô. Hàm chỉ nhìn chữ cái đầu đẩy cả 20 khoá vào ô 3 — mã sinh viên nào cũng bắt đầu bằng S — nên tìm trong ô đó chẳng khác gì tìm tuần tự. Hàm đa thức (polynomial) dùng mọi ký tự và không để ô nào quá 3 khoá.</p>
<div class="pitfall">Hàm băm bỏ qua một phần của khoá (chỉ lấy chữ cái đầu, chỉ lấy độ dài, chỉ lấy vài chữ số đầu) là ví dụ "hàm băm tồi" kinh điển trong câu hỏi FE: các khoá chỉ khác nhau ở phần bị bỏ qua sẽ luôn va chạm.</div>`],
      [8, 'Hash Function - 2 (Problems)',
        `<p class="y-chinh">🎯 Three problems make hashing hard: keys may not be numbers, there are far more possible keys than cells, and therefore different keys must sometimes share a cell — a collision.</p>
<ul>
<li><strong>Non-numeric keys</strong>: a name or a code must first be turned into a number (slides 9 and 29).</li>
<li><strong>Huge key space</strong>: nine-digit IDs have 900 million possible values; a table has thousands of cells.</li>
<li><strong>Not one-to-one</strong>: with more possible keys than cells, some cell must be shared (the pigeonhole principle) → <strong>collision</strong>.</li>
<li><strong>Too many collisions</strong>: keys pile up in a few cells, every search walks through them, and O(1) turns into O(n).</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class Birthday {
    // n keys hashed uniformly into m cells: probability of at least one collision
    static double pCollision(int n, int m) {
        double pNone = 1.0;
        for (int i = 0; i &lt; n; i++) pNone *= (double) (m - i) / m;   // key i+1 must miss the i cells already used
        return 1 - pNone;
    }

    public static void main(String[] args) {
        int[][] cases = {{10, 365}, {23, 365}, {50, 365}, {100, 10000}, {11, 10}};
        for (int[] c : cases) {
            double full = 100.0 * c[0] / c[1];
            System.out.println(String.format(Locale.US, "%4d keys into %5d cells (%5.1f%% full): P(some collision) = %5.1f%%",
                    c[0], c[1], full, 100 * pCollision(c[0], c[1])));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;10 keys into &nbsp;&nbsp;365 cells ( &nbsp;2.7% full): P(some collision) = &nbsp;11.7%<br>
&nbsp;&nbsp;23 keys into &nbsp;&nbsp;365 cells ( &nbsp;6.3% full): P(some collision) = &nbsp;50.7%<br>
&nbsp;&nbsp;50 keys into &nbsp;&nbsp;365 cells ( 13.7% full): P(some collision) = &nbsp;97.0%<br>
&nbsp;100 keys into 10000 cells ( &nbsp;1.0% full): P(some collision) = &nbsp;39.1%<br>
&nbsp;&nbsp;11 keys into &nbsp;&nbsp;&nbsp;10 cells (110.0% full): P(some collision) = 100.0%</div>
<p>Collisions arrive much earlier than intuition says (the "birthday paradox"): 23 keys in 365 cells already collide with probability 50.7%, and 100 keys in 10,000 cells — a table only 1% full — with probability 39.1%. Conclusion: collisions cannot be avoided; they must be handled.</p>
<p class="meo">🧠 <strong>Remember:</strong> in a class of 23 students it is more likely than not that two share a birthday. A hash table is that class.</p>`,
        `<p class="y-chinh">🎯 Ba vấn đề khiến băm khó: khoá có thể không phải là số, số khoá có thể có lớn hơn rất nhiều so với số ô, và vì thế các khoá khác nhau đôi khi buộc phải chung một ô — va chạm (collision).</p>
<ul>
<li><strong>Khoá không phải số</strong>: tên hay mã chữ phải được đổi thành số trước (slide 9 và 29).</li>
<li><strong>Không gian khoá khổng lồ</strong>: mã số 9 chữ số có 900 triệu giá trị có thể; bảng thì chỉ vài nghìn ô.</li>
<li><strong>Không phải đơn ánh (one-to-one)</strong>: số khoá có thể có nhiều hơn số ô thì chắc chắn có ô bị dùng chung (nguyên lý chuồng bồ câu — pigeonhole principle) → <strong>va chạm</strong>.</li>
<li><strong>Quá nhiều va chạm</strong>: khoá dồn vào vài ô, lần tìm nào cũng phải đi qua chúng, và O(1) biến thành O(n).</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class Birthday {
    // n khoá băm đều vào m ô: xác suất có ít nhất một va chạm
    static double pCollision(int n, int m) {
        double pNone = 1.0;
        for (int i = 0; i &lt; n; i++) pNone *= (double) (m - i) / m;   // khoá thứ i+1 phải tránh i ô đã dùng
        return 1 - pNone;
    }

    public static void main(String[] args) {
        int[][] cases = {{10, 365}, {23, 365}, {50, 365}, {100, 10000}, {11, 10}};
        for (int[] c : cases) {
            double full = 100.0 * c[0] / c[1];
            System.out.println(String.format(Locale.US, "%4d keys into %5d cells (%5.1f%% full): P(some collision) = %5.1f%%",
                    c[0], c[1], full, 100 * pCollision(c[0], c[1])));
        }
    }
}</code></pre>
<div class="out">&nbsp;&nbsp;10 keys into &nbsp;&nbsp;365 cells ( &nbsp;2.7% full): P(some collision) = &nbsp;11.7%<br>
&nbsp;&nbsp;23 keys into &nbsp;&nbsp;365 cells ( &nbsp;6.3% full): P(some collision) = &nbsp;50.7%<br>
&nbsp;&nbsp;50 keys into &nbsp;&nbsp;365 cells ( 13.7% full): P(some collision) = &nbsp;97.0%<br>
&nbsp;100 keys into 10000 cells ( &nbsp;1.0% full): P(some collision) = &nbsp;39.1%<br>
&nbsp;&nbsp;11 keys into &nbsp;&nbsp;&nbsp;10 cells (110.0% full): P(some collision) = 100.0%</div>
<p>Va chạm tới sớm hơn nhiều so với trực giác (nghịch lý ngày sinh — birthday paradox): 23 khoá trong 365 ô đã có xác suất va chạm 50,7%, còn 100 khoá trong 10.000 ô — bảng mới đầy 1% — có xác suất 39,1%. Kết luận: không tránh được va chạm, chỉ có thể xử lý nó.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> lớp có 23 sinh viên thì nhiều khả năng có hai bạn trùng ngày sinh. Bảng băm chính là lớp học đó.</p>`],
      [9, 'Hash Function - 3',
        `<p class="y-chinh">🎯 For integer keys, Key mod TableSize is the general strategy — unless the keys have a pattern that this table size amplifies; string keys must first be converted into a number.</p>
<ul>
<li><strong>The slide's warning</strong>: if all keys end in 0 and TableSize = 10, then key % 10 = 0 for every key — the whole table collapses into cell 0.</li>
<li><strong>Change the table size</strong>: with 11 cells the same ten keys land in ten different cells.</li>
<li><strong>String keys</strong>: first turn the characters into one number. The usual way is a polynomial, h = s₀·31ⁿ⁻¹ + s₁·31ⁿ⁻² + … + sₙ₋₁, computed by Horner's rule <code>h = 31*h + c</code> — exactly Java's <code>String.hashCode()</code>.</li>
</ul>
<pre><code class="language-java">public class ModTen {
    static void spread(int[] keys, int m) {
        boolean[] used = new boolean[m];
        int cells = 0;
        StringBuilder s = new StringBuilder();
        for (int k : keys) {
            int h = k % m;
            s.append(k).append("-&gt;").append(h).append(' ');
            if (!used[h]) { used[h] = true; cells++; }
        }
        System.out.println("key % " + m + ": " + s + " | " + cells + " cell(s) used");
    }

    public static void main(String[] args) {
        int[] prices = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};   // every key ends in 0
        spread(prices, 10);
        spread(prices, 11);
        String s = "cat";
        int h = 0;
        for (int i = 0; i &lt; s.length(); i++) h = 31 * h + s.charAt(i);   // string -&gt; number first
        System.out.println("\\"cat\\" -&gt; 99*31*31 + 97*31 + 116 = " + h + "   (String.hashCode() = " + s.hashCode() + ")");
        System.out.println("then " + h + " % 11 = " + h % 11);
    }
}</code></pre>
<div class="out">key % 10: 10-&gt;0 20-&gt;0 30-&gt;0 40-&gt;0 50-&gt;0 60-&gt;0 70-&gt;0 80-&gt;0 90-&gt;0 100-&gt;0 &nbsp;| 1 cell(s) used<br>
key % 11: 10-&gt;10 20-&gt;9 30-&gt;8 40-&gt;7 50-&gt;6 60-&gt;5 70-&gt;4 80-&gt;3 90-&gt;2 100-&gt;1 &nbsp;| 10 cell(s) used<br>
"cat" -&gt; 99*31*31 + 97*31 + 116 = 98262 &nbsp;&nbsp;(String.hashCode() = 98262)<br>
then 98262 % 11 = 10</div>
<p><strong>Big-O:</strong> converting a string of length L costs O(L); after that the index is one <code>%</code>.</p>
<div class="pitfall">Adding the character codes without weights is a weak string hash: anagrams such as "listen" and "silent" always collide. The weights 31ⁱ make the <em>position</em> of every character count.</div>`,
        `<p class="y-chinh">🎯 Với khoá là số nguyên, Key mod TableSize (khoá chia lấy dư cho kích thước bảng) là chiến lược chung — trừ khi các khoá có một quy luật mà kích thước bảng đó khuếch đại lên; còn khoá là chuỗi thì phải đổi thành số trước.</p>
<ul>
<li><strong>Lời cảnh báo trên slide</strong>: nếu mọi khoá đều tận cùng bằng 0 và TableSize = 10, thì key % 10 = 0 với mọi khoá — cả bảng dồn hết vào ô 0.</li>
<li><strong>Đổi kích thước bảng</strong>: với 11 ô, cùng mười khoá đó rơi vào mười ô khác nhau.</li>
<li><strong>Khoá là chuỗi</strong>: đổi các ký tự thành một con số trước. Cách thông dụng là đa thức (polynomial), h = s₀·31ⁿ⁻¹ + s₁·31ⁿ⁻² + … + sₙ₋₁, tính theo quy tắc Horner <code>h = 31*h + c</code> — đúng y như <code>String.hashCode()</code> của Java.</li>
</ul>
<pre><code class="language-java">public class ModTen {
    static void spread(int[] keys, int m) {
        boolean[] used = new boolean[m];
        int cells = 0;
        StringBuilder s = new StringBuilder();
        for (int k : keys) {
            int h = k % m;
            s.append(k).append("-&gt;").append(h).append(' ');
            if (!used[h]) { used[h] = true; cells++; }
        }
        System.out.println("key % " + m + ": " + s + " | " + cells + " cell(s) used");
    }

    public static void main(String[] args) {
        int[] prices = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};   // mọi khoá đều tận cùng bằng 0
        spread(prices, 10);
        spread(prices, 11);
        String s = "cat";
        int h = 0;
        for (int i = 0; i &lt; s.length(); i++) h = 31 * h + s.charAt(i);   // đổi chuỗi -&gt; số trước
        System.out.println("\\"cat\\" -&gt; 99*31*31 + 97*31 + 116 = " + h + "   (String.hashCode() = " + s.hashCode() + ")");
        System.out.println("then " + h + " % 11 = " + h % 11);
    }
}</code></pre>
<div class="out">key % 10: 10-&gt;0 20-&gt;0 30-&gt;0 40-&gt;0 50-&gt;0 60-&gt;0 70-&gt;0 80-&gt;0 90-&gt;0 100-&gt;0 &nbsp;| 1 cell(s) used<br>
key % 11: 10-&gt;10 20-&gt;9 30-&gt;8 40-&gt;7 50-&gt;6 60-&gt;5 70-&gt;4 80-&gt;3 90-&gt;2 100-&gt;1 &nbsp;| 10 cell(s) used<br>
"cat" -&gt; 99*31*31 + 97*31 + 116 = 98262 &nbsp;&nbsp;(String.hashCode() = 98262)<br>
then 98262 % 11 = 10</div>
<p><strong>Big-O:</strong> đổi một chuỗi dài L tốn O(L); sau đó chỉ số chỉ là một phép <code>%</code>.</p>
<div class="pitfall">Cộng mã các ký tự mà không có trọng số là hàm băm chuỗi yếu: các từ đảo chữ (anagram) như "listen" và "silent" luôn va chạm. Trọng số 31ⁱ làm cho <em>vị trí</em> của từng ký tự cũng có ý nghĩa.</div>`],
      [10, 'Hash table example - 2',
        `<p class="y-chinh">🎯 A textbook design (Goodrich): a map of (ID, Name) entries, where ID is a nine-digit positive integer, stored in an array of N = 10,000 cells with h(x) = the last four digits of x.</p>
<ul>
<li><strong>Last four digits</strong> = <code>x % 10000</code> — a division hash (slide 12) with M = 10,000.</li>
<li><strong>Why it can work</strong>: if IDs are handed out so that their last digits look random, the entries spread over the 10,000 cells.</li>
<li><strong>Why collisions still happen</strong>: 900,000,000 possible IDs share 10,000 cells — 90,000 IDs per cell.</li>
</ul>
<pre><code class="language-java">public class LastFour {
    static final int N = 10000;                   // table size from the slide

    static int h(int id) { return id % N; }       // the last four digits of the ID

    public static void main(String[] args) {
        int[] ids = {201234567, 199887766, 305550001, 401234567};
        String[] names = {"An", "Binh", "Chi", "Dung"};
        String[] table = new String[N];
        for (int i = 0; i &lt; ids.length; i++) {
            int k = h(ids[i]);
            System.out.print("(" + ids[i] + ", " + names[i] + ") -&gt; h = " + k);
            if (table[k] == null) {
                table[k] = names[i];
                System.out.println("  -&gt; cell " + k);
            } else {
                System.out.println("  -&gt; cell " + k + " already holds " + table[k] + ": collision");
            }
        }
        int possible = 999999999 - 100000000 + 1;     // all nine-digit IDs
        System.out.println(possible + " possible IDs / " + N + " cells = " + possible / N + " IDs share each cell");
    }
}</code></pre>
<div class="out">(201234567, An) -&gt; h = 4567 &nbsp;-&gt; cell 4567<br>
(199887766, Binh) -&gt; h = 7766 &nbsp;-&gt; cell 7766<br>
(305550001, Chi) -&gt; h = 1 &nbsp;-&gt; cell 1<br>
(401234567, Dung) -&gt; h = 4567 &nbsp;-&gt; cell 4567 already holds An: collision<br>
900000000 possible IDs / 10000 cells = 90000 IDs share each cell</div>
<p>The IDs and names are the lesson's own example: An and Dung have different IDs with the same last four digits, 4567 — a collision that the design must handle (slides 15–25).</p>
<div class="pitfall">N = 10,000 = 10⁴ is a power of 10: h keeps the last 4 decimal digits and ignores the other 5. If the IDs had a pattern in their last digits (for example all ending in 0000 for one branch), the table would degrade — the same weakness slide 12 describes for M = 2ᵖ.</div>`,
        `<p class="y-chinh">🎯 Một thiết kế trong giáo trình (Goodrich): map (ánh xạ) chứa các mục (ID, Name), trong đó ID là số nguyên dương 9 chữ số, lưu trong mảng N = 10.000 ô với h(x) = bốn chữ số cuối của x.</p>
<ul>
<li><strong>Bốn chữ số cuối</strong> = <code>x % 10000</code> — một hàm băm chia lấy dư (division, slide 12) với M = 10.000.</li>
<li><strong>Vì sao có thể dùng được</strong>: nếu ID được cấp sao cho các chữ số cuối trông như ngẫu nhiên, các mục sẽ rải đều khắp 10.000 ô.</li>
<li><strong>Vì sao vẫn va chạm (collision)</strong>: 900.000.000 ID có thể có phải chia nhau 10.000 ô — mỗi ô ứng với 90.000 ID.</li>
</ul>
<pre><code class="language-java">public class LastFour {
    static final int N = 10000;                   // cỡ bảng trên slide

    static int h(int id) { return id % N; }       // bốn chữ số cuối của ID

    public static void main(String[] args) {
        int[] ids = {201234567, 199887766, 305550001, 401234567};
        String[] names = {"An", "Binh", "Chi", "Dung"};
        String[] table = new String[N];
        for (int i = 0; i &lt; ids.length; i++) {
            int k = h(ids[i]);
            System.out.print("(" + ids[i] + ", " + names[i] + ") -&gt; h = " + k);
            if (table[k] == null) {
                table[k] = names[i];
                System.out.println("  -&gt; cell " + k);
            } else {
                System.out.println("  -&gt; cell " + k + " already holds " + table[k] + ": collision");
            }
        }
        int possible = 999999999 - 100000000 + 1;     // mọi ID chín chữ số
        System.out.println(possible + " possible IDs / " + N + " cells = " + possible / N + " IDs share each cell");
    }
}</code></pre>
<div class="out">(201234567, An) -&gt; h = 4567 &nbsp;-&gt; cell 4567<br>
(199887766, Binh) -&gt; h = 7766 &nbsp;-&gt; cell 7766<br>
(305550001, Chi) -&gt; h = 1 &nbsp;-&gt; cell 1<br>
(401234567, Dung) -&gt; h = 4567 &nbsp;-&gt; cell 4567 already holds An: collision<br>
900000000 possible IDs / 10000 cells = 90000 IDs share each cell</div>
<p>Các ID và tên là ví dụ của bài: An và Dung có ID khác nhau nhưng trùng bốn số cuối 4567 — một va chạm mà thiết kế phải xử lý (slide 15–25).</p>
<div class="pitfall">N = 10.000 = 10⁴ là luỹ thừa của 10: h chỉ giữ 4 chữ số thập phân cuối và bỏ qua 5 chữ số còn lại. Nếu ID có quy luật ở các số cuối (ví dụ mọi ID của một chi nhánh đều tận cùng 0000), bảng sẽ suy biến — đúng điểm yếu mà slide 12 nêu với M = 2ᵖ.</div>`],
      [11, 'How to select Hash Functions?',
        `<p class="y-chinh">🎯 Choose a hash function that is easy to compute, keeps collisions few, and is unbiased: a randomly chosen key lands in each of the M cells with the same probability 1/M.</p>
<ul>
<li><strong>Unbiased</strong>: P(f(x) = i) = 1/M for every cell i, where M is the size of the table. A function with this property is called a <strong>uniform hash function</strong>.</li>
<li><strong>How to check it</strong>: hash many keys and count how many land in each cell — the counts should be nearly equal.</li>
</ul>
<pre><code class="language-java">public class Uniform {
    static void histogram(String name, boolean square) {
        int[] c = new int[10];
        for (int x = 0; x &lt; 10000; x++) {
            int i = square ? (x * x) % 10 : x % 10;
            c[i]++;
        }
        StringBuilder s = new StringBuilder();
        for (int v : c) s.append(String.format("%6d", v));
        System.out.println(name + s);
    }

    public static void main(String[] args) {
        System.out.println("keys 0..9999, M = 10 cells; uniform means 1000 per cell (P = 1/10)");
        System.out.println("cell:         " + "     0     1     2     3     4     5     6     7     8     9");
        histogram("x % 10:       ", false);
        histogram("(x * x) % 10: ", true);
    }
}</code></pre>
<div class="out">keys 0..9999, M = 10 cells; uniform means 1000 per cell (P = 1/10)<br>
cell: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;9<br>
x % 10: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000<br>
(x * x) % 10: &nbsp;&nbsp;1000 &nbsp;2000 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2000 &nbsp;1000 &nbsp;2000 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2000</div>
<ul>
<li><code>x % 10</code> is uniform on the keys 0…9999: exactly 1000 keys per cell.</li>
<li><code>(x * x) % 10</code> is biased: a square never ends in 2, 3, 7 or 8, so those four cells stay empty while cells 1, 4, 6 and 9 receive twice their share. P(f(x) = 2) = 0, not 1/10.</li>
</ul>
<p class="dap-an">✅ <strong>Answer (also the syllabus question "How to select hash functions?"):</strong> (1) fast to compute; (2) uses every part of the key; (3) spreads the keys uniformly — probability 1/M per cell on the real data; (4) for the division method, a prime table size (slide 12).</p>`,
        `<p class="y-chinh">🎯 Chọn hàm băm dễ tính, ít va chạm và không thiên lệch (unbiased): một khoá chọn ngẫu nhiên rơi vào mỗi ô trong M ô với cùng xác suất 1/M.</p>
<ul>
<li><strong>Không thiên lệch</strong>: P(f(x) = i) = 1/M với mọi ô i, trong đó M là kích thước bảng. Hàm có tính chất này gọi là <strong>hàm băm đều (uniform hash function)</strong>.</li>
<li><strong>Cách kiểm tra</strong>: băm thật nhiều khoá rồi đếm số khoá rơi vào từng ô — các con số phải gần bằng nhau.</li>
</ul>
<pre><code class="language-java">public class Uniform {
    static void histogram(String name, boolean square) {
        int[] c = new int[10];
        for (int x = 0; x &lt; 10000; x++) {
            int i = square ? (x * x) % 10 : x % 10;
            c[i]++;
        }
        StringBuilder s = new StringBuilder();
        for (int v : c) s.append(String.format("%6d", v));
        System.out.println(name + s);
    }

    public static void main(String[] args) {
        System.out.println("keys 0..9999, M = 10 cells; uniform means 1000 per cell (P = 1/10)");
        System.out.println("cell:         " + "     0     1     2     3     4     5     6     7     8     9");
        histogram("x % 10:       ", false);
        histogram("(x * x) % 10: ", true);
    }
}</code></pre>
<div class="out">keys 0..9999, M = 10 cells; uniform means 1000 per cell (P = 1/10)<br>
cell: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;&nbsp;&nbsp;7 &nbsp;&nbsp;&nbsp;&nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;9<br>
x % 10: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000 &nbsp;1000<br>
(x * x) % 10: &nbsp;&nbsp;1000 &nbsp;2000 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2000 &nbsp;1000 &nbsp;2000 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2000</div>
<ul>
<li><code>x % 10</code> đều trên các khoá 0…9999: đúng 1000 khoá mỗi ô.</li>
<li><code>(x * x) % 10</code> bị thiên lệch: một số chính phương không bao giờ tận cùng bằng 2, 3, 7, 8, nên bốn ô đó luôn trống trong khi các ô 1, 4, 6, 9 nhận gấp đôi phần của mình. P(f(x) = 2) = 0 chứ không phải 1/10.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án (cũng là câu hỏi của syllabus "Chọn hàm băm thế nào?"):</strong> (1) tính nhanh; (2) dùng mọi phần của khoá; (3) rải khoá đều — xác suất 1/M cho mỗi ô trên dữ liệu thật; (4) với phương pháp chia lấy dư (division), chọn kích thước bảng là số nguyên tố (slide 12).</p>`],
      [12, 'Division Hash Functions',
        `<p class="y-chinh">🎯 Division hashing hD(x) = x % M gives the indexes 0 … M − 1, and everything depends on the choice of M: a prime M works well, an M that shares a factor with a pattern in the keys is biased.</p>
<ul>
<li><strong>M even</strong> → x % M keeps the parity: odd keys go to odd indexes, even keys to even ones. If all keys are even, half of the table is never used.</li>
<li><strong>M = 2ᵖ</strong> → x % M is just the p lowest-order bits of x; the rest of the key is thrown away.</li>
<li><strong>M = p·H</strong> → the keys H, 2H, 3H, … all land on the p positions {H, 2H, …, (p − 1)H, 0} only.</li>
<li><strong>A good M</strong>: a prime that does not divide r<sup>k</sup> ± a for small k and a — Knuth's rule, where r is the radix of the character set (for example 256).</li>
</ul>
<pre><code class="language-java">public class DivisionM {
    // how many different cells do these keys reach with h(x) = x % m?
    static int cellsUsed(int[] keys, int m) {
        boolean[] used = new boolean[m];
        int count = 0;
        for (int x : keys) if (!used[x % m]) { used[x % m] = true; count++; }
        return count;
    }

    static int[] multiples(int step) {                       // step, 2*step, ..., 1000*step
        int[] a = new int[1000];
        for (int i = 0; i &lt; a.length; i++) a[i] = step * (i + 1);
        return a;
    }

    static void show(String keys, int[] a, int bad, String why, int prime) {
        System.out.println(String.format("%-16s M = %2d %-7s -&gt; %2d of %2d cells | M = %2d (prime) -&gt; %2d of %2d cells",
                keys, bad, why, cellsUsed(a, bad), bad, prime, cellsUsed(a, prime), prime));
    }

    public static void main(String[] args) {
        show("even keys", multiples(2), 10, "(even)", 11);
        show("multiples of 8", multiples(8), 16, "(2^4)", 17);
        show("multiples of 5", multiples(5), 20, "(4*5)", 19);
        System.out.println("odd key 37 % 10 = " + 37 % 10 + ", even key 48 % 10 = " + 48 % 10 + "  &lt;- parity is kept when M is even");
    }
}</code></pre>
<div class="out">even keys &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M = 10 (even) &nbsp;-&gt; &nbsp;5 of 10 cells | M = 11 (prime) -&gt; 11 of 11 cells<br>
multiples of 8 &nbsp;&nbsp;M = 16 (2^4) &nbsp;&nbsp;-&gt; &nbsp;2 of 16 cells | M = 17 (prime) -&gt; 17 of 17 cells<br>
multiples of 5 &nbsp;&nbsp;M = 20 (4*5) &nbsp;&nbsp;-&gt; &nbsp;4 of 20 cells | M = 19 (prime) -&gt; 19 of 19 cells<br>
odd key 37 % 10 = 7, even key 48 % 10 = 8 &nbsp;&lt;- parity is kept when M is even</div>
<p>Each row is one of the slide's three "biased!!" cases: 1000 keys with a pattern reach only 5, 2 or 4 cells with the bad M, but every cell with a prime M of about the same size.</p>
<div class="pitfall">A typical FE question: best table size for division hashing among 1000, 1024, 1019 and 1100? Pick the prime, 1019: 1000 and 1100 are even and divisible by 10, and 1024 = 2¹⁰ keeps only the 10 lowest bits of the key.</div>`,
        `<p class="y-chinh">🎯 Băm chia lấy dư (division) hD(x) = x % M cho các chỉ số 0 … M − 1, và mọi thứ phụ thuộc vào việc chọn M: M nguyên tố thì tốt, M có ước chung với quy luật của các khoá thì bị thiên lệch (biased).</p>
<ul>
<li><strong>M chẵn</strong> → x % M giữ nguyên tính chẵn lẻ: khoá lẻ vào chỉ số lẻ, khoá chẵn vào chỉ số chẵn. Nếu mọi khoá đều chẵn thì nửa bảng không bao giờ được dùng.</li>
<li><strong>M = 2ᵖ</strong> → x % M chỉ là p bit thấp nhất (lowest-order bits) của x; phần còn lại của khoá bị vứt bỏ.</li>
<li><strong>M = p·H</strong> → các khoá H, 2H, 3H, … chỉ rơi vào đúng p vị trí {H, 2H, …, (p − 1)H, 0}.</li>
<li><strong>M tốt</strong>: số nguyên tố không chia hết r<sup>k</sup> ± a với k và a nhỏ — quy tắc của Knuth, trong đó r là cơ số (radix) của bộ ký tự (ví dụ 256).</li>
</ul>
<pre><code class="language-java">public class DivisionM {
    // các khoá này rơi vào bao nhiêu ô khác nhau với h(x) = x % m?
    static int cellsUsed(int[] keys, int m) {
        boolean[] used = new boolean[m];
        int count = 0;
        for (int x : keys) if (!used[x % m]) { used[x % m] = true; count++; }
        return count;
    }

    static int[] multiples(int step) {                       // step, 2*step, ..., 1000*step
        int[] a = new int[1000];
        for (int i = 0; i &lt; a.length; i++) a[i] = step * (i + 1);
        return a;
    }

    static void show(String keys, int[] a, int bad, String why, int prime) {
        System.out.println(String.format("%-16s M = %2d %-7s -&gt; %2d of %2d cells | M = %2d (prime) -&gt; %2d of %2d cells",
                keys, bad, why, cellsUsed(a, bad), bad, prime, cellsUsed(a, prime), prime));
    }

    public static void main(String[] args) {
        show("even keys", multiples(2), 10, "(even)", 11);
        show("multiples of 8", multiples(8), 16, "(2^4)", 17);
        show("multiples of 5", multiples(5), 20, "(4*5)", 19);
        System.out.println("odd key 37 % 10 = " + 37 % 10 + ", even key 48 % 10 = " + 48 % 10 + "  &lt;- parity is kept when M is even");
    }
}</code></pre>
<div class="out">even keys &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M = 10 (even) &nbsp;-&gt; &nbsp;5 of 10 cells | M = 11 (prime) -&gt; 11 of 11 cells<br>
multiples of 8 &nbsp;&nbsp;M = 16 (2^4) &nbsp;&nbsp;-&gt; &nbsp;2 of 16 cells | M = 17 (prime) -&gt; 17 of 17 cells<br>
multiples of 5 &nbsp;&nbsp;M = 20 (4*5) &nbsp;&nbsp;-&gt; &nbsp;4 of 20 cells | M = 19 (prime) -&gt; 19 of 19 cells<br>
odd key 37 % 10 = 7, even key 48 % 10 = 8 &nbsp;&lt;- parity is kept when M is even</div>
<p>Mỗi dòng là một trong ba trường hợp "biased!!" (thiên lệch) của slide: 1000 khoá có quy luật chỉ chạm tới 5, 2 hoặc 4 ô với M tồi, nhưng phủ kín mọi ô với M nguyên tố có cỡ tương đương.</p>
<div class="pitfall">Câu FE điển hình: kích thước bảng nào tốt nhất cho băm chia lấy dư trong 1000, 1024, 1019, 1100? Chọn số nguyên tố 1019: 1000 và 1100 là số chẵn lại chia hết cho 10, còn 1024 = 2¹⁰ chỉ giữ 10 bit thấp của khoá.</div>`],
      [13, 'Folding Hash Functions',
        `<p class="y-chinh">🎯 Folding cuts the key into parts of the same length (only the last may be shorter), adds the parts to get y, and uses h(x) = y % M — so every digit of the key influences the index.</p>
<ul>
<li><strong>Shift folding</strong>: add the parts as they are, lined up on their last digit: 723 + 203 + 541 + 213 + 24 = 1704 → 1704 % 1000 = <strong>704</strong>.</li>
<li><strong>Boundary folding</strong>: reverse every other part before adding — like folding a paper strip at the boundaries: x2 = 203 → 302 and x4 = 213 → 312, so 723 + 302 + 541 + 312 + 24 = 1902 → <strong>902</strong>.</li>
</ul>
<p class="nhan">Step by step — x = 72320354121324, parts of 3 digits, M = 1000</p>
<table>
<thead><tr><th>Step</th><th>Part</th><th>Shift folding: sum so far</th><th>Boundary folding: part added</th><th>Sum so far</th></tr></thead>
<tbody>
<tr><td>1</td><td>x1 = 723</td><td>723</td><td>723</td><td>723</td></tr>
<tr><td>2</td><td>x2 = 203</td><td>926</td><td>302 (reversed)</td><td>1025</td></tr>
<tr><td>3</td><td>x3 = 541</td><td>1467</td><td>541</td><td>1566</td></tr>
<tr><td>4</td><td>x4 = 213</td><td>1680</td><td>312 (reversed)</td><td>1878</td></tr>
<tr><td>5</td><td>x5 = 24</td><td>1704 → % 1000 = 704</td><td>24</td><td>1902 → % 1000 = 902</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Folding {
    public static void main(String[] args) {
        String x = "72320354121324";
        int len = 3, m = 1000;
        int shift = 0, boundary = 0;
        StringBuilder s1 = new StringBuilder(), s2 = new StringBuilder();
        for (int i = 0, k = 1; i &lt; x.length(); i += len, k++) {
            String part = x.substring(i, Math.min(i + len, x.length()));     // x1, x2, ... (the last may be shorter)
            String b = (k % 2 == 0) ? new StringBuilder(part).reverse().toString() : part;   // reverse x2, x4, ...
            shift += Integer.parseInt(part);
            boundary += Integer.parseInt(b);
            s1.append(k == 1 ? "" : " + ").append(part);
            s2.append(k == 1 ? "" : " + ").append(b);
        }
        System.out.println("x = " + x + ", parts of " + len + " digits, M = " + m);
        System.out.println("shift folding:    " + s1 + " = " + shift + " -&gt; " + shift + " % " + m + " = " + shift % m);
        System.out.println("boundary folding: " + s2 + " = " + boundary + " -&gt; " + boundary + " % " + m + " = " + boundary % m);
    }
}</code></pre>
<div class="out">x = 72320354121324, parts of 3 digits, M = 1000<br>
shift folding: &nbsp;&nbsp;&nbsp;723 + 203 + 541 + 213 + 24 = 1704 -&gt; 1704 % 1000 = 704<br>
boundary folding: 723 + 302 + 541 + 312 + 24 = 1902 -&gt; 1902 % 1000 = 902</div>
<p><strong>Big-O:</strong> one pass over the digits — O(number of digits).</p>
<div class="pitfall">Boundary folding reverses x2, x4, … — every <em>other</em> part — not every part. Reversing them all gives 327 + 302 + 145 + 312 + 42 = 1128 → 128, a wrong answer that looks plausible in a multiple-choice question.</div>`,
        `<p class="y-chinh">🎯 Gấp số (folding) cắt khoá thành các phần dài bằng nhau (chỉ phần cuối được phép ngắn hơn), cộng các phần lại thành y rồi lấy h(x) = y % M — nhờ vậy chữ số nào của khoá cũng ảnh hưởng tới chỉ số.</p>
<ul>
<li><strong>Gấp dịch (shift folding)</strong>: cộng nguyên các phần, canh thẳng theo chữ số cuối: 723 + 203 + 541 + 213 + 24 = 1704 → 1704 % 1000 = <strong>704</strong>.</li>
<li><strong>Gấp biên (boundary folding)</strong>: đảo ngược các phần xen kẽ trước khi cộng — như gấp một dải giấy tại các đường biên: x2 = 203 → 302 và x4 = 213 → 312, nên 723 + 302 + 541 + 312 + 24 = 1902 → <strong>902</strong>.</li>
</ul>
<p class="nhan">Từng bước — x = 72320354121324, mỗi phần 3 chữ số, M = 1000</p>
<table>
<thead><tr><th>Bước</th><th>Phần</th><th>Gấp dịch: tổng tới lúc này</th><th>Gấp biên: phần được cộng</th><th>Tổng tới lúc này</th></tr></thead>
<tbody>
<tr><td>1</td><td>x1 = 723</td><td>723</td><td>723</td><td>723</td></tr>
<tr><td>2</td><td>x2 = 203</td><td>926</td><td>302 (đảo)</td><td>1025</td></tr>
<tr><td>3</td><td>x3 = 541</td><td>1467</td><td>541</td><td>1566</td></tr>
<tr><td>4</td><td>x4 = 213</td><td>1680</td><td>312 (đảo)</td><td>1878</td></tr>
<tr><td>5</td><td>x5 = 24</td><td>1704 → % 1000 = 704</td><td>24</td><td>1902 → % 1000 = 902</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Folding {
    public static void main(String[] args) {
        String x = "72320354121324";
        int len = 3, m = 1000;
        int shift = 0, boundary = 0;
        StringBuilder s1 = new StringBuilder(), s2 = new StringBuilder();
        for (int i = 0, k = 1; i &lt; x.length(); i += len, k++) {
            String part = x.substring(i, Math.min(i + len, x.length()));     // x1, x2, ... (phần cuối có thể ngắn hơn)
            String b = (k % 2 == 0) ? new StringBuilder(part).reverse().toString() : part;   // đảo x2, x4, ...
            shift += Integer.parseInt(part);
            boundary += Integer.parseInt(b);
            s1.append(k == 1 ? "" : " + ").append(part);
            s2.append(k == 1 ? "" : " + ").append(b);
        }
        System.out.println("x = " + x + ", parts of " + len + " digits, M = " + m);
        System.out.println("shift folding:    " + s1 + " = " + shift + " -&gt; " + shift + " % " + m + " = " + shift % m);
        System.out.println("boundary folding: " + s2 + " = " + boundary + " -&gt; " + boundary + " % " + m + " = " + boundary % m);
    }
}</code></pre>
<div class="out">x = 72320354121324, parts of 3 digits, M = 1000<br>
shift folding: &nbsp;&nbsp;&nbsp;723 + 203 + 541 + 213 + 24 = 1704 -&gt; 1704 % 1000 = 704<br>
boundary folding: 723 + 302 + 541 + 312 + 24 = 1902 -&gt; 1902 % 1000 = 902</div>
<p><strong>Big-O:</strong> đi qua các chữ số một lượt — O(số chữ số).</p>
<div class="pitfall">Gấp biên đảo x2, x4, … — các phần <em>xen kẽ</em> — chứ không đảo mọi phần. Đảo hết sẽ ra 327 + 302 + 145 + 312 + 42 = 1128 → 128, một đáp án sai trông rất hợp lý trong câu trắc nghiệm.</div>`],
      [14, 'Other Hash Functions',
        `<p class="y-chinh">🎯 Three more ways to turn a key into an address: mid-square (square the key, keep the middle part), extraction (use only part of the key) and radix transformation (write the key in another base) — each followed by mod TSize.</p>
<ul>
<li><strong>Mid-square</strong>: 3121² = 9 740 641 → middle digits 406 → index = 406 mod TSize. The middle digits of a square depend on all the digits of the key, so different keys are likely to get different indexes.</li>
<li><strong>Extraction</strong>: only a part of the key is used. In the slide's example the key 123-45-6789 (regrouped there as 1234-5-6789) gives 1289 — its first two digits (12) and its last two (89).</li>
<li><strong>Radix transformation</strong>: 345 in base 10 = 423 in base 9 (4·81 + 2·9 + 3 = 345); the digits 423 are then read as an ordinary number → index = 423 mod TSize.</li>
</ul>
<pre><code class="language-java">public class OtherHashes {
    public static void main(String[] args) {
        int tsize = 1000;                                        // an example table size
        // mid-square: square the key, keep the middle digits
        long key = 3121, sq = key * key;
        String s = Long.toString(sq);
        int start = (s.length() - 3) / 2;
        int mid = Integer.parseInt(s.substring(start, start + 3));
        System.out.println("mid-square: " + key + "^2 = " + sq + " -&gt; middle 3 digits " + mid + " -&gt; " + mid + " % " + tsize + " = " + mid % tsize);
        // extraction: use only part of the key
        String digits = "123-45-6789".replace("-", "");
        int part = Integer.parseInt(digits.substring(0, 2) + digits.substring(digits.length() - 2));   // first 2 + last 2 digits
        System.out.println("extraction: 123-45-6789 -&gt; " + part + " -&gt; " + part + " % " + tsize + " = " + part % tsize);
        // radix transformation: write the key in another base
        int k = 345;
        String base9 = Integer.toString(k, 9);
        int r = Integer.parseInt(base9);                         // read the base-9 digits as a decimal number
        System.out.println("radix:      " + k + " (base 10) = " + base9 + " (base 9) -&gt; " + r + " % " + tsize + " = " + r % tsize);
    }
}</code></pre>
<div class="out">mid-square: 3121^2 = 9740641 -&gt; middle 3 digits 406 -&gt; 406 % 1000 = 406<br>
extraction: 123-45-6789 -&gt; 1289 -&gt; 1289 % 1000 = 289<br>
radix: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;345 (base 10) = 423 (base 9) -&gt; 423 % 1000 = 423</div>
<p>The slide leaves TSize open; the program uses TSize = 1000, the lesson's choice. Note that extraction's 1289 still has to be reduced: 1289 % 1000 = 289.</p>
<div class="pitfall">Mid-square takes the middle of the <em>square</em>, not of the key: the middle of 3121 is "12", but the answer is 406. In radix transformation, the base-9 digits are read back as a decimal number (423), not converted back to 345.</div>`,
        `<p class="y-chinh">🎯 Thêm ba cách biến khoá thành địa chỉ: bình phương lấy giữa (mid-square — bình phương khoá, giữ phần giữa), trích chữ số (extraction — chỉ dùng một phần khoá) và đổi cơ số (radix transformation — viết khoá trong hệ cơ số khác) — cuối cùng đều lấy mod TSize (chia lấy dư cho kích thước bảng).</p>
<ul>
<li><strong>Bình phương lấy giữa</strong>: 3121² = 9 740 641 → các chữ số giữa 406 → chỉ số = 406 mod TSize. Các chữ số ở giữa của bình phương phụ thuộc vào mọi chữ số của khoá, nên khoá khác nhau nhiều khả năng cho chỉ số khác nhau.</li>
<li><strong>Trích chữ số</strong>: chỉ dùng một phần của khoá. Trong ví dụ của slide, khoá 123-45-6789 (slide viết gom lại thành 1234-5-6789) cho ra 1289 — hai chữ số đầu (12) và hai chữ số cuối (89).</li>
<li><strong>Đổi cơ số</strong>: 345 hệ 10 = 423 hệ 9 (4·81 + 2·9 + 3 = 345); các chữ số 423 sau đó được đọc như một số thập phân bình thường → chỉ số = 423 mod TSize.</li>
</ul>
<pre><code class="language-java">public class OtherHashes {
    public static void main(String[] args) {
        int tsize = 1000;                                        // một cỡ bảng ví dụ
        // bình phương khoá, giữ các chữ số ở giữa
        long key = 3121, sq = key * key;
        String s = Long.toString(sq);
        int start = (s.length() - 3) / 2;
        int mid = Integer.parseInt(s.substring(start, start + 3));
        System.out.println("mid-square: " + key + "^2 = " + sq + " -&gt; middle 3 digits " + mid + " -&gt; " + mid + " % " + tsize + " = " + mid % tsize);
        // trích một phần của khoá
        String digits = "123-45-6789".replace("-", "");
        int part = Integer.parseInt(digits.substring(0, 2) + digits.substring(digits.length() - 2));   // 2 số đầu + 2 số cuối
        System.out.println("extraction: 123-45-6789 -&gt; " + part + " -&gt; " + part + " % " + tsize + " = " + part % tsize);
        // đổi cơ số: viết khoá trong một hệ cơ số khác
        int k = 345;
        String base9 = Integer.toString(k, 9);
        int r = Integer.parseInt(base9);                         // đọc các chữ số hệ 9 như một số thập phân
        System.out.println("radix:      " + k + " (base 10) = " + base9 + " (base 9) -&gt; " + r + " % " + tsize + " = " + r % tsize);
    }
}</code></pre>
<div class="out">mid-square: 3121^2 = 9740641 -&gt; middle 3 digits 406 -&gt; 406 % 1000 = 406<br>
extraction: 123-45-6789 -&gt; 1289 -&gt; 1289 % 1000 = 289<br>
radix: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;345 (base 10) = 423 (base 9) -&gt; 423 % 1000 = 423</div>
<p>Slide để ngỏ TSize; chương trình dùng TSize = 1000 do bài tự chọn. Để ý 1289 của phép trích chữ số vẫn phải thu nhỏ: 1289 % 1000 = 289.</p>
<div class="pitfall">Bình phương lấy giữa lấy phần giữa của <em>bình phương</em>, không phải của khoá: phần giữa của 3121 là "12", còn đáp án là 406. Với đổi cơ số, các chữ số hệ 9 được đọc lại như số thập phân (423), chứ không đổi ngược về 345.</div>`],
      [15, 'Collision',
        `<p class="y-chinh">🎯 A collision occurs when different elements are mapped to the same cell — with more possible keys than cells it cannot be avoided, so every hash table needs a collision resolution strategy.</p>
<pre><code class="language-java">public class Collision {
    public static void main(String[] args) {
        int[] keys = {89, 18, 49, 58, 69};
        int m = 10;
        String[] wanted = new String[m];                 // which keys want each cell
        for (int x : keys) {
            int h = x % m;
            System.out.println("h(" + x + ") = " + x + " % " + m + " = " + h + (wanted[h] == null ? "" : "   &lt;- collision with " + wanted[h]));
            wanted[h] = (wanted[h] == null) ? String.valueOf(x) : wanted[h] + ", " + x;
        }
        for (int i = 0; i &lt; m; i++)
            if (wanted[i] != null &amp;&amp; wanted[i].contains(",")) System.out.println("cell " + i + " is wanted by " + wanted[i]);
    }
}</code></pre>
<div class="out">h(89) = 89 % 10 = 9<br>
h(18) = 18 % 10 = 8<br>
h(49) = 49 % 10 = 9 &nbsp;&nbsp;&lt;- collision with 89<br>
h(58) = 58 % 10 = 8 &nbsp;&nbsp;&lt;- collision with 18<br>
h(69) = 69 % 10 = 9 &nbsp;&nbsp;&lt;- collision with 89, 49<br>
cell 8 is wanted by 18, 58<br>
cell 9 is wanted by 89, 49, 69</div>
<ul>
<li>These are the keys of the example on slide 19, with h(x) = x % 10: 49 and 69 want cell 9, like 89; 58 wants cell 8, like 18.</li>
<li>The deck answers with three families (summary, slide 39). <strong>Open addressing</strong>: put the key into another free cell of the same array (slides 16–20). <strong>Chaining</strong>: link the colliding keys into a list — separate lists (slide 21), or a chain kept inside the array itself, coalesced hashing (slides 22–23). <strong>Bucket addressing</strong>: give each address several slots (slide 24).</li>
<li>Every strategy costs something extra only for the keys that collide, which is why the hash function should keep collisions rare (slides 7–14).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> collision = same <em>index</em>, different <em>keys</em>. Two equal keys are not a collision but a duplicate — a map just replaces the value (slide 32).</p>
<div class="pitfall">"A good hash function has no collisions" is false for a general key set: a good function makes collisions rare and spreads them evenly. Only a perfect hash function, built for a fixed set of keys known in advance, has none (slide 26).</div>`,
        `<p class="y-chinh">🎯 Va chạm (collision) xảy ra khi các phần tử khác nhau được ánh xạ vào cùng một ô — số khoá có thể có nhiều hơn số ô thì không tránh được, nên bảng băm nào cũng cần một chiến lược giải quyết va chạm.</p>
<pre><code class="language-java">public class Collision {
    public static void main(String[] args) {
        int[] keys = {89, 18, 49, 58, 69};
        int m = 10;
        String[] wanted = new String[m];                 // những khoá muốn vào mỗi ô
        for (int x : keys) {
            int h = x % m;
            System.out.println("h(" + x + ") = " + x + " % " + m + " = " + h + (wanted[h] == null ? "" : "   &lt;- collision with " + wanted[h]));
            wanted[h] = (wanted[h] == null) ? String.valueOf(x) : wanted[h] + ", " + x;
        }
        for (int i = 0; i &lt; m; i++)
            if (wanted[i] != null &amp;&amp; wanted[i].contains(",")) System.out.println("cell " + i + " is wanted by " + wanted[i]);
    }
}</code></pre>
<div class="out">h(89) = 89 % 10 = 9<br>
h(18) = 18 % 10 = 8<br>
h(49) = 49 % 10 = 9 &nbsp;&nbsp;&lt;- collision with 89<br>
h(58) = 58 % 10 = 8 &nbsp;&nbsp;&lt;- collision with 18<br>
h(69) = 69 % 10 = 9 &nbsp;&nbsp;&lt;- collision with 89, 49<br>
cell 8 is wanted by 18, 58<br>
cell 9 is wanted by 89, 49, 69</div>
<ul>
<li>Đây là các khoá trong ví dụ của slide 19, với h(x) = x % 10: 49 và 69 muốn vào ô 9 giống 89; 58 muốn vào ô 8 giống 18.</li>
<li>Bộ slide trả lời bằng ba họ lời giải (tóm tắt ở slide 39). <strong>Địa chỉ mở (open addressing)</strong>: đặt khoá vào một ô trống khác của chính mảng đó (slide 16–20). <strong>Dây chuyền (chaining)</strong>: nối các khoá va chạm thành một danh sách — danh sách riêng cho từng ô (slide 21), hoặc một dây nằm ngay trong mảng, tức băm gộp dây (coalesced hashing, slide 22–23). <strong>Địa chỉ bucket (bucket addressing)</strong>: cho mỗi địa chỉ nhiều chỗ chứa (slide 24).</li>
<li>Chiến lược nào cũng chỉ tốn thêm công cho những khoá bị va chạm, vì vậy hàm băm phải giữ cho va chạm hiếm xảy ra (slide 7–14).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> va chạm = cùng <em>chỉ số</em>, khác <em>khoá</em>. Hai khoá bằng nhau không phải va chạm mà là trùng lặp (duplicate) — map (ánh xạ) chỉ việc thay giá trị (slide 32).</p>
<div class="pitfall">"Hàm băm tốt thì không có va chạm" là SAI với một tập khoá bất kỳ: hàm tốt làm va chạm hiếm và rải đều. Chỉ hàm băm hoàn hảo (perfect hash function), dựng cho một tập khoá cố định biết trước, mới không có va chạm nào (slide 26).</div>`],
      [16, 'Collision Resolution - Open addressing',
        `<p class="y-chinh">🎯 Open addressing resolves a collision inside the array: if cell h(x) is taken, try the cells hᵢ(x) = (h(x) + p(i)) mod M for i = 1, 2, … until a free one is found.</p>
<ul>
<li><strong>Linear probing</strong>: p(i) = i → try h(x) + 1, h(x) + 2, … — the next cells, wrapping from M − 1 back to 0.</li>
<li><strong>Quadratic probing</strong>: p(i) = i² → try h(x) + 1, h(x) + 4, h(x) + 9, …</li>
<li>Every key stays in the array itself: no extra lists, but the table can fill up, so it never holds more than M keys.</li>
</ul>
<p class="nhan">Linear probing, step by step — insert 89, 18, 49, 58, 69 into M = 10 cells, h(x) = x % 10</p>
<table>
<thead><tr><th>Key</th><th>h(x)</th><th>Cells tried</th><th>Placed in</th><th>Why</th></tr></thead>
<tbody>
<tr><td>89</td><td>9</td><td>9</td><td>9</td><td>free</td></tr>
<tr><td>18</td><td>8</td><td>8</td><td>8</td><td>free</td></tr>
<tr><td>49</td><td>9</td><td>9, 0</td><td>0</td><td>9 taken → (9 + 1) % 10 = 0</td></tr>
<tr><td>58</td><td>8</td><td>8, 9, 0, 1</td><td>1</td><td>8, 9, 0 taken</td></tr>
<tr><td>69</td><td>9</td><td>9, 0, 1, 2</td><td>2</td><td>9, 0, 1 taken</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class LinearProbing {
    static final int M = 10;
    static Integer[] table = new Integer[M];          // null = empty cell

    static String show() {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; M; i++) s.append(i == 0 ? "" : " ").append(table[i] == null ? "_" : String.valueOf(table[i]));
        return s + "]";
    }

    static String sequence(int home, boolean quadratic) {       // first 6 cells tried from a home cell
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; 6; i++) s.append((home + (quadratic ? i * i : i)) % M).append(' ');
        return s.toString();
    }

    static void insert(int x) {
        StringBuilder path = new StringBuilder();
        for (int i = 0; i &lt; M; i++) {
            int k = (x % M + i) % M;                  // h_i(x) = (h(x) + i) mod M
            path.append(k).append(' ');
            if (table[k] == null) {
                table[k] = x;
                System.out.println(String.format("insert %d: tries %-9s-&gt; cell %d   %s", x, path, k, show()));
                return;
            }
        }
        System.out.println("insert " + x + ": table is full");
    }

    public static void main(String[] args) {
        System.out.println("home 8, M = 10:  linear    p(i) = i   tries " + sequence(8, false));
        System.out.println("home 8, M = 10:  quadratic p(i) = i*i tries " + sequence(8, true));
        for (int x : new int[] {89, 18, 49, 58, 69}) insert(x);
    }
}</code></pre>
<div class="out">home 8, M = 10: &nbsp;linear &nbsp;&nbsp;&nbsp;p(i) = i &nbsp;&nbsp;tries 8 9 0 1 2 3<br>
home 8, M = 10: &nbsp;quadratic p(i) = i*i tries 8 9 2 7 4 3<br>
insert 89: tries 9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 9 &nbsp;&nbsp;[_ _ _ _ _ _ _ _ _ 89]<br>
insert 18: tries 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 8 &nbsp;&nbsp;[_ _ _ _ _ _ _ _ 18 89]<br>
insert 49: tries 9 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 0 &nbsp;&nbsp;[49 _ _ _ _ _ _ _ 18 89]<br>
insert 58: tries 8 9 0 1 &nbsp;-&gt; cell 1 &nbsp;&nbsp;[49 58 _ _ _ _ _ _ 18 89]<br>
insert 69: tries 9 0 1 2 &nbsp;-&gt; cell 2 &nbsp;&nbsp;[49 58 69 _ _ _ _ _ 18 89]</div>
<p>The first two lines compare the two probe sequences from home cell 8. The last line shows the weakness of linear probing, <strong>primary clustering</strong>: cells 8, 9, 0, 1, 2 have merged into one run, and every new key hashing into it must walk to its end — 58 and 69 needed 4 tries each.</p>
<div class="pitfall">Write <code>% M</code> on every probe: <code>(h + i) % M</code>. Without it, the probe after the last cell uses index M and throws <code>ArrayIndexOutOfBoundsException</code> instead of wrapping to cell 0.</div>`,
        `<p class="y-chinh">🎯 Địa chỉ mở (open addressing) giải quyết va chạm ngay trong mảng: nếu ô h(x) đã có người, thử lần lượt các ô hᵢ(x) = (h(x) + p(i)) mod M với i = 1, 2, … cho tới khi gặp ô trống.</p>
<ul>
<li><strong>Dò tuyến tính (linear probing)</strong>: p(i) = i → thử h(x) + 1, h(x) + 2, … — các ô kế tiếp, hết mảng ở M − 1 thì quay vòng về 0.</li>
<li><strong>Dò bậc hai (quadratic probing)</strong>: p(i) = i² → thử h(x) + 1, h(x) + 4, h(x) + 9, …</li>
<li>Mọi khoá đều nằm ngay trong mảng: không cần danh sách phụ, nhưng bảng có thể đầy, nên không bao giờ chứa quá M khoá.</li>
</ul>
<p class="nhan">Dò tuyến tính từng bước — chèn 89, 18, 49, 58, 69 vào M = 10 ô, h(x) = x % 10</p>
<table>
<thead><tr><th>Khoá</th><th>h(x)</th><th>Các ô đã thử</th><th>Đặt vào</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>89</td><td>9</td><td>9</td><td>9</td><td>trống</td></tr>
<tr><td>18</td><td>8</td><td>8</td><td>8</td><td>trống</td></tr>
<tr><td>49</td><td>9</td><td>9, 0</td><td>0</td><td>9 có người → (9 + 1) % 10 = 0</td></tr>
<tr><td>58</td><td>8</td><td>8, 9, 0, 1</td><td>1</td><td>8, 9, 0 có người</td></tr>
<tr><td>69</td><td>9</td><td>9, 0, 1, 2</td><td>2</td><td>9, 0, 1 có người</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class LinearProbing {
    static final int M = 10;
    static Integer[] table = new Integer[M];          // null = ô trống

    static String show() {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; M; i++) s.append(i == 0 ? "" : " ").append(table[i] == null ? "_" : String.valueOf(table[i]));
        return s + "]";
    }

    static String sequence(int home, boolean quadratic) {       // 6 ô đầu tiên được thử từ ô nhà
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; 6; i++) s.append((home + (quadratic ? i * i : i)) % M).append(' ');
        return s.toString();
    }

    static void insert(int x) {
        StringBuilder path = new StringBuilder();
        for (int i = 0; i &lt; M; i++) {
            int k = (x % M + i) % M;                  // h_i(x) = (h(x) + i) mod M
            path.append(k).append(' ');
            if (table[k] == null) {
                table[k] = x;
                System.out.println(String.format("insert %d: tries %-9s-&gt; cell %d   %s", x, path, k, show()));
                return;
            }
        }
        System.out.println("insert " + x + ": table is full");
    }

    public static void main(String[] args) {
        System.out.println("home 8, M = 10:  linear    p(i) = i   tries " + sequence(8, false));
        System.out.println("home 8, M = 10:  quadratic p(i) = i*i tries " + sequence(8, true));
        for (int x : new int[] {89, 18, 49, 58, 69}) insert(x);
    }
}</code></pre>
<div class="out">home 8, M = 10: &nbsp;linear &nbsp;&nbsp;&nbsp;p(i) = i &nbsp;&nbsp;tries 8 9 0 1 2 3<br>
home 8, M = 10: &nbsp;quadratic p(i) = i*i tries 8 9 2 7 4 3<br>
insert 89: tries 9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 9 &nbsp;&nbsp;[_ _ _ _ _ _ _ _ _ 89]<br>
insert 18: tries 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 8 &nbsp;&nbsp;[_ _ _ _ _ _ _ _ 18 89]<br>
insert 49: tries 9 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 0 &nbsp;&nbsp;[49 _ _ _ _ _ _ _ 18 89]<br>
insert 58: tries 8 9 0 1 &nbsp;-&gt; cell 1 &nbsp;&nbsp;[49 58 _ _ _ _ _ _ 18 89]<br>
insert 69: tries 9 0 1 2 &nbsp;-&gt; cell 2 &nbsp;&nbsp;[49 58 69 _ _ _ _ _ 18 89]</div>
<p>Hai dòng đầu so sánh hai dãy dò (probe sequence) tính từ ô nhà 8. Dòng cuối cho thấy điểm yếu của dò tuyến tính, <strong>vón cục sơ cấp (primary clustering)</strong>: các ô 8, 9, 0, 1, 2 đã dính thành một cụm, khoá mới nào băm vào cụm cũng phải đi tới tận cuối cụm — 58 và 69 đều mất 4 lần thử.</p>
<div class="pitfall">Luôn viết <code>% M</code> trong mỗi lần dò: <code>(h + i) % M</code>. Thiếu nó, lần dò sau ô cuối dùng chỉ số M và văng <code>ArrayIndexOutOfBoundsException</code> thay vì quay vòng về ô 0.</div>`],
      [17, 'Search an item in hash tables using linear Probing',
        `<p class="y-chinh">🎯 get(k) with linear probing starts at cell h(k) and probes consecutive cells until one of three things happens: the key is found, an empty cell is found, or N cells have been probed without success.</p>
<ol>
<li><strong>Key found</strong> → return the item.</li>
<li><strong>Empty cell</strong> → k is not in the table: had it been inserted, it would have taken this cell or one before it.</li>
<li><strong>N cells probed</strong> (N = the capacity of the table here) → the table is full and k is not in it; without this rule the loop would never end.</li>
</ol>
<pre><code class="language-java">public class LinearSearch {
    // get(k) with linear probing, printing every cell it looks at
    static void get(Integer[] t, int k) {
        int n = t.length, i = k % n;
        StringBuilder path = new StringBuilder();
        for (int probes = 1; probes &lt;= n; probes++, i = (i + 1) % n) {
            path.append(i).append(' ');
            if (t[i] == null) {                                   // stop 2: an empty cell
                System.out.println("get(" + k + "): cells " + path + "-&gt; cell " + i + " is empty: NOT FOUND (" + probes + (probes == 1 ? " probe)" : " probes)"));
                return;
            }
            if (t[i] == k) {                                      // stop 1: the key is found
                System.out.println("get(" + k + "): cells " + path + "-&gt; FOUND in cell " + i + " (" + probes + (probes == 1 ? " probe)" : " probes)"));
                return;
            }
        }
        // stop 3: N cells probed without success
        System.out.println("get(" + k + "): cells " + path + "-&gt; all N = " + n + " cells probed: NOT FOUND");
    }

    public static void main(String[] args) {
        Integer[] t = {49, 58, 69, null, null, null, null, null, 18, 89};   // the table built on slide 16
        get(t, 58);
        get(t, 39);
        get(t, 18);
        Integer[] full = {10, 21, 32, 43, 54};                             // a full table, N = 5
        get(full, 7);
    }
}</code></pre>
<div class="out">get(58): cells 8 9 0 1 -&gt; FOUND in cell 1 (4 probes)<br>
get(39): cells 9 0 1 2 3 -&gt; cell 3 is empty: NOT FOUND (5 probes)<br>
get(18): cells 8 -&gt; FOUND in cell 8 (1 probe)<br>
get(7): cells 2 3 4 0 1 -&gt; all N = 5 cells probed: NOT FOUND</div>
<table>
<thead><tr><th>Search</th><th>Cells looked at (content)</th><th>Stops because</th></tr></thead>
<tbody>
<tr><td>get(58)</td><td>8 (18), 9 (89), 0 (49), 1 (58)</td><td>1. key found</td></tr>
<tr><td>get(39)</td><td>9 (89), 0 (49), 1 (58), 2 (69), 3 (empty)</td><td>2. an empty cell</td></tr>
<tr><td>get(18)</td><td>8 (18)</td><td>1. key found at once</td></tr>
<tr><td>get(7), full table of 5 cells</td><td>2, 3, 4, 0, 1</td><td>3. all N = 5 cells probed</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> the number of probes is the length of the run of occupied cells starting at h(k): O(1) on average when the load factor is low, O(N) in the worst case.</p>
<div class="pitfall">Stop condition 2 is exactly why deleting from an open-addressing table is tricky: emptying a cell would make later searches stop too early. The fix — a "deleted" mark — is slide 25.</div>`,
        `<p class="y-chinh">🎯 get(k) với dò tuyến tính bắt đầu ở ô h(k) rồi dò lần lượt các ô liền kề cho tới khi xảy ra một trong ba điều: tìm thấy khoá, gặp ô trống, hoặc đã dò N ô mà không thấy.</p>
<ol>
<li><strong>Tìm thấy khoá</strong> → trả về phần tử.</li>
<li><strong>Gặp ô trống</strong> → k không có trong bảng: nếu k từng được chèn, nó đã chiếm ô này hoặc một ô trước đó.</li>
<li><strong>Đã dò N ô</strong> (ở đây N là sức chứa — capacity — của bảng) → bảng đầy và k không có trong đó; thiếu quy tắc này thì vòng lặp chạy mãi.</li>
</ol>
<pre><code class="language-java">public class LinearSearch {
    // get(k) với dò tuyến tính, in mọi ô đã xem
    static void get(Integer[] t, int k) {
        int n = t.length, i = k % n;
        StringBuilder path = new StringBuilder();
        for (int probes = 1; probes &lt;= n; probes++, i = (i + 1) % n) {
            path.append(i).append(' ');
            if (t[i] == null) {                                   // điểm dừng 2: gặp ô trống
                System.out.println("get(" + k + "): cells " + path + "-&gt; cell " + i + " is empty: NOT FOUND (" + probes + (probes == 1 ? " probe)" : " probes)"));
                return;
            }
            if (t[i] == k) {                                      // điểm dừng 1: tìm thấy khoá
                System.out.println("get(" + k + "): cells " + path + "-&gt; FOUND in cell " + i + " (" + probes + (probes == 1 ? " probe)" : " probes)"));
                return;
            }
        }
        // điểm dừng 3: đã dò đủ N ô mà không thấy
        System.out.println("get(" + k + "): cells " + path + "-&gt; all N = " + n + " cells probed: NOT FOUND");
    }

    public static void main(String[] args) {
        Integer[] t = {49, 58, 69, null, null, null, null, null, 18, 89};   // bảng đã dựng ở slide 16
        get(t, 58);
        get(t, 39);
        get(t, 18);
        Integer[] full = {10, 21, 32, 43, 54};                             // bảng đầy, N = 5
        get(full, 7);
    }
}</code></pre>
<div class="out">get(58): cells 8 9 0 1 -&gt; FOUND in cell 1 (4 probes)<br>
get(39): cells 9 0 1 2 3 -&gt; cell 3 is empty: NOT FOUND (5 probes)<br>
get(18): cells 8 -&gt; FOUND in cell 8 (1 probe)<br>
get(7): cells 2 3 4 0 1 -&gt; all N = 5 cells probed: NOT FOUND</div>
<table>
<thead><tr><th>Phép tìm</th><th>Các ô đã xem (nội dung)</th><th>Dừng vì</th></tr></thead>
<tbody>
<tr><td>get(58)</td><td>8 (18), 9 (89), 0 (49), 1 (58)</td><td>1. tìm thấy khoá</td></tr>
<tr><td>get(39)</td><td>9 (89), 0 (49), 1 (58), 2 (69), 3 (trống)</td><td>2. gặp ô trống</td></tr>
<tr><td>get(18)</td><td>8 (18)</td><td>1. thấy ngay lần đầu</td></tr>
<tr><td>get(7), bảng đầy 5 ô</td><td>2, 3, 4, 0, 1</td><td>3. đã dò đủ N = 5 ô</td></tr>
</tbody>
</table>
<p><strong>Big-O:</strong> số lần dò (probe) bằng độ dài dãy ô có người bắt đầu từ h(k): O(1) trung bình khi hệ số tải (load factor) thấp, O(N) trong trường hợp xấu nhất.</p>
<div class="pitfall">Điều kiện dừng 2 chính là lý do xoá trong bảng địa chỉ mở (open addressing) rất dễ sai: làm trống một ô sẽ khiến các lần tìm sau dừng quá sớm. Cách chữa — đánh dấu "đã xoá" — nằm ở slide 25.</div>`],
      [18, 'Factors affecting Search performance',
        `<p class="y-chinh">🎯 Search speed depends on three factors: how uniform the hash function is on the actual data, which collision resolution strategy is used, and the load factor — the lower the load factor, the better the search performance.</p>
<ul>
<li><strong>Quality of the hash function</strong>: how uniform it is — and that depends on the actual keys (slide 12: even keys with an even M).</li>
<li><strong>Collision resolution strategy</strong>: linear probing, quadratic probing, chaining…</li>
<li><strong>Load factor</strong> = N / Tsize, where N is the <em>number of items</em> stored and Tsize the number of cells; it is usually written α.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class LoadFactor {
    public static void main(String[] args) {
        int m = 10007;                                         // table size (prime)
        double[] loads = {0.25, 0.5, 0.75, 0.9};
        System.out.println("load a | successful search  | unsuccessful search");
        System.out.println("       | measured  formula  | measured  formula");
        for (double a : loads) {
            int[] t = new int[m];                              // 0 = empty
            int n = (int) (a * m);
            long hit = 0, x = 1;
            for (int j = 0; j &lt; n; j++) {                      // insert n pseudo-random keys
                x = x * 48271 % 2147483647;
                int i = (int) (x % m), probes = 1;
                while (t[i] != 0) { i = (i + 1) % m; probes++; }
                t[i] = (int) x;
                hit += probes;                                 // = probes of a later successful search
            }
            long miss = 0;
            for (int h = 0; h &lt; m; h++) {                      // a missing key whose home is h
                int i = h, probes = 1;
                while (t[i] != 0) { i = (i + 1) % m; probes++; }
                miss += probes;
            }
            System.out.println(String.format(Locale.US, "  %.2f | %8.2f  %7.2f  | %8.2f  %7.2f",
                    a, (double) hit / n, 0.5 * (1 + 1 / (1 - a)), (double) miss / m, 0.5 * (1 + 1 / ((1 - a) * (1 - a)))));
        }
    }
}</code></pre>
<div class="out">load a | successful search &nbsp;| unsuccessful search<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| measured &nbsp;formula &nbsp;| measured &nbsp;formula<br>
&nbsp;&nbsp;0.25 | &nbsp;&nbsp;&nbsp;&nbsp;1.15 &nbsp;&nbsp;&nbsp;&nbsp;1.17 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;1.39 &nbsp;&nbsp;&nbsp;&nbsp;1.39<br>
&nbsp;&nbsp;0.50 | &nbsp;&nbsp;&nbsp;&nbsp;1.46 &nbsp;&nbsp;&nbsp;&nbsp;1.50 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;2.41 &nbsp;&nbsp;&nbsp;&nbsp;2.50<br>
&nbsp;&nbsp;0.75 | &nbsp;&nbsp;&nbsp;&nbsp;2.52 &nbsp;&nbsp;&nbsp;&nbsp;2.50 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;8.56 &nbsp;&nbsp;&nbsp;&nbsp;8.50<br>
&nbsp;&nbsp;0.90 | &nbsp;&nbsp;&nbsp;&nbsp;5.25 &nbsp;&nbsp;&nbsp;&nbsp;5.50 &nbsp;| &nbsp;&nbsp;&nbsp;42.85 &nbsp;&nbsp;&nbsp;50.50</div>
<p>Measured on a table of 10,007 cells with linear probing, next to Knuth's classic estimates: successful search ≈ ½(1 + 1/(1 − α)), unsuccessful search ≈ ½(1 + 1/(1 − α)²). At α = 0.5 a miss costs about 2.5 probes; at α = 0.9 about 43 (measured) to 50 (formula). That is why real tables grow (rehash) long before they are full; Goodrich recommends α &lt; 0.5 for open addressing and α &lt; 0.9 for separate chaining.</p>
<div class="pitfall">Watch the letter N: on slide 17 "N cells" is the capacity of the table, here N is the number of items. A load factor of 0.75 means "three quarters of the cells are used", not "75 items".</div>`,
        `<p class="y-chinh">🎯 Tốc độ tìm kiếm phụ thuộc ba yếu tố: hàm băm đều tới đâu trên dữ liệu thật, dùng chiến lược giải quyết va chạm nào, và hệ số tải (load factor) — hệ số tải càng thấp thì tìm càng nhanh.</p>
<ul>
<li><strong>Chất lượng hàm băm</strong>: đều tới mức nào — và điều đó phụ thuộc vào chính các khoá thực tế (slide 12: khoá chẵn gặp M chẵn).</li>
<li><strong>Chiến lược giải quyết va chạm (collision resolution)</strong>: dò tuyến tính, dò bậc hai, dây chuyền (chaining)…</li>
<li><strong>Hệ số tải</strong> = N / Tsize, trong đó N là <em>số phần tử</em> đang lưu, Tsize là số ô; thường ký hiệu là α.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class LoadFactor {
    public static void main(String[] args) {
        int m = 10007;                                         // cỡ bảng (số nguyên tố)
        double[] loads = {0.25, 0.5, 0.75, 0.9};
        System.out.println("load a | successful search  | unsuccessful search");
        System.out.println("       | measured  formula  | measured  formula");
        for (double a : loads) {
            int[] t = new int[m];                              // 0 = ô trống
            int n = (int) (a * m);
            long hit = 0, x = 1;
            for (int j = 0; j &lt; n; j++) {                      // chèn n khoá giả ngẫu nhiên
                x = x * 48271 % 2147483647;
                int i = (int) (x % m), probes = 1;
                while (t[i] != 0) { i = (i + 1) % m; probes++; }
                t[i] = (int) x;
                hit += probes;                                 // = số lần dò khi tìm thấy nó sau này
            }
            long miss = 0;
            for (int h = 0; h &lt; m; h++) {                      // một khoá không có, ô nhà là h
                int i = h, probes = 1;
                while (t[i] != 0) { i = (i + 1) % m; probes++; }
                miss += probes;
            }
            System.out.println(String.format(Locale.US, "  %.2f | %8.2f  %7.2f  | %8.2f  %7.2f",
                    a, (double) hit / n, 0.5 * (1 + 1 / (1 - a)), (double) miss / m, 0.5 * (1 + 1 / ((1 - a) * (1 - a)))));
        }
    }
}</code></pre>
<div class="out">load a | successful search &nbsp;| unsuccessful search<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| measured &nbsp;formula &nbsp;| measured &nbsp;formula<br>
&nbsp;&nbsp;0.25 | &nbsp;&nbsp;&nbsp;&nbsp;1.15 &nbsp;&nbsp;&nbsp;&nbsp;1.17 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;1.39 &nbsp;&nbsp;&nbsp;&nbsp;1.39<br>
&nbsp;&nbsp;0.50 | &nbsp;&nbsp;&nbsp;&nbsp;1.46 &nbsp;&nbsp;&nbsp;&nbsp;1.50 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;2.41 &nbsp;&nbsp;&nbsp;&nbsp;2.50<br>
&nbsp;&nbsp;0.75 | &nbsp;&nbsp;&nbsp;&nbsp;2.52 &nbsp;&nbsp;&nbsp;&nbsp;2.50 &nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;8.56 &nbsp;&nbsp;&nbsp;&nbsp;8.50<br>
&nbsp;&nbsp;0.90 | &nbsp;&nbsp;&nbsp;&nbsp;5.25 &nbsp;&nbsp;&nbsp;&nbsp;5.50 &nbsp;| &nbsp;&nbsp;&nbsp;42.85 &nbsp;&nbsp;&nbsp;50.50</div>
<p>Số đo trên bảng 10.007 ô dùng dò tuyến tính, đặt cạnh công thức ước lượng kinh điển của Knuth: tìm thấy (successful) ≈ ½(1 + 1/(1 − α)), tìm trượt (unsuccessful) ≈ ½(1 + 1/(1 − α)²). Với α = 0,5, một lần tìm trượt tốn khoảng 2,5 lần dò; với α = 0,9 là khoảng 43 (đo được) tới 50 (theo công thức). Vì thế bảng thật phải nới rộng (rehash — băm lại) từ lâu trước khi đầy; sách Goodrich khuyên giữ α &lt; 0,5 với địa chỉ mở và α &lt; 0,9 với dây chuyền tách biệt (separate chaining).</p>
<div class="pitfall">Coi chừng chữ N: ở slide 17 "N ô" là sức chứa của bảng, ở slide này N là số phần tử. Hệ số tải 0,75 nghĩa là "ba phần tư số ô đã dùng", không phải "75 phần tử".</div>`],
      [19, 'Quadratic Probing example',
        `<p class="y-chinh">🎯 With h(x) = x mod 10 and quadratic probing, inserting 89, 18, 49, 58, 69 in this order puts 49 in cell 0, 58 in cell 2 and 69 in cell 3.</p>
<p>Attempt i always tries (h(x) + i²) mod 10 — counted from the <strong>home cell</strong> h(x), not from the previous attempt. Compare the slide with this step-by-step table:</p>
<table>
<thead><tr><th>Key</th><th>h(x)</th><th>i = 0</th><th>i = 1: h + 1</th><th>i = 2: h + 4</th><th>Placed in</th></tr></thead>
<tbody>
<tr><td>89</td><td>9</td><td>9 free</td><td>—</td><td>—</td><td>9</td></tr>
<tr><td>18</td><td>8</td><td>8 free</td><td>—</td><td>—</td><td>8</td></tr>
<tr><td>49</td><td>9</td><td>9 taken</td><td>(9 + 1) % 10 = 0 free</td><td>—</td><td>0</td></tr>
<tr><td>58</td><td>8</td><td>8 taken</td><td>(8 + 1) % 10 = 9 taken</td><td>(8 + 4) % 10 = 2 free</td><td>2</td></tr>
<tr><td>69</td><td>9</td><td>9 taken</td><td>(9 + 1) % 10 = 0 taken</td><td>(9 + 4) % 10 = 3 free</td><td>3</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class QuadraticProbing {
    static final int M = 10;
    static Integer[] table = new Integer[M];

    static String show() {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; M; i++) s.append(i == 0 ? "" : " ").append(table[i] == null ? "_" : String.valueOf(table[i]));
        return s + "]";
    }

    static void insert(int x) {
        int home = x % M;                                    // h(x) = x mod 10
        StringBuilder path = new StringBuilder();
        for (int i = 0; i &lt; M; i++) {
            int k = (home + i * i) % M;                      // always from the HOME cell: h(x) + i^2
            path.append(i == 0 ? "" : ", ").append(i == 0 ? String.valueOf(k) : "(" + home + "+" + i * i + ")%10=" + k);
            if (table[k] == null) {
                table[k] = x;
                System.out.println(String.format("insert %d: %-26s -&gt; cell %d  %s", x, path, k, show()));
                return;
            }
        }
        System.out.println("insert " + x + ": no free cell found");
    }

    public static void main(String[] args) {
        for (int x : new int[] {89, 18, 49, 58, 69}) insert(x);
    }
}</code></pre>
<div class="out">insert 89: 9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 9 &nbsp;[_ _ _ _ _ _ _ _ _ 89]<br>
insert 18: 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 8 &nbsp;[_ _ _ _ _ _ _ _ 18 89]<br>
insert 49: 9, (9+1)%10=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 0 &nbsp;[49 _ _ _ _ _ _ _ 18 89]<br>
insert 58: 8, (8+1)%10=9, (8+4)%10=2 &nbsp;-&gt; cell 2 &nbsp;[49 _ 58 _ _ _ _ _ 18 89]<br>
insert 69: 9, (9+1)%10=0, (9+4)%10=3 &nbsp;-&gt; cell 3 &nbsp;[49 _ 58 69 _ _ _ _ 18 89]</div>
<p>Final table: 0: 49, 2: 58, 3: 69, 8: 18, 9: 89. With linear probing (slide 16) 58 and 69 queued right behind the cluster (cells 1 and 2); here they jump away from it — quadratic probing removes primary clustering. Keys with the same home still follow the same sequence (secondary clustering), but that hurts much less.</p>
<p><strong>Big-O:</strong> each insertion here needed at most 3 probes. In general the cost is O(1) on average while the table stays at most half full, and one probe costs the same as in linear probing — one <code>i * i</code>, one <code>%</code>.</p>
<p class="meo">🧠 <strong>Remember:</strong> the jumps are 1, 4, 9, 16… and every one of them is measured from home — like throwing stones farther and farther from the same spot.</p>
<div class="pitfall">The classic mistake is to add i² to the <em>previous</em> probe: for 58 that gives 8 → 9 → 9 + 4 = 13 → cell 3. The correct third probe is 8 + 4 = 12 → cell 2. Expect the wrong option among the FE answers.</div>`,
        `<p class="y-chinh">🎯 Với h(x) = x mod 10 và dò bậc hai (quadratic probing), chèn lần lượt 89, 18, 49, 58, 69 sẽ đặt 49 vào ô 0, 58 vào ô 2 và 69 vào ô 3.</p>
<p>Lần thử thứ i luôn là (h(x) + i²) mod 10 — tính từ <strong>ô nhà (home cell)</strong> h(x), không tính từ lần thử trước. Đối chiếu slide với bảng từng bước này:</p>
<table>
<thead><tr><th>Khoá</th><th>h(x)</th><th>i = 0</th><th>i = 1: h + 1</th><th>i = 2: h + 4</th><th>Đặt vào</th></tr></thead>
<tbody>
<tr><td>89</td><td>9</td><td>9 trống</td><td>—</td><td>—</td><td>9</td></tr>
<tr><td>18</td><td>8</td><td>8 trống</td><td>—</td><td>—</td><td>8</td></tr>
<tr><td>49</td><td>9</td><td>9 có người</td><td>(9 + 1) % 10 = 0 trống</td><td>—</td><td>0</td></tr>
<tr><td>58</td><td>8</td><td>8 có người</td><td>(8 + 1) % 10 = 9 có người</td><td>(8 + 4) % 10 = 2 trống</td><td>2</td></tr>
<tr><td>69</td><td>9</td><td>9 có người</td><td>(9 + 1) % 10 = 0 có người</td><td>(9 + 4) % 10 = 3 trống</td><td>3</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class QuadraticProbing {
    static final int M = 10;
    static Integer[] table = new Integer[M];

    static String show() {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; M; i++) s.append(i == 0 ? "" : " ").append(table[i] == null ? "_" : String.valueOf(table[i]));
        return s + "]";
    }

    static void insert(int x) {
        int home = x % M;                                    // h(x) = x mod 10
        StringBuilder path = new StringBuilder();
        for (int i = 0; i &lt; M; i++) {
            int k = (home + i * i) % M;                      // luôn tính từ ô NHÀ: h(x) + i^2
            path.append(i == 0 ? "" : ", ").append(i == 0 ? String.valueOf(k) : "(" + home + "+" + i * i + ")%10=" + k);
            if (table[k] == null) {
                table[k] = x;
                System.out.println(String.format("insert %d: %-26s -&gt; cell %d  %s", x, path, k, show()));
                return;
            }
        }
        System.out.println("insert " + x + ": no free cell found");
    }

    public static void main(String[] args) {
        for (int x : new int[] {89, 18, 49, 58, 69}) insert(x);
    }
}</code></pre>
<div class="out">insert 89: 9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 9 &nbsp;[_ _ _ _ _ _ _ _ _ 89]<br>
insert 18: 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 8 &nbsp;[_ _ _ _ _ _ _ _ 18 89]<br>
insert 49: 9, (9+1)%10=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; cell 0 &nbsp;[49 _ _ _ _ _ _ _ 18 89]<br>
insert 58: 8, (8+1)%10=9, (8+4)%10=2 &nbsp;-&gt; cell 2 &nbsp;[49 _ 58 _ _ _ _ _ 18 89]<br>
insert 69: 9, (9+1)%10=0, (9+4)%10=3 &nbsp;-&gt; cell 3 &nbsp;[49 _ 58 69 _ _ _ _ 18 89]</div>
<p>Bảng cuối: 0: 49, 2: 58, 3: 69, 8: 18, 9: 89. Với dò tuyến tính (slide 16), 58 và 69 xếp hàng ngay sau cụm (ô 1 và 2); ở đây chúng nhảy ra xa cụm — dò bậc hai loại bỏ vón cục sơ cấp (primary clustering). Các khoá cùng ô nhà vẫn đi theo cùng một dãy dò (vón cục thứ cấp — secondary clustering), nhưng tác hại nhỏ hơn nhiều.</p>
<p><strong>Big-O:</strong> ở đây mỗi lần chèn cần nhiều nhất 3 lần dò (probe). Nói chung chi phí là O(1) trung bình khi bảng đầy không quá một nửa, và mỗi lần dò tốn như dò tuyến tính — một phép <code>i * i</code>, một phép <code>%</code>.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> các bước nhảy là 1, 4, 9, 16… và bước nào cũng đo từ ô nhà — như ném đá mỗi lần một xa hơn, nhưng luôn đứng ở cùng một chỗ.</p>
<div class="pitfall">Lỗi kinh điển là cộng i² vào lần dò <em>trước đó</em>: với 58 sẽ ra 8 → 9 → 9 + 4 = 13 → ô 3. Lần dò thứ ba đúng là 8 + 4 = 12 → ô 2. Đề FE thường cài sẵn phương án sai này.</div>`],
      [20, 'Advantages and disadvantages of quadratic probing',
        `<p class="y-chinh">🎯 Quadratic probing does not probe every cell — with M = 11 and h(x) = 3 only cells 3, 4, 7, 1, 8, 6 are ever tried — but if M is prime and the table is at least half empty, it always finds an empty cell and checks no cell twice.</p>
<pre><code class="language-java">import java.util.TreeSet;

public class QuadraticReach {
    public static void main(String[] args) {
        int m = 11, h = 3;
        StringBuilder seq = new StringBuilder();
        TreeSet&lt;Integer&gt; seen = new TreeSet&lt;Integer&gt;();
        for (int i = 0; i &lt; m; i++) {
            int k = (h + i * i) % m;                          // (h(x) + i^2) mod M
            seq.append(k).append(' ');
            seen.add(k);
        }
        System.out.println("M = 11, h(x) = 3, i = 0..10: " + seq);
        StringBuilder never = new StringBuilder();
        for (int k = 0; k &lt; m; k++) if (!seen.contains(k)) never.append(k).append(' ');
        System.out.println("cells ever probed: " + seen + " = " + seen.size() + " of 11; never probed: " + never);
        for (int size : new int[] {11, 13, 10, 16}) {         // how many cells can quadratic probing reach?
            TreeSet&lt;Integer&gt; r = new TreeSet&lt;Integer&gt;();
            for (int i = 0; i &lt; size; i++) r.add((i * i) % size);   // from home 0
            System.out.println(String.format("M = %2d %-7s: from any home cell only %d of %d cells can ever be tried", size, size == 11 || size == 13 ? "(prime)" : "", r.size(), size));
        }
    }
}</code></pre>
<div class="out">M = 11, h(x) = 3, i = 0..10: 3 4 7 1 8 6 6 8 1 7 4<br>
cells ever probed: [1, 3, 4, 6, 7, 8] = 6 of 11; never probed: 0 2 5 9 10<br>
M = 11 (prime): from any home cell only 6 of 11 cells can ever be tried<br>
M = 13 (prime): from any home cell only 7 of 13 cells can ever be tried<br>
M = 10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: from any home cell only 6 of 10 cells can ever be tried<br>
M = 16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: from any home cell only 4 of 16 cells can ever be tried</div>
<ul>
<li><strong>Disadvantage</strong>: from i = 6 on, the sequence runs backwards (6, 8, 1, 7, 4), because i² and (M − i)² give the same cell. So 5 of the 11 cells are never reached from home 3 — if only those are free, the insertion fails although the table is not full.</li>
<li><strong>The theorem</strong>: if M is prime and the table is at least half empty, quadratic probing always finds an empty location, and no location is checked twice.</li>
<li><strong>Why</strong>: if probes i &lt; j ≤ (M − 1)/2 hit the same cell, M divides j² − i² = (j − i)(j + i); a prime M must divide one of the factors, but both lie between 1 and M − 1 — impossible. So the first (M + 1)/2 probes are all different, and at most (M − 1)/2 cells are occupied: one of them is free.</li>
<li><strong>Advantage</strong> over linear probing: no primary clustering (slide 19).</li>
</ul>
<div class="pitfall">With a non-prime M it gets worse: M = 16 reaches only 4 cells from any home, because i² mod 16 is always 0, 1, 4 or 9. Rule for the FE: quadratic probing needs a prime table size and a load factor of at most 0.5.</div>`,
        `<p class="y-chinh">🎯 Dò bậc hai không dò hết mọi ô — với M = 11 và h(x) = 3 chỉ có các ô 3, 4, 7, 1, 8, 6 từng được thử — nhưng nếu M nguyên tố và bảng còn trống ít nhất một nửa, nó luôn tìm được ô trống và không ô nào bị xét hai lần.</p>
<pre><code class="language-java">import java.util.TreeSet;

public class QuadraticReach {
    public static void main(String[] args) {
        int m = 11, h = 3;
        StringBuilder seq = new StringBuilder();
        TreeSet&lt;Integer&gt; seen = new TreeSet&lt;Integer&gt;();
        for (int i = 0; i &lt; m; i++) {
            int k = (h + i * i) % m;                          // (h(x) + i^2) mod M
            seq.append(k).append(' ');
            seen.add(k);
        }
        System.out.println("M = 11, h(x) = 3, i = 0..10: " + seq);
        StringBuilder never = new StringBuilder();
        for (int k = 0; k &lt; m; k++) if (!seen.contains(k)) never.append(k).append(' ');
        System.out.println("cells ever probed: " + seen + " = " + seen.size() + " of 11; never probed: " + never);
        for (int size : new int[] {11, 13, 10, 16}) {         // dò bậc hai với tới được bao nhiêu ô?
            TreeSet&lt;Integer&gt; r = new TreeSet&lt;Integer&gt;();
            for (int i = 0; i &lt; size; i++) r.add((i * i) % size);   // tính từ ô nhà 0
            System.out.println(String.format("M = %2d %-7s: from any home cell only %d of %d cells can ever be tried", size, size == 11 || size == 13 ? "(prime)" : "", r.size(), size));
        }
    }
}</code></pre>
<div class="out">M = 11, h(x) = 3, i = 0..10: 3 4 7 1 8 6 6 8 1 7 4<br>
cells ever probed: [1, 3, 4, 6, 7, 8] = 6 of 11; never probed: 0 2 5 9 10<br>
M = 11 (prime): from any home cell only 6 of 11 cells can ever be tried<br>
M = 13 (prime): from any home cell only 7 of 13 cells can ever be tried<br>
M = 10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: from any home cell only 6 of 10 cells can ever be tried<br>
M = 16 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: from any home cell only 4 of 16 cells can ever be tried</div>
<ul>
<li><strong>Nhược điểm</strong>: từ i = 6 trở đi, dãy dò đi ngược lại (6, 8, 1, 7, 4), vì i² và (M − i)² cho cùng một ô. Nên 5 trong 11 ô không bao giờ được thử từ ô nhà 3 — nếu chỉ còn các ô đó trống thì lần chèn thất bại dù bảng chưa đầy.</li>
<li><strong>Định lý (theorem)</strong>: nếu M nguyên tố và bảng còn trống ít nhất một nửa, dò bậc hai luôn tìm được vị trí trống, và không vị trí nào bị xét hai lần.</li>
<li><strong>Vì sao</strong>: nếu lần dò i &lt; j ≤ (M − 1)/2 trúng cùng một ô thì M chia hết j² − i² = (j − i)(j + i); M nguyên tố nên phải chia hết một trong hai thừa số, mà cả hai đều nằm giữa 1 và M − 1 — vô lý. Vậy (M + 1)/2 lần dò đầu tiên trúng các ô khác nhau, trong khi nhiều nhất (M − 1)/2 ô có người: chắc chắn có một ô trống.</li>
<li><strong>Ưu điểm</strong> so với dò tuyến tính: không bị vón cục sơ cấp (primary clustering, slide 19).</li>
</ul>
<div class="pitfall">M không nguyên tố còn tệ hơn: M = 16 chỉ với tới 4 ô từ bất kỳ ô nhà nào, vì i² mod 16 luôn là 0, 1, 4 hoặc 9. Quy tắc cho FE: dò bậc hai cần kích thước bảng nguyên tố và hệ số tải (load factor) không quá 0,5.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Which operations are fast on a hash table, and which are not?</li>
<li>h(x) = x % 10 with linear probing; the table holds 18 in cell 8 and 89 in cell 9. Where does 28 go?</li>
<li>Same table and key, but quadratic probing: where does 28 go?</li>
<li>Why is 1019 a better table size than 1024 for the division method?</li>
<li>With linear probing, a search reaches an empty cell. What may it conclude?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) insert, search and delete by key are O(1) on average; min/max and sorted output need O(n). (2) 8 taken, 9 taken, 0 free → cell 0. (3) 8 taken, 8 + 1 = 9 taken, 8 + 4 = 12 → cell 2. (4) 1019 is prime; 1024 = 2¹⁰ keeps only the 10 lowest bits of the key. (5) that the key is not in the table — provided deletions never emptied a cell (slide 25).</p>
<p><strong>Next:</strong> lesson 7.B (slides 21–40: chaining, coalesced hashing, buckets, deletion, perfect and extendible hashing, maps, java.util), then the deep-dive lessons 7.1 Hash tables &amp; collisions, 7.2 Hash functions &amp; the hashCode/equals contract, 7.3 Collision handling in depth, 7.4 Load factor, rehashing &amp; Java HashMap, and finally lesson 7.5 (practice, glossary, summary) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Thao tác nào nhanh trên bảng băm, thao tác nào không?</li>
<li>h(x) = x % 10, dò tuyến tính; bảng đang có 18 ở ô 8 và 89 ở ô 9. Khoá 28 vào ô nào?</li>
<li>Cùng bảng và khoá đó nhưng dò bậc hai: 28 vào ô nào?</li>
<li>Vì sao 1019 là kích thước bảng tốt hơn 1024 cho phương pháp chia lấy dư?</li>
<li>Với dò tuyến tính, phép tìm gặp một ô trống. Nó được phép kết luận gì?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) chèn, tìm, xoá theo khoá là O(1) trung bình; tìm min/max và in theo thứ tự cần O(n). (2) 8 có người, 9 có người, 0 trống → ô 0. (3) 8 có người, 8 + 1 = 9 có người, 8 + 4 = 12 → ô 2. (4) 1019 là số nguyên tố; 1024 = 2¹⁰ chỉ giữ 10 bit thấp của khoá. (5) khoá không có trong bảng — với điều kiện chưa lần xoá nào làm trống một ô (slide 25).</p>
<p><strong>Học tiếp:</strong> bài 7.B (slide 21–40: dây chuyền, băm gộp dây, bucket — thùng chứa nhiều chỗ, xoá, băm hoàn hảo và băm mở rộng, Map — ánh xạ khoá → giá trị, java.util), rồi các bài đào sâu 7.1 Bảng băm &amp; va chạm, 7.2 Hàm băm &amp; giao ước hashCode/equals, 7.3 Xử lý va chạm chuyên sâu, 7.4 Hệ số tải, rehash &amp; HashMap trong Java, cuối cùng là bài 7.5 (thực hành, thuật ngữ, tóm tắt) và quiz của chương.</p>`),
    books([
      ['goodrich', 'Ch.10 — §10.2 Hash Tables p.410 · §10.2.1 Hash Functions p.411 · §10.2.2 Collision-Handling Schemes p.417 · §10.2.3 Load Factors, Rehashing, and Efficiency p.420', 'Chương 10 — §10.2 Hash Tables tr.410 · §10.2.1 Hash Functions tr.411 · §10.2.2 Collision-Handling Schemes tr.417 · §10.2.3 Load Factors, Rehashing, and Efficiency tr.420'],
    ]),
  ].join('\n'),
};

/* ───────── 7.B — 📑 Slide by slide · Hashing, part 2: chaining, buckets, deletion, maps & java.util (7-Hashing, slides 21–40) ───────── */
const L_csd13_2 = {
  title: '7.B — 📑 Slide by slide · Hashing, part 2: chaining, buckets, deletion, maps & java.util (7-Hashing, slides 21–40)|||7.B — 📑 Học theo từng slide · Băm, phần 2: dây chuyền, bucket, xoá, map & java.util (7-Hashing, slide 21–40)',
  slug: 'csd201-slide-csd13-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 21–40 của bộ 7-Hashing: băm dây chuyền, băm gộp dây (coalesced) và vùng hầm, bucket, xoá bằng dấu “đã xoá”, hàm băm hoàn hảo (Cichelli), băm mở rộng, hàm băm mật mã, mã băm âm, ADT Map và đếm tần suất từ, HashSet/HashMap/Hashtable — 16 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.B · 7-Hashing, slides 21–40</span>
<h2>Hashing, part 2 — the deck, slide by slide</h2>
<p class="lead">The second half of the hashing deck: the collision strategies that keep colliding keys out of other keys' cells (separate chaining, coalesced hashing, buckets), how to delete from an open-addressing table, perfect and extendible hashing, cryptographic hash functions, hash codes, the Map ADT, and the hash classes of java.util — HashSet, HashMap, Hashtable — that you will use in every Java project after this course.</p>
<div class="callout"><strong>CLO7 and two more syllabus questions:</strong> <em>"What is a perfect hash function?"</em> (slide 26) and <em>"How many ways to resolve collisions? Compare them in time and memory"</em> (the table below plus slides 16–25). For the PE, the skills that matter are writing a small chained hash table (slides 21 and 32) and using HashMap/HashSet correctly — the return values of put and add, null, equals/hashCode (slides 33–37). Lesson 7.5 trains both.</div>
<h3>Part 2 in one table</h3>
<table>
<thead><tr><th>Topic</th><th>Rule</th><th>Cost / remark</th></tr></thead>
<tbody>
<tr><td>Separate chaining</td><td>one linked list per cell; colliding keys join the list</td><td>about 1 + α nodes per search; α may exceed 1; delete = ordinary list delete</td></tr>
<tr><td>Coalesced hashing</td><td>colliding key → last free cell of the array, linked by a next index</td><td>shorter searches than linear probing; chains can merge; a cellar keeps overflow out of home cells</td></tr>
<tr><td>Bucket addressing</td><td>several slots per address; full bucket → next bucket or overflow area</td><td>collisions reduced, not removed</td></tr>
<tr><td>Deletion (open addressing)</td><td>mark the cell "deleted": search skips it, insert reuses it</td><td>rebuild the table when marks pile up</td></tr>
<tr><td>Perfect hashing</td><td>no collision for a fixed, known key set; minimal = no empty cell either</td><td>Cichelli: h = length + g(first letter) + g(last letter)</td></tr>
<tr><td>Extendible hashing</td><td>a directory indexed by the first d bits of the hash value; split full buckets</td><td>one directory lookup + one bucket</td></tr>
<tr><td>Cryptographic hash</td><td>fixed-size digest, hard to invert, collision-resistant</td><td>MD5 and SHA-1 are broken; use SHA-2 or SHA-3</td></tr>
<tr><td>Hash code</td><td>key → int (may be negative) → index in 0 … M − 1</td><td><code>Math.floorMod(h, M)</code>, never <code>Math.abs(h) % M</code></td></tr>
<tr><td>Map ADT</td><td>entries (k, v) with unique keys; get, put, remove</td><td>put returns the old value, or null for a new key</td></tr>
<tr><td>HashMap / Hashtable / HashSet</td><td>chaining inside; default capacity 16, load factor 0.75</td><td>HashMap: nulls allowed, unsynchronized; Hashtable: synchronized, no null</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Bài 7.B · 7-Hashing, slide 21–40</span>
<h2>Băm, phần 2 — học bộ slide từng trang</h2>
<p class="lead">Nửa sau của bộ slide về băm: các chiến lược giữ khoá va chạm khỏi chiếm ô của khoá khác (dây chuyền tách biệt — separate chaining, băm gộp dây — coalesced hashing, bucket — thùng nhiều chỗ), cách xoá trong bảng địa chỉ mở, băm hoàn hảo và băm mở rộng, hàm băm mật mã, mã băm (hash code), ADT Map (ánh xạ khoá → giá trị), và các lớp băm của java.util — HashSet, HashMap, Hashtable — thứ bạn sẽ dùng trong mọi dự án Java sau môn này.</p>
<div class="callout"><strong>CLO7 và thêm hai câu hỏi của syllabus:</strong> <em>"Hàm băm hoàn hảo là gì?"</em> (slide 26) và <em>"Có mấy cách giải quyết va chạm? So sánh về thời gian và bộ nhớ"</em> (bảng dưới đây cộng slide 16–25). Với PE, hai kỹ năng quan trọng là tự viết một bảng băm dây chuyền nhỏ (slide 21 và 32) và dùng HashMap/HashSet cho đúng — giá trị trả về của put và add, null, equals/hashCode (slide 33–37). Bài 7.5 luyện cả hai.</div>
<h3>Cả phần 2 trong một bảng</h3>
<table>
<thead><tr><th>Chủ đề</th><th>Quy tắc</th><th>Chi phí / lưu ý</th></tr></thead>
<tbody>
<tr><td>Dây chuyền tách biệt (separate chaining)</td><td>mỗi ô một danh sách liên kết; khoá va chạm nối vào danh sách</td><td>khoảng 1 + α nút mỗi lần tìm; α có thể vượt 1; xoá = xoá nút trong danh sách</td></tr>
<tr><td>Băm gộp dây (coalesced hashing)</td><td>khoá va chạm → ô trống cuối cùng của mảng, nối bằng chỉ số next</td><td>tìm ngắn hơn dò tuyến tính; các dây có thể nhập vào nhau; vùng hầm (cellar) giữ phần tràn khỏi ô nhà của khoá khác</td></tr>
<tr><td>Địa chỉ bucket (bucket addressing)</td><td>mỗi địa chỉ có nhiều chỗ (slot); bucket đầy → bucket kế hoặc vùng tràn</td><td>va chạm giảm đi chứ không biến mất</td></tr>
<tr><td>Xoá (địa chỉ mở)</td><td>đánh dấu ô "đã xoá": phép tìm đi qua, phép chèn dùng lại</td><td>dựng lại bảng khi dấu xoá quá nhiều</td></tr>
<tr><td>Băm hoàn hảo (perfect hashing)</td><td>không va chạm với một tập khoá cố định, biết trước; tối thiểu = cũng không còn ô trống</td><td>Cichelli: h = độ dài + g(chữ đầu) + g(chữ cuối)</td></tr>
<tr><td>Băm mở rộng (extendible hashing)</td><td>thư mục (directory) đánh chỉ số bằng d bit đầu của giá trị băm; tách bucket đầy</td><td>một lần tra thư mục + một bucket</td></tr>
<tr><td>Hàm băm mật mã (cryptographic hash)</td><td>bản tóm lược cỡ cố định, khó đảo ngược, khó va chạm</td><td>MD5, SHA-1 đã bị phá; dùng SHA-2 hoặc SHA-3</td></tr>
<tr><td>Mã băm (hash code)</td><td>khoá → số int (có thể âm) → chỉ số trong 0 … M − 1</td><td><code>Math.floorMod(h, M)</code>, đừng dùng <code>Math.abs(h) % M</code></td></tr>
<tr><td>ADT Map</td><td>các mục (k, v), khoá không trùng; get, put, remove</td><td>put trả giá trị cũ, hoặc null nếu khoá mới</td></tr>
<tr><td>HashMap / Hashtable / HashSet</td><td>bên trong dùng dây chuyền; sức chứa mặc định 16, hệ số tải 0,75</td><td>HashMap: cho phép null, không đồng bộ; Hashtable: đồng bộ, cấm null</td></tr>
</tbody>
</table>`),
    walkHead('csd13', 21, 40),
    walk('csd13', [
      [21, 'Collision Resolution - Chaining method',
        `<p class="y-chinh">🎯 In chaining the keys do not have to be stored in the table itself: each cell is associated with a linked list (a chain), and colliding keys are put on the same list.</p>
<ul>
<li><strong>Separate chaining</strong> is the name of the method; the table of references (list heads) is called a <strong>scatter table</strong>.</li>
<li><strong>The table can never overflow</strong>: a linked list can always grow, so the table accepts more keys than cells — the load factor α = n/M may exceed 1.</li>
<li><strong>Cost</strong>: inserting at the front of chain h(x) is O(1); search and delete walk one chain — about 1 + α nodes on average, O(n) if every key lands in the same chain.</li>
</ul>
<p class="nhan">The keys of slides 16 and 19 — 89, 18, 49, 58, 69, h(x) = x % 10 — each new key added at the front of its chain</p>
<table>
<thead><tr><th>Insert</th><th>Chain 8</th><th>Chain 9</th></tr></thead>
<tbody>
<tr><td>89</td><td>null</td><td>89</td></tr>
<tr><td>18</td><td>18</td><td>89</td></tr>
<tr><td>49</td><td>18</td><td>49 → 89</td></tr>
<tr><td>58</td><td>58 → 18</td><td>49 → 89</td></tr>
<tr><td>69</td><td>58 → 18</td><td>69 → 49 → 89</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class SeparateChaining {
    static final int M = 10;
    static Node[] table = new Node[M];                 // the scatter table: one list head per cell

    static void insert(int x) {
        int h = x % M;
        table[h] = new Node(x, table[h]);              // add at the front of chain h: O(1)
    }

    static void search(int x) {
        int visited = 0;
        for (Node p = table[x % M]; p != null; p = p.next) {   // only chain h(x) is searched
            visited++;
            if (p.info == x) { System.out.println("search(" + x + "): found after " + visited + " node(s) of chain " + x % M); return; }
        }
        System.out.println("search(" + x + "): not found after " + visited + " node(s) of chain " + x % M);
    }

    static void delete(int x) {                        // ordinary linked-list delete
        int h = x % M;
        if (table[h] == null) return;
        if (table[h].info == x) { table[h] = table[h].next; return; }
        for (Node f = table[h]; f.next != null; f = f.next)
            if (f.next.info == x) { f.next = f.next.next; return; }
    }

    static String chain(int i) {
        StringBuilder s = new StringBuilder("[" + i + "]");
        for (Node p = table[i]; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s + (table[i] == null ? " null" : "");
    }

    public static void main(String[] args) {
        for (int x : new int[] {89, 18, 49, 58, 69}) insert(x);
        for (int i = 0; i &lt; M; i++) System.out.println(chain(i));
        search(49);
        search(39);
        delete(49);
        System.out.println("after delete(49): " + chain(9));
    }
}</code></pre>
<div class="out">[0] null<br>
[1] null<br>
[2] null<br>
[3] null<br>
[4] null<br>
[5] null<br>
[6] null<br>
[7] null<br>
[8] -&gt; 58 -&gt; 18<br>
[9] -&gt; 69 -&gt; 49 -&gt; 89<br>
search(49): found after 2 node(s) of chain 9<br>
search(39): not found after 3 node(s) of chain 9<br>
after delete(49): [9] -&gt; 69 -&gt; 89</div>
<p>Compared with open addressing: no key moved into another key's cell, cells 0–7 stay free for their own keys, and deleting is an ordinary linked-list delete — no "deleted" mark needed (slide 25). Adding at the front is the lesson's choice (O(1)); adding at the end of the chain works too.</p>
<div class="pitfall">A typical PE bug: <code>insert</code> computes the chain with one formula and <code>search</code> with another (or with the old M after the table was resized) — the key is then looked for in the wrong chain and seems to vanish. Write one <code>hash()</code> method and call it everywhere.</div>`,
        `<p class="y-chinh">🎯 Trong phương pháp dây chuyền (chaining), khoá không cần nằm ngay trong bảng: mỗi ô gắn với một danh sách liên kết (một "dây" — chain), và các khoá va chạm được đưa vào cùng một danh sách.</p>
<ul>
<li><strong>Dây chuyền tách biệt (separate chaining)</strong> là tên phương pháp; bảng chứa các tham chiếu (đầu danh sách) gọi là <strong>bảng phân tán (scatter table)</strong>.</li>
<li><strong>Bảng không bao giờ tràn (overflow)</strong>: danh sách liên kết luôn dài thêm được, nên bảng nhận được nhiều khoá hơn số ô — hệ số tải (load factor) α = n/M có thể lớn hơn 1.</li>
<li><strong>Chi phí</strong>: chèn vào đầu dây h(x) là O(1); tìm và xoá đi dọc một dây — trung bình khoảng 1 + α nút, O(n) nếu mọi khoá rơi vào cùng một dây.</li>
</ul>
<p class="nhan">Các khoá của slide 16 và 19 — 89, 18, 49, 58, 69, h(x) = x % 10 — khoá mới luôn thêm vào đầu dây của nó</p>
<table>
<thead><tr><th>Chèn</th><th>Dây 8</th><th>Dây 9</th></tr></thead>
<tbody>
<tr><td>89</td><td>null</td><td>89</td></tr>
<tr><td>18</td><td>18</td><td>89</td></tr>
<tr><td>49</td><td>18</td><td>49 → 89</td></tr>
<tr><td>58</td><td>58 → 18</td><td>49 → 89</td></tr>
<tr><td>69</td><td>58 → 18</td><td>69 → 49 → 89</td></tr>
</tbody>
</table>
<pre><code class="language-java">class Node {
    int info;
    Node next;

    Node(int x, Node p) { info = x; next = p; }
}

public class SeparateChaining {
    static final int M = 10;
    static Node[] table = new Node[M];                 // bảng phân tán: mỗi ô một đầu danh sách

    static void insert(int x) {
        int h = x % M;
        table[h] = new Node(x, table[h]);              // thêm vào đầu dây h: O(1)
    }

    static void search(int x) {
        int visited = 0;
        for (Node p = table[x % M]; p != null; p = p.next) {   // chỉ dò dây h(x)
            visited++;
            if (p.info == x) { System.out.println("search(" + x + "): found after " + visited + " node(s) of chain " + x % M); return; }
        }
        System.out.println("search(" + x + "): not found after " + visited + " node(s) of chain " + x % M);
    }

    static void delete(int x) {                        // xoá như danh sách liên kết thường
        int h = x % M;
        if (table[h] == null) return;
        if (table[h].info == x) { table[h] = table[h].next; return; }
        for (Node f = table[h]; f.next != null; f = f.next)
            if (f.next.info == x) { f.next = f.next.next; return; }
    }

    static String chain(int i) {
        StringBuilder s = new StringBuilder("[" + i + "]");
        for (Node p = table[i]; p != null; p = p.next) s.append(" -&gt; ").append(p.info);
        return s + (table[i] == null ? " null" : "");
    }

    public static void main(String[] args) {
        for (int x : new int[] {89, 18, 49, 58, 69}) insert(x);
        for (int i = 0; i &lt; M; i++) System.out.println(chain(i));
        search(49);
        search(39);
        delete(49);
        System.out.println("after delete(49): " + chain(9));
    }
}</code></pre>
<div class="out">[0] null<br>
[1] null<br>
[2] null<br>
[3] null<br>
[4] null<br>
[5] null<br>
[6] null<br>
[7] null<br>
[8] -&gt; 58 -&gt; 18<br>
[9] -&gt; 69 -&gt; 49 -&gt; 89<br>
search(49): found after 2 node(s) of chain 9<br>
search(39): not found after 3 node(s) of chain 9<br>
after delete(49): [9] -&gt; 69 -&gt; 89</div>
<p>So với địa chỉ mở (open addressing): không khoá nào phải chiếm ô của khoá khác, các ô 0–7 vẫn để dành cho khoá của chính chúng, và xoá chỉ là xoá nút trong danh sách liên kết — không cần dấu "đã xoá" (slide 25). Thêm vào đầu dây là lựa chọn của bài (O(1)); thêm vào cuối dây cũng được.</p>
<div class="pitfall">Lỗi PE điển hình: <code>insert</code> tính dây bằng một công thức còn <code>search</code> dùng công thức khác (hoặc dùng M cũ sau khi bảng đã nới rộng) — khoá bị tìm ở nhầm dây và như "biến mất". Viết một phương thức <code>hash()</code> duy nhất và gọi nó ở mọi chỗ.</div>`],
      [22, 'Collision Resolution - Coalesced hashing',
        `<p class="y-chinh">🎯 Coalesced hashing (coalesced chaining) combines linear probing with chaining: every position has two fields, info and next, and a colliding key is put in the last available position of the table and linked to its chain through next.</p>
<ul>
<li><strong>next</strong> holds the <em>index</em> of the next key of the chain (−1 = end), so a search jumps along the links instead of scanning the table cell by cell as linear probing does.</li>
<li><strong>Last available position</strong>: a pointer starts after the bottom of the table and moves up to the next free cell whenever a colliding key needs a place.</li>
<li><strong>"Coalesced" = merged</strong>: a key parked in cell j occupies the home of the keys that hash to j, so the chains of different home cells can grow into one list (slide 23 shows it).</li>
<li><strong>Cellar</strong>: an overflow area allocated for keys for which there is no room in the table — extra cells that no key hashes to, used first for colliding keys, so they do not take other keys' home cells.</li>
</ul>
<p>The heart of insertion (the full program runs on slide 23):</p>
<pre><code class="language-java">static int insert(int x) {                        // returns the cell used, -1 = overflow
    int p = x % M;
    if (!used[p]) { info[p] = x; next[p] = -1; used[p] = true; return p; }
    while (next[p] != -1) p = next[p];            // walk to the end of the chain
    do free--; while (free &gt;= 0 &amp;&amp; used[free]);   // the last available position
    if (free &lt; 0) return -1;                      // no room left: overflow
    info[free] = x; next[free] = -1; used[free] = true;
    next[p] = free;                               // link the new cell to the chain
    return free;
}</code></pre>
<p><strong>Big-O:</strong> an insertion walks one chain, and the free pointer only ever moves up — O(M) in total over all insertions; a search walks one chain.</p>`,
        `<p class="y-chinh">🎯 Băm gộp dây (coalesced hashing, hay coalesced chaining) kết hợp dò tuyến tính với dây chuyền: mỗi vị trí có hai trường, info và next, và khoá va chạm được đặt vào vị trí còn trống cuối cùng của bảng rồi nối vào dây của nó qua next.</p>
<ul>
<li><strong>next</strong> chứa <em>chỉ số</em> của khoá kế tiếp trong dây (−1 = hết dây), nên phép tìm nhảy theo liên kết thay vì quét từng ô một như dò tuyến tính (linear probing).</li>
<li><strong>Vị trí trống cuối cùng (last available position)</strong>: một con trỏ bắt đầu ngay sau đáy bảng và đi dần lên tới ô trống kế tiếp mỗi khi có khoá va chạm cần chỗ.</li>
<li><strong>"Coalesced" = gộp lại</strong>: một khoá gửi nhờ ở ô j sẽ chiếm mất ô nhà của những khoá băm vào j, nên dây của các ô nhà khác nhau có thể nhập thành một danh sách (slide 23 minh hoạ).</li>
<li><strong>Vùng hầm (cellar)</strong>: một vùng tràn (overflow area) cấp thêm cho những khoá không còn chỗ trong bảng — các ô phụ mà không khoá nào băm tới, được dùng trước cho khoá va chạm, để chúng khỏi chiếm ô nhà của khoá khác.</li>
</ul>
<p>Phần cốt lõi của phép chèn (chương trình đầy đủ chạy ở slide 23):</p>
<pre><code class="language-java">static int insert(int x) {                        // trả về ô đã dùng, -1 = tràn
    int p = x % M;
    if (!used[p]) { info[p] = x; next[p] = -1; used[p] = true; return p; }
    while (next[p] != -1) p = next[p];            // đi tới cuối dây
    do free--; while (free &gt;= 0 &amp;&amp; used[free]);   // ô trống cuối cùng của bảng
    if (free &lt; 0) return -1;                      // hết chỗ: tràn bảng
    info[free] = x; next[free] = -1; used[free] = true;
    next[p] = free;                               // nối ô mới vào dây
    return free;
}</code></pre>
<p><strong>Big-O:</strong> mỗi lần chèn đi dọc một dây, còn con trỏ ô trống chỉ đi lên — tổng cộng O(M) cho mọi lần chèn; phép tìm đi dọc một dây.</p>`],
      [23, 'Coalesced hashing example',
        `<p class="y-chinh">🎯 A worked example of coalesced hashing: every colliding key takes the free cell with the largest index, counted upward from the bottom of the table, and a next link attaches it to the end of its chain.</p>
<p class="ghi-chu">The slide's example is a picture whose keys could not be extracted as text. Below is the lesson's own example — M = 10, h(x) = x % 10, the keys of slides 16–21 plus 15 — traced step by step; compare it with the picture.</p>
<table>
<thead><tr><th>Insert</th><th>h(x)</th><th>Home free?</th><th>Chain walked</th><th>Last free cell</th><th>Link set</th></tr></thead>
<tbody>
<tr><td>89</td><td>9</td><td>yes</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>18</td><td>8</td><td>yes</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>49</td><td>9</td><td>no (89)</td><td>9</td><td>7</td><td>next[9] = 7</td></tr>
<tr><td>58</td><td>8</td><td>no (18)</td><td>8</td><td>6</td><td>next[8] = 6</td></tr>
<tr><td>69</td><td>9</td><td>no (89)</td><td>9 → 7</td><td>5</td><td>next[7] = 5</td></tr>
<tr><td>15</td><td>5</td><td>no (69 parked there)</td><td>5</td><td>4</td><td>next[5] = 4</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Coalesced {
    static final int M = 10;
    static int[] info = new int[M];
    static int[] next = new int[M];                   // index of the next cell in the chain, -1 = end
    static boolean[] used = new boolean[M];
    static int free = M;                              // scans upward from the bottom of the table

    static int insert(int x) {                        // returns the cell used, -1 = overflow
        int p = x % M;
        if (!used[p]) { info[p] = x; next[p] = -1; used[p] = true; return p; }
        while (next[p] != -1) p = next[p];            // walk to the end of the chain
        do free--; while (free &gt;= 0 &amp;&amp; used[free]);   // the last available position
        if (free &lt; 0) return -1;                      // no room left: overflow
        info[free] = x; next[free] = -1; used[free] = true;
        next[p] = free;                               // link the new cell to the chain
        return free;
    }

    static void search(int x) {
        StringBuilder path = new StringBuilder();
        int p = x % M;
        if (used[p]) for (; p != -1; p = next[p]) {
            path.append(p).append(' ');
            if (info[p] == x) { System.out.println("search " + x + ": cells " + path + "-&gt; found"); return; }
        }
        System.out.println("search " + x + ": cells " + path + "-&gt; not found");
    }

    public static void main(String[] args) {
        for (int x : new int[] {89, 18, 49, 58, 69, 15}) {
            int c = insert(x), from = -1;
            for (int i = 0; i &lt; M; i++) if (used[i] &amp;&amp; next[i] == c) from = i;   // the cell that now links to c
            System.out.println("insert " + x + ": home " + x % M + (c == x % M ? " is free -&gt; cell " + c
                    : " taken -&gt; last free cell " + c + ", next[" + from + "] = " + c));
        }
        System.out.println("cell | info | next");
        for (int i = 0; i &lt; M; i++)
            if (used[i]) System.out.println(String.format("%4d | %4d | %4d", i, info[i], next[i]));
        search(15);
        search(39);
    }
}</code></pre>
<div class="out">insert 89: home 9 is free -&gt; cell 9<br>
insert 18: home 8 is free -&gt; cell 8<br>
insert 49: home 9 taken -&gt; last free cell 7, next[9] = 7<br>
insert 58: home 8 taken -&gt; last free cell 6, next[8] = 6<br>
insert 69: home 9 taken -&gt; last free cell 5, next[7] = 5<br>
insert 15: home 5 taken -&gt; last free cell 4, next[5] = 4<br>
cell | info | next<br>
&nbsp;&nbsp;&nbsp;4 | &nbsp;&nbsp;15 | &nbsp;&nbsp;-1<br>
&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;69 | &nbsp;&nbsp;&nbsp;4<br>
&nbsp;&nbsp;&nbsp;6 | &nbsp;&nbsp;58 | &nbsp;&nbsp;-1<br>
&nbsp;&nbsp;&nbsp;7 | &nbsp;&nbsp;49 | &nbsp;&nbsp;&nbsp;5<br>
&nbsp;&nbsp;&nbsp;8 | &nbsp;&nbsp;18 | &nbsp;&nbsp;&nbsp;6<br>
&nbsp;&nbsp;&nbsp;9 | &nbsp;&nbsp;89 | &nbsp;&nbsp;&nbsp;7<br>
search 15: cells 5 4 -&gt; found<br>
search 39: cells 9 7 5 4 -&gt; not found</div>
<ul>
<li><code>search 15</code> looks at only 2 cells (5, then 4) by following next.</li>
<li><code>search 39</code> shows the coalescing: chain 9 → 7 → 5 → 4 now also contains 15, whose home is cell 5 — two chains have merged into one, so searches for keys of home 9 get longer.</li>
</ul>
<p><strong>Big-O:</strong> a search visits only the cells of one chain (here at most 4), never the unrelated cells between them — fewer probes than linear probing's runs, although merged chains are longer than separate chains would be.</p>
<div class="pitfall">"Last available position" means the free cell with the <em>largest</em> index (the pointer moves up from the bottom), not the first free cell after the home cell — that would be linear probing.</div>`,
        `<p class="y-chinh">🎯 Một ví dụ băm gộp dây (coalesced hashing) có lời giải: mỗi khoá va chạm lấy ô trống có chỉ số lớn nhất, tính ngược từ đáy bảng lên, và một liên kết next gắn nó vào cuối dây của mình.</p>
<p class="ghi-chu">Ví dụ trên slide là hình vẽ, các khoá trong hình không trích được thành chữ. Dưới đây là ví dụ của bài — M = 10, h(x) = x % 10, các khoá của slide 16–21 thêm khoá 15 — lần theo từng bước; hãy đối chiếu với hình trên slide.</p>
<table>
<thead><tr><th>Chèn</th><th>h(x)</th><th>Ô nhà trống?</th><th>Dây đã đi qua</th><th>Ô trống cuối</th><th>Liên kết được gán</th></tr></thead>
<tbody>
<tr><td>89</td><td>9</td><td>có</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>18</td><td>8</td><td>có</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td>49</td><td>9</td><td>không (89)</td><td>9</td><td>7</td><td>next[9] = 7</td></tr>
<tr><td>58</td><td>8</td><td>không (18)</td><td>8</td><td>6</td><td>next[8] = 6</td></tr>
<tr><td>69</td><td>9</td><td>không (89)</td><td>9 → 7</td><td>5</td><td>next[7] = 5</td></tr>
<tr><td>15</td><td>5</td><td>không (69 đang gửi nhờ)</td><td>5</td><td>4</td><td>next[5] = 4</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Coalesced {
    static final int M = 10;
    static int[] info = new int[M];
    static int[] next = new int[M];                   // chỉ số ô kế trong dây, -1 = hết
    static boolean[] used = new boolean[M];
    static int free = M;                              // quét ngược từ cuối bảng lên

    static int insert(int x) {                        // trả về ô đã dùng, -1 = tràn
        int p = x % M;
        if (!used[p]) { info[p] = x; next[p] = -1; used[p] = true; return p; }
        while (next[p] != -1) p = next[p];            // đi tới cuối dây
        do free--; while (free &gt;= 0 &amp;&amp; used[free]);   // ô trống cuối cùng của bảng
        if (free &lt; 0) return -1;                      // hết chỗ: tràn bảng
        info[free] = x; next[free] = -1; used[free] = true;
        next[p] = free;                               // nối ô mới vào dây
        return free;
    }

    static void search(int x) {
        StringBuilder path = new StringBuilder();
        int p = x % M;
        if (used[p]) for (; p != -1; p = next[p]) {
            path.append(p).append(' ');
            if (info[p] == x) { System.out.println("search " + x + ": cells " + path + "-&gt; found"); return; }
        }
        System.out.println("search " + x + ": cells " + path + "-&gt; not found");
    }

    public static void main(String[] args) {
        for (int x : new int[] {89, 18, 49, 58, 69, 15}) {
            int c = insert(x), from = -1;
            for (int i = 0; i &lt; M; i++) if (used[i] &amp;&amp; next[i] == c) from = i;   // ô vừa được nối tới c
            System.out.println("insert " + x + ": home " + x % M + (c == x % M ? " is free -&gt; cell " + c
                    : " taken -&gt; last free cell " + c + ", next[" + from + "] = " + c));
        }
        System.out.println("cell | info | next");
        for (int i = 0; i &lt; M; i++)
            if (used[i]) System.out.println(String.format("%4d | %4d | %4d", i, info[i], next[i]));
        search(15);
        search(39);
    }
}</code></pre>
<div class="out">insert 89: home 9 is free -&gt; cell 9<br>
insert 18: home 8 is free -&gt; cell 8<br>
insert 49: home 9 taken -&gt; last free cell 7, next[9] = 7<br>
insert 58: home 8 taken -&gt; last free cell 6, next[8] = 6<br>
insert 69: home 9 taken -&gt; last free cell 5, next[7] = 5<br>
insert 15: home 5 taken -&gt; last free cell 4, next[5] = 4<br>
cell | info | next<br>
&nbsp;&nbsp;&nbsp;4 | &nbsp;&nbsp;15 | &nbsp;&nbsp;-1<br>
&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;69 | &nbsp;&nbsp;&nbsp;4<br>
&nbsp;&nbsp;&nbsp;6 | &nbsp;&nbsp;58 | &nbsp;&nbsp;-1<br>
&nbsp;&nbsp;&nbsp;7 | &nbsp;&nbsp;49 | &nbsp;&nbsp;&nbsp;5<br>
&nbsp;&nbsp;&nbsp;8 | &nbsp;&nbsp;18 | &nbsp;&nbsp;&nbsp;6<br>
&nbsp;&nbsp;&nbsp;9 | &nbsp;&nbsp;89 | &nbsp;&nbsp;&nbsp;7<br>
search 15: cells 5 4 -&gt; found<br>
search 39: cells 9 7 5 4 -&gt; not found</div>
<ul>
<li><code>search 15</code> chỉ xem 2 ô (5, rồi 4) nhờ đi theo next.</li>
<li><code>search 39</code> cho thấy hiện tượng gộp dây: dây 9 → 7 → 5 → 4 giờ chứa cả 15, khoá có ô nhà là 5 — hai dây đã nhập làm một, nên các lần tìm khoá có ô nhà 9 dài thêm.</li>
</ul>
<p><strong>Big-O:</strong> một lần tìm chỉ ghé các ô của một dây (ở đây nhiều nhất 4 ô), không bao giờ ghé các ô không liên quan nằm giữa — ít lần dò hơn các dãy ô của dò tuyến tính (linear probing), dù dây đã gộp thì dài hơn so với dây chuyền tách biệt (separate chaining).</p>
<div class="pitfall">"Vị trí trống cuối cùng" (last available position) là ô trống có chỉ số <em>lớn nhất</em> (con trỏ đi từ đáy bảng lên), không phải ô trống đầu tiên sau ô nhà — làm vậy là dò tuyến tính.</div>`],
      [24, 'Bucket Addressing',
        `<p class="y-chinh">🎯 Bucket addressing associates a bucket — a block with several slots — with each address, so that colliding items can be stored at the same position of the table.</p>
<ul>
<li><strong>Bucket</strong>: a block of space large enough for several items; it consists of slots, one item per slot.</li>
<li><strong>Collisions are not totally avoided</strong>: a bucket can fill up. The colliding item then goes to the next bucket with a free slot (linear probing), to some other bucket (quadratic probing), or to an overflow area — each bucket then keeps a field saying whether the search must continue in that area.</li>
<li><strong>The slide's example</strong> (Goodrich): a table of size 11, entries (1,D), (25,C), (3,F), (14,Z), (6,A), (39,C), (7,Q) and a modulo-division hash function, h(k) = k mod 11.</li>
</ul>
<table>
<thead><tr><th>Entry</th><th>k mod 11</th><th>Bucket</th></tr></thead>
<tbody>
<tr><td>(1,D)</td><td>1</td><td>1</td></tr>
<tr><td>(25,C)</td><td>25 − 22 = 3</td><td>3</td></tr>
<tr><td>(3,F)</td><td>3</td><td>3</td></tr>
<tr><td>(14,Z)</td><td>14 − 11 = 3</td><td>3</td></tr>
<tr><td>(6,A)</td><td>6</td><td>6</td></tr>
<tr><td>(39,C)</td><td>39 − 33 = 6</td><td>6</td></tr>
<tr><td>(7,Q)</td><td>7</td><td>7</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Buckets {
    static final int N = 11, SLOTS = 3;              // 11 buckets, 3 slots each (the lesson's choice)
    static String[][] slot = new String[N][SLOTS];
    static int[] used = new int[N];

    static void put(int k, char v) {
        int b = k % N;                               // modulo-division hash
        String note = "";
        for (int step = 0; step &lt; N; step++, b = (b + 1) % N) {   // bucket full -&gt; next bucket (linear probing)
            if (used[b] &lt; SLOTS) {
                slot[b][used[b]++] = "(" + k + "," + v + ")";
                System.out.println("(" + k + "," + v + "): " + k + " % 11 = " + k % N + note + " -&gt; bucket " + b);
                return;
            }
            note += ", bucket " + b + " is full";
        }
        System.out.println("(" + k + "," + v + "): every bucket is full");
    }

    public static void main(String[] args) {
        int[] keys = {1, 25, 3, 14, 6, 39, 7};
        char[] vals = {'D', 'C', 'F', 'Z', 'A', 'C', 'Q'};
        for (int i = 0; i &lt; keys.length; i++) put(keys[i], vals[i]);
        put(47, 'X');                                // a 4th key for bucket 3
        for (int b = 0; b &lt; N; b++) {
            StringBuilder s = new StringBuilder("bucket " + (b &lt; 10 ? " " : "") + b + ":");
            for (int j = 0; j &lt; used[b]; j++) s.append(' ').append(slot[b][j]);
            System.out.println(s);
        }
    }
}</code></pre>
<div class="out">(1,D): 1 % 11 = 1 -&gt; bucket 1<br>
(25,C): 25 % 11 = 3 -&gt; bucket 3<br>
(3,F): 3 % 11 = 3 -&gt; bucket 3<br>
(14,Z): 14 % 11 = 3 -&gt; bucket 3<br>
(6,A): 6 % 11 = 6 -&gt; bucket 6<br>
(39,C): 39 % 11 = 6 -&gt; bucket 6<br>
(7,Q): 7 % 11 = 7 -&gt; bucket 7<br>
(47,X): 47 % 11 = 3, bucket 3 is full -&gt; bucket 4<br>
bucket &nbsp;0:<br>
bucket &nbsp;1: (1,D)<br>
bucket &nbsp;2:<br>
bucket &nbsp;3: (25,C) (3,F) (14,Z)<br>
bucket &nbsp;4: (47,X)<br>
bucket &nbsp;5:<br>
bucket &nbsp;6: (6,A) (39,C)<br>
bucket &nbsp;7: (7,Q)<br>
bucket &nbsp;8:<br>
bucket &nbsp;9:<br>
bucket 10:</div>
<p>Result: bucket 1: D; bucket 3: C, F, Z; bucket 6: A, C; bucket 7: Q. The program gives each bucket 3 slots (the lesson's choice) and adds one more entry of its own, (47,X): 47 mod 11 = 3, bucket 3 is full, so linear probing stores it in bucket 4.</p>
<p class="meo">🧠 <strong>Remember:</strong> bucket = a small fixed array per address (like a disk block); chaining = an unlimited list per address.</p>`,
        `<p class="y-chinh">🎯 Địa chỉ bucket (bucket addressing) gắn với mỗi địa chỉ một bucket — một khối có nhiều chỗ (slot) — để các phần tử va chạm được cất ở cùng một vị trí của bảng.</p>
<ul>
<li><strong>Bucket (thùng chứa)</strong>: một khối bộ nhớ đủ chứa vài phần tử; nó gồm các slot (chỗ), mỗi slot một phần tử.</li>
<li><strong>Va chạm không mất hẳn</strong>: bucket có thể đầy. Khi đó phần tử va chạm sang bucket kế tiếp còn slot trống (dò tuyến tính), sang một bucket khác (dò bậc hai), hoặc vào một vùng tràn (overflow area) — lúc này mỗi bucket giữ thêm một trường cho biết phép tìm có phải đi tiếp sang vùng đó hay không.</li>
<li><strong>Ví dụ của slide</strong> (sách Goodrich): bảng kích thước 11, các mục (1,D), (25,C), (3,F), (14,Z), (6,A), (39,C), (7,Q) và hàm băm chia lấy dư (modulo-division) h(k) = k mod 11.</li>
</ul>
<table>
<thead><tr><th>Mục</th><th>k mod 11</th><th>Bucket</th></tr></thead>
<tbody>
<tr><td>(1,D)</td><td>1</td><td>1</td></tr>
<tr><td>(25,C)</td><td>25 − 22 = 3</td><td>3</td></tr>
<tr><td>(3,F)</td><td>3</td><td>3</td></tr>
<tr><td>(14,Z)</td><td>14 − 11 = 3</td><td>3</td></tr>
<tr><td>(6,A)</td><td>6</td><td>6</td></tr>
<tr><td>(39,C)</td><td>39 − 33 = 6</td><td>6</td></tr>
<tr><td>(7,Q)</td><td>7</td><td>7</td></tr>
</tbody>
</table>
<pre><code class="language-java">public class Buckets {
    static final int N = 11, SLOTS = 3;              // 11 bucket, mỗi bucket 3 chỗ (bài tự chọn)
    static String[][] slot = new String[N][SLOTS];
    static int[] used = new int[N];

    static void put(int k, char v) {
        int b = k % N;                               // hàm băm chia lấy dư
        String note = "";
        for (int step = 0; step &lt; N; step++, b = (b + 1) % N) {   // bucket đầy -&gt; sang bucket kế (dò tuyến tính)
            if (used[b] &lt; SLOTS) {
                slot[b][used[b]++] = "(" + k + "," + v + ")";
                System.out.println("(" + k + "," + v + "): " + k + " % 11 = " + k % N + note + " -&gt; bucket " + b);
                return;
            }
            note += ", bucket " + b + " is full";
        }
        System.out.println("(" + k + "," + v + "): every bucket is full");
    }

    public static void main(String[] args) {
        int[] keys = {1, 25, 3, 14, 6, 39, 7};
        char[] vals = {'D', 'C', 'F', 'Z', 'A', 'C', 'Q'};
        for (int i = 0; i &lt; keys.length; i++) put(keys[i], vals[i]);
        put(47, 'X');                                // khoá thứ 4 muốn vào bucket 3
        for (int b = 0; b &lt; N; b++) {
            StringBuilder s = new StringBuilder("bucket " + (b &lt; 10 ? " " : "") + b + ":");
            for (int j = 0; j &lt; used[b]; j++) s.append(' ').append(slot[b][j]);
            System.out.println(s);
        }
    }
}</code></pre>
<div class="out">(1,D): 1 % 11 = 1 -&gt; bucket 1<br>
(25,C): 25 % 11 = 3 -&gt; bucket 3<br>
(3,F): 3 % 11 = 3 -&gt; bucket 3<br>
(14,Z): 14 % 11 = 3 -&gt; bucket 3<br>
(6,A): 6 % 11 = 6 -&gt; bucket 6<br>
(39,C): 39 % 11 = 6 -&gt; bucket 6<br>
(7,Q): 7 % 11 = 7 -&gt; bucket 7<br>
(47,X): 47 % 11 = 3, bucket 3 is full -&gt; bucket 4<br>
bucket &nbsp;0:<br>
bucket &nbsp;1: (1,D)<br>
bucket &nbsp;2:<br>
bucket &nbsp;3: (25,C) (3,F) (14,Z)<br>
bucket &nbsp;4: (47,X)<br>
bucket &nbsp;5:<br>
bucket &nbsp;6: (6,A) (39,C)<br>
bucket &nbsp;7: (7,Q)<br>
bucket &nbsp;8:<br>
bucket &nbsp;9:<br>
bucket 10:</div>
<p>Kết quả: bucket 1: D; bucket 3: C, F, Z; bucket 6: A, C; bucket 7: Q. Chương trình cho mỗi bucket 3 slot (bài tự chọn) và thêm một mục của riêng bài, (47,X): 47 mod 11 = 3, bucket 3 đã đầy, nên dò tuyến tính cất nó vào bucket 4.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bucket = một mảng nhỏ cố định cho mỗi địa chỉ (giống một khối đĩa); dây chuyền (chaining) = một danh sách dài bao nhiêu cũng được cho mỗi địa chỉ.</p>`],
      [25, 'Deletion',
        `<p class="y-chinh">🎯 In a linear-probing table a key cannot be deleted by simply emptying its cell — a later search would stop at that hole; mark the cell as deleted instead, reuse it when inserting, and refresh the table when there are too many marks.</p>
<ul>
<li><strong>The slide's scenario</strong>: A4 and B4 both hash to position 4, so B4 was placed after A4. Delete A4 by emptying cell 4, then search for B4: the search starts at 4, finds an empty cell and concludes "B4 is not found" — which is false.</li>
<li><strong>The fix</strong>: only mark the deleted position (a "tombstone"). A search walks <em>past</em> a mark; an insertion may put the new element into the first marked cell on its path.</li>
<li><strong>Refresh</strong>: too many marks make every search long, so the table is rebuilt with only the live keys.</li>
</ul>
<pre><code class="language-java">class ProbeTable {
    static final int M = 10, EMPTY = 0, FULL = 1, DELETED = 2;
    String[] key = new String[M];
    int[] state = new int[M];                        // every cell starts EMPTY

    static int home(String k) { return k.charAt(1) - '0'; }   // "B4" -&gt; 4, like the slide's A4, B4

    int find(String k, StringBuilder path) {         // index of k, or -1
        int i = home(k);
        for (int n = 0; n &lt; M; n++, i = (i + 1) % M) {
            path.append(i).append(state[i] == DELETED ? "(#) " : state[i] == EMPTY ? "(empty) " : " ");
            if (state[i] == EMPTY) return -1;         // empty: stop
            if (state[i] == FULL &amp;&amp; key[i].equals(k)) return i;   // a DELETED cell is skipped
        }
        return -1;
    }

    void insert(String k) {
        int firstFree = -1, i = home(k);
        for (int n = 0; n &lt; M; n++, i = (i + 1) % M) {
            if (state[i] == FULL) { if (key[i].equals(k)) return; continue; }   // already there
            if (firstFree &lt; 0) firstFree = i;         // remember the first reusable cell
            if (state[i] == EMPTY) break;             // k is surely absent
        }
        if (firstFree &gt;= 0) { key[firstFree] = k; state[firstFree] = FULL; }
    }

    ProbeTable refresh() {                           // rebuild with the live keys only
        ProbeTable t = new ProbeTable();
        for (int i = 0; i &lt; M; i++) if (state[i] == FULL) t.insert(key[i]);
        return t;
    }

    String show() {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; M; i++) s.append(i == 0 ? "" : " ").append(state[i] == FULL ? key[i] : state[i] == DELETED ? "#" : "_");
        return s + "]";
    }
}

public class Tombstone {
    static void find(ProbeTable t, String k) {
        StringBuilder path = new StringBuilder();
        int i = t.find(k, path);
        System.out.println("   find " + k + ": cells " + path + "-&gt; " + (i &lt; 0 ? "NOT FOUND" : "found in cell " + i));
    }

    public static void main(String[] args) {
        ProbeTable naive = new ProbeTable(), marked = new ProbeTable();
        for (String k : new String[] {"A4", "B4", "C5"}) { naive.insert(k); marked.insert(k); }
        System.out.println("insert A4 B4 C5:          " + marked.show());
        naive.state[4] = ProbeTable.EMPTY;            // WRONG: delete A4 by emptying its cell
        System.out.println("WRONG delete A4 (empty):  " + naive.show());
        find(naive, "B4");
        marked.state[4] = ProbeTable.DELETED;         // RIGHT: mark the cell as deleted
        System.out.println("RIGHT delete A4 (mark #): " + marked.show());
        find(marked, "B4");
        find(marked, "D4");                           // before inserting: D4 is absent
        marked.insert("D4");                          // goes into the first # on its path
        System.out.println("insert D4:                " + marked.show());
        marked.state[5] = ProbeTable.DELETED;         // delete B4
        marked.state[6] = ProbeTable.DELETED;         // delete C5
        System.out.println("delete B4, C5 (mark #):   " + marked.show());
        System.out.println("refresh (rebuild):        " + marked.refresh().show());
    }
}</code></pre>
<div class="out">insert A4 B4 C5: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[_ _ _ _ A4 B4 C5 _ _ _]<br>
WRONG delete A4 (empty): &nbsp;[_ _ _ _ _ B4 C5 _ _ _]<br>
&nbsp;&nbsp;&nbsp;find B4: cells 4(empty) -&gt; NOT FOUND<br>
RIGHT delete A4 (mark #): [_ _ _ _ # B4 C5 _ _ _]<br>
&nbsp;&nbsp;&nbsp;find B4: cells 4(#) 5 -&gt; found in cell 5<br>
&nbsp;&nbsp;&nbsp;find D4: cells 4(#) 5 6 7(empty) -&gt; NOT FOUND<br>
insert D4: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[_ _ _ _ D4 B4 C5 _ _ _]<br>
delete B4, C5 (mark #): &nbsp;&nbsp;[_ _ _ _ D4 # # _ _ _]<br>
refresh (rebuild): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[_ _ _ _ D4 _ _ _ _ _]</div>
<table>
<thead><tr><th>Step</th><th>Cells 4 5 6 7</th><th>What happens</th></tr></thead>
<tbody>
<tr><td>insert A4, B4, C5</td><td>A4 B4 C5 _</td><td>B4 finds 4 taken → 5; C5 finds 5 taken → 6</td></tr>
<tr><td>delete A4 by emptying</td><td>_ B4 C5 _</td><td>find B4 stops at the empty cell 4 → NOT FOUND (wrong)</td></tr>
<tr><td>delete A4 by marking</td><td># B4 C5 _</td><td>find B4 walks past # at 4 and finds B4 at 5</td></tr>
<tr><td>insert D4</td><td>D4 B4 C5 _</td><td>search 4 #, 5, 6, 7 empty → D4 is absent → it takes the first # (cell 4)</td></tr>
<tr><td>delete B4, C5, then refresh</td><td>D4 _ _ _</td><td>rebuild: only the live key D4 is re-inserted</td></tr>
</tbody>
</table>
<p>The keys are named like the slide's (the digit is the home position); C5 and D4 are the lesson's additions. Goodrich's <code>ProbeHashMap</code> uses the same idea with a special marker entry it calls <code>DEFUNCT</code>.</p>
<div class="pitfall">Two classic tombstone bugs: (1) the search stops at a mark as if it were empty — the slide's error all over again; (2) the insertion drops the key into the first mark <em>without checking</em> that the key is not stored further along — the table then holds the key twice.</div>`,
        `<p class="y-chinh">🎯 Trong bảng dò tuyến tính, không thể xoá khoá bằng cách làm trống ô của nó — lần tìm sau sẽ dừng ngay tại "lỗ hổng" đó; thay vào đó hãy đánh dấu ô là đã xoá, dùng lại ô khi chèn, và làm mới (refresh) bảng khi có quá nhiều dấu.</p>
<ul>
<li><strong>Tình huống trên slide</strong>: A4 và B4 cùng băm vào vị trí 4, nên B4 nằm sau A4. Xoá A4 bằng cách làm trống ô 4, rồi tìm B4: phép tìm bắt đầu ở 4, thấy ô trống và kết luận "không có B4" — sai.</li>
<li><strong>Cách chữa</strong>: chỉ đánh dấu vị trí đã xoá (dấu "bia mộ" — tombstone). Phép tìm đi <em>qua</em> ô có dấu; phép chèn được đặt phần tử mới vào ô có dấu đầu tiên trên đường dò.</li>
<li><strong>Làm mới (refresh)</strong>: quá nhiều dấu xoá khiến lần tìm nào cũng dài, nên bảng được dựng lại chỉ với các khoá còn sống.</li>
</ul>
<pre><code class="language-java">class ProbeTable {
    static final int M = 10, EMPTY = 0, FULL = 1, DELETED = 2;
    String[] key = new String[M];
    int[] state = new int[M];                        // mọi ô ban đầu là EMPTY

    static int home(String k) { return k.charAt(1) - '0'; }   // "B4" -&gt; 4, như A4, B4 trên slide

    int find(String k, StringBuilder path) {         // chỉ số của k, hoặc -1
        int i = home(k);
        for (int n = 0; n &lt; M; n++, i = (i + 1) % M) {
            path.append(i).append(state[i] == DELETED ? "(#) " : state[i] == EMPTY ? "(empty) " : " ");
            if (state[i] == EMPTY) return -1;         // ô trống: dừng
            if (state[i] == FULL &amp;&amp; key[i].equals(k)) return i;   // ô DELETED thì đi tiếp
        }
        return -1;
    }

    void insert(String k) {
        int firstFree = -1, i = home(k);
        for (int n = 0; n &lt; M; n++, i = (i + 1) % M) {
            if (state[i] == FULL) { if (key[i].equals(k)) return; continue; }   // đã có rồi
            if (firstFree &lt; 0) firstFree = i;         // nhớ ô dùng lại được đầu tiên
            if (state[i] == EMPTY) break;             // chắc chắn k không có
        }
        if (firstFree &gt;= 0) { key[firstFree] = k; state[firstFree] = FULL; }
    }

    ProbeTable refresh() {                           // dựng lại chỉ với các khoá còn sống
        ProbeTable t = new ProbeTable();
        for (int i = 0; i &lt; M; i++) if (state[i] == FULL) t.insert(key[i]);
        return t;
    }

    String show() {
        StringBuilder s = new StringBuilder("[");
        for (int i = 0; i &lt; M; i++) s.append(i == 0 ? "" : " ").append(state[i] == FULL ? key[i] : state[i] == DELETED ? "#" : "_");
        return s + "]";
    }
}

public class Tombstone {
    static void find(ProbeTable t, String k) {
        StringBuilder path = new StringBuilder();
        int i = t.find(k, path);
        System.out.println("   find " + k + ": cells " + path + "-&gt; " + (i &lt; 0 ? "NOT FOUND" : "found in cell " + i));
    }

    public static void main(String[] args) {
        ProbeTable naive = new ProbeTable(), marked = new ProbeTable();
        for (String k : new String[] {"A4", "B4", "C5"}) { naive.insert(k); marked.insert(k); }
        System.out.println("insert A4 B4 C5:          " + marked.show());
        naive.state[4] = ProbeTable.EMPTY;            // SAI: xoá A4 bằng cách làm trống ô
        System.out.println("WRONG delete A4 (empty):  " + naive.show());
        find(naive, "B4");
        marked.state[4] = ProbeTable.DELETED;         // ĐÚNG: đánh dấu ô là đã xoá
        System.out.println("RIGHT delete A4 (mark #): " + marked.show());
        find(marked, "B4");
        find(marked, "D4");                           // trước khi chèn: D4 chưa có
        marked.insert("D4");                          // vào ô # đầu tiên trên đường dò
        System.out.println("insert D4:                " + marked.show());
        marked.state[5] = ProbeTable.DELETED;         // xoá B4
        marked.state[6] = ProbeTable.DELETED;         // xoá C5
        System.out.println("delete B4, C5 (mark #):   " + marked.show());
        System.out.println("refresh (rebuild):        " + marked.refresh().show());
    }
}</code></pre>
<div class="out">insert A4 B4 C5: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[_ _ _ _ A4 B4 C5 _ _ _]<br>
WRONG delete A4 (empty): &nbsp;[_ _ _ _ _ B4 C5 _ _ _]<br>
&nbsp;&nbsp;&nbsp;find B4: cells 4(empty) -&gt; NOT FOUND<br>
RIGHT delete A4 (mark #): [_ _ _ _ # B4 C5 _ _ _]<br>
&nbsp;&nbsp;&nbsp;find B4: cells 4(#) 5 -&gt; found in cell 5<br>
&nbsp;&nbsp;&nbsp;find D4: cells 4(#) 5 6 7(empty) -&gt; NOT FOUND<br>
insert D4: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[_ _ _ _ D4 B4 C5 _ _ _]<br>
delete B4, C5 (mark #): &nbsp;&nbsp;[_ _ _ _ D4 # # _ _ _]<br>
refresh (rebuild): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[_ _ _ _ D4 _ _ _ _ _]</div>
<table>
<thead><tr><th>Bước</th><th>Ô 4 5 6 7</th><th>Chuyện gì xảy ra</th></tr></thead>
<tbody>
<tr><td>chèn A4, B4, C5</td><td>A4 B4 C5 _</td><td>B4 thấy 4 có người → 5; C5 thấy 5 có người → 6</td></tr>
<tr><td>xoá A4 bằng cách làm trống</td><td>_ B4 C5 _</td><td>tìm B4 dừng ở ô trống 4 → KHÔNG THẤY (sai)</td></tr>
<tr><td>xoá A4 bằng cách đánh dấu</td><td># B4 C5 _</td><td>tìm B4 đi qua # ở ô 4 và thấy B4 ở ô 5</td></tr>
<tr><td>chèn D4</td><td>D4 B4 C5 _</td><td>dò 4 #, 5, 6, 7 trống → D4 chưa có → lấy ô # đầu tiên (ô 4)</td></tr>
<tr><td>xoá B4, C5, rồi làm mới</td><td>D4 _ _ _</td><td>dựng lại: chỉ khoá còn sống D4 được chèn lại</td></tr>
</tbody>
</table>
<p>Khoá được đặt tên giống slide (chữ số là vị trí nhà); C5 và D4 là khoá bài thêm vào. Lớp <code>ProbeHashMap</code> trong sách Goodrich dùng đúng ý này, với một mục đánh dấu đặc biệt tên là <code>DEFUNCT</code> (đã chết).</p>
<div class="pitfall">Hai lỗi kinh điển với dấu xoá: (1) phép tìm dừng ở ô có dấu như thể ô trống — lặp lại đúng lỗi của slide; (2) phép chèn bỏ khoá vào ô có dấu đầu tiên mà <em>không kiểm tra</em> khoá đó đã nằm xa hơn trên dãy dò chưa — bảng sẽ chứa một khoá hai lần.</div>`],
      [26, 'Perfect Hash Functions',
        `<p class="y-chinh">🎯 A hash function that transforms different keys into different numbers is perfect; if it also needs only as many cells as there are keys, so that no cell stays empty, it is a minimal perfect hash function — and Cichelli's method constructs one.</p>
<ul>
<li><strong>Only for a fixed key set known in advance</strong> (slide 7): the reserved words of a compiler, the days of the week, the commands of a shell.</li>
<li><strong>Cichelli's method</strong>: h(word) = (length(word) + g(first letter) + g(last letter)) mod TSize, where a backtracking search chooses a number g for each letter so that no two words collide.</li>
</ul>
<pre><code class="language-java">public class Cichelli {
    // ordered as Cichelli suggests: words whose first/last letters are most frequent come first
    static String[] words = {"SAT", "TUE", "THU", "SUN", "MON", "WED", "FRI"};
    static int n = words.length, maxG = n - 1;       // table size = number of keys (minimal)
    static int[] g = new int[26];                    // one number per letter, found by the search
    static boolean[] fixed = new boolean[26];
    static boolean[] taken = new boolean[n];
    static int tries = 0;

    // h(w) = (length(w) + g(first letter) + g(last letter)) mod n
    static int h(String w) { return (w.length() + g[w.charAt(0) - 'A'] + g[w.charAt(w.length() - 1) - 'A']) % n; }

    static boolean search(int i) {                   // backtracking: word i gets a free cell or we undo
        if (i == n) return true;
        String w = words[i];
        int a = w.charAt(0) - 'A', b = w.charAt(w.length() - 1) - 'A';
        boolean freeA = !fixed[a], freeB = !fixed[b] &amp;&amp; a != b;
        for (int va = 0; va &lt;= (freeA ? maxG : 0); va++)
            for (int vb = 0; vb &lt;= (freeB ? maxG : 0); vb++) {
                if (freeA) { g[a] = va; fixed[a] = true; }
                if (freeB) { g[b] = vb; fixed[b] = true; }
                tries++;
                int k = h(w);
                if (!taken[k]) {
                    taken[k] = true;
                    if (search(i + 1)) return true;
                    taken[k] = false;
                }
                if (freeA) fixed[a] = false;
                if (freeB) fixed[b] = false;
            }
        return false;
    }

    public static void main(String[] args) {
        if (!search(0)) { System.out.println("no solution"); return; }
        StringBuilder gs = new StringBuilder();
        for (int c = 0; c &lt; 26; c++) if (fixed[c]) gs.append((char) ('A' + c)).append('=').append(g[c]).append(' ');
        System.out.println("g: " + gs + "(found after " + tries + " tries)");
        String[] table = new String[n];
        for (String w : words) {
            int k = h(w);
            table[k] = w;
            System.out.println(w + ": (" + w.length() + " + g(" + w.charAt(0) + ") + g(" + w.charAt(2) + ")) % 7 = ("
                    + w.length() + " + " + g[w.charAt(0) - 'A'] + " + " + g[w.charAt(2) - 'A'] + ") % 7 = " + k);
        }
        StringBuilder t = new StringBuilder();
        for (int i = 0; i &lt; n; i++) t.append(i).append(':').append(table[i]).append(' ');
        System.out.println("table: " + t + "-&gt; 7 keys, 7 cells, no collision, no empty cell");
    }
}</code></pre>
<div class="out">g: D=5 E=1 F=0 I=6 M=1 N=3 S=0 T=0 U=2 W=0 (found after 25 tries)<br>
SAT: (3 + g(S) + g(T)) % 7 = (3 + 0 + 0) % 7 = 3<br>
TUE: (3 + g(T) + g(E)) % 7 = (3 + 0 + 1) % 7 = 4<br>
THU: (3 + g(T) + g(U)) % 7 = (3 + 0 + 2) % 7 = 5<br>
SUN: (3 + g(S) + g(N)) % 7 = (3 + 0 + 3) % 7 = 6<br>
MON: (3 + g(M) + g(N)) % 7 = (3 + 1 + 3) % 7 = 0<br>
WED: (3 + g(W) + g(D)) % 7 = (3 + 0 + 5) % 7 = 1<br>
FRI: (3 + g(F) + g(I)) % 7 = (3 + 0 + 6) % 7 = 2<br>
table: 0:MON 1:WED 2:FRI 3:SAT 4:TUE 5:THU 6:SUN -&gt; 7 keys, 7 cells, no collision, no empty cell</div>
<p>The lesson's own example: 7 day names into 7 cells — no collision and no empty cell, so a minimal perfect hash function. The words are ordered as Cichelli suggests — those whose first and last letters occur most often come first — a heuristic that keeps the backtracking short: 25 tries here.</p>
<p class="dap-an">✅ <strong>Answer (syllabus question "What is a perfect hash function?"):</strong> a hash function that maps the keys of a known set to pairwise different addresses, so every search needs exactly one probe; if the table has exactly as many cells as keys, it is a minimal perfect hash function.</p>
<div class="pitfall">"Perfect" is not "good for any data": add an eighth word and the g values must be searched again. And a perfect function may still leave empty cells — only the <em>minimal</em> perfect one fills every cell.</div>`,
        `<p class="y-chinh">🎯 Hàm băm biến các khoá khác nhau thành các số khác nhau gọi là hàm băm hoàn hảo (perfect hash function); nếu nó còn chỉ cần đúng bằng số ô như số khoá, không còn ô nào trống, thì gọi là hàm băm hoàn hảo tối thiểu (minimal perfect) — và phương pháp Cichelli dựng được hàm như vậy.</p>
<ul>
<li><strong>Chỉ dùng cho một tập khoá cố định, biết trước</strong> (slide 7): các từ khoá dành riêng của trình biên dịch, tên các ngày trong tuần, các lệnh của một shell (trình thông dịch lệnh).</li>
<li><strong>Phương pháp Cichelli</strong>: h(từ) = (độ dài(từ) + g(chữ đầu) + g(chữ cuối)) mod TSize (TSize là kích thước bảng), trong đó một phép tìm quay lui (backtracking) chọn cho mỗi chữ cái một số g sao cho không có hai từ nào va chạm.</li>
</ul>
<pre><code class="language-java">public class Cichelli {
    // xếp theo gợi ý của Cichelli: từ có chữ đầu/cuối xuất hiện nhiều nhất đứng trước
    static String[] words = {"SAT", "TUE", "THU", "SUN", "MON", "WED", "FRI"};
    static int n = words.length, maxG = n - 1;       // cỡ bảng = số khoá (tối thiểu)
    static int[] g = new int[26];                    // mỗi chữ cái một số, do phép tìm quyết định
    static boolean[] fixed = new boolean[26];
    static boolean[] taken = new boolean[n];
    static int tries = 0;

    // h(w) = (độ dài(w) + g(chữ đầu) + g(chữ cuối)) mod n
    static int h(String w) { return (w.length() + g[w.charAt(0) - 'A'] + g[w.charAt(w.length() - 1) - 'A']) % n; }

    static boolean search(int i) {                   // quay lui: từ i nhận một ô trống, nếu không thì gỡ
        if (i == n) return true;
        String w = words[i];
        int a = w.charAt(0) - 'A', b = w.charAt(w.length() - 1) - 'A';
        boolean freeA = !fixed[a], freeB = !fixed[b] &amp;&amp; a != b;
        for (int va = 0; va &lt;= (freeA ? maxG : 0); va++)
            for (int vb = 0; vb &lt;= (freeB ? maxG : 0); vb++) {
                if (freeA) { g[a] = va; fixed[a] = true; }
                if (freeB) { g[b] = vb; fixed[b] = true; }
                tries++;
                int k = h(w);
                if (!taken[k]) {
                    taken[k] = true;
                    if (search(i + 1)) return true;
                    taken[k] = false;
                }
                if (freeA) fixed[a] = false;
                if (freeB) fixed[b] = false;
            }
        return false;
    }

    public static void main(String[] args) {
        if (!search(0)) { System.out.println("no solution"); return; }
        StringBuilder gs = new StringBuilder();
        for (int c = 0; c &lt; 26; c++) if (fixed[c]) gs.append((char) ('A' + c)).append('=').append(g[c]).append(' ');
        System.out.println("g: " + gs + "(found after " + tries + " tries)");
        String[] table = new String[n];
        for (String w : words) {
            int k = h(w);
            table[k] = w;
            System.out.println(w + ": (" + w.length() + " + g(" + w.charAt(0) + ") + g(" + w.charAt(2) + ")) % 7 = ("
                    + w.length() + " + " + g[w.charAt(0) - 'A'] + " + " + g[w.charAt(2) - 'A'] + ") % 7 = " + k);
        }
        StringBuilder t = new StringBuilder();
        for (int i = 0; i &lt; n; i++) t.append(i).append(':').append(table[i]).append(' ');
        System.out.println("table: " + t + "-&gt; 7 keys, 7 cells, no collision, no empty cell");
    }
}</code></pre>
<div class="out">g: D=5 E=1 F=0 I=6 M=1 N=3 S=0 T=0 U=2 W=0 (found after 25 tries)<br>
SAT: (3 + g(S) + g(T)) % 7 = (3 + 0 + 0) % 7 = 3<br>
TUE: (3 + g(T) + g(E)) % 7 = (3 + 0 + 1) % 7 = 4<br>
THU: (3 + g(T) + g(U)) % 7 = (3 + 0 + 2) % 7 = 5<br>
SUN: (3 + g(S) + g(N)) % 7 = (3 + 0 + 3) % 7 = 6<br>
MON: (3 + g(M) + g(N)) % 7 = (3 + 1 + 3) % 7 = 0<br>
WED: (3 + g(W) + g(D)) % 7 = (3 + 0 + 5) % 7 = 1<br>
FRI: (3 + g(F) + g(I)) % 7 = (3 + 0 + 6) % 7 = 2<br>
table: 0:MON 1:WED 2:FRI 3:SAT 4:TUE 5:THU 6:SUN -&gt; 7 keys, 7 cells, no collision, no empty cell</div>
<p>Ví dụ của bài: 7 tên ngày vào 7 ô — không va chạm, không ô trống, tức là hàm băm hoàn hảo tối thiểu. Các từ được xếp theo gợi ý của Cichelli — từ nào có chữ đầu và chữ cuối xuất hiện nhiều nhất thì đứng trước — một mẹo kinh nghiệm (heuristic) giúp phép quay lui ngắn lại: ở đây chỉ 25 lần thử.</p>
<p class="dap-an">✅ <strong>Đáp án (câu hỏi syllabus "Hàm băm hoàn hảo là gì?"):</strong> là hàm băm ánh xạ các khoá của một tập biết trước vào các địa chỉ đôi một khác nhau, nên mọi lần tìm chỉ cần đúng một lần dò; nếu bảng có số ô đúng bằng số khoá thì đó là hàm băm hoàn hảo tối thiểu.</p>
<div class="pitfall">"Hoàn hảo" không có nghĩa là "tốt với mọi dữ liệu": thêm một từ thứ tám là phải tìm lại các giá trị g. Và hàm hoàn hảo vẫn có thể để lại ô trống — chỉ hàm hoàn hảo <em>tối thiểu</em> mới lấp kín mọi ô.</div>`],
      [27, 'Hash Functions for Extendible Files',
        `<p class="y-chinh">🎯 Static hashing uses a fixed-size table; dynamic (extendible) hashing splits and merges buckets as the database grows or shrinks, using only a prefix of each hash value — as many bits as the current size needs.</p>
<ul>
<li><strong>Static hashing</strong>: the table size is fixed; if the data outgrows it, everything must be rehashed.</li>
<li><strong>Extendible hashing</strong>: the hash function produces long values, spread uniformly; only the first d bits (a prefix) index a <strong>directory</strong> of 2<sup>d</sup> entries, each pointing to a bucket.</li>
<li><strong>More than one consecutive index can point to the same bucket</strong>: a bucket that uses only 1 bit is shared by 2 entries of a directory that uses 2 bits.</li>
<li><strong>A full bucket</strong> is split in two using one more bit; if it already uses all d bits, the directory doubles first (d + 1). Buckets are added — or merged — on demand.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class Bucket {
    char name;
    int depth;                                        // local depth: bits this bucket really uses
    ArrayList&lt;Integer&gt; keys = new ArrayList&lt;Integer&gt;();

    Bucket(char name, int depth) { this.name = name; this.depth = depth; }
}

public class Extendible {
    static final int BITS = 4, CAP = 2;               // 4-bit hash values, 2 keys per bucket
    static int global = 0;                            // the directory has 2^global entries
    static ArrayList&lt;Bucket&gt; dir = new ArrayList&lt;Bucket&gt;();
    static char nextName = 'A';

    static int prefix(int h, int d) { return h &gt;&gt; (BITS - d); }         // the first d bits of h
    static String bin(int v, int w) { String s = Integer.toBinaryString(v | (1 &lt;&lt; w)); return s.substring(1); }

    static String insert(int h) {
        Bucket b = dir.get(prefix(h, global));
        if (b.keys.size() &lt; CAP) { b.keys.add(h); return ""; }
        String note = "   bucket " + b.name + " is full:";
        if (b.depth == global) {                      // no spare bit: double the directory
            ArrayList&lt;Bucket&gt; bigger = new ArrayList&lt;Bucket&gt;();
            for (Bucket x : dir) { bigger.add(x); bigger.add(x); }       // entry p -&gt; entries 2p, 2p+1
            dir = bigger;
            global++;
            note += " directory doubled,";
        }
        b.depth++;
        Bucket nb = new Bucket(nextName++, b.depth);  // a new bucket is added on demand
        for (int i = 0; i &lt; dir.size(); i++)
            if (dir.get(i) == b &amp;&amp; ((i &gt;&gt; (global - b.depth)) &amp; 1) == 1) dir.set(i, nb);
        ArrayList&lt;Integer&gt; old = b.keys;
        b.keys = new ArrayList&lt;Integer&gt;();
        for (int k : old) dir.get(prefix(k, global)).keys.add(k);
        return note + " " + b.name + " split into " + b.name + " and " + nb.name + "\\n" + insert(h);   // try again
    }

    public static void main(String[] args) {
        dir.add(new Bucket(nextName++, 0));
        for (int h : new int[] {0b1010, 0b0111, 0b1100, 0b0010, 0b1110, 0b0100}) {
            System.out.print("insert " + bin(h, BITS) + insert(h));
            StringBuilder s = new StringBuilder();
            for (int i = 0; i &lt; dir.size(); i++) {
                Bucket b = dir.get(i);
                s.append(global == 0 ? "*" : bin(i, global)).append("-&gt;").append(b.name).append('{');
                for (int j = 0; j &lt; b.keys.size(); j++) s.append(j == 0 ? "" : ",").append(bin(b.keys.get(j), BITS));
                s.append("} ");
            }
            System.out.println("   d=" + global + ": " + s);
        }
    }
}</code></pre>
<div class="out">insert 1010 &nbsp;&nbsp;d=0: *-&gt;A{1010}<br>
insert 0111 &nbsp;&nbsp;d=0: *-&gt;A{1010,0111}<br>
insert 1100 &nbsp;&nbsp;bucket A is full: directory doubled, A split into A and B<br>
&nbsp;&nbsp;&nbsp;d=1: 0-&gt;A{0111} 1-&gt;B{1010,1100}<br>
insert 0010 &nbsp;&nbsp;d=1: 0-&gt;A{0111,0010} 1-&gt;B{1010,1100}<br>
insert 1110 &nbsp;&nbsp;bucket B is full: directory doubled, B split into B and C<br>
&nbsp;&nbsp;&nbsp;d=2: 00-&gt;A{0111,0010} 01-&gt;A{0111,0010} 10-&gt;B{1010} 11-&gt;C{1100,1110}<br>
insert 0100 &nbsp;&nbsp;bucket A is full: A split into A and D<br>
&nbsp;&nbsp;&nbsp;d=2: 00-&gt;A{0010} 01-&gt;D{0111,0100} 10-&gt;B{1010} 11-&gt;C{1100,1110}</div>
<p>The lesson's own example (4-bit hash values, 2 keys per bucket). After inserting 1110, entries 00 and 01 both point to bucket A — for A only the first bit matters. Inserting 0100 then splits A without doubling the directory.</p>
<p><strong>Big-O:</strong> a search is one directory lookup plus one bucket — a constant number of disk reads, which is why databases and file systems use it; doubling the directory costs O(2<sup>d</sup>) but happens rarely.</p>`,
        `<p class="y-chinh">🎯 Băm tĩnh (static hashing) dùng bảng kích thước cố định; băm động hay băm mở rộng (dynamic / extendible hashing) tách và gộp các bucket (thùng chứa) theo đà lớn lên hay nhỏ đi của cơ sở dữ liệu, và chỉ dùng một tiền tố (prefix) của giá trị băm — đủ số bit mà kích thước hiện tại cần.</p>
<ul>
<li><strong>Băm tĩnh</strong>: kích thước bảng cố định; dữ liệu vượt quá thì phải băm lại toàn bộ.</li>
<li><strong>Băm mở rộng</strong>: hàm băm sinh ra giá trị dài, phân bố đều; chỉ d bit đầu (tiền tố) được dùng làm chỉ số cho một <strong>thư mục (directory)</strong> gồm 2<sup>d</sup> mục, mỗi mục trỏ tới một bucket.</li>
<li><strong>Nhiều chỉ số liên tiếp có thể trỏ cùng một bucket</strong>: bucket chỉ dùng 1 bit sẽ được 2 mục của một thư mục dùng 2 bit cùng trỏ tới.</li>
<li><strong>Bucket đầy</strong> được tách đôi bằng cách dùng thêm một bit; nếu nó đã dùng hết d bit thì thư mục phải nhân đôi trước (d + 1). Bucket được thêm — hoặc gộp — khi cần.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;

class Bucket {
    char name;
    int depth;                                        // độ sâu cục bộ: số bit bucket này thật sự dùng
    ArrayList&lt;Integer&gt; keys = new ArrayList&lt;Integer&gt;();

    Bucket(char name, int depth) { this.name = name; this.depth = depth; }
}

public class Extendible {
    static final int BITS = 4, CAP = 2;               // giá trị băm 4 bit, mỗi bucket 2 khoá
    static int global = 0;                            // thư mục có 2^global mục
    static ArrayList&lt;Bucket&gt; dir = new ArrayList&lt;Bucket&gt;();
    static char nextName = 'A';

    static int prefix(int h, int d) { return h &gt;&gt; (BITS - d); }         // d bit đầu của h
    static String bin(int v, int w) { String s = Integer.toBinaryString(v | (1 &lt;&lt; w)); return s.substring(1); }

    static String insert(int h) {
        Bucket b = dir.get(prefix(h, global));
        if (b.keys.size() &lt; CAP) { b.keys.add(h); return ""; }
        String note = "   bucket " + b.name + " is full:";
        if (b.depth == global) {                      // hết bit dư: nhân đôi thư mục
            ArrayList&lt;Bucket&gt; bigger = new ArrayList&lt;Bucket&gt;();
            for (Bucket x : dir) { bigger.add(x); bigger.add(x); }       // mục p -&gt; hai mục 2p, 2p+1
            dir = bigger;
            global++;
            note += " directory doubled,";
        }
        b.depth++;
        Bucket nb = new Bucket(nextName++, b.depth);  // thêm một bucket mới khi cần
        for (int i = 0; i &lt; dir.size(); i++)
            if (dir.get(i) == b &amp;&amp; ((i &gt;&gt; (global - b.depth)) &amp; 1) == 1) dir.set(i, nb);
        ArrayList&lt;Integer&gt; old = b.keys;
        b.keys = new ArrayList&lt;Integer&gt;();
        for (int k : old) dir.get(prefix(k, global)).keys.add(k);
        return note + " " + b.name + " split into " + b.name + " and " + nb.name + "\\n" + insert(h);   // thử lại
    }

    public static void main(String[] args) {
        dir.add(new Bucket(nextName++, 0));
        for (int h : new int[] {0b1010, 0b0111, 0b1100, 0b0010, 0b1110, 0b0100}) {
            System.out.print("insert " + bin(h, BITS) + insert(h));
            StringBuilder s = new StringBuilder();
            for (int i = 0; i &lt; dir.size(); i++) {
                Bucket b = dir.get(i);
                s.append(global == 0 ? "*" : bin(i, global)).append("-&gt;").append(b.name).append('{');
                for (int j = 0; j &lt; b.keys.size(); j++) s.append(j == 0 ? "" : ",").append(bin(b.keys.get(j), BITS));
                s.append("} ");
            }
            System.out.println("   d=" + global + ": " + s);
        }
    }
}</code></pre>
<div class="out">insert 1010 &nbsp;&nbsp;d=0: *-&gt;A{1010}<br>
insert 0111 &nbsp;&nbsp;d=0: *-&gt;A{1010,0111}<br>
insert 1100 &nbsp;&nbsp;bucket A is full: directory doubled, A split into A and B<br>
&nbsp;&nbsp;&nbsp;d=1: 0-&gt;A{0111} 1-&gt;B{1010,1100}<br>
insert 0010 &nbsp;&nbsp;d=1: 0-&gt;A{0111,0010} 1-&gt;B{1010,1100}<br>
insert 1110 &nbsp;&nbsp;bucket B is full: directory doubled, B split into B and C<br>
&nbsp;&nbsp;&nbsp;d=2: 00-&gt;A{0111,0010} 01-&gt;A{0111,0010} 10-&gt;B{1010} 11-&gt;C{1100,1110}<br>
insert 0100 &nbsp;&nbsp;bucket A is full: A split into A and D<br>
&nbsp;&nbsp;&nbsp;d=2: 00-&gt;A{0010} 01-&gt;D{0111,0100} 10-&gt;B{1010} 11-&gt;C{1100,1110}</div>
<p>Ví dụ của bài (giá trị băm 4 bit, mỗi bucket 2 khoá). Sau khi chèn 1110, hai mục 00 và 01 cùng trỏ tới bucket A — với A chỉ bit đầu là quan trọng. Chèn 0100 sau đó tách A mà không cần nhân đôi thư mục.</p>
<p><strong>Big-O:</strong> một lần tìm là một lần tra thư mục cộng một bucket — số lần đọc đĩa là hằng số, vì thế cơ sở dữ liệu và hệ thống tệp dùng nó; nhân đôi thư mục tốn O(2<sup>d</sup>) nhưng hiếm khi xảy ra.</p>`],
      [28, 'Cryptographic Hash Functions',
        `<p class="y-chinh">🎯 A cryptographic hash function turns any message into a fixed-size value — the hash value, message digest, digital fingerprint or checksum — that is easy to compute, practically impossible to invert, and changes completely when the message changes slightly.</p>
<ol>
<li><strong>Easy to compute</strong> for any given data.</li>
<li><strong>Hard to invert</strong>: finding a text that has a given hash is computationally infeasible.</li>
<li><strong>Collision-resistant</strong>: two slightly different messages are extremely unlikely to have the same hash.</li>
</ol>
<pre><code class="language-java">import java.security.MessageDigest;

public class Sha256Demo {
    static String hex(byte[] b) {
        StringBuilder s = new StringBuilder();
        for (byte x : b) s.append(Character.forDigit((x &gt;&gt; 4) &amp; 15, 16)).append(Character.forDigit(x &amp; 15, 16));
        return s.toString();
    }

    static byte[] digest(String algorithm, String msg) throws Exception {
        return MessageDigest.getInstance(algorithm).digest(msg.getBytes("UTF-8"));
    }

    public static void main(String[] args) throws Exception {
        byte[] a = digest("SHA-256", "abc"), b = digest("SHA-256", "abd");
        System.out.println("SHA-256(\\"abc\\") = " + hex(a));
        System.out.println("SHA-256(\\"abd\\") = " + hex(b));
        int diff = 0;
        for (int i = 0; i &lt; a.length; i++) diff += Integer.bitCount((a[i] ^ b[i]) &amp; 0xff);   // count differing bits
        System.out.println("one letter changed -&gt; " + diff + " of " + a.length * 8 + " bits differ");
        System.out.println("SHA-256 of a 10000-char text is still " + digest("SHA-256", new String(new char[10000]).replace('\\0', 'x')).length * 8 + " bits");
        System.out.println("MD5(\\"abc\\")     = " + hex(digest("MD5", "abc")) + " (128 bits)");
    }
}</code></pre>
<div class="out">SHA-256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad<br>
SHA-256("abd") = a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9<br>
one letter changed -&gt; 122 of 256 bits differ<br>
SHA-256 of a 10000-char text is still 256 bits<br>
MD5("abc") &nbsp;&nbsp;&nbsp;&nbsp;= 900150983cd24fb0d6963f7d28e17f72 (128 bits)</div>
<ul>
<li>Changing one letter ("abc" → "abd") changes 122 of the 256 bits — about half, as it should. The value is bytes, usually written in hexadecimal: the "alphanumeric string" of the slide.</li>
<li>Uses listed on the slide: message integrity checks, digital signatures, authentication, other information-security applications.</li>
<li><strong>Status today</strong>: collisions have been found for MD5 and SHA-1, so they must not be used for security; SHA-2 (SHA-256, SHA-512) and SHA-3 are the current choices.</li>
</ul>
<div class="pitfall">A cryptographic hash is not what <code>HashMap</code> uses: it is far slower than <code>hashCode()</code>, and a 256-bit value is not an array index. Table hashing wants speed and spread; cryptographic hashing wants to be impossible to reverse or to collide on purpose.</div>`,
        `<p class="y-chinh">🎯 Hàm băm mật mã (cryptographic hash function) biến một thông điệp bất kỳ thành một giá trị cỡ cố định — giá trị băm, bản tóm lược thông điệp (message digest), dấu vân tay số (digital fingerprint) hay tổng kiểm (checksum) — dễ tính, gần như không thể đảo ngược, và đổi hoàn toàn khi thông điệp đổi một chút.</p>
<ol>
<li><strong>Dễ tính</strong> với mọi dữ liệu.</li>
<li><strong>Khó đảo ngược</strong>: tìm một văn bản có giá trị băm cho trước là bất khả thi về mặt tính toán.</li>
<li><strong>Kháng va chạm (collision-resistant)</strong>: hai thông điệp chỉ hơi khác nhau gần như không thể có cùng giá trị băm.</li>
</ol>
<pre><code class="language-java">import java.security.MessageDigest;

public class Sha256Demo {
    static String hex(byte[] b) {
        StringBuilder s = new StringBuilder();
        for (byte x : b) s.append(Character.forDigit((x &gt;&gt; 4) &amp; 15, 16)).append(Character.forDigit(x &amp; 15, 16));
        return s.toString();
    }

    static byte[] digest(String algorithm, String msg) throws Exception {
        return MessageDigest.getInstance(algorithm).digest(msg.getBytes("UTF-8"));
    }

    public static void main(String[] args) throws Exception {
        byte[] a = digest("SHA-256", "abc"), b = digest("SHA-256", "abd");
        System.out.println("SHA-256(\\"abc\\") = " + hex(a));
        System.out.println("SHA-256(\\"abd\\") = " + hex(b));
        int diff = 0;
        for (int i = 0; i &lt; a.length; i++) diff += Integer.bitCount((a[i] ^ b[i]) &amp; 0xff);   // đếm số bit khác nhau
        System.out.println("one letter changed -&gt; " + diff + " of " + a.length * 8 + " bits differ");
        System.out.println("SHA-256 of a 10000-char text is still " + digest("SHA-256", new String(new char[10000]).replace('\\0', 'x')).length * 8 + " bits");
        System.out.println("MD5(\\"abc\\")     = " + hex(digest("MD5", "abc")) + " (128 bits)");
    }
}</code></pre>
<div class="out">SHA-256("abc") = ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad<br>
SHA-256("abd") = a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9<br>
one letter changed -&gt; 122 of 256 bits differ<br>
SHA-256 of a 10000-char text is still 256 bits<br>
MD5("abc") &nbsp;&nbsp;&nbsp;&nbsp;= 900150983cd24fb0d6963f7d28e17f72 (128 bits)</div>
<ul>
<li>Đổi một chữ cái ("abc" → "abd") làm đổi 122 trên 256 bit — khoảng một nửa, đúng như mong đợi. Giá trị băm là các byte, thường viết ở hệ mười sáu (hex): chính là "chuỗi chữ-số" (alphanumeric string) mà slide nhắc tới.</li>
<li>Ứng dụng slide liệt kê: kiểm tra toàn vẹn thông điệp, chữ ký số, xác thực (authentication), các ứng dụng an toàn thông tin khác.</li>
<li><strong>Tình hình hiện nay</strong>: người ta đã tìm ra va chạm cho MD5 và SHA-1, nên không được dùng chúng cho mục đích bảo mật; SHA-2 (SHA-256, SHA-512) và SHA-3 là lựa chọn hiện tại.</li>
</ul>
<div class="pitfall">Hàm băm mật mã không phải thứ <code>HashMap</code> dùng: nó chậm hơn <code>hashCode()</code> rất nhiều, và một giá trị 256 bit đâu phải chỉ số mảng. Băm cho bảng cần nhanh và rải đều; băm mật mã cần không thể đảo ngược và không thể cố tình tạo va chạm.</div>`],
      [29, 'Hash Code',
        `<p class="y-chinh">🎯 The first action of a hash function is to convert an arbitrary key into an integer, its hash code; that integer need not be in the range [0, M − 1] and may even be negative, so a second step must bring it into the table.</p>
<ul>
<li><strong>Integer keys</strong>: Key mod TableSize is the general strategy — unless the keys have an undesirable pattern (all end in 0 with mod 10, slide 9).</li>
<li><strong>Other keys</strong>: first compute the hash code — in Java <code>key.hashCode()</code> — then compress it into an index.</li>
<li><strong>Negative codes</strong>: in Java <code>h % M</code> is negative when h is negative, and a negative index crashes. Use <code>Math.floorMod(h, M)</code> or <code>(h &amp; 0x7fffffff) % M</code>.</li>
<li><strong>Real keys between 0 and 1</strong>: the slide multiplies by M and rounds; truncating, <code>(int) (x * M)</code>, is the safe reading — rounding 0.97 × 10 gives 10, one past the last index.</li>
</ul>
<pre><code class="language-java">public class HashCodeDemo {
    public static void main(String[] args) {
        int m = 10;
        for (String k : new String[] {"cat", "Aa", "BB", "polygenelubricants"}) {
            int h = k.hashCode();                              // the hash code: any int, maybe negative
            System.out.println(String.format("%-18s hashCode = %11d | h %% 10 = %2d | floorMod = %d | (h &amp; 0x7fffffff) %% 10 = %d",
                    k, h, h % m, Math.floorMod(h, m), (h &amp; 0x7fffffff) % m));
        }
        System.out.println("Math.abs(Integer.MIN_VALUE) = " + Math.abs(Integer.MIN_VALUE) + "   &lt;- still negative!");
        for (double x : new double[] {0.12, 0.5, 0.97}) {     // real keys in [0, 1), M = 10
            System.out.println("key " + x + ": (int) (x * 10) = " + (int) (x * m) + ",  Math.round(x * 10) = " + Math.round(x * m));
        }
    }
}</code></pre>
<div class="out">cat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hashCode = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;98262 | h % 10 = &nbsp;2 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 2<br>
Aa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hashCode = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2112 | h % 10 = &nbsp;2 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 2<br>
BB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hashCode = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2112 | h % 10 = &nbsp;2 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 2<br>
polygenelubricants hashCode = -2147483648 | h % 10 = -8 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 0<br>
Math.abs(Integer.MIN_VALUE) = -2147483648 &nbsp;&nbsp;&lt;- still negative!<br>
key 0.12: (int) (x * 10) = 1, &nbsp;Math.round(x * 10) = 1<br>
key 0.5: (int) (x * 10) = 5, &nbsp;Math.round(x * 10) = 5<br>
key 0.97: (int) (x * 10) = 9, &nbsp;Math.round(x * 10) = 10</div>
<p>"Aa" and "BB" have the same hash code, 2112 — different keys, equal codes: a collision already at the hash-code stage. "polygenelubricants" hashes to exactly <code>Integer.MIN_VALUE</code>, the only int whose absolute value is still negative.</p>
<div class="pitfall"><code>Math.abs(key.hashCode()) % M</code> looks safe but fails for <code>Integer.MIN_VALUE</code>: <code>Math.abs</code> returns it unchanged, and the index becomes −8. Write <code>Math.floorMod(key.hashCode(), M)</code>.</div>`,
        `<p class="y-chinh">🎯 Việc đầu tiên của hàm băm là đổi một khoá bất kỳ thành một số nguyên, gọi là mã băm (hash code) của khoá; số đó không nhất thiết nằm trong [0, M − 1] và thậm chí có thể âm, nên cần thêm một bước đưa nó về trong bảng.</p>
<ul>
<li><strong>Khoá là số nguyên</strong>: Key mod TableSize (khoá chia lấy dư cho kích thước bảng) là chiến lược chung — trừ khi các khoá có quy luật xấu (mọi khoá tận cùng bằng 0 mà lấy mod 10, slide 9).</li>
<li><strong>Khoá loại khác</strong>: tính mã băm trước — trong Java là <code>key.hashCode()</code> — rồi nén (compress) nó thành chỉ số.</li>
<li><strong>Mã băm âm</strong>: trong Java, <code>h % M</code> ra số âm khi h âm, và chỉ số âm làm chương trình văng lỗi. Dùng <code>Math.floorMod(h, M)</code> hoặc <code>(h &amp; 0x7fffffff) % M</code>.</li>
<li><strong>Khoá là số thực trong khoảng 0 tới 1</strong>: slide nhân với M rồi làm tròn; cắt phần lẻ, <code>(int) (x * M)</code>, mới là cách hiểu an toàn — làm tròn 0,97 × 10 ra 10, vượt quá chỉ số cuối một ô.</li>
</ul>
<pre><code class="language-java">public class HashCodeDemo {
    public static void main(String[] args) {
        int m = 10;
        for (String k : new String[] {"cat", "Aa", "BB", "polygenelubricants"}) {
            int h = k.hashCode();                              // mã băm: số int bất kỳ, có thể âm
            System.out.println(String.format("%-18s hashCode = %11d | h %% 10 = %2d | floorMod = %d | (h &amp; 0x7fffffff) %% 10 = %d",
                    k, h, h % m, Math.floorMod(h, m), (h &amp; 0x7fffffff) % m));
        }
        System.out.println("Math.abs(Integer.MIN_VALUE) = " + Math.abs(Integer.MIN_VALUE) + "   &lt;- still negative!");
        for (double x : new double[] {0.12, 0.5, 0.97}) {     // khoá thực trong [0, 1), M = 10
            System.out.println("key " + x + ": (int) (x * 10) = " + (int) (x * m) + ",  Math.round(x * 10) = " + Math.round(x * m));
        }
    }
}</code></pre>
<div class="out">cat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hashCode = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;98262 | h % 10 = &nbsp;2 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 2<br>
Aa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hashCode = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2112 | h % 10 = &nbsp;2 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 2<br>
BB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hashCode = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2112 | h % 10 = &nbsp;2 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 2<br>
polygenelubricants hashCode = -2147483648 | h % 10 = -8 | floorMod = 2 | (h &amp; 0x7fffffff) % 10 = 0<br>
Math.abs(Integer.MIN_VALUE) = -2147483648 &nbsp;&nbsp;&lt;- still negative!<br>
key 0.12: (int) (x * 10) = 1, &nbsp;Math.round(x * 10) = 1<br>
key 0.5: (int) (x * 10) = 5, &nbsp;Math.round(x * 10) = 5<br>
key 0.97: (int) (x * 10) = 9, &nbsp;Math.round(x * 10) = 10</div>
<p>"Aa" và "BB" có cùng mã băm 2112 — khoá khác nhau, mã bằng nhau: va chạm (collision) ngay từ chặng mã băm. "polygenelubricants" băm ra đúng <code>Integer.MIN_VALUE</code>, số int duy nhất mà trị tuyệt đối vẫn âm.</p>
<div class="pitfall"><code>Math.abs(key.hashCode()) % M</code> trông an toàn nhưng hỏng với <code>Integer.MIN_VALUE</code>: <code>Math.abs</code> trả nguyên số đó (vẫn âm), và chỉ số thành −8. Hãy viết <code>Math.floorMod(key.hashCode(), M)</code>.</div>`],
      [30, 'Maps - 1',
        `<p class="y-chinh">🎯 A map is an abstract data type that stores key-value pairs (k, v), called entries, and retrieves a value by its uniquely identifying key; because keys are unique, the association of keys to values defines a mapping.</p>
<ul>
<li><strong>Entry</strong> = (key, value): the key identifies, the value is the data.</li>
<li><strong>Unique keys</strong>: storing a second value under an existing key replaces the old one — one key, one value.</li>
<li><strong>The file-cabinet metaphor</strong> of the slide's figure: think of the key as the label on a folder and the value as what is inside it; the map is the cabinet.</li>
<li><strong>The web as a map</strong>: the key of a page is its URL (for example http://datastructures.net/), the value is the page content.</li>
</ul>
<table>
<thead><tr><th>Map</th><th>Key (unique)</th><th>Value</th></tr></thead>
<tbody>
<tr><td>The web</td><td>URL</td><td>page content</td></tr>
<tr><td>A dictionary</td><td>word</td><td>meaning</td></tr>
<tr><td>Student records</td><td>student ID</td><td>name, GPA, …</td></tr>
<tr><td>Word counter (slide 33)</td><td>word</td><td>number of occurrences</td></tr>
</tbody>
</table>
<p>A hash table is the usual way to implement a map: the key goes into the hash function, the whole entry goes into the cell — slides 32–37.</p>
<div class="pitfall">Map ≠ hash table: the map is the ADT (what it does), the hash table one implementation (how). <code>TreeMap</code> implements the same Map ADT with a red-black tree — keys kept sorted, O(log n) per operation.</div>`,
        `<p class="y-chinh">🎯 Map (ánh xạ) là một kiểu dữ liệu trừu tượng (ADT) lưu các cặp khoá–giá trị (k, v), gọi là các mục (entry), và lấy giá trị ra theo khoá định danh duy nhất của nó; vì khoá không trùng nhau, việc gắn khoá với giá trị tạo thành một phép ánh xạ.</p>
<ul>
<li><strong>Mục (entry)</strong> = (khoá, giá trị): khoá để nhận diện, giá trị là dữ liệu.</li>
<li><strong>Khoá không trùng</strong>: cất giá trị thứ hai dưới một khoá đã có sẽ thay giá trị cũ — một khoá, một giá trị.</li>
<li><strong>Ẩn dụ tủ hồ sơ (file cabinet)</strong> trong hình của slide: hãy coi khoá là nhãn dán trên bìa hồ sơ, giá trị là thứ nằm bên trong; map chính là cái tủ.</li>
<li><strong>Web như một map</strong>: khoá của một trang là URL của nó (ví dụ http://datastructures.net/), giá trị là nội dung trang.</li>
</ul>
<table>
<thead><tr><th>Map</th><th>Khoá (không trùng)</th><th>Giá trị</th></tr></thead>
<tbody>
<tr><td>Web</td><td>URL</td><td>nội dung trang</td></tr>
<tr><td>Từ điển</td><td>từ</td><td>nghĩa</td></tr>
<tr><td>Hồ sơ sinh viên</td><td>mã sinh viên</td><td>tên, điểm GPA, …</td></tr>
<tr><td>Bộ đếm từ (slide 33)</td><td>từ</td><td>số lần xuất hiện</td></tr>
</tbody>
</table>
<p>Bảng băm (hash table) là cách thông dụng để cài đặt map: khoá đi vào hàm băm, cả mục được cất vào ô — slide 32–37.</p>
<div class="pitfall">Map ≠ bảng băm: map là ADT (làm gì), bảng băm là một cách cài đặt (làm thế nào). <code>TreeMap</code> cài đặt cùng ADT Map đó bằng cây đỏ-đen (red-black tree) — khoá luôn được sắp xếp, mỗi thao tác O(log n).</div>`],
      [31, 'Maps - 2',
        `<p class="y-chinh">🎯 A map models a searchable collection of key-value entries: its main operations are searching, inserting and deleting by key, multiple entries with the same key are not allowed, and address books or student-record databases are typical applications.</p>
<ul>
<li><strong>Search</strong> by key → the value, or "no such key".</li>
<li><strong>Insert</strong> an entry; if the key is already there, its entry is replaced — never duplicated.</li>
<li><strong>Delete</strong> by key.</li>
</ul>
<pre><code class="language-java">import java.util.HashMap;

class Student {
    String name;
    double gpa;

    Student(String name, double gpa) { this.name = name; this.gpa = gpa; }
    public String toString() { return name + " (" + gpa + ")"; }
}

public class StudentRecords {
    public static void main(String[] args) {
        HashMap&lt;String, Student&gt; db = new HashMap&lt;String, Student&gt;();   // key = student ID, value = the record
        db.put("SE170001", new Student("An", 3.2));                    // insert
        db.put("SE170002", new Student("Binh", 2.8));
        db.put("SE170003", new Student("Chi", 3.6));
        System.out.println("search SE170002 -&gt; " + db.get("SE170002"));     // search by key
        System.out.println("search SE179999 -&gt; " + db.get("SE179999"));
        db.put("SE170002", new Student("Binh", 3.0));                  // same key: the old entry is replaced
        System.out.println("after a second put for SE170002: " + db.get("SE170002") + ", size = " + db.size());
        db.remove("SE170001");                                         // delete
        System.out.println("after remove SE170001: containsKey = " + db.containsKey("SE170001") + ", size = " + db.size());
    }
}</code></pre>
<div class="out">search SE170002 -&gt; Binh (2.8)<br>
search SE179999 -&gt; null<br>
after a second put for SE170002: Binh (3.0), size = 3<br>
after remove SE170001: containsKey = false, size = 2</div>
<p>The student-record database of the slide in a few lines: a <code>HashMap&lt;String, Student&gt;</code> with the student ID as the key. The second <code>put</code> for SE170002 replaced Binh's record, and the size stayed 3.</p>
<p><strong>Big-O:</strong> with a hash table behind it, each of the three operations is O(1) on average — whether the database holds 3 students or 30,000.</p>
<p class="meo">🧠 <strong>Remember:</strong> the key must be unique and stable — an ID — never a field that can repeat or change, such as a name or a GPA.</p>`,
        `<p class="y-chinh">🎯 Map (ánh xạ) mô hình hoá một tập hợp tìm kiếm được gồm các mục (entry) khoá–giá trị: thao tác chính là tìm, chèn, xoá theo khoá, không cho phép hai mục trùng khoá, và sổ địa chỉ hay cơ sở dữ liệu hồ sơ sinh viên là các ứng dụng điển hình.</p>
<ul>
<li><strong>Tìm (search)</strong> theo khoá → giá trị, hoặc "không có khoá này".</li>
<li><strong>Chèn (insert)</strong> một mục; nếu khoá đã có thì mục đó bị thay — không bao giờ nhân đôi.</li>
<li><strong>Xoá (delete)</strong> theo khoá.</li>
</ul>
<pre><code class="language-java">import java.util.HashMap;

class Student {
    String name;
    double gpa;

    Student(String name, double gpa) { this.name = name; this.gpa = gpa; }
    public String toString() { return name + " (" + gpa + ")"; }
}

public class StudentRecords {
    public static void main(String[] args) {
        HashMap&lt;String, Student&gt; db = new HashMap&lt;String, Student&gt;();   // khoá = mã SV, giá trị = hồ sơ
        db.put("SE170001", new Student("An", 3.2));                    // thêm
        db.put("SE170002", new Student("Binh", 2.8));
        db.put("SE170003", new Student("Chi", 3.6));
        System.out.println("search SE170002 -&gt; " + db.get("SE170002"));     // tìm theo khoá
        System.out.println("search SE179999 -&gt; " + db.get("SE179999"));
        db.put("SE170002", new Student("Binh", 3.0));                  // trùng khoá: mục cũ bị thay
        System.out.println("after a second put for SE170002: " + db.get("SE170002") + ", size = " + db.size());
        db.remove("SE170001");                                         // xoá
        System.out.println("after remove SE170001: containsKey = " + db.containsKey("SE170001") + ", size = " + db.size());
    }
}</code></pre>
<div class="out">search SE170002 -&gt; Binh (2.8)<br>
search SE179999 -&gt; null<br>
after a second put for SE170002: Binh (3.0), size = 3<br>
after remove SE170001: containsKey = false, size = 2</div>
<p>Cơ sở dữ liệu hồ sơ sinh viên của slide trong vài dòng: một <code>HashMap&lt;String, Student&gt;</code> lấy mã sinh viên làm khoá. Lệnh <code>put</code> thứ hai cho SE170002 đã thay hồ sơ của Binh, và kích thước vẫn là 3.</p>
<p><strong>Big-O:</strong> có bảng băm (hash table) phía sau, mỗi thao tác trong ba thao tác đều O(1) trung bình — dù cơ sở dữ liệu có 3 hay 30.000 sinh viên.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoá phải duy nhất và ổn định — một mã số — đừng bao giờ dùng trường có thể trùng hoặc thay đổi, như tên hay điểm GPA.</p>`],
      [32, 'The methods of Map ADT',
        `<p class="y-chinh">🎯 The Map ADT has get, put, remove, size, isEmpty, keys and values; the ones to know by heart are get, put and remove — and what each returns when the key is present or absent.</p>
<table>
<thead><tr><th>Method</th><th>Key k present</th><th>Key k absent</th></tr></thead>
<tbody>
<tr><td><code>get(k)</code></td><td>returns its associated value</td><td>returns <code>null</code></td></tr>
<tr><td><code>put(k, v)</code></td><td>replaces the value, returns the <strong>old</strong> value</td><td>inserts (k, v), returns <code>null</code></td></tr>
<tr><td><code>remove(k)</code></td><td>removes the entry, returns its value</td><td>returns <code>null</code></td></tr>
<tr><td><code>size()</code>, <code>isEmpty()</code></td><td>number of entries, and whether it is 0</td><td>same</td></tr>
<tr><td><code>keys()</code>, <code>values()</code></td><td>an iterator over the keys / over the values</td><td>same</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayList;

class Entry {
    String key;
    Integer value;
    Entry next;

    Entry(String k, Integer v, Entry n) { key = k; value = v; next = n; }
}

class ChainHashMap {                                     // the Map ADT of the slide, built on separate chaining
    Entry[] table = new Entry[7];
    int n = 0;

    int index(String k) { return Math.floorMod(k.hashCode(), table.length); }

    Integer get(String k) {
        for (Entry e = table[index(k)]; e != null; e = e.next) if (e.key.equals(k)) return e.value;
        return null;                                     // no entry with key k
    }

    Integer put(String k, Integer v) {
        int i = index(k);
        for (Entry e = table[i]; e != null; e = e.next)
            if (e.key.equals(k)) { Integer old = e.value; e.value = v; return old; }   // replace, return the old value
        table[i] = new Entry(k, v, table[i]);
        n++;
        return null;                                     // k was new
    }

    Integer remove(String k) {
        int i = index(k);
        for (Entry e = table[i], prev = null; e != null; prev = e, e = e.next)
            if (e.key.equals(k)) {
                if (prev == null) table[i] = e.next; else prev.next = e.next;
                n--;
                return e.value;
            }
        return null;
    }

    int size() { return n; }
    boolean isEmpty() { return n == 0; }

    ArrayList&lt;String&gt; keys() {
        ArrayList&lt;String&gt; r = new ArrayList&lt;String&gt;();
        for (Entry head : table) for (Entry e = head; e != null; e = e.next) r.add(e.key);
        return r;
    }

    ArrayList&lt;Integer&gt; values() {
        ArrayList&lt;Integer&gt; r = new ArrayList&lt;Integer&gt;();
        for (Entry head : table) for (Entry e = head; e != null; e = e.next) r.add(e.value);
        return r;
    }
}

public class SimpleMap {
    public static void main(String[] args) {
        ChainHashMap m = new ChainHashMap();
        System.out.println("put(An, 8)   returns " + m.put("An", 8));
        System.out.println("put(Binh, 7) returns " + m.put("Binh", 7));
        System.out.println("put(An, 9)   returns " + m.put("An", 9) + "   &lt;- the old value");
        System.out.println("get(An) = " + m.get("An") + ", get(Chi) = " + m.get("Chi"));
        System.out.println("remove(Binh) returns " + m.remove("Binh") + ", remove(Chi) returns " + m.remove("Chi"));
        System.out.println("size() = " + m.size() + ", isEmpty() = " + m.isEmpty() + ", keys() = " + m.keys() + ", values() = " + m.values());
    }
}</code></pre>
<div class="out">put(An, 8) &nbsp;&nbsp;returns null<br>
put(Binh, 7) returns null<br>
put(An, 9) &nbsp;&nbsp;returns 8 &nbsp;&nbsp;&lt;- the old value<br>
get(An) = 9, get(Chi) = null<br>
remove(Binh) returns 7, remove(Chi) returns null<br>
size() = 1, isEmpty() = false, keys() = [An], values() = [9]</div>
<p>The program implements the ADT itself with separate chaining (slide 21): 7 chains; <code>put</code> first searches the chain of k and adds a node only if k is new. <code>java.util.Map</code> has the same methods, with <code>keySet()</code> and <code>values()</code> returning collections you can iterate over.</p>
<ul>
<li><code>put(An, 9)</code> returned 8, the old value, and added no node — <code>size()</code> counts An only once.</li>
<li><code>get(Chi)</code> and <code>remove(Chi)</code> return <code>null</code>: in the Map ADT an absent key is an ordinary answer, not an error.</li>
</ul>
<p><strong>Big-O:</strong> get, put and remove walk one chain — O(1 + α) on average; size and isEmpty read a counter, O(1); keys and values visit every entry and every chain, O(n + M).</p>
<p class="meo">🧠 <strong>Remember:</strong> <code>put</code> = "insert or replace", and its return value says which one happened: <code>null</code> → the key was new; anything else → the key existed, and this is the value it had before.</p>
<div class="pitfall"><code>put</code> on an existing key must <em>not</em> increase the size. Forgetting to search the chain first gives a map that stores the same key twice and reports a wrong <code>size()</code> — a classic PE mistake.</div>`,
        `<p class="y-chinh">🎯 ADT Map (kiểu dữ liệu trừu tượng ánh xạ khoá → giá trị) có get, put, remove, size, isEmpty, keys và values; ba phương thức phải thuộc lòng là get, put, remove — cùng giá trị mỗi hàm trả về khi khoá có mặt hay vắng mặt.</p>
<table>
<thead><tr><th>Phương thức</th><th>Khoá k có mặt</th><th>Khoá k vắng mặt</th></tr></thead>
<tbody>
<tr><td><code>get(k)</code></td><td>trả giá trị gắn với k</td><td>trả <code>null</code></td></tr>
<tr><td><code>put(k, v)</code></td><td>thay giá trị, trả về giá trị <strong>cũ</strong></td><td>chèn (k, v), trả <code>null</code></td></tr>
<tr><td><code>remove(k)</code></td><td>xoá mục đó, trả giá trị của nó</td><td>trả <code>null</code></td></tr>
<tr><td><code>size()</code>, <code>isEmpty()</code></td><td>số mục, và có bằng 0 không</td><td>như bên trái</td></tr>
<tr><td><code>keys()</code>, <code>values()</code></td><td>bộ duyệt (iterator) qua các khoá / các giá trị</td><td>như bên trái</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.ArrayList;

class Entry {
    String key;
    Integer value;
    Entry next;

    Entry(String k, Integer v, Entry n) { key = k; value = v; next = n; }
}

class ChainHashMap {                                     // ADT Map của slide, dựng bằng dây chuyền
    Entry[] table = new Entry[7];
    int n = 0;

    int index(String k) { return Math.floorMod(k.hashCode(), table.length); }

    Integer get(String k) {
        for (Entry e = table[index(k)]; e != null; e = e.next) if (e.key.equals(k)) return e.value;
        return null;                                     // không có mục nào có khoá k
    }

    Integer put(String k, Integer v) {
        int i = index(k);
        for (Entry e = table[i]; e != null; e = e.next)
            if (e.key.equals(k)) { Integer old = e.value; e.value = v; return old; }   // thay, trả giá trị cũ
        table[i] = new Entry(k, v, table[i]);
        n++;
        return null;                                     // k là khoá mới
    }

    Integer remove(String k) {
        int i = index(k);
        for (Entry e = table[i], prev = null; e != null; prev = e, e = e.next)
            if (e.key.equals(k)) {
                if (prev == null) table[i] = e.next; else prev.next = e.next;
                n--;
                return e.value;
            }
        return null;
    }

    int size() { return n; }
    boolean isEmpty() { return n == 0; }

    ArrayList&lt;String&gt; keys() {
        ArrayList&lt;String&gt; r = new ArrayList&lt;String&gt;();
        for (Entry head : table) for (Entry e = head; e != null; e = e.next) r.add(e.key);
        return r;
    }

    ArrayList&lt;Integer&gt; values() {
        ArrayList&lt;Integer&gt; r = new ArrayList&lt;Integer&gt;();
        for (Entry head : table) for (Entry e = head; e != null; e = e.next) r.add(e.value);
        return r;
    }
}

public class SimpleMap {
    public static void main(String[] args) {
        ChainHashMap m = new ChainHashMap();
        System.out.println("put(An, 8)   returns " + m.put("An", 8));
        System.out.println("put(Binh, 7) returns " + m.put("Binh", 7));
        System.out.println("put(An, 9)   returns " + m.put("An", 9) + "   &lt;- the old value");
        System.out.println("get(An) = " + m.get("An") + ", get(Chi) = " + m.get("Chi"));
        System.out.println("remove(Binh) returns " + m.remove("Binh") + ", remove(Chi) returns " + m.remove("Chi"));
        System.out.println("size() = " + m.size() + ", isEmpty() = " + m.isEmpty() + ", keys() = " + m.keys() + ", values() = " + m.values());
    }
}</code></pre>
<div class="out">put(An, 8) &nbsp;&nbsp;returns null<br>
put(Binh, 7) returns null<br>
put(An, 9) &nbsp;&nbsp;returns 8 &nbsp;&nbsp;&lt;- the old value<br>
get(An) = 9, get(Chi) = null<br>
remove(Binh) returns 7, remove(Chi) returns null<br>
size() = 1, isEmpty() = false, keys() = [An], values() = [9]</div>
<p>Chương trình tự cài đặt ADT bằng dây chuyền tách biệt (separate chaining, slide 21): 7 dây; <code>put</code> tìm trong dây của k trước và chỉ thêm nút khi k là khoá mới. <code>java.util.Map</code> có đúng các phương thức này, với <code>keySet()</code> và <code>values()</code> trả về các tập hợp duyệt được.</p>
<ul>
<li><code>put(An, 9)</code> trả về 8, giá trị cũ, và không thêm nút nào — <code>size()</code> chỉ đếm An một lần.</li>
<li><code>get(Chi)</code> và <code>remove(Chi)</code> trả <code>null</code>: trong ADT Map, khoá không có là một câu trả lời bình thường, không phải lỗi.</li>
</ul>
<p><strong>Big-O:</strong> get, put, remove đi dọc một dây — O(1 + α) trung bình (α là hệ số tải — load factor); size và isEmpty đọc một biến đếm, O(1); keys và values đi qua mọi mục và mọi dây, O(n + M).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <code>put</code> = "chèn hoặc thay", và giá trị trả về cho biết việc nào đã xảy ra: <code>null</code> → khoá mới; khác null → khoá đã có, và đó là giá trị cũ của nó.</p>
<div class="pitfall"><code>put</code> với khoá đã có <em>không</em> được tăng kích thước. Quên tìm trong dây trước sẽ tạo ra một map chứa cùng một khoá hai lần và <code>size()</code> báo sai — lỗi PE kinh điển.</div>`],
      [33, 'Map application example - Counting Word Frequencies',
        `<p class="y-chinh">🎯 Counting the occurrences of each word in a document is the textbook case study for a map: words are the keys, word counts are the values.</p>
<ol>
<li>Split the text into words — lower-case, letters only.</li>
<li>For each word w: <code>c = freq.get(w)</code>, then <code>put(w, c == null ? 1 : c + 1)</code>.</li>
<li>Scan the entries once to find the largest count.</li>
</ol>
<pre><code class="language-java">import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class WordCount {
    public static void main(String[] args) {
        String text = "The cat and the hat. And the bat? THE END";
        Map&lt;String, Integer&gt; freq = new HashMap&lt;String, Integer&gt;();     // word -&gt; count
        for (String w : text.toLowerCase().split("[^a-z]+")) {          // words = runs of letters
            if (w.isEmpty()) continue;
            Integer c = freq.get(w);                                     // null when the word is new
            freq.put(w, c == null ? 1 : c + 1);
        }
        String best = null;
        int max = 0;
        for (Map.Entry&lt;String, Integer&gt; e : freq.entrySet())            // find the most frequent word
            if (e.getValue() &gt; max) { max = e.getValue(); best = e.getKey(); }
        System.out.println("counts (printed in sorted order): " + new TreeMap&lt;String, Integer&gt;(freq));
        System.out.println("most frequent word: " + best + " (" + max + " times), " + freq.size() + " distinct words");
    }
}</code></pre>
<div class="out">counts (printed in sorted order): {and=2, bat=1, cat=1, end=1, hat=1, the=4}<br>
most frequent word: the (4 times), 6 distinct words</div>
<p>This is a standard step in the statistical analysis of a document — the slide mentions categorizing an email or a news article. "The", "the" and "THE" count as one word because the text is lower-cased first.</p>
<p><strong>Big-O:</strong> n words → n <code>get</code> + n <code>put</code>, each O(1) on average → O(n) in total. With a plain list of (word, count) pairs each word would need an O(n) search — O(n²) overall.</p>
<div class="pitfall"><code>freq.put(w, freq.get(w) + 1)</code> throws <code>NullPointerException</code> on the first occurrence of a word: <code>get</code> returns <code>null</code>, and <code>null</code> cannot be unboxed to <code>int</code>. Test for <code>null</code>, or write <code>freq.getOrDefault(w, 0) + 1</code> (Java 8).</div>`,
        `<p class="y-chinh">🎯 Đếm số lần xuất hiện của từng từ trong một văn bản là tình huống kinh điển để dùng map (ánh xạ): từ là khoá, số lần đếm là giá trị.</p>
<ol>
<li>Tách văn bản thành các từ — chữ thường, chỉ giữ chữ cái.</li>
<li>Với mỗi từ w: <code>c = freq.get(w)</code>, rồi <code>put(w, c == null ? 1 : c + 1)</code>.</li>
<li>Duyệt các mục một lượt để tìm số đếm lớn nhất.</li>
</ol>
<pre><code class="language-java">import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class WordCount {
    public static void main(String[] args) {
        String text = "The cat and the hat. And the bat? THE END";
        Map&lt;String, Integer&gt; freq = new HashMap&lt;String, Integer&gt;();     // từ -&gt; số lần
        for (String w : text.toLowerCase().split("[^a-z]+")) {          // từ = dãy chữ cái liền nhau
            if (w.isEmpty()) continue;
            Integer c = freq.get(w);                                     // null khi từ mới gặp lần đầu
            freq.put(w, c == null ? 1 : c + 1);
        }
        String best = null;
        int max = 0;
        for (Map.Entry&lt;String, Integer&gt; e : freq.entrySet())            // tìm từ xuất hiện nhiều nhất
            if (e.getValue() &gt; max) { max = e.getValue(); best = e.getKey(); }
        System.out.println("counts (printed in sorted order): " + new TreeMap&lt;String, Integer&gt;(freq));
        System.out.println("most frequent word: " + best + " (" + max + " times), " + freq.size() + " distinct words");
    }
}</code></pre>
<div class="out">counts (printed in sorted order): {and=2, bat=1, cat=1, end=1, hat=1, the=4}<br>
most frequent word: the (4 times), 6 distinct words</div>
<p>Đây là một bước chuẩn trong phân tích thống kê văn bản — slide nhắc tới việc phân loại một email hay một bài báo. "The", "the" và "THE" được tính là một từ vì văn bản đã được đổi sang chữ thường trước.</p>
<p><strong>Big-O:</strong> n từ → n lần <code>get</code> + n lần <code>put</code>, mỗi lần O(1) trung bình → tổng O(n). Nếu dùng một danh sách thường các cặp (từ, số đếm), mỗi từ phải tìm tuần tự O(n) — tổng cộng O(n²).</p>
<div class="pitfall"><code>freq.put(w, freq.get(w) + 1)</code> văng <code>NullPointerException</code> ngay lần đầu gặp một từ: <code>get</code> trả <code>null</code>, mà <code>null</code> thì không mở hộp (unbox) thành <code>int</code> được. Hãy kiểm tra <code>null</code>, hoặc viết <code>freq.getOrDefault(w, 0) + 1</code> (Java 8).</div>`],
      [34, 'Hashing in java.util - HashSet and HashMap classes',
        `<p class="y-chinh">🎯 java.util provides two hash-based classes: HashSet stores objects and HashMap stores (key, object) pairs; put, get and remove run in expected O(1) time, and collisions are resolved by chaining.</p>
<ul>
<li><strong>HashSet</strong>: adding and removing in constant time; no duplicates. (Internally it is a HashMap whose keys are the elements.)</li>
<li><strong>HashMap</strong>: an implementation of Map — more useful and more standard; main methods <code>put(key, value)</code>, <code>get(key)</code>, <code>remove(key)</code>. Roughly equivalent to <code>Hashtable</code>, except that it is unsynchronized and permits nulls (slide 36).</li>
<li><strong>Two performance parameters</strong>: initial capacity = number of buckets (default 16); load factor = how full the table may get before its capacity is increased (default 0.75). When the size exceeds capacity × load factor, the table is rehashed into about twice as many buckets.</li>
<li><strong>Chaining</strong>: a hash map is a collection of singly linked lists (buckets). Since Java 8 a bucket that already holds 8 entries and gets another is turned into a red-black tree (if the table has at least 64 buckets), so its worst case becomes O(log n).</li>
</ul>
<pre><code class="language-java">import java.util.HashMap;
import java.util.HashSet;

public class JavaHashing {
    public static void main(String[] args) {
        HashSet&lt;String&gt; set = new HashSet&lt;String&gt;();                    // stores objects, no duplicates
        System.out.println("set.add(red) = " + set.add("red") + ", add(red) again = " + set.add("red") + ", remove(red) = " + set.remove("red"));
        HashMap&lt;String, Integer&gt; map = new HashMap&lt;String, Integer&gt;(16, 0.75f);   // initial capacity, load factor
        System.out.println("\\"Aa\\".hashCode() = " + "Aa".hashCode() + ", \\"BB\\".hashCode() = " + "BB".hashCode() + "  &lt;- same bucket");
        map.put("Aa", 1);
        map.put("BB", 2);                                               // chained in the same bucket as "Aa"
        System.out.println("get(Aa) = " + map.get("Aa") + ", get(BB) = " + map.get("BB") + "  &lt;- both still found");
        System.out.println("put(Aa, 10) returns " + map.put("Aa", 10) + ", remove(BB) returns " + map.remove("BB") + ", size = " + map.size());
        System.out.println("resize rule: more than 16 * 0.75 = " + (int) (16 * 0.75f) + " entries -&gt; 32 buckets");
    }
}</code></pre>
<div class="out">set.add(red) = true, add(red) again = false, remove(red) = true<br>
"Aa".hashCode() = 2112, "BB".hashCode() = 2112 &nbsp;&lt;- same bucket<br>
get(Aa) = 1, get(BB) = 2 &nbsp;&lt;- both still found<br>
put(Aa, 10) returns 1, remove(BB) returns 2, size = 1<br>
resize rule: more than 16 * 0.75 = 12 entries -&gt; 32 buckets</div>
<p>"Aa" and "BB" have the same hash code, 2112, so they fall into the same bucket; the chain keeps both, and <code>get</code> still returns the right value for each key.</p>
<div class="pitfall">When your own objects are keys of a HashMap or elements of a HashSet, override <strong>both</strong> <code>equals</code> and <code>hashCode</code>, from the same fields; otherwise two "equal" objects get different hash codes, HashMap treats them as different keys (it compares the codes before calling <code>equals</code>), and the set keeps duplicates (lesson 7.2, exercise 4 in lesson 7.5).</div>`,
        `<p class="y-chinh">🎯 java.util có hai lớp dựa trên băm: HashSet lưu các đối tượng, HashMap lưu các cặp (khoá, đối tượng); put, get, remove chạy trong thời gian kỳ vọng O(1), và va chạm được giải quyết bằng dây chuyền (chaining).</p>
<ul>
<li><strong>HashSet</strong> (tập băm): thêm và xoá trong thời gian hằng số; không chứa phần tử trùng. (Bên trong nó là một HashMap lấy các phần tử làm khoá.)</li>
<li><strong>HashMap</strong>: một cài đặt của Map (giao diện ánh xạ khoá → giá trị) — hữu ích và chuẩn mực hơn; các phương thức chính <code>put(key, value)</code>, <code>get(key)</code>, <code>remove(key)</code>. Gần tương đương <code>Hashtable</code>, chỉ khác là không đồng bộ hoá (unsynchronized) và cho phép null (slide 36).</li>
<li><strong>Hai tham số hiệu năng</strong>: sức chứa ban đầu (initial capacity) = số bucket — số ngăn chứa của bảng (mặc định 16); hệ số tải (load factor) = bảng được đầy tới mức nào trước khi tự tăng sức chứa (mặc định 0,75). Khi số phần tử vượt sức chứa × hệ số tải, bảng được băm lại (rehash) sang khoảng gấp đôi số bucket.</li>
<li><strong>Dây chuyền</strong>: một bảng ánh xạ băm (hash map) là tập các danh sách liên kết đơn (mỗi danh sách là một bucket). Từ Java 8, bucket nào đã có 8 phần tử mà còn nhận thêm sẽ được chuyển thành cây đỏ-đen (red-black tree) (nếu bảng có ít nhất 64 bucket), nên trường hợp xấu nhất chỉ còn O(log n).</li>
</ul>
<pre><code class="language-java">import java.util.HashMap;
import java.util.HashSet;

public class JavaHashing {
    public static void main(String[] args) {
        HashSet&lt;String&gt; set = new HashSet&lt;String&gt;();                    // lưu đối tượng, không trùng
        System.out.println("set.add(red) = " + set.add("red") + ", add(red) again = " + set.add("red") + ", remove(red) = " + set.remove("red"));
        HashMap&lt;String, Integer&gt; map = new HashMap&lt;String, Integer&gt;(16, 0.75f);   // sức chứa ban đầu, hệ số tải
        System.out.println("\\"Aa\\".hashCode() = " + "Aa".hashCode() + ", \\"BB\\".hashCode() = " + "BB".hashCode() + "  &lt;- same bucket");
        map.put("Aa", 1);
        map.put("BB", 2);                                               // nối dây vào cùng bucket với "Aa"
        System.out.println("get(Aa) = " + map.get("Aa") + ", get(BB) = " + map.get("BB") + "  &lt;- both still found");
        System.out.println("put(Aa, 10) returns " + map.put("Aa", 10) + ", remove(BB) returns " + map.remove("BB") + ", size = " + map.size());
        System.out.println("resize rule: more than 16 * 0.75 = " + (int) (16 * 0.75f) + " entries -&gt; 32 buckets");
    }
}</code></pre>
<div class="out">set.add(red) = true, add(red) again = false, remove(red) = true<br>
"Aa".hashCode() = 2112, "BB".hashCode() = 2112 &nbsp;&lt;- same bucket<br>
get(Aa) = 1, get(BB) = 2 &nbsp;&lt;- both still found<br>
put(Aa, 10) returns 1, remove(BB) returns 2, size = 1<br>
resize rule: more than 16 * 0.75 = 12 entries -&gt; 32 buckets</div>
<p>"Aa" và "BB" có cùng mã băm (hash code) 2112, nên rơi vào cùng một bucket; dây giữ cả hai, và <code>get</code> vẫn trả đúng giá trị cho từng khoá.</p>
<div class="pitfall">Khi đối tượng do bạn tự viết làm khoá của HashMap hoặc phần tử của HashSet, phải ghi đè (override) <strong>cả</strong> <code>equals</code> lẫn <code>hashCode</code>, dựa trên cùng các trường; nếu không, hai đối tượng "bằng nhau" có hai mã băm khác nhau, HashMap coi chúng là hai khoá khác nhau (nó so mã băm trước khi gọi <code>equals</code>), và tập hợp giữ cả hai bản trùng (bài 7.2, bài tập 4 ở bài 7.5).</div>`],
      [35, 'HashSet example',
        `<p class="y-chinh">🎯 The slide's program adds six words to a HashSet: <code>add</code> returns false for a word that is already in the set, so each duplicate is detected, and the set ends up with the distinct words only.</p>
<p>Below is the slide's code unchanged except for two things: the class <code>Main</code> is renamed <code>HashSetExample</code> (every example here needs its own class name), and two lines are added at the end for comparison.</p>
<pre><code class="language-java">import java.util.*;

public class HashSetExample                  // on the slide this class is called Main
{ public static void main(String args[])
  { Set s = new HashSet();
    String [] a = {"i", "came", "i", "came", "i", "conquered"};
    for(int i=0; i&lt;a.length;i++)
    { if(!s.add(a[i]))
        System.out.println("Duplicate detected : " + a[i]);
    }
    System.out.println(s.size() + " distinct words detected : " + s );
    // --- the same words in two other sets
    System.out.println("LinkedHashSet (insertion order): " + new LinkedHashSet&lt;String&gt;(Arrays.asList(a)));
    System.out.println("TreeSet (sorted):                " + new TreeSet&lt;String&gt;(Arrays.asList(a)));
  }
}</code></pre>
<div class="out">Duplicate detected : i<br>
Duplicate detected : came<br>
Duplicate detected : i<br>
3 distinct words detected : [came, conquered, i]<br>
LinkedHashSet (insertion order): [i, came, conquered]<br>
TreeSet (sorted): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[came, conquered, i]</div>
<ul>
<li><code>s.add(a[i])</code> returns <code>true</code> if the word is new and <code>false</code> if it is already there — so "i" is reported twice and "came" once.</li>
<li>3 distinct words, printed as <code>[came, conquered, i]</code>: a HashSet iterates in the order of its buckets — neither insertion order (that is <code>LinkedHashSet</code>) nor sorted order (that is <code>TreeSet</code>).</li>
<li>The slide uses the raw type <code>Set</code>, which compiles only with an "unchecked" warning. Write <code>Set&lt;String&gt; s = new HashSet&lt;String&gt;();</code>.</li>
</ul>
<p><strong>Big-O:</strong> n calls to <code>add</code>, each O(1) on average → finding all duplicates in O(n), instead of O(n²) with two nested loops.</p>
<div class="pitfall">Never rely on the printing order of a HashSet or HashMap in an exam answer: it depends on the hash codes and the capacity, and it may change when the table grows. Need an order? <code>LinkedHashSet</code> (insertion) or <code>TreeSet</code> (sorted).</div>`,
        `<p class="y-chinh">🎯 Chương trình trên slide thêm sáu từ vào một HashSet: <code>add</code> trả false khi từ đã có trong tập, nhờ vậy phát hiện được từng từ trùng, và cuối cùng tập chỉ giữ các từ phân biệt.</p>
<p>Dưới đây là code của slide, giữ nguyên trừ hai điểm: lớp <code>Main</code> được đổi tên thành <code>HashSetExample</code> (mỗi ví dụ ở đây cần một tên lớp riêng), và thêm hai dòng ở cuối để so sánh.</p>
<pre><code class="language-java">import java.util.*;

public class HashSetExample                  // trên slide lớp này tên là Main
{ public static void main(String args[])
  { Set s = new HashSet();
    String [] a = {"i", "came", "i", "came", "i", "conquered"};
    for(int i=0; i&lt;a.length;i++)
    { if(!s.add(a[i]))
        System.out.println("Duplicate detected : " + a[i]);
    }
    System.out.println(s.size() + " distinct words detected : " + s );
    // --- cùng các từ đó trong hai loại tập khác
    System.out.println("LinkedHashSet (insertion order): " + new LinkedHashSet&lt;String&gt;(Arrays.asList(a)));
    System.out.println("TreeSet (sorted):                " + new TreeSet&lt;String&gt;(Arrays.asList(a)));
  }
}</code></pre>
<div class="out">Duplicate detected : i<br>
Duplicate detected : came<br>
Duplicate detected : i<br>
3 distinct words detected : [came, conquered, i]<br>
LinkedHashSet (insertion order): [i, came, conquered]<br>
TreeSet (sorted): &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[came, conquered, i]</div>
<ul>
<li><code>s.add(a[i])</code> trả <code>true</code> nếu từ mới và <code>false</code> nếu đã có — nên "i" bị báo trùng hai lần, "came" một lần.</li>
<li>3 từ phân biệt, in ra là <code>[came, conquered, i]</code>: HashSet duyệt theo thứ tự các bucket (ngăn chứa) của nó — không theo thứ tự chèn (đó là <code>LinkedHashSet</code>), cũng không theo thứ tự sắp xếp (đó là <code>TreeSet</code>).</li>
<li>Slide dùng kiểu thô (raw type) <code>Set</code>, chỉ biên dịch được kèm cảnh báo "unchecked". Hãy viết <code>Set&lt;String&gt; s = new HashSet&lt;String&gt;();</code>.</li>
</ul>
<p><strong>Big-O:</strong> n lần gọi <code>add</code>, mỗi lần O(1) trung bình → tìm mọi phần tử trùng trong O(n), thay vì O(n²) với hai vòng lặp lồng nhau.</p>
<div class="pitfall">Đừng bao giờ dựa vào thứ tự in của HashSet hay HashMap khi làm bài thi: nó phụ thuộc mã băm và sức chứa, và có thể đổi khi bảng nới rộng. Cần thứ tự? Dùng <code>LinkedHashSet</code> (thứ tự chèn) hoặc <code>TreeSet</code> (đã sắp xếp).</div>`],
      [36, 'HashMap class',
        `<p class="y-chinh">🎯 HashMap is the hash-table-based implementation of the Map interface: it provides all the optional map operations, permits null values and the null key, and — unlike Hashtable — is unsynchronized.</p>
<pre><code class="language-java">import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class NullKeys {
    public static void main(String[] args) {
        Map&lt;String, String&gt; hm = new HashMap&lt;String, String&gt;();
        hm.put(null, "value of the null key");         // HashMap: one null key is allowed
        hm.put("x", null);                              // ... and null values
        System.out.println("HashMap get(null) = " + hm.get(null));
        System.out.println("HashMap get(\\"x\\") = " + hm.get("x") + ", get(\\"y\\") = " + hm.get("y") + "  &lt;- same answer!");
        System.out.println("containsKey(\\"x\\") = " + hm.containsKey("x") + ", containsKey(\\"y\\") = " + hm.containsKey("y"));
        Map&lt;String, String&gt; ht = new Hashtable&lt;String, String&gt;();
        try { ht.put(null, "v"); } catch (NullPointerException e) { System.out.println("Hashtable.put(null, v) -&gt; NullPointerException"); }
        try { ht.put("x", null); } catch (NullPointerException e) { System.out.println("Hashtable.put(x, null) -&gt; NullPointerException"); }
    }
}</code></pre>
<div class="out">HashMap get(null) = value of the null key<br>
HashMap get("x") = null, get("y") = null &nbsp;&lt;- same answer!<br>
containsKey("x") = true, containsKey("y") = false<br>
Hashtable.put(null, v) -&gt; NullPointerException<br>
Hashtable.put(x, null) -&gt; NullPointerException</div>
<table>
<thead><tr><th>Feature</th><th>HashMap</th><th>Hashtable</th></tr></thead>
<tbody>
<tr><td>null key / null values</td><td>allowed</td><td><code>NullPointerException</code></td></tr>
<tr><td>Synchronized (thread-safe)</td><td>no — faster in a single thread</td><td>yes — every method is synchronized</td></tr>
<tr><td>Default capacity / load factor</td><td>16 / 0.75</td><td>11 / 0.75</td></tr>
<tr><td>Today</td><td>the normal choice</td><td>legacy; for many threads prefer <code>ConcurrentHashMap</code></td></tr>
</tbody>
</table>
<ul>
<li><code>get(null)</code> works: HashMap gives the null key the hash 0 (bucket 0), and like any key it can appear only once.</li>
<li>"All the optional map operations" means <code>put</code>, <code>remove</code>, <code>putAll</code>, <code>clear</code>… are all supported — some Map implementations, such as unmodifiable maps, throw <code>UnsupportedOperationException</code> for them.</li>
<li>The two <code>Hashtable</code> lines show both kinds of null rejected with <code>NullPointerException</code>.</li>
</ul>
<p><strong>Unsynchronized</strong> means that if several threads modify the same HashMap at once, the result is undefined; a single-threaded program — every CSD201 exercise — does not pay any locking cost.</p>
<div class="pitfall">Because null values are allowed, <code>get(k) == null</code> has two meanings: "k maps to null" or "k is absent" — the output above shows both give <code>null</code>. Use <code>containsKey(k)</code> to tell them apart. And the class is spelled <code>Hashtable</code>: <code>HashTable</code>, as the slides write it, does not compile.</div>`,
        `<p class="y-chinh">🎯 HashMap là cài đặt giao diện (interface) Map dựa trên bảng băm: có đủ mọi thao tác tuỳ chọn của map, cho phép giá trị null và khoá null, và — khác Hashtable — không đồng bộ hoá (unsynchronized).</p>
<pre><code class="language-java">import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class NullKeys {
    public static void main(String[] args) {
        Map&lt;String, String&gt; hm = new HashMap&lt;String, String&gt;();
        hm.put(null, "value of the null key");         // HashMap: cho phép một khoá null
        hm.put("x", null);                              // ... và giá trị null
        System.out.println("HashMap get(null) = " + hm.get(null));
        System.out.println("HashMap get(\\"x\\") = " + hm.get("x") + ", get(\\"y\\") = " + hm.get("y") + "  &lt;- same answer!");
        System.out.println("containsKey(\\"x\\") = " + hm.containsKey("x") + ", containsKey(\\"y\\") = " + hm.containsKey("y"));
        Map&lt;String, String&gt; ht = new Hashtable&lt;String, String&gt;();
        try { ht.put(null, "v"); } catch (NullPointerException e) { System.out.println("Hashtable.put(null, v) -&gt; NullPointerException"); }
        try { ht.put("x", null); } catch (NullPointerException e) { System.out.println("Hashtable.put(x, null) -&gt; NullPointerException"); }
    }
}</code></pre>
<div class="out">HashMap get(null) = value of the null key<br>
HashMap get("x") = null, get("y") = null &nbsp;&lt;- same answer!<br>
containsKey("x") = true, containsKey("y") = false<br>
Hashtable.put(null, v) -&gt; NullPointerException<br>
Hashtable.put(x, null) -&gt; NullPointerException</div>
<table>
<thead><tr><th>Đặc điểm</th><th>HashMap</th><th>Hashtable</th></tr></thead>
<tbody>
<tr><td>khoá null / giá trị null</td><td>cho phép</td><td><code>NullPointerException</code></td></tr>
<tr><td>Đồng bộ hoá (an toàn đa luồng — thread-safe)</td><td>không — nhanh hơn khi chỉ có một luồng</td><td>có — mọi phương thức đều synchronized</td></tr>
<tr><td>Sức chứa / hệ số tải mặc định</td><td>16 / 0,75</td><td>11 / 0,75</td></tr>
<tr><td>Ngày nay</td><td>lựa chọn thông thường</td><td>lớp cũ (legacy); nhiều luồng thì dùng <code>ConcurrentHashMap</code></td></tr>
</tbody>
</table>
<ul>
<li><code>get(null)</code> chạy được: HashMap gán cho khoá null giá trị băm 0 (nên nó nằm ở bucket 0 — ngăn số 0 của bảng), và như mọi khoá khác, nó chỉ xuất hiện được một lần.</li>
<li>"Mọi thao tác tuỳ chọn của map" nghĩa là <code>put</code>, <code>remove</code>, <code>putAll</code>, <code>clear</code>… đều được hỗ trợ — có những cài đặt Map, như map không sửa được (unmodifiable map), sẽ ném <code>UnsupportedOperationException</code> với các lệnh đó.</li>
<li>Hai dòng của <code>Hashtable</code> cho thấy cả hai kiểu null đều bị từ chối bằng <code>NullPointerException</code>.</li>
</ul>
<p><strong>Không đồng bộ hoá</strong> nghĩa là nếu nhiều luồng (thread) cùng sửa một HashMap thì kết quả không xác định; chương trình một luồng — mọi bài tập CSD201 — thì không phải trả giá khoá (lock) nào.</p>
<div class="pitfall">Vì cho phép giá trị null, <code>get(k) == null</code> có hai nghĩa: "k gắn với null" hoặc "k không có" — kết quả in ra (output) ở trên cho thấy cả hai đều ra <code>null</code>. Dùng <code>containsKey(k)</code> để phân biệt. Và tên lớp viết là <code>Hashtable</code>: <code>HashTable</code> như slide viết sẽ không biên dịch được.</div>`],
      [37, 'HashMap class example',
        `<p class="y-chinh">🎯 The slide puts two entries ("One" → 1, "Two" → 2) into a HashMap and prints <code>hMap.get("One")</code> — the output is 1.</p>
<p>The slide's code, with only <code>Main</code> renamed to <code>HashMapExample</code>, followed by the same idea in today's Java:</p>
<pre><code class="language-java">import java.util.*;

public class HashMapExample                  // on the slide this class is called Main
{ public static void main(String args[])
  { HashMap hMap = new HashMap();
    hMap.put("One", new Integer(1));
    hMap.put("Two", new Integer(2));
    Object obj = hMap.get("One");
    System.out.println(obj);
    // --- today: generics + autoboxing, no cast, no new Integer
    HashMap&lt;String, Integer&gt; m = new HashMap&lt;String, Integer&gt;();
    m.put("One", 1);
    m.put("Two", 2);
    int one = m.get("One");                  // Integer -&gt; int, no cast needed
    System.out.println("one + 1 = " + (one + 1));
  }
}</code></pre>
<div class="out">1<br>
one + 1 = 2</div>
<ul>
<li>On a raw <code>HashMap</code>, <code>get</code> returns an <code>Object</code>; printing it calls its <code>toString()</code> → "1".</li>
<li><code>new Integer(1)</code> is deprecated since Java 9 (and marked for removal since Java 16); write <code>Integer.valueOf(1)</code> or just <code>1</code> — autoboxing does it for you.</li>
<li>With generics, <code>HashMap&lt;String, Integer&gt;</code>, <code>m.get("One")</code> is already an <code>Integer</code>: no cast is needed, and a value of the wrong type is a compile error instead of a crash at run time.</li>
</ul>
<div class="pitfall"><code>int three = m.get("Three");</code> compiles but throws <code>NullPointerException</code> at run time: the key is absent, <code>get</code> returns <code>null</code>, and <code>null</code> cannot be unboxed to <code>int</code>.</div>`,
        `<p class="y-chinh">🎯 Slide đưa hai mục ("One" → 1, "Two" → 2) vào một HashMap rồi in <code>hMap.get("One")</code> — kết quả là 1.</p>
<p>Code của slide, chỉ đổi tên <code>Main</code> thành <code>HashMapExample</code>, tiếp theo là cùng ý đó viết theo Java ngày nay:</p>
<pre><code class="language-java">import java.util.*;

public class HashMapExample                  // trên slide lớp này tên là Main
{ public static void main(String args[])
  { HashMap hMap = new HashMap();
    hMap.put("One", new Integer(1));
    hMap.put("Two", new Integer(2));
    Object obj = hMap.get("One");
    System.out.println(obj);
    // --- ngày nay: generic + tự đóng hộp, không ép kiểu, không new Integer
    HashMap&lt;String, Integer&gt; m = new HashMap&lt;String, Integer&gt;();
    m.put("One", 1);
    m.put("Two", 2);
    int one = m.get("One");                  // Integer -&gt; int, không cần ép kiểu
    System.out.println("one + 1 = " + (one + 1));
  }
}</code></pre>
<div class="out">1<br>
one + 1 = 2</div>
<ul>
<li>Với <code>HashMap</code> kiểu thô (raw type), <code>get</code> trả về <code>Object</code>; in nó ra sẽ gọi <code>toString()</code> → "1".</li>
<li><code>new Integer(1)</code> bị đánh dấu lỗi thời (deprecated) từ Java 9 (và bị đánh dấu sẽ xoá từ Java 16); hãy viết <code>Integer.valueOf(1)</code> hoặc chỉ <code>1</code> — cơ chế tự đóng hộp (autoboxing) lo phần còn lại.</li>
<li>Với generic (kiểu tổng quát), <code>HashMap&lt;String, Integer&gt;</code>, <code>m.get("One")</code> đã là <code>Integer</code>: không cần ép kiểu, và giá trị sai kiểu thành lỗi biên dịch thay vì văng lỗi lúc chạy.</li>
</ul>
<div class="pitfall"><code>int three = m.get("Three");</code> biên dịch được nhưng văng <code>NullPointerException</code> lúc chạy: khoá không có, <code>get</code> trả <code>null</code>, mà <code>null</code> thì không mở hộp (unbox) thành <code>int</code> được.</div>`],
      [38, 'Applications of Hashing',
        `<p class="y-chinh">🎯 Hashing is applicable wherever something must be found by key very quickly: database records, compiler symbol tables, game positions, shell commands, IP routes.</p>
<ul>
<li><strong>Databases</strong>: efficient retrieval of records by key (hash indexes, extendible hashing — slide 27).</li>
<li><strong>Compilers</strong>: the symbol table maps every identifier to what the compiler knows about it (type, value, address).</li>
<li><strong>Games</strong>: look up a board configuration to find the move that goes with it.</li>
<li><strong>UNIX shell</strong>: quick command lookup — a command name is mapped to the location of its program.</li>
<li><strong>IP routing</strong>: fast IP address lookup.</li>
</ul>
<pre><code class="language-java">import java.util.HashMap;

public class SymbolTable {
    static HashMap&lt;String, Integer&gt; symbols = new HashMap&lt;String, Integer&gt;();   // variable name -&gt; value

    static int value(String token) {                    // a number, or look the name up: O(1) on average
        return Character.isDigit(token.charAt(0)) ? Integer.parseInt(token) : symbols.get(token);
    }

    public static void main(String[] args) {
        String[] program = {"x = 5", "y = x + 2", "x = y * 3", "z = x - y"};
        for (String line : program) {
            String[] t = line.split(" ");                  // name = a [op b]
            int v = value(t[2]);
            if (t.length == 5) {
                int w = value(t[4]);
                v = t[3].equals("+") ? v + w : t[3].equals("-") ? v - w : v * w;
            }
            symbols.put(t[0], v);                          // declare or update the variable
            System.out.println(String.format("%-10s -&gt; %s = %d", line, t[0], v));
        }
        System.out.println("symbol table: x = " + symbols.get("x") + ", y = " + symbols.get("y") + ", z = " + symbols.get("z"));
    }
}</code></pre>
<div class="out">x = 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; x = 5<br>
y = x + 2 &nbsp;-&gt; y = 7<br>
x = y * 3 &nbsp;-&gt; x = 21<br>
z = x - y &nbsp;-&gt; z = 14<br>
symbol table: x = 21, y = 7, z = 14</div>
<p>A toy "compiler" keeps its variables in a HashMap: every use of <code>x</code> or <code>y</code> is one O(1) lookup, however many variables the program declares.</p>
<p class="dap-an">✅ <strong>Answer to the syllabus question "What are the advantages and disadvantages of hashing?"</strong> Advantages: O(1) average insert, search and delete; ready to use through HashMap and HashSet. Disadvantages: O(n) in the worst case (bad hash function, many collisions); no ordering — min, max, sorted output and range queries are slow; spare cells are needed to keep the load factor low; and a good hash function must be designed.</p>`,
        `<p class="y-chinh">🎯 Băm dùng được ở mọi nơi cần tìm một thứ theo khoá thật nhanh: bản ghi cơ sở dữ liệu, bảng ký hiệu của trình biên dịch, thế cờ trong trò chơi, lệnh của shell (trình thông dịch lệnh), tuyến đường IP.</p>
<ul>
<li><strong>Cơ sở dữ liệu</strong>: truy xuất bản ghi theo khoá hiệu quả (chỉ mục băm — hash index, băm mở rộng — slide 27).</li>
<li><strong>Trình biên dịch (compiler)</strong>: bảng ký hiệu (symbol table) ánh xạ mỗi định danh (identifier) tới những gì trình biên dịch biết về nó (kiểu, giá trị, địa chỉ).</li>
<li><strong>Trò chơi</strong>: tra một thế cờ (board configuration) để tìm nước đi tương ứng.</li>
<li><strong>Shell của UNIX</strong>: tra lệnh nhanh — tên lệnh được ánh xạ tới vị trí chương trình của nó.</li>
<li><strong>Định tuyến IP (IP routing)</strong>: tra địa chỉ IP nhanh.</li>
</ul>
<pre><code class="language-java">import java.util.HashMap;

public class SymbolTable {
    static HashMap&lt;String, Integer&gt; symbols = new HashMap&lt;String, Integer&gt;();   // tên biến -&gt; giá trị

    static int value(String token) {                    // một số, hoặc tra tên: O(1) trung bình
        return Character.isDigit(token.charAt(0)) ? Integer.parseInt(token) : symbols.get(token);
    }

    public static void main(String[] args) {
        String[] program = {"x = 5", "y = x + 2", "x = y * 3", "z = x - y"};
        for (String line : program) {
            String[] t = line.split(" ");                  // tên = a [phép b]
            int v = value(t[2]);
            if (t.length == 5) {
                int w = value(t[4]);
                v = t[3].equals("+") ? v + w : t[3].equals("-") ? v - w : v * w;
            }
            symbols.put(t[0], v);                          // khai báo hoặc cập nhật biến
            System.out.println(String.format("%-10s -&gt; %s = %d", line, t[0], v));
        }
        System.out.println("symbol table: x = " + symbols.get("x") + ", y = " + symbols.get("y") + ", z = " + symbols.get("z"));
    }
}</code></pre>
<div class="out">x = 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; x = 5<br>
y = x + 2 &nbsp;-&gt; y = 7<br>
x = y * 3 &nbsp;-&gt; x = 21<br>
z = x - y &nbsp;-&gt; z = 14<br>
symbol table: x = 21, y = 7, z = 14</div>
<p>Một "trình biên dịch" đồ chơi giữ các biến trong một HashMap: mỗi lần dùng <code>x</code> hay <code>y</code> là một lần tra O(1), dù chương trình khai báo bao nhiêu biến.</p>
<p class="dap-an">✅ <strong>Đáp án câu hỏi syllabus "Ưu và nhược điểm của băm là gì?"</strong> Ưu: chèn, tìm, xoá O(1) trung bình; dùng ngay được qua HashMap và HashSet. Nhược: O(n) trong trường hợp xấu nhất (hàm băm tồi, nhiều va chạm); không giữ thứ tự — tìm min, max, in theo thứ tự và truy vấn theo khoảng (range query) đều chậm; phải chừa ô trống để giữ hệ số tải (load factor) thấp; và phải thiết kế được hàm băm tốt.</p>`],
      [39, 'Summary',
        `<p class="y-chinh">🎯 The deck in five lines: five kinds of hash function, three families of collision resolution, HashMap implements the Map ADT by hashing, HashSet implements a set of unique elements, Hashtable is the synchronized, null-free cousin of HashMap.</p>
<table>
<thead><tr><th>Topic</th><th>What to remember</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>Hash functions</td><td>division, folding, mid-square, extraction, radix transformation</td><td>11–14</td></tr>
<tr><td>Collision resolution</td><td>open addressing (linear, quadratic probing), chaining (separate, coalesced), bucket addressing</td><td>15–24</td></tr>
<tr><td>HashMap</td><td>the Map ADT implemented by hashing (chaining); null key and values allowed; not synchronized</td><td>34, 36–37</td></tr>
<tr><td>HashSet</td><td>a set: stores unique elements; <code>add</code> returns false for a duplicate</td><td>34–35</td></tr>
<tr><td>Hashtable</td><td>roughly a HashMap, but synchronized and without null values</td><td>34, 36</td></tr>
</tbody>
</table>
<p class="nhan">After this deck you should be able to</p>
<ul>
<li>name the five hash functions and recognise each from an example (704 and 902 = folding, 406 = mid-square, 1289 = extraction, 423 = radix);</li>
<li>place keys by hand with linear probing, quadratic probing or chaining — slides 16, 19, 21 — and explain why deleting needs a mark (slide 25);</li>
<li>say what <code>put</code>, <code>get</code>, <code>remove</code> and <code>add</code> return, and how HashMap and Hashtable differ;</li>
<li>code put, get and remove of a small hash table in Java — the exercises of lesson 7.5.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a hash table is fast because it does not compare keys to find them — it computes where they are. Everything else in the chapter is about what happens when two keys want the same place.</p>`,
        `<p class="y-chinh">🎯 Cả bộ slide trong năm dòng: năm loại hàm băm, ba họ giải quyết va chạm, HashMap cài đặt ADT Map (kiểu dữ liệu trừu tượng ánh xạ khoá → giá trị) bằng băm, HashSet cài đặt một tập các phần tử không trùng, Hashtable là "anh em" có đồng bộ hoá và cấm null của HashMap.</p>
<table>
<thead><tr><th>Chủ đề</th><th>Cần nhớ</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Hàm băm (hash function)</td><td>chia lấy dư, gấp số, bình phương lấy giữa, trích chữ số, đổi cơ số</td><td>11–14</td></tr>
<tr><td>Giải quyết va chạm (collision resolution)</td><td>địa chỉ mở (dò tuyến tính, dò bậc hai), dây chuyền (tách biệt, gộp dây), địa chỉ bucket (bucket addressing — mỗi địa chỉ nhiều chỗ)</td><td>15–24</td></tr>
<tr><td>HashMap</td><td>ADT Map cài bằng băm (dây chuyền); cho phép khoá và giá trị null; không đồng bộ hoá</td><td>34, 36–37</td></tr>
<tr><td>HashSet</td><td>một tập hợp (set): lưu phần tử không trùng; <code>add</code> trả false khi trùng</td><td>34–35</td></tr>
<tr><td>Hashtable</td><td>gần giống HashMap, nhưng đồng bộ hoá và không cho giá trị null</td><td>34, 36</td></tr>
</tbody>
</table>
<p class="nhan">Học xong bộ slide này, bạn phải làm được</p>
<ul>
<li>kể tên năm loại hàm băm và nhận ra từng loại qua ví dụ (704 và 902 = gấp số, 406 = bình phương lấy giữa, 1289 = trích chữ số, 423 = đổi cơ số);</li>
<li>tự tay xếp khoá bằng dò tuyến tính, dò bậc hai hoặc dây chuyền — slide 16, 19, 21 — và giải thích vì sao xoá phải đánh dấu (slide 25);</li>
<li>nói được <code>put</code>, <code>get</code>, <code>remove</code> và <code>add</code> trả về gì, và HashMap khác Hashtable ở đâu;</li>
<li>viết bằng Java put, get, remove của một bảng băm nhỏ — các bài tập của bài 7.5.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bảng băm (hash table) nhanh vì nó không so sánh các khoá để tìm chúng — nó tính ra chỗ của chúng. Mọi thứ còn lại trong chương là chuyện xảy ra khi hai khoá cùng muốn một chỗ.</p>`],
      [40, 'Reading at home',
        `<p class="y-chinh">🎯 Chapter 10 of Goodrich 6e (Maps, Hash Tables, and Skip Lists) is the textbook version of this deck; §10.2 covers the hash-table slides.</p>
<ul>
<li><strong>Ch.10 Maps, Hash Tables, and Skip Lists (p.401)</strong> — it opens with maps: the Map ADT and the word-counting application of slides 30–33.</li>
<li><strong>§10.2 Hash Tables (p.410)</strong> and <strong>§10.2.1 Hash Functions (p.411)</strong> — hash codes and compression functions (slides 5–14 and 29).</li>
<li><strong>§10.2.2 Collision-Handling Schemes (p.417)</strong> — separate chaining, open addressing, linear and quadratic probing (slides 15–25).</li>
<li><strong>§10.2.3 Load Factors, Rehashing, and Efficiency (p.420)</strong> — slide 18 and the 0.75 of Java's HashMap.</li>
<li><strong>§10.2.4 Java Hash Table Implementation (p.422)</strong> — the book's <code>ChainHashMap</code> and <code>ProbeHashMap</code>, the textbook versions of slides 21 and 25.</li>
</ul>
<p>The book's classes are generic (<code>K</code>, <code>V</code>) and compress hash codes with the MAD method (multiply–add–divide) instead of a plain <code>%</code>; the ideas are the ones of the slides.</p>`,
        `<p class="y-chinh">🎯 Chương 10 sách Goodrich bản 6 (Maps, Hash Tables, and Skip Lists) là phiên bản giáo trình của bộ slide này; mục §10.2 ứng với các slide về bảng băm.</p>
<ul>
<li><strong>Ch.10 Maps, Hash Tables, and Skip Lists (tr.401)</strong> — mở đầu bằng map (ánh xạ): ADT Map và ứng dụng đếm từ của slide 30–33.</li>
<li><strong>§10.2 Hash Tables (tr.410)</strong> và <strong>§10.2.1 Hash Functions (tr.411)</strong> — mã băm (hash code) và hàm nén (compression function) (slide 5–14 và 29).</li>
<li><strong>§10.2.2 Collision-Handling Schemes (tr.417)</strong> — dây chuyền tách biệt, địa chỉ mở, dò tuyến tính và dò bậc hai (slide 15–25).</li>
<li><strong>§10.2.3 Load Factors, Rehashing, and Efficiency (tr.420)</strong> — hệ số tải, băm lại (rehash): slide 18 và con số 0,75 của HashMap trong Java.</li>
<li><strong>§10.2.4 Java Hash Table Implementation (tr.422)</strong> — các lớp <code>ChainHashMap</code> và <code>ProbeHashMap</code> của sách, bản giáo trình của slide 21 và 25.</li>
</ul>
<p>Các lớp trong sách là kiểu tổng quát (generic, <code>K</code>, <code>V</code>) và nén mã băm bằng phương pháp MAD (nhân–cộng–chia: multiply–add–divide) thay vì một phép <code>%</code> đơn thuần; ý tưởng vẫn là ý tưởng của slide.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>Separate chaining, M = 10, h(x) = x % 10, each key added at the front: insert 12, 22, 32. What is chain 2, and how many nodes does search(42) visit?</li>
<li>Why can a key not be deleted from a linear-probing table by emptying its cell?</li>
<li>What is the difference between a perfect and a minimal perfect hash function?</li>
<li><code>map.put("a", 1); map.put("a", 2);</code> — what does the second put return, and what is <code>map.size()</code>?</li>
<li>Give two differences between HashMap and Hashtable.</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 32 → 22 → 12; search(42) visits all 3 nodes and reaches null → not found. (2) a search stops at the first empty cell, so the keys that were placed after the emptied cell become unreachable — mark the cell as deleted instead. (3) perfect = no collision; minimal perfect = no collision and exactly as many cells as keys (no empty cell). (4) it returns 1, the old value; the size is 1. (5) HashMap is unsynchronized and allows a null key and null values; Hashtable is synchronized and rejects null.</p>
<p><strong>Next:</strong> the deep-dive lessons 7.1 Hash tables &amp; collisions, 7.2 Hash functions &amp; the hashCode/equals contract, 7.3 Collision handling in depth and 7.4 Load factor, rehashing &amp; Java HashMap, then lesson 7.5 (seven PE-style exercises with self-tests, the glossary and the summary) and the chapter 7 quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Dây chuyền tách biệt, M = 10, h(x) = x % 10, khoá mới luôn thêm vào đầu dây: chèn 12, 22, 32. Dây 2 trông thế nào, và search(42) đi qua mấy nút?</li>
<li>Vì sao không thể xoá khoá khỏi bảng dò tuyến tính bằng cách làm trống ô của nó?</li>
<li>Hàm băm hoàn hảo và hàm băm hoàn hảo tối thiểu khác nhau ở đâu?</li>
<li><code>map.put("a", 1); map.put("a", 2);</code> — lệnh put thứ hai trả về gì, và <code>map.size()</code> bằng bao nhiêu?</li>
<li>Nêu hai điểm khác nhau giữa HashMap và Hashtable.</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 32 → 22 → 12; search(42) đi qua cả 3 nút rồi gặp null → không thấy. (2) phép tìm dừng ở ô trống đầu tiên, nên các khoá từng được đặt sau ô bị làm trống sẽ không tìm tới được nữa — phải đánh dấu "đã xoá" thay vì làm trống. (3) hoàn hảo = không va chạm; hoàn hảo tối thiểu = không va chạm và số ô đúng bằng số khoá (không ô trống). (4) trả về 1, giá trị cũ; kích thước là 1. (5) HashMap không đồng bộ hoá và cho phép khoá null, giá trị null; Hashtable có đồng bộ hoá và cấm null.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu 7.1 Bảng băm &amp; va chạm, 7.2 Hàm băm &amp; giao ước hashCode/equals, 7.3 Xử lý va chạm chuyên sâu và 7.4 Hệ số tải, rehash &amp; HashMap trong Java, rồi bài 7.5 (bảy bài tập kiểu PE có test tự kiểm, bảng thuật ngữ và tóm tắt) và quiz chương 7.</p>`),
    books([
      ['goodrich', 'Ch.10 Maps, Hash Tables, and Skip Lists p.401 · §10.2 Hash Tables p.410 · §10.2.1 Hash Functions p.411 · §10.2.2 Collision-Handling Schemes p.417 · §10.2.3 Load Factors, Rehashing, and Efficiency p.420 · §10.2.4 Java Hash Table Implementation p.422', 'Chương 10 Maps, Hash Tables, and Skip Lists tr.401 · §10.2 Hash Tables tr.410 · §10.2.1 Hash Functions tr.411 · §10.2.2 Collision-Handling Schemes tr.417 · §10.2.3 Load Factors, Rehashing, and Efficiency tr.420 · §10.2.4 Java Hash Table Implementation tr.422'],
    ]),
  ].join('\n'),
};

/* ───────── 7.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Hashing ───────── */
const L_on_ch7 = {
  title: '7.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Hashing|||7.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Băm',
  slug: 'csd201-on-ch7',
  type: 'VIDEO',
  description: '7 bài tập kiểu đề PE về băm (HashSet tìm phần tử trùng và cặp có tổng K, đếm tần suất từ bằng HashMap, hàm băm chuỗi đa thức và đếm va chạm, equals/hashCode cho lớp khoá tự viết, bảng dò tuyến tính có đánh dấu xoá, dò bậc hai với Car, băm dây chuyền có rehash với Book) có lời giải và test tự kiểm chạy thật; 26 thuật ngữ Anh–Việt; tóm tắt 8 ý và bảng độ phức tạp của chương 7.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lesson 7.5 · Practice &amp; review</span>
<h2>Hashing — practise like the PE, then review</h2>
<p class="lead">Seven exercises in the shape of the practical exam — from a ten-minute HashSet warm-up to a book catalogue with separate chaining and rehashing — each with a solution that tests itself. Several tests reuse the exact examples of the 7-Hashing deck (slides 19, 20, 25), so you can check the slides and your code against each other. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the methods yourself in Eclipse, on top of the given data class (<code>Car</code>, <code>Book</code>, <code>Student</code>…).</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it.</li>
</ol>
<p>In a CSD201 PE the skeleton — the data class, the structure class, a <code>main</code> that calls <code>f1</code>, <code>f2</code>, … and writes each answer to a file — is usually given, and you fill in the method bodies. Here every answer is printed on the screen instead of written to a file. Exercises 1–4 use java.util correctly (what you will do at work); exercises 5–7 build the table yourself (what the FE and the PE test).</p></div>`,
    `<span class="eyebrow">Chương 7 · Bài 7.5 · Thực hành &amp; ôn tập</span>
<h2>Băm — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Bảy bài tập theo dạng đề thi thực hành (PE) — từ bài khởi động mười phút với HashSet tới một danh mục sách dùng dây chuyền tách biệt (separate chaining) có băm lại (rehash) — bài nào cũng có lời giải tự kiểm tra được. Nhiều test dùng lại đúng các ví dụ của bộ slide 7-Hashing (slide 19, 20, 25), để bạn đối chiếu slide với code của mình. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp để ôn trước FE.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết các hàm trong Eclipse, dựa trên lớp dữ liệu cho sẵn (<code>Car</code>, <code>Book</code>, <code>Student</code>…).</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Đề PE môn CSD201 thường cho sẵn bộ khung — lớp dữ liệu, lớp cấu trúc, hàm <code>main</code> gọi <code>f1</code>, <code>f2</code>, … và đoạn code ghi từng đáp án ra file — còn bạn viết thân các hàm. Ở đây mọi kết quả được in ra màn hình thay vì ghi ra file. Bài 1–4 luyện dùng java.util cho đúng (việc bạn sẽ làm khi đi làm); bài 5–7 tự dựng bảng băm (thứ FE và PE kiểm tra).</p></div>`),
    bi(`<h3>🧪 Exercise 1 — f1–f3 with a HashSet: duplicates, pair with sum K, distinct values (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>For an <code>int</code> array write: <code>firstDuplicate(a)</code> — the first value met for the second time when scanning from left to right, or −1; <code>hasPairWithSum(a, k)</code> — whether two <strong>different positions</strong> hold values whose sum is k; <code>countDistinct(a)</code> — the number of different values.</p>
<p class="nhan">Data → expected result</p>
<p>3 1 4 1 5 9 2 6 5 → first duplicate <strong>1</strong>, <strong>7</strong> distinct values; {8, 3, 5, 1}, k = 9 → <strong>true</strong> (8 + 1); {4, 2}, k = 8 → <strong>false</strong>; {4, 4}, k = 8 → <strong>true</strong>.</p>
<p class="nhan">Idea</p>
<p>one pass with a HashSet <code>seen</code>. <code>seen.add(x)</code> returns false when x is already there — that is the duplicate. For the pair, before adding x ask whether k − x has been seen. Every step is O(1) on average, so each method is O(n) instead of the O(n²) double loop.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.HashSet;

public class Pe1HashSetTricks {
    // f1: the first value met for the second time, scanning left to right; -1 if none
    static int firstDuplicate(int[] a) {
        HashSet&lt;Integer&gt; seen = new HashSet&lt;Integer&gt;();
        for (int x : a) if (!seen.add(x)) return x;    // add returns false: x was already there
        return -1;
    }

    // f2: are there two DIFFERENT positions i, j with a[i] + a[j] == k?
    static boolean hasPairWithSum(int[] a, int k) {
        HashSet&lt;Integer&gt; seen = new HashSet&lt;Integer&gt;();
        for (int x : a) {
            if (seen.contains(k - x)) return true;      // check BEFORE adding x
            seen.add(x);
        }
        return false;
    }

    // f3: number of distinct values
    static int countDistinct(int[] a) {
        HashSet&lt;Integer&gt; s = new HashSet&lt;Integer&gt;();
        for (int x : a) s.add(x);
        return s.size();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6, 5};
        check("first duplicate of 3 1 4 1 5 9 2 6 5 is 1", "" + firstDuplicate(a), "1");
        check("no duplicate -&gt; -1", "" + firstDuplicate(new int[] {1, 2, 3}), "-1");
        check("8 + 1 = 9 -&gt; pair found", "" + hasPairWithSum(new int[] {8, 3, 5, 1}, 9), "true");
        check("{4, 2}, k = 8: 4 + 4 needs two 4s -&gt; false", "" + hasPairWithSum(new int[] {4, 2}, 8), "false");
        check("{4, 4}, k = 8 -&gt; true", "" + hasPairWithSum(new int[] {4, 4}, 8), "true");
        check("negative numbers: -3 + 10 = 7", "" + hasPairWithSum(new int[] {-3, 2, 10}, 7), "true");
        check("7 distinct values", "" + countDistinct(a), "7");
        check("empty array: 0 distinct, no pair", countDistinct(new int[0]) + " " + hasPairWithSum(new int[0], 0), "0 false");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS first duplicate of 3 1 4 1 5 9 2 6 5 is 1<br>
PASS no duplicate -&gt; -1<br>
PASS 8 + 1 = 9 -&gt; pair found<br>
PASS {4, 2}, k = 8: 4 + 4 needs two 4s -&gt; false<br>
PASS {4, 4}, k = 8 -&gt; true<br>
PASS negative numbers: -3 + 10 = 7<br>
PASS 7 distinct values<br>
PASS empty array: 0 distinct, no pair<br>
ALL TESTS PASSED</div>
<div class="pitfall">Adding x <em>before</em> checking k − x pairs x with itself: {4, 2} with k = 8 would answer true. Check first, then add — the test "4 + 4 needs two 4s" catches exactly this bug.</div>`,
    `<h3>🧪 Bài 1 — f1–f3 với HashSet: phần tử trùng, cặp có tổng K, số giá trị phân biệt (kiểu PE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Với một mảng <code>int</code>, viết: <code>firstDuplicate(a)</code> — giá trị đầu tiên gặp lần thứ hai khi quét từ trái sang phải, hoặc −1; <code>hasPairWithSum(a, k)</code> — có hai <strong>vị trí khác nhau</strong> nào chứa hai giá trị có tổng bằng k không; <code>countDistinct(a)</code> — số giá trị khác nhau.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>3 1 4 1 5 9 2 6 5 → phần tử trùng đầu tiên là <strong>1</strong>, có <strong>7</strong> giá trị phân biệt; {8, 3, 5, 1}, k = 9 → <strong>true</strong> (8 + 1); {4, 2}, k = 8 → <strong>false</strong>; {4, 4}, k = 8 → <strong>true</strong>.</p>
<p class="nhan">Ý tưởng</p>
<p>một lượt duyệt với một HashSet (tập băm) <code>seen</code>. <code>seen.add(x)</code> trả false khi x đã có sẵn — đó chính là phần tử trùng. Với bài tìm cặp, trước khi thêm x hãy hỏi k − x đã gặp chưa. Mỗi bước O(1) trung bình, nên mỗi hàm là O(n) thay vì O(n²) với hai vòng lặp lồng nhau.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.HashSet;

public class Pe1HashSetTricks {
    // f1: giá trị đầu tiên gặp lần thứ hai khi quét trái sang phải; -1 nếu không có
    static int firstDuplicate(int[] a) {
        HashSet&lt;Integer&gt; seen = new HashSet&lt;Integer&gt;();
        for (int x : a) if (!seen.add(x)) return x;    // add trả false: x đã có sẵn
        return -1;
    }

    // f2: có hai vị trí KHÁC nhau i, j với a[i] + a[j] == k không?
    static boolean hasPairWithSum(int[] a, int k) {
        HashSet&lt;Integer&gt; seen = new HashSet&lt;Integer&gt;();
        for (int x : a) {
            if (seen.contains(k - x)) return true;      // kiểm tra TRƯỚC khi thêm x
            seen.add(x);
        }
        return false;
    }

    // f3: số giá trị phân biệt
    static int countDistinct(int[] a) {
        HashSet&lt;Integer&gt; s = new HashSet&lt;Integer&gt;();
        for (int x : a) s.add(x);
        return s.size();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 4, 1, 5, 9, 2, 6, 5};
        check("first duplicate of 3 1 4 1 5 9 2 6 5 is 1", "" + firstDuplicate(a), "1");
        check("no duplicate -&gt; -1", "" + firstDuplicate(new int[] {1, 2, 3}), "-1");
        check("8 + 1 = 9 -&gt; pair found", "" + hasPairWithSum(new int[] {8, 3, 5, 1}, 9), "true");
        check("{4, 2}, k = 8: 4 + 4 needs two 4s -&gt; false", "" + hasPairWithSum(new int[] {4, 2}, 8), "false");
        check("{4, 4}, k = 8 -&gt; true", "" + hasPairWithSum(new int[] {4, 4}, 8), "true");
        check("negative numbers: -3 + 10 = 7", "" + hasPairWithSum(new int[] {-3, 2, 10}, 7), "true");
        check("7 distinct values", "" + countDistinct(a), "7");
        check("empty array: 0 distinct, no pair", countDistinct(new int[0]) + " " + hasPairWithSum(new int[0], 0), "0 false");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS first duplicate of 3 1 4 1 5 9 2 6 5 is 1<br>
PASS no duplicate -&gt; -1<br>
PASS 8 + 1 = 9 -&gt; pair found<br>
PASS {4, 2}, k = 8: 4 + 4 needs two 4s -&gt; false<br>
PASS {4, 4}, k = 8 -&gt; true<br>
PASS negative numbers: -3 + 10 = 7<br>
PASS 7 distinct values<br>
PASS empty array: 0 distinct, no pair<br>
ALL TESTS PASSED</div>
<div class="pitfall">Thêm x <em>trước khi</em> kiểm tra k − x là ghép x với chính nó: {4, 2} với k = 8 sẽ trả true. Kiểm tra trước, thêm sau — test "4 + 4 needs two 4s" bắt đúng lỗi này.</div>`),
    bi(`<h3>🧪 Exercise 2 — f1–f2 with a HashMap: word frequencies and the top k (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p><code>countWords(text)</code> returns a <code>HashMap&lt;String, Integer&gt;</code> from every word (letters only, compared in lower case) to its number of occurrences. <code>topK(freq, k)</code> returns the k most frequent words as "word=count": count descending, equal counts in alphabetical order.</p>
<p class="nhan">Data → expected result</p>
<p>"The cat and the hat, and THE bat." → the=3, and=2, bat=1, cat=1, hat=1; top 2 → <strong>the=3 and=2</strong>; top 4 → <strong>the=3 and=2 bat=1 cat=1</strong>.</p>
<p class="nhan">Idea</p>
<p><code>freq.put(w, freq.getOrDefault(w, 0) + 1)</code> for every word (slide 33). For the top k, copy the entries into a list and sort it with a comparator: first by count, descending, then by word. Counting is O(n) for n words; sorting d distinct words is O(d log d).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Pe2WordFrequency {
    // f1: word -&gt; count; words are runs of letters, compared in lower case
    static HashMap&lt;String, Integer&gt; countWords(String text) {
        HashMap&lt;String, Integer&gt; freq = new HashMap&lt;String, Integer&gt;();
        for (String w : text.toLowerCase().split("[^a-z]+"))
            if (!w.isEmpty()) freq.put(w, freq.getOrDefault(w, 0) + 1);   // no NullPointerException
        return freq;
    }

    // f2: the k most frequent words: count descending, then alphabetical
    static String topK(Map&lt;String, Integer&gt; freq, int k) {
        List&lt;Map.Entry&lt;String, Integer&gt;&gt; list = new ArrayList&lt;Map.Entry&lt;String, Integer&gt;&gt;(freq.entrySet());
        list.sort((x, y) -&gt; !x.getValue().equals(y.getValue()) ? Integer.compare(y.getValue(), x.getValue()) : x.getKey().compareTo(y.getKey()));
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; k &amp;&amp; i &lt; list.size(); i++) s.append(list.get(i).getKey()).append('=').append(list.get(i).getValue()).append(' ');
        return s.toString().trim();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        HashMap&lt;String, Integer&gt; f = countWords("The cat and the hat, and THE bat.");
        check("the = 3 (case ignored)", "" + f.get("the"), "3");
        check("and = 2, cat = 1", f.get("and") + " " + f.get("cat"), "2 1");
        check("5 distinct words", "" + f.size(), "5");
        check("absent word: getOrDefault -&gt; 0", "" + f.getOrDefault("dog", 0), "0");
        check("top 2", topK(f, 2), "the=3 and=2");
        check("top 4: ties sorted alphabetically", topK(f, 4), "the=3 and=2 bat=1 cat=1");
        check("k larger than the map", topK(countWords("b a b"), 9), "b=2 a=1");
        check("text without letters -&gt; empty map", "" + countWords("123 ... !!").size(), "0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS the = 3 (case ignored)<br>
PASS and = 2, cat = 1<br>
PASS 5 distinct words<br>
PASS absent word: getOrDefault -&gt; 0<br>
PASS top 2<br>
PASS top 4: ties sorted alphabetically<br>
PASS k larger than the map<br>
PASS text without letters -&gt; empty map<br>
ALL TESTS PASSED</div>
<div class="pitfall">Taking "the first k entries" of a HashMap without sorting is wrong: its iteration order is the order of its buckets (slide 35), not the order of the counts. And <code>freq.get(w) + 1</code> throws <code>NullPointerException</code> the first time a word appears.</div>`,
    `<h3>🧪 Bài 2 — f1–f2 với HashMap: đếm tần suất từ và k từ đứng đầu (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p><code>countWords(text)</code> trả về một <code>HashMap&lt;String, Integer&gt;</code> ánh xạ mỗi từ (chỉ gồm chữ cái, so sánh ở dạng chữ thường) tới số lần xuất hiện. <code>topK(freq, k)</code> trả về k từ xuất hiện nhiều nhất dạng "từ=số lần": số lần giảm dần, bằng nhau thì theo thứ tự bảng chữ cái.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>"The cat and the hat, and THE bat." → the=3, and=2, bat=1, cat=1, hat=1; top 2 → <strong>the=3 and=2</strong>; top 4 → <strong>the=3 and=2 bat=1 cat=1</strong>.</p>
<p class="nhan">Ý tưởng</p>
<p><code>freq.put(w, freq.getOrDefault(w, 0) + 1)</code> với mỗi từ (slide 33). Để lấy top k, chép các mục (entry) sang một danh sách rồi sắp xếp bằng một bộ so sánh (comparator): trước theo số lần, giảm dần, sau theo từ. Đếm là O(n) với n từ; sắp d từ phân biệt là O(d log d).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Pe2WordFrequency {
    // f1: từ -&gt; số lần; từ = dãy chữ cái liền nhau, so sánh ở dạng chữ thường
    static HashMap&lt;String, Integer&gt; countWords(String text) {
        HashMap&lt;String, Integer&gt; freq = new HashMap&lt;String, Integer&gt;();
        for (String w : text.toLowerCase().split("[^a-z]+"))
            if (!w.isEmpty()) freq.put(w, freq.getOrDefault(w, 0) + 1);   // không NullPointerException
        return freq;
    }

    // f2: k từ xuất hiện nhiều nhất: số lần giảm dần, rồi theo bảng chữ cái
    static String topK(Map&lt;String, Integer&gt; freq, int k) {
        List&lt;Map.Entry&lt;String, Integer&gt;&gt; list = new ArrayList&lt;Map.Entry&lt;String, Integer&gt;&gt;(freq.entrySet());
        list.sort((x, y) -&gt; !x.getValue().equals(y.getValue()) ? Integer.compare(y.getValue(), x.getValue()) : x.getKey().compareTo(y.getKey()));
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; k &amp;&amp; i &lt; list.size(); i++) s.append(list.get(i).getKey()).append('=').append(list.get(i).getValue()).append(' ');
        return s.toString().trim();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        HashMap&lt;String, Integer&gt; f = countWords("The cat and the hat, and THE bat.");
        check("the = 3 (case ignored)", "" + f.get("the"), "3");
        check("and = 2, cat = 1", f.get("and") + " " + f.get("cat"), "2 1");
        check("5 distinct words", "" + f.size(), "5");
        check("absent word: getOrDefault -&gt; 0", "" + f.getOrDefault("dog", 0), "0");
        check("top 2", topK(f, 2), "the=3 and=2");
        check("top 4: ties sorted alphabetically", topK(f, 4), "the=3 and=2 bat=1 cat=1");
        check("k larger than the map", topK(countWords("b a b"), 9), "b=2 a=1");
        check("text without letters -&gt; empty map", "" + countWords("123 ... !!").size(), "0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS the = 3 (case ignored)<br>
PASS and = 2, cat = 1<br>
PASS 5 distinct words<br>
PASS absent word: getOrDefault -&gt; 0<br>
PASS top 2<br>
PASS top 4: ties sorted alphabetically<br>
PASS k larger than the map<br>
PASS text without letters -&gt; empty map<br>
ALL TESTS PASSED</div>
<div class="pitfall">Lấy "k mục đầu tiên" của HashMap mà không sắp xếp là sai: thứ tự duyệt của nó là thứ tự các bucket — các ngăn chứa của bảng (slide 35), không phải thứ tự số lần. Còn <code>freq.get(w) + 1</code> văng <code>NullPointerException</code> ngay lần đầu một từ xuất hiện.</div>`),
    bi(`<h3>🧪 Exercise 3 — a polynomial string hash and a collision counter (~15 min)</h3>
<p class="nhan">Task</p>
<p><code>hash(s, m)</code> = (s₀·31ⁿ⁻¹ + s₁·31ⁿ⁻² + … + sₙ₋₁) mod m, computed so that it never overflows and is never negative, whatever the length of s. <code>countCollisions(words, m)</code> = how many words land in a cell that an earlier word already uses.</p>
<p class="nhan">Data → expected result</p>
<p>hash("cat", 13) = 98262 mod 13 = <strong>8</strong>; the words a, k, u, b (codes 97, 107, 117, 98): m = 10 → <strong>2</strong> collisions (97, 107 and 117 all end in 7), m = 13 → <strong>0</strong>.</p>
<p class="nhan">Idea</p>
<p>Horner's rule with a mod at every step: <code>h = (h * 31 + c) % m</code>, with <code>long h</code>. h always stays below m, so <code>h * 31 + c</code> can neither overflow nor become negative, and by modular arithmetic the result is the full polynomial mod m (slide 9). For the counter, a <code>boolean[] used</code> of size m.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">public class Pe3StringHash {
    // f1: polynomial hash (s0*31^(n-1) + ... + s(n-1)) mod m, Horner's rule, mod at every step
    static int hash(String s, int m) {
        long h = 0;
        for (int i = 0; i &lt; s.length(); i++) h = (h * 31 + s.charAt(i)) % m;   // stays in 0..m-1: no overflow
        return (int) h;
    }

    // f2: how many words land in a cell that is already used
    static int countCollisions(String[] words, int m) {
        boolean[] used = new boolean[m];
        int c = 0;
        for (String w : words) {
            int i = hash(w, m);
            if (used[i]) c++; else used[i] = true;
        }
        return c;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("cat: 99*31*31 + 97*31 + 116 = 98262, 98262 % 13 = 8", "" + hash("cat", 13), "8");
        check("same as String.hashCode() for a short word", "" + hash("cat", 13), "" + Math.floorMod("cat".hashCode(), 13));
        int h = hash("polygenelubricants", 13);
        check("long word: never negative, below m", "" + (h &gt;= 0 &amp;&amp; h &lt; 13), "true");
        check("order matters: ab and ba differ", "" + (hash("ab", 1000) != hash("ba", 1000)), "true");
        check("Aa and BB collide for every m (both 2112)", hash("Aa", 97) + " " + hash("Aa", 101), hash("BB", 97) + " " + hash("BB", 101));
        String[] w = {"a", "k", "u", "b"};              // codes 97, 107, 117, 98
        check("m = 10: a, k, u all -&gt; 7: 2 collisions", "" + countCollisions(w, 10), "2");
        check("m = 13 (prime): 6, 3, 0, 7: no collision", "" + countCollisions(w, 13), "0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS cat: 99*31*31 + 97*31 + 116 = 98262, 98262 % 13 = 8<br>
PASS same as String.hashCode() for a short word<br>
PASS long word: never negative, below m<br>
PASS order matters: ab and ba differ<br>
PASS Aa and BB collide for every m (both 2112)<br>
PASS m = 10: a, k, u all -&gt; 7: 2 collisions<br>
PASS m = 13 (prime): 6, 3, 0, 7: no collision<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>s.hashCode() % m</code> can be negative: for long strings the int overflows (slide 29). And "Aa" and "BB" have the same polynomial value, 2112, so they collide for <em>every</em> m — no table size can separate keys whose hash codes are equal.</div>`,
    `<h3>🧪 Bài 3 — hàm băm chuỗi dạng đa thức và bộ đếm va chạm (~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p><code>hash(s, m)</code> = (s₀·31ⁿ⁻¹ + s₁·31ⁿ⁻² + … + sₙ₋₁) mod m, tính sao cho không bao giờ tràn số (overflow) và không bao giờ âm, dù s dài bao nhiêu. <code>countCollisions(words, m)</code> = có bao nhiêu từ rơi vào một ô mà từ đứng trước đã dùng.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>hash("cat", 13) = 98262 mod 13 = <strong>8</strong>; các từ a, k, u, b (mã 97, 107, 117, 98): m = 10 → <strong>2</strong> va chạm (97, 107, 117 đều tận cùng bằng 7), m = 13 → <strong>0</strong>.</p>
<p class="nhan">Ý tưởng</p>
<p>quy tắc Horner, lấy mod ở mỗi bước: <code>h = (h * 31 + c) % m</code>, với <code>long h</code>. h luôn nhỏ hơn m, nên <code>h * 31 + c</code> không thể tràn số hay thành số âm, và theo tính chất của phép đồng dư, kết quả đúng bằng cả đa thức mod m (slide 9). Để đếm, dùng một mảng <code>boolean[] used</code> cỡ m.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">public class Pe3StringHash {
    // f1: băm đa thức (s0*31^(n-1) + ... + s(n-1)) mod m, quy tắc Horner, lấy mod ở mỗi bước
    static int hash(String s, int m) {
        long h = 0;
        for (int i = 0; i &lt; s.length(); i++) h = (h * 31 + s.charAt(i)) % m;   // luôn trong 0..m-1: không tràn số
        return (int) h;
    }

    // f2: có bao nhiêu từ rơi vào ô đã có người
    static int countCollisions(String[] words, int m) {
        boolean[] used = new boolean[m];
        int c = 0;
        for (String w : words) {
            int i = hash(w, m);
            if (used[i]) c++; else used[i] = true;
        }
        return c;
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("cat: 99*31*31 + 97*31 + 116 = 98262, 98262 % 13 = 8", "" + hash("cat", 13), "8");
        check("same as String.hashCode() for a short word", "" + hash("cat", 13), "" + Math.floorMod("cat".hashCode(), 13));
        int h = hash("polygenelubricants", 13);
        check("long word: never negative, below m", "" + (h &gt;= 0 &amp;&amp; h &lt; 13), "true");
        check("order matters: ab and ba differ", "" + (hash("ab", 1000) != hash("ba", 1000)), "true");
        check("Aa and BB collide for every m (both 2112)", hash("Aa", 97) + " " + hash("Aa", 101), hash("BB", 97) + " " + hash("BB", 101));
        String[] w = {"a", "k", "u", "b"};              // mã 97, 107, 117, 98
        check("m = 10: a, k, u all -&gt; 7: 2 collisions", "" + countCollisions(w, 10), "2");
        check("m = 13 (prime): 6, 3, 0, 7: no collision", "" + countCollisions(w, 13), "0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS cat: 99*31*31 + 97*31 + 116 = 98262, 98262 % 13 = 8<br>
PASS same as String.hashCode() for a short word<br>
PASS long word: never negative, below m<br>
PASS order matters: ab and ba differ<br>
PASS Aa and BB collide for every m (both 2112)<br>
PASS m = 10: a, k, u all -&gt; 7: 2 collisions<br>
PASS m = 13 (prime): 6, 3, 0, 7: no collision<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>s.hashCode() % m</code> có thể âm: với chuỗi dài, số int bị tràn (slide 29). Còn "Aa" và "BB" có cùng giá trị đa thức 2112, nên va chạm với <em>mọi</em> m — không kích thước bảng nào tách được hai khoá có mã băm bằng nhau.</div>`),
    bi(`<h3>🧪 Exercise 4 — equals and hashCode for your own key class (~15 min)</h3>
<p class="nhan">Task</p>
<p>Two <code>Student(id, name)</code> objects are the same student when their ids are equal. Write <code>equals</code> and <code>hashCode</code> so that a <code>HashSet&lt;Student&gt;</code> drops duplicates and a <code>HashMap&lt;Student, Integer&gt;</code> finds a score when asked with a <em>new</em> object that has the same id.</p>
<p class="nhan">Idea</p>
<p><code>equals</code> compares the ids; <code>hashCode</code> returns <code>id.hashCode()</code> — computed from the same field as <code>equals</code>, so equal students always get equal hash codes (the equals/hashCode contract) and land in the same bucket, where <code>equals</code> then recognises them. The last test shows the opposite: a <code>BadStudent</code> computes its hash code from the name, so two equal students get different codes; HashMap compares the stored hash codes before it ever calls <code>equals</code>, treats them as two different keys, and the set keeps both.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.HashMap;
import java.util.HashSet;

class Student {
    String id, name;

    Student(String id, String name) { this.id = id; this.name = name; }

    @Override
    public boolean equals(Object o) {                   // same student = same id
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        return id.equals(((Student) o).id);
    }

    @Override
    public int hashCode() { return id.hashCode(); }     // from the SAME field as equals
}

class BadStudent extends Student {                      // equals by id, but hashCode from name: WRONG
    BadStudent(String id, String name) { super(id, name); }

    @Override
    public int hashCode() { return name.hashCode(); }
}

public class Pe4EqualsHashCode {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        HashSet&lt;Student&gt; set = new HashSet&lt;Student&gt;();
        set.add(new Student("SE01", "An"));
        set.add(new Student("SE02", "Binh"));
        set.add(new Student("SE01", "An Nguyen"));      // same id: a duplicate
        check("duplicate id is not added again", "" + set.size(), "2");
        check("a NEW object with the same id is found", "" + set.contains(new Student("SE02", "?")), "true");
        HashMap&lt;Student, Integer&gt; score = new HashMap&lt;Student, Integer&gt;();
        score.put(new Student("SE01", "An"), 8);
        check("map.get with an equal key", "" + score.get(new Student("SE01", "")), "8");
        check("equal objects -&gt; equal hash codes", "" + (new Student("SE09", "X").hashCode() == new Student("SE09", "Y").hashCode()), "true");
        HashSet&lt;Student&gt; bad = new HashSet&lt;Student&gt;();
        bad.add(new BadStudent("SE01", "An"));
        bad.add(new BadStudent("SE01", "AN"));          // equal by equals, different hash codes
        check("inconsistent hashCode: the set keeps BOTH copies", "" + bad.size(), "2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS duplicate id is not added again<br>
PASS a NEW object with the same id is found<br>
PASS map.get with an equal key<br>
PASS equal objects -&gt; equal hash codes<br>
PASS inconsistent hashCode: the set keeps BOTH copies<br>
ALL TESTS PASSED</div>
<div class="pitfall">Overriding only <code>equals</code> is the classic bug: the inherited <code>hashCode</code> depends on the object's identity, so two equal students usually get different codes and the set keeps duplicates. Also never change a field used by <code>hashCode</code> while the object sits in a HashSet or is a key of a HashMap — it becomes unreachable.</div>`,
    `<h3>🧪 Bài 4 — equals và hashCode cho lớp khoá tự viết (~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Hai đối tượng <code>Student(id, name)</code> là cùng một sinh viên khi id bằng nhau. Viết <code>equals</code> và <code>hashCode</code> sao cho <code>HashSet&lt;Student&gt;</code> loại bỏ bản trùng và <code>HashMap&lt;Student, Integer&gt;</code> tìm được điểm khi được hỏi bằng một đối tượng <em>mới</em> có cùng id.</p>
<p class="nhan">Ý tưởng</p>
<p><code>equals</code> so sánh id; <code>hashCode</code> trả <code>id.hashCode()</code> — tính từ đúng trường mà <code>equals</code> dùng, nên hai sinh viên bằng nhau luôn có mã băm (hash code) bằng nhau (giao ước equals/hashCode) và rơi vào cùng bucket (ngăn chứa của bảng), rồi ở đó <code>equals</code> nhận ra chúng. Test cuối cho thấy điều ngược lại: <code>BadStudent</code> tính mã băm từ tên, nên hai sinh viên bằng nhau có hai mã khác nhau; HashMap so mã băm đã lưu trước khi gọi tới <code>equals</code>, coi chúng là hai khoá khác nhau, và tập hợp giữ cả hai.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.HashMap;
import java.util.HashSet;

class Student {
    String id, name;

    Student(String id, String name) { this.id = id; this.name = name; }

    @Override
    public boolean equals(Object o) {                   // cùng sinh viên = cùng id
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        return id.equals(((Student) o).id);
    }

    @Override
    public int hashCode() { return id.hashCode(); }     // tính từ CÙNG trường với equals
}

class BadStudent extends Student {                      // equals theo id, nhưng hashCode theo tên: SAI
    BadStudent(String id, String name) { super(id, name); }

    @Override
    public int hashCode() { return name.hashCode(); }
}

public class Pe4EqualsHashCode {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        HashSet&lt;Student&gt; set = new HashSet&lt;Student&gt;();
        set.add(new Student("SE01", "An"));
        set.add(new Student("SE02", "Binh"));
        set.add(new Student("SE01", "An Nguyen"));      // trùng id: bản trùng
        check("duplicate id is not added again", "" + set.size(), "2");
        check("a NEW object with the same id is found", "" + set.contains(new Student("SE02", "?")), "true");
        HashMap&lt;Student, Integer&gt; score = new HashMap&lt;Student, Integer&gt;();
        score.put(new Student("SE01", "An"), 8);
        check("map.get with an equal key", "" + score.get(new Student("SE01", "")), "8");
        check("equal objects -&gt; equal hash codes", "" + (new Student("SE09", "X").hashCode() == new Student("SE09", "Y").hashCode()), "true");
        HashSet&lt;Student&gt; bad = new HashSet&lt;Student&gt;();
        bad.add(new BadStudent("SE01", "An"));
        bad.add(new BadStudent("SE01", "AN"));          // bằng nhau theo equals, khác mã băm
        check("inconsistent hashCode: the set keeps BOTH copies", "" + bad.size(), "2");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS duplicate id is not added again<br>
PASS a NEW object with the same id is found<br>
PASS map.get with an equal key<br>
PASS equal objects -&gt; equal hash codes<br>
PASS inconsistent hashCode: the set keeps BOTH copies<br>
ALL TESTS PASSED</div>
<div class="pitfall">Chỉ ghi đè (override) <code>equals</code> là lỗi kinh điển: <code>hashCode</code> thừa kế phụ thuộc vào danh tính (identity) của đối tượng, nên hai sinh viên bằng nhau thường có mã khác nhau và tập hợp giữ cả bản trùng. Và đừng bao giờ sửa một trường mà <code>hashCode</code> dùng trong lúc đối tượng đang nằm trong HashSet hay đang làm khoá của HashMap — nó sẽ không tìm lại được nữa.</div>`),
    bi(`<h3>🧪 Exercise 5 — f1–f3: a linear-probing table with deleted marks (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>A table of <code>int</code> keys with m = 11 cells, h(k) = k mod 11, linear probing. Every cell has a state: EMPTY, FULL or DELETED. Write <code>search(k)</code> (the cell of k, or −1), <code>insert(k)</code> (returns the cell; no duplicates; −1 if the table is full) and <code>delete(k)</code> (marks the cell DELETED — slide 25).</p>
<p class="nhan">Data → expected result</p>
<table>
<thead><tr><th>Step</th><th>Cells 0 1 2 3 4</th><th>Result</th></tr></thead>
<tbody>
<tr><td>insert 22, 33, 44</td><td>22 33 44 _ _</td><td>all hash to 0 → cells 0, 1, 2</td></tr>
<tr><td>insert 13</td><td>22 33 44 13 _</td><td>13 mod 11 = 2 is taken → cell 3</td></tr>
<tr><td>delete 33</td><td>22 # 44 13 _</td><td>cell 1 marked DELETED</td></tr>
<tr><td>search 44</td><td>22 # 44 13 _</td><td>0, 1 (# → go on), 2 → found in cell 2</td></tr>
<tr><td>search 55</td><td>22 # 44 13 _</td><td>0, 1 #, 2, 3, 4 empty → −1</td></tr>
<tr><td>insert 55</td><td>22 55 44 13 _</td><td>not in the table → first # on its path: cell 1</td></tr>
</tbody>
</table>
<p class="nhan">Idea</p>
<p><code>search</code> skips DELETED cells and stops at an EMPTY one or after m probes. <code>insert</code> calls <code>search</code> first (no duplicates), then takes the first cell from h(k) that is not FULL — EMPTY or DELETED. <code>delete</code> = <code>search</code> + mark. All three are O(1) on average at a low load factor and O(m) in the worst case.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class LinearTable {
    static final int EMPTY = 0, FULL = 1, DELETED = 2;
    int m;
    int[] key;
    int[] state;                                         // all EMPTY at the start
    int size = 0;

    LinearTable(int m) { this.m = m; key = new int[m]; state = new int[m]; }

    int h(int k) { return Math.floorMod(k, m); }

    // f1: index of k, or -1: skip DELETED cells, stop at an EMPTY one
    int search(int k) {
        for (int i = 0, j = h(k); i &lt; m; i++, j = (j + 1) % m) {
            if (state[j] == EMPTY) return -1;
            if (state[j] == FULL &amp;&amp; key[j] == k) return j;
        }
        return -1;                                       // m cells probed
    }

    // f2: insert k; returns its cell (the old cell if already there), -1 if the table is full
    int insert(int k) {
        int found = search(k);
        if (found &gt;= 0) return found;                    // no duplicates
        for (int i = 0, j = h(k); i &lt; m; i++, j = (j + 1) % m)
            if (state[j] != FULL) {                      // EMPTY or DELETED: both can be reused
                key[j] = k; state[j] = FULL; size++;
                return j;
            }
        return -1;
    }

    // f3: delete k by MARKING its cell
    boolean delete(int k) {
        int j = search(k);
        if (j &lt; 0) return false;
        state[j] = DELETED; size--;
        return true;
    }
}

public class Pe5LinearProbing {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        LinearTable t = new LinearTable(11);
        check("22, 33, 44 all hash to 0 -&gt; cells 0 1 2", t.insert(22) + " " + t.insert(33) + " " + t.insert(44), "0 1 2");
        check("13 hashes to 2 (taken) -&gt; cell 3", "" + t.insert(13), "3");
        check("search 44 -&gt; cell 2", "" + t.search(44), "2");
        check("delete 33 -&gt; true, size 3", t.delete(33) + " " + t.size, "true 3");
        check("search 44 walks past the mark in cell 1", "" + t.search(44), "2");
        check("search 55: 0, 1(#), 2, 3, 4 empty -&gt; -1", "" + t.search(55), "-1");
        check("insert 55 reuses the marked cell 1", "" + t.insert(55), "1");
        check("insert 44 again: no duplicate, same cell", t.insert(44) + " " + t.size, "2 4");
        check("delete a missing key -&gt; false", "" + t.delete(99), "false");
        LinearTable full = new LinearTable(3);
        check("full table: insert -&gt; -1, search stops after m probes", full.insert(1) + " " + full.insert(2) + " " + full.insert(3) + " " + full.insert(4) + " " + full.search(7), "1 2 0 -1 -1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 22, 33, 44 all hash to 0 -&gt; cells 0 1 2<br>
PASS 13 hashes to 2 (taken) -&gt; cell 3<br>
PASS search 44 -&gt; cell 2<br>
PASS delete 33 -&gt; true, size 3<br>
PASS search 44 walks past the mark in cell 1<br>
PASS search 55: 0, 1(#), 2, 3, 4 empty -&gt; -1<br>
PASS insert 55 reuses the marked cell 1<br>
PASS insert 44 again: no duplicate, same cell<br>
PASS delete a missing key -&gt; false<br>
PASS full table: insert -&gt; -1, search stops after m probes<br>
ALL TESTS PASSED</div>
<div class="pitfall">An <code>insert</code> without the <code>search</code> first puts a second copy of a key into a DELETED cell in front of it — test "insert 44 again" catches it. A <code>search</code> that stops at DELETED as if it were EMPTY loses every key stored behind the mark — the exact error of slide 25.</div>`,
    `<h3>🧪 Bài 5 — f1–f3: bảng dò tuyến tính có đánh dấu xoá (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Bảng chứa khoá <code>int</code> với m = 11 ô, h(k) = k mod 11, dò tuyến tính (linear probing). Mỗi ô có một trạng thái: EMPTY (trống), FULL (có khoá) hoặc DELETED (đã xoá). Viết <code>search(k)</code> (ô chứa k, hoặc −1), <code>insert(k)</code> (trả về ô; không chèn trùng; −1 nếu bảng đầy) và <code>delete(k)</code> (đánh dấu ô là DELETED — slide 25).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<table>
<thead><tr><th>Bước</th><th>Ô 0 1 2 3 4</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>chèn 22, 33, 44</td><td>22 33 44 _ _</td><td>đều băm vào 0 → ô 0, 1, 2</td></tr>
<tr><td>chèn 13</td><td>22 33 44 13 _</td><td>13 mod 11 = 2 đã có người → ô 3</td></tr>
<tr><td>xoá 33</td><td>22 # 44 13 _</td><td>ô 1 bị đánh dấu DELETED</td></tr>
<tr><td>tìm 44</td><td>22 # 44 13 _</td><td>0, 1 (# → đi tiếp), 2 → thấy ở ô 2</td></tr>
<tr><td>tìm 55</td><td>22 # 44 13 _</td><td>0, 1 #, 2, 3, 4 trống → −1</td></tr>
<tr><td>chèn 55</td><td>22 55 44 13 _</td><td>chưa có trong bảng → ô # đầu tiên trên đường dò: ô 1</td></tr>
</tbody>
</table>
<p class="nhan">Ý tưởng</p>
<p><code>search</code> đi qua ô DELETED, dừng ở ô EMPTY hoặc sau m lần dò. <code>insert</code> gọi <code>search</code> trước (không chèn trùng), rồi lấy ô đầu tiên tính từ h(k) mà không FULL — EMPTY hay DELETED đều được. <code>delete</code> = <code>search</code> + đánh dấu. Cả ba đều O(1) trung bình khi hệ số tải (load factor) thấp và O(m) trong trường hợp xấu nhất.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class LinearTable {
    static final int EMPTY = 0, FULL = 1, DELETED = 2;
    int m;
    int[] key;
    int[] state;                                         // ban đầu toàn EMPTY
    int size = 0;

    LinearTable(int m) { this.m = m; key = new int[m]; state = new int[m]; }

    int h(int k) { return Math.floorMod(k, m); }

    // f1: chỉ số của k, hoặc -1: đi qua ô DELETED, dừng ở ô EMPTY
    int search(int k) {
        for (int i = 0, j = h(k); i &lt; m; i++, j = (j + 1) % m) {
            if (state[j] == EMPTY) return -1;
            if (state[j] == FULL &amp;&amp; key[j] == k) return j;
        }
        return -1;                                       // đã dò đủ m ô
    }

    // f2: chèn k; trả ô của nó (ô cũ nếu đã có), -1 nếu bảng đầy
    int insert(int k) {
        int found = search(k);
        if (found &gt;= 0) return found;                    // không chèn trùng
        for (int i = 0, j = h(k); i &lt; m; i++, j = (j + 1) % m)
            if (state[j] != FULL) {                      // EMPTY hoặc DELETED: đều dùng lại được
                key[j] = k; state[j] = FULL; size++;
                return j;
            }
        return -1;
    }

    // f3: xoá k bằng cách ĐÁNH DẤU ô của nó
    boolean delete(int k) {
        int j = search(k);
        if (j &lt; 0) return false;
        state[j] = DELETED; size--;
        return true;
    }
}

public class Pe5LinearProbing {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        LinearTable t = new LinearTable(11);
        check("22, 33, 44 all hash to 0 -&gt; cells 0 1 2", t.insert(22) + " " + t.insert(33) + " " + t.insert(44), "0 1 2");
        check("13 hashes to 2 (taken) -&gt; cell 3", "" + t.insert(13), "3");
        check("search 44 -&gt; cell 2", "" + t.search(44), "2");
        check("delete 33 -&gt; true, size 3", t.delete(33) + " " + t.size, "true 3");
        check("search 44 walks past the mark in cell 1", "" + t.search(44), "2");
        check("search 55: 0, 1(#), 2, 3, 4 empty -&gt; -1", "" + t.search(55), "-1");
        check("insert 55 reuses the marked cell 1", "" + t.insert(55), "1");
        check("insert 44 again: no duplicate, same cell", t.insert(44) + " " + t.size, "2 4");
        check("delete a missing key -&gt; false", "" + t.delete(99), "false");
        LinearTable full = new LinearTable(3);
        check("full table: insert -&gt; -1, search stops after m probes", full.insert(1) + " " + full.insert(2) + " " + full.insert(3) + " " + full.insert(4) + " " + full.search(7), "1 2 0 -1 -1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 22, 33, 44 all hash to 0 -&gt; cells 0 1 2<br>
PASS 13 hashes to 2 (taken) -&gt; cell 3<br>
PASS search 44 -&gt; cell 2<br>
PASS delete 33 -&gt; true, size 3<br>
PASS search 44 walks past the mark in cell 1<br>
PASS search 55: 0, 1(#), 2, 3, 4 empty -&gt; -1<br>
PASS insert 55 reuses the marked cell 1<br>
PASS insert 44 again: no duplicate, same cell<br>
PASS delete a missing key -&gt; false<br>
PASS full table: insert -&gt; -1, search stops after m probes<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>insert</code> không gọi <code>search</code> trước sẽ đặt bản sao thứ hai của một khoá vào ô DELETED đứng trước nó — test "insert 44 again" bắt đúng lỗi này. <code>search</code> dừng ở ô DELETED như thể ô trống sẽ làm mất mọi khoá nằm sau dấu xoá — đúng lỗi của slide 25.</div>`),
    bi(`<h3>🧪 Exercise 6 — quadratic probing with Car(plate, owner) (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>Store <code>Car(plate, owner)</code> objects by plate in a table of m cells, h = plate mod m, trying the cells (h + i²) mod m for i = 0, 1, …, m − 1. <code>insert(car)</code> returns the cell or −1; <code>search(plate)</code> returns the owner or null.</p>
<p class="nhan">Data → expected result</p>
<p>m = 10: plates 89 18 49 58 69 → cells <strong>9 8 0 2 3</strong> (slide 19). m = 11: six plates with home 3 (3, 14, 25, 36, 47, 58) → <strong>3 4 7 1 8 6</strong> (slide 20); a seventh plate with home 3 → <strong>−1</strong>. m = 16: after plates 16, 1, 4, 9 the plate 32 (home 0) → <strong>−1</strong> although 12 cells are free.</p>
<p class="nhan">Idea</p>
<p>compute every probe from the home cell: <code>(h + i * i) % m</code>, and give up after m tries. <code>search</code> follows the same sequence and stops at its first empty cell. O(1) on average while the table is at most half full and m is prime (the theorem of slide 20); with other sizes, some cells are simply unreachable.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Car {
    int plate;                                           // the key
    String owner;

    Car(int plate, String owner) { this.plate = plate; this.owner = owner; }
}

class QuadTable {
    Car[] t;

    QuadTable(int m) { t = new Car[m]; }

    // f1: try (h + i*i) % m for i = 0, 1, ..., m - 1; returns the cell, or -1
    int insert(Car c) {
        int m = t.length, h = c.plate % m;
        for (int i = 0; i &lt; m; i++) {
            int j = (h + i * i) % m;                     // always from the HOME cell h
            if (t[j] == null) { t[j] = c; return j; }
        }
        return -1;                                       // may fail while cells are still free
    }

    // f2: the owner of a plate, or null; stop at the first empty cell of the sequence
    String search(int plate) {
        int m = t.length, h = plate % m;
        for (int i = 0; i &lt; m; i++) {
            Car c = t[(h + i * i) % m];
            if (c == null) return null;
            if (c.plate == plate) return c.owner;
        }
        return null;
    }
}

public class Pe6QuadraticCars {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String insertAll(QuadTable q, int[] plates) {
        StringBuilder s = new StringBuilder();
        for (int p : plates) s.append(q.insert(new Car(p, "O" + p))).append(' ');
        return s.toString().trim();
    }

    public static void main(String[] args) {
        QuadTable a = new QuadTable(10);
        check("slide 19: 89 18 49 58 69 -&gt; 9 8 0 2 3", insertAll(a, new int[] {89, 18, 49, 58, 69}), "9 8 0 2 3");
        check("search 58 -&gt; its owner", a.search(58), "O58");
        check("search 39: 9, 0, 3, 8, 5 empty -&gt; null", "" + a.search(39), "null");
        QuadTable b = new QuadTable(11);
        check("slide 20: six keys with home 3 -&gt; 3 4 7 1 8 6", insertAll(b, new int[] {3, 14, 25, 36, 47, 58}), "3 4 7 1 8 6");
        check("7th key with home 3: no reachable cell -&gt; -1", "" + b.insert(new Car(69, "X")), "-1");
        QuadTable c = new QuadTable(16);
        insertAll(c, new int[] {16, 1, 4, 9});
        check("m = 16: home 0 reaches only 0 1 4 9 -&gt; -1 with 12 free cells", "" + c.insert(new Car(32, "Y")), "-1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slide 19: 89 18 49 58 69 -&gt; 9 8 0 2 3<br>
PASS search 58 -&gt; its owner<br>
PASS search 39: 9, 0, 3, 8, 5 empty -&gt; null<br>
PASS slide 20: six keys with home 3 -&gt; 3 4 7 1 8 6<br>
PASS 7th key with home 3: no reachable cell -&gt; -1<br>
PASS m = 16: home 0 reaches only 0 1 4 9 -&gt; -1 with 12 free cells<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>j = (j + i * i) % m</code> — adding i² to the <em>previous</em> probe — sends 58 to cell 3 instead of 2, and the first test fails. And never write <code>while (t[j] != null)</code> without a limit on the number of probes: tests 5 and 6 show quadratic probing failing while free cells exist, so such a loop would run forever.</div>`,
    `<h3>🧪 Bài 6 — dò bậc hai với Car(plate, owner) (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Cất các đối tượng <code>Car(plate, owner)</code> (biển số, chủ xe) theo biển số vào một bảng m ô, h = plate mod m, thử lần lượt các ô (h + i²) mod m với i = 0, 1, …, m − 1. <code>insert(car)</code> trả về ô hoặc −1; <code>search(plate)</code> trả về tên chủ xe hoặc null.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>m = 10: biển số 89 18 49 58 69 → các ô <strong>9 8 0 2 3</strong> (slide 19). m = 11: sáu biển số có ô nhà 3 (3, 14, 25, 36, 47, 58) → <strong>3 4 7 1 8 6</strong> (slide 20); biển số thứ bảy có ô nhà 3 → <strong>−1</strong>. m = 16: sau các biển 16, 1, 4, 9, biển 32 (ô nhà 0) → <strong>−1</strong> dù còn 12 ô trống.</p>
<p class="nhan">Ý tưởng</p>
<p>tính mọi lần dò từ ô nhà (home cell): <code>(h + i * i) % m</code>, và bỏ cuộc sau m lần thử. <code>search</code> đi theo đúng dãy đó và dừng ở ô trống đầu tiên của dãy. O(1) trung bình khi bảng đầy không quá một nửa và m nguyên tố (định lý ở slide 20); với kích thước khác, có những ô đơn giản là không bao giờ với tới.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Car {
    int plate;                                           // khoá
    String owner;

    Car(int plate, String owner) { this.plate = plate; this.owner = owner; }
}

class QuadTable {
    Car[] t;

    QuadTable(int m) { t = new Car[m]; }

    // f1: thử (h + i*i) % m với i = 0, 1, ..., m - 1; trả về ô, hoặc -1
    int insert(Car c) {
        int m = t.length, h = c.plate % m;
        for (int i = 0; i &lt; m; i++) {
            int j = (h + i * i) % m;                     // luôn tính từ ô NHÀ h
            if (t[j] == null) { t[j] = c; return j; }
        }
        return -1;                                       // có thể thất bại dù vẫn còn ô trống
    }

    // f2: chủ của biển số, hoặc null; dừng ở ô trống đầu tiên của dãy dò
    String search(int plate) {
        int m = t.length, h = plate % m;
        for (int i = 0; i &lt; m; i++) {
            Car c = t[(h + i * i) % m];
            if (c == null) return null;
            if (c.plate == plate) return c.owner;
        }
        return null;
    }
}

public class Pe6QuadraticCars {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String insertAll(QuadTable q, int[] plates) {
        StringBuilder s = new StringBuilder();
        for (int p : plates) s.append(q.insert(new Car(p, "O" + p))).append(' ');
        return s.toString().trim();
    }

    public static void main(String[] args) {
        QuadTable a = new QuadTable(10);
        check("slide 19: 89 18 49 58 69 -&gt; 9 8 0 2 3", insertAll(a, new int[] {89, 18, 49, 58, 69}), "9 8 0 2 3");
        check("search 58 -&gt; its owner", a.search(58), "O58");
        check("search 39: 9, 0, 3, 8, 5 empty -&gt; null", "" + a.search(39), "null");
        QuadTable b = new QuadTable(11);
        check("slide 20: six keys with home 3 -&gt; 3 4 7 1 8 6", insertAll(b, new int[] {3, 14, 25, 36, 47, 58}), "3 4 7 1 8 6");
        check("7th key with home 3: no reachable cell -&gt; -1", "" + b.insert(new Car(69, "X")), "-1");
        QuadTable c = new QuadTable(16);
        insertAll(c, new int[] {16, 1, 4, 9});
        check("m = 16: home 0 reaches only 0 1 4 9 -&gt; -1 with 12 free cells", "" + c.insert(new Car(32, "Y")), "-1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slide 19: 89 18 49 58 69 -&gt; 9 8 0 2 3<br>
PASS search 58 -&gt; its owner<br>
PASS search 39: 9, 0, 3, 8, 5 empty -&gt; null<br>
PASS slide 20: six keys with home 3 -&gt; 3 4 7 1 8 6<br>
PASS 7th key with home 3: no reachable cell -&gt; -1<br>
PASS m = 16: home 0 reaches only 0 1 4 9 -&gt; -1 with 12 free cells<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>j = (j + i * i) % m</code> — cộng i² vào lần dò <em>trước đó</em> — đưa 58 vào ô 3 thay vì ô 2, và test đầu tiên hỏng. Và đừng bao giờ viết <code>while (t[j] != null)</code> mà không giới hạn số lần dò: test 5 và 6 cho thấy dò bậc hai thất bại trong khi vẫn còn ô trống, nên vòng lặp như vậy sẽ chạy mãi.</div>`),
    bi(`<h3>🧪 Exercise 7 — f1–f4: a book catalogue with separate chaining and rehashing (close to a real PE · ~25 min)</h3>
<p class="nhan">Task</p>
<p><code>Book(title, price)</code> objects live in a chained hash table keyed by title, starting with M = 5 cells. f1 <code>put(book)</code>: add the book, or update the price if the title is already there; after adding, if n / M &gt; 0.75, rehash into 2M + 1 cells. f2 <code>get(title)</code>: the price, or −1. f3 <code>remove(title)</code>. f4 a check: the number of nodes in all chains equals n.</p>
<p class="nhan">Data → expected result</p>
<p>3 books → still <strong>5</strong> cells (load 0.6); the 4th → 0.8 &gt; 0.75 → <strong>11</strong> cells; the 9th → 9/11 ≈ 0.82 → <strong>23</strong> cells; <code>put("DSA", 25)</code> on an existing title → price 25, size unchanged; <code>remove("Web")</code> → true, then <code>get("Web")</code> → −1.</p>
<p class="nhan">Idea</p>
<p>one method <code>hash(title, m) = Math.floorMod(title.hashCode(), m)</code> used by every other method. <code>put</code> searches the chain first. <code>rehash</code> allocates the new array and re-inserts every book with the <em>new</em> m, because the index depends on m. put, get and remove cost O(1 + α) on average; one rehash costs O(n), but since the table roughly doubles, it is O(1) per put amortized.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">class Book {
    String title;                                        // the key
    int price;

    Book(String title, int price) { this.title = title; this.price = price; }
}

class Node {
    Book info;
    Node next;

    Node(Book x, Node p) { info = x; next = p; }
}

class BookTable {
    Node[] table = new Node[5];
    int n = 0;

    int hash(String title, int m) { return Math.floorMod(title.hashCode(), m); }   // ONE hash method, used everywhere

    // f1: add a book, or update the price of an existing title; rehash when n / M &gt; 0.75
    void put(Book b) {
        int i = hash(b.title, table.length);
        for (Node p = table[i]; p != null; p = p.next)
            if (p.info.title.equals(b.title)) { p.info.price = b.price; return; }   // same key: no new node
        table[i] = new Node(b, table[i]);
        n++;
        if ((double) n / table.length &gt; 0.75) rehash();
    }

    void rehash() {                                      // new capacity 2M + 1; every book is hashed again
        Node[] old = table;
        table = new Node[2 * old.length + 1];
        for (Node head : old)
            for (Node p = head; p != null; p = p.next) {
                int i = hash(p.info.title, table.length);
                table[i] = new Node(p.info, table[i]);
            }
    }

    // f2: price of a title, -1 if absent
    int get(String title) {
        for (Node p = table[hash(title, table.length)]; p != null; p = p.next) if (p.info.title.equals(title)) return p.info.price;
        return -1;
    }

    // f3: remove a title from its chain
    boolean remove(String title) {
        int i = hash(title, table.length);
        for (Node p = table[i], f = null; p != null; f = p, p = p.next)
            if (p.info.title.equals(title)) {
                if (f == null) table[i] = p.next; else f.next = p.next;
                n--;
                return true;
            }
        return false;
    }

    int countNodes() { int c = 0; for (Node h : table) for (Node p = h; p != null; p = p.next) c++; return c; }
}

public class Pe7BookChaining {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        BookTable t = new BookTable();
        String[] titles = {"Java", "DSA", "OOP", "SQL", "Web", "AI", "Git", "Net", "Linux"};
        for (int i = 0; i &lt; 3; i++) t.put(new Book(titles[i], 10 * (i + 1)));
        check("3 books in 5 cells: load 0.6, no rehash", t.n + " " + t.table.length, "3 5");
        t.put(new Book(titles[3], 40));
        check("4th book: load 0.8 &gt; 0.75 -&gt; 11 cells", t.n + " " + t.table.length, "4 11");
        check("all 4 still found after rehash", t.get("Java") + " " + t.get("DSA") + " " + t.get("OOP") + " " + t.get("SQL"), "10 20 30 40");
        t.put(new Book("DSA", 25));
        check("same title: price updated, size unchanged", t.get("DSA") + " " + t.n, "25 4");
        for (int i = 4; i &lt; 9; i++) t.put(new Book(titles[i], 50 + i));
        check("9th book: 9/11 &gt; 0.75 -&gt; 23 cells", t.n + " " + t.table.length, "9 23");
        check("remove Web -&gt; true, get -&gt; -1, size 8", t.remove("Web") + " " + t.get("Web") + " " + t.n, "true -1 8");
        check("remove a missing title -&gt; false", "" + t.remove("C++"), "false");
        check("nodes in all chains == size", "" + t.countNodes(), "" + t.n);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 3 books in 5 cells: load 0.6, no rehash<br>
PASS 4th book: load 0.8 &gt; 0.75 -&gt; 11 cells<br>
PASS all 4 still found after rehash<br>
PASS same title: price updated, size unchanged<br>
PASS 9th book: 9/11 &gt; 0.75 -&gt; 23 cells<br>
PASS remove Web -&gt; true, get -&gt; -1, size 8<br>
PASS remove a missing title -&gt; false<br>
PASS nodes in all chains == size<br>
ALL TESTS PASSED</div>
<div class="pitfall">Two rehash bugs worth marks: copying <code>old[i]</code> into <code>table[i]</code> instead of hashing every key again (the index depends on M, so <code>get</code> then searches the wrong chain), and testing <code>n / table.length &gt; 0.75</code> with two <code>int</code>s — integer division gives 0, so the table never grows. Cast to <code>double</code>.</div>`,
    `<h3>🧪 Bài 7 — f1–f4: danh mục sách với dây chuyền tách biệt và băm lại (gần đề PE thật · ~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Các đối tượng <code>Book(title, price)</code> (tựa sách, giá) nằm trong một bảng băm dây chuyền (chaining) theo khoá là tựa sách, ban đầu có M = 5 ô. f1 <code>put(book)</code>: thêm sách, hoặc cập nhật giá nếu tựa đã có; sau khi thêm, nếu n / M &gt; 0,75 thì băm lại (rehash) sang 2M + 1 ô. f2 <code>get(title)</code>: trả giá, hoặc −1. f3 <code>remove(title)</code>. f4 kiểm tra: tổng số nút của mọi dây bằng n.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>3 cuốn → vẫn <strong>5</strong> ô (hệ số tải 0,6); cuốn thứ 4 → 0,8 &gt; 0,75 → <strong>11</strong> ô; cuốn thứ 9 → 9/11 ≈ 0,82 → <strong>23</strong> ô; <code>put("DSA", 25)</code> với tựa đã có → giá 25, kích thước không đổi; <code>remove("Web")</code> → true, sau đó <code>get("Web")</code> → −1.</p>
<p class="nhan">Ý tưởng</p>
<p>một hàm duy nhất <code>hash(title, m) = Math.floorMod(title.hashCode(), m)</code>, mọi hàm khác đều gọi nó. <code>put</code> tìm trong dây trước. <code>rehash</code> cấp mảng mới rồi chèn lại từng cuốn sách với m <em>mới</em>, vì chỉ số phụ thuộc vào m. put, get, remove tốn O(1 + α) trung bình (α là hệ số tải); một lần rehash tốn O(n), nhưng vì bảng gần như nhân đôi nên tính khấu hao (amortized) chỉ O(1) mỗi lần put.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">class Book {
    String title;                                        // khoá
    int price;

    Book(String title, int price) { this.title = title; this.price = price; }
}

class Node {
    Book info;
    Node next;

    Node(Book x, Node p) { info = x; next = p; }
}

class BookTable {
    Node[] table = new Node[5];
    int n = 0;

    int hash(String title, int m) { return Math.floorMod(title.hashCode(), m); }   // MỘT hàm băm, dùng ở mọi chỗ

    // f1: thêm sách, hoặc cập nhật giá nếu tựa đã có; băm lại khi n / M &gt; 0.75
    void put(Book b) {
        int i = hash(b.title, table.length);
        for (Node p = table[i]; p != null; p = p.next)
            if (p.info.title.equals(b.title)) { p.info.price = b.price; return; }   // trùng khoá: không thêm nút
        table[i] = new Node(b, table[i]);
        n++;
        if ((double) n / table.length &gt; 0.75) rehash();
    }

    void rehash() {                                      // sức chứa mới 2M + 1; mọi cuốn sách được băm lại
        Node[] old = table;
        table = new Node[2 * old.length + 1];
        for (Node head : old)
            for (Node p = head; p != null; p = p.next) {
                int i = hash(p.info.title, table.length);
                table[i] = new Node(p.info, table[i]);
            }
    }

    // f2: giá của một tựa sách, -1 nếu không có
    int get(String title) {
        for (Node p = table[hash(title, table.length)]; p != null; p = p.next) if (p.info.title.equals(title)) return p.info.price;
        return -1;
    }

    // f3: xoá một tựa sách khỏi dây của nó
    boolean remove(String title) {
        int i = hash(title, table.length);
        for (Node p = table[i], f = null; p != null; f = p, p = p.next)
            if (p.info.title.equals(title)) {
                if (f == null) table[i] = p.next; else f.next = p.next;
                n--;
                return true;
            }
        return false;
    }

    int countNodes() { int c = 0; for (Node h : table) for (Node p = h; p != null; p = p.next) c++; return c; }
}

public class Pe7BookChaining {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        BookTable t = new BookTable();
        String[] titles = {"Java", "DSA", "OOP", "SQL", "Web", "AI", "Git", "Net", "Linux"};
        for (int i = 0; i &lt; 3; i++) t.put(new Book(titles[i], 10 * (i + 1)));
        check("3 books in 5 cells: load 0.6, no rehash", t.n + " " + t.table.length, "3 5");
        t.put(new Book(titles[3], 40));
        check("4th book: load 0.8 &gt; 0.75 -&gt; 11 cells", t.n + " " + t.table.length, "4 11");
        check("all 4 still found after rehash", t.get("Java") + " " + t.get("DSA") + " " + t.get("OOP") + " " + t.get("SQL"), "10 20 30 40");
        t.put(new Book("DSA", 25));
        check("same title: price updated, size unchanged", t.get("DSA") + " " + t.n, "25 4");
        for (int i = 4; i &lt; 9; i++) t.put(new Book(titles[i], 50 + i));
        check("9th book: 9/11 &gt; 0.75 -&gt; 23 cells", t.n + " " + t.table.length, "9 23");
        check("remove Web -&gt; true, get -&gt; -1, size 8", t.remove("Web") + " " + t.get("Web") + " " + t.n, "true -1 8");
        check("remove a missing title -&gt; false", "" + t.remove("C++"), "false");
        check("nodes in all chains == size", "" + t.countNodes(), "" + t.n);
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS 3 books in 5 cells: load 0.6, no rehash<br>
PASS 4th book: load 0.8 &gt; 0.75 -&gt; 11 cells<br>
PASS all 4 still found after rehash<br>
PASS same title: price updated, size unchanged<br>
PASS 9th book: 9/11 &gt; 0.75 -&gt; 23 cells<br>
PASS remove Web -&gt; true, get -&gt; -1, size 8<br>
PASS remove a missing title -&gt; false<br>
PASS nodes in all chains == size<br>
ALL TESTS PASSED</div>
<div class="pitfall">Hai lỗi rehash dễ mất điểm: chép <code>old[i]</code> sang <code>table[i]</code> thay vì băm lại từng khoá (chỉ số phụ thuộc M, nên sau đó <code>get</code> tìm nhầm dây), và kiểm tra <code>n / table.length &gt; 0.75</code> với hai số <code>int</code> — phép chia nguyên ra 0, nên bảng không bao giờ nới rộng. Hãy ép sang <code>double</code>.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>hashing</strong></td><td>băm</td><td>Storing each item in an array at an index computed from its key.</td></tr>
<tr><td><strong>hash table</strong></td><td>bảng băm</td><td>An array of M cells together with a hash function and a collision strategy.</td></tr>
<tr><td><strong>key</strong></td><td>khoá</td><td>The field that identifies an item and is fed to the hash function.</td></tr>
<tr><td><strong>hash function</strong></td><td>hàm băm</td><td>Maps a key to an index in 0 … M − 1; it should be fast and spread keys evenly.</td></tr>
<tr><td><strong>hash code</strong></td><td>mã băm</td><td>The integer computed from a key before it is reduced to an index; it may be negative.</td></tr>
<tr><td><strong>collision</strong></td><td>va chạm</td><td>Two different keys mapped to the same cell.</td></tr>
<tr><td><strong>load factor</strong></td><td>hệ số tải</td><td>α = n / M: the number of items divided by the number of cells.</td></tr>
<tr><td><strong>uniform hash function</strong></td><td>hàm băm đều</td><td>A random key lands in every cell with the same probability 1/M.</td></tr>
<tr><td><strong>division method</strong></td><td>phương pháp chia lấy dư</td><td>h(x) = x % M, best with a prime M.</td></tr>
<tr><td><strong>folding</strong></td><td>gấp số</td><td>Cut the key into parts and add them; boundary folding reverses every other part.</td></tr>
<tr><td><strong>mid-square</strong></td><td>bình phương lấy giữa</td><td>Square the key and keep the middle digits.</td></tr>
<tr><td><strong>extraction</strong></td><td>trích chữ số</td><td>Use only some digits of the key.</td></tr>
<tr><td><strong>radix transformation</strong></td><td>đổi cơ số</td><td>Write the key in another base and read its digits as a number.</td></tr>
<tr><td><strong>open addressing</strong></td><td>địa chỉ mở</td><td>A colliding key is placed in another free cell of the same array.</td></tr>
<tr><td><strong>probe (probe sequence)</strong></td><td>lần dò (dãy dò)</td><td>One cell tried for a key; the sequence is the order in which cells are tried.</td></tr>
<tr><td><strong>linear probing</strong></td><td>dò tuyến tính</td><td>Try (h + i) mod M; it suffers from primary clustering.</td></tr>
<tr><td><strong>quadratic probing</strong></td><td>dò bậc hai</td><td>Try (h + i²) mod M; with a prime M it reaches (M + 1)/2 cells.</td></tr>
<tr><td><strong>primary clustering</strong></td><td>vón cục sơ cấp</td><td>Runs of occupied cells merge, and every key hashing into a run must walk to its end.</td></tr>
<tr><td><strong>separate chaining</strong></td><td>dây chuyền tách biệt</td><td>Each cell holds a linked list of the keys hashed to it; the array is a scatter table.</td></tr>
<tr><td><strong>coalesced hashing</strong></td><td>băm gộp dây</td><td>A colliding key goes to the last free cell and is linked by index; chains may merge.</td></tr>
<tr><td><strong>bucket</strong></td><td>thùng (bucket)</td><td>A block of several slots at one address; a cellar or overflow area takes what does not fit.</td></tr>
<tr><td><strong>tombstone (deleted mark)</strong></td><td>dấu "đã xoá"</td><td>Marks a deleted cell so that searches go on past it and insertions may reuse it.</td></tr>
<tr><td><strong>rehashing</strong></td><td>băm lại</td><td>Building a bigger table and inserting every key again with the new size.</td></tr>
<tr><td><strong>perfect hash function</strong></td><td>hàm băm hoàn hảo</td><td>No collision for a fixed, known key set; minimal if it also leaves no empty cell.</td></tr>
<tr><td><strong>extendible hashing</strong></td><td>băm mở rộng</td><td>A directory indexed by a prefix of the hash value; full buckets split, the directory doubles.</td></tr>
<tr><td><strong>equals/hashCode contract</strong></td><td>giao ước equals/hashCode</td><td>Objects that are equal must have equal hash codes, or HashMap and HashSet misbehave.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>hashing</strong></td><td>băm</td><td>Cất mỗi phần tử vào mảng tại chỉ số tính ra từ khoá của nó.</td></tr>
<tr><td><strong>hash table</strong></td><td>bảng băm</td><td>Một mảng M ô cùng với một hàm băm và một chiến lược xử lý va chạm.</td></tr>
<tr><td><strong>key</strong></td><td>khoá</td><td>Trường dùng để nhận diện phần tử và được đưa vào hàm băm.</td></tr>
<tr><td><strong>hash function</strong></td><td>hàm băm</td><td>Ánh xạ khoá thành chỉ số trong 0 … M − 1; phải tính nhanh và rải khoá đều.</td></tr>
<tr><td><strong>hash code</strong></td><td>mã băm</td><td>Số nguyên tính từ khoá trước khi thu về chỉ số; có thể âm.</td></tr>
<tr><td><strong>collision</strong></td><td>va chạm</td><td>Hai khoá khác nhau bị ánh xạ vào cùng một ô.</td></tr>
<tr><td><strong>load factor</strong></td><td>hệ số tải</td><td>α = n / M: số phần tử chia cho số ô.</td></tr>
<tr><td><strong>uniform hash function</strong></td><td>hàm băm đều</td><td>Một khoá ngẫu nhiên rơi vào mỗi ô với cùng xác suất 1/M.</td></tr>
<tr><td><strong>division method</strong></td><td>phương pháp chia lấy dư</td><td>h(x) = x % M, tốt nhất khi M là số nguyên tố.</td></tr>
<tr><td><strong>folding</strong></td><td>gấp số</td><td>Cắt khoá thành các phần rồi cộng lại; gấp biên đảo ngược các phần xen kẽ.</td></tr>
<tr><td><strong>mid-square</strong></td><td>bình phương lấy giữa</td><td>Bình phương khoá rồi giữ các chữ số ở giữa.</td></tr>
<tr><td><strong>extraction</strong></td><td>trích chữ số</td><td>Chỉ dùng một vài chữ số của khoá.</td></tr>
<tr><td><strong>radix transformation</strong></td><td>đổi cơ số</td><td>Viết khoá ở hệ cơ số khác rồi đọc các chữ số như một số.</td></tr>
<tr><td><strong>open addressing</strong></td><td>địa chỉ mở</td><td>Khoá va chạm được đặt vào một ô trống khác của chính mảng đó.</td></tr>
<tr><td><strong>probe (probe sequence)</strong></td><td>lần dò (dãy dò)</td><td>Một ô được thử cho một khoá; dãy dò là thứ tự các ô được thử.</td></tr>
<tr><td><strong>linear probing</strong></td><td>dò tuyến tính</td><td>Thử (h + i) mod M; bị vón cục sơ cấp.</td></tr>
<tr><td><strong>quadratic probing</strong></td><td>dò bậc hai</td><td>Thử (h + i²) mod M; với M nguyên tố chỉ với tới (M + 1)/2 ô.</td></tr>
<tr><td><strong>primary clustering</strong></td><td>vón cục sơ cấp</td><td>Các dãy ô có người dính vào nhau, khoá nào băm vào cụm cũng phải đi tới cuối cụm.</td></tr>
<tr><td><strong>separate chaining</strong></td><td>dây chuyền tách biệt</td><td>Mỗi ô giữ một danh sách liên kết các khoá băm vào nó; mảng đó là bảng phân tán.</td></tr>
<tr><td><strong>coalesced hashing</strong></td><td>băm gộp dây</td><td>Khoá va chạm vào ô trống cuối cùng và được nối bằng chỉ số; các dây có thể nhập vào nhau.</td></tr>
<tr><td><strong>bucket</strong></td><td>thùng (bucket)</td><td>Một khối nhiều chỗ tại một địa chỉ; vùng hầm hay vùng tràn nhận phần không vừa.</td></tr>
<tr><td><strong>tombstone (deleted mark)</strong></td><td>dấu "đã xoá"</td><td>Đánh dấu ô đã xoá để phép tìm vẫn đi tiếp qua nó và phép chèn được dùng lại.</td></tr>
<tr><td><strong>rehashing</strong></td><td>băm lại</td><td>Dựng bảng lớn hơn rồi chèn lại mọi khoá theo kích thước mới.</td></tr>
<tr><td><strong>perfect hash function</strong></td><td>hàm băm hoàn hảo</td><td>Không va chạm với một tập khoá cố định, biết trước; tối thiểu nếu còn không để ô trống.</td></tr>
<tr><td><strong>extendible hashing</strong></td><td>băm mở rộng</td><td>Thư mục đánh chỉ số bằng tiền tố của giá trị băm; bucket đầy thì tách, thư mục nhân đôi.</td></tr>
<tr><td><strong>equals/hashCode contract</strong></td><td>giao ước equals/hashCode</td><td>Hai đối tượng bằng nhau phải có mã băm bằng nhau, nếu không HashMap và HashSet chạy sai.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 7</h2>
<ol>
<li><strong>A hash table</strong> stores an item at index h(key): insert, search and delete are O(1) on average, O(n) in the worst case — and it keeps no order, so min, max and sorted output cost O(n) or more.</li>
<li><strong>A good hash function</strong> is fast, uses the whole key and spreads keys uniformly (probability 1/M per cell). Division x % M with a prime M; folding, mid-square, extraction and radix transformation are the other classic methods.</li>
<li><strong>Collisions cannot be avoided</strong> — there are more possible keys than cells, and they start early (birthday paradox) — so every table needs a resolution strategy.</li>
<li><strong>Open addressing</strong>: linear probing (h + i) suffers from primary clustering; quadratic probing (h + i²) avoids it and is guaranteed to find a free cell when M is prime and α ≤ 0.5. Every probe is taken <code>% M</code>; a search stops at an empty cell or after M probes.</li>
<li><strong>Deleting in open addressing</strong> means marking the cell DELETED: searches go on past it, insertions reuse it after checking the key is absent, and the table is rebuilt when marks pile up.</li>
<li><strong>Separate chaining</strong> keeps a linked list per cell: α may exceed 1, a search costs about 1 + α. Coalesced hashing, buckets and extendible hashing are variations for tight memory or files on disk.</li>
<li><strong>The load factor α = n / M</strong> decides the speed: grow the table (rehash, re-inserting every key) when α passes a threshold — 0.75 in Java's HashMap. One rehash is O(n), O(1) per insertion amortized.</li>
<li><strong>In Java</strong>: HashMap (nulls allowed, unsynchronized), Hashtable (synchronized, no null), HashSet (<code>add</code> returns false on a duplicate); <code>put</code> returns the old value, <code>get</code> returns null for an absent key; override <code>equals</code> and <code>hashCode</code> together; <code>Math.floorMod</code> for negative hash codes.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>h(x) = x % 7 with linear probing: insert 10, 17, 24. In which cells are they?</li>
<li>The same keys with quadratic probing: where does 24 go?</li>
<li>Why must <code>equals</code> and <code>hashCode</code> be overridden together?</li>
<li>After a key is deleted with a DELETED mark, may a search stop at that mark?</li>
<li>A chained table has 5 cells and rehashes when n / M &gt; 0.75. After which insertion does it grow?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) all hash to 3 → cells 3, 4, 5. (2) 3 taken, 3 + 1 = 4 taken, 3 + 4 = 7 → 7 % 7 = cell 0. (3) HashMap/HashSet first use <code>hashCode</code> to choose the bucket, and inside it compare the stored hash codes before calling <code>equals</code>; two equal objects with different codes are looked for in the wrong bucket, or rejected by the code comparison. (4) No — it must go on; only an EMPTY cell ends a search. (5) After the 4th: 4 / 5 = 0.8 &gt; 0.75.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Operation</th><th>Separate chaining</th><th>Open addressing (linear / quadratic)</th><th>Why</th></tr></thead>
<tbody>
<tr><td>insert, average</td><td>O(1) — add at the front of a chain</td><td>O(1) while α stays ≤ 0.5</td><td>h(key) + a few probes</td></tr>
<tr><td>search, average</td><td>O(1 + α)</td><td>linear: ≈ ½(1 + 1/(1−α)) probes on a hit, ½(1 + 1/(1−α)²) on a miss</td><td>one chain / one run of occupied cells</td></tr>
<tr><td>delete, average</td><td>O(1 + α) — ordinary list delete</td><td>O(1) — search + mark DELETED</td><td>same walk as a search</td></tr>
<tr><td>worst case of the three</td><td>O(n) — one long chain (a Java 8+ HashMap bucket becomes a tree: O(log n))</td><td>O(n) — one long run</td><td>all keys collide</td></tr>
<tr><td>rehash</td><td>O(n + M)</td><td>O(n + M)</td><td>every key is inserted again; amortized O(1) per insert</td></tr>
<tr><td>min / max, sorted output</td><td>O(n + M) / O(n log n)</td><td>O(n + M) / O(n log n)</td><td>the table keeps no order</td></tr>
<tr><td>hash of a string of length L</td><td>O(L)</td><td>O(L)</td><td>Horner's rule, one step per character</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 7</h2>
<ol>
<li><strong>Bảng băm (hash table)</strong> cất phần tử tại chỉ số h(khoá): chèn, tìm, xoá O(1) trung bình, O(n) trong trường hợp xấu nhất — và không giữ thứ tự, nên tìm min, max và in theo thứ tự tốn O(n) trở lên.</li>
<li><strong>Hàm băm tốt</strong> tính nhanh, dùng toàn bộ khoá và rải khoá đều (xác suất 1/M mỗi ô). Chia lấy dư x % M với M nguyên tố; gấp số, bình phương lấy giữa, trích chữ số và đổi cơ số là các phương pháp kinh điển khác.</li>
<li><strong>Không tránh được va chạm (collision)</strong> — số khoá có thể có nhiều hơn số ô, và va chạm tới rất sớm (nghịch lý ngày sinh) — nên bảng nào cũng cần một chiến lược giải quyết.</li>
<li><strong>Địa chỉ mở (open addressing)</strong>: dò tuyến tính (h + i) bị vón cục sơ cấp; dò bậc hai (h + i²) tránh được và chắc chắn tìm được ô trống khi M nguyên tố và α ≤ 0,5. Mọi lần dò đều lấy <code>% M</code>; phép tìm dừng ở ô trống hoặc sau M lần dò.</li>
<li><strong>Xoá trong địa chỉ mở</strong> là đánh dấu ô DELETED: phép tìm đi tiếp qua nó, phép chèn dùng lại nó sau khi kiểm tra khoá chưa có, và bảng được dựng lại khi dấu xoá quá nhiều.</li>
<li><strong>Dây chuyền tách biệt (separate chaining)</strong> giữ một danh sách liên kết cho mỗi ô: α có thể vượt 1, một lần tìm tốn khoảng 1 + α. Băm gộp dây, bucket (thùng nhiều chỗ) và băm mở rộng là các biến thể cho bộ nhớ chật hoặc tệp trên đĩa.</li>
<li><strong>Hệ số tải α = n / M</strong> quyết định tốc độ: nới bảng (rehash — chèn lại mọi khoá) khi α vượt ngưỡng — 0,75 với HashMap của Java. Một lần rehash là O(n), khấu hao O(1) mỗi lần chèn.</li>
<li><strong>Trong Java</strong>: HashMap (cho phép null, không đồng bộ hoá), Hashtable (đồng bộ hoá, cấm null), HashSet (<code>add</code> trả false khi trùng); <code>put</code> trả giá trị cũ, <code>get</code> trả null khi không có khoá; ghi đè <code>equals</code> và <code>hashCode</code> cùng nhau; dùng <code>Math.floorMod</code> cho mã băm âm.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li>h(x) = x % 7, dò tuyến tính: chèn 10, 17, 24. Chúng nằm ở những ô nào?</li>
<li>Cùng các khoá đó nhưng dò bậc hai: 24 vào ô nào?</li>
<li>Vì sao phải ghi đè <code>equals</code> và <code>hashCode</code> cùng nhau?</li>
<li>Sau khi xoá một khoá bằng dấu DELETED, phép tìm có được dừng ở dấu đó không?</li>
<li>Bảng dây chuyền có 5 ô và băm lại khi n / M &gt; 0,75. Bảng nới rộng sau lần chèn thứ mấy?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) cả ba băm vào 3 → các ô 3, 4, 5. (2) 3 có người, 3 + 1 = 4 có người, 3 + 4 = 7 → 7 % 7 = ô 0. (3) HashMap/HashSet dùng <code>hashCode</code> để chọn bucket trước, và trong bucket còn so mã băm đã lưu trước khi gọi <code>equals</code>; hai đối tượng bằng nhau mà mã băm khác nhau sẽ bị tìm ở nhầm bucket, hoặc bị loại ngay ở bước so mã. (4) Không — phải đi tiếp; chỉ ô EMPTY mới kết thúc phép tìm. (5) Sau lần thứ 4: 4 / 5 = 0,8 &gt; 0,75.</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Thao tác</th><th>Dây chuyền tách biệt</th><th>Địa chỉ mở (tuyến tính / bậc hai)</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>chèn, trung bình</td><td>O(1) — thêm vào đầu một dây</td><td>O(1) khi α còn ≤ 0,5</td><td>h(khoá) + vài lần dò</td></tr>
<tr><td>tìm, trung bình</td><td>O(1 + α)</td><td>tuyến tính: ≈ ½(1 + 1/(1−α)) lần dò khi thấy, ½(1 + 1/(1−α)²) khi trượt</td><td>một dây / một dãy ô có người</td></tr>
<tr><td>xoá, trung bình</td><td>O(1 + α) — xoá nút trong danh sách</td><td>O(1) — tìm + đánh dấu DELETED</td><td>đi đúng đường của phép tìm</td></tr>
<tr><td>xấu nhất của cả ba</td><td>O(n) — một dây dài (bucket của HashMap Java 8+ thành cây: O(log n))</td><td>O(n) — một dãy dài</td><td>mọi khoá va chạm</td></tr>
<tr><td>băm lại (rehash)</td><td>O(n + M)</td><td>O(n + M)</td><td>chèn lại mọi khoá; khấu hao O(1) mỗi lần chèn</td></tr>
<tr><td>min / max, in theo thứ tự</td><td>O(n + M) / O(n log n)</td><td>O(n + M) / O(n log n)</td><td>bảng không giữ thứ tự</td></tr>
<tr><td>băm một chuỗi dài L</td><td>O(L)</td><td>O(L)</td><td>quy tắc Horner, mỗi ký tự một bước</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch7) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'A table of size 10 uses h(x) = x mod 10 and linear probing. The keys 12, 22, 32 are inserted in this order into the empty table. At which index does 32 end up?|||Bảng cỡ 10 dùng h(x) = x mod 10 và dò tuyến tính (linear probing). Chèn lần lượt 12, 22, 32 vào bảng rỗng. 32 nằm ở chỉ số nào?',
      options: ['2|||2', '3|||3', '5|||5', '4|||4'],
      correctIndex: 3,
      points: 1,
      explanation: 'All three keys hash to 2. 12 takes cell 2; 22 finds 2 taken and moves to 3; 32 finds 2 and 3 taken and lands in 4 — the keys pile up into a cluster, the known weakness of linear probing. 3 is the tempting answer: it forgets that 22 already took cell 3.|||Cả ba khoá đều băm về 2. 12 chiếm ô 2; 22 thấy ô 2 bận nên sang 3; 32 thấy 2 và 3 đều bận nên rơi vào 4 — các khoá dồn thành cụm (cluster), điểm yếu nổi tiếng của dò tuyến tính. 3 là đáp án dễ nhầm: quên rằng 22 đã chiếm ô 3.' },
    { id: 'q2',
      question: 'Slide 19 of 7-Hashing inserts 89, 18, 49, 58, 69 in this order with h(x) = x mod 10 and quadratic probing (h(x) + i²) mod 10. Where does 69 end up?|||Slide 19 của 7-Hashing chèn lần lượt 89, 18, 49, 58, 69 với h(x) = x mod 10 và dò bậc hai (h(x) + i²) mod 10. 69 nằm ở đâu?',
      options: ['3|||3', '0|||0', '2|||2', '1|||1'],
      correctIndex: 0,
      points: 1,
      explanation: '89 → 9, 18 → 8, 49 → 9 taken → 9 + 1 = 10 → 0; 58 → 8 taken, 9 taken, 8 + 4 = 12 → 2. For 69: 9 taken, 9 + 1 → 0 taken, 9 + 4 = 13 → 3 is free. 1 is what LINEAR probing would try next after 0 — quadratic probing jumps by 1, 4, 9, … instead.|||89 → 9, 18 → 8, 49 → 9 bận → 9 + 1 = 10 → 0; 58 → 8 bận, 9 bận, 8 + 4 = 12 → 2. Với 69: 9 bận, 9 + 1 → 0 bận, 9 + 4 = 13 → 3 còn trống. 1 là ô mà dò TUYẾN TÍNH sẽ thử tiếp sau 0 — dò bậc hai thì nhảy 1, 4, 9, …' },
    { id: 'q3',
      question: 'In a table with linear probing, key A was placed at index 4 and key B, which also hashes to 4, at index 5. A is deleted by simply emptying cell 4. What happens when B is searched for next?|||Trong bảng dò tuyến tính, khoá A nằm ở chỉ số 4 và khoá B, cũng băm về 4, nằm ở chỉ số 5. A bị xoá bằng cách làm trống ô 4. Khi tìm B tiếp theo thì sao?',
      options: ['B is found at once, because B is still stored in cell 5|||Tìm thấy B ngay, vì B vẫn nằm ở ô 5', 'The search stops at the empty cell 4 and wrongly reports that B is missing|||Phép tìm dừng ở ô 4 trống và báo sai rằng không có B', 'The search loops forever around the table|||Phép tìm lặp vô hạn quanh bảng', 'B is moved back into cell 4 automatically|||B tự động được dời về ô 4'],
      correctIndex: 1,
      points: 1,
      explanation: "A search stops at the first empty cell (slide 17), because an empty cell means \"no key with this hash was ever placed further along\". Emptying cell 4 breaks the probe chain, so B in cell 5 becomes unreachable — slide 25's A4/B4 example. The fix is to mark the cell as deleted (a tombstone) that searches skip over and inserts may reuse. A is tempting because B really is still in cell 5 — but the search never reaches it.|||Phép tìm dừng ở ô trống đầu tiên (slide 17), vì ô trống nghĩa là \"chưa từng có khoá nào cùng giá trị băm được đặt xa hơn\". Làm trống ô 4 là cắt đứt chuỗi dò, nên B ở ô 5 không còn tới được — đúng ví dụ A4/B4 ở slide 25. Cách sửa là đánh dấu ô \"đã xoá\" (tombstone — bia mộ) để phép tìm bỏ qua còn phép chèn được dùng lại. A dễ nhầm vì B đúng là vẫn nằm ở ô 5 — nhưng phép tìm không bao giờ tới được đó." },
    { id: 'q4',
      question: 'Separate chaining with M = 7 and h(k) = k mod 7. The keys 10, 3, 17, 24, 5 are inserted. How many keys end up in bucket 3?|||Băm dây chuyền (separate chaining) với M = 7 và h(k) = k mod 7. Chèn các khoá 10, 3, 17, 24, 5. Bao nhiêu khoá nằm ở bucket 3?',
      options: ['1|||1', '3|||3', '4|||4', '5|||5'],
      correctIndex: 2,
      points: 1,
      explanation: '10, 3, 17 and 24 all leave remainder 3 when divided by 7; only 5 goes to bucket 5. With chaining nothing overflows — the four keys simply share one linked list, and searching that bucket becomes a linear scan. 1 is the answer of someone who expects each bucket to hold one key, as in open addressing.|||10, 3, 17 và 24 đều dư 3 khi chia cho 7; chỉ có 5 vào bucket 5. Với dây chuyền thì không có gì tràn — bốn khoá chỉ đơn giản dùng chung một danh sách liên kết, và tìm trong bucket đó trở thành quét tuần tự. 1 là đáp án của người nghĩ mỗi bucket chỉ chứa một khoá như trong địa chỉ mở.' },
    { id: 'q5',
      question: 'A java.util.HashMap has 16 buckets and the default load factor 0.75, and it already holds 12 entries. What happens when a 13th distinct key is put?|||Một java.util.HashMap có 16 bucket và load factor mặc định 0,75, đang chứa 12 mục. Khi put khoá khác thứ 13 thì điều gì xảy ra?',
      options: ['The table grows to 32 buckets and every entry is rehashed|||Bảng nới lên 32 bucket và mọi mục được băm lại', 'The put is refused because the table is full|||Lệnh put bị từ chối vì bảng đã đầy', 'The new entry replaces the oldest one|||Mục mới thay thế mục cũ nhất', 'Nothing: a HashMap never changes its number of buckets|||Không có gì: HashMap không bao giờ đổi số bucket'],
      correctIndex: 0,
      points: 1,
      explanation: 'The threshold is capacity × load factor = 16 × 0.75 = 12. When the size goes above it, HashMap doubles its buckets and redistributes every entry — the resize keeps chains short, so get/put stay O(1) on average (slide 34 names the two parameters). Chaining never makes a table "full" (B): the load factor is a performance limit, not a capacity limit.|||Ngưỡng là sức chứa × load factor = 16 × 0,75 = 12. Khi số mục vượt ngưỡng, HashMap nhân đôi số bucket và phân bố lại mọi mục — việc nới rộng giữ các dây ngắn, nên get/put vẫn O(1) trung bình (slide 34 nêu đúng hai tham số này). Băm dây chuyền không bao giờ "đầy" (B): load factor là giới hạn về hiệu năng, không phải giới hạn sức chứa.' },
    { id: 'q6',
      question: 'Shift folding (slide 13) splits x = 72320354121324 into parts of three digits from the left and adds them. What is h(x) = sum mod 1000?|||Gấp dịch (shift folding, slide 13) cắt x = 72320354121324 thành các phần ba chữ số từ trái sang rồi cộng lại. h(x) = tổng mod 1000 bằng bao nhiêu?',
      options: ['902|||902', '704|||704', '1704|||1704', '324|||324'],
      correctIndex: 1,
      points: 1,
      explanation: '723 + 203 + 541 + 213 + 24 = 1704, and 1704 mod 1000 = 704. 902 is the BOUNDARY-folding result, where every other part is reversed (302 and 312) before adding; 1704 forgets the final mod.|||723 + 203 + 541 + 213 + 24 = 1704, và 1704 mod 1000 = 704. 902 là kết quả gấp BIÊN (boundary folding), khi các phần xen kẽ bị đảo ngược (302 và 312) trước khi cộng; 1704 là quên bước mod cuối.' },
    { id: 'q7',
      question: 'A class Point overrides equals (two points are equal when x and y are equal) but NOT hashCode. After s.add(new Point(1, 2)) on a HashSet, what does s.contains(new Point(1, 2)) return?|||Lớp Point ghi đè equals (hai điểm bằng nhau khi x và y bằng nhau) nhưng KHÔNG ghi đè hashCode. Sau s.add(new Point(1, 2)) trên một HashSet, s.contains(new Point(1, 2)) trả về gì?',
      options: ['true, because equals says the two points are equal|||true, vì equals nói hai điểm bằng nhau', 'false: the two objects almost always land in different buckets|||false: hai đối tượng gần như luôn rơi vào hai bucket khác nhau', 'A ClassCastException is thrown|||Ném ra ClassCastException', 'It does not compile, because hashCode is abstract|||Không biên dịch được, vì hashCode là trừu tượng'],
      correctIndex: 1,
      points: 1,
      explanation: 'HashSet first uses hashCode to pick a bucket and only then calls equals inside that bucket. The inherited Object.hashCode gives two different objects different codes, so contains looks in the wrong bucket and never calls equals. The contract: equal objects MUST have equal hash codes — always override both. A is the tempting answer for anyone who thinks equals alone decides.|||HashSet dùng hashCode để chọn bucket trước, sau đó mới gọi equals trong bucket đó. hashCode kế thừa từ Object cho hai đối tượng khác nhau hai mã khác nhau, nên contains tìm nhầm bucket và không bao giờ gọi tới equals. Hợp đồng (contract): hai đối tượng bằng nhau BẮT BUỘC có hashCode bằng nhau — luôn ghi đè cả hai. A là đáp án dễ nhầm với người nghĩ chỉ equals quyết định.' },
    { id: 'q8',
      question: 'What does this code print?|||Đoạn code sau in ra gì?',
      code: `HashMap<String, Integer> m = new HashMap<String, Integer>();
m.put("a", 1);
Integer old = m.put("a", 2);
System.out.println(old + " " + m.get("a"));`,
      codeLang: 'java',
      options: ['null 2|||null 2', '2 2|||2 2', '1 2|||1 2', '2 1|||2 1'],
      correctIndex: 2,
      points: 1,
      explanation: 'put(k, v) returns the value that was PREVIOUSLY associated with k, or null if k was new (slide 32). The second put replaces 1 by 2 and returns the old 1; get then returns the new value 2. "null 2" is what the FIRST put would have returned — the trap is to think put always returns null or the new value.|||put(k, v) trả về giá trị TRƯỚC ĐÓ gắn với k, hoặc null nếu k là khoá mới (slide 32). Lần put thứ hai thay 1 bằng 2 và trả về giá trị cũ 1; sau đó get trả giá trị mới 2. "null 2" là thứ lần put ĐẦU TIÊN trả về — cái bẫy là nghĩ put luôn trả null hoặc trả giá trị mới.' },
    { id: 'q9',
      question: 'All keys are multiples of 10 (10, 20, 30, …) and the hash function is h(k) = k mod M. Which table size M spreads them best?|||Mọi khoá đều là bội của 10 (10, 20, 30, …) và hàm băm là h(k) = k mod M. Kích thước bảng M nào rải chúng tốt nhất?',
      options: ['10|||10', '20|||20', '16|||16', '11|||11'],
      correctIndex: 3,
      points: 1,
      explanation: "With M = 10 every key lands in cell 0; with M = 20 only cells 0 and 10 are used; with M = 16 (a power of 2) only the 8 even cells are used. The prime 11 shares no factor with 10, so the keys cycle through all 11 cells — slide 12's advice: choose a prime M. 16 is tempting because powers of two are \"computer-friendly\", but they keep only the low bits of the key.|||Với M = 10 mọi khoá rơi vào ô 0; với M = 20 chỉ dùng được ô 0 và 10; với M = 16 (lũy thừa của 2) chỉ dùng được 8 ô chẵn. Số nguyên tố 11 không có ước chung với 10, nên các khoá đi vòng qua đủ 11 ô — đúng lời khuyên ở slide 12: chọn M là số nguyên tố. 16 dễ gây nhầm vì lũy thừa của 2 \"thân thiện với máy tính\", nhưng nó chỉ giữ lại các bit thấp của khoá." },
    { id: 'q10',
      question: 'A hash code can be any int. What does this code print?|||Mã băm (hashCode) có thể là bất kỳ số int nào. Đoạn code sau in ra gì?',
      code: `int h = Integer.MIN_VALUE;          // a hashCode() can be this value
System.out.println(Math.abs(h) % 10);`,
      codeLang: 'java',
      options: ['-8|||-8', '8|||8', '0|||0', '2147483648|||2147483648'],
      correctIndex: 0,
      points: 1,
      explanation: 'Integer.MIN_VALUE = −2147483648 has no positive counterpart in int, so Math.abs returns the same negative number, and −2147483648 % 10 = −8: a negative "index" that crashes the table. Safe ways to turn a hash code into an index are Math.floorMod(h, M) or (h & 0x7fffffff) % M. 8 is the answer everyone expects from "abs, then mod".|||Integer.MIN_VALUE = −2147483648 không có số dương tương ứng trong kiểu int, nên Math.abs trả về chính số âm đó, và −2147483648 % 10 = −8: một "chỉ số" âm làm bảng băm văng lỗi. Cách an toàn để đổi mã băm thành chỉ số là Math.floorMod(h, M) hoặc (h & 0x7fffffff) % M. 8 là đáp án ai cũng chờ đợi từ "lấy trị tuyệt đối rồi mod".' },
  ],
};

export default {
  slides: [L_csd13_1, L_csd13_2],
  practice: L_on_ch7,
  quiz: QUIZ,
  quizDescription: '10 câu về băm: dò tuyến tính, dò bậc hai theo ví dụ slide 19, xoá trong địa chỉ mở, dây chuyền, load factor của HashMap, folding, hợp đồng equals/hashCode, giá trị trả về của put, chọn kích thước bảng, bẫy Math.abs(hashCode) — mỗi câu có giải thích.',
};
