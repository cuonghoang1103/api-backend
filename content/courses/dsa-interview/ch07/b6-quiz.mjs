/** 7.6 — Kiểm tra Chương 7 — 10 câu tình huống. Mọi output nhắc tới là output thật trong ../ma/ch07/*.out
 * (bay-fill, rotting, bay-danh-dau, bay-2-mau, mon-fpt, bay-am, cheapest-flights, dsu-do). Đáp án rải [3, 2, 3, 2]. */
export default {
  title: '7.6 — Chapter 7 check|||7.6 — Kiểm tra Chương 7',
  slug: 'dsa-7-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về biểu diễn đồ thị, BFS/DFS, BFS nhiều nguồn, sắp xếp tô-pô, Dijkstra, Bellman-Ford có giới hạn và union-find — đọc mã đoán output, chọn công cụ, bắt ca biên.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Chapter 7 check</h2>
<p class="lead">Ten situations, fifteen minutes. Every output quoted in a question comes from running the code of this chapter. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can turn an edge list into an adjacency list in both languages without the shared-array bug, and say when a matrix is acceptable.</li>
<li>I can choose between BFS and DFS for a question and explain why DFS cannot answer "fewest steps".</li>
<li>I can write multi-source BFS level by level and say when to mark a node visited.</li>
<li>I can write Kahn's algorithm, state the edge direction of Course Schedule, and explain why two colours are wrong for directed cycles.</li>
<li>I can write Dijkstra with a heap and lazy deletion, and name the two situations where it is the wrong tool.</li>
<li>I can write union-find with union by size and path compression, and use a failed union to detect a cycle.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm tra Chương 7</h2>
<p class="lead">Mười tình huống, mười lăm phút. Mọi output được trích trong câu hỏi đều đến từ việc chạy mã của chương này. Mỗi lời giải thích nói vì sao đáp án đúng là đúng, và vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biến được danh sách cạnh thành danh sách kề bằng cả hai ngôn ngữ mà không dính lỗi dùng chung mảng, và nói được khi nào ma trận chấp nhận được.</li>
<li>Tôi chọn được BFS hay DFS cho một câu hỏi và giải thích vì sao DFS không trả lời được "ít bước nhất".</li>
<li>Tôi viết được BFS nhiều nguồn theo từng tầng và nói được lúc nào đánh dấu đã thăm.</li>
<li>Tôi viết được thuật toán Kahn, nói đúng chiều cạnh của Course Schedule, và giải thích vì sao hai màu sai với chu trình có hướng.</li>
<li>Tôi viết được Dijkstra với heap và xoá lười, và gọi tên được hai tình huống nó là công cụ sai.</li>
<li>Tôi viết được union-find với hợp theo kích thước và nén đường, và dùng một lần hợp thất bại để phát hiện chu trình.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'TypeScript: const adj: number[][] = new Array(3).fill([]); adj[0].push(1); console.log(JSON.stringify(adj)). What is printed?|||TypeScript: const adj: number[][] = new Array(3).fill([]); adj[0].push(1); console.log(JSON.stringify(adj)). In ra gì?',
        options: ['[[1],[],[]]', '[[1],[1],[1]]', '[[1],[0],[]]', 'TypeError: cannot push to a filled array|||TypeError: không push được vào mảng đã fill'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: fill([]) evaluates [] once and stores the SAME array in all three slots, so pushing into adj[0] shows up everywhere — the real run printed [[1],[1],[1]] and "wrong[0] === wrong[2]? true". [[1],[],[]] is what Array.from({ length: 3 }, () => []) gives, which is why it is tempting.|||VI: fill([]) tính [] đúng một lần và đặt CÙNG một mảng vào cả ba ô, nên push vào adj[0] thì chỗ nào cũng thấy — lượt chạy thật in [[1],[1],[1]] và "wrong[0] === wrong[2]? true". [[1],[],[]] là thứ Array.from({ length: 3 }, () => []) cho ra, đó là lý do nó hấp dẫn.',
      },
      {
        question: 'Constraints: n ≤ 10⁵ nodes, up to 2·10⁵ undirected edges, one query "is there a path from a to b?". Which plan fits?|||Ràng buộc: n ≤ 10⁵ đỉnh, tới 2·10⁵ cạnh vô hướng, một câu hỏi "có đường từ a tới b không?". Kế hoạch nào hợp?',
        options: ['An adjacency matrix, because "is u–v an edge?" is O(1)|||Ma trận kề, vì "u–v có cạnh không?" là O(1)', 'Scan the edge list repeatedly until no new node is reached|||Quét lại danh sách cạnh nhiều lần tới khi không tới thêm đỉnh nào', 'Recursive DFS on an adjacency list; depth is never a problem in practice|||DFS đệ quy trên danh sách kề; độ sâu thực tế không bao giờ là vấn đề', 'An adjacency list with two arcs per edge and an iterative traversal, O(V + E)|||Danh sách kề, hai mũi tên mỗi cạnh, duyệt bằng vòng lặp, O(V + E)'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: a list holds V + 2E entries and the traversal is O(V + E). The matrix is tempting for its O(1) edge check, but it needs 10¹⁰ cells (the 7.1 benchmark did not even attempt V = 100,000) and its BFS is O(V²). Repeated scanning is O(V·E). Recursive DFS on a 10⁵-node chain can overflow: Node died near 8–9 thousand frames in lesson 7.2.|||VI: danh sách giữ V + 2E phần tử và lượt duyệt là O(V + E). Ma trận hấp dẫn vì kiểm cạnh O(1), nhưng nó cần 10¹⁰ ô (phép đo ở 7.1 không chạy nổi V = 100.000) và BFS trên nó là O(V²). Quét lặp lại là O(V·E). DFS đệ quy trên một chuỗi 10⁵ đỉnh có thể tràn stack: Node chết quanh 8–9 nghìn tầng ở bài 7.2.',
      },
      {
        question: 'A maze grid; every move to a neighbouring free cell costs 1. You need the minimum number of moves from S to E. Which approach is correct?|||Một lưới mê cung; mỗi bước sang ô trống kề bên tốn 1. Cần số bước ít nhất từ S tới E. Cách nào đúng?',
        options: ['BFS from S with a visited mark set on enqueue; the first time E is dequeued, its distance is the answer|||BFS từ S, đánh dấu đã thăm lúc đưa vào hàng; lần đầu lấy E ra, khoảng cách của nó là đáp án', 'DFS from S with a visited set, returning the length of the path on which it first reaches E|||DFS từ S với tập đã thăm, trả về độ dài đường mà nó chạm E đầu tiên', 'Dijkstra with a heap — the only algorithm that guarantees shortest paths|||Dijkstra với heap — thuật toán duy nhất bảo đảm đường ngắn nhất', 'Union-find over free cells, then count the cells in E’s set|||Union-find trên các ô trống, rồi đếm số ô trong tập chứa E'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: with unit costs BFS visits cells in order of distance, so the first time E comes out of the queue it is at its shortest distance. DFS with a visited set finds A path — in lesson 7.2 DFS reached node 2 through a path of length 3 although 2 was a direct neighbour. Dijkstra is correct too but is the heavier tool for unit weights; union-find answers "connected?", not "how far?".|||VI: với chi phí bằng 1, BFS thăm các ô theo thứ tự khoảng cách, nên lần đầu E ra khỏi hàng đợi là ở khoảng cách ngắn nhất. DFS với tập đã thăm tìm ra MỘT đường — ở bài 7.2 DFS tới đỉnh 2 bằng một đường dài 3 dù 2 là láng giềng trực tiếp. Dijkstra cũng đúng nhưng là công cụ nặng hơn cho trọng số bằng 1; union-find trả lời "có nối không?", không trả lời "xa bao nhiêu?".',
      },
      {
        question: 'Rotting Oranges with the multi-source BFS of lesson 7.2 on the single row [2, 1, 1, 1, 1, 1, 2]. What does it return?|||Rotting Oranges với BFS nhiều nguồn của bài 7.2 trên đúng một hàng [2, 1, 1, 1, 1, 1, 2]. Hàm trả về gì?',
        options: ['5', '6', '3', '-1'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: both rotten oranges start in the queue at minute 0 and spread toward each other; the five fresh ones rot in minutes 1, 1, 2, 2, 3 — the real run printed 3. 5 is what you get if only one end spreads (one BFS from the first rotten orange), the classic single-source mistake.|||VI: cả hai quả thối vào hàng đợi ngay phút 0 và loang về phía nhau; năm quả tươi thối ở các phút 1, 1, 2, 2, 3 — lượt chạy thật in 3. 5 là kết quả khi chỉ một đầu loang (một BFS từ quả thối đầu tiên), lỗi một nguồn kinh điển.',
      },
      {
        question: 'Your BFS on an open 1000 × 1000 grid marks a cell visited only when it is DEQUEUED (and skips cells already marked). Compared with marking on enqueue, what happens?|||BFS của bạn trên lưới trống 1000 × 1000 chỉ đánh dấu một ô đã thăm lúc LẤY RA (và bỏ qua ô đã đánh dấu). So với đánh dấu lúc đưa vào, chuyện gì xảy ra?',
        options: ['The visited count is wrong: some cells are counted twice|||Số ô đã thăm sai: có ô bị đếm hai lần', 'It never terminates on a grid with no walls|||Nó không bao giờ dừng trên lưới không có tường', 'Same answer, but about twice as many enqueues: 1,998,001 instead of 1,000,000|||Cùng đáp án, nhưng số lần đưa vào hàng gần gấp đôi: 1.998.001 thay vì 1.000.000', 'It throws a stack overflow because the queue grows too fast|||Nó ném lỗi tràn stack vì hàng đợi phình quá nhanh'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: the duplicate copies are skipped when dequeued, so a million cells are visited either way; the real run showed 1,998,001 enqueues and a peak queue of 1,999 instead of 1,000,000 and 1,000. "Counted twice" is tempting, but the dequeue-time check prevents it — the cost is work and memory, and on dense graphs it grows to O(E). A queue lives on the heap, so it cannot overflow the call stack.|||VI: các bản trùng bị bỏ qua lúc lấy ra, nên cách nào cũng thăm đúng một triệu ô; lượt chạy thật cho 1.998.001 lần đưa vào và hàng đợi đông nhất 1.999, thay vì 1.000.000 và 1.000. "Đếm hai lần" hấp dẫn, nhưng phép kiểm lúc lấy ra đã chặn nó — cái giá là công việc và bộ nhớ, và trên đồ thị dày nó tăng tới O(E). Hàng đợi nằm trên heap nên không thể làm tràn call stack.',
      },
      {
        question: 'canFinish for Course Schedule detects cycles with a plain visited set ("seen before ⇒ cycle"). Input: 4 courses, prerequisites [[1,0],[2,0],[3,1],[3,2]] (course 3 needs 1 and 2, both need 0). What does it return?|||canFinish của Course Schedule phát hiện chu trình bằng tập visited thường ("gặp rồi ⇒ chu trình"). Đầu vào: 4 môn, prerequisites [[1,0],[2,0],[3,1],[3,2]] (môn 3 cần 1 và 2, cả hai cần 0). Hàm trả về gì?',
        options: ['false — it reports a cycle in a valid curriculum|||false — nó báo chu trình trên một chương trình hợp lệ', 'true — the diamond has no cycle and it sees that|||true — hình thoi không có chu trình và nó thấy điều đó', 'It recurses forever, because 3 is reached twice|||Nó đệ quy mãi, vì 3 bị chạm tới hai lần', 'true, but only if the courses are processed from 3 down to 0|||true, nhưng chỉ khi xử lý các môn từ 3 xuống 0'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: in the diamond, 3 is reached via 1 and again via 2; the two-colour check calls that a cycle — the real run printed "two-colour says true" (cycle) while three colours said false. So canFinish wrongly returns false. "true" is the correct answer of a correct solution, which is why it is tempting; only an edge into a GRAY node (still on the current path) closes a cycle. The visited set does stop infinite recursion.|||VI: trong hình thoi, 3 được chạm tới qua 1 rồi lại qua 2; phép kiểm hai màu gọi đó là chu trình — lượt chạy thật in "two-colour says true" (có chu trình) trong khi ba màu nói false. Nên canFinish trả sai false. "true" là đáp án của một lời giải đúng, đó là lý do nó hấp dẫn; chỉ cạnh đi vào đỉnh XÁM (còn trên đường hiện tại) mới khép chu trình. Tập visited vẫn chặn được đệ quy vô hạn.',
      },
      {
        question: 'On the real FPTU SE prerequisite chart (17 subjects), someone adds a wrong edge "SWP391 before PRO192", closing the loop PRO192 → PRJ301 → SWP391 → PRO192. What does Kahn’s algorithm report?|||Trên sơ đồ tiên quyết thật của ngành SE FPTU (17 môn), có người thêm nhầm cạnh "SWP391 trước PRO192", khép vòng PRO192 → PRJ301 → SWP391 → PRO192. Thuật toán Kahn báo gì?',
        options: ['3 subjects stuck — exactly the three on the loop|||3 môn kẹt — đúng ba môn trên vòng', 'An exception, because a queue cannot hold a cycle|||Một ngoại lệ, vì hàng đợi không chứa được chu trình', 'All 17 placed, with SWP391 moved to the first term|||Xếp đủ 17 môn, SWP391 bị dời lên kỳ đầu', '8 placed, 9 stuck — including CSD201 and LAB211, which are not on the loop|||Xếp được 8, kẹt 9 — gồm cả CSD201 và LAB211, vốn không nằm trên vòng'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: the real run printed "with the typo: 8 subjects placed" and a stuck list of 9 (CSD201, LAB211, PRJ301, PRN212, PRO192, SWE201c, SWP391, SWR302, SWT301). Everything that depends on a node of the loop never reaches in-degree 0 either: a cycle blocks its whole shadow. "Exactly the three on the loop" is the tempting answer — it is what DFS would print as the cycle path, not what Kahn leaves behind.|||VI: lượt chạy thật in "with the typo: 8 subjects placed" và danh sách kẹt 9 môn (CSD201, LAB211, PRJ301, PRN212, PRO192, SWE201c, SWP391, SWR302, SWT301). Mọi môn phụ thuộc vào một đỉnh trên vòng cũng không bao giờ về bậc vào 0: một chu trình chặn cả cái bóng của nó. "Đúng ba môn trên vòng" là phương án hấp dẫn — đó là thứ DFS in ra làm đường chu trình, không phải thứ Kahn bỏ lại.',
      },
      {
        question: 'Edges 0→1 (2), 0→2 (5), 2→1 (−4), 1→3 (1). The textbook Dijkstra with a "done" set computes dist[3] = ?|||Các cạnh 0→1 (2), 0→2 (5), 2→1 (−4), 1→3 (1). Dijkstra bản sách giáo khoa có tập "đã xong" tính dist[3] = ?',
        options: ['2 — the true shortest distance|||2 — đúng khoảng cách ngắn nhất', '3 — node 1 was settled at 2 before the −4 edge was seen|||3 — đỉnh 1 bị chốt ở 2 trước khi thấy cạnh −4', '1 — the −4 edge is applied twice|||1 — cạnh −4 bị áp dụng hai lần', 'It loops forever on the negative edge|||Nó lặp mãi trên cạnh âm'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: the real run printed Dijkstra [0,2,5,3] and Bellman-Ford [0,1,5,2]. Node 1 is popped at distance 2 and marked done; the cheaper route 0→2→1 (cost 1) arrives later and is ignored, so node 3 stays at 3. 2 is the correct value — Bellman-Ford’s — and the one people expect from "a shortest-path algorithm". There is no negative cycle, so nothing loops.|||VI: lượt chạy thật in Dijkstra [0,2,5,3] và Bellman-Ford [0,1,5,2]. Đỉnh 1 được lấy ra ở khoảng cách 2 và đánh dấu xong; lộ trình rẻ hơn 0→2→1 (chi phí 1) tới sau và bị bỏ qua, nên đỉnh 3 ở lại 3. 2 là giá trị đúng — của Bellman-Ford — và là thứ người ta mong từ "một thuật toán đường ngắn nhất". Không có chu trình âm nên không có gì lặp mãi.',
      },
      {
        question: 'Cheapest Flights Within K Stops, flights 0→1 (100), 1→2 (100), 0→2 (500), src 0, dst 2, k = 0. A Bellman-Ford that relaxes in place (no copy) returns 200. What is the right fix?|||Cheapest Flights Within K Stops, chuyến 0→1 (100), 1→2 (100), 0→2 (500), src 0, dst 2, k = 0. Một Bellman-Ford nới lỏng tại chỗ (không sao chép) trả về 200. Sửa thế nào cho đúng?',
        options: ['Relax into a copy of last round’s prices, so a round adds at most one flight|||Nới lỏng vào bản sao giá của vòng trước, để mỗi vòng thêm tối đa một chuyến', 'Run k + 2 rounds instead of k + 1, because the first round only sets the source|||Chạy k + 2 vòng thay vì k + 1, vì vòng đầu chỉ đặt giá cho điểm xuất phát', 'Sort the flights by price before every round so cheap flights are relaxed first|||Sắp các chuyến theo giá trước mỗi vòng để chuyến rẻ được nới lỏng trước', 'Replace Bellman-Ford by Dijkstra on price, which is faster and settles each city once|||Thay Bellman-Ford bằng Dijkstra theo giá, nhanh hơn và chốt mỗi thành phố một lần'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: in place, the price of city 1 set earlier in the same round flows on to city 2, so a 2-flight route sneaks into round 1 — the real run printed "no copy, k=0: 200" while the correct answer is 500. Copying makes round r mean "at most r + 1 flights". Dijkstra on price is the tempting "faster" choice, but it ignores the stop limit and returns 200 as well.|||VI: nới lỏng tại chỗ thì giá của thành phố 1 vừa đặt trong cùng vòng chảy tiếp sang thành phố 2, nên một lộ trình 2 chuyến lọt vào vòng 1 — lượt chạy thật in "no copy, k=0: 200" trong khi đáp án đúng là 500. Sao chép làm cho vòng r có nghĩa "tối đa r + 1 chuyến". Dijkstra theo giá là lựa chọn "nhanh hơn" hấp dẫn, nhưng nó bỏ qua giới hạn điểm dừng và cũng trả 200.',
      },
      {
        question: 'A union-find with NO union by size and NO path compression. Unions (0,1), (1,2), …, (n−2, n−1) build one chain, then find(0) is called n times. For n = 10,000, roughly how many parent-pointer hops in total?|||Một union-find KHÔNG hợp theo kích thước và KHÔNG nén đường. Các lần hợp (0,1), (1,2), …, (n−2, n−1) dựng một chuỗi, rồi gọi find(0) n lần. Với n = 10.000, tổng cộng khoảng bao nhiêu bước nhảy con trỏ cha?',
        options: ['About 20,000 — union-find is nearly O(1) per operation|||Khoảng 20.000 — union-find gần O(1) mỗi thao tác', 'About 140,000 — O(n log n)|||Khoảng 140.000 — O(n log n)', 'About 10⁸ — the real count was 99,990,000|||Khoảng 10⁸ — số đếm thật là 99.990.000', 'About 10,000 — each find hops once|||Khoảng 10.000 — mỗi lần find nhảy một bước'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: each of the 10,000 finds climbs the whole 9,999-link chain: 99,990,000 hops in the real run, and n = 10⁵ would be 10¹⁰. "About 20,000" is the tempting answer because "union-find is O(1)" — but that is only true WITH the optimisations: with either of them the same input cost about 2n hops (19,997).|||VI: mỗi lần trong 10.000 lần find leo hết chuỗi 9.999 mắt: 99.990.000 bước nhảy ở lượt chạy thật, và n = 10⁵ sẽ là 10¹⁰. "Khoảng 20.000" là phương án hấp dẫn vì "union-find là O(1)" — nhưng điều đó chỉ đúng KHI có tối ưu: với một trong hai tối ưu, cùng đầu vào chỉ tốn khoảng 2n bước (19.997).',
      },
    ],
  },
};
