/**
 * CSD201 · Chương 6 — sắp xếp.
 * Bài 📑 học theo từng slide: csd12 (6-Sorting.ppt, 43 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch6.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch6).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 6.A — 📑 Slide by slide · Sorting, part 1: elementary sorts & quicksort (6-Sorting, slides 1–20) ───────── */
const L_csd12_1 = {
  title: '6.A — 📑 Slide by slide · Sorting, part 1: elementary sorts & quicksort (6-Sorting, slides 1–20)|||6.A — 📑 Học theo từng slide · Sắp xếp, phần 1: sắp xếp cơ bản & quicksort (6-Sorting, slide 1–20)',
  slug: 'csd201-slide-csd12-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–20 của bộ 6-Sorting: selection, insertion, bubble sort chạy từng lượt trên mảng [5 2 3 8 1] của slide, đếm phép so sánh, tính ổn định; quicksort: chia để trị, phân hoạch tại chỗ, độ phức tạp và cách chọn chốt, bốn chặng đầu của ví dụ chạy tay — 12 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.A · 6-Sorting, slides 1–20</span>
<h2>Sorting, part 1 — elementary sorts and quicksort, slide by slide</h2>
<p class="lead">This is the deck of syllabus sessions 41–42 (CLO6). Slides 1–20 cover the three elementary sorts — selection, insertion, bubble — and quicksort up to the middle of its worked example. Every algorithm is run in Java, traced pass by pass on the slide's own array [5 2 3 8 1], and its cost is counted, not just stated.</p>
<div class="callout"><strong>CLO6 in the syllabus:</strong> explain the operation and performance of some basic and advanced sorting algorithms. The FE asks you to trace ("the array after the 2nd pass of insertion sort is…"), to compare costs (best/worst case, stable or not); the PE may ask you to sort an array or a linked list of objects by one field. The syllabus's constructive questions (CQ) on this part — CQ14.1 the complexity of selection, insertion and bubble sort, CQ14.2 which of the three is fastest and why, CQ15.1 what quicksort is — are answered on slides 4–12.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Algorithm</th><th>Idea in one line</th><th>Best</th><th>Average</th><th>Worst</th><th>Extra memory</th><th>Stable?</th></tr></thead>
<tbody>
<tr><td>Selection (slides 4–6)</td><td>find the smallest of the rest, swap it to the front</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>no</td></tr>
<tr><td>Insertion (slides 7–9)</td><td>insert each element into the sorted part on its left</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td></tr>
<tr><td>Bubble with a flag (slide 10)</td><td>swap out-of-order neighbours; stop after a pass with no swap</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td></tr>
<tr><td>Quicksort (slides 12–30)</td><td>partition around a pivot, then sort both sides recursively</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) stack on average</td><td>no</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 6 · Bài 6.A · 6-Sorting, slide 1–20</span>
<h2>Sắp xếp, phần 1 — các thuật toán cơ bản và quicksort, học từng slide</h2>
<p class="lead">Đây là bộ slide của buổi 41–42 theo syllabus (CLO6). Slide 1–20 gồm ba thuật toán sắp xếp cơ bản — chọn (selection), chèn (insertion), nổi bọt (bubble) — và sắp xếp nhanh (quicksort) tới giữa ví dụ chạy tay. Thuật toán nào cũng được chạy bằng Java, lần theo từng lượt (pass) trên chính mảng [5 2 3 8 1] của slide, và chi phí được đếm ra bằng số chứ không chỉ nói suông.</p>
<div class="callout"><strong>CLO6 trong syllabus:</strong> giải thích cách hoạt động và hiệu năng của một số thuật toán sắp xếp cơ bản và nâng cao. Đề FE (thi cuối kỳ) bắt lần theo ("mảng sau lượt thứ 2 của insertion sort là…"), so sánh chi phí (trường hợp tốt nhất/xấu nhất, có ổn định — stable — hay không); đề PE (thi thực hành) có thể bắt sắp một mảng hoặc một danh sách liên kết các đối tượng theo một trường. Các câu hỏi thảo luận (constructive question — CQ) của syllabus về phần này — CQ14.1 độ phức tạp của selection, insertion, bubble sort, CQ14.2 thuật toán nào trong ba cái nhanh nhất và vì sao, CQ15.1 quicksort là gì — được trả lời ở slide 4–12.</div>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Thuật toán</th><th>Ý tưởng một dòng</th><th>Tốt nhất</th><th>Trung bình</th><th>Xấu nhất</th><th>Bộ nhớ thêm</th><th>Ổn định?</th></tr></thead>
<tbody>
<tr><td>Chọn — selection (slide 4–6)</td><td>tìm phần tử nhỏ nhất của phần còn lại, đổi nó lên đầu</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>không</td></tr>
<tr><td>Chèn — insertion (slide 7–9)</td><td>chèn từng phần tử vào phần đã sắp bên trái</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>có</td></tr>
<tr><td>Nổi bọt có cờ — bubble (slide 10)</td><td>đổi chỗ các cặp kề nhau sai thứ tự; dừng sau một lượt không đổi chỗ nào</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>có</td></tr>
<tr><td>Quicksort (slide 12–30)</td><td>phân hoạch quanh một chốt, rồi sắp đệ quy hai bên</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) ngăn xếp đệ quy, trung bình</td><td>không</td></tr>
</tbody>
</table>`),
    walkHead('csd12', 1, 20),
    walk('csd12', [
      [1, '6. Sorting',
        `<p class="y-chinh">🎯 Chapter 6 is about sorting — putting n items in order — the most studied problem of algorithm design and a daily tool in real code.</p>
<p>Sorted data is what makes binary search O(log n), duplicates easy to find and reports readable. This deck shows seven ways to sort and, above all, what each one costs.</p>`,
        `<p class="y-chinh">🎯 Chương 6 nói về sắp xếp (sorting) — đưa n phần tử về đúng thứ tự — bài toán được nghiên cứu nhiều nhất của thiết kế thuật toán và là công cụ dùng hằng ngày trong code thật.</p>
<p>Có dữ liệu đã sắp thì tìm kiếm nhị phân (binary search) mới đạt O(log n), phần tử trùng mới dễ tìm, báo cáo mới dễ đọc. Bộ slide này đưa ra bảy cách sắp xếp và, quan trọng hơn cả, cái giá của từng cách.</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Two families of sorts — simple ones that cost O(n²) and efficient ones that reach O(n log n) — plus radix sort and the sorts already built into java.util.</p>
<ol>
<li><strong>Elementary sorting algorithms</strong> — selection sort (slides 4–6), insertion sort (7–9), bubble sort (10).</li>
<li><strong>Efficient sorting algorithms</strong> — quicksort (12–30), merge sort (31–33), heap sort (34–37).</li>
<li><strong>Radix sort</strong> — sorting digit by digit, without ever comparing two elements (38–39).</li>
<li><strong>Sorting in java.util</strong> — <code>Arrays.sort</code>, <code>Collections.sort</code> and their friends (40–41).</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> "elementary" = two nested loops = O(n²); "efficient" = split the work (or use a heap) = O(n log n).</p>`,
        `<p class="y-chinh">🎯 Hai họ thuật toán — loại đơn giản tốn O(n²) và loại hiệu quả đạt O(n log n) — cộng thêm sắp xếp theo cơ số (radix sort) và các hàm sắp xếp có sẵn trong gói java.util.</p>
<ol>
<li><strong>Thuật toán sắp xếp cơ bản (elementary)</strong> — sắp xếp chọn (selection sort, slide 4–6), sắp xếp chèn (insertion sort, 7–9), sắp xếp nổi bọt (bubble sort, 10).</li>
<li><strong>Thuật toán sắp xếp hiệu quả (efficient)</strong> — sắp xếp nhanh (quicksort, 12–30), sắp xếp trộn (merge sort, 31–33), sắp xếp vun đống (heap sort, 34–37).</li>
<li><strong>Sắp xếp theo cơ số (radix sort)</strong> — sắp theo từng chữ số, không hề so sánh hai phần tử với nhau (38–39).</li>
<li><strong>Sắp xếp trong java.util</strong> — <code>Arrays.sort</code>, <code>Collections.sort</code> và các hàm đi kèm (40–41).</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> "cơ bản" = hai vòng lặp lồng nhau = O(n²); "hiệu quả" = chia nhỏ công việc (hoặc dùng heap) = O(n log n).</p>`],
      [3, 'Elementary Sorting Algorithms',
        `<p class="y-chinh">🎯 Section 1 of the deck: three sorts built from two nested loops, where every pass puts at least one more element in its place.</p>
<p class="ghi-chu">This slide carries only the section title (no other text could be extracted); the block below introduces the section.</p>
<p>What each of them guarantees after pass k — the fact behind most FE trace questions:</p>
<table>
<thead><tr><th>Sort</th><th>After pass k you know that…</th></tr></thead>
<tbody>
<tr><td>selection</td><td>the first k elements are the k smallest, already in their final places</td></tr>
<tr><td>insertion</td><td>the first k+1 elements are sorted among themselves, but not final yet</td></tr>
<tr><td>bubble</td><td>the last k elements are the k largest, already in their final places</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Phần 1 của bộ slide: ba thuật toán dựng từ hai vòng lặp lồng nhau, mỗi lượt (pass) đưa thêm ít nhất một phần tử về đúng chỗ.</p>
<p class="ghi-chu">Slide này chỉ có tiêu đề phần (không trích được chữ nào khác); khối dưới đây giới thiệu phần này.</p>
<p>Điều mỗi thuật toán bảo đảm sau lượt thứ k — gốc của đa số câu hỏi lần theo (trace) trong đề FE:</p>
<table>
<thead><tr><th>Thuật toán</th><th>Sau lượt k ta chắc chắn rằng…</th></tr></thead>
<tbody>
<tr><td>chọn (selection)</td><td>k phần tử đầu là k phần tử nhỏ nhất, đã nằm đúng chỗ cuối cùng</td></tr>
<tr><td>chèn (insertion)</td><td>k+1 phần tử đầu đã có thứ tự với nhau, nhưng chưa chắc ở chỗ cuối cùng</td></tr>
<tr><td>nổi bọt (bubble)</td><td>k phần tử cuối là k phần tử lớn nhất, đã nằm đúng chỗ cuối cùng</td></tr>
</tbody>
</table>`],
      [4, 'Selection Sort',
        `<p class="y-chinh">🎯 Selection sort repeats one step: find the smallest element of the unsorted part and swap it into the first unsorted position — at most one swap per pass.</p>
<ul>
<li>The slide calls it "an attempt to <strong>localize the exchanges</strong>": first find the misplaced element, then put it straight into its final place with a single swap.</li>
<li>Pseudocode: for i = 0 … n−2, select the smallest <code>data[k]</code> among <code>data[i] … data[n-1]</code>, then swap <code>data[i]</code> with <code>data[k]</code>.</li>
<li>The loop stops at n−2: once n−1 elements are in place, the last one is too.</li>
</ul>
<p><strong>Big-O:</strong> pass i makes n−1−i comparisons, so (n−1) + (n−2) + … + 1 = n(n−1)/2 comparisons — O(n²) for every input; swaps: at most n−1, O(n).</p>
<pre><code class="language-java">public class SelectionCount {
    static int comps, swaps;

    // selection sort exactly as the slide's pseudocode
    static void selectionSort(int[] data) {
        comps = swaps = 0;
        for (int i = 0; i &lt;= data.length - 2; i++) {
            int k = i;                                   // position of the smallest so far
            for (int j = i + 1; j &lt; data.length; j++) {
                comps++;
                if (data[j] &lt; data[k]) k = j;
            }
            if (k != i) {                                // one swap per pass at most
                int t = data[i]; data[i] = data[k]; data[k] = t;
                swaps++;
            }
        }
    }

    static void test(String name, int[] data) {
        selectionSort(data);
        System.out.println(name + " n=" + data.length + ": comparisons=" + comps + ", swaps=" + swaps);
    }

    static int[] upTo(int n, boolean reversed) {
        int[] a = new int[n];
        for (int i = 0; i &lt; n; i++) a[i] = reversed ? n - i : i + 1;
        return a;
    }

    public static void main(String[] args) {
        test("sorted  ", upTo(10, false));
        test("reversed", upTo(10, true));
        test("mixed   ", new int[] {7, 3, 10, 1, 8, 5, 2, 9, 4, 6});
        test("sorted  ", upTo(20, false));             // n doubled
        test("sorted  ", upTo(40, false));             // n doubled again
    }
}</code></pre>
<div class="out">sorted &nbsp;&nbsp;n=10: comparisons=45, swaps=0<br>
reversed n=10: comparisons=45, swaps=5<br>
mixed &nbsp;&nbsp;&nbsp;n=10: comparisons=45, swaps=9<br>
sorted &nbsp;&nbsp;n=20: comparisons=190, swaps=0<br>
sorted &nbsp;&nbsp;n=40: comparisons=780, swaps=0</div>
<p>Both facts are in the output: 45 comparisons for n = 10 whether the array is sorted, reversed or mixed, and each doubling of n multiplies them by about 4 (45 → 190 → 780) — the signature of O(n²).</p>
<p class="meo">🧠 <strong>Remember:</strong> selection = "select the minimum, swap once". Many comparisons, few swaps — handy when writing an element is expensive.</p>
<div class="pitfall">Selection sort has no good best case: even on a sorted array it makes n(n−1)/2 comparisons (first line: 45 comparisons, 0 swaps). An FE option "selection sort is O(n) on sorted input" is false — that is insertion sort, or bubble sort with a flag.</div>`,
        `<p class="y-chinh">🎯 Sắp xếp chọn (selection sort) lặp lại một bước: tìm phần tử nhỏ nhất của phần chưa sắp rồi đổi chỗ (swap) nó về vị trí đầu tiên của phần chưa sắp — mỗi lượt nhiều nhất một lần đổi chỗ.</p>
<ul>
<li>Slide gọi đây là cách "<strong>khoanh vùng các lần đổi chỗ</strong>" (localize the exchanges): tìm ra phần tử đang sai chỗ trước, rồi đặt thẳng nó vào vị trí cuối cùng bằng đúng một lần đổi.</li>
<li>Mã giả (pseudocode): với i = 0 … n−2, chọn phần tử nhỏ nhất <code>data[k]</code> trong <code>data[i] … data[n-1]</code>, rồi đổi <code>data[i]</code> với <code>data[k]</code>.</li>
<li>Vòng lặp dừng ở n−2: khi n−1 phần tử đã đúng chỗ thì phần tử cuối cùng cũng đúng chỗ.</li>
</ul>
<p><strong>Big-O:</strong> lượt i làm n−1−i phép so sánh, nên tổng là (n−1) + (n−2) + … + 1 = n(n−1)/2 — O(n²) với mọi đầu vào; số lần đổi chỗ: nhiều nhất n−1, tức O(n).</p>
<pre><code class="language-java">public class SelectionCount {
    static int comps, swaps;

    // selection sort đúng như mã giả trên slide
    static void selectionSort(int[] data) {
        comps = swaps = 0;
        for (int i = 0; i &lt;= data.length - 2; i++) {
            int k = i;                                   // vị trí phần tử nhỏ nhất tới giờ
            for (int j = i + 1; j &lt; data.length; j++) {
                comps++;
                if (data[j] &lt; data[k]) k = j;
            }
            if (k != i) {                                // mỗi lượt đổi chỗ nhiều nhất một lần
                int t = data[i]; data[i] = data[k]; data[k] = t;
                swaps++;
            }
        }
    }

    static void test(String name, int[] data) {
        selectionSort(data);
        System.out.println(name + " n=" + data.length + ": comparisons=" + comps + ", swaps=" + swaps);
    }

    static int[] upTo(int n, boolean reversed) {
        int[] a = new int[n];
        for (int i = 0; i &lt; n; i++) a[i] = reversed ? n - i : i + 1;
        return a;
    }

    public static void main(String[] args) {
        test("sorted  ", upTo(10, false));
        test("reversed", upTo(10, true));
        test("mixed   ", new int[] {7, 3, 10, 1, 8, 5, 2, 9, 4, 6});
        test("sorted  ", upTo(20, false));             // n gấp đôi
        test("sorted  ", upTo(40, false));             // n gấp đôi lần nữa
    }
}</code></pre>
<div class="out">sorted &nbsp;&nbsp;n=10: comparisons=45, swaps=0<br>
reversed n=10: comparisons=45, swaps=5<br>
mixed &nbsp;&nbsp;&nbsp;n=10: comparisons=45, swaps=9<br>
sorted &nbsp;&nbsp;n=20: comparisons=190, swaps=0<br>
sorted &nbsp;&nbsp;n=40: comparisons=780, swaps=0</div>
<p>Output cho thấy cả hai điều: n = 10 thì luôn 45 phép so sánh dù mảng đã sắp, sắp ngược hay lộn xộn; và mỗi lần n gấp đôi thì số phép so sánh tăng khoảng 4 lần (45 → 190 → 780) — dấu hiệu của O(n²).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> selection = "chọn cái nhỏ nhất, đổi một lần". So sánh nhiều, đổi chỗ ít — có lợi khi việc ghi một phần tử rất tốn kém.</p>
<div class="pitfall">Selection sort không có trường hợp tốt nhất "rẻ": kể cả mảng đã sắp nó vẫn so sánh n(n−1)/2 lần (dòng đầu: 45 phép so sánh, 0 lần đổi). Phương án FE "selection sort là O(n) với mảng đã sắp" là SAI — đó là sắp xếp chèn (insertion sort), hoặc sắp xếp nổi bọt (bubble sort) có cờ.</div>`],
      [5, 'Selection Sort example',
        `<p class="y-chinh">🎯 Slide 5 sorts [5 2 3 8 1] with selection sort; below is every pass of that run, printed by Java, to compare with the slide's figure line by line.</p>
<p>The slide illustrates this run with a figure. The same run as a table — the bar | separates the sorted part from the rest:</p>
<table>
<thead><tr><th>Pass i</th><th>Smallest of a[i..4]</th><th>Action</th><th>Array after the pass</th></tr></thead>
<tbody>
<tr><td>start</td><td>—</td><td>—</td><td><code>| 5 2 3 8 1</code></td></tr>
<tr><td>0</td><td>1, at k = 4</td><td>swap a[0], a[4]</td><td><code>1 | 2 3 8 5</code></td></tr>
<tr><td>1</td><td>2, at k = 1</td><td>none (k == i)</td><td><code>1 2 | 3 8 5</code></td></tr>
<tr><td>2</td><td>3, at k = 2</td><td>none (k == i)</td><td><code>1 2 3 | 8 5</code></td></tr>
<tr><td>3</td><td>5, at k = 4</td><td>swap a[3], a[4]</td><td><code>1 2 3 5 | 8</code></td></tr>
</tbody>
</table>
<pre><code class="language-java">public class SelectionTrace {
    // the array with a bar after the sorted part
    static String show(int[] a, int sorted) {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; a.length; i++) {
            if (i == sorted) s.append("| ");
            s.append(a[i]).append(' ');
        }
        return s.toString().trim();
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 3, 8, 1};                      // the array of slide 5
        int n = a.length;
        System.out.println("start                      : " + show(a, 0));
        for (int i = 0; i &lt; n - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; n; j++)
                if (a[j] &lt; a[k]) k = j;                 // find the smallest of a[i..n-1]
            String act;
            if (k != i) {
                int t = a[i]; a[i] = a[k]; a[k] = t;
                act = "swap a[" + i + "],a[" + k + "]";
            } else act = "no swap       ";
            System.out.println("i=" + i + " min=" + a[i] + " at k=" + k + " " + act + ": " + show(a, i + 1));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: | 5 2 3 8 1<br>
i=0 min=1 at k=4 swap a[0],a[4]: 1 | 2 3 8 5<br>
i=1 min=2 at k=1 no swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1 2 | 3 8 5<br>
i=2 min=3 at k=2 no swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1 2 3 | 8 5<br>
i=3 min=5 at k=4 swap a[3],a[4]: 1 2 3 5 | 8</div>
<ul>
<li>After pass i, a[0..i] hold the i+1 smallest values in their final places — they are never touched again.</li>
<li>This array needed only 2 swaps, but all 4 + 3 + 2 + 1 = 10 comparisons were still made.</li>
<li>Twice the minimum was already in place (k == i for 2 and 3): the test <code>if(k!=i)</code> on slide 6 skips exactly those useless swaps.</li>
</ul>
<div class="pitfall">"The array after the 2nd pass" has a different answer for each sort. For [5 2 3 8 1]: selection sort gives <code>1 2 3 8 5</code> (row i = 1 above), insertion sort gives <code>2 3 5 8 1</code> (slide 8). Know which invariant each sort keeps before you answer.</div>`,
        `<p class="y-chinh">🎯 Slide 5 sắp mảng [5 2 3 8 1] bằng sắp xếp chọn (selection sort); dưới đây là từng lượt của lần chạy đó do Java in ra, để đối chiếu với hình trên slide từng dòng một.</p>
<p>Slide minh hoạ lần chạy này bằng hình. Cùng lần chạy ấy viết thành bảng — vạch | ngăn phần đã sắp với phần còn lại:</p>
<table>
<thead><tr><th>Lượt i</th><th>Nhỏ nhất của a[i..4]</th><th>Việc làm</th><th>Mảng sau lượt</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>—</td><td>—</td><td><code>| 5 2 3 8 1</code></td></tr>
<tr><td>0</td><td>1, tại k = 4</td><td>đổi a[0], a[4]</td><td><code>1 | 2 3 8 5</code></td></tr>
<tr><td>1</td><td>2, tại k = 1</td><td>không đổi (k == i)</td><td><code>1 2 | 3 8 5</code></td></tr>
<tr><td>2</td><td>3, tại k = 2</td><td>không đổi (k == i)</td><td><code>1 2 3 | 8 5</code></td></tr>
<tr><td>3</td><td>5, tại k = 4</td><td>đổi a[3], a[4]</td><td><code>1 2 3 5 | 8</code></td></tr>
</tbody>
</table>
<pre><code class="language-java">public class SelectionTrace {
    // in mảng, vạch | ngăn phần đã sắp với phần còn lại
    static String show(int[] a, int sorted) {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; a.length; i++) {
            if (i == sorted) s.append("| ");
            s.append(a[i]).append(' ');
        }
        return s.toString().trim();
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 3, 8, 1};                      // mảng của slide 5
        int n = a.length;
        System.out.println("start                      : " + show(a, 0));
        for (int i = 0; i &lt; n - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; n; j++)
                if (a[j] &lt; a[k]) k = j;                 // tìm phần tử nhỏ nhất của a[i..n-1]
            String act;
            if (k != i) {
                int t = a[i]; a[i] = a[k]; a[k] = t;
                act = "swap a[" + i + "],a[" + k + "]";
            } else act = "no swap       ";
            System.out.println("i=" + i + " min=" + a[i] + " at k=" + k + " " + act + ": " + show(a, i + 1));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: | 5 2 3 8 1<br>
i=0 min=1 at k=4 swap a[0],a[4]: 1 | 2 3 8 5<br>
i=1 min=2 at k=1 no swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1 2 | 3 8 5<br>
i=2 min=3 at k=2 no swap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1 2 3 | 8 5<br>
i=3 min=5 at k=4 swap a[3],a[4]: 1 2 3 5 | 8</div>
<ul>
<li>Sau lượt i, các ô a[0..i] chứa i+1 giá trị nhỏ nhất ở đúng chỗ cuối cùng — không bao giờ bị động tới nữa.</li>
<li>Mảng này chỉ cần 2 lần đổi chỗ (swap), nhưng vẫn phải làm đủ 4 + 3 + 2 + 1 = 10 phép so sánh.</li>
<li>Hai lần phần tử nhỏ nhất đã nằm sẵn đúng chỗ (k == i với 2 và 3): phép thử <code>if(k!=i)</code> ở slide 6 bỏ qua đúng những lần đổi chỗ vô ích đó.</li>
</ul>
<div class="pitfall">Câu "mảng sau lượt thứ 2" có đáp án khác nhau cho từng thuật toán. Với [5 2 3 8 1]: selection sort cho <code>1 2 3 8 5</code> (dòng i = 1 ở trên), sắp xếp chèn (insertion sort) cho <code>2 3 5 8 1</code> (slide 8). Phải biết mỗi thuật toán giữ bất biến (invariant) nào rồi mới trả lời.</div>`],
      [6, 'Selection sort code',
        `<p class="y-chinh">🎯 The slide's <code>selectSort()</code> keeps the current minimum in <code>min</code> and its position in <code>k</code>, and swaps only when the minimum is not already at position i.</p>
<ul>
<li><code>min=a[i]; k=i;</code> — start by assuming a[i] is the smallest of the rest.</li>
<li>Inner loop, j = i+1 … n−1: a smaller value updates <em>both</em> <code>k</code> and <code>min</code>.</li>
<li><code>if(k!=i) swap(a,i,k);</code> — skips a useless self-swap (the "none" rows of slide 5).</li>
<li>The slide shows only the method; the fields <code>a</code>, <code>n</code> and the helpers <code>swap</code>, <code>display</code> are ours, so that the file runs.</li>
</ul>
<pre><code class="language-java">class ElemSort {
    int[] a; int n;

    ElemSort(int[] b) { a = b; n = b.length; }           // not on the slide: store the array
    void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
    void display() {
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
        System.out.println();
    }

    void selectSort() // Simple Selection Sort
    { int i,j,k;int min;
      for(i=0;i&lt;n-1;i++)
      { min=a[i];k=i;
        for(j=i+1;j&lt;n;j++)
          if(a[j]&lt;min) {k=j;min=a[j];}
        if(k!=i) swap(a,i,k);
      }
    }

    // a common PE bug: min is never updated
    void selectSortBug()
    { int i,j,k;int min;
      for(i=0;i&lt;n-1;i++)
      { min=a[i];k=i;
        for(j=i+1;j&lt;n;j++)
          if(a[j]&lt;min) k=j;                              // forgot min=a[j]
        if(k!=i) swap(a,i,k);
      }
    }
}

public class SelectSortSlide {
    public static void main(String[] args) {
        ElemSort t = new ElemSort(new int[] {5, 2, 3, 8, 1});
        t.selectSort();
        System.out.print("slide code, [5 2 3 8 1] -&gt; "); t.display();
        t = new ElemSort(new int[] {3, 1, 2});
        t.selectSort();
        System.out.print("slide code, [3 1 2]     -&gt; "); t.display();
        t = new ElemSort(new int[] {3, 1, 2});
        t.selectSortBug();
        System.out.print("bug version, [3 1 2]    -&gt; "); t.display();
    }
}</code></pre>
<div class="out">slide code, [5 2 3 8 1] -&gt; 1 2 3 5 8<br>
slide code, [3 1 2] &nbsp;&nbsp;&nbsp;&nbsp;-&gt; 1 2 3<br>
bug version, [3 1 2] &nbsp;&nbsp;&nbsp;-&gt; 2 1 3</div>
<p>Two nested loops over i and j → n(n−1)/2 comparisons, exactly as counted on slide 4.</p>
<p class="meo">🧠 <strong>Remember:</strong> <code>k</code> and <code>min</code> always change together, in the same <code>if</code>.</p>
<div class="pitfall">The classic PE bug is the <code>if</code> line with <code>min=a[j]</code> forgotten (only <code>k=j</code>). Every later element is then compared with the old a[i], not with the current minimum, so k ends at the <em>last</em> element smaller than a[i]. On [5 2 3 8 1] the bug happens to give the right answer; on [3 1 2] it returns 2 1 3 (last line). Always test on more than one array.</div>`,
        `<p class="y-chinh">🎯 Hàm <code>selectSort()</code> của slide giữ giá trị nhỏ nhất hiện tại trong <code>min</code> và vị trí của nó trong <code>k</code>, và chỉ đổi chỗ khi phần tử nhỏ nhất chưa nằm sẵn ở vị trí i.</p>
<ul>
<li><code>min=a[i]; k=i;</code> — tạm coi a[i] là nhỏ nhất trong phần còn lại.</li>
<li>Vòng trong, j = i+1 … n−1: gặp giá trị nhỏ hơn thì cập nhật <em>cả</em> <code>k</code> lẫn <code>min</code>.</li>
<li><code>if(k!=i) swap(a,i,k);</code> — bỏ qua lần tự đổi chỗ với chính mình (các dòng "không đổi" ở slide 5).</li>
<li>Slide chỉ có phương thức; các trường <code>a</code>, <code>n</code> và hàm phụ <code>swap</code>, <code>display</code> là do bài viết thêm để file chạy được.</li>
</ul>
<pre><code class="language-java">class ElemSort {
    int[] a; int n;

    ElemSort(int[] b) { a = b; n = b.length; }           // không có trên slide: giữ mảng cần sắp
    void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
    void display() {
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
        System.out.println();
    }

    void selectSort() // Sắp xếp chọn đơn giản
    { int i,j,k;int min;
      for(i=0;i&lt;n-1;i++)
      { min=a[i];k=i;
        for(j=i+1;j&lt;n;j++)
          if(a[j]&lt;min) {k=j;min=a[j];}
        if(k!=i) swap(a,i,k);
      }
    }

    // lỗi PE hay gặp: quên cập nhật min
    void selectSortBug()
    { int i,j,k;int min;
      for(i=0;i&lt;n-1;i++)
      { min=a[i];k=i;
        for(j=i+1;j&lt;n;j++)
          if(a[j]&lt;min) k=j;                              // quên min=a[j]
        if(k!=i) swap(a,i,k);
      }
    }
}

public class SelectSortSlide {
    public static void main(String[] args) {
        ElemSort t = new ElemSort(new int[] {5, 2, 3, 8, 1});
        t.selectSort();
        System.out.print("slide code, [5 2 3 8 1] -&gt; "); t.display();
        t = new ElemSort(new int[] {3, 1, 2});
        t.selectSort();
        System.out.print("slide code, [3 1 2]     -&gt; "); t.display();
        t = new ElemSort(new int[] {3, 1, 2});
        t.selectSortBug();
        System.out.print("bug version, [3 1 2]    -&gt; "); t.display();
    }
}</code></pre>
<div class="out">slide code, [5 2 3 8 1] -&gt; 1 2 3 5 8<br>
slide code, [3 1 2] &nbsp;&nbsp;&nbsp;&nbsp;-&gt; 1 2 3<br>
bug version, [3 1 2] &nbsp;&nbsp;&nbsp;-&gt; 2 1 3</div>
<p>Hai vòng lặp lồng nhau theo i và j → n(n−1)/2 phép so sánh, đúng như đã đếm ở slide 4.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <code>k</code> và <code>min</code> luôn đổi cùng nhau, trong cùng một câu <code>if</code>.</p>
<div class="pitfall">Lỗi PE kinh điển nằm ở dòng <code>if</code>: quên <code>min=a[j]</code> (chỉ có <code>k=j</code>). Khi đó các phần tử sau bị so với a[i] cũ chứ không phải với giá trị nhỏ nhất hiện tại, nên k dừng ở phần tử <em>cuối cùng</em> nhỏ hơn a[i]. Với [5 2 3 8 1] lỗi này tình cờ vẫn ra đúng; với [3 1 2] nó trả về 2 1 3 (dòng cuối). Luôn thử trên nhiều hơn một mảng.</div>`],
      [7, 'Insertion sort algorithm',
        `<p class="y-chinh">🎯 Insertion sort grows a sorted prefix: for i = 1 … n−1 it takes data[i] out, moves every bigger element of the prefix one place right, and drops data[i] into the gap.</p>
<ul>
<li>It is how you sort cards in your hand: the cards on the left are already in order; each new card slides left until it meets a smaller one.</li>
<li>"Move all elements data[j] greater than tmp by one position" — these are <strong>shifts</strong> (one assignment each), not swaps (three assignments each).</li>
<li><strong>Best case O(n)</strong>: on a sorted array each new element is compared once with its left neighbour and stays — n−1 comparisons, no shift.</li>
<li><strong>Worst case O(n²)</strong>: on a reversed array element i shifts past all i elements before it → 1 + 2 + … + (n−1) = n(n−1)/2. On random data, about half of that: ≈ n²/4.</li>
</ul>
<pre><code class="language-java">public class InsertionCount {
    static int comps, shifts;

    // insertion sort as on slide 9, with two counters
    static void insertionSort(int[] a) {
        comps = shifts = 0;
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0) {
                comps++;                                 // one comparison x &lt; a[j-1]
                if (!(x &lt; a[j - 1])) break;
                a[j] = a[j - 1];                         // shift one element right
                shifts++;
                j--;
            }
            a[j] = x;
        }
    }

    static void test(String name, int[] a) {
        insertionSort(a);
        System.out.println(name + " n=" + a.length + ": comparisons=" + comps + ", shifts=" + shifts);
    }

    static int[] upTo(int n, boolean reversed) {
        int[] a = new int[n];
        for (int i = 0; i &lt; n; i++) a[i] = reversed ? n - i : i + 1;
        return a;
    }

    public static void main(String[] args) {
        test("sorted  ", upTo(10, false));             // best case
        test("reversed", upTo(10, true));              // worst case
        test("mixed   ", new int[] {7, 3, 10, 1, 8, 5, 2, 9, 4, 6});
        test("sorted  ", upTo(20, false));
        test("reversed", upTo(20, true));
    }
}</code></pre>
<div class="out">sorted &nbsp;&nbsp;n=10: comparisons=9, shifts=0<br>
reversed n=10: comparisons=45, shifts=45<br>
mixed &nbsp;&nbsp;&nbsp;n=10: comparisons=30, shifts=23<br>
sorted &nbsp;&nbsp;n=20: comparisons=19, shifts=0<br>
reversed n=20: comparisons=190, shifts=190</div>
<p>The output confirms both cases: 9 comparisons for 10 sorted numbers and 19 for 20 (linear), but 45 and 190 for reversed input (quadratic). On the mixed array it needs 30 comparisons where selection sort (slide 4) needed 45.</p>
<p class="meo">🧠 <strong>Remember:</strong> insertion sort is <em>adaptive</em> — the fewer elements out of place, the faster it runs. Nearly sorted data is its best friend.</p>
<div class="pitfall">"Insertion sort is O(n)" is true only for (nearly) sorted input; its average and worst case are O(n²). FE pairs to know: best case O(n) — already sorted; worst case O(n²) — sorted in reverse.</div>`,
        `<p class="y-chinh">🎯 Sắp xếp chèn (insertion sort) nuôi lớn dần một đoạn đầu đã sắp: với i = 1 … n−1, nó nhấc data[i] ra, dời mọi phần tử lớn hơn trong đoạn đầu sang phải một ô, rồi thả data[i] vào chỗ trống.</p>
<ul>
<li>Giống cách xếp bài trên tay: các lá bên trái đã theo thứ tự; mỗi lá mới trượt dần sang trái tới khi gặp lá nhỏ hơn.</li>
<li>"Dời mọi data[j] lớn hơn tmp đi một ô" — đó là các lần <strong>dời (shift)</strong>, mỗi lần một phép gán, chứ không phải đổi chỗ (swap) tốn ba phép gán.</li>
<li><strong>Tốt nhất O(n)</strong> (best case): mảng đã sắp thì mỗi phần tử mới chỉ so một lần với phần tử bên trái rồi đứng yên — n−1 phép so sánh, không dời lần nào.</li>
<li><strong>Xấu nhất O(n²)</strong> (worst case): mảng sắp ngược thì phần tử thứ i phải dời qua cả i phần tử đứng trước → 1 + 2 + … + (n−1) = n(n−1)/2. Với dữ liệu ngẫu nhiên thì khoảng một nửa số đó: ≈ n²/4.</li>
</ul>
<pre><code class="language-java">public class InsertionCount {
    static int comps, shifts;

    // insertion sort như slide 9, thêm hai bộ đếm
    static void insertionSort(int[] a) {
        comps = shifts = 0;
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0) {
                comps++;                                 // một phép so sánh x &lt; a[j-1]
                if (!(x &lt; a[j - 1])) break;
                a[j] = a[j - 1];                         // dời một phần tử sang phải
                shifts++;
                j--;
            }
            a[j] = x;
        }
    }

    static void test(String name, int[] a) {
        insertionSort(a);
        System.out.println(name + " n=" + a.length + ": comparisons=" + comps + ", shifts=" + shifts);
    }

    static int[] upTo(int n, boolean reversed) {
        int[] a = new int[n];
        for (int i = 0; i &lt; n; i++) a[i] = reversed ? n - i : i + 1;
        return a;
    }

    public static void main(String[] args) {
        test("sorted  ", upTo(10, false));             // trường hợp tốt nhất
        test("reversed", upTo(10, true));              // trường hợp xấu nhất
        test("mixed   ", new int[] {7, 3, 10, 1, 8, 5, 2, 9, 4, 6});
        test("sorted  ", upTo(20, false));
        test("reversed", upTo(20, true));
    }
}</code></pre>
<div class="out">sorted &nbsp;&nbsp;n=10: comparisons=9, shifts=0<br>
reversed n=10: comparisons=45, shifts=45<br>
mixed &nbsp;&nbsp;&nbsp;n=10: comparisons=30, shifts=23<br>
sorted &nbsp;&nbsp;n=20: comparisons=19, shifts=0<br>
reversed n=20: comparisons=190, shifts=190</div>
<p>Output khẳng định cả hai trường hợp: 10 số đã sắp chỉ tốn 9 phép so sánh, 20 số tốn 19 (tuyến tính); còn đầu vào sắp ngược tốn 45 và 190 (bậc hai). Với mảng lộn xộn nó cần 30 phép so sánh, trong khi sắp xếp chọn (selection sort, slide 4) cần 45.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> insertion sort là thuật toán <em>thích nghi</em> (adaptive) — càng ít phần tử sai chỗ thì chạy càng nhanh. Dữ liệu gần như đã sắp là "bạn thân" của nó.</p>
<div class="pitfall">"Insertion sort là O(n)" chỉ đúng với đầu vào đã sắp (hoặc gần sắp); trung bình và xấu nhất vẫn là O(n²). Cặp đáp án FE cần thuộc: tốt nhất O(n) — mảng đã sắp; xấu nhất O(n²) — mảng sắp ngược.</div>`],
      [8, 'Insertion sort example',
        `<p class="y-chinh">🎯 Slide 8 sorts the same array [5 2 3 8 1] with insertion sort; the table is the Java run, one row per value of i.</p>
<p>The slide illustrates this run with a figure; compare it with this trace (the bar | marks the end of the sorted part):</p>
<table>
<thead><tr><th>i</th><th>x = a[i]</th><th>Shifted right</th><th>Placed at</th><th>Array after</th></tr></thead>
<tbody>
<tr><td>start</td><td>—</td><td>—</td><td>—</td><td><code>5 | 2 3 8 1</code></td></tr>
<tr><td>1</td><td>2</td><td>5</td><td>a[0]</td><td><code>2 5 | 3 8 1</code></td></tr>
<tr><td>2</td><td>3</td><td>5</td><td>a[1]</td><td><code>2 3 5 | 8 1</code></td></tr>
<tr><td>3</td><td>8</td><td>nothing</td><td>a[3]</td><td><code>2 3 5 8 | 1</code></td></tr>
<tr><td>4</td><td>1</td><td>8, 5, 3, 2</td><td>a[0]</td><td><code>1 2 3 5 8</code></td></tr>
</tbody>
</table>
<pre><code class="language-java">public class InsertionTrace {
    // the array with a bar after the sorted part
    static String show(int[] a, int sorted) {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; a.length; i++) {
            s.append(a[i]).append(' ');
            if (i == sorted - 1 &amp;&amp; sorted &lt; a.length) s.append("| ");
        }
        return s.toString().trim();
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 3, 8, 1};                      // the array of slide 8
        System.out.println("start              : " + show(a, 1));
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i, moved = 0;
            while (j &gt; 0 &amp;&amp; x &lt; a[j - 1]) {             // shift the bigger ones right
                a[j] = a[j - 1];
                j--;
                moved++;
            }
            a[j] = x;                                   // drop x into the gap
            System.out.println("i=" + i + " x=" + x + " shifts=" + moved + " to a[" + j + "]: " + show(a, i + 1));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5 | 2 3 8 1<br>
i=1 x=2 shifts=1 to a[0]: 2 5 | 3 8 1<br>
i=2 x=3 shifts=1 to a[1]: 2 3 5 | 8 1<br>
i=3 x=8 shifts=0 to a[3]: 2 3 5 8 | 1<br>
i=4 x=1 shifts=4 to a[0]: 1 2 3 5 8</div>
<ul>
<li>The sorted part grows by one element per pass, but its elements are not final: 1 arrives in the last pass and pushes all the others right.</li>
<li>Total shifts 1 + 1 + 0 + 4 = 6 = the number of <strong>inversions</strong> of [5 2 3 8 1], i.e. pairs in the wrong order: (5,2), (5,3), (5,1), (2,1), (3,1), (8,1).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the work of insertion sort = the number of inversions. Sorted: 0 inversions → O(n); reversed: n(n−1)/2 inversions → O(n²).</p>
<div class="pitfall">Selection sort fixes the <em>front</em> for good after each pass; insertion sort only keeps the front <em>sorted</em>. After pass 2 here the front is <code>2 3 5</code>, yet none of these values is in its final place.</div>`,
        `<p class="y-chinh">🎯 Slide 8 sắp cùng mảng [5 2 3 8 1] bằng sắp xếp chèn (insertion sort); bảng dưới là lần chạy Java, mỗi giá trị i một dòng.</p>
<p>Slide minh hoạ lần chạy này bằng hình; hãy đối chiếu với bảng lần theo (trace) này (vạch | đánh dấu chỗ kết thúc phần đã sắp):</p>
<table>
<thead><tr><th>i</th><th>x = a[i]</th><th>Dời sang phải</th><th>Đặt vào</th><th>Mảng sau lượt</th></tr></thead>
<tbody>
<tr><td>bắt đầu</td><td>—</td><td>—</td><td>—</td><td><code>5 | 2 3 8 1</code></td></tr>
<tr><td>1</td><td>2</td><td>5</td><td>a[0]</td><td><code>2 5 | 3 8 1</code></td></tr>
<tr><td>2</td><td>3</td><td>5</td><td>a[1]</td><td><code>2 3 5 | 8 1</code></td></tr>
<tr><td>3</td><td>8</td><td>không có</td><td>a[3]</td><td><code>2 3 5 8 | 1</code></td></tr>
<tr><td>4</td><td>1</td><td>8, 5, 3, 2</td><td>a[0]</td><td><code>1 2 3 5 8</code></td></tr>
</tbody>
</table>
<pre><code class="language-java">public class InsertionTrace {
    // in mảng, vạch | ngăn phần đã sắp với phần còn lại
    static String show(int[] a, int sorted) {
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; a.length; i++) {
            s.append(a[i]).append(' ');
            if (i == sorted - 1 &amp;&amp; sorted &lt; a.length) s.append("| ");
        }
        return s.toString().trim();
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 3, 8, 1};                      // mảng của slide 8
        System.out.println("start              : " + show(a, 1));
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i, moved = 0;
            while (j &gt; 0 &amp;&amp; x &lt; a[j - 1]) {             // dời các phần tử lớn hơn sang phải
                a[j] = a[j - 1];
                j--;
                moved++;
            }
            a[j] = x;                                   // thả x vào chỗ trống
            System.out.println("i=" + i + " x=" + x + " shifts=" + moved + " to a[" + j + "]: " + show(a, i + 1));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 5 | 2 3 8 1<br>
i=1 x=2 shifts=1 to a[0]: 2 5 | 3 8 1<br>
i=2 x=3 shifts=1 to a[1]: 2 3 5 | 8 1<br>
i=3 x=8 shifts=0 to a[3]: 2 3 5 8 | 1<br>
i=4 x=1 shifts=4 to a[0]: 1 2 3 5 8</div>
<ul>
<li>Phần đã sắp lớn thêm một phần tử mỗi lượt, nhưng các phần tử trong đó chưa ở chỗ cuối cùng: số 1 tới ở lượt cuối và đẩy tất cả sang phải.</li>
<li>Tổng số lần dời (shift) 1 + 1 + 0 + 4 = 6 = số <strong>nghịch thế (inversion)</strong> của [5 2 3 8 1], tức số cặp đứng sai thứ tự: (5,2), (5,3), (5,1), (2,1), (3,1), (8,1).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khối lượng việc của insertion sort = số nghịch thế. Mảng đã sắp: 0 nghịch thế → O(n); sắp ngược: n(n−1)/2 nghịch thế → O(n²).</p>
<div class="pitfall">Sắp xếp chọn (selection sort) chốt hẳn phần <em>đầu</em> sau mỗi lượt; insertion sort chỉ giữ phần đầu <em>có thứ tự</em>. Sau lượt 2 ở đây phần đầu là <code>2 3 5</code>, nhưng không giá trị nào trong đó đã ở chỗ cuối cùng.</div>`],
      [9, 'Insertion sort code',
        `<p class="y-chinh">🎯 The slide's <code>insertSort()</code> is slide 7's pseudocode in Java: save <code>x=a[i]</code>, shift while <code>j&gt;0 &amp;&amp; x&lt;a[j-1]</code>, then write <code>a[j]=x</code>.</p>
<ul>
<li><code>x=a[i]</code> must be saved first: the first shift <code>a[j]=a[j-1]</code> (with j = i) overwrites a[i].</li>
<li><code>j&gt;0</code> stops at the left end of the array; <code>x&lt;a[j-1]</code> stops at the first element that is not bigger. The test is a strict <code>&lt;</code>, so an element never jumps over an equal one: insertion sort is <strong>stable</strong>.</li>
<li>The text of the slide ends with three closing braces where the method needs two — the third probably closes a class the slide does not show. The program keeps the method with its two braces (the <code>;</code> after the while block is an empty statement, legal Java).</li>
</ul>
<pre><code class="language-java">class ElemSort {
    int[] a; int n;

    ElemSort(int[] b) { a = b; n = b.length; }           // not on the slide: store the array
    void display() {
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
        System.out.println();
    }

    void insertSort()
    {  int i,j,x;
       for(i=1;i&lt;n;i++)
       { x=a[i]; j=i;
         while(j&gt;0 &amp;&amp; x&lt;a[j-1])
         { a[j]=a[j-1];  j--;
         };
         a[j]=x;
       }
    }

    // the two conditions written in the other order
    void insertSortSwapped()
    {  int i,j,x;
       for(i=1;i&lt;n;i++)
       { x=a[i]; j=i;
         while(x&lt;a[j-1] &amp;&amp; j&gt;0)                          // a[j-1] is read before j&gt;0 is checked
         { a[j]=a[j-1];  j--;
         };
         a[j]=x;
       }
    }
}

public class InsertSortSlide {
    public static void main(String[] args) {
        ElemSort t = new ElemSort(new int[] {5, 2, 3, 8, 1});
        t.insertSort();
        System.out.print("slide code, [5 2 3 8 1] -&gt; "); t.display();
        t = new ElemSort(new int[] {5, 2, 3, 8, 1});
        try {
            t.insertSortSwapped();
            System.out.print("swapped conditions      -&gt; "); t.display();
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("swapped conditions      -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">slide code, [5 2 3 8 1] -&gt; 1 2 3 5 8<br>
swapped conditions &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ArrayIndexOutOfBoundsException</div>
<p><strong>Big-O:</strong> the <code>for</code> runs n−1 times and the <code>while</code> at most i times → at most n(n−1)/2 shifts, O(n²); at least one comparison per i → O(n) when nothing moves.</p>
<div class="pitfall">The order of the two conditions matters. <code>while(x&lt;a[j-1] &amp;&amp; j&gt;0)</code> reads <code>a[j-1]</code> before checking <code>j&gt;0</code>, so when j reaches 0 it reads a[−1] → <code>ArrayIndexOutOfBoundsException</code> (second line of the output). Java's <code>&amp;&amp;</code> is evaluated left to right and stops at the first false — put the bounds check first.</div>`,
        `<p class="y-chinh">🎯 Hàm <code>insertSort()</code> của slide là mã giả của slide 7 viết bằng Java: cất <code>x=a[i]</code>, dời phần tử chừng nào <code>j&gt;0 &amp;&amp; x&lt;a[j-1]</code>, rồi ghi <code>a[j]=x</code>.</p>
<ul>
<li>Phải cất <code>x=a[i]</code> trước: lần dời đầu tiên <code>a[j]=a[j-1]</code> (với j = i) ghi đè lên a[i].</li>
<li><code>j&gt;0</code> dừng ở đầu trái của mảng; <code>x&lt;a[j-1]</code> dừng ở phần tử đầu tiên không lớn hơn x. Phép so sánh là <code>&lt;</code> ngặt, nên một phần tử không bao giờ nhảy qua phần tử bằng nó: sắp xếp chèn (insertion sort) là thuật toán <strong>ổn định (stable)</strong>.</li>
<li>Chữ trên slide kết thúc bằng ba dấu đóng ngoặc trong khi phương thức chỉ cần hai — dấu thứ ba có lẽ đóng một lớp (class) mà slide không chiếu. Chương trình giữ phương thức với đúng hai dấu (dấu <code>;</code> sau khối while là câu lệnh rỗng, hợp lệ trong Java).</li>
</ul>
<pre><code class="language-java">class ElemSort {
    int[] a; int n;

    ElemSort(int[] b) { a = b; n = b.length; }           // không có trên slide: giữ mảng cần sắp
    void display() {
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
        System.out.println();
    }

    void insertSort()
    {  int i,j,x;
       for(i=1;i&lt;n;i++)
       { x=a[i]; j=i;
         while(j&gt;0 &amp;&amp; x&lt;a[j-1])
         { a[j]=a[j-1];  j--;
         };
         a[j]=x;
       }
    }

    // hai điều kiện viết đảo thứ tự
    void insertSortSwapped()
    {  int i,j,x;
       for(i=1;i&lt;n;i++)
       { x=a[i]; j=i;
         while(x&lt;a[j-1] &amp;&amp; j&gt;0)                          // đọc a[j-1] trước khi kiểm j&gt;0
         { a[j]=a[j-1];  j--;
         };
         a[j]=x;
       }
    }
}

public class InsertSortSlide {
    public static void main(String[] args) {
        ElemSort t = new ElemSort(new int[] {5, 2, 3, 8, 1});
        t.insertSort();
        System.out.print("slide code, [5 2 3 8 1] -&gt; "); t.display();
        t = new ElemSort(new int[] {5, 2, 3, 8, 1});
        try {
            t.insertSortSwapped();
            System.out.print("swapped conditions      -&gt; "); t.display();
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("swapped conditions      -&gt; " + e.getClass().getSimpleName());
        }
    }
}</code></pre>
<div class="out">slide code, [5 2 3 8 1] -&gt; 1 2 3 5 8<br>
swapped conditions &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; ArrayIndexOutOfBoundsException</div>
<p><strong>Big-O:</strong> vòng <code>for</code> chạy n−1 lần, vòng <code>while</code> nhiều nhất i lần → nhiều nhất n(n−1)/2 lần dời, O(n²); mỗi i ít nhất một phép so sánh → O(n) khi không phải dời gì.</p>
<div class="pitfall">Thứ tự hai điều kiện rất quan trọng. <code>while(x&lt;a[j-1] &amp;&amp; j&gt;0)</code> đọc <code>a[j-1]</code> trước khi kiểm tra <code>j&gt;0</code>, nên khi j về 0 nó đọc a[−1] → <code>ArrayIndexOutOfBoundsException</code> (dòng thứ hai của output). Toán tử <code>&amp;&amp;</code> của Java tính từ trái sang phải và dừng ở vế sai đầu tiên — hãy đặt phép kiểm tra biên lên trước.</div>`],
      [10, 'Bubble sort',
        `<p class="y-chinh">🎯 Bubble sort compares neighbours a[i] and a[i+1] and swaps them when they are out of order; the flag <code>swapped</code> stops it after the first pass without a swap.</p>
<ul>
<li>One pass (i = 0 … n−2) carries the largest remaining value to the end, like a bubble rising to the surface.</li>
<li><code>do … while(swapped)</code>: a pass with no swap proves the array is sorted. That is why the best case (sorted input) is <strong>O(n)</strong>: one pass, n−1 comparisons.</li>
<li>Worst case <strong>O(n²)</strong>: up to n passes of n−1 comparisons each (reversed input).</li>
<li>The slide's version scans up to n−2 in every pass; a common improvement also shortens the scan by one each pass, since the tail is already final.</li>
</ul>
<pre><code class="language-java">class ElemSort {
    int[] a; int n;
    int comps;                                           // added: counts a[i]&gt;a[i+1]

    ElemSort(int[] b) { a = b; n = b.length; }           // not on the slide: store the array
    void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
    String show() {
        String s = "";
        for (int i = 0; i &lt; n; i++) s += a[i] + " ";
        return s.trim();
    }

    void bubbleSort()
    { int i; boolean swapped;
      int pass = 0;                                      // added
      do
      { swapped=false;
        for(i=0;i&lt;n-1;i++)
        { comps++;                                       // added
          if(a[i]&gt;a[i+1])
          { swap(a,i,i+1);
            swapped=true;
          }
        }
        pass++;                                          // added: print every pass
        System.out.println("  pass " + pass + ": " + show() + (swapped ? "" : "   no swap -&gt; stop"));
      }
      while(swapped);
    }
}

public class BubbleSortSlide {
    public static void main(String[] args) {
        int[][] tests = {{5, 2, 3, 8, 1}, {1, 2, 3, 5, 8}};
        for (int[] b : tests) {
            ElemSort t = new ElemSort(b);
            System.out.println("start " + t.show());
            t.bubbleSort();
            System.out.println("  comparisons = " + t.comps);
        }
    }
}</code></pre>
<div class="out">start 5 2 3 8 1<br>
&nbsp;&nbsp;pass 1: 2 3 5 1 8<br>
&nbsp;&nbsp;pass 2: 2 3 1 5 8<br>
&nbsp;&nbsp;pass 3: 2 1 3 5 8<br>
&nbsp;&nbsp;pass 4: 1 2 3 5 8<br>
&nbsp;&nbsp;pass 5: 1 2 3 5 8 &nbsp;&nbsp;no swap -&gt; stop<br>
&nbsp;&nbsp;comparisons = 20<br>
start 1 2 3 5 8<br>
&nbsp;&nbsp;pass 1: 1 2 3 5 8 &nbsp;&nbsp;no swap -&gt; stop<br>
&nbsp;&nbsp;comparisons = 4</div>
<p>The method is the slide's code plus three lines that count and print. Which elementary sort is best (syllabus question CQ14.2)? The same five students, in alphabetical order, sorted by score with the three slide versions:</p>
<pre><code class="language-java">import java.util.Arrays;

class Rec {                                              // a student: score + name
    int key; String name;
    Rec(int key, String name) { this.key = key; this.name = name; }
    public String toString() { return key + name; }
}

public class ElementaryCompare {
    static int comps;
    static boolean less(Rec x, Rec y) { comps++; return x.key &lt; y.key; }   // compare scores only
    static void swap(Rec[] a, int i, int j) { Rec t = a[i]; a[i] = a[j]; a[j] = t; }

    static void selectSort(Rec[] a) {                    // slide 6: if(a[j]&lt;min) ... swap(a,i,k)
        for (int i = 0; i &lt; a.length - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; a.length; j++) if (less(a[j], a[k])) k = j;
            if (k != i) swap(a, i, k);
        }
    }
    static void insertSort(Rec[] a) {                    // slide 9: while(j&gt;0 &amp;&amp; x&lt;a[j-1])
        for (int i = 1; i &lt; a.length; i++) {
            Rec x = a[i]; int j = i;
            while (j &gt; 0 &amp;&amp; less(x, a[j - 1])) { a[j] = a[j - 1]; j--; }
            a[j] = x;
        }
    }
    static void bubbleSort(Rec[] a) {                    // slide 10: if(a[i]&gt;a[i+1])
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i &lt; a.length - 1; i++)
                if (less(a[i + 1], a[i])) { swap(a, i, i + 1); swapped = true; }
        } while (swapped);
    }

    // input is in alphabetical order of names
    static Rec[] data() {
        return new Rec[] {new Rec(8, "An"), new Rec(8, "Binh"), new Rec(5, "Chi"), new Rec(9, "Dung"), new Rec(9, "Em")};
    }
    static boolean stable(Rec[] a) {                     // equal scores still in ABC order?
        for (int i = 1; i &lt; a.length; i++)
            if (a[i].key == a[i - 1].key &amp;&amp; a[i].name.compareTo(a[i - 1].name) &lt; 0) return false;
        return true;
    }
    static void report(String name, Rec[] a) {
        System.out.println(name + Arrays.toString(a) + "  stable=" + stable(a) + "  comparisons=" + comps);
    }

    public static void main(String[] args) {
        System.out.println("input     " + Arrays.toString(data()));
        Rec[] a;
        comps = 0; a = data(); selectSort(a); report("selection ", a);
        comps = 0; a = data(); insertSort(a); report("insertion ", a);
        comps = 0; a = data(); bubbleSort(a); report("bubble    ", a);
    }
}</code></pre>
<div class="out">input &nbsp;&nbsp;&nbsp;&nbsp;[8An, 8Binh, 5Chi, 9Dung, 9Em]<br>
selection [5Chi, 8Binh, 8An, 9Dung, 9Em] &nbsp;stable=false &nbsp;comparisons=10<br>
insertion [5Chi, 8An, 8Binh, 9Dung, 9Em] &nbsp;stable=true &nbsp;comparisons=5<br>
bubble &nbsp;&nbsp;&nbsp;[5Chi, 8An, 8Binh, 9Dung, 9Em] &nbsp;stable=true &nbsp;comparisons=12</div>
<p class="dap-an">✅ <strong>Answer (CQ14.2):</strong> all three are O(n²) in the worst case, but insertion sort is usually the fastest in practice — each insertion stops as early as possible (5 comparisons here; 30 against selection's 45 on slide 7) and it is O(n) on sorted data. Selection sort makes the fewest swaps (≤ n−1) but always n(n−1)/2 comparisons, and it is the only one of the three that is not stable: 8Binh jumped ahead of 8An. Bubble sort usually makes the most comparisons and swaps.</p>
<div class="pitfall">Writing <code>a[i]&gt;=a[i+1]</code> instead of <code>&gt;</code> is worse than unstable: two equal neighbours are swapped in every pass, <code>swapped</code> never stays false, and the <code>do … while</code> loops forever. Keep the strict <code>&gt;</code>.</div>`,
        `<p class="y-chinh">🎯 Sắp xếp nổi bọt (bubble sort) so hai phần tử kề nhau a[i] và a[i+1], đổi chỗ khi chúng sai thứ tự; cờ (flag) <code>swapped</code> cho nó dừng sau lượt đầu tiên không đổi chỗ lần nào.</p>
<ul>
<li>Một lượt (i = 0 … n−2) mang giá trị lớn nhất còn lại về cuối, như bọt khí nổi lên mặt nước.</li>
<li><code>do … while(swapped)</code>: một lượt không đổi chỗ nào chứng tỏ mảng đã sắp. Vì vậy trường hợp tốt nhất (mảng đã sắp) là <strong>O(n)</strong>: một lượt, n−1 phép so sánh.</li>
<li>Xấu nhất <strong>O(n²)</strong>: tới n lượt, mỗi lượt n−1 phép so sánh (mảng sắp ngược).</li>
<li>Bản trên slide lượt nào cũng quét tới n−2; cách cải tiến hay gặp là mỗi lượt quét ngắn đi một ô, vì phần đuôi đã ở đúng chỗ.</li>
</ul>
<pre><code class="language-java">class ElemSort {
    int[] a; int n;
    int comps;                                           // thêm: đếm số lần so sánh a[i]&gt;a[i+1]

    ElemSort(int[] b) { a = b; n = b.length; }           // không có trên slide: giữ mảng cần sắp
    void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
    String show() {
        String s = "";
        for (int i = 0; i &lt; n; i++) s += a[i] + " ";
        return s.trim();
    }

    void bubbleSort()
    { int i; boolean swapped;
      int pass = 0;                                      // thêm
      do
      { swapped=false;
        for(i=0;i&lt;n-1;i++)
        { comps++;                                       // thêm
          if(a[i]&gt;a[i+1])
          { swap(a,i,i+1);
            swapped=true;
          }
        }
        pass++;                                          // thêm: in sau mỗi lượt
        System.out.println("  pass " + pass + ": " + show() + (swapped ? "" : "   no swap -&gt; stop"));
      }
      while(swapped);
    }
}

public class BubbleSortSlide {
    public static void main(String[] args) {
        int[][] tests = {{5, 2, 3, 8, 1}, {1, 2, 3, 5, 8}};
        for (int[] b : tests) {
            ElemSort t = new ElemSort(b);
            System.out.println("start " + t.show());
            t.bubbleSort();
            System.out.println("  comparisons = " + t.comps);
        }
    }
}</code></pre>
<div class="out">start 5 2 3 8 1<br>
&nbsp;&nbsp;pass 1: 2 3 5 1 8<br>
&nbsp;&nbsp;pass 2: 2 3 1 5 8<br>
&nbsp;&nbsp;pass 3: 2 1 3 5 8<br>
&nbsp;&nbsp;pass 4: 1 2 3 5 8<br>
&nbsp;&nbsp;pass 5: 1 2 3 5 8 &nbsp;&nbsp;no swap -&gt; stop<br>
&nbsp;&nbsp;comparisons = 20<br>
start 1 2 3 5 8<br>
&nbsp;&nbsp;pass 1: 1 2 3 5 8 &nbsp;&nbsp;no swap -&gt; stop<br>
&nbsp;&nbsp;comparisons = 4</div>
<p>Phương thức là code của slide thêm ba dòng để đếm và in. Vậy thuật toán cơ bản nào tốt nhất (câu hỏi CQ14.2 của syllabus)? Cùng năm sinh viên, đang theo thứ tự ABC của tên, sắp theo điểm bằng ba bản của slide:</p>
<pre><code class="language-java">import java.util.Arrays;

class Rec {                                              // một sinh viên: điểm + tên
    int key; String name;
    Rec(int key, String name) { this.key = key; this.name = name; }
    public String toString() { return key + name; }
}

public class ElementaryCompare {
    static int comps;
    static boolean less(Rec x, Rec y) { comps++; return x.key &lt; y.key; }   // chỉ so điểm
    static void swap(Rec[] a, int i, int j) { Rec t = a[i]; a[i] = a[j]; a[j] = t; }

    static void selectSort(Rec[] a) {                    // slide 6
        for (int i = 0; i &lt; a.length - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; a.length; j++) if (less(a[j], a[k])) k = j;
            if (k != i) swap(a, i, k);
        }
    }
    static void insertSort(Rec[] a) {                    // slide 9
        for (int i = 1; i &lt; a.length; i++) {
            Rec x = a[i]; int j = i;
            while (j &gt; 0 &amp;&amp; less(x, a[j - 1])) { a[j] = a[j - 1]; j--; }
            a[j] = x;
        }
    }
    static void bubbleSort(Rec[] a) {                    // slide 10
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i &lt; a.length - 1; i++)
                if (less(a[i + 1], a[i])) { swap(a, i, i + 1); swapped = true; }
        } while (swapped);
    }

    // đầu vào đang theo thứ tự ABC của tên
    static Rec[] data() {
        return new Rec[] {new Rec(8, "An"), new Rec(8, "Binh"), new Rec(5, "Chi"), new Rec(9, "Dung"), new Rec(9, "Em")};
    }
    static boolean stable(Rec[] a) {                     // điểm bằng nhau còn theo ABC?
        for (int i = 1; i &lt; a.length; i++)
            if (a[i].key == a[i - 1].key &amp;&amp; a[i].name.compareTo(a[i - 1].name) &lt; 0) return false;
        return true;
    }
    static void report(String name, Rec[] a) {
        System.out.println(name + Arrays.toString(a) + "  stable=" + stable(a) + "  comparisons=" + comps);
    }

    public static void main(String[] args) {
        System.out.println("input     " + Arrays.toString(data()));
        Rec[] a;
        comps = 0; a = data(); selectSort(a); report("selection ", a);
        comps = 0; a = data(); insertSort(a); report("insertion ", a);
        comps = 0; a = data(); bubbleSort(a); report("bubble    ", a);
    }
}</code></pre>
<div class="out">input &nbsp;&nbsp;&nbsp;&nbsp;[8An, 8Binh, 5Chi, 9Dung, 9Em]<br>
selection [5Chi, 8Binh, 8An, 9Dung, 9Em] &nbsp;stable=false &nbsp;comparisons=10<br>
insertion [5Chi, 8An, 8Binh, 9Dung, 9Em] &nbsp;stable=true &nbsp;comparisons=5<br>
bubble &nbsp;&nbsp;&nbsp;[5Chi, 8An, 8Binh, 9Dung, 9Em] &nbsp;stable=true &nbsp;comparisons=12</div>
<p class="dap-an">✅ <strong>Đáp án (CQ14.2):</strong> cả ba đều O(n²) ở trường hợp xấu nhất, nhưng sắp xếp chèn (insertion sort) thường nhanh nhất trong thực tế — mỗi lần chèn dừng sớm nhất có thể (ở đây 5 phép so sánh; ở slide 7 là 30 so với 45 của sắp xếp chọn — selection sort) và là O(n) với dữ liệu đã sắp. Selection sort đổi chỗ ít nhất (≤ n−1) nhưng luôn tốn n(n−1)/2 phép so sánh, và là thuật toán duy nhất trong ba cái không ổn định (stable): 8Binh đã nhảy lên trước 8An. Bubble sort thường tốn nhiều phép so sánh và đổi chỗ nhất.</p>
<div class="pitfall">Viết <code>a[i]&gt;=a[i+1]</code> thay cho <code>&gt;</code> còn tệ hơn mất ổn định: hai phần tử bằng nhau đứng cạnh nhau bị đổi chỗ ở mọi lượt, <code>swapped</code> không bao giờ còn <code>false</code>, và vòng <code>do … while</code> lặp mãi mãi. Hãy giữ dấu <code>&gt;</code> ngặt.</div>`],
      [11, 'Efficient Sorting Algorithms',
        `<p class="y-chinh">🎯 Section 2 of the deck: sorts that beat O(n²) — quicksort, merge sort and heap sort reach O(n log n), and radix sort avoids comparisons altogether.</p>
<p class="ghi-chu">This slide carries only the section title (no other text could be extracted); the block below introduces the section.</p>
<p>Why n log n matters: for n = 1,000,000 elements, n² = 10¹² steps — about 17 minutes at a billion steps per second — while n log₂ n ≈ 2 × 10⁷ steps take about 0.02 s.</p>
<table>
<thead><tr><th>Algorithm</th><th>How it splits the work</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>quicksort</td><td>partition around a pivot, then sort both sides</td><td>12–30</td></tr>
<tr><td>merge sort</td><td>cut in halves without looking, then merge the sorted halves</td><td>31–33</td></tr>
<tr><td>heap sort</td><td>build a max heap, then move its root to the end n−1 times</td><td>34–37</td></tr>
<tr><td>radix sort</td><td>distribute by digits, one digit per pass — no comparisons</td><td>38–39</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Phần 2 của bộ slide: các thuật toán vượt được O(n²) — sắp xếp nhanh (quicksort), sắp xếp trộn (merge sort) và sắp xếp vun đống (heap sort) đạt O(n log n), còn sắp xếp theo cơ số (radix sort) thì không cần so sánh gì cả.</p>
<p class="ghi-chu">Slide này chỉ có tiêu đề phần (không trích được chữ nào khác); khối dưới đây giới thiệu phần này.</p>
<p>Vì sao n log n đáng giá: với n = 1.000.000 phần tử, n² = 10¹² bước — khoảng 17 phút nếu máy làm một tỉ bước mỗi giây — còn n log₂ n ≈ 2 × 10⁷ bước chỉ mất khoảng 0,02 giây.</p>
<table>
<thead><tr><th>Thuật toán</th><th>Cách chia công việc</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>sắp xếp nhanh (quicksort)</td><td>phân hoạch (partition) quanh một chốt (pivot), rồi sắp hai bên</td><td>12–30</td></tr>
<tr><td>sắp xếp trộn (merge sort)</td><td>cắt đôi không cần nhìn giá trị, rồi trộn (merge) hai nửa đã sắp</td><td>31–33</td></tr>
<tr><td>sắp xếp vun đống (heap sort)</td><td>dựng một đống max (max heap), rồi n−1 lần đưa gốc về cuối</td><td>34–37</td></tr>
<tr><td>sắp xếp theo cơ số (radix sort)</td><td>chia theo chữ số, mỗi lượt một chữ số — không so sánh</td><td>38–39</td></tr>
</tbody>
</table>`],
      [12, 'Quicksort - 1',
        `<p class="y-chinh">🎯 Quicksort, invented by C.A.R. (Tony) Hoare around 1960, is a divide-and-conquer sort with two phases: partition the array around a pivot, then sort the two parts the same way.</p>
<ul>
<li><strong>Divide and conquer</strong>: split a problem into smaller problems of the same kind, solve them (here recursively), combine the results.</li>
<li><strong>Partition phase</strong> ("divides the work into half"): one pass rearranges the array so that small elements are left of the pivot and big ones right of it — the pivot is then in its final place.</li>
<li><strong>Sort phase</strong> ("conquers the halves"): quicksort each part. Nothing has to be combined afterwards — the two parts are already in the right order relative to each other.</li>
<li>Merge sort (slide 31) is the mirror image: dividing is trivial and the work is in combining (merging).</li>
</ul>
<p><strong>Big-O preview:</strong> if every partition halves its part, there are about log₂ n levels of recursion and each level partitions n elements in total, O(n) → O(n log n). Slide 16 shows when this fails.</p>
<p class="dap-an">✅ <strong>Syllabus question CQ15.1 — what is quicksort, what is its key idea?</strong> A divide-and-conquer sort whose key step, partition, puts one element (the pivot) into its final position and splits the others into two independent smaller problems.</p>
<p class="meo">🧠 <strong>Remember:</strong> quicksort works hard <em>before</em> the recursion (partition), merge sort works hard <em>after</em> it (merge).</p>`,
        `<p class="y-chinh">🎯 Sắp xếp nhanh (quicksort), do C.A.R. (Tony) Hoare nghĩ ra khoảng năm 1960, là thuật toán chia để trị (divide and conquer) gồm hai pha: phân hoạch (partition) mảng quanh một chốt (pivot), rồi sắp hai phần theo đúng cách đó.</p>
<ul>
<li><strong>Chia để trị</strong>: tách bài toán thành các bài toán nhỏ hơn cùng loại, giải chúng (ở đây bằng đệ quy — recursion), rồi ghép kết quả.</li>
<li><strong>Pha phân hoạch</strong> ("chia công việc làm đôi"): một lượt quét sắp lại mảng sao cho phần tử nhỏ nằm bên trái chốt, phần tử lớn nằm bên phải — khi đó chốt đã ở đúng chỗ cuối cùng.</li>
<li><strong>Pha sắp xếp</strong> ("trị hai nửa"): quicksort từng phần. Sau đó không phải ghép gì cả — hai phần đã đúng thứ tự so với nhau.</li>
<li>Sắp xếp trộn (merge sort, slide 31) thì ngược lại: chia rất dễ, công sức nằm ở bước ghép (trộn — merge).</li>
</ul>
<p><strong>Xem trước Big-O:</strong> nếu lần phân hoạch nào cũng chia đôi phần của nó thì có khoảng log₂ n tầng đệ quy, mỗi tầng phân hoạch tổng cộng n phần tử, tốn O(n) → O(n log n). Slide 16 cho thấy khi nào điều này không còn đúng.</p>
<p class="dap-an">✅ <strong>Câu hỏi CQ15.1 của syllabus — quicksort là gì, ý tưởng then chốt?</strong> Là thuật toán chia để trị mà bước then chốt, phân hoạch, đưa một phần tử (chốt) về đúng vị trí cuối cùng và tách các phần tử còn lại thành hai bài toán nhỏ hơn, độc lập với nhau.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> quicksort làm việc nặng <em>trước</em> khi đệ quy (phân hoạch), merge sort làm việc nặng <em>sau</em> khi đệ quy (trộn).</p>`],
      [13, 'Quicksort - 2: partition and conquer',
        `<p class="y-chinh">🎯 Partition = choose a pivot and find its position so that everything on its left is ≤ pivot and everything on its right is > pivot; conquer = apply the same algorithm to each side.</p>
<ul>
<li>The labels on the slide — ≤ pivot, pivot, > pivot, then ≤ p′, p′, > p′ and ≤ p″, p″, > p″ — describe the picture <code>[ ≤ pivot | pivot | &gt; pivot ]</code>, with each side split again around its own pivot p′ and p″.</li>
<li>After a partition the pivot never moves again: with all smaller-or-equal values on its left and all bigger ones on its right, that is exactly its place in the sorted array.</li>
<li>The recursion stops on parts of 0 or 1 element — they are sorted already.</li>
</ul>
<p>The program follows the slide's picture literally, using new lists instead of moves inside the array (the in-place version is the subject of slides 14–15):</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class QuickIdea {
    // quicksort written for clarity, not speed: new lists instead of in-place moves
    static List&lt;Integer&gt; sort(List&lt;Integer&gt; a, String indent) {
        if (a.size() &lt;= 1) return a;                      // 0 or 1 element: nothing to do
        int pivot = a.get(0);                             // 1. choose a pivot
        List&lt;Integer&gt; left = new ArrayList&lt;Integer&gt;(), right = new ArrayList&lt;Integer&gt;();
        for (int i = 1; i &lt; a.size(); i++)                // 2. partition
            if (a.get(i) &lt;= pivot) left.add(a.get(i)); else right.add(a.get(i));
        System.out.println(indent + a + " -&gt; " + left + " " + pivot + " " + right);
        List&lt;Integer&gt; res = new ArrayList&lt;Integer&gt;(sort(left, indent + "   "));   // 3. conquer each side
        res.add(pivot);
        res.addAll(sort(right, indent + "   "));
        return res;
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; a = Arrays.asList(6, 3, 8, 1, 9, 5, 2, 7);
        List&lt;Integer&gt; s = sort(a, "");
        System.out.println("sorted: " + s);
    }
}</code></pre>
<div class="out">[6, 3, 8, 1, 9, 5, 2, 7] -&gt; [3, 1, 5, 2] 6 [8, 9, 7]<br>
&nbsp;&nbsp;&nbsp;[3, 1, 5, 2] -&gt; [1, 2] 3 [5]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 2] -&gt; [] 1 [2]<br>
&nbsp;&nbsp;&nbsp;[8, 9, 7] -&gt; [7] 8 [9]<br>
sorted: [1, 2, 3, 5, 6, 7, 8, 9]</div>
<p>Read the output like the slide's picture: 6 splits the array into [3, 1, 5, 2] (≤ 6) and [8, 9, 7] (> 6); then 3 plays the role of p′ on the left and 8 the role of p″ on the right.</p>
<div class="pitfall">Partition does NOT sort the sides: after the first line, [3, 1, 5, 2] is still unsorted. Only the pivot is guaranteed to be in place — sorting the sides in your answer is a frequent mistake in FE trace questions.</div>`,
        `<p class="y-chinh">🎯 Phân hoạch (partition) = chọn một chốt (pivot) rồi tìm vị trí cho nó sao cho mọi phần tử bên trái ≤ chốt và mọi phần tử bên phải > chốt; trị (conquer) = áp dụng lại đúng thuật toán đó cho từng bên.</p>
<ul>
<li>Các nhãn trên slide — ≤ pivot, pivot, > pivot, rồi ≤ p′, p′, > p′ và ≤ p″, p″, > p″ — mô tả hình <code>[ ≤ chốt | chốt | &gt; chốt ]</code>, mỗi bên lại được chia tiếp quanh chốt riêng của nó là p′ và p″.</li>
<li>Sau một lần phân hoạch, chốt không bao giờ di chuyển nữa: bên trái toàn giá trị nhỏ hơn hoặc bằng, bên phải toàn giá trị lớn hơn, nên đó đúng là chỗ của nó trong mảng đã sắp.</li>
<li>Đệ quy (recursion) dừng ở các phần có 0 hoặc 1 phần tử — chúng vốn đã có thứ tự.</li>
</ul>
<p>Chương trình dưới làm đúng như hình của slide, dùng các danh sách (list) mới thay vì đổi chỗ ngay trong mảng (bản phân hoạch tại chỗ — in-place — là nội dung của slide 14–15):</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class QuickIdea {
    // quicksort viết cho dễ hiểu, không tối ưu: tạo list mới thay vì đổi chỗ tại chỗ
    static List&lt;Integer&gt; sort(List&lt;Integer&gt; a, String indent) {
        if (a.size() &lt;= 1) return a;                      // 0 hoặc 1 phần tử: không phải làm gì
        int pivot = a.get(0);                             // 1. chọn chốt
        List&lt;Integer&gt; left = new ArrayList&lt;Integer&gt;(), right = new ArrayList&lt;Integer&gt;();
        for (int i = 1; i &lt; a.size(); i++)                // 2. phân hoạch
            if (a.get(i) &lt;= pivot) left.add(a.get(i)); else right.add(a.get(i));
        System.out.println(indent + a + " -&gt; " + left + " " + pivot + " " + right);
        List&lt;Integer&gt; res = new ArrayList&lt;Integer&gt;(sort(left, indent + "   "));   // 3. trị từng bên
        res.add(pivot);
        res.addAll(sort(right, indent + "   "));
        return res;
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; a = Arrays.asList(6, 3, 8, 1, 9, 5, 2, 7);
        List&lt;Integer&gt; s = sort(a, "");
        System.out.println("sorted: " + s);
    }
}</code></pre>
<div class="out">[6, 3, 8, 1, 9, 5, 2, 7] -&gt; [3, 1, 5, 2] 6 [8, 9, 7]<br>
&nbsp;&nbsp;&nbsp;[3, 1, 5, 2] -&gt; [1, 2] 3 [5]<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1, 2] -&gt; [] 1 [2]<br>
&nbsp;&nbsp;&nbsp;[8, 9, 7] -&gt; [7] 8 [9]<br>
sorted: [1, 2, 3, 5, 6, 7, 8, 9]</div>
<p>Đọc output như đọc hình trên slide: 6 chia mảng thành [3, 1, 5, 2] (≤ 6) và [8, 9, 7] (> 6); sau đó 3 đóng vai p′ ở bên trái, 8 đóng vai p″ ở bên phải.</p>
<div class="pitfall">Phân hoạch KHÔNG sắp xếp hai bên: sau dòng đầu tiên, [3, 1, 5, 2] vẫn lộn xộn. Chỉ có chốt là chắc chắn đã đúng chỗ — tự ý sắp luôn hai bên khi trả lời là lỗi rất hay gặp ở câu hỏi lần theo (trace) trong đề FE.</div>`],
      [14, 'Quicksort - 3 (figure)',
        `<p class="y-chinh">🎯 Between the idea (slide 13) and the code (slide 15) the missing piece is how to partition inside the array itself, with two indices and swaps.</p>
<p class="ghi-chu">Slide 14 is a picture and no text could be extracted from it; this block teaches the step it sits on — partitioning in place.</p>
<p>One standard in-place method — the one used on slides 15–30 of this lesson. The pivot is the first element a[p]; index i scans from the left, index j from the right:</p>
<pre><code class="language-plaintext"> p     p+1 ... i-1      i ... j       j+1 ... r
[pivot][  &lt;= pivot  ][ not seen yet ][  &gt; pivot  ]</code></pre>
<ol>
<li>Move i right while a[i] ≤ pivot: it stops on an element that belongs to the right side.</li>
<li>Move j left while a[j] > pivot: it stops on an element that belongs to the left side.</li>
<li>If i &lt; j, both stand on the wrong side: swap them and repeat from step 1. If i ≥ j, the scans have crossed: stop.</li>
<li>Swap the pivot a[p] with a[j]: the pivot lands at index j, its final place.</li>
</ol>
<p><strong>Big-O:</strong> the "not seen yet" zone shrinks from both ends and every element is examined about once → one partition of m elements costs O(m), with no extra array.</p>
<p class="meo">🧠 <strong>Remember:</strong> i hunts for a big one, j hunts for a small one, swap them, repeat; when they cross, the pivot goes to j.</p>`,
        `<p class="y-chinh">🎯 Giữa ý tưởng (slide 13) và code (slide 15), mảnh còn thiếu là cách phân hoạch ngay bên trong mảng, bằng hai chỉ số (index) và các lần đổi chỗ (swap).</p>
<p class="ghi-chu">Slide 14 là hình và không trích được chữ nào; khối này dạy bước mà nó nằm ở giữa — phân hoạch tại chỗ (in-place partition).</p>
<p>Một cách phân hoạch tại chỗ chuẩn — cũng là cách dùng từ slide 15 tới 30 của bài. Chốt (pivot) là phần tử đầu a[p]; chỉ số i quét từ trái sang, chỉ số j quét từ phải sang:</p>
<pre><code class="language-plaintext"> p     p+1 ... i-1      i ... j       j+1 ... r
[chot ][  &lt;= chot    ][ chua xet     ][   &gt; chot  ]</code></pre>
<ol>
<li>Cho i sang phải chừng nào a[i] ≤ chốt: i dừng ở một phần tử thuộc về bên phải.</li>
<li>Cho j sang trái chừng nào a[j] > chốt: j dừng ở một phần tử thuộc về bên trái.</li>
<li>Nếu i &lt; j thì cả hai đang đứng sai phía: đổi chỗ chúng rồi làm lại từ bước 1. Nếu i ≥ j thì hai lượt quét đã vượt qua nhau: dừng.</li>
<li>Đổi chốt a[p] với a[j]: chốt rơi vào chỉ số j, đúng chỗ cuối cùng của nó.</li>
</ol>
<p><strong>Big-O:</strong> vùng "chưa xét" co lại từ hai đầu và mỗi phần tử được xét khoảng một lần → một lần phân hoạch m phần tử tốn O(m), không cần mảng phụ.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> i đi tìm một số lớn, j đi tìm một số nhỏ, đổi chỗ chúng, lặp lại; khi hai bên gặp nhau thì chốt về chỗ j.</p>`],
      [15, 'Quicksort code (figure)',
        `<p class="y-chinh">🎯 One standard implementation of the partition of slide 14 plus the two recursive calls — the whole quicksort in about 20 lines.</p>
<p class="ghi-chu">The code on this slide is a picture, not text: the program below is the lesson's standard version, not a copy of the slide — the slide's code may differ in details (pivot position, <code>&lt;</code> or <code>&lt;=</code>, loop shape), not in the idea.</p>
<pre><code class="language-java">import java.util.Arrays;

class QuickSorter {
    int[] a; int n;

    QuickSorter(int[] b) { a = b; n = b.length; }
    void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    // Partition a[p..r] around pivot = a[p]; return the pivot's final index
    int partition(int p, int r) {
        int pivot = a[p];
        int i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;   // i stops at an element &gt; pivot
            while (a[j] &gt; pivot) j--;              // j stops at an element &lt;= pivot
            if (i &gt;= j) break;                     // the two scans have crossed
            swap(a, i, j);                         // both on the wrong side: exchange
        }
        swap(a, p, j);                             // put the pivot into its final place
        return j;
    }

    void quickSort(int p, int r) {
        if (p &gt;= r) return;                        // 0 or 1 element: already sorted
        int k = partition(p, r);
        quickSort(p, k - 1);                       // conquer the left part
        quickSort(k + 1, r);                       // conquer the right part
    }
}

public class QuickSort {
    public static void main(String[] args) {
        int[][] tests = {
            {50, 30, 80, 90, 10, 70, 100, 60, 40, 20},  // the lesson's example
            {}, {7}, {2, 1},                            // tiny arrays
            {4, 1, 4, 2, 4},                            // equal keys
            {1, 2, 3, 4, 5, 6}, {6, 5, 4, 3, 2, 1}      // sorted / reversed
        };
        for (int[] b : tests) {
            String before = Arrays.toString(b);
            QuickSorter t = new QuickSorter(b);
            t.quickSort(0, t.n - 1);
            System.out.println(before + " -&gt; " + Arrays.toString(t.a));
        }
    }
}</code></pre>
<div class="out">[50, 30, 80, 90, 10, 70, 100, 60, 40, 20] -&gt; [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]<br>
[] -&gt; []<br>
[7] -&gt; [7]<br>
[2, 1] -&gt; [1, 2]<br>
[4, 1, 4, 2, 4] -&gt; [1, 2, 4, 4, 4]<br>
[1, 2, 3, 4, 5, 6] -&gt; [1, 2, 3, 4, 5, 6]<br>
[6, 5, 4, 3, 2, 1] -&gt; [1, 2, 3, 4, 5, 6]</div>
<ul>
<li><code>quickSort(p, r)</code> returns at once when p ≥ r (0 or 1 element) — the base case of the recursion.</li>
<li><code>partition</code> returns the pivot's final index k; the recursive calls leave k out: (p, k−1) and (k+1, r).</li>
<li><code>i &lt;= r</code> keeps i inside the part (the pivot may be its largest value); j needs no such test, because a[p] = pivot always stops it.</li>
<li>The tests include the inputs that break careless versions: empty array, one element, equal keys, sorted and reversed input.</li>
</ul>
<div class="pitfall">Recursing on (p, k) instead of (p, k−1) keeps the pivot inside the next call. On an input such as [2, 2] that call is identical to the current one → infinite recursion → <code>StackOverflowError</code>. Always leave the pivot out.</div>`,
        `<p class="y-chinh">🎯 Một bản cài đặt chuẩn của phép phân hoạch (partition) ở slide 14 cộng hai lời gọi đệ quy (recursion) — toàn bộ sắp xếp nhanh (quicksort) chỉ khoảng 20 dòng.</p>
<p class="ghi-chu">Code trên slide này là hình, không phải chữ: chương trình dưới đây là bản cài đặt chuẩn của bài, không phải bản chép từ slide — code trên slide có thể khác chi tiết (vị trí chốt, <code>&lt;</code> hay <code>&lt;=</code>, dạng vòng lặp), nhưng không khác ý tưởng.</p>
<pre><code class="language-java">import java.util.Arrays;

class QuickSorter {
    int[] a; int n;

    QuickSorter(int[] b) { a = b; n = b.length; }
    void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    // Phân hoạch a[p..r] quanh chốt = a[p]; trả về vị trí cuối cùng của chốt
    int partition(int p, int r) {
        int pivot = a[p];
        int i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;   // i dừng ở phần tử &gt; chốt
            while (a[j] &gt; pivot) j--;              // j dừng ở phần tử &lt;= chốt
            if (i &gt;= j) break;                     // hai lượt quét đã vượt qua nhau
            swap(a, i, j);                         // cả hai nằm sai phía: đổi chỗ
        }
        swap(a, p, j);                             // đặt chốt vào đúng chỗ cuối cùng
        return j;
    }

    void quickSort(int p, int r) {
        if (p &gt;= r) return;                        // 0 hoặc 1 phần tử: đã có thứ tự
        int k = partition(p, r);
        quickSort(p, k - 1);                       // trị phần bên trái
        quickSort(k + 1, r);                       // trị phần bên phải
    }
}

public class QuickSort {
    public static void main(String[] args) {
        int[][] tests = {
            {50, 30, 80, 90, 10, 70, 100, 60, 40, 20},  // ví dụ của bài
            {}, {7}, {2, 1},                            // mảng rất nhỏ
            {4, 1, 4, 2, 4},                            // có khoá trùng
            {1, 2, 3, 4, 5, 6}, {6, 5, 4, 3, 2, 1}      // đã sắp / sắp ngược
        };
        for (int[] b : tests) {
            String before = Arrays.toString(b);
            QuickSorter t = new QuickSorter(b);
            t.quickSort(0, t.n - 1);
            System.out.println(before + " -&gt; " + Arrays.toString(t.a));
        }
    }
}</code></pre>
<div class="out">[50, 30, 80, 90, 10, 70, 100, 60, 40, 20] -&gt; [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]<br>
[] -&gt; []<br>
[7] -&gt; [7]<br>
[2, 1] -&gt; [1, 2]<br>
[4, 1, 4, 2, 4] -&gt; [1, 2, 4, 4, 4]<br>
[1, 2, 3, 4, 5, 6] -&gt; [1, 2, 3, 4, 5, 6]<br>
[6, 5, 4, 3, 2, 1] -&gt; [1, 2, 3, 4, 5, 6]</div>
<ul>
<li><code>quickSort(p, r)</code> trả về ngay khi p ≥ r (0 hoặc 1 phần tử) — trường hợp cơ sở (base case) của đệ quy.</li>
<li><code>partition</code> trả về chỉ số cuối cùng k của chốt (pivot); hai lời gọi đệ quy bỏ k ra ngoài: (p, k−1) và (k+1, r).</li>
<li><code>i &lt;= r</code> giữ i ở trong phần đang xét (chốt có thể là giá trị lớn nhất); j không cần kiểm tra như vậy, vì a[p] = chốt luôn chặn nó lại.</li>
<li>Các phép thử gồm cả những đầu vào làm hỏng các bản viết cẩu thả: mảng rỗng, một phần tử, khoá trùng nhau, mảng đã sắp và sắp ngược.</li>
</ul>
<div class="pitfall">Gọi đệ quy (p, k) thay vì (p, k−1) sẽ để chốt lọt vào lời gọi sau. Với đầu vào như [2, 2], lời gọi đó y hệt lời gọi hiện tại → đệ quy vô hạn → <code>StackOverflowError</code>. Luôn để chốt ra ngoài.</div>`],
      [16, 'Quicksort complexity',
        `<p class="y-chinh">🎯 Quicksort is O(n log n) in the best and average case, with a small hidden constant, but O(n²) in the rare worst case — and which case you get depends on the pivot.</p>
<ul>
<li><strong>Best / average</strong>: pivots near the middle → about log₂ n levels, O(n) partition work per level → O(n log n). The inner loops are only an index step and a comparison, so the constant is small — the reason quicksort usually beats heap sort and merge sort on arrays.</li>
<li><strong>Worst</strong>: the pivot is always the smallest or largest element → parts of size n−1 and 0 → n levels costing (n−1) + (n−2) + … ≈ n²/2 → O(n²). With "pivot = first element", an already sorted array does exactly this.</li>
<li><strong>Median-of-3</strong>: take the middle value of a[p], a[mid], a[r] as pivot → sorted input becomes the best case.</li>
<li><strong>Random pivot</strong>: no fixed input is bad for it; the expected cost is O(n log n).</li>
<li>"Better but not guaranteed": both still have O(n²) inputs — only very unlikely ones.</li>
</ul>
<pre><code class="language-java">import java.util.Random;

public class QuickPivot {
    static int[] a;
    static long comps;
    static int maxDepth;
    static String rule;                                  // "first", "median-of-3" or "random"
    static Random rnd = new Random(7);                   // fixed seed: same output every run

    static boolean le(int x, int y) { comps++; return x &lt;= y; }
    static void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static int median3(int p, int m, int r) {            // index of the middle value
        int x = a[p], y = a[m], z = a[r];
        if ((x &lt;= y &amp;&amp; y &lt;= z) || (z &lt;= y &amp;&amp; y &lt;= x)) return m;
        if ((y &lt;= x &amp;&amp; x &lt;= z) || (z &lt;= x &amp;&amp; x &lt;= y)) return p;
        return r;
    }

    static int partition(int p, int r) {
        if (rule.equals("median-of-3")) swap(p, median3(p, (p + r) / 2, r));   // move the chosen pivot to a[p]
        if (rule.equals("random")) swap(p, p + rnd.nextInt(r - p + 1));
        int pivot = a[p], i = p + 1, j = r;              // from here: the same partition as slide 15
        while (true) {
            while (i &lt;= r &amp;&amp; le(a[i], pivot)) i++;
            while (!le(a[j], pivot)) j--;
            if (i &gt;= j) break;
            swap(i, j);
        }
        swap(p, j);
        return j;
    }

    static void quickSort(int p, int r, int depth) {
        maxDepth = Math.max(maxDepth, depth);
        if (p &gt;= r) return;
        int k = partition(p, r);
        quickSort(p, k - 1, depth + 1);
        quickSort(k + 1, r, depth + 1);
    }

    static void run(String input, int[] data, String pivotRule) {
        a = data.clone(); rule = pivotRule; comps = 0; maxDepth = 0;
        quickSort(0, a.length - 1, 1);
        System.out.printf("%-6s input, pivot = %-11s: comparisons = %6d, depth = %4d%n", input, pivotRule, comps, maxDepth);
    }

    public static void main(String[] args) {
        int n = 1000;
        int[] sorted = new int[n], shuffled = new int[n];
        for (int i = 0; i &lt; n; i++) sorted[i] = shuffled[i] = i + 1;
        Random mix = new Random(2024);
        for (int i = n - 1; i &gt; 0; i--) {                // shuffle once, with a fixed seed
            int k = mix.nextInt(i + 1), t = shuffled[i]; shuffled[i] = shuffled[k]; shuffled[k] = t;
        }
        run("sorted", sorted, "first");
        run("sorted", sorted, "median-of-3");
        run("sorted", sorted, "random");
        run("random", shuffled, "first");
        System.out.printf("n = %d: n*log2(n) = %.0f, n*n/2 = %d%n", n, n * Math.log(n) / Math.log(2), n * n / 2);
    }
}</code></pre>
<div class="out">sorted input, pivot = first &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: comparisons = 501498, depth = 1000<br>
sorted input, pivot = median-of-3: comparisons = &nbsp;&nbsp;9009, depth = &nbsp;&nbsp;10<br>
sorted input, pivot = random &nbsp;&nbsp;&nbsp;&nbsp;: comparisons = &nbsp;12143, depth = &nbsp;&nbsp;22<br>
random input, pivot = first &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: comparisons = &nbsp;15506, depth = &nbsp;&nbsp;20<br>
n = 1000: n*log2(n) = 9966, n*n/2 = 500000</div>
<p>On 1000 sorted numbers, pivot = first makes 501,498 comparisons with recursion depth 1000 (≈ n²/2); median-of-3 needs 9,009 with depth 10, the random pivot 12,143. On shuffled input even pivot = first is fine: 15,506 ≈ 1.6 n log₂ n.</p>
<p class="meo">🧠 <strong>Remember:</strong> quicksort's enemy is not big data but a bad pivot — and "first element" is a bad pivot for sorted data.</p>
<div class="pitfall">"Quicksort is O(n log n)" describes the average. "Worst-case complexity of quicksort?" expects O(n²), and "when?" expects: the pivot is always the minimum or maximum — e.g. sorted input with a first- or last-element pivot. The recursion is then n calls deep, which can also end in <code>StackOverflowError</code>.</div>`,
        `<p class="y-chinh">🎯 Sắp xếp nhanh (quicksort) là O(n log n) ở trường hợp tốt nhất và trung bình, với hằng số ẩn nhỏ, nhưng là O(n²) ở trường hợp xấu nhất (hiếm gặp) — và rơi vào trường hợp nào là do chốt (pivot).</p>
<ul>
<li><strong>Tốt nhất / trung bình</strong>: chốt rơi gần giữa → khoảng log₂ n tầng, mỗi tầng phân hoạch tốn O(n) → O(n log n). Vòng lặp trong chỉ là tăng chỉ số và một phép so sánh, nên hằng số nhỏ — lý do quicksort thường thắng sắp xếp vun đống (heap sort) và sắp xếp trộn (merge sort) trên mảng.</li>
<li><strong>Xấu nhất</strong>: chốt luôn là phần tử nhỏ nhất hoặc lớn nhất → hai phần có kích thước n−1 và 0 → n tầng, tốn (n−1) + (n−2) + … ≈ n²/2 → O(n²). Với "chốt = phần tử đầu", mảng đã sắp sẵn gây ra đúng điều này.</li>
<li><strong>Trung vị của ba (median-of-3)</strong>: lấy giá trị đứng giữa của a[p], a[mid], a[r] làm chốt → mảng đã sắp lại thành trường hợp tốt nhất.</li>
<li><strong>Chốt ngẫu nhiên (random pivot)</strong>: không có đầu vào cố định nào gây hại được; chi phí kỳ vọng là O(n log n).</li>
<li>"Tốt hơn nhưng không bảo đảm": cả hai cách vẫn có đầu vào khiến chạy O(n²) — chỉ là cực kỳ hiếm.</li>
</ul>
<pre><code class="language-java">import java.util.Random;

public class QuickPivot {
    static int[] a;
    static long comps;
    static int maxDepth;
    static String rule;                                  // cách chọn chốt
    static Random rnd = new Random(7);                   // hạt giống cố định: chạy lại vẫn ra y hệt

    static boolean le(int x, int y) { comps++; return x &lt;= y; }
    static void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static int median3(int p, int m, int r) {            // chỉ số của giá trị đứng giữa
        int x = a[p], y = a[m], z = a[r];
        if ((x &lt;= y &amp;&amp; y &lt;= z) || (z &lt;= y &amp;&amp; y &lt;= x)) return m;
        if ((y &lt;= x &amp;&amp; x &lt;= z) || (z &lt;= x &amp;&amp; x &lt;= y)) return p;
        return r;
    }

    static int partition(int p, int r) {
        if (rule.equals("median-of-3")) swap(p, median3(p, (p + r) / 2, r));   // đưa chốt đã chọn về a[p]
        if (rule.equals("random")) swap(p, p + rnd.nextInt(r - p + 1));
        int pivot = a[p], i = p + 1, j = r;              // từ đây: đúng phép phân hoạch ở slide 15
        while (true) {
            while (i &lt;= r &amp;&amp; le(a[i], pivot)) i++;
            while (!le(a[j], pivot)) j--;
            if (i &gt;= j) break;
            swap(i, j);
        }
        swap(p, j);
        return j;
    }

    static void quickSort(int p, int r, int depth) {
        maxDepth = Math.max(maxDepth, depth);
        if (p &gt;= r) return;
        int k = partition(p, r);
        quickSort(p, k - 1, depth + 1);
        quickSort(k + 1, r, depth + 1);
    }

    static void run(String input, int[] data, String pivotRule) {
        a = data.clone(); rule = pivotRule; comps = 0; maxDepth = 0;
        quickSort(0, a.length - 1, 1);
        System.out.printf("%-6s input, pivot = %-11s: comparisons = %6d, depth = %4d%n", input, pivotRule, comps, maxDepth);
    }

    public static void main(String[] args) {
        int n = 1000;
        int[] sorted = new int[n], shuffled = new int[n];
        for (int i = 0; i &lt; n; i++) sorted[i] = shuffled[i] = i + 1;
        Random mix = new Random(2024);
        for (int i = n - 1; i &gt; 0; i--) {                // xáo trộn một lần, hạt giống cố định
            int k = mix.nextInt(i + 1), t = shuffled[i]; shuffled[i] = shuffled[k]; shuffled[k] = t;
        }
        run("sorted", sorted, "first");
        run("sorted", sorted, "median-of-3");
        run("sorted", sorted, "random");
        run("random", shuffled, "first");
        System.out.printf("n = %d: n*log2(n) = %.0f, n*n/2 = %d%n", n, n * Math.log(n) / Math.log(2), n * n / 2);
    }
}</code></pre>
<div class="out">sorted input, pivot = first &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: comparisons = 501498, depth = 1000<br>
sorted input, pivot = median-of-3: comparisons = &nbsp;&nbsp;9009, depth = &nbsp;&nbsp;10<br>
sorted input, pivot = random &nbsp;&nbsp;&nbsp;&nbsp;: comparisons = &nbsp;12143, depth = &nbsp;&nbsp;22<br>
random input, pivot = first &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: comparisons = &nbsp;15506, depth = &nbsp;&nbsp;20<br>
n = 1000: n*log2(n) = 9966, n*n/2 = 500000</div>
<p>Với 1000 số đã sắp, chốt = phần tử đầu tốn 501.498 phép so sánh và độ sâu đệ quy 1000 (≈ n²/2); trung vị của ba cần 9.009 với độ sâu 10, chốt ngẫu nhiên 12.143. Với dữ liệu đã xáo trộn thì kể cả chốt = phần tử đầu cũng ổn: 15.506 ≈ 1,6 n log₂ n.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> kẻ thù của quicksort không phải dữ liệu lớn mà là chốt tồi — và "phần tử đầu" là chốt tồi với dữ liệu đã sắp.</p>
<div class="pitfall">"Quicksort là O(n log n)" là nói trường hợp trung bình. Câu "độ phức tạp xấu nhất của quicksort?" cần trả lời O(n²), và "khi nào?" cần trả lời: chốt luôn là phần tử nhỏ nhất (min) hoặc lớn nhất (max) — ví dụ mảng đã sắp với chốt là phần tử đầu hoặc cuối. Khi đó đệ quy sâu tới n lời gọi, còn có thể kết thúc bằng <code>StackOverflowError</code>.</div>`],
      [17, 'Quicksort example - 1',
        `<p class="y-chinh">🎯 Stage 1 of the example: the first call quickSort(0, 9), with pivot a[0] = 50, i at index 1 and j at index 9.</p>
<p class="ghi-chu">Slides 17–30 are pictures of the slide's own example, with no extractable text; here the lesson's own example [50 30 80 90 10 70 100 60 40 20] runs through the same kind of stages, one stage per slide, side by side with the pictures.</p>
<p>The complete run of the lesson's example, printed by the code of slide 15 with print statements added — one line per round of the two scans:</p>
<pre><code class="language-java">public class QuickTrace {
    static int[] a = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};   // the lesson's example

    static String show() {
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim();
    }
    static void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    // the partition of slide 15, plus print statements
    static int partition(int p, int r) {
        int pivot = a[p];
        int i = p + 1, j = r;
        System.out.println("quickSort(" + p + "," + r + ") pivot=" + pivot);
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;
            while (a[j] &gt; pivot) j--;
            String at = "  i=" + i + (i &lt;= r ? " (" + a[i] + ")" : " (past r)") + "  j=" + j + " (" + a[j] + ")";
            if (i &gt;= j) {
                System.out.println(at + "  crossed");
                break;
            }
            swap(i, j);
            System.out.println(at + "  swap -&gt; " + show());
        }
        swap(p, j);
        System.out.println("  pivot " + pivot + " to index " + j + " -&gt; " + show());
        return j;
    }

    static void quickSort(int p, int r) {
        if (p &gt;= r) return;
        int k = partition(p, r);
        quickSort(p, k - 1);
        quickSort(k + 1, r);
    }

    public static void main(String[] args) {
        System.out.println("start: " + show());
        quickSort(0, a.length - 1);
        System.out.println("sorted: " + show());
    }
}</code></pre>
<div class="out">start: 50 30 80 90 10 70 100 60 40 20<br>
quickSort(0,9) pivot=50<br>
&nbsp;&nbsp;i=2 (80) &nbsp;j=9 (20) &nbsp;swap -&gt; 50 30 20 90 10 70 100 60 40 80<br>
&nbsp;&nbsp;i=3 (90) &nbsp;j=8 (40) &nbsp;swap -&gt; 50 30 20 40 10 70 100 60 90 80<br>
&nbsp;&nbsp;i=5 (70) &nbsp;j=4 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 50 to index 4 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(0,3) pivot=10<br>
&nbsp;&nbsp;i=1 (30) &nbsp;j=0 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 10 to index 0 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(1,3) pivot=30<br>
&nbsp;&nbsp;i=3 (40) &nbsp;j=2 (20) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 30 to index 2 -&gt; 10 20 30 40 50 70 100 60 90 80<br>
quickSort(5,9) pivot=70<br>
&nbsp;&nbsp;i=6 (100) &nbsp;j=7 (60) &nbsp;swap -&gt; 10 20 30 40 50 70 60 100 90 80<br>
&nbsp;&nbsp;i=7 (100) &nbsp;j=6 (60) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 70 to index 6 -&gt; 10 20 30 40 50 60 70 100 90 80<br>
quickSort(7,9) pivot=100<br>
&nbsp;&nbsp;i=10 (past r) &nbsp;j=9 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 100 to index 9 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
quickSort(7,8) pivot=80<br>
&nbsp;&nbsp;i=8 (90) &nbsp;j=7 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 80 to index 7 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
sorted: 10 20 30 40 50 60 70 80 90 100</div>
<pre><code class="language-plaintext">index:  0   1   2   3   4   5   6   7   8   9
value: 50  30  80  90  10  70 100  60  40  20
       pv   i                               j</code></pre>
<ul>
<li>pivot = a[0] = 50; i starts at 1, j at 9; the loop has not moved yet.</li>
<li>Goal of this partition: bring 50 to the index where it belongs, with ≤ 50 on its left and > 50 on its right.</li>
<li>You can predict the answer by counting: 4 values are smaller than 50 (30, 10, 40, 20), so 50 must end at index 4 — the trace line <code>pivot 50 to index 4</code> confirms it.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> before tracing, count the other elements of the part that are ≤ the pivot — p plus that count is the pivot's final index, a free check for any hand trace.</p>`,
        `<p class="y-chinh">🎯 Chặng 1 của ví dụ: lời gọi đầu tiên quickSort(0, 9), chốt (pivot) là a[0] = 50, i ở chỉ số 1 và j ở chỉ số 9.</p>
<p class="ghi-chu">Slide 17–30 là các hình chạy ví dụ riêng của slide, không trích được chữ; ở đây ví dụ của bài [50 30 80 90 10 70 100 60 40 20] đi qua những chặng tương tự, mỗi slide một chặng, chạy song song với các hình đó.</p>
<p>Toàn bộ lần chạy của ví dụ của bài, do code ở slide 15 in ra (thêm lệnh in) — mỗi vòng quét của hai chỉ số một dòng:</p>
<pre><code class="language-java">public class QuickTrace {
    static int[] a = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};   // ví dụ của bài

    static String show() {
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim();
    }
    static void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    // phép phân hoạch của slide 15, thêm lệnh in
    static int partition(int p, int r) {
        int pivot = a[p];
        int i = p + 1, j = r;
        System.out.println("quickSort(" + p + "," + r + ") pivot=" + pivot);
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;
            while (a[j] &gt; pivot) j--;
            String at = "  i=" + i + (i &lt;= r ? " (" + a[i] + ")" : " (past r)") + "  j=" + j + " (" + a[j] + ")";
            if (i &gt;= j) {
                System.out.println(at + "  crossed");
                break;
            }
            swap(i, j);
            System.out.println(at + "  swap -&gt; " + show());
        }
        swap(p, j);
        System.out.println("  pivot " + pivot + " to index " + j + " -&gt; " + show());
        return j;
    }

    static void quickSort(int p, int r) {
        if (p &gt;= r) return;
        int k = partition(p, r);
        quickSort(p, k - 1);
        quickSort(k + 1, r);
    }

    public static void main(String[] args) {
        System.out.println("start: " + show());
        quickSort(0, a.length - 1);
        System.out.println("sorted: " + show());
    }
}</code></pre>
<div class="out">start: 50 30 80 90 10 70 100 60 40 20<br>
quickSort(0,9) pivot=50<br>
&nbsp;&nbsp;i=2 (80) &nbsp;j=9 (20) &nbsp;swap -&gt; 50 30 20 90 10 70 100 60 40 80<br>
&nbsp;&nbsp;i=3 (90) &nbsp;j=8 (40) &nbsp;swap -&gt; 50 30 20 40 10 70 100 60 90 80<br>
&nbsp;&nbsp;i=5 (70) &nbsp;j=4 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 50 to index 4 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(0,3) pivot=10<br>
&nbsp;&nbsp;i=1 (30) &nbsp;j=0 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 10 to index 0 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(1,3) pivot=30<br>
&nbsp;&nbsp;i=3 (40) &nbsp;j=2 (20) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 30 to index 2 -&gt; 10 20 30 40 50 70 100 60 90 80<br>
quickSort(5,9) pivot=70<br>
&nbsp;&nbsp;i=6 (100) &nbsp;j=7 (60) &nbsp;swap -&gt; 10 20 30 40 50 70 60 100 90 80<br>
&nbsp;&nbsp;i=7 (100) &nbsp;j=6 (60) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 70 to index 6 -&gt; 10 20 30 40 50 60 70 100 90 80<br>
quickSort(7,9) pivot=100<br>
&nbsp;&nbsp;i=10 (past r) &nbsp;j=9 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 100 to index 9 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
quickSort(7,8) pivot=80<br>
&nbsp;&nbsp;i=8 (90) &nbsp;j=7 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 80 to index 7 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
sorted: 10 20 30 40 50 60 70 80 90 100</div>
<pre><code class="language-plaintext">chi so:   0   1   2   3   4   5   6   7   8   9
gia tri: 50  30  80  90  10  70 100  60  40  20
         pv   i                               j</code></pre>
<ul>
<li>chốt = a[0] = 50; i bắt đầu ở 1, j ở 9; vòng lặp chưa chạy bước nào.</li>
<li>Mục tiêu của lần phân hoạch (partition) này: đưa 50 về đúng chỉ số của nó, bên trái toàn ≤ 50, bên phải toàn > 50.</li>
<li>Có thể đoán trước kết quả bằng cách đếm: có 4 giá trị nhỏ hơn 50 (30, 10, 40, 20), nên 50 phải dừng ở chỉ số 4 — dòng <code>pivot 50 to index 4</code> của bảng lần theo (trace) xác nhận điều đó.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trước khi lần theo, hãy đếm các phần tử khác trong phần đang xét mà ≤ chốt — p cộng con số đó chính là chỉ số cuối cùng của chốt, một cách tự kiểm miễn phí cho mọi bài chạy tay.</p>`],
      [18, 'Quicksort example - 2',
        `<p class="y-chinh">🎯 Stage 2: the first round of scans — i stops at 80 (index 2), j stops at once at 20 (index 9), and the two are swapped.</p>
<p class="ghi-chu">Slide 18 is the 2nd picture of the slide's own example (no text); the table shows stage 2 of the lesson's example, to read next to it.</p>
<table>
<thead><tr><th>Step</th><th>What happens</th><th>Array</th></tr></thead>
<tbody>
<tr><td>i moves</td><td>30 ≤ 50 → go on; 80 > 50 → stop at i = 2</td><td><code>50 30 80 90 10 70 100 60 40 20</code></td></tr>
<tr><td>j moves</td><td>20 ≤ 50 → stop at once, j = 9</td><td>unchanged</td></tr>
<tr><td>2 &lt; 9 → swap a[2], a[9]</td><td>80 goes right, 20 goes left</td><td><code>50 30 20 90 10 70 100 60 40 80</code></td></tr>
</tbody>
</table>
<ul>
<li>80 stood on the left but belongs right; 20 stood on the right but belongs left — one swap fixes both.</li>
<li>Zones now: a[1..2] = 30 20 are ≤ 50, a[9] = 80 is > 50, a[3..8] is not examined yet.</li>
<li>This is the trace line <code>i=2 (80)  j=9 (20)  swap -&gt; …</code> of slide 17.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> in exam traces, write the array after every swap: questions ask for the state "after the first swap" or "after the first partition" — two different answers.</p>`,
        `<p class="y-chinh">🎯 Chặng 2: vòng quét thứ nhất — i dừng ở 80 (chỉ số 2), j dừng ngay ở 20 (chỉ số 9), và hai phần tử được đổi chỗ (swap).</p>
<p class="ghi-chu">Slide 18 là hình thứ 2 của ví dụ riêng trên slide (không có chữ); bảng dưới là chặng 2 của ví dụ của bài, để đọc song song với hình.</p>
<table>
<thead><tr><th>Bước</th><th>Điều xảy ra</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>i chạy</td><td>30 ≤ 50 → đi tiếp; 80 > 50 → dừng ở i = 2</td><td><code>50 30 80 90 10 70 100 60 40 20</code></td></tr>
<tr><td>j chạy</td><td>20 ≤ 50 → dừng ngay, j = 9</td><td>không đổi</td></tr>
<tr><td>2 &lt; 9 → đổi a[2], a[9]</td><td>80 sang phải, 20 sang trái</td><td><code>50 30 20 90 10 70 100 60 40 80</code></td></tr>
</tbody>
</table>
<ul>
<li>80 đứng bên trái nhưng thuộc về bên phải; 20 đứng bên phải nhưng thuộc về bên trái — một lần đổi chỗ sửa được cả hai.</li>
<li>Các vùng lúc này: a[1..2] = 30 20 đều ≤ 50, a[9] = 80 là > 50, a[3..8] chưa được xét.</li>
<li>Đây là dòng <code>i=2 (80)  j=9 (20)  swap -&gt; …</code> trong bảng lần theo (trace) ở slide 17.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khi chạy tay trong bài thi, hãy ghi lại mảng sau mỗi lần đổi chỗ: đề hay hỏi trạng thái "sau lần đổi chỗ đầu tiên" hoặc "sau lần phân hoạch (partition) đầu tiên" — hai đáp án khác nhau.</p>`],
      [19, 'Quicksort example - 3',
        `<p class="y-chinh">🎯 Stage 3: the second round — i resumes and stops at 90 (index 3), j resumes and stops at 40 (index 8); they are swapped.</p>
<p class="ghi-chu">Slide 19 is the 3rd picture of the slide's own example; the lesson's example is shown below at its stage 3, in parallel.</p>
<table>
<thead><tr><th>Step</th><th>What happens</th><th>Array</th></tr></thead>
<tbody>
<tr><td>i moves</td><td>20 ≤ 50 (the value just swapped in) → go on; 90 > 50 → stop at i = 3</td><td><code>50 30 20 90 10 70 100 60 40 80</code></td></tr>
<tr><td>j moves</td><td>80 > 50 (just swapped in) → go on; 40 ≤ 50 → stop at j = 8</td><td>unchanged</td></tr>
<tr><td>3 &lt; 8 → swap a[3], a[8]</td><td>90 goes right, 40 goes left</td><td><code>50 30 20 40 10 70 100 60 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>The scans resume where they stopped; the two values they swapped in are now on the correct side, so they are passed over at once.</li>
<li>Left zone a[1..3] = 30 20 40 (all ≤ 50), right zone a[8..9] = 90 80 (all > 50), unknown zone a[4..7] = 10 70 100 60.</li>
<li>Trace line of slide 17: <code>i=3 (90)  j=8 (40)  swap -&gt; …</code>.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> every swap grows both known zones — the unknown middle shrinks from both ends, which is why one partition is a single pass, O(n).</p>`,
        `<p class="y-chinh">🎯 Chặng 3: vòng quét thứ hai — i đi tiếp và dừng ở 90 (chỉ số 3), j đi tiếp và dừng ở 40 (chỉ số 8); hai phần tử được đổi chỗ.</p>
<p class="ghi-chu">Slide 19 là hình thứ 3 của ví dụ riêng trên slide; dưới đây là chặng 3 của ví dụ của bài, chạy song song.</p>
<table>
<thead><tr><th>Bước</th><th>Điều xảy ra</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>i chạy</td><td>20 ≤ 50 (giá trị vừa được đổi vào) → đi tiếp; 90 > 50 → dừng ở i = 3</td><td><code>50 30 20 90 10 70 100 60 40 80</code></td></tr>
<tr><td>j chạy</td><td>80 > 50 (vừa được đổi vào) → đi tiếp; 40 ≤ 50 → dừng ở j = 8</td><td>không đổi</td></tr>
<tr><td>3 &lt; 8 → đổi a[3], a[8]</td><td>90 sang phải, 40 sang trái</td><td><code>50 30 20 40 10 70 100 60 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Hai lượt quét đi tiếp từ chỗ đã dừng; hai giá trị vừa đổi vào giờ đã đứng đúng phía, nên được bỏ qua ngay.</li>
<li>Vùng trái a[1..3] = 30 20 40 (đều ≤ 50), vùng phải a[8..9] = 90 80 (đều > 50), vùng chưa biết a[4..7] = 10 70 100 60.</li>
<li>Dòng lần theo (trace) ở slide 17: <code>i=3 (90)  j=8 (40)  swap -&gt; …</code>.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mỗi lần đổi chỗ làm cả hai vùng đã biết lớn thêm — vùng chưa biết ở giữa co lại từ hai đầu, nên một lần phân hoạch (partition) chỉ là một lượt quét, O(n).</p>`],
      [20, 'Quicksort example - 4',
        `<p class="y-chinh">🎯 Stage 4: the third round — i runs to 70 (index 5), j runs back to 10 (index 4); the scans have crossed, so the loop stops without a swap.</p>
<p class="ghi-chu">Slide 20 is the 4th picture of the slide's own example; the rows below take the lesson's example one stage further, to stage 4.</p>
<table>
<thead><tr><th>Step</th><th>What happens</th><th>Where it stops</th></tr></thead>
<tbody>
<tr><td>i moves</td><td>40 ≤ 50, 10 ≤ 50 → go on; 70 > 50 → stop</td><td>i = 5</td></tr>
<tr><td>j moves</td><td>90, 60, 100, 70 are all > 50 → go on; 10 ≤ 50 → stop</td><td>j = 4</td></tr>
<tr><td>i = 5 ≥ j = 4</td><td>crossed → leave the loop, no swap</td><td><code>50 30 20 40 10 70 100 60 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Crossing means every element has been classified: a[1..4] = 30 20 40 10 are ≤ 50, a[5..9] = 70 100 60 90 80 are > 50.</li>
<li>j stopped on the last element of the left zone (index 4) — exactly the place for the pivot, as predicted on slide 17.</li>
<li>No swap now: i and j are in the wrong order (i > j), so swapping would move 70 left and 10 right, undoing the work. Trace line: <code>i=5 (70)  j=4 (10)  crossed</code>. Lesson 6.B continues at slide 21 by moving 50 to index 4.</li>
</ul>
<div class="pitfall">The stop test <code>i &gt;= j</code> must come before the swap. Swapping first and testing afterwards puts the crossed pair back into the wrong zones, and the pivot then lands in the wrong place.</div>`,
        `<p class="y-chinh">🎯 Chặng 4: vòng quét thứ ba — i chạy tới 70 (chỉ số 5), j lùi về 10 (chỉ số 4); hai lượt quét đã vượt qua nhau, nên vòng lặp dừng mà không đổi chỗ.</p>
<p class="ghi-chu">Slide 20 là hình thứ 4 của ví dụ riêng trên slide; các dòng dưới đây đưa ví dụ của bài tới chặng 4.</p>
<table>
<thead><tr><th>Bước</th><th>Điều xảy ra</th><th>Dừng ở</th></tr></thead>
<tbody>
<tr><td>i chạy</td><td>40 ≤ 50, 10 ≤ 50 → đi tiếp; 70 > 50 → dừng</td><td>i = 5</td></tr>
<tr><td>j chạy</td><td>90, 60, 100, 70 đều > 50 → đi tiếp; 10 ≤ 50 → dừng</td><td>j = 4</td></tr>
<tr><td>i = 5 ≥ j = 4</td><td>đã vượt nhau → thoát vòng lặp, không đổi chỗ</td><td><code>50 30 20 40 10 70 100 60 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Vượt qua nhau nghĩa là mọi phần tử đã được phân loại: a[1..4] = 30 20 40 10 đều ≤ 50, a[5..9] = 70 100 60 90 80 đều > 50.</li>
<li>j dừng ở phần tử cuối của vùng trái (chỉ số 4) — đúng chỗ dành cho chốt (pivot), như đã đoán ở slide 17.</li>
<li>Lúc này không đổi chỗ: i và j đang ngược thứ tự (i > j), đổi chỗ sẽ đưa 70 sang trái và 10 sang phải, phá hỏng công sức. Dòng lần theo (trace): <code>i=5 (70)  j=4 (10)  crossed</code>. Bài 6.B đi tiếp từ slide 21 bằng việc đưa 50 về chỉ số 4.</li>
</ul>
<div class="pitfall">Phép kiểm tra dừng <code>i &gt;= j</code> phải đứng trước lệnh đổi chỗ. Đổi chỗ trước rồi mới kiểm tra sẽ đưa cặp đã vượt nhau trở lại sai vùng, và chốt sau đó rơi vào sai chỗ.</div>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>For [5 2 3 8 1], what is the array after the 2nd pass of selection sort? Of insertion sort?</li>
<li>Which of selection, insertion and bubble sort (with the flag) are O(n) on sorted input, and why is the third one not?</li>
<li>Which elementary sort of the deck is not stable? Show it on [2a 2b 1c] (key + label).</li>
<li>In the partition of slides 14–15, what are i and j looking for, and when does the loop stop?</li>
<li>Which input makes quicksort with a first-element pivot O(n²)?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) selection <code>1 2 3 8 5</code>, insertion <code>2 3 5 8 1</code>. (2) insertion and bubble with the flag — one pass of n−1 comparisons; selection always makes n(n−1)/2 comparisons. (3) selection: the first pass swaps 2a with 1c → <code>1c 2b 2a</code>, and nothing moves afterwards. (4) i looks for an element > pivot, j for an element ≤ pivot; stop when i ≥ j, then swap the pivot with a[j]. (5) sorted (or reverse-sorted) input — the pivot is always the minimum (or maximum), so each call removes only one element.</p>
<p><strong>Next:</strong> lesson 6.B (slides 21–43: the rest of the quicksort example, merge sort, heap sort, radix sort, java.util); then the deep-dive lessons below — 6.1 (basic sorts), 6.2 (efficient sorts), 6.3 (quick-sort: partitioning in detail, with the Lomuto partition, another correct way to partition) — and lesson 6.8 (practice, glossary, summary).</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Với [5 2 3 8 1], mảng sau lượt thứ 2 của sắp xếp chọn (selection sort) là gì? Của sắp xếp chèn (insertion sort) là gì?</li>
<li>Trong selection, insertion và sắp xếp nổi bọt (bubble sort) có cờ, thuật toán nào là O(n) với mảng đã sắp, và vì sao thuật toán còn lại thì không?</li>
<li>Thuật toán cơ bản nào của bộ slide không ổn định (stable)? Minh hoạ trên [2a 2b 1c] (khoá + nhãn).</li>
<li>Trong phép phân hoạch (partition) ở slide 14–15, i và j đi tìm gì, và khi nào vòng lặp dừng?</li>
<li>Đầu vào nào làm sắp xếp nhanh (quicksort) với chốt (pivot) là phần tử đầu tốn O(n²)?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) selection <code>1 2 3 8 5</code>, insertion <code>2 3 5 8 1</code>. (2) insertion và bubble có cờ — một lượt n−1 phép so sánh; selection luôn tốn n(n−1)/2 phép so sánh. (3) selection: lượt đầu đổi 2a với 1c → <code>1c 2b 2a</code>, sau đó không gì di chuyển nữa. (4) i tìm phần tử > chốt, j tìm phần tử ≤ chốt; dừng khi i ≥ j, rồi đổi chốt với a[j]. (5) mảng đã sắp (hoặc sắp ngược) — chốt luôn là phần tử nhỏ nhất (hoặc lớn nhất), nên mỗi lời gọi chỉ bớt được một phần tử.</p>
<p><strong>Học tiếp:</strong> bài 6.B (slide 21–43: phần còn lại của ví dụ quicksort, sắp xếp trộn — merge sort, sắp xếp vun đống — heap sort, sắp xếp theo cơ số — radix sort, java.util); rồi các bài đào sâu bên dưới — 6.1 (sắp xếp cơ bản), 6.2 (sắp xếp hiệu quả), 6.3 (quick-sort: phân hoạch chi tiết, dùng cách phân hoạch Lomuto, một cách phân hoạch đúng khác) — và bài 6.8 (thực hành, thuật ngữ, tóm tắt).</p>`),
    books([
      ['goodrich', '§9.4.1 Selection-Sort and Insertion-Sort p.386 · bubble-sort: Exercise C-7.51 · §12.2 Quick-Sort p.544 (in Ch.12 Sorting and Selection, p.531)', '§9.4.1 Selection-Sort and Insertion-Sort tr.386 · bubble-sort: bài tập C-7.51 · §12.2 Quick-Sort tr.544 (thuộc Chương 12 Sorting and Selection, tr.531)'],
    ]),
  ].join('\n'),
};

/* ───────── 6.B — 📑 Slide by slide · Sorting, part 2: quicksort example, merge, heap & radix sort, java.util (6-Sorting, slides 21–43) ───────── */
const L_csd12_2 = {
  title: '6.B — 📑 Slide by slide · Sorting, part 2: quicksort example, merge, heap & radix sort, java.util (6-Sorting, slides 21–43)|||6.B — 📑 Học theo từng slide · Sắp xếp, phần 2: ví dụ quicksort, merge, heap, radix sort & java.util (6-Sorting, slide 21–43)',
  slug: 'csd201-slide-csd12-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 21–43 của bộ 6-Sorting: nửa sau ví dụ quicksort (đặt chốt, đệ quy hai nửa, cây lời gọi, đếm chi phí), merge sort trên mảng [1 8 6 4 10 5 3 2 22] của slide, hai bẫy trong code merge (dấu ! và < làm mất ổn định), heap và heap sort, radix sort với đúng dữ liệu của slide, Arrays/Collections của java.util — 16 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.B · 6-Sorting, slides 21–43</span>
<h2>Sorting, part 2 — the quicksort example to the end, merge, heap and radix sort, java.util</h2>
<p class="lead">Slides 21–43 of the deck (syllabus sessions 45–46, CLO6): the second half of the quicksort example, then merge sort, heap sort, radix sort and the ready-made sorts of java.util. Two lines of the slides' merge code hide exam traps — a <code>!</code> that covers less than it seems and a <code>&lt;</code> that breaks stability — and both are proved with Java below.</p>
<div class="callout"><strong>CLO6 in the syllabus:</strong> explain the operation and performance of basic and advanced sorting algorithms. The syllabus's constructive questions (CQ) on this part — CQ15.2 which sorts are divide-and-conquer, CQ15.3 which needs more space, CQ16.1 merge sort vs quicksort, CQ16.2 which is fastest and what the weaknesses of radix sort are, CQ16.3 which is best for memory — are answered on slides 31–42 and in the check at the end.</div>
<p>The quicksort example continues from lesson 6.A. Its code — one standard implementation, since the code on slide 15 is a picture and may differ in details — is recalled here:</p>
<pre><code class="language-java">// Partition a[p..r] around pivot = a[p]; return the pivot's final index
int partition(int p, int r) {
    int pivot = a[p];
    int i = p + 1, j = r;
    while (true) {
        while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;   // i stops at an element &gt; pivot
        while (a[j] &gt; pivot) j--;              // j stops at an element &lt;= pivot
        if (i &gt;= j) break;                     // the two scans have crossed
        swap(a, i, j);                         // both on the wrong side: exchange
    }
    swap(a, p, j);                             // put the pivot into its final place
    return j;
}

void quickSort(int p, int r) {
    if (p &gt;= r) return;                        // 0 or 1 element: already sorted
    int k = partition(p, r);
    quickSort(p, k - 1);                       // conquer the left part
    quickSort(k + 1, r);                       // conquer the right part
}</code></pre>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Extra memory</th><th>Stable?</th><th>Idea</th></tr></thead>
<tbody>
<tr><td>Quicksort (slides 12–30)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) stack on average</td><td>no</td><td>partition around a pivot, recurse on both sides</td></tr>
<tr><td>Merge sort (31–33)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>yes, with <code>&lt;=</code> in merge</td><td>split in halves, sort them, merge</td></tr>
<tr><td>Heap sort (34–37)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>no</td><td>build a max heap, move the root to the end n−1 times</td></tr>
<tr><td>Radix sort, LSD (38–39)</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(n + b)</td><td>yes, and it must be</td><td>distribute by one digit per pass, last digit first</td></tr>
</tbody>
</table>
<p>(d = number of digits, b = number of sublists — 10 for decimal digits.)</p>`,
    `<span class="eyebrow">Chương 6 · Bài 6.B · 6-Sorting, slide 21–43</span>
<h2>Sắp xếp, phần 2 — ví dụ quicksort tới cuối, merge, heap, radix sort và java.util</h2>
<p class="lead">Slide 21–43 của bộ slide (buổi 45–46 theo syllabus, CLO6): nửa sau của ví dụ sắp xếp nhanh (quicksort), rồi sắp xếp trộn (merge sort), sắp xếp vun đống (heap sort), sắp xếp theo cơ số (radix sort) và các hàm sắp xếp có sẵn của java.util. Hai dòng trong code merge của slide giấu bẫy thi — một dấu <code>!</code> phủ ít hơn ta tưởng và một dấu <code>&lt;</code> làm mất tính ổn định (stability) — cả hai được chứng minh bằng Java bên dưới.</p>
<div class="callout"><strong>CLO6 trong syllabus:</strong> giải thích cách hoạt động và hiệu năng của các thuật toán sắp xếp cơ bản và nâng cao. Các câu hỏi thảo luận (constructive question — CQ) của syllabus về phần này — CQ15.2 thuật toán nào thuộc loại chia để trị (divide and conquer), CQ15.3 thuật toán nào tốn nhiều bộ nhớ hơn, CQ16.1 merge sort khác quicksort thế nào, CQ16.2 thuật toán nào nhanh nhất và điểm yếu của radix sort, CQ16.3 thuật toán nào tốt nhất về bộ nhớ — được trả lời ở slide 31–42 và trong phần tự kiểm tra cuối bài.</div>
<p>Ví dụ quicksort đi tiếp từ bài 6.A. Code của nó — một bản cài đặt chuẩn, vì code ở slide 15 là hình và có thể khác chi tiết — được nhắc lại ở đây:</p>
<pre><code class="language-java">// Phân hoạch a[p..r] quanh chốt = a[p]; trả về vị trí cuối cùng của chốt
int partition(int p, int r) {
    int pivot = a[p];
    int i = p + 1, j = r;
    while (true) {
        while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;   // i dừng ở phần tử &gt; chốt
        while (a[j] &gt; pivot) j--;              // j dừng ở phần tử &lt;= chốt
        if (i &gt;= j) break;                     // hai lượt quét đã vượt qua nhau
        swap(a, i, j);                         // cả hai nằm sai phía: đổi chỗ
    }
    swap(a, p, j);                             // đặt chốt vào đúng chỗ cuối cùng
    return j;
}

void quickSort(int p, int r) {
    if (p &gt;= r) return;                        // 0 hoặc 1 phần tử: đã có thứ tự
    int k = partition(p, r);
    quickSort(p, k - 1);                       // trị phần bên trái
    quickSort(k + 1, r);                       // trị phần bên phải
}</code></pre>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Thuật toán</th><th>Tốt nhất</th><th>Trung bình</th><th>Xấu nhất</th><th>Bộ nhớ thêm</th><th>Ổn định?</th><th>Ý tưởng</th></tr></thead>
<tbody>
<tr><td>Quicksort (slide 12–30)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) ngăn xếp đệ quy, trung bình</td><td>không</td><td>phân hoạch quanh chốt, đệ quy hai bên</td></tr>
<tr><td>Merge sort (31–33)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>có, nếu merge dùng <code>&lt;=</code></td><td>chia đôi, sắp hai nửa, trộn lại</td></tr>
<tr><td>Heap sort (34–37)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>không</td><td>dựng heap max, n−1 lần đưa gốc về cuối</td></tr>
<tr><td>Radix sort, LSD (38–39)</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(n + b)</td><td>có, và bắt buộc phải có</td><td>mỗi lượt chia theo một chữ số, bắt đầu từ chữ số cuối</td></tr>
</tbody>
</table>
<p>(d = số chữ số, b = số danh sách con — 10 với chữ số thập phân.)</p>`),
    walkHead('csd12', 21, 43),
    walk('csd12', [
      [21, 'Quicksort example - 5',
        `<p class="y-chinh">🎯 Stage 5 of the example: the scans crossed at j = 4, so the pivot 50 is swapped with a[4] = 10 — 50 is now in its final place and the array splits into two independent parts.</p>
<p class="ghi-chu">Slide 21 is the 5th picture of the slide's own example (no extractable text); in parallel, the lesson's example [50 30 80 90 10 70 100 60 40 20] reaches its stage 5 — placing the pivot.</p>
<p>The whole run of the lesson's example (program <code>QuickTrace</code> of lesson 6.A, slide 17); this lesson picks it up at the line <code>pivot 50 to index 4</code>:</p>
<div class="out">start: 50 30 80 90 10 70 100 60 40 20<br>
quickSort(0,9) pivot=50<br>
&nbsp;&nbsp;i=2 (80) &nbsp;j=9 (20) &nbsp;swap -&gt; 50 30 20 90 10 70 100 60 40 80<br>
&nbsp;&nbsp;i=3 (90) &nbsp;j=8 (40) &nbsp;swap -&gt; 50 30 20 40 10 70 100 60 90 80<br>
&nbsp;&nbsp;i=5 (70) &nbsp;j=4 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 50 to index 4 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(0,3) pivot=10<br>
&nbsp;&nbsp;i=1 (30) &nbsp;j=0 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 10 to index 0 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(1,3) pivot=30<br>
&nbsp;&nbsp;i=3 (40) &nbsp;j=2 (20) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 30 to index 2 -&gt; 10 20 30 40 50 70 100 60 90 80<br>
quickSort(5,9) pivot=70<br>
&nbsp;&nbsp;i=6 (100) &nbsp;j=7 (60) &nbsp;swap -&gt; 10 20 30 40 50 70 60 100 90 80<br>
&nbsp;&nbsp;i=7 (100) &nbsp;j=6 (60) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 70 to index 6 -&gt; 10 20 30 40 50 60 70 100 90 80<br>
quickSort(7,9) pivot=100<br>
&nbsp;&nbsp;i=10 (past r) &nbsp;j=9 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 100 to index 9 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
quickSort(7,8) pivot=80<br>
&nbsp;&nbsp;i=8 (90) &nbsp;j=7 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 80 to index 7 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
sorted: 10 20 30 40 50 60 70 80 90 100</div>
<pre><code class="language-plaintext">index:      0   1   2   3   4   5   6   7   8   9
before:    50  30  20  40  10  70 100  60  90  80   (i = 5, j = 4)
after:     10  30  20  40  50  70 100  60  90  80   swap a[0], a[4]
           \\____________/  ^^  \\________________/
               &lt;= 50      final      &gt; 50
           quickSort(0,3)        quickSort(5,9)</code></pre>
<ul>
<li>Why a[j] and not a[i]: a[j] = 10 is ≤ 50, so it may move to the far left; a[i] = 70 is > 50 and must stay right.</li>
<li>The two parts never exchange elements again — each is sorted inside its own index range.</li>
<li>The code calls quickSort(0, 3) first, and quickSort(5, 9) only after the left part is completely sorted.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> one partition = one element in its final place + two smaller, independent problems.</p>
<div class="pitfall">"The array after the first partition" is <code>10 30 20 40 50 70 100 60 90 80</code> for this example — the two sides are NOT sorted yet. Do not sort them in your answer.</div>`,
        `<p class="y-chinh">🎯 Chặng 5 của ví dụ: hai lượt quét vượt nhau tại j = 4, nên chốt (pivot) 50 được đổi chỗ với a[4] = 10 — 50 đã ở đúng chỗ cuối cùng và mảng tách thành hai phần độc lập.</p>
<p class="ghi-chu">Slide 21 là hình thứ 5 của ví dụ riêng trên slide (không trích được chữ); song song với nó, ví dụ của bài [50 30 80 90 10 70 100 60 40 20] tới chặng 5 — đặt chốt.</p>
<p>Toàn bộ lần chạy của ví dụ của bài (chương trình <code>QuickTrace</code> ở bài 6.A, slide 17); bài này đi tiếp từ dòng <code>pivot 50 to index 4</code>:</p>
<div class="out">start: 50 30 80 90 10 70 100 60 40 20<br>
quickSort(0,9) pivot=50<br>
&nbsp;&nbsp;i=2 (80) &nbsp;j=9 (20) &nbsp;swap -&gt; 50 30 20 90 10 70 100 60 40 80<br>
&nbsp;&nbsp;i=3 (90) &nbsp;j=8 (40) &nbsp;swap -&gt; 50 30 20 40 10 70 100 60 90 80<br>
&nbsp;&nbsp;i=5 (70) &nbsp;j=4 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 50 to index 4 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(0,3) pivot=10<br>
&nbsp;&nbsp;i=1 (30) &nbsp;j=0 (10) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 10 to index 0 -&gt; 10 30 20 40 50 70 100 60 90 80<br>
quickSort(1,3) pivot=30<br>
&nbsp;&nbsp;i=3 (40) &nbsp;j=2 (20) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 30 to index 2 -&gt; 10 20 30 40 50 70 100 60 90 80<br>
quickSort(5,9) pivot=70<br>
&nbsp;&nbsp;i=6 (100) &nbsp;j=7 (60) &nbsp;swap -&gt; 10 20 30 40 50 70 60 100 90 80<br>
&nbsp;&nbsp;i=7 (100) &nbsp;j=6 (60) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 70 to index 6 -&gt; 10 20 30 40 50 60 70 100 90 80<br>
quickSort(7,9) pivot=100<br>
&nbsp;&nbsp;i=10 (past r) &nbsp;j=9 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 100 to index 9 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
quickSort(7,8) pivot=80<br>
&nbsp;&nbsp;i=8 (90) &nbsp;j=7 (80) &nbsp;crossed<br>
&nbsp;&nbsp;pivot 80 to index 7 -&gt; 10 20 30 40 50 60 70 80 90 100<br>
sorted: 10 20 30 40 50 60 70 80 90 100</div>
<pre><code class="language-plaintext">chi so:     0   1   2   3   4   5   6   7   8   9
truoc:     50  30  20  40  10  70 100  60  90  80   (i = 5, j = 4)
sau:       10  30  20  40  50  70 100  60  90  80   doi a[0], a[4]
           \\____________/  ^^  \\________________/
               &lt;= 50      xong       &gt; 50
           quickSort(0,3)        quickSort(5,9)</code></pre>
<ul>
<li>Vì sao đổi với a[j] chứ không phải a[i]: a[j] = 10 ≤ 50 nên được phép ra tận đầu trái; a[i] = 70 > 50 phải ở lại bên phải.</li>
<li>Hai phần không bao giờ trao đổi phần tử với nhau nữa — mỗi phần được sắp trong khoảng chỉ số (index) riêng của nó.</li>
<li>Code gọi quickSort(0, 3) trước, và chỉ gọi quickSort(5, 9) khi phần trái đã sắp xong hoàn toàn.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một lần phân hoạch (partition) = một phần tử về đúng chỗ + hai bài toán nhỏ hơn, độc lập với nhau.</p>
<div class="pitfall">"Mảng sau lần phân hoạch đầu tiên" của ví dụ này là <code>10 30 20 40 50 70 100 60 90 80</code> — hai bên CHƯA được sắp. Đừng tự sắp chúng trong câu trả lời.</div>`],
      [22, 'Quicksort example - 6',
        `<p class="y-chinh">🎯 Stage 6: the left part a[0..3] = 10 30 20 40 is partitioned around 10 — its smallest value — so the scans cross at once and one side is empty.</p>
<p class="ghi-chu">Slide 22, the 6th picture of the slide's own example, has no text; the lesson's example moves on to its left part here.</p>
<table>
<thead><tr><th>Step</th><th>i / j</th><th>Action</th><th>Array</th></tr></thead>
<tbody>
<tr><td>call</td><td>quickSort(0,3): pivot = 10, i = 1, j = 3</td><td>—</td><td><code>10 30 20 40 | 50 70 100 60 90 80</code></td></tr>
<tr><td>scan</td><td>i = 1 (30 > 10); j walks 40, 20, 30 and stops at 0 (10)</td><td>crossed → leave the loop</td><td>unchanged</td></tr>
<tr><td>pivot</td><td>—</td><td>swap a[0] with a[0] — the same cell</td><td>unchanged</td></tr>
</tbody>
</table>
<ul>
<li>Every value except the pivot itself is > 10, so j walks down to p. This is why <code>while (a[j] &gt; pivot)</code> needs no bounds test: the pivot stops it.</li>
<li>Result: an empty left part quickSort(0, −1) and a right part quickSort(1, 3) of three elements.</li>
<li>This is the worst case of slide 16 in miniature: a pivot that is the minimum removes only itself from the problem.</li>
</ul>
<p>Trace lines: <code>quickSort(0,3) pivot=10</code>, <code>i=1 (30)  j=0 (10)  crossed</code>, <code>pivot 10 to index 0</code>.</p>
<p class="meo">🧠 <strong>Remember:</strong> j can never go below p, and i can go at most one step past r — the two guards of the partition loop.</p>`,
        `<p class="y-chinh">🎯 Chặng 6: phần trái a[0..3] = 10 30 20 40 được phân hoạch quanh 10 — giá trị nhỏ nhất của nó — nên hai lượt quét vượt nhau ngay và một bên rỗng.</p>
<p class="ghi-chu">Slide 22, hình thứ 6 của ví dụ riêng trên slide, không có chữ; ở đây ví dụ của bài chuyển sang phần bên trái.</p>
<table>
<thead><tr><th>Bước</th><th>i / j</th><th>Việc làm</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>gọi</td><td>quickSort(0,3): chốt = 10, i = 1, j = 3</td><td>—</td><td><code>10 30 20 40 | 50 70 100 60 90 80</code></td></tr>
<tr><td>quét</td><td>i = 1 (30 > 10); j đi qua 40, 20, 30 và dừng ở 0 (10)</td><td>vượt nhau → thoát vòng lặp</td><td>không đổi</td></tr>
<tr><td>đặt chốt</td><td>—</td><td>đổi a[0] với a[0] — cùng một ô</td><td>không đổi</td></tr>
</tbody>
</table>
<ul>
<li>Mọi giá trị trừ chính chốt (pivot) đều > 10, nên j lùi tới tận p. Đó là lý do <code>while (a[j] &gt; pivot)</code> không cần kiểm tra biên: chính chốt chặn nó lại.</li>
<li>Kết quả: phần trái rỗng quickSort(0, −1) và phần phải quickSort(1, 3) gồm ba phần tử.</li>
<li>Đây là trường hợp xấu nhất (worst case) của slide 16 thu nhỏ: chốt là giá trị nhỏ nhất (min) thì chỉ loại được mỗi chính nó ra khỏi bài toán.</li>
</ul>
<p>Các dòng lần theo (trace): <code>quickSort(0,3) pivot=10</code>, <code>i=1 (30)  j=0 (10)  crossed</code>, <code>pivot 10 to index 0</code>.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> j không bao giờ xuống dưới p, còn i vượt quá r nhiều nhất một bước — hai "rào chắn" của vòng lặp phân hoạch.</p>`],
      [23, 'Quicksort example - 7',
        `<p class="y-chinh">🎯 Stage 7: quickSort(1,3) partitions 30 20 40 around 30 — i stops at 40, j at 20, they cross, and 30 is swapped with 20.</p>
<p class="ghi-chu">No text on slide 23 either (7th picture of the slide's example); the lesson's example continues with the second partition of its left part.</p>
<table>
<thead><tr><th>Step</th><th>i / j</th><th>Action</th><th>Array</th></tr></thead>
<tbody>
<tr><td>call</td><td>quickSort(1,3): pivot = 30, i = 2, j = 3</td><td>—</td><td><code>10 30 20 40 | 50 …</code></td></tr>
<tr><td>scan</td><td>i: 20 ≤ 30, then stops at 3 (40); j: 40 > 30, then stops at 2 (20)</td><td>crossed (3 ≥ 2) → leave the loop</td><td>unchanged</td></tr>
<tr><td>pivot</td><td>—</td><td>swap a[1] ↔ a[2]</td><td><code>10 20 30 40 50 70 100 60 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>A good pivot this time: one element on each side — 20 on the left, 40 on the right.</li>
<li>Both remaining parts, quickSort(1,1) and quickSort(3,3), hold one element: nothing left to partition.</li>
<li>The counting check of slide 17: in 30 20 40 one value is smaller than 30, so 30 goes to p + 1 = 2 ✓.</li>
</ul>
<p>Trace lines: <code>quickSort(1,3) pivot=30</code>, <code>i=3 (40)  j=2 (20)  crossed</code>, <code>pivot 30 to index 2</code>.</p>
<p class="meo">🧠 <strong>Remember:</strong> a partition can end without any swap inside the loop — only the final pivot swap moves something.</p>`,
        `<p class="y-chinh">🎯 Chặng 7: quickSort(1,3) phân hoạch 30 20 40 quanh 30 — i dừng ở 40, j dừng ở 20, hai bên vượt nhau, và 30 được đổi chỗ với 20.</p>
<p class="ghi-chu">Slide 23 cũng không có chữ (hình thứ 7 của ví dụ trên slide); ví dụ của bài tiếp tục với lần phân hoạch thứ hai của phần bên trái.</p>
<table>
<thead><tr><th>Bước</th><th>i / j</th><th>Việc làm</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>gọi</td><td>quickSort(1,3): chốt = 30, i = 2, j = 3</td><td>—</td><td><code>10 30 20 40 | 50 …</code></td></tr>
<tr><td>quét</td><td>i: 20 ≤ 30, rồi dừng ở 3 (40); j: 40 > 30, rồi dừng ở 2 (20)</td><td>vượt nhau (3 ≥ 2) → thoát vòng lặp</td><td>không đổi</td></tr>
<tr><td>đặt chốt</td><td>—</td><td>đổi a[1] ↔ a[2]</td><td><code>10 20 30 40 50 70 100 60 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Lần này chốt (pivot) tốt: mỗi bên một phần tử — 20 bên trái, 40 bên phải.</li>
<li>Hai phần còn lại, quickSort(1,1) và quickSort(3,3), đều chỉ có một phần tử: không còn gì để phân hoạch.</li>
<li>Kiểm bằng cách đếm như slide 17: trong 30 20 40 có một giá trị nhỏ hơn 30, nên 30 về chỉ số p + 1 = 2 ✓.</li>
</ul>
<p>Các dòng lần theo (trace): <code>quickSort(1,3) pivot=30</code>, <code>i=3 (40)  j=2 (20)  crossed</code>, <code>pivot 30 to index 2</code>.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> một lần phân hoạch có thể kết thúc mà trong vòng lặp không đổi chỗ lần nào — chỉ lần đổi chốt cuối cùng là di chuyển phần tử.</p>`],
      [24, 'Quicksort example - 8',
        `<p class="y-chinh">🎯 Stage 8: the calls on parts of size 0 or 1 — quickSort(0,−1), quickSort(1,1), quickSort(3,3) — return at once, and the left half 10 20 30 40 is finished.</p>
<p class="ghi-chu">Slide 24 is the 8th picture of the slide's example; for the lesson's example this is the moment the recursion reaches its smallest parts.</p>
<p>The call stack at the moment quickSort(3,3) runs (top = the running call):</p>
<pre><code class="language-plaintext">quickSort(3,3)   running: one element -&gt; returns at once
quickSort(1,3)   waiting: its left call (1,1) has already returned
quickSort(0,3)   waiting: its left call (0,-1) returned, (1,3) is still running
quickSort(0,9)   waiting: its right call (5,9) has not started yet</code></pre>
<ul>
<li><code>if (p &gt;= r) return;</code> covers both cases: p > r (an empty part such as (0,−1)) and p == r (one element).</li>
<li>These calls print nothing in the trace of slide 21 — they do no work; the call tree of slide 29 lists them.</li>
<li>State now: <code>10 20 30 40 | 50 | 70 100 60 90 80</code> — left half sorted, 50 final, right half untouched.</li>
</ul>
<div class="pitfall">Writing the base case as <code>if (p == r) return;</code> forgets empty parts: quickSort(0,−1) then enters the partition, which reads a[−1] → <code>ArrayIndexOutOfBoundsException</code>. Empty parts appear every time the pivot is the smallest or the largest value, as in stage 6.</div>`,
        `<p class="y-chinh">🎯 Chặng 8: các lời gọi trên phần có 0 hoặc 1 phần tử — quickSort(0,−1), quickSort(1,1), quickSort(3,3) — trả về ngay, và nửa trái 10 20 30 40 đã xong.</p>
<p class="ghi-chu">Slide 24 là hình thứ 8 của ví dụ trên slide; với ví dụ của bài, đây là lúc đệ quy chạm tới các phần nhỏ nhất.</p>
<p>Ngăn xếp lời gọi (call stack) ở thời điểm quickSort(3,3) đang chạy (trên cùng = lời gọi đang chạy):</p>
<pre><code class="language-plaintext">quickSort(3,3)   dang chay: mot phan tu -&gt; tra ve ngay
quickSort(1,3)   dang cho: loi goi trai (1,1) da tra ve
quickSort(0,3)   dang cho: loi goi trai (0,-1) da tra ve, (1,3) van dang chay
quickSort(0,9)   dang cho: loi goi phai (5,9) chua bat dau</code></pre>
<ul>
<li><code>if (p &gt;= r) return;</code> bao cả hai trường hợp: p > r (phần rỗng như (0,−1)) và p == r (một phần tử) — đó là trường hợp cơ sở (base case).</li>
<li>Các lời gọi này không in gì trong bảng lần theo (trace) ở slide 21 — chúng không làm việc gì; cây lời gọi ở slide 29 có liệt kê chúng.</li>
<li>Trạng thái lúc này: <code>10 20 30 40 | 50 | 70 100 60 90 80</code> — nửa trái đã sắp, 50 đã xong, nửa phải còn nguyên.</li>
</ul>
<div class="pitfall">Viết trường hợp cơ sở thành <code>if (p == r) return;</code> là quên phần rỗng: quickSort(0,−1) khi đó đi vào hàm phân hoạch và đọc a[−1] → <code>ArrayIndexOutOfBoundsException</code>. Phần rỗng xuất hiện mỗi khi chốt là giá trị nhỏ nhất hoặc lớn nhất, như ở chặng 6.</div>`],
      [25, 'Quicksort example - 9',
        `<p class="y-chinh">🎯 Stage 9: the right half — quickSort(5,9) partitions 70 100 60 90 80 around 70; in the first round i stops at 100, j at 60, and they are swapped.</p>
<p class="ghi-chu">Slide 25 (9th picture of the slide's example, no text) — in parallel, the lesson's example starts on its right half.</p>
<table>
<thead><tr><th>Step</th><th>i / j</th><th>Action</th><th>Array</th></tr></thead>
<tbody>
<tr><td>call</td><td>quickSort(5,9): pivot = 70, i = 6, j = 9</td><td>—</td><td><code>10 20 30 40 50 | 70 100 60 90 80</code></td></tr>
<tr><td>round 1</td><td>i = 6 (100 > 70); j passes 80 and 90, stops at 7 (60 ≤ 70)</td><td>6 &lt; 7 → swap</td><td><code>10 20 30 40 50 70 60 100 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Indices 0–4 are finished and never looked at again: all the work is inside 5–9.</li>
<li>j passed over 80 and 90 — both > 70, already on the correct side.</li>
<li>Trace line: <code>i=6 (100)  j=7 (60)  swap -&gt; …</code>.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the indices of a recursive call are absolute (5..9), not 0..4 — the part is a window on the same array.</p>
<div class="pitfall">In PE code, pass the bounds (p, r) — never a copied sub-array. Copying costs O(n) per call and, unless you copy the result back, the sorting is done on a copy that is thrown away.</div>`,
        `<p class="y-chinh">🎯 Chặng 9: nửa phải — quickSort(5,9) phân hoạch 70 100 60 90 80 quanh 70; ở vòng đầu i dừng ở 100, j dừng ở 60, và hai phần tử được đổi chỗ.</p>
<p class="ghi-chu">Slide 25 (hình thứ 9 của ví dụ trên slide, không có chữ) — song song với nó, ví dụ của bài bắt đầu xử lý nửa phải.</p>
<table>
<thead><tr><th>Bước</th><th>i / j</th><th>Việc làm</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>gọi</td><td>quickSort(5,9): chốt = 70, i = 6, j = 9</td><td>—</td><td><code>10 20 30 40 50 | 70 100 60 90 80</code></td></tr>
<tr><td>vòng 1</td><td>i = 6 (100 > 70); j đi qua 80 và 90, dừng ở 7 (60 ≤ 70)</td><td>6 &lt; 7 → đổi chỗ</td><td><code>10 20 30 40 50 70 60 100 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Các chỉ số 0–4 đã xong và không bao giờ được xét lại: mọi việc diễn ra trong 5–9.</li>
<li>j đi qua 80 và 90 — cả hai > 70, vốn đã đứng đúng phía.</li>
<li>Dòng lần theo (trace): <code>i=6 (100)  j=7 (60)  swap -&gt; …</code>.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chỉ số trong lời gọi đệ quy là chỉ số tuyệt đối (5..9), không phải 0..4 — mỗi phần chỉ là một "cửa sổ" nhìn vào cùng một mảng.</p>
<div class="pitfall">Trong bài PE, hãy truyền cận (p, r) — đừng bao giờ chép ra một mảng con. Chép tốn O(n) mỗi lời gọi và, nếu không chép kết quả ngược lại, việc sắp xếp chỉ diễn ra trên một bản sao rồi bị vứt đi.</div>`],
      [26, 'Quicksort example - 10',
        `<p class="y-chinh">🎯 Stage 10: the second round in the right half — i stops at 100 (index 7), j at 60 (index 6): crossed; 70 is swapped with 60 and lands at index 6.</p>
<p class="ghi-chu">The 10th picture of the slide's example (slide 26) has no extractable text; the lesson's example finishes the partition of its right half here.</p>
<table>
<thead><tr><th>Step</th><th>i / j</th><th>Action</th><th>Array</th></tr></thead>
<tbody>
<tr><td>round 2</td><td>i: 60 ≤ 70, then stops at 7 (100); j: 100 > 70, then stops at 6 (60)</td><td>crossed → leave the loop</td><td><code>… 50 70 60 100 90 80</code></td></tr>
<tr><td>pivot</td><td>—</td><td>swap a[5] ↔ a[6]</td><td><code>10 20 30 40 50 60 70 100 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Left of 70: one element (60) → quickSort(5,5) returns at once.</li>
<li>Right of 70: 100 90 80 → quickSort(7,9), three elements, here in reverse order.</li>
<li>Counting check: in 70 100 60 90 80 one value is smaller than 70 → final index p + 1 = 6 ✓. Trace lines: <code>i=7 (100)  j=6 (60)  crossed</code>, <code>pivot 70 to index 6</code>.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> after this stage 7 of the 10 values are final (10 20 30 40 50 60 70) — each partition "locks" at least one more.</p>`,
        `<p class="y-chinh">🎯 Chặng 10: vòng thứ hai ở nửa phải — i dừng ở 100 (chỉ số 7), j dừng ở 60 (chỉ số 6): đã vượt nhau; 70 được đổi với 60 và rơi vào chỉ số 6.</p>
<p class="ghi-chu">Hình thứ 10 của ví dụ trên slide (slide 26) không trích được chữ; ví dụ của bài hoàn tất lần phân hoạch nửa phải ở đây.</p>
<table>
<thead><tr><th>Bước</th><th>i / j</th><th>Việc làm</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>vòng 2</td><td>i: 60 ≤ 70, rồi dừng ở 7 (100); j: 100 > 70, rồi dừng ở 6 (60)</td><td>vượt nhau → thoát vòng lặp</td><td><code>… 50 70 60 100 90 80</code></td></tr>
<tr><td>đặt chốt</td><td>—</td><td>đổi a[5] ↔ a[6]</td><td><code>10 20 30 40 50 60 70 100 90 80</code></td></tr>
</tbody>
</table>
<ul>
<li>Bên trái 70: một phần tử (60) → quickSort(5,5) trả về ngay.</li>
<li>Bên phải 70: 100 90 80 → quickSort(7,9), ba phần tử, lại đang theo thứ tự ngược.</li>
<li>Kiểm bằng cách đếm: trong 70 100 60 90 80 có một giá trị nhỏ hơn 70 → chỉ số cuối cùng p + 1 = 6 ✓. Các dòng lần theo (trace): <code>i=7 (100)  j=6 (60)  crossed</code>, <code>pivot 70 to index 6</code>.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> sau chặng này 7 trong 10 giá trị đã ở chỗ cuối cùng (10 20 30 40 50 60 70) — mỗi lần phân hoạch (partition) "khoá" thêm ít nhất một phần tử.</p>`],
      [27, 'Quicksort example - 11',
        `<p class="y-chinh">🎯 Stage 11: quickSort(7,9) on 100 90 80 — the pivot 100 is the largest, so i runs off the end of the part while j stops at once; 100 goes to index 9.</p>
<p class="ghi-chu">Slide 27 is the 11th picture of the slide's example; the lesson's example meets its second unlucky pivot here.</p>
<table>
<thead><tr><th>Step</th><th>i / j</th><th>Action</th><th>Array</th></tr></thead>
<tbody>
<tr><td>call</td><td>quickSort(7,9): pivot = 100, i = 8, j = 9</td><td>—</td><td><code>… 70 | 100 90 80</code></td></tr>
<tr><td>scan</td><td>i passes 90 and 80 (both ≤ 100) and stops at 10, past r; j stops at 9 (80)</td><td>crossed → leave the loop</td><td>unchanged</td></tr>
<tr><td>pivot</td><td>—</td><td>swap a[7] ↔ a[9]</td><td><code>10 20 30 40 50 60 70 80 90 100</code></td></tr>
</tbody>
</table>
<ul>
<li>The mirror image of stage 6: the pivot is the maximum, so the right part quickSort(10,9) is empty.</li>
<li>Here the test <code>i &lt;= r</code> of the scan is essential: without it, i would read a[10], outside the array.</li>
<li>The array happens to look sorted, but the code cannot know it: quickSort(7,8) must still check 80 90. Trace lines: <code>i=10 (past r)  j=9 (80)  crossed</code>, <code>pivot 100 to index 9</code>.</li>
</ul>
<div class="pitfall">Leaving out <code>i &lt;= r</code> passes most tests: i is stopped by any bigger element to the right of the part. It crashes only when no bigger element exists up to the end of the array — a pivot that is the largest value of the last part, exactly this stage.</div>`,
        `<p class="y-chinh">🎯 Chặng 11: quickSort(7,9) trên 100 90 80 — chốt 100 là lớn nhất, nên i chạy ra khỏi phần đang xét còn j dừng ngay; 100 về chỉ số 9.</p>
<p class="ghi-chu">Slide 27 là hình thứ 11 của ví dụ trên slide; ở đây ví dụ của bài gặp chốt "xui" lần thứ hai.</p>
<table>
<thead><tr><th>Bước</th><th>i / j</th><th>Việc làm</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>gọi</td><td>quickSort(7,9): chốt = 100, i = 8, j = 9</td><td>—</td><td><code>… 70 | 100 90 80</code></td></tr>
<tr><td>quét</td><td>i đi qua 90 và 80 (đều ≤ 100) và dừng ở 10, đã quá r; j dừng ở 9 (80)</td><td>vượt nhau → thoát vòng lặp</td><td>không đổi</td></tr>
<tr><td>đặt chốt</td><td>—</td><td>đổi a[7] ↔ a[9]</td><td><code>10 20 30 40 50 60 70 80 90 100</code></td></tr>
</tbody>
</table>
<ul>
<li>Ảnh phản chiếu của chặng 6: chốt (pivot) là giá trị lớn nhất (max) nên phần phải quickSort(10,9) rỗng.</li>
<li>Ở đây điều kiện <code>i &lt;= r</code> của lượt quét là bắt buộc: thiếu nó, i sẽ đọc a[10], nằm ngoài mảng.</li>
<li>Mảng tình cờ trông như đã sắp, nhưng code không thể biết điều đó: quickSort(7,8) vẫn phải kiểm tra 80 90. Các dòng lần theo (trace): <code>i=10 (past r)  j=9 (80)  crossed</code>, <code>pivot 100 to index 9</code>.</li>
</ul>
<div class="pitfall">Bỏ điều kiện <code>i &lt;= r</code> vẫn qua được hầu hết các phép thử: i bị chặn bởi bất kỳ phần tử lớn hơn nào nằm bên phải phần đang xét. Nó chỉ sập khi tới tận cuối mảng không có phần tử nào lớn hơn — tức chốt là giá trị lớn nhất của phần cuối cùng, đúng như chặng này.</div>`],
      [28, 'Quicksort example - 12',
        `<p class="y-chinh">🎯 Stage 12: quickSort(7,8) on 80 90 — the pivot 80 is the smaller one, the scans cross immediately, and the last calls (7,6), (8,8) and (10,9) return at once.</p>
<p class="ghi-chu">Slide 28 (12th picture of the slide's example) has no text; the lesson's example does its last partition.</p>
<table>
<thead><tr><th>Step</th><th>i / j</th><th>Action</th><th>Array</th></tr></thead>
<tbody>
<tr><td>call</td><td>quickSort(7,8): pivot = 80, i = 8, j = 8</td><td>—</td><td><code>… 70 | 80 90 | 100</code></td></tr>
<tr><td>scan</td><td>i = 8 (90 > 80); j: 90 > 80, then stops at 7 (80)</td><td>crossed → leave the loop</td><td>unchanged</td></tr>
<tr><td>pivot</td><td>—</td><td>swap a[7] with a[7] — the same cell</td><td><code>10 20 30 40 50 60 70 80 90 100</code></td></tr>
<tr><td>base cases</td><td>quickSort(7,6) empty, quickSort(8,8) one element, then quickSort(10,9) empty</td><td>return at once</td><td>—</td></tr>
</tbody>
</table>
<ul>
<li>Every element has now been either a pivot (50, 10, 30, 70, 100, 80) or a part of size 1 (20, 40, 60, 90).</li>
<li>The recursion unwinds: (7,8) returns to (7,9), which returns to (5,9), which returns to (0,9) — done.</li>
<li>Trace lines: <code>quickSort(7,8) pivot=80</code>, <code>i=8 (90)  j=7 (80)  crossed</code>, then <code>sorted: 10 20 30 40 50 60 70 80 90 100</code>.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> quicksort's result is ready when the last call returns — there is no final "combine" step, unlike merge sort.</p>`,
        `<p class="y-chinh">🎯 Chặng 12: quickSort(7,8) trên 80 90 — chốt 80 là số nhỏ hơn, hai lượt quét vượt nhau ngay, và các lời gọi cuối (7,6), (8,8), (10,9) trả về ngay lập tức.</p>
<p class="ghi-chu">Slide 28 (hình thứ 12 của ví dụ trên slide) không có chữ; ví dụ của bài làm lần phân hoạch cuối cùng.</p>
<table>
<thead><tr><th>Bước</th><th>i / j</th><th>Việc làm</th><th>Mảng</th></tr></thead>
<tbody>
<tr><td>gọi</td><td>quickSort(7,8): chốt = 80, i = 8, j = 8</td><td>—</td><td><code>… 70 | 80 90 | 100</code></td></tr>
<tr><td>quét</td><td>i = 8 (90 > 80); j: 90 > 80, rồi dừng ở 7 (80)</td><td>vượt nhau → thoát vòng lặp</td><td>không đổi</td></tr>
<tr><td>đặt chốt</td><td>—</td><td>đổi a[7] với a[7] — cùng một ô</td><td><code>10 20 30 40 50 60 70 80 90 100</code></td></tr>
<tr><td>trường hợp cơ sở</td><td>quickSort(7,6) rỗng, quickSort(8,8) một phần tử, rồi quickSort(10,9) rỗng</td><td>trả về ngay</td><td>—</td></tr>
</tbody>
</table>
<ul>
<li>Mọi phần tử giờ đều đã từng là chốt (pivot: 50, 10, 30, 70, 100, 80) hoặc là một phần chỉ có 1 phần tử (20, 40, 60, 90).</li>
<li>Đệ quy (recursion) rút dần về: (7,8) trả về cho (7,9), (7,9) trả về cho (5,9), (5,9) trả về cho (0,9) — xong.</li>
<li>Các dòng lần theo (trace): <code>quickSort(7,8) pivot=80</code>, <code>i=8 (90)  j=7 (80)  crossed</code>, rồi <code>sorted: 10 20 30 40 50 60 70 80 90 100</code>.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> kết quả của sắp xếp nhanh (quicksort) có ngay khi lời gọi cuối cùng trả về — không có bước "ghép" (combine) ở cuối như sắp xếp trộn (merge sort).</p>`],
      [29, 'Quicksort example - 13',
        `<p class="y-chinh">🎯 Stage 13: the whole run as a tree of calls — 13 calls, of which 6 partitioned something; the other 7 were parts of size 0 or 1.</p>
<p class="ghi-chu">Slide 29 is the 13th picture of the slide's example; the lesson's example is summarised here as its call tree.</p>
<pre><code class="language-java">public class QuickCalls {
    static int[] a = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};   // the lesson's example
    static int calls, partitions, maxDepth;

    static void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static int partition(int p, int r) {                 // same partition as slide 15
        int pivot = a[p];
        int i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;
            while (a[j] &gt; pivot) j--;
            if (i &gt;= j) break;
            swap(i, j);
        }
        swap(p, j);
        return j;
    }

    // every call prints one line, indented by its depth
    static void quickSort(int p, int r, int depth) {
        calls++;
        maxDepth = Math.max(maxDepth, depth);
        String me = "";
        for (int d = 1; d &lt; depth; d++) me += "   ";
        me += "quickSort(" + p + "," + r + ")";
        if (p &gt; r) { System.out.println(me + "  empty -&gt; return"); return; }
        if (p == r) { System.out.println(me + "  one element (" + a[p] + ") -&gt; return"); return; }
        int pivot = a[p];
        int k = partition(p, r);
        partitions++;
        System.out.println(me + "  pivot " + pivot + " -&gt; index " + k);
        quickSort(p, k - 1, depth + 1);
        quickSort(k + 1, r, depth + 1);
    }

    public static void main(String[] args) {
        quickSort(0, a.length - 1, 1);
        System.out.println("calls = " + calls + ", partitions = " + partitions + ", max depth = " + maxDepth);
    }
}</code></pre>
<div class="out">quickSort(0,9) &nbsp;pivot 50 -&gt; index 4<br>
&nbsp;&nbsp;&nbsp;quickSort(0,3) &nbsp;pivot 10 -&gt; index 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(0,-1) &nbsp;empty -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(1,3) &nbsp;pivot 30 -&gt; index 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(1,1) &nbsp;one element (20) -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(3,3) &nbsp;one element (40) -&gt; return<br>
&nbsp;&nbsp;&nbsp;quickSort(5,9) &nbsp;pivot 70 -&gt; index 6<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(5,5) &nbsp;one element (60) -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(7,9) &nbsp;pivot 100 -&gt; index 9<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(7,8) &nbsp;pivot 80 -&gt; index 7<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(7,6) &nbsp;empty -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(8,8) &nbsp;one element (90) -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(10,9) &nbsp;empty -&gt; return<br>
calls = 13, partitions = 6, max depth = 5</div>
<ul>
<li>Read the indentation as the recursion tree: each partitioning call has two children, the left part (p, k−1) and the right part (k+1, r).</li>
<li>The deepest branch is (0,9) → (5,9) → (7,9) → (7,8) → (7,6)/(8,8): depth 5. With perfect halving, 10 elements need about log₂ 10 ≈ 3.3 levels of partitions; the bad pivots 10, 100 and 80 made the tree deeper.</li>
<li>6 partitions + 4 one-element parts = 10 = n: every element is "finished" exactly once.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the recursion depth is the memory cost of quicksort — about log₂ n with good pivots, up to n with bad ones.</p>`,
        `<p class="y-chinh">🎯 Chặng 13: toàn bộ lần chạy dưới dạng cây lời gọi — 13 lời gọi, trong đó 6 lời gọi có phân hoạch; 7 lời gọi còn lại là các phần có 0 hoặc 1 phần tử.</p>
<p class="ghi-chu">Slide 29 là hình thứ 13 của ví dụ trên slide; ở đây ví dụ của bài được tóm lại thành cây lời gọi (call tree).</p>
<pre><code class="language-java">public class QuickCalls {
    static int[] a = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};   // ví dụ của bài
    static int calls, partitions, maxDepth;

    static void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static int partition(int p, int r) {                 // cùng phép phân hoạch như slide 15
        int pivot = a[p];
        int i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;
            while (a[j] &gt; pivot) j--;
            if (i &gt;= j) break;
            swap(i, j);
        }
        swap(p, j);
        return j;
    }

    // mỗi lời gọi in một dòng, thụt lề theo độ sâu
    static void quickSort(int p, int r, int depth) {
        calls++;
        maxDepth = Math.max(maxDepth, depth);
        String me = "";
        for (int d = 1; d &lt; depth; d++) me += "   ";
        me += "quickSort(" + p + "," + r + ")";
        if (p &gt; r) { System.out.println(me + "  empty -&gt; return"); return; }
        if (p == r) { System.out.println(me + "  one element (" + a[p] + ") -&gt; return"); return; }
        int pivot = a[p];
        int k = partition(p, r);
        partitions++;
        System.out.println(me + "  pivot " + pivot + " -&gt; index " + k);
        quickSort(p, k - 1, depth + 1);
        quickSort(k + 1, r, depth + 1);
    }

    public static void main(String[] args) {
        quickSort(0, a.length - 1, 1);
        System.out.println("calls = " + calls + ", partitions = " + partitions + ", max depth = " + maxDepth);
    }
}</code></pre>
<div class="out">quickSort(0,9) &nbsp;pivot 50 -&gt; index 4<br>
&nbsp;&nbsp;&nbsp;quickSort(0,3) &nbsp;pivot 10 -&gt; index 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(0,-1) &nbsp;empty -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(1,3) &nbsp;pivot 30 -&gt; index 2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(1,1) &nbsp;one element (20) -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(3,3) &nbsp;one element (40) -&gt; return<br>
&nbsp;&nbsp;&nbsp;quickSort(5,9) &nbsp;pivot 70 -&gt; index 6<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(5,5) &nbsp;one element (60) -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(7,9) &nbsp;pivot 100 -&gt; index 9<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(7,8) &nbsp;pivot 80 -&gt; index 7<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(7,6) &nbsp;empty -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(8,8) &nbsp;one element (90) -&gt; return<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;quickSort(10,9) &nbsp;empty -&gt; return<br>
calls = 13, partitions = 6, max depth = 5</div>
<ul>
<li>Đọc phần thụt lề như cây đệ quy (recursion tree): mỗi lời gọi có phân hoạch sinh ra hai lời gọi con, phần trái (p, k−1) và phần phải (k+1, r).</li>
<li>Nhánh sâu nhất là (0,9) → (5,9) → (7,9) → (7,8) → (7,6)/(8,8): độ sâu 5. Nếu lần nào cũng chia đôi hoàn hảo thì 10 phần tử chỉ cần khoảng log₂ 10 ≈ 3,3 tầng phân hoạch; các chốt tồi 10, 100 và 80 làm cây sâu hơn.</li>
<li>6 lần phân hoạch + 4 phần một phần tử = 10 = n: mỗi phần tử được "chốt xong" đúng một lần.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> độ sâu đệ quy là cái giá bộ nhớ của sắp xếp nhanh (quicksort) — khoảng log₂ n khi chốt tốt, tới n khi chốt tồi.</p>`],
      [30, 'Quicksort example - 14',
        `<p class="y-chinh">🎯 Stage 14: the example is sorted — the bill is 38 comparisons and 3 swaps (plus 6 pivot placements) for 10 elements, while the same values in sorted order cost 63 comparisons.</p>
<p class="ghi-chu">Slide 30, the last (14th) picture of the slide's example, has no text; the lesson's example ends with its final count.</p>
<pre><code class="language-java">import java.util.Comparator;

public class QuickFinal {
    static int comps, swaps, maxDepth;
    static Comparator&lt;Integer&gt; cmp;                      // how two elements are compared

    static boolean le(Integer x, Integer y) { comps++; return cmp.compare(x, y) &lt;= 0; }
    static void swap(Integer[] a, int i, int j) { Integer t = a[i]; a[i] = a[j]; a[j] = t; }

    static int partition(Integer[] a, int p, int r) {   // same partition as slide 15
        Integer pivot = a[p];
        int i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; le(a[i], pivot)) i++;
            while (!le(a[j], pivot)) j--;
            if (i &gt;= j) break;
            swap(a, i, j); swaps++;
        }
        swap(a, p, j);                                   // pivot placement: not counted in swaps
        return j;
    }

    static void quickSort(Integer[] a, int p, int r, int depth) {
        maxDepth = Math.max(maxDepth, depth);
        if (p &gt;= r) return;
        int k = partition(a, p, r);
        quickSort(a, p, k - 1, depth + 1);
        quickSort(a, k + 1, r, depth + 1);
    }

    static String run(Integer[] a, Comparator&lt;Integer&gt; c) {
        cmp = c; comps = swaps = maxDepth = 0;
        quickSort(a, 0, a.length - 1, 1);
        String s = "";
        for (Integer x : a) s += (c == BY_VALUE ? "" + x : x / 10 + "#" + x % 10) + " ";
        return s.trim();
    }

    static final Comparator&lt;Integer&gt; BY_VALUE = new Comparator&lt;Integer&gt;() {
        public int compare(Integer x, Integer y) { return Integer.compare(x, y); }
    };
    static final Comparator&lt;Integer&gt; BY_KEY = new Comparator&lt;Integer&gt;() {   // 51 = key 5, record #1
        public int compare(Integer x, Integer y) { return Integer.compare(x / 10, y / 10); }
    };

    public static void main(String[] args) {
        Integer[] ex = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};
        System.out.println("lesson's example -&gt; " + run(ex, BY_VALUE));
        System.out.println("   comparisons = " + comps + ", swaps = " + swaps + ", max depth = " + maxDepth);
        Integer[] sorted = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
        run(sorted, BY_VALUE);
        System.out.println("same 10 values, already sorted:");
        System.out.println("   comparisons = " + comps + ", swaps = " + swaps + ", max depth = " + maxDepth);
        Integer[] recs = {51, 52, 13};                   // records 5#1, 5#2, 1#3
        System.out.println("stability: 5#1 5#2 1#3 -&gt; " + run(recs, BY_KEY));
    }
}</code></pre>
<div class="out">lesson's example -&gt; 10 20 30 40 50 60 70 80 90 100<br>
&nbsp;&nbsp;&nbsp;comparisons = 38, swaps = 3, max depth = 5<br>
same 10 values, already sorted:<br>
&nbsp;&nbsp;&nbsp;comparisons = 63, swaps = 0, max depth = 10<br>
stability: 5#1 5#2 1#3 -&gt; 1#3 5#2 5#1</div>
<ul>
<li>38 comparisons lies between n log₂ n ≈ 33 and n²/2 = 50; for n = 10 the gap is small — slide 16 showed it for n = 1000 (15,506 against 501,498).</li>
<li>Sorted input: every pivot is the minimum → 9 partitions of sizes 10, 9, …, 2 → 63 comparisons and depth 10 = n, the worst case.</li>
<li>Stability test: records 5#1 and 5#2 have equal keys, yet 5#2 comes out first — the long jumps of partition carry equal keys past each other.</li>
</ul>
<div class="pitfall">Quicksort is not stable (last line of the output). When equal keys must keep their order — sort by score but keep the names in alphabetical order — use a stable sort (insertion sort, merge sort with <code>&lt;=</code>, <code>Arrays.sort</code> on objects) or compare both keys.</div>`,
        `<p class="y-chinh">🎯 Chặng 14: ví dụ đã được sắp — "hoá đơn" là 38 phép so sánh và 3 lần đổi chỗ (cộng 6 lần đặt chốt) cho 10 phần tử, trong khi cùng các giá trị ấy nhưng đã sắp sẵn lại tốn 63 phép so sánh.</p>
<p class="ghi-chu">Slide 30, hình cuối cùng (thứ 14) của ví dụ trên slide, không có chữ; ví dụ của bài kết thúc bằng phép đếm chi phí.</p>
<pre><code class="language-java">import java.util.Comparator;

public class QuickFinal {
    static int comps, swaps, maxDepth;
    static Comparator&lt;Integer&gt; cmp;                      // cách so hai phần tử

    static boolean le(Integer x, Integer y) { comps++; return cmp.compare(x, y) &lt;= 0; }
    static void swap(Integer[] a, int i, int j) { Integer t = a[i]; a[i] = a[j]; a[j] = t; }

    static int partition(Integer[] a, int p, int r) {   // cùng phép phân hoạch như slide 15
        Integer pivot = a[p];
        int i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; le(a[i], pivot)) i++;
            while (!le(a[j], pivot)) j--;
            if (i &gt;= j) break;
            swap(a, i, j); swaps++;
        }
        swap(a, p, j);                                   // đặt chốt: không tính vào swaps
        return j;
    }

    static void quickSort(Integer[] a, int p, int r, int depth) {
        maxDepth = Math.max(maxDepth, depth);
        if (p &gt;= r) return;
        int k = partition(a, p, r);
        quickSort(a, p, k - 1, depth + 1);
        quickSort(a, k + 1, r, depth + 1);
    }

    static String run(Integer[] a, Comparator&lt;Integer&gt; c) {
        cmp = c; comps = swaps = maxDepth = 0;
        quickSort(a, 0, a.length - 1, 1);
        String s = "";
        for (Integer x : a) s += (c == BY_VALUE ? "" + x : x / 10 + "#" + x % 10) + " ";
        return s.trim();
    }

    static final Comparator&lt;Integer&gt; BY_VALUE = new Comparator&lt;Integer&gt;() {
        public int compare(Integer x, Integer y) { return Integer.compare(x, y); }
    };
    static final Comparator&lt;Integer&gt; BY_KEY = new Comparator&lt;Integer&gt;() {   // 51 = khoá 5, bản ghi số 1
        public int compare(Integer x, Integer y) { return Integer.compare(x / 10, y / 10); }
    };

    public static void main(String[] args) {
        Integer[] ex = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};
        System.out.println("lesson's example -&gt; " + run(ex, BY_VALUE));
        System.out.println("   comparisons = " + comps + ", swaps = " + swaps + ", max depth = " + maxDepth);
        Integer[] sorted = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
        run(sorted, BY_VALUE);
        System.out.println("same 10 values, already sorted:");
        System.out.println("   comparisons = " + comps + ", swaps = " + swaps + ", max depth = " + maxDepth);
        Integer[] recs = {51, 52, 13};                   // ba bản ghi 5#1, 5#2, 1#3
        System.out.println("stability: 5#1 5#2 1#3 -&gt; " + run(recs, BY_KEY));
    }
}</code></pre>
<div class="out">lesson's example -&gt; 10 20 30 40 50 60 70 80 90 100<br>
&nbsp;&nbsp;&nbsp;comparisons = 38, swaps = 3, max depth = 5<br>
same 10 values, already sorted:<br>
&nbsp;&nbsp;&nbsp;comparisons = 63, swaps = 0, max depth = 10<br>
stability: 5#1 5#2 1#3 -&gt; 1#3 5#2 5#1</div>
<ul>
<li>38 phép so sánh nằm giữa n log₂ n ≈ 33 và n²/2 = 50; với n = 10 khoảng cách còn nhỏ — slide 16 đã cho thấy nó với n = 1000 (15.506 so với 501.498).</li>
<li>Đầu vào đã sắp: chốt (pivot) nào cũng là giá trị nhỏ nhất (min) → 9 lần phân hoạch với kích thước 10, 9, …, 2 → 63 phép so sánh và độ sâu 10 = n, trường hợp xấu nhất.</li>
<li>Phép thử tính ổn định (stability): hai bản ghi 5#1 và 5#2 có khoá bằng nhau, vậy mà 5#2 ra trước — những cú nhảy xa của phép phân hoạch mang các khoá bằng nhau vượt qua nhau.</li>
</ul>
<div class="pitfall">Sắp xếp nhanh (quicksort) không ổn định (dòng cuối của output). Khi các khoá bằng nhau phải giữ nguyên thứ tự — sắp theo điểm nhưng tên vẫn theo ABC — hãy dùng thuật toán ổn định (sắp xếp chèn — insertion sort, sắp xếp trộn — merge sort với <code>&lt;=</code>, <code>Arrays.sort</code> trên đối tượng) hoặc so sánh cả hai khoá.</div>`],
      [31, 'Mergesort',
        `<p class="y-chinh">🎯 Merge sort makes partitioning as simple as possible — cut the array in half — and puts all the work into merging two sorted halves into one sorted array; it is O(n log n) in every case.</p>
<ul>
<li>Pseudocode on the slide: if data has at least two elements → mergesort(left half); mergesort(right half); merge(both halves into a sorted list).</li>
<li>Merge walks the two sorted halves with two indices and always copies the smaller front element → O(length) per merge.</li>
<li>Halving n down to size 1 takes ⌈log₂ n⌉ levels, and every level merges n elements in total → O(n log n), whatever the input.</li>
<li>History (slide): one of the first sorting algorithms ever run on a computer, developed by John von Neumann.</li>
<li>The price: the merge needs a second array of up to n elements → O(n) extra memory, where quicksort needs none.</li>
</ul>
<pre><code class="language-java">import java.util.Random;

public class MergeCount {
    static int[] a;
    static long comps;
    static int levels;

    static void merge(int p, int q, int r) {             // merges a[p..q] and a[q+1..r]
        int[] b = new int[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) {
            comps++;
            if (a[i] &lt;= a[j]) b[k++] = a[i++]; else b[k++] = a[j++];
        }
        while (i &lt;= q) b[k++] = a[i++];                   // copy what is left, no comparison
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
    }

    static void mergeSort(int p, int r, int depth) {
        levels = Math.max(levels, depth);
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(p, q, depth + 1);
        mergeSort(q + 1, r, depth + 1);
        merge(p, q, r);
    }

    static void run(String name, int[] data) {
        a = data; comps = 0; levels = 0;
        mergeSort(0, a.length - 1, 0);
        System.out.printf("%-8s n = %d: comparisons = %5d, levels of splitting = %d%n", name, a.length, comps, levels);
    }

    public static void main(String[] args) {
        int n = 1000;
        int[] sorted = new int[n], reversed = new int[n], shuffled = new int[n];
        for (int i = 0; i &lt; n; i++) { sorted[i] = shuffled[i] = i + 1; reversed[i] = n - i; }
        Random mix = new Random(2024);                   // fixed seed
        for (int i = n - 1; i &gt; 0; i--) {
            int k = mix.nextInt(i + 1), t = shuffled[i]; shuffled[i] = shuffled[k]; shuffled[k] = t;
        }
        run("sorted", sorted);
        run("reversed", reversed);
        run("random", shuffled);
        System.out.printf("n*log2(n) = %.0f%n", n * Math.log(n) / Math.log(2));
    }
}</code></pre>
<div class="out">sorted &nbsp;&nbsp;n = 1000: comparisons = &nbsp;5044, levels of splitting = 10<br>
reversed n = 1000: comparisons = &nbsp;4932, levels of splitting = 10<br>
random &nbsp;&nbsp;n = 1000: comparisons = &nbsp;8707, levels of splitting = 10<br>
n*log2(n) = 9966</div>
<p>The counts stay below n log₂ n ≈ 9,966 for all three inputs (5,044 / 4,932 / 8,707) — compare quicksort's 501,498 on sorted input (slide 16). Sorted and reversed inputs are even cheaper than random ones: each merge stops comparing as soon as one half runs out — the left half for sorted input, the right half for reversed input.</p>
<p class="dap-an">✅ <strong>Syllabus questions CQ15.2 / CQ15.3:</strong> the divide-and-conquer sorts of the deck are quicksort and merge sort; of the comparison sorts, merge sort needs the most extra space — the O(n) temporary array (radix sort, slide 39, also needs O(n) for its sublists).</p>
<p class="meo">🧠 <strong>Remember:</strong> merge sort = "divide blindly, combine carefully"; quicksort = "divide carefully, combine nothing".</p>`,
        `<p class="y-chinh">🎯 Sắp xếp trộn (merge sort) làm bước chia đơn giản hết mức — cắt đôi mảng — và dồn toàn bộ công sức vào việc trộn (merge) hai nửa đã sắp thành một mảng đã sắp; nó là O(n log n) trong mọi trường hợp.</p>
<ul>
<li>Mã giả (pseudocode) trên slide: nếu dữ liệu có ít nhất hai phần tử → mergesort(nửa trái); mergesort(nửa phải); merge(trộn hai nửa thành một danh sách đã sắp).</li>
<li>Phép trộn đi dọc hai nửa đã sắp bằng hai chỉ số và luôn chép phần tử đầu nhỏ hơn → O(độ dài) cho mỗi lần trộn.</li>
<li>Chia đôi n cho tới kích thước 1 mất ⌈log₂ n⌉ tầng, và mỗi tầng trộn tổng cộng n phần tử → O(n log n), bất kể đầu vào.</li>
<li>Lịch sử (slide): một trong những thuật toán sắp xếp đầu tiên chạy trên máy tính, do John von Neumann phát triển.</li>
<li>Cái giá: phép trộn cần một mảng thứ hai tới n phần tử → O(n) bộ nhớ thêm, trong khi sắp xếp nhanh (quicksort) không cần.</li>
</ul>
<pre><code class="language-java">import java.util.Random;

public class MergeCount {
    static int[] a;
    static long comps;
    static int levels;

    static void merge(int p, int q, int r) {             // trộn a[p..q] với a[q+1..r]
        int[] b = new int[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) {
            comps++;
            if (a[i] &lt;= a[j]) b[k++] = a[i++]; else b[k++] = a[j++];
        }
        while (i &lt;= q) b[k++] = a[i++];                   // chép phần còn dư, không so sánh
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
    }

    static void mergeSort(int p, int r, int depth) {
        levels = Math.max(levels, depth);
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(p, q, depth + 1);
        mergeSort(q + 1, r, depth + 1);
        merge(p, q, r);
    }

    static void run(String name, int[] data) {
        a = data; comps = 0; levels = 0;
        mergeSort(0, a.length - 1, 0);
        System.out.printf("%-8s n = %d: comparisons = %5d, levels of splitting = %d%n", name, a.length, comps, levels);
    }

    public static void main(String[] args) {
        int n = 1000;
        int[] sorted = new int[n], reversed = new int[n], shuffled = new int[n];
        for (int i = 0; i &lt; n; i++) { sorted[i] = shuffled[i] = i + 1; reversed[i] = n - i; }
        Random mix = new Random(2024);                   // hạt giống cố định
        for (int i = n - 1; i &gt; 0; i--) {
            int k = mix.nextInt(i + 1), t = shuffled[i]; shuffled[i] = shuffled[k]; shuffled[k] = t;
        }
        run("sorted", sorted);
        run("reversed", reversed);
        run("random", shuffled);
        System.out.printf("n*log2(n) = %.0f%n", n * Math.log(n) / Math.log(2));
    }
}</code></pre>
<div class="out">sorted &nbsp;&nbsp;n = 1000: comparisons = &nbsp;5044, levels of splitting = 10<br>
reversed n = 1000: comparisons = &nbsp;4932, levels of splitting = 10<br>
random &nbsp;&nbsp;n = 1000: comparisons = &nbsp;8707, levels of splitting = 10<br>
n*log2(n) = 9966</div>
<p>Số phép so sánh luôn dưới n log₂ n ≈ 9.966 với cả ba loại đầu vào (5.044 / 4.932 / 8.707) — so với 501.498 của quicksort trên mảng đã sắp (slide 16). Đầu vào đã sắp và sắp ngược còn rẻ hơn đầu vào ngẫu nhiên: mỗi lần trộn thôi so sánh ngay khi một nửa hết phần tử — nửa trái với mảng đã sắp, nửa phải với mảng sắp ngược.</p>
<p class="dap-an">✅ <strong>Câu hỏi CQ15.2 / CQ15.3 của syllabus:</strong> các thuật toán chia để trị (divide and conquer) của bộ slide là quicksort và merge sort; trong các thuật toán sắp xếp bằng so sánh, merge sort tốn bộ nhớ thêm nhiều nhất — mảng tạm O(n) (radix sort ở slide 39 cũng cần O(n) cho các danh sách con).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> merge sort = "chia bừa, ghép kỹ"; quicksort = "chia kỹ, khỏi ghép".</p>`],
      [32, 'Mergesort example',
        `<p class="y-chinh">🎯 Slide 32 sorts [1 8 6 4 10 5 3 2 22] with merge sort; below, the splits and every merge made by the code of slide 33 on this array, in the order the recursion does them.</p>
<p>The slide illustrates this run with a figure. Here the split points follow slide 33 (q = (p+r)/2, so the left half gets the extra element) — compare with the picture:</p>
<pre><code class="language-plaintext">            [1 8 6 4 10 5 3 2 22]
      [1 8 6 4 10]            [5 3 2 22]
   [1 8 6]      [4 10]      [5 3]    [2 22]
 [1 8]   [6]   [4]  [10]   [5] [3]   [2] [22]
[1] [8]</code></pre>
<pre><code class="language-java">public class MergeTrace {
    static int[] a = {1, 8, 6, 4, 10, 5, 3, 2, 22};     // the array of slide 32

    static String part(int from, int to) {              // a[from..to] as text
        String s = "[";
        for (int i = from; i &lt;= to; i++) s += a[i] + (i &lt; to ? " " : "");
        return s + "]";
    }

    static void merge(int p, int q, int r) {            // slide 33's merge, taking the left one on ties
        String before = "merge a[" + p + ".." + q + "]+a[" + (q + 1) + ".." + r + "]: " + part(p, q) + " + " + part(q + 1, r);
        int[] b = new int[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r)
            if (a[i] &lt;= a[j]) b[k++] = a[i++]; else b[k++] = a[j++];
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
        System.out.println(before + " -&gt; " + part(p, r));
    }

    static void mergeSort(int p, int r) {               // same split as slide 33: q = (p+r)/2
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(p, q);
        mergeSort(q + 1, r);
        merge(p, q, r);
    }

    public static void main(String[] args) {
        System.out.println("start: " + part(0, a.length - 1));
        mergeSort(0, a.length - 1);
    }
}</code></pre>
<div class="out">start: [1 8 6 4 10 5 3 2 22]<br>
merge a[0..0]+a[1..1]: [1] + [8] -&gt; [1 8]<br>
merge a[0..1]+a[2..2]: [1 8] + [6] -&gt; [1 6 8]<br>
merge a[3..3]+a[4..4]: [4] + [10] -&gt; [4 10]<br>
merge a[0..2]+a[3..4]: [1 6 8] + [4 10] -&gt; [1 4 6 8 10]<br>
merge a[5..5]+a[6..6]: [5] + [3] -&gt; [3 5]<br>
merge a[7..7]+a[8..8]: [2] + [22] -&gt; [2 22]<br>
merge a[5..6]+a[7..8]: [3 5] + [2 22] -&gt; [2 3 5 22]<br>
merge a[0..4]+a[5..8]: [1 4 6 8 10] + [2 3 5 22] -&gt; [1 2 3 4 5 6 8 10 22]</div>
<p class="nhan">The last merge, step by step: [1 4 6 8 10] + [2 3 5 22]</p>
<table>
<thead><tr><th>Left front</th><th>Right front</th><th>Take</th><th>Output so far</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>1 (left)</td><td>1</td></tr>
<tr><td>4</td><td>2</td><td>2 (right)</td><td>1 2</td></tr>
<tr><td>4</td><td>3</td><td>3 (right)</td><td>1 2 3</td></tr>
<tr><td>4</td><td>5</td><td>4 (left)</td><td>1 2 3 4</td></tr>
<tr><td>6</td><td>5</td><td>5 (right)</td><td>1 2 3 4 5</td></tr>
<tr><td>6</td><td>22</td><td>6 (left)</td><td>1 2 3 4 5 6</td></tr>
<tr><td>8</td><td>22</td><td>8 (left)</td><td>1 2 3 4 5 6 8</td></tr>
<tr><td>10</td><td>22</td><td>10 (left)</td><td>1 2 3 4 5 6 8 10</td></tr>
<tr><td>(empty)</td><td>22</td><td>copy the rest</td><td>1 2 3 4 5 6 8 10 22</td></tr>
</tbody>
</table>
<ul>
<li>8 merges for 9 elements — always n − 1 merges; the last one alone made 8 comparisons for 9 elements.</li>
<li>The whole left half is sorted (merges 1–4) before the right half starts (merges 5–7) — the recursion finishes one side first.</li>
</ul>
<div class="pitfall">FE questions ask for the state "after k merges". Follow the code's order (the left half completely first), not a bottom-up pairing of neighbours: after 3 merges the array here is <code>1 6 8 4 10 5 3 2 22</code>, while merging the pairs (1,8), (6,4), (10,5) would give <code>1 8 4 6 5 10 3 2 22</code>.</div>`,
        `<p class="y-chinh">🎯 Slide 32 sắp [1 8 6 4 10 5 3 2 22] bằng sắp xếp trộn (merge sort); dưới đây là các lần chia và từng lần trộn do code ở slide 33 thực hiện trên mảng này, theo đúng thứ tự đệ quy (recursion) làm.</p>
<p>Slide minh hoạ lần chạy này bằng hình. Ở đây điểm chia theo slide 33 (q = (p+r)/2, nên nửa trái nhận phần tử lẻ) — hãy đối chiếu với hình:</p>
<pre><code class="language-plaintext">            [1 8 6 4 10 5 3 2 22]
      [1 8 6 4 10]            [5 3 2 22]
   [1 8 6]      [4 10]      [5 3]    [2 22]
 [1 8]   [6]   [4]  [10]   [5] [3]   [2] [22]
[1] [8]</code></pre>
<pre><code class="language-java">public class MergeTrace {
    static int[] a = {1, 8, 6, 4, 10, 5, 3, 2, 22};     // mảng của slide 32

    static String part(int from, int to) {              // a[from..to] dạng chữ
        String s = "[";
        for (int i = from; i &lt;= to; i++) s += a[i] + (i &lt; to ? " " : "");
        return s + "]";
    }

    static void merge(int p, int q, int r) {            // merge của slide 33, bằng nhau thì lấy bên trái
        String before = "merge a[" + p + ".." + q + "]+a[" + (q + 1) + ".." + r + "]: " + part(p, q) + " + " + part(q + 1, r);
        int[] b = new int[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r)
            if (a[i] &lt;= a[j]) b[k++] = a[i++]; else b[k++] = a[j++];
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
        System.out.println(before + " -&gt; " + part(p, r));
    }

    static void mergeSort(int p, int r) {               // cùng cách chia như slide 33
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(p, q);
        mergeSort(q + 1, r);
        merge(p, q, r);
    }

    public static void main(String[] args) {
        System.out.println("start: " + part(0, a.length - 1));
        mergeSort(0, a.length - 1);
    }
}</code></pre>
<div class="out">start: [1 8 6 4 10 5 3 2 22]<br>
merge a[0..0]+a[1..1]: [1] + [8] -&gt; [1 8]<br>
merge a[0..1]+a[2..2]: [1 8] + [6] -&gt; [1 6 8]<br>
merge a[3..3]+a[4..4]: [4] + [10] -&gt; [4 10]<br>
merge a[0..2]+a[3..4]: [1 6 8] + [4 10] -&gt; [1 4 6 8 10]<br>
merge a[5..5]+a[6..6]: [5] + [3] -&gt; [3 5]<br>
merge a[7..7]+a[8..8]: [2] + [22] -&gt; [2 22]<br>
merge a[5..6]+a[7..8]: [3 5] + [2 22] -&gt; [2 3 5 22]<br>
merge a[0..4]+a[5..8]: [1 4 6 8 10] + [2 3 5 22] -&gt; [1 2 3 4 5 6 8 10 22]</div>
<p class="nhan">Lần trộn cuối, từng bước: [1 4 6 8 10] + [2 3 5 22]</p>
<table>
<thead><tr><th>Đầu nửa trái</th><th>Đầu nửa phải</th><th>Lấy</th><th>Kết quả tới lúc đó</th></tr></thead>
<tbody>
<tr><td>1</td><td>2</td><td>1 (trái)</td><td>1</td></tr>
<tr><td>4</td><td>2</td><td>2 (phải)</td><td>1 2</td></tr>
<tr><td>4</td><td>3</td><td>3 (phải)</td><td>1 2 3</td></tr>
<tr><td>4</td><td>5</td><td>4 (trái)</td><td>1 2 3 4</td></tr>
<tr><td>6</td><td>5</td><td>5 (phải)</td><td>1 2 3 4 5</td></tr>
<tr><td>6</td><td>22</td><td>6 (trái)</td><td>1 2 3 4 5 6</td></tr>
<tr><td>8</td><td>22</td><td>8 (trái)</td><td>1 2 3 4 5 6 8</td></tr>
<tr><td>10</td><td>22</td><td>10 (trái)</td><td>1 2 3 4 5 6 8 10</td></tr>
<tr><td>(hết)</td><td>22</td><td>chép phần còn lại</td><td>1 2 3 4 5 6 8 10 22</td></tr>
</tbody>
</table>
<ul>
<li>9 phần tử thì có 8 lần trộn — luôn là n − 1 lần; riêng lần trộn cuối đã tốn 8 phép so sánh cho 9 phần tử.</li>
<li>Toàn bộ nửa trái được sắp xong (lần trộn 1–4) trước khi nửa phải bắt đầu (lần trộn 5–7) — đệ quy làm xong một bên rồi mới sang bên kia.</li>
</ul>
<div class="pitfall">Đề FE hay hỏi trạng thái "sau k lần trộn". Hãy theo thứ tự của code (xong hẳn nửa trái trước), không phải trộn từng cặp kề nhau từ dưới lên: sau 3 lần trộn mảng ở đây là <code>1 6 8 4 10 5 3 2 22</code>, còn trộn các cặp (1,8), (6,4), (10,5) sẽ ra <code>1 8 4 6 5 10 3 2 22</code>.</div>`],
      [33, 'Merge sort code',
        `<p class="y-chinh">🎯 The slide's <code>merge(p,q,r)</code> merges a[p..q] and a[q+1..r] through a temporary array b, and <code>mergeSort(p,r)</code> splits at q = (p+r)/2; the program runs correctly, but two lines hide exam traps.</p>
<p>The slide's code with the slide's <code>main</code> (the class is renamed <code>MergeSortSlide</code>, because a file must carry the name of its public class; the constructor and <code>display()</code> of <code>EffSort</code> are not on the slide, so minimal ones were added):</p>
<pre><code class="language-java">class EffSort {
    int[] a; int n;

    EffSort(int[] b) { a = b; n = b.length; }            // not on the slide
    void display() {                                     // not on the slide
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
    }

    void merge(int p, int q, int r)
    {if(!(p&lt;=q) &amp;&amp; (q&lt;=r)) return;
     int n,i,j,k,x; n = r-p+1;
     int [] b = new int[n];
     i=p;j=q+1;k=0;
     while(i&lt;=q &amp;&amp; j&lt;=r)
     {if(a[i]&lt;a[j])
        b[k++] = a[i++];
      else
        b[k++] = a[j++];
     }
     while(i&lt;=q)  b[k++] = a[i++];
     while(j&lt;=r)  b[k++] = a[j++];
     k=0;
     for(i=p;i&lt;=r;i++) a[i] = b[k++];
    }

    void mergeSort(int p, int r)
    {if(p&gt;=r) return;
     int q = (p+r)/2;
     mergeSort(p,q);
     mergeSort(q+1,r);
     merge(p,q,r);
    }
}

public class MergeSortSlide                              // the slide calls this class Main
{public static void main(String args[])
 {int [] b = {7,3,5,9,11,8,6,15,10,12,14};
  EffSort t = new EffSort(b);
  int n=b.length;
  t.mergeSort(0,n-1);t.display();
  System.out.println();
 }
}</code></pre>
<div class="out">3 5 6 7 8 9 10 11 12 14 15</div>
<p class="nhan">Trap 1 — <code>if(!(p&lt;=q) &amp;&amp; (q&lt;=r)) return;</code></p>
<p><code>!</code> applies only to <code>(p&lt;=q)</code>, so the test means <code>p &gt; q &amp;&amp; q &lt;= r</code>. What was probably meant is <code>!((p&lt;=q) &amp;&amp; (q&lt;=r))</code> — "return unless p ≤ q ≤ r". <code>mergeSort</code> always calls <code>merge</code> with p ≤ q &lt; r, so neither guard ever fires and the sort is correct; with nonsense arguments such as (0,5,3) only the corrected guard protects the array:</p>
<pre><code class="language-java">public class MergeGuard {
    static int[] a = {3, 7, 9, 1, 4, 8};

    // slide 33's merge; 'fixed' chooses which first line is used
    static boolean merge(int p, int q, int r, boolean fixed) {
        if (!fixed) { if (!(p &lt;= q) &amp;&amp; (q &lt;= r)) return false; }   // as on the slide
        else        { if (!((p &lt;= q) &amp;&amp; (q &lt;= r))) return false; } // what was meant
        int[] b = new int[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) b[k++] = (a[i] &lt; a[j]) ? a[i++] : a[j++];
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        k = 0;
        for (i = p; i &lt;= r; i++) a[i] = b[k++];
        return true;
    }

    static void call(int p, int q, int r, boolean fixed) {
        String s = "merge(" + p + "," + q + "," + r + ") with " + (fixed ? "fixed guard: " : "slide guard: ");
        try {
            System.out.println(s + (merge(p, q, r, fixed) ? "merged" : "guard returns at once"));
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println(s + e.getClass().getSimpleName());
        }
    }

    public static void main(String[] args) {
        int[][] t = {{0, 2, 5}, {3, 2, 5}, {0, 5, 3}};
        System.out.println("p q r | slide: !(p&lt;=q) &amp;&amp; (q&lt;=r) | fixed: !((p&lt;=q) &amp;&amp; (q&lt;=r))");
        for (int[] x : t) {
            int p = x[0], q = x[1], r = x[2];
            System.out.println(p + " " + q + " " + r + " | " + (!(p &lt;= q) &amp;&amp; (q &lt;= r)) + " | " + !((p &lt;= q) &amp;&amp; (q &lt;= r)));
        }
        call(0, 5, 3, false);                            // q &gt; r: nonsense arguments
        call(0, 5, 3, true);
        call(0, 2, 5, false);                            // the only kind of call mergeSort makes
        System.out.print("a after merge(0,2,5): ");
        for (int x : a) System.out.print(x + " ");
        System.out.println();
    }
}</code></pre>
<div class="out">p q r | slide: !(p&lt;=q) &amp;&amp; (q&lt;=r) | fixed: !((p&lt;=q) &amp;&amp; (q&lt;=r))<br>
0 2 5 | false | false<br>
3 2 5 | true | true<br>
0 5 3 | false | true<br>
merge(0,5,3) with slide guard: ArrayIndexOutOfBoundsException<br>
merge(0,5,3) with fixed guard: guard returns at once<br>
merge(0,2,5) with slide guard: merged<br>
a after merge(0,2,5): 1 3 4 7 8 9</div>
<p class="nhan">Trap 2 — <code>if(a[i]&lt;a[j])</code> takes from the right half when the two fronts are equal</p>
<pre><code class="language-java">class Student {
    int score; String name;
    Student(int score, String name) { this.score = score; this.name = name; }
    public String toString() { return score + name; }
}

public class MergeStable {
    static Student[] a;
    static boolean orEqual;                              // false: slide's a[i]&lt;a[j]; true: a[i]&lt;=a[j]

    static void merge(int p, int q, int r) {             // slide 33's merge, on students
        Student[] b = new Student[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) {
            boolean takeLeft = orEqual ? a[i].score &lt;= a[j].score : a[i].score &lt; a[j].score;
            if (takeLeft) b[k++] = a[i++]; else b[k++] = a[j++];
        }
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        k = 0;
        for (i = p; i &lt;= r; i++) a[i] = b[k++];
    }

    static void mergeSort(int p, int r) {
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(p, q);
        mergeSort(q + 1, r);
        merge(p, q, r);
    }

    static String run(boolean eq) {
        a = new Student[] {new Student(7, "An"), new Student(9, "Binh"), new Student(7, "Cuong"), new Student(9, "Dung")};
        orEqual = eq;
        mergeSort(0, a.length - 1);
        return java.util.Arrays.toString(a);
    }

    public static void main(String[] args) {
        System.out.println("input (names in ABC order): [7An, 9Binh, 7Cuong, 9Dung]");
        System.out.println("slide  if(a[i]&lt;a[j])  -&gt; " + run(false));
        System.out.println("fixed  if(a[i]&lt;=a[j]) -&gt; " + run(true));
    }
}</code></pre>
<div class="out">input (names in ABC order): [7An, 9Binh, 7Cuong, 9Dung]<br>
slide &nbsp;if(a[i]&lt;a[j]) &nbsp;-&gt; [7Cuong, 7An, 9Dung, 9Binh]<br>
fixed &nbsp;if(a[i]&lt;=a[j]) -&gt; [7An, 7Cuong, 9Binh, 9Dung]</div>
<p>With <code>&lt;</code>, 7Cuong (right half) is copied before 7An (left half): equal scores come out in reverse order, so this merge sort is not stable. With <code>&lt;=</code> the left element wins ties and the alphabetical order survives.</p>
<div class="pitfall">Two FE favourites from this slide: (1) the meaning of <code>!(p&lt;=q) &amp;&amp; (q&lt;=r)</code> — <code>!</code> binds tighter than <code>&amp;&amp;</code>; (2) "is merge sort stable?" — yes, but only if merge takes the left element on ties (<code>&lt;=</code>). Minor points: <code>int [] b = new int[n];</code> allocates a new array in every call, and the local <code>n</code> hides the field <code>n</code> of the class — legal, but confusing.</div>`,
        `<p class="y-chinh">🎯 Hàm <code>merge(p,q,r)</code> của slide trộn a[p..q] với a[q+1..r] qua mảng tạm b, còn <code>mergeSort(p,r)</code> chia tại q = (p+r)/2; chương trình chạy đúng, nhưng có hai dòng giấu bẫy thi.</p>
<p>Code của slide cùng <code>main</code> của slide (lớp được đổi tên thành <code>MergeSortSlide</code>, vì mỗi file phải mang tên lớp public của nó; hàm tạo — constructor — và <code>display()</code> của <code>EffSort</code> không có trên slide, nên bài viết thêm bản tối thiểu):</p>
<pre><code class="language-java">class EffSort {
    int[] a; int n;

    EffSort(int[] b) { a = b; n = b.length; }            // không có trên slide
    void display() {                                     // không có trên slide
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
    }

    void merge(int p, int q, int r)
    {if(!(p&lt;=q) &amp;&amp; (q&lt;=r)) return;
     int n,i,j,k,x; n = r-p+1;
     int [] b = new int[n];
     i=p;j=q+1;k=0;
     while(i&lt;=q &amp;&amp; j&lt;=r)
     {if(a[i]&lt;a[j])
        b[k++] = a[i++];
      else
        b[k++] = a[j++];
     }
     while(i&lt;=q)  b[k++] = a[i++];
     while(j&lt;=r)  b[k++] = a[j++];
     k=0;
     for(i=p;i&lt;=r;i++) a[i] = b[k++];
    }

    void mergeSort(int p, int r)
    {if(p&gt;=r) return;
     int q = (p+r)/2;
     mergeSort(p,q);
     mergeSort(q+1,r);
     merge(p,q,r);
    }
}

public class MergeSortSlide                              // trên slide lớp này tên là Main
{public static void main(String args[])
 {int [] b = {7,3,5,9,11,8,6,15,10,12,14};
  EffSort t = new EffSort(b);
  int n=b.length;
  t.mergeSort(0,n-1);t.display();
  System.out.println();
 }
}</code></pre>
<div class="out">3 5 6 7 8 9 10 11 12 14 15</div>
<p class="nhan">Bẫy 1 — <code>if(!(p&lt;=q) &amp;&amp; (q&lt;=r)) return;</code></p>
<p>Dấu <code>!</code> chỉ áp lên <code>(p&lt;=q)</code>, nên phép kiểm tra nghĩa là <code>p &gt; q &amp;&amp; q &lt;= r</code>. Ý muốn viết có lẽ là <code>!((p&lt;=q) &amp;&amp; (q&lt;=r))</code> — "trả về trừ khi p ≤ q ≤ r". <code>mergeSort</code> luôn gọi <code>merge</code> với p ≤ q &lt; r, nên không phép kiểm tra nào kích hoạt và thuật toán vẫn đúng; nhưng với tham số vô lý như (0,5,3) thì chỉ phép kiểm tra đã sửa mới bảo vệ được mảng:</p>
<pre><code class="language-java">public class MergeGuard {
    static int[] a = {3, 7, 9, 1, 4, 8};

    // merge của slide 33; 'fixed' chọn dòng kiểm tra đầu hàm
    static boolean merge(int p, int q, int r, boolean fixed) {
        if (!fixed) { if (!(p &lt;= q) &amp;&amp; (q &lt;= r)) return false; }   // như trên slide
        else        { if (!((p &lt;= q) &amp;&amp; (q &lt;= r))) return false; } // điều muốn viết
        int[] b = new int[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) b[k++] = (a[i] &lt; a[j]) ? a[i++] : a[j++];
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        k = 0;
        for (i = p; i &lt;= r; i++) a[i] = b[k++];
        return true;
    }

    static void call(int p, int q, int r, boolean fixed) {
        String s = "merge(" + p + "," + q + "," + r + ") with " + (fixed ? "fixed guard: " : "slide guard: ");
        try {
            System.out.println(s + (merge(p, q, r, fixed) ? "merged" : "guard returns at once"));
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println(s + e.getClass().getSimpleName());
        }
    }

    public static void main(String[] args) {
        int[][] t = {{0, 2, 5}, {3, 2, 5}, {0, 5, 3}};
        System.out.println("p q r | slide: !(p&lt;=q) &amp;&amp; (q&lt;=r) | fixed: !((p&lt;=q) &amp;&amp; (q&lt;=r))");
        for (int[] x : t) {
            int p = x[0], q = x[1], r = x[2];
            System.out.println(p + " " + q + " " + r + " | " + (!(p &lt;= q) &amp;&amp; (q &lt;= r)) + " | " + !((p &lt;= q) &amp;&amp; (q &lt;= r)));
        }
        call(0, 5, 3, false);                            // q &gt; r: tham số vô lý
        call(0, 5, 3, true);
        call(0, 2, 5, false);                            // kiểu lời gọi duy nhất mà mergeSort tạo ra
        System.out.print("a after merge(0,2,5): ");
        for (int x : a) System.out.print(x + " ");
        System.out.println();
    }
}</code></pre>
<div class="out">p q r | slide: !(p&lt;=q) &amp;&amp; (q&lt;=r) | fixed: !((p&lt;=q) &amp;&amp; (q&lt;=r))<br>
0 2 5 | false | false<br>
3 2 5 | true | true<br>
0 5 3 | false | true<br>
merge(0,5,3) with slide guard: ArrayIndexOutOfBoundsException<br>
merge(0,5,3) with fixed guard: guard returns at once<br>
merge(0,2,5) with slide guard: merged<br>
a after merge(0,2,5): 1 3 4 7 8 9</div>
<p class="nhan">Bẫy 2 — <code>if(a[i]&lt;a[j])</code> lấy phần tử nửa phải khi hai đầu bằng nhau</p>
<pre><code class="language-java">class Student {
    int score; String name;
    Student(int score, String name) { this.score = score; this.name = name; }
    public String toString() { return score + name; }
}

public class MergeStable {
    static Student[] a;
    static boolean orEqual;                              // false: như slide a[i]&lt;a[j]; true: a[i]&lt;=a[j]

    static void merge(int p, int q, int r) {             // merge của slide 33, trên sinh viên
        Student[] b = new Student[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) {
            boolean takeLeft = orEqual ? a[i].score &lt;= a[j].score : a[i].score &lt; a[j].score;
            if (takeLeft) b[k++] = a[i++]; else b[k++] = a[j++];
        }
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        k = 0;
        for (i = p; i &lt;= r; i++) a[i] = b[k++];
    }

    static void mergeSort(int p, int r) {
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(p, q);
        mergeSort(q + 1, r);
        merge(p, q, r);
    }

    static String run(boolean eq) {
        a = new Student[] {new Student(7, "An"), new Student(9, "Binh"), new Student(7, "Cuong"), new Student(9, "Dung")};
        orEqual = eq;
        mergeSort(0, a.length - 1);
        return java.util.Arrays.toString(a);
    }

    public static void main(String[] args) {
        System.out.println("input (names in ABC order): [7An, 9Binh, 7Cuong, 9Dung]");
        System.out.println("slide  if(a[i]&lt;a[j])  -&gt; " + run(false));
        System.out.println("fixed  if(a[i]&lt;=a[j]) -&gt; " + run(true));
    }
}</code></pre>
<div class="out">input (names in ABC order): [7An, 9Binh, 7Cuong, 9Dung]<br>
slide &nbsp;if(a[i]&lt;a[j]) &nbsp;-&gt; [7Cuong, 7An, 9Dung, 9Binh]<br>
fixed &nbsp;if(a[i]&lt;=a[j]) -&gt; [7An, 7Cuong, 9Binh, 9Dung]</div>
<p>Với <code>&lt;</code>, 7Cuong (nửa phải) được chép trước 7An (nửa trái): các điểm bằng nhau ra theo thứ tự ngược, nên bản sắp xếp trộn (merge sort) này không ổn định (stable). Với <code>&lt;=</code>, phần tử bên trái thắng khi hoà và thứ tự ABC được giữ nguyên.</p>
<div class="pitfall">Hai câu FE "ruột" từ slide này: (1) ý nghĩa của <code>!(p&lt;=q) &amp;&amp; (q&lt;=r)</code> — <code>!</code> ưu tiên cao hơn <code>&amp;&amp;</code>; (2) "merge sort có ổn định không?" — có, nhưng chỉ khi phép trộn lấy phần tử bên trái lúc hoà (<code>&lt;=</code>). Chi tiết nhỏ: <code>int [] b = new int[n];</code> cấp phát mảng mới ở mọi lời gọi, và biến cục bộ <code>n</code> che mất trường <code>n</code> của lớp — hợp lệ nhưng dễ gây nhầm.</div>`],
      [34, 'Heap data structure - 1',
        `<p class="y-chinh">🎯 A (max) heap is a binary tree with two properties: every node is ≥ each of its children, and the tree is nearly complete — full on every level except the last, whose leaves are packed to the left.</p>
<ul>
<li>Heap property ⇒ the largest value sits at the root; siblings have no order between them.</li>
<li>Shape property ("nearly complete binary tree") ⇒ the height is ⌊log₂ n⌋, so a walk from the root to a leaf is O(log n).</li>
<li>Replace "greater" by "less" and the same definition gives a <strong>min heap</strong>: the smallest value at the root.</li>
<li>A heap is neither a sorted array nor a BST: 13 and 17 in [25, 13, 17, 5, 8, 3] are both children of 25, in no particular order.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class HeapCheck {
    // max-heap: every node &gt;= its children; the array (level order, no gaps) is always nearly complete
    static String checkMax(int[] a) {
        for (int i = 1; i &lt; a.length; i++) {
            int parent = (i - 1) / 2;
            if (a[i] &gt; a[parent]) return "NOT a max heap: a[" + i + "]=" + a[i] + " &gt; parent a[" + parent + "]=" + a[parent];
        }
        return "max heap";
    }

    static String checkMin(int[] a) {                    // "greater" replaced with "less"
        for (int i = 1; i &lt; a.length; i++) {
            int parent = (i - 1) / 2;
            if (a[i] &lt; a[parent]) return "NOT a min heap: a[" + i + "]=" + a[i] + " &lt; parent a[" + parent + "]=" + a[parent];
        }
        return "min heap";
    }

    public static void main(String[] args) {
        int[][] tests = {
            {25, 13, 17, 5, 8, 3},                       // the heap of slide 35
            {25, 13, 17, 15, 8, 3},                      // 15 is bigger than its parent 13
            {3, 5, 8, 13, 17, 25}                        // an ascending array
        };
        for (int[] a : tests)
            System.out.println(Arrays.toString(a) + ": " + checkMax(a) + " | " + checkMin(a));
    }
}</code></pre>
<div class="out">[25, 13, 17, 5, 8, 3]: max heap | NOT a min heap: a[1]=13 &lt; parent a[0]=25<br>
[25, 13, 17, 15, 8, 3]: NOT a max heap: a[3]=15 &gt; parent a[1]=13 | NOT a min heap: a[1]=13 &lt; parent a[0]=25<br>
[3, 5, 8, 13, 17, 25]: NOT a max heap: a[1]=5 &gt; parent a[0]=3 | min heap</div>
<p>The last line is a useful fact: an array sorted in ascending order is always a min heap (every parent comes before its children) — but most heaps are not sorted.</p>
<p class="meo">🧠 <strong>Remember:</strong> heap = "the boss is on top" (each parent beats its children) + "no gaps" (filled level by level, left to right).</p>
<div class="pitfall">"In a max heap the smallest element is at the last index" — false. The minimum is one of the leaves, but not necessarily the last one: [25, 13, 17, 3, 8, 5] is also a max heap, with its minimum at index 3.</div>`,
        `<p class="y-chinh">🎯 Đống max (max heap) là cây nhị phân có hai tính chất: mỗi nút ≥ từng con của nó, và cây gần đầy đủ (nearly complete) — đầy ở mọi tầng trừ tầng cuối, mà lá ở tầng cuối dồn hết về bên trái.</p>
<ul>
<li>Tính chất heap ⇒ giá trị lớn nhất nằm ở gốc (root); hai nút anh em thì không có thứ tự gì với nhau.</li>
<li>Tính chất hình dạng ("cây nhị phân gần đầy đủ" — nearly complete binary tree) ⇒ chiều cao là ⌊log₂ n⌋, nên đi từ gốc xuống lá tốn O(log n).</li>
<li>Thay "lớn hơn" bằng "nhỏ hơn" thì cùng định nghĩa đó cho ta <strong>đống min (min heap)</strong>: giá trị nhỏ nhất ở gốc.</li>
<li>Heap không phải mảng đã sắp, cũng không phải cây nhị phân tìm kiếm (BST): 13 và 17 trong [25, 13, 17, 5, 8, 3] đều là con của 25, không theo thứ tự nào.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class HeapCheck {
    // heap max: mọi nút &gt;= các con; mảng (theo tầng, không lỗ hổng) luôn là cây gần đầy đủ
    static String checkMax(int[] a) {
        for (int i = 1; i &lt; a.length; i++) {
            int parent = (i - 1) / 2;
            if (a[i] &gt; a[parent]) return "NOT a max heap: a[" + i + "]=" + a[i] + " &gt; parent a[" + parent + "]=" + a[parent];
        }
        return "max heap";
    }

    static String checkMin(int[] a) {                    // thay "lớn hơn" bằng "nhỏ hơn"
        for (int i = 1; i &lt; a.length; i++) {
            int parent = (i - 1) / 2;
            if (a[i] &lt; a[parent]) return "NOT a min heap: a[" + i + "]=" + a[i] + " &lt; parent a[" + parent + "]=" + a[parent];
        }
        return "min heap";
    }

    public static void main(String[] args) {
        int[][] tests = {
            {25, 13, 17, 5, 8, 3},                       // heap của slide 35
            {25, 13, 17, 15, 8, 3},                      // 15 lớn hơn cha của nó là 13
            {3, 5, 8, 13, 17, 25}                        // một mảng tăng dần
        };
        for (int[] a : tests)
            System.out.println(Arrays.toString(a) + ": " + checkMax(a) + " | " + checkMin(a));
    }
}</code></pre>
<div class="out">[25, 13, 17, 5, 8, 3]: max heap | NOT a min heap: a[1]=13 &lt; parent a[0]=25<br>
[25, 13, 17, 15, 8, 3]: NOT a max heap: a[3]=15 &gt; parent a[1]=13 | NOT a min heap: a[1]=13 &lt; parent a[0]=25<br>
[3, 5, 8, 13, 17, 25]: NOT a max heap: a[1]=5 &gt; parent a[0]=3 | min heap</div>
<p>Dòng cuối là một sự thật hữu ích: mảng sắp tăng dần luôn là một min heap (cha nào cũng đứng trước các con) — nhưng đa số heap thì không hề được sắp.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> heap = "sếp ngồi trên" (cha nào cũng hơn các con) + "không có lỗ hổng" (lấp đầy từng tầng, từ trái sang phải).</p>
<div class="pitfall">"Trong max heap, phần tử nhỏ nhất nằm ở chỉ số cuối" — SAI. Phần tử nhỏ nhất là một trong các lá (leaf), nhưng không nhất thiết là lá cuối: [25, 13, 17, 3, 8, 5] cũng là max heap, với phần tử nhỏ nhất ở chỉ số 3.</div>`],
      [35, 'Heap data structure - 2',
        `<p class="y-chinh">🎯 Because a heap has no gaps, it is stored in an array in level order — the slide's heap is [25, 13, 17, 5, 8, 3] — and parent and children are found by arithmetic on the indices.</p>
<ul>
<li>Root at a[0]; LEFT(i) = 2i+1, RIGHT(i) = 2(i+1) = 2i+2, PARENT(i) = ⌊(i−1)/2⌋.</li>
<li>No references are stored: moving one level up or down is one multiplication or division — O(1).</li>
<li>The last index n−1 is the last leaf; the nodes that have children are indices 0 … ⌊n/2⌋−1.</li>
</ul>
<pre><code class="language-plaintext">         25 (0)
       /        \\
   13 (1)       17 (2)
   /    \\       /
5 (3)  8 (4)  3 (5)</code></pre>
<pre><code class="language-java">public class HeapIndex {
    static int PARENT(int i) { return (i - 1) / 2; }     // valid for i &gt;= 1
    static int LEFT(int i)   { return 2 * i + 1; }
    static int RIGHT(int i)  { return 2 * (i + 1); }

    static String at(int[] a, int k) { return (k &gt;= 0 &amp;&amp; k &lt; a.length) ? String.valueOf(a[k]) : "-"; }

    public static void main(String[] args) {
        int[] a = {25, 13, 17, 5, 8, 3};                 // the heap of slide 35
        System.out.println("i  a[i]  parent  left  right");
        for (int i = 0; i &lt; a.length; i++)
            System.out.printf("%d  %-4d  %-6s  %-4s  %s%n", i, a[i],
                i == 0 ? "-" : at(a, PARENT(i)), at(a, LEFT(i)), at(a, RIGHT(i)));
        System.out.println("Java: (0-1)/2 = " + (0 - 1) / 2 + ", Math.floorDiv(0-1, 2) = " + Math.floorDiv(0 - 1, 2));
    }
}</code></pre>
<div class="out">i &nbsp;a[i] &nbsp;parent &nbsp;left &nbsp;right<br>
0 &nbsp;25 &nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;17<br>
1 &nbsp;13 &nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;8<br>
2 &nbsp;17 &nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;-<br>
3 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;-<br>
4 &nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;-<br>
5 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;17 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;-<br>
Java: (0-1)/2 = 0, Math.floorDiv(0-1, 2) = -1</div>
<div class="pitfall">PARENT(0) is meaningless. The slide's floor((i−1)/2) gives −1, but Java's integer division truncates toward zero: <code>(0-1)/2</code> is 0 (last line of the output), so the root would look like its own parent. That is why the heap code of slide 37 tests <code>s&gt;0</code> before comparing with the parent.</div>
<p class="meo">🧠 <strong>Remember:</strong> children of i: "double it, add one or two"; parent of i: "subtract one, halve it".</p>`,
        `<p class="y-chinh">🎯 Vì đống (heap) không có lỗ hổng nên nó được lưu trong mảng theo thứ tự từng tầng (level order) — heap của slide là [25, 13, 17, 5, 8, 3] — và nút cha, nút con được tìm bằng phép tính trên chỉ số.</p>
<ul>
<li>Gốc (root) ở a[0]; con trái LEFT(i) = 2i+1, con phải RIGHT(i) = 2(i+1) = 2i+2, cha PARENT(i) = ⌊(i−1)/2⌋.</li>
<li>Không lưu tham chiếu (reference) nào: lên hoặc xuống một tầng chỉ là một phép nhân hoặc chia — O(1).</li>
<li>Chỉ số cuối n−1 là lá cuối cùng; các nút có con là chỉ số 0 … ⌊n/2⌋−1.</li>
</ul>
<pre><code class="language-plaintext">         25 (0)
       /        \\
   13 (1)       17 (2)
   /    \\       /
5 (3)  8 (4)  3 (5)</code></pre>
<pre><code class="language-java">public class HeapIndex {
    static int PARENT(int i) { return (i - 1) / 2; }     // chỉ dùng khi i &gt;= 1
    static int LEFT(int i)   { return 2 * i + 1; }
    static int RIGHT(int i)  { return 2 * (i + 1); }

    static String at(int[] a, int k) { return (k &gt;= 0 &amp;&amp; k &lt; a.length) ? String.valueOf(a[k]) : "-"; }

    public static void main(String[] args) {
        int[] a = {25, 13, 17, 5, 8, 3};                 // heap của slide 35
        System.out.println("i  a[i]  parent  left  right");
        for (int i = 0; i &lt; a.length; i++)
            System.out.printf("%d  %-4d  %-6s  %-4s  %s%n", i, a[i],
                i == 0 ? "-" : at(a, PARENT(i)), at(a, LEFT(i)), at(a, RIGHT(i)));
        System.out.println("Java: (0-1)/2 = " + (0 - 1) / 2 + ", Math.floorDiv(0-1, 2) = " + Math.floorDiv(0 - 1, 2));
    }
}</code></pre>
<div class="out">i &nbsp;a[i] &nbsp;parent &nbsp;left &nbsp;right<br>
0 &nbsp;25 &nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;17<br>
1 &nbsp;13 &nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;8<br>
2 &nbsp;17 &nbsp;&nbsp;&nbsp;25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;-<br>
3 &nbsp;5 &nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;-<br>
4 &nbsp;8 &nbsp;&nbsp;&nbsp;&nbsp;13 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;-<br>
5 &nbsp;3 &nbsp;&nbsp;&nbsp;&nbsp;17 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;-<br>
Java: (0-1)/2 = 0, Math.floorDiv(0-1, 2) = -1</div>
<div class="pitfall">PARENT(0) là vô nghĩa. Công thức floor((i−1)/2) của slide cho −1, nhưng phép chia nguyên của Java cắt về phía 0: <code>(0-1)/2</code> bằng 0 (dòng cuối của output), nên gốc trông như là cha của chính nó. Vì thế code heap ở slide 37 kiểm tra <code>s&gt;0</code> trước khi so với nút cha.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> con của i: "nhân đôi, cộng một hoặc hai"; cha của i: "trừ một, chia đôi".</p>`],
      [36, 'Heap Sort - 1',
        `<p class="y-chinh">🎯 Heap sort has two steps: (1) turn the array into a max heap by inserting a[1], a[2], … one at a time; (2) n−1 times, move the root — the maximum — to the end of the heap and repair the heap.</p>
<ol>
<li><strong>Step 1</strong> — "at first the heap has only one element: a[0]"; inserting a[i] means sifting it up while it is bigger than its parent. The heap grows to a[0..i].</li>
<li><strong>Step 2</strong> — for k = 1 … n−1: the root goes to position n−k (the end of the current heap), the old last element of the heap takes the root's place and sinks down. The sorted part grows from the right.</li>
</ol>
<p>The lesson's example: the six values of slide 35 in another order, [3 8 17 5 13 25]. The slide's algorithm with a print after every insertion and every removal (the bar | separates the heap from the rest):</p>
<pre><code class="language-java">public class HeapSortTrace {
    static int[] a = {3, 8, 17, 5, 13, 25};             // the lesson's example
    static int n = a.length;

    static String show(int bar) {                        // a bar before index 'bar'
        String s = "";
        for (int i = 0; i &lt; n; i++) s += (i == bar ? "| " : "") + a[i] + " ";
        return s.trim();
    }

    public static void main(String[] args) {
        int i, s, f, x;
        System.out.println("start          : " + show(1));
        // step 1: insert a[1], a[2], ... into the heap a[0..i-1] (slide 37, first loop)
        for (i = 1; i &lt; n; i++) {
            x = a[i]; s = i;
            while (s &gt; 0 &amp;&amp; x &gt; a[(s - 1) / 2]) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
            System.out.println("insert " + x + (x &lt; 10 ? " " : "") + " -&gt; a[" + s + "]: " + show(i + 1));
        }
        // step 2: move the root to position i, sift x down (slide 37, second loop)
        for (i = n - 1; i &gt; 0; i--) {
            x = a[i]; a[i] = a[0];
            f = 0; s = 2 * f + 1;
            if (s + 1 &lt; i &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            while (s &lt; i &amp;&amp; x &lt; a[s]) {
                a[f] = a[s]; f = s; s = 2 * f + 1;
                if (s + 1 &lt; i &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            }
            a[f] = x;
            System.out.println("root " + a[i] + (a[i] &lt; 10 ? " " : "") + " -&gt; a[" + i + "]  : " + show(i));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 3 | 8 17 5 13 25<br>
insert 8 &nbsp;-&gt; a[0]: 8 3 | 17 5 13 25<br>
insert 17 -&gt; a[0]: 17 3 8 | 5 13 25<br>
insert 5 &nbsp;-&gt; a[1]: 17 5 8 3 | 13 25<br>
insert 13 -&gt; a[1]: 17 13 8 3 5 | 25<br>
insert 25 -&gt; a[0]: 25 13 17 3 5 8<br>
root 25 -&gt; a[5] &nbsp;: 17 13 8 3 5 | 25<br>
root 17 -&gt; a[4] &nbsp;: 13 5 8 3 | 17 25<br>
root 13 -&gt; a[3] &nbsp;: 8 5 3 | 13 17 25<br>
root 8 &nbsp;-&gt; a[2] &nbsp;: 5 3 | 8 13 17 25<br>
root 5 &nbsp;-&gt; a[1] &nbsp;: 3 | 5 8 13 17 25</div>
<table>
<thead><tr><th>Step</th><th>What moves</th><th>Array after</th></tr></thead>
<tbody>
<tr><td>insert 8</td><td>8 rises above 3 to the root</td><td><code>8 3 | 17 5 13 25</code></td></tr>
<tr><td>insert 17</td><td>17 rises above 8 to the root</td><td><code>17 3 8 | 5 13 25</code></td></tr>
<tr><td>insert 5</td><td>5 rises above 3</td><td><code>17 5 8 3 | 13 25</code></td></tr>
<tr><td>insert 13</td><td>13 rises above 5</td><td><code>17 13 8 3 5 | 25</code></td></tr>
<tr><td>insert 25</td><td>25 rises above 8, then above 17</td><td><code>25 13 17 3 5 8</code></td></tr>
<tr><td>remove 25</td><td>25 → a[5]; 8 sinks below 17</td><td><code>17 13 8 3 5 | 25</code></td></tr>
<tr><td>remove 17</td><td>17 → a[4]; 5 sinks below 13</td><td><code>13 5 8 3 | 17 25</code></td></tr>
<tr><td>remove 13</td><td>13 → a[3]; 3 sinks below 8</td><td><code>8 5 3 | 13 17 25</code></td></tr>
<tr><td>remove 8</td><td>8 → a[2]; 3 sinks below 5</td><td><code>5 3 | 8 13 17 25</code></td></tr>
<tr><td>remove 5</td><td>5 → a[1]</td><td><code>3 | 5 8 13 17 25</code></td></tr>
</tbody>
</table>
<ul>
<li>After step 1 the heap is [25 13 17 3 5 8] — a different, equally valid heap from the slide's [25, 13, 17, 5, 8, 3] with the same six values.</li>
<li>In step 2, after k removals the last k cells hold the k largest values in order.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> heap sort = "build a heap, then pop the maximum to the back, n−1 times". Ascending order needs a MAX heap.</p>`,
        `<p class="y-chinh">🎯 Sắp xếp vun đống (heap sort) có hai bước: (1) biến mảng thành một đống max (max heap) bằng cách lần lượt chèn a[1], a[2], …; (2) lặp n−1 lần: đưa gốc — phần tử lớn nhất — về cuối heap rồi sửa lại heap.</p>
<ol>
<li><strong>Bước 1</strong> — "lúc đầu heap chỉ có một phần tử: a[0]"; chèn a[i] nghĩa là cho nó "nổi lên" (sift up) chừng nào nó còn lớn hơn cha. Heap lớn dần thành a[0..i].</li>
<li><strong>Bước 2</strong> — với k = 1 … n−1: gốc về vị trí n−k (cuối heap hiện tại), phần tử cuối cũ của heap thế chỗ gốc rồi "chìm xuống" (sift down). Phần đã sắp lớn dần từ bên phải.</li>
</ol>
<p>Ví dụ của bài: sáu giá trị của slide 35 theo thứ tự khác, [3 8 17 5 13 25]. Thuật toán của slide có thêm lệnh in sau mỗi lần chèn và mỗi lần lấy ra (vạch | ngăn heap với phần còn lại):</p>
<pre><code class="language-java">public class HeapSortTrace {
    static int[] a = {3, 8, 17, 5, 13, 25};             // ví dụ của bài
    static int n = a.length;

    static String show(int bar) {                        // vạch | đứng trước chỉ số 'bar'
        String s = "";
        for (int i = 0; i &lt; n; i++) s += (i == bar ? "| " : "") + a[i] + " ";
        return s.trim();
    }

    public static void main(String[] args) {
        int i, s, f, x;
        System.out.println("start          : " + show(1));
        // bước 1: lần lượt chèn a[1], a[2], ... vào heap a[0..i-1] (slide 37, vòng lặp đầu)
        for (i = 1; i &lt; n; i++) {
            x = a[i]; s = i;
            while (s &gt; 0 &amp;&amp; x &gt; a[(s - 1) / 2]) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
            System.out.println("insert " + x + (x &lt; 10 ? " " : "") + " -&gt; a[" + s + "]: " + show(i + 1));
        }
        // bước 2: đưa gốc về vị trí i, cho x "chìm" xuống (slide 37, vòng lặp thứ hai)
        for (i = n - 1; i &gt; 0; i--) {
            x = a[i]; a[i] = a[0];
            f = 0; s = 2 * f + 1;
            if (s + 1 &lt; i &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            while (s &lt; i &amp;&amp; x &lt; a[s]) {
                a[f] = a[s]; f = s; s = 2 * f + 1;
                if (s + 1 &lt; i &amp;&amp; a[s] &lt; a[s + 1]) s = s + 1;
            }
            a[f] = x;
            System.out.println("root " + a[i] + (a[i] &lt; 10 ? " " : "") + " -&gt; a[" + i + "]  : " + show(i));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 3 | 8 17 5 13 25<br>
insert 8 &nbsp;-&gt; a[0]: 8 3 | 17 5 13 25<br>
insert 17 -&gt; a[0]: 17 3 8 | 5 13 25<br>
insert 5 &nbsp;-&gt; a[1]: 17 5 8 3 | 13 25<br>
insert 13 -&gt; a[1]: 17 13 8 3 5 | 25<br>
insert 25 -&gt; a[0]: 25 13 17 3 5 8<br>
root 25 -&gt; a[5] &nbsp;: 17 13 8 3 5 | 25<br>
root 17 -&gt; a[4] &nbsp;: 13 5 8 3 | 17 25<br>
root 13 -&gt; a[3] &nbsp;: 8 5 3 | 13 17 25<br>
root 8 &nbsp;-&gt; a[2] &nbsp;: 5 3 | 8 13 17 25<br>
root 5 &nbsp;-&gt; a[1] &nbsp;: 3 | 5 8 13 17 25</div>
<table>
<thead><tr><th>Bước</th><th>Cái gì di chuyển</th><th>Mảng sau bước</th></tr></thead>
<tbody>
<tr><td>chèn 8</td><td>8 nổi lên trên 3, thành gốc</td><td><code>8 3 | 17 5 13 25</code></td></tr>
<tr><td>chèn 17</td><td>17 nổi lên trên 8, thành gốc</td><td><code>17 3 8 | 5 13 25</code></td></tr>
<tr><td>chèn 5</td><td>5 nổi lên trên 3</td><td><code>17 5 8 3 | 13 25</code></td></tr>
<tr><td>chèn 13</td><td>13 nổi lên trên 5</td><td><code>17 13 8 3 5 | 25</code></td></tr>
<tr><td>chèn 25</td><td>25 nổi qua 8, rồi qua 17</td><td><code>25 13 17 3 5 8</code></td></tr>
<tr><td>lấy 25</td><td>25 → a[5]; 8 chìm xuống dưới 17</td><td><code>17 13 8 3 5 | 25</code></td></tr>
<tr><td>lấy 17</td><td>17 → a[4]; 5 chìm xuống dưới 13</td><td><code>13 5 8 3 | 17 25</code></td></tr>
<tr><td>lấy 13</td><td>13 → a[3]; 3 chìm xuống dưới 8</td><td><code>8 5 3 | 13 17 25</code></td></tr>
<tr><td>lấy 8</td><td>8 → a[2]; 3 chìm xuống dưới 5</td><td><code>5 3 | 8 13 17 25</code></td></tr>
<tr><td>lấy 5</td><td>5 → a[1]</td><td><code>3 | 5 8 13 17 25</code></td></tr>
</tbody>
</table>
<ul>
<li>Sau bước 1, heap là [25 13 17 3 5 8] — một heap khác nhưng cũng hợp lệ như [25, 13, 17, 5, 8, 3] của slide, cùng sáu giá trị.</li>
<li>Ở bước 2, sau k lần lấy ra, k ô cuối chứa k giá trị lớn nhất theo đúng thứ tự.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> heap sort = "dựng heap, rồi n−1 lần đẩy phần tử lớn nhất về cuối". Muốn thứ tự tăng dần thì phải dùng MAX heap.</p>`],
      [37, 'Heap sort code',
        `<p class="y-chinh">🎯 Slide 37 gives both steps in code — the first loop sifts each a[i] up to build the heap, the second moves a[0] to position i and sifts the old a[i] down — O(n log n) in every case.</p>
<p>The slide's two fragments assembled in the logical order (the text on the slide lists the second step first) inside a method <code>heapSort()</code>; the class around it is not on the slide:</p>
<pre><code class="language-java">class EffSort {
    int[] a; int n;

    EffSort(int[] b) { a = b; n = b.length; }            // not on the slide
    void display() {                                     // not on the slide
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
        System.out.println();
    }

    void heapSort()                                      // the two parts of slide 37, in this order
    {
     // Transform the array to HEAP
     int i,s,f;int x;
     for(i=1;i&lt;n;i++)
     { x=a[i]; s=i; // s  is a son, f=(s-1)/2 is father
       while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
       { a[s]=a[(s-1)/2];   s=(s-1)/2;
       };
       a[s]=x;
     };
     // Transform heap to sorted array
     for(i=n-1;i&gt;0;i--)
     { x=a[i];a[i]=a[0];
       f=0; // f is father
       s=2*f+1; // s is a left son
       // if the right son is larger then it is selected
       if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
       while(s&lt;i &amp;&amp; x&lt;a[s])
       { a[f]=a[s]; f=s; s=2*f+1;
         if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
       };
       a[f]=x;
     };
    }
}

public class HeapSortSlide {
    public static void main(String[] args) {
        int[][] tests = {{3, 8, 17, 5, 13, 25}, {5, 2, 3, 8, 1}, {7, 3, 5, 9, 11, 8, 6, 15, 10, 12, 14}};
        for (int[] b : tests) {
            EffSort t = new EffSort(b);
            t.heapSort();
            t.display();
        }
    }
}</code></pre>
<div class="out">3 5 8 13 17 25<br>
1 2 3 5 8<br>
3 5 6 7 8 9 10 11 12 14 15</div>
<ul>
<li>Step 1: <code>while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])</code> moves the parent down and climbs while x is bigger than its parent; <code>a[s]=x</code> fills the hole. It shifts instead of swapping at every level, like insertion sort.</li>
<li>Step 2: <code>x=a[i]; a[i]=a[0];</code> puts the maximum in its final place i; then x sinks from the root: pick the larger child (<code>if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;</code>) and move it up while <code>x&lt;a[s]</code>.</li>
<li><code>s&lt;i</code> and <code>s+1&lt;i</code> keep the sift inside the heap a[0..i−1]: the sorted cells from i on must not be touched.</li>
</ul>
<p><strong>Big-O:</strong> each insertion climbs at most log₂ n levels and each removal sinks at most log₂ n levels; with n − 1 of each the total is O(n log n) — best, average and worst case alike. Extra memory O(1): everything happens inside the array.</p>
<div class="pitfall">Heap sort is not stable. And building the heap by n insertions, as here, costs O(n log n); the bottom-up method (deck 4B-Trees2) builds it in O(n) — but the whole sort stays O(n log n) either way, so "heap sort is O(n) because heap building is O(n)" is false.</div>`,
        `<p class="y-chinh">🎯 Slide 37 cho cả hai bước bằng code — vòng lặp đầu cho từng a[i] nổi lên để dựng đống (heap), vòng thứ hai đưa a[0] về vị trí i rồi cho a[i] cũ chìm xuống — O(n log n) trong mọi trường hợp.</p>
<p>Hai đoạn code của slide được ghép theo đúng thứ tự logic (chữ trên slide liệt kê bước thứ hai trước) vào một phương thức <code>heapSort()</code>; lớp bao quanh không có trên slide:</p>
<pre><code class="language-java">class EffSort {
    int[] a; int n;

    EffSort(int[] b) { a = b; n = b.length; }            // không có trên slide
    void display() {                                     // không có trên slide
        for (int i = 0; i &lt; n; i++) System.out.print(a[i] + " ");
        System.out.println();
    }

    void heapSort()                                      // hai phần của slide 37, theo đúng thứ tự này
    {
     // Biến mảng thành HEAP
     int i,s,f;int x;
     for(i=1;i&lt;n;i++)
     { x=a[i]; s=i; // s là con, cha của nó là f=(s-1)/2
       while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])
       { a[s]=a[(s-1)/2];   s=(s-1)/2;
       };
       a[s]=x;
     };
     // Biến heap thành mảng đã sắp
     for(i=n-1;i&gt;0;i--)
     { x=a[i];a[i]=a[0];
       f=0; // f là cha
       s=2*f+1; // s là con trái
       // nếu con phải lớn hơn thì chọn con phải
       if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
       while(s&lt;i &amp;&amp; x&lt;a[s])
       { a[f]=a[s]; f=s; s=2*f+1;
         if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;
       };
       a[f]=x;
     };
    }
}

public class HeapSortSlide {
    public static void main(String[] args) {
        int[][] tests = {{3, 8, 17, 5, 13, 25}, {5, 2, 3, 8, 1}, {7, 3, 5, 9, 11, 8, 6, 15, 10, 12, 14}};
        for (int[] b : tests) {
            EffSort t = new EffSort(b);
            t.heapSort();
            t.display();
        }
    }
}</code></pre>
<div class="out">3 5 8 13 17 25<br>
1 2 3 5 8<br>
3 5 6 7 8 9 10 11 12 14 15</div>
<ul>
<li>Bước 1: <code>while(s&gt;0 &amp;&amp; x&gt;a[(s-1)/2])</code> dời cha xuống và leo lên chừng nào x còn lớn hơn cha; <code>a[s]=x</code> lấp chỗ trống. Nó dời (shift) thay vì đổi chỗ (swap) ở mỗi tầng, giống sắp xếp chèn (insertion sort).</li>
<li>Bước 2: <code>x=a[i]; a[i]=a[0];</code> đặt phần tử lớn nhất vào đúng chỗ cuối cùng i; rồi x chìm dần từ gốc: chọn con lớn hơn (<code>if(s+1&lt;i &amp;&amp; a[s]&lt;a[s+1]) s=s+1;</code>) và kéo nó lên chừng nào <code>x&lt;a[s]</code>.</li>
<li><code>s&lt;i</code> và <code>s+1&lt;i</code> giữ việc sàng (sift) nằm trong heap a[0..i−1]: các ô đã sắp từ i trở đi không được động tới.</li>
</ul>
<p><strong>Big-O:</strong> mỗi lần chèn leo nhiều nhất log₂ n tầng, mỗi lần lấy ra chìm nhiều nhất log₂ n tầng; mỗi loại n − 1 lần nên tổng là O(n log n) — tốt nhất, trung bình và xấu nhất như nhau. Bộ nhớ thêm O(1): mọi thứ diễn ra ngay trong mảng.</p>
<div class="pitfall">Sắp xếp vun đống (heap sort) không ổn định (stable). Và dựng heap bằng n lần chèn như ở đây tốn O(n log n); cách dựng từ dưới lên (bottom-up, bộ slide 4B-Trees2) chỉ tốn O(n) — nhưng cả thuật toán vẫn là O(n log n), nên câu "heap sort là O(n) vì dựng heap là O(n)" là SAI.</div>`],
      [38, 'Radix sort - 1',
        `<p class="y-chinh">🎯 Radix sort never compares two numbers: it distributes them into 10 sublists by one digit, gathers the sublists back in order 0 → 9, and repeats from the one's digit up to the highest digit.</p>
<ul>
<li>Pass 1 (one's digit): each number is appended to sublist d in the order it is found; then sublists 0, 1, …, 9 are joined back into the main list.</li>
<li>The digit is isolated with arithmetic: <code>(x / 1) % 10</code>, <code>(x / 10) % 10</code>, <code>(x / 100) % 10</code>.</li>
<li>The slide's note — "the order in which we divide and reassemble the list is extremely important" — means: every sublist keeps the arrival order (first in, first out), and the sublists are gathered from 0 to 9.</li>
<li>Numbers that share a sublist in a later pass keep the order of this pass: in pass 2, 710, 812 and 715 share the ten's digit 1 and come out as 710 812 715 — already ordered by their one's digit.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class RadixSort {
    static String line(List&lt;Integer&gt; list) {
        String s = "";
        for (int x : list) s += x + " ";
        return s.trim();
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        for (int x : new int[] {493, 812, 715, 340, 195, 437, 710, 582, 385}) list.add(x);   // slide 38
        System.out.println("start      : " + line(list));
        String[] names = {"one's", "ten's", "hundred's"};
        int exp = 1;                                     // 1, 10, 100: which digit
        for (int pass = 0; pass &lt; 3; pass++, exp *= 10) {
            List&lt;List&lt;Integer&gt;&gt; bucket = new ArrayList&lt;List&lt;Integer&gt;&gt;();
            for (int d = 0; d &lt; 10; d++) bucket.add(new ArrayList&lt;Integer&gt;());
            for (int x : list) bucket.get((x / exp) % 10).add(x);   // divide: append in the order found
            String b = "";
            for (int d = 0; d &lt; 10; d++)
                if (!bucket.get(d).isEmpty()) b += d + ":[" + line(bucket.get(d)) + "] ";
            list.clear();
            for (int d = 0; d &lt; 10; d++) list.addAll(bucket.get(d));  // gather: sublist 0, then 1, ..., 9
            System.out.println(names[pass] + " digit buckets: " + b.trim());
            System.out.println("  gathered : " + line(list));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 493 812 715 340 195 437 710 582 385<br>
one's digit buckets: 0:[340 710] 2:[812 582] 3:[493] 5:[715 195 385] 7:[437]<br>
&nbsp;&nbsp;gathered : 340 710 812 582 493 715 195 385 437<br>
ten's digit buckets: 1:[710 812 715] 3:[437] 4:[340] 8:[582 385] 9:[493 195]<br>
&nbsp;&nbsp;gathered : 710 812 715 437 340 582 385 493 195<br>
hundred's digit buckets: 1:[195] 3:[340 385] 4:[437 493] 5:[582] 7:[710 715] 8:[812]<br>
&nbsp;&nbsp;gathered : 195 340 385 437 493 582 710 715 812</div>
<table>
<thead><tr><th>One's digit</th><th>Sublist, in the order found</th></tr></thead>
<tbody>
<tr><td>0</td><td>340 710</td></tr>
<tr><td>2</td><td>812 582</td></tr>
<tr><td>3</td><td>493</td></tr>
<tr><td>5</td><td>715 195 385</td></tr>
<tr><td>7</td><td>437</td></tr>
<tr><td>gathered</td><td>340 710 812 582 493 715 195 385 437 — the list printed on the slide</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> LSD radix sort = "last digit first" — like sorting dates by day, then (stably) by month, then by year.</p>`,
        `<p class="y-chinh">🎯 Sắp xếp theo cơ số (radix sort) không bao giờ so sánh hai số: nó chia các số vào 10 danh sách con (sublist) theo một chữ số, gom các danh sách con lại theo thứ tự 0 → 9, rồi lặp lại từ hàng đơn vị lên tới hàng cao nhất.</p>
<ul>
<li>Lượt 1 (hàng đơn vị): mỗi số được thêm vào cuối danh sách con d theo đúng thứ tự gặp; rồi các danh sách con 0, 1, …, 9 được nối lại thành danh sách chính.</li>
<li>Chữ số được tách bằng phép tính: <code>(x / 1) % 10</code>, <code>(x / 10) % 10</code>, <code>(x / 100) % 10</code>.</li>
<li>Ghi chú của slide — "thứ tự chia ra và gom lại cực kỳ quan trọng" — nghĩa là: mỗi danh sách con giữ đúng thứ tự vào trước ra trước (FIFO), và các danh sách con được gom từ 0 tới 9.</li>
<li>Các số rơi vào cùng một danh sách con ở lượt sau sẽ giữ thứ tự của lượt này: ở lượt 2, 710, 812 và 715 cùng có chữ số hàng chục là 1 và ra theo thứ tự 710 812 715 — đã đúng thứ tự theo hàng đơn vị.</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class RadixSort {
    static String line(List&lt;Integer&gt; list) {
        String s = "";
        for (int x : list) s += x + " ";
        return s.trim();
    }

    public static void main(String[] args) {
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        for (int x : new int[] {493, 812, 715, 340, 195, 437, 710, 582, 385}) list.add(x);   // slide 38
        System.out.println("start      : " + line(list));
        String[] names = {"one's", "ten's", "hundred's"};
        int exp = 1;                                     // 1, 10, 100: đang xét chữ số nào
        for (int pass = 0; pass &lt; 3; pass++, exp *= 10) {
            List&lt;List&lt;Integer&gt;&gt; bucket = new ArrayList&lt;List&lt;Integer&gt;&gt;();
            for (int d = 0; d &lt; 10; d++) bucket.add(new ArrayList&lt;Integer&gt;());
            for (int x : list) bucket.get((x / exp) % 10).add(x);   // chia: thêm vào cuối, đúng thứ tự gặp
            String b = "";
            for (int d = 0; d &lt; 10; d++)
                if (!bucket.get(d).isEmpty()) b += d + ":[" + line(bucket.get(d)) + "] ";
            list.clear();
            for (int d = 0; d &lt; 10; d++) list.addAll(bucket.get(d));  // gom: sublist 0, rồi 1, ..., 9
            System.out.println(names[pass] + " digit buckets: " + b.trim());
            System.out.println("  gathered : " + line(list));
        }
    }
}</code></pre>
<div class="out">start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 493 812 715 340 195 437 710 582 385<br>
one's digit buckets: 0:[340 710] 2:[812 582] 3:[493] 5:[715 195 385] 7:[437]<br>
&nbsp;&nbsp;gathered : 340 710 812 582 493 715 195 385 437<br>
ten's digit buckets: 1:[710 812 715] 3:[437] 4:[340] 8:[582 385] 9:[493 195]<br>
&nbsp;&nbsp;gathered : 710 812 715 437 340 582 385 493 195<br>
hundred's digit buckets: 1:[195] 3:[340 385] 4:[437 493] 5:[582] 7:[710 715] 8:[812]<br>
&nbsp;&nbsp;gathered : 195 340 385 437 493 582 710 715 812</div>
<table>
<thead><tr><th>Chữ số hàng đơn vị</th><th>Danh sách con, theo thứ tự gặp</th></tr></thead>
<tbody>
<tr><td>0</td><td>340 710</td></tr>
<tr><td>2</td><td>812 582</td></tr>
<tr><td>3</td><td>493</td></tr>
<tr><td>5</td><td>715 195 385</td></tr>
<tr><td>7</td><td>437</td></tr>
<tr><td>gom lại</td><td>340 710 812 582 493 715 195 385 437 — đúng dãy in trên slide</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> radix sort LSD (least significant digit — chữ số thấp nhất trước) = "chữ số cuối làm trước" — giống sắp ngày tháng: theo ngày, rồi (giữ ổn định) theo tháng, rồi theo năm.</p>`],
      [39, 'Radix sort - 2',
        `<p class="y-chinh">🎯 Passes 2 and 3 repeat the same step on the ten's and the hundred's digit; after the last pass the list is sorted — correct only because every pass keeps the order left by the previous one.</p>
<table>
<thead><tr><th>Pass</th><th>Non-empty sublists</th><th>Gathered list (as on the slide)</th></tr></thead>
<tbody>
<tr><td>ten's digit</td><td>1: 710 812 715 · 3: 437 · 4: 340 · 8: 582 385 · 9: 493 195</td><td>710 812 715 437 340 582 385 493 195</td></tr>
<tr><td>hundred's digit</td><td>1: 195 · 3: 340 385 · 4: 437 493 · 5: 582 · 7: 710 715 · 8: 812</td><td>195 340 385 437 493 582 710 715 812</td></tr>
</tbody>
</table>
<p>Both gathered lists are exactly the slide's (the program of slide 38 printed them). Why the order matters — the same data with the rule broken in two ways:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class RadixOrder {
    static final int[] DATA = {493, 812, 715, 340, 195, 437, 710, 582, 385};   // slide 38

    // one radix sort; exps = digit order, lifo = read each sublist backwards
    static List&lt;Integer&gt; radix(int[] exps, boolean lifo) {
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        for (int x : DATA) list.add(x);
        for (int exp : exps) {
            List&lt;List&lt;Integer&gt;&gt; bucket = new ArrayList&lt;List&lt;Integer&gt;&gt;();
            for (int d = 0; d &lt; 10; d++) bucket.add(new ArrayList&lt;Integer&gt;());
            for (int x : list) bucket.get((x / exp) % 10).add(x);
            list.clear();
            for (int d = 0; d &lt; 10; d++) {
                List&lt;Integer&gt; b = bucket.get(d);
                if (lifo) for (int k = b.size() - 1; k &gt;= 0; k--) list.add(b.get(k));
                else list.addAll(b);
            }
        }
        return list;
    }

    static void report(String name, List&lt;Integer&gt; r) {
        boolean ok = true;
        for (int i = 1; i &lt; r.size(); i++) if (r.get(i - 1) &gt; r.get(i)) ok = false;
        String s = "";
        for (int x : r) s += x + " ";
        System.out.println(name + s.trim() + (ok ? "  sorted" : "  NOT sorted"));
    }

    public static void main(String[] args) {
        report("ones-&gt;tens-&gt;hundreds, FIFO: ", radix(new int[] {1, 10, 100}, false));
        report("ones-&gt;tens-&gt;hundreds, LIFO: ", radix(new int[] {1, 10, 100}, true));
        report("hundreds-&gt;tens-&gt;ones, FIFO: ", radix(new int[] {100, 10, 1}, false));
    }
}</code></pre>
<div class="out">ones-&gt;tens-&gt;hundreds, FIFO: 195 340 385 437 493 582 710 715 812 &nbsp;sorted<br>
ones-&gt;tens-&gt;hundreds, LIFO: 195 385 340 493 437 582 710 715 812 &nbsp;NOT sorted<br>
hundreds-&gt;tens-&gt;ones, FIFO: 710 340 812 582 493 715 385 195 437 &nbsp;NOT sorted</div>
<ul>
<li>Reading a sublist backwards (LIFO) destroys the order left by the previous pass: 385 ends up before 340.</li>
<li>Starting from the hundred's digit leaves the list sorted only by the last digit used — the one's digit.</li>
<li>Cost: d passes, each distributing n numbers and gathering 10 sublists → O(d·(n + 10)), linear in n for a fixed number of digits; memory O(n) for the sublists.</li>
</ul>
<p class="dap-an">✅ <strong>Disadvantages — also the syllabus question HCM_CQ16.2:</strong> the slide's point is that its speed depends on the inner operations — inserting into and deleting from the sublists, isolating the digit — and done inefficiently it is slower than quicksort or merge sort. Beyond the slide: it only fits keys made of digits or characters (integers, fixed-length strings); negative and real numbers need extra handling; it needs O(n) extra memory for the sublists; and the number of passes grows with the key length.</p>
<div class="pitfall">Radix sort is not a comparison sort, so the Ω(n log n) lower bound of comparison sorts does not apply to it — but it is not free: with d digits it is O(d·n), and d grows with the size of the keys.</div>`,
        `<p class="y-chinh">🎯 Lượt 2 và 3 lặp lại đúng bước đó với hàng chục và hàng trăm; sau lượt cuối danh sách đã được sắp — và chỉ đúng vì lượt nào cũng giữ nguyên thứ tự mà lượt trước để lại.</p>
<table>
<thead><tr><th>Lượt</th><th>Danh sách con không rỗng</th><th>Danh sách gom lại (như trên slide)</th></tr></thead>
<tbody>
<tr><td>hàng chục</td><td>1: 710 812 715 · 3: 437 · 4: 340 · 8: 582 385 · 9: 493 195</td><td>710 812 715 437 340 582 385 493 195</td></tr>
<tr><td>hàng trăm</td><td>1: 195 · 3: 340 385 · 4: 437 493 · 5: 582 · 7: 710 715 · 8: 812</td><td>195 340 385 437 493 582 710 715 812</td></tr>
</tbody>
</table>
<p>Cả hai dãy gom lại trùng đúng dãy trên slide (chương trình ở slide 38 đã in ra). Vì sao thứ tự quan trọng — cùng dữ liệu nhưng phá luật theo hai cách:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class RadixOrder {
    static final int[] DATA = {493, 812, 715, 340, 195, 437, 710, 582, 385};   // slide 38

    // một lần radix sort; exps = thứ tự chữ số, lifo = đọc mỗi sublist từ cuối lên
    static List&lt;Integer&gt; radix(int[] exps, boolean lifo) {
        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;();
        for (int x : DATA) list.add(x);
        for (int exp : exps) {
            List&lt;List&lt;Integer&gt;&gt; bucket = new ArrayList&lt;List&lt;Integer&gt;&gt;();
            for (int d = 0; d &lt; 10; d++) bucket.add(new ArrayList&lt;Integer&gt;());
            for (int x : list) bucket.get((x / exp) % 10).add(x);
            list.clear();
            for (int d = 0; d &lt; 10; d++) {
                List&lt;Integer&gt; b = bucket.get(d);
                if (lifo) for (int k = b.size() - 1; k &gt;= 0; k--) list.add(b.get(k));
                else list.addAll(b);
            }
        }
        return list;
    }

    static void report(String name, List&lt;Integer&gt; r) {
        boolean ok = true;
        for (int i = 1; i &lt; r.size(); i++) if (r.get(i - 1) &gt; r.get(i)) ok = false;
        String s = "";
        for (int x : r) s += x + " ";
        System.out.println(name + s.trim() + (ok ? "  sorted" : "  NOT sorted"));
    }

    public static void main(String[] args) {
        report("ones-&gt;tens-&gt;hundreds, FIFO: ", radix(new int[] {1, 10, 100}, false));
        report("ones-&gt;tens-&gt;hundreds, LIFO: ", radix(new int[] {1, 10, 100}, true));
        report("hundreds-&gt;tens-&gt;ones, FIFO: ", radix(new int[] {100, 10, 1}, false));
    }
}</code></pre>
<div class="out">ones-&gt;tens-&gt;hundreds, FIFO: 195 340 385 437 493 582 710 715 812 &nbsp;sorted<br>
ones-&gt;tens-&gt;hundreds, LIFO: 195 385 340 493 437 582 710 715 812 &nbsp;NOT sorted<br>
hundreds-&gt;tens-&gt;ones, FIFO: 710 340 812 582 493 715 385 195 437 &nbsp;NOT sorted</div>
<ul>
<li>Đọc danh sách con từ cuối lên (LIFO — vào sau ra trước) phá thứ tự mà lượt trước để lại: 385 đứng trước 340.</li>
<li>Bắt đầu từ hàng trăm thì danh sách chỉ được sắp theo chữ số dùng sau cùng — hàng đơn vị.</li>
<li>Chi phí: d lượt, mỗi lượt chia n số và gom 10 danh sách con → O(d·(n + 10)), tuyến tính theo n khi số chữ số cố định; bộ nhớ O(n) cho các danh sách con.</li>
</ul>
<p class="dap-an">✅ <strong>Nhược điểm — cũng là câu hỏi HCM_CQ16.2 của syllabus:</strong> ý của slide là tốc độ phụ thuộc vào các thao tác bên trong — thêm vào và lấy ra khỏi danh sách con, tách chữ số — nếu làm không hiệu quả thì nó chậm hơn sắp xếp nhanh (quicksort) hay sắp xếp trộn (merge sort). Ngoài slide: nó chỉ hợp với khoá gồm chữ số hoặc ký tự (số nguyên, chuỗi cùng độ dài); số âm và số thực cần xử lý thêm; nó cần O(n) bộ nhớ thêm cho các danh sách con; và số lượt tăng theo độ dài khoá.</p>
<div class="pitfall">Sắp xếp theo cơ số (radix sort) không phải sắp xếp bằng so sánh, nên cận dưới Ω(n log n) của sắp xếp so sánh không áp dụng cho nó — nhưng nó cũng không "miễn phí": với d chữ số nó là O(d·n), và d tăng theo kích thước khoá.</div>`],
      [40, 'Sorting in java.util - 1',
        `<p class="y-chinh">🎯 Java already ships sorting — <code>java.util.Arrays</code> for arrays and <code>java.util.Collections</code> for lists — and Arrays can also search, fill and convert arrays.</p>
<ul>
<li><code>Arrays.sort(a)</code> — ascending order (primitive types: Dual-Pivot Quicksort; objects: TimSort, a stable merge-based sort).</li>
<li><code>Arrays.binarySearch(a, key)</code> — O(log n) search; the array must be sorted first. Not found → it returns −(insertion point) − 1, a negative number.</li>
<li><code>Arrays.fill(a, v)</code> — sets every cell to v.</li>
<li><code>Arrays.asList(...)</code> — a fixed-size List backed by the array: changing one changes the other; <code>add</code> and <code>remove</code> throw an exception.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ArraysUtil {
    public static void main(String[] args) {
        int[] a = {40, 10, 30, 20, 50};
        Arrays.sort(a);                                  // sort the whole array
        System.out.println("sort           : " + Arrays.toString(a));
        System.out.println("binarySearch 30: " + Arrays.binarySearch(a, 30));   // found at index 2
        System.out.println("binarySearch 35: " + Arrays.binarySearch(a, 35));   // not found: -(3)-1

        int[] z = new int[5];
        Arrays.fill(z, 7);                               // every cell = 7
        System.out.println("fill 7         : " + Arrays.toString(z));

        String[] names = {"Lan", "An", "Minh"};
        List&lt;String&gt; list = Arrays.asList(names);        // a List view of the array
        Collections.sort(list);                          // sorting the list sorts the array too
        System.out.println("asList + sort  : " + list + ", array now " + Arrays.toString(names));
        try {
            list.add("Binh");                            // the size is fixed
        } catch (UnsupportedOperationException e) {
            System.out.println("list.add       : " + e.getClass().getSimpleName());
        }
        int[] nums = {3, 1, 2};
        System.out.println("asList(int[])  : size " + Arrays.asList(nums).size());   // one element: the array itself
    }
}</code></pre>
<div class="out">sort &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [10, 20, 30, 40, 50]<br>
binarySearch 30: 2<br>
binarySearch 35: -4<br>
fill 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [7, 7, 7, 7, 7]<br>
asList + sort &nbsp;: [An, Lan, Minh], array now [An, Lan, Minh]<br>
list.add &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: UnsupportedOperationException<br>
asList(int[]) &nbsp;: size 1</div>
<p class="meo">🧠 <strong>Remember:</strong> binarySearch "not found" = −(where it would go) − 1: 35 would go to index 3 → −4.</p>
<div class="pitfall"><code>Arrays.asList(nums)</code> with an <code>int[]</code> gives a list of ONE element — the array itself: generics work only with objects, so the whole <code>int[]</code> is taken as a single object (last line). Use an <code>Integer[]</code> or a loop. And <code>binarySearch</code> on an unsorted array returns an undefined result, not an error.</div>`,
        `<p class="y-chinh">🎯 Java có sẵn sắp xếp — <code>java.util.Arrays</code> cho mảng và <code>java.util.Collections</code> cho danh sách — và lớp Arrays còn tìm kiếm, gán giá trị hàng loạt và chuyển mảng thành danh sách.</p>
<ul>
<li><code>Arrays.sort(a)</code> — sắp tăng dần (kiểu nguyên thuỷ — primitive: Dual-Pivot Quicksort, quicksort hai chốt; đối tượng: TimSort, một kiểu sắp trộn ổn định).</li>
<li><code>Arrays.binarySearch(a, key)</code> — tìm kiếm nhị phân (binary search) O(log n); mảng phải được sắp trước. Không thấy → trả về −(vị trí chèn) − 1, một số âm.</li>
<li><code>Arrays.fill(a, v)</code> — gán v cho mọi ô.</li>
<li><code>Arrays.asList(...)</code> — một List kích thước cố định "đứng trên" chính mảng đó: sửa bên này thì bên kia đổi theo; <code>add</code> và <code>remove</code> ném ngoại lệ (exception).</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class ArraysUtil {
    public static void main(String[] args) {
        int[] a = {40, 10, 30, 20, 50};
        Arrays.sort(a);                                  // sắp cả mảng
        System.out.println("sort           : " + Arrays.toString(a));
        System.out.println("binarySearch 30: " + Arrays.binarySearch(a, 30));   // thấy ở chỉ số 2
        System.out.println("binarySearch 35: " + Arrays.binarySearch(a, 35));   // không thấy: -(3)-1

        int[] z = new int[5];
        Arrays.fill(z, 7);                               // mọi ô = 7
        System.out.println("fill 7         : " + Arrays.toString(z));

        String[] names = {"Lan", "An", "Minh"};
        List&lt;String&gt; list = Arrays.asList(names);        // một List "nhìn vào" chính mảng đó
        Collections.sort(list);                          // sắp list là sắp luôn mảng
        System.out.println("asList + sort  : " + list + ", array now " + Arrays.toString(names));
        try {
            list.add("Binh");                            // kích thước cố định
        } catch (UnsupportedOperationException e) {
            System.out.println("list.add       : " + e.getClass().getSimpleName());
        }
        int[] nums = {3, 1, 2};
        System.out.println("asList(int[])  : size " + Arrays.asList(nums).size());   // một phần tử: chính mảng đó
    }
}</code></pre>
<div class="out">sort &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [10, 20, 30, 40, 50]<br>
binarySearch 30: 2<br>
binarySearch 35: -4<br>
fill 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: [7, 7, 7, 7, 7]<br>
asList + sort &nbsp;: [An, Lan, Minh], array now [An, Lan, Minh]<br>
list.add &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: UnsupportedOperationException<br>
asList(int[]) &nbsp;: size 1</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> binarySearch "không thấy" = −(chỗ lẽ ra nó đứng) − 1: 35 lẽ ra ở chỉ số 3 → −4.</p>
<div class="pitfall"><code>Arrays.asList(nums)</code> với <code>int[]</code> cho danh sách có MỘT phần tử — chính cái mảng: generics (kiểu tổng quát) chỉ làm việc với đối tượng, nên cả mảng <code>int[]</code> bị coi là một đối tượng (dòng cuối). Hãy dùng <code>Integer[]</code> hoặc một vòng lặp. Còn <code>binarySearch</code> trên mảng chưa sắp trả về kết quả không xác định, không báo lỗi.</div>`],
      [41, 'Sorting in java.util - 2',
        `<p class="y-chinh">🎯 <code>sort</code> exists for arrays of every primitive type except boolean, in two versions — the whole array, and a sub-array whose real parameters are (a, fromIndex, toIndex), with toIndex NOT included.</p>
<ul>
<li>The slide writes <code>sort(int[] a, int first, int last)</code>; the real signature is <code>sort(int[] a, int fromIndex, int toIndex)</code> and it sorts a[fromIndex … toIndex−1].</li>
<li>fromIndex > toIndex → <code>IllegalArgumentException</code>; fromIndex &lt; 0 or toIndex > a.length → <code>ArrayIndexOutOfBoundsException</code>.</li>
<li>There is no <code>sort(boolean[])</code> — such a call does not compile.</li>
<li>Objects: <code>Arrays.sort(T[], Comparator)</code> and <code>Collections.sort(List)</code> are stable — equal elements keep their order (pear, kiwi, plum below).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ArraysRange {
    static void trySort(int[] a, int from, int to) {
        try {
            Arrays.sort(a, from, to);
            System.out.println("sort(a, " + from + ", " + to + ") -&gt; " + Arrays.toString(a));
        } catch (RuntimeException e) {
            System.out.println("sort(a, " + from + ", " + to + ") -&gt; " + e.getClass().getSimpleName());
        }
    }

    public static void main(String[] args) {
        int[] a = {9, 8, 7, 6, 5, 4};
        trySort(a, 1, 4);                                // sorts a[1], a[2], a[3] only
        trySort(a, 3, 1);                                // fromIndex &gt; toIndex
        trySort(a, 0, 7);                                // toIndex &gt; a.length

        String[] fruit = {"pear", "fig", "kiwi", "apple", "plum"};
        Arrays.sort(fruit, new Comparator&lt;String&gt;() {    // objects: stable merge-based sort (TimSort)
            public int compare(String x, String y) { return x.length() - y.length(); }
        });
        System.out.println("by length      -&gt; " + Arrays.toString(fruit));

        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;(Arrays.asList(5, 3, 9, 1));
        Collections.sort(list);                          // the version for lists
        System.out.println("Collections.sort -&gt; " + list);
    }
}</code></pre>
<div class="out">sort(a, 1, 4) -&gt; [9, 6, 7, 8, 5, 4]<br>
sort(a, 3, 1) -&gt; IllegalArgumentException<br>
sort(a, 0, 7) -&gt; ArrayIndexOutOfBoundsException<br>
by length &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [fig, pear, kiwi, plum, apple]<br>
Collections.sort -&gt; [1, 3, 5, 9]</div>
<div class="pitfall"><code>Arrays.sort(a, 1, 4)</code> sorts indices 1, 2 and 3 — not 4. Reading "last" on the slide as inclusive predicts [9, 5, 6, 7, 8, 4] instead of the real [9, 6, 7, 8, 5, 4]. The same half-open rule is used by <code>substring</code>, <code>Arrays.copyOfRange</code> and <code>List.subList</code>.</div>
<p class="meo">🧠 <strong>Remember:</strong> Java ranges are [from, to) — the number of elements is to − from.</p>`,
        `<p class="y-chinh">🎯 <code>sort</code> có cho mảng của mọi kiểu nguyên thuỷ (primitive) trừ boolean, với hai phiên bản — cả mảng, và một đoạn con có tham số thật là (a, fromIndex, toIndex), trong đó toIndex KHÔNG được tính.</p>
<ul>
<li>Slide viết <code>sort(int[] a, int first, int last)</code>; chữ ký (signature) thật là <code>sort(int[] a, int fromIndex, int toIndex)</code> và nó sắp a[fromIndex … toIndex−1].</li>
<li>fromIndex > toIndex → <code>IllegalArgumentException</code>; fromIndex &lt; 0 hoặc toIndex > a.length → <code>ArrayIndexOutOfBoundsException</code>.</li>
<li>Không có <code>sort(boolean[])</code> — lời gọi như vậy không biên dịch được.</li>
<li>Với đối tượng: <code>Arrays.sort(T[], Comparator)</code> và <code>Collections.sort(List)</code> là sắp xếp ổn định (stable) — phần tử bằng nhau giữ nguyên thứ tự (pear, kiwi, plum ở dưới).</li>
</ul>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ArraysRange {
    static void trySort(int[] a, int from, int to) {
        try {
            Arrays.sort(a, from, to);
            System.out.println("sort(a, " + from + ", " + to + ") -&gt; " + Arrays.toString(a));
        } catch (RuntimeException e) {
            System.out.println("sort(a, " + from + ", " + to + ") -&gt; " + e.getClass().getSimpleName());
        }
    }

    public static void main(String[] args) {
        int[] a = {9, 8, 7, 6, 5, 4};
        trySort(a, 1, 4);                                // chỉ sắp a[1], a[2], a[3]
        trySort(a, 3, 1);                                // fromIndex &gt; toIndex
        trySort(a, 0, 7);                                // toIndex &gt; a.length

        String[] fruit = {"pear", "fig", "kiwi", "apple", "plum"};
        Arrays.sort(fruit, new Comparator&lt;String&gt;() {    // đối tượng: sắp ổn định kiểu trộn (TimSort)
            public int compare(String x, String y) { return x.length() - y.length(); }
        });
        System.out.println("by length      -&gt; " + Arrays.toString(fruit));

        List&lt;Integer&gt; list = new ArrayList&lt;Integer&gt;(Arrays.asList(5, 3, 9, 1));
        Collections.sort(list);                          // bản dành cho danh sách
        System.out.println("Collections.sort -&gt; " + list);
    }
}</code></pre>
<div class="out">sort(a, 1, 4) -&gt; [9, 6, 7, 8, 5, 4]<br>
sort(a, 3, 1) -&gt; IllegalArgumentException<br>
sort(a, 0, 7) -&gt; ArrayIndexOutOfBoundsException<br>
by length &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; [fig, pear, kiwi, plum, apple]<br>
Collections.sort -&gt; [1, 3, 5, 9]</div>
<div class="pitfall"><code>Arrays.sort(a, 1, 4)</code> sắp các chỉ số 1, 2, 3 — không có 4. Hiểu "last" trên slide là có tính cả phần tử cuối sẽ đoán ra [9, 5, 6, 7, 8, 4] thay vì kết quả thật [9, 6, 7, 8, 5, 4]. Quy tắc nửa mở này cũng dùng cho <code>substring</code>, <code>Arrays.copyOfRange</code> và <code>List.subList</code>.</div>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoảng trong Java là [from, to) — số phần tử bằng to − from.</p>`],
      [42, 'Summary',
        `<p class="y-chinh">🎯 The deck in one sentence: three O(n²) elementary sorts, three O(n log n) efficient sorts with different trade-offs, one sort without comparisons, and the library sorts to use in real code.</p>
<table>
<thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Extra memory</th><th>Stable</th><th>Slides</th></tr></thead>
<tbody>
<tr><td>Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>no</td><td>4–6</td></tr>
<tr><td>Insertion</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td><td>7–9</td></tr>
<tr><td>Bubble, with flag</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td><td>10</td></tr>
<tr><td>Quick</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) stack</td><td>no</td><td>12–30</td></tr>
<tr><td>Merge</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>yes, with <code>&lt;=</code></td><td>31–33</td></tr>
<tr><td>Heap</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>no</td><td>34–37</td></tr>
<tr><td>Radix, LSD, d digits</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(n + b)</td><td>yes</td><td>38–39</td></tr>
</tbody>
</table>
<p>The same 1000 numbers given to the six comparison sorts of the deck, in the slides' versions, counting comparisons:</p>
<pre><code class="language-java">import java.util.Random;

public class SortCompare {
    static long c;                                       // comparisons between two elements
    static boolean lt(int x, int y) { c++; return x &lt; y; }
    static void sw(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static void selection(int[] a) {                     // slide 6
        for (int i = 0; i &lt; a.length - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; a.length; j++) if (lt(a[j], a[k])) k = j;
            if (k != i) sw(a, i, k);
        }
    }
    static void insertion(int[] a) {                     // slide 9
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0 &amp;&amp; lt(x, a[j - 1])) { a[j] = a[j - 1]; j--; }
            a[j] = x;
        }
    }
    static void bubble(int[] a) {                        // slide 10
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i &lt; a.length - 1; i++) if (lt(a[i + 1], a[i])) { sw(a, i, i + 1); swapped = true; }
        } while (swapped);
    }
    static void quick(int[] a, int p, int r) {           // slide 15 (pivot = first element)
        if (p &gt;= r) return;
        int pivot = a[p], i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; !lt(pivot, a[i])) i++;
            while (lt(pivot, a[j])) j--;
            if (i &gt;= j) break;
            sw(a, i, j);
        }
        sw(a, p, j);
        quick(a, p, j - 1);
        quick(a, j + 1, r);
    }
    static void merge(int[] a, int p, int r) {           // slide 33, with &lt;=
        if (p &gt;= r) return;
        int q = (p + r) / 2, i = p, j = q + 1, k = 0;
        merge(a, p, q); merge(a, q + 1, r);
        int[] b = new int[r - p + 1];
        while (i &lt;= q &amp;&amp; j &lt;= r) b[k++] = lt(a[j], a[i]) ? a[j++] : a[i++];
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
    }
    static void heap(int[] a) {                          // slide 37
        int n = a.length, i, s, f, x;
        for (i = 1; i &lt; n; i++) {
            x = a[i]; s = i;
            while (s &gt; 0 &amp;&amp; lt(a[(s - 1) / 2], x)) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
        }
        for (i = n - 1; i &gt; 0; i--) {
            x = a[i]; a[i] = a[0]; f = 0; s = 1;
            if (s + 1 &lt; i &amp;&amp; lt(a[s], a[s + 1])) s++;
            while (s &lt; i &amp;&amp; lt(x, a[s])) {
                a[f] = a[s]; f = s; s = 2 * f + 1;
                if (s + 1 &lt; i &amp;&amp; lt(a[s], a[s + 1])) s++;
            }
            a[f] = x;
        }
    }

    static long count(int alg, int[] data) {
        int[] a = data.clone();
        c = 0;
        if (alg == 0) selection(a); else if (alg == 1) insertion(a); else if (alg == 2) bubble(a);
        else if (alg == 3) quick(a, 0, a.length - 1); else if (alg == 4) merge(a, 0, a.length - 1); else heap(a);
        for (int i = 1; i &lt; a.length; i++) if (a[i - 1] &gt; a[i]) throw new RuntimeException("not sorted");
        return c;
    }

    public static void main(String[] args) {
        int n = 1000;
        int[] rnd = new int[n], up = new int[n], down = new int[n];
        for (int i = 0; i &lt; n; i++) { rnd[i] = up[i] = i + 1; down[i] = n - i; }
        Random mix = new Random(2024);                   // fixed seed
        for (int i = n - 1; i &gt; 0; i--) { int k = mix.nextInt(i + 1); sw(rnd, i, k); }
        String[] names = {"selection", "insertion", "bubble", "quick", "merge", "heap"};
        System.out.printf("n = %d     %9s %9s %9s%n", n, "random", "sorted", "reversed");
        for (int alg = 0; alg &lt; 6; alg++)
            System.out.printf("%-12s %9d %9d %9d%n", names[alg], count(alg, rnd), count(alg, up), count(alg, down));
    }
}</code></pre>
<div class="out">n = 1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;random &nbsp;&nbsp;&nbsp;sorted &nbsp;reversed<br>
selection &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;499500<br>
insertion &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;247752 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;999 &nbsp;&nbsp;&nbsp;499500<br>
bubble &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;973026 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;999 &nbsp;&nbsp;&nbsp;999000<br>
quick &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15506 &nbsp;&nbsp;&nbsp;501498 &nbsp;&nbsp;&nbsp;500998<br>
merge &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8707 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5044 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4932<br>
heap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17269 &nbsp;&nbsp;&nbsp;&nbsp;22462 &nbsp;&nbsp;&nbsp;&nbsp;15965</div>
<ul>
<li>On random data the O(n²) sorts need 250 thousand to 1 million comparisons, the O(n log n) sorts 9 to 17 thousand.</li>
<li>Insertion and bubble sort shine only on sorted input (999); quicksort with a first-element pivot collapses exactly there.</li>
<li>Merge sort makes the fewest comparisons on random and on reversed input (on sorted input only insertion and bubble sort beat it), but needs O(n) memory; heap sort stays steady with O(1) memory.</li>
</ul>
<p class="dap-an">✅ <strong>Syllabus questions CQ16.2 / CQ16.3 — fastest? best for memory?</strong> No single winner. For general data in memory quicksort is usually fastest in practice (small constant, sequential scans) — Java's <code>Arrays.sort</code> for primitives is a quicksort variant; merge sort when stability or a guaranteed O(n log n) is needed; insertion sort for small or nearly sorted arrays; radix sort for integer keys with few digits. Best for memory: heap sort — O(1) extra space with a guaranteed O(n log n).</p>`,
        `<p class="y-chinh">🎯 Cả bộ slide trong một câu: ba thuật toán cơ bản O(n²), ba thuật toán hiệu quả O(n log n) với những đánh đổi khác nhau, một thuật toán không cần so sánh, và các hàm sắp xếp của thư viện dùng cho code thật.</p>
<table>
<thead><tr><th>Thuật toán</th><th>Tốt nhất</th><th>Trung bình</th><th>Xấu nhất</th><th>Bộ nhớ thêm</th><th>Ổn định</th><th>Slide</th></tr></thead>
<tbody>
<tr><td>Chọn (selection)</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>không</td><td>4–6</td></tr>
<tr><td>Chèn (insertion)</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>có</td><td>7–9</td></tr>
<tr><td>Nổi bọt có cờ (bubble)</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>có</td><td>10</td></tr>
<tr><td>Nhanh (quick)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) ngăn xếp</td><td>không</td><td>12–30</td></tr>
<tr><td>Trộn (merge)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>có, với <code>&lt;=</code></td><td>31–33</td></tr>
<tr><td>Vun đống (heap)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>không</td><td>34–37</td></tr>
<tr><td>Cơ số (radix) LSD, d chữ số</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(n + b)</td><td>có</td><td>38–39</td></tr>
</tbody>
</table>
<p>Cùng 1000 số đưa cho sáu thuật toán sắp xếp bằng so sánh của bộ slide, đúng bản trên slide, đếm số phép so sánh:</p>
<pre><code class="language-java">import java.util.Random;

public class SortCompare {
    static long c;                                       // số lần so sánh hai phần tử
    static boolean lt(int x, int y) { c++; return x &lt; y; }
    static void sw(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }

    static void selection(int[] a) {                     // slide 6
        for (int i = 0; i &lt; a.length - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; a.length; j++) if (lt(a[j], a[k])) k = j;
            if (k != i) sw(a, i, k);
        }
    }
    static void insertion(int[] a) {                     // slide 9
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0 &amp;&amp; lt(x, a[j - 1])) { a[j] = a[j - 1]; j--; }
            a[j] = x;
        }
    }
    static void bubble(int[] a) {                        // slide 10
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i &lt; a.length - 1; i++) if (lt(a[i + 1], a[i])) { sw(a, i, i + 1); swapped = true; }
        } while (swapped);
    }
    static void quick(int[] a, int p, int r) {           // slide 15 (chốt = phần tử đầu)
        if (p &gt;= r) return;
        int pivot = a[p], i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; !lt(pivot, a[i])) i++;
            while (lt(pivot, a[j])) j--;
            if (i &gt;= j) break;
            sw(a, i, j);
        }
        sw(a, p, j);
        quick(a, p, j - 1);
        quick(a, j + 1, r);
    }
    static void merge(int[] a, int p, int r) {           // slide 33, dùng &lt;=
        if (p &gt;= r) return;
        int q = (p + r) / 2, i = p, j = q + 1, k = 0;
        merge(a, p, q); merge(a, q + 1, r);
        int[] b = new int[r - p + 1];
        while (i &lt;= q &amp;&amp; j &lt;= r) b[k++] = lt(a[j], a[i]) ? a[j++] : a[i++];
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
    }
    static void heap(int[] a) {                          // slide 37
        int n = a.length, i, s, f, x;
        for (i = 1; i &lt; n; i++) {
            x = a[i]; s = i;
            while (s &gt; 0 &amp;&amp; lt(a[(s - 1) / 2], x)) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
        }
        for (i = n - 1; i &gt; 0; i--) {
            x = a[i]; a[i] = a[0]; f = 0; s = 1;
            if (s + 1 &lt; i &amp;&amp; lt(a[s], a[s + 1])) s++;
            while (s &lt; i &amp;&amp; lt(x, a[s])) {
                a[f] = a[s]; f = s; s = 2 * f + 1;
                if (s + 1 &lt; i &amp;&amp; lt(a[s], a[s + 1])) s++;
            }
            a[f] = x;
        }
    }

    static long count(int alg, int[] data) {
        int[] a = data.clone();
        c = 0;
        if (alg == 0) selection(a); else if (alg == 1) insertion(a); else if (alg == 2) bubble(a);
        else if (alg == 3) quick(a, 0, a.length - 1); else if (alg == 4) merge(a, 0, a.length - 1); else heap(a);
        for (int i = 1; i &lt; a.length; i++) if (a[i - 1] &gt; a[i]) throw new RuntimeException("not sorted");
        return c;
    }

    public static void main(String[] args) {
        int n = 1000;
        int[] rnd = new int[n], up = new int[n], down = new int[n];
        for (int i = 0; i &lt; n; i++) { rnd[i] = up[i] = i + 1; down[i] = n - i; }
        Random mix = new Random(2024);                   // hạt giống cố định
        for (int i = n - 1; i &gt; 0; i--) { int k = mix.nextInt(i + 1); sw(rnd, i, k); }
        String[] names = {"selection", "insertion", "bubble", "quick", "merge", "heap"};
        System.out.printf("n = %d     %9s %9s %9s%n", n, "random", "sorted", "reversed");
        for (int alg = 0; alg &lt; 6; alg++)
            System.out.printf("%-12s %9d %9d %9d%n", names[alg], count(alg, rnd), count(alg, up), count(alg, down));
    }
}</code></pre>
<div class="out">n = 1000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;random &nbsp;&nbsp;&nbsp;sorted &nbsp;reversed<br>
selection &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;499500 &nbsp;&nbsp;&nbsp;499500<br>
insertion &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;247752 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;999 &nbsp;&nbsp;&nbsp;499500<br>
bubble &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;973026 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;999 &nbsp;&nbsp;&nbsp;999000<br>
quick &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;15506 &nbsp;&nbsp;&nbsp;501498 &nbsp;&nbsp;&nbsp;500998<br>
merge &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8707 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5044 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4932<br>
heap &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17269 &nbsp;&nbsp;&nbsp;&nbsp;22462 &nbsp;&nbsp;&nbsp;&nbsp;15965</div>
<ul>
<li>Với dữ liệu ngẫu nhiên, nhóm O(n²) cần từ 250 nghìn tới 1 triệu phép so sánh, nhóm O(n log n) chỉ 9 tới 17 nghìn.</li>
<li>Insertion và bubble sort chỉ toả sáng với dữ liệu đã sắp (999); quicksort với chốt là phần tử đầu lại sụp đổ đúng ở đó.</li>
<li>Merge sort so sánh ít nhất với dữ liệu ngẫu nhiên và dữ liệu sắp ngược (với dữ liệu đã sắp chỉ insertion và bubble sort thắng nó), nhưng cần O(n) bộ nhớ; heap sort giữ tốc độ đều với O(1) bộ nhớ.</li>
</ul>
<p class="dap-an">✅ <strong>Câu hỏi CQ16.2 / CQ16.3 của syllabus — nhanh nhất? tốt nhất về bộ nhớ?</strong> Không có người thắng tuyệt đối. Với dữ liệu chung trong bộ nhớ, quicksort thường nhanh nhất trong thực tế (hằng số nhỏ, quét tuần tự) — <code>Arrays.sort</code> của Java cho kiểu nguyên thuỷ là một biến thể quicksort; merge sort khi cần ổn định (stable) hoặc cần bảo đảm O(n log n); insertion sort cho mảng nhỏ hoặc gần như đã sắp; radix sort cho khoá số nguyên ít chữ số. Tốt nhất về bộ nhớ: heap sort — bộ nhớ thêm O(1) mà vẫn bảo đảm O(n log n).</p>`],
      [43, 'Reading at home',
        `<p class="y-chinh">🎯 Goodrich 6e covers every algorithm of the deck, in a different order: chapter 12 (Sorting and Selection, p.531) for merge, quick and radix sort, chapter 9 (priority queues) for selection, insertion and heap sort.</p>
<ul>
<li><strong>§9.4.1 Selection-Sort and Insertion-Sort (p.386)</strong> — both seen as sorting with a priority queue: an unsorted list gives selection sort, a sorted list gives insertion sort.</li>
<li><strong>Bubble sort</strong> — the slide points to Exercise C-7.51.</li>
<li><strong>§12.2 Quick-Sort (p.544)</strong> and <strong>§12.1 Merge-Sort (p.532)</strong> — the divide-and-conquer pair.</li>
<li><strong>§9.4.2 Heap-Sort (p.388)</strong> — heap sort as a priority-queue sort done in place.</li>
<li><strong>§12.3.2 Linear-Time Sorting: Bucket-Sort and Radix-Sort (p.558)</strong> and <strong>§12.4 Comparing Sorting Algorithms (p.561)</strong> — the final comparison, like slide 42.</li>
</ul>
<p>The book's code is generic and uses comparators, and its in-place quick-sort differs in details (pivot choice, shape of the scans) from the version in these lessons — the idea, partition then recurse, is the same.</p>`,
        `<p class="y-chinh">🎯 Sách Goodrich bản 6 có đủ mọi thuật toán của bộ slide, theo thứ tự khác: chương 12 (Sorting and Selection, tr.531) cho sắp xếp trộn (merge), nhanh (quick) và theo cơ số (radix), chương 9 (hàng đợi ưu tiên — priority queue) cho sắp xếp chọn (selection), chèn (insertion) và vun đống (heap sort).</p>
<ul>
<li><strong>§9.4.1 Selection-Sort and Insertion-Sort (tr.386)</strong> — cả hai được nhìn như sắp xếp bằng hàng đợi ưu tiên: danh sách chưa sắp cho ra selection sort, danh sách đã sắp cho ra insertion sort.</li>
<li><strong>Bubble sort (sắp xếp nổi bọt)</strong> — slide chỉ tới bài tập C-7.51.</li>
<li><strong>§12.2 Quick-Sort (tr.544)</strong> và <strong>§12.1 Merge-Sort (tr.532)</strong> — cặp thuật toán chia để trị (divide and conquer).</li>
<li><strong>§9.4.2 Heap-Sort (tr.388)</strong> — heap sort như một cách sắp bằng hàng đợi ưu tiên làm ngay tại chỗ (in-place).</li>
<li><strong>§12.3.2 Linear-Time Sorting: Bucket-Sort and Radix-Sort (tr.558)</strong> và <strong>§12.4 Comparing Sorting Algorithms (tr.561)</strong> — phần so sánh tổng kết, giống slide 42.</li>
</ul>
<p>Code trong sách dùng kiểu tổng quát (generic) và bộ so sánh (comparator), và bản quick-sort tại chỗ của sách khác chi tiết (cách chọn chốt, dạng các vòng quét) so với bản trong các bài này — ý tưởng phân hoạch rồi đệ quy thì y hệt.</p>`],
    ]),
    bi(`<h3>✅ Check yourself in 60 seconds</h3>
<ol>
<li>After the first partition of the lesson's example [50 30 80 90 10 70 100 60 40 20], what is the array, and which element is final?</li>
<li>What does <code>!(p&lt;=q) &amp;&amp; (q&lt;=r)</code> mean in Java?</li>
<li>Why does the merge of slide 33 make merge sort unstable, and which one-character change fixes it?</li>
<li>In radix sort, which digit is used first, and why must each sublist be first-in-first-out?</li>
<li>Syllabus CQ16.1: how does merge sort differ from quicksort?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) <code>10 30 20 40 50 70 100 60 90 80</code>; only 50 is final. (2) <code>(p &gt; q) &amp;&amp; (q &lt;= r)</code> — <code>!</code> covers only <code>(p&lt;=q)</code>. (3) <code>if(a[i]&lt;a[j])</code> copies the right element when the two are equal; <code>&lt;=</code> makes the left one win ties. (4) the one's digit (least significant) first; each pass must keep the order left by the previous passes, otherwise their work is lost. (5) Quicksort does the work while dividing (partition) and needs no combine step, is in place but O(n²) in the worst case and not stable; merge sort divides blindly, does the work while combining (merge), is O(n log n) in every case and stable, but needs O(n) extra memory.</p>
<p><strong>Next:</strong> the deep-dive lessons below — 6.3 (quick-sort: partitioning in detail), 6.4 (merge-sort &amp; stability), 6.5 (heap-sort), 6.6 (linear-time sorting: bucket &amp; radix), 6.7 (choosing a sort: the full comparison) — then lesson 6.8 (practice, glossary, summary) and the chapter 6 quiz.</p>`,
    `<h3>✅ Tự kiểm tra trong 60 giây</h3>
<ol>
<li>Sau lần phân hoạch (partition) đầu tiên của ví dụ của bài [50 30 80 90 10 70 100 60 40 20], mảng là gì, và phần tử nào đã ở chỗ cuối cùng?</li>
<li>Trong Java, <code>!(p&lt;=q) &amp;&amp; (q&lt;=r)</code> nghĩa là gì?</li>
<li>Vì sao phép trộn ở slide 33 làm sắp xếp trộn (merge sort) mất ổn định (stable), và đổi một ký tự nào để sửa?</li>
<li>Trong sắp xếp theo cơ số (radix sort), chữ số nào được dùng trước, và vì sao mỗi danh sách con (sublist) phải vào trước ra trước (FIFO)?</li>
<li>CQ16.1 của syllabus: merge sort khác sắp xếp nhanh (quicksort) thế nào?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) <code>10 30 20 40 50 70 100 60 90 80</code>; chỉ 50 đã ở chỗ cuối cùng. (2) <code>(p &gt; q) &amp;&amp; (q &lt;= r)</code> — <code>!</code> chỉ phủ <code>(p&lt;=q)</code>. (3) <code>if(a[i]&lt;a[j])</code> chép phần tử bên phải khi hai giá trị bằng nhau; <code>&lt;=</code> cho phần tử bên trái thắng khi hoà. (4) hàng đơn vị (chữ số thấp nhất) trước; mỗi lượt phải giữ thứ tự mà các lượt trước để lại, nếu không công sức của chúng mất hết. (5) Quicksort làm việc khi chia (phân hoạch) và không cần bước ghép, sắp tại chỗ (in-place) nhưng xấu nhất O(n²) và không ổn định; merge sort chia "mù", làm việc khi ghép (trộn — merge), luôn O(n log n) và ổn định, nhưng cần O(n) bộ nhớ thêm.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu bên dưới — 6.3 (quick-sort: phân hoạch chi tiết), 6.4 (merge-sort &amp; tính ổn định), 6.5 (heap-sort), 6.6 (sắp xếp tuyến tính: bucket &amp; radix), 6.7 (chọn thuật toán sắp xếp: bảng so sánh đầy đủ) — rồi bài 6.8 (thực hành, thuật ngữ, tóm tắt) và quiz chương 6.</p>`),
    books([
      ['goodrich', 'Ch.12 Sorting and Selection p.531 — §12.1 Merge-Sort p.532 · §12.2 Quick-Sort p.544 · §12.3.2 Linear-Time Sorting: Bucket-Sort and Radix-Sort p.558 · §12.4 Comparing Sorting Algorithms p.561; §9.4.2 Heap-Sort p.388', 'Chương 12 Sorting and Selection tr.531 — §12.1 Merge-Sort tr.532 · §12.2 Quick-Sort tr.544 · §12.3.2 Linear-Time Sorting: Bucket-Sort and Radix-Sort tr.558 · §12.4 Comparing Sorting Algorithms tr.561; §9.4.2 Heap-Sort tr.388'],
    ]),
  ].join('\n'),
};

/* ───────── 6.8 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Sorting ───────── */
const L_on_ch6 = {
  title: '6.8 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Sorting|||6.8 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Sắp xếp',
  slug: 'csd201-on-ch6',
  type: 'VIDEO',
  description: '8 bài tập kiểu đề PE về sắp xếp (sắp danh sách liên kết Car theo hai khoá, lần theo từng lượt insertion/selection, bubble sort đếm lượt–đổi chỗ–so sánh, quicksort đếm số lần đổi chỗ, merge sort ổn định theo hai khoá, top-k bằng heap sort dừng sớm, radix sort cho số mọi độ dài, sắp một đoạn danh sách rồi xoá giá trùng) có lời giải và test tự kiểm chạy thật; 22 thuật ngữ Anh–Việt; tóm tắt 8 ý và bảng độ phức tạp của chương 6.',
  content: [
    bi(`<span class="eyebrow">Chapter 6 · Lesson 6.8 · Practice &amp; review</span>
<h2>Sorting — practise like the PE, then review</h2>
<p class="lead">Eight exercises in the shape of the practical exam and of the FE trace questions — from sorting a linked list of cars to a question close to a real PE — each with a solution that tests itself. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the method yourself in Eclipse.</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it.</li>
</ol>
<p>In a CSD201 PE the skeleton — the data class (<code>Car</code>, <code>Student</code>…), the <code>Node</code> and list classes, a <code>main</code> with a menu and code that writes each answer to a file — is usually given, and you fill in the bodies of <code>f1</code>, <code>f2</code>, … A sorting task typically appears there as "sort the list by price" on a linked list of objects. Here every answer is printed on the screen instead of written to a file. The algorithms are the ones of lessons 6.A–6.B, in the slides' versions.</p></div>`,
    `<span class="eyebrow">Chương 6 · Bài 6.8 · Thực hành &amp; ôn tập</span>
<h2>Sắp xếp — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Tám bài tập theo dạng đề thi thực hành (PE) và dạng câu lần theo (trace) của đề FE — từ sắp một danh sách liên kết các xe tới một bài gần với đề PE thật — bài nào cũng có lời giải tự kiểm tra được. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp để ôn trước FE.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết hàm trong Eclipse.</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Đề PE môn CSD201 thường cho sẵn bộ khung — lớp dữ liệu (<code>Car</code>, <code>Student</code>…), lớp <code>Node</code> và lớp danh sách, hàm <code>main</code> có menu và đoạn code ghi từng đáp án ra file — còn bạn viết thân các hàm <code>f1</code>, <code>f2</code>, … Việc sắp xếp thường xuất hiện ở đó dưới dạng "sắp danh sách theo giá" trên một danh sách liên kết các đối tượng. Ở đây mọi kết quả được in ra màn hình thay vì ghi ra file. Các thuật toán là những thuật toán của bài 6.A–6.B, đúng bản trên slide.</p></div>`),
    bi(`<h3>🧪 Exercise 1 — f1: sort a linked list of cars by price, then by owner (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>A singly linked list holds <code>Car(owner, price)</code>. Write <code>sortByPriceThenOwner()</code>: ascending by price; cars with the same price in alphabetical order of owner. <code>head</code> and <code>tail</code> must stay correct; an empty list must not crash.</p>
<p class="nhan">Data → expected result</p>
<p>(Lan,30) (An,20) (Minh,30) (Binh,20) (Chi,10) → <strong>expected:</strong> (Chi,10) (An,20) (Binh,20) (Lan,30) (Minh,30).</p>
<p class="nhan">Idea</p>
<p>selection sort on the nodes (slide 6), with one helper <code>before(x, y)</code> that compares the price first and the owner only on a tie. Swap the <em>data</em> (<code>info</code>) of two nodes, not the nodes: every link stays in place, so <code>head</code> and <code>tail</code> are valid for free. O(n²) comparisons.</p>
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

    // must x come before y? price first, then owner in ABC order
    static boolean before(Car x, Car y) {
        if (x.price != y.price) return x.price &lt; y.price;
        return x.owner.compareTo(y.owner) &lt; 0;
    }

    // f1: selection sort on the nodes, swapping the data
    void sortByPriceThenOwner() {
        for (Node p = head; p != null; p = p.next) {
            Node min = p;
            for (Node q = p.next; q != null; q = q.next)
                if (before(q.info, min.info)) min = q;
            if (min != p) { Car t = p.info; p.info = min.info; min.info = t; }
        }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe1SortCarsTwoKeys {
    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String... cars) {                 // "Lan 30" -&gt; Car(Lan, 30)
        MyList t = new MyList();
        for (String c : cars) { String[] w = c.split(" "); t.addLast(w[0], Integer.parseInt(w[1])); }
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("Lan 30", "An 20", "Minh 30", "Binh 20", "Chi 10");
        t.sortByPriceThenOwner();
        check("price, then owner", t.traverse(), "(Chi,10) (An,20) (Binh,20) (Lan,30) (Minh,30)");
        check("tail is the last car after sorting", t.tail.info.toString(), "(Minh,30)");
        t = make("Zed 5", "Yen 5", "Xuan 5");
        t.sortByPriceThenOwner();
        check("all prices equal -&gt; ABC order", t.traverse(), "(Xuan,5) (Yen,5) (Zed,5)");
        t = make();
        t.sortByPriceThenOwner();
        check("empty list, no crash", t.traverse(), "");
        t = make("A 1");
        t.sortByPriceThenOwner();
        check("one car", t.traverse(), "(A,1)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS price, then owner<br>
PASS tail is the last car after sorting<br>
PASS all prices equal -&gt; ABC order<br>
PASS empty list, no crash<br>
PASS one car<br>
ALL TESTS PASSED</div>
<div class="pitfall">Strings are compared with <code>compareTo</code>, never with <code>&lt;</code> (does not compile) or <code>==</code> (compares references). And without the tie-break, the order of equal prices depends on the algorithm — selection sort is not stable, so the third test would fail.</div>`,
    `<h3>🧪 Bài 1 — f1: sắp danh sách liên kết các xe theo giá, rồi theo tên chủ xe (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Một danh sách liên kết đơn (singly linked list) chứa các <code>Car(owner, price)</code>. Viết <code>sortByPriceThenOwner()</code>: tăng dần theo price; các xe cùng giá thì theo thứ tự ABC của owner. <code>head</code> và <code>tail</code> phải luôn đúng; danh sách rỗng không được làm chương trình văng lỗi.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>(Lan,30) (An,20) (Minh,30) (Binh,20) (Chi,10) → <strong>kết quả mong đợi:</strong> (Chi,10) (An,20) (Binh,20) (Lan,30) (Minh,30).</p>
<p class="nhan">Ý tưởng</p>
<p>sắp xếp chọn (selection sort) trên các nút (slide 6), với một hàm phụ <code>before(x, y)</code> so price trước, chỉ khi bằng giá mới so owner. Đổi chỗ <em>dữ liệu</em> (<code>info</code>) của hai nút chứ không đổi nút: mọi liên kết giữ nguyên, nên <code>head</code> và <code>tail</code> tự đúng. O(n²) phép so sánh.</p>
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

    // x có phải đứng trước y? xét price trước, rồi owner theo ABC
    static boolean before(Car x, Car y) {
        if (x.price != y.price) return x.price &lt; y.price;
        return x.owner.compareTo(y.owner) &lt; 0;
    }

    // f1: selection sort trên các nút, đổi chỗ dữ liệu
    void sortByPriceThenOwner() {
        for (Node p = head; p != null; p = p.next) {
            Node min = p;
            for (Node q = p.next; q != null; q = q.next)
                if (before(q.info, min.info)) min = q;
            if (min != p) { Car t = p.info; p.info = min.info; min.info = t; }
        }
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe1SortCarsTwoKeys {
    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make(String... cars) {                 // "Lan 30" -&gt; Car(Lan, 30)
        MyList t = new MyList();
        for (String c : cars) { String[] w = c.split(" "); t.addLast(w[0], Integer.parseInt(w[1])); }
        return t;
    }

    public static void main(String[] args) {
        MyList t = make("Lan 30", "An 20", "Minh 30", "Binh 20", "Chi 10");
        t.sortByPriceThenOwner();
        check("price, then owner", t.traverse(), "(Chi,10) (An,20) (Binh,20) (Lan,30) (Minh,30)");
        check("tail is the last car after sorting", t.tail.info.toString(), "(Minh,30)");
        t = make("Zed 5", "Yen 5", "Xuan 5");
        t.sortByPriceThenOwner();
        check("all prices equal -&gt; ABC order", t.traverse(), "(Xuan,5) (Yen,5) (Zed,5)");
        t = make();
        t.sortByPriceThenOwner();
        check("empty list, no crash", t.traverse(), "");
        t = make("A 1");
        t.sortByPriceThenOwner();
        check("one car", t.traverse(), "(A,1)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS price, then owner<br>
PASS tail is the last car after sorting<br>
PASS all prices equal -&gt; ABC order<br>
PASS empty list, no crash<br>
PASS one car<br>
ALL TESTS PASSED</div>
<div class="pitfall">Chuỗi (String) phải so bằng <code>compareTo</code>, không bao giờ dùng <code>&lt;</code> (không biên dịch được) hay <code>==</code> (so địa chỉ tham chiếu). Và nếu thiếu phần so owner khi bằng giá, thứ tự các xe cùng giá phụ thuộc vào thuật toán — selection sort không ổn định (stable), nên test thứ ba sẽ hỏng.</div>`),
    bi(`<h3>🧪 Exercise 2 — the array after each pass: insertion vs selection sort (FE trace · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>insertionTrace(a)</code> and <code>selectionTrace(a)</code>: each returns one line per pass — the array right after that pass — so that you can answer "the array after the k-th pass is…" without guessing.</p>
<p class="nhan">Data → expected result</p>
<p>[5 2 3 8 1], after pass 2 → <strong>insertion:</strong> 2 3 5 8 1 · <strong>selection:</strong> 1 2 3 8 5.</p>
<p class="nhan">Idea</p>
<p>the loops of slides 6 and 9 with one <code>out.add(show(a))</code> at the end of each outer iteration. Insertion keeps the front <em>sorted</em>; selection keeps the front <em>final</em> — hence the two different answers.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class Pe2PassTrace {
    static String show(int[] a) {
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim();
    }

    // one line per pass: the array right after inserting a[i]
    static List&lt;String&gt; insertionTrace(int[] a) {
        List&lt;String&gt; out = new ArrayList&lt;String&gt;();
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0 &amp;&amp; x &lt; a[j - 1]) { a[j] = a[j - 1]; j--; }
            a[j] = x;
            out.add(show(a));
        }
        return out;
    }

    // one line per pass: the array right after the swap of pass i
    static List&lt;String&gt; selectionTrace(int[] a) {
        List&lt;String&gt; out = new ArrayList&lt;String&gt;();
        for (int i = 0; i &lt; a.length - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; a.length; j++) if (a[j] &lt; a[k]) k = j;
            if (k != i) { int t = a[i]; a[i] = a[k]; a[k] = t; }
            out.add(show(a));
        }
        return out;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        List&lt;String&gt; ins = insertionTrace(new int[] {5, 2, 3, 8, 1});
        List&lt;String&gt; sel = selectionTrace(new int[] {5, 2, 3, 8, 1});
        check("insertion, whole trace", ins.toString(), "[2 5 3 8 1, 2 3 5 8 1, 2 3 5 8 1, 1 2 3 5 8]");
        check("selection, whole trace", sel.toString(), "[1 2 3 8 5, 1 2 3 8 5, 1 2 3 8 5, 1 2 3 5 8]");
        check("after pass 2: insertion", ins.get(1), "2 3 5 8 1");
        check("after pass 2: selection", sel.get(1), "1 2 3 8 5");
        check("n-1 lines for n elements", String.valueOf(ins.size()), "4");
        check("insertion on reversed 4 3 2 1, pass 2", insertionTrace(new int[] {4, 3, 2, 1}).get(1), "2 3 4 1");
        check("selection on reversed 4 3 2 1, pass 1", selectionTrace(new int[] {4, 3, 2, 1}).get(0), "1 3 2 4");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS insertion, whole trace<br>
PASS selection, whole trace<br>
PASS after pass 2: insertion<br>
PASS after pass 2: selection<br>
PASS n-1 lines for n elements<br>
PASS insertion on reversed 4 3 2 1, pass 2<br>
PASS selection on reversed 4 3 2 1, pass 1<br>
ALL TESTS PASSED</div>
<div class="pitfall">Record the state at the end of the pass, after <code>a[j]=x</code>. In the middle of the shifts the array holds a duplicate — right after the first shift of pass 1 it reads 5 5 3 8 1 — and copying that into an FE answer loses the mark.</div>`,
    `<h3>🧪 Bài 2 — mảng sau từng lượt: sắp xếp chèn và sắp xếp chọn (lần theo kiểu FE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>insertionTrace(a)</code> và <code>selectionTrace(a)</code>: mỗi hàm trả về mỗi lượt (pass) một dòng — mảng ngay sau lượt đó — để trả lời câu "mảng sau lượt thứ k là…" mà không phải đoán.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>[5 2 3 8 1], sau lượt 2 → <strong>sắp xếp chèn (insertion):</strong> 2 3 5 8 1 · <strong>sắp xếp chọn (selection):</strong> 1 2 3 8 5.</p>
<p class="nhan">Ý tưởng</p>
<p>dùng đúng vòng lặp của slide 6 và 9, thêm một lệnh <code>out.add(show(a))</code> ở cuối mỗi vòng ngoài. Insertion giữ phần đầu <em>có thứ tự</em>; selection giữ phần đầu <em>ở đúng chỗ cuối cùng</em> — vì thế hai đáp án khác nhau.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class Pe2PassTrace {
    static String show(int[] a) {
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim();
    }

    // mỗi lượt một dòng: mảng ngay sau khi chèn a[i]
    static List&lt;String&gt; insertionTrace(int[] a) {
        List&lt;String&gt; out = new ArrayList&lt;String&gt;();
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0 &amp;&amp; x &lt; a[j - 1]) { a[j] = a[j - 1]; j--; }
            a[j] = x;
            out.add(show(a));
        }
        return out;
    }

    // mỗi lượt một dòng: mảng ngay sau lần đổi chỗ của lượt i
    static List&lt;String&gt; selectionTrace(int[] a) {
        List&lt;String&gt; out = new ArrayList&lt;String&gt;();
        for (int i = 0; i &lt; a.length - 1; i++) {
            int k = i;
            for (int j = i + 1; j &lt; a.length; j++) if (a[j] &lt; a[k]) k = j;
            if (k != i) { int t = a[i]; a[i] = a[k]; a[k] = t; }
            out.add(show(a));
        }
        return out;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        List&lt;String&gt; ins = insertionTrace(new int[] {5, 2, 3, 8, 1});
        List&lt;String&gt; sel = selectionTrace(new int[] {5, 2, 3, 8, 1});
        check("insertion, whole trace", ins.toString(), "[2 5 3 8 1, 2 3 5 8 1, 2 3 5 8 1, 1 2 3 5 8]");
        check("selection, whole trace", sel.toString(), "[1 2 3 8 5, 1 2 3 8 5, 1 2 3 8 5, 1 2 3 5 8]");
        check("after pass 2: insertion", ins.get(1), "2 3 5 8 1");
        check("after pass 2: selection", sel.get(1), "1 2 3 8 5");
        check("n-1 lines for n elements", String.valueOf(ins.size()), "4");
        check("insertion on reversed 4 3 2 1, pass 2", insertionTrace(new int[] {4, 3, 2, 1}).get(1), "2 3 4 1");
        check("selection on reversed 4 3 2 1, pass 1", selectionTrace(new int[] {4, 3, 2, 1}).get(0), "1 3 2 4");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS insertion, whole trace<br>
PASS selection, whole trace<br>
PASS after pass 2: insertion<br>
PASS after pass 2: selection<br>
PASS n-1 lines for n elements<br>
PASS insertion on reversed 4 3 2 1, pass 2<br>
PASS selection on reversed 4 3 2 1, pass 1<br>
ALL TESTS PASSED</div>
<div class="pitfall">Ghi trạng thái ở cuối lượt, sau <code>a[j]=x</code>. Giữa các lần dời (shift) mảng có một giá trị bị lặp — ngay sau lần dời đầu tiên của lượt 1 nó là 5 5 3 8 1 — chép trạng thái đó vào bài FE là mất điểm.</div>`),
    bi(`<h3>🧪 Exercise 3 — bubble sort with the flag: count passes, swaps and comparisons (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>bubble(a)</code> — the version of slide 10 with <code>do … while(swapped)</code> — returning {passes, swaps, comparisons}; then count the comparisons of insertion sort (slide 9) on the same data and compare.</p>
<p class="nhan">Data → expected result</p>
<p>[5 2 3 8 1] → 5 passes, 6 swaps, 20 comparisons; sorted input → 1 pass, 0 swaps, n−1 comparisons; insertion sort on [5 2 3 8 1] → only 8 comparisons.</p>
<p class="nhan">Idea</p>
<p>count a comparison at every test <code>a[i] &gt; a[i+1]</code>, a swap only inside the <code>if</code>, a pass after each run of the <code>for</code>. Every swap fixes exactly one inversion, so the number of swaps equals the number of inversions (6 for this array) — for insertion sort, the number of shifts is that same 6.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">public class Pe3BubbleCount {
    // bubble sort with the flag of slide 10; returns {passes, swaps, comparisons}
    static int[] bubble(int[] a) {
        int passes = 0, swaps = 0, comps = 0;
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i &lt; a.length - 1; i++) {
                comps++;
                if (a[i] &gt; a[i + 1]) {
                    int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                    swaps++;
                    swapped = true;
                }
            }
            passes++;
        } while (swapped);
        return new int[] {passes, swaps, comps};
    }

    // comparisons made by the insertion sort of slide 9 on the same data
    static int insertionComparisons(int[] a) {
        int comps = 0;
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0) {
                comps++;
                if (!(x &lt; a[j - 1])) break;
                a[j] = a[j - 1]; j--;
            }
            a[j] = x;
        }
        return comps;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }
    static String s(int[] r) { return r[0] + " passes, " + r[1] + " swaps, " + r[2] + " comparisons"; }

    public static void main(String[] args) {
        check("slide array 5 2 3 8 1", s(bubble(new int[] {5, 2, 3, 8, 1})), "5 passes, 6 swaps, 20 comparisons");
        check("sorted input: one pass, O(n)", s(bubble(new int[] {1, 2, 3, 4, 5})), "1 passes, 0 swaps, 4 comparisons");
        check("reversed input: worst case", s(bubble(new int[] {5, 4, 3, 2, 1})), "5 passes, 10 swaps, 20 comparisons");
        check("swaps = inversions of 5 2 3 8 1", String.valueOf(bubble(new int[] {5, 2, 3, 8, 1})[1]), "6");
        check("insertion on 5 2 3 8 1", String.valueOf(insertionComparisons(new int[] {5, 2, 3, 8, 1})), "8");
        check("insertion on sorted input", String.valueOf(insertionComparisons(new int[] {1, 2, 3, 4, 5})), "4");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slide array 5 2 3 8 1<br>
PASS sorted input: one pass, O(n)<br>
PASS reversed input: worst case<br>
PASS swaps = inversions of 5 2 3 8 1<br>
PASS insertion on 5 2 3 8 1<br>
PASS insertion on sorted input<br>
ALL TESTS PASSED</div>
<div class="pitfall">The last pass makes no swap but is still a pass: on sorted input the flagged bubble sort makes 1 pass, not 0. And count comparisons outside the <code>if</code> — counting them inside counts swaps a second time.</div>`,
    `<h3>🧪 Bài 3 — sắp xếp nổi bọt (bubble sort) có cờ: đếm số lượt, số lần đổi chỗ và số phép so sánh (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>bubble(a)</code> — đúng bản của slide 10 với <code>do … while(swapped)</code> — trả về {số lượt, số lần đổi chỗ, số phép so sánh}; rồi đếm số phép so sánh của sắp xếp chèn (insertion sort, slide 9) trên cùng dữ liệu để so.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>[5 2 3 8 1] → 5 lượt, 6 lần đổi chỗ, 20 phép so sánh; mảng đã sắp → 1 lượt, 0 lần đổi chỗ, n−1 phép so sánh; insertion sort trên [5 2 3 8 1] → chỉ 8 phép so sánh.</p>
<p class="nhan">Ý tưởng</p>
<p>đếm một phép so sánh ở mỗi lần thử <code>a[i] &gt; a[i+1]</code>, một lần đổi chỗ (swap) chỉ bên trong <code>if</code>, một lượt sau mỗi lần chạy hết vòng <code>for</code>. Mỗi lần đổi chỗ sửa đúng một nghịch thế (inversion), nên số lần đổi chỗ bằng số nghịch thế (6 với mảng này) — với insertion sort, số lần dời (shift) cũng đúng bằng 6 đó.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">public class Pe3BubbleCount {
    // bubble sort có cờ như slide 10; trả về {số lượt, số lần đổi chỗ, số phép so sánh}
    static int[] bubble(int[] a) {
        int passes = 0, swaps = 0, comps = 0;
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i &lt; a.length - 1; i++) {
                comps++;
                if (a[i] &gt; a[i + 1]) {
                    int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                    swaps++;
                    swapped = true;
                }
            }
            passes++;
        } while (swapped);
        return new int[] {passes, swaps, comps};
    }

    // số phép so sánh của insertion sort (slide 9) trên cùng dữ liệu
    static int insertionComparisons(int[] a) {
        int comps = 0;
        for (int i = 1; i &lt; a.length; i++) {
            int x = a[i], j = i;
            while (j &gt; 0) {
                comps++;
                if (!(x &lt; a[j - 1])) break;
                a[j] = a[j - 1]; j--;
            }
            a[j] = x;
        }
        return comps;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }
    static String s(int[] r) { return r[0] + " passes, " + r[1] + " swaps, " + r[2] + " comparisons"; }

    public static void main(String[] args) {
        check("slide array 5 2 3 8 1", s(bubble(new int[] {5, 2, 3, 8, 1})), "5 passes, 6 swaps, 20 comparisons");
        check("sorted input: one pass, O(n)", s(bubble(new int[] {1, 2, 3, 4, 5})), "1 passes, 0 swaps, 4 comparisons");
        check("reversed input: worst case", s(bubble(new int[] {5, 4, 3, 2, 1})), "5 passes, 10 swaps, 20 comparisons");
        check("swaps = inversions of 5 2 3 8 1", String.valueOf(bubble(new int[] {5, 2, 3, 8, 1})[1]), "6");
        check("insertion on 5 2 3 8 1", String.valueOf(insertionComparisons(new int[] {5, 2, 3, 8, 1})), "8");
        check("insertion on sorted input", String.valueOf(insertionComparisons(new int[] {1, 2, 3, 4, 5})), "4");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slide array 5 2 3 8 1<br>
PASS sorted input: one pass, O(n)<br>
PASS reversed input: worst case<br>
PASS swaps = inversions of 5 2 3 8 1<br>
PASS insertion on 5 2 3 8 1<br>
PASS insertion on sorted input<br>
ALL TESTS PASSED</div>
<div class="pitfall">Lượt cuối không đổi chỗ lần nào nhưng vẫn là một lượt: với mảng đã sắp, bubble sort có cờ chạy 1 lượt chứ không phải 0. Và phải đếm phép so sánh ở ngoài <code>if</code> — đếm bên trong là đếm số lần đổi chỗ thêm một lần nữa.</div>`),
    bi(`<h3>🧪 Exercise 4 — quicksort that counts its exchanges (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Implement the quicksort of slide 15 (pivot = first element, i and j scanning towards each other, then the pivot swapped to j) and count the <strong>exchanges</strong>: swaps that really move two different cells. Also check the array after the first partition only.</p>
<p class="nhan">Data → expected result</p>
<p>The lesson's example [50 30 80 90 10 70 100 60 40 20] → after the first partition: 10 30 20 40 50 70 100 60 90 80 (pivot at 4); whole sort: 7 exchanges — 3 inside the loops plus 4 pivot moves.</p>
<p class="nhan">Idea</p>
<p>put the counter inside <code>swap</code>, and return early when i == j: <code>swap(a, p, j)</code> with j == p moves nothing, so it is not an exchange. Sorted input costs 0 exchanges — but still about n²/2 comparisons (slide 16).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">public class Pe4QuickSwaps {
    static int exchanges;                                // swaps that really move two cells

    static void swap(int[] a, int i, int j) {
        if (i == j) return;                              // a[p] with a[p]: nothing moves
        int t = a[i]; a[i] = a[j]; a[j] = t;
        exchanges++;
    }

    // the partition of slide 15 (pivot = a[p])
    static int partition(int[] a, int p, int r) {
        int pivot = a[p], i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;
            while (a[j] &gt; pivot) j--;
            if (i &gt;= j) break;
            swap(a, i, j);
        }
        swap(a, p, j);
        return j;
    }

    static void quickSort(int[] a, int p, int r) {
        if (p &gt;= r) return;
        int k = partition(a, p, r);
        quickSort(a, p, k - 1);
        quickSort(a, k + 1, r);
    }

    static String show(int[] a) {
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim();
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String sortAndCount(int[] a) {
        exchanges = 0;
        quickSort(a, 0, a.length - 1);
        return show(a) + " | exchanges=" + exchanges;
    }

    public static void main(String[] args) {
        int[] ex = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};  // the lesson's example
        int k = partition(ex, 0, ex.length - 1);
        check("first partition only", show(ex) + " | pivot at " + k, "10 30 20 40 50 70 100 60 90 80 | pivot at 4");
        check("lesson's example, whole sort",
              sortAndCount(new int[] {50, 30, 80, 90, 10, 70, 100, 60, 40, 20}), "10 20 30 40 50 60 70 80 90 100 | exchanges=7");
        check("sorted input: no exchange", sortAndCount(new int[] {1, 2, 3, 4, 5, 6}), "1 2 3 4 5 6 | exchanges=0");
        check("reversed input", sortAndCount(new int[] {6, 5, 4, 3, 2, 1}), "1 2 3 4 5 6 | exchanges=3");
        check("equal keys (first exchange: 4 with 4)", sortAndCount(new int[] {4, 1, 4, 2, 4}), "1 2 4 4 4 | exchanges=3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS first partition only<br>
PASS lesson's example, whole sort<br>
PASS sorted input: no exchange<br>
PASS reversed input<br>
PASS equal keys (first exchange: 4 with 4)<br>
ALL TESTS PASSED</div>
<div class="pitfall">"How many swaps?" depends on the exact code: count loop swaps only, or pivot placements too, or also the no-op swap(p, p)? Read the definition in the question. The last test shows another detail: with equal keys the very first exchange swaps a 4 with another 4 — it moves two cells yet changes nothing you can see.</div>`,
    `<h3>🧪 Bài 4 — sắp xếp nhanh (quicksort) đếm số lần đổi chỗ (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Cài quicksort của slide 15 (chốt — pivot — là phần tử đầu, i và j quét ngược chiều nhau, rồi đổi chốt về j) và đếm số <strong>lần đổi chỗ thật (exchange)</strong>: những lần đổi chỗ (swap) thực sự di chuyển hai ô khác nhau. Kiểm tra thêm mảng sau riêng lần phân hoạch (partition) đầu tiên.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Ví dụ của bài [50 30 80 90 10 70 100 60 40 20] → sau lần phân hoạch đầu: 10 30 20 40 50 70 100 60 90 80 (chốt ở chỉ số 4); cả quá trình sắp: 7 lần đổi chỗ — 3 lần trong vòng lặp cộng 4 lần đưa chốt về chỗ.</p>
<p class="nhan">Ý tưởng</p>
<p>đặt bộ đếm trong hàm <code>swap</code>, và trả về ngay khi i == j: <code>swap(a, p, j)</code> với j == p không di chuyển gì nên không tính là đổi chỗ. Mảng đã sắp tốn 0 lần đổi chỗ — nhưng vẫn tốn khoảng n²/2 phép so sánh (slide 16).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">public class Pe4QuickSwaps {
    static int exchanges;                                // số lần đổi chỗ thật sự (hai ô khác nhau)

    static void swap(int[] a, int i, int j) {
        if (i == j) return;                              // a[p] với a[p]: không có gì di chuyển
        int t = a[i]; a[i] = a[j]; a[j] = t;
        exchanges++;
    }

    // phép phân hoạch của slide 15 (chốt = a[p])
    static int partition(int[] a, int p, int r) {
        int pivot = a[p], i = p + 1, j = r;
        while (true) {
            while (i &lt;= r &amp;&amp; a[i] &lt;= pivot) i++;
            while (a[j] &gt; pivot) j--;
            if (i &gt;= j) break;
            swap(a, i, j);
        }
        swap(a, p, j);
        return j;
    }

    static void quickSort(int[] a, int p, int r) {
        if (p &gt;= r) return;
        int k = partition(a, p, r);
        quickSort(a, p, k - 1);
        quickSort(a, k + 1, r);
    }

    static String show(int[] a) {
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim();
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static String sortAndCount(int[] a) {
        exchanges = 0;
        quickSort(a, 0, a.length - 1);
        return show(a) + " | exchanges=" + exchanges;
    }

    public static void main(String[] args) {
        int[] ex = {50, 30, 80, 90, 10, 70, 100, 60, 40, 20};  // ví dụ của bài
        int k = partition(ex, 0, ex.length - 1);
        check("first partition only", show(ex) + " | pivot at " + k, "10 30 20 40 50 70 100 60 90 80 | pivot at 4");
        check("lesson's example, whole sort",
              sortAndCount(new int[] {50, 30, 80, 90, 10, 70, 100, 60, 40, 20}), "10 20 30 40 50 60 70 80 90 100 | exchanges=7");
        check("sorted input: no exchange", sortAndCount(new int[] {1, 2, 3, 4, 5, 6}), "1 2 3 4 5 6 | exchanges=0");
        check("reversed input", sortAndCount(new int[] {6, 5, 4, 3, 2, 1}), "1 2 3 4 5 6 | exchanges=3");
        check("equal keys (first exchange: 4 with 4)", sortAndCount(new int[] {4, 1, 4, 2, 4}), "1 2 4 4 4 | exchanges=3");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS first partition only<br>
PASS lesson's example, whole sort<br>
PASS sorted input: no exchange<br>
PASS reversed input<br>
PASS equal keys (first exchange: 4 with 4)<br>
ALL TESTS PASSED</div>
<div class="pitfall">"Bao nhiêu lần đổi chỗ?" phụ thuộc chính xác vào code: chỉ đếm trong vòng lặp, hay tính cả lần đặt chốt, hay tính cả lần swap(p, p) vô ích? Đọc kỹ định nghĩa trong đề. Test cuối còn cho thấy một chi tiết: với khoá trùng nhau, lần đổi chỗ đầu tiên đổi một số 4 với một số 4 khác — di chuyển hai ô mà nhìn vào không thấy gì thay đổi.</div>`),
    bi(`<h3>🧪 Exercise 5 — rank students by two keys with a stable merge sort (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p><code>Student(name, score)</code>: produce the ranking by score descending, students with the same score in alphabetical order — using only a merge sort that compares <em>one</em> key at a time.</p>
<p class="nhan">Data → expected result</p>
<p>Minh9 An7 Lan9 Binh8 Chi7 → <strong>expected:</strong> Lan9 Minh9 Binh8 An7 Chi7.</p>
<p class="nhan">Idea</p>
<p>sort by the <strong>minor</strong> key first (name), then <strong>stably</strong> by the major key (score). A stable second pass keeps the name order among equal scores. Merge sort is stable when the merge takes the left element on ties (<code>&lt;=</code>, slide 33).</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;
import java.util.Comparator;

class Student {
    String name; int score;
    Student(String name, int score) { this.name = name; this.score = score; }
    public String toString() { return name + score; }
}

public class Pe5MergeTwoKeys {
    // merge sort of slide 33 on objects; orEqual = true takes the LEFT element on ties (stable)
    static void mergeSort(Student[] a, int p, int r, Comparator&lt;Student&gt; c, boolean orEqual) {
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(a, p, q, c, orEqual);
        mergeSort(a, q + 1, r, c, orEqual);
        Student[] b = new Student[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) {
            int d = c.compare(a[i], a[j]);
            if (d &lt; 0 || (orEqual &amp;&amp; d == 0)) b[k++] = a[i++]; else b[k++] = a[j++];
        }
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
    }

    static final Comparator&lt;Student&gt; BY_NAME = new Comparator&lt;Student&gt;() {
        public int compare(Student x, Student y) { return x.name.compareTo(y.name); }
    };
    static final Comparator&lt;Student&gt; BY_SCORE_DESC = new Comparator&lt;Student&gt;() {
        public int compare(Student x, Student y) { return Integer.compare(y.score, x.score); }   // higher score first
    };

    // score descending, equal scores by name: sort by the minor key, then STABLY by the major key
    static String rank(boolean stable) {
        Student[] a = {new Student("Minh", 9), new Student("An", 7), new Student("Lan", 9), new Student("Binh", 8), new Student("Chi", 7)};
        mergeSort(a, 0, a.length - 1, BY_NAME, true);
        mergeSort(a, 0, a.length - 1, BY_SCORE_DESC, stable);
        return Arrays.toString(a);
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("two keys with a stable second pass", rank(true), "[Lan9, Minh9, Binh8, An7, Chi7]");
        check("second pass with &lt; only: ties reversed", rank(false), "[Minh9, Lan9, Binh8, Chi7, An7]");
        Student[] one = {new Student("Tu", 5)};
        mergeSort(one, 0, 0, BY_NAME, true);
        check("one student", Arrays.toString(one), "[Tu5]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS two keys with a stable second pass<br>
PASS second pass with &lt; only: ties reversed<br>
PASS one student<br>
ALL TESTS PASSED</div>
<div class="pitfall">With the slide's <code>&lt;</code> in the second pass, equal scores come out in reverse name order (second test). The other correct way is one comparator with both keys (score, then name) and any sort. And write comparators with <code>Integer.compare(y, x)</code>, not <code>y - x</code>: the subtraction overflows for very large or very negative values.</div>`,
    `<h3>🧪 Bài 5 — xếp hạng sinh viên theo hai khoá bằng sắp xếp trộn (merge sort) ổn định (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p><code>Student(name, score)</code>: lập bảng xếp hạng theo điểm giảm dần, các sinh viên cùng điểm thì theo thứ tự ABC của tên — chỉ dùng một hàm sắp xếp trộn (merge sort) mỗi lần so <em>một</em> khoá.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Minh9 An7 Lan9 Binh8 Chi7 → <strong>kết quả mong đợi:</strong> Lan9 Minh9 Binh8 An7 Chi7.</p>
<p class="nhan">Ý tưởng</p>
<p>sắp theo khoá <strong>phụ</strong> trước (tên), rồi sắp <strong>ổn định (stable)</strong> theo khoá chính (điểm). Lượt sắp thứ hai ổn định sẽ giữ thứ tự tên giữa các bạn cùng điểm. Merge sort ổn định khi phép trộn lấy phần tử bên trái lúc hoà (<code>&lt;=</code>, slide 33).</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;
import java.util.Comparator;

class Student {
    String name; int score;
    Student(String name, int score) { this.name = name; this.score = score; }
    public String toString() { return name + score; }
}

public class Pe5MergeTwoKeys {
    // merge sort của slide 33 trên đối tượng; orEqual = true lấy phần tử BÊN TRÁI khi hoà (ổn định)
    static void mergeSort(Student[] a, int p, int r, Comparator&lt;Student&gt; c, boolean orEqual) {
        if (p &gt;= r) return;
        int q = (p + r) / 2;
        mergeSort(a, p, q, c, orEqual);
        mergeSort(a, q + 1, r, c, orEqual);
        Student[] b = new Student[r - p + 1];
        int i = p, j = q + 1, k = 0;
        while (i &lt;= q &amp;&amp; j &lt;= r) {
            int d = c.compare(a[i], a[j]);
            if (d &lt; 0 || (orEqual &amp;&amp; d == 0)) b[k++] = a[i++]; else b[k++] = a[j++];
        }
        while (i &lt;= q) b[k++] = a[i++];
        while (j &lt;= r) b[k++] = a[j++];
        for (k = 0; k &lt; b.length; k++) a[p + k] = b[k];
    }

    static final Comparator&lt;Student&gt; BY_NAME = new Comparator&lt;Student&gt;() {
        public int compare(Student x, Student y) { return x.name.compareTo(y.name); }
    };
    static final Comparator&lt;Student&gt; BY_SCORE_DESC = new Comparator&lt;Student&gt;() {
        public int compare(Student x, Student y) { return Integer.compare(y.score, x.score); }   // điểm cao đứng trước
    };

    // điểm giảm dần, cùng điểm thì theo tên: sắp theo khoá phụ trước, rồi sắp ỔN ĐỊNH theo khoá chính
    static String rank(boolean stable) {
        Student[] a = {new Student("Minh", 9), new Student("An", 7), new Student("Lan", 9), new Student("Binh", 8), new Student("Chi", 7)};
        mergeSort(a, 0, a.length - 1, BY_NAME, true);
        mergeSort(a, 0, a.length - 1, BY_SCORE_DESC, stable);
        return Arrays.toString(a);
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("two keys with a stable second pass", rank(true), "[Lan9, Minh9, Binh8, An7, Chi7]");
        check("second pass with &lt; only: ties reversed", rank(false), "[Minh9, Lan9, Binh8, Chi7, An7]");
        Student[] one = {new Student("Tu", 5)};
        mergeSort(one, 0, 0, BY_NAME, true);
        check("one student", Arrays.toString(one), "[Tu5]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS two keys with a stable second pass<br>
PASS second pass with &lt; only: ties reversed<br>
PASS one student<br>
ALL TESTS PASSED</div>
<div class="pitfall">Dùng <code>&lt;</code> của slide ở lượt thứ hai thì các bạn cùng điểm ra theo thứ tự tên ngược (test thứ hai). Cách đúng khác là một bộ so sánh (comparator) gồm cả hai khoá (điểm, rồi tên) cộng với bất kỳ thuật toán sắp xếp nào. Và hãy viết comparator bằng <code>Integer.compare(y, x)</code>, không phải <code>y - x</code>: phép trừ bị tràn số khi giá trị rất lớn hoặc rất âm.</div>`),
    bi(`<h3>🧪 Exercise 6 — the k most expensive cars with a partial heap sort (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>Given an array of cars, return the k most expensive, most expensive first, without changing the input array.</p>
<p class="nhan">Data → expected result</p>
<p>A30 B70 C10 D90 E50 F20 G80, k = 3 → <strong>expected:</strong> (D,90) (G,80) (B,70).</p>
<p class="nhan">Idea</p>
<p>the heap sort of slide 37 on a copy: build the max heap (step 1), then run step 2 only k times. After k removals the last k cells hold the k largest in ascending order; read them backwards. Cost O(n log n) for this heap building plus O(k log n) for the removals.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;

class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

public class Pe6TopK {
    // the heap sort of slide 37 on prices, stopped after k removals
    static Car[] topK(Car[] data, int k) {
        Car[] a = data.clone();
        int n = a.length, i, s, f;
        Car x;
        for (i = 1; i &lt; n; i++) {                        // step 1: build a max heap
            x = a[i]; s = i;
            while (s &gt; 0 &amp;&amp; x.price &gt; a[(s - 1) / 2].price) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
        }
        for (i = n - 1; i &gt; n - 1 - k; i--) {            // step 2, only k times
            x = a[i]; a[i] = a[0];
            f = 0; s = 1;
            if (s + 1 &lt; i &amp;&amp; a[s].price &lt; a[s + 1].price) s = s + 1;
            while (s &lt; i &amp;&amp; x.price &lt; a[s].price) {
                a[f] = a[s]; f = s; s = 2 * f + 1;
                if (s + 1 &lt; i &amp;&amp; a[s].price &lt; a[s + 1].price) s = s + 1;
            }
            a[f] = x;
        }
        Car[] top = new Car[k];                          // a[n-1] is the largest, a[n-2] the next...
        for (int t = 0; t &lt; k; t++) top[t] = a[n - 1 - t];
        return top;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Car[] cars = {new Car("A", 30), new Car("B", 70), new Car("C", 10), new Car("D", 90),
                      new Car("E", 50), new Car("F", 20), new Car("G", 80)};
        check("top 3, most expensive first", Arrays.toString(topK(cars, 3)), "[(D,90), (G,80), (B,70)]");
        check("k = 1 is the maximum", Arrays.toString(topK(cars, 1)), "[(D,90)]");
        check("k = n sorts everything, descending", Arrays.toString(topK(cars, 7)),
              "[(D,90), (G,80), (B,70), (E,50), (A,30), (F,20), (C,10)]");
        check("k = 0 gives nothing", Arrays.toString(topK(cars, 0)), "[]");
        check("the input array is not changed", Arrays.toString(cars).substring(0, 16), "[(A,30), (B,70),");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS top 3, most expensive first<br>
PASS k = 1 is the maximum<br>
PASS k = n sorts everything, descending<br>
PASS k = 0 gives nothing<br>
PASS the input array is not changed<br>
ALL TESTS PASSED</div>
<div class="pitfall">Off by one in the loop bound (<code>i &gt; n-1-k</code>) returns k−1 or k+1 cars — test k = 1 and k = n. Beyond the course: <code>java.util.PriorityQueue</code> used as a min heap of size k solves the same problem in O(n log k) with only O(k) memory.</div>`,
    `<h3>🧪 Bài 6 — k xe đắt nhất bằng sắp xếp vun đống (heap sort) dừng giữa chừng (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Cho một mảng các xe, trả về k xe đắt nhất, xe đắt nhất đứng đầu, không làm thay đổi mảng đầu vào.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>A30 B70 C10 D90 E50 F20 G80, k = 3 → <strong>kết quả mong đợi:</strong> (D,90) (G,80) (B,70).</p>
<p class="nhan">Ý tưởng</p>
<p>chạy heap sort của slide 37 trên một bản sao: dựng đống max (max heap) ở bước 1, rồi chỉ chạy bước 2 đúng k lần. Sau k lần lấy gốc ra, k ô cuối chứa k giá trị lớn nhất theo thứ tự tăng dần; đọc ngược lại. Chi phí O(n log n) cho cách dựng heap này cộng O(k log n) cho các lần lấy ra.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;

class Car {
    String owner; int price;
    Car(String owner, int price) { this.owner = owner; this.price = price; }
    public String toString() { return "(" + owner + "," + price + ")"; }
}

public class Pe6TopK {
    // heap sort của slide 37 theo price, dừng sau k lần lấy gốc ra
    static Car[] topK(Car[] data, int k) {
        Car[] a = data.clone();
        int n = a.length, i, s, f;
        Car x;
        for (i = 1; i &lt; n; i++) {                        // bước 1: dựng heap max
            x = a[i]; s = i;
            while (s &gt; 0 &amp;&amp; x.price &gt; a[(s - 1) / 2].price) { a[s] = a[(s - 1) / 2]; s = (s - 1) / 2; }
            a[s] = x;
        }
        for (i = n - 1; i &gt; n - 1 - k; i--) {            // bước 2, chỉ k lần
            x = a[i]; a[i] = a[0];
            f = 0; s = 1;
            if (s + 1 &lt; i &amp;&amp; a[s].price &lt; a[s + 1].price) s = s + 1;
            while (s &lt; i &amp;&amp; x.price &lt; a[s].price) {
                a[f] = a[s]; f = s; s = 2 * f + 1;
                if (s + 1 &lt; i &amp;&amp; a[s].price &lt; a[s + 1].price) s = s + 1;
            }
            a[f] = x;
        }
        Car[] top = new Car[k];                          // a[n-1] lớn nhất, a[n-2] kế tiếp...
        for (int t = 0; t &lt; k; t++) top[t] = a[n - 1 - t];
        return top;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        Car[] cars = {new Car("A", 30), new Car("B", 70), new Car("C", 10), new Car("D", 90),
                      new Car("E", 50), new Car("F", 20), new Car("G", 80)};
        check("top 3, most expensive first", Arrays.toString(topK(cars, 3)), "[(D,90), (G,80), (B,70)]");
        check("k = 1 is the maximum", Arrays.toString(topK(cars, 1)), "[(D,90)]");
        check("k = n sorts everything, descending", Arrays.toString(topK(cars, 7)),
              "[(D,90), (G,80), (B,70), (E,50), (A,30), (F,20), (C,10)]");
        check("k = 0 gives nothing", Arrays.toString(topK(cars, 0)), "[]");
        check("the input array is not changed", Arrays.toString(cars).substring(0, 16), "[(A,30), (B,70),");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS top 3, most expensive first<br>
PASS k = 1 is the maximum<br>
PASS k = n sorts everything, descending<br>
PASS k = 0 gives nothing<br>
PASS the input array is not changed<br>
ALL TESTS PASSED</div>
<div class="pitfall">Lệch một ở cận vòng lặp (<code>i &gt; n-1-k</code>) sẽ trả về k−1 hoặc k+1 xe — hãy thử k = 1 và k = n. Ngoài giáo trình: <code>java.util.PriorityQueue</code> dùng như một đống min (min heap) cỡ k giải cùng bài này trong O(n log k) với bộ nhớ chỉ O(k).</div>`),
    bi(`<h3>🧪 Exercise 7 — radix sort for non-negative numbers of any length (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write the LSD radix sort of slides 38–39 for any array of non-negative ints: numbers may have different lengths, and the number of passes must follow the data. Also report the number of passes.</p>
<p class="nhan">Data → expected result</p>
<p>170 45 75 90 802 24 2 66 → <strong>expected:</strong> 2 24 45 66 75 90 170 802, in 3 passes.</p>
<p class="nhan">Idea</p>
<p>ten sublists; in each pass append every number to sublist <code>(x / exp) % 10</code>, then gather sublists 0 → 9. Keep going while <code>max / exp &gt; 0</code> — the number of digits of the largest value — with at least one pass (an array of zeros). Short numbers simply have 0 in the missing digits.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class Pe7RadixSort {
    static int passes;

    // LSD radix sort for non-negative ints of any length
    static void radixSort(int[] a) {
        int max = 0;
        for (int x : a) max = Math.max(max, x);          // the number of digits comes from the MAX
        passes = 0;
        List&lt;List&lt;Integer&gt;&gt; bucket = new ArrayList&lt;List&lt;Integer&gt;&gt;();
        for (int d = 0; d &lt; 10; d++) bucket.add(new ArrayList&lt;Integer&gt;());
        for (long exp = 1; passes == 0 || max / exp &gt; 0; exp *= 10) {   // at least one pass
            for (List&lt;Integer&gt; b : bucket) b.clear();
            for (int x : a) bucket.get((int) (x / exp % 10)).add(x);    // append: keeps arrival order
            int k = 0;
            for (List&lt;Integer&gt; b : bucket) for (int x : b) a[k++] = x;  // gather 0 -&gt; 9
            passes++;
        }
    }

    static String sortShow(int[] a) {
        radixSort(a);
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim() + " | passes=" + passes;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("the data of slide 38", sortShow(new int[] {493, 812, 715, 340, 195, 437, 710, 582, 385}),
              "195 340 385 437 493 582 710 715 812 | passes=3");
        check("different lengths", sortShow(new int[] {170, 45, 75, 90, 802, 24, 2, 66}), "2 24 45 66 75 90 170 802 | passes=3");
        check("zeros and duplicates", sortShow(new int[] {0, 10, 0, 5, 10}), "0 0 5 10 10 | passes=2");
        check("all zeros still one pass", sortShow(new int[] {0, 0}), "0 0 | passes=1");
        check("one element", sortShow(new int[] {7}), "7 | passes=1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS the data of slide 38<br>
PASS different lengths<br>
PASS zeros and duplicates<br>
PASS all zeros still one pass<br>
PASS one element<br>
ALL TESTS PASSED</div>
<div class="pitfall">Taking the number of passes from the first element, or fixing it at 3, sorts the slide's data but fails on 802 among 2-digit numbers. Negative numbers give a negative digit and a negative sublist index — sort them separately. <code>exp</code> is a <code>long</code>, otherwise <code>exp *= 10</code> overflows once the maximum has ten digits (10⁹ or more).</div>`,
    `<h3>🧪 Bài 7 — sắp xếp theo cơ số (radix sort) cho số không âm có độ dài bất kỳ (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết radix sort LSD (least significant digit — chữ số thấp nhất làm trước) của slide 38–39 cho mảng số nguyên không âm bất kỳ: các số có thể dài ngắn khác nhau, và số lượt phải tính theo dữ liệu. In thêm số lượt đã chạy.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>170 45 75 90 802 24 2 66 → <strong>kết quả mong đợi:</strong> 2 24 45 66 75 90 170 802, trong 3 lượt.</p>
<p class="nhan">Ý tưởng</p>
<p>mười danh sách con (sublist); mỗi lượt thêm từng số vào cuối danh sách con <code>(x / exp) % 10</code>, rồi gom các danh sách con từ 0 tới 9. Lặp chừng nào <code>max / exp &gt; 0</code> — tức theo số chữ số của giá trị lớn nhất — và chạy ít nhất một lượt (trường hợp mảng toàn số 0). Số ngắn thì các chữ số còn thiếu coi như bằng 0.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.List;

public class Pe7RadixSort {
    static int passes;

    // radix sort LSD cho số nguyên không âm, độ dài bất kỳ
    static void radixSort(int[] a) {
        int max = 0;
        for (int x : a) max = Math.max(max, x);          // số chữ số lấy theo phần tử LỚN NHẤT
        passes = 0;
        List&lt;List&lt;Integer&gt;&gt; bucket = new ArrayList&lt;List&lt;Integer&gt;&gt;();
        for (int d = 0; d &lt; 10; d++) bucket.add(new ArrayList&lt;Integer&gt;());
        for (long exp = 1; passes == 0 || max / exp &gt; 0; exp *= 10) {   // ít nhất một lượt
            for (List&lt;Integer&gt; b : bucket) b.clear();
            for (int x : a) bucket.get((int) (x / exp % 10)).add(x);    // thêm vào cuối: giữ thứ tự gặp
            int k = 0;
            for (List&lt;Integer&gt; b : bucket) for (int x : b) a[k++] = x;  // gom từ 0 tới 9
            passes++;
        }
    }

    static String sortShow(int[] a) {
        radixSort(a);
        StringBuilder s = new StringBuilder();
        for (int x : a) s.append(x).append(' ');
        return s.toString().trim() + " | passes=" + passes;
    }

    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("the data of slide 38", sortShow(new int[] {493, 812, 715, 340, 195, 437, 710, 582, 385}),
              "195 340 385 437 493 582 710 715 812 | passes=3");
        check("different lengths", sortShow(new int[] {170, 45, 75, 90, 802, 24, 2, 66}), "2 24 45 66 75 90 170 802 | passes=3");
        check("zeros and duplicates", sortShow(new int[] {0, 10, 0, 5, 10}), "0 0 5 10 10 | passes=2");
        check("all zeros still one pass", sortShow(new int[] {0, 0}), "0 0 | passes=1");
        check("one element", sortShow(new int[] {7}), "7 | passes=1");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS the data of slide 38<br>
PASS different lengths<br>
PASS zeros and duplicates<br>
PASS all zeros still one pass<br>
PASS one element<br>
ALL TESTS PASSED</div>
<div class="pitfall">Lấy số lượt theo phần tử đầu tiên, hoặc cố định bằng 3, vẫn sắp đúng dữ liệu của slide nhưng hỏng khi có 802 lẫn giữa các số hai chữ số. Số âm cho ra chữ số âm và chỉ số danh sách con âm — phải tách riêng ra sắp. <code>exp</code> là <code>long</code>, nếu không <code>exp *= 10</code> sẽ tràn số khi giá trị lớn nhất có mười chữ số (từ 10⁹ trở lên).</div>`),
    bi(`<h3>🧪 Exercise 8 — f1 + f2 on a car list: sort a range, then drop repeated prices (close to a real PE · ~25 min)</h3>
<p class="nhan">Task</p>
<p>On a linked list of <code>Car(owner, price)</code> with a <code>size</code> field: <strong>f1</strong> <code>sortRange(k, h)</code> sorts only the cars at positions k…h (from 0, both included) by price, stably, leaving the other nodes where they are; clamp h to the last position and do nothing when k ≥ h. <strong>f2</strong> <code>removeSamePrice()</code>, on a list sorted by price, keeps only the first car of each price and keeps <code>tail</code> and <code>size</code> correct.</p>
<p class="nhan">Data → expected result</p>
<p>A5 B9 C2 D9 E1 F3 G7, <code>sortRange(1, 4)</code> → (A,5) (E,1) (C,2) (B,9) (D,9) (F,3) (G,7) — positions 0, 5 and 6 are untouched, and B still comes before D.</p>
<p class="nhan">Idea</p>
<p>walk to the node at position k, then run the bubble sort of slide 10 on the data of the h − k + 1 nodes from there: adjacent swaps with a strict <code>&gt;</code> are stable, and a singly linked list only lets you look forward — exactly what bubble sort needs. After sorting, equal prices are adjacent, so f2 is one pass that unlinks <code>p.next</code> while its price equals <code>p</code>'s.</p>
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
    int size;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
        size++;
    }

    // f1: sort ONLY positions k..h (from 0, inclusive) by price, stably: bubble sort on the data
    void sortRange(int k, int h) {
        if (k &lt; 0) k = 0;
        if (h &gt; size - 1) h = size - 1;
        if (k &gt;= h) return;
        Node start = head;
        for (int i = 0; i &lt; k; i++) start = start.next; // the node at position k
        boolean swapped;
        do {
            swapped = false;
            Node p = start;
            for (int i = k; i &lt; h; i++, p = p.next)
                if (p.info.price &gt; p.next.info.price) {  // strict &gt;: equal prices never swap
                    Car t = p.info; p.info = p.next.info; p.next.info = t;
                    swapped = true;
                }
        } while (swapped);
    }

    // f2: on a list sorted by price, keep only the first car of each price
    void removeSamePrice() {
        Node p = head;
        while (p != null &amp;&amp; p.next != null)
            if (p.next.info.price == p.info.price) {     // same price as the car before it: unlink
                if (p.next == tail) tail = p;
                p.next = p.next.next;
                size--;
            } else p = p.next;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe8SortRange {
    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make() {                               // A5 B9 C2 D9 E1 F3 G7
        MyList t = new MyList();
        for (String w : "A5 B9 C2 D9 E1 F3 G7".split(" ")) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make();
        t.sortRange(1, 4);
        check("sort positions 1..4 only", t.traverse(), "(A,5) (E,1) (C,2) (B,9) (D,9) (F,3) (G,7)");
        t = make();
        t.sortRange(0, 100);
        check("whole list (h clamped), stable", t.traverse(), "(E,1) (C,2) (F,3) (A,5) (G,7) (B,9) (D,9)");
        t.removeSamePrice();
        check("remove repeated prices", t.traverse(), "(E,1) (C,2) (F,3) (A,5) (G,7) (B,9)");
        check("tail and size updated", t.tail.info + " size=" + t.size, "(B,9) size=6");
        t = make();
        t.sortRange(3, 3);
        check("k == h: nothing to do", t.traverse(), "(A,5) (B,9) (C,2) (D,9) (E,1) (F,3) (G,7)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS sort positions 1..4 only<br>
PASS whole list (h clamped), stable<br>
PASS remove repeated prices<br>
PASS tail and size updated<br>
PASS k == h: nothing to do<br>
ALL TESTS PASSED</div>
<div class="pitfall">Read how the task counts positions: from 0 or from 1 changes which cars move. In f2, advance <code>p</code> only when nothing was removed — otherwise two repeats in a row (9, 9, 9) leave one behind — and when the removed node was the tail, move <code>tail</code> back to <code>p</code>.</div>`,
    `<h3>🧪 Bài 8 — f1 + f2 trên danh sách xe: sắp một đoạn, rồi bỏ các giá lặp lại (gần với đề PE thật · ~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Trên một danh sách liên kết các <code>Car(owner, price)</code> có trường <code>size</code>: <strong>f1</strong> <code>sortRange(k, h)</code> chỉ sắp các xe ở vị trí k…h (đếm từ 0, tính cả hai đầu) theo price, ổn định (stable), các nút khác đứng nguyên chỗ; nếu h vượt quá cuối thì kéo về vị trí cuối, còn k ≥ h thì không làm gì. <strong>f2</strong> <code>removeSamePrice()</code>, trên danh sách đã sắp theo price, chỉ giữ xe đầu tiên của mỗi mức giá và giữ <code>tail</code>, <code>size</code> luôn đúng.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>A5 B9 C2 D9 E1 F3 G7, <code>sortRange(1, 4)</code> → (A,5) (E,1) (C,2) (B,9) (D,9) (F,3) (G,7) — các vị trí 0, 5 và 6 giữ nguyên, và B vẫn đứng trước D.</p>
<p class="nhan">Ý tưởng</p>
<p>đi tới nút ở vị trí k, rồi chạy sắp xếp nổi bọt (bubble sort) của slide 10 trên dữ liệu của h − k + 1 nút tính từ đó: đổi chỗ hai nút kề nhau với dấu <code>&gt;</code> ngặt thì ổn định, và danh sách liên kết đơn chỉ cho nhìn về phía trước — đúng thứ bubble sort cần. Sau khi sắp, các xe cùng giá đứng liền nhau, nên f2 chỉ là một lượt duyệt gỡ <code>p.next</code> chừng nào giá của nó bằng giá của <code>p</code>.</p>
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
    int size;

    void addLast(String o, int pr) {
        Node q = new Node(new Car(o, pr), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
        size++;
    }

    // f1: CHỈ sắp các vị trí k..h (đếm từ 0, tính cả hai đầu) theo price, ổn định: bubble sort trên dữ liệu
    void sortRange(int k, int h) {
        if (k &lt; 0) k = 0;
        if (h &gt; size - 1) h = size - 1;
        if (k &gt;= h) return;
        Node start = head;
        for (int i = 0; i &lt; k; i++) start = start.next; // nút ở vị trí k
        boolean swapped;
        do {
            swapped = false;
            Node p = start;
            for (int i = k; i &lt; h; i++, p = p.next)
                if (p.info.price &gt; p.next.info.price) {  // &gt; ngặt: cùng giá không bao giờ đổi
                    Car t = p.info; p.info = p.next.info; p.next.info = t;
                    swapped = true;
                }
        } while (swapped);
    }

    // f2: trên danh sách đã sắp theo price, mỗi giá chỉ giữ xe đầu tiên
    void removeSamePrice() {
        Node p = head;
        while (p != null &amp;&amp; p.next != null)
            if (p.next.info.price == p.info.price) {     // cùng giá với xe đứng trước: gỡ ra
                if (p.next == tail) tail = p;
                p.next = p.next.next;
                size--;
            } else p = p.next;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe8SortRange {
    static int fails = 0;
    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MyList make() {                               // A5 B9 C2 D9 E1 F3 G7
        MyList t = new MyList();
        for (String w : "A5 B9 C2 D9 E1 F3 G7".split(" ")) t.addLast(w.substring(0, 1), Integer.parseInt(w.substring(1)));
        return t;
    }

    public static void main(String[] args) {
        MyList t = make();
        t.sortRange(1, 4);
        check("sort positions 1..4 only", t.traverse(), "(A,5) (E,1) (C,2) (B,9) (D,9) (F,3) (G,7)");
        t = make();
        t.sortRange(0, 100);
        check("whole list (h clamped), stable", t.traverse(), "(E,1) (C,2) (F,3) (A,5) (G,7) (B,9) (D,9)");
        t.removeSamePrice();
        check("remove repeated prices", t.traverse(), "(E,1) (C,2) (F,3) (A,5) (G,7) (B,9)");
        check("tail and size updated", t.tail.info + " size=" + t.size, "(B,9) size=6");
        t = make();
        t.sortRange(3, 3);
        check("k == h: nothing to do", t.traverse(), "(A,5) (B,9) (C,2) (D,9) (E,1) (F,3) (G,7)");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS sort positions 1..4 only<br>
PASS whole list (h clamped), stable<br>
PASS remove repeated prices<br>
PASS tail and size updated<br>
PASS k == h: nothing to do<br>
ALL TESTS PASSED</div>
<div class="pitfall">Đọc kỹ đề đếm vị trí từ 0 hay từ 1: khác nhau là khác xe bị di chuyển. Ở f2, chỉ cho <code>p</code> tiến lên khi không xoá gì — nếu không, ba giá liền nhau (9, 9, 9) sẽ sót lại một — và khi nút bị xoá là tail thì phải lùi <code>tail</code> về <code>p</code>.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>sorting</strong></td><td>sắp xếp</td><td>Putting items in order by a key, ascending or descending.</td></tr>
<tr><td><strong>key</strong></td><td>khoá</td><td>The field a sort compares, such as <code>price</code> or <code>score</code>.</td></tr>
<tr><td><strong>pass</strong></td><td>lượt</td><td>One run of the outer loop of an elementary sort.</td></tr>
<tr><td><strong>inversion</strong></td><td>nghịch thế</td><td>A pair of positions i &lt; j with a[i] &gt; a[j]; insertion and bubble sort remove exactly one per shift or swap.</td></tr>
<tr><td><strong>stable sort</strong></td><td>sắp xếp ổn định</td><td>Equal keys keep their original relative order.</td></tr>
<tr><td><strong>in-place sort</strong></td><td>sắp xếp tại chỗ</td><td>A sort that needs only O(1) (or O(log n) stack) memory besides the array.</td></tr>
<tr><td><strong>adaptive sort</strong></td><td>sắp xếp thích nghi</td><td>A sort that runs faster when the input is nearly sorted, like insertion sort.</td></tr>
<tr><td><strong>selection sort</strong></td><td>sắp xếp chọn</td><td>Repeatedly select the smallest remaining element and swap it to the front.</td></tr>
<tr><td><strong>insertion sort</strong></td><td>sắp xếp chèn</td><td>Insert each element into the sorted part on its left by shifting bigger ones.</td></tr>
<tr><td><strong>bubble sort</strong></td><td>sắp xếp nổi bọt</td><td>Swap out-of-order neighbours; a pass with no swap ends the sort.</td></tr>
<tr><td><strong>divide and conquer</strong></td><td>chia để trị</td><td>Split a problem into smaller ones of the same kind, solve them, combine the results.</td></tr>
<tr><td><strong>pivot</strong></td><td>chốt</td><td>The element around which quicksort partitions a part of the array.</td></tr>
<tr><td><strong>partition</strong></td><td>phân hoạch</td><td>Rearrange a part so that ≤ pivot is left of the pivot and > pivot is right of it.</td></tr>
<tr><td><strong>quicksort</strong></td><td>sắp xếp nhanh</td><td>Partition, then sort both sides recursively: O(n log n) on average, O(n²) in the worst case.</td></tr>
<tr><td><strong>median-of-three</strong></td><td>trung vị của ba</td><td>Take the middle value of the first, middle and last elements as the pivot.</td></tr>
<tr><td><strong>merge</strong></td><td>trộn</td><td>Combine two sorted sequences into one sorted sequence in linear time.</td></tr>
<tr><td><strong>merge sort</strong></td><td>sắp xếp trộn</td><td>Split in halves, sort each, merge: O(n log n) always, O(n) extra memory.</td></tr>
<tr><td><strong>max heap / min heap</strong></td><td>đống max / đống min</td><td>A nearly complete binary tree where each parent is ≥ (max) or ≤ (min) its children.</td></tr>
<tr><td><strong>sift up / sift down</strong></td><td>cho nổi lên / cho chìm xuống</td><td>Move an element up or down the heap until the heap property holds again.</td></tr>
<tr><td><strong>heap sort</strong></td><td>sắp xếp vun đống</td><td>Build a max heap, then move the root to the end n − 1 times: O(n log n), in place.</td></tr>
<tr><td><strong>radix sort (LSD)</strong></td><td>sắp xếp theo cơ số</td><td>Distribute by one digit per pass, from the least significant, keeping each sublist in arrival order.</td></tr>
<tr><td><strong>half-open range [from, to)</strong></td><td>khoảng nửa mở</td><td><code>Arrays.sort(a, from, to)</code> sorts a[from] … a[to−1]; the element at <code>to</code> is excluded.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>sorting</strong></td><td>sắp xếp</td><td>Đưa các phần tử về đúng thứ tự theo một khoá, tăng dần hoặc giảm dần.</td></tr>
<tr><td><strong>key</strong></td><td>khoá</td><td>Trường dùng để so sánh khi sắp, như <code>price</code> hay <code>score</code>.</td></tr>
<tr><td><strong>pass</strong></td><td>lượt</td><td>Một lần chạy của vòng lặp ngoài trong một thuật toán sắp xếp cơ bản.</td></tr>
<tr><td><strong>inversion</strong></td><td>nghịch thế</td><td>Cặp vị trí i &lt; j mà a[i] &gt; a[j]; insertion và bubble sort mỗi lần dời hoặc đổi chỗ xoá đúng một nghịch thế.</td></tr>
<tr><td><strong>stable sort</strong></td><td>sắp xếp ổn định</td><td>Các khoá bằng nhau giữ nguyên thứ tự tương đối ban đầu.</td></tr>
<tr><td><strong>in-place sort</strong></td><td>sắp xếp tại chỗ</td><td>Thuật toán sắp chỉ cần O(1) (hoặc O(log n) ngăn xếp) bộ nhớ ngoài chính mảng.</td></tr>
<tr><td><strong>adaptive sort</strong></td><td>sắp xếp thích nghi</td><td>Thuật toán chạy nhanh hơn khi đầu vào gần như đã sắp, như insertion sort.</td></tr>
<tr><td><strong>selection sort</strong></td><td>sắp xếp chọn</td><td>Lặp lại việc chọn phần tử nhỏ nhất còn lại rồi đổi nó lên đầu.</td></tr>
<tr><td><strong>insertion sort</strong></td><td>sắp xếp chèn</td><td>Chèn từng phần tử vào phần đã sắp bên trái bằng cách dời các phần tử lớn hơn.</td></tr>
<tr><td><strong>bubble sort</strong></td><td>sắp xếp nổi bọt</td><td>Đổi chỗ các cặp kề nhau sai thứ tự; một lượt không đổi chỗ thì dừng.</td></tr>
<tr><td><strong>divide and conquer</strong></td><td>chia để trị</td><td>Tách bài toán thành các bài nhỏ cùng loại, giải chúng rồi ghép kết quả.</td></tr>
<tr><td><strong>pivot</strong></td><td>chốt</td><td>Phần tử mà quicksort dùng làm mốc để phân hoạch một đoạn mảng.</td></tr>
<tr><td><strong>partition</strong></td><td>phân hoạch</td><td>Sắp lại một đoạn sao cho phần ≤ chốt nằm bên trái chốt, phần > chốt nằm bên phải.</td></tr>
<tr><td><strong>quicksort</strong></td><td>sắp xếp nhanh</td><td>Phân hoạch rồi sắp đệ quy hai bên: trung bình O(n log n), xấu nhất O(n²).</td></tr>
<tr><td><strong>median-of-three</strong></td><td>trung vị của ba</td><td>Lấy giá trị đứng giữa của phần tử đầu, giữa và cuối làm chốt.</td></tr>
<tr><td><strong>merge</strong></td><td>trộn</td><td>Ghép hai dãy đã sắp thành một dãy đã sắp trong thời gian tuyến tính.</td></tr>
<tr><td><strong>merge sort</strong></td><td>sắp xếp trộn</td><td>Chia đôi, sắp từng nửa, trộn lại: luôn O(n log n), tốn O(n) bộ nhớ thêm.</td></tr>
<tr><td><strong>max heap / min heap</strong></td><td>đống max / đống min</td><td>Cây nhị phân gần đầy đủ trong đó mỗi nút cha ≥ (max) hoặc ≤ (min) các con.</td></tr>
<tr><td><strong>sift up / sift down</strong></td><td>cho nổi lên / cho chìm xuống</td><td>Đẩy một phần tử lên hoặc xuống trong heap cho tới khi tính chất heap đúng trở lại.</td></tr>
<tr><td><strong>heap sort</strong></td><td>sắp xếp vun đống</td><td>Dựng heap max rồi n − 1 lần đưa gốc về cuối: O(n log n), tại chỗ.</td></tr>
<tr><td><strong>radix sort (LSD)</strong></td><td>sắp xếp theo cơ số</td><td>Mỗi lượt chia theo một chữ số, bắt đầu từ chữ số thấp nhất, mỗi danh sách con giữ thứ tự gặp.</td></tr>
<tr><td><strong>half-open range [from, to)</strong></td><td>khoảng nửa mở</td><td><code>Arrays.sort(a, from, to)</code> sắp a[from] … a[to−1]; phần tử ở <code>to</code> không được tính.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 6</h2>
<ol>
<li><strong>Elementary sorts are O(n²)</strong>: selection always makes n(n−1)/2 comparisons but ≤ n−1 swaps and is not stable; insertion is adaptive (O(n) on sorted input, work = inversions) and stable; bubble with a flag is O(n) on sorted input, stable, and makes the most swaps.</li>
<li><strong>After pass k</strong>: selection has the k smallest in their final places; insertion has the first k+1 sorted among themselves; bubble has the k largest at the end.</li>
<li><strong>Quicksort</strong>: partition puts the pivot in its final place (≤ left, > right), then recurse on (p, k−1) and (k+1, r). O(n log n) on average with a small constant; O(n²) when the pivot is always the minimum or maximum — sorted input with a first-element pivot. Median-of-3 and random pivots make that unlikely. Not stable.</li>
<li><strong>Merge sort</strong>: split blindly, merge carefully; O(n log n) in every case, O(n) extra memory; stable only if the merge takes the left element on ties (<code>&lt;=</code>). The slides' <code>&lt;</code> loses stability, and <code>!(p&lt;=q) &amp;&amp; (q&lt;=r)</code> negates only <code>(p&lt;=q)</code>.</li>
<li><strong>Heap</strong>: a nearly complete binary tree with parent ≥ children, stored in an array — children 2i+1 and 2i+2, parent (i−1)/2. <strong>Heap sort</strong>: build the heap, then n−1 times move the root to the end; O(n log n) always, O(1) memory, not stable.</li>
<li><strong>Radix sort (LSD)</strong>: distribute by the one's digit first into FIFO sublists, gather 0 → 9, repeat for every digit; O(d·(n + b)), no comparisons, but only for digit-like keys and with O(n) extra memory.</li>
<li><strong>Stability is what makes two-key sorting easy</strong>: sort by the minor key, then stably by the major key — or write one comparator with both keys.</li>
<li><strong>In real code use java.util</strong>: <code>Arrays.sort</code> (primitives: Dual-Pivot Quicksort; objects: stable TimSort), <code>Collections.sort</code> for lists; <code>sort(a, from, to)</code> excludes <code>to</code>; <code>binarySearch</code> needs a sorted array. On a linked list in the PE, swap the <code>info</code> of nodes so <code>head</code> and <code>tail</code> stay valid.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>[5 2 3 8 1] after pass 2 — insertion sort? selection sort?</li>
<li>In Exercise 5, why sort by name first and by score second, and why must the second sort be stable?</li>
<li>How many passes and comparisons does the flagged bubble sort of slide 10 make on an already sorted array of n elements?</li>
<li>How many passes does radix sort need for [170, 45, 802, 2], and why?</li>
<li>Which sorts of the chapter are stable, and which are not?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) insertion <code>2 3 5 8 1</code>, selection <code>1 2 3 8 5</code>. (2) The last sort decides the main order; being stable, it keeps the name order inside each group of equal scores. (3) One pass, n−1 comparisons — O(n). (4) Three: the largest value, 802, has three digits. (5) Stable: insertion, bubble, merge sort with <code>&lt;=</code>, radix sort with FIFO sublists; not stable: selection, quicksort, heap sort.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Extra memory</th><th>Stable</th><th>In place</th></tr></thead>
<tbody>
<tr><td>Selection sort</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>no</td><td>yes</td></tr>
<tr><td>Insertion sort</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td><td>yes</td></tr>
<tr><td>Bubble sort, with flag</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>yes</td><td>yes</td></tr>
<tr><td>Quicksort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) stack on average, O(n) worst</td><td>no</td><td>yes</td></tr>
<tr><td>Merge sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>yes, with <code>&lt;=</code></td><td>no</td></tr>
<tr><td>Heap sort</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>no</td><td>yes</td></tr>
<tr><td>Radix sort, LSD (d digits, b sublists)</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(n + b)</td><td>yes</td><td>no</td></tr>
<tr><td>Top-k with a partial heap sort (Exercise 6)</td><td>O(n log n + k log n)</td><td>same</td><td>same</td><td>O(n) copy</td><td>—</td><td>—</td></tr>
<tr><td><code>Arrays.binarySearch</code> on a sorted array</td><td>O(1)</td><td>O(log n)</td><td>O(log n)</td><td>O(1)</td><td>—</td><td>—</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 6</h2>
<ol>
<li><strong>Các thuật toán cơ bản là O(n²)</strong>: sắp xếp chọn (selection) luôn tốn n(n−1)/2 phép so sánh nhưng đổi chỗ ≤ n−1 lần và không ổn định; sắp xếp chèn (insertion) thích nghi (O(n) với mảng đã sắp, khối lượng việc = số nghịch thế) và ổn định; sắp xếp nổi bọt (bubble) có cờ là O(n) với mảng đã sắp, ổn định, và đổi chỗ nhiều nhất.</li>
<li><strong>Sau lượt k</strong>: selection có k phần tử nhỏ nhất ở đúng chỗ cuối cùng; insertion có k+1 phần tử đầu đã có thứ tự với nhau; bubble có k phần tử lớn nhất ở cuối mảng.</li>
<li><strong>Sắp xếp nhanh (quicksort)</strong>: phân hoạch (partition) đưa chốt (pivot) về đúng chỗ cuối cùng (≤ bên trái, > bên phải), rồi đệ quy trên (p, k−1) và (k+1, r). Trung bình O(n log n) với hằng số nhỏ; O(n²) khi chốt luôn là min hoặc max — mảng đã sắp với chốt là phần tử đầu. Trung vị của ba (median-of-3) và chốt ngẫu nhiên làm điều đó khó xảy ra. Không ổn định.</li>
<li><strong>Sắp xếp trộn (merge sort)</strong>: chia bừa, trộn kỹ; O(n log n) trong mọi trường hợp, O(n) bộ nhớ thêm; ổn định chỉ khi phép trộn lấy phần tử bên trái lúc hoà (<code>&lt;=</code>). Dấu <code>&lt;</code> trên slide làm mất tính ổn định, còn <code>!(p&lt;=q) &amp;&amp; (q&lt;=r)</code> chỉ phủ định <code>(p&lt;=q)</code>.</li>
<li><strong>Đống (heap)</strong>: cây nhị phân gần đầy đủ với cha ≥ con, lưu trong mảng — con là 2i+1 và 2i+2, cha là (i−1)/2. <strong>Sắp xếp vun đống (heap sort)</strong>: dựng heap, rồi n−1 lần đưa gốc về cuối; luôn O(n log n), bộ nhớ O(1), không ổn định.</li>
<li><strong>Sắp xếp theo cơ số (radix sort) LSD (chữ số thấp nhất làm trước)</strong>: chia theo hàng đơn vị trước vào các danh sách con vào trước ra trước (FIFO), gom từ 0 → 9, lặp cho mọi chữ số; O(d·(n + b)), không so sánh, nhưng chỉ dùng cho khoá dạng chữ số và tốn O(n) bộ nhớ thêm.</li>
<li><strong>Tính ổn định (stability) giúp sắp theo hai khoá dễ dàng</strong>: sắp theo khoá phụ trước, rồi sắp ổn định theo khoá chính — hoặc viết một bộ so sánh (comparator) gồm cả hai khoá.</li>
<li><strong>Trong code thật hãy dùng java.util</strong>: <code>Arrays.sort</code> (kiểu nguyên thuỷ: Dual-Pivot Quicksort; đối tượng: TimSort ổn định), <code>Collections.sort</code> cho danh sách; <code>sort(a, from, to)</code> không tính <code>to</code>; <code>binarySearch</code> cần mảng đã sắp. Với danh sách liên kết trong bài PE, hãy đổi chỗ <code>info</code> của các nút để <code>head</code> và <code>tail</code> luôn đúng.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm quiz</h3>
<ol>
<li>[5 2 3 8 1] sau lượt 2 — insertion sort ra gì? selection sort ra gì?</li>
<li>Ở Bài 5, vì sao sắp theo tên trước rồi mới theo điểm, và vì sao lần sắp thứ hai phải ổn định?</li>
<li>Bubble sort có cờ của slide 10 chạy bao nhiêu lượt và bao nhiêu phép so sánh trên một mảng n phần tử đã sắp sẵn?</li>
<li>Radix sort cần bao nhiêu lượt cho [170, 45, 802, 2], vì sao?</li>
<li>Những thuật toán nào của chương là ổn định, những thuật toán nào không?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) insertion <code>2 3 5 8 1</code>, selection <code>1 2 3 8 5</code>. (2) Lần sắp cuối quyết định thứ tự chính; vì ổn định nên nó giữ thứ tự tên bên trong mỗi nhóm cùng điểm. (3) Một lượt, n−1 phép so sánh — O(n). (4) Ba lượt: giá trị lớn nhất, 802, có ba chữ số. (5) Ổn định: insertion, bubble, merge sort với <code>&lt;=</code>, radix sort với danh sách con FIFO; không ổn định: selection, quicksort, heap sort.</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Thuật toán</th><th>Tốt nhất</th><th>Trung bình</th><th>Xấu nhất</th><th>Bộ nhớ thêm</th><th>Ổn định</th><th>Tại chỗ</th></tr></thead>
<tbody>
<tr><td>Sắp xếp chọn (selection)</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>không</td><td>có</td></tr>
<tr><td>Sắp xếp chèn (insertion)</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>có</td><td>có</td></tr>
<tr><td>Sắp xếp nổi bọt có cờ (bubble)</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td>có</td><td>có</td></tr>
<tr><td>Sắp xếp nhanh (quicksort)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n) ngăn xếp trung bình, O(n) xấu nhất</td><td>không</td><td>có</td></tr>
<tr><td>Sắp xếp trộn (merge sort)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td>có, với <code>&lt;=</code></td><td>không</td></tr>
<tr><td>Sắp xếp vun đống (heap sort)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>O(1)</td><td>không</td><td>có</td></tr>
<tr><td>Sắp xếp theo cơ số LSD (d chữ số, b danh sách con)</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(d(n + b))</td><td>O(n + b)</td><td>có</td><td>không</td></tr>
<tr><td>Top-k bằng heap sort dừng giữa chừng (Bài 6)</td><td>O(n log n + k log n)</td><td>như vậy</td><td>như vậy</td><td>O(n) bản sao</td><td>—</td><td>—</td></tr>
<tr><td><code>Arrays.binarySearch</code> trên mảng đã sắp</td><td>O(1)</td><td>O(log n)</td><td>O(log n)</td><td>O(1)</td><td>—</td><td>—</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch6) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Selection sort (slide 6 of 6-Sorting) runs on [5, 2, 3, 8, 1]. What is the array after the FIRST pass?|||Selection sort (slide 6 của 6-Sorting) chạy trên [5, 2, 3, 8, 1]. Mảng sau lượt ĐẦU TIÊN là gì?',
      options: ['[2, 5, 3, 8, 1]|||[2, 5, 3, 8, 1]', '[2, 3, 5, 1, 8]|||[2, 3, 5, 1, 8]', '[1, 2, 3, 8, 5]|||[1, 2, 3, 8, 5]', '[1, 5, 2, 3, 8]|||[1, 5, 2, 3, 8]'],
      correctIndex: 2,
      points: 1,
      explanation: 'The first pass finds the minimum (1, at index 4) and swaps it with a[0]: 5 and 1 exchange places, nothing else moves. Option A is the first pass of insertion sort, B the first pass of bubble sort — telling the three elementary sorts apart from one pass is a favourite FE question. D would shift elements, but selection sort only swaps.|||Lượt đầu tìm phần tử nhỏ nhất (1, ở chỉ số 4) rồi đổi chỗ với a[0]: 5 và 1 đổi cho nhau, không phần tử nào khác di chuyển. Phương án A là lượt đầu của insertion sort, B là lượt đầu của bubble sort — nhận ra ba thuật toán cơ bản chỉ qua một lượt là câu FE rất hay gặp. D phải dời phần tử, còn selection sort chỉ đổi chỗ.' },
    { id: 'q2',
      question: 'Insertion sort (slide 9) runs on [5, 2, 3, 8, 1]. What is the array after the first TWO passes (i = 1 and i = 2)?|||Insertion sort (slide 9) chạy trên [5, 2, 3, 8, 1]. Mảng sau HAI lượt đầu (i = 1 và i = 2) là gì?',
      options: ['[2, 3, 5, 8, 1]|||[2, 3, 5, 8, 1]', '[1, 2, 5, 3, 8]|||[1, 2, 5, 3, 8]', '[2, 5, 3, 8, 1]|||[2, 5, 3, 8, 1]', '[2, 3, 5, 1, 8]|||[2, 3, 5, 1, 8]'],
      correctIndex: 0,
      points: 1,
      explanation: 'Pass i = 1 inserts 2 before 5 → [2, 5, 3, 8, 1]; pass i = 2 inserts 3 between 2 and 5 → [2, 3, 5, 8, 1]. The elements after position i are not touched yet, so 8 and 1 stay where they are. C is the state after only ONE pass; B looks like selection sort, which would already have moved the minimum 1 to the front.|||Lượt i = 1 chèn 2 vào trước 5 → [2, 5, 3, 8, 1]; lượt i = 2 chèn 3 vào giữa 2 và 5 → [2, 3, 5, 8, 1]. Các phần tử sau vị trí i chưa bị đụng tới, nên 8 và 1 giữ nguyên chỗ. C là trạng thái sau mới MỘT lượt; B giống selection sort, vốn đã đưa phần tử nhỏ nhất 1 lên đầu.' },
    { id: 'q3',
      question: 'The bubbleSort of slide 10 (do-while loop with a swapped flag) runs on the already sorted array [1, 2, 3, 4, 5, 6]. How many comparisons a[i] > a[i + 1] does it make?|||Hàm bubbleSort ở slide 10 (vòng do-while có cờ swapped) chạy trên mảng đã sắp [1, 2, 3, 4, 5, 6]. Nó thực hiện bao nhiêu phép so sánh a[i] > a[i + 1]?',
      options: ['15|||15', '5|||5', '6|||6', '30|||30'],
      correctIndex: 1,
      points: 1,
      explanation: 'The first pass compares the n − 1 = 5 neighbouring pairs, swaps nothing, leaves swapped false and the do-while stops — that is the O(n) best case written on the slide. 15 = 5 + 4 + 3 + 2 + 1 is the count of a version without the flag, which always makes all its passes and is O(n²) even on sorted data.|||Lượt đầu so n − 1 = 5 cặp liền kề, không đổi chỗ lần nào, cờ swapped vẫn false nên do-while dừng — đó chính là trường hợp tốt nhất O(n) ghi trên slide. 15 = 5 + 4 + 3 + 2 + 1 là số phép so sánh của bản không có cờ, luôn chạy đủ các lượt và vẫn O(n²) dù dữ liệu đã sắp.' },
    { id: 'q4',
      question: 'The merge code on slide 33 takes the left element only when a[i] < a[j]; otherwise it takes the right element. What happens to two equal keys, one in each half?|||Code merge ở slide 33 chỉ lấy phần tử bên trái khi a[i] < a[j]; ngược lại lấy phần tử bên phải. Hai khoá bằng nhau, mỗi nửa một khoá, sẽ ra sao?',
      options: ['The left one is taken first, so mergesort stays stable|||Khoá bên trái được lấy trước, nên mergesort vẫn ổn định', 'Both are copied together in one step|||Cả hai được chép cùng lúc trong một bước', 'The merge stops early and leaves the rest unsorted|||Phép trộn dừng sớm, phần còn lại không được sắp', 'The right one is taken first, so this mergesort is not stable|||Khoá bên phải được lấy trước, nên mergesort này không ổn định'],
      correctIndex: 3,
      points: 1,
      explanation: "With a[i] < a[j], a tie is not \"less\", so the else branch copies the RIGHT half's element first and two equal keys swap their original order: the sort is no longer stable. Writing a[i] <= a[j] fixes it and makes mergesort stable, which is one of its main advantages over quicksort and heap sort. Option A describes the <= version — the trap is assuming the slide already has it.|||Với a[i] < a[j], hai khoá bằng nhau không phải \"nhỏ hơn\", nên nhánh else chép phần tử của nửa PHẢI trước và hai khoá bằng nhau đảo thứ tự ban đầu: phép sắp không còn ổn định (stable). Viết a[i] <= a[j] là sửa được và mergesort trở nên ổn định — một ưu điểm lớn của nó so với quicksort và heap sort. Phương án A mô tả bản dùng <= — cái bẫy là tưởng slide đã viết như vậy." },
    { id: 'q5',
      question: 'A quicksort always picks the FIRST element of the subarray as its pivot. Which input drives it to its O(n²) worst case?|||Một quicksort luôn chọn phần tử ĐẦU của đoạn con làm pivot. Đầu vào nào đẩy nó vào trường hợp xấu nhất O(n²)?',
      options: ['An array that is already sorted|||Một mảng đã được sắp xếp sẵn', 'A random permutation of distinct values|||Một hoán vị ngẫu nhiên các giá trị khác nhau', 'An array whose first element is its median|||Một mảng có phần tử đầu là trung vị', 'An array with half the values odd and half even|||Một mảng nửa số lẻ, nửa số chẵn'],
      correctIndex: 0,
      points: 1,
      explanation: 'On sorted data the first element is the minimum, so every partition puts nothing on the left and n − 1 elements on the right: n levels of work n, n − 1, … → O(n²) (slide 16). A random permutation gives balanced splits on average, O(n log n). That is why the slide suggests median-of-3 or a random pivot.|||Với dữ liệu đã sắp, phần tử đầu là nhỏ nhất, nên mỗi lần phân hoạch bên trái rỗng còn bên phải có n − 1 phần tử: n tầng với khối lượng n, n − 1, … → O(n²) (slide 16). Hoán vị ngẫu nhiên cho các lần chia trung bình cân đối, O(n log n). Vì thế slide gợi ý chọn trung vị của ba (median-of-3) hoặc pivot ngẫu nhiên.' },
    { id: 'q6',
      question: 'Radix sort (slides 38–39) processes 493 812 715 340 195 437 710 582 385. What is the list after the FIRST pass, which distributes by the ones digit and gathers buckets 0 to 9?|||Radix sort (slide 38–39) xử lý 493 812 715 340 195 437 710 582 385. Danh sách sau lượt ĐẦU TIÊN — chia theo chữ số hàng đơn vị rồi gom bucket 0 tới 9 — là gì?',
      options: ['710 812 715 437 340 582 385 493 195|||710 812 715 437 340 582 385 493 195', '195 340 385 437 493 582 710 715 812|||195 340 385 437 493 582 710 715 812', '340 710 812 582 493 715 195 385 437|||340 710 812 582 493 715 195 385 437', '710 340 582 812 493 715 385 195 437|||710 340 582 812 493 715 385 195 437'],
      correctIndex: 2,
      points: 1,
      explanation: 'Bucket 0 gets 340 and 710 in their input order, bucket 2 gets 812 and 582, bucket 3 gets 493, bucket 5 gets 715, 195, 385, bucket 7 gets 437. Keeping the input order inside each bucket is what makes the next passes work. Option A is the list after the SECOND pass (tens digit) and B the final result; D breaks the input order inside bucket 0.|||Bucket 0 nhận 340 và 710 theo thứ tự vào, bucket 2 nhận 812 và 582, bucket 3 nhận 493, bucket 5 nhận 715, 195, 385, bucket 7 nhận 437. Giữ thứ tự vào bên trong mỗi bucket chính là điều giúp các lượt sau đúng. Phương án A là danh sách sau lượt THỨ HAI (hàng chục), B là kết quả cuối; D phá thứ tự vào trong bucket 0.' },
    { id: 'q7',
      question: 'Which algorithm sorts IN PLACE (O(1) extra memory) and is O(n log n) even in the worst case?|||Thuật toán nào sắp TẠI CHỖ (bộ nhớ thêm O(1)) và vẫn O(n log n) ngay cả trường hợp xấu nhất?',
      options: ['Merge sort|||Merge sort (sắp trộn)', 'Heap sort|||Heap sort (sắp vun đống)', 'Quicksort|||Quicksort (sắp nhanh)', 'Insertion sort|||Insertion sort (sắp chèn)'],
      correctIndex: 1,
      points: 1,
      explanation: 'Heap sort builds a heap inside the array and repeatedly swaps the root to the end: O(n log n) in every case and only a few extra variables (slides 36–37). Merge sort is the tempting answer for its guaranteed O(n log n), but its merge needs a helper array b of size n (slide 33). Quicksort is in place but has an O(n²) worst case; insertion sort is O(n²).|||Heap sort dựng heap ngay trong mảng rồi lặp lại việc đổi gốc về cuối: O(n log n) mọi trường hợp và chỉ cần vài biến phụ (slide 36–37). Merge sort là đáp án dễ nhầm vì luôn O(n log n), nhưng phép trộn của nó cần mảng phụ b cỡ n (slide 33). Quicksort sắp tại chỗ nhưng có trường hợp xấu O(n²); insertion sort là O(n²).' },
    { id: 'q8',
      question: 'What does this code print?|||Đoạn code sau in ra gì?',
      code: `int[] a = {9, 7, 5, 3, 1};
Arrays.sort(a, 1, 4);
System.out.println(Arrays.toString(a));`,
      codeLang: 'java',
      options: ['[9, 3, 5, 7, 1]|||[9, 3, 5, 7, 1]', '[9, 1, 3, 5, 7]|||[9, 1, 3, 5, 7]', '[3, 5, 7, 9, 1]|||[3, 5, 7, 9, 1]', '[9, 7, 1, 3, 5]|||[9, 7, 1, 3, 5]'],
      correctIndex: 0,
      points: 1,
      explanation: 'The real signature is sort(int[] a, int fromIndex, int toIndex), and toIndex is EXCLUSIVE: only a[1], a[2], a[3] = 7, 5, 3 are sorted, giving 3, 5, 7 in the middle. Slide 41 names the parameters first and last, which makes B tempting — it treats index 4 as included.|||Chữ ký thật là sort(int[] a, int fromIndex, int toIndex), và toIndex KHÔNG bao gồm: chỉ a[1], a[2], a[3] = 7, 5, 3 được sắp, thành 3, 5, 7 ở giữa. Slide 41 đặt tên tham số là first và last, nên B dễ gây nhầm — nó coi chỉ số 4 cũng được sắp.' },
    { id: 'q9',
      question: 'Records must be sorted by score while students with equal scores keep their original order. Which algorithm, written as on the slides, guarantees that?|||Cần sắp các bản ghi theo điểm mà sinh viên cùng điểm vẫn giữ thứ tự ban đầu. Thuật toán nào, viết như trên slide, đảm bảo điều đó?',
      options: ['Selection sort|||Selection sort (sắp chọn)', 'Quicksort|||Quicksort (sắp nhanh)', 'Heap sort|||Heap sort (sắp vun đống)', 'Insertion sort|||Insertion sort (sắp chèn)'],
      correctIndex: 3,
      points: 1,
      explanation: 'insertSort (slide 9) moves an element left only while x < a[j − 1], strictly less, so it never jumps over an equal key: it is stable. Selection sort is the tempting option because it is just as simple, but its long-distance swap can carry an element past an equal one; quicksort and heap sort also move elements across long distances.|||insertSort (slide 9) chỉ dời phần tử sang trái khi x < a[j − 1], nhỏ hơn hẳn, nên không bao giờ nhảy qua một khoá bằng nó: thuật toán ổn định (stable). Selection sort là phương án dễ nhầm vì cũng đơn giản, nhưng phép đổi chỗ xa của nó có thể mang một phần tử vượt qua phần tử bằng nó; quicksort và heap sort cũng dời phần tử đi xa.' },
    { id: 'q10',
      question: 'Which pair of algorithms from the deck follows the divide-and-conquer pattern?|||Cặp thuật toán nào trong bộ slide đi theo mô hình chia để trị (divide and conquer)?',
      options: ['Selection sort and bubble sort|||Selection sort và bubble sort', 'Quicksort and merge sort|||Quicksort và merge sort', 'Insertion sort and heap sort|||Insertion sort và heap sort', 'Radix sort and selection sort|||Radix sort và selection sort'],
      correctIndex: 1,
      points: 1,
      explanation: 'Both split the array into parts, sort the parts recursively and combine them: quicksort does the work BEFORE recursing (partition, slides 12–13), merge sort AFTER (merge, slide 31). Heap sort also reaches O(n log n), which makes C tempting, but it repeatedly removes the maximum from a heap — it never splits the problem into independent subproblems.|||Cả hai chia mảng thành các phần, sắp đệ quy từng phần rồi kết hợp: quicksort làm việc chính TRƯỚC khi đệ quy (phân hoạch, slide 12–13), merge sort làm SAU (trộn, slide 31). Heap sort cũng đạt O(n log n) nên C dễ gây nhầm, nhưng nó lặp lại việc lấy phần tử lớn nhất khỏi heap — không hề chia bài toán thành các bài toán con độc lập.' },
  ],
};

export default {
  slides: [L_csd12_1, L_csd12_2],
  practice: L_on_ch6,
  quiz: QUIZ,
  quizDescription: '10 câu lần theo và so sánh thuật toán sắp xếp: mảng sau một lượt selection/insertion, bubble có cờ, tính ổn định của merge ở slide 33, trường hợp xấu của quicksort, lượt đầu radix sort, heap sort, bẫy Arrays.sort(a, from, to) — mỗi câu có giải thích.',
};
