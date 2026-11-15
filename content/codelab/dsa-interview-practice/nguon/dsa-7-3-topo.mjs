/** Coding Interview Prep · 7.3 — Sắp xếp tô-pô: soát thứ tự chạy, số học kỳ tối thiểu (Kahn theo tầng), thứ tự nhỏ nhất theo từ điển (Kahn + heap). Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Soát một thứ tự chạy CI có tôn trọng phụ thuộc ── */
function respectsDeps(order, deps) {
  var pos = new Map(); // job -> its position in the proposed order, O(1) lookup
  for (var i = 0; i < order.length; i++) pos.set(order[i], i);
  for (var j = 0; j < deps.length; j++) {
    var a = deps[j][0], b = deps[j][1];
    if (!pos.has(a) || !pos.has(b)) return false; // a job that never runs cannot satisfy anything
    if (pos.get(a) >= pos.get(b)) return false;  // `a` must run strictly before `b`
  }
  return true;
}
const T1 = bai({
  ten: 'CI pipeline: does this run order respect every dependency?', kho: 'EASY', phut: 10, ham: 'respectsDeps',
  en: `<p>The CI server of the SWP391 team runs build jobs one at a time. A teammate hand-wrote the run order <code>order</code> (job names), and the pipeline config lists <code>deps</code>: each pair <code>[a, b]</code> means job <code>a</code> must <b>finish before</b> job <code>b</code> starts.</p>
<p>Write <code>respectsDeps(order, deps)</code> returning <code>true</code> if the order satisfies every dependency, <code>false</code> otherwise. A dependency that mentions a job missing from <code>order</code> makes the order invalid.</p>`,
  vi: `<p>Máy chủ CI của nhóm SWP391 chạy các job build lần lượt từng cái. Một bạn trong nhóm tự viết tay thứ tự chạy <code>order</code> (tên job), còn cấu hình pipeline có <code>deps</code>: mỗi cặp <code>[a, b]</code> nghĩa là job <code>a</code> phải <b>xong trước</b> khi job <code>b</code> bắt đầu.</p>
<p>Viết <code>respectsDeps(order, deps)</code> trả về <code>true</code> nếu thứ tự thoả mọi phụ thuộc, ngược lại <code>false</code>. Một phụ thuộc nhắc tới job không có trong <code>order</code> làm thứ tự không hợp lệ.</p>`,
  dauVao: ['order — array of distinct job names; deps — array of [a, b].', 'order — mảng tên job không trùng; deps — mảng [a, b].'],
  dauRa: ['true / false', 'true / false'],
  rangBuoc: [['0 ≤ order.length, deps.length ≤ 200 000.', '0 ≤ order.length, deps.length ≤ 200 000.'], ['Target: O(order + deps).', 'Mục tiêu: O(order + deps).']],
  goiY: [
    ['An order is a valid topological order exactly when every edge goes "forward" in it.', 'Một thứ tự là thứ tự tô-pô hợp lệ đúng khi mọi cạnh đều đi "về phía trước" trong nó.'],
    ['Precompute <code>position[job]</code> once in a Map, then each dependency is a single comparison.', 'Tính sẵn <code>position[job]</code> một lần trong Map, rồi mỗi phụ thuộc chỉ là một phép so sánh.'],
  ],
  loi: [
    ['Calling <code>order.indexOf(a)</code> for every dependency: O(order · deps) — the 150 000 × 150 000 check times out.', 'Gọi <code>order.indexOf(a)</code> cho mỗi phụ thuộc: O(order · deps) — kiểm 150 000 × 150 000 hết giờ.'],
    ['Treating a missing job as "fine": <code>indexOf</code> returns −1, and −1 &lt; anything looks like "runs first".', 'Coi job vắng mặt là "ổn": <code>indexOf</code> trả −1, mà −1 &lt; mọi thứ nên trông như "chạy trước".'],
  ],
  gt: ['Checking a topological order does not need any graph algorithm: an order is valid iff every edge (a, b) has pos(a) &lt; pos(b). Building the position map is O(n) and each dependency is O(1) on average ⇒ O(n + m) time, O(n) memory. This is also how you test your own topological sort in an interview: generate an order, then verify it this way.', 'Soát một thứ tự tô-pô không cần thuật toán đồ thị nào: thứ tự hợp lệ khi và chỉ khi mọi cạnh (a, b) có pos(a) &lt; pos(b). Dựng map vị trí tốn O(n) và mỗi phụ thuộc trung bình O(1) ⇒ O(n + m) thời gian, O(n) bộ nhớ. Đây cũng là cách tự kiểm hàm sắp tô-pô của mình khi phỏng vấn: sinh một thứ tự rồi soát theo cách này.'],
  kn: ['topological order', 'verification'],
  tns: [tn('topological order', 'thứ tự tô-pô', 'thứ tự mà mọi cạnh đều đi từ trước ra sau.'), tn('dependency', 'phụ thuộc'), tn('pipeline', 'dây chuyền build/CI')],
  dau: `/**
 * order: string[] — proposed run order; deps: [a, b][] — a must run before b
 * returns true if every dependency is respected
 */
function respectsDeps(order, deps) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution — position map, then one comparison per dependency.\n' + nguon(respectsDeps),
  cases: [
    { args: [['lint', 'test', 'build', 'deploy'], [['lint', 'build'], ['test', 'build'], ['build', 'deploy']]], moTa: ['Valid order ⇒ true', 'Thứ tự hợp lệ ⇒ true'] },
    { args: [['build', 'lint', 'deploy'], [['lint', 'build']]], moTa: ['build runs before lint ⇒ false', 'build chạy trước lint ⇒ false'] },
    { args: [['lint', 'deploy'], [['build', 'deploy']]], moTa: ['build never runs ⇒ false', 'build không bao giờ chạy ⇒ false'] },
    { args: [[], []], an: true },
    { args: [['a', 'b'], [['a', 'a']]], an: true, moTa: ['A job that depends on itself ⇒ false', 'Job phụ thuộc chính nó ⇒ false'] },
    { args: [['x', 'y', 'z'], []], an: true },
    { args: [['a', 'b', 'c', 'd'], [['a', 'd'], ['b', 'c'], ['c', 'd'], ['a', 'c'], ['d', 'b']]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 150 000 jobs, 150 000 dependencies, the only violation is the last one (indexOf per dependency times out)', 'Hiệu năng: 150 000 job, 150 000 phụ thuộc, vi phạm duy nhất nằm cuối (indexOf cho mỗi phụ thuộc hết giờ)'],
    than: 'var n = 150000, o = new Array(n); for (var i = 0; i < n; i++) o[i] = "job-" + i; var d = []; for (var j = 0; j < 150000; j++) { var a = R(n - 1); d.push([o[a], o[a + 1 + R(n - 1 - a)]]); } d.push([o[n - 1], o[R(n - 1)]]); return respectsDeps(o, d);',
  }],
  saiMau: [
    { ten: ['O(n·m): indexOf for every dependency', 'O(n·m): indexOf cho mỗi phụ thuộc'], chiHieuNang: true, ma: 'function respectsDeps(order, deps) {\n  for (var d of deps) { var i = order.indexOf(d[0]), j = order.indexOf(d[1]); if (i < 0 || j < 0 || i >= j) return false; }\n  return true;\n}\n' },
    { ten: ['Missing jobs treated as fine (indexOf −1)', 'Coi job vắng là ổn (indexOf −1)'], ma: 'function respectsDeps(order, deps) {\n  var p = new Map(order.map(function (x, i) { return [x, i]; }));\n  for (var d of deps) { var i = p.has(d[0]) ? p.get(d[0]) : -1, j = p.has(d[1]) ? p.get(d[1]) : Infinity; if (i >= j) return false; }\n  return true;\n}\n' },
  ],
});

/* ── 2. Kahn theo tầng: số học kỳ tối thiểu ── */
function minSemesters(n, prereqs) {
  var adj = [], indeg = new Array(n).fill(0);
  for (var i = 0; i < n; i++) adj.push([]);
  for (var e = 0; e < prereqs.length; e++) { adj[prereqs[e][0]].push(prereqs[e][1]); indeg[prereqs[e][1]]++; }
  var layer = [];
  for (var c = 0; c < n; c++) if (indeg[c] === 0) layer.push(c); // semester 1: everything with no prerequisite
  var semesters = 0, taken = 0;
  while (layer.length) {
    semesters++;
    taken += layer.length;
    var next = [];
    for (var k = 0; k < layer.length; k++) {
      var u = layer[k];
      for (var t = 0; t < adj[u].length; t++) if (--indeg[adj[u][t]] === 0) next.push(adj[u][t]); // last prerequisite just passed
    }
    layer = next;
  }
  return taken === n ? semesters : -1; // courses left over ⇒ they sit on a cycle
}
const T2 = bai({
  ten: 'Study plan: the minimum number of semesters', kho: 'MEDIUM', phut: 20, ham: 'minSemesters',
  en: `<p>A curriculum has <code>n</code> courses numbered <code>0 … n−1</code>. Each pair <code>[a, b]</code> in <code>prereqs</code> means course <code>a</code> must be <b>passed in an earlier semester</b> than course <code>b</code>. Suppose a student may take any number of courses in one semester and passes everything.</p>
<p>Write <code>minSemesters(n, prereqs)</code> that returns the minimum number of semesters needed to finish all courses, or <code>−1</code> if the prerequisites contain a cycle (the curriculum can never be finished). With <code>n = 0</code> the answer is 0.</p>`,
  vi: `<p>Một chương trình học có <code>n</code> môn đánh số <code>0 … n−1</code>. Mỗi cặp <code>[a, b]</code> trong <code>prereqs</code> nghĩa là môn <code>a</code> phải <b>qua ở một học kỳ trước</b> môn <code>b</code>. Giả sử sinh viên được học bao nhiêu môn một kỳ cũng được và qua hết.</p>
<p>Viết <code>minSemesters(n, prereqs)</code> trả về số học kỳ tối thiểu để học xong mọi môn, hoặc <code>−1</code> nếu các điều kiện tiên quyết có chu trình (không bao giờ học xong được). Với <code>n = 0</code> đáp án là 0.</p>`,
  dauVao: ['n — number of courses; prereqs — array of [a, b].', 'n — số môn; prereqs — mảng [a, b].'],
  dauRa: ['A number (semesters) or −1.', 'Một số (học kỳ) hoặc −1.'],
  rangBuoc: [['0 ≤ n ≤ 200 000; 0 ≤ prereqs.length ≤ 300 000; pairs may repeat.', '0 ≤ n ≤ 200 000; 0 ≤ prereqs.length ≤ 300 000; cặp có thể lặp.'], ['Target: O(n + prereqs). Chains can be 200 000 courses long — avoid deep recursion.', 'Mục tiêu: O(n + prereqs). Chuỗi có thể dài 200 000 môn — tránh đệ quy sâu.']],
  goiY: [
    ['Semester 1 contains every course with no prerequisite. Removing them may free new courses — those are semester 2. That is Kahn\'s algorithm, processed layer by layer.', 'Kỳ 1 gồm mọi môn không có tiên quyết. Bỏ chúng đi có thể "mở khoá" môn mới — đó là kỳ 2. Đó chính là thuật toán Kahn, xử lý theo từng tầng.'],
    ['Keep in-degrees. When you process a layer, decrement the in-degree of each successor; a course whose in-degree hits 0 goes into the NEXT layer. Count the layers; if fewer than n courses were ever taken, there is a cycle.', 'Giữ bậc vào. Khi xử lý một tầng, giảm bậc vào của từng môn kế tiếp; môn có bậc vào về 0 vào tầng KẾ TIẾP. Đếm số tầng; nếu số môn đã học ít hơn n thì có chu trình.'],
  ],
  loi: [
    ['Rescanning all n courses every semester to find the ones that became available: O(n · semesters) = O(n²) on a long chain.', 'Quét lại cả n môn mỗi học kỳ để tìm môn vừa được mở: O(n · số kỳ) = O(n²) với chuỗi dài.'],
    ['Returning the number of layers even when some courses were never taken — a cycle must give −1.', 'Trả số tầng kể cả khi có môn chưa từng học — có chu trình phải trả −1.'],
    ['Recursive DFS for the longest path: correct, but a 200 000-course chain overflows the call stack.', 'DFS đệ quy tìm đường dài nhất: đúng, nhưng chuỗi 200 000 môn tràn ngăn xếp gọi hàm.'],
  ],
  gt: ['A course in layer d has a prerequisite chain of length d − 1 ending at it and cannot be taken earlier, and Kahn puts it in the first semester where all its prerequisites are done — so the number of layers is exactly the length of the longest chain. Each course enters a layer once and each edge decrements one in-degree once ⇒ O(n + m) time and memory. Duplicate pairs are harmless: they add 1 to the in-degree and are subtracted once each. A cycle leaves its courses with in-degree > 0 forever, which <code>taken &lt; n</code> detects.', 'Môn ở tầng d có một chuỗi tiên quyết dài d − 1 kết thúc ở nó nên không thể học sớm hơn, và Kahn đặt nó vào kỳ đầu tiên mà mọi tiên quyết đã xong — nên số tầng đúng bằng độ dài chuỗi dài nhất. Mỗi môn vào một tầng một lần và mỗi cạnh giảm một bậc vào một lần ⇒ O(n + m) thời gian và bộ nhớ. Cặp lặp vô hại: cộng 1 vào bậc vào và được trừ mỗi lần một. Chu trình làm các môn của nó mãi có bậc vào > 0, phép thử <code>taken &lt; n</code> bắt được.'],
  kn: ["Kahn's algorithm", 'longest path in a DAG', 'cycle detection'],
  tns: [tn('in-degree', 'bậc vào', 'số cạnh đi vào một nút.'), tn('DAG (directed acyclic graph)', 'đồ thị có hướng không chu trình'), tn('prerequisite', 'môn tiên quyết'), tn('layer', 'tầng')],
  dau: `/**
 * n: number of courses (0..n-1), prereqs: [a, b][] — a before b
 * returns the minimum number of semesters, or -1 if there is a cycle
 */
function minSemesters(n, prereqs) {
  // Write your solution here
  return n;
}
`,
  giai: "// Reference solution — Kahn's algorithm layer by layer; layers = semesters.\n" + nguon(minSemesters),
  cases: [
    { args: [4, [[0, 1], [0, 2], [1, 3], [2, 3]]], moTa: ['0 → {1, 2} → 3 ⇒ 3 semesters', '0 → {1, 2} → 3 ⇒ 3 kỳ'] },
    { args: [3, []], moTa: ['No prerequisites ⇒ 1 semester', 'Không có tiên quyết ⇒ 1 kỳ'] },
    { args: [3, [[0, 1], [1, 2], [2, 0]]], moTa: ['Cycle ⇒ −1', 'Chu trình ⇒ −1'] },
    { args: [0, []], an: true },
    { args: [5, [[0, 1], [0, 1], [1, 2], [3, 4]]], an: true, moTa: ['Duplicate pair', 'Cặp lặp'] },
    { args: [6, [[0, 1], [1, 2], [3, 4], [4, 4], [2, 5]]], an: true, moTa: ['Self-loop ⇒ −1', 'Tự vòng ⇒ −1'] },
    { args: [6, [[5, 4], [4, 3], [3, 2], [2, 1], [1, 0], [5, 0]]], an: true },
    { args: [7, [[0, 3], [1, 3], [2, 4], [3, 5], [4, 5], [5, 6], [1, 6]]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 courses with a chain of length 200 000 (rescanning every semester times out; recursion overflows)', 'Hiệu năng: 200 000 môn có một chuỗi dài 200 000 (quét lại mỗi kỳ hết giờ; đệ quy tràn ngăn xếp)'],
    than: 'var n = 200000, p = []; for (var i = 0; i + 1 < n; i++) p.push([i, i + 1]); for (var j = 0; j < 100000; j++) { var a = R(n - 1); p.push([a, a + 1 + R(n - 1 - a)]); } return minSemesters(n, p);',
  }],
  saiMau: [
    { ten: ['O(n²): rescan all courses every semester', 'O(n²): quét lại mọi môn mỗi kỳ'], chiHieuNang: true, ma: 'function minSemesters(n, prereqs) {\n  var indeg = new Array(n).fill(0), adj = Array.from({ length: n }, function () { return []; });\n  for (var e of prereqs) { adj[e[0]].push(e[1]); indeg[e[1]]++; }\n  var done = new Array(n).fill(false), taken = 0, sem = 0;\n  while (taken < n) {\n    var now = [];\n    for (var c = 0; c < n; c++) if (!done[c] && indeg[c] === 0) now.push(c);\n    if (!now.length) return -1;\n    sem++;\n    for (var u of now) { done[u] = true; taken++; for (var v of adj[u]) indeg[v]--; }\n  }\n  return sem;\n}\n' },
    { ten: ['Ignores leftover courses (no cycle check)', 'Bỏ qua môn còn sót (không kiểm chu trình)'], ma: 'function minSemesters(n, prereqs) {\n  var indeg = new Array(n).fill(0), adj = Array.from({ length: n }, function () { return []; });\n  for (var e of prereqs) { adj[e[0]].push(e[1]); indeg[e[1]]++; }\n  var layer = [], s = 0;\n  for (var c = 0; c < n; c++) if (!indeg[c]) layer.push(c);\n  while (layer.length) { s++; var nx = []; for (var u of layer) for (var v of adj[u]) if (--indeg[v] === 0) nx.push(v); layer = nx; }\n  return s;\n}\n' },
  ],
});

/* ── 3. Kahn + min-heap: thứ tự nhỏ nhất theo từ điển ── */
function smallestOrder(tasks, deps) {
  var idx = new Map();
  for (var i = 0; i < tasks.length; i++) idx.set(tasks[i], i);
  var adj = tasks.map(function () { return []; }), indeg = new Array(tasks.length).fill(0);
  for (var e = 0; e < deps.length; e++) { var a = idx.get(deps[e][0]), b = idx.get(deps[e][1]); adj[a].push(b); indeg[b]++; }
  // binary min-heap of task names: push/pop O(log n)
  var heap = [];
  function push(x) {
    heap.push(x);
    var k = heap.length - 1;
    while (k > 0) { var p = (k - 1) >> 1; if (heap[p] <= x) break; heap[k] = heap[p]; k = p; }
    heap[k] = x;
  }
  function pop() {
    var top = heap[0], last = heap.pop();
    if (heap.length) {
      var k = 0, n = heap.length;
      for (;;) {
        var l = 2 * k + 1, r = l + 1, m = k;
        var best = last;
        if (l < n && heap[l] < best) { m = l; best = heap[l]; }
        if (r < n && heap[r] < best) { m = r; best = heap[r]; }
        if (m === k) break;
        heap[k] = heap[m]; k = m;
      }
      heap[k] = last;
    }
    return top;
  }
  for (var c = 0; c < tasks.length; c++) if (indeg[c] === 0) push(tasks[c]);
  var out = [];
  while (heap.length) {
    var name = pop(); // the smallest name among the tasks that are ready RIGHT NOW
    out.push(name);
    var u = idx.get(name);
    for (var t = 0; t < adj[u].length; t++) if (--indeg[adj[u][t]] === 0) push(tasks[adj[u][t]]);
  }
  return out.length === tasks.length ? out : []; // a cycle leaves tasks behind
}
const T3 = bai({
  ten: 'Release checklist: the alphabetically smallest valid order', kho: 'HARD', phut: 35, ham: 'smallestOrder',
  en: `<p>The release manager prints the deployment checklist for the night shift. <code>tasks</code> are task names, <code>deps</code> pairs <code>[a, b]</code> mean <code>a</code> must be done before <code>b</code>. Many orders are valid, so to make every printout identical the team agreed on one rule: among all valid orders, print the <b>lexicographically smallest</b> one — at every step, do the smallest-named task that is ready.</p>
<p>Write <code>smallestOrder(tasks, deps)</code> returning that order as an array, or <code>[]</code> if the dependencies contain a cycle. Compare names with plain JavaScript string comparison (<code>a &lt; b</code>, i.e. UTF-16 code units — <code>"Z" &lt; "a"</code>).</p>`,
  vi: `<p>Người quản lý phát hành in danh sách việc triển khai cho ca đêm. <code>tasks</code> là tên các việc, cặp <code>[a, b]</code> trong <code>deps</code> nghĩa là <code>a</code> phải làm trước <code>b</code>. Có nhiều thứ tự hợp lệ, nên để mọi bản in giống hệt nhau, nhóm thống nhất một luật: trong mọi thứ tự hợp lệ, in thứ tự <b>nhỏ nhất theo từ điển</b> — ở mỗi bước, làm việc có tên nhỏ nhất trong số việc đã sẵn sàng.</p>
<p>Viết <code>smallestOrder(tasks, deps)</code> trả về thứ tự đó dạng mảng, hoặc <code>[]</code> nếu phụ thuộc có chu trình. So tên bằng phép so chuỗi thường của JavaScript (<code>a &lt; b</code>, tức theo đơn vị mã UTF-16 — <code>"Z" &lt; "a"</code>).</p>`,
  dauVao: ['tasks — array of distinct names; deps — array of [a, b] using names from tasks.', 'tasks — mảng tên không trùng; deps — mảng [a, b] dùng tên trong tasks.'],
  dauRa: ['string[] — the order, or [] on a cycle.', 'string[] — thứ tự, hoặc [] khi có chu trình.'],
  rangBuoc: [['0 ≤ tasks.length ≤ 100 000; 0 ≤ deps.length ≤ 200 000.', '0 ≤ tasks.length ≤ 100 000; 0 ≤ deps.length ≤ 200 000.'], ['Target: O((n + m) log n). JavaScript has no built-in priority queue — write a small binary heap.', 'Mục tiêu: O((n + m) log n). JavaScript không có hàng đợi ưu tiên dựng sẵn — tự viết một heap nhị phân nhỏ.']],
  goiY: [
    ['Kahn\'s algorithm already gives you the set of tasks that are ready. "Smallest valid order" just means: always take the smallest name from that set.', 'Thuật toán Kahn đã cho bạn tập các việc đang sẵn sàng. "Thứ tự hợp lệ nhỏ nhất" chỉ có nghĩa: luôn lấy tên nhỏ nhất trong tập đó.'],
    ['You need "insert" and "remove the minimum" many times ⇒ a min-heap. Scanning the ready list or re-sorting it each step is O(n²) when most tasks are ready at once.', 'Bạn cần "thêm" và "lấy nhỏ nhất" rất nhiều lần ⇒ min-heap. Quét danh sách sẵn sàng hay sắp lại nó mỗi bước là O(n²) khi phần lớn việc sẵn sàng cùng lúc.'],
    ['Heap in an array: children of k are 2k+1 and 2k+2, parent is (k−1)>>1. Push = append then sift up; pop = move the last element to the root then sift down.', 'Heap trong mảng: con của k là 2k+1 và 2k+2, cha là (k−1)>>1. Push = thêm cuối rồi đẩy lên; pop = đưa phần tử cuối lên gốc rồi đẩy xuống.'],
  ],
  loi: [
    ['Picking the minimum with a linear scan (or <code>ready.sort()</code>) every step: correct, but O(n²) with tens of thousands of ready tasks.', 'Lấy nhỏ nhất bằng cách quét tuyến tính (hoặc <code>ready.sort()</code>) mỗi bước: đúng, nhưng O(n²) với hàng chục nghìn việc sẵn sàng.'],
    ['Sorting the tasks first and then running plain Kahn with a FIFO queue: the result is valid but not the smallest (a task freed later can be smaller than one already waiting).', 'Sắp xếp các việc trước rồi chạy Kahn thường với hàng đợi FIFO: kết quả hợp lệ nhưng không nhỏ nhất (việc được mở sau có thể nhỏ hơn việc đang chờ).'],
    ['Using <code>localeCompare</code> instead of <code>&lt;</code>: it orders "Z" after "a" and disagrees with the specified comparison.', 'Dùng <code>localeCompare</code> thay cho <code>&lt;</code>: nó xếp "Z" sau "a" và khác với phép so mà đề quy định.'],
  ],
  gt: ['Greedy is correct here: at any moment, the first task of the lexicographically smallest order must be ready, and choosing the smallest ready task never blocks anything (it only frees more tasks). Kahn + min-heap does exactly that: each task is pushed and popped once (O(log n) each) and each edge is processed once ⇒ O((n + m) log n) time, O(n + m) memory. The FIFO version is a valid order but not the smallest, because readiness and alphabetical order are independent.', 'Tham lam đúng ở đây: tại mọi thời điểm, việc đầu tiên của thứ tự nhỏ nhất theo từ điển phải đang sẵn sàng, và chọn việc sẵn sàng nhỏ nhất không bao giờ chặn gì (nó chỉ mở thêm việc). Kahn + min-heap làm đúng điều đó: mỗi việc được push và pop một lần (mỗi lần O(log n)) và mỗi cạnh xử lý một lần ⇒ O((n + m) log n) thời gian, O(n + m) bộ nhớ. Bản FIFO cho thứ tự hợp lệ nhưng không nhỏ nhất, vì "sẵn sàng" và "thứ tự chữ cái" độc lập với nhau.'],
  kn: ["Kahn's algorithm", 'binary heap', 'lexicographic order'],
  tns: [tn('lexicographically smallest', 'nhỏ nhất theo từ điển'), tn('min-heap', 'đống nhỏ nhất', 'cây nhị phân trong mảng, gốc luôn là phần tử nhỏ nhất.'), tn('sift up / sift down', 'đẩy lên / đẩy xuống'), tn('priority queue', 'hàng đợi ưu tiên')],
  dau: `/**
 * tasks: string[], deps: [a, b][] — a before b
 * returns the lexicographically smallest valid order, or [] if there is a cycle
 */
function smallestOrder(tasks, deps) {
  // Write your solution here
  return tasks.slice().sort();
}
`,
  giai: "// Reference solution — Kahn's algorithm with a hand-written binary min-heap of ready task names.\n" + nguon(smallestOrder),
  cases: [
    { args: [['migrate-db', 'build', 'backup', 'smoke-test'], [['backup', 'migrate-db'], ['build', 'smoke-test'], ['migrate-db', 'smoke-test']]], moTa: ['backup, build, migrate-db, smoke-test', 'backup, build, migrate-db, smoke-test'] },
    { args: [['c', 'b', 'a'], [['c', 'a']]], moTa: ['"a" waits for "c": b, c, a', '"a" phải chờ "c": b, c, a'] },
    { args: [['x', 'y'], [['x', 'y'], ['y', 'x']]], moTa: ['Cycle ⇒ []', 'Chu trình ⇒ []'] },
    { args: [[], []], an: true },
    { args: [['beta', 'Alpha', 'alpha'], []], an: true, moTa: ['Code-unit order: uppercase first', 'Theo đơn vị mã: chữ hoa trước'] },
    { args: [['d', 'a', 'c', 'b', 'e'], [['d', 'a'], ['e', 'b'], ['c', 'e']]], an: true, moTa: ['Freed tasks can jump ahead of waiting ones', 'Việc vừa mở có thể vượt việc đang chờ'] },
    { args: [['t1', 't2', 't3', 't4'], [['t4', 't3'], ['t3', 't2'], ['t2', 't1'], ['t4', 't1']]], an: true },
    { args: [['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'b']]], an: true, moTa: ['Cycle not involving the first task ⇒ []', 'Chu trình không chứa việc đầu ⇒ []'] },
  ],
  perf: [{
    moTa: ['Performance: 80 000 tasks, 40 000 dependencies, most tasks ready at once (linear-scan minimum times out)', 'Hiệu năng: 80 000 việc, 40 000 phụ thuộc, phần lớn việc sẵn sàng cùng lúc (quét tìm nhỏ nhất hết giờ)'],
    than: 'var n = 80000, t = []; for (var i = 0; i < n; i++) t.push((R(1679616) + 1679616).toString(36) + "-" + i); var d = []; for (var j = 0; j < 40000; j++) { var a = R(n - 1); d.push([t[a], t[a + 1 + R(Math.min(50, n - 1 - a))]]); } var o = smallestOrder(t, d); return { length: o.length, first: o.slice(0, 3), last: o[o.length - 1], at40000: o[40000] };',
  }],
  saiMau: [
    { ten: ['O(n²): linear scan for the smallest ready task', 'O(n²): quét tuyến tính tìm việc sẵn sàng nhỏ nhất'], chiHieuNang: true, ma: 'function smallestOrder(tasks, deps) {\n  var idx = new Map(tasks.map(function (x, i) { return [x, i]; })), adj = tasks.map(function () { return []; }), indeg = tasks.map(function () { return 0; });\n  for (var d of deps) { adj[idx.get(d[0])].push(idx.get(d[1])); indeg[idx.get(d[1])]++; }\n  var ready = []; tasks.forEach(function (x, i) { if (!indeg[i]) ready.push(x); });\n  var out = [];\n  while (ready.length) {\n    var m = 0; for (var i = 1; i < ready.length; i++) if (ready[i] < ready[m]) m = i;\n    var name = ready[m]; ready[m] = ready[ready.length - 1]; ready.pop(); out.push(name);\n    for (var v of adj[idx.get(name)]) if (--indeg[v] === 0) ready.push(tasks[v]);\n  }\n  return out.length === tasks.length ? out : [];\n}\n' },
    { ten: ['Sort once, then plain FIFO Kahn', 'Sắp một lần rồi Kahn FIFO thường'], ma: 'function smallestOrder(tasks, deps) {\n  var s = tasks.slice().sort(), idx = new Map(s.map(function (x, i) { return [x, i]; })), adj = s.map(function () { return []; }), indeg = s.map(function () { return 0; });\n  for (var d of deps) { adj[idx.get(d[0])].push(idx.get(d[1])); indeg[idx.get(d[1])]++; }\n  var q = []; s.forEach(function (x, i) { if (!indeg[i]) q.push(i); });\n  for (var h = 0; h < q.length; h++) for (var v of adj[q[h]]) if (--indeg[v] === 0) q.push(v);\n  return q.length === s.length ? q.map(function (i) { return s[i]; }) : [];\n}\n' },
  ],
});

export default mod('dsa-7-3-topo', '7.3 Topological sort: verify, layer, order', [T1, T2, T3]);
