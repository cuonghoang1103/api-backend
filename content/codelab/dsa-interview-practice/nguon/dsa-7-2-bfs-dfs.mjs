/** Coding Interview Prep · 7.2 — BFS và DFS: đếm theo tầng, vùng liên thông bằng stack tường minh, BFS trên "tuyến" thay vì "điểm". Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. BFS theo tầng: thiết bị trong k bước nhảy ── */
function devicesWithinHops(n, links, start, k) {
  var adj = [];
  for (var i = 0; i < n; i++) adj.push([]);
  for (var e = 0; e < links.length; e++) { adj[links[e][0]].push(links[e][1]); adj[links[e][1]].push(links[e][0]); } // undirected
  var dist = new Array(n).fill(-1);
  dist[start] = 0;
  var queue = [start], head = 0, count = 0; // head index instead of queue.shift(): O(1) dequeue
  while (head < queue.length) {
    var u = queue[head++];
    if (dist[u] === k) continue; // neighbours would be k + 1 hops away
    for (var j = 0; j < adj[u].length; j++) {
      var v = adj[u][j];
      if (dist[v] !== -1) continue;
      dist[v] = dist[u] + 1; // mark when ENQUEUED, so no device enters the queue twice
      count++;
      queue.push(v);
    }
  }
  return count;
}
const E1 = bai({
  ten: 'Mesh Wi-Fi: devices within k hops of the router', kho: 'EASY', phut: 15, ham: 'devicesWithinHops',
  en: `<p>The dormitory runs a mesh Wi-Fi network: <code>n</code> access points numbered <code>0 … n−1</code>, and <code>links</code> lists the pairs that can talk to each other directly (both ways). Each hop adds latency, so the support team only guarantees a good connection to access points at most <code>k</code> hops away from the main router <code>start</code>.</p>
<p>Write <code>devicesWithinHops(n, links, start, k)</code> that returns how many access points <b>other than the router itself</b> are reachable from <code>start</code> using at most <code>k</code> links. The network may be disconnected, and the same link may be listed twice.</p>`,
  vi: `<p>Ký túc xá chạy mạng Wi-Fi mesh: <code>n</code> điểm phát số <code>0 … n−1</code>, và <code>links</code> liệt kê các cặp nói chuyện trực tiếp được với nhau (cả hai chiều). Mỗi bước nhảy (hop) thêm độ trễ, nên đội hỗ trợ chỉ cam kết kết nối tốt tới các điểm phát cách router chính <code>start</code> tối đa <code>k</code> bước.</p>
<p>Viết <code>devicesWithinHops(n, links, start, k)</code> trả về số điểm phát <b>khác chính router</b> tới được từ <code>start</code> bằng tối đa <code>k</code> liên kết. Mạng có thể không liên thông, và một liên kết có thể bị liệt kê hai lần.</p>`,
  dauVao: ['n — number of access points; links — array of [a, b]; start — router id; k — max hops (≥ 0).', 'n — số điểm phát; links — mảng [a, b]; start — id router; k — số bước tối đa (≥ 0).'],
  dauRa: ['A number.', 'Một số.'],
  rangBuoc: [['1 ≤ n ≤ 200 000; 0 ≤ links.length ≤ 300 000; 0 ≤ k ≤ n.', '1 ≤ n ≤ 200 000; 0 ≤ links.length ≤ 300 000; 0 ≤ k ≤ n.'], ['Target: O(n + links) time.', 'Mục tiêu: O(n + links) thời gian.']],
  goiY: [
    ['"Within k steps" is a question about shortest distance in an unweighted graph — that is exactly what BFS computes, layer by layer.', '"Trong k bước" là câu hỏi về khoảng cách ngắn nhất trên đồ thị không trọng số — đúng thứ BFS tính, từng tầng một.'],
    ['Build an adjacency list once (both directions). Keep <code>dist[]</code> initialised to −1; set <code>dist[v]</code> the moment you push v, and do not expand a node whose distance is already k.', 'Dựng danh sách kề một lần (cả hai chiều). Giữ <code>dist[]</code> khởi tạo −1; gán <code>dist[v]</code> ngay lúc đẩy v vào hàng đợi, và đừng mở rộng nút đã cách k bước.'],
  ],
  loi: [
    ['Finding neighbours by scanning the whole <code>links</code> array for every dequeued node: correct, but O(n · links) — the 150 000-node check times out.', 'Tìm hàng xóm bằng cách quét cả mảng <code>links</code> cho mỗi nút lấy ra: đúng, nhưng O(n · links) — kiểm 150 000 nút hết giờ.'],
    ['Marking visited when a node is DEQUEUED instead of enqueued: a node can enter the queue several times and gets counted twice (fails the triangle case).', 'Đánh dấu đã thăm lúc LẤY RA thay vì lúc ĐẨY VÀO: một nút có thể vào hàng đợi nhiều lần và bị đếm hai lần (trượt ca tam giác).'],
    ['Using <code>queue.shift()</code> on a huge array: in the worst case each shift moves the whole array; prefer a head index.', 'Dùng <code>queue.shift()</code> trên mảng rất lớn: trường hợp xấu mỗi lần shift dời cả mảng; nên dùng chỉ số đầu hàng (head).'],
  ],
  gt: ['BFS visits nodes in order of distance from <code>start</code>, so the first time we reach a node we know its shortest hop count. Setting <code>dist</code> at enqueue time guarantees every node is pushed at most once ⇒ each node and each adjacency entry is processed once: O(n + links) time, O(n + links) memory for the adjacency list. Stopping the expansion at distance k is what turns "reachable" into "reachable within k".', 'BFS thăm các nút theo thứ tự khoảng cách tới <code>start</code>, nên lần đầu chạm tới một nút ta biết luôn số bước ngắn nhất của nó. Gán <code>dist</code> lúc đẩy vào bảo đảm mỗi nút vào hàng đợi tối đa một lần ⇒ mỗi nút và mỗi mục kề xử lý một lần: O(n + links) thời gian, O(n + links) bộ nhớ cho danh sách kề. Dừng mở rộng ở khoảng cách k là thứ biến "tới được" thành "tới được trong k bước".'],
  kn: ['BFS', 'shortest path in unweighted graph'],
  tns: [tn('breadth-first search (BFS)', 'tìm kiếm theo chiều rộng'), tn('adjacency list', 'danh sách kề'), tn('hop', 'bước nhảy', 'một cạnh trên đường đi.'), tn('layer', 'tầng', 'các nút cùng khoảng cách tới nguồn.')],
  dau: `/**
 * n: number, links: [a, b][], start: number, k: number
 * returns how many access points (other than start) are at most k hops away
 */
function devicesWithinHops(n, links, start, k) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — BFS with an adjacency list, dist[] set at enqueue time, head index as the queue front.\n' + nguon(devicesWithinHops),
  cases: [
    { args: [6, [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5]], 0, 2], moTa: ['1, 4 (1 hop) and 2, 5 (2 hops) ⇒ 4', '1, 4 (1 bước) và 2, 5 (2 bước) ⇒ 4'] },
    { args: [3, [[0, 1], [1, 2], [0, 2]], 0, 1], moTa: ['Triangle: each neighbour counted once ⇒ 2', 'Tam giác: mỗi hàng xóm đếm một lần ⇒ 2'] },
    { args: [4, [[0, 1], [2, 3]], 0, 5], moTa: ['Disconnected network ⇒ 1', 'Mạng không liên thông ⇒ 1'] },
    { args: [5, [[0, 1], [1, 2]], 2, 0], an: true, moTa: ['k = 0 ⇒ 0', 'k = 0 ⇒ 0'] },
    { args: [1, [], 0, 3], an: true },
    { args: [5, [[0, 1], [0, 1], [1, 0], [1, 2], [2, 3], [3, 4]], 1, 2], an: true, moTa: ['Duplicate links', 'Liên kết lặp'] },
    { args: [7, [[3, 0], [3, 1], [3, 2], [0, 4], [1, 4], [2, 5], [5, 6], [4, 6]], 3, 2], an: true },
  ],
  perf: [{
    moTa: ['Performance: 150 000 access points, 200 000 links, k = 40 (scanning all links per node times out)', 'Hiệu năng: 150 000 điểm phát, 200 000 liên kết, k = 40 (quét mọi liên kết cho mỗi nút hết giờ)'],
    than: 'var n = 150000, L = []; for (var i = 1; i < n; i++) L.push([i, R(i)]); for (var j = 0; j < 50000; j++) L.push([R(n), R(n)]); return devicesWithinHops(n, L, 7, 40);',
  }],
  saiMau: [
    { ten: ['O(V·E): scan every link to find neighbours', 'O(V·E): quét mọi liên kết để tìm hàng xóm'], chiHieuNang: true, ma: 'function devicesWithinHops(n, links, start, k) {\n  var dist = new Array(n).fill(-1); dist[start] = 0;\n  var q = [start], h = 0, c = 0;\n  while (h < q.length) {\n    var u = q[h++]; if (dist[u] === k) continue;\n    for (var e of links) {\n      var v = e[0] === u ? e[1] : (e[1] === u ? e[0] : -1);\n      if (v < 0 || dist[v] !== -1) continue;\n      dist[v] = dist[u] + 1; c++; q.push(v);\n    }\n  }\n  return c;\n}\n' },
    { ten: ['Visited marked on dequeue, counted on enqueue', 'Đánh dấu khi lấy ra, đếm khi đẩy vào'], ma: 'function devicesWithinHops(n, links, start, k) {\n  var adj = Array.from({ length: n }, function () { return []; });\n  for (var e of links) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); }\n  var seen = new Array(n).fill(false), q = [[start, 0]], h = 0, c = 0;\n  while (h < q.length) {\n    var x = q[h++], u = x[0], d = x[1];\n    if (seen[u]) continue; seen[u] = true;\n    if (d === k) continue;\n    for (var v of adj[u]) if (!seen[v]) { q.push([v, d + 1]); c++; }\n  }\n  return c;\n}\n' },
  ],
});

/* ── 2. DFS bằng stack tường minh: phòng lớn nhất trên sơ đồ tầng ── */
function largestRoom(plan) {
  var R = plan.length, C = R ? plan[0].length : 0;
  var seen = new Uint8Array(R * C); // cell (r, c) -> index r * C + c
  var best = 0, stack = [];
  for (var r0 = 0; r0 < R; r0++) for (var c0 = 0; c0 < C; c0++) {
    if (plan[r0][c0] !== '.' || seen[r0 * C + c0]) continue;
    var area = 0;
    seen[r0 * C + c0] = 1; stack.push(r0 * C + c0);
    while (stack.length) { // explicit stack: no recursion, so a 250 000-cell room cannot overflow the call stack
      var id = stack.pop(), r = (id / C) | 0, c = id % C;
      area++;
      var nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
      for (var t = 0; t < 4; t++) {
        var rr = nb[t][0], cc = nb[t][1];
        if (rr < 0 || cc < 0 || rr >= R || cc >= C) continue;
        if (plan[rr][cc] !== '.' || seen[rr * C + cc]) continue;
        seen[rr * C + cc] = 1; // mark when pushed
        stack.push(rr * C + cc);
      }
    }
    if (area > best) best = area;
  }
  return best;
}
const E2 = bai({
  ten: 'Floor plan: the largest connected room', kho: 'MEDIUM', phut: 20, ham: 'largestRoom',
  en: `<p>The facilities office scanned the floor plan of the new Beta building into a grid of strings: <code>'.'</code> is floor, <code>'#'</code> is a wall. Two floor cells belong to the same room when they touch <b>horizontally or vertically</b> (diagonal touching does not count — you cannot walk through the corner of two walls).</p>
<p>Write <code>largestRoom(plan)</code> that returns the number of floor cells in the largest room, or 0 if there is no floor at all.</p>
<p><b>Size warning:</b> plans go up to 700 × 700, and one corridor-shaped room can contain about 250 000 cells. A recursive DFS goes that many calls deep and overflows the call stack (<code>RangeError: Maximum call stack size exceeded</code>) — use an explicit stack or a queue.</p>`,
  vi: `<p>Phòng hành chính quét sơ đồ tầng toà Beta mới thành lưới chuỗi: <code>'.'</code> là sàn, <code>'#'</code> là tường. Hai ô sàn thuộc cùng một phòng khi chúng chạm nhau <b>theo hàng ngang hoặc hàng dọc</b> (chạm chéo không tính — không ai đi xuyên qua góc giữa hai bức tường).</p>
<p>Viết <code>largestRoom(plan)</code> trả về số ô sàn của phòng lớn nhất, hoặc 0 nếu không có ô sàn nào.</p>
<p><b>Cảnh báo kích thước:</b> sơ đồ tới 700 × 700, và một phòng hình hành lang có thể chứa khoảng 250 000 ô. DFS đệ quy sẽ lồng sâu ngần ấy lời gọi và tràn ngăn xếp gọi hàm (<code>RangeError: Maximum call stack size exceeded</code>) — hãy dùng stack tường minh hoặc hàng đợi.</p>`,
  dauVao: ['plan — array of equal-length strings made of "." and "#".', 'plan — mảng chuỗi cùng độ dài gồm "." và "#".'],
  dauRa: ['A number — the size of the largest room.', 'Một số — kích thước phòng lớn nhất.'],
  rangBuoc: [['0 ≤ rows, cols ≤ 700.', '0 ≤ số hàng, số cột ≤ 700.'], ['Target: O(rows · cols) time; no recursion deeper than a few thousand calls.', 'Mục tiêu: O(hàng · cột) thời gian; không đệ quy sâu quá vài nghìn lời gọi.']],
  goiY: [
    ['Every floor cell belongs to exactly one room. Loop over all cells; each unvisited floor cell starts a flood fill that counts its room.', 'Mỗi ô sàn thuộc đúng một phòng. Duyệt mọi ô; mỗi ô sàn chưa thăm bắt đầu một lượt loang (flood fill) đếm phòng của nó.'],
    ['Do the flood fill with your own array as a stack: push the start cell, then pop → count → push its unvisited floor neighbours. Mark a cell when you push it.', 'Làm loang bằng một mảng tự quản làm stack: đẩy ô đầu, rồi lấy ra → đếm → đẩy các hàng xóm là sàn chưa thăm. Đánh dấu ô lúc đẩy vào.'],
  ],
  loi: [
    ['Recursive DFS: fine on small plans, but the 700 × 700 snake-shaped corridor needs ~250 000 nested calls ⇒ stack overflow.', 'DFS đệ quy: ổn với sơ đồ nhỏ, nhưng hành lang ngoằn ngoèo 700 × 700 cần ~250 000 lời gọi lồng nhau ⇒ tràn ngăn xếp.'],
    ['Counting diagonal neighbours: two rooms that only touch at a corner get merged.', 'Tính cả hàng xóm chéo: hai phòng chỉ chạm nhau ở góc bị gộp làm một.'],
    ['Marking a cell visited only when it is popped: the same cell can be pushed by two neighbours and counted twice.', 'Chỉ đánh dấu khi lấy ra: cùng một ô có thể bị hai hàng xóm đẩy vào và đếm hai lần.'],
  ],
  gt: ['Each floor cell is pushed exactly once (it is marked at push time) and popped once, and each pop looks at 4 neighbours ⇒ O(rows · cols) time and O(rows · cols) memory for the visited array and the stack. An explicit stack keeps the same DFS order without using the engine\'s call stack, whose depth limit (roughly 10⁴ frames) is far below the 2.5·10⁵ cells of the longest room. Encoding a cell as <code>r * cols + c</code> avoids allocating a pair per cell.', 'Mỗi ô sàn được đẩy đúng một lần (đánh dấu lúc đẩy) và lấy ra một lần, mỗi lần lấy ra xét 4 hàng xóm ⇒ O(hàng · cột) thời gian và O(hàng · cột) bộ nhớ cho mảng đã thăm và stack. Stack tường minh giữ đúng thứ tự DFS mà không dùng ngăn xếp gọi hàm của engine, vốn chỉ sâu cỡ 10⁴ khung — kém xa 2,5·10⁵ ô của phòng dài nhất. Mã hoá ô thành <code>r * cols + c</code> tránh phải tạo một cặp cho mỗi ô.'],
  kn: ['DFS', 'flood fill', 'connected components on a grid'],
  tns: [tn('flood fill', 'loang', 'tô hết vùng liên thông từ một ô.'), tn('connected component', 'thành phần liên thông'), tn('call stack', 'ngăn xếp gọi hàm'), tn('stack overflow', 'tràn ngăn xếp')],
  dau: `/**
 * plan: string[] — "." floor, "#" wall
 * returns the number of cells in the largest 4-directionally connected room (0 if none)
 */
function largestRoom(plan) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — flood fill with an explicit stack (no recursion), cells encoded as r * C + c.\n' + nguon(largestRoom),
  cases: [
    { args: [['..#..', '..#..', '###..', '#....']], moTa: ['Two rooms: 4 cells and 9 cells ⇒ 9', 'Hai phòng: 4 ô và 9 ô ⇒ 9'] },
    { args: [['.#', '#.']], moTa: ['Diagonal touching is not a connection ⇒ 1', 'Chạm chéo không tính là nối ⇒ 1'] },
    { args: [['###', '###']], moTa: ['No floor ⇒ 0', 'Không có sàn ⇒ 0'] },
    { args: [[]], an: true },
    { args: [['.']], an: true },
    { args: [['.....', '.###.', '.#.#.', '.###.', '.....']], an: true, moTa: ['A ring around a 1-cell room ⇒ 16', 'Vòng bao quanh phòng 1 ô ⇒ 16'] },
    { args: [['..#...#..', '#.#.#.#.#', '..#.#....']], an: true },
  ],
  perf: [{
    moTa: ['Performance: 700 × 700 snake corridor of ~245 000 cells (recursive DFS overflows the stack)', 'Hiệu năng: hành lang hình rắn 700 × 700 khoảng 245 000 ô (DFS đệ quy tràn ngăn xếp)'],
    than: 'var N = 700, rows = []; for (var r = 0; r < N; r++) { if (r % 2 === 0) rows.push(".".repeat(N)); else { var gap = (r % 4 === 1) ? N - 1 : 0; var s = ""; for (var c = 0; c < N; c++) s += c === gap ? "." : "#"; rows.push(s); } } var small = []; for (var i = 0; i < 60; i++) { var t = ""; for (var j = 0; j < 60; j++) t += R(3) ? "." : "#"; small.push(t); } return [largestRoom(rows), largestRoom(small)];',
  }],
  saiMau: [
    { ten: ['Recursive DFS (stack overflow on the big corridor)', 'DFS đệ quy (tràn ngăn xếp ở hành lang lớn)'], chiHieuNang: true, ma: 'function largestRoom(plan) {\n  var R = plan.length, C = R ? plan[0].length : 0, seen = new Set(), best = 0;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= R || c >= C || plan[r][c] !== "." || seen.has(r * C + c)) return 0;\n    seen.add(r * C + c);\n    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);\n  }\n  for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) best = Math.max(best, dfs(r, c));\n  return best;\n}\n' },
    { ten: ['8 directions (diagonals merge rooms)', '8 hướng (đường chéo gộp phòng)'], ma: 'function largestRoom(plan) {\n  var R = plan.length, C = R ? plan[0].length : 0, seen = new Uint8Array(R * C), best = 0;\n  for (var i = 0; i < R; i++) for (var j = 0; j < C; j++) {\n    if (plan[i][j] !== "." || seen[i * C + j]) continue;\n    var st = [[i, j]], a = 0; seen[i * C + j] = 1;\n    while (st.length) { var p = st.pop(); a++;\n      for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) { var r = p[0] + dr, c = p[1] + dc;\n        if (r >= 0 && c >= 0 && r < R && c < C && plan[r][c] === "." && !seen[r * C + c]) { seen[r * C + c] = 1; st.push([r, c]); } } }\n    best = Math.max(best, a);\n  }\n  return best;\n}\n' },
  ],
});

/* ── 3. BFS trên tuyến: ít chuyến xe đưa đón nhất ── */
function fewestShuttles(routes, from, to) {
  if (from === to) return 0;
  var byStop = new Map(); // stop -> indexes of routes that stop there
  for (var i = 0; i < routes.length; i++) for (var j = 0; j < routes[i].length; j++) {
    var s = routes[i][j];
    if (!byStop.has(s)) byStop.set(s, []);
    byStop.get(s).push(i);
  }
  var usedRoute = new Uint8Array(routes.length), seenStop = new Set([from]);
  var queue = (byStop.get(from) || []).slice(), head = 0, level = 1;
  for (var q = 0; q < queue.length; q++) usedRoute[queue[q]] = 1;
  while (head < queue.length) {
    var end = queue.length; // one BFS layer = all routes reachable with `level` rides
    for (; head < end; head++) {
      var stops = routes[queue[head]];
      for (var k = 0; k < stops.length; k++) {
        var st = stops[k];
        if (st === to) return level;
        if (seenStop.has(st)) continue;
        seenStop.add(st);
        var rs = byStop.get(st);
        for (var t = 0; t < rs.length; t++) if (!usedRoute[rs[t]]) { usedRoute[rs[t]] = 1; queue.push(rs[t]); } // each route expanded ONCE
      }
    }
    level++;
  }
  return -1;
}
const E3 = bai({
  ten: 'Campus shuttles: the fewest rides between two stops', kho: 'HARD', phut: 30, ham: 'fewestShuttles',
  en: `<p>FPT's shuttle buses run fixed loops: <code>routes[i]</code> is the list of stops (numbers) bus line <code>i</code> visits, and a bus goes back and forth along its line forever, so you can ride it between any two of its stops. You can change lines at any stop that both lines serve.</p>
<p>Write <code>fewestShuttles(routes, from, to)</code>: the minimum number of <b>buses you have to board</b> to travel from stop <code>from</code> to stop <code>to</code>. Return 0 when <code>from === to</code> and −1 when it is impossible. Walking is not allowed.</p>`,
  vi: `<p>Xe đưa đón của FPT chạy các tuyến cố định: <code>routes[i]</code> là danh sách trạm (số) mà tuyến <code>i</code> đi qua, và xe chạy đi chạy lại mãi trên tuyến, nên bạn đi được giữa hai trạm bất kỳ của tuyến đó. Bạn đổi tuyến được ở trạm mà cả hai tuyến cùng dừng.</p>
<p>Viết <code>fewestShuttles(routes, from, to)</code>: số <b>chuyến xe ít nhất phải lên</b> để đi từ trạm <code>from</code> tới trạm <code>to</code>. Trả 0 khi <code>from === to</code> và −1 khi không thể. Không được đi bộ.</p>`,
  dauVao: ['routes — array of arrays of stop numbers (no duplicate stop inside one route); from, to — stop numbers.', 'routes — mảng các mảng số trạm (trong một tuyến không lặp trạm); from, to — số trạm.'],
  dauRa: ['The number of buses, 0, or −1.', 'Số chuyến xe, 0, hoặc −1.'],
  rangBuoc: [['1 ≤ routes.length ≤ 500; total number of stop entries ≤ 600 000; stop numbers up to 10⁹.', '1 ≤ routes.length ≤ 500; tổng số mục trạm ≤ 600 000; số trạm tới 10⁹.'], ['Target: O(total stop entries).', 'Mục tiêu: O(tổng số mục trạm).']],
  goiY: [
    ['The answer counts <i>buses</i>, not stops. Think of each route as a node: two routes are adjacent when they share a stop. Then it is a shortest path in an unweighted graph ⇒ BFS.', 'Đáp án đếm <i>chuyến xe</i>, không đếm trạm. Coi mỗi tuyến là một nút: hai tuyến kề nhau khi có chung một trạm. Khi đó là đường ngắn nhất trên đồ thị không trọng số ⇒ BFS.'],
    ['Do not build route–route edges pairwise. Keep <code>stop → routes</code> in a Map; BFS over routes layer by layer, and when you expand a route walk its stops, enqueuing the not-yet-used routes of each new stop. Mark both routes and stops so each is expanded once.', 'Đừng dựng cạnh tuyến–tuyến theo từng cặp. Giữ Map <code>trạm → các tuyến</code>; BFS trên tuyến theo từng tầng, mở rộng một tuyến thì đi qua các trạm của nó, đẩy các tuyến chưa dùng của mỗi trạm mới. Đánh dấu cả tuyến lẫn trạm để mỗi thứ chỉ mở rộng một lần.'],
  ],
  loi: [
    ['BFS over stops where every stop re-reads all stops of all its routes: the same long route is scanned once per stop ⇒ O(Σ len²), too slow for 1 500-stop lines.', 'BFS trên trạm mà mỗi trạm đọc lại mọi trạm của mọi tuyến của nó: cùng một tuyến dài bị quét một lần cho mỗi trạm ⇒ O(Σ độ dài²), quá chậm với tuyến 1 500 trạm.'],
    ['Counting stops (or edges between stops) instead of boardings: riding three stops on the same bus is still ONE bus.', 'Đếm trạm (hoặc cạnh giữa trạm) thay vì số lần lên xe: đi ba trạm trên cùng một xe vẫn là MỘT chuyến.'],
    ['Forgetting <code>from === to</code> ⇒ 0, or crashing when <code>from</code> is not served by any route (should return −1).', 'Quên <code>from === to</code> ⇒ 0, hoặc lỗi khi <code>from</code> không có tuyến nào dừng (phải trả −1).'],
  ],
  gt: ['Modelling matters more than the search: the cost is "number of boardings", so the nodes of the BFS are routes. Layer 1 is every route through <code>from</code>; a route in layer d is reached with d rides. Because each route is enqueued once (<code>usedRoute</code>) and each stop is expanded once (<code>seenStop</code>), every stop entry is touched a constant number of times ⇒ O(total stop entries) time and memory. Building explicit route–route edges would cost O(routes² · length) just to compare lines.', 'Mô hình hoá quan trọng hơn thuật toán tìm: chi phí là "số lần lên xe", nên nút của BFS là tuyến. Tầng 1 là mọi tuyến qua <code>from</code>; tuyến ở tầng d tới được bằng d chuyến. Vì mỗi tuyến vào hàng đợi một lần (<code>usedRoute</code>) và mỗi trạm mở rộng một lần (<code>seenStop</code>), mỗi mục trạm chỉ bị chạm hằng số lần ⇒ O(tổng số mục trạm) thời gian và bộ nhớ. Dựng cạnh tuyến–tuyến tường minh sẽ tốn O(tuyến² · độ dài) chỉ để so các tuyến.'],
  kn: ['BFS', 'graph modelling', 'shortest path on an implicit graph'],
  tns: [tn('implicit graph', 'đồ thị ngầm', 'đồ thị không cho sẵn cạnh, phải tự suy ra.'), tn('boarding', 'lần lên xe'), tn('layer-by-layer BFS', 'BFS theo từng tầng')],
  dau: `/**
 * routes: number[][] — stops of each bus line; from, to: stop numbers
 * returns the minimum number of buses to board, 0 if from === to, -1 if impossible
 */
function fewestShuttles(routes, from, to) {
  // Write your solution here
  return -1;
}
`,
  giai: '// Reference solution — BFS whose nodes are ROUTES; stop -> routes map; each route and each stop expanded once.\n' + nguon(fewestShuttles),
  cases: [
    { args: [[[1, 2, 7], [3, 6, 7]], 1, 6], moTa: ['Ride line 0 to stop 7, change to line 1 ⇒ 2', 'Đi tuyến 0 tới trạm 7, đổi sang tuyến 1 ⇒ 2'] },
    { args: [[[1, 2, 3, 4, 5]], 1, 5], moTa: ['Same bus all the way ⇒ 1', 'Một xe đi suốt ⇒ 1'] },
    { args: [[[1, 2], [3, 4]], 1, 4], moTa: ['No shared stop ⇒ −1', 'Không có trạm chung ⇒ −1'] },
    { args: [[[1, 2]], 9, 9], an: true, moTa: ['from === to ⇒ 0', 'from === to ⇒ 0'] },
    { args: [[[1, 2]], 9, 2], an: true, moTa: ['Start stop served by no line ⇒ −1', 'Trạm xuất phát không có tuyến nào ⇒ −1'] },
    { args: [[[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12], an: true },
    { args: [[[1, 10], [10, 20], [20, 30], [30, 40], [1, 40]], 1, 30], an: true, moTa: ['A shortcut line beats the long chain ⇒ 2', 'Tuyến tắt thắng chuỗi dài ⇒ 2'] },
    { args: [[[1, 2, 3], [3, 4, 5], [5, 6, 1]], 2, 6], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 lines × 1 500 stops chained end to end (re-scanning a line per stop times out)', 'Hiệu năng: 200 tuyến × 1 500 trạm nối nối tiếp (quét lại cả tuyến cho mỗi trạm hết giờ)'],
    than: 'var routes = []; for (var i = 0; i < 200; i++) { var r = [i, i + 1]; for (var j = 0; j < 1498; j++) r.push(1000 + i * 100000 + j * 37 + R(30)); routes.push(r); } return [fewestShuttles(routes, 0, 200), fewestShuttles(routes, 0, 999999999)];',
  }],
  saiMau: [
    { ten: ['BFS over stops, re-reading whole lines for every stop', 'BFS trên trạm, đọc lại cả tuyến cho mỗi trạm'], chiHieuNang: true, ma: 'function fewestShuttles(routes, from, to) {\n  if (from === to) return 0;\n  var by = new Map();\n  routes.forEach(function (r, i) { r.forEach(function (s) { if (!by.has(s)) by.set(s, []); by.get(s).push(i); }); });\n  var dist = new Map([[from, 0]]), q = [from], h = 0;\n  while (h < q.length) {\n    var s = q[h++];\n    for (var ri of by.get(s) || []) for (var t of routes[ri]) {\n      if (dist.has(t)) continue;\n      dist.set(t, dist.get(s) + 1);\n      if (t === to) return dist.get(t);\n      q.push(t);\n    }\n  }\n  return -1;\n}\n' },
  ],
});

export default mod('dsa-7-2-bfs-dfs', '7.2 BFS & DFS: layers, flood fill, implicit graphs', [E1, E2, E3]);
