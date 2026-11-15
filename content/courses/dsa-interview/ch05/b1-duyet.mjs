/** 5.1 — Duyệt cây: DFS và BFS. Mọi mã/output đọc từ ../ma/ch05 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { oCay, oDay } from './_rieng.mjs';
import { vetInorderLap } from '../ma/ch05/inorder-lap.vet.mjs';
import { vetLevelOrder } from '../ma/ch05/level-order.vet.mjs';

const T = [1, 2, 3, 4, 5, null, 6];

const vIn = vetInorderLap(T);
const BANG_IN = bangVet(['#', 'action', 'cur (after)', 'stack (bottom → top)', 'output so far'],
  vIn.map((h, k) => [
    String(k + 1),
    h.action.kind === 'push' ? `push ${h.action.v}, go left` : `<strong>pop ${h.action.v}</strong> → write it, go right`,
    h.cur === null ? '<code>null</code>' : String(h.cur),
    oDay(h.stack, { to: h.stack.length ? { [h.stack.length - 1]: 'l' } : {} }),
    oDay(h.out, { to: h.action.kind === 'pop' ? { [h.out.length - 1]: 'ok' } : {} }),
  ]));
const MAX_STACK = Math.max(...vIn.map((h) => h.stack.length));

const vLv = vetLevelOrder(T);
const BANG_LV = bangVet(['level', 'k / size', 'dequeue', 'enqueue', 'queue after (front → back)', 'level so far'],
  vLv.map((h) => [
    String(h.lv),
    `${h.k + 1} / ${h.size}`,
    `<strong>${h.node}</strong>`,
    h.kids.length ? h.kids.join(', ') : '—',
    oDay(h.queue, { to: Object.fromEntries(h.queue.map((v, i) => [i, h.kids.includes(v) ? 'r' : 'cs'])) }),
    h.done ? `✅ ${oMang(h.level, { to: Object.fromEntries(h.level.map((_, i) => [i, 'ok'])) })}` : oMang(h.level),
  ]));

const DE = [
  [lc(144, 'binary-tree-preorder-traversal', 'Binary Tree Preorder Traversal', 'Easy'), 'Write it twice: recursive, then with an explicit stack (push right before left).', 'Viết hai lần: đệ quy, rồi bằng ngăn xếp tự quản (đẩy phải trước trái).'],
  [lc(94, 'binary-tree-inorder-traversal', 'Binary Tree Inorder Traversal', 'Easy'), 'The iterative version is the one interviewers ask for: "slide left, pop, go right".', 'Bản lặp mới là bản người phỏng vấn hỏi: "trượt trái, lấy ra, sang phải".'],
  [lc(145, 'binary-tree-postorder-traversal', 'Binary Tree Postorder Traversal', 'Easy'), 'Reverse of (root, right, left). Be ready to explain why that works.', 'Đảo ngược của (gốc, phải, trái). Sẵn sàng giải thích vì sao đúng.'],
  [lc(102, 'binary-tree-level-order-traversal', 'Binary Tree Level Order Traversal', 'Medium'), '"Level by level" ⇒ queue + freeze the size of the level.', '"Theo từng tầng" ⇒ hàng đợi + chốt cỡ tầng.'],
  [lc(107, 'binary-tree-level-order-traversal-ii', 'Binary Tree Level Order Traversal II', 'Medium'), 'Same BFS, reverse the list of levels at the end (do not insert at the front of an array).', 'Cùng BFS, đảo danh sách tầng ở cuối (đừng chèn vào đầu mảng).'],
  [lc(637, 'average-of-levels-in-binary-tree', 'Average of Levels in Binary Tree', 'Easy'), 'Per-level aggregate: sum / size inside the level loop.', 'Gom theo tầng: tổng / size ngay trong vòng của tầng.'],
  [lc(515, 'find-largest-value-in-each-tree-row', 'Find Largest Value in Each Tree Row', 'Medium'), 'Per-level max; values can be negative, so start from the first node, not 0.', 'Lớn nhất mỗi tầng; giá trị có thể âm nên khởi tạo bằng nút đầu, không bằng 0.'],
  [lc(199, 'binary-tree-right-side-view', 'Binary Tree Right Side View', 'Medium'), 'Last node of each level (BFS) or first node at each new depth with right-first DFS.', 'Nút cuối mỗi tầng (BFS) hoặc nút đầu tiên ở mỗi độ sâu mới khi DFS ưu tiên phải.'],
  [lc(103, 'binary-tree-zigzag-level-order-traversal', 'Binary Tree Zigzag Level Order Traversal', 'Medium'), 'The queue order never changes; only where you write each value does.', 'Thứ tự hàng đợi không đổi; chỉ đổi chỗ GHI giá trị.'],
  [lc(429, 'n-ary-tree-level-order-traversal', 'N-ary Tree Level Order Traversal', 'Medium'), 'Same template with a loop over children instead of left/right.', 'Cùng khuôn, thay trái/phải bằng vòng lặp qua danh sách con.'],
];

export default {
  title: '5.1 — Tree traversals: DFS (pre/in/post) and BFS by levels|||5.1 — Duyệt cây: DFS (trước/giữa/sau) và BFS theo tầng',
  slug: 'dsa-5-1-duyet',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc cây kiểu LeetCode, ba thứ tự DFS là cùng một lần đi chỉ khác lúc ghi, bản lặp bằng ngăn xếp, BFS theo tầng với hàng đợi — kèm bảng vết, mô phỏng và bẫy queue.length.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Tree traversals: DFS (pre/in/post) and BFS by levels</h2>
<p class="lead">Almost every tree problem in an interview is a traversal with one extra line. "Maximum depth" is a traversal that remembers a number. "Right side view" is a level traversal that keeps the last node. "Validate a BST" is an in-order traversal that checks the order. So before any clever idea, you need four traversals you can write without thinking — recursively <em>and</em> with your own stack or queue — and you need to know which one a problem is asking for. That is this lesson.</p>

<h3>The everyday picture: the folder tree on your laptop</h3>
<p>Open File Explorer on drive D: you see <code>FPT</code>, inside it <code>SP27</code>, inside that <code>CSD201</code>, <code>SWP391</code>… That is a tree. There is one top folder (the <strong>root</strong>), every folder lives inside exactly one parent, and the files at the bottom with nothing inside them are the <strong>leaves</strong>. Now think about three jobs you have actually done:</p>
<ul>
<li><strong>Copy</strong> the whole <code>SP27</code> folder to a USB stick. You must create a folder <em>before</em> you can put anything in it: parent first, then children. That is <strong>pre-order</strong>.</li>
<li><strong>Delete</strong> it. The operating system cannot remove a folder that still contains things, so it empties the children first and removes the parent last. Same for "how big is this folder?" — you need the sizes of the children before you can add them up. That is <strong>post-order</strong>.</li>
<li>Look at your class list <strong>level by level</strong>: first the faculty, then the majors, then the classes. You finish one level before going one step deeper. That is <strong>breadth-first search (BFS)</strong> by levels.</li>
</ul>
<p>Formally: a <strong>tree</strong> is a set of nodes connected by edges, with no cycles, where every node except the root has exactly one parent. A <strong>binary tree</strong> gives each node at most two children, called left and right. The <strong>depth</strong> of a node is the number of edges from the root down to it; the <strong>height</strong> of the tree is the largest depth (some books count nodes instead of edges — say which one you use). A <strong>subtree</strong> is a node together with everything below it; this is why tree code is naturally recursive: the left child is itself the root of a smaller tree.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Duyệt cây: DFS (trước/giữa/sau) và BFS theo tầng</h2>
<p class="lead">Gần như mọi đề cây trong phỏng vấn đều là <strong>một phép duyệt cộng thêm một dòng</strong>. "Độ sâu lớn nhất" là một lần duyệt có nhớ một con số. "Nhìn cây từ bên phải" là duyệt theo tầng rồi giữ nút cuối. "Kiểm cây nhị phân tìm kiếm hợp lệ" là duyệt giữa (in-order) rồi kiểm thứ tự. Nên trước mọi ý tưởng thông minh, bạn cần bốn phép duyệt viết được không cần nghĩ — bằng đệ quy <em>và</em> bằng ngăn xếp/hàng đợi tự quản — và cần biết đề đang đòi phép nào. Đó là bài này.</p>

<h3>Hình dung đời thường: cây thư mục trên laptop</h3>
<p>Mở File Explorer, vào ổ D: bạn thấy <code>FPT</code>, trong đó là <code>SP27</code>, trong nữa là <code>CSD201</code>, <code>SWP391</code>… Đó chính là một cây. Có đúng một thư mục trên cùng (<strong>gốc</strong> — root), mỗi thư mục nằm trong đúng một thư mục cha, và các tệp dưới đáy không chứa gì nữa là <strong>lá</strong> (leaf). Giờ nghĩ tới ba việc bạn đã từng làm thật:</p>
<ul>
<li><strong>Chép</strong> cả thư mục <code>SP27</code> sang USB. Phải tạo thư mục <em>trước</em> rồi mới bỏ được gì vào trong: cha trước, con sau. Đó là <strong>pre-order</strong> (duyệt trước — ghi nút trước khi xuống con).</li>
<li><strong>Xoá</strong> nó. Hệ điều hành không xoá được thư mục còn chứa đồ, nên nó dọn sạch các con trước rồi mới xoá cha. Câu hỏi "thư mục này nặng bao nhiêu?" cũng vậy — phải biết dung lượng các con rồi mới cộng lại được. Đó là <strong>post-order</strong> (duyệt sau — ghi nút sau khi xong hết con).</li>
<li>Xem danh sách lớp <strong>theo từng tầng</strong>: trước hết là các khoa, rồi các ngành, rồi các lớp. Xong trọn một tầng mới xuống tầng kế. Đó là <strong>BFS</strong> (breadth-first search — tìm kiếm theo chiều rộng) theo tầng.</li>
</ul>
<p>Nói cho chuẩn: <strong>cây</strong> (tree) là một tập nút nối với nhau bằng cạnh (edge), không có chu trình, và mọi nút trừ gốc có đúng một cha (parent). <strong>Cây nhị phân</strong> (binary tree) cho mỗi nút tối đa hai con, gọi là con trái và con phải. <strong>Độ sâu</strong> (depth) của một nút là số cạnh từ gốc xuống nó; <strong>chiều cao</strong> (height) của cây là độ sâu lớn nhất (có sách đếm số nút thay vì số cạnh — khi phỏng vấn hãy nói rõ bạn đếm kiểu nào). <strong>Cây con</strong> (subtree) là một nút cùng mọi thứ nằm dưới nó; đây là lý do code về cây tự nhiên là đệ quy: con trái của một nút chính là gốc của một cây nhỏ hơn.</p>
${csd('csd201-duyet-cay', 'vi', '4.3 Bốn phép duyệt & cây biểu thức', '<p>Ở CSD201 bạn đã học bốn phép duyệt (trước, giữa, sau, theo tầng) và dùng chúng trên cây biểu thức (in-order ra biểu thức trung tố, post-order ra ký pháp Ba Lan ngược). Ôn nhanh một câu: ba phép DFS khác nhau DUY NHẤT ở chỗ "ghi nút lúc nào". <strong>Ở đây đi sâu thêm:</strong> đọc cây từ mảng kiểu LeetCode, bản lặp của cả ba phép DFS (thứ người phỏng vấn hỏi khi bạn đã viết xong bản đệ quy), mẹo chốt cỡ tầng của BFS, và cách nhận ra đề nào cần phép duyệt nào.</p>')}
</div>

<div class="ml-en">
<h3>Reading a tree the way LeetCode gives it</h3>
<p>LeetCode never gives you a picture. It gives an array like <code>[1,2,3,4,5,null,6]</code>: the tree written <strong>level by level, left to right</strong>, with <code>null</code> for a missing child. To turn it back into nodes, use a queue: the root is the first value; then each node taken from the queue claims the next two slots as its left and right child. Every file in this chapter starts with this <code>build</code> function, so you can paste any LeetCode example and run it:</p>
</div>
<div class="ml-vi">
<h3>Đọc cây theo cách LeetCode đưa cho bạn</h3>
<p>LeetCode không bao giờ đưa hình vẽ. Nó đưa một mảng kiểu <code>[1,2,3,4,5,null,6]</code>: cây được viết <strong>theo từng tầng, từ trái sang phải</strong>, chỗ thiếu con ghi <code>null</code>. Muốn dựng lại thành các nút, dùng một hàng đợi (queue): giá trị đầu là gốc; rồi mỗi nút lấy ra khỏi hàng đợi nhận hai ô kế tiếp làm con trái và con phải. Mọi tệp mã trong chương này đều mở đầu bằng hàm <code>build</code> này, nên bạn dán bất kỳ ví dụ LeetCode nào vào là chạy được:</p>
</div>
${maHai('ch05/traversals.ts', 'ch05/Traversals.java', { vung: 'dung' })}
<div class="ml-en">
<p>Here are the two trees we use all lesson. Left: <code>[1,2,3,4,5,null,6]</code> (node 3 has no left child, so its slot is <code>null</code>). Right: LeetCode’s favourite example <code>[3,9,20,null,null,15,7]</code> (node 9 is a leaf, so it contributes two <code>null</code>s).</p>
</div>
<div class="ml-vi">
<p>Đây là hai cây dùng suốt bài. Bên trái: <code>[1,2,3,4,5,null,6]</code> (nút 3 không có con trái nên ô của nó là <code>null</code>). Bên phải: ví dụ LeetCode dùng nhiều nhất <code>[3,9,20,null,null,15,7]</code> (nút 9 là lá nên góp hai <code>null</code>).</p>
</div>
<div style="display:flex;flex-wrap:wrap;gap:1rem">
<div style="flex:1 1 220px">${oCay(T)}</div>
<div style="flex:1 1 220px">${oCay([3, 9, 20, null, null, 15, 7])}</div>
</div>
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>The array is NOT heap indexing.</strong></p><p>In a heap (Chapter 6), the children of index <code>i</code> sit at <code>2i+1</code> and <code>2i+2</code>. In LeetCode’s format that is only true while there are no <code>null</code>s, because the children of a missing node are simply <em>not written</em>. In <code>[1,null,2,3]</code>, the value 3 is the left child of 2, not "the node at index 3 of a full tree". If you build trees by <code>2i+1</code> you will pass the first examples and fail the hidden tests. Use the queue.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Mảng này KHÔNG phải đánh chỉ số kiểu heap.</strong></p><p>Ở heap (Chương 6), con của chỉ số <code>i</code> nằm ở <code>2i+1</code> và <code>2i+2</code>. Trong định dạng LeetCode điều đó chỉ đúng khi chưa có <code>null</code> nào, vì con của một nút không tồn tại thì đơn giản là <em>không được ghi ra</em>. Trong <code>[1,null,2,3]</code>, giá trị 3 là con trái của 2, chứ không phải "nút ở chỉ số 3 của một cây đầy đủ". Dựng cây bằng <code>2i+1</code> thì bạn qua các ví dụ đầu rồi trượt test ẩn. Hãy dùng hàng đợi.</p></div>
</div>
${oCay([1, null, 2, 3], { to: { 3: 'l' } })}

<div class="ml-en">
<h3>Signals: which traversal is the problem asking for?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"level", "row", "layer", "each depth", "zigzag"</span><span class="v">BFS with a queue, one inner loop per level. Also "minimum depth" / "closest leaf": BFS stops at the first leaf it meets, DFS has to explore everything.</span></div>
  <div class="kv"><span class="k">"seen from the right/left", "boundary"</span><span class="v">Level traversal keeping the first or last node per level (or DFS with a depth parameter).</span></div>
  <div class="kv"><span class="k">"sorted order", "k-th smallest", a BST</span><span class="v">In-order: in a binary search tree it visits values in increasing order (lesson 5.3).</span></div>
  <div class="kv"><span class="k">"copy", "serialize", "print as written", "path from the root"</span><span class="v">Pre-order: you handle a node before its children, so the parent is known when the children are built.</span></div>
  <div class="kv"><span class="k">"size", "height", "sum of the subtree", "delete", "is it balanced"</span><span class="v">Post-order: the answer for a node needs the answers of its children first (lesson 5.2).</span></div>
  <div class="kv"><span class="k">constraints: up to 10⁴ or 10⁵ nodes, no promise of balance</span><span class="v">The tree can be a single long chain, so its height can equal n. Recursion depth = height ⇒ think about the iterative version (and lesson 5.2 measures where recursion breaks).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: đề đang đòi phép duyệt nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"level", "row", "layer", "mỗi độ sâu", "zigzag"</span><span class="v">BFS với hàng đợi, mỗi tầng một vòng lặp trong. Cả "độ sâu nhỏ nhất" / "lá gần gốc nhất": BFS dừng ngay ở lá đầu tiên gặp, còn DFS phải đi hết.</span></div>
  <div class="kv"><span class="k">"nhìn từ phải/trái", "đường biên"</span><span class="v">Duyệt theo tầng, giữ nút đầu hoặc nút cuối mỗi tầng (hoặc DFS có tham số độ sâu).</span></div>
  <div class="kv"><span class="k">"thứ tự tăng dần", "nhỏ thứ k", có chữ BST</span><span class="v">In-order: trên cây nhị phân tìm kiếm, nó đi qua các giá trị theo thứ tự tăng dần (bài 5.3).</span></div>
  <div class="kv"><span class="k">"sao chép", "serialize" (tuần tự hoá), "in như lúc viết", "đường đi từ gốc"</span><span class="v">Pre-order: xử lý nút trước các con, nên lúc dựng con thì đã biết cha.</span></div>
  <div class="kv"><span class="k">"kích thước", "chiều cao", "tổng cây con", "xoá", "có cân bằng không"</span><span class="v">Post-order: đáp án của một nút cần đáp án của các con trước (bài 5.2).</span></div>
  <div class="kv"><span class="k">ràng buộc: tới 10⁴ hay 10⁵ nút, không hứa cây cân bằng</span><span class="v">Cây có thể là một sợi dây dài, chiều cao bằng n. Độ sâu đệ quy = chiều cao ⇒ nghĩ tới bản lặp (bài 5.2 đo thật chỗ đệ quy gãy).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Depth-first: three orders are ONE walk</h3>
<p>Here is the idea that makes the three DFS orders easy to remember: there is only one walk. The recursion arrives at a node, goes down the left subtree, comes back, goes down the right subtree, comes back, and leaves. Each node is "touched" at three moments. The three orders differ only in <strong>which moment you write the value down</strong>:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Enter the node</span><span class="lz-d">Pre-order writes here: root, left, right.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Walk the left subtree</span><span class="lz-d">The same three moments happen inside it, recursively.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Back between the children</span><span class="lz-d">In-order writes here: left, root, right.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Walk the right subtree</span><span class="lz-d">Again recursively.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Leave the node</span><span class="lz-d">Post-order writes here: left, right, root.</span></div>
</div>
<p>So the three functions below are character-for-character the same except for the position of one line. When an interviewer asks for "post-order", you do not recall a new algorithm; you move one line.</p>
</div>
<div class="ml-vi">
<h3>Theo chiều sâu: ba thứ tự là MỘT lần đi</h3>
<p>Đây là ý giúp ba thứ tự DFS (depth-first search — tìm kiếm theo chiều sâu) dễ nhớ: thật ra chỉ có một lần đi. Đệ quy tới một nút, đi xuống cây con trái, quay lại, đi xuống cây con phải, quay lại, rồi rời đi. Mỗi nút được "chạm" ở ba thời điểm. Ba thứ tự chỉ khác nhau ở chỗ <strong>ghi giá trị xuống vào thời điểm nào</strong>:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Vào nút</span><span class="lz-d">Pre-order ghi ở đây: gốc, trái, phải.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đi cây con trái</span><span class="lz-d">Bên trong nó lại có đủ ba thời điểm, đệ quy.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Quay về, đứng giữa hai con</span><span class="lz-d">In-order ghi ở đây: trái, gốc, phải.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đi cây con phải</span><span class="lz-d">Lại đệ quy.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Rời nút</span><span class="lz-d">Post-order ghi ở đây: trái, phải, gốc.</span></div>
</div>
<p>Vì vậy ba hàm dưới đây giống nhau từng ký tự, chỉ khác vị trí của một dòng. Khi người phỏng vấn bảo "viết post-order", bạn không phải nhớ một thuật toán mới; bạn dời một dòng.</p>
</div>
${maHai('ch05/traversals.ts', 'ch05/Traversals.java', { vung: 'de-quy' })}
${ketQua('ch05/traversals.ts')}
${ketQua('ch05/Traversals.java')}
<div class="ml-en">
<p>Check the first tree by hand against the picture: pre-order <code>[1,2,4,5,3,6]</code> reads "every node before anything below it"; in-order <code>[4,2,5,1,3,6]</code> is the tree squashed flat from left to right (each node lands between its left and right subtree); post-order <code>[4,5,2,6,3,1]</code> ends with the root, because the root is the last thing you leave. The empty tree prints three empty lists — the base case <code>root === null</code> is doing all the work. Watch the single walk produce all three lists, step by step:</p>
${moPhong('ch05/dfs-3-thu-tu.sim.js', 'en', 'One DFS walk, three orders — step by step', 'The tree [1,2,3,4,5,null,6] on /algorithms: each node lights up on enter, is marked between its children, and is released on leave; the log prints pre/in/post as they grow.')}
</div>
<div class="ml-vi">
<p>Đối chiếu cây thứ nhất với hình vẽ: pre-order <code>[1,2,4,5,3,6]</code> đọc là "mỗi nút đứng trước mọi thứ nằm dưới nó"; in-order <code>[4,2,5,1,3,6]</code> là cây bị ép dẹt từ trái sang phải (mỗi nút rơi vào giữa cây con trái và cây con phải của nó); post-order <code>[4,5,2,6,3,1]</code> kết thúc bằng gốc, vì gốc là nút cuối cùng bạn rời khỏi. Cây rỗng in ra ba danh sách rỗng — điều kiện dừng <code>root === null</code> lo hết. Xem một lần đi duy nhất sinh ra cả ba danh sách, từng bước một:</p>
${moPhong('ch05/dfs-3-thu-tu.sim.js', 'vi', 'Một lần DFS, ba thứ tự — chạy từng bước', 'Cây [1,2,3,4,5,null,6] trên /algorithms: nút sáng lên khi vào, được đánh dấu khi đứng giữa hai con, nhả ra khi rời; ô log in ba dãy pre/in/post lớn dần.')}
</div>

<div class="ml-en">
<h3>Without recursion: your own stack</h3>
<p>Recursion uses the <strong>call stack</strong> — the memory where the language keeps "which function was I in, and where do I continue". A tree of height h needs h frames. On a balanced tree with 10⁵ nodes that is about 17; on a tree shaped like a chain it is 10⁵, and lesson 5.2 shows with real numbers that Node and Java crash long before that. The cure is to keep the stack yourself, in an array on the heap, which can hold millions of entries. Interviewers also ask for these versions simply to see whether you understand what recursion was doing for you.</p>
<p><strong>Pre-order</strong> is the easy one: pop a node, write it, push its children. Because a stack is last-in-first-out, push the <em>right</em> child first so the <em>left</em> one comes out first.</p>
</div>
<div class="ml-vi">
<h3>Không dùng đệ quy: tự cầm ngăn xếp</h3>
<p>Đệ quy dùng <strong>call stack</strong> (ngăn xếp lời gọi) — vùng nhớ nơi ngôn ngữ ghi "đang ở trong hàm nào, quay lại thì chạy tiếp từ đâu". Cây cao h cần h khung (frame). Cây cân bằng 10⁵ nút thì khoảng 17; cây có hình một sợi dây thì là 10⁵, và bài 5.2 cho thấy bằng số đo thật rằng Node và Java sập từ lâu trước con số đó. Cách chữa là tự giữ ngăn xếp, trong một mảng trên heap, chứa được hàng triệu phần tử. Người phỏng vấn cũng hỏi các bản này chỉ để xem bạn có hiểu đệ quy đã làm hộ mình những gì.</p>
<p><strong>Pre-order</strong> là bản dễ: lấy một nút ra, ghi nó, đẩy các con vào. Vì ngăn xếp là vào-sau-ra-trước (LIFO), hãy đẩy con <em>phải</em> trước để con <em>trái</em> ra trước.</p>
</div>
${maHai('ch05/traversals.ts', 'ch05/Traversals.java', { vung: 'pre-lap' })}
<div class="ml-en">
<p><strong>In-order</strong> is the one that is asked most, because it is the backbone of BST problems. The rhythm is three moves: <em>slide down-left as far as you can, pushing every node on the way; pop one (it is the leftmost node not yet written) and write it; step into its right subtree and repeat</em>. The outer condition <code>cur !== null || stack.length &gt; 0</code> means "there is still a subtree to slide into, or a parent waiting to be written".</p>
</div>
<div class="ml-vi">
<p><strong>In-order</strong> là bản bị hỏi nhiều nhất, vì nó là xương sống của các đề BST. Nhịp của nó là ba động tác: <em>trượt xuống bên trái hết mức, đẩy mọi nút gặp trên đường vào ngăn xếp; lấy ra một nút (đó là nút trái nhất chưa được ghi) và ghi nó; bước sang cây con phải của nó rồi lặp lại</em>. Điều kiện vòng ngoài <code>cur !== null || stack.length &gt; 0</code> nghĩa là "vẫn còn một cây con để trượt vào, hoặc còn một nút cha đang chờ được ghi".</p>
</div>
${maHai('ch05/traversals.ts', 'ch05/Traversals.java', { vung: 'in-lap' })}
<div class="ml-en">
<h3>Watch the stack: iterative in-order on [1,2,3,4,5,null,6]</h3>
<p>One row per push or pop, produced by running the algorithm. Blue = top of the stack; green = the value just written.</p>
</div>
<div class="ml-vi">
<h3>Nhìn ngăn xếp: in-order bản lặp trên [1,2,3,4,5,null,6]</h3>
<p>Mỗi hàng là một lần đẩy vào hoặc lấy ra, sinh ra bằng cách chạy thuật toán thật. Ô xanh dương = đỉnh ngăn xếp; ô xanh lá = giá trị vừa ghi.</p>
</div>
${BANG_IN}
<div class="ml-en">
<p>Read the first three rows: we slide 1 → 2 → 4 and the stack is exactly the path from the root to the leftmost node. Row 4 pops 4 — nothing smaller is left — and writes it. Row 5 pops 2 and moves to its right child 5. Row 8 pops 1 only after its whole left subtree (4, 2, 5) has been written: that is "left, root, right" happening without any recursion. In ${vIn.length} steps every node was pushed once and popped once, and the stack never held more than ${MAX_STACK} nodes — the height of the tree plus one. That is the space bound O(h) you will state in the interview.</p>
</div>
<div class="ml-vi">
<p>Đọc ba hàng đầu: ta trượt 1 → 2 → 4, và ngăn xếp chính là đường đi từ gốc xuống nút trái nhất. Hàng 4 lấy 4 ra — không còn gì nhỏ hơn — và ghi nó. Hàng 5 lấy 2 ra rồi bước sang con phải là 5. Hàng 8 chỉ lấy 1 ra khi toàn bộ cây con trái (4, 2, 5) đã được ghi: đó chính là "trái, gốc, phải" diễn ra mà không cần đệ quy. Sau ${vIn.length} bước, mọi nút được đẩy vào đúng một lần và lấy ra đúng một lần, và ngăn xếp chưa bao giờ giữ quá ${MAX_STACK} nút — bằng chiều cao của cây cộng một. Đó chính là cận bộ nhớ O(h) bạn sẽ nói khi phỏng vấn.</p>
</div>
<div class="ml-en">
<p><strong>Post-order</strong> iteratively has a neat trick: post-order is left, right, root. Reverse it and you get root, right, left — which is just pre-order with the two pushes swapped. So run that "mirrored pre-order" and reverse the output (Java’s <code>addFirst</code> on a <code>LinkedList</code> does the reversal as it goes). If the interviewer then asks for a version that does not reverse — because they want to process nodes in true post-order, for example to free memory — the follow-up is a single stack plus a <code>prev</code> pointer remembering which child you just came back from. Know that it exists; write the reverse trick first.</p>
</div>
<div class="ml-vi">
<p><strong>Post-order</strong> bản lặp có một mẹo gọn: post-order là trái, phải, gốc. Đảo ngược lại là gốc, phải, trái — mà đó chỉ là pre-order với hai lệnh đẩy đổi chỗ cho nhau. Vậy hãy chạy "pre-order soi gương" đó rồi đảo ngược kết quả (trong Java, <code>addFirst</code> của <code>LinkedList</code> đảo luôn trong lúc chạy). Nếu người phỏng vấn hỏi tiếp bản không đảo ngược — vì họ muốn xử lý nút theo đúng thứ tự post-order thật, chẳng hạn để giải phóng bộ nhớ — câu trả lời là một ngăn xếp cộng một con trỏ <code>prev</code> nhớ xem mình vừa quay về từ con nào. Biết là có cách đó; khi làm bài thì viết mẹo đảo ngược trước.</p>
</div>
${maHai('ch05/traversals.ts', 'ch05/Traversals.java', { vung: 'post-lap' })}

<div class="ml-en">
<h3>Worked example: Level Order Traversal (BFS)</h3>
<p><strong>Problem (in our words).</strong> Return the values of a binary tree grouped by level, top to bottom, each level left to right. For <code>[3,9,20,null,null,15,7]</code> the answer is <code>[[3],[9,20],[15,7]]</code>.</p>
<p><strong>Step 1 — a first answer you already have.</strong> A DFS that carries the depth: <code>visit(node, depth)</code> appends <code>node.val</code> to <code>res[depth]</code>, then visits left and right with <code>depth + 1</code>. It is correct (left is visited before right at every depth) and O(n). Say it — it shows you know DFS can answer "level" questions too. Its weakness is the recursion depth on a chain, and that it does not naturally <em>process</em> one level at a time, which the variants below need.</p>
<p><strong>Step 2 — the natural tool.</strong> A <strong>queue</strong> (first-in-first-out) gives nodes back in the order they were discovered: the root, then its children, then their children. If the queue only ever contains nodes of the current level followed by nodes of the next level, then "how many nodes are in the queue right now, before I add anything" is exactly the size of the current level. <strong>Freeze that number</strong> into <code>size</code> and pop exactly <code>size</code> nodes: those form one level; everything you pushed while doing it is the next level.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Level Order Traversal (BFS)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Trả về giá trị các nút của một cây nhị phân, gom theo tầng, từ trên xuống dưới, mỗi tầng từ trái sang phải. Với <code>[3,9,20,null,null,15,7]</code> đáp án là <code>[[3],[9,20],[15,7]]</code>.</p>
<p><strong>Bước 1 — một lời giải bạn đã có sẵn.</strong> Một lần DFS mang theo độ sâu: <code>visit(node, depth)</code> thêm <code>node.val</code> vào <code>res[depth]</code>, rồi thăm trái và phải với <code>depth + 1</code>. Nó đúng (ở mọi độ sâu, trái luôn được thăm trước phải) và O(n). Hãy nói nó ra — cho thấy bạn biết DFS cũng trả lời được câu hỏi về "tầng". Điểm yếu: độ sâu đệ quy trên cây hình sợi dây, và nó không tự nhiên <em>xử lý</em> trọn từng tầng một, thứ mà các biến thể bên dưới cần.</p>
<p><strong>Bước 2 — công cụ tự nhiên.</strong> <strong>Hàng đợi</strong> (queue — vào-trước-ra-trước, FIFO) trả nút ra đúng theo thứ tự chúng được phát hiện: gốc, rồi các con của gốc, rồi các cháu. Nếu hàng đợi lúc nào cũng chỉ chứa các nút của tầng hiện tại nối tiếp bởi các nút của tầng kế, thì "lúc này, trước khi thêm gì, trong hàng đợi có bao nhiêu nút" chính là cỡ của tầng hiện tại. <strong>Chốt con số đó</strong> vào <code>size</code> rồi lấy ra đúng <code>size</code> nút: đó là một tầng; mọi thứ được đẩy vào trong lúc làm thế là tầng kế tiếp.</p>
</div>
${maHai('ch05/level-order.ts', 'ch05/LevelOrder.java', { vung: 'bfs' })}
${ketQua('ch05/level-order.ts')}
${ketQua('ch05/LevelOrder.java')}
<div class="ml-en">
<p>Two details in the TypeScript version. First, <code>head</code>: JavaScript arrays have no real queue, and <code>Array.shift()</code> moves every remaining element one slot left — O(n) per call (lesson 3.2 measures it). Reading from an index that only moves forward makes each dequeue O(1). The memory is not freed until the function returns, which is fine here because the result is O(n) anyway. Second, <code>size = queue.length - head</code> is computed <em>once</em> per level. Java’s <code>ArrayDeque</code> is a proper queue, so <code>queue.size()</code> and <code>poll()</code> do the same thing directly.</p>
</div>
<div class="ml-vi">
<p>Hai chi tiết ở bản TypeScript. Thứ nhất là <code>head</code>: mảng JavaScript không có hàng đợi thật, và <code>Array.shift()</code> dịch mọi phần tử còn lại sang trái một ô — O(n) mỗi lần gọi (bài 3.2 đo thật). Đọc từ một chỉ số chỉ tiến về phía trước giúp mỗi lần lấy ra là O(1). Vùng nhớ chưa được giải phóng cho tới khi hàm trả về, nhưng ở đây không sao vì kết quả vốn đã O(n). Thứ hai, <code>size = queue.length - head</code> được tính <em>một lần</em> cho mỗi tầng. <code>ArrayDeque</code> của Java là hàng đợi đúng nghĩa, nên <code>queue.size()</code> và <code>poll()</code> làm thẳng việc đó.</p>
${lienKet({ bai: 'dsa-3-2-queue', title: '3.2 — Queue và deque', sub: 'Vì sao Array.shift() là O(n) trong JavaScript — đo thật, và cách làm hàng đợi O(1)', cta: 'Ôn bài' })}
</div>
<div class="ml-en">
<h3>Watch the queue: BFS on [1,2,3,4,5,null,6]</h3>
<p>One row per dequeued node. Orange cells in the queue are the children just added — they belong to the <em>next</em> level, and they are always at the back.</p>
</div>
<div class="ml-vi">
<h3>Nhìn hàng đợi: BFS trên [1,2,3,4,5,null,6]</h3>
<p>Mỗi hàng là một nút vừa lấy ra. Ô cam trong hàng đợi là các con vừa thêm — chúng thuộc tầng <em>kế tiếp</em>, và luôn nằm ở cuối hàng.</p>
</div>
${BANG_LV}
<div class="ml-en">
<p>At the start of level 1 the queue is <code>[2,3]</code>, so <code>size = 2</code>. Taking 2 adds 4 and 5 behind 3; taking 3 adds 6. After exactly two pops the queue is <code>[4,5,6]</code> — the whole next level and nothing else. That invariant ("between levels, the queue holds exactly one level") is what you say out loud to justify the code.</p>
${moPhong('ch05/bfs-tang.sim.js', 'en', 'BFS level by level — the queue in motion', 'The tree, the queue and the level log side by side on /algorithms; each node shows its level number when it is dequeued.')}
</div>
<div class="ml-vi">
<p>Đầu tầng 1 hàng đợi là <code>[2,3]</code>, nên <code>size = 2</code>. Lấy 2 ra thì thêm 4 và 5 vào sau 3; lấy 3 ra thì thêm 6. Sau đúng hai lần lấy, hàng đợi là <code>[4,5,6]</code> — trọn tầng kế tiếp và không gì khác. Bất biến đó ("giữa hai tầng, hàng đợi chứa đúng một tầng") là câu bạn nói ra để chứng minh code đúng.</p>
${moPhong('ch05/bfs-tang.sim.js', 'vi', 'BFS từng tầng — nhìn hàng đợi chuyển động', 'Cây, hàng đợi và nhật ký từng tầng đặt cạnh nhau trên /algorithms; mỗi nút hiện số tầng của nó lúc được lấy ra.')}
</div>

<div class="ml-en">
<h3>Complexity, said precisely</h3>
<p>All four traversals take <strong>O(n) time</strong>: each node is pushed and popped (or called and returned) once, with O(1) work in between. Memory is where they differ, and it is the follow-up question:</p>
<table>
<thead><tr><th>Shape of the tree</th><th>DFS: stack ~ height h</th><th>BFS: queue ~ widest level w</th></tr></thead>
<tbody>
<tr><td>Balanced, n nodes</td><td>about log₂ n (17 for 10⁵)</td><td>up to about n/2 (the last level)</td></tr>
<tr><td>Chain (every node has one child)</td><td>n — recursion may crash</td><td>1</td></tr>
</tbody></table>
<p>So neither is "better": DFS is cheap on bushy trees, BFS is cheap on skinny ones. The precise answer is "O(n) time, O(h) extra space for DFS and O(w) for BFS, both O(n) in the worst case".</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp, nói cho chính xác</h3>
<p>Cả bốn phép duyệt đều tốn <strong>O(n) thời gian</strong>: mỗi nút được đẩy vào và lấy ra (hoặc được gọi và trả về) một lần, giữa hai việc đó là O(1). Chỗ khác nhau là bộ nhớ, và đó chính là câu hỏi nối tiếp:</p>
<table>
<thead><tr><th>Hình dạng cây</th><th>DFS: ngăn xếp ~ chiều cao h</th><th>BFS: hàng đợi ~ tầng rộng nhất w</th></tr></thead>
<tbody>
<tr><td>Cân bằng, n nút</td><td>khoảng log₂ n (17 với 10⁵)</td><td>tới khoảng n/2 (tầng cuối)</td></tr>
<tr><td>Sợi dây (mỗi nút một con)</td><td>n — đệ quy có thể sập</td><td>1</td></tr>
</tbody></table>
<p>Nên không cái nào "tốt hơn": DFS rẻ trên cây rậm, BFS rẻ trên cây gầy. Câu trả lời chuẩn là "O(n) thời gian, bộ nhớ phụ O(h) với DFS và O(w) với BFS, cả hai O(n) trong trường hợp xấu nhất".</p>
</div>

<div class="ml-en">
<h3>Variant 1 — Binary Tree Right Side View</h3>
<p>Imagine standing to the right of the tree: which values can you see, top to bottom? The trap is to follow right pointers only. In <code>[1,2,3,4]</code> node 3 has no children, so at depth 2 the only node — 4, a <em>left</em> descendant of 1 — is visible. The correct reading is "the last node of each level". BFS gives that directly (<code>k === size - 1</code>). DFS gives it too if you visit the right child first and record the <em>first</em> node you meet at each new depth (<code>depth === res.length</code> means "this depth has no entry yet").</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Binary Tree Right Side View</h3>
<p>Tưởng tượng bạn đứng bên phải cái cây: từ trên xuống dưới bạn nhìn thấy những giá trị nào? Cái bẫy là chỉ đi theo con trỏ phải. Trong <code>[1,2,3,4]</code> nút 3 không có con, nên ở độ sâu 2, nút duy nhất — 4, một hậu duệ bên <em>trái</em> của 1 — vẫn hiện ra. Cách đọc đúng là "nút cuối cùng của mỗi tầng". BFS cho thẳng điều đó (<code>k === size - 1</code>). DFS cũng làm được nếu thăm con phải trước và ghi nút <em>đầu tiên</em> gặp ở mỗi độ sâu mới (<code>depth === res.length</code> nghĩa là "độ sâu này chưa có ai").</p>
</div>
${maHai('ch05/right-side.ts', 'ch05/RightSide.java', { vung: 'bfs' })}
${maHai('ch05/right-side.ts', 'ch05/RightSide.java', { vung: 'dfs' })}
${ketQua('ch05/right-side.ts')}

<div class="ml-en">
<h3>Variant 2 — Zigzag Level Order</h3>
<p>Level 0 left to right, level 1 right to left, and so on. The tempting solution reverses the queue or pushes children in a different order on odd levels — and gets lost two levels later. Keep the BFS exactly as it is; only change <strong>where you write</strong> each value: position <code>k</code> on even levels, <code>size - 1 - k</code> on odd levels. One boolean, no reversing.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Zigzag Level Order</h3>
<p>Tầng 0 trái sang phải, tầng 1 phải sang trái, cứ thế. Lời giải dễ sa vào là đảo hàng đợi hoặc đổi thứ tự đẩy con ở tầng lẻ — rồi lạc lối hai tầng sau. Giữ nguyên BFS; chỉ đổi <strong>chỗ ghi</strong> từng giá trị: vị trí <code>k</code> ở tầng chẵn, <code>size - 1 - k</code> ở tầng lẻ. Một biến boolean, không đảo gì cả.</p>
</div>
${maHai('ch05/zigzag.ts', 'ch05/Zigzag.java', { vung: 'bfs' })}
${ketQua('ch05/zigzag.ts')}

<div class="ml-en">
<h3>The trap that fails real candidates: reading queue.length inside the loop</h3>
<div class="pitfall co-tieu-de"><p><strong>Writing <code>for (k = 0; k &lt; queue.length; k++)</code> with <code>shift()</code> inside.</strong></p><p>It looks like "process the current level". But <code>shift()</code> makes the queue shorter and pushing children makes it longer, both while the condition is being re-read. The run below compares it with the version that freezes <code>size</code> first:</p></div>
</div>
<div class="ml-vi">
<h3>Cái bẫy làm trượt ứng viên thật: đọc queue.length ngay trong vòng lặp</h3>
<div class="pitfall co-tieu-de"><p><strong>Viết <code>for (k = 0; k &lt; queue.length; k++)</code> mà bên trong có <code>shift()</code>.</strong></p><p>Trông như "xử lý tầng hiện tại". Nhưng <code>shift()</code> làm hàng đợi ngắn đi còn đẩy con vào làm nó dài ra, cả hai xảy ra trong lúc điều kiện vòng lặp được đọc lại. Lần chạy dưới đây so nó với bản chốt <code>size</code> trước:</p></div>
</div>
${ma('ch05/bay-tang.ts', { vung: 'sai', nhan: 'TypeScript — wrong' })}
${ketQua('ch05/bay-tang.ts')}
<div class="ml-en">
<p>The wrong version returns <code>[[1,2,3],[4,5],[6]]</code>: the right number of values, plausible-looking groups, and wrong. On the first round, after taking 1 the queue is <code>[2,3]</code> and <code>k = 1 &lt; 2</code>, so it keeps going into level 1. This bug survives a quick test on a three-node tree (try it: <code>[1,2,3]</code> gives <code>[[1,2],[3]]</code> — already wrong, but people often only test the single-node case). Rule: <strong>freeze the size in a local variable before the inner loop</strong>, in every language. In Java, <code>for (int k = 0; k &lt; queue.size(); k++)</code> has the same bug.</p>
</div>
<div class="ml-vi">
<p>Bản sai trả về <code>[[1,2,3],[4,5],[6]]</code>: đủ số giá trị, các nhóm trông có vẻ hợp lý, và sai. Ở vòng đầu, lấy 1 ra xong thì hàng đợi là <code>[2,3]</code> còn <code>k = 1 &lt; 2</code>, nên nó chạy lấn sang tầng 1. Lỗi này sống sót qua một lần test vội trên cây ba nút (thử đi: <code>[1,2,3]</code> cho <code>[[1,2],[3]]</code> — đã sai, nhưng nhiều người chỉ test cây một nút). Quy tắc: <strong>chốt cỡ tầng vào một biến cục bộ trước vòng lặp trong</strong>, ở mọi ngôn ngữ. Trong Java, <code>for (int k = 0; k &lt; queue.size(); k++)</code> dính đúng lỗi đó.</p>
</div>

<div class="ml-en">
<h3>Where traversals live in real systems</h3>
<ul>
<li><strong>The web page you are reading is a tree.</strong> The DOM standard defines "tree order" as a pre-order, depth-first traversal; <code>document.querySelectorAll</code> returns matches in that order, and the browser paints and dispatches events by walking that tree.</li>
<li><strong>Rich text is a tree.</strong> This site’s notes are stored as TipTap/ProseMirror JSON: a <code>doc</code> node with <code>content</code> children, paragraphs, lists, text. <code>walk()</code> in <code>src/services/ghiNhanhNoiDung.ts</code> is a textbook pre-order: <code>fn(node, parent)</code> first, then <code>for (const c of node.content ?? []) walk(c, fn, node)</code>. <code>duyet()</code> in <code>src/services/noteFormat.service.ts</code> is the same three lines used to count headings, code blocks and tables.</li>
<li><strong>Indented sidebars are pre-order with a depth.</strong> <code>flatten()</code> in <code>frontend/src/components/exp-hub/SearchAutocomplete.tsx</code> turns the category tree into a flat list of <code>{ node, depth }</code> in pre-order so each row can be indented by its depth — exactly the DFS-with-depth from step 1 above.</li>
<li><strong>A table with <code>parentId</code> is a tree waiting to be built.</strong> CT Work documents store only <code>parentId</code>; <code>buildTree()</code> in <code>frontend/src/components/work/docs/shared.tsx</code> groups pages by parent in a map and then builds the nested tree recursively from the roots. Deleting a page (<code>deletePage</code> in <code>src/services/work/pages.service.ts</code>) collects the whole subtree with a loop that keeps adding children of already-collected pages until nothing grows — a level-by-level expansion, no recursion.</li>
<li><strong>BFS = "nearest first".</strong> "Friends of friends" suggestions, a web crawler that should not go deeper than 3 links, the shortest path in a maze where every step costs the same (Chapter 7).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Phép duyệt sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Trang web bạn đang đọc là một cây.</strong> Chuẩn DOM định nghĩa "tree order" (thứ tự cây) chính là duyệt trước theo chiều sâu (pre-order, depth-first); <code>document.querySelectorAll</code> trả về các phần tử khớp theo đúng thứ tự đó, và trình duyệt vẽ trang cũng như phát sự kiện bằng cách đi trên cái cây ấy.</li>
<li><strong>Văn bản định dạng là một cây.</strong> Ghi chú của chính trang này lưu dạng JSON của TipTap/ProseMirror: một nút <code>doc</code> có các con <code>content</code>, đoạn văn, danh sách, chữ. <code>walk()</code> trong <code>src/services/ghiNhanhNoiDung.ts</code> là pre-order đúng sách giáo khoa: gọi <code>fn(node, parent)</code> trước, rồi <code>for (const c of node.content ?? []) walk(c, fn, node)</code>. <code>duyet()</code> trong <code>src/services/noteFormat.service.ts</code> là đúng ba dòng đó, dùng để đếm tiêu đề, khối code và bảng.</li>
<li><strong>Thanh bên thụt lề là pre-order kèm độ sâu.</strong> <code>flatten()</code> trong <code>frontend/src/components/exp-hub/SearchAutocomplete.tsx</code> biến cây danh mục thành danh sách phẳng <code>{ node, depth }</code> theo pre-order để mỗi dòng thụt vào theo độ sâu — chính là DFS mang độ sâu ở bước 1 phía trên.</li>
<li><strong>Một bảng có cột <code>parentId</code> là một cây đang chờ được dựng.</strong> Tài liệu CT Work chỉ lưu <code>parentId</code>; <code>buildTree()</code> trong <code>frontend/src/components/work/docs/shared.tsx</code> gom trang theo cha vào một map rồi dựng cây lồng nhau bằng đệ quy từ các gốc. Khi xoá một trang (<code>deletePage</code> trong <code>src/services/work/pages.service.ts</code>), máy chủ gom trọn cây con bằng một vòng lặp cứ thêm con của các trang đã gom cho tới khi không lớn thêm nữa — một kiểu mở rộng từng tầng, không đệ quy.</li>
<li><strong>BFS = "gần trước, xa sau".</strong> Gợi ý "bạn của bạn", con bọ thu thập web (crawler) không được đi sâu quá 3 lần bấm link, đường ngắn nhất trong mê cung khi mọi bước tốn như nhau (Chương 7).</li>
</ul>
${lienKet({ bai: 'dsa-7-2-bfs-dfs', title: '7.2 — BFS và DFS trên đồ thị', sub: 'Cùng hai phép duyệt này, thêm tập "đã thăm" vì đồ thị có chu trình', cta: 'Xem trước' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: data that only <em>claims</em> to be a tree</h3>
<p>Everything in this lesson assumes a real tree: no cycles, one parent each. Data stored as <code>parentId</code> does not guarantee that. If a user could move page A under its own child B, then A → B → A is a loop: a recursive "render the subtree" or "delete the subtree" would run forever (or until the stack overflows), and an unlimited nesting depth turns every walk into a deep recursion. This is a real request someone can send, so CT Work blocks it on the server: <code>movePage</code> in <code>src/services/work/pages.service.ts</code> walks <em>up</em> the parent chain from the new parent and refuses with <code>WORK_PAGE_CYCLE</code> if it meets the page itself (with a cap of 100 steps so even a corrupted chain cannot loop forever), and refuses nesting deeper than <code>MAX_DEPTH = 10</code> with <code>WORK_PAGE_DEPTH</code>. Three defences worth naming in a design discussion: <strong>reject cycles on write</strong>, <strong>cap the depth</strong>, and <strong>bound every upward or downward walk</strong> with a step limit or a visited set.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: dữ liệu chỉ <em>tự xưng</em> là cây</h3>
<p>Mọi thứ trong bài này đều giả định đó là cây thật: không chu trình, mỗi nút một cha. Dữ liệu lưu bằng <code>parentId</code> không bảo đảm điều đó. Nếu người dùng chuyển được trang A vào dưới chính con B của nó, thì A → B → A thành một vòng: một hàm đệ quy "vẽ cây con" hay "xoá cây con" sẽ chạy mãi (hoặc tới khi tràn ngăn xếp), còn độ lồng không giới hạn thì biến mọi lần duyệt thành đệ quy sâu. Đây là một request có thật mà ai cũng gửi được, nên CT Work chặn ngay ở máy chủ: <code>movePage</code> trong <code>src/services/work/pages.service.ts</code> đi <em>ngược lên</em> chuỗi cha từ cha mới và từ chối bằng <code>WORK_PAGE_CYCLE</code> nếu gặp lại chính trang đang chuyển (có trần 100 bước để kể cả chuỗi đã hỏng cũng không lặp vô tận), và từ chối lồng sâu hơn <code>MAX_DEPTH = 10</code> bằng <code>WORK_PAGE_DEPTH</code>. Ba cách phòng nên kể ra khi bàn thiết kế: <strong>từ chối chu trình ngay lúc ghi</strong>, <strong>đặt trần độ sâu</strong>, và <strong>giới hạn mọi lần đi lên/đi xuống</strong> bằng số bước tối đa hoặc một tập "đã thăm".</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given the root of a binary tree, return its level order traversal.'],
  ['C', 'Just to confirm: levels top to bottom, each level left to right, as a list of lists? And for an empty tree I return an empty list?'],
  ['N', 'Pin down the output shape and the empty case before anything else; both change the first and last lines of your code.'],
  ['I', 'Yes, and yes.'],
  ['C', 'One option is a DFS that carries the depth and appends to res[depth] — O(n), but its recursion depth is the height of the tree. The natural tool is BFS with a queue: if I freeze the queue size at the start of each round, that is exactly one level. O(n) time, O(w) space where w is the widest level.'],
  ['N', 'Two approaches in two sentences, then the one you will code, with both complexities.'],
  ['I', 'Go with BFS.'],
  ['C', '(while coding) I store size = queue.length before the inner loop — if I read queue.length inside it, the children I push would leak into this level. In TypeScript I use a head index instead of shift, which is O(n).'],
  ['N', 'Narrate the two decisions that bugs come from. The interviewer hears that you know the trap without you falling into it.'],
  ['C', 'Testing [3,9,20,null,null,15,7]: level one size 1 gives [3] and queues 9 and 20; size 2 gives [9,20] and queues 15 and 7; then [15,7]. Empty tree returns []. A chain 1-2-3 gives three levels of one node.'],
  ['I', 'Now return the levels bottom-up. And what if I wanted the rightmost node of each level?'],
  ['C', 'Bottom-up: same BFS, reverse the list at the end — not insert at index 0, which would be O(n) each time. Rightmost: keep the node where k equals size minus one.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho gốc của một cây nhị phân, trả về phép duyệt theo tầng.'],
  ['C', 'Em xác nhận chút: các tầng từ trên xuống, mỗi tầng từ trái sang phải, trả về danh sách các danh sách? Cây rỗng thì trả danh sách rỗng ạ? <em>("Levels top to bottom, each left to right, as a list of lists?")</em>'],
  ['N', 'Chốt hình dạng đầu ra và trường hợp rỗng trước tiên; cả hai quyết định dòng đầu và dòng cuối của code.'],
  ['I', 'Đúng, và đúng.'],
  ['C', 'Một cách là DFS mang theo độ sâu rồi thêm vào res[depth] — O(n), nhưng độ sâu đệ quy bằng chiều cao cây. Công cụ tự nhiên là BFS với hàng đợi: nếu em chốt cỡ hàng đợi lúc đầu mỗi vòng thì đó đúng là một tầng. O(n) thời gian, O(w) bộ nhớ với w là tầng rộng nhất. <em>("If I freeze the queue size at the start of each round, that is exactly one level.")</em>'],
  ['N', 'Hai cách trong hai câu, rồi cách sẽ code, kèm cả hai độ phức tạp.'],
  ['I', 'Làm BFS đi.'],
  ['C', '(vừa code vừa nói) Em lưu size = queue.length trước vòng lặp trong — nếu đọc queue.length ngay trong vòng thì các con vừa đẩy vào sẽ lọt vào tầng này. Trong TypeScript em dùng chỉ số head thay vì shift, vì shift là O(n).'],
  ['N', 'Thuật lại đúng hai quyết định hay sinh lỗi. Người phỏng vấn nghe ra bạn biết cái bẫy mà không phải rơi vào nó.'],
  ['C', 'Test [3,9,20,null,null,15,7]: tầng một size 1 cho [3], xếp 9 và 20 vào hàng; size 2 cho [9,20], xếp 15 và 7; rồi [15,7]. Cây rỗng trả []. Sợi dây 1-2-3 cho ba tầng mỗi tầng một nút.'],
  ['I', 'Giờ trả các tầng từ dưới lên. Và nếu tôi muốn nút phải nhất của mỗi tầng?'],
  ['C', 'Từ dưới lên: cùng BFS, đảo danh sách ở cuối — không chèn vào chỉ số 0, vì mỗi lần là O(n). Phải nhất: giữ nút có k bằng size trừ một. <em>("Same BFS, reverse at the end.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Building the input tree with <code>2i+1 / 2i+2</code> instead of the queue — wrong as soon as there is a <code>null</code> with values after it.</li>
<li>Reading <code>queue.length</code> / <code>queue.size()</code> in the inner loop condition instead of freezing it.</li>
<li>Iterative pre-order pushing left before right, which produces root, right, left.</li>
<li>Iterative in-order with the outer condition <code>while (stack.length)</code> only — it stops before the right subtree of the root.</li>
<li>Saying "O(1) extra space" for a traversal: recursion uses O(h) stack even if you allocate nothing.</li>
<li>"Right side view = follow right pointers": fails when a left subtree is deeper.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dựng cây đầu vào bằng <code>2i+1 / 2i+2</code> thay vì hàng đợi — sai ngay khi có một <code>null</code> mà phía sau còn giá trị.</li>
<li>Đọc <code>queue.length</code> / <code>queue.size()</code> trong điều kiện vòng trong thay vì chốt nó lại.</li>
<li>Pre-order bản lặp đẩy trái trước phải, ra thứ tự gốc, phải, trái.</li>
<li>In-order bản lặp với điều kiện vòng ngoài chỉ có <code>while (stack.length)</code> — dừng trước khi đi cây con phải của gốc.</li>
<li>Nói "bộ nhớ phụ O(1)" cho một phép duyệt: đệ quy vẫn tốn O(h) ngăn xếp dù bạn không cấp phát gì.</li>
<li>"Nhìn từ phải = đi theo con trỏ phải": sai khi cây con trái sâu hơn.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để bạn tìm được trên LeetCode/NeetCode. Lời giải từng bước của 8 đề tổng hợp cả chương nằm ở bài 5.5 (Bộ luyện 5).</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write <code>build</code> from a LeetCode array and the three recursive traversals. Run them on <code>[1,2,3,4,5,null,6]</code> and compare with the output above.</li>
<li>Write iterative in-order from memory. On paper, fill the stack column for <code>[3,9,20,null,null,15,7]</code> and check the maximum stack size against the height.</li>
<li>Submit LC 94 (iterative), LC 102 and LC 199. For each, one notebook line: <em>signal → traversal → time/space</em>.</li>
<li>Put the queue-length bug into your LC 102 on purpose, run <code>[1,2,3]</code>, and write one sentence on why the output is wrong.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, your hand-filled stack table matches a run, and you can say the "freeze the size" sentence without notes.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">root / leaf / subtree</span><span class="v">The top node / a node with no children / a node with everything below it.</span></div>
  <div class="kv"><span class="k">depth / height</span><span class="v">Edges from the root to a node / the largest depth in the tree.</span></div>
  <div class="kv"><span class="k">pre-order / in-order / post-order</span><span class="v">Write the node before / between / after its two subtrees.</span></div>
  <div class="kv"><span class="k">DFS (depth-first search)</span><span class="v">Go as deep as possible before backing up; uses a stack (or the call stack).</span></div>
  <div class="kv"><span class="k">BFS (breadth-first search)</span><span class="v">Finish a level before going deeper; uses a queue.</span></div>
  <div class="kv"><span class="k">call stack / stack frame</span><span class="v">Memory the language uses to track active function calls; one frame per call.</span></div>
  <div class="kv"><span class="k">invariant</span><span class="v">A fact that stays true at a fixed point of the loop ("between levels the queue holds exactly one level").</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>LeetCode trees are level-order arrays with <code>null</code>; build them with a queue, not <code>2i+1</code>.</li>
<li>Pre/in/post-order are one walk; only the moment you write the node moves.</li>
<li>Iterative versions: pre-order pushes right then left; in-order slides left, pops, goes right; post-order reverses (root, right, left).</li>
<li>BFS by levels: freeze <code>size</code> before the inner loop; in TypeScript dequeue with a head index.</li>
<li>All traversals are O(n) time; memory is O(h) for DFS and O(w) for BFS.</li>
<li>Real trees (DOM, rich text, <code>parentId</code> tables) need cycle checks and depth caps on the server.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees', 'The standard order of tree problems, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('🌳', 'DOM Standard — tree order', 'The web platform defines "tree order" as a pre-order, depth-first traversal', 'https://dom.spec.whatwg.org/')}
${nguon('📙', 'Java ArrayDeque (Java SE 21 API)', 'Why ArrayDeque is the stack and queue to use in Java (faster than Stack and LinkedList)', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết <code>build</code> từ mảng LeetCode và ba phép duyệt đệ quy. Chạy trên <code>[1,2,3,4,5,null,6]</code> rồi so với output phía trên.</li>
<li>Viết in-order bản lặp theo trí nhớ. Trên giấy, điền cột ngăn xếp cho <code>[3,9,20,null,null,15,7]</code> và so cỡ ngăn xếp lớn nhất với chiều cao cây.</li>
<li>Nộp LC 94 (bản lặp), LC 102 và LC 199. Mỗi đề một dòng vào sổ: <em>dấu hiệu → phép duyệt → thời gian/bộ nhớ</em>.</li>
<li>Cố ý cài lỗi queue.length vào LC 102 của bạn, chạy <code>[1,2,3]</code>, rồi viết một câu giải thích vì sao output sai.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, bảng ngăn xếp bạn điền tay khớp với lần chạy thật, và bạn nói được câu "chốt cỡ tầng" mà không cần nhìn.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">root / leaf / subtree (gốc / lá / cây con)</span><span class="v">Nút trên cùng / nút không có con / một nút cùng mọi thứ bên dưới nó.</span></div>
  <div class="kv"><span class="k">depth / height (độ sâu / chiều cao)</span><span class="v">Số cạnh từ gốc tới một nút / độ sâu lớn nhất trong cây.</span></div>
  <div class="kv"><span class="k">pre-order / in-order / post-order (duyệt trước / giữa / sau)</span><span class="v">Ghi nút trước / giữa / sau hai cây con của nó.</span></div>
  <div class="kv"><span class="k">DFS (tìm theo chiều sâu)</span><span class="v">Đi sâu hết mức rồi mới lùi lại; dùng ngăn xếp (hoặc call stack).</span></div>
  <div class="kv"><span class="k">BFS (tìm theo chiều rộng)</span><span class="v">Xong một tầng mới xuống sâu hơn; dùng hàng đợi.</span></div>
  <div class="kv"><span class="k">call stack / stack frame (ngăn xếp lời gọi / khung)</span><span class="v">Vùng nhớ ngôn ngữ dùng để theo dõi các lời gọi hàm đang chạy; mỗi lời gọi một khung.</span></div>
  <div class="kv"><span class="k">invariant (bất biến)</span><span class="v">Một sự thật luôn đúng tại một điểm cố định của vòng lặp ("giữa hai tầng, hàng đợi chứa đúng một tầng").</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Cây LeetCode là mảng theo tầng có <code>null</code>; dựng bằng hàng đợi, không bằng <code>2i+1</code>.</li>
<li>Pre/in/post-order là một lần đi; chỉ thời điểm ghi nút thay đổi.</li>
<li>Bản lặp: pre-order đẩy phải rồi trái; in-order trượt trái, lấy ra, sang phải; post-order đảo ngược (gốc, phải, trái).</li>
<li>BFS theo tầng: chốt <code>size</code> trước vòng trong; trong TypeScript lấy ra bằng chỉ số head.</li>
<li>Mọi phép duyệt O(n) thời gian; bộ nhớ O(h) với DFS và O(w) với BFS.</li>
<li>Cây ngoài đời (DOM, văn bản định dạng, bảng <code>parentId</code>) cần kiểm chu trình và trần độ sâu ở máy chủ.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees', 'Thứ tự chuẩn các đề cây, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('🌳', 'DOM Standard — tree order', 'Nền tảng web định nghĩa "tree order" là duyệt trước theo chiều sâu', 'https://dom.spec.whatwg.org/')}
${nguon('📙', 'Java ArrayDeque (Java SE 21 API)', 'Vì sao ArrayDeque là stack/queue nên dùng trong Java (nhanh hơn Stack và LinkedList)', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html')}
</div>
`,
};
