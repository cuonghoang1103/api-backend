/**
 * 11.6 — Bài thi cuối khoá (★ dsa-11-6-kiem-tra-cuoi-khoa): 24 tình huống trộn mọi chương, 30 phút.
 * Mọi output nhắc trong câu hỏi là output THẬT: ma/ch11/b6/cau-hoi.ts(.out), ma/ch11/b6/PvCauHoi.java(.out),
 * ma/ch11/b2…b5/*.out, ma/ch11/b1/lich-on.ts.out, ma/ch01/VaChamBam.java.out. Đáp án rải 6/6/6/6.
 */
export default {
  title: '11.6 — Final exam: the whole course in 24 situations|||11.6 — Bài thi cuối khoá: cả khoá trong 24 tình huống',
  slug: 'dsa-11-6-kiem-tra-cuoi-khoa',
  type: 'QUIZ',
  isFreePreview: true,
  description: '24 câu tình huống trộn mọi chương trong 30 phút: đọc output thật, chọn mẫu cho đề lạ, tìm lỗi trong lời giải qua ví dụ, chấm một buổi phỏng vấn theo 4 trục, chiến lược với đề Hard, lừa đảo tuyển dụng và NDA.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Final exam</span>
<h2>Final exam: the whole course in 24 situations</h2>
<p class="lead">Twenty-four questions, thirty minutes, every chapter. As in the chapter quizzes, nothing asks for a definition: you read real program output and explain it, pick the pattern for a problem you have not seen, find the bug in code that passes the examples, score a mock interview with the rubric, and decide what to do at minute 30 of a Hard or when a "recruiter" asks for a deposit. Every number quoted was produced by running the code of this course. Target: 18/24 (checkpoint 6 of lesson 11.1). For each wrong answer, the explanation names the lesson to re-read.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a constraint and name the complexity I need.</li>
<li>I recognise the signal of each pattern in the table of lesson 11.5.</li>
<li>I know the classic traps of my interview language (sort, comparator, overflow, string building, recursion depth).</li>
<li>I can explain why a solution is correct, not only that it passes.</li>
<li>I can score a session on the four axes and turn the scores into a verdict.</li>
<li>I know what a fake recruiter looks like and what I may share after an interview.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài thi cuối khoá</span>
<h2>Bài thi cuối khoá: cả khoá trong 24 tình huống</h2>
<p class="lead">Hai mươi bốn câu, ba mươi phút, đủ mọi chương. Như các quiz chương, không câu nào hỏi định nghĩa: bạn đọc output thật của chương trình và giải thích nó, chọn mẫu cho một đề chưa gặp, tìm lỗi trong đoạn code qua được ví dụ, chấm một buổi phỏng vấn thử theo phiếu, và quyết định làm gì ở phút 30 của đề Hard hay khi một "nhà tuyển dụng" đòi tiền cọc. Mọi con số trong đề đều sinh ra bằng cách chạy mã của khoá. Mục tiêu: 18/24 (mốc kiểm 6 của bài 11.1). Với mỗi câu sai, phần giải thích chỉ ra bài cần đọc lại.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc một ràng buộc là gọi được tên độ phức tạp mình cần.</li>
<li>Tôi nhận ra dấu hiệu của từng mẫu trong bảng của bài 11.5.</li>
<li>Tôi biết các bẫy kinh điển của ngôn ngữ mình phỏng vấn (sắp xếp, comparator, tràn số, dựng chuỗi, độ sâu đệ quy).</li>
<li>Tôi giải thích được vì sao một lời giải đúng, chứ không chỉ là nó qua test.</li>
<li>Tôi chấm được một buổi thử theo bốn trục và đổi điểm thành kết luận.</li>
<li>Tôi biết một nhà tuyển dụng giả trông thế nào và được chia sẻ gì sau một buổi phỏng vấn.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      {
        question: 'The constraints say n ≤ 2·10⁵ and the time limit is about one second. Your first idea is two nested loops over the array. What is the right move?|||Ràng buộc ghi n ≤ 2·10⁵, giới hạn thời gian khoảng một giây. Ý tưởng đầu tiên của bạn là hai vòng lặp lồng trên mảng. Nước đi đúng là gì?',
        options: [
          'Code it: judges are lenient and 2·10⁵ is a small input for a modern machine.|||Cứ code: máy chấm dễ tính và 2·10⁵ là đầu vào nhỏ với máy hiện đại.',
          'Say it as the brute force, then aim for O(n log n) or O(n): n² is about 4·10¹⁰ steps.|||Nói nó ra như bản vét cạn, rồi nhắm O(n log n) hoặc O(n): n² là khoảng 4·10¹⁰ bước.',
          'Keep O(n²) but switch to Java, whose speed makes 4·10¹⁰ steps fit in a second.|||Giữ O(n²) nhưng đổi sang Java, đủ nhanh để 4·10¹⁰ bước vừa trong một giây.',
          'Skip the brute force entirely and start coding the optimal idea to save time.|||Bỏ hẳn vét cạn và bắt đầu code ý tối ưu cho đỡ tốn thời gian.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Roughly 10⁸ simple steps fit in a second, so n² = 4·10¹⁰ is hundreds of times too slow in any language — the language changes the constant, never the curve (lesson 1.1 measured it). But the brute force is still worth one sentence: it proves you understood the problem and is your baseline (lesson 0.2). Skipping it is the trap of option D. Re-read 0.1.|||VI: Khoảng 10⁸ bước đơn giản vừa trong một giây, nên n² = 4·10¹⁰ chậm hàng trăm lần ở bất kỳ ngôn ngữ nào — đổi ngôn ngữ chỉ đổi hằng số, không đổi đường cong (bài 1.1 đã đo). Nhưng vét cạn vẫn đáng một câu: nó chứng tỏ bạn hiểu đề và là mốc để cải tiến (bài 0.2). Bỏ qua nó là cái bẫy của phương án D. Đọc lại 0.1.',
      },
      {
        question: 'Two Sum with a hash map. You swap the two lines and insert nums[i] into the map BEFORE looking up target − nums[i]. What does the real run print for [3, 3] with target 6, and for [3] with target 6?|||Two Sum bằng hash map. Bạn đảo hai dòng: cất nums[i] vào map TRƯỚC khi tra target − nums[i]. Lần chạy thật in gì cho [3, 3] với target 6, và cho [3] với target 6?',
        options: [
          '[0, 1] and [] — the order of the two lines does not matter for correctness.|||[0, 1] và [] — thứ tự hai dòng không ảnh hưởng tới tính đúng.',
          '[0, 1] and [0, 0] — only the one-element array is affected.|||[0, 1] và [0, 0] — chỉ mảng một phần tử bị ảnh hưởng.',
          '[0, 0] and [0, 0] — the element finds itself, in both arrays.|||[0, 0] và [0, 0] — phần tử tự tìm thấy chính nó, ở cả hai mảng.',
          '[1, 0] and [] — the pair is found in reverse order but still correct.|||[1, 0] và [] — cặp được tìm theo thứ tự ngược nhưng vẫn đúng.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Real output: swapped twoSum([3,3], 6) = [0,0] and swapped twoSum([3], 6) = [0,0]. At i = 0 the map already contains 3 → 0, and need = 3, so it pairs with itself and returns immediately — the second 3 is never reached. Checking before inserting guarantees the map only holds elements strictly to the left (lesson 1.1). Option B is tempting because [3,3] "has a pair", but the bug fires before index 1.|||VI: Output thật: swapped twoSum([3,3], 6) = [0,0] và swapped twoSum([3], 6) = [0,0]. Ở i = 0 map đã có 3 → 0, và need = 3, nên nó ghép với chính nó và trả về ngay — số 3 thứ hai không bao giờ được xét tới. Tra trước rồi mới cất đảm bảo map chỉ chứa phần tử nằm hẳn bên trái (bài 1.1). Phương án B hấp dẫn vì [3,3] "có cặp", nhưng lỗi xảy ra trước khi tới chỉ số 1.',
      },
      {
        question: 'Java HashMap, 40,000 keys inserted and looked up. With a correct key class it took 2.2 ms; with a key whose hashCode() always returns 42 it took 23,865.8 ms. Which explanation is right?|||HashMap Java, chèn rồi tra 40.000 khoá. Với lớp khoá viết đúng mất 2,2 ms; với khoá có hashCode() luôn trả về 42 mất 23.865,8 ms. Giải thích nào đúng?',
        options: [
          'Every key lands in one bucket, so each operation scans it: O(n) each, O(n²) in total.|||Mọi khoá rơi vào một ô, nên mỗi thao tác phải lục ô đó: O(n) mỗi lần, O(n²) cả bài.',
          'The map resizes itself on every insert because 42 is below the default capacity.|||Map tự nới kích thước sau mỗi lần chèn vì 42 nhỏ hơn sức chứa mặc định.',
          'Java 8 tree bins make it O(log n) per operation, so the slowdown is just garbage collection.|||Ô dạng cây của Java 8 làm mỗi thao tác O(log n), nên chậm chỉ là do thu gom rác.',
          'Calling hashCode() 40,000 times is expensive; caching its result would fix it.|||Gọi hashCode() 40.000 lần rất tốn; cache kết quả là sửa được.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A constant hash puts all keys into one bucket; every get/put compares against the whole bucket. Java 8 turns crowded buckets into trees, but only Comparable keys can be ordered in the tree — this key is not, so the search degrades (lesson 1.1, real numbers from VaChamBam.java). Option C is the most tempting: tree bins exist, but they do not help non-comparable keys. This is also the mechanism of hash-flooding attacks.|||VI: Hàm băm hằng số dồn mọi khoá vào một ô; mỗi get/put phải so với cả ô. Java 8 đổi ô đông thành cây, nhưng chỉ khoá Comparable mới sắp được trong cây — khoá này không, nên việc tìm suy biến (bài 1.1, số thật từ VaChamBam.java). Phương án C hấp dẫn nhất: ô dạng cây có thật, nhưng không giúp được khoá không so sánh được. Đây cũng là cơ chế của tấn công làm ngập bảng băm.',
      },
      {
        question: 'In TypeScript you sort scores with scores.sort() and no comparator. For [10, 9, 1, 2] the real run prints:|||Trong TypeScript bạn sắp điểm bằng scores.sort() không có comparator. Với [10, 9, 1, 2] lần chạy thật in ra:',
        options: [
          '[1, 2, 9, 10] — numbers are sorted numerically by default.|||[1, 2, 9, 10] — mặc định số được sắp theo giá trị.',
          '[1, 10, 2, 9] — elements are compared as strings by default.|||[1, 10, 2, 9] — mặc định phần tử được so như chuỗi.',
          '[10, 9, 2, 1] — the default order is descending.|||[10, 9, 2, 1] — thứ tự mặc định là giảm dần.',
          'A TypeError, because number[] requires an explicit comparator.|||TypeError, vì number[] bắt buộc phải có comparator.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Real output: sort(): [1,10,2,9]; sort((a,b)=>a-b): [1,2,9,10]. Without a comparator, Array.prototype.sort converts elements to strings and compares them, so "10" < "2". TypeScript does not reject it — the type system allows calling sort() without arguments (lesson 1.3). In Java, Arrays.sort on int[] is numeric, which is why Java programmers fall into this trap in JavaScript.|||VI: Output thật: sort(): [1,10,2,9]; sort((a,b)=>a-b): [1,2,9,10]. Không có comparator, Array.prototype.sort đổi phần tử thành chuỗi rồi so, nên "10" < "2". TypeScript không chặn — hệ kiểu cho phép gọi sort() không tham số (bài 1.3). Trong Java, Arrays.sort trên int[] sắp theo số, nên người quen Java hay rơi đúng bẫy này khi viết JavaScript.',
      },
      {
        question: 'Longest Substring Without Repeating Characters (LC 3). Your window jumps with left = last[c] + 1 (no max). It prints 3 for "abcabcbb", which is correct. What does the real run print for "abba"?|||Longest Substring Without Repeating Characters (LC 3). Cửa sổ của bạn nhảy bằng left = last[c] + 1 (không có max). Nó in 3 cho "abcabcbb", đúng. Lần chạy thật in gì cho "abba"?',
        options: [
          '2, the correct answer — the max() only matters for strings with three repeats.|||2, đáp án đúng — max() chỉ cần cho chuỗi lặp ba lần.',
          '4, because the window never shrinks without max().|||4, vì thiếu max() thì cửa sổ không bao giờ co lại.',
          '1, because left jumps past right at the second "b".|||1, vì left nhảy vượt qua right ở chữ "b" thứ hai.',
          '3, because at the last "a" left moves BACK to 1 and the window "bba" is counted.|||3, vì ở chữ "a" cuối, left LÙI về 1 và cửa sổ "bba" được tính.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Real output: LC3 "abba": correct=2 withoutMax=3 (and "tmmzuxt": 5 vs 6). At index 2 ("b") left becomes 2. At index 3 ("a") the last "a" was at 0, so left = 1 — it moves backwards, re-admitting a repeated "b". left = max(left, last + 1) keeps the window from ever growing back to the left (lesson 2.2). The bug passes the classic example, which is why you test "abba" on purpose.|||VI: Output thật: LC3 "abba": correct=2 withoutMax=3 (và "tmmzuxt": 5 so với 6). Ở chỉ số 2 ("b") left thành 2. Ở chỉ số 3 ("a") chữ "a" trước nằm ở 0, nên left = 1 — nó lùi lại, cho chữ "b" lặp vào lại cửa sổ. left = max(left, last + 1) giữ cho cửa sổ không bao giờ nở ngược sang trái (bài 2.2). Lỗi qua được ví dụ kinh điển, vì vậy phải cố ý test "abba".',
      },
      {
        question: 'Minimum Remove to Make Valid Parentheses on "(a(b(c)d)". Your stack version returns "a(b(c)d)", your two-pass version returns "(a(bc)d)". The interviewer asks whether one of them is wrong.|||Minimum Remove to Make Valid Parentheses với "(a(b(c)d)". Bản ngăn xếp của bạn trả về "a(b(c)d)", bản hai lượt trả về "(a(bc)d)". Người phỏng vấn hỏi có bản nào sai không.',
        options: [
          'The two-pass version is wrong: it must remove the leftmost unmatched "(".|||Bản hai lượt sai: nó phải xoá dấu "(" không khớp bên trái nhất.',
          'The stack version is wrong: removing index 0 changes the meaning of the formula.|||Bản ngăn xếp sai: xoá chỉ số 0 làm đổi nghĩa công thức.',
          'Neither: both are valid and remove exactly one character; any minimal answer is accepted.|||Không bản nào sai: cả hai hợp lệ và xoá đúng một ký tự; đáp án ít xoá nhất nào cũng được.',
          'Both are wrong: the minimum here is zero removals, since the letters balance it.|||Cả hai sai: ở đây số lần xoá ít nhất là 0, vì chữ cái làm nó cân bằng.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Real output: "(a(b(c)d)" -> stack="a(b(c)d)" twoPass="(a(bc)d)" valid=true removed=1/1. The stack keeps the leftover "(" index (0); the right-to-left pass drops the rightmost extra "(" (index 4). Both strings are balanced and minimal. Asking "is any valid answer accepted?" at the start is exactly the clarifying question that makes this a non-issue (lesson 11.2).|||VI: Output thật: "(a(b(c)d)" -> stack="a(b(c)d)" twoPass="(a(bc)d)" valid=true removed=1/1. Ngăn xếp giữ chỉ số "(" còn sót (0); lượt phải sang trái bỏ "(" dư bên phải nhất (chỉ số 4). Cả hai chuỗi đều cân bằng và ít xoá nhất. Hỏi "đáp án hợp lệ nào cũng được chứ?" ngay từ đầu chính là câu hỏi làm rõ khiến chuyện này không còn là vấn đề (bài 11.2).',
      },
      {
        question: 'Java binary search with lo = 2,000,000,000 and hi = 2,100,000,000. The real run prints (lo+hi)/2 = -97483648. Which fix gives 2050000000?|||Tìm nhị phân Java với lo = 2.000.000.000 và hi = 2.100.000.000. Lần chạy thật in (lo+hi)/2 = -97483648. Cách sửa nào cho ra 2050000000?',
        options: [
          'Either lo + (hi − lo) / 2 or (lo + hi) >>> 1; both printed 2050000000.|||lo + (hi − lo) / 2 hoặc (lo + hi) >>> 1; cả hai đều in 2050000000.',
          'Only Math.abs((lo + hi) / 2), which removes the minus sign.|||Chỉ Math.abs((lo + hi) / 2), vì nó bỏ dấu trừ đi.',
          'Only (lo + hi) >> 1, because a shift cannot overflow.|||Chỉ (lo + hi) >> 1, vì phép dịch không thể tràn.',
          'Casting the result: (long) ((lo + hi) / 2).|||Ép kiểu kết quả: (long) ((lo + hi) / 2).',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Real output: (lo+hi)/2 = -97483648, lo+(hi-lo)/2 = 2050000000, (lo+hi)>>>1 = 2050000000. lo + hi = 4.1·10⁹ overflows int (max ≈ 2.147·10⁹) before the division. lo + (hi − lo)/2 never overflows; >>> treats the overflowed bits as unsigned and recovers the right value. >> (signed) keeps the minus sign; casting AFTER the overflow is too late; Math.abs gives a wrong positive number (lesson 4.1).|||VI: Output thật: (lo+hi)/2 = -97483648, lo+(hi-lo)/2 = 2050000000, (lo+hi)>>>1 = 2050000000. lo + hi = 4,1·10⁹ tràn int (tối đa ≈ 2,147·10⁹) trước khi chia. lo + (hi − lo)/2 không bao giờ tràn; >>> coi các bit đã tràn là số không dấu nên lấy lại đúng giá trị. >> (có dấu) giữ dấu trừ; ép kiểu SAU khi tràn là quá muộn; Math.abs cho ra một số dương sai (bài 4.1).',
      },
      {
        question: 'Maximum Profit in Job Scheduling. Your upper-bound search uses ends[mid] >= start instead of ends[mid] > start. On the touching jobs 1–2, 2–3, 3–4 (profit 1 each) the real run prints 2 instead of 3. Why?|||Maximum Profit in Job Scheduling. Phép tìm cận trên của bạn dùng ends[mid] >= start thay vì ends[mid] > start. Với các việc nối đuôi 1–2, 2–3, 3–4 (mỗi việc 1 đồng) lần chạy thật in 2 thay vì 3. Vì sao?',
        options: [
          'Sorting by end time is wrong for this problem; it must sort by start time.|||Sắp theo giờ kết thúc là sai với đề này; phải sắp theo giờ bắt đầu.',
          'dp needs n + 2 cells; with n + 1 the last job is dropped.|||dp cần n + 2 ô; với n + 1 ô thì việc cuối bị bỏ.',
          'The search overflows because the times are close to each other.|||Phép tìm bị tràn số vì các thời điểm sát nhau.',
          'A job ending exactly at the start is treated as overlapping, so touching jobs cannot both be taken.|||Việc kết thúc đúng lúc bắt đầu bị coi là chồng giờ, nên hai việc nối đuôi không lấy cùng được.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Real output: with > : 3, with >= : 2. j must count the jobs whose end is ≤ start, i.e. find the first end strictly greater than start. With >=, the job ending at 2 is excluded for the job starting at 2, so only alternating jobs can be combined. The statement said "ending at X and starting at X is compatible" — ask it, then test exactly the chain (lesson 11.4). Sorting by end is correct for this recurrence; option A is the tempting wrong fix.|||VI: Output thật: with > : 3, with >= : 2. j phải đếm các việc có giờ kết thúc ≤ giờ bắt đầu, tức tìm giờ kết thúc đầu tiên lớn hơn HẲN giờ bắt đầu. Với >=, việc kết thúc lúc 2 bị loại khỏi tầm của việc bắt đầu lúc 2, nên chỉ ghép được các việc xen kẽ. Đề đã nói "kết thúc lúc X và bắt đầu lúc X là ghép được" — hỏi câu đó, rồi test đúng chuỗi nối đuôi (bài 11.4). Sắp theo giờ kết thúc là đúng với công thức này; phương án A là cách "sửa" sai hấp dẫn.',
      },
      {
        question: 'Distribute Coins in Binary Tree. Your helper returns "the number of moves inside my subtree" to its parent. Why does this design get stuck?|||Distribute Coins in Binary Tree. Hàm phụ của bạn trả về "số lượt chuyển bên trong cây con của tôi" cho cha. Vì sao thiết kế này bế tắc?',
        options: [
          'Because the moves can be negative, and the parent cannot add negative numbers.|||Vì số lượt có thể âm, và nút cha không cộng được số âm.',
          'Because the parent needs the subtree’s excess (coins − nodes) to know what crosses its edge; moves do not tell it.|||Vì nút cha cần phần dư của cây con (số xu − số nút) để biết cái gì đi qua cạnh của nó; số lượt không nói điều đó.',
          'Because post-order is the wrong traversal; pre-order is needed to push coins down first.|||Vì hậu thứ tự là cách duyệt sai; cần tiền thứ tự để đẩy xu xuống trước.',
          'Because recursion cannot return a value and also update a global counter.|||Vì đệ quy không thể vừa trả về giá trị vừa cập nhật biến đếm toàn cục.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: What crosses the edge above a subtree is |coins − nodes| of that subtree, so that is what the parent needs. Return the excess; accumulate the moves in an outer variable — on [0,0,0,0,0,0,7] the real trace gives 16 moves and the root returns 0. Returning moves forces a second traversal per node (O(n²) on a chain). This is Chapter 5’s question "what does the function return to its parent?" (lessons 5.2, 11.3).|||VI: Thứ đi qua cạnh phía trên một cây con là |số xu − số nút| của cây con đó, nên đó là thứ nút cha cần. Trả về phần dư; cộng dồn số lượt vào một biến bên ngoài — với [0,0,0,0,0,0,7] bảng vết thật cho 16 lượt và gốc trả về 0. Trả về số lượt buộc phải duyệt lại cho mỗi nút (O(n²) trên cây dạng chuỗi). Đây là câu hỏi của Chương 5 "hàm trả gì cho cha?" (bài 5.2, 11.3).',
      },
      {
        question: 'Recursive flood fill (Max Area of Island) on an all-land grid. What did the real runs show?|||Loang đệ quy (Max Area of Island) trên lưới toàn đất. Các lần chạy thật cho thấy gì?',
        options: [
          'Node and Java both handle 1000 × 1000; recursion depth is only the grid side, 1000.|||Node và Java đều xử lý được 1000 × 1000; độ sâu đệ quy chỉ bằng cạnh lưới, 1000.',
          'Only Java fails, because Java has no tail-call optimisation and Node does.|||Chỉ Java hỏng, vì Java không tối ưu đệ quy đuôi còn Node thì có.',
          'Node throws RangeError at 100 × 100; Java with a 1 MB stack survives 100 × 100 but overflows at 300 × 300.|||Node ném RangeError ở 100 × 100; Java với stack 1 MB sống qua 100 × 100 nhưng tràn ở 300 × 300.',
          'Both pass 50 × 50 and 100 × 100 and fail only above 10⁶ cells.|||Cả hai qua 50 × 50 và 100 × 100, chỉ hỏng khi vượt 10⁶ ô.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Real output: 50×50 → 2500 (max depth 2500); 100×100 → RangeError: Maximum call stack size exceeded in Node; Java (1 MB thread stack) → 10000 at 100×100 and StackOverflowError at 300×300. Depth follows the island’s size, up to rows × cols — not the side length. Node does not do tail-call optimisation either, and this recursion is not a tail call anyway. Fix: an explicit stack, which handled 1,000,000 cells (lesson 11.4).|||VI: Output thật: 50×50 → 2500 (độ sâu tối đa 2500); 100×100 → RangeError: Maximum call stack size exceeded ở Node; Java (stack luồng 1 MB) → 10000 ở 100×100 và StackOverflowError ở 300×300. Độ sâu đi theo kích thước đảo, tới rows × cols — không phải cạnh lưới. Node cũng không tối ưu đệ quy đuôi, mà lời gọi này vốn chẳng phải đệ quy đuôi. Cách sửa: ngăn xếp tường minh, đã xử lý 1.000.000 ô (bài 11.4).',
      },
      {
        question: 'Java: Arrays.sort(a, (x, y) -> x - y) on {2000000000, -2000000000, 0}. The real run prints [2000000000, -2000000000, 0]. What happened?|||Java: Arrays.sort(a, (x, y) -> x - y) trên {2000000000, -2000000000, 0}. Lần chạy thật in [2000000000, -2000000000, 0]. Chuyện gì đã xảy ra?',
        options: [
          'x − y overflows int for far-apart values, so the comparator lies about the order; use Integer.compare.|||x − y tràn int khi hai giá trị cách xa nhau, nên comparator báo sai thứ tự; dùng Integer.compare.',
          'Arrays.sort is unstable for Integer[], so equal-looking values can swap.|||Arrays.sort không ổn định với Integer[], nên các giá trị trông như bằng nhau có thể đổi chỗ.',
          'A comparator must return only −1, 0 or 1; larger values are rejected silently.|||Comparator chỉ được trả −1, 0 hoặc 1; giá trị lớn hơn bị bỏ qua câm lặng.',
          'Autoboxing compares the Integer objects by reference instead of by value.|||Tự đóng hộp làm so đối tượng Integer theo tham chiếu thay vì theo giá trị.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Real output: sort (x,y)->x-y : [2000000000, -2000000000, 0], Integer::compare : [-2000000000, 0, 2000000000]. 2·10⁹ − (−2·10⁹) = 4·10⁹ overflows to a negative number, so the comparator claims 2·10⁹ is smaller. Any sign is allowed from a comparator, so C is false; object sorting in Java is stable, so B is false. Integer.compare (or Comparator.comparingInt) never subtracts (lessons 1.3, 6.1).|||VI: Output thật: sort (x,y)->x-y : [2000000000, -2000000000, 0], Integer::compare : [-2000000000, 0, 2000000000]. 2·10⁹ − (−2·10⁹) = 4·10⁹ tràn thành số âm, nên comparator khẳng định 2·10⁹ nhỏ hơn. Comparator được trả về số mang dấu bất kỳ, nên C sai; sắp đối tượng trong Java là ổn định, nên B sai. Integer.compare (hoặc Comparator.comparingInt) không bao giờ trừ (bài 1.3, 6.1).',
      },
      {
        question: 'New problem: "Given meeting times [start, end), return the minimum number of rooms so that no two meetings in the same room overlap." n ≤ 10⁵. Which approach do you propose?|||Đề mới: "Cho các cuộc họp [bắt đầu, kết thúc), trả về số phòng ít nhất để không có hai cuộc họp chồng giờ trong cùng một phòng." n ≤ 10⁵. Bạn đề xuất cách nào?',
        options: [
          'Backtracking over room assignments, pruning when a room is busy.|||Quay lui trên các cách xếp phòng, cắt nhánh khi phòng bận.',
          'Sort by end time and greedily keep meetings that fit one room; the answer is n minus that count.|||Sắp theo giờ kết thúc và tham lam giữ các cuộc họp vừa một phòng; đáp án là n trừ số đó.',
          'A hash map from start time to count; the answer is the largest count.|||Hash map từ giờ bắt đầu sang số lượng; đáp án là số lượng lớn nhất.',
          'Sort by start; a min-heap of end times (or a +1/−1 sweep); the answer is the peak, O(n log n).|||Sắp theo giờ bắt đầu; min-heap giờ kết thúc (hoặc quét +1/−1); đáp án là đỉnh, O(n log n).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The answer is the maximum number of meetings running at the same moment. Either sweep the 2n events (+1 at a start, −1 at an end, ends first on ties for half-open intervals) or keep a min-heap of the end times of rooms in use (lesson 6.3). Option B solves a different problem (the most meetings in ONE room) — the classic mix-up; option C only counts meetings that start at exactly the same time.|||VI: Đáp án là số cuộc họp đang diễn ra cùng lúc nhiều nhất. Hoặc quét 2n sự kiện (+1 lúc bắt đầu, −1 lúc kết thúc, hoà thì kết thúc trước với khoảng nửa mở), hoặc giữ min-heap giờ kết thúc của các phòng đang dùng (bài 6.3). Phương án B giải một đề khác (nhiều cuộc họp nhất trong MỘT phòng) — nhầm lẫn kinh điển; phương án C chỉ đếm các cuộc họp bắt đầu đúng cùng một giờ.',
      },
      {
        question: 'New problem: "n courses, a list of pairs (a, b) meaning b must be taken before a. Return a valid order, or an empty list if impossible." Which pattern?|||Đề mới: "n môn học, danh sách cặp (a, b) nghĩa là phải học b trước a. Trả về một thứ tự hợp lệ, hoặc danh sách rỗng nếu không thể." Mẫu nào?',
        options: [
          'Dijkstra from course 0, because the order is a shortest path.|||Dijkstra từ môn 0, vì thứ tự là một đường đi ngắn nhất.',
          'Topological sort (Kahn: indegree 0 first); if not all n are output, there is a cycle ⇒ impossible.|||Sắp xếp tô-pô (Kahn: bậc vào 0 trước); nếu không xuất đủ n môn thì có chu trình ⇒ không thể.',
          'Sort the pairs by b and output courses in that order.|||Sắp các cặp theo b rồi xuất các môn theo thứ tự đó.',
          'Union-find: courses in the same set can be taken in any order.|||Union-find: các môn cùng một tập học theo thứ tự nào cũng được.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Prerequisites are a directed graph; a valid order exists exactly when it has no cycle. Kahn’s algorithm repeatedly takes a course with no remaining prerequisites; if it stops before n courses, the rest are on a cycle (lesson 7.3 — the same idea orders npm dependencies and database migrations). Sorting pairs (C) ignores chains of prerequisites; union-find (D) ignores direction.|||VI: Môn tiên quyết là một đồ thị có hướng; thứ tự hợp lệ tồn tại đúng khi không có chu trình. Thuật toán Kahn lặp lại việc lấy một môn không còn môn tiên quyết nào; nếu dừng trước khi đủ n môn, phần còn lại nằm trên một chu trình (bài 7.3 — cùng ý tưởng xếp thứ tự phụ thuộc npm và migration CSDL). Sắp các cặp (C) bỏ qua chuỗi tiên quyết; union-find (D) bỏ qua chiều.',
      },
      {
        question: 'You signed an NDA with your offer. That evening a classmate asks you to post the exact interview problem in the class Facebook group. What do you do?|||Bạn đã ký NDA kèm offer. Tối đó một bạn cùng lớp nhờ bạn đăng nguyên văn đề phỏng vấn lên nhóm Facebook của lớp. Bạn làm gì?',
        options: [
          'Share the process and the pattern level ("one graph traversal, one DP"); keep the exact text in your private log.|||Chia sẻ quy trình và loại đề ở mức mẫu ("một bài duyệt đồ thị, một bài DP"); giữ câu chữ nguyên văn trong sổ riêng.',
          'Post it with the company name removed — without the name it is no longer confidential.|||Đăng nhưng bỏ tên công ty — không có tên thì không còn là thông tin mật.',
          'Post it, because interview problems come from LeetCode and are already public.|||Đăng, vì đề phỏng vấn lấy từ LeetCode nên vốn đã công khai.',
          'Send it privately to the classmate only, since private messages are not covered.|||Chỉ gửi riêng cho bạn đó, vì tin nhắn riêng không thuộc phạm vi thoả thuận.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: An NDA covers the information, not the channel or whether the company’s name is attached — B and D still disclose it, and private messages get screenshotted. Many company problems are variants written in-house, so C is an assumption. What is fine and genuinely helpful: the process, the number of rounds, the pattern level, your preparation advice (lesson 11.5).|||VI: NDA bảo vệ thông tin, không phụ thuộc kênh gửi hay có kèm tên công ty — B và D vẫn là tiết lộ, và tin nhắn riêng vẫn bị chụp màn hình. Nhiều đề của công ty là biến thể tự soạn, nên C chỉ là giả định. Thứ được phép và thật sự có ích: quy trình, số vòng, loại đề ở mức mẫu, lời khuyên chuẩn bị (bài 11.5).',
      },
      {
        question: 'New problem: list every subset of n distinct numbers. For which n is the standard backtracking solution reasonable in a second, and why?|||Đề mới: liệt kê mọi tập con của n số phân biệt. Với n nào thì lời giải quay lui chuẩn còn hợp lý trong một giây, và vì sao?',
        options: [
          'n ≤ 10⁵, because each subset is built in O(1) amortised time.|||n ≤ 10⁵, vì mỗi tập con được dựng trong O(1) khấu hao.',
          'n ≤ 1000, because the recursion depth is only n.|||n ≤ 1000, vì độ sâu đệ quy chỉ là n.',
          'Up to about n = 20: there are 2ⁿ subsets and copying each costs up to n, so ~2·10⁷ steps.|||Tới khoảng n = 20: có 2ⁿ tập con và chép mỗi tập tốn tới n, nên ~2·10⁷ bước.',
          'Any n, because backtracking with pruning avoids exploring most subsets.|||Mọi n, vì quay lui có cắt nhánh tránh được phần lớn tập con.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The output itself has 2ⁿ subsets, so no algorithm can be faster than 2ⁿ; with copying it is O(2ⁿ · n). 2²⁰ ≈ 10⁶ subsets × 20 ≈ 2·10⁷ — fine; n = 30 is already ~3·10¹⁰. Pruning (D) helps when constraints cut branches, not when every subset must be listed; depth (B) is not the bottleneck (lessons 0.1, 8.1).|||VI: Bản thân đầu ra đã có 2ⁿ tập con, nên không thuật toán nào nhanh hơn 2ⁿ; tính cả việc chép là O(2ⁿ · n). 2²⁰ ≈ 10⁶ tập con × 20 ≈ 2·10⁷ — ổn; n = 30 đã là ~3·10¹⁰. Cắt nhánh (D) giúp khi ràng buộc chặt bớt nhánh, không giúp khi phải liệt kê mọi tập con; độ sâu (B) không phải nút thắt (bài 0.1, 8.1).',
      },
      {
        question: 'Ways to reach n with steps of 2 or 4, memoised with if (memo[n]) return memo[n]. For n = 31 (odd, answer 0) the real run counted 5,167 calls; with memo[n] !== undefined it counted 33. Why?|||Số cách đi tới n bằng bước 2 hoặc 4, có nhớ bằng if (memo[n]) return memo[n]. Với n = 31 (lẻ, đáp án 0) lần chạy thật đếm 5.167 lời gọi; với memo[n] !== undefined thì 33. Vì sao?',
        options: [
          'The array memo is slower than a Map, so each lookup costs more calls.|||Mảng memo chậm hơn Map, nên mỗi lần tra tốn thêm lời gọi.',
          'The recursion has no base case for odd n, so it runs until the stack is nearly full.|||Đệ quy thiếu ca cơ sở cho n lẻ, nên chạy tới khi stack gần đầy.',
          'Memoisation never helps when the answer is 0, whatever the check.|||Ghi nhớ không bao giờ giúp được khi đáp án bằng 0, dù kiểm thế nào.',
          'Every stored 0 is falsy, so solved subproblems look "not computed" and are solved again and again.|||Mỗi số 0 đã cất là falsy, nên bài con đã giải trông như "chưa tính" và bị giải đi giải lại.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Real output: calls with if (memo[n]) = 5167, with !== undefined = 33. For odd n every subproblem answer is 0, and 0 fails the truthy check, so nothing is ever reused — the work is the plain exponential recursion. The answer stays correct, which is why the bug survives the examples. Option C is the tempting overgeneralisation: the correct check gets 33 calls (lesson 9.1).|||VI: Output thật: calls with if (memo[n]) = 5167, with !== undefined = 33. Với n lẻ, đáp án của mọi bài con đều bằng 0, mà 0 không qua phép kiểm truthy, nên không gì được dùng lại — khối lượng việc là đệ quy hàm mũ trần trụi. Đáp án vẫn đúng, chính vì thế lỗi sống sót qua các ví dụ. Phương án C là khái quát hoá sai hấp dẫn: phép kiểm đúng chỉ tốn 33 lời gọi (bài 9.1).',
      },
      {
        question: 'Maximum Points from Cards: a classmate proposes "always take the bigger end". Over 300 random inputs checked against brute force, what did the real run show, and what is the lesson?|||Maximum Points from Cards: một bạn đề xuất "luôn lấy đầu lớn hơn". Trên 300 đầu vào ngẫu nhiên đối chiếu với vét cạn, lần chạy thật cho thấy gì, và bài học là gì?',
        options: [
          'Greedy matched brute force on all 300 inputs, so it is a valid O(k) solution to submit.|||Tham lam khớp vét cạn cả 300 đầu vào, nên nó là lời giải O(k) hợp lệ để nộp.',
          'Wrong on 60 of 300 (3 vs 101 on [1,100,1,1,1,2], k = 2); check a greedy rule against brute force.|||Sai 60 trên 300 (3 so với 101 với [1,100,1,1,1,2], k = 2); đối chiếu luật tham lam với vét cạn.',
          'Greedy failed only when k = n, an edge case you can special-case before the main loop.|||Tham lam chỉ sai khi k = n, một ca biên có thể xử lý riêng trước vòng lặp chính.',
          'Greedy was wrong on all 300 inputs, so the rule never works for this problem at all.|||Tham lam sai cả 300 đầu vào, nên luật này không bao giờ đúng với đề này.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Real output: random: 300/300 match brute force; greedy wrong on 60/300, and on the fixed case [1,100,1,1,1,2], k = 2: greedy=3 vs 101. A small card hides a big one behind it. With k = n greedy takes everything and is correct (C is backwards), and it is right on many inputs (D is false) — which is exactly why it survives a casual test (lessons 9.5, 11.3).|||VI: Output thật: random: 300/300 match brute force; greedy wrong on 60/300, và ca cố định [1,100,1,1,1,2], k = 2: greedy=3 so với 101. Một lá nhỏ che một lá lớn ngay sau nó. Với k = n tham lam lấy hết nên đúng (C ngược), và nó đúng trên nhiều đầu vào (D sai) — chính vì thế nó lọt qua một lần test qua loa (bài 9.5, 11.3).',
      },
      {
        question: 'Majority Element follow-up: "a majority is no longer guaranteed". Your Boyer–Moore loop returns 3 for [1, 1, 2, 2, 3] (real run). What is the correct fix?|||Nối tiếp Majority Element: "không còn đảm bảo có phần tử đa số". Vòng Boyer–Moore của bạn trả về 3 với [1, 1, 2, 2, 3] (lần chạy thật). Cách sửa đúng là gì?',
        options: [
          'Keep the vote, then count the candidate in a second pass; return it only if it appears more than n/2 times.|||Giữ vòng bỏ phiếu, rồi đếm ứng viên ở lượt thứ hai; chỉ trả về nếu nó xuất hiện hơn n/2 lần.',
          'Start the candidate at −1 so that "no majority" returns −1 automatically.|||Khởi tạo ứng viên bằng −1 để "không có đa số" tự trả về −1.',
          'Run the vote twice, left to right and right to left, and return the value if both agree.|||Chạy bỏ phiếu hai lần, trái sang phải và phải sang trái, trả về giá trị nếu cả hai trùng nhau.',
          'Sort first; the middle element is then guaranteed to be the majority.|||Sắp xếp trước; khi đó phần tử ở giữa chắc chắn là đa số.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Real output: vote([1,1,2,2,3]) = 3 and vote([3,3,4]) = 3. The vote always produces a candidate; it is the majority only IF one exists. A second O(n) pass with O(1) memory verifies it. Initialising to −1 (B) changes nothing about the last surviving candidate (and −1 can be a real value); sorting (D) also returns a middle element whether or not it is a majority (lesson 11.2).|||VI: Output thật: vote([1,1,2,2,3]) = 3 và vote([3,3,4]) = 3. Vòng bỏ phiếu luôn ra một ứng viên; nó là đa số chỉ KHI có đa số. Một lượt thứ hai O(n), bộ nhớ O(1) kiểm lại nó. Khởi tạo bằng −1 (B) không đổi gì ứng viên sống sót cuối cùng (và −1 có thể là giá trị thật); sắp xếp (D) cũng trả về phần tử giữa dù nó có phải đa số hay không (bài 11.2).',
      },
      {
        question: 'Building the answer string of LC 1249 in a loop. Measured: Java String += went from 275.7 ms to 971.6 ms when n doubled from 100,000 to 200,000; StringBuilder stayed under 1 ms; Node’s += stayed under 1 ms. What is the conclusion?|||Dựng chuỗi kết quả của LC 1249 trong vòng lặp. Số đo: String += của Java đi từ 275,7 ms lên 971,6 ms khi n gấp đôi từ 100.000 lên 200.000; StringBuilder luôn dưới 1 ms; += của Node luôn dưới 1 ms. Kết luận là gì?',
        options: [
          'The algorithm is O(n²) in every language; Node only hides it with a faster CPU path.|||Thuật toán là O(n²) ở mọi ngôn ngữ; Node chỉ che nó bằng đường CPU nhanh hơn.',
          'StringBuilder is faster only for very short strings; for long strings += wins.|||StringBuilder chỉ nhanh hơn với chuỗi rất ngắn; chuỗi dài thì += thắng.',
          'Java strings are immutable, so += copies everything each time (about ×4 per doubling); use StringBuilder. V8 concatenates with ropes.|||Chuỗi Java bất biến nên += chép lại mọi thứ mỗi lần (khoảng ×4 mỗi lần gấp đôi); dùng StringBuilder. V8 nối chuỗi bằng rope.',
          'The slowdown is the garbage collector; calling System.gc() before the loop fixes it.|||Chậm là do bộ thu gom rác; gọi System.gc() trước vòng lặp là sửa được.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Real output: n=100,000 String += 275.7 ms, n=200,000 971.6 ms (×3.5, close to the ×4 of n²), StringBuilder 0.33–0.40 ms; Node string += 0.45–0.95 ms. The cost belongs to the language’s string representation, not to the algorithm: V8 builds a rope and flattens once. Know the costs of the language you interview in (lesson 11.2).|||VI: Output thật: n=100,000 String += 275,7 ms, n=200,000 971,6 ms (×3,5, gần mức ×4 của n²), StringBuilder 0,33–0,40 ms; Node string += 0,45–0,95 ms. Chi phí nằm ở cách ngôn ngữ biểu diễn chuỗi, không ở thuật toán: V8 dựng rope rồi làm phẳng một lần. Biết chi phí của chính ngôn ngữ bạn phỏng vấn (bài 11.2).',
      },
      {
        question: 'Review ladder 1 · 3 · 7 · 14 days. LC 15 was first solved on 21 November and every review passes. On which date is its last review before it graduates (real run of lich-on.ts)?|||Thang ôn 1 · 3 · 7 · 14 ngày. LC 15 giải được lần đầu ngày 21/11 và lần ôn nào cũng đạt. Lần ôn cuối trước khi "tốt nghiệp" rơi vào ngày nào (lần chạy thật của lich-on.ts)?',
        options: [
          '5 December — 14 days after the first solve.|||5/12 — 14 ngày sau lần giải đầu.',
          '12 December — three weeks after the first solve.|||12/12 — ba tuần sau lần giải đầu.',
          '21 December — exactly one month later.|||21/12 — đúng một tháng sau.',
          '16 December — 22/11, 25/11, 2/12, then 14 days later.|||16/12 — 22/11, 25/11, 2/12, rồi 14 ngày sau đó.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Real output: 2026-11-22 (+1), 2026-11-25 (+3), 2026-12-02 (+7), 2026-12-16 (+14), then "graduated". Each interval counts from the previous review, not from the first solve: 1 + 3 + 7 + 14 = 25 days. Option A is the common mistake of counting every interval from day 0 (lesson 11.1).|||VI: Output thật: 2026-11-22 (+1), 2026-11-25 (+3), 2026-12-02 (+7), 2026-12-16 (+14), rồi "graduated". Mỗi khoảng tính từ lần ôn trước, không tính từ lần giải đầu: 1 + 3 + 7 + 14 = 25 ngày. Phương án A là lỗi hay gặp: tính mọi khoảng từ ngày 0 (bài 11.1).',
      },
      {
        question: 'Mock interview scores: Communication 4, Problem solving 4, Technical competency 3, Testing 2; problem 1 has working code. Using the course’s verdict rules, the verdict is:|||Điểm buổi phỏng vấn thử: Giao tiếp 4, Giải quyết vấn đề 4, Code 3, Kiểm thử 2; đề 1 có code chạy được. Theo luật kết luận của khoá, kết luận là:',
        options: [
          'Hire — the total is 13, above the 12 needed.|||Hire — tổng là 13, trên mức 12 cần có.',
          'Lean hire — exactly one axis is 2 and the other three are at least 3.|||Lean hire — đúng một trục bị 2 và ba trục còn lại ít nhất 3.',
          'No hire — any axis below 3 rules out an offer.|||No hire — bất kỳ trục nào dưới 3 đều loại khỏi offer.',
          'Strong hire — two axes at 4 outweigh one weak axis.|||Strong hire — hai trục điểm 4 bù được một trục yếu.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The rules (lesson 11.2): Hire = every axis ≥ 3; Lean hire = exactly one axis at 2, others ≥ 3, problem 1 working; No hire = any 1, or two or more 2s, or problem 1 never ran. The total is deliberately not the rule — a strong axis does not average away a weak one (A and D). One 2 is Lean hire, not No hire (C). The fix for this candidate is lesson 10.3.|||VI: Luật (bài 11.2): Hire = mọi trục ≥ 3; Lean hire = đúng một trục bằng 2, các trục khác ≥ 3, đề 1 chạy được; No hire = có trục 1, hoặc từ hai trục 2 trở lên, hoặc đề 1 chưa từng chạy. Tổng điểm cố ý không phải là luật — trục mạnh không "trung bình" xoá được trục yếu (A và D). Một trục 2 là Lean hire, chưa tới No hire (C). Bài chữa cho ứng viên này là 10.3.',
      },
      {
        question: 'Another session: Communication 3, Problem solving 2, Technical competency 3, Testing 2; both problems have working code. The verdict and the first lesson to study are:|||Một buổi khác: Giao tiếp 3, Giải quyết vấn đề 2, Code 3, Kiểm thử 2; cả hai đề đều có code chạy được. Kết luận và bài nên học đầu tiên là:',
        options: [
          'Lean hire, because both problems run; study nothing new, just do more problems.|||Lean hire, vì cả hai đề đều chạy; không cần học gì mới, chỉ cần làm thêm đề.',
          'Hire, because working code on both problems overrides the axis scores.|||Hire, vì code chạy được ở cả hai đề vượt lên trên điểm các trục.',
          'Lean hire, since the total is exactly 10; re-read lesson 10.2 on clean code.|||Lean hire, vì tổng đúng bằng 10; đọc lại bài 10.2 về code sạch.',
          'No hire, because two axes are at 2; work on testing (10.3) and on recognising patterns (0.2, 11.5 table).|||No hire, vì hai trục bị 2; luyện kiểm thử (10.3) và nhận diện mẫu (0.2, bảng ở 11.5).',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Two axes at 2 is No hire regardless of working code (lesson 11.2). The useful part is the second half: map each weak axis to its fixing lesson (table in 11.5) — problem solving at 2 means hints were needed (framework 0.2, pattern signals), testing at 2 means only the given example was traced (10.3). Clean code (C) was already at 3.|||VI: Hai trục bị 2 là No hire bất kể code chạy được (bài 11.2). Phần có ích là nửa sau: ghép mỗi trục yếu với bài chữa của nó (bảng ở 11.5) — giải quyết vấn đề 2 nghĩa là phải cần gợi ý (khung 0.2, dấu hiệu nhận mẫu), kiểm thử 2 nghĩa là chỉ chạy tay ví dụ của đề (10.3). Code sạch (C) đã đạt 3 rồi.',
      },
      {
        question: 'Minute 30 of a Hard problem. You have a correct O(n²) DP in your head and suspect an O(n log n) version, but you do not see how yet. Nothing is coded. Best move?|||Phút 30 của một đề Hard. Bạn đã có trong đầu một DP O(n²) đúng và ngờ là có bản O(n log n), nhưng chưa thấy cách. Chưa code dòng nào. Nước đi tốt nhất?',
        options: [
          'Say so, code the O(n²) version, name the bottleneck line, then try to speed up that line if time remains.|||Nói rõ như vậy, code bản O(n²), gọi tên dòng nút thắt, rồi còn giờ thì thử tăng tốc đúng dòng đó.',
          'Keep thinking silently until the O(n log n) idea arrives; a slower solution scores zero on a Hard.|||Tiếp tục im lặng suy nghĩ tới khi ý O(n log n) tới; lời giải chậm hơn được 0 điểm ở đề Hard.',
          'Ask the interviewer directly for the optimal solution so you can code it.|||Hỏi thẳng người phỏng vấn lời giải tối ưu để code.',
          'Switch to the brute force over all subsets, because it is the simplest to code.|||Chuyển sang vét cạn mọi tập con, vì nó dễ code nhất.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The partial-credit ladder of lesson 11.4: brute force said → correct polynomial solution coded → bottleneck named → optimal. A correct O(n²) with "this backward scan is a search over sorted ends" earns most of the problem-solving credit and gives the interviewer something to score. Silence (B) is the worst outcome; asking for the answer (C) is not asking for a hint; dropping to exponential (D) throws away the DP you already have.|||VI: Cái thang điểm từng phần của bài 11.4: nói vét cạn → code lời giải đa thức đúng → gọi tên nút thắt → tối ưu. Một bản O(n²) đúng kèm câu "phép quét lùi này là một phép tìm trên các giờ kết thúc đã sắp" lấy được phần lớn điểm giải quyết vấn đề và cho người phỏng vấn thứ để chấm. Im lặng (B) là kết cục tệ nhất; xin đáp án (C) không phải xin gợi ý; lùi về hàm mũ (D) vứt đi cái DP bạn đã có.',
      },
      {
        question: 'A "recruiter" on Telegram offers you an internship after a 10-minute chat and asks for a 2,000,000 VND laptop deposit plus a photo of your ID card before you start. What do you do?|||Một "nhà tuyển dụng" trên Telegram mời bạn thực tập sau 10 phút nói chuyện và đòi cọc 2.000.000 đồng tiền laptop kèm ảnh CCCD trước khi đi làm. Bạn làm gì?',
        options: [
          'Pay the deposit but not the ID photo, since deposits are normal for company equipment.|||Đóng cọc nhưng không gửi ảnh CCCD, vì cọc thiết bị công ty là bình thường.',
          'Send the ID photo but not the money, since ID is needed for the contract anyway.|||Gửi ảnh CCCD nhưng không gửi tiền, vì đằng nào hợp đồng cũng cần CCCD.',
          'Pay nothing and send nothing; verify through the company’s official site and phone, and report the account.|||Không đóng tiền, không gửi gì; xác minh qua website và số điện thoại chính thức của công ty, và báo cáo tài khoản đó.',
          'Ask for a smaller deposit to test whether they are honest.|||Xin đóng cọc ít hơn để thử xem họ có thật không.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Four red flags at once (lesson 11.5): money requested, an offer without a real interview, a chat app instead of a company email, ID before a signed contract. Real employers pay you; they never charge you to start, and an ID photo plus bank details is what is needed to open accounts in your name. A "small test deposit" (D) is exactly how task scams start. Verify through channels you find yourself, not those in the message.|||VI: Bốn cờ đỏ cùng lúc (bài 11.5): đòi tiền, offer không qua phỏng vấn thật, dùng ứng dụng chat thay vì email công ty, đòi CCCD trước khi ký hợp đồng. Nhà tuyển dụng thật trả tiền cho bạn; họ không bao giờ thu tiền để bạn bắt đầu, và ảnh CCCD cộng thông tin ngân hàng là thứ cần để mở tài khoản đứng tên bạn. "Cọc thử ít thôi" (D) chính là cách lừa đảo nhiệm vụ bắt đầu. Xác minh qua kênh do bạn tự tìm, không qua kênh trong tin nhắn.',
      },
    ],
  },
};
