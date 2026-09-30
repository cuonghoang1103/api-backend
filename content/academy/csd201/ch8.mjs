/**
 * CSD201 · Chương 8 — xử lý văn bản.
 * Bài 📑 học theo từng slide: csd14 (8-TextProcessing.ppt, 40 slide).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: csd201-on-ch8.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-ch8).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 8.A — 📑 Slide by slide · Text processing, part 1: pattern matching — brute force & KMP (8-TextProcessing, slides 1–15) ───────── */
const L_csd14_1 = {
  title: '8.A — 📑 Slide by slide · Text processing, part 1: pattern matching — brute force & KMP (8-TextProcessing, slides 1–15)|||8.A — 📑 Học theo từng slide · Xử lý văn bản, phần 1: so khớp mẫu — vét cạn & KMP (8-TextProcessing, slide 1–15)',
  slug: 'csd201-slide-csd14-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–15 của bộ 8-TextProcessing: bài toán so khớp chuỗi, thuật toán vét cạn lần theo đúng ví dụ abcabaabcabac / abaa (trường hợp xấu O(nm) đếm bằng số), KMP lần theo ví dụ 1010001010110 / 101011 (next(j), trượt bản sao pp, mỗi phép so sánh), ba bảng T[] của slide kiểm lại — 10 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.A · 8-TextProcessing, slides 1–15</span>
<h2>Text processing, part 1 — pattern matching, slide by slide</h2>
<p class="lead">The last chapter of the course opens with a question every editor, search engine and DNA tool asks: where does a pattern occur in a text? This lesson walks through slides 1–15: the brute-force algorithm traced on the slides' own example, then Knuth–Morris–Pratt (KMP) with its next/T[] table — every trace is printed by a Java program you can run yourself.</p>
<div class="callout"><strong>CLO8 in the syllabus:</strong> describe the text-processing problem and its applications; explain the Huffman, LZW and run-length encoding algorithms. This lesson is the pattern-matching half (session 53). Two constructive questions of the syllabus belong here: CQ18.2 "What is the complexity of the brute-force algorithm?" and CQ18.3 "What is the complexity of the Knuth-Morris-Pratt algorithm?" (its HCM version adds "What is the role of the T[i] array?"). FE questions on this part commonly ask for a complexity, a number of comparisons on a small example, or the T[] of a short pattern — practise slides 13–15 by hand until you are fast.</div>
<h3>Slides 1–15 in one table</h3>
<table>
<thead><tr><th>Question</th><th>Brute force (slides 5–9)</th><th>KMP (slides 10–15)</th></tr></thead>
<tbody>
<tr><td>What happens after a mismatch?</td><td>shift p one position right, restart at p[0]</td><td>slide p so that p[T[k]] sits under the same text character</td></tr>
<tr><td>Does the text position go back?</td><td>yes — from S[i + k] back to S[i + 1]</td><td>never</td></tr>
<tr><td>Preprocessing</td><td>none</td><td>the table T[] (next), from p alone: O(m) time, O(m) memory</td></tr>
<tr><td>Worst-case comparisons</td><td>(n − m + 1)·m → O(nm)</td><td>at most 2n in the search → O(n + m) with the table</td></tr>
<tr><td>The slides' example</td><td>S = abcabaabcabac, p = abaa → found at 3 after 9 comparisons</td><td>a = 1010001010110, p = 101011 → found at r = 6 after 14 comparisons</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.A · 8-TextProcessing, slide 1–15</span>
<h2>Xử lý văn bản, phần 1 — so khớp mẫu, học từng slide</h2>
<p class="lead">Chương cuối của môn mở đầu bằng câu hỏi mà mọi trình soạn thảo, máy tìm kiếm và công cụ phân tích DNA đều phải trả lời: một mẫu (pattern) xuất hiện ở đâu trong văn bản (text)? Bài này đi qua slide 1–15: thuật toán vét cạn (brute force) lần theo đúng ví dụ của slide, rồi thuật toán Knuth–Morris–Pratt (KMP) cùng bảng next/T[] — mọi bảng lần theo đều do một chương trình Java in ra, bạn tự chạy lại được.</p>
<div class="callout"><strong>CLO8 (chuẩn đầu ra số 8) trong đề cương môn học (syllabus):</strong> mô tả bài toán xử lý văn bản và ứng dụng của nó; giải thích các thuật toán Huffman, LZW và mã hoá độ dài loạt (run-length encoding). Bài này là nửa so khớp mẫu (buổi 53). Hai câu hỏi gợi mở (constructive question) của syllabus nằm ở đây: CQ18.2 "Độ phức tạp của thuật toán vét cạn là bao nhiêu?" và CQ18.3 "Độ phức tạp của thuật toán Knuth-Morris-Pratt là bao nhiêu?" (bản HCM hỏi thêm "mảng T[i] dùng để làm gì?"). Câu hỏi thi cuối kỳ (FE) ở phần này thường hỏi độ phức tạp, số phép so sánh trên một ví dụ nhỏ, hoặc bảng T[] của một mẫu ngắn — hãy luyện tay slide 13–15 tới khi làm nhanh.</div>
<h3>Slide 1–15 trong một bảng</h3>
<table>
<thead><tr><th>Câu hỏi</th><th>Vét cạn (slide 5–9)</th><th>KMP (slide 10–15)</th></tr></thead>
<tbody>
<tr><td>Sai khớp (mismatch) thì làm gì?</td><td>dịch p sang phải một vị trí, so lại từ p[0]</td><td>trượt p sao cho p[T[k]] nằm dưới đúng ký tự văn bản vừa so</td></tr>
<tr><td>Vị trí trên văn bản có lùi lại không?</td><td>có — từ S[i + k] lùi về S[i + 1]</td><td>không bao giờ</td></tr>
<tr><td>Tiền xử lý (preprocessing)</td><td>không có</td><td>bảng T[] (next), tính từ riêng p: thời gian O(m), bộ nhớ O(m)</td></tr>
<tr><td>Số phép so sánh xấu nhất</td><td>(n − m + 1)·m → O(nm)</td><td>tối đa 2n khi tìm → O(n + m) tính cả bảng</td></tr>
<tr><td>Ví dụ của slide</td><td>S = abcabaabcabac, p = abaa → thấy ở vị trí 3 sau 9 phép so sánh</td><td>a = 1010001010110, p = 101011 → thấy ở r = 6 sau 14 phép so sánh</td></tr>
</tbody>
</table>`),
    walkHead('csd14', 1, 15),
    walk('csd14', [
      [1, '8. Text Processing',
        `<p class="y-chinh">🎯 Chapter 8, the last chapter of CSD201, is about text: finding a pattern inside a text, and storing text in fewer bits.</p>
<p>The deck has two halves — pattern matching (slides 4–15, this lesson) and data compression (slides 16–40, lesson 8.B) — and both reuse structures you already know: arrays, binary trees, a priority queue, a dictionary.</p>`,
        `<p class="y-chinh">🎯 Chương 8, chương cuối của CSD201, nói về văn bản (text): tìm một mẫu (pattern) trong văn bản, và lưu văn bản bằng ít bit hơn.</p>
<p>Bộ slide có hai nửa — so khớp mẫu (pattern matching, slide 4–15, bài này) và nén dữ liệu (data compression, slide 16–40, bài 8.B) — và cả hai đều dùng lại những cấu trúc bạn đã học: mảng, cây nhị phân, hàng đợi ưu tiên (priority queue), từ điển (dictionary).</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Nine objectives in two groups: searching in text (the first four) and compressing it (the last five).</p>
<ol>
<li><strong>Abundance of digitized text, the problem of string matching</strong> — slides 3–4: why text algorithms matter and what exactly is asked.</li>
<li><strong>Brute-force algorithm</strong> — slides 5–9: the obvious method, O(nm).</li>
<li><strong>Knuth–Morris–Pratt algorithm</strong> — slides 10–15: the linear method, O(n + m).</li>
<li><strong>Data compression</strong> — slides 16–17: why compress, lossy vs lossless.</li>
<li><strong>Condition for data compression</strong> — slides 18–21: entropy, uniquely decodable and prefix codes, average code length.</li>
<li><strong>Huffman coding algorithm</strong> — slides 22–32.</li>
<li><strong>LZW algorithm</strong> — slides 33–35, and its decoding on slides 39–40, which this deck places after the summary.</li>
<li><strong>Run-length encoding</strong> — slide 36.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> both halves win by using what is already known — KMP reuses the part of the pattern that already matched; compressors reuse frequencies and repeated strings.</p>`,
        `<p class="y-chinh">🎯 Chín mục tiêu chia hai nhóm: tìm kiếm trong văn bản (bốn mục đầu) và nén văn bản (năm mục sau).</p>
<ol>
<li><strong>Văn bản số hoá tràn ngập (abundance of digitized text), bài toán so khớp chuỗi (string matching)</strong> — slide 3–4: vì sao cần thuật toán trên văn bản và đề bài chính xác là gì.</li>
<li><strong>Thuật toán vét cạn (brute force)</strong> — slide 5–9: cách làm hiển nhiên, O(nm).</li>
<li><strong>Thuật toán Knuth–Morris–Pratt (KMP)</strong> — slide 10–15: cách làm tuyến tính, O(n + m).</li>
<li><strong>Nén dữ liệu (data compression)</strong> — slide 16–17: vì sao nén, nén mất mát (lossy) và không mất mát (lossless).</li>
<li><strong>Điều kiện để nén (condition for data compression)</strong> — slide 18–21: entropy (lượng tin trung bình), mã giải được duy nhất (uniquely decodable), mã tiền tố (prefix code), độ dài mã trung bình.</li>
<li><strong>Thuật toán mã hoá Huffman (Huffman coding)</strong> — slide 22–32.</li>
<li><strong>Thuật toán LZW</strong> — slide 33–35, và phần giải mã (decoding) ở slide 39–40, được bộ slide đặt sau phần tóm tắt.</li>
<li><strong>Mã hoá độ dài loạt (run-length encoding — RLE)</strong> — slide 36.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> cả hai nửa đều thắng nhờ tận dụng điều đã biết — KMP dùng lại phần mẫu vừa khớp; các thuật toán nén dùng lại tần suất và các chuỗi đã gặp.</p>`],
      [3, 'Abundance of Digitized Text',
        `<p class="y-chinh">🎯 Text is wherever computers are — the web, local documents, email, social feeds — and even data that is not language, such as DNA, is processed as strings.</p>
<ul>
<li><strong>The collections on the slide</strong>: snapshots of the web (HTML and XML are mostly text plus tags), documents on your own computer, email archives, status updates on social networks, microblog feeds.</li>
<li><strong>Hundreds of languages</strong>: Java's <code>String</code> holds Unicode text, so brute force and KMP work unchanged on Vietnamese as on English (slide 32 shows where a 256-entry table needs care).</li>
<li><strong>Strings that are not language</strong>: a DNA sequence is a long string over the four letters A, C, G, T; locating a short motif in it is exactly the matching problem of slide 4.</li>
<li><strong>The data keeps growing</strong>, so the cost of the algorithm matters: the worst case of an O(nm) search, harmless on one web page, becomes enormous on a genome of billions of letters.</li>
</ul>
<table>
<thead><tr><th>Collection on the slide</th><th>Typical text-processing task</th><th>Where in this deck</th></tr></thead>
<tbody>
<tr><td>Web pages (HTML, XML)</td><td>find every occurrence of a word</td><td>pattern matching, slides 4–15</td></tr>
<tr><td>Documents, email archives</td><td>search them, then store them compactly</td><td>slides 4–15, then compression, slides 16–40</td></tr>
<tr><td>DNA sequences</td><td>locate a short motif in a very long string</td><td>brute force vs KMP, slides 5–14</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Remember:</strong> in this chapter a "text" is only an array of characters — a <code>String</code> in Java — whatever it means to a human reader.</p>`,
        `<p class="y-chinh">🎯 Máy tính ở đâu thì văn bản ở đó — web, tài liệu trên máy, thư điện tử, mạng xã hội — và cả dữ liệu không phải ngôn ngữ như DNA cũng được xử lý như chuỗi ký tự (string).</p>
<ul>
<li><strong>Các kho dữ liệu trên slide</strong>: bản lưu (snapshot) của các trang web (HTML và XML chủ yếu là chữ kèm thẻ), tài liệu trên máy của bạn, kho thư điện tử (email), trạng thái trên mạng xã hội, các dòng tin tiểu blog (microblog).</li>
<li><strong>Hàng trăm ngôn ngữ</strong>: <code>String</code> của Java chứa văn bản Unicode, nên vét cạn (brute force) và KMP chạy y nguyên trên tiếng Việt cũng như tiếng Anh (slide 32 chỉ ra chỗ một bảng 256 ô cần cẩn thận).</li>
<li><strong>Chuỗi không phải ngôn ngữ</strong>: một chuỗi DNA là chuỗi rất dài trên bốn chữ A, C, G, T; tìm một đoạn ngắn đặc trưng (motif) trong đó chính là bài toán so khớp (matching) của slide 4.</li>
<li><strong>Dữ liệu cứ tăng</strong>, nên chi phí của thuật toán rất quan trọng: trường hợp xấu nhất (worst case) của phép tìm O(nm), vô hại trên một trang web, trở nên khổng lồ trên bộ gen hàng tỉ chữ cái.</li>
</ul>
<table>
<thead><tr><th>Kho dữ liệu trên slide</th><th>Việc xử lý văn bản điển hình</th><th>Nằm ở đâu trong bộ slide</th></tr></thead>
<tbody>
<tr><td>Trang web (HTML, XML)</td><td>tìm mọi chỗ xuất hiện của một từ</td><td>so khớp mẫu, slide 4–15</td></tr>
<tr><td>Tài liệu, kho thư</td><td>tìm trong đó, rồi lưu gọn lại</td><td>slide 4–15, rồi nén, slide 16–40</td></tr>
<tr><td>Chuỗi DNA</td><td>tìm một đoạn ngắn trong chuỗi rất dài</td><td>vét cạn và KMP, slide 5–14</td></tr>
</tbody>
</table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> trong chương này "văn bản" chỉ là một mảng ký tự — một <code>String</code> trong Java — dù với người đọc nó mang nghĩa gì.</p>`],
      [4, 'The problem of String Matching',
        `<p class="y-chinh">🎯 String matching: given a text S of length n and a pattern p of length m, decide whether p occurs in S and, if it does, return the position where it starts.</p>
<ul>
<li><strong>Input</strong>: S and p, normally with m ≤ n (if m &gt; n the answer is "no" at once).</li>
<li><strong>Output</strong>: a position i such that S[i..i+m−1] = p, or a sign that there is none — Java's <code>indexOf</code> returns −1.</li>
<li><strong>Candidate positions</strong>: 0, 1, …, n − m, i.e. n − m + 1 "shifts"; in the slides' example n = 13, m = 4 → 10 shifts.</li>
<li><strong>Variants</strong>: the first occurrence (the slide's version), every occurrence, or just yes/no (<code>contains</code>).</li>
</ul>
<p>Java already solves the problem, so <code>indexOf</code> is the reference answer to test your own brute-force and KMP code against:</p>
<pre><code class="language-java">public class MatchProblem {
    public static void main(String[] args) {
        String S = "abcabaabcabac";                  // the text of slides 6-9
        String p = "abaa";                           // the pattern
        System.out.println("n = " + S.length() + ", m = " + p.length());
        System.out.println("S.indexOf(\\"abaa\\") = " + S.indexOf(p));      // first position, counted from 0
        System.out.println("S.indexOf(\\"abc\\")  = " + S.indexOf("abc"));
        System.out.println("S.indexOf(\\"abd\\")  = " + S.indexOf("abd"));  // -1 = p does not occur
        System.out.println("S.contains(\\"abaa\\") = " + S.contains(p));
        // every occurrence: search again, starting one position further
        StringBuilder all = new StringBuilder();
        for (int i = S.indexOf("ab"); i &gt;= 0; i = S.indexOf("ab", i + 1)) all.append(i).append(' ');
        System.out.println("every position of \\"ab\\": " + all.toString().trim());
    }
}</code></pre>
<div class="out">n = 13, m = 4<br>
S.indexOf("abaa") = 3<br>
S.indexOf("abc") &nbsp;= 0<br>
S.indexOf("abd") &nbsp;= -1<br>
S.contains("abaa") = true<br>
every position of "ab": 0 3 6 9</div>
<div class="pitfall">Java positions are 0-based: "abaa" starts at index 3, the 4th character. The brute-force demo numbers from 1 (slide 7) while the KMP slides number from 0 — check which convention a question uses before answering.</div>`,
        `<p class="y-chinh">🎯 So khớp chuỗi (string matching): cho văn bản S dài n và mẫu p dài m, xác định p có xuất hiện trong S không và, nếu có, trả về vị trí p bắt đầu.</p>
<ul>
<li><strong>Đầu vào (input)</strong>: S và p, thường m ≤ n (nếu m &gt; n thì trả lời "không" ngay).</li>
<li><strong>Đầu ra (output)</strong>: một vị trí i sao cho S[i..i+m−1] = p, hoặc một dấu hiệu là không có — <code>indexOf</code> của Java trả về −1.</li>
<li><strong>Các vị trí ứng viên</strong>: 0, 1, …, n − m, tức n − m + 1 "lần dịch" (shift); ở ví dụ của slide n = 13, m = 4 → 10 lần dịch.</li>
<li><strong>Các biến thể</strong>: lần xuất hiện đầu tiên (bản của slide), mọi lần xuất hiện, hoặc chỉ có/không (<code>contains</code>).</li>
</ul>
<p>Java đã giải sẵn bài toán này, nên <code>indexOf</code> là đáp án chuẩn để kiểm code vét cạn (brute force) và KMP do bạn tự viết:</p>
<pre><code class="language-java">public class MatchProblem {
    public static void main(String[] args) {
        String S = "abcabaabcabac";                  // văn bản của slide 6-9
        String p = "abaa";                           // mẫu cần tìm
        System.out.println("n = " + S.length() + ", m = " + p.length());
        System.out.println("S.indexOf(\\"abaa\\") = " + S.indexOf(p));      // vị trí đầu tiên, đếm từ 0
        System.out.println("S.indexOf(\\"abc\\")  = " + S.indexOf("abc"));
        System.out.println("S.indexOf(\\"abd\\")  = " + S.indexOf("abd"));  // -1 = p không xuất hiện
        System.out.println("S.contains(\\"abaa\\") = " + S.contains(p));
        // mọi lần xuất hiện: tìm lại, bắt đầu xa hơn một vị trí
        StringBuilder all = new StringBuilder();
        for (int i = S.indexOf("ab"); i &gt;= 0; i = S.indexOf("ab", i + 1)) all.append(i).append(' ');
        System.out.println("every position of \\"ab\\": " + all.toString().trim());
    }
}</code></pre>
<div class="out">n = 13, m = 4<br>
S.indexOf("abaa") = 3<br>
S.indexOf("abc") &nbsp;= 0<br>
S.indexOf("abd") &nbsp;= -1<br>
S.contains("abaa") = true<br>
every position of "ab": 0 3 6 9</div>
<div class="pitfall">Vị trí trong Java đếm từ 0: "abaa" bắt đầu ở chỉ số (index) 3, tức ký tự thứ 4. Phần minh hoạ vét cạn đánh số từ 1 (slide 7) còn các slide KMP đánh số từ 0 — xem kỹ đề dùng cách đếm nào trước khi trả lời.</div>`],
      [5, 'Brute-Force algorithm',
        `<p class="y-chinh">🎯 Brute force tries every shift: compare p with S character by character from the left, and at the first mismatch shift p one position to the right and start again from p's first character.</p>
<ol>
<li>Place p under S at shift i = 0.</li>
<li>Compare p[j] with S[i + j] for j = 0, 1, …, as long as they are equal.</li>
<li>All m characters equal → return i.</li>
<li>A mismatch → i = i + 1, j = 0; when i passes n − m, return −1.</li>
</ol>
<pre><code class="language-java">public class BruteForce {
    static int comparisons = 0;                      // how many character comparisons

    // First position of p in S, or -1
    static int bruteForce(String S, String p) {
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {           // i = where p starts (the shift)
            int j = 0;
            while (j &lt; m) {
                comparisons++;
                if (S.charAt(i + j) != p.charAt(j)) break;   // mismatch: try the next shift
                j++;
            }
            if (j == m) return i;                    // all m characters matched
        }
        return -1;
    }

    public static void main(String[] args) {
        String S = "abcabaabcabac";
        String[] patterns = {"abaa", "abc", "cc"};
        for (String p : patterns) {
            comparisons = 0;
            int pos = bruteForce(S, p);
            System.out.println("p = " + p + ": position " + pos + ", " + comparisons + " comparisons");
        }
    }
}</code></pre>
<div class="out">p = abaa: position 3, 9 comparisons<br>
p = abc: position 0, 3 comparisons<br>
p = cc: position -1, 14 comparisons</div>
<p>Reading the output: "abaa" needs 9 comparisons (traced on slides 6–9); "abc" matches at shift 0 with 3; "cc" never occurs, so all 12 shifts are tried — 14 comparisons.</p>
<p><strong>Big-O:</strong> at most n − m + 1 shifts × at most m comparisons each = (n − m + 1)·m → O(nm) in the worst case, the figure on the slide. Extra memory: O(1).</p>
<div class="pitfall">The outer loop is <code>i &lt;= n - m</code>. Writing <code>i &lt; n - m</code> skips the last shift, so a match at the very end is never found; writing <code>i &lt; n</code> makes <code>S.charAt(i + j)</code> run past the end → <code>StringIndexOutOfBoundsException</code>.</div>`,
        `<p class="y-chinh">🎯 Vét cạn (brute force) thử mọi lần dịch: so p với S từng ký tự từ trái sang, gặp sai khớp (mismatch) đầu tiên thì dịch p sang phải một vị trí và so lại từ ký tự đầu của p.</p>
<ol>
<li>Đặt p dưới S ở lần dịch (shift) i = 0.</li>
<li>So p[j] với S[i + j] với j = 0, 1, …, chừng nào còn bằng nhau.</li>
<li>Đủ m ký tự bằng nhau → trả về i.</li>
<li>Sai khớp → i = i + 1, j = 0; khi i vượt quá n − m thì trả về −1.</li>
</ol>
<pre><code class="language-java">public class BruteForce {
    static int comparisons = 0;                      // đếm số lần so sánh ký tự

    // Vị trí đầu tiên của p trong S, hoặc -1
    static int bruteForce(String S, String p) {
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {           // i = chỗ p bắt đầu (lần dịch)
            int j = 0;
            while (j &lt; m) {
                comparisons++;
                if (S.charAt(i + j) != p.charAt(j)) break;   // sai khớp: thử lần dịch kế
                j++;
            }
            if (j == m) return i;                    // khớp đủ m ký tự
        }
        return -1;
    }

    public static void main(String[] args) {
        String S = "abcabaabcabac";
        String[] patterns = {"abaa", "abc", "cc"};
        for (String p : patterns) {
            comparisons = 0;
            int pos = bruteForce(S, p);
            System.out.println("p = " + p + ": position " + pos + ", " + comparisons + " comparisons");
        }
    }
}</code></pre>
<div class="out">p = abaa: position 3, 9 comparisons<br>
p = abc: position 0, 3 comparisons<br>
p = cc: position -1, 14 comparisons</div>
<p>Đọc kết quả in ra: "abaa" cần 9 phép so sánh (lần theo ở slide 6–9); "abc" khớp ngay lần dịch 0 với 3 phép; "cc" không xuất hiện nên phải thử đủ 12 lần dịch — 14 phép so sánh.</p>
<p><strong>Big-O:</strong> nhiều nhất n − m + 1 lần dịch × nhiều nhất m phép so sánh mỗi lần = (n − m + 1)·m → O(nm) trong trường hợp xấu nhất (worst case), đúng con số trên slide. Bộ nhớ thêm: O(1).</p>
<div class="pitfall">Vòng ngoài là <code>i &lt;= n - m</code>. Viết <code>i &lt; n - m</code> là bỏ sót lần dịch cuối, nên chỗ khớp nằm sát cuối văn bản không bao giờ được tìm thấy; viết <code>i &lt; n</code> thì <code>S.charAt(i + j)</code> chạy quá cuối chuỗi → <code>StringIndexOutOfBoundsException</code>.</div>`],
      [6, 'Brute-Force algorithm demo - 1',
        `<p class="y-chinh">🎯 The demo's data: the text S = a b c a b a a b c a b a c (n = 13) and the pattern p = a b a a (m = 4).</p>
<p>Here it is with both numberings, because the slides use both — 1-based in the steps of slides 7–8, 0-based in the explanation of slide 9:</p>
<pre><code class="language-plaintext">0-based index   0  1  2  3  4  5  6  7  8  9 10 11 12
S               a  b  c  a  b  a  a  b  c  a  b  a  c
1-based index   1  2  3  4  5  6  7  8  9 10 11 12 13

p               a  b  a  a        (0-based 0..3, 1-based 1..4)</code></pre>
<ul>
<li>p may start at 0-based positions 0 … 9: n − m + 1 = 10 shifts at most.</li>
<li>p occurs exactly once, at 0-based position 3 (S[3..6] = a b a a) — the 4th character when counting from 1.</li>
<li>Guess before reading on: how many shifts will brute force try? (Slide 9: four — shifts 0, 1, 2 and 3.)</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> 0-based position = 1-based position − 1. Java, and every PE, counts from 0.</p>`,
        `<p class="y-chinh">🎯 Dữ liệu của phần minh hoạ: văn bản S = a b c a b a a b c a b a c (n = 13) và mẫu p = a b a a (m = 4).</p>
<p>Viết lại với cả hai cách đánh số, vì slide dùng cả hai — đếm từ 1 ở các bước của slide 7–8, đếm từ 0 ở phần giải thích của slide 9:</p>
<pre><code class="language-plaintext">chỉ số từ 0     0  1  2  3  4  5  6  7  8  9 10 11 12
S               a  b  c  a  b  a  a  b  c  a  b  a  c
chỉ số từ 1     1  2  3  4  5  6  7  8  9 10 11 12 13

p               a  b  a  a        (từ 0: 0..3, từ 1: 1..4)</code></pre>
<ul>
<li>p có thể bắt đầu ở các vị trí 0 … 9 (đếm từ 0): nhiều nhất n − m + 1 = 10 lần dịch (shift).</li>
<li>p xuất hiện đúng một lần, ở vị trí 3 khi đếm từ 0 (S[3..6] = a b a a) — tức ký tự thứ 4 khi đếm từ 1.</li>
<li>Đoán trước khi đọc tiếp: vét cạn (brute force) sẽ thử bao nhiêu lần dịch? (Slide 9: bốn — lần dịch 0, 1, 2 và 3.)</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vị trí đếm từ 0 = vị trí đếm từ 1 − 1. Java, và mọi đề thi thực hành (PE), đều đếm từ 0.</p>`],
      [7, 'Brute-Force algorithm demo - 2',
        `<p class="y-chinh">🎯 Steps 1 and 2 at the first shift: p[1] = a equals S[1] = a, then p[2] = b equals S[2] = b — both match, so the comparison moves on to the next character.</p>
<p>The slide counts from 1 here. The same steps in Java's 0-based indices:</p>
<table>
<thead><tr><th>Step on the slide</th><th>Slide's notation (1-based)</th><th>Java (0-based)</th><th>Characters</th><th>Result</th></tr></thead>
<tbody>
<tr><td>1</td><td>p[1] vs S[1]</td><td><code>p.charAt(0)</code> vs <code>S.charAt(0)</code></td><td>a vs a</td><td>equal → go on</td></tr>
<tr><td>2</td><td>p[2] vs S[2]</td><td><code>p.charAt(1)</code> vs <code>S.charAt(1)</code></td><td>b vs b</td><td>equal → go on</td></tr>
<tr><td>3 (slide 8)</td><td>p[3] vs S[3]</td><td><code>p.charAt(2)</code> vs <code>S.charAt(2)</code></td><td>a vs c</td><td>mismatch</td></tr>
</tbody>
</table>
<ul>
<li>At one shift the comparisons go left to right and stop at the first mismatch — the rest of p is not examined.</li>
<li>Each "step" of the demo is one character comparison, the unit counted when we say O(nm).</li>
<li>After step 2, two characters of p are known to agree with S. Brute force throws this knowledge away on slide 8; KMP (slide 10) keeps it.</li>
</ul>
<div class="pitfall">Copying the slide's 1-based "p[1] with S[1]" straight into <code>p.charAt(1)</code> compares the <em>second</em> characters. Subtract 1 from every index of this demo before you code it.</div>`,
        `<p class="y-chinh">🎯 Bước 1 và 2 ở lần dịch đầu tiên: p[1] = a bằng S[1] = a, rồi p[2] = b bằng S[2] = b — cả hai đều khớp nên việc so sánh đi tiếp sang ký tự kế.</p>
<p>Ở đây slide đếm từ 1. Cũng các bước đó, viết theo chỉ số đếm từ 0 của Java:</p>
<table>
<thead><tr><th>Bước trên slide</th><th>Ký hiệu của slide (đếm từ 1)</th><th>Java (đếm từ 0)</th><th>Ký tự</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>1</td><td>p[1] với S[1]</td><td><code>p.charAt(0)</code> với <code>S.charAt(0)</code></td><td>a với a</td><td>bằng → đi tiếp</td></tr>
<tr><td>2</td><td>p[2] với S[2]</td><td><code>p.charAt(1)</code> với <code>S.charAt(1)</code></td><td>b với b</td><td>bằng → đi tiếp</td></tr>
<tr><td>3 (slide 8)</td><td>p[3] với S[3]</td><td><code>p.charAt(2)</code> với <code>S.charAt(2)</code></td><td>a với c</td><td>sai khớp</td></tr>
</tbody>
</table>
<ul>
<li>Trong một lần dịch (shift), phép so sánh đi từ trái sang phải và dừng ở chỗ sai khớp (mismatch) đầu tiên — phần còn lại của p không được xét.</li>
<li>Mỗi "bước" của phần minh hoạ là một phép so sánh ký tự, đúng đơn vị được đếm khi nói O(nm).</li>
<li>Sau bước 2, ta đã biết hai ký tự của p trùng với S. Vét cạn (brute force) vứt bỏ hiểu biết này ở slide 8; KMP (slide 10) thì giữ lại.</li>
</ul>
<div class="pitfall">Chép thẳng "p[1] với S[1]" (đếm từ 1) của slide thành <code>p.charAt(1)</code> là đang so hai ký tự <em>thứ hai</em>. Hãy trừ 1 ở mọi chỉ số của phần minh hoạ này trước khi viết code.</div>`],
      [8, 'Brute-Force algorithm demo - 3',
        `<p class="y-chinh">🎯 Step 3 fails — p[3] = a but S[3] = c (1-based) — so p is shifted one position to the right and the comparisons restart from its first character.</p>
<pre><code class="language-java">public class BruteForceTrace {
    static String spaces(int k) {
        StringBuilder b = new StringBuilder();
        while (k-- &gt; 0) b.append(' ');
        return b.toString();
    }

    public static void main(String[] args) {
        String S = "abcabaabcabac", p = "abaa";
        int n = S.length(), m = p.length(), total = 0;
        System.out.println("S        " + S);
        for (int i = 0; i &lt;= n - m; i++) {           // p placed under S starting at i
            int j = 0;
            while (j &lt; m &amp;&amp; S.charAt(i + j) == p.charAt(j)) j++;
            int cmp = (j == m) ? m : j + 1;          // j matches + the failed one
            total += cmp;
            String line = "shift " + i + "  " + spaces(i) + p + spaces(n - m - i) + "  ";
            if (j == m) {
                System.out.println(line + "match at " + i + " (" + cmp + " comparisons)");
                break;
            }
            System.out.println(line + "S[" + (i + j) + "]=" + S.charAt(i + j) + " != p[" + j + "]=" + p.charAt(j)
                    + " (" + cmp + (cmp == 1 ? " comparison)" : " comparisons)"));
        }
        System.out.println("total comparisons = " + total);
    }
}</code></pre>
<div class="out">S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;abcabaabcabac<br>
shift 0 &nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S[2]=c != p[2]=a (3 comparisons)<br>
shift 1 &nbsp;&nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S[1]=b != p[0]=a (1 comparison)<br>
shift 2 &nbsp;&nbsp;&nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S[2]=c != p[0]=a (1 comparison)<br>
shift 3 &nbsp;&nbsp;&nbsp;&nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match at 3 (4 comparisons)<br>
total comparisons = 9</div>
<ul>
<li>Each line puts p under S at one shift; the note gives the first mismatch in 0-based indices.</li>
<li>Shift 0 costs 3 comparisons: two matches plus the failed one.</li>
<li>Shifts 1 and 2 fail on their very first character, because S[1] = b and S[2] = c are not a.</li>
<li>After every shift the work restarts at p[0] — this restart is the whole of brute force, and its weakness.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> brute force = "move one step, start over", like checking every starting letter of a page for a word.</p>
<div class="pitfall">The slide's text says "shift p one position to the <em>left</em>" and, one line later, "to the right". "Left" is a slip: brute force only ever moves p to the <strong>right</strong> (shift i → i + 1). An FE option claiming the pattern moves left is false.</div>`,
        `<p class="y-chinh">🎯 Bước 3 sai khớp — p[3] = a nhưng S[3] = c (đếm từ 1) — nên p được dịch sang phải một vị trí và việc so sánh làm lại từ ký tự đầu của p.</p>
<pre><code class="language-java">public class BruteForceTrace {
    static String spaces(int k) {
        StringBuilder b = new StringBuilder();
        while (k-- &gt; 0) b.append(' ');
        return b.toString();
    }

    public static void main(String[] args) {
        String S = "abcabaabcabac", p = "abaa";
        int n = S.length(), m = p.length(), total = 0;
        System.out.println("S        " + S);
        for (int i = 0; i &lt;= n - m; i++) {           // đặt p dưới S, bắt đầu tại i
            int j = 0;
            while (j &lt; m &amp;&amp; S.charAt(i + j) == p.charAt(j)) j++;
            int cmp = (j == m) ? m : j + 1;          // j lần khớp + 1 lần sai
            total += cmp;
            String line = "shift " + i + "  " + spaces(i) + p + spaces(n - m - i) + "  ";
            if (j == m) {
                System.out.println(line + "match at " + i + " (" + cmp + " comparisons)");
                break;
            }
            System.out.println(line + "S[" + (i + j) + "]=" + S.charAt(i + j) + " != p[" + j + "]=" + p.charAt(j)
                    + " (" + cmp + (cmp == 1 ? " comparison)" : " comparisons)"));
        }
        System.out.println("total comparisons = " + total);
    }
}</code></pre>
<div class="out">S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;abcabaabcabac<br>
shift 0 &nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S[2]=c != p[2]=a (3 comparisons)<br>
shift 1 &nbsp;&nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S[1]=b != p[0]=a (1 comparison)<br>
shift 2 &nbsp;&nbsp;&nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;S[2]=c != p[0]=a (1 comparison)<br>
shift 3 &nbsp;&nbsp;&nbsp;&nbsp;abaa &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;match at 3 (4 comparisons)<br>
total comparisons = 9</div>
<ul>
<li>Mỗi dòng đặt p dưới S ở một lần dịch (shift); phần ghi chú cho biết chỗ sai khớp (mismatch) đầu tiên, theo chỉ số đếm từ 0.</li>
<li>Lần dịch 0 tốn 3 phép so sánh: hai lần khớp cộng một lần hỏng.</li>
<li>Lần dịch 1 và 2 hỏng ngay ký tự đầu, vì S[1] = b và S[2] = c đều không phải a.</li>
<li>Sau mỗi lần dịch, công việc làm lại từ p[0] — chính việc làm lại này là toàn bộ thuật toán vét cạn (brute force), và cũng là điểm yếu của nó.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vét cạn = "nhích một bước, làm lại từ đầu", giống dò một từ bằng cách thử lần lượt từng chữ cái làm điểm bắt đầu.</p>
<div class="pitfall">Chữ trên slide viết "shift p one position to the <em>left</em>" (dịch p sang trái) rồi một dòng sau lại viết "to the right" (sang phải). "Sang trái" là viết nhầm: vét cạn chỉ dịch p sang <strong>phải</strong> (lần dịch i → i + 1). Phương án trong đề thi cuối kỳ (FE) nói mẫu dịch sang trái là SAI.</div>`],
      [9, 'Brute-Force algorithm demo - 4',
        `<p class="y-chinh">🎯 After three shifts p matches (0-based position 3), but the slide's real point is the drawback: brute force compares the same text characters again and again, which costs O(mn) in the worst case.</p>
<ul>
<li><strong>The match</strong>: "a match would be found after shifting p three times to the right" — shifts 1, 2, 3, so p starts at S[3]; 9 comparisons in total (slide 8's output).</li>
<li><strong>The repeated work</strong>: at shift 1 the first comparison is p[0] = a with S[1] = b (the slide switches to 0-based here), yet S[1] was already compared in step 2 — brute force forgot it.</li>
<li><strong>The worst case</strong>: S = aa…ab and p = aa…ab. At every shift m − 1 characters match before the last one fails, so each shift costs the full m comparisons:</li>
</ul>
<pre><code class="language-java">public class BruteWorstCase {
    static long comparisons;

    static int bruteForce(String S, String p) {
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {
            int j = 0;
            while (j &lt; m) {
                comparisons++;
                if (S.charAt(i + j) != p.charAt(j)) break;
                j++;
            }
            if (j == m) return i;
        }
        return -1;
    }

    static String aaab(int len) {                    // (len-1) letters 'a' then one 'b'
        StringBuilder b = new StringBuilder();
        for (int i = 1; i &lt; len; i++) b.append('a');
        return b.append('b').toString();
    }

    public static void main(String[] args) {
        int[][] cases = {{1000, 5}, {2000, 5}, {1000, 10}, {2000, 10}};
        for (int[] c : cases) {
            int n = c[0], m = c[1];
            comparisons = 0;
            int pos = bruteForce(aaab(n), aaab(m));  // S = aa...ab, p = aa...ab
            System.out.println("n=" + n + " m=" + m + ": found at " + pos + ", comparisons = " + comparisons
                    + ", (n-m+1)*m = " + (long) (n - m + 1) * m);
        }
    }
}</code></pre>
<div class="out">n=1000 m=5: found at 995, comparisons = 4980, (n-m+1)*m = 4980<br>
n=2000 m=5: found at 1995, comparisons = 9980, (n-m+1)*m = 9980<br>
n=1000 m=10: found at 990, comparisons = 9910, (n-m+1)*m = 9910<br>
n=2000 m=10: found at 1990, comparisons = 19910, (n-m+1)*m = 19910</div>
<p><strong>Big-O, counted:</strong> doubling n about doubles the count, and doubling m about doubles it too — it is exactly (n − m + 1)·m, which is O(nm). The slide calls it "certainly a very slow running algorithm".</p>
<p class="meo">🧠 <strong>Remember:</strong> brute force forgets what it has seen; KMP remembers.</p>
<div class="pitfall">"Brute-force matching is O(n + m)" is a classic wrong FE option — that is KMP. Brute force is O(nm) in the worst case, even though on ordinary text a mismatch usually comes early and it runs fast enough.</div>`,
        `<p class="y-chinh">🎯 Sau ba lần dịch thì p khớp (vị trí 3, đếm từ 0), nhưng ý chính của slide là nhược điểm: vét cạn (brute force) so đi so lại cùng những ký tự của văn bản, nên tốn O(mn) trong trường hợp xấu nhất (worst case).</p>
<ul>
<li><strong>Chỗ khớp (match)</strong>: "a match would be found after shifting p three times to the right" (sẽ tìm thấy chỗ khớp sau khi dịch p sang phải ba lần) — dịch 1, 2, 3 lần, nên p bắt đầu tại S[3]; tổng cộng 9 phép so sánh (kết quả in ra ở slide 8).</li>
<li><strong>Việc bị làm lại</strong>: ở lần dịch (shift) 1, phép so sánh đầu tiên là p[0] = a với S[1] = b (tới đây slide chuyển sang đếm từ 0), trong khi S[1] đã được so ở bước 2 — vét cạn đã quên mất điều đó.</li>
<li><strong>Trường hợp xấu nhất</strong>: S = aa…ab và p = aa…ab. Ở mọi lần dịch, m − 1 ký tự khớp rồi ký tự cuối mới hỏng, nên lần dịch nào cũng tốn đủ m phép so sánh:</li>
</ul>
<pre><code class="language-java">public class BruteWorstCase {
    static long comparisons;

    static int bruteForce(String S, String p) {
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {
            int j = 0;
            while (j &lt; m) {
                comparisons++;
                if (S.charAt(i + j) != p.charAt(j)) break;
                j++;
            }
            if (j == m) return i;
        }
        return -1;
    }

    static String aaab(int len) {                    // (len-1) chữ 'a' rồi một chữ 'b'
        StringBuilder b = new StringBuilder();
        for (int i = 1; i &lt; len; i++) b.append('a');
        return b.append('b').toString();
    }

    public static void main(String[] args) {
        int[][] cases = {{1000, 5}, {2000, 5}, {1000, 10}, {2000, 10}};
        for (int[] c : cases) {
            int n = c[0], m = c[1];
            comparisons = 0;
            int pos = bruteForce(aaab(n), aaab(m));  // S = aa...ab, p = aa...ab
            System.out.println("n=" + n + " m=" + m + ": found at " + pos + ", comparisons = " + comparisons
                    + ", (n-m+1)*m = " + (long) (n - m + 1) * m);
        }
    }
}</code></pre>
<div class="out">n=1000 m=5: found at 995, comparisons = 4980, (n-m+1)*m = 4980<br>
n=2000 m=5: found at 1995, comparisons = 9980, (n-m+1)*m = 9980<br>
n=1000 m=10: found at 990, comparisons = 9910, (n-m+1)*m = 9910<br>
n=2000 m=10: found at 1990, comparisons = 19910, (n-m+1)*m = 19910</div>
<p><strong>Big-O, đếm bằng số:</strong> tăng gấp đôi n thì số phép so sánh xấp xỉ gấp đôi, tăng gấp đôi m cũng xấp xỉ gấp đôi — con số đúng bằng (n − m + 1)·m, tức O(nm). Slide gọi đây là "chắc chắn là một thuật toán chạy rất chậm".</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> vét cạn quên những gì đã thấy; KMP thì nhớ.</p>
<div class="pitfall">"So khớp vét cạn là O(n + m)" là phương án sai kinh điển trong đề thi cuối kỳ (FE) — đó là KMP. Vét cạn là O(nm) trong trường hợp xấu nhất, dù trên văn bản bình thường chỗ sai khớp (mismatch) thường đến sớm nên nó vẫn chạy đủ nhanh.</div>`],
      [10, 'The Knuth-Morris-Pratt (KMP) Algorithm - 1',
        `<p class="y-chinh">🎯 Knuth, Morris and Pratt found a linear-time matcher, O(n + m): the position in the text S never moves backwards.</p>
<ul>
<li><strong>The idea</strong>: when a mismatch comes after k matched characters, those k text characters are already known — they equal p[0..k−1] — so KMP uses them instead of reading them again.</li>
<li><strong>"Backtracking on S never occurs"</strong>: brute force jumps back from S[i + k] to S[i + 1]; KMP keeps its place in the text and moves only the pattern.</li>
<li><strong>Read the slide precisely</strong>: the character where the mismatch happened may be compared again, with an earlier position of p (slide 14 shows it) — but the position never decreases, so the total stays ≤ 2n.</li>
<li><strong>Cost</strong>: O(m) once, to preprocess p into the table T[] (slides 13–15), plus O(n) to scan S → O(n + m).</li>
</ul>
<pre><code class="language-java">public class BfVsKmp {
    static long bf, kmp;                             // comparison counters

    static int bruteForce(String S, String p) {
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {           // after a mismatch the text position goes BACK to i+1
            int j = 0;
            while (j &lt; m) {
                bf++;
                if (S.charAt(i + j) != p.charAt(j)) break;
                j++;
            }
            if (j == m) return i;
        }
        return -1;
    }

    static int[] buildT(String p) {                  // T[] of slides 13-15
        int[] T = new int[p.length()];
        T[0] = -1;
        for (int j = 1; j &lt; p.length(); j++) {
            int k = T[j - 1];
            while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k];
            T[j] = k + 1;
        }
        return T;
    }

    static int kmpSearch(String S, String p) {
        int[] T = buildT(p);
        int i = 0, k = 0;                            // i walks the text and never decreases
        while (i &lt; S.length()) {
            kmp++;
            if (S.charAt(i) == p.charAt(k)) {
                i++; k++;
                if (k == p.length()) return i - k;
            } else {
                k = T[k];                            // slide the pattern, keep i
                if (k &lt; 0) { i++; k = 0; }
            }
        }
        return -1;
    }

    static String aaab(int len) {
        StringBuilder b = new StringBuilder();
        for (int i = 1; i &lt; len; i++) b.append('a');
        return b.append('b').toString();
    }

    public static void main(String[] args) {
        int[][] cases = {{1000, 10}, {10000, 10}, {10000, 100}};
        for (int[] c : cases) {
            String S = aaab(c[0]), p = aaab(c[1]);
            bf = 0; kmp = 0;
            int x = bruteForce(S, p), y = kmpSearch(S, p);
            System.out.println("n=" + c[0] + " m=" + c[1] + ": brute force " + bf + " comparisons, KMP " + kmp
                    + " (2n = " + 2 * c[0] + "), same answer: " + (x == y));
        }
    }
}</code></pre>
<div class="out">n=1000 m=10: brute force 9910 comparisons, KMP 1990 (2n = 2000), same answer: true<br>
n=10000 m=10: brute force 99910 comparisons, KMP 19990 (2n = 20000), same answer: true<br>
n=10000 m=100: brute force 990100 comparisons, KMP 19900 (2n = 20000), same answer: true</div>
<p>On the lesson's worst case from slide 9 (S = aa…ab, p = aa…ab), brute force grows with n·m while KMP stays just under 2n whatever m is — with m = 100 it does about 50 times less work, and both find the same position.</p>
<p class="meo">🧠 <strong>Remember:</strong> three names, three letters, one promise — linear time, O(n + m).</p>`,
        `<p class="y-chinh">🎯 Knuth, Morris và Pratt tìm ra một thuật toán so khớp chạy trong thời gian tuyến tính, O(n + m): vị trí đang xét trên văn bản S không bao giờ lùi lại.</p>
<ul>
<li><strong>Ý tưởng</strong>: khi sai khớp (mismatch) xảy ra sau k ký tự đã khớp, thì k ký tự đó của văn bản đã biết rồi — chúng bằng p[0..k−1] — nên KMP dùng luôn thay vì đọc lại.</li>
<li><strong>"Không bao giờ quay lui (backtracking) trên S"</strong>: vét cạn (brute force) nhảy ngược từ S[i + k] về S[i + 1]; KMP giữ nguyên chỗ đang đứng trên văn bản và chỉ dịch mẫu.</li>
<li><strong>Đọc slide cho chính xác</strong>: ký tự vừa sai khớp có thể được so thêm lần nữa, với một vị trí sớm hơn của p (slide 14 sẽ thấy) — nhưng vị trí trên văn bản không bao giờ giảm, nên tổng số lần so vẫn ≤ 2n.</li>
<li><strong>Chi phí</strong>: O(m) một lần để tiền xử lý (preprocess) p thành bảng T[] (slide 13–15), cộng O(n) để quét S → O(n + m).</li>
</ul>
<pre><code class="language-java">public class BfVsKmp {
    static long bf, kmp;                             // bộ đếm số lần so sánh

    static int bruteForce(String S, String p) {
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {           // sau khi sai khớp, vị trí trên văn bản LÙI về i+1
            int j = 0;
            while (j &lt; m) {
                bf++;
                if (S.charAt(i + j) != p.charAt(j)) break;
                j++;
            }
            if (j == m) return i;
        }
        return -1;
    }

    static int[] buildT(String p) {                  // bảng T[] của slide 13-15
        int[] T = new int[p.length()];
        T[0] = -1;
        for (int j = 1; j &lt; p.length(); j++) {
            int k = T[j - 1];
            while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k];
            T[j] = k + 1;
        }
        return T;
    }

    static int kmpSearch(String S, String p) {
        int[] T = buildT(p);
        int i = 0, k = 0;                            // i chạy trên văn bản và không bao giờ giảm
        while (i &lt; S.length()) {
            kmp++;
            if (S.charAt(i) == p.charAt(k)) {
                i++; k++;
                if (k == p.length()) return i - k;
            } else {
                k = T[k];                            // trượt mẫu, giữ nguyên i
                if (k &lt; 0) { i++; k = 0; }
            }
        }
        return -1;
    }

    static String aaab(int len) {
        StringBuilder b = new StringBuilder();
        for (int i = 1; i &lt; len; i++) b.append('a');
        return b.append('b').toString();
    }

    public static void main(String[] args) {
        int[][] cases = {{1000, 10}, {10000, 10}, {10000, 100}};
        for (int[] c : cases) {
            String S = aaab(c[0]), p = aaab(c[1]);
            bf = 0; kmp = 0;
            int x = bruteForce(S, p), y = kmpSearch(S, p);
            System.out.println("n=" + c[0] + " m=" + c[1] + ": brute force " + bf + " comparisons, KMP " + kmp
                    + " (2n = " + 2 * c[0] + "), same answer: " + (x == y));
        }
    }
}</code></pre>
<div class="out">n=1000 m=10: brute force 9910 comparisons, KMP 1990 (2n = 2000), same answer: true<br>
n=10000 m=10: brute force 99910 comparisons, KMP 19990 (2n = 20000), same answer: true<br>
n=10000 m=100: brute force 990100 comparisons, KMP 19900 (2n = 20000), same answer: true</div>
<p>Trên trường hợp xấu nhất mà bài dựng ở slide 9 (S = aa…ab, p = aa…ab), vét cạn tăng theo n·m còn KMP luôn dưới 2n dù m là bao nhiêu — với m = 100, KMP làm ít hơn khoảng 50 lần, và hai thuật toán tìm ra cùng một vị trí.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ba cái tên, ba chữ cái, một lời hứa — thời gian tuyến tính, O(n + m).</p>`],
      [11, 'The Knuth-Morris-Pratt Algorithm - 2',
        `<p class="y-chinh">🎯 The running example — text a = 1010001010110 (n = 13), pattern p = 101011 (m = 6): like brute force, KMP considers shifts 0 … n − m, but it skips the shifts that cannot match.</p>
<p>The lesson's drawing, with p at shift 0 and at the shift where it matches:</p>
<pre><code class="language-plaintext">i      0 1 2 3 4 5 6 7 8 9 10 11 12
a      1 0 1 0 0 0 1 0 1 0 1  1  0
p      1 0 1 0 1 1                     shift r = 0: fails at i = 4
p                  1 0 1 0 1  1        shift r = 6: the match</code></pre>
<ul>
<li>The shifts are r = 0 … n − m = 0 … 7, eight candidates; p occurs once, at r = 6.</li>
<li>"Information gleaned from partial matches": at r = 0 the first four characters matched, and that alone proves r = 1 and r = 3 hopeless (they would need a 1 where the text is known to hold p[1] = 0 and p[3] = 0).</li>
<li>The program runs both algorithms on this example and records, shift by shift, how many comparisons each one spends:</li>
</ul>
<pre><code class="language-java">public class KmpShifts {
    public static void main(String[] args) {
        String a = "1010001010110", p = "101011";    // text and pattern of slide 11
        int n = a.length(), m = p.length();
        int[] T = {-1, 0, 0, 1, 2, 3};               // next(j) of p (slides 13-15)
        int[] kmpCmp = new int[n], kmpFrom = new int[n];
        java.util.Arrays.fill(kmpFrom, -1);
        int i = 0, k = 0, found = -1;
        while (i &lt; n &amp;&amp; found &lt; 0) {                 // KMP, recording each comparison under its shift r
            int r = i - k;
            if (kmpFrom[r] &lt; 0) kmpFrom[r] = k;
            kmpCmp[r]++;
            if (a.charAt(i) == p.charAt(k)) {
                i++; k++;
                if (k == m) found = i - m;
            } else {
                k = T[k];
                if (k &lt; 0) { i++; k = 0; }
            }
        }
        System.out.println("r  brute force               KMP");
        int bfTotal = 0, kmpTotal = 0;
        for (int r = 0; r &lt;= found; r++) {
            int j = 0;
            while (j &lt; m &amp;&amp; a.charAt(r + j) == p.charAt(j)) j++;
            int bf = (j == m) ? m : j + 1;
            bfTotal += bf;
            kmpTotal += kmpCmp[r];
            String left = bf + " cmp, " + (j == m ? "MATCH" : "fails at j=" + j);
            String right = kmpFrom[r] &lt; 0 ? "skipped" : kmpCmp[r] + " cmp from j=" + kmpFrom[r] + (r == found ? ", MATCH" : "");
            System.out.println(r + "  " + String.format("%-24s", left) + "  " + right);
        }
        System.out.println("total: brute force " + bfTotal + " comparisons, KMP " + kmpTotal);
    }
}</code></pre>
<div class="out">r &nbsp;brute force &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KMP<br>
0 &nbsp;5 cmp, fails at j=4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 cmp from j=0<br>
1 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skipped<br>
2 &nbsp;3 cmp, fails at j=2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 cmp from j=2<br>
3 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skipped<br>
4 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 cmp from j=0<br>
5 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 cmp from j=0<br>
6 &nbsp;6 cmp, MATCH &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 cmp from j=0, MATCH<br>
total: brute force 18 comparisons, KMP 14</div>
<p>KMP never visits shifts 1 and 3, and at shift 2 it starts at j = 2 because p[0..1] is known to match already: 14 comparisons instead of 18 — small on 13 characters, but on long texts this is the whole difference between O(nm) and O(n + m).</p>
<div class="pitfall">There are n − m + 1 = 8 shifts, not n = 13: at a shift r &gt; 7 the end of p would hang past the end of the text.</div>`,
        `<p class="y-chinh">🎯 Ví dụ xuyên suốt — văn bản a = 1010001010110 (n = 13), mẫu p = 101011 (m = 6): giống vét cạn, KMP xét các lần dịch 0 … n − m, nhưng bỏ qua những lần dịch chắc chắn không khớp.</p>
<p>Hình vẽ của bài, với p ở lần dịch 0 và ở lần dịch khớp:</p>
<pre><code class="language-plaintext">i      0 1 2 3 4 5 6 7 8 9 10 11 12
a      1 0 1 0 0 0 1 0 1 0 1  1  0
p      1 0 1 0 1 1                     lần dịch r = 0: hỏng tại i = 4
p                  1 0 1 0 1  1        lần dịch r = 6: khớp</code></pre>
<ul>
<li>Các lần dịch (shift) là r = 0 … n − m = 0 … 7, tám ứng viên; p xuất hiện một lần, tại r = 6.</li>
<li>"Thông tin thu được từ các lần khớp một phần (partial match)": ở r = 0 bốn ký tự đầu đã khớp, và riêng điều đó đã chứng minh r = 1 và r = 3 vô vọng (chúng cần số 1 ở chỗ văn bản đã biết là p[1] = 0 và p[3] = 0).</li>
<li>Chương trình dưới chạy cả hai thuật toán trên ví dụ này và ghi lại, theo từng lần dịch, mỗi bên tốn bao nhiêu phép so sánh:</li>
</ul>
<pre><code class="language-java">public class KmpShifts {
    public static void main(String[] args) {
        String a = "1010001010110", p = "101011";    // văn bản và mẫu của slide 11
        int n = a.length(), m = p.length();
        int[] T = {-1, 0, 0, 1, 2, 3};               // next(j) của p (slide 13-15)
        int[] kmpCmp = new int[n], kmpFrom = new int[n];
        java.util.Arrays.fill(kmpFrom, -1);
        int i = 0, k = 0, found = -1;
        while (i &lt; n &amp;&amp; found &lt; 0) {                 // KMP, ghi mỗi lần so sánh vào lần dịch r của nó
            int r = i - k;
            if (kmpFrom[r] &lt; 0) kmpFrom[r] = k;
            kmpCmp[r]++;
            if (a.charAt(i) == p.charAt(k)) {
                i++; k++;
                if (k == m) found = i - m;
            } else {
                k = T[k];
                if (k &lt; 0) { i++; k = 0; }
            }
        }
        System.out.println("r  brute force               KMP");
        int bfTotal = 0, kmpTotal = 0;
        for (int r = 0; r &lt;= found; r++) {
            int j = 0;
            while (j &lt; m &amp;&amp; a.charAt(r + j) == p.charAt(j)) j++;
            int bf = (j == m) ? m : j + 1;
            bfTotal += bf;
            kmpTotal += kmpCmp[r];
            String left = bf + " cmp, " + (j == m ? "MATCH" : "fails at j=" + j);
            String right = kmpFrom[r] &lt; 0 ? "skipped" : kmpCmp[r] + " cmp from j=" + kmpFrom[r] + (r == found ? ", MATCH" : "");
            System.out.println(r + "  " + String.format("%-24s", left) + "  " + right);
        }
        System.out.println("total: brute force " + bfTotal + " comparisons, KMP " + kmpTotal);
    }
}</code></pre>
<div class="out">r &nbsp;brute force &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KMP<br>
0 &nbsp;5 cmp, fails at j=4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 cmp from j=0<br>
1 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skipped<br>
2 &nbsp;3 cmp, fails at j=2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 cmp from j=2<br>
3 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;skipped<br>
4 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 cmp from j=0<br>
5 &nbsp;1 cmp, fails at j=0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 cmp from j=0<br>
6 &nbsp;6 cmp, MATCH &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 cmp from j=0, MATCH<br>
total: brute force 18 comparisons, KMP 14</div>
<p>KMP không bao giờ ghé lần dịch 1 và 3, còn ở lần dịch 2 thì bắt đầu từ j = 2 vì đã biết p[0..1] khớp: 14 phép so sánh thay vì 18 — nhỏ trên 13 ký tự, nhưng với văn bản dài thì đây chính là toàn bộ khác biệt giữa O(nm) và O(n + m).</p>
<div class="pitfall">Có n − m + 1 = 8 lần dịch, không phải n = 13: ở lần dịch r &gt; 7, phần cuối của p sẽ thò ra ngoài văn bản.</div>`],
      [12, 'The Knuth-Morris-Pratt Algorithm - 3',
        `<p class="y-chinh">🎯 After the mismatch at k = 4, brute force would re-read the text, but a[1..3] are already known to equal p[1..3] — so those comparisons can be done on the pattern alone, in advance.</p>
<ol>
<li>At r = 0: a[0..3] = p[0..3] and a[4] = 0 ≠ p[4] = 1 — the first wrong position is j = k = 4.</li>
<li>Brute force would set r' = 1 and compare (a[1], p[0]), (a[2], p[1]), (a[3], p[2]), (a[4], p[3]), …</li>
<li>Because a[1] = p[1], a[2] = p[2], a[3] = p[3], the first three are the same as (p[1], p[0]), (p[2], p[1]), (p[3], p[2]); only (a[4], p[3]) really needs the text.</li>
<li>In general, for a mismatch at k: (p[1], p[0]), …, (p[k−1], p[k−2]) involve only p — the slide's "bold comparisons".</li>
</ol>
<p>Comparing p with a copy <strong>pp</strong> of itself slid right by 1, 2, … positions does exactly these comparisons, with no text needed:</p>
<pre><code class="language-java">public class SlideCopy {
    public static void main(String[] args) {
        String p = "101011";
        int k = 4;                                   // a[0..3] = p[0..3] matched, then a[4] != p[4]
        System.out.println("p = " + p + ", first mismatch at k = " + k);
        for (int s = 1; s &lt; k; s++) {                // slide the copy pp right by s positions
            StringBuilder pairs = new StringBuilder();
            boolean ok = true;
            for (int j = s; j &lt; k; j++) {            // pp[j-s] now lies under p[j]
                pairs.append("(p[" + j + "],p[" + (j - s) + "])=(" + p.charAt(j) + "," + p.charAt(j - s) + ") ");
                if (p.charAt(j) != p.charAt(j - s)) { ok = false; break; }
            }
            System.out.println("slide pp by " + s + ": " + pairs + (ok ? "all equal" : "wrong"));
            if (ok) {
                System.out.println("=&gt; next(" + k + ") = " + (k - s) + ": compare a[" + k + "] with p[" + (k - s) + "]");
                return;
            }
        }
        System.out.println("=&gt; next(" + k + ") = 0: compare a[" + k + "] with p[0]");
    }
}</code></pre>
<div class="out">p = 101011, first mismatch at k = 4<br>
slide pp by 1: (p[1],p[0])=(0,1) wrong<br>
slide pp by 2: (p[2],p[0])=(1,1) (p[3],p[1])=(0,0) all equal<br>
=&gt; next(4) = 2: compare a[4] with p[2]</div>
<p>Sliding by 1 fails at once (p[1] = 0, p[0] = 1) — the slide's "in the given example this comparison is wrong" — so shift 1 is rejected without touching the text. Sliding by 2 works: that is slide 13.</p>
<div class="pitfall">These pattern-against-pattern comparisons do not depend on the text, so they are done once per pattern (the table T[]) and reused for every text searched — this is where KMP's O(m) preprocessing goes. An FE option saying "KMP preprocesses the text" is false: it preprocesses the pattern.</div>`,
        `<p class="y-chinh">🎯 Sau khi sai khớp ở k = 4, vét cạn sẽ đọc lại văn bản, nhưng a[1..3] đã biết là bằng p[1..3] — nên các phép so sánh đó làm được chỉ với mẫu, và làm trước.</p>
<ol>
<li>Tại r = 0: a[0..3] = p[0..3] còn a[4] = 0 ≠ p[4] = 1 — vị trí sai đầu tiên là j = k = 4.</li>
<li>Vét cạn (brute force) sẽ đặt r' = 1 rồi so (a[1], p[0]), (a[2], p[1]), (a[3], p[2]), (a[4], p[3]), …</li>
<li>Vì a[1] = p[1], a[2] = p[2], a[3] = p[3], ba cặp đầu chính là (p[1], p[0]), (p[2], p[1]), (p[3], p[2]); chỉ có (a[4], p[3]) mới thật sự cần tới văn bản.</li>
<li>Tổng quát, khi sai khớp (mismatch) ở k: các cặp (p[1], p[0]), …, (p[k−1], p[k−2]) chỉ liên quan tới p — đó là "các phép so sánh in đậm" trên slide.</li>
</ol>
<p>So p với một bản sao <strong>pp</strong> của chính nó, trượt sang phải 1, 2, … vị trí, là làm đúng các phép so sánh này, không cần văn bản:</p>
<pre><code class="language-java">public class SlideCopy {
    public static void main(String[] args) {
        String p = "101011";
        int k = 4;                                   // a[0..3] = p[0..3] đã khớp, rồi a[4] != p[4]
        System.out.println("p = " + p + ", first mismatch at k = " + k);
        for (int s = 1; s &lt; k; s++) {                // trượt bản sao pp sang phải s vị trí
            StringBuilder pairs = new StringBuilder();
            boolean ok = true;
            for (int j = s; j &lt; k; j++) {            // giờ pp[j-s] nằm dưới p[j]
                pairs.append("(p[" + j + "],p[" + (j - s) + "])=(" + p.charAt(j) + "," + p.charAt(j - s) + ") ");
                if (p.charAt(j) != p.charAt(j - s)) { ok = false; break; }
            }
            System.out.println("slide pp by " + s + ": " + pairs + (ok ? "all equal" : "wrong"));
            if (ok) {
                System.out.println("=&gt; next(" + k + ") = " + (k - s) + ": compare a[" + k + "] with p[" + (k - s) + "]");
                return;
            }
        }
        System.out.println("=&gt; next(" + k + ") = 0: compare a[" + k + "] with p[0]");
    }
}</code></pre>
<div class="out">p = 101011, first mismatch at k = 4<br>
slide pp by 1: (p[1],p[0])=(0,1) wrong<br>
slide pp by 2: (p[2],p[0])=(1,1) (p[3],p[1])=(0,0) all equal<br>
=&gt; next(4) = 2: compare a[4] with p[2]</div>
<p>Trượt 1 vị trí hỏng ngay (p[1] = 0, p[0] = 1) — chính là câu "in the given example this comparison is wrong" (trong ví dụ này phép so sánh đó sai) của slide — nên lần dịch 1 bị loại mà không cần đụng tới văn bản. Trượt 2 vị trí thì được: đó là slide 13.</p>
<div class="pitfall">Các phép so mẫu với mẫu này không phụ thuộc văn bản, nên chỉ làm một lần cho mỗi mẫu (bảng T[]) rồi dùng lại cho mọi văn bản cần tìm — đó là phần tiền xử lý (preprocessing) O(m) của KMP. Phương án trong đề thi cuối kỳ (FE) nói "KMP tiền xử lý văn bản" là SAI: nó tiền xử lý mẫu.</div>`],
      [13, 'The Knuth-Morris-Pratt Algorithm - 4',
        `<p class="y-chinh">🎯 Sliding pp two positions makes the pattern agree with itself, so the search simply continues with a[4] against p[2]; how far to fall back is precomputed as the KMP failure function next(j) and stored in the array T[j].</p>
<ul>
<li><strong>"Slide 2 (ok)"</strong>: (p[2], p[0]) and (p[3], p[1]) are equal, so p[0..1] already lies over a[2..3]: next(4) = 2, and the search goes on with (a[4], p[2]).</li>
<li><strong>The slide's definition</strong>: next(0) = −1, next(1) = 0, and for 2 ≤ j ≤ m − 1, next(j) is a value in [0, j − 1].</li>
<li><strong>What the value means</strong>: next(j) is the length of the longest <em>border</em> of p[0..j−1] — a prefix that is also a suffix, shorter than p[0..j−1] itself. The smallest slide that works leaves the longest border.</li>
<li><strong>Why −1 at j = 0</strong>: nothing has matched, so nothing can be kept — the text position itself must move on (slide 14).</li>
</ul>
<pre><code class="language-java">public class NextBySliding {
    // next(j) by the slide's method: slide a copy pp right by s = 1, 2, ...
    // until p[s..j-1] equals pp[0..j-1-s]; then next(j) = j - s
    static int next(String p, int j) {
        if (j == 0) return -1;                       // by definition
        for (int s = 1; s &lt; j; s++)
            if (p.substring(s, j).equals(p.substring(0, j - s))) return j - s;
        return 0;                                    // no slide works: restart at p[0]
    }

    public static void main(String[] args) {
        String p = "101011";
        int[] T = new int[p.length()];
        for (int j = 0; j &lt; p.length(); j++) {
            T[j] = next(p, j);
            String left = j == 0 ? "nothing matched yet" : "p[0.." + (j - 1) + "] = " + p.substring(0, j);
            String border = j == 0 ? "" : "border = " + (T[j] &gt; 0 ? p.substring(0, T[j]) : "(empty)");
            System.out.println("j=" + j + "  " + String.format("%-20s", left) + String.format("%-17s", border)
                    + "next(" + j + ") = " + T[j]);
        }
        System.out.println("T = " + java.util.Arrays.toString(T));
    }
}</code></pre>
<div class="out">j=0 &nbsp;nothing matched yet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;next(0) = -1<br>
j=1 &nbsp;p[0..0] = 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = (empty) next(1) = 0<br>
j=2 &nbsp;p[0..1] = 10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = (empty) next(2) = 0<br>
j=3 &nbsp;p[0..2] = 101 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;next(3) = 1<br>
j=4 &nbsp;p[0..3] = 1010 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = 10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;next(4) = 2<br>
j=5 &nbsp;p[0..4] = 10101 &nbsp;&nbsp;&nbsp;&nbsp;border = 101 &nbsp;&nbsp;&nbsp;&nbsp;next(5) = 3<br>
T = [-1, 0, 0, 1, 2, 3]</div>
<p><strong>Big-O:</strong> this "slide and compare" method is the definition made executable — for each of the m positions, up to m slides of up to m comparisons, O(m³). Slide 15's program builds the same table in O(m).</p>
<p class="meo">🧠 <strong>Remember:</strong> next(j) answers "I matched j characters and then failed — how many of them can I keep?"</p>`,
        `<p class="y-chinh">🎯 Trượt pp hai vị trí thì mẫu khớp với chính nó, nên phép tìm chỉ việc đi tiếp bằng cách so a[4] với p[2]; lùi về bao xa được tính sẵn thành hàm thất bại (failure function) next(j) của KMP và lưu trong mảng T[j].</p>
<ul>
<li><strong>"Slide 2 (ok)" (trượt 2 — được)</strong>: (p[2], p[0]) và (p[3], p[1]) bằng nhau, nên p[0..1] đã nằm đúng trên a[2..3]: next(4) = 2, và phép tìm đi tiếp với (a[4], p[2]).</li>
<li><strong>Định nghĩa của slide</strong>: next(0) = −1, next(1) = 0, và với 2 ≤ j ≤ m − 1 thì next(j) là một giá trị trong đoạn [0, j − 1].</li>
<li><strong>Ý nghĩa của giá trị</strong>: next(j) là độ dài của <em>biên</em> (border) dài nhất của p[0..j−1] — một tiền tố (prefix) đồng thời là hậu tố (suffix), ngắn hơn chính p[0..j−1]. Lần trượt nhỏ nhất mà khớp sẽ để lại biên dài nhất.</li>
<li><strong>Vì sao j = 0 cho −1</strong>: chưa khớp ký tự nào nên không giữ lại được gì — chính vị trí trên văn bản phải bước tiếp (slide 14).</li>
</ul>
<pre><code class="language-java">public class NextBySliding {
    // next(j) theo cách của slide: trượt bản sao pp sang phải s = 1, 2, ...
    // tới khi p[s..j-1] trùng pp[0..j-1-s]; khi đó next(j) = j - s
    static int next(String p, int j) {
        if (j == 0) return -1;                       // theo định nghĩa
        for (int s = 1; s &lt; j; s++)
            if (p.substring(s, j).equals(p.substring(0, j - s))) return j - s;
        return 0;                                    // không lần trượt nào khớp: làm lại từ p[0]
    }

    public static void main(String[] args) {
        String p = "101011";
        int[] T = new int[p.length()];
        for (int j = 0; j &lt; p.length(); j++) {
            T[j] = next(p, j);
            String left = j == 0 ? "nothing matched yet" : "p[0.." + (j - 1) + "] = " + p.substring(0, j);
            String border = j == 0 ? "" : "border = " + (T[j] &gt; 0 ? p.substring(0, T[j]) : "(empty)");
            System.out.println("j=" + j + "  " + String.format("%-20s", left) + String.format("%-17s", border)
                    + "next(" + j + ") = " + T[j]);
        }
        System.out.println("T = " + java.util.Arrays.toString(T));
    }
}</code></pre>
<div class="out">j=0 &nbsp;nothing matched yet &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;next(0) = -1<br>
j=1 &nbsp;p[0..0] = 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = (empty) next(1) = 0<br>
j=2 &nbsp;p[0..1] = 10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = (empty) next(2) = 0<br>
j=3 &nbsp;p[0..2] = 101 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;next(3) = 1<br>
j=4 &nbsp;p[0..3] = 1010 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border = 10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;next(4) = 2<br>
j=5 &nbsp;p[0..4] = 10101 &nbsp;&nbsp;&nbsp;&nbsp;border = 101 &nbsp;&nbsp;&nbsp;&nbsp;next(5) = 3<br>
T = [-1, 0, 0, 1, 2, 3]</div>
<p><strong>Big-O:</strong> cách "trượt rồi so" này là định nghĩa viết thành code — với mỗi vị trí trong m vị trí, tối đa m lần trượt, mỗi lần tối đa m phép so, tức O(m³). Chương trình ở slide 15 dựng cùng bảng đó trong O(m).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> next(j) trả lời câu "tôi đã khớp j ký tự rồi hỏng — giữ lại được bao nhiêu ký tự trong số đó?"</p>`],
      [14, 'The Knuth-Morris-Pratt Algorithm - 5',
        `<p class="y-chinh">🎯 Each KMP step either extends the match or slides the pattern right to h = next[k]; either way it makes progress, so the search loop runs at most 2n times.</p>
<ul>
<li><strong>If p[k] = a[r + k]</strong>: the match grows (k + 1), unless k = m − 1 — then the whole pattern matches at r.</li>
<li><strong>If p[k] ≠ a[r + k]</strong>: slide p to h = next[k], so r becomes r + k − h, and compare p[h] with the same a[r + k].</li>
<li><strong>If h = −1</strong>: no part of p can stay — step past this text character: r = r + k + 1, k = 0.</li>
</ul>
<p class="nhan">Trace — the slides' example, every comparison</p>
<pre><code class="language-java">public class KmpTrace {
    public static void main(String[] args) {
        String a = "1010001010110", p = "101011";    // slides 11-14
        int n = a.length(), m = p.length();
        int[] next = {-1, 0, 0, 1, 2, 3};            // T[] of p, from slide 13
        int r = 0, k = 0, steps = 0;                 // p[0..k-1] already matches a[r..r+k-1]
        while (r + k &lt; n) {
            steps++;
            String s = "r=" + r + " k=" + k + ": a[" + (r + k) + "]=" + a.charAt(r + k) + " p[" + k + "]=" + p.charAt(k);
            if (a.charAt(r + k) == p.charAt(k)) {
                if (k == m - 1) { System.out.println(s + " equal -&gt; MATCH at r=" + r); break; }
                k++;                                 // extend the match
                System.out.println(s + " equal");
            } else {
                int h = next[k];                     // slide p so that p[h] is under a[r+k]
                System.out.println(s + " differ -&gt; h = next[" + k + "] = " + h);
                if (h &lt; 0) { r = r + k + 1; k = 0; } // h = -1: move past a[r+k]
                else { r = r + k - h; k = h; }
            }
        }
        System.out.println("loop steps = " + steps + " &lt;= 2n = " + 2 * n);
    }
}</code></pre>
<div class="out">r=0 k=0: a[0]=1 p[0]=1 equal<br>
r=0 k=1: a[1]=0 p[1]=0 equal<br>
r=0 k=2: a[2]=1 p[2]=1 equal<br>
r=0 k=3: a[3]=0 p[3]=0 equal<br>
r=0 k=4: a[4]=0 p[4]=1 differ -&gt; h = next[4] = 2<br>
r=2 k=2: a[4]=0 p[2]=1 differ -&gt; h = next[2] = 0<br>
r=4 k=0: a[4]=0 p[0]=1 differ -&gt; h = next[0] = -1<br>
r=5 k=0: a[5]=0 p[0]=1 differ -&gt; h = next[0] = -1<br>
r=6 k=0: a[6]=1 p[0]=1 equal<br>
r=6 k=1: a[7]=0 p[1]=0 equal<br>
r=6 k=2: a[8]=1 p[2]=1 equal<br>
r=6 k=3: a[9]=0 p[3]=0 equal<br>
r=6 k=4: a[10]=1 p[4]=1 equal<br>
r=6 k=5: a[11]=1 p[5]=1 equal -&gt; MATCH at r=6<br>
loop steps = 14 &lt;= 2n = 26</div>
<p>Read it: a[4] is compared three times (with p[4], p[2], p[0]) while the pattern slides r = 0 → 2 → 4, yet the text position r + k never decreases. The slide's "values (q)" that must be "already computed" are these next values.</p>
<p><strong>Big-O, the slide's argument:</strong> every step increases either r + k (a match) or r (a slide), and both stay ≤ n, so there are at most 2n steps of O(1) → O(n) for the search, plus O(m) for the table → O(n + m).</p>
<div class="pitfall">Forgetting the h = −1 case leads to <code>p.charAt(-1)</code> (an exception) or to a loop that never advances. When k = 0 and the characters differ, the text position must move on by one.</div>`,
        `<p class="y-chinh">🎯 Mỗi bước của KMP hoặc nối dài đoạn khớp, hoặc trượt mẫu sang phải tới h = next[k]; kiểu nào cũng tiến lên, nên vòng tìm chạy nhiều nhất 2n lần.</p>
<ul>
<li><strong>Nếu p[k] = a[r + k]</strong>: đoạn khớp dài thêm (k + 1), trừ khi k = m − 1 — khi đó cả mẫu đã khớp tại r.</li>
<li><strong>Nếu p[k] ≠ a[r + k]</strong>: trượt p tới h = next[k], nghĩa là r thành r + k − h, rồi so p[h] với chính a[r + k] đó.</li>
<li><strong>Nếu h = −1</strong>: không giữ được phần nào của p — bước qua ký tự văn bản này: r = r + k + 1, k = 0.</li>
</ul>
<p class="nhan">Lần theo — ví dụ của slide, từng phép so sánh</p>
<pre><code class="language-java">public class KmpTrace {
    public static void main(String[] args) {
        String a = "1010001010110", p = "101011";    // slide 11-14
        int n = a.length(), m = p.length();
        int[] next = {-1, 0, 0, 1, 2, 3};            // bảng T[] của p, từ slide 13
        int r = 0, k = 0, steps = 0;                 // p[0..k-1] đã khớp a[r..r+k-1]
        while (r + k &lt; n) {
            steps++;
            String s = "r=" + r + " k=" + k + ": a[" + (r + k) + "]=" + a.charAt(r + k) + " p[" + k + "]=" + p.charAt(k);
            if (a.charAt(r + k) == p.charAt(k)) {
                if (k == m - 1) { System.out.println(s + " equal -&gt; MATCH at r=" + r); break; }
                k++;                                 // nối dài đoạn khớp
                System.out.println(s + " equal");
            } else {
                int h = next[k];                     // trượt p để p[h] nằm dưới a[r+k]
                System.out.println(s + " differ -&gt; h = next[" + k + "] = " + h);
                if (h &lt; 0) { r = r + k + 1; k = 0; } // h = -1: bước qua a[r+k]
                else { r = r + k - h; k = h; }
            }
        }
        System.out.println("loop steps = " + steps + " &lt;= 2n = " + 2 * n);
    }
}</code></pre>
<div class="out">r=0 k=0: a[0]=1 p[0]=1 equal<br>
r=0 k=1: a[1]=0 p[1]=0 equal<br>
r=0 k=2: a[2]=1 p[2]=1 equal<br>
r=0 k=3: a[3]=0 p[3]=0 equal<br>
r=0 k=4: a[4]=0 p[4]=1 differ -&gt; h = next[4] = 2<br>
r=2 k=2: a[4]=0 p[2]=1 differ -&gt; h = next[2] = 0<br>
r=4 k=0: a[4]=0 p[0]=1 differ -&gt; h = next[0] = -1<br>
r=5 k=0: a[5]=0 p[0]=1 differ -&gt; h = next[0] = -1<br>
r=6 k=0: a[6]=1 p[0]=1 equal<br>
r=6 k=1: a[7]=0 p[1]=0 equal<br>
r=6 k=2: a[8]=1 p[2]=1 equal<br>
r=6 k=3: a[9]=0 p[3]=0 equal<br>
r=6 k=4: a[10]=1 p[4]=1 equal<br>
r=6 k=5: a[11]=1 p[5]=1 equal -&gt; MATCH at r=6<br>
loop steps = 14 &lt;= 2n = 26</div>
<p>Đọc kết quả in ra (output): a[4] được so ba lần (với p[4], p[2], p[0]) trong khi mẫu trượt r = 0 → 2 → 4, vậy mà vị trí trên văn bản r + k không bao giờ giảm. Cụm "values (q)" (các giá trị q) mà slide nói phải "tính sẵn" chính là các giá trị next này.</p>
<p><strong>Big-O, đúng lập luận của slide:</strong> mỗi bước tăng hoặc r + k (khi khớp) hoặc r (khi trượt), và cả hai đều ≤ n, nên có nhiều nhất 2n bước, mỗi bước O(1) → O(n) cho phần tìm, cộng O(m) để dựng bảng → O(n + m).</p>
<div class="pitfall">Quên trường hợp h = −1 sẽ dẫn tới <code>p.charAt(-1)</code> (ném ngoại lệ — exception) hoặc vòng lặp không bao giờ tiến. Khi k = 0 mà hai ký tự khác nhau, vị trí trên văn bản phải bước thêm một.</div>`],
      [15, 'The KMP Algorithm examples',
        `<p class="y-chinh">🎯 Three tables T[] to practise on, all following one definition: T[0] = −1, and T[j] = the length of the longest proper prefix of p[0..j−1] that is also its suffix.</p>
<pre><code class="language-java">import java.util.Arrays;

public class FailureTable {
    // T[0] = -1; T[j] = length of the longest proper prefix of p[0..j-1] that is also its suffix
    static int[] buildT(String p) {                  // O(m)
        int m = p.length();
        int[] T = new int[m];
        T[0] = -1;
        for (int j = 1; j &lt; m; j++) {
            int k = T[j - 1];                        // longest border of p[0..j-2]
            while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k];   // cannot extend it: try a shorter one
            T[j] = k + 1;
        }
        return T;
    }

    static int[] byDefinition(String p) {            // try every length, longest first (slow, obviously right)
        int[] T = new int[p.length()];
        T[0] = -1;
        for (int j = 1; j &lt; p.length(); j++)
            for (int len = j - 1; len &gt;= 0; len--)
                if (p.substring(0, len).equals(p.substring(j - len, j))) { T[j] = len; break; }
        return T;
    }

    public static void main(String[] args) {
        String[] ps = {"ABCDABD", "ABACABABC", "PARTICIPATE IN PAR"};
        int[][] slide = {{-1, 0, 0, 0, 0, 1, 2}, {-1, 0, 0, 1, 0, 1, 2, 3, 2},
                         {-1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2}};
        for (int e = 0; e &lt; ps.length; e++) {
            int[] T = buildT(ps[e]);
            System.out.println("Example " + (e + 1) + ": p = \\"" + ps[e] + "\\", m = " + ps[e].length());
            System.out.println("  T = " + Arrays.toString(T));
            System.out.println("  same as the slide: " + Arrays.equals(T, slide[e])
                    + ", same as the definition: " + Arrays.equals(T, byDefinition(ps[e])));
        }
        System.out.println("spaces in example 3 at i = " + "PARTICIPATE IN PAR".indexOf(' ') + " and " + "PARTICIPATE IN PAR".lastIndexOf(' '));
    }
}</code></pre>
<div class="out">Example 1: p = "ABCDABD", m = 7<br>
&nbsp;&nbsp;T = [-1, 0, 0, 0, 0, 1, 2]<br>
&nbsp;&nbsp;same as the slide: true, same as the definition: true<br>
Example 2: p = "ABACABABC", m = 9<br>
&nbsp;&nbsp;T = [-1, 0, 0, 1, 0, 1, 2, 3, 2]<br>
&nbsp;&nbsp;same as the slide: true, same as the definition: true<br>
Example 3: p = "PARTICIPATE IN PAR", m = 18<br>
&nbsp;&nbsp;T = [-1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2]<br>
&nbsp;&nbsp;same as the slide: true, same as the definition: true<br>
spaces in example 3 at i = 11 and 14</div>
<p class="nhan">Example 2 row by row (p = ABACABABC)</p>
<table>
<thead><tr><th>j</th><th>p[0..j−1]</th><th>Longest prefix = suffix</th><th>T[j]</th></tr></thead>
<tbody>
<tr><td>3</td><td>ABA</td><td>A</td><td>1</td></tr>
<tr><td>4</td><td>ABAC</td><td>(none)</td><td>0</td></tr>
<tr><td>5</td><td>ABACA</td><td>A</td><td>1</td></tr>
<tr><td>6</td><td>ABACAB</td><td>AB</td><td>2</td></tr>
<tr><td>7</td><td>ABACABA</td><td>ABA</td><td>3</td></tr>
<tr><td>8</td><td>ABACABAB</td><td>AB (ABAC ≠ ABAB, ABA ≠ BAB)</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li><code>buildT</code> is the O(m) method: T[j] extends the border of p[0..j−2] by one character when p[T[j−1]] = p[j−1]; otherwise it falls back to shorter borders through T itself.</li>
<li>Example 3 contains two spaces (i = 11 and 14), so "PARTICIPATE IN PAR" has 18 characters; T[16] = 1 and T[17] = 2 come from "PA" reappearing at the end.</li>
<li>T[m − 1] never looks at the last character p[m − 1]: p = 101011 and p = 101010 have the same T.</li>
</ul>
<div class="pitfall">Two conventions exist. The slides' T[] starts with −1 and describes p[0..j−1]; Goodrich's book and lesson 8.2 use fail[k] for p[0..k], which starts with 0. They are the same numbers moved one place: T[j] = fail[j − 1]. Check which table a question means before you answer.</div>`,
        `<p class="y-chinh">🎯 Ba bảng T[] để tự luyện, cùng theo một định nghĩa: T[0] = −1, và T[j] = độ dài tiền tố thật sự (proper prefix) dài nhất của p[0..j−1] đồng thời là hậu tố (suffix) của nó.</p>
<pre><code class="language-java">import java.util.Arrays;

public class FailureTable {
    // T[0] = -1; T[j] = độ dài tiền tố thật dài nhất của p[0..j-1] đồng thời là hậu tố của nó
    static int[] buildT(String p) {                  // O(m)
        int m = p.length();
        int[] T = new int[m];
        T[0] = -1;
        for (int j = 1; j &lt; m; j++) {
            int k = T[j - 1];                        // biên dài nhất của p[0..j-2]
            while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k];   // không nối dài được: thử biên ngắn hơn
            T[j] = k + 1;
        }
        return T;
    }

    static int[] byDefinition(String p) {            // thử mọi độ dài, dài trước (chậm, hiển nhiên đúng)
        int[] T = new int[p.length()];
        T[0] = -1;
        for (int j = 1; j &lt; p.length(); j++)
            for (int len = j - 1; len &gt;= 0; len--)
                if (p.substring(0, len).equals(p.substring(j - len, j))) { T[j] = len; break; }
        return T;
    }

    public static void main(String[] args) {
        String[] ps = {"ABCDABD", "ABACABABC", "PARTICIPATE IN PAR"};
        int[][] slide = {{-1, 0, 0, 0, 0, 1, 2}, {-1, 0, 0, 1, 0, 1, 2, 3, 2},
                         {-1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2}};
        for (int e = 0; e &lt; ps.length; e++) {
            int[] T = buildT(ps[e]);
            System.out.println("Example " + (e + 1) + ": p = \\"" + ps[e] + "\\", m = " + ps[e].length());
            System.out.println("  T = " + Arrays.toString(T));
            System.out.println("  same as the slide: " + Arrays.equals(T, slide[e])
                    + ", same as the definition: " + Arrays.equals(T, byDefinition(ps[e])));
        }
        System.out.println("spaces in example 3 at i = " + "PARTICIPATE IN PAR".indexOf(' ') + " and " + "PARTICIPATE IN PAR".lastIndexOf(' '));
    }
}</code></pre>
<div class="out">Example 1: p = "ABCDABD", m = 7<br>
&nbsp;&nbsp;T = [-1, 0, 0, 0, 0, 1, 2]<br>
&nbsp;&nbsp;same as the slide: true, same as the definition: true<br>
Example 2: p = "ABACABABC", m = 9<br>
&nbsp;&nbsp;T = [-1, 0, 0, 1, 0, 1, 2, 3, 2]<br>
&nbsp;&nbsp;same as the slide: true, same as the definition: true<br>
Example 3: p = "PARTICIPATE IN PAR", m = 18<br>
&nbsp;&nbsp;T = [-1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2]<br>
&nbsp;&nbsp;same as the slide: true, same as the definition: true<br>
spaces in example 3 at i = 11 and 14</div>
<p class="nhan">Ví dụ 2 từng dòng (p = ABACABABC)</p>
<table>
<thead><tr><th>j</th><th>p[0..j−1]</th><th>Tiền tố = hậu tố dài nhất</th><th>T[j]</th></tr></thead>
<tbody>
<tr><td>3</td><td>ABA</td><td>A</td><td>1</td></tr>
<tr><td>4</td><td>ABAC</td><td>(không có)</td><td>0</td></tr>
<tr><td>5</td><td>ABACA</td><td>A</td><td>1</td></tr>
<tr><td>6</td><td>ABACAB</td><td>AB</td><td>2</td></tr>
<tr><td>7</td><td>ABACABA</td><td>ABA</td><td>3</td></tr>
<tr><td>8</td><td>ABACABAB</td><td>AB (ABAC ≠ ABAB, ABA ≠ BAB)</td><td>2</td></tr>
</tbody>
</table>
<ul>
<li><code>buildT</code> là cách O(m): T[j] nối dài biên (border) của p[0..j−2] thêm một ký tự khi p[T[j−1]] = p[j−1]; nếu không thì lùi về các biên ngắn hơn, dùng chính bảng T.</li>
<li>Ví dụ 3 có hai dấu cách (ở i = 11 và 14), nên "PARTICIPATE IN PAR" dài 18 ký tự; T[16] = 1 và T[17] = 2 là do "PA" xuất hiện lại ở cuối.</li>
<li>T[m − 1] không bao giờ nhìn tới ký tự cuối p[m − 1]: p = 101011 và p = 101010 có cùng bảng T.</li>
</ul>
<div class="pitfall">Có hai quy ước. Bảng T[] của slide bắt đầu bằng −1 và mô tả p[0..j−1]; sách Goodrich và bài 8.2 dùng fail[k] cho p[0..k], bắt đầu bằng 0. Đó là cùng các con số, lệch một ô: T[j] = fail[j − 1]. Xem đề đang nói bảng nào trước khi trả lời.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>S = aaaaab, p = aab. How many character comparisons does brute force make, and where does it find p?</li>
<li>Compute T[] for p = AABAAA.</li>
<li>KMP may compare the same text character several times after a mismatch. Why is it still O(n + m)?</li>
<li>During KMP, p[k] ≠ a[r + k] and next[k] = h ≥ 0. What is compared next, and what is the new shift r?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) 12 — shifts 0, 1, 2 each cost 3 (two a's match, the third comparison fails), shift 3 matches with 3 more; found at 3. That is exactly (n − m + 1)·m = 4·3. (2) T = [−1, 0, 1, 0, 1, 2]. (3) Every loop step increases either the text position r + k or the shift r, and both are ≤ n, so there are at most 2n steps; building T costs O(m). (4) p[h] with the same a[r + k]; the new shift is r + k − h.</p>
<p><strong>Next:</strong> lesson 8.B (slides 16–40: entropy, prefix codes, Huffman, LZW, RLE). For more on this half, the deep-dive lesson 8.2 (pattern matching: brute force &amp; KMP) builds the failure table in the book's convention and compares KMP with Boyer–Moore and Rabin–Karp; lesson 8.5 has PE-style exercises with self-tests.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>S = aaaaab, p = aab. Vét cạn làm bao nhiêu phép so sánh ký tự, và tìm thấy p ở đâu?</li>
<li>Tính bảng T[] cho p = AABAAA.</li>
<li>Sau một lần sai khớp, KMP có thể so cùng một ký tự văn bản nhiều lần. Vì sao nó vẫn là O(n + m)?</li>
<li>Đang chạy KMP, p[k] ≠ a[r + k] và next[k] = h ≥ 0. Bước kế so cái gì, và lần dịch r mới là bao nhiêu?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) 12 — lần dịch 0, 1, 2 mỗi lần tốn 3 (hai chữ a khớp, phép so thứ ba hỏng), lần dịch 3 khớp với 3 phép nữa; tìm thấy ở vị trí 3. Đúng bằng (n − m + 1)·m = 4·3. (2) T = [−1, 0, 1, 0, 1, 2]. (3) Mỗi bước của vòng lặp tăng hoặc vị trí trên văn bản r + k, hoặc lần dịch r, và cả hai đều ≤ n, nên có nhiều nhất 2n bước; dựng bảng T tốn O(m). (4) So p[h] với chính a[r + k]; lần dịch mới là r + k − h.</p>
<p><strong>Học tiếp:</strong> bài 8.B (slide 16–40: entropy — lượng tin trung bình, mã tiền tố, Huffman, LZW, RLE — mã hoá độ dài loạt). Muốn đào sâu nửa này, bài 8.2 (so khớp mẫu: vét cạn &amp; KMP) dựng bảng thất bại (failure table) theo quy ước của sách và so KMP với Boyer–Moore, Rabin–Karp; bài 8.5 có bài tập kiểu thi thực hành (PE) kèm phép thử (test) tự kiểm.</p>`),
    books([
      ['goodrich', 'Ch.13 Text Processing p.573 — §13.1 Abundance of Digitized Text p.574 · §13.2 Pattern-Matching Algorithms p.576 · §13.2.1 Brute Force p.576 · §13.2.3 The Knuth-Morris-Pratt Algorithm p.582', 'Chương 13 Text Processing tr.573 — §13.1 Abundance of Digitized Text tr.574 · §13.2 Pattern-Matching Algorithms tr.576 · §13.2.1 Brute Force tr.576 · §13.2.3 The Knuth-Morris-Pratt Algorithm tr.582'],
    ]),
  ].join('\n'),
};

/* ───────── 8.B — 📑 Slide by slide · Text processing, part 2: compression — Huffman, LZW, RLE (8-TextProcessing, slides 16–40) ───────── */
const L_csd14_2 = {
  title: '8.B — 📑 Slide by slide · Text processing, part 2: compression — Huffman, LZW, RLE (8-TextProcessing, slides 16–40)|||8.B — 📑 Học theo từng slide · Xử lý văn bản, phần 2: nén dữ liệu — Huffman, LZW, RLE (8-TextProcessing, slide 16–40)',
  slug: 'csd201-slide-csd14-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 16–40 của bộ 8-TextProcessing: nén mất mát và không mất mát, entropy và tỉ lệ nén, mã giải được duy nhất và mã tiền tố, độ dài trung bình, dựng cây Huffman từng bước (A .20 … F .05, kiểm lại độ dài trung bình 2.34 chứ không phải 1.89), đoạn code Huffman của slide chạy được, LZW mã hoá/giải mã (1)(2)(2)(4)(7)(3) kể cả ca đặc biệt, RLE — 16 chương trình Java chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.B · 8-TextProcessing, slides 16–40</span>
<h2>Text processing, part 2 — data compression, slide by slide</h2>
<p class="lead">The second half of the deck stores text in fewer bits without losing a single character. Slides 16–21 give the measuring tools (lossy vs lossless, entropy, compression rate, uniquely decodable and prefix codes, average length); slides 22–32 build a Huffman code step by step; slides 33–36 and 39–40 run LZW and run-length encoding by hand. Every example of the slides is re-run by a Java program — including the places where the slide's own numbers do not add up.</p>
<div class="callout"><strong>CLO8 in the syllabus:</strong> describe the text-processing problem and its applications; explain the Huffman, LZW and run-length encoding algorithms — this lesson is the compression half (session 54). The syllabus's constructive questions for it: CQ19.1 lossy vs lossless, CQ19.2 how to compare compression methods, CQ19.3 Huffman and its key idea, CQ20.1 LZW and how it differs from Huffman, CQ20.2 run-length encoding, CQ20.3 Huffman vs LZW. FE questions commonly ask you to build Huffman codes from frequencies, compute an average code length, give the LZW codes of a short string or compute an RLE rate. Two traps sit inside the slides themselves: the average length printed on slide 30 and the decoded text on slide 40.</div>
<h3>Slides 16–40 in one table</h3>
<table>
<thead><tr><th>Method</th><th>Exploits</th><th>How it works</th><th>Cost</th><th>The slides' example</th></tr></thead>
<tbody>
<tr><td>Huffman (slides 22–32)</td><td>skewed symbol frequencies</td><td>merge the two smallest weights until one tree is left; code = path from the root (0 left, 1 right)</td><td>O(k log k) to build with a heap (k symbols), one table look-up per symbol to encode</td><td>A .20 B .09 C .15 D .11 E .40 F .05 → A 000, B 0100, C 001, D 011, E 1, F 0101; average 2.34 bits</td></tr>
<tr><td>LZW (slides 33–35, 39–40)</td><td>repeated substrings</td><td>encoder and decoder grow the same dictionary; output the code of the longest known string</td><td>O(n) look-ups with a hash map or trie as the dictionary</td><td>ABBABABAC with (1)A (2)B (3)C → (1)(2)(2)(4)(7)(3)</td></tr>
<tr><td>RLE (slide 36)</td><td>runs of one symbol</td><td>write each run as count + symbol</td><td>O(n)</td><td>4F4O3F2O5F7O, rate (25 − 12)/25 = 52%</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.B · 8-TextProcessing, slide 16–40</span>
<h2>Xử lý văn bản, phần 2 — nén dữ liệu, học từng slide</h2>
<p class="lead">Nửa sau của bộ slide lưu văn bản bằng ít bit hơn mà không mất một ký tự nào. Slide 16–21 đưa ra các thước đo (nén mất mát và không mất mát, entropy — lượng tin trung bình, tỉ lệ nén, mã giải được duy nhất và mã tiền tố, độ dài trung bình); slide 22–32 dựng mã Huffman từng bước; slide 33–36 và 39–40 chạy tay LZW và mã hoá độ dài loạt (run-length encoding — RLE). Mọi ví dụ của slide đều được một chương trình Java chạy lại — kể cả những chỗ chính con số trên slide không khớp.</p>
<div class="callout"><strong>CLO8 (chuẩn đầu ra số 8) trong đề cương môn học (syllabus):</strong> mô tả bài toán xử lý văn bản và ứng dụng; giải thích các thuật toán Huffman, LZW và RLE — bài này là nửa nén dữ liệu (buổi 54). Các câu hỏi gợi mở (constructive question) của syllabus cho phần này: CQ19.1 nén mất mát và không mất mát, CQ19.2 so sánh hiệu quả các phương pháp nén thế nào, CQ19.3 Huffman và ý tưởng chính, CQ20.1 LZW và khác Huffman ở đâu, CQ20.2 mã hoá độ dài loạt, CQ20.3 Huffman so với LZW. Câu hỏi thi cuối kỳ (FE) thường bắt dựng mã Huffman từ bảng tần suất, tính độ dài mã trung bình, cho dãy mã LZW của một chuỗi ngắn, hoặc tính tỉ lệ nén RLE. Có hai cái bẫy nằm ngay trong slide: độ dài trung bình in ở slide 30 và chuỗi giải mã ở slide 40.</div>
<h3>Slide 16–40 trong một bảng</h3>
<table>
<thead><tr><th>Phương pháp</th><th>Khai thác điều gì</th><th>Cách làm</th><th>Chi phí</th><th>Ví dụ của slide</th></tr></thead>
<tbody>
<tr><td>Huffman (slide 22–32)</td><td>tần suất ký hiệu chênh lệch</td><td>gộp hai trọng số nhỏ nhất tới khi còn một cây; mã = đường đi từ gốc (trái 0, phải 1)</td><td>O(k log k) để dựng bằng đống (heap, k ký hiệu), mỗi ký hiệu một lần tra bảng khi mã hoá</td><td>A .20 B .09 C .15 D .11 E .40 F .05 → A 000, B 0100, C 001, D 011, E 1, F 0101; trung bình 2.34 bit</td></tr>
<tr><td>LZW (slide 33–35, 39–40)</td><td>chuỗi con lặp lại</td><td>bên mã hoá và bên giải mã cùng dựng một từ điển; xuất mã của chuỗi dài nhất đã biết</td><td>O(n) lần tra, khi từ điển là bảng băm (hash map) hoặc cây tiền tố (trie)</td><td>ABBABABAC với (1)A (2)B (3)C → (1)(2)(2)(4)(7)(3)</td></tr>
<tr><td>RLE (slide 36)</td><td>loạt ký hiệu giống nhau liền nhau</td><td>ghi mỗi loạt thành số lần + ký hiệu</td><td>O(n)</td><td>4F4O3F2O5F7O, tỉ lệ (25 − 12)/25 = 52%</td></tr>
</tbody>
</table>`),
    walkHead('csd14', 16, 40),
    walk('csd14', [
      [16, 'Data Compression - 1',
        `<p class="y-chinh">🎯 Data compression (source coding) encodes information in fewer bits than the plain representation: it saves storage and bandwidth, but costs processing time to encode and, every time the data is needed, to decode.</p>
<ul>
<li><strong>The slide's diagram</strong>: raw data → <em>encoding</em> → compressed data → <em>decoding</em> → the data again.</li>
<li><strong>Why</strong>: smaller files on disk and faster transfers — "the consumption of storage or bandwidth" goes down.</li>
<li><strong>The price</strong>: CPU time — the data must be decoded before it can be read, viewed or searched.</li>
<li><strong>The idea behind every method</strong>: plain text spends the same 8 bits on every character; a code designed for the data can spend fewer.</li>
</ul>
<p>The lesson's own example — the DNA of slide 3 uses only 4 letters, so 2 bits per letter are enough instead of 8:</p>
<pre><code class="language-java">import java.util.Locale;

public class DnaTwoBits {
    static final String BASES = "ACGT";              // codes 00, 01, 10, 11

    static String encode(String dna) {               // raw text -&gt; bits
        StringBuilder bits = new StringBuilder();
        for (char c : dna.toCharArray()) {
            int k = BASES.indexOf(c);
            bits.append(k / 2).append(k % 2);        // 2 bits per letter
        }
        return bits.toString();
    }

    static String decode(String bits) {              // bits -&gt; text
        StringBuilder dna = new StringBuilder();
        for (int i = 0; i &lt; bits.length(); i += 2)
            dna.append(BASES.charAt((bits.charAt(i) - '0') * 2 + (bits.charAt(i + 1) - '0')));
        return dna.toString();
    }

    public static void main(String[] args) {
        String raw = "GATTACAGATTACA";
        String packed = encode(raw);
        String back = decode(packed);
        int in = raw.length() * 8, out = packed.length();   // sizes in bits
        System.out.println("raw data   : " + raw + " -&gt; " + in + " bits as 8-bit ASCII");
        System.out.println("encoding   : " + packed + " -&gt; " + out + " bits");
        System.out.println("decoding   : " + back);
        System.out.println("same as the raw data? " + back.equals(raw));
        System.out.println(String.format(Locale.US, "saved: (%d - %d) / %d = %.0f%%", in, out, in, 100.0 * (in - out) / in));
    }
}</code></pre>
<div class="out">raw data &nbsp;&nbsp;: GATTACAGATTACA -&gt; 112 bits as 8-bit ASCII<br>
encoding &nbsp;&nbsp;: 1000111100010010001111000100 -&gt; 28 bits<br>
decoding &nbsp;&nbsp;: GATTACAGATTACA<br>
same as the raw data? true<br>
saved: (112 - 28) / 112 = 75%</div>
<p><strong>Big-O:</strong> encoding and decoding each visit every letter once — O(n) — work that the uncompressed file never needed.</p>
<p class="meo">🧠 <strong>Remember:</strong> compression trades CPU time for space — you pay once to encode, and again at every decode.</p>`,
        `<p class="y-chinh">🎯 Nén dữ liệu (data compression), còn gọi là mã hoá nguồn (source coding), biểu diễn thông tin bằng ít bit hơn cách lưu thông thường: tiết kiệm chỗ lưu và băng thông (bandwidth), nhưng tốn thời gian xử lý để mã hoá và, mỗi lần cần dùng dữ liệu, để giải mã.</p>
<ul>
<li><strong>Sơ đồ trên slide</strong>: dữ liệu gốc (raw data) → <em>mã hoá</em> (encoding) → dữ liệu nén (compressed data) → <em>giải mã</em> (decoding) → lại là dữ liệu ban đầu.</li>
<li><strong>Vì sao nén</strong>: tệp trên đĩa nhỏ hơn, truyền qua mạng nhanh hơn — "lượng tiêu thụ bộ nhớ lưu trữ hoặc băng thông" giảm xuống.</li>
<li><strong>Cái giá</strong>: thời gian CPU — dữ liệu phải được giải mã rồi mới đọc, xem hay tìm kiếm được.</li>
<li><strong>Ý tưởng chung của mọi phương pháp</strong>: văn bản thường tiêu đúng 8 bit cho mỗi ký tự; một bộ mã thiết kế riêng cho dữ liệu có thể tiêu ít hơn.</li>
</ul>
<p>Ví dụ của bài — chuỗi DNA ở slide 3 chỉ dùng 4 chữ cái, nên mỗi chữ chỉ cần 2 bit thay vì 8:</p>
<pre><code class="language-java">import java.util.Locale;

public class DnaTwoBits {
    static final String BASES = "ACGT";              // mã 00, 01, 10, 11

    static String encode(String dna) {               // văn bản gốc -&gt; dãy bit
        StringBuilder bits = new StringBuilder();
        for (char c : dna.toCharArray()) {
            int k = BASES.indexOf(c);
            bits.append(k / 2).append(k % 2);        // 2 bit mỗi chữ
        }
        return bits.toString();
    }

    static String decode(String bits) {              // dãy bit -&gt; văn bản
        StringBuilder dna = new StringBuilder();
        for (int i = 0; i &lt; bits.length(); i += 2)
            dna.append(BASES.charAt((bits.charAt(i) - '0') * 2 + (bits.charAt(i + 1) - '0')));
        return dna.toString();
    }

    public static void main(String[] args) {
        String raw = "GATTACAGATTACA";
        String packed = encode(raw);
        String back = decode(packed);
        int in = raw.length() * 8, out = packed.length();   // kích thước tính bằng bit
        System.out.println("raw data   : " + raw + " -&gt; " + in + " bits as 8-bit ASCII");
        System.out.println("encoding   : " + packed + " -&gt; " + out + " bits");
        System.out.println("decoding   : " + back);
        System.out.println("same as the raw data? " + back.equals(raw));
        System.out.println(String.format(Locale.US, "saved: (%d - %d) / %d = %.0f%%", in, out, in, 100.0 * (in - out) / in));
    }
}</code></pre>
<div class="out">raw data &nbsp;&nbsp;: GATTACAGATTACA -&gt; 112 bits as 8-bit ASCII<br>
encoding &nbsp;&nbsp;: 1000111100010010001111000100 -&gt; 28 bits<br>
decoding &nbsp;&nbsp;: GATTACAGATTACA<br>
same as the raw data? true<br>
saved: (112 - 28) / 112 = 75%</div>
<p><strong>Big-O:</strong> mã hoá và giải mã mỗi bên đi qua từng chữ một lần — O(n) — đây là phần việc mà tệp không nén không bao giờ phải làm.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nén là đổi thời gian CPU lấy chỗ lưu — trả một lần khi mã hoá, và trả tiếp mỗi lần giải mã.</p>`],
      [17, 'Data Compression - 2: Types of compression',
        `<p class="y-chinh">🎯 Compression is either lossy (MP3, JPG — some detail is thrown away for good) or lossless (ZIP, GZ — the exact original comes back); the deck's three algorithms — Huffman, Lempel–Ziv, RLE — are all lossless.</p>
<ul>
<li><strong>Lossy</strong>: drops what the eye or ear hardly notices, so it compresses much harder — but decode(encode(x)) ≠ x.</li>
<li><strong>Lossless</strong>: decode(encode(x)) = x, bit for bit — the only choice for text, source code, databases, programs.</li>
<li><strong>"Performance of compression depends on file types"</strong>: the same method can shrink one file and enlarge another.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class CompressionTypes {
    static String rle(String s) {                    // "WWWB" -&gt; "3W1B" (slide 36)
        StringBuilder out = new StringBuilder();
        for (int i = 0, j; i &lt; s.length(); i = j) {
            for (j = i; j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i); j++) { }
            out.append(j - i).append(s.charAt(i));
        }
        return out.toString();
    }

    static String unrle(String s) {
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) count = count * 10 + (c - '0');
            else { for (int k = 0; k &lt; count; k++) out.append(c); count = 0; }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        int[] samples = {12, 17, 23, 58, 61};        // e.g. sound samples
        int[] kept = new int[samples.length];
        for (int i = 0; i &lt; samples.length; i++) kept[i] = Math.round(samples[i] / 10.0f);   // lossy: keep only the tens
        int[] back = new int[samples.length];
        for (int i = 0; i &lt; samples.length; i++) back[i] = kept[i] * 10;
        System.out.println("lossy   : " + Arrays.toString(samples) + " -&gt; " + Arrays.toString(kept) + " -&gt; " + Arrays.toString(back)
                + "  restored exactly? " + Arrays.equals(samples, back));
        String row = "WWWWWWWWWWBBBBBWWWWW";                // one row of a black-and-white picture
        String packed = rle(row);
        System.out.println("lossless: " + row + " -&gt; " + packed + " -&gt; restored exactly? " + unrle(packed).equals(row));
        String word = "COMPRESSION";
        System.out.println("RLE on the picture row: " + row.length() + " -&gt; " + packed.length() + " characters");
        System.out.println("RLE on a word         : " + word.length() + " -&gt; " + rle(word).length() + " characters (" + rle(word) + ")");
    }
}</code></pre>
<div class="out">lossy &nbsp;&nbsp;: [12, 17, 23, 58, 61] -&gt; [1, 2, 2, 6, 6] -&gt; [10, 20, 20, 60, 60] &nbsp;restored exactly? false<br>
lossless: WWWWWWWWWWBBBBBWWWWW -&gt; 10W5B5W -&gt; restored exactly? true<br>
RLE on the picture row: 20 -&gt; 7 characters<br>
RLE on a word &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 11 -&gt; 20 characters (1C1O1M1P1R1E2S1I1O1N)</div>
<ul>
<li>Line 1 imitates a lossy codec: storing only the tens gives smaller numbers, and the original values are gone for good.</li>
<li>Lines 2–4 use RLE (slide 36): a picture row with long runs shrinks from 20 to 7 characters; the word COMPRESSION grows from 11 to 20.</li>
</ul>
<div class="pitfall">"ZIP is lossy because the file gets smaller" is false — size says nothing about loss; the test is whether decoding returns exactly the original. The pairs to know for the FE: lossy = MP3, JPG; lossless = ZIP, GZ and every algorithm of this chapter.</div>`,
        `<p class="y-chinh">🎯 Nén có hai loại: mất mát (lossy — MP3, JPG, một phần chi tiết bị vứt đi vĩnh viễn) và không mất mát (lossless — ZIP, GZ, lấy lại đúng nguyên bản); ba thuật toán của bộ slide — Huffman, Lempel–Ziv, RLE (mã hoá độ dài loạt) — đều không mất mát.</p>
<ul>
<li><strong>Mất mát (lossy)</strong>: bỏ đi những gì mắt hay tai khó nhận ra, nên nén mạnh hơn nhiều — nhưng giải mã(mã hoá(x)) ≠ x.</li>
<li><strong>Không mất mát (lossless)</strong>: giải mã(mã hoá(x)) = x, đúng từng bit — lựa chọn duy nhất cho văn bản, mã nguồn, cơ sở dữ liệu, chương trình.</li>
<li><strong>"Hiệu quả nén phụ thuộc loại tệp" (performance depends on file types)</strong>: cùng một phương pháp có thể làm tệp này nhỏ đi và tệp kia to ra.</li>
</ul>
<pre><code class="language-java">import java.util.Arrays;

public class CompressionTypes {
    static String rle(String s) {                    // "WWWB" -&gt; "3W1B" (slide 36)
        StringBuilder out = new StringBuilder();
        for (int i = 0, j; i &lt; s.length(); i = j) {
            for (j = i; j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i); j++) { }
            out.append(j - i).append(s.charAt(i));
        }
        return out.toString();
    }

    static String unrle(String s) {
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) count = count * 10 + (c - '0');
            else { for (int k = 0; k &lt; count; k++) out.append(c); count = 0; }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        int[] samples = {12, 17, 23, 58, 61};        // ví dụ các mẫu âm thanh
        int[] kept = new int[samples.length];
        for (int i = 0; i &lt; samples.length; i++) kept[i] = Math.round(samples[i] / 10.0f);   // mất mát: chỉ giữ hàng chục
        int[] back = new int[samples.length];
        for (int i = 0; i &lt; samples.length; i++) back[i] = kept[i] * 10;
        System.out.println("lossy   : " + Arrays.toString(samples) + " -&gt; " + Arrays.toString(kept) + " -&gt; " + Arrays.toString(back)
                + "  restored exactly? " + Arrays.equals(samples, back));
        String row = "WWWWWWWWWWBBBBBWWWWW";                // một hàng của ảnh đen trắng
        String packed = rle(row);
        System.out.println("lossless: " + row + " -&gt; " + packed + " -&gt; restored exactly? " + unrle(packed).equals(row));
        String word = "COMPRESSION";
        System.out.println("RLE on the picture row: " + row.length() + " -&gt; " + packed.length() + " characters");
        System.out.println("RLE on a word         : " + word.length() + " -&gt; " + rle(word).length() + " characters (" + rle(word) + ")");
    }
}</code></pre>
<div class="out">lossy &nbsp;&nbsp;: [12, 17, 23, 58, 61] -&gt; [1, 2, 2, 6, 6] -&gt; [10, 20, 20, 60, 60] &nbsp;restored exactly? false<br>
lossless: WWWWWWWWWWBBBBBWWWWW -&gt; 10W5B5W -&gt; restored exactly? true<br>
RLE on the picture row: 20 -&gt; 7 characters<br>
RLE on a word &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 11 -&gt; 20 characters (1C1O1M1P1R1E2S1I1O1N)</div>
<ul>
<li>Dòng 1 bắt chước một bộ nén mất mát: chỉ giữ hàng chục cho ra các số nhỏ hơn, còn giá trị gốc thì mất hẳn.</li>
<li>Dòng 2–4 dùng RLE (mã hoá độ dài loạt, slide 36): một hàng ảnh có loạt dài co từ 20 xuống 7 ký tự; từ COMPRESSION lại phình từ 11 lên 20.</li>
</ul>
<div class="pitfall">"ZIP là nén mất mát vì tệp nhỏ đi" là SAI — kích thước không nói gì về mất mát; phép thử là giải mã có trả lại đúng nguyên bản hay không. Các cặp cần nhớ cho đề thi cuối kỳ (FE): mất mát = MP3, JPG; không mất mát = ZIP, GZ và mọi thuật toán của chương này.</div>`],
      [18, 'Entropy and compression rate',
        `<p class="y-chinh">🎯 Entropy measures the information content of a source — H = P(x1)L(x1) + … + P(xn)L(xn) with L(xi) = −log2 P(xi) — and no lossless code can beat it on average; the compression rate measures how much a real method saves.</p>
<ul>
<li><strong>L(xi) = −log2 P(xi)</strong>: the ideal codeword length for symbol xi (Shannon, 1948) — rare symbols (small P) deserve long codes, frequent ones short codes.</li>
<li><strong>H</strong> is the average of these ideal lengths weighted by probability — the slide writes L<sub>ave</sub> = H, "an absolute limit on the best possible lossless compression".</li>
<li><strong>Codeword</strong>: the sequence of bits that a code assigns to one symbol.</li>
<li><strong>Compression rate</strong> = (length(input) − length(output)) / length(input): the fraction saved, used to compare methods on the same data.</li>
<li>The slide's first line says "compress data by <em>decoding</em> symbols" — read it as <em>encoding</em> them (slide 16's arrow).</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class EntropyRate {
    static double log2(double x) { return Math.log(x) / Math.log(2); }

    public static void main(String[] args) {
        String sym = "ABCDEF";
        double[] P = {.20, .09, .15, .11, .40, .05};     // the frequencies of slide 23
        double H = 0;
        for (int i = 0; i &lt; P.length; i++) {
            double L = -log2(P[i]);                      // ideal codeword length L(xi)
            H += P[i] * L;                               // H = P(x1)L(x1) + ... + P(xn)L(xn)
            System.out.println(String.format(Locale.US, "%c: P = %.2f   L = -log2 P = %.2f bits", sym.charAt(i), P[i], L));
        }
        System.out.println(String.format(Locale.US, "entropy H = %.2f bits per symbol", H));
        System.out.println("fixed-length code: 3 bits per symbol (2^3 = 8 &gt;= 6 symbols)");
        // rate = (length(input) - length(output)) / length(input)
        System.out.println(String.format(Locale.US, "RLE of slide 36: (25 - 12) / 25 = %.0f%%", 100.0 * (25 - 12) / 25));
    }
}</code></pre>
<div class="out">A: P = 0.20 &nbsp;&nbsp;L = -log2 P = 2.32 bits<br>
B: P = 0.09 &nbsp;&nbsp;L = -log2 P = 3.47 bits<br>
C: P = 0.15 &nbsp;&nbsp;L = -log2 P = 2.74 bits<br>
D: P = 0.11 &nbsp;&nbsp;L = -log2 P = 3.18 bits<br>
E: P = 0.40 &nbsp;&nbsp;L = -log2 P = 1.32 bits<br>
F: P = 0.05 &nbsp;&nbsp;L = -log2 P = 4.32 bits<br>
entropy H = 2.28 bits per symbol<br>
fixed-length code: 3 bits per symbol (2^3 = 8 &gt;= 6 symbols)<br>
RLE of slide 36: (25 - 12) / 25 = 52%</div>
<p>For the frequencies of the Huffman example (slide 23), H ≈ 2.28: any lossless code for this source needs at least 2.28 bits per symbol on average, where a fixed-length code spends 3. Slide 30 measures Huffman against this number.</p>
<div class="pitfall">The rate is saved ÷ original, so bigger is better: 52% means the output is 48% of the input. Some books call output ÷ input (or input ÷ output) the "compression ratio" — use the formula the question gives.</div>`,
        `<p class="y-chinh">🎯 Entropy (lượng tin trung bình) đo lượng thông tin của một nguồn — H = P(x1)L(x1) + … + P(xn)L(xn) với L(xi) = −log2 P(xi) — và không bộ mã không mất mát nào thắng được nó về trung bình; còn tỉ lệ nén (compression rate) đo một phương pháp thật tiết kiệm được bao nhiêu.</p>
<ul>
<li><strong>L(xi) = −log2 P(xi)</strong>: độ dài từ mã lý tưởng của ký hiệu xi (Shannon, 1948) — ký hiệu hiếm (P nhỏ) đáng nhận mã dài, ký hiệu hay gặp nhận mã ngắn.</li>
<li><strong>H</strong> là trung bình của các độ dài lý tưởng này, có trọng số là xác suất — slide viết L<sub>ave</sub> = H, "giới hạn tuyệt đối của việc nén không mất mát tốt nhất có thể".</li>
<li><strong>Từ mã (codeword)</strong>: dãy bit mà bộ mã gán cho một ký hiệu.</li>
<li><strong>Tỉ lệ nén</strong> = (độ dài đầu vào − độ dài đầu ra) / độ dài đầu vào: phần tiết kiệm được, dùng để so các phương pháp trên cùng một dữ liệu.</li>
<li>Dòng đầu của slide viết "compress data by <em>decoding</em> symbols" (nén bằng cách giải mã ký hiệu) — hãy đọc là <em>mã hoá</em> (encoding) các ký hiệu (mũi tên ở slide 16).</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class EntropyRate {
    static double log2(double x) { return Math.log(x) / Math.log(2); }

    public static void main(String[] args) {
        String sym = "ABCDEF";
        double[] P = {.20, .09, .15, .11, .40, .05};     // tần suất của slide 23
        double H = 0;
        for (int i = 0; i &lt; P.length; i++) {
            double L = -log2(P[i]);                      // độ dài từ mã lý tưởng L(xi)
            H += P[i] * L;                               // H = P(x1)L(x1) + ... + P(xn)L(xn)
            System.out.println(String.format(Locale.US, "%c: P = %.2f   L = -log2 P = %.2f bits", sym.charAt(i), P[i], L));
        }
        System.out.println(String.format(Locale.US, "entropy H = %.2f bits per symbol", H));
        System.out.println("fixed-length code: 3 bits per symbol (2^3 = 8 &gt;= 6 symbols)");
        // tỉ lệ = (độ dài vào - độ dài ra) / độ dài vào
        System.out.println(String.format(Locale.US, "RLE of slide 36: (25 - 12) / 25 = %.0f%%", 100.0 * (25 - 12) / 25));
    }
}</code></pre>
<div class="out">A: P = 0.20 &nbsp;&nbsp;L = -log2 P = 2.32 bits<br>
B: P = 0.09 &nbsp;&nbsp;L = -log2 P = 3.47 bits<br>
C: P = 0.15 &nbsp;&nbsp;L = -log2 P = 2.74 bits<br>
D: P = 0.11 &nbsp;&nbsp;L = -log2 P = 3.18 bits<br>
E: P = 0.40 &nbsp;&nbsp;L = -log2 P = 1.32 bits<br>
F: P = 0.05 &nbsp;&nbsp;L = -log2 P = 4.32 bits<br>
entropy H = 2.28 bits per symbol<br>
fixed-length code: 3 bits per symbol (2^3 = 8 &gt;= 6 symbols)<br>
RLE of slide 36: (25 - 12) / 25 = 52%</div>
<p>Với tần suất của ví dụ Huffman (slide 23), H ≈ 2.28: mọi bộ mã không mất mát cho nguồn này cần trung bình ít nhất 2.28 bit mỗi ký hiệu, trong khi mã độ dài cố định (fixed-length code) tốn 3. Slide 30 sẽ đem Huffman ra so với con số này.</p>
<div class="pitfall">Tỉ lệ nén = phần tiết kiệm ÷ bản gốc, nên càng lớn càng tốt: 52% nghĩa là đầu ra bằng 48% đầu vào. Có sách gọi đầu ra ÷ đầu vào (hoặc ngược lại) là "compression ratio" (hệ số nén) — hãy dùng đúng công thức đề bài cho.</div>`],
      [19, 'Uniquely Decodable Codes',
        `<p class="y-chinh">🎯 A variable-length code gives symbols bit strings of different lengths; it is uniquely decodable only if every bit sequence splits into codewords in exactly one way — and the code a = 1, b = 01, c = 101, d = 011 is not.</p>
<p class="dap-an">✅ <strong>Answer to the slide's question:</strong> 1011 is aba (1·01·1), ca (101·1) and ad (1·011) — all three. The receiver cannot tell which was sent, so this code is useless for compression.</p>
<pre><code class="language-java">public class AllParses {
    static String[] name = {"a", "b", "c", "d"};
    static String[] code = {"1", "01", "101", "011"};    // the code of slide 19

    // every way to cut the bits into codewords
    static void parse(String bits, String sofar, StringBuilder out) {
        if (bits.isEmpty()) { out.append(sofar).append(' '); return; }
        for (int i = 0; i &lt; code.length; i++)
            if (bits.startsWith(code[i])) parse(bits.substring(code[i].length()), sofar + name[i], out);
    }

    public static void main(String[] args) {
        for (String bits : new String[] {"1011", "01011"}) {
            StringBuilder out = new StringBuilder();
            parse(bits, "", out);
            System.out.println(bits + " can be read as: " + out.toString().trim());
        }
        for (int i = 0; i &lt; code.length; i++)            // why: some codeword starts another
            for (int j = 0; j &lt; code.length; j++)
                if (i != j &amp;&amp; code[j].startsWith(code[i]))
                    System.out.println(name[i] + " = " + code[i] + " is a prefix of " + name[j] + " = " + code[j]);
    }
}</code></pre>
<div class="out">1011 can be read as: aba ad ca<br>
01011 can be read as: bba bd<br>
a = 1 is a prefix of c = 101<br>
b = 01 is a prefix of d = 011</div>
<ul>
<li>The program tries every codeword at the front of the bit string, recursively; each complete split is one possible message.</li>
<li>The root cause, printed at the end: a = 1 is the beginning of c = 101, and b = 01 is the beginning of d = 011 — after reading "1", the decoder cannot know whether the symbol has ended.</li>
<li>The cure is slide 20: forbid any codeword to be the beginning (prefix) of another.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> variable length is what saves space, and exactly what makes decoding risky — the code itself must tell the reader where each symbol ends.</p>`,
        `<p class="y-chinh">🎯 Mã độ dài thay đổi (variable-length code) gán cho các ký hiệu những dãy bit dài ngắn khác nhau; nó chỉ giải được duy nhất (uniquely decodable) nếu mọi dãy bit chỉ tách được thành các từ mã theo đúng một cách — và bộ mã a = 1, b = 01, c = 101, d = 011 thì không.</p>
<p class="dap-an">✅ <strong>Đáp án câu hỏi của slide:</strong> 1011 là aba (1·01·1), là ca (101·1) và là ad (1·011) — cả ba. Bên nhận không biết bên gửi muốn nói gì, nên bộ mã này vô dụng để nén.</p>
<pre><code class="language-java">public class AllParses {
    static String[] name = {"a", "b", "c", "d"};
    static String[] code = {"1", "01", "101", "011"};    // bộ mã của slide 19

    // mọi cách cắt dãy bit thành các từ mã
    static void parse(String bits, String sofar, StringBuilder out) {
        if (bits.isEmpty()) { out.append(sofar).append(' '); return; }
        for (int i = 0; i &lt; code.length; i++)
            if (bits.startsWith(code[i])) parse(bits.substring(code[i].length()), sofar + name[i], out);
    }

    public static void main(String[] args) {
        for (String bits : new String[] {"1011", "01011"}) {
            StringBuilder out = new StringBuilder();
            parse(bits, "", out);
            System.out.println(bits + " can be read as: " + out.toString().trim());
        }
        for (int i = 0; i &lt; code.length; i++)            // lý do: có từ mã là phần đầu của từ mã khác
            for (int j = 0; j &lt; code.length; j++)
                if (i != j &amp;&amp; code[j].startsWith(code[i]))
                    System.out.println(name[i] + " = " + code[i] + " is a prefix of " + name[j] + " = " + code[j]);
    }
}</code></pre>
<div class="out">1011 can be read as: aba ad ca<br>
01011 can be read as: bba bd<br>
a = 1 is a prefix of c = 101<br>
b = 01 is a prefix of d = 011</div>
<ul>
<li>Chương trình thử đặt từng từ mã (codeword) ở đầu dãy bit, rồi đệ quy (recursive) phần còn lại; mỗi cách tách trọn vẹn là một thông điệp có thể.</li>
<li>Nguyên nhân gốc, in ở cuối: a = 1 là phần đầu của c = 101, và b = 01 là phần đầu của d = 011 — đọc xong "1", bộ giải mã không biết ký hiệu đã kết thúc hay chưa.</li>
<li>Cách chữa là slide 20: cấm mọi từ mã làm phần đầu (tiền tố — prefix) của từ mã khác.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> độ dài thay đổi là thứ giúp tiết kiệm chỗ, và cũng chính là thứ làm việc giải mã nguy hiểm — bản thân bộ mã phải cho người đọc biết mỗi ký hiệu kết thúc ở đâu.</p>`],
      [20, 'Prefix Codes',
        `<p class="y-chinh">🎯 A prefix code is a variable-length code in which no codeword is a prefix of another — like a = 0, b = 110, c = 111, d = 10 — and it can be drawn as a binary tree with the symbols at the leaves and 0 or 1 on the edges.</p>
<p>The tree that these four codewords determine (0 = go left, 1 = go right):</p>
<pre><code class="language-plaintext">(root)
0/   \\1
a    ( )
    0/   \\1
    d    ( )
        0/   \\1
        b     c</code></pre>
<ul>
<li>Every symbol is a <strong>leaf</strong>, so no codeword lies on the path to another — exactly "no codeword is a prefix of another".</li>
<li><strong>Decoding</strong>: read bits and walk down from the root; at a leaf, output its symbol and jump back to the root — no separators needed.</li>
<li>Every prefix code is uniquely decodable, and it decodes instantly, left to right, with no looking ahead:</li>
</ul>
<pre><code class="language-java">public class PrefixDecode {
    static String[] sym = {"a", "b", "c", "d"};
    static String[] code = {"0", "110", "111", "10"};    // the prefix code of slide 20

    static String encode(String msg) {
        StringBuilder bits = new StringBuilder();
        for (char ch : msg.toCharArray()) bits.append(code[ch - 'a']);
        return bits.toString();
    }

    // read bits until they spell a whole codeword: with a prefix code it can only be that one
    static String decode(String bits, StringBuilder cuts) {
        StringBuilder cur = new StringBuilder(), out = new StringBuilder();
        for (char b : bits.toCharArray()) {
            cur.append(b);
            for (int i = 0; i &lt; code.length; i++)
                if (code[i].contentEquals(cur)) {
                    out.append(sym[i]);
                    cuts.append(cur).append('|');
                    cur.setLength(0);
                    break;
                }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        for (String msg : new String[] {"abcad", "dcaa"}) {
            String bits = encode(msg);
            StringBuilder cuts = new StringBuilder();
            String back = decode(bits, cuts);
            System.out.println(msg + " -&gt; " + bits + " -&gt; cut as " + cuts + " -&gt; " + back);
        }
        boolean prefixFree = true;
        for (int i = 0; i &lt; code.length; i++)
            for (int j = 0; j &lt; code.length; j++)
                if (i != j &amp;&amp; code[j].startsWith(code[i])) prefixFree = false;
        System.out.println("no codeword is a prefix of another: " + prefixFree);
    }
}</code></pre>
<div class="out">abcad -&gt; 0110111010 -&gt; cut as 0|110|111|0|10| -&gt; abcad<br>
dcaa -&gt; 1011100 -&gt; cut as 10|111|0|0| -&gt; dcaa<br>
no codeword is a prefix of another: true</div>
<div class="pitfall">The converse is false: a uniquely decodable code need not be a prefix code (a = 1, b = 10 is uniquely decodable, although 1 is a prefix of 10 — the decoder must peek at the next bit). And putting a symbol on an internal node of the tree breaks the prefix property at once.</div>`,
        `<p class="y-chinh">🎯 Mã tiền tố (prefix code) là mã độ dài thay đổi trong đó không từ mã nào là phần đầu (tiền tố) của từ mã khác — như a = 0, b = 110, c = 111, d = 10 — và vẽ được thành một cây nhị phân (binary tree) có các ký hiệu ở lá (leaf), còn 0 hoặc 1 ghi trên các cạnh.</p>
<p>Cây mà bốn từ mã này xác định (0 = rẽ trái, 1 = rẽ phải):</p>
<pre><code class="language-plaintext">(gốc)
0/   \\1
a    ( )
    0/   \\1
    d    ( )
        0/   \\1
        b     c</code></pre>
<ul>
<li>Mọi ký hiệu đều là <strong>lá</strong>, nên không từ mã nào nằm trên đường đi tới từ mã khác — chính là "không từ mã nào là tiền tố của từ mã khác".</li>
<li><strong>Giải mã (decoding)</strong>: đọc từng bit và đi xuống từ gốc; tới lá thì xuất ký hiệu của lá rồi nhảy về gốc — không cần dấu phân cách.</li>
<li>Mọi mã tiền tố đều giải được duy nhất (uniquely decodable), và giải được ngay lập tức, từ trái sang phải, không cần nhìn trước:</li>
</ul>
<pre><code class="language-java">public class PrefixDecode {
    static String[] sym = {"a", "b", "c", "d"};
    static String[] code = {"0", "110", "111", "10"};    // mã tiền tố của slide 20

    static String encode(String msg) {
        StringBuilder bits = new StringBuilder();
        for (char ch : msg.toCharArray()) bits.append(code[ch - 'a']);
        return bits.toString();
    }

    // đọc bit tới khi thành trọn một từ mã: với mã tiền tố thì chỉ có thể là từ mã đó
    static String decode(String bits, StringBuilder cuts) {
        StringBuilder cur = new StringBuilder(), out = new StringBuilder();
        for (char b : bits.toCharArray()) {
            cur.append(b);
            for (int i = 0; i &lt; code.length; i++)
                if (code[i].contentEquals(cur)) {
                    out.append(sym[i]);
                    cuts.append(cur).append('|');
                    cur.setLength(0);
                    break;
                }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        for (String msg : new String[] {"abcad", "dcaa"}) {
            String bits = encode(msg);
            StringBuilder cuts = new StringBuilder();
            String back = decode(bits, cuts);
            System.out.println(msg + " -&gt; " + bits + " -&gt; cut as " + cuts + " -&gt; " + back);
        }
        boolean prefixFree = true;
        for (int i = 0; i &lt; code.length; i++)
            for (int j = 0; j &lt; code.length; j++)
                if (i != j &amp;&amp; code[j].startsWith(code[i])) prefixFree = false;
        System.out.println("no codeword is a prefix of another: " + prefixFree);
    }
}</code></pre>
<div class="out">abcad -&gt; 0110111010 -&gt; cut as 0|110|111|0|10| -&gt; abcad<br>
dcaa -&gt; 1011100 -&gt; cut as 10|111|0|0| -&gt; dcaa<br>
no codeword is a prefix of another: true</div>
<div class="pitfall">Chiều ngược lại SAI: mã giải được duy nhất chưa chắc là mã tiền tố (a = 1, b = 10 giải được duy nhất, dù 1 là tiền tố của 10 — bộ giải mã phải nhìn trước bit kế tiếp). Và đặt một ký hiệu ở nút trong (internal node) của cây là phá hỏng tính chất tiền tố ngay.</div>`],
      [21, 'Average Length',
        `<p class="y-chinh">🎯 The average length of a code C weights each codeword's length by its probability, la(C) = Σ p(c)·l(c); a prefix code is optimal when no other prefix code has a smaller average — and the Huffman code is provably optimal.</p>
<p class="ghi-chu">On the slide the formula and the comparison are drawn as equations; written out below is the standard definition that the slide's sentences describe.</p>
<ul>
<li><strong>la(C) = Σ p(c)·l(c)</strong>, summed over the codewords c of C, where l(c) is the number of bits of c.</li>
<li><strong>Optimal</strong>: C is optimal if la(C) ≤ la(C') for every prefix code C' for the same symbols and probabilities.</li>
<li><strong>Huffman</strong> is optimal "under certain well-defined conditions": one codeword per symbol, probabilities known in advance — the setting of slides 22–31.</li>
</ul>
<p>The lesson's own probabilities for slide 20's symbols — P(a) = .5, P(b) = .125, P(c) = .125, P(d) = .25:</p>
<pre><code class="language-java">import java.util.Locale;

public class AverageLength {
    static double[] p = {0.5, 0.125, 0.125, 0.25};       // P(a), P(b), P(c), P(d): the lesson's own example

    static double la(String[] code) {                    // la(C) = sum of p(c) * length(c)
        double s = 0;
        for (int i = 0; i &lt; code.length; i++) s += p[i] * code[i].length();
        return s;
    }

    public static void main(String[] args) {
        String[] slide20 = {"0", "110", "111", "10"};    // a, b, c, d as on slide 20
        String[] fixed = {"00", "01", "10", "11"};       // fixed length
        String[] swapped = {"111", "110", "0", "10"};    // same codewords, a and c swapped
        double H = 0;
        for (double x : p) H -= x * Math.log(x) / Math.log(2);
        System.out.println(String.format(Locale.US, "slide 20 code a=0 b=110 c=111 d=10 : la = %.3f bits", la(slide20)));
        System.out.println(String.format(Locale.US, "fixed code    a=00 b=01 c=10 d=11  : la = %.3f bits", la(fixed)));
        System.out.println(String.format(Locale.US, "swapped code  a=111 b=110 c=0 d=10 : la = %.3f bits", la(swapped)));
        System.out.println(String.format(Locale.US, "entropy H = %.3f bits: the slide 20 code reaches it here", H));
    }
}</code></pre>
<div class="out">slide 20 code a=0 b=110 c=111 d=10 : la = 1.750 bits<br>
fixed code &nbsp;&nbsp;&nbsp;a=00 b=01 c=10 d=11 &nbsp;: la = 2.000 bits<br>
swapped code &nbsp;a=111 b=110 c=0 d=10 : la = 2.500 bits<br>
entropy H = 1.750 bits: the slide 20 code reaches it here</div>
<p>The same four codewords give 1.75 or 2.5 bits depending on which symbol gets the short ones; here 1.75 even equals the entropy, because every probability is a power of 1/2.</p>
<div class="pitfall">The average length is not the plain mean of the codeword lengths: (1 + 3 + 3 + 2) / 4 = 2.25 ignores the probabilities. Multiply each length by its probability first.</div>`,
        `<p class="y-chinh">🎯 Độ dài trung bình (average length) của bộ mã C lấy độ dài từng từ mã nhân với xác suất của nó, la(C) = Σ p(c)·l(c); một mã tiền tố là tối ưu (optimal) khi không mã tiền tố nào khác có trung bình nhỏ hơn — và mã Huffman được chứng minh là tối ưu.</p>
<p class="ghi-chu">Trên slide, công thức và phép so sánh được vẽ thành phương trình; dưới đây viết ra định nghĩa chuẩn mà các câu chữ trên slide mô tả.</p>
<ul>
<li><strong>la(C) = Σ p(c)·l(c)</strong>, lấy tổng trên các từ mã (codeword) c của C, với l(c) là số bit của c.</li>
<li><strong>Tối ưu</strong>: C tối ưu nếu la(C) ≤ la(C') với mọi mã tiền tố (prefix code) C' cho cùng các ký hiệu và xác suất.</li>
<li><strong>Huffman</strong> tối ưu "trong những điều kiện xác định rõ": mỗi ký hiệu một từ mã, xác suất biết trước — đúng bối cảnh của slide 22–31.</li>
</ul>
<p>Xác suất của ví dụ của bài cho các ký hiệu ở slide 20 — P(a) = .5, P(b) = .125, P(c) = .125, P(d) = .25:</p>
<pre><code class="language-java">import java.util.Locale;

public class AverageLength {
    static double[] p = {0.5, 0.125, 0.125, 0.25};       // P(a), P(b), P(c), P(d): ví dụ của bài

    static double la(String[] code) {                    // la(C) = tổng p(c) * độ dài(c)
        double s = 0;
        for (int i = 0; i &lt; code.length; i++) s += p[i] * code[i].length();
        return s;
    }

    public static void main(String[] args) {
        String[] slide20 = {"0", "110", "111", "10"};    // a, b, c, d như slide 20
        String[] fixed = {"00", "01", "10", "11"};       // độ dài cố định
        String[] swapped = {"111", "110", "0", "10"};    // cùng các từ mã, đổi chỗ a và c
        double H = 0;
        for (double x : p) H -= x * Math.log(x) / Math.log(2);
        System.out.println(String.format(Locale.US, "slide 20 code a=0 b=110 c=111 d=10 : la = %.3f bits", la(slide20)));
        System.out.println(String.format(Locale.US, "fixed code    a=00 b=01 c=10 d=11  : la = %.3f bits", la(fixed)));
        System.out.println(String.format(Locale.US, "swapped code  a=111 b=110 c=0 d=10 : la = %.3f bits", la(swapped)));
        System.out.println(String.format(Locale.US, "entropy H = %.3f bits: the slide 20 code reaches it here", H));
    }
}</code></pre>
<div class="out">slide 20 code a=0 b=110 c=111 d=10 : la = 1.750 bits<br>
fixed code &nbsp;&nbsp;&nbsp;a=00 b=01 c=10 d=11 &nbsp;: la = 2.000 bits<br>
swapped code &nbsp;a=111 b=110 c=0 d=10 : la = 2.500 bits<br>
entropy H = 1.750 bits: the slide 20 code reaches it here</div>
<p>Cùng bốn từ mã mà cho 1.75 hay 2.5 bit, tuỳ ký hiệu nào nhận các mã ngắn; ở đây 1.75 còn bằng đúng entropy (lượng tin trung bình), vì mọi xác suất đều là luỹ thừa của 1/2.</p>
<div class="pitfall">Độ dài trung bình không phải trung bình cộng các độ dài từ mã: (1 + 3 + 3 + 2) / 4 = 2.25 là bỏ quên xác suất. Phải nhân mỗi độ dài với xác suất của nó trước.</div>`],
      [22, 'Huffman Coding algorithm',
        `<p class="y-chinh">🎯 Huffman's main idea: encode high-probability symbols with fewer bits, by repeatedly joining the two least probable nodes under a new node until a single tree remains.</p>
<ol>
<li>Make a leaf node for each symbol.</li>
<li>Give each leaf its probability (or frequency); the slide lays them out left to right in descending order.</li>
<li>Take the two nodes with the smallest probabilities and connect them under a new node.</li>
<li>Label the two branches 0 and 1.</li>
<li>The new node's probability is the sum of the two.</li>
<li>If only one node is left, the code is finished; otherwise go back to step 2.</li>
</ol>
<p>A <code>PriorityQueue</code> (a min-heap, chapter 4) hands out the two smallest nodes directly — the loop below is steps 3–6, from the program run on slide 24:</p>
<pre><code class="language-java">int step = 0;
while (pq.size() &gt; 1) {                      // until one node is left
    Node x = pq.poll();                      // the smallest
    Node y = pq.poll();                      // the second smallest
    Node z = new Node(label(x.name, y.name), x.w + y.w, y, x);   // larger child on the left (bit 0), as on slide 29
    pq.add(z);                               // the new node goes back into the queue
    System.out.println("step " + (++step) + ": " + x.name + " " + p(x.w) + " + " + y.name + " " + p(y.w)
            + " -&gt; " + z.name + " " + p(z.w) + "   queue: " + show(pq));
}</code></pre>
<p><strong>Big-O:</strong> k symbols need k − 1 merges; each merge is two polls and one add on a heap, O(log k) each → O(k log k).</p>
<div class="pitfall">Step 3 says "two leaf nodes", but from the second merge on the two smallest may be merged nodes — slide 26 merges D with BF. Always take the two smallest <em>nodes</em> in the queue, leaves or not.</div>`,
        `<p class="y-chinh">🎯 Ý chính của Huffman: mã hoá ký hiệu có xác suất cao bằng ít bit hơn, bằng cách lặp lại việc nối hai nút có xác suất nhỏ nhất vào dưới một nút mới cho tới khi chỉ còn một cây.</p>
<ol>
<li>Tạo một nút lá (leaf) cho mỗi ký hiệu.</li>
<li>Ghi xác suất (probability) hoặc tần suất (frequency) vào mỗi lá; slide xếp chúng từ trái sang phải theo thứ tự giảm dần.</li>
<li>Lấy hai nút có xác suất nhỏ nhất, nối chúng vào dưới một nút mới.</li>
<li>Ghi 0 và 1 lên hai nhánh.</li>
<li>Xác suất của nút mới là tổng của hai nút đó.</li>
<li>Còn đúng một nút thì bộ mã đã xong; ngược lại quay về bước 2.</li>
</ol>
<p>Hàng đợi ưu tiên <code>PriorityQueue</code> (một đống nhỏ nhất — min-heap, chương 4) đưa ra ngay hai nút nhỏ nhất — vòng lặp dưới đây là bước 3–6, trích từ chương trình chạy ở slide 24:</p>
<pre><code class="language-java">int step = 0;
while (pq.size() &gt; 1) {                      // tới khi chỉ còn một nút
    Node x = pq.poll();                      // nhỏ nhất
    Node y = pq.poll();                      // nhỏ nhì
    Node z = new Node(label(x.name, y.name), x.w + y.w, y, x);   // con lớn hơn bên trái (bit 0), như slide 29
    pq.add(z);                               // nút mới quay lại hàng đợi
    System.out.println("step " + (++step) + ": " + x.name + " " + p(x.w) + " + " + y.name + " " + p(y.w)
            + " -&gt; " + z.name + " " + p(z.w) + "   queue: " + show(pq));
}</code></pre>
<p><strong>Big-O:</strong> k ký hiệu cần k − 1 lần gộp; mỗi lần gộp là hai lần lấy ra (poll) và một lần thêm (add) trên heap, mỗi thao tác O(log k) → O(k log k).</p>
<div class="pitfall">Bước 3 viết "hai nút lá", nhưng từ lần gộp thứ hai trở đi, hai nút nhỏ nhất có thể là nút đã gộp — slide 26 gộp D với BF. Luôn lấy hai <em>nút</em> nhỏ nhất trong hàng đợi, là lá hay không cũng vậy.</div>`],
      [23, 'Huffman Coding example - 1',
        `<p class="y-chinh">🎯 The example's input is the frequency of each of the six characters — A .20, B .09, C .15, D .11, E .40, F .05 — and it must be known for every character before the tree can be built.</p>
<ul>
<li><strong>Probability = count ÷ length</strong>: "A occurs 20 times in a 100-character document, 1000 times in a 5000-character document" — both are .20.</li>
<li><strong>"Also works if you use character counts"</strong>: the merges only compare and add numbers, so counts and probabilities give the same tree.</li>
<li><strong>"Must know the frequency of every character"</strong>: Huffman reads the input once to count, then once more to encode — two passes.</li>
<li>The six probabilities add up to 1.00.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class CharFrequencies {
    static final String SYM = "ABCDEF";
    static final int[] COUNT = {20, 9, 15, 11, 40, 5};   // per 100 characters, as on slide 23

    static String document(int copies) {                 // letters grouped, only the counts matter
        StringBuilder d = new StringBuilder();
        for (int c = 0; c &lt; copies; c++)
            for (int i = 0; i &lt; SYM.length(); i++)
                for (int k = 0; k &lt; COUNT[i]; k++) d.append(SYM.charAt(i));
        return d.toString();
    }

    static void report(String doc) {
        int[] freq = new int[256];                       // one counter per character code
        for (char c : doc.toCharArray()) freq[c]++;
        StringBuilder counts = new StringBuilder(), probs = new StringBuilder();
        for (char c : SYM.toCharArray()) {
            counts.append(c).append('=').append(freq[c]).append(' ');
            probs.append(c).append('=').append(String.format(Locale.US, "%.2f", (double) freq[c] / doc.length())).append(' ');
        }
        System.out.println(doc.length() + "-character document: " + counts.toString().trim());
        System.out.println("  probabilities: " + probs.toString().trim());
    }

    public static void main(String[] args) {
        report(document(1));                             // 100 characters
        report(document(50));                            // 5000 characters
    }
}</code></pre>
<div class="out">100-character document: A=20 B=9 C=15 D=11 E=40 F=5<br>
&nbsp;&nbsp;probabilities: A=0.20 B=0.09 C=0.15 D=0.11 E=0.40 F=0.05<br>
5000-character document: A=1000 B=450 C=750 D=550 E=2000 F=250<br>
&nbsp;&nbsp;probabilities: A=0.20 B=0.09 C=0.15 D=0.11 E=0.40 F=0.05</div>
<p>The program counts with an array indexed by the character itself, <code>freq[c]++</code> — the same statement as in slide 32's Huffman program.</p>
<div class="pitfall">The decoder needs the same tree, so a Huffman-compressed file must also carry the frequency table (or the codes). For a very short input this extra table can make the "compressed" file larger than the original.</div>`,
        `<p class="y-chinh">🎯 Đầu vào của ví dụ là tần suất (frequency) của sáu ký tự — A .20, B .09, C .15, D .11, E .40, F .05 — và phải biết tần suất của mọi ký tự trước khi dựng được cây.</p>
<ul>
<li><strong>Xác suất (probability) = số lần ÷ độ dài</strong>: "A xuất hiện 20 lần trong tài liệu 100 ký tự, 1000 lần trong tài liệu 5000 ký tự" — cả hai đều là .20.</li>
<li><strong>"Dùng số lần đếm (character counts) cũng được"</strong>: các lần gộp chỉ so sánh và cộng các con số, nên dùng số đếm hay xác suất đều ra cùng một cây.</li>
<li><strong>"Phải biết tần suất của mọi ký tự"</strong>: Huffman đọc đầu vào một lượt để đếm, rồi thêm một lượt nữa để mã hoá — hai lượt (two passes).</li>
<li>Sáu xác suất cộng lại bằng 1.00.</li>
</ul>
<pre><code class="language-java">import java.util.Locale;

public class CharFrequencies {
    static final String SYM = "ABCDEF";
    static final int[] COUNT = {20, 9, 15, 11, 40, 5};   // trên 100 ký tự, như slide 23

    static String document(int copies) {                 // các chữ xếp theo nhóm, chỉ số lần đếm là quan trọng
        StringBuilder d = new StringBuilder();
        for (int c = 0; c &lt; copies; c++)
            for (int i = 0; i &lt; SYM.length(); i++)
                for (int k = 0; k &lt; COUNT[i]; k++) d.append(SYM.charAt(i));
        return d.toString();
    }

    static void report(String doc) {
        int[] freq = new int[256];                       // một bộ đếm cho mỗi mã ký tự
        for (char c : doc.toCharArray()) freq[c]++;
        StringBuilder counts = new StringBuilder(), probs = new StringBuilder();
        for (char c : SYM.toCharArray()) {
            counts.append(c).append('=').append(freq[c]).append(' ');
            probs.append(c).append('=').append(String.format(Locale.US, "%.2f", (double) freq[c] / doc.length())).append(' ');
        }
        System.out.println(doc.length() + "-character document: " + counts.toString().trim());
        System.out.println("  probabilities: " + probs.toString().trim());
    }

    public static void main(String[] args) {
        report(document(1));                             // 100 ký tự
        report(document(50));                            // 5000 ký tự
    }
}</code></pre>
<div class="out">100-character document: A=20 B=9 C=15 D=11 E=40 F=5<br>
&nbsp;&nbsp;probabilities: A=0.20 B=0.09 C=0.15 D=0.11 E=0.40 F=0.05<br>
5000-character document: A=1000 B=450 C=750 D=550 E=2000 F=250<br>
&nbsp;&nbsp;probabilities: A=0.20 B=0.09 C=0.15 D=0.11 E=0.40 F=0.05</div>
<p>Chương trình đếm bằng một mảng lấy chính ký tự làm chỉ số, <code>freq[c]++</code> — đúng câu lệnh trong chương trình Huffman ở slide 32.</p>
<div class="pitfall">Bên giải mã cần đúng cây đó, nên tệp nén bằng Huffman phải mang theo cả bảng tần suất (hoặc bảng mã). Với đầu vào rất ngắn, phần bảng thêm vào này có thể làm tệp "đã nén" lớn hơn cả bản gốc.</div>`],
      [24, 'Huffman Coding example - 2',
        `<p class="y-chinh">🎯 The six symbols start as six one-node trees; the first move combines the two least common symbols into a new symbol string whose frequency is the sum of theirs.</p>
<p>The whole construction, printed by the program whose loop is on slide 22 — one line per merge, then the codes:</p>
<pre><code class="language-java">import java.util.Arrays;
import java.util.PriorityQueue;

class Node implements Comparable&lt;Node&gt; {
    String name;                                     // e.g. "BF"
    int w;                                           // probability in hundredths: .20 -&gt; 20
    Node left, right;

    Node(String name, int w, Node left, Node right) { this.name = name; this.w = w; this.left = left; this.right = right; }
    boolean isLeaf() { return left == null; }
    public int compareTo(Node o) { return w - o.w; }
}

public class HuffmanBuild {
    static final String ORDER = "BFDACE";            // names only: letters in the order the slides write them

    static String label(String x, String y) {
        StringBuilder s = new StringBuilder();
        for (char c : ORDER.toCharArray()) if (x.indexOf(c) &gt;= 0 || y.indexOf(c) &gt;= 0) s.append(c);
        return s.toString();
    }

    static String p(int w) { return w == 100 ? "1.00" : (w &lt; 10 ? ".0" : ".") + w; }

    static String show(PriorityQueue&lt;Node&gt; pq) {
        Node[] a = pq.toArray(new Node[0]);
        Arrays.sort(a);                              // print the queue in increasing order
        StringBuilder s = new StringBuilder();
        for (Node x : a) s.append(x.name).append(' ').append(p(x.w)).append("  ");
        return s.toString().trim();
    }

    static void codes(Node x, String code, String[] out) {
        if (x.isLeaf()) { out[x.name.charAt(0) - 'A'] = code; return; }
        codes(x.left, code + "0", out);              // left edge = 0
        codes(x.right, code + "1", out);             // right edge = 1
    }

    public static void main(String[] args) {
        String sym = "ABCDEF";
        int[] w = {20, 9, 15, 11, 40, 5};            // slide 23: A .20 B .09 C .15 D .11 E .40 F .05
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;();
        for (int i = 0; i &lt; sym.length(); i++) pq.add(new Node("" + sym.charAt(i), w[i], null, null));
        System.out.println("start : " + show(pq));
        int step = 0;
        while (pq.size() &gt; 1) {                      // until one node is left
            Node x = pq.poll();                      // the smallest
            Node y = pq.poll();                      // the second smallest
            Node z = new Node(label(x.name, y.name), x.w + y.w, y, x);   // larger child on the left (bit 0), as on slide 29
            pq.add(z);                               // the new node goes back into the queue
            System.out.println("step " + (++step) + ": " + x.name + " " + p(x.w) + " + " + y.name + " " + p(y.w)
                    + " -&gt; " + z.name + " " + p(z.w) + "   queue: " + show(pq));
        }
        String[] code = new String[sym.length()];
        codes(pq.peek(), "", code);
        StringBuilder s = new StringBuilder("codes : ");
        for (int i = 0; i &lt; sym.length(); i++) s.append(sym.charAt(i)).append('=').append(code[i]).append("  ");
        System.out.println(s.toString().trim());
    }
}</code></pre>
<div class="out">start : F .05 &nbsp;B .09 &nbsp;D .11 &nbsp;C .15 &nbsp;A .20 &nbsp;E .40<br>
step 1: F .05 + B .09 -&gt; BF .14 &nbsp;&nbsp;queue: D .11 &nbsp;BF .14 &nbsp;C .15 &nbsp;A .20 &nbsp;E .40<br>
step 2: D .11 + BF .14 -&gt; BFD .25 &nbsp;&nbsp;queue: C .15 &nbsp;A .20 &nbsp;BFD .25 &nbsp;E .40<br>
step 3: C .15 + A .20 -&gt; AC .35 &nbsp;&nbsp;queue: BFD .25 &nbsp;AC .35 &nbsp;E .40<br>
step 4: BFD .25 + AC .35 -&gt; BFDAC .60 &nbsp;&nbsp;queue: E .40 &nbsp;BFDAC .60<br>
step 5: E .40 + BFDAC .60 -&gt; BFDACE 1.00 &nbsp;&nbsp;queue: BFDACE 1.00<br>
codes : A=000 &nbsp;B=0100 &nbsp;C=001 &nbsp;D=011 &nbsp;E=1 &nbsp;F=0101</div>
<ul>
<li>"queue" lists the nodes still waiting, smallest first — what the priority queue holds after each merge.</li>
<li>Six symbols → five merges (k − 1): each merge removes two nodes and adds one.</li>
<li>Names such as BF, BFD, AC are the slides' labels: the letters found under that node.</li>
<li>The first two out of the queue are F .05 and B .09 — slide 25 continues from there.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> Huffman is greedy — at every step it takes the locally cheapest pair (the two rarest), and this local choice turns out to be globally optimal.</p>`,
        `<p class="y-chinh">🎯 Sáu ký hiệu khởi đầu là sáu cây một nút; bước đầu tiên gộp hai ký hiệu ít gặp nhất thành một "chuỗi ký hiệu" mới có tần suất bằng tổng của chúng.</p>
<p>Toàn bộ quá trình dựng cây, in bởi chương trình có vòng lặp ở slide 22 — mỗi dòng một lần gộp (merge), cuối cùng là bảng mã:</p>
<pre><code class="language-java">import java.util.Arrays;
import java.util.PriorityQueue;

class Node implements Comparable&lt;Node&gt; {
    String name;                                     // ví dụ "BF"
    int w;                                           // xác suất tính theo phần trăm: .20 -&gt; 20
    Node left, right;

    Node(String name, int w, Node left, Node right) { this.name = name; this.w = w; this.left = left; this.right = right; }
    boolean isLeaf() { return left == null; }
    public int compareTo(Node o) { return w - o.w; }
}

public class HuffmanBuild {
    static final String ORDER = "BFDACE";            // chỉ để đặt tên: các chữ theo thứ tự slide viết

    static String label(String x, String y) {
        StringBuilder s = new StringBuilder();
        for (char c : ORDER.toCharArray()) if (x.indexOf(c) &gt;= 0 || y.indexOf(c) &gt;= 0) s.append(c);
        return s.toString();
    }

    static String p(int w) { return w == 100 ? "1.00" : (w &lt; 10 ? ".0" : ".") + w; }

    static String show(PriorityQueue&lt;Node&gt; pq) {
        Node[] a = pq.toArray(new Node[0]);
        Arrays.sort(a);                              // in hàng đợi theo thứ tự tăng dần
        StringBuilder s = new StringBuilder();
        for (Node x : a) s.append(x.name).append(' ').append(p(x.w)).append("  ");
        return s.toString().trim();
    }

    static void codes(Node x, String code, String[] out) {
        if (x.isLeaf()) { out[x.name.charAt(0) - 'A'] = code; return; }
        codes(x.left, code + "0", out);              // cạnh trái = 0
        codes(x.right, code + "1", out);             // cạnh phải = 1
    }

    public static void main(String[] args) {
        String sym = "ABCDEF";
        int[] w = {20, 9, 15, 11, 40, 5};            // slide 23: A .20 B .09 C .15 D .11 E .40 F .05
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;();
        for (int i = 0; i &lt; sym.length(); i++) pq.add(new Node("" + sym.charAt(i), w[i], null, null));
        System.out.println("start : " + show(pq));
        int step = 0;
        while (pq.size() &gt; 1) {                      // tới khi chỉ còn một nút
            Node x = pq.poll();                      // nhỏ nhất
            Node y = pq.poll();                      // nhỏ nhì
            Node z = new Node(label(x.name, y.name), x.w + y.w, y, x);   // con lớn hơn bên trái (bit 0), như slide 29
            pq.add(z);                               // nút mới quay lại hàng đợi
            System.out.println("step " + (++step) + ": " + x.name + " " + p(x.w) + " + " + y.name + " " + p(y.w)
                    + " -&gt; " + z.name + " " + p(z.w) + "   queue: " + show(pq));
        }
        String[] code = new String[sym.length()];
        codes(pq.peek(), "", code);
        StringBuilder s = new StringBuilder("codes : ");
        for (int i = 0; i &lt; sym.length(); i++) s.append(sym.charAt(i)).append('=').append(code[i]).append("  ");
        System.out.println(s.toString().trim());
    }
}</code></pre>
<div class="out">start : F .05 &nbsp;B .09 &nbsp;D .11 &nbsp;C .15 &nbsp;A .20 &nbsp;E .40<br>
step 1: F .05 + B .09 -&gt; BF .14 &nbsp;&nbsp;queue: D .11 &nbsp;BF .14 &nbsp;C .15 &nbsp;A .20 &nbsp;E .40<br>
step 2: D .11 + BF .14 -&gt; BFD .25 &nbsp;&nbsp;queue: C .15 &nbsp;A .20 &nbsp;BFD .25 &nbsp;E .40<br>
step 3: C .15 + A .20 -&gt; AC .35 &nbsp;&nbsp;queue: BFD .25 &nbsp;AC .35 &nbsp;E .40<br>
step 4: BFD .25 + AC .35 -&gt; BFDAC .60 &nbsp;&nbsp;queue: E .40 &nbsp;BFDAC .60<br>
step 5: E .40 + BFDAC .60 -&gt; BFDACE 1.00 &nbsp;&nbsp;queue: BFDACE 1.00<br>
codes : A=000 &nbsp;B=0100 &nbsp;C=001 &nbsp;D=011 &nbsp;E=1 &nbsp;F=0101</div>
<ul>
<li>"queue" (hàng đợi) liệt kê các nút còn chờ, nhỏ trước — đúng những gì hàng đợi ưu tiên (priority queue) giữ sau mỗi lần gộp.</li>
<li>Sáu ký hiệu → năm lần gộp (k − 1): mỗi lần gộp bớt hai nút và thêm một nút.</li>
<li>Các tên như BF, BFD, AC là nhãn của slide: những chữ cái nằm dưới nút đó.</li>
<li>Hai nút đầu tiên ra khỏi hàng đợi là F .05 và B .09 — slide 25 đi tiếp từ đó.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Huffman là thuật toán tham lam (greedy) — mỗi bước chọn cặp rẻ nhất trước mắt (hai ký hiệu hiếm nhất), và lựa chọn cục bộ này hoá ra lại tối ưu cho toàn cục.</p>`],
      [25, 'Huffman Coding example - 3',
        `<p class="y-chinh">🎯 First merge: F .05 and B .09, the two smallest, become BF .14 — and the same step is repeated until every symbol is in one tree.</p>
<p>The forest after merge 1 (the lesson's drawing; the larger child is drawn on the left, as slide 29's codes require):</p>
<pre><code class="language-plaintext">  BF .14
  /    \\
B .09  F .05        D .11    C .15    A .20    E .40</code></pre>
<table>
<thead><tr><th>Step</th><th>Taken from the queue</th><th>New node</th><th>Queue afterwards (smallest first)</th></tr></thead>
<tbody>
<tr><td>1</td><td>F .05, B .09</td><td>BF .14</td><td>D .11, BF .14, C .15, A .20, E .40</td></tr>
</tbody>
</table>
<ul>
<li>BF .14 goes back into the queue as an ordinary node; it is now smaller than C .15, so it will be picked again soon.</li>
<li>B and F have just gained their first bit: whatever code BF finally gets, B = code(BF) + 0 and F = code(BF) + 1.</li>
<li>The other four symbols are untouched by this step.</li>
</ul>
<div class="pitfall">Exam tables rarely list the frequencies in sorted order. Sort them first, or scan for the two smallest numbers at every step — here .05 and .09, not the first two symbols written.</div>`,
        `<p class="y-chinh">🎯 Lần gộp đầu: F .05 và B .09, hai nút nhỏ nhất, thành BF .14 — và cùng bước đó được lặp lại tới khi mọi ký hiệu nằm trong một cây.</p>
<p>Rừng cây (forest) sau lần gộp 1 (hình vẽ của bài; con lớn hơn vẽ bên trái, như bộ mã ở slide 29 đòi hỏi):</p>
<pre><code class="language-plaintext">  BF .14
  /    \\
B .09  F .05        D .11    C .15    A .20    E .40</code></pre>
<table>
<thead><tr><th>Bước</th><th>Lấy ra khỏi hàng đợi</th><th>Nút mới</th><th>Hàng đợi sau đó (nhỏ trước)</th></tr></thead>
<tbody>
<tr><td>1</td><td>F .05, B .09</td><td>BF .14</td><td>D .11, BF .14, C .15, A .20, E .40</td></tr>
</tbody>
</table>
<ul>
<li>BF .14 quay lại hàng đợi (queue) như một nút bình thường; giờ nó nhỏ hơn C .15, nên sắp được chọn tiếp.</li>
<li>B và F vừa nhận bit đầu tiên: dù BF cuối cùng nhận mã gì, B = mã(BF) + 0 và F = mã(BF) + 1.</li>
<li>Bốn ký hiệu còn lại không bị bước này đụng tới.</li>
</ul>
<div class="pitfall">Bảng tần suất trong đề thi hiếm khi đã sắp xếp. Hãy sắp trước, hoặc mỗi bước dò tìm hai số nhỏ nhất — ở đây là .05 và .09, không phải hai ký hiệu được viết đầu tiên.</div>`],
      [26, 'Huffman Coding example - 4',
        `<p class="y-chinh">🎯 Second merge: D .11 and BF .14 — a leaf and an already merged node — become BFD .25.</p>
<p>The forest after merge 2 (the lesson's drawing, rebuilt from the labels and codes on slides 26–29):</p>
<pre><code class="language-plaintext">     BFD .25
     /     \\
  BF .14   D .11
  /    \\
B .09  F .05        C .15    A .20    E .40</code></pre>
<table>
<thead><tr><th>Step</th><th>Taken from the queue</th><th>New node</th><th>Queue afterwards</th></tr></thead>
<tbody>
<tr><td>2</td><td>D .11, BF .14</td><td>BFD .25</td><td>C .15, A .20, BFD .25, E .40</td></tr>
</tbody>
</table>
<ul>
<li>A merged node is merged again: B and F are now two levels deep, D one level — the rarest symbols sink deepest.</li>
<li>Every merge adds one bit to the code of every leaf below the new node, so a symbol's code length = the number of merges it takes part in.</li>
<li>B and F will take part in 4 merges in all, D in 3 — hence the 4-, 4- and 3-bit codes of slide 29.</li>
</ul>
<p>Why not C .15 with BF .14? Because D .11 is smaller than C .15 — the rule looks only at the numbers.</p>
<p class="meo">🧠 <strong>Remember:</strong> rare symbols are merged early and often → long codes; the most frequent symbol is merged last → the shortest code.</p>`,
        `<p class="y-chinh">🎯 Lần gộp thứ hai: D .11 và BF .14 — một lá và một nút đã gộp — thành BFD .25.</p>
<p>Rừng cây sau lần gộp 2 (hình vẽ của bài, dựng lại từ nhãn và bộ mã trên slide 26–29):</p>
<pre><code class="language-plaintext">     BFD .25
     /     \\
  BF .14   D .11
  /    \\
B .09  F .05        C .15    A .20    E .40</code></pre>
<table>
<thead><tr><th>Bước</th><th>Lấy ra khỏi hàng đợi</th><th>Nút mới</th><th>Hàng đợi sau đó</th></tr></thead>
<tbody>
<tr><td>2</td><td>D .11, BF .14</td><td>BFD .25</td><td>C .15, A .20, BFD .25, E .40</td></tr>
</tbody>
</table>
<ul>
<li>Một nút đã gộp lại được gộp tiếp (merge): B và F giờ nằm sâu hai tầng, D một tầng — ký hiệu hiếm nhất chìm sâu nhất.</li>
<li>Mỗi lần gộp thêm một bit vào mã của mọi lá (leaf) nằm dưới nút mới, nên độ dài mã của một ký hiệu = số lần gộp mà nó tham gia.</li>
<li>Tổng cộng B và F sẽ tham gia 4 lần gộp, D 3 lần — vì thế ở slide 29 chúng có mã dài 4, 4 và 3 bit.</li>
</ul>
<p>Sao không gộp C .15 với BF .14? Vì D .11 nhỏ hơn C .15 — quy tắc chỉ nhìn vào các con số.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ký hiệu hiếm bị gộp sớm và nhiều lần → mã dài; ký hiệu hay gặp nhất được gộp sau cùng → mã ngắn nhất.</p>`],
      [27, 'Huffman Coding example - 5',
        `<p class="y-chinh">🎯 Third merge: the two smallest are now C .15 and A .20 — two original leaves — so they form a new tree AC .35 beside BFD .25.</p>
<p>The forest after merge 3 (the lesson's drawing):</p>
<pre><code class="language-plaintext">     BFD .25                AC .35
     /     \\                /    \\
  BF .14   D .11         A .20   C .15        E .40
  /    \\
B .09  F .05</code></pre>
<table>
<thead><tr><th>Step</th><th>Taken from the queue</th><th>New node</th><th>Queue afterwards</th></tr></thead>
<tbody>
<tr><td>3</td><td>C .15, A .20</td><td>AC .35</td><td>BFD .25, AC .35, E .40</td></tr>
</tbody>
</table>
<ul>
<li>The newest node, BFD .25, is <em>not</em> involved: Huffman does not grow one chain — it keeps a forest and picks the two smallest trees wherever they are.</li>
<li>A (.20) is drawn on the left of C (.15), which is why A's code will end in 0 and C's in 1: A 000, C 001.</li>
<li>Three trees remain; two more merges finish the job.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> think "forest", not "chain".</p>
<div class="pitfall">A frequent mistake is to always attach the next symbol to the tree built last (BFD + C, then + A, then + E). That builds a chain: D, B and F sink one level deeper (4, 5 and 5 bits) and the average rises to 2.39 bits instead of 2.34. Check at step 3: is BFD .25 among the two smallest? No — C .15 and A .20 are.</div>`,
        `<p class="y-chinh">🎯 Lần gộp thứ ba: hai nút nhỏ nhất giờ là C .15 và A .20 — hai lá ban đầu — nên chúng tạo thành một cây mới AC .35 đứng cạnh BFD .25.</p>
<p>Rừng cây sau lần gộp 3 (hình vẽ của bài):</p>
<pre><code class="language-plaintext">     BFD .25                AC .35
     /     \\                /    \\
  BF .14   D .11         A .20   C .15        E .40
  /    \\
B .09  F .05</code></pre>
<table>
<thead><tr><th>Bước</th><th>Lấy ra khỏi hàng đợi</th><th>Nút mới</th><th>Hàng đợi sau đó</th></tr></thead>
<tbody>
<tr><td>3</td><td>C .15, A .20</td><td>AC .35</td><td>BFD .25, AC .35, E .40</td></tr>
</tbody>
</table>
<ul>
<li>Nút mới nhất, BFD .25, <em>không</em> tham gia: Huffman không nối dài một chuỗi — nó giữ một rừng cây (forest) và chọn hai cây nhỏ nhất ở bất cứ đâu.</li>
<li>A (.20) được vẽ bên trái C (.15), vì thế mã của A sẽ kết thúc bằng 0 còn của C bằng 1: A 000, C 001.</li>
<li>Còn ba cây; thêm hai lần gộp nữa là xong.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nghĩ tới "rừng", đừng nghĩ tới "chuỗi".</p>
<div class="pitfall">Lỗi hay gặp là lúc nào cũng gắn ký hiệu kế tiếp vào cây vừa dựng (BFD + C, rồi + A, rồi + E). Làm vậy thành một chuỗi: D, B và F chìm sâu thêm một tầng (4, 5 và 5 bit) và trung bình tăng lên 2.39 bit thay vì 2.34. Kiểm tra ở bước 3: BFD .25 có thuộc hai nút nhỏ nhất không? Không — C .15 và A .20 mới là hai nút nhỏ nhất.</div>`],
      [28, 'Huffman Coding example - 6',
        `<p class="y-chinh">🎯 Fourth merge: BFD .25 and AC .35 join into BFDAC .60, and only two nodes are left — E .40 and BFDAC .60.</p>
<p>The forest after merge 4 (the lesson's drawing):</p>
<pre><code class="language-plaintext">           BFDAC .60
        /             \\
   AC .35             BFD .25
   /    \\             /     \\
A .20   C .15      BF .14   D .11          E .40
                   /    \\
                 B .09  F .05</code></pre>
<table>
<thead><tr><th>Step</th><th>Taken from the queue</th><th>New node</th><th>Queue afterwards</th></tr></thead>
<tbody>
<tr><td>4</td><td>BFD .25, AC .35</td><td>BFDAC .60</td><td>E .40, BFDAC .60</td></tr>
</tbody>
</table>
<ul>
<li>E .40, the most frequent symbol, is still untouched: it joins only at the very last merge, so its code will be a single bit.</li>
<li>In the queue E .40 now comes before BFDAC .60, so at step 5 E is the smaller node taken first.</li>
<li>Why "the two smallest" is the right greedy choice: the two rarest symbols can always sit deepest, as siblings, in some optimal tree — so merging them first never costs anything.</li>
</ul>
<p><strong>Big-O on the example:</strong> 5 merges × (2 polls + 1 add) on a queue of at most 6 nodes; in general O(k log k) for k symbols.</p>
<p class="meo">🧠 <strong>Remember:</strong> after k − 2 merges exactly two trees are left; the last merge makes the root.</p>`,
        `<p class="y-chinh">🎯 Lần gộp thứ tư: BFD .25 và AC .35 nối thành BFDAC .60, và chỉ còn hai nút — E .40 và BFDAC .60.</p>
<p>Rừng cây sau lần gộp 4 (hình vẽ của bài):</p>
<pre><code class="language-plaintext">           BFDAC .60
        /             \\
   AC .35             BFD .25
   /    \\             /     \\
A .20   C .15      BF .14   D .11          E .40
                   /    \\
                 B .09  F .05</code></pre>
<table>
<thead><tr><th>Bước</th><th>Lấy ra khỏi hàng đợi</th><th>Nút mới</th><th>Hàng đợi sau đó</th></tr></thead>
<tbody>
<tr><td>4</td><td>BFD .25, AC .35</td><td>BFDAC .60</td><td>E .40, BFDAC .60</td></tr>
</tbody>
</table>
<ul>
<li>E .40, ký hiệu hay gặp nhất, vẫn chưa bị đụng tới: nó chỉ tham gia lần gộp (merge) cuối cùng, nên mã của nó chỉ dài một bit.</li>
<li>Trong hàng đợi (queue), E .40 giờ đứng trước BFDAC .60, nên ở bước 5 E là nút nhỏ hơn được lấy ra trước.</li>
<li>Vì sao "hai nút nhỏ nhất" là lựa chọn tham lam (greedy) đúng: hai ký hiệu hiếm nhất luôn có thể đặt ở tầng sâu nhất, làm hai anh em, trong một cây tối ưu nào đó — nên gộp chúng trước không bao giờ thiệt.</li>
</ul>
<p><strong>Big-O trên ví dụ:</strong> 5 lần gộp × (2 lần lấy ra + 1 lần thêm) trên hàng đợi tối đa 6 nút; tổng quát là O(k log k) với k ký hiệu.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> sau k − 2 lần gộp thì còn đúng hai cây; lần gộp cuối tạo ra gốc.</p>`],
      [29, 'Huffman Coding example - 7',
        `<p class="y-chinh">🎯 The last merge makes the root BFDACE 1.00; labelling the branches 0 and 1 and reading each path from the root down gives the codes A 000, B 0100, C 001, D 011, E 1, F 0101 — none is a prefix of another.</p>
<p>The finished tree (the lesson's drawing; compare it with the figure on the slide):</p>
<pre><code class="language-plaintext">                    BFDACE 1.00
                 0 /           \\ 1
           BFDAC .60           E .40
         0 /       \\ 1
     AC .35         BFD .25
   0 /   \\ 1      0 /    \\ 1
A .20   C .15   BF .14   D .11
              0 /    \\ 1
            B .09    F .05</code></pre>
<ul>
<li><strong>Reading "from top to bottom"</strong>: E = 1 (one edge); A = 0, 0, 0; D = 0, 1, 1; B = 0, 1, 0, 0.</li>
<li><strong>The convention behind the slide's codes</strong>: at every node the larger child gets 0 (left) and the smaller gets 1 (right).</li>
<li><strong>"None are prefixes of another"</strong>: every symbol is a leaf (slide 20), so a Huffman bit string can be decoded in one way only:</li>
</ul>
<pre><code class="language-java">class Node {
    char ch;                                         // a symbol (leaves only)
    Node left, right;                                // left = bit 0, right = bit 1
}

public class HuffmanEncodeDecode {
    static String[] code = new String[128];
    static Node root = new Node();

    static void add(char ch, String c) {             // follow/create the path of the code, put ch at its end
        code[ch] = c;
        Node x = root;
        for (char b : c.toCharArray()) {
            if (b == '0') { if (x.left == null) x.left = new Node(); x = x.left; }
            else { if (x.right == null) x.right = new Node(); x = x.right; }
        }
        x.ch = ch;
    }

    static String encode(String s) {
        StringBuilder bits = new StringBuilder();
        for (char c : s.toCharArray()) bits.append(code[c]);
        return bits.toString();
    }

    static String decode(String bits) {
        StringBuilder out = new StringBuilder();
        Node x = root;
        for (char b : bits.toCharArray()) {
            x = (b == '0') ? x.left : x.right;       // one edge per bit
            if (x.left == null &amp;&amp; x.right == null) { out.append(x.ch); x = root; }   // a leaf: output it, back to the root
        }
        return out.toString();
    }

    public static void main(String[] args) {
        add('A', "000"); add('B', "0100"); add('C', "001");     // the codes of slide 29
        add('D', "011"); add('E', "1"); add('F', "0101");
        for (String word : new String[] {"FACE", "BEEF", "DECADE"}) {
            String bits = encode(word);
            System.out.println(word + " -&gt; " + bits + " (" + bits.length() + " bits; fixed 3-bit code: " + 3 * word.length()
                    + ") -&gt; decoded: " + decode(bits));
        }
    }
}</code></pre>
<div class="out">FACE -&gt; 01010000011 (11 bits; fixed 3-bit code: 12) -&gt; decoded: FACE<br>
BEEF -&gt; 0100110101 (10 bits; fixed 3-bit code: 12) -&gt; decoded: BEEF<br>
DECADE -&gt; 01110010000111 (14 bits; fixed 3-bit code: 18) -&gt; decoded: DECADE</div>
<p>Decoding FACE by walking the tree: 0-1-0-1 reaches leaf F, back to the root; 0-0-0 → A; 0-0-1 → C; 1 → E. Words full of E and A are the cheapest — exactly what the frequencies asked for.</p>
<div class="pitfall">Read codes from the root down to the leaf. Reading them upwards reverses the bits: B would come out as 0010 instead of 0100.</div>`,
        `<p class="y-chinh">🎯 Lần gộp cuối tạo ra gốc BFDACE 1.00; ghi 0 và 1 lên các nhánh rồi đọc từng đường đi từ gốc xuống sẽ được bảng mã A 000, B 0100, C 001, D 011, E 1, F 0101 — không mã nào là tiền tố (prefix) của mã khác.</p>
<p>Cây hoàn chỉnh (hình vẽ của bài; hãy đối chiếu với hình trên slide):</p>
<pre><code class="language-plaintext">                    BFDACE 1.00
                 0 /           \\ 1
           BFDAC .60           E .40
         0 /       \\ 1
     AC .35         BFD .25
   0 /   \\ 1      0 /    \\ 1
A .20   C .15   BF .14   D .11
              0 /    \\ 1
            B .09    F .05</code></pre>
<ul>
<li><strong>Đọc "từ trên xuống dưới" (from top to bottom)</strong>: E = 1 (một cạnh); A = 0, 0, 0; D = 0, 1, 1; B = 0, 1, 0, 0.</li>
<li><strong>Quy ước đứng sau bộ mã của slide</strong>: ở mọi nút, con lớn hơn nhận 0 (bên trái), con nhỏ hơn nhận 1 (bên phải).</li>
<li><strong>"Không mã nào là tiền tố của mã khác"</strong>: mọi ký hiệu đều là lá (leaf, slide 20), nên một dãy bit Huffman chỉ giải mã được theo đúng một cách:</li>
</ul>
<pre><code class="language-java">class Node {
    char ch;                                         // ký hiệu (chỉ ở lá)
    Node left, right;                                // trái = bit 0, phải = bit 1
}

public class HuffmanEncodeDecode {
    static String[] code = new String[128];
    static Node root = new Node();

    static void add(char ch, String c) {             // đi/tạo đường theo mã, đặt ch ở cuối đường
        code[ch] = c;
        Node x = root;
        for (char b : c.toCharArray()) {
            if (b == '0') { if (x.left == null) x.left = new Node(); x = x.left; }
            else { if (x.right == null) x.right = new Node(); x = x.right; }
        }
        x.ch = ch;
    }

    static String encode(String s) {
        StringBuilder bits = new StringBuilder();
        for (char c : s.toCharArray()) bits.append(code[c]);
        return bits.toString();
    }

    static String decode(String bits) {
        StringBuilder out = new StringBuilder();
        Node x = root;
        for (char b : bits.toCharArray()) {
            x = (b == '0') ? x.left : x.right;       // mỗi bit đi một cạnh
            if (x.left == null &amp;&amp; x.right == null) { out.append(x.ch); x = root; }   // gặp lá: xuất ký hiệu, quay về gốc
        }
        return out.toString();
    }

    public static void main(String[] args) {
        add('A', "000"); add('B', "0100"); add('C', "001");     // bộ mã của slide 29
        add('D', "011"); add('E', "1"); add('F', "0101");
        for (String word : new String[] {"FACE", "BEEF", "DECADE"}) {
            String bits = encode(word);
            System.out.println(word + " -&gt; " + bits + " (" + bits.length() + " bits; fixed 3-bit code: " + 3 * word.length()
                    + ") -&gt; decoded: " + decode(bits));
        }
    }
}</code></pre>
<div class="out">FACE -&gt; 01010000011 (11 bits; fixed 3-bit code: 12) -&gt; decoded: FACE<br>
BEEF -&gt; 0100110101 (10 bits; fixed 3-bit code: 12) -&gt; decoded: BEEF<br>
DECADE -&gt; 01110010000111 (14 bits; fixed 3-bit code: 18) -&gt; decoded: DECADE</div>
<p>Giải mã FACE bằng cách đi trên cây: 0-1-0-1 tới lá F, quay về gốc; 0-0-0 → A; 0-0-1 → C; 1 → E. Những từ nhiều E và A là rẻ nhất — đúng điều mà bảng tần suất mong muốn.</p>
<div class="pitfall">Đọc mã từ gốc xuống lá. Đọc ngược từ lá lên sẽ đảo thứ tự bit: B thành 0010 thay vì 0100.</div>`],
      [30, 'Huffman Coding example - 8',
        `<p class="y-chinh">🎯 The summary table (character, code, length, probability) gives the average code length (3 × 0.20) + (4 × 0.09) + (3 × 0.15) + (3 × 0.11) + (1 × 0.40) + (4 × 0.05) — which equals 2.34 bits, not the 1.89 printed on the slide.</p>
<table>
<thead><tr><th>Character</th><th>Code</th><th>Length</th><th>Probability</th><th>Length × probability</th></tr></thead>
<tbody>
<tr><td>A</td><td>000</td><td>3</td><td>.20</td><td>0.60</td></tr>
<tr><td>B</td><td>0100</td><td>4</td><td>.09</td><td>0.36</td></tr>
<tr><td>C</td><td>001</td><td>3</td><td>.15</td><td>0.45</td></tr>
<tr><td>D</td><td>011</td><td>3</td><td>.11</td><td>0.33</td></tr>
<tr><td>E</td><td>1</td><td>1</td><td>.40</td><td>0.40</td></tr>
<tr><td>F</td><td>0101</td><td>4</td><td>.05</td><td>0.20</td></tr>
<tr><td>Total</td><td></td><td></td><td>1.00</td><td>2.34</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Locale;

public class AverageCodeLength {
    public static void main(String[] args) {
        String[] code = {"000", "0100", "001", "011", "1", "0101"};   // A..F, slides 29-30
        int[] pct = {20, 9, 15, 11, 40, 5};                          // probabilities in %
        int bits = 0;                                                // bits for 100 characters
        double H = 0;
        StringBuilder sum = new StringBuilder();
        for (int i = 0; i &lt; code.length; i++) {
            bits += code[i].length() * pct[i];
            double p = pct[i] / 100.0;
            H -= p * Math.log(p) / Math.log(2);
            sum.append(i == 0 ? "" : " + ").append('(').append(code[i].length()).append(" x ")
               .append(String.format(Locale.US, "%.2f", p)).append(')');
        }
        System.out.println(sum);
        System.out.println(String.format(Locale.US, "  = %.2f bits per symbol   (the slide prints 1.89)", bits / 100.0));
        System.out.println(String.format(Locale.US, "entropy H = %.2f bits: no uniquely decodable code can average less", H));
        System.out.println("fixed-length code for 6 symbols: 3 bits per symbol");
        System.out.println("100-character document: " + bits + " bits (Huffman), 300 (3-bit code), 800 (8-bit ASCII)");
        System.out.println(String.format(Locale.US, "rate vs 3-bit code: (300 - %d) / 300 = %.0f%%", bits, 100.0 * (300 - bits) / 300));
        System.out.println(String.format(Locale.US, "rate vs ASCII     : (800 - %d) / 800 = %.1f%%", bits, 100.0 * (800 - bits) / 800));
    }
}</code></pre>
<div class="out">(3 x 0.20) + (4 x 0.09) + (3 x 0.15) + (3 x 0.11) + (1 x 0.40) + (4 x 0.05)<br>
&nbsp;&nbsp;= 2.34 bits per symbol &nbsp;&nbsp;(the slide prints 1.89)<br>
entropy H = 2.28 bits: no uniquely decodable code can average less<br>
fixed-length code for 6 symbols: 3 bits per symbol<br>
100-character document: 234 bits (Huffman), 300 (3-bit code), 800 (8-bit ASCII)<br>
rate vs 3-bit code: (300 - 234) / 300 = 22%<br>
rate vs ASCII &nbsp;&nbsp;&nbsp;&nbsp;: (800 - 234) / 800 = 70.8%</div>
<ul>
<li><strong>Add it up</strong>: 0.60 + 0.36 + 0.45 + 0.33 + 0.40 + 0.20 = 2.34 bits per symbol ("digits" on the slide means binary digits, bits).</li>
<li><strong>Why 1.89 is impossible</strong>: the entropy of these frequencies is 2.28 bits (slide 18), and no uniquely decodable code can average less — 1.89 &lt; 2.28.</li>
<li><strong>What Huffman buys here</strong>: 2.34 bits against 3 for a fixed-length code (22% saved) and 8 for ASCII (70.8% saved).</li>
</ul>
<p class="meo">🧠 <strong>Sanity check for any Huffman average:</strong> entropy ≤ average &lt; entropy + 1. Here 2.28 ≤ 2.34 &lt; 3.28.</p>
<div class="pitfall">If an FE question gives these codes and probabilities and asks for the average length, compute it yourself: 2.34. Do not copy 1.89 from the slide — it contradicts the slide's own sum.</div>`,
        `<p class="y-chinh">🎯 Bảng tổng kết (ký tự, mã, độ dài, xác suất) cho độ dài mã trung bình (3 × 0.20) + (4 × 0.09) + (3 × 0.15) + (3 × 0.11) + (1 × 0.40) + (4 × 0.05) — kết quả là 2.34 bit, không phải 1.89 như in trên slide.</p>
<table>
<thead><tr><th>Ký tự</th><th>Mã</th><th>Độ dài</th><th>Xác suất</th><th>Độ dài × xác suất</th></tr></thead>
<tbody>
<tr><td>A</td><td>000</td><td>3</td><td>.20</td><td>0.60</td></tr>
<tr><td>B</td><td>0100</td><td>4</td><td>.09</td><td>0.36</td></tr>
<tr><td>C</td><td>001</td><td>3</td><td>.15</td><td>0.45</td></tr>
<tr><td>D</td><td>011</td><td>3</td><td>.11</td><td>0.33</td></tr>
<tr><td>E</td><td>1</td><td>1</td><td>.40</td><td>0.40</td></tr>
<tr><td>F</td><td>0101</td><td>4</td><td>.05</td><td>0.20</td></tr>
<tr><td>Tổng</td><td></td><td></td><td>1.00</td><td>2.34</td></tr>
</tbody>
</table>
<pre><code class="language-java">import java.util.Locale;

public class AverageCodeLength {
    public static void main(String[] args) {
        String[] code = {"000", "0100", "001", "011", "1", "0101"};   // A..F, slide 29-30
        int[] pct = {20, 9, 15, 11, 40, 5};                          // xác suất tính theo %
        int bits = 0;                                                // số bit cho 100 ký tự
        double H = 0;
        StringBuilder sum = new StringBuilder();
        for (int i = 0; i &lt; code.length; i++) {
            bits += code[i].length() * pct[i];
            double p = pct[i] / 100.0;
            H -= p * Math.log(p) / Math.log(2);
            sum.append(i == 0 ? "" : " + ").append('(').append(code[i].length()).append(" x ")
               .append(String.format(Locale.US, "%.2f", p)).append(')');
        }
        System.out.println(sum);
        System.out.println(String.format(Locale.US, "  = %.2f bits per symbol   (the slide prints 1.89)", bits / 100.0));
        System.out.println(String.format(Locale.US, "entropy H = %.2f bits: no uniquely decodable code can average less", H));
        System.out.println("fixed-length code for 6 symbols: 3 bits per symbol");
        System.out.println("100-character document: " + bits + " bits (Huffman), 300 (3-bit code), 800 (8-bit ASCII)");
        System.out.println(String.format(Locale.US, "rate vs 3-bit code: (300 - %d) / 300 = %.0f%%", bits, 100.0 * (300 - bits) / 300));
        System.out.println(String.format(Locale.US, "rate vs ASCII     : (800 - %d) / 800 = %.1f%%", bits, 100.0 * (800 - bits) / 800));
    }
}</code></pre>
<div class="out">(3 x 0.20) + (4 x 0.09) + (3 x 0.15) + (3 x 0.11) + (1 x 0.40) + (4 x 0.05)<br>
&nbsp;&nbsp;= 2.34 bits per symbol &nbsp;&nbsp;(the slide prints 1.89)<br>
entropy H = 2.28 bits: no uniquely decodable code can average less<br>
fixed-length code for 6 symbols: 3 bits per symbol<br>
100-character document: 234 bits (Huffman), 300 (3-bit code), 800 (8-bit ASCII)<br>
rate vs 3-bit code: (300 - 234) / 300 = 22%<br>
rate vs ASCII &nbsp;&nbsp;&nbsp;&nbsp;: (800 - 234) / 800 = 70.8%</div>
<ul>
<li><strong>Cộng lại</strong>: 0.60 + 0.36 + 0.45 + 0.33 + 0.40 + 0.20 = 2.34 bit mỗi ký hiệu ("digits" trên slide là chữ số nhị phân, tức bit).</li>
<li><strong>Vì sao 1.89 là không thể</strong>: entropy (lượng tin trung bình) của bảng tần suất này là 2.28 bit (slide 18), và không bộ mã giải được duy nhất (uniquely decodable) nào có trung bình nhỏ hơn — mà 1.89 &lt; 2.28.</li>
<li><strong>Huffman lợi được gì ở đây</strong>: 2.34 bit so với 3 bit của mã độ dài cố định (fixed-length, tiết kiệm 22%) và 8 bit của ASCII (tiết kiệm 70.8%).</li>
</ul>
<p class="meo">🧠 <strong>Phép thử nhanh cho mọi độ dài trung bình của Huffman:</strong> entropy ≤ trung bình &lt; entropy + 1. Ở đây 2.28 ≤ 2.34 &lt; 3.28.</p>
<div class="pitfall">Nếu đề thi cuối kỳ (FE) cho đúng bộ mã và xác suất này rồi hỏi độ dài trung bình, hãy tự tính: 2.34. Đừng chép 1.89 từ slide — con số đó mâu thuẫn với chính phép cộng trên slide.</div>`],
      [31, 'Huffman Coding notes',
        `<p class="y-chinh">🎯 A Huffman code is not unique — the 0/1 labels are arbitrary and ties may be merged in any order — but every Huffman code for the same frequencies has the same average code length.</p>
<ul>
<li><strong>0 and 1 are arbitrary</strong>: swapping the labels at a node flips bits but keeps every length — slide 32's program produces exactly the flipped version of slide 29's code.</li>
<li><strong>Ties</strong>: when several nodes have the same probability, it does not matter which ones are connected — even the code lengths may change.</li>
<li><strong>When the code is unique</strong>: if all node probabilities differ and the left node's probability is always larger than the right one's — the rule behind slide 29.</li>
</ul>
<p>The lesson's own example with ties — P = .4, .2, .2, .1, .1 — built twice, breaking ties in opposite ways:</p>
<pre><code class="language-java">import java.util.Locale;
import java.util.PriorityQueue;

class Node {
    char ch; int w, id;                              // id = creation order
    Node left, right;
    Node(char ch, int w, int id, Node left, Node right) { this.ch = ch; this.w = w; this.id = id; this.left = left; this.right = right; }
}

public class HuffmanTies {
    static String[] code = new String[128];

    static void codes(Node x, String s) {
        if (x.left == null) { code[x.ch] = s; return; }
        codes(x.left, s + "0");
        codes(x.right, s + "1");
    }

    static void build(boolean olderFirst) {
        // equal weights: which node leaves the queue first?
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;(11, (a, b) -&gt;
                a.w != b.w ? a.w - b.w : (olderFirst ? a.id - b.id : b.id - a.id));
        String sym = "abcde";
        int[] w = {40, 20, 20, 10, 10};              // P = .4 .2 .2 .1 .1 (the lesson's own example)
        int id = 0;
        for (int i = 0; i &lt; sym.length(); i++) pq.add(new Node(sym.charAt(i), w[i], id++, null, null));
        while (pq.size() &gt; 1) {
            Node x = pq.poll(), y = pq.poll();
            pq.add(new Node('*', x.w + y.w, id++, x, y));
        }
        codes(pq.poll(), "");
        int total = 0;
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; sym.length(); i++) {
            char c = sym.charAt(i);
            s.append(c).append('=').append(code[c]).append(' ');
            total += w[i] * code[c].length();
        }
        System.out.println((olderFirst ? "ties -&gt; older node first: " : "ties -&gt; newer node first: ")
                + String.format("%-30s", s.toString()) + String.format(Locale.US, "average = %.2f bits", total / 100.0));
    }

    public static void main(String[] args) {
        build(true);
        build(false);
        double H = 0;
        for (double p : new double[] {.4, .2, .2, .1, .1}) H -= p * Math.log(p) / Math.log(2);
        System.out.println(String.format(Locale.US, "entropy H = %.2f bits", H));
    }
}</code></pre>
<div class="out">ties -&gt; older node first: a=11 b=00 c=01 d=100 e=101 &nbsp;&nbsp;&nbsp;average = 2.20 bits<br>
ties -&gt; newer node first: a=0 b=10 c=111 d=1101 e=1100 &nbsp;average = 2.20 bits<br>
entropy H = 2.12 bits</div>
<p>The two trees have different shapes (a gets 2 bits in one and 1 bit in the other), yet both average 2.20 bits — both are optimal, within 1 bit of H = 2.12.</p>
<div class="pitfall">"The Huffman code of a given text is unique" is false; "all Huffman codes of a given text have the same average length" is true. FE questions like to swap these two statements.</div>`,
        `<p class="y-chinh">🎯 Mã Huffman không duy nhất — nhãn 0/1 gán tuỳ ý và các nút bằng nhau có thể gộp theo thứ tự nào cũng được — nhưng mọi mã Huffman cho cùng một bảng tần suất đều có cùng độ dài mã trung bình.</p>
<ul>
<li><strong>0 và 1 là tuỳ ý</strong>: đổi nhãn ở một nút làm lật bit nhưng giữ nguyên mọi độ dài — chương trình ở slide 32 cho ra đúng bản lật bit của bộ mã slide 29.</li>
<li><strong>Thế hoà (tie)</strong>: khi nhiều nút có cùng xác suất, nối nút nào với nút nào cũng được — thậm chí độ dài mã của từng ký hiệu có thể đổi.</li>
<li><strong>Khi nào mã là duy nhất</strong>: khi mọi nút có xác suất khác nhau và xác suất của nút trái luôn lớn hơn nút phải — chính là quy tắc đứng sau slide 29.</li>
</ul>
<p>Ví dụ của bài có thế hoà — P = .4, .2, .2, .1, .1 — dựng hai lần, phá thế hoà (tie-breaking) theo hai cách ngược nhau:</p>
<pre><code class="language-java">import java.util.Locale;
import java.util.PriorityQueue;

class Node {
    char ch; int w, id;                              // id = thứ tự được tạo ra
    Node left, right;
    Node(char ch, int w, int id, Node left, Node right) { this.ch = ch; this.w = w; this.id = id; this.left = left; this.right = right; }
}

public class HuffmanTies {
    static String[] code = new String[128];

    static void codes(Node x, String s) {
        if (x.left == null) { code[x.ch] = s; return; }
        codes(x.left, s + "0");
        codes(x.right, s + "1");
    }

    static void build(boolean olderFirst) {
        // trọng số bằng nhau: nút nào ra khỏi hàng đợi trước?
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;(11, (a, b) -&gt;
                a.w != b.w ? a.w - b.w : (olderFirst ? a.id - b.id : b.id - a.id));
        String sym = "abcde";
        int[] w = {40, 20, 20, 10, 10};              // P = .4 .2 .2 .1 .1 (ví dụ của bài)
        int id = 0;
        for (int i = 0; i &lt; sym.length(); i++) pq.add(new Node(sym.charAt(i), w[i], id++, null, null));
        while (pq.size() &gt; 1) {
            Node x = pq.poll(), y = pq.poll();
            pq.add(new Node('*', x.w + y.w, id++, x, y));
        }
        codes(pq.poll(), "");
        int total = 0;
        StringBuilder s = new StringBuilder();
        for (int i = 0; i &lt; sym.length(); i++) {
            char c = sym.charAt(i);
            s.append(c).append('=').append(code[c]).append(' ');
            total += w[i] * code[c].length();
        }
        System.out.println((olderFirst ? "ties -&gt; older node first: " : "ties -&gt; newer node first: ")
                + String.format("%-30s", s.toString()) + String.format(Locale.US, "average = %.2f bits", total / 100.0));
    }

    public static void main(String[] args) {
        build(true);
        build(false);
        double H = 0;
        for (double p : new double[] {.4, .2, .2, .1, .1}) H -= p * Math.log(p) / Math.log(2);
        System.out.println(String.format(Locale.US, "entropy H = %.2f bits", H));
    }
}</code></pre>
<div class="out">ties -&gt; older node first: a=11 b=00 c=01 d=100 e=101 &nbsp;&nbsp;&nbsp;average = 2.20 bits<br>
ties -&gt; newer node first: a=0 b=10 c=111 d=1101 e=1100 &nbsp;average = 2.20 bits<br>
entropy H = 2.12 bits</div>
<p>Hai cây có hình dạng khác nhau (a được 2 bit ở cây này và 1 bit ở cây kia), vậy mà cả hai đều trung bình 2.20 bit — cả hai đều tối ưu (optimal), cách entropy (lượng tin trung bình) H = 2.12 chưa tới 1 bit.</p>
<div class="pitfall">"Mã Huffman của một văn bản là duy nhất" là SAI; "mọi mã Huffman của một văn bản có cùng độ dài trung bình" là ĐÚNG. Đề thi cuối kỳ (FE) rất thích tráo hai câu này.</div>`],
      [32, 'Some important statements in Huffman Encoding program',
        `<p class="y-chinh">🎯 The slide's statements are the skeleton of a real Huffman encoder: count frequencies in an array of R = 256 counters, build the tree, then build the code table with a recursive buildCode.</p>
<p>The lines look adapted from the Huffman program in Sedgewick &amp; Wayne's <em>Algorithms</em> (same names R, freq, st, buildCode). Made runnable here: <code>Node</code> and <code>buildTree</code> are written in that usual way (the slide only calls <code>buildTree</code>), the input is the 100-character document of slide 23, and one typo is fixed:</p>
<pre><code class="language-java">import java.util.PriorityQueue;

class Node implements Comparable&lt;Node&gt; {
    char ch; int freq;
    Node left, right;
    Node(char ch, int freq, Node left, Node right) { this.ch = ch; this.freq = freq; this.left = left; this.right = right; }
    boolean isLeaf() { return left == null &amp;&amp; right == null; }
    public int compareTo(Node that) { return this.freq - that.freq; }
}

public class HuffmanSedgewick {
    static final int R = 256;                        // extended ASCII alphabet

    static Node buildTree(int[] freq) {
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;();
        for (char c = 0; c &lt; R; c++) if (freq[c] &gt; 0) pq.add(new Node(c, freq[c], null, null));
        while (pq.size() &gt; 1) {
            Node left = pq.poll(), right = pq.poll();    // here the SMALLER node goes left
            pq.add(new Node('\\0', left.freq + right.freq, left, right));
        }
        return pq.poll();
    }

    // the slide's buildCode, unchanged
    static void buildCode(String[] st, Node x, String s) {
        if (!x.isLeaf()) { buildCode(st, x.left, s + 0); buildCode(st, x.right, s + 1); }
        else { st[x.ch] = s; }
    }

    public static void main(String[] args) {
        StringBuilder doc = new StringBuilder();     // 100 characters with the counts of slide 23
        int[] count = {20, 9, 15, 11, 40, 5};
        for (int i = 0; i &lt; 6; i++) for (int k = 0; k &lt; count[i]; k++) doc.append((char) ('A' + i));
        char[] input = doc.toString().toCharArray();
        // tabulate frequency counts
        int[] freq = new int[R];                     // the slide repeats "= new int[R];" here: a typo
        for (int i = 0; i &lt; input.length; i++) freq[input[i]]++;
        // build Huffman tree
        Node root = buildTree(freq);
        // build code table
        String[] st = new String[R]; buildCode(st, root, "");
        int bits = 0;
        StringBuilder s = new StringBuilder();
        for (char c = 'A'; c &lt;= 'F'; c++) {
            s.append(c).append('=').append(st[c]).append("  ");
            bits += freq[c] * st[c].length();
        }
        System.out.println(s.toString().trim());
        System.out.println("total: " + bits + " bits for " + input.length + " characters");
        System.out.println("\\"\\" + 0 = \\"" + ("" + 0) + "\\"   but   '0' + 1 = " + ('0' + 1));
    }
}</code></pre>
<div class="out">A=111 &nbsp;B=1011 &nbsp;C=110 &nbsp;D=100 &nbsp;E=0 &nbsp;F=1010<br>
total: 234 bits for 100 characters<br>
"" + 0 = "0" &nbsp;&nbsp;but &nbsp;&nbsp;'0' + 1 = 49</div>
<ul>
<li><strong>The typo</strong>: the slide writes <code>int[] freq = new int[R]; = new int[R];</code> — the second <code>= new int[R];</code> is a stray copy that does not compile; keep <code>int[] freq = new int[R];</code>.</li>
<li><strong><code>freq[input[i]]++</code></strong>: a <code>char</code> is a number, so it can index the array directly — fine for codes 0–255, but a Vietnamese letter such as 'ư' (above 255) would fall outside an array of R = 256.</li>
<li><strong><code>buildCode</code></strong>: at an internal node recurse left with <code>s + 0</code> and right with <code>s + 1</code>; at a leaf store the path as its code — one visit per node, O(k).</li>
<li><strong>Different code, same quality</strong>: this <code>buildTree</code> puts the smaller node on the left, so every bit is the flip of slide 29's (E = 0, A = 111, …) and the total is still 234 bits.</li>
</ul>
<div class="pitfall"><code>s + 0</code> works because <code>s</code> is a String: Java turns 0 into "0" and concatenates. Without a String on the left, <code>'0' + 1</code> is arithmetic on character codes and gives 49 — the last line of the output. A classic PE surprise.</div>`,
        `<p class="y-chinh">🎯 Các câu lệnh trên slide là bộ khung của một chương trình mã hoá Huffman thật: đếm tần suất trong mảng R = 256 bộ đếm, dựng cây, rồi dựng bảng mã bằng hàm đệ quy (recursive) buildCode.</p>
<p>Các dòng này có vẻ được chuyển thể từ chương trình Huffman trong sách <em>Algorithms</em> của Sedgewick &amp; Wayne (cùng các tên R, freq, st, buildCode). Để chạy được: lớp <code>Node</code> và hàm <code>buildTree</code> viết theo cách thông dụng đó (slide chỉ gọi <code>buildTree</code>), đầu vào là tài liệu 100 ký tự của slide 23, và sửa một lỗi gõ (typo):</p>
<pre><code class="language-java">import java.util.PriorityQueue;

class Node implements Comparable&lt;Node&gt; {
    char ch; int freq;
    Node left, right;
    Node(char ch, int freq, Node left, Node right) { this.ch = ch; this.freq = freq; this.left = left; this.right = right; }
    boolean isLeaf() { return left == null &amp;&amp; right == null; }
    public int compareTo(Node that) { return this.freq - that.freq; }
}

public class HuffmanSedgewick {
    static final int R = 256;                        // bảng chữ ASCII mở rộng

    static Node buildTree(int[] freq) {
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;();
        for (char c = 0; c &lt; R; c++) if (freq[c] &gt; 0) pq.add(new Node(c, freq[c], null, null));
        while (pq.size() &gt; 1) {
            Node left = pq.poll(), right = pq.poll();    // ở đây nút NHỎ hơn nằm bên trái
            pq.add(new Node('\\0', left.freq + right.freq, left, right));
        }
        return pq.poll();
    }

    // buildCode của slide, giữ nguyên
    static void buildCode(String[] st, Node x, String s) {
        if (!x.isLeaf()) { buildCode(st, x.left, s + 0); buildCode(st, x.right, s + 1); }
        else { st[x.ch] = s; }
    }

    public static void main(String[] args) {
        StringBuilder doc = new StringBuilder();     // 100 ký tự với số lần của slide 23
        int[] count = {20, 9, 15, 11, 40, 5};
        for (int i = 0; i &lt; 6; i++) for (int k = 0; k &lt; count[i]; k++) doc.append((char) ('A' + i));
        char[] input = doc.toString().toCharArray();
        // đếm tần suất
        int[] freq = new int[R];                     // slide gõ lặp "= new int[R];" ở đây: lỗi gõ
        for (int i = 0; i &lt; input.length; i++) freq[input[i]]++;
        // dựng cây Huffman
        Node root = buildTree(freq);
        // dựng bảng mã
        String[] st = new String[R]; buildCode(st, root, "");
        int bits = 0;
        StringBuilder s = new StringBuilder();
        for (char c = 'A'; c &lt;= 'F'; c++) {
            s.append(c).append('=').append(st[c]).append("  ");
            bits += freq[c] * st[c].length();
        }
        System.out.println(s.toString().trim());
        System.out.println("total: " + bits + " bits for " + input.length + " characters");
        System.out.println("\\"\\" + 0 = \\"" + ("" + 0) + "\\"   but   '0' + 1 = " + ('0' + 1));
    }
}</code></pre>
<div class="out">A=111 &nbsp;B=1011 &nbsp;C=110 &nbsp;D=100 &nbsp;E=0 &nbsp;F=1010<br>
total: 234 bits for 100 characters<br>
"" + 0 = "0" &nbsp;&nbsp;but &nbsp;&nbsp;'0' + 1 = 49</div>
<ul>
<li><strong>Lỗi gõ</strong>: slide viết <code>int[] freq = new int[R]; = new int[R];</code> — cụm <code>= new int[R];</code> thứ hai là phần chép thừa, không biên dịch được; chỉ giữ <code>int[] freq = new int[R];</code>.</li>
<li><strong><code>freq[input[i]]++</code></strong>: kiểu <code>char</code> thực chất là một con số, nên dùng thẳng làm chỉ số mảng được — ổn với mã 0–255, nhưng một chữ tiếng Việt như 'ư' (lớn hơn 255) sẽ vượt ra ngoài mảng R = 256.</li>
<li><strong><code>buildCode</code></strong>: ở nút trong (internal node) thì đệ quy sang trái với <code>s + 0</code> và sang phải với <code>s + 1</code>; tới lá thì lưu đường đi làm mã — mỗi nút thăm một lần, O(k).</li>
<li><strong>Mã khác, chất lượng như nhau</strong>: <code>buildTree</code> này đặt nút nhỏ hơn bên trái, nên mọi bit đều bị lật so với slide 29 (E = 0, A = 111, …) mà tổng vẫn là 234 bit.</li>
</ul>
<div class="pitfall"><code>s + 0</code> chạy đúng vì <code>s</code> là String: Java đổi 0 thành "0" rồi nối chuỗi (string concatenation). Không có String đứng bên trái thì <code>'0' + 1</code> là phép cộng trên mã ký tự và cho ra 49 — dòng cuối của kết quả in ra (output). Một cú bất ngờ kinh điển trong đề thi thực hành (PE).</div>`],
      [33, 'Lempel-Ziv Compression',
        `<p class="y-chinh">🎯 Lempel–Ziv methods are dictionary coders — they replace a sequence of symbols by its location in a dictionary; the family comes from Abraham Lempel and Jacob Ziv, was improved by Terry Welch in 1984 (hence LZW: Lempel–Ziv–Welch), and it is lossless.</p>
<ul>
<li><strong>Dictionary coder</strong>: repeated sequences get short references — the unit is a whole string, not one symbol as in Huffman.</li>
<li><strong>The versions on the slide</strong>: LZ77 and LZ78 (Lempel and Ziv, 1977 and 1978) and LZW (Welch's 1984 improvement of LZ78).</li>
<li><strong>Where they live</strong>: LZW in GIF images and the Unix <code>compress</code> tool; LZ77 inside ZIP, gzip and PNG, together with Huffman.</li>
</ul>
<p>The lesson's own example of the basic idea, with a <em>fixed</em> dictionary of words:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;

public class DictionaryCoder {
    public static void main(String[] args) {
        // a fixed dictionary that both sides must already have
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;(Arrays.asList("to", "be", "or", "not", "that", "is", "the", "question"));
        String text = "to be or not to be that is the question to be";
        StringBuilder codes = new StringBuilder(), back = new StringBuilder();
        for (String word : text.split(" ")) codes.append(dict.indexOf(word)).append(' ');   // a word -&gt; its location
        for (String c : codes.toString().trim().split(" ")) back.append(dict.get(Integer.parseInt(c))).append(' ');
        System.out.println("dictionary: " + dict);
        System.out.println("text      : " + text + " (" + text.length() + " characters)");
        System.out.println("codes     : " + codes.toString().trim() + " (12 codes of 3 bits, since 8 entries = 2^3)");
        System.out.println("decoded   : " + back.toString().trim());
    }
}</code></pre>
<div class="out">dictionary: [to, be, or, not, that, is, the, question]<br>
text &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: to be or not to be that is the question to be (45 characters)<br>
codes &nbsp;&nbsp;&nbsp;&nbsp;: 0 1 2 3 0 1 4 5 6 7 0 1 (12 codes of 3 bits, since 8 entries = 2^3)<br>
decoded &nbsp;&nbsp;: to be or not to be that is the question to be</div>
<p>45 characters become 12 codes of 3 bits — but only because the decoder already owns the same dictionary. LZW removes that condition: encoder and decoder both <em>build</em> the dictionary from the data as they go, so it is never sent (slides 34–35, 39–40).</p>
<p class="meo">🧠 <strong>Remember:</strong> Huffman = short codes for frequent <em>symbols</em>; LZW = short codes for repeated <em>strings</em>.</p>`,
        `<p class="y-chinh">🎯 Các phương pháp Lempel–Ziv là bộ mã hoá dùng từ điển (dictionary coder) — thay một dãy ký hiệu bằng vị trí của nó trong từ điển; họ thuật toán này do Abraham Lempel và Jacob Ziv tạo ra, được Terry Welch cải tiến năm 1984 (nên có tên LZW: Lempel–Ziv–Welch), và là nén không mất mát (lossless).</p>
<ul>
<li><strong>Bộ mã hoá dùng từ điển</strong>: các dãy lặp lại được thay bằng tham chiếu ngắn — đơn vị là cả một chuỗi, không phải một ký hiệu như Huffman.</li>
<li><strong>Các phiên bản trên slide</strong>: LZ77 và LZ78 (Lempel và Ziv, 1977 và 1978) và LZW (cải tiến LZ78 của Welch năm 1984).</li>
<li><strong>Chúng đang sống ở đâu</strong>: LZW trong ảnh GIF và lệnh <code>compress</code> của Unix; LZ77 nằm trong ZIP, gzip và PNG, kết hợp với Huffman.</li>
</ul>
<p>Ví dụ của bài cho ý tưởng cơ bản, với một từ điển <em>cố định</em> gồm các từ:</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.Arrays;

public class DictionaryCoder {
    public static void main(String[] args) {
        // một từ điển cố định mà cả hai bên phải có sẵn
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;(Arrays.asList("to", "be", "or", "not", "that", "is", "the", "question"));
        String text = "to be or not to be that is the question to be";
        StringBuilder codes = new StringBuilder(), back = new StringBuilder();
        for (String word : text.split(" ")) codes.append(dict.indexOf(word)).append(' ');   // một từ -&gt; vị trí của nó
        for (String c : codes.toString().trim().split(" ")) back.append(dict.get(Integer.parseInt(c))).append(' ');
        System.out.println("dictionary: " + dict);
        System.out.println("text      : " + text + " (" + text.length() + " characters)");
        System.out.println("codes     : " + codes.toString().trim() + " (12 codes of 3 bits, since 8 entries = 2^3)");
        System.out.println("decoded   : " + back.toString().trim());
    }
}</code></pre>
<div class="out">dictionary: [to, be, or, not, that, is, the, question]<br>
text &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: to be or not to be that is the question to be (45 characters)<br>
codes &nbsp;&nbsp;&nbsp;&nbsp;: 0 1 2 3 0 1 4 5 6 7 0 1 (12 codes of 3 bits, since 8 entries = 2^3)<br>
decoded &nbsp;&nbsp;: to be or not to be that is the question to be</div>
<p>45 ký tự thành 12 mã, mỗi mã 3 bit — nhưng chỉ vì bên giải mã đã có sẵn đúng từ điển đó. LZW bỏ được điều kiện này: bên mã hoá và bên giải mã cùng <em>tự dựng</em> từ điển từ chính dữ liệu trong lúc chạy, nên không bao giờ phải gửi nó đi (slide 34–35, 39–40).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Huffman = mã ngắn cho <em>ký hiệu</em> hay gặp; LZW = mã ngắn cho <em>chuỗi</em> lặp lại.</p>`],
      [34, 'LZW Encoding Algorithm',
        `<p class="y-chinh">🎯 LZW encoding reads the input one character at a time, keeps the longest string P that is already in the dictionary, and when P + C is new it outputs the code of P, adds P + C to the dictionary and restarts P from C.</p>
<p class="ghi-chu">The algorithm on this slide is a figure; its text gives only the first line, "P is a current word, thus at the start, it is empty". Below is the standard LZW encoding algorithm in the same notation — P, C, and the step 3.b that slide 35 refers to.</p>
<pre><code class="language-plaintext">1. The dictionary holds every single character; P = empty.
2. C = the next character of the input.
3. Is the string P + C in the dictionary?
   a. yes: P = P + C                    (extend the current word)
   b. no : output the code of P;
           add P + C to the dictionary;
           P = C
4. More characters?  yes: go back to 2.
                     no : output the code of P.  END</code></pre>
<pre><code class="language-java">String P = "";                               // 1. P = current word, empty at the start
int step = 0, pos = 1;                       // pos = where P starts (1-based)
for (int i = 0; i &lt; input.length(); i++) {
    char C = input.charAt(i);                // 2. C = next character
    if (dict.contains(P + C)) {
        P = P + C;                           // 3.a P+C is known: extend P
    } else {                                 // 3.b output code(P), add P+C, P = C
        dict.add(P + C);
        row(++step, pos, "(" + (dict.size() - 1) + ") " + (P + C), dict.indexOf(P));
        codes.append('(').append(dict.indexOf(P)).append(')');
        P = "" + C;
        pos = i + 1;
    }
}
row(++step, pos, "-", dict.indexOf(P));      // 4. no more input: output code(P)
codes.append('(').append(dict.indexOf(P)).append(')');</code></pre>
<ul>
<li>A code is output only at step 3.b (and once more at step 4) — that is what slide 35 calls one "encoding step".</li>
<li>Every new entry P + C is "an existing entry plus one character", which is what lets the decoder rebuild the same dictionary.</li>
</ul>
<p><strong>Big-O:</strong> one dictionary look-up per input character — O(n) look-ups. With a hash map or a trie each look-up is fast; the teaching code's <code>ArrayList.contains</code> scans the whole list and is only fine for small examples.</p>
<div class="pitfall">Forgetting step 4 — the code of the last P — is the classic LZW bug: the output ends one code short, and the decoder loses the last characters (here the final C).</div>`,
        `<p class="y-chinh">🎯 Mã hoá LZW đọc đầu vào từng ký tự, giữ chuỗi P dài nhất đang có trong từ điển (dictionary), và khi P + C là chuỗi mới thì xuất mã của P, thêm P + C vào từ điển rồi cho P bắt đầu lại từ C.</p>
<p class="ghi-chu">Thuật toán trên slide này là hình vẽ; phần chữ chỉ có dòng đầu, "P is a current word, thus at the start, it is empty" (P là từ hiện tại, nên lúc đầu rỗng). Dưới đây là thuật toán mã hoá LZW chuẩn, viết đúng ký hiệu đó — P, C, và bước 3.b mà slide 35 nhắc tới.</p>
<pre><code class="language-plaintext">1. Từ điển chứa mọi ký tự đơn; P = rỗng.
2. C = ký tự kế tiếp của đầu vào.
3. Chuỗi P + C có trong từ điển không?
   a. có   : P = P + C                  (nối dài từ hiện tại)
   b. không: xuất mã của P;
             thêm P + C vào từ điển;
             P = C
4. Còn ký tự không?  còn: quay lại bước 2.
                     hết: xuất mã của P.  KẾT THÚC</code></pre>
<pre><code class="language-java">String P = "";                               // 1. P = từ hiện tại, lúc đầu rỗng
int step = 0, pos = 1;                       // pos = chỗ P bắt đầu (đếm từ 1)
for (int i = 0; i &lt; input.length(); i++) {
    char C = input.charAt(i);                // 2. C = ký tự kế tiếp
    if (dict.contains(P + C)) {
        P = P + C;                           // 3.a P+C đã có: nối dài P
    } else {                                 // 3.b xuất mã của P, thêm P+C, P = C
        dict.add(P + C);
        row(++step, pos, "(" + (dict.size() - 1) + ") " + (P + C), dict.indexOf(P));
        codes.append('(').append(dict.indexOf(P)).append(')');
        P = "" + C;
        pos = i + 1;
    }
}
row(++step, pos, "-", dict.indexOf(P));      // 4. hết dữ liệu: xuất mã của P
codes.append('(').append(dict.indexOf(P)).append(')');</code></pre>
<ul>
<li>Mã chỉ được xuất ở bước 3.b (và thêm một lần ở bước 4) — đó là thứ slide 35 gọi là một "bước mã hoá" (encoding step).</li>
<li>Mỗi mục mới P + C luôn là "một mục đã có cộng thêm một ký tự", nhờ vậy bên giải mã dựng lại được đúng từ điển đó.</li>
</ul>
<p><strong>Big-O:</strong> mỗi ký tự đầu vào một lần tra từ điển (look-up) — O(n) lần tra. Với bảng băm (hash map) hoặc cây tiền tố (trie) mỗi lần tra rất nhanh; còn <code>ArrayList.contains</code> trong code minh hoạ quét cả danh sách, chỉ ổn với ví dụ nhỏ.</p>
<div class="pitfall">Quên bước 4 — xuất mã của P cuối cùng — là lỗi LZW kinh điển: đầu ra thiếu một mã, và bên giải mã mất mấy ký tự cuối (ở đây là chữ C cuối cùng).</div>`],
      [35, 'LZW Algorithm - Encoding process demo',
        `<p class="y-chinh">🎯 Starting from the dictionary (1)A (2)B (3)C, LZW compresses the input ABBABABAC — the string these codes decode back to — into (1)(2)(2)(4)(7)(3), adding the entries (4) to (8) on the way.</p>
<p>The slide's table (Step, Pos, Dictionary, Output) is a figure; here it is rebuilt by running slide 34's algorithm — compare it row by row with the slide:</p>
<pre><code class="language-java">import java.util.ArrayList;

public class LzwEncode {
    static void row(int step, int pos, String dict, int out) {
        System.out.println(String.format("%-5d%-4d%-11s(%d)", step, pos, dict, out));
    }

    public static void main(String[] args) {
        String input = "ABBABABAC";
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;();
        dict.add(null);                              // slot 0 unused: codes start at (1) as on slide 35
        dict.add("A"); dict.add("B"); dict.add("C"); // (1)A (2)B (3)C
        System.out.println("Step Pos Dictionary Output");
        StringBuilder codes = new StringBuilder();
        String P = "";                               // 1. P = current word, empty at the start
        int step = 0, pos = 1;                       // pos = where P starts (1-based)
        for (int i = 0; i &lt; input.length(); i++) {
            char C = input.charAt(i);                // 2. C = next character
            if (dict.contains(P + C)) {
                P = P + C;                           // 3.a P+C is known: extend P
            } else {                                 // 3.b output code(P), add P+C, P = C
                dict.add(P + C);
                row(++step, pos, "(" + (dict.size() - 1) + ") " + (P + C), dict.indexOf(P));
                codes.append('(').append(dict.indexOf(P)).append(')');
                P = "" + C;
                pos = i + 1;
            }
        }
        row(++step, pos, "-", dict.indexOf(P));      // 4. no more input: output code(P)
        codes.append('(').append(dict.indexOf(P)).append(')');
        System.out.println("compressed: " + codes + "  (" + input.length() + " characters -&gt; " + step + " codes)");
    }
}</code></pre>
<div class="out">Step Pos Dictionary Output<br>
1 &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;(4) AB &nbsp;&nbsp;&nbsp;&nbsp;(1)<br>
2 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;(5) BB &nbsp;&nbsp;&nbsp;&nbsp;(2)<br>
3 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;(6) BA &nbsp;&nbsp;&nbsp;&nbsp;(2)<br>
4 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;(7) ABA &nbsp;&nbsp;&nbsp;(4)<br>
5 &nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;(8) ABAC &nbsp;&nbsp;(7)<br>
6 &nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)<br>
compressed: (1)(2)(2)(4)(7)(3) &nbsp;(9 characters -&gt; 6 codes)</div>
<ul>
<li><strong>Step</strong>: one row per code output; each row ends when step 3.b runs (the last row is step 4).</li>
<li><strong>Pos</strong>: the position in the input (from 1) where the string being output starts — A at 1, B at 2, B at 3, AB at 4–5, ABA at 6–8, C at 9.</li>
<li><strong>Dictionary</strong>: the entry added in that step, with its index — AB, BB, BA, ABA, ABAC as (4) … (8).</li>
<li><strong>Output</strong>: the code of P; step 5 already uses (7) = ABA, the entry created one step earlier.</li>
</ul>
<p>9 characters became 6 codes; on longer, more repetitive inputs the dictionary entries grow longer and the saving grows with them.</p>
<div class="pitfall">The slide numbers codes from (1). Real LZW gives the 256 single bytes the codes 0–255 and new entries 256, 257, … — the algorithm is identical, only the numbers shift. Use the numbering the question gives.</div>`,
        `<p class="y-chinh">🎯 Bắt đầu từ từ điển (1)A (2)B (3)C, LZW nén đầu vào ABBABABAC — chính là chuỗi mà các mã này giải ngược ra — thành (1)(2)(2)(4)(7)(3), dọc đường thêm các mục (4) tới (8).</p>
<p>Bảng của slide (Step — bước, Pos — vị trí, Dictionary — từ điển, Output — đầu ra) là hình vẽ; dưới đây là bảng được dựng lại bằng cách chạy thuật toán ở slide 34 — hãy so từng dòng với slide:</p>
<pre><code class="language-java">import java.util.ArrayList;

public class LzwEncode {
    static void row(int step, int pos, String dict, int out) {
        System.out.println(String.format("%-5d%-4d%-11s(%d)", step, pos, dict, out));
    }

    public static void main(String[] args) {
        String input = "ABBABABAC";
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;();
        dict.add(null);                              // bỏ trống ô 0: mã bắt đầu từ (1) như slide 35
        dict.add("A"); dict.add("B"); dict.add("C"); // (1)A (2)B (3)C
        System.out.println("Step Pos Dictionary Output");
        StringBuilder codes = new StringBuilder();
        String P = "";                               // 1. P = từ hiện tại, lúc đầu rỗng
        int step = 0, pos = 1;                       // pos = chỗ P bắt đầu (đếm từ 1)
        for (int i = 0; i &lt; input.length(); i++) {
            char C = input.charAt(i);                // 2. C = ký tự kế tiếp
            if (dict.contains(P + C)) {
                P = P + C;                           // 3.a P+C đã có: nối dài P
            } else {                                 // 3.b xuất mã của P, thêm P+C, P = C
                dict.add(P + C);
                row(++step, pos, "(" + (dict.size() - 1) + ") " + (P + C), dict.indexOf(P));
                codes.append('(').append(dict.indexOf(P)).append(')');
                P = "" + C;
                pos = i + 1;
            }
        }
        row(++step, pos, "-", dict.indexOf(P));      // 4. hết dữ liệu: xuất mã của P
        codes.append('(').append(dict.indexOf(P)).append(')');
        System.out.println("compressed: " + codes + "  (" + input.length() + " characters -&gt; " + step + " codes)");
    }
}</code></pre>
<div class="out">Step Pos Dictionary Output<br>
1 &nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;(4) AB &nbsp;&nbsp;&nbsp;&nbsp;(1)<br>
2 &nbsp;&nbsp;&nbsp;2 &nbsp;&nbsp;(5) BB &nbsp;&nbsp;&nbsp;&nbsp;(2)<br>
3 &nbsp;&nbsp;&nbsp;3 &nbsp;&nbsp;(6) BA &nbsp;&nbsp;&nbsp;&nbsp;(2)<br>
4 &nbsp;&nbsp;&nbsp;4 &nbsp;&nbsp;(7) ABA &nbsp;&nbsp;&nbsp;(4)<br>
5 &nbsp;&nbsp;&nbsp;6 &nbsp;&nbsp;(8) ABAC &nbsp;&nbsp;(7)<br>
6 &nbsp;&nbsp;&nbsp;9 &nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3)<br>
compressed: (1)(2)(2)(4)(7)(3) &nbsp;(9 characters -&gt; 6 codes)</div>
<ul>
<li><strong>Step</strong>: mỗi mã xuất ra là một dòng; mỗi dòng kết thúc khi bước 3.b chạy (dòng cuối là bước 4).</li>
<li><strong>Pos</strong>: vị trí trong đầu vào (đếm từ 1) nơi chuỗi đang được xuất bắt đầu — A ở 1, B ở 2, B ở 3, AB ở 4–5, ABA ở 6–8, C ở 9.</li>
<li><strong>Dictionary</strong>: mục vừa thêm ở bước đó, kèm chỉ số — AB, BB, BA, ABA, ABAC là (4) … (8).</li>
<li><strong>Output</strong>: mã của P; bước 5 đã dùng ngay (7) = ABA, mục vừa được tạo ở bước trước.</li>
</ul>
<p>9 ký tự thành 6 mã; với đầu vào dài hơn và lặp nhiều hơn, các mục từ điển dài dần và phần tiết kiệm cũng tăng theo.</p>
<div class="pitfall">Slide đánh số mã từ (1). LZW thật gán cho 256 byte đơn các mã 0–255 và các mục mới là 256, 257, … — thuật toán y hệt, chỉ các con số dịch đi. Dùng đúng cách đánh số mà đề bài cho.</div>`],
      [36, 'Run-Length Encoding',
        `<p class="y-chinh">🎯 Run-length encoding replaces every run of identical symbols by its length and the symbol: FFFFOOOOFFFOOFFFFFOOOOOOO → 4F4O3F2O5F7O, compression rate (25 − 12)/25 = 52%.</p>
<pre><code class="language-java">import java.util.Locale;

public class Rle {
    static String encode(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i &lt; s.length(); ) {
            int j = i;
            while (j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i)) j++;   // s[i..j-1] is one run
            out.append(j - i).append(s.charAt(i));                     // count, then the symbol
            i = j;
        }
        return out.toString();
    }

    static String decode(String s) {
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) count = count * 10 + (c - '0');  // counts may have several digits
            else { for (int k = 0; k &lt; count; k++) out.append(c); count = 0; }
        }
        return out.toString();
    }

    static void show(String raw) {
        String packed = encode(raw);
        int in = raw.length(), out = packed.length();
        System.out.println(raw + " (" + in + ") -&gt; " + packed + " (" + out + "), decodes back: " + decode(packed).equals(raw)
                + String.format(Locale.US, ", rate = (%d - %d) / %d = %.0f%%", in, out, in, 100.0 * (in - out) / in));
    }

    public static void main(String[] args) {
        show("FFFFOOOOFFFOOFFFFFOOOOOOOO");               // the raw line exactly as typed on the slide
        show("FFFFOOOOFFFOOFFFFFOOOOOOO");                // with 7 O at the end, as 4F4O3F2O5F7O says
        show("WWWWWWWWWWWWBWWWW");                        // a run of 12: two digits
        show("ABCD");                                     // no runs: RLE doubles the size
    }
}</code></pre>
<div class="out">FFFFOOOOFFFOOFFFFFOOOOOOOO (26) -&gt; 4F4O3F2O5F8O (12), decodes back: true, rate = (26 - 12) / 26 = 54%<br>
FFFFOOOOFFFOOFFFFFOOOOOOO (25) -&gt; 4F4O3F2O5F7O (12), decodes back: true, rate = (25 - 12) / 25 = 52%<br>
WWWWWWWWWWWWBWWWW (17) -&gt; 12W1B4W (7), decodes back: true, rate = (17 - 7) / 17 = 59%<br>
ABCD (4) -&gt; 1A1B1C1D (8), decodes back: true, rate = (4 - 8) / 4 = -100%</div>
<ul>
<li><strong>A check on the slide</strong>: the Raw line as typed has 26 letters (it ends with 8 O's), while the compressed line, the run lengths 4 4 3 2 5 7 and the rate all describe 25 letters with 7 O's. Output line 2 is the consistent version (52%); line 1 is the Raw line exactly as typed (…8O, 54%).</li>
<li><strong>Counts of 10 or more</strong> need several digits (12W), so the decoder must read a whole number before each symbol.</li>
<li><strong>Bad input</strong>: without runs (ABCD) every symbol costs two characters — the output is twice as long, a rate of −100%.</li>
<li><strong>Where RLE pays off</strong>: long runs — black-and-white scans, simple drawings, cartoon-like images with large flat areas.</li>
</ul>
<p><strong>Big-O:</strong> one pass to encode and one to decode — O(n) each, no extra memory besides the output.</p>
<div class="pitfall">A decoder that reads (digit, symbol) pairs takes "12W" as "one '2'" and then breaks on "W". Accumulate the digits — <code>count = count * 10 + (c - '0')</code> — as <code>decode</code> above does.</div>`,
        `<p class="y-chinh">🎯 Mã hoá độ dài loạt (run-length encoding — RLE) thay mỗi loạt (run) ký hiệu giống nhau liền nhau bằng độ dài loạt và ký hiệu: FFFFOOOOFFFOOFFFFFOOOOOOO → 4F4O3F2O5F7O, tỉ lệ nén (25 − 12)/25 = 52%.</p>
<pre><code class="language-java">import java.util.Locale;

public class Rle {
    static String encode(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i &lt; s.length(); ) {
            int j = i;
            while (j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i)) j++;   // s[i..j-1] là một loạt
            out.append(j - i).append(s.charAt(i));                     // số lần, rồi ký hiệu
            i = j;
        }
        return out.toString();
    }

    static String decode(String s) {
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) count = count * 10 + (c - '0');  // số lần có thể nhiều chữ số
            else { for (int k = 0; k &lt; count; k++) out.append(c); count = 0; }
        }
        return out.toString();
    }

    static void show(String raw) {
        String packed = encode(raw);
        int in = raw.length(), out = packed.length();
        System.out.println(raw + " (" + in + ") -&gt; " + packed + " (" + out + "), decodes back: " + decode(packed).equals(raw)
                + String.format(Locale.US, ", rate = (%d - %d) / %d = %.0f%%", in, out, in, 100.0 * (in - out) / in));
    }

    public static void main(String[] args) {
        show("FFFFOOOOFFFOOFFFFFOOOOOOOO");               // dòng Raw đúng như gõ trên slide
        show("FFFFOOOOFFFOOFFFFFOOOOOOO");                // với 7 chữ O ở cuối, như 4F4O3F2O5F7O
        show("WWWWWWWWWWWWBWWWW");                        // một loạt dài 12: hai chữ số
        show("ABCD");                                     // không có loạt: RLE làm dài gấp đôi
    }
}</code></pre>
<div class="out">FFFFOOOOFFFOOFFFFFOOOOOOOO (26) -&gt; 4F4O3F2O5F8O (12), decodes back: true, rate = (26 - 12) / 26 = 54%<br>
FFFFOOOOFFFOOFFFFFOOOOOOO (25) -&gt; 4F4O3F2O5F7O (12), decodes back: true, rate = (25 - 12) / 25 = 52%<br>
WWWWWWWWWWWWBWWWW (17) -&gt; 12W1B4W (7), decodes back: true, rate = (17 - 7) / 17 = 59%<br>
ABCD (4) -&gt; 1A1B1C1D (8), decodes back: true, rate = (4 - 8) / 4 = -100%</div>
<ul>
<li><strong>Soát lại slide</strong>: dòng Raw (dữ liệu gốc) như được gõ có 26 chữ (kết thúc bằng 8 chữ O), trong khi dòng nén, các độ dài loạt 4 4 3 2 5 7 và tỉ lệ nén đều ứng với 25 chữ, 7 chữ O. Dòng 2 của kết quả in ra (output) là bản nhất quán (52%); dòng 1 là dòng Raw đúng như gõ (…8O, 54%).</li>
<li><strong>Số lần từ 10 trở lên</strong> cần nhiều chữ số (12W), nên bộ giải mã phải đọc trọn một số trước mỗi ký hiệu.</li>
<li><strong>Đầu vào bất lợi</strong>: không có loạt nào (ABCD) thì mỗi ký hiệu tốn hai ký tự — đầu ra dài gấp đôi, tỉ lệ nén −100%.</li>
<li><strong>RLE đáng dùng ở đâu</strong>: chỗ có loạt dài — bản quét đen trắng, hình vẽ đơn giản, ảnh kiểu hoạt hình có những mảng màu phẳng lớn.</li>
</ul>
<p><strong>Big-O:</strong> một lượt để mã hoá và một lượt để giải mã — mỗi chiều O(n), không tốn bộ nhớ thêm ngoài đầu ra.</p>
<div class="pitfall">Bộ giải mã đọc theo cặp (một chữ số, một ký hiệu) sẽ hiểu "12W" là "một chữ '2'" rồi hỏng ở "W". Hãy cộng dồn các chữ số — <code>count = count * 10 + (c - '0')</code> — như hàm <code>decode</code> ở trên.</div>`],
      [37, 'Summary',
        `<p class="y-chinh">🎯 The deck in one sentence: find patterns fast (brute force O(nm), KMP O(n + m)) and store text small (lossless codes bounded by entropy — Huffman, LZW, RLE each remove a different kind of redundancy).</p>
<table>
<thead><tr><th>Topic on the summary</th><th>One-line takeaway</th><th>Cost</th></tr></thead>
<tbody>
<tr><td>Abundance of digitized text</td><td>web, documents, email, social feeds, DNA — all strings</td><td>—</td></tr>
<tr><td>The problem of string matching</td><td>the position of p (length m) in S (length n), or −1</td><td>—</td></tr>
<tr><td>Brute-force algorithm</td><td>try every shift, restart at p[0] after a mismatch</td><td>O(nm) worst case</td></tr>
<tr><td>Knuth-Morris-Pratt algorithm</td><td>T[] from the pattern; the text position never goes back</td><td>O(m) + O(n)</td></tr>
<tr><td>Data compression</td><td>fewer bits; lossy vs lossless</td><td>time to encode and decode</td></tr>
<tr><td>Condition for data compression</td><td>uniquely decodable (prefix) codes; average length ≥ entropy</td><td>—</td></tr>
<tr><td>Huffman coding algorithm</td><td>merge the two smallest; code = root-to-leaf path</td><td>O(k log k) to build</td></tr>
<tr><td>LZW algorithm</td><td>a dictionary built by both sides; special case when decoding</td><td>O(n) look-ups</td></tr>
<tr><td>Run-length encoding</td><td>count + symbol for each run</td><td>O(n)</td></tr>
</tbody>
</table>
<ul>
<li><strong>Complexities to know by heart</strong>: brute force O(nm), KMP O(n + m), Huffman build O(k log k), LZW and RLE O(n).</li>
<li><strong>Hand computations</strong>: brute-force comparisons, T[] of a pattern, Huffman codes and average length, LZW codes, an RLE rate.</li>
<li><strong>Traps inside this deck</strong>: the shift direction (slide 8), the 1.89 average (slide 30), the 26-letter raw string (slide 36), the missing C (slide 40).</li>
<li><strong>Definitions</strong>: lossy/lossless, entropy, compression rate, prefix code.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> keep one worked example per method in your head — abaa in abcabaabcabac, the T[] of 101011, the six Huffman codes, (1)(2)(2)(4)(7)(3), 4F4O3F2O5F7O.</p>`,
        `<p class="y-chinh">🎯 Cả bộ slide trong một câu: tìm mẫu thật nhanh (vét cạn O(nm), KMP O(n + m)) và lưu văn bản thật gọn (mã không mất mát bị chặn dưới bởi entropy — lượng tin trung bình; Huffman, LZW, RLE — mã hoá độ dài loạt — mỗi thuật toán gỡ một kiểu dư thừa khác nhau).</p>
<table>
<thead><tr><th>Mục trong phần tóm tắt</th><th>Điều cần mang theo</th><th>Chi phí</th></tr></thead>
<tbody>
<tr><td>Abundance of digitized text (văn bản số hoá tràn ngập)</td><td>web, tài liệu, thư, mạng xã hội, DNA — tất cả là chuỗi</td><td>—</td></tr>
<tr><td>The problem of string matching (bài toán so khớp chuỗi)</td><td>vị trí của p (dài m) trong S (dài n), hoặc −1</td><td>—</td></tr>
<tr><td>Brute-force algorithm (vét cạn)</td><td>thử mọi lần dịch, sai khớp thì làm lại từ p[0]</td><td>O(nm) trường hợp xấu nhất</td></tr>
<tr><td>Knuth-Morris-Pratt algorithm (KMP)</td><td>bảng T[] tính từ mẫu; vị trí trên văn bản không bao giờ lùi</td><td>O(m) + O(n)</td></tr>
<tr><td>Data compression (nén dữ liệu)</td><td>ít bit hơn; mất mát và không mất mát</td><td>thời gian mã hoá và giải mã</td></tr>
<tr><td>Condition for data compression (điều kiện để nén)</td><td>mã giải được duy nhất (mã tiền tố); độ dài trung bình ≥ entropy</td><td>—</td></tr>
<tr><td>Huffman coding algorithm (mã Huffman)</td><td>gộp hai nút nhỏ nhất; mã = đường đi từ gốc tới lá</td><td>O(k log k) để dựng</td></tr>
<tr><td>LZW algorithm (LZW)</td><td>từ điển do cả hai bên cùng dựng; ca đặc biệt khi giải mã</td><td>O(n) lần tra</td></tr>
<tr><td>Run-length encoding (mã hoá độ dài loạt)</td><td>mỗi loạt ghi thành số lần + ký hiệu</td><td>O(n)</td></tr>
</tbody>
</table>
<ul>
<li><strong>Độ phức tạp phải thuộc</strong>: vét cạn (brute force) O(nm), KMP O(n + m), dựng cây Huffman O(k log k), LZW và RLE O(n).</li>
<li><strong>Các phép tính tay</strong>: số phép so sánh của vét cạn, bảng T[] của một mẫu, mã Huffman và độ dài trung bình, dãy mã LZW, tỉ lệ nén RLE.</li>
<li><strong>Bẫy nằm ngay trong bộ slide</strong>: hướng dịch mẫu (slide 8), độ dài trung bình 1.89 (slide 30), chuỗi gốc (raw) 26 chữ (slide 36), chữ C bị thiếu (slide 40).</li>
<li><strong>Định nghĩa</strong>: nén mất mát (lossy) và không mất mát (lossless), entropy, tỉ lệ nén (compression rate), mã tiền tố (prefix code).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> với mỗi phương pháp, giữ sẵn trong đầu một ví dụ đã làm — abaa trong abcabaabcabac, bảng T[] của 101011, sáu mã Huffman, (1)(2)(2)(4)(7)(3), 4F4O3F2O5F7O.</p>`],
      [38, 'Reading at home',
        `<p class="y-chinh">🎯 Chapter 13 of Goodrich 6e, Text Processing (p.573), is the textbook version of this deck — the slide lists the sections to read.</p>
<ul>
<li><strong>§13.1 Abundance of Digitized Text (p.574)</strong> — slide 3, plus the book's notation for strings: substring, prefix, suffix.</li>
<li><strong>§13.2 Pattern-Matching Algorithms (p.576), §13.2.1 Brute Force (p.576)</strong> — slides 4–9.</li>
<li><strong>§13.2.3 The Knuth-Morris-Pratt Algorithm (p.582)</strong> — slides 10–15; the book's failure function starts at 0, fail[k] = T[k + 1].</li>
<li><strong>§13.4 Text Compression and the Greedy Method (p.595), §13.4.1 The Huffman Coding Algorithm (p.596)</strong> — slides 16–32; the book presents Huffman as an example of a greedy algorithm.</li>
</ul>
<p>The list jumps from §13.2.1 to §13.2.3, so the section between them is not required. LZW and RLE are not on the list — for them, slides 33–36 and 39–40 plus lesson 8.4 are your reading.</p>`,
        `<p class="y-chinh">🎯 Chương 13 của sách Goodrich bản 6, Text Processing (Xử lý văn bản, tr.573), là phiên bản giáo trình của bộ slide này — slide liệt kê các mục cần đọc.</p>
<ul>
<li><strong>§13.1 Abundance of Digitized Text (tr.574)</strong> (văn bản số hoá tràn ngập) — slide 3, kèm ký hiệu của sách cho chuỗi: xâu con (substring), tiền tố (prefix), hậu tố (suffix).</li>
<li><strong>§13.2 Pattern-Matching Algorithms (tr.576), §13.2.1 Brute Force (tr.576)</strong> — slide 4–9 (so khớp mẫu, vét cạn).</li>
<li><strong>§13.2.3 The Knuth-Morris-Pratt Algorithm (tr.582)</strong> — slide 10–15; hàm thất bại (failure function) của sách bắt đầu từ 0, fail[k] = T[k + 1].</li>
<li><strong>§13.4 Text Compression and the Greedy Method (tr.595), §13.4.1 The Huffman Coding Algorithm (tr.596)</strong> — slide 16–32 (nén văn bản, mã Huffman); sách trình bày Huffman như một ví dụ của thuật toán tham lam (greedy).</li>
</ul>
<p>Danh sách nhảy từ §13.2.1 sang §13.2.3, nên mục ở giữa không bắt buộc. LZW và RLE (mã hoá độ dài loạt) không có trong danh sách — với hai thuật toán này, tài liệu đọc là slide 33–36, 39–40 và bài 8.4.</p>`],
      [39, 'LZW Decoding Algorithm',
        `<p class="y-chinh">🎯 LZW decoding reads the codes one by one and rebuilds exactly the encoder's dictionary: output the string of the current code cW, and add "the string of the previous code pW + the first character of the current string".</p>
<p class="ghi-chu">This slide shows the decoding algorithm as a figure — its text is only the title. Below is the standard LZW decoding algorithm, in the notation (pW, cW, string.cW) that slide 40 uses.</p>
<pre><code class="language-plaintext">1. The dictionary holds every single character.
2. cW = the first code word (always a single character).
3. Output string.cW.
4. pW = cW.
5. cW = the next code word.
6. Is cW in the dictionary?
   yes: output string.cW;
        add string.pW + first character of string.cW
   no : (special case) X = string.pW + first character of string.pW;
        output X and add it to the dictionary (it gets the number cW)
7. More code words?  yes: go back to 4.   no: END</code></pre>
<pre><code class="language-java">int cW = codes[0];                           // the first code word is always a root
out.append(dict.get(cW));                    // output string.cW
row(1, cW, "-", dict.get(cW), "-");
for (int k = 1; k &lt; codes.length; k++) {
    int pW = cW;                             // pW := cW
    cW = codes[k];                           // cW := next code word
    String s;
    String note = "";
    if (cW &lt; dict.size()) {                  // string.cW is in the dictionary
        s = dict.get(cW);
        dict.add(dict.get(pW) + s.charAt(0));     // string.pW + first char of string.cW
    } else {                                 // special case: cW is not there yet
        s = dict.get(pW) + dict.get(pW).charAt(0);   // string.pW + its own first char
        dict.add(s);
        note = "  &lt;- cW not in the dictionary yet";
    }
    out.append(s);
    row(k + 1, cW, "(" + pW + ")", s, "(" + (dict.size() - 1) + ") " + dict.get(dict.size() - 1) + note);
    if (k == 4) afterFive = out.toString();
}</code></pre>
<ul>
<li>The decoder is always one entry behind the encoder: it can complete an entry only when it sees the next code.</li>
<li><strong>The special case</strong> happens when the encoder used an entry in the very step after creating it — inputs of the form c S c S c, such as ABABA inside ABBABABAC. The entry must then be pW's string plus its own first character; nothing else is consistent.</li>
</ul>
<p><strong>Big-O:</strong> one dictionary access per code, plus the characters written out → O(n) for n output characters.</p>
<div class="pitfall">Without the "no" branch the decoder calls <code>dict.get(cW)</code> on an entry that does not exist yet → <code>IndexOutOfBoundsException</code> (or null). Every correct LZW decoder needs this branch, and the slides' own example triggers it at step 5.</div>`,
        `<p class="y-chinh">🎯 Giải mã LZW đọc từng mã một và dựng lại đúng từ điển của bên mã hoá: xuất chuỗi của mã hiện tại cW, và thêm "chuỗi của mã trước pW + ký tự đầu của chuỗi hiện tại".</p>
<p class="ghi-chu">Slide này trình bày thuật toán giải mã bằng hình vẽ — phần chữ chỉ có tiêu đề. Dưới đây là thuật toán giải mã LZW chuẩn, viết theo đúng ký hiệu (pW, cW, string.cW) mà slide 40 dùng.</p>
<pre><code class="language-plaintext">1. Từ điển chứa mọi ký tự đơn.
2. cW = mã đầu tiên (luôn là một ký tự đơn).
3. Xuất string.cW.
4. pW = cW.
5. cW = mã kế tiếp.
6. cW có trong từ điển không?
   có   : xuất string.cW;
          thêm string.pW + ký tự đầu của string.cW
   không: (ca đặc biệt) X = string.pW + ký tự đầu của string.pW;
          xuất X và thêm X vào từ điển (nó nhận đúng số cW)
7. Còn mã không?  còn: quay lại bước 4.   hết: KẾT THÚC</code></pre>
<pre><code class="language-java">int cW = codes[0];                           // mã đầu tiên luôn là một gốc (ký tự đơn)
out.append(dict.get(cW));                    // xuất string.cW
row(1, cW, "-", dict.get(cW), "-");
for (int k = 1; k &lt; codes.length; k++) {
    int pW = cW;                             // pW := cW
    cW = codes[k];                           // cW := mã kế tiếp
    String s;
    String note = "";
    if (cW &lt; dict.size()) {                  // string.cW có trong từ điển
        s = dict.get(cW);
        dict.add(dict.get(pW) + s.charAt(0));     // string.pW + ký tự đầu của string.cW
    } else {                                 // ca đặc biệt: cW chưa có
        s = dict.get(pW) + dict.get(pW).charAt(0);   // string.pW + ký tự đầu của chính nó
        dict.add(s);
        note = "  &lt;- cW not in the dictionary yet";
    }
    out.append(s);
    row(k + 1, cW, "(" + pW + ")", s, "(" + (dict.size() - 1) + ") " + dict.get(dict.size() - 1) + note);
    if (k == 4) afterFive = out.toString();
}</code></pre>
<ul>
<li>Bên giải mã (decoder) luôn chậm hơn bên mã hoá một mục: nó chỉ hoàn tất được một mục khi thấy mã kế tiếp.</li>
<li><strong>Ca đặc biệt (special case)</strong> xảy ra khi bên mã hoá dùng một mục ngay ở bước liền sau lúc tạo ra nó — với đầu vào dạng c S c S c, như đoạn ABABA trong ABBABABAC. Khi đó mục mới buộc phải là chuỗi của pW cộng ký tự đầu của chính nó; không có lựa chọn nào khác hợp lý.</li>
</ul>
<p><strong>Big-O:</strong> mỗi mã một lần truy cập từ điển, cộng các ký tự được ghi ra → O(n) với n ký tự đầu ra.</p>
<div class="pitfall">Thiếu nhánh "không", bộ giải mã gọi <code>dict.get(cW)</code> trên một mục chưa tồn tại → <code>IndexOutOfBoundsException</code> (hoặc null). Mọi bộ giải mã LZW đúng đều cần nhánh này, và chính ví dụ của slide kích hoạt nó ở bước 5.</div>`],
      [40, 'LZW Algorithm - Decoding process demo',
        `<p class="y-chinh">🎯 Decoding (1)(2)(2)(4)(7)(3) with the starting dictionary (1)A (2)B (3)C rebuilds the entries (4)–(8) and the original text ABBABABAC; step 5 is the special case, because cW = (7) is not yet in the dictionary.</p>
<pre><code class="language-java">import java.util.ArrayList;

public class LzwDecode {
    static void row(int step, int cW, String pW, String out, String dict) {
        System.out.println(String.format("%-5d%-5s%-4s%-7s%s", step, "(" + cW + ")", pW, out, dict));
    }

    public static void main(String[] args) {
        int[] codes = {1, 2, 2, 4, 7, 3};            // the compressed output of slide 35
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;();
        dict.add(null);
        dict.add("A"); dict.add("B"); dict.add("C"); // (1)A (2)B (3)C
        StringBuilder out = new StringBuilder();
        String afterFive = "";
        System.out.println("Step cW   pW  Output Dictionary");
        int cW = codes[0];                           // the first code word is always a root
        out.append(dict.get(cW));                    // output string.cW
        row(1, cW, "-", dict.get(cW), "-");
        for (int k = 1; k &lt; codes.length; k++) {
            int pW = cW;                             // pW := cW
            cW = codes[k];                           // cW := next code word
            String s;
            String note = "";
            if (cW &lt; dict.size()) {                  // string.cW is in the dictionary
                s = dict.get(cW);
                dict.add(dict.get(pW) + s.charAt(0));     // string.pW + first char of string.cW
            } else {                                 // special case: cW is not there yet
                s = dict.get(pW) + dict.get(pW).charAt(0);   // string.pW + its own first char
                dict.add(s);
                note = "  &lt;- cW not in the dictionary yet";
            }
            out.append(s);
            row(k + 1, cW, "(" + pW + ")", s, "(" + (dict.size() - 1) + ") " + dict.get(dict.size() - 1) + note);
            if (k == 4) afterFive = out.toString();
        }
        System.out.println("decompressed: " + out + " (" + out.length() + " characters)");
        System.out.println("output of the first five codes only: " + afterFive);
    }
}</code></pre>
<div class="out">Step cW &nbsp;&nbsp;pW &nbsp;Output Dictionary<br>
1 &nbsp;&nbsp;&nbsp;(1) &nbsp;- &nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
2 &nbsp;&nbsp;&nbsp;(2) &nbsp;(1) B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(4) AB<br>
3 &nbsp;&nbsp;&nbsp;(2) &nbsp;(2) B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5) BB<br>
4 &nbsp;&nbsp;&nbsp;(4) &nbsp;(2) AB &nbsp;&nbsp;&nbsp;&nbsp;(6) BA<br>
5 &nbsp;&nbsp;&nbsp;(7) &nbsp;(4) ABA &nbsp;&nbsp;&nbsp;(7) ABA &nbsp;&lt;- cW not in the dictionary yet<br>
6 &nbsp;&nbsp;&nbsp;(3) &nbsp;(7) C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(8) ABAC<br>
decompressed: ABBABABAC (9 characters)<br>
output of the first five codes only: ABBABABA</div>
<ul>
<li><strong>Step 4, as the slide explains it</strong>: pW = (2), cW = (4); string.cW = AB is output, and string.pW (B) + the first character of string.cW (A) = BA is added as (6).</li>
<li><strong>Step 5</strong>: pW = (4), cW = (7), but the dictionary only reaches (6). So string.pW (AB) + its own first character (A) = ABA is stored as (7) and, since cW is (7), it is also output.</li>
<li><strong>The same dictionary as the encoder</strong>: (4) AB, (5) BB, (6) BA, (7) ABA, (8) ABAC — compare with slide 35.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> normally, add previous + first letter of the current string; if the current code is the one still being built, the current string is previous + first letter of previous.</p>
<div class="pitfall">The slide gives the decompressed output as ABBABABA — 8 letters. That is only what the first five codes produce (the last line of the output); the sixth code (3) adds C, so the full result is ABBABABAC, exactly the 9 characters that were encoded. In an exam, decode every code.</div>`,
        `<p class="y-chinh">🎯 Giải mã (1)(2)(2)(4)(7)(3) với từ điển ban đầu (1)A (2)B (3)C sẽ dựng lại các mục (4)–(8) và văn bản gốc ABBABABAC; bước 5 là ca đặc biệt, vì cW = (7) chưa có trong từ điển.</p>
<pre><code class="language-java">import java.util.ArrayList;

public class LzwDecode {
    static void row(int step, int cW, String pW, String out, String dict) {
        System.out.println(String.format("%-5d%-5s%-4s%-7s%s", step, "(" + cW + ")", pW, out, dict));
    }

    public static void main(String[] args) {
        int[] codes = {1, 2, 2, 4, 7, 3};            // đầu ra nén của slide 35
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;();
        dict.add(null);
        dict.add("A"); dict.add("B"); dict.add("C"); // (1)A (2)B (3)C
        StringBuilder out = new StringBuilder();
        String afterFive = "";
        System.out.println("Step cW   pW  Output Dictionary");
        int cW = codes[0];                           // mã đầu tiên luôn là một gốc (ký tự đơn)
        out.append(dict.get(cW));                    // xuất string.cW
        row(1, cW, "-", dict.get(cW), "-");
        for (int k = 1; k &lt; codes.length; k++) {
            int pW = cW;                             // pW := cW
            cW = codes[k];                           // cW := mã kế tiếp
            String s;
            String note = "";
            if (cW &lt; dict.size()) {                  // string.cW có trong từ điển
                s = dict.get(cW);
                dict.add(dict.get(pW) + s.charAt(0));     // string.pW + ký tự đầu của string.cW
            } else {                                 // ca đặc biệt: cW chưa có
                s = dict.get(pW) + dict.get(pW).charAt(0);   // string.pW + ký tự đầu của chính nó
                dict.add(s);
                note = "  &lt;- cW not in the dictionary yet";
            }
            out.append(s);
            row(k + 1, cW, "(" + pW + ")", s, "(" + (dict.size() - 1) + ") " + dict.get(dict.size() - 1) + note);
            if (k == 4) afterFive = out.toString();
        }
        System.out.println("decompressed: " + out + " (" + out.length() + " characters)");
        System.out.println("output of the first five codes only: " + afterFive);
    }
}</code></pre>
<div class="out">Step cW &nbsp;&nbsp;pW &nbsp;Output Dictionary<br>
1 &nbsp;&nbsp;&nbsp;(1) &nbsp;- &nbsp;&nbsp;A &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-<br>
2 &nbsp;&nbsp;&nbsp;(2) &nbsp;(1) B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(4) AB<br>
3 &nbsp;&nbsp;&nbsp;(2) &nbsp;(2) B &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(5) BB<br>
4 &nbsp;&nbsp;&nbsp;(4) &nbsp;(2) AB &nbsp;&nbsp;&nbsp;&nbsp;(6) BA<br>
5 &nbsp;&nbsp;&nbsp;(7) &nbsp;(4) ABA &nbsp;&nbsp;&nbsp;(7) ABA &nbsp;&lt;- cW not in the dictionary yet<br>
6 &nbsp;&nbsp;&nbsp;(3) &nbsp;(7) C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(8) ABAC<br>
decompressed: ABBABABAC (9 characters)<br>
output of the first five codes only: ABBABABA</div>
<ul>
<li><strong>Bước 4, đúng như slide giải thích</strong>: pW = (2), cW = (4); xuất string.cW = AB, rồi thêm string.pW (B) + ký tự đầu của string.cW (A) = BA làm mục (6).</li>
<li><strong>Bước 5</strong>: pW = (4), cW = (7), nhưng từ điển (dictionary) mới tới (6). Vậy string.pW (AB) + ký tự đầu của chính nó (A) = ABA được lưu làm (7) và, vì cW là (7), cũng được xuất ra.</li>
<li><strong>Cùng một từ điển với bên mã hoá</strong>: (4) AB, (5) BB, (6) BA, (7) ABA, (8) ABAC — so với slide 35.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bình thường thì thêm "chuỗi trước + chữ đầu của chuỗi hiện tại"; nếu mã hiện tại chính là mục đang dựng dở thì chuỗi hiện tại = "chuỗi trước + chữ đầu của chuỗi trước".</p>
<div class="pitfall">Slide ghi kết quả giải nén (decompressed output) là ABBABABA — 8 chữ. Đó mới chỉ là phần do năm mã đầu tạo ra (dòng cuối của kết quả in ra); mã thứ sáu (3) thêm chữ C, nên kết quả đầy đủ là ABBABABAC, đúng 9 ký tự đã được mã hoá. Đi thi thì giải mã đủ mọi mã.</div>`],
    ]),
    bi(`<h3>✅ Check yourself</h3>
<ol>
<li>Is the code a = 0, b = 01, c = 11 a prefix code? Is it uniquely decodable?</li>
<li>Frequencies A 5, B 2, C 1, D 1. Build a Huffman code and give the total number of bits for these 9 symbols.</li>
<li>With the dictionary (1)A, encode AAAA with LZW, then decode your codes.</li>
<li>RLE: compress 12 W's followed by one B, and give the compression rate.</li>
<li>Why can no code for slide 23's frequencies average 1.89 bits?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) Not a prefix code (0 is a prefix of 01), but uniquely decodable: no codeword is the <em>end</em> of another, so reading from right to left is never ambiguous — left to right the decoder must look ahead. (2) Merge C + D = 2, then B + CD = 4, then A + 4 = 9: A 1 bit, B 2, C 3, D 3 → 5 + 4 + 3 + 3 = 15 bits (a fixed 2-bit code needs 18). (3) (1)(2)(1), adding (2) AA and (3) AAA; decoding: (1) → A; (2) is not in the dictionary yet → special case A + A = AA; (1) → A → AAAA. (4) 12W1B: 13 → 5 characters, (13 − 5)/13 ≈ 62%. (5) The entropy is 2.28 bits and no uniquely decodable code averages below the entropy; the slide's own sum is 2.34.</p>
<p><strong>Next:</strong> the deep-dive lessons of chapter 8 below — 8.1 (compression: Huffman, LZW, RLE — the big picture), 8.3 (Huffman coding, built step by step on another example), 8.4 (LZW &amp; RLE, encoded and decoded) — then lesson 8.5 (practice, glossary, summary) and the chapter quiz.</p>`,
    `<h3>✅ Tự kiểm tra</h3>
<ol>
<li>Bộ mã a = 0, b = 01, c = 11 có phải mã tiền tố không? Có giải được duy nhất không?</li>
<li>Tần suất A 5, B 2, C 1, D 1. Dựng mã Huffman và cho tổng số bit của 9 ký hiệu này.</li>
<li>Với từ điển (1)A, mã hoá AAAA bằng LZW, rồi giải mã lại dãy mã của bạn.</li>
<li>RLE (mã hoá độ dài loạt): nén chuỗi gồm 12 chữ W rồi một chữ B, và cho tỉ lệ nén.</li>
<li>Vì sao không bộ mã nào cho bảng tần suất của slide 23 có trung bình 1.89 bit?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Không phải mã tiền tố (0 là tiền tố của 01), nhưng giải được duy nhất: không từ mã nào là <em>phần cuối</em> của từ mã khác, nên đọc từ phải sang trái không bao giờ nhập nhằng — đọc từ trái sang thì bộ giải mã phải nhìn trước. (2) Gộp C + D = 2, rồi B + CD = 4, rồi A + 4 = 9: A 1 bit, B 2, C 3, D 3 → 5 + 4 + 3 + 3 = 15 bit (mã cố định 2 bit cần 18). (3) (1)(2)(1), thêm (2) AA và (3) AAA; giải mã: (1) → A; (2) chưa có trong từ điển → ca đặc biệt A + A = AA; (1) → A → AAAA. (4) 12W1B: 13 → 5 ký tự, (13 − 5)/13 ≈ 62%. (5) Entropy (lượng tin trung bình) là 2.28 bit và không mã giải được duy nhất nào có trung bình dưới entropy; chính phép cộng trên slide cho 2.34.</p>
<p><strong>Học tiếp:</strong> các bài đào sâu của chương 8 ngay bên dưới — 8.1 (nén: Huffman, LZW, RLE — bức tranh chung), 8.3 (mã Huffman, dựng từng bước trên một ví dụ khác), 8.4 (LZW &amp; RLE, mã hoá và giải mã) — rồi bài 8.5 (thực hành, thuật ngữ, tóm tắt) và bài trắc nghiệm (quiz) của chương.</p>`),
    books([
      ['goodrich', 'Ch.13 Text Processing p.573 — §13.1 Abundance of Digitized Text p.574 · §13.2 Pattern-Matching Algorithms p.576 · §13.2.1 Brute Force p.576 · §13.2.3 The Knuth-Morris-Pratt Algorithm p.582 · §13.4 Text Compression and the Greedy Method p.595 · §13.4.1 The Huffman Coding Algorithm p.596', 'Chương 13 Text Processing tr.573 — §13.1 Abundance of Digitized Text tr.574 · §13.2 Pattern-Matching Algorithms tr.576 · §13.2.1 Brute Force tr.576 · §13.2.3 The Knuth-Morris-Pratt Algorithm tr.582 · §13.4 Text Compression and the Greedy Method tr.595 · §13.4.1 The Huffman Coding Algorithm tr.596'],
    ]),
  ].join('\n'),
};

/* ───────── 8.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Text processing ───────── */
const L_on_ch8 = {
  title: '8.5 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Text processing|||8.5 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Xử lý văn bản',
  slug: 'csd201-on-ch8',
  type: 'VIDEO',
  description: '7 bài tập kiểu đề PE về xử lý văn bản (vét cạn trả mọi vị trí và đếm phép so sánh, bảng T[] và KMP tìm mọi lần xuất hiện, RLE với số lần từ 10 trở lên, cây Huffman và mã hoá/giải mã dãy bit, LZW hai chiều kể cả ca đặc biệt, tỉ lệ nén và entropy, bài tổng hợp trên danh sách tin nhắn) có lời giải và test tự kiểm chạy thật; 22 thuật ngữ Anh–Việt; tóm tắt 8 ý và bảng độ phức tạp của chương 8.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.5 · Practice &amp; review</span>
<h2>Text processing — practise like the PE, then review</h2>
<p class="lead">Seven exercises built on the slides' own data — from a ten-minute brute-force warm-up to a final task that combines KMP, RLE and Huffman on a linked list, the way a real exam combines several operations. Each comes with a solution that tests itself. Then the chapter's vocabulary in English and Vietnamese, a one-screen summary and the complexity table to revise from before the FE.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task, scroll the solution out of sight and write the methods yourself in Eclipse.</li>
<li>Copy the test <code>main</code> of the solution and run it: every line must say PASS.</li>
<li>Only then compare with the solution and read the trap under it.</li>
</ol>
<p>A CSD201 PE usually gives the skeleton — the data class, the structure class, a <code>main</code> that calls <code>f1</code>, <code>f2</code>, … and writes the answers to a file — and you fill in the bodies. The exercises below have the same shape, but every answer is printed on the screen instead of written to a file.</p></div>`,
    `<span class="eyebrow">Chương 8 · Bài 8.5 · Thực hành &amp; ôn tập</span>
<h2>Xử lý văn bản — luyện như đề PE, rồi ôn lại</h2>
<p class="lead">Bảy bài tập dựng trên chính dữ liệu của slide — từ bài khởi động vét cạn mười phút tới bài cuối kết hợp KMP, RLE và Huffman trên một danh sách liên kết, giống cách đề thi thật ghép nhiều thao tác lại với nhau. Bài nào cũng có lời giải tự kiểm tra được. Sau đó là thuật ngữ của chương bằng tiếng Anh và tiếng Việt, bản tóm tắt một màn hình và bảng độ phức tạp để ôn trước kỳ thi cuối kỳ (FE).</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Đọc đề, cuộn lời giải ra khỏi màn hình rồi tự viết các hàm trong Eclipse.</li>
<li>Chép hàm <code>main</code> kiểm thử (test) của lời giải vào và chạy: mọi dòng phải là PASS (đạt).</li>
<li>Lúc đó mới so với lời giải và đọc cái bẫy ghi bên dưới.</li>
</ol>
<p>Đề thi thực hành (PE) môn CSD201 thường cho sẵn bộ khung — lớp dữ liệu, lớp cấu trúc, hàm <code>main</code> gọi <code>f1</code>, <code>f2</code>, … và ghi đáp án ra file — còn bạn viết thân các hàm. Các bài dưới đây có cùng dạng đó, chỉ khác là mọi kết quả được in ra màn hình thay vì ghi ra file.</p></div>`),
    bi(`<h3>🧪 Exercise 1 — f1: brute force, every position and the number of comparisons (PE style · ~10 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>findAll(S, p)</code> that returns <strong>every</strong> position (counted from 0) where p occurs in S, separated by spaces — an empty string if there is none — and counts the character comparisons in the static field <code>comparisons</code> (a failed comparison counts too).</p>
<p class="nhan">Data → expected result</p>
<p>S = abcabaabcabac, p = abaa → <strong>"3"</strong> after <strong>21</strong> comparisons (all 10 shifts: 3 + 1 + 1 + 4 + 1 + 2 + 3 + 1 + 1 + 4). aaaa / aa → <strong>"0 1 2"</strong> after 6. aaaaab / aab → "3" after 12 = (n − m + 1)·m.</p>
<p class="nhan">Idea</p>
<p>the brute force of slide 5, except that a match does not end the search: record i and go on with shift i + 1. A shift costs (matched characters + 1), or m when it matches.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">public class Pe1BruteForceAll {
    static int comparisons;                          // character comparisons of the last call

    // f1: every position (from 0) where p occurs in S, separated by spaces
    static String findAll(String S, String p) {
        comparisons = 0;
        StringBuilder res = new StringBuilder();
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {           // every shift, also after a match
            int j = 0;
            while (j &lt; m) {
                comparisons++;                       // the failed comparison counts too
                if (S.charAt(i + j) != p.charAt(j)) break;
                j++;
            }
            if (j == m) res.append(i).append(' ');
        }
        return res.toString().trim();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("slides' example: positions / comparisons (all 10 shifts)", findAll("abcabaabcabac", "abaa") + " / " + comparisons, "3 / 21");
        check("overlapping matches", findAll("aaaa", "aa") + " / " + comparisons, "0 1 2 / 6");
        check("worst case: (n-m+1)*m = 12", findAll("aaaaab", "aab") + " / " + comparisons, "3 / 12");
        check("not found", "[" + findAll("abc", "d") + "] / " + comparisons, "[] / 3");
        check("pattern longer than the text", "[" + findAll("ab", "abc") + "] / " + comparisons, "[] / 0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slides' example: positions / comparisons (all 10 shifts)<br>
PASS overlapping matches<br>
PASS worst case: (n-m+1)*m = 12<br>
PASS not found<br>
PASS pattern longer than the text<br>
ALL TESTS PASSED</div>
<div class="pitfall">Jumping to shift i + m after a match (to "skip what was matched") loses overlapping occurrences: aaaa / aa would give "0 2" instead of "0 1 2". Brute force always moves one position.</div>`,
    `<h3>🧪 Bài 1 — f1: vét cạn, mọi vị trí và số phép so sánh (kiểu PE · ~10 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>findAll(S, p)</code> trả về <strong>mọi</strong> vị trí (đếm từ 0) mà p xuất hiện trong S, cách nhau dấu cách — chuỗi rỗng nếu không có — và đếm số phép so sánh ký tự vào trường tĩnh <code>comparisons</code> (lần so bị sai cũng tính).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>S = abcabaabcabac, p = abaa → <strong>"3"</strong> sau <strong>21</strong> phép so sánh (đủ 10 lần dịch: 3 + 1 + 1 + 4 + 1 + 2 + 3 + 1 + 1 + 4). aaaa / aa → <strong>"0 1 2"</strong> sau 6 phép. aaaaab / aab → "3" sau 12 = (n − m + 1)·m.</p>
<p class="nhan">Ý tưởng</p>
<p>chính thuật toán vét cạn (brute force) của slide 5, chỉ khác là khớp xong không dừng: ghi lại i rồi đi tiếp sang lần dịch (shift) i + 1. Mỗi lần dịch tốn (số ký tự đã khớp + 1) phép so, hoặc m phép nếu khớp trọn.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">public class Pe1BruteForceAll {
    static int comparisons;                          // số phép so ký tự của lần gọi gần nhất

    // f1: mọi vị trí (đếm từ 0) p xuất hiện trong S, cách nhau dấu cách
    static String findAll(String S, String p) {
        comparisons = 0;
        StringBuilder res = new StringBuilder();
        int n = S.length(), m = p.length();
        for (int i = 0; i &lt;= n - m; i++) {           // mọi lần dịch, kể cả sau khi đã khớp
            int j = 0;
            while (j &lt; m) {
                comparisons++;                       // lần so bị sai cũng được đếm
                if (S.charAt(i + j) != p.charAt(j)) break;
                j++;
            }
            if (j == m) res.append(i).append(' ');
        }
        return res.toString().trim();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("slides' example: positions / comparisons (all 10 shifts)", findAll("abcabaabcabac", "abaa") + " / " + comparisons, "3 / 21");
        check("overlapping matches", findAll("aaaa", "aa") + " / " + comparisons, "0 1 2 / 6");
        check("worst case: (n-m+1)*m = 12", findAll("aaaaab", "aab") + " / " + comparisons, "3 / 12");
        check("not found", "[" + findAll("abc", "d") + "] / " + comparisons, "[] / 3");
        check("pattern longer than the text", "[" + findAll("ab", "abc") + "] / " + comparisons, "[] / 0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slides' example: positions / comparisons (all 10 shifts)<br>
PASS overlapping matches<br>
PASS worst case: (n-m+1)*m = 12<br>
PASS not found<br>
PASS pattern longer than the text<br>
ALL TESTS PASSED</div>
<div class="pitfall">Khớp xong mà nhảy thẳng tới lần dịch i + m (để "bỏ qua phần đã khớp") là làm mất các lần xuất hiện chồng lên nhau (overlapping): aaaa / aa sẽ ra "0 2" thay vì "0 1 2". Vét cạn luôn chỉ dịch một vị trí.</div>`),
    bi(`<h3>🧪 Exercise 2 — f2: the table T[] and KMP, every occurrence (PE style · ~20 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>buildT(p)</code> with the slides' definition — T[0] = −1, T[j] = the longest proper prefix of p[0..j−1] that is also its suffix — and <code>kmpAll(a, p)</code> that returns every position of p in a, counting comparisons.</p>
<p class="nhan">Data → expected result</p>
<p>T of AABAAA = <strong>[−1, 0, 1, 0, 1, 2]</strong>; the three tables of slide 15. a = 1010001010110, p = 101011 → <strong>"6"</strong> after <strong>15</strong> comparisons (14 up to the match — the trace under slide 14 in lesson 8.A — and 1 more to finish the text). ABABABAB / ABAB → "0 2 4". Text aa…ab (n = 1000), p = aaaaaaaaab → 990 after 1990 ≤ 2n comparisons.</p>
<p class="nhan">Idea</p>
<p>build T in O(m) by extending borders — the <code>buildT</code> shown under slide 15 in lesson 8.A. Give T one extra entry, T[m] = the border of the whole pattern: after a full match, continue with k = T[m] instead of starting again — that is how KMP finds overlapping occurrences without ever moving i back.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe2Kmp {
    static int comparisons;

    // T[0] = -1; T[j] = longest proper prefix of p[0..j-1] that is also its suffix
    static int[] buildT(String p) {
        int m = p.length();
        int[] T = new int[m + 1];                    // one extra entry T[m]: needed to go on after a full match
        T[0] = -1;
        for (int j = 1; j &lt;= m; j++) {
            int k = T[j - 1];
            while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k];
            T[j] = k + 1;
        }
        return T;
    }

    // every position of p in a; the text index i never goes back
    static String kmpAll(String a, String p) {
        int[] T = buildT(p);
        StringBuilder res = new StringBuilder();
        comparisons = 0;
        int i = 0, k = 0;
        while (i &lt; a.length()) {
            comparisons++;
            if (a.charAt(i) == p.charAt(k)) {
                i++; k++;
                if (k == p.length()) { res.append(i - k).append(' '); k = T[k]; }   // found: keep the border
            } else {
                k = T[k];                            // slide the pattern
                if (k &lt; 0) { i++; k = 0; }           // nothing to keep: next text character
            }
        }
        return res.toString().trim();
    }

    static String slideT(String p) { return Arrays.toString(Arrays.copyOf(buildT(p), p.length())); }

    static String rep(char c, int n) { char[] s = new char[n]; Arrays.fill(s, c); return new String(s); }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("T of ABCDABD (slide 15)", slideT("ABCDABD"), "[-1, 0, 0, 0, 0, 1, 2]");
        check("T of ABACABABC (slide 15)", slideT("ABACABABC"), "[-1, 0, 0, 1, 0, 1, 2, 3, 2]");
        check("T of PARTICIPATE IN PAR (slide 15)", slideT("PARTICIPATE IN PAR"), "[-1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2]");
        check("T of AABAAA", slideT("AABAAA"), "[-1, 0, 1, 0, 1, 2]");
        check("slides' example a / p: position / comparisons", kmpAll("1010001010110", "101011") + " / " + comparisons, "6 / 15");
        check("overlapping: aaaa / aa", kmpAll("aaaa", "aa"), "0 1 2");
        check("ABABABAB / ABAB", kmpAll("ABABABAB", "ABAB"), "0 2 4");
        check("worst case of brute force: n = 1000, &lt;= 2n comparisons", kmpAll(rep('a', 999) + "b", rep('a', 9) + "b") + " / " + comparisons, "990 / 1990");
        check("not found", "[" + kmpAll("abc", "abd") + "]", "[]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS T of ABCDABD (slide 15)<br>
PASS T of ABACABABC (slide 15)<br>
PASS T of PARTICIPATE IN PAR (slide 15)<br>
PASS T of AABAAA<br>
PASS slides' example a / p: position / comparisons<br>
PASS overlapping: aaaa / aa<br>
PASS ABABABAB / ABAB<br>
PASS worst case of brute force: n = 1000, &lt;= 2n comparisons<br>
PASS not found<br>
ALL TESTS PASSED</div>
<div class="pitfall">After a full match, setting k = 0 misses overlaps (ABAB in ABABABAB would give "0 4"). And do not mix conventions: the book's fail[k] (lesson 8.2) is the slides' T[k + 1] — plugging one table into the other's loop is off by one everywhere.</div>`,
    `<h3>🧪 Bài 2 — f2: bảng T[] và KMP, tìm mọi lần xuất hiện (kiểu PE · ~20 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>buildT(p)</code> theo định nghĩa của slide — T[0] = −1, T[j] = tiền tố thật sự (proper prefix) dài nhất của p[0..j−1] đồng thời là hậu tố (suffix) — và <code>kmpAll(a, p)</code> trả về mọi vị trí của p trong a, có đếm số phép so sánh.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>T của AABAAA = <strong>[−1, 0, 1, 0, 1, 2]</strong>; ba bảng của slide 15. a = 1010001010110, p = 101011 → <strong>"6"</strong> sau <strong>15</strong> phép so sánh (14 phép tới chỗ khớp — bảng lần theo dưới slide 14 của bài 8.A — thêm 1 phép để đi hết văn bản). ABABABAB / ABAB → "0 2 4". Văn bản aa…ab (n = 1000), p = aaaaaaaaab → 990 sau 1990 ≤ 2n phép so.</p>
<p class="nhan">Ý tưởng</p>
<p>dựng T trong O(m) bằng cách nối dài các biên (border) — hàm <code>buildT</code> dưới slide 15 của bài 8.A. Cho T thêm một ô T[m] = biên của cả mẫu: khớp trọn xong thì đi tiếp với k = T[m] thay vì làm lại từ đầu — nhờ vậy KMP tìm được các lần xuất hiện chồng lên nhau mà không bao giờ lùi i.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe2Kmp {
    static int comparisons;

    // T[0] = -1; T[j] = tiền tố thật dài nhất của p[0..j-1] đồng thời là hậu tố
    static int[] buildT(String p) {
        int m = p.length();
        int[] T = new int[m + 1];                    // thêm ô T[m]: cần để đi tiếp sau khi khớp trọn
        T[0] = -1;
        for (int j = 1; j &lt;= m; j++) {
            int k = T[j - 1];
            while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k];
            T[j] = k + 1;
        }
        return T;
    }

    // mọi vị trí của p trong a; chỉ số i trên văn bản không bao giờ lùi
    static String kmpAll(String a, String p) {
        int[] T = buildT(p);
        StringBuilder res = new StringBuilder();
        comparisons = 0;
        int i = 0, k = 0;
        while (i &lt; a.length()) {
            comparisons++;
            if (a.charAt(i) == p.charAt(k)) {
                i++; k++;
                if (k == p.length()) { res.append(i - k).append(' '); k = T[k]; }   // thấy: giữ lại phần biên
            } else {
                k = T[k];                            // trượt mẫu
                if (k &lt; 0) { i++; k = 0; }           // không giữ được gì: sang ký tự kế
            }
        }
        return res.toString().trim();
    }

    static String slideT(String p) { return Arrays.toString(Arrays.copyOf(buildT(p), p.length())); }

    static String rep(char c, int n) { char[] s = new char[n]; Arrays.fill(s, c); return new String(s); }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("T of ABCDABD (slide 15)", slideT("ABCDABD"), "[-1, 0, 0, 0, 0, 1, 2]");
        check("T of ABACABABC (slide 15)", slideT("ABACABABC"), "[-1, 0, 0, 1, 0, 1, 2, 3, 2]");
        check("T of PARTICIPATE IN PAR (slide 15)", slideT("PARTICIPATE IN PAR"), "[-1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 1, 2]");
        check("T of AABAAA", slideT("AABAAA"), "[-1, 0, 1, 0, 1, 2]");
        check("slides' example a / p: position / comparisons", kmpAll("1010001010110", "101011") + " / " + comparisons, "6 / 15");
        check("overlapping: aaaa / aa", kmpAll("aaaa", "aa"), "0 1 2");
        check("ABABABAB / ABAB", kmpAll("ABABABAB", "ABAB"), "0 2 4");
        check("worst case of brute force: n = 1000, &lt;= 2n comparisons", kmpAll(rep('a', 999) + "b", rep('a', 9) + "b") + " / " + comparisons, "990 / 1990");
        check("not found", "[" + kmpAll("abc", "abd") + "]", "[]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS T of ABCDABD (slide 15)<br>
PASS T of ABACABABC (slide 15)<br>
PASS T of PARTICIPATE IN PAR (slide 15)<br>
PASS T of AABAAA<br>
PASS slides' example a / p: position / comparisons<br>
PASS overlapping: aaaa / aa<br>
PASS ABABABAB / ABAB<br>
PASS worst case of brute force: n = 1000, &lt;= 2n comparisons<br>
PASS not found<br>
ALL TESTS PASSED</div>
<div class="pitfall">Khớp trọn rồi gán k = 0 là bỏ sót các lần chồng nhau (ABAB trong ABABABAB sẽ ra "0 4"). Và đừng trộn hai quy ước: fail[k] của sách (bài 8.2) chính là T[k + 1] của slide — đem bảng này lắp vào vòng lặp của cách kia là lệch một (off-by-one) ở khắp nơi.</div>`),
    bi(`<h3>🧪 Exercise 3 — f3: RLE encode and decode, counts of 10 or more (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>encode(s)</code> — each run becomes count + symbol — and <code>decode(s)</code> that restores the original. Counts may have several digits; the empty string must work too.</p>
<p class="nhan">Data → expected result</p>
<p>FFFFOOOOFFFOOFFFFFOOOOOOO → <strong>4F4O3F2O5F7O</strong>, rate 52% (slide 36). 12 W, B, 12 W, 3 B, 24 W, B, 14 W (67 characters) → <strong>12W1B12W3B24W1B14W</strong>. ABCD → 1A1B1C1D.</p>
<p class="nhan">Idea</p>
<p>two indices: j runs while <code>s.charAt(j) == s.charAt(i)</code>, so the run length is j − i. To decode, accumulate digits (<code>count = count * 10 + digit</code>) until a letter arrives, then repeat the letter count times.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe3Rle {
    // "WWWB" -&gt; "3W1B"
    static String encode(String s) {
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i &lt; s.length()) {
            int j = i;
            while (j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i)) j++;   // s[i..j-1] is one run
            out.append(j - i).append(s.charAt(i));
            i = j;
        }
        return out.toString();
    }

    // "12W1B" -&gt; 12 W then B: a count may have several digits
    static String decode(String s) {
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) count = count * 10 + (c - '0');
            else { for (int k = 0; k &lt; count; k++) out.append(c); count = 0; }
        }
        return out.toString();
    }

    static String rep(char c, int n) { char[] s = new char[n]; Arrays.fill(s, c); return new String(s); }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String slide = "FFFFOOOOFFFOOFFFFFOOOOOOO";
        String w = rep('W', 12) + "B" + rep('W', 12) + "BBB" + rep('W', 24) + "B" + rep('W', 14);
        check("slide 36", encode(slide), "4F4O3F2O5F7O");
        check("slide 36: rate", (slide.length() - encode(slide).length()) * 100 / slide.length() + "%", "52%");
        check("counts &gt;= 10", encode(w), "12W1B12W3B24W1B14W");
        check("decode counts &gt;= 10", decode("12W1B"), "WWWWWWWWWWWWB");
        check("round trip (67 characters)", String.valueOf(decode(encode(w)).equals(w)), "true");
        check("no runs: twice as long", encode("ABCD"), "1A1B1C1D");
        check("empty input", "[" + encode("") + "][" + decode("") + "]", "[][]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slide 36<br>
PASS slide 36: rate<br>
PASS counts &gt;= 10<br>
PASS decode counts &gt;= 10<br>
PASS round trip (67 characters)<br>
PASS no runs: twice as long<br>
PASS empty input<br>
ALL TESTS PASSED</div>
<div class="pitfall">This format breaks as soon as the data itself contains digits: 111 encodes to "31", which decodes to an empty string (both characters are read as one count). Real formats store the count in a separate byte or use an escape symbol.</div>`,
    `<h3>🧪 Bài 3 — f3: mã hoá và giải mã RLE (mã hoá độ dài loạt), số lần từ 10 trở lên (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>encode(s)</code> — mỗi loạt (run) thành số lần + ký hiệu — và <code>decode(s)</code> khôi phục lại bản gốc. Số lần có thể gồm nhiều chữ số; chuỗi rỗng cũng phải chạy đúng.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>FFFFOOOOFFFOOFFFFFOOOOOOO → <strong>4F4O3F2O5F7O</strong>, tỉ lệ nén 52% (slide 36). 12 W, B, 12 W, 3 B, 24 W, B, 14 W (67 ký tự) → <strong>12W1B12W3B24W1B14W</strong>. ABCD → 1A1B1C1D.</p>
<p class="nhan">Ý tưởng</p>
<p>hai chỉ số: j chạy chừng nào <code>s.charAt(j) == s.charAt(i)</code>, nên độ dài loạt là j − i. Khi giải mã, cộng dồn các chữ số (<code>count = count * 10 + digit</code>) cho tới khi gặp một chữ cái, rồi lặp chữ cái đó count lần.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Arrays;

public class Pe3Rle {
    // "WWWB" -&gt; "3W1B"
    static String encode(String s) {
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i &lt; s.length()) {
            int j = i;
            while (j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i)) j++;   // s[i..j-1] là một loạt
            out.append(j - i).append(s.charAt(i));
            i = j;
        }
        return out.toString();
    }

    // "12W1B" -&gt; 12 chữ W rồi B: số lần có thể nhiều chữ số
    static String decode(String s) {
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) count = count * 10 + (c - '0');
            else { for (int k = 0; k &lt; count; k++) out.append(c); count = 0; }
        }
        return out.toString();
    }

    static String rep(char c, int n) { char[] s = new char[n]; Arrays.fill(s, c); return new String(s); }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        String slide = "FFFFOOOOFFFOOFFFFFOOOOOOO";
        String w = rep('W', 12) + "B" + rep('W', 12) + "BBB" + rep('W', 24) + "B" + rep('W', 14);
        check("slide 36", encode(slide), "4F4O3F2O5F7O");
        check("slide 36: rate", (slide.length() - encode(slide).length()) * 100 / slide.length() + "%", "52%");
        check("counts &gt;= 10", encode(w), "12W1B12W3B24W1B14W");
        check("decode counts &gt;= 10", decode("12W1B"), "WWWWWWWWWWWWB");
        check("round trip (67 characters)", String.valueOf(decode(encode(w)).equals(w)), "true");
        check("no runs: twice as long", encode("ABCD"), "1A1B1C1D");
        check("empty input", "[" + encode("") + "][" + decode("") + "]", "[][]");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS slide 36<br>
PASS slide 36: rate<br>
PASS counts &gt;= 10<br>
PASS decode counts &gt;= 10<br>
PASS round trip (67 characters)<br>
PASS no runs: twice as long<br>
PASS empty input<br>
ALL TESTS PASSED</div>
<div class="pitfall">Định dạng này hỏng ngay khi bản thân dữ liệu có chữ số: 111 được mã thành "31", và giải mã ra chuỗi rỗng (cả hai ký tự bị đọc thành một số lần). Các định dạng thật lưu số lần trong một byte riêng hoặc dùng ký hiệu thoát (escape).</div>`),
    bi(`<h3>🧪 Exercise 4 — f4: build a Huffman tree, then encode and decode bits (PE style · ~25 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>build(symbols, freq)</code> with a <code>PriorityQueue</code>: merge the two smallest nodes; to make the answer unique, the larger of the two goes left (bit 0) — the rule of slide 29 — and ties go to the node created first. Then write <code>encode(text)</code> and <code>decode(bits)</code>.</p>
<p class="nhan">Data → expected result</p>
<p>A 20, B 9, C 15, D 11, E 40, F 5 → <strong>A=000 B=0100 C=001 D=011 E=1 F=0101</strong>, 234 bits for the 100-character document; FACE → 01010000011 and back. The counts of ABRACADABRA (A 5, B 2, C 1, D 1, R 2) → <strong>23 bits</strong>.</p>
<p class="nhan">Idea</p>
<p><code>Node implements Comparable&lt;Node&gt;</code>: compare <code>freq</code>, then <code>id</code> (creation order). Codes: a recursive walk from the root adding "0" to the left and "1" to the right. Decoding: walk from the root bit by bit; at a leaf, output its symbol and restart at the root.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.PriorityQueue;

class Node implements Comparable&lt;Node&gt; {
    char ch; int freq, id;                           // id = creation order, breaks ties
    Node left, right;
    Node(char ch, int freq, int id, Node left, Node right) { this.ch = ch; this.freq = freq; this.id = id; this.left = left; this.right = right; }
    boolean isLeaf() { return left == null; }
    public int compareTo(Node o) { return freq != o.freq ? freq - o.freq : id - o.id; }
}

public class Pe4Huffman {
    static String[] code = new String[128];
    static Node root;

    // f4: merge the two smallest; the larger child goes left (bit 0), as on slide 29
    static void build(String symbols, int[] freq) {
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;();
        int id = 0;
        for (int i = 0; i &lt; symbols.length(); i++) pq.add(new Node(symbols.charAt(i), freq[i], id++, null, null));
        while (pq.size() &gt; 1) {
            Node x = pq.poll(), y = pq.poll();       // x &lt;= y
            pq.add(new Node('\\0', x.freq + y.freq, id++, y, x));
        }
        root = pq.poll();
        code = new String[128];
        assign(root, "");
    }

    static void assign(Node x, String s) {
        if (x.isLeaf()) { code[x.ch] = s.isEmpty() ? "0" : s; return; }   // one symbol only: give it "0"
        assign(x.left, s + "0");
        assign(x.right, s + "1");
    }

    static String encode(String text) {
        StringBuilder b = new StringBuilder();
        for (char c : text.toCharArray()) b.append(code[c]);
        return b.toString();
    }

    static String decode(String bits) {
        StringBuilder out = new StringBuilder();
        Node x = root;
        for (char b : bits.toCharArray()) {
            if (!root.isLeaf()) x = (b == '0') ? x.left : x.right;
            if (x.isLeaf()) { out.append(x.ch); x = root; }   // a leaf: output it, back to the root
        }
        return out.toString();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        build("ABCDEF", new int[] {20, 9, 15, 11, 40, 5});      // slide 23
        StringBuilder all = new StringBuilder();
        int bits = 0, count[] = {20, 9, 15, 11, 40, 5};
        for (char c = 'A'; c &lt;= 'F'; c++) { all.append(c).append('=').append(code[c]).append(' '); bits += count[c - 'A'] * code[c].length(); }
        check("codes of slide 29", all.toString().trim(), "A=000 B=0100 C=001 D=011 E=1 F=0101");
        check("100-character document: total bits", "" + bits, "234");
        check("encode FACE", encode("FACE"), "01010000011");
        check("decode it back", decode("01010000011"), "FACE");
        build("ABCDR", new int[] {5, 2, 1, 1, 2});           // the counts of ABRACADABRA
        check("ABRACADABRA: 23 bits", "" + encode("ABRACADABRA").length(), "23");
        check("ABRACADABRA: round trip", decode(encode("ABRACADABRA")), "ABRACADABRA");
        build("Z", new int[] {7});
        check("one symbol only: code 0, 1 bit each", code['Z'] + " " + decode(encode("ZZZ")), "0 ZZZ");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS codes of slide 29<br>
PASS 100-character document: total bits<br>
PASS encode FACE<br>
PASS decode it back<br>
PASS ABRACADABRA: 23 bits<br>
PASS ABRACADABRA: round trip<br>
PASS one symbol only: code 0, 1 bit each<br>
ALL TESTS PASSED</div>
<div class="pitfall">A text with a single distinct symbol makes the root a leaf: its code would be "" (0 bits) and decoding would never advance — give it the code "0" (last test). Also, <code>PriorityQueue</code> promises no order among equal keys: without the <code>id</code> tie-breaker, ties can give codes that differ from the answer key although they are just as good.</div>`,
    `<h3>🧪 Bài 4 — f4: dựng cây Huffman, rồi mã hoá và giải mã dãy bit (kiểu PE · ~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>build(symbols, freq)</code> bằng hàng đợi ưu tiên <code>PriorityQueue</code>: gộp hai nút nhỏ nhất; để đáp án là duy nhất, nút lớn hơn trong hai nút nằm bên trái (bit 0) — quy tắc của slide 29 — và khi bằng nhau (tie) thì nút tạo trước được lấy trước. Sau đó viết <code>encode(text)</code> và <code>decode(bits)</code>.</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>A 20, B 9, C 15, D 11, E 40, F 5 → <strong>A=000 B=0100 C=001 D=011 E=1 F=0101</strong>, 234 bit cho tài liệu 100 ký tự; FACE → 01010000011 và ngược lại. Số lần xuất hiện trong ABRACADABRA (A 5, B 2, C 1, D 1, R 2) → <strong>23 bit</strong>.</p>
<p class="nhan">Ý tưởng</p>
<p><code>Node implements Comparable&lt;Node&gt;</code>: so <code>freq</code> trước, rồi tới <code>id</code> (thứ tự được tạo). Bảng mã: đi đệ quy (recursive) từ gốc, sang trái thêm "0", sang phải thêm "1". Giải mã: đi từ gốc theo từng bit; gặp lá (leaf) thì xuất ký hiệu và quay lại gốc.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.PriorityQueue;

class Node implements Comparable&lt;Node&gt; {
    char ch; int freq, id;                           // id = thứ tự tạo, dùng để phá thế hoà
    Node left, right;
    Node(char ch, int freq, int id, Node left, Node right) { this.ch = ch; this.freq = freq; this.id = id; this.left = left; this.right = right; }
    boolean isLeaf() { return left == null; }
    public int compareTo(Node o) { return freq != o.freq ? freq - o.freq : id - o.id; }
}

public class Pe4Huffman {
    static String[] code = new String[128];
    static Node root;

    // f4: gộp hai nút nhỏ nhất; con lớn hơn bên trái (bit 0), như slide 29
    static void build(String symbols, int[] freq) {
        PriorityQueue&lt;Node&gt; pq = new PriorityQueue&lt;Node&gt;();
        int id = 0;
        for (int i = 0; i &lt; symbols.length(); i++) pq.add(new Node(symbols.charAt(i), freq[i], id++, null, null));
        while (pq.size() &gt; 1) {
            Node x = pq.poll(), y = pq.poll();       // x &lt;= y
            pq.add(new Node('\\0', x.freq + y.freq, id++, y, x));
        }
        root = pq.poll();
        code = new String[128];
        assign(root, "");
    }

    static void assign(Node x, String s) {
        if (x.isLeaf()) { code[x.ch] = s.isEmpty() ? "0" : s; return; }   // chỉ một ký hiệu: cho nó mã "0"
        assign(x.left, s + "0");
        assign(x.right, s + "1");
    }

    static String encode(String text) {
        StringBuilder b = new StringBuilder();
        for (char c : text.toCharArray()) b.append(code[c]);
        return b.toString();
    }

    static String decode(String bits) {
        StringBuilder out = new StringBuilder();
        Node x = root;
        for (char b : bits.toCharArray()) {
            if (!root.isLeaf()) x = (b == '0') ? x.left : x.right;
            if (x.isLeaf()) { out.append(x.ch); x = root; }   // gặp lá: xuất, quay về gốc
        }
        return out.toString();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        build("ABCDEF", new int[] {20, 9, 15, 11, 40, 5});      // slide 23
        StringBuilder all = new StringBuilder();
        int bits = 0, count[] = {20, 9, 15, 11, 40, 5};
        for (char c = 'A'; c &lt;= 'F'; c++) { all.append(c).append('=').append(code[c]).append(' '); bits += count[c - 'A'] * code[c].length(); }
        check("codes of slide 29", all.toString().trim(), "A=000 B=0100 C=001 D=011 E=1 F=0101");
        check("100-character document: total bits", "" + bits, "234");
        check("encode FACE", encode("FACE"), "01010000011");
        check("decode it back", decode("01010000011"), "FACE");
        build("ABCDR", new int[] {5, 2, 1, 1, 2});           // số lần xuất hiện trong ABRACADABRA
        check("ABRACADABRA: 23 bits", "" + encode("ABRACADABRA").length(), "23");
        check("ABRACADABRA: round trip", decode(encode("ABRACADABRA")), "ABRACADABRA");
        build("Z", new int[] {7});
        check("one symbol only: code 0, 1 bit each", code['Z'] + " " + decode(encode("ZZZ")), "0 ZZZ");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS codes of slide 29<br>
PASS 100-character document: total bits<br>
PASS encode FACE<br>
PASS decode it back<br>
PASS ABRACADABRA: 23 bits<br>
PASS ABRACADABRA: round trip<br>
PASS one symbol only: code 0, 1 bit each<br>
ALL TESTS PASSED</div>
<div class="pitfall">Văn bản chỉ có một ký hiệu khác nhau thì gốc chính là lá: mã của nó là "" (0 bit) và việc giải mã không bao giờ tiến lên được — hãy cho nó mã "0" (test cuối). Ngoài ra, <code>PriorityQueue</code> không hứa thứ tự nào giữa các khoá bằng nhau: thiếu phần phá thế hoà bằng <code>id</code>, các chỗ bằng nhau có thể cho bảng mã khác đáp án dù tốt ngang nhau.</div>`),
    bi(`<h3>🧪 Exercise 5 — f5: LZW encode and decode, special case included (PE style · ~25 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>encode(s, alphabet)</code> that outputs codes numbered from (1), as on slide 35 (the first letter of the alphabet is (1)), and <code>decode(codes, alphabet)</code> that rebuilds the text — also when a code is not yet in the dictionary.</p>
<p class="nhan">Data → expected result</p>
<p>ABBABABAC with alphabet ABC → <strong>1 2 2 4 7 3</strong> and back; 1 2 2 4 7 alone → ABBABABA (the result printed on slide 40); AAAA with alphabet A → <strong>1 2 1</strong>, whose decoding needs the special case; TOBEORNOTTOBEORTOBEORNOT (24 characters) → 16 codes, round trip.</p>
<p class="nhan">Idea</p>
<p>encoder: a <code>HashMap&lt;String, Integer&gt;</code> for O(1) look-ups, the next code is <code>dict.size() + 1</code>, and the last P is output after the loop. Decoder: an <code>ArrayList&lt;String&gt;</code>; cur = the entry cW if it exists, otherwise prev + prev's first character; in <em>both</em> cases add prev + cur's first character — one line serves both branches.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.HashMap;

public class Pe5Lzw {
    // codes start at (1) as on slide 35: alphabet.charAt(0) is (1)
    static String encode(String s, String alphabet) {
        HashMap&lt;String, Integer&gt; dict = new HashMap&lt;String, Integer&gt;();   // O(1) look-up
        for (int i = 0; i &lt; alphabet.length(); i++) dict.put("" + alphabet.charAt(i), i + 1);
        StringBuilder out = new StringBuilder();
        String P = "";
        for (char C : s.toCharArray()) {
            if (dict.containsKey(P + C)) P = P + C;
            else {
                out.append(dict.get(P)).append(' ');
                dict.put(P + C, dict.size() + 1);    // next free code
                P = "" + C;
            }
        }
        if (!P.isEmpty()) out.append(dict.get(P));   // step 4: the last P
        return out.toString().trim();
    }

    static String decode(String codes, String alphabet) {
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;();
        dict.add(null);                              // slot 0 unused
        for (char c : alphabet.toCharArray()) dict.add("" + c);
        String[] w = codes.split(" ");
        int cW = Integer.parseInt(w[0]);
        StringBuilder out = new StringBuilder(dict.get(cW));
        for (int k = 1; k &lt; w.length; k++) {
            int pW = cW;
            cW = Integer.parseInt(w[k]);
            String prev = dict.get(pW);
            String cur = cW &lt; dict.size() ? dict.get(cW) : prev + prev.charAt(0);   // special case: cW not there yet
            dict.add(prev + cur.charAt(0));
            out.append(cur);
        }
        return out.toString();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("encode ABBABABAC (slide 35)", encode("ABBABABAC", "ABC"), "1 2 2 4 7 3");
        check("decode 1 2 2 4 7 3 (slide 40)", decode("1 2 2 4 7 3", "ABC"), "ABBABABAC");
        check("only the first five codes", decode("1 2 2 4 7", "ABC"), "ABBABABA");
        check("AAAA: encode", encode("AAAA", "A"), "1 2 1");
        check("AAAA: decode uses the special case", decode("1 2 1", "A"), "AAAA");
        check("ABABABA: encode / decode", encode("ABABABA", "AB") + " / " + decode("1 2 3 5", "AB"), "1 2 3 5 / ABABABA");
        String t = "TOBEORNOTTOBEORTOBEORNOT";
        String c = encode(t, "BENORT");
        check("24 characters -&gt; 16 codes, round trip", c.split(" ").length + " " + decode(c, "BENORT").equals(t), "16 true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS encode ABBABABAC (slide 35)<br>
PASS decode 1 2 2 4 7 3 (slide 40)<br>
PASS only the first five codes<br>
PASS AAAA: encode<br>
PASS AAAA: decode uses the special case<br>
PASS ABABABA: encode / decode<br>
PASS 24 characters -&gt; 16 codes, round trip<br>
ALL TESTS PASSED</div>
<div class="pitfall">Adding prev + cur (the whole string) instead of prev + cur's first character makes the decoder's dictionary drift away from the encoder's — yet ABBABABAC, AAAA and ABABABA still decode correctly with this bug. TOBEORNOTTOBEORTOBEORNOT exposes it (the buggy decoder prints TOBEORNOTTOBEORTOBEEORNOT), so always test a round trip on a long, repetitive string.</div>`,
    `<h3>🧪 Bài 5 — f5: mã hoá và giải mã LZW, có cả ca đặc biệt (kiểu PE · ~25 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>encode(s, alphabet)</code> xuất các mã đánh số từ (1) như slide 35 (chữ đầu tiên của bảng chữ là (1)), và <code>decode(codes, alphabet)</code> dựng lại văn bản — kể cả khi một mã chưa có trong từ điển (dictionary).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>ABBABABAC với bảng chữ ABC → <strong>1 2 2 4 7 3</strong> và ngược lại; riêng 1 2 2 4 7 → ABBABABA (kết quả in trên slide 40); AAAA với bảng chữ A → <strong>1 2 1</strong>, khi giải mã phải dùng ca đặc biệt; TOBEORNOTTOBEORTOBEORNOT (24 ký tự) → 16 mã, giải mã lại đúng.</p>
<p class="nhan">Ý tưởng</p>
<p>bên mã hoá: dùng <code>HashMap&lt;String, Integer&gt;</code> để tra trong O(1), mã kế tiếp là <code>dict.size() + 1</code>, và nhớ xuất P cuối cùng sau vòng lặp. Bên giải mã: dùng <code>ArrayList&lt;String&gt;</code>; cur = mục cW nếu đã có, ngược lại là prev + ký tự đầu của prev; trong <em>cả hai</em> trường hợp đều thêm prev + ký tự đầu của cur — một dòng dùng chung cho hai nhánh.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.ArrayList;
import java.util.HashMap;

public class Pe5Lzw {
    // mã bắt đầu từ (1) như slide 35: alphabet.charAt(0) là (1)
    static String encode(String s, String alphabet) {
        HashMap&lt;String, Integer&gt; dict = new HashMap&lt;String, Integer&gt;();   // tra cứu O(1)
        for (int i = 0; i &lt; alphabet.length(); i++) dict.put("" + alphabet.charAt(i), i + 1);
        StringBuilder out = new StringBuilder();
        String P = "";
        for (char C : s.toCharArray()) {
            if (dict.containsKey(P + C)) P = P + C;
            else {
                out.append(dict.get(P)).append(' ');
                dict.put(P + C, dict.size() + 1);    // mã trống kế tiếp
                P = "" + C;
            }
        }
        if (!P.isEmpty()) out.append(dict.get(P));   // bước 4: P cuối cùng
        return out.toString().trim();
    }

    static String decode(String codes, String alphabet) {
        ArrayList&lt;String&gt; dict = new ArrayList&lt;String&gt;();
        dict.add(null);                              // bỏ trống ô 0
        for (char c : alphabet.toCharArray()) dict.add("" + c);
        String[] w = codes.split(" ");
        int cW = Integer.parseInt(w[0]);
        StringBuilder out = new StringBuilder(dict.get(cW));
        for (int k = 1; k &lt; w.length; k++) {
            int pW = cW;
            cW = Integer.parseInt(w[k]);
            String prev = dict.get(pW);
            String cur = cW &lt; dict.size() ? dict.get(cW) : prev + prev.charAt(0);   // ca đặc biệt: cW chưa có
            dict.add(prev + cur.charAt(0));
            out.append(cur);
        }
        return out.toString();
    }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        check("encode ABBABABAC (slide 35)", encode("ABBABABAC", "ABC"), "1 2 2 4 7 3");
        check("decode 1 2 2 4 7 3 (slide 40)", decode("1 2 2 4 7 3", "ABC"), "ABBABABAC");
        check("only the first five codes", decode("1 2 2 4 7", "ABC"), "ABBABABA");
        check("AAAA: encode", encode("AAAA", "A"), "1 2 1");
        check("AAAA: decode uses the special case", decode("1 2 1", "A"), "AAAA");
        check("ABABABA: encode / decode", encode("ABABABA", "AB") + " / " + decode("1 2 3 5", "AB"), "1 2 3 5 / ABABABA");
        String t = "TOBEORNOTTOBEORTOBEORNOT";
        String c = encode(t, "BENORT");
        check("24 characters -&gt; 16 codes, round trip", c.split(" ").length + " " + decode(c, "BENORT").equals(t), "16 true");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS encode ABBABABAC (slide 35)<br>
PASS decode 1 2 2 4 7 3 (slide 40)<br>
PASS only the first five codes<br>
PASS AAAA: encode<br>
PASS AAAA: decode uses the special case<br>
PASS ABABABA: encode / decode<br>
PASS 24 characters -&gt; 16 codes, round trip<br>
ALL TESTS PASSED</div>
<div class="pitfall">Thêm prev + cur (cả chuỗi) thay vì prev + ký tự đầu của cur làm từ điển bên giải mã lệch dần khỏi bên mã hoá — vậy mà ABBABABAC, AAAA và ABABABA vẫn giải mã đúng với lỗi này. TOBEORNOTTOBEORTOBEORNOT mới làm lộ lỗi (bộ giải mã sai in ra TOBEORNOTTOBEORTOBEEORNOT), nên luôn thử mã hoá rồi giải mã lại (round trip) trên một chuỗi dài, lặp nhiều.</div>`),
    bi(`<h3>🧪 Exercise 6 — f6: compression rate, entropy and average code length (PE style · ~15 min)</h3>
<p class="nhan">Task</p>
<p>Write <code>entropy(text)</code> = −Σ P·log2 P over the characters of the text, <code>averageLength(freq, code)</code> = Σ freq·length / Σ freq, and <code>rate(in, out)</code> = 100·(in − out)/in.</p>
<p class="nhan">Data → expected result</p>
<p>Slide 23's document: H = <strong>2.28</strong>, the average length of slide 29's code = <strong>2.34</strong> (not 1.89), and H ≤ L &lt; H + 1. Entropy of AAAA, ABAB, ABCD = 0, 1, 2. rate(25, 12) = 52%, rate(300, 234) = 22%, rate(4, 8) = −100%.</p>
<p class="nhan">Idea</p>
<p>Java has no log2: use <code>Math.log(p) / Math.log(2)</code>; skip characters whose count is 0 (log 0 is undefined). Compare doubles by formatting them to two decimals with <code>Locale.US</code>.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.Locale;

public class Pe6RateEntropy {
    // H = sum over symbols of -P * log2 P, with P = count / length
    static double entropy(String text) {
        int[] f = new int[128];
        for (char c : text.toCharArray()) f[c]++;
        double H = 0;
        for (int c = 0; c &lt; 128; c++) {
            if (f[c] == 0) continue;                 // log2(0) is undefined: skip absent symbols
            double p = (double) f[c] / text.length();
            H -= p * Math.log(p) / Math.log(2);
        }
        return H;
    }

    // average code length = sum of freq * length / sum of freq
    static double averageLength(int[] freq, String[] code) {
        int bits = 0, total = 0;
        for (int i = 0; i &lt; freq.length; i++) { bits += freq[i] * code[i].length(); total += freq[i]; }
        return (double) bits / total;
    }

    // compression rate in %: (in - out) / in
    static double rate(int in, int out) { return 100.0 * (in - out) / in; }

    static String f2(double x) { return String.format(Locale.US, "%.2f", x); }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] freq = {20, 9, 15, 11, 40, 5};                        // A..F, slide 23
        String[] code = {"000", "0100", "001", "011", "1", "0101"};  // slide 29
        StringBuilder doc = new StringBuilder();
        for (int i = 0; i &lt; 6; i++) for (int k = 0; k &lt; freq[i]; k++) doc.append((char) ('A' + i));
        double H = entropy(doc.toString()), L = averageLength(freq, code);
        check("entropy of slide 23's document", f2(H), "2.28");
        check("average length of slide 29's code (not 1.89)", f2(L), "2.34");
        check("H &lt;= L &lt; H + 1", String.valueOf(H &lt;= L &amp;&amp; L &lt; H + 1), "true");
        check("entropy AAAA / ABAB / ABCD", f2(entropy("AAAA")) + " " + f2(entropy("ABAB")) + " " + f2(entropy("ABCD")), "0.00 1.00 2.00");
        check("rate of slide 36", f2(rate(25, 12)) + "%", "52.00%");
        check("Huffman vs a 3-bit code", f2(rate(300, 234)) + "%", "22.00%");
        check("negative rate = the output grew", f2(rate(4, 8)) + "%", "-100.00%");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS entropy of slide 23's document<br>
PASS average length of slide 29's code (not 1.89)<br>
PASS H &lt;= L &lt; H + 1<br>
PASS entropy AAAA / ABAB / ABCD<br>
PASS rate of slide 36<br>
PASS Huffman vs a 3-bit code<br>
PASS negative rate = the output grew<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>(in - out) / in</code> on two ints is integer division and gives 0 — start with <code>100.0 *</code>. And <code>String.format("%.2f", x)</code> on a computer whose locale writes decimals with a comma (Vietnamese, for example) prints "2,28", so a test expecting "2.28" fails; pass <code>Locale.US</code>.</div>`,
    `<h3>🧪 Bài 6 — f6: tỉ lệ nén, entropy và độ dài mã trung bình (kiểu PE · ~15 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Viết <code>entropy(text)</code> = −Σ P·log2 P trên các ký tự của văn bản (entropy — lượng tin trung bình), <code>averageLength(freq, code)</code> = Σ freq·độ dài / Σ freq, và <code>rate(in, out)</code> = 100·(in − out)/in (tỉ lệ nén — compression rate).</p>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>Tài liệu của slide 23: H = <strong>2.28</strong>, độ dài trung bình của bộ mã slide 29 = <strong>2.34</strong> (không phải 1.89), và H ≤ L &lt; H + 1. Entropy của AAAA, ABAB, ABCD = 0, 1, 2. rate(25, 12) = 52%, rate(300, 234) = 22%, rate(4, 8) = −100%.</p>
<p class="nhan">Ý tưởng</p>
<p>Java không có hàm log2: dùng <code>Math.log(p) / Math.log(2)</code>; bỏ qua ký tự có số lần bằng 0 (log 0 không xác định). So sánh số thực (double) bằng cách định dạng ra hai chữ số thập phân với <code>Locale.US</code>.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.Locale;

public class Pe6RateEntropy {
    // H = tổng theo ký hiệu của -P * log2 P, với P = số lần / độ dài
    static double entropy(String text) {
        int[] f = new int[128];
        for (char c : text.toCharArray()) f[c]++;
        double H = 0;
        for (int c = 0; c &lt; 128; c++) {
            if (f[c] == 0) continue;                 // log2(0) vô nghĩa: bỏ qua ký hiệu không có
            double p = (double) f[c] / text.length();
            H -= p * Math.log(p) / Math.log(2);
        }
        return H;
    }

    // độ dài trung bình = tổng freq * độ dài / tổng freq
    static double averageLength(int[] freq, String[] code) {
        int bits = 0, total = 0;
        for (int i = 0; i &lt; freq.length; i++) { bits += freq[i] * code[i].length(); total += freq[i]; }
        return (double) bits / total;
    }

    // tỉ lệ nén theo %: (vào - ra) / vào
    static double rate(int in, int out) { return 100.0 * (in - out) / in; }

    static String f2(double x) { return String.format(Locale.US, "%.2f", x); }

    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    public static void main(String[] args) {
        int[] freq = {20, 9, 15, 11, 40, 5};                        // A..F, slide 23
        String[] code = {"000", "0100", "001", "011", "1", "0101"};  // slide 29
        StringBuilder doc = new StringBuilder();
        for (int i = 0; i &lt; 6; i++) for (int k = 0; k &lt; freq[i]; k++) doc.append((char) ('A' + i));
        double H = entropy(doc.toString()), L = averageLength(freq, code);
        check("entropy of slide 23's document", f2(H), "2.28");
        check("average length of slide 29's code (not 1.89)", f2(L), "2.34");
        check("H &lt;= L &lt; H + 1", String.valueOf(H &lt;= L &amp;&amp; L &lt; H + 1), "true");
        check("entropy AAAA / ABAB / ABCD", f2(entropy("AAAA")) + " " + f2(entropy("ABAB")) + " " + f2(entropy("ABCD")), "0.00 1.00 2.00");
        check("rate of slide 36", f2(rate(25, 12)) + "%", "52.00%");
        check("Huffman vs a 3-bit code", f2(rate(300, 234)) + "%", "22.00%");
        check("negative rate = the output grew", f2(rate(4, 8)) + "%", "-100.00%");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS entropy of slide 23's document<br>
PASS average length of slide 29's code (not 1.89)<br>
PASS H &lt;= L &lt; H + 1<br>
PASS entropy AAAA / ABAB / ABCD<br>
PASS rate of slide 36<br>
PASS Huffman vs a 3-bit code<br>
PASS negative rate = the output grew<br>
ALL TESTS PASSED</div>
<div class="pitfall"><code>(in - out) / in</code> trên hai số int là phép chia nguyên và ra 0 — hãy bắt đầu bằng <code>100.0 *</code>. Còn <code>String.format("%.2f", x)</code> trên máy đặt ngôn ngữ vùng (locale) dùng dấu phẩy thập phân (như tiếng Việt) sẽ in "2,28", nên test mong đợi "2.28" sẽ hỏng; hãy truyền <code>Locale.US</code>.</div>`),
    bi(`<h3>🧪 Exercise 7 — the message log: f1 KMP search, f2 RLE, f3 Huffman bits (close to a real PE · ~30 min)</h3>
<p class="nhan">Task</p>
<p>Messages <code>Msg(sender, body)</code> are kept in a singly linked list <code>MsgList</code> (head, tail — as in chapter 1). Write:</p>
<ul>
<li><code>f1(keyword)</code> — how many messages contain the keyword, using your KMP;</li>
<li><code>f2()</code> — replace a body by its RLE form only when that is strictly shorter, and return how many bodies changed;</li>
<li><code>f3()</code> — the number of bits needed if all bodies together were Huffman-coded.</li>
</ul>
<p class="nhan">Data → expected result</p>
<p>(An, aaaaaabbbb), (Binh, hello world), (Chi, zzzzzzzzzzzz), (Dung, hello hello): f1("hello") = 2, f1("ab") = 1, f1("xyz") = 0; f2() = 2 → (An,6a4b) (Binh,hello world) (Chi,12z) (Dung,hello hello). f3 of ABR + ACADABRA = <strong>23</strong>; f3 of AAAA = 4; an empty list gives 0 0 0.</p>
<p class="nhan">Idea</p>
<p>f3 does not need the codes: every merge adds one bit to every symbol below the new node, so the total number of bits is the sum of the weights of all merged nodes — for ABRACADABRA 2 + 4 + 6 + 11 = 23. A <code>PriorityQueue&lt;Integer&gt;</code> of the counts is enough.</p>
<p class="nhan">Solution + self-test — every line must say PASS</p>
<pre><code class="language-java">import java.util.PriorityQueue;

class Msg {
    String sender, body;
    Msg(String sender, String body) { this.sender = sender; this.body = body; }
    public String toString() { return "(" + sender + "," + body + ")"; }
}

class Node {
    Msg info;
    Node next;
    Node(Msg x, Node p) { info = x; next = p; }
}

class MsgList {
    Node head, tail;

    void addLast(String s, String b) {
        Node q = new Node(new Msg(s, b), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    static boolean contains(String a, String p) {    // KMP with the slides' T[]
        int m = p.length();
        if (m == 0) return true;
        int[] T = new int[m];
        T[0] = -1;
        for (int j = 1; j &lt; m; j++) { int k = T[j - 1]; while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k]; T[j] = k + 1; }
        for (int i = 0, k = 0; i &lt; a.length(); ) {
            if (a.charAt(i) == p.charAt(k)) { i++; k++; if (k == m) return true; }
            else { k = T[k]; if (k &lt; 0) { i++; k = 0; } }
        }
        return false;
    }

    // f1: how many messages contain the keyword
    int f1(String keyword) {
        int count = 0;
        for (Node p = head; p != null; p = p.next) if (contains(p.info.body, keyword)) count++;
        return count;
    }

    static String rle(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0, j; i &lt; s.length(); i = j) {
            for (j = i; j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i); j++) { }
            out.append(j - i).append(s.charAt(i));
        }
        return out.toString();
    }

    // f2: replace a body by its RLE form only when that is strictly shorter; return how many changed
    int f2() {
        int changed = 0;
        for (Node p = head; p != null; p = p.next) {
            String r = rle(p.info.body);
            if (r.length() &lt; p.info.body.length()) { p.info.body = r; changed++; }
        }
        return changed;
    }

    // f3: Huffman bits for all bodies together = sum of the weights of all merged nodes
    int f3() {
        int[] f = new int[128];
        for (Node p = head; p != null; p = p.next) for (char c : p.info.body.toCharArray()) f[c]++;
        PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;Integer&gt;();
        for (int c = 0; c &lt; 128; c++) if (f[c] &gt; 0) pq.add(f[c]);
        if (pq.size() == 1) return pq.peek();        // one distinct symbol: 1 bit each
        int bits = 0;
        while (pq.size() &gt; 1) { int s = pq.poll() + pq.poll(); bits += s; pq.add(s); }   // each merge adds 1 bit to s symbols
        return bits;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe7MessageLog {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MsgList sample() {
        MsgList t = new MsgList();
        t.addLast("An", "aaaaaabbbb");
        t.addLast("Binh", "hello world");
        t.addLast("Chi", "zzzzzzzzzzzz");
        t.addLast("Dung", "hello hello");
        return t;
    }

    public static void main(String[] args) {
        check("f1: hello", "" + sample().f1("hello"), "2");
        check("f1: ab (inside aaaaaabbbb)", "" + sample().f1("ab"), "1");
        check("f1: xyz", "" + sample().f1("xyz"), "0");
        MsgList t = sample();
        check("f2: two bodies get shorter", "" + t.f2(), "2");
        check("f2: the list afterwards", t.traverse(), "(An,6a4b) (Binh,hello world) (Chi,12z) (Dung,hello hello)");
        MsgList h = new MsgList();
        h.addLast("X", "ABR");
        h.addLast("Y", "ACADABRA");
        check("f3: ABR + ACADABRA = ABRACADABRA -&gt; 23 bits", "" + h.f3(), "23");
        MsgList z = new MsgList();
        z.addLast("Z", "AAAA");
        check("f3: one distinct symbol -&gt; 1 bit each", "" + z.f3(), "4");
        MsgList e = new MsgList();
        check("empty list: f1 f2 f3", e.f1("a") + " " + e.f2() + " " + e.f3(), "0 0 0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1: hello<br>
PASS f1: ab (inside aaaaaabbbb)<br>
PASS f1: xyz<br>
PASS f2: two bodies get shorter<br>
PASS f2: the list afterwards<br>
PASS f3: ABR + ACADABRA = ABRACADABRA -&gt; 23 bits<br>
PASS f3: one distinct symbol -&gt; 1 bit each<br>
PASS empty list: f1 f2 f3<br>
ALL TESTS PASSED</div>
<div class="pitfall">The order of the calls matters: after f2, An's body is "6a4b" and no longer contains "ab" — that is why each test starts from a fresh list. In f3, a single distinct symbol leaves one element in the queue and no merge at all, yet each symbol still costs 1 bit: return the count, not 0.</div>`,
    `<h3>🧪 Bài 7 — nhật ký tin nhắn: f1 tìm bằng KMP, f2 nén RLE, f3 số bit Huffman (gần đề thật · ~30 phút)</h3>
<p class="nhan">Đề bài</p>
<p>Các tin nhắn <code>Msg(sender, body)</code> được giữ trong danh sách liên kết đơn (singly linked list) <code>MsgList</code> (head, tail — như chương 1). Viết:</p>
<ul>
<li><code>f1(keyword)</code> — có bao nhiêu tin nhắn chứa từ khoá (keyword), dùng KMP của bạn;</li>
<li><code>f2()</code> — thay nội dung tin bằng dạng RLE (mã hoá độ dài loạt) chỉ khi dạng đó ngắn hơn hẳn, trả về số tin đã đổi;</li>
<li><code>f3()</code> — số bit cần dùng nếu mã hoá Huffman toàn bộ nội dung các tin gộp lại.</li>
</ul>
<p class="nhan">Dữ liệu → kết quả mong đợi</p>
<p>(An, aaaaaabbbb), (Binh, hello world), (Chi, zzzzzzzzzzzz), (Dung, hello hello): f1("hello") = 2, f1("ab") = 1, f1("xyz") = 0; f2() = 2 → (An,6a4b) (Binh,hello world) (Chi,12z) (Dung,hello hello). f3 của ABR + ACADABRA = <strong>23</strong>; f3 của AAAA = 4; danh sách rỗng cho 0 0 0.</p>
<p class="nhan">Ý tưởng</p>
<p>f3 không cần dựng bảng mã: mỗi lần gộp (merge) thêm một bit cho mọi ký hiệu nằm dưới nút mới, nên tổng số bit bằng tổng trọng số của mọi nút được gộp — với ABRACADABRA là 2 + 4 + 6 + 11 = 23. Chỉ cần một <code>PriorityQueue&lt;Integer&gt;</code> chứa các số lần xuất hiện.</p>
<p class="nhan">Lời giải + test tự kiểm — mọi dòng phải là PASS</p>
<pre><code class="language-java">import java.util.PriorityQueue;

class Msg {
    String sender, body;
    Msg(String sender, String body) { this.sender = sender; this.body = body; }
    public String toString() { return "(" + sender + "," + body + ")"; }
}

class Node {
    Msg info;
    Node next;
    Node(Msg x, Node p) { info = x; next = p; }
}

class MsgList {
    Node head, tail;

    void addLast(String s, String b) {
        Node q = new Node(new Msg(s, b), null);
        if (head == null) head = tail = q; else { tail.next = q; tail = q; }
    }

    static boolean contains(String a, String p) {    // KMP với bảng T[] của slide
        int m = p.length();
        if (m == 0) return true;
        int[] T = new int[m];
        T[0] = -1;
        for (int j = 1; j &lt; m; j++) { int k = T[j - 1]; while (k &gt;= 0 &amp;&amp; p.charAt(k) != p.charAt(j - 1)) k = T[k]; T[j] = k + 1; }
        for (int i = 0, k = 0; i &lt; a.length(); ) {
            if (a.charAt(i) == p.charAt(k)) { i++; k++; if (k == m) return true; }
            else { k = T[k]; if (k &lt; 0) { i++; k = 0; } }
        }
        return false;
    }

    // f1: có bao nhiêu tin nhắn chứa từ khoá
    int f1(String keyword) {
        int count = 0;
        for (Node p = head; p != null; p = p.next) if (contains(p.info.body, keyword)) count++;
        return count;
    }

    static String rle(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0, j; i &lt; s.length(); i = j) {
            for (j = i; j &lt; s.length() &amp;&amp; s.charAt(j) == s.charAt(i); j++) { }
            out.append(j - i).append(s.charAt(i));
        }
        return out.toString();
    }

    // f2: thay nội dung bằng dạng RLE chỉ khi ngắn hơn hẳn; trả về số tin đã đổi
    int f2() {
        int changed = 0;
        for (Node p = head; p != null; p = p.next) {
            String r = rle(p.info.body);
            if (r.length() &lt; p.info.body.length()) { p.info.body = r; changed++; }
        }
        return changed;
    }

    // f3: số bit Huffman của mọi nội dung gộp lại = tổng trọng số các nút được gộp
    int f3() {
        int[] f = new int[128];
        for (Node p = head; p != null; p = p.next) for (char c : p.info.body.toCharArray()) f[c]++;
        PriorityQueue&lt;Integer&gt; pq = new PriorityQueue&lt;Integer&gt;();
        for (int c = 0; c &lt; 128; c++) if (f[c] &gt; 0) pq.add(f[c]);
        if (pq.size() == 1) return pq.peek();        // chỉ một ký hiệu: mỗi cái 1 bit
        int bits = 0;
        while (pq.size() &gt; 1) { int s = pq.poll() + pq.poll(); bits += s; pq.add(s); }   // mỗi lần gộp thêm 1 bit cho s ký hiệu
        return bits;
    }

    String traverse() {
        StringBuilder s = new StringBuilder();
        for (Node p = head; p != null; p = p.next) s.append(p.info).append(' ');
        return s.toString().trim();
    }
}

public class Pe7MessageLog {
    static int fails = 0;

    static void check(String name, String got, String want) {
        boolean ok = got.equals(want);
        if (!ok) fails++;
        System.out.println((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  got=" + got + "  want=" + want));
    }

    static MsgList sample() {
        MsgList t = new MsgList();
        t.addLast("An", "aaaaaabbbb");
        t.addLast("Binh", "hello world");
        t.addLast("Chi", "zzzzzzzzzzzz");
        t.addLast("Dung", "hello hello");
        return t;
    }

    public static void main(String[] args) {
        check("f1: hello", "" + sample().f1("hello"), "2");
        check("f1: ab (inside aaaaaabbbb)", "" + sample().f1("ab"), "1");
        check("f1: xyz", "" + sample().f1("xyz"), "0");
        MsgList t = sample();
        check("f2: two bodies get shorter", "" + t.f2(), "2");
        check("f2: the list afterwards", t.traverse(), "(An,6a4b) (Binh,hello world) (Chi,12z) (Dung,hello hello)");
        MsgList h = new MsgList();
        h.addLast("X", "ABR");
        h.addLast("Y", "ACADABRA");
        check("f3: ABR + ACADABRA = ABRACADABRA -&gt; 23 bits", "" + h.f3(), "23");
        MsgList z = new MsgList();
        z.addLast("Z", "AAAA");
        check("f3: one distinct symbol -&gt; 1 bit each", "" + z.f3(), "4");
        MsgList e = new MsgList();
        check("empty list: f1 f2 f3", e.f1("a") + " " + e.f2() + " " + e.f3(), "0 0 0");
        System.out.println(fails == 0 ? "ALL TESTS PASSED" : fails + " TEST(S) FAILED");
    }
}</code></pre>
<div class="out">PASS f1: hello<br>
PASS f1: ab (inside aaaaaabbbb)<br>
PASS f1: xyz<br>
PASS f2: two bodies get shorter<br>
PASS f2: the list afterwards<br>
PASS f3: ABR + ACADABRA = ABRACADABRA -&gt; 23 bits<br>
PASS f3: one distinct symbol -&gt; 1 bit each<br>
PASS empty list: f1 f2 f3<br>
ALL TESTS PASSED</div>
<div class="pitfall">Thứ tự gọi hàm có ý nghĩa: sau f2, nội dung của An là "6a4b" và không còn chứa "ab" — vì thế mỗi test bắt đầu từ một danh sách mới. Trong f3, nếu chỉ có một ký hiệu khác nhau thì hàng đợi còn đúng một phần tử và không có lần gộp nào, nhưng mỗi ký hiệu vẫn tốn 1 bit: phải trả về số lần xuất hiện, không phải 0.</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>text / string</strong></td><td>văn bản / chuỗi ký tự</td><td>For this chapter, any sequence of characters — a web page, an email, a DNA sequence.</td></tr>
<tr><td><strong>pattern matching (string matching)</strong></td><td>so khớp mẫu (so khớp chuỗi)</td><td>Finding whether, and where, a pattern p occurs in a text S.</td></tr>
<tr><td><strong>shift</strong></td><td>lần dịch (vị trí thử)</td><td>A starting position of p in S; there are n − m + 1 of them.</td></tr>
<tr><td><strong>brute force</strong></td><td>vét cạn</td><td>Try every shift and compare from p[0]; O(nm) in the worst case.</td></tr>
<tr><td><strong>mismatch</strong></td><td>sai khớp</td><td>The first position where the text character differs from the pattern character.</td></tr>
<tr><td><strong>Knuth–Morris–Pratt (KMP)</strong></td><td>thuật toán KMP</td><td>Matching in O(n + m) by sliding the pattern with a precomputed table, never moving back in the text.</td></tr>
<tr><td><strong>failure function (next, T[])</strong></td><td>hàm thất bại (bảng next, T[])</td><td>T[j] tells how many matched characters can be kept after a mismatch at p[j].</td></tr>
<tr><td><strong>prefix / suffix / proper prefix</strong></td><td>tiền tố / hậu tố / tiền tố thật sự</td><td>The beginning / the end of a string; a proper one is shorter than the string itself.</td></tr>
<tr><td><strong>border</strong></td><td>biên</td><td>A proper prefix that is also a suffix; T[j] is the length of the longest border of p[0..j−1].</td></tr>
<tr><td><strong>data compression</strong></td><td>nén dữ liệu</td><td>Encoding information in fewer bits, then decoding it when needed.</td></tr>
<tr><td><strong>lossy / lossless</strong></td><td>mất mát / không mất mát</td><td>Lossy (MP3, JPG) throws detail away for good; lossless (ZIP, GZ) restores the exact original.</td></tr>
<tr><td><strong>codeword</strong></td><td>từ mã</td><td>The bit string that a code assigns to one symbol.</td></tr>
<tr><td><strong>entropy</strong></td><td>entropy (lượng tin trung bình)</td><td>H = −Σ P·log2 P, the lowest possible average number of bits per symbol for lossless coding.</td></tr>
<tr><td><strong>compression rate</strong></td><td>tỉ lệ nén</td><td>(length(input) − length(output)) / length(input): the fraction saved.</td></tr>
<tr><td><strong>uniquely decodable code</strong></td><td>mã giải được duy nhất</td><td>Every bit sequence splits into codewords in only one way.</td></tr>
<tr><td><strong>prefix code</strong></td><td>mã tiền tố</td><td>No codeword is a prefix of another, so decoding needs no separators.</td></tr>
<tr><td><strong>average code length</strong></td><td>độ dài mã trung bình</td><td>Σ p(c)·l(c): each codeword's length weighted by its probability.</td></tr>
<tr><td><strong>Huffman coding</strong></td><td>mã hoá Huffman</td><td>Build an optimal prefix code by repeatedly merging the two least frequent nodes.</td></tr>
<tr><td><strong>greedy algorithm</strong></td><td>thuật toán tham lam</td><td>Takes the locally best choice at each step, like "merge the two smallest".</td></tr>
<tr><td><strong>dictionary coder (LZ77, LZ78, LZW)</strong></td><td>bộ mã hoá dùng từ điển</td><td>Replaces a repeated string by its position in a dictionary; LZW builds the dictionary on both sides.</td></tr>
<tr><td><strong>special case (LZW decoding)</strong></td><td>ca đặc biệt khi giải mã LZW</td><td>A code not yet in the dictionary stands for prev + the first character of prev.</td></tr>
<tr><td><strong>run-length encoding (RLE)</strong></td><td>mã hoá độ dài loạt</td><td>Each run of one repeated symbol becomes count + symbol, as in 4F4O3F2O5F7O.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>text / string</strong></td><td>văn bản / chuỗi ký tự</td><td>Trong chương này là mọi dãy ký tự — một trang web, một thư điện tử, một chuỗi DNA.</td></tr>
<tr><td><strong>pattern matching (string matching)</strong></td><td>so khớp mẫu (so khớp chuỗi)</td><td>Tìm xem mẫu p có xuất hiện trong văn bản S không, và ở vị trí nào.</td></tr>
<tr><td><strong>shift</strong></td><td>lần dịch (vị trí thử)</td><td>Một vị trí bắt đầu thử đặt p trong S; có n − m + 1 vị trí như vậy.</td></tr>
<tr><td><strong>brute force</strong></td><td>vét cạn</td><td>Thử mọi lần dịch và so từ p[0]; O(nm) trong trường hợp xấu nhất.</td></tr>
<tr><td><strong>mismatch</strong></td><td>sai khớp</td><td>Vị trí đầu tiên mà ký tự văn bản khác ký tự của mẫu.</td></tr>
<tr><td><strong>Knuth–Morris–Pratt (KMP)</strong></td><td>thuật toán KMP</td><td>So khớp trong O(n + m) nhờ trượt mẫu theo một bảng tính sẵn, không bao giờ lùi trên văn bản.</td></tr>
<tr><td><strong>failure function (next, T[])</strong></td><td>hàm thất bại (bảng next, T[])</td><td>T[j] cho biết giữ lại được bao nhiêu ký tự đã khớp khi sai khớp tại p[j].</td></tr>
<tr><td><strong>prefix / suffix / proper prefix</strong></td><td>tiền tố / hậu tố / tiền tố thật sự</td><td>Phần đầu / phần cuối của một chuỗi; "thật sự" nghĩa là ngắn hơn chính chuỗi đó.</td></tr>
<tr><td><strong>border</strong></td><td>biên</td><td>Tiền tố thật sự đồng thời là hậu tố; T[j] là độ dài biên dài nhất của p[0..j−1].</td></tr>
<tr><td><strong>data compression</strong></td><td>nén dữ liệu</td><td>Mã hoá thông tin bằng ít bit hơn, rồi giải mã khi cần dùng.</td></tr>
<tr><td><strong>lossy / lossless</strong></td><td>mất mát / không mất mát</td><td>Mất mát (MP3, JPG) vứt bỏ chi tiết vĩnh viễn; không mất mát (ZIP, GZ) khôi phục đúng nguyên bản.</td></tr>
<tr><td><strong>codeword</strong></td><td>từ mã</td><td>Dãy bit mà bộ mã gán cho một ký hiệu.</td></tr>
<tr><td><strong>entropy</strong></td><td>entropy (lượng tin trung bình)</td><td>H = −Σ P·log2 P, số bit trung bình mỗi ký hiệu thấp nhất có thể khi nén không mất mát.</td></tr>
<tr><td><strong>compression rate</strong></td><td>tỉ lệ nén</td><td>(độ dài vào − độ dài ra) / độ dài vào: phần tiết kiệm được.</td></tr>
<tr><td><strong>uniquely decodable code</strong></td><td>mã giải được duy nhất</td><td>Mọi dãy bit chỉ tách được thành các từ mã theo đúng một cách.</td></tr>
<tr><td><strong>prefix code</strong></td><td>mã tiền tố</td><td>Không từ mã nào là phần đầu của từ mã khác, nên giải mã không cần dấu phân cách.</td></tr>
<tr><td><strong>average code length</strong></td><td>độ dài mã trung bình</td><td>Σ p(c)·l(c): độ dài mỗi từ mã nhân với xác suất của nó rồi cộng lại.</td></tr>
<tr><td><strong>Huffman coding</strong></td><td>mã hoá Huffman</td><td>Dựng mã tiền tố tối ưu bằng cách lặp lại việc gộp hai nút ít gặp nhất.</td></tr>
<tr><td><strong>greedy algorithm</strong></td><td>thuật toán tham lam</td><td>Mỗi bước chọn phương án tốt nhất trước mắt, như "gộp hai nút nhỏ nhất".</td></tr>
<tr><td><strong>dictionary coder (LZ77, LZ78, LZW)</strong></td><td>bộ mã hoá dùng từ điển</td><td>Thay một chuỗi lặp lại bằng vị trí của nó trong từ điển; LZW để cả hai bên tự dựng từ điển.</td></tr>
<tr><td><strong>special case (LZW decoding)</strong></td><td>ca đặc biệt khi giải mã LZW</td><td>Một mã chưa có trong từ điển chính là chuỗi trước + ký tự đầu của chuỗi trước.</td></tr>
<tr><td><strong>run-length encoding (RLE)</strong></td><td>mã hoá độ dài loạt</td><td>Mỗi loạt ký hiệu lặp lại thành số lần + ký hiệu, như 4F4O3F2O5F7O.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — 8 things to remember from Chapter 8</h2>
<ol>
<li><strong>String matching</strong>: find where p (length m) occurs in S (length n); there are n − m + 1 shifts. Java's <code>indexOf</code> is the reference answer.</li>
<li><strong>Brute force</strong> tries every shift and restarts at p[0] after a mismatch: (n − m + 1)·m comparisons in the worst case, O(nm).</li>
<li><strong>KMP</strong> never moves back in the text: after a mismatch at p[k] it continues with p[T[k]] under the same text character. O(m) for T[], ≤ 2n comparisons for the search → O(n + m).</li>
<li><strong>T[j]</strong> (slides) = the longest border of p[0..j−1], with T[0] = −1; the book's fail[k] = T[k + 1]. Practise the three tables of slide 15.</li>
<li><strong>Compression</strong> is lossy (MP3, JPG) or lossless (ZIP, GZ, and every algorithm here); the rate is (in − out)/in; no lossless code averages fewer bits than the entropy H.</li>
<li><strong>Prefix codes</strong> (symbols at the leaves of a tree) are uniquely decodable; a code like a = 1, b = 01, c = 101, d = 011 is not.</li>
<li><strong>Huffman</strong>: merge the two smallest until one tree is left; code = root-to-leaf path; many Huffman codes exist, all with the same average (2.34 bits for slide 23's frequencies, not 1.89).</li>
<li><strong>LZW</strong> builds the same dictionary on both sides (special case when decoding: prev + prev's first character); <strong>RLE</strong> writes count + symbol and only pays off on long runs.</li>
</ol>
<h3>✅ Check yourself before the quiz</h3>
<ol>
<li>Why does <code>kmpAll</code> in Exercise 2 need the extra entry T[m]?</li>
<li>Why can the RLE format of Exercise 3 not handle the text 2024?</li>
<li>In Exercise 7, why is "the sum of the merged weights" equal to the total number of Huffman bits?</li>
<li>In the LZW decoder, which string is added to the dictionary in both branches?</li>
<li>Slide 30 prints an average code length of 1.89. What is the right value, and how do you know 1.89 is impossible?</li>
</ol>
<p class="dap-an">✅ <strong>Answers:</strong> (1) After a full match it tells how many characters to keep (the border of the whole pattern), so overlapping occurrences are found without moving back. (2) The digits of the data are read as part of the counts — the output cannot be decoded. (3) Each merge adds one bit to every symbol below the new node, i.e. to as many symbols as the new weight counts. (4) prev + the first character of the current string. (5) 2.34 — the slide's own sum; 1.89 is below the entropy 2.28, and no uniquely decodable code can average less than the entropy.</p>
<h3>⏱ Complexity table</h3>
<table>
<thead><tr><th>Algorithm</th><th>Preparation</th><th>Main work</th><th>Extra memory</th><th>Remark</th></tr></thead>
<tbody>
<tr><td>Brute-force matching</td><td>—</td><td>(n − m + 1)·m comparisons worst case → O(nm)</td><td>O(1)</td><td>usually fast on ordinary text</td></tr>
<tr><td>KMP</td><td>T[] in O(m)</td><td>≤ 2n comparisons → O(n)</td><td>O(m)</td><td>text position never goes back</td></tr>
<tr><td>Huffman: count frequencies</td><td>—</td><td>O(n)</td><td>one counter per symbol</td><td>needs a first pass over the input</td></tr>
<tr><td>Huffman: build the tree</td><td>—</td><td>k − 1 merges on a heap → O(k log k)</td><td>O(k) nodes</td><td>k = number of distinct symbols</td></tr>
<tr><td>Huffman: encode / decode</td><td>code table O(k)</td><td>one look-up per symbol / one edge per bit</td><td>O(k)</td><td>the table or tree travels with the file</td></tr>
<tr><td>LZW encode / decode</td><td>single characters in the dictionary</td><td>O(n) look-ups with a hash map or trie</td><td>the dictionary</td><td>the dictionary is never transmitted</td></tr>
<tr><td>RLE encode / decode</td><td>—</td><td>O(n)</td><td>O(1) besides the output</td><td>doubles data without runs</td></tr>
</tbody>
</table>`,
    `<h2>📌 Tóm tắt — 8 điều cần nhớ của Chương 8</h2>
<ol>
<li><strong>So khớp chuỗi (string matching)</strong>: tìm vị trí của p (dài m) trong S (dài n); có n − m + 1 lần dịch (shift). <code>indexOf</code> của Java là đáp án chuẩn để đối chiếu.</li>
<li><strong>Vét cạn (brute force)</strong> thử mọi lần dịch và làm lại từ p[0] sau mỗi lần sai khớp: (n − m + 1)·m phép so sánh trong trường hợp xấu nhất, O(nm).</li>
<li><strong>KMP</strong> không bao giờ lùi trên văn bản: sai khớp ở p[k] thì đi tiếp với p[T[k]] đặt dưới đúng ký tự văn bản đó. O(m) để dựng T[], ≤ 2n phép so khi tìm → O(n + m).</li>
<li><strong>T[j]</strong> (của slide) = biên (border) dài nhất của p[0..j−1], với T[0] = −1; fail[k] của sách = T[k + 1]. Hãy luyện ba bảng của slide 15.</li>
<li><strong>Nén</strong> có loại mất mát (lossy — MP3, JPG) và không mất mát (lossless — ZIP, GZ và mọi thuật toán ở đây); tỉ lệ nén là (vào − ra)/vào; không mã không mất mát nào có trung bình ít bit hơn entropy H (lượng tin trung bình).</li>
<li><strong>Mã tiền tố (prefix code)</strong> — ký hiệu nằm ở lá của cây — luôn giải được duy nhất; bộ mã kiểu a = 1, b = 01, c = 101, d = 011 thì không.</li>
<li><strong>Huffman</strong>: gộp hai nút nhỏ nhất tới khi còn một cây; mã = đường đi từ gốc tới lá; có nhiều mã Huffman khác nhau nhưng cùng độ dài trung bình (2.34 bit với tần suất slide 23, không phải 1.89).</li>
<li><strong>LZW</strong> để hai bên dựng cùng một từ điển (ca đặc biệt khi giải mã: chuỗi trước + ký tự đầu của chuỗi trước); <strong>RLE</strong> (mã hoá độ dài loạt — run-length encoding) ghi số lần + ký hiệu và chỉ có lợi khi có loạt dài.</li>
</ol>
<h3>✅ Tự kiểm tra trước khi làm bài trắc nghiệm (quiz)</h3>
<ol>
<li>Vì sao <code>kmpAll</code> ở Bài 2 cần thêm ô T[m]?</li>
<li>Vì sao định dạng RLE ở Bài 3 không xử lý được văn bản 2024?</li>
<li>Ở Bài 7, vì sao "tổng trọng số các nút được gộp" lại bằng tổng số bit Huffman?</li>
<li>Trong bộ giải mã LZW, chuỗi nào được thêm vào từ điển ở cả hai nhánh?</li>
<li>Slide 30 in độ dài mã trung bình là 1.89. Giá trị đúng là bao nhiêu, và làm sao biết 1.89 là không thể?</li>
</ol>
<p class="dap-an">✅ <strong>Đáp án:</strong> (1) Khớp trọn xong, nó cho biết giữ lại bao nhiêu ký tự (biên của cả mẫu), nhờ đó tìm được các lần xuất hiện chồng nhau mà không phải lùi. (2) Các chữ số của dữ liệu bị đọc lẫn vào số lần — đầu ra không giải mã được. (3) Mỗi lần gộp thêm một bit cho mọi ký hiệu nằm dưới nút mới, tức là cho đúng số ký hiệu mà trọng số mới đếm được. (4) Chuỗi trước + ký tự đầu của chuỗi hiện tại. (5) 2.34 — chính phép cộng trên slide; 1.89 nhỏ hơn entropy 2.28, mà không mã giải được duy nhất nào có trung bình nhỏ hơn entropy.</p>
<h3>⏱ Bảng độ phức tạp</h3>
<table>
<thead><tr><th>Thuật toán</th><th>Chuẩn bị</th><th>Phần việc chính</th><th>Bộ nhớ thêm</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>So khớp vét cạn</td><td>—</td><td>(n − m + 1)·m phép so xấu nhất → O(nm)</td><td>O(1)</td><td>thường vẫn nhanh trên văn bản bình thường</td></tr>
<tr><td>KMP</td><td>bảng T[] trong O(m)</td><td>≤ 2n phép so → O(n)</td><td>O(m)</td><td>vị trí trên văn bản không bao giờ lùi</td></tr>
<tr><td>Huffman: đếm tần suất</td><td>—</td><td>O(n)</td><td>mỗi ký hiệu một bộ đếm</td><td>cần một lượt đọc đầu vào trước</td></tr>
<tr><td>Huffman: dựng cây</td><td>—</td><td>k − 1 lần gộp trên đống (heap) → O(k log k)</td><td>O(k) nút</td><td>k = số ký hiệu khác nhau</td></tr>
<tr><td>Huffman: mã hoá / giải mã</td><td>bảng mã O(k)</td><td>mỗi ký hiệu một lần tra / mỗi bit một cạnh</td><td>O(k)</td><td>bảng mã hoặc cây phải đi kèm tệp</td></tr>
<tr><td>LZW mã hoá / giải mã</td><td>các ký tự đơn trong từ điển</td><td>O(n) lần tra với bảng băm (hash map) hoặc cây tiền tố (trie)</td><td>chính từ điển</td><td>từ điển không bao giờ phải gửi đi</td></tr>
<tr><td>RLE mã hoá / giải mã</td><td>—</td><td>O(n)</td><td>O(1) ngoài đầu ra</td><td>làm dài gấp đôi dữ liệu không có loạt</td></tr>
</tbody>
</table>`),
  ].join('\n'),
};

/* ───────── Quiz (csd201-quiz-ch8) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Brute force searches for p = abaa in S = abcabaabcabac (the example of slides 6–9). At which 0-based position does the first match start?|||Thuật toán vét cạn tìm p = abaa trong S = abcabaabcabac (ví dụ ở slide 6–9). Lần khớp đầu tiên bắt đầu ở vị trí nào (đếm từ 0)?',
      options: ['4|||4', '3|||3', '2|||2', '6|||6'],
      correctIndex: 1,
      points: 1,
      explanation: "Shift 0 fails at the third character (c ≠ a); shifts 1 and 2 fail at once (b, c ≠ a); shift 3 reads a b a a — a match, exactly \"after shifting p three times\" as slide 9 says. 4 is the slip of counting positions from 1 like the slide's p[1], S[1] notation.|||Dịch 0 hỏng ở ký tự thứ ba (c ≠ a); dịch 1 và 2 hỏng ngay (b, c ≠ a); dịch 3 đọc được a b a a — khớp, đúng như slide 9 nói \"sau khi dịch p ba lần\". 4 là lỗi đếm vị trí từ 1 theo cách viết p[1], S[1] của slide." },
    { id: 'q2',
      question: 'For the pattern p = ABACABABC of slide 15, what is T[7] — the position in p where KMP continues comparing after a mismatch at p[7]?|||Với mẫu p = ABACABABC ở slide 15, T[7] bằng bao nhiêu — tức vị trí trong p mà KMP so tiếp sau khi sai khớp tại p[7]?',
      options: ['3|||3', '2|||2', '4|||4', '1|||1'],
      correctIndex: 0,
      points: 1,
      explanation: 'T[7] = 3 because p[0..6] = ABACABA has "ABA" as its longest proper prefix that is also a suffix. So after a mismatch at p[7], KMP keeps the text position and continues by comparing p[3] — the three matched characters need not be checked again. 2 is T[8], the neighbour in the table.|||T[7] = 3 vì p[0..6] = ABACABA có "ABA" là tiền tố thật dài nhất đồng thời là hậu tố. Nên khi sai khớp tại p[7], KMP giữ nguyên vị trí trong văn bản và so tiếp với p[3] — ba ký tự đã khớp không phải so lại. 2 là T[8], ô bên cạnh trong bảng.' },
    { id: 'q3',
      question: 'Why does KMP run in O(n + m) while brute force can take O(n·m)?|||Vì sao KMP chạy trong O(n + m) còn vét cạn có thể mất O(n·m)?',
      options: ['KMP compares characters from right to left|||KMP so ký tự từ phải sang trái', 'KMP stops at the first mismatch and restarts at the next text position|||KMP dừng ở lần sai khớp đầu tiên rồi bắt đầu lại ở vị trí kế tiếp của văn bản', 'KMP never moves backwards in the text; the table T tells it where to continue in the pattern|||KMP không bao giờ lùi trong văn bản; bảng T cho biết so tiếp ở đâu trong mẫu', 'KMP hashes the pattern and compares hash values|||KMP băm mẫu rồi so các giá trị băm'],
      correctIndex: 2,
      points: 1,
      explanation: 'Each step of KMP either advances in the text or slides the pattern right using T, and each can happen at most n times: about 2n steps, plus O(m) to build T (slides 10 and 14). Option B is the tempting one, but it describes brute force itself: restarting at the next position re-reads characters it has already compared, which is exactly what costs O(n·m).|||Mỗi bước của KMP hoặc tiến trong văn bản, hoặc trượt mẫu sang phải nhờ T, và mỗi việc xảy ra nhiều nhất n lần: khoảng 2n bước, cộng O(m) để dựng T (slide 10 và 14). Phương án B dễ gây nhầm, nhưng đó chính là vét cạn: bắt đầu lại ở vị trí kế tiếp là đọc lại những ký tự đã so, và chính điều đó tốn O(n·m).' },
    { id: 'q4',
      question: 'Which set of codewords is a prefix code?|||Tập từ mã nào là mã tiền tố (prefix code)?',
      options: ['{1, 01, 101, 011}|||{1, 01, 101, 011}', '{0, 01, 11, 111}|||{0, 01, 11, 111}', '{00, 0, 10, 11}|||{00, 0, 10, 11}', '{0, 10, 110, 111}|||{0, 10, 110, 111}'],
      correctIndex: 3,
      points: 1,
      explanation: 'A prefix code has no codeword that begins another codeword, so a bit stream can be cut unambiguously from the left. In D, 0, 10, 110 and 111 never start one another (slide 20 uses a similar code). A is the code of slide 19: 1 starts 101, so 1011 can be read as aba, ca or ad. In B, 0 starts 01; in C, 0 starts 00.|||Mã tiền tố không có từ mã nào là phần đầu của từ mã khác, nên chuỗi bit tách được duy nhất từ trái sang. Ở D, 0, 10, 110 và 111 không cái nào mở đầu cái nào (slide 20 dùng một mã tương tự). A là mã của slide 19: 1 là phần đầu của 101, nên 1011 đọc được thành aba, ca hoặc ad. Ở B, 0 mở đầu 01; ở C, 0 mở đầu 00.' },
    { id: 'q5',
      question: 'Slides 23–30 build a Huffman code for A .20, B .09, C .15, D .11, E .40, F .05 with codeword lengths A 3, B 4, C 3, D 3, E 1, F 4. What is the average code length?|||Slide 23–30 dựng mã Huffman cho A .20, B .09, C .15, D .11, E .40, F .05 với độ dài từ mã A 3, B 4, C 3, D 3, E 1, F 4. Độ dài mã trung bình là bao nhiêu?',
      options: ['2.34 bits|||2,34 bit', '1.89 bits|||1,89 bit', '2.28 bits|||2,28 bit', '3.00 bits|||3,00 bit'],
      correctIndex: 0,
      points: 1,
      explanation: '3·0.20 + 4·0.09 + 3·0.15 + 3·0.11 + 1·0.40 + 4·0.05 = 0.60 + 0.36 + 0.45 + 0.33 + 0.40 + 0.20 = 2.34. Slide 30 prints 1.89 for this very sum — an arithmetic slip, and an impossible value, since no prefix code can go below the entropy of these probabilities, about 2.28 bits (option C). A fixed-length code for six symbols would need 3 bits (option D).|||3·0,20 + 4·0,09 + 3·0,15 + 3·0,11 + 1·0,40 + 4·0,05 = 0,60 + 0,36 + 0,45 + 0,33 + 0,40 + 0,20 = 2,34. Slide 30 in 1.89 cho đúng tổng này — một lỗi tính nhẩm, và là giá trị không thể có, vì không mã tiền tố nào xuống dưới entropy của các xác suất này, khoảng 2,28 bit (phương án C). Mã độ dài cố định cho sáu ký hiệu cần 3 bit (phương án D).' },
    { id: 'q6',
      question: "With the frequencies A .20, B .09, C .15, D .11, E .40, F .05, which two symbols does Huffman's algorithm combine first?|||Với tần suất A .20, B .09, C .15, D .11, E .40, F .05, thuật toán Huffman gộp hai ký hiệu nào đầu tiên?",
      options: ['E (.40) and A (.20)|||E (.40) và A (.20)', 'D (.11) and C (.15)|||D (.11) và C (.15)', 'F (.05) and B (.09)|||F (.05) và B (.09)', 'F (.05) and D (.11)|||F (.05) và D (.11)'],
      correctIndex: 2,
      points: 1,
      explanation: 'Huffman always joins the two LEAST probable nodes (slide 22): F (.05) and B (.09) form BF (.14), as on slide 25. Then D (.11) and BF (.14) are joined, not F and D — F is already inside BF. Option A inverts the rule: the most frequent symbol E is joined LAST and gets the shortest code, 1 bit.|||Huffman luôn nối hai nút có xác suất NHỎ NHẤT (slide 22): F (.05) và B (.09) thành BF (.14), như slide 25. Sau đó mới nối D (.11) với BF (.14), chứ không phải F với D — F đã nằm trong BF. Phương án A đảo ngược quy tắc: ký hiệu hay gặp nhất E được nối SAU CÙNG và nhận mã ngắn nhất, 1 bit.' },
    { id: 'q7',
      question: 'LZW encodes ABABAB starting from the dictionary (1) A, (2) B; new strings get codes 3, 4, … What is the output?|||LZW mã hoá ABABAB bắt đầu từ từ điển (1) A, (2) B; chuỗi mới nhận mã 3, 4, … Output là gì?',
      options: ['1 2 1 2 1 2|||1 2 1 2 1 2', '1 2 3 3|||1 2 3 3', '1 2 3 5|||1 2 3 5', '3 3 3|||3 3 3'],
      correctIndex: 1,
      points: 1,
      explanation: 'A → P = A; AB is new: output 1, add AB = 3, P = B; BA is new: output 2, add BA = 4, P = A; AB is known → P = AB; ABA is new: output 3, add ABA = 5, P = A; AB is known → P = AB; end of input: output 3. Option C expects 5 = ABA to be used, but the input ends before ABA appears again; A is what you get without any dictionary growth.|||A → P = A; AB là chuỗi mới: xuất 1, thêm AB = 3, P = B; BA mới: xuất 2, thêm BA = 4, P = A; AB đã có → P = AB; ABA mới: xuất 3, thêm ABA = 5, P = A; AB đã có → P = AB; hết dữ liệu: xuất 3. Phương án C tưởng mã 5 = ABA được dùng, nhưng dữ liệu hết trước khi ABA xuất hiện lại; A là kết quả khi từ điển không hề lớn lên.' },
    { id: 'q8',
      question: 'LZW decodes the codes 1 4 with the initial dictionary (1) A, (2) B, (3) C. What is the decoded text?|||LZW giải mã chuỗi mã 1 4 với từ điển ban đầu (1) A, (2) B, (3) C. Văn bản giải mã là gì?',
      options: ['AA|||AA', 'AB|||AB', 'An error: code 4 is not in the dictionary|||Lỗi: mã 4 chưa có trong từ điển', 'AAA|||AAA'],
      correctIndex: 3,
      points: 1,
      explanation: '1 gives A. Code 4 is not in the dictionary yet — the special case of the decoding algorithm (slide 40): the string is pW + first character of pW = A + A = AA, which is added as (4) and output. Total: A + AA = AAA. Option C is the tempting reaction, but this case happens whenever the encoder uses a string in the very step after creating it (input AAA gives exactly 1 4).|||1 cho ra A. Mã 4 chưa có trong từ điển — đúng ca đặc biệt của thuật toán giải mã (slide 40): chuỗi là pW + ký tự đầu của pW = A + A = AA, được thêm làm (4) và xuất ra. Tổng cộng: A + AA = AAA. Phương án C là phản xạ dễ nhầm, nhưng ca này xảy ra mỗi khi bộ mã hoá dùng một chuỗi ngay ở bước sau khi vừa tạo nó (đầu vào AAA cho đúng 1 4).' },
    { id: 'q9',
      question: 'Run-length encoding writes each run as count followed by symbol, as in 4F4O3F2O5F7O (slide 36). How is AAABCCDDDD encoded?|||Mã hoá loạt dài (RLE) ghi mỗi loạt bằng số lượng rồi ký hiệu, như 4F4O3F2O5F7O (slide 36). AAABCCDDDD được mã hoá thế nào?',
      options: ['3A1B2C4D|||3A1B2C4D', '3AB2C4D|||3AB2C4D', 'A3B1C2D4|||A3B1C2D4', '3A2C4D|||3A2C4D'],
      correctIndex: 0,
      points: 1,
      explanation: 'The runs are AAA, B, CC, DDDD → 3A 1B 2C 4D. A run of length 1 still needs its count, otherwise the decoder cannot tell a count from a symbol (option B). C puts the count after the symbol — a valid variant elsewhere, but not the convention of the slide. Note that RLE can make data longer: 10 characters became 8, and text without runs would double.|||Các loạt là AAA, B, CC, DDDD → 3A 1B 2C 4D. Loạt dài 1 vẫn phải ghi số đếm, nếu không bộ giải mã không phân biệt được đâu là số, đâu là ký hiệu (phương án B). C đặt số đếm sau ký hiệu — là một biến thể hợp lệ ở nơi khác, nhưng không phải quy ước của slide. Lưu ý RLE có thể làm dữ liệu dài ra: 10 ký tự còn 8, còn văn bản không có loạt lặp sẽ dài gấp đôi.' },
    { id: 'q10',
      question: 'Which format uses LOSSY compression?|||Định dạng nào dùng nén MẤT DỮ LIỆU (lossy)?',
      options: ['ZIP|||ZIP', 'GZ|||GZ', 'JPG|||JPG', 'PNG|||PNG'],
      correctIndex: 2,
      points: 1,
      explanation: 'Lossy compression throws away detail that people barely notice, so the original cannot be restored exactly — JPG for photos and MP3 for music (slide 17). ZIP and GZ are the lossless examples on the same slide: every bit comes back. PNG is tempting because it is an image format too, but PNG compression is lossless.|||Nén mất dữ liệu bỏ đi các chi tiết con người khó nhận ra, nên không khôi phục lại được bản gốc chính xác — JPG cho ảnh chụp và MP3 cho nhạc (slide 17). ZIP và GZ là ví dụ nén không mất dữ liệu (lossless) trên cùng slide: mọi bit đều được khôi phục. PNG dễ gây nhầm vì cũng là định dạng ảnh, nhưng PNG nén không mất dữ liệu.' },
  ],
};

export default {
  slides: [L_csd14_1, L_csd14_2],
  practice: L_on_ch8,
  quiz: QUIZ,
  quizDescription: '10 câu về xử lý văn bản: vét cạn trên ví dụ của slide, bảng T[] của KMP, vì sao KMP là O(n + m), mã tiền tố, độ dài trung bình Huffman (bẫy 1.89 trên slide), lần gộp đầu, mã hoá và giải mã LZW (ca đặc biệt), RLE, nén mất dữ liệu — mỗi câu có giải thích.',
};
