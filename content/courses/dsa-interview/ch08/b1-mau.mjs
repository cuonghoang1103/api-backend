/** 8.1 — Khuôn quay lui. Mọi mã/output đọc từ ../ma/ch08 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { oDay } from './_rieng.mjs';
import { vetSubsets } from '../ma/ch08/subsets.vet.mjs';

const NUMS = [1, 2, 3];
const vet = vetSubsets(NUMS);
const BANG = bangVet(['call', 'start', 'path = answer recorded', 'waiting on the call stack', 'choices at this level'],
  vet.map((h) => [
    `#${h.k}`,
    String(h.start),
    oDay(h.path, { to: Object.fromEntries(h.path.map((_, i) => [i, 'ok'])) }),
    h.stack.length ? h.stack.map((s) => `<code>${s}</code>`).join(' → ') : '—',
    h.cho.length ? oMang(NUMS, { to: Object.fromEntries(h.cho_i.map((i) => [i, 'l'])) }) : '<em>none ⇒ return</em>',
  ]));

const DE = [
  [lc(78, 'subsets', 'Subsets', 'Medium'), 'The template itself: every node of the tree is an answer.', 'Chính là khuôn: mọi nút của cây đều là một đáp án.'],
  [lc(46, 'permutations', 'Permutations', 'Medium'), 'Order matters ⇒ loop over ALL elements, skip the used ones.', 'Thứ tự có nghĩa ⇒ duyệt MỌI phần tử, bỏ qua cái đã dùng.'],
  [lc(257, 'binary-tree-paths', 'Binary Tree Paths', 'Easy'), 'Backtracking on a tree you are given: push on the way down, pop on the way up.', 'Quay lui trên một cây có sẵn: đẩy vào lúc đi xuống, lấy ra lúc quay lên.'],
  [lc(797, 'all-paths-from-source-to-target', 'All Paths From Source to Target', 'Medium'), 'A DAG, so no visited set is needed: list every route.', 'Đồ thị không chu trình nên không cần tập "đã thăm": liệt kê mọi đường.'],
  [lc(1863, 'sum-of-all-subset-xor-totals', 'Sum of All Subset XOR Totals', 'Easy'), 'Take / skip, carry the running value down as a parameter.', 'Lấy / bỏ, mang giá trị đang tích luỹ xuống dưới bằng tham số.'],
  [lc(784, 'letter-case-permutation', 'Letter Case Permutation', 'Medium'), 'A level per character: two choices for a letter, one for a digit.', 'Mỗi ký tự là một tầng: chữ cái có hai lựa chọn, chữ số có một.'],
  [lc(77, 'combinations', 'Combinations', 'Medium'), 'Subsets of an exact size k: record only at depth k (lesson 8.2).', 'Tập con đúng k phần tử: chỉ ghi ở độ sâu k (bài 8.2).'],
  [lc(22, 'generate-parentheses', 'Generate Parentheses', 'Medium'), 'Two counters decide which choices are legal (lesson 8.2).', 'Hai bộ đếm quyết định lựa chọn nào hợp lệ (bài 8.2).'],
];

export default {
  title: '8.1 — The backtracking template: choose, explore, unchoose|||8.1 — Khuôn quay lui: chọn, đi tiếp, bỏ chọn',
  slug: 'dsa-8-1-mau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một khuôn ba nhịp (chọn → đệ quy → bỏ chọn) cho cả họ đề "liệt kê mọi…": tập con, hoán vị, mọi đường trong menu — kèm cây trạng thái nhìn thấy được, bảng n tối đa đo thật cho 2ⁿ·n và n!·n, hai cái bẫy chạy thật, và vì sao OTP 6 số cần giới hạn số lần nhập.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>The backtracking template: choose, explore, unchoose</h2>
<p class="lead">"Return <em>all</em> subsets", "list <em>every</em> permutation", "find <em>all</em> ways to…": when a problem asks you to produce every arrangement instead of one number, the answer is almost always backtracking. Interviewers like this family for a precise reason: the code is short, but it only works if you manage <strong>shared, mutable state</strong> perfectly — every change you make on the way down has to be undone on the way back up. This lesson gives you one template with three beats, shows the tree it walks, measures how fast that tree explodes, and runs the two bugs that sink most candidates.</p>

<h3>The everyday picture: a maze and a ball of thread</h3>
<p>You walk into a maze holding a ball of thread tied to the entrance. At every fork you <strong>choose</strong> a corridor and keep walking with the thread unrolling behind you (<strong>explore</strong>). When you hit a dead end, or reach a room you wanted to record, you do not teleport anywhere: you <strong>roll the thread back</strong> to the last fork, exactly undoing the steps you took (<strong>unchoose</strong>), and try the next corridor there. When every corridor of a fork is tried, you roll back one more fork. You never get lost, and you never visit the same route twice, because the thread is always the exact path from the entrance to where you stand.</p>
<p>That thread is the <code>path</code> variable in every solution below. The maze is a <strong>state-space tree</strong>: the root is "nothing chosen yet", each edge is one choice, each node is a partial solution, and the leaves (or sometimes every node) are the answers. Nobody builds this tree in memory. The recursion walks it depth-first, and the call stack is the list of forks you can still roll back to. <strong>Backtracking</strong> is exactly that: depth-first search over a tree of choices, undoing each choice when you return.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Khuôn quay lui: chọn, đi tiếp, bỏ chọn</h2>
<p class="lead">"Trả về <em>mọi</em> tập con", "liệt kê <em>mọi</em> hoán vị", "tìm <em>tất cả</em> cách để…": khi đề bắt bạn sinh ra mọi cách sắp xếp thay vì một con số, đáp án gần như luôn là quay lui (backtracking). Người phỏng vấn thích họ đề này vì một lý do rất cụ thể: code ngắn, nhưng chỉ chạy đúng khi bạn quản lý <strong>trạng thái dùng chung, bị sửa liên tục</strong> (shared mutable state) một cách hoàn hảo — mọi thay đổi bạn làm lúc đi xuống phải được hoàn tác đúng lúc quay lên. Bài này cho bạn một khuôn ba nhịp, cho bạn THẤY cái cây mà nó đi, đo xem cây đó nổ tung nhanh tới mức nào, và chạy thật hai cái lỗi đánh trượt phần lớn ứng viên.</p>

<h3>Hình dung đời thường: mê cung và cuộn chỉ</h3>
<p>Bạn bước vào một mê cung, tay cầm cuộn chỉ đã buộc một đầu ở cửa vào. Tới mỗi ngã rẽ bạn <strong>chọn</strong> một lối và đi tiếp, sợi chỉ nhả dần phía sau (<strong>đi tiếp</strong> — explore). Gặp ngõ cụt, hoặc tới một căn phòng bạn muốn ghi lại, bạn không "dịch chuyển tức thời" đi đâu cả: bạn <strong>cuộn chỉ ngược lại</strong> về ngã rẽ gần nhất, hoàn tác đúng những bước vừa đi (<strong>bỏ chọn</strong> — unchoose), rồi thử lối kế tiếp ở đó. Khi mọi lối của một ngã rẽ đã thử hết, bạn cuộn về thêm một ngã rẽ nữa. Bạn không bao giờ lạc, và không bao giờ đi lại cùng một đường hai lần, vì sợi chỉ lúc nào cũng là đúng con đường từ cửa vào tới chỗ bạn đang đứng.</p>
<p>Sợi chỉ đó chính là biến <code>path</code> trong mọi lời giải bên dưới. Mê cung là một <strong>cây trạng thái</strong> (state-space tree): gốc là "chưa chọn gì", mỗi cạnh là một lựa chọn, mỗi nút là một lời giải bộ phận (partial solution — đáp án đang làm dở), còn các lá (hoặc đôi khi mọi nút) là đáp án. Không ai dựng cây này trong bộ nhớ. Đệ quy đi nó theo chiều sâu, và ngăn xếp lời gọi (call stack) là danh sách các ngã rẽ bạn còn có thể cuộn về. <strong>Quay lui</strong> chính là vậy: tìm kiếm theo chiều sâu (DFS) trên một cây lựa chọn, hoàn tác mỗi lựa chọn khi quay về.</p>
${csd('csd201-slide-cs6-1', 'vi', 'CS.6 Quay lui: khuôn chọn/đệ quy/bỏ chọn, cây trạng thái', '<p>Ở CSD201 (phần ⭐ chuyên sâu CS.6) bạn đã gặp khuôn chọn → đệ quy → bỏ chọn và vẽ cây trạng thái của tập con, hoán vị, tổ hợp bằng Java. Ôn nhanh một câu: mỗi tầng đệ quy là một quyết định, đường đi từ gốc là lời giải đang dựng. <strong>Ở đây đi sâu thêm:</strong> bốn câu hỏi để viết khuôn trong 2 phút khi phỏng vấn, bảng vết ngăn xếp lời gọi sinh từ lần chạy thật, bảng "n tối đa" đo trên máy thật, hai lỗi kinh điển chạy ra kết quả sai thật, và cách nói to lời giải bằng tiếng Anh.</p>')}
${csd('csd201-de-quy', 'vi', '3.1 Đệ quy &amp; call stack', '<p>Nếu "khung lời gọi" (stack frame) còn mơ hồ: mỗi lời gọi hàm có một khung riêng chứa tham số và biến cục bộ, chồng lên nhau rồi rút xuống theo thứ tự ngược. Quay lui dựa hoàn toàn vào điều đó — nhưng <code>path</code> thì KHÔNG nằm trong khung riêng nào, nó dùng chung cho mọi khung, nên mới phải tự tay hoàn tác.</p>')}
</div>

<div class="ml-en">
<h3>The template: four questions, three beats</h3>
<p>Before writing a line, answer four questions out loud. They are the whole design:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">What is the path?</span><span class="lz-d">The partial solution you carry: the elements chosen so far, the string built so far, the queens placed so far.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">What are the choices at this level?</span><span class="lz-d">"Elements from <code>start</code> on" (subsets, combinations), "every unused element" (permutations), "the letters of digit i" (phone keypad).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">When do I record an answer?</span><span class="lz-d">At every node, at a leaf (length = n), or when a target is hit. Record a <strong>copy</strong>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">What exactly do I undo?</span><span class="lz-d">Everything step 1 changed: <code>path.pop()</code>, and also <code>used[i] = false</code>, a Set entry, a board cell.</span></div>
</div>
<p>Then the code always has the same three beats inside the loop: <strong>choose</strong> (modify the shared state), <strong>explore</strong> (recurse one level deeper), <strong>unchoose</strong> (restore the state exactly). If you remember nothing else: <em>every push has exactly one pop, on the same level, right after the recursive call</em>.</p>
</div>
<div class="ml-vi">
<h3>Khuôn: bốn câu hỏi, ba nhịp</h3>
<p>Trước khi viết một dòng, hãy trả lời to bốn câu hỏi. Chúng chính là toàn bộ thiết kế:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đường đi (path) là gì?</span><span class="lz-d">Lời giải bộ phận bạn mang theo: các phần tử đã chọn, chuỗi đã dựng, các quân hậu đã đặt.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lựa chọn ở tầng này là gì?</span><span class="lz-d">"Các phần tử từ <code>start</code> trở đi" (tập con, tổ hợp), "mọi phần tử chưa dùng" (hoán vị), "các chữ cái của phím số thứ i" (bàn phím điện thoại).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Khi nào ghi một đáp án?</span><span class="lz-d">Ở mọi nút, ở lá (độ dài = n), hoặc khi chạm đích. Ghi một <strong>bản sao</strong>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chính xác phải hoàn tác cái gì?</span><span class="lz-d">Mọi thứ bước chọn đã sửa: <code>path.pop()</code>, và cả <code>used[i] = false</code>, một phần tử trong Set, một ô trên bàn cờ.</span></div>
</div>
<p>Sau đó code luôn có đúng ba nhịp trong vòng lặp: <strong>chọn</strong> (sửa trạng thái dùng chung), <strong>đi tiếp</strong> (đệ quy xuống một tầng), <strong>bỏ chọn</strong> (trả trạng thái về y như cũ). Nếu chỉ nhớ được một câu: <em>mỗi lần push có đúng một lần pop, ở cùng tầng, ngay sau lời gọi đệ quy</em>.</p>
</div>

<div class="ml-en">
<h3>Signals: when to reach for backtracking</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"return all…", "list every…", "generate all…"</span><span class="v">The output itself is exponential (all subsets, all permutations), so no cleverer algorithm exists: you must visit every answer. Backtracking visits each with little waste.</span></div>
  <div class="kv"><span class="k">the output type is a list of lists / a list of strings</span><span class="v"><code>List&lt;List&lt;Integer&gt;&gt;</code>, <code>string[]</code> of arrangements: a strong hint before you even read the story.</span></div>
  <div class="kv"><span class="k">n ≤ 10 … 20</span><span class="v">Lesson 0.1's table: n ≤ 10–11 allows n!, n ≤ 20–25 allows 2ⁿ. A tiny limit is the problem setter telling you exponential is expected.</span></div>
  <div class="kv"><span class="k">"place / fill / assign … so that no two…"</span><span class="v">Constraint problems (N-Queens, Sudoku, timetables): backtracking plus pruning — lesson 8.3.</span></div>
  <div class="kv"><span class="k">"does there exist a way…" with no structure to exploit</span><span class="v">Backtracking that returns <code>true</code> at the first success. If the same sub-question repeats, it becomes dynamic programming (Chapter 9).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào cầm quay lui lên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"trả về mọi…", "liệt kê tất cả…", "sinh mọi…"</span><span class="v">Chính output đã có kích thước hàm mũ (mọi tập con, mọi hoán vị), nên không có thuật toán nào khôn hơn: bạn buộc phải đi qua từng đáp án. Quay lui đi qua từng cái với rất ít lãng phí.</span></div>
  <div class="kv"><span class="k">kiểu trả về là danh sách các danh sách / danh sách chuỗi</span><span class="v"><code>List&lt;List&lt;Integer&gt;&gt;</code>, <code>string[]</code> các cách sắp xếp: một gợi ý mạnh ngay cả trước khi đọc câu chuyện của đề.</span></div>
  <div class="kv"><span class="k">n ≤ 10 … 20</span><span class="v">Bảng ở bài 0.1: n ≤ 10–11 cho phép n!, n ≤ 20–25 cho phép 2ⁿ. Giới hạn bé xíu là người ra đề đang nói với bạn rằng hàm mũ là được.</span></div>
  <div class="kv"><span class="k">"đặt / điền / xếp … sao cho không có hai…"</span><span class="v">Đề ràng buộc (N-Queens, Sudoku, xếp lịch): quay lui cộng cắt nhánh — bài 8.3.</span></div>
  <div class="kv"><span class="k">"có tồn tại cách nào…" mà không có cấu trúc gì để khai thác</span><span class="v">Quay lui trả <code>true</code> ngay ở lần thành công đầu tiên. Nếu cùng một câu hỏi con lặp lại nhiều lần, nó trở thành quy hoạch động (Chương 9).</span></div>
</div>
${lienKet({ bai: 'dsa-0-1-big-o', title: '0.1 — Big-O và bảng giới hạn n', sub: 'Bảng n ↔ độ phức tạp: n ≤ 10–11 ⇒ n!, n ≤ 20–25 ⇒ 2ⁿ — bài này đo lại hai dòng đó trên máy thật', cta: 'Ôn bảng' })}
</div>

<div class="ml-en">
<h3>Worked example: Subsets</h3>
<p><strong>Problem (in our words).</strong> Given an array of distinct integers, return every subset (the power set), including the empty one, in any order. Example: <code>[1, 2, 3]</code> has 8 subsets: <code>[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]</code>.</p>
<p><strong>Step 1 — the brute-force idea, said out loud.</strong> Each element is either in or out: n yes/no switches, so 2ⁿ subsets. One way is to count from 0 to 2ⁿ − 1 and read the bits (Chapter 1 showed this bitmask trick). It works, but it does not generalise: as soon as the choices are not yes/no — "which unused element goes next", "which letter of this key" — the bitmask has nothing to say. Backtracking is the general version.</p>
<p><strong>Step 2 — answer the four questions.</strong> Path: the elements chosen so far, in increasing index order. Choices at this level: any element <em>after</em> the last one chosen, so <code>i</code> from <code>start</code> to n − 1 — this is what prevents producing <code>[2, 1]</code> after <code>[1, 2]</code>. Record: at <em>every</em> node, because every path from the root is a valid subset. Undo: <code>path.pop()</code>.</p>
<p><strong>Step 3 — write it.</strong></p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Subsets</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng số nguyên đôi một khác nhau, trả về mọi tập con (tập luỹ thừa — power set), kể cả tập rỗng, theo thứ tự bất kỳ. Ví dụ: <code>[1, 2, 3]</code> có 8 tập con: <code>[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]</code>.</p>
<p><strong>Bước 1 — ý vét cạn, nói to ra.</strong> Mỗi phần tử hoặc có mặt hoặc không: n công tắc có/không, nên có 2ⁿ tập con. Một cách là đếm từ 0 tới 2ⁿ − 1 rồi đọc các bit (Chương 1 đã chỉ mẹo bitmask này). Nó chạy được, nhưng không tổng quát: ngay khi lựa chọn không còn là có/không — "phần tử chưa dùng nào đứng tiếp", "chữ nào của phím này" — bitmask không giúp được gì. Quay lui là bản tổng quát.</p>
<p><strong>Bước 2 — trả lời bốn câu hỏi.</strong> Đường đi: các phần tử đã chọn, theo thứ tự chỉ số tăng dần. Lựa chọn ở tầng này: bất kỳ phần tử nào đứng <em>sau</em> phần tử vừa chọn, tức <code>i</code> từ <code>start</code> tới n − 1 — chính điều này ngăn việc sinh ra <code>[2, 1]</code> sau khi đã có <code>[1, 2]</code>. Ghi đáp án: ở <em>mọi</em> nút, vì đường đi nào từ gốc cũng là một tập con hợp lệ. Hoàn tác: <code>path.pop()</code>.</p>
<p><strong>Bước 3 — viết ra.</strong></p>
</div>
${maHai('ch08/subsets.ts', 'ch08/Subsets.java', { vung: 'khuon' })}
${ketQua('ch08/subsets.ts')}
<div class="ml-en">
<p>Line by line, the three decisions that matter:</p>
<ul>
<li><code>res.push([...path])</code> / <code>new ArrayList&lt;&gt;(path)</code> — a <strong>snapshot</strong>. <code>path</code> keeps changing after this line; the answer must not.</li>
<li><code>backtrack(i + 1)</code>, not <code>backtrack(start + 1)</code> — the next level may only use elements after the one we just chose. With <code>start + 1</code> you would get <code>[1,3,3]</code>-style repeats.</li>
<li><code>path.pop()</code> right after the call, at the same indentation as the push. In Java, <code>path.remove(path.size() - 1)</code> removes by <em>index</em>; <code>path.remove(x)</code> with an <code>Integer</code> would remove the first element <em>equal</em> to x — a different element when values repeat.</li>
</ul>
<p>The output also shows the calls counter: for n = 20 there are exactly 1,048,576 calls for 1,048,576 answers. In this formulation <strong>every call is an answer</strong> — no call is wasted.</p>
</div>
<div class="ml-vi">
<p>Từng dòng, ba quyết định quan trọng:</p>
<ul>
<li><code>res.push([...path])</code> / <code>new ArrayList&lt;&gt;(path)</code> — một <strong>ảnh chụp</strong> (snapshot). <code>path</code> còn thay đổi tiếp sau dòng này; đáp án thì không được đổi theo.</li>
<li><code>backtrack(i + 1)</code>, không phải <code>backtrack(start + 1)</code> — tầng sau chỉ được dùng phần tử đứng sau phần tử vừa chọn. Viết <code>start + 1</code> là bạn nhận về những thứ lặp kiểu <code>[1,3,3]</code>.</li>
<li><code>path.pop()</code> ngay sau lời gọi, cùng mức thụt lề với push. Trong Java, <code>path.remove(path.size() - 1)</code> xoá theo <em>chỉ số</em>; <code>path.remove(x)</code> với một <code>Integer</code> sẽ xoá phần tử đầu tiên <em>bằng</em> x — một phần tử khác hẳn khi giá trị có lặp.</li>
</ul>
<p>Output còn in bộ đếm lời gọi: với n = 20 có đúng 1.048.576 lời gọi cho 1.048.576 đáp án. Trong cách viết này <strong>mỗi lời gọi là một đáp án</strong> — không lời gọi nào bị phí.</p>
</div>

<div class="ml-en">
<h3>Watch it run: the call stack and the path</h3>
<p>One row per call of <code>backtrack(start)</code> on <code>[1, 2, 3]</code>, in the order they happen. Green = the path at that moment (the subset recorded), blue = the choices that call will try. The fourth column is the call stack still waiting above it — the forks you can roll the thread back to. The table was produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: ngăn xếp lời gọi và đường đi</h3>
<p>Mỗi hàng là một lời gọi <code>backtrack(start)</code> trên <code>[1, 2, 3]</code>, theo đúng thứ tự xảy ra. Ô xanh lá = đường đi lúc đó (tập con được ghi), ô xanh dương = các lựa chọn mà lời gọi đó sẽ thử. Cột thứ tư là ngăn xếp lời gọi còn đang chờ phía trên — những ngã rẽ bạn có thể cuộn chỉ về. Bảng sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG}
<div class="ml-en">
<p>Read three things in it. First, the order: <code>[1,2,3]</code> (call #4) comes before <code>[1,3]</code> (call #5) — depth first, the thread goes as deep as it can before rolling back. Second, the stack column: at call #4 three frames are waiting (<code>[] → [1] → [1,2]</code>); when #4 returns, the frame of <code>[1,2]</code> pops 3 off, finds no more choices, returns; the frame of <code>[1]</code> pops 2 and tries 3 — call #5. The stack never holds more than n = 3 frames. Third, the choices column shrinks to "none" at the right edge: calls #4, #5, #7 and #8 have nothing left to try, so they record and return immediately.</p>
${moPhong('ch08/subsets.sim.js', 'en', 'The state-space tree of subsets([1,2,3])', 'Each node lights up when its subset is recorded; the log prints every choose and unchoose. Change nums and run again.')}
</div>
<div class="ml-vi">
<p>Đọc ba điều trong bảng. Một, thứ tự: <code>[1,2,3]</code> (lời gọi #4) xuất hiện trước <code>[1,3]</code> (lời gọi #5) — theo chiều sâu, sợi chỉ đi sâu hết mức rồi mới cuộn về. Hai, cột ngăn xếp: ở lời gọi #4 có ba khung đang chờ (<code>[] → [1] → [1,2]</code>); khi #4 trả về, khung của <code>[1,2]</code> pop số 3 ra, thấy hết lựa chọn, trả về; khung của <code>[1]</code> pop số 2 rồi thử 3 — đó là lời gọi #5. Ngăn xếp không bao giờ giữ quá n = 3 khung. Ba, cột lựa chọn co lại thành "none" ở mép phải: các lời gọi #4, #5, #7, #8 không còn gì để thử, nên ghi đáp án rồi trả về ngay.</p>
${moPhong('ch08/subsets.sim.js', 'vi', 'Cây trạng thái của subsets([1,2,3])', 'Mỗi nút sáng lên khi tập con của nó được ghi; ô log in từng lần chọn và bỏ chọn. Đổi nums rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>The same problem, the other tree: take or skip</h3>
<p>There is a second way to draw the tree, and you should know both. Level i decides <em>only</em> element i: take it or skip it. Two branches per level, depth n, 2ⁿ leaves, and only the leaves are answers. It is the bitmask written as recursion. The output order differs (the "take" branch is explored first), which LeetCode accepts.</p>
</div>
<div class="ml-vi">
<h3>Cùng một đề, cái cây kia: lấy hay bỏ</h3>
<p>Có cách thứ hai để vẽ cây, và bạn nên biết cả hai. Tầng i <em>chỉ</em> quyết định phần tử i: lấy hay bỏ. Mỗi tầng hai nhánh, sâu n, 2ⁿ lá, và chỉ lá mới là đáp án. Đó chính là bitmask viết bằng đệ quy. Thứ tự output khác (nhánh "lấy" được đi trước), LeetCode vẫn chấp nhận.</p>
</div>
${maHai('ch08/subsets.ts', 'ch08/Subsets.java', { vung: 'chon-bo' })}
<div class="ml-en">
<p>Which one to write? The <em>for-loop with start</em> form is the one that generalises to combinations, combination sum, and the duplicate-skipping rule of lesson 8.2, so make it your default. The <em>take/skip</em> form is the natural one when you carry a value down (a running sum, a running XOR — practice problem LC 1863) and when you later turn the recursion into dynamic programming, because "decide element i" is exactly a DP state.</p>
</div>
<div class="ml-vi">
<p>Nên viết dạng nào? Dạng <em>vòng for với start</em> mở rộng được sang tổ hợp, combination sum và luật bỏ trùng của bài 8.2, nên lấy nó làm mặc định. Dạng <em>lấy/bỏ</em> tự nhiên hơn khi bạn mang một giá trị xuống (tổng đang cộng dồn, XOR đang tích luỹ — đề luyện LC 1863) và khi sau này bạn biến đệ quy thành quy hoạch động, vì "quyết định phần tử i" chính là một trạng thái DP.</p>
</div>

<div class="ml-en">
<h3>Complexity: count the nodes, then multiply by the cost per node</h3>
<p>For backtracking, Big-O is a counting exercise. <strong>Time = number of nodes × work per node.</strong> Subsets: 2ⁿ nodes (the counter proves it), and recording copies up to n elements, so <strong>O(n · 2ⁿ)</strong>. Extra space: the recursion depth and the path are O(n); the output itself is O(n · 2ⁿ) and is usually not counted as "extra". Say both parts in the interview: "O(n·2ⁿ) time, because there are 2ⁿ subsets and copying each is O(n); O(n) auxiliary space for the recursion."</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp: đếm số nút, rồi nhân với công mỗi nút</h3>
<p>Với quay lui, Big-O là bài toán đếm. <strong>Thời gian = số nút × công mỗi nút.</strong> Subsets: 2ⁿ nút (bộ đếm đã chứng minh), và việc ghi đáp án chép tới n phần tử, nên <strong>O(n · 2ⁿ)</strong>. Bộ nhớ phụ: độ sâu đệ quy và đường đi là O(n); bản thân output là O(n · 2ⁿ) và thường không tính là "phụ". Hãy nói đủ cả hai phần khi phỏng vấn: "O(n·2ⁿ) thời gian, vì có 2ⁿ tập con và chép mỗi cái tốn O(n); O(n) bộ nhớ phụ cho đệ quy."</p>
</div>

<div class="ml-en">
<h3>Variant 1 — Permutations: order matters, so the choices change</h3>
<p>Return every ordering of n distinct numbers. Only question 2 changes: the choices for the next slot are <em>all</em> elements not yet on the path, not just those after the last one. We need to know which are used, so the state has two pieces — <code>path</code> and a <code>used[]</code> array — and question 4 says: undo <em>both</em>. Answers are recorded only at leaves (path length n).</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Permutations: thứ tự có nghĩa, nên lựa chọn đổi</h3>
<p>Trả về mọi cách sắp thứ tự n số khác nhau. Chỉ câu hỏi 2 thay đổi: lựa chọn cho vị trí kế tiếp là <em>mọi</em> phần tử chưa có trên đường đi, không chỉ những phần tử đứng sau phần tử vừa chọn. Ta cần biết cái nào đã dùng, nên trạng thái có hai mảnh — <code>path</code> và mảng <code>used[]</code> — và câu hỏi 4 nói: hoàn tác <em>cả hai</em>. Đáp án chỉ được ghi ở lá (đường đi dài n).</p>
</div>
${maHai('ch08/permutations.ts', 'ch08/Permutations.java', { vung: 'perm' })}
${ketQua('ch08/permutations.ts')}
<div class="ml-en">
<p>Look at the last column: the number of nodes divided by n! settles at <strong>2.718…</strong> — that is <em>e</em>. The tree has n! leaves, n!/1! nodes one level up, n!/2! above that, and so on; the sum n!·(1/0! + 1/1! + 1/2! + …) tends to e·n!. So the internal nodes cost less than twice the leaves, and the total is <strong>O(n · n!)</strong> once you add the O(n) copy at each leaf. Each node also scans all n elements to find the unused ones, which a careful analysis counts too, but the leaves dominate.</p>
</div>
<div class="ml-vi">
<p>Nhìn cột cuối: số nút chia cho n! dừng ở <strong>2,718…</strong> — đó là số <em>e</em>. Cây có n! lá, phía trên một tầng có n!/1! nút, trên nữa n!/2!, cứ thế; tổng n!·(1/0! + 1/1! + 1/2! + …) tiến tới e·n!. Vậy các nút bên trong tốn chưa tới hai lần số lá, và tổng cộng là <strong>O(n · n!)</strong> khi cộng phép chép O(n) ở mỗi lá. Mỗi nút còn quét đủ n phần tử để tìm cái chưa dùng, phân tích kỹ cũng tính phần đó, nhưng các lá chiếm phần lớn.</p>
</div>

<div class="ml-en">
<h3>Variant 2 — every route through a menu (All Paths From Source to Target)</h3>
<p>A directed acyclic graph of n nodes; list every path from node 0 to node n − 1. The path is the list of nodes walked; the choices are the outgoing edges of the current node; record when you reach the target. Because the graph has no cycle, you never need a "visited" set — you cannot walk in a circle. The same code answers a real product question: on a site whose menus overlap (a course can be reached from "Courses" and from "Academy"), <em>which breadcrumbs lead to this page?</em></p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — mọi đường đi trong một menu (All Paths From Source to Target)</h3>
<p>Một đồ thị có hướng không chu trình (DAG) n đỉnh; liệt kê mọi đường đi từ đỉnh 0 tới đỉnh n − 1. Đường đi là danh sách các đỉnh đã đi; lựa chọn là các cạnh đi ra từ đỉnh hiện tại; ghi đáp án khi tới đích. Vì đồ thị không có chu trình nên không cần tập "đã thăm" — bạn không thể đi vòng tròn. Cùng đoạn code đó trả lời một câu hỏi sản phẩm có thật: trên một trang web mà các menu chồng nhau (một khoá học vào được từ "Courses" lẫn từ "Academy"), <em>những đường breadcrumb nào dẫn tới trang này?</em></p>
</div>
${maHai('ch08/all-paths.ts', 'ch08/AllPaths.java', { vung: 'all-paths' })}
${ketQua('ch08/all-paths.ts')}
<div class="ml-en">
<p>Three routes lead to the Node.js page. If the menu could loop (a "related" link pointing back up), you would add a <code>visited</code> set — and you would mark and unmark it exactly like <code>used[]</code>, because "visited" means "on the current path", not "ever seen". That distinction is the bridge to Word Search in lesson 8.3.</p>
</div>
<div class="ml-vi">
<p>Có ba đường dẫn tới trang Node.js. Nếu menu có thể vòng lại (một liên kết "liên quan" trỏ ngược lên trên), bạn thêm tập <code>visited</code> — và đánh dấu rồi gỡ đánh dấu nó y như <code>used[]</code>, vì "đã thăm" ở đây nghĩa là "đang nằm trên đường đi hiện tại", không phải "đã từng thấy". Phân biệt đó là cây cầu sang Word Search ở bài 8.3.</p>
</div>

<div class="ml-en">
<h3>How big can n be? Measured on a real machine</h3>
<p>Lesson 0.1 gave the rule of thumb (n ≤ 20–25 for 2ⁿ, n ≤ 10–11 for n!). Here it is measured. "Store" builds the full answer list as LeetCode asks; "walk" visits every node and only counts, which is the cost of the search itself without the output:</p>
</div>
<div class="ml-vi">
<h3>n lớn được tới đâu? Đo trên máy thật</h3>
<p>Bài 0.1 cho quy tắc ước lượng (n ≤ 20–25 với 2ⁿ, n ≤ 10–11 với n!). Đây là số đo thật. "Store" dựng đủ danh sách đáp án như LeetCode yêu cầu; "walk" đi qua mọi nút và chỉ đếm, tức là chi phí của riêng việc tìm kiếm, chưa tính output:</p>
</div>
${ma('ch08/bung-no.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch08/bung-no.ts')}
${ketQua('ch08/BungNo.java')}
<div class="ml-en">
<p>Read the numbers like an engineer:</p>
<ul>
<li><strong>Every +2 on n multiplies the subset work by about 4</strong> (n = 20 → 22 → 24 → 26 in the walk rows): that is 2ⁿ. Storing all 2²⁰ subsets costs tens to a few hundred milliseconds, mostly allocating a million small arrays — output, not search. So 2ⁿ·n is comfortable up to n ≈ 20 and the search alone up to the mid-twenties.</li>
<li><strong>Every +1 on n multiplies the permutation work by about n</strong>: from n = 10 to 11 the walk grows roughly 10×, from 11 to 12 roughly 13–15×. Storing 3.6 million permutations at n = 10 already takes a fraction of a second; n = 12 is several seconds even for Java just walking. So n!·n stops at n ≈ 10–11 — exactly the table of lesson 0.1.</li>
<li><strong>Java is several times faster here</strong>, and the TypeScript numbers jump between runs (the timing file is re-measured whenever it is run, and the machine may be busy). Language changes the constant; it never moves the limit by more than one step of n. That is why a constraint like "n ≤ 10" decides the algorithm, not the language.</li>
</ul>
<table>
<thead><tr><th>Shape</th><th>Nodes / answers</th><th>Max n (~1 second, measured above)</th><th>Example</th></tr></thead>
<tbody>
<tr><td>All subsets, stored</td><td>2ⁿ, each copied in O(n)</td><td>≈ 20 (TS) – 22 (Java)</td><td>Subsets, choosing a set of courses to register</td></tr>
<tr><td>All subsets, only counted/checked</td><td>2ⁿ</td><td>≈ 25–26</td><td>"is there a subset with sum k?" by brute force</td></tr>
<tr><td>All permutations, stored</td><td>n!, each copied in O(n)</td><td>≈ 9–10</td><td>Permutations</td></tr>
<tr><td>All permutations, only counted/checked</td><td>≈ e·n!</td><td>≈ 10–11</td><td>trying every delivery order (brute-force TSP)</td></tr>
</tbody></table>
</div>
<div class="ml-vi">
<p>Đọc các con số như một kỹ sư:</p>
<ul>
<li><strong>Mỗi lần n tăng 2, công việc của tập con nhân khoảng 4</strong> (n = 20 → 22 → 24 → 26 ở các hàng walk): đó là 2ⁿ. Lưu đủ 2²⁰ tập con tốn từ vài chục tới vài trăm mili-giây, chủ yếu để cấp phát một triệu mảng nhỏ — tức là tiền output, không phải tiền tìm kiếm. Vậy 2ⁿ·n thoải mái tới n ≈ 20, còn riêng việc tìm kiếm thì tới khoảng 25.</li>
<li><strong>Mỗi lần n tăng 1, công việc của hoán vị nhân khoảng n</strong>: từ n = 10 lên 11, walk tăng cỡ 10 lần; từ 11 lên 12 cỡ 13–15 lần. Lưu 3,6 triệu hoán vị ở n = 10 đã mất một phần giây; n = 12 mất vài giây kể cả Java chỉ đi qua. Vậy n!·n dừng ở n ≈ 10–11 — đúng bảng của bài 0.1.</li>
<li><strong>Java nhanh hơn vài lần ở đây</strong>, và số đo TypeScript nhảy giữa các lần chạy (tệp đo được đo lại mỗi lần chạy, và máy có thể đang bận). Ngôn ngữ chỉ đổi hằng số; nó không bao giờ dịch giới hạn quá một nấc của n. Vì thế ràng buộc kiểu "n ≤ 10" quyết định thuật toán, không phải ngôn ngữ.</li>
</ul>
<table>
<thead><tr><th>Dạng bài</th><th>Số nút / đáp án</th><th>n tối đa (~1 giây, đo ở trên)</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Mọi tập con, lưu đáp án</td><td>2ⁿ, mỗi cái chép O(n)</td><td>≈ 20 (TS) – 22 (Java)</td><td>Subsets, chọn tập môn đăng ký</td></tr>
<tr><td>Mọi tập con, chỉ đếm/kiểm</td><td>2ⁿ</td><td>≈ 25–26</td><td>"có tập con nào có tổng = k?" vét cạn</td></tr>
<tr><td>Mọi hoán vị, lưu đáp án</td><td>n!, mỗi cái chép O(n)</td><td>≈ 9–10</td><td>Permutations</td></tr>
<tr><td>Mọi hoán vị, chỉ đếm/kiểm</td><td>≈ e·n!</td><td>≈ 10–11</td><td>thử mọi thứ tự giao hàng (TSP vét cạn)</td></tr>
</tbody></table>
</div>

<div class="ml-en">
<h3>Where this pattern lives in real systems</h3>
<ul>
<li><strong>Decision tables in test design (SWT301).</strong> CT Work, the project tracker built into this site, generates a decision table from n yes/no conditions: <code>decisionRules()</code> in <code>src/services/work/testDesign.ts</code> walks every one of the 2ⁿ rules (with a bitmask loop — the take/skip tree flattened), and the input schema caps the conditions at <strong>10</strong> (<code>.max(10)</code>). That cap is this lesson's table in production: 2¹⁰ = 1,024 rules is something a tester can still review; 2²⁰ is not.</li>
<li><strong>Breadcrumbs and menus.</strong> "Every way to reach this page" is All Paths From Source to Target, and it is how you check that a menu reorganisation did not orphan a page.</li>
<li><strong>Configuration search.</strong> Trying every combination of build flags, every order of a small set of migrations, every assignment of 6 interns to 6 projects: all permutation or subset trees, fine while n is tiny, hopeless beyond the table.</li>
<li><strong>The /algorithms page of this site</strong> has ready-made visualisations of permutations, N-Queens and Sudoku in its catalogue, next to the simulations linked from this chapter.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Bảng quyết định trong thiết kế test (SWT301).</strong> CT Work, công cụ quản lý dự án tích hợp trong chính trang này, sinh bảng quyết định (decision table) từ n điều kiện có/không: <code>decisionRules()</code> trong <code>src/services/work/testDesign.ts</code> đi qua đủ 2ⁿ luật (bằng một vòng bitmask — cây lấy/bỏ được trải phẳng), và lược đồ đầu vào chặn số điều kiện ở <strong>10</strong> (<code>.max(10)</code>). Cái trần đó chính là bảng của bài này đang chạy ở production: 2¹⁰ = 1.024 luật thì người kiểm thử còn soát được; 2²⁰ thì không.</li>
<li><strong>Breadcrumb và menu.</strong> "Mọi đường dẫn tới trang này" chính là All Paths From Source to Target, và là cách kiểm tra một lần sắp xếp lại menu có làm trang nào thành "mồ côi" (không còn đường vào) hay không.</li>
<li><strong>Tìm cấu hình.</strong> Thử mọi tổ hợp cờ build, mọi thứ tự của một nhóm nhỏ migration, mọi cách phân 6 bạn thực tập vào 6 dự án: đều là cây hoán vị hoặc tập con, ổn khi n bé xíu, vô vọng khi vượt bảng.</li>
<li><strong>Trang /algorithms của chính trang này</strong> có sẵn mô phỏng hoán vị, N-Queens và Sudoku trong danh mục, bên cạnh các mô phỏng mà chương này dẫn tới.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: brute force is backtracking without pruning</h3>
<p>Guessing a 6-digit code is walking a tree with 10 choices per level, depth 6, and checking every leaf. Nothing prunes it: a wrong code says "wrong", not "the first digit was right". So the attacker's cost is the whole tree, and the only question is how fast each leaf can be checked:</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: dò mật khẩu vét cạn là quay lui không có cắt nhánh</h3>
<p>Đoán một mã 6 chữ số là đi một cây mỗi tầng 10 lựa chọn, sâu 6, và kiểm từng lá. Không gì cắt được nhánh: mã sai chỉ báo "sai", không báo "chữ số đầu đúng rồi". Nên cái giá của kẻ tấn công là cả cái cây, và câu hỏi duy nhất là kiểm mỗi lá nhanh tới đâu:</p>
</div>
${ma('ch08/otp-vet-can.ts', { nhan: 'TypeScript — offline brute force' })}
${ketQua('ch08/otp-vet-can.ts')}
<div class="ml-en">
<p>Offline, when the attacker holds something to compare against locally, all 10⁶ codes fall in well under a second, and even 26⁸ lowercase passwords (about 2·10¹¹) fall in hours at this rate — dedicated hardware is far faster. Two defences follow, and this site uses both:</p>
<ul>
<li><strong>Never let the check be offline and cheap.</strong> An OTP lives only on the server, so every guess is a network request the server controls. <code>src/services/otp.service.ts</code> makes the code 6 digits (<code>OTP_LENGTH = 6</code>) from <code>crypto.randomInt</code>, keeps it 5 minutes for email verification (10 for password reset), and counts wrong answers in Redis: after <code>MAX_ATTEMPTS = 5</code> it refuses with <code>TOO_MANY_ATTEMPTS</code>. Five tries out of 10⁶ is a 1-in-200,000 chance per code. Admin two-factor codes have the same idea per user: <code>SAI_TOI_DA = 5</code> wrong codes per 15 minutes in <code>src/services/mfa/mfa.service.ts</code>, and the whole <code>/api/v1/auth</code> prefix sits behind <code>authLimiter</code> in <code>src/index.ts</code> (10 requests per minute per IP in production). The last output line shows what that rate alone means: about 69 days for one IP to sweep 10⁶ codes, while each code expires in minutes.</li>
<li><strong>Make the tree too big when the check can be offline.</strong> Passwords are stored as slow hashes precisely because a stolen database turns guessing into an offline walk. Length beats cleverness: every extra character multiplies the tree by the alphabet size — the output shows 26⁸ in hours and 26¹² in centuries at the same rate. The registration route requires at least 12 characters (<code>src/routes/auth.routes.ts</code>).</li>
</ul>
<p>Lesson 8.3 shows the other side of this coin: when a checker <em>does</em> leak "the first digits are right", pruning becomes possible and 10⁶ collapses to a few dozen tries.</p>
</div>
<div class="ml-vi">
<p>Ở chế độ ngoại tuyến (offline), khi kẻ tấn công có trong tay thứ gì đó để so ngay trên máy mình, cả 10⁶ mã rơi trong chưa tới một giây, và kể cả mật khẩu 8 chữ thường 26⁸ (khoảng 2·10¹¹) cũng rơi trong vài giờ ở tốc độ này — phần cứng chuyên dụng còn nhanh hơn nhiều. Từ đó có hai cách phòng, và trang này dùng cả hai:</p>
<ul>
<li><strong>Đừng bao giờ để phép kiểm vừa ngoại tuyến vừa rẻ.</strong> OTP chỉ nằm trên máy chủ, nên mỗi lần đoán là một request mà máy chủ kiểm soát. <code>src/services/otp.service.ts</code> sinh mã 6 chữ số (<code>OTP_LENGTH = 6</code>) bằng <code>crypto.randomInt</code>, giữ nó 5 phút cho xác thực email (10 phút cho đặt lại mật khẩu), và đếm số lần sai trong Redis: sau <code>MAX_ATTEMPTS = 5</code> lần là từ chối với <code>TOO_MANY_ATTEMPTS</code>. Năm lần thử trên 10⁶ là xác suất 1 phần 200.000 cho mỗi mã. Mã hai lớp (2FA) của admin cùng ý tưởng nhưng theo người dùng: <code>SAI_TOI_DA = 5</code> lần sai mỗi 15 phút trong <code>src/services/mfa/mfa.service.ts</code>, và cả tiền tố <code>/api/v1/auth</code> nằm sau <code>authLimiter</code> trong <code>src/index.ts</code> (10 request mỗi phút mỗi IP ở production). Dòng output cuối cho thấy riêng tốc độ đó đã nghĩa là gì: khoảng 69 ngày để một IP quét hết 10⁶ mã, trong khi mỗi mã hết hạn sau vài phút.</li>
<li><strong>Khi phép kiểm có thể ngoại tuyến, làm cho cây quá lớn.</strong> Mật khẩu được lưu bằng hàm băm chậm chính vì một CSDL bị lộ biến việc đoán thành cuộc đi bộ ngoại tuyến. Độ dài thắng sự "khéo": mỗi ký tự thêm vào nhân cái cây lên bằng cỡ bảng chữ — output cho thấy 26⁸ mất vài giờ còn 26¹² mất hàng thế kỷ ở cùng tốc độ. Route đăng ký đòi tối thiểu 12 ký tự (<code>src/routes/auth.routes.ts</code>).</li>
</ul>
<p>Bài 8.3 cho thấy mặt kia của đồng xu: khi một hàm kiểm <em>có</em> để lộ "mấy chữ số đầu đúng rồi", việc cắt nhánh trở nên khả thi và 10⁶ sụp xuống còn vài chục lần thử.</p>
</div>

<div class="ml-en">
<h3>Two traps that fail real candidates</h3>
<div class="pitfall co-tieu-de"><p><strong>Recording the path itself instead of a copy.</strong></p><p>The code looks right and LeetCode's "Run" shows a list of the right length. Then every answer is empty:</p></div>
</div>
<div class="ml-vi">
<h3>Hai cái bẫy làm trượt ứng viên thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Ghi chính mảng path thay vì một bản sao.</strong></p><p>Code trông đúng và nút "Run" của LeetCode in ra một danh sách đúng độ dài. Rồi mọi đáp án đều rỗng:</p></div>
</div>
${maHai('ch08/bay-tham-chieu.ts', 'ch08/BayThamChieu.java', { vung: 'sai-tham-chieu' })}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Forgetting the unchoose.</strong></p><p>The copy is fixed, but the pop is missing:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Quên bỏ chọn.</strong></p><p>Bản sao đã đúng, nhưng thiếu dòng pop:</p></div>
</div>
${maHai('ch08/bay-tham-chieu.ts', 'ch08/BayThamChieu.java', { vung: 'quen-bo-chon' })}
${ketQua('ch08/bay-tham-chieu.ts')}
${ketQua('ch08/BayThamChieu.java')}
<div class="ml-en">
<p><strong>The reference bug</strong> gives eight copies of <em>one</em> array (<code>same object? true</code>). Each time we recorded, we stored a pointer to <code>path</code>; at the end every pop has run, so the single array is empty and all eight entries show it. The fix is the snapshot: <code>[...path]</code>, <code>path.slice()</code>, <code>new ArrayList&lt;&gt;(path)</code>. In Java, Python and JavaScript alike, "add this list to that list" adds a reference.</p>
<p><strong>The missing pop</strong> is subtler: the answers start right (<code>[], [1], [1,2], [1,2,3]</code>) and then garbage appears (<code>[1,2,3,3]</code>…), because 3 from the deepest branch was never removed and leaked into its siblings. The rule of thumb: <em>if the first few answers are right and then it goes wrong, look for a missing undo</em>. With two pieces of state (<code>path</code> + <code>used[]</code>) it is easy to undo one and forget the other — undo in exact reverse order of the choose lines.</p>
</div>
<div class="ml-vi">
<p><strong>Lỗi tham chiếu</strong> cho ra tám bản của <em>một</em> mảng duy nhất (<code>same object? true</code>). Mỗi lần ghi, ta cất một con trỏ tới <code>path</code>; tới cuối thì mọi lần pop đã chạy, nên cái mảng duy nhất đó rỗng và cả tám phần tử đều hiện nó. Cách sửa là ảnh chụp: <code>[...path]</code>, <code>path.slice()</code>, <code>new ArrayList&lt;&gt;(path)</code>. Trong Java, Python lẫn JavaScript, "thêm danh sách này vào danh sách kia" là thêm một tham chiếu.</p>
<p><strong>Thiếu pop</strong> khó thấy hơn: mấy đáp án đầu đúng (<code>[], [1], [1,2], [1,2,3]</code>) rồi rác xuất hiện (<code>[1,2,3,3]</code>…), vì số 3 của nhánh sâu nhất không bao giờ được gỡ và rò sang các nhánh anh em. Quy tắc kinh nghiệm: <em>nếu vài đáp án đầu đúng rồi bắt đầu sai, hãy tìm chỗ thiếu hoàn tác</em>. Khi trạng thái có hai mảnh (<code>path</code> + <code>used[]</code>) rất dễ hoàn tác một mà quên cái kia — hãy hoàn tác theo đúng thứ tự ngược của các dòng chọn.</p>
</div>
${maHai('ch08/bay-tham-chieu.ts', 'ch08/BayThamChieu.java', { vung: 'dung' })}

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given an array of distinct integers, return all possible subsets.'],
  ['C', 'Can the array be empty, and do you want the empty subset included? Any order of subsets is fine?'],
  ['N', 'Two quick questions that change the output: the empty set is an answer, and "any order" lets you pick either tree.'],
  ['I', 'Yes, include the empty set, any order. n is at most 10.'],
  ['C', 'n ≤ 10 means 2ⁿ is at most 1,024, so generating everything is expected. I will use backtracking: a path of chosen elements, and at each level I may add any element after the last one I chose. Every node of that tree is a subset, so I record a copy at every call. That is O(n·2ⁿ) time because copying is O(n), and O(n) extra space for the recursion. Shall I code it?'],
  ['N', 'Constraint → expected complexity → the four answers (path, choices, record, undo) → complexity. Then ask.'],
  ['I', 'Go ahead.'],
  ['C', '(while coding) I push, recurse with i + 1, then pop — the pop must be right after the call so siblings see the same path… and I push a copy of path, not path itself, otherwise every entry would point to the same array that ends up empty.'],
  ['N', 'Name both classic bugs while writing the lines that prevent them. Interviewers notice.'],
  ['C', 'Testing [1,2]: record [], choose 1, record [1], choose 2, record [1,2], pop, pop, choose 2, record [2]. Four subsets. Empty input gives [[]].'],
  ['I', 'What if the input had duplicates, like [1,2,2]?'],
  ['C', 'Then I would sort and, at each level, skip an element equal to the previous one at that same level, so [1,2] is not produced twice. Same complexity in the worst case.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Cho mảng số nguyên đôi một khác nhau, trả về mọi tập con có thể.'],
  ['C', 'Mảng có thể rỗng không ạ, và có tính cả tập rỗng không? Thứ tự các tập con thế nào cũng được ạ? <em>("Should the empty subset be included? Any order is fine?")</em>'],
  ['N', 'Hai câu hỏi nhanh làm đổi output: tập rỗng là một đáp án, và "thứ tự bất kỳ" cho phép chọn cây nào cũng được.'],
  ['I', 'Có, tính tập rỗng, thứ tự tuỳ. n tối đa 10.'],
  ['C', 'n ≤ 10 nghĩa là 2ⁿ tối đa 1.024, nên sinh hết là điều được mong đợi. Em dùng quay lui: một đường đi gồm các phần tử đã chọn, ở mỗi tầng em được thêm bất kỳ phần tử nào đứng sau phần tử vừa chọn. Mọi nút của cây đó là một tập con, nên em ghi một bản sao ở mỗi lời gọi. Thời gian O(n·2ⁿ) vì chép mất O(n), bộ nhớ phụ O(n) cho đệ quy. Em code nhé? <em>("Every node of this tree is a subset, so I record a copy at every call.")</em>'],
  ['N', 'Ràng buộc → độ phức tạp được mong đợi → bốn câu trả lời (đường đi, lựa chọn, ghi, hoàn tác) → độ phức tạp. Rồi mới hỏi.'],
  ['I', 'Ừ, làm đi.'],
  ['C', '(vừa code vừa nói) Em push, đệ quy với i + 1, rồi pop — pop phải nằm ngay sau lời gọi để các nhánh anh em thấy cùng một đường đi… và em push một bản sao của path chứ không push chính path, không thì mọi phần tử sẽ trỏ về cùng một mảng mà cuối cùng rỗng. <em>("I push a copy, not the path itself.")</em>'],
  ['N', 'Gọi tên cả hai lỗi kinh điển đúng lúc đang viết những dòng ngăn chúng. Người phỏng vấn để ý điều này.'],
  ['C', 'Test [1,2]: ghi [], chọn 1, ghi [1], chọn 2, ghi [1,2], pop, pop, chọn 2, ghi [2]. Bốn tập con. Mảng rỗng cho ra [[]].'],
  ['I', 'Nếu đầu vào có phần tử trùng, như [1,2,2], thì sao?'],
  ['C', 'Khi đó em sắp xếp và, ở mỗi tầng, bỏ qua phần tử bằng phần tử ngay trước nó trong cùng tầng đó, để [1,2] không bị sinh hai lần. Độ phức tạp xấu nhất giữ nguyên. <em>("Sort, then skip a duplicate at the same level.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Recording <code>path</code> instead of a copy ⇒ every answer is the same (usually empty) array.</li>
<li>Pushing without popping, or popping in a different branch than the push ⇒ state leaks into sibling branches.</li>
<li>Recursing with <code>start + 1</code> instead of <code>i + 1</code> ⇒ elements reused, duplicates like <code>[1,3,3]</code>.</li>
<li>Two pieces of state, only one undone (<code>used[i]</code> left true) ⇒ permutations silently missing.</li>
<li>Java: <code>path.remove(x)</code> on a <code>List&lt;Integer&gt;</code> removes by value; use <code>path.remove(path.size() - 1)</code>.</li>
<li>Quoting O(2ⁿ) and forgetting the O(n) copy per answer; or calling the output "extra space" without saying so.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Ghi <code>path</code> thay vì một bản sao ⇒ mọi đáp án là cùng một mảng (thường là rỗng).</li>
<li>Push mà không pop, hoặc pop ở một nhánh khác với nhánh push ⇒ trạng thái rò sang các nhánh anh em.</li>
<li>Đệ quy với <code>start + 1</code> thay vì <code>i + 1</code> ⇒ dùng lại phần tử, sinh thứ lặp như <code>[1,3,3]</code>.</li>
<li>Trạng thái có hai mảnh mà chỉ hoàn tác một (<code>used[i]</code> vẫn là true) ⇒ hoán vị bị thiếu mà không báo lỗi gì.</li>
<li>Java: <code>path.remove(x)</code> trên <code>List&lt;Integer&gt;</code> xoá theo giá trị; hãy dùng <code>path.remove(path.size() - 1)</code>.</li>
<li>Nói O(2ⁿ) mà quên phép chép O(n) cho mỗi đáp án; hoặc tính output vào "bộ nhớ phụ" mà không nói rõ.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Lời giải từng bước của tám đề tổng hợp cả chương nằm ở bài 8.4 (Bộ luyện 8). LC 77 và LC 22 được giải mẫu ở bài 8.2.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write Subsets (for-loop form) in your interview language. Before coding, write the four answers (path, choices, record, undo) as four comments.</li>
<li>Change <code>[...path]</code> to <code>path</code> and run it on <code>[1,2,3]</code>; then put the copy back and delete the pop. Write one sentence for each wrong output explaining it.</li>
<li>Draw by hand the tree of <code>permute([1,2,3])</code> (16 nodes) and check it against the counter in the output.</li>
<li>Submit LC 78, LC 46 and LC 797. For each, one notebook line: <em>choices at a level → when to record → complexity</em>.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, two bug outputs explained in one sentence each, and you can say why permutations have about e·n! nodes.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">backtracking</span><span class="v">Depth-first search over a tree of choices, undoing each choice when returning.</span></div>
  <div class="kv"><span class="k">state-space tree</span><span class="v">Root = nothing chosen, edge = one choice, node = partial solution; never stored, only walked.</span></div>
  <div class="kv"><span class="k">partial solution / path</span><span class="v">What has been chosen so far; shared and mutated by every call.</span></div>
  <div class="kv"><span class="k">choose / explore / unchoose</span><span class="v">Modify the state, recurse, restore the state exactly.</span></div>
  <div class="kv"><span class="k">snapshot (copy)</span><span class="v">A new list with the path's current contents, stored as an answer.</span></div>
  <div class="kv"><span class="k">power set</span><span class="v">The set of all subsets: 2ⁿ of them.</span></div>
  <div class="kv"><span class="k">brute force (exhaustive search)</span><span class="v">Trying every leaf of the tree with no pruning.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>"Return all…" + tiny n ⇒ backtracking; the output is exponential, so nothing smarter exists.</li>
<li>Four questions: path, choices at a level, when to record, what to undo — then choose / explore / unchoose.</li>
<li>Subsets: choices from <code>start</code>, record everywhere, O(n·2ⁿ). Permutations: any unused element, record at leaves, O(n·n!).</li>
<li>Measured limits: 2ⁿ·n up to n ≈ 20, n!·n up to n ≈ 10–11; the language moves the constant, not the limit.</li>
<li>Record a copy; every push has one pop; undo every piece of state.</li>
<li>Brute force is backtracking without pruning: defend by keeping checks online and limited, and by making the tree huge.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Backtracking', 'The standard order of backtracking problems, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📘', 'Backtracking — Wikipedia', 'Definition, the general pseudocode (reject / accept / first / next) and classic examples', 'https://en.wikipedia.org/wiki/Backtracking')}
${nguon('🔐', 'OWASP Authentication Cheat Sheet', 'Account lockout, rate limiting and password length: the defences against brute force', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết Subsets (dạng vòng for) bằng ngôn ngữ bạn sẽ dùng khi phỏng vấn. Trước khi code, viết bốn câu trả lời (đường đi, lựa chọn, ghi, hoàn tác) thành bốn dòng chú thích.</li>
<li>Đổi <code>[...path]</code> thành <code>path</code> rồi chạy với <code>[1,2,3]</code>; sau đó trả bản sao về và xoá dòng pop. Với mỗi output sai, viết một câu giải thích.</li>
<li>Vẽ tay cây của <code>permute([1,2,3])</code> (16 nút) rồi so với bộ đếm trong output.</li>
<li>Nộp LC 78, LC 46 và LC 797. Mỗi đề một dòng vào sổ: <em>lựa chọn ở một tầng → khi nào ghi → độ phức tạp</em>.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, hai output lỗi được giải thích mỗi cái một câu, và bạn nói được vì sao hoán vị có khoảng e·n! nút.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">backtracking (quay lui)</span><span class="v">Tìm kiếm theo chiều sâu trên một cây lựa chọn, hoàn tác mỗi lựa chọn khi quay về.</span></div>
  <div class="kv"><span class="k">state-space tree (cây trạng thái)</span><span class="v">Gốc = chưa chọn gì, cạnh = một lựa chọn, nút = lời giải bộ phận; không lưu, chỉ đi qua.</span></div>
  <div class="kv"><span class="k">partial solution / path (lời giải bộ phận / đường đi)</span><span class="v">Những gì đã chọn tới giờ; dùng chung và bị mọi lời gọi sửa.</span></div>
  <div class="kv"><span class="k">choose / explore / unchoose (chọn / đi tiếp / bỏ chọn)</span><span class="v">Sửa trạng thái, đệ quy, trả trạng thái về y như cũ.</span></div>
  <div class="kv"><span class="k">snapshot (ảnh chụp, bản sao)</span><span class="v">Một danh sách mới chứa nội dung hiện tại của path, được cất làm đáp án.</span></div>
  <div class="kv"><span class="k">power set (tập luỹ thừa)</span><span class="v">Tập của mọi tập con: có 2ⁿ cái.</span></div>
  <div class="kv"><span class="k">brute force (vét cạn)</span><span class="v">Thử mọi lá của cây mà không cắt nhánh nào.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>"Trả về mọi…" + n bé xíu ⇒ quay lui; output đã là hàm mũ nên không có gì khôn hơn.</li>
<li>Bốn câu hỏi: đường đi, lựa chọn ở một tầng, khi nào ghi, hoàn tác gì — rồi chọn / đi tiếp / bỏ chọn.</li>
<li>Subsets: lựa chọn từ <code>start</code>, ghi ở mọi nút, O(n·2ⁿ). Permutations: mọi phần tử chưa dùng, ghi ở lá, O(n·n!).</li>
<li>Giới hạn đo thật: 2ⁿ·n tới n ≈ 20, n!·n tới n ≈ 10–11; ngôn ngữ đổi hằng số, không đổi giới hạn.</li>
<li>Ghi bản sao; mỗi push có đúng một pop; hoàn tác mọi mảnh trạng thái.</li>
<li>Vét cạn mật khẩu là quay lui không cắt nhánh: phòng bằng cách giữ phép kiểm ở máy chủ, giới hạn số lần thử, và làm cây thật lớn.</li>
</ul>
${lienKet({ bai: 'dsa-8-2-to-hop', title: '8.2 — Tổ hợp, combination sum và khử trùng', sub: 'Khi đầu vào có phần tử trùng: sort + bỏ qua cùng tầng, bảng vết cho thấy nhánh nào bị bỏ', cta: 'Học tiếp' })}
${nguon('📗', 'NeetCode roadmap — Backtracking', 'Thứ tự chuẩn của các đề quay lui, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📘', 'Backtracking — Wikipedia', 'Định nghĩa, mã giả tổng quát (reject / accept / first / next) và các ví dụ kinh điển', 'https://en.wikipedia.org/wiki/Backtracking')}
${nguon('🔐', 'OWASP Authentication Cheat Sheet', 'Khoá tài khoản, giới hạn tốc độ và độ dài mật khẩu: các lớp phòng chống vét cạn', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html')}
<p>Câu hỏi ôn: <a href="${baiNay('dsa-8-5-quiz')}">bài 8.5 — Quiz Chương 8</a>.</p>
</div>
`,
};
