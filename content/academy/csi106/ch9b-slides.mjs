/**
 * CSI106 · Chương 9 — Data structures, học theo từng slide: PHẦN B (slide 20–37).
 * Deck 'csi9' (CSI9), 37 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi9/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_09.pptx của trường (/tmp/csi106-text/csi9.txt, slide 20→37).
 * Các slide chỉ có tiêu đề + hình (20, 22, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37)
 * đã được đọc thẳng từ ảnh đã render để lấy đúng từng nhãn, từng con số trong sơ đồ.
 *
 * MỌI dãy kết quả, mọi bảng từng bước và mọi số đo thời gian trong bài đều do chương trình C
 * biên dịch bằng `cc -Wall` và chạy thật sinh ra (máy Apple silicon, macOS, clang -O2):
 *   bench.c      — chèn 100.000 phần tử vào đầu mảng vs vào đầu danh sách liên kết
 *   bench2.c     — 20.000 lần truy cập ngẫu nhiên, mảng vs danh sách
 *   ptr_order2.c — hai thứ tự sửa con trỏ, bản sai làm nút tự trỏ vào chính nó
 *   list_ops.c   — 4 ca chèn + 4 ca xoá, in danh sách trước/sau từng bước
 *   sq.c         — stack vs queue trên cùng dãy 5,10,15,20 + kiểm dấu ngoặc
 *   queueimpl.c  — 4 cách hiện thực queue, đo thời gian
 *   trees.c      — preorder/inorder/postorder/BFS cho cây slide 33, BST slide 35, cây biểu thức slide 34
 *   expr.c       — máy tính hậu tố bằng stack
 *   adt_bst.c    — một ADT hai hiện thực; chiều cao BST cân bằng vs suy biến
 *   huff.c       — mã Huffman thật cho "MISSISSIPPI RIVER"
 *   graphmem.c   — bộ nhớ ma trận kề vs danh sách kề cho V=1000, E=5000
 *   g37.c        — ma trận kề có trọng số + Floyd–Warshall cho đồ thị slide 37
 *
 * Những chỗ SLIDE GỐC SAI hoặc tự mâu thuẫn — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 20 viết "otherwise abort the insertion algorithm Four cases can arise" — dính hai
 *     câu vào nhau vì mất dấu chấm; và nó nói "nếu cờ trả về là false thì CHO chèn", tức là
 *     thuật toán chỉ đúng cho danh sách KHÔNG trùng khoá, slide không nói điều kiện đó ra.
 *   · slide 24 đặt hai chú thích hình đều là "Three representations of stacks" trong khi hình
 *     trên vẽ phép PUSH và hình dưới vẽ phép POP; lại còn một hình mang số cũ "Figure 12.2"
 *     và một hình mang số mới "Figure 9.15" ngay trên cùng một slide.
 *   · slide 32 / 35 / 36 thân slide vẫn trỏ "Figure 12.22" · "Figure 12.28" · "Figure 12.32"
 *     (số của Forouzan) trong khi chú thích hình đã đánh lại thành 9.21 · 9.24 · 9.25.
 *   · slide 34 ghi ba dạng ký hiệu nhưng KHÔNG nói rằng dạng infix bắt buộc phải có dấu ngoặc
 *     mới khôi phục được cây; chạy thật cho thấy inorder thô của chính cây trên slide ra một
 *     biểu thức có giá trị KHÁC (15 thay vì 19 với a=2,b=3,c=4,d=5).
 *   · slide 35 chỉ vẽ ba cây ĐỀU là BST, không có phản ví dụ, nên không rèn được kỹ năng
 *     "kiểm tra một cây có phải BST không" — phần thường bị hỏi trong đề.
 *   · slide 30 nói queue hiện thực bằng mảng hoặc danh sách liên kết nhưng không nhắc tới
 *     mảng VÒNG, mà thiếu nó thì bản mảng báo "đầy" khi vẫn còn chỗ trống (đo được ở dưới).
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi9';

export default {
  title: '9.0b — Slide by slide: Linked lists, stacks, queues, trees and graphs (slides 20–37)|||9.0b — Slide bài giảng: Danh sách liên kết, ngăn xếp, hàng đợi, cây và đồ thị (slide 20–37)',
  slug: 'csi106-9-0b-slides-danh-sach-lien-ket-stack-queue',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 9 của CSI106 (slide 20–37) đi theo đúng bộ slide của trường: bốn trường hợp chèn vào danh sách liên kết cùng thứ tự sửa con trỏ sống còn, rồi khái niệm kiểu dữ liệu trừu tượng (ADT) và bốn cấu trúc kinh điển — ngăn xếp LIFO, hàng đợi FIFO, cây nhị phân cùng ba phép duyệt, và đồ thị. Mỗi thao tác trên danh sách liên kết có một bảng trước–sửa–sau, và mọi con số trong bài đều do chương trình C chạy thật sinh ra: chèn 100.000 phần tử vào đầu mảng chậm hơn danh sách liên kết khoảng 490 lần, truy cập ngẫu nhiên thì ngược lại danh sách chậm hơn khoảng 74.000 lần, ma trận kề của đồ thị 1000 đỉnh/5000 cạnh tốn 3,81 MiB so với 164 KiB của danh sách kề, và duyệt inorder một BST cho đúng dãy tăng dần.',
  content: [
    walkHead(D, 20, 37),
    walk(D, [

      [20, '5. Operations on linked lists (inserting)',
        `<p class="y-chinh">🎯 The whole art of a linked list lives on this slide: you never move data, you only <strong>re-aim two pointers</strong> — and the <em>order</em> in which you re-aim them decides whether you get a correct list or a destroyed one.</p>
<ul>
<li><strong>Why searching comes first</strong> — the slide says insertion calls the search algorithm of slide 19. Search returns the pair <code>(pre, cur)</code>: <code>pre</code> is the node <em>before</em> the insertion point, <code>cur</code> the node <em>after</em>. A singly linked node cannot look backwards, so <code>pre</code> must be captured on the way down; there is no way to recover it afterwards.</li>
<li><strong>What the returned flag means</strong> — "if the flag is false, allow insertion, otherwise abort". False means "the key was <em>not</em> found", so inserting it creates no duplicate. This silently assumes the list must hold <em>distinct</em> keys — a condition the slide never states. A list of exam scores, where two students may score 7.5, would need a different rule.</li>
<li><strong>The two assignments, in the order the figure shows them</strong> — <code>(*new).link &lt;- cur</code> first, then <code>(*pre).link &lt;- new</code>. In C: <code>new-&gt;next = cur;</code> then <code>pre-&gt;next = new;</code>. Both are O(1): no loop, no shifting, no matter whether the list holds 5 nodes or 5 million.</li>
<li><strong>Four cases — but really only two</strong> — inserting into an empty list and inserting at the beginning both set <code>pre = NULL</code> and both change the <em>list pointer itself</em>. Inserting in the middle and at the end both have a real <code>pre</code>. The difference between middle and end is only that <code>cur</code> happens to be <code>NULL</code> at the end, and <code>new-&gt;next = NULL</code> is exactly what a last node needs.</li>
<li><strong>The list name is not a node</strong> — recall slide 18. When <code>pre</code> is <code>NULL</code> you must write to <code>list</code>, the pointer variable itself, which in C means passing <code>&amp;list</code> or returning the new head. Forgetting this is the single most common reason a "working" insert silently loses the first element.</li>
</ul>
<p class="nhan">Case A — insert into an <strong>empty</strong> list (add 102). Run of <code>list_ops.c</code>:</p>
<table>
<tr><th>Stage</th><th>State</th><th>Pointer changed</th></tr>
<tr><td>Before</td><td><code>list = NULL</code></td><td>—</td></tr>
<tr><td>Step 1</td><td><code>new(102)-&gt;next = list</code> (= NULL)</td><td><code>new-&gt;next</code></td></tr>
<tr><td>Step 2</td><td><code>list = new</code></td><td><strong>the list name itself</strong></td></tr>
<tr><td>After</td><td><code>list -&gt; 102 -&gt; NULL</code></td><td>—</td></tr>
</table>
<p class="nhan">Case B — insert at the <strong>beginning</strong> (add 45 in front of 102), <code>pre = NULL</code>:</p>
<table>
<tr><th>Stage</th><th>State</th><th>Pointer changed</th></tr>
<tr><td>Before</td><td><code>list -&gt; 102 -&gt; NULL</code></td><td>—</td></tr>
<tr><td>Step 1</td><td><code>new(45)-&gt;next = list</code> ⇒ 45 → 102</td><td><code>new-&gt;next</code></td></tr>
<tr><td>Step 2</td><td><code>list = new</code></td><td><strong>the list name itself</strong></td></tr>
<tr><td>After</td><td><code>list -&gt; 45 -&gt; 102 -&gt; NULL</code></td><td>—</td></tr>
</table>
<p class="nhan">Case C — insert in the <strong>middle</strong>, exactly the figure on the slide: put 156 between 132 and 178 in <code>list -&gt; 102 -&gt; 132 -&gt; 178 -&gt; 201</code>. Search returns <code>pre = 132</code>, <code>cur = 178</code>:</p>
<table>
<tr><th>Stage</th><th>132's link</th><th>156's link</th><th>List</th></tr>
<tr><td>Before</td><td>→ 178</td><td>— (node not linked)</td><td>102 → 132 → 178 → 201</td></tr>
<tr><td>Step 1 <code>(*new).link &lt;- cur</code></td><td>→ 178</td><td><strong>→ 178</strong></td><td>unchanged (two nodes point at 178)</td></tr>
<tr><td>Step 2 <code>(*pre).link &lt;- new</code></td><td><strong>→ 156</strong></td><td>→ 178</td><td>102 → 132 → 156 → 178 → 201</td></tr>
</table>
<p class="nhan">Case D — insert at the <strong>end</strong> (add 250 after 201). Search walks to the last node, so <code>pre = 201</code> and <code>cur = NULL</code>:</p>
<table>
<tr><th>Stage</th><th>201's link</th><th>250's link</th><th>List</th></tr>
<tr><td>Before</td><td>→ NULL</td><td>—</td><td>… → 178 → 201 → NULL</td></tr>
<tr><td>Step 1</td><td>→ NULL</td><td><strong>= cur = NULL</strong></td><td>unchanged</td></tr>
<tr><td>Step 2</td><td><strong>→ 250</strong></td><td>→ NULL</td><td>… → 178 → 201 → 250 → NULL</td></tr>
</table>
<p class="nhan">Deletion is the mirror image — <em>one</em> pointer changes, then the node is freed. Measured run of <code>list_ops.c</code> on <code>102 → 132 → 156 → 178 → 201 → 250</code>:</p>
<table>
<tr><th>Case</th><th>pre</th><th>Assignment</th><th>Result</th></tr>
<tr><td>Delete first (102)</td><td>NULL</td><td><code>list = cur-&gt;next</code></td><td>132 → 156 → 178 → 201 → 250</td></tr>
<tr><td>Delete middle (156)</td><td>132</td><td><code>pre-&gt;next = cur-&gt;next</code></td><td>132 → 178 → 201 → 250</td></tr>
<tr><td>Delete last (250)</td><td>201</td><td><code>pre-&gt;next = cur-&gt;next</code> (= NULL)</td><td>132 → 178 → 201</td></tr>
<tr><td>Delete the only node</td><td>NULL</td><td><code>list = cur-&gt;next</code> (= NULL)</td><td>empty list</td></tr>
</table>
<p class="nhan">Now the experiment the slide does not do. Two functions differing <em>only</em> in the order of two lines (<code>ptr_order2.c</code>, compiled with <code>cc -Wall -O2</code>):</p>
<pre>void chen_dung(node *pre, int v){          void chen_sai(node *pre, int v){
    node *nw = malloc(sizeof(node));           node *nw = malloc(sizeof(node));
    nw-&gt;data = v;                              nw-&gt;data = v;
    nw-&gt;next  = pre-&gt;next;   /* 1 */           pre-&gt;next = nw;         /* 1 */
    pre-&gt;next = nw;          /* 2 */           nw-&gt;next  = pre-&gt;next;  /* 2 */
}                                          }</pre>
<p class="nhan">Real output:</p>
<pre>truoc:                 list -&gt; 102 -&gt; 132 -&gt; 178 -&gt; 201 -&gt; NULL   (4 nut)
sau (dung thu tu):     list -&gt; 102 -&gt; 132 -&gt; 156 -&gt; 178 -&gt; 201 -&gt; NULL   (5 nut)
sau (sai thu tu):      list -&gt; 102 -&gt; 132 -&gt; 156 -&gt; 156 -&gt; 156 -&gt; 156 ...  (infinite)</pre>
<p class="dap-an">✅ Answer: in the wrong order, step 1 overwrites <code>pre-&gt;next</code> — the <em>only</em> road to node 178 — so 178 and 201 become unreachable garbage. Worse, step 2 then reads <code>pre-&gt;next</code>, which is now <code>nw</code> itself, so node 156 points at <strong>itself</strong> and every traversal loop hangs forever. Two correct-looking lines, swapped, produce data loss <em>and</em> an infinite loop. This is why the figure on the slide numbers the two assignments.</p>
<p class="meo">💡 One rule that covers every pointer surgery on a singly linked list: <strong>tie the new node to the part you are about to let go of, before you let go of it.</strong> Attach downstream first, cut upstream second.</p>
<p class="pitfall">⚠️ Exam trap. "Insertion in a linked list is O(1)" is only half true, and the half that is missing costs marks. Re-aiming the pointers is O(1); <em>finding</em> <code>pre</code> and <code>cur</code> is O(n) because the search is necessarily sequential (slide 19: no binary search on a linked list). So inserting at a known position is O(1), inserting at a value you must look up is O(n).</p>`,
        `<p class="y-chinh">🎯 Toàn bộ nghệ thuật của danh sách liên kết nằm trên slide này: bạn không bao giờ dời dữ liệu, bạn chỉ <strong>chĩa lại hai con trỏ</strong> — và <em>thứ tự</em> chĩa lại quyết định bạn được một danh sách đúng hay một danh sách nát.</p>
<ul>
<li><strong>Vì sao phải tìm kiếm trước</strong> — slide nói phép chèn gọi thuật toán tìm kiếm của slide 19. Tìm kiếm trả về cặp <code>(pre, cur)</code>: <code>pre</code> là nút <em>đứng trước</em> chỗ chèn, <code>cur</code> là nút <em>đứng sau</em>. Nút của danh sách liên kết đơn không nhìn ngược lại được, nên <code>pre</code> phải được giữ lại trên đường đi xuống; đi qua rồi thì không cách nào lấy lại.</li>
<li><strong>Cái cờ trả về nghĩa là gì</strong> — "cờ false thì cho chèn, ngược lại thì huỷ". False nghĩa là "KHÔNG tìm thấy khoá", nên chèn vào không sinh ra khoá trùng. Điều này ngầm giả định danh sách phải chứa khoá <em>phân biệt</em> — một điều kiện slide không hề nói ra. Một danh sách điểm thi, nơi hai sinh viên có thể cùng 7,5, sẽ cần luật khác.</li>
<li><strong>Hai phép gán, theo đúng thứ tự hình vẽ</strong> — <code>(*new).link &lt;- cur</code> trước, rồi mới <code>(*pre).link &lt;- new</code>. Trong C: <code>new-&gt;next = cur;</code> rồi <code>pre-&gt;next = new;</code>. Cả hai đều O(1): không vòng lặp, không dồn dịch, bất kể danh sách có 5 nút hay 5 triệu nút.</li>
<li><strong>Bốn trường hợp — thật ra chỉ có hai</strong> — chèn vào danh sách rỗng và chèn vào đầu đều đặt <code>pre = NULL</code> và đều phải sửa <em>chính biến tên danh sách</em>. Chèn giữa và chèn cuối đều có <code>pre</code> thật. Khác nhau giữa giữa và cuối chỉ là ở cuối thì <code>cur</code> tình cờ bằng <code>NULL</code>, mà <code>new-&gt;next = NULL</code> lại đúng là thứ một nút cuối cần.</li>
<li><strong>Tên danh sách KHÔNG phải một nút</strong> — nhớ lại slide 18. Khi <code>pre</code> là <code>NULL</code>, bạn phải ghi vào <code>list</code>, tức chính biến con trỏ, mà trong C nghĩa là truyền <code>&amp;list</code> hoặc trả về đầu mới. Quên chỗ này là lý do phổ biến nhất khiến một hàm chèn "chạy được" lại âm thầm đánh mất phần tử đầu tiên.</li>
</ul>
<p class="nhan">Trường hợp A — chèn vào danh sách <strong>RỖNG</strong> (thêm 102). Chạy thật <code>list_ops.c</code>:</p>
<table>
<tr><th>Giai đoạn</th><th>Trạng thái</th><th>Con trỏ bị sửa</th></tr>
<tr><td>Trước</td><td><code>list = NULL</code></td><td>—</td></tr>
<tr><td>Bước 1</td><td><code>new(102)-&gt;next = list</code> (= NULL)</td><td><code>new-&gt;next</code></td></tr>
<tr><td>Bước 2</td><td><code>list = new</code></td><td><strong>chính tên danh sách</strong></td></tr>
<tr><td>Sau</td><td><code>list -&gt; 102 -&gt; NULL</code></td><td>—</td></tr>
</table>
<p class="nhan">Trường hợp B — chèn vào <strong>ĐẦU</strong> (thêm 45 trước 102), <code>pre = NULL</code>:</p>
<table>
<tr><th>Giai đoạn</th><th>Trạng thái</th><th>Con trỏ bị sửa</th></tr>
<tr><td>Trước</td><td><code>list -&gt; 102 -&gt; NULL</code></td><td>—</td></tr>
<tr><td>Bước 1</td><td><code>new(45)-&gt;next = list</code> ⇒ 45 → 102</td><td><code>new-&gt;next</code></td></tr>
<tr><td>Bước 2</td><td><code>list = new</code></td><td><strong>chính tên danh sách</strong></td></tr>
<tr><td>Sau</td><td><code>list -&gt; 45 -&gt; 102 -&gt; NULL</code></td><td>—</td></tr>
</table>
<p class="nhan">Trường hợp C — chèn vào <strong>GIỮA</strong>, đúng bức hình trên slide: đặt 156 giữa 132 và 178 trong <code>list -&gt; 102 -&gt; 132 -&gt; 178 -&gt; 201</code>. Tìm kiếm trả về <code>pre = 132</code>, <code>cur = 178</code>:</p>
<table>
<tr><th>Giai đoạn</th><th>Link của 132</th><th>Link của 156</th><th>Danh sách</th></tr>
<tr><td>Trước</td><td>→ 178</td><td>— (nút chưa nối)</td><td>102 → 132 → 178 → 201</td></tr>
<tr><td>Bước 1 <code>(*new).link &lt;- cur</code></td><td>→ 178</td><td><strong>→ 178</strong></td><td>chưa đổi (hai nút cùng trỏ vào 178)</td></tr>
<tr><td>Bước 2 <code>(*pre).link &lt;- new</code></td><td><strong>→ 156</strong></td><td>→ 178</td><td>102 → 132 → 156 → 178 → 201</td></tr>
</table>
<p class="nhan">Trường hợp D — chèn vào <strong>CUỐI</strong> (thêm 250 sau 201). Tìm kiếm đi tới nút cuối nên <code>pre = 201</code> và <code>cur = NULL</code>:</p>
<table>
<tr><th>Giai đoạn</th><th>Link của 201</th><th>Link của 250</th><th>Danh sách</th></tr>
<tr><td>Trước</td><td>→ NULL</td><td>—</td><td>… → 178 → 201 → NULL</td></tr>
<tr><td>Bước 1</td><td>→ NULL</td><td><strong>= cur = NULL</strong></td><td>chưa đổi</td></tr>
<tr><td>Bước 2</td><td><strong>→ 250</strong></td><td>→ NULL</td><td>… → 178 → 201 → 250 → NULL</td></tr>
</table>
<p class="nhan">Xoá là ảnh soi gương — chỉ <em>một</em> con trỏ đổi, rồi giải phóng nút. Chạy thật <code>list_ops.c</code> trên <code>102 → 132 → 156 → 178 → 201 → 250</code>:</p>
<table>
<tr><th>Trường hợp</th><th>pre</th><th>Phép gán</th><th>Kết quả</th></tr>
<tr><td>Xoá đầu (102)</td><td>NULL</td><td><code>list = cur-&gt;next</code></td><td>132 → 156 → 178 → 201 → 250</td></tr>
<tr><td>Xoá giữa (156)</td><td>132</td><td><code>pre-&gt;next = cur-&gt;next</code></td><td>132 → 178 → 201 → 250</td></tr>
<tr><td>Xoá cuối (250)</td><td>201</td><td><code>pre-&gt;next = cur-&gt;next</code> (= NULL)</td><td>132 → 178 → 201</td></tr>
<tr><td>Xoá nút duy nhất</td><td>NULL</td><td><code>list = cur-&gt;next</code> (= NULL)</td><td>danh sách rỗng</td></tr>
</table>
<p class="nhan">Bây giờ là phép thử slide không làm. Hai hàm chỉ khác nhau <em>đúng</em> ở thứ tự hai dòng (<code>ptr_order2.c</code>, dịch bằng <code>cc -Wall -O2</code>):</p>
<pre>void chen_dung(node *pre, int v){          void chen_sai(node *pre, int v){
    node *nw = malloc(sizeof(node));           node *nw = malloc(sizeof(node));
    nw-&gt;data = v;                              nw-&gt;data = v;
    nw-&gt;next  = pre-&gt;next;   /* 1 */           pre-&gt;next = nw;         /* 1 */
    pre-&gt;next = nw;          /* 2 */           nw-&gt;next  = pre-&gt;next;  /* 2 */
}                                          }</pre>
<p class="nhan">Kết quả chạy thật:</p>
<pre>truoc:                 list -&gt; 102 -&gt; 132 -&gt; 178 -&gt; 201 -&gt; NULL   (4 nut)
sau (dung thu tu):     list -&gt; 102 -&gt; 132 -&gt; 156 -&gt; 178 -&gt; 201 -&gt; NULL   (5 nut)
sau (sai thu tu):      list -&gt; 102 -&gt; 132 -&gt; 156 -&gt; 156 -&gt; 156 -&gt; 156 ...  (vô tận)</pre>
<p class="dap-an">✅ Đáp án: ở thứ tự sai, bước 1 ghi đè <code>pre-&gt;next</code> — con đường <em>duy nhất</em> tới nút 178 — nên 178 và 201 thành rác không ai với tới được. Tệ hơn, bước 2 sau đó đọc <code>pre-&gt;next</code>, mà nó giờ chính là <code>nw</code>, nên nút 156 trỏ vào <strong>chính nó</strong> và mọi vòng lặp duyệt danh sách treo vĩnh viễn. Hai dòng lệnh trông đều đúng, đảo chỗ nhau, sinh ra mất dữ liệu <em>và</em> vòng lặp vô hạn. Đó là lý do hình trên slide đánh số hai phép gán.</p>
<p class="meo">💡 Một luật duy nhất bao được mọi ca phẫu thuật con trỏ trên danh sách liên kết đơn: <strong>buộc nút mới vào phần bạn sắp buông ra, TRƯỚC khi buông nó.</strong> Nối phía dưới trước, cắt phía trên sau.</p>
<p class="pitfall">⚠️ Bẫy thi. "Chèn vào danh sách liên kết là O(1)" chỉ đúng một nửa, và cái nửa thiếu ăn mất điểm. Chĩa lại con trỏ là O(1); <em>tìm ra</em> <code>pre</code> và <code>cur</code> là O(n) vì phép tìm kiếm bắt buộc phải tuần tự (slide 19: không có tìm nhị phân trên danh sách liên kết). Vậy chèn vào một vị trí ĐÃ BIẾT là O(1), chèn vào một giá trị phải đi tra là O(n).</p>`],

      [21, '4- Introduction: Stack, Queue, Tree, graph',
        `<p class="y-chinh">🎯 A section divider that closes the "how do I build a list?" part of the chapter and opens the "what shapes of data exist?" part. Everything from here — stack, queue, tree, graph — is built <em>on top of</em> the array of slides 5–9 or the linked list of slides 16–20.</p>
<ul>
<li><strong>What you have just finished</strong> — three concrete structures: <em>array</em> (same type, index-addressed, contiguous), <em>record</em> (different types, name-addressed, one element), <em>linked list</em> (same type, pointer-chained, scattered). Those are the raw materials.</li>
<li><strong>What comes next is a different kind of object</strong> — a stack, a queue, a tree and a graph are not competing storage layouts. They are <em>behaviours</em>: a stack is "a list you may only touch at one end". You still have to pick an array or a linked list underneath. Slide 22 gives that idea its name: abstract data type.</li>
<li><strong>The order of the four</strong> — stack (slides 23–24), queue (25–30), tree (31–35), graph (36–37). They go from most restricted to least: a stack allows one end, a queue two ends, a tree one parent per node, a graph anything at all.</li>
<li><strong>Why this is only an "Introduction"</strong> — the slide title says so. CSI106 wants you to define each structure and name its operations. The algorithms on them (balancing a tree, Dijkstra on a graph) belong to DSA and CSD.</li>
<li><strong>Link back to the whole course</strong> — you have already used every one of these without naming them: the call stack in PRF192, the ready queue of the CPU scheduler in Chapter 5, the directory tree in Chapter 10, and the network graph of Chapter 4.</li>
</ul>
<p class="nhan">Before leaving lists behind — the measured comparison the chapter keeps implying. All figures from <code>bench.c</code> and <code>bench2.c</code>, <code>cc -Wall -O2</code>, N = 100 000 <code>int</code>:</p>
<table>
<tr><th>Operation</th><th>Array</th><th>Linked list</th><th>Measured</th></tr>
<tr><td>Read element <em>i</em></td><td>O(1)</td><td>O(n)</td><td>20 000 random reads: <strong>0,000009 s</strong> vs <strong>0,66–0,71 s</strong> (~74 000×)</td></tr>
<tr><td>Insert at the front</td><td>O(n)</td><td>O(1)</td><td>100 000 inserts: <strong>0,42–0,44 s</strong> vs <strong>0,00087 s</strong> (~490×)</td></tr>
<tr><td>Insert at the back</td><td>O(1) amortised</td><td>O(n) without a tail pointer</td><td>—</td></tr>
<tr><td>Delete in the middle (position known)</td><td>O(n) — must shift</td><td>O(1) — one assignment</td><td>—</td></tr>
<tr><td>Search by value (unsorted)</td><td>O(n)</td><td>O(n)</td><td>equal</td></tr>
<tr><td>Search by value (sorted)</td><td>O(log n) binary search</td><td>O(n) — sequential only</td><td>—</td></tr>
<tr><td>Memory per <code>int</code></td><td>4 bytes</td><td><strong>16 bytes</strong> (4 data + 8 pointer + 4 padding)</td><td>measured <code>sizeof</code></td></tr>
</table>
<p class="dap-an">✅ Answer to "which one is better?": neither. The array insert had to move 4 999 950 000 individual integers; the linked list changed 200 000 pointers. That is the 490×. Reverse the question to random access and the array wins by 74 000×, because <code>a[i]</code> is one address calculation while the list must walk <em>i</em> nodes through scattered memory. <strong>Use an array when you read a lot and restructure a little; use a linked list when you restructure a lot and read sequentially.</strong></p>
<p class="meo">💡 The 16-bytes-per-<code>int</code> figure is worth remembering: a linked list of integers costs <strong>4× the memory</strong> of an array holding the same values, because every 4-byte payload drags an 8-byte pointer plus 4 bytes of alignment padding behind it.</p>
<p class="pitfall">⚠️ Do not answer "linked list is faster than array" or the reverse on an exam without naming the operation. Every mark in this comparison is attached to a <em>specific</em> operation, and the two structures win opposite halves of the table.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, khép lại phần "dựng danh sách thế nào?" và mở ra phần "dữ liệu có những HÌNH DẠNG nào?". Từ đây trở đi — stack, queue, cây, đồ thị — tất cả đều dựng <em>ở trên</em> mảng của slide 5–9 hoặc danh sách liên kết của slide 16–20.</p>
<ul>
<li><strong>Bạn vừa học xong cái gì</strong> — ba cấu trúc cụ thể: <em>mảng</em> (cùng kiểu, đánh địa chỉ bằng chỉ số, liền khối), <em>bản ghi</em> (khác kiểu, đánh địa chỉ bằng tên, một phần tử), <em>danh sách liên kết</em> (cùng kiểu, xâu bằng con trỏ, nằm rải rác). Đó là vật liệu thô.</li>
<li><strong>Thứ sắp tới là một loại đối tượng KHÁC</strong> — stack, queue, cây, đồ thị không phải những cách bố trí bộ nhớ cạnh tranh nhau. Chúng là <em>HÀNH VI</em>: stack là "một danh sách mà bạn chỉ được chạm vào một đầu". Bên dưới bạn vẫn phải chọn mảng hay danh sách liên kết. Slide 22 đặt tên cho ý này: kiểu dữ liệu trừu tượng.</li>
<li><strong>Thứ tự của bốn cấu trúc</strong> — stack (slide 23–24), queue (25–30), cây (31–35), đồ thị (36–37). Đi từ bị hạn chế nhất tới tự do nhất: stack cho một đầu, queue hai đầu, cây mỗi nút một cha, đồ thị thì thoải mái.</li>
<li><strong>Vì sao chỉ là "Introduction"</strong> — chính tiêu đề slide nói vậy. CSI106 muốn bạn định nghĩa được từng cấu trúc và kể tên các phép toán của nó. Còn thuật toán trên chúng (cân bằng cây, Dijkstra trên đồ thị) thuộc về DSA và CSD.</li>
<li><strong>Nối ngược về cả môn</strong> — bạn đã dùng đủ bốn thứ này mà chưa gọi tên: ngăn xếp lời gọi hàm ở PRF192, hàng đợi sẵn sàng của bộ lập lịch CPU ở Chương 5, cây thư mục ở Chương 10, và đồ thị mạng ở Chương 4.</li>
</ul>
<p class="nhan">Trước khi rời danh sách — bảng so sánh ĐO THẬT mà cả chương cứ ám chỉ. Mọi con số lấy từ <code>bench.c</code> và <code>bench2.c</code>, <code>cc -Wall -O2</code>, N = 100.000 số <code>int</code>:</p>
<table>
<tr><th>Thao tác</th><th>Mảng</th><th>Danh sách liên kết</th><th>Đo được</th></tr>
<tr><td>Đọc phần tử thứ <em>i</em></td><td>O(1)</td><td>O(n)</td><td>20.000 lần đọc ngẫu nhiên: <strong>0,000009 s</strong> so với <strong>0,66–0,71 s</strong> (~74.000 lần)</td></tr>
<tr><td>Chèn vào ĐẦU</td><td>O(n)</td><td>O(1)</td><td>100.000 lần chèn: <strong>0,42–0,44 s</strong> so với <strong>0,00087 s</strong> (~490 lần)</td></tr>
<tr><td>Chèn vào CUỐI</td><td>O(1) khấu hao</td><td>O(n) nếu không giữ con trỏ đuôi</td><td>—</td></tr>
<tr><td>Xoá ở GIỮA (đã biết vị trí)</td><td>O(n) — phải dồn</td><td>O(1) — một phép gán</td><td>—</td></tr>
<tr><td>Tìm theo giá trị (chưa sắp)</td><td>O(n)</td><td>O(n)</td><td>ngang nhau</td></tr>
<tr><td>Tìm theo giá trị (đã sắp)</td><td>O(log n) tìm nhị phân</td><td>O(n) — chỉ tuần tự được</td><td>—</td></tr>
<tr><td>Bộ nhớ cho mỗi <code>int</code></td><td>4 byte</td><td><strong>16 byte</strong> (4 dữ liệu + 8 con trỏ + 4 đệm)</td><td>đo bằng <code>sizeof</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án cho câu "cái nào tốt hơn?": không cái nào. Phép chèn vào mảng phải dời tổng cộng 4.999.950.000 số nguyên; danh sách liên kết chỉ sửa 200.000 con trỏ. Đó là con số 490 lần. Đảo câu hỏi sang truy cập ngẫu nhiên thì mảng thắng 74.000 lần, vì <code>a[i]</code> là một phép tính địa chỉ, còn danh sách phải lội qua <em>i</em> nút nằm rải rác trong bộ nhớ. <strong>Dùng mảng khi đọc nhiều sửa ít; dùng danh sách liên kết khi sửa nhiều và đọc tuần tự.</strong></p>
<p class="meo">💡 Con số 16 byte cho mỗi <code>int</code> đáng nhớ: một danh sách liên kết chứa số nguyên tốn <strong>gấp 4 lần</strong> bộ nhớ so với mảng chứa đúng những giá trị ấy, vì mỗi 4 byte dữ liệu kéo theo 8 byte con trỏ cộng 4 byte đệm căn lề.</p>
<p class="pitfall">⚠️ Đừng trả lời "danh sách liên kết nhanh hơn mảng" hay ngược lại trong bài thi mà không gọi tên thao tác. Mỗi điểm trong bảng này gắn với một thao tác <em>cụ thể</em>, và hai cấu trúc thắng đúng hai nửa đối nghịch của bảng.</p>`],

      [22, '1. BACKGROUND (abstract data type)',
        `<p class="y-chinh">🎯 The idea that gives the whole second half of the chapter its shape: an <strong>abstract data type</strong> is the pair <em>(what data, what operations)</em> — deliberately said without a word about how it is stored. This slide answers CQ14.2 directly.</p>
<ul>
<li><strong>The slide's own argument</strong> — "to process data we need to define the data type and the operation to be performed on it". Its example: to sum a list of numbers you must choose the type (integer or real) <em>and</em> define the operation (addition). Type without operations is useless; operations without a type are meaningless.</li>
<li><strong>The definition to write in an exam</strong> — an ADT is a data type defined by <em>the set of values it holds</em> and <em>the set of operations allowed on those values</em>, together with the promise that the user need not know — and must not depend on — how it is implemented.</li>
<li><strong>The three words that separate the two levels</strong> — <em>interface</em> (what you may call), <em>implementation</em> (how it is built), <em>information hiding</em> (the wall between them). Slide 30 shows the same queue built two different ways, and a caller cannot tell which one it got.</li>
<li><strong>Read the figure as a family tree</strong> — under "Abstract data type" the slide draws Queue, Set, Map, Stack; under Queue: LinkedList and Priority Queue (and Heap under that); under Set: HashSet and TreeSet; under Map: HashMap and TreeMap; under Stack: Vector. The top row is <em>what you ask for</em>; the bottom row is <em>what you actually get</em>. Those are Java's real class names — this is exactly how <code>java.util</code> is organised.</li>
<li><strong>Why it earns its keep</strong> — swap <code>HashMap</code> for <code>TreeMap</code> and not a single line of calling code changes; only the performance and the iteration order do. That substitutability <em>is</em> the payoff of abstraction.</li>
</ul>
<p class="nhan">Proof by running it. <code>adt_bst.c</code> defines one stack ADT twice — once over an array, once over a linked list — then pushes 5, 10, 15, 20 into both:</p>
<pre>MOT ADT, HAI hien thuc:
  stack bang MANG       : 20 15 10 5
  stack bang DANH SACH  : 20 15 10 5
  =&gt; nguoi DUNG khong phan biet duoc.</pre>
<p class="dap-an">✅ Answer to CQ14.2 ("what is an ADT?"): a specification, not a data structure. The two implementations above have nothing in common internally — one keeps an index <code>top</code> into a fixed 100-slot array and cannot grow; the other calls <code>malloc</code> per element and grows until memory runs out — yet they produce byte-identical output. The ADT is the part that stayed the same: <em>a list where push, pop and empty act at one end only</em>. Everything that differed was implementation.</p>
<p class="meo">💡 The everyday analogy that holds up: a <strong>power socket</strong> is an ADT. Its contract is 220 V, 50 Hz, two round pins. Behind the wall it may be hydro, coal or solar; your fan does not know and works either way. Change the contract and every device breaks; change the power station and nothing does.</p>
<p class="pitfall">⚠️ A common confusion in the exam: "stack" as an ADT versus "stack" as the region of memory where a running program keeps its local variables. Same word, related idea, different object. Slide 23 means the first; the "call stack" of PRF192 is a real memory region that happens to <em>behave</em> like the first.</p>`,
        `<p class="y-chinh">🎯 Ý tưởng định hình cả nửa sau của chương: <strong>kiểu dữ liệu trừu tượng</strong> (ADT) là cặp <em>(dữ liệu gì, làm được những phép gì)</em> — cố ý phát biểu mà không nói một chữ nào về cách nó được lưu. Slide này trả lời thẳng câu hỏi CQ14.2.</p>
<ul>
<li><strong>Lập luận của chính slide</strong> — "muốn xử lý dữ liệu thì phải định nghĩa kiểu dữ liệu và phép toán trên nó". Ví dụ của nó: muốn tính tổng một dãy số thì phải chọn kiểu (nguyên hay thực) <em>và</em> định nghĩa phép toán (phép cộng). Kiểu mà không có phép toán thì vô dụng; phép toán mà không có kiểu thì vô nghĩa.</li>
<li><strong>Định nghĩa để viết vào bài thi</strong> — ADT là một kiểu dữ liệu được xác định bởi <em>tập giá trị nó chứa</em> và <em>tập phép toán được phép làm trên các giá trị ấy</em>, kèm lời hứa rằng người dùng không cần biết — và không được phép phụ thuộc vào — cách nó được hiện thực.</li>
<li><strong>Ba chữ tách hai tầng</strong> — <em>giao diện</em> (thứ bạn được gọi), <em>hiện thực</em> (thứ nó được dựng bằng), <em>che giấu thông tin</em> (bức tường giữa hai bên). Slide 30 sẽ dựng đúng một queue bằng hai cách, và người gọi không phân biệt nổi mình nhận cái nào.</li>
<li><strong>Đọc hình như một cây gia phả</strong> — dưới "Abstract data type" slide vẽ Queue, Set, Map, Stack; dưới Queue là LinkedList và Priority Queue (và Heap dưới nữa); dưới Set là HashSet và TreeSet; dưới Map là HashMap và TreeMap; dưới Stack là Vector. Hàng trên là <em>thứ bạn yêu cầu</em>; hàng dưới là <em>thứ bạn thực sự nhận</em>. Đó chính là tên lớp thật của Java — thư viện <code>java.util</code> tổ chức đúng như vậy.</li>
<li><strong>Vì sao nó đáng giá</strong> — đổi <code>HashMap</code> thành <code>TreeMap</code> mà không một dòng mã gọi nào phải sửa; chỉ hiệu năng và thứ tự duyệt đổi. Chính khả năng thay thế ấy <em>là</em> phần thưởng của trừu tượng hoá.</li>
</ul>
<p class="nhan">Chứng minh bằng cách chạy thật. <code>adt_bst.c</code> định nghĩa một ADT stack hai lần — một lần trên mảng, một lần trên danh sách liên kết — rồi push 5, 10, 15, 20 vào cả hai:</p>
<pre>MOT ADT, HAI hien thuc:
  stack bang MANG       : 20 15 10 5
  stack bang DANH SACH  : 20 15 10 5
  =&gt; nguoi DUNG khong phan biet duoc.</pre>
<p class="dap-an">✅ Đáp án cho CQ14.2 ("ADT là gì?"): nó là một BẢN ĐẶC TẢ, không phải một cấu trúc dữ liệu. Hai hiện thực ở trên bên trong không có gì chung — một cái giữ chỉ số <code>top</code> vào mảng cố định 100 ô và không lớn thêm được; cái kia gọi <code>malloc</code> cho mỗi phần tử và lớn tới khi hết bộ nhớ — thế mà kết quả in ra giống nhau từng byte. ADT là phần KHÔNG đổi: <em>một danh sách mà push, pop, empty chỉ tác động vào một đầu</em>. Tất cả những gì khác nhau đều là hiện thực.</p>
<p class="meo">💡 Ví von đời thường mà không hỏng: <strong>ổ cắm điện</strong> là một ADT. Hợp đồng của nó là 220 V, 50 Hz, hai chân tròn. Sau bức tường có thể là thuỷ điện, nhiệt điện hay điện mặt trời; cái quạt của bạn không biết và chạy vẫn tốt. Đổi hợp đồng thì mọi thiết bị hỏng; đổi nhà máy điện thì chẳng cái nào hỏng.</p>
<p class="pitfall">⚠️ Một chỗ hay lẫn trong đề: "stack" với nghĩa ADT khác với "stack" với nghĩa vùng nhớ nơi chương trình đang chạy giữ biến cục bộ. Cùng một chữ, ý liên quan, nhưng là hai vật khác nhau. Slide 23 nói nghĩa thứ nhất; cái "ngăn xếp lời gọi hàm" ở PRF192 là một vùng nhớ thật, chỉ tình cờ <em>hành xử</em> như nghĩa thứ nhất.</p>`],

      [23, '2. STACKS',
        `<p class="y-chinh">🎯 One sentence defines it and one example proves it: a stack is a <strong>restricted linear list where every addition and every deletion happens at one end, the top</strong> — so 5, 10, 15, 20 in comes out as 20, 15, 10, 5. Restriction is the feature, not a defect.</p>
<ul>
<li><strong>Read the word "restricted" as a promise</strong> — you <em>cannot</em> reach element number 2, and that is precisely why a stack is useful: it guarantees reversal. Any structure that lets you touch the middle cannot make that guarantee.</li>
<li><strong>LIFO</strong> — Last In, First Out. The slide does not use the acronym but every exam does. Its twin on slide 25 is FIFO. Learn them as a pair: LIFO reverses, FIFO preserves.</li>
<li><strong>The three pictures</strong> — a stack of coins, a stack of books, and the computer stack drawn as an open-topped box with <em>Insert (push)</em> arrowing in and <em>Delete (pop)</em> arrowing out at the same opening, with the darkest cell labelled <strong>Top element</strong>. All three share one property: to reach the bottom item you must remove everything above it.</li>
<li><strong>Where you have already relied on it</strong> — the <em>call stack</em>. When <code>main</code> calls <code>f</code> which calls <code>g</code>, the return addresses stack up and unwind in reverse. That is why recursion terminates correctly and why infinite recursion produces a <em>stack overflow</em>, not a wrong answer.</li>
<li><strong>Three more real uses</strong> — the Undo button (the last edit must be undone first); matching brackets in a compiler; and converting or evaluating postfix expressions, which you will see on slide 34.</li>
</ul>
<p class="nhan">The slide's own example, run for real in <code>sq.c</code> against a queue fed the identical data:</p>
<pre>Nap vao: 5, 10, 15, 20
STACK lay ra (pop):     20 15 10 5    &lt;- dao nguoc (LIFO)
QUEUE lay ra (dequeue):  5 10 15 20   &lt;- giu nguyen (FIFO)</pre>
<p class="nhan">And the bracket checker, a genuine stack application, on five real inputs:</p>
<pre>can bang "a*(b+c)+d"                      -&gt; CAN
can bang "{[()]}"                         -&gt; CAN
can bang "(]"                             -&gt; LECH
can bang "((a+b)"                         -&gt; LECH
can bang "int f(int a[10]) { return a[0]; }" -&gt; CAN</pre>
<p class="dap-an">✅ Answer: the checker pushes every opening bracket and, on every closing bracket, pops and compares. <code>(]</code> fails because the popped <code>(</code> does not match <code>]</code>; <code>((a+b)</code> fails because the stack is <em>not empty</em> at the end — one <code>(</code> never got its partner. Note that both failure modes are needed: "every close matched a open" and "no open left over". A checker that only counts brackets would call <code>(]</code> balanced.</p>
<p class="meo">💡 Remember the direction with plates: you wash plates and stack them; the plate you dry last sits on top and gets used first. <strong>LIFO = the newest is served first.</strong></p>
<p class="pitfall">⚠️ <code>pop</code> on an empty stack is <em>underflow</em>, and <code>push</code> on a full array-backed stack is <em>overflow</em>. The slide's four operations include <code>empty</code> exactly so you can test before popping. In C, popping an empty array stack reads <code>S[-1]</code> — no error message, just garbage, and a mark lost for not checking.</p>`,
        `<p class="y-chinh">🎯 Một câu định nghĩa và một ví dụ chứng minh: stack là <strong>một danh sách tuyến tính BỊ HẠN CHẾ, mọi phép thêm và mọi phép xoá đều xảy ra ở một đầu duy nhất gọi là đỉnh</strong> — nên nạp vào 5, 10, 15, 20 thì lấy ra 20, 15, 10, 5. Sự hạn chế là TÍNH NĂNG chứ không phải khuyết điểm.</p>
<ul>
<li><strong>Hãy đọc chữ "hạn chế" như một lời hứa</strong> — bạn <em>không</em> với tới được phần tử thứ 2, và chính vì thế stack mới có ích: nó bảo đảm đảo ngược. Cấu trúc nào cho chạm vào giữa thì không hứa được điều ấy.</li>
<li><strong>LIFO</strong> — Last In, First Out (vào sau, ra trước). Slide không dùng chữ viết tắt nhưng mọi đề thi đều dùng. Cặp đôi của nó ở slide 25 là FIFO. Hãy học thành một cặp: LIFO đảo ngược, FIFO giữ nguyên.</li>
<li><strong>Ba bức hình</strong> — chồng xu, chồng sách, và cái stack máy tính vẽ thành hộp hở nắp, mũi tên <em>Insert (push)</em> đi vào và <em>Delete (pop)</em> đi ra ở cùng một miệng, ô sẫm nhất ghi <strong>Top element</strong>. Cả ba chung một tính chất: muốn lấy vật dưới đáy thì phải bỏ hết mọi thứ nằm trên nó.</li>
<li><strong>Bạn đã dựa vào nó ở đâu</strong> — <em>ngăn xếp lời gọi hàm</em>. Khi <code>main</code> gọi <code>f</code>, <code>f</code> gọi <code>g</code>, các địa chỉ trở về xếp chồng lên rồi tháo ra ngược lại. Đó là lý do đệ quy kết thúc đúng, và là lý do đệ quy vô hạn sinh ra lỗi <em>tràn ngăn xếp</em> chứ không phải một đáp số sai.</li>
<li><strong>Ba ứng dụng thật nữa</strong> — nút Undo (thao tác cuối phải được hoàn tác trước); khớp dấu ngoặc trong trình biên dịch; và chuyển đổi hoặc tính biểu thức hậu tố, thứ bạn sẽ gặp ở slide 34.</li>
</ul>
<p class="nhan">Chính ví dụ của slide, chạy thật trong <code>sq.c</code> đối chiếu với một queue nạp y hệt dữ liệu:</p>
<pre>Nap vao: 5, 10, 15, 20
STACK lay ra (pop):     20 15 10 5    &lt;- dao nguoc (LIFO)
QUEUE lay ra (dequeue):  5 10 15 20   &lt;- giu nguyen (FIFO)</pre>
<p class="nhan">Và bộ kiểm dấu ngoặc, một ứng dụng stack thứ thiệt, trên năm đầu vào thật:</p>
<pre>can bang "a*(b+c)+d"                      -&gt; CAN
can bang "{[()]}"                         -&gt; CAN
can bang "(]"                             -&gt; LECH
can bang "((a+b)"                         -&gt; LECH
can bang "int f(int a[10]) { return a[0]; }" -&gt; CAN</pre>
<p class="dap-an">✅ Đáp án: bộ kiểm push mọi dấu mở, và với mỗi dấu đóng thì pop ra so sánh. <code>(]</code> hỏng vì cái <code>(</code> pop ra không khớp <code>]</code>; <code>((a+b)</code> hỏng vì cuối cùng stack <em>chưa rỗng</em> — một dấu <code>(</code> không bao giờ có bạn. Chú ý cần CẢ HAI kiểu phát hiện: "mọi dấu đóng đều khớp" và "không còn dấu mở thừa". Một bộ kiểm chỉ đếm số lượng ngoặc sẽ chấm <code>(]</code> là cân.</p>
<p class="meo">💡 Nhớ chiều bằng chồng đĩa: rửa đĩa xong xếp chồng lên; cái đĩa lau cuối cùng nằm trên đỉnh và được dùng đầu tiên. <strong>LIFO = cái mới nhất được phục vụ trước.</strong></p>
<p class="pitfall">⚠️ <code>pop</code> trên stack rỗng là <em>underflow</em>, và <code>push</code> vào stack mảng đã đầy là <em>overflow</em>. Bốn phép toán của slide có <code>empty</code> chính là để bạn kiểm trước khi pop. Trong C, pop một stack mảng rỗng là đọc <code>S[-1]</code> — không có thông báo lỗi nào, chỉ có rác, và mất điểm vì không kiểm tra.</p>`],

      [24, 'Operations on stacks',
        `<p class="y-chinh">🎯 Four basic operations and nothing more: <strong><code>stack</code></strong> (create an empty one), <strong><code>push</code></strong> (add on top), <strong><code>pop</code></strong> (remove from top), <strong><code>empty</code></strong> (is it empty?). Two figures walk a concrete stack through push and pop.</p>
<ul>
<li><strong><code>stack (stackName)</code></strong> — creates an empty stack. It is an operation, not a declaration: the ADT is only usable after it exists, exactly like <code>queue(queueName)</code> on slide 26.</li>
<li><strong><code>push (stackName, dataItem)</code></strong> — the upper figure: a stack holding 20 at the bottom and 78 on top; the data <code>30</code> arrives from above; after the push the stack reads 20, 78, 30 with <strong>30 as the new top element</strong>. Nothing already inside moved.</li>
<li><strong><code>pop (stackName, dataItem)</code></strong> — the lower figure: the same stack 20, 78, 30 gives back <code>30</code> as "popped data", leaving 20, 78 with <strong>78 as the top element again</strong>. Pop <em>returns</em> the value as well as removing it, which is why it takes a <code>dataItem</code> parameter.</li>
<li><strong><code>empty (stackName)</code></strong> — returns true/false. It is the only safe way to avoid underflow, and it is what your loop condition uses when you drain a stack.</li>
<li><strong>Why exactly these four</strong> — they are minimal and complete. Everything else is built from them: "peek at the top without removing" is <code>pop</code> then <code>push</code>; "count the elements" is repeated <code>pop</code> into a second stack, then back. If you can add a fifth operation without needing new access to the middle, it was not a primitive.</li>
</ul>
<p class="nhan">Both figures re-created and run in <code>sq.c</code>:</p>
<pre>slide 24 - stack truoc push: day [20, 78], top = 78
           sau push(30):     top = 30, so phan tu = 3
           pop() tra ve 30,  top con = 78</pre>
<table>
<tr><th>Operation</th><th>Stack before</th><th>Value moved</th><th>Stack after</th><th>New top</th></tr>
<tr><td><code>stack(s)</code></td><td>—</td><td>—</td><td>(empty)</td><td>none</td></tr>
<tr><td><code>push(s, 20)</code></td><td>(empty)</td><td>20 in</td><td>20</td><td>20</td></tr>
<tr><td><code>push(s, 78)</code></td><td>20</td><td>78 in</td><td>20, 78</td><td>78</td></tr>
<tr><td><code>push(s, 30)</code></td><td>20, 78</td><td>30 in</td><td>20, 78, 30</td><td><strong>30</strong></td></tr>
<tr><td><code>pop(s, x)</code></td><td>20, 78, 30</td><td>30 out → <code>x</code></td><td>20, 78</td><td><strong>78</strong></td></tr>
<tr><td><code>empty(s)</code></td><td>20, 78</td><td>—</td><td>20, 78</td><td>false (2 items)</td></tr>
</table>
<p class="dap-an">✅ Answer to the classic exam question "push 5, 10, 15, 20 then pop twice — what is left and what came out?": out came <strong>20 then 15</strong>; left is <strong>5, 10 with 10 on top</strong>. Verified by the run above: pop always yields the value pushed most recently among those still present.</p>
<p class="meo">💡 In C, an array-backed stack needs only one extra integer. <code>push</code> is <code>S[++top] = v;</code> and <code>pop</code> is <code>return S[top--];</code> — note the pre-increment on push and the post-decrement on pop. Getting those two the wrong way round is the most frequent bug in a hand-written stack.</p>
<p class="pitfall">⚠️ Slide error worth knowing about. Both figures on this slide are captioned <em>"Three representations of stacks"</em> — the caption of slide 23 — although the top one clearly shows the <strong>push</strong> operation and the bottom one the <strong>pop</strong> operation. One is numbered <em>Figure 12.2</em> (Forouzan's original numbering) and the other <em>Figure 9.15</em> (the deck's renumbering), on the same slide. The pictures are right; the labels were copied carelessly. Answer from the pictures, not the captions.</p>`,
        `<p class="y-chinh">🎯 Bốn phép toán cơ bản, không hơn: <strong><code>stack</code></strong> (tạo một stack rỗng), <strong><code>push</code></strong> (đẩy vào đỉnh), <strong><code>pop</code></strong> (lấy khỏi đỉnh), <strong><code>empty</code></strong> (rỗng chưa?). Hai bức hình dắt một stack cụ thể đi qua push rồi pop.</p>
<ul>
<li><strong><code>stack (stackName)</code></strong> — tạo một stack rỗng. Đây là một PHÉP TOÁN chứ không phải lời khai báo: ADT chỉ dùng được sau khi nó tồn tại, y như <code>queue(queueName)</code> ở slide 26.</li>
<li><strong><code>push (stackName, dataItem)</code></strong> — hình trên: stack đang có 20 ở đáy và 78 ở đỉnh; dữ liệu <code>30</code> rơi vào từ phía trên; sau khi push, stack đọc là 20, 78, 30 với <strong>30 là phần tử đỉnh mới</strong>. Không phần tử nào đang nằm trong đó phải dời chỗ.</li>
<li><strong><code>pop (stackName, dataItem)</code></strong> — hình dưới: cũng stack 20, 78, 30 ấy trả về <code>30</code> ghi là "popped data", còn lại 20, 78 với <strong>78 trở lại làm đỉnh</strong>. Pop vừa <em>trả về</em> giá trị vừa xoá nó, nên nó mới có tham số <code>dataItem</code>.</li>
<li><strong><code>empty (stackName)</code></strong> — trả về đúng/sai. Đây là cách duy nhất an toàn để tránh underflow, và nó chính là điều kiện vòng lặp khi bạn rút cạn một stack.</li>
<li><strong>Vì sao đúng bốn phép này</strong> — chúng tối thiểu và đủ. Mọi thứ khác dựng từ chúng: "nhìn đỉnh mà không lấy" là <code>pop</code> rồi <code>push</code> lại; "đếm số phần tử" là pop hết sang một stack thứ hai rồi trả về. Nếu bạn thêm được phép thứ năm mà không cần quyền chạm vào giữa, thì nó vốn không phải phép nguyên thuỷ.</li>
</ul>
<p class="nhan">Cả hai hình dựng lại và chạy thật trong <code>sq.c</code>:</p>
<pre>slide 24 - stack truoc push: day [20, 78], top = 78
           sau push(30):     top = 30, so phan tu = 3
           pop() tra ve 30,  top con = 78</pre>
<table>
<tr><th>Phép toán</th><th>Stack trước</th><th>Giá trị di chuyển</th><th>Stack sau</th><th>Đỉnh mới</th></tr>
<tr><td><code>stack(s)</code></td><td>—</td><td>—</td><td>(rỗng)</td><td>không có</td></tr>
<tr><td><code>push(s, 20)</code></td><td>(rỗng)</td><td>20 vào</td><td>20</td><td>20</td></tr>
<tr><td><code>push(s, 78)</code></td><td>20</td><td>78 vào</td><td>20, 78</td><td>78</td></tr>
<tr><td><code>push(s, 30)</code></td><td>20, 78</td><td>30 vào</td><td>20, 78, 30</td><td><strong>30</strong></td></tr>
<tr><td><code>pop(s, x)</code></td><td>20, 78, 30</td><td>30 ra → <code>x</code></td><td>20, 78</td><td><strong>78</strong></td></tr>
<tr><td><code>empty(s)</code></td><td>20, 78</td><td>—</td><td>20, 78</td><td>sai (còn 2 phần tử)</td></tr>
</table>
<p class="dap-an">✅ Đáp án cho câu hỏi thi kinh điển "push 5, 10, 15, 20 rồi pop hai lần — còn gì và lấy ra gì?": lấy ra <strong>20 rồi 15</strong>; còn lại <strong>5, 10 với 10 ở đỉnh</strong>. Đã nghiệm bằng lượt chạy trên: pop luôn trả về giá trị được push gần nhất trong số những giá trị còn lại.</p>
<p class="meo">💡 Trong C, stack bằng mảng chỉ cần thêm đúng một biến nguyên. <code>push</code> là <code>S[++top] = v;</code> còn <code>pop</code> là <code>return S[top--];</code> — để ý tăng TRƯỚC khi push và giảm SAU khi pop. Đảo hai cái này là lỗi hay gặp nhất khi tự viết stack.</p>
<p class="pitfall">⚠️ Lỗi của slide, nên biết. Cả hai hình trên slide này đều được chú thích <em>"Three representations of stacks"</em> — chú thích của slide 23 — trong khi hình trên rõ ràng vẽ phép <strong>push</strong> còn hình dưới vẽ phép <strong>pop</strong>. Một hình đánh số <em>Figure 12.2</em> (số gốc của Forouzan) còn hình kia <em>Figure 9.15</em> (số đã đánh lại của deck), ngay trên cùng một slide. Hình thì đúng, nhãn thì bị chép ẩu. Hãy trả lời theo hình, đừng theo chú thích.</p>`],

      [25, '3. QUEUES',
        `<p class="y-chinh">🎯 The mirror of the stack: a queue is a linear list where data is inserted only at the <strong>rear</strong> and deleted only at the <strong>front</strong> — so items leave in the order they arrived. <strong>First In, First Out</strong>.</p>
<ul>
<li><strong>Two ends, two names, and they never swap</strong> — <em>rear</em> is where you join, <em>front</em> is where you are served. A stack has one end doing both jobs; a queue splits the jobs across two ends. That single difference produces the entire behavioural contrast.</li>
<li><strong>Why the restriction exists</strong> — the slide says it plainly: "these restrictions ensure that the data are processed in the order in which it is received". A queue is how a program expresses <em>fairness</em>. No item can overtake another.</li>
<li><strong>The two pictures</strong> — people queueing at a bank counter, and the computer queue drawn as a horizontal box with <em>Insert (enqueue)</em> arriving at the right end labelled <strong>rear</strong> and <em>Remove (dequeue)</em> leaving at the left end labelled <strong>front</strong>. The human picture is not decoration: a queue is the data structure that models waiting.</li>
<li><strong>Where the course has already used it</strong> — Chapter 5, the operating system. The <em>ready queue</em> of processes waiting for the CPU, and the FCFS (first-come, first-served) scheduling algorithm, are literally this structure. So is the print spooler: your document prints after the one submitted before it, however short yours is.</li>
<li><strong>Two variations worth naming</strong> — a <em>priority queue</em> lets an item with higher priority jump ahead (which is how a scheduler handles urgent processes) and a <em>deque</em> allows insertion and deletion at both ends. Both appear under Queue in the ADT tree of slide 22.</li>
</ul>
<p class="nhan">The decisive experiment — the same four values through both structures, from <code>sq.c</code>:</p>
<table>
<tr><th>Input order</th><th>Structure</th><th>Output order</th><th>Rule</th></tr>
<tr><td>5, 10, 15, 20</td><td>Stack (push/pop)</td><td><strong>20, 15, 10, 5</strong></td><td>LIFO — order reversed</td></tr>
<tr><td>5, 10, 15, 20</td><td>Queue (enqueue/dequeue)</td><td><strong>5, 10, 15, 20</strong></td><td>FIFO — order preserved</td></tr>
</table>
<p class="dap-an">✅ Answer: identical input, identical number of operations, opposite output. The difference is not in the data and not in the algorithm around it — it is purely in <em>which end</em> the removal happens. That is the cleanest demonstration in the whole chapter that a data structure is a decision about access, not about storage.</p>
<table>
<tr><th></th><th>Stack</th><th>Queue</th></tr>
<tr><td>Discipline</td><td>LIFO</td><td>FIFO</td></tr>
<tr><td>Insert at</td><td>top</td><td>rear</td></tr>
<tr><td>Delete at</td><td>top (same end)</td><td>front (other end)</td></tr>
<tr><td>Operation names</td><td>push / pop</td><td>enqueue / dequeue</td></tr>
<tr><td>Effect on order</td><td>reverses</td><td>preserves</td></tr>
<tr><td>Typical use</td><td>call stack, Undo, brackets, postfix</td><td>print spooler, CPU ready queue, BFS on a tree or graph</td></tr>
</table>
<p class="meo">💡 Vietnamese mnemonic that sticks: a stack is <em>chồng đĩa</em> — you take from the top; a queue is <em>xếp hàng mua vé</em> — whoever came first gets the ticket first. If a question is about fairness, it is a queue; if it is about undoing or reversing, it is a stack.</p>
<p class="pitfall">⚠️ Careful with the word "front". In a queue, <code>front</code> is the <em>oldest</em> element — the one that has waited longest — not the newest. Students who picture "front of the line = just arrived" get every dequeue answer backwards.</p>`,
        `<p class="y-chinh">🎯 Ảnh soi gương của stack: queue là danh sách tuyến tính chỉ được chèn vào <strong>đuôi (rear)</strong> và chỉ được xoá ở <strong>đầu (front)</strong> — nên các phần tử rời đi theo đúng thứ tự chúng đã đến. <strong>Vào trước, ra trước</strong>.</p>
<ul>
<li><strong>Hai đầu, hai tên, và không bao giờ đổi vai</strong> — <em>rear</em> là chỗ xếp vào, <em>front</em> là chỗ được phục vụ. Stack có một đầu làm cả hai việc; queue tách hai việc ra hai đầu. Đúng một khác biệt ấy sinh ra toàn bộ sự tương phản về hành vi.</li>
<li><strong>Vì sao có sự hạn chế này</strong> — slide nói thẳng: "các hạn chế này bảo đảm dữ liệu được xử lý đúng theo thứ tự nó được nhận". Queue là cách một chương trình diễn đạt sự <em>CÔNG BẰNG</em>. Không phần tử nào vượt mặt được phần tử khác.</li>
<li><strong>Hai bức hình</strong> — người xếp hàng ở quầy ngân hàng, và cái queue máy tính vẽ thành hộp nằm ngang với <em>Insert (enqueue)</em> đi vào ở đầu phải ghi <strong>rear</strong> và <em>Remove (dequeue)</em> đi ra ở đầu trái ghi <strong>front</strong>. Bức hình người không phải để trang trí: queue chính là cấu trúc dữ liệu mô hình hoá sự CHỜ ĐỢI.</li>
<li><strong>Môn học đã dùng nó ở đâu</strong> — Chương 5, hệ điều hành. <em>Hàng đợi sẵn sàng</em> chứa các tiến trình chờ CPU, và thuật toán lập lịch FCFS (đến trước phục vụ trước), chính là cấu trúc này. Bộ đệm in cũng vậy: tài liệu của bạn in sau tài liệu nộp trước nó, dù của bạn ngắn hơn.</li>
<li><strong>Hai biến thể đáng gọi tên</strong> — <em>hàng đợi ưu tiên</em> cho phép phần tử có độ ưu tiên cao chen lên (đó là cách bộ lập lịch xử lý tiến trình gấp), và <em>deque</em> cho phép thêm/xoá ở cả hai đầu. Cả hai đều xuất hiện dưới nhánh Queue trong cây ADT ở slide 22.</li>
</ul>
<p class="nhan">Phép thử quyết định — cùng bốn giá trị đi qua cả hai cấu trúc, lấy từ <code>sq.c</code>:</p>
<table>
<tr><th>Thứ tự nạp vào</th><th>Cấu trúc</th><th>Thứ tự lấy ra</th><th>Luật</th></tr>
<tr><td>5, 10, 15, 20</td><td>Stack (push/pop)</td><td><strong>20, 15, 10, 5</strong></td><td>LIFO — đảo ngược thứ tự</td></tr>
<tr><td>5, 10, 15, 20</td><td>Queue (enqueue/dequeue)</td><td><strong>5, 10, 15, 20</strong></td><td>FIFO — giữ nguyên thứ tự</td></tr>
</table>
<p class="dap-an">✅ Đáp án: đầu vào y hệt, số phép toán y hệt, đầu ra ngược nhau. Khác biệt không nằm ở dữ liệu, cũng không nằm ở thuật toán bao quanh — nó nằm hoàn toàn ở chỗ <em>ĐẦU NÀO</em> được phép xoá. Đây là minh chứng sạch nhất trong cả chương cho luận điểm: cấu trúc dữ liệu là một quyết định về CÁCH TRUY CẬP, không phải về cách lưu.</p>
<table>
<tr><th></th><th>Stack</th><th>Queue</th></tr>
<tr><td>Kỷ luật</td><td>LIFO</td><td>FIFO</td></tr>
<tr><td>Chèn ở</td><td>đỉnh (top)</td><td>đuôi (rear)</td></tr>
<tr><td>Xoá ở</td><td>đỉnh (cùng một đầu)</td><td>đầu (front — đầu kia)</td></tr>
<tr><td>Tên phép toán</td><td>push / pop</td><td>enqueue / dequeue</td></tr>
<tr><td>Tác động lên thứ tự</td><td>đảo ngược</td><td>giữ nguyên</td></tr>
<tr><td>Dùng điển hình</td><td>ngăn xếp lời gọi, Undo, dấu ngoặc, hậu tố</td><td>bộ đệm in, hàng đợi CPU, duyệt BFS trên cây và đồ thị</td></tr>
</table>
<p class="meo">💡 Mẹo nhớ bằng tiếng Việt, dính lâu: stack là <em>chồng đĩa</em> — lấy từ trên xuống; queue là <em>xếp hàng mua vé</em> — ai tới trước lấy vé trước. Câu hỏi nói về công bằng thì là queue; câu hỏi nói về hoàn tác hay đảo ngược thì là stack.</p>
<p class="pitfall">⚠️ Cẩn thận với chữ "front". Trong queue, <code>front</code> là phần tử <em>CŨ NHẤT</em> — cái đã chờ lâu nhất — chứ không phải cái mới nhất. Sinh viên nào hình dung "đầu hàng = vừa mới tới" thì mọi đáp án dequeue đều ngược.</p>`],

      [26, 'Operations on queues — the queue operation',
        `<p class="y-chinh">🎯 The first two of the four queue operations: <strong><code>queue (queueName)</code></strong> creates an empty queue, and the figure shows <strong><code>enqueue</code></strong> adding an item at the rear without disturbing anything already inside.</p>
<ul>
<li><strong><code>queue (queueName)</code></strong> — exactly parallel to <code>stack (stackName)</code> on slide 24. It produces an empty queue; nothing else in the ADT may be called before it. The confusing part is only the naming: the ADT and its constructor share the word "queue".</li>
<li><strong><code>enqueue (queueName, dataItem)</code></strong> — the figure: "Queue before" holds 20 at the front and 78 at the rear; the data <code>34</code> comes down into the Enqueue box; "Queue after" reads 20, 78, 34 with <strong>front still 20</strong> and <strong>rear now 34</strong>.</li>
<li><strong>Read what did <em>not</em> change</strong> — the front pointer. That is the whole point: adding to a queue never affects who is served next. Compare with the stack, where <code>push</code> changes the top and therefore changes what <code>pop</code> will return.</li>
<li><strong>Cost</strong> — O(1) in every sensible implementation, because you write at <code>rear</code> and advance it by one. It only becomes O(n) if someone stores the queue as an array with the front pinned at index 0 and inserts at the front instead, which is the wrong end.</li>
<li><strong>Overflow</strong> — an array-backed queue can refuse an enqueue when it is full. Slide 30 shows the subtle version of this problem: a simple array can report "full" while half of it is empty.</li>
</ul>
<p class="nhan">Figure 9.17 reproduced and run in <code>sq.c</code>:</p>
<table>
<tr><th>Step</th><th>Queue</th><th>front</th><th>rear</th><th>Count</th></tr>
<tr><td><code>queue(q)</code></td><td>(empty)</td><td>—</td><td>—</td><td>0</td></tr>
<tr><td><code>enqueue(q, 20)</code></td><td>20</td><td>20</td><td>20</td><td>1</td></tr>
<tr><td><code>enqueue(q, 78)</code></td><td>20, 78</td><td>20</td><td>78</td><td>2</td></tr>
<tr><td><code>enqueue(q, 34)</code></td><td><strong>20, 78, 34</strong></td><td><strong>20 (unchanged)</strong></td><td><strong>34</strong></td><td>3</td></tr>
</table>
<pre>slide 26/27 - queue [20, 78, 34]: front=20 rear=34</pre>
<p class="dap-an">✅ Answer: after three enqueues the front pointer has not moved once. Written as C it is two lines — <code>Q[rear] = v; rear = rear + 1;</code> — and neither line mentions <code>front</code>. That is the formal reason enqueue cannot change the service order.</p>
<p class="meo">💡 Keep the pair straight by their English: you <em>en</em>-queue (put <em>into</em> the queue) and <em>de</em>-queue (take <em>out of</em> it). The prefix tells you the direction, so you never have to memorise which one is which.</p>
<p class="pitfall">⚠️ Do not write <code>push</code>/<code>pop</code> on a queue in an exam. The operation names are part of the ADT specification: a queue has <code>queue</code>, <code>enqueue</code>, <code>dequeue</code>, <code>empty</code> — four names, and the slide lists them exactly. Using stack vocabulary signals you have not separated the two ADTs.</p>`,
        `<p class="y-chinh">🎯 Hai phép đầu trong bốn phép của queue: <strong><code>queue (queueName)</code></strong> tạo một hàng đợi rỗng, và hình vẽ cho thấy <strong><code>enqueue</code></strong> thêm một phần tử vào đuôi mà không động tới thứ gì đang nằm trong.</p>
<ul>
<li><strong><code>queue (queueName)</code></strong> — song song hoàn toàn với <code>stack (stackName)</code> ở slide 24. Nó sinh ra một queue rỗng; không phép nào khác của ADT được gọi trước nó. Chỗ dễ rối chỉ là cách đặt tên: ADT và hàm khởi tạo của nó dùng chung chữ "queue".</li>
<li><strong><code>enqueue (queueName, dataItem)</code></strong> — hình vẽ: "Queue before" chứa 20 ở front và 78 ở rear; dữ liệu <code>34</code> rơi xuống ô Enqueue; "Queue after" đọc là 20, 78, 34 với <strong>front vẫn là 20</strong> và <strong>rear giờ là 34</strong>.</li>
<li><strong>Hãy đọc cái KHÔNG đổi</strong> — con trỏ front. Đó mới là điểm mấu chốt: thêm vào queue không bao giờ ảnh hưởng tới việc ai được phục vụ kế tiếp. So với stack, nơi <code>push</code> đổi đỉnh và do đó đổi luôn thứ mà <code>pop</code> sẽ trả về.</li>
<li><strong>Chi phí</strong> — O(1) trong mọi hiện thực tử tế, vì bạn ghi vào ô <code>rear</code> rồi tiến nó lên một. Nó chỉ thành O(n) nếu ai đó lưu queue bằng mảng với front ghim ở chỉ số 0 rồi chèn vào đầu — tức là chèn nhầm đầu.</li>
<li><strong>Tràn</strong> — queue dựng bằng mảng có thể từ chối một lần enqueue khi đã đầy. Slide 30 sẽ cho thấy phiên bản tinh vi của vấn đề này: một mảng đơn giản có thể báo "đầy" trong khi một nửa của nó đang trống.</li>
</ul>
<p class="nhan">Hình 9.17 dựng lại và chạy thật trong <code>sq.c</code>:</p>
<table>
<tr><th>Bước</th><th>Queue</th><th>front</th><th>rear</th><th>Số phần tử</th></tr>
<tr><td><code>queue(q)</code></td><td>(rỗng)</td><td>—</td><td>—</td><td>0</td></tr>
<tr><td><code>enqueue(q, 20)</code></td><td>20</td><td>20</td><td>20</td><td>1</td></tr>
<tr><td><code>enqueue(q, 78)</code></td><td>20, 78</td><td>20</td><td>78</td><td>2</td></tr>
<tr><td><code>enqueue(q, 34)</code></td><td><strong>20, 78, 34</strong></td><td><strong>20 (không đổi)</strong></td><td><strong>34</strong></td><td>3</td></tr>
</table>
<pre>slide 26/27 - queue [20, 78, 34]: front=20 rear=34</pre>
<p class="dap-an">✅ Đáp án: sau ba lần enqueue, con trỏ front không nhúc nhích một lần nào. Viết bằng C thì nó là hai dòng — <code>Q[rear] = v; rear = rear + 1;</code> — và không dòng nào nhắc tới <code>front</code>. Đó là lý do hình thức khiến enqueue không thể đổi thứ tự phục vụ.</p>
<p class="meo">💡 Giữ cặp từ cho đúng bằng chính tiếng Anh: <em>en</em>-queue là đưa VÀO hàng, <em>de</em>-queue là lấy RA khỏi hàng. Tiền tố đã nói chiều rồi, khỏi phải học thuộc cái nào là cái nào.</p>
<p class="pitfall">⚠️ Đừng viết <code>push</code>/<code>pop</code> cho queue trong bài thi. Tên phép toán là một phần của bản đặc tả ADT: queue có <code>queue</code>, <code>enqueue</code>, <code>dequeue</code>, <code>empty</code> — đúng bốn tên, và slide liệt kê chính xác như vậy. Dùng từ vựng của stack là dấu hiệu bạn chưa tách được hai ADT.</p>`],

      [27, 'Operations on queues (cont) — dequeue',
        `<p class="y-chinh">🎯 <strong><code>dequeue (queueName, dataItem)</code></strong> deletes the item at the <em>front</em> — and, like <code>pop</code>, hands the value back through its second parameter. The figure takes 20 out of the queue 20, 78, 34.</p>
<ul>
<li><strong>What the figure shows exactly</strong> — "Queue before" is 20, 78, 34 with the front cell (20) drawn dark; the Dequeue box sends <code>20</code> upward as "Dequeued data"; "Queue after" is 78, 34 with <strong>front now 78</strong> and <strong>rear still 34</strong>.</li>
<li><strong>Read what did <em>not</em> change this time</strong> — the rear pointer. Enqueue moves rear only; dequeue moves front only. Two operations, two pointers, no overlap — which is exactly why a queue can be implemented without ever shifting data.</li>
<li><strong>Two jobs in one operation</strong> — remove <em>and</em> return. If your implementation only removes, the caller has lost the value forever, because a queue gives no other way to read the front. This is why the signature carries <code>dataItem</code>.</li>
<li><strong>The pairing with slide 23's example</strong> — feed 5, 10, 15, 20 and dequeue four times: you get 5, 10, 15, 20. Every dequeue returns the oldest surviving item, which is the formal meaning of FIFO.</li>
<li><strong>Underflow</strong> — dequeue on an empty queue is an error, and the <code>empty</code> operation on slide 28 exists to prevent it. In C with a plain array this reads <code>Q[front]</code> for a slot that was never written: garbage, silently.</li>
</ul>
<p class="nhan">Figure 9.18 run for real (<code>sq.c</code>):</p>
<pre>slide 26/27 - queue [20, 78, 34]: front=20 rear=34
              dequeue() tra ve 20 -&gt; con [78, 34], front = 78</pre>
<table>
<tr><th>Step</th><th>Queue before</th><th>Value out</th><th>Queue after</th><th>front</th><th>rear</th></tr>
<tr><td><code>dequeue(q, x)</code></td><td>20, 78, 34</td><td><strong>20</strong></td><td>78, 34</td><td>20 → <strong>78</strong></td><td>34 (unchanged)</td></tr>
<tr><td><code>dequeue(q, x)</code></td><td>78, 34</td><td>78</td><td>34</td><td>78 → 34</td><td>34</td></tr>
<tr><td><code>dequeue(q, x)</code></td><td>34</td><td>34</td><td>(empty)</td><td>—</td><td>—</td></tr>
<tr><td><code>dequeue(q, x)</code></td><td>(empty)</td><td colspan="4"><strong>underflow — must be blocked by <code>empty(q)</code></strong></td></tr>
</table>
<p class="dap-an">✅ Answer to "enqueue 20, 78, 34, then dequeue twice — what comes out and what is left?": out come <strong>20 then 78</strong>; left is <strong>34</strong>, which is now both front and rear. Contrast with the same sequence on a stack: out would come 34 then 78, leaving 20. Same data, same number of steps, mirrored answers — this is the exam's favourite way to test whether you actually know the difference.</p>
<p class="meo">💡 A one-line summary of the two pointers that answers most queue questions on sight: <strong>enqueue writes at <code>rear</code> and moves <code>rear</code>; dequeue reads at <code>front</code> and moves <code>front</code>. The queue is empty exactly when <code>front == rear</code>.</strong></p>
<p class="pitfall">⚠️ In a simple array implementation, <code>front</code> only ever increases and so does <code>rear</code> — they crawl rightwards forever and the used part of the array is abandoned behind them. That is not a bug in dequeue; it is the reason circular arrays exist (slide 30). Do not "fix" it by shifting everything left after each dequeue: that turns an O(1) operation into O(n), measured at 1 268× slower on slide 30.</p>`,
        `<p class="y-chinh">🎯 <strong><code>dequeue (queueName, dataItem)</code></strong> xoá phần tử ở <em>đầu</em> — và, giống <code>pop</code>, trả giá trị về qua tham số thứ hai. Hình vẽ lấy 20 ra khỏi hàng đợi 20, 78, 34.</p>
<ul>
<li><strong>Hình vẽ cho thấy chính xác cái gì</strong> — "Queue before" là 20, 78, 34 với ô đầu (20) vẽ sẫm; ô Dequeue đẩy <code>20</code> đi lên ghi "Dequeued data"; "Queue after" là 78, 34 với <strong>front giờ là 78</strong> và <strong>rear vẫn là 34</strong>.</li>
<li><strong>Lần này hãy đọc cái KHÔNG đổi</strong> — con trỏ rear. Enqueue chỉ dịch rear; dequeue chỉ dịch front. Hai phép toán, hai con trỏ, không giẫm lên nhau — chính vì thế queue mới hiện thực được mà không bao giờ phải dồn dịch dữ liệu.</li>
<li><strong>Một phép toán hai nhiệm vụ</strong> — vừa xoá vừa TRẢ VỀ. Nếu hiện thực của bạn chỉ xoá, người gọi mất giá trị ấy vĩnh viễn, vì queue không cho đường nào khác để đọc phần tử đầu. Đó là lý do chữ ký hàm có tham số <code>dataItem</code>.</li>
<li><strong>Ghép với ví dụ của slide 23</strong> — nạp 5, 10, 15, 20 rồi dequeue bốn lần: bạn nhận 5, 10, 15, 20. Mỗi lần dequeue trả về phần tử CŨ NHẤT còn sống, đó chính là nghĩa hình thức của FIFO.</li>
<li><strong>Underflow</strong> — dequeue trên hàng đợi rỗng là lỗi, và phép <code>empty</code> của slide 28 tồn tại để chặn nó. Trong C với mảng trần, việc này là đọc <code>Q[front]</code> ở một ô chưa từng được ghi: rác, và im lặng.</li>
</ul>
<p class="nhan">Hình 9.18 chạy thật (<code>sq.c</code>):</p>
<pre>slide 26/27 - queue [20, 78, 34]: front=20 rear=34
              dequeue() tra ve 20 -&gt; con [78, 34], front = 78</pre>
<table>
<tr><th>Bước</th><th>Queue trước</th><th>Giá trị ra</th><th>Queue sau</th><th>front</th><th>rear</th></tr>
<tr><td><code>dequeue(q, x)</code></td><td>20, 78, 34</td><td><strong>20</strong></td><td>78, 34</td><td>20 → <strong>78</strong></td><td>34 (không đổi)</td></tr>
<tr><td><code>dequeue(q, x)</code></td><td>78, 34</td><td>78</td><td>34</td><td>78 → 34</td><td>34</td></tr>
<tr><td><code>dequeue(q, x)</code></td><td>34</td><td>34</td><td>(rỗng)</td><td>—</td><td>—</td></tr>
<tr><td><code>dequeue(q, x)</code></td><td>(rỗng)</td><td colspan="4"><strong>underflow — phải bị <code>empty(q)</code> chặn lại</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án cho câu "enqueue 20, 78, 34 rồi dequeue hai lần — ra gì và còn gì?": ra <strong>20 rồi 78</strong>; còn lại <strong>34</strong>, mà giờ nó vừa là front vừa là rear. Đối chiếu với đúng dãy ấy trên stack: sẽ ra 34 rồi 78, còn lại 20. Cùng dữ liệu, cùng số bước, đáp án soi gương nhau — đây là cách đề thi thích nhất để kiểm xem bạn có thật sự nắm khác biệt không.</p>
<p class="meo">💡 Một dòng tóm tắt hai con trỏ, đủ để nhìn phát trả lời được hầu hết câu hỏi về queue: <strong>enqueue GHI ở <code>rear</code> rồi dịch <code>rear</code>; dequeue ĐỌC ở <code>front</code> rồi dịch <code>front</code>. Hàng đợi rỗng đúng khi <code>front == rear</code>.</strong></p>
<p class="pitfall">⚠️ Trong hiện thực mảng đơn giản, <code>front</code> chỉ có tăng và <code>rear</code> cũng vậy — chúng bò sang phải mãi và phần mảng đã dùng bị bỏ lại phía sau. Đó không phải lỗi của dequeue; đó là lý do mảng VÒNG ra đời (slide 30). Đừng "sửa" bằng cách dồn hết sang trái sau mỗi lần dequeue: làm thế là biến một phép O(1) thành O(n), đo được là chậm hơn 1.268 lần ở slide 30.</p>`],

      [28, 'Operations on queues (cont) — the empty operation',
        `<p class="y-chinh">🎯 The smallest slide in the chapter and the one that keeps the other three honest: <strong><code>empty (queueName)</code></strong> "checks the status of the queue". It is the only operation that asks a question instead of changing something.</p>
<ul>
<li><strong>What it returns</strong> — a boolean: true if the queue holds no items, false otherwise. That is all. The slide gives the format and nothing else, because there is nothing else.</li>
<li><strong>Why an ADT needs it at all</strong> — a queue hides its internals, so the caller cannot look at <code>front</code>, <code>rear</code> or a node pointer to find out whether anything is left. Without <code>empty</code> the ADT would be unusable: you could never write a loop that drains a queue, and every <code>dequeue</code> would be a gamble.</li>
<li><strong>The loop it makes possible</strong> — <code>while (!empty(q)) { dequeue(q, &amp;x); process(x); }</code>. That single line is the reason the operation exists, and it is identical in shape to the stack version on slide 24.</li>
<li><strong>How it is implemented, per representation</strong> — array with two indexes: <code>front == rear</code>. Array with a counter: <code>count == 0</code>. Linked list: <code>front == NULL</code>. Three completely different tests, one identical contract — a small, concrete instance of the ADT idea from slide 22.</li>
<li><strong>What the slide leaves out</strong> — the symmetric question "is it full?". A linked-list queue is never full until memory runs out, so the ADT does not require the operation; an array-backed one does need it, and slide 30 shows why detecting fullness is harder than it looks.</li>
</ul>
<p class="nhan">The four queue operations written out in C, compiled with <code>cc -Wall</code> (from <code>sq.c</code>), so the whole ADT fits in eight lines:</p>
<pre>int Q[MAX], front = 0, rear = 0;               /* queue(q)   : tao rong  */
void enqueue(int v){ Q[rear++] = v; }          /* O(1), chi dich rear     */
int  dequeue(void) { return Q[front++]; }      /* O(1), chi dich front    */
int  queue_empty(void){ return front == rear; }/* cau hoi, khong doi gi   */

/* rut can hang doi - vong lap CHI viet duoc nho co empty() */
while (!queue_empty()) printf("%d ", dequeue());</pre>
<p class="dap-an">✅ Answer to "why is <code>empty</code> one of the four primitives rather than a helper?": because it cannot be built from the other three. <code>queue</code>, <code>enqueue</code> and <code>dequeue</code> all <em>modify</em> the queue; there is no combination of them that reports the state without destroying it. Try to test emptiness by calling <code>dequeue</code> and seeing whether it fails, and you have already removed an element. An ADT needs at least one non-destructive observer, and <code>empty</code> is it. The same argument puts <code>empty</code> among the stack's four primitives on slide 24.</p>
<p class="meo">💡 Learn the four operations of stack and queue as one table with four rows: <em>create · add · remove · test</em>. Stack fills them with stack/push/pop/empty, queue with queue/enqueue/dequeue/empty. Every ADT in this chapter has the same four roles; only the names and the restricted ends change.</p>
<p class="pitfall">⚠️ <code>front == rear</code> means "empty" only in the <em>simple</em> array version. In a <strong>circular</strong> array (slide 30), <code>front == rear</code> is ambiguous — it is true both when the queue is empty and when it is completely full. That is why real circular implementations keep a separate <code>count</code>, or deliberately waste one slot. Writing <code>front == rear</code> as the emptiness test for a circular queue is a classic exam trap.</p>`,
        `<p class="y-chinh">🎯 Slide nhỏ nhất của chương, và là slide giữ cho ba phép kia trung thực: <strong><code>empty (queueName)</code></strong> "kiểm tra trạng thái của hàng đợi". Đây là phép toán duy nhất ĐẶT CÂU HỎI thay vì thay đổi cái gì.</p>
<ul>
<li><strong>Nó trả về gì</strong> — một giá trị luận lý: đúng nếu hàng đợi không còn phần tử nào, sai nếu còn. Hết. Slide chỉ đưa ra định dạng và không gì khác, vì thật sự không còn gì khác.</li>
<li><strong>Vì sao ADT bắt buộc phải có nó</strong> — queue giấu ruột gan của nó, nên người gọi không nhìn được <code>front</code>, <code>rear</code> hay con trỏ nút để biết còn gì hay không. Thiếu <code>empty</code> thì ADT thành vô dụng: bạn không bao giờ viết nổi vòng lặp rút cạn hàng đợi, và mỗi lần <code>dequeue</code> là một canh bạc.</li>
<li><strong>Cái vòng lặp mà nó cho phép</strong> — <code>while (!empty(q)) { dequeue(q, &amp;x); process(x); }</code>. Đúng một dòng ấy là lý do phép toán này tồn tại, và nó giống hệt về hình dạng với bản của stack ở slide 24.</li>
<li><strong>Hiện thực thế nào, tuỳ cách biểu diễn</strong> — mảng với hai chỉ số: <code>front == rear</code>. Mảng với biến đếm: <code>count == 0</code>. Danh sách liên kết: <code>front == NULL</code>. Ba phép kiểm khác nhau hoàn toàn, một hợp đồng y hệt — một ví dụ nhỏ và cụ thể của ý tưởng ADT ở slide 22.</li>
<li><strong>Thứ slide bỏ sót</strong> — câu hỏi đối xứng "đã đầy chưa?". Queue bằng danh sách liên kết không bao giờ đầy cho tới khi hết bộ nhớ, nên ADT không đòi phép ấy; bản bằng mảng thì cần, và slide 30 cho thấy phát hiện "đầy" khó hơn vẻ ngoài của nó.</li>
</ul>
<p class="nhan">Bốn phép toán của queue viết bằng C, dịch bằng <code>cc -Wall</code> (trích <code>sq.c</code>), cả ADT gói gọn trong tám dòng:</p>
<pre>int Q[MAX], front = 0, rear = 0;               /* queue(q)   : tao rong  */
void enqueue(int v){ Q[rear++] = v; }          /* O(1), chi dich rear     */
int  dequeue(void) { return Q[front++]; }      /* O(1), chi dich front    */
int  queue_empty(void){ return front == rear; }/* cau hoi, khong doi gi   */

/* rut can hang doi - vong lap CHI viet duoc nho co empty() */
while (!queue_empty()) printf("%d ", dequeue());</pre>
<p class="dap-an">✅ Đáp án cho câu "vì sao <code>empty</code> là một trong bốn phép nguyên thuỷ chứ không phải hàm phụ trợ?": vì nó KHÔNG dựng được từ ba phép kia. <code>queue</code>, <code>enqueue</code> và <code>dequeue</code> đều <em>làm thay đổi</em> hàng đợi; không tổ hợp nào của chúng báo được trạng thái mà không phá trạng thái ấy. Thử kiểm rỗng bằng cách gọi <code>dequeue</code> xem nó có hỏng không, thì bạn đã lỡ lấy mất một phần tử rồi. Một ADT cần ít nhất một PHÉP QUAN SÁT không phá huỷ, và đó là <code>empty</code>. Đúng lập luận ấy đưa <code>empty</code> vào bốn phép của stack ở slide 24.</p>
<p class="meo">💡 Học bốn phép của stack và queue thành một bảng bốn dòng: <em>tạo · thêm · lấy · hỏi</em>. Stack điền vào bằng stack/push/pop/empty, queue điền bằng queue/enqueue/dequeue/empty. Mọi ADT trong chương này đều có đúng bốn vai ấy; chỉ tên gọi và đầu bị hạn chế là đổi.</p>
<p class="pitfall">⚠️ <code>front == rear</code> nghĩa là "rỗng" CHỈ trong bản mảng <em>đơn giản</em>. Trong mảng <strong>VÒNG</strong> (slide 30), <code>front == rear</code> là nhập nhằng — nó đúng cả khi hàng đợi rỗng lẫn khi hàng đợi đầy kín. Vì thế hiện thực vòng thật sự phải giữ thêm biến <code>count</code>, hoặc cố ý bỏ phí một ô. Viết <code>front == rear</code> làm phép kiểm rỗng cho queue vòng là một bẫy đề kinh điển.</p>`],

      [29, 'Queue ADT',
        `<p class="y-chinh">🎯 The formal specification box: a <strong>Definition</strong> (what a queue <em>is</em>) plus <strong>Operations</strong> (what you may <em>do</em>). Nothing about arrays, pointers or memory — and that omission is the entire point. This slide is the direct answer to CQ14.2.</p>
<ul>
<li><strong>The definition, word for word</strong> — "a list of data items in which an item can be deleted from one end, called the front, and an item can be inserted at the other end, called the rear". Two restrictions, two names. Memorise this sentence; it is the expected answer to "define a queue".</li>
<li><strong>The four operations, word for word</strong> — <code>queue</code>: creates an empty queue. <code>enqueue</code>: inserts an element at the rear. <code>dequeue</code>: deletes an element from the front. <code>empty</code>: checks the status of the queue.</li>
<li><strong>Read the box for what is missing</strong> — no size, no capacity, no "is it full", no way to inspect the middle, no way to see the second item. Everything absent is absent <em>on purpose</em>: each missing operation is a promise the implementation is free to keep however it likes.</li>
<li><strong>This is a contract in two directions</strong> — the implementer promises these four operations behave as described; the user promises to ask for nothing else. Break either half and the substitution property of slide 22 collapses.</li>
<li><strong>The same box exists for the stack</strong> — definition "a restricted linear list in which additions and deletions are made at one end, the top" plus the four operations of slide 24. CSI106 exams ask you to write either box from memory.</li>
</ul>
<p class="nhan">The Queue ADT as an exam-ready table, with the cost each operation must meet:</p>
<table>
<tr><th>Operation</th><th>Format</th><th>Meaning</th><th>Changes</th><th>Cost</th></tr>
<tr><td><code>queue</code></td><td><code>queue (queueName)</code></td><td>creates an empty queue</td><td>everything (creation)</td><td>O(1)</td></tr>
<tr><td><code>enqueue</code></td><td><code>enqueue (queueName, dataItem)</code></td><td>inserts at the rear</td><td><code>rear</code> only</td><td>O(1)</td></tr>
<tr><td><code>dequeue</code></td><td><code>dequeue (queueName, dataItem)</code></td><td>deletes from the front, returns it</td><td><code>front</code> only</td><td>O(1)</td></tr>
<tr><td><code>empty</code></td><td><code>empty (queueName)</code></td><td>checks the status</td><td><strong>nothing</strong></td><td>O(1)</td></tr>
</table>
<p class="dap-an">✅ Answer to CQ14.2 in one paragraph: an ADT is the pair <em>(definition, operations)</em> stated without any reference to implementation. This box is that pair for a queue. Its value is measurable: slide 30 builds the same box four different ways whose running times span from 0,000048 s to 0,45 s for the same 200 000 operations, and not one line of calling code has to change between them. The specification stayed fixed while the performance moved by a factor of over 9 000.</p>
<p class="meo">💡 Notice that all four operations are O(1) — none of them may depend on how many items the queue holds. That is not an accident of this slide; it is part of the contract. If your implementation makes <code>dequeue</code> cost O(n), you have implemented something that is not a queue in the sense this box means.</p>
<p class="pitfall">⚠️ A queue ADT does <em>not</em> promise a maximum size, and does <em>not</em> promise the items are sorted. Two frequent wrong answers: "a queue orders items by priority" (that is a <em>priority queue</em>, a different ADT — see slide 22's tree) and "a queue has a fixed capacity" (only the array implementation does, and that is an implementation detail the ADT deliberately does not mention).</p>`,
        `<p class="y-chinh">🎯 Khung đặc tả hình thức: một phần <strong>Definition</strong> (queue <em>là</em> cái gì) cộng phần <strong>Operations</strong> (bạn được <em>làm</em> gì). Không một chữ nào về mảng, con trỏ hay bộ nhớ — và chính sự vắng mặt ấy mới là điểm mấu chốt. Slide này là câu trả lời trực tiếp cho CQ14.2.</p>
<ul>
<li><strong>Định nghĩa, nguyên văn</strong> — "một danh sách các mục dữ liệu, trong đó một mục có thể bị xoá ở một đầu gọi là front, và một mục có thể được chèn vào đầu kia gọi là rear". Hai hạn chế, hai cái tên. Hãy thuộc câu này; nó là đáp án mà đề "định nghĩa hàng đợi" chờ nghe.</li>
<li><strong>Bốn phép toán, nguyên văn</strong> — <code>queue</code>: tạo một hàng đợi rỗng. <code>enqueue</code>: chèn một phần tử vào đuôi. <code>dequeue</code>: xoá một phần tử ở đầu. <code>empty</code>: kiểm tra trạng thái của hàng đợi.</li>
<li><strong>Hãy đọc khung này để tìm cái THIẾU</strong> — không có kích thước, không có sức chứa, không có "đã đầy chưa", không có cách soi vào giữa, không có cách nhìn phần tử thứ hai. Mọi thứ vắng mặt đều vắng <em>có chủ đích</em>: mỗi phép toán thiếu là một lời hứa rằng bên hiện thực được tự do làm theo cách nào tuỳ ý.</li>
<li><strong>Đây là hợp đồng hai chiều</strong> — bên hiện thực hứa bốn phép này hành xử đúng như mô tả; bên dùng hứa không đòi hỏi gì thêm. Phá nửa nào cũng làm sập tính thay thế được đã nói ở slide 22.</li>
<li><strong>Stack cũng có khung y hệt</strong> — định nghĩa "danh sách tuyến tính bị hạn chế, mọi phép thêm và xoá đều ở một đầu gọi là đỉnh" cộng bốn phép của slide 24. Đề thi CSI106 hay bắt viết lại một trong hai khung này từ trí nhớ.</li>
</ul>
<p class="nhan">Queue ADT dưới dạng bảng sẵn sàng cho bài thi, kèm mức chi phí mà mỗi phép phải đạt:</p>
<table>
<tr><th>Phép toán</th><th>Định dạng</th><th>Ý nghĩa</th><th>Đổi cái gì</th><th>Chi phí</th></tr>
<tr><td><code>queue</code></td><td><code>queue (queueName)</code></td><td>tạo hàng đợi rỗng</td><td>tất cả (khởi tạo)</td><td>O(1)</td></tr>
<tr><td><code>enqueue</code></td><td><code>enqueue (queueName, dataItem)</code></td><td>chèn vào đuôi</td><td>chỉ <code>rear</code></td><td>O(1)</td></tr>
<tr><td><code>dequeue</code></td><td><code>dequeue (queueName, dataItem)</code></td><td>xoá ở đầu và trả về</td><td>chỉ <code>front</code></td><td>O(1)</td></tr>
<tr><td><code>empty</code></td><td><code>empty (queueName)</code></td><td>kiểm tra trạng thái</td><td><strong>không đổi gì</strong></td><td>O(1)</td></tr>
</table>
<p class="dap-an">✅ Đáp án CQ14.2 gói trong một đoạn: ADT là cặp <em>(định nghĩa, phép toán)</em> được phát biểu mà không nhắc tới hiện thực. Khung này chính là cặp ấy cho hàng đợi. Giá trị của nó ĐO ĐƯỢC: slide 30 dựng đúng khung này bằng bốn cách khác nhau, thời gian chạy trải từ 0,000048 s tới 0,45 s cho cùng 200.000 phép toán, mà không một dòng mã gọi nào phải sửa. Bản đặc tả đứng yên trong khi hiệu năng nhảy hơn 9.000 lần.</p>
<p class="meo">💡 Để ý cả bốn phép đều là O(1) — không phép nào được phép phụ thuộc vào số phần tử đang có. Đó không phải sự tình cờ của slide này; đó là một phần của hợp đồng. Nếu hiện thực của bạn khiến <code>dequeue</code> tốn O(n), bạn đã dựng ra một thứ KHÔNG phải hàng đợi theo nghĩa của khung này.</p>
<p class="pitfall">⚠️ ADT hàng đợi <em>không</em> hứa một kích thước tối đa, và <em>không</em> hứa các phần tử được sắp xếp. Hai đáp án sai hay gặp: "hàng đợi sắp theo độ ưu tiên" (đó là <em>hàng đợi ưu tiên</em>, một ADT khác — xem cây ở slide 22) và "hàng đợi có sức chứa cố định" (chỉ bản hiện thực bằng mảng mới thế, và đó là chi tiết hiện thực mà ADT cố ý không nhắc tới).</p>`],

      [30, 'Queue implementation',
        `<p class="y-chinh">🎯 The slide that makes the ADT idea concrete: "at the ADT level we use the four operations; at the implementation level we need to choose a data structure" — and a queue can be built on <strong>either an array or a linked list</strong>. Figure 9.19 draws all three levels stacked.</p>
<ul>
<li><strong>Read the figure top to bottom — three levels</strong>. (a) <em>ADT</em>: an abstract box with a front and a rear, no implementation at all. (b) <em>Array implementation</em>: slots [1]…[n] with a small record <code>Q</code> holding <strong>count, front, rear</strong> as indexes into the array. (c) <em>Linked-list implementation</em>: nodes chained by pointers, with the same record <code>Q</code> holding <strong>count, front, rear</strong> — but now as <em>pointers</em>, front to the first node and rear to the last.</li>
<li><strong>The <code>count</code> field is not decoration</strong> — it makes <code>empty</code> trivial (<code>count == 0</code>) and it is what saves the circular array from the "is <code>front == rear</code> empty or full?" ambiguity of slide 28.</li>
<li><strong>Why the linked list keeps a <code>rear</code> pointer</strong> — without it, enqueue would have to walk the whole list to find the last node, turning an O(1) operation into O(n). One extra pointer buys back the entire cost. This is the same trick that makes "insert at the end" cheap on slide 20.</li>
<li><strong>The trade-off in one line</strong> — array: fixed size, contiguous, no per-item overhead, cache-friendly. Linked list: grows until memory runs out, 16 bytes per <code>int</code> (measured on slide 21), one <code>malloc</code> per element.</li>
<li><strong>What the slide does not mention and should</strong> — the <em>circular</em> array. A plain array whose <code>front</code> and <code>rear</code> only increase abandons the space behind them, so it reports "full" while half of it is free. Wrapping the indexes with <code>% n</code> fixes it for the cost of one modulo.</li>
</ul>
<p class="nhan">Four implementations of the <em>same</em> Queue ADT, 100 000 enqueues + 100 000 dequeues each, <code>queueimpl.c</code>, <code>cc -Wall -O2</code>. All four produced the identical checksum 4 999 950 000:</p>
<table>
<tr><th>Implementation</th><th>Measured time</th><th>Memory for 100 000 <code>int</code></th><th>Problem</th></tr>
<tr><td>(a) Array, shift left on every dequeue</td><td><strong>0,451 s</strong></td><td>400 KB</td><td>dequeue is O(n) — wrong design</td></tr>
<tr><td>(b) Array, front/rear only increase</td><td><strong>0,000048 s</strong></td><td>800 KB (double!)</td><td>"false full": needs 200 000 slots for 100 000 items</td></tr>
<tr><td>(c) <strong>Circular array</strong></td><td><strong>0,000356 s</strong></td><td>400 KB</td><td>none — <code>front == rear</code> now ambiguous, needs <code>count</code></td></tr>
<tr><td>(d) Linked list</td><td><strong>0,001815 s</strong></td><td>1 600 KB</td><td>100 000 <code>malloc</code> calls; 4× the memory</td></tr>
</table>
<p class="nhan">The "false full" problem, demonstrated on a 5-slot array:</p>
<pre>"Day gia": mang 5 o, da bo 3 phan tu, con 2 phan tu that,
   nhung rear = 5 = kich thuoc mang =&gt; enqueue bao DAY du con 3 o trong.</pre>
<p class="dap-an">✅ Answer: implementation (a) is 1 268× slower than (c) even though both use an array of the same size — because it treats dequeue as "remove and compact", which is O(n) per call and O(n²) overall. Implementation (b) looks fastest but cheats: it silently needed <em>double</em> the memory and would refuse to enqueue an item while 3 of its 5 slots stood empty. The circular array is the only one that is both O(1) and space-exact; the linked list trades 4× the memory for never having a capacity at all. And the crucial part: the caller's code — <code>while (!empty(q)) dequeue(q, &amp;x);</code> — is byte-identical for all four. That is the ADT of slide 29 doing its job.</p>
<p class="meo">💡 Choose by one question: <em>do you know the maximum size in advance?</em> If yes, use a circular array — fastest and leanest. If no, use a linked list and accept the 16-bytes-per-item overhead. Never use variant (a), and never use variant (b) outside a throwaway program.</p>
<p class="pitfall">⚠️ Exam trap on this slide: "which implementation is correct?" — <strong>all of them are correct</strong>; they differ in cost, not in behaviour. The question can only be about efficiency or memory. Answering "the linked list one, because arrays have a fixed size" misses the point of ADTs entirely: the fixed size is invisible above the wall.</p>`,
        `<p class="y-chinh">🎯 Slide làm cho ý tưởng ADT thành cụ thể: "ở mức ADT ta dùng bốn phép toán; ở mức hiện thực ta phải chọn một cấu trúc dữ liệu" — và queue dựng được bằng <strong>mảng HOẶC danh sách liên kết</strong>. Hình 9.19 vẽ cả ba tầng xếp chồng.</p>
<ul>
<li><strong>Đọc hình từ trên xuống — ba tầng</strong>. (a) <em>ADT</em>: một hộp trừu tượng có front và rear, không hiện thực gì cả. (b) <em>Hiện thực bằng mảng</em>: các ô [1]…[n] cộng một bản ghi nhỏ <code>Q</code> giữ <strong>count, front, rear</strong> dưới dạng chỉ số vào mảng. (c) <em>Hiện thực bằng danh sách liên kết</em>: các nút xâu bằng con trỏ, cũng bản ghi <code>Q</code> giữ <strong>count, front, rear</strong> — nhưng giờ là <em>con trỏ</em>, front trỏ nút đầu và rear trỏ nút cuối.</li>
<li><strong>Trường <code>count</code> không phải trang trí</strong> — nó làm <code>empty</code> thành tầm thường (<code>count == 0</code>) và nó chính là thứ cứu mảng vòng khỏi sự nhập nhằng "<code>front == rear</code> là rỗng hay đầy?" đã nói ở slide 28.</li>
<li><strong>Vì sao danh sách liên kết phải giữ con trỏ <code>rear</code></strong> — không có nó thì enqueue phải lội hết danh sách để tìm nút cuối, biến một phép O(1) thành O(n). Thêm đúng một con trỏ là mua lại toàn bộ chi phí ấy. Cùng một mẹo làm cho "chèn vào cuối" rẻ đi ở slide 20.</li>
<li><strong>Đánh đổi gói trong một dòng</strong> — mảng: kích thước cố định, liền khối, không tốn phụ trội mỗi phần tử, thân thiện với cache. Danh sách liên kết: lớn tới khi hết bộ nhớ, 16 byte cho mỗi <code>int</code> (đo ở slide 21), mỗi phần tử một lần <code>malloc</code>.</li>
<li><strong>Thứ slide không nhắc mà đáng lẽ phải nhắc</strong> — mảng <em>VÒNG</em>. Mảng trần với <code>front</code> và <code>rear</code> chỉ tăng sẽ bỏ hoang phần không gian phía sau, nên nó báo "đầy" trong khi một nửa còn trống. Cho chỉ số quay vòng bằng <code>% n</code> là chữa được, giá đúng một phép chia dư.</li>
</ul>
<p class="nhan">Bốn hiện thực của CÙNG một Queue ADT, mỗi bản 100.000 lần enqueue + 100.000 lần dequeue, <code>queueimpl.c</code>, <code>cc -Wall -O2</code>. Cả bốn cho ra đúng một tổng kiểm 4.999.950.000:</p>
<table>
<tr><th>Hiện thực</th><th>Thời gian đo</th><th>Bộ nhớ cho 100.000 <code>int</code></th><th>Vấn đề</th></tr>
<tr><td>(a) Mảng, dồn trái sau mỗi dequeue</td><td><strong>0,451 s</strong></td><td>400 KB</td><td>dequeue thành O(n) — thiết kế sai</td></tr>
<tr><td>(b) Mảng, front/rear chỉ tăng</td><td><strong>0,000048 s</strong></td><td>800 KB (gấp đôi!)</td><td>"đầy giả": cần 200.000 ô cho 100.000 phần tử</td></tr>
<tr><td>(c) <strong>Mảng VÒNG</strong></td><td><strong>0,000356 s</strong></td><td>400 KB</td><td>không — nhưng <code>front == rear</code> nhập nhằng, phải có <code>count</code></td></tr>
<tr><td>(d) Danh sách liên kết</td><td><strong>0,001815 s</strong></td><td>1.600 KB</td><td>100.000 lần gọi <code>malloc</code>; tốn gấp 4 lần bộ nhớ</td></tr>
</table>
<p class="nhan">Hiện tượng "đầy giả", minh hoạ trên mảng 5 ô:</p>
<pre>"Day gia": mang 5 o, da bo 3 phan tu, con 2 phan tu that,
   nhung rear = 5 = kich thuoc mang =&gt; enqueue bao DAY du con 3 o trong.</pre>
<p class="dap-an">✅ Đáp án: hiện thực (a) chậm hơn (c) 1.268 lần dù cả hai dùng mảng cùng kích thước — vì nó coi dequeue là "xoá rồi dồn", tức O(n) mỗi lần gọi và O(n²) tổng cộng. Hiện thực (b) nhìn thì nhanh nhất nhưng gian lận: nó âm thầm cần GẤP ĐÔI bộ nhớ và sẽ từ chối enqueue trong khi 3 trong 5 ô đang trống. Mảng vòng là bản duy nhất vừa O(1) vừa đúng kích thước; danh sách liên kết đổi 4 lần bộ nhớ để lấy việc không bao giờ có giới hạn sức chứa. Và phần quan trọng nhất: mã của người GỌI — <code>while (!empty(q)) dequeue(q, &amp;x);</code> — giống nhau từng byte ở cả bốn bản. Đó là ADT của slide 29 đang làm việc của nó.</p>
<p class="meo">💡 Chọn bằng đúng một câu hỏi: <em>bạn có biết trước kích thước tối đa không?</em> Có thì dùng mảng vòng — nhanh nhất và gọn nhất. Không thì dùng danh sách liên kết và chấp nhận phụ trội 16 byte mỗi phần tử. Đừng bao giờ dùng biến thể (a), và đừng dùng biến thể (b) ngoài một chương trình vứt đi.</p>
<p class="pitfall">⚠️ Bẫy đề ở slide này: "hiện thực nào ĐÚNG?" — <strong>cả bốn đều đúng</strong>; chúng khác nhau về chi phí chứ không khác về hành vi. Câu hỏi chỉ có thể hỏi về hiệu năng hoặc bộ nhớ. Trả lời "bản danh sách liên kết, vì mảng có kích thước cố định" là trượt hoàn toàn tinh thần của ADT: cái kích thước cố định ấy vô hình ở phía trên bức tường.</p>`],

      [31, '3. TREES',
        `<p class="y-chinh">🎯 The first <strong>non-linear</strong> structure of the chapter. A tree is a finite set of <strong>nodes</strong> (vertices) plus a finite set of directed lines called <strong>arcs</strong>; if it is not empty, exactly one node — the <strong>root</strong> — has no incoming arc, and every other node is reachable from the root by a <em>unique</em> path.</p>
<ul>
<li><strong>The three words in the figure</strong> — the slide's own tree has A at the top with arcs down to B, E and F; B has children C and D; F has children G, H and I. The legend states it: <strong>A: root</strong> · <strong>B and F: internal nodes</strong> · <strong>C, D, E, G, H and I: leaves</strong>. A <em>leaf</em> is a node with no outgoing arc; an <em>internal node</em> has at least one.</li>
<li><strong>"A unique path" is the defining property</strong> — not "a path". If two different paths reached the same node there would be a cycle, and the structure would be a graph, not a tree. This one word is what separates slide 31 from slide 36.</li>
<li><strong>Count the arcs</strong> — the figure has 9 nodes and 8 arcs. That is no accident: a tree with <em>n</em> nodes always has exactly <em>n − 1</em> arcs, because every node except the root is entered by exactly one arc. It is a free correctness check on any tree you are asked to draw.</li>
<li><strong>"Drawn upside down with the root at the top"</strong> — the slide says so explicitly, and it is worth noticing because the vocabulary stays botanical anyway: root, branches, leaves. Computer scientists draw trees growing downwards.</li>
<li><strong>Vocabulary the exam expects</strong> — <em>degree</em> of a node = number of its children (A has degree 3, B degree 2, leaves degree 0); <em>level</em> = distance from the root counting the root as level 1; <em>height</em> = the largest level present; <em>subtree</em> = any node together with all its descendants; <em>parent / child / sibling</em> in the obvious sense (C and D are siblings).</li>
</ul>
<p class="nhan">The slide's tree, read out of the figure:</p>
<table>
<tr><th>Property</th><th>Value</th><th>Why</th></tr>
<tr><td>Nodes</td><td>9 (A…I)</td><td>counted in the figure</td></tr>
<tr><td>Arcs</td><td>8</td><td>n − 1, every node but A has one incoming arc</td></tr>
<tr><td>Root</td><td>A</td><td>no incoming arc — stated in the legend</td></tr>
<tr><td>Internal nodes</td><td>B, F</td><td>have children but are not the root</td></tr>
<tr><td>Leaves</td><td>C, D, E, G, H, I</td><td>no outgoing arc — 6 of the 9 nodes</td></tr>
<tr><td>Degree of A / B / F</td><td>3 / 2 / 3</td><td>number of children</td></tr>
<tr><td>Levels</td><td>3</td><td>A at 1; B, E, F at 2; C, D, G, H, I at 3</td></tr>
<tr><td>Height</td><td>3</td><td>the deepest level reached</td></tr>
<tr><td>Path A → H</td><td>A → F → H, length 2</td><td>and there is no other — uniqueness</td></tr>
</table>
<p class="dap-an">✅ Answer to "is this a binary tree?": <strong>no</strong>. A and F each have <em>three</em> children, and slide 32 will define a binary tree as one where no node has more than two subtrees. This is a <em>general tree</em>. The distinction matters because almost every algorithm you will meet — traversals, BST search, Huffman — is stated for binary trees only.</p>
<p class="meo">💡 Where you have already used trees without the word: the file system of Chapter 10 (one root directory, each file has exactly one parent folder, a unique path <code>/home/user/a.txt</code>), the DOM of a web page, and the organisation chart of a company. Any time the phrase "belongs to exactly one" appears, a tree is hiding.</p>
<p class="pitfall">⚠️ Two confusions the exam exploits. First, an <em>empty</em> tree (zero nodes) is a legitimate tree — that is why the definition says "if the tree is not empty, one of the nodes…". Second, "height" is counted inconsistently across textbooks: Forouzan counts the root as level 1, so this tree has height 3, while some books count the root as level 0 and would say height 2. Say which convention you are using and you cannot be marked wrong.</p>`,
        `<p class="y-chinh">🎯 Cấu trúc <strong>PHI TUYẾN</strong> đầu tiên của chương. Cây là một tập hữu hạn các <strong>nút</strong> (đỉnh) cộng một tập hữu hạn các đường có hướng gọi là <strong>cung</strong>; nếu cây không rỗng thì có đúng một nút — <strong>gốc</strong> — không có cung đi vào, và mọi nút khác đều tới được từ gốc theo một đường đi <em>DUY NHẤT</em>.</p>
<ul>
<li><strong>Ba từ trong hình</strong> — cây của chính slide có A trên cùng với cung đi xuống B, E và F; B có con C và D; F có con G, H và I. Chú giải ghi rõ: <strong>A: gốc</strong> · <strong>B và F: nút trong</strong> · <strong>C, D, E, G, H và I: lá</strong>. <em>Lá</em> là nút không có cung đi ra; <em>nút trong</em> có ít nhất một cung đi ra.</li>
<li><strong>Chữ "đường đi DUY NHẤT" mới là tính chất định nghĩa</strong> — không phải "một đường đi". Nếu có hai đường khác nhau cùng tới một nút thì sẽ có chu trình, và cấu trúc ấy là đồ thị chứ không phải cây. Đúng một chữ ấy tách slide 31 khỏi slide 36.</li>
<li><strong>Đếm số cung</strong> — hình có 9 nút và 8 cung. Không phải ngẫu nhiên: cây có <em>n</em> nút thì luôn có đúng <em>n − 1</em> cung, vì mọi nút trừ gốc đều bị đúng một cung đi vào. Đây là phép kiểm đúng/sai miễn phí cho bất kỳ cây nào đề bắt bạn vẽ.</li>
<li><strong>"Vẽ lộn ngược với gốc ở trên cùng"</strong> — slide nói thẳng như vậy, và đáng chú ý vì từ vựng thì vẫn giữ nguyên chất thực vật: gốc, cành, lá. Dân tin học vẽ cây mọc xuống dưới.</li>
<li><strong>Từ vựng đề thi chờ nghe</strong> — <em>bậc</em> của một nút = số con của nó (A bậc 3, B bậc 2, lá bậc 0); <em>mức</em> = khoảng cách tới gốc, tính gốc là mức 1; <em>chiều cao</em> = mức lớn nhất có mặt; <em>cây con</em> = một nút cùng toàn bộ hậu duệ của nó; <em>cha / con / anh em</em> theo nghĩa hiển nhiên (C và D là anh em).</li>
</ul>
<p class="nhan">Cây trên slide, đọc từ hình:</p>
<table>
<tr><th>Tính chất</th><th>Giá trị</th><th>Vì sao</th></tr>
<tr><td>Số nút</td><td>9 (A…I)</td><td>đếm trong hình</td></tr>
<tr><td>Số cung</td><td>8</td><td>n − 1, mọi nút trừ A đều có một cung vào</td></tr>
<tr><td>Gốc</td><td>A</td><td>không có cung đi vào — chú giải ghi rõ</td></tr>
<tr><td>Nút trong</td><td>B, F</td><td>có con nhưng không phải gốc</td></tr>
<tr><td>Lá</td><td>C, D, E, G, H, I</td><td>không có cung đi ra — 6 trong 9 nút</td></tr>
<tr><td>Bậc của A / B / F</td><td>3 / 2 / 3</td><td>số con</td></tr>
<tr><td>Số mức</td><td>3</td><td>A ở mức 1; B, E, F ở mức 2; C, D, G, H, I ở mức 3</td></tr>
<tr><td>Chiều cao</td><td>3</td><td>mức sâu nhất chạm tới</td></tr>
<tr><td>Đường A → H</td><td>A → F → H, dài 2</td><td>và không có đường nào khác — tính duy nhất</td></tr>
</table>
<p class="dap-an">✅ Đáp án cho câu "đây có phải cây nhị phân không?": <strong>KHÔNG</strong>. A và F mỗi nút có <em>ba</em> con, mà slide 32 sẽ định nghĩa cây nhị phân là cây không nút nào có quá hai cây con. Đây là <em>cây tổng quát</em>. Phân biệt này quan trọng vì gần như mọi thuật toán bạn sắp gặp — các phép duyệt, tìm kiếm BST, Huffman — chỉ được phát biểu cho cây nhị phân.</p>
<p class="meo">💡 Bạn đã dùng cây mà chưa gọi tên ở đâu: hệ thống tệp ở Chương 10 (một thư mục gốc, mỗi tệp có đúng một thư mục cha, đường dẫn duy nhất <code>/home/user/a.txt</code>), cây DOM của một trang web, và sơ đồ tổ chức của một công ty. Hễ xuất hiện cụm "thuộc về đúng một" là có một cái cây đang nấp.</p>
<p class="pitfall">⚠️ Hai chỗ nhầm mà đề thi hay khai thác. Thứ nhất, cây <em>RỖNG</em> (không nút nào) vẫn là một cây hợp lệ — đó là lý do định nghĩa phải nói "nếu cây không rỗng thì một trong các nút…". Thứ hai, "chiều cao" được đếm khác nhau giữa các sách: Forouzan tính gốc là mức 1 nên cây này cao 3, còn một số sách tính gốc là mức 0 và sẽ nói cao 2. Cứ ghi rõ bạn đang dùng quy ước nào thì không ai chấm sai được.</p>`],

      [32, 'Binary trees',
        `<p class="y-chinh">🎯 One restriction turns a general tree into the workhorse of computer science: a <strong>binary tree</strong> is a tree in which <strong>no node has more than two subtrees</strong> — zero, one or two — and the two are distinguished as the <strong>left subtree</strong> and the <strong>right subtree</strong>.</p>
<ul>
<li><strong>Left and right are not interchangeable</strong> — this is the sentence students skip. A node with a single child still has to say <em>which side</em> that child is on. The figure makes the point: node E has one child F drawn on the right, so E has an empty left subtree and a non-empty right subtree. Swap them and it is a <em>different</em> tree.</li>
<li><strong>Read the figure</strong> — Root A; the left subtree is drawn as a triangle containing B with children C and D; the right subtree is a triangle containing E with the single child F. Both triangles are labelled, because the slide wants you to see a binary tree <em>recursively</em>: a root plus two binary trees.</li>
<li><strong>The recursive definition is the useful one</strong> — "a binary tree is either empty, or a root with a left binary tree and a right binary tree". Every algorithm on slide 33 is three lines long precisely because the structure is defined this way.</li>
<li><strong>Why two and not three</strong> — two children is the smallest branching factor that still gives you <em>splitting</em>, and splitting is what turns O(n) into O(log n). One child would be a linked list; three or more gives no extra asymptotic power, only complexity.</li>
<li><strong>The counting facts the exam asks for</strong> — the maximum number of nodes at level <em>i</em> is 2<sup>i−1</sup>; the maximum number of nodes in a tree of height <em>h</em> is 2<sup>h</sup> − 1; therefore the minimum height needed to hold <em>n</em> nodes is ⌈log₂(n + 1)⌉.</li>
</ul>
<p class="nhan">Those formulas applied, so the numbers are concrete:</p>
<table>
<tr><th>Height h</th><th>Max nodes at the last level 2<sup>h−1</sup></th><th>Max nodes in total 2<sup>h</sup> − 1</th></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
<tr><td>3</td><td>4</td><td>7</td></tr>
<tr><td>10</td><td>512</td><td>1 023</td></tr>
<tr><td>20</td><td>524 288</td><td>1 048 575</td></tr>
<tr><td>30</td><td>536 870 912</td><td>1 073 741 823</td></tr>
</table>
<p class="dap-an">✅ Answer to "how tall must a binary tree be to hold one million nodes?": ⌈log₂(1 000 001)⌉ = <strong>20 levels</strong>, because a tree of height 20 holds up to 1 048 575 nodes and height 19 only reaches 524 287. That is the number worth carrying away: a <em>balanced</em> binary tree reaches a million items in 20 steps and a billion in 30. The same million items in a linked list take 500 000 steps on average. That factor of 25 000 is the entire reason binary trees exist — and slide 35 shows how badly it degrades if the tree is not balanced.</p>
<p class="meo">💡 The figure of the slide, run through <code>trees.c</code>, has 6 nodes and height 3 — but the maximum for height 3 is 7 nodes. It is <em>almost</em> full: one slot (E's left child) is missing. Terms: a tree is <strong>full</strong> when every node has 0 or 2 children, and <strong>complete</strong> when every level is filled except possibly the last, filled left to right.</p>
<p class="pitfall">⚠️ Slide numbering slip: the body text says "Figure 12.22 shows a binary tree with its two subtrees" while the caption underneath reads "Figure 9.21". 12.22 is the number in Forouzan's original Chapter 12; the deck renumbered the captions to 9.x but left the references in the body untouched. The same mismatch appears on slides 35 and 36. Nothing is wrong with the content — just do not go hunting for a Figure 12.22 in this deck.</p>`,
        `<p class="y-chinh">🎯 Một hạn chế duy nhất biến cây tổng quát thành con ngựa kéo của ngành tin học: <strong>cây nhị phân</strong> là cây mà <strong>không nút nào có quá hai cây con</strong> — không, một, hoặc hai — và hai cây con ấy được phân biệt thành <strong>cây con TRÁI</strong> và <strong>cây con PHẢI</strong>.</p>
<ul>
<li><strong>Trái và phải KHÔNG hoán đổi được</strong> — đây là câu sinh viên hay đọc lướt. Một nút chỉ có một con vẫn phải nói rõ con ấy nằm <em>bên nào</em>. Hình vẽ nói đúng điều đó: nút E có một con là F vẽ bên phải, nên E có cây con trái RỖNG và cây con phải khác rỗng. Đổi chỗ hai bên là một cây KHÁC.</li>
<li><strong>Đọc hình</strong> — Gốc A; cây con trái vẽ thành tam giác chứa B với hai con C và D; cây con phải là tam giác chứa E với một con F. Cả hai tam giác đều được dán nhãn, vì slide muốn bạn nhìn cây nhị phân theo lối <em>ĐỆ QUY</em>: một gốc cộng hai cây nhị phân.</li>
<li><strong>Định nghĩa đệ quy mới là định nghĩa dùng được</strong> — "cây nhị phân hoặc là rỗng, hoặc là một gốc với một cây nhị phân trái và một cây nhị phân phải". Mọi thuật toán ở slide 33 dài đúng ba dòng chính là vì cấu trúc được định nghĩa kiểu này.</li>
<li><strong>Vì sao là hai chứ không phải ba</strong> — hai con là hệ số phân nhánh nhỏ nhất mà vẫn cho được sự <em>CHIA ĐÔI</em>, và chia đôi chính là thứ biến O(n) thành O(log n). Một con thì thành danh sách liên kết; ba con trở lên không cho thêm sức mạnh tiệm cận nào, chỉ thêm rắc rối.</li>
<li><strong>Các công thức đếm đề thi hay hỏi</strong> — số nút tối đa ở mức <em>i</em> là 2<sup>i−1</sup>; số nút tối đa trong cây cao <em>h</em> là 2<sup>h</sup> − 1; do đó chiều cao tối thiểu để chứa <em>n</em> nút là ⌈log₂(n + 1)⌉.</li>
</ul>
<p class="nhan">Áp dụng các công thức ấy cho ra con số cụ thể:</p>
<table>
<tr><th>Chiều cao h</th><th>Nút tối đa ở mức cuối 2<sup>h−1</sup></th><th>Tổng nút tối đa 2<sup>h</sup> − 1</th></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
<tr><td>3</td><td>4</td><td>7</td></tr>
<tr><td>10</td><td>512</td><td>1.023</td></tr>
<tr><td>20</td><td>524.288</td><td>1.048.575</td></tr>
<tr><td>30</td><td>536.870.912</td><td>1.073.741.823</td></tr>
</table>
<p class="dap-an">✅ Đáp án cho câu "cây nhị phân phải cao bao nhiêu để chứa một triệu nút?": ⌈log₂(1.000.001)⌉ = <strong>20 mức</strong>, vì cây cao 20 chứa được tới 1.048.575 nút còn cao 19 chỉ tới 524.287. Đó là con số đáng mang đi: một cây nhị phân <em>CÂN BẰNG</em> chạm tới một triệu phần tử trong 20 bước và một tỷ trong 30 bước. Cũng một triệu phần tử ấy nằm trong danh sách liên kết thì trung bình tốn 500.000 bước. Hệ số 25.000 lần ấy chính là toàn bộ lý do cây nhị phân tồn tại — và slide 35 sẽ cho thấy nó tệ đi thế nào nếu cây không cân bằng.</p>
<p class="meo">💡 Cây trên hình của slide, chạy qua <code>trees.c</code>, có 6 nút và chiều cao 3 — trong khi tối đa cho chiều cao 3 là 7 nút. Nó <em>gần như</em> đầy: thiếu đúng một chỗ (con trái của E). Thuật ngữ: cây <strong>đầy đủ (full)</strong> khi mọi nút có 0 hoặc 2 con, và <strong>hoàn chỉnh (complete)</strong> khi mọi mức được lấp kín trừ có thể mức cuối, mà mức cuối lấp từ trái sang phải.</p>
<p class="pitfall">⚠️ Lỗi đánh số của slide: thân slide ghi "Figure 12.22 shows a binary tree with its two subtrees" trong khi chú thích bên dưới ghi "Figure 9.21". 12.22 là số trong Chương 12 gốc của Forouzan; deck đã đánh lại chú thích thành 9.x nhưng để nguyên các tham chiếu trong thân slide. Cùng kiểu lệch ấy xuất hiện ở slide 35 và 36. Nội dung không sai gì — chỉ là đừng đi tìm cái "Figure 12.22" trong bộ slide này.</p>`],

      [33, 'Operations on binary trees — traversals',
        `<p class="y-chinh">🎯 A <strong>traversal</strong> processes every node <em>once and only once</em> in a predetermined order. There are two families: <strong>depth-first</strong> (three variants: preorder, inorder, postorder) and <strong>breadth-first</strong> (level by level).</p>
<ul>
<li><strong>The three little triangles on the left of the figure tell you everything</strong> — each shows a root circle and two subtree triangles numbered 1, 2, 3 in the order they are visited. <em>Preorder</em>: root = 1, left = 2, right = 3. <em>Inorder</em>: left = 1, root = 2, right = 3. <em>Postorder</em>: left = 1, right = 2, root = 3.</li>
<li><strong>The name tells you where the ROOT goes</strong> — <em>pre</em>order = root <em>before</em> the subtrees; <em>in</em>order = root <em>in between</em>; <em>post</em>order = root <em>after</em>. In all three the left subtree is always visited before the right. That single rule generates all three sequences.</li>
<li><strong>Each one is three lines of code</strong> — <code>void pre(tn *t){ if(!t) return; visit(t); pre(t-&gt;l); pre(t-&gt;r); }</code>. Move the <code>visit(t)</code> line to the middle and you have inorder; to the end and you have postorder. Nothing else changes. That is the recursive definition of slide 32 paying off.</li>
<li><strong>The right half of the figure</strong> — "a. Processing order" shows the nodes grouped as A | B C D | E _ F, and "b. Walking order" draws a curve that starts at the root, hugs the outside of the tree and returns, numbering the nodes 1…6 as it passes them. The walk is the same for all three traversals; only <em>when</em> you record a node differs.</li>
<li><strong>Breadth-first is the odd one out</strong> — it is not recursive and it needs a <strong>queue</strong>: enqueue the root; then repeatedly dequeue a node, print it, and enqueue its children. That is why the queue of slides 25–30 had to come before this slide.</li>
</ul>
<p class="nhan">The slide's own tree — A root, B with children C and D, E with right child F — run through <code>trees.c</code> (<code>cc -Wall</code>):</p>
<pre>preorder  (goc-trai-phai): A B C D E F
inorder   (trai-goc-phai): C B D A E F
postorder (trai-phai-goc): C D B F E A
breadth-first (theo muc) : A B E C D F
so nut = 6, chieu cao = 3</pre>
<table>
<tr><th>Traversal</th><th>Rule</th><th>Sequence</th><th>Typical use</th></tr>
<tr><td>Preorder</td><td>root · left · right</td><td><strong>A B C D E F</strong></td><td>copy a tree; prefix (Polish) notation</td></tr>
<tr><td>Inorder</td><td>left · root · right</td><td><strong>C B D A E F</strong></td><td>infix notation; <em>sorted output from a BST</em> (slide 35)</td></tr>
<tr><td>Postorder</td><td>left · right · root</td><td><strong>C D B F E A</strong></td><td>delete a tree; postfix notation; evaluate an expression</td></tr>
<tr><td>Breadth-first</td><td>level by level</td><td><strong>A B E C D F</strong></td><td>shortest path in an unweighted graph; level printing</td></tr>
</table>
<p class="dap-an">✅ Answer: check them against each other. All four sequences contain exactly the same 6 letters — that is the "once and only once" requirement. Preorder must start with the root (A first); postorder must end with it (A last); inorder puts the root exactly where the left subtree ends (A sits after C B D, the whole left subtree, and before E F, the whole right subtree). Breadth-first must list A, then everything at level 2 (B, E), then level 3 (C, D, F). Every one of those checks passes, which is how you verify your own answer in an exam without a computer.</p>
<p class="meo">💡 Do the traversals by hand with the "walking" curve of the figure: trace a loop around the whole tree, passing every node three times — on its left, underneath, and on its right. Record on the <strong>left</strong> pass = preorder; record <strong>underneath</strong> = inorder; record on the <strong>right</strong> pass = postorder. One drawing gives all three answers.</p>
<p class="pitfall">⚠️ Two traps. First, <em>depth-first</em> is the family name for the three DFS variants — a question saying "perform a depth-first traversal" without naming the variant is under-specified; answer preorder and say so. Second, given only ONE traversal sequence you <strong>cannot</strong> rebuild the tree. You need two, and they must include inorder: preorder + inorder works, postorder + inorder works, but preorder + postorder does not.</p>`,
        `<p class="y-chinh">🎯 Một <strong>phép duyệt</strong> xử lý mọi nút <em>đúng một lần và chỉ một lần</em> theo một thứ tự định trước. Có hai họ: <strong>theo chiều sâu</strong> (ba biến thể: preorder, inorder, postorder) và <strong>theo chiều rộng</strong> (từng mức một).</p>
<ul>
<li><strong>Ba tam giác nhỏ bên trái hình đã nói hết</strong> — mỗi cái vẽ một vòng tròn gốc và hai tam giác cây con, đánh số 1, 2, 3 theo thứ tự được thăm. <em>Preorder</em>: gốc = 1, trái = 2, phải = 3. <em>Inorder</em>: trái = 1, gốc = 2, phải = 3. <em>Postorder</em>: trái = 1, phải = 2, gốc = 3.</li>
<li><strong>Cái tên cho biết GỐC nằm ở đâu</strong> — <em>pre</em>order = gốc <em>trước</em> hai cây con; <em>in</em>order = gốc <em>ở giữa</em>; <em>post</em>order = gốc <em>sau</em>. Ở cả ba, cây con trái luôn được thăm trước cây con phải. Đúng một luật ấy sinh ra cả ba dãy.</li>
<li><strong>Mỗi phép là ba dòng mã</strong> — <code>void pre(tn *t){ if(!t) return; visit(t); pre(t-&gt;l); pre(t-&gt;r); }</code>. Dời dòng <code>visit(t)</code> xuống giữa thì thành inorder; xuống cuối thì thành postorder. Không đổi gì khác. Đó là định nghĩa đệ quy của slide 32 trả công.</li>
<li><strong>Nửa phải của hình</strong> — "a. Processing order" nhóm các nút thành A | B C D | E _ F, và "b. Walking order" vẽ một đường cong xuất phát từ gốc, ôm sát vành ngoài của cây rồi quay về, đánh số các nút 1…6 khi đi ngang qua. Đường đi ấy giống nhau cho cả ba phép duyệt; chỉ khác ở chỗ <em>KHI NÀO</em> bạn ghi lại một nút.</li>
<li><strong>Duyệt theo chiều rộng là kẻ lạc loài</strong> — nó không đệ quy và nó cần một <strong>hàng đợi</strong>: enqueue gốc; rồi lặp lại việc dequeue một nút, in ra, và enqueue các con của nó. Đó là lý do hàng đợi của slide 25–30 phải đứng trước slide này.</li>
</ul>
<p class="nhan">Chính cây trên slide — A gốc, B có con C và D, E có con phải F — chạy qua <code>trees.c</code> (<code>cc -Wall</code>):</p>
<pre>preorder  (goc-trai-phai): A B C D E F
inorder   (trai-goc-phai): C B D A E F
postorder (trai-phai-goc): C D B F E A
breadth-first (theo muc) : A B E C D F
so nut = 6, chieu cao = 3</pre>
<table>
<tr><th>Phép duyệt</th><th>Luật</th><th>Dãy kết quả</th><th>Dùng điển hình</th></tr>
<tr><td>Preorder</td><td>gốc · trái · phải</td><td><strong>A B C D E F</strong></td><td>sao chép cây; ký hiệu tiền tố (Ba Lan)</td></tr>
<tr><td>Inorder</td><td>trái · gốc · phải</td><td><strong>C B D A E F</strong></td><td>ký hiệu trung tố; <em>in ra dãy TĂNG DẦN từ một BST</em> (slide 35)</td></tr>
<tr><td>Postorder</td><td>trái · phải · gốc</td><td><strong>C D B F E A</strong></td><td>xoá cây; ký hiệu hậu tố; tính giá trị biểu thức</td></tr>
<tr><td>Theo chiều rộng</td><td>từng mức</td><td><strong>A B E C D F</strong></td><td>đường đi ngắn nhất trên đồ thị không trọng số; in theo mức</td></tr>
</table>
<p class="dap-an">✅ Đáp án: hãy kiểm chéo chúng với nhau. Cả bốn dãy đều chứa đúng 6 chữ cái ấy — đó là yêu cầu "một lần và chỉ một lần". Preorder bắt buộc bắt đầu bằng gốc (A đứng đầu); postorder bắt buộc kết thúc bằng gốc (A đứng cuối); inorder đặt gốc đúng chỗ cây con trái vừa hết (A nằm sau C B D là toàn bộ cây con trái, và trước E F là toàn bộ cây con phải). Duyệt theo chiều rộng phải liệt kê A, rồi mọi thứ ở mức 2 (B, E), rồi mức 3 (C, D, F). Cả bốn phép kiểm đều đạt — đó là cách bạn tự nghiệm đáp án trong phòng thi mà không có máy tính.</p>
<p class="meo">💡 Làm tay bằng đường cong "walking" trong hình: vẽ một vòng ôm quanh cả cây, đi ngang mỗi nút ba lần — bên trái nó, bên dưới nó, và bên phải nó. Ghi ở lượt <strong>BÊN TRÁI</strong> = preorder; ghi ở lượt <strong>BÊN DƯỚI</strong> = inorder; ghi ở lượt <strong>BÊN PHẢI</strong> = postorder. Một hình vẽ cho cả ba đáp án.</p>
<p class="pitfall">⚠️ Hai bẫy. Thứ nhất, <em>depth-first</em> là tên HỌ của ba biến thể DFS — đề ghi "hãy duyệt theo chiều sâu" mà không nói biến thể nào là đề thiếu dữ kiện; hãy trả lời preorder và ghi rõ bạn chọn nó. Thứ hai, chỉ cho MỘT dãy duyệt thì <strong>KHÔNG</strong> dựng lại được cây. Phải có hai dãy, và bắt buộc phải có inorder: preorder + inorder được, postorder + inorder được, còn preorder + postorder thì không.</p>`],

      [34, 'Binary tree applications',
        `<p class="y-chinh">🎯 Two real applications that justify the whole section: <strong>Huffman coding</strong> (compression by variable-length codes) and <strong>expression trees</strong> (the same arithmetic expression written three ways — infix, postfix, prefix — as the three traversals of one tree).</p>
<ul>
<li><strong>Huffman coding, in one sentence</strong> — build a binary tree in which frequent symbols sit near the root and rare symbols sit deep; then read each symbol's code off the path (left = 0, right = 1). Frequent symbols get short codes, so the total shrinks.</li>
<li><strong>Why the code is decodable without separators</strong> — because every symbol is a <em>leaf</em>. No code is a prefix of another, so a decoder can read bit by bit and know exactly when a symbol ends. That property comes free from putting symbols only at leaves.</li>
<li><strong>Expression trees: operands are leaves, operators are internal nodes</strong> — the figure's tree has <code>+</code> at the root, <code>×</code> and <code>d</code> as its children, <code>a</code> and another <code>+</code> under the <code>×</code>, and <code>b</code>, <code>c</code> under that inner <code>+</code>.</li>
<li><strong>The three notations are the three traversals</strong> — this is the elegant part. <em>Prefix</em> = preorder (operator before operands). <em>Infix</em> = inorder (operator between). <em>Postfix</em> = postorder (operator after). The slide states the pattern for a simple sum: prefix <code>+ A B</code>, infix <code>A + B</code>, postfix <code>A B +</code>.</li>
<li><strong>Why postfix matters practically</strong> — it needs <strong>no parentheses and no precedence rules</strong>, and it is evaluated by a single pass with a stack: push operands, and on an operator pop two, combine, push the result. Every pocket calculator of the HP kind and many virtual machines work this way.</li>
</ul>
<p class="nhan">The slide's tree traversed by <code>trees.c</code> — the three sequences match the three boxes printed on the slide exactly:</p>
<pre>preorder  = PREFIX : + x a + b c d
inorder   = INFIX  : a x b + c + d
postorder = POSTFIX: a b c + x d +</pre>
<p class="nhan">Now evaluate both readings with real numbers (<code>expr.c</code>, a stack-based postfix evaluator, a = 2, b = 3, c = 4, d = 5):</p>
<pre>postfix  "a b c + x d +"  = 19
infix    a x (b + c) + d  = 19
inorder THO (khong ngoac): a x b + c + d = 15   &lt;== KHAC!</pre>
<p class="dap-an">✅ Answer, and it is the point the slide leaves unsaid: prefix and postfix are <strong>unambiguous on their own</strong>, but plain inorder is <strong>not</strong>. Reading the tree inorder gives the character string <code>a × b + c + d</code>, which evaluates to 15, while the tree actually means <code>a × (b + c) + d</code> = 19. The slide prints the infix form <em>with</em> parentheses in its figure but never says why they are needed. They are needed because inorder alone loses the grouping — the tree knows that <code>b + c</code> is one operand of <code>×</code>, the flat string does not. Prefix and postfix need no parentheses at all, and that is exactly their advantage.</p>
<p class="nhan">Huffman for real (<code>huff.c</code>, on the string "MISSISSIPPI RIVER", 17 characters, 8 distinct symbols):</p>
<table>
<tr><th>Symbol</th><th>Frequency</th><th>Huffman code</th><th>Bits</th></tr>
<tr><td>I</td><td>5</td><td><code>11</code></td><td>2</td></tr>
<tr><td>S</td><td>4</td><td><code>10</code></td><td>2</td></tr>
<tr><td>P</td><td>2</td><td><code>011</code></td><td>3</td></tr>
<tr><td>R</td><td>2</td><td><code>010</code></td><td>3</td></tr>
<tr><td>space</td><td>1</td><td><code>0000</code></td><td>4</td></tr>
<tr><td>E</td><td>1</td><td><code>0001</code></td><td>4</td></tr>
<tr><td>V</td><td>1</td><td><code>0010</code></td><td>4</td></tr>
<tr><td>M</td><td>1</td><td><code>0011</code></td><td>4</td></tr>
</table>
<p class="dap-an">✅ Measured result: fixed-width ASCII needs 17 × 8 = <strong>136 bits</strong>; the Huffman code needs <strong>46 bits</strong> — a saving of <strong>66,2 %</strong>. Notice the tree did the work: I appears 5 times and got 2 bits, M appears once and got 4. No symbol's code is a prefix of another (<code>11</code>, <code>10</code>, <code>011</code>, <code>010</code>, <code>0000</code>…), which is why "1110100011" decodes back to exactly one string. This is the compression of Chapter 3 built out of the tree of Chapter 9.</p>
<p class="meo">💡 To convert infix to postfix by hand, do not rewrite the string — <em>draw the tree first</em>, then read it postorder. Building the tree forces you to resolve precedence and parentheses once, and after that all three notations fall out for free.</p>
<p class="pitfall">⚠️ Getting prefix and postfix backwards costs an easy mark. Anchor them on the two-operand case the slide gives: <strong>prefix <code>+ A B</code></strong> (operator first) versus <strong>postfix <code>A B +</code></strong> (operator last). "Pre" and "post" refer to the <em>operator's</em> position relative to its operands, not to the order of A and B — the operands stay in the same left-to-right order in all three notations.</p>`,
        `<p class="y-chinh">🎯 Hai ứng dụng thật biện minh cho cả mục: <strong>mã Huffman</strong> (nén bằng mã có độ dài thay đổi) và <strong>cây biểu thức</strong> (cùng một biểu thức số học viết theo ba cách — trung tố, hậu tố, tiền tố — chính là ba phép duyệt của một cái cây).</p>
<ul>
<li><strong>Mã Huffman, gói trong một câu</strong> — dựng một cây nhị phân trong đó ký hiệu xuất hiện nhiều nằm gần gốc và ký hiệu hiếm nằm sâu; rồi đọc mã của từng ký hiệu theo đường đi (trái = 0, phải = 1). Ký hiệu hay gặp được mã ngắn, nên tổng số bit co lại.</li>
<li><strong>Vì sao giải mã được mà không cần dấu phân cách</strong> — vì mọi ký hiệu đều nằm ở <em>LÁ</em>. Không mã nào là tiền tố của mã khác, nên bộ giải mã đọc từng bit và biết chính xác lúc nào một ký hiệu kết thúc. Tính chất ấy có sẵn khi ta chỉ đặt ký hiệu ở lá.</li>
<li><strong>Cây biểu thức: toán hạng là lá, toán tử là nút trong</strong> — cây trong hình có <code>+</code> ở gốc, <code>×</code> và <code>d</code> là hai con, dưới <code>×</code> là <code>a</code> và một dấu <code>+</code> nữa, và dưới dấu <code>+</code> bên trong ấy là <code>b</code>, <code>c</code>.</li>
<li><strong>Ba dạng ký hiệu chính là ba phép duyệt</strong> — đây là chỗ đẹp nhất. <em>Tiền tố</em> = preorder (toán tử trước toán hạng). <em>Trung tố</em> = inorder (toán tử ở giữa). <em>Hậu tố</em> = postorder (toán tử sau). Slide phát biểu khuôn mẫu ấy cho một phép cộng đơn giản: tiền tố <code>+ A B</code>, trung tố <code>A + B</code>, hậu tố <code>A B +</code>.</li>
<li><strong>Vì sao hậu tố quan trọng trong thực tế</strong> — nó <strong>không cần dấu ngoặc và không cần luật ưu tiên</strong>, và tính được bằng một lượt quét duy nhất với một stack: gặp toán hạng thì push, gặp toán tử thì pop hai, tính, push kết quả. Mọi máy tính bỏ túi kiểu HP và nhiều máy ảo đều chạy như vậy.</li>
</ul>
<p class="nhan">Cây của slide duyệt bằng <code>trees.c</code> — ba dãy khớp chính xác với ba ô in trên slide:</p>
<pre>preorder  = PREFIX : + x a + b c d
inorder   = INFIX  : a x b + c + d
postorder = POSTFIX: a b c + x d +</pre>
<p class="nhan">Bây giờ tính giá trị cả hai cách đọc bằng số thật (<code>expr.c</code>, máy tính hậu tố dùng stack, a = 2, b = 3, c = 4, d = 5):</p>
<pre>postfix  "a b c + x d +"  = 19
infix    a x (b + c) + d  = 19
inorder THO (khong ngoac): a x b + c + d = 15   &lt;== KHAC!</pre>
<p class="dap-an">✅ Đáp án, và đây là điều slide bỏ ngỏ: tiền tố và hậu tố <strong>tự thân đã không nhập nhằng</strong>, còn trung tố trần thì <strong>KHÔNG</strong>. Duyệt inorder cây ấy cho ra chuỗi ký tự <code>a × b + c + d</code>, tính ra 15, trong khi cây thật sự có nghĩa là <code>a × (b + c) + d</code> = 19. Slide có in dạng trung tố CÓ ngoặc trong hình nhưng không hề nói vì sao cần ngoặc. Cần, vì riêng inorder làm MẤT sự gom nhóm — cái cây biết <code>b + c</code> là một toán hạng của <code>×</code>, còn chuỗi phẳng thì không. Tiền tố và hậu tố không cần dấu ngoặc nào cả, và đó chính là ưu thế của chúng.</p>
<p class="nhan">Huffman chạy thật (<code>huff.c</code>, trên chuỗi "MISSISSIPPI RIVER", 17 ký tự, 8 ký hiệu khác nhau):</p>
<table>
<tr><th>Ký hiệu</th><th>Tần suất</th><th>Mã Huffman</th><th>Số bit</th></tr>
<tr><td>I</td><td>5</td><td><code>11</code></td><td>2</td></tr>
<tr><td>S</td><td>4</td><td><code>10</code></td><td>2</td></tr>
<tr><td>P</td><td>2</td><td><code>011</code></td><td>3</td></tr>
<tr><td>R</td><td>2</td><td><code>010</code></td><td>3</td></tr>
<tr><td>dấu cách</td><td>1</td><td><code>0000</code></td><td>4</td></tr>
<tr><td>E</td><td>1</td><td><code>0001</code></td><td>4</td></tr>
<tr><td>V</td><td>1</td><td><code>0010</code></td><td>4</td></tr>
<tr><td>M</td><td>1</td><td><code>0011</code></td><td>4</td></tr>
</table>
<p class="dap-an">✅ Kết quả đo: ASCII cố định cần 17 × 8 = <strong>136 bit</strong>; mã Huffman cần <strong>46 bit</strong> — tiết kiệm <strong>66,2 %</strong>. Chú ý cái cây đã làm việc: I xuất hiện 5 lần và được 2 bit, M xuất hiện 1 lần và được 4 bit. Không mã nào là tiền tố của mã khác (<code>11</code>, <code>10</code>, <code>011</code>, <code>010</code>, <code>0000</code>…), nên chuỗi "1110100011" giải mã ngược lại thành đúng một kết quả duy nhất. Đây chính là phép nén của Chương 3 được dựng bằng cái cây của Chương 9.</p>
<p class="meo">💡 Muốn đổi trung tố sang hậu tố bằng tay thì đừng viết lại chuỗi — <em>hãy vẽ cây trước</em>, rồi đọc postorder. Việc dựng cây buộc bạn giải quyết ưu tiên và dấu ngoặc đúng một lần, xong rồi thì cả ba dạng ký hiệu tự rơi ra miễn phí.</p>
<p class="pitfall">⚠️ Nhầm tiền tố với hậu tố là mất một điểm dễ. Hãy neo vào chính ví dụ hai toán hạng của slide: <strong>tiền tố <code>+ A B</code></strong> (toán tử đứng trước) so với <strong>hậu tố <code>A B +</code></strong> (toán tử đứng sau). "Tiền" và "hậu" nói về vị trí của <em>TOÁN TỬ</em> so với các toán hạng, không nói về thứ tự của A và B — các toán hạng giữ nguyên thứ tự trái-sang-phải ở cả ba dạng.</p>`],

      [35, 'Binary search trees',
        `<p class="y-chinh">🎯 One extra property turns a binary tree into a searchable one. In a <strong>binary search tree (BST)</strong>, the key of every node is <strong>greater than every key in its left subtree and smaller than every key in its right subtree</strong> — the figure states it as <em>All &lt; K</em> on the left and <em>All &gt; K</em> on the right.</p>
<ul>
<li><strong>Read the word "all" very carefully</strong> — the condition is about <em>every node in the entire subtree</em>, not just the immediate children. That distinction is the single most examined point about BSTs, and the counter-example below shows why.</li>
<li><strong>What the property buys you</strong> — at every node you compare once and discard an entire subtree. Search, insert and delete all become O(height) instead of O(n). That is the binary search of Chapter 6 made into a data structure that can also grow and shrink cheaply.</li>
<li><strong>The three example trees on the slide</strong> — (1) 17 with left child 6, and 3 under 6: a chain leaning left. (2) 17 with right child 19: a two-node chain. (3) 17 with left 6 (children 3 and 14) and right 19: the balanced one. All three satisfy the property, which is the point — a BST is defined by its <em>ordering</em>, not by its shape.</li>
<li><strong>Insertion has only one possible place</strong> — compare with the root, go left or right, repeat, and hang the new node where you fall off the tree. There is never a choice, which is why the insertion <em>order</em> determines the shape.</li>
<li><strong>Where you meet BSTs in real software</strong> — <code>TreeMap</code> and <code>TreeSet</code> in the ADT figure of slide 22; database indexes (as B-trees, the multi-way cousin); and <code>ORDER BY</code> coming out cheaply because the index is already sorted.</li>
</ul>
<p class="nhan">The slide's third tree — 17 root, left 6 with children 3 and 14, right 19 — run through <code>trees.c</code> and <code>adt_bst.c</code>:</p>
<pre>preorder : 17 6 3 14 19
inorder  : 3 6 14 17 19    &lt;== TANG DAN
postorder: 3 14 6 19 17
inorder co tang dan khong? CO
chieu cao = 3
  tim 14: THAY  sau 3 buoc so sanh
  tim  3: THAY  sau 3 buoc so sanh
  tim 19: THAY  sau 2 buoc so sanh
  tim  7: KHONG sau 3 buoc so sanh</pre>
<p class="dap-an">✅ Answer to the key exam fact: <strong>an inorder traversal of a BST always produces the keys in increasing order.</strong> Verified above — 3, 6, 14, 17, 19. The reason is the definition itself: inorder visits <em>left subtree · root · right subtree</em>, and the BST property says exactly that everything in the left subtree is smaller than the root and everything in the right is larger. So "sort a set of numbers" can be done by inserting them all into a BST and reading it inorder. It also gives you a free correctness test: compute the inorder sequence, and if it is not increasing, the tree is not a BST.</p>
<p class="nhan">The counter-examples the slide does not give (<code>notbst.c</code>) — both look locally fine and both fail:</p>
<table>
<tr><th>Tree</th><th>Inorder</th><th>BST?</th><th>What broke</th></tr>
<tr><td>17 ( 6 (3, 14), 19 )</td><td>3 6 14 17 19</td><td><strong>yes</strong></td><td>—</td></tr>
<tr><td>17 ( 6 (–, 20), 19 )</td><td>6 <strong>20</strong> 17 19</td><td><strong>no</strong></td><td>20 &gt; 6 so it is on 6's correct side, but it sits in <em>17's left subtree</em> while being larger than 17</td></tr>
<tr><td>17 ( 6 (3, –), 19 (14, –) )</td><td>3 6 17 <strong>14</strong> 19</td><td><strong>no</strong></td><td>14 &lt; 19 locally, but it lives in 17's <em>right</em> subtree while being smaller than 17</td></tr>
</table>
<p class="nhan">And the reason "balanced" is not optional (<code>adt_bst.c</code>, 7 keys each time):</p>
<table>
<tr><th>Insertion order</th><th>Resulting height</th><th>Comparisons to find key 7</th><th>Shape</th></tr>
<tr><td>4, 2, 6, 1, 3, 5, 7</td><td><strong>3</strong></td><td><strong>3</strong></td><td>balanced — O(log n)</td></tr>
<tr><td>1, 2, 3, 4, 5, 6, 7</td><td><strong>7</strong></td><td><strong>7</strong></td><td>a straight chain — O(n), i.e. a linked list</td></tr>
</table>
<p class="dap-an">✅ Answer: inserting <em>already sorted</em> data into a plain BST destroys it — every new key is larger than everything before it, so it always goes right, and the tree degenerates into a linked list with pointers wasted on the unused left side. Note that the slide's own first example (17 → 6 → 3) is exactly such a degenerate chain. With 1 000 000 keys the difference is 20 comparisons versus 1 000 000. Real systems fix this with self-balancing trees (AVL, red–black), which is where DSA picks the story up.</p>
<p class="meo">💡 To test a BST in an exam in ten seconds: write out the inorder traversal and check it increases. It is faster and far more reliable than eyeballing each node, and it catches exactly the ancestor-bound violations that eyeballing misses.</p>
<p class="pitfall">⚠️ Two things. First, this slide too says "Figure 12.28" in the body while the caption reads "Figure 9.24" — Forouzan's original numbering left behind. Second, the slide shows three trees that are <em>all</em> BSTs and no counter-example, so it never exercises the "all nodes in the subtree" clause. That clause is precisely what the exam tests, using trees like the two in the table above.</p>`,
        `<p class="y-chinh">🎯 Một tính chất thêm vào là biến cây nhị phân thành cây tra cứu được. Trong <strong>cây tìm kiếm nhị phân (BST)</strong>, khoá của mọi nút <strong>lớn hơn mọi khoá trong cây con trái và nhỏ hơn mọi khoá trong cây con phải</strong> — hình vẽ ghi là <em>All &lt; K</em> bên trái và <em>All &gt; K</em> bên phải.</p>
<ul>
<li><strong>Hãy đọc thật kỹ chữ "mọi"</strong> — điều kiện nói về <em>MỌI nút trong TOÀN BỘ cây con</em>, không phải chỉ hai đứa con trực tiếp. Phân biệt ấy là điểm bị hỏi nhiều nhất về BST, và phản ví dụ bên dưới cho thấy vì sao.</li>
<li><strong>Tính chất ấy mua được gì</strong> — ở mỗi nút bạn so sánh một lần và vứt bỏ nguyên một cây con. Tìm, chèn, xoá đều thành O(chiều cao) thay vì O(n). Đây chính là phép tìm nhị phân của Chương 6 được đóng thành một cấu trúc dữ liệu mà lại còn lớn lên và co lại rẻ tiền.</li>
<li><strong>Ba cây ví dụ trên slide</strong> — (1) 17 có con trái 6, dưới 6 là 3: một chuỗi nghiêng trái. (2) 17 có con phải 19: chuỗi hai nút. (3) 17 có trái 6 (con 3 và 14) và phải 19: cây cân bằng. Cả ba đều thoả tính chất, và đó mới là ý: BST được định nghĩa bởi <em>THỨ TỰ</em> chứ không bởi hình dạng.</li>
<li><strong>Phép chèn chỉ có đúng một chỗ khả dĩ</strong> — so với gốc, rẽ trái hoặc phải, lặp lại, và treo nút mới vào chỗ bạn rơi ra khỏi cây. Không bao giờ có lựa chọn, nên <em>THỨ TỰ chèn</em> quyết định hình dạng.</li>
<li><strong>Gặp BST ở đâu trong phần mềm thật</strong> — <code>TreeMap</code> và <code>TreeSet</code> trong hình ADT của slide 22; chỉ mục cơ sở dữ liệu (dưới dạng B-tree, người anh em nhiều nhánh); và câu <code>ORDER BY</code> chạy rẻ vì chỉ mục vốn đã sắp sẵn.</li>
</ul>
<p class="nhan">Cây thứ ba của slide — gốc 17, trái 6 có con 3 và 14, phải 19 — chạy qua <code>trees.c</code> và <code>adt_bst.c</code>:</p>
<pre>preorder : 17 6 3 14 19
inorder  : 3 6 14 17 19    &lt;== TANG DAN
postorder: 3 14 6 19 17
inorder co tang dan khong? CO
chieu cao = 3
  tim 14: THAY  sau 3 buoc so sanh
  tim  3: THAY  sau 3 buoc so sanh
  tim 19: THAY  sau 2 buoc so sanh
  tim  7: KHONG sau 3 buoc so sanh</pre>
<p class="dap-an">✅ Đáp án cho dữ kiện mấu chốt của đề: <strong>duyệt inorder một BST luôn cho ra dãy khoá TĂNG DẦN.</strong> Đã nghiệm ở trên — 3, 6, 14, 17, 19. Lý do nằm ngay trong định nghĩa: inorder thăm <em>cây con trái · gốc · cây con phải</em>, mà tính chất BST nói đúng rằng mọi thứ ở cây con trái nhỏ hơn gốc và mọi thứ bên phải lớn hơn. Nên "sắp xếp một tập số" làm được bằng cách chèn hết vào một BST rồi đọc inorder. Nó còn cho bạn một phép kiểm đúng/sai miễn phí: tính dãy inorder, nếu nó không tăng dần thì cây ấy không phải BST.</p>
<p class="nhan">Những phản ví dụ mà slide không đưa ra (<code>notbst.c</code>) — cả hai đều nhìn cục bộ thì ổn và cả hai đều hỏng:</p>
<table>
<tr><th>Cây</th><th>Inorder</th><th>Là BST?</th><th>Hỏng ở đâu</th></tr>
<tr><td>17 ( 6 (3, 14), 19 )</td><td>3 6 14 17 19</td><td><strong>có</strong></td><td>—</td></tr>
<tr><td>17 ( 6 (–, 20), 19 )</td><td>6 <strong>20</strong> 17 19</td><td><strong>không</strong></td><td>20 &gt; 6 nên đứng đúng phía của 6, nhưng nó nằm trong <em>cây con TRÁI của 17</em> mà lại lớn hơn 17</td></tr>
<tr><td>17 ( 6 (3, –), 19 (14, –) )</td><td>3 6 17 <strong>14</strong> 19</td><td><strong>không</strong></td><td>14 &lt; 19 xét cục bộ thì đúng, nhưng nó sống trong cây con <em>PHẢI</em> của 17 mà lại nhỏ hơn 17</td></tr>
</table>
<p class="nhan">Và lý do "cân bằng" không phải chuyện tuỳ chọn (<code>adt_bst.c</code>, mỗi lần 7 khoá):</p>
<table>
<tr><th>Thứ tự chèn</th><th>Chiều cao thu được</th><th>Số phép so sánh để tìm khoá 7</th><th>Hình dạng</th></tr>
<tr><td>4, 2, 6, 1, 3, 5, 7</td><td><strong>3</strong></td><td><strong>3</strong></td><td>cân bằng — O(log n)</td></tr>
<tr><td>1, 2, 3, 4, 5, 6, 7</td><td><strong>7</strong></td><td><strong>7</strong></td><td>một chuỗi thẳng — O(n), tức là một danh sách liên kết</td></tr>
</table>
<p class="dap-an">✅ Đáp án: chèn dữ liệu <em>ĐÃ SẮP SẴN</em> vào một BST trần là phá nó — mỗi khoá mới đều lớn hơn mọi khoá trước, nên luôn rẽ phải, và cây suy biến thành danh sách liên kết với đống con trỏ trái bỏ không. Để ý chính ví dụ đầu tiên của slide (17 → 6 → 3) đúng là một chuỗi suy biến như vậy. Với 1.000.000 khoá thì khác biệt là 20 phép so sánh so với 1.000.000. Hệ thống thật chữa bằng cây tự cân bằng (AVL, đỏ–đen), và đó là chỗ môn DSA kể tiếp câu chuyện.</p>
<p class="meo">💡 Kiểm một cây có phải BST không trong phòng thi, mười giây: viết ra dãy inorder và xem nó có tăng dần không. Nhanh hơn và đáng tin hơn hẳn việc soi từng nút, và nó bắt đúng những vi phạm ràng buộc-tổ-tiên mà soi mắt hay bỏ sót.</p>
<p class="pitfall">⚠️ Hai điều. Thứ nhất, slide này cũng ghi "Figure 12.28" trong thân trong khi chú thích là "Figure 9.24" — số gốc của Forouzan còn sót lại. Thứ hai, slide đưa ba cây mà cả ba <em>đều</em> là BST, không có phản ví dụ nào, nên nó không hề rèn tới mệnh đề "mọi nút trong cây con". Mà mệnh đề ấy mới đúng là thứ đề thi kiểm, bằng những cây như hai cây trong bảng trên.</p>`],

      [36, '4. GRAPHS',
        `<p class="y-chinh">🎯 The most general structure of the chapter, defined by removing the tree's restriction: a <strong>graph</strong> is an ADT made of <strong>vertices</strong> and <strong>edges</strong> where — unlike a tree — <strong>each node may have one or more parents</strong>. Graphs are <strong>directed</strong> (each edge has an arrowhead) or <strong>undirected</strong>.</p>
<ul>
<li><strong>Tree versus graph, stated precisely</strong> — the slide's own contrast: a tree is a <em>hierarchy</em> with one parent per node; a graph allows many. Consequences: a graph may contain <em>cycles</em>, may be <em>disconnected</em>, and has no root and no leaves. Every tree is a graph; almost no graph is a tree.</li>
<li><strong>The vocabulary swaps</strong> — a tree has nodes and arcs, a graph has <em>vertices</em> and <em>edges</em>. Slide 31 already warned you that "node" and "vertex" are the same thing; here the textbook prefers vertex.</li>
<li><strong>Read the figure</strong> — both halves show the same six vertices A…F and the same eight connections. In (a) each connection carries an arrowhead (A→B, A→E, B→E, B→C, C→D, C→E, E→D, E→F); in (b) the arrowheads are gone and the lines are simply two-way. Same skeleton, different meaning.</li>
<li><strong>Directed versus undirected is a modelling decision</strong> — a one-way street system, a Twitter follow, or a web hyperlink are directed; a road that runs both ways, a Facebook friendship, or a chemical bond are undirected. Get it wrong and every later algorithm answers the wrong question.</li>
<li><strong>Degree</strong> — in an undirected graph, the degree of a vertex is the number of edges touching it. In the figure's undirected half: A 2, B 3, C 3, D 2, E 5, F 1, summing to 16 = 2 × 8 edges. That identity (the <em>handshake theorem</em>) holds for every undirected graph and is a free check on your own drawing. A directed graph splits it into <em>in-degree</em> and <em>out-degree</em>.</li>
</ul>
<p class="nhan">The two standard representations, with the memory cost computed for real (<code>graphmem.c</code>, V = 1000 vertices, E = 5000 undirected edges, 64-bit machine):</p>
<table>
<tr><th>Representation</th><th>How it stores an edge</th><th>Memory measured</th><th>"Is A–B an edge?"</th><th>"List A's neighbours"</th></tr>
<tr><td>Adjacency matrix, <code>int</code></td><td><code>M[i][j] = 1</code></td><td>1 000 000 cells = <strong>3,81 MiB</strong></td><td><strong>O(1)</strong></td><td>O(V) = 1 000 reads</td></tr>
<tr><td>Adjacency matrix, <code>char</code></td><td>one byte per cell</td><td><strong>976,6 KiB</strong></td><td>O(1)</td><td>O(V)</td></tr>
<tr><td>Adjacency matrix, bits</td><td>one bit per cell</td><td><strong>122,1 KiB</strong></td><td>O(1)</td><td>O(V)</td></tr>
<tr><td><strong>Adjacency list</strong></td><td>a linked node per direction</td><td>10 000 nodes × 16 B + 1000 heads × 8 B = <strong>164,1 KiB</strong></td><td>O(degree)</td><td><strong>O(degree)</strong></td></tr>
</table>
<p class="dap-an">✅ Answer to "which representation should I choose?" — measured, not guessed. For this graph the <code>int</code> matrix costs <strong>23,8×</strong> the adjacency list, and even the one-byte matrix costs <strong>5,95×</strong>. Traversing every vertex's neighbours costs V² = 1 000 000 reads with the matrix versus V + 2E = 11 000 with the list — <strong>91× faster</strong>. The break-even measured by the program is at about <strong>31 000 edges</strong>, i.e. a density of roughly <strong>6,2 %</strong> of the 499 500 possible edges. Rule: <strong>sparse graph (E ≪ V²) → adjacency list; dense graph (E close to V²/2) → adjacency matrix</strong>. A road network, a social network and the web are all extremely sparse, so lists win in practice almost always; the matrix wins when you need constant-time "is there an edge?" answers.</p>
<p class="meo">💡 The 5000-edge graph above stores 10 000 list nodes, not 5000 — an undirected edge appears in the list of <em>both</em> its endpoints. Forgetting that halves every memory estimate you make. A directed graph stores each edge once.</p>
<p class="pitfall">⚠️ Body text says "Figure 12.32" while the caption says "Figure 9.25" — the same leftover numbering as slides 32 and 35. And a conceptual trap: "each node in a graph can have one or more parents" is the slide's phrasing, but a graph has no parents at all in the tree sense — there is no root to measure from. Read that sentence as "the one-parent restriction is lifted", not as "graphs have parents".</p>`,
        `<p class="y-chinh">🎯 Cấu trúc tổng quát nhất của chương, định nghĩa bằng cách GỠ BỎ ràng buộc của cây: <strong>đồ thị</strong> là một ADT gồm các <strong>đỉnh</strong> và các <strong>cạnh</strong>, mà — khác với cây — <strong>mỗi nút có thể có một hoặc nhiều cha</strong>. Đồ thị có thể <strong>có hướng</strong> (mỗi cạnh mang một đầu mũi tên) hoặc <strong>vô hướng</strong>.</p>
<ul>
<li><strong>Cây so với đồ thị, phát biểu cho chuẩn</strong> — chính sự tương phản của slide: cây là một <em>phân cấp</em> với mỗi nút một cha; đồ thị cho phép nhiều cha. Hệ quả: đồ thị có thể chứa <em>chu trình</em>, có thể <em>không liên thông</em>, và không có gốc cũng không có lá. Mọi cây đều là đồ thị; gần như không đồ thị nào là cây.</li>
<li><strong>Từ vựng đổi chỗ</strong> — cây có nút và cung, đồ thị có <em>đỉnh</em> và <em>cạnh</em>. Slide 31 đã dặn "nút" và "đỉnh" là một; ở đây giáo trình thích chữ đỉnh hơn.</li>
<li><strong>Đọc hình</strong> — hai nửa đều vẽ đúng sáu đỉnh A…F và đúng tám nối kết. Ở (a) mỗi nối kết mang đầu mũi tên (A→B, A→E, B→E, B→C, C→D, C→E, E→D, E→F); ở (b) mũi tên biến mất và các đường đơn giản là hai chiều. Cùng bộ xương, khác ý nghĩa.</li>
<li><strong>Có hướng hay vô hướng là một quyết định MÔ HÌNH HOÁ</strong> — hệ thống đường một chiều, việc theo dõi trên Twitter, hay siêu liên kết web là có hướng; con đường đi được hai chiều, quan hệ bạn bè Facebook, hay liên kết hoá học là vô hướng. Chọn sai thì mọi thuật toán về sau trả lời sai câu hỏi.</li>
<li><strong>Bậc</strong> — trong đồ thị vô hướng, bậc của một đỉnh là số cạnh chạm vào nó. Ở nửa vô hướng của hình: A 2, B 3, C 3, D 2, E 5, F 1, tổng bằng 16 = 2 × 8 cạnh. Đẳng thức ấy (<em>định lý bắt tay</em>) đúng với mọi đồ thị vô hướng và là phép kiểm miễn phí cho hình bạn tự vẽ. Đồ thị có hướng thì tách thành <em>bậc vào</em> và <em>bậc ra</em>.</li>
</ul>
<p class="nhan">Hai cách biểu diễn chuẩn, kèm chi phí bộ nhớ TÍNH THẬT (<code>graphmem.c</code>, V = 1000 đỉnh, E = 5000 cạnh vô hướng, máy 64 bit):</p>
<table>
<tr><th>Cách biểu diễn</th><th>Lưu một cạnh thế nào</th><th>Bộ nhớ đo được</th><th>"A–B có cạnh không?"</th><th>"Liệt kê hàng xóm của A"</th></tr>
<tr><td>Ma trận kề, kiểu <code>int</code></td><td><code>M[i][j] = 1</code></td><td>1.000.000 ô = <strong>3,81 MiB</strong></td><td><strong>O(1)</strong></td><td>O(V) = 1.000 phép đọc</td></tr>
<tr><td>Ma trận kề, kiểu <code>char</code></td><td>một byte mỗi ô</td><td><strong>976,6 KiB</strong></td><td>O(1)</td><td>O(V)</td></tr>
<tr><td>Ma trận kề, dạng bit</td><td>một bit mỗi ô</td><td><strong>122,1 KiB</strong></td><td>O(1)</td><td>O(V)</td></tr>
<tr><td><strong>Danh sách kề</strong></td><td>một nút liên kết cho mỗi chiều</td><td>10.000 nút × 16 B + 1000 ô đầu × 8 B = <strong>164,1 KiB</strong></td><td>O(bậc)</td><td><strong>O(bậc)</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án cho câu "nên chọn cách nào?" — ĐO chứ không đoán. Với đồ thị này, ma trận <code>int</code> tốn <strong>23,8 lần</strong> danh sách kề, và ngay cả ma trận một byte cũng tốn <strong>5,95 lần</strong>. Duyệt hết hàng xóm của mọi đỉnh tốn V² = 1.000.000 phép đọc với ma trận so với V + 2E = 11.000 với danh sách — <strong>nhanh gấp 91 lần</strong>. Điểm hoà vốn mà chương trình đo được nằm ở khoảng <strong>31.000 cạnh</strong>, tức mật độ chừng <strong>6,2 %</strong> trong số 499.500 cạnh khả dĩ. Luật: <strong>đồ thị thưa (E ≪ V²) → danh sách kề; đồ thị dày (E gần V²/2) → ma trận kề</strong>. Mạng đường bộ, mạng xã hội và web đều cực kỳ thưa, nên trong thực tế danh sách kề gần như luôn thắng; ma trận thắng khi bạn cần trả lời "có cạnh không?" trong thời gian hằng số.</p>
<p class="meo">💡 Đồ thị 5000 cạnh ở trên lưu 10.000 nút danh sách chứ không phải 5000 — một cạnh vô hướng xuất hiện trong danh sách của <em>CẢ HAI</em> đầu mút. Quên chỗ này là mọi ước lượng bộ nhớ của bạn bị chia đôi. Đồ thị có hướng thì mỗi cạnh chỉ lưu một lần.</p>
<p class="pitfall">⚠️ Thân slide ghi "Figure 12.32" trong khi chú thích ghi "Figure 9.25" — cùng kiểu số sót lại như slide 32 và 35. Và một bẫy khái niệm: "mỗi nút trong đồ thị có thể có một hoặc nhiều cha" là cách slide diễn đạt, nhưng đồ thị không hề có "cha" theo nghĩa của cây — không có gốc nào để đo từ đó. Hãy đọc câu ấy là "ràng buộc một-cha bị gỡ bỏ", đừng đọc thành "đồ thị có cha".</p>`],

      [37, 'Example — a weighted graph',
        `<p class="y-chinh">🎯 The chapter closes by putting the abstraction back into the world: model a <strong>transportation network</strong> with vertices as facilities and edges as roads, then add a <strong>weight</strong> to each edge for the distance between the two cities it connects.</p>
<ul>
<li><strong>What a weight adds</strong> — an unweighted graph answers "is there a route?"; a weighted one answers "what is the <em>cheapest</em> route?". The weight need not be distance: it can be travel time, price, bandwidth, or risk. Same structure, different question.</li>
<li><strong>Read the figure</strong> — the left half draws four real places (a warehouse, a factory, a shop, a restaurant) numbered 0, 1, 2, 3; the right half strips the pictures away and keeps only vertices and weighted edges: 1–0 = 5, 3–1 = 2, 1–2 = 9, 2–0 = 8, 3–2 = 6. Five edges, four vertices, undirected.</li>
<li><strong>That stripping-away IS the modelling step</strong> — the warehouse building is irrelevant; only "which places connect, and at what cost" survives. Every algorithm downstream works on the right half and never looks at the left.</li>
<li><strong>Weights in a representation</strong> — the adjacency matrix simply stores the weight instead of 1, with a sentinel (∞ or 0) for "no edge"; the adjacency list stores the weight in each node next to the neighbour's id. Both extensions are trivial, which is another reason graphs are used so widely.</li>
<li><strong>The algorithms this opens</strong> — shortest path (Dijkstra, 1956), minimum spanning tree (Kruskal, Prim), maximum flow, and the travelling salesman problem. CSI106 only asks you to build the model; DSA and CSD solve it.</li>
</ul>
<p class="nhan">The graph read off the figure and computed for real (<code>g37.c</code>, adjacency matrix + Floyd–Warshall, <code>cc -Wall</code>). Weighted adjacency matrix, "." = no edge:</p>
<pre>          0     1     2     3
   0      0     5     8     .
   1      5     0     9     2
   2      8     9     0     6
   3      .     2     6     0</pre>
<p class="nhan">Shortest distance between every pair:</p>
<pre>          0     1     2     3
   0      0     5     8     7
   1      5     0     8     2
   2      8     8     0     6
   3      7     2     6     0</pre>
<p class="dap-an">✅ Two answers worth the exam marks. <strong>(1) Vertex 3 to vertex 0.</strong> There is no direct edge. Route 3–2–0 costs 6 + 8 = 14; route 3–1–0 costs 2 + 5 = <strong>7</strong>; route 3–1–2–0 costs 2 + 9 + 8 = 19. The shortest is <strong>7 via vertex 1</strong>, confirmed by the computed matrix. <strong>(2) Vertex 1 to vertex 2 — the trap.</strong> There <em>is</em> a direct edge of weight 9, so the obvious answer is 9. But the route 1–3–2 costs 2 + 6 = <strong>8</strong>. <em>A direct edge is not necessarily the shortest path.</em> Also check the handshake theorem: degrees are 2, 3, 3, 2, summing to 10 = 2 × 5 edges. ✔</p>
<p class="nhan">Where each structure of this chapter ends up in the real world:</p>
<table>
<tr><th>Structure</th><th>Real system</th><th>What it stores</th></tr>
<tr><td>Array</td><td>an image in memory</td><td>pixels, indexed by row and column</td></tr>
<tr><td>Linked list</td><td>free-memory list of an allocator</td><td>blocks that appear and vanish constantly</td></tr>
<tr><td>Stack</td><td>the call stack; the Undo button</td><td>what must be reversed</td></tr>
<tr><td>Queue</td><td>print spooler; CPU ready queue (Ch.5)</td><td>what must stay fair</td></tr>
<tr><td>Tree</td><td>file system (Ch.10); DOM; database index</td><td>what belongs to exactly one parent</td></tr>
<tr><td>Graph</td><td>Google Maps; the Internet (Ch.4); a social network</td><td>what connects to many things at once</td></tr>
</table>
<p class="meo">💡 The practical test for choosing a structure is a single question about your data: <em>how does one item relate to the others?</em> One after another → list. Only the newest matters → stack. Only the oldest matters → queue. Exactly one owner → tree. Anything connects to anything → graph. Answer that and the structure has chosen itself.</p>
<p class="pitfall">⚠️ Two final traps. First, a weighted edge's number is a <em>label</em>, not a count of edges — a weight of 9 does not mean nine roads. Second, weights are not automatically symmetric even in an undirected drawing: uphill and downhill take different times, so a real routing model often needs a <em>directed</em> graph with two different weights between the same pair of cities. The slide's figure assumes symmetry because distance is symmetric; time and cost usually are not.</p>`,
        `<p class="y-chinh">🎯 Chương khép lại bằng cách đưa cái trừu tượng trở về đời thật: mô hình hoá một <strong>mạng vận tải</strong> với đỉnh là các cơ sở và cạnh là các con đường, rồi gắn cho mỗi cạnh một <strong>trọng số</strong> là khoảng cách giữa hai thành phố mà nó nối.</p>
<ul>
<li><strong>Trọng số thêm được gì</strong> — đồ thị không trọng số trả lời "có đường đi không?"; đồ thị có trọng số trả lời "đường đi <em>RẺ NHẤT</em> là đường nào?". Trọng số không nhất thiết là khoảng cách: nó có thể là thời gian, tiền, băng thông, hay mức rủi ro. Cùng một cấu trúc, khác câu hỏi.</li>
<li><strong>Đọc hình</strong> — nửa trái vẽ bốn địa điểm thật (kho hàng, nhà máy, cửa hàng, nhà hàng) đánh số 0, 1, 2, 3; nửa phải lột bỏ hết hình ảnh và chỉ giữ lại đỉnh cùng cạnh có trọng số: 1–0 = 5, 3–1 = 2, 1–2 = 9, 2–0 = 8, 3–2 = 6. Năm cạnh, bốn đỉnh, vô hướng.</li>
<li><strong>Chính cái LỘT BỎ ấy là bước mô hình hoá</strong> — toà nhà kho hàng không liên quan; chỉ "những chỗ nào nối với nhau, và với chi phí bao nhiêu" là sống sót. Mọi thuật toán phía sau làm việc trên nửa phải và không bao giờ ngó sang nửa trái.</li>
<li><strong>Trọng số trong cách biểu diễn</strong> — ma trận kề chỉ việc lưu trọng số thay cho số 1, với một giá trị canh (∞ hoặc 0) nghĩa là "không có cạnh"; danh sách kề lưu trọng số ngay trong mỗi nút, cạnh mã của đỉnh hàng xóm. Cả hai cách mở rộng đều tầm thường, và đó là thêm một lý do đồ thị được dùng rộng rãi đến thế.</li>
<li><strong>Nó mở ra những thuật toán nào</strong> — đường đi ngắn nhất (Dijkstra, 1956), cây khung nhỏ nhất (Kruskal, Prim), luồng cực đại, và bài toán người bán hàng. CSI106 chỉ đòi bạn dựng được mô hình; DSA và CSD mới đi giải.</li>
</ul>
<p class="nhan">Đồ thị đọc từ hình và tính thật (<code>g37.c</code>, ma trận kề + Floyd–Warshall, <code>cc -Wall</code>). Ma trận kề có trọng số, "." = không có cạnh:</p>
<pre>          0     1     2     3
   0      0     5     8     .
   1      5     0     9     2
   2      8     9     0     6
   3      .     2     6     0</pre>
<p class="nhan">Khoảng cách NGẮN NHẤT giữa mọi cặp:</p>
<pre>          0     1     2     3
   0      0     5     8     7
   1      5     0     8     2
   2      8     8     0     6
   3      7     2     6     0</pre>
<p class="dap-an">✅ Hai đáp án đáng điểm thi. <strong>(1) Từ đỉnh 3 tới đỉnh 0.</strong> Không có cạnh trực tiếp. Đường 3–2–0 tốn 6 + 8 = 14; đường 3–1–0 tốn 2 + 5 = <strong>7</strong>; đường 3–1–2–0 tốn 2 + 9 + 8 = 19. Ngắn nhất là <strong>7, đi qua đỉnh 1</strong>, đúng như ma trận tính ra. <strong>(2) Từ đỉnh 1 tới đỉnh 2 — cái bẫy.</strong> Ở đây <em>CÓ</em> cạnh trực tiếp trọng số 9, nên đáp án hiển nhiên là 9. Nhưng đường 1–3–2 tốn 2 + 6 = <strong>8</strong>. <em>Cạnh trực tiếp không nhất thiết là đường đi ngắn nhất.</em> Kiểm thêm định lý bắt tay: bậc các đỉnh là 2, 3, 3, 2, tổng bằng 10 = 2 × 5 cạnh. ✔</p>
<p class="nhan">Mỗi cấu trúc của chương này rốt cuộc nằm ở đâu trong thế giới thật:</p>
<table>
<tr><th>Cấu trúc</th><th>Hệ thống thật</th><th>Nó lưu cái gì</th></tr>
<tr><td>Mảng</td><td>một bức ảnh trong bộ nhớ</td><td>các điểm ảnh, đánh chỉ số theo hàng và cột</td></tr>
<tr><td>Danh sách liên kết</td><td>danh sách vùng nhớ trống của bộ cấp phát</td><td>các khối liên tục sinh ra rồi biến mất</td></tr>
<tr><td>Stack</td><td>ngăn xếp lời gọi hàm; nút Undo</td><td>thứ cần được đảo ngược</td></tr>
<tr><td>Queue</td><td>bộ đệm in; hàng đợi sẵn sàng của CPU (Ch.5)</td><td>thứ cần được công bằng</td></tr>
<tr><td>Cây</td><td>hệ thống tệp (Ch.10); cây DOM; chỉ mục CSDL</td><td>thứ thuộc về đúng một cha</td></tr>
<tr><td>Đồ thị</td><td>Google Maps; Internet (Ch.4); mạng xã hội</td><td>thứ nối với nhiều thứ cùng lúc</td></tr>
</table>
<p class="meo">💡 Phép thử thực dụng để chọn cấu trúc gói trong một câu hỏi về dữ liệu của bạn: <em>một phần tử quan hệ với các phần tử khác như thế nào?</em> Cái này nối tiếp cái kia → danh sách. Chỉ cái mới nhất quan trọng → stack. Chỉ cái cũ nhất quan trọng → queue. Có đúng một chủ sở hữu → cây. Cái gì cũng nối được với cái gì → đồ thị. Trả lời xong câu ấy là cấu trúc đã tự chọn nó rồi.</p>
<p class="pitfall">⚠️ Hai bẫy cuối. Thứ nhất, con số trên cạnh có trọng số là một <em>NHÃN</em>, không phải số lượng cạnh — trọng số 9 không có nghĩa là chín con đường. Thứ hai, trọng số không tự động đối xứng ngay cả khi hình vẽ là vô hướng: lên dốc và xuống dốc mất thời gian khác nhau, nên mô hình định tuyến thật thường cần đồ thị <em>CÓ HƯỚNG</em> với hai trọng số khác nhau giữa cùng một cặp thành phố. Hình của slide giả định đối xứng vì khoảng cách vốn đối xứng; thời gian và chi phí thì thường không.</p>`],
    ]),
  ].join('\n'),
};
