/**
 * CSD201 · Nâng cao — quiz tổng ôn.
 * Quiz viết lại (10 câu, giữ slug csd201-quiz-advanced).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/CSD201/gen/gen.mjs từ gen/src/** và gen/java/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node CSD201/gen/gen.mjs`.
 */

/* ───────── Quiz (csd201-quiz-advanced) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'Which rule is one of the red-black tree properties (lesson A.1)?|||Quy tắc nào là một tính chất của cây đỏ-đen (bài A.1)?',
      options: ['Every path from a node down to a null leaf contains the same number of black nodes|||Mọi đường đi từ một nút xuống lá null đều chứa cùng số nút đen', 'The heights of the two subtrees of every node differ by at most 1|||Chiều cao hai cây con của mọi nút lệch nhau nhiều nhất 1', 'Every internal node has exactly two children|||Mọi nút trong có đúng hai con', 'Red nodes may only appear as leaves|||Nút đỏ chỉ được xuất hiện ở lá'],
      correctIndex: 0,
      points: 1,
      explanation: 'The red-black rules are: each node is red or black, the root and the null leaves are black, a red node has no red child, and every path down to a null leaf has the same "black height". Together they keep the longest path at most twice the shortest, so the height is O(log n). Option B is the AVL condition — the tempting mix-up between the two balanced trees.|||Các luật đỏ-đen là: mỗi nút đỏ hoặc đen, gốc và các lá null là đen, nút đỏ không có con đỏ, và mọi đường đi xuống lá null có cùng "chiều cao đen". Gộp lại chúng giữ đường dài nhất không quá hai lần đường ngắn nhất, nên chiều cao là O(log n). Phương án B là điều kiện của AVL — nhầm lẫn hay gặp giữa hai loại cây cân bằng.' },
    { id: 'q2',
      question: "Java's TreeMap and C++'s std::map use red-black trees rather than AVL trees. What is the main reason given in lesson A.1?|||TreeMap của Java và std::map của C++ dùng cây đỏ-đen chứ không dùng AVL. Lý do chính mà bài A.1 nêu là gì?",
      options: ['A red-black tree is always shorter than an AVL tree with the same keys|||Cây đỏ-đen luôn thấp hơn cây AVL cùng tập khoá', 'A red-black tree never needs any rotation|||Cây đỏ-đen không bao giờ cần phép xoay', 'An update needs only a constant number of rotations (at most 2 for insert, 3 for delete)|||Mỗi lần cập nhật chỉ cần số phép xoay hằng số (chèn ≤ 2, xoá ≤ 3)', 'A red-black tree keeps the keys in insertion order|||Cây đỏ-đen giữ các khoá theo thứ tự chèn'],
      correctIndex: 2,
      points: 1,
      explanation: 'AVL keeps a tighter balance (height about 1.44 log n against 2 log n), but a deletion may rotate all the way up to the root, O(log n) times. Red-black trees accept a looser balance in exchange for O(1) rotations per update — fewer structural writes, better for write-heavy work. Option A is backwards: AVL trees are the shorter ones.|||AVL giữ cân bằng chặt hơn (chiều cao khoảng 1,44 log n so với 2 log n), nhưng một lần xoá có thể phải xoay ngược lên tận gốc, O(log n) lần. Cây đỏ-đen chấp nhận cân bằng lỏng hơn để đổi lấy O(1) phép xoay mỗi lần cập nhật — ít lần ghi cấu trúc hơn, hợp với công việc nhiều ghi. Phương án A ngược: cây AVL mới là cây thấp hơn.' },
    { id: 'q3',
      question: 'An index holds 1 000 000 records. A balanced binary search tree needs about 20 levels. About how many levels (page reads) does a B-tree whose nodes have 100 children need?|||Một chỉ mục có 1 000 000 bản ghi. Cây nhị phân tìm kiếm cân bằng cần khoảng 20 tầng. B-tree mỗi nút có 100 con cần khoảng bao nhiêu tầng (lần đọc trang)?',
      options: ['20|||20', '3|||3', '10|||10', '100|||100'],
      correctIndex: 1,
      points: 1,
      explanation: "Each level multiplies the reach by 100: 100³ = 10⁶, so log₁₀₀(10⁶) = 3 levels, and the top levels usually stay cached. That is why every database index is a B-tree (B+ tree): the cost that matters is the number of disk pages read, not comparisons. 20 is the binary tree's figure — the whole point is that high fan-out shrinks it.|||Mỗi tầng nhân phạm vi lên 100 lần: 100³ = 10⁶, nên log₁₀₀(10⁶) = 3 tầng, và các tầng trên thường nằm sẵn trong cache. Vì thế mọi chỉ mục cơ sở dữ liệu đều là B-tree (B+ tree): chi phí đáng kể là số trang đĩa phải đọc, không phải số phép so sánh. 20 là con số của cây nhị phân — ý chính là số con lớn (fan-out) làm nó co lại." },
    { id: 'q4',
      question: 'What is the search time of a skip list with n elements (lesson A.1)?|||Thời gian tìm kiếm trên danh sách nhảy (skip list) n phần tử là bao nhiêu (bài A.1)?',
      options: ['O(1) in every case|||O(1) trong mọi trường hợp', 'O(n log n)|||O(n log n)', 'O(n), because it is still a linked list|||O(n), vì nó vẫn là danh sách liên kết', 'O(log n) expected, thanks to randomly promoted express lanes|||O(log n) kỳ vọng, nhờ các làn cao tốc được thăng tầng ngẫu nhiên'],
      correctIndex: 3,
      points: 1,
      explanation: 'Each node is promoted to the next level with probability ½, so level k holds about n/2^k nodes; a search runs along the top lane and drops down, taking O(log n) steps on average — balance by coin flips, without rotations. C is tempting because the bottom level is an ordinary sorted linked list, but the express lanes skip most of it; the O(log n) is expected, not a worst-case guarantee.|||Mỗi nút được thăng lên tầng trên với xác suất ½, nên tầng k giữ khoảng n/2^k nút; phép tìm chạy dọc làn trên cùng rồi tụt dần xuống, trung bình O(log n) bước — cân bằng bằng tung đồng xu, không cần phép xoay. C dễ gây nhầm vì tầng dưới cùng đúng là một danh sách liên kết đã sắp, nhưng các làn cao tốc bỏ qua phần lớn nó; O(log n) là kỳ vọng, không phải bảo đảm trường hợp xấu nhất.' },
    { id: 'q5',
      question: 'Union-Find stores the chain 1 → 2 → 3 → 4 → 5, where 5 is the root. After one call find(1) WITH path compression, what are parent[1], parent[2], parent[3], parent[4]?|||Union-Find đang lưu dây xích 1 → 2 → 3 → 4 → 5, với 5 là gốc. Sau một lời gọi find(1) CÓ nén đường đi, parent[1], parent[2], parent[3], parent[4] là gì?',
      options: ['5 5 5 5|||5 5 5 5', '2 3 4 5|||2 3 4 5', '5 3 4 5|||5 3 4 5', '2 5 5 5|||2 5 5 5'],
      correctIndex: 0,
      points: 1,
      explanation: 'find(1) recurses up to the root 5, and on the way back every node on the path is re-pointed straight at 5: parent[x] = find(parent[x]). The tree becomes flat, so later finds on 1–4 take one step — the example of lesson A.2. C is tempting because it compresses only the node the call started from; B is the chain without any compression.|||find(1) đệ quy lên tới gốc 5, và trên đường quay về mọi nút trên đường đi được trỏ thẳng vào 5: parent[x] = find(parent[x]). Cây trở nên phẳng, các lần find sau trên 1–4 chỉ tốn một bước — đúng ví dụ của bài A.2. C dễ gây nhầm vì chỉ nén nút bắt đầu lời gọi; B là dây xích chưa nén gì.' },
    { id: 'q6',
      question: '16 elements are appended one by one to a dynamic array that starts with capacity 1 and doubles whenever it is full. How many element copies happen in total?|||Thêm lần lượt 16 phần tử vào một mảng động có sức chứa ban đầu 1, cứ đầy thì nhân đôi. Tổng cộng có bao nhiêu lần chép phần tử?',
      options: ['120|||120', '16|||16', '15|||15', '32|||32'],
      correctIndex: 2,
      points: 1,
      explanation: 'Growing happens when the array holds 1, 2, 4 and 8 elements, copying 1 + 2 + 4 + 8 = 15 elements — always fewer than 2n, so each append costs O(1) amortized (aggregate method, lesson A.2 and slide 40 of the complexity deck). 120 = 1 + 2 + … + 15 is what growing by ONE cell each time would cost: O(n²) in total.|||Mảng nới rộng khi đang chứa 1, 2, 4 và 8 phần tử, chép 1 + 2 + 4 + 8 = 15 phần tử — luôn ít hơn 2n, nên mỗi lần thêm tốn O(1) khấu hao (phương pháp tổng gộp, bài A.2 và slide 40 của bộ slide độ phức tạp). 120 = 1 + 2 + … + 15 là cái giá nếu mỗi lần chỉ nới thêm MỘT ô: tổng O(n²).' },
    { id: 'q7',
      question: 'Which statement about separate chaining and open addressing is TRUE?|||Phát biểu nào về băm dây chuyền (separate chaining) và địa chỉ mở (open addressing) là ĐÚNG?',
      options: ['Open addressing can hold more entries than it has cells|||Địa chỉ mở chứa được nhiều mục hơn số ô', 'With chaining the load factor may exceed 1; open addressing needs it below 1|||Với dây chuyền, load factor có thể vượt 1; địa chỉ mở cần nó nhỏ hơn 1', 'Chaining makes deletion impossible without tombstones|||Dây chuyền không xoá được nếu không dùng bia mộ (tombstone)', 'Both schemes give O(1) search even when every key collides|||Cả hai cách đều tìm O(1) kể cả khi mọi khoá va chạm'],
      correctIndex: 1,
      points: 1,
      explanation: 'In chaining each cell holds a linked list, so N entries in M cells with N > M is fine — the lists just grow (slide 21: "the table can never overflow"). Open addressing stores every entry in its own cell, so N < M and performance collapses as the table fills. Tombstones (C) are needed in OPEN addressing, not chaining, where deleting is just unlinking a node.|||Với dây chuyền, mỗi ô giữ một danh sách liên kết, nên N mục trong M ô với N > M vẫn được — chỉ là các danh sách dài ra (slide 21: "bảng không bao giờ tràn"). Địa chỉ mở đặt mỗi mục vào một ô riêng, nên phải N < M và hiệu năng sụp đổ khi bảng gần đầy. Bia mộ (C) là thứ cần cho địa chỉ MỞ, không phải dây chuyền — ở đó xoá chỉ là gỡ một nút.' },
    { id: 'q8',
      question: 'Brute-force pattern matching searches for p = aaab in a text of 20 letters a. How many character comparisons does it make in total?|||Thuật toán vét cạn tìm p = aaab trong văn bản gồm 20 chữ a. Tổng cộng nó thực hiện bao nhiêu phép so sánh ký tự?',
      options: ['20|||20', '17|||17', '80|||80', '68|||68'],
      correctIndex: 3,
      points: 1,
      explanation: 'There are n − m + 1 = 17 shifts, and at every shift the first three letters match and the fourth fails: 17 × 4 = 68 comparisons — the O(n·m) worst case of brute force. 17 counts only the shifts; KMP would need about 2n comparisons here because it never re-reads the text.|||Có n − m + 1 = 17 vị trí dịch, và ở mỗi vị trí ba chữ đầu khớp còn chữ thứ tư hỏng: 17 × 4 = 68 phép so sánh — trường hợp xấu nhất O(n·m) của vét cạn. 17 chỉ đếm số lần dịch; KMP ở đây chỉ cần khoảng 2n phép so sánh vì không bao giờ đọc lại văn bản.' },
    { id: 'q9',
      question: "Why is Huffman's algorithm called a greedy algorithm?|||Vì sao thuật toán Huffman được gọi là thuật toán tham lam (greedy)?",
      options: ['At every step it merges the two least frequent nodes and never revisits that choice|||Mỗi bước nó gộp hai nút ít gặp nhất và không bao giờ xét lại lựa chọn đó', 'It tries every possible code tree and keeps the best one|||Nó thử mọi cây mã có thể rồi giữ cây tốt nhất', 'It gives the shortest code to the first symbol of the text|||Nó cho mã ngắn nhất cho ký hiệu đầu tiên của văn bản', 'It keeps extending a dictionary with the longest new string|||Nó liên tục mở rộng từ điển bằng chuỗi mới dài nhất'],
      correctIndex: 0,
      points: 1,
      explanation: 'A greedy algorithm makes the locally best choice at each step and never undoes it; for Huffman that choice — join the two cheapest nodes — provably gives an optimal prefix code (textbook §13.4: "Text Compression and the Greedy Method"). B describes exhaustive search, which would be exponential; D describes LZW, the dictionary method.|||Thuật toán tham lam chọn phương án tốt nhất tại chỗ ở mỗi bước và không bao giờ quay lại sửa; với Huffman, lựa chọn đó — nối hai nút rẻ nhất — được chứng minh là cho mã tiền tố tối ưu (sách §13.4: "Text Compression and the Greedy Method"). B mô tả vét cạn mọi khả năng, sẽ tốn thời gian mũ; D mô tả LZW, phương pháp dùng từ điển.' },
    { id: 'q10',
      question: "Kruskal's algorithm keeps a Union-Find structure. What does it use it for?|||Thuật toán Kruskal giữ một cấu trúc Union-Find. Nó dùng để làm gì?",
      options: ['To sort the edges by weight|||Để sắp các cạnh theo trọng số', 'To test whether an edge joins two vertices that are already connected (it would close a cycle)|||Để kiểm một cạnh có nối hai đỉnh đã liên thông không (nếu có thì tạo chu trình)', 'To store the shortest distance of every vertex|||Để lưu khoảng cách ngắn nhất của mọi đỉnh', 'To choose the start vertex of the tree|||Để chọn đỉnh bắt đầu của cây'],
      correctIndex: 1,
      points: 1,
      explanation: 'Kruskal accepts an edge only if its endpoints are in different components: find(u) != find(v); accepting it merges them with union. With union by rank and path compression each test is almost O(1), so sorting the edges, O(E log E), dominates. Sorting (A) is done once, before the loop, by an ordinary sort — not by Union-Find.|||Kruskal chỉ nhận một cạnh nếu hai đầu mút thuộc hai thành phần khác nhau: find(u) != find(v); nhận cạnh thì gộp hai thành phần bằng union. Với gộp theo hạng và nén đường đi, mỗi lần kiểm gần như O(1), nên bước sắp cạnh O(E log E) chiếm phần lớn thời gian. Việc sắp cạnh (A) được làm một lần trước vòng lặp bằng một thuật toán sắp xếp thường — không phải Union-Find.' },
  ],
};

export default {
  quiz: QUIZ,
  quizDescription: '10 câu tổng ôn: luật cây đỏ-đen và vì sao thư viện chọn nó, số lần đọc trang của B-tree, skip list, nén đường đi của Union-Find, phân tích khấu hao mảng nhân đôi, dây chuyền vs địa chỉ mở, vét cạn trường hợp xấu, Huffman tham lam, Union-Find trong Kruskal — mỗi câu có giải thích.',
};
