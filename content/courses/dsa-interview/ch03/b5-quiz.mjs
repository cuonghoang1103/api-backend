/** 3.5 — Kiểm tra Chương 3 — 10 câu tình huống. Mọi output nhắc tới trong câu hỏi là output thật (../ma/ch03 hoặc nháp $TMPDIR/dsa-nhap/ch03/quiz.mjs). */
export default {
  title: '3.5 — Chapter 3 check|||3.5 — Kiểm tra Chương 3',
  slug: 'dsa-3-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về stack, monotonic stack, queue/deque, Array.shift(), danh sách liên kết và LRU cache — đọc mã đoán output, chọn mẫu, bắt ca biên.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Chapter 3 check</h2>
<p class="lead">Ten situations, fifteen minutes. Every output quoted in a question comes from running the code. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can state the invariant of a monotonic stack and explain why it is O(n) despite the inner while.</li>
<li>I can pick the stack direction (increasing/decreasing) and the comparison (&gt; vs &gt;=) for "next greater / previous smaller".</li>
<li>I know why <code>Array.shift()</code> is a bad queue in TypeScript and what to use instead.</li>
<li>I can write the four lines of linked-list reversal in the right order without looking.</li>
<li>I can explain where a dummy node removes a special case.</li>
<li>I can design an LRU cache and say why the list must be doubly linked and why the node stores its key.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm tra Chương 3</h2>
<p class="lead">Mười tình huống, mười lăm phút. Mọi output được trích trong câu hỏi đều đến từ việc chạy mã thật. Mỗi lời giải thích nói vì sao đáp án đúng là đúng, và vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi phát biểu được bất biến của monotonic stack và giải thích vì sao nó là O(n) dù có while bên trong.</li>
<li>Tôi chọn được chiều stack (tăng/giảm) và phép so sánh (&gt; hay &gt;=) cho "lớn hơn kế tiếp / nhỏ hơn phía trước".</li>
<li>Tôi biết vì sao <code>Array.shift()</code> là hàng đợi tồi trong TypeScript và nên dùng gì thay.</li>
<li>Tôi viết được bốn dòng đảo danh sách liên kết đúng thứ tự mà không nhìn bài.</li>
<li>Tôi giải thích được nút giả xoá bỏ trường hợp đặc biệt ở đâu.</li>
<li>Tôi thiết kế được LRU cache và nói được vì sao danh sách phải là danh sách đôi và vì sao nút lưu cả khoá.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Your Valid Parentheses solution pushes openers and pops on closers, but ends with "return true" instead of checking that the stack is empty. Which input exposes the bug?|||Lời giải Valid Parentheses của bạn push dấu mở và pop khi gặp dấu đóng, nhưng kết thúc bằng "return true" thay vì kiểm stack rỗng. Đầu vào nào làm lộ lỗi?',
        options: ['"([)]"', '"(("', '"]"', '"()[]{}"'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: "((" pushes two openers and never pops; without the final empty check the function returns true (the real run printed "buggy = true" for it). "([)]" is the tempting answer, but it is caught inside the loop: ")" meets "[" on top and returns false — the final check is never reached.|||VI: "((" push hai dấu mở và không bao giờ pop; thiếu phép kiểm rỗng cuối cùng thì hàm trả true (lượt chạy thật in "buggy = true" cho nó). "([)]" là đáp án hấp dẫn, nhưng nó bị bắt ngay trong vòng lặp: ")" gặp "[" ở đỉnh và trả false — chưa bao giờ tới phép kiểm cuối.',
      },
      {
        question: 'dailyTemperatures([30, 60, 90, 80, 70, 100]) with the monotonic stack from lesson 3.1. What does it return?|||dailyTemperatures([30, 60, 90, 80, 70, 100]) với monotonic stack của bài 3.1. Hàm trả về gì?',
        options: ['[1, 1, 1, 1, 1, 0]', '[1, 1, 3, 1, 1, 0]', '[1, 1, 0, 2, 1, 0]', '[1, 1, 3, 2, 1, 0]'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: 90, 80 and 70 wait on the stack (indices [2, 3, 4], decreasing) until 100 arrives at index 5 and pops them all: 5 − 4 = 1, 5 − 3 = 2, 5 − 2 = 3. The tempting [1, 1, 3, 1, 1, 0] counts the distance to the next element instead of to the warmer day for 80.|||VI: 90, 80 và 70 chờ trên stack (chỉ số [2, 3, 4], giảm dần) tới khi 100 xuất hiện ở chỉ số 5 và pop hết: 5 − 4 = 1, 5 − 3 = 2, 5 − 2 = 3. Phương án hấp dẫn [1, 1, 3, 1, 1, 0] đếm khoảng cách tới phần tử kế tiếp thay vì tới ngày ấm hơn của 80.',
      },
      {
        question: 'New problem: for each building (n ≤ 2·10⁵ heights), find the index of the nearest STRICTLY taller building to its right. Which approach fits?|||Đề mới: với mỗi toà nhà (n ≤ 2·10⁵ chiều cao), tìm chỉ số toà CAO HƠN HẲN gần nhất bên phải. Cách nào hợp?',
        options: ['A decreasing stack of indices; pop while heights[i] > heights[top]; i answers the popped index — O(n)|||Stack giảm dần chứa chỉ số; pop khi heights[i] > heights[top]; i là đáp án của chỉ số bị pop — O(n)', 'An increasing stack of indices; pop while heights[i] < heights[top]; i answers the popped index — O(n)|||Stack tăng dần chứa chỉ số; pop khi heights[i] < heights[top]; i là đáp án của chỉ số bị pop — O(n)', 'For each i scan to the right until a taller one — fine, since most scans stop early|||Với mỗi i quét sang phải tới khi gặp toà cao hơn — ổn, vì đa số lần quét dừng sớm', 'Sort the heights and binary-search each one — O(n log n)|||Sắp xếp chiều cao rồi tìm nhị phân từng toà — O(n log n)'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: "next greater to the right" = decreasing stack, pop on strictly greater. The increasing stack is the template for "next SMALLER". The scan "usually stops early" but a strictly decreasing skyline makes it O(n²) ≈ 2·10¹⁰ steps; sorting destroys the positions the answer depends on.|||VI: "lớn hơn kế tiếp bên phải" = stack giảm dần, pop khi lớn hơn hẳn. Stack tăng dần là khuôn của "nhỏ hơn kế tiếp". Lần quét "thường dừng sớm" nhưng một dãy nhà giảm dần biến nó thành O(n²) ≈ 2·10¹⁰ bước; sắp xếp phá mất vị trí mà đáp án phụ thuộc vào.',
      },
      {
        question: 'A TypeScript BFS uses q.push(x) and q.shift(). It passes all your tests (queues of a few thousand), but times out on a hidden test where the queue reaches 50,000 nodes. What is the right diagnosis and fix?|||Một BFS viết bằng TypeScript dùng q.push(x) và q.shift(). Nó qua hết test của bạn (hàng đợi vài nghìn), nhưng quá giờ ở một test ẩn nơi hàng đợi lên tới 50.000 nút. Chẩn đoán và cách sửa đúng là gì?',
        options: ['The graph is too big for BFS; switch to a recursive DFS, which needs no queue and therefore no extra time or memory|||Đồ thị quá lớn cho BFS; đổi sang DFS đệ quy, vốn không cần hàng đợi nên không tốn thêm thời gian hay bộ nhớ', 'push() reallocates the whole array on every call; preallocate it with new Array(n) so that each enqueue becomes a plain O(1) write|||push() cấp phát lại cả mảng mỗi lần gọi; cấp phát trước bằng new Array(n) để mỗi lần đưa vào chỉ là một phép ghi O(1)', 'shift() becomes O(n) per call once the array is past roughly 12–16 thousand elements; keep a head index (q[head++]) or use a ring-buffer deque|||shift() thành O(n) mỗi lần gọi khi mảng vượt khoảng 12–16 nghìn phần tử; giữ một chỉ số đầu hàng (q[head++]) hoặc dùng deque ring buffer', 'Mark nodes visited when they are dequeued instead of when they are enqueued, so that each node is processed fewer times|||Đánh dấu đã thăm lúc lấy ra thay vì lúc đưa vào, để mỗi nút bị xử lý ít lần hơn'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured in lesson 3.2: about 30 ns per shift() up to 12,000 elements, 1,159 ns at 16,000, and a 100,000-round BFS-like run took 863 ms with shift() vs 1.15 ms with a head index. push() is amortised O(1). Recursive DFS does not give shortest paths and risks a stack overflow. Marking on dequeue makes it worse (duplicates in the queue).|||VI: Đã đo ở bài 3.2: khoảng 30 ns mỗi lần shift() tới 12.000 phần tử, 1.159 ns ở 16.000, và một lượt kiểu BFS 100.000 vòng tốn 863 ms với shift() so với 1,15 ms với chỉ số đầu hàng. push() là O(1) khấu hao. DFS đệ quy không cho đường ngắn nhất và có nguy cơ tràn stack. Đánh dấu lúc lấy ra còn tệ hơn (hàng đợi đầy bản trùng).',
      },
      {
        question: 'Java: Deque<Integer> dq = new ArrayDeque<>(); dq.push(1); dq.push(2); dq.push(3); then you call dq.poll() three times. What is printed?|||Java: Deque<Integer> dq = new ArrayDeque<>(); dq.push(1); dq.push(2); dq.push(3); rồi gọi dq.poll() ba lần. In ra gì?',
        options: ['1,2,3', '3,2,1', '3,1,2', 'NoSuchElementException'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: push = addFirst and poll = pollFirst, so both work at the head: LIFO, 3,2,1 (the real run of JavaDequeBay printed exactly that). The tempting 1,2,3 is what you get with offer (addLast) + poll. Pick one vocabulary per deque.|||VI: push = addFirst và poll = pollFirst, nên cả hai cùng thao tác ở đầu: LIFO, 3,2,1 (lượt chạy thật của JavaDequeBay in đúng như vậy). Phương án hấp dẫn 1,2,3 là kết quả của offer (addLast) + poll. Mỗi deque chỉ dùng một bộ từ vựng.',
      },
      {
        question: 'Your TypeScript evalRPN uses Math.floor(a / b) for "/". Which test fails?|||evalRPN bằng TypeScript của bạn dùng Math.floor(a / b) cho "/". Test nào trượt?',
        options: ['["7", "-2", "/"] — returns -4, expected -3|||["7", "-2", "/"] — trả -4, đúng phải là -3', '["4", "13", "5", "/", "+"] — returns 6.6, expected 6|||["4", "13", "5", "/", "+"] — trả 6.6, đúng phải là 6', '["2", "1", "+", "3", "*"] — returns 6, expected 9|||["2", "1", "+", "3", "*"] — trả 6, đúng phải là 9', 'None: floor and truncation are the same for integers|||Không test nào: floor và cắt về 0 giống nhau với số nguyên'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: 7 / −2 = −3.5; Math.floor rounds down to −4, while LeetCode (like Java’s int division) truncates toward zero: −3. For positive results floor and trunc agree, which is why "13 / 5" passes (2, total 6). The (2 + 1) × 3 case has no division at all.|||VI: 7 / −2 = −3,5; Math.floor làm tròn xuống thành −4, còn LeetCode (giống phép chia int của Java) cắt về phía 0: −3. Với kết quả dương, floor và trunc trùng nhau, nên "13 / 5" vẫn qua (2, tổng 6). Ca (2 + 1) × 3 không có phép chia nào.',
      },
      {
        question: 'Sliding Window Maximum on [1, 3, −1, −3, 5, 3, 6, 7], k = 3, with the monotonic deque of indices. What is the deque right after processing index 4 (value 5)?|||Sliding Window Maximum trên [1, 3, −1, −3, 5, 3, 6, 7], k = 3, với deque đơn điệu chứa chỉ số. Deque là gì ngay sau khi xử lý chỉ số 4 (giá trị 5)?',
        options: ['[1, 2, 3, 4]', '[2, 3, 4]', '[1, 4]', '[4]'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Before index 4 the deque is [1, 2, 3] (values 3, −1, −3). Index 1 has left the window [2..4], so it is dropped from the front; then 5 pops −3 and −1 from the back; push 4 ⇒ [4]. [2, 3, 4] forgets that smaller, older values can never be a maximum again; [1, 4] forgets the window boundary.|||VI: Trước chỉ số 4, deque là [1, 2, 3] (giá trị 3, −1, −3). Chỉ số 1 đã rời cửa sổ [2..4] nên bị bỏ từ phía đầu; rồi 5 pop −3 và −1 khỏi cuối; push 4 ⇒ [4]. [2, 3, 4] quên rằng các giá trị nhỏ hơn và cũ hơn không bao giờ còn là max; [1, 4] quên ranh giới cửa sổ.',
      },
      {
        question: 'LRU cache with capacity 2: put(1,1), put(2,2), get(1), put(3,3), get(2). What does the last get return, and which key was evicted?|||LRU cache sức chứa 2: put(1,1), put(2,2), get(1), put(3,3), get(2). Lần get cuối trả gì, và khoá nào đã bị loại?',
        options: ['2 — key 1 was evicted (it was inserted first)|||2 — khoá 1 bị loại (nó được chèn trước)', '−1 — key 3 was evicted (it is the newest)|||−1 — khoá 3 bị loại (nó mới nhất)', '−1 — key 2 was evicted (get(1) made 1 the most recent)|||−1 — khoá 2 bị loại (get(1) làm 1 thành mới nhất)', '2 — nothing was evicted, capacity counts distinct values|||2 — không ai bị loại, sức chứa tính theo giá trị khác nhau'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: get(1) moves key 1 to the front, so when put(3,3) needs room the least recently used key is 2 — the traced run shows "evict 2 (tail)" and then get(2) = −1. "Key 1 was evicted" is FIFO behaviour, exactly what the GIF cache in src/routes/gifs.routes.ts does.|||VI: get(1) đưa khoá 1 lên đầu, nên khi put(3,3) cần chỗ thì khoá lâu nhất chưa dùng là 2 — lượt chạy có vết cho thấy "evict 2 (tail)" rồi get(2) = −1. "Khoá 1 bị loại" là hành vi FIFO, đúng như cache GIF trong src/routes/gifs.routes.ts.',
      },
      {
        question: 'Remove Nth Node From End, written WITHOUT a dummy: fast moves n steps from head, then fast and slow move until fast.next is null, then slow.next = slow.next.next. On [1, 2] with n = 2 the real run throws "TypeError: Cannot read properties of null (reading ’next’)". Why?|||Remove Nth Node From End viết KHÔNG có nút giả: fast đi n bước từ head, rồi fast và slow cùng đi tới khi fast.next là null, rồi slow.next = slow.next.next. Với [1, 2] và n = 2, lượt chạy thật ném "TypeError: Cannot read properties of null (reading ’next’)". Vì sao?',
        options: ['n = 2 means removing the head: fast is already null after n steps, and there is no node before the head for slow to stand on|||n = 2 nghĩa là xoá head: sau n bước fast đã là null, và không có nút nào đứng trước head để slow đứng', 'The gap should be n − 1 instead of n; with a gap of n − 1, slow stops one node earlier and the code works for every input|||Khoảng cách phải là n − 1 thay vì n; với khoảng cách n − 1, slow dừng sớm một nút và code chạy đúng với mọi đầu vào', 'JavaScript cannot really delete a node from a list; you must set its value to null and skip null values when printing|||JavaScript không thật sự xoá được nút khỏi danh sách; phải gán giá trị của nó bằng null rồi bỏ qua giá trị null khi in', 'The list must be reversed first so that "n-th from the end" becomes "n-th from the start", and reversed back afterwards|||Phải đảo danh sách trước để "thứ n từ cuối" thành "thứ n từ đầu", rồi đảo trả lại sau đó'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Deleting the head needs a predecessor of the head, which does not exist — hence the crash on fast.next. Starting both pointers at a dummy (and moving fast n + 1 steps) gives every node a predecessor and returns dummy.next = [2]. Changing the gap to n − 1 just moves the off-by-one; reversing works but costs two extra passes and is not needed.|||VI: Xoá head cần một nút đứng trước head, mà nút đó không tồn tại — vì thế mới sập ở fast.next. Cho cả hai con trỏ xuất phát từ nút giả (và fast đi n + 1 bước) thì nút nào cũng có nút đứng trước, và trả về dummy.next = [2]. Đổi khoảng cách thành n − 1 chỉ dời lỗi lệch một sang chỗ khác; đảo danh sách thì chạy được nhưng tốn thêm hai lượt và không cần thiết.',
      },
      {
        question: 'Reversal loop with two lines swapped: while (curr) { curr.next = prev; prev = curr; curr = curr.next; }. On 1→2→3→4, what does it return?|||Vòng đảo danh sách bị đổi chỗ hai dòng: while (curr) { curr.next = prev; prev = curr; curr = curr.next; }. Với 1→2→3→4, hàm trả về gì?',
        options: ['4→3→2→1 — the order of the three assignments does not matter, every node still gets its arrow turned exactly once|||4→3→2→1 — thứ tự ba phép gán không quan trọng, nút nào cũng vẫn được quay mũi tên đúng một lần', 'An infinite loop — curr keeps bouncing between nodes 1 and 2 because their arrows now point at each other|||Một vòng lặp vô tận — curr cứ nảy qua lại giữa nút 1 và nút 2 vì mũi tên của chúng giờ chỉ vào nhau', '2→1 — it turns two arrows correctly and then stops, because node 3 can no longer be reached from node 2|||2→1 — nó quay đúng hai mũi tên rồi dừng, vì từ nút 2 không còn tới được nút 3', '1 — after the arrow is turned, curr.next is the old prev (null), so the loop ends and nodes 2–4 are lost|||1 — sau khi quay mũi tên, curr.next là prev cũ (null), nên vòng lặp kết thúc và các nút 2–4 bị mất'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The real run printed "1". Turning the arrow before saving next overwrites the only link to the rest of the list; curr then becomes null and the loop stops after one node. There is no infinite loop because curr reaches null immediately. The fix is the order "save next, turn, step prev, step curr".|||VI: Lượt chạy thật in "1". Quay mũi tên trước khi cất next đã ghi đè lên đường nối duy nhất tới phần còn lại; curr khi đó thành null và vòng lặp dừng sau một nút. Không có vòng lặp vô tận vì curr về null ngay. Cách sửa là thứ tự "cất next, quay, bước prev, bước curr".',
      },
    ],
  },
};
