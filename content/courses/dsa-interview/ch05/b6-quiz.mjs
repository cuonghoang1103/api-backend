/** 5.6 — Quiz Chương 5 (bài MỚI ★, slug dsa-5-6-quiz). Mọi output nhắc trong câu hỏi là output THẬT (ma/ch05/*.out hoặc chạy nháp). */
export default {
  title: '5.6 — Chapter 5 quiz: trees, BSTs and tries|||5.6 — Quiz Chương 5: cây, BST và trie',
  slug: 'dsa-5-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: đọc mã đoán output, chọn phép duyệt, "hàm trả gì cho cha", bẫy BST và trie, độ sâu đệ quy thật — 15 phút.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Chapter 5 quiz: trees, BSTs and tries</h2>
<p class="lead">Ten questions in 15 minutes. They are not definitions: you will read code and predict its real output, pick a traversal for an unfamiliar problem, choose what a recursive helper returns, and spot the traps from lessons 5.1–5.5. Every output quoted here was produced by running the code.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can build a tree from a LeetCode array with a queue and write all four traversals, recursively and iteratively.</li>
<li>I can say, before coding, what a helper returns to its parent and what it receives from it.</li>
<li>I can validate a BST with an inherited range and explain why checking children is not enough.</li>
<li>I can implement a trie and explain why <code>search</code> needs <code>isEnd</code>.</li>
<li>I know roughly how deep recursion goes in Node and in Java before it overflows.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Quiz</span>
<h2>Quiz Chương 5: cây, BST và trie</h2>
<p class="lead">Mười câu trong 15 phút. Không hỏi định nghĩa: bạn sẽ đọc mã và đoán output thật, chọn phép duyệt cho một đề lạ, chọn thứ hàm đệ quy trả về, và nhận ra các cái bẫy của bài 5.1–5.5. Mọi output nhắc trong quiz đều sinh ra bằng cách chạy mã thật.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dựng được cây từ mảng LeetCode bằng hàng đợi và viết được cả bốn phép duyệt, bằng đệ quy lẫn vòng lặp.</li>
<li>Tôi nói được, trước khi code, hàm phụ trả gì cho cha và nhận gì từ cha.</li>
<li>Tôi kiểm được BST bằng khoảng thừa hưởng và giải thích được vì sao kiểm theo con là chưa đủ.</li>
<li>Tôi cài được trie và giải thích được vì sao <code>search</code> cần <code>isEnd</code>.</li>
<li>Tôi biết đại khái đệ quy sâu được bao nhiêu tầng trên Node và Java trước khi tràn ngăn xếp.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A level-order function uses for (let k = 0; k < queue.length; k++) { const node = queue.shift(); … push children … }. What does it return for [1,2,3,4,5,null,6]?|||Một hàm duyệt theo tầng dùng for (let k = 0; k < queue.length; k++) { const node = queue.shift(); … đẩy các con … }. Nó trả gì với [1,2,3,4,5,null,6]?',
        options: ['[[1],[2,3],[4,5,6]]', '[[1,2,3],[4,5],[6]]', '[[1,2,3,4,5,6]]', '[[1],[2,3,4,5,6]]'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: shift() shrinks the queue and pushing children grows it while the condition is re-read: after taking 1 the queue is [2,3] and k = 1 < 2, so the loop runs into level 1. The real run prints [[1,2,3],[4,5],[6]]. [[1],[2,3],[4,5,6]] is what you get only after freezing size = queue.length before the loop.|||VI: shift() làm hàng đợi ngắn đi còn đẩy con vào làm nó dài ra, trong lúc điều kiện được đọc lại: lấy 1 ra xong hàng đợi là [2,3] và k = 1 < 2, nên vòng lặp lấn sang tầng 1. Lần chạy thật in [[1,2,3],[4,5],[6]]. [[1],[2,3],[4,5,6]] chỉ có được khi chốt size = queue.length trước vòng lặp.',
      },
      {
        question: 'Constraints: up to 10⁵ nodes, no promise of balance. Your recursive DFS in JavaScript passes all examples. What is the most accurate thing to say before submitting?|||Ràng buộc: tới 10⁵ nút, không hứa cân bằng. DFS đệ quy bằng JavaScript của bạn qua hết ví dụ. Câu nào chính xác nhất để nói trước khi nộp?',
        options: [
          'It is O(n) time, so the depth of the recursion cannot matter for any tree shape.|||Nó là O(n) thời gian, nên độ sâu đệ quy không thể là vấn đề với bất kỳ hình dạng cây nào.',
          'Only Java has a fixed stack limit; JavaScript engines grow the call stack on the heap as needed.|||Chỉ Java có giới hạn ngăn xếp cố định; engine JavaScript tự nới ngăn xếp lời gọi trên heap khi cần.',
          'Raise the limit with node --stack-size=60000 and keep the recursion exactly as it is.|||Nâng giới hạn bằng node --stack-size=60000 rồi giữ nguyên đệ quy như hiện tại.',
          'A chain makes the depth 10⁵; Node threw RangeError near 10⁴ when measured, so use an explicit stack.|||Sợi dây làm độ sâu thành 10⁵; Node ném RangeError quanh 10⁴ khi đo, nên dùng ngăn xếp tự quản.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Time is O(n), but stack depth is O(h) and h = n on a chain. Measured: Node died at about 7,000–10,000 levels, Java at about 62,000 with a 2 MB stack. Raising --stack-size past the real thread stack crashed the process with a segmentation fault (exit 139) instead of a catchable error, so it is not a fix.|||VI: Thời gian là O(n), nhưng độ sâu ngăn xếp là O(h) và h = n trên sợi dây. Đo thật: Node chết ở khoảng 7.000–10.000 tầng, Java khoảng 62.000 với ngăn xếp 2 MB. Nâng --stack-size vượt ngăn xếp thật của luồng làm tiến trình chết vì segmentation fault (exit 139) thay vì một lỗi bắt được, nên đó không phải cách chữa.',
      },
      {
        question: 'Diameter of Binary Tree (longest path in edges, anywhere in the tree). What should your recursive helper return to its parent?|||Diameter of Binary Tree (đường dài nhất tính theo cạnh, ở bất kỳ đâu trong cây). Hàm đệ quy phụ của bạn nên trả gì cho cha?',
        options: [
          'The height of its subtree; the bent path left + right goes into a global best.|||Chiều cao cây con của nó; đường gập trái + phải đưa vào biến best chung.',
          'The diameter of its subtree, so the parent can take the maximum.|||Đường kính cây con của nó, để cha lấy giá trị lớn nhất.',
          'left + right, the length of the path that bends at this node.|||trái + phải, độ dài đường gập tại nút này.',
          'The number of nodes in its subtree, so the parent can compare sizes.|||Số nút trong cây con của nó, để cha so kích thước.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A parent can extend only one side of a path (a path cannot fork), so it needs the height. The path that bends at the node uses both sides and is useful only to the final answer, so it goes into a global best. Returning the diameter loses the height the parent needs; returning left + right double-counts when the parent extends it.|||VI: Cha chỉ nối dài được một phía của đường đi (đường đi không được rẽ nhánh), nên cha cần chiều cao. Đường gập tại nút dùng cả hai phía và chỉ có ích cho đáp án cuối, nên nó vào biến best chung. Trả đường kính làm mất chiều cao mà cha cần; trả trái + phải thì khi cha nối dài sẽ tính trùng.',
      },
      {
        question: 'A candidate validates a BST by checking, at every node, left.val < node.val < right.val. On [5,4,6,null,null,3,7], what does their check return, and what is the correct answer?|||Một ứng viên kiểm BST bằng cách xét ở mọi nút left.val < node.val < right.val. Trên [5,4,6,null,null,3,7], phép kiểm đó trả gì, và đáp án đúng là gì?',
        options: [
          'true, and true is correct|||true, và true là đúng',
          'false, and false is correct|||false, và false là đúng',
          'true, but the correct answer is false|||true, nhưng đáp án đúng là false',
          'false, but the correct answer is true|||false, nhưng đáp án đúng là true',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Every parent–child pair is in order (4 < 5 < 6, 3 < 6 < 7), so the children-only check says true — the real run prints children-only = true. But 3 is in the right subtree of 5 and must be greater than 5; the range check sees (5, 6) at node 3 and returns false.|||VI: Mọi cặp cha–con đều đúng thứ tự (4 < 5 < 6, 3 < 6 < 7), nên phép kiểm theo con nói true — lần chạy thật in children-only = true. Nhưng 3 nằm trong cây con phải của 5 nên phải lớn hơn 5; phép kiểm khoảng thấy (5, 6) tại nút 3 và trả false.',
      },
      {
        question: 'Java: ok(root, Integer.MIN_VALUE, Integer.MAX_VALUE) with the test n.val <= lo || n.val >= hi ⇒ false. What does it return for the single-node tree [2147483647]?|||Java: ok(root, Integer.MIN_VALUE, Integer.MAX_VALUE) với phép kiểm n.val <= lo || n.val >= hi ⇒ false. Nó trả gì với cây một nút [2147483647]?',
        options: [
          'true — a single node is always a valid BST|||true — cây một nút luôn là BST hợp lệ',
          'false — 2147483647 >= Integer.MAX_VALUE, the sentinel collides with a real value|||false — 2147483647 >= Integer.MAX_VALUE, hằng canh gác đụng giá trị thật',
          'it throws an ArithmeticException because of int overflow|||nó ném ArithmeticException vì tràn số int',
          'true — Java compares the Integer objects, not their values|||true — Java so đối tượng Integer, không so giá trị',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The real run prints "int sentinels = false, long bounds = true". The value equals the "infinity" constant, so >= rejects it. Java int arithmetic never throws on overflow, and these are primitive ints, not Integer objects. Fix: long bounds or nullable Integer bounds.|||VI: Lần chạy thật in "int sentinels = false, long bounds = true". Giá trị bằng đúng hằng "vô cực", nên >= từ chối nó. Phép tính int của Java không bao giờ ném lỗi khi tràn, và đây là int nguyên thuỷ, không phải đối tượng Integer. Cách sửa: cận kiểu long hoặc Integer cho phép null.',
      },
      {
        question: 'A trie contains only "apple" and "application". search(word) is written as return walk(word) !== null (no isEnd check). What does search("app") return?|||Một trie chỉ chứa "apple" và "application". search(word) được viết là return walk(word) !== null (không kiểm isEnd). search("app") trả gì?',
        options: [
          'true — it only checks that the path exists|||true — nó chỉ kiểm đường đi có tồn tại',
          'false — "app" was never inserted|||false — "app" chưa từng được chèn',
          'it throws, because the "app" node does not exist|||ném lỗi, vì nút "app" không tồn tại',
          'true only if startsWith("app") was called earlier|||true chỉ khi trước đó đã gọi startsWith("app")',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The path a → p → p exists (it is part of "apple"), so walk returns a node and the buggy search answers true — the real run prints "app": wrong = true, right = false. False is the correct answer of a correct search, not of this code. The node exists, so nothing throws.|||VI: Đường a → p → p có tồn tại (nó là một phần của "apple"), nên walk trả về một nút và search lỗi trả true — lần chạy thật in "app": wrong = true, right = false. False là đáp án của search viết đúng, không phải của đoạn mã này. Nút có tồn tại nên không có gì bị ném.',
      },
      {
        question: 'Inserting sorted keys into a plain (unbalanced) BST, the measured time went from 91 ms at 10,000 keys to 2,109 ms at 50,000 keys. About how much growth is that, and which complexity does it match?|||Chèn khoá đã sắp xếp vào BST trơn (không cân bằng), thời gian đo được đi từ 91 ms ở 10.000 khoá lên 2.109 ms ở 50.000 khoá. Tăng khoảng bao nhiêu lần, và khớp với độ phức tạp nào?',
        options: [
          'About ×5 — O(n), each insert is constant time|||Khoảng ×5 — O(n), mỗi lần chèn là hằng số',
          'About ×6 — O(n log n), the tree stays balanced|||Khoảng ×6 — O(n log n), cây vẫn cân bằng',
          'About ×11 — O(n√n), half of the inserts are cheap|||Khoảng ×11 — O(n√n), nửa số lần chèn là rẻ',
          'About ×23 — O(n²), close to the ×25 that n² predicts for ×5 keys|||Khoảng ×23 — O(n²), sát ×25 mà n² dự đoán khi số khoá ×5',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: 2,109 / 91 ≈ 23. Sorted inserts make the height equal to n, so insert i walks i nodes: 1 + 2 + … + n = O(n²), and ×5 keys predicts ×25 time. The shuffled run stayed near-linear (height 37 at 50,000), and Java’s TreeMap took 4 ms because it rebalances.|||VI: 2.109 / 91 ≈ 23. Chèn đã sắp xếp làm chiều cao bằng n, nên lần chèn thứ i đi qua i nút: 1 + 2 + … + n = O(n²), và số khoá ×5 dự đoán thời gian ×25. Bản xáo trộn gần tuyến tính (chiều cao 37 ở 50.000), còn TreeMap của Java mất 4 ms vì nó tự cân bằng.',
      },
      {
        question: 'New problem: "Return the values of all nodes exactly k edges away from a given target node in a binary tree." Which approach fits?|||Đề lạ: "Trả về giá trị mọi nút cách một nút target cho trước đúng k cạnh trong một cây nhị phân." Cách nào phù hợp?',
        options: [
          'In-order traversal, then take the values k positions left and right of the target|||Duyệt in-order, rồi lấy các giá trị cách target k vị trí về hai bên',
          'Walk down from the root comparing values, as in a BST search|||Đi xuống từ gốc và so giá trị, như tìm trong BST',
          'Record each node’s parent, then BFS k levels from the target with a visited set|||Ghi cha của mỗi nút, rồi BFS k tầng từ target kèm tập đã thăm',
          'Post-order returning heights, answer = nodes whose height equals k|||Post-order trả chiều cao, đáp án = các nút có chiều cao bằng k',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Distance can go up through the parent and down another branch, so the tree must become an undirected graph: parent links + BFS by levels, with a visited set because child → parent → child is a cycle (LC 863; for target 5, k 2 the run prints [1,4,7]). Positions in in-order are not distances, the tree is not a BST, and height is measured from the bottom, not from the target.|||VI: Khoảng cách có thể đi lên qua cha rồi xuống một nhánh khác, nên cây phải thành đồ thị vô hướng: link cha + BFS theo tầng, kèm tập đã thăm vì con → cha → con là chu trình (LC 863; với target 5, k 2 lần chạy in [1,4,7]). Vị trí trong in-order không phải khoảng cách, cây không phải BST, và chiều cao đo từ dưới lên chứ không từ target.',
      },
      {
        question: 'Java: the global answer for Diameter lives in static int best = 0 and is never reset. The judge creates a new Solution object for each test and runs [1,2,3,4,5] (answer 3) and then [1,2] (answer 1) in the same JVM. What does the second test return?|||Java: đáp án chung của Diameter nằm ở static int best = 0 và không bao giờ được đặt lại. Máy chấm tạo đối tượng Solution mới cho mỗi test và chạy [1,2,3,4,5] (đáp án 3) rồi [1,2] (đáp án 1) trong cùng một JVM. Test thứ hai trả gì?',
        options: ['3', '1', '0', '4'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A static field belongs to the class, not to the new object, so best still holds 3 from the first test and Math.max never lowers it — the real run prints "static field: 3   fixed: 1". 1 is what the fixed version (instance field, reset at the entry point) returns.|||VI: Trường static thuộc về lớp, không thuộc đối tượng mới, nên best vẫn giữ 3 từ test đầu và Math.max không bao giờ hạ nó xuống — lần chạy thật in "static field: 3   fixed: 1". 1 là thứ bản đã sửa (trường của đối tượng, đặt lại ở hàm vào) trả về.',
      },
      {
        question: 'Binary Tree Maximum Path Sum: you write the correct gain() recursion but initialise best = 0. On the single-node tree [-3], what does your code return, and what is correct?|||Binary Tree Maximum Path Sum: bạn viết đúng đệ quy gain() nhưng khởi tạo best = 0. Trên cây một nút [-3], code của bạn trả gì, và đáp án đúng là gì?',
        options: [
          '−3, and −3 is correct|||−3, và −3 là đúng',
          '0, but the correct answer is −3|||0, nhưng đáp án đúng là −3',
          '−3, but the correct answer is 0|||−3, nhưng đáp án đúng là 0',
          '0, and 0 is correct (an empty path is allowed)|||0, và 0 là đúng (được phép đường đi rỗng)',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: best = max(0, −3) stays 0, so the function returns 0 (checked by running it). But a path must contain at least one node, so the answer is −3 — the lesson’s version starts best at −Infinity / Integer.MIN_VALUE and prints maxPathSum([-3]) = -3. An empty path is not allowed by the problem.|||VI: best = max(0, −3) vẫn là 0, nên hàm trả 0 (đã chạy thử). Nhưng đường đi phải chứa ít nhất một nút, nên đáp án là −3 — bản trong bài khởi tạo best bằng −Infinity / Integer.MIN_VALUE và in maxPathSum([-3]) = -3. Đề không cho phép đường đi rỗng.',
      },
    ],
  },
};
