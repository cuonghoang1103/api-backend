/** 5.3 — Cây nhị phân tìm kiếm (BST). Mọi mã/output đọc từ ../ma/ch05 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet } from '../_chung.mjs';
import { oCay, oDay } from './_rieng.mjs';
import { vetValidBst } from '../ma/ch05/valid-bst.vet.mjs';
import { vetKth } from '../ma/ch05/kth.vet.mjs';

const TRAP = [5, 4, 6, null, null, 3, 7];
const vV = vetValidBst(TRAP);
const hien = (x, vo) => (x === null ? vo : String(x));
const BANG_V = bangVet(['#', 'node', 'came from', 'allowed range (lo, hi)', 'call path', 'check'],
  vV.rows.map((h, k) => [
    String(k + 1),
    `<strong>${h.node}</strong>`,
    h.side,
    `(${hien(h.lo, '−∞')}, ${hien(h.hi, '+∞')})`,
    oDay(h.path, { to: { [h.path.length - 1]: h.pass ? 'l' : 'x' } }),
    h.pass ? '✓ inside' : `✗ ${h.node} ≤ ${h.lo} ⇒ <strong>false</strong>`,
  ]));

const KTREE = [5, 3, 6, 2, 4, null, null, 1];
const vK = vetKth(KTREE, 3);
const BANG_K = bangVet(['#', 'action', 'stack (bottom → top)', 'k left'],
  vK.rows.map((h, i) => [
    String(i + 1),
    h.kind === 'push' ? `push ${h.v}, go left` : `<strong>pop ${h.v}</strong>${h.k === 0 ? ' ⇒ answer' : ', go right'}`,
    oDay(h.stack),
    h.kind === 'pop' ? (h.k === 0 ? '<strong>0</strong> ✅' : String(h.k)) : String(h.k),
  ]));

const DE = [
  [lc(700, 'search-in-a-binary-search-tree', 'Search in a Binary Search Tree', 'Easy'), 'One path down: smaller left, larger right. O(h), no recursion needed.', 'Một đường đi xuống: nhỏ hơn sang trái, lớn hơn sang phải. O(h), không cần đệ quy.'],
  [lc(530, 'minimum-absolute-difference-in-bst', 'Minimum Absolute Difference in BST', 'Easy'), 'In-order is sorted, so the answer is between neighbours: keep prev.', 'In-order đã sắp xếp nên đáp án nằm giữa hai phần tử kề nhau: giữ prev.'],
  [lc(108, 'convert-sorted-array-to-binary-search-tree', 'Convert Sorted Array to Binary Search Tree', 'Easy'), 'Middle element = root, recurse on both halves ⇒ balanced.', 'Phần tử giữa làm gốc, đệ quy hai nửa ⇒ cân bằng.'],
  [lc(98, 'validate-binary-search-tree', 'Validate Binary Search Tree', 'Medium'), 'Pass (lo, hi) down from ALL ancestors, or check in-order is strictly increasing.', 'Truyền (lo, hi) từ MỌI tổ tiên xuống, hoặc kiểm in-order tăng nghiêm ngặt.'],
  [lc(230, 'kth-smallest-element-in-a-bst', 'Kth Smallest Element in a BST', 'Medium'), 'Iterative in-order, stop after k pops.', 'In-order bản lặp, dừng sau k lần lấy ra.'],
  [lc(235, 'lowest-common-ancestor-of-a-binary-search-tree', 'Lowest Common Ancestor of a Binary Search Tree', 'Medium'), 'Walk down while p and q are on the same side; the split point is the answer.', 'Đi xuống khi p và q cùng một phía; điểm tách đôi là đáp án.'],
  [lc(701, 'insert-into-a-binary-search-tree', 'Insert into a Binary Search Tree', 'Medium'), 'Recurse to the empty spot; return the subtree root so parents reattach.', 'Đệ quy tới chỗ trống; trả gốc cây con để cha gắn lại.'],
  [lc(450, 'delete-node-in-a-bst', 'Delete Node in a BST', 'Medium'), 'Three cases; two children ⇒ copy the in-order successor, delete it below.', 'Ba trường hợp; hai con ⇒ chép phần tử kế tiếp in-order lên, xoá nó ở dưới.'],
  [lc(173, 'binary-search-tree-iterator', 'Binary Search Tree Iterator', 'Medium'), 'The iterative in-order, cut into next() calls; O(h) memory, amortised O(1).', 'In-order bản lặp cắt thành từng lời gọi next(); bộ nhớ O(h), khấu hao O(1).'],
  [lc(1382, 'balance-a-binary-search-tree', 'Balance a Binary Search Tree', 'Medium'), 'In-order to a sorted array, then LC 108. The cure for the degenerate tree measured below.', 'In-order ra mảng đã sắp xếp, rồi LC 108. Thuốc chữa cây suy biến đo ở dưới.'],
];

export default {
  title: '5.3 — Binary search trees: validate, k-th smallest, LCA, insert and delete|||5.3 — Cây nhị phân tìm kiếm: kiểm hợp lệ, nhỏ thứ k, LCA, chèn và xoá',
  slug: 'dsa-5-3-bst',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bất biến BST nói cho đúng, kiểm hợp lệ bằng khoảng (lo, hi), nhỏ thứ k bằng in-order dừng sớm, LCA, chèn/xoá ba trường hợp — và đo thật cây suy biến khi chèn dữ liệu đã sắp xếp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Binary search trees: validate, k-th smallest, LCA, insert and delete</h2>
<p class="lead">A binary search tree is binary search (Chapter 4) frozen into a data structure: at every node you know which half to throw away. That gives you search, insert and delete in O(h) — and it gives interviewers a favourite way to check whether you know a definition <em>precisely</em>. Half the candidates who fail "Validate BST" know what a BST is; they just say the rule one level too shallow. This lesson states the rule correctly, turns it into four problems, and then measures the case nobody mentions in class: what sorted input does to a plain BST.</p>

<h3>The everyday picture: the library shelf and the guessing game</h3>
<p>Remember the guessing game from Chapter 4: "I am thinking of a number from 1 to 100" — you say 50, I say "smaller", you never look at 51–100 again. Now imagine that every question you could ask is pre-written on a signpost: the first post says 50; behind it the path splits into "smaller" (a post that says 25) and "larger" (a post that says 75), and so on. That forest of signposts is a BST. A library does the same with call numbers: at each shelf, smaller codes are to the left, larger to the right, so you never search the whole library.</p>
<p>The precise definition: a binary tree is a <strong>binary search tree</strong> if for <em>every</em> node, <strong>every</strong> key in its left subtree is smaller than the node’s key and <strong>every</strong> key in its right subtree is larger (LeetCode’s version uses strict inequalities, so duplicates are not allowed). Two consequences carry this whole lesson:</p>
<ul>
<li><strong>In-order traversal visits the keys in increasing order.</strong> Left subtree (all smaller), node, right subtree (all larger) — recursively.</li>
<li><strong>Search, insert and delete follow one path from the root.</strong> They cost O(h), the height: about log₂ n if the tree is balanced, n if it is not.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Cây nhị phân tìm kiếm: kiểm hợp lệ, nhỏ thứ k, LCA, chèn và xoá</h2>
<p class="lead">Cây nhị phân tìm kiếm (binary search tree — BST) là tìm kiếm nhị phân (Chương 4) được "đóng băng" thành một cấu trúc dữ liệu: ở mỗi nút bạn biết nửa nào được vứt đi. Nhờ đó tìm, chèn, xoá chỉ tốn O(h) — và nó cho người phỏng vấn một cách quen thuộc để kiểm xem bạn có nắm định nghĩa <em>chính xác</em> không. Một nửa số ứng viên trượt đề "Validate BST" vẫn biết BST là gì; họ chỉ phát biểu luật nông đi một tầng. Bài này phát biểu luật cho đúng, biến nó thành bốn đề, rồi đo cái trường hợp không ai nhắc trên lớp: dữ liệu đã sắp xếp làm gì với một BST trơn.</p>

<h3>Hình dung đời thường: kệ sách thư viện và trò đoán số</h3>
<p>Nhớ trò đoán số ở Chương 4: "Tôi nghĩ một số từ 1 tới 100" — bạn nói 50, tôi bảo "nhỏ hơn", bạn không bao giờ nhìn lại 51–100 nữa. Giờ tưởng tượng mọi câu hỏi bạn có thể hỏi đều được viết sẵn lên cột biển báo: cột đầu ghi 50; sau nó đường rẽ đôi thành "nhỏ hơn" (cột ghi 25) và "lớn hơn" (cột ghi 75), cứ thế. Khu rừng biển báo ấy là một BST. Thư viện làm y như vậy với mã xếp giá: ở mỗi kệ, mã nhỏ hơn nằm bên trái, lớn hơn bên phải, nên bạn không bao giờ phải lục cả thư viện.</p>
<p>Định nghĩa chính xác: một cây nhị phân là <strong>cây nhị phân tìm kiếm</strong> nếu với <em>mọi</em> nút, <strong>mọi</strong> khoá trong cây con trái nhỏ hơn khoá của nút và <strong>mọi</strong> khoá trong cây con phải lớn hơn (bản của LeetCode dùng bất đẳng thức nghiêm ngặt, nên không cho trùng). Hai hệ quả gánh cả bài này:</p>
<ul>
<li><strong>Duyệt in-order đi qua các khoá theo thứ tự tăng dần.</strong> Cây con trái (toàn nhỏ hơn), nút, cây con phải (toàn lớn hơn) — đệ quy.</li>
<li><strong>Tìm, chèn, xoá chỉ đi một đường từ gốc.</strong> Tốn O(h), với h là chiều cao: khoảng log₂ n nếu cây cân bằng, n nếu không.</li>
</ul>
${csd('csd201-bst', 'vi', '4.4 Cây nhị phân tìm kiếm (BST)', '<p>Ở CSD201 bạn đã cài BST bằng Java: tìm, chèn, duyệt, tìm min/max, và thấy in-order cho dãy tăng. Ôn nhanh một câu: nhỏ hơn đi trái, lớn hơn đi phải, mọi thao tác O(h). <strong>Ở đây đi sâu thêm:</strong> phát biểu bất biến ở mức "mọi tổ tiên" (thứ làm trượt đề Validate BST), các bản lặp dừng sớm, và số đo thật của cây suy biến.</p>')}
${csd('csd201-bst-chen-xoa', 'vi', '4.5 BST: chèn & ba trường hợp xoá', '<p>Bài CSD201 đã đi qua ba trường hợp xoá (lá, một con, hai con) bằng hình vẽ. Ở đây ta viết lại cả ba trong một hàm đệ quy "trả về gốc cây con mới" — đúng hình dạng LeetCode 450 đòi — và chạy thật trên năm khoá.</p>')}
</div>

<div class="ml-en">
<h3>Signals</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">the word "BST" in the problem</span><span class="v">You may use the ordering: in-order is sorted, and every comparison tells you which side to skip. A solution that ignores it (treats it as a plain binary tree) usually works but misses the O(h) the interviewer wants.</span></div>
  <div class="kv"><span class="k">"k-th smallest / largest", "closest value", "min difference"</span><span class="v">In-order (or reverse in-order), stop early.</span></div>
  <div class="kv"><span class="k">"valid", "is it a BST", "recover a BST with two swapped nodes"</span><span class="v">Range (lo, hi) passed down, or in-order with a <code>prev</code>.</span></div>
  <div class="kv"><span class="k">"lowest common ancestor" + BST</span><span class="v">Walk down; the first node where p and q split is the answer. Without BST ⇒ LC 236, a post-order (lesson 5.5).</span></div>
  <div class="kv"><span class="k">"design" with sorted queries: next booking after t, floor/ceiling, range count</span><span class="v">A balanced BST: Java <code>TreeMap</code>/<code>TreeSet</code>. JavaScript has none built in — say so, and offer a sorted array + binary search.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">đề có chữ "BST"</span><span class="v">Được dùng thứ tự: in-order đã sắp xếp, mỗi phép so sánh cho biết bỏ phía nào. Lời giải bỏ qua điều đó (coi như cây nhị phân thường) thường vẫn đúng nhưng hụt cái O(h) người phỏng vấn muốn nghe.</span></div>
  <div class="kv"><span class="k">"nhỏ / lớn thứ k", "giá trị gần nhất", "hiệu nhỏ nhất"</span><span class="v">In-order (hoặc in-order ngược), dừng sớm.</span></div>
  <div class="kv"><span class="k">"hợp lệ", "có phải BST", "khôi phục BST bị đổi chỗ hai nút"</span><span class="v">Khoảng (lo, hi) truyền xuống, hoặc in-order kèm <code>prev</code>.</span></div>
  <div class="kv"><span class="k">"tổ tiên chung thấp nhất" (LCA) + BST</span><span class="v">Đi xuống; nút đầu tiên nơi p và q tách hai phía là đáp án. Không phải BST ⇒ LC 236, một bài post-order (bài 5.5).</span></div>
  <div class="kv"><span class="k">"thiết kế" có truy vấn theo thứ tự: lịch đặt kế tiếp sau t, floor/ceiling, đếm trong khoảng</span><span class="v">BST cân bằng: <code>TreeMap</code>/<code>TreeSet</code> của Java. JavaScript không có sẵn — nói thẳng ra, và đề nghị mảng sắp xếp + tìm nhị phân.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Validate Binary Search Tree</h3>
<p><strong>Problem (in our words).</strong> Given a binary tree, decide whether it is a valid BST in the strict sense above.</p>
<p><strong>Step 1 — the answer most people write first.</strong> "At every node, check that the left child is smaller and the right child is larger, then recurse." It reads like the definition. It is not the definition: it only compares a node with its <em>parent</em>. Look at <code>[5,4,6,null,null,3,7]</code> below — every parent–child pair is in order (4 &lt; 5 &lt; 6, 3 &lt; 6 &lt; 7), yet 3 lives in the <em>right</em> subtree of 5, so it must be larger than 5. It is not.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Validate Binary Search Tree</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho một cây nhị phân, xác định nó có phải BST hợp lệ theo nghĩa nghiêm ngặt ở trên không.</p>
<p><strong>Bước 1 — đáp án đa số người viết đầu tiên.</strong> "Ở mỗi nút, kiểm con trái nhỏ hơn và con phải lớn hơn, rồi đệ quy." Đọc lên giống định nghĩa. Nó không phải định nghĩa: nó chỉ so một nút với <em>cha</em> của nó. Nhìn <code>[5,4,6,null,null,3,7]</code> dưới đây — mọi cặp cha–con đều đúng thứ tự (4 &lt; 5 &lt; 6, 3 &lt; 6 &lt; 7), vậy mà 3 nằm trong cây con <em>phải</em> của 5, nên nó phải lớn hơn 5. Nó không lớn hơn.</p>
</div>
${oCay(TRAP, { to: { 3: 'x', 5: 'l' } })}
${ma('ch05/valid-bst.ts', { vung: 'sai', nhan: 'TypeScript — wrong (children only)' })}
<div class="ml-en">
<p><strong>Step 2 — say the rule at the right depth.</strong> A node is constrained by <em>all</em> its ancestors, not just its parent. Going down to the left of a node with key x adds "must be &lt; x"; going right adds "must be &gt; x". Those constraints accumulate into one open interval <code>(lo, hi)</code>, and that interval is exactly what to pass down — this is top-down recursion from lesson 5.2. Start with no bounds at all.</p>
<p><strong>Step 3 — or use the consequence.</strong> The tree is a BST if and only if its in-order traversal is strictly increasing. Run the iterative in-order from lesson 5.1 and compare each value with the previous one. Both are O(n) time and O(h) space; the range version is the one to explain, the in-order one is the elegant follow-up.</p>
</div>
<div class="ml-vi">
<p><strong>Bước 2 — phát biểu luật ở đúng độ sâu.</strong> Một nút bị ràng buộc bởi <em>mọi</em> tổ tiên, không chỉ cha. Đi xuống bên trái một nút có khoá x thì thêm điều kiện "phải &lt; x"; đi sang phải thì thêm "phải &gt; x". Các điều kiện cộng dồn thành một khoảng mở <code>(lo, hi)</code>, và chính khoảng đó là thứ cần truyền xuống — đệ quy từ trên xuống ở bài 5.2. Bắt đầu khi chưa có cận nào.</p>
<p><strong>Bước 3 — hoặc dùng hệ quả.</strong> Cây là BST khi và chỉ khi duyệt in-order của nó tăng nghiêm ngặt. Chạy in-order bản lặp ở bài 5.1 và so mỗi giá trị với giá trị trước. Cả hai đều O(n) thời gian, O(h) bộ nhớ; bản khoảng là bản để giải thích, bản in-order là phần nối tiếp gọn đẹp.</p>
</div>
${maHai('ch05/valid-bst.ts', 'ch05/ValidBst.java', { vung: 'khoang' })}
${maHai('ch05/valid-bst.ts', 'ch05/ValidBst.java', { vung: 'trung-thu-tu' })}
${ketQua('ch05/valid-bst.ts')}
${ketQua('ch05/ValidBst.java')}
<div class="ml-en">
<p>Line 3 is the whole lesson: the children-only check says <code>true</code>, the range check and the in-order check both say <code>false</code>. Line 4, <code>[2,2,2]</code>, is the duplicate rule: <code>&lt;=</code> and <code>&gt;=</code> in the range check (not <code>&lt;</code>), and <code>cur.val &lt;= prev</code> in the in-order check. Lines 5 and 6 are there for Java: node values may be exactly <code>Integer.MAX_VALUE</code> and <code>Integer.MIN_VALUE</code>, which is why the bounds are nullable <code>Integer</code>s rather than "infinity" constants — see the trap below.</p>
</div>
<div class="ml-vi">
<p>Dòng 3 là cả bài học: kiểm theo con nói <code>true</code>, còn kiểm khoảng và kiểm in-order cùng nói <code>false</code>. Dòng 4, <code>[2,2,2]</code>, là luật không trùng: <code>&lt;=</code> và <code>&gt;=</code> trong kiểm khoảng (không phải <code>&lt;</code>), và <code>cur.val &lt;= prev</code> trong kiểm in-order. Dòng 5 và 6 dành cho Java: giá trị nút có thể đúng bằng <code>Integer.MAX_VALUE</code> và <code>Integer.MIN_VALUE</code>, nên các cận là <code>Integer</code> cho phép null thay vì hằng "vô cực" — xem cái bẫy bên dưới.</p>
</div>

<div class="ml-en">
<h3>Watch the range shrink</h3>
<p>The range check on the trap tree, one row per visited node (produced by running it). The interval only ever gets narrower as you go down.</p>
</div>
<div class="ml-vi">
<h3>Nhìn khoảng cho phép co lại</h3>
<p>Kiểm khoảng trên cây bẫy, mỗi hàng là một nút được thăm (sinh ra bằng cách chạy thật). Khoảng chỉ có thể hẹp lại khi đi xuống.</p>
</div>
${BANG_V}
<div class="ml-en">
<p>Row 3: going right from 5 sets <code>lo = 5</code>. Row 4: going left from 6 keeps <code>lo = 5</code> and sets <code>hi = 6</code>, so 3 must lie in (5, 6) — it does not, and the check stops after ${vV.rows.length} nodes without visiting 7. The constraint "greater than 5" was inherited from the grandparent; a check that only looks at the parent (6) can never see it.</p>
${moPhong('ch05/bst-kiem.sim.js', 'en', 'Validate a BST with ranges', 'The trap tree on /algorithms: each visited node prints the interval it inherited from all its ancestors, until 3 falls outside (5, 6).')}
</div>
<div class="ml-vi">
<p>Hàng 3: đi sang phải từ 5 đặt <code>lo = 5</code>. Hàng 4: đi sang trái từ 6 giữ <code>lo = 5</code> và đặt <code>hi = 6</code>, nên 3 phải nằm trong (5, 6) — không nằm, và việc kiểm dừng sau ${vV.rows.length} nút mà chưa cần thăm 7. Điều kiện "lớn hơn 5" được thừa hưởng từ ông của nút; một phép kiểm chỉ nhìn cha (6) không bao giờ thấy được nó.</p>
${moPhong('ch05/bst-kiem.sim.js', 'vi', 'Kiểm BST hợp lệ bằng khoảng', 'Cây bẫy trên /algorithms: mỗi nút được thăm in ra khoảng nó thừa hưởng từ mọi tổ tiên, tới khi 3 rơi ra ngoài (5, 6).')}
</div>

<div class="ml-en">
<h3>Variant 1 — Kth Smallest Element in a BST</h3>
<p>In-order is sorted, so the k-th value it produces is the answer. The iterative in-order lets you <em>stop</em> the moment k reaches 0 instead of building the whole sorted list: O(h + k) time, O(h) space. Here it is on <code>[5,3,6,2,4,null,null,1]</code> with k = 3:</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Kth Smallest Element in a BST</h3>
<p>In-order đã sắp xếp, nên giá trị thứ k nó sinh ra là đáp án. In-order bản lặp cho phép bạn <em>dừng</em> ngay khi k về 0 thay vì dựng cả danh sách đã sắp xếp: O(h + k) thời gian, O(h) bộ nhớ. Đây là nó trên <code>[5,3,6,2,4,null,null,1]</code> với k = 3:</p>
</div>
${oCay(KTREE, { to: { 1: 'ok', 2: 'ok', 3: 'ok' }, nhan: { 1: '1', 2: '2', 3: '3' } })}
${maHai('ch05/kth-smallest.ts', 'ch05/KthSmallest.java', { vung: 'kth' })}
${BANG_K}
${ketQua('ch05/kth-smallest.ts')}
<div class="ml-en">
<p>${vK.rows.length} steps, and the answer ${vK.answer} comes out while 4 and 6 are never even pushed (the tree has ${vK.total} nodes). The follow-up interviewers like: <em>"What if the BST is modified often and kthSmallest is called often?"</em> Store in every node the size of its subtree. Then at a node with left-subtree size L: if k ≤ L go left; if k = L + 1 this is it; otherwise go right with k − L − 1. Each query becomes O(h), and insert/delete update the sizes on their path. That structure has a name — an order-statistic tree — and naming it is enough.</p>
</div>
<div class="ml-vi">
<p>${vK.rows.length} bước, và đáp án ${vK.answer} hiện ra trong khi 4 và 6 còn chưa từng được đẩy vào ngăn xếp (cây có ${vK.total} nút). Câu hỏi nối tiếp người phỏng vấn hay hỏi: <em>"Nếu BST bị sửa thường xuyên và kthSmallest được gọi thường xuyên thì sao?"</em> Lưu ở mỗi nút kích thước cây con của nó. Khi đó ở một nút có cây con trái cỡ L: k ≤ L thì sang trái; k = L + 1 thì chính là nút này; còn lại sang phải với k − L − 1. Mỗi truy vấn thành O(h), và chèn/xoá cập nhật kích thước dọc đường đi của chúng. Cấu trúc đó có tên — order-statistic tree (cây thống kê thứ tự) — và gọi đúng tên là đủ.</p>
</div>

<div class="ml-en">
<h3>Variant 2 — Lowest Common Ancestor of a BST</h3>
<p>The lowest common ancestor (LCA) of p and q is the deepest node that has both below it (a node counts as its own descendant). In a BST you do not need to search for p and q at all: if both are smaller than the current node they are both on the left; if both are larger, both on the right; otherwise they split here — or one of them <em>is</em> here — and this node is the answer. One loop, O(h) time, O(1) space.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Lowest Common Ancestor of a BST</h3>
<p>Tổ tiên chung thấp nhất (lowest common ancestor — LCA) của p và q là nút sâu nhất có cả hai nằm dưới nó (một nút được tính là hậu duệ của chính nó). Trong BST bạn hoàn toàn không cần đi tìm p và q: nếu cả hai nhỏ hơn nút hiện tại thì cả hai ở bên trái; nếu cả hai lớn hơn thì cả hai ở bên phải; còn lại là chúng tách đôi ở đây — hoặc một trong hai <em>chính là</em> nút này — và nút này là đáp án. Một vòng lặp, O(h) thời gian, O(1) bộ nhớ.</p>
</div>
${oCay([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5])}
${maHai('ch05/lca-bst.ts', 'ch05/LcaBst.java', { vung: 'lca' })}
${ketQua('ch05/lca-bst.ts')}
<div class="ml-en">
<p><code>lca(2, 4) = 2</code> is the case people forget: 4 is below 2, so 2 is its own "common ancestor". The <code>else</code> branch covers it without any special code, because neither "both smaller than 2" nor "both larger than 2" holds.</p>
</div>
<div class="ml-vi">
<p><code>lca(2, 4) = 2</code> là trường hợp hay bị quên: 4 nằm dưới 2, nên 2 là "tổ tiên chung" của chính nó. Nhánh <code>else</code> lo luôn mà không cần code riêng, vì cả "cùng nhỏ hơn 2" lẫn "cùng lớn hơn 2" đều không đúng.</p>
</div>

<div class="ml-en">
<h3>Variant 3 — Search, insert, delete (and build a balanced one)</h3>
<p><strong>Search</strong> is one loop. <strong>Insert</strong> walks to the empty spot where the key belongs and hangs a new node there; written recursively it <em>returns the root of the subtree</em>, so each parent simply reattaches whatever comes back — the same shape as Invert Tree in lesson 5.2. <strong>Delete</strong> uses that shape too, with three cases once the key is found: no child ⇒ return null; one child ⇒ return that child (it moves up); two children ⇒ copy the <strong>in-order successor</strong> (the smallest key of the right subtree) into this node, then delete the successor from the right subtree, where it has at most one child. Finally, <strong>LC 108</strong> builds a balanced BST from a sorted array by making the middle element the root — the cure we will need in a minute.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 3 — Tìm, chèn, xoá (và dựng một cây cân bằng)</h3>
<p><strong>Tìm</strong> là một vòng lặp. <strong>Chèn</strong> đi tới chỗ trống nơi khoá thuộc về rồi treo nút mới vào đó; viết đệ quy thì nó <em>trả về gốc của cây con</em>, nên mỗi cha chỉ việc gắn lại thứ được trả về — cùng hình dạng với Invert Tree ở bài 5.2. <strong>Xoá</strong> cũng dùng hình dạng đó, với ba trường hợp khi đã tìm thấy khoá: không con ⇒ trả null; một con ⇒ trả đứa con đó (nó được kéo lên); hai con ⇒ chép <strong>phần tử kế tiếp in-order</strong> (in-order successor — khoá nhỏ nhất của cây con phải) vào nút này, rồi xoá phần tử kế tiếp đó khỏi cây con phải, nơi nó có tối đa một con. Cuối cùng, <strong>LC 108</strong> dựng một BST cân bằng từ mảng đã sắp xếp bằng cách lấy phần tử giữa làm gốc — thuốc chữa ta sẽ cần ngay sau đây.</p>
</div>
${maHai('ch05/bst-chen-xoa.ts', 'ch05/BstChenXoa.java', { vung: 'chen' })}
${maHai('ch05/bst-chen-xoa.ts', 'ch05/BstChenXoa.java', { vung: 'xoa' })}
${maHai('ch05/bst-chen-xoa.ts', 'ch05/BstChenXoa.java', { vung: 'can-bang' })}
${ketQua('ch05/bst-chen-xoa.ts')}
${ketQua('ch05/BstChenXoa.java')}
<div class="ml-en">
<p>Match each delete with its case on <code>[5,3,6,2,4,null,7]</code>: 7 is a leaf (case 1); 6 has only the right child 7, which moves up (case 2); 3 has two children, so its successor 4 is copied up and the old 4 removed — the result <code>[5,4,6,2,null,null,7]</code> is exactly LeetCode’s sample answer; deleting the root 5 copies its successor 6 up; deleting 0, which is absent, changes nothing. The Java midpoint is <code>(lo + hi) &gt;&gt;&gt; 1</code> — the overflow-safe habit from Chapter 4.</p>
</div>
<div class="ml-vi">
<p>Đối mỗi lần xoá với trường hợp của nó trên <code>[5,3,6,2,4,null,7]</code>: 7 là lá (trường hợp 1); 6 chỉ có con phải 7, và 7 được kéo lên (trường hợp 2); 3 có hai con, nên phần tử kế tiếp 4 được chép lên rồi số 4 cũ bị gỡ — kết quả <code>[5,4,6,2,null,null,7]</code> đúng bằng đáp án mẫu của LeetCode; xoá gốc 5 thì chép phần tử kế tiếp 6 lên; xoá 0, không có trong cây, thì không đổi gì. Điểm giữa trong Java là <code>(lo + hi) &gt;&gt;&gt; 1</code> — thói quen chống tràn số ở Chương 4.</p>
</div>

<div class="ml-en">
<h3>What "O(h)" costs when h = n: sorted input, measured</h3>
<p>Every operation above is O(h). On random data h is small; but real data is often <em>already sorted</em> — auto-increment ids, timestamps, student codes in a class list. Insert the keys 0, 1, 2, … into a plain BST and every key goes right: the tree is a linked list. Same 7 keys, two insertion orders:</p>
${moPhong('ch05/bst-suy-bien.sim.js', 'en', 'Sorted inserts make a chain; middle-first makes a tree', 'Two trees built side by side on /algorithms from the keys 1..7: height 7 versus height 3.')}
<p>And the cost at scale — sorted versus shuffled keys, with an iterative insert so the chain cannot overflow the stack, plus Java’s <code>TreeMap</code> (a red-black tree that rebalances itself) on the sorted keys:</p>
</div>
<div class="ml-vi">
<h3>"O(h)" tốn bao nhiêu khi h = n: dữ liệu đã sắp xếp, đo thật</h3>
<p>Mọi thao tác phía trên đều O(h). Trên dữ liệu ngẫu nhiên h nhỏ; nhưng dữ liệu thật thường <em>đã sắp xếp sẵn</em> — id tự tăng, mốc thời gian, mã số sinh viên trong danh sách lớp. Chèn các khoá 0, 1, 2, … vào một BST trơn thì khoá nào cũng đi sang phải: cây thành một danh sách liên kết. Cùng 7 khoá, hai thứ tự chèn:</p>
${moPhong('ch05/bst-suy-bien.sim.js', 'vi', 'Chèn đã sắp xếp ra sợi dây; chèn giữa trước ra cây', 'Hai cây dựng song song trên /algorithms từ các khoá 1..7: chiều cao 7 so với chiều cao 3.')}
<p>Còn đây là cái giá ở quy mô lớn — khoá đã sắp xếp so với khoá xáo trộn, chèn bằng vòng lặp để sợi dây không làm tràn ngăn xếp, kèm <code>TreeMap</code> của Java (cây đỏ-đen, tự cân bằng) trên chính các khoá đã sắp xếp:</p>
</div>
${ma('ch05/bst-do.ts', { vung: 'chen-lap', nhan: 'TypeScript — iterative insert' })}
${ketQua('ch05/bst-do.ts')}
${ketQua('ch05/BstDo.java')}
<div class="ml-en">
<p>Read the table. With sorted keys the height equals n exactly, and the time is quadratic: from 10,000 to 50,000 keys (×5) Node went from 91 ms to 2.1 s (×23, close to the ×25 that n² predicts). A million sorted keys was not even run — extrapolating ×400 from 50,000 gives a quarter of an hour. Shuffled, a million keys take under a second and the height is 49, about 2.5 × log₂ n: random insertion order keeps a plain BST shallow <em>on average</em>. <code>TreeMap</code> takes the sorted million in 0.12 s, because it rotates nodes to keep the height O(log n) whatever the order. This is why production code uses self-balancing trees (red-black in Java’s <code>TreeMap</code> and in <code>HashMap</code>’s crowded buckets, B-trees in databases) and why, in an interview, "O(log n)" must be followed by "if the tree is balanced".</p>
</div>
<div class="ml-vi">
<p>Đọc bảng. Với khoá đã sắp xếp, chiều cao đúng bằng n, và thời gian là bậc hai: từ 10.000 lên 50.000 khoá (×5), Node đi từ 91 ms lên 2,1 giây (×23, sát với ×25 mà n² dự đoán). Một triệu khoá đã sắp xếp thì không chạy luôn — ngoại suy ×400 từ mốc 50.000 ra khoảng mười lăm phút. Xáo trộn thì một triệu khoá chưa tới một giây và chiều cao là 49, khoảng 2,5 × log₂ n: thứ tự chèn ngẫu nhiên giữ cho BST trơn nông <em>trung bình</em>. <code>TreeMap</code> nuốt một triệu khoá đã sắp xếp trong 0,12 giây, vì nó xoay nút để giữ chiều cao O(log n) bất kể thứ tự. Đó là lý do code production dùng cây tự cân bằng (đỏ-đen trong <code>TreeMap</code> của Java và trong các ô quá đông của <code>HashMap</code>, B-tree trong CSDL), và vì sao khi phỏng vấn, "O(log n)" phải đi kèm "nếu cây cân bằng".</p>
${csd('csd201-avl', 'vi', '4.6 Cây AVL: bốn phép xoay', '<p>CSD201 dạy cách một cây tự cân bằng giữ chiều cao O(log n) bằng phép xoay. Phỏng vấn hiếm khi bắt cài AVL hay đỏ-đen; thứ được hỏi là <em>vì sao</em> cần nó — và bảng đo trên là câu trả lời bằng số.</p>')}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: choosing the insertion order</h3>
<p>If an attacker can decide the order in which keys enter an unbalanced tree — usernames, ids, sort keys in an upload — they can hand you the sorted case on purpose and turn every O(log n) operation into O(n). It is the same family as HashDoS from lesson 1.1: an <em>algorithmic complexity attack</em>, where the input is small and legal but chosen to hit the worst case. And you do not even need an attacker: imported data, logs and ids arrive sorted by themselves. Defences: use a self-balancing structure (Java <code>TreeMap</code>, a database index), shuffle before building when you control the build, or rebuild balanced (LC 1382: in-order into an array, then LC 108).</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: chọn thứ tự chèn</h3>
<p>Nếu kẻ tấn công quyết định được thứ tự các khoá đi vào một cây không cân bằng — tên người dùng, id, khoá sắp xếp trong một tệp tải lên — họ có thể cố ý đưa bạn trường hợp đã sắp xếp và biến mọi thao tác O(log n) thành O(n). Cùng họ với HashDoS ở bài 1.1: một <em>tấn công độ phức tạp thuật toán</em> (algorithmic complexity attack), đầu vào nhỏ và hợp lệ nhưng được chọn để rơi vào trường hợp xấu nhất. Mà chẳng cần kẻ tấn công: dữ liệu nhập vào, log, id tự nó đã đến theo thứ tự. Cách phòng: dùng cấu trúc tự cân bằng (<code>TreeMap</code> của Java, chỉ mục CSDL), xáo trộn trước khi dựng nếu bạn kiểm soát việc dựng, hoặc dựng lại cho cân bằng (LC 1382: in-order ra mảng, rồi LC 108).</p>
${lienKet({ bai: 'dsa-1-1-hash-map', title: '1.1 — Hash map và set', sub: 'HashDoS: cùng kiểu tấn công độ phức tạp, nhắm vào bảng băm', cta: 'Ôn bài' })}
</div>

<div class="ml-en">
<h3>The trap that fails real candidates: "infinity" that is a real value</h3>
<div class="pitfall co-tieu-de"><p><strong>Java: <code>ok(root, Integer.MIN_VALUE, Integer.MAX_VALUE)</code> as the starting range.</strong></p><p>LC 98 allows node values from −2³¹ to 2³¹ − 1, exactly the range of <code>int</code>. A tree with the single value 2147483647 is valid, but <code>2147483647 &gt;= Integer.MAX_VALUE</code> is true, so the sentinel version rejects it:</p></div>
</div>
<div class="ml-vi">
<h3>Cái bẫy làm trượt ứng viên thật: "vô cực" lại là một giá trị có thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Java: dùng <code>ok(root, Integer.MIN_VALUE, Integer.MAX_VALUE)</code> làm khoảng xuất phát.</strong></p><p>LC 98 cho giá trị nút từ −2³¹ tới 2³¹ − 1, đúng bằng miền của <code>int</code>. Cây chỉ có một giá trị 2147483647 là hợp lệ, nhưng <code>2147483647 &gt;= Integer.MAX_VALUE</code> là true, nên bản dùng hằng canh gác từ chối nó:</p></div>
</div>
${ma('ch05/BayBien.java', { vung: 'sai', nhan: 'Java — wrong' })}
${ketQua('ch05/BayBien.java')}
<div class="ml-en">
<p>Two fixes: widen the bounds to <code>long</code> (<code>Long.MIN_VALUE</code> is truly below every <code>int</code>), or make them nullable <code>Integer</code>s meaning "no bound yet", as <code>ValidBst.java</code> does. In TypeScript, <code>-Infinity</code>/<code>Infinity</code> are real infinities, so the bug does not exist there — but <code>null</code> bounds read more clearly in both languages. The same trap appears whenever "min so far" starts at a value the data can contain.</p>
</div>
<div class="ml-vi">
<p>Hai cách sửa: nới cận ra <code>long</code> (<code>Long.MIN_VALUE</code> thật sự nhỏ hơn mọi <code>int</code>), hoặc dùng <code>Integer</code> cho phép null với nghĩa "chưa có cận", như <code>ValidBst.java</code>. Trong TypeScript, <code>-Infinity</code>/<code>Infinity</code> là vô cực thật nên lỗi này không tồn tại — nhưng cận <code>null</code> đọc rõ hơn ở cả hai ngôn ngữ. Cùng cái bẫy này xuất hiện bất cứ khi nào "nhỏ nhất tới giờ" bắt đầu bằng một giá trị mà dữ liệu có thể chứa.</p>
</div>

<div class="ml-en">
<h3>Where BSTs live in real systems</h3>
<ul>
<li><strong>Java’s sorted collections.</strong> <code>TreeMap</code>/<code>TreeSet</code> are red-black trees: <code>floorKey(t)</code> = "latest booking at or before t", <code>ceilingKey(t)</code> = "first free slot after t", <code>subMap(a, b)</code> = a range. That is the BST walk of LCA and search, packaged.</li>
<li><strong>Database indexes are B-trees</strong> — a BST generalised to many keys per node so each step reads one disk page. This site has a real query shaped exactly like a BST "floor": <code>nextCode()</code> in <code>src/services/projectRequest.service.ts</code> finds the last request code of the year with <code>findFirst({ where: { code: { startsWith: 'YC-2026-' } }, orderBy: { code: 'desc' } })</code>, on a column with the UNIQUE constraint <code>uk_project_request_code</code> — and a UNIQUE constraint is backed by a B-tree index. Whether PostgreSQL walks that index for a <code>LIKE 'YC-2026-%'</code> prefix depends on the column’s collation; <code>EXPLAIN</code> tells you, and the PostgreSQL course shows how.</li>
<li><strong>File systems</strong> (APFS on your Mac, Btrfs, NTFS) keep directory entries and extents in B-tree variants, so <code>ls</code> on a folder of a million files does not scan a list.</li>
</ul>
</div>
<div class="ml-vi">
<h3>BST sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Các tập hợp có thứ tự của Java.</strong> <code>TreeMap</code>/<code>TreeSet</code> là cây đỏ-đen: <code>floorKey(t)</code> = "lượt đặt muộn nhất vào lúc hoặc trước t", <code>ceilingKey(t)</code> = "khung trống đầu tiên sau t", <code>subMap(a, b)</code> = một khoảng. Đó chính là bước đi BST của LCA và tìm kiếm, được đóng gói sẵn.</li>
<li><strong>Chỉ mục CSDL là B-tree</strong> — BST được tổng quát cho nhiều khoá mỗi nút để mỗi bước chỉ đọc một trang đĩa. Trang này có một truy vấn thật mang đúng hình dạng "floor" của BST: <code>nextCode()</code> trong <code>src/services/projectRequest.service.ts</code> tìm mã phiếu yêu cầu cuối cùng của năm bằng <code>findFirst({ where: { code: { startsWith: 'YC-2026-' } }, orderBy: { code: 'desc' } })</code>, trên một cột có ràng buộc UNIQUE <code>uk_project_request_code</code> — mà ràng buộc UNIQUE được chống lưng bằng một chỉ mục B-tree. PostgreSQL có đi trên chỉ mục đó cho phép lọc tiền tố <code>LIKE 'YC-2026-%'</code> hay không còn tuỳ collation (quy tắc so sánh chữ) của cột; <code>EXPLAIN</code> trả lời, và khoá PostgreSQL chỉ cách xem.</li>
<li><strong>Hệ thống tệp</strong> (APFS trên Mac của bạn, Btrfs, NTFS) giữ mục thư mục và vùng dữ liệu trong các biến thể B-tree, nên <code>ls</code> một thư mục một triệu tệp không phải quét một danh sách.</li>
</ul>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', title: 'PostgreSQL 9.1 — Chỉ mục là gì: B-tree, Seq Scan vs Index Scan', sub: 'Thấy B-tree làm việc trong EXPLAIN của một truy vấn thật', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given the root of a binary tree, determine if it is a valid binary search tree.'],
  ['C', 'Strictly smaller on the left and strictly larger on the right, so duplicates make it invalid? And node values can be anywhere in the int range?'],
  ['N', 'Two clarifications, each tied to a known bug: duplicates (<= vs <) and Integer.MAX_VALUE sentinels.'],
  ['I', 'Yes to both.'],
  ['C', 'Comparing each node with its children is not enough — a node in the right subtree of 5 must be greater than 5 even if its parent is 6. So I pass down an open interval: going left caps the upper bound at the node’s value, going right raises the lower bound. Each node is checked once: O(n) time, O(h) stack.'],
  ['N', 'State the trap before the interviewer does. It is the point of the question.'],
  ['C', '(coding) I use null for "no bound" instead of Integer.MIN_VALUE and MAX_VALUE, because a node may hold exactly those values.'],
  ['C', 'Test: [2,1,3] true; [5,4,6,null,null,3,7] false — 3 fails the bound (5, 6) even though it is less than its parent; [2,2,2] false; a single node 2147483647 true.'],
  ['I', 'Any other way to do it?'],
  ['C', 'In-order traversal of a BST is strictly increasing, so an iterative in-order with a prev value works too, and it can stop at the first violation.'],
  ['I', 'And if the tree is huge and skewed?'],
  ['C', 'Then I would use the iterative in-order, so the depth lives on my own stack instead of the call stack.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Cho gốc một cây nhị phân, xác định nó có phải BST hợp lệ không.'],
  ['C', 'Bên trái nhỏ hơn nghiêm ngặt, bên phải lớn hơn nghiêm ngặt, nên có trùng là không hợp lệ ạ? Và giá trị nút có thể ở bất kỳ đâu trong miền int? <em>("Strictly smaller on the left, strictly larger on the right?")</em>'],
  ['N', 'Hai câu hỏi làm rõ, mỗi câu gắn với một lỗi đã biết: trùng (<= hay <) và hằng canh gác Integer.MAX_VALUE.'],
  ['I', 'Đúng cả hai.'],
  ['C', 'So mỗi nút với các con là chưa đủ — một nút trong cây con phải của 5 phải lớn hơn 5 kể cả khi cha nó là 6. Nên em truyền xuống một khoảng mở: sang trái thì chặn cận trên bằng giá trị nút, sang phải thì nâng cận dưới. Mỗi nút kiểm một lần: O(n) thời gian, O(h) ngăn xếp. <em>("I pass down an open interval.")</em>'],
  ['N', 'Nói ra cái bẫy trước khi người phỏng vấn nói. Đó là mục đích của câu hỏi.'],
  ['C', '(đang code) Em dùng null cho "chưa có cận" thay vì Integer.MIN_VALUE và MAX_VALUE, vì nút có thể mang đúng các giá trị đó.'],
  ['C', 'Test: [2,1,3] true; [5,4,6,null,null,3,7] false — 3 trượt khoảng (5, 6) dù nó nhỏ hơn cha; [2,2,2] false; một nút 2147483647 thì true.'],
  ['I', 'Còn cách nào khác không?'],
  ['C', 'Duyệt in-order của BST tăng nghiêm ngặt, nên in-order bản lặp kèm một biến prev cũng được, và nó dừng được ngay ở chỗ vi phạm đầu tiên. <em>("In-order of a BST is strictly increasing.")</em>'],
  ['I', 'Nếu cây rất lớn và lệch thì sao?'],
  ['C', 'Khi đó em dùng in-order bản lặp, để độ sâu nằm trên ngăn xếp của em thay vì ngăn xếp lời gọi.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Checking a node only against its children (or parent) instead of the range inherited from all ancestors.</li>
<li><code>&lt;</code> where duplicates must fail (<code>&lt;=</code>), or the reverse when the problem allows duplicates on one side.</li>
<li>Integer sentinels in Java that collide with real values.</li>
<li>Collecting the whole in-order list for k-th smallest when you can stop at k.</li>
<li>Forgetting to <em>use</em> the return value in recursive insert/delete (<code>insert(root.left, v)</code> without <code>root.left =</code>): the new node is created and lost.</li>
<li>Saying "BST operations are O(log n)" without "if balanced" — the measurement above is the counter-example.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Chỉ kiểm một nút với các con (hoặc với cha) thay vì với khoảng thừa hưởng từ mọi tổ tiên.</li>
<li>Dùng <code>&lt;</code> ở chỗ phần tử trùng phải bị loại (<code>&lt;=</code>), hoặc ngược lại khi đề cho phép trùng ở một phía.</li>
<li>Hằng canh gác kiểu int trong Java đụng với giá trị thật.</li>
<li>Gom cả danh sách in-order cho đề nhỏ thứ k trong khi có thể dừng ở k.</li>
<li>Quên <em>dùng</em> giá trị trả về trong chèn/xoá đệ quy (<code>insert(root.left, v)</code> mà thiếu <code>root.left =</code>): nút mới được tạo ra rồi mất.</li>
<li>Nói "thao tác BST là O(log n)" mà thiếu "nếu cân bằng" — phép đo phía trên là phản ví dụ.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write the children-only check, run it on <code>[5,4,6,null,null,3,7]</code>, and see it say true. Then write the range version and see it say false.</li>
<li>On paper, fill the "allowed range" column for <code>[10,5,15,null,null,6,20]</code>. Which node fails, and which ancestor’s bound catches it?</li>
<li>Submit LC 98, LC 230 and LC 235. For LC 98 in Java, submit once with <code>Integer.MIN_VALUE</code>/<code>MAX_VALUE</code> bounds and read which test fails.</li>
<li>Insert 1..10 into your BST, print its height; then build it with LC 108 from the same keys and print the height again.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, the failing Java test explained in one sentence, and heights 10 and 4 printed by your own code.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BST invariant</span><span class="v">For every node: all keys on the left are smaller, all keys on the right are larger.</span></div>
  <div class="kv"><span class="k">in-order successor</span><span class="v">The next key in sorted order: the smallest key of the right subtree.</span></div>
  <div class="kv"><span class="k">lowest common ancestor (LCA)</span><span class="v">The deepest node that has both p and q in its subtree.</span></div>
  <div class="kv"><span class="k">degenerate tree</span><span class="v">A BST shaped like a list (height n), e.g. after sorted inserts.</span></div>
  <div class="kv"><span class="k">self-balancing tree</span><span class="v">A BST that rotates nodes to keep height O(log n): AVL, red-black (<code>TreeMap</code>).</span></div>
  <div class="kv"><span class="k">order-statistic tree</span><span class="v">A BST whose nodes store subtree sizes, so k-th smallest is O(h).</span></div>
  <div class="kv"><span class="k">B-tree</span><span class="v">A balanced search tree with many keys per node; the default database index.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>The BST rule is about <em>all</em> ancestors: pass an open range (lo, hi) down.</li>
<li>In-order of a BST is strictly increasing: use it to validate, to find the k-th smallest, to find neighbours.</li>
<li>LCA in a BST: walk down until p and q split.</li>
<li>Recursive insert/delete return the new subtree root; delete has three cases.</li>
<li>Everything is O(h): sorted inserts make h = n (measured: quadratic), balanced trees keep h = O(log n).</li>
<li>In Java, never use <code>Integer.MIN_VALUE</code>/<code>MAX_VALUE</code> as infinity when values can reach them.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees', 'The BST problems in the standard order, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java TreeMap (Java SE 21 API)', 'A red-black tree with floorKey, ceilingKey, subMap — the BST you use at work', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html')}
${nguon('🐘', 'PostgreSQL — B-Tree indexes', 'How the default database index is organised and what it can answer', 'https://www.postgresql.org/docs/current/btree.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết bản kiểm theo con, chạy trên <code>[5,4,6,null,null,3,7]</code> và thấy nó nói true. Rồi viết bản khoảng và thấy nó nói false.</li>
<li>Trên giấy, điền cột "khoảng cho phép" cho <code>[10,5,15,null,null,6,20]</code>. Nút nào trượt, và cận của tổ tiên nào bắt được nó?</li>
<li>Nộp LC 98, LC 230 và LC 235. Với LC 98 bằng Java, nộp một lần dùng cận <code>Integer.MIN_VALUE</code>/<code>MAX_VALUE</code> rồi đọc xem test nào trượt.</li>
<li>Chèn 1..10 vào BST của bạn, in chiều cao; rồi dựng bằng LC 108 từ cùng các khoá và in chiều cao lần nữa.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, giải thích được test Java bị trượt trong một câu, và code của chính bạn in ra chiều cao 10 và 4.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BST invariant (bất biến BST)</span><span class="v">Với mọi nút: mọi khoá bên trái nhỏ hơn, mọi khoá bên phải lớn hơn.</span></div>
  <div class="kv"><span class="k">in-order successor (phần tử kế tiếp in-order)</span><span class="v">Khoá kế tiếp theo thứ tự tăng: khoá nhỏ nhất của cây con phải.</span></div>
  <div class="kv"><span class="k">lowest common ancestor — LCA (tổ tiên chung thấp nhất)</span><span class="v">Nút sâu nhất có cả p và q trong cây con của nó.</span></div>
  <div class="kv"><span class="k">degenerate tree (cây suy biến)</span><span class="v">BST có hình danh sách (cao n), ví dụ sau khi chèn dữ liệu đã sắp xếp.</span></div>
  <div class="kv"><span class="k">self-balancing tree (cây tự cân bằng)</span><span class="v">BST xoay nút để giữ chiều cao O(log n): AVL, đỏ-đen (<code>TreeMap</code>).</span></div>
  <div class="kv"><span class="k">order-statistic tree (cây thống kê thứ tự)</span><span class="v">BST mà mỗi nút lưu cỡ cây con, nên nhỏ thứ k là O(h).</span></div>
  <div class="kv"><span class="k">B-tree (cây B)</span><span class="v">Cây tìm kiếm cân bằng có nhiều khoá mỗi nút; chỉ mục mặc định của CSDL.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Luật BST nói về <em>mọi</em> tổ tiên: truyền một khoảng mở (lo, hi) xuống.</li>
<li>In-order của BST tăng nghiêm ngặt: dùng để kiểm hợp lệ, tìm nhỏ thứ k, tìm phần tử kề.</li>
<li>LCA trong BST: đi xuống tới khi p và q tách hai phía.</li>
<li>Chèn/xoá đệ quy trả về gốc cây con mới; xoá có ba trường hợp.</li>
<li>Mọi thứ đều O(h): chèn đã sắp xếp làm h = n (đo thật: bậc hai), cây cân bằng giữ h = O(log n).</li>
<li>Trong Java, đừng bao giờ dùng <code>Integer.MIN_VALUE</code>/<code>MAX_VALUE</code> làm vô cực khi giá trị có thể chạm tới chúng.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees', 'Các đề BST theo thứ tự chuẩn, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java TreeMap (Java SE 21 API)', 'Cây đỏ-đen với floorKey, ceilingKey, subMap — BST bạn dùng khi đi làm', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html')}
${nguon('🐘', 'PostgreSQL — B-Tree indexes', 'Chỉ mục mặc định của CSDL được tổ chức thế nào và trả lời được gì', 'https://www.postgresql.org/docs/current/btree.html')}
</div>
`,
};
