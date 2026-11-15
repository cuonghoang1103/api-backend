/** 5.2 — Mẫu đệ quy trên cây. Mọi mã/output đọc từ ../ma/ch05 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet } from '../_chung.mjs';
import { oCay, oDay } from './_rieng.mjs';
import { vetDuongKinh } from '../ma/ch05/duong-kinh.vet.mjs';

const T = [1, 2, 3, 4, 5, null, 6];
const vDk = vetDuongKinh(T);
const BANG_DK = bangVet(['#', 'returns from', 'still waiting on the call stack', 'left h', 'right h', 'bend = l + r', 'returns h', 'best'],
  vDk.rows.map((h, k) => [
    String(k + 1),
    `<strong>${h.node}</strong>`,
    oDay(h.waiting),
    String(h.l),
    String(h.r),
    String(h.bend),
    String(h.h),
    h.moi ? `<strong>${h.best}</strong> ⬆` : String(h.best),
  ]));

const DE = [
  [lc(104, 'maximum-depth-of-binary-tree', 'Maximum Depth of Binary Tree', 'Easy'), 'Return the height to the parent: 1 + max(left, right).', 'Trả chiều cao cho cha: 1 + max(trái, phải).'],
  [lc(111, 'minimum-depth-of-binary-tree', 'Minimum Depth of Binary Tree', 'Easy'), 'Trap: a node with one child is NOT a leaf; min(left, right) is wrong there. BFS stops at the first leaf.', 'Bẫy: nút có một con KHÔNG phải lá; min(trái, phải) sai ở đó. BFS dừng ở lá đầu tiên.'],
  [lc(543, 'diameter-of-binary-tree', 'Diameter of Binary Tree', 'Easy'), 'Return height, update a global answer with left + right.', 'Trả chiều cao, cập nhật đáp án chung bằng trái + phải.'],
  [lc(110, 'balanced-binary-tree', 'Balanced Binary Tree', 'Easy'), 'Return height or −1 for "unbalanced below"; O(n) instead of O(n²).', 'Trả chiều cao hoặc −1 nghĩa là "bên dưới đã lệch"; O(n) thay vì O(n²).'],
  [lc(100, 'same-tree', 'Same Tree', 'Easy'), 'Recursion on two trees at once; the base case is "one of them is null".', 'Đệ quy trên hai cây cùng lúc; điều kiện dừng là "một trong hai là null".'],
  [lc(226, 'invert-binary-tree', 'Invert Binary Tree', 'Easy'), 'Invert both sides, then swap. Any traversal order works.', 'Đảo hai bên rồi đổi chỗ. Thứ tự duyệt nào cũng được.'],
  [lc(112, 'path-sum', 'Path Sum', 'Easy'), 'Top-down: pass the remaining sum; only a leaf may finish.', 'Từ trên xuống: truyền phần tổng còn thiếu; chỉ lá mới được kết thúc.'],
  [lc(113, 'path-sum-ii', 'Path Sum II', 'Medium'), 'Push on the way down, pop on the way back, copy the path when it matches.', 'Đẩy vào lúc đi xuống, lấy ra lúc quay lên, khớp thì CHÉP đường đi.'],
  [lc(124, 'binary-tree-maximum-path-sum', 'Binary Tree Maximum Path Sum', 'Hard'), 'Diameter with values: max(0, child gain), best starts at −∞.', 'Đường kính với giá trị: max(0, lợi của con), best bắt đầu từ −∞.'],
  [lc(297, 'serialize-and-deserialize-binary-tree', 'Serialize and Deserialize Binary Tree', 'Hard'), 'Pre-order with a marker for every null; one shared cursor to read it back.', 'Pre-order có ký hiệu cho mọi null; một con trỏ đọc dùng chung để dựng lại.'],
];

export default {
  title: '5.2 — Recursion on trees: "what do I return to my parent?"|||5.2 — Đệ quy trên cây: "hàm trả gì cho cha?"',
  slug: 'dsa-5-2-de-quy',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một khuôn cho cả họ đề cây: độ sâu, đường kính, cân bằng, path sum, max path sum, so/đảo cây, serialize — và đo thật độ sâu làm Node/Java tràn ngăn xếp, kèm vụ JSON lồng sâu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Recursion on trees: "what do I return to my parent?"</h2>
<p class="lead">Lesson 5.1 gave you the walk. This lesson gives you the <em>thinking</em>. Most tree problems — depth, diameter, balanced, path sums, the famous Hard "maximum path sum" — are solved by answering one question before writing any code: <strong>what does my function return to its parent, and what does it need from its children?</strong> Get that sentence right and the code is five lines. Get it wrong and you write O(n²) or a wrong answer that passes the examples. We will also measure, on real machines, how deep recursion can go before Node and Java crash — because a 10⁴-node chain is a normal LeetCode test.</p>

<h3>The everyday picture: the head count at the end of term</h3>
<p>The academic office wants the number of students still studying. It does not count people itself. It asks each faculty; each faculty asks its majors; each major asks its classes; each class monitor counts the room and <em>reports one number up</em>. Each level adds the numbers it receives and reports one number to the level above. Nobody needs to know the whole university, only "what do I report to my parent, and what do I need from my children". That is <strong>bottom-up recursion</strong> (post-order): the answer flows up.</p>
<p>Now the other direction: the dean gives each faculty a budget, each faculty splits it among its majors, and so on down to the classes. Information flows <em>down</em>, as an argument. That is <strong>top-down recursion</strong> (pre-order): you pass what the child needs to know about the path above it — the remaining budget, the current depth, the remaining sum.</p>
<p>Some problems need a third thing: a <strong>global answer</strong> that any node may improve — "the largest class anywhere". The class does not report it up as its main number; it just writes on the shared whiteboard if it beats the record. Diameter and maximum path sum are exactly that shape.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Đệ quy trên cây: "hàm trả gì cho cha?"</h2>
<p class="lead">Bài 5.1 cho bạn cách <em>đi</em>. Bài này cho bạn cách <em>nghĩ</em>. Phần lớn đề cây — độ sâu, đường kính, cân bằng, tổng đường đi, cả đề Hard nổi tiếng "maximum path sum" — được giải bằng cách trả lời một câu hỏi trước khi viết dòng code nào: <strong>hàm của tôi trả gì cho nút cha, và nó cần gì từ các nút con?</strong> Trả lời đúng câu đó thì code chỉ năm dòng. Trả lời sai thì bạn viết ra O(n²), hoặc một đáp án sai mà vẫn qua các ví dụ. Bài này cũng đo trên máy thật xem đệ quy sâu được tới đâu trước khi Node và Java sập — vì một cây hình sợi dây 10⁴ nút là test bình thường của LeetCode.</p>

<h3>Hình dung đời thường: đếm sĩ số cuối kỳ</h3>
<p>Phòng đào tạo cần biết còn bao nhiêu sinh viên đang học. Phòng không tự đi đếm. Phòng hỏi từng khoa; mỗi khoa hỏi các ngành; mỗi ngành hỏi các lớp; lớp trưởng đếm trong phòng rồi <em>báo lên đúng một con số</em>. Mỗi cấp cộng các con số nhận được rồi báo một con số cho cấp trên. Không ai cần biết cả trường, chỉ cần biết "mình báo gì cho cấp trên, và mình cần gì từ cấp dưới". Đó là <strong>đệ quy từ dưới lên</strong> (bottom-up, post-order): đáp án chảy ngược lên.</p>
<p>Giờ chiều ngược lại: hiệu trưởng giao ngân sách cho từng khoa, khoa chia cho các ngành, cứ thế xuống tới lớp. Thông tin chảy <em>xuống</em>, dưới dạng tham số. Đó là <strong>đệ quy từ trên xuống</strong> (top-down, pre-order): bạn truyền cho con điều nó cần biết về đoạn đường phía trên — ngân sách còn lại, độ sâu hiện tại, phần tổng còn thiếu.</p>
<p>Có đề cần thêm thứ ba: một <strong>đáp án chung</strong> (global answer) mà nút nào cũng có thể cải thiện — "lớp đông nhất ở bất kỳ đâu". Lớp đó không báo con số này lên như con số chính của mình; nó chỉ ghi lên bảng chung nếu phá kỷ lục. Đường kính và tổng đường đi lớn nhất có đúng hình dạng đó.</p>
${csd('csd201-de-quy', 'vi', '3.1 Đệ quy & call stack', '<p>Ở CSD201 bạn đã học đệ quy qua giai thừa, Fibonacci, tháp Hà Nội, và hình dung call stack (ngăn xếp lời gọi) chồng lên rồi rút xuống. Ôn nhanh một câu: mỗi lời gọi có khung riêng chứa tham số và biến cục bộ; điều kiện dừng ngăn nó gọi mãi. <strong>Ở đây đi sâu thêm:</strong> một khuôn ba câu hỏi để thiết kế hàm đệ quy trên cây, phân biệt "giá trị trả cho cha" với "đáp án chung", và con số thật về độ sâu tối đa trước khi tràn ngăn xếp.</p>')}
</div>

<div class="ml-en">
<h3>The template: three questions, then five lines</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Base case</span><span class="lz-d">What do I return for an empty tree (<code>null</code>)? Choose it so the formula above works without special cases: height 0, sum 0, "is balanced" true.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Return to the parent</span><span class="lz-d">One value the parent can <em>use</em> — often not the final answer. Diameter returns a height, not a diameter.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Combine the children</span><span class="lz-d">Given what left and right returned, compute my return value — and, if needed, update a global answer.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Or pass down</span><span class="lz-d">If the child needs to know about the path above (depth, remaining sum, allowed range), it is a parameter.</span></div>
</div>
<p>Say these out loud in the interview: "my helper returns the height of the subtree; at each node I also try left + right as a path that bends here". That one sentence is 80 % of the solution, and the interviewer can correct you before you code.</p>
</div>
<div class="ml-vi">
<h3>Khuôn: ba câu hỏi, rồi năm dòng code</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Điều kiện dừng</span><span class="lz-d">Cây rỗng (<code>null</code>) thì trả gì? Chọn sao cho công thức phía trên chạy đúng mà không cần trường hợp đặc biệt: chiều cao 0, tổng 0, "cân bằng" là true.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trả cho cha</span><span class="lz-d">Một giá trị mà cha <em>dùng được</em> — thường KHÔNG phải đáp án cuối. Đường kính trả về chiều cao, không trả đường kính.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Gộp từ các con</span><span class="lz-d">Biết trái và phải trả gì, tính giá trị mình trả về — và nếu cần, cập nhật đáp án chung.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hoặc truyền xuống</span><span class="lz-d">Nếu con cần biết về đoạn đường phía trên (độ sâu, phần tổng còn thiếu, khoảng giá trị được phép), đó là tham số.</span></div>
</div>
<p>Hãy nói to các câu này khi phỏng vấn: "hàm phụ của em trả về chiều cao cây con; ở mỗi nút em thử thêm trái + phải như một đường đi gập ở đây". Một câu đó là 80 % lời giải, và người phỏng vấn có thể sửa bạn trước khi bạn code.</p>
</div>

<div class="ml-en">
<h3>Signals</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"height", "depth", "size", "count nodes", "sum of subtree"</span><span class="v">Bottom-up: return the quantity itself; base case 0.</span></div>
  <div class="kv"><span class="k">"longest / largest path between any two nodes"</span><span class="v">Return the best path going <em>down</em> from me (one side); update a global answer with the path that <em>bends</em> at me (both sides).</span></div>
  <div class="kv"><span class="k">"root-to-leaf", "path sum equals target", "good nodes", "max so far on the path"</span><span class="v">Top-down: pass the remaining target / the max so far as a parameter.</span></div>
  <div class="kv"><span class="k">"is it balanced / valid / symmetric" (a yes/no about the whole tree)</span><span class="v">Return a number that doubles as a signal (−1 = "already failed"), so you never re-walk a subtree.</span></div>
  <div class="kv"><span class="k">two trees in the input</span><span class="v">Recurse on both at once: <code>f(p.left, q.left)</code>, base case "one of them is null".</span></div>
  <div class="kv"><span class="k">n up to 10⁴ and the tree may be a chain</span><span class="v">Recursion depth = n. Fine in Java, dangerous in JavaScript (measured below). Mention it; offer the iterative version.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"chiều cao", "độ sâu", "kích thước", "đếm nút", "tổng cây con"</span><span class="v">Từ dưới lên: trả chính đại lượng đó; điều kiện dừng là 0.</span></div>
  <div class="kv"><span class="k">"đường dài nhất / lớn nhất giữa hai nút bất kỳ"</span><span class="v">Trả đường tốt nhất đi <em>xuống</em> từ mình (một phía); cập nhật đáp án chung bằng đường <em>gập</em> tại mình (cả hai phía).</span></div>
  <div class="kv"><span class="k">"gốc tới lá", "tổng đường đi bằng target", "good nodes", "lớn nhất trên đường đi tới đây"</span><span class="v">Từ trên xuống: truyền phần target còn thiếu / giá trị lớn nhất tới giờ làm tham số.</span></div>
  <div class="kv"><span class="k">"có cân bằng / hợp lệ / đối xứng không" (có/không về cả cây)</span><span class="v">Trả một con số kiêm luôn tín hiệu (−1 = "đã hỏng rồi"), để không bao giờ phải đi lại một cây con.</span></div>
  <div class="kv"><span class="k">đầu vào có hai cây</span><span class="v">Đệ quy trên cả hai cùng lúc: <code>f(p.left, q.left)</code>, điều kiện dừng "một trong hai là null".</span></div>
  <div class="kv"><span class="k">n tới 10⁴ và cây có thể là sợi dây</span><span class="v">Độ sâu đệ quy = n. Ổn với Java, nguy hiểm với JavaScript (đo thật bên dưới). Nói ra điều đó; đề nghị bản lặp.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Warm-up: Maximum Depth, both directions</h3>
<p>Bottom-up answers question 2 with "my height": <code>1 + max(left, right)</code>, with 0 for <code>null</code>. Top-down passes "my depth" down and lets each leaf report it to a shared maximum. Both are O(n). The bottom-up one is shorter and has no shared state, so it is the one to write first; the top-down one is the shape you will need for path problems.</p>
</div>
<div class="ml-vi">
<h3>Khởi động: Maximum Depth, theo cả hai chiều</h3>
<p>Từ dưới lên trả lời câu hỏi 2 bằng "chiều cao của mình": <code>1 + max(trái, phải)</code>, với <code>null</code> là 0. Từ trên xuống truyền "độ sâu của mình" xuống và để mỗi lá báo nó vào một giá trị lớn nhất dùng chung. Cả hai đều O(n). Bản từ dưới lên ngắn hơn và không có trạng thái dùng chung nên viết nó trước; bản từ trên xuống là hình dạng bạn sẽ cần cho các đề đường đi.</p>
</div>
${maHai('ch05/do-sau-duong-kinh.ts', 'ch05/DoSauDuongKinh.java', { vung: 'duoi-len' })}
${maHai('ch05/do-sau-duong-kinh.ts', 'ch05/DoSauDuongKinh.java', { vung: 'tren-xuong' })}

<div class="ml-en">
<h3>Worked example: Diameter of Binary Tree</h3>
<p><strong>Problem (in our words).</strong> The diameter is the number of edges on the longest path between any two nodes. The path does not have to pass through the root. For <code>[1,2,3,4,5,null,6]</code> it is 4 (4 → 2 → 1 → 3 → 6).</p>
<p><strong>Step 1 — brute force.</strong> Every longest path has a highest node where it "bends"; at that node it goes down the left as far as possible and down the right as far as possible. So: for every node, compute the height of its left and right subtree with a separate function, take the maximum of <code>left + right</code>. Each height call walks a whole subtree, so this is O(n²) on a chain — 10⁸ steps for 10⁴ nodes.</p>
<p><strong>Step 2 — the waste.</strong> The heights you compute at a node are the same heights its parent will compute again a moment later. A post-order walk computes every height exactly once — if the function <em>returns</em> the height instead of throwing it away.</p>
<p><strong>Step 3 — answer the three questions.</strong> Base case: <code>null</code> has height 0. Return to the parent: my height <code>1 + max(l, r)</code> — a parent can extend only <em>one</em> of my sides, because a path cannot fork. Combine: while I hold both <code>l</code> and <code>r</code>, the path that bends at me has <code>l + r</code> edges; record it in a global <code>best</code>.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Diameter of Binary Tree</h3>
<p><strong>Đề (diễn đạt lại).</strong> Đường kính (diameter) là số cạnh trên đường đi dài nhất giữa hai nút bất kỳ. Đường đi KHÔNG bắt buộc qua gốc. Với <code>[1,2,3,4,5,null,6]</code> đáp án là 4 (4 → 2 → 1 → 3 → 6).</p>
<p><strong>Bước 1 — vét cạn.</strong> Mọi đường dài nhất đều có một nút cao nhất nơi nó "gập" lại; tại nút đó nó đi xuống bên trái hết mức và xuống bên phải hết mức. Vậy: với mỗi nút, tính chiều cao cây con trái và phải bằng một hàm riêng, lấy <code>trái + phải</code> lớn nhất. Mỗi lần tính chiều cao đi hết một cây con, nên trên cây sợi dây đây là O(n²) — 10⁸ bước với 10⁴ nút.</p>
<p><strong>Bước 2 — chỗ phí.</strong> Chiều cao bạn tính ở một nút chính là chiều cao mà nút cha sẽ tính lại ngay sau đó. Một lần đi post-order tính mỗi chiều cao đúng một lần — miễn là hàm <em>trả về</em> chiều cao thay vì vứt nó đi.</p>
<p><strong>Bước 3 — trả lời ba câu hỏi.</strong> Điều kiện dừng: <code>null</code> cao 0. Trả cho cha: chiều cao của mình <code>1 + max(l, r)</code> — cha chỉ nối dài được <em>một</em> phía của mình, vì đường đi không được rẽ nhánh. Gộp: trong lúc đang cầm cả <code>l</code> lẫn <code>r</code>, đường gập tại mình có <code>l + r</code> cạnh; ghi nó vào biến chung <code>best</code>.</p>
</div>
${maHai('ch05/do-sau-duong-kinh.ts', 'ch05/DoSauDuongKinh.java', { vung: 'duong-kinh' })}
${ketQua('ch05/do-sau-duong-kinh.ts')}
${ketQua('ch05/DoSauDuongKinh.java')}
<div class="ml-en">
<p>The fourth test is the one to remember. In <code>[1,2,null,3,4,5,null,null,6,7,null,null,8]</code> (drawn below) the longest path 7 → 5 → 3 → 2 → 4 → 6 → 8 has 6 edges and bends at node 2; through the root you only get 5. A solution that computes <code>height(root.left) + height(root.right)</code> once at the root returns 5 and passes LeetCode’s first two examples. The global <code>best</code> is what catches it.</p>
</div>
<div class="ml-vi">
<p>Test thứ tư là cái cần nhớ. Trong <code>[1,2,null,3,4,5,null,null,6,7,null,null,8]</code> (vẽ bên dưới), đường dài nhất 7 → 5 → 3 → 2 → 4 → 6 → 8 có 6 cạnh và gập tại nút 2; đi qua gốc chỉ được 5. Một lời giải chỉ tính <code>height(root.left) + height(root.right)</code> một lần ở gốc sẽ trả 5 và vẫn qua hai ví dụ đầu của LeetCode. Biến chung <code>best</code> chính là thứ bắt được trường hợp này.</p>
</div>
${oCay([1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8], { to: { 7: 'ok', 5: 'ok', 3: 'ok', 2: 'r', 4: 'ok', 6: 'ok', 8: 'ok' } })}

<div class="ml-en">
<h3>Watch the call stack: who returns what, in which order</h3>
<p>One row each time a call <em>returns</em> on <code>[1,2,3,4,5,null,6]</code>. The third column is the call stack still waiting above it — the frames that will receive the value. The table comes from running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Nhìn ngăn xếp lời gọi: ai trả gì, theo thứ tự nào</h3>
<p>Mỗi hàng là một lần một lời gọi <em>trả về</em>, trên cây <code>[1,2,3,4,5,null,6]</code>. Cột thứ ba là ngăn xếp lời gọi còn đang chờ phía trên nó — những khung sẽ nhận giá trị vừa trả. Bảng sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${oCay(T)}
${BANG_DK}
<div class="ml-en">
<p>Read it bottom-up, which is the order things happen: leaves 4 and 5 return height 1 while 1 and 2 are still waiting. Node 2 receives 1 and 1, tries the bent path 1 + 1 = 2 (new best), and returns 2 — not 2 as a diameter, but 2 as "the longest single branch below me, counted in nodes". Node 3 has only a right child, so its bend is 0 + 1 = 1 and the best stays 2. Finally the root receives 2 and 2: bend 4, the answer. Six returns for six nodes; the stack never held more than three frames.</p>
${moPhong('ch05/duong-kinh.sim.js', 'en', 'Diameter: heights flowing up, best path bending', 'Each node shows the height it returns; the log prints the call stack on the way down and every best-path update on the way up.')}
</div>
<div class="ml-vi">
<p>Đọc từ dưới lên, đúng thứ tự mọi việc xảy ra: hai lá 4 và 5 trả chiều cao 1 trong lúc 1 và 2 còn đang chờ. Nút 2 nhận 1 và 1, thử đường gập 1 + 1 = 2 (kỷ lục mới), rồi trả 2 — không phải 2 là đường kính, mà 2 là "nhánh đơn dài nhất bên dưới tôi, tính theo số nút". Nút 3 chỉ có con phải nên đường gập của nó là 0 + 1 = 1, kỷ lục vẫn là 2. Cuối cùng gốc nhận 2 và 2: gập được 4, chính là đáp án. Sáu lần trả về cho sáu nút; ngăn xếp chưa bao giờ giữ quá ba khung.</p>
${moPhong('ch05/duong-kinh.sim.js', 'vi', 'Đường kính: chiều cao chảy lên, đường gập phá kỷ lục', 'Mỗi nút hiện chiều cao nó trả về; ô log in ngăn xếp lời gọi lúc đi xuống và mỗi lần kỷ lục đổi lúc đi lên.')}
</div>

<div class="ml-en">
<h3>Complexity</h3>
<p>Each node is called once and does O(1) work after its children return: <strong>O(n) time</strong>. Extra space is the call stack, <strong>O(h)</strong>: about log n on a balanced tree, n on a chain. "O(1) space because I only use one variable" is the wrong answer; say "O(h) for the recursion".</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp</h3>
<p>Mỗi nút được gọi một lần và làm O(1) việc sau khi các con trả về: <strong>O(n) thời gian</strong>. Bộ nhớ phụ là ngăn xếp lời gọi, <strong>O(h)</strong>: khoảng log n trên cây cân bằng, n trên cây sợi dây. "O(1) bộ nhớ vì em chỉ dùng một biến" là câu trả lời sai; hãy nói "O(h) cho đệ quy".</p>
</div>

<div class="ml-en">
<h3>Variant 1 — Balanced Binary Tree: a return value that doubles as a signal</h3>
<p>A tree is height-balanced if at <em>every</em> node the two subtree heights differ by at most 1. The naive code checks the root with a <code>height()</code> helper, then recurses into both children — and each of those calls <code>height()</code> again on the same nodes: O(n²) on a chain, O(n log n) on a balanced tree. The one-pass version answers question 2 with "my height, or −1 if anything below me is already unbalanced". −1 is not a valid height, so it can carry the bad news upward and stop the walk early.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Balanced Binary Tree: giá trị trả về kiêm luôn tín hiệu</h3>
<p>Một cây cân bằng chiều cao (height-balanced) nếu tại <em>mọi</em> nút, chiều cao hai cây con chênh nhau tối đa 1. Code ngây thơ kiểm gốc bằng hàm <code>height()</code>, rồi đệ quy vào hai con — mà mỗi con lại gọi <code>height()</code> trên đúng những nút đó: O(n²) trên sợi dây, O(n log n) trên cây cân bằng. Bản một lượt trả lời câu hỏi 2 bằng "chiều cao của tôi, hoặc −1 nếu bên dưới đã có chỗ lệch". −1 không phải chiều cao hợp lệ, nên nó mang được tin xấu lên trên và dừng sớm cả lần đi.</p>
</div>
${maHai('ch05/can-bang.ts', 'ch05/CanBang.java', { vung: 'mot-luot' })}
${ketQua('ch05/can-bang.ts')}
<div class="ml-en">
<p>The third tree <code>[1,2,2,3,null,null,3,4,null,null,4]</code> is the classic trap: the root’s two subtrees have the <em>same</em> height (3 and 3), so a solution that only checks the root says true. But node 2 on the left has heights 2 and 0 below it. "Balanced" is a property of every node, not of the root.</p>
</div>
<div class="ml-vi">
<p>Cây thứ ba <code>[1,2,2,3,null,null,3,4,null,null,4]</code> là cái bẫy kinh điển: hai cây con của gốc cao <em>bằng nhau</em> (3 và 3), nên lời giải chỉ kiểm ở gốc nói true. Nhưng nút 2 bên trái có hai phía cao 2 và 0. "Cân bằng" là tính chất của mọi nút, không phải của riêng gốc.</p>
</div>
${oCay([1, 2, 2, 3, null, null, 3, 4, null, null, 4], { to: { 4: 'x' } })}

<div class="ml-en">
<h3>Variant 2 — Path Sum I and II: passing information down</h3>
<p>"Is there a root-to-<strong>leaf</strong> path whose values add up to <code>target</code>?" Top-down: pass the remaining sum. Two base cases decide everything, and both are traps. An empty tree has <em>no</em> path, even for target 0. And only a <em>leaf</em> may finish a path: in <code>[1,2]</code> with target 1, the root alone sums to 1, but the root has a child, so it is not a leaf, and the answer is false. Path Sum II wants all such paths: push the node on the way down, pop it on the way back (this is backtracking, Chapter 8), and <strong>copy</strong> the path when it matches — otherwise every stored answer is the same array, emptied by the pops.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Path Sum I và II: truyền thông tin xuống</h3>
<p>"Có đường đi từ gốc tới <strong>lá</strong> nào có tổng bằng <code>target</code> không?" Từ trên xuống: truyền phần tổng còn thiếu. Hai điều kiện dừng quyết định tất cả, và cả hai đều là bẫy. Cây rỗng <em>không có</em> đường đi nào, kể cả với target 0. Và chỉ <em>lá</em> mới được kết thúc đường đi: trong <code>[1,2]</code> với target 1, riêng gốc đã có tổng 1, nhưng gốc có con nên không phải lá, đáp án là false. Path Sum II đòi mọi đường như vậy: đẩy nút vào lúc đi xuống, lấy ra lúc quay lên (đó là quay lui — backtracking, Chương 8), và <strong>chép</strong> đường đi khi khớp — không thì mọi đáp án đã lưu là cùng một mảng, bị các lần lấy ra làm rỗng.</p>
</div>
${maHai('ch05/path-sum.ts', 'ch05/PathSum.java', { vung: 'co-khong' })}
${maHai('ch05/path-sum.ts', 'ch05/PathSum.java', { vung: 'liet-ke' })}
${ketQua('ch05/path-sum.ts')}

<div class="ml-en">
<h3>Variant 3 — Binary Tree Maximum Path Sum (Hard): the diameter, with values</h3>
<p>Now nodes carry values, possibly negative, and we want the largest sum of any path. It is the diameter template exactly: return to the parent "the best sum of a path going down from me, one side only"; at each node, try "me + best left + best right" as a path that bends here. Two changes make it correct. A child whose best downward sum is negative should be <em>left out</em>: <code>max(0, gain(child))</code>. And <code>best</code> must start at −∞ (Java <code>Integer.MIN_VALUE</code>), not 0 — for <code>[-3]</code> the answer is −3, and a 0 start would invent an empty path.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 3 — Binary Tree Maximum Path Sum (Hard): chính là đường kính, có thêm giá trị</h3>
<p>Giờ mỗi nút mang một giá trị, có thể âm, và ta cần tổng lớn nhất của một đường đi bất kỳ. Đây đúng là khuôn đường kính: trả cho cha "tổng tốt nhất của đường đi xuống từ tôi, chỉ một phía"; ở mỗi nút, thử "tôi + tốt nhất bên trái + tốt nhất bên phải" như một đường gập ở đây. Hai thay đổi làm nó đúng. Một con có tổng đi xuống tốt nhất là âm thì nên <em>bỏ ra</em>: <code>max(0, gain(con))</code>. Và <code>best</code> phải bắt đầu từ −∞ (Java <code>Integer.MIN_VALUE</code>), không phải 0 — với <code>[-3]</code> đáp án là −3, khởi tạo 0 là tự bịa ra một đường đi rỗng.</p>
</div>
${maHai('ch05/max-path-sum.ts', 'ch05/MaxPathSum.java', { vung: 'gain' })}
${ketQua('ch05/max-path-sum.ts')}
<div class="ml-en">
<p>In <code>[-10,9,20,null,null,15,7]</code> the answer 42 = 15 + 20 + 7 bends at 20 and never touches the root: the root’s −10 makes every path through it worse. In <code>[2,-1,-2]</code> both children are dropped and the best path is the root alone, 2. When the interviewer says "this is Hard", recognising it as Easy 543 in disguise is the point.</p>
</div>
<div class="ml-vi">
<p>Trong <code>[-10,9,20,null,null,15,7]</code> đáp án 42 = 15 + 20 + 7 gập tại 20 và không hề chạm gốc: −10 của gốc làm mọi đường qua nó tệ đi. Trong <code>[2,-1,-2]</code> cả hai con bị bỏ, đường tốt nhất là riêng gốc, 2. Khi người phỏng vấn bảo "đề này Hard", nhận ra nó là đề Easy 543 đội lốt mới là điểm ăn tiền.</p>
</div>

<div class="ml-en">
<h3>Variant 4 — Same Tree and Invert Tree: recursion on two trees, recursion that rebuilds</h3>
<p><em>Same Tree</em>: two trees are equal if their roots match and their left subtrees are equal and their right subtrees are equal. The base case is the subtle line: if at least one is <code>null</code>, they are equal only if <em>both</em> are — <code>p === q</code> says exactly that. <em>Invert Tree</em> (mirror it): invert both subtrees, then swap them. The function returns the root so the caller can reattach it; that "return the new subtree" shape comes back in BST insert and delete (lesson 5.3).</p>
</div>
<div class="ml-vi">
<h3>Biến thể 4 — Same Tree và Invert Tree: đệ quy trên hai cây, đệ quy dựng lại cây</h3>
<p><em>Same Tree</em> (hai cây giống nhau): hai cây bằng nhau khi gốc khớp, hai cây con trái bằng nhau và hai cây con phải bằng nhau. Dòng tinh tế là điều kiện dừng: nếu ít nhất một bên là <code>null</code> thì chúng bằng nhau chỉ khi <em>cả hai</em> là null — <code>p === q</code> nói đúng điều đó. <em>Invert Tree</em> (lật cây như soi gương): lật hai cây con rồi đổi chỗ chúng. Hàm trả về gốc để nơi gọi gắn lại; hình dạng "trả về cây con mới" này quay lại ở chèn/xoá BST (bài 5.3).</p>
</div>
${maHai('ch05/same-invert.ts', 'ch05/SameInvert.java', { vung: 'same' })}
${maHai('ch05/same-invert.ts', 'ch05/SameInvert.java', { vung: 'invert' })}
${ketQua('ch05/same-invert.ts')}

<div class="ml-en">
<h3>Variant 5 — Serialize and Deserialize (Hard): pre-order with null markers</h3>
<p>Turn a tree into a string and back. A plain pre-order <code>1,2,3</code> is ambiguous — is 2 the left child of 1, or of something else? Write a marker for every <code>null</code> and the ambiguity disappears: <code>1,2,#,#,3,4,#,#,5,#,#</code> can be read back in exactly one way, because the reader knows precisely when each subtree ends. Deserialize mirrors serialize: read one token; if it is <code>#</code> return null; otherwise make a node, then build its left, then its right, all from one shared cursor.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 5 — Serialize and Deserialize (Hard): pre-order kèm ký hiệu null</h3>
<p>Biến cây thành chuỗi rồi dựng lại (serialize — tuần tự hoá). Một pre-order trần <code>1,2,3</code> là mơ hồ — 2 là con trái của 1, hay của ai khác? Ghi một ký hiệu cho mọi <code>null</code> thì hết mơ hồ: <code>1,2,#,#,3,4,#,#,5,#,#</code> chỉ đọc lại được đúng một cách, vì người đọc biết chính xác lúc nào một cây con kết thúc. Deserialize soi gương serialize: đọc một ký hiệu; là <code>#</code> thì trả null; không thì tạo nút, dựng con trái, rồi con phải, tất cả từ một con trỏ đọc dùng chung.</p>
</div>
${maHai('ch05/serialize.ts', 'ch05/Serialize.java', { vung: 'codec' })}
${ketQua('ch05/serialize.ts')}
${ketQua('ch05/Serialize.java')}

<div class="ml-en">
<h3>How deep can recursion go? Measured</h3>
<p>Every recursive solution above uses O(h) stack. On a chain (each node has only a right child) h = n. LeetCode tree problems commonly allow up to 10⁴ nodes, and test sets do include chains. So: how many nested calls does each runtime survive? We build a 1,000,000-node chain and call the recursive <code>height</code> on it until it throws, counting the depth reached; then the iterative BFS height on the same chain:</p>
</div>
<div class="ml-vi">
<h3>Đệ quy sâu được tới đâu? Đo thật</h3>
<p>Mọi lời giải đệ quy phía trên đều dùng O(h) ngăn xếp. Trên sợi dây (mỗi nút chỉ có con phải) thì h = n. Các đề cây LeetCode thường cho tới 10⁴ nút, và bộ test có cả sợi dây. Vậy: mỗi môi trường chạy chịu được bao nhiêu lời gọi lồng nhau? Ta dựng một sợi dây 1.000.000 nút, gọi <code>height</code> đệ quy trên nó cho tới khi ném lỗi, đếm độ sâu đã đạt; rồi gọi bản BFS lặp trên cùng sợi dây đó:</p>
</div>
${ma('ch05/do-sau-stack.ts', { vung: 'de-quy', nhan: 'TypeScript — instrumented recursion' })}
${ketQua('ch05/do-sau-stack.ts')}
${ketQua('ch05/DoSauStack.java')}
<div class="ml-en">
<p>Read the numbers like an engineer:</p>
<ul>
<li><strong>Node dies at about 7,000–10,000 levels.</strong> The V8 stack is a little under 1 MB by default, and a frame of this function costs on the order of 100 bytes. Worse, the limit is not even fixed: the first call (interpreted, fatter frames) died around 6,900, the second around 8,900, and after the JIT compiled <code>height</code> it reached about 10,400. A 10⁴-node chain is right on that edge — the exact place where a JavaScript solution passes on your laptop and throws <code>RangeError</code> on a judge.</li>
<li><strong>Java survives several times deeper, and the stack size decides it.</strong> With the macOS default of 2048 KB per thread (<code>java -XX:+PrintFlagsFinal -version | grep ThreadStackSize</code> prints 2048 on this machine) a warm run reaches about 62,000 levels; the depth grows roughly in proportion to the stack (512 KB → about 12,600, 8 MB → about 258,000), at roughly 34 bytes per frame once compiled. The cold run died at about 20,000 with the same 2 MB: interpreted frames are bigger.</li>
<li><strong>The iterative version does not care.</strong> One million levels in about 13–14 ms in both languages, because its "stack" is an array on the heap.</li>
</ul>
<p>What to do with this in an interview: write the recursive solution (it is clearer), then say one sentence — "recursion depth is O(h); on a skewed tree of 10⁵ nodes this could overflow, so in production I would make it iterative or cap the depth". That sentence is a senior signal. Do not "fix" it with <code>node --stack-size</code>: raising V8’s limit beyond the real thread stack crashes the process with a segmentation fault instead of a catchable error.</p>
</div>
<div class="ml-vi">
<p>Đọc các con số như một kỹ sư:</p>
<ul>
<li><strong>Node chết ở khoảng 7.000–10.000 tầng.</strong> Ngăn xếp V8 mặc định nhỉnh dưới 1 MB, và mỗi khung của hàm này tốn cỡ 100 byte. Tệ hơn, giới hạn còn không cố định: lần gọi đầu (đang thông dịch, khung béo hơn) chết quanh 6.900, lần hai quanh 8.900, và sau khi JIT biên dịch <code>height</code> thì tới khoảng 10.400. Một sợi dây 10⁴ nút nằm ngay trên lằn ranh đó — đúng chỗ một lời giải JavaScript chạy được trên laptop của bạn rồi ném <code>RangeError</code> trên máy chấm.</li>
<li><strong>Java chịu sâu hơn vài lần, và cỡ ngăn xếp quyết định.</strong> Với mặc định macOS 2048 KB mỗi luồng (<code>java -XX:+PrintFlagsFinal -version | grep ThreadStackSize</code> in ra 2048 trên máy này), lần chạy đã "nóng máy" tới khoảng 62.000 tầng; độ sâu tăng gần như tỉ lệ thuận với cỡ ngăn xếp (512 KB → khoảng 12.600, 8 MB → khoảng 258.000), cỡ 34 byte mỗi khung sau khi đã biên dịch. Lần chạy nguội chết ở khoảng 20.000 với cùng 2 MB: khung lúc thông dịch to hơn.</li>
<li><strong>Bản lặp không hề quan tâm.</strong> Một triệu tầng trong khoảng 13–14 ms ở cả hai ngôn ngữ, vì "ngăn xếp" của nó là một mảng trên heap.</li>
</ul>
<p>Dùng điều này thế nào khi phỏng vấn: viết lời giải đệ quy (rõ hơn), rồi nói một câu — "độ sâu đệ quy là O(h); trên cây lệch 10⁵ nút có thể tràn ngăn xếp, nên ở production em sẽ chuyển sang lặp hoặc đặt trần độ sâu" <em>("on a skewed tree this could overflow the stack, so in production I would make it iterative")</em>. Câu đó là tín hiệu của người có kinh nghiệm. Đừng "chữa" bằng <code>node --stack-size</code>: nâng giới hạn của V8 vượt quá ngăn xếp thật của luồng làm tiến trình chết vì segmentation fault thay vì một lỗi bắt được.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: deeply nested JSON</h3>
<p>Put the measurement next to a web server. JSON is a tree, and a client chooses its shape. One million levels of <code>[</code> … <code>]</code> is a 2 MB body — this site’s API accepts bodies up to <code>express.json({ limit: '10mb' })</code> (<code>src/index.ts</code>), so it gets through. What happens next:</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: JSON lồng thật sâu</h3>
<p>Đặt phép đo trên cạnh một máy chủ web. JSON là một cây, và hình dạng của nó do client chọn. Một triệu tầng <code>[</code> … <code>]</code> chỉ là thân request 2 MB — API của chính trang này nhận thân tới <code>express.json({ limit: '10mb' })</code> (<code>src/index.ts</code>), nên nó lọt qua. Chuyện xảy ra tiếp theo:</p>
</div>
${ma('ch05/json-sau.ts', { vung: 'chan', nhan: 'TypeScript — a recursive walker with a depth cap' })}
${ketQua('ch05/json-sau.ts')}
<div class="ml-en">
<p>V8’s own <code>JSON.parse</code> handled a million levels without complaint. The <em>application’s</em> recursive walker — the obvious five-line function anyone writes to inspect a document — died with <code>RangeError</code>. In an Express handler that becomes a 500 at best; thrown inside an unawaited promise it can become an unhandled rejection, which since Node 15 terminates the process. This is not hypothetical: <strong>CVE-2020-36518</strong> was exactly this in Java’s most used JSON library, jackson-databind — a deeply nested document caused a <code>StackOverflowError</code> — and Jackson now ships <code>StreamReadConstraints</code> with a default maximum nesting depth of 1000. Defences: cap the depth (reject with 400, as the guarded function does), walk iteratively with an explicit stack, and keep the body-size limit — it bounds the attack but, as the 2 MB example shows, does not stop it. The same applies to the rich-text walkers of lesson 5.1 (<code>walk()</code> in <code>src/services/ghiNhanhNoiDung.ts</code> recurses on <code>content</code>): today they walk JSON the server built itself; the day one of them runs on a document a client uploaded, it needs a depth cap.</p>
</div>
<div class="ml-vi">
<p>Chính <code>JSON.parse</code> của V8 xử lý một triệu tầng không kêu ca gì. Còn hàm duyệt đệ quy của <em>ứng dụng</em> — hàm năm dòng hiển nhiên ai cũng viết để soi một tài liệu — chết vì <code>RangeError</code>. Trong một handler Express, tốt lắm thì thành lỗi 500; ném ra bên trong một promise không được await thì có thể thành unhandled rejection, mà từ Node 15 điều đó làm tiến trình tắt hẳn. Không phải giả định: <strong>CVE-2020-36518</strong> chính là chuyện này trong thư viện JSON được dùng nhiều nhất của Java, jackson-databind — một tài liệu lồng thật sâu gây <code>StackOverflowError</code> — và giờ Jackson có sẵn <code>StreamReadConstraints</code> với độ lồng tối đa mặc định 1000. Cách phòng: đặt trần độ sâu (từ chối bằng 400, như hàm có chặn ở trên), duyệt bằng vòng lặp với ngăn xếp tự quản, và giữ giới hạn cỡ thân request — nó giới hạn quy mô tấn công nhưng, như ví dụ 2 MB cho thấy, không chặn được. Điều này áp dụng cả cho các hàm duyệt văn bản định dạng ở bài 5.1 (<code>walk()</code> trong <code>src/services/ghiNhanhNoiDung.ts</code> đệ quy theo <code>content</code>): hôm nay chúng duyệt JSON do chính máy chủ dựng; ngày nào một hàm như thế chạy trên tài liệu client tải lên, nó cần trần độ sâu.</p>
</div>

<div class="ml-en">
<h3>The trap that fails real candidates: a static field that remembers the last test</h3>
<div class="pitfall co-tieu-de"><p><strong>Java: keeping the global answer in a <code>static</code> field and never resetting it.</strong></p><p>It passes "Run" on one example. Then "Submit" runs many test cases in the same JVM: a new <code>Solution</code> object each time, but a <code>static</code> field belongs to the class, so it keeps the previous case’s value:</p></div>
</div>
<div class="ml-vi">
<h3>Cái bẫy làm trượt ứng viên thật: biến static nhớ test trước</h3>
<div class="pitfall co-tieu-de"><p><strong>Java: giữ đáp án chung trong một trường <code>static</code> và không bao giờ đặt lại.</strong></p><p>Nó qua nút "Run" với một ví dụ. Rồi "Submit" chạy nhiều test trong cùng một JVM: mỗi lần một đối tượng <code>Solution</code> mới, nhưng trường <code>static</code> thuộc về lớp, nên nó giữ giá trị của test trước:</p></div>
</div>
${ma('ch05/BayStatic.java', { vung: 'sai', nhan: 'Java — wrong' })}
${ketQua('ch05/BayStatic.java')}
<div class="ml-en">
<p>The first answer is right, and every later one is stuck at 3, because <code>best</code> only ever grows. The fix is two habits: keep per-call state in an <em>instance</em> field or a local (a one-element array, or return a pair), and reset it at the entry point. In TypeScript the same bug is a module-level <code>let best = 0</code> outside the function; declare it inside, as every solution in this lesson does. Notice that our own Java files above use static fields — and reset them in the public method on purpose.</p>
</div>
<div class="ml-vi">
<p>Đáp án đầu đúng, mọi đáp án sau kẹt ở 3, vì <code>best</code> chỉ có tăng. Cách sửa là hai thói quen: giữ trạng thái của một lần gọi trong trường <em>của đối tượng</em> hoặc biến cục bộ (mảng một phần tử, hoặc trả về một cặp), và đặt lại nó ở hàm vào. Trong TypeScript lỗi tương tự là một <code>let best = 0</code> đặt ở cấp tệp, ngoài hàm; hãy khai báo nó bên trong, như mọi lời giải trong bài này. Để ý rằng chính các tệp Java phía trên có dùng trường static — và cố ý đặt lại nó trong hàm public.</p>
</div>

<div class="ml-en">
<h3>Where this pattern lives in real systems</h3>
<ul>
<li><strong>Folder sizes.</strong> <code>du -sh</code> is bottom-up recursion: a directory’s size is its own files plus what each subdirectory returns.</li>
<li><strong>Extracting text from a document tree.</strong> <code>nodeText()</code> in <code>src/services/ghiNhanhNoiDung.ts</code> answers "what do I return to my parent?" with "all my text": a text node returns its string, any other node returns its children’s texts joined — with a newline when the children are blocks, nothing when they are inline. Bottom-up, base case at the leaves.</li>
<li><strong>Comparing two trees.</strong> React decides what to repaint by comparing the previous and the next element tree, node by node, the way Same Tree does — with extra rules so it is not O(n³) in general.</li>
<li><strong>Serialization.</strong> <code>JSON.stringify</code>, saving a tree to a database column, sending a document over a WebSocket: a pre-order walk with markers, read back by a cursor — LC 297 in production. Roll-ups in reports (total hours of an epic = sum of its stories) are post-order sums.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Dung lượng thư mục.</strong> <code>du -sh</code> là đệ quy từ dưới lên: dung lượng một thư mục là các tệp của chính nó cộng những gì mỗi thư mục con trả về.</li>
<li><strong>Rút chữ từ cây tài liệu.</strong> <code>nodeText()</code> trong <code>src/services/ghiNhanhNoiDung.ts</code> trả lời câu "trả gì cho cha?" bằng "toàn bộ chữ của tôi": nút chữ trả chuỗi của nó, nút khác trả chữ của các con nối lại — nối bằng xuống dòng khi các con là khối, nối liền khi là chữ trong dòng. Từ dưới lên, điều kiện dừng ở lá.</li>
<li><strong>So hai cây.</strong> React quyết định vẽ lại chỗ nào bằng cách so cây phần tử cũ với cây mới, từng nút một, đúng kiểu Same Tree — có thêm luật để nói chung không thành O(n³).</li>
<li><strong>Tuần tự hoá.</strong> <code>JSON.stringify</code>, lưu một cây vào một cột CSDL, gửi tài liệu qua WebSocket: một lần đi pre-order có ký hiệu, đọc lại bằng một con trỏ — chính LC 297 chạy ở production. Phép cộng dồn trong báo cáo (tổng giờ của một epic = tổng các story) là tổng post-order.</li>
</ul>
${lienKet({ bai: 'dsa-8-1-mau', title: '8.1 — Khuôn quay lui', sub: 'Path Sum II là quay lui trên cây: chọn, đệ quy, bỏ chọn — Chương 8 mở rộng thành cây trạng thái', cta: 'Xem trước' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Find the diameter of a binary tree: the length of the longest path between any two nodes.'],
  ['C', 'Length in edges, not nodes? And the path does not have to go through the root?'],
  ['N', 'Both answers change the code: edges vs nodes shifts the result by one, and "through the root" is the trap.'],
  ['I', 'Edges, and no, it can be anywhere.'],
  ['C', 'Every path has a highest node where it bends, and there it is left height plus right height. Brute force computes heights from every node — O(n²). Instead, my helper returns the height of its subtree, so each height is computed once in a post-order walk, and while I hold left and right at a node I update a global best with left plus right. O(n) time, O(h) stack.'],
  ['N', 'The "what do I return to my parent" sentence, said before coding. It is the whole solution.'],
  ['I', 'Why return the height and not the diameter?'],
  ['C', 'Because the parent can only extend one side of my path — a path cannot fork. The diameter of my subtree is useful to the final answer, not to my parent, so it goes into the global variable.'],
  ['C', '(after coding) Testing [1,2,3,4,5]: leaves return 1, node 2 sees 1 + 1 = 2, root sees 2 + 1 = 3. A single node gives 0. For a case where the answer avoids the root I would use a deep left subtree with two long branches.'],
  ['I', 'What if the tree has 10⁵ nodes in a line?'],
  ['C', 'Then the recursion is 10⁵ deep. On my machine JavaScript throws RangeError around ten thousand levels and Java with its default 2 MB stack around sixty thousand, so both would fail. I would convert to an iterative post-order with an explicit stack, storing each node’s height in a map.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Tìm đường kính của cây nhị phân: độ dài đường đi dài nhất giữa hai nút bất kỳ.'],
  ['C', 'Độ dài tính theo cạnh hay theo nút ạ? Và đường đi không bắt buộc qua gốc đúng không? <em>("In edges, not nodes? It doesn’t have to pass through the root?")</em>'],
  ['N', 'Cả hai câu trả lời đổi code: cạnh hay nút lệch kết quả một đơn vị, còn "qua gốc" chính là cái bẫy.'],
  ['I', 'Theo cạnh, và không, ở đâu cũng được.'],
  ['C', 'Đường nào cũng có một nút cao nhất nơi nó gập, và ở đó độ dài là chiều cao trái cộng chiều cao phải. Vét cạn tính chiều cao từ mọi nút — O(n²). Thay vào đó, hàm phụ của em trả về chiều cao cây con, nên mỗi chiều cao chỉ tính một lần trong một lượt post-order, và lúc đang cầm trái với phải ở một nút thì em cập nhật biến chung best bằng trái cộng phải. O(n) thời gian, O(h) ngăn xếp. <em>("My helper returns the height; I update a global best with left plus right.")</em>'],
  ['N', 'Câu "hàm trả gì cho cha", nói ra trước khi code. Đó là cả lời giải.'],
  ['I', 'Sao trả chiều cao mà không trả đường kính?'],
  ['C', 'Vì cha chỉ nối dài được một phía đường đi của em — đường đi không được rẽ nhánh. Đường kính cây con của em có ích cho đáp án cuối, không có ích cho cha, nên nó vào biến chung. <em>("A path cannot fork.")</em>'],
  ['C', '(code xong) Test [1,2,3,4,5]: lá trả 1, nút 2 thấy 1 + 1 = 2, gốc thấy 2 + 1 = 3. Một nút thì ra 0. Để có ca đáp án không qua gốc em sẽ dựng một cây con trái sâu có hai nhánh dài.'],
  ['I', 'Nếu cây có 10⁵ nút xếp thành một hàng thì sao?'],
  ['C', 'Khi đó đệ quy sâu 10⁵. Trên máy em đo thì JavaScript ném RangeError quanh mười nghìn tầng, Java với ngăn xếp mặc định 2 MB quanh sáu mươi nghìn, nên cả hai đều sập. Em sẽ chuyển sang post-order lặp với ngăn xếp tự quản, lưu chiều cao của từng nút vào một map. <em>("Both would overflow, so I would convert it to an iterative post-order.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Returning the final answer to the parent (diameter, max path sum) instead of the quantity the parent can extend.</li>
<li>Computing <code>height()</code> inside another recursion ⇒ O(n²). If you call a recursive helper from a recursive function, ask whether one return value could carry both.</li>
<li>Treating a node with one child as a leaf (Path Sum, Minimum Depth).</li>
<li>Starting a maximum at 0 when values can be negative.</li>
<li>Storing <code>path</code> itself instead of a copy when collecting paths.</li>
<li>A <code>static</code> / module-level answer that is never reset between test cases.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Trả đáp án cuối cho cha (đường kính, max path sum) thay vì trả đại lượng mà cha nối dài được.</li>
<li>Gọi <code>height()</code> bên trong một đệ quy khác ⇒ O(n²). Gọi một hàm đệ quy từ trong một hàm đệ quy thì hãy hỏi xem một giá trị trả về có mang được cả hai thứ không.</li>
<li>Coi nút có một con là lá (Path Sum, Minimum Depth).</li>
<li>Khởi tạo giá trị lớn nhất bằng 0 khi giá trị có thể âm.</li>
<li>Lưu chính mảng <code>path</code> thay vì một bản sao khi gom đường đi.</li>
<li>Đáp án để ở <code>static</code> / cấp tệp mà không bao giờ đặt lại giữa các test.</li>
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
<li>For each of LC 104, 543, 110 and 124, write ONE sentence before coding: "my helper returns ___; at each node I also ___".</li>
<li>Write Diameter from memory and run it on <code>[1,2,null,3,4,5,null,null,6,7,null,null,8]</code>: it must print 6, not 5.</li>
<li>Run <code>do-sau-stack.ts</code> (or write a 15-line version) on your own machine and note the depth where your Node throws. Compare with the numbers above.</li>
<li>Submit LC 543, LC 110 and LC 112. In Java, put the answer in a <code>static</code> field without resetting it once, submit, and read the wrong-answer test case.</li>
</ol>
<p><strong>Done when:</strong> four sentences written, three accepted submissions, and your own measured stack depth in your notebook.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bottom-up / top-down recursion</span><span class="v">Answers flow up as return values / information flows down as parameters.</span></div>
  <div class="kv"><span class="k">base case</span><span class="v">What the empty tree returns; chosen so the general formula needs no special cases.</span></div>
  <div class="kv"><span class="k">global answer</span><span class="v">A best-so-far that any node may improve, separate from what it returns.</span></div>
  <div class="kv"><span class="k">sentinel value</span><span class="v">An impossible return value (−1 for a height) used as a signal.</span></div>
  <div class="kv"><span class="k">stack overflow</span><span class="v">The call stack runs out: <code>RangeError</code> in JS, <code>StackOverflowError</code> in Java.</span></div>
  <div class="kv"><span class="k">skewed / degenerate tree</span><span class="v">A tree shaped like a list; height = n.</span></div>
  <div class="kv"><span class="k">serialize / deserialize</span><span class="v">Turn a structure into a string and back without losing its shape.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Before coding, say what the helper returns to its parent and what it needs from its children.</li>
<li>Return what the parent can extend; put "the best anywhere" in a global answer.</li>
<li>Information about the path above goes down as a parameter.</li>
<li>One return value can carry a signal (−1) and avoid O(n²) re-walks.</li>
<li>Recursion costs O(h) stack: measured, Node dies near 10⁴ levels, Java near 6·10⁴ with a 2 MB stack.</li>
<li>Client-shaped trees (JSON) need a depth cap; a size limit alone does not stop them.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees', 'Depth, diameter, balanced, path sum and max path sum in order', 'https://neetcode.io/roadmap')}
${nguon('🔐', 'CVE-2020-36518 — deeply nested JSON in jackson-databind', 'GitHub Advisory: a deeply nested document causes StackOverflowError', 'https://github.com/advisories/GHSA-57j2-w4cx-62h2')}
${nguon('🧱', 'jackson-core #943 — StreamReadConstraints.maxNestingDepth()', 'How a real JSON library added a default nesting cap of 1000', 'https://github.com/FasterXML/jackson-core/issues/943')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Với mỗi đề LC 104, 543, 110 và 124, viết MỘT câu trước khi code: "hàm phụ của tôi trả ___; ở mỗi nút tôi còn ___".</li>
<li>Viết Diameter theo trí nhớ và chạy trên <code>[1,2,null,3,4,5,null,null,6,7,null,null,8]</code>: phải in 6, không phải 5.</li>
<li>Chạy <code>do-sau-stack.ts</code> (hoặc tự viết bản 15 dòng) trên máy bạn, ghi lại độ sâu mà Node của bạn ném lỗi. So với các con số phía trên.</li>
<li>Nộp LC 543, LC 110 và LC 112. Với Java, thử một lần để đáp án trong trường <code>static</code> mà không đặt lại, nộp, rồi đọc test case bị sai.</li>
</ol>
<p><strong>Đạt khi:</strong> viết xong bốn câu, ba lượt nộp Accepted, và trong sổ có độ sâu ngăn xếp do chính bạn đo.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bottom-up / top-down recursion (đệ quy từ dưới lên / từ trên xuống)</span><span class="v">Đáp án chảy lên bằng giá trị trả về / thông tin chảy xuống bằng tham số.</span></div>
  <div class="kv"><span class="k">base case (điều kiện dừng)</span><span class="v">Thứ cây rỗng trả về; chọn sao cho công thức chung không cần trường hợp đặc biệt.</span></div>
  <div class="kv"><span class="k">global answer (đáp án chung)</span><span class="v">Kỷ lục tạm thời mà nút nào cũng có thể cải thiện, tách khỏi thứ nó trả về.</span></div>
  <div class="kv"><span class="k">sentinel value (giá trị canh gác)</span><span class="v">Một giá trị trả về không thể có (−1 cho chiều cao) dùng làm tín hiệu.</span></div>
  <div class="kv"><span class="k">stack overflow (tràn ngăn xếp)</span><span class="v">Hết ngăn xếp lời gọi: <code>RangeError</code> ở JS, <code>StackOverflowError</code> ở Java.</span></div>
  <div class="kv"><span class="k">skewed / degenerate tree (cây lệch / suy biến)</span><span class="v">Cây có hình một danh sách; chiều cao = n.</span></div>
  <div class="kv"><span class="k">serialize / deserialize (tuần tự hoá / giải tuần tự)</span><span class="v">Biến một cấu trúc thành chuỗi và ngược lại mà không mất hình dạng.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Trước khi code, nói ra hàm phụ trả gì cho cha và cần gì từ con.</li>
<li>Trả thứ cha nối dài được; "tốt nhất ở bất kỳ đâu" để vào đáp án chung.</li>
<li>Thông tin về đoạn đường phía trên đi xuống bằng tham số.</li>
<li>Một giá trị trả về có thể kiêm tín hiệu (−1) và tránh O(n²) vì đi lại cây con.</li>
<li>Đệ quy tốn O(h) ngăn xếp: đo thật, Node chết quanh 10⁴ tầng, Java quanh 6·10⁴ với ngăn xếp 2 MB.</li>
<li>Cây do client quyết định hình dạng (JSON) cần trần độ sâu; chỉ giới hạn cỡ thì không chặn được.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Trees', 'Độ sâu, đường kính, cân bằng, path sum, max path sum theo thứ tự (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('🔐', 'CVE-2020-36518 — deeply nested JSON in jackson-databind', 'GitHub Advisory: tài liệu JSON lồng sâu gây StackOverflowError', 'https://github.com/advisories/GHSA-57j2-w4cx-62h2')}
${nguon('🧱', 'jackson-core #943 — StreamReadConstraints.maxNestingDepth()', 'Một thư viện JSON thật thêm trần độ lồng mặc định 1000 như thế nào', 'https://github.com/FasterXML/jackson-core/issues/943')}
</div>
`,
};
