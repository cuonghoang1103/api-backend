/** 7.4 — Dijkstra, Bellman-Ford có giới hạn và union-find. Mọi mã/output đọc từ ../ma/ch07 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay, doc } from '../_chung.mjs';
import { bangDo, hang, so, lan, oDay } from './_rieng.mjs';
import { vetDijkstra, vetDsu } from '../ma/ch07/dijkstra.vet.mjs';

/* Bảng vết 1: Dijkstra + xoá lười trên LC 743, test 4. */
const vdj = vetDijkstra(4, [[1, 2, 4], [1, 3, 1], [3, 2, 1], [2, 4, 1]], 1);
const vc = (x) => (x === null || x === Infinity ? '∞' : x);
const BANG_DIJ = bangVet(['pop [d, u]', 'what happens', 'dist[1..4] after', 'heap after (smallest first)'],
  vdj.map((h) => [
    `<code>[${h.d}, ${h.u}]</code>`,
    h.cu ? `<strong>stale</strong>: dist[${h.u}] is already ${vc(h.dist[h.u - 1])} &lt; ${h.d} ⇒ skip` : (h.nhe.length ? `settle ${h.u}; relax ${h.nhe.join(' · ')}` : `settle ${h.u}; nothing to improve`),
    oMang(h.dist.map(vc), { to: h.cu ? { [h.u - 1]: 'mo' } : { [h.u - 1]: 'ok' } }),
    oDay(h.heap.map((x) => `[${x[0]},${x[1]}]`)),
  ]));

/* Bảng vết 2: union-find nhận từng cạnh (LC 684, ví dụ 2). */
const vds = vetDsu(5, [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]);
const BANG_DSU = bangVet(['edge', 'find + union', 'parent[1..5] after', 'sets'],
  vds.map((h) => [
    `<code>${h.canh[0]}–${h.canh[1]}</code>`,
    h.thua ? `<strong>${h.txt}</strong>` : h.txt,
    oMang(h.parent, { to: h.thua ? { [h.canh[0] - 1]: 'x', [h.canh[1] - 1]: 'x' } : {}, chiSo: false }),
    String(h.sets),
  ]));

/* Số đo (đọc từ .out). Dijkstra: [mảng, heap]. DSU: [naive, size, compression, both] (ms; số bước nhảy đọc riêng). */
const DT = bangDo('ch07/dijkstra-do.ts');
const DJ = bangDo('ch07/DijkstraDo.java');
const [a10, h10] = hang(DT, 10000);
const [a30, h30] = hang(DT, 30000);
const [, h1m] = hang(DT, 1000000);
const [ja30, jh30] = hang(DJ, 30000);
const UT = bangDo('ch07/dsu-do.ts');
const [n10k] = hang(UT, 10000);
const [n1k] = hang(UT, 1000);
const [, , , b1m] = hang(UT, 1000000);
const HOP = doc('ch07/dsu-do.ts.out').match(/10,000 \|\s+[\d.]+ ms \/ ([\d,]+)/)[1];
const viSo = (s) => s.replace(/,/g, '.');

const DE = [
  [lc(743, 'network-delay-time', 'Network Delay Time', 'Medium'), 'Single-source shortest paths, non-negative weights ⇒ Dijkstra; the answer is the largest distance.', 'Đường ngắn nhất một nguồn, trọng số không âm ⇒ Dijkstra; đáp án là khoảng cách lớn nhất.'],
  [lc(1631, 'path-with-minimum-effort', 'Path With Minimum Effort', 'Medium'), 'Path cost = maximum step, not the sum; Dijkstra still works because max never decreases.', 'Chi phí đường = bước lớn nhất, không phải tổng; Dijkstra vẫn đúng vì max không bao giờ giảm.'],
  [lc(1976, 'number-of-ways-to-arrive-at-destination', 'Number of Ways to Arrive at Destination', 'Medium'), 'Dijkstra plus a count array: equal distance ⇒ add ways, smaller ⇒ reset ways.', 'Dijkstra kèm mảng đếm: bằng khoảng cách ⇒ cộng số cách, nhỏ hơn ⇒ đặt lại số cách.'],
  [lc(787, 'cheapest-flights-within-k-stops', 'Cheapest Flights Within K Stops', 'Medium'), 'A limit on the number of edges ⇒ Bellman-Ford for k + 1 rounds, copying the array each round.', 'Giới hạn số cạnh ⇒ Bellman-Ford k + 1 vòng, sao chép mảng mỗi vòng.'],
  [lc(1334, 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance', 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', 'Medium'), 'All pairs on n ≤ 100: Floyd–Warshall (three loops) or Dijkstra from every city.', 'Mọi cặp với n ≤ 100: Floyd–Warshall (ba vòng lặp) hoặc Dijkstra từ mọi thành phố.'],
  [lc(547, 'number-of-provinces', 'Number of Provinces', 'Medium'), 'Count components from an adjacency matrix: union-find, count the remaining sets.', 'Đếm thành phần liên thông từ ma trận kề: union-find, đếm số tập còn lại.'],
  [lc(684, 'redundant-connection', 'Redundant Connection', 'Medium'), 'The first edge whose two ends already share a root closes the cycle.', 'Cạnh đầu tiên có hai đầu đã chung gốc là cạnh khép chu trình.'],
  [lc(1319, 'number-of-operations-to-make-network-connected', 'Number of Operations to Make Network Connected', 'Medium'), 'Need ≥ n − 1 cables; answer = number of components − 1.', 'Cần ≥ n − 1 dây; đáp án = số thành phần liên thông − 1.'],
  [lc(721, 'accounts-merge', 'Accounts Merge', 'Medium'), 'Union the e-mails of each account; group e-mails by root.', 'Hợp các email của cùng một tài khoản; gom email theo gốc.'],
];

export default {
  title: '7.4 — Weighted shortest paths and union-find: Dijkstra, Bellman-Ford, merging groups|||7.4 — Đường ngắn nhất có trọng số và union-find: Dijkstra, Bellman-Ford, gộp nhóm',
  slug: 'dsa-7-4-dijkstra',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dijkstra với heap tự viết và xoá lười (Network Delay Time), dựng lại đường đi như app bản đồ, Bellman-Ford k+1 vòng cho chuyến bay tối đa k điểm dừng, union-find nén đường + hợp theo kích thước (provinces, redundant connection, accounts merge) — kèm số đo O(V²) vs heap và union-find ngây thơ vs tối ưu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Weighted shortest paths and union-find: Dijkstra, Bellman-Ford with a limit, merging groups</h2>
<p class="lead">Lesson 7.2's BFS finds the fewest <em>edges</em>. The moment edges carry different costs — minutes, prices, latency — "fewest edges" stops meaning "cheapest", and you need <strong>Dijkstra's algorithm</strong>. Add a constraint such as "at most k stops" or a negative weight and Dijkstra itself breaks; <strong>Bellman-Ford</strong> takes over. The second half of the lesson is a different tool for a different question — "are these two in the same group, as connections keep arriving?" — <strong>union-find</strong>, which answers it in almost constant time. Both show up constantly in interviews, and both have measured costs below.</p>

<h3>The everyday picture</h3>
<p><strong>Dijkstra is a maps app.</strong> From your boarding house, the app knows for sure the closest place first (the corner shop, 2 minutes). From there and from home it can now say for sure which place is the next closest, and so on: places get <em>settled</em> in increasing order of travel time, and once settled their time never changes — because every other route would have to pass through somewhere farther away first. That argument needs one thing: no road takes negative time.</p>
<p><strong>Union-find is merging group chats.</strong> Your class has dozens of small chat groups. Each time two groups decide to merge, you do not rewrite everyone's membership — you just say "group B now belongs to group A". To ask "are Lan and Minh in the same group?" you follow each person's "belongs to" pointer up to the top group and compare. Two tricks keep those chains short: hang the smaller group under the bigger one, and, every time you climb a chain, re-point everybody you passed directly to the top.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Đường ngắn nhất có trọng số và union-find: Dijkstra, Bellman-Ford có giới hạn, gộp nhóm</h2>
<p class="lead">BFS ở bài 7.2 tìm đường ít <em>cạnh</em> nhất. Ngay khi các cạnh mang chi phí khác nhau — số phút, giá tiền, độ trễ mạng — "ít cạnh nhất" không còn nghĩa là "rẻ nhất", và bạn cần <strong>thuật toán Dijkstra</strong>. Thêm một ràng buộc như "tối đa k điểm dừng" hay một trọng số âm thì chính Dijkstra gãy; <strong>Bellman-Ford</strong> vào thay. Nửa sau của bài là một công cụ khác cho một câu hỏi khác — "hai người này có cùng nhóm không, khi các liên kết cứ tới dần?" — <strong>union-find</strong> (hợp-tìm), trả lời gần như trong thời gian hằng số. Cả hai xuất hiện liên tục khi phỏng vấn, và cả hai đều có số đo chi phí thật ở dưới.</p>

<h3>Hình dung đời thường</h3>
<p><strong>Dijkstra là một app bản đồ.</strong> Từ nhà trọ của bạn, app biết chắc chắn nơi gần nhất trước tiên (tạp hoá đầu ngõ, 2 phút). Từ đó và từ nhà, nó lại nói chắc được nơi gần thứ nhì, cứ thế: các địa điểm được <em>chốt</em> (settle) theo thứ tự thời gian đi tăng dần, và đã chốt thì thời gian không bao giờ đổi nữa — vì mọi lối khác đều phải đi qua một nơi xa hơn trước đã. Lập luận đó cần đúng một điều: không con đường nào tốn thời gian âm.</p>
<p><strong>Union-find là gộp nhóm chat.</strong> Lớp bạn có hàng chục nhóm chat nhỏ. Mỗi lần hai nhóm quyết định gộp lại, bạn không viết lại danh sách thành viên của tất cả — bạn chỉ ghi "nhóm B giờ thuộc nhóm A". Để hỏi "Lan và Minh có chung nhóm không?", bạn lần theo con trỏ "thuộc về" của mỗi người lên tới nhóm trên cùng rồi so. Hai mẹo giữ cho các chuỗi đó ngắn: treo nhóm nhỏ dưới nhóm lớn, và mỗi lần leo một chuỗi, trỏ thẳng mọi người đã đi qua lên đỉnh.</p>
${csd('csd201-dijkstra', 'vi', '5.5 Dijkstra từng bước', '<p>CSD201 đã chạy Dijkstra từng bước bằng bảng và chứng minh vì sao nó đúng với trọng số không âm. <strong>Ở đây đi sâu thêm:</strong> bản heap + xoá lười mà người phỏng vấn mong đợi (kèm heap tự viết cho TypeScript), số đo O(V²) so với O(E log V), biến thể "tối đa k điểm dừng" khiến Dijkstra sai, và bẫy trọng số âm chạy thật.</p>')}
${csd('csd201-dijkstra-mst', 'vi', 'A.2 Union-Find &amp; phân tích khấu hao', '<p>Bài CSD201 giới thiệu union-find và phân tích khấu hao của nó. Ở đây ta dùng nó như công cụ phỏng vấn: khuôn 20 dòng, ba đề kinh điển (provinces, redundant connection, accounts merge), và số đo cho thấy bản ngây thơ chậm tới mức nào.</p>')}
</div>

<div class="ml-en">
<h3>Signals: which shortest-path / grouping tool?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">no weights (or all equal)</span><span class="v">BFS — lesson 7.2. Dijkstra works but is slower and longer.</span></div>
  <div class="kv"><span class="k">weights ≥ 0, one source, "minimum time / cost / delay"</span><span class="v">Dijkstra with a min-heap, O((V + E) log V).</span></div>
  <div class="kv"><span class="k">"at most k stops / edges", or negative weights</span><span class="v">Bellman-Ford: k + 1 rounds (or V − 1 rounds) of relaxing every edge.</span></div>
  <div class="kv"><span class="k">path cost is the maximum (or minimum) along the path</span><span class="v">Still Dijkstra with max instead of +, or binary search on the answer + BFS (lesson 4.3).</span></div>
  <div class="kv"><span class="k">"same group?", "how many groups", edges arrive one by one</span><span class="v">Union-find: near-O(1) per union and per query.</span></div>
  <div class="kv"><span class="k">"minimum cost to connect everything"</span><span class="v">Minimum spanning tree: sort edges + union-find (Kruskal) — practice set 7.5.</span></div>
</div>
<h3>Dijkstra in four moves</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">dist[s] = 0, others ∞</span><span class="lz-d">heap = [[0, s]]</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Pop the smallest [d, u]</span><span class="lz-d">d &gt; dist[u]? stale ⇒ skip</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Relax every edge u → v</span><span class="lz-d">d + w &lt; dist[v] ⇒ update, push [dist[v], v]</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Heap empty</span><span class="lz-d">dist holds every shortest distance</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: công cụ đường ngắn nhất / gộp nhóm nào?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">không có trọng số (hoặc bằng nhau hết)</span><span class="v">BFS — bài 7.2. Dijkstra cũng đúng nhưng chậm hơn và dài hơn.</span></div>
  <div class="kv"><span class="k">trọng số ≥ 0, một nguồn, "thời gian / chi phí / độ trễ nhỏ nhất"</span><span class="v">Dijkstra với min-heap, O((V + E) log V).</span></div>
  <div class="kv"><span class="k">"tối đa k điểm dừng / k cạnh", hoặc trọng số âm</span><span class="v">Bellman-Ford: k + 1 vòng (hoặc V − 1 vòng) nới lỏng mọi cạnh.</span></div>
  <div class="kv"><span class="k">chi phí đường đi là giá trị lớn nhất (hoặc nhỏ nhất) dọc đường</span><span class="v">Vẫn là Dijkstra với max thay cho +, hoặc tìm nhị phân trên đáp án + BFS (bài 4.3).</span></div>
  <div class="kv"><span class="k">"cùng nhóm không?", "có bao nhiêu nhóm", cạnh tới từng cái một</span><span class="v">Union-find: gần O(1) mỗi lần hợp và mỗi lần hỏi.</span></div>
  <div class="kv"><span class="k">"chi phí nhỏ nhất để nối tất cả"</span><span class="v">Cây khung nhỏ nhất: sắp cạnh + union-find (Kruskal) — bộ luyện 7.5.</span></div>
</div>
<h3>Dijkstra trong bốn nước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">dist[s] = 0, còn lại ∞</span><span class="lz-d">heap = [[0, s]]</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lấy [d, u] nhỏ nhất</span><span class="lz-d">d &gt; dist[u]? cũ rồi ⇒ bỏ qua</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nới lỏng mọi cạnh u → v</span><span class="lz-d">d + w &lt; dist[v] ⇒ cập nhật, đẩy [dist[v], v]</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Heap rỗng</span><span class="lz-d">dist chứa mọi khoảng cách ngắn nhất</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Network Delay Time (LC 743)</h3>
<p><strong>Problem (in our words).</strong> n network nodes labelled 1..n and directed edges <code>times[i] = [u, v, w]</code>: a signal from u reaches v after w milliseconds. A signal is sent from node k. How long until every node has received it? If some node never does, return −1. Example: edges 2→1, 2→3, 3→4 all with weight 1, k = 2 → 2.</p>
<p><strong>Translate.</strong> "When does node v receive the signal?" = the shortest-path distance from k to v. "Every node has it" = the <em>largest</em> of those distances. So: single-source shortest paths with non-negative weights, then take the max — Dijkstra.</p>
<p><strong>Why not BFS?</strong> BFS settles nodes in order of <em>number of edges</em>. In the fourth test, 1 → 2 costs 4 directly but only 2 via 1 → 3 → 2. BFS would fix node 2 at 4 when it first meets it. Dijkstra replaces the FIFO queue with a <strong>priority queue keyed by distance</strong>, so the closest unsettled node always comes out next.</p>
<p><strong>Lazy deletion.</strong> When we find a better distance for v we cannot cheaply "decrease" its entry inside a binary heap, so we simply push a new entry <code>[newDist, v]</code> and leave the old one in. When the old one is popped later, its d is larger than <code>dist[v]</code>: it is <em>stale</em> and we skip it. The heap may hold up to E entries, so the cost is O(E log E) = O(E log V) — what every interviewer expects. JavaScript has no built-in heap, so TypeScript solutions carry a 25-line <code>MinHeap</code> (Chapter 6 builds it in detail); Java has <code>PriorityQueue</code>.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Network Delay Time (LC 743 — thời gian trễ của mạng)</h3>
<p><strong>Đề (diễn đạt lại).</strong> n nút mạng đánh số 1..n và các cạnh có hướng <code>times[i] = [u, v, w]</code>: tín hiệu từ u tới v sau w mili-giây. Một tín hiệu phát đi từ nút k. Sau bao lâu thì mọi nút đều nhận được? Có nút không bao giờ nhận được thì trả về −1. Ví dụ: các cạnh 2→1, 2→3, 3→4 đều nặng 1, k = 2 → 2.</p>
<p><strong>Dịch đề.</strong> "Khi nào nút v nhận tín hiệu?" = khoảng cách đường ngắn nhất từ k tới v. "Mọi nút đều có" = khoảng cách <em>lớn nhất</em> trong số đó. Vậy: đường ngắn nhất một nguồn với trọng số không âm, rồi lấy max — Dijkstra.</p>
<p><strong>Sao không dùng BFS?</strong> BFS chốt các đỉnh theo thứ tự <em>số cạnh</em>. Ở test thứ tư, 1 → 2 đi thẳng tốn 4 nhưng đi 1 → 3 → 2 chỉ tốn 2. BFS sẽ chốt nút 2 ở mức 4 ngay lần đầu gặp. Dijkstra thay hàng đợi FIFO bằng <strong>hàng đợi ưu tiên theo khoảng cách</strong> (priority queue), nên đỉnh chưa chốt gần nhất luôn được lấy ra kế tiếp.</p>
<p><strong>Xoá lười (lazy deletion).</strong> Khi tìm được khoảng cách tốt hơn cho v, ta không thể "giảm" phần tử của nó bên trong heap nhị phân một cách rẻ, nên ta cứ đẩy thêm một phần tử mới <code>[newDist, v]</code> và để phần tử cũ nằm đó. Khi phần tử cũ bị lấy ra sau này, d của nó lớn hơn <code>dist[v]</code>: nó đã <em>cũ</em> (stale) và ta bỏ qua. Heap có thể chứa tới E phần tử, nên chi phí là O(E log E) = O(E log V) — đúng thứ mọi người phỏng vấn mong đợi. JavaScript không có heap dựng sẵn, nên lời giải TypeScript mang theo một <code>MinHeap</code> 25 dòng (Chương 6 dựng nó chi tiết); Java có <code>PriorityQueue</code>.</p>
</div>
${ma('ch07/network-delay.ts', { vung: 'heap', nhan: 'TypeScript — MinHeap' })}
${maHai('ch07/network-delay.ts', 'ch07/NetworkDelay.java', { vung: 'dijkstra' })}
${ketQua('ch07/network-delay.ts')}
${ketQua('ch07/NetworkDelay.java')}
<div class="ml-en">
<p>Here is the fourth test, step by step. Green = the node settled in this row; grey = a stale pop.</p>
</div>
<div class="ml-vi">
<p>Dưới đây là test thứ tư từng bước. Ô xanh lá = đỉnh được chốt ở hàng đó; ô xám = một lần lấy ra phần tử cũ.</p>
</div>
${BANG_DIJ}
<div class="ml-en">
<p>Node 2 is pushed twice: first as <code>[4, 2]</code> (direct edge), then as <code>[2, 2]</code> (through 3). The better copy comes out first and settles 2 at 2; the old <code>[4, 2]</code> comes out last and is skipped by the single line <code>if (d &gt; dist[u]) continue</code>. Without that line the algorithm is still correct here but re-relaxes edges from stale entries — on dense graphs that is a lot of wasted work. In Java, note the comparator: <code>Integer.compare(a[0], b[0])</code>, never <code>a[0] - b[0]</code>, which overflows for large distances (Chapter 6's heap trap).</p>
</div>
<div class="ml-vi">
<p>Nút 2 bị đẩy vào hai lần: lần đầu là <code>[4, 2]</code> (cạnh thẳng), sau đó là <code>[2, 2]</code> (qua 3). Bản tốt hơn ra trước và chốt 2 ở mức 2; bản cũ <code>[4, 2]</code> ra sau cùng và bị bỏ qua nhờ đúng một dòng <code>if (d &gt; dist[u]) continue</code>. Thiếu dòng đó, ở đây thuật toán vẫn đúng nhưng sẽ nới lỏng lại các cạnh từ phần tử cũ — trên đồ thị dày đó là rất nhiều việc phí. Trong Java, để ý bộ so sánh: <code>Integer.compare(a[0], b[0])</code>, không bao giờ <code>a[0] - b[0]</code>, vì phép trừ tràn số với khoảng cách lớn (bẫy heap của Chương 6).</p>
</div>

<div class="ml-en">
<h3>A tiny maps app: rebuilding the route</h3>
<p>Interviews often follow up with "now print the route". Keep a <code>parent</code> array exactly as in BFS: whenever <code>dist[v]</code> improves through u, set <code>parent[v] = u</code>; at the end walk parents back from the target. The example uses places around FPTU HCMC with <strong>made-up</strong> travel minutes, and the simple O(V²) array version of Dijkstra, which is perfectly fine for six places. Then a traffic jam raises one road from 6 to 15 minutes and we run it again.</p>
</div>
<div class="ml-vi">
<h3>Một app bản đồ tí hon: dựng lại lộ trình</h3>
<p>Phỏng vấn hay nối tiếp bằng "giờ in ra lộ trình đi". Giữ một mảng <code>parent</code> y như BFS: mỗi khi <code>dist[v]</code> được cải thiện nhờ u, đặt <code>parent[v] = u</code>; cuối cùng lần ngược parent từ đích. Ví dụ dùng các địa điểm quanh FPTU HCM với số phút <strong>tự đặt</strong> (không phải dữ liệu giao thông thật), và bản Dijkstra mảng O(V²) đơn giản, hoàn toàn ổn cho sáu địa điểm. Sau đó một vụ kẹt xe làm một đoạn đường tăng từ 6 lên 15 phút và ta chạy lại.</p>
</div>
${maHai('ch07/ban-do.ts', 'ch07/BanDo.java', { vung: 'duong' })}
${ketQua('ch07/ban-do.ts')}
<div class="ml-en">
<p>13 minutes through Vincom and the Man Thien junction; with the jam the best route switches to 15 minutes through Thu Duc crossroads and Suoi Tien — the "re-routing" every maps app does, which is nothing but running shortest paths again on new weights (real apps use far faster variants on top of the same idea: A* with a distance heuristic, and precomputed "contraction hierarchies" that skip unimportant roads).</p>
${moPhong('ch07/dijkstra.sim.js', 'en', 'Dijkstra on the map around FPTU, with the heap in the log', 'Watch places get settled in increasing order of minutes; relaxed roads light up and stale heap entries are skipped.')}
</div>
<div class="ml-vi">
<p>13 phút qua Vincom và ngã ba Man Thiện; khi kẹt xe, lộ trình tốt nhất chuyển sang 15 phút qua ngã tư Thủ Đức và Suối Tiên — đúng việc "tìm đường lại" mà mọi app bản đồ làm, không gì khác ngoài chạy lại đường ngắn nhất trên trọng số mới (app thật dùng các biến thể nhanh hơn rất nhiều dựng trên cùng ý tưởng: A* với hàm ước lượng khoảng cách, và "contraction hierarchies" tính trước để bỏ qua những con đường không quan trọng).</p>
${moPhong('ch07/dijkstra.sim.js', 'vi', 'Dijkstra trên bản đồ quanh FPTU, heap in trong nhật ký', 'Xem các địa điểm được chốt theo số phút tăng dần; con đường vừa được nới lỏng sáng lên và các phần tử heap cũ bị bỏ qua.')}
</div>

<div class="ml-en">
<h3>Array or heap? Measured</h3>
<p>The O(V²) version picks the next node by scanning all V of them; the heap version pays log V per push/pop. On a sparse graph (E = 4V) that is the difference between V² and E log V:</p>
</div>
<div class="ml-vi">
<h3>Mảng hay heap? Đo bằng số</h3>
<p>Bản O(V²) chọn đỉnh kế tiếp bằng cách quét cả V đỉnh; bản heap trả log V cho mỗi lần đẩy/lấy. Trên đồ thị thưa (E = 4V) đó là khác biệt giữa V² và E log V:</p>
</div>
${ma('ch07/dijkstra-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch07/dijkstra-do.ts')}
${ketQua('ch07/DijkstraDo.java')}
<div class="ml-en">
<p>At 1,000 nodes the two are equal. From 10,000 to 30,000 nodes (3×) the array version grew ${lan(a30, a10)}× in Node (V² predicts 9×, and the bigger <code>dist</code> array starts missing the CPU cache) while the heap version grew ${lan(h30, h10)}×. At 30,000 nodes it is ${so(a30, 0)} ms against ${so(h30, 1)} ms — ${lan(a30, h30)}× — and Java shows the same shape (${so(ja30, 0)} vs ${so(jh30, 1)} ms). The heap version handles a million nodes in ${so(h1m, 0)} ms. So: the array version is fine (and shorter) for V up to a few thousand or for dense graphs where E ≈ V²; with V = 10⁵ in the constraints, only the heap passes.</p>
</div>
<div class="ml-vi">
<p>Ở 1.000 đỉnh hai bản ngang nhau. Từ 10.000 lên 30.000 đỉnh (gấp 3), bản mảng tăng ${lan(a30, a10, 'vi')} lần trên Node (V² dự đoán 9 lần, và mảng <code>dist</code> lớn hơn bắt đầu trượt khỏi bộ nhớ đệm CPU) còn bản heap tăng ${lan(h30, h10, 'vi')} lần. Ở 30.000 đỉnh là ${so(a30, 0, 'vi')} ms so với ${so(h30, 1, 'vi')} ms — gấp ${lan(a30, h30, 'vi')} lần — và Java cho cùng hình dạng (${so(ja30, 0, 'vi')} so với ${so(jh30, 1, 'vi')} ms). Bản heap xử lý một triệu đỉnh trong ${so(h1m, 0, 'vi')} ms. Vậy: bản mảng ổn (và ngắn hơn) khi V tới vài nghìn hoặc với đồ thị dày E ≈ V²; ràng buộc V = 10⁵ thì chỉ bản heap qua được.</p>
</div>

<div class="ml-en">
<h3>When Dijkstra is the wrong tool: Cheapest Flights Within K Stops (LC 787)</h3>
<p>Flights <code>[from, to, price]</code>; find the cheapest price from <code>src</code> to <code>dst</code> using <strong>at most k stops</strong> (k + 1 flights), or −1. The trap: plain Dijkstra on price settles a city at its cheapest price — but that cheapest route might use too many stops, while a slightly dearer route with fewer stops was the only one that could continue to <code>dst</code> within the limit. "Cheapest so far" is no longer the whole state.</p>
<p><strong>Bellman-Ford</strong> fits the limit naturally. One <em>round</em> relaxes every edge once; after round r, <code>cost[v]</code> is the cheapest price using at most r + 1 flights — <em>provided</em> each round reads only the previous round's prices. That is why we relax into a copy, <code>next</code>. Run k + 1 rounds: O(k·E). (Without a limit, V − 1 rounds give shortest paths even with negative weights, and a V-th round that still improves something proves a negative cycle.)</p>
</div>
<div class="ml-vi">
<h3>Khi Dijkstra là công cụ sai: Cheapest Flights Within K Stops (LC 787 — chuyến bay rẻ nhất tối đa k điểm dừng)</h3>
<p>Các chuyến bay <code>[from, to, price]</code>; tìm giá rẻ nhất từ <code>src</code> tới <code>dst</code> với <strong>tối đa k điểm dừng</strong> (k + 1 chuyến bay), hoặc −1. Cái bẫy: Dijkstra thường theo giá sẽ chốt một thành phố ở mức giá rẻ nhất — nhưng lộ trình rẻ nhất đó có thể dùng quá nhiều điểm dừng, trong khi một lộ trình đắt hơn chút mà ít điểm dừng hơn mới là lộ trình duy nhất còn đi tiếp tới <code>dst</code> trong giới hạn. "Rẻ nhất tới giờ" không còn là toàn bộ trạng thái nữa.</p>
<p><strong>Bellman-Ford</strong> hợp với giới hạn một cách tự nhiên. Một <em>vòng</em> nới lỏng mọi cạnh một lần; sau vòng r, <code>cost[v]</code> là giá rẻ nhất dùng tối đa r + 1 chuyến bay — <em>với điều kiện</em> mỗi vòng chỉ đọc giá của vòng trước. Đó là lý do ta nới lỏng vào một bản sao, <code>next</code>. Chạy k + 1 vòng: O(k·E). (Không có giới hạn thì V − 1 vòng cho đường ngắn nhất kể cả với trọng số âm, và nếu vòng thứ V vẫn còn cải thiện được thì chứng tỏ có chu trình âm.)</p>
</div>
${maHai('ch07/cheapest-flights.ts', 'ch07/CheapestFlights.java', { vung: 'dung' })}
${ma('ch07/cheapest-flights.ts', { vung: 'sai', nhan: 'TypeScript — wrong (no copy)' })}
${ketQua('ch07/cheapest-flights.ts')}
<div class="ml-en">
<p>First line: with 1 stop the best is 0 → 1 → 3 = 700; allowing 2 stops finds 0 → 1 → 2 → 3 = 400. Last line: without the copy, one round let the price of city 1 (set moments earlier in the same round) flow on to city 2, so a 2-flight route was accepted when k = 0 allowed only one flight — 200 instead of 500. The bug depends on the order of the edges in the input, which is why it hides in some tests and not others.</p>
</div>
<div class="ml-vi">
<p>Dòng đầu: với 1 điểm dừng, rẻ nhất là 0 → 1 → 3 = 700; cho phép 2 điểm dừng thì tìm được 0 → 1 → 2 → 3 = 400. Dòng cuối: không sao chép, một vòng đã để giá của thành phố 1 (vừa đặt ngay trong vòng đó) chảy tiếp sang thành phố 2, nên một lộ trình 2 chuyến được chấp nhận khi k = 0 chỉ cho phép một chuyến — 200 thay vì 500. Lỗi này phụ thuộc thứ tự các cạnh trong đầu vào, nên nó trốn được ở test này mà lộ ra ở test khác.</p>
</div>

<div class="ml-en">
<h3>Variant: the cost of a path is its worst step (LC 1631)</h3>
<p>Path With Minimum Effort: walk from the top-left to the bottom-right of a height grid; a route's effort is the <em>largest</em> height difference between consecutive cells; minimise it. Replace <code>d + w</code> by <code>max(d, w)</code> and Dijkstra still works, because extending a path can never make its cost smaller — the property the "settle the closest" argument needs. Compared with Network Delay Time, only the line computing <code>ne</code> changes:</p>
</div>
<div class="ml-vi">
<h3>Biến thể: chi phí của đường đi là bước tệ nhất (LC 1631)</h3>
<p>Path With Minimum Effort (đường đi tốn sức ít nhất): đi từ góc trên-trái tới góc dưới-phải của một lưới độ cao; độ tốn sức của một lộ trình là chênh lệch độ cao <em>lớn nhất</em> giữa hai ô liên tiếp; hãy làm nó nhỏ nhất. Thay <code>d + w</code> bằng <code>max(d, w)</code> thì Dijkstra vẫn đúng, vì kéo dài một đường không bao giờ làm chi phí của nó nhỏ đi — đúng tính chất mà lập luận "chốt đỉnh gần nhất" cần. So với Network Delay Time, chỉ dòng tính <code>ne</code> là khác:</p>
</div>
${maHai('ch07/min-effort.ts', 'ch07/MinEffort.java', { vung: 'giai' })}
${ketQua('ch07/min-effort.ts')}

<div class="ml-en">
<h3>Union-find: "same group?" in almost O(1)</h3>
<p>A <strong>disjoint set union</strong> (DSU, union-find) keeps a forest: every element points to a <code>parent</code>, and the element at the top of each tree, its <strong>root</strong>, names the group. <code>find(x)</code> climbs to the root; <code>union(a, b)</code> finds both roots and, if they differ, hangs one under the other. Two optimisations make every operation nearly constant time — formally O(α(n)), where α, the inverse Ackermann function, is below 5 for any n that fits in the universe:</p>
<ul>
<li><strong>Union by size</strong> (or by rank): hang the smaller tree under the bigger one, so a tree of height h has at least 2ʰ elements — height stays O(log n).</li>
<li><strong>Path compression</strong>: after <code>find(x)</code> reaches the root, re-point every node on the way directly to it. Our version does two passes in a loop — no recursion, so a long chain cannot overflow the stack.</li>
</ul>
<p>The same <code>union</code> returning <code>false</code> is the cycle detector of an undirected graph: an edge whose two ends already share a root closes a cycle (Redundant Connection, LC 684). And counting successful unions gives the number of components (Number of Provinces, LC 547, whose input is an adjacency matrix — lesson 7.1).</p>
</div>
<div class="ml-vi">
<h3>Union-find: "cùng nhóm không?" trong gần O(1)</h3>
<p><strong>Disjoint set union</strong> (DSU — hợp các tập rời nhau, còn gọi union-find) giữ một rừng cây: mỗi phần tử trỏ tới một <code>parent</code> (cha), và phần tử trên cùng của mỗi cây, gọi là <strong>gốc</strong> (root), đại diện cho cả nhóm. <code>find(x)</code> leo lên tới gốc; <code>union(a, b)</code> tìm hai gốc và nếu khác nhau thì treo cây này dưới cây kia. Hai tối ưu làm mọi thao tác gần như hằng số — chính xác là O(α(n)), trong đó α, hàm Ackermann ngược, nhỏ hơn 5 với mọi n có thể tồn tại trong vũ trụ:</p>
<ul>
<li><strong>Hợp theo kích thước</strong> (union by size, hoặc theo hạng — rank): treo cây nhỏ dưới cây lớn, nên một cây cao h có ít nhất 2ʰ phần tử — chiều cao giữ ở mức O(log n).</li>
<li><strong>Nén đường</strong> (path compression): sau khi <code>find(x)</code> tới gốc, trỏ thẳng mọi nút đã đi qua lên gốc. Bản của ta làm hai lượt bằng vòng lặp — không đệ quy, nên một chuỗi dài không thể làm tràn stack.</li>
</ul>
<p>Cùng hàm <code>union</code> đó, khi trả về <code>false</code>, chính là bộ phát hiện chu trình của đồ thị vô hướng: một cạnh có hai đầu đã chung gốc thì khép một chu trình (Redundant Connection, LC 684). Và đếm số lần hợp thành công cho ra số thành phần liên thông (Number of Provinces, LC 547, đầu vào là ma trận kề — bài 7.1).</p>
</div>
${maHai('ch07/union-find.ts', 'ch07/UnionFind.java', { vung: 'dsu' })}
${maHai('ch07/union-find.ts', 'ch07/UnionFind.java', { vung: 'provinces' })}
${maHai('ch07/union-find.ts', 'ch07/UnionFind.java', { vung: 'redundant' })}
${ketQua('ch07/union-find.ts')}
${ketQua('ch07/UnionFind.java')}
<div class="ml-en">
<p>Redundant Connection's second example, one edge per row. Red = the two ends of the edge that closes the cycle.</p>
</div>
<div class="ml-vi">
<p>Ví dụ thứ hai của Redundant Connection, mỗi hàng một cạnh. Ô đỏ = hai đầu của cạnh khép chu trình.</p>
</div>
${BANG_DSU}
<div class="ml-en">
<p>Thanks to union by size, every new node is hung directly under root 1, so all trees stay one level deep. At edge 1–4 both ends already have root 1: adding it would create the cycle 1–2–3–4–1, so it is the answer <code>[1, 4]</code> — the second output line. LC 684 asks, if several edges could be removed, for the one that appears <em>last</em> in the input: every edge of the cycle qualifies, and the cycle only closes when its last edge arrives — so the single edge that fails <code>union</code> is exactly the right one.</p>
${moPhong('ch07/dsu.sim.js', 'en', 'Union-find on Redundant Connection: the parent array, edge by edge', 'The array panel shows parent[1..5] changing; the edge that finds both ends under the same root is reported as the answer.')}
</div>
<div class="ml-vi">
<p>Nhờ hợp theo kích thước, mỗi nút mới được treo thẳng dưới gốc 1, nên mọi cây chỉ sâu một tầng. Tới cạnh 1–4, hai đầu đã cùng gốc 1: thêm nó sẽ tạo chu trình 1–2–3–4–1, nên nó là đáp án <code>[1, 4]</code> — dòng output thứ hai. LC 684 yêu cầu, nếu có nhiều cạnh bỏ được, thì trả cạnh xuất hiện <em>sau cùng</em> trong đầu vào: mọi cạnh của chu trình đều bỏ được, và chu trình chỉ khép lại khi cạnh cuối của nó tới — nên cạnh duy nhất làm <code>union</code> thất bại chính là đáp án.</p>
${moPhong('ch07/dsu.sim.js', 'vi', 'Union-find trên Redundant Connection: mảng parent qua từng cạnh', 'Khung mảng cho thấy parent[1..5] thay đổi; cạnh có hai đầu cùng gốc được báo là đáp án.')}
</div>

<div class="ml-en">
<h3>How much do the two optimisations buy? Measured</h3>
<p>The worst case for a naive union-find: unions (0, 1), (1, 2), … each hang the old root under the next element, building one chain of length n; then n calls to <code>find(0)</code> each climb the whole chain. We count pointer hops (deterministic) and time:</p>
</div>
<div class="ml-vi">
<h3>Hai tối ưu đó đáng giá bao nhiêu? Đo bằng số</h3>
<p>Trường hợp xấu nhất của union-find ngây thơ: các lần hợp (0, 1), (1, 2), … mỗi lần treo gốc cũ dưới phần tử kế tiếp, dựng thành một chuỗi dài n; rồi n lần gọi <code>find(0)</code>, mỗi lần leo cả chuỗi. Ta đếm số bước nhảy con trỏ (tất định) và thời gian:</p>
</div>
${ma('ch07/dsu-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch07/dsu-do.ts')}
${ketQua('ch07/DsuDo.java')}
<div class="ml-en">
<p>The naive version makes n² hops: ${HOP} for n = 10,000, which took ${so(n10k, 0)} ms (versus ${so(n1k, 1)} ms at n = 1,000 — 10× the input, about ${lan(n10k, n1k)}× the time). At n = 10⁵ it would be 10¹⁰ hops, so it was skipped. Every optimised version stays at about 2n hops and handles a million elements in ${so(b1m, 0)} ms. On this particular input <em>either</em> optimisation alone is enough; other inputs defeat each one alone (path compression alone is O(log n) amortised, union by size alone is O(log n) per find). Use both — they are three extra lines — and you get the α(n) guarantee on every input.</p>
</div>
<div class="ml-vi">
<p>Bản ngây thơ nhảy n² bước: ${viSo(HOP)} bước với n = 10.000, tốn ${so(n10k, 0, 'vi')} ms (so với ${so(n1k, 1, 'vi')} ms ở n = 1.000 — đầu vào gấp 10, thời gian gấp khoảng ${lan(n10k, n1k, 'vi')} lần). Ở n = 10⁵ sẽ là 10¹⁰ bước nên không chạy. Mọi bản đã tối ưu đều giữ ở khoảng 2n bước và xử lý một triệu phần tử trong ${so(b1m, 0, 'vi')} ms. Trên đúng đầu vào này, <em>chỉ một</em> trong hai tối ưu cũng đủ; có những đầu vào khác đánh bại từng cái khi dùng một mình (chỉ nén đường là O(log n) khấu hao, chỉ hợp theo kích thước là O(log n) mỗi lần find). Dùng cả hai — chỉ thêm ba dòng — là có bảo đảm α(n) trên mọi đầu vào.</p>
</div>

<div class="ml-en">
<h3>Accounts Merge (LC 721): union-find on strings</h3>
<p>Each account is <code>[name, email1, email2, …]</code>. Two accounts belong to the same person if they share any e-mail (two different people can share a name). Merge them and return each person's name followed by their e-mails, sorted. The graph: nodes are e-mails, and each account connects its e-mails. Map every e-mail to an integer id so the DSU can use arrays, union every e-mail of an account with the account's first e-mail, then group e-mails by root. Here <code>find</code> uses <em>path halving</em> (<code>parent[x] = parent[parent[x]]</code> while climbing) — a one-line form of compression that is easy to write under pressure.</p>
</div>
<div class="ml-vi">
<h3>Accounts Merge (LC 721 — gộp tài khoản): union-find trên chuỗi</h3>
<p>Mỗi tài khoản là <code>[tên, email1, email2, …]</code>. Hai tài khoản thuộc cùng một người nếu chúng chung bất kỳ email nào (hai người khác nhau có thể trùng tên). Gộp chúng lại và trả về tên mỗi người kèm các email đã sắp xếp. Đồ thị: đỉnh là email, mỗi tài khoản nối các email của nó với nhau. Ánh xạ mỗi email thành một số nguyên để DSU dùng mảng, hợp mọi email của một tài khoản với email đầu tiên của tài khoản đó, rồi gom email theo gốc. Ở đây <code>find</code> dùng <em>chia đôi đường</em> (path halving — <code>parent[x] = parent[parent[x]]</code> trong lúc leo) — dạng nén đường một dòng, dễ viết khi đang căng thẳng.</p>
</div>
${maHai('ch07/accounts-merge.ts', 'ch07/AccountsMerge.java', { vung: 'giai' })}
${ketQua('ch07/accounts-merge.ts')}
<div class="ml-en">
<p>The second test is the one that catches half-solutions: account 2 (<code>c@x.vn</code>) shares nothing with account 1 (<code>a, b</code>) directly, but account 3 contains both <code>c</code> and <code>b</code>, so all three merge — connectivity is transitive, which is exactly what union-find computes and what a "compare each pair of accounts once" loop misses.</p>
</div>
<div class="ml-vi">
<p>Test thứ hai là test bắt các lời giải nửa vời: tài khoản 2 (<code>c@x.vn</code>) không chung gì trực tiếp với tài khoản 1 (<code>a, b</code>), nhưng tài khoản 3 chứa cả <code>c</code> lẫn <code>b</code>, nên cả ba gộp lại — tính liên thông có tính bắc cầu, đúng thứ union-find tính được và thứ mà vòng lặp "so từng cặp tài khoản một lần" bỏ sót.</p>
</div>

<div class="ml-en">
<h3>Where these algorithms live in real systems</h3>
<ul>
<li><strong>Internet routing.</strong> OSPF, the routing protocol inside most company and ISP networks, is Dijkstra in production: every router floods the cost of its links to the others, then runs a shortest-path-first computation (RFC 2328) to build its forwarding table. "Network Delay Time" is that computation with one source.</li>
<li><strong>Maps and ride-hailing.</strong> Route planning and ETA are shortest paths on road graphs with time-dependent weights; the production algorithms (A*, contraction hierarchies) are Dijkstra plus preprocessing.</li>
<li><strong>Merging records.</strong> "Is this customer the same as that one?" — CRM de-duplication, fraud rings sharing phones or cards, merging a guest checkout into an existing account — is Accounts Merge: union records that share a strong identifier, then read groups off the roots.</li>
<li><strong>Kruskal's minimum spanning tree</strong> (sort edges by cost, add an edge when <code>union</code> succeeds) designs the cheapest cable or pipe network that connects everything — practice set 7.5 does it on points.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Các thuật toán này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Định tuyến Internet.</strong> OSPF, giao thức định tuyến bên trong phần lớn mạng công ty và nhà mạng, chính là Dijkstra chạy thật: mỗi router phát chi phí các đường nối của nó cho các router khác, rồi chạy phép tính shortest-path-first (RFC 2328) để dựng bảng chuyển tiếp. "Network Delay Time" là đúng phép tính đó với một nguồn.</li>
<li><strong>Bản đồ và gọi xe.</strong> Lên lộ trình và ước tính thời gian tới (ETA) là đường ngắn nhất trên đồ thị đường phố với trọng số đổi theo giờ; các thuật toán chạy thật (A*, contraction hierarchies) là Dijkstra cộng tiền xử lý.</li>
<li><strong>Gộp hồ sơ.</strong> "Khách hàng này có phải người kia không?" — khử trùng dữ liệu khách hàng (CRM), các đường dây gian lận dùng chung số điện thoại hay thẻ, gộp đơn mua không đăng nhập vào tài khoản có sẵn — chính là Accounts Merge: hợp các hồ sơ chung một định danh mạnh, rồi đọc nhóm từ các gốc.</li>
<li><strong>Cây khung nhỏ nhất Kruskal</strong> (sắp cạnh theo chi phí, thêm cạnh khi <code>union</code> thành công) thiết kế mạng cáp hay ống rẻ nhất nối tất cả — bộ luyện 7.5 làm điều đó trên các điểm.</li>
</ul>
${csd('csd201-mst', 'vi', '5.6 Cây khung nhỏ nhất: Prim &amp; Kruskal', '<p>CSD201 đã dạy Prim và Kruskal. Kruskal chính là "sắp cạnh + union-find" của bài này; đề LC 1584 ở bộ luyện 7.5 dùng đúng khuôn DSU ở trên.</p>')}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: who controls the weights, who controls the merge key?</h3>
<p><strong>Weights you did not set.</strong> Dijkstra trusts its edge weights completely. In link-state routing those weights are <em>advertised by the routers themselves</em>, so a compromised or misconfigured router that announces cheap links pulls traffic through itself — to read it, drop it, or simply overload it. Defences are about trusting the inputs, not the algorithm: authenticated routing messages (OSPF supports cryptographic authentication), sanity limits on advertised costs, and monitoring for sudden route changes. The same lesson applies to any "shortest/cheapest path" your own code computes from user-supplied data (delivery fees, ratings, prices): validate weights, and remember that one negative or absurd weight silently changes every answer.</p>
<p><strong>Merging on a key the attacker can set.</strong> Account merging is union-find on identifiers, and the result is only as trustworthy as the weakest edge. A 2022 study of 75 popular services (Sudhodanan and Paverd, USENIX Security, "pre-hijacking attacks") found that at least 35 of them allowed an attacker to create an account with the <em>victim's</em> e-mail <em>before</em> the victim signed up — and when the victim later signed in with a social login on the same e-mail, the two were merged while the attacker kept a way in. The rule that follows: only union two identities on an identifier that has been <strong>verified</strong> on both sides, and when you merge, revoke the credentials and sessions that came from the unverified side.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: ai nắm trọng số, ai nắm khoá để gộp?</h3>
<p><strong>Trọng số không do bạn đặt.</strong> Dijkstra tin tuyệt đối vào trọng số cạnh. Trong định tuyến link-state, các trọng số đó <em>do chính các router tự khai báo</em>, nên một router bị chiếm quyền hoặc cấu hình sai mà khai các đường nối rẻ sẽ hút lưu lượng đi qua nó — để đọc trộm, để chặn, hoặc đơn giản là làm nó quá tải. Cách phòng nằm ở việc tin đầu vào chứ không ở thuật toán: xác thực các thông điệp định tuyến (OSPF hỗ trợ xác thực bằng mật mã), đặt giới hạn hợp lý cho chi phí được khai, và giám sát các thay đổi lộ trình đột ngột. Bài học đó đúng với mọi "đường ngắn nhất/rẻ nhất" mà code của chính bạn tính từ dữ liệu người dùng gửi (phí giao hàng, điểm đánh giá, giá tiền): kiểm tra trọng số, và nhớ rằng chỉ một trọng số âm hay vô lý đã lặng lẽ đổi mọi đáp án.</p>
<p><strong>Gộp theo một khoá mà kẻ xấu đặt được.</strong> Gộp tài khoản là union-find trên các định danh, và kết quả chỉ đáng tin bằng cạnh yếu nhất. Một nghiên cứu năm 2022 trên 75 dịch vụ phổ biến (Sudhodanan và Paverd, USENIX Security, "pre-hijacking attacks" — chiếm tài khoản trước khi nạn nhân tạo) phát hiện ít nhất 35 dịch vụ trong số đó cho phép kẻ tấn công tạo tài khoản bằng email của <em>nạn nhân</em> <em>trước khi</em> nạn nhân đăng ký — và khi nạn nhân sau đó đăng nhập bằng tài khoản mạng xã hội với cùng email, hai bên bị gộp lại trong khi kẻ tấn công vẫn giữ được lối vào. Quy tắc rút ra: chỉ hợp hai danh tính trên một định danh đã được <strong>xác thực</strong> ở cả hai phía, và khi gộp thì thu hồi mật khẩu và phiên đăng nhập đến từ phía chưa xác thực.</p>
</div>

<div class="ml-en">
<h3>The trap: a negative edge</h3>
<div class="pitfall co-tieu-de"><p><strong>Dijkstra assumes every weight is ≥ 0. One negative edge makes it settle a node too early.</strong></p><p>Graph: 0 → 1 costs 2, 0 → 2 costs 5, 2 → 1 costs −4, 1 → 3 costs 1. The textbook version with a "done" set:</p></div>
</div>
<div class="ml-vi">
<h3>Cái bẫy: một cạnh âm</h3>
<div class="pitfall co-tieu-de"><p><strong>Dijkstra giả định mọi trọng số ≥ 0. Chỉ một cạnh âm là nó chốt một đỉnh quá sớm.</strong></p><p>Đồ thị: 0 → 1 tốn 2, 0 → 2 tốn 5, 2 → 1 tốn −4, 1 → 3 tốn 1. Bản sách giáo khoa có tập "đã xong":</p></div>
</div>
${ma('ch07/bay-am.ts', { vung: 'sai', nhan: 'TypeScript — Dijkstra with a done set' })}
${ketQua('ch07/bay-am.ts')}
<div class="ml-en">
<p>Dijkstra settles node 1 at 2 (it is the closest when popped) and node 3 at 3; the route 0 → 2 → 1 costs 1 but arrives after node 1 is already "final". Bellman-Ford gets 1 and 2. The lazy-deletion version from the top of this lesson happens to recover on this small graph, because it re-pushes node 1 — but with negative edges that version loses its O(E log V) guarantee and can do exponentially many re-pushes. If the problem allows negative weights, say "Bellman-Ford" (or SPFA, its queue-based variant) out loud. Two smaller traps: a <strong>recursive</strong> <code>find</code> with path compression overflows on the first call over a long naive chain (the iterative two-pass version above cannot), and Bellman-Ford with a limit must <strong>copy</strong> the array each round, as shown in LC 787.</p>
</div>
<div class="ml-vi">
<p>Dijkstra chốt đỉnh 1 ở mức 2 (nó gần nhất lúc được lấy ra) và đỉnh 3 ở mức 3; lộ trình 0 → 2 → 1 chỉ tốn 1 nhưng tới sau khi đỉnh 1 đã "chốt". Bellman-Ford ra 1 và 2. Bản xoá lười ở đầu bài tình cờ tự sửa được trên đồ thị nhỏ này, vì nó đẩy lại đỉnh 1 — nhưng với cạnh âm, bản đó mất bảo đảm O(E log V) và có thể đẩy lại số lần theo cấp số mũ. Nếu đề cho phép trọng số âm, hãy nói to "Bellman-Ford" (hoặc SPFA, biến thể dùng hàng đợi của nó). Hai bẫy nhỏ hơn: <code>find</code> <strong>đệ quy</strong> có nén đường sẽ tràn stack ngay lần gọi đầu trên một chuỗi ngây thơ dài (bản hai lượt bằng vòng lặp ở trên thì không thể), và Bellman-Ford có giới hạn phải <strong>sao chép</strong> mảng mỗi vòng, như đã thấy ở LC 787.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'n servers, directed links with a latency in milliseconds. A message starts at server k. How long until all servers have it?'],
  ['C', 'Each server is a node, each link a directed weighted edge. The time a server receives the message is its shortest-path distance from k, and "all servers" means the maximum of those distances; if one is unreachable I return −1. Can a latency be zero or negative?'],
  ['N', 'Translate the story into "single-source shortest paths + max", then ask the one question that decides the algorithm: negative weights.'],
  ['I', 'Latencies are between 0 and 100.'],
  ['C', 'Non-negative, so Dijkstra with a min-heap: O((V + E) log V). BFS would be wrong because a path with more links can be faster.'],
  ['C', '(codes) TypeScript has no heap, so I am writing a small binary heap of [distance, node]. When I improve a distance I push a new entry instead of updating the old one, and when I pop an entry whose distance is bigger than the recorded one I skip it — it is stale.'],
  ['N', 'Name "lazy deletion" and the stale check: it shows you know why the heap can hold duplicates.'],
  ['C', 'Testing: k alone with no edges returns 0; an unreachable node returns −1; and a case where the direct link is slower than a two-hop route — 1→2 costs 4, 1→3→2 costs 2 — must give 2 for node 2.'],
  ['I', 'What if each message can pass through at most k servers?'],
  ['C', 'Then the cheapest route so far is not enough state, and Dijkstra can settle a node through a route that uses too many hops. I would switch to Bellman-Ford limited to k + 1 rounds, copying the distance array each round so a round cannot chain two edges. O(k·E).'],
  ['N', 'That is LC 787 — recognising that a constraint breaks Dijkstra’s invariant is the senior-sounding answer.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Có n máy chủ, các đường nối có hướng với độ trễ tính bằng mili-giây. Một thông điệp xuất phát từ máy k. Sau bao lâu thì mọi máy đều nhận được?'],
  ['C', 'Mỗi máy là một đỉnh, mỗi đường nối là một cạnh có hướng có trọng số. Thời điểm một máy nhận tin là khoảng cách ngắn nhất từ k tới nó, và "mọi máy" nghĩa là lấy max các khoảng cách đó; có máy không tới được thì trả −1. Độ trễ có thể bằng 0 hay âm không ạ? <em>("Can a latency be negative?")</em>'],
  ['N', 'Dịch câu chuyện thành "đường ngắn nhất một nguồn + max", rồi hỏi đúng câu quyết định thuật toán: trọng số âm.'],
  ['I', 'Độ trễ từ 0 tới 100.'],
  ['C', 'Không âm, vậy dùng Dijkstra với min-heap: O((V + E) log V). BFS sẽ sai vì một đường nhiều chặng hơn có thể nhanh hơn.'],
  ['C', '(vừa code) TypeScript không có heap nên em viết một heap nhị phân nhỏ chứa [khoảng cách, đỉnh]. Khi cải thiện một khoảng cách em đẩy phần tử mới thay vì sửa phần tử cũ, và khi lấy ra một phần tử có khoảng cách lớn hơn giá trị đã ghi thì em bỏ qua — nó đã cũ. <em>("I use lazy deletion and skip stale entries.")</em>'],
  ['N', 'Gọi tên "xoá lười" và phép kiểm phần tử cũ: cho thấy bạn hiểu vì sao heap có thể chứa bản trùng.'],
  ['C', 'Test: chỉ có k và không có cạnh thì trả 0; một đỉnh không tới được trả −1; và một ca mà đường thẳng chậm hơn đường hai chặng — 1→2 tốn 4, 1→3→2 tốn 2 — phải cho đỉnh 2 bằng 2.'],
  ['I', 'Nếu mỗi thông điệp chỉ được đi qua tối đa k máy thì sao?'],
  ['C', 'Khi đó "rẻ nhất tới giờ" không còn đủ làm trạng thái, và Dijkstra có thể chốt một đỉnh bằng một lộ trình dùng quá nhiều chặng. Em sẽ đổi sang Bellman-Ford giới hạn k + 1 vòng, sao chép mảng khoảng cách mỗi vòng để một vòng không nối được hai cạnh. O(k·E). <em>("A hop limit breaks Dijkstra’s invariant; I’d use Bellman-Ford for k + 1 rounds.")</em>'],
  ['N', 'Đó là LC 787 — nhận ra một ràng buộc phá vỡ bất biến của Dijkstra là câu trả lời nghe "có kinh nghiệm".'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Using BFS on a weighted graph, or Dijkstra on a graph with negative edges.</li>
<li>Forgetting the stale check <code>if (d &gt; dist[u]) continue</code> — correct but slow on dense graphs.</li>
<li>Java comparator <code>(a, b) -&gt; a[0] - b[0]</code> on large distances — overflow; use <code>Integer.compare</code> / <code>Long.compare</code>.</li>
<li>Bellman-Ford with a hop limit relaxing in place instead of into a copy.</li>
<li>Union-find without union by size and without compression — O(n) per find on a chain; recursive <code>find</code> on 10⁵ elements.</li>
<li>Accounts Merge: comparing accounts pairwise once (misses transitive merges) or forgetting to sort the e-mails.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dùng BFS trên đồ thị có trọng số, hoặc Dijkstra trên đồ thị có cạnh âm.</li>
<li>Quên phép kiểm phần tử cũ <code>if (d &gt; dist[u]) continue</code> — vẫn đúng nhưng chậm trên đồ thị dày.</li>
<li>Bộ so sánh Java <code>(a, b) -&gt; a[0] - b[0]</code> với khoảng cách lớn — tràn số; dùng <code>Integer.compare</code> / <code>Long.compare</code>.</li>
<li>Bellman-Ford có giới hạn số chặng mà nới lỏng tại chỗ thay vì vào bản sao.</li>
<li>Union-find không hợp theo kích thước và không nén đường — O(n) mỗi lần find trên một chuỗi; <code>find</code> đệ quy với 10⁵ phần tử.</li>
<li>Accounts Merge: so từng cặp tài khoản đúng một lần (bỏ sót gộp bắc cầu) hoặc quên sắp xếp email.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Heap tự viết cho TypeScript và bẫy bộ so sánh Java được dạy kỹ ở <a href="${baiNay('dsa-6-1-heap')}">bài 6.1</a>. Tiếp theo: <a href="${baiNay('dsa-7-1-bieu-dien')}">quay lại 7.1</a> nếu còn lúng túng khâu dựng đồ thị, rồi làm Bộ luyện 7 (8 đề trộn cả chương).</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write the 25-line <code>MinHeap</code> and <code>networkDelayTime</code> from memory (TypeScript) or with <code>PriorityQueue</code> (Java). Run the four tests above.</li>
<li>Remove the stale check, add a counter of relaxations, and compare the count with and without it on the fourth test.</li>
<li>Write the DSU class (size + iterative compression) without looking, then solve LC 684 and LC 547 with it.</li>
<li>Submit LC 743 and LC 787. For LC 787, write one sentence explaining why the copy is needed.</li>
</ol>
<p><strong>Done when:</strong> four accepted submissions (743, 787, 684, 547), the relaxation counts, and the one-sentence explanation.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dijkstra's algorithm</span><span class="v">Single-source shortest paths with non-negative weights; settles nodes in increasing distance with a min-heap.</span></div>
  <div class="kv"><span class="k">relaxation</span><span class="v">If dist[u] + w &lt; dist[v], update dist[v] (and parent[v]).</span></div>
  <div class="kv"><span class="k">lazy deletion / stale entry</span><span class="v">Push a new heap entry instead of decreasing a key; skip entries whose distance is outdated.</span></div>
  <div class="kv"><span class="k">Bellman-Ford</span><span class="v">Relax every edge in rounds; handles negative weights and "at most k edges" limits; O(V·E) or O(k·E).</span></div>
  <div class="kv"><span class="k">union-find (DSU)</span><span class="v">Forest of parent pointers; find = climb to the root, union = link two roots.</span></div>
  <div class="kv"><span class="k">path compression / union by size</span><span class="v">Re-point visited nodes to the root; hang the smaller tree under the bigger — together near-O(1).</span></div>
  <div class="kv"><span class="k">minimum spanning tree (MST)</span><span class="v">The cheapest set of edges connecting all nodes; Kruskal = sorted edges + union-find.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Weights ≥ 0 ⇒ Dijkstra with a heap and lazy deletion, O(E log V); keep parent[] to print the route.</li>
<li>Array Dijkstra is O(V²): fine for small or dense graphs, ${lan(a30, h30)}× slower than the heap at 30,000 sparse nodes.</li>
<li>Hop limits or negative weights break Dijkstra ⇒ Bellman-Ford rounds, copying the array each round.</li>
<li>Path cost = max step still works with Dijkstra (cost never decreases along a path).</li>
<li>Union-find: union by size + path compression ⇒ near-O(1); a failed union = a cycle edge.</li>
<li>Only merge identities on verified keys; only trust weights you can validate.</li>
</ul>
${nguon('📘', 'cp-algorithms — Dijkstra on sparse graphs', 'The heap version with lazy deletion, and the comparison with the O(V²) version', 'https://cp-algorithms.com/graph/dijkstra_sparse.html')}
${nguon('📘', 'cp-algorithms — Disjoint Set Union', 'Path compression, union by size/rank, and the α(n) analysis', 'https://cp-algorithms.com/data_structures/disjoint_set_union.html')}
${nguon('🔐', 'USENIX Security 2022 — Pre-hijacked accounts', 'The study of account-merging flaws in 75 popular services', 'https://www.usenix.org/conference/usenixsecurity22/presentation/sudhodanan')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết <code>MinHeap</code> 25 dòng và <code>networkDelayTime</code> không nhìn bài (TypeScript), hoặc với <code>PriorityQueue</code> (Java). Chạy bốn test ở trên.</li>
<li>Bỏ phép kiểm phần tử cũ, thêm biến đếm số lần nới lỏng, so số đếm có và không có nó trên test thứ tư.</li>
<li>Viết lớp DSU (kích thước + nén đường bằng vòng lặp) không nhìn bài, rồi giải LC 684 và LC 547 bằng nó.</li>
<li>Nộp LC 743 và LC 787. Với LC 787, viết một câu giải thích vì sao cần bản sao.</li>
</ol>
<p><strong>Đạt khi:</strong> bốn lượt nộp Accepted (743, 787, 684, 547), có số đếm nới lỏng, và câu giải thích một dòng.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dijkstra's algorithm (thuật toán Dijkstra)</span><span class="v">Đường ngắn nhất một nguồn với trọng số không âm; chốt các đỉnh theo khoảng cách tăng dần bằng min-heap.</span></div>
  <div class="kv"><span class="k">relaxation (nới lỏng)</span><span class="v">Nếu dist[u] + w &lt; dist[v] thì cập nhật dist[v] (và parent[v]).</span></div>
  <div class="kv"><span class="k">lazy deletion / stale entry (xoá lười / phần tử cũ)</span><span class="v">Đẩy phần tử heap mới thay vì giảm khoá; bỏ qua phần tử có khoảng cách đã lỗi thời.</span></div>
  <div class="kv"><span class="k">Bellman-Ford</span><span class="v">Nới lỏng mọi cạnh theo từng vòng; xử lý được trọng số âm và giới hạn "tối đa k cạnh"; O(V·E) hoặc O(k·E).</span></div>
  <div class="kv"><span class="k">union-find / DSU (hợp-tìm)</span><span class="v">Rừng con trỏ cha; find = leo tới gốc, union = nối hai gốc.</span></div>
  <div class="kv"><span class="k">path compression / union by size (nén đường / hợp theo kích thước)</span><span class="v">Trỏ thẳng các nút đã đi qua lên gốc; treo cây nhỏ dưới cây lớn — kết hợp lại gần O(1).</span></div>
  <div class="kv"><span class="k">minimum spanning tree — MST (cây khung nhỏ nhất)</span><span class="v">Tập cạnh rẻ nhất nối mọi đỉnh; Kruskal = cạnh đã sắp + union-find.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Trọng số ≥ 0 ⇒ Dijkstra với heap và xoá lười, O(E log V); giữ parent[] để in lộ trình.</li>
<li>Dijkstra mảng là O(V²): ổn với đồ thị nhỏ hoặc dày, chậm hơn heap ${lan(a30, h30, 'vi')} lần ở 30.000 đỉnh thưa.</li>
<li>Giới hạn số chặng hoặc trọng số âm làm gãy Dijkstra ⇒ Bellman-Ford theo vòng, sao chép mảng mỗi vòng.</li>
<li>Chi phí đường = bước lớn nhất vẫn dùng được Dijkstra (chi phí không bao giờ giảm dọc đường).</li>
<li>Union-find: hợp theo kích thước + nén đường ⇒ gần O(1); hợp thất bại = cạnh khép chu trình.</li>
<li>Chỉ gộp danh tính trên khoá đã xác thực; chỉ tin trọng số bạn kiểm tra được.</li>
</ul>
${nguon('📘', 'cp-algorithms — Dijkstra on sparse graphs', 'Bản heap với xoá lười, và so sánh với bản O(V²) (tiếng Anh)', 'https://cp-algorithms.com/graph/dijkstra_sparse.html')}
${nguon('📘', 'cp-algorithms — Disjoint Set Union', 'Nén đường, hợp theo kích thước/hạng, và phân tích α(n) (tiếng Anh)', 'https://cp-algorithms.com/data_structures/disjoint_set_union.html')}
${nguon('🔐', 'USENIX Security 2022 — Pre-hijacked accounts', 'Nghiên cứu lỗi gộp tài khoản trên 75 dịch vụ phổ biến (tiếng Anh)', 'https://www.usenix.org/conference/usenixsecurity22/presentation/sudhodanan')}
</div>
`,
};
