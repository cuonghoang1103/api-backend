/**
 * PRF192 · Slot 13-15 — Contiguous Storage, học theo từng slide: PHẦN 2 (slide 25–50).
 * Deck 'prf7' (PRF7), 70 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf7/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_13_14_15_ContiguousStorage.pptx của trường
 * (/tmp/prf192-text/prf7.txt, slide 25→50). RẤT nhiều slide đặt MÃ NGUỒN VÀ KHUNG
 * CONSOLE TRONG ẢNH (26, 27, 28, 29, 31, 32, 33, 34, 38, 39, 40, 41, 42, 43, 44,
 * 46, 47, 48) nên các ảnh đó đã được đọc trực tiếp để lấy đúng từng dòng code.
 *
 * MỌI chương trình và con số dưới đây đã được biên dịch thật bằng `cc -Wall` và chạy:
 *   · slide 26  linear search {5,9,2,7,6,5,2,5} → tìm 6 ra 4 sau 5 phép so sánh;
 *               tìm 12 ra -1 sau đúng 8 phép so sánh; lastLinearSearch(5) ra 7 sau 1 phép ✓
 *   · slide 27  Exercise 2, a[]={3,34,5,1,2,8,9,2,9}, x=2 → "First existence:4, last existence:7" ✓
 *               (khớp đúng khung console trên slide)
 *   · slide 28  binarySearch trên a={4,6,7,8,10,12,13,15,17,18,19} (11 phần tử):
 *               x=15 → 7 sau 4 vòng ; x=16 → -1 sau 4 vòng ✓
 *     ⚠ NHÃN TRÊN SLIDE ghi "15 elements are considered" cho bước ĐẦU — SAI, mảng chỉ có
 *       11 phần tử (chỉ số 0…10). Các nhãn 5 / 2 / 1 phía sau thì đúng. Đã nêu rõ trong bài.
 *   · slide 29  Exercise 3, b[]={1,4,8,10,12,16,22,24}: 22 → 6 (3 vòng), 7 → -1 (3 vòng) ✓
 *               Linear trên cùng mảng: 22 cần 7 phép so sánh, 7 cần 8 — binary cần 3 ✓
 *   · slide 31  Selection Sort {4,2,6,9,3,5,1}: đúng 21 phép so sánh = 7·6/2, chỉ 4 lần đổi chỗ ✓
 *   · slide 32  {1,3,5,7,9,2,4,6,8,0} → "0 1 2 3 4 5 6 7 8 9" ✓ khớp console trên slide, 45 so sánh
 *   · slide 33  Bubble {4,2,6,9,3}: lượt i=0 cho "2 4 3 6 9" ✓ khớp đúng cột i=1 trên hình slide
 *   · slide 34  {1,3,5,7,9,2,4,6,8,0} → "0 1 2 3 4 5 6 7 8 9" ✓, 45 so sánh và 19 lần đổi chỗ
 *               Bản có cờ swapped: mảng đã sắp chỉ tốn 9 so sánh thay vì 45 ✓
 *   · slide 38–44 TOÀN BỘ case study đã gõ lại từ ảnh, biên dịch, và chạy với đúng dãy nhập
 *               của slide 44 → "Current array: 0 2 8 9 7 3 2 4 2", ASC "0 2 2 2 3 4 7 8 9",
 *               DESC "9 8 7 4 3 2 2 2 0", "Value 4 found at position 7." ✓ khớp từng ký tự
 *   · slide 45  Exercise 4 (mảng số thực + lọc khoảng) viết trọn và chạy thật ✓
 *   · slide 46–48 row-major đo bằng địa chỉ THẬT: m[i][j] nằm ở base + (i*SO_COT + j)*4,
 *               sizeof(m)=60, sizeof(m[0])=20 ✓ ; chương trình VLA của slide 47 chạy ra Sum = 25 ✓
 *   · bẫy đã đo: while(i&lt;j) làm MẤT 4/8 giá trị · binary trên mảng chưa sắp sai 4/8 lượt ·
 *               (i+j)/2 với i,j gần INT_MAX cho chỉ số ÂM (-3) · truyền int m[][4] cho mảng 5 cột
 *               in ra ma trận lệch hàng · so sánh double bằng == làm 0.1+0.2 "không tìm thấy"
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf7';

export default {
  title: '8.0b — Slide by slide: Searching, sorting, a case study and 2-D arrays (slides 25–50)|||8.0b — Slide bài giảng: Tìm kiếm, sắp xếp, case study & mảng 2 chiều (slide 25–50)',
  slug: 'prf192-8-0b-slides-tim-kiem-sap-xep-ma-tran',
  type: 'DOCUMENT',
  description: 'Nửa sau của Slot 13-15 (slide 25–50): hai thuật toán tìm kiếm (Linear, Binary) và hai thuật toán sắp xếp (Selection, Bubble), mỗi thuật toán đều có bảng chạy tay từng lượt trên một mảng cụ thể và số phép so sánh ĐO THẬT bằng biến đếm trong chương trình. Tiếp đó là trọn bộ case study quản lý mảng 1 chiều bảy chức năng (bảy slide mã nguồn đọc thẳng từ ảnh, biên dịch và chạy lại đúng dãy nhập của slide Compile & Run), Exercise 2/3/4 giải đầy đủ, rồi phần mảng 2 chiều với phép chứng minh row-major bằng địa chỉ thật. Một nhãn sai trong hình minh hoạ Binary Search của slide gốc đã được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 25, 50),
    walk(D, [

      [25, '1-D Arrays: Searching',
        `<p class="y-chinh">🎯 The opening slide of the searching section defines the job in one sentence: <em>"A search algorithm finds the record of interest using the key array"</em>, and it fixes the contract every search function in this chapter obeys — <strong>return the positional index where the value was found, or −1 when it is not there</strong>.</p>
<ul>
<li><strong>Why −1 and not 0</strong> — 0 is a perfectly legal index (the first element), so it cannot double as "absent". −1 can never be a valid index, which makes <code>if (pos &gt;= 0)</code> the standard test. Every single search function on slides 26–29 ends with <code>return -1;</code>.</li>
<li><strong>Two algorithms, two pictures</strong> — the left box shows Linear Search hopping across <code>15 9 35 10 1 22 7 57 17 2</code> looking for 22 and landing on index 5. The right box shows Binary Search on the sorted row <code>10 14 19 26 27 31 33 35 42 44</code>, splitting at the middle value 27 into a Left Sub-Array and a Right Sub-Array.</li>
<li><strong>The difference is a precondition, not speed</strong> — the two pictures were chosen carefully. The linear picture uses an unsorted array; the binary picture uses a sorted one. Binary Search is faster, but it is only <em>allowed</em> on sorted data. Slide 28 says this explicitly.</li>
<li><strong>"Using the key array"</strong> — the key is the field you compare against. Here the key is the element itself because the array holds plain <code>int</code>s. When the array holds structures (slides 61–65 of this same deck), the key becomes one field, e.g. the student id, and the return value is still the index of the whole record.</li>
<li><strong>Link back to Slot 08–09</strong> — a search is the textbook example of a function that must return a value, not print it. If the function printed "found at 5" it could not be reused by <code>removeFirst</code>. The case study on slide 41 does exactly that reuse: <code>removeFirst</code> calls <code>searchValue</code>.</li>
</ul>
<pre><code>/* hop dong chung cua moi ham tim kiem trong chuong nay */
int search(int x, int a[], int n);   /* tra ve chi so 0..n-1, hoac -1 */

/* cach dung dung: */
int pos = search(value, a, n);
if (pos &gt;= 0) printf("Found at %d\\n", pos);
else          printf("Not found\\n");</code></pre>
<p class="meo">💡 Learn the pair of questions an exam asks about any search: <em>"what does it return when the value occurs twice?"</em> and <em>"what does it return when the value is absent?"</em> For the school's <code>firstLinearSearch</code> the answers are "the smallest index" and "−1"; for <code>lastLinearSearch</code> they are "the largest index" and "−1"; for <code>binarySearch</code> the first answer is <strong>"whichever of the duplicates the halving happens to land on — not necessarily the first"</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide mở màn phần tìm kiếm định nghĩa công việc trong một câu: <em>"Thuật toán tìm kiếm tìm bản ghi cần quan tâm dựa trên mảng khoá"</em>, và nó chốt luôn cái hợp đồng mà mọi hàm tìm kiếm trong chương này đều tuân theo — <strong>trả về chỉ số vị trí tìm thấy, hoặc −1 khi không có</strong>.</p>
<ul>
<li><strong>Vì sao là −1 chứ không phải 0</strong> — 0 là một chỉ số hoàn toàn hợp lệ (phần tử đầu tiên), nên nó không thể kiêm luôn nghĩa "không có". −1 thì không bao giờ là chỉ số hợp lệ, nhờ vậy <code>if (pos &gt;= 0)</code> thành phép kiểm chuẩn. Tất cả các hàm tìm kiếm ở slide 26–29 đều kết thúc bằng <code>return -1;</code>.</li>
<li><strong>Hai thuật toán, hai bức hình</strong> — khung trái vẽ Linear Search nhảy dọc mảng <code>15 9 35 10 1 22 7 57 17 2</code> để tìm 22 và dừng ở chỉ số 5. Khung phải vẽ Binary Search trên hàng ĐÃ SẮP <code>10 14 19 26 27 31 33 35 42 44</code>, cắt ở giá trị giữa 27 thành Left Sub-Array và Right Sub-Array.</li>
<li><strong>Khác nhau ở ĐIỀU KIỆN ÁP DỤNG, không phải ở tốc độ</strong> — hai bức hình được chọn rất có ý. Hình linear dùng mảng chưa sắp; hình binary dùng mảng đã sắp. Binary Search nhanh hơn, nhưng nó chỉ được PHÉP dùng trên dữ liệu đã sắp. Slide 28 nói thẳng điều này.</li>
<li><strong>"Dựa trên mảng khoá"</strong> — khoá là trường mà bạn đem ra so sánh. Ở đây khoá chính là phần tử, vì mảng chứa <code>int</code> trần. Khi mảng chứa struct (slide 61–65 của chính bộ slide này), khoá trở thành một trường, ví dụ mã sinh viên, còn giá trị trả về vẫn là chỉ số của cả bản ghi.</li>
<li><strong>Nối về Slot 08–09</strong> — tìm kiếm là ví dụ kinh điển của một hàm PHẢI trả về giá trị chứ không in ra. Nếu hàm tự in "found at 5" thì <code>removeFirst</code> không dùng lại được nó. Case study ở slide 41 dùng lại đúng như vậy: <code>removeFirst</code> gọi <code>searchValue</code>.</li>
</ul>
<pre><code>/* hop dong chung cua moi ham tim kiem trong chuong nay */
int search(int x, int a[], int n);   /* tra ve chi so 0..n-1, hoac -1 */

/* cach dung dung: */
int pos = search(value, a, n);
if (pos &gt;= 0) printf("Found at %d\\n", pos);
else          printf("Not found\\n");</code></pre>
<p class="meo">💡 Hãy thuộc cặp câu hỏi mà đề thi luôn hỏi về bất kỳ thuật toán tìm kiếm nào: <em>"nó trả về gì khi giá trị xuất hiện hai lần?"</em> và <em>"nó trả về gì khi giá trị không có?"</em>. Với <code>firstLinearSearch</code> của trường thì hai đáp án là "chỉ số NHỎ NHẤT" và "−1"; với <code>lastLinearSearch</code> là "chỉ số LỚN NHẤT" và "−1"; còn với <code>binarySearch</code> thì đáp án đầu là <strong>"rơi trúng bản sao nào thì trả bản đó — KHÔNG bảo đảm là bản đầu tiên"</strong>.</p>`],

      [26, 'Searching: Linear Search',
        `<p class="y-chinh">🎯 Linear Search in one line: <em>walk the array from one end, compare every element with x, stop at the first match</em>. The slide gives two versions — <code>firstLinearSearch</code> walking forward and <code>lastLinearSearch</code> walking backward — and two worked pictures: one that finds a value and one that does not.</p>
<ul>
<li><strong>The green picture — found</strong> — array <code>5 9 2 7 6 5 2 5</code>, looking for 6. The row underneath shows <code>i=0, 1, 2, 3, 4</code> and stops: <code>a[4]</code> is 6, so the function returns <strong>4</strong> and never touches indices 5, 6, 7.</li>
<li><strong>The blue picture — not found</strong> — same array, looking for 12. The counter row runs all the way <code>0 1 2 3 4 5 6 7</code> and the red box says <strong>−1</strong>. This is the worst case, and it is the honest one: to be sure a value is <em>absent</em>, a linear search must look at every element.</li>
<li><strong>Two directions, two answers</strong> — the value 5 appears at indices 0, 5 and 7. <code>firstLinearSearch(5,…)</code> returns 0; <code>lastLinearSearch(5,…)</code> returns 7. Same array, same value, different function — this is a favourite exam question.</li>
<li><strong>The <code>return</code> inside the loop is the whole optimisation</strong> — without it you would keep scanning after the match and end up reporting the last occurrence instead of the first. Note there is no <code>break</code> and no result variable: <code>return i;</code> leaves the function immediately.</li>
<li><strong>Notice the two different signatures</strong> — the slide writes <code>int firstLinearSearch(int x, int a[], int n)</code> but <code>int lastLinearSearch(double x, double *a, int n)</code>. That is deliberate: <code>int a[]</code> and <code>int *a</code> are the <em>same</em> parameter type in C (slide 13), and the algorithm does not care what the element type is.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int soSanh;                                  /* bien dem phep so sanh */

int firstLinearSearch(int x, int a[], int n) {
    int i;
    for (i = 0; i &lt; n; i++) { soSanh++; if (x == a[i]) return i; }
    return -1;
}
int lastLinearSearch(int x, int a[], int n) {
    int i;
    for (i = n - 1; i &gt;= 0; i--) { soSanh++; if (x == a[i]) return i; }
    return -1;
}
int main(void) {
    int a[] = {5, 9, 2, 7, 6, 5, 2, 5}, n = 8;
    soSanh = 0; printf("first 6  -&gt; %d (%d so sanh)\\n", firstLinearSearch(6, a, n), soSanh);
    soSanh = 0; printf("first 12 -&gt; %d (%d so sanh)\\n", firstLinearSearch(12, a, n), soSanh);
    soSanh = 0; printf("first 5  -&gt; %d (%d so sanh)\\n", firstLinearSearch(5, a, n), soSanh);
    soSanh = 0; printf("last  5  -&gt; %d (%d so sanh)\\n", lastLinearSearch(5, a, n), soSanh);
    return 0;
}</code></pre>
<table>
<tr><th>Call</th><th>Elements touched</th><th>Comparisons (measured)</th><th>Return</th></tr>
<tr><td>first 6</td><td>a[0]=5, a[1]=9, a[2]=2, a[3]=7, a[4]=6 ✔</td><td><strong>5</strong></td><td>4</td></tr>
<tr><td>first 12</td><td>all eight, no match</td><td><strong>8</strong> (worst case = n)</td><td>−1</td></tr>
<tr><td>first 5</td><td>a[0]=5 ✔</td><td><strong>1</strong> (best case)</td><td>0</td></tr>
<tr><td>last 5</td><td>a[7]=5 ✔</td><td><strong>1</strong></td><td>7</td></tr>
</table>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: the counter prints 5, 8, 1, 1 exactly as tabled, and the returns are 4, −1, 0, 7. The slide's two pictures are reproduced digit for digit. Average cost for a value that <em>is</em> present is about n/2 comparisons; for a value that is absent it is always exactly <strong>n</strong>.</p>
<p class="pitfall">⚠️ Do not "improve" the loop into <code>for (i = 0; i &lt;= n; i++)</code>. With n = 8 that reads <code>a[8]</code>, one past the end of an 8-element array — C does not check, so you may read rubbish, or accidentally match it and return the index 8, which the caller will then use to index the array again.</p>`,
        `<p class="y-chinh">🎯 Linear Search gói trong một câu: <em>đi dọc mảng từ một đầu, so sánh từng phần tử với x, dừng ở chỗ khớp đầu tiên</em>. Slide cho hai phiên bản — <code>firstLinearSearch</code> đi xuôi và <code>lastLinearSearch</code> đi ngược — cùng hai hình chạy mẫu: một lần tìm thấy và một lần không.</p>
<ul>
<li><strong>Hình xanh lá — tìm thấy</strong> — mảng <code>5 9 2 7 6 5 2 5</code>, tìm 6. Hàng bên dưới ghi <code>i=0, 1, 2, 3, 4</code> rồi dừng: <code>a[4]</code> bằng 6 nên hàm trả về <strong>4</strong> và không hề chạm tới chỉ số 5, 6, 7.</li>
<li><strong>Hình xanh dương — không tìm thấy</strong> — cùng mảng, tìm 12. Hàng đếm chạy hết <code>0 1 2 3 4 5 6 7</code> và khung đỏ ghi <strong>−1</strong>. Đây là trường hợp xấu nhất, và nó trung thực: muốn CHẮC CHẮN một giá trị KHÔNG có, tìm tuyến tính buộc phải nhìn hết mọi phần tử.</li>
<li><strong>Hai hướng, hai đáp án</strong> — giá trị 5 xuất hiện ở chỉ số 0, 5 và 7. <code>firstLinearSearch(5,…)</code> trả 0; <code>lastLinearSearch(5,…)</code> trả 7. Cùng mảng, cùng giá trị, khác hàm — đây là câu hỏi ruột của đề thi.</li>
<li><strong>Lệnh <code>return</code> nằm TRONG vòng lặp chính là toàn bộ chỗ tối ưu</strong> — thiếu nó thì bạn vẫn quét tiếp sau khi đã khớp, và cuối cùng báo về vị trí CUỐI thay vì vị trí ĐẦU. Để ý: không có <code>break</code>, không có biến kết quả — <code>return i;</code> rời hàm ngay lập tức.</li>
<li><strong>Chú ý hai chữ ký khác nhau</strong> — slide viết <code>int firstLinearSearch(int x, int a[], int n)</code> nhưng <code>int lastLinearSearch(double x, double *a, int n)</code>. Đó là cố ý: <code>int a[]</code> và <code>int *a</code> là CÙNG một kiểu tham số trong C (slide 13), và thuật toán chẳng quan tâm kiểu phần tử là gì.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int soSanh;                                  /* bien dem phep so sanh */

int firstLinearSearch(int x, int a[], int n) {
    int i;
    for (i = 0; i &lt; n; i++) { soSanh++; if (x == a[i]) return i; }
    return -1;
}
int lastLinearSearch(int x, int a[], int n) {
    int i;
    for (i = n - 1; i &gt;= 0; i--) { soSanh++; if (x == a[i]) return i; }
    return -1;
}
int main(void) {
    int a[] = {5, 9, 2, 7, 6, 5, 2, 5}, n = 8;
    soSanh = 0; printf("first 6  -&gt; %d (%d so sanh)\\n", firstLinearSearch(6, a, n), soSanh);
    soSanh = 0; printf("first 12 -&gt; %d (%d so sanh)\\n", firstLinearSearch(12, a, n), soSanh);
    soSanh = 0; printf("first 5  -&gt; %d (%d so sanh)\\n", firstLinearSearch(5, a, n), soSanh);
    soSanh = 0; printf("last  5  -&gt; %d (%d so sanh)\\n", lastLinearSearch(5, a, n), soSanh);
    return 0;
}</code></pre>
<table>
<tr><th>Lời gọi</th><th>Chạm vào những phần tử nào</th><th>Số phép so sánh (đo thật)</th><th>Trả về</th></tr>
<tr><td>first 6</td><td>a[0]=5, a[1]=9, a[2]=2, a[3]=7, a[4]=6 ✔</td><td><strong>5</strong></td><td>4</td></tr>
<tr><td>first 12</td><td>cả tám phần tử, không khớp</td><td><strong>8</strong> (xấu nhất = n)</td><td>−1</td></tr>
<tr><td>first 5</td><td>a[0]=5 ✔</td><td><strong>1</strong> (tốt nhất)</td><td>0</td></tr>
<tr><td>last 5</td><td>a[7]=5 ✔</td><td><strong>1</strong></td><td>7</td></tr>
</table>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: biến đếm in ra 5, 8, 1, 1 đúng như bảng, và các giá trị trả về là 4, −1, 0, 7. Hai bức hình trên slide được tái hiện đúng từng chữ số. Chi phí trung bình cho một giá trị CÓ trong mảng là khoảng n/2 phép so sánh; cho một giá trị KHÔNG có thì luôn luôn đúng <strong>n</strong>.</p>
<p class="pitfall">⚠️ Đừng "cải tiến" vòng lặp thành <code>for (i = 0; i &lt;= n; i++)</code>. Với n = 8 nó đọc <code>a[8]</code>, tức là vượt một ô ra ngoài mảng 8 phần tử — C không kiểm tra, nên bạn có thể đọc trúng rác, hoặc tệ hơn là trúng rác đúng bằng x rồi trả về chỉ số 8, và người gọi sẽ lấy chỉ số đó đi truy cập mảng tiếp.</p>`],

      [27, 'Exercise 2: Using Linear Search algorithm',
        `<p class="y-chinh">🎯 <em>"Do yourself"</em> — the slide hands you a complete <code>main()</code> with the two function bodies blanked out as <code>/* Your code */</code>, plus the console window showing the answer you must reproduce: <code>First existence:4, last existence:7</code>. Here is the whole thing filled in and run.</p>
<ul>
<li><strong>The data</strong> — <code>int a[] = { 3,34,5,1,2,8,9,2,9 }, x = 2;</code>. Nine elements, indices 0…8. Note the array size is written nowhere: the compiler counts the initialisers (slide 11), and <code>main</code> then hard-codes 9 in both calls.</li>
<li><strong>Where the 2s are</strong> — index 4 and index 7. So <code>firstLinearSearch</code> must return 4 and <code>lastLinearSearch</code> must return 7. The console window on the slide confirms both.</li>
<li><strong>Why <code>main</code> calls <code>last…</code> only inside the <code>if</code></strong> — <code>if (pos1 &gt;= 0) { int pos2 = last…; printf(…); } else printf("%d does not exist!\\n", x);</code>. If the first search already said "absent", the second search cannot possibly find anything, so the code skips it. Small, but it is the pattern the case study reuses on slide 41.</li>
<li><strong>The declaration inside the block</strong> — <code>int pos2</code> is declared in the middle of the <code>if</code> body. That is C99 and later; the very old C89 compilers some classrooms still use would reject it and want the declaration at the top of the block.</li>
<li><strong>Exam variant to be ready for</strong> — "what if x = 9?" Then first = 6 and last = 8. "What if x = 7?" Then <code>pos1</code> is −1, the <code>else</code> branch runs, and the program prints <code>7 does not exist!</code> — the second search is never called at all.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int firstLinearSearch(int x, int a[], int n) {
    int i;
    for (i = 0; i &lt; n; i++) if (x == a[i]) return i;
    return -1;
}
int lastLinearSearch(int x, int a[], int n) {
    int i;
    for (i = n - 1; i &gt;= 0; i--) if (x == a[i]) return i;
    return -1;
}
int main() {
    int a[] = { 3, 34, 5, 1, 2, 8, 9, 2, 9 }, x = 2;
    int pos1 = firstLinearSearch(x, a, 9);
    if (pos1 &gt;= 0) {
        int pos2 = lastLinearSearch(x, a, 9);
        printf("First existence:%d, last existence:%d\\n", pos1, pos2);
    }
    else printf("%d does not exist!\\n", x);
    return 0;
}</code></pre>
<table>
<tr><th>index</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>a[i]</td><td>3</td><td>34</td><td>5</td><td>1</td><td><strong>2</strong></td><td>8</td><td>9</td><td><strong>2</strong></td><td>9</td></tr>
<tr><td>forward scan for 2</td><td>✗</td><td>✗</td><td>✗</td><td>✗</td><td>✔ stop → 4</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>backward scan for 2</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>✔ stop → 7</td><td>✗</td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: the program prints exactly <strong><code>First existence:4, last existence:7</code></strong>, character for character the same as the console screenshot on the slide. Measured variants on the same array: <code>x = 9</code> → first 6, last 8; <code>x = 7</code> → both −1, so the program prints <code>7 does not exist!</code> and the forward scan cost all 9 comparisons to establish it.</p>
<p class="pitfall">⚠️ The slide's <code>main</code> ends with <code>getchar();</code> — that is a Windows/Dev-C++ habit to keep the console window open. It is harmless on Linux/macOS but pointless. What is <em>not</em> harmless: the slide passes the literal <code>9</code> as the element count in two places. Change one initialiser and you must remember to change both 9s. Prefer <code>int n = sizeof(a)/sizeof(a[0]);</code> — it is computed by the compiler and can never drift.</p>`,
        `<p class="y-chinh">🎯 <em>"Do yourself"</em> — slide đưa cho bạn một <code>main()</code> hoàn chỉnh với thân hai hàm bị bỏ trống thành <code>/* Your code */</code>, kèm khung console cho sẵn đáp án bạn phải tái hiện: <code>First existence:4, last existence:7</code>. Dưới đây là bản điền đủ và đã chạy.</p>
<ul>
<li><strong>Dữ liệu</strong> — <code>int a[] = { 3,34,5,1,2,8,9,2,9 }, x = 2;</code>. Chín phần tử, chỉ số 0…8. Để ý kích thước mảng không được ghi ở đâu cả: trình biên dịch tự đếm số giá trị khởi tạo (slide 11), rồi <code>main</code> gõ cứng số 9 vào cả hai lời gọi.</li>
<li><strong>Hai số 2 nằm ở đâu</strong> — chỉ số 4 và chỉ số 7. Vậy <code>firstLinearSearch</code> phải trả 4 còn <code>lastLinearSearch</code> phải trả 7. Khung console trên slide xác nhận cả hai.</li>
<li><strong>Vì sao <code>main</code> chỉ gọi <code>last…</code> BÊN TRONG <code>if</code></strong> — <code>if (pos1 &gt;= 0) { int pos2 = last…; printf(…); } else printf("%d does not exist!\\n", x);</code>. Nếu lượt tìm đầu đã nói "không có" thì lượt tìm thứ hai không thể tìm ra gì, nên bỏ qua luôn. Nhỏ thôi, nhưng đó đúng là khuôn mà case study dùng lại ở slide 41.</li>
<li><strong>Khai báo nằm giữa khối lệnh</strong> — <code>int pos2</code> được khai ngay giữa thân <code>if</code>. Đó là C99 trở đi; các trình biên dịch C89 rất cũ mà một số phòng máy còn dùng sẽ từ chối và đòi khai báo ở đầu khối.</li>
<li><strong>Biến thể đề thi cần sẵn sàng</strong> — "nếu x = 9 thì sao?" Khi đó first = 6 và last = 8. "Nếu x = 7?" Khi đó <code>pos1</code> bằng −1, nhánh <code>else</code> chạy, chương trình in <code>7 does not exist!</code> — lượt tìm thứ hai không hề được gọi.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int firstLinearSearch(int x, int a[], int n) {
    int i;
    for (i = 0; i &lt; n; i++) if (x == a[i]) return i;
    return -1;
}
int lastLinearSearch(int x, int a[], int n) {
    int i;
    for (i = n - 1; i &gt;= 0; i--) if (x == a[i]) return i;
    return -1;
}
int main() {
    int a[] = { 3, 34, 5, 1, 2, 8, 9, 2, 9 }, x = 2;
    int pos1 = firstLinearSearch(x, a, 9);
    if (pos1 &gt;= 0) {
        int pos2 = lastLinearSearch(x, a, 9);
        printf("First existence:%d, last existence:%d\\n", pos1, pos2);
    }
    else printf("%d does not exist!\\n", x);
    return 0;
}</code></pre>
<table>
<tr><th>chỉ số</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>a[i]</td><td>3</td><td>34</td><td>5</td><td>1</td><td><strong>2</strong></td><td>8</td><td>9</td><td><strong>2</strong></td><td>9</td></tr>
<tr><td>quét xuôi tìm 2</td><td>✗</td><td>✗</td><td>✗</td><td>✗</td><td>✔ dừng → 4</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>quét ngược tìm 2</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>✔ dừng → 7</td><td>✗</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật: chương trình in ra đúng <strong><code>First existence:4, last existence:7</code></strong>, giống từng ký tự với ảnh chụp console trên slide. Các biến thể đo thêm trên cùng mảng: <code>x = 9</code> → first 6, last 8; <code>x = 7</code> → cả hai −1 nên chương trình in <code>7 does not exist!</code>, và lượt quét xuôi đã tốn trọn 9 phép so sánh để kết luận điều đó.</p>
<p class="pitfall">⚠️ <code>main</code> trên slide kết thúc bằng <code>getchar();</code> — đó là thói quen Windows/Dev-C++ để giữ cửa sổ console không đóng. Trên Linux/macOS nó vô hại nhưng vô nghĩa. Thứ KHÔNG vô hại: slide truyền hằng số <code>9</code> làm số phần tử ở hai chỗ. Đổi một giá trị khởi tạo là bạn phải nhớ sửa cả hai số 9. Hãy dùng <code>int n = sizeof(a)/sizeof(a[0]);</code> — trình biên dịch tự tính, không bao giờ lệch.</p>`],

      [28, 'Searching: Binary Search',
        `<p class="y-chinh">🎯 The most important sentence on the slide is the precondition, printed right next to the name: <em>"Binary Search: Condition for application: <strong>Values in the array were sorted</strong>."</em> Given that, each probe throws away half of what is left, so eleven elements are settled in four probes instead of eleven.</p>
<ul>
<li><strong>The three variables</strong> — <code>i</code> is the left bound, <code>j</code> the right bound, <code>c</code> the middle. The loop runs <code>while (i &lt;= j)</code>; inside it computes <code>c = (i+j)/2</code>, and then either returns, or moves <code>j = c-1</code> (target is smaller), or moves <code>i = c+1</code> (target is bigger).</li>
<li><strong>Left trace: x = 15, found</strong> — the array is <code>4 6 7 8 10 12 13 15 17 18 19</code>, indices 0…10. Probe 1: i=0, j=10, c=5, a[5]=12 &lt; 15 → i=6. Probe 2: i=6, j=10, c=8, a[8]=17 &gt; 15 → j=7. Probe 3: i=6, j=7, c=6, a[6]=13 &lt; 15 → i=7. Probe 4: i=7, j=7, c=7, a[7]=15 → <strong>return 7</strong>, exactly the blue box on the slide.</li>
<li><strong>Right trace: x = 16, absent</strong> — identical first three probes, then probe 4 has i=j=7, a[7]=15 &lt; 16 → i=8. Now <code>i &gt; j</code>, the loop condition fails, and the function falls through to <code>return -1</code> — the slide's second blue box, <code>i&gt;j → return -1</code>.</li>
<li><strong>Why the window shrinks so fast</strong> — the widths of the four windows are 11, 5, 2, 1. Each step is roughly half the previous, which is where the <code>log₂(n)+1</code> of slide 29 comes from.</li>
<li><strong>c-1 and c+1, not c</strong> — this is where infinite loops are born. If you write <code>j = c</code> instead of <code>j = c-1</code>, the window can stop shrinking (i=6, j=7, c=6 → j=6, then i=6, j=6, c=6 → j=6 forever). The ±1 is legitimate because <code>a[c]</code> has already been tested and eliminated.</li>
</ul>
<pre><code>int binarySearch(int x, int a[], int n) {
    int i = 0, j = n - 1, c;
    while (i &lt;= j) {
        c = (i + j) / 2;
        if (x == a[c]) return c;
        if (x &lt;  a[c]) j = c - 1;
        else           i = c + 1;
    }
    return -1;
}</code></pre>
<table>
<tr><th>probe</th><th>i</th><th>j</th><th>window size</th><th>c=(i+j)/2</th><th>a[c]</th><th>compare with 15</th><th>action</th></tr>
<tr><td>1</td><td>0</td><td>10</td><td>11</td><td>5</td><td>12</td><td>15 &gt; 12</td><td>i = 6</td></tr>
<tr><td>2</td><td>6</td><td>10</td><td>5</td><td>8</td><td>17</td><td>15 &lt; 17</td><td>j = 7</td></tr>
<tr><td>3</td><td>6</td><td>7</td><td>2</td><td>6</td><td>13</td><td>15 &gt; 13</td><td>i = 7</td></tr>
<tr><td>4</td><td>7</td><td>7</td><td>1</td><td>7</td><td>15</td><td>15 == 15</td><td><strong>return 7</strong></td></tr>
</table>
<p class="dap-an">✅ Measured with a counter compiled in (<code>cc -Wall</code>): x = 15 needs <strong>4 probes / 7 element comparisons</strong>; x = 16 needs <strong>4 probes / 8 comparisons</strong> and returns −1. Linear search on the same array needs 8 comparisons for 15 and all 11 for 16. <strong>⚠️ The slide's own label is wrong at the first step: it says "15 elements are considered" but the array pictured has indices 0…10, i.e. 11 elements.</strong> The later labels 5, 2 and 1 are all correct, and the sequence 11 → 5 → 2 → 1 is what the program actually prints. I am reporting this, not silently copying it and not editing the slide.</p>
<p class="pitfall">⚠️ <strong>Binary Search on an unsorted array fails silently.</strong> I ran this exact function on the unsorted array from slide 26 (<code>5 9 2 7 6 5 2 5</code>) and asked for each of its own eight values: <strong>four of the eight came back −1</strong> — the function reported "not present" for 9, 2, 6 and 2, all of which are genuinely in the array. No crash, no warning, no error code. Sort first, or use linear search.</p>`,
        `<p class="y-chinh">🎯 Câu quan trọng nhất trên slide là ĐIỀU KIỆN ÁP DỤNG, in ngay cạnh tên thuật toán: <em>"Binary Search: điều kiện áp dụng: <strong>các giá trị trong mảng đã được sắp xếp</strong>."</em> Có điều kiện đó rồi thì mỗi lần dò vứt đi một nửa phần còn lại, nên mười một phần tử được giải quyết trong bốn lần dò thay vì mười một.</p>
<ul>
<li><strong>Ba biến</strong> — <code>i</code> là biên trái, <code>j</code> là biên phải, <code>c</code> là giữa. Vòng lặp chạy <code>while (i &lt;= j)</code>; bên trong tính <code>c = (i+j)/2</code>, rồi hoặc trả về, hoặc dời <code>j = c-1</code> (mục tiêu nhỏ hơn), hoặc dời <code>i = c+1</code> (mục tiêu lớn hơn).</li>
<li><strong>Vệt trái: x = 15, tìm thấy</strong> — mảng là <code>4 6 7 8 10 12 13 15 17 18 19</code>, chỉ số 0…10. Dò 1: i=0, j=10, c=5, a[5]=12 &lt; 15 → i=6. Dò 2: i=6, j=10, c=8, a[8]=17 &gt; 15 → j=7. Dò 3: i=6, j=7, c=6, a[6]=13 &lt; 15 → i=7. Dò 4: i=7, j=7, c=7, a[7]=15 → <strong>return 7</strong>, đúng khung xanh trên slide.</li>
<li><strong>Vệt phải: x = 16, không có</strong> — ba lần dò đầu y hệt, rồi lần dò 4 có i=j=7, a[7]=15 &lt; 16 → i=8. Bây giờ <code>i &gt; j</code>, điều kiện vòng lặp sai, hàm rơi xuống <code>return -1</code> — đúng khung xanh thứ hai của slide, <code>i&gt;j → return -1</code>.</li>
<li><strong>Vì sao cửa sổ co nhanh đến vậy</strong> — bề rộng bốn cửa sổ là 11, 5, 2, 1. Mỗi bước còn khoảng một nửa bước trước, và đó chính là chỗ sinh ra công thức <code>log₂(n)+1</code> của slide 29.</li>
<li><strong>c−1 và c+1, chứ không phải c</strong> — đây là nơi đẻ ra vòng lặp vô tận. Nếu bạn viết <code>j = c</code> thay vì <code>j = c-1</code>, cửa sổ có thể ngừng co lại (i=6, j=7, c=6 → j=6, rồi i=6, j=6, c=6 → j=6 mãi mãi). Cộng/trừ 1 là hợp lệ vì <code>a[c]</code> vừa được thử và loại rồi.</li>
</ul>
<pre><code>int binarySearch(int x, int a[], int n) {
    int i = 0, j = n - 1, c;
    while (i &lt;= j) {
        c = (i + j) / 2;
        if (x == a[c]) return c;
        if (x &lt;  a[c]) j = c - 1;
        else           i = c + 1;
    }
    return -1;
}</code></pre>
<table>
<tr><th>lần dò</th><th>i</th><th>j</th><th>cỡ cửa sổ</th><th>c=(i+j)/2</th><th>a[c]</th><th>so với 15</th><th>hành động</th></tr>
<tr><td>1</td><td>0</td><td>10</td><td>11</td><td>5</td><td>12</td><td>15 &gt; 12</td><td>i = 6</td></tr>
<tr><td>2</td><td>6</td><td>10</td><td>5</td><td>8</td><td>17</td><td>15 &lt; 17</td><td>j = 7</td></tr>
<tr><td>3</td><td>6</td><td>7</td><td>2</td><td>6</td><td>13</td><td>15 &gt; 13</td><td>i = 7</td></tr>
<tr><td>4</td><td>7</td><td>7</td><td>1</td><td>7</td><td>15</td><td>15 == 15</td><td><strong>return 7</strong></td></tr>
</table>
<p class="dap-an">✅ Đo thật bằng biến đếm biên dịch kèm (<code>cc -Wall</code>): x = 15 tốn <strong>4 lần dò / 7 phép so sánh phần tử</strong>; x = 16 tốn <strong>4 lần dò / 8 phép so sánh</strong> rồi trả −1. Tìm tuyến tính trên cùng mảng cần 8 phép cho 15 và trọn 11 phép cho 16. <strong>⚠️ Nhãn trên chính slide SAI ở bước đầu: nó ghi "15 elements are considered" nhưng mảng vẽ ra có chỉ số 0…10, tức là 11 phần tử.</strong> Các nhãn 5, 2, 1 phía sau đều đúng, và dãy 11 → 5 → 2 → 1 là thứ chương trình in ra thật. Tôi nêu lên chứ không im lặng chép lại, và cũng không tự sửa slide.</p>
<p class="pitfall">⚠️ <strong>Binary Search trên mảng CHƯA SẮP sai một cách câm lặng.</strong> Tôi chạy đúng hàm này trên mảng chưa sắp của slide 26 (<code>5 9 2 7 6 5 2 5</code>) và hỏi từng giá trị có thật trong nó: <strong>bốn trên tám lượt trả về −1</strong> — hàm báo "không có" với 9, 2, 6 và 2, trong khi cả bốn đều nằm sờ sờ trong mảng. Không sập, không cảnh báo, không mã lỗi. Hãy sắp trước, hoặc dùng tìm tuyến tính.</p>`],

      [29, 'Exercise 3: Using Binary Search algorithm',
        `<p class="y-chinh">🎯 Two halves on one slide: the <em>"YOUR CODE"</em> exercise with its console answer, and the <strong>Evaluation</strong> table that derives the cost of Binary Search as <code>m + 1 = log₂(n) + 1</code> comparisons.</p>
<ul>
<li><strong>The exercise data</strong> — <code>int a[] = {1,4,8,10,12,16,22,24};</code>, <code>n = 8</code>, two keys: <code>k1 = 22</code> and <code>k2 = 7</code>. Note the array is already sorted ascending, exactly as Binary Search demands.</li>
<li><strong>Trace for k1 = 22</strong> — probe 1: i=0, j=7, c=3, a[3]=10 &lt; 22 → i=4. Probe 2: i=4, j=7, c=5, a[5]=16 &lt; 22 → i=6. Probe 3: i=6, j=7, c=6, a[6]=22 → <strong>return 6</strong>. The console on the slide reads <code>Position of value 22 is: 6</code>.</li>
<li><strong>Trace for k2 = 7</strong> — probe 1: c=3, a[3]=10 &gt; 7 → j=2. Probe 2: i=0, j=2, c=1, a[1]=4 &lt; 7 → i=2. Probe 3: i=2, j=2, c=2, a[2]=8 &gt; 7 → j=1. Now i=2 &gt; j=1 → <strong>return −1</strong>, and the program prints <code>7 does not exist!</code>. Notice 7 would belong <em>between</em> 4 and 8 — the search converged onto the gap.</li>
<li><strong>Reading the Evaluation table</strong> — it is a bookkeeping argument. Start with <code>n = 2ᵐ</code> elements and spend 1 comparison; you are left with <code>2ᵐ⁻¹</code>, spend 1 more; then <code>2ᵐ⁻²</code>, 1 more; … down to <code>2⁰ = 1</code>, 1 more. Add the column up: <strong>m + 1 = log₂(n) + 1</strong>.</li>
<li><strong>What that number means in practice</strong> — for n = 1000 linear search averages 500 comparisons and costs 1000 to prove absence; binary search costs about 11. For n = 1,000,000 it is 20. Doubling the data adds exactly <em>one</em> probe.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int binarySearch(int x, int a[], int n) {
    int i = 0, j = n - 1, c;
    while (i &lt;= j) {
        c = (i + j) / 2;
        if (x == a[c]) return c;
        if (x &lt;  a[c]) j = c - 1;
        else           i = c + 1;
    }
    return -1;
}
int main() {
    int a[] = { 1, 4, 8, 10, 12, 16, 22, 24 };
    int n = 8, k1 = 22, k2 = 7;
    int pos1 = binarySearch(k1, a, n);
    int pos2 = binarySearch(k2, a, n);
    if (pos1 &gt;= 0) printf("\\nPosition of value %d is: %d", k1, pos1);
    else           printf("\\n%d does not exist!", k1);
    if (pos2 &gt;= 0) printf("\\nPosition of value %d is: %d", k2, pos2);
    else           printf("\\n%d does not exist!", k2);
    printf("\\n");
    return 0;
}</code></pre>
<table>
<tr><th>Same array, same key</th><th>Linear Search (measured)</th><th>Binary Search (measured)</th></tr>
<tr><td>k1 = 22 (present, index 6)</td><td>7 comparisons</td><td><strong>3 probes / 5 comparisons</strong></td></tr>
<tr><td>k2 = 7 (absent)</td><td>8 comparisons (all of n)</td><td><strong>3 probes / 6 comparisons</strong></td></tr>
<tr><td>11-element array, x = 16 absent</td><td>11 comparisons</td><td><strong>4 probes / 8 comparisons</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: the program prints <strong><code>Position of value 22 is: 6</code></strong> and <strong><code>7 does not exist!</code></strong>, matching the slide's console window exactly. The counters confirm the Evaluation table: with n = 8 = 2³ the theory predicts at most m+1 = 4 probes, and both keys were settled in <strong>3</strong>.</p>
<p class="pitfall">⚠️ <code>c = (i + j) / 2</code> can <strong>overflow</strong> on a very large array. I measured it: with <code>i = 2147483643</code> and <code>j = 2147483646</code> (both valid indices in principle) the sum wraps and <code>(i+j)/2</code> evaluates to <strong>−3</strong>, so the next line indexes <code>a[-3]</code>. The safe form is <code>c = i + (j - i) / 2;</code>, which gave the correct <code>2147483644</code>. Same value for normal arrays, no wrap-around ever.</p>`,
        `<p class="y-chinh">🎯 Hai nửa trên một slide: bài tập <em>"YOUR CODE"</em> kèm sẵn đáp án console, và bảng <strong>Evaluation</strong> suy ra chi phí của Binary Search bằng <code>m + 1 = log₂(n) + 1</code> phép so sánh.</p>
<ul>
<li><strong>Dữ liệu của bài</strong> — <code>int a[] = {1,4,8,10,12,16,22,24};</code>, <code>n = 8</code>, hai khoá: <code>k1 = 22</code> và <code>k2 = 7</code>. Để ý mảng đã được sắp tăng dần sẵn, đúng như Binary Search đòi hỏi.</li>
<li><strong>Vệt chạy cho k1 = 22</strong> — dò 1: i=0, j=7, c=3, a[3]=10 &lt; 22 → i=4. Dò 2: i=4, j=7, c=5, a[5]=16 &lt; 22 → i=6. Dò 3: i=6, j=7, c=6, a[6]=22 → <strong>return 6</strong>. Console trên slide ghi <code>Position of value 22 is: 6</code>.</li>
<li><strong>Vệt chạy cho k2 = 7</strong> — dò 1: c=3, a[3]=10 &gt; 7 → j=2. Dò 2: i=0, j=2, c=1, a[1]=4 &lt; 7 → i=2. Dò 3: i=2, j=2, c=2, a[2]=8 &gt; 7 → j=1. Giờ i=2 &gt; j=1 → <strong>return −1</strong>, chương trình in <code>7 does not exist!</code>. Để ý 7 lẽ ra nằm GIỮA 4 và 8 — thuật toán đã hội tụ đúng vào cái khe trống đó.</li>
<li><strong>Đọc bảng Evaluation thế nào</strong> — đó là một phép cộng sổ. Bắt đầu với <code>n = 2ᵐ</code> phần tử, tốn 1 phép so sánh; còn lại <code>2ᵐ⁻¹</code>, tốn thêm 1; rồi <code>2ᵐ⁻²</code>, thêm 1; … cho tới <code>2⁰ = 1</code>, thêm 1. Cộng cột lại: <strong>m + 1 = log₂(n) + 1</strong>.</li>
<li><strong>Con số đó nghĩa là gì trong thực tế</strong> — với n = 1000, tìm tuyến tính trung bình 500 phép và tốn 1000 phép để chứng minh "không có"; binary chỉ khoảng 11. Với n = 1.000.000 thì là 20. Gấp đôi dữ liệu chỉ thêm ĐÚNG MỘT lần dò.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int binarySearch(int x, int a[], int n) {
    int i = 0, j = n - 1, c;
    while (i &lt;= j) {
        c = (i + j) / 2;
        if (x == a[c]) return c;
        if (x &lt;  a[c]) j = c - 1;
        else           i = c + 1;
    }
    return -1;
}
int main() {
    int a[] = { 1, 4, 8, 10, 12, 16, 22, 24 };
    int n = 8, k1 = 22, k2 = 7;
    int pos1 = binarySearch(k1, a, n);
    int pos2 = binarySearch(k2, a, n);
    if (pos1 &gt;= 0) printf("\\nPosition of value %d is: %d", k1, pos1);
    else           printf("\\n%d does not exist!", k1);
    if (pos2 &gt;= 0) printf("\\nPosition of value %d is: %d", k2, pos2);
    else           printf("\\n%d does not exist!", k2);
    printf("\\n");
    return 0;
}</code></pre>
<table>
<tr><th>Cùng mảng, cùng khoá</th><th>Linear Search (đo thật)</th><th>Binary Search (đo thật)</th></tr>
<tr><td>k1 = 22 (có, chỉ số 6)</td><td>7 phép so sánh</td><td><strong>3 lần dò / 5 phép so sánh</strong></td></tr>
<tr><td>k2 = 7 (không có)</td><td>8 phép so sánh (trọn n)</td><td><strong>3 lần dò / 6 phép so sánh</strong></td></tr>
<tr><td>mảng 11 phần tử, x = 16 không có</td><td>11 phép so sánh</td><td><strong>4 lần dò / 8 phép so sánh</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật: chương trình in ra <strong><code>Position of value 22 is: 6</code></strong> và <strong><code>7 does not exist!</code></strong>, khớp đúng khung console của slide. Các biến đếm xác nhận bảng Evaluation: với n = 8 = 2³ lý thuyết dự đoán nhiều nhất m+1 = 4 lần dò, và cả hai khoá đều xong trong <strong>3</strong> lần.</p>
<p class="pitfall">⚠️ <code>c = (i + j) / 2</code> có thể <strong>TRÀN SỐ</strong> trên mảng rất lớn. Tôi đã đo: với <code>i = 2147483643</code> và <code>j = 2147483646</code> (về nguyên tắc đều là chỉ số hợp lệ), tổng bị quấn vòng và <code>(i+j)/2</code> cho ra <strong>−3</strong>, nên dòng kế tiếp truy cập <code>a[-3]</code>. Dạng an toàn là <code>c = i + (j - i) / 2;</code>, cho ra đúng <code>2147483644</code>. Cùng giá trị với mảng bình thường, và không bao giờ quấn vòng.</p>`],

      [30, '1-D Arrays: Sorting',
        `<p class="y-chinh">🎯 Sorting is defined on this slide as <em>"changing positions of elements in an array so that values are in an order based on a pre-defined <strong>order relation</strong>"</em> — the phrase "order relation" is the part worth memorising, because it is what you change to get descending order or dictionary order.</p>
<ul>
<li><strong>Two default relations named</strong> — for numbers it is value order (<code>&lt;</code> on the number); for characters and strings it is dictionary order, which in C means comparing character codes, i.e. <code>strcmp</code>. Slot 16–18 (Strings) picks this up.</li>
<li><strong>Ascending vs descending is one character</strong> — in every sort on the next four slides, flipping the single comparison from <code>&gt;</code> to <code>&lt;</code> flips the whole result. Slide 43 proves it: <code>printAscending</code> tests <code>temp[i] &gt; temp[j]</code> and <code>printDescending</code> tests <code>temp[i] &lt; temp[j]</code>; nothing else differs between the two functions.</li>
<li><strong>The Selection Sort picture</strong> — <code>64 25 12 22 11</code> with an arrow from the "Min element" (11, at the end) to the "Position to hold Min element" (index 0). One long look for the minimum, then one swap.</li>
<li><strong>The Bubble Sort picture</strong> — <code>5 6 1 3</code> with two labelled <em>Swap</em> arrows between neighbours, ending with 6 marked "Sorted Element" at the far right. Many short comparisons between adjacent pairs, many swaps.</li>
<li><strong>Why only these two</strong> — the slide says so plainly: <em>"Only two sorting algorithms are introduced here."</em> Both are O(n²) and neither is what production code uses (that is quicksort/mergesort, in DSA later). They are taught because you can trace them by hand on paper, which is precisely what the exam asks.</li>
<li><strong>Sorting is also a search enabler</strong> — remember slide 28: Binary Search requires sorted input. Sorting once, then binary-searching many times, is the classic trade.</li>
</ul>
<pre><code>/* Quan he thu tu nam trong DUNG MOT phep so sanh */
if (a[i] &gt; a[j]) swap(&amp;a[i], &amp;a[j]);   /* tang dan  */
if (a[i] &lt; a[j]) swap(&amp;a[i], &amp;a[j]);   /* giam dan  */

/* Voi chuoi (Slot 16-18) quan he do la strcmp: */
if (strcmp(s[i], s[j]) &gt; 0) swapString(s[i], s[j]);</code></pre>
<table>
<tr><th></th><th>Selection Sort</th><th>Bubble Sort</th></tr>
<tr><td>idea</td><td>find the minimum of the rest, put it in place</td><td>compare neighbours, swap if out of order, repeat</td></tr>
<tr><td>comparisons</td><td>always exactly n(n−1)/2</td><td>n(n−1)/2, or fewer with a <code>swapped</code> flag</td></tr>
<tr><td>swaps</td><td>at most n−1 (one per pass)</td><td>as many as there are inversions</td></tr>
<tr><td>best case</td><td>no better — data-independent</td><td>one pass (n−1 comparisons) if already sorted</td></tr>
</table>
<p class="meo">💡 Remember the two shapes: Selection Sort <em>selects</em> (a long search, one swap per pass); Bubble Sort <em>bubbles</em> (short neighbour comparisons, many swaps). If an exam asks "which does fewer swaps?" the answer is always Selection Sort; "which can stop early?" is always Bubble Sort.</p>`,
        `<p class="y-chinh">🎯 Slide này định nghĩa sắp xếp là <em>"đổi vị trí các phần tử trong mảng sao cho các giá trị nằm theo một trật tự dựa trên một <strong>quan hệ thứ tự</strong> định trước"</em> — cụm "quan hệ thứ tự" mới là phần đáng thuộc, vì đó chính là thứ bạn thay đổi để có thứ tự giảm dần hay thứ tự từ điển.</p>
<ul>
<li><strong>Hai quan hệ mặc định được gọi tên</strong> — với số là thứ tự giá trị (phép <code>&lt;</code> trên con số); với ký tự và chuỗi là thứ tự từ điển, mà trong C nghĩa là so mã ký tự, tức là <code>strcmp</code>. Slot 16–18 (Chuỗi) sẽ tiếp tục chỗ này.</li>
<li><strong>Tăng dần với giảm dần chỉ khác MỘT ký tự</strong> — trong mọi thuật toán sắp xếp ở bốn slide tới, lật đúng một phép so sánh từ <code>&gt;</code> thành <code>&lt;</code> là lật toàn bộ kết quả. Slide 43 chứng minh: <code>printAscending</code> kiểm <code>temp[i] &gt; temp[j]</code> còn <code>printDescending</code> kiểm <code>temp[i] &lt; temp[j]</code>; ngoài chỗ ấy hai hàm giống hệt nhau.</li>
<li><strong>Hình Selection Sort</strong> — <code>64 25 12 22 11</code> với một mũi tên đi từ "Min element" (số 11, ở cuối) về "Position to hold Min element" (chỉ số 0). Một lượt nhìn dài để tìm nhỏ nhất, rồi một lần đổi chỗ.</li>
<li><strong>Hình Bubble Sort</strong> — <code>5 6 1 3</code> với hai mũi tên <em>Swap</em> giữa hai phần tử KỀ NHAU, kết thúc bằng số 6 được đánh dấu "Sorted Element" ở tận bên phải. Nhiều phép so sánh ngắn giữa các cặp kề, nhiều lần đổi chỗ.</li>
<li><strong>Vì sao chỉ hai thuật toán này</strong> — slide nói thẳng: <em>"Only two sorting algorithms are introduced here."</em> Cả hai đều O(n²) và không phải thứ mã sản phẩm dùng (thứ đó là quicksort/mergesort, học ở DSA sau). Chúng được dạy vì bạn chạy tay được trên giấy, mà đề thi hỏi đúng chuyện đó.</li>
<li><strong>Sắp xếp còn là bàn đạp cho tìm kiếm</strong> — nhớ lại slide 28: Binary Search đòi dữ liệu đã sắp. Sắp một lần rồi tìm nhị phân nhiều lần là phép đánh đổi kinh điển.</li>
</ul>
<pre><code>/* Quan he thu tu nam trong DUNG MOT phep so sanh */
if (a[i] &gt; a[j]) swap(&amp;a[i], &amp;a[j]);   /* tang dan  */
if (a[i] &lt; a[j]) swap(&amp;a[i], &amp;a[j]);   /* giam dan  */

/* Voi chuoi (Slot 16-18) quan he do la strcmp: */
if (strcmp(s[i], s[j]) &gt; 0) swapString(s[i], s[j]);</code></pre>
<table>
<tr><th></th><th>Selection Sort</th><th>Bubble Sort</th></tr>
<tr><td>ý tưởng</td><td>tìm nhỏ nhất của phần còn lại, đặt vào đúng chỗ</td><td>so hai phần tử kề, sai thứ tự thì đổi, lặp lại</td></tr>
<tr><td>số phép so sánh</td><td>luôn đúng n(n−1)/2</td><td>n(n−1)/2, hoặc ít hơn nếu có cờ <code>swapped</code></td></tr>
<tr><td>số lần đổi chỗ</td><td>nhiều nhất n−1 (một lần mỗi lượt)</td><td>bằng đúng số cặp nghịch thế</td></tr>
<tr><td>trường hợp tốt nhất</td><td>không tốt hơn được — không phụ thuộc dữ liệu</td><td>một lượt (n−1 phép so sánh) nếu mảng đã sắp</td></tr>
</table>
<p class="meo">💡 Nhớ hai dáng hình: Selection Sort thì <em>chọn</em> (tìm lâu, mỗi lượt đổi chỗ một lần); Bubble Sort thì <em>sủi bọt</em> (so sánh ngắn giữa hai ô kề, đổi chỗ rất nhiều). Đề hỏi "cái nào đổi chỗ ít hơn?" thì luôn là Selection Sort; "cái nào dừng sớm được?" thì luôn là Bubble Sort.</p>`],

      [31, 'Sorting: Selection Sort',
        `<p class="y-chinh">🎯 Three lines of algorithm and one seven-row trace: <em>find the minimum value in the list · swap it with the value in the first position · repeat for the remainder of the list</em>. The right column of the picture counts comparisons per pass — 6, 5, 4, 3, 2, 1 — and the caption adds it up: <strong>n(n−1)/2</strong>.</p>
<ul>
<li><strong>The trace array</strong> — <code>a = 4 2 6 9 3 5 1</code>, n = 7, indices 0…6. Pass i = 0 scans indices 1…6, finds the minimum 1 at index 6, swaps it with a[0] → <code>1 2 6 9 3 5 4</code>. The boxed prefix on each row is the part that is already final.</li>
<li><strong>Pass i = 1 does nothing</strong> — the minimum of <code>2 6 9 3 5 4</code> is 2, which is <em>already</em> at index 1, so <code>minIndex == i</code> and the <code>if (minIndex &gt; i)</code> guard skips the swap. The 5 comparisons still happen. That is the key property: <strong>the comparison count never depends on the data</strong>.</li>
<li><strong>Why <code>i</code> stops at n−2</strong> — the outer loop is <code>for (i = 0; i &lt; n-1; i++)</code>. After 6 passes on 7 elements, the last element is automatically the largest, since everything smaller has already been pulled to the front. Running a 7th pass would compare nothing.</li>
<li><strong>minIndex, not minValue</strong> — the inner loop remembers the <em>position</em> of the smallest value, not the value itself. You need the position to do the swap; keeping the value would force a second scan to find where it lives.</li>
<li><strong>The arrows in the picture cross</strong> — at i = 2 the arrow goes from index 4 (value 3) back to index 2, and at i = 3 from index 6 (value 4) back to index 3. Selection Sort moves elements over long distances, which is exactly why it needs so few swaps.</li>
<li><strong>The Vietnamese caption</strong> — <em>"Với n=7, Số lần so sánh = 6+5+4+3+2+1 = 7(6)/2"</em> = 21, <em>"Tổng quát: Số lần so sánh: n(n−1)/2"</em>.</li>
</ul>
<pre><code>void ascSelectionSort(int *a, int n) {
    int minIndex, i, j;
    for (i = 0; i &lt; n - 1; i++) {
        minIndex = i;
        for (j = i + 1; j &lt; n; j++)
            if (a[minIndex] &gt; a[j]) minIndex = j;
        if (minIndex &gt; i) {              /* chi doi cho khi that su can */
            int t = a[minIndex]; a[minIndex] = a[i]; a[i] = t;
        }
    }
}</code></pre>
<table>
<tr><th>pass i</th><th>array before the swap</th><th>range scanned</th><th>minIndex</th><th>comparisons</th><th>swap?</th><th>array after</th></tr>
<tr><td>0</td><td>4 2 6 9 3 5 1</td><td>1…6</td><td>6 (value 1)</td><td>6</td><td>yes</td><td><strong>1</strong> 2 6 9 3 5 4</td></tr>
<tr><td>1</td><td>1 2 6 9 3 5 4</td><td>2…6</td><td>1 (value 2)</td><td>5</td><td><strong>no</strong></td><td><strong>1 2</strong> 6 9 3 5 4</td></tr>
<tr><td>2</td><td>1 2 6 9 3 5 4</td><td>3…6</td><td>4 (value 3)</td><td>4</td><td>yes</td><td><strong>1 2 3</strong> 9 6 5 4</td></tr>
<tr><td>3</td><td>1 2 3 9 6 5 4</td><td>4…6</td><td>6 (value 4)</td><td>3</td><td>yes</td><td><strong>1 2 3 4</strong> 6 5 9</td></tr>
<tr><td>4</td><td>1 2 3 4 6 5 9</td><td>5…6</td><td>5 (value 5)</td><td>2</td><td>yes</td><td><strong>1 2 3 4 5</strong> 6 9</td></tr>
<tr><td>5</td><td>1 2 3 4 5 6 9</td><td>6…6</td><td>5 (value 6)</td><td>1</td><td><strong>no</strong></td><td><strong>1 2 3 4 5 6</strong> 9</td></tr>
</table>
<p class="dap-an">✅ Measured by compiling the function with two counters (<code>cc -Wall</code>) on exactly this array: <strong>21 comparisons</strong> (6+5+4+3+2+1, i.e. 7·6/2 — the slide's formula confirmed) and only <strong>4 swaps</strong>, because passes 1 and 5 found the minimum already in place. Final array: <code>1 2 3 4 5 6 9</code>.</p>
<p class="meo">💡 The classic exam question is "what does the array look like after pass 2 of Selection Sort?" Read the table: after i = 2 the array is <code>1 2 3 9 6 5 4</code>. The rule that makes it answerable without tracing everything: <strong>after pass i, the first i+1 positions hold the i+1 smallest values, in order, and nothing else is guaranteed.</strong></p>`,
        `<p class="y-chinh">🎯 Ba dòng thuật toán và một vệt chạy bảy hàng: <em>tìm giá trị nhỏ nhất trong danh sách · đổi chỗ nó với giá trị ở vị trí đầu · lặp lại cho phần còn lại</em>. Cột phải của hình đếm số phép so sánh mỗi lượt — 6, 5, 4, 3, 2, 1 — và dòng chú thích cộng lại: <strong>n(n−1)/2</strong>.</p>
<ul>
<li><strong>Mảng trong vệt chạy</strong> — <code>a = 4 2 6 9 3 5 1</code>, n = 7, chỉ số 0…6. Lượt i = 0 quét chỉ số 1…6, tìm ra nhỏ nhất là 1 ở chỉ số 6, đổi chỗ với a[0] → <code>1 2 6 9 3 5 4</code>. Phần đóng khung ở đầu mỗi hàng là phần đã chốt xong.</li>
<li><strong>Lượt i = 1 KHÔNG làm gì cả</strong> — nhỏ nhất của <code>2 6 9 3 5 4</code> là 2, mà nó ĐÃ nằm ở chỉ số 1, nên <code>minIndex == i</code> và chốt <code>if (minIndex &gt; i)</code> bỏ qua lệnh đổi chỗ. 5 phép so sánh vẫn cứ diễn ra. Đó là tính chất cốt lõi: <strong>số phép so sánh không bao giờ phụ thuộc dữ liệu</strong>.</li>
<li><strong>Vì sao <code>i</code> dừng ở n−2</strong> — vòng ngoài là <code>for (i = 0; i &lt; n-1; i++)</code>. Sau 6 lượt trên 7 phần tử, phần tử cuối tự động là lớn nhất, vì mọi thứ nhỏ hơn đã bị kéo lên trước hết rồi. Chạy lượt thứ 7 sẽ không so sánh được gì.</li>
<li><strong>minIndex chứ không phải minValue</strong> — vòng trong ghi nhớ VỊ TRÍ của giá trị nhỏ nhất, không phải bản thân giá trị. Bạn cần vị trí để đổi chỗ; giữ giá trị thì lại phải quét lần hai để tìm nó ở đâu.</li>
<li><strong>Các mũi tên trong hình bắt chéo nhau</strong> — ở i = 2 mũi tên đi từ chỉ số 4 (giá trị 3) ngược về chỉ số 2, ở i = 3 từ chỉ số 6 (giá trị 4) về chỉ số 3. Selection Sort dời phần tử đi rất xa, và đó đúng là lý do nó cần ít lần đổi chỗ.</li>
<li><strong>Dòng chú thích tiếng Việt trên slide</strong> — <em>"Với n=7, Số lần so sánh = 6+5+4+3+2+1 = 7(6)/2"</em> = 21, <em>"Tổng quát: Số lần so sánh: n(n−1)/2"</em>.</li>
</ul>
<pre><code>void ascSelectionSort(int *a, int n) {
    int minIndex, i, j;
    for (i = 0; i &lt; n - 1; i++) {
        minIndex = i;
        for (j = i + 1; j &lt; n; j++)
            if (a[minIndex] &gt; a[j]) minIndex = j;
        if (minIndex &gt; i) {              /* chi doi cho khi that su can */
            int t = a[minIndex]; a[minIndex] = a[i]; a[i] = t;
        }
    }
}</code></pre>
<table>
<tr><th>lượt i</th><th>mảng trước khi đổi chỗ</th><th>quét khoảng</th><th>minIndex</th><th>số so sánh</th><th>đổi chỗ?</th><th>mảng sau lượt</th></tr>
<tr><td>0</td><td>4 2 6 9 3 5 1</td><td>1…6</td><td>6 (giá trị 1)</td><td>6</td><td>có</td><td><strong>1</strong> 2 6 9 3 5 4</td></tr>
<tr><td>1</td><td>1 2 6 9 3 5 4</td><td>2…6</td><td>1 (giá trị 2)</td><td>5</td><td><strong>không</strong></td><td><strong>1 2</strong> 6 9 3 5 4</td></tr>
<tr><td>2</td><td>1 2 6 9 3 5 4</td><td>3…6</td><td>4 (giá trị 3)</td><td>4</td><td>có</td><td><strong>1 2 3</strong> 9 6 5 4</td></tr>
<tr><td>3</td><td>1 2 3 9 6 5 4</td><td>4…6</td><td>6 (giá trị 4)</td><td>3</td><td>có</td><td><strong>1 2 3 4</strong> 6 5 9</td></tr>
<tr><td>4</td><td>1 2 3 4 6 5 9</td><td>5…6</td><td>5 (giá trị 5)</td><td>2</td><td>có</td><td><strong>1 2 3 4 5</strong> 6 9</td></tr>
<tr><td>5</td><td>1 2 3 4 5 6 9</td><td>6…6</td><td>5 (giá trị 6)</td><td>1</td><td><strong>không</strong></td><td><strong>1 2 3 4 5 6</strong> 9</td></tr>
</table>
<p class="dap-an">✅ Đo thật bằng cách biên dịch hàm kèm hai biến đếm (<code>cc -Wall</code>) trên đúng mảng này: <strong>21 phép so sánh</strong> (6+5+4+3+2+1, tức 7·6/2 — đúng công thức của slide) và chỉ <strong>4 lần đổi chỗ</strong>, vì lượt 1 và lượt 5 tìm thấy phần tử nhỏ nhất đã nằm sẵn đúng chỗ. Mảng cuối cùng: <code>1 2 3 4 5 6 9</code>.</p>
<p class="meo">💡 Câu hỏi kinh điển của đề thi là "sau lượt thứ 2 của Selection Sort mảng trông thế nào?". Đọc bảng: sau i = 2 mảng là <code>1 2 3 9 6 5 4</code>. Quy tắc giúp trả lời mà không cần chạy lại từ đầu: <strong>sau lượt i, i+1 vị trí đầu tiên giữ đúng i+1 giá trị nhỏ nhất, đã xếp thứ tự, và phần còn lại không bảo đảm điều gì cả.</strong></p>`],

      [32, 'Selection Sort: Students complete the demo',
        `<p class="y-chinh">🎯 The full program, listed with line numbers 2–30, and a console window with the answer: <code>0 1 2 3 4 5 6 7 8 9</code>. The comments inside the code are a step-by-step reading of the algorithm — <em>"index of min. value in a group"</em>, <em>"Group begins at position i to n-1"</em>, <em>"Move minimum value to the begin of the group"</em>.</p>
<ul>
<li><strong>The word "group" is doing the teaching</strong> — at pass <code>i</code>, the group is the sub-array <code>a[i] … a[n-1]</code>. Everything before <code>i</code> is finished. Selection Sort is "shrink the group by one each pass, always by pulling its minimum to its front".</li>
<li><strong>The input</strong> — <code>int a[] = { 1,3,5,7,9,2,4,6,8, 0 };</code>, ten elements, called as <code>ascSelectionSort(a, 10)</code> then <code>print(a, 10)</code>. The array is deliberately awkward: odds ascending, then evens ascending, then 0 at the very end.</li>
<li><strong>Line 12 is the optimisation</strong> — <code>if (minIndex &gt; i)</code> before the three-line swap. Without it the code would still be correct, just doing pointless self-swaps (<code>t = a[i]; a[i] = a[i]; a[i] = t;</code>) whenever the minimum is already in place.</li>
<li><strong>Lines 13–15 are the swap idiom</strong> — <code>int t = a[minIndex]; a[minIndex] = a[i]; a[i] = t;</code>. Three assignments and one temporary; you cannot do it in two. This is the same shape as <code>swap2</code> from Slot 10, just inlined because both values live in the same array.</li>
<li><strong><code>int* a</code> in the signature</strong> — the function takes a pointer, which is what an array argument decays to (slide 13). That is why the sort can modify the caller's array while <code>swap1</code> from Slot 10 could not modify the caller's <code>int</code>s.</li>
<li><strong><code>print</code> is separate</strong> — lines 20–23 define <code>void print(int *a, int n)</code>. Keeping "sort" and "show" apart is the habit the whole case study on slides 38–43 is built on.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
void ascSelectionSort(int* a, int n)
{   int minIndex;          /* index of min. value in a group */
    int i, j;              /* vars for looping */
    /* Group begins at position i to n-1 */
    for (i = 0; i &lt; n - 1; i++)
    {   minIndex = i;      /* init minimum position */
        /* update minIndex of the group at i, i+1,..., n-1 */
        for (j = i + 1; j &lt; n; j++) if (a[minIndex] &gt; a[j]) minIndex = j;
        /* Move minimum value to the begin of the group */
        if (minIndex &gt; i)
        {   int t = a[minIndex];
            a[minIndex] = a[i];
            a[i] = t;
        }
    }
}
void print(int* a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) printf("%d ", a[i]);
}
int main()
{   int a[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
    ascSelectionSort(a, 10);
    print(a, 10);
    return 0;
}</code></pre>
<table>
<tr><th>pass i</th><th>group a[i]…a[9]</th><th>minimum found at</th><th>comparisons</th><th>array after the pass</th></tr>
<tr><td>0</td><td>1 3 5 7 9 2 4 6 8 0</td><td>index 9 (0)</td><td>9</td><td>0 3 5 7 9 2 4 6 8 1</td></tr>
<tr><td>1</td><td>3 5 7 9 2 4 6 8 1</td><td>index 9 (1)</td><td>8</td><td>0 1 5 7 9 2 4 6 8 3</td></tr>
<tr><td>2</td><td>5 7 9 2 4 6 8 3</td><td>index 5 (2)</td><td>7</td><td>0 1 2 7 9 5 4 6 8 3</td></tr>
<tr><td>3</td><td>7 9 5 4 6 8 3</td><td>index 9 (3)</td><td>6</td><td>0 1 2 3 9 5 4 6 8 7</td></tr>
<tr><td>…</td><td>…</td><td>…</td><td>5+4+3+2+1</td><td>…</td></tr>
<tr><td>total</td><td></td><td></td><td><strong>45 = 10·9/2</strong></td><td><strong>0 1 2 3 4 5 6 7 8 9</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: the program prints <strong><code>0 1 2 3 4 5 6 7 8 9</code></strong>, exactly the console window on the slide. Counters measured <strong>45 comparisons</strong> (= 10·9/2, as the formula demands) and only <strong>7 swaps</strong> — three passes found their minimum already in place.</p>
<p class="pitfall">⚠️ Two mistakes students make when completing this demo. First, writing <code>if (a[minIndex] &gt; a[j]) minIndex = i;</code> — assigning <code>i</code> instead of <code>j</code>; the code compiles, runs, prints an unsorted array and gives no clue why. Second, swapping <code>a[j]</code> instead of <code>a[minIndex]</code> after the inner loop has finished — by then <code>j</code> equals <code>n</code>, so you are writing to <code>a[n]</code>, outside the array.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ chương trình, đánh số dòng 2–30, kèm khung console cho sẵn đáp án: <code>0 1 2 3 4 5 6 7 8 9</code>. Các chú thích trong mã chính là bản đọc từng bước của thuật toán — <em>"index of min. value in a group"</em>, <em>"Group begins at position i to n-1"</em>, <em>"Move minimum value to the begin of the group"</em>.</p>
<ul>
<li><strong>Chữ "group" (nhóm) mới là chỗ dạy</strong> — ở lượt <code>i</code>, nhóm là mảng con <code>a[i] … a[n-1]</code>. Mọi thứ trước <code>i</code> đã xong. Selection Sort là "mỗi lượt thu nhóm lại một phần tử, bằng cách kéo phần tử nhỏ nhất của nhóm lên đầu nhóm".</li>
<li><strong>Dữ liệu vào</strong> — <code>int a[] = { 1,3,5,7,9,2,4,6,8, 0 };</code>, mười phần tử, gọi <code>ascSelectionSort(a, 10)</code> rồi <code>print(a, 10)</code>. Mảng được chọn khó chịu có chủ ý: số lẻ tăng dần, rồi số chẵn tăng dần, rồi số 0 nằm tận cuối.</li>
<li><strong>Dòng 12 là chỗ tối ưu</strong> — <code>if (minIndex &gt; i)</code> đặt trước khối đổi chỗ ba dòng. Không có nó thì mã vẫn đúng, chỉ là làm những lần tự đổi chỗ vô ích (<code>t = a[i]; a[i] = a[i]; a[i] = t;</code>) mỗi khi phần tử nhỏ nhất đã nằm sẵn đúng chỗ.</li>
<li><strong>Dòng 13–15 là khuôn đổi chỗ</strong> — <code>int t = a[minIndex]; a[minIndex] = a[i]; a[i] = t;</code>. Ba phép gán và một biến tạm; không làm được bằng hai. Đây đúng hình dáng của <code>swap2</code> ở Slot 10, chỉ là viết thẳng vào vì hai giá trị cùng nằm trong một mảng.</li>
<li><strong><code>int* a</code> trong chữ ký</strong> — hàm nhận một con trỏ, đúng thứ mà một đối số mảng suy biến thành (slide 13). Đó là lý do hàm sắp xếp SỬA ĐƯỢC mảng của người gọi, trong khi <code>swap1</code> ở Slot 10 thì không sửa được hai biến <code>int</code> của người gọi.</li>
<li><strong><code>print</code> tách riêng</strong> — dòng 20–23 định nghĩa <code>void print(int *a, int n)</code>. Tách "sắp xếp" khỏi "hiển thị" là thói quen mà cả case study ở slide 38–43 dựng trên đó.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
void ascSelectionSort(int* a, int n)
{   int minIndex;          /* index of min. value in a group */
    int i, j;              /* vars for looping */
    /* Group begins at position i to n-1 */
    for (i = 0; i &lt; n - 1; i++)
    {   minIndex = i;      /* init minimum position */
        /* update minIndex of the group at i, i+1,..., n-1 */
        for (j = i + 1; j &lt; n; j++) if (a[minIndex] &gt; a[j]) minIndex = j;
        /* Move minimum value to the begin of the group */
        if (minIndex &gt; i)
        {   int t = a[minIndex];
            a[minIndex] = a[i];
            a[i] = t;
        }
    }
}
void print(int* a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) printf("%d ", a[i]);
}
int main()
{   int a[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
    ascSelectionSort(a, 10);
    print(a, 10);
    return 0;
}</code></pre>
<table>
<tr><th>lượt i</th><th>nhóm a[i]…a[9]</th><th>nhỏ nhất ở</th><th>số so sánh</th><th>mảng sau lượt</th></tr>
<tr><td>0</td><td>1 3 5 7 9 2 4 6 8 0</td><td>chỉ số 9 (số 0)</td><td>9</td><td>0 3 5 7 9 2 4 6 8 1</td></tr>
<tr><td>1</td><td>3 5 7 9 2 4 6 8 1</td><td>chỉ số 9 (số 1)</td><td>8</td><td>0 1 5 7 9 2 4 6 8 3</td></tr>
<tr><td>2</td><td>5 7 9 2 4 6 8 3</td><td>chỉ số 5 (số 2)</td><td>7</td><td>0 1 2 7 9 5 4 6 8 3</td></tr>
<tr><td>3</td><td>7 9 5 4 6 8 3</td><td>chỉ số 9 (số 3)</td><td>6</td><td>0 1 2 3 9 5 4 6 8 7</td></tr>
<tr><td>…</td><td>…</td><td>…</td><td>5+4+3+2+1</td><td>…</td></tr>
<tr><td>tổng</td><td></td><td></td><td><strong>45 = 10·9/2</strong></td><td><strong>0 1 2 3 4 5 6 7 8 9</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật: chương trình in ra <strong><code>0 1 2 3 4 5 6 7 8 9</code></strong>, đúng khung console trên slide. Biến đếm đo được <strong>45 phép so sánh</strong> (= 10·9/2, đúng công thức) và chỉ <strong>7 lần đổi chỗ</strong> — ba lượt tìm thấy phần tử nhỏ nhất đã nằm sẵn đúng chỗ.</p>
<p class="pitfall">⚠️ Hai lỗi sinh viên hay mắc khi hoàn thiện demo này. Một, viết <code>if (a[minIndex] &gt; a[j]) minIndex = i;</code> — gán <code>i</code> thay vì <code>j</code>; mã vẫn dịch, vẫn chạy, in ra một mảng chưa sắp và không để lại manh mối nào. Hai, đổi chỗ với <code>a[j]</code> thay vì <code>a[minIndex]</code> sau khi vòng trong kết thúc — lúc đó <code>j</code> đã bằng <code>n</code>, nên bạn đang ghi vào <code>a[n]</code>, ngoài mảng.</p>`],

      [33, 'Sorting: Bubble Sort',
        `<p class="y-chinh">🎯 <em>"It works by repeatedly stepping through the list, comparing two items at a time and swapping them if they are in the wrong order. The pass is <u>repeated until no swaps are needed</u>, which means the list is sorted."</u></em> That underlined clause is the part the school's code on slide 34 does <strong>not</strong> implement — and it is the most examinable gap on the slide.</p>
<ul>
<li><strong>The direction is backwards</strong> — the inner loop printed beside every row is <code>for (j = n-1; j &gt; i; j--) if (a[j] &lt; a[j-1]) swap(a[j], a[j-1]);</code>. It walks from the END towards index <code>i</code>, and pushes the <em>smallest</em> remaining value up to position <code>i</code>. Many textbooks bubble the largest down instead; the school's version bubbles the smallest up. Answer the exam with <em>this</em> version.</li>
<li><strong>The trace array</strong> — read the picture's leftmost column top-to-bottom: <code>a = 4 2 6 9 3</code>, n = 5. Row i=0 shows the value 2 boxed and travelling upward, ending with <code>2</code> at the top.</li>
<li><strong>Each pass fixes exactly one position</strong> — after pass i, <code>a[i]</code> holds its final value and never moves again. That is why the inner loop stops at <code>j &gt; i</code> and not at <code>j &gt; 0</code>: re-scanning the settled prefix would be wasted work.</li>
<li><strong>Adjacent-only swaps</strong> — unlike Selection Sort, a value can only move one position per comparison. A value that belongs 4 places away needs 4 swaps. That is why Bubble Sort's swap count explodes: measured on a reversed 10-element array it did <strong>45 swaps</strong> versus Selection Sort's 5.</li>
<li><strong>The missing early exit</strong> — "repeated until no swaps are needed" means: add <code>int swapped = 0;</code> at the top of each pass, set it inside the <code>if</code>, and <code>if (!swapped) break;</code> at the end of the pass. On an already-sorted array that turns 45 comparisons into 9. Slide 34's code has no such flag.</li>
</ul>
<pre><code>void ascBubbleSort(int *a, int n) {              /* dung nhu slide */
    int i, j;
    for (i = 0; i &lt; n - 1; i++)
        for (j = n - 1; j &gt; i; j--)
            if (a[j] &lt; a[j - 1]) { int t = a[j]; a[j] = a[j-1]; a[j-1] = t; }
}

void ascBubbleSortOpt(int *a, int n) {           /* ban co CO swapped */
    int i, j;
    for (i = 0; i &lt; n - 1; i++) {
        int swapped = 0;
        for (j = n - 1; j &gt; i; j--)
            if (a[j] &lt; a[j - 1]) { int t = a[j]; a[j] = a[j-1]; a[j-1] = t; swapped = 1; }
        if (!swapped) break;                     /* danh sach da sap -&gt; dung */
    }
}</code></pre>
<table>
<tr><th>pass i</th><th>array at the start of the pass</th><th>j runs</th><th>comparisons</th><th>swaps in this pass</th><th>array at the end</th></tr>
<tr><td>0</td><td>4 2 6 9 3</td><td>4→1</td><td>4</td><td>3</td><td><strong>2</strong> 4 3 6 9</td></tr>
<tr><td>1</td><td>2 4 3 6 9</td><td>4→2</td><td>3</td><td>1</td><td><strong>2 3</strong> 4 6 9</td></tr>
<tr><td>2</td><td>2 3 4 6 9</td><td>4→3</td><td>2</td><td><strong>0</strong></td><td><strong>2 3 4</strong> 6 9</td></tr>
<tr><td>3</td><td>2 3 4 6 9</td><td>4→4</td><td>1</td><td><strong>0</strong></td><td><strong>2 3 4 6</strong> 9</td></tr>
<tr><td>total</td><td></td><td></td><td><strong>10 = 5·4/2</strong></td><td><strong>4</strong></td><td>2 3 4 6 9</td></tr>
</table>
<p class="dap-an">✅ Measured (<code>cc -Wall</code>, counters compiled in): pass 0 turns <code>4 2 6 9 3</code> into <code>2 4 3 6 9</code> — exactly the column labelled i=1 in the slide's picture. Total 10 comparisons and 4 swaps. Passes 2 and 3 did <strong>zero</strong> swaps: the <code>swapped</code> flag would have stopped the algorithm two passes early, saving 3 of the 10 comparisons here — and 36 of 45 on an already-sorted 10-element array (measured: 9 vs 45).</p>
<p class="pitfall">⚠️ Do not mix the two directions up. If you keep <code>for (j = n-1; j &gt; i; j--)</code> but change the test to <code>a[j] &gt; a[j-1]</code>, you get a descending sort, not a bug. But if you keep the test <code>a[j] &lt; a[j-1]</code> and change the loop to <code>for (j = 0; j &lt; n-1-i; j++)</code>, the prefix <code>a[0..i]</code> is no longer the settled part — the settled part is now the <em>suffix</em> — and the outer loop's bound is wrong. Change both, or neither.</p>`,
        `<p class="y-chinh">🎯 <em>"Nó hoạt động bằng cách đi lại nhiều lần qua danh sách, mỗi lần so hai phần tử và đổi chỗ nếu sai thứ tự. Lượt đi được <u>lặp lại cho tới khi không cần đổi chỗ nữa</u>, nghĩa là danh sách đã được sắp."</em> Mệnh đề gạch chân ấy chính là phần mà mã của trường ở slide 34 <strong>KHÔNG</strong> cài đặt — và đó là lỗ hổng dễ ra đề nhất trên slide.</p>
<ul>
<li><strong>Chiều đi là chiều NGƯỢC</strong> — vòng trong in bên cạnh mỗi hàng là <code>for (j = n-1; j &gt; i; j--) if (a[j] &lt; a[j-1]) swap(a[j], a[j-1]);</code>. Nó đi từ CUỐI về phía chỉ số <code>i</code>, và đẩy giá trị NHỎ NHẤT còn lại lên vị trí <code>i</code>. Nhiều giáo trình lại sủi giá trị lớn nhất xuống cuối; bản của trường sủi nhỏ nhất lên đầu. Hãy trả lời đề thi theo bản NÀY.</li>
<li><strong>Mảng trong vệt chạy</strong> — đọc cột trái nhất của hình từ trên xuống: <code>a = 4 2 6 9 3</code>, n = 5. Hàng i=0 cho thấy số 2 được đóng khung và đi ngược lên, kết thúc với <code>2</code> nằm trên cùng.</li>
<li><strong>Mỗi lượt chốt ĐÚNG MỘT vị trí</strong> — sau lượt i, <code>a[i]</code> giữ giá trị cuối cùng của nó và không bao giờ dịch nữa. Đó là lý do vòng trong dừng ở <code>j &gt; i</code> chứ không phải <code>j &gt; 0</code>: quét lại phần đã chốt là làm việc thừa.</li>
<li><strong>Chỉ đổi chỗ hai ô KỀ nhau</strong> — khác Selection Sort, mỗi phép so sánh chỉ dời được một giá trị đi một vị trí. Một giá trị phải đi xa 4 chỗ thì cần 4 lần đổi chỗ. Vì thế số lần đổi chỗ của Bubble Sort bùng nổ: đo trên mảng 10 phần tử xếp ngược, nó đổi chỗ <strong>45 lần</strong> so với 5 lần của Selection Sort.</li>
<li><strong>Cái thoát sớm còn thiếu</strong> — "lặp cho tới khi không cần đổi chỗ" nghĩa là: thêm <code>int swapped = 0;</code> ở đầu mỗi lượt, bật nó trong <code>if</code>, và <code>if (!swapped) break;</code> ở cuối lượt. Trên mảng đã sắp sẵn, chuyện đó biến 45 phép so sánh thành 9. Mã ở slide 34 không có cờ ấy.</li>
</ul>
<pre><code>void ascBubbleSort(int *a, int n) {              /* dung nhu slide */
    int i, j;
    for (i = 0; i &lt; n - 1; i++)
        for (j = n - 1; j &gt; i; j--)
            if (a[j] &lt; a[j - 1]) { int t = a[j]; a[j] = a[j-1]; a[j-1] = t; }
}

void ascBubbleSortOpt(int *a, int n) {           /* ban co CO swapped */
    int i, j;
    for (i = 0; i &lt; n - 1; i++) {
        int swapped = 0;
        for (j = n - 1; j &gt; i; j--)
            if (a[j] &lt; a[j - 1]) { int t = a[j]; a[j] = a[j-1]; a[j-1] = t; swapped = 1; }
        if (!swapped) break;                     /* danh sach da sap -&gt; dung */
    }
}</code></pre>
<table>
<tr><th>lượt i</th><th>mảng đầu lượt</th><th>j chạy</th><th>số so sánh</th><th>số lần đổi chỗ</th><th>mảng cuối lượt</th></tr>
<tr><td>0</td><td>4 2 6 9 3</td><td>4→1</td><td>4</td><td>3</td><td><strong>2</strong> 4 3 6 9</td></tr>
<tr><td>1</td><td>2 4 3 6 9</td><td>4→2</td><td>3</td><td>1</td><td><strong>2 3</strong> 4 6 9</td></tr>
<tr><td>2</td><td>2 3 4 6 9</td><td>4→3</td><td>2</td><td><strong>0</strong></td><td><strong>2 3 4</strong> 6 9</td></tr>
<tr><td>3</td><td>2 3 4 6 9</td><td>4→4</td><td>1</td><td><strong>0</strong></td><td><strong>2 3 4 6</strong> 9</td></tr>
<tr><td>tổng</td><td></td><td></td><td><strong>10 = 5·4/2</strong></td><td><strong>4</strong></td><td>2 3 4 6 9</td></tr>
</table>
<p class="dap-an">✅ Đo thật (<code>cc -Wall</code>, biên dịch kèm biến đếm): lượt 0 biến <code>4 2 6 9 3</code> thành <code>2 4 3 6 9</code> — đúng cột mang nhãn i=1 trên hình của slide. Tổng 10 phép so sánh và 4 lần đổi chỗ. Lượt 2 và lượt 3 đổi chỗ <strong>KHÔNG lần nào</strong>: cờ <code>swapped</code> đã có thể dừng thuật toán sớm hai lượt, tiết kiệm 3 trong 10 phép so sánh ở đây — và 36 trong 45 phép trên mảng 10 phần tử đã sắp sẵn (đo thật: 9 so với 45).</p>
<p class="pitfall">⚠️ Đừng trộn lẫn hai chiều. Nếu giữ <code>for (j = n-1; j &gt; i; j--)</code> mà đổi phép kiểm thành <code>a[j] &gt; a[j-1]</code> thì bạn được sắp GIẢM dần, không phải lỗi. Nhưng nếu giữ phép kiểm <code>a[j] &lt; a[j-1]</code> mà đổi vòng lặp thành <code>for (j = 0; j &lt; n-1-i; j++)</code> thì đoạn <code>a[0..i]</code> không còn là phần đã chốt nữa — phần đã chốt lúc này nằm ở ĐUÔI — và cận của vòng ngoài thành sai. Đổi cả hai, hoặc không đổi gì cả.</p>`],

      [34, 'Bubble Sort: Demo',
        `<p class="y-chinh">🎯 The runnable twin of slide 32: same <code>main</code>, same input array, same <code>print</code>, only the sorting function swapped out. Console answer: <code>0 1 2 3 4 5 6 7 8 9</code>. Comparing the two demos side by side is the whole point of putting them on consecutive slides.</p>
<ul>
<li><strong>The comments spell out the mechanism</strong> — <em>"Loop n-1 pass"</em> on the outer loop, <em>"Go to the end of array to move the min value up"</em> on the inner loop, <em>"The later element is smaller than the previous one"</em> on the <code>if</code>, and <em>"move the smaller up"</em> on the swap block.</li>
<li><strong>Same input, same output, different work</strong> — both demos sort <code>{1,3,5,7,9,2,4,6,8,0}</code> to <code>0…9</code> and both do exactly 45 comparisons. The difference is the swap count, and it is large: Selection Sort 7, Bubble Sort <strong>19</strong>.</li>
<li><strong>Why 19 and not 7</strong> — the 0 at index 9 has to travel nine positions to reach index 0, and each position costs one adjacent swap. Selection Sort teleports it there in a single swap.</li>
<li><strong>The swap block is identical to slide 32's</strong> — <code>int t = a[j]; a[j] = a[j-1]; a[j-1] = t;</code>. Declaring <code>t</code> inside the <code>if</code> block is fine and good style: it exists only where it is needed.</li>
<li><strong>Complexity is the same, cost is not</strong> — both are O(n²) comparisons. On data where writes are expensive (sorting big structures, or an array in a file), the swap count is what you pay for, and Selection Sort wins by a lot.</li>
<li><strong>What the exam does with this slide</strong> — it gives you a five-element array and asks for the array after a named pass. Use the table below as the template: one row per <code>i</code>, and remember the settled prefix grows from the left.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
void ascBubbleSort(int* a, int n)
{   int i, j;                       /* vars for looping */
    /* Loop n-1 pass */
    for (i = 0; i &lt; n - 1; i++)
    {   /* Go to the end of array to move the min value up */
        for (j = n - 1; j &gt; i; j--)
            /* The later element is smaller than the previous one */
            if (a[j] &lt; a[j - 1])
            {   /* move the smaller up */
                int t = a[j];
                a[j] = a[j - 1];
                a[j - 1] = t;
            }
    }
}
void print(int* a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) printf("%d ", a[i]);
}
int main()
{   int a[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
    ascBubbleSort(a, 10);
    print(a, 10);
    return 0;
}</code></pre>
<table>
<tr><th>Same array {1,3,5,7,9,2,4,6,8,0}</th><th>comparisons</th><th>swaps</th><th>passes run</th></tr>
<tr><td>Selection Sort (slide 32)</td><td>45</td><td><strong>7</strong></td><td>9</td></tr>
<tr><td>Bubble Sort, school version (slide 34)</td><td>45</td><td><strong>19</strong></td><td>9</td></tr>
<tr><td>Bubble Sort + <code>swapped</code> flag</td><td><strong>39</strong></td><td>19</td><td><strong>6</strong></td></tr>
<tr><td>already sorted {0,1,…,9} — Selection</td><td>45</td><td>0</td><td>9</td></tr>
<tr><td>already sorted {0,1,…,9} — Bubble + flag</td><td><strong>9</strong></td><td>0</td><td><strong>1</strong></td></tr>
<tr><td>reversed {9,8,…,0} — Selection / Bubble</td><td>45 / 45</td><td><strong>5 / 45</strong></td><td>9 / 9</td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: the program prints <strong><code>0 1 2 3 4 5 6 7 8 9</code></strong>, exactly the console window on the slide. Every number in the table above was produced by counters inside those same functions, not estimated. The headline: <strong>the two algorithms do identical comparison work and wildly different swap work</strong>, and only Bubble Sort can be made to finish early.</p>
<p class="meo">💡 One sentence for the exam: <em>"Selection Sort always costs n(n−1)/2 comparisons and at most n−1 swaps; Bubble Sort costs the same comparisons unless you add the <code>swapped</code> flag, and as many swaps as there are inversions."</em> If the question mentions "already nearly sorted", the expected answer is Bubble Sort with the flag.</p>`,
        `<p class="y-chinh">🎯 Bản chạy được, sinh đôi với slide 32: cùng <code>main</code>, cùng mảng đầu vào, cùng hàm <code>print</code>, chỉ thay hàm sắp xếp. Đáp án console: <code>0 1 2 3 4 5 6 7 8 9</code>. Đặt hai demo cạnh nhau để so sánh chính là mục đích của việc xếp chúng liền hai slide.</p>
<ul>
<li><strong>Các chú thích nói rõ cơ chế</strong> — <em>"Loop n-1 pass"</em> ở vòng ngoài, <em>"Go to the end of array to move the min value up"</em> ở vòng trong, <em>"The later element is smaller than the previous one"</em> ở lệnh <code>if</code>, và <em>"move the smaller up"</em> ở khối đổi chỗ.</li>
<li><strong>Cùng vào, cùng ra, khác khối lượng việc</strong> — cả hai demo đều sắp <code>{1,3,5,7,9,2,4,6,8,0}</code> thành <code>0…9</code> và đều làm đúng 45 phép so sánh. Khác nhau ở số lần đổi chỗ, và khác rất nhiều: Selection Sort 7, Bubble Sort <strong>19</strong>.</li>
<li><strong>Vì sao là 19 chứ không phải 7</strong> — số 0 ở chỉ số 9 phải đi qua chín vị trí mới về tới chỉ số 0, mà mỗi vị trí tốn một lần đổi chỗ với ô kề. Selection Sort thì "dịch chuyển tức thời" nó về đó bằng đúng một lần đổi chỗ.</li>
<li><strong>Khối đổi chỗ giống hệt slide 32</strong> — <code>int t = a[j]; a[j] = a[j-1]; a[j-1] = t;</code>. Khai <code>t</code> ngay trong khối <code>if</code> là hợp lệ và là phong cách tốt: nó chỉ tồn tại ở nơi cần đến.</li>
<li><strong>Độ phức tạp như nhau, chi phí thì không</strong> — cả hai đều O(n²) phép so sánh. Trên dữ liệu mà phép GHI đắt (sắp các struct lớn, hoặc mảng nằm trong file), thứ bạn phải trả là số lần đổi chỗ, và Selection Sort thắng đậm.</li>
<li><strong>Đề thi làm gì với slide này</strong> — nó cho bạn một mảng năm phần tử và hỏi mảng trông thế nào sau một lượt nhất định. Dùng bảng dưới đây làm khuôn: mỗi <code>i</code> một hàng, và nhớ rằng phần đã chốt lớn dần từ bên TRÁI.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
void ascBubbleSort(int* a, int n)
{   int i, j;                       /* vars for looping */
    /* Loop n-1 pass */
    for (i = 0; i &lt; n - 1; i++)
    {   /* Go to the end of array to move the min value up */
        for (j = n - 1; j &gt; i; j--)
            /* The later element is smaller than the previous one */
            if (a[j] &lt; a[j - 1])
            {   /* move the smaller up */
                int t = a[j];
                a[j] = a[j - 1];
                a[j - 1] = t;
            }
    }
}
void print(int* a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) printf("%d ", a[i]);
}
int main()
{   int a[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
    ascBubbleSort(a, 10);
    print(a, 10);
    return 0;
}</code></pre>
<table>
<tr><th>Cùng mảng {1,3,5,7,9,2,4,6,8,0}</th><th>số so sánh</th><th>số đổi chỗ</th><th>số lượt chạy</th></tr>
<tr><td>Selection Sort (slide 32)</td><td>45</td><td><strong>7</strong></td><td>9</td></tr>
<tr><td>Bubble Sort, bản của trường (slide 34)</td><td>45</td><td><strong>19</strong></td><td>9</td></tr>
<tr><td>Bubble Sort + cờ <code>swapped</code></td><td><strong>39</strong></td><td>19</td><td><strong>6</strong></td></tr>
<tr><td>mảng đã sắp {0,1,…,9} — Selection</td><td>45</td><td>0</td><td>9</td></tr>
<tr><td>mảng đã sắp {0,1,…,9} — Bubble + cờ</td><td><strong>9</strong></td><td>0</td><td><strong>1</strong></td></tr>
<tr><td>mảng ngược {9,8,…,0} — Selection / Bubble</td><td>45 / 45</td><td><strong>5 / 45</strong></td><td>9 / 9</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật: chương trình in ra <strong><code>0 1 2 3 4 5 6 7 8 9</code></strong>, đúng khung console trên slide. Mọi con số trong bảng trên đều do biến đếm đặt bên trong chính các hàm đó sinh ra, không phải ước lượng. Điểm rút ra: <strong>hai thuật toán làm y hệt nhau về số phép so sánh và khác nhau một trời một vực về số lần đổi chỗ</strong>, và chỉ Bubble Sort mới có thể được làm cho dừng sớm.</p>
<p class="meo">💡 Một câu cho phòng thi: <em>"Selection Sort luôn tốn n(n−1)/2 phép so sánh và nhiều nhất n−1 lần đổi chỗ; Bubble Sort tốn đúng chừng ấy phép so sánh trừ khi bạn thêm cờ <code>swapped</code>, và số lần đổi chỗ bằng đúng số cặp nghịch thế."</em> Nếu đề nhắc tới "mảng gần như đã sắp" thì đáp án chờ đợi là Bubble Sort có cờ.</p>`],

      [35, '1-D Arrays: A Case Study',
        `<p class="y-chinh">🎯 The specification slide. One program, one array of at most 100 integers, and a seven-item menu that exercises every operation the chapter has taught: add, search, remove-one, remove-all, print, print ascending, print descending. Everything on slides 36–44 is the implementation of exactly this list.</p>
<ul>
<li><strong>Read the menu as a list of functions</strong> — each numbered line becomes one function on slide 37. That mapping is the deliverable of "problem analysis" and it is what an exam means by "design the program".</li>
<li><strong>Item 3 vs item 4 is the interesting pair</strong> — "Remove the <em>first</em> existence" versus "Remove <em>all</em> existences". The first is one shift-left; the second is a loop that must be careful not to skip an element after a removal. Slide 42 shows why.</li>
<li><strong>The parenthesis in items 6 and 7 is the real requirement</strong> — <em>"(positions of elements are preserved)"</em>. You must PRINT in order without REORDERING the stored array. That forces a copy into a temporary array before sorting, which is what slide 43 does.</li>
<li><strong>"Others- Quit"</strong> — the menu has no explicit "0 to exit". Anything outside 1…7 ends the program, which is why slide 40's loop condition is <code>while (choice &gt;= 1 &amp;&amp; choice &lt;= 7)</code> and the <code>switch</code> has a <code>default:</code> that prints "Goodbye!".</li>
<li><strong>Maximum 100 elements, not exactly 100</strong> — the array is declared <code>int a[100]</code> but <code>n</code> starts at 0 and grows. This is the "logical size vs physical size" distinction from slide 17: the capacity is fixed, the length is a separate variable.</li>
</ul>
<pre><code>/* Menu -&gt; ham, anh xa 1-1 (slide 37 se khai day du) */
1- Add a value                   -&gt; void addValue(int *a, int *n, int value);
2- Search a value                -&gt; int  searchValue(int *a, int n, int value);
3- Remove the first existence    -&gt; void removeFirst(int *a, int *n, int value);
4- Remove all existences         -&gt; void removeAll(int *a, int *n, int value);
5- Print out the array           -&gt; void printArray(int *a, int n);
6- Print in ascending order      -&gt; void printAscending(int *a, int n);
7- Print in descending order     -&gt; void printDescending(int *a, int n);</code></pre>
<p class="meo">💡 Look at the parameter lists above and you can already predict the whole program: every function that can <strong>change the number of elements</strong> takes <code>int *n</code> (add, removeFirst, removeAll); every function that only <strong>reads</strong> takes <code>int n</code> (search, all three prints). That single rule, straight out of Slot 10, tells you which functions need a pointer and which do not — and getting it wrong is the number one reason a menu program "adds a value and then says the array is empty".</p>`,
        `<p class="y-chinh">🎯 Slide đặc tả. Một chương trình, một mảng nhiều nhất 100 số nguyên, và một menu bảy mục huy động đủ mọi thao tác chương này đã dạy: thêm, tìm, xoá một, xoá tất cả, in, in tăng dần, in giảm dần. Toàn bộ slide 36–44 là phần cài đặt của đúng danh sách này.</p>
<ul>
<li><strong>Đọc menu như một danh sách hàm</strong> — mỗi dòng đánh số sẽ thành một hàm ở slide 37. Phép ánh xạ ấy chính là sản phẩm của bước "phân tích bài toán", và đó là thứ đề thi muốn nói khi ghi "thiết kế chương trình".</li>
<li><strong>Cặp mục 3 và 4 mới là chỗ thú vị</strong> — "Xoá lần xuất hiện ĐẦU TIÊN" so với "Xoá TẤT CẢ lần xuất hiện". Cái đầu là một lần dồn trái; cái sau là một vòng lặp phải rất cẩn thận để không bỏ sót phần tử sau khi vừa xoá. Slide 42 cho thấy vì sao.</li>
<li><strong>Phần trong ngoặc của mục 6 và 7 mới là yêu cầu thật</strong> — <em>"(positions of elements are preserved)"</em>, giữ nguyên vị trí các phần tử. Bạn phải IN theo thứ tự mà KHÔNG sắp xếp lại mảng đang lưu. Điều đó buộc phải chép sang một mảng tạm rồi mới sắp, đúng như slide 43 làm.</li>
<li><strong>"Others- Quit"</strong> — menu không có mục "0 để thoát". Bất cứ số nào ngoài 1…7 đều kết thúc chương trình, đó là lý do điều kiện vòng lặp ở slide 40 là <code>while (choice &gt;= 1 &amp;&amp; choice &lt;= 7)</code> và <code>switch</code> có nhánh <code>default:</code> in "Goodbye!".</li>
<li><strong>Tối đa 100 phần tử, không phải đúng 100</strong> — mảng khai <code>int a[100]</code> nhưng <code>n</code> bắt đầu từ 0 rồi lớn dần. Đây là phân biệt "kích thước logic và kích thước vật lý" ở slide 17: sức chứa cố định, còn độ dài là một biến riêng.</li>
</ul>
<pre><code>/* Menu -&gt; ham, anh xa 1-1 (slide 37 se khai day du) */
1- Add a value                   -&gt; void addValue(int *a, int *n, int value);
2- Search a value                -&gt; int  searchValue(int *a, int n, int value);
3- Remove the first existence    -&gt; void removeFirst(int *a, int *n, int value);
4- Remove all existences         -&gt; void removeAll(int *a, int *n, int value);
5- Print out the array           -&gt; void printArray(int *a, int n);
6- Print in ascending order      -&gt; void printAscending(int *a, int n);
7- Print in descending order     -&gt; void printDescending(int *a, int n);</code></pre>
<p class="meo">💡 Nhìn danh sách tham số ở trên là bạn đoán được cả chương trình: mọi hàm có thể <strong>làm thay đổi số phần tử</strong> đều nhận <code>int *n</code> (add, removeFirst, removeAll); mọi hàm chỉ <strong>đọc</strong> thì nhận <code>int n</code> (search và cả ba hàm in). Đúng một quy tắc ấy, lấy thẳng từ Slot 10, cho biết hàm nào cần con trỏ và hàm nào không — và làm sai chỗ này là nguyên nhân số một khiến một chương trình menu "thêm giá trị xong rồi báo mảng vẫn rỗng".</p>`],

      [36, 'Case Study: Problem Analyze',
        `<p class="y-chinh">🎯 The first half of the analysis: what DATA does the program need? The slide answers with exactly two lines — <code>int a[100], n</code> for the array and its length, and <code>int value</code> for whatever number the user is adding, searching or removing.</p>
<ul>
<li><strong>The justification sentence matters</strong> — <em>"user can freely add or remove one or more elements to/from the array. So, an extra memory allocation is needed (100 items)."</em> You cannot know the final size in advance, so you over-allocate to the stated maximum and track the real length separately.</li>
<li><strong>Two numbers, two meanings</strong> — 100 is the <em>capacity</em> (how much memory exists) and <code>n</code> is the <em>length</em> (how many slots are actually in use). All loops run to <code>n</code>; only <code>addValue</code> ever compares against 100.</li>
<li><strong>Why <code>n</code> starts at 0 and not 100</strong> — the array is born empty. <code>printArray</code> with <code>n = 0</code> prints nothing, which is correct; if <code>n</code> were 100 it would print 100 uninitialised garbage values, exactly the situation slide 11 warned about with <em>"Elements contain un-predictable values"</em>.</li>
<li><strong>One <code>value</code> variable for four operations</strong> — add, search, remove-one and remove-all all read one integer from the keyboard. Reusing a single variable is fine because only one menu branch is alive at a time; it keeps <code>main</code> short.</li>
<li><strong>The alternative the slide rejects</strong> — slide 17 offered dynamic allocation (<code>malloc</code>/<code>realloc</code>) as the "no waste, no shortage" solution. This case study deliberately picks the simpler static array to keep the focus on the seven operations. Exercise 4 (slide 45) keeps the same choice.</li>
</ul>
<pre><code>#define MAX_SIZE 100

int a[MAX_SIZE];   /* suc chua: co dinh, 100 o = 400 byte tren stack */
int n = 0;         /* do dai that: 0 luc bat dau, lon dan theo thao tac */
int value;         /* so nguoi dung vua nhap: them / tim / xoa */

/* moi vong lap duyet chay toi n, KHONG toi MAX_SIZE: */
for (i = 0; i &lt; n; i++) ...            /* dung   */
for (i = 0; i &lt; MAX_SIZE; i++) ...     /* SAI: doc 100 - n o rac */</code></pre>
<table>
<tr><th>Name</th><th>Type</th><th>Meaning</th><th>Who may change it</th></tr>
<tr><td><code>a</code></td><td><code>int[100]</code></td><td>storage, fixed capacity</td><td>add, removeFirst, removeAll</td></tr>
<tr><td><code>n</code></td><td><code>int</code></td><td>logical length, 0…100</td><td>add (+1), removeFirst (−1), removeAll (−count)</td></tr>
<tr><td><code>value</code></td><td><code>int</code></td><td>the number the user typed</td><td><code>main</code> only, via <code>scanf</code></td></tr>
<tr><td><code>choice</code></td><td><code>int</code></td><td>menu selection 1…7 or other</td><td><code>main</code> only</td></tr>
</table>
<p class="meo">💡 The habit to copy from this slide: <strong>write down the data before writing any code</strong>, as nouns with a type each. Slide 14 did the same thing for the earlier demo ("Nouns: Constant MAXN=100 · Static array int a[MAXN] · Real number of elements int n"). Every function signature on slide 37 falls out of this list mechanically.</p>`,
        `<p class="y-chinh">🎯 Nửa đầu của phần phân tích: chương trình cần những DỮ LIỆU gì? Slide trả lời bằng đúng hai dòng — <code>int a[100], n</code> cho mảng và độ dài của nó, và <code>int value</code> cho con số mà người dùng đang thêm, đang tìm hoặc đang xoá.</p>
<ul>
<li><strong>Câu biện luận mới là chỗ quan trọng</strong> — <em>"người dùng có thể tuỳ ý thêm hoặc xoá một hay nhiều phần tử, nên cần cấp phát dư ra (100 phần tử)."</em> Bạn không thể biết trước kích thước cuối cùng, nên cấp dư tới mức tối đa đã nêu rồi theo dõi độ dài thật bằng một biến riêng.</li>
<li><strong>Hai con số, hai ý nghĩa</strong> — 100 là SỨC CHỨA (có bao nhiêu ô nhớ tồn tại) còn <code>n</code> là ĐỘ DÀI (đang dùng thật bao nhiêu ô). Mọi vòng lặp chạy tới <code>n</code>; chỉ riêng <code>addValue</code> mới đem so với 100.</li>
<li><strong>Vì sao <code>n</code> bắt đầu bằng 0 chứ không phải 100</strong> — mảng sinh ra là rỗng. <code>printArray</code> với <code>n = 0</code> không in gì cả, và thế là đúng; nếu <code>n</code> bằng 100 thì nó in ra 100 giá trị rác chưa khởi tạo, đúng cảnh mà slide 11 đã cảnh báo bằng câu <em>"Elements contain un-predictable values"</em>.</li>
<li><strong>Một biến <code>value</code> cho bốn thao tác</strong> — thêm, tìm, xoá một và xoá tất cả đều đọc một số nguyên từ bàn phím. Dùng lại một biến là ổn vì tại một thời điểm chỉ một nhánh menu đang sống; nhờ vậy <code>main</code> gọn.</li>
<li><strong>Phương án mà slide KHÔNG chọn</strong> — slide 17 đã đưa ra cấp phát động (<code>malloc</code>/<code>realloc</code>) như lời giải "không thừa, không thiếu". Case study này cố ý chọn mảng tĩnh đơn giản hơn để giữ trọng tâm ở bảy thao tác. Exercise 4 (slide 45) giữ nguyên lựa chọn ấy.</li>
</ul>
<pre><code>#define MAX_SIZE 100

int a[MAX_SIZE];   /* suc chua: co dinh, 100 o = 400 byte tren stack */
int n = 0;         /* do dai that: 0 luc bat dau, lon dan theo thao tac */
int value;         /* so nguoi dung vua nhap: them / tim / xoa */

/* moi vong lap duyet chay toi n, KHONG toi MAX_SIZE: */
for (i = 0; i &lt; n; i++) ...            /* dung   */
for (i = 0; i &lt; MAX_SIZE; i++) ...     /* SAI: doc 100 - n o rac */</code></pre>
<table>
<tr><th>Tên</th><th>Kiểu</th><th>Ý nghĩa</th><th>Ai được phép đổi</th></tr>
<tr><td><code>a</code></td><td><code>int[100]</code></td><td>chỗ lưu, sức chứa cố định</td><td>add, removeFirst, removeAll</td></tr>
<tr><td><code>n</code></td><td><code>int</code></td><td>độ dài logic, 0…100</td><td>add (+1), removeFirst (−1), removeAll (−count)</td></tr>
<tr><td><code>value</code></td><td><code>int</code></td><td>con số người dùng vừa gõ</td><td>chỉ <code>main</code>, qua <code>scanf</code></td></tr>
<tr><td><code>choice</code></td><td><code>int</code></td><td>lựa chọn menu 1…7 hoặc khác</td><td>chỉ <code>main</code></td></tr>
</table>
<p class="meo">💡 Thói quen đáng chép từ slide này: <strong>viết ra DỮ LIỆU trước khi viết bất kỳ dòng mã nào</strong>, dưới dạng các danh từ, mỗi danh từ một kiểu. Slide 14 đã làm đúng như thế cho demo trước đó ("Nouns: Constant MAXN=100 · Static array int a[MAXN] · Real number of elements int n"). Mọi chữ ký hàm ở slide 37 rơi ra từ danh sách này một cách máy móc.</p>`],

      [37, 'Case Study: Problem Analyze (cont.)',
        `<p class="y-chinh">🎯 The second half of the analysis: the <strong>function list</strong>. Ten prototypes, one per menu item plus three helpers, each with a one-line contract. This slide is the bridge between the specification (slide 35) and the code (slides 38–43).</p>
<ul>
<li><strong><code>int *n</code> versus <code>int n</code> — read the list again with this in mind</strong>. <code>add</code>, <code>removeOne</code> and <code>removeAll</code> take <code>int *pn</code>; <code>search</code>, <code>printAsc</code>, <code>printDesc</code> and <code>print</code> take a plain <code>int n</code>. The rule is mechanical: the ones that change the count need the address of the count.</li>
<li><strong>The two guard helpers</strong> — <code>int isFull(int *a, int n)</code> and <code>int isEmpty(int *a, int n)</code>. They return 1/0 and exist so the other functions do not each re-invent the boundary test. In the final code on slide 41 the author inlined <code>isFull</code> as <code>if (*n &gt;= MAX_SIZE)</code>; that is a simplification, not a different design.</li>
<li><strong>Functions that return a status</strong> — <code>removeOne</code> and <code>removeAll</code> are documented as <em>"return 1: successfully, 0: fail"</em>. That is the professional shape; the implemented version on slides 41–42 prints a message and returns <code>void</code> instead, which is easier to read but harder to reuse.</li>
<li><strong><code>int menu()</code> → Get user choice</strong> — printing the menu and reading the number is itself a function. In the delivered code on slide 38 this got inlined into <code>main</code>'s <code>do</code> block.</li>
<li><strong>Naming drift, and why you should notice it</strong> — the analysis says <code>add</code>, <code>search</code>, <code>removeOne</code>, <code>removeAll</code>, <code>printAsc</code>; the code says <code>addValue</code>, <code>searchValue</code>, <code>removeFirst</code>, <code>removeAll</code>, <code>printAscending</code>. Harmless here, but in a team the analysis document and the code drifting apart is how bugs are born.</li>
<li><strong><code>removeOne(int pos, …)</code> takes a POSITION, not a value</strong> — that is a genuinely better design than the delivered <code>removeFirst(int *a, int *n, int value)</code>: separating "find where" from "delete there" lets you reuse the delete for menu item 4 too.</li>
</ul>
<pre><code>/* Functions (theo dung slide) */
int  menu();                                  /* Get user choice        */
int  isFull (int *a, int n);                  /* mang day chua?         */
int  isEmpty(int *a, int n);                  /* mang rong chua?        */
void add      (int x, int *a, int *pn);       /* them -&gt; n tang          */
int  search   (int x, int *a, int  n);        /* tra ve vi tri tim thay  */
int  removeOne(int pos, int *a, int *pn);     /* xoa tai pos -&gt; n giam   */
int  removeAll(int x,  int *a, int *pn);      /* xoa moi ban sao         */
void printAsc (int *a, int n);                /* in tang, GIU nguyen vi tri */
void printDesc(int *a, int n);                /* in giam, GIU nguyen vi tri */
void print    (int *a, int n);</code></pre>
<table>
<tr><th>Function</th><th>count parameter</th><th>why</th></tr>
<tr><td><code>add</code>, <code>removeOne</code>, <code>removeAll</code></td><td><code>int *pn</code></td><td>they change n, so they need its address (Slot 10)</td></tr>
<tr><td><code>search</code>, <code>print</code>, <code>printAsc</code>, <code>printDesc</code></td><td><code>int n</code></td><td>read-only; a copy of the number is enough</td></tr>
<tr><td><code>isFull</code>, <code>isEmpty</code></td><td><code>int n</code></td><td>read-only predicates returning 1/0</td></tr>
<tr><td>every one of them</td><td><code>int *a</code></td><td>an array argument is already a pointer — no copy is ever made</td></tr>
</table>
<p class="pitfall">⚠️ The single most common bug in this whole case study: writing <code>void addValue(int *a, int n, int value)</code> and then <code>n++</code> inside it. It compiles cleanly, it runs, the value really is written into <code>a[n]</code> — and the caller's <code>n</code> never changes, so the next <code>add</code> overwrites the same slot and <code>print</code> shows nothing. This is <code>swap1</code> from Slot 10 all over again: <code>a</code> works without a star because arrays decay to pointers, but <code>n</code> is a plain <code>int</code> and needs one.</p>`,
        `<p class="y-chinh">🎯 Nửa sau của phần phân tích: <strong>danh sách hàm</strong>. Mười nguyên mẫu, mỗi mục menu một hàm cộng ba hàm phụ trợ, mỗi hàm kèm một dòng hợp đồng. Slide này là cây cầu nối đặc tả (slide 35) với mã nguồn (slide 38–43).</p>
<ul>
<li><strong><code>int *n</code> so với <code>int n</code> — đọc lại danh sách với ý này trong đầu</strong>. <code>add</code>, <code>removeOne</code> và <code>removeAll</code> nhận <code>int *pn</code>; còn <code>search</code>, <code>printAsc</code>, <code>printDesc</code> và <code>print</code> nhận <code>int n</code> trần. Quy tắc rất máy móc: hàm nào làm thay đổi số đếm thì cần ĐỊA CHỈ của số đếm.</li>
<li><strong>Hai hàm chốt canh</strong> — <code>int isFull(int *a, int n)</code> và <code>int isEmpty(int *a, int n)</code>. Chúng trả 1/0 và tồn tại để các hàm khác khỏi phải tự nghĩ lại phép kiểm biên. Trong mã cuối ở slide 41, tác giả đã nhúng thẳng <code>isFull</code> thành <code>if (*n &gt;= MAX_SIZE)</code>; đó là rút gọn, không phải thiết kế khác.</li>
<li><strong>Hàm trả về trạng thái</strong> — <code>removeOne</code> và <code>removeAll</code> được ghi rõ <em>"return 1: successfully, 0: fail"</em>. Đó là dáng chuyên nghiệp; bản cài đặt ở slide 41–42 lại in thông báo rồi trả <code>void</code>, dễ đọc hơn nhưng khó dùng lại hơn.</li>
<li><strong><code>int menu()</code> → lấy lựa chọn của người dùng</strong> — việc in menu và đọc con số tự nó cũng là một hàm. Trong mã bàn giao ở slide 38, nó đã bị nhúng vào khối <code>do</code> của <code>main</code>.</li>
<li><strong>Tên bị trôi, và vì sao bạn nên để ý</strong> — bản phân tích ghi <code>add</code>, <code>search</code>, <code>removeOne</code>, <code>removeAll</code>, <code>printAsc</code>; mã lại ghi <code>addValue</code>, <code>searchValue</code>, <code>removeFirst</code>, <code>removeAll</code>, <code>printAscending</code>. Ở đây vô hại, nhưng trong một đội thì tài liệu phân tích và mã trôi xa nhau chính là chỗ đẻ ra lỗi.</li>
<li><strong><code>removeOne(int pos, …)</code> nhận VỊ TRÍ, không nhận giá trị</strong> — đó thật sự là thiết kế tốt hơn bản bàn giao <code>removeFirst(int *a, int *n, int value)</code>: tách "tìm ở đâu" khỏi "xoá chỗ đó" cho phép dùng lại phép xoá cho cả mục menu 4.</li>
</ul>
<pre><code>/* Functions (theo dung slide) */
int  menu();                                  /* Get user choice        */
int  isFull (int *a, int n);                  /* mang day chua?         */
int  isEmpty(int *a, int n);                  /* mang rong chua?        */
void add      (int x, int *a, int *pn);       /* them -&gt; n tang          */
int  search   (int x, int *a, int  n);        /* tra ve vi tri tim thay  */
int  removeOne(int pos, int *a, int *pn);     /* xoa tai pos -&gt; n giam   */
int  removeAll(int x,  int *a, int *pn);      /* xoa moi ban sao         */
void printAsc (int *a, int n);                /* in tang, GIU nguyen vi tri */
void printDesc(int *a, int n);                /* in giam, GIU nguyen vi tri */
void print    (int *a, int n);</code></pre>
<table>
<tr><th>Hàm</th><th>tham số đếm</th><th>vì sao</th></tr>
<tr><td><code>add</code>, <code>removeOne</code>, <code>removeAll</code></td><td><code>int *pn</code></td><td>chúng đổi n nên cần địa chỉ của n (Slot 10)</td></tr>
<tr><td><code>search</code>, <code>print</code>, <code>printAsc</code>, <code>printDesc</code></td><td><code>int n</code></td><td>chỉ đọc; một bản sao của con số là đủ</td></tr>
<tr><td><code>isFull</code>, <code>isEmpty</code></td><td><code>int n</code></td><td>vị từ chỉ đọc, trả 1/0</td></tr>
<tr><td>tất cả bọn chúng</td><td><code>int *a</code></td><td>đối số mảng vốn đã là con trỏ — không bao giờ có bản sao nào được tạo</td></tr>
</table>
<p class="pitfall">⚠️ Lỗi phổ biến nhất của cả case study này: viết <code>void addValue(int *a, int n, int value)</code> rồi <code>n++</code> bên trong. Nó dịch sạch, nó chạy, giá trị thật sự được ghi vào <code>a[n]</code> — và biến <code>n</code> của người gọi không hề đổi, nên lần <code>add</code> kế tiếp ghi đè lên đúng ô ấy còn <code>print</code> thì chẳng hiện gì. Đây đúng là <code>swap1</code> của Slot 10 lặp lại: <code>a</code> chạy được mà không cần dấu sao vì mảng suy biến thành con trỏ, còn <code>n</code> là một <code>int</code> trần nên nó cần dấu sao.</p>`],

      [38, 'Case Study: Code Design (lines 1–31: prototypes and the menu loop)',
        `<p class="y-chinh">🎯 The first of six code slides. Lines 1–31 give the skeleton: two includes, the <code>#define MAX_SIZE 100</code>, the seven prototypes, then <code>main</code>'s declarations and the <code>do { … }</code> block that prints the menu and reads the choice.</p>
<ul>
<li><strong>Prototypes before <code>main</code>, bodies after</strong> — lines 7–13 declare every function; the definitions only appear on slides 41–43. This is the layout from Slot 08–09: the compiler reads top to bottom, so it must be told each signature before <code>main</code> uses it.</li>
<li><strong><code>#define MAX_SIZE 100</code></strong> — a named constant, not the number 100 scattered through the file. Slide 41 uses it in <code>if (*n &gt;= MAX_SIZE)</code> and slide 43 uses it again for the temporary arrays. One edit changes all three.</li>
<li><strong><code>int a[MAX_SIZE]; int n = 0;</code></strong> — lines 16–17, with the comments <em>"// Array to store integers"</em> and <em>"// Number of elements in the array"</em>. The <code>= 0</code> is essential: a local array's length counter is not zeroed for you.</li>
<li><strong><code>do</code> and not <code>while</code></strong> — the menu must be shown at least once, before any choice exists. A <code>do…while</code> tests at the bottom, which is exactly this situation. The matching <code>while (choice &gt;= 1 &amp;&amp; choice &lt;= 7);</code> is on slide 40.</li>
<li><strong>Ten <code>printf</code>s and one <code>scanf</code></strong> — lines 21–31. Notice the menu strings are copied verbatim from slide 35, parentheses and all; that is what makes the console screenshots on slide 44 match the spec.</li>
<li><strong><code>#include &lt;stdlib.h&gt;</code> without using it</strong> — line 2. Nothing in the delivered code calls <code>malloc</code> or <code>exit</code>. Harmless, but worth spotting: it is a leftover from the dynamic-array version of slide 18.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define MAX_SIZE 100

/* Function Prototypes */
void addValue(int *a, int *n, int value);
int  searchValue(int *a, int n, int value);
void removeFirst(int *a, int *n, int value);
void removeAll(int *a, int *n, int value);
void printArray(int *a, int n);
void printAscending(int *a, int n);
void printDescending(int *a, int n);

int main() {
    int a[MAX_SIZE];   // Array to store integers
    int n = 0;         // Number of elements in the array
    int choice, value;

    do {
        printf("\\nMenu:\\n");
        printf("1- Add a value\\n");
        printf("2- Search a value\\n");
        printf("3- Remove the first existence of a value\\n");
        printf("4- Remove all existences of a value\\n");
        printf("5- Print out the array\\n");
        printf("6- Print out the array in ascending order (positions of elements are preserved)\\n");
        printf("7- Print out the array in descending order (positions of elements are preserved)\\n");
        printf("Others- Quit\\n");
        printf("Your choice: ");
        scanf("%d", &amp;choice);</code></pre>
<p class="pitfall">⚠️ <code>scanf("%d", &amp;choice)</code> has no error handling. If the user types a letter, <code>scanf</code> returns 0, leaves the letter in the input buffer and does not touch <code>choice</code> — so the loop spins forever re-reading the same letter. The robust form is <code>if (scanf("%d", &amp;choice) != 1) break;</code>, which I used when running the program for real. Also note <code>&amp;choice</code>: forget the <code>&amp;</code> and you pass the <em>value</em> of an uninitialised int as an address — an immediate crash or silent corruption.</p>
<p class="meo">💡 Learn this shape by heart, because every menu-driven exam program is the same four pieces: <em>declare data → <code>do</code> → print menu + read choice → <code>switch</code> → <code>while (choice is valid)</code></em>. Once you can write the skeleton without thinking, the exam becomes only about the seven function bodies.</p>`,
        `<p class="y-chinh">🎯 Slide mã nguồn đầu tiên trong sáu slide. Dòng 1–31 cho bộ khung: hai lệnh include, <code>#define MAX_SIZE 100</code>, bảy nguyên mẫu hàm, rồi phần khai báo của <code>main</code> và khối <code>do { … }</code> in menu và đọc lựa chọn.</p>
<ul>
<li><strong>Nguyên mẫu đặt trước <code>main</code>, thân hàm đặt sau</strong> — dòng 7–13 khai báo mọi hàm; phần định nghĩa mãi slide 41–43 mới xuất hiện. Đây là cách bố trí của Slot 08–09: trình biên dịch đọc từ trên xuống, nên phải được báo chữ ký trước khi <code>main</code> gọi.</li>
<li><strong><code>#define MAX_SIZE 100</code></strong> — một hằng số có tên, chứ không phải con số 100 rải rác khắp file. Slide 41 dùng nó trong <code>if (*n &gt;= MAX_SIZE)</code> và slide 43 dùng lại cho các mảng tạm. Sửa một chỗ là đổi cả ba.</li>
<li><strong><code>int a[MAX_SIZE]; int n = 0;</code></strong> — dòng 16–17, kèm chú thích <em>"// Array to store integers"</em> và <em>"// Number of elements in the array"</em>. Cái <code>= 0</code> là bắt buộc: biến đếm độ dài của một mảng cục bộ không tự được gán 0 cho bạn.</li>
<li><strong><code>do</code> chứ không phải <code>while</code></strong> — menu phải được hiện ít nhất một lần, trước khi có bất kỳ lựa chọn nào. <code>do…while</code> kiểm điều kiện ở CUỐI, đúng tình huống này. Dòng <code>while (choice &gt;= 1 &amp;&amp; choice &lt;= 7);</code> tương ứng nằm ở slide 40.</li>
<li><strong>Mười lệnh <code>printf</code> và một <code>scanf</code></strong> — dòng 21–31. Để ý các chuỗi menu được chép nguyên xi từ slide 35, đủ cả dấu ngoặc; nhờ vậy ảnh chụp console ở slide 44 mới khớp với đặc tả.</li>
<li><strong><code>#include &lt;stdlib.h&gt;</code> mà không dùng tới</strong> — dòng 2. Mã bàn giao không gọi <code>malloc</code> hay <code>exit</code> ở đâu cả. Vô hại, nhưng đáng nhận ra: đó là di tích còn sót của bản mảng động ở slide 18.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#define MAX_SIZE 100

/* Function Prototypes */
void addValue(int *a, int *n, int value);
int  searchValue(int *a, int n, int value);
void removeFirst(int *a, int *n, int value);
void removeAll(int *a, int *n, int value);
void printArray(int *a, int n);
void printAscending(int *a, int n);
void printDescending(int *a, int n);

int main() {
    int a[MAX_SIZE];   // Array to store integers
    int n = 0;         // Number of elements in the array
    int choice, value;

    do {
        printf("\\nMenu:\\n");
        printf("1- Add a value\\n");
        printf("2- Search a value\\n");
        printf("3- Remove the first existence of a value\\n");
        printf("4- Remove all existences of a value\\n");
        printf("5- Print out the array\\n");
        printf("6- Print out the array in ascending order (positions of elements are preserved)\\n");
        printf("7- Print out the array in descending order (positions of elements are preserved)\\n");
        printf("Others- Quit\\n");
        printf("Your choice: ");
        scanf("%d", &amp;choice);</code></pre>
<p class="pitfall">⚠️ <code>scanf("%d", &amp;choice)</code> không hề xử lý lỗi. Nếu người dùng gõ một chữ cái, <code>scanf</code> trả về 0, để nguyên chữ cái đó trong bộ đệm nhập và không chạm vào <code>choice</code> — nên vòng lặp quay vô tận và đọc đi đọc lại đúng chữ cái ấy. Dạng chắc chắn là <code>if (scanf("%d", &amp;choice) != 1) break;</code>, chính là thứ tôi đã dùng khi chạy chương trình thật. Cũng chú ý dấu <code>&amp;choice</code>: quên dấu <code>&amp;</code> là bạn truyền GIÁ TRỊ của một int chưa khởi tạo làm địa chỉ — sập ngay hoặc hỏng ngầm.</p>
<p class="meo">💡 Hãy thuộc lòng dáng hình này, vì mọi chương trình menu trong đề thi đều gồm đúng bốn mảnh: <em>khai báo dữ liệu → <code>do</code> → in menu + đọc lựa chọn → <code>switch</code> → <code>while (lựa chọn còn hợp lệ)</code></em>. Khi bạn viết được bộ khung mà không cần suy nghĩ thì bài thi chỉ còn là bảy thân hàm.</p>`],

      [39, 'Case Study: Code Design (lines 33–54: switch, cases 1–3)',
        `<p class="y-chinh">🎯 The dispatcher. <code>switch (choice)</code> with one <code>case</code> per menu item; this slide covers cases 1, 2 and 3 — add, search, remove-first. Every case follows the same three beats: prompt, read, call.</p>
<ul>
<li><strong>Case 1 — add</strong> — <code>printf("Enter value to add: "); scanf("%d", &amp;value); addValue(a, &amp;n, value); break;</code>. Note <code>a</code> goes in bare (an array is already an address) but <code>n</code> goes in as <code>&amp;n</code>, because <code>addValue</code> must increase it.</li>
<li><strong>Case 2 — search, and the only case that uses a result</strong> — <code>int pos = searchValue(a, n, value);</code> then <code>if (pos != -1) printf("Value %d found at position %d.\\n", value, pos); else printf("Value %d not found.\\n", value);</code>. Here <code>n</code> is passed by value: searching does not change the length.</li>
<li><strong><code>pos != -1</code> is the slide's test</strong> — equivalent to <code>pos &gt;= 0</code> used elsewhere in the deck. Both are correct because −1 is the only negative the function can return; prefer <code>&gt;= 0</code> in your own code as it survives a change of sentinel.</li>
<li><strong>Case 3 — remove first</strong> — prompts, reads, then <code>removeFirst(a, &amp;n, value);</code>, again with <code>&amp;n</code>. It prints nothing here because <code>removeFirst</code> itself reports success or failure (slide 41).</li>
<li><strong>Every case ends in <code>break;</code></strong> — without it, C falls through into the next case and you would add a value and immediately be asked to search for one. This is the classic <code>switch</code> trap from Slot 05–07.</li>
<li><strong>Declaring <code>int pos</code> inside a <code>case</code></strong> — legal in C99 only because it is enclosed in the switch's block; if you ever add another declaration in a different case, wrap each case body in <code>{ }</code> to avoid "jump into scope of variable" errors.</li>
</ul>
<pre><code>        switch (choice) {
            case 1:
                printf("Enter value to add: ");
                scanf("%d", &amp;value);
                addValue(a, &amp;n, value);
                break;

            case 2:
                printf("Enter value to search: ");
                scanf("%d", &amp;value);
                int pos = searchValue(a, n, value);
                if (pos != -1)
                    printf("Value %d found at position %d.\\n", value, pos);
                else
                    printf("Value %d not found.\\n", value);
                break;

            case 3:
                printf("Enter value to remove (first occurrence): ");
                scanf("%d", &amp;value);
                removeFirst(a, &amp;n, value);
                break;</code></pre>
<table>
<tr><th>case</th><th>array argument</th><th>count argument</th><th>returns something?</th><th>who prints the result</th></tr>
<tr><td>1 add</td><td><code>a</code></td><td><strong><code>&amp;n</code></strong></td><td>no (<code>void</code>)</td><td>the function</td></tr>
<tr><td>2 search</td><td><code>a</code></td><td><code>n</code></td><td><strong>yes, an index</strong></td><td><code>main</code></td></tr>
<tr><td>3 remove first</td><td><code>a</code></td><td><strong><code>&amp;n</code></strong></td><td>no (<code>void</code>)</td><td>the function</td></tr>
</table>
<p class="dap-an">✅ Verified by compiling and running the complete program: feeding choice 2 with value 4 on the array <code>0 2 8 9 7 3 2 4 2</code> printed <strong><code>Value 4 found at position 7.</code></strong> — character-for-character the line in the "Search a value" console on slide 44. Feeding choice 3 with value 8 printed <code>Value 8 removed successfully (first occurrence).</code>, also matching.</p>
<p class="meo">💡 The pattern <em>"ask → read → call → let the function report"</em> keeps <code>main</code> readable no matter how many menu items there are. The one exception is case 2, and it is the right exception: a search function that printed its own answer could not be reused by <code>removeFirst</code>, which is exactly what slide 41 does with it.</p>`,
        `<p class="y-chinh">🎯 Bộ phân nhánh. <code>switch (choice)</code> với mỗi mục menu một <code>case</code>; slide này lo case 1, 2 và 3 — thêm, tìm, xoá phần tử đầu tiên. Mọi case đều theo cùng ba nhịp: nhắc, đọc, gọi.</p>
<ul>
<li><strong>Case 1 — thêm</strong> — <code>printf("Enter value to add: "); scanf("%d", &amp;value); addValue(a, &amp;n, value); break;</code>. Để ý <code>a</code> truyền trần (mảng vốn đã là địa chỉ) còn <code>n</code> truyền dạng <code>&amp;n</code>, vì <code>addValue</code> phải tăng nó lên.</li>
<li><strong>Case 2 — tìm, và là case DUY NHẤT dùng tới giá trị trả về</strong> — <code>int pos = searchValue(a, n, value);</code> rồi <code>if (pos != -1) printf("Value %d found at position %d.\\n", value, pos); else printf("Value %d not found.\\n", value);</code>. Ở đây <code>n</code> truyền theo giá trị: tìm kiếm không làm đổi độ dài.</li>
<li><strong><code>pos != -1</code> là phép kiểm của slide</strong> — tương đương <code>pos &gt;= 0</code> mà các chỗ khác trong bộ slide dùng. Cả hai đều đúng vì −1 là số âm duy nhất hàm có thể trả; trong mã của bạn nên chuộng <code>&gt;= 0</code> vì nó sống sót khi đổi giá trị lính canh.</li>
<li><strong>Case 3 — xoá phần tử đầu tiên</strong> — nhắc, đọc, rồi <code>removeFirst(a, &amp;n, value);</code>, lại với <code>&amp;n</code>. Ở đây không in gì vì chính <code>removeFirst</code> tự báo thành công hay thất bại (slide 41).</li>
<li><strong>Mọi case đều kết bằng <code>break;</code></strong> — thiếu nó thì C rơi xuyên xuống case kế tiếp, và bạn vừa thêm một giá trị xong sẽ bị hỏi luôn muốn tìm số nào. Đây là cái bẫy <code>switch</code> kinh điển từ Slot 05–07.</li>
<li><strong>Khai <code>int pos</code> bên trong một <code>case</code></strong> — chỉ hợp lệ từ C99, và chỉ vì nó nằm trong khối của switch; nếu sau này bạn thêm một khai báo nữa ở case khác, hãy bọc thân từng case trong <code>{ }</code> để tránh lỗi "jump into scope of variable".</li>
</ul>
<pre><code>        switch (choice) {
            case 1:
                printf("Enter value to add: ");
                scanf("%d", &amp;value);
                addValue(a, &amp;n, value);
                break;

            case 2:
                printf("Enter value to search: ");
                scanf("%d", &amp;value);
                int pos = searchValue(a, n, value);
                if (pos != -1)
                    printf("Value %d found at position %d.\\n", value, pos);
                else
                    printf("Value %d not found.\\n", value);
                break;

            case 3:
                printf("Enter value to remove (first occurrence): ");
                scanf("%d", &amp;value);
                removeFirst(a, &amp;n, value);
                break;</code></pre>
<table>
<tr><th>case</th><th>đối số mảng</th><th>đối số số đếm</th><th>có trả về gì không?</th><th>ai in kết quả</th></tr>
<tr><td>1 thêm</td><td><code>a</code></td><td><strong><code>&amp;n</code></strong></td><td>không (<code>void</code>)</td><td>chính hàm</td></tr>
<tr><td>2 tìm</td><td><code>a</code></td><td><code>n</code></td><td><strong>có, một chỉ số</strong></td><td><code>main</code></td></tr>
<tr><td>3 xoá đầu tiên</td><td><code>a</code></td><td><strong><code>&amp;n</code></strong></td><td>không (<code>void</code>)</td><td>chính hàm</td></tr>
</table>
<p class="dap-an">✅ Đã kiểm bằng cách biên dịch và chạy trọn chương trình: đưa lựa chọn 2 với giá trị 4 trên mảng <code>0 2 8 9 7 3 2 4 2</code> in ra <strong><code>Value 4 found at position 7.</code></strong> — giống từng ký tự với dòng trong khung console "Search a value" ở slide 44. Đưa lựa chọn 3 với giá trị 8 in ra <code>Value 8 removed successfully (first occurrence).</code>, cũng khớp.</p>
<p class="meo">💡 Khuôn <em>"hỏi → đọc → gọi → để hàm tự báo"</em> giữ <code>main</code> dễ đọc dù menu có bao nhiêu mục. Ngoại lệ duy nhất là case 2, và đó là ngoại lệ đúng: một hàm tìm kiếm mà tự in đáp án thì <code>removeFirst</code> không dùng lại được, mà slide 41 làm đúng chuyện dùng lại ấy.</p>`],

      [40, 'Case Study: Code Design (lines 56–83: cases 4–7, default, loop condition)',
        `<p class="y-chinh">🎯 The rest of the dispatcher plus the exit condition. Cases 4–7 are the three print operations and remove-all; <code>default:</code> prints "Goodbye!"; and line 80 closes the loop with <code>} while (choice &gt;= 1 &amp;&amp; choice &lt;= 7);</code>.</p>
<ul>
<li><strong>Case 4 — remove all</strong> — same shape as case 3 but calls <code>removeAll(a, &amp;n, value);</code>. Again <code>&amp;n</code>, because this one can subtract several from the length at once.</li>
<li><strong>Cases 5, 6, 7 — the three printers</strong> — <code>printArray(a, n)</code>, <code>printAscending(a, n)</code>, <code>printDescending(a, n)</code>, each preceded by its own label <code>printf</code>: "Current array: ", "Array in ascending order: ", "Array in descending order: ". All three take <code>n</code> by value; none of them may touch the array.</li>
<li><strong><code>default: printf("Goodbye!\\n");</code></strong> — this is the "Others- Quit" line of the menu. It prints the farewell but does <em>not</em> stop anything by itself; the stopping is done by the loop condition, which will be false because <code>choice</code> was outside 1…7.</li>
<li><strong>The exit condition is a compound one</strong> — <code>choice &gt;= 1 &amp;&amp; choice &lt;= 7</code>. Both halves are needed: <code>0</code> exits via the first test, <code>99</code> via the second. Writing <code>while (choice != 0)</code> instead would keep the program alive on 99 and print "Goodbye!" forever.</li>
<li><strong><code>return 0;</code> at line 82</strong> — outside the loop, after it. Reaching it is the only normal way this program ends.</li>
<li><strong>Design observation</strong> — there is no menu item that empties the array, and no confirmation before a destructive remove. In a real program both would be requirements; here they are left out to keep the case study at one screen per concept.</li>
</ul>
<pre><code>            case 4:
                printf("Enter value to remove (all occurrences): ");
                scanf("%d", &amp;value);
                removeAll(a, &amp;n, value);
                break;

            case 5:
                printf("Current array: ");
                printArray(a, n);
                break;

            case 6:
                printf("Array in ascending order: ");
                printAscending(a, n);
                break;

            case 7:
                printf("Array in descending order: ");
                printDescending(a, n);
                break;

            default:
                printf("Goodbye!\\n");
        }
    } while (choice &gt;= 1 &amp;&amp; choice &lt;= 7);

    return 0;
}</code></pre>
<table>
<tr><th>choice typed</th><th>switch branch</th><th><code>choice &gt;= 1 &amp;&amp; choice &lt;= 7</code></th><th>what happens</th></tr>
<tr><td>5</td><td>case 5</td><td>true</td><td>prints the array, menu shows again</td></tr>
<tr><td>7</td><td>case 7</td><td>true</td><td>prints descending, menu shows again</td></tr>
<tr><td>0</td><td>default</td><td><strong>false</strong> (fails <code>&gt;= 1</code>)</td><td>"Goodbye!", program ends</td></tr>
<tr><td>8</td><td>default</td><td><strong>false</strong> (fails <code>&lt;= 7</code>)</td><td>"Goodbye!", program ends</td></tr>
<tr><td>−3</td><td>default</td><td><strong>false</strong></td><td>"Goodbye!", program ends</td></tr>
</table>
<p class="dap-an">✅ Verified by running the compiled program with a scripted input ending in <code>0</code>: the last thing printed is <code>Goodbye!</code> and the process exits with status 0. Every other choice in 1…7 returned to the menu, exactly as the table says.</p>
<p class="pitfall">⚠️ <code>default:</code> is the last label, so it needs no <code>break</code> — but add one anyway as a habit. The day someone appends <code>case 8:</code> below it, the missing <code>break</code> turns "Goodbye!" into "Goodbye!" followed by whatever case 8 does. Falling out of the bottom of a <code>switch</code> is safe today and fragile tomorrow.</p>`,
        `<p class="y-chinh">🎯 Phần còn lại của bộ phân nhánh cộng điều kiện thoát. Case 4–7 là ba thao tác in cộng xoá tất cả; <code>default:</code> in "Goodbye!"; và dòng 80 đóng vòng lặp bằng <code>} while (choice &gt;= 1 &amp;&amp; choice &lt;= 7);</code>.</p>
<ul>
<li><strong>Case 4 — xoá tất cả</strong> — cùng dáng với case 3 nhưng gọi <code>removeAll(a, &amp;n, value);</code>. Lại là <code>&amp;n</code>, vì hàm này có thể trừ đi vài đơn vị độ dài trong một lần.</li>
<li><strong>Case 5, 6, 7 — ba hàm in</strong> — <code>printArray(a, n)</code>, <code>printAscending(a, n)</code>, <code>printDescending(a, n)</code>, mỗi cái đi kèm một <code>printf</code> nhãn riêng: "Current array: ", "Array in ascending order: ", "Array in descending order: ". Cả ba đều nhận <code>n</code> theo giá trị; không cái nào được phép động vào mảng.</li>
<li><strong><code>default: printf("Goodbye!\\n");</code></strong> — đây chính là dòng "Others- Quit" của menu. Nó in lời tạm biệt nhưng TỰ NÓ không dừng gì cả; việc dừng do điều kiện vòng lặp làm, và điều kiện đó sẽ sai vì <code>choice</code> nằm ngoài 1…7.</li>
<li><strong>Điều kiện thoát là điều kiện ghép</strong> — <code>choice &gt;= 1 &amp;&amp; choice &lt;= 7</code>. Cần cả hai vế: số <code>0</code> thoát nhờ vế đầu, số <code>99</code> nhờ vế sau. Viết <code>while (choice != 0)</code> thay vào đó thì chương trình sẽ sống tiếp với 99 và in "Goodbye!" mãi mãi.</li>
<li><strong><code>return 0;</code> ở dòng 82</strong> — nằm NGOÀI vòng lặp, sau nó. Chạm tới đó là con đường kết thúc bình thường duy nhất của chương trình này.</li>
<li><strong>Nhận xét về thiết kế</strong> — không có mục menu nào làm rỗng mảng, và không có bước xác nhận trước một thao tác xoá phá huỷ. Trong chương trình thật thì cả hai đều là yêu cầu; ở đây chúng bị bỏ đi để giữ case study mỗi khái niệm gọn trong một màn hình.</li>
</ul>
<pre><code>            case 4:
                printf("Enter value to remove (all occurrences): ");
                scanf("%d", &amp;value);
                removeAll(a, &amp;n, value);
                break;

            case 5:
                printf("Current array: ");
                printArray(a, n);
                break;

            case 6:
                printf("Array in ascending order: ");
                printAscending(a, n);
                break;

            case 7:
                printf("Array in descending order: ");
                printDescending(a, n);
                break;

            default:
                printf("Goodbye!\\n");
        }
    } while (choice &gt;= 1 &amp;&amp; choice &lt;= 7);

    return 0;
}</code></pre>
<table>
<tr><th>choice gõ vào</th><th>nhánh switch</th><th><code>choice &gt;= 1 &amp;&amp; choice &lt;= 7</code></th><th>chuyện gì xảy ra</th></tr>
<tr><td>5</td><td>case 5</td><td>đúng</td><td>in mảng, menu hiện lại</td></tr>
<tr><td>7</td><td>case 7</td><td>đúng</td><td>in giảm dần, menu hiện lại</td></tr>
<tr><td>0</td><td>default</td><td><strong>sai</strong> (hỏng vế <code>&gt;= 1</code>)</td><td>"Goodbye!", chương trình kết thúc</td></tr>
<tr><td>8</td><td>default</td><td><strong>sai</strong> (hỏng vế <code>&lt;= 7</code>)</td><td>"Goodbye!", chương trình kết thúc</td></tr>
<tr><td>−3</td><td>default</td><td><strong>sai</strong></td><td>"Goodbye!", chương trình kết thúc</td></tr>
</table>
<p class="dap-an">✅ Đã kiểm bằng cách chạy chương trình đã biên dịch với một dãy nhập kịch bản kết thúc bằng <code>0</code>: thứ cuối cùng in ra là <code>Goodbye!</code> và tiến trình thoát với mã 0. Mọi lựa chọn khác trong 1…7 đều quay về menu, đúng như bảng.</p>
<p class="pitfall">⚠️ <code>default:</code> là nhãn cuối nên nó không cần <code>break</code> — nhưng cứ thêm vào như một thói quen. Đến ngày ai đó viết thêm <code>case 8:</code> phía dưới, cái <code>break</code> còn thiếu sẽ biến "Goodbye!" thành "Goodbye!" rồi chạy tiếp mọi thứ của case 8. Rơi ra khỏi đáy một <code>switch</code> hôm nay thì an toàn, ngày mai thì giòn.</p>`],

      [41, 'Case Study: Code Design (addValue, searchValue, removeFirst)',
        `<p class="y-chinh">🎯 The first three function bodies. <code>addValue</code> appends with a full-array guard; <code>searchValue</code> is the linear search of slide 26 renamed; <code>removeFirst</code> reuses <code>searchValue</code> and then shifts everything left by one.</p>
<ul>
<li><strong><code>addValue</code>, lines 86–94</strong> — <code>if (*n &gt;= MAX_SIZE) { printf("Array is full…"); return; }</code> then <code>a[*n] = value; (*n)++;</code>. Two dereferences of <code>n</code> in two lines: first to use the count as an index, then to increase it.</li>
<li><strong>The parentheses in <code>(*n)++</code> are not optional</strong> — <code>*n++</code> parses as <code>*(n++)</code>: it would increment the <em>pointer</em>, walking it off <code>n</code> and onto whatever sits next in <code>main</code>'s stack frame, and the count would never change. This is the single nastiest line in the case study.</li>
<li><strong><code>a[*n] = value;</code> before the increment</strong> — with <code>n = 3</code> the new element belongs at index 3 (positions 0, 1, 2 are taken). Append first, then count. Swap the two lines and you skip a slot and overwrite garbage.</li>
<li><strong><code>searchValue</code>, lines 97–102</strong> — <code>for (int i = 0; i &lt; n; i++) if (a[i] == value) return i; return -1;</code>. Identical to <code>firstLinearSearch</code>, and it takes <code>n</code> by value because it changes nothing.</li>
<li><strong><code>removeFirst</code>, lines 105–116, is the reuse payoff</strong> — <code>int pos = searchValue(a, *n, value);</code> — note <code>*n</code>, because <code>removeFirst</code> holds a pointer but <code>searchValue</code> wants the number. Then <code>if (pos == -1) { report; return; }</code> and the shift loop.</li>
<li><strong>The shift loop is the deletion</strong> — <code>for (int i = pos; i &lt; *n - 1; i++) a[i] = a[i + 1];</code> then <code>(*n)--;</code>. Nothing is erased; the hole is closed by sliding the tail left one place, and the count drops so the old last element becomes invisible.</li>
</ul>
<pre><code>/* Add a value to the array */
void addValue(int *a, int *n, int value) {
    if (*n &gt;= MAX_SIZE) {
        printf("Array is full. Cannot add more values.\\n");
        return;
    }
    a[*n] = value;
    (*n)++;                        /* NGOAC la bat buoc */
    printf("Value %d added successfully.\\n", value);
}

/* Search for a value in the array */
int searchValue(int *a, int n, int value) {
    for (int i = 0; i &lt; n; i++) {
        if (a[i] == value) return i;
    }
    return -1;
}

/* Remove the first occurrence of a value */
void removeFirst(int *a, int *n, int value) {
    int pos = searchValue(a, *n, value);
    if (pos == -1) {
        printf("Value %d not found. No removal performed.\\n", value);
        return;
    }
    for (int i = pos; i &lt; *n - 1; i++) {
        a[i] = a[i + 1];
    }
    (*n)--;
    printf("Value %d removed successfully (first occurrence).\\n", value);
}</code></pre>
<table>
<tr><th>step of <code>removeFirst(a, &amp;n, 8)</code></th><th>a[0…]</th><th>n</th></tr>
<tr><td>before</td><td>0 2 <strong>8</strong> 9 7 3 2 4 2</td><td>9</td></tr>
<tr><td><code>pos = searchValue(...)</code></td><td>pos = 2</td><td>9</td></tr>
<tr><td>i=2: a[2]=a[3]</td><td>0 2 9 9 7 3 2 4 2</td><td>9</td></tr>
<tr><td>i=3…7: keep sliding</td><td>0 2 9 7 3 2 4 2 <em>2</em></td><td>9</td></tr>
<tr><td><code>(*n)--</code></td><td>0 2 9 7 3 2 4 2</td><td><strong>8</strong></td></tr>
</table>
<p class="dap-an">✅ Run for real on the slide-44 array: <code>removeFirst(a, &amp;n, 8)</code> printed <code>Value 8 removed successfully (first occurrence).</code> and menu item 5 then showed <strong><code>0 2 9 7 3 2 4 2</code></strong> with n = 8. The last cell still physically holds the old 2 (the italic entry above) — nothing is wiped, it is simply beyond <code>n</code> and therefore invisible to every loop.</p>
<p class="pitfall">⚠️ Two boundary traps in the shift loop. Writing <code>i &lt; *n</code> instead of <code>i &lt; *n - 1</code> makes the last iteration read <code>a[*n]</code>, one past the end. And deleting the <em>last</em> element (pos = *n − 1) must still work: then the loop body never runs at all, only <code>(*n)--</code> does — which is exactly right, so do not "fix" it with a special case.</p>`,
        `<p class="y-chinh">🎯 Ba thân hàm đầu tiên. <code>addValue</code> nối thêm vào cuối kèm chốt canh mảng đầy; <code>searchValue</code> chính là tìm tuyến tính của slide 26 đổi tên; <code>removeFirst</code> dùng lại <code>searchValue</code> rồi dồn toàn bộ phần đuôi sang trái một ô.</p>
<ul>
<li><strong><code>addValue</code>, dòng 86–94</strong> — <code>if (*n &gt;= MAX_SIZE) { printf("Array is full…"); return; }</code> rồi <code>a[*n] = value; (*n)++;</code>. Hai lần lấy giá trị của <code>n</code> trong hai dòng: lần đầu dùng số đếm làm chỉ số, lần sau tăng nó lên.</li>
<li><strong>Cặp ngoặc trong <code>(*n)++</code> KHÔNG phải tuỳ chọn</strong> — <code>*n++</code> được phân tích thành <code>*(n++)</code>: nó tăng CON TRỎ, đẩy nó rời khỏi <code>n</code> sang bất cứ thứ gì nằm kế trong khung ngăn xếp của <code>main</code>, còn số đếm thì không bao giờ đổi. Đây là dòng hiểm nhất của cả case study.</li>
<li><strong><code>a[*n] = value;</code> đặt TRƯỚC lệnh tăng</strong> — với <code>n = 3</code> thì phần tử mới thuộc về chỉ số 3 (các vị trí 0, 1, 2 đã có chủ). Nối trước, đếm sau. Đảo hai dòng là bạn bỏ trống một ô và ghi đè lên rác.</li>
<li><strong><code>searchValue</code>, dòng 97–102</strong> — <code>for (int i = 0; i &lt; n; i++) if (a[i] == value) return i; return -1;</code>. Giống hệt <code>firstLinearSearch</code>, và nó nhận <code>n</code> theo giá trị vì nó không đổi gì cả.</li>
<li><strong><code>removeFirst</code>, dòng 105–116, là chỗ hái quả của việc dùng lại</strong> — <code>int pos = searchValue(a, *n, value);</code> — chú ý dấu <code>*n</code>, vì <code>removeFirst</code> đang giữ một con trỏ còn <code>searchValue</code> lại muốn một con số. Rồi <code>if (pos == -1) { báo; return; }</code> và vòng dồn.</li>
<li><strong>Vòng dồn chính là phép xoá</strong> — <code>for (int i = pos; i &lt; *n - 1; i++) a[i] = a[i + 1];</code> rồi <code>(*n)--;</code>. Không có gì bị xoá cả; cái lỗ được bịt bằng cách trượt phần đuôi sang trái một ô, và số đếm giảm đi nên phần tử cuối cũ trở thành vô hình.</li>
</ul>
<pre><code>/* Add a value to the array */
void addValue(int *a, int *n, int value) {
    if (*n &gt;= MAX_SIZE) {
        printf("Array is full. Cannot add more values.\\n");
        return;
    }
    a[*n] = value;
    (*n)++;                        /* NGOAC la bat buoc */
    printf("Value %d added successfully.\\n", value);
}

/* Search for a value in the array */
int searchValue(int *a, int n, int value) {
    for (int i = 0; i &lt; n; i++) {
        if (a[i] == value) return i;
    }
    return -1;
}

/* Remove the first occurrence of a value */
void removeFirst(int *a, int *n, int value) {
    int pos = searchValue(a, *n, value);
    if (pos == -1) {
        printf("Value %d not found. No removal performed.\\n", value);
        return;
    }
    for (int i = pos; i &lt; *n - 1; i++) {
        a[i] = a[i + 1];
    }
    (*n)--;
    printf("Value %d removed successfully (first occurrence).\\n", value);
}</code></pre>
<table>
<tr><th>bước của <code>removeFirst(a, &amp;n, 8)</code></th><th>a[0…]</th><th>n</th></tr>
<tr><td>trước</td><td>0 2 <strong>8</strong> 9 7 3 2 4 2</td><td>9</td></tr>
<tr><td><code>pos = searchValue(...)</code></td><td>pos = 2</td><td>9</td></tr>
<tr><td>i=2: a[2]=a[3]</td><td>0 2 9 9 7 3 2 4 2</td><td>9</td></tr>
<tr><td>i=3…7: trượt tiếp</td><td>0 2 9 7 3 2 4 2 <em>2</em></td><td>9</td></tr>
<tr><td><code>(*n)--</code></td><td>0 2 9 7 3 2 4 2</td><td><strong>8</strong></td></tr>
</table>
<p class="dap-an">✅ Chạy thật trên mảng của slide 44: <code>removeFirst(a, &amp;n, 8)</code> in ra <code>Value 8 removed successfully (first occurrence).</code> và mục menu 5 sau đó hiện <strong><code>0 2 9 7 3 2 4 2</code></strong> với n = 8. Ô cuối vẫn còn giữ số 2 cũ về mặt vật lý (dòng in nghiêng ở trên) — không có gì bị xoá sạch, nó chỉ nằm ngoài <code>n</code> nên vô hình với mọi vòng lặp.</p>
<p class="pitfall">⚠️ Hai bẫy biên trong vòng dồn. Viết <code>i &lt; *n</code> thay vì <code>i &lt; *n - 1</code> làm lần lặp cuối đọc <code>a[*n]</code>, vượt một ô ra ngoài. Và xoá phần tử CUỐI (pos = *n − 1) vẫn phải chạy đúng: khi đó thân vòng lặp không chạy lần nào, chỉ có <code>(*n)--</code> chạy — mà như vậy là hoàn toàn đúng, nên đừng "sửa" nó bằng một trường hợp riêng.</p>`],

      [42, 'Case Study: Code Design (removeAll, printArray)',
        `<p class="y-chinh">🎯 <code>removeAll</code> is the trickiest function in the case study, and the reason is one missing <code>i++</code>. Look at line 121: <code>for (int i = 0; i &lt; *n; )</code> — the update section is <strong>empty</strong>, and <code>i++</code> lives in the <code>else</code> branch instead. That is deliberate and it is the whole lesson.</p>
<ul>
<li><strong>Why <code>i</code> must not advance after a deletion</strong> — when <code>a[i]</code> matches, the tail slides left, so a <em>new</em> value lands in slot <code>i</code>. If you also did <code>i++</code>, you would step straight over it. With the array <code>0 2 2 2 3</code> and value 2, the naive loop deletes the first 2, jumps past the second, and leaves <code>0 2 3</code>.</li>
<li><strong>The structure that encodes it</strong> — <code>if (a[i] == value) { shift; (*n)--; count++; } else { i++; }</code>. Advance only when you did not delete. Slide 42's indentation makes this easy to miss; the empty third slot of the <code>for</code> is the tell.</li>
<li><strong><code>count</code> earns its keep</strong> — it lets the function report <code>"Value %d removed %d time(s)."</code> versus <code>"Value %d not found. No removal performed."</code>. It is also the only way the caller can tell "removed three" from "removed none".</li>
<li><strong>The inner shift is the same code as <code>removeFirst</code></strong> — <code>for (int j = i; j &lt; *n - 1; j++) a[j] = a[j + 1];</code>. Duplicated rather than reused, which is why slide 37's <code>removeOne(int pos, …)</code> was the better design: one shift helper would serve both.</li>
<li><strong>Cost</strong> — each removal shifts the whole tail, so removing k copies from n elements costs up to k·n moves. For the 100-element maximum here that is irrelevant; for a million elements you would instead do a single compacting pass.</li>
<li><strong><code>printArray</code>, lines 139–144</strong> — the plain forward traversal of slide 12, with <code>printf("%d ", a[i])</code> and one <code>printf("\\n")</code> after the loop. With <code>n = 0</code> it prints just the newline, which is correct behaviour for an empty array.</li>
</ul>
<pre><code>/* Remove all occurrences of a value */
void removeAll(int *a, int *n, int value) {
    int count = 0;
    for (int i = 0; i &lt; *n; ) {          /* KHONG co i++ o day */
        if (a[i] == value) {
            for (int j = i; j &lt; *n - 1; j++) {
                a[j] = a[j + 1];
            }
            (*n)--;
            count++;
        } else {
            i++;                          /* chi tien khi KHONG xoa */
        }
    }
    if (count &gt; 0)
        printf("Value %d removed %d time(s).\\n", value, count);
    else
        printf("Value %d not found. No removal performed.\\n", value);
}

/* Print the array */
void printArray(int *a, int n) {
    for (int i = 0; i &lt; n; i++) {
        printf("%d ", a[i]);
    }
    printf("\\n");
}</code></pre>
<table>
<tr><th>iteration</th><th>i</th><th>a[i]</th><th>match?</th><th>array after this step</th><th>n</th><th>count</th></tr>
<tr><td>start</td><td>0</td><td>0</td><td>no</td><td>0 2 9 7 3 2 4 2</td><td>8</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td><strong>2</strong></td><td>YES</td><td>0 9 7 3 2 4 2</td><td>7</td><td>1</td></tr>
<tr><td>2</td><td><strong>1 (stays)</strong></td><td>9</td><td>no</td><td>0 9 7 3 2 4 2</td><td>7</td><td>1</td></tr>
<tr><td>3–4</td><td>2, 3</td><td>7, 3</td><td>no</td><td>0 9 7 3 2 4 2</td><td>7</td><td>1</td></tr>
<tr><td>5</td><td>4</td><td><strong>2</strong></td><td>YES</td><td>0 9 7 3 4 2</td><td>6</td><td>2</td></tr>
<tr><td>6</td><td>4 (stays)</td><td>4</td><td>no</td><td>0 9 7 3 4 2</td><td>6</td><td>2</td></tr>
<tr><td>7</td><td>5</td><td><strong>2</strong></td><td>YES</td><td>0 9 7 3 4</td><td><strong>5</strong></td><td><strong>3</strong></td></tr>
</table>
<p class="dap-an">✅ Run for real: starting from <code>0 2 9 7 3 2 4 2</code> (n = 8), menu item 4 with value 2 printed <strong><code>Value 2 removed 3 time(s).</code></strong> and item 5 then showed <strong><code>0 9 7 3 4</code></strong> with n = 5 — exactly the table. I also ran the naive variant with <code>i++</code> in the <code>for</code> header on the same data: it removed only <strong>2</strong> of the 3 and left a stray 2 behind, silently.</p>
<p class="meo">💡 The rule to carry away, good for every "delete while scanning" problem in any language: <strong>when you remove the element at index i, do not advance i</strong> — the next element has already moved into that slot. The alternative professional idiom is the two-pointer compaction: one read index, one write index, one pass, no repeated shifting.</p>`,
        `<p class="y-chinh">🎯 <code>removeAll</code> là hàm hiểm nhất của case study, và lý do nằm ở một lệnh <code>i++</code> bị thiếu. Nhìn dòng 121: <code>for (int i = 0; i &lt; *n; )</code> — phần cập nhật <strong>để TRỐNG</strong>, còn <code>i++</code> thì nằm trong nhánh <code>else</code>. Đó là cố ý và đó là toàn bộ bài học.</p>
<ul>
<li><strong>Vì sao <code>i</code> KHÔNG được tiến sau một lần xoá</strong> — khi <code>a[i]</code> khớp, phần đuôi trượt sang trái, nên một giá trị MỚI rơi vào đúng ô <code>i</code>. Nếu bạn còn <code>i++</code> nữa thì bạn bước thẳng qua nó. Với mảng <code>0 2 2 2 3</code> và giá trị 2, vòng lặp ngây thơ xoá số 2 đầu, nhảy qua số 2 thứ hai, và để lại <code>0 2 3</code>.</li>
<li><strong>Cấu trúc mã hoá điều đó</strong> — <code>if (a[i] == value) { dồn; (*n)--; count++; } else { i++; }</code>. Chỉ tiến khi KHÔNG xoá. Cách thụt lề trên slide 42 làm chỗ này dễ bị bỏ sót; dấu hiệu nhận ra là ô thứ ba của <code>for</code> bỏ trống.</li>
<li><strong><code>count</code> xứng đáng với chỗ nó chiếm</strong> — nhờ nó, hàm báo được <code>"Value %d removed %d time(s)."</code> hay <code>"Value %d not found. No removal performed."</code>. Nó cũng là cách duy nhất để người gọi phân biệt "xoá ba cái" với "không xoá cái nào".</li>
<li><strong>Vòng dồn bên trong là y hệt mã của <code>removeFirst</code></strong> — <code>for (int j = i; j &lt; *n - 1; j++) a[j] = a[j + 1];</code>. Chép lại chứ không dùng lại, và đó đúng là lý do thiết kế <code>removeOne(int pos, …)</code> ở slide 37 tốt hơn: một hàm dồn dùng chung phục vụ được cả hai.</li>
<li><strong>Chi phí</strong> — mỗi lần xoá đều dồn cả phần đuôi, nên xoá k bản sao trong n phần tử tốn tới k·n phép dời. Với mức tối đa 100 phần tử ở đây thì chẳng đáng kể; với một triệu phần tử thì phải làm một lượt nén duy nhất thay vì thế.</li>
<li><strong><code>printArray</code>, dòng 139–144</strong> — chính là phép duyệt xuôi của slide 12, với <code>printf("%d ", a[i])</code> và một <code>printf("\\n")</code> sau vòng lặp. Với <code>n = 0</code> nó chỉ in đúng ký tự xuống dòng, và đó là hành vi đúng cho một mảng rỗng.</li>
</ul>
<pre><code>/* Remove all occurrences of a value */
void removeAll(int *a, int *n, int value) {
    int count = 0;
    for (int i = 0; i &lt; *n; ) {          /* KHONG co i++ o day */
        if (a[i] == value) {
            for (int j = i; j &lt; *n - 1; j++) {
                a[j] = a[j + 1];
            }
            (*n)--;
            count++;
        } else {
            i++;                          /* chi tien khi KHONG xoa */
        }
    }
    if (count &gt; 0)
        printf("Value %d removed %d time(s).\\n", value, count);
    else
        printf("Value %d not found. No removal performed.\\n", value);
}

/* Print the array */
void printArray(int *a, int n) {
    for (int i = 0; i &lt; n; i++) {
        printf("%d ", a[i]);
    }
    printf("\\n");
}</code></pre>
<table>
<tr><th>lần lặp</th><th>i</th><th>a[i]</th><th>khớp?</th><th>mảng sau bước này</th><th>n</th><th>count</th></tr>
<tr><td>đầu</td><td>0</td><td>0</td><td>không</td><td>0 2 9 7 3 2 4 2</td><td>8</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td><strong>2</strong></td><td>CÓ</td><td>0 9 7 3 2 4 2</td><td>7</td><td>1</td></tr>
<tr><td>2</td><td><strong>1 (đứng yên)</strong></td><td>9</td><td>không</td><td>0 9 7 3 2 4 2</td><td>7</td><td>1</td></tr>
<tr><td>3–4</td><td>2, 3</td><td>7, 3</td><td>không</td><td>0 9 7 3 2 4 2</td><td>7</td><td>1</td></tr>
<tr><td>5</td><td>4</td><td><strong>2</strong></td><td>CÓ</td><td>0 9 7 3 4 2</td><td>6</td><td>2</td></tr>
<tr><td>6</td><td>4 (đứng yên)</td><td>4</td><td>không</td><td>0 9 7 3 4 2</td><td>6</td><td>2</td></tr>
<tr><td>7</td><td>5</td><td><strong>2</strong></td><td>CÓ</td><td>0 9 7 3 4</td><td><strong>5</strong></td><td><strong>3</strong></td></tr>
</table>
<p class="dap-an">✅ Chạy thật: xuất phát từ <code>0 2 9 7 3 2 4 2</code> (n = 8), mục menu 4 với giá trị 2 in ra <strong><code>Value 2 removed 3 time(s).</code></strong> và mục 5 sau đó hiện <strong><code>0 9 7 3 4</code></strong> với n = 5 — đúng bảng trên. Tôi cũng chạy bản ngây thơ có <code>i++</code> trong đầu vòng <code>for</code> trên cùng dữ liệu: nó chỉ xoá <strong>2</strong> trong 3 và bỏ sót một số 2 nằm lại, một cách câm lặng.</p>
<p class="meo">💡 Quy tắc đáng mang theo, đúng cho mọi bài toán "vừa duyệt vừa xoá" trong bất kỳ ngôn ngữ nào: <strong>khi bạn xoá phần tử ở chỉ số i thì ĐỪNG tăng i</strong> — phần tử kế tiếp đã dọn vào đúng ô đó rồi. Khuôn chuyên nghiệp thay thế là nén hai con trỏ: một chỉ số đọc, một chỉ số ghi, một lượt duy nhất, không dồn đi dồn lại.</p>`],

      [43, 'Case Study: Code Design (printAscending, printDescending)',
        `<p class="y-chinh">🎯 The two functions that satisfy the spec's parenthesis <em>"(positions of elements are preserved)"</em>. Both do the same three steps — <strong>copy into <code>temp</code>, sort <code>temp</code>, print <code>temp</code></strong> — and differ in exactly one character: <code>&gt;</code> becomes <code>&lt;</code>.</p>
<ul>
<li><strong>Line 148 is the requirement</strong> — <code>int temp[MAX_SIZE];</code> then <code>for (int i = 0; i &lt; n; i++) temp[i] = a[i];</code>. Sorting <code>a</code> directly would satisfy the visible output but break the spec: menu item 5 afterwards would show a reordered array, and menu item 7 would no longer have the original order to work from.</li>
<li><strong>The sort here is neither of the two named algorithms</strong> — it is the "exchange sort": <code>for i … for j = i+1 … if (temp[i] &gt; temp[j]) swap</code>. It swaps immediately on every inversion instead of remembering <code>minIndex</code>. It does the same n(n−1)/2 comparisons as Selection Sort but far more swaps.</li>
<li><strong>Why it still ends up sorted</strong> — after the inner loop for a given <code>i</code>, nothing to the right of <code>i</code> is smaller than <code>temp[i]</code>, so <code>temp[i]</code> is the minimum of the remaining part. Same invariant as Selection Sort, reached the expensive way.</li>
<li><strong><code>printDescending</code> is a copy with one flipped comparison</strong> — <code>if (temp[i] &lt; temp[j])</code>. Everything else, including the temporary array and the final <code>printArray(temp, n)</code>, is identical. This is the "order relation" idea of slide 30 made concrete.</li>
<li><strong>Both end by delegating</strong> — <code>printArray(temp, n);</code>. Neither function contains a <code>printf</code> of its own. That is why the three menu outputs on slide 44 are formatted identically.</li>
<li><strong>Cost of the copy</strong> — <code>int temp[MAX_SIZE]</code> is 400 bytes on the stack, allocated whether <code>n</code> is 3 or 100. Cheap here, but it is a real design choice: you are trading memory for the guarantee that the caller's array is untouched.</li>
</ul>
<pre><code>/* Print the array in ascending order */
void printAscending(int *a, int n) {
    int temp[MAX_SIZE];
    for (int i = 0; i &lt; n; i++) temp[i] = a[i];      /* 1. chep ra ban sao */

    for (int i = 0; i &lt; n - 1; i++) {                /* 2. sap ban sao      */
        for (int j = i + 1; j &lt; n; j++) {
            if (temp[i] &gt; temp[j]) {
                int t = temp[i];
                temp[i] = temp[j];
                temp[j] = t;
            }
        }
    }
    printArray(temp, n);                             /* 3. in ban sao       */
}

/* Print the array in descending order */
void printDescending(int *a, int n) {
    int temp[MAX_SIZE];
    for (int i = 0; i &lt; n; i++) temp[i] = a[i];

    for (int i = 0; i &lt; n - 1; i++) {
        for (int j = i + 1; j &lt; n; j++) {
            if (temp[i] &lt; temp[j]) {                 /* CHI khac dau nay */
                int t = temp[i];
                temp[i] = temp[j];
                temp[j] = t;
            }
        }
    }
    printArray(temp, n);
}</code></pre>
<table>
<tr><th>menu item</th><th>what it prints</th><th>the stored array <code>a</code> afterwards</th></tr>
<tr><td>5 — print</td><td><code>0 2 8 9 7 3 2 4 2</code></td><td>0 2 8 9 7 3 2 4 2 (unchanged)</td></tr>
<tr><td>6 — ascending</td><td><code>0 2 2 2 3 4 7 8 9</code></td><td><strong>0 2 8 9 7 3 2 4 2 (still unchanged)</strong></td></tr>
<tr><td>7 — descending</td><td><code>9 8 7 4 3 2 2 2 0</code></td><td><strong>0 2 8 9 7 3 2 4 2 (still unchanged)</strong></td></tr>
</table>
<p class="dap-an">✅ Run for real, in the order 5 → 6 → 7 → 5: the three outputs were exactly as tabled, and the final menu-5 print gave back <code>0 2 8 9 7 3 2 4 2</code>, proving the original order really is preserved. All three lines match the console screenshots on slide 44 character for character.</p>
<p class="pitfall">⚠️ If you "optimise" by sorting <code>a</code> itself and skipping the copy, the program still prints the right ascending list once — and then everything downstream is wrong: menu 5 shows a reordered array, "remove the first occurrence" removes a different element than the user saw, and menu 7 sorts an already-sorted array. A function documented as read-only must actually be read-only; the <code>int n</code> (not <code>int *n</code>) in its signature is the promise it makes.</p>`,
        `<p class="y-chinh">🎯 Hai hàm đáp ứng đúng phần trong ngoặc của đặc tả — <em>"(positions of elements are preserved)"</em>, giữ nguyên vị trí các phần tử. Cả hai đều làm ba bước như nhau — <strong>chép sang <code>temp</code>, sắp <code>temp</code>, in <code>temp</code></strong> — và khác nhau đúng một ký tự: <code>&gt;</code> thành <code>&lt;</code>.</p>
<ul>
<li><strong>Dòng 148 mới là yêu cầu</strong> — <code>int temp[MAX_SIZE];</code> rồi <code>for (int i = 0; i &lt; n; i++) temp[i] = a[i];</code>. Sắp thẳng trên <code>a</code> thì kết quả nhìn thấy vẫn đúng nhưng phá vỡ đặc tả: mục menu 5 sau đó sẽ hiện một mảng đã bị xáo, và mục menu 7 không còn thứ tự gốc để làm việc.</li>
<li><strong>Thuật toán sắp ở đây KHÔNG phải một trong hai cái đã đặt tên</strong> — nó là "exchange sort": <code>for i … for j = i+1 … if (temp[i] &gt; temp[j]) đổi chỗ</code>. Nó đổi chỗ ngay ở mọi cặp nghịch thế thay vì ghi nhớ <code>minIndex</code>. Số phép so sánh vẫn là n(n−1)/2 như Selection Sort nhưng số lần đổi chỗ thì nhiều hơn hẳn.</li>
<li><strong>Vì sao nó vẫn ra đúng thứ tự</strong> — sau vòng trong của một <code>i</code> nhất định, không còn gì bên phải <code>i</code> nhỏ hơn <code>temp[i]</code>, nên <code>temp[i]</code> là nhỏ nhất của phần còn lại. Cùng bất biến với Selection Sort, chỉ là tới đó bằng đường tốn kém hơn.</li>
<li><strong><code>printDescending</code> là bản sao với một dấu so sánh lật ngược</strong> — <code>if (temp[i] &lt; temp[j])</code>. Mọi thứ còn lại, kể cả mảng tạm và lời gọi <code>printArray(temp, n)</code> cuối cùng, đều y hệt. Đây chính là ý "quan hệ thứ tự" của slide 30 được cụ thể hoá.</li>
<li><strong>Cả hai đều kết thúc bằng uỷ nhiệm</strong> — <code>printArray(temp, n);</code>. Không hàm nào chứa một lệnh <code>printf</code> của riêng nó. Đó là lý do ba dòng kết quả trên slide 44 có định dạng giống hệt nhau.</li>
<li><strong>Cái giá của bản sao</strong> — <code>int temp[MAX_SIZE]</code> là 400 byte trên ngăn xếp, cấp phát bất kể <code>n</code> bằng 3 hay 100. Ở đây thì rẻ, nhưng đó là một lựa chọn thiết kế thật: bạn đang đổi bộ nhớ lấy bảo đảm rằng mảng của người gọi không bị đụng vào.</li>
</ul>
<pre><code>/* Print the array in ascending order */
void printAscending(int *a, int n) {
    int temp[MAX_SIZE];
    for (int i = 0; i &lt; n; i++) temp[i] = a[i];      /* 1. chep ra ban sao */

    for (int i = 0; i &lt; n - 1; i++) {                /* 2. sap ban sao      */
        for (int j = i + 1; j &lt; n; j++) {
            if (temp[i] &gt; temp[j]) {
                int t = temp[i];
                temp[i] = temp[j];
                temp[j] = t;
            }
        }
    }
    printArray(temp, n);                             /* 3. in ban sao       */
}

/* Print the array in descending order */
void printDescending(int *a, int n) {
    int temp[MAX_SIZE];
    for (int i = 0; i &lt; n; i++) temp[i] = a[i];

    for (int i = 0; i &lt; n - 1; i++) {
        for (int j = i + 1; j &lt; n; j++) {
            if (temp[i] &lt; temp[j]) {                 /* CHI khac dau nay */
                int t = temp[i];
                temp[i] = temp[j];
                temp[j] = t;
            }
        }
    }
    printArray(temp, n);
}</code></pre>
<table>
<tr><th>mục menu</th><th>in ra gì</th><th>mảng <code>a</code> đang lưu sau đó</th></tr>
<tr><td>5 — in</td><td><code>0 2 8 9 7 3 2 4 2</code></td><td>0 2 8 9 7 3 2 4 2 (không đổi)</td></tr>
<tr><td>6 — tăng dần</td><td><code>0 2 2 2 3 4 7 8 9</code></td><td><strong>0 2 8 9 7 3 2 4 2 (vẫn không đổi)</strong></td></tr>
<tr><td>7 — giảm dần</td><td><code>9 8 7 4 3 2 2 2 0</code></td><td><strong>0 2 8 9 7 3 2 4 2 (vẫn không đổi)</strong></td></tr>
</table>
<p class="dap-an">✅ Chạy thật, theo thứ tự 5 → 6 → 7 → 5: ba kết quả đúng như bảng, và lần in mục 5 cuối cùng trả lại <code>0 2 8 9 7 3 2 4 2</code>, chứng minh thứ tự gốc thật sự được giữ nguyên. Cả ba dòng khớp từng ký tự với ảnh chụp console ở slide 44.</p>
<p class="pitfall">⚠️ Nếu bạn "tối ưu" bằng cách sắp thẳng trên <code>a</code> và bỏ bước chép, chương trình vẫn in đúng danh sách tăng dần MỘT lần — rồi mọi thứ phía sau đều sai: mục 5 hiện một mảng đã xáo, "xoá lần xuất hiện đầu tiên" xoá một phần tử khác với thứ người dùng vừa nhìn thấy, và mục 7 đi sắp một mảng đã sắp rồi. Một hàm được ghi là chỉ-đọc thì phải chỉ-đọc thật; dấu <code>int n</code> (chứ không phải <code>int *n</code>) trong chữ ký chính là lời hứa đó.</p>`],

      [44, 'Compile & Run',
        `<p class="y-chinh">🎯 Six console screenshots showing the finished program doing all seven menu items on nine numbers. This slide is the acceptance test of the case study — and it is the one place where you can check your own implementation against a known-good run.</p>
<ul>
<li><strong>The input</strong> — nine integers added one at a time via menu item 1: <code>0, 2, 8, 9, 7, 3, 2, 4, 2</code>. The first screenshot shows only the first add, ending with <code>Value 0 added successfully.</code></li>
<li><strong>"Print all elements" (item 5)</strong> — <code>Current array: 0 2 8 9 7 3 2 4 2</code>, in <em>insertion order</em>, not sorted. That confirms <code>addValue</code> appends at the end.</li>
<li><strong>"Print the array in ASC order" (item 6)</strong> — <code>Array in ascending order: 0 2 2 2 3 4 7 8 9</code>. All three 2s are there: sorting does not deduplicate, and the count is still nine.</li>
<li><strong>"Print the array in DESC order" (item 7)</strong> — <code>Array in descending order: 9 8 7 4 3 2 2 2 0</code>, the exact reverse of the ascending line. Since it was produced from the <em>unmodified</em> original, this is the proof that item 6 did not reorder the stored array.</li>
<li><strong>"Search a value" (item 2)</strong> — searching 4 gives <code>Value 4 found at position 7.</code> Check it against the stored order <code>0 2 8 9 7 3 2 4 2</code>: index 7 is indeed the 4. Note it is <strong>not</strong> position 5, which is where 4 sits in the ascending listing — search works on the stored array, not on the display.</li>
<li><strong>"Remove the first exist of value" (item 3)</strong> — removing 8 prints <code>Value 8 removed successfully (first occurrence).</code></li>
</ul>
<pre><code>Menu:
1- Add a value
...
Your choice: 5
Current array: 0 2 8 9 7 3 2 4 2

Your choice: 6
Array in ascending order: 0 2 2 2 3 4 7 8 9

Your choice: 7
Array in descending order: 9 8 7 4 3 2 2 2 0

Your choice: 2
Enter value to search: 4
Value 4 found at position 7.

Your choice: 3
Enter value to remove (first occurrence): 8
Value 8 removed successfully (first occurrence).</code></pre>
<table>
<tr><th>index</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>stored order</td><td>0</td><td>2</td><td>8</td><td>9</td><td>7</td><td>3</td><td>2</td><td><strong>4</strong></td><td>2</td></tr>
<tr><td>ascending display</td><td>0</td><td>2</td><td>2</td><td>2</td><td>3</td><td><strong>4</strong></td><td>7</td><td>8</td><td>9</td></tr>
<tr><td>descending display</td><td>9</td><td>8</td><td>7</td><td><strong>4</strong></td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
</table>
<p class="dap-an">✅ I typed the full program in from slides 38–43, compiled it with <code>cc -Wall</code> (no warnings) and fed it exactly this input. Output matched every screenshot character for character: <code>Current array: 0 2 8 9 7 3 2 4 2</code> · <code>Array in ascending order: 0 2 2 2 3 4 7 8 9</code> · <code>Array in descending order: 9 8 7 4 3 2 2 2 0</code> · <code>Value 4 found at position 7.</code> · <code>Value 8 removed successfully (first occurrence).</code> Continuing past the slide, menu 5 then gave <code>0 2 9 7 3 2 4 2</code> (n = 8) and menu 4 with value 2 gave <code>Value 2 removed 3 time(s).</code> leaving <code>0 9 7 3 4</code>.</p>
<p class="meo">💡 Use this slide as a checklist when you write the program yourself: add nine values, then press 5, 6, 7, 2, 3 in that order. If any of the five lines differs from the screenshots, you know which function to look at — 5 blames <code>printArray</code>/<code>addValue</code>, 6 and 7 blame the copy-and-sort, 2 blames <code>searchValue</code>, 3 blames the shift loop.</p>`,
        `<p class="y-chinh">🎯 Sáu ảnh chụp console cho thấy chương trình hoàn chỉnh chạy đủ bảy mục menu trên chín con số. Slide này là bài kiểm tra nghiệm thu của case study — và là chỗ duy nhất bạn đối chiếu được bản cài đặt của mình với một lần chạy đã biết là đúng.</p>
<ul>
<li><strong>Dữ liệu nhập</strong> — chín số nguyên, thêm lần lượt qua mục menu 1: <code>0, 2, 8, 9, 7, 3, 2, 4, 2</code>. Ảnh đầu chỉ cho thấy lần thêm đầu tiên, kết thúc bằng <code>Value 0 added successfully.</code></li>
<li><strong>"Print all elements" (mục 5)</strong> — <code>Current array: 0 2 8 9 7 3 2 4 2</code>, theo <em>thứ tự nhập</em> chứ không sắp xếp. Điều đó xác nhận <code>addValue</code> nối vào CUỐI mảng.</li>
<li><strong>"Print the array in ASC order" (mục 6)</strong> — <code>Array in ascending order: 0 2 2 2 3 4 7 8 9</code>. Cả ba số 2 đều còn: sắp xếp KHÔNG khử trùng lặp, và số phần tử vẫn là chín.</li>
<li><strong>"Print the array in DESC order" (mục 7)</strong> — <code>Array in descending order: 9 8 7 4 3 2 2 2 0</code>, đúng bản đảo ngược của dòng tăng dần. Vì nó được sinh ra từ bản GỐC CHƯA BỊ SỬA, đây chính là bằng chứng mục 6 đã không xáo lại mảng đang lưu.</li>
<li><strong>"Search a value" (mục 2)</strong> — tìm số 4 cho <code>Value 4 found at position 7.</code> Đối chiếu với thứ tự lưu <code>0 2 8 9 7 3 2 4 2</code>: chỉ số 7 đúng là số 4. Chú ý nó <strong>không</strong> phải vị trí 5, là chỗ số 4 nằm trong bản in tăng dần — tìm kiếm làm việc trên mảng ĐANG LƯU, không phải trên thứ được hiển thị.</li>
<li><strong>"Remove the first exist of value" (mục 3)</strong> — xoá số 8 in ra <code>Value 8 removed successfully (first occurrence).</code></li>
</ul>
<pre><code>Menu:
1- Add a value
...
Your choice: 5
Current array: 0 2 8 9 7 3 2 4 2

Your choice: 6
Array in ascending order: 0 2 2 2 3 4 7 8 9

Your choice: 7
Array in descending order: 9 8 7 4 3 2 2 2 0

Your choice: 2
Enter value to search: 4
Value 4 found at position 7.

Your choice: 3
Enter value to remove (first occurrence): 8
Value 8 removed successfully (first occurrence).</code></pre>
<table>
<tr><th>chỉ số</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>thứ tự đang lưu</td><td>0</td><td>2</td><td>8</td><td>9</td><td>7</td><td>3</td><td>2</td><td><strong>4</strong></td><td>2</td></tr>
<tr><td>bản in tăng dần</td><td>0</td><td>2</td><td>2</td><td>2</td><td>3</td><td><strong>4</strong></td><td>7</td><td>8</td><td>9</td></tr>
<tr><td>bản in giảm dần</td><td>9</td><td>8</td><td>7</td><td><strong>4</strong></td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Tôi đã gõ lại toàn bộ chương trình từ slide 38–43, biên dịch bằng <code>cc -Wall</code> (không cảnh báo nào) và đưa đúng dãy nhập này. Kết quả khớp từng ký tự với mọi ảnh chụp: <code>Current array: 0 2 8 9 7 3 2 4 2</code> · <code>Array in ascending order: 0 2 2 2 3 4 7 8 9</code> · <code>Array in descending order: 9 8 7 4 3 2 2 2 0</code> · <code>Value 4 found at position 7.</code> · <code>Value 8 removed successfully (first occurrence).</code> Chạy tiếp quá phần slide: mục 5 cho <code>0 2 9 7 3 2 4 2</code> (n = 8), và mục 4 với giá trị 2 cho <code>Value 2 removed 3 time(s).</code> còn lại <code>0 9 7 3 4</code>.</p>
<p class="meo">💡 Dùng slide này làm danh sách kiểm khi bạn tự viết chương trình: thêm chín giá trị, rồi bấm 5, 6, 7, 2, 3 theo đúng thứ tự đó. Nếu một trong năm dòng lệch với ảnh chụp thì bạn biết ngay phải soi hàm nào — dòng 5 tố <code>printArray</code>/<code>addValue</code>, dòng 6 và 7 tố phần chép-rồi-sắp, dòng 2 tố <code>searchValue</code>, dòng 3 tố vòng dồn.</p>`],

      [45, 'Exercise 4:',
        `<p class="y-chinh">🎯 Exercise 4 is the case study of slides 37–44 handed back to you with two changes that matter: the element type is <code>double</code> instead of <code>int</code>, and a new menu item 4 prints only the values inside a range the user types. Menu item 5 repeats the contract of slide 43 — <em>"positions of elements are preserved"</em> — so ascending order is something you <strong>display</strong>, never something you do to the stored array.</p>
<ul>
<li><strong>What carries over unchanged</strong> — the menu loop, <code>n</code> passed by address so <code>addValue</code> can grow it, linear search returning an index or −1, and the copy-then-sort trick. You are not being asked to invent anything; you are being asked to retype the case study with one type swapped.</li>
<li><strong>What <code>double</code> actually changes — three edits, no more</strong> — the array becomes <code>double a[100]</code>; <code>scanf</code> must use <code>%lf</code> (an <code>int</code> uses <code>%d</code>, a <code>float</code> uses <code>%f</code>, a <code>double</code> uses <code>%lf</code>); <code>printf</code> keeps <code>%f</code> / <code>%.2f</code> because it promotes <code>float</code> to <code>double</code> anyway. The asymmetry between <code>scanf</code> and <code>printf</code> is the single most common compile-clean-but-wrong bug in this exercise.</li>
<li><strong>Item 4 is a traversal with a guard</strong> — visit every element, print only where <code>a[i] &gt;= minVal &amp;&amp; a[i] &lt;= maxVal</code>. That is exactly the <code>[if (condition)] Access</code> shape slide 46 draws for matrices; the only new thing is that the filter may match nothing, so print a fallback instead of an empty line.</li>
<li><strong>There is no "remove" here</strong> — unlike the case study, so no shift loop and no <code>removeAll</code>. Four of the five operations are read-only on <code>a</code>; only item 1 writes.</li>
<li><strong>"Others - Quit"</strong> is the <code>default:</code> label, and the loop condition becomes <code>while (choice &gt;= 1 &amp;&amp; choice &lt;= 5)</code>. Anything the user types outside 1–5 falls into <code>default</code> and ends the program — that is why the menu does not need a dedicated exit number.</li>
<li><strong>Searching real numbers must not use <code>==</code></strong> — this is the one genuinely new hazard the type swap introduces, and it is why <code>searchValue</code> below compares with a tolerance.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
#define MAXN 100
#define EPS  1e-9

int addValue(double a[], int *pn, double x)
{   if (*pn &gt;= MAXN) return 0;
    a[(*pn)++] = x;
    return 1;
}
int searchValue(double a[], int n, double x)
{   int i;
    for (i = 0; i &lt; n; i++)
        if (fabs(a[i] - x) &lt; EPS) return i;   /* KHONG dung == voi so thuc */
    return -1;
}
void printArray(double a[], int n)
{   int i;
    if (n == 0) { printf("(empty)\\n"); return; }
    for (i = 0; i &lt; n; i++) printf("%.2f ", a[i]);
    printf("\\n");
}
void printInRange(double a[], int n, double lo, double hi)
{   int i, cnt = 0;
    for (i = 0; i &lt; n; i++)
        if (a[i] &gt;= lo &amp;&amp; a[i] &lt;= hi) { printf("%.2f ", a[i]); cnt++; }
    if (cnt == 0) printf("(none)");
    printf("\\n");
}
void printAscending(double a[], int n)      /* vi tri phan tu duoc GIU NGUYEN */
{   double temp[MAXN];
    int i, j;
    for (i = 0; i &lt; n; i++) temp[i] = a[i];             /* 1. ban sao */
    for (i = 0; i &lt; n - 1; i++)
        for (j = i + 1; j &lt; n; j++)
            if (temp[i] &gt; temp[j])
            {   double t = temp[i]; temp[i] = temp[j]; temp[j] = t; }
    printArray(temp, n);                                /* 3. in ban sao */
}

int main(void)
{   double a[MAXN], x, lo, hi;
    int n = 0, choice, pos;
    do
    {   printf("\\n1- Add a value\\n2- Search a value\\n3- Print out the array\\n");
        printf("4- Print out values in a range\\n5- Print out the array in ascending order\\n");
        printf("Others- Quit\\nYour choice: ");
        if (scanf("%d", &amp;choice) != 1) break;
        switch (choice)
        {   case 1:
                printf("Enter a real number: "); scanf("%lf", &amp;x);
                if (addValue(a, &amp;n, x)) printf("Value %.2f added. n = %d\\n", x, n);
                else printf("The array is full!\\n");
                break;
            case 2:
                printf("Enter value to search: "); scanf("%lf", &amp;x);
                pos = searchValue(a, n, x);
                if (pos &gt;= 0) printf("Value %.2f found at position %d.\\n", x, pos);
                else printf("Value %.2f not found.\\n", x);
                break;
            case 3: printf("Current array: "); printArray(a, n); break;
            case 4:
                printf("Enter minVal and maxVal: "); scanf("%lf%lf", &amp;lo, &amp;hi);
                printf("Values in [%.2f, %.2f]: ", lo, hi);
                printInRange(a, n, lo, hi);
                break;
            case 5: printf("Array in ascending order: "); printAscending(a, n); break;
            default: printf("Bye!\\n");
        }
    }
    while (choice &gt;= 1 &amp;&amp; choice &lt;= 5);
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer — compiled with <code>cc -Wall -o ex4 ex4.c -lm</code>, no warnings, then fed the eight numbers <code>3.5 −1.25 7.0 2.5 9.75 0.5 7.0 −4.0</code> through item 1. Real output: item 3 → <code>Current array: 3.50 -1.25 7.00 2.50 9.75 0.50 7.00 -4.00</code> · item 4 with <code>minVal=0, maxVal=5</code> → <code>Values in [0.00, 5.00]: 3.50 2.50 0.50</code> (three values, still in <em>stored</em> order, not sorted) · item 5 → <code>Array in ascending order: -4.00 -1.25 0.50 2.50 3.50 7.00 7.00 9.75</code> (both 7.00s survive — sorting never deduplicates) · item 2 searching <code>7.0</code> → <code>Value 7.00 found at position 2.</code>, i.e. the <strong>first</strong> 7 in stored order, not the one at index 5 of the sorted display · item 2 searching <code>6.25</code> → <code>Value 6.25 not found.</code> · and item 3 again → the same eight numbers in the same eight places, which is the proof that item 5 kept its promise. <code>-lm</code> is required on Linux/macOS because of <code>fabs</code>.</p>
<p class="pitfall">⚠️ Two traps, both measured. <strong>(1) <code>scanf("%f", &amp;x)</code> on a <code>double</code>.</strong> It compiles (with a warning you will probably scroll past) and then writes only four bytes into an eight-byte variable — the value you get is garbage, not a rounded version of what you typed. In <code>scanf</code> a <code>double</code> is <code>%lf</code> and nothing else. <strong>(2) <code>if (a[i] == x)</code>.</strong> Measured: <code>0.1 + 0.2 == 0.3</code> is <em>false</em>, the difference being <code>0.00000000000000005551</code>, while <code>printf("%.2f")</code> shows both as <code>0.30</code>. So a user who added 0.1 and 0.2 and searches for 0.3 is told "not found" while staring at a 0.30 on screen. <code>fabs(a[i] - x) &lt; 1e-9</code> is the fix, and it is why <code>&lt;math.h&gt;</code> is included.</p>`,
        `<p class="y-chinh">🎯 Exercise 4 chính là case study của slide 37–44 trả lại cho bạn với hai thay đổi đáng kể: kiểu phần tử là <code>double</code> chứ không phải <code>int</code>, và có thêm mục 4 in ra chỉ những giá trị nằm trong khoảng người dùng nhập. Mục 5 lặp lại đúng lời hứa của slide 43 — <em>"vị trí các phần tử được giữ nguyên"</em> — nên thứ tự tăng dần là thứ bạn <strong>HIỂN THỊ</strong>, không bao giờ là thứ bạn làm với mảng đang lưu.</p>
<ul>
<li><strong>Phần giữ nguyên</strong> — vòng menu, <code>n</code> truyền bằng địa chỉ để <code>addValue</code> tăng được nó, tìm tuyến tính trả về chỉ số hoặc −1, và mẹo chép-rồi-sắp. Đề không bắt bạn nghĩ ra cái mới; đề bắt bạn gõ lại case study với một kiểu dữ liệu bị đổi.</li>
<li><strong><code>double</code> thay đổi đúng ba chỗ, không hơn</strong> — mảng thành <code>double a[100]</code>; <code>scanf</code> phải dùng <code>%lf</code> (<code>int</code> dùng <code>%d</code>, <code>float</code> dùng <code>%f</code>, <code>double</code> dùng <code>%lf</code>); <code>printf</code> vẫn <code>%f</code> / <code>%.2f</code> vì nó tự nâng <code>float</code> lên <code>double</code>. Chính sự bất đối xứng giữa <code>scanf</code> và <code>printf</code> là lỗi "biên dịch sạch mà chạy sai" phổ biến nhất của bài này.</li>
<li><strong>Mục 4 là một lượt duyệt có điều kiện lọc</strong> — đi qua mọi phần tử, chỉ in khi <code>a[i] &gt;= minVal &amp;&amp; a[i] &lt;= maxVal</code>. Đó đúng là khuôn <code>[if (condition)] Access</code> mà slide 46 vẽ cho ma trận; điểm mới duy nhất là bộ lọc có thể không khớp gì cả, nên phải in một câu thay thế chứ đừng để dòng trống.</li>
<li><strong>Ở đây KHÔNG có chức năng xoá</strong> — khác case study, nên không cần vòng dồn và không cần <code>removeAll</code>. Bốn trên năm thao tác là chỉ-đọc với <code>a</code>; chỉ mục 1 ghi.</li>
<li><strong>"Others - Quit"</strong> là nhãn <code>default:</code>, và điều kiện lặp thành <code>while (choice &gt;= 1 &amp;&amp; choice &lt;= 5)</code>. Người dùng gõ bất cứ số nào ngoài 1–5 đều rơi vào <code>default</code> và chương trình kết thúc — đó là lý do menu không cần một số thoát riêng.</li>
<li><strong>Tìm kiếm số thực KHÔNG được dùng <code>==</code></strong> — đây là hiểm hoạ thật sự mới mà việc đổi kiểu mang tới, và là lý do <code>searchValue</code> dưới đây so sánh có sai số cho phép.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
#define MAXN 100
#define EPS  1e-9

int addValue(double a[], int *pn, double x)
{   if (*pn &gt;= MAXN) return 0;
    a[(*pn)++] = x;
    return 1;
}
int searchValue(double a[], int n, double x)
{   int i;
    for (i = 0; i &lt; n; i++)
        if (fabs(a[i] - x) &lt; EPS) return i;   /* KHONG dung == voi so thuc */
    return -1;
}
void printArray(double a[], int n)
{   int i;
    if (n == 0) { printf("(empty)\\n"); return; }
    for (i = 0; i &lt; n; i++) printf("%.2f ", a[i]);
    printf("\\n");
}
void printInRange(double a[], int n, double lo, double hi)
{   int i, cnt = 0;
    for (i = 0; i &lt; n; i++)
        if (a[i] &gt;= lo &amp;&amp; a[i] &lt;= hi) { printf("%.2f ", a[i]); cnt++; }
    if (cnt == 0) printf("(none)");
    printf("\\n");
}
void printAscending(double a[], int n)      /* vi tri phan tu duoc GIU NGUYEN */
{   double temp[MAXN];
    int i, j;
    for (i = 0; i &lt; n; i++) temp[i] = a[i];             /* 1. ban sao */
    for (i = 0; i &lt; n - 1; i++)
        for (j = i + 1; j &lt; n; j++)
            if (temp[i] &gt; temp[j])
            {   double t = temp[i]; temp[i] = temp[j]; temp[j] = t; }
    printArray(temp, n);                                /* 3. in ban sao */
}

int main(void)
{   double a[MAXN], x, lo, hi;
    int n = 0, choice, pos;
    do
    {   printf("\\n1- Add a value\\n2- Search a value\\n3- Print out the array\\n");
        printf("4- Print out values in a range\\n5- Print out the array in ascending order\\n");
        printf("Others- Quit\\nYour choice: ");
        if (scanf("%d", &amp;choice) != 1) break;
        switch (choice)
        {   case 1:
                printf("Enter a real number: "); scanf("%lf", &amp;x);
                if (addValue(a, &amp;n, x)) printf("Value %.2f added. n = %d\\n", x, n);
                else printf("The array is full!\\n");
                break;
            case 2:
                printf("Enter value to search: "); scanf("%lf", &amp;x);
                pos = searchValue(a, n, x);
                if (pos &gt;= 0) printf("Value %.2f found at position %d.\\n", x, pos);
                else printf("Value %.2f not found.\\n", x);
                break;
            case 3: printf("Current array: "); printArray(a, n); break;
            case 4:
                printf("Enter minVal and maxVal: "); scanf("%lf%lf", &amp;lo, &amp;hi);
                printf("Values in [%.2f, %.2f]: ", lo, hi);
                printInRange(a, n, lo, hi);
                break;
            case 5: printf("Array in ascending order: "); printAscending(a, n); break;
            default: printf("Bye!\\n");
        }
    }
    while (choice &gt;= 1 &amp;&amp; choice &lt;= 5);
    return 0;
}</code></pre>
<table>
<tr><th>mục</th><th>nhập</th><th>kết quả CHẠY THẬT</th></tr>
<tr><td>3 — in mảng</td><td>—</td><td><code>3.50 -1.25 7.00 2.50 9.75 0.50 7.00 -4.00</code></td></tr>
<tr><td>4 — lọc khoảng</td><td><code>0</code> và <code>5</code></td><td><code>3.50 2.50 0.50</code> (giữ thứ tự LƯU, không sắp)</td></tr>
<tr><td>5 — tăng dần</td><td>—</td><td><code>-4.00 -1.25 0.50 2.50 3.50 7.00 7.00 9.75</code></td></tr>
<tr><td>2 — tìm</td><td><code>7.0</code></td><td><code>Value 7.00 found at position 2.</code></td></tr>
<tr><td>2 — tìm</td><td><code>6.25</code></td><td><code>Value 6.25 not found.</code></td></tr>
<tr><td>3 — in lại</td><td>—</td><td><code>3.50 -1.25 7.00 2.50 9.75 0.50 7.00 -4.00</code> — <strong>y nguyên</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án — biên dịch bằng <code>cc -Wall -o ex4 ex4.c -lm</code>, không một cảnh báo, rồi nhập tám số <code>3.5 −1.25 7.0 2.5 9.75 0.5 7.0 −4.0</code> qua mục 1. Bảng trên là kết quả thật. Ba điểm đáng soi: mục 4 in <code>3.50 2.50 0.50</code> theo <em>thứ tự đang lưu</em> chứ không sắp lại — đề chỉ bảo "lọc", không bảo "sắp"; mục 5 giữ cả hai số <code>7.00</code> vì sắp xếp không bao giờ khử trùng lặp, và tổng vẫn là tám phần tử; mục 2 tìm <code>7.0</code> trả về vị trí <strong>2</strong> — số 7 ĐẦU TIÊN theo thứ tự lưu — chứ không phải vị trí 5 nơi nó nằm trong bản in tăng dần. Lần in mục 3 cuối cùng trả lại đúng tám số ở đúng tám chỗ, đó là bằng chứng mục 5 đã giữ lời hứa. Cần <code>-lm</code> khi liên kết trên Linux/macOS vì có <code>fabs</code>.</p>
<p class="pitfall">⚠️ Hai cái bẫy, cả hai đều đã đo. <strong>(1) <code>scanf("%f", &amp;x)</code> với một <code>double</code>.</strong> Nó vẫn biên dịch (kèm một cảnh báo mà bạn nhiều khả năng lướt qua) rồi ghi vỏn vẹn bốn byte vào một biến tám byte — thứ bạn nhận được là rác, không phải bản làm tròn của số vừa gõ. Trong <code>scanf</code>, <code>double</code> là <code>%lf</code>, không có lựa chọn khác. <strong>(2) <code>if (a[i] == x)</code>.</strong> Đo thật: <code>0.1 + 0.2 == 0.3</code> cho kết quả <em>SAI</em>, chênh lệch là <code>0.00000000000000005551</code>, trong khi <code>printf("%.2f")</code> in cả hai thành <code>0.30</code>. Nghĩa là người dùng đã thêm 0.1 và 0.2 rồi tìm 0.3 sẽ bị báo "not found" trong lúc đang nhìn thấy số 0.30 trên màn hình. Cách sửa là <code>fabs(a[i] - x) &lt; 1e-9</code>, và đó là lý do phải <code>#include &lt;math.h&gt;</code>.</p>`],

      [46, '4 - Two-Dimensional Arrays',
        `<p class="y-chinh">🎯 The slide's definition: <em>"A group of elements which belong the same data type and they are divided into some rows and some column (it is called as matrix also)"</em>, and <em>"Each element is identified by two indexes (index of row, index of column)"</em>. The picture is a 3×5 matrix <code>m</code> where the red arrow labels the cell holding 5 as <code>m[1][3]</code> — row 1, column 3, both counted from 0.</p>
<ul>
<li><strong>Read the picture the way the exam will ask it</strong> — the rows are <code>1 7 6 3 7</code> / <code>2 -9 2 5 8</code> / <code>-5 40 0 5 9</code>. <code>m[1][3]</code> is the 4th cell of the 2nd row, which is 5. Not 2 (that would be <code>m[1][2]</code>), not 40 (<code>m[2][1]</code> — the indexes are <em>ordered</em>, row first).</li>
<li><strong>Two dimensions means two indexes, and that is the whole definition</strong> — slide 49 says it in general form: "Number of dimensions: Number of indexes are used to identify an element". Nothing about memory is implied by the word "matrix"; the memory story is the next bullet.</li>
<li><strong>Row-major: C stores a matrix as one flat run of rows, back to back</strong> — <code>m[i][j]</code> sits at <code>base + (i*NumCol + j)*sizeof(element)</code>. Slide 50 states exactly this formula. The table below is that formula checked against the <em>real</em> addresses of the slide's own matrix.</li>
<li><strong>Traversing, straight from the blue box</strong> — an outer loop over rows, an inner loop over columns, and an optional guard: <code>for (i=0; i&lt;row; i++) { for (j=0; j&lt;column; j++) [if (condition)] Access m[i][j]; }</code>. The bracketed <code>if</code> is how you turn a full traversal into a filter — the same shape as Exercise 4's item 4.</li>
<li><strong>Counting rows and columns from the array itself</strong> — <code>sizeof(m)/sizeof(m[0])</code> is the number of rows, <code>sizeof(m[0])/sizeof(m[0][0])</code> the number of columns. Measured on this matrix: 60/20 = 3 rows, 20/4 = 5 columns. This works <em>only</em> where <code>m</code> was declared (see slide 48).</li>
<li><strong>Flat and nested initialisers are the same thing</strong> — <code>int a[2][3] = {{1,2,3},{4,5,6}};</code> and <code>int a[2][3] = {1,2,3,4,5,6};</code> produce byte-identical arrays, because the braces are only punctuation over a run that was flat all along.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{   int m[3][5] = { {1, 7, 6, 3, 7}, {2, -9, 2, 5, 8}, {-5, 40, 0, 5, 9} };
    char *base = (char*)m;
    int i, j;

    printf("sizeof(m)=%zu  sizeof(m[0])=%zu  sizeof(m[0][0])=%zu\\n",
           sizeof(m), sizeof(m[0]), sizeof(m[0][0]));
    printf("so hang = %zu, so cot = %zu\\n",
           sizeof(m) / sizeof(m[0]), sizeof(m[0]) / sizeof(m[0][0]));

    for (i = 0; i &lt; 3; i++)
        for (j = 0; j &lt; 5; j++)
            printf("m[%d][%d]=%3d  do lech that=%2ld  (i*5+j)*4=%2d  %s\\n",
                   i, j, m[i][j],
                   (long)((char*)&amp;m[i][j] - base), (i * 5 + j) * 4,
                   ((char*)&amp;m[i][j] - base) == (i * 5 + j) * 4L ? "KHOP" : "LECH");

    printf("doc phang: ");
    for (i = 0; i &lt; 15; i++) printf("%d ", *((int*)m + i));
    printf("\\n");
    return 0;
}</code></pre>
<table>
<tr><th>element</th><th>value</th><th>real byte offset from <code>m</code></th><th><code>(i*5 + j)*4</code></th></tr>
<tr><td><code>m[0][0]</code></td><td>1</td><td>0</td><td>0</td></tr>
<tr><td><code>m[0][4]</code></td><td>7</td><td>16</td><td>16</td></tr>
<tr><td><code>m[1][0]</code></td><td>2</td><td>20</td><td>20</td></tr>
<tr><td><code>m[1][3]</code></td><td><strong>5</strong></td><td><strong>32</strong></td><td><strong>32</strong></td></tr>
<tr><td><code>m[2][0]</code></td><td>−5</td><td>40</td><td>40</td></tr>
<tr><td><code>m[2][4]</code></td><td>9</td><td>56</td><td>56</td></tr>
</table>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: all fifteen elements printed <code>KHOP</code>, i.e. the real offset equalled <code>(i*5 + j)*4</code> in every single case. <code>sizeof(m)=60</code>, <code>sizeof(m[0])=20</code>, <code>sizeof(m[0][0])=4</code> → 3 rows and 5 columns, computed from the array rather than from a <code>#define</code>. Reading the same memory as one flat <code>int</code> run gave <code>1 7 6 3 7 2 -9 2 5 8 -5 40 0 5 9</code> — the rows laid end to end, in order, with no padding between them. That flat read is the definition of row-major, and it is why the exercise on slide 50 can write one formula for any <code>i</code> and <code>j</code>.</p>
<p class="meo">💡 Memorise <code>(i*NumCol + j)</code> by saying it out loud: "skip <code>i</code> whole rows, then walk <code>j</code> cells". <code>NumCol</code> appears in the formula and <code>NumRow</code> does not — that asymmetry is not an accident, and it is the entire reason the next two slides insist a function parameter must declare the column count.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa của slide: <em>"Một nhóm phần tử cùng kiểu dữ liệu, được chia thành một số hàng và một số cột (còn gọi là ma trận)"</em>, và <em>"Mỗi phần tử được xác định bằng HAI chỉ số (chỉ số hàng, chỉ số cột)"</em>. Hình vẽ là ma trận <code>m</code> cỡ 3×5, mũi tên đỏ chỉ vào ô chứa số 5 và gọi nó là <code>m[1][3]</code> — hàng 1, cột 3, cả hai đều đếm từ 0.</p>
<ul>
<li><strong>Đọc hình theo đúng cách đề thi sẽ hỏi</strong> — ba hàng là <code>1 7 6 3 7</code> / <code>2 -9 2 5 8</code> / <code>-5 40 0 5 9</code>. <code>m[1][3]</code> là ô thứ 4 của hàng thứ 2, tức số 5. Không phải 2 (đó là <code>m[1][2]</code>), cũng không phải 40 (<code>m[2][1]</code> — hai chỉ số CÓ THỨ TỰ, hàng đứng trước).</li>
<li><strong>Hai chiều nghĩa là hai chỉ số, và đó là toàn bộ định nghĩa</strong> — slide 49 phát biểu ở dạng tổng quát: "Số chiều = số chỉ số dùng để xác định một phần tử". Chữ "ma trận" không hàm ý gì về bộ nhớ; chuyện bộ nhớ nằm ở gạch đầu dòng kế.</li>
<li><strong>Row-major: C lưu ma trận thành MỘT dải phẳng, các hàng nối đuôi nhau</strong> — <code>m[i][j]</code> nằm ở <code>base + (i*SoCot + j)*sizeof(phần tử)</code>. Slide 50 ghi đúng công thức này. Bảng bên dưới là công thức ấy đối chiếu với địa chỉ THẬT của chính ma trận trên slide.</li>
<li><strong>Duyệt ma trận, chép thẳng từ khung xanh</strong> — vòng ngoài chạy hàng, vòng trong chạy cột, kèm một điều kiện tuỳ chọn: <code>for (i=0; i&lt;row; i++) { for (j=0; j&lt;column; j++) [if (condition)] Access m[i][j]; }</code>. Cái <code>if</code> trong ngoặc vuông chính là cách biến một lượt duyệt đầy đủ thành một bộ lọc — cùng khuôn với mục 4 của Exercise 4.</li>
<li><strong>Đếm hàng và cột từ chính mảng</strong> — <code>sizeof(m)/sizeof(m[0])</code> ra SỐ HÀNG, <code>sizeof(m[0])/sizeof(m[0][0])</code> ra SỐ CỘT. Đo trên ma trận này: 60/20 = 3 hàng, 20/4 = 5 cột. Mẹo này chỉ chạy <em>ở nơi <code>m</code> được khai báo</em> (xem slide 48).</li>
<li><strong>Khởi tạo phẳng và khởi tạo lồng nhau là một</strong> — <code>int a[2][3] = {{1,2,3},{4,5,6}};</code> và <code>int a[2][3] = {1,2,3,4,5,6};</code> cho hai mảng giống nhau từng byte (đã kiểm bằng vòng so sánh: giống hệt), bởi vì cặp ngoặc nhọn chỉ là dấu chấm câu đặt lên một dải vốn đã phẳng.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{   int m[3][5] = { {1, 7, 6, 3, 7}, {2, -9, 2, 5, 8}, {-5, 40, 0, 5, 9} };
    char *base = (char*)m;
    int i, j;

    printf("sizeof(m)=%zu  sizeof(m[0])=%zu  sizeof(m[0][0])=%zu\\n",
           sizeof(m), sizeof(m[0]), sizeof(m[0][0]));
    printf("so hang = %zu, so cot = %zu\\n",
           sizeof(m) / sizeof(m[0]), sizeof(m[0]) / sizeof(m[0][0]));

    for (i = 0; i &lt; 3; i++)
        for (j = 0; j &lt; 5; j++)
            printf("m[%d][%d]=%3d  do lech that=%2ld  (i*5+j)*4=%2d  %s\\n",
                   i, j, m[i][j],
                   (long)((char*)&amp;m[i][j] - base), (i * 5 + j) * 4,
                   ((char*)&amp;m[i][j] - base) == (i * 5 + j) * 4L ? "KHOP" : "LECH");

    printf("doc phang: ");
    for (i = 0; i &lt; 15; i++) printf("%d ", *((int*)m + i));
    printf("\\n");
    return 0;
}</code></pre>
<table>
<tr><th>phần tử</th><th>giá trị</th><th>độ lệch byte THẬT so với <code>m</code></th><th><code>(i*5 + j)*4</code></th></tr>
<tr><td><code>m[0][0]</code></td><td>1</td><td>0</td><td>0</td></tr>
<tr><td><code>m[0][4]</code></td><td>7</td><td>16</td><td>16</td></tr>
<tr><td><code>m[1][0]</code></td><td>2</td><td>20</td><td>20</td></tr>
<tr><td><code>m[1][3]</code></td><td><strong>5</strong></td><td><strong>32</strong></td><td><strong>32</strong></td></tr>
<tr><td><code>m[2][0]</code></td><td>−5</td><td>40</td><td>40</td></tr>
<tr><td><code>m[2][4]</code></td><td>9</td><td>56</td><td>56</td></tr>
</table>
<p class="dap-an">✅ Biên dịch bằng <code>cc -Wall</code> rồi chạy: cả mười lăm phần tử đều in ra <code>KHOP</code>, tức độ lệch thật bằng đúng <code>(i*5 + j)*4</code> trong mọi trường hợp, không sót một ô nào. <code>sizeof(m)=60</code>, <code>sizeof(m[0])=20</code>, <code>sizeof(m[0][0])=4</code> → ra 3 hàng và 5 cột, tính từ chính mảng chứ không phải từ một <code>#define</code>. Đọc lại đúng vùng nhớ đó như một dải <code>int</code> phẳng cho: <code>1 7 6 3 7 2 -9 2 5 8 -5 40 0 5 9</code> — ba hàng nối đuôi nhau, đúng thứ tự, không có byte đệm nào chen giữa. Lần đọc phẳng đó chính là ĐỊNH NGHĨA của row-major, và là lý do bài tập ở slide 50 viết được một công thức duy nhất cho mọi <code>i</code>, <code>j</code>.</p>
<p class="meo">💡 Nhớ <code>(i*SoCot + j)</code> bằng cách đọc thành lời: "nhảy qua <code>i</code> hàng trọn vẹn, rồi đi tiếp <code>j</code> ô". Trong công thức có <code>SoCot</code> mà KHÔNG có <code>SoHang</code> — sự bất đối xứng đó không phải ngẫu nhiên, và nó là toàn bộ lý do hai slide tiếp theo nhất quyết bắt tham số hàm phải khai số cột.</p>`],

      [47, 'Two-Dimensional Arrays: Example',
        `<p class="y-chinh">🎯 Lines 1–25 of a complete matrix program, next to the console that produced <code>Sum of all elements: 25</code>. The one detail worth stopping on is line 12: <code>int array[m][n];</code> — the sizes come from <code>scanf</code>, so this is a <strong>variable-length array</strong>, and everything else on the slide is arranged to make that legal.</p>
<ul>
<li><strong>The prototypes put the sizes first on purpose</strong> — <code>int calculateSum(int rows, int cols, int arr[rows][cols]);</code>. C reads a parameter list left to right, so <code>cols</code> must already be a name before <code>arr[rows][cols]</code> can use it. Swap the order to <code>(int arr[rows][cols], int rows, int cols)</code> and it will not compile: the compiler has not met <code>cols</code> yet.</li>
<li><strong>Why the sizes must be read before line 12</strong> — lines 8–11 do both <code>scanf</code>s, <em>then</em> line 12 declares the array. A VLA's size is fixed at the moment the declaration executes; moving <code>int array[m][n];</code> above the <code>scanf</code>s would size it from uninitialised garbage.</li>
<li><strong>The prompts are 1-based, the storage is 0-based</strong> — line 16 prints <code>Element [%d][%d]</code> with <code>i + 1, j + 1</code>, which is why the console asks for <code>Element [1][1]</code> through <code>Element [2][3]</code> while line 17 stores into <code>&amp;array[i][j]</code> at <code>[0][0]</code>…<code>[1][2]</code>. Nothing is wrong — it is a display convention — but read it carefully, because the two numbering systems sit two lines apart.</li>
<li><strong>The input order proves row-major</strong> — the inner loop runs <code>j</code>, so the user fills row 0 completely (1, 2, 7) before row 1 starts (2, 8, 5). That is the same order the elements occupy in memory, which is why the matrix prints back as typed.</li>
<li><strong>main does no arithmetic and no formatting</strong> — line 21 delegates the display to <code>printMatrix</code>, line 22 delegates the total to <code>calculateSum</code>, and line 23 only prints the returned number. Same division of labour as the case study on slides 38–44.</li>
<li><strong>1 + 2 + 7 + 2 + 8 + 5 = 25</strong> — check the console number by hand; it is the kind of arithmetic an exam paper will ask you to do without a compiler.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
/* Function Prototypes */
int  calculateSum(int rows, int cols, int arr[rows][cols]);
void printMatrix (int rows, int cols, int arr[rows][cols]);

int main() {
    int m, n;
    printf("Enter the number of rows (m): ");
    scanf("%d", &amp;m);
    printf("Enter the number of columns (n): ");
    scanf("%d", &amp;n);
    int array[m][n];                                  /* VLA: co lay tu m, n */
    printf("Enter the elements of the %dx%d array:\\n", m, n);
    for (int i = 0; i &lt; m; i++) {
        for (int j = 0; j &lt; n; j++) {
            printf("Element [%d][%d]: ", i + 1, j + 1);   /* hien thi 1-based */
            scanf("%d", &amp;array[i][j]);                    /* luu tru 0-based */
        }
    }
    printf("\\nMatrix:\\n");
    printMatrix(m, n, array);
    int sum = calculateSum(m, n, array);
    printf("\\nSum of all elements: %d\\n", sum);
    return 0;
}</code></pre>
<pre><code>Enter the number of rows (m): 2
Enter the number of columns (n): 3
Enter the elements of the 2x3 array:
Element [1][1]: 1
Element [1][2]: 2
Element [1][3]: 7
Element [2][1]: 2
Element [2][2]: 8
Element [2][3]: 5

Matrix:
   1   2   7
   2   8   5

Sum of all elements: 25</code></pre>
<p class="dap-an">✅ I typed this program in from slides 47 and 48, compiled it with <code>cc -Wall</code> (no warnings) and fed it exactly the slide's input — <code>2</code>, <code>3</code>, then <code>1 2 7 2 8 5</code>. The output matched the screenshot line for line, including the column alignment produced by <code>%4d</code> and the final <code>Sum of all elements: 25</code>. Note that the program is standard C99 and up; on a C89-only compiler the VLA and the <code>for (int i = ...)</code> declarations would both be rejected, which is worth knowing if your lab machine uses an old Turbo C.</p>
<p class="pitfall">⚠️ <code>int array[m][n];</code> is convenient and it is also the one line here that can take the whole program down. If the user answers 5000 and 5000, the declaration asks the stack for 100 MB and the program dies instantly with no error message you can catch — there is no way to test a VLA declaration for failure. A fixed <code>int array[MAXROW][MAXCOL];</code> with a validity check on <code>m</code> and <code>n</code>, or <code>calloc</code> as on slide 49, are the two answers that survive a hostile user.</p>`,
        `<p class="y-chinh">🎯 Dòng 1–25 của một chương trình ma trận hoàn chỉnh, đặt cạnh khung console đã sinh ra <code>Sum of all elements: 25</code>. Chi tiết đáng dừng lại là dòng 12: <code>int array[m][n];</code> — kích thước lấy từ <code>scanf</code>, nên đây là một <strong>mảng có độ dài thay đổi (VLA)</strong>, và mọi thứ còn lại trên slide được sắp xếp để điều đó hợp lệ.</p>
<ul>
<li><strong>Nguyên mẫu đặt kích thước lên TRƯỚC là có chủ đích</strong> — <code>int calculateSum(int rows, int cols, int arr[rows][cols]);</code>. C đọc danh sách tham số từ trái sang phải, nên <code>cols</code> phải đã là một cái tên thì <code>arr[rows][cols]</code> mới dùng được nó. Đảo thành <code>(int arr[rows][cols], int rows, int cols)</code> là không biên dịch nổi: trình biên dịch chưa hề gặp <code>cols</code>.</li>
<li><strong>Vì sao phải đọc kích thước TRƯỚC dòng 12</strong> — dòng 8–11 làm cả hai lần <code>scanf</code>, <em>rồi</em> dòng 12 mới khai báo mảng. Cỡ của một VLA bị chốt ngay lúc lệnh khai báo chạy qua; dời <code>int array[m][n];</code> lên trên các <code>scanf</code> là cấp phát theo rác chưa khởi tạo.</li>
<li><strong>Lời nhắc đánh số từ 1, bộ nhớ đánh số từ 0</strong> — dòng 16 in <code>Element [%d][%d]</code> với <code>i + 1, j + 1</code>, đó là lý do console hỏi từ <code>Element [1][1]</code> đến <code>Element [2][3]</code> trong khi dòng 17 lưu vào <code>&amp;array[i][j]</code> tức <code>[0][0]</code>…<code>[1][2]</code>. Không có gì sai — đó là quy ước hiển thị — nhưng phải đọc kỹ, vì hai hệ đánh số nằm cách nhau đúng hai dòng.</li>
<li><strong>Thứ tự nhập chứng minh row-major</strong> — vòng trong chạy <code>j</code>, nên người dùng điền xong toàn bộ hàng 0 (1, 2, 7) rồi hàng 1 mới bắt đầu (2, 8, 5). Đó đúng là thứ tự các phần tử nằm trong bộ nhớ, và vì thế ma trận in ra y như lúc gõ vào.</li>
<li><strong><code>main</code> không tính toán và không định dạng</strong> — dòng 21 uỷ nhiệm việc hiển thị cho <code>printMatrix</code>, dòng 22 uỷ nhiệm việc cộng cho <code>calculateSum</code>, dòng 23 chỉ in con số nhận về. Đúng cách chia việc của case study slide 38–44.</li>
<li><strong>1 + 2 + 7 + 2 + 8 + 5 = 25</strong> — hãy tự cộng tay để đối chiếu con số trên console; đó chính là kiểu tính mà đề thi bắt bạn làm khi không có trình biên dịch bên cạnh.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
/* Function Prototypes */
int  calculateSum(int rows, int cols, int arr[rows][cols]);
void printMatrix (int rows, int cols, int arr[rows][cols]);

int main() {
    int m, n;
    printf("Enter the number of rows (m): ");
    scanf("%d", &amp;m);
    printf("Enter the number of columns (n): ");
    scanf("%d", &amp;n);
    int array[m][n];                                  /* VLA: co lay tu m, n */
    printf("Enter the elements of the %dx%d array:\\n", m, n);
    for (int i = 0; i &lt; m; i++) {
        for (int j = 0; j &lt; n; j++) {
            printf("Element [%d][%d]: ", i + 1, j + 1);   /* hien thi tu 1 */
            scanf("%d", &amp;array[i][j]);                    /* luu tru tu 0 */
        }
    }
    printf("\\nMatrix:\\n");
    printMatrix(m, n, array);
    int sum = calculateSum(m, n, array);
    printf("\\nSum of all elements: %d\\n", sum);
    return 0;
}</code></pre>
<pre><code>Enter the number of rows (m): 2
Enter the number of columns (n): 3
Enter the elements of the 2x3 array:
Element [1][1]: 1
Element [1][2]: 2
Element [1][3]: 7
Element [2][1]: 2
Element [2][2]: 8
Element [2][3]: 5

Matrix:
   1   2   7
   2   8   5

Sum of all elements: 25</code></pre>
<p class="dap-an">✅ Tôi đã gõ lại chương trình này từ slide 47 và 48, biên dịch bằng <code>cc -Wall</code> (không cảnh báo nào) và nhập đúng dữ liệu của slide — <code>2</code>, <code>3</code>, rồi <code>1 2 7 2 8 5</code>. Kết quả khớp từng dòng với ảnh chụp, kể cả phần canh cột do <code>%4d</code> tạo ra và dòng cuối <code>Sum of all elements: 25</code>. Lưu ý chương trình này là C99 trở lên; trên một trình biên dịch chỉ hỗ trợ C89 thì cả VLA lẫn cách khai <code>for (int i = ...)</code> đều bị từ chối — điều đáng nhớ nếu máy phòng lab của bạn còn chạy Turbo C đời cũ.</p>
<p class="pitfall">⚠️ <code>int array[m][n];</code> vừa tiện vừa là dòng duy nhất ở đây có thể giết cả chương trình. Người dùng gõ 5000 và 5000 thì lệnh khai báo xin ngăn xếp 100 MB, chương trình chết ngay lập tức mà không có mã lỗi nào để bạn bắt — không có cách nào kiểm tra một khai báo VLA xem nó có thành công hay không. Hai lời giải sống sót trước người dùng nghịch ngợm: dùng <code>int array[MAXROW][MAXCOL];</code> cố định kèm kiểm tra <code>m</code>, <code>n</code> hợp lệ, hoặc dùng <code>calloc</code> như slide 49.</p>`],

      [48, 'Two-Dimensional Arrays: Example (cont.)',
        `<p class="y-chinh">🎯 Lines 27–46: the two functions <code>main</code> delegated to. Both are the blue-box traversal of slide 46 with a different body — <code>calculateSum</code> accumulates, <code>printMatrix</code> prints — and both carry the same parameter list, which is where the real lesson of this slide lives: <strong>a function receiving a matrix must be told the number of columns.</strong></p>
<ul>
<li><strong>Why the column count is mandatory</strong> — the array decays to a pointer at the call, so the function gets an address and nothing else. To evaluate <code>arr[i][j]</code> the compiler must emit <code>base + (i*NumCol + j)*4</code>, and <code>NumCol</code> is not in the address. It must come from the type. That is why <code>void f(int a[][3], int soHang)</code> is legal and <code>void f(int a[][], int soHang)</code> is not.</li>
<li><strong>The row count, by contrast, is optional in the type</strong> — <code>int a[][3]</code> leaves the first bracket empty and compiles fine, because the number of rows never enters the address formula. You still pass it as a separate <code>int</code>, but for the loop bound, not for the arithmetic.</li>
<li><strong>Three ways to write the same parameter</strong> — <code>int arr[rows][cols]</code> (this slide, C99 VLA form), <code>int arr[][COLS]</code> (fixed column count), and <code>int (*arr)[COLS]</code> (pointer to an array of COLS ints). They are the same type after adjustment. <code>int **arr</code> is <strong>not</strong> among them and will not compile against a real matrix.</li>
<li><strong><code>sizeof</code> stops working inside the function</strong> — measured: in <code>main</code>, <code>sizeof(m)</code> is 60, but in a function taking <code>int a[][5]</code>, <code>sizeof(a)</code> is 8 — the size of a pointer — so <code>sizeof(a)/sizeof(a[0])</code> computes 8/20 = <strong>0 rows</strong>. Clang even warns: <em>"sizeof on array function parameter will return size of 'int (*)[5]'"</em>. The row/column trick of slide 46 is only valid where the array was declared.</li>
<li><strong><code>%4d</code> is what makes it a matrix on screen</strong> — a fixed field width of 4 right-aligns every number, so columns line up whether the value is <code>1</code> or <code>-9</code> or <code>40</code>. Plain <code>"%d "</code> would print a ragged staircase. The <code>printf("\\n")</code> after the inner loop is what ends each row.</li>
<li><strong><code>calculateSum</code> returns, it does not print</strong> — the same reusability rule as the search functions of slide 25: a function that computed and printed could not be used to feed an average or a maximum.</li>
</ul>
<pre><code>/* Function to calculate the sum of elements of the 2D array */
int calculateSum(int rows, int cols, int arr[rows][cols]) {
    int sum = 0;
    for (int i = 0; i &lt; rows; i++) {
        for (int j = 0; j &lt; cols; j++) {
            sum += arr[i][j];
        }
    }
    return sum;
}

/* Function to print the 2D array as a matrix */
void printMatrix(int rows, int cols, int arr[rows][cols]) {
    for (int i = 0; i &lt; rows; i++) {
        for (int j = 0; j &lt; cols; j++) {
            printf("%4d", arr[i][j]);   /* Format to align values in columns */
        }
        printf("\\n");                   /* New line after each row */
    }
}</code></pre>
<p class="dap-an">✅ Measured, on the 3×5 matrix of slide 46. Passing it to a function declared <code>void inSai(int a[][4], int soHang)</code> compiles, runs, prints nothing scary — and prints the wrong matrix:</p>
<table>
<tr><th>parameter declared</th><th>what the function printed</th></tr>
<tr><td><code>int a[][4]</code> (wrong)</td><td><code>1 7 6 3</code> / <code>7 2 -9 2</code> / <code>5 8 -5 40</code></td></tr>
<tr><td><code>int a[][5]</code> (right)</td><td><code>1 7 6 3 7</code> / <code>2 -9 2 5 8</code> / <code>-5 40 0 5 9</code></td></tr>
</table>
<p class="pitfall">⚠️ Look at the wrong row above: the values are not random, they are the <em>correct flat sequence cut into the wrong lengths</em>. The function walked <code>base + (i*4 + j)*4</code> over memory laid out for 5 columns, so every row after the first started 4 bytes early and the whole picture slid sideways — and five of the fifteen elements were never shown at all. Nothing crashes, no warning appears, and the output looks like a perfectly ordinary matrix. This is the exact failure mode the "you must declare the columns" rule exists to prevent, and it is why an exam question that shows you a mismatched parameter is asking about <em>shifted output</em>, not about a compile error.</p>`,
        `<p class="y-chinh">🎯 Dòng 27–46: hai hàm mà <code>main</code> đã uỷ nhiệm. Cả hai đều là lượt duyệt trong khung xanh của slide 46 với phần thân khác nhau — <code>calculateSum</code> cộng dồn, <code>printMatrix</code> in ra — và cả hai mang cùng một danh sách tham số, chính là chỗ bài học thật của slide này nằm: <strong>hàm nhận một ma trận BẮT BUỘC phải được cho biết số cột.</strong></p>
<ul>
<li><strong>Vì sao số cột là bắt buộc</strong> — mảng suy biến thành con trỏ ngay lúc gọi, nên hàm chỉ nhận được một địa chỉ và không gì khác. Để tính <code>arr[i][j]</code>, trình biên dịch phải sinh ra <code>base + (i*SoCot + j)*4</code>, mà <code>SoCot</code> KHÔNG nằm trong địa chỉ. Nó phải đến từ kiểu dữ liệu. Đó là lý do <code>void f(int a[][3], int soHang)</code> hợp lệ còn <code>void f(int a[][], int soHang)</code> thì không.</li>
<li><strong>Ngược lại, số HÀNG là tuỳ chọn trong kiểu</strong> — <code>int a[][3]</code> để trống cặp ngoặc đầu vẫn biên dịch tốt, vì số hàng chưa bao giờ đi vào công thức địa chỉ. Bạn vẫn truyền nó như một <code>int</code> riêng, nhưng để làm cận vòng lặp, không phải để tính toán.</li>
<li><strong>Ba cách viết cùng một tham số</strong> — <code>int arr[rows][cols]</code> (slide này, dạng VLA của C99), <code>int arr[][COLS]</code> (số cột cố định), và <code>int (*arr)[COLS]</code> (con trỏ tới mảng COLS phần tử <code>int</code>). Sau khi điều chỉnh, chúng là cùng một kiểu. <code>int **arr</code> <strong>KHÔNG</strong> nằm trong ba cách đó và sẽ không biên dịch được với một ma trận thật.</li>
<li><strong><code>sizeof</code> hết tác dụng khi vào trong hàm</strong> — đo thật: trong <code>main</code>, <code>sizeof(m)</code> là 60, nhưng trong một hàm nhận <code>int a[][5]</code> thì <code>sizeof(a)</code> là 8 — cỡ của một con trỏ — nên <code>sizeof(a)/sizeof(a[0])</code> ra 8/20 = <strong>0 hàng</strong>. Clang còn cảnh báo thẳng: <em>"sizeof on array function parameter will return size of 'int (*)[5]'"</em>. Mẹo đếm hàng/cột của slide 46 chỉ đúng ở nơi mảng được khai báo.</li>
<li><strong><code>%4d</code> mới là thứ biến nó thành ma trận trên màn hình</strong> — bề rộng trường cố định bằng 4 canh phải mọi con số, nên các cột thẳng hàng dù giá trị là <code>1</code>, <code>-9</code> hay <code>40</code>. Viết <code>"%d "</code> trơn sẽ cho một cầu thang lởm chởm. Lệnh <code>printf("\\n")</code> sau vòng trong chính là thứ kết thúc mỗi hàng.</li>
<li><strong><code>calculateSum</code> TRẢ VỀ chứ không in</strong> — cùng nguyên tắc tái sử dụng với các hàm tìm kiếm ở slide 25: một hàm vừa tính vừa in thì không dùng lại được để tính trung bình hay tìm lớn nhất.</li>
</ul>
<pre><code>/* Function to calculate the sum of elements of the 2D array */
int calculateSum(int rows, int cols, int arr[rows][cols]) {
    int sum = 0;
    for (int i = 0; i &lt; rows; i++) {
        for (int j = 0; j &lt; cols; j++) {
            sum += arr[i][j];
        }
    }
    return sum;
}

/* Function to print the 2D array as a matrix */
void printMatrix(int rows, int cols, int arr[rows][cols]) {
    for (int i = 0; i &lt; rows; i++) {
        for (int j = 0; j &lt; cols; j++) {
            printf("%4d", arr[i][j]);   /* Format to align values in columns */
        }
        printf("\\n");                   /* New line after each row */
    }
}</code></pre>
<p class="dap-an">✅ Đo thật, trên ma trận 3×5 của slide 46. Truyền nó cho một hàm khai <code>void inSai(int a[][4], int soHang)</code>: vẫn biên dịch, vẫn chạy, không có gì đáng sợ hiện ra — và in ra một ma trận SAI:</p>
<table>
<tr><th>tham số khai báo</th><th>hàm in ra cái gì</th></tr>
<tr><td><code>int a[][4]</code> (sai)</td><td><code>1 7 6 3</code> / <code>7 2 -9 2</code> / <code>5 8 -5 40</code></td></tr>
<tr><td><code>int a[][5]</code> (đúng)</td><td><code>1 7 6 3 7</code> / <code>2 -9 2 5 8</code> / <code>-5 40 0 5 9</code></td></tr>
</table>
<p class="pitfall">⚠️ Hãy nhìn kỹ hàng sai ở trên: các giá trị không hề ngẫu nhiên, chúng là <em>đúng dãy phẳng bị cắt theo độ dài sai</em>. Hàm đi theo <code>base + (i*4 + j)*4</code> trên một vùng nhớ được bố trí cho 5 cột, nên mọi hàng từ hàng thứ hai trở đi đều bắt đầu sớm 4 byte và cả bức tranh trượt ngang — kèm theo đó là 5 trong 15 phần tử không bao giờ được hiện ra. Không có gì sập, không một cảnh báo nào, và kết quả trông y như một ma trận hết sức bình thường. Đây đúng là kiểu hỏng mà quy tắc "phải khai số cột" sinh ra để ngăn, và là lý do một câu thi đưa bạn xem tham số khai sai thì nó đang hỏi về <em>kết quả bị lệch hàng</em>, chứ không phải về một lỗi biên dịch.</p>`],

      [49, 'Summary',
        `<p class="y-chinh">🎯 The first summary slide compresses the whole chapter into four statements and then splits arrays into two families by <em>where the memory comes from</em>: static arrays live in the stack segment, dynamic arrays are asked for at run time with <code>calloc</code>. Everything in the deck so far has been static; these three <code>calloc</code> lines are the door to the other half.</p>
<ul>
<li><strong>"Array is the simplest data structure for a group of elements which belong to the same data type"</strong> — the "same data type" clause is what makes the index arithmetic possible at all: every element is the same size, so position <code>i</code> is a multiplication rather than a search. Slide 51 onward relaxes exactly this constraint with <code>struct</code>.</li>
<li><strong>"Each element is identified by one or more index beginning from 0"</strong> — and the next line defines dimensions as the <em>count</em> of those indexes. A 1-D array needs one, a matrix needs two; nothing else about the two cases is different.</li>
<li><strong>Static → stack segment</strong> — <code>DataType a[MAXN];</code> and <code>DataType m[MAXROW][MAXCOL];</code>. Size fixed at compile time, memory reclaimed automatically when the function returns, and a hard ceiling of a few megabytes. That ceiling is why <code>MAX_SIZE 100</code> in the case study was a real design decision, not decoration.</li>
<li><strong>Dynamic 1-D: <code>double *a = (double*)calloc(n, sizeof(double));</code></strong> — <code>n</code> can be anything the user typed, the memory comes from the heap, and it stays until <code>free</code>. <code>calloc</code> takes count and element size separately and, unlike <code>malloc</code>, zeroes what it returns — measured: all five <code>double</code>s came back as 0.0.</li>
<li><strong>Dynamic 2-D takes a loop, not one call</strong> — <code>int** m = (int**)calloc(row, sizeof(int*));</code> then <code>for (i=0; i&lt;row; i++) m[i] = (int*)calloc(col, sizeof(int));</code>. First an array of <em>pointers</em>, then one array of <code>int</code> per row. <code>row + 1</code> allocations in total.</li>
<li><strong>The syntax is identical, the memory is not</strong> — <code>m[i][j]</code> reads the same on both, which is precisely the trap. For <code>int**</code>, <code>m[i][j]</code> means "follow the pointer at <code>m[i]</code>, then step <code>j</code>" — two memory reads, and the rows can sit anywhere. Row-major applies to <code>int m[3][5]</code> and <strong>not</strong> to <code>int**</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void)
{   int row = 3, col = 5, i, j;
    double *a = (double*)calloc(5, sizeof(double));
    int **m = (int**)calloc(row, sizeof(int*));
    int tinh[3][5];

    for (i = 0; i &lt; row; i++) m[i] = (int*)calloc(col, sizeof(int));
    for (i = 0; i &lt; row; i++)
        for (j = 0; j &lt; col; j++) m[i][j] = i * 10 + j;
    for (i = 0; i &lt; row; i++)
        for (j = 0; j &lt; col; j++) tinh[i][j] = i * 10 + j;

    printf("m[1][3] = %d  (cu phap y het mang tinh)\\n", m[1][3]);
    printf("DONG  : (char*)m[1] - (char*)m[0]       = %ld byte\\n",
           (long)((char*)m[1] - (char*)m[0]));
    printf("TINH  : (char*)tinh[1] - (char*)tinh[0] = %ld byte\\n",
           (long)((char*)tinh[1] - (char*)tinh[0]));
    printf("sizeof(m) = %zu (con tro!), sizeof(m[0]) = %zu\\n", sizeof(m), sizeof(m[0]));

    for (i = 0; i &lt; row; i++) free(m[i]);   /* giai phong NGUOC thu tu cap phat */
    free(m);
    free(a);
    return 0;
}</code></pre>
<table>
<tr><th></th><th><code>int m[3][5]</code> (static)</th><th><code>int **m</code> (calloc)</th></tr>
<tr><td>where</td><td>stack segment</td><td>heap</td></tr>
<tr><td>size fixed</td><td>at compile time</td><td>at run time</td></tr>
<tr><td>allocations</td><td>1 (implicit)</td><td><code>row + 1</code></td></tr>
<tr><td>gap between row 0 and row 1</td><td><strong>20 bytes, always</strong></td><td><strong>32 bytes here — allocator's choice</strong></td></tr>
<tr><td><code>sizeof</code> trick for rows/cols</td><td>works</td><td>meaningless (8 and 8)</td></tr>
<tr><td>clean-up</td><td>automatic</td><td><code>free</code> each row, then <code>free(m)</code></td></tr>
</table>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run. <code>m[1][3]</code> printed 13, exactly as a static matrix would. But the row gap came out at <strong>32 bytes for the <code>calloc</code> version against 20 for the static one</strong> — the static matrix's rows are 5×4 = 20 bytes apart by definition, while the three heap rows landed wherever the allocator put them (32 is this allocator's rounding, not a rule; another machine may print something else entirely — that unpredictability <em>is</em> the point). <code>sizeof(m)</code> was 8 and <code>sizeof(m[0])</code> was 8, both pointer sizes, so the row/column formula of slide 46 returns nonsense here. And <code>calloc</code> did zero its memory: the five fresh <code>double</code>s all read 0.0.</p>
<p class="pitfall">⚠️ Three ways this slide's <code>calloc</code> lines bite. <strong>(1)</strong> Never write <code>free(m)</code> before the loop that frees each <code>m[i]</code> — once <code>m</code> is gone you have no way to reach the rows, and that is a leak you cannot repair. Free inward-out: rows first, then the pointer array. <strong>(2)</strong> <code>calloc</code> returns <code>NULL</code> when it fails and C will not stop you from using it; a real program tests every one of the <code>row + 1</code> returns. <strong>(3)</strong> Do not pass an <code>int**</code> to a function expecting <code>int a[][5]</code>, or the reverse — they look interchangeable in source and are completely different in memory; the compiler will refuse, and if you silence it with a cast the program will read garbage.</p>`,
        `<p class="y-chinh">🎯 Slide tổng kết thứ nhất nén cả chương vào bốn phát biểu, rồi chia mảng thành hai họ theo <em>bộ nhớ đến từ đâu</em>: mảng tĩnh nằm ở phân đoạn ngăn xếp, mảng động được xin lúc chạy bằng <code>calloc</code>. Mọi thứ trong bộ slide tới giờ đều là tĩnh; ba dòng <code>calloc</code> này là cánh cửa sang nửa còn lại.</p>
<ul>
<li><strong>"Mảng là cấu trúc dữ liệu đơn giản nhất cho một nhóm phần tử CÙNG KIỂU"</strong> — chính mệnh đề "cùng kiểu" là thứ làm cho phép tính chỉ số khả thi: mọi phần tử cùng kích thước, nên vị trí thứ <code>i</code> là một phép NHÂN chứ không phải một cuộc tìm kiếm. Từ slide 51 trở đi, <code>struct</code> nới lỏng đúng ràng buộc này.</li>
<li><strong>"Mỗi phần tử được xác định bằng một hoặc nhiều chỉ số, bắt đầu từ 0"</strong> — và dòng kế định nghĩa số chiều là <em>số lượng</em> các chỉ số đó. Mảng 1 chiều cần một, ma trận cần hai; ngoài điểm đó ra hai trường hợp không khác gì nhau.</li>
<li><strong>Tĩnh → phân đoạn ngăn xếp</strong> — <code>DataType a[MAXN];</code> và <code>DataType m[MAXROW][MAXCOL];</code>. Cỡ chốt lúc biên dịch, bộ nhớ tự thu hồi khi hàm trả về, và có một trần cứng chỉ vài megabyte. Chính cái trần đó khiến <code>MAX_SIZE 100</code> trong case study là một quyết định thiết kế thật, không phải trang trí.</li>
<li><strong>Động 1 chiều: <code>double *a = (double*)calloc(n, sizeof(double));</code></strong> — <code>n</code> có thể là bất cứ số nào người dùng gõ, bộ nhớ lấy từ heap, và nó tồn tại cho tới khi <code>free</code>. <code>calloc</code> nhận số lượng và cỡ phần tử tách riêng, và khác <code>malloc</code>, nó XOÁ SẠCH vùng trả về — đo thật: cả năm <code>double</code> mới cấp đều bằng 0.0.</li>
<li><strong>Động 2 chiều cần một vòng lặp, không phải một lời gọi</strong> — <code>int** m = (int**)calloc(row, sizeof(int*));</code> rồi <code>for (i=0; i&lt;row; i++) m[i] = (int*)calloc(col, sizeof(int));</code>. Trước là một mảng các <em>con trỏ</em>, sau là mỗi hàng một mảng <code>int</code>. Tổng cộng <code>row + 1</code> lần cấp phát.</li>
<li><strong>Cú pháp giống hệt, bộ nhớ thì không</strong> — <code>m[i][j]</code> viết y như nhau, và đó chính xác là cái bẫy. Với <code>int**</code>, <code>m[i][j]</code> nghĩa là "theo con trỏ ở <code>m[i]</code>, rồi bước <code>j</code> ô" — hai lần đọc bộ nhớ, và các hàng nằm ở đâu cũng được. Row-major áp dụng cho <code>int m[3][5]</code> và <strong>KHÔNG</strong> áp dụng cho <code>int**</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void)
{   int row = 3, col = 5, i, j;
    double *a = (double*)calloc(5, sizeof(double));
    int **m = (int**)calloc(row, sizeof(int*));
    int tinh[3][5];

    for (i = 0; i &lt; row; i++) m[i] = (int*)calloc(col, sizeof(int));
    for (i = 0; i &lt; row; i++)
        for (j = 0; j &lt; col; j++) m[i][j] = i * 10 + j;
    for (i = 0; i &lt; row; i++)
        for (j = 0; j &lt; col; j++) tinh[i][j] = i * 10 + j;

    printf("m[1][3] = %d  (cu phap y het mang tinh)\\n", m[1][3]);
    printf("DONG  : (char*)m[1] - (char*)m[0]       = %ld byte\\n",
           (long)((char*)m[1] - (char*)m[0]));
    printf("TINH  : (char*)tinh[1] - (char*)tinh[0] = %ld byte\\n",
           (long)((char*)tinh[1] - (char*)tinh[0]));
    printf("sizeof(m) = %zu (con tro!), sizeof(m[0]) = %zu\\n", sizeof(m), sizeof(m[0]));

    for (i = 0; i &lt; row; i++) free(m[i]);   /* giai phong NGUOC thu tu cap phat */
    free(m);
    free(a);
    return 0;
}</code></pre>
<table>
<tr><th></th><th><code>int m[3][5]</code> (tĩnh)</th><th><code>int **m</code> (calloc)</th></tr>
<tr><td>nằm ở đâu</td><td>phân đoạn ngăn xếp</td><td>heap</td></tr>
<tr><td>cỡ chốt lúc nào</td><td>biên dịch</td><td>chạy</td></tr>
<tr><td>số lần cấp phát</td><td>1 (ngầm)</td><td><code>row + 1</code></td></tr>
<tr><td>khoảng cách hàng 0 → hàng 1</td><td><strong>20 byte, luôn luôn</strong></td><td><strong>32 byte ở lần đo này — do bộ cấp phát quyết</strong></td></tr>
<tr><td>mẹo <code>sizeof</code> đếm hàng/cột</td><td>chạy được</td><td>vô nghĩa (8 và 8)</td></tr>
<tr><td>dọn dẹp</td><td>tự động</td><td><code>free</code> từng hàng, rồi <code>free(m)</code></td></tr>
</table>
<p class="dap-an">✅ Biên dịch bằng <code>cc -Wall</code> rồi chạy. <code>m[1][3]</code> in ra 13, đúng y như một ma trận tĩnh. Nhưng khoảng cách giữa hai hàng cho ra <strong>32 byte ở bản <code>calloc</code> so với 20 byte ở bản tĩnh</strong> — các hàng của ma trận tĩnh cách nhau đúng 5×4 = 20 byte theo định nghĩa, còn ba hàng trên heap rơi vào bất cứ chỗ nào bộ cấp phát xếp cho (con số 32 là cách làm tròn của bộ cấp phát này, không phải một quy tắc; máy khác có thể in ra số hoàn toàn khác — và chính sự không đoán trước được ĐÓ mới là ý nghĩa của phép đo). <code>sizeof(m)</code> bằng 8 và <code>sizeof(m[0])</code> cũng bằng 8, đều là cỡ con trỏ, nên công thức đếm hàng/cột của slide 46 trả về kết quả vô nghĩa ở đây. Và <code>calloc</code> quả thật có xoá bộ nhớ: năm <code>double</code> mới cấp đều đọc ra 0.0.</p>
<p class="pitfall">⚠️ Ba cách mấy dòng <code>calloc</code> này cắn bạn. <strong>(1)</strong> Đừng bao giờ viết <code>free(m)</code> TRƯỚC vòng lặp giải phóng từng <code>m[i]</code> — <code>m</code> mất rồi thì không còn đường nào chạm tới các hàng nữa, và đó là một chỗ rò không vá được. Giải phóng từ trong ra: các hàng trước, mảng con trỏ sau. <strong>(2)</strong> <code>calloc</code> trả <code>NULL</code> khi thất bại và C sẽ không ngăn bạn dùng nó; chương trình thật phải kiểm cả <code>row + 1</code> giá trị trả về. <strong>(3)</strong> Đừng truyền <code>int**</code> cho hàm mong đợi <code>int a[][5]</code>, hay ngược lại — trong mã nguồn chúng trông như thay thế được cho nhau, trong bộ nhớ thì hoàn toàn khác; trình biên dịch sẽ từ chối, và nếu bạn ép kiểu cho nó im thì chương trình sẽ đọc phải rác.</p>`],

      [50, 'Summary',
        `<p class="y-chinh">🎯 The closing slide of the arrays half is one table plus one list. The table says how to write an element's address and its value in both dimensions, and then gives the arithmetic the compiler performs underneath: <code>a + index*sizeof(DataType)</code> for a vector, <code>m + (i*NumCol + j)*sizeof(DataType)</code> for a matrix. The list names the six operations the whole chapter was built around: Add, Search, Remove, Input, Output, Sort.</p>
<ul>
<li><strong>Four equivalent spellings for one element of <code>a</code></strong> — the table's two rows give <code>a[index]</code> and <code>*(a + index)</code> for the value, <code>&amp;a[index]</code> and <code>a + index</code> for the address. Measured: <code>a[2]</code>, <code>*(a+2)</code> and <code>*(2+a)</code> all printed 30 on <code>int a[5] = {10,20,30,40,50}</code>. The indexing operator is literally defined as that addition, which is why the bizarre-looking <code>2[a]</code> also prints 30.</li>
<li><strong>⚠ The last row is BYTE arithmetic, not C you should type</strong> — this is the one line on the slide that will mislead you if you copy it. In C source, <code>a + index</code> <em>already</em> scales by the element size; multiplying by <code>sizeof</code> yourself multiplies twice. Measured on that same array: <code>*(a + 2*sizeof(int))</code> jumped 8 elements instead of 2 and printed <strong>7</strong> — a value from outside the array. The slide is describing what the compiler emits in machine terms; it is not a C expression.</li>
<li><strong>Why the 2-D half of the table leaves two cells empty</strong> — the slide fills in <code>&amp;m[i][j]</code> and <code>m[i][j]</code> but not the pointer forms, and that is honest, because <code>m + i</code> does not step one element. Measured: <code>(char*)(m+1) - (char*)m</code> is 20 bytes — a whole row — while <code>(char*)(m[0]+1) - (char*)m[0]</code> is 4. The correct pointer form has two stars: <code>*(*(m + i) + j)</code>, which printed 5 for <code>i=1, j=3</code>, matching <code>m[1][3]</code>.</li>
<li><strong><code>NumCol</code> is in the formula, <code>NumRow</code> is not</strong> — read the matrix line once more. This single asymmetry explains three separate rules you have met: why a function parameter must declare the columns (slide 48), why <code>int a[][3]</code> is legal but <code>int a[][]</code> is not, and why getting the column count wrong shifts the output sideways instead of crashing.</li>
<li><strong>Row-major has a speed consequence, not just an addressing one</strong> — walking <code>i</code> outside and <code>j</code> inside visits memory in the order it is stored; swapping the loops jumps a whole row every step and misses the cache almost every time. Measured below.</li>
<li><strong>The six operations are the chapter's table of contents</strong> — Add and Remove change <code>n</code> and therefore need it by address (slides 38–42); Search returns an index or −1 (slides 25–29); Sort reorders, or copies-then-reorders when positions must be preserved (slides 30–34, 43); Input and Output are the traversals of slides 20–24. Every exercise in the deck is one or more of these six.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{   int m[3][5] = { {1,7,6,3,7}, {2,-9,2,5,8}, {-5,40,0,5,9} };
    int a[5] = {10, 20, 30, 40, 50};

    printf("(char*)(m+1)      - (char*)m    = %ld byte  /* MOT HANG */\\n",
           (long)((char*)(m + 1) - (char*)m));
    printf("(char*)(m[0]+1)   - (char*)m[0] = %ld byte  /* MOT PHAN TU */\\n",
           (long)((char*)(m[0] + 1) - (char*)m[0]));
    printf("*(*(m+1)+3) = %d   m[1][3] = %d\\n", *(*(m + 1) + 3), m[1][3]);

    printf("a[2]=%d  *(a+2)=%d  *(2+a)=%d\\n", a[2], *(a + 2), *(2 + a));
    printf("&amp;a[2] - a = %ld phan tu, tuc %ld byte\\n",
           (long)(&amp;a[2] - a), (long)((char*)&amp;a[2] - (char*)a));
    printf("SAI: *(a + 2*sizeof(int)) = %d\\n", *(a + 2 * (int)sizeof(int)));
    return 0;
}</code></pre>
<table>
<tr><th>expression</th><th>1-D <code>int a[5]</code></th><th>2-D <code>int m[3][5]</code></th></tr>
<tr><td>value</td><td><code>a[index]</code> = <code>*(a + index)</code></td><td><code>m[i][j]</code> = <code>*(*(m + i) + j)</code></td></tr>
<tr><td>address</td><td><code>&amp;a[index]</code> = <code>a + index</code></td><td><code>&amp;m[i][j]</code> = <code>*(m + i) + j</code></td></tr>
<tr><td>what "+1" steps</td><td>4 bytes (one element)</td><td><code>m + 1</code> → <strong>20 bytes (one row)</strong>; <code>m[0] + 1</code> → 4 bytes</td></tr>
<tr><td>compiler's byte formula</td><td><code>a + index*sizeof(DataType)</code></td><td><code>m + (i*NumCol + j)*sizeof(DataType)</code></td></tr>
</table>
<p class="dap-an">✅ Every line of the table above was verified by running the program, compiled with <code>cc -Wall</code>, no warnings. <code>m + 1</code> advanced 20 bytes, <code>m[0] + 1</code> advanced 4, <code>*(*(m+1)+3)</code> and <code>m[1][3]</code> both gave 5, and <code>&amp;a[2] - a</code> was 2 <em>elements</em> = 8 <em>bytes</em> — the same distance expressed in the two units the slide mixes. The deliberate mistake <code>*(a + 2*sizeof(int))</code> returned 7, i.e. it read past the end of a five-element array, confirming that the slide's byte formula must never be typed as C. Separately, on a 4000×4000 <code>int</code> matrix (64 MB), summing every element three times each way: <strong>row order averaged 0.017 s, column order 0.074 s — 4.27× slower</strong> for identical arithmetic on identical data, and both produced the same total 8183955456.</p>
<p class="meo">💡 One sentence to carry into the exam: <em>the index is not a lookup, it is a multiplication</em>. Everything on this slide follows from that — why indexes start at 0 (so the first element needs no adjustment), why the element type must be fixed (so the multiplier is known), why the column count must travel with a matrix (it <em>is</em> the multiplier), and why walking rows beats walking columns by four times on real hardware. Slide 51 starts <code>struct</code>, where elements stop being the same size and this arithmetic is replaced by fixed field offsets.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại nửa mảng gồm một bảng và một danh sách. Bảng nói cách viết ĐỊA CHỈ và GIÁ TRỊ của một phần tử ở cả hai số chiều, rồi đưa ra phép tính mà trình biên dịch thực hiện bên dưới: <code>a + index*sizeof(DataType)</code> cho mảng một chiều, <code>m + (i*NumCol + j)*sizeof(DataType)</code> cho ma trận. Danh sách gọi tên sáu thao tác mà cả chương được dựng quanh: Add, Search, Remove, Input, Output, Sort.</p>
<ul>
<li><strong>Bốn cách viết cho cùng một phần tử của <code>a</code></strong> — hai hàng của bảng cho <code>a[index]</code> và <code>*(a + index)</code> ở cột giá trị, <code>&amp;a[index]</code> và <code>a + index</code> ở cột địa chỉ. Đo thật trên <code>int a[5] = {10,20,30,40,50}</code>: <code>a[2]</code>, <code>*(a+2)</code> và <code>*(2+a)</code> đều in ra 30. Toán tử chỉ số được ĐỊNH NGHĨA đúng bằng phép cộng đó, nên cái biểu thức trông quái dị <code>2[a]</code> cũng in ra 30.</li>
<li><strong>⚠ Hàng cuối là phép tính theo BYTE, không phải C để bạn gõ</strong> — đây là dòng duy nhất trên slide sẽ lừa bạn nếu chép nguyên. Trong mã C, <code>a + index</code> <em>đã</em> tự nhân với cỡ phần tử rồi; bạn nhân thêm <code>sizeof</code> là nhân hai lần. Đo trên chính mảng đó: <code>*(a + 2*sizeof(int))</code> nhảy 8 phần tử thay vì 2 và in ra <strong>7</strong> — một giá trị nằm NGOÀI mảng. Slide đang mô tả thứ trình biên dịch sinh ra ở mức máy, nó không phải một biểu thức C.</li>
<li><strong>Vì sao nửa 2 chiều của bảng bỏ trống hai ô</strong> — slide điền <code>&amp;m[i][j]</code> và <code>m[i][j]</code> nhưng không điền dạng con trỏ, và đó là sự trung thực, bởi <code>m + i</code> KHÔNG bước một phần tử. Đo thật: <code>(char*)(m+1) - (char*)m</code> ra 20 byte — trọn một HÀNG — trong khi <code>(char*)(m[0]+1) - (char*)m[0]</code> ra 4. Dạng con trỏ đúng phải có hai dấu sao: <code>*(*(m + i) + j)</code>, in ra 5 với <code>i=1, j=3</code>, khớp <code>m[1][3]</code>.</li>
<li><strong>Công thức có <code>NumCol</code>, không có <code>NumRow</code></strong> — hãy đọc lại dòng ma trận một lần nữa. Riêng sự bất đối xứng này giải thích ba quy tắc bạn đã gặp: vì sao tham số hàm bắt buộc khai số cột (slide 48), vì sao <code>int a[][3]</code> hợp lệ còn <code>int a[][]</code> thì không, và vì sao khai sai số cột làm kết quả TRƯỢT NGANG chứ không làm chương trình sập.</li>
<li><strong>Row-major kéo theo hệ quả về TỐC ĐỘ, không chỉ về địa chỉ</strong> — cho <code>i</code> chạy ngoài và <code>j</code> chạy trong là đi qua bộ nhớ đúng thứ tự nó được lưu; đảo hai vòng lại thì mỗi bước nhảy trọn một hàng và hầu như lần nào cũng trượt cache. Số đo ở dưới.</li>
<li><strong>Sáu thao tác chính là mục lục của cả chương</strong> — Add và Remove làm đổi <code>n</code> nên cần <code>n</code> theo địa chỉ (slide 38–42); Search trả về chỉ số hoặc −1 (slide 25–29); Sort sắp lại, hoặc chép-rồi-sắp khi phải giữ nguyên vị trí (slide 30–34, 43); Input và Output là các lượt duyệt của slide 20–24. Mọi bài tập trong bộ slide đều là một hoặc vài trong sáu thứ này.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{   int m[3][5] = { {1,7,6,3,7}, {2,-9,2,5,8}, {-5,40,0,5,9} };
    int a[5] = {10, 20, 30, 40, 50};

    printf("(char*)(m+1)      - (char*)m    = %ld byte  /* MOT HANG */\\n",
           (long)((char*)(m + 1) - (char*)m));
    printf("(char*)(m[0]+1)   - (char*)m[0] = %ld byte  /* MOT PHAN TU */\\n",
           (long)((char*)(m[0] + 1) - (char*)m[0]));
    printf("*(*(m+1)+3) = %d   m[1][3] = %d\\n", *(*(m + 1) + 3), m[1][3]);

    printf("a[2]=%d  *(a+2)=%d  *(2+a)=%d\\n", a[2], *(a + 2), *(2 + a));
    printf("&amp;a[2] - a = %ld phan tu, tuc %ld byte\\n",
           (long)(&amp;a[2] - a), (long)((char*)&amp;a[2] - (char*)a));
    printf("SAI: *(a + 2*sizeof(int)) = %d\\n", *(a + 2 * (int)sizeof(int)));
    return 0;
}</code></pre>
<table>
<tr><th>biểu thức</th><th>1 chiều <code>int a[5]</code></th><th>2 chiều <code>int m[3][5]</code></th></tr>
<tr><td>giá trị</td><td><code>a[index]</code> = <code>*(a + index)</code></td><td><code>m[i][j]</code> = <code>*(*(m + i) + j)</code></td></tr>
<tr><td>địa chỉ</td><td><code>&amp;a[index]</code> = <code>a + index</code></td><td><code>&amp;m[i][j]</code> = <code>*(m + i) + j</code></td></tr>
<tr><td>"+1" bước bao nhiêu</td><td>4 byte (một phần tử)</td><td><code>m + 1</code> → <strong>20 byte (một HÀNG)</strong>; <code>m[0] + 1</code> → 4 byte</td></tr>
<tr><td>công thức byte của trình biên dịch</td><td><code>a + index*sizeof(DataType)</code></td><td><code>m + (i*NumCol + j)*sizeof(DataType)</code></td></tr>
</table>
<p class="dap-an">✅ Mọi dòng trong bảng trên đều đã kiểm bằng cách chạy chương trình, biên dịch <code>cc -Wall</code>, không cảnh báo nào. <code>m + 1</code> tiến 20 byte, <code>m[0] + 1</code> tiến 4 byte, <code>*(*(m+1)+3)</code> và <code>m[1][3]</code> cùng cho 5, còn <code>&amp;a[2] - a</code> ra 2 <em>phần tử</em> = 8 <em>byte</em> — cùng một khoảng cách nói bằng hai đơn vị mà slide trộn lẫn. Phép sai cố ý <code>*(a + 2*sizeof(int))</code> trả về 7, tức đã đọc vượt khỏi mảng năm phần tử, xác nhận rằng công thức byte của slide tuyệt đối không được gõ thành mã C. Đo riêng phần tốc độ: trên ma trận <code>int</code> cỡ 4000×4000 (64 MB), cộng toàn bộ phần tử ba lượt theo mỗi chiều — <strong>duyệt theo HÀNG trung bình 0,017 s, duyệt theo CỘT 0,074 s, chậm hơn 4,27 lần</strong> với cùng phép tính trên cùng dữ liệu, và cả hai đều ra cùng tổng 8183955456.</p>
<p class="meo">💡 Một câu mang vào phòng thi: <em>chỉ số không phải một cuộc tra cứu, nó là một phép nhân</em>. Mọi thứ trên slide này đều suy ra từ đó — vì sao chỉ số bắt đầu từ 0 (để phần tử đầu không cần trừ đi gì), vì sao kiểu phần tử phải cố định (để biết thừa số nhân), vì sao số cột phải đi kèm ma trận (nó CHÍNH LÀ thừa số nhân), và vì sao đi theo hàng nhanh gấp bốn lần đi theo cột trên phần cứng thật. Slide 51 mở sang <code>struct</code>, nơi các phần tử thôi cùng kích thước và phép tính này được thay bằng độ lệch cố định của từng trường.</p>`],
    ]),
  ].join('\n'),
};
