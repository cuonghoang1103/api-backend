/** 7.2 — BFS và DFS. Mọi mã/output đọc từ ../ma/ch07 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay, doc } from '../_chung.mjs';
import { oLuoi, oDay } from './_rieng.mjs';
import { vetBfs, vetIslands, vetRotting } from '../ma/ch07/bfs-dfs.vet.mjs';

/* Bảng vết 1: BFS trên đồ thị 7 đỉnh. */
const ADJ = [[1, 2], [0, 3], [0, 3, 6], [1, 2, 4], [3, 5], [4], [2]];
const vb = vetBfs(ADJ, 0);
const BANG_BFS = bangVet(['dequeue', 'adj[u]', 'newly discovered', 'queue after (front = left)', 'dist[0..6]'],
  vb.map((h) => [
    `<strong>${h.u}</strong>`,
    `<code>[${ADJ[h.u].join(', ')}]</code>`,
    h.moi.length ? h.moi.map((v) => `${v} (d=${h.dist[v]})`).join(', ') : '—',
    oDay(h.cho),
    oMang(h.dist.map((d) => (d === -1 ? '·' : d)), { to: Object.fromEntries(h.moi.map((v) => [v, 'ok']).concat([[h.u, 'l']])) }),
  ]));

/* Bảng vết 2: đếm đảo, mỗi đảo một hàng. */
const G2 = ['11000', '11000', '00100', '00011'];
const vi = vetIslands(G2);
const BANG_DAO = bangVet(['island #', 'first cell', 'cells sunk (DFS order)', 'grid after'],
  vi.map((h) => [
    `<strong>${h.dem}</strong>`,
    `<code>(${h.bd})</code>`,
    h.chim.map((x) => `(${x})`).join(' '),
    oLuoi(h.luoi, { to: Object.fromEntries(h.chim.map((x) => [x, 'x'])) }),
  ]));

/* Bảng vết 3: cam thối, mỗi phút một hàng. */
const ROT = [[2, 1, 1], [1, 1, 0], [0, 1, 1]];
const vr = vetRotting(ROT);
const BANG_CAM = bangVet(['minute', 'newly rotten (= this BFS level)', 'grid (2 rotten · 1 fresh · 0 empty)', 'fresh left'],
  vr.map((h) => [
    String(h.phut),
    h.moi.length ? h.moi.map((x) => `(${x})`).join(' ') : '— (queue empty)',
    oLuoi(h.luoi, { to: Object.fromEntries(h.moi.map((x) => [x, h.phut === 0 ? 'x' : 'r'])) }),
    String(h.fresh),
  ]));
const PHUT = vr[vr.length - 1].phut;

/* Số đo độ sâu đệ quy (đọc từ .out — số đổi theo lần đo, chữ đổi theo). */
const OUT_TS = doc('ch07/dfs-sau-do.ts.out');
const OUT_J = doc('ch07/DfsSauDo.java.out');
const sauTs = OUT_TS.match(/1st call: \w+ at depth ([\d,]+)/)[1];
const sauTs2 = OUT_TS.match(/2nd call: \w+ at depth ([\d,]+)/)[1];
const lapTs = OUT_TS.match(/iterative DFS \(own stack\): [\d,]+ cells in ([\d.]+) ms/)[1];
const sauJ2m = OUT_J.match(/2,048 KB thread stack: \w+ at depth ([\d,]+)/)[1];
const sauJ8m = OUT_J.match(/8,192 KB thread stack: \w+ at depth ([\d,]+)/)[1];
const viSo = (s) => s.replace(/,/g, '.');

const DE = [
  [lc(200, 'number-of-islands', 'Number of Islands', 'Medium'), 'Count how many times a traversal STARTS; the traversal sinks one island.', 'Đếm số lần một lượt duyệt BẮT ĐẦU; mỗi lượt duyệt nhấn chìm một hòn đảo.'],
  [lc(994, 'rotting-oranges', 'Rotting Oranges', 'Medium'), 'Many sources spreading at the same speed ⇒ put them all in the queue at time 0.', 'Nhiều nguồn lan cùng tốc độ ⇒ cho tất cả vào hàng đợi ở thời điểm 0.'],
  [lc(133, 'clone-graph', 'Clone Graph', 'Medium'), 'A Map original → copy is both the visited set and the way to wire copies together.', 'Map gốc → bản sao vừa là tập đã thăm vừa là cách nối các bản sao với nhau.'],
  [lc(417, 'pacific-atlantic-water-flow', 'Pacific Atlantic Water Flow', 'Medium'), 'Search backwards from the borders (climb uphill), intersect two visited sets.', 'Tìm ngược từ biên (leo dốc lên), giao hai tập đã thăm.'],
  [lc(130, 'surrounded-regions', 'Surrounded Regions', 'Medium'), 'Same reverse trick: mark every O connected to the border first, flip the rest.', 'Cùng mẹo đi ngược: đánh dấu mọi O nối với biên trước, lật phần còn lại.'],
  [lc(1091, 'shortest-path-in-binary-matrix', 'Shortest Path in Binary Matrix', 'Medium'), 'Unweighted shortest path in a grid, 8 directions ⇒ plain BFS (solved in lesson 3.2).', 'Đường ngắn nhất không trọng số trên lưới 8 hướng ⇒ BFS thường (đã giải ở bài 3.2).'],
  [lc(785, 'is-graph-bipartite', 'Is Graph Bipartite?', 'Medium'), 'BFS colouring: every edge must join two different colours; the graph may be disconnected.', 'Tô màu bằng BFS: mọi cạnh phải nối hai màu khác nhau; đồ thị có thể không liên thông.'],
  [lc(752, 'open-the-lock', 'Open the Lock', 'Medium'), 'Implicit graph of 10⁴ states, 8 neighbours each; dead ends are pre-visited nodes.', 'Đồ thị ngầm 10⁴ trạng thái, mỗi trạng thái 8 láng giềng; ô chết = đỉnh coi như đã thăm sẵn.'],
  [lc(127, 'word-ladder', 'Word Ladder', 'Hard'), 'Words are nodes; generate neighbours by changing one letter (26·L), BFS by levels.', 'Từ là đỉnh; sinh láng giềng bằng cách đổi một chữ (26·L), BFS theo tầng.'],
  [lc(286, 'walls-and-gates', 'Walls and Gates', 'Medium', { premium: true }), 'Premium. Free equivalent: LintCode 663 — multi-source BFS from every gate.', 'Premium. Bản miễn phí tương đương: LintCode 663 — BFS nhiều nguồn từ mọi cổng.'],
];

export default {
  title: '7.2 — BFS and DFS: islands, multi-source spreading, shortest paths without weights|||7.2 — BFS và DFS: đếm đảo, lan truyền nhiều nguồn, đường ngắn nhất không trọng số',
  slug: 'dsa-7-2-bfs-dfs',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai cách đi một đồ thị và khi nào chọn cách nào: đếm đảo, cam thối (BFS nhiều nguồn), sao chép đồ thị, nước chảy hai đại dương, word ladder — kèm số đo DFS đệ quy sập ở độ sâu nào trên Node và Java, và bẫy đánh dấu đã thăm sai lúc.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>BFS and DFS: islands, multi-source spreading, shortest paths without weights</h2>
<p class="lead">There are only two ways to walk a graph, and most graph interview problems are one of them plus a twist. <strong>BFS</strong> (breadth-first search) explores in rings of increasing distance with a queue, so it answers "fewest steps". <strong>DFS</strong> (depth-first search) dives as far as it can with a stack or recursion, so it is the shortest code for "visit everything connected". This lesson shows both on the same graph, then the six twists interviewers love: counting components, many sources at once, cloning, searching backwards from the border, implicit graphs, and the crash that recursion causes on a large grid — measured.</p>

<h3>The everyday picture</h3>
<p><strong>BFS is gossip.</strong> You tell your news to everyone at your table (distance 1). Each of them tells everyone at their tables (distance 2), and so on. Nobody hears it at "distance 3" before everybody at distance 2 has heard it — so the round in which someone first hears it <em>is</em> their distance from you. <strong>DFS is exploring a building with a ball of thread.</strong> You take the first corridor, then the first door, then the first stairs, as deep as you can go; at a dead end you follow the thread back to the last place that had an unexplored door. You will explore everything, but the order says nothing about distance.</p>
<p>Formally both visit every node reachable from the start exactly once, in <strong>O(V + E)</strong> time with an adjacency list (each node is taken out once, each edge is looked at once from each end). They differ only in the container: a <strong>queue</strong> (first in, first out) for BFS, a <strong>stack</strong> (last in, first out — or the call stack of recursion) for DFS. The visited mark is what turns "walking" into "visiting once".</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>BFS và DFS: đếm đảo, lan truyền nhiều nguồn, đường ngắn nhất không trọng số</h2>
<p class="lead">Chỉ có hai cách đi một đồ thị, và phần lớn đề đồ thị khi phỏng vấn là một trong hai cách đó cộng thêm một chút biến tấu. <strong>BFS</strong> (breadth-first search — tìm kiếm theo chiều rộng) đi theo từng vòng khoảng cách tăng dần bằng một hàng đợi, nên nó trả lời được "ít bước nhất". <strong>DFS</strong> (depth-first search — tìm kiếm theo chiều sâu) lao xa nhất có thể bằng stack hoặc đệ quy, nên nó là đoạn code ngắn nhất cho "thăm mọi thứ nối với nhau". Bài này cho thấy cả hai trên cùng một đồ thị, rồi tới sáu kiểu biến tấu người phỏng vấn thích: đếm thành phần liên thông, nhiều nguồn cùng lúc, sao chép đồ thị, tìm ngược từ biên, đồ thị ngầm, và cú sập mà đệ quy gây ra trên lưới lớn — đo bằng số.</p>

<h3>Hình dung đời thường</h3>
<p><strong>BFS là tin đồn.</strong> Bạn kể tin cho cả bàn của mình (khoảng cách 1). Mỗi người trong bàn lại kể cho cả bàn của họ (khoảng cách 2), và cứ thế. Không ai ở "khoảng cách 3" nghe được tin trước khi mọi người ở khoảng cách 2 đã nghe — nên vòng mà một người lần đầu nghe tin <em>chính là</em> khoảng cách từ bạn tới họ. <strong>DFS là đi khám phá toà nhà với cuộn chỉ.</strong> Bạn rẽ vào hành lang đầu tiên, rồi cánh cửa đầu tiên, rồi cầu thang đầu tiên, đi sâu nhất có thể; tới ngõ cụt thì lần theo sợi chỉ quay về chỗ gần nhất còn cửa chưa mở. Bạn sẽ khám phá hết, nhưng thứ tự đi không nói gì về khoảng cách.</p>
<p>Nói cho chuẩn: cả hai thăm mọi đỉnh tới được từ điểm xuất phát đúng một lần, tốn <strong>O(V + E)</strong> thời gian với danh sách kề (mỗi đỉnh được lấy ra một lần, mỗi cạnh được nhìn một lần từ mỗi đầu). Chúng chỉ khác nhau ở cái thùng chứa: <strong>hàng đợi</strong> (queue — vào trước ra trước) cho BFS, <strong>ngăn xếp</strong> (stack — vào sau ra trước, hoặc chính call stack của đệ quy) cho DFS. Dấu "đã thăm" (visited) là thứ biến "đi lang thang" thành "thăm mỗi nơi một lần".</p>
${csd('csd201-bfs', 'vi', '5.4 BFS &amp; đường đi ngắn nhất không trọng số', '<p>CSD201 đã dạy BFS bằng hàng đợi và vì sao nó cho đường ngắn nhất khi cạnh không có trọng số. <strong>Ở đây đi sâu thêm:</strong> BFS nhiều nguồn, BFS theo tầng để đếm phút/bước, tìm ngược từ biên, đồ thị ngầm (word ladder), và mẹo dùng chỉ số đầu hàng trong TypeScript.</p>')}
${csd('csd201-dfs', 'vi', '5.3 DFS: chu trình, thành phần liên thông, tô-pô', '<p>CSD201 đã dạy DFS đệ quy, đếm thành phần liên thông và phát hiện chu trình. <strong>Ở đây đi sâu thêm:</strong> DFS trên lưới (đếm đảo), khi nào đệ quy làm sập chương trình — đo thật trên lưới 1000 × 1000 với Node và Java — và cách viết DFS lặp bằng stack tự quản. Phần chu trình và tô-pô để dành cho bài 7.3.</p>')}
</div>

<div class="ml-en">
<h3>Signals: BFS or DFS?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"minimum number of steps / moves / minutes", edges have no weights</span><span class="v">BFS. It is the only one of the two that finds shortest paths.</span></div>
  <div class="kv"><span class="k">"how many groups / islands / provinces", "size of the largest region"</span><span class="v">Either; DFS is shorter to write. Count how many times a traversal starts.</span></div>
  <div class="kv"><span class="k">"spreads from several places at the same time" (rot, fire, infection, gates)</span><span class="v">Multi-source BFS: every source in the queue at time 0.</span></div>
  <div class="kv"><span class="k">"which cells can reach the border / the ocean / an exit"</span><span class="v">Search backwards: start from the border once, instead of from every cell.</span></div>
  <div class="kv"><span class="k">"transform A into B one change at a time"</span><span class="v">Implicit graph of states, BFS by levels; generate neighbours instead of comparing all pairs.</span></div>
  <div class="kv"><span class="k">"all paths", "every arrangement", "detect a cycle / order dependencies"</span><span class="v">DFS (backtracking in Chapter 8, cycles and topological order in lesson 7.3).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: BFS hay DFS?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"số bước / số nước / số phút ít nhất", cạnh không có trọng số</span><span class="v">BFS. Trong hai cách, chỉ nó tìm được đường ngắn nhất.</span></div>
  <div class="kv"><span class="k">"có bao nhiêu nhóm / đảo / tỉnh", "vùng lớn nhất rộng bao nhiêu"</span><span class="v">Cách nào cũng được; DFS viết ngắn hơn. Đếm số lần một lượt duyệt bắt đầu.</span></div>
  <div class="kv"><span class="k">"lan ra từ nhiều chỗ cùng một lúc" (thối, cháy, lây nhiễm, cổng)</span><span class="v">BFS nhiều nguồn (multi-source BFS): mọi nguồn vào hàng đợi ở thời điểm 0.</span></div>
  <div class="kv"><span class="k">"ô nào tới được biên / đại dương / lối ra"</span><span class="v">Tìm ngược: xuất phát từ biên một lần, thay vì từ từng ô.</span></div>
  <div class="kv"><span class="k">"biến A thành B, mỗi lần đổi một chút"</span><span class="v">Đồ thị ngầm các trạng thái, BFS theo tầng; sinh láng giềng thay vì so mọi cặp.</span></div>
  <div class="kv"><span class="k">"mọi đường đi", "mọi cách sắp xếp", "phát hiện chu trình / thứ tự phụ thuộc"</span><span class="v">DFS (quay lui ở Chương 8, chu trình và thứ tự tô-pô ở bài 7.3).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Same graph, two orders</h3>
<p>Seven nodes: 0–1, 0–2, 1–3, 2–3, 3–4, 4–5, 2–6. The program runs BFS from 0 (recording each node's distance and the node it was discovered from, its <strong>parent</strong>), rebuilds the shortest path 0 → 5 by walking parents backwards, then runs a recursive DFS.</p>
</div>
<div class="ml-vi">
<h3>Cùng một đồ thị, hai thứ tự</h3>
<p>Bảy đỉnh: 0–1, 0–2, 1–3, 2–3, 3–4, 4–5, 2–6. Chương trình chạy BFS từ 0 (ghi khoảng cách của từng đỉnh và đỉnh đã phát hiện ra nó — gọi là <strong>cha</strong>, parent), dựng lại đường ngắn nhất 0 → 5 bằng cách lần ngược theo cha, rồi chạy một DFS đệ quy.</p>
</div>
${maHai('ch07/bfs-dfs-thu-tu.ts', 'ch07/BfsDfsThuTu.java', { vung: 'bfs' })}
${maHai('ch07/bfs-dfs-thu-tu.ts', 'ch07/BfsDfsThuTu.java', { vung: 'dfs' })}
${ketQua('ch07/bfs-dfs-thu-tu.ts')}
${ketQua('ch07/BfsDfsThuTu.java')}
<div class="ml-en">
<p>Each row below is one dequeue. Blue = the node being dequeued; green = nodes discovered in this row, with the distance just written. Read the queue column: at every moment it holds nodes of at most <strong>two consecutive distances</strong>, d then d + 1, in that order. That invariant is the whole proof that BFS gives shortest paths: a node is discovered from a node one closer to the source, and nothing farther can jump the line.</p>
</div>
<div class="ml-vi">
<p>Mỗi hàng dưới đây là một lần lấy ra khỏi hàng đợi. Ô xanh dương = đỉnh đang được lấy ra; ô xanh lá = các đỉnh vừa được phát hiện ở hàng này, kèm khoảng cách vừa ghi. Đọc cột hàng đợi: ở mọi thời điểm nó chỉ chứa các đỉnh thuộc tối đa <strong>hai khoảng cách liên tiếp</strong>, d rồi d + 1, theo đúng thứ tự đó. Bất biến (invariant) đó chính là toàn bộ chứng minh BFS cho đường ngắn nhất: một đỉnh được phát hiện từ một đỉnh gần nguồn hơn đúng một bước, và không đỉnh nào xa hơn chen lên trước được.</p>
</div>
${BANG_BFS}
<div class="ml-en">
<p>BFS order 0, 1, 2, 3, 6, 4, 5 is sorted by distance (0, 1, 1, 2, 2, 3, 4). DFS order 0, 1, 3, 2, 6, 4, 5 is not: DFS reached 2 through 1 → 3 → 2, a path of length 3, although 2 is a direct neighbour of 0. That is why <strong>DFS must never be used for "shortest" on its own</strong> — it finds <em>a</em> path, not the shortest one. Notice also that 3 got its distance from 1 (row "dequeue 1"), not from 2: whoever discovers a node first sets its distance, and BFS guarantees that the first discoverer is one of the closest.</p>
${moPhong('ch07/bfs-levels.sim.js', 'en', 'BFS layer by layer, then DFS diving — same graph', 'Watch distances appear on the nodes ring by ring, then the second panel shows recursive DFS going 0 → 1 → 3 → 2 before it ever reaches 4.')}
</div>
<div class="ml-vi">
<p>Thứ tự BFS 0, 1, 2, 3, 6, 4, 5 được sắp theo khoảng cách (0, 1, 1, 2, 2, 3, 4). Thứ tự DFS 0, 1, 3, 2, 6, 4, 5 thì không: DFS tới 2 qua đường 1 → 3 → 2, dài 3 cạnh, dù 2 là láng giềng trực tiếp của 0. Vì vậy <strong>không bao giờ dùng DFS một mình cho câu hỏi "ngắn nhất"</strong> — nó tìm ra <em>một</em> đường đi, không phải đường ngắn nhất. Để ý thêm: 3 nhận khoảng cách từ 1 (hàng "dequeue 1"), không phải từ 2: ai phát hiện một đỉnh trước thì đặt khoảng cách cho nó, và BFS đảm bảo người phát hiện đầu tiên là một trong những đỉnh gần nhất.</p>
${moPhong('ch07/bfs-levels.sim.js', 'vi', 'BFS từng tầng, rồi DFS lao sâu — cùng một đồ thị', 'Xem khoảng cách hiện lên trên các đỉnh theo từng vòng, rồi khung thứ hai cho thấy DFS đệ quy đi 0 → 1 → 3 → 2 trước khi kịp chạm tới 4.')}
</div>

<div class="ml-en">
<h3>Worked example: Number of Islands (LC 200)</h3>
<p><strong>Problem (in our words).</strong> A grid of '1' (land) and '0' (water). An island is a group of land cells connected horizontally or vertically (not diagonally). Count the islands. Grids go up to 300 × 300.</p>
<p><strong>Name the graph.</strong> Node = land cell; edge = two land cells side by side. An island is a connected component. So the question is "how many connected components?" — and the answer is "how many times do I have to <em>start</em> a traversal to cover all the land?".</p>
<p><strong>Brute force, said out loud.</strong> "For every pair of land cells, check whether they are connected" is hopeless (pairs × traversal). The natural first idea is already the good one: scan the grid; the first time you meet land that you have not visited, that is a new island — count it, then traverse and mark its whole island so you never count it again. Every cell is marked once and looked at by at most 4 neighbours: O(R·C) time.</p>
<p><strong>Where do we keep "visited"?</strong> Either a separate boolean grid (O(R·C) extra memory, input untouched) or by <em>sinking</em> the land — overwriting '1' with '0'. Sinking is shorter and common in interviews, but it destroys the input: <strong>ask first</strong> ("may I modify the grid?"). In production code the answer is almost always no.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Number of Islands (LC 200 — đếm số hòn đảo)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một lưới gồm '1' (đất) và '0' (nước). Một hòn đảo là một nhóm ô đất nối nhau theo chiều ngang hoặc dọc (không tính đường chéo). Đếm số hòn đảo. Lưới tối đa 300 × 300.</p>
<p><strong>Gọi tên đồ thị.</strong> Đỉnh = ô đất; cạnh = hai ô đất nằm cạnh nhau. Một hòn đảo là một thành phần liên thông. Vậy câu hỏi là "có bao nhiêu thành phần liên thông?" — và câu trả lời là "phải <em>bắt đầu</em> một lượt duyệt bao nhiêu lần mới phủ hết đất?".</p>
<p><strong>Vét cạn, nói thành lời.</strong> "Với mọi cặp ô đất, kiểm xem chúng có nối nhau không" là vô vọng (số cặp × một lượt duyệt). Ý tưởng tự nhiên đầu tiên đã là ý tưởng tốt: quét lưới; lần đầu gặp một ô đất chưa thăm, đó là một đảo mới — đếm nó, rồi duyệt và đánh dấu cả hòn đảo để không bao giờ đếm lại. Mỗi ô bị đánh dấu một lần và bị nhìn tối đa bởi 4 láng giềng: O(R·C) thời gian.</p>
<p><strong>Giữ dấu "đã thăm" ở đâu?</strong> Hoặc một lưới boolean riêng (tốn thêm O(R·C) bộ nhớ, đầu vào giữ nguyên) hoặc <em>nhấn chìm</em> đất — ghi đè '1' thành '0'. Nhấn chìm ngắn hơn và hay gặp khi phỏng vấn, nhưng nó phá đầu vào: <strong>hỏi trước</strong> ("em được sửa lưới không ạ?"). Trong code đi làm câu trả lời gần như luôn là không.</p>
</div>
${maHai('ch07/islands.ts', 'ch07/Islands.java', { vung: 'dfs' })}
${maHai('ch07/islands.ts', 'ch07/Islands.java', { vung: 'bfs' })}
${ketQua('ch07/islands.ts')}
${ketQua('ch07/Islands.java')}
<div class="ml-en">
<p>The third grid is the diagonal trap: a checkerboard has 5 islands, not 1, because diagonal cells are not connected in 4-direction problems. Read the guard in <code>sink</code>: bounds first, then the value — the same short-circuit rule as lesson 7.1. The BFS version stores each cell as one integer <code>r * C + c</code> and uses a head index instead of <code>shift()</code> (lesson 3.2 measured why). Here is the scan on the second grid, one row per island; red = cells sunk by that island's traversal.</p>
</div>
<div class="ml-vi">
<p>Lưới thứ ba là bẫy đường chéo: bàn cờ ca-rô có 5 đảo chứ không phải 1, vì các ô chéo không được tính là nối nhau trong đề 4 hướng. Đọc phần chặn đầu của <code>sink</code>: kiểm biên trước, rồi mới kiểm giá trị — cùng luật ngắt mạch như bài 7.1. Bản BFS lưu mỗi ô thành một số nguyên <code>r * C + c</code> và dùng chỉ số đầu hàng thay cho <code>shift()</code> (bài 3.2 đã đo vì sao). Dưới đây là lượt quét trên lưới thứ hai, mỗi hàng một hòn đảo; ô đỏ = các ô bị lượt duyệt của đảo đó nhấn chìm.</p>
</div>
${BANG_DAO}
<div class="ml-en">
<p>Three rows, three islands. The scan continues past (0, 1), (1, 0), (1, 1) without counting them again because they were already sunk by island #1 — that is the whole trick. Total work: every cell is read by the scan once and sunk at most once.</p>
${moPhong('ch07/islands.sim.js', 'en', 'Number of Islands — scan, then sink', 'Opens /algorithms: the yellow cell is the scan position, red cells are sunk; the log counts islands as they are found.')}
</div>
<div class="ml-vi">
<p>Ba hàng, ba hòn đảo. Lượt quét đi qua (0, 1), (1, 0), (1, 1) mà không đếm lại vì chúng đã bị đảo số 1 nhấn chìm — toàn bộ mẹo nằm ở đó. Tổng công việc: mỗi ô được lượt quét đọc một lần và bị nhấn chìm tối đa một lần.</p>
${moPhong('ch07/islands.sim.js', 'vi', 'Number of Islands — quét, rồi nhấn chìm', 'Mở trang /algorithms: ô vàng là vị trí đang quét, ô đỏ là đã chìm; nhật ký đếm số đảo khi tìm thấy.')}
</div>

<div class="ml-en">
<h3>When recursion crashes: a 1000 × 1000 grid, measured</h3>
<p>The recursive <code>sink</code> is five lines and interviewers accept it — but it has a limit that bites real systems. On a grid that is all land, the DFS walks in a snake: down the first column, up the second, down the third… every new cell is one call deeper. The depth reaches the number of cells. The program fills a 1000 × 1000 all-land grid (a million cells — think of a paint-bucket click on a blank 1-megapixel image) recursively, then with an explicit stack, then with BFS.</p>
</div>
<div class="ml-vi">
<h3>Khi đệ quy sập: lưới 1000 × 1000, đo bằng số</h3>
<p>Hàm <code>sink</code> đệ quy chỉ năm dòng và người phỏng vấn chấp nhận nó — nhưng nó có một giới hạn từng cắn hệ thống thật. Trên lưới toàn đất, DFS đi theo hình rắn: xuống hết cột đầu, lên cột hai, xuống cột ba… mỗi ô mới là thêm một tầng gọi hàm. Độ sâu chạm tới số ô. Chương trình tô loang một lưới 1000 × 1000 toàn đất (một triệu ô — hình dung cú bấm thùng sơn trên một tấm ảnh trắng 1 megapixel) bằng đệ quy, rồi bằng stack tường minh, rồi bằng BFS.</p>
</div>
${maHai('ch07/dfs-sau-do.ts', 'ch07/DfsSauDo.java', { vung: 'de-quy' })}
${ma('ch07/dfs-sau-do.ts', { vung: 'lap', nhan: 'TypeScript — iterative' })}
${ketQua('ch07/dfs-sau-do.ts')}
${ketQua('ch07/DfsSauDo.java')}
<div class="ml-en">
<p>Node throws <code>RangeError: Maximum call stack size exceeded</code> at a depth of about ${sauTs} (${sauTs2} on the second try, once the JIT has compiled the function into a smaller frame) — so an all-land grid of only about 100 × 100 is already too deep. Java runs the recursion in threads with chosen stack sizes: with 2 MB (this machine's default thread stack, <code>-XX:ThreadStackSize=2048</code>) it dies at ${sauJ2m}, with 8 MB at ${sauJ8m}, and only a 64 MB stack survives the full million. The iterative version keeps its stack on the <em>heap</em>, which is limited only by memory: a million cells in ${lapTs} ms in Node. Lesson <a href="${baiNay('dsa-5-2-de-quy')}">5.2</a> measured the same wall on a chain-shaped tree; on grids it is easier to hit, because one innocent-looking input (all land, all same colour) creates the worst case.</p>
<p>Interview rule: write the recursive version if the grid is small and say "this recursion can be as deep as R·C; for big inputs I would switch to an explicit stack or BFS". That one sentence shows you know where the code breaks.</p>
</div>
<div class="ml-vi">
<p>Node ném <code>RangeError: Maximum call stack size exceeded</code> ở độ sâu khoảng ${viSo(sauTs)} (${viSo(sauTs2)} ở lần thử thứ hai, khi JIT đã biên dịch hàm thành khung nhỏ hơn) — nghĩa là chỉ một lưới toàn đất cỡ 100 × 100 đã quá sâu. Java chạy đệ quy trong các luồng (thread) với kích thước stack tự chọn: với 2 MB (stack mặc định của luồng trên máy này, <code>-XX:ThreadStackSize=2048</code>) nó chết ở ${viSo(sauJ2m)}, với 8 MB ở ${viSo(sauJ8m)}, và chỉ stack 64 MB mới sống qua đủ một triệu ô. Bản lặp giữ stack của nó trên <em>heap</em>, chỉ bị giới hạn bởi bộ nhớ: một triệu ô trong ${lapTs.replace('.', ',')} ms trên Node. Bài <a href="${baiNay('dsa-5-2-de-quy')}">5.2</a> đã đo cùng bức tường đó trên một cây hình chuỗi; trên lưới nó dễ chạm hơn nhiều, vì một đầu vào trông vô hại (toàn đất, toàn một màu) đã tạo ra trường hợp xấu nhất.</p>
<p>Luật khi phỏng vấn: lưới nhỏ thì viết bản đệ quy và nói thêm "đệ quy này có thể sâu tới R·C tầng; với đầu vào lớn em sẽ đổi sang stack tường minh hoặc BFS". Một câu đó cho thấy bạn biết code gãy ở đâu.</p>
</div>

<div class="ml-en">
<h3>Pattern 2 — multi-source BFS: Rotting Oranges (LC 994)</h3>
<p>Each minute, every rotten orange (2) rots its fresh neighbours (1). How many minutes until no fresh orange is left, or −1 if some can never rot? The naive idea runs one BFS per rotten orange and takes the minimum per cell — O(k·R·C). The right idea: <strong>put every rotten orange in the queue at minute 0</strong>. BFS then expands all of them simultaneously, ring by ring, exactly like the real process. Process the queue <em>level by level</em> (all cells of minute m, then minute m + 1) and count the levels. Keep a <code>fresh</code> counter so the answer "−1" is a single comparison at the end.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 2 — BFS nhiều nguồn: Rotting Oranges (LC 994 — cam thối)</h3>
<p>Mỗi phút, mọi quả cam thối (2) làm thối các quả tươi (1) nằm cạnh nó. Sau bao nhiêu phút thì không còn quả tươi nào, hoặc −1 nếu có quả không bao giờ thối? Ý ngây thơ là chạy một BFS cho mỗi quả thối rồi lấy min theo từng ô — O(k·R·C). Ý đúng: <strong>cho mọi quả thối vào hàng đợi ngay ở phút 0</strong>. BFS khi đó loang từ tất cả cùng lúc, từng vòng một, y như quá trình thật. Xử lý hàng đợi <em>theo từng tầng</em> (mọi ô của phút m, rồi phút m + 1) và đếm số tầng. Giữ một biến đếm <code>fresh</code> để câu trả lời "−1" chỉ là một phép so sánh ở cuối.</p>
</div>
${maHai('ch07/rotting.ts', 'ch07/Rotting.java', { vung: 'giai' })}
${ketQua('ch07/rotting.ts')}
<div class="ml-en">
<p>One row per minute on <code>[[2,1,1],[1,1,0],[0,1,1]]</code>; orange = cells that rotted during that minute — that is, one BFS level.</p>
</div>
<div class="ml-vi">
<p>Mỗi hàng một phút trên lưới <code>[[2,1,1],[1,1,0],[0,1,1]]</code>; ô cam = các ô thối trong phút đó — tức đúng một tầng BFS.</p>
</div>
${BANG_CAM}
<div class="ml-en">
<p>${PHUT} minutes, matching the first output line. The fourth test, <code>[2,1,1,1,1,1,2]</code>, shows why multi-source matters: two sources at the two ends meet in the middle after 3 minutes; starting from only one end would say 5. The two languages show the two ways to process one level: TypeScript builds a <code>next</code> array; Java freezes <code>q.size()</code> before the inner loop — both mean "only the cells that were in the queue when this minute began". The classic bug is to loop <code>while (!q.isEmpty())</code> in the inner loop: the minute never ends.</p>
</div>
<div class="ml-vi">
<p>${PHUT} phút, khớp dòng output đầu tiên. Test thứ tư, <code>[2,1,1,1,1,1,2]</code>, cho thấy vì sao nhiều nguồn quan trọng: hai nguồn ở hai đầu gặp nhau ở giữa sau 3 phút; nếu chỉ xuất phát từ một đầu sẽ ra 5. Hai ngôn ngữ thể hiện hai cách xử lý một tầng: TypeScript dựng mảng <code>next</code>; Java chốt <code>q.size()</code> trước vòng trong — cả hai đều nghĩa là "chỉ những ô có trong hàng đợi lúc phút này bắt đầu". Lỗi kinh điển là viết <code>while (!q.isEmpty())</code> ở vòng trong: phút đó không bao giờ kết thúc.</p>
</div>

<div class="ml-en">
<h3>Three variants with one twist each</h3>
<p><strong>Clone Graph (LC 133)</strong> — deep-copy a connected undirected graph given one node. The twist: the visited set must <em>also</em> tell you which copy belongs to which original, so it is a <code>Map&lt;original, copy&gt;</code>. Create the copy the first time you see a node; wire <code>copy(u).neighbors</code> to <code>copy(v)</code> for every edge. The output's last line is the real test: zero nodes shared between the original and the clone (a shallow copy would share all four).</p>
</div>
<div class="ml-vi">
<h3>Ba biến thể, mỗi đề một điểm xoay</h3>
<p><strong>Clone Graph (LC 133 — sao chép đồ thị)</strong> — sao chép sâu một đồ thị vô hướng liên thông khi chỉ được đưa một đỉnh. Điểm xoay: tập đã thăm phải <em>đồng thời</em> cho biết bản sao nào ứng với đỉnh gốc nào, nên nó là một <code>Map&lt;gốc, bản sao&gt;</code>. Tạo bản sao lần đầu thấy một đỉnh; nối <code>copy(u).neighbors</code> tới <code>copy(v)</code> cho mọi cạnh. Dòng cuối của output là phép kiểm thật sự: không đỉnh nào dùng chung giữa bản gốc và bản sao (sao chép nông sẽ dùng chung cả bốn).</p>
</div>
${maHai('ch07/clone-graph.ts', 'ch07/CloneGraph.java', { vung: 'giai' })}
${ketQua('ch07/clone-graph.ts')}
<div class="ml-en">
<p><strong>Pacific Atlantic Water Flow (LC 417)</strong> — rain flows from a cell to a neighbour of equal or lower height; the Pacific touches the top and left edges, the Atlantic the bottom and right. Which cells can drain into both? Running a search from every cell is O((R·C)²). The twist: <strong>reverse the flow</strong>. Start one BFS from all Pacific-border cells and move to neighbours that are <em>at least as high</em> (water could flow down from them to us); do the same from the Atlantic border; answer = cells reached by both. Two O(R·C) searches.</p>
</div>
<div class="ml-vi">
<p><strong>Pacific Atlantic Water Flow (LC 417 — nước chảy ra hai đại dương)</strong> — mưa chảy từ một ô sang ô kề có độ cao bằng hoặc thấp hơn; Thái Bình Dương chạm cạnh trên và cạnh trái, Đại Tây Dương chạm cạnh dưới và cạnh phải. Ô nào chảy ra được cả hai? Chạy một lượt tìm từ mỗi ô là O((R·C)²). Điểm xoay: <strong>đảo chiều dòng chảy</strong>. Bắt đầu một BFS từ mọi ô biên Thái Bình Dương và đi sang láng giềng <em>cao ít nhất bằng</em> (nước có thể chảy xuống từ chúng tới ta); làm y vậy từ biên Đại Tây Dương; đáp án = các ô được cả hai lượt chạm tới. Hai lượt tìm O(R·C).</p>
</div>
${maHai('ch07/pacific.ts', 'ch07/Pacific.java', { vung: 'giai' })}
${ketQua('ch07/pacific.ts')}
<div class="ml-en">
<p>The third test is a bowl: the centre (height 1) is lower than everything around it, so its water is trapped and it is the only cell missing from the answer. <strong>Word Ladder (LC 127)</strong> — shortest chain of words from <code>hit</code> to <code>cog</code>, each step changing one letter, every word in the dictionary. The graph is implicit: nodes are words, edges are "differ by one letter". Comparing every pair of words costs O(N²·L); instead, <strong>generate</strong> the neighbours of a word by trying 26 letters at each of its L positions and keep those in the dictionary — O(N·26·L) overall. Deleting a word from the dictionary when it is enqueued marks it visited for free.</p>
</div>
<div class="ml-vi">
<p>Test thứ ba là một cái bát: ô giữa (độ cao 1) thấp hơn mọi ô xung quanh, nước của nó bị giữ lại nên nó là ô duy nhất vắng mặt trong đáp án. <strong>Word Ladder (LC 127 — thang từ)</strong> — chuỗi từ ngắn nhất đi từ <code>hit</code> tới <code>cog</code>, mỗi bước đổi một chữ cái, mọi từ phải có trong từ điển. Đồ thị là ngầm: đỉnh là từ, cạnh là "khác nhau đúng một chữ". So mọi cặp từ tốn O(N²·L); thay vào đó <strong>sinh</strong> láng giềng của một từ bằng cách thử 26 chữ ở mỗi vị trí trong L vị trí, giữ những từ có trong từ điển — tổng cộng O(N·26·L). Xoá một từ khỏi từ điển lúc đưa nó vào hàng đợi là đánh dấu đã thăm mà không tốn thêm gì.</p>
</div>
${maHai('ch07/word-ladder.ts', 'ch07/WordLadder.java', { vung: 'giai' })}
${ketQua('ch07/word-ladder.ts')}
<div class="ml-en">
<p>5 = hit → hot → dot → dog → cog (the answer counts words, hence <code>steps = 1</code> at the start); 0 when <code>cog</code> is not in the dictionary; and code → cade → cate → date → data is also 5. In Java remember to restore <code>cs[i]</code> after trying the 26 letters, or the next position mutates an already-mutated word.</p>
</div>
<div class="ml-vi">
<p>5 = hit → hot → dot → dog → cog (đáp án đếm số TỪ, nên lúc đầu <code>steps = 1</code>); 0 khi <code>cog</code> không có trong từ điển; và code → cade → cate → date → data cũng là 5. Trong Java nhớ khôi phục <code>cs[i]</code> sau khi thử đủ 26 chữ, không thì vị trí kế tiếp sẽ đổi trên một từ đã bị đổi sẵn.</p>
</div>

<div class="ml-en">
<h3>Where BFS and DFS live in real systems — including this website</h3>
<ul>
<li><strong>"People you may know" is a two-level BFS.</strong> <code>getSuggestedUsers</code> in <code>src/services/follow.service.ts</code> loads the people you follow (level 1), then the people <em>they</em> follow (level 2), skipping yourself and anyone already followed — the <code>followingIds.add(userId)</code> line is the visited set. Each level is one SQL query with <code>followerId: { in: [...] }</code>: a BFS frontier expanded in a single database round trip. It does not rank the candidates; the version below adds the obvious ranking — how many of the people you follow already follow them (the number of length-2 paths, LinkedIn's "mutual connections").</li>
<li><strong>Web crawlers</strong> are BFS over the link graph with a giant visited set (normalised URLs) and a politeness queue per host.</li>
<li><strong>Garbage collectors</strong> mark live objects by traversing the object graph from the roots (stack, globals); anything not reached is garbage. V8 and the JVM both do this marking with explicit work-lists, not recursion — for exactly the depth reason measured above.</li>
<li><strong>Image editors' paint bucket</strong> is flood fill; the /algorithms page of this site has a "Flood Fill (4-connected)" demo built on the same grid tracer as our simulations.</li>
</ul>
</div>
<div class="ml-vi">
<h3>BFS và DFS sống ở đâu trong hệ thống thật — kể cả trang web này</h3>
<ul>
<li><strong>"Những người bạn có thể biết" là một BFS hai tầng.</strong> <code>getSuggestedUsers</code> trong <code>src/services/follow.service.ts</code> nạp những người bạn theo dõi (tầng 1), rồi những người <em>họ</em> theo dõi (tầng 2), bỏ qua chính bạn và người đã theo dõi rồi — dòng <code>followingIds.add(userId)</code> chính là tập đã thăm. Mỗi tầng là một truy vấn SQL với <code>followerId: { in: [...] }</code>: một biên (frontier) BFS được mở rộng trong đúng một lượt gọi CSDL. Hàm đó chưa xếp hạng ứng viên; bản dưới đây thêm cách xếp hạng hiển nhiên — bao nhiêu người bạn đang theo dõi đã theo dõi họ (số đường đi dài 2, chính là "bạn chung" của LinkedIn).</li>
<li><strong>Web crawler</strong> (bot thu thập trang) là BFS trên đồ thị liên kết với một tập đã thăm khổng lồ (URL đã chuẩn hoá) và một hàng đợi lịch sự cho từng máy chủ.</li>
<li><strong>Bộ thu gom rác</strong> (garbage collector) đánh dấu các đối tượng còn sống bằng cách duyệt đồ thị đối tượng từ các gốc (stack, biến toàn cục); thứ gì không tới được là rác. V8 và JVM đều đánh dấu bằng danh sách công việc tường minh, không bằng đệ quy — đúng vì lý do độ sâu đã đo ở trên.</li>
<li><strong>Thùng sơn trong phần mềm vẽ</strong> là tô loang; trang /algorithms của chính website này có bản demo "Flood Fill (4-connected)" dựng trên cùng bộ vẽ lưới với các mô phỏng của ta.</li>
</ul>
</div>
${maHai('ch07/ban-chung.ts', 'ch07/BanChung.java', { vung: 'giai' })}
${ketQua('ch07/ban-chung.ts')}
<div class="ml-en">
<p>User 0 follows 1, 2 and 3; all three follow 4, so 4 is the strongest suggestion (3 mutual). User 3 follows 0 back, but 0 is never suggested to themself — the <code>x === me</code> check. For user 1 the only candidate is 7, reached via 4.</p>
</div>
<div class="ml-vi">
<p>Người 0 theo dõi 1, 2 và 3; cả ba đều theo dõi 4, nên 4 là gợi ý mạnh nhất (3 người chung). Người 3 theo dõi ngược lại 0, nhưng 0 không bao giờ được gợi ý cho chính mình — phép kiểm <code>x === me</code>. Với người 1, ứng viên duy nhất là 7, tới được qua 4.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: depth bombs and crawler traps</h3>
<p><strong>Depth bombs.</strong> Any server-side recursion whose depth is chosen by the input is a crash button: a flood fill on an uploaded image (one solid colour), a recursive walk of uploaded JSON or XML nested 100,000 levels deep, a recursive resolver on a user-built tree. In Node a <code>RangeError</code> inside a request handler is usually caught, but the request still burns CPU up to the limit; in Java a <code>StackOverflowError</code> is an <code>Error</code> that many frameworks do not catch where you expect, and a thread may die. The fix is the one measured above: iterative traversal with an explicit stack or queue, plus an input limit (pixels, nesting depth) checked before any work.</p>
<p><strong>Crawler traps.</strong> A crawler is BFS over URLs, and some sites — by accident or on purpose — generate infinitely many distinct URLs: a calendar with a "next month" link forever, session ids in links, <code>?page=n+1</code> with no end. A BFS without a budget never finishes. Real crawlers bound the work: a maximum depth per site, a maximum number of pages per host, URL normalisation (so <code>?a=1&amp;b=2</code> and <code>?b=2&amp;a=1</code> are the same node), and detection of repeating path patterns. The general lesson for your own BFS on an implicit graph (word ladders, game states): know the size of the state space before you start, or set a budget.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: bom độ sâu và bẫy crawler</h3>
<p><strong>Bom độ sâu.</strong> Mọi đệ quy phía máy chủ mà độ sâu do đầu vào quyết định đều là một nút bấm làm sập: tô loang trên ảnh người dùng tải lên (một màu đặc), đệ quy đi qua JSON hoặc XML lồng 100.000 tầng, một hàm giải đệ quy trên cây do người dùng dựng. Trong Node, <code>RangeError</code> bên trong handler của request thường bị bắt, nhưng request đó vẫn đốt CPU tới tận giới hạn; trong Java, <code>StackOverflowError</code> là một <code>Error</code> mà nhiều framework không bắt ở chỗ bạn tưởng, và một luồng có thể chết. Cách sửa chính là thứ đã đo ở trên: duyệt lặp bằng stack hoặc hàng đợi tường minh, cộng một giới hạn đầu vào (số điểm ảnh, độ sâu lồng nhau) kiểm trước khi làm bất cứ việc gì.</p>
<p><strong>Bẫy crawler.</strong> Crawler là BFS trên các URL, và có những trang — vô tình hoặc cố ý — sinh ra vô hạn URL khác nhau: một tờ lịch có nút "tháng sau" mãi mãi, mã phiên (session id) gắn trong link, <code>?page=n+1</code> không có điểm dừng. BFS không có ngân sách sẽ không bao giờ kết thúc. Crawler thật luôn chặn khối lượng việc: độ sâu tối đa mỗi trang web, số trang tối đa mỗi máy chủ, chuẩn hoá URL (để <code>?a=1&amp;b=2</code> và <code>?b=2&amp;a=1</code> là cùng một đỉnh), và phát hiện mẫu đường dẫn lặp lại. Bài học chung cho BFS của chính bạn trên đồ thị ngầm (thang từ, trạng thái trò chơi): biết kích thước không gian trạng thái trước khi bắt đầu, hoặc đặt ngân sách.</p>
</div>

<div class="ml-en">
<h3>The trap: marking visited at the wrong moment</h3>
<div class="pitfall co-tieu-de"><p><strong>Mark a node visited when you ENQUEUE it, not when you dequeue it.</strong></p><p>Both give the right answer, which is why the bug survives tests. Marking late lets the same node be enqueued once by every neighbour that discovers it before it is dequeued. Measured on an open N × N grid:</p></div>
</div>
<div class="ml-vi">
<h3>Cái bẫy: đánh dấu đã thăm sai lúc</h3>
<div class="pitfall co-tieu-de"><p><strong>Đánh dấu một đỉnh đã thăm lúc ĐƯA VÀO hàng đợi, không phải lúc lấy ra.</strong></p><p>Cả hai cách đều cho đáp án đúng, đó là lý do lỗi sống sót qua test. Đánh dấu muộn khiến cùng một đỉnh bị đưa vào hàng một lần cho mỗi láng giềng phát hiện ra nó trước khi nó kịp được lấy ra. Đo trên lưới N × N trống:</p></div>
</div>
${maHai('ch07/bay-danh-dau.ts', 'ch07/BayDanhDau.java')}
${ketQua('ch07/bay-danh-dau.ts')}
<div class="ml-en">
<p>Same million cells visited, but almost twice as many enqueues (1,998,001 vs 1,000,000) and twice the peak queue. On a grid each cell has at most 4 neighbours so the damage is ×2; on a dense graph a node can be enqueued once per incoming edge and the queue grows to O(E) — on a complete graph of 10⁴ nodes that is 10⁸ entries instead of 10⁴. And in DFS-with-recursion the same mistake (checking visited only on entry) is fine, which is why people carry the habit into BFS. One more classic: forgetting to mark the <strong>source</strong> itself, so it is re-discovered by its first neighbour.</p>
</div>
<div class="ml-vi">
<p>Cùng một triệu ô được thăm, nhưng số lần đưa vào hàng gần gấp đôi (1.998.001 so với 1.000.000) và hàng đợi lúc đông nhất cũng gấp đôi. Trên lưới mỗi ô tối đa 4 láng giềng nên thiệt hại là ×2; trên đồ thị dày, một đỉnh có thể bị đưa vào hàng một lần cho mỗi cạnh đi tới nó và hàng đợi phình tới O(E) — trên đồ thị đầy đủ 10⁴ đỉnh đó là 10⁸ phần tử thay vì 10⁴. Còn với DFS đệ quy, cùng kiểu kiểm (chỉ kiểm visited lúc bước vào) lại không sao, nên người ta mang thói quen đó sang BFS. Thêm một lỗi kinh điển: quên đánh dấu chính <strong>đỉnh nguồn</strong>, nên nó bị láng giềng đầu tiên phát hiện lại.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given a grid of 1s and 0s, count the islands. Islands connect up, down, left and right.'],
  ['C', 'So each land cell is a node and side-by-side land cells share an edge; an island is a connected component. Diagonals do not connect, right? And may I modify the grid, or should I keep it intact?'],
  ['N', 'Name the graph, confirm 4 vs 8 directions, ask about mutating the input — three sentences that prevent three bugs.'],
  ['I', 'No diagonals. You may modify it.'],
  ['C', 'Then I scan every cell. When I find a 1, that is a new island: I count it and sink the whole island by turning its cells into 0 with a traversal, so it is never counted again. Each cell is sunk once: O(R·C) time, and the extra space is the traversal’s stack or queue.'],
  ['I', 'Recursive or iterative?'],
  ['C', 'Recursive DFS is shortest, but on an all-land grid the recursion can be R·C deep — 90,000 here — which can overflow the stack in Node or Java. I will write BFS with a queue and a head index to be safe. (codes) I mark a cell when I enqueue it, so no cell enters the queue twice.'],
  ['N', 'Choosing the safer version and saying why is worth more than the five-line recursion.'],
  ['C', 'Testing: a checkerboard gives one island per land cell because diagonals do not count; a grid of only water gives 0; one cell of land gives 1.'],
  ['I', 'Follow-up: islands appear one by one as land is added. Report the count after each addition.'],
  ['C', 'Rerunning the scan each time is O(k·R·C). Instead I would use union-find: each new land cell is a new set, I union it with land neighbours, and the count drops by one for each successful union — nearly O(1) per addition.'],
  ['N', 'That is LC 305 (Premium); union-find is lesson 7.4. Knowing when to switch tools is the follow-up being tested.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Cho lưới 1 và 0, đếm số hòn đảo. Đảo nối theo trên, dưới, trái, phải.'],
  ['C', 'Vậy mỗi ô đất là một đỉnh, hai ô đất cạnh nhau có chung một cạnh; một đảo là một thành phần liên thông. Đường chéo không tính là nối đúng không ạ? Và em được sửa lưới không, hay phải giữ nguyên? <em>("May I modify the grid?")</em>'],
  ['N', 'Gọi tên đồ thị, xác nhận 4 hay 8 hướng, hỏi chuyện sửa đầu vào — ba câu chặn trước ba lỗi.'],
  ['I', 'Không tính đường chéo. Được sửa.'],
  ['C', 'Vậy em quét mọi ô. Gặp một ô 1 là gặp một đảo mới: em đếm nó và nhấn chìm cả hòn đảo bằng cách đổi các ô của nó thành 0 qua một lượt duyệt, để nó không bao giờ bị đếm lại. Mỗi ô bị nhấn chìm một lần: O(R·C) thời gian, bộ nhớ phụ là stack hoặc hàng đợi của lượt duyệt.'],
  ['I', 'Đệ quy hay lặp?'],
  ['C', 'DFS đệ quy ngắn nhất, nhưng trên lưới toàn đất đệ quy có thể sâu R·C tầng — ở đây là 90.000 — có thể tràn stack trên Node hoặc Java. Em viết BFS với hàng đợi và chỉ số đầu hàng cho an toàn. (vừa code) Em đánh dấu ô lúc đưa vào hàng, nên không ô nào vào hàng hai lần. <em>("I mark a cell when I enqueue it.")</em>'],
  ['N', 'Chọn bản an toàn hơn và nói được vì sao đáng giá hơn năm dòng đệ quy.'],
  ['C', 'Test: bàn cờ ca-rô cho mỗi ô đất một đảo vì đường chéo không tính; lưới toàn nước cho 0; một ô đất cho 1.'],
  ['I', 'Câu nối tiếp: đất được thêm dần từng ô. Báo số đảo sau mỗi lần thêm.'],
  ['C', 'Quét lại mỗi lần là O(k·R·C). Thay vào đó em dùng union-find: mỗi ô đất mới là một tập mới, em hợp nó với các ô đất kề, và số đảo giảm một cho mỗi lần hợp thành công — gần như O(1) mỗi lần thêm. <em>("I’d switch to union-find.")</em>'],
  ['N', 'Đó là LC 305 (Premium); union-find ở bài 7.4. Biết lúc nào đổi công cụ chính là thứ câu nối tiếp muốn kiểm.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Using DFS to answer "shortest" or "minimum steps" — it finds a path, not the shortest one.</li>
<li>Marking visited at dequeue time (duplicates in the queue), or forgetting to mark the source.</li>
<li>Processing a BFS "level" with a loop whose bound keeps growing (<code>while (!q.isEmpty())</code> inside the level loop); freeze the size first.</li>
<li>Recursive DFS on inputs up to 10⁵–10⁶ cells without saying anything about stack depth.</li>
<li>Searching from every cell when the question is about the border (LC 417, LC 130) — search once from the border instead.</li>
<li>Comparing all pairs of words/states to find neighbours instead of generating them.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dùng DFS để trả lời "ngắn nhất" hay "ít bước nhất" — nó tìm ra một đường đi, không phải đường ngắn nhất.</li>
<li>Đánh dấu đã thăm lúc lấy ra (hàng đợi đầy bản trùng), hoặc quên đánh dấu đỉnh nguồn.</li>
<li>Xử lý một "tầng" BFS bằng vòng lặp có điều kiện cứ lớn dần (<code>while (!q.isEmpty())</code> bên trong vòng tầng); hãy chốt kích thước trước.</li>
<li>DFS đệ quy trên đầu vào 10⁵–10⁶ ô mà không nói gì về độ sâu stack.</li>
<li>Tìm từ mọi ô khi câu hỏi là về biên (LC 417, LC 130) — hãy tìm một lần từ biên.</li>
<li>So mọi cặp từ/trạng thái để tìm láng giềng thay vì sinh chúng ra.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Đề lưới 8 hướng LC 1091 đã có lời giải ở <a href="${baiNay('dsa-3-2-queue')}">bài 3.2</a>. Bài kế tiếp (<a href="${baiNay('dsa-7-3-topo')}">7.3</a>) dùng DFS để phát hiện chu trình và sắp xếp các môn học theo thứ tự tiên quyết.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write Number of Islands twice from memory: once with recursive DFS, once with BFS and a head index. Run both on the four grids above.</li>
<li>Build an all-land 300 × 300 grid and run your recursive version in your language. Does it survive? Write the depth it reached (add a counter like <code>deepest</code>).</li>
<li>Submit LC 200 and LC 994. For LC 994, write in one sentence why all rotten oranges go into the queue at minute 0.</li>
<li>Bonus: LC 417 — explain out loud why the search runs uphill.</li>
</ol>
<p><strong>Done when:</strong> two accepted submissions, the depth number for your machine, and the one-sentence multi-source explanation.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BFS</span><span class="v">Breadth-first search: a queue, visits in order of distance; shortest paths when edges are unweighted.</span></div>
  <div class="kv"><span class="k">DFS</span><span class="v">Depth-first search: a stack or recursion, dives first; components, cycles, backtracking.</span></div>
  <div class="kv"><span class="k">visited / seen</span><span class="v">The mark that makes each node processed once; set it when the node enters the container.</span></div>
  <div class="kv"><span class="k">BFS level / layer</span><span class="v">All nodes at the same distance; process with a frozen queue size or a next array.</span></div>
  <div class="kv"><span class="k">multi-source BFS</span><span class="v">Start with every source in the queue at distance 0.</span></div>
  <div class="kv"><span class="k">parent array</span><span class="v">Who discovered each node; walk it backwards to rebuild the shortest path.</span></div>
  <div class="kv"><span class="k">flood fill</span><span class="v">Mark the whole connected region of a start cell (paint bucket, sinking an island).</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>BFS = queue = distance order = shortest unweighted paths; DFS = stack/recursion = dive, shortest code for components.</li>
<li>Both O(V + E); mark visited when a node enters the container.</li>
<li>Counting components = counting how many traversals you had to start.</li>
<li>Many sources at once ⇒ all of them in the queue at time 0; process level by level.</li>
<li>Border questions ⇒ search backwards from the border; state questions ⇒ generate neighbours.</li>
<li>Recursion depth can equal the number of cells: Node died near ${sauTs}, Java at ${sauJ2m} with a 2 MB stack — iterate for big inputs.</li>
</ul>
${nguon('🎞️', 'VisuAlgo — DFS and BFS', 'Run DFS and BFS on your own graph and watch the stack/queue, with the parent tree', 'https://visualgo.net/en/dfsbfs')}
${nguon('📘', 'cp-algorithms — Breadth-first search', 'Shortest paths, multi-source BFS and the parent array, with proofs', 'https://cp-algorithms.com/graph/breadth-first-search.html')}
${nguon('🖌️', 'Flood fill (Wikipedia)', 'Recursive, stack-based and scanline implementations, and why the recursive one is avoided in practice', 'https://en.wikipedia.org/wiki/Flood_fill')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết Number of Islands hai lần không nhìn bài: một lần DFS đệ quy, một lần BFS với chỉ số đầu hàng. Chạy cả hai trên bốn lưới ở trên.</li>
<li>Dựng một lưới 300 × 300 toàn đất và chạy bản đệ quy bằng ngôn ngữ của bạn. Nó có sống không? Ghi lại độ sâu đạt được (thêm một biến đếm như <code>deepest</code>).</li>
<li>Nộp LC 200 và LC 994. Với LC 994, viết một câu giải thích vì sao mọi quả cam thối vào hàng đợi ngay ở phút 0.</li>
<li>Thêm: LC 417 — giải thích to thành tiếng vì sao lượt tìm lại đi ngược lên dốc.</li>
</ol>
<p><strong>Đạt khi:</strong> hai lượt nộp Accepted, có con số độ sâu trên máy bạn, và câu giải thích BFS nhiều nguồn.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BFS (tìm kiếm theo chiều rộng)</span><span class="v">Dùng hàng đợi, thăm theo thứ tự khoảng cách; cho đường ngắn nhất khi cạnh không trọng số.</span></div>
  <div class="kv"><span class="k">DFS (tìm kiếm theo chiều sâu)</span><span class="v">Dùng stack hoặc đệ quy, lao sâu trước; thành phần liên thông, chu trình, quay lui.</span></div>
  <div class="kv"><span class="k">visited / seen (đã thăm / đã thấy)</span><span class="v">Dấu khiến mỗi đỉnh chỉ được xử lý một lần; đặt nó lúc đỉnh vào thùng chứa.</span></div>
  <div class="kv"><span class="k">BFS level / layer (tầng BFS)</span><span class="v">Mọi đỉnh cùng khoảng cách; xử lý bằng cách chốt kích thước hàng đợi hoặc dùng mảng next.</span></div>
  <div class="kv"><span class="k">multi-source BFS (BFS nhiều nguồn)</span><span class="v">Bắt đầu với mọi nguồn trong hàng đợi ở khoảng cách 0.</span></div>
  <div class="kv"><span class="k">parent array (mảng cha)</span><span class="v">Ai đã phát hiện ra từng đỉnh; lần ngược nó để dựng lại đường ngắn nhất.</span></div>
  <div class="kv"><span class="k">flood fill (tô loang)</span><span class="v">Đánh dấu cả vùng liên thông của ô xuất phát (thùng sơn, nhấn chìm một hòn đảo).</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>BFS = hàng đợi = thứ tự khoảng cách = đường ngắn nhất không trọng số; DFS = stack/đệ quy = lao sâu, code ngắn nhất cho thành phần liên thông.</li>
<li>Cả hai O(V + E); đánh dấu đã thăm lúc đỉnh vào thùng chứa.</li>
<li>Đếm thành phần liên thông = đếm số lượt duyệt phải bắt đầu.</li>
<li>Nhiều nguồn cùng lúc ⇒ cho tất cả vào hàng đợi ở thời điểm 0; xử lý theo từng tầng.</li>
<li>Câu hỏi về biên ⇒ tìm ngược từ biên; câu hỏi về trạng thái ⇒ sinh láng giềng.</li>
<li>Độ sâu đệ quy có thể bằng số ô: Node chết quanh ${viSo(sauTs)}, Java ở ${viSo(sauJ2m)} với stack 2 MB — đầu vào lớn thì viết bản lặp.</li>
</ul>
${nguon('🎞️', 'VisuAlgo — DFS and BFS', 'Chạy DFS và BFS trên đồ thị tự vẽ, xem stack/hàng đợi và cây cha (tiếng Anh)', 'https://visualgo.net/en/dfsbfs')}
${nguon('📘', 'cp-algorithms — Breadth-first search', 'Đường ngắn nhất, BFS nhiều nguồn và mảng cha, có chứng minh (tiếng Anh)', 'https://cp-algorithms.com/graph/breadth-first-search.html')}
${nguon('🖌️', 'Flood fill (Wikipedia)', 'Các cách cài tô loang: đệ quy, dùng stack, quét dòng — và vì sao thực tế tránh bản đệ quy (tiếng Anh)', 'https://en.wikipedia.org/wiki/Flood_fill')}
</div>
`,
};
