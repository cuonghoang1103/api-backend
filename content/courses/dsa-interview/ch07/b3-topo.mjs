/** 7.3 — Sắp xếp tô-pô và phát hiện chu trình. Mọi mã/output đọc từ ../ma/ch07 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay } from '../_chung.mjs';
import { oDay } from './_rieng.mjs';
import { vetKahn, vetDfs3 } from '../ma/ch07/topo.vet.mjs';

/* Bảng vết 1: Kahn trên 6 môn, prerequisites [a, b] = "b trước a". */
const PRE = [[1, 0], [2, 0], [3, 1], [3, 2], [5, 4]];
const vk = vetKahn(6, PRE);
const BANG_KAHN = bangVet(['take', 'in-degree after (course 0..5)', 'unlocked now', 'queue (front = left)', 'order so far'],
  vk.map((h) => [
    h.u === null ? '— (start)' : `<strong>${h.u}</strong>`,
    oMang(h.indeg, { to: Object.fromEntries(h.giam.map((v) => [v, h.mo.includes(v) ? 'ok' : 'r'])), chiSo: true }),
    h.mo.length ? `<code>${h.mo.join(', ')}</code>` : '—',
    oDay(h.cho),
    oDay(h.order),
  ]));

/* Bảng vết 2: DFS ba màu trên hình thoi 0→1, 0→2, 1→3, 2→3. */
const MAU = ['W', 'G', 'B'];
const NEN_MAU = [null, 'r', 'mo'];
const vd = vetDfs3(4, [[0, 1], [0, 2], [1, 3], [2, 3]]);
const BANG_DFS3 = bangVet(['event', 'colour of 0..3 (W white · G gray · B black)', 'GRAY path (call stack)', 'finished order'],
  vd.hang.map((h) => [
    h.viec,
    oMang(h.color.map((c) => MAU[c]), { to: Object.fromEntries(h.color.map((c, i) => [i, NEN_MAU[c]]).filter((p) => p[1])), chiSo: true }),
    oDay(h.path),
    oDay(h.finished),
  ]));
const THU_TU = vd.order.join(', ');

const DE = [
  [lc(207, 'course-schedule', 'Course Schedule', 'Medium'), 'Only "is there a cycle?" — Kahn: did every course get taken?', 'Chỉ hỏi "có chu trình không?" — Kahn: mọi môn có được lấy ra hết không?'],
  [lc(210, 'course-schedule-ii', 'Course Schedule II', 'Medium'), 'Return the order itself; [a, b] means b → a.', 'Trả về chính thứ tự; [a, b] nghĩa là b → a.'],
  [lc(2115, 'find-all-possible-recipes-from-given-supplies', 'Find All Possible Recipes from Given Supplies', 'Medium'), 'Kahn whose starting queue is the supplies; a finished recipe becomes a supply.', 'Kahn có hàng đợi ban đầu là nguyên liệu sẵn có; món làm xong trở thành nguyên liệu.'],
  [lc(1462, 'course-schedule-iv', 'Course Schedule IV', 'Medium'), 'Many "is u a prerequisite of v?" queries ⇒ propagate reachability sets in topological order.', 'Nhiều câu hỏi "u có là tiên quyết của v?" ⇒ lan tập tới-được theo thứ tự tô-pô.'],
  [lc(310, 'minimum-height-trees', 'Minimum Height Trees', 'Medium'), 'Kahn on an undirected tree: peel leaves (degree 1) layer by layer; the last 1–2 nodes are the centres.', 'Kahn trên cây vô hướng: bóc lá (bậc 1) từng lớp; 1–2 đỉnh cuối cùng là tâm.'],
  [lc(269, 'alien-dictionary', 'Alien Dictionary', 'Hard', { premium: true }), 'Premium. Free equivalent: LintCode 892 — edges from the first differing letter of neighbouring words.', 'Premium. Bản miễn phí tương đương: LintCode 892 — cạnh lấy từ chữ khác nhau đầu tiên của hai từ liền kề.'],
  [lc(2050, 'parallel-courses-iii', 'Parallel Courses III', 'Hard'), 'Earliest finish = longest path in a DAG: relax in topological order (the critical path of a project).', 'Thời điểm xong sớm nhất = đường dài nhất trong DAG: cập nhật theo thứ tự tô-pô (đường găng của dự án).'],
  [lc(329, 'longest-increasing-path-in-a-matrix', 'Longest Increasing Path in a Matrix', 'Hard'), '"Strictly increasing" edges can never form a cycle ⇒ a DAG for free; DFS + memo or Kahn by layers.', 'Cạnh "tăng hẳn" không bao giờ tạo chu trình ⇒ có sẵn một DAG; DFS + nhớ hoặc Kahn theo lớp.'],
];

export default {
  title: '7.3 — Topological sort and cycle detection: Kahn and three-colour DFS|||7.3 — Sắp xếp tô-pô và phát hiện chu trình: Kahn và DFS ba màu',
  slug: 'dsa-7-3-topo',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Xếp việc theo phụ thuộc và phát hiện vòng lặp: Course Schedule bằng Kahn, DFS ba màu, môn tiên quyết THẬT của ngành SE FPTU, chu trình THẬT trong package-lock.json của repo, thứ tự tạo bảng khi khoá ngoại vòng — và bẫy dùng visited hai màu cho đồ thị có hướng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Topological sort and cycle detection: Kahn and three-colour DFS</h2>
<p class="lead">"Some tasks must happen before others — find an order, or say it is impossible." That one sentence covers course prerequisites, build systems, package installs, database migrations, spreadsheet recalculation and project schedules, and it is one of the most reliable medium problems in interviews (Course Schedule I and II). The order is called a <strong>topological order</strong>; it exists exactly when the dependency graph has <strong>no cycle</strong>. This lesson gives you two algorithms that find the order and detect the cycle — Kahn's (with a queue) and DFS with three colours — runs both on the real prerequisite chart of FPTU's Software Engineering programme, and finds a real cycle in this repository's own <code>package-lock.json</code>.</p>

<h3>The everyday picture</h3>
<p>Getting dressed: socks before shoes, shirt before jacket, trousers before belt and before shoes. Any order that respects every "before" arrow works — you can put the shirt on before or after the socks. Now imagine a rule book that says "jacket before shirt" and "shirt before jacket": nobody can ever get dressed. That is a cycle, and no ordering algorithm can fix it — it can only report it.</p>
<p>Definitions. A <strong>DAG</strong> (directed acyclic graph) is a directed graph with no cycle. A <strong>topological order</strong> of a DAG lists every node so that for every edge u → v, u comes before v. It is usually <em>not</em> unique. A node with <strong>in-degree 0</strong> (no arrow coming in) has no unmet requirement and can go first; in a DAG at least one always exists (follow arrows backwards from any node: without a cycle you must stop somewhere). A <strong>back edge</strong> is an edge from a node to one of its ancestors on the current DFS path — the signature of a cycle.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Sắp xếp tô-pô và phát hiện chu trình: Kahn và DFS ba màu</h2>
<p class="lead">"Có những việc phải xảy ra trước việc khác — hãy tìm một thứ tự, hoặc nói là không thể." Một câu đó bao trùm môn tiên quyết, hệ thống build, cài gói npm, migration CSDL, tính lại bảng tính và lịch dự án, và nó là một trong những dạng đề medium xuất hiện đều đặn nhất khi phỏng vấn (Course Schedule I và II). Thứ tự đó gọi là <strong>thứ tự tô-pô</strong> (topological order); nó tồn tại đúng khi đồ thị phụ thuộc <strong>không có chu trình</strong>. Bài này cho bạn hai thuật toán vừa tìm thứ tự vừa phát hiện chu trình — thuật toán Kahn (dùng hàng đợi) và DFS ba màu — chạy cả hai trên sơ đồ môn tiên quyết THẬT của ngành Kỹ thuật phần mềm FPTU, và tìm ra một chu trình THẬT trong chính <code>package-lock.json</code> của repo này.</p>

<h3>Hình dung đời thường</h3>
<p>Mặc đồ đi học: tất trước giày, áo sơ mi trước áo khoác, quần trước thắt lưng và trước giày. Thứ tự nào tôn trọng mọi mũi tên "trước" đều được — bạn có thể mặc áo trước hay sau khi đi tất. Giờ hình dung một cuốn nội quy ghi "áo khoác trước sơ mi" và "sơ mi trước áo khoác": không ai mặc đồ xong được. Đó là một chu trình, và không thuật toán sắp xếp nào sửa được nó — nó chỉ có thể báo ra.</p>
<p>Định nghĩa. <strong>DAG</strong> (directed acyclic graph — đồ thị có hướng không chu trình) là đồ thị có hướng không có chu trình nào. <strong>Thứ tự tô-pô</strong> của một DAG liệt kê mọi đỉnh sao cho với mọi cạnh u → v, u đứng trước v. Nó thường <em>không</em> duy nhất. Một đỉnh có <strong>bậc vào 0</strong> (không mũi tên nào đi vào) không còn yêu cầu nào chưa đạt và có thể đi đầu; trong một DAG luôn có ít nhất một đỉnh như vậy (từ một đỉnh bất kỳ lần ngược theo mũi tên: không có chu trình thì phải dừng ở đâu đó). <strong>Cạnh ngược</strong> (back edge) là cạnh đi từ một đỉnh tới một tổ tiên của nó trên đường DFS hiện tại — dấu vân tay của một chu trình.</p>
${csd('csd201-dfs', 'vi', '5.3 DFS: chu trình, thành phần liên thông, sắp xếp tô-pô', '<p>CSD201 đã dạy sắp xếp tô-pô bằng DFS (thứ tự kết thúc đảo ngược) và phát hiện chu trình. <strong>Ở đây đi sâu thêm:</strong> thuật toán Kahn — cách phỏng vấn ưa chuộng vì không đệ quy và cho luôn "học kỳ sớm nhất", ba màu và vì sao hai màu SAI với đồ thị có hướng (demo chạy thật), và chu trình trong dữ liệu thật.</p>')}
${csd('csd201-slide-cs8-1', 'vi', 'CS.8 Đồ thị nâng cao: tô-pô, Bellman-Ford, 0-1 BFS', '<p>Phần chuyên sâu CS.8 của CSD201 có tô-pô theo nhiều biến thể. Nếu bạn đã học, bài này là phần "đem vào phòng phỏng vấn": nói lời giải thế nào, test ca biên nào, câu hỏi nối tiếp nào hay tới.</p>')}
</div>

<div class="ml-en">
<h3>Signals: "this is a topological sort"</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"prerequisite", "depends on", "must be done before", "requires"</span><span class="v">Directed edges between tasks. Ask the direction out loud before coding.</span></div>
  <div class="kv"><span class="k">"is it possible to finish all…?"</span><span class="v">Cycle detection: possible ⇔ the graph is a DAG.</span></div>
  <div class="kv"><span class="k">"return any valid order"</span><span class="v">Kahn's order or reversed DFS finishing order.</span></div>
  <div class="kv"><span class="k">"minimum number of semesters / rounds", "earliest time"</span><span class="v">Kahn by levels (each level = one round), or longest path in the DAG when tasks have durations.</span></div>
  <div class="kv"><span class="k">"the lexicographically smallest valid order"</span><span class="v">Kahn with a min-priority queue instead of a FIFO queue.</span></div>
  <div class="kv"><span class="k">a sorted list in an unknown alphabet</span><span class="v">Each neighbouring pair of words gives one edge — build the graph, then sort (Alien Dictionary).</span></div>
</div>
<h3>Kahn's algorithm in five moves</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Build out-lists + in-degrees</span><span class="lz-d">edge u → v: out[u].push(v), indeg[v]++</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Queue every in-degree 0</span><span class="lz-d">no requirement left</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Take u, append to order</span><span class="lz-d">u is "done"</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">indeg[v]-- for each v</span><span class="lz-d">reaches 0 ⇒ enqueue v</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">order.length &lt; n?</span><span class="lz-d">the leftovers sit on or behind a cycle</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: "đây là sắp xếp tô-pô"</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"tiên quyết", "phụ thuộc vào", "phải làm trước", "yêu cầu"</span><span class="v">Cạnh có hướng giữa các việc. Nói to chiều mũi tên trước khi code.</span></div>
  <div class="kv"><span class="k">"có hoàn thành được tất cả… không?"</span><span class="v">Phát hiện chu trình: được ⇔ đồ thị là DAG.</span></div>
  <div class="kv"><span class="k">"trả về một thứ tự hợp lệ bất kỳ"</span><span class="v">Thứ tự của Kahn, hoặc thứ tự kết thúc DFS đảo ngược.</span></div>
  <div class="kv"><span class="k">"số học kỳ / số vòng ít nhất", "thời điểm sớm nhất"</span><span class="v">Kahn theo tầng (mỗi tầng = một vòng), hoặc đường dài nhất trong DAG khi việc có thời lượng.</span></div>
  <div class="kv"><span class="k">"thứ tự hợp lệ nhỏ nhất theo từ điển"</span><span class="v">Kahn với hàng đợi ưu tiên nhỏ nhất thay cho hàng đợi FIFO.</span></div>
  <div class="kv"><span class="k">một danh sách đã sắp theo bảng chữ cái lạ</span><span class="v">Mỗi cặp từ liền kề cho một cạnh — dựng đồ thị rồi sắp (Alien Dictionary).</span></div>
</div>
<h3>Thuật toán Kahn trong năm nước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dựng danh sách ra + bậc vào</span><span class="lz-d">cạnh u → v: out[u].push(v), indeg[v]++</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đưa mọi đỉnh bậc vào 0 vào hàng</span><span class="lz-d">không còn yêu cầu nào</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lấy u, nối vào thứ tự</span><span class="lz-d">u đã "xong"</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">indeg[v]-- với mỗi v</span><span class="lz-d">chạm 0 ⇒ đưa v vào hàng</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">order.length &lt; n?</span><span class="lz-d">phần còn lại nằm trên hoặc sau một chu trình</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Course Schedule II (LC 210)</h3>
<p><strong>Problem (in our words).</strong> There are n courses 0..n−1. Each pair <code>[a, b]</code> in <code>prerequisites</code> means "you must take b before a". Return an order in which you can take all of them, or an empty array if it is impossible. Course Schedule I (LC 207) asks only "possible or not?".</p>
<p><strong>Step 0 — the direction.</strong> <code>[a, b]</code> = "b before a" = arrow <strong>b → a</strong>. Say it out loud and write it as a comment: reversing it gives you a perfectly valid-looking order of the <em>reversed</em> graph, and the tests that catch it are not always the first ones.</p>
<p><strong>Brute force, said out loud.</strong> "Repeat: scan all courses, find one whose prerequisites are all taken, take it." Each round scans everything: O(n·(n + E)). The waste: after taking course u, only the courses that <em>depend on u</em> can change status — so keep a counter of missing prerequisites per course (its in-degree) and a queue of courses whose counter is 0. That is Kahn's algorithm, O(V + E).</p>
<p><strong>Why the leftovers prove a cycle.</strong> If some courses are never taken, each of them still has a missing prerequisite that was also never taken. Follow those missing prerequisites backwards: among finitely many leftover courses you must revisit one — a cycle. So "<code>order.length === n</code>" is both the success test and the cycle test.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Course Schedule II (LC 210 — lịch học môn, phần II)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Có n môn 0..n−1. Mỗi cặp <code>[a, b]</code> trong <code>prerequisites</code> nghĩa là "phải học b trước a". Trả về một thứ tự học hết các môn, hoặc mảng rỗng nếu không thể. Course Schedule I (LC 207) chỉ hỏi "được hay không?".</p>
<p><strong>Bước 0 — chiều mũi tên.</strong> <code>[a, b]</code> = "b trước a" = mũi tên <strong>b → a</strong>. Nói to và ghi thành chú thích: lật ngược nó sẽ cho bạn một thứ tự trông rất hợp lệ của đồ thị <em>bị lật</em>, và test bắt được lỗi này không phải lúc nào cũng là test đầu tiên.</p>
<p><strong>Vét cạn, nói thành lời.</strong> "Lặp lại: quét mọi môn, tìm một môn mà các môn tiên quyết đã học hết, học nó." Mỗi vòng quét lại tất cả: O(n·(n + E)). Chỗ phí: sau khi học môn u, chỉ những môn <em>phụ thuộc vào u</em> mới có thể đổi trạng thái — nên giữ cho mỗi môn một biến đếm số tiên quyết còn thiếu (chính là bậc vào) và một hàng đợi các môn có biến đếm bằng 0. Đó là thuật toán Kahn, O(V + E).</p>
<p><strong>Vì sao phần còn lại chứng minh có chu trình.</strong> Nếu có môn không bao giờ được học, mỗi môn đó vẫn còn một tiên quyết thiếu mà cũng không bao giờ được học. Lần ngược theo các tiên quyết thiếu đó: trong hữu hạn môn còn lại, bạn buộc phải quay lại một môn đã đi qua — một chu trình. Nên "<code>order.length === n</code>" vừa là phép kiểm thành công vừa là phép kiểm chu trình.</p>
</div>
${maHai('ch07/course-schedule.ts', 'ch07/CourseSchedule.java', { vung: 'kahn' })}
${ketQua('ch07/course-schedule.ts')}
${ketQua('ch07/CourseSchedule.java')}
<div class="ml-en">
<p>Five tests: a single dependency; a 2-cycle (impossible, empty array); the diamond 0 → 1, 0 → 2, 1 → 3, 2 → 3; a graph with two independent chains; and a 3-cycle. Here is the fourth test step by step. Prerequisites <code>[[1,0],[2,0],[3,1],[3,2],[5,4]]</code> are the arrows 0 → 1, 0 → 2, 1 → 3, 2 → 3, 4 → 5. In the in-degree column, orange = decreased in this step but not yet 0, green = just reached 0 and was enqueued.</p>
</div>
<div class="ml-vi">
<p>Năm test: một phụ thuộc đơn; chu trình 2 môn (không thể, mảng rỗng); hình thoi 0 → 1, 0 → 2, 1 → 3, 2 → 3; một đồ thị có hai chuỗi độc lập; và chu trình 3 môn. Dưới đây là test thứ tư từng bước. Các cặp <code>[[1,0],[2,0],[3,1],[3,2],[5,4]]</code> là các mũi tên 0 → 1, 0 → 2, 1 → 3, 2 → 3, 4 → 5. Ở cột bậc vào, ô cam = vừa giảm ở bước này nhưng chưa về 0, ô xanh lá = vừa chạm 0 và được đưa vào hàng.</p>
</div>
${BANG_KAHN}
<div class="ml-en">
<p>Course 3 needs two decrements: taking 1 drops it to 1 (orange — still waiting for course 2), taking 2 drops it to 0 (green). That is the in-degree acting as a "how many prerequisites are still missing" counter. The queue starts with <em>two</em> sources, 0 and 4, because the graph has two independent chains — Kahn handles disconnected graphs with no extra code, which is a common follow-up question. Output <code>[0, 4, 1, 2, 5, 3]</code>; another valid answer would be <code>[4, 5, 0, 2, 1, 3]</code>, and LeetCode accepts any valid one.</p>
</div>
<div class="ml-vi">
<p>Môn 3 cần hai lần giảm: học 1 làm nó còn 1 (ô cam — vẫn chờ môn 2), học 2 làm nó về 0 (ô xanh). Đó là bậc vào đóng vai biến đếm "còn thiếu bao nhiêu tiên quyết". Hàng đợi bắt đầu với <em>hai</em> nguồn, 0 và 4, vì đồ thị có hai chuỗi độc lập — Kahn xử lý đồ thị không liên thông mà không cần thêm dòng code nào, một câu hỏi nối tiếp hay gặp. Output <code>[0, 4, 1, 2, 5, 3]</code>; một đáp án hợp lệ khác là <code>[4, 5, 0, 2, 1, 3]</code>, và LeetCode chấp nhận mọi đáp án hợp lệ.</p>
</div>

<div class="ml-en">
<h3>Real data: the FPTU Software Engineering prerequisite chart</h3>
<p>The prerequisites below are not invented: they are the "Pre-Requisite" field of each subject's official syllabus, stored in this repository under <code>content/academy/_syllabus-flm/</code> (for example <code>CSD201.json</code> says <code>PRO192</code>, <code>PRJ301.json</code> says <code>DBI202, PRO192</code>, <code>SWP391.json</code> says <code>PRJ301, SWE201c or SWE202c, pass LAB211</code>). "X or Y" rules are simplified to the SE route. Kahn is run <strong>level by level</strong>: level k contains the subjects whose prerequisites all lie in earlier levels — the earliest term in which you could take them if there were no other limits.</p>
</div>
<div class="ml-vi">
<h3>Dữ liệu thật: sơ đồ môn tiên quyết ngành Kỹ thuật phần mềm FPTU</h3>
<p>Các quan hệ tiên quyết dưới đây không bịa: chúng là trường "Pre-Requisite" trong đề cương chính thức của từng môn, lưu trong repo này ở <code>content/academy/_syllabus-flm/</code> (ví dụ <code>CSD201.json</code> ghi <code>PRO192</code>, <code>PRJ301.json</code> ghi <code>DBI202, PRO192</code>, <code>SWP391.json</code> ghi <code>PRJ301, SWE201c or SWE202c, pass LAB211</code>). Luật "X hoặc Y" được rút gọn theo lộ trình SE. Kahn chạy <strong>theo từng tầng</strong>: tầng k gồm các môn có mọi tiên quyết nằm ở các tầng trước — tức học kỳ sớm nhất bạn có thể học chúng nếu không có giới hạn nào khác.</p>
</div>
${maHai('ch07/mon-fpt.ts', 'ch07/MonFpt.java', { vung: 'tang' })}
${ketQua('ch07/mon-fpt.ts')}
<div class="ml-en">
<p>Four levels: the longest prerequisite chain, PRF192 → PRO192 → PRJ301 → SWP391, has four subjects, so SWP391 cannot come earlier than your fourth term counted from PRF192 — the real curriculum places it later because of credit limits and the other subjects of each term, which a plain topological sort does not know about. The last line is the instructive one: a single wrong edge "SWP391 before PRO192" (the kind of typo that happens when someone edits a curriculum file) creates the loop PRO192 → PRJ301 → SWP391 → PRO192, and Kahn can place only 8 subjects. <strong>Nine</strong> are stuck — not only the three on the loop, but everything downstream of PRO192 (CSD201, LAB211, PRN212, SWE201c and its dependants). A cycle blocks its whole "shadow". Open the simulation to watch the terms fill up on the real chart.</p>
${moPhong('ch07/kahn-fpt.sim.js', 'en', 'Kahn on the real FPTU SE prerequisite chart', 'Each node shows how many prerequisites are still missing; every term, the subjects at 0 light up and their arrows decrement the next ones.')}
</div>
<div class="ml-vi">
<p>Bốn tầng: chuỗi tiên quyết dài nhất, PRF192 → PRO192 → PRJ301 → SWP391, có bốn môn, nên SWP391 không thể sớm hơn học kỳ thứ tư tính từ PRF192 — chương trình thật xếp nó muộn hơn vì giới hạn tín chỉ và các môn khác trong từng kỳ, những thứ mà một phép sắp xếp tô-pô thuần không biết tới. Dòng cuối mới là dòng đáng học: chỉ một cạnh sai "SWP391 trước PRO192" (kiểu lỗi gõ nhầm xảy ra khi ai đó sửa tệp chương trình học) tạo ra vòng PRO192 → PRJ301 → SWP391 → PRO192, và Kahn chỉ xếp được 8 môn. <strong>Chín</strong> môn bị kẹt — không chỉ ba môn trên vòng, mà mọi môn nằm phía sau PRO192 (CSD201, LAB211, PRN212, SWE201c và các môn phụ thuộc nó). Một chu trình chặn cả "cái bóng" của nó. Mở mô phỏng để xem các học kỳ lấp đầy trên sơ đồ thật.</p>
${moPhong('ch07/kahn-fpt.sim.js', 'vi', 'Kahn trên sơ đồ môn tiên quyết thật của ngành SE FPTU', 'Mỗi đỉnh hiện số tiên quyết còn thiếu; mỗi học kỳ, các môn về 0 sáng lên và mũi tên của chúng trừ dần các môn sau.')}
</div>

<div class="ml-en">
<h3>The second algorithm: DFS with three colours</h3>
<p>DFS gives a topological order for free: when DFS <strong>finishes</strong> a node (all its outgoing edges explored), everything that must come after it has already finished. So the finishing order, reversed, is a topological order. To detect cycles, each node has one of three colours: <strong>WHITE</strong> (not visited), <strong>GRAY</strong> (entered, still on the current recursion path), <strong>BLACK</strong> (finished). An edge into a GRAY node points back to an ancestor on the current path: a cycle. An edge into a BLACK node is harmless — that node and everything below it is already done.</p>
</div>
<div class="ml-vi">
<h3>Thuật toán thứ hai: DFS ba màu</h3>
<p>DFS cho thứ tự tô-pô gần như miễn phí: khi DFS <strong>kết thúc</strong> một đỉnh (đã đi hết các cạnh ra của nó), mọi thứ phải đứng sau nó đều đã kết thúc trước. Nên thứ tự kết thúc, đảo ngược lại, là một thứ tự tô-pô. Để phát hiện chu trình, mỗi đỉnh mang một trong ba màu: <strong>TRẮNG</strong> (WHITE — chưa thăm), <strong>XÁM</strong> (GRAY — đã vào, còn nằm trên đường đệ quy hiện tại), <strong>ĐEN</strong> (BLACK — đã xong). Một cạnh đi vào đỉnh XÁM là trỏ ngược về một tổ tiên trên đường hiện tại: chu trình. Một cạnh đi vào đỉnh ĐEN thì vô hại — đỉnh đó và mọi thứ bên dưới nó đã xong.</p>
</div>
${maHai('ch07/dfs-3-mau.ts', 'ch07/Dfs3Mau.java', { vung: 'dfs3' })}
${ketQua('ch07/dfs-3-mau.ts')}
<div class="ml-en">
<p>The trace on the diamond 0 → 1, 0 → 2, 1 → 3, 2 → 3. Orange = GRAY, grey background = BLACK. Watch the row "edge 2→3: 3 is BLACK ⇒ skip": node 3 is reached a second time, and that is <em>not</em> a cycle.</p>
</div>
<div class="ml-vi">
<p>Bảng vết trên hình thoi 0 → 1, 0 → 2, 1 → 3, 2 → 3. Ô cam = XÁM, nền xám nhạt = ĐEN. Để ý hàng "edge 2→3: 3 is BLACK ⇒ skip": đỉnh 3 bị chạm tới lần thứ hai, và đó <em>không</em> phải chu trình.</p>
</div>
${BANG_DFS3}
<div class="ml-en">
<p>Finishing order 3, 1, 2, 0; reversed: <strong>${THU_TU}</strong> — the first output line. The GRAY path column is exactly the recursion call stack. In the second test (0 → 1 → 2 → 3 → 1) the walk enters 0, 1, 2, 3, then sees the edge 3 → 1 while 1 is still GRAY and returns the cycle <code>[1, 2, 3, 1]</code> read straight off the path — Kahn could only tell you which nodes were left over. The simulation shows the same moment.</p>
${moPhong('ch07/dfs3.sim.js', 'en', 'Three-colour DFS catches the cycle 1 → 2 → 3 → 1', 'Highlighted nodes are GRAY (on the path); the edge 3 → 1 into a GRAY node lights up as the cycle is reported.')}
</div>
<div class="ml-vi">
<p>Thứ tự kết thúc 3, 1, 2, 0; đảo ngược: <strong>${THU_TU}</strong> — đúng dòng output đầu tiên. Cột đường XÁM chính là call stack của đệ quy. Ở test thứ hai (0 → 1 → 2 → 3 → 1), lượt đi vào 0, 1, 2, 3, rồi thấy cạnh 3 → 1 trong khi 1 vẫn XÁM và trả về chu trình <code>[1, 2, 3, 1]</code> đọc thẳng từ đường đi — Kahn chỉ cho bạn biết đỉnh nào bị bỏ lại. Mô phỏng cho thấy đúng khoảnh khắc đó.</p>
${moPhong('ch07/dfs3.sim.js', 'vi', 'DFS ba màu bắt được chu trình 1 → 2 → 3 → 1', 'Đỉnh được tô sáng là XÁM (trên đường đi); cạnh 3 → 1 đi vào đỉnh XÁM sáng lên lúc chu trình được báo.')}
</div>

<div class="ml-en">
<h3>Kahn or DFS? The comparison interviewers ask for</h3>
<table>
<thead><tr><th></th><th>Kahn (in-degree + queue)</th><th>DFS three colours</th></tr></thead>
<tbody>
<tr><td>Recursion</td><td>none — safe for 10⁵ nodes</td><td>depth up to V (iterative version is longer)</td></tr>
<tr><td>On a cycle it tells you</td><td>which nodes are stuck (cycle + its shadow)</td><td>the exact cycle path</td></tr>
<tr><td>Levels / earliest round</td><td>natural (process level by level)</td><td>needs a second pass</td></tr>
<tr><td>Smallest order by name</td><td>swap the queue for a min-heap</td><td>awkward</td></tr>
<tr><td>Code size in an interview</td><td>~15 lines</td><td>~15 lines</td></tr>
</tbody></table>
<p>Default to Kahn for "order / possible?" questions; reach for DFS when you need the cycle itself, or when the problem is already a DFS (e.g. memoised longest path, LC 329).</p>
</div>
<div class="ml-vi">
<h3>Kahn hay DFS? Bảng so sánh người phỏng vấn hay hỏi</h3>
<table>
<thead><tr><th></th><th>Kahn (bậc vào + hàng đợi)</th><th>DFS ba màu</th></tr></thead>
<tbody>
<tr><td>Đệ quy</td><td>không — an toàn với 10⁵ đỉnh</td><td>sâu tới V (bản lặp dài hơn)</td></tr>
<tr><td>Khi có chu trình, nó cho biết</td><td>những đỉnh bị kẹt (chu trình + cái bóng của nó)</td><td>chính xác đường đi của chu trình</td></tr>
<tr><td>Tầng / vòng sớm nhất</td><td>tự nhiên (xử lý theo tầng)</td><td>cần thêm một lượt</td></tr>
<tr><td>Thứ tự nhỏ nhất theo tên</td><td>đổi hàng đợi thành min-heap</td><td>khó</td></tr>
<tr><td>Độ dài code khi phỏng vấn</td><td>~15 dòng</td><td>~15 dòng</td></tr>
</tbody></table>
<p>Mặc định dùng Kahn cho câu hỏi "thứ tự / có được không?"; chọn DFS khi cần chính chu trình, hoặc khi bài vốn đã là DFS (ví dụ đường dài nhất có nhớ, LC 329).</p>
</div>

<div class="ml-en">
<h3>Two variants</h3>
<p><strong>Alien Dictionary (LC 269, Premium — free twin LintCode 892).</strong> You get words sorted in an unknown alphabet; recover the alphabet. Each pair of <em>neighbouring</em> words gives at most one edge: at the first position where they differ, the letter of the first word comes before the letter of the second (everything after that position says nothing). Two edge cases make or break the solution: a word followed by its own prefix (<code>"abc"</code> then <code>"ab"</code>) is impossible in any alphabet, and a cycle (<code>z, x, z</code>) has no answer. LintCode wants the smallest answer when several are valid, so the queue becomes a priority queue — in TypeScript, with at most 26 letters, a sorted array is enough.</p>
</div>
<div class="ml-vi">
<h3>Hai biến thể</h3>
<p><strong>Alien Dictionary (LC 269 — từ điển người ngoài hành tinh, Premium; bản miễn phí LintCode 892).</strong> Bạn có các từ đã sắp xếp theo một bảng chữ cái không biết; hãy khôi phục bảng chữ. Mỗi cặp từ <em>liền kề</em> cho tối đa một cạnh: ở vị trí đầu tiên chúng khác nhau, chữ của từ trước đứng trước chữ của từ sau (mọi thứ sau vị trí đó không nói lên gì). Hai ca biên quyết định đúng sai: một từ đứng trước chính tiền tố của nó (<code>"abc"</code> rồi <code>"ab"</code>) là không thể với bất kỳ bảng chữ nào, và một chu trình (<code>z, x, z</code>) thì vô nghiệm. LintCode muốn đáp án nhỏ nhất khi có nhiều đáp án hợp lệ, nên hàng đợi trở thành hàng đợi ưu tiên — trong TypeScript, với tối đa 26 chữ, một mảng giữ sắp xếp là đủ.</p>
</div>
${maHai('ch07/alien.ts', 'ch07/Alien.java', { vung: 'giai' })}
${ketQua('ch07/alien.ts')}
<div class="ml-en">
<p><strong>Find All Possible Recipes (LC 2115).</strong> A recipe can be cooked when all its ingredients are available; a cooked recipe becomes an ingredient for others. It is Kahn with a twist in the start: the initial queue is not "nodes with in-degree 0" but the <em>supplies</em> you already have, and each recipe's in-degree is its number of ingredients. Two recipes that need each other (third test) are never cooked — the cycle simply never unlocks.</p>
</div>
<div class="ml-vi">
<p><strong>Find All Possible Recipes (LC 2115 — các món nấu được từ nguyên liệu sẵn có).</strong> Một món nấu được khi đủ mọi nguyên liệu; món đã nấu lại thành nguyên liệu cho món khác. Đó là Kahn với một điểm xoay ở khởi đầu: hàng đợi ban đầu không phải "đỉnh bậc vào 0" mà là <em>nguyên liệu</em> bạn đang có, và bậc vào của mỗi món là số nguyên liệu của nó. Hai món cần lẫn nhau (test thứ ba) không bao giờ được nấu — chu trình đơn giản là không bao giờ được mở khoá.</p>
</div>
${maHai('ch07/recipes.ts', 'ch07/Recipes.java', { vung: 'giai' })}
${ketQua('ch07/recipes.ts')}

<div class="ml-en">
<h3>Where topological order lives in real systems — including this repository</h3>
<ul>
<li><strong>Project timelines.</strong> <code>criticalPath</code> in <code>src/services/work/planning.service.ts</code> (CT Work) runs Kahn over the "blocks" dependencies of unfinished issues and, in the same loop, keeps the longest total duration reaching each issue — the <em>critical path</em>, i.e. LC 2050's "longest path in a DAG". Its comment is worth copying into your own code: "data typed by users is not guaranteed to be a DAG", so issues left on a cycle are simply skipped instead of hanging the request.</li>
<li><strong>Creating tables in the right order.</strong> <code>creationOrder</code> in <code>src/services/work/sqlDesign/model.ts</code> orders tables "parent before child" (a foreign key is an arrow parent → child) so the generated SQL never references a table that does not exist yet. When foreign keys form a loop, it breaks the cycle by creating one table first and returning those foreign keys as <code>deferred</code>, to be added afterwards with <code>ALTER TABLE</code> — exactly what <code>pg_dump</code> does: it creates all tables first and adds foreign-key constraints at the end.</li>
<li><strong>Three colours in production.</strong> The diagram auto-layout in <code>src/services/work/sqlDesign/layout.ts</code> runs a DFS with <code>state</code> 1 (GRAY) and 2 (BLACK); an edge into a node in state 1 is marked "cạnh ngược" (back edge) and left out, which turns any schema into a DAG; then Kahn assigns each table a layer (column of the drawing) by longest path.</li>
<li><strong>Your dependencies.</strong> The output below is real: this repository's backend <code>package-lock.json</code> lists 992 packages and 1,966 dependency edges (counted on 15/11/2026), and it contains genuine cycles — <code>prosemirror-state@1.4.4</code> depends on <code>prosemirror-view</code>, which depends back on <code>prosemirror-state</code>. Installing still works because placing files in <code>node_modules</code> needs no order; anything that does need an order (running both modules' top-level code at <code>require</code> time) has to cope — Node's documentation has a section on cycles: one of the two modules receives the other's <em>unfinished</em> exports.</li>
<li><strong>Everywhere else:</strong> build tools (make, Gradle, Turborepo's <code>dependsOn</code>), spreadsheet recalculation (Excel's "circular reference" warning is cycle detection), and database migrations (a chain ordered by timestamp — the simplest DAG there is).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Thứ tự tô-pô sống ở đâu trong hệ thống thật — kể cả repo này</h3>
<ul>
<li><strong>Timeline dự án.</strong> <code>criticalPath</code> trong <code>src/services/work/planning.service.ts</code> (CT Work) chạy Kahn trên các phụ thuộc "chặn" (blocks) giữa các thẻ chưa xong và, trong cùng vòng lặp, giữ tổng thời lượng dài nhất đi tới mỗi thẻ — tức <em>đường găng</em> (critical path), chính là "đường dài nhất trong DAG" của LC 2050. Lời chú thích của nó đáng chép vào code của bạn: "dữ liệu người nhập không đảm bảo là DAG", nên các thẻ nằm trên chu trình đơn giản bị bỏ qua thay vì làm treo request.</li>
<li><strong>Tạo bảng đúng thứ tự.</strong> <code>creationOrder</code> trong <code>src/services/work/sqlDesign/model.ts</code> xếp bảng "cha trước con" (một khoá ngoại là mũi tên cha → con) để SQL sinh ra không bao giờ tham chiếu tới bảng chưa tồn tại. Khi các khoá ngoại tạo thành vòng, nó phá chu trình bằng cách tạo một bảng trước và trả các khoá ngoại đó về dạng <code>deferred</code> (hoãn), để thêm sau bằng <code>ALTER TABLE</code> — đúng cách <code>pg_dump</code> làm: tạo mọi bảng trước, thêm ràng buộc khoá ngoại ở cuối.</li>
<li><strong>Ba màu chạy thật.</strong> Phần tự dàn sơ đồ trong <code>src/services/work/sqlDesign/layout.ts</code> chạy một DFS với <code>state</code> 1 (XÁM) và 2 (ĐEN); cạnh đi vào đỉnh trạng thái 1 được ghi chú "cạnh ngược" và bị bỏ ra, biến mọi lược đồ thành DAG; sau đó Kahn gán cho mỗi bảng một tầng (cột trên hình vẽ) theo đường dài nhất.</li>
<li><strong>Các gói phụ thuộc của bạn.</strong> Output dưới đây là thật: <code>package-lock.json</code> của backend repo này liệt kê 992 gói và 1.966 cạnh phụ thuộc (đếm ngày 15/11/2026), và có chu trình thật — <code>prosemirror-state@1.4.4</code> phụ thuộc <code>prosemirror-view</code>, gói này lại phụ thuộc ngược <code>prosemirror-state</code>. Cài đặt vẫn chạy vì đặt tệp vào <code>node_modules</code> không cần thứ tự; thứ gì cần thứ tự (chạy code cấp cao nhất của cả hai module lúc <code>require</code>) thì phải tự xoay xở — tài liệu Node có hẳn một mục về chu trình: một trong hai module sẽ nhận được phần exports <em>chưa chạy xong</em> của module kia.</li>
<li><strong>Và khắp nơi:</strong> công cụ build (make, Gradle, <code>dependsOn</code> của Turborepo), tính lại bảng tính (cảnh báo "circular reference" của Excel chính là phát hiện chu trình), migration CSDL (một chuỗi xếp theo dấu thời gian — DAG đơn giản nhất có thể).</li>
</ul>
</div>
${ma('ch07/npm-vong.ts', { nhan: 'TypeScript' })}
${ketQua('ch07/npm-vong.ts')}
<div class="ml-en">
<p>Kahn places the three packages that do not depend on the loop and leaves <code>prosemirror-state</code>, <code>prosemirror-view</code> and everything that needs them (<code>@tiptap/pm</code>) behind; DFS names the exact loop. To see who pulls a package into your project, <code>npm explain prosemirror-view</code> walks the dependency graph <em>backwards</em> (who depends on me, and who depends on them) — a reverse traversal.</p>
</div>
<div class="ml-vi">
<p>Kahn xếp được ba gói không phụ thuộc vào vòng và bỏ lại <code>prosemirror-state</code>, <code>prosemirror-view</code> cùng mọi thứ cần chúng (<code>@tiptap/pm</code>); DFS gọi đúng tên vòng lặp. Muốn biết ai kéo một gói vào dự án, <code>npm explain prosemirror-view</code> đi đồ thị phụ thuộc theo chiều <em>ngược</em> (ai phụ thuộc vào tôi, rồi ai phụ thuộc vào họ) — một lượt duyệt ngược.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: trust flows along dependency edges</h3>
<p>Your application trusts every package reachable from it in the dependency graph, not only the ones you chose. Three real incidents, each a graph property: <strong>left-pad (2016)</strong> — one 11-line package was unpublished and thousands of builds broke, because the set of packages that <em>reach</em> it (a reverse traversal from left-pad) was enormous. <strong>event-stream (2018)</strong> — a new maintainer added a dependency, <code>flatmap-stream</code>, containing code that targeted one specific bitcoin wallet app; nobody installed it on purpose, it arrived as a transitive edge. <strong>Dependency confusion (2021)</strong> — a researcher published packages to the public registry with the same names as companies' internal packages; resolvers that consulted both sources picked the public, higher-versioned one, and his code ran inside many large companies' networks.</p>
<p>Defences that follow from the graph view: commit the lockfile and install with <code>npm ci</code> (the resolved graph cannot change silently); use a scoped or private registry for internal names so resolution is unambiguous; review what a change adds to the <em>transitive</em> graph (<code>npm ls --all</code> before and after), not only the direct dependency; and use <code>npm explain</code> to find which of your direct dependencies drags a vulnerable package in.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: lòng tin chảy theo các cạnh phụ thuộc</h3>
<p>Ứng dụng của bạn tin mọi gói tới được từ nó trong đồ thị phụ thuộc, không chỉ những gói bạn tự chọn. Ba sự cố có thật, mỗi cái là một tính chất của đồ thị: <strong>left-pad (2016)</strong> — một gói 11 dòng bị gỡ khỏi npm và hàng nghìn bản build gãy, vì tập các gói <em>tới được</em> nó (duyệt ngược từ left-pad) quá lớn. <strong>event-stream (2018)</strong> — một người bảo trì mới thêm phụ thuộc <code>flatmap-stream</code>, trong đó có mã nhắm vào đúng một ứng dụng ví bitcoin; không ai chủ động cài nó, nó tới theo một cạnh bắc cầu (transitive). <strong>Dependency confusion (2021 — nhầm lẫn phụ thuộc)</strong> — một nhà nghiên cứu đăng lên kho công khai các gói trùng tên với gói nội bộ của nhiều công ty; bộ phân giải nào tra cả hai nguồn sẽ chọn bản công khai có số phiên bản cao hơn, và mã của anh ta chạy được bên trong mạng của nhiều công ty lớn.</p>
<p>Cách phòng rút ra từ góc nhìn đồ thị: commit lockfile và cài bằng <code>npm ci</code> (đồ thị đã phân giải không thể lặng lẽ thay đổi); dùng registry có scope hoặc registry riêng cho tên nội bộ để việc phân giải không mơ hồ; review xem một thay đổi thêm gì vào đồ thị <em>bắc cầu</em> (chạy <code>npm ls --all</code> trước và sau), không chỉ phụ thuộc trực tiếp; và dùng <code>npm explain</code> để tìm phụ thuộc trực tiếp nào đang kéo một gói có lỗ hổng vào.</p>
</div>

<div class="ml-en">
<h3>Two traps</h3>
<div class="pitfall co-tieu-de"><p><strong>Detecting a cycle in a DIRECTED graph with a plain visited set.</strong></p><p>"I have seen this node before ⇒ cycle" is correct for undirected graphs (with a parent check) and wrong for directed ones: in a diamond, node 3 is reached twice without any cycle.</p></div>
</div>
<div class="ml-vi">
<h3>Hai cái bẫy</h3>
<div class="pitfall co-tieu-de"><p><strong>Phát hiện chu trình trong đồ thị CÓ HƯỚNG bằng một tập visited thường.</strong></p><p>"Đỉnh này gặp rồi ⇒ có chu trình" đúng với đồ thị vô hướng (kèm phép kiểm cha) và sai với đồ thị có hướng: trong hình thoi, đỉnh 3 bị chạm tới hai lần mà không hề có chu trình.</p></div>
</div>
${ma('ch07/bay-2-mau.ts', { vung: 'sai', nhan: 'TypeScript — wrong' })}
${ketQua('ch07/bay-2-mau.ts')}
<div class="ml-en">
<p>The two-colour version says the diamond has a cycle — Course Schedule would then report "impossible" for a perfectly valid curriculum (any subject with two prerequisites that share an ancestor). Only an edge into a node <em>still on the current path</em> (GRAY) closes a cycle.</p>
<div class="pitfall co-tieu-de"><p><strong>Reversing the edge direction.</strong></p><p>LC 207/210 give <code>[a, b]</code> = "b before a". Building <code>out[a].push(b)</code> produces a valid order of the reversed graph — the output looks plausible and is backwards. Cycle detection still works (a cycle is a cycle in both directions), so LC 207 passes and LC 210 fails: a classic "my first submission passed, my second did not".</p></div>
</div>
<div class="ml-vi">
<p>Bản hai màu nói hình thoi có chu trình — khi đó Course Schedule sẽ báo "không thể" cho một chương trình học hoàn toàn hợp lệ (bất kỳ môn nào có hai tiên quyết chung một tổ tiên). Chỉ cạnh đi vào một đỉnh <em>còn nằm trên đường hiện tại</em> (XÁM) mới khép một chu trình.</p>
<div class="pitfall co-tieu-de"><p><strong>Lật ngược chiều cạnh.</strong></p><p>LC 207/210 cho <code>[a, b]</code> = "b trước a". Dựng <code>out[a].push(b)</code> sẽ cho một thứ tự hợp lệ của đồ thị bị lật — output trông hợp lý mà lại ngược. Phát hiện chu trình vẫn đúng (chu trình thì lật chiều vẫn là chu trình), nên LC 207 qua còn LC 210 trượt: kiểu "bài đầu nộp qua, bài sau lại trượt" kinh điển.</p></div>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'There are n courses and a list of pairs [a, b] meaning b must be taken before a. Return a valid order, or an empty list.'],
  ['C', 'So each course is a node and each pair is an arrow from b to a — I will write that as a comment so I do not flip it. A valid order exists exactly when there is no cycle. Can there be duplicate pairs, and can n be up to around 10⁵?'],
  ['N', 'State the direction explicitly, link the question to "no cycle", ask about duplicates (they would double-count in-degrees — harmless as long as you decrement once per stored edge).'],
  ['I', 'Duplicates do not occur; n up to 2,000, pairs up to 5,000.'],
  ['C', 'I will use Kahn’s algorithm: count each course’s missing prerequisites as its in-degree, start a queue with every course at zero, and each time I take a course I decrement its dependants and enqueue any that reach zero. If I take fewer than n courses, the rest are on or behind a cycle and I return an empty list. O(V + E) time and space, and no recursion.'],
  ['I', 'Why not DFS?'],
  ['C', 'DFS with three colours works too — reversed finishing order — and it can return the actual cycle. I prefer Kahn here because it is iterative and the cycle check is one comparison at the end.'],
  ['C', '(after coding) Tests: no prerequisites returns 0..n−1; a two-course cycle returns empty; the diamond 0→1, 0→2, 1→3, 2→3 must put 3 last; and two separate chains must both appear.'],
  ['N', 'The diamond is the test that catches a two-colour cycle check; the separate chains catch "I only started from node 0".'],
  ['I', 'Follow-up: what is the minimum number of semesters if you can take any number of courses per semester?'],
  ['C', 'Process Kahn level by level — each level is one semester — and the answer is the number of levels, which equals the number of courses on the longest prerequisite chain. With a limit k per semester it becomes much harder (LC 1494 is a bitmask DP), so I would ask for the limit first.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Có n môn học và danh sách cặp [a, b] nghĩa là phải học b trước a. Trả về một thứ tự hợp lệ, hoặc danh sách rỗng.'],
  ['C', 'Vậy mỗi môn là một đỉnh, mỗi cặp là một mũi tên từ b sang a — em ghi thành chú thích để không lật ngược. Thứ tự hợp lệ tồn tại đúng khi không có chu trình. Có thể có cặp trùng không ạ, và n có lên tới cỡ 10⁵ không? <em>("Each pair is an edge from b to a.")</em>'],
  ['N', 'Nói rõ chiều mũi tên, nối câu hỏi với "không có chu trình", hỏi về cặp trùng (chúng làm bậc vào đếm hai lần — vô hại nếu giảm một lần cho mỗi cạnh đã lưu).'],
  ['I', 'Không có cặp trùng; n tới 2.000, số cặp tới 5.000.'],
  ['C', 'Em dùng thuật toán Kahn: đếm số tiên quyết còn thiếu của mỗi môn làm bậc vào, khởi tạo hàng đợi với mọi môn bằng 0, mỗi lần lấy một môn em giảm các môn phụ thuộc nó và đưa vào hàng môn nào về 0. Nếu lấy được ít hơn n môn, phần còn lại nằm trên hoặc sau một chu trình và em trả về rỗng. O(V + E) thời gian và bộ nhớ, không đệ quy. <em>("If I take fewer than n courses, there is a cycle.")</em>'],
  ['I', 'Sao không dùng DFS?'],
  ['C', 'DFS ba màu cũng được — thứ tự kết thúc đảo ngược — và nó trả được chính chu trình. Ở đây em chọn Kahn vì nó lặp, và phép kiểm chu trình chỉ là một phép so sánh ở cuối.'],
  ['C', '(sau khi code) Test: không có tiên quyết thì trả 0..n−1; chu trình hai môn trả rỗng; hình thoi 0→1, 0→2, 1→3, 2→3 phải đặt 3 cuối cùng; và hai chuỗi tách rời phải xuất hiện đủ cả hai.'],
  ['N', 'Hình thoi là test bắt lỗi kiểm chu trình hai màu; hai chuỗi tách rời bắt lỗi "em chỉ bắt đầu từ đỉnh 0".'],
  ['I', 'Câu nối tiếp: số học kỳ ít nhất là bao nhiêu nếu mỗi kỳ học bao nhiêu môn cũng được?'],
  ['C', 'Chạy Kahn theo từng tầng — mỗi tầng là một học kỳ — và đáp án là số tầng, bằng số môn trên chuỗi tiên quyết dài nhất. Nếu giới hạn k môn mỗi kỳ thì khó hơn nhiều (LC 1494 là quy hoạch động bitmask), nên em sẽ hỏi giới hạn đó trước. <em>("Each level of Kahn’s algorithm is one semester.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Building the edge in the wrong direction (<code>[a, b]</code> is b → a in LC 207/210).</li>
<li>Detecting directed cycles with a two-colour visited set — the diamond is reported as a cycle.</li>
<li>Starting Kahn's queue with only node 0, or DFS from only node 0 — disconnected graphs lose nodes.</li>
<li>Forgetting the final <code>order.length === n</code> check and returning a partial order on a cyclic graph.</li>
<li>Using <code>shift()</code> for Kahn's queue on 10⁵ nodes in TypeScript (lesson 3.2); a head index costs nothing.</li>
<li>In Alien Dictionary: comparing letters after the first difference, or missing the "word before its own prefix" case.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dựng cạnh sai chiều (<code>[a, b]</code> là b → a trong LC 207/210).</li>
<li>Phát hiện chu trình có hướng bằng tập visited hai màu — hình thoi bị báo là chu trình.</li>
<li>Khởi tạo hàng đợi Kahn chỉ với đỉnh 0, hoặc DFS chỉ từ đỉnh 0 — đồ thị không liên thông bị mất đỉnh.</li>
<li>Quên phép kiểm cuối <code>order.length === n</code> và trả về một thứ tự dở dang trên đồ thị có chu trình.</li>
<li>Dùng <code>shift()</code> làm hàng đợi Kahn với 10⁵ đỉnh trong TypeScript (bài 3.2); chỉ số đầu hàng không tốn gì.</li>
<li>Với Alien Dictionary: so tiếp các chữ sau chỗ khác nhau đầu tiên, hoặc sót ca "từ đứng trước chính tiền tố của nó".</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Bài tiếp theo (<a href="${baiNay('dsa-7-4-dijkstra')}">7.4</a>) thêm trọng số vào cạnh: Dijkstra, Bellman-Ford có giới hạn số chặng, và union-find để gộp nhóm.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>From memory, write Kahn's <code>findOrder</code> with the direction comment. Run it on the five tests above.</li>
<li>Write the two-colour cycle check, run it on the diamond, watch it say <code>true</code>, then fix it with GRAY/BLACK.</li>
<li>Take your own curriculum (the subjects you have passed and the ones left) and list the prerequisite arrows on paper; find your longest remaining chain — that is the minimum number of terms you still need.</li>
<li>Submit LC 207 and LC 210.</li>
</ol>
<p><strong>Done when:</strong> two accepted submissions, the diamond fixed, and your own longest chain written down.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DAG</span><span class="v">Directed acyclic graph: arrows and no cycle; exactly the graphs that have a topological order.</span></div>
  <div class="kv"><span class="k">topological order</span><span class="v">A listing where every edge u → v has u before v; usually not unique.</span></div>
  <div class="kv"><span class="k">Kahn's algorithm</span><span class="v">Repeatedly remove an in-degree-0 node with a queue; leftovers ⇔ cycle.</span></div>
  <div class="kv"><span class="k">three-colour DFS</span><span class="v">WHITE/GRAY/BLACK; an edge into GRAY is a back edge = cycle; reversed finishing order = topological order.</span></div>
  <div class="kv"><span class="k">back edge</span><span class="v">An edge from a node to an ancestor on the current DFS path.</span></div>
  <div class="kv"><span class="k">critical path</span><span class="v">The longest chain of dependent tasks; it decides the earliest finish of a project.</span></div>
  <div class="kv"><span class="k">transitive dependency</span><span class="v">A dependency of a dependency — reachable, not chosen.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>"Before/after" constraints = a directed graph; an order exists ⇔ no cycle.</li>
<li>Kahn: in-degrees + queue, O(V + E), no recursion, levels for free; fewer than n taken ⇒ cycle.</li>
<li>DFS three colours: edge into GRAY = cycle (and you get the path); reversed finishing order = topological order.</li>
<li>Two colours are wrong for directed graphs (the diamond).</li>
<li>Say the edge direction out loud: <code>[a, b]</code> in Course Schedule is b → a.</li>
<li>Real graphs have cycles (this repo's lockfile does): detect them, report them, never loop forever.</li>
</ul>
${nguon('📘', 'cp-algorithms — Topological sorting', 'The DFS method with proof, and how to check uniqueness of the order', 'https://cp-algorithms.com/graph/topological-sort.html')}
${nguon('🟩', 'Node.js documentation — Modules: cycles', 'What happens when two CommonJS modules require each other (the "Cycles" section)', 'https://nodejs.org/api/modules.html')}
${nguon('🔐', 'npm blog — Details about the event-stream incident', 'How a malicious package arrived as a transitive dependency', 'https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết <code>findOrder</code> bằng Kahn kèm chú thích chiều mũi tên. Chạy với năm test ở trên.</li>
<li>Viết phép kiểm chu trình hai màu, chạy trên hình thoi, thấy nó nói <code>true</code>, rồi sửa bằng XÁM/ĐEN.</li>
<li>Lấy chương trình học của chính bạn (các môn đã qua và còn lại) và liệt kê các mũi tên tiên quyết ra giấy; tìm chuỗi còn lại dài nhất — đó là số học kỳ tối thiểu bạn còn cần.</li>
<li>Nộp LC 207 và LC 210.</li>
</ol>
<p><strong>Đạt khi:</strong> hai lượt nộp Accepted, sửa xong hình thoi, và ghi ra chuỗi dài nhất của chính bạn.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">DAG (đồ thị có hướng không chu trình)</span><span class="v">Có mũi tên và không có chu trình; đúng là những đồ thị có thứ tự tô-pô.</span></div>
  <div class="kv"><span class="k">topological order (thứ tự tô-pô)</span><span class="v">Cách liệt kê mà mọi cạnh u → v có u đứng trước v; thường không duy nhất.</span></div>
  <div class="kv"><span class="k">Kahn's algorithm (thuật toán Kahn)</span><span class="v">Lặp lại việc gỡ một đỉnh bậc vào 0 bằng hàng đợi; còn sót ⇔ có chu trình.</span></div>
  <div class="kv"><span class="k">three-colour DFS (DFS ba màu)</span><span class="v">TRẮNG/XÁM/ĐEN; cạnh vào XÁM là cạnh ngược = chu trình; thứ tự kết thúc đảo ngược = thứ tự tô-pô.</span></div>
  <div class="kv"><span class="k">back edge (cạnh ngược)</span><span class="v">Cạnh từ một đỉnh tới tổ tiên của nó trên đường DFS hiện tại.</span></div>
  <div class="kv"><span class="k">critical path (đường găng)</span><span class="v">Chuỗi việc phụ thuộc dài nhất; quyết định thời điểm xong sớm nhất của dự án.</span></div>
  <div class="kv"><span class="k">transitive dependency (phụ thuộc bắc cầu)</span><span class="v">Phụ thuộc của phụ thuộc — tới được, chứ không phải tự chọn.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Ràng buộc "trước/sau" = đồ thị có hướng; có thứ tự ⇔ không có chu trình.</li>
<li>Kahn: bậc vào + hàng đợi, O(V + E), không đệ quy, có tầng miễn phí; lấy được ít hơn n ⇒ có chu trình.</li>
<li>DFS ba màu: cạnh vào XÁM = chu trình (và có luôn đường đi); thứ tự kết thúc đảo ngược = thứ tự tô-pô.</li>
<li>Hai màu là SAI với đồ thị có hướng (hình thoi).</li>
<li>Nói to chiều cạnh: <code>[a, b]</code> trong Course Schedule là b → a.</li>
<li>Đồ thị thật có chu trình (lockfile của repo này có): phát hiện, báo ra, không bao giờ lặp vô hạn.</li>
</ul>
${nguon('📘', 'cp-algorithms — Topological sorting', 'Cách dùng DFS kèm chứng minh, và cách kiểm thứ tự có duy nhất không (tiếng Anh)', 'https://cp-algorithms.com/graph/topological-sort.html')}
${nguon('🟩', 'Node.js documentation — Modules: cycles', 'Chuyện gì xảy ra khi hai module CommonJS require lẫn nhau (mục "Cycles", tiếng Anh)', 'https://nodejs.org/api/modules.html')}
${nguon('🔐', 'npm blog — Details about the event-stream incident', 'Một gói độc hại đã tới dưới dạng phụ thuộc bắc cầu như thế nào (tiếng Anh)', 'https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident')}
</div>
`,
};
