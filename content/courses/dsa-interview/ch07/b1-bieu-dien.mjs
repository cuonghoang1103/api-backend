/** 7.1 — Biểu diễn đồ thị. Mọi mã/output đọc từ ../ma/ch07 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay } from '../_chung.mjs';
import { bangDo, hang, so, lan, oDay } from './_rieng.mjs';
import { vetKe, vetDfsLap } from '../ma/ch07/bieu-dien.vet.mjs';

/* Bảng vết 1: dựng danh sách kề từ danh sách cạnh. */
const E5 = [[0, 1], [0, 2], [1, 2], [1, 3], [3, 4]];
const vk = vetKe(5, E5);
const BANG_KE = bangVet(['step', 'edge', 'adj[0]', 'adj[1]', 'adj[2]', 'adj[3]', 'adj[4]'],
  vk.map((h) => [
    String(h.k + 1),
    `<code>${h.u}–${h.v}</code>`,
    ...h.adj.map((a, i) => oDay(a, { to: Object.fromEntries(a.map((x, j) => [j, (i === h.u && x === h.v) || (i === h.v && x === h.u) ? 'ok' : null]).filter((p) => p[1])) })),
  ]));

/* Bảng vết 2: DFS lặp của LC 1971. */
const E6 = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]];
const vd = vetDfsLap(6, E6, 0, 5);
const BANG_DFS = bangVet(['step', 'pop u', 'adj[u]', 'pushed (newly seen)', 'stack after (top = right)', 'seen'],
  vd.map((h) => [
    String(h.buoc),
    h.pop === null ? '— (start)' : (h.xong ? `<strong>${h.pop}</strong> = destination ✅` : `<strong>${h.pop}</strong>`),
    h.ke ? `<code>[${h.ke.join(', ')}]</code>` : '',
    h.day.length ? `<code>${h.day.join(', ')}</code>` : '—',
    oDay(h.stack, { to: h.stack.length ? { [h.stack.length - 1]: 'r' } : {} }),
    oMang(h.seen.map((s, i) => (s ? i : '·')), { to: Object.fromEntries(h.seen.map((s, i) => [i, s ? 'cs' : null]).filter((p) => p[1])) }),
  ]));
const SO_BUOC_DFS = vd.length - 1;

/* Số đo ma trận vs danh sách (đọc từ .out). Cột: [ô ma trận, ô danh sách, ms ma trận, ms danh sách]. */
const DT = bangDo('ch07/bieu-dien-do.ts');
const DJ = bangDo('ch07/BieuDienDo.java');
const [, , m4, l4] = hang(DT, 4000);
const [, , m16, l16] = hang(DT, 16000);
const [, , , l1m] = hang(DT, 1000000);
const [, , jm16, jl16] = hang(DJ, 16000);

const DE = [
  [lc(1971, 'find-if-path-exists-in-graph', 'Find if Path Exists in Graph', 'Easy'), 'Edge list in, yes/no out: build the adjacency list, then any traversal.', 'Vào là danh sách cạnh, ra là có/không: dựng danh sách kề rồi duyệt bất kỳ.'],
  [lc(1791, 'find-center-of-star-graph', 'Find Center of Star Graph', 'Easy'), 'The centre is in every edge — compare the first two edges, O(1).', 'Tâm nằm trong mọi cạnh — so hai cạnh đầu là đủ, O(1).'],
  [lc(997, 'find-the-town-judge', 'Find the Town Judge', 'Easy'), 'Only degrees matter: in-degree n − 1, out-degree 0.', 'Chỉ cần bậc: bậc vào n − 1, bậc ra 0.'],
  [lc(463, 'island-perimeter', 'Island Perimeter', 'Easy'), 'Grid as an implicit graph: count land sides that touch water or the border.', 'Lưới là đồ thị ngầm: đếm cạnh ô đất chạm nước hoặc chạm biên.'],
  [lc(841, 'keys-and-rooms', 'Keys and Rooms', 'Medium'), 'The input already IS an adjacency list; reachability from room 0.', 'Đầu vào CHÍNH LÀ danh sách kề; hỏi đi tới được mọi phòng từ phòng 0 không.'],
  [lc(1557, 'minimum-number-of-vertices-to-reach-all-nodes', 'Minimum Number of Vertices to Reach All Nodes', 'Medium'), 'In a DAG the answer is exactly the nodes with in-degree 0.', 'Trong DAG đáp án đúng bằng các đỉnh có bậc vào 0.'],
  [lc(1615, 'maximal-network-rank', 'Maximal Network Rank', 'Medium'), 'Degrees plus an O(1) "is u–v an edge?" check ⇒ keep a matrix or a Set of pairs next to the degrees.', 'Bậc cộng phép kiểm O(1) "u–v có cạnh không?" ⇒ giữ ma trận hoặc Set các cặp bên cạnh mảng bậc.'],
  [lc(547, 'number-of-provinces', 'Number of Provinces', 'Medium'), 'The input is an adjacency MATRIX; count connected components (DFS here, union-find in 7.4).', 'Đầu vào là MA TRẬN kề; đếm thành phần liên thông (DFS ở đây, union-find ở bài 7.4).'],
];

export default {
  title: '7.1 — Representing graphs: edge list, adjacency list, matrix, grid|||7.1 — Biểu diễn đồ thị: danh sách cạnh, danh sách kề, ma trận, lưới',
  slug: 'dsa-7-1-bieu-dien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bước 0 của mọi đề đồ thị: gọi tên đỉnh và cạnh, dựng danh sách kề từ danh sách cạnh, lưới 4/8 hướng là đồ thị ngầm, khi nào dùng ma trận — kèm số đo ma trận O(V²) vs danh sách O(V+E) và hai cái bẫy dựng đồ thị.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Representing graphs: edge list, adjacency list, matrix, grid</h2>
<p class="lead">Interviewers almost never hand you a "graph object". They hand you a list of pairs, a grid of characters, a list of course prerequisites, a dictionary of words, a list of accounts that share e-mails — and the first quiet test is whether you <strong>see</strong> the graph inside it. This lesson is step 0 of every problem in the chapter: name the nodes, name the edges, decide directed or not, weighted or not, and turn the input into a structure you can walk in O(1) per neighbour. Get this step wrong and BFS, topological sort and Dijkstra all fail before they start; get it right and half of each solution is already written.</p>

<h3>The everyday picture</h3>
<p>Think of the bus network around the university. There are three ways to write it down. (1) The <strong>timetable</strong>: one line per route, "stop A → stop B". That is an <strong>edge list</strong>. (2) The <strong>sign at every stop</strong> listing the stops you can reach from here. That is an <strong>adjacency list</strong>: to plan a trip you stand at a stop and read only its own sign. (3) A <strong>giant wall chart</strong> with every stop as a row and as a column, and a tick where a direct bus exists. That is an <strong>adjacency matrix</strong>: you can answer "is there a direct bus from A to B?" instantly, but the chart has (number of stops)² boxes, almost all empty.</p>
<p>Vocabulary you will use for the rest of the chapter: a <strong>graph</strong> is a set of <strong>vertices</strong> (nodes) joined by <strong>edges</strong>. Edges are <strong>directed</strong> (one-way: "A follows B", "course A is a prerequisite of course B") or <strong>undirected</strong> (two-way: friendship, a road both ways), and may carry a <strong>weight</strong> (minutes, cost, distance). The <strong>degree</strong> of a node is how many edges touch it; in a directed graph we split it into <strong>in-degree</strong> (arrows coming in) and <strong>out-degree</strong> (arrows going out). A <strong>path</strong> is a walk along edges; a <strong>cycle</strong> is a path that returns to its start; a <strong>connected component</strong> is a group of nodes that can all reach each other. We write V for the number of vertices and E for the number of edges. A graph is <strong>sparse</strong> when E is close to V (road maps, social networks, dependency graphs — almost everything in real life) and <strong>dense</strong> when E is close to V².</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Biểu diễn đồ thị: danh sách cạnh, danh sách kề, ma trận, lưới</h2>
<p class="lead">Người phỏng vấn gần như không bao giờ đưa bạn một "đối tượng đồ thị". Họ đưa một danh sách các cặp số, một lưới ký tự, danh sách môn tiên quyết, một từ điển các từ, danh sách tài khoản dùng chung email — và bài kiểm tra thầm lặng đầu tiên là bạn có <strong>nhìn ra</strong> đồ thị nằm bên trong hay không. Bài này là bước 0 của mọi đề trong chương: gọi tên đỉnh, gọi tên cạnh, quyết định có hướng hay không, có trọng số hay không, rồi biến đầu vào thành một cấu trúc đi được, mỗi láng giềng tốn O(1). Làm sai bước này thì BFS, sắp xếp tô-pô hay Dijkstra đều hỏng trước khi kịp chạy; làm đúng thì một nửa lời giải đã viết xong.</p>

<h3>Hình dung đời thường</h3>
<p>Nghĩ về mạng xe buýt quanh trường. Có ba cách ghi nó ra giấy. (1) <strong>Bảng lộ trình</strong>: mỗi dòng một chặng "trạm A → trạm B". Đó là <strong>danh sách cạnh</strong> (edge list). (2) <strong>Tấm biển ở từng trạm</strong> ghi các trạm đi thẳng được từ đây. Đó là <strong>danh sách kề</strong> (adjacency list): muốn lên kế hoạch đi, bạn đứng ở một trạm và chỉ đọc đúng tấm biển của trạm đó. (3) Một <strong>tấm bảng khổng lồ dán tường</strong>, mỗi trạm là một hàng và một cột, đánh dấu tích ở ô nào có xe chạy thẳng. Đó là <strong>ma trận kề</strong> (adjacency matrix): hỏi "có xe thẳng từ A tới B không?" là trả lời ngay, nhưng tấm bảng có (số trạm)² ô, gần như tất cả để trống.</p>
<p>Từ vựng dùng suốt chương: <strong>đồ thị</strong> (graph) là một tập <strong>đỉnh</strong> (vertex / node) nối với nhau bằng <strong>cạnh</strong> (edge). Cạnh <strong>có hướng</strong> (directed — một chiều: "A theo dõi B", "môn A là tiên quyết của môn B") hoặc <strong>vô hướng</strong> (undirected — hai chiều: kết bạn, con đường đi được cả hai chiều), và có thể mang <strong>trọng số</strong> (weight — số phút, chi phí, quãng đường). <strong>Bậc</strong> (degree) của một đỉnh là số cạnh chạm vào nó; với đồ thị có hướng tách thành <strong>bậc vào</strong> (in-degree — số mũi tên đi vào) và <strong>bậc ra</strong> (out-degree — số mũi tên đi ra). <strong>Đường đi</strong> (path) là một lối đi theo các cạnh; <strong>chu trình</strong> (cycle) là đường đi quay về điểm xuất phát; <strong>thành phần liên thông</strong> (connected component) là một nhóm đỉnh đi tới được nhau. Ký hiệu V là số đỉnh, E là số cạnh. Đồ thị <strong>thưa</strong> (sparse) khi E xấp xỉ V (bản đồ đường, mạng xã hội, đồ thị phụ thuộc — gần như mọi thứ ngoài đời) và <strong>dày</strong> (dense) khi E xấp xỉ V².</p>
${csd('csd201-do-thi-bieu-dien', 'vi', '5.2 Ba cách lưu một đồ thị', '<p>Ở CSD201 bạn đã học ba cách lưu: ma trận kề, danh sách kề, danh sách cạnh, và so sánh bộ nhớ của chúng. Ôn nhanh: ma trận tốn V² ô, danh sách kề tốn V + E ô. <strong>Ở đây đi sâu thêm:</strong> nhận ra đồ thị ẩn trong đề (lưới, từ, môn học), dựng danh sách kề trong 3 dòng không lỗi bằng cả TypeScript lẫn Java, hai cái bẫy làm sai cả bài, và số đo thật cho thấy ma trận chết ở đâu.</p>')}
</div>

<div class="ml-en">
<h3>Step 0 of every graph problem</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">What is a node?</span><span class="lz-d">a person, a cell (r, c), a word, a course, an e-mail</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">What is an edge?</span><span class="lz-d">given pairs · grid neighbours · "differ by one letter" · "shares an e-mail"</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Directed? Weighted?</span><span class="lz-d">decides one arc or two; BFS or Dijkstra</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Representation</span><span class="lz-d">adjacency list by default; grid = compute neighbours</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Algorithm</span><span class="lz-d">7.2 BFS/DFS · 7.3 topo · 7.4 Dijkstra / union-find</span></div>
</div>
<h3>Signals: "this is secretly a graph"</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"n nodes labelled 0..n−1 and a list edges[i] = [u, v]"</span><span class="v">The textbook input. Build an adjacency list first, always.</span></div>
  <div class="kv"><span class="k">a grid of '1'/'0', '#'/'.', oranges, heights</span><span class="v">Each cell is a node, its 4 (or 8) neighbours are its edges. Do NOT build a list — compute neighbours on the fly.</span></div>
  <div class="kv"><span class="k">"prerequisites", "depends on", "must happen before"</span><span class="v">A directed graph; the question is usually a cycle or an order (lesson 7.3).</span></div>
  <div class="kv"><span class="k">"transform one word / lock / state into another, one step at a time"</span><span class="v">An implicit graph whose nodes are states; neighbours are generated by rules (lesson 7.2).</span></div>
  <div class="kv"><span class="k">"groups", "merge if they share…", "how many separate…"</span><span class="v">Connected components: DFS/BFS, or union-find when edges arrive one by one (lesson 7.4).</span></div>
  <div class="kv"><span class="k">constraints V ≤ 10⁵, E ≤ 2·10⁵</span><span class="v">Only O(V + E) structures fit: an adjacency list. A V × V matrix would have 10¹⁰ cells.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Bước 0 của mọi đề đồ thị</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đỉnh là gì?</span><span class="lz-d">một người, một ô (r, c), một từ, một môn học, một email</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cạnh là gì?</span><span class="lz-d">cặp cho sẵn · ô kề trong lưới · "khác nhau một chữ" · "dùng chung email"</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Có hướng? Có trọng số?</span><span class="lz-d">quyết định thêm một hay hai mũi tên; BFS hay Dijkstra</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cách lưu</span><span class="lz-d">mặc định danh sách kề; lưới = tính láng giềng tại chỗ</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Thuật toán</span><span class="lz-d">7.2 BFS/DFS · 7.3 tô-pô · 7.4 Dijkstra / union-find</span></div>
</div>
<h3>Dấu hiệu nhận ra: "đề này thật ra là đồ thị"</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"n đỉnh đánh số 0..n−1 và danh sách edges[i] = [u, v]"</span><span class="v">Đầu vào kiểu sách giáo khoa. Luôn dựng danh sách kề trước.</span></div>
  <div class="kv"><span class="k">lưới '1'/'0', '#'/'.', quả cam, độ cao</span><span class="v">Mỗi ô là một đỉnh, 4 (hoặc 8) ô kề là các cạnh của nó. KHÔNG dựng danh sách — tính láng giềng ngay lúc cần.</span></div>
  <div class="kv"><span class="k">"tiên quyết", "phụ thuộc vào", "phải xảy ra trước"</span><span class="v">Đồ thị có hướng; câu hỏi thường là có chu trình không hoặc thứ tự nào (bài 7.3).</span></div>
  <div class="kv"><span class="k">"biến một từ / một ổ khoá / một trạng thái thành cái khác, mỗi lần một bước"</span><span class="v">Đồ thị ngầm (implicit graph) có đỉnh là trạng thái; láng giềng sinh ra theo luật (bài 7.2).</span></div>
  <div class="kv"><span class="k">"nhóm", "gộp nếu dùng chung…", "có bao nhiêu cụm tách rời…"</span><span class="v">Thành phần liên thông: DFS/BFS, hoặc union-find khi cạnh tới từng cái một (bài 7.4).</span></div>
  <div class="kv"><span class="k">ràng buộc V ≤ 10⁵, E ≤ 2·10⁵</span><span class="v">Chỉ cấu trúc O(V + E) mới vừa: danh sách kề. Ma trận V × V sẽ có 10¹⁰ ô.</span></div>
</div>
</div>

<div class="ml-en">
<h3>The same graph, three ways</h3>
<p>Five nodes, five undirected edges: 0–1, 0–2, 1–2, 1–3, 3–4. The program prints the edge list, builds the adjacency list (for an undirected edge we add <em>two</em> arcs, u → v and v → u), builds the matrix, then builds the directed version where each pair is one arrow. Look at the two functions: they are the three lines you will type at the start of almost every graph interview.</p>
</div>
<div class="ml-vi">
<h3>Cùng một đồ thị, ba cách lưu</h3>
<p>Năm đỉnh, năm cạnh vô hướng: 0–1, 0–2, 1–2, 1–3, 3–4. Chương trình in danh sách cạnh, dựng danh sách kề (với cạnh vô hướng ta thêm <em>hai</em> mũi tên u → v và v → u), dựng ma trận, rồi dựng bản có hướng trong đó mỗi cặp là một mũi tên. Nhìn hai hàm dưới đây: đó là ba dòng bạn sẽ gõ ở đầu gần như mọi buổi phỏng vấn đồ thị.</p>
</div>
${maHai('ch07/bieu-dien.ts', 'ch07/BieuDien.java', { vung: 'ke' })}
${maHai('ch07/bieu-dien.ts', 'ch07/BieuDien.java', { vung: 'ma-tran' })}
${ketQua('ch07/bieu-dien.ts')}
${ketQua('ch07/BieuDien.java')}
<div class="ml-en">
<p>Read the output line by line. The degrees sum to 10, which is 2 × 5 edges: every undirected edge is stored twice, once in each endpoint's list — the <em>handshake lemma</em>, and the reason an undirected adjacency list holds 2E entries. The matrix is symmetric (row i equals column i) exactly because the graph is undirected. In the directed version node 2 and node 4 have empty lists: nothing leaves them. And node 0 has in-degree 0: nothing points at it — in lesson 7.3 such nodes are where a topological order starts.</p>
<h3>Watch the adjacency list being built</h3>
<p>Each row is one edge being processed. Green marks the two entries this edge just added — always one in each endpoint's list.</p>
</div>
<div class="ml-vi">
<p>Đọc output từng dòng. Tổng các bậc là 10, tức 2 × 5 cạnh: mỗi cạnh vô hướng được lưu hai lần, mỗi lần ở danh sách của một đầu mút — đó là <em>bổ đề bắt tay</em> (handshake lemma), và là lý do danh sách kề vô hướng chứa 2E phần tử. Ma trận đối xứng (hàng i bằng cột i) đúng vì đồ thị vô hướng. Ở bản có hướng, đỉnh 2 và đỉnh 4 có danh sách rỗng: không mũi tên nào đi ra từ chúng. Còn đỉnh 0 có bậc vào 0: không ai trỏ vào nó — ở bài 7.3, những đỉnh như vậy là nơi một thứ tự tô-pô bắt đầu.</p>
<h3>Xem danh sách kề được dựng lên</h3>
<p>Mỗi hàng là một cạnh đang được xử lý. Ô xanh lá đánh dấu hai phần tử mà cạnh này vừa thêm vào — luôn là một ô ở danh sách của mỗi đầu mút.</p>
</div>
${BANG_KE}
<div class="ml-en">
${moPhong('ch07/ke.sim.js', 'en', 'Edge list → adjacency list, one edge at a time', 'Opens /algorithms: each edge appears on the drawing while the log prints all five lists; then the neighbours of node 1 light up.')}
</div>
<div class="ml-vi">
${moPhong('ch07/ke.sim.js', 'vi', 'Danh sách cạnh → danh sách kề, từng cạnh một', 'Mở trang /algorithms: mỗi cạnh hiện lên hình vẽ trong khi nhật ký in cả năm danh sách; cuối cùng các láng giềng của đỉnh 1 sáng lên.')}
</div>

<div class="ml-en">
<h3>Which one when</h3>
<table>
<thead><tr><th>Question you need answered</th><th>Edge list</th><th>Adjacency list</th><th>Adjacency matrix</th></tr></thead>
<tbody>
<tr><td>Memory</td><td>E</td><td>V + E (2E entries if undirected)</td><td>V²</td></tr>
<tr><td>"List the neighbours of u"</td><td>O(E) — scan all</td><td><strong>O(deg u)</strong></td><td>O(V) — scan the row</td></tr>
<tr><td>"Is u–v an edge?"</td><td>O(E)</td><td>O(deg u) (or O(1) with a Set per node)</td><td><strong>O(1)</strong></td></tr>
<tr><td>Natural for</td><td>input format, sorting edges (Kruskal, 7.4), union-find</td><td>BFS, DFS, topo sort, Dijkstra — almost everything</td><td>small dense graphs (V ≤ ~1,000), Floyd–Warshall, LC 547's input</td></tr>
</tbody></table>
<p>The rule for interviews: <strong>adjacency list unless you have a reason</strong>. The reason is usually "the problem gave me a matrix" (LC 547) or "I need O(1) edge checks on a small graph" (LC 1615 checks "are the two cities directly connected?" for every pair).</p>
</div>
<div class="ml-vi">
<h3>Khi nào dùng cái nào</h3>
<table>
<thead><tr><th>Câu hỏi bạn cần trả lời</th><th>Danh sách cạnh</th><th>Danh sách kề</th><th>Ma trận kề</th></tr></thead>
<tbody>
<tr><td>Bộ nhớ</td><td>E</td><td>V + E (2E phần tử nếu vô hướng)</td><td>V²</td></tr>
<tr><td>"Liệt kê láng giềng của u"</td><td>O(E) — quét hết</td><td><strong>O(bậc u)</strong></td><td>O(V) — quét cả hàng</td></tr>
<tr><td>"u–v có phải một cạnh?"</td><td>O(E)</td><td>O(bậc u) (hoặc O(1) nếu mỗi đỉnh giữ một Set)</td><td><strong>O(1)</strong></td></tr>
<tr><td>Hợp với</td><td>định dạng đầu vào, sắp xếp cạnh (Kruskal, bài 7.4), union-find</td><td>BFS, DFS, tô-pô, Dijkstra — gần như mọi thứ</td><td>đồ thị nhỏ và dày (V ≤ ~1.000), Floyd–Warshall, đầu vào của LC 547</td></tr>
</tbody></table>
<p>Luật khi phỏng vấn: <strong>danh sách kề, trừ khi có lý do</strong>. Lý do thường là "đề đưa sẵn ma trận" (LC 547) hoặc "cần kiểm cạnh O(1) trên đồ thị nhỏ" (LC 1615 hỏi "hai thành phố có nối thẳng không?" cho mọi cặp).</p>
</div>

<div class="ml-en">
<h3>Worked example: Find if Path Exists in Graph (LC 1971)</h3>
<p><strong>Problem (in our words).</strong> There are n nodes 0..n−1 and an undirected edge list. Is there a path from <code>source</code> to <code>destination</code>? Example: edges 0–1, 1–2, 2–0, source 0, destination 2 → <code>true</code>. Constraints go up to n = 2·10⁵ edges, so whatever we do must be O(V + E).</p>
<p><strong>Brute force, said out loud.</strong> "Repeatedly scan the whole edge list, adding any node connected to a node I can already reach, until nothing changes." Each pass is O(E) and we may need up to V passes: O(V·E) — about 4·10¹⁰ in the worst case. The waste is obvious once said: to expand one node we scan <em>every</em> edge, when we only need <em>its</em> edges. That is exactly what an adjacency list gives us.</p>
<p><strong>The plan.</strong> Build the adjacency list (two arcs per edge). Then walk from <code>source</code> with a stack — an iterative DFS (depth-first search: always continue from the most recently discovered node). A <code>seen</code> array guarantees each node is pushed once, so the walk is O(V + E). We use an explicit stack instead of recursion on purpose: a path graph with 2·10⁵ nodes would recurse 2·10⁵ deep, and lesson 7.2 measures exactly where that crashes.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Find if Path Exists in Graph (LC 1971)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Có n đỉnh 0..n−1 và một danh sách cạnh vô hướng. Có đường đi từ <code>source</code> tới <code>destination</code> không? Ví dụ: cạnh 0–1, 1–2, 2–0, source 0, destination 2 → <code>true</code>. Ràng buộc lên tới 2·10⁵ đỉnh và cạnh, nên mọi thứ ta làm phải là O(V + E).</p>
<p><strong>Vét cạn, nói thành lời.</strong> "Lặp lại việc quét toàn bộ danh sách cạnh, thêm mọi đỉnh nối với một đỉnh đã tới được, cho tới khi không còn gì thay đổi." Mỗi lượt quét O(E) và có thể cần tới V lượt: O(V·E) — khoảng 4·10¹⁰ trong trường hợp xấu nhất. Nói ra là thấy ngay chỗ phí: để mở rộng một đỉnh ta quét <em>mọi</em> cạnh, trong khi chỉ cần các cạnh <em>của nó</em>. Đó chính là thứ danh sách kề cho ta.</p>
<p><strong>Kế hoạch.</strong> Dựng danh sách kề (hai mũi tên mỗi cạnh). Rồi đi từ <code>source</code> bằng một stack — DFS lặp (depth-first search, tìm kiếm theo chiều sâu: luôn đi tiếp từ đỉnh vừa phát hiện gần nhất). Mảng <code>seen</code> (đã thấy) đảm bảo mỗi đỉnh chỉ được đẩy vào một lần, nên cả lượt đi là O(V + E). Cố ý dùng stack tường minh thay cho đệ quy: một đồ thị dạng đường thẳng 2·10⁵ đỉnh sẽ đệ quy sâu 2·10⁵ tầng, và bài 7.2 đo chính xác nó sập ở đâu.</p>
</div>
${maHai('ch07/path-exists.ts', 'ch07/PathExists.java', { vung: 'giai' })}
${ketQua('ch07/path-exists.ts')}
${ketQua('ch07/PathExists.java')}
<div class="ml-en">
<p>The four answers: a triangle (true), two separate components 0-1-2 and 3-4-5 (false — the walk from 0 empties the stack without meeting 5), a single node that is its own destination (true, found on the very first pop), and a chain walked backwards from 4 to 0 (true — proof that both arcs were added). Here is the walk on a slightly bigger graph, edges 0–1, 0–2, 1–3, 2–4, 3–5, 4–5, from 0 to 5. The orange cell is the top of the stack — the node that will be popped next.</p>
</div>
<div class="ml-vi">
<p>Bốn đáp án: một tam giác (true), hai thành phần tách rời 0-1-2 và 3-4-5 (false — lượt đi từ 0 làm rỗng stack mà không gặp 5), một đỉnh duy nhất cũng là đích (true, tìm thấy ngay lần pop đầu tiên), và một chuỗi đi ngược từ 4 về 0 (true — bằng chứng là cả hai mũi tên đã được thêm). Dưới đây là lượt đi trên một đồ thị lớn hơn chút, cạnh 0–1, 0–2, 1–3, 2–4, 3–5, 4–5, từ 0 tới 5. Ô cam là đỉnh của stack — đỉnh sẽ bị pop ở bước sau.</p>
</div>
${BANG_DFS}
<div class="ml-en">
<p>${SO_BUOC_DFS} pops, and nodes 1 and 3 were never expanded. Notice step 1: from 0 we push 1 and then 2, so 2 is on top and is explored first — a stack always continues from the <em>latest</em> discovery, which is what makes it "depth-first": the walk dives 0 → 2 → 4 → 5 and reaches the destination before it ever comes back for 1. Notice step 2 too: popping 2, its neighbour 0 is already seen and is skipped. Without the <code>seen</code> array the walk would bounce 0 → 2 → 0 → 2 forever, because in an undirected graph every edge leads straight back. And because we mark a node <em>when it is pushed</em>, no node can sit in the stack twice — mark only when popping and, on a dense graph, the same node can be pushed once per incoming edge, so the stack grows to O(E) instead of O(V).</p>
</div>
<div class="ml-vi">
<p>${SO_BUOC_DFS} lần pop, và hai đỉnh 1, 3 không hề được mở rộng. Để ý bước 1: từ 0 ta đẩy 1 rồi tới 2, nên 2 nằm trên đỉnh và được khám phá trước — stack luôn đi tiếp từ thứ <em>vừa</em> phát hiện, chính điều đó làm nên "theo chiều sâu": lượt đi lao thẳng 0 → 2 → 4 → 5 và tới đích trước khi kịp quay lại lấy 1. Để ý cả bước 2: pop 2 ra, láng giềng 0 của nó đã thấy rồi nên bị bỏ qua. Không có mảng <code>seen</code>, lượt đi sẽ nảy qua lại 0 → 2 → 0 → 2 mãi mãi, vì trong đồ thị vô hướng mọi cạnh đều dẫn ngược về. Và vì ta đánh dấu một đỉnh <em>lúc đẩy nó vào</em>, không đỉnh nào nằm trong stack hai lần — nếu chỉ đánh dấu lúc pop, trên đồ thị dày cùng một đỉnh có thể bị đẩy vào một lần cho mỗi cạnh đi tới nó, và stack phình tới O(E) thay vì O(V).</p>
</div>

<div class="ml-en">
<h3>Matrix versus list, measured</h3>
<p>"A matrix is O(V²)" sounds abstract until you see it. The benchmark below builds a sparse graph (each node has 4 outgoing arcs, so E = 4V), then runs the same BFS on both structures. With a matrix, "list the neighbours of u" means scanning a whole row of V cells, so the BFS is O(V²) no matter how few edges there are.</p>
</div>
<div class="ml-vi">
<h3>Ma trận và danh sách, đo bằng số</h3>
<p>"Ma trận là O(V²)" nghe trừu tượng cho tới khi bạn thấy nó. Phép đo dưới đây dựng một đồ thị thưa (mỗi đỉnh 4 mũi tên đi ra, nên E = 4V), rồi chạy cùng một BFS trên cả hai cấu trúc. Với ma trận, "liệt kê láng giềng của u" nghĩa là quét cả một hàng V ô, nên BFS là O(V²) dù có ít cạnh tới đâu.</p>
</div>
${ma('ch07/bieu-dien-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch07/bieu-dien-do.ts')}
${ketQua('ch07/BieuDienDo.java')}
<div class="ml-en">
<p>Read it like an engineer. From 4,000 to 16,000 nodes (4×) the matrix time grew about ${lan(m16, m4)}× in Node — V² predicts 16× — while the list grew ${lan(l16, l4)}×, as V + E predicts. At 16,000 nodes the matrix already holds 256 million cells (256 MB as bytes) to store 64,000 arcs, and takes ${so(m16, 0)} ms in Node and ${so(jm16, 0)} ms in Java against ${so(l16, 1)} ms and ${so(jl16, 1)} ms for the list. At 100,000 nodes the matrix would need 10 GB and was not even attempted; the list handles a million nodes in ${so(l1m, 0)} ms. LeetCode graph problems routinely have V = 10⁵: a matrix is not "a bit slower" there, it is a memory error.</p>
</div>
<div class="ml-vi">
<p>Đọc như một kỹ sư. Từ 4.000 lên 16.000 đỉnh (gấp 4), thời gian của ma trận tăng khoảng ${lan(m16, m4, 'vi')} lần trên Node — V² dự đoán 16 lần — còn danh sách tăng ${lan(l16, l4, 'vi')} lần, đúng như V + E dự đoán. Ở 16.000 đỉnh, ma trận đã giữ 256 triệu ô (256 MB nếu mỗi ô một byte) chỉ để lưu 64.000 mũi tên, và tốn ${so(m16, 0, 'vi')} ms trên Node, ${so(jm16, 0, 'vi')} ms trên Java, so với ${so(l16, 1, 'vi')} ms và ${so(jl16, 1, 'vi')} ms của danh sách. Ở 100.000 đỉnh, ma trận cần 10 GB nên không chạy luôn; danh sách xử lý một triệu đỉnh trong ${so(l1m, 0, 'vi')} ms. Đề đồ thị trên LeetCode thường có V = 10⁵: ở đó ma trận không phải "chậm hơn chút", mà là lỗi hết bộ nhớ.</p>
</div>

<div class="ml-en">
<h3>Grids: the graph you never build</h3>
<p>Half of all graph interview problems are grids: islands, mazes, rotting oranges, flood fill, heights of water. A cell <code>(r, c)</code> is a node; its neighbours are the cells one step away in 4 directions (up, down, left, right) or 8 (plus diagonals). Building an adjacency list for a grid would waste memory and code — instead keep a small <strong>direction array</strong> and compute neighbours when you need them, <strong>checking the bounds before touching the grid</strong>. Two extra tricks: a cell can be encoded as one integer <code>r * cols + c</code> (handy for visited arrays, queues of numbers and union-find), and decoded back with <code>/</code> and <code>%</code>.</p>
</div>
<div class="ml-vi">
<h3>Lưới: đồ thị bạn không bao giờ dựng</h3>
<p>Một nửa số đề đồ thị khi phỏng vấn là lưới: đảo, mê cung, cam thối, tô loang (flood fill), độ cao mực nước. Ô <code>(r, c)</code> là một đỉnh; láng giềng là các ô cách một bước theo 4 hướng (lên, xuống, trái, phải) hoặc 8 hướng (thêm đường chéo). Dựng danh sách kề cho lưới chỉ phí bộ nhớ và phí code — thay vào đó giữ một <strong>mảng hướng</strong> (direction array) nhỏ và tính láng giềng khi cần, <strong>kiểm biên TRƯỚC khi chạm vào lưới</strong>. Thêm hai mẹo: một ô có thể mã hoá thành một số nguyên <code>r * cols + c</code> (tiện cho mảng visited, hàng đợi số nguyên và union-find), và giải mã ngược bằng <code>/</code> và <code>%</code>.</p>
</div>
${maHai('ch07/luoi.ts', 'ch07/Luoi.java', { vung: 'huong' })}
${maHai('ch07/luoi.ts', 'ch07/Luoi.java', { vung: 'chu-vi' })}
${ketQua('ch07/luoi.ts')}
<div class="ml-en">
<p>The corner cell (0, 0) has only 2 neighbours in 4 directions and 3 in 8 — the bounds check removed the rest. The middle cell has all 8. Island Perimeter (LC 463) is the friendliest grid problem: no traversal at all, just "for each land cell, count the sides that touch water or the border". The 7-cell island in the example has perimeter 16; a lone cell has 4; a land cell next to water also 4. The order of the conditions in <code>water</code> is the lesson: <code>nr &lt; 0 || … || grid[nr][nc] === 0</code> — the short-circuit <code>||</code> guarantees we never read <code>grid[-1]</code>. In Java reading outside the array throws <code>ArrayIndexOutOfBoundsException</code>; in TypeScript <code>grid[-1]</code> is <code>undefined</code> and <code>undefined[0]</code> throws a <code>TypeError</code> — or, worse, <code>grid[r][-1]</code> silently gives <code>undefined</code> and your comparison quietly lies.</p>
</div>
<div class="ml-vi">
<p>Ô góc (0, 0) chỉ có 2 láng giềng theo 4 hướng và 3 theo 8 hướng — phép kiểm biên đã loại phần còn lại. Ô giữa có đủ 8. Island Perimeter (LC 463 — chu vi hòn đảo) là đề lưới dễ chịu nhất: không cần duyệt gì, chỉ "với mỗi ô đất, đếm các cạnh chạm nước hoặc chạm biên". Hòn đảo 7 ô trong ví dụ có chu vi 16; một ô lẻ có 4; một ô đất cạnh ô nước cũng 4. Thứ tự các điều kiện trong <code>water</code> chính là bài học: <code>nr &lt; 0 || … || grid[nr][nc] === 0</code> — phép <code>||</code> ngắt mạch (short-circuit) đảm bảo không bao giờ đọc <code>grid[-1]</code>. Trong Java đọc ra ngoài mảng ném <code>ArrayIndexOutOfBoundsException</code>; trong TypeScript <code>grid[-1]</code> là <code>undefined</code> và <code>undefined[0]</code> ném <code>TypeError</code> — hoặc tệ hơn, <code>grid[r][-1]</code> lặng lẽ cho <code>undefined</code> và phép so sánh của bạn nói dối mà không ai hay.</p>
</div>

<div class="ml-en">
<h3>Two variants: when you need less (degrees) and when it is already done (the input is the list)</h3>
<p><strong>Find the Town Judge (LC 997).</strong> In a town of n people, <code>trust[i] = [a, b]</code> means a trusts b. The judge trusts nobody and is trusted by everybody else. As a graph: an arrow a → b; the judge has out-degree 0 and in-degree n − 1. You do not need to know <em>who</em> trusts whom, only <em>how many</em> — one array of "in minus out" is enough, and only a node with score n − 1 qualifies (score n − 1 forces both conditions, because in-degree is at most n − 1). Thinking "which part of the graph does this question actually need?" before building anything is a habit interviewers notice.</p>
</div>
<div class="ml-vi">
<h3>Hai biến thể: khi cần ít hơn (chỉ cần bậc) và khi đề làm sẵn (đầu vào là danh sách kề)</h3>
<p><strong>Find the Town Judge (LC 997 — tìm thẩm phán thị trấn).</strong> Thị trấn có n người, <code>trust[i] = [a, b]</code> nghĩa là a tin b. Thẩm phán không tin ai và được tất cả người còn lại tin. Nhìn như đồ thị: mũi tên a → b; thẩm phán có bậc ra 0 và bậc vào n − 1. Bạn không cần biết <em>ai</em> tin ai, chỉ cần <em>bao nhiêu</em> — một mảng "bậc vào trừ bậc ra" là đủ, và chỉ đỉnh có điểm n − 1 mới đạt (điểm n − 1 ép cả hai điều kiện, vì bậc vào tối đa là n − 1). Thói quen hỏi "câu hỏi này thật sự cần phần nào của đồ thị?" trước khi dựng bất cứ thứ gì là điều người phỏng vấn để ý.</p>
</div>
${maHai('ch07/town-judge.ts', 'ch07/TownJudge.java', { vung: 'giai' })}
${ketQua('ch07/town-judge.ts')}
<div class="ml-en">
<p><strong>Keys and Rooms (LC 841).</strong> Room <code>i</code> contains the keys listed in <code>rooms[i]</code>; you start in room 0. Can you open every room? The input <em>is</em> an adjacency list already (room → rooms whose key it holds), so step 0 is free: you go straight to a traversal and compare the number of rooms reached with the total.</p>
</div>
<div class="ml-vi">
<p><strong>Keys and Rooms (LC 841 — chìa khoá và căn phòng).</strong> Phòng <code>i</code> chứa các chìa khoá ghi trong <code>rooms[i]</code>; bạn bắt đầu ở phòng 0. Có mở được mọi phòng không? Đầu vào <em>đã là</em> danh sách kề (phòng → các phòng mà nó giữ chìa), nên bước 0 miễn phí: đi thẳng vào duyệt rồi so số phòng tới được với tổng số phòng.</p>
</div>
${maHai('ch07/keys-rooms.ts', 'ch07/KeysRooms.java', { vung: 'giai' })}
${ketQua('ch07/keys-rooms.ts')}

<div class="ml-en">
<h3>Where these representations live in real systems — including this website</h3>
<ul>
<li><strong>A social graph is an edge list in a database.</strong> This site's Prisma schema has a <code>Follow</code> model (table <code>follows</code>): one row per arrow <code>followerId → followingId</code> — a directed edge list. It carries <em>two</em> indexes, <code>idx_follow_follower</code> and <code>idx_follow_following</code>: the first answers "who do I follow?" (my out-list), the second "who follows me?" (my in-list). Two indexes on an edge table <em>are</em> an adjacency list in both directions, maintained by PostgreSQL.</li>
<li><strong>Undirected stored once.</strong> The <code>Friendship</code> model is two-way, but it stores <em>one row per pair</em> (<code>requesterId</code>, <code>addresseeId</code>). So every query must look at both columns — <code>getAcceptedFriendIds</code> in <code>src/services/friend.service.ts</code> filters <code>OR: [{ requesterId: userId }, { addresseeId: userId }]</code> and then returns "the other end". That OR is the "add both arcs" line, done at query time instead of insert time. Forget it and you get exactly the bug demonstrated below.</li>
<li><strong>Edge list → adjacency list in production code.</strong> <code>criticalPath</code> in <code>src/services/work/planning.service.ts</code> (the CT Work timeline) receives dependencies as <code>{ from, to }</code> pairs and builds <code>out: Map&lt;number, number[]&gt;</code> plus an <code>indeg</code> map — the same two structures as our program, one line each. Lesson 7.3 comes back to what it does with them.</li>
<li><strong>Maps and networks.</strong> Road maps (intersections = nodes, road segments = weighted directed edges — one-way streets are why direction matters), the internet's routers, the import graph of a codebase, the foreign keys of a database schema: all sparse, all stored as adjacency lists of some kind.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Các cách lưu này nằm ở đâu trong hệ thống thật — kể cả chính trang web này</h3>
<ul>
<li><strong>Mạng xã hội là một danh sách cạnh trong CSDL.</strong> Prisma schema của trang này có model <code>Follow</code> (bảng <code>follows</code>): mỗi dòng là một mũi tên <code>followerId → followingId</code> — một danh sách cạnh có hướng. Bảng mang <em>hai</em> chỉ mục, <code>idx_follow_follower</code> và <code>idx_follow_following</code>: cái đầu trả lời "tôi theo dõi ai?" (danh sách ra của tôi), cái sau trả lời "ai theo dõi tôi?" (danh sách vào). Hai chỉ mục trên một bảng cạnh <em>chính là</em> danh sách kề theo cả hai chiều, do PostgreSQL duy trì giúp.</li>
<li><strong>Vô hướng nhưng lưu một lần.</strong> Model <code>Friendship</code> (kết bạn) là quan hệ hai chiều, nhưng lưu <em>một dòng cho mỗi cặp</em> (<code>requesterId</code>, <code>addresseeId</code>). Vì thế mọi truy vấn phải nhìn cả hai cột — <code>getAcceptedFriendIds</code> trong <code>src/services/friend.service.ts</code> lọc <code>OR: [{ requesterId: userId }, { addresseeId: userId }]</code> rồi trả về "đầu bên kia". Phép OR đó chính là dòng "thêm cả hai mũi tên", làm lúc truy vấn thay vì lúc ghi. Quên nó là gặp đúng cái lỗi được demo ở dưới.</li>
<li><strong>Danh sách cạnh → danh sách kề trong code chạy thật.</strong> <code>criticalPath</code> trong <code>src/services/work/planning.service.ts</code> (timeline của CT Work) nhận các phụ thuộc dạng cặp <code>{ from, to }</code> và dựng <code>out: Map&lt;number, number[]&gt;</code> cùng một map <code>indeg</code> — đúng hai cấu trúc như chương trình của ta, mỗi cái một dòng. Bài 7.3 quay lại xem nó làm gì tiếp với chúng.</li>
<li><strong>Bản đồ và mạng.</strong> Bản đồ đường (giao lộ = đỉnh, đoạn đường = cạnh có hướng có trọng số — đường một chiều là lý do hướng quan trọng), các router của Internet, đồ thị import giữa các tệp mã, khoá ngoại của một lược đồ CSDL: tất cả đều thưa, tất cả đều lưu bằng một dạng danh sách kề nào đó.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: when the graph's size comes from the user</h3>
<p>Two real failure modes. <strong>Memory blow-up:</strong> an endpoint that receives "n nodes and some edges" from a client (a diagram editor, a workflow builder, an import feature) and allocates an n × n matrix lets one request ask for n = 100,000 — 10¹⁰ cells, as the benchmark showed. The server either dies with out-of-memory or, in Node, stalls the whole event loop while it allocates; every other user waits. The defence is boring and effective: cap n and E at the API boundary (validate with a schema before any allocation), and use structures whose size is proportional to what the client actually sent (V + E), never to the square of a number the client chose.</p>
<p><strong>Authorization by graph query.</strong> "Friends-only" posts are protected by the question "is there a friendship edge between viewer and author?". With one row per pair, a check that looks only at <code>requesterId = viewer</code> answers correctly for half the pairs: a friend who <em>sent</em> the request sees the posts, a friend who <em>accepted</em> it does not — or, in the reversed variant, someone sees what they should not. The same "forgot the reverse arc" bug that breaks reachability below becomes an access-control bug. That is why this site's friendship queries always check both directions, and why "write a test for both directions" belongs in any permission code review.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: khi kích thước đồ thị do người dùng quyết định</h3>
<p>Hai kiểu hỏng có thật. <strong>Nổ bộ nhớ:</strong> một endpoint nhận "n đỉnh và một số cạnh" từ client (trình vẽ sơ đồ, công cụ dựng quy trình, tính năng nhập dữ liệu) rồi cấp một ma trận n × n, tức là cho phép một request xin n = 100.000 — 10¹⁰ ô, như phép đo đã cho thấy. Máy chủ hoặc chết vì hết bộ nhớ, hoặc với Node thì treo cả vòng lặp sự kiện (event loop) trong lúc cấp phát; mọi người dùng khác phải chờ. Cách phòng nhàm chán mà hiệu quả: chặn trần n và E ngay ở cửa API (kiểm bằng schema trước mọi lần cấp phát), và chỉ dùng cấu trúc có kích thước tỉ lệ với thứ client thật sự gửi lên (V + E), không bao giờ tỉ lệ với bình phương một con số do client chọn.</p>
<p><strong>Phân quyền bằng truy vấn đồ thị.</strong> Bài viết "chỉ bạn bè" được bảo vệ bằng câu hỏi "giữa người xem và tác giả có cạnh kết bạn không?". Khi mỗi cặp chỉ lưu một dòng, phép kiểm chỉ nhìn <code>requesterId = người xem</code> trả lời đúng cho một nửa số cặp: người bạn đã <em>gửi</em> lời mời thì xem được, người bạn đã <em>chấp nhận</em> thì không — hoặc ở biến thể ngược lại, có người thấy thứ lẽ ra không được thấy. Cùng một lỗi "quên mũi tên ngược" làm hỏng phép tới-được ở dưới, ở đây biến thành lỗi kiểm soát truy cập. Đó là lý do các truy vấn kết bạn của trang này luôn kiểm cả hai chiều, và vì sao "viết test cho cả hai chiều" phải có mặt trong mọi lần review code phân quyền.</p>
</div>

<div class="ml-en">
<h3>Two traps that break the graph before the algorithm runs</h3>
<div class="pitfall co-tieu-de"><p><strong>TypeScript: <code>new Array(n).fill([])</code> puts ONE array in every slot.</strong></p><p><code>fill</code> evaluates its argument once and copies the <em>reference</em> into every slot. Add one edge and every node "has" it:</p></div>
</div>
<div class="ml-vi">
<h3>Hai cái bẫy làm hỏng đồ thị trước khi thuật toán kịp chạy</h3>
<div class="pitfall co-tieu-de"><p><strong>TypeScript: <code>new Array(n).fill([])</code> đặt MỘT mảng duy nhất vào mọi ô.</strong></p><p><code>fill</code> tính đối số đúng một lần rồi chép <em>tham chiếu</em> vào mọi ô. Thêm một cạnh là mọi đỉnh đều "có" cạnh đó:</p></div>
</div>
${ma('ch07/bay-fill.ts', { nhan: 'TypeScript' })}
${ketQua('ch07/bay-fill.ts')}
<div class="ml-en">
<p>The last line is the 2-D version of the same bug: a visited grid built with <code>fill(new Array(3).fill(false))</code> shares one row, so visiting (0, 1) also "visits" (1, 1). Your BFS then skips cells it never reached and returns a wrong count without any error. Fix: <code>Array.from({ length: n }, () =&gt; [])</code> — the arrow function runs once per slot. Java does not have this trap with <code>new ArrayList&lt;&gt;()</code> in a loop, but it has a cousin: <code>Collections.nCopies(n, new ArrayList&lt;&gt;())</code> also shares one list.</p>
<div class="pitfall co-tieu-de"><p><strong>Both languages: an undirected edge added in one direction only.</strong></p><p>Exactly the friendships-table situation: the pair is stored once, the code adds one arc.</p></div>
</div>
<div class="ml-vi">
<p>Dòng cuối là phiên bản 2 chiều của cùng lỗi đó: lưới visited dựng bằng <code>fill(new Array(3).fill(false))</code> dùng chung một hàng, nên thăm ô (0, 1) cũng "thăm" luôn ô (1, 1). BFS của bạn sau đó bỏ qua những ô nó chưa hề tới và trả về số đếm sai mà không báo lỗi gì. Sửa: <code>Array.from({ length: n }, () =&gt; [])</code> — hàm mũi tên chạy một lần cho mỗi ô. Java không có bẫy này khi bạn <code>new ArrayList&lt;&gt;()</code> trong vòng lặp, nhưng có một người anh em: <code>Collections.nCopies(n, new ArrayList&lt;&gt;())</code> cũng dùng chung một danh sách.</p>
<div class="pitfall co-tieu-de"><p><strong>Cả hai ngôn ngữ: cạnh vô hướng chỉ được thêm một chiều.</strong></p><p>Đúng tình huống bảng kết bạn: cặp được lưu một lần, code chỉ thêm một mũi tên.</p></div>
</div>
${maHai('ch07/bay-mot-chieu.ts', 'ch07/BayMotChieu.java')}
${ketQua('ch07/bay-mot-chieu.ts')}
<div class="ml-en">
<p>With one arc, 0 reaches 2 but 2 does not reach 0 — the answer depends on which end you start from, which is impossible in an undirected graph and is the tell-tale sign of this bug. Test every undirected graph solution with the source and destination swapped; LC 1971's fourth case above (4 → 0 on a chain) exists for exactly this reason.</p>
</div>
<div class="ml-vi">
<p>Với một mũi tên, 0 tới được 2 nhưng 2 không tới được 0 — đáp án phụ thuộc vào việc bạn xuất phát từ đầu nào, điều không thể xảy ra trong đồ thị vô hướng và chính là dấu hiệu của lỗi này. Hãy test mọi lời giải đồ thị vô hướng với nguồn và đích đổi chỗ; ca thứ tư của LC 1971 ở trên (4 → 0 trên một chuỗi) có mặt đúng vì lý do đó.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'You get n servers and a list of cables between pairs of servers. Can server a send a packet to server b?'],
  ['C', 'So servers are nodes and cables are edges. Are cables two-way? Can there be duplicate cables, or a cable from a server to itself? And roughly how large are n and the number of cables?'],
  ['N', 'Name nodes and edges first, then the three questions that change the code: direction, duplicates/self-loops, size.'],
  ['I', 'Two-way, duplicates possible, n up to 10⁵ and up to 2·10⁵ cables.'],
  ['C', 'Then I will build an adjacency list — O(V + E) memory; a matrix would be 10¹⁰ cells. Since cables are two-way I add both arcs. Then a traversal from a with a visited array; duplicates are harmless because visited stops repeats. O(V + E) time.'],
  ['N', 'Representation chosen with a number, not a feeling. Mention why duplicates do not matter.'],
  ['I', 'Recursion or a stack?'],
  ['C', 'An explicit stack: a chain of 10⁵ servers would recurse 10⁵ deep, which can overflow the call stack in both Java and Node. (codes) I mark a node seen when I push it, so nothing enters the stack twice.'],
  ['C', 'Testing: a equal to b returns true immediately; two components returns false; and I swap a and b on a chain to check I really added both arcs.'],
  ['N', 'The swapped-endpoints test is the one that catches the one-direction bug.'],
  ['I', 'What if there are a million queries "can a reach b?"'],
  ['C', 'Then I would not traverse per query: label every node with its component id once in O(V + E), and each query compares two labels in O(1). Or union-find if cables are added over time.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Cho n máy chủ và danh sách cáp nối giữa từng cặp máy. Máy a có gửi được gói tin tới máy b không?'],
  ['C', 'Vậy máy chủ là đỉnh, cáp là cạnh. Cáp có hai chiều không ạ? Có thể có cáp trùng, hoặc cáp nối một máy với chính nó không? Và n với số cáp khoảng bao nhiêu? <em>("Are the cables bidirectional? Can there be duplicates or self-loops?")</em>'],
  ['N', 'Gọi tên đỉnh và cạnh trước, rồi ba câu hỏi làm thay đổi code: hướng, cạnh trùng/khuyên, kích thước.'],
  ['I', 'Hai chiều, có thể trùng, n tới 10⁵ và tới 2·10⁵ sợi cáp.'],
  ['C', 'Vậy em dựng danh sách kề — bộ nhớ O(V + E); ma trận sẽ là 10¹⁰ ô. Cáp hai chiều nên em thêm cả hai mũi tên. Rồi duyệt từ a với mảng visited; cáp trùng vô hại vì visited chặn lặp lại. Thời gian O(V + E). <em>("I’ll build an adjacency list; a matrix would be 10^10 cells.")</em>'],
  ['N', 'Chọn cách lưu bằng một con số, không bằng cảm giác. Nói luôn vì sao cạnh trùng không sao.'],
  ['I', 'Đệ quy hay stack?'],
  ['C', 'Stack tường minh: một chuỗi 10⁵ máy sẽ đệ quy sâu 10⁵ tầng, có thể tràn call stack cả trên Java lẫn Node. (vừa code) Em đánh dấu đã thấy lúc đẩy vào, nên không đỉnh nào vào stack hai lần. <em>("I mark a node as seen when I push it.")</em>'],
  ['C', 'Test: a bằng b thì trả true ngay; hai thành phần tách rời thì false; và em đổi chỗ a với b trên một chuỗi để chắc là đã thêm đủ hai mũi tên.'],
  ['N', 'Phép test đổi chỗ hai đầu là thứ bắt được lỗi "chỉ thêm một chiều".'],
  ['I', 'Nếu có một triệu câu hỏi "a tới được b không?" thì sao?'],
  ['C', 'Khi đó em không duyệt lại cho mỗi câu hỏi: gán cho mỗi đỉnh số hiệu thành phần liên thông một lần trong O(V + E), rồi mỗi câu hỏi chỉ so hai nhãn trong O(1). Hoặc dùng union-find nếu cáp được thêm dần theo thời gian. <em>("Precompute component ids once; each query is O(1).")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Not saying what a node and an edge are before coding — the interviewer cannot follow, and you often pick the wrong graph (cells vs. islands, words vs. letters).</li>
<li><code>new Array(n).fill([])</code> in TypeScript — every node shares one list.</li>
<li>Adding one arc for an undirected edge; or two arcs for a directed one (turning "A is a prerequisite of B" into "B is a prerequisite of A" too).</li>
<li>Reading <code>grid[nr][nc]</code> before checking <code>0 &lt;= nr &lt; rows</code> and <code>0 &lt;= nc &lt; cols</code>.</li>
<li>Defaulting to a matrix "because it is simpler" when V can be 10⁵.</li>
<li>Mixing 0-based and 1-based labels (LC 997 numbers people 1..n): size the arrays n + 1 or subtract 1 consistently.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Không nói đỉnh là gì, cạnh là gì trước khi code — người phỏng vấn không theo kịp, và bạn hay chọn nhầm đồ thị (ô hay đảo, từ hay chữ cái).</li>
<li><code>new Array(n).fill([])</code> trong TypeScript — mọi đỉnh dùng chung một danh sách.</li>
<li>Thêm một mũi tên cho cạnh vô hướng; hoặc thêm hai mũi tên cho cạnh có hướng (biến "A là tiên quyết của B" thành luôn "B là tiên quyết của A").</li>
<li>Đọc <code>grid[nr][nc]</code> trước khi kiểm <code>0 &lt;= nr &lt; rows</code> và <code>0 &lt;= nc &lt; cols</code>.</li>
<li>Mặc định dùng ma trận "vì nó đơn giản" khi V có thể là 10⁵.</li>
<li>Lẫn nhãn đếm từ 0 và đếm từ 1 (LC 997 đánh số người 1..n): cấp mảng kích thước n + 1 hoặc trừ 1 một cách nhất quán.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Bài tiếp theo (<a href="${baiNay('dsa-7-2-bfs-dfs')}">7.2 BFS và DFS</a>) dùng đúng các cấu trúc này để đếm đảo, lan truyền nhiều nguồn và tìm đường ngắn nhất; phần lõi "hàng đợi với chỉ số đầu hàng" đã có ở <a href="${baiNay('dsa-3-2-queue')}">bài 3.2</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>From memory, write <code>buildAdj(n, edges, directed)</code> in your interview language. Print it for the 5-node example above and compare with the output on this page.</li>
<li>Replace <code>Array.from</code> with <code>new Array(n).fill([])</code> (TypeScript) and run again. Write one sentence explaining what you see.</li>
<li>Draw the graph of LC 997's second example on paper with arrows and write each person's in-degree and out-degree next to them.</li>
<li>Submit LC 1971, LC 997 and LC 463. For each, write: <em>node = …, edge = …, directed? representation?</em></li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, the four-line node/edge note for each, and one sentence about <code>fill([])</code>.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">vertex / node, edge</span><span class="v">The things and the connections between them; V and E count them.</span></div>
  <div class="kv"><span class="k">directed / undirected</span><span class="v">One-way arrows vs. two-way links; undirected = two arcs in an adjacency list.</span></div>
  <div class="kv"><span class="k">degree, in-degree, out-degree</span><span class="v">Edges touching a node; arrows coming in; arrows going out.</span></div>
  <div class="kv"><span class="k">edge list / adjacency list / adjacency matrix</span><span class="v">Pairs; per-node neighbour lists (V + E); a V × V table (V²).</span></div>
  <div class="kv"><span class="k">sparse / dense</span><span class="v">E close to V vs. E close to V²; real graphs are sparse.</span></div>
  <div class="kv"><span class="k">implicit graph</span><span class="v">A graph whose edges are computed by a rule (grid directions, one-letter changes), never stored.</span></div>
  <div class="kv"><span class="k">connected component</span><span class="v">A maximal group of nodes that can all reach each other.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Step 0: say what a node is and what an edge is, then directed/weighted.</li>
<li>Adjacency list by default — O(V + E); matrix only for small dense graphs or O(1) edge checks.</li>
<li>Undirected edge = two arcs; test with source and destination swapped.</li>
<li>Grids are implicit graphs: a direction array plus a bounds check first.</li>
<li>Some problems need only degrees (LC 997) — build only what the question needs.</li>
<li>Never let a client choose the size of an O(n²) allocation.</li>
</ul>
${nguon('🎞️', 'VisuAlgo — Graph data structures', 'Draw a graph and watch its adjacency matrix, adjacency list and edge list update live', 'https://visualgo.net/en/graphds')}
${nguon('📘', 'Adjacency list (Wikipedia)', 'Trade-offs between the representations, with the memory analysis', 'https://en.wikipedia.org/wiki/Adjacency_list')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết <code>buildAdj(n, edges, directed)</code> bằng ngôn ngữ bạn sẽ dùng khi phỏng vấn. In nó ra với ví dụ 5 đỉnh ở trên và so với output trên trang này.</li>
<li>Thay <code>Array.from</code> bằng <code>new Array(n).fill([])</code> (TypeScript) rồi chạy lại. Viết một câu giải thích điều bạn thấy.</li>
<li>Vẽ ra giấy đồ thị của ví dụ thứ hai trong LC 997 với các mũi tên, ghi bậc vào và bậc ra cạnh từng người.</li>
<li>Nộp LC 1971, LC 997 và LC 463. Mỗi đề ghi: <em>đỉnh = …, cạnh = …, có hướng? cách lưu?</em></li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, mỗi đề có ghi chú bốn dòng đỉnh/cạnh, và một câu về <code>fill([])</code>.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">vertex / node (đỉnh), edge (cạnh)</span><span class="v">Các đối tượng và các mối nối giữa chúng; V và E là số lượng của chúng.</span></div>
  <div class="kv"><span class="k">directed / undirected (có hướng / vô hướng)</span><span class="v">Mũi tên một chiều và liên kết hai chiều; vô hướng = hai mũi tên trong danh sách kề.</span></div>
  <div class="kv"><span class="k">degree, in-degree, out-degree (bậc, bậc vào, bậc ra)</span><span class="v">Số cạnh chạm đỉnh; số mũi tên đi vào; số mũi tên đi ra.</span></div>
  <div class="kv"><span class="k">edge list / adjacency list / adjacency matrix (danh sách cạnh / danh sách kề / ma trận kề)</span><span class="v">Các cặp; danh sách láng giềng của từng đỉnh (V + E); bảng V × V (V²).</span></div>
  <div class="kv"><span class="k">sparse / dense (thưa / dày)</span><span class="v">E gần V và E gần V²; đồ thị ngoài đời thường thưa.</span></div>
  <div class="kv"><span class="k">implicit graph (đồ thị ngầm)</span><span class="v">Đồ thị có cạnh tính bằng luật (hướng trong lưới, đổi một chữ cái), không bao giờ lưu ra.</span></div>
  <div class="kv"><span class="k">connected component (thành phần liên thông)</span><span class="v">Nhóm lớn nhất các đỉnh đi tới được lẫn nhau.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bước 0: nói đỉnh là gì, cạnh là gì, rồi có hướng/có trọng số không.</li>
<li>Mặc định danh sách kề — O(V + E); ma trận chỉ cho đồ thị nhỏ và dày hoặc khi cần kiểm cạnh O(1).</li>
<li>Cạnh vô hướng = hai mũi tên; test bằng cách đổi chỗ nguồn và đích.</li>
<li>Lưới là đồ thị ngầm: mảng hướng cộng phép kiểm biên đặt TRƯỚC.</li>
<li>Có đề chỉ cần bậc (LC 997) — chỉ dựng đúng thứ câu hỏi cần.</li>
<li>Đừng bao giờ để client chọn kích thước của một lần cấp phát O(n²).</li>
</ul>
${nguon('🎞️', 'VisuAlgo — Graph data structures', 'Vẽ một đồ thị và xem ma trận kề, danh sách kề, danh sách cạnh cập nhật trực tiếp (tiếng Anh)', 'https://visualgo.net/en/graphds')}
${nguon('📘', 'Adjacency list (Wikipedia)', 'So sánh đánh đổi giữa các cách lưu, kèm phân tích bộ nhớ (tiếng Anh)', 'https://en.wikipedia.org/wiki/Adjacency_list')}
</div>
`,
};
