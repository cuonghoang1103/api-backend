/** 4.5 — Quiz Chương 4. Mọi output nhắc trong câu hỏi lấy từ lần chạy thật trong ../ma/ch04 (xem _tien-do/ch04.md). */
export default {
  title: '4.5 — Chapter 4 quiz: binary search|||4.5 — Quiz Chương 4: tìm kiếm nhị phân',
  slug: 'dsa-4-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống thật về tìm nhị phân: đọc mã đoán output, lỗi lệch một, tràn số Java/JS, mảng xoay có trùng, tìm đỉnh, chọn mẫu cho đề lạ, lớn nhất của nhỏ nhất và git bisect.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Chapter 4 quiz: binary search</h2>
<p class="lead">Ten questions taken from situations you will actually meet: reading a loop and predicting what it prints, a submission that times out for a reason you cannot see, a constraint that should make you choose a pattern, and the follow-up questions interviewers ask after your code passes. Every output quoted in a question came from running the chapter’s real programs. 15 minutes.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write <code>firstTrue(lo, hi, ok)</code> from memory and state its invariant.</li>
<li>I can turn "first ≥", "first &gt;", "last ≤" and "largest such that" into one template call.</li>
<li>I can explain why <code>(lo + hi) / 2</code> breaks in Java and <code>(lo + hi) &gt;&gt; 1</code> breaks in JavaScript.</li>
<li>I can find the minimum of a rotated array and say why duplicates force O(n).</li>
<li>I can recognise "minimum x such that…" and write the four steps of binary search on the answer.</li>
<li>I can explain what <code>git bisect</code> does in terms of an F…F T…T row.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Quiz</span>
<h2>Quiz Chương 4: tìm kiếm nhị phân</h2>
<p class="lead">Mười câu lấy từ những tình huống bạn sẽ gặp thật: đọc một vòng lặp và đoán nó in gì, một lượt nộp bị quá giờ vì lý do không nhìn thấy, một ràng buộc lẽ ra phải khiến bạn chọn đúng mẫu, và những câu hỏi nối tiếp người phỏng vấn đặt ra sau khi code của bạn đã chạy. Mọi output nhắc trong câu hỏi đều lấy từ lần chạy thật các chương trình của chương. 15 phút.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được <code>firstTrue(lo, hi, ok)</code> không cần nhìn và nói được bất biến của nó.</li>
<li>Tôi biến được "đầu tiên ≥", "đầu tiên &gt;", "cuối cùng ≤" và "lớn nhất sao cho" thành một lần gọi khuôn.</li>
<li>Tôi giải thích được vì sao <code>(lo + hi) / 2</code> hỏng trong Java và <code>(lo + hi) &gt;&gt; 1</code> hỏng trong JavaScript.</li>
<li>Tôi tìm được phần tử nhỏ nhất của mảng xoay và nói được vì sao có trùng thì buộc phải O(n).</li>
<li>Tôi nhận ra "x nhỏ nhất sao cho…" và viết được bốn bước tìm nhị phân trên đáp án.</li>
<li>Tôi giải thích được <code>git bisect</code> làm gì bằng ngôn ngữ hàng F…F T…T.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'With the template (half-open [lo, hi), T ⇒ hi = mid, F ⇒ lo = mid + 1), a = [1, 3, 3, 3, 5, 8, 8, 10]. What are lowerBound(a, 4) and upperBound(a, 4)?|||Với khuôn (nửa mở [lo, hi), T ⇒ hi = mid, F ⇒ lo = mid + 1), a = [1, 3, 3, 3, 5, 8, 8, 10]. lowerBound(a, 4) và upperBound(a, 4) là bao nhiêu?',
        options: [
          'lowerBound = 4, upperBound = 4',
          'lowerBound = 3, upperBound = 4',
          'lowerBound = −1, upperBound = −1',
          'lowerBound = 4, upperBound = 5',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: 4 is absent, so "first a[i] ≥ 4" and "first a[i] > 4" are the same slot: index 4, between the last 3 and the 5 (the real run printed lowerBound=4 upperBound=4 count=0). The tempting "3 and 4" treats lowerBound as "last element < x" — that is lowerBound − 1. Bounds never return −1: they return an insert position.|||VI: 4 không có mặt, nên "a[i] ≥ 4 đầu tiên" và "a[i] > 4 đầu tiên" là cùng một ô: chỉ số 4, giữa số 3 cuối và số 5 (lần chạy thật in lowerBound=4 upperBound=4 count=0). Phương án hấp dẫn "3 và 4" coi lowerBound là "phần tử cuối < x" — thứ đó là lowerBound − 1. Hai cận không bao giờ trả −1: chúng trả vị trí chèn.',
      },
      {
        question: 'A classmate wrote the template but typed "else lo = mid" instead of "else lo = mid + 1". On a = [1, 3, 5, 6] searching the first a[i] ≥ 7, what happens?|||Một bạn cùng lớp viết khuôn nhưng gõ "else lo = mid" thay vì "else lo = mid + 1". Trên a = [1, 3, 5, 6], tìm a[i] ≥ 7 đầu tiên, chuyện gì xảy ra?',
        options: [
          'It returns 3, an off-by-one answer|||Nó trả về 3, lệch một đơn vị',
          'It returns 4, the correct answer|||Nó trả về 4, đúng đáp án',
          'It never stops: lo stays 3 and hi stays 4|||Nó không bao giờ dừng: lo kẹt ở 3 và hi kẹt ở 4',
          'It reads a[4] and throws out of bounds|||Nó đọc a[4] và ném lỗi ra ngoài mảng',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: With lo = 3, hi = 4 the mid rounds down to 3, a[3] = 6 is F, and "lo = mid" sets lo to 3 again — the range never shrinks (the real run printed STUCK (lo=3, hi=4)). "Returns 4" is tempting because the same bug happens to work for x = 0; it does not for x = 7. Reading a[4] is a different bug (mid rounding up).|||VI: Với lo = 3, hi = 4, mid làm tròn xuống thành 3, a[3] = 6 là F, và "lo = mid" lại gán lo bằng 3 — đoạn không bao giờ co lại (lần chạy thật in STUCK (lo=3, hi=4)). "Trả về 4" hấp dẫn vì cùng lỗi đó tình cờ đúng với x = 0; với x = 7 thì không. Đọc a[4] là một lỗi khác (mid làm tròn lên).',
      },
      {
        question: 'In TypeScript, lo = 1,500,000,000 and hi = 2,000,000,000. Which way of computing mid gives a WRONG value?|||Trong TypeScript, lo = 1.500.000.000 và hi = 2.000.000.000. Cách tính mid nào cho giá trị SAI?',
        options: [
          'lo + Math.floor((hi − lo) / 2)',
          '(lo + hi) >>> 1',
          'Math.floor((lo + hi) / 2)',
          '(lo + hi) >> 1',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: ">>" first converts its operand to a 32-bit SIGNED integer; 3,500,000,000 wraps and the real run printed −397483648. The tempting answer is "Math.floor((lo + hi) / 2)" because it looks like the Java bug — but JS numbers are doubles, exact up to 2^53, so it prints 1750000000. ">>> 1" reads the bits as unsigned and is also correct.|||VI: ">>" đổi toán hạng sang số nguyên 32 bit CÓ DẤU trước; 3.500.000.000 quay vòng và lần chạy thật in −397483648. Phương án hấp dẫn là "Math.floor((lo + hi) / 2)" vì trông giống bug Java — nhưng số JS là double, chính xác tới 2^53, nên nó in 1750000000. ">>> 1" đọc các bit như số không dấu và cũng đúng.',
      },
      {
        question: 'Your Java solution of First Bad Version uses mid = (lo + hi) / 2. It passes the examples, then fails on n = 2,147,483,647 with first bad version 2,000,000,000. What does LeetCode most likely report, and why?|||Lời giải Java bài First Bad Version của bạn dùng mid = (lo + hi) / 2. Nó qua các ví dụ, rồi hỏng với n = 2.147.483.647 và phiên bản lỗi đầu tiên 2.000.000.000. LeetCode nhiều khả năng báo gì, và vì sao?',
        options: [
          'Wrong Answer: it returns a negative version number|||Wrong Answer: nó trả về một số phiên bản âm',
          'Time Limit Exceeded: lo jumps between negative and positive values and never converges|||Time Limit Exceeded: lo nhảy qua lại giữa số âm và số dương, không bao giờ hội tụ',
          'Accepted: Java detects the overflow and widens to long|||Accepted: Java tự phát hiện tràn số và nới sang long',
          'Runtime Error: Java throws ArithmeticException on overflow|||Runtime Error: Java ném ArithmeticException khi tràn số',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: 1 + 2,147,483,647 wraps to a negative sum, mid is negative, isBadVersion says false, lo = mid + 1 becomes negative; the next sum is positive again… The real run printed STUCK after 100 loops (lo=715827883, hi=2147483647). Java int arithmetic never throws on overflow (only division by zero does), so "Runtime Error" is wrong; the loop does not end, so there is no wrong value to return.|||VI: 1 + 2.147.483.647 quay vòng thành tổng âm, mid âm, isBadVersion trả false, lo = mid + 1 thành âm; tổng lần sau lại dương… Lần chạy thật in STUCK sau 100 vòng (lo=715827883, hi=2147483647). Số học int của Java không bao giờ ném lỗi khi tràn (chỉ chia cho 0 mới ném), nên "Runtime Error" sai; vòng lặp không kết thúc nên cũng không có giá trị sai nào được trả về.',
      },
      {
        question: 'You find the minimum of a rotated array with firstTrue(0, n, i ⇒ a[i] ≤ a[n − 1]). The input is [1, 1, 1, 0, 1, 1]. What does it return?|||Bạn tìm phần tử nhỏ nhất của mảng xoay bằng firstTrue(0, n, i ⇒ a[i] ≤ a[n − 1]). Đầu vào là [1, 1, 1, 0, 1, 1]. Nó trả về gì?',
        options: [
          'Index 3 (value 0): the comparison with the last element still works|||Chỉ số 3 (giá trị 0): so với phần tử cuối vẫn đúng',
          'Index 0 (value 1): every element is ≤ 1, so the row is all T|||Chỉ số 0 (giá trị 1): mọi phần tử đều ≤ 1, nên hàng toàn T',
          'It loops forever because the row is not monotone|||Nó lặp mãi vì hàng không đơn điệu',
          'Index 5 (value 1): ties make it move right|||Chỉ số 5 (giá trị 1): giá trị bằng nhau làm nó dời sang phải',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The last element is 1 and every element is ≤ 1, so the F/T row is TTTTTT and the first T is index 0 — the real run printed "naive template -> index 0, value 1 (WRONG, min is 0)". It does not loop: the template always terminates, it just finds a boundary of a wrong row. The fix trims trailing copies of a[0] first, and the worst case becomes O(n).|||VI: Phần tử cuối là 1 và mọi phần tử đều ≤ 1, nên hàng F/T là TTTTTT và T đầu tiên là chỉ số 0 — lần chạy thật in "naive template -> index 0, value 1 (WRONG, min is 0)". Nó không lặp mãi: khuôn luôn dừng, nó chỉ tìm ra ranh giới của một hàng sai. Cách sửa là cắt các bản sao của a[0] ở cuối trước, và trường hợp xấu nhất thành O(n).',
      },
      {
        question: 'New problem: n ≤ 10^5 assignments must be done in the given order over k days; one day’s total hours must not exceed X. Find the smallest X. Which plan fits?|||Đề mới: n ≤ 10^5 bài tập phải làm theo đúng thứ tự trong k ngày; tổng số giờ mỗi ngày không được vượt X. Tìm X nhỏ nhất. Kế hoạch nào phù hợp?',
        options: [
          'Binary search X in [max task, total], check by greedily counting days: O(n log total)|||Tìm nhị phân X trong [bài lớn nhất, tổng], kiểm bằng đếm ngày tham lam: O(n log tổng)',
          'Sort the tasks by hours, then two pointers from both ends: O(n log n)|||Sắp các bài theo số giờ, rồi hai con trỏ từ hai đầu: O(n log n)',
          'DP over (task, day) taking the best split each time: O(n² · k)|||Quy hoạch động theo (bài, ngày) lấy cách chia tốt nhất mỗi lần: O(n² · k)',
          'Use a max-heap to always give the next day the largest remaining task|||Dùng max-heap để luôn giao bài còn lại lớn nhất cho ngày tiếp theo',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: "Smallest X such that it fits in k days" + "given order" is LC 1011 / LC 410: a bigger X never needs more days (monotone), and a greedy pass checks one X in O(n). Sorting or a heap breaks the required order, so those plans solve a different problem. The DP is correct but O(n²k) is far too slow for n = 10^5.|||VI: "X nhỏ nhất để vừa k ngày" + "đúng thứ tự" là LC 1011 / LC 410: X lớn hơn không bao giờ cần nhiều ngày hơn (đơn điệu), và một lượt tham lam kiểm một X trong O(n). Sắp xếp hay dùng heap phá thứ tự bắt buộc, nên là giải một bài khác. Quy hoạch động thì đúng nhưng O(n²k) quá chậm với n = 10^5.',
      },
      {
        question: 'Your findPeakElement returns index 5 on [2, 4, 3, 1, 5, 7, 6]. The interviewer asks: "So it returns the maximum of the array?" Best answer?|||findPeakElement của bạn trả về chỉ số 5 trên [2, 4, 3, 1, 5, 7, 6]. Người phỏng vấn hỏi: "Vậy nó trả về phần tử lớn nhất của mảng?" Câu trả lời tốt nhất?',
        options: [
          'Yes: walking uphill always ends at the global maximum|||Đúng: leo dốc thì luôn dừng ở cực đại toàn cục',
          'Yes, but only if the array has no duplicates|||Đúng, nhưng chỉ khi mảng không có phần tử trùng',
          'No: it returns the first peak from the left, index 1|||Không: nó trả về đỉnh đầu tiên tính từ trái, chỉ số 1',
          'No: it returns some peak; the global maximum needs O(n) in general|||Không: nó trả về một đỉnh nào đó; cực đại toàn cục nói chung cần O(n)',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Here 7 happens to be both a peak and the maximum, but 4 at index 1 is also a peak; on another array the search can end on a smaller peak. Any cell you did not read could hold a bigger value, so the global maximum of an arbitrary array needs O(n). It also does not return "the first peak": it returns whichever F→T boundary the halving reaches (here 5, not 1).|||VI: Ở đây 7 tình cờ vừa là đỉnh vừa là lớn nhất, nhưng 4 ở chỉ số 1 cũng là đỉnh; với mảng khác phép tìm có thể dừng ở một đỉnh nhỏ hơn. Ô nào chưa đọc cũng có thể chứa giá trị lớn hơn, nên cực đại toàn cục của mảng bất kỳ cần O(n). Nó cũng không trả "đỉnh đầu tiên": nó trả về ranh giới F→T mà phép chia đôi chạm tới (ở đây là 5, không phải 1).',
      },
      {
        question: 'A matrix has each row sorted left to right and each column sorted top to bottom, nothing more. Read row by row it is [1,5,9,14,3,6,11,17,…]. Best way to search a target?|||Một ma trận có mỗi hàng sắp từ trái sang phải và mỗi cột sắp từ trên xuống, không hơn. Đọc theo hàng nó là [1,5,9,14,3,6,11,17,…]. Cách tốt nhất để tìm một target?',
        options: [
          'One binary search over all m·n cells using index k ↔ (k / n, k % n)|||Một lần tìm nhị phân trên cả m·n ô dùng chỉ số k ↔ (k / n, k % n)',
          'Binary search the first column, then binary search one row|||Tìm nhị phân cột đầu, rồi tìm nhị phân một hàng',
          'Staircase walk from the top-right corner, dropping a row or a column each step: O(m + n)|||Đi bậc thang từ góc trên phải, mỗi bước bỏ một hàng hoặc một cột: O(m + n)',
          'Copy all cells into a hash set first, then look the target up in O(1)|||Chép mọi ô vào một hash set trước, rồi tra target trong O(1)',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Read row by row the cells are not sorted (14 is followed by 3), so the LC 74 index trick searches a non-monotone row and can miss the target. The first-column trick fails for the same reason: the target may be in any row whose first element is ≤ it. From the top-right, a bigger cell rules out its whole column below and a smaller one its whole row to the left — the real run needed 4–7 steps on 16 cells. A hash set costs O(m·n) time and memory just to build.|||VI: Đọc theo hàng thì các ô không có thứ tự (sau 14 là 3), nên mẹo chỉ số của LC 74 tìm trên một hàng không đơn điệu và có thể bỏ sót target. Mẹo cột đầu hỏng vì cùng lý do: target có thể nằm ở bất kỳ hàng nào có phần tử đầu ≤ nó. Từ góc trên phải, ô lớn hơn loại cả cột bên dưới còn ô nhỏ hơn loại cả hàng bên trái — lần chạy thật cần 4–7 bước trên 16 ô. Hash set tốn O(m·n) thời gian lẫn bộ nhớ chỉ để dựng.',
      },
      {
        question: 'LC 1552 (maximise the minimum gap). canPlace(g) is true for small g and false for large g. With the template, which expression returns the answer?|||LC 1552 (làm lớn nhất khoảng cách nhỏ nhất). canPlace(g) đúng với g nhỏ và sai với g lớn. Với khuôn, biểu thức nào trả về đáp án?',
        options: [
          'firstTrue(1, span + 1, g ⇒ !canPlace(g)) − 1',
          'firstTrue(1, span + 1, g ⇒ canPlace(g))',
          'firstTrue(1, span + 1, g ⇒ !canPlace(g))',
          'firstTrue(1, span + 1, g ⇒ canPlace(g)) − 1',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: canPlace is T…T F…F, so the template must be given the opposite question "is g impossible?" (F…F T…T); its first T is the smallest impossible gap and the answer is one less (positions [2, 3, 5, 9, 10] with m = 3 gave 3). Without "− 1" you return the first impossible gap — off by one. Passing canPlace directly is not monotone in the required direction: its first T is 1.|||VI: canPlace có dạng T…T F…F, nên phải đưa cho khuôn câu hỏi ngược "g có bất khả thi không?" (F…F T…T); T đầu tiên của nó là khoảng cách bất khả thi nhỏ nhất và đáp án nhỏ hơn một (vị trí [2, 3, 5, 9, 10] với m = 3 cho ra 3). Thiếu "− 1" là trả về khoảng cách bất khả thi đầu tiên — lệch một. Đưa thẳng canPlace thì không đơn điệu đúng chiều: T đầu tiên của nó là 1.',
      },
      {
        question: 'A test broke somewhere in the last 100 commits (commit #1 good, #100 bad; the bug landed in #73). With git bisect run and a test script, about how many test runs does Git need?|||Một test bị hỏng ở đâu đó trong 100 commit gần nhất (commit #1 tốt, #100 lỗi; bug nằm ở #73). Với git bisect run và một script test, Git cần khoảng bao nhiêu lần chạy test?',
        options: [
          '72 — one per commit after #1|||72 — mỗi commit sau #1 một lần',
          '7 — about log₂ of the 98 candidates|||7 — khoảng log₂ của 98 commit ứng viên',
          '50 — half of the history|||50 — một nửa lịch sử',
          '100 — every commit has to be built once|||100 — commit nào cũng phải build một lần',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Bisect halves the candidates each run: the real run tested #50, #75, #62, #68, #71, #73, #72 — 7 runs — and Git announced "roughly 6 steps" at the start. 72 is the linear walk from #2 to #73. "Half of the history" confuses the first step (checking #50) with the total.|||VI: Bisect chia đôi số ứng viên sau mỗi lần chạy: lần chạy thật đã test #50, #75, #62, #68, #71, #73, #72 — 7 lần — và Git báo "roughly 6 steps" ngay từ đầu. 72 là đi tuyến tính từ #2 tới #73. "Một nửa lịch sử" nhầm bước đầu tiên (kiểm #50) với tổng số bước.',
      },
    ],
  },
};
