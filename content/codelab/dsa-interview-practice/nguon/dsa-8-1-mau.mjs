/** Coding Interview Prep · 8.1 — Khuôn quay lui: chọn → đi tiếp → bỏ chọn; liệt kê theo thứ tự xác định, cắt nhánh theo ngân sách, kiểm ràng buộc sớm. Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Tích Descartes bằng quay lui: các mật khẩu ứng viên ── */
function passwordCandidates(slots) {
  var out = [], path = [];
  function go(i) {
    if (i === slots.length) { out.push(path.join('')); return; } // a full candidate: COPY it out (join makes a new string)
    for (var c = 0; c < slots[i].length; c++) {
      path.push(slots[i][c]); // choose
      go(i + 1);              // explore
      path.pop();             // un-choose — the next option starts from the same prefix
    }
  }
  go(0);
  return out;
}
const B1 = bai({
  ten: 'Forgot my password: every candidate from what I remember', kho: 'EASY', phut: 15, ham: 'passwordCandidates',
  en: `<p>A student locked out of the FAP portal remembers their password only partly: for each position they remember a few possible characters — "the first letter was <code>c</code> or <code>C</code>, then <code>@</code> or <code>a</code>, …". <code>slots[i]</code> is a string listing the possible characters of position <code>i</code>, in the order the student wants to try them.</p>
<p>Write <code>passwordCandidates(slots)</code> returning every candidate password, in the order a person would try them: first character varies slowest, last character fastest, and within a position characters keep the order given in <code>slots[i]</code>.</p>
<p>With no positions at all there is exactly one candidate, the empty string. If some position has no possible character, there is no candidate.</p>`,
  vi: `<p>Một sinh viên bị khoá khỏi cổng FAP chỉ nhớ mật khẩu lờ mờ: với mỗi vị trí bạn ấy nhớ vài ký tự có thể — "chữ đầu là <code>c</code> hoặc <code>C</code>, rồi <code>@</code> hoặc <code>a</code>, …". <code>slots[i]</code> là chuỗi liệt kê các ký tự có thể của vị trí <code>i</code>, theo thứ tự bạn ấy muốn thử.</p>
<p>Viết <code>passwordCandidates(slots)</code> trả về mọi mật khẩu ứng viên, theo thứ tự một người sẽ thử: ký tự đầu đổi chậm nhất, ký tự cuối đổi nhanh nhất, và trong một vị trí các ký tự giữ đúng thứ tự cho trong <code>slots[i]</code>.</p>
<p>Không có vị trí nào thì có đúng một ứng viên là chuỗi rỗng. Nếu một vị trí không có ký tự nào thì không có ứng viên nào.</p>`,
  dauVao: ['slots — array of strings (possible characters of each position).', 'slots — mảng chuỗi (các ký tự có thể của từng vị trí).'],
  dauRa: ['string[] — candidates in trial order.', 'string[] — các ứng viên theo thứ tự thử.'],
  rangBuoc: [['0 ≤ slots.length ≤ 12; the number of candidates is at most 20 000.', '0 ≤ slots.length ≤ 12; số ứng viên tối đa 20 000.'], ['Output-sized work is unavoidable: O(product · length).', 'Khối lượng bằng kích thước đầu ra là không tránh được: O(tích · độ dài).']],
  goiY: [
    ['Draw the decision tree: level i chooses the character of position i. Every leaf is one candidate, and a left-to-right walk of the leaves is exactly the trial order.', 'Vẽ cây quyết định: tầng i chọn ký tự cho vị trí i. Mỗi lá là một ứng viên, và đi các lá từ trái sang phải đúng là thứ tự thử.'],
    ['Template: <code>go(i)</code> — if <code>i === slots.length</code> record a COPY of the path; otherwise for each character: push, <code>go(i + 1)</code>, pop.', 'Khuôn: <code>go(i)</code> — nếu <code>i === slots.length</code> thì ghi một BẢN SAO của đường đi; ngược lại với mỗi ký tự: push, <code>go(i + 1)</code>, pop.'],
  ],
  loi: [
    ['Forgetting <code>path.pop()</code> (un-choose): the second option is appended after the first instead of replacing it, so candidates get longer and longer.', 'Quên <code>path.pop()</code> (bỏ chọn): lựa chọn thứ hai bị nối sau lựa chọn thứ nhất thay vì thay nó, nên ứng viên dài dần ra.'],
    ['Pushing the <code>path</code> array itself into the result: every entry is the same array, which is empty at the end.', 'Đẩy chính mảng <code>path</code> vào kết quả: mọi phần tử là cùng một mảng, cuối cùng nó rỗng.'],
    ['Returning <code>[]</code> for <code>slots = []</code>: the empty product has one element, the empty string.', 'Trả <code>[]</code> khi <code>slots = []</code>: tích rỗng có một phần tử là chuỗi rỗng.'],
  ],
  gt: ['This is the backtracking template in its purest form — no pruning, every branch is a valid answer. The recursion tree has one level per position and the leaves appear left to right in exactly the trial order, so no sorting is needed. Work: one node per prefix, and each leaf costs O(length) to copy ⇒ O(P · L) time where P is the number of candidates, O(L) extra stack depth. The base case <code>i === slots.length</code> handles both special inputs for free: zero slots gives one empty candidate, and an empty slot gives a loop with no iterations, so nothing is recorded.', 'Đây là khuôn quay lui ở dạng thuần nhất — không cắt nhánh, nhánh nào cũng là đáp án. Cây đệ quy có một tầng cho mỗi vị trí và các lá hiện ra từ trái sang phải đúng thứ tự thử, nên không cần sắp xếp. Khối lượng: một nút cho mỗi tiền tố, mỗi lá tốn O(độ dài) để chép ⇒ O(P · L) thời gian với P là số ứng viên, độ sâu ngăn xếp O(L). Ca cơ sở <code>i === slots.length</code> lo luôn hai đầu vào đặc biệt: không vị trí nào cho một ứng viên rỗng, còn vị trí rỗng cho vòng lặp không chạy lần nào nên không ghi gì.'],
  kn: ['backtracking', 'cartesian product', 'decision tree'],
  tns: [tn('backtracking', 'quay lui'), tn('choose / explore / un-choose', 'chọn / đi tiếp / bỏ chọn'), tn('decision tree', 'cây quyết định'), tn('cartesian product', 'tích Descartes')],
  dau: `/**
 * slots: string[] — possible characters of each position
 * returns every candidate password in trial order
 */
function passwordCandidates(slots) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — the backtracking template: choose, explore, un-choose.\n' + nguon(passwordCandidates),
  cases: [
    { args: [['cC', '@a', 't']], moTa: ['c@t, cat, C@t, Cat', 'c@t, cat, C@t, Cat'] },
    { args: [['01', '01', '01']], moTa: ['All 3-bit strings in counting order', 'Mọi chuỗi 3 bit theo thứ tự đếm'] },
    { args: [[]], moTa: ['No positions ⇒ [""]', 'Không vị trí nào ⇒ [""]'] },
    { args: [['ab', '', 'c']], an: true, moTa: ['An empty position ⇒ []', 'Một vị trí rỗng ⇒ []'] },
    { args: [['x']], an: true },
    { args: [['ba', 'dc']], an: true, moTa: ['Keep the given order, do not sort', 'Giữ thứ tự cho sẵn, không sắp lại'] },
    { args: [['Hh', 'e3', 'l1', 'l1', 'o0']], an: true },
  ],
  saiMau: [
    { ten: ['No un-choose (path grows forever)', 'Không bỏ chọn (đường đi dài mãi)'], ma: 'function passwordCandidates(slots) {\n  var out = [], path = [];\n  function go(i) {\n    if (i === slots.length) { out.push(path.join("")); return; }\n    for (var ch of slots[i]) { path.push(ch); go(i + 1); }\n  }\n  go(0);\n  return out;\n}\n' },
  ],
});

/* ── 2. Mọi đường đi đơn trong ngân sách — cắt nhánh khi vượt ngân sách ── */
function routesWithinBudget(n, roads, from, to, budget) {
  var adj = [];
  for (var i = 0; i < n; i++) adj.push([]);
  for (var e = 0; e < roads.length; e++) { adj[roads[e][0]].push([roads[e][1], roads[e][2]]); adj[roads[e][1]].push([roads[e][0], roads[e][2]]); }
  for (var j = 0; j < n; j++) adj[j].sort(function (a, b) { return a[0] - b[0]; }); // smaller neighbour first ⇒ paths come out in lexicographic order
  var out = [], path = [from], onPath = new Uint8Array(n);
  onPath[from] = 1;
  function go(u, cost) {
    if (u === to) { out.push(path.slice()); return; } // a route ends the first time it reaches `to`
    for (var k = 0; k < adj[u].length; k++) {
      var v = adj[u][k][0], w = adj[u][k][1];
      if (onPath[v] || cost + w > budget) continue; // PRUNE: costs are positive, so an over-budget prefix can never recover
      onPath[v] = 1; path.push(v);   // choose
      go(v, cost + w);               // explore
      path.pop(); onPath[v] = 0;     // un-choose
    }
  }
  go(from, 0);
  return out;
}
const B2 = bai({
  ten: 'Campus tour: every route that fits the time budget', kho: 'MEDIUM', phut: 25, ham: 'routesWithinBudget',
  en: `<p>The open-day team plans guided tours. The campus has <code>n</code> spots <code>0 … n−1</code>; <code>roads</code> lists walkways <code>[a, b, minutes]</code> (two-way, at most one walkway per pair, minutes ≥ 1). A tour starts at <code>from</code>, ends at <code>to</code>, never visits a spot twice, and must take <b>at most</b> <code>budget</code> minutes in total.</p>
<p>Write <code>routesWithinBudget(n, roads, from, to, budget)</code> returning every such tour as an array of spots, sorted lexicographically (compare spot numbers left to right). A tour ends the moment it reaches <code>to</code>. If <code>from === to</code> the only tour is <code>[from]</code>.</p>
<p>The large check is a 7 × 7 grid of spots with 1-minute walkways: it has over 500 million simple routes corner to corner, but fewer than a thousand fit the budget — you must stop exploring a route as soon as it goes over budget.</p>`,
  vi: `<p>Ban tổ chức ngày hội tuyển sinh lên kế hoạch các tour dẫn khách. Khuôn viên có <code>n</code> điểm <code>0 … n−1</code>; <code>roads</code> liệt kê lối đi <code>[a, b, phút]</code> (hai chiều, mỗi cặp tối đa một lối, phút ≥ 1). Một tour bắt đầu ở <code>from</code>, kết thúc ở <code>to</code>, không ghé điểm nào hai lần, và tổng thời gian <b>không quá</b> <code>budget</code> phút.</p>
<p>Viết <code>routesWithinBudget(n, roads, from, to, budget)</code> trả về mọi tour như vậy dạng mảng điểm, sắp theo thứ tự từ điển (so số hiệu điểm từ trái sang phải). Tour kết thúc ngay khi chạm <code>to</code>. Nếu <code>from === to</code> thì tour duy nhất là <code>[from]</code>.</p>
<p>Kiểm lớn là lưới 7 × 7 điểm với lối đi 1 phút: từ góc này tới góc kia có hơn 500 triệu đường đi đơn, nhưng chưa tới một nghìn đường vừa ngân sách — bạn phải dừng khám phá một đường ngay khi nó vượt ngân sách.</p>`,
  dauVao: ['n; roads — array of [a, b, minutes]; from, to — spots; budget — minutes.', 'n; roads — mảng [a, b, phút]; from, to — điểm; budget — số phút.'],
  dauRa: ['number[][] — tours in lexicographic order.', 'number[][] — các tour theo thứ tự từ điển.'],
  rangBuoc: [['1 ≤ n ≤ 60; 0 ≤ roads.length ≤ 200; 1 ≤ minutes ≤ 100; the answer has at most 5 000 tours.', '1 ≤ n ≤ 60; 0 ≤ roads.length ≤ 200; 1 ≤ phút ≤ 100; đáp án tối đa 5 000 tour.'], ['Enumerating all simple paths and filtering at the end is NOT feasible.', 'Liệt kê mọi đường đi đơn rồi lọc ở cuối là KHÔNG khả thi.']],
  goiY: [
    ['Backtracking over paths: the state is (current spot, minutes so far, set of spots on the path). Choose a neighbour, explore, then remove it from the path again.', 'Quay lui trên đường đi: trạng thái là (điểm hiện tại, số phút đã đi, tập điểm trên đường). Chọn một hàng xóm, đi tiếp, rồi gỡ nó khỏi đường đi.'],
    ['Minutes are positive, so a prefix that is already over budget can only get worse: skip that neighbour before recursing. That single check is what makes the 7 × 7 grid fast.', 'Số phút luôn dương, nên một tiền tố đã vượt ngân sách chỉ có tệ hơn: bỏ qua hàng xóm đó trước khi đệ quy. Một phép kiểm ấy là thứ làm lưới 7 × 7 chạy nhanh.'],
    ['Visit neighbours in increasing order and the tours come out already sorted — no final sort needed (but sorting is also acceptable).', 'Thăm hàng xóm theo thứ tự tăng dần thì các tour ra sẵn đã sắp — không cần sắp ở cuối (sắp cũng được).'],
  ],
  loi: [
    ['Checking the budget only when reaching <code>to</code>: correct on small maps, but it walks through all 575 million simple paths of the grid ⇒ out of time.', 'Chỉ kiểm ngân sách khi chạm <code>to</code>: đúng với bản đồ nhỏ, nhưng phải đi hết 575 triệu đường đi đơn của lưới ⇒ hết giờ.'],
    ['Forgetting to unmark a spot after returning (un-choose): later routes can no longer pass through it, so tours go missing.', 'Quên bỏ đánh dấu một điểm khi quay về (bỏ chọn): các đường sau không đi qua nó được nữa, nên mất tour.'],
    ['Continuing past <code>to</code> and coming back: a tour must end the first time it reaches <code>to</code>.', 'Đi tiếp qua <code>to</code> rồi vòng lại: tour phải kết thúc ngay lần đầu chạm <code>to</code>.'],
  ],
  gt: ['Every tour is a root-to-leaf path in the backtracking tree, so the tree contains them all; pruning removes only subtrees whose prefix already exceeds the budget, and since every walkway costs ≥ 1 minute no tour below such a prefix can fit — the answer set is unchanged. The cost is the number of prefixes that fit the budget (times the degree), not the number of simple paths: on the 7 × 7 grid with budget 13 that is tens of thousands of prefixes instead of 5.7·10⁸ paths. Exploring neighbours in increasing order is a preorder walk, which lists root-to-leaf paths lexicographically.', 'Mỗi tour là một đường từ gốc tới lá của cây quay lui, nên cây chứa đủ chúng; cắt nhánh chỉ bỏ những cây con có tiền tố đã vượt ngân sách, và vì lối nào cũng tốn ≥ 1 phút nên không tour nào bên dưới tiền tố đó vừa — tập đáp án không đổi. Chi phí là số tiền tố còn vừa ngân sách (nhân bậc của nút), không phải số đường đi đơn: ở lưới 7 × 7 với ngân sách 13 đó là vài chục nghìn tiền tố thay vì 5,7·10⁸ đường. Thăm hàng xóm theo thứ tự tăng là duyệt tiền thứ tự, liệt kê các đường gốc–lá theo thứ tự từ điển.'],
  kn: ['backtracking', 'pruning', 'simple paths'],
  tns: [tn('pruning', 'cắt nhánh', 'bỏ cả cây con khi biết chắc nó không chứa đáp án.'), tn('simple path', 'đường đi đơn', 'không qua đỉnh nào hai lần.'), tn('budget', 'ngân sách'), tn('lexicographic order', 'thứ tự từ điển')],
  dau: `/**
 * n: number, roads: [a, b, minutes][], from: number, to: number, budget: number
 * returns every simple route from -> to with total minutes <= budget, sorted lexicographically
 */
function routesWithinBudget(n, roads, from, to, budget) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — backtracking over simple paths, pruned as soon as the budget is exceeded.\n' + nguon(routesWithinBudget),
  cases: [
    { args: [4, [[0, 1, 5], [1, 3, 5], [0, 2, 3], [2, 3, 3], [1, 2, 1]], 0, 3, 10], moTa: ['Four routes fit in 10 minutes', 'Bốn tour vừa 10 phút'] },
    { args: [4, [[0, 1, 5], [1, 3, 5], [0, 2, 3], [2, 3, 3], [1, 2, 1]], 0, 3, 6], moTa: ['Only 0-2-3 fits in 6 minutes', 'Chỉ 0-2-3 vừa 6 phút'] },
    { args: [3, [[0, 1, 1]], 0, 2, 50], moTa: ['Unreachable ⇒ []', 'Không tới được ⇒ []'] },
    { args: [2, [[0, 1, 4]], 1, 1, 0], an: true, moTa: ['from === to ⇒ [[from]]', 'from === to ⇒ [[from]]'] },
    { args: [5, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [0, 4, 4], [1, 3, 2]], 0, 4, 4], an: true, moTa: ['Exactly on budget counts', 'Đúng bằng ngân sách vẫn tính'] },
    { args: [5, [[0, 1, 2], [1, 2, 2], [2, 0, 2], [2, 3, 1], [3, 4, 1], [1, 4, 9]], 0, 4, 20], an: true, moTa: ['A cycle near the start must not be walked twice', 'Chu trình gần điểm đầu không được đi hai lần'] },
    { args: [6, [[0, 5, 1], [0, 1, 1], [1, 5, 1], [1, 2, 1], [2, 5, 1], [5, 3, 1]], 0, 5, 3], an: true, moTa: ['A route stops at `to`, it does not pass through it', 'Tour dừng ở `to`, không đi xuyên qua'] },
  ],
  perf: [{
    moTa: ['Performance: 7 × 7 grid, corner to corner, budget 13 minutes ⇒ 924 tours (no pruning = 5.7·10⁸ paths ⇒ times out)', 'Hiệu năng: lưới 7 × 7, góc tới góc, ngân sách 13 phút ⇒ 924 tour (không cắt nhánh = 5,7·10⁸ đường ⇒ hết giờ)'],
    than: 'var S = 7, roads = []; for (var r = 0; r < S; r++) for (var c = 0; c < S; c++) { var id = r * S + c; if (c + 1 < S) roads.push([id, id + 1, 1]); if (r + 1 < S) roads.push([id, id + S, 1]); } var t = routesWithinBudget(S * S, roads, 0, S * S - 1, 13); return { count: t.length, first: t[0], last: t[t.length - 1] };',
  }],
  saiMau: [
    { ten: ['No pruning: enumerate every simple path, filter by budget at the end', 'Không cắt nhánh: liệt kê mọi đường đi đơn, lọc ngân sách ở cuối'], chiHieuNang: true, ma: 'function routesWithinBudget(n, roads, from, to, budget) {\n  var adj = Array.from({ length: n }, function () { return []; });\n  for (var e of roads) { adj[e[0]].push([e[1], e[2]]); adj[e[1]].push([e[0], e[2]]); }\n  adj.forEach(function (l) { l.sort(function (a, b) { return a[0] - b[0]; }); });\n  var out = [], path = [from], on = new Uint8Array(n); on[from] = 1;\n  function go(u, cost) {\n    if (u === to) { if (cost <= budget) out.push(path.slice()); return; }\n    for (var x of adj[u]) { if (on[x[0]]) continue; on[x[0]] = 1; path.push(x[0]); go(x[0], cost + x[1]); path.pop(); on[x[0]] = 0; }\n  }\n  go(from, 0);\n  return out;\n}\n' },
    { ten: ['Spots never unmarked (no un-choose)', 'Không bỏ đánh dấu điểm (thiếu bỏ chọn)'], ma: 'function routesWithinBudget(n, roads, from, to, budget) {\n  var adj = Array.from({ length: n }, function () { return []; });\n  for (var e of roads) { adj[e[0]].push([e[1], e[2]]); adj[e[1]].push([e[0], e[2]]); }\n  adj.forEach(function (l) { l.sort(function (a, b) { return a[0] - b[0]; }); });\n  var out = [], path = [from], on = new Uint8Array(n); on[from] = 1;\n  function go(u, cost) {\n    if (u === to) { out.push(path.slice()); return; }\n    for (var x of adj[u]) { if (on[x[0]] || cost + x[1] > budget) continue; on[x[0]] = 1; path.push(x[0]); go(x[0], cost + x[1]); path.pop(); }\n  }\n  go(from, 0);\n  return out;\n}\n' },
  ],
});

/* ── 3. Xếp lịch thi: phép gán nhỏ nhất theo từ điển, kiểm xung đột NGAY khi chọn ── */
function examSlots(n, conflicts, k) {
  var adj = [];
  for (var i = 0; i < n; i++) adj.push([]);
  for (var e = 0; e < conflicts.length; e++) { adj[conflicts[e][0]].push(conflicts[e][1]); adj[conflicts[e][1]].push(conflicts[e][0]); }
  var slot = new Array(n).fill(-1);
  function ok(x, s) { // is slot s free of conflicts with the exams ALREADY placed?
    for (var t = 0; t < adj[x].length; t++) if (slot[adj[x][t]] === s) return false;
    return true;
  }
  function go(x) {
    if (x === n) return true; // every exam placed
    for (var s = 0; s < k; s++) {
      if (!ok(x, s)) continue; // prune immediately — do not build a full timetable to find out
      slot[x] = s;               // choose
      if (go(x + 1)) return true; // the first complete assignment in this order is the smallest one
      slot[x] = -1;              // un-choose
    }
    return false;
  }
  return go(0) ? slot : [];
}
const B3 = bai({
  ten: 'Exam timetable: the earliest-slot assignment with no clashes', kho: 'HARD', phut: 35, ham: 'examSlots',
  en: `<p>The exam office must place <code>n</code> exams (<code>0 … n−1</code>) into <code>k</code> time slots (<code>0 … k−1</code>). Each pair <code>[a, b]</code> in <code>conflicts</code> means some student sits both exams, so they must be in <b>different</b> slots.</p>
<p>Write <code>examSlots(n, conflicts, k)</code> returning an array <code>slot</code> of length n, or <code>[]</code> if no clash-free timetable exists. When several timetables work, return the <b>lexicographically smallest</b> one: exam 0 gets the smallest slot that still allows a complete timetable, then exam 1, and so on.</p>
<p>The large checks have 40 exams and 3 slots: 3⁴⁰ ≈ 1.2·10¹⁹ complete timetables. You must reject a slot the moment it clashes with an exam already placed.</p>`,
  vi: `<p>Phòng khảo thí phải xếp <code>n</code> môn thi (<code>0 … n−1</code>) vào <code>k</code> ca (<code>0 … k−1</code>). Mỗi cặp <code>[a, b]</code> trong <code>conflicts</code> nghĩa là có sinh viên thi cả hai môn, nên chúng phải ở các ca <b>khác nhau</b>.</p>
<p>Viết <code>examSlots(n, conflicts, k)</code> trả về mảng <code>slot</code> dài n, hoặc <code>[]</code> nếu không có lịch nào không trùng. Khi có nhiều lịch hợp lệ, trả lịch <b>nhỏ nhất theo từ điển</b>: môn 0 nhận ca nhỏ nhất mà vẫn còn xếp trọn được, rồi tới môn 1, cứ thế.</p>
<p>Các kiểm lớn có 40 môn và 3 ca: 3⁴⁰ ≈ 1,2·10¹⁹ lịch đầy đủ. Bạn phải loại một ca ngay khi nó trùng với môn đã xếp.</p>`,
  dauVao: ['n — exams; conflicts — array of [a, b] (a ≠ b); k — slots (≥ 1).', 'n — số môn; conflicts — mảng [a, b] (a ≠ b); k — số ca (≥ 1).'],
  dauRa: ['number[] — slot of each exam, or [].', 'number[] — ca của từng môn, hoặc [].'],
  rangBuoc: [['0 ≤ n ≤ 40; 0 ≤ conflicts.length ≤ 200; 1 ≤ k ≤ 5.', '0 ≤ n ≤ 40; 0 ≤ conflicts.length ≤ 200; 1 ≤ k ≤ 5.'], ['The tests are built so that backtracking with an immediate clash check finishes fast; generating whole timetables first does not.', 'Bộ kiểm được dựng để quay lui có kiểm trùng ngay lập tức chạy nhanh; sinh cả lịch rồi mới kiểm thì không.']],
  goiY: [
    ['Decide exams in order 0, 1, 2, … and try slots 0, 1, …, k−1 for each. Because of this order, the FIRST complete timetable you reach is the lexicographically smallest — return immediately.', 'Quyết định các môn theo thứ tự 0, 1, 2, … và thử ca 0, 1, …, k−1 cho mỗi môn. Nhờ thứ tự này, lịch đầy đủ ĐẦU TIÊN bạn chạm tới chính là lịch nhỏ nhất theo từ điển — trả về ngay.'],
    ['Before placing exam x in slot s, check only x\'s neighbours that are already placed. A clash means the whole subtree is dead: skip s.', 'Trước khi đặt môn x vào ca s, chỉ cần kiểm các hàng xóm của x đã được xếp. Trùng nghĩa là cả cây con đã chết: bỏ qua s.'],
    ['Let <code>go(x)</code> return true/false so success can stop the search, and reset <code>slot[x]</code> when you back out.', 'Cho <code>go(x)</code> trả true/false để thành công thì dừng tìm, và đặt lại <code>slot[x]</code> khi lùi ra.'],
  ],
  loi: [
    ['Building every complete timetable and checking clashes at the end: right answers for tiny inputs, k^n work — the 40-exam checks never finish.', 'Dựng mọi lịch đầy đủ rồi mới kiểm trùng: đúng với đầu vào tí hon, khối lượng k^n — kiểm 40 môn không bao giờ xong.'],
    ['Not stopping at the first complete timetable: the search continues through the whole tree (and may overwrite the answer with a larger one).', 'Không dừng ở lịch đầy đủ đầu tiên: việc tìm chạy tiếp hết cây (và có thể ghi đè đáp án bằng lịch lớn hơn).'],
    ['Greedy without backtracking ("give each exam its smallest free slot"): sometimes it paints itself into a corner and reports [] although a timetable exists.', 'Tham lam không quay lui ("cho mỗi môn ca trống nhỏ nhất"): có lúc tự dồn mình vào góc và báo [] dù có lịch.'],
  ],
  gt: ['This is graph colouring by backtracking. Trying exams in index order and slots in increasing order visits complete assignments in lexicographic order, so the first one found is the answer and we stop. The clash check at choice time prunes every subtree that contains a conflict between placed exams, which is what makes the 40-exam instances fast (an impossible clique at the start is rejected after a handful of nodes); without it the search is k^n leaves. Worst case remains exponential — colouring is NP-hard — which is why interviewers ask about pruning, not about a polynomial algorithm. Memory: O(n + conflicts).', 'Đây là tô màu đồ thị bằng quay lui. Thử môn theo chỉ số và ca theo thứ tự tăng thì các phép gán đầy đủ hiện ra theo thứ tự từ điển, nên phép đầu tiên tìm thấy là đáp án và ta dừng. Phép kiểm trùng lúc chọn cắt mọi cây con chứa xung đột giữa các môn đã xếp — đó là thứ làm các ca 40 môn chạy nhanh (một clique không thể xếp ở đầu bị loại sau vài nút); không có nó việc tìm là k^n lá. Trường hợp xấu nhất vẫn là hàm mũ — tô màu là NP-khó — nên người phỏng vấn hỏi về cắt nhánh chứ không đòi thuật toán đa thức. Bộ nhớ: O(n + conflicts).'],
  kn: ['backtracking', 'graph colouring', 'constraint satisfaction'],
  tns: [tn('graph colouring', 'tô màu đồ thị'), tn('constraint', 'ràng buộc'), tn('clique', 'clique — nhóm đỉnh đôi một kề nhau'), tn('NP-hard', 'NP-khó', 'chưa ai biết thuật toán đa thức.')],
  dau: `/**
 * n: number of exams, conflicts: [a, b][], k: number of slots
 * returns the lexicographically smallest clash-free slot array, or [] if impossible
 */
function examSlots(n, conflicts, k) {
  // Write your solution here
  return new Array(n).fill(0);
}
`,
  giai: '// Reference solution — backtracking in index order, clash check at choice time, stop at the first full timetable.\n' + nguon(examSlots),
  cases: [
    { args: [3, [[0, 1], [1, 2]], 2], moTa: ['A path of 3 exams, 2 slots ⇒ [0, 1, 0]', 'Chuỗi 3 môn, 2 ca ⇒ [0, 1, 0]'] },
    { args: [3, [[0, 1], [1, 2], [0, 2]], 2], moTa: ['Triangle, 2 slots ⇒ []', 'Tam giác, 2 ca ⇒ []'] },
    { args: [4, [], 1], moTa: ['No conflicts ⇒ everything in slot 0', 'Không xung đột ⇒ tất cả ca 0'] },
    { args: [0, [], 3], an: true },
    { args: [5, [[0, 1], [0, 2], [3, 4], [1, 3], [2, 4], [1, 2]], 3], an: true },
    { args: [6, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3]], 3], an: true },
    { args: [6, [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]], 2], an: true, moTa: ['Complete bipartite ⇒ two slots suffice', 'Hai phía đầy đủ ⇒ hai ca là đủ'] },
    { args: [7, [[0, 4], [1, 4], [2, 4], [3, 4], [0, 1], [2, 3], [5, 6], [4, 5], [1, 2]], 3], an: true },
    { args: [6, [[0, 2], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]], 3], an: true, moTa: ['Greedy smallest-free-slot gets stuck at exam 5, backtracking does not', 'Tham lam ca trống nhỏ nhất kẹt ở môn 5, quay lui thì không'] },
  ],
  perf: [{
    moTa: ['Performance: 40 exams, 3 slots — a solvable sparse timetable and an impossible one (4 mutually clashing exams at the start). k^n enumeration times out', 'Hiệu năng: 40 môn, 3 ca — một lịch thưa xếp được và một lịch không thể (4 môn đầu trùng đôi một). Liệt kê k^n hết giờ'],
    than: 'var n = 40, col = [], c1 = []; for (var i = 0; i < n; i++) col.push(R(3)); for (var e = 0; e < 70; e++) { var a = R(n), b = R(n); if (a !== b && col[a] !== col[b]) c1.push([a, b]); } var c2 = c1.slice(); c2.push([0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]); return [examSlots(n, c1, 3), examSlots(n, c2, 3)];',
  }],
  saiMau: [
    { ten: ['k^n: build every full timetable, check clashes at the end', 'k^n: dựng mọi lịch đầy đủ, kiểm trùng ở cuối'], chiHieuNang: true, ma: 'function examSlots(n, conflicts, k) {\n  var slot = new Array(n).fill(0);\n  function go(x) {\n    if (x === n) return conflicts.every(function (c) { return slot[c[0]] !== slot[c[1]]; });\n    for (var s = 0; s < k; s++) { slot[x] = s; if (go(x + 1)) return true; }\n    return false;\n  }\n  return go(0) ? slot : [];\n}\n' },
    { ten: ['Greedy smallest free slot, no backtracking', 'Tham lam ca trống nhỏ nhất, không quay lui'], ma: 'function examSlots(n, conflicts, k) {\n  var adj = Array.from({ length: n }, function () { return []; });\n  for (var c of conflicts) { adj[c[0]].push(c[1]); adj[c[1]].push(c[0]); }\n  var slot = new Array(n).fill(-1);\n  for (var x = 0; x < n; x++) {\n    for (var s = 0; s < k; s++) if (adj[x].every(function (y) { return slot[y] !== s; })) { slot[x] = s; break; }\n    if (slot[x] < 0) return [];\n  }\n  return slot;\n}\n' },
  ],
});

export default mod('dsa-8-1-mau', '8.1 Backtracking template: choose, explore, un-choose', [B1, B2, B3]);
