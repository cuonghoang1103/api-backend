/** 5.5 — Bộ luyện 5 (slug khung dsa-5-4-luyen, hiển thị ở vị trí 5.5). Mã/output đọc từ ../ma/ch05 (chạy thật bằng _chay.mjs). */
import { ma, maHai, ketQua, lc, nguon, gap, lienKet } from '../_chung.mjs';
import { oCay } from './_rieng.mjs';

const L = {
  sym: lc(101, 'symmetric-tree', 'Symmetric Tree', 'Easy'),
  sub: lc(572, 'subtree-of-another-tree', 'Subtree of Another Tree', 'Easy'),
  good: lc(1448, 'count-good-nodes-in-binary-tree', 'Count Good Nodes in Binary Tree', 'Medium'),
  lca: lc(236, 'lowest-common-ancestor-of-a-binary-tree', 'Lowest Common Ancestor of a Binary Tree', 'Medium'),
  build: lc(105, 'construct-binary-tree-from-preorder-and-inorder-traversal', 'Construct Binary Tree from Preorder and Inorder Traversal', 'Medium'),
  dist: lc(863, 'all-nodes-distance-k-in-binary-tree', 'All Nodes Distance K in Binary Tree', 'Medium'),
  rob: lc(337, 'house-robber-iii', 'House Robber III', 'Medium'),
  ws: lc(212, 'word-search-ii', 'Word Search II', 'Hard'),
};

const BANG = (en) => `<table>
<thead><tr><th>#</th><th>${en ? 'Problem' : 'Đề'}</th><th>${en ? 'Pattern' : 'Mẫu'}</th><th>${en ? 'Target time' : 'Thời gian mục tiêu'}</th></tr></thead>
<tbody>
<tr><td>1</td><td>${L.sym}</td><td>${en ? 'recursion on two trees (mirrored)' : 'đệ quy trên hai cây (soi gương)'}</td><td>15′</td></tr>
<tr><td>2</td><td>${L.sub}</td><td>${en ? 'same tree at every node · serialize' : 'so cây ở mọi nút · tuần tự hoá'}</td><td>15′</td></tr>
<tr><td>3</td><td>${L.good}</td><td>${en ? 'top-down: pass the max down' : 'từ trên xuống: truyền max xuống'}</td><td>25′</td></tr>
<tr><td>4</td><td>${L.lca}</td><td>${en ? 'bottom-up: return what you found' : 'từ dưới lên: trả thứ đã tìm thấy'}</td><td>25′</td></tr>
<tr><td>5</td><td>${L.build}</td><td>${en ? 'traversal orders + hash map of positions' : 'thứ tự duyệt + map vị trí'}</td><td>25′</td></tr>
<tr><td>6</td><td>${L.dist}</td><td>${en ? 'tree → graph (parent links) + BFS' : 'cây → đồ thị (link cha) + BFS'}</td><td>25′</td></tr>
<tr><td>7</td><td>${L.rob}</td><td>${en ? 'bottom-up returning a pair (tree DP)' : 'từ dưới lên trả một cặp (DP trên cây)'}</td><td>25′</td></tr>
<tr><td>8</td><td>${L.ws}</td><td>${en ? 'trie + backtracking + pruning' : 'trie + quay lui + cắt nhánh'}</td><td>40′</td></tr>
</tbody></table>`;

export default {
  title: '5.5 — Practice set 5: eight tree problems with step-by-step solutions|||5.5 — Bộ luyện 5: tám đề cây có lời giải từng bước',
  slug: 'dsa-5-4-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề từ dễ tới khó phủ cả chương: Symmetric Tree, Subtree, Good Nodes, LCA, dựng cây từ hai phép duyệt, Distance K, House Robber III, Word Search II — gợi ý gập, lời giải TS + Java chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Practice set 5: eight tree problems with step-by-step solutions</h2>
<p class="lead">Eight problems, easy to hard, chosen so that every pattern of this chapter appears at least once: recursion on two trees, top-down and bottom-up recursion, traversal orders, BFS, a tree turned into a graph, a tree DP that returns a pair, and a trie driving a backtracking search. Each one is followed by two folded hints and a folded step-by-step solution; the code and its real output sit right after.</p>
${BANG(true)}
<h3>How to practise with this page</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Start a timer</span><span class="lz-d">Easy 15′, Medium 25′, Hard 40′ — the length of a real interview slot for one problem.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Say the sentence first</span><span class="lz-d">"My helper returns ___ to its parent / receives ___ from its parent." Write it before any code.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Open hints one at a time</span><span class="lz-d">Only when stuck for 5 minutes. Hint 1 names the pattern, hint 2 the key decision.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Submit on LeetCode</span><span class="lz-d">Then compare with the solution here and write one line in your notebook: signal → pattern → complexity.</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Bộ luyện 5: tám đề cây có lời giải từng bước</h2>
<p class="lead">Tám đề, từ dễ tới khó, chọn sao cho mọi mẫu của chương đều xuất hiện ít nhất một lần: đệ quy trên hai cây, đệ quy từ trên xuống và từ dưới lên, thứ tự duyệt, BFS, cây biến thành đồ thị, DP trên cây trả về một cặp, và trie dẫn đường cho một lần quay lui. Mỗi đề có hai gợi ý gập lại và một lời giải từng bước gập lại; mã và output thật nằm ngay sau.</p>
${BANG(false)}
<h3>Cách luyện với trang này</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bấm giờ</span><span class="lz-d">Easy 15′, Medium 25′, Hard 40′ — đúng độ dài một lượt đề trong buổi phỏng vấn thật.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nói câu khuôn trước</span><span class="lz-d">"Hàm phụ của tôi trả ___ cho cha / nhận ___ từ cha." Viết câu đó ra trước mọi dòng code.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Mở gợi ý từng cái một</span><span class="lz-d">Chỉ khi bí quá 5 phút. Gợi ý 1 gọi tên mẫu, gợi ý 2 chỉ ra quyết định then chốt.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nộp trên LeetCode</span><span class="lz-d">Rồi so với lời giải ở đây và ghi một dòng vào sổ: dấu hiệu → mẫu → độ phức tạp.</span></div>
</div>
<p>Nói to trong lúc làm, bằng tiếng Anh nếu được — khuôn hội thoại ở các bài 5.1–5.4 dùng lại nguyên được.</p>
</div>

<div class="ml-en">
<h3>1 · Symmetric Tree — ${L.sym}</h3>
<p><strong>Problem (in our words).</strong> Is the tree a mirror image of itself around its centre line? <code>[1,2,2,3,4,4,3]</code> is; <code>[1,2,2,null,3,null,3]</code> is not (both 3s hang on the right).</p>
<p><strong>Recognise the pattern.</strong> A yes/no question about the <em>shape and values</em> of two parts of a tree ⇒ recursion on two trees at once, like Same Tree (lesson 5.2).</p>
${gap('💡 Hint 1', '<p>The tree is symmetric if its left subtree is the mirror of its right subtree. Write <code>mirror(a, b)</code>.</p>')}
${gap('💡 Hint 2', '<p>Mirror means: same root value, and the <em>outer</em> pair (a.left, b.right) mirrors, and the <em>inner</em> pair (a.right, b.left) mirrors.</p>')}
${gap('✅ Step-by-step solution', '<p>Same Tree compares left with left; a mirror compares left with right. Base case: if at least one side is null, they mirror only if both are (<code>a === b</code>). Each node is visited once: O(n) time, O(h) stack. Edge cases tried: a single node (true), and <code>[1,2,2,2,null,2]</code> where values match level by level but the shapes do not (false).</p>')}
</div>
<div class="ml-vi">
<h3>1 · Symmetric Tree — ${L.sym}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cây có đối xứng như soi gương qua trục giữa không? <code>[1,2,2,3,4,4,3]</code> có; <code>[1,2,2,null,3,null,3]</code> không (cả hai số 3 đều treo bên phải).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Câu hỏi có/không về <em>hình dạng và giá trị</em> của hai phần của cây ⇒ đệ quy trên hai cây cùng lúc, như Same Tree (bài 5.2).</p>
${gap('💡 Gợi ý 1', '<p>Cây đối xứng khi cây con trái là ảnh gương của cây con phải. Viết hàm <code>mirror(a, b)</code>.</p>')}
${gap('💡 Gợi ý 2', '<p>Ảnh gương nghĩa là: gốc cùng giá trị, cặp <em>ngoài</em> (a.left, b.right) soi gương nhau, và cặp <em>trong</em> (a.right, b.left) soi gương nhau.</p>')}
${gap('✅ Lời giải từng bước', '<p>Same Tree so trái với trái; soi gương so trái với phải. Điều kiện dừng: nếu ít nhất một bên là null thì chỉ soi gương được khi cả hai là null (<code>a === b</code>). Mỗi nút thăm một lần: O(n) thời gian, O(h) ngăn xếp. Ca biên đã thử: một nút (true), và <code>[1,2,2,2,null,2]</code> nơi giá trị khớp theo từng tầng nhưng hình dạng thì không (false).</p>')}
</div>
${maHai('ch05/symmetric.ts', 'ch05/Symmetric.java', { vung: 'giai' })}
${ketQua('ch05/symmetric.ts')}

<div class="ml-en">
<h3>2 · Subtree of Another Tree — ${L.sub}</h3>
<p><strong>Problem (in our words).</strong> Does <code>root</code> contain a node whose whole subtree is identical to <code>subRoot</code>? In <code>[3,4,5,1,2]</code>, the subtree at 4 is <code>[4,1,2]</code>: yes. Add a child 0 under 2 and it is no longer identical: no.</p>
<p><strong>Recognise the pattern.</strong> "Identical" = Same Tree; "somewhere inside" = try it at every node (a traversal). Two recursions nested.</p>
${gap('💡 Hint 1', '<p>Reuse <code>isSame(p, q)</code>. The answer is <code>isSame(root, sub)</code> or the same question asked on the left or right child.</p>')}
${gap('💡 Hint 2', '<p>Follow-up for large trees: serialize both trees with null markers and search the smaller string in the bigger one — but every value needs a delimiter in front of it, or <code>12</code> "contains" <code>2</code>.</p>')}
${gap('✅ Step-by-step solution', '<p>For every node of <code>root</code> (n nodes) we may run <code>isSame</code> on up to m nodes: O(n·m) worst case, O(h) stack — accepted on LeetCode. The serialize version is O(n + m) with a linear string search (KMP), or roughly that with the built-in <code>includes</code>/<code>contains</code> in practice. Edge cases tried: <code>[1,1]</code> with <code>[1]</code> (the match is the second node, so the recursion must keep looking after the root fails), and <code>[12]</code> with <code>[2]</code> — see the trap below.</p>')}
</div>
<div class="ml-vi">
<h3>2 · Subtree of Another Tree — ${L.sub}</h3>
<p><strong>Đề (diễn đạt lại).</strong> <code>root</code> có chứa một nút mà toàn bộ cây con của nó giống hệt <code>subRoot</code> không? Trong <code>[3,4,5,1,2]</code>, cây con tại 4 là <code>[4,1,2]</code>: có. Thêm một con 0 dưới 2 thì không còn giống hệt: không.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Giống hệt" = Same Tree; "ở đâu đó bên trong" = thử ở mọi nút (một phép duyệt). Hai đệ quy lồng nhau.</p>
${gap('💡 Gợi ý 1', '<p>Dùng lại <code>isSame(p, q)</code>. Đáp án là <code>isSame(root, sub)</code> hoặc cùng câu hỏi đó trên con trái hay con phải.</p>')}
${gap('💡 Gợi ý 2', '<p>Câu hỏi nối tiếp cho cây lớn: tuần tự hoá cả hai cây kèm ký hiệu null rồi tìm chuỗi nhỏ trong chuỗi lớn — nhưng trước mỗi giá trị phải có dấu ngăn, không thì <code>12</code> "chứa" <code>2</code>.</p>')}
${gap('✅ Lời giải từng bước', '<p>Với mỗi nút của <code>root</code> (n nút) ta có thể chạy <code>isSame</code> trên tối đa m nút: xấu nhất O(n·m), ngăn xếp O(h) — LeetCode chấp nhận. Bản tuần tự hoá là O(n + m) nếu tìm chuỗi tuyến tính (KMP), thực tế gần như vậy với <code>includes</code>/<code>contains</code> có sẵn. Ca biên đã thử: <code>[1,1]</code> với <code>[1]</code> (chỗ khớp là nút thứ hai, nên đệ quy phải tìm tiếp khi gốc không khớp), và <code>[12]</code> với <code>[2]</code> — xem cái bẫy bên dưới.</p>')}
</div>
${maHai('ch05/subtree.ts', 'ch05/Subtree.java', { vung: 'giai' })}
${ketQua('ch05/subtree.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Serializing without a delimiter in front of every value.</strong></p><p>The last line of the output: <code>[12]</code> does not contain the tree <code>[2]</code>, yet the string <code>"12,#,#"</code> contains <code>"2,#,#"</code>, so the no-delimiter version answers true. Putting a comma <em>before</em> every token (<code>",12,#,#"</code> vs <code>",2,#,#"</code>) makes a match start only at a value boundary:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Tuần tự hoá mà không có dấu ngăn trước mỗi giá trị.</strong></p><p>Dòng cuối của output: <code>[12]</code> không chứa cây <code>[2]</code>, vậy mà chuỗi <code>"12,#,#"</code> chứa <code>"2,#,#"</code>, nên bản không dấu ngăn trả lời true. Đặt dấu phẩy <em>trước</em> mọi ký hiệu (<code>",12,#,#"</code> so với <code>",2,#,#"</code>) khiến chỗ khớp chỉ có thể bắt đầu ở ranh giới một giá trị:</p></div>
</div>
${ma('ch05/subtree.ts', { vung: 'chuoi', nhan: 'TypeScript — serialize with a leading delimiter' })}

<div class="ml-en">
<h3>3 · Count Good Nodes in Binary Tree — ${L.good}</h3>
<p><strong>Problem (in our words).</strong> A node is "good" if no node on the path from the root down to it has a larger value. Count them. <code>[3,1,4,3,null,1,5]</code> → 4 (the root 3, the 4, the 5, and the lower 3).</p>
<p><strong>Recognise the pattern.</strong> "On the path from the root" ⇒ information flows <em>down</em>: top-down recursion with a parameter.</p>
${gap('💡 Hint 1', '<p>What does a node need to know to decide if it is good? Only the maximum value above it.</p>')}
${gap('💡 Hint 2', '<p>Pass <code>maxSoFar</code> down; return the count of good nodes in the subtree up. Start with −∞ so the root is always good.</p>')}
${gap('✅ Step-by-step solution', '<p>Down: <code>maxSoFar</code>; up: a count — the two directions in one function. <code>&gt;=</code> not <code>&gt;</code>, because a value equal to the maximum still has "no node greater" above it (the lower 3 in the example). O(n) time, O(h) stack. Edge cases tried: <code>[3,3,null,4,2]</code> (equal values, answer 3) and all-negative <code>[-1,-2,-3]</code> where only the root is good — which is why the start value is −∞ / <code>Integer.MIN_VALUE</code> and not 0.</p>')}
</div>
<div class="ml-vi">
<h3>3 · Count Good Nodes in Binary Tree — ${L.good}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một nút là "tốt" nếu không nút nào trên đường từ gốc xuống nó có giá trị lớn hơn nó. Đếm số nút tốt. <code>[3,1,4,3,null,1,5]</code> → 4 (gốc 3, số 4, số 5, và số 3 phía dưới).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Trên đường từ gốc" ⇒ thông tin chảy <em>xuống</em>: đệ quy từ trên xuống có tham số.</p>
${gap('💡 Gợi ý 1', '<p>Một nút cần biết gì để tự quyết mình có tốt không? Chỉ cần giá trị lớn nhất phía trên nó.</p>')}
${gap('💡 Gợi ý 2', '<p>Truyền <code>maxSoFar</code> xuống; trả số nút tốt trong cây con lên. Bắt đầu bằng −∞ để gốc luôn tốt.</p>')}
${gap('✅ Lời giải từng bước', '<p>Xuống: <code>maxSoFar</code>; lên: một con số đếm — hai chiều trong cùng một hàm. Dùng <code>&gt;=</code> chứ không <code>&gt;</code>, vì giá trị bằng max vẫn là "không có nút nào lớn hơn" phía trên (số 3 phía dưới trong ví dụ). O(n) thời gian, O(h) ngăn xếp. Ca biên đã thử: <code>[3,3,null,4,2]</code> (giá trị bằng nhau, đáp án 3) và toàn số âm <code>[-1,-2,-3]</code> chỉ gốc là tốt — lý do giá trị khởi đầu là −∞ / <code>Integer.MIN_VALUE</code> chứ không phải 0.</p>')}
</div>
${oCay([3, 1, 4, 3, null, 1, 5], { to: { 4: 'ok', 5: 'ok' } })}
${maHai('ch05/good-nodes.ts', 'ch05/GoodNodes.java', { vung: 'giai' })}
${ketQua('ch05/good-nodes.ts')}

<div class="ml-en">
<h3>4 · Lowest Common Ancestor of a Binary Tree — ${L.lca}</h3>
<p><strong>Problem (in our words).</strong> Same as lesson 5.3, but the tree is <em>not</em> a BST, so values tell you nothing about direction. In <code>[3,5,1,6,2,0,8,null,null,7,4]</code>: LCA(5, 1) = 3, LCA(5, 4) = 5.</p>
<p><strong>Recognise the pattern.</strong> You cannot choose a side by comparing, so you must look in both subtrees and combine their reports ⇒ bottom-up recursion.</p>
${gap('💡 Hint 1', '<p>Let each call return "the node I found below me": p, q, their LCA, or null.</p>')}
${gap('💡 Hint 2', '<p>If the left call and the right call both return something, p and q are on different sides — this node is the answer. If only one side returns something, pass it up unchanged.</p>')}
${gap('✅ Step-by-step solution', '<p>Base case: null, or the node is p or q — return it (if q is below p, p is already the answer and we never need to look further). Post-order combine as in hint 2. O(n) time, O(h) stack. In Java compare <em>nodes</em> with <code>==</code> (the problem gives node references), not values. Edge cases tried: one node is the ancestor of the other (5, 4 → 5), both deep on different sides (7, 8 → 3), and p = q (7, 7 → 7).</p>')}
</div>
<div class="ml-vi">
<h3>4 · Lowest Common Ancestor of a Binary Tree — ${L.lca}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Như bài 5.3, nhưng cây <em>không</em> phải BST, nên giá trị không cho biết phải đi hướng nào. Trong <code>[3,5,1,6,2,0,8,null,null,7,4]</code>: LCA(5, 1) = 3, LCA(5, 4) = 5.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Không chọn được phía bằng phép so sánh, nên phải tìm ở cả hai cây con rồi gộp báo cáo của chúng ⇒ đệ quy từ dưới lên.</p>
${gap('💡 Gợi ý 1', '<p>Cho mỗi lời gọi trả về "nút tôi tìm được bên dưới": p, q, LCA của chúng, hoặc null.</p>')}
${gap('💡 Gợi ý 2', '<p>Nếu cả lời gọi trái lẫn phải đều trả về thứ gì đó thì p và q ở hai phía khác nhau — nút này là đáp án. Nếu chỉ một phía trả về thì chuyển nguyên nó lên.</p>')}
${gap('✅ Lời giải từng bước', '<p>Điều kiện dừng: null, hoặc nút chính là p hay q — trả về nó (nếu q nằm dưới p thì p đã là đáp án, không cần tìm thêm). Gộp kiểu post-order như gợi ý 2. O(n) thời gian, O(h) ngăn xếp. Trong Java so <em>nút</em> bằng <code>==</code> (đề đưa tham chiếu nút), không so giá trị. Ca biên đã thử: một nút là tổ tiên của nút kia (5, 4 → 5), cả hai nằm sâu ở hai phía (7, 8 → 3), và p = q (7, 7 → 7).</p>')}
</div>
${oCay([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], { to: { 3: 'ok', 7: 'l', 8: 'l' } })}
${maHai('ch05/lca.ts', 'ch05/Lca.java', { vung: 'giai' })}
${ketQua('ch05/lca.ts')}

<div class="ml-en">
<h3>5 · Construct Binary Tree from Preorder and Inorder Traversal — ${L.build}</h3>
<p><strong>Problem (in our words).</strong> Given the pre-order and in-order lists of a tree with distinct values, rebuild it. <code>pre = [3,9,20,15,7]</code>, <code>in = [9,3,15,20,7]</code> → <code>[3,9,20,null,null,15,7]</code>.</p>
<p><strong>Recognise the pattern.</strong> Lesson 5.1’s three orders, read backwards: pre-order tells you <em>who the root is</em>, in-order tells you <em>who is on which side</em>.</p>
${gap('💡 Hint 1', '<p>The first value of pre-order is the root. Find it in in-order: everything to its left is the left subtree, everything to its right is the right subtree.</p>')}
${gap('💡 Hint 2', '<p>Avoid copying arrays and avoid <code>indexOf</code> (O(n) each, O(n²) total): build a map value → in-order index once, and keep one cursor into pre-order that advances every time you create a node — building the left subtree before the right.</p>')}
${gap('✅ Step-by-step solution', '<p><code>make(lo, hi)</code> builds the subtree whose values occupy <code>in[lo..hi]</code>. It takes the next pre-order value as the root, splits at its in-order index, builds left then right. Why left first? Pre-order lists the root, then the <em>whole</em> left subtree, then the right — so the cursor must be consumed in that order. O(n) time, O(n) for the map. Edge cases tried: one node, a left-leaning chain (<code>[1,2,3]</code>/<code>[3,2,1]</code>), and the lesson-5.1 tree rebuilt from its own traversals.</p>')}
</div>
<div class="ml-vi">
<h3>5 · Construct Binary Tree from Preorder and Inorder Traversal — ${L.build}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho danh sách duyệt pre-order và in-order của một cây có giá trị không trùng, dựng lại cây. <code>pre = [3,9,20,15,7]</code>, <code>in = [9,3,15,20,7]</code> → <code>[3,9,20,null,null,15,7]</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Ba thứ tự ở bài 5.1, đọc ngược lại: pre-order cho biết <em>ai là gốc</em>, in-order cho biết <em>ai ở phía nào</em>.</p>
${gap('💡 Gợi ý 1', '<p>Giá trị đầu của pre-order là gốc. Tìm nó trong in-order: mọi thứ bên trái nó là cây con trái, mọi thứ bên phải là cây con phải.</p>')}
${gap('💡 Gợi ý 2', '<p>Tránh chép mảng và tránh <code>indexOf</code> (O(n) mỗi lần, tổng O(n²)): dựng một lần map giá trị → chỉ số in-order, và giữ một con trỏ vào pre-order tiến lên mỗi khi tạo một nút — dựng cây con trái trước cây con phải.</p>')}
${gap('✅ Lời giải từng bước', '<p><code>make(lo, hi)</code> dựng cây con có các giá trị nằm ở <code>in[lo..hi]</code>. Nó lấy giá trị pre-order kế tiếp làm gốc, tách tại chỉ số in-order của gốc, dựng trái rồi phải. Vì sao trái trước? Pre-order liệt kê gốc, rồi <em>toàn bộ</em> cây con trái, rồi phải — nên con trỏ phải được tiêu theo đúng thứ tự đó. O(n) thời gian, O(n) cho map. Ca biên đã thử: một nút, sợi dây lệch trái (<code>[1,2,3]</code>/<code>[3,2,1]</code>), và cây của bài 5.1 dựng lại từ chính các phép duyệt của nó.</p>')}
</div>
${maHai('ch05/build-pre-in.ts', 'ch05/BuildPreIn.java', { vung: 'giai' })}
${ketQua('ch05/build-pre-in.ts')}

<div class="ml-en">
<h3>6 · All Nodes Distance K in Binary Tree — ${L.dist}</h3>
<p><strong>Problem (in our words).</strong> Return all values whose distance (in edges) from a given target node is exactly k. In <code>[3,5,1,6,2,0,8,null,null,7,4]</code> with target 5 and k = 2: 7, 4 (down) and 1 (up through 3).</p>
<p><strong>Recognise the pattern.</strong> "Distance" and "nodes at exactly k steps" ⇒ BFS by levels. But a tree only lets you walk down, and here you must also walk up ⇒ give every node a link to its parent and treat the tree as an undirected graph.</p>
${gap('💡 Hint 1', '<p>One pass to record <code>parent</code> for every node (a map). Then from the target, the neighbours of a node are left, right and parent.</p>')}
${gap('💡 Hint 2', '<p>Run BFS level by level for k rounds. You need a <code>seen</code> set: with parent links, child → parent → child is a cycle.</p>')}
${gap('✅ Step-by-step solution', '<p>Step 1 builds the parent map with an explicit stack (no recursion). Step 2 is lesson 5.1’s BFS with "frozen" levels, extended to three neighbours, stopping after k levels; whatever is in the frontier then is the answer. O(n) time and memory. Edge cases tried: k = 0 (only the target), a target deep in the tree going up and down again (7, 3 → 3 and 6), and k larger than any distance (8, 5 → only 7 and 4 are 5 steps away). This is the bridge to Chapter 7: once a tree has parent links, it <em>is</em> a graph.</p>')}
</div>
<div class="ml-vi">
<h3>6 · All Nodes Distance K in Binary Tree — ${L.dist}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Trả về mọi giá trị có khoảng cách (tính theo cạnh) tới một nút target cho trước đúng bằng k. Trong <code>[3,5,1,6,2,0,8,null,null,7,4]</code> với target 5 và k = 2: 7, 4 (đi xuống) và 1 (đi lên qua 3).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Khoảng cách" và "các nút cách đúng k bước" ⇒ BFS theo tầng. Nhưng cây chỉ cho đi xuống, còn đề này phải đi cả lên ⇒ cho mỗi nút một liên kết tới cha và coi cây như đồ thị vô hướng.</p>
${gap('💡 Gợi ý 1', '<p>Một lượt để ghi <code>parent</code> cho mọi nút (một map). Rồi từ target, hàng xóm của một nút là trái, phải và cha.</p>')}
${gap('💡 Gợi ý 2', '<p>Chạy BFS theo tầng k vòng. Cần một tập <code>seen</code>: có link cha thì con → cha → con là một chu trình.</p>')}
${gap('✅ Lời giải từng bước', '<p>Bước 1 dựng map cha bằng ngăn xếp tự quản (không đệ quy). Bước 2 là BFS "chốt tầng" của bài 5.1, mở rộng ra ba hàng xóm, dừng sau k tầng; thứ còn trong biên lúc đó là đáp án. O(n) thời gian và bộ nhớ. Ca biên đã thử: k = 0 (chỉ target), target nằm sâu phải đi lên rồi đi xuống lại (7, 3 → 3 và 6), và k lớn tới mức chỉ còn vài nút xa nhất (8, 5 → chỉ 7 và 4 cách đúng 5 bước). Đây là cây cầu sang Chương 7: một khi cây có link cha, nó <em>chính là</em> một đồ thị.</p>')}
${lienKet({ bai: 'dsa-7-2-bfs-dfs', title: '7.2 — BFS và DFS trên đồ thị', sub: 'Cùng BFS này, trên đồ thị thật — vì sao luôn cần tập "đã thăm"', cta: 'Xem trước' })}
</div>
${maHai('ch05/distance-k.ts', 'ch05/DistanceK.java', { vung: 'giai' })}
${ketQua('ch05/distance-k.ts')}

<div class="ml-en">
<h3>7 · House Robber III — ${L.rob}</h3>
<p><strong>Problem (in our words).</strong> Houses form a binary tree; robbing two houses joined by an edge (a parent and its child) sets off the alarm. Maximise the loot. <code>[3,2,3,null,3,null,1]</code> → 7 (3 + 3 + 1).</p>
<p><strong>Recognise the pattern.</strong> A choice at every node that depends on the choice at its neighbours ⇒ dynamic programming; on a tree, the state lives at each node and is computed bottom-up.</p>
${gap('💡 Hint 1', '<p>"Rob the root + best of the grandchildren" works but recomputes subtrees exponentially (or needs a memo map). Can one call return enough to avoid that?</p>')}
${gap('💡 Hint 2', '<p>Return a <em>pair</em>: <code>[best if I am robbed, best if I am not]</code>. Robbed ⇒ my children must be skipped; not robbed ⇒ each child picks its own better option.</p>')}
${gap('✅ Step-by-step solution', '<p>This is "what do I return to my parent?" with a two-value answer. <code>robMe = val + lSkip + rSkip</code>; <code>skipMe = max(lRob, lSkip) + max(rRob, rSkip)</code>; the answer is the max of the root’s pair. Each node once: O(n) time, O(h) stack, no memo. Edge cases tried: the empty tree (0), and <code>[4,1,null,2,null,3]</code> where the best plan skips two levels in a row (4 + 3 = 7) — a greedy "every other level" would be wrong there. Chapter 9 generalises this pattern.</p>')}
</div>
<div class="ml-vi">
<h3>7 · House Robber III — ${L.rob}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Các căn nhà xếp thành một cây nhị phân; trộm hai nhà nối nhau bằng một cạnh (cha và con) thì chuông báo động kêu. Tìm số tiền lớn nhất. <code>[3,2,3,null,3,null,1]</code> → 7 (3 + 3 + 1).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Ở mỗi nút có một lựa chọn phụ thuộc lựa chọn của hàng xóm ⇒ quy hoạch động; trên cây, trạng thái nằm ở từng nút và được tính từ dưới lên.</p>
${gap('💡 Gợi ý 1', '<p>"Trộm gốc + tốt nhất của các cháu" thì đúng nhưng tính lại các cây con theo cấp số nhân (hoặc cần map ghi nhớ). Một lời gọi có thể trả đủ thông tin để tránh việc đó không?</p>')}
${gap('💡 Gợi ý 2', '<p>Trả một <em>cặp</em>: <code>[tốt nhất nếu trộm tôi, tốt nhất nếu bỏ qua tôi]</code>. Trộm tôi ⇒ các con phải bị bỏ qua; bỏ qua tôi ⇒ mỗi con tự chọn phương án tốt hơn của nó.</p>')}
${gap('✅ Lời giải từng bước', '<p>Đây là câu "hàm trả gì cho cha?" với đáp án gồm hai giá trị. <code>robMe = val + lSkip + rSkip</code>; <code>skipMe = max(lRob, lSkip) + max(rRob, rSkip)</code>; đáp án là max của cặp tại gốc. Mỗi nút một lần: O(n) thời gian, O(h) ngăn xếp, không cần ghi nhớ. Ca biên đã thử: cây rỗng (0), và <code>[4,1,null,2,null,3]</code> nơi phương án tốt nhất bỏ qua hai tầng liền (4 + 3 = 7) — tham lam kiểu "cách một tầng lấy một tầng" sai ở đây. Chương 9 tổng quát hoá mẫu này.</p>')}
</div>
${maHai('ch05/rob3.ts', 'ch05/Rob3.java', { vung: 'giai' })}
${ketQua('ch05/rob3.ts')}

<div class="ml-en">
<h3>8 · Word Search II — ${L.ws}</h3>
<p><strong>Problem (in our words).</strong> Given a letter grid and a list of words, return the words that can be traced by moving up/down/left/right through adjacent cells without reusing a cell. In LeetCode’s 4×4 example, "oath" and "eat" can be traced; "pea" and "rain" cannot.</p>
<p><strong>Recognise the pattern.</strong> Many words checked against one input, and the search should stop as soon as a path spells something that no word starts with ⇒ a trie of the words (lesson 5.4) guiding a backtracking DFS on the grid (Chapter 8).</p>
${gap('💡 Hint 1', '<p>Running the single-word search (LC 79) once per word repeats the same grid walks. Instead, insert all words into a trie and walk the grid once from every cell, moving down the trie as you move through the grid.</p>')}
${gap('💡 Hint 2', '<p>Store the full word at its end node; when you reach it, record it and set it to null so it is reported once. Mark the current cell as used (<code>#</code>) and restore it on the way back. After a branch is finished, delete trie leaves that no longer lead to any word — later searches skip them entirely.</p>')}
${gap('✅ Step-by-step solution', '<p>For each cell, <code>dfs(r, c, parentNode)</code> looks up the cell’s letter among the children of <code>parentNode</code>; missing ⇒ prune immediately (this one line is what makes it pass). Present ⇒ maybe record a word, mark the cell, recurse into the 4 neighbours with the child node, unmark, and prune the child if it became an empty leaf. Worst case O(R·C·4·3^(L−1)) for words up to length L, but the trie cuts almost every branch in practice: the output shows 9 DFS calls for the 4×4 example. Edge cases tried: a word that would need a cell twice (<code>"abcb"</code>, not found, 2 calls), and words that are prefixes of each other (<code>"a"</code>, <code>"aa"</code>, <code>"aaa"</code> on a 1×2 grid — two found, "aaa" needs a third cell).</p>')}
</div>
<div class="ml-vi">
<h3>8 · Word Search II — ${L.ws}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho một lưới chữ và một danh sách từ, trả về những từ có thể đánh vần bằng cách đi lên/xuống/trái/phải qua các ô kề nhau mà không dùng lại ô nào. Trong ví dụ 4×4 của LeetCode, "oath" và "eat" đánh vần được; "pea" và "rain" thì không.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Nhiều từ dò trên một đầu vào, và việc dò phải dừng ngay khi đường đi đánh vần ra thứ không từ nào bắt đầu bằng ⇒ trie các từ (bài 5.4) dẫn đường cho DFS quay lui trên lưới (Chương 8).</p>
${gap('💡 Gợi ý 1', '<p>Chạy bài dò một từ (LC 79) cho từng từ là lặp lại cùng những lần đi trên lưới. Thay vào đó, chèn mọi từ vào một trie rồi đi trên lưới một lần từ mỗi ô, đi xuống trie song song với việc đi qua lưới.</p>')}
${gap('💡 Gợi ý 2', '<p>Lưu nguyên từ ở nút cuối của nó; tới đó thì ghi nhận và đặt về null để chỉ báo một lần. Đánh dấu ô đang dùng (<code>#</code>) và trả lại lúc quay lui. Xong một nhánh thì xoá các lá trie không còn dẫn tới từ nào — các lần dò sau bỏ qua hẳn chúng.</p>')}
${gap('✅ Lời giải từng bước', '<p>Với mỗi ô, <code>dfs(r, c, parentNode)</code> tìm chữ của ô trong các con của <code>parentNode</code>; không có ⇒ cắt nhánh ngay (chính dòng này giúp bài qua được). Có ⇒ có thể ghi nhận một từ, đánh dấu ô, đệ quy sang 4 ô kề với nút con, bỏ đánh dấu, và cắt nút con nếu nó thành lá rỗng. Xấu nhất O(R·C·4·3^(L−1)) với từ dài tối đa L, nhưng thực tế trie chặt gần hết các nhánh: output cho thấy chỉ 9 lời gọi DFS cho ví dụ 4×4. Ca biên đã thử: một từ cần dùng lại một ô (<code>"abcb"</code>, không tìm thấy, 2 lời gọi), và các từ là tiền tố của nhau (<code>"a"</code>, <code>"aa"</code>, <code>"aaa"</code> trên lưới 1×2 — tìm được hai, "aaa" cần ô thứ ba).</p>')}
${lienKet({ bai: 'dsa-8-3-cat-nhanh', title: '8.3 — Cắt nhánh', sub: 'Word Search (một từ), N-Queens, Sudoku — đo số nút duyệt có và không cắt nhánh', cta: 'Xem trước' })}
</div>
${maHai('ch05/word-search2.ts', 'ch05/WordSearch2.java', { vung: 'giai' })}
${ketQua('ch05/word-search2.ts')}
${ketQua('ch05/WordSearch2.java')}

<div class="ml-en">
<h3>🧪 Practice (one or two sessions)</h3>
<div class="callout ok"><ol>
<li>Do the eight problems in order with a timer. Before each, write the one-sentence plan ("returns ___ / receives ___").</li>
<li>Submit each on LeetCode. Any problem over its target time goes into your notebook with the reason (did not see the pattern / slow to code / bug).</li>
<li>Redo problems 4, 5 and 8 two days later without looking — spaced repetition.</li>
<li>For problem 2, run the no-delimiter serialize on <code>[12]</code> and <code>[2]</code> yourself and explain the false positive in one sentence.</li>
</ol>
<p><strong>Done when:</strong> eight accepted submissions, each within or near its target time, and the notebook lists every miss with its reason.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mirror</span><span class="v">Left of one side matches right of the other (Symmetric Tree).</span></div>
  <div class="kv"><span class="k">parent map</span><span class="v">A node → parent dictionary that lets you walk up a tree.</span></div>
  <div class="kv"><span class="k">tree DP</span><span class="v">Dynamic programming whose states live at the nodes and are combined bottom-up.</span></div>
  <div class="kv"><span class="k">pruning</span><span class="v">Stopping a search branch that cannot lead to an answer.</span></div>
  <div class="kv"><span class="k">delimiter</span><span class="v">A separator that keeps tokens from merging when serialized ("12" vs "2").</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Two-tree recursion: Same Tree, Symmetric, Subtree — the base case is "one of them is null".</li>
<li>Top-down passes what the path above knows (max so far); bottom-up returns what the subtree found (LCA, pairs).</li>
<li>Pre-order gives roots, in-order gives sides: together they rebuild a tree.</li>
<li>Parent links turn a tree into a graph; then BFS needs a visited set.</li>
<li>A trie can steer a backtracking search and prune it.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees and Tries', 'The same problems in the standard order, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('🧭', 'VisuAlgo — Binary Search Tree', 'Animate insert, search, delete and traversals on your own trees', 'https://visualgo.net/en/bst')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (một hoặc hai buổi)</h3>
<div class="callout ok"><ol>
<li>Làm tám đề theo thứ tự, có bấm giờ. Trước mỗi đề, viết kế hoạch một câu ("trả ___ / nhận ___").</li>
<li>Nộp từng đề trên LeetCode. Đề nào quá thời gian mục tiêu thì ghi vào sổ kèm lý do (không nhận ra mẫu / code chậm / lỗi).</li>
<li>Hai ngày sau làm lại đề 4, 5 và 8 mà không nhìn — ôn lặp ngắt quãng.</li>
<li>Với đề 2, tự chạy bản tuần tự hoá không dấu ngăn trên <code>[12]</code> và <code>[2]</code> rồi giải thích kết quả dương tính giả trong một câu.</li>
</ol>
<p><strong>Đạt khi:</strong> tám lượt nộp Accepted, mỗi đề trong hoặc sát thời gian mục tiêu, và sổ ghi đủ mọi lần trượt kèm lý do.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">mirror (ảnh gương)</span><span class="v">Bên trái của phía này khớp bên phải của phía kia (Symmetric Tree).</span></div>
  <div class="kv"><span class="k">parent map (map cha)</span><span class="v">Từ điển nút → cha giúp đi ngược lên trên cây.</span></div>
  <div class="kv"><span class="k">tree DP (quy hoạch động trên cây)</span><span class="v">Quy hoạch động có trạng thái nằm ở các nút, gộp từ dưới lên.</span></div>
  <div class="kv"><span class="k">pruning (cắt nhánh)</span><span class="v">Dừng một nhánh tìm kiếm không thể dẫn tới đáp án.</span></div>
  <div class="kv"><span class="k">delimiter (dấu ngăn)</span><span class="v">Ký tự phân cách giữ các phần tử khỏi dính vào nhau khi tuần tự hoá ("12" và "2").</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Đệ quy hai cây: Same Tree, Symmetric, Subtree — điều kiện dừng là "một trong hai là null".</li>
<li>Từ trên xuống truyền thứ đoạn đường phía trên biết (max tới giờ); từ dưới lên trả thứ cây con tìm được (LCA, cặp giá trị).</li>
<li>Pre-order cho gốc, in-order cho phía: ghép lại dựng được cây.</li>
<li>Link cha biến cây thành đồ thị; khi đó BFS cần tập đã thăm.</li>
<li>Trie có thể dẫn đường và cắt nhánh cho một lần quay lui.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees and Tries', 'Cùng các đề này theo thứ tự chuẩn, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('🧭', 'VisuAlgo — Binary Search Tree', 'Xem động chèn, tìm, xoá và các phép duyệt trên cây của chính bạn', 'https://visualgo.net/en/bst')}
</div>
`,
};
